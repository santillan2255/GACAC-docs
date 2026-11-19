# 03 — Plan de construcción por olas y prompts para Cursor IA

> **Estado (DEC-118).** Mapa funcional **O0–O11**, **4.213 RF**, **174** bloques `PRO-O*` (**barrido GoodApps 19-11-2026** en cuerpos + §2.3–§2.5) y **4 PRO-GEN** en [`03-norma`](03-norma-ejecucion-goodapps.md). Residuos puntuales Connectia solo en notas históricas. Build: **PRO-GEN-01 → §5 + PRO-Ox-NN → PRO-GEN-04 → PR**; cierre: integración + **PRO-GEN-02**. Script: `_trabajo/barrido_plan_connectia_goodapps.py`.

| Campo | Valor |
|---|---|
| Versión | 1.2 (10-11-2026: incorpora los 9 RF y el RNF nuevos de DEC-093 a DEC-108, del contraste del documento externo `NucleoTransversal-Modelo`, y menciona esas decisiones en los prompts que cambian; ver §22). *Reemplazado (v1.1):* 1.1 (reemplaza la 1.0 del 04-11-2026: incorpora los 83 RF nuevos de las fases 1 a 3 de huecos, DEC-082 a DEC-087 y los cambios de ola de los anexos; ver §21). Corregida el 05-11-2026 con las inconsistencias detectadas por los entregables de análisis y diseño (ver §21.5) |
| Fecha | 10-11-2026 (antes 05-11-2026) |
| Estado | Archivo histórico (DEC-118). Deriva del maestro, del registro de decisiones y de la columna de ola de los RF de cada anexo. |
| Alcance | Olas O0 a O11 del sistema CoopApps, con **174** prompts `PRO-O*` (+ **4** `PRO-GEN` en `03-norma`) listos para pegar en Cursor IA (norma técnica: `03-norma-ejecucion-goodapps.md`) |
| Cobertura | 4.213 RF (antes 4.204; 9 RF nuevos de DEC-093 a DEC-108, §22; antes 4.203, RF-POR-180 nuevo en O2, cierre de la corrección de inconsistencias del 05-11-2026, §21.6) de 29 anexos con RF (T01–T04, T06–T11, M01–M19) asignados a una ola y a un prompt; 293 RNF asignados (antes 292; RNF-NFR-260, §22). Cero faltantes (§17). Recuento hecho leyendo las tablas de RF de los anexos el 10-11-2026 (antes 05-11-2026). *Reemplazado: "4.120 RF" de la versión 1.0.* |
| Documentos rectores | `00-ESPECIFICACION-MAESTRA.md` (prevalece), `01-registro-decisiones.md` (las DEC prevalecen sobre los anexos), `_GUIA-REDACCION-ANEXOS.md`, `02-preguntas-abiertas.md`, `05-registro-huecos.md`, `anexos/*` |
| Documentos en elaboración referenciados | `anexos/T05-DAT-modelo-datos.md` (modelo canónico de colecciones) y `04-matriz-trazabilidad.md` (fuente → anexo/ID y estado de implementación) |

> **Regla de uso.** Con la especificación (`docs/especificacion/`) y estos prompts, Cursor debe poder construir todo el sistema sin otra información. Cada prompt dice qué leer (por ruta, sección e ID), qué construir, qué no construir todavía, qué pruebas escribir, cuándo está terminado y cómo verificarlo. Si un prompt y un anexo se contradicen, prevalecen el maestro y las DEC; si se contradicen dos anexos, prevalece el anexo dueño del dato (maestro §12 y T05).

## Índice

0. Cómo está armado este plan
1. Resumen de olas, prompts y RF
2. Reglas comunes de ejecución con Cursor (R1–R20)
3. Prompts generales reutilizables (PRO-GEN)
4. O0 — Fundaciones
5. O1 — Plataforma, IAM, configuración y workflow
6. O2 — Personas, catálogo, landing, portal base, CRM de solicitudes y comunidad
7. O3 — Técnica del piloto Internet
8. O4 — Tarifas, facturación, ARCA e impuestos básicos
9. O5 — Cuenta corriente, cobranza, pasarelas, tesorería básica y núcleo contable
10. O6 — Mora, corte, reconexión, convenios: cierre del piloto Internet
11. O7 — Servicios medidos
12. O8 — ERP administrativo y contabilidad completa
13. O9 — Personal y sueldos
14. O10 — Institucional, servicios sociales, flota, telefonía, TV, fabricación, turnero
15. O11 — BI, APIs de terceros, migración repetible, paralelo y corte
16. Matriz ola × anexo (cantidad de RF)
17. Control de cobertura de RF y RNF
18. RF con ola ausente, inválida o reasignada
19. Contradicciones de olas detectadas (anexos frente a DEC y maestro)
20. Huecos abiertos de `05-registro-huecos.md` por ola
21. Cambios de la versión 1.1 (RF nuevos de huecos, DEC-082 a DEC-087 y cambios de ola; §21.6 cierre de la corrección de inconsistencias)
22. Cambios de la versión 1.2 (DEC-093 a DEC-108, 10-11-2026)

---

## 0. Cómo está armado este plan

1. **Fuente de las olas.** La ola de cada requisito sale de la columna `Ola` de la tabla de RF de su anexo (sección 5). Cuando la celda indica varias olas (por ejemplo `O3 (básicos) / O8 (completos)`), el RF se asigna a la **primera** ola, donde empieza su construcción, y se repite como **extensión** en las olas siguientes (cada sección de ola lo lista en "Extensiones de RF de olas anteriores").
2. **Reasignaciones.** Los RF sin ola válida, o cuya ola contradice una DEC, se reasignan y se marcan `[REASIGNADO]` con su fundamento en §18.
3. **Unidad de trabajo.** Un prompt construye un bloque coherente de RF de una o varias subsecciones de la sección 5 de un anexo, con su modelo (§7), estados (§8), procesos (§9), pantallas (§10), API (§11), eventos y jobs (§12), integraciones (§13), parámetros (§14), reportes (§15), casos de uso (§16), criterios y escenarios (§17) y precarga demo (§18) del mismo anexo.
4. **Pantallas, endpoints, eventos y jobs.** Los anexos no asignan ola a cada `PAN-`, `API-`, `EVT-` ni `JOB-` (salvo excepciones). La regla es: **cada artefacto se construye en el primer prompt que construye un RF que lo necesita**; el prompt lo lista en el PR. Para el piloto Internet (O2–O6) los IDs exactos de pantallas, eventos y jobs están en `anexos/T12-SRV-fichas-verticales-servicios-parte1.md` §1.3, §1.5 y §1.6, y cada prompt del piloto los cita.
5. **Colecciones.** El dueño de cada colección está en el maestro §12, en la sección 7 de cada anexo y en `anexos/T05-DAT-modelo-datos.md`. Un prompt solo crea colecciones del módulo que construye (ARQ-01).
6. **Conteos.** Los conteos de RF de este plan se obtuvieron recorriendo las tablas de RF de todos los anexos. Un RF cuenta una sola vez, en la ola donde empieza. Desde la corrección 05-11-2026, cada prompt lista en `IMPLEMENTAR` solo los RF que empiezan en él y en una línea aparte `EXTENSIONES` los RF de prompts anteriores (o la parte anticipada de un RF posterior) que amplía; lo de `EXTENSIONES` no se cuenta ni lo toma `trace:check` como implementación. El recuento se hace con `_trabajo/plan_recuento.py`.

---

## 1. Resumen de olas, prompts y RF

| Ola | Contenido | Hito de salida (demostrable) | Depende de | Prompts | RF (inicio en la ola) | RNF |
|---|---|---|---|---|---|---|
| O0 | Fundaciones: solución .NET+React, CI, tenancy, IAM base, outbox/colas Azure, bóveda, auditoría, Blob, PDF, design system, diccionario base, notificaciones base, `legalEntities` | Tenant demo con login, menú vacío filtrado por capability y suite de aislamiento verde en CI | — | 21 | 305 | 144 |
| O1 | Plataforma SaaS e IAM completos, configuración versionada, maestros, geografía, conexiones de integración, workflow de aprobaciones, expediente, reportes base, herramienta de migración base | Alta asistida de una cooperativa con usuarios, roles y configuración publicada | O0 | 20 | 459 (antes 458) | 73 (antes 72) |
| O2 | Personas y cuentas, catálogo de servicios, asociados mínimos, CRM de solicitudes, comunidad, landing, registro y portal base | Un socio se registra en la landing y solicita Internet; el contrato queda `requested` | O0, O1 | 19 | 617 (antes 614 y 613) | 15 |
| O3 | Técnica del piloto: factibilidad, agenda, OT, instalación, comodato, stock serializado, app de campo offline, aprovisionamiento, reclamos | El servicio queda instalado, con ONT en comodato y aprovisionamiento confirmado | O2 | 13 | 319 | 9 |
| O4 | Motor tarifario, facturación, ARCA, IVA e IIBB Córdoba, cargos por operación, adherentes mínimos | Primera factura electrónica con CAE (ESC-SRV-INT-01) | O3 | 16 | 425 (antes 424) | 23 |
| O5 | Cuenta corriente, caja, entes, débitos, pasarelas (DEC-015), tesorería básica (DEC-059), núcleo contable (DEC-009), capital mínimo (DEC-019) | Pago online imputado, rendido y asentado | O4 | 14 | 470 (antes 469) | 13 |
| O6 | Mora, suspensión, corte y reconexión, convenios, garantías, incobrables, IA de atención, omnicanal | **Piloto Internet completo de punta a punta** (DEC-005) | O5 | 11 | 244 | 2 |
| O7 | Servicios medidos: medición, lecturas, telemedición, prepago, tarifas medidas, reguladores, GIS y obras; migración de datos vigentes comerciales, corrida paralela, by-pass y corte comercial por servicio (DEC-089) | Facturación de energía con lecturas; herramientas de paralelo y corte comercial listas para electricidad, gas y prepago de la piloto (DEC-089) | O6 | 12 | 298 | 1 |
| O8 | ERP administrativo: compras, stock completo, tesorería completa, contabilidad completa, regímenes informativos, ventas, importación de sueldos externa | Cierre contable mensual | O5 (O7 recomendado) | 15 | 465 (antes 462) | 1 |
| O9 | Personal y sueldos | Liquidación mensual con F.931 y LSD, en paralelo dos períodos (DEC-058) | O8 | 9 | 163 | 0 |
| O10 | Institucional, servicios sociales, flota, telefonía, TV, fabricación, turnero, agente local, actividades | Asamblea y servicios sociales operativos | O8 (O9 para honorarios y legajos) | 14 | 383 | 6 |
| O11 | BI, generador de reportes, API de terceros, pasarelas restantes, migración repetible con históricos y corte administrativo (DEC-068; el paralelo, el by-pass y el corte comercial pasan a O7, DEC-089) | Corte administrativo y apagado de ProCoop en una cooperativa (DEC-089; antes "Corte comercial y luego corte administrativo de ProCoop en una cooperativa") | O0–O10 | 8 | 65 | 6 |
| **Total** | | | | **174** (*tabla histórica decía 172; DEC-089 O7/O11*) | **4.213** (antes 4.204 y 4.203) | **293** (antes 292) |

Además hay 3 prompts generales reutilizables (§3): arranque de sesión, cierre de ola y corrección.

*Reemplazado (versión 1.0): RF por ola O0 299, O1 457, O2 607, O3 315, O4 419, O5 463, O6 241, O7 256, O8 454, O9 161, O10 360, O11 88; total 4.120. Los 83 RF nuevos y los cambios de ola están en §21.*

*Reemplazado (DEC-089, 05-11-2026): O7 10 prompts, 274 RF y 0 RNF; O11 10 prompts, 89 RF y 7 RNF. El corte comercial de electricidad, gas y prepago de la piloto ocurre al cerrar O7, así que pasan a O7 las herramientas de paralelo y corte y la migración de datos vigentes comerciales (24 RF y RNF-NFR-154, en los prompts nuevos PRO-O7-11 y PRO-O7-12, que reemplazan a PRO-O11-07 y PRO-O11-08). Los totales generales no cambian (174 bloques PRO-O, 4.213 RF, 293 RNF; recuento 19-11-2026). Detalle en §21.7.*

*Reemplazado (corrección 05-11-2026): O5 468 y O11 90 RF. RF-CON-160 (celda del anexo `O11 (O5 para saldos de apertura)`) empieza en O5 por la regla §0.1 y queda como extensión en O11. Las demás olas no cambian. Recuento por script (`_trabajo/plan_recuento.py`) leyendo las tablas de RF y RNF de los anexos y la línea `IMPLEMENTAR` de cada prompt (las líneas `EXTENSIONES` no cuentan): 4.203 RF y 292 RNF, cada uno en exactamente un prompt. Ver §21.5.*

*Reemplazado (cierre de la corrección de inconsistencias del 05-11-2026): O2 613 y total 4.203 RF. RF-POR-180 (M19, Comunidad en la tabbar del socio, O2) se agrega a PRO-O2-17; O2 queda en 614 y el total en 4.204 RF; RNF y prompts no cambian. Ver §21.6.*

*Reemplazado (versión 1.2, 10-11-2026): O1 458 RF y 72 RNF, O2 614, O4 424, O5 469 y O8 462; total 4.204 RF y 292 RNF. DEC-093 a DEC-108 agregan 9 RF y 1 RNF, todos en prompts existentes de la ola que indica su anexo: O1 suma RF-BIA-104 y RNF-NFR-260; O2, RF-PER-174, RF-PER-175 y RF-CRM-261; O4, RF-CAT-117; O5, RF-COB-195; O8, RF-FIS-169, RF-INS-109 y RF-CON-163. Prompts sin cambios (172). Ver §22.*

---

## 2. Reglas comunes de ejecución con Cursor (R1–R20)

Todo prompt de este plan exige cumplir estas reglas. Cada prompt las invoca por referencia ("Aplicá R1–R20 de 03-plan-de-olas-y-prompts.md §2"), así que Cursor debe leer esta sección al inicio de cada sesión.

### 2.1 Orden y alcance

| Regla | Contenido |
|---|---|
| R1 | **Una ola por vez.** No se empieza una ola hasta que la anterior cumple su criterio de salida y su prompt de integración (último de la ola) está verde. |
| R2 | **Prompts en orden.** Dentro de la ola, los prompts se ejecutan en el orden numérico. Un prompt puede depender de cualquiera anterior; nunca de uno posterior. |
| R3 | **Autocontenido.** Cada prompt dice qué leer. Cursor lee completo lo indicado antes de escribir código: el maestro §3, §5, §12 y §13; la guía §5; las DEC; y las secciones del anexo citadas. No lee anexos enteros si no se le piden (son grandes). |
| R4 | **Alcance cerrado.** Se implementan los RF listados en "Implementar", completos y con su criterio de aceptación (última columna de la tabla de RF del anexo), más las RN del anexo que esos RF necesitan (§6), y los PAN, API, EVT y JOB que esos RF requieren (§10–§12). Lo listado en "No construir todavía" no se construye, ni siquiera como borrador. |
| R5 | **RF de varias olas.** Si la celda de ola del RF lista varias olas, se implementa solo la parte de la ola actual y se deja el punto de extensión (interfaz, parámetro o estado) para la parte siguiente. En la matriz se marca `Parcial (Ox)`. |
| R6 | **No inventar.** Si falta un dato, se busca en el anexo dueño (maestro §12). Si sigue faltando, se agrega una PA nueva en `02-preguntas-abiertas.md` con el formato de la guía §9, se implementa la opción recomendada detrás de un parámetro y se avisa en el PR. |

### 2.2 Preguntas abiertas y huecos

| Regla | Contenido |
|---|---|
| R7 | **PA respondidas por DEC.** La DEC prevalece sobre el texto del anexo, aunque el anexo diga `A validar`. |
| R8 | **PA asumidas (DEC-072 y DEC-047).** Toda PA marcada `Asumida (DEC-072)` o todo RF en estado `A validar (PA-xxx)` se implementa con la **opción recomendada**, expuesta como parámetro tipado de T04 (`PRM-<COD>-NNN` del anexo, o uno nuevo declarado en el registro de parámetros) con default igual a la recomendada, de modo que cambiar la decisión sea cambiar configuración, no código. El PR lista las PA asumidas. |
| R9 | **Huecos abiertos (`05-registro-huecos.md`).** Antes de empezar, Cursor filtra los `HUE-` y `HUECO-` en estado `Abierto` cuyo anexo responsable o IDs afectados coinciden con el prompt (§20 de este plan los lista por ola). Implementa la **Propuesta** del hueco como comportamiento configurable (parámetro o bandera por tenant, con la propuesta como default), no elimina la alternativa y actualiza el estado del hueco a `Implementado según propuesta (PRO-Ox-NN)` en `05-registro-huecos.md`. |
| R10 | **Nombres de eventos.** Siempre el nombre canónico del productor (T11 §12). Los alias de consumidores (`HUECO-TRV-02`, `HUE-SRV-01`) se registran como alias en el catálogo de eventos (RF-WFL-015). Los eventos de M02 usan los IDs provisionales EVT-CAT-01..25 de T11 §12.3 (`HUECO-TRV-03`). |

### 2.3 Calidad, seguridad y datos

| Regla | Contenido |
|---|---|
| R11 | **Convenciones obligatorias** (maestro §13, guía §5, **DEC-111**): inglés camelCase en código y datos; UI con `dict:<clave>`; entidades con `TenantId`, auditoría y versión optimista; `LegalEntityId` en documentos económicos (DEC-064); dinero en **SQL DECIMAL(19,4)** y `decimal` en .NET (prohibido `double` para importes); fechas UTC y zona del tenant; capabilities `modulo.recurso.accion`; errores **ProblemDetails** RFC 9457 con `requestId`; `Idempotency-Key` en operaciones económicas e integraciones; eventos por **outbox SQL** en la misma transacción; procesos masivos en **worker** y colas Azure. |
| R12 | **Arquitectura** (ARQ-01..08): un módulo solo escribe sus **tablas** del esquema dueño; usa servicios públicos o eventos de otros módulos; integraciones solo por conectores T06 con secretos en la bóveda; la IA solo propone. |
| R13 | **Seguridad de datos.** Nunca pedir, escribir ni commitear credenciales reales, certificados reales, tokens ni datos personales reales. `.env.example` con nombres y valores ficticios. Conectores en modo `test` con el simulador de RF-INT-031; ARCA solo en homologación con certificado generado por la plataforma para pruebas (DEC-053). Datos demo con `isDemo: true`, DNI y CUIT ficticios (por ejemplo DNI 00000001, CUIT 30-99999991-0) y correos `@example.com`. |
| R14 | **Datos demo canónicos.** TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" y TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (T01 §18 y RNF-NFR-161), más el tenant `PLATFORM`. Cada prompt agrega la precarga ficticia de la sección 18 del anexo que construye. Donde un anexo usa otros nombres para los mismos tenants (M02 §18 y T12: "Cooperativa Demo Norte/Sur"), se usan los de T01 y se conservan los códigos de datos (INT-100, ONT-DEMO-0001, Ana Demo). |
| R15 | **Pruebas mínimas por prompt**: unitarias (xUnit); integración con **Azure SQL** de diseño o Testcontainers (WebApplicationFactory); permisos 403 por capability; aislamiento tenant (403/404); idempotencia; reintentos de jobs; e2e Playwright en React. Cada prueba cita el ID en el nombre. |
| R16 | **DoD común (GoodApps).** (1) RF con prueba automatizada citando ID. (2) Permisos y aislamiento verdes. (3) Sin textos fijos en UI. (4) Auditoría y eventos en cambios persistentes. (5) Contratos/OpenAPI y validación actualizados. (6) Seeds idempotentes; demo bloqueado en prod. (7) `dotnet build`, `dotnet test`, aislamiento y e2e del prompt en verde. (8) Matriz (R19). (9) PR plantilla R18 + **PRO-GEN-04**. |

### 2.4 Commits, PR y trazabilidad

| Regla | Contenido |
|---|---|
| R17 | **Rama y commits.** Una rama por prompt: `ola-Ox/PRO-Ox-NN-<slug>`. Commits Conventional Commits con el módulo y los IDs: `feat(per): personas y verificación fiscal [PRO-O2-03] RF-PER-001..015, 017..019, 021..028`. Nada de commits mezclando dos prompts. |
| R18 | **Un PR por prompt.** Título `PRO-Ox-NN <título>`. Cuerpo: RF implementados (completos o `Parcial (Ox)`); PAN, API, EVT y JOB construidos; colecciones creadas; parámetros declarados; PA asumidas (R8); huecos aplicados (R9); PA nuevas (R6); pruebas agregadas y resultado; capturas de pantalla con datos ficticios; riesgos pendientes. El PR no se fusiona si falla la suite de aislamiento (T08). |
| R19 | **Matriz de trazabilidad.** Al cerrar cada prompt, Cursor actualiza `docs/especificacion/04-matriz-trazabilidad.md`, sección "Estado de implementación" (si no existe, la crea al final del documento sin tocar el resto), con una fila por RF: `RF | Anexo | Ola | Prompt | Estado (Implementado / Parcial (Ox) / Bloqueado PA-xxx) | PR | Pruebas (archivos) | Fecha`. Además corre `python docs/especificacion/_trabajo/plan_recuento.py` (creado en PRO-O0-02), que falla si un RF del prompt no tiene prueba que lo cite o si una prueba cita un ID inexistente en la especificación. |
| R20 | **Cierre de ola.** El último prompt de cada ola (integración) corre el e2e completo de la ola y verifica que todos los RF de la ola estén `Implementado` o `Parcial` con la parte de la ola cumplida. Luego se ejecuta PRO-GEN-02. |

### 2.5 Scripts y comandos estándar (GoodApps; detalle en `03-norma-ejecucion-goodapps.md` §4)

| Objetivo | Comando / artefacto |
|---|---|
| Compilar | `dotnet build` |
| Unitarias | `dotnet test --filter Category=Unit` |
| Integración API + SQL | `dotnet test --filter Category=Integration` |
| Aislamiento multitenant | `dotnet test --filter Category=Isolation` |
| E2E ola | `playwright test --grep @Ox` |
| Trazabilidad RF ↔ pruebas | `python docs/especificacion/_trabajo/plan_recuento.py` (+ script CI acordado, PRO-O0-02) |
| Seeds demo | Herramienta `SeedDemo` idempotente; bloqueada en producción |
| Migración esquema | EF Core migrations + paridad con `07-ddl` en CI |
| Entorno local | `deploy/docker-compose.dev.yml` (API, Worker, SQL, storage emulado, React) |

*Reemplaza (Connectia 04-11-2026): scripts `npm run *` del monorepo Node — conservados solo como histórico en prompts no barridos.*

---

## 3. Prompts generales reutilizables (PRO-GEN)

### PRO-GEN-01 — Arranque de sesión de Cursor


> **Build GoodApps:** [`03-norma-ejecucion-goodapps.md`](03-norma-ejecucion-goodapps.md) §6 PRO-GEN-01. Bloque ```text Connectia **histórico** (barrido 19-11-2026).

```text
PRO-GEN-01 — Arranque de sesión
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Sos el equipo de desarrollo de CoopApps (SaaS multitenant para cooperativas de servicios argentinas que reemplaza ProCoop). Trabajás en el monorepo solución CoopApps (.NET 10 + React 19).
1. Leé completos: docs/especificacion/00-ESPECIFICACION-MAESTRA.md §3, §5, §6, §7.1, §12, §13, §16; docs/especificacion/_GUIA-REDACCION-ANEXOS.md §5; docs/especificacion/01-registro-decisiones.md; docs/especificacion/03-plan-de-olas-y-prompts.md §2 (reglas R1–R20) y la sección de la ola en curso.
2. Confirmá en una lista breve: ola en curso, último prompt cerrado (según 04-matriz-trazabilidad.md "Estado de implementación"), próximo prompt a ejecutar, y si el criterio de salida de la ola anterior está verde.
3. No escribas código en esta respuesta. Esperá el prompt PRO-Ox-NN siguiente.
```

### PRO-GEN-02 — Cierre de ola


> **Build GoodApps:** [`03-norma-ejecucion-goodapps.md`](03-norma-ejecucion-goodapps.md) §6 PRO-GEN-02. Bloque ```text Connectia **histórico** (barrido 19-11-2026).

```text
PRO-GEN-02 — Cierre de la ola Ox
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
1. Corré: dotnet restore, dotnet build, dotnet test, dotnet test --filter Category=Isolation, playwright test -- --grep @Ox, python docs/especificacion/_trabajo/plan_recuento.py.
2. Compará la lista de RF de la ola (sección de la ola, tabla "Alcance por anexo") con 04-matriz-trazabilidad.md "Estado de implementación". Informá: RF Implementado, RF Parcial (con la parte pendiente y la ola que la completa), RF faltantes. Si hay faltantes, no cierres la ola: generá la lista de tareas y detenete.
3. Verificá el criterio de salida de la ola con el escenario demostrable indicado y dejá evidencia (capturas con datos ficticios y salida de pruebas) en docs/evidencias/Ox/.
4. Revisá 05-registro-huecos.md: todo hueco de la ola debe quedar "Implementado según propuesta (PRO-...)" o con motivo de por qué sigue abierto.
5. Etiquetá el commit de cierre como ola-Ox-cerrada y actualizá el CHANGELOG.
No agregues funcionalidad nueva en este prompt.
```

### PRO-GEN-03 — Corrección dirigida


> **Build GoodApps:** [`03-norma-ejecucion-goodapps.md`](03-norma-ejecucion-goodapps.md) §6 PRO-GEN-03. Bloque ```text Connectia **histórico** (barrido 19-11-2026).

```text
PRO-GEN-03 — Corrección dirigida
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
Falla detectada: <pegar salida de la prueba o descripción del defecto con IDs RF/RN/ESC afectados>.
1. Leé el RF, la RN y el escenario citados en su anexo y el prompt PRO-Ox-NN que los construyó.
2. Escribí primero la prueba que reproduce la falla con el ID en el nombre; luego corregí.
3. No amplíes alcance. Si la corrección exige cambiar la especificación, registrá una PA nueva (R6) y detenete.
4. Actualizá la matriz (R19) y abrí PR "fix(<mod>): <resumen> [PRO-Ox-NN] <IDs>".
```

### PRO-GEN-04 — Control pre-PR (GoodApps)

> **Texto vigente** en [`03-norma-ejecucion-goodapps.md`](03-norma-ejecucion-goodapps.md) §4.1 (checklist C1–C12) y §6 (prompt pegable). Ejecutar **antes de abrir o mergear** el PR de cada `PRO-Ox-NN` y revalidar en **PRO-GEN-02** (muestreo de la ola). No sustituye **PRO-O0-02** ni `trace:check` / `plan_recuento.py`.

---

## 4. O0 — Fundaciones

### 4.1 Objetivo

Dejar el esqueleto técnico sobre el que se construyen todos los módulos: monorepo y monolito modular, CI con pruebas de aislamiento obligatorias, tenancy forzada, IAM básico, auditoría inmutable, outbox y jobs, bóveda de secretos (DEC-074), almacenamiento privado, motor PDF (DEC-080), configuración tipada, `legalEntities` (DEC-064), design system admin y PWA con sus shells, diccionario base y notificaciones base.

### 4.2 Criterio de salida (demostrable)

1. `docker compose` (o entorno local acordado) levanta API .NET, worker, shells React (admin/PWA/landing), Azure SQL (o contenedor), cola Azure emulada y almacenamiento Blob emulado + renderer PDF.
2. En TEN-001 un usuario staff ficticio entra por pre-login (`coop-ejemplo-a`), ve el AdminShell oscuro con menú vacío filtrado por capability y cierra sesión; el refresh rota.
3. Un usuario de TEN-002 recibe 404 al pedir un recurso de TEN-001; el plugin de tenancy lanza error si se consulta sin contexto.
4. Un cambio de prueba genera auditoría encadenada, evento en `pla.OutboxEvents` y job procesado una sola vez aunque se reintente.
5. Un PDF de prueba se genera desde plantilla HTML y se descarga por URL firmada; un secreto de prueba se guarda cifrado en la bóveda y nunca aparece en logs.
6. CI verde con lint, estructura, unitarias, integración, aislamiento, escaneo de secretos y humo e2e.

### 4.3 Dependencias

Ninguna. Es la primera ola.

### 4.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| T01 PLA | 52 | RF-PLA-001..028, 030, 032..034, 036..037, 095, 109..110, 113..114, 130, 133, 136..137, 139, 142..143, 146..147, 154..155, 161, 163 | RNF-PLA-001..010, 015; T01 §7.3–§7.10 | `tenants` (global), `jobRuns`, `storedFiles`, `outboxEvents` |
| T02 IAM | 29 | RF-IAM-001..003, 006..008, 020..021, 030, 032..036, 040..041, 045..046, 060..061, 110, 115, 130..134, 136, 139 | PAN-IAM de login y recuperación; API-IAM de sesión | `identities`, `memberships`, `users`, `sessions`, `auditLogs` |
| T03 UXD | 125 | RF-UXD-001..007, 009..019, 021, 025..027, 029, 035..036, 040..045, 047..050, 052..056, 058..071, 079, 081..085, 087..088, 090..093, 097..106, 108..110, 112..117, 123..135, 137..142, 144..147, 149..151, 155..160, 166, 168..169, 171..172, 175..176, 178 | Componentes de T03 §5.7; PAN-UXD de shells | `branding`, `dictionaryEntries`, `siteMapGroups` (declarativo), `userUiPreferences` |
| T04 CFG | 16 | RF-CFG-001..005, 007..009, 122..123 (v1.1: se agregan RF-CFG-134, 135, 136, 137, 138, 140) | Registro de parámetros como librería | `parameterDefinitions`, `legalEntities` (DEC-064) |
| T06 INT | 28 | RF-INT-001, 005, 015, 021, 030..037, 039..041, 044, 046..049, 052, 073, 078..080, 082..083, 085 | Bóveda DEC-074; simulador de conectores | `integrationProviders`, `integrationSecrets` (antes `vaultSecrets`, CTR-DAT-72), `integrationOperations`, `integrationLogs`, `externalReferences` |
| T07 MIG | 7 | RF-MIG-011, 016, 036..037, 041..042, 098 | Convenciones `legacy` | `legacyIdMap`, snapshots |
| T08 NFR | 4 | RF-NFR-020..022, 024 | RNF-NFR de O0 (144 en total con T01 y T11, ver §17) | — |
| T09 COM | 8 | RF-COM-138, 141, 145, 181, 200..203 | `notifKinds` | `appNotifications`, `notificationDeliveries` |
| T11 WFL | 36 | RF-WFL-001..009, 015..017, 020..022, 024..026, 040, 043, 150..154, 157, 159, 170..172, 175, 179, 185..188 | RNF-WFL-001, 004, 005 | `outboxEvents`, `eventTypes`, `jobDefinitions`, `jobSchedules`, `bulkRuns`, `operations`, `documents`, `documentTypes`, `documentTemplates`, `numberingSequences` |
| **Total** | **305** | | | |

Requisito derivado sin RF propio: **REQ-DEC-064** — colección `legalEntities` del tenant (equivalente a `EMPRESAS` de ProCoop) y campo `legalEntityId` obligatorio en el esquema base de todo documento económico desde O0. Ningún anexo tiene un RF para esto (ver §19, contradicción C-01); se construye en PRO-O0-13. *Reemplazado en v1.1:* REQ-DEC-064 queda cubierto por RF-CFG-134 a 138 y 140 de T04 (§7.14 a §7.15), con los nombres de T05: `legalEntities` (COL-CFG-41, datos legales en `fiscal.*` y entidad por defecto creada con el tenant), `branches` (COL-CFG-42) y `legalEntityId` obligatorio en las colecciones económicas por RF-CFG-136; `workstations` (COL-CFG-43, RF-CFG-141) llega en O1 y el perfil fiscal completo del emisor es `fiscalProfiles` de M06 (COL-FIS-04, RF-CFG-138 y RF-FIS-167) en O4. C-01 queda resuelta.

### 4.5 Fuera de la ola

Ciclo de vida de tenants, licencias y alta asistida (O1); 2FA, Google, CiDi y roles editables (O1); configuración versionada y publicación (O1); pantallas de conexiones (O1); cualquier módulo de dominio (O2+).

### 4.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Fugas entre tenants por consultas sin filtro | Plugin que lanza error sin contexto, lista blanca de colecciones globales y suite de aislamiento que bloquea el merge (RF-PLA-020, 023, 034) |
| Deuda en el design system que obliga a rehacer pantallas | Componentes molde y reglas UX completos en O0 (PRO-O0-14 a 16) |
| Secretos en el repositorio | Escaneo de secretos en CI que bloquea el merge (RF-INT-083) y bóveda desde el inicio |
| PDF no reproducible | Chromium sin interfaz en worker dedicado con fuentes embebidas y validación PDF/A (DEC-080) |

### 4.7 Datos demo

T01 §18 (tenants `platform`, TEN-001, TEN-002, usuarios USR-PLAT-001, USR-ADM-A, USR-ADM-B sin contraseña conocida: acceso por invitación), T02 §18, T03 §18 (marca y diccionario base), T09 §18 (tipos de aviso), T11 §18.4 (plantillas semilla). Todo con `isDemo: true`.

### 4.8 Pruebas end-to-end de la ola

ESC-01..05 de T01 §17 y T08 §17 en lo que aplica a fundaciones; ESC-UXD-01..25 de T03 §17 (shells, temas, tokens, accesibilidad); TST-IAM de T02 §17 de login, bloqueo, recuperación y denegación por defecto; CA-WFL de T11 §17 de outbox, jobs, documentos y numeración; CA-INT de T06 §17 de bóveda, reintentos e idempotencia.

### 4.9 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O0-01 | Monorepo, monolito modular, Docker y ambientes | 19 |
| PRO-O0-02 | CI/CD, estrategia de pruebas y trazabilidad | 4 |
| PRO-O0-03 | Núcleo compartido: Zod, errores RFC 9457, paginación, dinero, fechas, control optimista e idempotencia | 4 |
| PRO-O0-04 | Multitenancy forzada y aislamiento | 21 |
| PRO-O0-05 | Observabilidad, salud y continuidad base | 6 |
| PRO-O0-06 | Seguridad HTTP, cifrado y cargas seguras | 3 |
| PRO-O0-07 | Outbox y bus de eventos de dominio | 13 |
| PRO-O0-08 | Jobs (colas Azure), programación por tenant y patrón de operaciones | 10 |
| PRO-O0-09 | Almacenamiento privado S3 y repositorio documental base | 8 |
| PRO-O0-10 | Bóveda de secretos (DEC-074) y marco de integraciones | 26 |
| PRO-O0-11 | IAM base: identidades, pertenencias, login staff, sesión y capabilities | 21 |
| PRO-O0-12 | Auditoría inmutable | 7 |
| PRO-O0-13 | Registro de parámetros tipados y `legalEntities` (DEC-064) | 14 |
| PRO-O0-14 | Design system admin y PWA, tokens y branding runtime base | 26 |
| PRO-O0-15 | Layouts: AdminShell, AppShell, landing, plataforma, login UX y mapa del sitio | 40 |
| PRO-O0-16 | Componentes genéricos, reglas UX y accesibilidad | 40 |
| PRO-O0-17 | Diccionario de términos base | 19 |
| PRO-O0-18 | Plantillas, motor PDF (DEC-080) y numeración de documentos | 9 |
| PRO-O0-19 | Notificaciones base y bandeja in-app | 8 |
| PRO-O0-20 | Convenciones de migración `legacy` | 7 |
| PRO-O0-21 | Integración de O0: demo y suite de aislamiento | 0 (verifica 305) |

#### PRO-O0-01 — Monorepo, monolito modular, Docker y ambientes

```text
PRO-O0-01 — Monorepo, monolito modular, Docker y ambientes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: crear el monorepo solución CoopApps (.NET 10 + React 19) con apps (api, worker, admin, pwa, landing), packages (shared, ui, dictionary, connectors) e infra, como monolito modular con manifiestos y fronteras verificables, contenerizado y con ambientes separados.
LEER: 00-ESPECIFICACION-MAESTRA.md §5 (stack, monorepo, ARQ-01..08); anexos/T01-PLA-plataforma-saas.md §5.A, §5.J, §5.N, §5.P, §5.Q, §7.1, §7.2, §7.3 (árbol), §7.4 (módulos y manifiesto), §7.5, §7.10; anexos/T04-CFG-configuracion-parametros-maestros.md §5.14.
IMPLEMENTAR: RF-PLA-001..008, 013, 109, 110, 146, 147, 154, 155, 161, 163; RF-CFG-122, 123; RNF-PLA-001..010, 015.
ENTREGABLES: solución .NET monolito modular + frontend React (Vite); árbol exacto de T01 §7.3; src/Api/Modules/<cod>/ con registro DI + endpoints (minimal API o controllers) vacíos para los 26 códigos del maestro §5.2; src/Api/Core/; script check:structure (falla si un módulo no respeta la plantilla o importa internals de otro módulo); grafo de dependencias acíclico verificado; Dockerfiles por app (imagen mínima, usuario no root, SBOM); docker compose local (API, Worker, SQL, Azurite, frontends), renderer; ambientes local, ci, dev, staging, sandbox, demo, prod con .env.example ficticio; migraciones de esquema y catálogos idempotentes ejecutadas por el pipeline; bloqueo de seeds demo en prod; comandos de §2.5 GoodApps (esqueleto).
NO CONSTRUIR TODAVÍA: lógica de negocio de ningún módulo; CI (PRO-O0-02); tenancy (PRO-O0-04).
PRUEBAS: check:structure detecta un import prohibido entre módulos; seed demo en NODE_ENV=production termina con error; compose levanta y /health/live responde (stub).
TERMINADO CUANDO: el repositorio compila, check:structure pasa, compose levanta los contenedores y el README explica cómo correr todo con datos ficticios.
VERIFICAR: dotnet restore && dotnet run --project tools/CheckStructure && docker compose -f deploy/docker-compose.dev.yml up -d && curl https://localhost:<puerto>/health/live
```

#### PRO-O0-02 — CI/CD, estrategia de pruebas y trazabilidad

```text
PRO-O0-02 — CI/CD, estrategia de pruebas y trazabilidad
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: pipeline de integración y entrega que bloquea el merge ante fallas de calidad, seguridad o aislamiento, con evidencia por versión y control de trazabilidad de IDs.
LEER: anexos/T08-NFR-no-funcionales-seguridad.md §5.1, §9.11, §12.1, §12.2, §12.3, §15.9; anexos/T01-PLA-plataforma-saas.md §5.J; anexos/T06-INT-integraciones.md §5.10.
IMPLEMENTAR: RF-PLA-113, 114; RF-NFR-022; RF-INT-083; RNF-NFR-092..094, 140..145, 147..149, 151, 152, 155, 158, 160..171, 174, 178, 240..245, 249.
ENTREGABLES: workflow de CI con etapas lint, check:structure, unitarias (dotnet test --filter Category=Unit + c8; Vitest/Playwright (React)/Playwright (React)/Playwright (React)/Playwright (React)), integración con Azure SQL y Azure Queue reales en contenedor, test:isolation (stub que crece con cada módulo), SAST, SCA, escaneo de secretos que bloquea, build de imágenes con SBOM, e2e humo Playwright (Chromium, Firefox, WebKit y emulación móvil); juego canónico de datos de prueba de dos tenants (RF-PLA-113, RNF-NFR-161 como fixture); matriz de verificación por entrega; script trace:check que lee los IDs citados en nombres de pruebas y los valida contra docs/especificacion (regex RF-|RN-|RNF-|ESC-|CA-|TST-) y produce reporte; plantilla de PR con las secciones de R18; evidencias de liberación por versión.
NO CONSTRUIR TODAVÍA: pruebas de dominio; pruebas de carga k6 de módulos (cada ola agrega las suyas).
PRUEBAS: un commit de prueba con un secreto falso bloquea el pipeline; una prueba que cita RF-XXX-999 inexistente hace fallar trace:check.
TERMINADO CUANDO: el pipeline corre completo en cada PR y la rama principal está protegida por él.
VERIFICAR: dotnet build && dotnet test && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py && playwright test --grep @O0
```

#### PRO-O0-03 — Núcleo compartido: Zod, errores RFC 9457, paginación, dinero, fechas, control optimista e idempotencia

```text
PRO-O0-03 — Núcleo compartido (packages/shared y src/Api/src/core)
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: librerías transversales que todos los módulos usan: validación FluentValidation y contratos Shared compartida, errores application/problem+json con requestId, paginación {items,total,page,size}, dinero decimal, fechas con zona del tenant, control optimista por version e idempotencia HTTP.
LEER: 00-ESPECIFICACION-MAESTRA.md §13; _GUIA-REDACCION-ANEXOS.md §5; anexos/T01-PLA-plataforma-saas.md §5.A, §7.5; anexos/T02-IAM-identidad-roles-auditoria.md §5.2 (RF-IAM-046), §5.6 (RF-IAM-139); anexos/T08-NFR-no-funcionales-seguridad.md §9.9, §9.10, §13.4, §14.1, §14.2.
IMPLEMENTAR: RF-PLA-014, 015; RF-IAM-046, 139; RNF-NFR-082..087, 090, 091, 192..194, 200, 201, 206, 210..215, 226..228.
ENTREGABLES: src/Contracts (Shared) (base FluentValidation y contratos Shared de documento con tenantId, legalEntityId opcional por tipo, createdAt, updatedAt, createdBy, updatedBy, version); src/Shared/money (decimal .NET y SQL DECIMAL(19,4) adapters, redondeo por concepto, prohibición de Number vía regla analyzers .NET + analyzers .NET + analyzers .NET + analyzers .NET + ESLint frontend frontend frontend frontend); src/Shared/dates (UTC, zona America/Argentina/Cordoba por defecto, formato dd-mm-yyyy); middleware de errores RFC 9457 (5xx sin detalle técnico); middleware Idempotency-Key con almacenamiento de respuesta por tenant y clave, y 409 ante cuerpo distinto; filtros globales EF Core y interceptores de versión optimista (409 ante version vieja); hora del servidor para auditoría; middleware de paginación.
NO CONSTRUIR TODAVÍA: endpoints de negocio.
PRUEBAS: suma y redondeo de importes al centavo sin Number; misma Idempotency-Key devuelve la misma respuesta sin repetir efectos; version desfasada responde 409 con problem+json; entrada inválida responde 400 con detalle por campo.
TERMINADO CUANDO: los packages están publicados en el workspace con cobertura alta y documentación de uso.
VERIFICAR: dotnet test --filter FullyQualifiedName~shared && dotnet build
```

#### PRO-O0-04 — Multitenancy forzada y aislamiento

```text
PRO-O0-04 — Multitenancy forzada y aislamiento
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: base única compartida con tenantId obligatorio y aislamiento verificable en consultas, jobs, archivos, caché, exportaciones, búsquedas, logs y referencias; tenant especial PLATFORM.
LEER: 00-ESPECIFICACION-MAESTRA.md §6; anexos/T01-PLA-plataforma-saas.md §5.B, §5.C, §5.L, §7.8, §7.9, §7.11.1; anexos/T08-NFR-no-funcionales-seguridad.md §7.4.
IMPLEMENTAR: RF-PLA-016..028, 030, 032..034, 036, 037, 130, 133; RNF-NFR-020, 021, 023, 025..027.
ENTREGABLES: filtros globales EF Core y interceptores de tenancy (inyecta filtro en find*, count*, update*, delete*, replaceOne, distinct, aggregate primer $match, bulkWrite; asigna tenantId en save/insertMany; lanza error sin contexto); contexto AsyncLocalStorage (tenantId, userId, actorType, requestId); runAsPlatform(fn,{reason}) auditado; lista blanca de tablas SQL globales; índices compuestos que empiezan por tenantId (validados en arranque); prefijos t:<tenantId>: en Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Redis en Azure si aplica en Azure si aplica en Azure si aplica en Azure si aplica y tenants/{tenantId}/<modulo>/ en almacenamiento; tabla tenants y tenant PLATFORM por migración idempotente; /api/platform/* y rutas meta.platformOnly solo para PLATFORM; rate limiting por IP y por tenant; separación de colas batch e interactivas; suite test:isolation genérica que recorre rutas y tablas SQL registradas.
NO CONSTRUIR TODAVÍA: ciclo de vida del tenant y licencias (O1).
PRUEBAS: consulta sin contexto lanza error; token de TEN-002 recibe 404 sobre un ID de TEN-001; un índice sin tenantId inicial hace fallar el arranque en ci; un job sin tenantId en el payload es rechazado; un admin de TEN-001 recibe 403 en /api/platform.
TERMINADO CUANDO: test:isolation corre en CI y falla al agregar a propósito una ruta sin filtro.
VERIFICAR: dotnet test --filter Category=Isolation && dotnet test --filter FullyQualifiedName~Api
```

#### PRO-O0-05 — Observabilidad, salud y continuidad base

```text
PRO-O0-05 — Observabilidad, salud y continuidad base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: logs estructurados, métricas, trazas, salud, errores controlados, estados explícitos de operaciones externas y bases de backup y recuperación.
LEER: anexos/T01-PLA-plataforma-saas.md §5.M; anexos/T06-INT-integraciones.md §5.9; anexos/T08-NFR-no-funcionales-seguridad.md §7.2, §7.3, §8, §11.2, §11.3, §11.4; 01-registro-decisiones.md DEC-063.
IMPLEMENTAR: RF-PLA-136, 137, 139, 142, 143; RF-INT-073; RNF-NFR-001, 002, 004, 008, 009, 013, 014, 030, 033, 035, 038..041, 048, 120..124, 126..128, 130, 138, 139.
ENTREGABLES: logger pino JSON con requestId, tenantId, userId seudonimizado y module; OpenTelemetry (trazas y métricas por ruta, tenant y cola); /health/live y /health/ready (Azure SQL, Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Redis en Azure si aplica en Azure si aplica en Azure si aplica en Azure si aplica, almacenamiento); captura de errores no controlados sin datos sensibles; enum de estados Pendiente, Confirmado, Fallido y Resultado incierto en packages/shared; backups lógicos programados por ambiente y procedimiento de restauración documentado (RPO ≤ 15 min, RTO ≤ 4 h por tenant, DEC-063) como base para O1; tablero técnico inicial y alertas de jobs.
NO CONSTRUIR TODAVÍA: restauración selectiva por tenant y tableros de plataforma (O1).
PRUEBAS: un log de request contiene requestId y tenantId y nunca el header Authorization; /health/ready falla si Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Redis en Azure si aplica en Azure si aplica en Azure si aplica en Azure si aplica cae; una excepción no controlada devuelve 500 problem+json sin stack.
TERMINADO CUANDO: las métricas se ven en el entorno local y hay alerta de cola atascada.
VERIFICAR: dotnet test && docker compose up -d && curl /health/ready
```

#### PRO-O0-06 — Seguridad HTTP, cifrado y cargas seguras

```text
PRO-O0-06 — Seguridad HTTP, cifrado y cargas seguras
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: controles OWASP ASVS nivel 2 transversales: cifrado en tránsito y reposo, cifrado de campos sensibles, headers, CSP, CORS, rate limit, cargas seguras, reportes CSP, security.txt y control de exportaciones con datos personales.
LEER: anexos/T08-NFR-no-funcionales-seguridad.md §5.1 (RF-NFR-020, 021, 024), §9.1, §9.2, §9.3, §9.6, §9.7, §9.8, §9.12, §9.14, §10.2.
IMPLEMENTAR: RF-NFR-020, 021, 024; RNF-NFR-050..056, 058, 059, 072..075, 078..081, 096, 097, 099, 105, 235..238.
ENTREGABLES: middleware de headers (HSTS, CSP estricta con nonce, sin unsafe-inline ni unsafe-eval, frame-ancestors), CORS por app; TLS 1.2+; cifrado de campo con DEK por categoría (incluida salud) sobre la interfaz de bóveda de PRO-O0-10 (dejar la interfaz y un adaptador local para test); política de uploads (tipo real, tamaño, antivirus por job, cuarentena); endpoint de reportes CSP; /.well-known/security.txt; registro y tope de exportaciones con datos personales.
NO CONSTRUIR TODAVÍA: EIPD por funcionalidad (cada ola) ni consentimientos (O2).
PRUEBAS: respuesta sin CSP falla la prueba; upload con extensión cambiada es rechazado; exportación que supera el tope exige motivo; campo marcado sensible se guarda cifrado y se lee descifrado solo con permiso.
TERMINADO CUANDO: el escaneo DAST de humo no reporta hallazgos altos.
VERIFICAR: dotnet test && playwright test --grep @O0-security
```

#### PRO-O0-07 — Outbox y bus de eventos de dominio

```text
PRO-O0-07 — Outbox y bus de eventos de dominio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: publicar eventos de dominio en la misma transacción del cambio y entregarlos al menos una vez, en orden por agregado, a consumidores idempotentes declarados por manifiesto.
LEER: 00-ESPECIFICACION-MAESTRA.md §5.1 (eventos), §13; anexos/T01-PLA-plataforma-saas.md §5.A (RF-PLA-009), §7.6; anexos/T11-WFL-workflow-eventos-documentos.md §5.1, §5.17, §12.1 (sobre), §12.3 y §12.4 (catálogo y alias).
IMPLEMENTAR: RF-PLA-009; RF-WFL-001..009, 015..017; RNF-WFL-001, 004, 005.
ENTREGABLES: servicio publish() transaccional sobre pla.OutboxEvents (SQL); relay a Azure Queue Storage con reintentos; sobre estándar (eventId UUIDv7, type, schemaVersion, tenantId, occurredAt, aggregate, actor, correlationId, piiLevel); src/Shared/events con esquemas FluentValidation y contratos Shared por tipo y generador del catálogo eventTypes; versionado compatible; suscripciones declaradas en manifest; registro de consumo idempotente (consumer, eventId); orden por aggregateId; alias de nombres no canónicos (RF-WFL-015, HUECO-TRV-02, HUE-SRV-01, IDs provisionales EVT-CAT-01..25 de T11 §12.3).
NO CONSTRUIR TODAVÍA: replay (O11, RF-WFL-012) ni eventos públicos a terceros (O11, RF-WFL-014).
PRUEBAS: transacción abortada no deja evento; relay caído y luego levantado entrega igual; evento entregado dos veces se procesa una vez; eventos del mismo agregado llegan en orden.
TERMINADO CUANDO: un módulo de ejemplo publica y otro consume con pruebas de integración verdes.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep outbox && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O0-08 — Jobs (colas Azure), programación por tenant y patrón de operaciones

```text
PRO-O0-08 — Jobs Azure Queue Storage, programación por tenant y patrón de operaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ejecutar todo proceso masivo como job idempotente, reanudable y con progreso, programado en la zona del tenant y con equidad entre tenants; modelar las acciones sensibles como operaciones numeradas e idempotentes.
LEER: anexos/T01-PLA-plataforma-saas.md §5.A (RF-PLA-010, 011), §7.6; anexos/T11-WFL-workflow-eventos-documentos.md §5.2, §5.3, §12.6, §12.7.
IMPLEMENTAR: RF-PLA-010, 011; RF-WFL-020..022, 024..026, 040, 043.
ENTREGABLES: src/Worker con colas por clase (interactive, batch, export, integration); catálogo jobDefinitions `<mod>:<proceso>`; jobRuns con progreso y checkpoint por chunk; ID determinista <modulo>:<proceso>:<tenantId>:<loteId>:<chunk>; jobSchedules con cron evaluado en la zona del tenant y fan-out por tenant activo; semáforo de concurrencia por tenant; bulkRuns con universo congelado; API 202 con bulkRunId; operaciones OPE-AAAA-NNNNNN con handler idempotente por operationId.
NO CONSTRUIR TODAVÍA: jobs de dominio; aprobaciones de operaciones (O1, RF-WFL-041..051).
PRUEBAS: matar el worker a mitad de un bulkRun y reanudar no duplica ítems; dos tenants con lotes grandes avanzan en paralelo sin inanición; un cron a las 02:00 de la zona del tenant se dispara a la hora local correcta.
TERMINADO CUANDO: un job de ejemplo procesa 10.000 ítems ficticios con progreso visible y reanudación probada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Worker && dotnet test --filter Category=Isolation
```

#### PRO-O0-09 — Almacenamiento privado S3 y repositorio documental base

```text
PRO-O0-09 — Almacenamiento privado S3 y repositorio documental base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: almacenamiento de objetos privado S3-compatible con URL firmadas de vida corta y repositorio documental por tenant con tipos, versiones inmutables, vínculos y borrado lógico.
LEER: anexos/T01-PLA-plataforma-saas.md §5.A (RF-PLA-012), §7.7; anexos/T11-WFL-workflow-eventos-documentos.md §5.11, §7 (documents, documentTypes, documentLinks).
IMPLEMENTAR: RF-PLA-012; RF-WFL-150..154, 157, 159.
ENTREGABLES: adaptador de almacenamiento (Azure Blob; Azurite en dev) con claves tenants/{tenantId}/<modulo>/...; subida en dos pasos con URL prefirmada, verificación de tipo real, tamaño y antivirus por job; documents con versiones inmutables y hash; documentTypes con sujetos admitidos; documentLinks a múltiples sujetos; descarga por URL firmada tras verificar permiso del objeto dueño, con registro; borrado lógico con motivo; componente FileUploader privado (en frontend/packages/ui (React), lo usa T03).
NO CONSTRUIR TODAVÍA: retención y purga por política (O1, RF-WFL-160, 161); expediente digital (O1/O2).
PRUEBAS: URL firmada vence; usuario de TEN-002 no descarga un documento de TEN-001 ni con la URL; un reemplazo crea versión nueva y conserva la anterior.
TERMINADO CUANDO: el admin sube y descarga un adjunto de prueba con auditoría.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep documents && dotnet test --filter Category=Isolation
```

#### PRO-O0-10 — Bóveda de secretos (DEC-074) y marco de integraciones

```text
PRO-O0-10 — Bóveda de secretos (DEC-074) y marco de integraciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: bóveda por tenant con cifrado por sobre (clave de datos por tenant cifrada por clave maestra en AWS KMS detrás de una interfaz agnóstica) y marco de conectores con ejecución confiable, bitácora saneada, seguridad de salida y simulador.
LEER: 01-registro-decisiones.md DEC-074; anexos/T06-INT-integraciones.md §5.1, §5.2, §5.4, §5.5, §5.6, §5.9, §5.10, §7 (integrationProviders, vaultSecrets, integrationOperations, integrationLogs, externalReferences); anexos/T08-NFR-no-funcionales-seguridad.md §9.5.
IMPLEMENTAR: RF-INT-001, 005, 015, 021, 030..037, 039..041, 044, 046..049, 052, 078..080, 082, 085; RNF-NFR-067, 070.
ENTREGABLES: src/Infrastructure/Connectors (SDK: capacidades declaradas, timeouts, taxonomía de errores, reintentos con backoff y jitter, circuit breaker, límite de tasa saliente con token bucket en Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Azure Queue Storage o Redis en Azure si aplica en Azure si aplica en Azure si aplica en Azure si aplica, prioridad interactiva sobre batch, correlationId, idempotencia tenantId+operationType+businessKey, efectos solo por eventos al módulo dueño); vault service (envelope encryption, adaptador KMS y adaptador local para dev/ci, claves maestras distintas por ambiente, nunca registrar valores); integrationProviders de plataforma; bitácora con saneamiento y cuerpos grandes en almacenamiento privado; externalReferences; egress allowlist; TLS siempre validado; simulador determinista por conector (fallas y demoras); conectores de mensajería como adaptadores del marco (T09 decide qué enviar).
NO CONSTRUIR TODAVÍA: pantallas de conexiones y certificados (O1); conectores concretos (ARCA O4, pasarelas O5, aprovisionamiento O3).
PRUEBAS: el valor de un secreto nunca aparece en logs ni en la bitácora; una operación ya exitosa no se reenvía; el circuit breaker abre y se recupera; un destino fuera de la allowlist es bloqueado; ambientes no productivos no pueden usar conexiones production.
TERMINADO CUANDO: un conector de ejemplo contra el simulador cumple reintentos, idempotencia y bitácora.
VERIFICAR: dotnet test --filter FullyQualifiedName~connectors && dotnet test --filter FullyQualifiedName~Api -- --grep vault
```

#### PRO-O0-11 — IAM base: identidades, pertenencias, login staff, sesión y capabilities

```text
PRO-O0-11 — IAM base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: identidad común por persona con pertenencias privadas por tenant, pre-login por tenant, login de staff con contraseña, sesión JWT con refresh rotativo, recuperación anti-enumeración, bloqueo y rate limit, catálogo de capabilities y denegación por defecto, usuarios de plataforma y cuentas técnicas.
LEER: 00-ESPECIFICACION-MAESTRA.md §7; anexos/T02-IAM-identidad-roles-auditoria.md §4, §5.1, §5.2, §5.3 (RF-IAM-060, 061), §5.5 (RF-IAM-110, 115), §7, §8, §10 (pantallas de login), §11; anexos/T08-NFR-no-funcionales-seguridad.md §9.4.
IMPLEMENTAR: RF-IAM-001..003, 006..008, 020, 021 (sin 2FA; 2FA en O1), 030, 032..036, 040, 041, 045, 060, 061, 110 (MFA de plataforma obligatorio con TOTP, parte O0), 115; RNF-NFR-060.
ENTREGABLES: tablas iam.* (identities, memberships, users, sessions), memberships, users, sessions; hash de contraseña fuerte (argon2id); pre-login por subdominio o código; login staff; access JWT 15 min con claim tid + refresh opaco 30 días rotativo con detección de reutilización; cookies __Host- HttpOnly Secure SameSite; recuperación con respuesta genérica; bloqueo 5 fallos en 15 min; rate limit; invitación en lugar de contraseñas por defecto; src/Shared/capabilities con metadatos; middleware requireCapability y denegación por defecto (endpoint sin capability declarada no arranca); selección de ámbito tenant+contexto; usuarios de plataforma en PLATFORM; cuentas técnicas S-SYS, S-BOT, S-KSK, S-AGT.
NO CONSTRUIR TODAVÍA: 2FA de staff, Google, CiDi, OTP de socio, roles y perfiles editables, alcance de datos, separación de funciones (O1).
PRUEBAS: credencial incorrecta devuelve error genérico; reutilizar un refresh revoca la familia; sexto intento bloquea; endpoint sin capability devuelve 403; identidad con pertenencias en TEN-001 y TEN-002 elige ámbito y no ve datos del otro.
TERMINADO CUANDO: USR-ADM-A entra a TEN-001 por invitación ficticia y ve el AdminShell (PRO-O0-15 lo completa).
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep iam && dotnet test --filter Category=Isolation
```

#### PRO-O0-12 — Auditoría inmutable

```text
PRO-O0-12 — Auditoría inmutable
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: auditoría genérica de cambios, accesos, intentos fallidos y mensajes, append-only, sin secretos, con base para la cadena de hash.
LEER: anexos/T02-IAM-identidad-roles-auditoria.md §5.6, §7 (auditLogs); anexos/T01-PLA-plataforma-saas.md §5.H (RF-PLA-095); anexos/T08-NFR-no-funcionales-seguridad.md §11.1.
IMPLEMENTAR: RF-IAM-130..132, 133 (parte O0: append-only; la cadena de hash y su verificación son O1), 134, 136; RF-PLA-095; RNF-NFR-110..112, 118, 119.
DECISIONES v1.2 (10-11-2026): DEC-096 (`auditLogs` y `auditReads` llevan `legalEntityId` cuando el recurso pertenece a una entidad jurídica, RF-IAM-130; el filtro de auditoría por entidad es RF-BIA-104 en PRO-O1-17); DEC-107 (cada número fiscal asignado, liberado y reasignado queda auditado con su motivo; los hechos los emite M05 en PRO-O4-10).
ENTREGABLES: plugin de auditoría EF Core (valores previos y posteriores, actor, tenant, requestId, motivo) que excluye campos secretos declarados; auditoría de accesos (pre-login, login, logout, refresh reutilizado, denegaciones); auditoría de mensajes con destinatario enmascarado y hash; tabla pla.AuditLogs sin update ni delete (índices y permisos de base); componente AuditTimeline (frontend/packages/ui (React)).
NO CONSTRUIR TODAVÍA: encadenamiento de hash y job de verificación (O1, RF-IAM-133 resto), auditoría de IA y de plataforma (O1, O11).
PRUEBAS: un cambio genera auditoría con antes y después; una contraseña nunca aparece; un intento de update sobre auditLogs falla.
TERMINADO CUANDO: el AuditTimeline muestra los cambios de una entidad de prueba.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep audit
```

#### PRO-O0-13 — Registro de parámetros tipados y `legalEntities` (DEC-064)

```text
PRO-O0-13 — Registro de parámetros tipados y legalEntities
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: librería de parámetros declarados en código, tipados y validados, sincronizados al desplegar; y entidades jurídicas del tenant desde O0 para que todo documento económico lleve legalEntityId.
LEER: anexos/T04-CFG-configuracion-parametros-maestros.md §5.1, §7 (parameterDefinitions), §14.2 (convención de claves); 01-registro-decisiones.md DEC-064; anexos/T01-PLA-plataforma-saas.md §19.1 (EMPRESAS); anexos/T05-DAT-modelo-datos.md §7.1 y COL-CFG-41 a 43 (legalEntities, branches, workstations; lista de colecciones con legalEntityId obligatorio); anexos/T04-CFG-configuracion-parametros-maestros.md §7.14 y §7.15 y RF-CFG-134 a 140.
IMPLEMENTAR: RF-CFG-001..005, 007..009; REQ-DEC-064 (requisito derivado de la DEC, sin RF en los anexos; ver §19 C-01 del plan); además (v1.1): RF-CFG-134..138, 140 (cubren REQ-DEC-064 con los nombres de T05: `legalEntities` con datos legales en `fiscal.*`, entidad por defecto, `branches`, servicio `legalEntities.resolve` API-CFG-58 y `legalEntityId` obligatorio en el esquema base por RF-CFG-136; el perfil fiscal completo es `fiscalProfiles` de M06 en O4, RF-CFG-138).
ENTREGABLES: API de declaración de parámetros por módulo (clave semántica, tipo, validación, ámbitos, default, clase de cambio, vigencia, dependencias, visibilidad, sensibilidad, equivalencias legacy); job de sincronización a parameterDefinitions en cada despliegue; lector tipado que lanza error ante clave inexistente; prueba de CI que falla si una clave usada no está declarada; tabla cfg.LegalEntities según T05 COL-CFG-41 y T04 §7.14 (tenantId, code, legalName, tradeName, legalForm, inaesRegistration, fiscal{cuit, ivaConditionCode, iibbRegime, iibbNumber, activityStartDate}, address, brandingVariantKey, isDefault, status, validFrom, validTo, changeHistory[]; CUIT único por tenant; reemplaza la lista v1.0 "cuit, ivaCondition, iibbRegime, activityStartDate" en la raíz) con una entidad por defecto creada en la misma unidad idempotente al consumir pla.tenant.created (RF-CFG-135); tabla cfg.Branches según COL-CFG-42 (code, name, legalEntityId, localityId, address, uses[], isHeadquarters, openingHours[], calendarCode, status) con la sucursal "Casa central" creada con el tenant (RF-CFG-140); servicio interno legalEntities.resolve({ branchId, serviceId, at }) con el orden de RF-CFG-137 (API-CFG-58); campo legalEntityId obligatorio en el esquema base de documento económico de packages/shared para las tablas SQL de T05 §7.1 (RF-CFG-136), validado contra una entidad activa del mismo tenant; PAN-CFG-33 y capability cfg.entidadesJuridicas.ver/editar.
NO CONSTRUIR TODAVÍA: publicación versionada, ámbitos y editor (O1); workstations (O1, PRO-O1-11, RF-CFG-141); datos fiscales completos de cada entidad en fiscalProfiles (M06 en O4, RF-CFG-138 y RF-FIS-167); subdocumento employer (O9, RF-CFG-139); migración de EMPRESAS y de las sucursales (O7, PRO-O7-11, RF-CFG-142; DEC-089 y DEC-098: las sucursales se derivan de `PTOVENTA.SUC_COM` y las confirma la cooperativa; antes "O11").
PRUEBAS: leer una clave no declarada lanza error; un documento económico sin legalEntityId no valida; TEN-001 tiene su entidad por defecto y no ve las de TEN-002; reprocesar pla.tenant.created no crea una segunda entidad por defecto; un segundo alta con el mismo CUIT ficticio en TEN-001 se rechaza y en TEN-002 se acepta; una sucursal no puede apuntar a una entidad inactiva.
TERMINADO CUANDO: el registro sincroniza y legalEntities tiene API admin mínima con pruebas.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cfg && dotnet test --filter Category=Isolation
```

#### PRO-O0-14 — Design system admin y PWA, tokens y branding runtime base

```text
PRO-O0-14 — Design system y branding runtime base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: tokens y temas del admin (oscuro por defecto) y de la PWA (.pwa-mod), tipografías y branding runtime por tenant con variables CSS.
LEER: 00-ESPECIFICACION-MAESTRA.md §10, §11; anexos/T03-UXD-experiencia-marca-diccionario.md §5.1, §5.2, §5.3, §7 (branding), §10, §18.
IMPLEMENTAR: RF-UXD-001..007, 009..019, 021, 025..027, 029, 035, 036, 040.
ENTREGABLES: frontend/packages/ui (React) con tokens T03 §4.1 (admin) y §3.1 (PWA), tema oscuro y claro por data-theme con persistencia en userUiPreferences, tipografías Space Grotesk, IBM Plex Sans, IBM Plex Mono y Sora, estados ok/warn/bad; applyBrandingCssVars y applyTenantPwaIdentity; manifest dinámico y theme-color; logos jerárquicos con fallback de plataforma.
NO CONSTRUIR TODAVÍA: editor de marca y validación de contraste en el editor (O1).
PRUEBAS: el admin abre en oscuro y cambia a claro sin recargar; la PWA de TEN-001 muestra su color de marca y la de TEN-002 el suyo; snapshot visual de tokens.
TERMINADO CUANDO: Storybook o página de muestra con todos los tokens y ambos temas.
VERIFICAR: dotnet test --filter FullyQualifiedName~ui && playwright test --grep @O0-ux
```

#### PRO-O0-15 — Layouts: AdminShell, AppShell, landing, plataforma, login UX y mapa del sitio

```text
PRO-O0-15 — Layouts y mapa del sitio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: shells de todas las apps y la declaración única siteMapGroups que alimenta menú, mapa del sitio y editor de roles.
LEER: 00-ESPECIFICACION-MAESTRA.md §8, §9, §10; anexos/T03-UXD-experiencia-marca-diccionario.md §5.4, §5.5, §5.6, §5.9, §5.12, §10 (PAN-UXD), §11; anexos/T08-NFR-no-funcionales-seguridad.md §13.3.
IMPLEMENTAR: RF-UXD-041..045, 047..050, 052..056, 058..071, 079, 112..117, 171, 172, 175, 176, 178; RNF-NFR-186.
ENTREGABLES: AdminShell (topbar con logo producto y tenant, selector de contexto, buscador, Mapa del sitio, accesos fijados, notificaciones, usuario; menú lateral desde siteMapGroups filtrado por capability), AdminStickyHeader, ScreenHelp, modales sm/md/lg/xl; AppShell PWA con topbar, banners, tabbar y FAB contextual, phone shell en escritorio, service worker base y OfflineBanner; layout de landing; modo plataforma con estética diferenciada; pantallas de pre-login, login, recuperación y cambio de contraseña; siteMapGroups declarativo con estructura de clusters del maestro §9 (vacío de ítems de dominio; cada ola agrega los suyos, RF-UXD-171); pantallas PAN-UXD-15 (asistente IA de la PWA, RF-UXD-064, oculta por el flag `pwa.asistente` hasta O11), PAN-UXD-16 (directorio del empleado, RF-UXD-063, `iam.directorio.ver`; datos de M16 desde O2) y PAN-UXD-17 (alertas activas del admin, RF-UXD-055) (agregado en el cierre de residuales del 05-11-2026; antes no figuraban en ningún prompt).
NO CONSTRUIR TODAVÍA: botones SSO y CiDi (O1); ítems de menú de módulos.
PRUEBAS: un usuario sin capabilities ve el menú vacío; un ítem sin capability no aparece en menú ni en mapa; la PWA se centra a 430 px en escritorio; navegación por teclado del menú.
TERMINADO CUANDO: login de USR-ADM-A lleva al AdminShell y la PWA muestra el AppShell con marca de TEN-001.
VERIFICAR: playwright test --grep @O0-shell
```

#### PRO-O0-16 — Componentes genéricos, reglas UX y accesibilidad

```text
PRO-O0-16 — Componentes genéricos, reglas UX y accesibilidad
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: componentes molde reutilizables y reglas UX obligatorias con accesibilidad WCAG 2.2 AA.
LEER: anexos/T03-UXD-experiencia-marca-diccionario.md §5.7, §5.8, §5.10; anexos/T08-NFR-no-funcionales-seguridad.md §13.1, §13.2.
IMPLEMENTAR: RF-UXD-081..085, 087, 088, 090..093, 097..106, 108..110, 123..135, 137..139 (RF-UXD-139 rige en todas las olas); RNF-NFR-180, 183..185.
ENTREGABLES: DataTable genérico (columnas configurables, orden, filtros, paginación servidor, exportar XLSX/CSV/PDF por job, selección masiva; vistas guardadas quedan para O1), ExcelImportWizard (subir, preview con errores, confirmar), Toasts, ConfirmDialog, MoneyInput y MoneyDisplay (decimal), DateRange, EntityPicker, StatusBadge, KpiGrid, SignaturePad, skeletons y estados vacíos con acción; reglas UX (errores inline, una tarea principal por pantalla en PWA, altas en modal); pruebas axe automáticas.
NO CONSTRUIR TODAVÍA: AddressPicker con mapa (O1, geografía) y AudiencePicker (O2).
PRUEBAS: axe sin violaciones serias en cada componente; DataTable pagina contra API mock; MoneyInput no usa Number.
TERMINADO CUANDO: página de muestra con todos los componentes y pruebas verdes en los tres navegadores.
VERIFICAR: dotnet test --filter FullyQualifiedName~ui && playwright test --grep @O0-components
```

#### PRO-O0-17 — Diccionario de términos base

```text
PRO-O0-17 — Diccionario de términos base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ninguna etiqueta fija: claves dict:<clave> con fallback de plataforma, variables, pluralización y variantes por canal.
LEER: 00-ESPECIFICACION-MAESTRA.md §11, §20; anexos/T03-UXD-experiencia-marca-diccionario.md §5.11, §7 (dictionaryEntries), §18.
IMPLEMENTAR: RF-UXD-140..142, 144..147, 149..151, 155..160, 166, 168, 169.
ENTREGABLES: packages/dictionary (resolutor con fallback tenant → plataforma, variables, pluralización, variantes por canal admin/pwa/landing/email/sms); claves base del glosario del maestro §20 y de T03 §18; plugin React t() y regla analyzers .NET + analyzers .NET + analyzers .NET + analyzers .NET + ESLint frontend frontend frontend frontend que prohíbe texto fijo en templates; API de lectura de diccionario publicado.
NO CONSTRUIR TODAVÍA: editor y publicación versionada por tenant (O1).
PRUEBAS: una clave inexistente en el tenant cae a la de plataforma; un template con texto fijo hace fallar lint; pluralización correcta de "socio/socios".
TERMINADO CUANDO: todos los shells y componentes de O0 usan solo claves.
VERIFICAR: dotnet test --filter FullyQualifiedName~dictionary && dotnet build
```

#### PRO-O0-18 — Plantillas, motor PDF (DEC-080) y numeración de documentos

```text
PRO-O0-18 — Plantillas, motor PDF y numeración
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: plantillas HTML versionadas con lenguaje sin lógica arbitraria, render HTML+CSS a PDF con Chromium sin interfaz en workers dedicados y validación PDF/A, y secuencias de numeración atómicas con políticas de huecos.
LEER: 01-registro-decisiones.md DEC-080; anexos/T11-WFL-workflow-eventos-documentos.md §5.12, §5.13, §7 (documentTemplates, templateVersions, numberingSequences), §18.4.
IMPLEMENTAR: RF-WFL-170..172, 175, 179, 185..188.
ENTREGABLES: documentTemplates y templateVersions; Handlebars restringido con ayudantes formatMoney, formatDate, dict, qr, barcode; contratos de datos FluentValidation y contratos Shared por tipo documental; worker renderer (Chromium headless) con colas interactive y batch, fuentes embebidas y validación PDF/A posterior; resultado guardado como document; 46 plantillas semilla de T11 §18.4 como plantillas de plataforma; numberingSequences con alcance, incremento atómico en la transacción del llamador, políticas gapless/allowGaps y anulación trazable.
NO CONSTRUIR TODAVÍA: editor de plantillas del tenant (O1, RF-WFL-173) y plantillas fiscales concretas (O4).
PRUEBAS: dos emisiones concurrentes nunca toman el mismo número; transacción abortada no consume número gapless; PDF generado pasa validación PDF/A; una plantilla con helper no permitido no compila.
TERMINADO CUANDO: un comprobante de prueba ficticio se numera, renderiza y descarga por URL firmada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Worker -- --grep pdf && dotnet test --filter FullyQualifiedName~Api -- --grep numbering
```

#### PRO-O0-19 — Notificaciones base y bandeja in-app

```text
PRO-O0-19 — Notificaciones base y bandeja in-app
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: base técnica de notificaciones: bandeja in-app, mapa notifKinds, estados de entrega e idempotencia; los módulos emiten eventos y COM los consume.
LEER: anexos/T09-COM-comunidad-comunicaciones.md §5.8 (RF-COM-138, 141, 145), §5.11 (RF-COM-181), §5.13, §7 (appNotifications), §12; nota: hay IDs JOB-COM duplicados (HUE-SRV-06), usar la tabla del catálogo transaccional.
IMPLEMENTAR: RF-COM-138, 141, 145, 181, 200..203.
ENTREGABLES: appNotifications por usuario; estados created→queued→sent_to_provider→accepted→delivered/failed; idempotencyKey tipo+evento+destinatario+canal; consumidor genérico de eventos para avisos; notifKinds con fallback por prefijo; campana en AdminShell y bandeja PWA /avisos con pestañas; vigencia por defecto 30 días y purga por job.
NO CONSTRUIR TODAVÍA: plantillas multicanal, audiencias, preferencias y campañas (O2).
PRUEBAS: el mismo evento no genera dos avisos; un aviso vencido se purga; el usuario de TEN-002 no ve avisos de TEN-001.
TERMINADO CUANDO: un evento de prueba genera un aviso visible en admin y en PWA.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep notifications && playwright test --grep @O0-notif
```

#### PRO-O0-20 — Convenciones de migración `legacy`

```text
PRO-O0-20 — Convenciones de migración legacy
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: dejar las convenciones que toda tabla necesita para recibir datos migrados de ProCoop: snapshots inmutables, mapa de IDs, sello legacy y conversiones de importes y fechas.
LEER: anexos/T07-MIG-migracion-procoop.md §5.2, §5.4, §5.5, §5.10, §7.
IMPLEMENTAR: RF-MIG-011, 016, 036, 037, 041, 042, 098.
ENTREGABLES: subesquema legacy {system, table, key, runId, hash} en packages/shared; tabla legacyIdMap; almacenamiento de snapshots cifrados (JSON Lines) con fecha de corte y zona del origen; utilidades de conversión a DECIMAL(19,4) sin redondeo y de fechas a UTC (1900-01-01 como ausente); regla de que la documentación y los ejemplos usan datos ficticios.
NO CONSTRUIR TODAVÍA: proyectos, corridas, perfilado ni carga (O1).
PRUEBAS: un importe con 4 decimales se conserva exacto; una fecha 1900-01-01 queda null; legacyIdMap es único por tenant, tabla y clave.
TERMINADO CUANDO: las utilidades están en packages/shared con pruebas.
VERIFICAR: dotnet test --filter FullyQualifiedName~shared -- --grep legacy
```

#### PRO-O0-21 — Integración de O0: demo y suite de aislamiento

```text
PRO-O0-21 — Integración de O0
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O0 (sección 4.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §4; anexos/T01-PLA-plataforma-saas.md §17, §18; anexos/T08-NFR-no-funcionales-seguridad.md §17; anexos/T03-UXD-experiencia-marca-diccionario.md §17.
IMPLEMENTAR: ningún RF nuevo. Verificar los 305 RF de O0 (versión 1.0: 299) y los RNF de O0 (§17 del plan).
ENTREGABLES: seed demo O0 (PLATFORM, TEN-001, TEN-002, usuarios por invitación, marca y diccionario base); e2e @O0 que recorre pre-login, login, AdminShell vacío, PWA con marca, cambio de tema, aviso in-app, PDF de prueba, secreto en bóveda; suite de aislamiento completa sobre todo lo registrado; reporte trace:check sin faltantes.
NO CONSTRUIR TODAVÍA: nada de O1.
PRUEBAS: e2e @O0 en los tres navegadores; test:isolation; carga k6 de login (RNF-NFR-001).
TERMINADO CUANDO: criterio de salida 4.2 demostrado con evidencias en docs/evidencias/O0/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O0 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 5. O1 — Plataforma, IAM, configuración y workflow

### 5.1 Objetivo

Completar la plataforma SaaS (ciclo de vida del tenant, licencias en capas, contrato y medición, soporte con acceso temporal, ambientes, backups, salida), IAM completo (2FA, Google, mecanismo federado para CiDi, OTP del socio, roles, perfiles, alcance, separación de funciones), configuración versionada y publicable, tablas maestras, geografía y calendarios, conexiones de integración, workflow de aprobaciones, bandeja del empleado, expediente, motor de reportes base y la herramienta de migración base.

### 5.2 Criterio de salida (demostrable)

Un usuario de plataforma da de alta TEN-001 con el asistente, lo lleva de Preparación a Prueba con su checklist, asigna licencia PLAN-ESTANDAR con `svc.internet`, el administrador de la cooperativa activa módulos, crea usuarios con 2FA, un rol con alcance por sucursal, publica una versión de configuración con aprobación de un segundo usuario, carga calles con geocodificación, y un operador de soporte accede con un permiso temporal consentido que queda auditado. Un reporte base se exporta por job y se descarga por URL firmada.

### 5.3 Dependencias

O0 completa (tenancy, IAM base, auditoría, outbox, jobs, bóveda, documental, PDF, design system).

### 5.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| T01 PLA | 107 | RF-PLA-029, 031, 035, 038, 039, 041..081, 084..094, 096..108, 111, 112, 115..129, 131, 132, 134, 135, 138, 140, 141, 144, 145, 148..152, 156..160, 162 | PAN-PLA-01..25, API-PLA-01..67, EVT-PLA-01..22 (*reemplazado, corrección 05-11-2026:* antes EVT-PLA-01..20; 22 definidos en el anexo), JOB-PLA-01..22 (los de plataforma) | `moduleCatalog`, `platformPlans`, `tenantLicenses`, `tenantModuleActivations`, `tenantChecklists`, `onboardingDrafts`, `saasContracts`, `usageSnapshots`, `supportCases`, `supportAccessGrants`, `supportSessions`, `platformIncidents`, `alertRules`, `alerts`, `backupRuns` |
| T02 IAM | 63 | RF-IAM-004, 005, 009, 010, 022..029, 031, 037..039, 042..044, 047..049, 062..079, 090..096, 111..114, 116, 135, 137, 138, 140..143, 150..153 | PAN-IAM-01..32, API-IAM-01..68 | `roles`, `screenProfiles`, `roleAssignments`, `dataScopes`, `supervisorAuthorizations`, `mfaFactors`, `federatedLinks` |
| T03 UXD | 36 | RF-UXD-008, 020, 022..024, 028, 030..034, 037..039, 046, 051, 057, 080, 096, 107, 118, 119, 121, 122, 136, 143, 148, 152..154, 162, 164, 165, 173, 174, 177 | Editor de marca y diccionario | `branding`, `dictionaryEntries` (versionado) |
| T04 CFG | 89 | RF-CFG-006, 010..016, 018..040, 042..055, 057, 058, 065..089, 100, 104..107, 114..117, 120, 121, 124, 128, 130, 131, 133 (v1.1: se agregan RF-CFG-141) | PAN-CFG-01..35 (*reemplazado, corrección 05-11-2026:* antes PAN-CFG-01..32; 35 definidos en el anexo) (salvo campos extra y precargas, O2) | `configVersions`, `parameterValues`, `masterTables`, `geoProvinces`, `geoLocalities`, `streets`, `calendars`, `holidays`, `enumerations` |
| T06 INT | 25 | RF-INT-002..004, 006, 007, 009, 011..014, 016..020, 028, 029, 042, 043, 050, 051, 070..072, 077 | PAN-INT-01..20 | `integrationConnections`, `certificates` |
| T07 MIG | 32 | RF-MIG-001..005, 010, 013..015, 020, 024, 025, 027, 028, 030..032, 035, 040, 043..046, 050..053, 058, 062, 095..097 | PAN-MIG, API-MIG de proyectos y corridas | `migrationProjects`, `migrationRuns`, `mappingRules`, `stagingRecords`, `migrationRejects` |
| T08 NFR | 19 | RF-NFR-001..004, 006..011, 013..019, 023, 025 | RNF de O1 (73 con T01, T04 y T11; antes 72; v1.2: se agrega RNF-NFR-260, DEC-100) | `dataInventory`, `privacyRequests`, `retentionPolicies` |
| T09 COM | 3 | RF-COM-176, 204, 205 | — | `notificationPreferences` |
| T10 BIA | 35 (antes 34) | RF-BIA-001..009, 011..014, 016, 021..029, 032..034, 040, 046..048, 052, 058, 094, 100 (v1.2: se agrega RF-BIA-104, parte de auditoría; centros de costo en O5 y asociados en O10 como extensión) | REP de plataforma GOB-001; JOB `bia:ejecutar-reporte` | `reportDefinitions`, `reportRuns`, `savedViews`, `exports` |
| T11 WFL | 50 | RF-WFL-010, 011, 013, 023, 029, 030, 041, 042, 044, 045, 048..051, 060..062, 064, 065, 079, 110..121, 123, 124, 130..136, 138, 139, 160, 161, 173, 190, 210, 211, 213 | PAN-WFL de bandeja y aprobaciones | `approvalPolicies`, `approvalRequests`, `delegations`, `tasks`, `caseFiles` |
| **Total** | **459** (antes 458) | | | |

Extensiones de RF de olas anteriores: RF-IAM-021 (2FA de staff), RF-IAM-110 (MFA de plataforma completo), RF-IAM-133 (cadena de hash y verificación), RF-UXD-049, RF-UXD-141.

### 5.5 Fuera de la ola

Campos extra tipados y precarga de catálogos de ejemplo (O2); tablas fiscales e índices económicos (O4, O5); facturación del SaaS con M05 (O5, DEC-065); reportes programados y de módulo (O2+); corridas paralelas y corte (O11).

### 5.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Matriz de permisos inconsistente con el menú | Menú, mapa del sitio y editor de roles leen el mismo `siteMapGroups` (RF-UXD-171) y la intersección licencia × activación × rol × alcance se prueba en CI |
| Configuración publicada sin control | Publicación con aprobación de otro usuario y versión inmutable (T04 §5.3) |
| Accesos de soporte abusivos | Permiso temporal, consentido, con alcance y auditoría (AGR-034) |
| Proveedor federado CiDi | Mecanismo genérico OIDC en O1; CiDi se habilita por tenant al publicar el portal en O2 (DEC-067) |

### 5.7 Datos demo

T01 §18 (planes PLAN-BASICO/ESTANDAR/TOTAL sin precios, contratos SAAS-2026-0001 y 0002, activaciones, checklists, soporte SUP-DEMO-001, GRT-DEMO-001, alertas, backups); T02 §18 (roles y perfiles plantilla); T03 §18; T04 §18 (versiones de configuración, calles y feriados ficticios); T06 §18 (conexiones en `test`); T07 §18 (proyecto de migración de ejemplo con datos ficticios); T10 §18; T11 §18.

### 5.8 Pruebas end-to-end de la ola

CU-MT-01 (alta asistida, T01); CU-IAM-03 y CU-IAM-07, TST-IAM de 2FA, roles, alcance y separación de funciones (T02 §17); ESC-CFG-01..30 (T04 §17); CA-INT-01..15 de conexiones y certificados (T06 §17); CA-WFL de aprobaciones, delegaciones y bandeja (T11 §17); ESC-BIA de motor y exportación (T10 §17); ESC-MIG de proyecto, corrida, rechazos y reproceso (T07 §17); ESC-04 de T08 (restauración sin duplicar efectos externos).

### 5.9 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O1-01 | Ciclo de vida del tenant y tenant PLATFORM | 20 |
| PRO-O1-02 | Licenciamiento en capas y catálogo de módulos | 14 |
| PRO-O1-03 | Contrato SaaS, medición de uso y prefactura (DEC-065) | 8 |
| PRO-O1-04 | Alta asistida con IA y ambientes por tenant | 11 |
| PRO-O1-05 | Soporte de plataforma con acceso temporal auditado | 18 |
| PRO-O1-06 | Tableros, alertas, operación, capacidad y actualizaciones | 24 |
| PRO-O1-07 | Backups, restauración por tenant y salida de datos | 17 |
| PRO-O1-08 | Autenticación completa: 2FA, Google, federado (CiDi), OTP del socio | 26 |
| PRO-O1-09 | Roles, perfiles, alcance, separación de funciones y auditoría avanzada | 36 |
| PRO-O1-10 | Configuración versionada, ámbitos y publicación | 38 |
| PRO-O1-11 | Tablas maestras, enumeraciones, importaciones y reemplazo del motor de pantallas | 26 |
| PRO-O1-12 | Geografía, calles, mapas (DEC-046) y calendarios | 25 |
| PRO-O1-13 | Editor de marca, diccionario versionado y preferencias | 32 |
| PRO-O1-14 | Conexiones de integración, credenciales, certificados y monitoreo | 25 |
| PRO-O1-15 | Eventos y jobs avanzados, operaciones aprobables y máquinas de estado | 20 |
| PRO-O1-16 | Aprobaciones, delegaciones, bandeja del empleado, retención y expediente | 30 |
| PRO-O1-17 | Motor de reportes base y preferencias de notificación | 38 (antes 37; v1.2: RF-BIA-104) |
| PRO-O1-18 | Privacidad (Ley 25.326) y requisitos de seguridad operativos | 19 |
| PRO-O1-19 | Herramienta de migración base | 32 |
| PRO-O1-20 | Integración de O1: alta asistida de una cooperativa | 0 (verifica 459; antes 458) |

#### PRO-O1-01 — Ciclo de vida del tenant y tenant PLATFORM

```text
PRO-O1-01 — Ciclo de vida del tenant
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: tenants con estados Preparación → Prueba → Listo para habilitar → Operativo → Suspendido administrativo → Cierre/salida, checklists por capacidad, y reglas del tenant PLATFORM.
LEER: 00-ESPECIFICACION-MAESTRA.md §6; anexos/T01-PLA-plataforma-saas.md §5.B (RF-PLA-029, 031, 035), §5.C, §5.D, §7.11.1, §7.11.6, §8 (estados del tenant), §9, §10, §11, §12, §17, §18.
IMPLEMENTAR: RF-PLA-029, 031, 035, 038, 039, 041..055.
ENTREGABLES: API /api/platform/tenants (alta, edición de identidad, contactos, región, zona horaria, dominio, slug); máquina de estados con transiciones auditadas y precondiciones; tenantChecklists por capacidad; suspensión administrativa que corta acceso sin perder datos; aislamiento de IA por tenant (aiUsage); pantallas de plataforma de tenants (PAN-PLA correspondientes) en AdminShell modo plataforma; eventos pla.tenant.* por outbox.
NO CONSTRUIR TODAVÍA: licencias (PRO-O1-02), alta asistida con IA (PRO-O1-04), salida y portabilidad (PRO-O1-07).
PRUEBAS: USR-PLAT-001 sin grant recibe 403 en /api/admin/per/persons (RF-PLA-038); un tenant suspendido devuelve 403 tenant-suspended; una transición inválida responde 409; un rol de cooperativa no obtiene capabilities de plataforma.
TERMINADO CUANDO: TEN-001 pasa de Preparación a Prueba con su checklist y todo queda auditado.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep pla && dotnet test --filter Category=Isolation && playwright test --grep @O1-tenants
```

#### PRO-O1-02 — Licenciamiento en capas y catálogo de módulos

```text
PRO-O1-02 — Licenciamiento en capas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: licencia de módulos por la plataforma, activación por el tenant, RBAC y alcance como cuatro filtros cuya intersección define el acceso; catálogo de módulos vendibles y mapa de soluciones.
LEER: 00-ESPECIFICACION-MAESTRA.md §6, §7.1; anexos/T01-PLA-plataforma-saas.md §5.F, §5.P (RF-PLA-162), §7.11.2..7.11.5; 01-registro-decisiones.md DEC-021, DEC-065.
IMPLEMENTAR: RF-PLA-063..075, 162.
ENTREGABLES: moduleCatalog (global) con capacidades y dependencias; platformPlans; tenantLicenses (fuente, vigencia, cupos); tenantModuleActivations por ambiente (production/test/off); middleware que niega cuando el módulo no está licenciado o activado; menú que oculta ítems sin licencia; pantallas de licencias y activaciones.
NO CONSTRUIR TODAVÍA: contrato comercial y medición (PRO-O1-03).
PRUEBAS: con fac en test y mor off, un endpoint de mor responde 403 module-not-active; quitar la licencia oculta el menú y corta la API; activar un módulo sin su dependencia es rechazado.
TERMINADO CUANDO: TEN-001 queda con las activaciones de T01 §18.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep licen && playwright test --grep @O1-licenses
```

#### PRO-O1-03 — Contrato SaaS, medición de uso y prefactura (DEC-065)

```text
PRO-O1-03 — Contrato SaaS y medición de uso
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: contratos SaaS por packs y complementos con cupos por contratos activos, medición de uso y prefactura exportable (la facturación real con M05 llega en O5).
LEER: 01-registro-decisiones.md DEC-065, DEC-077; anexos/T01-PLA-plataforma-saas.md §5.G, §7.11.8, §7.11.9.
IMPLEMENTAR: RF-PLA-076..081, 084, 085.
ENTREGABLES: saasContracts con planes, complementos, cupos (contratos activos, usuarios, GB, mensajería medida); job de usageSnapshots diario por tenant; alertas blandas y duras de cupo; prefactura exportable (XLSX/CSV) por período; pantallas de contrato y uso.
NO CONSTRUIR TODAVÍA: emisión de factura del SaaS (O5, RF-PLA-040, 082); medición de API de terceros (O11, RF-PLA-083).
PRUEBAS: TEN-001 con 4.150 contratos activos sobre 5.000 dispara la alerta blanda de 83 %; la prefactura no tiene datos de otro tenant.
TERMINADO CUANDO: SAAS-2026-0001 muestra uso y prefactura ficticia.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep saas
```

#### PRO-O1-04 — Alta asistida con IA y ambientes por tenant

```text
PRO-O1-04 — Alta asistida y ambientes por tenant
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: asistente de alta de cooperativa con IA que propone y no ejecuta sin confirmación, y ambientes de prueba por tenant con datos anonimizados.
LEER: 00-ESPECIFICACION-MAESTRA.md ARQ-08; anexos/T01-PLA-plataforma-saas.md §5.E, §5.J (RF-PLA-111, 112, 115, 116), §7.11.7; 01-registro-decisiones.md DEC-020.
IMPLEMENTAR: RF-PLA-056..062, 111, 112, 115, 116.
ENTREGABLES: onboardingDrafts paso a paso (identidad, fiscales base, servicios, módulos, usuarios iniciales, marca); gateway de IA de plataforma (clave de plataforma con opción de clave propia del tenant en la bóveda, DEC-020) que solo propone; sandbox del tenant (coop-ejemplo-a-sbx) con copia anonimizada; marca visual de ambiente de prueba.
NO CONSTRUIR TODAVÍA: copias de servicios entre tenants (O2, M02).
PRUEBAS: la IA nunca persiste sin confirmación humana; la copia a sandbox no contiene datos personales en claro; el sandbox no puede usar conexiones production.
TERMINADO CUANDO: TEN-001 se crea con el asistente usando solo datos ficticios.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep onboarding && playwright test --grep @O1-onboarding
```

#### PRO-O1-05 — Soporte de plataforma con acceso temporal auditado

```text
PRO-O1-05 — Soporte con acceso temporal
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: casos de soporte y acceso temporal, consentido, con alcance y auditado a un tenant (AGR-034); usuarios y API de plataforma.
LEER: anexos/T01-PLA-plataforma-saas.md §5.I, §7.11.10..7.11.12; anexos/T02-IAM-identidad-roles-auditoria.md §5.5.
IMPLEMENTAR: RF-PLA-096..108; RF-IAM-111..114, 116.
ENTREGABLES: supportCases y mensajes; supportAccessGrants con modos (observe sin PII, asistido, operar), vencimiento, consentimiento del tenant y revocación; supportSessions con banner visible al usuario del tenant; roles de soporte N1/N2, implementación, operaciones y seguridad; pantallas de soporte en plataforma y de consentimiento en el admin del tenant.
NO CONSTRUIR TODAVÍA: auditoría de plataforma completa (O11, RF-IAM-144).
PRUEBAS: grant vencido niega acceso; modo observe no devuelve campos con PII; cada acción en sesión de soporte queda auditada con el grant.
TERMINADO CUANDO: SUP-DEMO-001 y GRT-DEMO-001 de T01 §18 funcionan de punta a punta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep support && dotnet test --filter Category=Isolation
```

#### PRO-O1-06 — Tableros, alertas, operación, capacidad y actualizaciones

```text
PRO-O1-06 — Tableros, alertas y operación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: tableros y alertas de plataforma, salud de jobs, capacidad y aislamiento de carga, y gestión de versiones y despliegues por anillos.
LEER: anexos/T01-PLA-plataforma-saas.md §5.H, §5.L, §5.M, §5.N, §5.Q (RNF-PLA-011, 012, 014), §7.11.13..7.11.15; anexos/T08-NFR-no-funcionales-seguridad.md §7.2..7.4, §11.3, §11.4, §12.2; 01-registro-decisiones.md DEC-063, DEC-075.
IMPLEMENTAR: RF-PLA-086..094, 129, 131, 132, 134, 135, 138, 140, 141, 144, 145, 148..152; RNF-PLA-011, 012, 014; RNF-NFR-007, 015, 022, 028, 029, 125, 129, 131..136, 172, 173.
DECISIONES v1.2 (10-11-2026): DEC-100 (los hallazgos nuevos del verificador de integridad de PRO-O1-15 generan alerta a operaciones de plataforma: SEV3 por tenant con hallazgos nuevos y SEV2 si la referencia apunta a un documento de otro tenant, que se trata como posible falla de aislamiento; RNF-NFR-132 y 133).
ENTREGABLES: dashboards de plataforma (tenants, uso, salud, colas, integraciones); alertRules y alerts con PLA-ALR-*; cuotas de carga por tenant; release management con anillos (pilot) y feature flags; ventana de mantenimiento comunicada; guardia y tableros.
NO CONSTRUIR TODAVÍA: tableros de negocio de los módulos.
PRUEBAS: certificado a 12 días dispara PLA-ALR-02 (ficticio); un tenant ruidoso no degrada a otro en la prueba de carga; flag fac.nuevoPdf solo encendido en anillo pilot.
TERMINADO CUANDO: ALT-DEMO-001 e INC-DEMO-001 de T01 §18 se ven en el tablero.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep alerts && k6 run infra/k6/tenant-noise.js
```

#### PRO-O1-07 — Backups, restauración por tenant y salida de datos

```text
PRO-O1-07 — Backups, restauración y salida
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: backups verificados, restauración selectiva de un tenant sin retroceder a otros ni duplicar efectos externos, y salida/portabilidad con residencia de datos (DEC-062, DEC-076).
LEER: anexos/T01-PLA-plataforma-saas.md §5.K, §5.O; anexos/T08-NFR-no-funcionales-seguridad.md §8 (RN-NFR-016, RNF-NFR-044); 01-registro-decisiones.md DEC-062, DEC-063, DEC-076.
IMPLEMENTAR: RF-PLA-117..128, 156..160; RNF-NFR-031, 032, 034, 036, 037, 042, 043, 045, 049.
ENTREGABLES: backupRuns lógicos por tenant con verificación; restauración a sandbox y restauración selectiva con conciliación posterior contra evidencia externa (consultas a ARCA, pasarelas, mensajería se agregan como hooks que cada ola registra); ensayo de restauración con RTO medido; exportación completa para salida y destrucción o devolución al fin del encargo con acta.
NO CONSTRUIR TODAVÍA: hooks concretos de ARCA y pasarelas (O4, O5 los registran).
PRUEBAS: restaurar TEN-001 no altera TEN-002; una restauración registra el RTO real; la exportación de salida no incluye datos de otro tenant.
TERMINADO CUANDO: RST-DEMO-001 y el ensayo passed de T01 §18 se reproducen.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep backup && dotnet test --filter Category=Isolation
```

#### PRO-O1-08 — Autenticación completa: 2FA, Google, federado (CiDi), OTP del socio

```text
PRO-O1-08 — Autenticación completa
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: 2FA del personal, login de socio con contraseña u OTP de 6 dígitos (DEC-066, sin enlace mágico), Google OIDC con vínculo explícito, mecanismo genérico de proveedor federado con CiDi Córdoba habilitable por tenant (DEC-067), dispositivos y sesiones.
LEER: 01-registro-decisiones.md DEC-066, DEC-067; anexos/T02-IAM-identidad-roles-auditoria.md §5.1 (RF-IAM-004, 005, 009, 010), §5.2, §7, §10, §11; anexos/T03-UXD-experiencia-marca-diccionario.md §5.9 (RF-UXD-118, 119, 121, 122); anexos/T08-NFR-no-funcionales-seguridad.md §9.4, §9.7.
IMPLEMENTAR: RF-IAM-004, 005, 009, 010, 022..029, 031, 037..039, 042..044, 047..049; RF-UXD-118, 119, 121, 122; RNF-NFR-061..066, 077 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-IAM-021 y RF-IAM-110 (2FA).
ENTREGABLES: TOTP y códigos de respaldo para staff; OTP por correo/SMS para socios habilitable por tenant; Google OIDC sin fusión por correo; proveedor federado OIDC genérico y adaptador CiDi (nivel mínimo 2 para vincular cuentas, conector en test); gestión de sesiones y dispositivos; botones SSO en login con marca del proveedor.
NO CONSTRUIR TODAVÍA: vinculación de cuentas del socio (O2, M19 y M01, DEC-043); publicación del portal (O2).
PRUEBAS: OTP vencido o reutilizado falla; Google con correo coincidente no fusiona identidades; CiDi deshabilitado no muestra botón; staff sin 2FA no entra cuando el tenant lo exige.
TERMINADO CUANDO: USR-ADM-A entra con 2FA y un socio ficticio con OTP en el entorno de prueba.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep auth && playwright test --grep @O1-auth
```

#### PRO-O1-09 — Roles, perfiles, alcance, separación de funciones y auditoría avanzada

```text
PRO-O1-09 — Roles, perfiles, alcance y auditoría avanzada
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: roles funcionales editables, perfiles de pantallas, alcance de datos (tenant, sucursales, puntos de venta, zonas, servicios, cuadrillas, depósitos, propios), regla de combinación, separación de funciones, autorizaciones de supervisor, franja horaria, permisos de IA y auditoría con cadena de hash.
LEER: 00-ESPECIFICACION-MAESTRA.md §7; anexos/T02-IAM-identidad-roles-auditoria.md §4, §5.3, §5.4, §5.6, §5.7, §7, §8, §10, §11, §17; anexos/T08-NFR-no-funcionales-seguridad.md §11.1, §9.14.
IMPLEMENTAR: RF-IAM-062..079, 090..096, 135, 137, 138, 140..143, 150..153; RNF-NFR-113..117, 231..233 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-IAM-133 (encadenamiento de hash por tenant y job de verificación).
DECISIONES v1.2 (10-11-2026): DEC-096 (dimensión de alcance "entidad jurídica", `scope.legalEntities[]`, en las asignaciones de roles, RF-IAM-065; los recursos compartidos del tenant sin `legalEntityId`, como personas y cuentas de M01, no se filtran por esta dimensión; completa DEC-064).
ENTREGABLES: roles y perfiles plantilla de plataforma copiables al tenant; editor de roles sobre siteMapGroups; dataScopes aplicados por un helper único en repositorios; matriz de separación de funciones; autorización de supervisor en el momento o diferida; franja horaria por perfil; auditoría de IA; cadena de hash y alerta de integridad; pantallas de usuarios, roles, perfiles y auditoría.
NO CONSTRUIR TODAVÍA: alcance por cuadrilla o depósito con datos reales (llegan con O3).
PRUEBAS: un cajero con alcance sucursal A no ve sucursal B; el mismo usuario no puede crear y aprobar lo que la matriz separa; modificar un registro de auditoría rompe la cadena y el job alerta.
TERMINADO CUANDO: TEN-001 tiene roles del maestro §7.2 configurados con datos ficticios.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep rbac && dotnet test --filter Category=Isolation
```

#### PRO-O1-10 — Configuración versionada, ámbitos y publicación

```text
PRO-O1-10 — Configuración versionada y publicación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: valores de parámetros por ámbito (plataforma, tenant, servicio, categoría y otros) con versiones de configuración en borrador, revisión, publicación con aprobación y vigencia, historia y comparación.
LEER: 00-ESPECIFICACION-MAESTRA.md ARQ-05; anexos/T04-CFG-configuracion-parametros-maestros.md §5.1 (RF-CFG-006, 010..016), §5.2, §5.3, §5.14 (RF-CFG-120, 121), §5.15 (RF-CFG-124, 128), §5.17, §7, §8, §10, §11, §14, §17; anexos/T04b-CFG-catalogo-parametros-procoop-parte1.md a parte4.md solo como catálogo de claves de referencia.
IMPLEMENTAR: RF-CFG-006, 010..016, 018..040, 042..044, 120, 121, 124, 128; RNF-CFG-001..005, 007, 008.
DECISIONES v1.2 (10-11-2026): DEC-096 (ámbito `legalEntity` entre `tenant` y `branch` en el registro y la resolución de parámetros, RF-CFG-018 a 020; completa DEC-064).
ENTREGABLES: parameterValues por ámbito con resolución de precedencia; configVersions (draft, inReview, published, retired) con aprobación de un segundo usuario, programación de vigencia y reversión; lectura tipada cacheada por tenant con invalidación por evento; pantallas de parámetros, versiones, comparación e historia.
NO CONSTRUIR TODAVÍA: campos extra y personalización de formularios (O2); parámetros de dominio de módulos (cada módulo declara los suyos en su ola).
PRUEBAS: un valor de servicio pisa el de tenant; publicar sin aprobación falla; una versión programada rige desde su fecha en la zona del tenant; dos tenants no comparten caché.
TERMINADO CUANDO: TEN-001 publica una versión de configuración aprobada por un segundo usuario.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep config && playwright test --grep @O1-config
```

#### PRO-O1-11 — Tablas maestras, enumeraciones, importaciones y reemplazo del motor de pantallas

```text
PRO-O1-11 — Tablas maestras e importaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: editor uniforme de tablas maestras, enumeraciones configurables, importación de padrones y maestros con ExcelImportWizard, tablas fiscales comunes de plataforma (estructura), reemplazo del motor de pantallas configurable de ProCoop y equivalencias de migración.
LEER: anexos/T04-CFG-configuracion-parametros-maestros.md §5.4, §5.5 (RF-CFG-054, 055, 057, 058), §5.10 (RF-CFG-100), §5.11, §5.13 (RF-CFG-114..117), §5.16, §7, §10, §11; anexos/T08-NFR-no-funcionales-seguridad.md §9.9.
IMPLEMENTAR: RF-CFG-045..055, 057, 058, 100, 104..107, 114..117, 130, 131, 133; RNF-NFR-089; además (v1.1): RF-CFG-141 (`workstations`: puestos físicos de cada sucursal con su agente local y dispositivos; las cajas de M07 y el turnero de M09 referencian `workstationId`).
ENTREGABLES: masterTables genérico con alta, edición, baja lógica, vigencias y auditoría; enumerations por tenant con claves dict; importaciones por job con preview y rechazos; estructura de tablas fiscales comunes de plataforma; registro de equivalencias legacy de valores.
NO CONSTRUIR TODAVÍA: padrones fiscales ARCA e IIBB (O4, RF-CFG-056, 098, 099, 101, 102).
PRUEBAS: una importación con errores no confirma nada hasta aceptar; una enumeración en uso no se elimina; equivalencias resuelven un código legacy ficticio.
TERMINADO CUANDO: el editor gestiona al menos tres tablas maestras de ejemplo de T04 §18.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep master && playwright test --grep @O1-master
```

#### PRO-O1-12 — Geografía, calles, mapas (DEC-046) y calendarios

```text
PRO-O1-12 — Geografía, calles, mapas y calendarios
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: provincias, localidades, barrios, calles y numeración con normalización y geocodificación Georef y mapa y autocompletado Google Maps (DEC-046, claves de plataforma con opción propia DEC-020); calendarios, feriados y días hábiles por tenant.
LEER: 01-registro-decisiones.md DEC-020, DEC-046; anexos/T04-CFG-configuracion-parametros-maestros.md §5.7, §5.8, §7, §10, §11, §13; anexos/T06-INT-integraciones.md (fichas de Georef y Google Maps).
IMPLEMENTAR: RF-CFG-065..089.
ENTREGABLES: tablas SQL geográficas (plataforma y tenant); calles con alias y rangos; conectores Georef y Google Maps en modo test con simulador; componente AddressPicker con mapa (frontend/packages/ui (React)); calendars y holidays con cálculo de días hábiles en la zona del tenant; importación de calles.
NO CONSTRUIR TODAVÍA: domicilios de personas (O2, M01).
PRUEBAS: una dirección ficticia se normaliza y geocodifica con el simulador; el cálculo de vencimiento a 10 días hábiles salta feriados de TEN-001; las calles de TEN-001 no aparecen en TEN-002.
TERMINADO CUANDO: AddressPicker funciona en una pantalla de prueba con calles ficticias.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep geo && playwright test --grep @O1-geo
```

#### PRO-O1-13 — Editor de marca, diccionario versionado y preferencias

```text
PRO-O1-13 — Marca, diccionario y preferencias
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: editor de marca por tenant con validación de contraste y previews, editor y publicación versionada del diccionario, layouts restantes, accesibilidad del editor, mapa del sitio con accesos fijados y preferencias de usuario.
LEER: anexos/T03-UXD-experiencia-marca-diccionario.md §5.1 (RF-UXD-008), §5.2 (020), §5.3, §5.4 (046, 051, 057), §5.6 (080), §5.7 (096), §5.8 (107), §5.10 (136), §5.11, §5.12, §7, §10, §11; anexos/T08-NFR-no-funcionales-seguridad.md §13.1, §13.4.
IMPLEMENTAR: RF-UXD-008, 020, 022..024, 028, 030..034, 037..039, 046, 051, 057, 080, 096, 107, 136, 143, 148, 152..154, 162, 164, 165, 173, 174, 177; RNF-NFR-182, 196 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-UXD-049 y RF-UXD-141.
ENTREGABLES: editor de marca (logos jerárquicos, colores con contraste AA, splash e imágenes por canal, previews celular y escritorio) con publicación; editor de diccionario con variables, pluralización, variantes por canal, versión y publicación por tenant; vistas guardadas de DataTable (RF-UXD-096); accesos fijados y preferencias.
NO CONSTRUIR TODAVÍA: salas BI (O11, extensión de RF-UXD-096).
PRUEBAS: un color sin contraste suficiente no se publica; una clave editada en TEN-001 no cambia en TEN-002; la versión anterior del diccionario se restaura.
TERMINADO CUANDO: TEN-001 publica marca y vocabulario propio ("asociado" en lugar de "socio") y se refleja en admin y PWA.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep branding && playwright test --grep @O1-brand
```

#### PRO-O1-14 — Conexiones de integración, credenciales, certificados y monitoreo

```text
PRO-O1-14 — Conexiones de integración
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: conexiones por tenant sobre el catálogo de proveedores, credenciales en la bóveda con rotación, modo prueba y producción con aprobación, prueba de conexión y monitoreo.
LEER: anexos/T06-INT-integraciones.md §5.1, §5.2, §5.4, §5.5 (042, 043), §5.6 (050, 051), §5.9, §7, §10 (PAN-INT-01..20), §11, §17; anexos/T08-NFR-no-funcionales-seguridad.md §9.5.
IMPLEMENTAR: RF-INT-002..004, 006, 007, 009, 011..014, 016..020, 028, 029, 042, 043, 050, 051, 070..072, 077; RNF-NFR-068, 069.
ENTREGABLES: integrationConnections (configuración no secreta y referencias a secretos), alta y rotación de credenciales sin mostrar valores, cambio de modo test/production auditado con aprobación y prueba obligatoria, indicador MODO PRUEBA en pantallas y documentos, monitoreo de operaciones y bitácora, conciliación y alertas por conector.
NO CONSTRUIR TODAVÍA: certificados ARCA y caché de tokens (O4, RF-INT-022..027); webhooks entrantes de pasarelas (O5).
PRUEBAS: un secreto rotado nunca se muestra; pasar a production sin prueba exitosa falla; un usuario sin int.conexiones.configurar recibe 403.
TERMINADO CUANDO: TEN-001 tiene conexiones de ejemplo en test contra el simulador y el monitoreo las muestra.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep connections && playwright test --grep @O1-int
```

#### PRO-O1-15 — Eventos y jobs avanzados, operaciones aprobables y máquinas de estado

```text
PRO-O1-15 — Eventos, jobs, operaciones y estados
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar el bus (cola de no entregados, monitoreo), jobs (cancelación, pausa, prioridades), operaciones sensibles con aprobación, vencimiento y revalidación, y el motor de máquinas de estado canónicas.
LEER: anexos/T11-WFL-workflow-eventos-documentos.md §5.1 (010, 011, 013), §5.2 (023, 029, 030), §5.3, §5.4 (060..062, 064, 065), §5.5 (079), §8, §12; anexos/T08-NFR-no-funcionales-seguridad.md §14.2.
IMPLEMENTAR: RF-WFL-010, 011, 013, 023, 029, 030, 041, 042, 044, 045, 048..051, 060..062, 064, 065, 079; RNF-NFR-222. Además (v1.2): RNF-NFR-260 (verificador nocturno de integridad referencial por tenant, job `nfr:verificar-referencias` JOB-NFR-25: recorre las referencias declaradas en T05 e informa sin corregir en la bandeja de integridad de la bandeja operativa, tipo `referentialIntegrity`, con alerta a operaciones; DEC-100).
DECISIONES v1.2 (10-11-2026): DEC-100 (la integridad entre tablas SQL no usa claves foráneas, incompatibles con DEC-001: se garantiza con módulo dueño, `ObjectId` y foto en lo emitido, `$jsonSchema`, control optimista y el verificador nocturno de RNF-NFR-260, que lee el registro de referencias generado desde los esquemas, T05 §7.1.16, corre en la cola de baja prioridad con la cuota del tenant y no escribe en tablas SQL de negocio; la alerta se construye en PRO-O1-06). Leer además 01-registro-decisiones.md DEC-100 y anexos/T05-DAT-modelo-datos.md §7.1.16. PRUEBAS adicionales: una referencia rota inyectada en TEN-001 aparece en la bandeja de integridad; la corrida no hace ninguna escritura en tablas SQL de negocio; una referencia a un documento de TEN-002 dispara SEV2.
ENTREGABLES: dead letter y reintento manual de eventos; pausa, cancelación y prioridad de bulkRuns; operaciones con estados draft, pendingApproval, approved, executed, expired, rejected y revalidación tras PRM-WFL-011 horas; motor declarativo de máquinas de estado con transiciones auditadas; extensión DEC-079 (trámites de tipo solicitud genérica) como punto de extensión.
NO CONSTRUIR TODAVÍA: diseñador de trámites y formularios dinámicos (O2).
PRUEBAS: una operación vencida no se ejecuta; un evento fallido 5 veces va a dead letter y se reprocesa manualmente sin duplicar; una transición no declarada es rechazada.
TERMINADO CUANDO: una operación de ejemplo pasa por aprobación y ejecución idempotente.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep operations && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O1-16 — Aprobaciones, delegaciones, bandeja del empleado, retención y expediente

```text
PRO-O1-16 — Aprobaciones, bandeja y expediente
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: políticas de aprobación por bandas de importe y pasos, delegaciones, vencimiento y escalamiento, bandeja unificada del empleado, retención documental, editor de plantillas del tenant, numeración avanzada y expediente digital.
LEER: anexos/T11-WFL-workflow-eventos-documentos.md §5.8 (110..121, 123, 124), §5.9 (130..136, 138, 139), §5.11 (160, 161), §5.12 (173), §5.13 (190), §5.15 (210, 211, 213), §5.17 (RNF-WFL-003), §7, §10, §11.
IMPLEMENTAR: RF-WFL-110..121, 123, 124, 130..136, 138, 139, 160, 161, 173, 190, 210, 211, 213; RNF-WFL-003.
ENTREGABLES: approvalPolicies, approvalRequests con evidencia de decisión; delegations con límite de importe; bandeja PWA y admin con filtros, vistas guardadas y contadores en tiempo real; retención y purga física por política; editor de plantillas del tenant sobre zonas permitidas; expediente digital por sujeto.
NO CONSTRUIR TODAVÍA: bandeja de mesa de entradas (O10).
PRUEBAS: un aprobador sin límite suficiente no aprueba; una delegación vencida no vale; la purga respeta retención mínima; el expediente de TEN-001 no muestra documentos de TEN-002.
TERMINADO CUANDO: una aprobación con dos pasos aparece en la bandeja del empleado y se resuelve con evidencia.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep approvals && playwright test --grep @O1-inbox
```

#### PRO-O1-17 — Motor de reportes base y preferencias de notificación

```text
PRO-O1-17 — Motor de reportes base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: catálogo único de reportes, ejecución síncrona o asíncrona por costo, exportación XLSX/CSV/PDF por job con descarga firmada, vistas guardadas, tablero de plataforma GOB-001, auditoría de acceso a reportes y preferencias de notificación del usuario.
LEER: anexos/T10-BIA-reportes-bi-apis.md §5 (RF-BIA de O1), §7, §9, §10, §11, §12, §14, §17; anexos/T09-COM-comunidad-comunicaciones.md §5.10 (RF-COM-176), §5.13 (204, 205).
IMPLEMENTAR: RF-BIA-001..009, 011..014, 016, 021..029, 032..034, 040, 046..048, 052, 058, 094, 100; RF-COM-176, 204, 205. Además (v1.2): RF-BIA-104 (filtro por entidad jurídica, DEC-096; en este prompt la parte de auditoría: PAN-BIA-19, REP-BIA-002 y REP-IAM-001 a 016 sobre `auditLogs.legalEntityId` y `auditReads.legalEntityId`, con la opción "sin entidad", visible solo con PRM-CFG-039 = true y limitado al alcance del usuario, en los parámetros de la ejecución, el encabezado de la salida, los presets y los filtros globales del tablero).
DECISIONES v1.2 (10-11-2026): DEC-096 (RF-BIA-104 en su parte de auditoría; RF-BIA-004 y 034 limitan las entidades al alcance del usuario; las partes de centros de costo y de asociados son extensiones en PRO-O5-11 y PRO-O10-01, y las tablas del almacén analítico en PRO-O11-01). PRUEBAS adicionales: PAN-BIA-19 filtrado por COOP no muestra exportaciones de MUTUAL; con una sola entidad el filtro no se muestra.
ENTREGABLES: reportDefinitions con ficha, parámetros, capabilities y sensibilidad; job bia:ejecutar-reporte; exportaciones con vencimiento y descarga revalidada; tablero GOB-001; pantallas PAN-BIA de catálogo, ejecución y exportaciones; preferencias de canal por usuario.
NO CONSTRUIR TODAVÍA: reportes programados (O2) ni almacén analítico (O11).
PRUEBAS: un reporte sin capability no se lista; el enlace de descarga revalida permiso; una exportación grande corre en job y notifica.
TERMINADO CUANDO: dos reportes de plataforma se ejecutan y exportan con datos ficticios.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep bia && playwright test --grep @O1-reports
```

#### PRO-O1-18 — Privacidad (Ley 25.326) y requisitos de seguridad operativos

```text
PRO-O1-18 — Privacidad y seguridad operativa
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: inventario de datos personales desde metadatos de esquemas, finalidades y bases legales, derechos del titular, retención y anonimización, registro de subencargados (DEC-076) y requisitos operativos de seguridad.
LEER: 01-registro-decisiones.md DEC-076; anexos/T08-NFR-no-funcionales-seguridad.md §5.1 (RF-NFR de O1), §9.11, §10.2, §12.1, §15.9.
IMPLEMENTAR: RF-NFR-001..004, 006..011, 013..019, 023, 025; RNF-NFR-095, 103, 107..109, 150, 157, 246, 247, 250, 252, 254..257, 259.
ENTREGABLES: metadatos de sensibilidad en esquemas EF Core y generador del inventario; privacyRequests con plazos legales; políticas de retención por tabla y job de anonimización; registro público de subencargados; EIPD como plantilla obligatoria por funcionalidad sensible; pruebas de seguridad periódicas.
NO CONSTRUIR TODAVÍA: portal "Mis datos y privacidad" del socio (O2, RF-NFR-005, 012).
PRUEBAS: una tabla con campo personal sin metadatos hace fallar CI; una solicitud de supresión respeta datos con obligación legal de conservación.
TERMINADO CUANDO: el inventario generado lista todas las tablas SQL de O0 y O1.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep privacy && python docs/especificacion/_trabajo/plan_recuento.py
```

#### PRO-O1-19 — Herramienta de migración base

```text
PRO-O1-19 — Herramienta de migración base
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: proyectos de migración por cooperativa, extracción, perfilado y limpieza, reglas de mapeo versionadas, staging, carga por servicio del módulo dueño en modo migration, rechazos, reprocesos idempotentes, conciliación, consulta de históricos y anonimización. Sin datos reales: solo bases ficticias de ejemplo.
LEER: 01-registro-decisiones.md DEC-068, DEC-070; anexos/T07-MIG-migracion-procoop.md §5.1..§5.7, §5.10, §7, §9, §10, §11, §12, §17, §18.
IMPLEMENTAR: RF-MIG-001..005, 010, 013..015, 020, 024, 025, 027, 028, 030..032, 035, 040, 043..046, 050..053, 058, 062, 095..097.
DECISIONES v1.2 (10-11-2026): DEC-103 (antes de cada extracción corre un escaneo previo de la base de origen que busca números de tarjeta con validación de Luhn y columnas con apariencia de credencial no listadas, incluido `CUPONTAR`; si encuentra alguno bloquea la migración hasta que la columna se clasifique y se suprima; RN-MIG-013 suma a lo que no se migra la clave web de `SOCIOS`, la clave del proveedor de IA de `VARIABLE` y las credenciales de proveedores, profesionales y empleados; RF-MIG-010; amplía DEC-091 y DEC-092). PRUEBAS adicionales: una columna ficticia con un número que pasa Luhn bloquea la corrida hasta clasificarla.
ENTREGABLES: migrationProjects (sigla ProCoop, versión, fuentes), migrationRuns con estados y reanudación, extractores a snapshot (sobre PRO-O0-20), perfilado y reglas de calidad, mappingRules versionadas, staging, cargador que invoca servicios del dueño en modo migration (sin eventos que disparen efectos externos), rechazos con motivo y reproceso, conciliación por conteos y sumas, anonimización para ambientes no productivos, pantallas PAN-MIG.
NO CONSTRUIR TODAVÍA: mapeos de dominio (cada ola agrega los de su módulo), paralelo, by-pass y corte (O11).
PRUEBAS: reprocesar una corrida no duplica; un rechazo queda con motivo y se corrige con regla nueva; la anonimización no deja DNI ni correos reales.
TERMINADO CUANDO: una base ficticia de ejemplo se migra a staging con reporte de conciliación.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep mig && playwright test --grep @O1-mig
```

#### PRO-O1-20 — Integración de O1: alta asistida de una cooperativa

```text
PRO-O1-20 — Integración de O1
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O1 (sección 5.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §5; §17 y §18 de T01, T02, T04, T06, T07, T10 y T11.
IMPLEMENTAR: ningún RF nuevo. Verificar los 459 RF de O1 (antes 458; versión 1.0: 457), los 73 RNF de O1 (antes 72) y sus extensiones.
ENTREGABLES: seed demo O1; e2e @O1 del recorrido completo de alta asistida (5.2); test:isolation sobre todas las tablas SQL nuevas; prueba de carga de lectura de configuración; reporte trace:check.
NO CONSTRUIR TODAVÍA: nada de O2.
PRUEBAS: e2e @O1, test:isolation, k6 config-read.
TERMINADO CUANDO: criterio 5.2 demostrado con evidencias en docs/evidencias/O1/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O1 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 6. O2 — Personas, catálogo, landing, portal base, CRM de solicitudes y comunidad

### 6.1 Objetivo

Construir el núcleo comercial sin dinero: personas, titulares, cuentas, domicilios e inmuebles (M01); registro básico de asociados (M17, solo vínculo con persona); catálogo de servicios, perfiles por servicio, productos, planes, categorías y contrato de servicio (M02); expediente y solicitudes comerciales del CRM (M09); comunidad y comunicaciones (T09); trámites configurables, formularios dinámicos, SLA, agenda y gestión documental avanzada (T11); landing pública, registro, vinculación de cuentas y portal del socio (M19); campos extra tipados y precargas de catálogos (T04).

### 6.2 Criterio de salida (demostrable)

Ana Demo (persona ficticia) se registra en la PWA de TEN-001 con OTP, vincula su cuenta por código de vinculación, ve la oferta de Internet INT-100 publicada en la landing, inicia la solicitud de alta como trámite configurable con formulario dinámico, el operador la recibe en el expediente del CRM, crea el contrato de servicio en estado `requested` (Pendiente de instalación), y Ana recibe la notificación por correo e in-app con la plantilla y la audiencia del motor de comunicaciones. El servicio Internet queda configurado según T12 parte1 §1.3 (perfil de servicio, planes, categorías y estados).

### 6.3 Dependencias

O1 completa (configuración publicable, geografía y calles, roles y alcance, workflow de aprobaciones, conexiones, reportes base, migración base).

### 6.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M01 PER | 144 (antes 142) | RF-PER-001..015, 017..019, 021..028, 030..048, 050, 052, 054..058, 060, 061, 063, 064, 068..094, 099..106, 108, 118..125, 128..132, 135..139, 142..172 (v1.1: se agregan RF-PER-173) (v1.2: se agregan RF-PER-174, 175) | PAN-PER-01..28, API-PER-01..76 (*reemplazado, corrección 05-11-2026:* antes API-PER-01..75; 76 definidos en el anexo), EVT-PER-01..25, JOB-PER-01..12 (salvo los de facturación y cobranza) | `persons`, `holders`, `accounts`, `addresses`, `properties`, `servicePoints`, `relationships`, `personNotes`, `blocks`, `personDocuments`, `ownershipTransfers` |
| M17 INS | 11 | RF-INS-001..004, 009, 015, 017, 099, 104, 105, 107 | Parte de PAN-INS y API-INS del registro de asociados | `associates` |
| M02 CAT | 77 | RF-CAT-001..020, 023..043, 045, 047, 049, 053..055, 057, 061..065, 067..070, 072..074, 076..078, 082, 084, 092, 094, 104..113 | PAN-CAT-01..27, API-CAT-01..56 (*reemplazado, corrección 05-11-2026:* antes API-CAT-01..55; 56 definidos en el anexo) (los no fiscales), EVT-CAT provisionales de T11 §12.3 (ver §19, C-10) | `serviceCatalog`, `tenantServices`, `serviceProfiles`, `products`, `plans`, `packages`, `categories`, `contractStates`, `serviceContracts`, `contractEvents` |
| M13 STK | 2 | RF-STK-082, 132 | — | Referencias de equipos en comodato y stock por servicio |
| M09 CRM | 49 (antes 48) | RF-CRM-001..016, 018, 023..025, 031, 034..039, 043, 045, 047, 048, 060..067, 076..079, 083, 158, 170, 186, 255 (v1.2: se agrega RF-CRM-261) | PAN-CRM-01..36 (expediente, bandejas, solicitudes), API-CRM-01..80 de esos recursos | `tickets`, `ticketTypes`, `queues`, `commercialRequests`, `ticketEvents` |
| T09 COM | 126 | RF-COM-001..026, 030..037, 040..057, 060..063, 070..083, 088..091, 093, 100..106, 110..119, 130..137, 139, 140, 142..144, 146, 149, 151, 153..156, 160, 162, 170..173, 175, 180, 190..194, 197 | PAN-COM-01..34, 40..53 (*reemplazado, corrección 05-11-2026:* antes PAN-COM-01..32; 48 definidos en el anexo), API-COM-01..33, 40..61, 65..71, 75..112 (*reemplazado, corrección 05-11-2026:* antes API-COM-01..68; 100 definidos en el anexo), EVT-COM-01..39 (*reemplazado, corrección 05-11-2026:* antes EVT-COM-01..16; 39 definidos en el anexo) | `posts`, `comments`, `reactions`, `moderationCases`, `newsletters`, `surveys`, `events`, `benefits`, `audiences`, `messageTemplates`, `messages`, `campaigns` |
| T11 WFL | 40 | RF-WFL-063, 070..078, 080..082, 090..096, 100..102, 104, 105, 137, 140..145, 155, 156, 158, 162, 164, 201, 214, 215 | PAN-WFL de trámites, formularios y agenda | `procedureTypes`, `procedures`, `formDefinitions`, `formSubmissions`, `slaPolicies`, `calendarEvents` |
| M19 POR | 97 (antes 96) | RF-POR-001..011, 013..019, 021..030, 032..034, 036..042, 046..048, 051..054, 056..065, 067, 070, 071, 109..112, 114, 116, 117, 121..126, 134, 137..156, 158, 160 (v1.1: se agregan RF-POR-174, 179; cierre 05-11-2026: se agrega RF-POR-180) | PAN-POR-01..105 (*reemplazado, cierre 05-11-2026:* antes PAN-POR-01..104, que reemplazaba a PAN-POR-01..97; 105 definidos en el anexo, PAN-POR-105 Comunidad) (landing, registro, inicio, servicios, gestiones, comunidad, administración del portal) | `portalSettings`, `portalPages`, `accountLinks`, `linkCodes`, `portalSessions` |
| T03 UXD | 13 | RF-UXD-072..078, 086, 089, 120, 167, 170 (v1.1: se agregan RF-UXD-179) | — | — |
| T04 CFG | 21 | RF-CFG-017, 041, 059..064, 097, 108..113, 118, 119, 125..127, 129 | PAN-CFG de campos extra y precargas | `extraFieldDefinitions`, `seedPacks` |
| T06 INT | 3 | RF-INT-008, 058, 086 | Webhooks entrantes base | `inboundWebhooks` |
| T07 MIG | 8 | RF-MIG-012, 021..023, 026, 034, 039, 090 | Mapeos de personas, cuentas y servicios | — |
| T08 NFR | 2 | RF-NFR-005, 012 | RNF de O2 (15) | — |
| T10 BIA | 22 | RF-BIA-010, 017..019, 030, 031, 035..039, 049..051, 053..057, 059, 097, 103 | Reportes programados y de padrón | `reportSchedules` |
| T01 PLA | 2 | RF-PLA-164, 165 (v1.1, fila nueva) | — | — |
| **Total** | **617** (antes 614; cierre 05-11-2026: antes 613) | | | |

Extensiones: RF-INT-085 (agente local y mensajería, parte de canales de comunicación).

### 6.5 Fuera de la ola

Factibilidad, órdenes de trabajo e instalación (O3); facturación, fiscal y tarifas (O4); cobranza (O5); reclamos completos e IA del CRM (O3 y O6); adherentes (O10, ver §19 C-02); capital social (O5); mesa de entradas y turnero (O10).

### 6.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Duplicados de personas por CUIT/DNI | Unicidad por tenant con normalización y motor de duplicados (M01 §5.14) |
| Vinculación de cuenta por terceros | Código de un solo uso, vencimiento y segundo factor; nunca fusión automática por correo (DEC-043) |
| Spam o abuso en comunidad | Moderación IA más humana con sanciones (T09 §5.3) |
| Catálogo divergente entre tenants | Catálogo de plataforma más habilitación por tenant y copia controlada (M02 §5.8) |
| Ausencia de EVT-CAT en M02 | Usar los nombres provisionales de T11 §12.3 y marcarlo en el PR (HUE-SRV-02, HUECO-TRV-03) |

### 6.7 Datos demo

M01 §18 (Ana Demo y otras personas ficticias, CUIT de prueba que no corresponden a personas reales); M02 §18 y T12 parte1 §1.3 (Internet INT-100, planes y categorías), con los nombres de tenant de T01 según R14; M09 §18; T09 §18 (publicaciones, encuesta y campaña de ejemplo); M19 §18; T11 §18.

### 6.8 Pruebas end-to-end de la ola

ESC-SRV-INT-01 hasta la creación del contrato (T12 parte1 §1.7; antes citaba §1.6, que es eventos y jobs); CU de M01 §17 (alta de persona con validación de CUIT simulada, titular, cuenta y domicilio); CU de M02 §17 (publicación de catálogo, alta de contrato); CU de M09 §17 (solicitud comercial); CU de T09 §17 (publicación con moderación, campaña con audiencia); CU de M19 §17 (registro, vinculación, oferta, solicitud); CA-WFL de trámites y formularios.

### 6.9 Huecos que se resuelven en la ola

HUE-SRV-01, 02, 03, 04, 05, 07 y 09; HUECO-TRV-01 (adherentes como entidad de M18 con referencia desde M01, implementado como extensión que llega en O4 y O10), HUECO-TRV-02, 03 y 04. Se aplica R9.

### 6.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O2-01 | Trámites configurables, formularios dinámicos, SLA, agenda y documental avanzada | 40 |
| PRO-O2-02 | Campos extra tipados, precargas y perfil de configuración por servicio | 21 |
| PRO-O2-03 | Personas e identificación fiscal | 26 |
| PRO-O2-04 | Contactos, consentimientos, titulares y cuentas | 36 |
| PRO-O2-05 | Domicilios, geolocalización, inmuebles y puntos de prestación | 22 |
| PRO-O2-06 | Relaciones, notas, bloqueos, documentación y transferencias | 27 |
| PRO-O2-07 | Ficha 360, padrón, historia, duplicados, privacidad e importación | 33 (antes 31; v1.2: RF-PER-174, 175) |
| PRO-O2-08 | Registro básico de asociados (M17) | 11 |
| PRO-O2-09 | Catálogo de servicios, perfil por servicio y versionado | 35 |
| PRO-O2-10 | Productos, planes, categorías, estados y contrato de servicio | 47 |
| PRO-O2-11 | CRM: expediente, bandejas y tickets | 36 (antes 35; v1.2: RF-CRM-261) |
| PRO-O2-12 | CRM: solicitudes comerciales | 13 |
| PRO-O2-13 | Comunidad: muro, reacciones y moderación | 52 |
| PRO-O2-14 | Boletines, encuestas, eventos, beneficios y audiencias | 40 |
| PRO-O2-15 | Motor de comunicaciones multicanal, preferencias y campañas | 37 |
| PRO-O2-16 | Landing pública, registro y vinculación de cuentas | 44 |
| PRO-O2-17 | Portal del socio: inicio, servicios, gestiones, comunidad y administración | 65 (antes 64) |
| PRO-O2-18 | Reportes programados, privacidad del socio y mapeos de migración | 32 |
| PRO-O2-19 | Integración de O2: el socio se registra y solicita Internet | 0 (verifica 617; antes 614 y 613) |

#### PRO-O2-01 — Trámites configurables, formularios dinámicos, SLA, agenda y documental avanzada

```text
PRO-O2-01 — Trámites, formularios, SLA y agenda
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: motor de trámites configurables por tenant (tipos, pasos, responsables, documentos requeridos), formularios dinámicos tipados con validación FluentValidation y contratos Shared generada, SLA con vencimiento y escalamiento, agenda y calendario, gestión documental avanzada, firma simple y expediente ampliado.
LEER: anexos/T11-WFL-workflow-eventos-documentos.md §5.4 (RF-WFL-063), §5.5, §5.6, §5.7, §5.9 (137), §5.10, §5.11 (155, 156, 158, 162, 164), §5.14 (201), §5.15 (214, 215), §7, §8, §10, §11, §17; 01-registro-decisiones.md DEC-079.
IMPLEMENTAR: RF-WFL-063, 070..078, 080..082, 090..096, 100..102, 104, 105, 137, 140..145, 155, 156, 158, 162, 164, 201, 214, 215.
ENTREGABLES: procedureTypes versionados y procedures con máquina de estados declarativa; formDefinitions con tipos (texto, número, fecha, lista, archivo, domicilio con AddressPicker, firma) y renderizador común en admin y PWA; slaPolicies en días hábiles del calendario del tenant y job de escalamiento; calendarEvents y vista agenda; versionado de documentos y vínculo a expediente; firma simple con evidencia.
NO CONSTRUIR TODAVÍA: firma con certificado y portal del empleado (O9); mesa de entradas (O10).
PRUEBAS: un formulario publicado no cambia trámites ya iniciados; el SLA vence en día hábil y escala; un documento requerido faltante bloquea el avance del paso.
TERMINADO CUANDO: el trámite "Solicitud de alta de servicio" de ejemplo se diseña y ejecuta en admin y PWA.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep procedures && playwright test --grep @O2-procedures
```

#### PRO-O2-02 — Campos extra tipados, precargas y perfil de configuración por servicio

```text
PRO-O2-02 — Campos extra, precargas y perfil por servicio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: campos extra tipados por entidad y servicio con validación y búsqueda, precarga de catálogos de ejemplo para nuevos tenants, reglas transversales del perfil de configuración por servicio y tablas fiscales comunes de consulta.
LEER: anexos/T04-CFG-configuracion-parametros-maestros.md §5.1 (RF-CFG-017), §5.3 (041), §5.6, §5.10 (097), §5.12, §5.13 (118, 119), §5.15 (125..127, 129), §7, §10, §11.
IMPLEMENTAR: RF-CFG-017, 041, 059..064, 097, 108..113, 118, 119, 125..127, 129.
ENTREGABLES: extraFieldDefinitions (tipo, obligatoriedad, visibilidad por canal y rol, índice) aplicables a personas, cuentas, contratos y tickets; componente ExtraFields; seedPacks de plataforma (servicios, categorías, plantillas, roles) aplicables en el alta; perfil por servicio con reglas transversales.
NO CONSTRUIR TODAVÍA: perfiles fiscales del servicio (O4).
PRUEBAS: un campo extra obligatorio se valida en API y UI; un seedPack aplicado dos veces no duplica; los campos extra de TEN-001 no existen en TEN-002.
TERMINADO CUANDO: TEN-002 nuevo recibe el seedPack de ejemplo y se ve en sus catálogos.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep extraFields && dotnet test --filter Category=Isolation
```

#### PRO-O2-03 — Personas e identificación fiscal

```text
PRO-O2-03 — Personas e identificación fiscal
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: persona humana y jurídica única por tenant, tipos y números de documento, CUIT/CUIL con dígito verificador, validación contra padrón ARCA en modo simulado y datos sensibles marcados.
LEER: anexos/M01-PER-personas-titulares-cuentas.md §4, §5.1, §5.2, §6, §7, §8, §9, §10, §11, §12, §17, §18; anexos/T05-DAT-modelo-datos.md (colecciones de M01); anexos/T08-NFR-no-funcionales-seguridad.md §9.12.
IMPLEMENTAR: RF-PER-001..015, 017..019, 021..028; RNF-NFR-098, 100.
DECISIONES v1.2 (10-11-2026): DEC-097 (persona única: proveedores, vendedores, choferes, profesionales de salud y empleados son roles de una persona de M01 con `personId` obligatorio, RF-PER-015; el alta asistida desde esos maestros es RF-PER-174, en PRO-O2-07).
ENTREGABLES: persons con normalización de nombres y documentos, unicidad por tenant, validación de CUIT, consulta de padrón por conector simulado; marcas de sensibilidad; API-PER de personas; PAN-PER de alta, edición y búsqueda.
NO CONSTRUIR TODAVÍA: condición fiscal con efecto en facturación (O4, RF-PER-020, 029).
PRUEBAS: CUIT con dígito inválido rechazado con RFC 9457; misma persona por DNI en TEN-001 y TEN-002 son registros distintos; campos sensibles no aparecen en logs.
TERMINADO CUANDO: Ana Demo y las personas ficticias de M01 §18 se cargan por API y UI.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep per && playwright test --grep @O2-persons
```

#### PRO-O2-04 — Contactos, consentimientos, titulares y cuentas

```text
PRO-O2-04 — Contactos, titulares y cuentas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: contactos verificados, preferencias y consentimientos por canal, titulares (persona con relación comercial) y cuentas como unidad de agrupación comercial.
LEER: anexos/M01-PER-personas-titulares-cuentas.md §5.3, §5.4, §5.5, §8, §10, §11; anexos/T09-COM-comunidad-comunicaciones.md §5.10.
IMPLEMENTAR: RF-PER-030..048, 050, 052, 054..058, 060, 061, 063, 064, 068..072; además (v1.1): RF-PER-173 (envío del código de vinculación al contacto verificado del titular, método `otpToRegisteredContact`, DEC-043, a pedido de RF-POR-179).
DECISIONES v1.2 (10-11-2026): DEC-096 (RF-PER-044 muestra un vínculo de asociado por entidad jurídica, filtrado por la dimensión entidad jurídica del alcance del usuario).
ENTREGABLES: contactos con verificación por OTP, consentimientos con evidencia y fecha; holders con estados; accounts con numeración configurable, sucursal y estados; API-PER y PAN-PER de titulares y cuentas; eventos per.holder.* y per.account.*.
NO CONSTRUIR TODAVÍA: saldos y deuda en la cuenta (O5); bloqueos por mora (O6); cuentas con efectos fiscales (O4, RF-PER-049, 059, 066).
PRUEBAS: un consentimiento revocado impide campañas por ese canal; una cuenta no se da de baja con contratos activos; la numeración de cuentas no colisiona en concurrencia.
TERMINADO CUANDO: Ana Demo es titular con cuenta y contactos verificados.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep holders && playwright test --grep @O2-accounts
```

#### PRO-O2-05 — Domicilios, geolocalización, inmuebles y puntos de prestación

```text
PRO-O2-05 — Domicilios, inmuebles y puntos de prestación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: domicilios normalizados y geolocalizados sobre las calles del tenant, inmuebles y puntos de prestación donde se presta un servicio.
LEER: anexos/M01-PER-personas-titulares-cuentas.md §5.6, §5.7, §10, §11; anexos/T04-CFG-configuracion-parametros-maestros.md §5.7.
IMPLEMENTAR: RF-PER-073..094.
DECISIONES v1.2 (10-11-2026): DEC-102 (el uso del inmueble normalizado, residencial, comercial, industrial, rural u otro, queda disponible para que M06 lo use como condición opcional de la alícuota de IVA, desactivada por defecto; RF-PER-089, PA-FIS-26).
ENTREGABLES: addresses (real, postal, de prestación) con AddressPicker y geocodificación; properties con catastro opcional; servicePoints con coordenadas, zona y referencia de red vacía (la red llega en O7); historia de cambios de domicilio.
NO CONSTRUIR TODAVÍA: medidores y puntos de medición (O7, RF-PER-095, 097); relación con nodos de red (O3, RF-PER-096, 098).
PRUEBAS: un domicilio fuera de las localidades del tenant se rechaza; mover un punto de prestación queda auditado; la búsqueda por calle y altura funciona.
TERMINADO CUANDO: Ana Demo tiene domicilio y un punto de prestación geolocalizado.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep addresses && playwright test --grep @O2-addresses
```

#### PRO-O2-06 — Relaciones, notas, bloqueos, documentación y transferencias

```text
PRO-O2-06 — Relaciones, notas, bloqueos y transferencias
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: relaciones entre personas, representaciones y apoderados, notas, bloqueos administrativos, documentación y adjuntos de la persona, y cambio de titularidad y mudanzas sin efectos económicos.
LEER: anexos/M01-PER-personas-titulares-cuentas.md §5.8, §5.10, §5.11, §8, §10, §11.
IMPLEMENTAR: RF-PER-099..106, 108, 118..125, 128..132, 135..139.
DECISIONES v1.2 (10-11-2026): DEC-104 (corrección de fuentes sin cambio de alcance: el garante de RF-PER-101 sale de `SOCIOS.COD_GAR`; `RESPONSA` tiene un solo destino, los técnicos de campo de M10).
ENTREGABLES: relationships y representaciones con vigencia y documento respaldatorio; personNotes con visibilidad; blocks con motivo y alcance; personDocuments en almacenamiento privado; ownershipTransfers como trámite con aprobación.
NO CONSTRUIR TODAVÍA: garantías económicas (O5, RF-PER-107); bloqueos con efecto fiscal o de cobranza (O4, O5); adherentes (O10).
PRUEBAS: un representante vencido no actúa; una transferencia requiere aprobación y deja historia; un bloqueo impide las acciones configuradas.
TERMINADO CUANDO: un cambio de titularidad ficticio se tramita de punta a punta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep relationships && playwright test --grep @O2-transfers
```

#### PRO-O2-07 — Ficha 360, padrón, historia, duplicados, privacidad e importación

```text
PRO-O2-07 — Ficha 360, duplicados, privacidad e importación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ficha 360 de la persona con secciones que cada módulo registra, búsqueda global y padrón, historia, detección y fusión de duplicados, vínculo usuario–persona con privacidad, e importación masiva.
LEER: anexos/M01-PER-personas-titulares-cuentas.md §5.12, §5.13, §5.14, §5.15, §5.16, §10, §11, §14; 01-registro-decisiones.md DEC-043.
IMPLEMENTAR: RF-PER-142..172. Además (v1.2): RF-PER-174 (alta asistida de persona desde los maestros de rol con el servicio `per.findOrCreatePerson` y PAN-PER-04 embebido en modo búsqueda, DEC-097); RF-PER-175 (personas migradas sin ningún documento con `identificationStatus = documentPending`: fuera del control de duplicados por documento, bandeja y filtro en PAN-PER-03 y regularización que pasa la persona a `identified`, DEC-099).
DECISIONES v1.2 (10-11-2026): DEC-097 (el motor de duplicados de RF-PER-155 atiende también el alta asistida desde los maestros de rol, RF-PER-174); DEC-099 (las personas `documentPending` no participan del puntaje por documento ni por CUIT y se comparan por nombre fonético y domicilio con aviso, RN-PER-136; la tarea de regularización en M09 se conecta en PRO-O2-11 con RF-CRM-261, y el bloqueo de los comprobantes que exigen identificar al receptor por documento lo aplican M05 y M06 en O4). PRUEBAS adicionales: dar de alta como proveedor a un socio existente propone su persona por CUIT y no crea otra; una persona migrada sin documento muestra el chip "Documento pendiente" y no entra en el control de duplicados por documento.
ENTREGABLES: Ficha360 con registro de secciones por módulo (las de facturación, cobranza y técnica se agregan luego); búsqueda por nombre, documento, cuenta y domicilio con alcance; padrón exportable; duplicados con puntaje y fusión aprobada y reversible; vínculo usuario–persona; importación por ExcelImportWizard.
NO CONSTRUIR TODAVÍA: secciones de otros módulos.
PRUEBAS: la fusión conserva historia y referencias; la búsqueda respeta alcance por sucursal; una importación con errores no confirma parciales.
TERMINADO CUANDO: la ficha de Ana Demo muestra persona, titular, cuenta, domicilio y documentos.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep per && playwright test --grep @O2-360
```

#### PRO-O2-08 — Registro básico de asociados (M17)

```text
PRO-O2-08 — Registro básico de asociados
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: registro de asociados vinculado a persona con número de asociado, estados básicos, relación con baja de servicio (AGR-029) y transversales de M17 necesarios para O2.
LEER: anexos/M17-INS-institucional.md §5.1 (RF-INS-001..004, 009, 015, 017), §5.8 (099), §5.9 (104, 105, 107), §7, §10, §11; 01-registro-decisiones.md DEC-019.
IMPLEMENTAR: RF-INS-001..004, 009, 015, 017, 099, 104, 105, 107.
DECISIONES v1.2 (10-11-2026): DEC-096 (`associateMemberships.legalEntityId`: una persona puede ser socia de la cooperativa y afiliada de la mutual a la vez, con una membresía por entidad; RF-INS-001, 002, 009 y 015).
ENTREGABLES: associates con numeración, fecha de ingreso, estado y persona; alta desde la ficha de persona; consulta del portal "soy asociado"; eventos ins.associate.*.
NO CONSTRUIR TODAVÍA: capital social (O5); libro de asociados, asambleas y órganos (O10).
PRUEBAS: una persona no puede tener dos asociados activos en el mismo tenant; la baja del último servicio solo notifica, no egresa automáticamente.
TERMINADO CUANDO: Ana Demo queda como asociada ficticia de TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep ins
```

#### PRO-O2-09 — Catálogo de servicios, perfil por servicio y versionado

```text
PRO-O2-09 — Catálogo de servicios y perfil por servicio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: catálogo de plataforma de servicios (Internet, TV, telefonía, energía, agua, cloacas, gas, sepelio y otros), habilitación por tenant, perfil de configuración por servicio y versionado y publicación del catálogo (DEC-021).
LEER: anexos/M02-CAT-catalogo-servicios.md §4, §5.1, §5.2, §5.3, §7, §8, §10, §11, §17, §18; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.3; 01-registro-decisiones.md DEC-021.
IMPLEMENTAR: RF-CAT-001..020, 023..035; además (v1.1): RF-PLA-165 (plantillas de plataforma versionadas en el tenant `PLATFORM`); RF-UXD-179 (catálogo base de claves transversales de servicio).
DECISIONES v1.1: DEC-082 (gas envasado como variante "envasado" de GAS, habilitable por tenant con PRM-CAT-112) y DEC-084 (correo electrónico y pack SMS como servicios del catálogo) se declaran aquí en el catálogo de plataforma; su operación llega en O8 y O10.
ENTREGABLES: serviceCatalog global con capacidades por servicio; tenantServices habilitados; serviceProfiles versionados (medición sí/no, ciclo, tarifa, técnica, fiscal referenciada); publicación con aprobación; PAN-CAT de catálogo y perfil.
NO CONSTRUIR TODAVÍA: perfil fiscal efectivo (O4); categorías tarifarias con efectos (O4, O7).
PRUEBAS: un servicio no habilitado no se puede contratar; una versión publicada del perfil no cambia contratos ya creados.
TERMINADO CUANDO: Internet INT-100 queda habilitado en TEN-001 según T12 parte1 §1.3.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cat && playwright test --grep @O2-catalog
```

#### PRO-O2-10 — Productos, planes, categorías, estados y contrato de servicio

```text
PRO-O2-10 — Productos, planes y contrato de servicio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: productos, conceptos, planes y paquetes, categorías, estados del contrato configurables, contrato de servicio con ciclo de vida, copia de configuración entre tenants y oferta para portal y landing.
LEER: anexos/M02-CAT-catalogo-servicios.md §5.4..§5.9, §8 (estados), §10, §11; anexos/M13-STK-stock-activos-fabricacion.md §5.7 (RF-STK-082), §5.14 (132); anexos/T11-WFL-workflow-eventos-documentos.md §12.3 (EVT-CAT provisionales).
IMPLEMENTAR: RF-CAT-036..043, 045, 047, 049, 053..055, 057, 061..065, 067..070, 072..074, 076..078, 082, 084, 092, 094, 104..113; RF-STK-082, 132; además (v1.1): RF-PLA-164 (copia de configuración entre tenants con autorización explícita del tenant origen).
DECISIONES v1.1: DEC-083 (los conceptos de terceros cuelgan siempre de un contrato propio del socio con perfil de servicio "convenio de terceros" de tipo accesorio; no se facturan por inmueble sin contrato).
ENTREGABLES: products, plans y packages con vigencias (sin precio efectivo: el precio vive en M04, O4); categories; contractStates por servicio; serviceContracts (borrador, pendiente de instalación, activo, suspendido, baja) con eventos cat.contract.* y el vínculo a cuenta y punto de prestación; copia controlada de configuración entre tenants; oferta publicable.
NO CONSTRUIR TODAVÍA: activación técnica e instalación (O3); facturación del contrato (O4); suspensión por mora (O6).
PRUEBAS: una transición de estado no configurada se rechaza; la copia entre tenants nunca copia datos de personas; un plan dado de baja no se ofrece.
TERMINADO CUANDO: el contrato de Internet de Ana Demo existe en estado Pendiente de instalación.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep contracts && playwright test --grep @O2-contracts
```

#### PRO-O2-11 — CRM: expediente, bandejas y tickets

```text
PRO-O2-11 — CRM: expediente, bandejas y tickets
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ticket único con tipos configurables, colas y bandejas por rol y sucursal, expediente del socio en CRM, asignación, SLA de T11 y canales básicos.
LEER: anexos/M09-CRM-atencion.md §4, §5.1, §5.5 (RF-CRM-158), §5.6 (170, 186), §5.9 (255), §5.10 (RNF-CRM-001, 003, 005), §7, §8, §10, §11, §17; 01-registro-decisiones.md DEC-011.
IMPLEMENTAR: RF-CRM-001..016, 018, 023..025, 031, 034..039, 043, 045, 047, 048, 158, 170, 186, 255; RNF-CRM-001, 003, 005. Además (v1.2): RF-CRM-261 (tipo de gestión de sistema `identityDocumentRegularization` precargado en todo tenant, que M01 abre con `crm.openCase` e idempotencia por persona o por lote y que M09 cierra al consumir EVT-PER-27, DEC-099).
DECISIONES v1.2 (10-11-2026): DEC-099 (el caso de RF-CRM-261 no es visible en el portal, no ejecuta comandos ni cambia datos de la persona; M09 lo cierra al consumir EVT-PER-27 `per.person.identificationRegularized` y devuelve el `caseId` que M01 guarda). PRUEBAS adicionales: reintentar la migración no abre un segundo caso (misma `idempotencyKey`); un caso de lote con tres personas queda abierto hasta regularizar la tercera.
ENTREGABLES: tickets, ticketTypes, queues; asignación manual y por regla; SLA; vista expediente en Ficha360; PAN-CRM de bandejas y detalle; eventos crm.ticket.*.
NO CONSTRUIR TODAVÍA: reclamos técnicos e incidentes (O3); IA supervisada (O6); mesa de entradas y turnero (O10).
PRUEBAS: un ticket fuera del alcance del operador no se ve; el SLA escala; la reasignación queda auditada.
TERMINADO CUANDO: un ticket ficticio recorre la bandeja hasta su cierre.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep crm && playwright test --grep @O2-crm
```

#### PRO-O2-12 — CRM: solicitudes comerciales

```text
PRO-O2-12 — CRM: solicitudes comerciales
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: solicitudes comerciales (alta, cambio de plan, baja, cambio de titularidad) como tickets con trámite asociado que crean o modifican contratos en M02 por API del dueño (DEC-011, DEC-057).
LEER: anexos/M09-CRM-atencion.md §5.2 (RF-CRM-060..067, 076..079, 083); anexos/M02-CAT-catalogo-servicios.md §5.7; 01-registro-decisiones.md DEC-011, DEC-057.
IMPLEMENTAR: RF-CRM-060..067, 076..079, 083.
ENTREGABLES: commercialRequests con tipos, validaciones previas (persona, cuenta, domicilio, oferta), creación de contrato por servicio de M02 al aprobar, estados sincronizados y notificación.
NO CONSTRUIR TODAVÍA: factibilidad técnica (O3) ni presupuesto de conexión (O3).
PRUEBAS: aprobar dos veces no crea dos contratos (idempotencia); CRM no escribe en tablas SQL de M02 (prueba de estructura).
TERMINADO CUANDO: la solicitud de alta de Internet de Ana Demo crea el contrato.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep commercialRequests && dotnet run --project tools/CheckStructure
```

#### PRO-O2-13 — Comunidad: muro, reacciones y moderación

```text
PRO-O2-13 — Comunidad: muro y moderación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: muro editorial con publicaciones de la cooperativa y de socios habilitados, reacciones, comentarios y menciones, y moderación con IA más humana, reportes, sanciones y auditoría.
LEER: anexos/T09-COM-comunidad-comunicaciones.md §4, §5.1, §5.2, §5.3, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-COM-001..026, 030..037, 040..057.
ENTREGABLES: posts con audiencias y programación; comments y reactions; moderationCases con cola, decisiones y sanciones; clasificador IA que solo propone; PAN-COM y vistas PWA del muro.
NO CONSTRUIR TODAVÍA: campañas masivas (PRO-O2-15).
PRUEBAS: un comentario ofensivo de ejemplo queda retenido hasta revisión; un socio sancionado no publica; publicaciones de TEN-001 no se ven en TEN-002.
TERMINADO CUANDO: una publicación ficticia con comentarios moderados se ve en la PWA.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep com && playwright test --grep @O2-community
```

#### PRO-O2-14 — Boletines, encuestas, eventos, beneficios y audiencias

```text
PRO-O2-14 — Boletines, encuestas, eventos y audiencias
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: boletines, encuestas y consultas no vinculantes, eventos y beneficios, y motor único de audiencias usado por todos los envíos.
LEER: anexos/T09-COM-comunidad-comunicaciones.md §5.4, §5.5, §5.6, §5.7, §10, §11.
IMPLEMENTAR: RF-COM-060..063, 070..083, 088..091, 093, 100..106, 110..119.
ENTREGABLES: newsletters; surveys con anonimato configurable y resultados; events con inscripción y agenda; benefits; audiences declarativas (servicio, categoría, zona, estado, asociado) con conteo previo y congelamiento al enviar.
NO CONSTRUIR TODAVÍA: votaciones vinculantes de asamblea (O10); encuestas post-OT (O3).
PRUEBAS: la audiencia congelada no cambia tras el envío; una encuesta anónima no expone la persona; la audiencia respeta consentimientos.
TERMINADO CUANDO: una encuesta ficticia se envía a la audiencia "socios de Internet" de TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep audiences && playwright test --grep @O2-surveys
```

#### PRO-O2-15 — Motor de comunicaciones multicanal, preferencias y campañas

```text
PRO-O2-15 — Comunicaciones multicanal y campañas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: motor de comunicaciones con plantillas por canal (correo, SMS, WhatsApp, push, in-app), proveedores simulados, preferencias y consentimientos, avisos de interrupción por zona, notificaciones transaccionales y campañas masivas.
LEER: anexos/T09-COM-comunidad-comunicaciones.md §5.8..§5.12, §7, §10, §11; anexos/T06-INT-integraciones.md §5.1 (RF-INT-008), §5.7 (058), §5.10 (086).
IMPLEMENTAR: RF-COM-130..137, 139, 140, 142..144, 146, 149, 151, 153..156, 160, 162, 170..173, 175, 180, 190..194, 197; RF-INT-008, 058, 086.
DECISIONES v1.2 (10-11-2026): DEC-104 (no hay canal de voz propio: el aviso telefónico es el formato `ivr_export` para discador, entregable por la conexión opcional FI-INT-66 de T06; RF-COM-130).
ENTREGABLES: messageTemplates con diccionario y variables; messages con estado por canal y reintentos; adaptadores de proveedores en modo test con simuladores; webhooks entrantes de estado de entrega con firma; avisos de interrupción; campañas con límites y horarios; medición de mensajería para el contrato SaaS.
NO CONSTRUIR TODAVÍA: notificaciones de mora (O6); envío de facturas (O4).
PRUEBAS: un socio sin consentimiento de WhatsApp no recibe por ese canal; un webhook sin firma válida se rechaza; una campaña respeta la franja horaria.
TERMINADO CUANDO: la notificación de solicitud recibida llega a Ana Demo por correo simulado e in-app.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep messaging && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O2-16 — Landing pública, registro y vinculación de cuentas

```text
PRO-O2-16 — Landing, registro y vinculación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: landing pública por tenant con oferta y contacto, registro del socio con verificación, ámbito de la sesión y vinculación de cuentas por código, factura o validación presencial, con representaciones.
LEER: anexos/M19-POR-portal-socio-landing.md §4, §5.1, §5.2, §5.3, §7, §10, §11, §17; anexos/T03-UXD-experiencia-marca-diccionario.md §5.6 (RF-UXD-076..078), §5.9 (120); 01-registro-decisiones.md DEC-043, DEC-066, DEC-067.
IMPLEMENTAR: RF-POR-001..011, 013..019, 021..030, 032..034, 036..042, 046; RF-UXD-076..078, 120; RNF-NFR-076; además (v1.1): RF-POR-179 (vincular con código enviado al contacto del titular, junto con RF-PER-173).
ENTREGABLES: landing por subdominio con secciones configurables, SEO y oferta de M02; registro con OTP; linkCodes de un solo uso; accountLinks con nivel de acceso; representaciones; protección contra enumeración y abuso.
NO CONSTRUIR TODAVÍA: pago en landing (O5, RF-POR-012); vinculación por factura con datos fiscales reales (O4, RF-POR-035); accesos de pago (O5, RF-POR-043..045).
PRUEBAS: un código de vinculación usado o vencido falla; la landing de TEN-001 no muestra oferta de TEN-002; registro con correo existente no revela existencia.
TERMINADO CUANDO: Ana Demo se registra y vincula su cuenta en la PWA de TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep portal && playwright test --grep @O2-landing
```

#### PRO-O2-17 — Portal del socio: inicio, servicios, gestiones, comunidad y administración

```text
PRO-O2-17 — Portal del socio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: inicio por rol, mis servicios y contratación, gestiones (consultas y trámites), comunidad en el portal, portal del empleado base, accesibilidad y tolerancia a errores, y administración del portal.
LEER: anexos/M19-POR-portal-socio-landing.md §5.4, §5.5, §5.10, §5.12, §5.13 (RF-POR-134), §5.14, §5.15; anexos/T03-UXD-experiencia-marca-diccionario.md §5.5 (072..075), §5.7 (086, 089), §5.11 (167, 170); anexos/T08-NFR-no-funcionales-seguridad.md §13.
IMPLEMENTAR: RF-POR-047, 048, 051..054, 056..065, 067, 070, 071, 109..112, 114, 116, 117, 121..126, 134, 137..156, 158, 160; RF-UXD-072..075, 086, 089, 167, 170; RNF-NFR-003, 137, 181, 191, 195, 234, 248, 251, 253; además (v1.1): RF-POR-174 (M19 es dueño de la ruta, la navegación y la composición de cada pantalla de `pwa-socio` y `landing`); además (cierre 05-11-2026): RF-POR-180 (tabbar del socio Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad con FAB = Pagar, y PAN-POR-105 `/app/comunidad` que agrega muro, encuestas y novedades de T09; PA-POR-20).
ENTREGABLES: home por rol (titular, representante, empleado); mis servicios con estado de contratos; contratación de oferta como trámite; gestiones y seguimiento; comunidad embebida; modo sin conexión con cola de envíos; administración del portal (secciones, textos, banners, habilitaciones).
NO CONSTRUIR TODAVÍA: facturas (O4), pagos (O5), consumos (O7), turnos (O10), tótem (O10).
PRUEBAS: Lighthouse PWA y accesibilidad AA en las pantallas nuevas; un envío sin conexión se reintenta sin duplicar; un representante solo ve lo delegado.
TERMINADO CUANDO: Ana Demo solicita Internet desde "Mis servicios" y sigue la gestión.
VERIFICAR: playwright test --grep @O2-portal && npx lighthouse frontend/pwa
```

#### PRO-O2-18 — Reportes programados, privacidad del socio y mapeos de migración

```text
PRO-O2-18 — Reportes programados, privacidad del socio y mapeos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: reportes programados y de padrón, "Mis datos y privacidad" del socio, y mapeos de migración de personas, cuentas, servicios y contratos desde la base ficticia.
LEER: anexos/T10-BIA-reportes-bi-apis.md §5 (RF-BIA de O2), §11; anexos/T08-NFR-no-funcionales-seguridad.md §5.1 (RF-NFR-005, 012); anexos/T07-MIG-migracion-procoop.md §5.2 (012), §5.3 (021..023, 026), §5.4 (034, 039), §5.9 (090).
IMPLEMENTAR: RF-BIA-010, 017..019, 030, 031, 035..039, 049..051, 053..057, 059, 097, 103; RF-NFR-005, 012; RF-MIG-012, 021..023, 026, 034, 039, 090.
DECISIONES v1.2 (10-11-2026): DEC-099 (el mapeo de personas crea con `identificationStatus = documentPending` a las que llegan de ProCoop sin ningún documento, sin inventar número, las lista en el informe de migración y abre su tarea de regularización, RF-PER-175 y RF-CRM-261; urgente para la migración de LAG); DEC-097 (las personas de proveedores, vendedores, choferes, profesionales y empleados se vinculan o crean con las reglas de unificación del padrón de T07); DEC-096 (filtro global del tablero por entidad jurídica, RF-BIA-055).
ENTREGABLES: reportSchedules con destinatarios y vencimiento; reportes de padrón y comunidad; pantalla de privacidad del socio (descarga de datos, solicitud de rectificación y supresión); mapeos MIG para M01, M02 y M09.
NO CONSTRUIR TODAVÍA: corrida paralela (O11).
PRUEBAS: un reporte programado no se envía a un destinatario sin permiso; la descarga de datos del socio solo incluye sus datos; la migración ficticia de personas concilia conteos.
TERMINADO CUANDO: personas y contratos de la base ficticia migran a staging y luego a TEN-001 de prueba.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep bia && dotnet test --filter FullyQualifiedName~Api -- --grep mig
```

#### PRO-O2-19 — Integración de O2: el socio se registra y solicita Internet

```text
PRO-O2-19 — Integración de O2
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O2 (sección 6.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §6; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.3, §1.5, §1.6; §17 y §18 de M01, M02, M09, M17, M19, T09 y T11.
IMPLEMENTAR: ningún RF nuevo. Verificar los 617 RF de O2 (antes 614 y 613; versión 1.0: 607).
ENTREGABLES: seed demo O2 (Ana Demo, INT-100, ONT-DEMO-0001 reservado para O3); e2e @O2 del recorrido de 6.2; test:isolation de todas las tablas SQL nuevas; actualización de estados de HUE-SRV y HUECO-TRV resueltos (R9).
NO CONSTRUIR TODAVÍA: nada de O3.
PRUEBAS: e2e @O2, test:isolation, k6 de búsqueda de personas.
TERMINADO CUANDO: criterio 6.2 demostrado con evidencias en docs/evidencias/O2/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O2 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 7. O3 — Técnica del piloto Internet

### 7.1 Objetivo

Cubrir el ciclo técnico del piloto Internet: factibilidad, estimación, órdenes de trabajo, materiales, agenda y visitas, instalación integral, cuadrillas, app de campo offline-first, equipos de red y aprovisionamiento de Internet, geolocalización operativa; stock base con artículos, depósitos, movimientos, series, reservas, entregas a cuadrilla y comodatos; reclamos e incidentes del CRM con su vínculo a OT.

### 7.2 Criterio de salida (demostrable)

Sobre la solicitud de Ana Demo (O2) se verifica factibilidad del domicilio, se genera la OT de instalación, se agenda una visita, el técnico en la app de campo sin conexión registra la instalación con la ONT ONT-DEMO-0001 (serie) entregada desde el depósito a su custodia y dada en comodato, firma el socio, al recuperar señal se sincroniza sin duplicar, el aprovisionamiento simulado activa el servicio y el contrato pasa a Activo. Luego Ana abre un reclamo "sin servicio" que genera una OT de reparación y se cierra con encuesta.

### 7.3 Dependencias

O2 completa (personas, puntos de prestación, contratos, CRM, trámites, comunicaciones, portal).

### 7.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M10 TEC | 151 | RF-TEC-001..034, 036..039, 042..060, 062, 064, 065, 067..069, 071, 073..093, 095..105, 107..119, 121..130, 155, 164..167, 182..186, 188..193, 215..229 (v1.1: se agregan RF-TEC-231) | PAN-TEC-01..64 (*reemplazado, corrección 05-11-2026:* antes PAN-TEC-01..60; 64 definidos en el anexo) (salvo red, obras, inspecciones y telefonía), API-TEC-01..56 (*reemplazado, corrección 05-11-2026:* antes API-TEC-01..50; 56 definidos en el anexo), EVT-TEC-01..38 (*reemplazado, corrección 05-11-2026:* antes EVT-TEC-01..31; 38 definidos en el anexo), JOB-TEC-01..17 (*reemplazado, corrección 05-11-2026:* antes JOB-TEC-01..16; 17 definidos en el anexo) de esos recursos | `feasibilityChecks`, `technicalEstimates`, `workOrders`, `workOrderTypes`, `visits`, `crews`, `resources`, `fieldSyncBatches`, `networkEquipment`, `provisioningRequests`, `gpsPositions` |
| M13 STK | 71 | RF-STK-001..004, 006, 009, 011, 013, 015..017, 020..028, 030, 031, 034, 035, 038..042, 044..047, 049..069, 071..077, 079, 081, 084, 089, 094, 113, 131, 135..137 | PAN-STK y API-STK de artículos, depósitos, movimientos, series, reservas, custodia y comodato | `items`, `warehouses`, `locations`, `stockMovements`, `stockBalances`, `serialNumbers`, `lots`, `reservations`, `custodies`, `loans` |
| M09 CRM | 53 | RF-CRM-017, 019..022, 029, 030, 032, 033, 046, 049, 051..053, 068, 070..075, 082, 084, 100, 101, 103..113, 115, 116, 118..124, 173, 184, 185, 187, 236, 256 (v1.1: se agregan RF-CRM-258, 260) | PAN-CRM de reclamos e incidentes | `claims`, `incidents`, `incidentLinks` |
| M01 PER | 3 | RF-PER-016, 096, 098 | — | — |
| M02 CAT | 8 | RF-CAT-050, 051, 079, 081, 085, 088, 091, 099 | Activación técnica del contrato | — |
| M19 POR | 9 | RF-POR-055, 072..077, 113, 115 | PAN-POR de visitas e instalación | — |
| T09 COM | 10 | RF-COM-084..087, 092, 120, 161, 163, 183, 184 | Encuesta post-OT y avisos de interrupción | — |
| T11 WFL | 5 | RF-WFL-066, 097, 103, 195, 196 | Firma en campo | — |
| T03 UXD | 2 | RF-UXD-094, 095 | Componentes de mapa y firma | — |
| M12 CMP | 2 | RF-CMP-018, 067 | Proveedor y remito de equipo (mínimo) | — |
| M15 CON | 1 | RF-CON-071 | Regla de asiento de stock (se ejecuta desde O5) | — |
| M16 SUE | 1 | RF-SUE-001 | Legajo mínimo del técnico | `employees` (mínimo) |
| T07 MIG | 1 | RF-MIG-056 | Validación de migración técnica | — |
| T10 BIA | 1 | RF-BIA-020 | Reporte técnico | — |
| M04 TAR | 1 | RF-TAR-115 (v1.1, fila nueva) | — | — |
| **Total** | **319** | | | |

### 7.5 Fuera de la ola

Medición (O7), red GIS, mantenimiento, obras e inspecciones (O7), cortes y reconexiones ejecutados por mora (O6), telefonía (O10), bienes de uso, valorización completa y RMA (O8), fabricación (O10), facturación de la instalación (O4).

### 7.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Conflictos de sincronización offline | Cola local con idempotencia por operación, versión de documento y resolución explícita (M10 §5.8) |
| Stock negativo o series duplicadas | Movimientos transaccionales en replica set y unicidad de serie por tenant |
| Dependencia de proveedores de aprovisionamiento | Adaptador de ACS/OLT simulado en modo test (T06) |
| Legajo de técnico sin M16 | Legajo mínimo RF-SUE-001 (DEC-058); el resto de M16 en O9 |

### 7.7 Datos demo

M10 §18, M13 §18 (ONT-DEMO-0001 y depósitos ficticios), M09 §18, T12 parte1 §1.5 (catálogo de equipos y cuadrilla ficticia).

### 7.8 Pruebas end-to-end de la ola

ESC-SRV-INT-01 hasta la activación (T12 parte1 §1.7; antes §1.6) y ESC-SRV-INT de reclamo técnico; CU de M10 §17 (factibilidad, OT, instalación offline); CU de M13 §17 (entrega a cuadrilla, comodato, serie); CU de M09 §17 (reclamo con OT).

### 7.9 Huecos que se resuelven en la ola

HUE-SRV-07 y HUE-INT-03 (R9).

### 7.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O3-01 | Cuadrillas, recursos, tipos de trabajo y legajo mínimo | 11 |
| PRO-O3-02 | Stock: artículos, depósitos y movimientos | 29 |
| PRO-O3-03 | Stock: series, reservas, custodia de cuadrilla y comodatos | 46 |
| PRO-O3-04 | Factibilidad y estimación técnica | 24 |
| PRO-O3-05 | Órdenes de trabajo y materiales | 45 |
| PRO-O3-06 | Agenda, visitas y portal de visitas | 20 |
| PRO-O3-07 | Instalación integral, firma y activación del contrato | 31 |
| PRO-O3-08 | App de campo offline-first | 20 |
| PRO-O3-09 | Equipos de red y aprovisionamiento de Internet | 16 |
| PRO-O3-10 | Geolocalización operativa e informes técnicos | 16 |
| PRO-O3-11 | Reclamos e incidentes | 29 |
| PRO-O3-12 | Completar expediente, solicitudes y canales del CRM | 31 |
| PRO-O3-13 | Integración de O3: instalación y reclamo del piloto Internet | 1 (verifica 319) |

#### PRO-O3-01 — Cuadrillas, recursos, tipos de trabajo y legajo mínimo

```text
PRO-O3-01 — Cuadrillas, recursos y tipos de trabajo
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cuadrillas, técnicos, vehículos y herramientas como recursos, tipos de trabajo con duración y habilidades, y legajo mínimo del empleado (DEC-058).
LEER: anexos/M10-TEC-tecnica-campo-redes.md §4, §5.7, §7, §10, §11; anexos/M16-SUE-personal-sueldos.md §5.1 (RF-SUE-001); 01-registro-decisiones.md DEC-058.
IMPLEMENTAR: RF-SUE-001; RF-TEC-102..105, 107..111; además (v1.1): RF-TEC-231 (parte O3: turnos de guardia por servicio y zona para los servicios con red distintos de GAS y ELE; la parte GAS y ELE es O7, PRO-O7-08).
ENTREGABLES: employees mínimo (persona, legajo, sucursal, usuario); crews con integrantes y vigencias; resources; workOrderTypes con habilidades y materiales sugeridos; alcance por cuadrilla en IAM (extensión de dataScopes).
NO CONSTRUIR TODAVÍA: liquidación y RRHH (O9); costeo de cuadrilla (O7, RF-TEC-106).
PRUEBAS: un técnico sin habilidad no se asigna a un tipo que la exige; el alcance por cuadrilla limita las OT visibles.
TERMINADO CUANDO: la cuadrilla ficticia de T12 parte1 §1.5 existe en TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep crews
```

#### PRO-O3-02 — Stock: artículos, depósitos y movimientos

```text
PRO-O3-02 — Stock: artículos, depósitos y movimientos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: artículos y clasificación, depósitos, ubicaciones y custodia, y documentos de movimiento de stock transaccionales con saldos por depósito.
LEER: anexos/M13-STK-stock-activos-fabricacion.md §4, §5.1, §5.2, §5.3, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-STK-001..004, 006, 009, 011, 013, 015..017, 020..028, 030, 031, 034, 035, 038..042.
ENTREGABLES: items con unidad, clase y control por serie o lote; warehouses (incluye depósitos de cuadrilla) y locations; stockMovements (ingreso, egreso, transferencia, ajuste) con transacción y control optimista; stockBalances; PAN-STK y API-STK.
NO CONSTRUIR TODAVÍA: valorización y costeo completos (O8); inventario físico completo (O8); extensiones O8 y O10 de RF-STK-024 y 040 (ver §18).
PRUEBAS: dos egresos concurrentes del último ítem dejan uno rechazado; un movimiento anulado revierte saldo con documento; depósitos de TEN-001 invisibles en TEN-002.
TERMINADO CUANDO: el depósito central de TEN-001 tiene stock ficticio de ONT y cable.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep stk && dotnet test --filter Category=Isolation
```

#### PRO-O3-03 — Stock: series, reservas, custodia de cuadrilla y comodatos

```text
PRO-O3-03 — Series, reservas, custodia y comodatos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: trazabilidad por serie y lote, reservas para OT, entregas a cuadrilla y consumo desde la OT, equipos en comodato vinculados al contrato, inventario de cuadrilla, stock por servicio y la recepción mínima de equipo de proveedor.
LEER: anexos/M13-STK-stock-activos-fabricacion.md §5.4..§5.8, §5.10 (089, 094), §5.12 (113), §5.14 (131, 135..137); anexos/M12-CMP-compras-proveedores.md §5.1 (RF-CMP-018), §5.6 (067); anexos/M15-CON-contabilidad.md §5.5 (RF-CON-071).
IMPLEMENTAR: RF-STK-044..047, 049..069, 071..077, 079, 081, 084, 089, 094, 113, 131, 135..137; RF-CMP-018, 067; RF-CON-071; además (v1.1): RF-TAR-115 (cargo por evento "equipo no devuelto" por modelo o tipo de equipo en `eventCharges`; se factura desde O4).
DECISIONES v1.2 (10-11-2026): DEC-097 (el proveedor de la recepción mínima de equipos se crea con `personId` por el alta asistida de M01, RF-CMP-018).
ENTREGABLES: serialNumbers con historia completa (depósito, cuadrilla, cliente, devolución); reservations; custodies por técnico; loans (comodato) con contrato y punto de prestación; recepción simple con remito de proveedor; regla de asiento de stock declarada (se activa con M15 en O5).
NO CONSTRUIR TODAVÍA: compras completas (O8); RMA completo (O8); comodato con cargo por no devolución (O4, RF-STK-080; O6, 078).
PRUEBAS: una serie no puede estar en dos lugares; consumir sin reserva cuando la política la exige falla; la devolución de comodato restituye stock.
TERMINADO CUANDO: ONT-DEMO-0001 pasa del depósito a la custodia de la cuadrilla.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep serials && playwright test --grep @O3-stock
```

#### PRO-O3-04 — Factibilidad y estimación técnica

```text
PRO-O3-04 — Factibilidad y estimación técnica
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: factibilidad automática por zona y cobertura más revisión técnica, estimación técnica y presupuesto de conexión, y datos técnicos del punto de prestación.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.1, §5.2, §8, §10, §11; anexos/M01-PER-personas-titulares-cuentas.md §5.1 (RF-PER-016), §5.7 (096, 098); anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.3.
IMPLEMENTAR: RF-TEC-001..021; RF-PER-016, 096, 098.
ENTREGABLES: feasibilityChecks con resultado automático (zona de cobertura configurada como polígonos) y revisión manual; technicalEstimates con materiales y mano de obra (montos se cobran desde O4); vínculo con solicitud comercial y contrato.
NO CONSTRUIR TODAVÍA: red GIS real (O7); presupuesto comercial de ventas (O8).
PRUEBAS: domicilio fuera de cobertura queda "no factible" con motivo; la revisión manual queda auditada.
TERMINADO CUANDO: el domicilio de Ana Demo es factible para Internet.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep feasibility
```

#### PRO-O3-05 — Órdenes de trabajo y materiales

```text
PRO-O3-05 — Órdenes de trabajo y materiales
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: núcleo de OT con estados, prioridades, SLA, asignación, tareas, evidencias, materiales planificados y consumidos, y cierre con controles.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.3, §5.4, §8 (estados de OT), §10, §11; anexos/T11-WFL-workflow-eventos-documentos.md §5.4 (RF-WFL-066), §5.7 (103).
IMPLEMENTAR: RF-TEC-022..034, 036..039, 042..060, 062, 064, 065, 067..069, 071; RF-WFL-066, 103.
ENTREGABLES: workOrders con máquina de estados (creada, planificada, asignada, en curso, pausada, finalizada, cerrada, anulada); evidencias fotográficas en S3 privado; materiales con reserva y consumo vía M13; SLA; eventos tec.workOrder.*; PAN-TEC de OT.
NO CONSTRUIR TODAVÍA: costeo de OT (O7, RF-TEC-035, 040, 041, 061); facturación de materiales (O4, RF-TEC-063).
PRUEBAS: no se cierra una OT con materiales sin conciliar; una OT anulada libera reservas; transición inválida responde 409.
TERMINADO CUANDO: la OT de instalación de Ana Demo existe con materiales reservados.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep workOrders && playwright test --grep @O3-wo
```

#### PRO-O3-06 — Agenda, visitas y portal de visitas

```text
PRO-O3-06 — Agenda y visitas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: agenda de cuadrillas con capacidad, franjas, reprogramación, confirmación del socio y seguimiento de la visita en el portal.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.5; anexos/M19-POR-portal-socio-landing.md §5.5 (RF-POR-055), §5.6; anexos/T11-WFL-workflow-eventos-documentos.md §5.6 (RF-WFL-097).
IMPLEMENTAR: RF-TEC-073..084; RF-POR-055, 072..077; RF-WFL-097.
ENTREGABLES: visits con franjas y capacidad por cuadrilla; elección de turno por el socio; recordatorios por COM; "técnico en camino"; reprogramación con motivo.
NO CONSTRUIR TODAVÍA: turnos de atención presencial (O10).
PRUEBAS: no se sobreasigna una franja; el socio solo ve sus visitas; la reprogramación notifica.
TERMINADO CUANDO: Ana Demo elige franja desde la PWA y la cuadrilla la ve en su agenda.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep visits && playwright test --grep @O3-visits
```

#### PRO-O3-07 — Instalación integral, firma y activación del contrato

```text
PRO-O3-07 — Instalación integral y activación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: proceso de instalación integral (BASE §73) que une solicitud, OT, materiales, equipo en comodato, firma de conformidad, encuesta y activación del contrato.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.6; anexos/M02-CAT-catalogo-servicios.md §5.4 (RF-CAT-050, 051), §5.7 (079, 081, 085, 088, 091, 099); anexos/T11-WFL-workflow-eventos-documentos.md §5.14 (195, 196); anexos/T09-COM-comunidad-comunicaciones.md §5.5 (084..087, 092).
IMPLEMENTAR: RF-TEC-085..093, 095..101; RF-WFL-195, 196; RF-COM-084..087, 092; RF-CAT-050, 051, 079, 081, 085, 088, 091, 099.
ENTREGABLES: checklist de instalación por servicio; acta de conformidad PDF firmada en campo; transición del contrato a Activo por evento tec.installation.completed consumido por M02; encuesta post-OT.
NO CONSTRUIR TODAVÍA: cargo de instalación en la factura (O4, RF-TEC-094).
PRUEBAS: sin firma ni equipo registrado la instalación no se completa; el evento reprocesado no reactiva dos veces.
TERMINADO CUANDO: el contrato de Ana Demo pasa a Activo tras la instalación.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep installation && playwright test --grep @O3-install
```

#### PRO-O3-08 — App de campo offline-first

```text
PRO-O3-08 — App de campo offline-first
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: perfil técnico de la app de campo en la PWA con trabajo sin conexión, almacenamiento local cifrado, cola de operaciones idempotentes, sincronización y resolución de conflictos.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.8; anexos/T03-UXD-experiencia-marca-diccionario.md §5.7 (RF-UXD-094, 095); anexos/T08-NFR-no-funcionales-seguridad.md §7.6, §13.2; anexos/T01-PLA-plataforma-saas.md RNF-PLA-013.
IMPLEMENTAR: RF-TEC-112..119, 121..130; RF-UXD-094, 095; RNF-NFR-017, 156, 187..190, 219, 220; RNF-PLA-013.
ENTREGABLES: módulo field en apps/web-pwa con IndexedDB cifrado, descarga de hoja de ruta, captura de fotos, firma y lectura de código de barras/serie; fieldSyncBatches en API con idempotencia por operación; resolución de conflictos con reglas explícitas; borrado remoto del dispositivo.
NO CONSTRUIR TODAVÍA: perfiles lecturista y cobrador (O7, O5 y O7, RF-TEC-120, 131).
PRUEBAS: e2e Playwright con red cortada y restaurada sin duplicar movimientos; un dispositivo revocado no sincroniza; los datos locales no son legibles sin sesión.
TERMINADO CUANDO: la instalación de Ana Demo se registra sin conexión y se sincroniza correctamente.
VERIFICAR: playwright test --grep @O3-offline && dotnet test --filter FullyQualifiedName~Api -- --grep fieldSync
```

#### PRO-O3-09 — Equipos de red y aprovisionamiento de Internet

```text
PRO-O3-09 — Equipos de red y aprovisionamiento
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: equipos de red y centrales, vínculo del equipo del cliente con la red, aprovisionamiento automático de Internet y TV por adaptador (alta, cambio de plan, suspensión, baja) con modo simulado.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.11 (RF-TEC-155), §5.12, §5.15; anexos/T06-INT-integraciones.md (fichas de aprovisionamiento); anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.3, §1.5.
IMPLEMENTAR: RF-TEC-155, 164..167, 182..186, 188..193.
ENTREGABLES: networkEquipment (OLT, nodos, puertos); provisioningRequests con estados y reintentos por outbox; adaptador genérico y simulador ACS/OLT; reconciliación entre estado del contrato y estado en red.
NO CONSTRUIR TODAVÍA: suspensión por mora (O6, RF-TEC-187); TV y telefonía avanzadas (O10, RF-TEC-194, 195, 197..214).
PRUEBAS: un fallo del proveedor reintenta y alerta sin activar dos veces; la reconciliación detecta un equipo activo con contrato suspendido.
TERMINADO CUANDO: el plan INT-100 de Ana Demo queda aprovisionado en el simulador.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep provisioning && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O3-10 — Geolocalización operativa e informes técnicos

```text
PRO-O3-10 — Geolocalización operativa e informes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: posición de cuadrillas con consentimiento y franja laboral, mapa operativo de OT, informes técnicos, notificaciones y reporte técnico del catálogo BIA.
LEER: anexos/M10-TEC-tecnica-campo-redes.md §5.17, §5.18; anexos/T10-BIA-reportes-bi-apis.md (RF-BIA-020).
IMPLEMENTAR: RF-TEC-215..229; RF-BIA-020.
ENTREGABLES: gpsPositions con retención corta; mapa de OT y cuadrillas; informes de productividad y SLA técnico; notificaciones de OT.
NO CONSTRUIR TODAVÍA: GPS de flota (O10).
PRUEBAS: fuera de la franja laboral no se registra posición; la retención borra posiciones vencidas; informes respetan alcance.
TERMINADO CUANDO: el mapa operativo muestra la OT de Ana Demo y la cuadrilla.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep gps && playwright test --grep @O3-map
```

#### PRO-O3-11 — Reclamos e incidentes

```text
PRO-O3-11 — Reclamos e incidentes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: reclamos del socio con clasificación, diagnóstico guiado, OT asociada, incidentes masivos que agrupan reclamos por zona, avisos de interrupción y notificaciones transaccionales.
LEER: anexos/M09-CRM-atencion.md §5.3, §8, §10, §11, §17; anexos/T09-COM-comunidad-comunicaciones.md §5.7 (RF-COM-120), §5.9 (161, 163), §5.11 (183, 184).
IMPLEMENTAR: RF-CRM-100, 101, 103..113, 115, 116, 118..124; RF-COM-120, 161, 163, 183, 184; además (v1.1): RF-CRM-258 (plantilla de plataforma de SLA ENACOM para reclamos TIC); RF-CRM-260 (parte O3: SLA de reclamo de seguridad para los servicios distintos de GAS y ELE; la parte GAS y ELE es O7, PRO-O7-09).
ENTREGABLES: claims con tipos y diagnóstico; incidents con zona y agrupación automática; generación de OT de reparación por API de M10; aviso de interrupción por audiencia de zona; cierre con encuesta.
NO CONSTRUIR TODAVÍA: bonificación por interrupción en factura (O4, RF-CRM-102); reclamos de medición (O7, RF-CRM-114).
PRUEBAS: cerrar el incidente cierra los reclamos vinculados con notificación; un reclamo duplicado se vincula al incidente.
TERMINADO CUANDO: el reclamo "sin servicio" de Ana Demo genera OT y se cierra.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep claims && playwright test --grep @O3-claims
```

#### PRO-O3-12 — Completar expediente, solicitudes y canales del CRM

```text
PRO-O3-12 — Completar CRM
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar expediente y tickets, solicitudes comerciales con técnica, canales de atención (correo, formulario, WhatsApp) y tareas internas que dependen de OT, y gestiones técnicas en el portal.
LEER: anexos/M09-CRM-atencion.md §5.1, §5.2, §5.6, §5.8 (RF-CRM-236), §5.9 (256); anexos/M19-POR-portal-socio-landing.md §5.10 (RF-POR-113, 115).
IMPLEMENTAR: RF-CRM-017, 019..022, 029, 030, 032, 033, 046, 049, 051..053, 068, 070..075, 082, 084, 173, 184, 185, 187, 236, 256; RF-POR-113, 115.
ENTREGABLES: vínculos ticket–OT–contrato; solicitudes que requieren factibilidad; ingreso por canales con conversión a ticket; seguimiento de reclamo en el portal.
NO CONSTRUIR TODAVÍA: bot e IA (O6); omnicanal avanzado (O10).
PRUEBAS: un mensaje entrante del mismo socio se agrupa en el ticket abierto; el portal muestra el avance de la OT asociada.
TERMINADO CUANDO: Ana Demo sigue su reclamo en la PWA con el estado de la OT.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep crm && playwright test --grep @O3-crm
```

#### PRO-O3-13 — Integración de O3: instalación y reclamo del piloto Internet

```text
PRO-O3-13 — Integración de O3
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O3 (sección 7.2 del plan), validar la migración técnica y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §7; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.5, §1.6; anexos/T07-MIG-migracion-procoop.md §5.6 (RF-MIG-056); §17 y §18 de M10, M13 y M09.
IMPLEMENTAR: RF-MIG-056 (validación de migración de equipos, series y OT abiertas). Verificar los 319 RF de O3 (versión 1.0: 315).
ENTREGABLES: seed demo O3; e2e @O3 de 7.2 con red cortada; mapeos MIG de stock y OT; test:isolation.
NO CONSTRUIR TODAVÍA: nada de O4.
PRUEBAS: e2e @O3, test:isolation, k6 de sincronización de campo con 50 dispositivos simulados.
TERMINADO CUANDO: criterio 7.2 demostrado con evidencias en docs/evidencias/O3/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O3 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 8. O4 — Tarifas, facturación, ARCA e impuestos básicos

### 8.1 Objetivo

Construir el motor tarifario versionado y explicable (M04), el ciclo de facturación por lotes con prefacturación, excepciones, aprobación, emisión, numeración, PDF, QR y distribución (M05), la autorización fiscal ARCA con WSAA, WSFEv1 (CAE) y CAEA, IVA, IIBB de Córdoba y conceptos de terceros (M06), cargos por operación y financiación comercial del piloto (M11), y adherentes mínimos de M18 (DEC-071).

### 8.2 Criterio de salida (demostrable)

ESC-SRV-INT-01 hasta la factura: con el contrato activo de Ana Demo (O3), el cuadro tarifario de Internet publicado y el cargo de instalación, se arma el lote del ciclo, se prefactura y compara, se resuelven excepciones, se aprueba, se emite y la cola de autorización obtiene CAE en homologación ARCA (o en el simulador cuando no hay certificado de prueba), el PDF con QR fiscal y código de barras se publica en el portal y se envía por correo simulado. La explicación del cálculo de cada línea es consultable.

### 8.3 Dependencias

O3 completa. Requiere conexiones y certificados de O1 (T06) y numeración y PDF de O0.

### 8.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M04 TAR | 79 | RF-TAR-001..016, 018..022, 027, 029, 030, 032..036, 039, 042, 043, 051, 053..069, 071..073, 075, 076, 082..086, 088..096, 100, 103..108, 110, 112, 113 | PAN-TAR-01..29, API-TAR-01..67 (*reemplazado, corrección 05-11-2026:* antes API-TAR-01..65; 67 definidos en el anexo), EVT-TAR-01..21, JOB-TAR-01..14 (*reemplazado, corrección 05-11-2026:* antes JOB-TAR-01..13; 14 definidos en el anexo) (salvo medidos y telefonía) | `tariffSchedules`, `tariffVersions`, `prices`, `calcParameters`, `rules`, `formulas`, `benefits`, `calcRuns`, `calcExplanations` |
| M05 FAC | 150 | RF-FAC-001..055, 057..075, 077..093, 098..105, 112..114, 116..122, 126..129, 131, 132, 134..144, 147..150, 153..168, 172, 173 (v1.1: se agregan RF-FAC-177, 179) | PAN-FAC-01..47 (*reemplazado, corrección 05-11-2026:* antes PAN-FAC-01..46; 47 definidos en el anexo), API-FAC-01..35, 40..68, 70..93, 100..110, 120..139, 150..159 (*reemplazado, corrección 05-11-2026:* antes API-FAC-01..127; 129 definidos en el anexo), EVT-FAC-01..21 (*reemplazado, corrección 05-11-2026:* antes EVT-FAC-01..20; 21 definidos en el anexo), JOB-FAC-01..18 | `billingCycles`, `billingUniverses`, `billingBatches`, `preInvoices`, `billingExceptions`, `invoices`, `invoiceLines`, `billingGroups`, `dueDateRules`, `creditNotes`, `debitNotes`, `deliveries` |
| M06 FIS | 91 | RF-FIS-001..006, 008..011, 013..017, 021, 023..048, 050..070, 075..081, 083, 085..088, 090, 092, 093, 095, 112, 115, 116, 134, 135, 137, 141, 159, 160 (v1.1: se agregan RF-FIS-161, 167, 168) | PAN-FIS-01..41, API-FIS-01..81, EVT-FIS-01..24 (*reemplazado, corrección 05-11-2026:* antes EVT-FIS-01..21; 24 definidos en el anexo), JOB-FIS-01..20 de esos recursos | `taxTables`, `tenantTaxProfiles`, `arcaCredentials`, `wsaaTokens`, `pointsOfSale`, `caeQueue`, `caeaPeriods`, `vatRates`, `iibbJurisdictions`, `iibbPadron`, `vatBooks`, `thirdPartyConcepts` |
| M11 VEN | 22 | RF-VEN-001..008, 010, 011, 080..086, 091, 092, 106, 114, 116 | PAN-VEN y API-VEN de conceptos por operación y financiación | `operationCharges`, `financingPlans`, `installments` |
| M18 SOC | 9 | RF-SOC-011..014, 026, 140..142, 145 | Adherentes mínimos (DEC-071) | `adherents`, `beneficiaries` |
| M01 PER | 8 | RF-PER-020, 029, 049, 059, 066, 126, 133, 141 | Condición fiscal y efectos en cuentas | — |
| M02 CAT | 9 (antes 8) | RF-CAT-044, 046, 048, 052, 071, 086, 087, 098 (v1.2: se agrega RF-CAT-117) | Perfil fiscal y tarifario del contrato; marca de liquidación como servicio público (DEC-093) | — |
| T04 CFG | 6 | RF-CFG-056, 095, 098, 099, 101, 102 | Padrones fiscales e índices | `economicIndexes` |
| T06 INT | 11 | RF-INT-022..027, 038, 061, 064, 074, 076 | Certificados ARCA, intercambio de archivos | `certificates` |
| T11 WFL | 11 | RF-WFL-027, 028, 031, 046, 047, 174, 176..178, 189, 191 | Jobs de lote y plantillas fiscales | — |
| T09 COM | 4 | RF-COM-147, 150, 174, 195 | Envío de facturas | — |
| M19 POR | 9 | RF-POR-035, 078..081, 084..087 | PAN-POR de facturas y documentos | — |
| M08 MOR | 4 | RF-MOR-011..014 | Recargo entre vencimientos al emitir | — |
| M10 TEC | 2 | RF-TEC-063, 094 | Cargos de OT e instalación | — |
| M13 STK | 1 | RF-STK-080 | Cargo de comodato | — |
| M09 CRM | 1 | RF-CRM-102 | Bonificación por interrupción | — |
| T03 UXD | 2 | RF-UXD-111, 161 | — | — |
| T10 BIA | 3 | RF-BIA-090, 096, 099 | Reportes de facturación | — |
| T07 MIG | 3 | RF-MIG-007, 033, 038 | Mapeos de comprobantes históricos | — |
| **Total** | **425** (antes 424) | | | |

Extensiones de RF de olas anteriores: RF-PLA-123 (restauración con conciliación ARCA), RF-UXD-055, RF-CAT-017, 039, 043, 045, 050, 081.

### 8.5 Fuera de la ola

Cobranza e imputación (O5); intereses por mora al cobrar (O5); percepciones y retenciones como agente, regímenes informativos y libros completos (O8); medidos, CESP/LQSP y reguladores (O7); modo pasarela fiscal para terceros (O11); facturación del SaaS con M05 (O5, RF-PLA-040 y 082).

### 8.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| ARCA caído o lento | Cola de autorización con reintentos, CAEA como contingencia y estado fiscal separado del comprobante (M06 §5.5, §5.6) |
| Huecos de numeración | Numeración transaccional por punto de venta y tipo, con conciliación contra ARCA (FECompUltimoAutorizado); el comprobante rechazado vuelve a borrador y libera su número, y los posteriores sin CAE se renumeran desde el último autorizado (DEC-107, que reemplaza a DEC-035 en ese punto; antes "si ARCA rechaza se reenvía el mismo número") |
| Errores de cálculo en lote grande | Prefacturación simulada, comparación con el ciclo anterior y bandeja de excepciones antes de emitir |
| Uso de certificados reales | Solo homologación con certificado de pruebas generado por la plataforma (DEC-053, R13) |

### 8.7 Datos demo

M04 §18 (cuadro Internet ficticio), M05 §18 (ciclo mensual de ejemplo), M06 §18 (perfil fiscal de TEN-001 con CUIT ficticia, punto de venta 0001 de homologación), T12 parte1 §1.3 y §1.5.

### 8.8 Pruebas end-to-end de la ola

ESC-SRV-INT-01 (primera factura con CAE, T12 parte1 §1.7; antes §1.6); CU de M04 §17 (versión, simulación, explicación); CU de M05 §17 (lote completo, nota de crédito, refacturación); CU de M06 §17 (CAE, rechazo y reintento, CAEA, IIBB Córdoba).

### 8.9 Huecos que se resuelven en la ola

HUE-INT-01, HUE-INT-02 y HUE-SRV-05 (R9).

### 8.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O4-01 | Tablas normativas, perfil fiscal del tenant y padrones | 27 |
| PRO-O4-02 | Credenciales ARCA, certificados y WSAA | 15 |
| PRO-O4-03 | Puntos de venta, cola CAE (WSFEv1) y CAEA | 40 |
| PRO-O4-04 | IVA, IIBB, percepciones básicas, libros y conceptos de terceros | 28 |
| PRO-O4-05 | Cuadros tarifarios versionados y precios | 24 |
| PRO-O4-06 | Motor de cálculo, reglas, fórmulas y beneficios | 36 |
| PRO-O4-07 | Explicabilidad, simulación, retroactivos y perfil tarifario del contrato | 28 (antes 27; v1.2: RF-CAT-117) |
| PRO-O4-08 | Ciclos, universos y lote congelado | 27 |
| PRO-O4-09 | Prefacturación, excepciones y aprobación | 24 |
| PRO-O4-10 | Emisión, estado fiscal, modalidades y numeración | 41 |
| PRO-O4-11 | Vencimientos, bloqueo, notas, recategorización, ítems y factura manual | 36 |
| PRO-O4-12 | PDF, QR, talones, distribución y cierre de ciclo | 41 |
| PRO-O4-13 | Cargos por operación y financiación comercial | 26 |
| PRO-O4-14 | Adherentes mínimos (DEC-071) | 9 |
| PRO-O4-15 | Portal de facturas, efectos en personas, reportes y mapeos | 23 |
| PRO-O4-16 | Integración de O4: primera factura con CAE | 0 (verifica 425; antes 424) |

#### PRO-O4-01 — Tablas normativas, perfil fiscal del tenant y padrones

```text
PRO-O4-01 — Tablas normativas, perfil fiscal y padrones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: tablas normativas versionadas, relevamiento fiscal, perfil fiscal del tenant por razón social (legalEntityId), condición de agente, padrones ARCA e IIBB importados por archivo y consultas, e índices económicos.
LEER: anexos/M06-FIS-fiscal-impuestos.md §4, §5.1, §5.2, §7, §10, §11, §14, §17, §18; anexos/T04-CFG-configuracion-parametros-maestros.md §5.5 (RF-CFG-056), §5.9 (095), §5.10 (098, 099, 101, 102); anexos/T06-INT-integraciones.md §5.8 (RF-INT-061, 064); 01-registro-decisiones.md DEC-064.
IMPLEMENTAR: RF-FIS-001..006, 008..011, 013..017, 021, 023; RF-CFG-056, 095, 098, 099, 101, 102; RF-INT-061, 064; además (v1.1): RF-FIS-167 (emisión fiscal por entidad jurídica: `fiscalProfiles`, CUIT, credencial ARCA, puntos de venta, CAEA y libros por `legalEntityId`, DEC-064); RF-FIS-168 (mantenimiento mixto de padrones públicos y privados).
ENTREGABLES: taxTables con vigencia y fuente normativa; tenantTaxProfiles por legalEntity; importación de padrones por job con intercambio de archivos; economicIndexes; PAN-FIS de gobierno fiscal.
NO CONSTRUIR TODAVÍA: condición de agente de retención efectiva (O8, RF-FIS-018..020, 022); RF-FIS-007 y 012 (O8 y O7).
PRUEBAS: una alícuota con vigencia futura no aplica hoy; el padrón importado dos veces no duplica; perfil fiscal de una legalEntity no afecta a otra.
TERMINADO CUANDO: TEN-001 tiene perfil fiscal ficticio de Responsable Inscripto en Córdoba.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep fis
```

#### PRO-O4-02 — Credenciales ARCA, certificados y WSAA

```text
PRO-O4-02 — Credenciales ARCA y WSAA
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: certificados por razón social en la bóveda, generación de CSR, vencimientos y alertas, autenticación WSAA con caché de tickets de acceso por servicio, y cambio controlado de homologación a producción.
LEER: anexos/M06-FIS-fiscal-impuestos.md §5.3, §13; anexos/T06-INT-integraciones.md §5.2 (RF-INT-022, 023), §5.3; 01-registro-decisiones.md DEC-053, DEC-074.
IMPLEMENTAR: RF-FIS-024..032; RF-INT-022..027; RNF-NFR-071.
ENTREGABLES: arcaCredentials con referencia a la bóveda; generador de CSR (la clave privada nunca sale de la bóveda); wsaaTokens cacheados con renovación antes de vencer y bloqueo distribuido; alertas de vencimiento; conector ARCA en homologación con simulador.
NO CONSTRUIR TODAVÍA: modo pasarela para terceros (O11).
PRUEBAS: dos workers no piden dos tickets a la vez; la clave privada no aparece en ninguna respuesta ni log; sin certificado de prueba el conector usa el simulador.
TERMINADO CUANDO: WSAA devuelve un ticket de homologación o del simulador para wsfe.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep wsaa
```

#### PRO-O4-03 — Puntos de venta, cola CAE (WSFEv1) y CAEA

```text
PRO-O4-03 — Puntos de venta, CAE y CAEA
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: puntos de venta y modalidades, cola de autorización CAE con lotes, reintentos, rechazos y conciliación, y CAEA con solicitud, uso en contingencia e informe.
LEER: anexos/M06-FIS-fiscal-impuestos.md §5.4, §5.5, §5.6, §8 (estado fiscal), §12, §17; anexos/T06-INT-integraciones.md §5.5 (RF-INT-038), §5.9 (074, 076); anexos/T08-NFR-no-funcionales-seguridad.md §8.
IMPLEMENTAR: RF-FIS-033..048, 050..070; RF-INT-038, 074, 076; RNF-NFR-044, 047, 216, 217, 221.
DECISIONES v1.2 (10-11-2026): DEC-107 (reemplaza DEC-035 en el comprobante rechazado: el que ARCA rechaza vuelve a borrador y libera su número; los posteriores del mismo punto de venta y tipo sin CAE vuelven a la cola y se renumeran desde el último autorizado al reenviarse, como solicitud nueva con su `issueAttempt` y no como reintento; los autorizados nunca cambian; RF-FIS-053. En CAEA el rechazo del informe no renumera: se corrige y reinforma o se emite nota de crédito, RF-FIS-067); DEC-099 (un receptor `documentPending` queda detenido cuando el comprobante exige identificarlo por documento y se revalida al consumir EVT-PER-27, RF-FIS-043); DEC-094 (la vía de la LQSP sigue siendo CESP, separado del CAEA, PA-FIS-24; se construye en O7). PRUEBAS adicionales: si ARCA rechaza el comprobante 101 de un lote, el 102 y el 103 sin CAE vuelven a la cola y se renumeran al reenviarse, y el 100 autorizado no cambia.
ENTREGABLES: pointsOfSale por legalEntity; caeQueue con estados (pending, sent, authorized, rejected, observed, uncertain) y consulta de último autorizado ante incertidumbre; CAEA por quincena con informe; hook de restauración que concilia con ARCA (extensión RF-PLA-123); circuit breaker.
NO CONSTRUIR TODAVÍA: RF-FIS-049 (O8).
PRUEBAS: timeout de ARCA deja el comprobante en uncertain y se resuelve consultando sin duplicar número; rechazo por dato inválido va a excepciones; CAEA informado al final del período.
TERMINADO CUANDO: un comprobante de prueba obtiene CAE en homologación o simulador.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cae && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O4-04 — IVA, IIBB, percepciones básicas, libros y conceptos de terceros

```text
PRO-O4-04 — IVA, IIBB, libros y conceptos de terceros
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: condición IVA, clase de comprobante y alícuotas; IIBB de Córdoba con padrones y jurisdicciones; percepciones nacionales básicas; libro IVA ventas base; conceptos por cuenta y orden de terceros; conservación.
LEER: anexos/M06-FIS-fiscal-impuestos.md §5.8, §5.9, §5.10 (093, 095), §5.12 (112, 115, 116), §5.14 (134, 135, 137, 141), §5.18 (159, 160); anexos/M01-PER-personas-titulares-cuentas.md §5.2 (RF-PER-020, 029).
IMPLEMENTAR: RF-FIS-075..081, 083, 085..088, 090, 092, 093, 095, 112, 115, 116, 134, 135, 137, 141, 159, 160; RF-PER-020, 029; además (v1.1): RF-FIS-161 (clase fiscal "aporte de capital", concepto no gravado fuera del neto del servicio).
DECISIONES v1.1: DEC-083 (conceptos de terceros siempre sobre contrato propio del socio con perfil "convenio de terceros").
DECISIONES v1.2 (10-11-2026): DEC-093 (la clase de cada renglón, liquidación de servicios públicos o factura común, sale de la marca de M02 de RF-CAT-117 y de los conceptos accesorios que el tenant declare con respaldo del contador; nunca un comprobante mixto; RF-FIS-076, PA-FIS-23; la marca se construye en PRO-O4-07 y hasta entonces vale su default `false`); DEC-102 (la matriz `vatRateMatrix` admite el uso del suministro como condición opcional, desactivada por defecto hasta la confirmación del contador; con la condición apagada las filas con uso no se aplican; RF-FIS-079, PA-FIS-26).
ENTREGABLES: servicio fiscal puro calculateTaxes(lines, holderTaxProfile, legalEntity, date) con decimal.js; letra del comprobante; IIBB Córdoba con alícuota de padrón; conceptos de terceros fuera de la base imponible propia; libro IVA ventas exportable; condición fiscal de la persona con efecto en facturación.
NO CONSTRUIR TODAVÍA: RF-FIS-082, 084, 089 (O5); 091, 094, 096 (O8); Libro IVA Digital completo (O8).
PRUEBAS: tabla de casos de IVA (RI, monotributo, consumidor final, exento) con redondeos exactos; un concepto de terceros no suma IVA propio.
TERMINADO CUANDO: el cálculo fiscal de la factura de Ana Demo coincide con la tabla esperada de M06 §17.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep taxes
```

#### PRO-O4-05 — Cuadros tarifarios versionados y precios

```text
PRO-O4-05 — Cuadros tarifarios y precios
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cuadros tarifarios por servicio con versiones, aprobación y trazabilidad normativa, y precios y parámetros de cálculo por versión.
LEER: anexos/M04-TAR-tarifas-motor-calculo.md §4, §5.1, §5.2, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-TAR-001..016, 018..022, 027, 029, 030.
ENTREGABLES: tariffSchedules y tariffVersions (draft, approved, published, superseded) con resolución o acta de respaldo; prices y calcParameters en DECIMAL(19,4) con vigencia; importación de cuadros; comparación entre versiones; PAN-TAR.
NO CONSTRUIR TODAVÍA: RF-TAR-017, 023, 025, 026, 028, 031 (medidos, O7); 024 (O10).
PRUEBAS: una versión publicada es inmutable; solapamiento de vigencias rechazado; precios nunca como Number (lint).
TERMINADO CUANDO: el cuadro de Internet de T12 parte1 §1.3 está publicado en TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep tar
```

#### PRO-O4-06 — Motor de cálculo, reglas, fórmulas y beneficios

```text
PRO-O4-06 — Motor de cálculo
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: motor de cálculo puro y determinista en packages/domain que, dado contrato, período, versión tarifaria y datos de entrada, produce líneas con explicación; reglas declarativas, fórmulas seguras y beneficios.
LEER: anexos/M04-TAR-tarifas-motor-calculo.md §5.3, §5.4, §6, §9; anexos/T08-NFR-no-funcionales-seguridad.md §7.
IMPLEMENTAR: RF-TAR-032..036, 039, 042, 043, 051, 053..069, 071..073, 075, 076, 082..086; RNF-NFR-202..204, 209, 223.
DECISIONES v1.2 (10-11-2026): DEC-105 (se mantienen las fórmulas en entorno aislado de RF-TAR-068 con política de preferencia declarativa: toda regla con fórmula exige una justificación obligatoria de por qué no alcanza una regla declarativa, RF-TAR-067, visible en la revisión y aprobación del cuadro; el informe de reglas con fórmula se construye en PRO-O4-07; prohibir las fórmulas sigue rechazado). PRUEBAS adicionales: guardar una regla con fórmula sin justificación se rechaza.
ENTREGABLES: calculate(input) sin I/O; prorrateos por días; reglas declarativas con prioridad; evaluador de fórmulas sin eval y con tipos; beneficios y bonificaciones; calcRuns con hash de entrada; pruebas de propiedades (mismo input, mismo output).
NO CONSTRUIR TODAVÍA: cálculo por consumo medido (O7); telefonía (O10).
PRUEBAS: casos de M04 §17 con resultados exactos al centavo; una fórmula que intenta acceder a I/O falla; rendimiento de 10.000 cálculos dentro del RNF.
TERMINADO CUANDO: el abono INT-100 con prorrateo de alta se calcula exacto.
VERIFICAR: dotnet test --filter FullyQualifiedName~domain && dotnet test --filter FullyQualifiedName~Api -- --grep calc
```

#### PRO-O4-07 — Explicabilidad, simulación, retroactivos y perfil tarifario del contrato

```text
PRO-O4-07 — Explicabilidad, simulación y retroactivos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: explicación consultable de cada cálculo, simulador para operadores y socios, retroactivos por cambio de versión, reportes tarifarios, migración de cuadros y datos tarifarios y fiscales del contrato.
LEER: anexos/M04-TAR-tarifas-motor-calculo.md §5.5; anexos/M02-CAT-catalogo-servicios.md §5.4 (RF-CAT-044, 046, 048, 052), §5.7 (071, 086, 087, 098).
IMPLEMENTAR: RF-TAR-088..096, 100, 103..108, 110, 112, 113; RF-CAT-044, 046, 048, 052, 071, 086, 087, 098 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt). Además (v1.2): RF-CAT-117 (marca `tenantServices.profile.billing.publicServiceSettlement` por servicio, default false, ex `SERVICIO.LIQ_AFIP`, como cambio de tipo fiscal de la versión de configuración, DEC-093).
EXTENSIONES: extensiones de RF-CAT-017, 039, 043, 045, 050, 081.
DECISIONES v1.2 (10-11-2026): DEC-105 (REP-TAR-18: informe por tenant con la cantidad y la proporción de reglas con fórmula por servicio y por cuadro, RF-TAR-100); DEC-093 (RF-CAT-117: M02 solo declara la marca; la edita el responsable fiscal o contable con `cat.conceptos.configurarFiscal` y se aprueba con `cat.versiones.aprobar`; Internet, telefonía, TV, sepelio y servicios sociales no se marcan, PA-FIS-23; M05 y M06 la leen y no la duplican).
ENTREGABLES: calcExplanations legibles con dict; simulador en admin y portal; job de retroactivos que genera ajustes para el próximo lote; reportes de M04; perfil tarifario y fiscal del contrato.
NO CONSTRUIR TODAVÍA: RF-TAR-097..099 (O10), 101, 102 (O11).
PRUEBAS: la explicación suma exactamente el total; un retroactivo no se aplica dos veces.
TERMINADO CUANDO: Ana Demo ve en el simulador del portal el mismo importe que el lote.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep tar && playwright test --grep @O4-sim
```

#### PRO-O4-08 — Ciclos, universos y lote congelado

```text
PRO-O4-08 — Ciclos, universos y lote
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ciclos de facturación, universos por servicio, zona y categoría, plantillas, y preparación y congelamiento del universo del lote como job reanudable.
LEER: anexos/M05-FAC-facturacion.md §4, §5.1, §5.2, §7, §8 (estados del lote), §9, §12, §17, §18; anexos/T11-WFL-workflow-eventos-documentos.md §5.2 (RF-WFL-027, 028, 031).
IMPLEMENTAR: RF-FAC-001..024; RF-WFL-027, 028, 031; RNF-NFR-010..012, 024.
ENTREGABLES: billingCycles; billingUniverses; billingBatches con estados (draft, frozen, prebilled, approved, issuing, issued, closed); congelamiento con snapshot de contratos y versiones; jobs fac:preparar-lote reanudables por chunks.
NO CONSTRUIR TODAVÍA: emisión (PRO-O4-10).
PRUEBAS: un contrato modificado tras congelar no cambia el lote; un job interrumpido reanuda sin duplicar; dos lotes del mismo ciclo y universo no coexisten.
TERMINADO CUANDO: el lote del ciclo de ejemplo incluye el contrato de Ana Demo.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep batches && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O4-09 — Prefacturación, excepciones y aprobación

```text
PRO-O4-09 — Prefacturación, excepciones y aprobación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: prefacturación simulada, comparación con el ciclo anterior, bandeja de excepciones con reglas configurables y aprobación del lote con T11.
LEER: anexos/M05-FAC-facturacion.md §5.3, §5.4, §5.5; anexos/T11-WFL-workflow-eventos-documentos.md §5.3 (RF-WFL-046, 047).
IMPLEMENTAR: RF-FAC-025..046; RF-WFL-046, 047.
DECISIONES v1.2 (10-11-2026): DEC-093 (los candidatos se arman por titular o cuenta, grupo de facturación y clase de comprobante: un servicio que liquida como servicio público ya no convierte toda la factura en LQSP, RF-FAC-028; corrige RN-FAC-040); DEC-099 (un receptor `documentPending` no recibe comprobantes que exijan identificarlo por documento y el caso va a excepciones, RF-FAC-032, RN-FAC-162).
ENTREGABLES: preInvoices; reglas de excepción (variación mayor al umbral, importe cero, sin domicilio, condición fiscal inconsistente); billingExceptions con resolución; aprobación con política de T11.
NO CONSTRUIR TODAVÍA: emisión.
PRUEBAS: una excepción abierta bloquea la aprobación según parámetro; la comparación marca variaciones mayores a PRM.
TERMINADO CUANDO: el lote de ejemplo queda aprobado con evidencia.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep prebilling
```

#### PRO-O4-10 — Emisión, estado fiscal, modalidades y numeración

```text
PRO-O4-10 — Emisión y numeración
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: emisión del lote con numeración por punto de venta y tipo, envío a la cola CAE, estado fiscal separado, modalidad separada y agrupada, grupos de facturación, tipos de comprobante y letras.
LEER: anexos/M05-FAC-facturacion.md §5.6, §5.7, §5.8, §5.9; anexos/T11-WFL-workflow-eventos-documentos.md §5.13 (RF-WFL-189, 191).
IMPLEMENTAR: RF-FAC-047..055, 057..075, 077..085; RF-WFL-189, 191; RNF-NFR-146, 153, 159; además (v1.1): RF-FAC-177 (emitir por entidad jurídica resolviendo `legalEntityId` por contrato o por `tenantServices.legalEntityId`, DEC-064 y DEC-087); RF-FAC-179 (numeración de recibos de M07 por entidad jurídica con el servicio interno `fac.service.nextNumber`).
DECISIONES v1.2 (10-11-2026): DEC-107 (reemplaza DEC-035 en el comprobante rechazado; antes "si ARCA rechaza se reenvía el mismo número": el rechazado vuelve a borrador y libera su número, el numerador toma como referencia el último autorizado por punto de venta y tipo, los posteriores del lote sin CAE vuelven a la cola y se renumeran al reenviarse, los autorizados nunca cambian, ningún comprobante se imprime, envía ni publica ante entes de cobro antes de tener CAE, CAEA informado o CESP, y se audita cada número asignado, liberado y reasignado con su motivo; RF-FAC-048, 061 a 063, 081 y 084, RN-FAC-164); DEC-093 (el grupo de facturación separa los conceptos por clase de comprobante y emite un documento por clase, RF-FAC-067); DEC-104 (`numberSequences.authorizationType` admite `CESP` y `numberSequences.billingGroupId` es obligatorio, RF-FAC-081). La numeración "sin huecos" se controla sobre los números autorizados: un número liberado por rechazo se reasigna y no es un hueco. PRUEBAS adicionales: el rechazo de un comprobante intermedio no altera ningún autorizado y deja la traza de liberación y reasignación; un comprobante sin CAE no genera PDF, envío ni publicación.
ENTREGABLES: invoices e invoiceLines inmutables tras emitir; numeración transaccional sin huecos; evento fac.invoice.issued por outbox; integración con caeQueue; billingGroups.
NO CONSTRUIR TODAVÍA: RF-FAC-056 (O10), 076 (O5).
PRUEBAS: emisión concurrente sin números repetidos; un comprobante emitido no se edita; el lote parcialmente autorizado muestra estado por comprobante.
TERMINADO CUANDO: la factura de Ana Demo está emitida y autorizada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep issue && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O4-11 — Vencimientos, bloqueo, notas, recategorización, ítems y factura manual

```text
PRO-O4-11 — Vencimientos, notas y factura manual
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: vencimientos y tramas con recargo entre vencimientos, bloqueo de comprobantes, anulación con notas de crédito y débito, recategorización y modificación masiva, cuotas e ítems facturables de terceros, factura manual y refacturación puntual.
LEER: anexos/M05-FAC-facturacion.md §5.10, §5.11 (093), §5.12, §5.13 (112..114), §5.14, §5.15; anexos/M08-MOR-mora-financiacion.md §5.2 (RF-MOR-011..014).
IMPLEMENTAR: RF-FAC-086..093, 098..105, 112..114, 116..122, 126..129, 131, 132; RF-MOR-011..014.
DECISIONES v1.2 (10-11-2026): DEC-106 (de 1 a 4 vencimientos por defecto; el tope pasa a ser un parámetro del tenant, PRM-FAC-163, por tipo de comprobante o servicio; al subirlo se valida que los formatos de código de barras y los layouts de los entes habilitados admitan esa cantidad, y ante el formato o ente que no la admite se publican solo los primeros vencimientos que soporta; RF-FAC-086, 112, 113 y 126, RN-FAC-163; antes "de 1 a 4 vencimientos" fijo). PRUEBAS adicionales: subir el tope a 5 con un ente que admite 4 avisa y ese ente recibe solo los 4 primeros vencimientos.
ENTREGABLES: dueDateRules con días hábiles; recargo entre primer y segundo vencimiento calculado al emitir; creditNotes y debitNotes con CAE; recategorización con aprobación; billableItems de otros módulos; factura manual con controles.
NO CONSTRUIR TODAVÍA: bloqueos por mora (O5 y O6); RF-FAC-106..111, 115, 123..125, 130, 133.
PRUEBAS: una NC no supera el saldo del comprobante; el recargo entre vencimientos coincide con M08 §17; un ítem facturable se factura una sola vez.
TERMINADO CUANDO: una NC parcial sobre la factura de Ana Demo obtiene CAE.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep creditNotes
```

#### PRO-O4-12 — PDF, QR, talones, distribución y cierre de ciclo

```text
PRO-O4-12 — PDF, QR, distribución y cierre
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: diseño e impresión con el motor PDF (DEC-080), gráficos de consumo, QR fiscal ARCA, código de barras de pago, talones, distribución por reparto, correo, WhatsApp y portal, y cierre de ciclo y de módulo.
LEER: anexos/M05-FAC-facturacion.md §5.16, §5.17 (140..144, 147, 148), §5.18 (149, 150, 153), §5.19, §5.20 (164..168, 172, 173); anexos/T11-WFL-workflow-eventos-documentos.md §5.12 (174, 176..178); anexos/T09-COM-comunidad-comunicaciones.md §5.8 (147, 150), §5.10 (174), §5.12 (195); 01-registro-decisiones.md DEC-080.
IMPLEMENTAR: RF-FAC-134..144, 147..150, 153..168, 172, 173; RF-WFL-174, 176..178; RF-COM-147, 150, 174, 195; RNF-NFR-179, 199, 230.
DECISIONES v1.2 (10-11-2026): DEC-106 (cada formato de código de barras declara cuántos vencimientos admite y codifica solo esos; los talones suman del primer al último vencimiento, 4 con el tope por defecto; RF-FAC-140 y 149); DEC-107 (ningún comprobante se imprime, se envía ni se publica antes de tener CAE, CAEA informado o CESP).
ENTREGABLES: plantillas de factura con zonas editables; render masivo por job; QR ARCA y barras; deliveries por canal con estado; publicación en portal; cierre de ciclo.
NO CONSTRUIR TODAVÍA: QR de pago de billeteras (O5, RF-FAC-145, 146).
PRUEBAS: el QR codifica los datos exigidos por ARCA; 10.000 PDF en job dentro del RNF; un envío rebotado queda marcado.
TERMINADO CUANDO: el PDF de la factura de Ana Demo se descarga del portal por URL firmada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep pdf && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O4-13 — Cargos por operación y financiación comercial

```text
PRO-O4-13 — Cargos por operación y financiación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: conceptos por cobrar en operaciones con titulares (instalación, cambio de equipo, visitas), financiación comercial en cuotas y cargos que vienen de OT, comodato y reclamos.
LEER: anexos/M11-VEN-ventas-presupuestos.md §4, §5.1, §5.4 (080..086, 091, 092), §5.5 (106), §5.6 (114, 116); anexos/M10-TEC-tecnica-campo-redes.md RF-TEC-063, 094; anexos/M13-STK-stock-activos-fabricacion.md RF-STK-080; anexos/M09-CRM-atencion.md RF-CRM-102.
IMPLEMENTAR: RF-VEN-001..008, 010, 011, 080..086, 091, 092, 106, 114, 116; RF-TEC-063, 094; RF-STK-080; RF-CRM-102.
ENTREGABLES: operationCharges generados por evento del origen como billableItems; financingPlans e installments; bonificación por interrupción desde incidentes.
NO CONSTRUIR TODAVÍA: presupuestos y venta de productos (O8); RF-VEN-009 (O6), 012 (O8), 013 (O7).
PRUEBAS: el cargo de instalación se factura una vez aunque el evento se repita; las cuotas suman exacto el total.
TERMINADO CUANDO: el cargo de instalación de Ana Demo en 3 cuotas aparece en su factura.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep ven
```

#### PRO-O4-14 — Adherentes mínimos (DEC-071)

```text
PRO-O4-14 — Adherentes mínimos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: adherentes y beneficiarios como entidad de M18 con referencia a personas de M01, con el alcance mínimo que la facturación de servicios con adherentes requiere (DEC-071, HUECO-TRV-01).
LEER: 01-registro-decisiones.md DEC-071; 05-registro-huecos.md HUECO-TRV-01; anexos/M18-SOC-servicios-sociales-flota.md §5.2 (RF-SOC-011..014, 026), §5.11 (140..142, 145), §7.
IMPLEMENTAR: RF-SOC-011..014, 026, 140..142, 145.
ENTREGABLES: adherents y beneficiaries con vínculo a persona y contrato; altas y bajas con vigencia; cargo por adherente como billableItem; transversales de M18 (permisos, auditoría, reportes base).
NO CONSTRUIR TODAVÍA: planes de cobertura y servicios sociales (O10); RF-PER-109..117 de M01 (O10, ver §19 C-02).
PRUEBAS: un adherente dado de baja no factura desde la fecha; la referencia a persona es única por contrato.
TERMINADO CUANDO: un contrato ficticio con dos adherentes factura el cargo correcto.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep adherents
```

#### PRO-O4-15 — Portal de facturas, efectos en personas, reportes y mapeos

```text
PRO-O4-15 — Portal de facturas, reportes y mapeos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: facturas y documentos en el portal, vinculación por factura, efectos fiscales en personas y cuentas, reportes de facturación y mapeos de migración de comprobantes.
LEER: anexos/M19-POR-portal-socio-landing.md §5.3 (RF-POR-035), §5.7; anexos/M01-PER-personas-titulares-cuentas.md RF-PER-049, 059, 066, 126, 133, 141; anexos/T03-UXD-experiencia-marca-diccionario.md RF-UXD-111, 161; anexos/T10-BIA-reportes-bi-apis.md RF-BIA-090, 096, 099; anexos/T07-MIG-migracion-procoop.md RF-MIG-007, 033, 038; anexos/T04-CFG-configuracion-parametros-maestros.md RNF-CFG-006; anexos/T11-WFL-workflow-eventos-documentos.md RNF-WFL-002.
IMPLEMENTAR: RF-POR-035, 078..081, 084..087; RF-PER-049, 059, 066, 126, 133, 141; RF-UXD-111, 161; RF-BIA-090, 096, 099; RF-MIG-007, 033, 038; RNF-CFG-006; RNF-WFL-002.
DECISIONES v1.2 (10-11-2026): DEC-107 (el portal no publica un comprobante que requiere autorización y todavía no la tiene, y lo referencia por `invoiceId`, nunca por número, RF-POR-085).
ENTREGABLES: "Mis facturas" con filtros y descarga; vinculación por número de factura; sección de facturación en Ficha360; reportes de M05 y M06; mapeos MIG de comprobantes históricos como solo lectura.
NO CONSTRUIR TODAVÍA: pagar desde el portal (O5).
PRUEBAS: el socio solo descarga sus facturas; la vinculación por factura exige dato adicional.
TERMINADO CUANDO: Ana Demo ve y descarga su factura en la PWA.
VERIFICAR: playwright test --grep @O4-portal
```

#### PRO-O4-16 — Integración de O4: primera factura con CAE

```text
PRO-O4-16 — Integración de O4
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O4 (sección 8.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §8; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.7 (ESC-SRV-INT-01; antes §1.6); §17 y §18 de M04, M05 y M06.
IMPLEMENTAR: ningún RF nuevo. Verificar los 425 RF de O4 (antes 424; versión 1.0: 419).
ENTREGABLES: seed demo O4; e2e @O4 de 8.2; prueba de carga de lote de 20.000 contratos ficticios; test:isolation.
NO CONSTRUIR TODAVÍA: nada de O5.
PRUEBAS: e2e @O4, test:isolation, k6 de lote.
TERMINADO CUANDO: criterio 8.2 demostrado con evidencias en docs/evidencias/O4/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O4 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 9. O5 — Cuenta corriente, cobranza, pasarelas, tesorería básica y núcleo contable

### 9.1 Objetivo

Construir el auxiliar comercial y la cuenta corriente (M07): saldos, imputación, saldos a favor, caja, recibos, cobradores, entes recaudadores, débito automático, pagos online y pasarelas prioritarias (DEC-015), cupón único, devoluciones, conciliación y rendición; motor común de interés y recargos al cobrar (M08, parte de cobro); tesorería básica (M14, DEC-059); núcleo contable con motor de asientos automáticos (M15, DEC-009 y DEC-069); capital social mínimo (M17, DEC-019); pagos en el portal y facturación del SaaS (DEC-065).

### 9.2 Criterio de salida (demostrable)

Ana Demo paga su factura desde la PWA con una pasarela prioritaria en modo prueba; el webhook firmado llega, se imputa por la regla configurada, se emite el recibo, la caja online se rinde a tesorería, se concilia con el extracto ficticio y el motor contable genera los asientos de facturación, cobranza y rendición en el plan de cuentas de ejemplo (no oficial, DEC-069). Un pago en caja presencial con recargo por mora calculado al cobrar y un cobro por ente recaudador con archivo ficticio quedan imputados. La plataforma emite la factura del SaaS de TEN-001 con M05 (DEC-065).

### 9.3 Dependencias

O4 completa.

### 9.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M07 COB | 186 (antes 185) | RF-COB-001..071, 073, 076..093, 097..154, 156..175, 177, 179..189 (v1.1: se agregan RF-COB-176, 191, 192, 193, 194) (v1.2: se agrega RF-COB-195) | PAN-COB-01..36 (*reemplazado, corrección 05-11-2026:* antes PAN-COB-01..42; 36 definidos en el anexo), API-COB-01..91 (*reemplazado, corrección 05-11-2026:* antes API-COB-01..87; 91 definidos en el anexo), EVT-COB-01..27 (*reemplazado, corrección 05-11-2026:* antes EVT-COB-01..22; 27 definidos en el anexo), JOB-COB-01..22 (*reemplazado, corrección 05-11-2026:* antes JOB-COB-01..14; 22 definidos en el anexo) | `ledgerEntries`, `accountBalances`, `allocations`, `creditBalances`, `unidentifiedPayments`, `cashRegisters`, `cashSessions`, `receipts`, `collectors`, `collectionAgencies`, `agencyFiles`, `directDebits`, `paymentIntents`, `gatewayPayments`, `paymentCoupons`, `refunds`, `chargebacks`, `settlements` |
| M08 MOR | 31 | RF-MOR-001..005, 007..010, 017..023, 026, 027, 029..034, 036, 041..044, 046, 047 | Motor de interés | `interestPolicies`, `interestCalculations` |
| M14 TES | 71 | RF-TES-001..006, 009, 011, 013..018, 020..022, 025, 027, 028, 030..044, 047, 048, 050, 123, 126..130, 132..140, 144, 145, 166, 168..170, 175, 176, 178..186, 188 | PAN-TES y API-TES de cuentas, movimientos, extractos, rendiciones y cierre | `financialAccounts`, `treasuryMovements`, `bankStatements`, `reconciliations`, `cashDeposits`, `treasuryClosings`, `exchangeRates` |
| M15 CON | 85 (*reemplazado, corrección 05-11-2026:* antes 84) | RF-CON-001..007, 009..013, 015, 017, 022, 023, 025, 027..033, 035..040, 042..045, 048, 050..067, 075, 081, 083, 084, 086, 087, 091..094, 100..102, 112, 114, 115, 121, 124..126, 139..141, 150, 151, 153..157, 159 (v1.1: se agregan RF-CON-098, 162) (v1.1: sale RF-CON-025, 075 por cambio de ola del anexo; reemplazado) (corrección 05-11-2026: se agrega RF-CON-160, parte O5 de saldos de apertura, §18) | PAN-CON, API-CON del núcleo | `chartsOfAccounts`, `accounts` (contables), `fiscalYears`, `periods`, `journalEntries`, `postingRules`, `costCenters`, `ledgerBalances` |
| M17 INS | 15 | RF-INS-029..031, 034..038, 040, 042..046, 056 | Capital social mínimo | `capitalAccounts`, `capitalMovements` |
| M06 FIS | 11 | RF-FIS-082, 084, 089, 110, 136, 138, 139, 151..153, 157 | — | — |
| M05 FAC | 10 | RF-FAC-076, 094, 096, 097, 106, 130, 145, 146, 151, 152 | QR de billeteras y talones de pago | — |
| M19 POR | 19 | RF-POR-012, 043..045, 082, 083, 089..098, 100, 101, 128 | PAN-POR de pagos | — |
| M01 PER | 5 | RF-PER-062, 065, 107, 127, 140 | — | — |
| T06 INT | 18 | RF-INT-010, 045, 053..057, 059, 060, 062, 063, 065..069, 075, 081 | Webhooks entrantes e intercambio de archivos | `inboundWebhooks`, `fileExchanges` |
| T07 MIG | 7 | RF-MIG-047, 054, 055, 057, 083..085 | Saldos y cuentas corrientes | — |
| T04 CFG | 6 | RF-CFG-090..094, 096 | Índices, monedas y tasas | — |
| T01 PLA | 2 | RF-PLA-040, 082 | Facturación del SaaS (DEC-065) | — |
| T10 BIA | 4 | RF-BIA-015, 092, 093, 095 | — | — |
| **Total** | **470** (antes 469; *reemplazado, corrección 05-11-2026:* antes 468) | | | |

Extensiones: RF-PLA-123 (conciliación de pasarelas tras restauración), RF-INT-074, RF-CAT-027, RF-STK-094 (costeo para asiento de stock), parte de RF-CON-160 (saldos de apertura, cuya implementación completa es O11). *Reemplazado (corrección 05-11-2026):* RF-CON-160 deja de ser extensión en O5: empieza aquí (PRO-O5-11, regla §0.1) y la migración repetible completa es extensión en O11.

Reasignados a esta ola: RF-CON-025, 075, 150 y 151 (de O10 a O5, por DEC-019 y HUECO-CAP-01), RF-TES-128 (O5 con extensión en O8). Ver §18. *Reemplazado en v1.1:* el anexo M15 adelantó a O5 RF-CON-098, 150 y 151, y M07 adelantó RF-COB-176; RF-CON-025 y 075 siguen en O10 en el anexo y vuelven a PRO-O10-02 (en O5 quedan como extensión). Ver §18 y §21. *Corrección 05-11-2026:* RF-CON-160 empieza en esta ola (PRO-O5-11, saldos de apertura) por la regla §0.1; ver §18 y §21.5.

### 9.5 Fuera de la ola

Planes de pago, corte y reconexión (O6); tesorería completa (valores, cheques, eCheq, Interbanking, tarjetas, flujo de fondos, O8); contabilidad completa (múltiples planes, ajuste por inflación, cierre, libros rubricados, O8); capital social completo, excedentes y asamblea (O10); pasarelas no prioritarias (O11, DEC-015).

### 9.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Doble imputación por webhook repetido | Idempotencia por id externo de pago y Idempotency-Key, outbox y conciliación diaria |
| Diferencias entre auxiliar y contabilidad | Asientos solo por motor de reglas a partir de eventos; conciliación auxiliar–mayor (M15 §5.7) |
| Archivos de entes con formatos heterogéneos | Parsers declarativos por ente con pruebas de archivos ficticios (M07 §5.16) |
| Plan de cuentas no oficial | Plan de ejemplo marcado no oficial y editable (DEC-069) |

### 9.7 Datos demo

M07 §18 (caja central, ente recaudador ficticio, archivo de ejemplo), M08 §18, M14 §18 (cuenta bancaria ficticia, extracto CSV), M15 §18 (plan de ejemplo), M17 §18, T12 parte1 §1.5.

### 9.8 Pruebas end-to-end de la ola

ESC-SRV-INT-02 y ESC-SRV-INT-03 de T12 parte1 §1.7 (falla de aprovisionamiento y reconexión tras el pago; antes "§1.6 (pago online y presencial)", que no coincide con T12); CU de M07 §17 (imputación, saldo a favor, contracargo, rendición); CU de M14 §17 (conciliación); CU de M15 §17 (asientos automáticos, balance de sumas y saldos); CU de M17 §17 (suscripción de capital).

### 9.9 Huecos que se resuelven en la ola

HUECO-CAP-01..04 en su parte contable y de suscripción mínima (el resto en O10) (R9).

### 9.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O5-01 | Motor común de interés, recargos al cobrar e índices | 37 |
| PRO-O5-02 | Auxiliar comercial, saldos y resumen de cuenta | 34 |
| PRO-O5-03 | Imputación, saldos a favor y cobros no identificados | 27 |
| PRO-O5-04 | Caja, recibos y bloqueos de cobro | 38 |
| PRO-O5-05 | Cobradores y entes recaudadores | 31 |
| PRO-O5-06 | Débito automático, pagos online y pasarelas prioritarias (DEC-015) | 48 |
| PRO-O5-07 | Cupón, devoluciones, conciliación, efectos contables, terceros y transición | 58 (antes 57; v1.2: RF-COB-195) |
| PRO-O5-08 | Tesorería básica: cuentas, movimientos y conciliación bancaria | 38 |
| PRO-O5-09 | Rendiciones, cierre de cajas, cotizaciones e informes de tesorería | 33 |
| PRO-O5-10 | Núcleo contable: configuración, plan de cuentas, ejercicios y centros de costo | 30 |
| PRO-O5-11 | Asientos manuales y automáticos, conciliaciones e informes base | 57 (*reemplazado, corrección 05-11-2026:* antes 56; se agrega RF-CON-160) |
| PRO-O5-12 | Capital social mínimo (DEC-019) | 18 |
| PRO-O5-13 | Pagos en el portal y facturación del SaaS (DEC-065) | 21 |
| PRO-O5-14 | Integración de O5: pago online imputado, rendido y asentado | 0 (verifica 470; antes 469; *reemplazado, corrección 05-11-2026:* antes 468) |

#### PRO-O5-01 — Motor común de interés, recargos al cobrar e índices

```text
PRO-O5-01 — Motor de interés y recargos al cobrar
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: motor común de interés (simple, compuesto, tasa por tramo, índice), recargos por mora al cobrar o consultar, diferimiento y documentación del interés, e índices económicos, monedas y tasas de referencia.
LEER: anexos/M08-MOR-mora-financiacion.md §4, §5.1, §5.2 (017..020), §5.3, §5.4, §6, §17; anexos/T04-CFG-configuracion-parametros-maestros.md §5.9.
IMPLEMENTAR: RF-MOR-001..005, 007..010, 017..023, 026, 027, 029..034, 036, 041..044, 046, 047; RF-CFG-090..094, 096.
ENTREGABLES: computeInterest puro en packages/domain con decimal.js; interestPolicies por servicio y categoría; cálculo al cobrar con documento de interés (nota de débito diferida o línea en próxima factura según parámetro); índices y tasas con vigencia.
NO CONSTRUIR TODAVÍA: proceso masivo de intereses a facturar (O6); RF-MOR-006, 016, 024, 025, 028, 035, 040, 045 (O6); 015, 038, 039 (O7); 037 (O8).
PRUEBAS: casos de M08 §17 exactos al centavo; un cambio de tasa no recalcula intereses ya documentados.
TERMINADO CUANDO: el recargo por mora de una factura vencida de Ana Demo coincide con la tabla esperada.
VERIFICAR: dotnet test --filter FullyQualifiedName~domain && dotnet test --filter FullyQualifiedName~Api -- --grep interest
```

#### PRO-O5-02 — Auxiliar comercial, saldos y resumen de cuenta

```text
PRO-O5-02 — Auxiliar comercial y saldos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: auxiliar comercial de doble entrada por cuenta y contrato con saldos materializados, cuentas separadas o unificadas, resumen de cuenta y mínimo de pago.
LEER: anexos/M07-COB-cuenta-corriente-cobranza.md §4, §5.1, §5.2, §7, §8, §9, §11, §17, §18; anexos/M01-PER-personas-titulares-cuentas.md RF-PER-062, 065.
IMPLEMENTAR: RF-COB-001..030; RF-PER-062, 065; además (v1.1): RF-COB-191 (consulta diferida del detalle de más de 36 meses, DEC-087); RF-COB-192 (una cuenta corriente por titular y por entidad jurídica, DEC-087).
DECISIONES v1.1: DEC-087 (una cuenta corriente por titular y entidad jurídica; detalle histórico de más de 36 meses archivado con consulta diferida; facturas, recibos y asientos con sus PDF siempre en línea).
DECISIONES v1.2 (10-11-2026): DEC-106 y DEC-107 (RF-COB-001: la obligación registra de 1 a 4 vencimientos por defecto, hasta el tope del tenant, con importe por vencimiento; la de un comprobante que requiere autorización fiscal no se cobra ni se publica hasta la autorización, RN-COB-158).
ENTREGABLES: ledgerEntries inmutables (débito por evento fac.invoice.issued, crédito por pagos y NC); accountBalances recalculables; resumen PDF; sección de saldo en Ficha360; reconstrucción del saldo desde movimientos.
NO CONSTRUIR TODAVÍA: imputación (PRO-O5-03).
PRUEBAS: el saldo materializado coincide con la suma de movimientos tras 1.000 operaciones concurrentes; un evento de factura repetido no duplica débito.
TERMINADO CUANDO: la cuenta de Ana Demo muestra la factura de O4 como deuda.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep ledger
```

#### PRO-O5-03 — Imputación, saldos a favor y cobros no identificados

```text
PRO-O5-03 — Imputación y saldos a favor
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: reglas de imputación configurables (antigüedad, servicio, concepto), imputación manual con aprobación, desimputación, saldos a favor, anticipos, excedentes y cobros no identificados.
LEER: anexos/M07-COB-cuenta-corriente-cobranza.md §5.3, §5.4, §6; anexos/M01-PER-personas-titulares-cuentas.md RF-PER-107, 127, 140.
IMPLEMENTAR: RF-COB-031..054; RF-PER-107, 127, 140.
ENTREGABLES: allocations con regla aplicada y versión; creditBalances aplicables automáticamente a próximas facturas; unidentifiedPayments con bandeja de asignación; garantías económicas del titular.
NO CONSTRUIR TODAVÍA: imputación a convenios (O6).
PRUEBAS: la imputación por antigüedad paga primero la deuda más vieja; desimputar restituye exacto; un no identificado asignado tarde respeta la fecha valor.
TERMINADO CUANDO: un pago parcial de Ana Demo se imputa según la regla del tenant.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep allocations
```

#### PRO-O5-04 — Caja, recibos y bloqueos de cobro

```text
PRO-O5-04 — Caja y recibos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cajas, sesiones de caja con apertura, arqueo y cierre, cobro presencial multimedio, recibos numerados y bloqueos de comprobantes que impiden cobrar.
LEER: anexos/M07-COB-cuenta-corriente-cobranza.md §5.5 (055..071, 073, 076..085), §5.6; anexos/M05-FAC-facturacion.md §5.11 (094, 096, 097), §5.17 (145); anexos/T08-NFR-no-funcionales-seguridad.md RNF de caja.
IMPLEMENTAR: RF-COB-055..071, 073, 076..090; RF-FAC-094, 096, 097, 145; RNF-NFR-005, 006, 205, 218, 224, 225, 229; además (v1.1): RF-COB-193 (un cobro de caja que cubre deuda de varias entidades jurídicas con un recibo por entidad, DEC-087).
DECISIONES v1.2 (10-11-2026): DEC-107 (el recibo no pasa por ARCA: su numerador es `authorizationType = none`, su número es definitivo al emitirse y no le aplican la liberación ni la renumeración; RF-COB-087).
ENTREGABLES: cashRegisters y cashSessions; cobro con lectura de código de barras; recibos con PDF; arqueo con diferencias aprobadas; bloqueos de comprobante; QR de pago en la factura (RF-FAC-145).
NO CONSTRUIR TODAVÍA: RF-COB-072 (O8), 074 (O10), 075 (O7).
PRUEBAS: no se cobra con sesión cerrada; un comprobante bloqueado no se cobra; dos cajeros no cobran la misma factura (concurrencia).
TERMINADO CUANDO: un cobro presencial con recargo se registra y emite recibo.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cash && playwright test --grep @O5-cash
```

#### PRO-O5-05 — Cobradores y entes recaudadores

```text
PRO-O5-05 — Cobradores y entes recaudadores
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cobranza fuera de oficina por cobradores y entes recaudadores (Pago Fácil, Rapipago, bancos, otros) con archivos de cobranza, validación, imputación y comisiones.
LEER: anexos/M07-COB-cuenta-corriente-cobranza.md §5.7 (091..093, 097), §5.8; anexos/T06-INT-integraciones.md §5.8 (RF-INT-059, 060, 062, 063, 065, 066).
IMPLEMENTAR: RF-COB-091..093, 097..118; RF-INT-059, 060, 062, 063, 065, 066.
DECISIONES v1.2 (10-11-2026): DEC-106 (cada familia de archivo declara cuántos vencimientos admite, `fileLayouts.dueDateCapacity`, y al ente solo se publican los primeros que admite; RF-COB-099 y 101, RF-INT-059, RN-COB-159); DEC-107 (solo se exportan obligaciones con `fiscalGate` `authorized` o `notRequired`; las que se autorizan después o se reemiten tras volver a borrador entran en la novedad siguiente; RF-COB-101 y 104, RN-COB-158).
ENTREGABLES: collectors con rendición; collectionAgencies con formato de archivo declarativo; agencyFiles con validación, preview, rechazos e imputación por job; comisiones; intercambio de archivos por SFTP simulado.
NO CONSTRUIR TODAVÍA: app de cobrador offline (O10, RF-COB-094; O7, 095, 096).
PRUEBAS: el mismo archivo procesado dos veces no duplica (hash); un registro con código de barras inválido queda rechazado con motivo.
TERMINADO CUANDO: un archivo ficticio de ente recaudador se procesa e imputa.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep agencies && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O5-06 — Débito automático, pagos online y pasarelas prioritarias (DEC-015)

```text
PRO-O5-06 — Débito automático y pasarelas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: adhesiones y presentaciones de débito automático, pagos online con intención de pago, webhooks firmados y conciliación, y las pasarelas y billeteras prioritarias de DEC-015 para O5 (las restantes van a O11).
LEER: 01-registro-decisiones.md DEC-015; anexos/M07-COB-cuenta-corriente-cobranza.md §5.9, §5.10; anexos/M05-FAC-facturacion.md §5.17 (RF-FAC-146); anexos/T06-INT-integraciones.md §5.1 (010), §5.5 (045), §5.7 (053..057), §5.9 (067..069, 075), §5.10 (081).
IMPLEMENTAR: RF-COB-119..153; RF-INT-010, 045, 053..057, 067..069, 075, 081; RF-FAC-146 (parte O5: QR de billeteras prioritarias); RNF-NFR-057, 088.
ENTREGABLES: directDebits (adhesión, presentación, rechazo, reintento); paymentIntents con expiración; adaptadores de pasarela en modo test con simuladores; inboundWebhooks con verificación de firma, deduplicación y outbox; conciliación diaria contra el reporte del proveedor; punto de extensión para pasarelas de O11.
NO CONSTRUIR TODAVÍA: pasarelas fuera de la lista O5 de DEC-015 (O11, PRO-O11-04).
PRUEBAS: webhook sin firma rechazado; webhook repetido no duplica; un pago aprobado sin webhook se recupera por conciliación.
TERMINADO CUANDO: un pago online de prueba se acredita e imputa de punta a punta en el simulador.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep gateways && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O5-07 — Cupón, devoluciones, conciliación, efectos contables, terceros y transición

```text
PRO-O5-07 — Cupón, devoluciones, conciliación y transición
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cupón de pago único, devoluciones y contracargos, conciliación de cobranzas y rendición a tesorería, efectos contables, terceros y operaciones complementarias, transición desde formatos de ProCoop, reportes, y efectos fiscales y de facturación relacionados.
LEER: anexos/M07-COB-cuenta-corriente-cobranza.md §5.11 (154, 156), §5.12..§5.17; anexos/M05-FAC-facturacion.md RF-FAC-076, 106, 130, 151, 152; anexos/M06-FIS-fiscal-impuestos.md RF-FIS-082, 084, 089, 110, 136, 138, 139, 151..153; anexos/T07-MIG-migracion-procoop.md RF-MIG-047, 054, 055, 057, 083..085.
IMPLEMENTAR: RF-COB-154, 156..175, 177, 179..189; RF-FAC-076, 106, 130, 151, 152; RF-FIS-082, 084, 089, 110, 136, 138, 139, 151..153; RF-MIG-047, 054, 055, 057, 083..085; RNF-NFR-016, 018, 197, 198; además (v1.1): RF-COB-194 (rendición a tesorería y contabilización por entidad jurídica); RF-COB-176 (conciliación del capital cobrado al cierre de caja; el anexo M07 lo pasó de O10 a O5, ver §21). Además (v1.2): RF-COB-195 (servicio interno de solo lectura `cob.service.getUnremittedCash` con el efectivo y los valores de las sesiones de caja sin rendir, para la posición de tesorería de M14, DEC-101).
DECISIONES v1.2 (10-11-2026): DEC-101 (RF-COB-195 no escribe nada: se calcula sobre `cashSessions` y `cashOperations` de M07, excluye las cajas `agencyVirtual` y `digitalChannel`, respeta el alcance por sucursal y M14 lo invoca sin leer ni copiar esas colecciones; se mantiene la frontera M07/M14). PRUEBAS adicionales: una sesión que pasa a `handedOver` al aceptarse su rendición deja de aparecer en el servicio.
ENTREGABLES: paymentCoupons; refunds y chargebacks con reversión de imputación; settlements de rendición a tesorería; eventos cob.* consumidos por M15; cobros por cuenta de terceros; migración de saldos y cuentas corrientes con conciliación contra ProCoop ficticio.
NO CONSTRUIR TODAVÍA: RF-COB-155 (O11), 176, 178 (O10).
PRUEBAS: un contracargo reabre la deuda y revierte el recibo; la rendición no incluye cobros ya rendidos; saldos migrados concilian al centavo.
TERMINADO CUANDO: la cobranza del día de TEN-001 se rinde a tesorería con conciliación.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep settlements && dotnet test --filter FullyQualifiedName~Api -- --grep mig
```

#### PRO-O5-08 — Tesorería básica: cuentas, movimientos y conciliación bancaria

```text
PRO-O5-08 — Tesorería básica
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cuentas financieras (bancos, cajas de tesorería), maestros, operaciones y movimientos, importación de extractos y conciliación bancaria automática y manual (DEC-059).
LEER: 01-registro-decisiones.md DEC-059; anexos/M14-TES-tesoreria-bancos.md §4, §5.1, §5.2, §5.3, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-TES-001..006, 009, 011, 013..018, 020..022, 025, 027, 028, 030..044, 047, 048, 050.
ENTREGABLES: financialAccounts por legalEntity; treasuryMovements; bankStatements importados (CSV y formatos bancarios declarativos); reconciliations con reglas de matching y diferencias.
NO CONSTRUIR TODAVÍA: valores, cheques, eCheq, Interbanking, tarjetas y flujo de fondos (O8).
PRUEBAS: un extracto importado dos veces no duplica; la conciliación automática no concilia dos veces el mismo movimiento.
TERMINADO CUANDO: el extracto ficticio de TEN-001 se concilia con la rendición de cobranza.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep tes
```

#### PRO-O5-09 — Rendiciones, cierre de cajas, cotizaciones e informes de tesorería

```text
PRO-O5-09 — Rendiciones, cierre y cotizaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: recepción de rendiciones de cajas de cobranza y depósitos, cierre de cajas de tesorería, monedas y cotizaciones, posición básica, informes y transversales de M14.
LEER: anexos/M14-TES-tesoreria-bancos.md §5.11 (123), §5.12, §5.13, §5.14 (140, 144), §5.15 (145), §5.18, §5.19.
IMPLEMENTAR: RF-TES-123, 126..130, 132..140, 144, 145, 166, 168..170, 175, 176, 178..186, 188; parte O5 de RF-TES-128 (ver §18).
DECISIONES v1.2 (10-11-2026): DEC-101 (la posición diaria de RF-TES-145 y RF-TES-168 muestra en una línea separada "en cajas sin rendir" el efectivo y los valores de las cajas de cobranza abiertas o cerradas sin rendición, con detalle por caja y antigüedad, leídos de `cob.service.getUnremittedCash` de M07, RF-COB-195 en PRO-O5-07; esa línea no se suma a lo rendido ni al disponible hasta que la rendición se acepta). PRUEBAS adicionales: una sesión cerrada sin rendir aparece en la línea separada y sale de ella al aceptarse su rendición.
ENTREGABLES: cashDeposits; treasuryClosings; exchangeRates; posición diaria; informes de M14; permisos y auditoría.
NO CONSTRUIR TODAVÍA: parte O8 de RF-TES-128; RF-TES-131, 141..143 (O8).
PRUEBAS: una rendición con diferencia requiere aprobación; cierre de caja bloquea movimientos con fecha anterior.
TERMINADO CUANDO: el cierre diario de tesorería de TEN-001 cuadra.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep treasury
```

#### PRO-O5-10 — Núcleo contable: configuración, plan de cuentas, ejercicios y centros de costo

```text
PRO-O5-10 — Núcleo contable
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: configuración contable por legalEntity, plan de cuentas de ejemplo no oficial (DEC-069) editable, ejercicios y períodos con apertura y cierre de período, y centros de costo (secciones).
LEER: 01-registro-decisiones.md DEC-009, DEC-069; anexos/M15-CON-contabilidad.md §4, §5.1, §5.2, §5.3, §5.6, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-CON-001..007, 009..013, 015, 017, 022, 023, 027..033, 081, 083, 084, 086, 087, 091; además (v1.1): RF-CON-162 (contabilidad por entidad jurídica: ejercicios, períodos, numeración, libros y estados por `legalEntityId`, DEC-064 y DEC-087) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión O5 de RF-CON-025 (reemplazado en v1.1: antes se implementaba aquí; el anexo lo mantiene en O10 y pasa a PRO-O10-02; aquí solo se crean las cuentas de capital mínimas que piden RF-CON-150 y 151).
DECISIONES v1.2 (10-11-2026): DEC-096 (cada centro de costo tiene entidad dueña obligatoria `costCenters.legalEntityId` y puede compartirse con otras entidades del tenant con `sharedWithLegalEntityIds`; RF-CON-081, RN-CON-127).
ENTREGABLES: chartsOfAccounts con jerarquía y validaciones; fiscalYears y periods; costCenters; importación del plan; plan de ejemplo marcado "no oficial".
NO CONSTRUIR TODAVÍA: múltiples planes y equivalencias (O8).
PRUEBAS: no se imputa a cuenta no imputable; un período cerrado rechaza asientos; el plan de TEN-001 no se ve en TEN-002.
TERMINADO CUANDO: TEN-001 tiene plan de ejemplo y ejercicio 2026 abierto.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep con
```

#### PRO-O5-11 — Asientos manuales y automáticos, conciliaciones e informes base

```text
PRO-O5-11 — Asientos y motor automático
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: asientos manuales, personalizados e importados; motor de asientos automáticos por reglas que consume eventos de M05, M07, M13 y M14; cuentas corrientes por servicio y conciliación auxiliar–mayor; mayor, sumas y saldos e informes base; sistema contable externo; transversales.
LEER: anexos/M15-CON-contabilidad.md §5.4, §5.5, §5.7 (092..094, 100..102), §5.9 (112, 114, 115, 121, 124..126), §5.13, §5.16 (153..157, 159, 160); anexos/M06-FIS-fiscal-impuestos.md RF-FIS-157; anexos/T10-BIA-reportes-bi-apis.md RF-BIA-015, 092, 093, 095.
IMPLEMENTAR: RF-CON-035..040, 042..045, 048, 050..067, 092..094, 100..102, 112, 114, 115, 121, 124..126, 139..141, 153..157, 159; RF-FIS-157; RF-BIA-015, 092, 093, 095; además (corrección 05-11-2026): RF-CON-160 (parte O5: saldos de apertura contables como asiento de apertura importado; la celda del anexo es `O11 (O5 para saldos de apertura)` y por la regla §0.1 el RF empieza en O5; la migración repetible completa es extensión en PRO-O11-06, ver §18) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-STK-094 (costo para asiento de stock); extensión O5 de RF-CON-075 (reemplazado en v1.1: antes se implementaba aquí; el anexo lo mantiene en O10 y pasa a PRO-O10-02; aquí solo la regla de asiento de capital que piden RF-CON-150, 151 y 098). Parte O5 de RF-BIA-104 (v1.2, DEC-096: filtro por entidad jurídica en los REP-CON que agrupan por centro de costo, con los centros propios o compartidos de la entidad filtrada según `costCenters.legalEntityId` y `sharedWithLegalEntityIds`, acumulando solo lo imputado en esa entidad).
ENTREGABLES: journalEntries balanceados en DECIMAL(19,4); postingRules versionadas por evento y tipo; consumidores idempotentes por evento; reproceso de asientos fallidos; mayor y balance de sumas y saldos; exportación a sistema contable externo; conciliación auxiliar comercial contra cuenta de deudores.
NO CONSTRUIR TODAVÍA: ajuste por inflación, cierre de ejercicio, libros rubricados (O8).
PRUEBAS: todo asiento balancea; un evento repetido no genera dos asientos; la conciliación auxiliar–mayor cuadra tras el e2e de cobranza.
TERMINADO CUANDO: facturación, cobranza y rendición de TEN-001 tienen sus asientos automáticos.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep postings && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O5-12 — Capital social mínimo (DEC-019)

```text
PRO-O5-12 — Capital social mínimo
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cuentas de capital por asociado, suscripción e integración por cuotas facturables, y su contabilización (DEC-019, DEC-061, HUECO-CAP-01).
LEER: 01-registro-decisiones.md DEC-019, DEC-061; 05-registro-huecos.md HUECO-CAP-01..04; anexos/M17-INS-institucional.md §5.3 (029..031, 034..038, 040, 042..046, 056); anexos/M15-CON-contabilidad.md §5.15 (RF-CON-150, 151).
IMPLEMENTAR: RF-INS-029..031, 034..038, 040, 042..046, 056; RF-CON-150, 151 [REASIGNADO a O5, ver §18]; además (v1.1): RF-CON-098 (conciliación del capital de M17 contra las cuentas de capital; el anexo M15 lo pasó de O10 a O5, ver §21).
DECISIONES v1.2 (10-11-2026): DEC-096 (el capital se registra en la entidad jurídica de la membresía; si la persona no es asociada de esa entidad queda como capital a regularizar de esa entidad, nunca en la membresía de otra; RF-INS-036, RN-INS-053).
ENTREGABLES: capitalAccounts y capitalMovements; suscripción con integración en cuotas como billableItem; asientos de capital por regla; consulta en portal.
NO CONSTRUIR TODAVÍA: revalúo, excedentes, retornos y reintegros (O10); RF-INS-041 (O6).
PRUEBAS: la integración nunca supera lo suscripto; los asientos de capital balancean.
TERMINADO CUANDO: Ana Demo suscribe capital y la primera cuota se factura e integra.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep capital
```

#### PRO-O5-13 — Pagos en el portal y facturación del SaaS (DEC-065)

```text
PRO-O5-13 — Pagos en el portal y facturación del SaaS
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: pago desde landing y portal (factura, saldo, cupón), medios guardados, comprobantes y accesos de pago, y facturación del SaaS a los tenants usando M05 en el tenant PLATFORM (DEC-065).
LEER: anexos/M19-POR-portal-socio-landing.md §5.1 (012), §5.3 (043..045), §5.7 (082, 083), §5.8, §5.12 (128); anexos/T01-PLA-plataforma-saas.md RF-PLA-040, 082; 01-registro-decisiones.md DEC-065.
IMPLEMENTAR: RF-POR-012, 043..045, 082, 083, 089..098, 100, 101, 128; RF-PLA-040, 082.
ENTREGABLES: flujo de pago PWA con estados y recuperación tras cierre de app; pago sin login por cupón desde la landing; facturación del SaaS desde la prefactura de O1 con legalEntity de la plataforma.
NO CONSTRUIR TODAVÍA: RF-POR-099 (O6), 102 (O8).
PRUEBAS: cerrar la app a mitad del pago no duplica; el socio solo paga cuentas vinculadas; la factura SaaS se emite solo en PLATFORM.
TERMINADO CUANDO: Ana Demo paga desde la PWA y TEN-001 recibe su factura SaaS ficticia.
VERIFICAR: playwright test --grep @O5-portal
```

#### PRO-O5-14 — Integración de O5: pago online imputado, rendido y asentado

```text
PRO-O5-14 — Integración de O5
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O5 (sección 9.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §9; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1.6; §17 y §18 de M07, M14, M15 y M17.
IMPLEMENTAR: ningún RF nuevo. Verificar los 470 RF de O5 (antes 469; versión 1.0: 463; *reemplazado, corrección 05-11-2026:* antes 468, se agrega RF-CON-160).
ENTREGABLES: seed demo O5; e2e @O5 de 9.2; conciliación auxiliar–mayor automatizada; test:isolation; k6 de webhooks (500 por minuto).
NO CONSTRUIR TODAVÍA: nada de O6.
PRUEBAS: e2e @O5, test:isolation, k6 de webhooks.
TERMINADO CUANDO: criterio 9.2 demostrado con evidencias en docs/evidencias/O5/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O5 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 10. O6 — Mora, corte, reconexión, convenios: cierre del piloto Internet

### 10.1 Objetivo

Completar M08 (proceso masivo de intereses, bloqueos, política de mora por servicio y categoría, instancias y candidatos, notificaciones con constancia, tratamiento de morosos, excepciones y protecciones, corte y reconexión, baja y suspensión, planes de pago y convenios, planes de cuotas, garantías, incobrables, prescripción, informes y portal), la suspensión técnica por aprovisionamiento, la IA supervisada y los canales omnicanal del CRM (DEC-055, DEC-056), y cerrar el piloto Internet de punta a punta (DEC-005).

### 10.2 Criterio de salida (demostrable)

Los siete escenarios ESC-SRV-INT-01..07 de T12 parte1 §1.7 (antes §1.6) pasan en un solo recorrido e2e sobre TEN-001: alta, factura con CAE, pago online, pago presencial, mora con aviso y constancia, suspensión automática por aprovisionamiento, convenio de pago desde la PWA con primera cuota, reconexión automática al pagar, reclamo atendido con IA supervisada y baja con devolución de comodato.

### 10.3 Dependencias

O5 completa.

### 10.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M08 MOR | 176 | RF-MOR-006, 016, 024, 025, 028, 035, 040, 045, 048..052, 054..128, 130..181, 183..189, 191..201, 203..218, 220 (v1.1: se agregan RF-MOR-223) | PAN-MOR-01..42 (*reemplazado, corrección 05-11-2026:* antes PAN-MOR-01..46; 42 definidos en el anexo), API-MOR-01..98 (*reemplazado, corrección 05-11-2026:* antes API-MOR-01..127; 98 definidos en el anexo), EVT-MOR-01..21 (*reemplazado, corrección 05-11-2026:* antes EVT-MOR-01..20; 21 definidos en el anexo), JOB-MOR-01..18 | `interestRuns`, `invoiceBlocks`, `delinquencyPolicies`, `delinquencyInstances`, `delinquencyCandidates`, `delinquencyNotices`, `noticeEvidences`, `protections`, `cutOrders`, `paymentPlans`, `paymentPlanInstallments`, `guarantees`, `badDebts`, `externalCollections` |
| M09 CRM | 32 | RF-CRM-027, 028, 042, 050, 069, 117, 171, 172, 174..178, 182, 188, 200..202, 204..213, 250..253 | PAN-CRM de IA y omnicanal | `conversations`, `aiSuggestions`, `botFlows` |
| M10 TEC | 7 | RF-TEC-132..137, 187 | Cortes y reconexiones ejecutados | — |
| M19 POR | 10 | RF-POR-031, 049, 050, 066, 088, 099, 157, 169, 170, 173 | — | — |
| T09 COM | 5 | RF-COM-148, 152, 164, 182, 196 | — | — |
| M02 CAT | 4 | RF-CAT-066, 083, 089, 090 | Estados de suspensión del contrato | — |
| M01 PER | 2 | RF-PER-051, 067 | — | — |
| M05 FAC | 1 | RF-FAC-095 | — | — |
| M11 VEN | 1 | RF-VEN-009 | — | — |
| M13 STK | 1 | RF-STK-078 | — | — |
| M15 CON | 1 | RF-CON-074 | — | — |
| M17 INS | 1 | RF-INS-041 | — | — |
| T03 UXD | 1 | RF-UXD-163 [REASIGNADO de "O9+" a O6 por DEC-056] | — | — |
| M06 FIS | 2 | RF-FIS-164, 166 (v1.1, fila nueva) | — | — |
| **Total** | **244** | | | |

Extensiones: RF-CAT-046, 065, 088.

### 10.5 Fuera de la ola

Servicios medidos (O7); mesa de entradas, turnero y actividades (O10); gestión judicial con integraciones externas reales (se simulan).

### 10.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Corte indebido | Protecciones (pago en tránsito, reclamo abierto, electrodependientes, feriados), aprobación y ventana horaria (M08 §5.11, §5.12) |
| Reconexión tardía | Evento de pago dispara reconexión automática por aprovisionamiento con SLA y alerta |
| IA que actúa sola | La IA solo sugiere; el operador confirma (ARQ-08, DEC-055) |
| Constancias de notificación inválidas | Evidencias con hash, fecha y canal (M08 §5.9) |

### 10.7 Datos demo

M08 §18, M09 §18 (flujos de bot ficticios), T12 parte1 §1.5.

### 10.8 Pruebas end-to-end de la ola

ESC-SRV-INT-01..07 completos (T12 parte1 §1.7; antes §1.6); CU de M08 §17 (corrida de mora, convenio, reconexión, incobrable); CU de M09 §17 (IA supervisada, bot).

### 10.9 Huecos que se resuelven en la ola

HUE-TEL-04 y HUE-ELE-05 en su parte de corte y protección (R9).

### 10.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O6-01 | Intereses masivos, bloqueos y recargos restantes | 25 |
| PRO-O6-02 | Política de mora, instancias y candidatos | 20 |
| PRO-O6-03 | Notificaciones con constancia, tratamiento de morosos y protecciones | 38 |
| PRO-O6-04 | Corte y reconexión con aprovisionamiento | 27 |
| PRO-O6-05 | Baja, suspensión y reactivación | 12 |
| PRO-O6-06 | Planes de pago y convenios | 31 |
| PRO-O6-07 | Planes de cuotas, garantías, incobrables y prescripción | 26 |
| PRO-O6-08 | Informes, portal de mora, auditoría y migración desde CoopOnline | 31 |
| PRO-O6-09 | IA supervisada y canales omnicanal (DEC-055, DEC-056) | 23 |
| PRO-O6-10 | CRM: cierre de piloto, circulares y plantillas | 11 |
| PRO-O6-11 | Integración de O6: piloto Internet de punta a punta | 0 (verifica 244) |

#### PRO-O6-01 — Intereses masivos, bloqueos y recargos restantes

```text
PRO-O6-01 — Intereses masivos y bloqueos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: proceso masivo de intereses a facturar, bloqueos de comprobantes por mora y los recargos y diferimientos restantes del motor de interés.
LEER: anexos/M08-MOR-mora-financiacion.md §5.1 (006), §5.2 (016), §5.3 (024, 025, 028, 035, 040), §5.4 (045, 048), §5.5, §5.6, §12; anexos/M05-FAC-facturacion.md RF-FAC-095.
IMPLEMENTAR: RF-MOR-006, 016, 024, 025, 028, 035, 040, 045, 048..052, 054..064; RF-FAC-095; RNF-NFR-208.
ENTREGABLES: interestRuns como job con simulación, aprobación y generación de billableItems; invoiceBlocks con motivo y vigencia.
NO CONSTRUIR TODAVÍA: RF-MOR-053 (O8).
PRUEBAS: una corrida repetida no factura intereses dos veces; un comprobante en convenio no genera interés.
TERMINADO CUANDO: la corrida de intereses de TEN-001 genera ítems para el próximo lote.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep interestRuns
```

#### PRO-O6-02 — Política de mora, instancias y candidatos

```text
PRO-O6-02 — Política de mora e instancias
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: política de mora configurable por servicio y categoría (BASE §68) con instancias (aviso, intimación, suspensión, corte, baja) y selección de candidatos por job.
LEER: anexos/M08-MOR-mora-financiacion.md §5.7, §5.8, §8, §9.
IMPLEMENTAR: RF-MOR-065..082; además (v1.1): RF-FIS-164 (el saldo de conceptos de terceros se identifica por `thirdPartyAgreementId` y se excluye de la mora propia, DEC-083); RF-MOR-223 (parte O6: exclusión de conceptos de terceros del saldo elegible e intereses salvo convenio; la parte de corte es O7, PRO-O7-09).
DECISIONES v1.2 (10-11-2026): DEC-107 (solo las obligaciones habilitadas por la compuerta fiscal entran en el saldo elegible, generan interés o recargo y cuentan para candidatos, instancias y corte; RF-MOR-068).
ENTREGABLES: delinquencyPolicies versionadas; delinquencyInstances; job de candidatos con umbrales de importe, antigüedad y cantidad de facturas; revisión y exclusión manual con motivo.
NO CONSTRUIR TODAVÍA: ejecución técnica (PRO-O6-04).
PRUEBAS: un candidato bajo el umbral no entra; la política vigente a la fecha de corrida es la que aplica.
TERMINADO CUANDO: Ana Demo, con factura vencida, aparece como candidata a aviso.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep delinquency
```

#### PRO-O6-03 — Notificaciones con constancia, tratamiento de morosos y protecciones

```text
PRO-O6-03 — Notificaciones, tratamiento y protecciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: avisos e intimaciones por canal con constancia de entrega, tratamiento de morosos y excepciones y protecciones que impiden avanzar.
LEER: anexos/M08-MOR-mora-financiacion.md §5.9, §5.10, §5.11; anexos/T09-COM-comunidad-comunicaciones.md RF-COM-148, 152, 182, 196.
IMPLEMENTAR: RF-MOR-083..116; RF-COM-148, 152, 182, 196.
DECISIONES v1.2 (10-11-2026): DEC-104 (el aviso telefónico de mora usa el formato `ivr_export` de T09 y la conexión opcional con un discador o IVR externo, FI-INT-66 de T06; no hay canal de voz propio ni IVR propio de ProCoop; RF-MOR-089 y RF-COM-148).
ENTREGABLES: delinquencyNotices con PDF y envío por COM; noticeEvidences con hash; protections (pago en tránsito, reclamo abierto, electrodependiente, feriado, decisión judicial) con vigencia.
NO CONSTRUIR TODAVÍA: corte.
PRUEBAS: con pago en tránsito no avanza la instancia; la constancia queda vinculada al aviso.
TERMINADO CUANDO: el aviso de mora de Ana Demo se envía con constancia.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep notices
```

#### PRO-O6-04 — Corte y reconexión con aprovisionamiento

```text
PRO-O6-04 — Corte y reconexión
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: órdenes de corte con aprobación y ventana, ejecución por OT o por aprovisionamiento remoto (DEC-014), reconexión automática al pagar, cargos de reconexión, y estados de contrato y comodato.
LEER: 01-registro-decisiones.md DEC-014; anexos/M08-MOR-mora-financiacion.md §5.12 (117..128, 130); anexos/M10-TEC-tecnica-campo-redes.md §5.9, §5.15 (187); anexos/M02-CAT-catalogo-servicios.md RF-CAT-066, 083, 089, 090; anexos/M11-VEN-ventas-presupuestos.md RF-VEN-009; anexos/M13-STK-stock-activos-fabricacion.md RF-STK-078.
IMPLEMENTAR: RF-MOR-117..128, 130; RF-TEC-132..137, 187; RF-VEN-009; RF-STK-078; RF-CAT-066, 083, 089, 090; además (v1.1): RF-FIS-166 (marca `allowServiceCut` del convenio de terceros, default false, con norma habilitante) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-CAT-046, 065, 088.
ENTREGABLES: cutOrders; suspensión remota por provisioningRequests; reconexión disparada por cob.payment.allocated con SLA; cargo de reconexión; cargo por equipo no devuelto.
NO CONSTRUIR TODAVÍA: RF-MOR-129 (O7, corte de medidos).
PRUEBAS: con una protección activa no se suspende; el pago total reconecta una sola vez; el evento repetido no genera dos OT.
TERMINADO CUANDO: el servicio de Ana Demo se suspende y se reconecta al pagar.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cut && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O6-05 — Baja, suspensión y reactivación

```text
PRO-O6-05 — Baja, suspensión y reactivación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: baja por mora o voluntaria, suspensión administrativa y reactivación (BASE §53), con efectos en personas y cuentas.
LEER: anexos/M08-MOR-mora-financiacion.md §5.13; anexos/M01-PER-personas-titulares-cuentas.md RF-PER-051, 067.
IMPLEMENTAR: RF-MOR-131..140; RF-PER-051, 067.
ENTREGABLES: flujo de baja con retiro de equipo (OT) y saldo final; reactivación con condiciones; estados de titular y cuenta.
NO CONSTRUIR TODAVÍA: egreso de asociado (O10).
PRUEBAS: la baja con saldo genera deuda final; la reactivación exige pago o convenio según política.
TERMINADO CUANDO: la baja de un contrato ficticio genera la OT de retiro.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep baja
```

#### PRO-O6-06 — Planes de pago y convenios

```text
PRO-O6-06 — Planes de pago y convenios
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: planes de pago y convenios (AGR-014) con simulación, condiciones por política, firma, cuotas facturables, caducidad y efectos en mora y capital.
LEER: anexos/M08-MOR-mora-financiacion.md §5.14; anexos/M17-INS-institucional.md RF-INS-041.
IMPLEMENTAR: RF-MOR-141..170; RF-INS-041.
ENTREGABLES: paymentPlans y paymentPlanInstallments; simulador en admin y PWA; aceptación con firma simple; caducidad por job; reimputación de la deuda original.
NO CONSTRUIR TODAVÍA: entidades financieras externas (PRO-O6-07).
PRUEBAS: las cuotas suman la deuda más interés exacto; la caducidad restituye la deuda y la mora.
TERMINADO CUANDO: Ana Demo firma un convenio desde la PWA y paga la primera cuota.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep paymentPlans && playwright test --grep @O6-plans
```

#### PRO-O6-07 — Planes de cuotas, garantías, incobrables y prescripción

```text
PRO-O6-07 — Cuotas, garantías, incobrables y prescripción
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: planes de cuotas con entidades financieras, garantías y garantes (MER-005), incobrables y gestión externa o judicial (MER-006, DEC-052), y prescripción.
LEER: 01-registro-decisiones.md DEC-052; anexos/M08-MOR-mora-financiacion.md §5.15, §5.16 (177..181), §5.17 (183..189, 191, 192), §5.18; anexos/M15-CON-contabilidad.md RF-CON-074.
IMPLEMENTAR: RF-MOR-171..181, 183..189, 191..197; RF-CON-074.
ENTREGABLES: guarantees; badDebts con previsión y castigo contable; externalCollections con exportación a estudio ficticio; prescripción por job con aprobación.
NO CONSTRUIR TODAVÍA: RF-MOR-182, 190 (O8).
PRUEBAS: el castigo genera el asiento correcto; una deuda prescripta no se reclama.
TERMINADO CUANDO: una deuda ficticia pasa a gestión externa y luego a incobrable con asiento.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep badDebts
```

#### PRO-O6-08 — Informes, portal de mora, auditoría y migración desde CoopOnline

```text
PRO-O6-08 — Informes, portal de mora y migración
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: informes y tableros de mora, deuda y convenios en el portal y la app, auditoría y operación de M08, y migración de usuarios del portal CoopOnline.
LEER: anexos/M08-MOR-mora-financiacion.md §5.19, §5.20, §5.21; anexos/M19-POR-portal-socio-landing.md RF-POR-031, 049, 050, 066, 088, 099, 157, §5.17 (169, 170, 173).
IMPLEMENTAR: RF-MOR-198..201, 203..218, 220; RF-POR-031, 049, 050, 066, 088, 099, 157, 169, 170, 173.
ENTREGABLES: tableros de mora; alertas de deuda en el portal; convenio autoservicio; migración de usuarios CoopOnline ficticios con invitación a re-registrarse.
NO CONSTRUIR TODAVÍA: RF-MOR-202 (O7), 219 (O11); RF-POR-171, 172 (O11).
PRUEBAS: el socio ve solo su deuda; la migración de usuarios nunca importa contraseñas.
TERMINADO CUANDO: el tablero de mora de TEN-001 muestra la corrida del e2e.
VERIFICAR: playwright test --grep @O6-portal
```

#### PRO-O6-09 — IA supervisada y canales omnicanal (DEC-055, DEC-056)

```text
PRO-O6-09 — IA supervisada y omnicanal
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: IA supervisada en atención (clasificación, resumen, respuesta sugerida, extracción de datos) y canales omnicanal con bot de autogestión, siempre con confirmación humana para acciones.
LEER: 01-registro-decisiones.md DEC-055, DEC-056; anexos/M09-CRM-atencion.md §5.6 (171, 172, 174..178, 182, 188), §5.7 (200..202, 204..213), §5.10 (RNF-CRM-002); anexos/T03-UXD-experiencia-marca-diccionario.md RF-UXD-163.
IMPLEMENTAR: RF-CRM-171, 172, 174..178, 182, 188, 200..202, 204..213; RF-UXD-163 [REASIGNADO, ver §18]; RNF-CRM-002.
ENTREGABLES: conversations unificadas por canal; aiSuggestions con registro de aceptación y rechazo; botFlows configurables (saldo, segunda vía, reclamo, convenio) que consultan servicios del dueño; derivación a humano; auditoría de IA.
NO CONSTRUIR TODAVÍA: RF-CRM-203 (O10).
PRUEBAS: la IA nunca ejecuta una acción sin confirmación; un bot no revela datos sin verificación de identidad; un prompt de inyección de ejemplo no altera el flujo.
TERMINADO CUANDO: un reclamo por WhatsApp simulado se clasifica con IA y lo confirma un operador.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep ai && playwright test --grep @O6-ai
```

#### PRO-O6-10 — CRM: cierre de piloto, circulares y plantillas

```text
PRO-O6-10 — CRM: cierre del piloto
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar tickets, solicitudes y reclamos ligados a mora y baja, circulares, plantillas y encuestas del CRM, y avisos de interrupción restantes.
LEER: anexos/M09-CRM-atencion.md RF-CRM-027, 028, 042, 050, 069, 117, §5.9 (250..253); anexos/T09-COM-comunidad-comunicaciones.md RF-COM-164.
IMPLEMENTAR: RF-CRM-027, 028, 042, 050, 069, 117, 250..253; RF-COM-164.
ENTREGABLES: tickets de mora y baja; circulares con audiencias; plantillas de respuesta; encuestas de satisfacción.
NO CONSTRUIR TODAVÍA: mesa de entradas y turnero (O10).
PRUEBAS: una circular respeta consentimientos; la encuesta se envía una vez por ticket.
TERMINADO CUANDO: el ticket de baja de Ana Demo cierra con encuesta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep crm
```

#### PRO-O6-11 — Integración de O6: piloto Internet de punta a punta

```text
PRO-O6-11 — Integración de O6 y cierre del piloto
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar ESC-SRV-INT-01..07 en un solo recorrido (sección 10.2 del plan) y cerrar el piloto (DEC-005).
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §10; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §1 completo; §17 de M08 y M09.
IMPLEMENTAR: ningún RF nuevo. Verificar los 244 RF de O6 (versión 1.0: 241) y la regresión de O0–O5.
ENTREGABLES: e2e @piloto-internet; regresión completa; prueba de carga de corrida de mora con 20.000 cuentas; informe de piloto en docs/evidencias/O6/.
NO CONSTRUIR TODAVÍA: nada de O7.
PRUEBAS: e2e @O0..@O6, test:isolation, k6.
TERMINADO CUANDO: criterio 10.2 demostrado y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep "@piloto-internet|@O6" && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 11. O7 — Servicios medidos

### 11.1 Objetivo

Construir medición y consumos (M03): catálogos y medidores, puntos de medición, rutas y lotes, captura de lecturas (app de lecturista offline), cálculo y validación, estimaciones, prorrateos, demanda, inyección y generación distribuida, telemedición AMI/MDM, prepago y portal de consumos; tarifas medidas y facturación in situ; CESP, LQSP, RG 5746/2025 e informes a reguladores (M06); red GIS, mantenimiento, obras, loteos e inspecciones (M10); y los recargos y cobros propios de medidos. Además, la migración de los datos vigentes comerciales, la corrida paralela con facturación comparada, el congelamiento, el by-pass y el corte comercial por servicio con rollback (T07 §5.8 y §5.9), porque electricidad, gas y prepago de la cooperativa piloto se cortan al cerrar esta ola (DEC-089; antes estaban en O11).

### 11.2 Criterio de salida (demostrable)

Una ruta de lectura de energía ficticia se descarga en la app de lecturista, se toman lecturas sin conexión con foto y validación de rango, se sincroniza, se calculan y aprueban los consumos (con estimación para un medidor inaccesible), el lote de facturación de energía usa el cuadro tarifario medido con escalones y el informe al regulador se genera. Una factura in situ se emite desde la app. Sobre la base ficticia de ejemplo, los ciclos consecutivos de paralelo de energía y gas que define T07 §17.4 (PRM-MIG-041, default 2) quedan aprobados con todas las diferencias explicadas, y el ensayo de corte comercial termina dentro de la ventana con conciliación de saldos y rollback probado (DEC-089).

### 11.3 Dependencias

O6 completa (piloto cerrado). Reutiliza la app de campo de O3 y la facturación de O4.

### 11.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M03 MED | 128 | RF-MED-001..127 (v1.1: se agregan RF-MED-128) | PAN-MED-01..35, API-MED-01..78 (*reemplazado, corrección 05-11-2026:* antes API-MED-01..77; 78 definidos en el anexo), EVT-MED-01..29, JOB-MED-01..22 | `meterModels`, `meters`, `measurementPoints`, `channels`, `installations`, `readingRoutes`, `readingSchedules`, `readingBatches`, `readings`, `consumptions`, `estimations`, `distributions`, `demandRecords`, `injections`, `amiReads`, `prepaidAccounts`, `prepaidTokens` |
| M10 TEC | 53 | RF-TEC-035, 040, 041, 061, 066, 072, 106, 120, 138..154, 156..163, 168..181, 196 (v1.1: se agregan RF-TEC-232, 233, 235, 236, 238) | PAN-TEC de red, mantenimiento, obras e inspecciones | `networkAssets`, `gisLayers`, `maintenancePlans`, `works`, `lots`, `improvementContributions`, `inspections` |
| M04 TAR | 31 (DEC-089; antes 29) | RF-TAR-017, 023, 025, 026, 028, 031, 037, 038, 040, 041, 044..046, 048, 049, 070, 074, 077..081, 087, 109, 111, 114 (v1.1: se agregan RF-TAR-116, 119, 121; DEC-089: se agregan RF-TAR-101, 102, antes en O11) | Tarifas medidas | — |
| M06 FIS | 15 (DEC-089; antes 14) | RF-FIS-012, 071..074, 128, 143..150 (DEC-089: se agrega RF-FIS-163, antes en O11) | CESP, LQSP y reguladores | `regulatorReports` |
| M02 CAT | 11 | RF-CAT-021, 056, 058, 060, 075, 093, 095..097 (v1.1: se agregan RF-CAT-114, 115) | — | — |
| M05 FAC | 10 | RF-FAC-108..111, 123, 170, 171 (v1.1: se agregan RF-FAC-174, 175, 178) | — | — |
| M19 POR | 10 (DEC-089; antes 8) | RF-POR-069, 103..108 (v1.1: se agregan RF-POR-176; DEC-089: se agregan RF-POR-020, 127, antes en O11) | Consumos, autolectura y prepago | — |
| M08 MOR | 8 (DEC-089; antes 7) | RF-MOR-015, 038, 039, 129, 202 (v1.1: se agregan RF-MOR-221, 222; DEC-089: se agrega RF-MOR-219, antes en O11) | — | — |
| M09 CRM | 5 | RF-CRM-080, 081, 085, 114 (v1.1: se agregan RF-CRM-259) | — | — |
| M07 COB | 4 (DEC-089; antes 3) | RF-COB-075, 095, 096 (DEC-089: se agrega RF-COB-155, antes en O11) | Cobro en campo; cupones equivalentes de talones ProCoop vigentes | — |
| M01 PER | 2 | RF-PER-095, 097 | — | — |
| M11 VEN | 1 | RF-VEN-013 | — | — |
| T04 CFG | 3 (DEC-089; antes 1) | RF-CFG-103 (DEC-089: se agregan RF-CFG-132, 142, antes en O11) | Migración de configuración y de `legalEntities` | — |
| T10 BIA | 1 | RF-BIA-098 | — | — |
| T11 WFL | 1 | RF-WFL-098 | — | — |
| T07 MIG | 15 (DEC-089; antes 0) | RF-MIG-006, 070..076, 080..082, 086..089 (antes en O11) | PAN-MIG de paralelo y corte | `parallelRuns`, `parallelDiffs`, `cutoverPlans`, `cutoverSteps`, `rollbackPlans` |
| **Total** | **298** (DEC-089; antes 274) | | | |

Extensiones: RF-BIA-090; RF-CAT-017, 054, 055, 082, 083, 086; RF-TAR-019, 021, 022, 036, 039, 042, 068, 094, 100; RF-MOR-130; RF-TEC-155.

### 11.5 Fuera de la ola

Telefonía y TV avanzadas (O10); ERP administrativo (O8); migración histórica de lecturas en volumen (O11).

### 11.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Volumen de lecturas y telemedición | Ingesta por job con particiones por período y servicio; índices compuestos de T05 |
| Lecturas erróneas | Validación de rango, consumo histórico, foto obligatoria configurable y bandeja de observadas |
| Normativa por servicio y provincia | Reglas en tablas normativas versionadas (M06 §5.1) y perfiles por servicio de T12 |
| Obras con contribución por mejoras | Modelo de obra con prorrateo y aprobación (M10 §5.13) |

### 11.7 Datos demo

M03 §18 (ruta y medidores ficticios), M04 §18 (cuadro de energía ficticio), M10 §18, T12 parte1 §4 a §7 (fichas de energía, agua, cloacas y gas; antes citaba parte2).

### 11.8 Pruebas end-to-end de la ola

ESC de energía y agua de T12 parte1 §4.7 y §5.7 (antes citaba parte2); CU de M03 §17 (ruta, lectura offline, estimación, prepago); CU de M04 §17 (escalones); CU de M06 §17 (informe regulador); CU de M10 §17 (obra e inspección).

### 11.9 Huecos que se resuelven en la ola

HUE-ELE, HUE-AG, HUE-CLO, HUE-GAS, HUE-ALU y HUECO-OBR abiertos con anexo responsable M03, M04, M06 o M10 (R9). HUECO-OBR-04 (migración de obras) queda en O11.

### 11.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O7-01 | Medidores, puntos de medición e instalaciones | 37 |
| PRO-O7-02 | Rutas, lotes, captura de lecturas y app de lecturista | 37 |
| PRO-O7-03 | Cálculo y validación de consumos, estimaciones, prorrateos y demanda | 33 |
| PRO-O7-04 | Inyección, medición propia, telemedición AMI/MDM y prepago | 26 |
| PRO-O7-05 | Portal de consumos, autolectura y facturación in situ | 17 |
| PRO-O7-06 | Tarifas medidas | 30 |
| PRO-O7-07 | Facturación medida, CESP/LQSP e informes a reguladores | 25 |
| PRO-O7-08 | Red GIS, mantenimiento, obras, inspecciones y costeo de OT | 52 |
| PRO-O7-09 | Mora, cobranza en campo, CRM y ventas de medidos | 17 |
| PRO-O7-11 | Migración comercial vigente y corrida paralela (DEC-089; reemplaza a PRO-O11-07) | 15 |
| PRO-O7-12 | Congelamiento, by-pass, corte comercial por servicio y rollback (DEC-068, DEC-089; reemplaza a PRO-O11-08) | 9 |
| PRO-O7-10 | Integración de O7: facturación de energía con lecturas, paralelo y ensayo de corte comercial | 0 (verifica 298; DEC-089: antes 274; se ejecuta después de PRO-O7-11 y PRO-O7-12) |

#### PRO-O7-01 — Medidores, puntos de medición e instalaciones

```text
PRO-O7-01 — Medidores y puntos de medición
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: catálogos de modelos, medidores con serie y estado, puntos de medición, canales, instalaciones y su vínculo con punto de prestación y contrato, y perfil medido del servicio.
LEER: anexos/M03-MED-medicion-consumos.md §4, §5.1, §5.2, §7, §8, §10, §11, §17, §18; anexos/M01-PER-personas-titulares-cuentas.md RF-PER-095, 097; anexos/M02-CAT-catalogo-servicios.md RF-CAT-021, 056, 058, 060, 075, 093, 095..097.
IMPLEMENTAR: RF-MED-001..024; RF-PER-095, 097; RF-CAT-021, 056, 058, 060, 075, 093, 095..097; además (v1.1): RF-CAT-114 (cambio de régimen de medición del contrato con `changeMeteringRegime`, EVT-CAT-28); RF-MED-128 (M03 crea o cierra el punto de medición al consumir EVT-CAT-28) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-CAT-017, 054, 055, 082, 083, 086.
ENTREGABLES: meterModels, meters (con serie de M13), measurementPoints, channels e installations con historia de cambios de medidor y lecturas de cambio.
NO CONSTRUIR TODAVÍA: rutas (PRO-O7-02).
PRUEBAS: un medidor no se instala en dos puntos; el cambio de medidor registra lecturas de retiro e instalación.
TERMINADO CUANDO: los medidores ficticios de M03 §18 están instalados en TEN-001.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep med
```

#### PRO-O7-02 — Rutas, lotes, captura de lecturas y app de lecturista

```text
PRO-O7-02 — Rutas, lotes y app de lecturista
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: rutas y cronogramas, lotes de lectura, captura por app de lecturista offline (perfil de la app de campo de O3), por archivo de colectora y por portal.
LEER: anexos/M03-MED-medicion-consumos.md §5.3, §5.4; anexos/M10-TEC-tecnica-campo-redes.md §5.8 (RF-TEC-120).
IMPLEMENTAR: RF-MED-025..060; RF-TEC-120.
ENTREGABLES: readingRoutes y readingSchedules; readingBatches con estados; perfil lecturista en apps/web-pwa con secuencia de ruta, validación de rango en el dispositivo, foto y novedades; importación de colectoras.
NO CONSTRUIR TODAVÍA: telemedición (PRO-O7-04).
PRUEBAS: lecturas sin conexión se sincronizan sin duplicar; una lectura fuera de rango pide confirmación y foto.
TERMINADO CUANDO: la ruta ficticia se lee completa sin conexión.
VERIFICAR: playwright test --grep @O7-reading && dotnet test --filter FullyQualifiedName~Api -- --grep readings
```

#### PRO-O7-03 — Cálculo y validación de consumos, estimaciones, prorrateos y demanda

```text
PRO-O7-03 — Consumos, estimaciones y demanda
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cálculo de consumo con vueltas de medidor y factor, validación y aprobación, estimaciones y regularización, división, prorrateo, distribución y testigos, demanda y transgresiones.
LEER: anexos/M03-MED-medicion-consumos.md §5.5, §5.6, §5.7, §5.8, §6.
IMPLEMENTAR: RF-MED-061..093.
DECISIONES v1.1: DEC-085 (M03 entrega el volumen de gas medido y valida la lectura sin corregirlo; la corrección de volumen la aplica M04 en PRO-O7-06; CTR-MED-06 queda reemplazada por RN-TAR-035).
ENTREGABLES: consumptions con estados; reglas de validación configurables; estimations con método y regularización posterior; distributions; demandRecords; bandeja de observadas.
NO CONSTRUIR TODAVÍA: inyección (PRO-O7-04).
PRUEBAS: la vuelta de medidor calcula exacto; una estimación se regulariza con la siguiente lectura real.
TERMINADO CUANDO: los consumos de la ruta quedan aprobados para facturar.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep consumptions
```

#### PRO-O7-04 — Inyección, medición propia, telemedición AMI/MDM y prepago

```text
PRO-O7-04 — Inyección, telemedición y prepago
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: energía inyectada y generación distribuida, medición propia, pérdidas y cambio de clase, telemedición AMI/MDM por conector simulado y prepago con tokens (DEC-060).
LEER: 01-registro-decisiones.md DEC-060; anexos/M03-MED-medicion-consumos.md §5.9, §5.10, §5.11, §5.12; anexos/T06-INT-integraciones.md (fichas AMI/MDM y prepago).
IMPLEMENTAR: RF-MED-094..119.
ENTREGABLES: injections con saldo de energía; amiReads por ingesta de job; prepaidAccounts y prepaidTokens con venta, anulación y conciliación.
NO CONSTRUIR TODAVÍA: medidores inteligentes reales (solo simulador).
PRUEBAS: una ingesta AMI repetida no duplica; un token anulado no se reutiliza.
TERMINADO CUANDO: un medidor prepago ficticio recibe un token y descuenta consumo.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep prepaid && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O7-05 — Portal de consumos, autolectura y facturación in situ

```text
PRO-O7-05 — Portal de consumos y facturación in situ
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: consumos, gráficos y autolectura en el portal, compra de prepago, facturación in situ desde la app de lecturista e informes de medición.
LEER: anexos/M03-MED-medicion-consumos.md §5.13; anexos/M19-POR-portal-socio-landing.md RF-POR-069, §5.9; anexos/T11-WFL-workflow-eventos-documentos.md RF-WFL-098.
IMPLEMENTAR: RF-MED-120..127; RF-POR-069, 103..108; RF-WFL-098; además (v1.1): RF-POR-176 (bloque "Plan de cuotas de obra" en el detalle del contrato, PAN-POR-30).
ENTREGABLES: "Mis consumos" con comparativas; autolectura con foto y validación; facturación in situ con numeración reservada y sincronización posterior con ARCA (CAEA).
NO CONSTRUIR TODAVÍA: nada fuera de medidos.
PRUEBAS: una autolectura fuera de rango queda pendiente de revisión; una factura in situ se autoriza por CAEA al sincronizar.
TERMINADO CUANDO: un socio ficticio carga su autolectura y ve el consumo.
VERIFICAR: playwright test --grep @O7-portal
```

#### PRO-O7-06 — Tarifas medidas

```text
PRO-O7-06 — Tarifas medidas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cuadros y cálculo por consumo con escalones, bloques, cargos fijos y variables, demanda, inyección, subsidios y tablas fiscales del servicio medido.
LEER: anexos/M04-TAR-tarifas-motor-calculo.md RF-TAR-017, 023, 025, 026, 028, 031, 037, 038, 040, 041, 044..046, 048, 049, 070, 074, 077..081, 087, 109, 111, 114; anexos/T04-CFG-configuracion-parametros-maestros.md RF-CFG-103.
IMPLEMENTAR: RF-TAR-017, 023, 025, 026, 028, 031, 037, 038, 040, 041, 044..046, 048, 049, 070, 074, 077..081, 087, 109, 111, 114; RF-CFG-103; además (v1.1): RF-TAR-116 (plan de cuotas de obra por beneficiario al consumir EVT-TEC-25, JOB-TAR-14); RF-TAR-119 (consulta del plan de cuotas de obra para portal y atención); RF-TAR-121 (base de cálculo según el régimen de medición desde `effectiveAt`) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-TAR-019, 021, 022, 036, 039, 042, 068, 094, 100.
DECISIONES v1.1: DEC-085 (la corrección de volumen de gas por presión, temperatura y poder calorífico la aplica M04 al calcular, con sus factores).
ENTREGABLES: extensión del motor puro para consumo, demanda e inyección; explicación por escalón; simulación medida.
NO CONSTRUIR TODAVÍA: tasación telefónica (O10).
PRUEBAS: casos de M04 §17 medidos exactos al centavo; la misma entrada da el mismo resultado.
TERMINADO CUANDO: la tarifa de energía ficticia calcula los consumos de la ruta.
VERIFICAR: dotnet test --filter FullyQualifiedName~domain && dotnet test --filter FullyQualifiedName~Api -- --grep tar
```

#### PRO-O7-07 — Facturación medida, CESP/LQSP e informes a reguladores

```text
PRO-O7-07 — Facturación medida y reguladores
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: facturación de servicios medidos (recategorización por consumo, ítems de terceros, cierre de módulo), CESP, LQSP y RG 5746/2025, regímenes informativos y reportes a entes reguladores.
LEER: anexos/M05-FAC-facturacion.md RF-FAC-108..111, 123, 170, 171; anexos/M06-FIS-fiscal-impuestos.md §5.1 (012), §5.7, §5.13 (128), §5.15; anexos/T10-BIA-reportes-bi-apis.md RF-BIA-098.
IMPLEMENTAR: RF-FAC-108..111, 123, 170, 171; RF-FIS-012, 071..074, 128, 143..150; RF-BIA-098; además (v1.1): RF-FAC-174 (cola de revisión previa antes de autorizar, PRM-FAC-161); RF-FAC-175 (preparación por dependencias entre servicios, CLO sobre AG); RF-FAC-178 (reprefacturar los casos afectados por un cambio de régimen de medición).
DECISIONES v1.2 (10-11-2026): DEC-093 (RF-FIS-072 lee la marca `publicServiceSettlement` de M02, RF-CAT-117, y no la duplica; la LQSP nunca se mezcla con la factura común, PA-FIS-23); DEC-094 (la LQSP se autoriza con CESP, separado del CAEA, RF-FIS-071 y 072; si el contador cambia la vía al responder PA-FIS-24, se registra una DEC nueva que reemplaza a DEC-094); DEC-107 (en la facturación in situ nada se entrega antes de la autorización; con CAE en línea el comprobante se entrega al sincronizar y autorizarse, y un rechazo aplica RN-FAC-164; RF-FAC-170).
ENTREGABLES: lote de facturación medida con lecturas; comprobantes de servicios públicos con requisitos de RG 5746/2025; regulatorReports con formatos declarativos.
NO CONSTRUIR TODAVÍA: regímenes informativos administrativos (O8).
PRUEBAS: la factura medida muestra lecturas, consumo y explicación; el informe al regulador cuadra con lo facturado.
TERMINADO CUANDO: el lote de energía ficticio se emite y el informe regulador se genera.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep regulator
```

#### PRO-O7-08 — Red GIS, mantenimiento, obras, inspecciones y costeo de OT

```text
PRO-O7-08 — Red GIS, obras e inspecciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: red e infraestructura en GIS, mantenimiento preventivo, obras, loteos y contribución por mejoras (MER-009), inspecciones y consumo no registrado (MER-004), costeo de OT y aprovisionamiento restante.
LEER: anexos/M10-TEC-tecnica-campo-redes.md RF-TEC-035, 040, 041, 061, 066, 072, 106, §5.10, §5.11, §5.13, §5.14, RF-TEC-196.
IMPLEMENTAR: RF-TEC-035, 040, 041, 061, 066, 072, 106, 138..154, 156..163, 168..181, 196; además (v1.1): RF-CAT-115 (contratos de obra tipo 17 al aprobarse el prorrateo, consumiendo EVT-TEC-25); RF-TEC-232 (escalamiento de guardia); RF-TEC-233 (protocolo de emergencia por servicio); RF-TEC-235 (puntos y plan de muestreo de agua); RF-TEC-236 (muestras, análisis y resultados) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-TEC-155; extensión v1.1 de RF-TEC-231 (parte O7: turnos de guardia de GAS y ELE).
ENTREGABLES: networkAssets y gisLayers sobre el mapa de DEC-046; maintenancePlans con OT programadas; works con presupuesto, avance y prorrateo de contribución; inspections con acta y liquidación de consumo no registrado; costo de OT (materiales y mano de obra).
NO CONSTRUIR TODAVÍA: migración de obras (O11, HUECO-OBR-04).
PRUEBAS: la contribución por mejoras prorratea exacto entre frentistas; una inspección con fraude genera el cargo con aprobación.
TERMINADO CUANDO: una obra ficticia genera contribuciones facturables.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep works && playwright test --grep @O7-gis
```

#### PRO-O7-09 — Mora, cobranza en campo, CRM y ventas de medidos

```text
PRO-O7-09 — Mora, cobranza en campo y CRM de medidos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: recargos y corte de medidos, cobranza en campo por cobrador con la app, solicitudes y reclamos de medición, y cargos de venta de medidos.
LEER: anexos/M08-MOR-mora-financiacion.md RF-MOR-015, 038, 039, 129, 202; anexos/M07-COB-cuenta-corriente-cobranza.md RF-COB-075, 095, 096; anexos/M09-CRM-atencion.md RF-CRM-080, 081, 085, 114; anexos/M11-VEN-ventas-presupuestos.md RF-VEN-013.
IMPLEMENTAR: RF-MOR-015, 038, 039, 129, 202; RF-COB-075, 095, 096; RF-CRM-080, 081, 085, 114; RF-VEN-013; además (v1.1): RF-MOR-221 (plantilla de ventana de corte ERSeP para electricidad en Córdoba); RF-MOR-222 (parte O7: modo de suspensión restringida para AG y CLO; TEL y TV en PRO-O10-09); RF-TEC-238 (parte O7: suspensión restringida de AG; TEL y TV en PRO-O10-09); RF-CRM-259 (reclamos de saneamiento y alumbrado con derivación según convenio) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-MOR-130; extensión v1.1 de RF-MOR-223 (parte O7: corte) y de RF-CRM-260 (parte O7: SLA de reclamo de seguridad de GAS y ELE).
ENTREGABLES: corte de medidos por OT con lectura de corte; perfil cobrador en la app de campo; reclamos de facturación por lectura; venta de medidor.
NO CONSTRUIR TODAVÍA: RF-COB-094 (O10).
PRUEBAS: un cobro en campo sin conexión no se duplica al sincronizar; el corte registra la lectura.
TERMINADO CUANDO: un cobrador ficticio cobra sin conexión y rinde.
VERIFICAR: playwright test --grep @O7-field
```

#### PRO-O7-11 — Migración comercial vigente y corrida paralela (DEC-089)

```text
PRO-O7-11 — Migración comercial vigente y corrida paralela
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: migrar los datos vigentes comerciales que el corte de los servicios medidos necesita (configuración, entidades, cuadros tarifarios con sus fórmulas, clasificación tributaria, talones y notificaciones vigentes) y ejecutar la corrida paralela de facturación y cobranza frente a ProCoop (datos ficticios) con comparación por cuenta y concepto, incluida la parte de mora (DEC-089; reemplaza a PRO-O11-07).
LEER: 01-registro-decisiones.md DEC-089; anexos/T07-MIG-migracion-procoop.md §5.8, §17.4 (PRM-MIG-041); anexos/T04-CFG-configuracion-parametros-maestros.md RF-CFG-132, 142; anexos/M04-TAR-tarifas-motor-calculo.md RF-TAR-101, 102; anexos/M06-FIS-fiscal-impuestos.md RF-FIS-163; anexos/M07-COB-cuenta-corriente-cobranza.md RF-COB-155; anexos/M19-POR-portal-socio-landing.md RF-POR-127; anexos/M08-MOR-mora-financiacion.md RF-MOR-219; anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-154.
IMPLEMENTAR: RF-CFG-132, 142; RF-TAR-101, 102; RF-FIS-163; RF-COB-155; RF-POR-127; RF-MIG-070..076; RF-MOR-219; RNF-NFR-154.
EXTENSIONES: extensión de RNF-NFR-016.
DECISIONES v1.2 (10-11-2026): DEC-098 (las sucursales `branches` se derivan de `PTOVENTA.SUC_COM` de ProCoop y la lista propuesta la revisa y confirma la cooperativa, con nombres, domicilios y fusiones, antes de migrar puntos de venta y cajas; RF-CFG-142 deja de citar `EMPRESAS` y `CAJASJP`, que no tienen esa columna); DEC-105 (las reglas con fórmula migradas reciben la justificación `migrated_pending_review` y entran en REP-TAR-18 como pendientes de revisión, RF-TAR-102); DEC-099 y DEC-103 (en la migración comercial de LAG, las personas sin documento siguen RF-PER-175 y RF-CRM-261, y cada extracción va precedida del escaneo previo de secretos y tarjetas de RF-MIG-010).
ENTREGABLES: configVersion de migración con reporte de no migrables; legalEntities migradas; cuadros tarifarios con fórmulas GFL y reporte de traducción; cupones equivalentes de talones vigentes; parallelRuns y parallelDiffs con umbral, clasificación y explicación obligatoria; reporte de paralelo por ciclo y servicio.
NO CONSTRUIR TODAVÍA: corte (PRO-O7-12); históricos y archivo (PRO-O11-06).
PRUEBAS: toda diferencia mayor al umbral exige explicación antes de aprobar el ciclo; el lote paralelo no genera efectos externos; dos migraciones consecutivas de los datos vigentes dan el mismo resultado.
TERMINADO CUANDO: los ciclos consecutivos ficticios de energía y gas que pide PRM-MIG-041 (default 2) quedan aprobados.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep "parallel|mig"
```

#### PRO-O7-12 — Congelamiento, by-pass, corte comercial por servicio y rollback (DEC-068, DEC-089)

```text
PRO-O7-12 — Corte comercial por servicio y rollback
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: congelamiento por alcance, by-pass y convivencia con ProCoop, plan de corte comercial por servicio (electricidad, gas y prepago de la piloto al cerrar O7; cada servicio restante al cerrar la ola de su vertical), carga delta, verificación, redirecciones del portal anterior y rollback (DEC-068, DEC-089; reemplaza a PRO-O11-08).
LEER: 01-registro-decisiones.md DEC-068, DEC-069, DEC-089; anexos/T07-MIG-migracion-procoop.md §5.1 (006), §5.9 (080..082, 086..089); anexos/M19-POR-portal-socio-landing.md RF-POR-020.
IMPLEMENTAR: RF-MIG-006, 080..082, 086..089; RF-POR-020.
ENTREGABLES: congelamiento confirmado por la cooperativa; cutoverPlans con etapas por servicio, pasos, responsables y tiempos; cutoverSteps con evidencia; rollbackPlans probados; redirecciones permanentes desde las URLs de CoopOnline.
NO CONSTRUIR TODAVÍA: corte administrativo (PRO-O11-10).
PRUEBAS: el corte no se habilita sin congelamiento ni con un criterio go en rojo; el rollback restituye el estado previo sin efectos externos duplicados; pasado el primer hito fiscal o de cobro solo hay rollback hacia adelante.
TERMINADO CUANDO: el plan de corte comercial ficticio de energía y gas se ejecuta en sandbox con rollback.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cutover
```

#### PRO-O7-10 — Integración de O7: facturación de energía con lecturas

```text
PRO-O7-10 — Integración de O7
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O7 (sección 11.2 del plan), incluido el ensayo cronometrado de corte comercial de energía y gas con conciliación de saldos, servicios, deuda y convenios (DEC-089), y cerrar la ola. Se ejecuta después de PRO-O7-11 y PRO-O7-12.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §11; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §4 y §5 (energía y agua; antes citaba parte2); §17 y §18 de M03, M04 y M10; anexos/T07-MIG-migracion-procoop.md §5.9, §17.
IMPLEMENTAR: ningún RF nuevo. Verificar los 298 RF de O7 (DEC-089: antes 274; versión 1.0: 256).
ENTREGABLES: seed demo O7; e2e @O7 de 11.2; carga de 50.000 lecturas ficticias; test:isolation; informe de ensayo de corte comercial en docs/evidencias/O7/corte-comercial/.
NO CONSTRUIR TODAVÍA: nada de O8.
PRUEBAS: e2e @O7, test:isolation, k6 de ingesta de lecturas.
TERMINADO CUANDO: criterio 11.2 demostrado con evidencias en docs/evidencias/O7/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O7 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 12. O8 — ERP administrativo y contabilidad completa

### 12.1 Objetivo

Construir compras y proveedores (M12), retenciones como agente, libros IVA digitales y regímenes informativos (M06), stock completo con bienes de uso, valorización y RMA (M13), tesorería completa (M14: Interbanking, valores, cheques, eCheq, tarjetas, retenciones recibidas, pagos a proveedores, flujo de fondos, compromisos), contabilidad completa (M15: múltiples planes, ajuste por inflación, cierre, libros rubricados, presupuestos), ventas y presupuestos (M11) e importación de liquidación de sueldos externa con contabilización (M16, DEC-058).

### 12.2 Criterio de salida (demostrable)

Cierre contable mensual de TEN-001 con datos ficticios: una solicitud de compra pasa por cotización, orden de compra, recepción con remito, comprobante de proveedor importado de Mis Comprobantes (simulado), control de 3 vías, orden de pago con retenciones calculadas como agente, pago por eCheq o Interbanking simulado, conciliación bancaria, amortización de bienes de uso, importación de una liquidación de sueldos externa, libro IVA digital y SICORE generados, y balance de sumas y saldos y estados contables del período cerrados.

### 12.3 Dependencias

O5 completa. Se recomienda O7 terminada (DEC-058: sueldos en paralelo desde O8 por importación).

### 12.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M12 CMP | 106 | RF-CMP-001..017, 020..026, 030..045, 050..066, 070..085, 090..094, 100..108, 111, 112, 120..122, 140..148 (v1.1: se agregan RF-CMP-149, 150, 151, 152, 153) | PAN-CMP-01..26 (*reemplazado, corrección 05-11-2026:* antes PAN-CMP-01..24; 26 definidos en el anexo), API-CMP-01..14, 20..27, 30..36, 40..46, 50..52, 60..67, 70..71, 80..87, 90..93, 100..101, 110..113, 120..124 (*reemplazado, corrección 05-11-2026:* antes API-CMP-01..68; 72 definidos en el anexo), EVT-CMP-01..17 (*reemplazado, corrección 05-11-2026:* antes EVT-CMP-01..14; 17 definidos en el anexo), JOB-CMP-01..10 (*reemplazado, corrección 05-11-2026:* antes JOB-CMP-01..08; 10 definidos en el anexo y en el catálogo de T11) | `suppliers`, `purchaseCatalogs`, `purchaseRequests`, `quotations`, `tenders`, `purchaseOrders`, `goodsReceipts`, `supplierInvoices`, `threeWayMatches`, `paymentOrders` |
| M14 TES | 111 | RF-TES-007, 008, 010, 012, 019, 023, 024, 026, 029, 045, 046, 049, 051..122, 124, 125, 131, 141..143, 146..159, 167, 171..174, 177, 187 | PAN-TES y API-TES restantes | `interbankingBatches`, `thirdPartyChecks`, `ownChecks`, `checkbooks`, `echeqs`, `cardSettlements`, `receivedWithholdings`, `supplierPaymentCashes`, `cashFlowScenarios`, `fundCommitments` |
| M15 CON | 65 (antes 64) | RF-CON-008, 014, 016, 018..021, 024, 026, 034, 041, 046, 047, 049, 068..070, 072, 077..080, 082, 085, 088..090, 095..097, 103..111, 113, 116..119, 122, 123, 127..133, 135..138, 142..148 (v1.2: se agrega RF-CON-163) | PAN-CON y API-CON restantes | `chartEquivalences`, `inflationAdjustments`, `closingRuns`, `rubricatedBooks`, `budgets`, `commitments` |
| M06 FIS | 43 (antes 42) | RF-FIS-007, 018..020, 022, 049, 091, 094, 096..109, 113, 114, 117..127, 129..133, 140, 142 (v1.2: se agrega RF-FIS-169) | Retenciones, libros, regímenes y obligaciones propias del tenant (DEC-095) | `withholdingRegimes`, `withholdingCertificates`, `informativeReturns`, `ownTaxObligations` |
| M13 STK | 48 | RF-STK-005, 007, 008, 010, 012, 014, 018, 019, 029, 032, 033, 036, 037, 048, 070, 083, 085..088, 090..093, 095..112, 114, 115, 130, 134, 138 (v1.1: se agregan RF-STK-139) | Bienes de uso, valorización y RMA | `fixedAssets`, `depreciationRuns`, `costLayers`, `inventoryCounts`, `rmaCases` |
| M11 VEN | 67 | RF-VEN-012, 020..046, 050..070, 087..090, 093, 094, 100..102, 104, 107, 108, 110..113, 115, 117 | PAN-VEN y API-VEN de presupuestos, ventas y POS | `quotes`, `salesOrders`, `deliveries`, `returns`, `sellers`, `posTerminals`, `sellerSettlements` |
| M16 SUE | 6 | RF-SUE-121, 140..144 | Importación de liquidación externa (DEC-058) | `externalPayrollImports` |
| M08 MOR | 4 | RF-MOR-037, 053, 182, 190 | — | — |
| M05 FAC | 3 | RF-FAC-107, 115, 133 | — | — |
| T11 WFL | 3 | RF-WFL-198..200 | Firma de órdenes de pago | — |
| M18 SOC | 2 | RF-SOC-118, 119 | Rendiciones de flota (parte contable) | — |
| M07 COB | 1 | RF-COB-072 | — | — |
| M10 TEC | 2 | RF-TEC-070 (v1.1: se agregan RF-TEC-239) | — | — |
| M19 POR | 1 | RF-POR-102 | — | — |
| T10 BIA | 1 | RF-BIA-101 | — | — |
| M03 MED | 1 | RF-MED-129 (v1.1, fila nueva) | — | — |
| M17 INS | 1 | RF-INS-109 (v1.2, fila nueva; DEC-095, DEC-096) | Base de capital por entidad jurídica y cierre mínimo de capital (PRO-O8-04) | `capitalClosings` (parte mínima) |
| **Total** | **465** (antes 462) | | | |

Extensiones: RF-BIA-090, 092; RF-FIS-112; RF-STK-006, 024, 040, 131, 135; RF-TES-014, 015, 128, 140, 145; RF-CON-007, 071, 094; parte anticipada de RF-INS-053 (cierre mínimo de capital, v1.2, PRO-O8-04).

### 12.5 Fuera de la ola

Liquidación propia de sueldos (O9); institucional y servicios sociales (O10); fabricación (O10); BI avanzado (O11).

### 12.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Retenciones mal calculadas | Motor de retenciones puro con tablas normativas versionadas y casos de M06 §17 |
| Doble pago a proveedor | Control de 3 vías, unicidad de comprobante de proveedor por CUIT, tipo, punto de venta y número, e idempotencia en pagos |
| Cierre contable con módulos abiertos | Checklist de cierre que verifica cajas, conciliaciones y asientos pendientes (M15 §5.11) |
| Cheques y eCheq | Estados exhaustivos y conciliación con banco simulado (M14 §5.5–§5.7) |

### 12.7 Datos demo

M12 §18 (proveedores ficticios con CUIT de prueba), M13 §18, M14 §18 (chequera y cuentas ficticias), M15 §18, M11 §18, M16 §18 (liquidación externa de ejemplo).

### 12.8 Pruebas end-to-end de la ola

CU de M12 §17 (compra completa con 3 vías); CU de M14 §17 (eCheq, Interbanking, flujo de fondos); CU de M15 §17 (cierre mensual, ajuste por inflación); CU de M06 §17 (SICORE, Libro IVA Digital); CU de M16 §17 CU-28 (importación de liquidación externa).

### 12.9 Huecos que se resuelven en la ola

HUE-ELE-01, HUE-GAS-04 y HUE-TV-01 en su parte administrativa (R9).

### 12.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O8-01 | Proveedores, catálogos, solicitudes y cotizaciones | 40 |
| PRO-O8-02 | Órdenes de compra, recepción, comprobantes de proveedor y 3 vías | 44 |
| PRO-O8-03 | Órdenes de pago, Mis Comprobantes, informes y retenciones como agente | 36 |
| PRO-O8-04 | Fiscal administrativo: agentes, percepciones, libros IVA digitales y regímenes | 31 (antes 29; v1.2: RF-FIS-169 y RF-INS-109) |
| PRO-O8-05 | Stock completo: artículos, movimientos, inventario, mínimos y valorización | 29 |
| PRO-O8-06 | Bienes de uso, RMA y stock por unidad de gasto | 21 |
| PRO-O8-07 | Tesorería: maestros restantes, extractos e Interbanking | 22 |
| PRO-O8-08 | Valores de terceros, cheques, eCheq, tarjetas y retenciones recibidas | 46 |
| PRO-O8-09 | Pagos a proveedores, cotizaciones, flujo de fondos, compromisos e informes | 43 |
| PRO-O8-10 | Contabilidad: planes, asientos, motor y centros de costo restantes | 31 (antes 30; v1.2: RF-CON-163) |
| PRO-O8-11 | Múltiples planes, estados contables, ajuste por inflación, cierre, libros y presupuestos | 34 |
| PRO-O8-12 | Presupuestos de venta | 28 |
| PRO-O8-13 | Venta de productos, financiación, vendedores, POS y efectos restantes | 48 |
| PRO-O8-14 | Importación de sueldos externa, firma de pagos y flota contable (DEC-058, DEC-078) | 12 |
| PRO-O8-15 | Integración de O8: cierre contable mensual | 0 (verifica 465; antes 462) |

#### PRO-O8-01 — Proveedores, catálogos, solicitudes y cotizaciones

```text
PRO-O8-01 — Proveedores, solicitudes y cotizaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: proveedores con datos fiscales y bancarios (CBU en bóveda o cifrado), catálogos de compras, solicitudes de aprovisionamiento con aprobación y cotizaciones, concursos y licitaciones.
LEER: anexos/M12-CMP-compras-proveedores.md §4, §5.1..§5.4, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-CMP-001..017, 020..026, 030..045.
DECISIONES v1.2 (10-11-2026): DEC-097 (el proveedor es un rol de una persona de M01 con `personId` obligatorio: el alta pasa por el alta asistida con control de duplicados de RF-PER-174, y un socio que además es proveedor tiene una sola persona con varios roles; cambia RN-CMP-001; RF-CMP-001, 002 y 010). PRUEBAS adicionales: el alta de un proveedor con la CUIT de un socio existente reutiliza su persona.
ENTREGABLES: suppliers (persona de M01 con rol proveedor), purchaseCatalogs, purchaseRequests con aprobación por bandas, quotations y tenders con comparativo.
NO CONSTRUIR TODAVÍA: órdenes de pago (PRO-O8-03).
PRUEBAS: proveedor con CUIT duplicado rechazado; una solicitud sin aprobación no genera orden de compra.
TERMINADO CUANDO: una solicitud ficticia llega a comparativo de cotizaciones.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cmp
```

#### PRO-O8-02 — Órdenes de compra, recepción, comprobantes de proveedor y 3 vías

```text
PRO-O8-02 — Órdenes de compra, recepción y 3 vías
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: órdenes de compra, recepción y remito de proveedor con ingreso a stock, comprobantes de proveedor con imputación contable y fiscal, y control de 3 vías con habilitación de pago.
LEER: anexos/M12-CMP-compras-proveedores.md §5.5..§5.8.
IMPLEMENTAR: RF-CMP-050..066, 070..085, 090..094; además (v1.1): RF-CMP-149..153 (facturas de mayoristas de energía y gas, control contra la medición de frontera, balance comprado contra facturado y costo de abastecimiento por servicio); RF-MED-129 (volumen comprado por punto de compra o frontera).
ENTREGABLES: purchaseOrders, goodsReceipts (movimiento de stock de M13 por API), supplierInvoices con unicidad, threeWayMatches con tolerancias por parámetro y asientos por regla.
NO CONSTRUIR TODAVÍA: RF-CMP-086 (O9).
PRUEBAS: un comprobante fuera de tolerancia queda bloqueado para pago; un comprobante duplicado se rechaza.
TERMINADO CUANDO: la compra ficticia queda habilitada para pago.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep threeWay
```

#### PRO-O8-03 — Órdenes de pago, Mis Comprobantes, informes y retenciones como agente

```text
PRO-O8-03 — Órdenes de pago y retenciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: órdenes de pago con retenciones calculadas por el motor de M06 como agente (Ganancias, IVA, IIBB, SUSS), certificados, importación de Mis Comprobantes con IA que propone, informes y transversales de compras.
LEER: anexos/M12-CMP-compras-proveedores.md §5.9 (100..108, 111, 112), §5.10 (120..122), §5.11; anexos/M06-FIS-fiscal-impuestos.md §5.11 (097..109).
IMPLEMENTAR: RF-CMP-100..108, 111, 112, 120..122, 140..148; RF-FIS-097..109.
DECISIONES v1.2 (10-11-2026): DEC-097 (la identidad fiscal del sujeto retenido se lee de la persona de M01 del proveedor, `suppliers.personId`, o de su copia `suppliers.identitySnapshot`; RF-FIS-102).
ENTREGABLES: paymentOrders con aprobación; withholdingRegimes y motor calculateWithholdings puro; withholdingCertificates PDF; importación de Mis Comprobantes simulada con conciliación.
NO CONSTRUIR TODAVÍA: RF-CMP-109, 110 (O9), 130, 131 (O11); RF-FIS-110 ya en O5, 111 (O9).
PRUEBAS: casos de retención de M06 §17 exactos; una OP con retención emite certificado numerado.
TERMINADO CUANDO: la OP ficticia calcula retenciones y emite certificados.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep withholdings
```

#### PRO-O8-04 — Fiscal administrativo: agentes, percepciones, libros IVA digitales y regímenes

```text
PRO-O8-04 — Libros IVA digitales y regímenes informativos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: condición de agente, percepciones restantes, Libro IVA Digital, Mis Comprobantes, SICORE, SIRE, regímenes informativos provinciales y conceptos de terceros restantes.
LEER: anexos/M06-FIS-fiscal-impuestos.md RF-FIS-007, 018..020, 022, 049, 091, 094, 096, §5.12 (113, 114, 117..124), §5.13 (125..127, 129..133), §5.14 (140, 142). Además (v1.2): RF-FIS-169 y RN-FIS-133; anexos/M17-INS-institucional.md RF-INS-109 y RF-INS-053; 01-registro-decisiones.md DEC-095 y DEC-096.
IMPLEMENTAR: RF-FIS-007, 018..020, 022, 049, 091, 094, 096, 113, 114, 117..127, 129..133, 140, 142 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt). Además (v1.2): RF-FIS-169 (registro de obligaciones y exenciones propias del tenant como contribuyente, `ownTaxObligations`, sin precarga de normas, DEC-095 y PA-FIS-25); RF-INS-109 (base de capital por entidad jurídica y fecha de M17, servicio `ins.capitalBase.get` y API-INS-071, prerrequisito de las contribuciones calculadas sobre el capital, DEC-095 y DEC-096; alcance mínimo en la línea ALCANCE MÍNIMO v1.2).
EXTENSIONES: extensión de RF-FIS-112. Parte anticipada de RF-INS-053 (v1.2: cierre mínimo de capital por entidad jurídica, ver ALCANCE MÍNIMO v1.2; el RF completo sigue en PRO-O10-02).
ALCANCE MÍNIMO v1.2 (RF-INS-109 empieza en O8 y RF-INS-053, cierre de capital, sigue en O10): M17 entrega en este prompt (1) `ins.capitalBase.get({ legalEntityId, asOf })` y API-INS-071, calculados desde los `capitalMovements` confirmados del capital mínimo de O5 (PRO-O5-12) con `final = false`, con suscripto, integrado, pendiente, reservado, reembolsado, rescates aprobados no pagados, membresías activas, apertura por rubro (`capitalItemId`) y estado de conciliación con M15 (REP-INS-06); y (2) un cierre mínimo de capital por entidad jurídica: `capitalClosings` con `legalEntityId`, fecha de cierre, estado y `capitalBase` congelada; con cierre en `asOf` el servicio devuelve la base congelada con `final = true` y `closingId`; los movimientos con fecha efectiva igual o anterior al cierre se rechazan con `ins.capital.closed`; la reapertura exige aprobación de T11; al cerrar se publica EVT-INS-22 `ins.capitalBase.closed` y al reabrir `ins.capitalBase.reopened`, que M06 consume para recalcular o marcar para revisión la obligación que usó esa base. Quedan para PRO-O10-02 la pantalla completa de cierre, PRM-INS-029 y la relación del cierre con revalúo, excedentes, retornos y asamblea (RF-INS-053 completo). M17 no decide la base imponible, no calcula la contribución ni precarga normas (DEC-095, PA-FIS-25).
DECISIONES v1.2 (10-11-2026): DEC-095 (M06 incorpora el registro genérico de obligaciones y exenciones propias del tenant como contribuyente, no como agente, por entidad jurídica, con impuesto o contribución, jurisdicción, actividad o sección, tipo, fundamento normativo, vigencia y adjunto de respaldo; el sistema no precarga normas: la exención de IIBB de Córdoba para cooperativas eléctricas, la Contribución Especial sobre el Capital Cooperativo y la reforma de Ganancias 2026 quedan para el contador, PA-FIS-25; RF-FIS-169, RN-FIS-133); DEC-096 (la base de capital se pide por entidad jurídica, RF-INS-109). PRUEBAS adicionales: con cierre de capital registrado, `ins.capitalBase.get` devuelve `final = true` y los mismos importes aunque después se registren movimientos posteriores; sin cierre devuelve `final = false`; los importes de MUTUAL no se mezclan con los de COOP.
ENTREGABLES: informativeReturns con generación de archivos por formato oficial y validación previa; libros IVA compras y ventas digitales; presentaciones con estado.
NO CONSTRUIR TODAVÍA: presentación automática con credenciales reales (solo archivos y simulador).
PRUEBAS: los archivos generados validan contra las especificaciones de formato de M06; los totales cuadran con los libros.
TERMINADO CUANDO: Libro IVA Digital y SICORE del período ficticio se generan.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep informative
```

#### PRO-O8-05 — Stock completo: artículos, movimientos, inventario, mínimos y valorización

```text
PRO-O8-05 — Stock completo
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar artículos, depósitos, movimientos y trazabilidad, inventario físico y ajustes, stock mínimo y sugerencia de compra, valorización y costeo (PPP, FIFO según parámetro).
LEER: anexos/M13-STK-stock-activos-fabricacion.md RF-STK-005, 007, 008, 010, 012, 014, 018, 019, 029, 032, 033, 036, 037, 048, 138, 070, §5.8 (083, 085), §5.9, §5.10 (090..093, 095); anexos/M10-TEC-tecnica-campo-redes.md RF-TEC-070.
IMPLEMENTAR: RF-STK-005, 007, 008, 010, 012, 014, 018, 019, 029, 032, 033, 036, 037, 048, 070, 083, 085..088, 090..093, 095, 138; RF-TEC-070; además (v1.1): RF-TEC-239 y RF-STK-139 (entrega de gas envasado con su movimiento de stock, DEC-082, solo si PRM-CAT-112 está habilitado) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-STK-006, 024, 040, 131, 135.
ENTREGABLES: inventoryCounts con conteo ciego y ajuste aprobado; sugerencia de compra que crea solicitudes en M12; costLayers y valorización por job; asientos de stock.
NO CONSTRUIR TODAVÍA: fabricación (O10).
PRUEBAS: la valorización PPP coincide con la tabla esperada; un ajuste de inventario genera asiento.
TERMINADO CUANDO: el inventario físico ficticio se ajusta y valoriza.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep inventory
```

#### PRO-O8-06 — Bienes de uso, RMA y stock por unidad de gasto

```text
PRO-O8-06 — Bienes de uso y RMA
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: bienes de uso con alta, amortización, revalúo, baja y asientos; RMA, garantías, reparaciones y recepción técnica; unidades de gasto y stock por servicio.
LEER: anexos/M13-STK-stock-activos-fabricacion.md §5.11, §5.12 (108..112, 114, 115), §5.14 (130, 134).
IMPLEMENTAR: RF-STK-096..112, 114, 115, 130, 134.
ENTREGABLES: fixedAssets; depreciationRuns mensuales por job; rmaCases con proveedor.
NO CONSTRUIR TODAVÍA: fabricación (O10).
PRUEBAS: la amortización mensual coincide con la tabla esperada; una corrida repetida no duplica asientos.
TERMINADO CUANDO: los bienes de uso ficticios amortizan el mes.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep fixedAssets
```

#### PRO-O8-07 — Tesorería: maestros restantes, extractos e Interbanking

```text
PRO-O8-07 — Tesorería restante e Interbanking
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: maestros y operaciones restantes de tesorería, extractos avanzados e Interbanking por archivo y conector simulado.
LEER: anexos/M14-TES-tesoreria-bancos.md RF-TES-007, 008, 010, 012, 019, 023, 024, 026, 029, 045, 046, 049, §5.4.
IMPLEMENTAR: RF-TES-007, 008, 010, 012, 019, 023, 024, 026, 029, 045, 046, 049, 051..060 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-TES-014, 015.
ENTREGABLES: interbankingBatches con firma por aprobación; transferencias entre cuentas; extractos multiformato.
NO CONSTRUIR TODAVÍA: valores (PRO-O8-08).
PRUEBAS: un lote Interbanking aprobado no se reenvía; las transferencias generan asientos balanceados.
TERMINADO CUANDO: un lote de pagos ficticio se genera para Interbanking.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep interbanking
```

#### PRO-O8-08 — Valores de terceros, cheques, eCheq, tarjetas y retenciones recibidas

```text
PRO-O8-08 — Valores, cheques, eCheq y tarjetas
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: valores de terceros en cartera, cheques propios y chequeras, eCheq, tarjetas con cupones y liquidaciones, y retenciones recibidas.
LEER: anexos/M14-TES-tesoreria-bancos.md §5.5..§5.9.
IMPLEMENTAR: RF-TES-061..106.
ENTREGABLES: thirdPartyChecks con estados (cartera, depositado, endosado, rechazado); ownChecks y checkbooks; echeqs por conector simulado; cardSettlements con conciliación de cupones; receivedWithholdings como crédito fiscal.
NO CONSTRUIR TODAVÍA: nada fuera de M14.
PRUEBAS: un cheque rechazado revierte la cobranza y genera deuda; un cupón conciliado no se concilia dos veces.
TERMINADO CUANDO: un cheque ficticio recorre cartera, depósito y acreditación.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep checks
```

#### PRO-O8-09 — Pagos a proveedores, cotizaciones, flujo de fondos, compromisos e informes

```text
PRO-O8-09 — Pagos, flujo de fondos y compromisos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: cajas para pagos a proveedores, ejecución financiera de órdenes de pago y otros egresos, rendiciones restantes, cotizaciones, flujo de fondos con escenarios, compromisos de fondos e informes.
LEER: anexos/M14-TES-tesoreria-bancos.md §5.10, §5.11 (113..122, 124, 125), RF-TES-131, §5.14 (141..143), §5.15 (146..155), §5.16, §5.18 (167, 171..174, 177), RF-TES-187.
IMPLEMENTAR: RF-TES-107..122, 124, 125, 131, 141..143, 146..159, 167, 171..174, 177, 187; parte O8 de RF-TES-128 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-TES-140, 145.
DECISIONES v1.2 (10-11-2026): DEC-095 y DEC-107 (cada pago identifica la obligación que cancela, de agente o propia, y sale de una cuenta de la misma entidad jurídica de la obligación; EVT-TES-15 lleva el bloque `taxObligation` que M15 usa en RF-CON-163; la obligación anulada en M06 sigue el tratamiento de RF-TES-122).
ENTREGABLES: supplierPaymentCashes; ejecución de OP por medio (transferencia, cheque, eCheq, efectivo); cashFlowScenarios; fundCommitments.
NO CONSTRUIR TODAVÍA: pago de haberes (O9).
PRUEBAS: una OP pagada no se paga dos veces; el flujo de fondos refleja compromisos y vencimientos.
TERMINADO CUANDO: la OP de la compra ficticia se paga y concilia.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep paymentExecution
```

#### PRO-O8-10 — Contabilidad: planes, asientos, motor y centros de costo restantes

```text
PRO-O8-10 — Contabilidad restante
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar planes de cuentas, períodos, asientos, motor automático para compras, tesorería, stock y sueldos importados, centros de costo y cuentas corrientes por servicio.
LEER: anexos/M15-CON-contabilidad.md RF-CON-008, 014, 016, 018..021, 024, 026, 034, 041, 046, 047, 049, 068..070, 072, 077..080, 082, 085, 088..090, 095..097.
IMPLEMENTAR: RF-CON-008, 014, 016, 018..021, 024, 026, 034, 041, 046, 047, 049, 068..070, 072, 077..080, 082, 085, 088..090, 095..097 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt). Además (v1.2): RF-CON-163 (contabilización de las obligaciones propias del tenant: provisión, reversión y cancelación en la entidad jurídica de la obligación y conciliación con M06, DEC-095).
EXTENSIONES: extensiones de RF-CON-007, 071, 094.
DECISIONES v1.2 (10-11-2026): DEC-095 (RF-CON-163: provisión al crearse la obligación propia en M06, evento `fis.obligation.created`; reversión al anularse o recalcularse; cancelación al pagarse por M14, EVT-TES-15; siempre en la entidad jurídica de la obligación, RN-CON-128, M-137 y M-138; incluye las contribuciones sobre la base de capital de M17; las exenciones no generan asiento; la conciliación contable-fiscal expone las obligaciones propias sin asiento).
ENTREGABLES: reglas de asiento de M12, M13, M14 y M16; distribución por centros de costo; conciliaciones de cuentas corrientes de proveedores.
NO CONSTRUIR TODAVÍA: RF-CON-073, 099 (O9).
PRUEBAS: cada evento administrativo genera su asiento balanceado una sola vez.
TERMINADO CUANDO: todos los eventos del e2e de compra tienen asiento.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep postings
```

#### PRO-O8-11 — Múltiples planes, estados contables, ajuste por inflación, cierre, libros y presupuestos

```text
PRO-O8-11 — Estados contables, inflación y cierre
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: múltiples planes con equivalencias y simulaciones, estados contables e informes, ajuste por inflación, cierre y reapertura de ejercicio, libros rubricados, sistema contable externo restante y presupuestos y compromisos.
LEER: anexos/M15-CON-contabilidad.md §5.8, §5.9 (113, 116..119, 122, 123), §5.10, §5.11 (132, 133, 135), §5.12, §5.13 (142), §5.14 (143..148).
IMPLEMENTAR: RF-CON-103..111, 113, 116..119, 122, 123, 127..133, 135..138, 142..148.
ENTREGABLES: chartEquivalences; estados contables (situación patrimonial, resultados, evolución del patrimonio neto, flujo de efectivo); inflationAdjustments con índices de T04; closingRuns con checklist y asientos de refundición; rubricatedBooks exportables; budgets.
NO CONSTRUIR TODAVÍA: distribución de excedentes (O10, RF-CON-134).
PRUEBAS: el ajuste por inflación coincide con la tabla esperada; el cierre no procede con pendientes; la reapertura restituye saldos.
TERMINADO CUANDO: el período ficticio se cierra con estados contables.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep closing
```

#### PRO-O8-12 — Presupuestos de venta

```text
PRO-O8-12 — Presupuestos de venta
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: presupuestos con versiones, aprobación, vencimiento, aceptación por el cliente y conversión en venta u OT.
LEER: anexos/M11-VEN-ventas-presupuestos.md §4, RF-VEN-012, §5.2, §7, §10, §11.
IMPLEMENTAR: RF-VEN-012, 020..046.
ENTREGABLES: quotes con PDF y aceptación en portal; conversión idempotente.
NO CONSTRUIR TODAVÍA: RF-VEN-047 (O10).
PRUEBAS: un presupuesto vencido no se acepta; la conversión no se duplica.
TERMINADO CUANDO: un presupuesto ficticio se acepta y convierte.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep quotes
```

#### PRO-O8-13 — Venta de productos, financiación, vendedores, POS y efectos restantes

```text
PRO-O8-13 — Ventas, POS y efectos restantes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: venta de productos con entrega y devolución, financiación comercial restante, vendedores, POS y rendiciones, flujo continuo y reportes, y los efectos restantes en cobranza, facturación, mora y portal.
LEER: anexos/M11-VEN-ventas-presupuestos.md §5.3, §5.4 (087..090, 093, 094), §5.5 (100..102, 104, 107, 108), §5.6 (110..113, 115, 117); anexos/M07-COB-cuenta-corriente-cobranza.md RF-COB-072; anexos/M19-POR-portal-socio-landing.md RF-POR-102; anexos/M05-FAC-facturacion.md RF-FAC-107, 115, 133; anexos/M08-MOR-mora-financiacion.md RF-MOR-037, 053, 182, 190.
IMPLEMENTAR: RF-VEN-050..070, 087..090, 093, 094, 100..102, 104, 107, 108, 110..113, 115, 117; RF-COB-072; RF-POR-102; RF-FAC-107, 115, 133; RF-MOR-037, 053, 182, 190.
DECISIONES v1.2 (10-11-2026): DEC-097 (el vendedor es un rol de una persona de M01 con `personId` obligatorio y alta asistida, RF-VEN-100).
ENTREGABLES: salesOrders, deliveries y returns con stock; sellers con comisiones; posTerminals y sellerSettlements; reportes de ventas.
NO CONSTRUIR TODAVÍA: RF-VEN-103 (O11), 105 (O10).
PRUEBAS: una devolución restituye stock y emite NC; la rendición de vendedor cuadra.
TERMINADO CUANDO: una venta ficticia de mostrador se factura, cobra y rinde.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep sales
```

#### PRO-O8-14 — Importación de sueldos externa, firma de pagos y flota contable (DEC-058, DEC-078)

```text
PRO-O8-14 — Importación de sueldos externa y firma
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: importación de liquidación de sueldos de un sistema externo con validación y contabilización (DEC-058, CU-28), firma de órdenes de pago y documentos (DEC-078), rendiciones contables de flota y reporte administrativo.
LEER: 01-registro-decisiones.md DEC-058, DEC-078; anexos/M16-SUE-personal-sueldos.md §5.12 (121), §5.16; anexos/T11-WFL-workflow-eventos-documentos.md §5.14 (198..200); anexos/M18-SOC-servicios-sociales-flota.md RF-SOC-118, 119; anexos/T10-BIA-reportes-bi-apis.md RF-BIA-101.
IMPLEMENTAR: RF-SUE-121, 140..144; RF-WFL-198..200; RF-SOC-118, 119; RF-BIA-101; RNF-NFR-207.
DECISIONES v1.2 (10-11-2026): DEC-097 (el chofer es un rol de una persona de M01 con `personId` obligatorio y alta asistida, RF-SOC-119).
ENTREGABLES: externalPayrollImports (archivo de ejemplo ficticio) con mapeo de conceptos a cuentas; asiento de sueldos; firma con evidencia; rendiciones de combustible como gasto contable.
NO CONSTRUIR TODAVÍA: liquidación propia (O9); flota operativa (O10).
PRUEBAS: la importación repetida no duplica asientos; un concepto sin mapeo bloquea la importación.
TERMINADO CUANDO: la liquidación externa ficticia queda contabilizada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep payrollImport
```

#### PRO-O8-15 — Integración de O8: cierre contable mensual

```text
PRO-O8-15 — Integración de O8
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O8 (sección 12.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §12; §17 y §18 de M11, M12, M13, M14 y M15.
IMPLEMENTAR: ningún RF nuevo. Verificar los 465 RF de O8 (antes 462; versión 1.0: 454).
ENTREGABLES: seed demo O8; e2e @O8 de 12.2; test:isolation.
NO CONSTRUIR TODAVÍA: nada de O9.
PRUEBAS: e2e @O8, test:isolation, k6 de asientos masivos.
TERMINADO CUANDO: criterio 12.2 demostrado con evidencias en docs/evidencias/O8/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O8 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 13. O9 — Personal y sueldos

### 13.1 Objetivo

Construir M16 completo: legajos, multiempleador, estructura laboral, conceptos y fórmulas, novedades, licencias y vacaciones, liquidaciones con convenios, Ganancias de 4.ª categoría, seguridad social (F.931, Libro de Sueldos Digital), recibos y portal del empleado, pago de haberes, contabilización, certificaciones y egreso, RRHH, aprobaciones y reportes, migración y paralelo (DEC-058).

### 13.2 Criterio de salida (demostrable)

Dos períodos mensuales ficticios de TEN-001 se liquidan en paralelo con la importación externa de O8; las diferencias por empleado se explican; se generan F.931 y LSD en formato válido; los recibos se firman y publican en el portal del empleado; el pago de haberes se envía por tesorería y el asiento de sueldos se genera.

### 13.3 Dependencias

O8 completa.

### 13.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M16 SUE | 139 | RF-SUE-002..120, 122..139, 145, 146 | PAN-SUE-01..47, API-SUE-01..87, EVT-SUE-01..27 (*reemplazado, corrección 05-11-2026:* antes EVT-SUE-01..26; 27 definidos en el anexo), JOB-SUE-01..23 | `employees` (completo), `employers`, `positions`, `agreements`, `payrollConcepts`, `formulas`, `payrollNews`, `leaves`, `payrollRuns`, `payslips`, `incomeTaxCalcs`, `socialSecurityFiles`, `payrollPayments`, `certifications` |
| M19 POR | 7 | RF-POR-129..133, 135, 136 | Portal del empleado | — |
| M14 TES | 6 | RF-TES-160..165 | Pago de haberes | — |
| M15 CON | 3 | RF-CON-073, 099, 149 | — | — |
| M12 CMP | 3 | RF-CMP-086, 109, 110 | Pagos a terceros por sueldos | — |
| T11 WFL | 2 | RF-WFL-197, 202 | Firma de recibos | — |
| M06 FIS | 1 | RF-FIS-111 | Retenciones de Ganancias | — |
| T04 CFG | 2 | RF-CFG-139, 143 (v1.1, fila nueva) | — | — |
| **Total** | **163** | | | |

### 13.5 Fuera de la ola

Honorarios institucionales (O10); BI de personal (O11).

### 13.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Errores en fórmulas de convenio | Fórmulas declarativas versionadas, simulación y comparación con la liquidación externa (paralelo de dos períodos) |
| Datos personales sensibles de empleados | Cifrado de campos, alcance estricto y auditoría de lectura (T08) |
| Cambios normativos de Ganancias | Tablas normativas con vigencia (M06 §5.1, T04) |

### 13.7 Datos demo

M16 §18 (empleados ficticios, convenio de ejemplo).

### 13.8 Pruebas end-to-end de la ola

CU de M16 §17 (liquidación mensual, SAC, vacaciones, egreso); paralelo de dos períodos contra la importación externa.

### 13.9 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O9-01 | Legajo completo, multiempleador y estructura laboral | 36 |
| PRO-O9-02 | Conceptos, fórmulas, novedades, licencias y vacaciones | 30 |
| PRO-O9-03 | Liquidaciones | 19 |
| PRO-O9-04 | Ganancias de 4.ª categoría | 11 |
| PRO-O9-05 | Seguridad social: F.931 y Libro de Sueldos Digital | 8 |
| PRO-O9-06 | Recibos y portal del empleado | 17 |
| PRO-O9-07 | Pago de haberes y contabilización | 22 |
| PRO-O9-08 | Certificaciones, egreso, RRHH, aprobaciones, reportes y paralelo | 20 |
| PRO-O9-09 | Integración de O9: dos períodos en paralelo | 0 (verifica 163) |

#### PRO-O9-01 — Legajo completo, multiempleador y estructura laboral

```text
PRO-O9-01 — Legajo, multiempleador y estructura laboral
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: legajo completo sobre el mínimo de O3, empresas empleadoras por legalEntity, estructura laboral (puestos, categorías, convenios, sectores).
LEER: 01-registro-decisiones.md DEC-058, DEC-064; anexos/M16-SUE-personal-sueldos.md §4, §5.1, §5.2, §5.3, §7, §8, §10, §11, §17, §18; anexos/T08-NFR-no-funcionales-seguridad.md §9.12.
IMPLEMENTAR: RF-SUE-002..036; además (v1.1): RF-CFG-139 (subdocumento `employer` de `legalEntities`, que absorbe `employers` de M16 por CTR-DAT-06).
DECISIONES v1.2 (10-11-2026): DEC-097 (`employees.personId` es obligatorio: el legajo reutiliza o crea la persona de M01 sin duplicar, RF-SUE-004, RN-PER-135); DEC-099 (una persona `documentPending` no puede pasar a `active` hasta regularizar su documento).
ENTREGABLES: employees completo con datos sensibles cifrados; employers; positions y agreements con vigencias.
NO CONSTRUIR TODAVÍA: liquidación.
PRUEBAS: un usuario sin capability de RRHH no ve datos sensibles; el CUIL se valida.
TERMINADO CUANDO: los empleados ficticios de M16 §18 están cargados.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep sue
```

#### PRO-O9-02 — Conceptos, fórmulas, novedades, licencias y vacaciones

```text
PRO-O9-02 — Conceptos, novedades y licencias
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: variables, conceptos y fórmulas de liquidación (evaluador seguro reutilizado de M04), novedades del período con importación, licencias y vacaciones con saldos.
LEER: anexos/M16-SUE-personal-sueldos.md §5.4, §5.5, §5.6.
IMPLEMENTAR: RF-SUE-037..065; además (v1.1): RF-CFG-143 (tablas legales de sueldos de plataforma).
ENTREGABLES: payrollConcepts y formulas versionadas; payrollNews con importación; leaves con saldos y aprobación por T11.
NO CONSTRUIR TODAVÍA: cálculo de la liquidación (PRO-O9-03).
PRUEBAS: una fórmula con ciclo se rechaza; el saldo de vacaciones respeta la antigüedad.
TERMINADO CUANDO: el convenio de ejemplo tiene conceptos y novedades del período.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep payrollConcepts
```

#### PRO-O9-03 — Liquidaciones

```text
PRO-O9-03 — Liquidaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: liquidaciones mensual, quincenal, SAC, vacaciones, final y complementaria, con simulación, aprobación, cierre y reliquidación.
LEER: anexos/M16-SUE-personal-sueldos.md §5.7, §6, §9.
IMPLEMENTAR: RF-SUE-066..084.
ENTREGABLES: payrollRuns como job con estados; cálculo puro por empleado con explicación; payslips; comparación con período anterior.
NO CONSTRUIR TODAVÍA: Ganancias (PRO-O9-04).
PRUEBAS: casos de M16 §17 exactos al centavo; una liquidación cerrada no se edita.
TERMINADO CUANDO: el período ficticio se liquida y aprueba.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep payrollRuns && dotnet test --filter FullyQualifiedName~Worker
```

#### PRO-O9-04 — Ganancias de 4.ª categoría

```text
PRO-O9-04 — Ganancias de 4.ª categoría
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: retención de Ganancias de 4.ª categoría con deducciones (SIRADIG por archivo ficticio), escalas vigentes, ajuste anual y certificados.
LEER: anexos/M16-SUE-personal-sueldos.md §5.8.
IMPLEMENTAR: RF-SUE-085..095.
ENTREGABLES: incomeTaxCalcs con tablas normativas; importación de deducciones; liquidación anual.
NO CONSTRUIR TODAVÍA: nada fuera de M16.
PRUEBAS: casos de Ganancias de M16 §17 exactos; un cambio de escala aplica desde su vigencia.
TERMINADO CUANDO: la retención del período ficticio coincide con la tabla esperada.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep incomeTax
```

#### PRO-O9-05 — Seguridad social: F.931 y Libro de Sueldos Digital

```text
PRO-O9-05 — F.931 y LSD
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: generación de archivos de seguridad social (F.931 / SICOSS) y Libro de Sueldos Digital con validación previa.
LEER: anexos/M16-SUE-personal-sueldos.md §5.9.
IMPLEMENTAR: RF-SUE-096..103.
ENTREGABLES: socialSecurityFiles con formato oficial y validaciones; presentación como archivo descargable (sin envío con credenciales reales).
NO CONSTRUIR TODAVÍA: nada fuera de M16.
PRUEBAS: los archivos validan contra la especificación de formato de M16; totales cuadran con la liquidación.
TERMINADO CUANDO: F.931 y LSD del período ficticio se generan válidos.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep socialSecurity
```

#### PRO-O9-06 — Recibos y portal del empleado

```text
PRO-O9-06 — Recibos y portal del empleado
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: recibos de sueldo con firma del empleador y conformidad del empleado, portal del empleado (recibos, licencias, datos, certificados).
LEER: anexos/M16-SUE-personal-sueldos.md §5.10; anexos/M19-POR-portal-socio-landing.md §5.13 (129..133, 135, 136); anexos/T11-WFL-workflow-eventos-documentos.md §5.14 (197, 202).
IMPLEMENTAR: RF-SUE-104..111; RF-POR-129..133, 135, 136; RF-WFL-197, 202.
ENTREGABLES: recibos PDF firmados; conformidad del empleado con evidencia; secciones del portal del empleado.
NO CONSTRUIR TODAVÍA: nada fuera de M16.
PRUEBAS: un empleado solo ve sus recibos; la conformidad queda registrada con fecha y hash.
TERMINADO CUANDO: un empleado ficticio firma su recibo en la PWA.
VERIFICAR: playwright test --grep @O9-portal
```

#### PRO-O9-07 — Pago de haberes y contabilización

```text
PRO-O9-07 — Pago de haberes y contabilización
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: pago de haberes por acreditación bancaria (archivo y Interbanking simulado), contabilización de la liquidación propia, pagos a terceros (sindicatos, embargos) y retención de Ganancias como agente.
LEER: anexos/M16-SUE-personal-sueldos.md §5.11, §5.12 (117..120); anexos/M14-TES-tesoreria-bancos.md §5.17; anexos/M15-CON-contabilidad.md RF-CON-073, 099, 149; anexos/M12-CMP-compras-proveedores.md RF-CMP-086, 109, 110; anexos/M06-FIS-fiscal-impuestos.md RF-FIS-111.
IMPLEMENTAR: RF-SUE-112..120; RF-TES-160..165; RF-CON-073, 099, 149; RF-CMP-086, 109, 110; RF-FIS-111.
ENTREGABLES: payrollPayments; archivo bancario; asiento de sueldos y cargas; OP a terceros.
NO CONSTRUIR TODAVÍA: nada fuera de M16.
PRUEBAS: el pago no se envía dos veces; el asiento balancea y concilia con la liquidación.
TERMINADO CUANDO: el pago de haberes ficticio queda conciliado y contabilizado.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep payrollPayments
```

#### PRO-O9-08 — Certificaciones, egreso, RRHH, aprobaciones, reportes y paralelo

```text
PRO-O9-08 — Certificaciones, egreso, RRHH y paralelo
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: certificaciones de servicios y remuneraciones, egreso con liquidación final, gestión de RRHH (referencia GLM), aprobaciones, auditoría y reportes, y migración con paralelo frente a la importación externa.
LEER: anexos/M16-SUE-personal-sueldos.md §5.13, §5.14, §5.15, §5.17.
IMPLEMENTAR: RF-SUE-122..139, 145, 146.
ENTREGABLES: certifications PDF; flujo de egreso; capacitaciones y evaluaciones básicas; reportes de M16; comparador de paralelo por empleado y concepto.
NO CONSTRUIR TODAVÍA: BI avanzado de personal (O11).
PRUEBAS: el comparador explica toda diferencia mayor al umbral; un egreso bloquea liquidaciones posteriores.
TERMINADO CUANDO: el comparador de paralelo muestra el período ficticio sin diferencias inexplicadas.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep parallel
```

#### PRO-O9-09 — Integración de O9: dos períodos en paralelo

```text
PRO-O9-09 — Integración de O9
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O9 (sección 13.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §13; anexos/M16-SUE-personal-sueldos.md §17, §18.
IMPLEMENTAR: ningún RF nuevo. Verificar los 163 RF de O9 (versión 1.0: 161).
ENTREGABLES: seed demo O9; e2e @O9 de 13.2; test:isolation.
NO CONSTRUIR TODAVÍA: nada de O10.
PRUEBAS: e2e @O9, test:isolation, k6 de liquidación de 500 empleados ficticios.
TERMINADO CUANDO: criterio 13.2 demostrado con evidencias en docs/evidencias/O9/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O9 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 14. O10 — Institucional, servicios sociales, flota, telefonía, TV, fabricación, turnero

### 14.1 Objetivo

Construir M17 completo (registro de asociados, Libro de Registro de Asociados e INAES, capital social completo, excedentes y retornos, órganos sociales, asambleas y votaciones, honorarios), M18 completo (planes de cobertura, adherentes y beneficiarios completos, prestaciones, sepelio, cementerio parque, banco de sangre, salud, vivienda, otros servicios, flota y GPS), adherentes de M01, telefonía y TV avanzadas, fabricación, mesa de entradas, turnero, tótem, actividades y tareas internas, y los cobros y facturación de terceros asociados.

### 14.2 Criterio de salida (demostrable)

En TEN-001 se convoca una asamblea ordinaria ficticia con padrón generado del registro de asociados, se acreditan asistentes, se vota en forma presencial y remota y se genera el acta; se distribuyen excedentes con su asiento; un adherente del servicio de sepelio recibe una prestación con cobertura; un plan de vivienda factura sus cuotas; un socio saca turno en el tótem y es atendido por el turnero; una línea telefónica se tasa y factura.

### 14.3 Dependencias

O8 completa (O9 para honorarios y legajos).

### 14.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| M17 INS | 81 | RF-INS-005..008, 010..014, 016, 018..028, 032, 033, 039, 047..055, 057..098, 100..103, 106, 108 | PAN-INS-01..33 (*reemplazado, corrección 05-11-2026:* antes PAN-INS-01..35; 33 definidos en el anexo), API-INS-01..70 (*reemplazado, corrección 05-11-2026:* antes API-INS-01..61; 70 definidos en el anexo), EVT-INS-01..21 (*reemplazado, corrección 05-11-2026:* antes EVT-INS-01..16; 21 definidos en el anexo), JOB-INS-01..12 (*reemplazado, corrección 05-11-2026:* antes JOB-INS-01..11; 12 definidos en el anexo) | `associateRegister`, `inaesReports`, `capitalRevaluations`, `surplusDistributions`, `governingBodies`, `mandates`, `meetings`, `rolls`, `votes`, `minutes`, `fees` |
| M18 SOC | 138 | RF-SOC-001..010, 015..025, 027..117, 120..139, 143, 144 (v1.1: se agregan RF-SOC-146, 147, 148, 149) | PAN-SOC-01..35 (*reemplazado, corrección 05-11-2026:* antes PAN-SOC-01..33; 35 definidos en el anexo), API-SOC-01..62 (*reemplazado, corrección 05-11-2026:* antes API-SOC-01..70; 62 definidos en el anexo), EVT-SOC-01..17 (*reemplazado, corrección 05-11-2026:* antes EVT-SOC-01..21; 17 definidos en el anexo), JOB-SOC-01..11 (*reemplazado, corrección 05-11-2026:* antes JOB-SOC-01..12; 11 definidos en el anexo) | `coveragePlans`, `providers`, `benefitRequests`, `funeralServices`, `cemeteryPlots`, `bloodDonations`, `healthServices`, `housingPlans`, `vehicles`, `fuelLoads`, `trips` |
| M09 CRM | 51 | RF-CRM-026, 040, 041, 044, 130..136, 140..157, 179..181, 183, 203, 220..235, 237 | PAN-CRM de mesa de entradas, turnero y actividades | `inboundFiles`, `queuesTickets`, `serviceDesks`, `activities` |
| M10 TEC | 23 | RF-TEC-131, 194, 195, 197..214 (v1.1: se agregan RF-TEC-234, 237) | Telefonía y TV avanzadas | `phoneLines`, `numbering`, `cdrs` |
| M13 STK | 15 | RF-STK-116..129, 133 | Fabricación | `boms`, `productionOrders` |
| M19 POR | 15 | RF-POR-068, 118..120, 161..168 (v1.1: se agregan RF-POR-175, 177, 178) | Turnos y tótem | `kioskDevices` |
| M01 PER | 11 | RF-PER-053, 109..117, 134 | Adherentes y beneficiarios en M01 | — |
| M02 CAT | 8 | RF-CAT-022, 059, 080, 100..103 (v1.1: se agregan RF-CAT-116) | — | — |
| M04 TAR | 11 | RF-TAR-024, 047, 050, 052, 097..099 (v1.1: se agregan RF-TAR-117, 118, 120, 122) | Tasación telefónica | — |
| T11 WFL | 6 | RF-WFL-122, 180, 212, 220..222 | Mesa de entradas | — |
| M15 CON | 7 | RF-CON-076, 098, 120, 134, 152 (v1.1: se agregan RF-CON-025, 075, 161) (v1.1: sale RF-CON-098 por cambio de ola del anexo; reemplazado) | — | — |
| M07 COB | 4 | RF-COB-074, 094, 176, 178 (v1.1: se agregan RF-COB-190) (v1.1: sale RF-COB-176 por cambio de ola del anexo; reemplazado) | — | — |
| M05 FAC | 4 | RF-FAC-056, 124, 125 (v1.1: se agregan RF-FAC-176) | — | — |
| M11 VEN | 2 | RF-VEN-047, 105 | — | — |
| T06 INT | 1 | RF-INT-084 | Agente local | — |
| M06 FIS | 2 | RF-FIS-162, 165 (v1.1, fila nueva) | — | — |
| M08 MOR | 1 | RF-MOR-224 (v1.1, fila nueva) | — | — |
| M12 CMP | 2 | RF-CMP-154, 155 (v1.1, fila nueva) | — | — |
| T07 MIG | 1 | RF-MIG-099 (v1.1, fila nueva) | — | — |
| **Total** | **383** | | | |

Extensiones: RF-BIA-101; RF-CAT-008, 098; RF-TAR-049; RF-CON-065, 025, 075, 150, 151 (capital completo); RF-STK-024. *Reemplazado (corrección 05-11-2026):* RF-CON-025 y 075 no son extensión en O10: empiezan en O10 (PRO-O10-02), como dice el anexo M15; las extensiones de capital en O10 son RF-CON-065, 150 y 151.

### 14.5 Fuera de la ola

BI avanzado, API de terceros y corte (O11).

### 14.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Validez legal de asambleas y votaciones | Padrón congelado, quórum, acreditación y acta con evidencias (M17 §5.6); voto remoto según estatuto como parámetro |
| Diversidad de servicios sociales | Modelo común de plan, cobertura y prestación con fichas de T12 parte2 por servicio |
| Volumen de CDR de telefonía | Ingesta por job y tasación en M04 con particiones |

### 14.7 Datos demo

M17 §18, M18 §18, M09 §18, M10 §18 (telefonía), M13 §18 (fabricación), T12 parte2 (sepelio, cementerio, salud, vivienda) y parte1 §2 y §3 (telefonía, TV; antes citadas en parte2).

### 14.8 Pruebas end-to-end de la ola

CU de M17 §17 (asamblea completa, excedentes); CU de M18 §17 (sepelio, vivienda, flota); CU de M09 §17 (mesa de entradas, turnero); ESC de telefonía y TV de T12 parte1 §2.7 y §3.7 (antes citaba parte2).

### 14.9 Huecos que se resuelven en la ola

HUECO-SEP, CEM, SAN, SAL, VIV, OTR, HUE-TEL, HUE-TV y HUECO-CAP-01..04 en su parte institucional (R9).

### 14.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O10-01 | Registro de asociados completo y Libro de Registro e INAES | 21 |
| PRO-O10-02 | Capital social completo, excedentes y retornos | 29 |
| PRO-O10-03 | Órganos sociales, asambleas, votaciones, actas y honorarios | 41 |
| PRO-O10-04 | Planes de cobertura, prestadores, adherentes y prestaciones | 52 |
| PRO-O10-05 | Sepelio y cementerio parque | 29 |
| PRO-O10-06 | Banco de sangre y salud | 21 |
| PRO-O10-07 | Vivienda y otros servicios | 38 |
| PRO-O10-08 | Flota, combustibles, viajes, rendiciones y GPS | 23 |
| PRO-O10-09 | Telefonía y TV avanzadas | 36 |
| PRO-O10-10 | Fabricación | 17 |
| PRO-O10-11 | Mesa de entradas, turnero y tótem | 40 |
| PRO-O10-12 | Actividades y tareas internas, omnicanal restante | 26 |
| PRO-O10-13 | Facturación y cobranza de terceros restantes | 10 |
| PRO-O10-14 | Integración de O10: asamblea y servicios sociales | 0 (verifica 383) |

#### PRO-O10-01 — Registro de asociados completo y Libro de Registro e INAES

```text
PRO-O10-01 — Registro de asociados e INAES
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar el registro de asociados (categorías, ingreso, egreso, exclusión, readmisión) y el Libro de Registro de Asociados con reportes a INAES.
LEER: anexos/M17-INS-institucional.md §4, §5.1 (005..008, 010..014, 016, 018..020), §5.2, §7, §8, §10, §11, §17, §18.
IMPLEMENTAR: RF-INS-005..008, 010..014, 016, 018..028.

EXTENSIONES: Parte O10 de RF-BIA-104 (v1.2, DEC-096: filtro por entidad jurídica en REP-PER-001, REP-INS-001 a 020 y KPI-INS-01, 02 y 07 sobre `associateMemberships.legalEntityId`; una persona socia de dos entidades aparece una vez por membresía).
DECISIONES v1.2 (10-11-2026): DEC-096 (registro de asociados completo por entidad jurídica sobre `associateMemberships.legalEntityId`; RF-INS-005, 021, 022, 024 y 026).
ENTREGABLES: associateRegister foliado e inmutable; egreso con reintegro de capital pendiente; inaesReports exportables.
NO CONSTRUIR TODAVÍA: asambleas (PRO-O10-03).
PRUEBAS: el libro no admite edición de folios cerrados; un egreso respeta AGR-029.
TERMINADO CUANDO: el libro de asociados ficticio se exporta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep ins
```

#### PRO-O10-02 — Capital social completo, excedentes y retornos

```text
PRO-O10-02 — Capital completo y excedentes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: capital social completo (revalúo, transferencias, reintegros, capitalización), excedentes y retornos con distribución aprobada por asamblea y su contabilización.
LEER: 01-registro-decisiones.md DEC-019, DEC-061; 05-registro-huecos.md HUECO-CAP-01..04; anexos/M17-INS-institucional.md §5.3 (032, 033, 039, 047..055, 057..059), §5.4; anexos/M15-CON-contabilidad.md RF-CON-076, 098, 120, 134, 152.
IMPLEMENTAR: RF-INS-032, 033, 039, 047..055, 057..066; RF-CON-076, 120, 134, 152; además (v1.1): RF-CON-161 (capital fuera del mínimo de O5); RF-CON-025 y RF-CON-075 (vuelven a O10 porque el anexo M15 los mantiene en O10; el mínimo de O5 lo cubren RF-CON-098, 150 y 151, ver §21) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-CON-065, 150, 151 (RF-CON-098 reemplazado en v1.1: pasó a O5, PRO-O5-12; RF-CON-025 y 075 dejan de ser extensión y se implementan aquí).
DECISIONES v1.2 (10-11-2026): DEC-095 y DEC-096 (RF-INS-053 completa el cierre de capital por entidad jurídica, cuya parte mínima, con la base congelada de RF-INS-109, se anticipó en PRO-O8-04; RF-INS-033, 049 y 060 operan por entidad jurídica).
ENTREGABLES: capitalRevaluations; reintegros con límite estatutario; surplusDistributions con cálculo por operatoria y asiento; acreditación como capital o saldo a favor.
NO CONSTRUIR TODAVÍA: nada fuera de M17.
PRUEBAS: la distribución suma exacto el excedente aprobado; el reintegro no supera el límite.
TERMINADO CUANDO: los excedentes ficticios se distribuyen y asientan.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep surplus
```

#### PRO-O10-03 — Órganos sociales, asambleas, votaciones, actas y honorarios

```text
PRO-O10-03 — Órganos, asambleas y honorarios
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: órganos sociales y mandatos, reuniones y asambleas con convocatoria, padrón congelado, acreditación, quórum, votación presencial y remota, actas, honorarios institucionales y relación baja de servicio–egreso.
LEER: anexos/M17-INS-institucional.md §5.5, §5.6, §5.7, §5.8 (100..102), §5.9 (103, 106, 108); anexos/T11-WFL-workflow-eventos-documentos.md RF-WFL-122, 180, 212.
IMPLEMENTAR: RF-INS-067..098, 100..103, 106, 108; RF-WFL-122, 180, 212.
DECISIONES v1.2 (10-11-2026): DEC-096 (órganos, asambleas, votaciones y padrones por entidad jurídica; RF-INS-067, 072, 078, 087 y 092).
ENTREGABLES: governingBodies y mandates; meetings, rolls, votes (secreto configurable) y minutes PDF firmadas; fees liquidados por M16 o por OP.
NO CONSTRUIR TODAVÍA: nada fuera de M17.
PRUEBAS: un asociado fuera del padrón no vota; el voto secreto no es trazable a la persona; sin quórum la asamblea pasa a segunda convocatoria.
TERMINADO CUANDO: la asamblea ficticia de 14.2 se completa con acta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep meetings && playwright test --grep @O10-assembly
```

#### PRO-O10-04 — Planes de cobertura, prestadores, adherentes y prestaciones

```text
PRO-O10-04 — Coberturas, adherentes y prestaciones
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: planes de cobertura y prestadores, adherentes y beneficiarios completos (M18 dueño, M01 referencia; DEC-071), solicitudes de prestación y cobertura.
LEER: 01-registro-decisiones.md DEC-071; anexos/M18-SOC-servicios-sociales-flota.md §4, §5.1, §5.2 (015..025, 027..030), §5.3, §7, §8, §10, §11, §17, §18; anexos/M01-PER-personas-titulares-cuentas.md §5.9, RF-PER-053, 134; anexos/M02-CAT-catalogo-servicios.md RF-CAT-022, 080.
IMPLEMENTAR: RF-SOC-001..010, 015..025, 027..038; RF-PER-053, 109..117, 134; RF-CAT-022, 080; además (v1.1): RF-SOC-146 (aporte del socio impago); RF-SOC-148 (registraciones del contrato, `contractRegistrations`); RF-SOC-149 (importación de adherentes desde archivo); RF-MOR-224 (aviso a M18 de cobertura suspendida por mora, EVT-MOR-21); RF-POR-178 (tarjetas de servicios sociales e institucionales del socio); RF-MIG-099 (plantillas de ExcelImportWizard para dominios que ProCoop no registra en tablas propias).
DECISIONES v1.1: DEC-086 (`BENSOC` solo guarda beneficiarios de un contrato y se migra a `serviceBeneficiaries` de M18; la tarifa social sale de la categoría de M02 y la segmentación de M04).
DECISIONES v1.2 (10-11-2026): DEC-097 (el profesional de salud es un rol de una persona de M01 con `personId` obligatorio y alta asistida, RF-SOC-007).
ENTREGABLES: coveragePlans con carencias y topes; providers con convenios; adherents completos sobre la base de O4; benefitRequests con autorización y liquidación al prestador.
NO CONSTRUIR TODAVÍA: servicios específicos (PRO-O10-05..07).
PRUEBAS: una prestación en carencia se rechaza; los adherentes de O4 siguen facturando igual.
TERMINADO CUANDO: un adherente ficticio solicita una prestación con cobertura.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep soc
```

#### PRO-O10-05 — Sepelio y cementerio parque

```text
PRO-O10-05 — Sepelio y cementerio
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: sepelio y subsidio por fallecimiento, y cementerio parque (parcelas, titularidad, inhumaciones, mantenimiento).
LEER: anexos/M18-SOC-servicios-sociales-flota.md §5.4, §5.5; anexos/T12-SRV-fichas-verticales-servicios-parte2.md (sepelio y cementerio).
IMPLEMENTAR: RF-SOC-039..064; además (v1.1): RF-TAR-117 (estrategia de cargo fijo por derecho de sepultura); RF-FIS-162 (caso fiscal de derechos de sepultura por concepto); RF-POR-177 (buscador público de difuntos en la landing).
ENTREGABLES: funeralServices con orden de servicio y cobertura; cemeteryPlots con mapa y titularidad; cuotas de mantenimiento facturables.
NO CONSTRUIR TODAVÍA: nada fuera de M18.
PRUEBAS: una parcela no se asigna dos veces; el subsidio respeta el plan vigente a la fecha del fallecimiento.
TERMINADO CUANDO: un servicio de sepelio ficticio se cubre y factura el excedente.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep funeral
```

#### PRO-O10-06 — Banco de sangre y salud

```text
PRO-O10-06 — Banco de sangre y salud
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: banco de sangre por convenio y salud (ambulancias, traslados sanitarios, profesionales, internaciones) con datos de salud protegidos.
LEER: anexos/M18-SOC-servicios-sociales-flota.md §5.6, §5.7; anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-101, 102, 104.
IMPLEMENTAR: RF-SOC-065..084; RNF-NFR-101, 102, 104; además (v1.1): RF-SOC-147 (traslado no médico como viaje con característica "no sanitario").
ENTREGABLES: bloodDonations; healthServices con cifrado de datos sensibles de salud y acceso restringido auditado.
NO CONSTRUIR TODAVÍA: nada fuera de M18.
PRUEBAS: un usuario sin capability de salud no lee datos de salud; cada lectura queda auditada.
TERMINADO CUANDO: un traslado sanitario ficticio se registra y liquida.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep health
```

#### PRO-O10-07 — Vivienda y otros servicios

```text
PRO-O10-07 — Vivienda y otros servicios
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: planes de vivienda (adjudicación, cuotas indexadas, obra, escrituración) y otros servicios sociales.
LEER: anexos/M18-SOC-servicios-sociales-flota.md §5.8, §5.9; anexos/M02-CAT-catalogo-servicios.md RF-CAT-059, 100..103.
IMPLEMENTAR: RF-SOC-085..117; RF-CAT-059, 100..103.
ENTREGABLES: housingPlans con adjudicatarios, cuotas indexadas por índice de T04 y facturación; otros servicios con el modelo común.
NO CONSTRUIR TODAVÍA: nada fuera de M18.
PRUEBAS: la cuota indexada coincide con la tabla esperada; una adjudicación requiere aprobación.
TERMINADO CUANDO: un plan de vivienda ficticio factura su cuota.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep housing
```

#### PRO-O10-08 — Flota, combustibles, viajes, rendiciones y GPS

```text
PRO-O10-08 — Flota y GPS
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: flota de vehículos, combustibles, viajes, rendiciones, mantenimiento vehicular, GPS de flota y transversales de M18.
LEER: anexos/M18-SOC-servicios-sociales-flota.md §5.10 (120..138), §5.11 (139, 143, 144).
IMPLEMENTAR: RF-SOC-120..139, 143, 144; además (v1.1): RF-TAR-118 (cargo por evento de traslado alimentado por EVT-SOC-07).
ENTREGABLES: vehicles, fuelLoads, trips con GPS por conector simulado; rendiciones que usan la contabilización de O8.
NO CONSTRUIR TODAVÍA: nada fuera de M18.
PRUEBAS: una carga de combustible duplicada se detecta; la posición GPS respeta retención.
TERMINADO CUANDO: un viaje ficticio se registra con rendición.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep fleet
```

#### PRO-O10-09 — Telefonía y TV avanzadas

```text
PRO-O10-09 — Telefonía y TV
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: telefonía (líneas, numeración, portabilidad, CDR y tasación en M04) y TV avanzada (aprovisionamiento de paquetes), con app de campo para cobrador restante.
LEER: anexos/M10-TEC-tecnica-campo-redes.md RF-TEC-131, §5.15 (194, 195), §5.16; anexos/M04-TAR-tarifas-motor-calculo.md RF-TAR-024, 047, 050, 052, 097..099; anexos/T12-SRV-fichas-verticales-servicios-parte1.md §2 y §3 (telefonía y TV; antes citaba parte2).
IMPLEMENTAR: RF-TEC-131, 194, 195, 197..214; RF-TAR-024, 047, 050, 052, 097..099; además (v1.1): RF-CAT-116 (informe de abonados activos por paquete a una fecha de corte); RF-CMP-154, 155 (contratos y liquidación mensual de derechos de señales de TV, JOB-CMP-09); RF-TEC-234 (portabilidad numérica, por defecto no aplica, PRM-TEC-156); RF-TEC-237 (consulta de llamadas atribuidas por contrato y período); RF-TAR-120 (tasación de llamadas en solo lectura); RF-POR-175 (detalle de llamadas en el portal); RF-TAR-122 (correo electrónico y pack SMS con cupo, DEC-084) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-TAR-049; extensión v1.1 de RF-MOR-222 y RF-TEC-238 (parte O10: suspensión restringida de TEL y TV).
DECISIONES v1.1: DEC-084 (correo electrónico y pack SMS como servicios con aprovisionamiento por T06 y control de cupo y consumo).
ENTREGABLES: phoneLines, numbering y cdrs con ingesta por job; tasación pura en packages/domain; aprovisionamiento de TV.
NO CONSTRUIR TODAVÍA: nada fuera de telefonía y TV.
PRUEBAS: un CDR repetido no se tasa dos veces; la tasación coincide con la tabla esperada.
TERMINADO CUANDO: una línea ficticia se tasa y factura.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cdr && dotnet test --filter FullyQualifiedName~domain
```

#### PRO-O10-10 — Fabricación

```text
PRO-O10-10 — Fabricación
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: fabricación con listas de materiales, órdenes de producción, consumo y producto terminado con costeo, y stock por vivienda.
LEER: anexos/M13-STK-stock-activos-fabricacion.md §5.13, RF-STK-133; anexos/M11-VEN-ventas-presupuestos.md RF-VEN-047, 105.
IMPLEMENTAR: RF-STK-116..129, 133; RF-VEN-047, 105 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-STK-024.
ENTREGABLES: boms versionadas; productionOrders con consumo y alta de producto; costo de fabricación.
NO CONSTRUIR TODAVÍA: nada fuera de M13.
PRUEBAS: una orden de producción consume exacto la lista de materiales; el costo resultante coincide.
TERMINADO CUANDO: una orden de producción ficticia se completa.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep production
```

#### PRO-O10-11 — Mesa de entradas, turnero y tótem

```text
PRO-O10-11 — Mesa de entradas, turnero y tótem
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: mesa de entradas (ingreso y pase de expedientes), atención presencial con turnero, turnos desde el portal, tótem de autogestión presencial y agente local para periféricos.
LEER: anexos/M09-CRM-atencion.md §5.4, §5.5 (140..157); anexos/M19-POR-portal-socio-landing.md §5.11, RF-POR-161, §5.16; anexos/T06-INT-integraciones.md RF-INT-084; anexos/T11-WFL-workflow-eventos-documentos.md §5.16.
IMPLEMENTAR: RF-CRM-130..136, 140..157; RF-POR-118..120, 161..168; RF-INT-084; RF-WFL-220..222.
ENTREGABLES: inboundFiles con pases; serviceDesks y queuesTickets con pantalla de llamados; turnos desde la PWA; kioskDevices con modo kiosco seguro; agente local para impresora de tickets.
NO CONSTRUIR TODAVÍA: nada fuera de estos módulos.
PRUEBAS: el tótem no permite salir del modo kiosco; un turno no se asigna dos veces; un pase de expediente queda auditado.
TERMINADO CUANDO: un socio ficticio saca turno en el tótem y es llamado.
VERIFICAR: playwright test --grep @O10-kiosk
```

#### PRO-O10-12 — Actividades y tareas internas, omnicanal restante

```text
PRO-O10-12 — Actividades y omnicanal restante
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: actividades y tareas internas, expediente y canales restantes del CRM y la IA de actividades.
LEER: anexos/M09-CRM-atencion.md RF-CRM-026, 040, 041, 044, §5.6 (179..181, 183), RF-CRM-203, §5.8 (220..235, 237), RNF-CRM-004, 006.
IMPLEMENTAR: RF-CRM-026, 040, 041, 044, 179..181, 183, 203, 220..235, 237; RNF-CRM-004, 006.
ENTREGABLES: activities con asignación, vencimiento y recordatorios; canales restantes; sugerencias de IA para tareas.
NO CONSTRUIR TODAVÍA: nada fuera de M09.
PRUEBAS: una tarea vencida escala; los canales nuevos respetan consentimientos.
TERMINADO CUANDO: una tarea interna ficticia se asigna, recuerda y cierra.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep activities
```

#### PRO-O10-13 — Facturación y cobranza de terceros restantes

```text
PRO-O10-13 — Facturación y cobranza de terceros
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: facturación de cuotas y de terceros restante, cobranza de terceros, cobrador offline restante y contratación de servicios sociales en el portal.
LEER: anexos/M05-FAC-facturacion.md RF-FAC-056, 124, 125; anexos/M07-COB-cuenta-corriente-cobranza.md RF-COB-074, 094, 176, 178; anexos/M19-POR-portal-socio-landing.md RF-POR-068; anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-258.
IMPLEMENTAR: RF-FAC-056, 124, 125; RF-COB-074, 094, 178 (RF-COB-176 reemplazado en v1.1: pasó a O5, PRO-O5-07); RF-POR-068; RNF-NFR-258; además (v1.1): RF-FAC-176 (clases de ítem depósito en garantía, aporte al fondo de subsidio y derecho de sepultura); RF-FIS-165 (clase fiscal depósito en garantía); RF-COB-190 (devolución del depósito en garantía como crédito a la cuenta).
ENTREGABLES: ítems facturables de M17 y M18; cobros por cuenta de terceros con rendición; contratación de servicios sociales desde la PWA.
NO CONSTRUIR TODAVÍA: nada de O11.
PRUEBAS: un cobro por cuenta de terceros se rinde al tercero exacto.
TERMINADO CUANDO: las cuotas de sepelio y vivienda se facturan y cobran.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep thirdParty
```

#### PRO-O10-14 — Integración de O10: asamblea y servicios sociales

```text
PRO-O10-14 — Integración de O10
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: demostrar el criterio de salida de O10 (sección 14.2 del plan) y cerrar la ola.
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §14; §17 y §18 de M17, M18 y M09; anexos/T12-SRV-fichas-verticales-servicios-parte2.md.
IMPLEMENTAR: ningún RF nuevo. Verificar los 383 RF de O10 (versión 1.0: 360).
ENTREGABLES: seed demo O10; e2e @O10 de 14.2; test:isolation.
NO CONSTRUIR TODAVÍA: nada de O11.
PRUEBAS: e2e @O10, test:isolation, k6 de votación remota con 2.000 asociados ficticios.
TERMINADO CUANDO: criterio 14.2 demostrado con evidencias en docs/evidencias/O10/ y PRO-GEN-02 ejecutado.
VERIFICAR: dotnet run --project tools/SeedDemo && playwright test --grep @O10 && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 15. O11 — BI, APIs de terceros, migración repetible y corte administrativo (DEC-089; antes "migración repetible, paralelo y corte")

### 15.1 Objetivo

Construir el almacén analítico, salas BI y generador de reportes (T10), la API para terceros con claves, cuotas y medición (T10, T01), las pasarelas y billeteras restantes (DEC-015), el modo pasarela fiscal para sistemas externos (M06), la migración repetible con históricos y archivo, el corte comercial de los servicios que sigan en ProCoop y el corte administrativo con rollback y apagado de ProCoop (DEC-068). La corrida paralela, el by-pass y el corte comercial de los servicios medidos de la piloto pasan a O7 (DEC-089; antes: "la corrida paralela con facturación comparada, el by-pass y convivencia, y el corte por etapas (DEC-068: comercial M01–M09 y luego administrativo) con rollback").

### 15.2 Criterio de salida (demostrable)

Sobre una copia anonimizada y ficticia de una base ProCoop de ejemplo: la migración completa con históricos se repite dos veces con el mismo resultado; los servicios que sigan en ProCoop tienen su corte comercial hecho con los ciclos consecutivos de paralelo aprobados (PRM-MIG-041, default 2) y conciliación de saldos; luego el ensayo de corte administrativo cierra con balance conciliado y rollback probado (DEC-089; antes: "una corrida paralela de facturación de un ciclo da diferencias explicadas; el ensayo de corte comercial (M01–M09) termina dentro de la ventana planificada con conciliación de saldos y rollback probado; luego el ensayo de corte administrativo cierra con balance conciliado"). Un tercero ficticio consume la API con su clave y cuota medida.

### 15.3 Dependencias

O0–O10.

### 15.4 Alcance por anexo

| Anexo | RF (n) | RF de la ola | Otros artefactos | Colecciones principales |
|---|---|---|---|---|
| T10 BIA | 37 | RF-BIA-041..045, 060..089, 091, 102 | PAN-BIA de salas y generador; API de terceros | `analyticsStore`, `biRooms`, `reportBuilderDefinitions`, `apiClients`, `apiKeys`, `apiUsage` |
| T07 MIG | 4 (DEC-089; antes 19) | RF-MIG-060, 061, 063, 064 (DEC-089: RF-MIG-006, 070..076, 080..082 y 086..089 pasan a O7) | PAN-MIG de históricos (las de paralelo y corte pasan a O7) | `archives` (`parallelRuns`, `parallelDiffs`, `cutoverPlans`, `cutoverSteps` y `rollbackPlans` pasan a O7) |
| M19 POR | 3 (DEC-089; antes 5) | RF-POR-159, 171, 172 (RF-POR-020 y 127 pasan a O7) | — | — |
| M06 FIS | 4 (DEC-089; antes 5) | RF-FIS-154..156, 158 (RF-FIS-163, agregado en v1.1, pasa a O7) | Modo pasarela fiscal | `gatewayClients` |
| M09 CRM | 3 | RF-CRM-125, 254, 257 | — | — |
| T11 WFL | 3 | RF-WFL-012, 014, 163 | — | — |
| T01 PLA | 2 | RF-PLA-083, 153 | Medición de API y actualizaciones | — |
| M04 TAR | 0 (DEC-089; antes 2) | — (RF-TAR-101, 102 pasan a O7) | — | — |
| M12 CMP | 2 | RF-CMP-130, 131 | — | — |
| M15 CON | 1 (*reemplazado, corrección 05-11-2026:* antes 2) | RF-CON-158 (antes RF-CON-158, 160; RF-CON-160 empieza en O5, §18) | — | — |
| T02 IAM | 1 | RF-IAM-144 | Auditoría de plataforma completa | — |
| T04 CFG | 0 (DEC-089; antes 2) | — (RF-CFG-132 y RF-CFG-142 pasan a O7) | — | — |
| T09 COM | 1 | RF-COM-094 | — | — |
| M05 FAC | 1 | RF-FAC-169 | — | — |
| M07 COB | 0 (DEC-089; antes 1) | — (RF-COB-155 pasa a O7) | — | — |
| M08 MOR | 0 (DEC-089; antes 1) | — (RF-MOR-219 pasa a O7) | — | — |
| M10 TEC | 1 | RF-TEC-230 | — | — |
| M11 VEN | 1 | RF-VEN-103 | — | — |
| M13 STK | 1 | RF-STK-043 | — | — |
| **Total** | **65** (*reemplazado, DEC-089:* antes 89, y antes 90 hasta la corrección 05-11-2026) | | | |

Extensiones: RF-UXD-096 (salas BI); RF-INT-023; RF-COM-090; RF-CAT-113; RF-MOR-218; RF-CON-123; RF-CON-160 (migración repetible completa, corrección 05-11-2026); RF-STK-136; RNF-NFR-016; RF-COB-132 y RF-FAC-146 (pasarelas y billeteras restantes, DEC-015).

### 15.5 Fuera de la ola

Nada: es la última ola. Lo que quede como `Parcial` debe tener PA o hueco registrado.

### 15.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| Migración no repetible | Corridas idempotentes con mapa de IDs (O0, O1) y comparación de dos corridas consecutivas |
| Diferencias de facturación en paralelo | Comparador por cuenta y concepto con umbral y explicación obligatoria (T07 §5.8) |
| Corte fuera de ventana | Ensayos cronometrados, plan de corte con pasos y responsables, rollback probado (T07 §5.9) |
| Datos reales en ambientes de prueba | Solo bases anonimizadas o ficticias (R13, RF-MIG-095..097) |

### 15.7 Datos demo

T07 §18 (base ProCoop ficticia de ejemplo), T10 §18 (cliente de API ficticio).

### 15.8 Pruebas end-to-end de la ola

ESC de T07 §17 (dos corridas idénticas, paralelo, corte y rollback); ESC de T10 §17 (salas BI, API de terceros con cuota).

### 15.9 Huecos que se resuelven en la ola

HUECO-TRV-05 y los de migración: HUECO-OBR-04, OBR-05, CEM-03, SAL-02, TAS-03, CAP-03, VIV-03 y OTR-01 (R9).

### 15.10 Secuencia de prompts

| ID | Título | RF |
|---|---|---|
| PRO-O11-01 | Almacén analítico y modelo dimensional | 12 |
| PRO-O11-02 | Generador de reportes y salas BI | 9 |
| PRO-O11-03 | API para terceros, medición y tableros avanzados | 26 |
| PRO-O11-04 | Pasarelas y billeteras restantes (DEC-015) | 0 (extensiones) |
| PRO-O11-05 | Modo pasarela fiscal, IA de compras y auditoría de plataforma | 9 |
| PRO-O11-06 | Migración por dominio: históricos y equivalencias | 9 (*reemplazado, DEC-089:* antes 18; RF-MIG-006, RF-CFG-132, 142, RF-TAR-101, 102, RF-FIS-163, RF-COB-155, RF-POR-020 y 127 pasan a PRO-O7-11 y PRO-O7-12; *corrección 05-11-2026:* antes 19, RF-CON-160 pasa a PRO-O5-11 y queda como extensión) |
| PRO-O11-07 | *Reemplazado por PRO-O7-11 (DEC-089)*: corrida paralela y facturación comparada | 0 (antes 8) |
| PRO-O11-08 | *Reemplazado por PRO-O7-12 (DEC-089)*: by-pass, convivencia, corte por etapas y rollback (DEC-068) | 0 (antes 7) |
| PRO-O11-09 | Ensayo de corte comercial de los servicios que sigan en ProCoop (DEC-089; antes "Ensayo de corte comercial (M01–M09)") | 0 |
| PRO-O11-10 | Ensayo de corte administrativo y cierre del plan | 0 (verifica 65 y 4.213; v1.2: antes 4.204; *reemplazado, DEC-089:* antes 89; *corrección 05-11-2026:* antes 90; cierre 05-11-2026: antes 4.203) |

*PRO-O11-07 y PRO-O11-08 se conservan como reemplazados: no se ejecutan y no se ejecutan (O11 queda con **8 prompts efectivos**; plan tiene **174** bloques PRO-O).*

#### PRO-O11-01 — Almacén analítico y modelo dimensional

```text
PRO-O11-01 — Almacén analítico
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: almacén analítico por tenant alimentado por eventos y jobs incrementales, con modelo dimensional y conservación fiscal.
LEER: anexos/T10-BIA-reportes-bi-apis.md §5 (RF-BIA-060..069), §7, §12; anexos/M06-FIS-fiscal-impuestos.md RF-FIS-158; anexos/M09-CRM-atencion.md RF-CRM-257.
IMPLEMENTAR: RF-BIA-060..069; RF-FIS-158; RF-CRM-257.

EXTENSIONES: Parte O11 de RF-BIA-104 (v1.2, DEC-096: `bi_fact_member`, `bi_dim_costCenter`, `bi_fact_journalLine` y `bi_fact_payroll` con la entidad jurídica; API-BIA-113 `/members` con el parámetro `legalEntityCode` se publica con la API de terceros de PRO-O11-03).
ENTREGABLES: analyticsStore con hechos y dimensiones; ETL incremental idempotente; aislamiento por tenant en el almacén.
NO CONSTRUIR TODAVÍA: salas BI (PRO-O11-02).
PRUEBAS: una recarga incremental no duplica hechos; un tenant no consulta hechos de otro.
TERMINADO CUANDO: los hechos de facturación y cobranza de TEN-001 están en el almacén.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep analytics && dotnet test --filter Category=Isolation
```

#### PRO-O11-02 — Generador de reportes y salas BI

```text
PRO-O11-02 — Generador de reportes y salas BI
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: generador de reportes para usuarios avanzados sobre el almacén, salas BI con tableros compartidos y administración del portal con indicadores.
LEER: anexos/T10-BIA-reportes-bi-apis.md RF-BIA-041..045, 089, 091, 102; anexos/M19-POR-portal-socio-landing.md RF-POR-159.
IMPLEMENTAR: RF-BIA-041..045, 089, 091, 102; RF-POR-159; RNF-NFR-106 (DEC-089: antes en PRO-O11-08) (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-UXD-096.
ENTREGABLES: reportBuilderDefinitions con campos permitidos por capability y sensibilidad; biRooms.
NO CONSTRUIR TODAVÍA: API de terceros (PRO-O11-03).
PRUEBAS: un usuario no agrega campos sensibles sin permiso; un tablero compartido respeta el alcance del que lo ve.
TERMINADO CUANDO: una sala BI ficticia muestra recaudación y mora.
VERIFICAR: playwright test --grep @O11-bi
```

#### PRO-O11-03 — API para terceros, medición y tableros avanzados

```text
PRO-O11-03 — API para terceros
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: API pública versionada para terceros con clientes, claves, alcances, cuotas, medición facturable (RF-PLA-083) y documentación; tableros avanzados y los RF restantes de varios módulos que dependen de ella.
LEER: anexos/T10-BIA-reportes-bi-apis.md RF-BIA-070..088; anexos/T01-PLA-plataforma-saas.md RF-PLA-083, 153; anexos/T11-WFL-workflow-eventos-documentos.md RF-WFL-014; RF-FAC-169, RF-TEC-230, RF-STK-043, RF-COM-094 en sus anexos; anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-175..177.
IMPLEMENTAR: RF-BIA-070..088; RF-PLA-083, 153; RF-WFL-014; RF-FAC-169; RF-TEC-230; RF-STK-043; RF-COM-094; RNF-NFR-175..177; RNF-NFR-019 (DEC-089: antes en PRO-O11-07).
ENTREGABLES: apiClients y apiKeys (hash, nunca en claro); rate limit y cuota por cliente; apiUsage para el contrato SaaS; webhooks salientes; OpenAPI pública.
NO CONSTRUIR TODAVÍA: modo pasarela fiscal (PRO-O11-05).
PRUEBAS: una clave revocada se rechaza; superar la cuota responde 429 con RFC 9457; el uso se mide por cliente.
TERMINADO CUANDO: un cliente ficticio consume la API con su clave y cuota medida.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep apiClients && k6 run infra/k6/public-api.js
```

#### PRO-O11-04 — Pasarelas y billeteras restantes (DEC-015)

```text
PRO-O11-04 — Pasarelas y billeteras restantes
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: agregar las pasarelas y billeteras de DEC-015 que no entraron en O5 (por ejemplo las que M07 §5.10 RF-COB-132 indica como posteriores) sobre el punto de extensión de PRO-O5-06.
LEER: 01-registro-decisiones.md DEC-015; anexos/M07-COB-cuenta-corriente-cobranza.md §5.10 (RF-COB-132); anexos/M05-FAC-facturacion.md RF-FAC-146; anexos/T06-INT-integraciones.md (fichas de pasarelas).
IMPLEMENTAR: ningún RF nuevo (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES).
EXTENSIONES: extensión O11 de RF-COB-132 y RF-FAC-146.
ENTREGABLES: un adaptador por proveedor en modo test con simulador; QR de billeteras restantes en factura; conciliación diaria.
NO CONSTRUIR TODAVÍA: nada fuera de pasarelas.
PRUEBAS: las mismas pruebas de PRO-O5-06 (firma, duplicados, conciliación) por cada adaptador nuevo.
TERMINADO CUANDO: cada pasarela nueva acredita un pago ficticio de punta a punta.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep gateways
```

#### PRO-O11-05 — Modo pasarela fiscal, IA de compras y auditoría de plataforma

```text
PRO-O11-05 — Modo pasarela fiscal y auditoría de plataforma
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: autorización fiscal ARCA para sistemas externos (modo pasarela), importación de Mis Comprobantes con IA avanzada, sistema contable externo restante, POS restante, auditoría completa de plataforma y eventos restantes.
LEER: anexos/M06-FIS-fiscal-impuestos.md §5.17 (154..156); anexos/M12-CMP-compras-proveedores.md RF-CMP-130, 131; anexos/M15-CON-contabilidad.md RF-CON-158; anexos/M11-VEN-ventas-presupuestos.md RF-VEN-103; anexos/T02-IAM-identidad-roles-auditoria.md RF-IAM-144; anexos/T11-WFL-workflow-eventos-documentos.md RF-WFL-012.
IMPLEMENTAR: RF-FIS-154..156; RF-CMP-130, 131; RF-CON-158; RF-VEN-103; RF-IAM-144; RF-WFL-012 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensión de RF-CON-123 y RF-INT-023.
ENTREGABLES: gatewayClients que piden CAE por API con su propia legalEntity; IA de compras que propone imputaciones; auditoría de plataforma consultable por tenant.
NO CONSTRUIR TODAVÍA: nada fuera de lo listado.
PRUEBAS: un cliente de pasarela no usa el certificado de otro; la IA de compras nunca confirma sola.
TERMINADO CUANDO: un sistema externo ficticio obtiene CAE en homologación por la pasarela.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep fiscalGateway
```

#### PRO-O11-06 — Migración por dominio: históricos y equivalencias

```text
PRO-O11-06 — Migración por dominio e históricos
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: completar la migración por dominio (cada módulo con su mapeo), históricos y archivo consultable, equivalencias de configuración y los RF de migración de otros módulos.
LEER: anexos/T07-MIG-migracion-procoop.md §5.1 (006), §5.7 (060, 061, 063, 064); anexos/T04-CFG-configuracion-parametros-maestros.md RF-CFG-132; RF-TAR-101, 102; RF-CON-160; RF-COB-155; RF-CRM-125, 254; RF-POR-020, 127, 171, 172; RF-WFL-163 en sus anexos; 05-registro-huecos.md HUECO-OBR-04, OBR-05, CEM-03, SAL-02, TAS-03, CAP-03, VIV-03, OTR-01.
IMPLEMENTAR: RF-MIG-060 [REASIGNADO "por dominio", ver §18], 061, 063, 064; RF-CRM-125, 254 [REASIGNADO, ver §18]; RF-POR-171, 172; RF-WFL-163.
ANTES (reemplazado por DEC-089, que no es lista de implementación): también RF-MIG-006; RF-CFG-132; RF-TAR-101, 102; RF-COB-155; RF-POR-020, 127; RF-CFG-142 y RF-FIS-163 (v1.1), que pasan a PRO-O7-11 y PRO-O7-12 porque el corte comercial de la piloto ocurre al cerrar O7 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt).
EXTENSIONES: extensiones de RF-CAT-113, RF-MOR-218, RF-STK-136, RF-COM-090; extensión O11 de RF-CON-160 (migración repetible completa de plan, rubros, ejercicios, asientos, centros, reglas y parámetros-cuenta; *reemplazado (corrección 05-11-2026):* antes RF-CON-160 se implementaba aquí; empieza en PRO-O5-11 con los saldos de apertura, ver §18).
DECISIONES v1.1: DEC-086 (`BENSOC` a `serviceBeneficiaries` de M18) y DEC-087 (detalle histórico de más de 36 meses a archivo con consulta diferida).
DECISIONES v1.2 (10-11-2026): DEC-098, DEC-099 y DEC-103 (la migración repetible de históricos aplica el origen de las sucursales en `PTOVENTA.SUC_COM`, el estado `documentPending` para personas sin documento y el escaneo previo de secretos y tarjetas que bloquea la corrida); DEC-104 (correcciones sin cambio de alcance: destino único de `USERS_AREA` y de `RESPONSA`, técnicos de campo, y cantidades de columnas de `PROD_SER`, 90, y `TIPO_FAC`, 57).
ENTREGABLES: mapeos de todos los dominios; archives de solo lectura con búsqueda; migración repetible contable completa (extensión de RF-CON-160, cuyos saldos de apertura se construyen en PRO-O5-11) conciliada.
NO CONSTRUIR TODAVÍA: corte administrativo (PRO-O11-10) (DEC-089; antes "paralelo (PRO-O11-07)", que pasa a PRO-O7-11).
PRUEBAS: dos corridas consecutivas producen el mismo resultado (hash por colección); los históricos no son editables.
TERMINADO CUANDO: la base ficticia migra completa dos veces con resultado idéntico.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep mig
```

#### PRO-O11-07 — Corrida paralela y facturación comparada (*reemplazado por PRO-O7-11, DEC-089*)

*No se ejecuta. Se conserva como referencia: el corte comercial de la piloto ocurre al cerrar O7, así que su contenido pasa a PRO-O7-11; RNF-NFR-019 pasa a PRO-O11-03 y RNF-NFR-154 a PRO-O7-11.*

```text
PRO-O11-07 — Corrida paralela (REEMPLAZADO por PRO-O7-11, DEC-089)
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: corrida paralela de facturación y cobranza frente a ProCoop (datos ficticios) con comparación por cuenta y concepto, y la parte de mora de migración.
LEER: anexos/T07-MIG-migracion-procoop.md §5.8; anexos/M08-MOR-mora-financiacion.md RF-MOR-219; anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-019, 154.
IMPLEMENTAR: ninguno (DEC-089).
ANTES (no es lista de implementación): RF-MIG-070..076; RF-MOR-219; RNF-NFR-019, 154 (corrección 05-11-2026: las extensiones pasan a la línea EXTENSIONES y no se cuentan en este prompt); extensión de RNF-NFR-016.
ENTREGABLES: parallelRuns y parallelDiffs con umbral, clasificación y explicación obligatoria; reporte de paralelo.
NO CONSTRUIR TODAVÍA: corte (PRO-O11-08).
PRUEBAS: toda diferencia mayor al umbral exige explicación antes de aprobar el paralelo.
TERMINADO CUANDO: un ciclo ficticio en paralelo queda aprobado.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep parallel
```

#### PRO-O11-08 — By-pass, convivencia, corte por etapas y rollback (DEC-068) (*reemplazado por PRO-O7-12, DEC-089*)

*No se ejecuta. Se conserva como referencia: su contenido pasa a PRO-O7-12; RNF-NFR-106 pasa a PRO-O11-02 y RNF-NFR-046 a PRO-O11-10.*

```text
PRO-O11-08 — Corte por etapas y rollback (REEMPLAZADO por PRO-O7-12, DEC-089)
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: by-pass y convivencia con ProCoop, plan de corte por etapas (comercial M01–M09 y luego administrativo, DEC-068), congelamiento, carga delta, verificación y rollback.
LEER: 01-registro-decisiones.md DEC-068, DEC-069; anexos/T07-MIG-migracion-procoop.md §5.9 (080..082, 086..089); anexos/T08-NFR-no-funcionales-seguridad.md RNF-NFR-046, 106.
IMPLEMENTAR: ninguno (DEC-089).
ANTES (no es lista de implementación): RF-MIG-080..082, 086..089; RNF-NFR-046, 106.
ENTREGABLES: cutoverPlans con etapas, pasos, responsables y tiempos; cutoverSteps con evidencia; rollbackPlans probados.
NO CONSTRUIR TODAVÍA: nada fuera de T07.
PRUEBAS: el rollback restituye el estado previo sin efectos externos duplicados; un paso fallido detiene el plan.
TERMINADO CUANDO: el plan de corte ficticio se ejecuta en sandbox con rollback.
VERIFICAR: dotnet test --filter FullyQualifiedName~Api -- --grep cutover
```

#### PRO-O11-09 — Ensayo de corte comercial (M01–M09)

```text
PRO-O11-09 — Ensayo de corte comercial
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ensayo cronometrado del corte comercial de los servicios que sigan en ProCoop sobre la base ficticia en sandbox, con conciliación de saldos, servicios, deuda y convenios, y rollback (DEC-089: electricidad, gas y prepago de la piloto ya se cortaron al cerrar O7 con PRO-O7-12; antes "del corte comercial (M01–M09)").
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §15; anexos/T07-MIG-migracion-procoop.md §5.9, §17.
IMPLEMENTAR: ningún RF nuevo.
ENTREGABLES: informe de ensayo con tiempos por paso, conciliaciones y rollback en docs/evidencias/O11/corte-comercial/.
NO CONSTRUIR TODAVÍA: corte administrativo.
PRUEBAS: e2e @piloto-internet sobre los datos migrados; conciliación de saldos al centavo.
TERMINADO CUANDO: el ensayo termina dentro de la ventana planificada y el rollback funciona.
VERIFICAR: playwright test --grep "@O11-cutover-commercial|@piloto-internet"
```

#### PRO-O11-10 — Ensayo de corte administrativo y cierre del plan

```text
PRO-O11-10 — Ensayo de corte administrativo y cierre
NORMA: 03-norma-ejecucion-goodapps.md §3–§4 (stack GoodApps; barrido 19-11-2026).
Aplicá R1–R20 de docs/especificacion/03-plan-de-olas-y-prompts.md §2.
OBJETIVO: ensayo del corte administrativo (M11–M16) con balance conciliado, y verificación final de los 4.213 RF y 293 RNF del plan (antes 4.204 y 292, v1.2; antes 4.203; versión 1.0: 4.120).
LEER: docs/especificacion/03-plan-de-olas-y-prompts.md §15, §16, §17; docs/especificacion/04-matriz-trazabilidad.md.
IMPLEMENTAR: RNF-NFR-046 (simulacro de recuperación ante desastre; DEC-089: antes en PRO-O11-08); ningún RF nuevo. Verificar los 65 RF de O11 (*reemplazado, DEC-089:* antes 89; versión 1.0: 88; *corrección 05-11-2026:* antes 90, RF-CON-160 pasa a O5) y que la matriz no tenga RF sin estado.
ENTREGABLES: informe de ensayo administrativo; reporte final de trace:check sin faltantes; lista de Parcial con PA o hueco que los justifica.
NO CONSTRUIR TODAVÍA: no aplica.
PRUEBAS: e2e de todas las olas, test:isolation, k6 completo.
TERMINADO CUANDO: criterio 15.2 demostrado y PRO-GEN-02 ejecutado para O11.
VERIFICAR: playwright test && dotnet test --filter Category=Isolation && python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 16. Matriz ola × anexo (cantidad de RF)

Cada celda es la cantidad de RF del anexo que **empiezan** en la ola (regla §0.1). "—" es cero.

| Anexo | O0 | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T01 PLA | 52 | 107 | 2 | — | — | 2 | — | — | — | — | — | 2 | 165 |
| T02 IAM | 29 | 63 | — | — | — | — | — | — | — | — | — | 1 | 93 |
| T03 UXD | 125 | 36 | 13 | 2 | 2 | — | 1 | — | — | — | — | — | 179 |
| T04 CFG | 16 | 89 | 21 | — | 6 | 6 | — | 3 | — | 2 | — | — | 143 |
| T06 INT | 28 | 25 | 3 | — | 11 | 18 | — | — | — | — | 1 | — | 86 |
| T07 MIG | 7 | 32 | 8 | 1 | 3 | 7 | — | 15 | — | — | 1 | 4 | 78 |
| T08 NFR | 4 | 19 | 2 | — | — | — | — | — | — | — | — | — | 25 |
| T09 COM | 8 | 3 | 126 | 10 | 4 | — | 5 | — | — | — | — | 1 | 157 |
| T10 BIA | — | 35 | 22 | 1 | 3 | 4 | — | 1 | 1 | — | — | 37 | 104 |
| T11 WFL | 36 | 50 | 40 | 5 | 11 | — | — | 1 | 3 | 2 | 6 | 3 | 157 |
| M01 PER | — | — | 144 | 3 | 8 | 5 | 2 | 2 | — | — | 11 | — | 175 |
| M02 CAT | — | — | 77 | 8 | 9 | — | 4 | 11 | — | — | 8 | — | 117 |
| M03 MED | — | — | — | — | — | — | — | 128 | 1 | — | — | — | 129 |
| M04 TAR | — | — | — | 1 | 79 | — | — | 31 | — | — | 11 | — | 122 |
| M05 FAC | — | — | — | — | 150 | 10 | 1 | 10 | 3 | — | 4 | 1 | 179 |
| M06 FIS | — | — | — | — | 91 | 11 | 2 | 15 | 43 | 1 | 2 | 4 | 169 |
| M07 COB | — | — | — | — | — | 186 | — | 4 | 1 | — | 4 | — | 195 |
| M08 MOR | — | — | — | — | 4 | 31 | 176 | 8 | 4 | — | 1 | — | 224 |
| M09 CRM | — | — | 49 | 53 | 1 | — | 32 | 5 | — | — | 51 | 3 | 194 |
| M10 TEC | — | — | — | 151 | 2 | — | 7 | 53 | 2 | — | 23 | 1 | 239 |
| M11 VEN | — | — | — | — | 22 | — | 1 | 1 | 67 | — | 2 | 1 | 94 |
| M12 CMP | — | — | — | 2 | — | — | — | — | 106 | 3 | 2 | 2 | 115 |
| M13 STK | — | — | 2 | 71 | 1 | — | 1 | — | 48 | — | 15 | 1 | 139 |
| M14 TES | — | — | — | — | — | 71 | — | — | 111 | 6 | — | — | 188 |
| M15 CON | — | — | — | 1 | — | 85 | 1 | — | 65 | 3 | 7 | 1 | 163 |
| M16 SUE | — | — | — | 1 | — | — | — | — | 6 | 139 | — | — | 146 |
| M17 INS | — | — | 11 | — | — | 15 | 1 | — | 1 | — | 81 | — | 109 |
| M18 SOC | — | — | — | — | 9 | — | — | — | 2 | — | 138 | — | 149 |
| M19 POR | — | — | 97 | 9 | 9 | 19 | 10 | 10 | 1 | 7 | 15 | 3 | 180 |
| **Total RF** | **305** | **459** | **617** | **319** | **425** | **470** | **244** | **298** | **465** | **163** | **383** | **65** | **4.213** |
| RNF | 144 | 73 | 15 | 9 | 23 | 13 | 2 | 1 | 1 | 0 | 6 | 6 | 293 |
| Prompts | 21 | 20 | 19 | 13 | 16 | 14 | 11 | 12 | 15 | 9 | 14 | 8 | 172 |

*Reemplazado (DEC-089, 05-11-2026): en las columnas O7 y O11 había T04 1 y 2, T07 0 y 19, M04 29 y 2, M06 14 y 5, M07 3 y 1, M08 7 y 1, M19 8 y 5; Total RF 274 y 89; RNF 0 y 7; Prompts 10 y 10.*

*Reemplazado (versión 1.0): fila Total RF 299, 457, 607, 315, 419, 463, 241, 256, 454, 161, 360, 88; total 4.120.* La matriz de v1.1 se recalculó por script leyendo las tablas de RF de los anexos y las líneas IMPLEMENTAR de este plan. *Reemplazado (corrección 05-11-2026): M15 CON O5 84 y O11 2; Total RF O5 468 y O11 90 (RF-CON-160 pasa a O5, §18).* Recalculada con `_trabajo/plan_recuento.py`; las filas RNF y Prompts no cambian. *Reemplazado (cierre de la corrección de inconsistencias del 05-11-2026): M19 POR O2 96 y total 179; Total RF O2 613 y total 4.203 (RF-POR-180, §21.6).* *Reemplazado (versión 1.2, 10-11-2026): T10 BIA O1 34 y total 103; M01 PER O2 142 y 173; M02 CAT O4 8 y 116; M06 FIS O8 42 y 168; M07 COB O5 185 y 194; M09 CRM O2 48 y 193; M15 CON O8 64 y 162; M17 INS O8 — y 108; Total RF O1 458, O2 614, O4 424, O5 469, O8 462 y total 4.204; RNF O1 72 y total 292 (§22).*

T05-DAT y T12-SRV no tienen tabla de RF propia: T05 es el modelo de datos que todos los prompts consultan para colecciones e índices, y T12 aporta fichas, escenarios ESC-SRV y precargas que citan los prompts de integración. Los **174** bloques `PRO-O*` incluyen dos reemplazados no ejecutables (PRO-O11-07/08); **172 ejecutables**. Los PRO-GEN están en `03-norma` (4) y §3.

---

## 17. Control de cobertura de RF y RNF

### 17.1 RF

"RF en el anexo" son los IDs únicos `RF-<COD>-NNN` de la tabla de la sección 5 de cada anexo. "Asignados" son los RF que algún prompt lista en "Implementar" (cada RF una sola vez, en la ola donde empieza). Las extensiones de olas siguientes no se cuentan de nuevo.

| Anexo | RF en el anexo | Asignados a una ola y un prompt | Faltantes | Reasignados (§18) |
|---|---|---|---|---|
| T01 PLA | 165 | 165 | 0 | 0 |
| T02 IAM | 93 | 93 | 0 | 1 (RF-IAM-133, multi-ola) |
| T03 UXD | 179 | 179 | 0 | 3 (RF-UXD-139, 163, 171; desde el cierre 05-11-2026 la celda de RF-UXD-163 en T03 ya dice `O6 (DEC-056)` y coincide con el prompt) |
| T04 CFG | 143 | 143 | 0 | 0 |
| T06 INT | 86 | 86 | 0 | 0 |
| T07 MIG | 78 | 78 | 0 | 1 (RF-MIG-060) |
| T08 NFR | 25 | 25 | 0 | 0 |
| T09 COM | 157 | 157 | 0 | 1 (RF-COM-180) |
| T10 BIA | 104 (antes 103) | 104 (antes 103) | 0 | 0 |
| T11 WFL | 157 | 157 | 0 | 0 |
| M01 PER | 175 (antes 173) | 175 (antes 173) | 0 | 0 |
| M02 CAT | 117 (antes 116) | 117 (antes 116) | 0 | 1 (RF-CAT-010) |
| M03 MED | 129 | 129 | 0 | 0 |
| M04 TAR | 122 | 122 | 0 | 0 |
| M05 FAC | 179 | 179 | 0 | 0 |
| M06 FIS | 169 (antes 168) | 169 (antes 168) | 0 | 0 |
| M07 COB | 195 (antes 194) | 195 (antes 194) | 0 | 0 |
| M08 MOR | 224 | 224 | 0 | 0 |
| M09 CRM | 194 (antes 193) | 194 (antes 193) | 0 | 1 (RF-CRM-254) |
| M10 TEC | 239 | 239 | 0 | 0 |
| M11 VEN | 94 | 94 | 0 | 1 (RF-VEN-106) |
| M12 CMP | 115 | 115 | 0 | 0 |
| M13 STK | 139 | 139 | 0 | 3 (RF-STK-024, 040, 136) |
| M14 TES | 188 | 188 | 0 | 1 (RF-TES-128) |
| M15 CON | 163 (antes 162) | 163 (antes 162) | 0 | 3 (RF-CON-150, 151; el anexo ya los pone en O5; RF-CON-160 a O5 por la regla §0.1, corrección 05-11-2026). RF-CON-025 y 075 dejan de estar reasignados en v1.1 (vuelven a O10 como dice el anexo) |
| M16 SUE | 146 | 146 | 0 | 0 |
| M17 INS | 109 (antes 108) | 109 (antes 108) | 0 | 0 |
| M18 SOC | 149 | 149 | 0 | 0 |
| M19 POR | 180 (antes 179) | 180 (antes 179) | 0 | 0 |
| **Total** | **4.213** (antes 4.204 y 4.203) | **4.213** (antes 4.204 y 4.203) | **0** | **16** (*reemplazado, corrección 05-11-2026:* antes 15) |

### 17.2 RNF

| Anexo | RNF en el anexo | O0 | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | Faltantes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T01 PLA | 15 | 11 | 3 | — | 1 | — | — | — | — | — | — | — | — | 0 |
| T04 CFG | 8 | — | 7 | — | — | 1 | — | — | — | — | — | — | — | 0 |
| T08 NFR | 259 | 130 | 62 | 12 | 8 | 21 | 13 | 1 | 1 | 1 | — | 4 | 6 | 0 |
| T11 WFL | 5 | 3 | 1 | — | — | 1 | — | — | — | — | — | — | — | 0 |
| M09 CRM | 6 | — | — | 3 | — | — | — | 1 | — | — | — | 2 | — | 0 |
| **Total** | **293** | **144** | **73** | **15** | **9** | **23** | **13** | **2** | **1** | **1** | **0** | **6** | **6** | **0** |

*Reemplazado (versión 1.2, 10-11-2026): T08 NFR 258 RNF con O1 61, O7 — y O11 7; Total 292 con O1 72, O7 0 y O11 7. Se suma RNF-NFR-260 en O1 (PRO-O1-15, DEC-100) y se corrigen las columnas O7 y O11, que no se habían actualizado con DEC-089 (RNF-NFR-154 pasó de O11 a O7, PRO-O7-11; §21.7).*

Un RNF reasignado: RNF-NFR-100 no tenía ola y va a O2 (§18). Recuento del 05-11-2026 por script: los 292 RNF tienen ola en su anexo y cada uno está en la línea `IMPLEMENTAR` de un solo prompt de esa ola (la cita de RNF-NFR-016 en PRO-O11-07 es extensión y pasó a la línea `EXTENSIONES`). Los RNF transversales de T08 que aplican a todo el sistema (rendimiento, disponibilidad, accesibilidad, seguridad) se asignan a la ola donde se construye el mecanismo que los cumple y se verifican de nuevo en cada prompt de integración.

### 17.3 Cómo se recalcula

En **PRO-O0-02** se crea el control de trazabilidad en CI (objetivo: mismo comportamiento que el histórico `trace:check` Connectia), que recorre tablas de RF/RNF, este plan y pruebas .NET/Playwright, y falla ante: (1) RF/RNF sin prompt; (2) doble `IMPLEMENTAR`; (3) ID inexistente; (4) RF de ola cerrada sin prueba citada. Mientras no exista el script en el repo GoodApps, el control documental se hace con `docs/especificacion/_trabajo/plan_recuento.py` (solo lectura): recuento por ola, prompt y anexo; faltantes, duplicados, IDs inexistentes y celdas de ola inconsistentes.

---

## 18. RF con ola ausente, inválida o reasignada

Todos se marcan `[REASIGNADO]` en la matriz de trazabilidad con el fundamento de esta tabla.

| ID | Ola en el anexo | Ola asignada | Prompt | Fundamento |
|---|---|---|---|---|
| RF-CAT-010 | "según ficha" (no es una ola) | O2 | PRO-O2-09 | Habilitación por tenant del catálogo; las fichas de T12 indican la ola de cada servicio, pero el mecanismo es de O2 |
| RF-COM-180 | "por emisor" | O2 | PRO-O2-15 | Marco de notificaciones transaccionales; cada módulo emisor agrega sus avisos en su ola |
| RF-MIG-060 | "por dominio" | O11 | PRO-O11-06 | Archivo histórico por dominio; los mapeos por dominio se agregan en cada ola, el archivo consultable completo en O11 |
| RF-CRM-254 | O11 con estado `Reemplazado` | O11 | PRO-O11-06 | Se conserva como verificación de que la funcionalidad reemplazante existe y se migran sus datos |
| RF-VEN-106 | O4 con estado `Reemplazado` | O4 | PRO-O4-13 | Ídem: se verifica el reemplazo en la ola del anexo |
| RF-STK-024 | Varias olas en texto libre | O3 (+O8, O10) | PRO-O3-02 | Movimientos básicos en O3, completos en O8 y de fabricación en O10 |
| RF-STK-040 | Varias olas en texto libre | O3 (+O8) | PRO-O3-02 | Documentos de stock básicos en O3, completos en O8 |
| RF-STK-136 | Varias olas en texto libre | O3 (+O11) | PRO-O3-03 | Stock por servicio en O3, migración histórica en O11 |
| RF-TES-128 | Varias olas en texto libre | O5 (+O8) | PRO-O5-09 | Rendiciones básicas en O5 (DEC-059), completas en O8 |
| RF-IAM-133 | Varias olas en texto libre | O0 (+O1) | PRO-O0-12 | Auditoría inmutable en O0, cadena de hash y verificación en O1 |
| RF-UXD-139 | "O0 en adelante" | O0 | PRO-O0-16 | Regla de accesibilidad que se cumple desde O0 y se reverifica en cada ola |
| RF-UXD-171 | "cada ola sus ítems" | O0 | PRO-O0-15 | El mapa del sitio se construye en O0; cada ola agrega sus ítems |
| RF-UXD-163 | "O9+ (cuando haya bot)" | O6 | PRO-O6-09 | DEC-056 adelanta el bot y el omnicanal a O6 |
| RF-CON-025 | O10 | O5 | PRO-O5-10 | *Reemplazado en v1.1.* DEC-019 (capital mínimo en O5) y HUECO-CAP-01: las cuentas de capital se necesitan en el plan desde O5 |
| RF-CON-075 | O10 | O5 | PRO-O5-11 | *Reemplazado en v1.1.* Ídem: regla de asiento de capital |
| RF-CON-150 | O10 | O5 | PRO-O5-12 | Ídem: capital social contable |
| RF-CON-151 | O10 | O5 | PRO-O5-12 | Ídem |
| RF-CON-160 | `O11 (O5 para saldos de apertura)` | O5 (+O11) | PRO-O5-11 | *Nuevo (corrección 05-11-2026).* Regla §0.1: la celda lista dos olas y el RF empieza en la más temprana (saldos de apertura contables en O5, que se necesitan junto con los saldos y cuentas corrientes migrados en PRO-O5-07); la migración repetible completa es extensión en PRO-O11-06. *Reemplazado:* antes se contaba en PRO-O11-06 y O5 lo tenía como extensión |
| RNF-NFR-100 | Sin ola | O2 | PRO-O2-03 | Datos sensibles de personas: se construye con RF-PER-014 (O2) |

**Aclaraciones del 05-11-2026 (sin reasignación).** Los entregables de análisis y diseño (`23-estimacion-esfuerzo.md` §7 y `20-casos-prueba.md` §7) informaron 8 RF "sin ola" y 6 "con ola distinta". Verificación contra los anexos vigentes:

| ID | Celda de ola en el anexo | Prompt | Situación |
|---|---|---|---|
| RF-CAT-010, RF-COM-180, RF-CRM-254, RF-MIG-060, RF-VEN-106 | Sin ola válida | Ver la tabla anterior | Ya reasignados en esta sección |
| RF-TEC-062 | O3 | PRO-O3-05 | La ola es válida. La celda de requisito contiene, dentro de código, los valores antes y luego separados por una barra vertical sin escapar, y un lector automático corre las columnas (lee "Núcleo" como ola). Lo corrige el dueño de M10 (escapar la barra) |
| RF-TEC-157 | O7 | PRO-O7-08 | La ola es válida. La celda usa la barra vertical escapada (correcto en Markdown); el lector de los entregables no reconoce el escape |
| RF-UXD-026 | O0 | PRO-O0-14 | La ola es válida. La celda contiene, dentro de código, los valores socio, empleado y campo separados por barras verticales sin escapar. Lo corrige el dueño de T03 |
| RF-CON-025, RF-CON-075 | O10 | PRO-O10-02 | Coinciden con el anexo. El desvío informado venía de la cita "extensión O5 de …" dentro de `IMPLEMENTAR` de PRO-O5-10 y PRO-O5-11, que un lector automático contaba como primera implementación. Desde el corrección 05-11-2026 las extensiones van en la línea `EXTENSIONES` (§0.6) |
| RF-CON-160 | `O11 (O5 para saldos de apertura)` | PRO-O5-11 | Reasignado a la ola más temprana de la celda (tabla anterior) |
| RF-CRM-260 | `O7 (GAS, ELE); O3 resto` | PRO-O3-11 (+PRO-O7-09) | Celda con dos olas por servicio: empieza en O3 (regla §0.1) y la parte GAS y ELE es extensión en O7. Un lector que toma la primera ola escrita (O7) informa desvío; no lo hay |
| RF-TEC-231 | `O7 (GAS, ELE); O3 para el resto de los servicios con red` | PRO-O3-01 (+PRO-O7-08) | Ídem: empieza en O3; GAS y ELE en O7 |
| RF-MOR-222 | `O10 (TEL, TV) / O7 (AG, CLO)` | PRO-O7-09 (+PRO-O10-09) | Ídem: empieza en O7; TEL y TV en O10 |
| RF-UXD-163 | `O9+ (cuando haya bot)` | PRO-O6-09 | Reasignado (tabla anterior): la condición del anexo ("cuando haya bot") se cumple en O6 por DEC-056. El dueño de T03 debería escribir `O6 (DEC-056)` en la celda (hecho en el cierre de la corrección de inconsistencias del 05-11-2026: la celda dice `O6 (DEC-056; antes O9+ cuando haya bot)`, y el recuento ya no informa desvío) |

Además, sin ser RF, se agrega un requisito explícito:

| ID | Origen | Ola | Prompt | Fundamento |
|---|---|---|---|---|
| REQ-DEC-064 | DEC-064 (razón social `legalEntities` y `legalEntityId` en todo documento económico desde O0) | O0 | PRO-O0-13 | Ningún anexo lo define como RF; solo T01 lo menciona como PA. Ver §19 C-01. *Reemplazado en v1.1:* queda cubierto por RF-CFG-134..138 y 140 (T04 §7.14 y §7.15) con los nombres de T05: `legalEntities` (datos legales en `fiscal.*`), `branches`, `workstations` (RF-CFG-141, O1), perfil fiscal en `fiscalProfiles` de M06 (RF-CFG-138, RF-FIS-167, O4) y `legalEntityId` obligatorio por RF-CFG-136 |

---

## 19. Contradicciones de olas detectadas (anexos frente a DEC y maestro)

Regla aplicada: prevalecen el maestro y las DEC (encabezado de este plan). Cada contradicción está resuelta en el plan; queda listada para que el dueño del anexo la corrija en su próxima versión.

| ID | Dónde | Contradicción | Resolución en este plan |
|---|---|---|---|
| C-01 | DEC-064 frente a T01 y M05/M06/M07/M15 | DEC-064 exige `legalEntities` y `legalEntityId` desde O0, pero ningún anexo tiene un RF que lo defina (T01 solo lo trae como PA) | REQ-DEC-064 en PRO-O0-13 y R11 lo vuelve obligatorio en todo documento económico. **Resuelta en v1.1:** T04 agregó RF-CFG-134..143 y T05 COL-CFG-41 a 43; PRO-O0-13 implementa RF-CFG-134..138 y 140 |
| C-02 | M01 RF-PER-109..117 y M02 RF-CAT-080 (O10) frente a DEC-071 y HUECO-TRV-01 | DEC-071 hace dueño a M18 y pide adherentes mínimos en O4; M01 y M02 los ponen en O10. M18 mismo pone RF-SOC-011..014 y 026 en O4 y RF-SOC-015..030 en O10 | Adherentes mínimos en O4 (PRO-O4-14) con M18 dueño; la parte de M01 y M02 sigue en O10 (PRO-O10-04) como referencia a M18 |
| C-03 | M15 RF-CON-025, 075, 150, 151 (O10) frente a M17 RF-INS-056 (O5), DEC-019 y HUECO-CAP-01 | El capital mínimo llega en O5 pero su contabilidad figuraba en O10 | Reasignados a O5 (§18). *Reemplazado en v1.1:* el anexo M15 ya pone RF-CON-098, 150 y 151 en O5 (y M07 RF-COB-176); RF-CON-025 y 075 siguen en O10 en el anexo y vuelven a PRO-O10-02, con extensión en O5. Resuelta en el anexo |
| C-04 | M05 RF-FAC-146 y M07 RF-COB-132 frente a DEC-015 | RF-FAC-146 pone en O5 QR de NaranjaX, Pronto Pago, ProvinciaNet y Helipagos; RF-COB-132 indica Macro, Naranja y otras como posteriores; DEC-015 fija las prioritarias en O5 y el resto como extensión | Lista prioritaria de DEC-015 en PRO-O5-06; el resto en PRO-O11-04. El dueño de M05 y M07 debe alinear las listas con DEC-015 |
| C-05 | Maestro §4.3 y §12: M14 TES en O8 | DEC-059 pone tesorería básica en O5 y completa en O8; el anexo M14 ya lo refleja | O5 y O8 (PRO-O5-08, 09 y PRO-O8-07..09) |
| C-06 | Maestro: M09 CRM sin O6 | DEC-056 adelanta IA y omnicanal a O6; el anexo M09 lo refleja | O6 (PRO-O6-09) |
| C-07 | Maestro: M03 "O3 equipos" | El anexo M03 pone todos sus RF en O7; los equipos de O3 son de M10 y M13 | M03 completo en O7; equipos de red y del cliente en O3 por M10 y M13 |
| C-08 | Maestro: M16 SUE en O9 | DEC-058 y el anexo ponen legajo mínimo en O3 e importación externa en O8 | O3 (RF-SUE-001), O8 (importación) y O9 (resto) |
| C-09 | Maestro: M12 CMP en O8 | El anexo pone RF-CMP-018 y 067 en O3 (recepción mínima de equipos), "A validar PA-CMP-01" | O3 para esos dos RF; resto en O8. R8 aplica a PA-CMP-01 |
| C-10 | M02 sin EVT-CAT (HUE-SRV-02, HUECO-TRV-03) | M02 no define eventos y otros anexos los consumen | Se usan los provisionales EVT-CAT-01..25 de T11 §12.3 (R10) |
| C-11 | Encabezados de M17 y M18 condicionales ("solo si…") frente a DEC-019 y DEC-071 | Los anexos condicionan su alcance a decisiones que ya están firmes | Se toman como firmes según las DEC |
| C-12 | T01 RF-PLA-040 en estado "A validar PA-PLA-08" | DEC-065 ya resolvió la PA (facturación del SaaS con M05) | Se implementa según DEC-065 en PRO-O5-13 (R7) |
| C-13 | HUECO-OBR-04: T07 pone la migración de obras en O8; M10 y M02 ubican obras en O7 | Ola de la migración de obras inconsistente | Obras en O7 (PRO-O7-08); su migración en O11 (PRO-O11-06) junto con el resto de migración por dominio |
| C-14 | DEC-068 frente al maestro §15 | El maestro describe un "corte definitivo" en O11; DEC-068 lo define por etapas (comercial M01–M09 y luego administrativo) | Dos ensayos y dos cortes (PRO-O11-09 y 10) |
| C-15 | Referencia al núcleo contable en O5 | En pedidos y notas aparece como "DEC-006"; en el registro de decisiones es DEC-009 | Se cita DEC-009 |
| C-16 | Nombres de tenants demo (HUE-SRV-05) | M02 y T12 usan "Cooperativa Demo Norte/Sur"; T01 usa "Cooperativa Ejemplo A/B" | Se usan los de T01 y se conservan los códigos de datos (R14). **Aplicado (05-11-2026):** M02 §18, T05 §18, T12 partes 1 y 2, T03 y el slug de M19 usan R14 |

---

## 20. Huecos abiertos de `05-registro-huecos.md` por ola

Cursor aplica R9 en el primer prompt cuyo alcance coincide con el hueco. Esta tabla es una guía; el filtro definitivo es el estado del hueco en `05-registro-huecos.md` al momento de ejecutar el prompt.

| Ola | Huecos | Prompts donde se aplican |
|---|---|---|
| O0–O1 | Ninguno con anexo responsable de fundaciones; los transversales se aplican al llegar su ola | — |
| O2 | HUE-SRV-01, 02, 03, 04, 05, 07, 09; HUECO-TRV-01, 02, 03, 04 | PRO-O2-09, 10, 11, 12, 15 y 19 (cierre de estados) |
| O3 | HUE-SRV-07 (parte técnica), HUE-INT-03 | PRO-O3-07, 09 |
| O4 | HUE-INT-01, 02; HUE-SRV-05 (parte de facturación) | PRO-O4-05..12 |
| O5 | HUECO-CAP-01..04 (parte contable y de suscripción) | PRO-O5-11, 12 |
| O6 | HUE-TEL-04 (parte de corte), HUE-ELE-05 (protecciones) | PRO-O6-03, 04 |
| O7 | HUE-ELE, HUE-AG, HUE-CLO, HUE-GAS, HUE-ALU, HUECO-OBR (salvo OBR-04 y 05) | PRO-O7-01..08 |
| O8 | HUE-ELE-01, HUE-GAS-04, HUE-TV-01 (parte administrativa) | PRO-O8-04, 05, 13 |
| O9 | Ninguno específico | — |
| O10 | HUECO-SEP, HUECO-CEM, HUECO-SAN, HUECO-SAL, HUECO-VIV, HUECO-OTR, HUE-TEL, HUE-TV (incluido HUE-TV-03), HUECO-CAP-01..04 (parte institucional) | PRO-O10-02, 04..09 |
| O11 | HUECO-TRV-05; HUECO-OBR-04, 05; HUECO-CEM-03; HUECO-SAL-02; HUECO-TAS-03; HUECO-CAP-03; HUECO-VIV-03; HUECO-OTR-01 | PRO-O11-06 (DEC-089; antes PRO-O11-06..08) |

Los huecos que se resuelven en dos olas (por ejemplo HUECO-CAP-01..04) se marcan `Implementado según propuesta (PRO-Ox-NN)` recién cuando se completa la última parte; antes se anota `Parcial (PRO-Ox-NN)` en el mismo registro.

---

## 21. Cambios de la versión 1.1 (RF nuevos de huecos, DEC-082 a DEC-087 y cambios de ola)

Insumo: `_trabajo/residuales-fase3.md` (grupos G1 a G6 de las fases 1 a 3 de huecos). Cada RF se verificó contra la tabla de RF de su anexo: los 83 existen y su ola coincide con la del anexo. No se crearon prompts nuevos: todos encajan en un prompt existente de su ola y módulo. En cada prompt los RF agregados figuran en la línea IMPLEMENTAR después de "además (v1.1)".

### 21.1 RF nuevos por prompt

| Prompt | RF nuevos (v1.1) |
|---|---|
| PRO-O0-13 | RF-CFG-134..138, 140 (cubren REQ-DEC-064) |
| PRO-O1-11 | RF-CFG-141 |
| PRO-O2-04 | RF-PER-173 |
| PRO-O2-09 | RF-PLA-165, RF-UXD-179 |
| PRO-O2-10 | RF-PLA-164 |
| PRO-O2-16 | RF-POR-179 |
| PRO-O2-17 | RF-POR-174 |
| PRO-O3-01 | RF-TEC-231 (parte O3: servicios con red distintos de GAS y ELE) |
| PRO-O3-03 | RF-TAR-115 |
| PRO-O3-11 | RF-CRM-258; RF-CRM-260 (parte O3: servicios distintos de GAS y ELE) |
| PRO-O4-01 | RF-FIS-167, 168 |
| PRO-O4-04 | RF-FIS-161 |
| PRO-O4-10 | RF-FAC-177, 179 |
| PRO-O5-02 | RF-COB-191, 192 |
| PRO-O5-04 | RF-COB-193 |
| PRO-O5-07 | RF-COB-194 (y RF-COB-176 por cambio de ola, §21.2) |
| PRO-O5-10 | RF-CON-162 |
| PRO-O5-12 | (RF-CON-098 por cambio de ola, §21.2) |
| PRO-O6-02 | RF-FIS-164; RF-MOR-223 (parte O6: saldo elegible) |
| PRO-O6-04 | RF-FIS-166 |
| PRO-O7-01 | RF-CAT-114, RF-MED-128 |
| PRO-O7-05 | RF-POR-176 |
| PRO-O7-06 | RF-TAR-116, 119, 121 |
| PRO-O7-07 | RF-FAC-174, 175, 178 |
| PRO-O7-08 | RF-CAT-115, RF-TEC-232, 233, 235, 236; extensión de RF-TEC-231 (GAS y ELE) |
| PRO-O7-09 | RF-MOR-221; RF-MOR-222 (parte O7: AG y CLO); RF-TEC-238 (parte O7: AG); RF-CRM-259; extensión de RF-MOR-223 (corte) y RF-CRM-260 (GAS y ELE) |
| PRO-O8-02 | RF-CMP-149..153, RF-MED-129 |
| PRO-O8-05 | RF-TEC-239, RF-STK-139 |
| PRO-O9-01 | RF-CFG-139 |
| PRO-O9-02 | RF-CFG-143 |
| PRO-O10-02 | RF-CON-161 (y RF-CON-025, 075 por cambio de ola, §21.2) |
| PRO-O10-04 | RF-SOC-146, 148, 149, RF-MOR-224, RF-POR-178, RF-MIG-099 |
| PRO-O10-05 | RF-TAR-117, RF-FIS-162, RF-POR-177 |
| PRO-O10-06 | RF-SOC-147 |
| PRO-O10-08 | RF-TAR-118 |
| PRO-O10-09 | RF-CAT-116, RF-CMP-154, 155, RF-TEC-234, 237, RF-TAR-120, 122, RF-POR-175; extensión de RF-MOR-222 y RF-TEC-238 (TEL y TV) |
| PRO-O10-13 | RF-FAC-176, RF-FIS-165, RF-COB-190 |
| PRO-O11-06 | RF-CFG-142, RF-FIS-163 |

Los RF con ola dividida por servicio cuentan una vez, en su primera ola (§0.1), y el otro prompt los lista como extensión: RF-TEC-231 y RF-CRM-260 (O3; O7 para GAS y ELE), RF-MOR-222 y RF-TEC-238 (O7; O10 para TEL y TV) y RF-MOR-223 (O6; O7 para el corte).

### 21.2 Discrepancias de ola entre el plan 1.0 y los anexos (prevalece el anexo)

| RF | Ola en el anexo | Prompt en v1.0 | Prompt en v1.1 |
|---|---|---|---|
| RF-COB-176 | O5 (antes O10) | PRO-O10-13 | PRO-O5-07 |
| RF-CON-098 | O5 (antes O10) | PRO-O10-02 | PRO-O5-12 |
| RF-CON-025 | O10 | PRO-O5-10 (reasignado por C-03) | PRO-O10-02, con extensión en PRO-O5-10 |
| RF-CON-075 | O10 | PRO-O5-11 (reasignado por C-03) | PRO-O10-02, con extensión en PRO-O5-11 |

En los prompts de origen el RF queda citado como "reemplazado en v1.1" o como extensión; las filas de §18 y §19 de v1.0 se conservan marcadas como reemplazadas.

### 21.3 Decisiones incorporadas

| DEC | Dónde se refleja |
|---|---|
| DEC-082 (gas envasado como variante de GAS) | PRO-O2-09 (catálogo) y PRO-O8-05 (RF-TEC-239 y RF-STK-139) |
| DEC-083 (conceptos de terceros sobre contrato propio) | PRO-O2-10, PRO-O4-04, PRO-O6-02 (RF-FIS-164) y PRO-O6-04 (RF-FIS-166) |
| DEC-084 (correo electrónico y pack SMS) | PRO-O2-09 y PRO-O10-09 (RF-TAR-122) |
| DEC-085 (corrección de volumen de gas en M04) | PRO-O7-03 (M03 no corrige) y PRO-O7-06 (M04 corrige) |
| DEC-086 (`BENSOC` a `serviceBeneficiaries`) | PRO-O10-04 y PRO-O11-06 |
| DEC-087 (cuenta corriente por titular y entidad jurídica; archivo de más de 36 meses) | PRO-O4-10, PRO-O5-02, PRO-O5-04, PRO-O5-10 y PRO-O11-06 |

### 21.4 Totales recontados

Recuento leyendo las tablas de RF y RNF de los 29 anexos con RF y las líneas IMPLEMENTAR de este plan: 4.203 RF (4.120 + 83) y 292 RNF, cada uno asignado a exactamente un prompt, sin faltantes ni duplicados. Prompts: 172 (sin cambios) más 3 generales.

| Ola | O0 | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Prompts | 21 | 20 | 19 | 13 | 16 | 14 | 11 | 10 | 15 | 9 | 14 | 10 | 172 |
| RF v1.1 | 305 | 458 | 613 | 319 | 424 | 468 | 244 | 274 | 462 | 163 | 383 | 90 | 4.203 |
| RF v1.0 (reemplazado) | 299 | 457 | 607 | 315 | 419 | 463 | 241 | 256 | 454 | 161 | 360 | 88 | 4.120 |
| RNF | 144 | 72 | 15 | 9 | 23 | 13 | 2 | 0 | 1 | 0 | 6 | 7 | 292 |

*Reemplazado (corrección 05-11-2026): RF v1.1 O5 468 y O11 90. Valores vigentes en §21.5.*

### 21.5 Correcciones del 05-11-2026 (inconsistencias detectadas por los entregables)

Insumo: `docs/entregables-analisis-diseno/23-estimacion-esfuerzo.md` §7, `20-casos-prueba.md` §7 y `_trabajo/inconsistencias-especificacion.md`. Recuento con `_trabajo/plan_recuento.py` (lee las tablas de RF y RNF de los anexos y las líneas `IMPLEMENTAR`; no estima). Correcciones aplicadas con `_trabajo/plan_corregir_20261105.py` y `_trabajo/plan_corregir_20261105_b.py`.

| Ítem | Inconsistencia | Corrección |
|---|---|---|
| a | La columna RF de la tabla de secuencia no coincidía con los RF contados en `IMPLEMENTAR` en PRO-O5-10 (30 frente a 31), PRO-O5-11 (56 frente a 57) y PRO-O10-02 (29 frente a 27) | La causa eran las citas "extensión O5 de RF-CON-025" y "extensión O5 de RF-CON-075" dentro de `IMPLEMENTAR`. En los 24 prompts que tenían extensiones dentro de `IMPLEMENTAR` se pasaron a una línea `EXTENSIONES` (texto conservado; §0.6). PRO-O5-10 queda en 30 y PRO-O10-02 en 29; PRO-O5-11 pasa a 57 por RF-CON-160 (ítem c) |
| b | Totales por ola que no cerraban: O5 470 y O10 381 contados frente a 468 y 383; RNF de O11 8 frente a 7 | Con las extensiones fuera de `IMPLEMENTAR`, cualquier lector cuenta O10 383 y O11 7 RNF. O5 queda en 469 y O11 en 89 por RF-CON-160. §1, §9.4, §9.10, §15.4, §15.10, §16, §17 y los prompts de integración PRO-O5-14 y PRO-O11-10 actualizados con el valor anterior marcado como reemplazado |
| c | 8 RF sin ola y 6 con ola distinta de la del anexo | Ver §18 (aclaraciones): 5 ya estaban reasignados; 3 tienen ola válida y el problema es de formato de la celda del anexo (RF-TEC-062, RF-TEC-157, RF-UXD-026); RF-CON-025 y 075 coinciden con el anexo (O10); RF-CRM-260, RF-TEC-231 y RF-MOR-222 siguen la regla §0.1; RF-UXD-163 sigue reasignado por DEC-056; RF-CON-160 se reasigna de O11 a O5 (PRO-O5-11) por la regla §0.1, con extensión en PRO-O11-06 |
| d | Rangos de PAN del alcance por anexo distintos de los definidos en los anexos (PAN-COB hasta 42, PAN-MOR hasta 46, PAN-INS hasta 35, PAN-CMP hasta 24, PAN-SOC hasta 33) | Se alinearon a los IDs definidos en cada anexo (filas de tabla o encabezados), con el rango anterior marcado como reemplazado: PAN-COB-01..36, PAN-MOR-01..42, PAN-INS-01..33, PAN-CMP-01..26, PAN-SOC-01..35, PAN-CFG-01..35, PAN-COM-01..34 y 40..53, PAN-POR-01..104, PAN-TEC-01..64, PAN-FAC-01..47. Con el mismo control se alinearon los rangos de API, EVT y JOB del alcance por anexo que tampoco coincidían (29 rangos; los de JOB-CMP se toman del catálogo de T11, porque M12 no los tabula) |
| e | Barra inferior (tabbar) del portal del socio distinta entre la maestra §9.2 y T03 | Se corrige en la maestra §9.2 (no en este plan) |

Totales vigentes por ola (cada RF y RNF en exactamente un prompt; sin faltantes, sin duplicados y sin IDs inexistentes):

| Ola | Prompts | RF | RNF |
|---|---|---|---|
| O0 | 21 | 305 | 144 |
| O1 | 20 | 458 | 72 |
| O2 | 19 | 613 | 15 |
| O3 | 13 | 319 | 9 |
| O4 | 16 | 424 | 23 |
| O5 | 14 | 469 | 13 |
| O6 | 11 | 244 | 2 |
| O7 | 10 | 274 | 0 |
| O8 | 15 | 462 | 1 |
| O9 | 9 | 163 | 0 |
| O10 | 14 | 383 | 6 |
| O11 | 10 | 89 | 7 |
| **Total** | **172** | **4.203** | **292** |

RF reasignados respecto de la versión 1.1 del 05-11-2026: solo RF-CON-160 (de PRO-O11-06 a PRO-O5-11). Prompts sin cambio de cantidad: todos salvo PRO-O5-11 (56 a 57) y PRO-O11-06 (19 a 18).

### 21.6 Cierre de la corrección de inconsistencias (05-11-2026)

Insumo: `_trabajo/correccion-inconsistencias-pendientes-cierre.md` y `_trabajo/cierre-correccion-instrucciones.md`. Recuento con `_trabajo/plan_recuento.py`, que lee solo `anexos/*.md` (los respaldos `_trabajo/backup-*` no cuentan).

| Ítem | Cambio | Dónde |
|---|---|---|
| a | RF-POR-180 nuevo en M19 (Comunidad en la tabbar del socio, PAN-POR-105 `/app/comunidad`, PA-POR-20), ola O2. El recuento lo informaba como faltante | Se agrega a `IMPLEMENTAR` de PRO-O2-17 (64 → 65 RF); §1, §6.4 (fila M19 POR 96 → 97, PAN-POR-01..105, total 613 → 614), tabla de secuencia de O2, PRO-O2-19, PRO-O11-10, §16 y §17 |
| b | RF-UXD-163: T03 ya escribe `O6 (DEC-056)` en su celda | Sin cambio de prompt (sigue en PRO-O6-09); nota en §18 y en §17 |
| c | Ronda de residuales (05-11-2026): T03 asigna PAN-UXD-15, 16 y 17 a RF-UXD-064, 063 y 055 (PA-UXD-18) | Sin cambio: los tres RF son de O0 en T03 y están solo en `IMPLEMENTAR` de PRO-O0-15 (RF-UXD-055 figura además como extensión en O4, que no cuenta). Recuento: 4.204 RF y 292 RNF, 0 faltantes y 0 duplicados |

Totales vigentes por ola (cada RF y RNF en exactamente un prompt; sin faltantes, sin duplicados y sin IDs inexistentes):

| Ola | Prompts | RF | RNF |
|---|---|---|---|
| O0 | 21 | 305 | 144 |
| O1 | 20 | 458 | 72 |
| O2 | 19 | 614 (antes 613) | 15 |
| O3 | 13 | 319 | 9 |
| O4 | 16 | 424 | 23 |
| O5 | 14 | 469 | 13 |
| O6 | 11 | 244 | 2 |
| O7 | 10 | 274 | 0 |
| O8 | 15 | 462 | 1 |
| O9 | 9 | 163 | 0 |
| O10 | 14 | 383 | 6 |
| O11 | 10 | 89 | 7 |
| **Total** | **172** | **4.204** (antes 4.203) | **292** |

Avisos del recuento que no cambian la asignación (formato de celda en el anexo, ya explicados en §18): RF-CAT-010 (`según ficha`), RF-COM-180 (`por emisor`), RF-CRM-254 y RF-VEN-106 (`—`), RF-MIG-060 (`por dominio`), RF-TEC-157 y RF-UXD-026 (barra vertical sin escapar en la celda); RF-CRM-260, RF-TEC-231 y RF-MOR-222 siguen la regla §0.1.

### 21.7 Corte comercial tras O7 (DEC-089, 05-11-2026)

DEC-089 fija que electricidad, gas y prepago de la cooperativa piloto se cortan al cerrar O7, con los ciclos consecutivos de paralelo de T07 §17.4 aprobados (PRM-MIG-041, default 2). Las herramientas de paralelo y corte y la migración de los datos vigentes que ese corte necesita estaban en O11, así que pasan a O7. Los históricos, el archivo, el corte administrativo y el apagado de ProCoop siguen en O11.

| Ítem | Cambio | Dónde |
|---|---|---|
| a | Nuevo PRO-O7-11 (15 RF y RNF-NFR-154): RF-CFG-132, 142; RF-TAR-101, 102; RF-FIS-163; RF-COB-155; RF-POR-127; RF-MIG-070..076; RF-MOR-219. Reemplaza a PRO-O11-07 | Celdas de ola de T04, M04, M06, M07, M19, T07, M08 y T08 (`O7 (DEC-089; antes O11)`); §11.4, §11.10 |
| b | Nuevo PRO-O7-12 (9 RF): RF-MIG-006, 080..082, 086..089; RF-POR-020. Reemplaza a PRO-O11-08 | T07 y M19; §11.4, §11.10 |
| c | PRO-O11-07 y PRO-O11-08 se conservan como reemplazados, sin `IMPLEMENTAR`. RNF-NFR-019 pasa a PRO-O11-03, RNF-NFR-106 a PRO-O11-02 y RNF-NFR-046 a PRO-O11-10 | §15.10 y prompts de O11 |
| d | PRO-O11-06 baja de 18 a 9 RF; PRO-O11-09 ensaya solo los servicios que sigan en ProCoop; PRO-O7-10 verifica 298 RF e incluye el ensayo de corte comercial | §11, §15 |
| e | Criterios de salida: O7 suma paralelo aprobado y ensayo de corte comercial; O11 deja de pedir "una corrida paralela de un ciclo" | §11.2, §15.2 |

Totales vigentes por ola (las demás olas no cambian):

| Ola | Prompts | RF | RNF |
|---|---|---|---|
| O7 | 12 (antes 10) | 298 (antes 274) | 1 (antes 0) |
| O11 | 8 (antes 10) | 65 (antes 89) | 6 (antes 7) |
| **Total** | **172** | **4.204** | **292** |

Recuento con `_trabajo/plan_recuento.py`: 4.204 RF y 292 RNF, cada uno en exactamente un prompt, sin faltantes, duplicados ni IDs inexistentes, y sin RF cuya ola de inicio difiera de su celda. El script informa 10 bloques en O11 porque cuenta los dos reemplazados (PRO-O11-07 y PRO-O11-08), que no tienen `IMPLEMENTAR`; los prompts efectivos son 172. Resultado anterior en `_trabajo/plan_recuento.antes-DEC-089.json`.

## 22. Cambios de la versión 1.2 (DEC-093 a DEC-108, 10-11-2026)

Insumo: DEC-093 a DEC-108 y PA-FIS-23 a PA-FIS-26, aprobadas por el solicitante el 10-11-2026, que surgen del contraste del documento externo `NucleoTransversal-Modelo` (`docs/revision-externa/NucleoTransversal-contraste.md` y `NucleoTransversal-rechazados.md`). El documento externo no es fuente de requisitos: sus aportes entraron por las DEC y los anexos dueños ya los aplicaron. Cada RF y RNF nuevo se verificó contra la tabla de su anexo (ID, texto y celda de ola). No se crearon prompts: todos encajan en un prompt existente de su ola y de su módulo dueño o el más afín. En cada prompt los requisitos agregados figuran en `IMPLEMENTAR` después de "Además (v1.2)", las partes de otras olas en `EXTENSIONES` y las decisiones en una línea `DECISIONES v1.2 (10-11-2026)` antes de `ENTREGABLES`.

### 22.1 RF y RNF nuevos por prompt

| Requisito | Anexo | Celda de ola en el anexo | Prompt | Nota |
|---|---|---|---|---|
| RF-BIA-104 | T10 | `O1 (auditoría) / O5 (centros de costo) / O10 (asociados)` | PRO-O1-17 | Regla §0.1: empieza en O1 con la parte de auditoría. Extensiones: parte O5 en PRO-O5-11 (REP-CON por centro de costo), parte O10 en PRO-O10-01 (vistas de asociados) y tablas del almacén en PRO-O11-01. No es reasignación |
| RNF-NFR-260 | T08 | O1 | PRO-O1-15 | Junto con la bandeja operativa (RF-WFL-010, RNF-NFR-222); la alerta a operaciones sale de PRO-O1-06 (RNF-NFR-132) |
| RF-PER-174 | M01 | O2 | PRO-O2-07 | Usa el motor de duplicados del mismo prompt (RF-PER-155) |
| RF-PER-175 | M01 | O2 | PRO-O2-07 | La tarea en M09 se conecta en PRO-O2-11 (RF-CRM-261), que corre después; el mapeo de migración de personas que la dispara está en PRO-O2-18 |
| RF-CRM-261 | M09 | O2 | PRO-O2-11 | Tipo de gestión de sistema sobre los tipos de caso del mismo prompt |
| RF-CAT-117 | M02 | O4 | PRO-O4-07 | Único prompt de M02 en O4. PRO-O4-04 (anterior) lee la marca con su default `false` hasta que llega; M05 (PRO-O4-09 y 10) ya la encuentra construida |
| RF-COB-195 | M07 | O5 | PRO-O5-07 | Junto con la rendición a tesorería de M07; lo consume la posición de tesorería de PRO-O5-09 (RF-TES-145 y 168) |
| RF-FIS-169 | M06 | O8 | PRO-O8-04 | Fiscal administrativo de M06 |
| RF-INS-109 | M17 | `O8 (prerrequisito del registro de obligaciones propias de M06; ver Guía §7)` | PRO-O8-04 | M17 no tiene prompt en O8; va con su consumidor (RF-FIS-169). Como RF-INS-053 (cierre de capital) sigue en O10, PRO-O8-04 fija en la línea `ALCANCE MÍNIMO v1.2` un cierre mínimo de capital (base congelada, rechazo de movimientos, reapertura con aprobación y eventos) como parte anticipada de RF-INS-053; el RF completo sigue en PRO-O10-02 |
| RF-CON-163 | M15 | O8 | PRO-O8-10 | Motor de asientos de O8 (consume `fis.obligation.created` y EVT-TES-15 de PRO-O8-09) |

### 22.2 Decisiones incorporadas

| DEC | Tema | Dónde se refleja en el plan |
|---|---|---|
| DEC-093 | La factura agrupada no mezcla LQSP y factura común (corrige RN-FAC-040) | PRO-O4-04, PRO-O4-07 (RF-CAT-117), PRO-O4-09, PRO-O4-10 y PRO-O7-07 |
| DEC-094 | La LQSP se sigue autorizando con CESP (PA-FIS-24) | PRO-O4-03 y PRO-O7-07 |
| DEC-095 | Obligaciones y exenciones propias del tenant | PRO-O8-04 (RF-FIS-169, RF-INS-109 y alcance mínimo del cierre de capital), PRO-O8-09, PRO-O8-10 (RF-CON-163) y PRO-O10-02 |
| DEC-096 | Entidad jurídica en membresías, centros de costo, alcance de roles, auditoría y parámetros (completa DEC-064) | PRO-O0-12, PRO-O1-09, PRO-O1-10, PRO-O1-17 (RF-BIA-104), PRO-O2-04, PRO-O2-08, PRO-O2-18, PRO-O5-10, PRO-O5-11 (extensión), PRO-O5-12, PRO-O8-04, PRO-O10-01, PRO-O10-02, PRO-O10-03 y PRO-O11-01 (extensión) |
| DEC-097 | Persona única en todos los maestros (cambia RN-CMP-001) | PRO-O2-03, PRO-O2-07 (RF-PER-174), PRO-O2-18, PRO-O3-03, PRO-O8-01, PRO-O8-03, PRO-O8-13, PRO-O8-14, PRO-O9-01 y PRO-O10-04 |
| DEC-098 | Sucursales derivadas de `PTOVENTA.SUC_COM` (corrige RF-CFG-142) | PRO-O0-13 (fuera de alcance), PRO-O7-11 y PRO-O11-06 |
| DEC-099 | Personas migradas sin documento | PRO-O2-07 (RF-PER-175), PRO-O2-11 (RF-CRM-261), PRO-O2-18, PRO-O4-03, PRO-O4-09, PRO-O7-11, PRO-O9-01 y PRO-O11-06 |
| DEC-100 | Verificador de integridad referencial (reemplaza las claves foráneas del documento externo) | PRO-O1-15 (RNF-NFR-260) y PRO-O1-06 |
| DEC-101 | Cajas sin rendir en la posición de tesorería | PRO-O5-07 (RF-COB-195) y PRO-O5-09 |
| DEC-102 | Uso del suministro como condición de la alícuota de IVA, desactivada por defecto (PA-FIS-26) | PRO-O2-05 y PRO-O4-04 |
| DEC-103 | Supresión de secretos y escaneo previo en la migración (amplía DEC-091 y DEC-092) | PRO-O1-19, PRO-O7-11 y PRO-O11-06 |
| DEC-104 | Correcciones internas sin cambio de alcance | PRO-O2-06, PRO-O2-15, PRO-O4-10, PRO-O6-03 y PRO-O11-06 |
| DEC-105 | Preferencia declarativa y justificación de fórmulas | PRO-O4-06, PRO-O4-07 y PRO-O7-11 |
| DEC-106 | Tope de vencimientos como parámetro del tenant (amplía RF-FAC-086) | PRO-O4-11, PRO-O4-12, PRO-O5-02 y PRO-O5-05 |
| DEC-107 | Comprobante rechazado por ARCA: vuelve a borrador y libera su número (reemplaza DEC-035 en ese punto) | PRO-O0-12, PRO-O4-03, PRO-O4-10, PRO-O4-12, PRO-O4-15, PRO-O5-02, PRO-O5-04, PRO-O5-05, PRO-O6-02, PRO-O7-07 y PRO-O8-09; riesgo de §8.6 |
| DEC-108 | GestionApps no es fuente | Sin efecto en el plan (solo en el maestro) |

### 22.3 Preguntas abiertas nuevas

PA-FIS-23 a PA-FIS-26 quedan `Pendiente (contador)` en `02-preguntas-abiertas.md`. El plan no las cita por ID en `IMPLEMENTAR` (R7 y R8): cada prompt implementa la opción recomendada detrás de un parámetro y no precarga normas. PA-FIS-23 afecta a PRO-O4-04, PRO-O4-07, PRO-O4-10 y PRO-O7-07 (conceptos accesorios de la LQSP); PA-FIS-24 a PRO-O4-03 y PRO-O7-07 (vía de autorización de la LQSP); PA-FIS-25 a PRO-O8-04 (obligaciones propias y base de capital); PA-FIS-26 a PRO-O2-05 y PRO-O4-04 (condición por uso del suministro).

### 22.4 Totales recontados

Recuento con `_trabajo/plan_recuento.py` (lee las tablas de RF y RNF de `anexos/*.md` y las líneas `IMPLEMENTAR` de este plan; las líneas `EXTENSIONES` no cuentan): 4.213 RF y 293 RNF, cada uno en exactamente un prompt, sin faltantes, duplicados ni IDs inexistentes. Las olas que no figuran no cambian.

| Ola | Prompts | RF | RNF |
|---|---|---|---|
| O1 | 20 | 459 (antes 458) | 73 (antes 72) |
| O2 | 19 | 617 (antes 614) | 15 |
| O4 | 16 | 425 (antes 424) | 23 |
| O5 | 14 | 470 (antes 469) | 13 |
| O8 | 15 | 465 (antes 462) | 1 |
| **Total** | **172** | **4.213** (antes 4.204) | **293** (antes 292) |

Prompts que cambian de cantidad: PRO-O1-17 (37 a 38 RF), PRO-O1-15 (1 a 2 RNF), PRO-O2-07 (31 a 33), PRO-O2-11 (35 a 36), PRO-O4-07 (27 a 28), PRO-O5-07 (57 a 58), PRO-O8-04 (29 a 31) y PRO-O8-10 (30 a 31). Los prompts de integración PRO-O1-20, PRO-O2-19, PRO-O4-16, PRO-O5-14, PRO-O8-15 y PRO-O11-10 verifican los valores nuevos.

### 22.5 Observaciones

- Ningún otro RF ni RNF de los anexos cita DEC-093 a DEC-108 sin estar ya en el plan: los RF existentes que cambiaron de texto conservan su ola y su prompt, y el recuento no informa diferencias de ola nuevas.
- §17.2 tenía las columnas O7 y O11 de RNF sin actualizar desde DEC-089 (O7 0 y O11 7); se corrigen a O7 1 y O11 6 con el valor anterior marcado como reemplazado.
- DEC-090 a DEC-092 (05-11-2026) no figuran en este plan. DEC-092 declara que completa requisitos existentes sin crear identificadores; su reflejo en los prompts (PRO-O0-18, PRO-O1-19 y otros) queda pendiente de una revisión aparte.
- El recuento se hizo el 10-11-2026 mientras otro subagente cerraba detalles en M15, T02, T11, T05, T03, M06, M08, M02, M05 y M07; si esos cierres agregan o mueven RF, `plan_recuento.py` los informará como faltantes o diferencias de ola.
