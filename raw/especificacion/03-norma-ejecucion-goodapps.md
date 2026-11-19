# 03b — Norma de ejecución GoodApps para prompts de construcción

| Campo | Valor |
|---|---|
| Versión | 1.2 |
| Fecha | 19-11-2026 |
| Relación | Complementa `03-plan-de-olas-y-prompts.md` (DEC-118: mapa por olas). Sustituye la **prescripción técnica Connectia** de §2.4–§2.5 y del cuerpo de cada `PRO-O*` sin reescribir los **4.213 RF** ni el orden de olas. |
| Stack | DEC-111–113, DEC-110, DEC-117 → `06-impacto-adaptacion-stack-goodapps.md` §5 |

## 1. Cuántos prompts hay

| Tipo | Cantidad | Uso |
|---|---:|---|
| **PRO-Ox-NN** (por ola O0–O11) | **174** | Unidad de implementación; lista en `03-plan` §4.9, §5.9, … y cuerpos `#### PRO-Ox-NN` |
| **PRO-GEN-01..04** | **4** | Arranque, cierre de ola, corrección dirigida, **control pre-PR** |
| **Total sesiones Cursor** | **178** | Mismo orden y mismos RF que el plan 1.2 (`PRO-GEN-04` es recurrente, no suma ola) |

Recontar: `python docs/especificacion/_trabajo/plan_recuento.py` (debe cuadrar **4.213 RF** y **293 RNF** con anexos).

### Por ola (prompts / RF inicio)

| Ola | Prompts | RF (inicio) |
|---|---:|---:|
| O0 | 21 | 305 |
| O1 | 20 | 459 |
| O2 | 19 | 617 |
| O3 | 13 | 319 |
| O4 | 16 | 425 |
| O5 | 14 | 470 |
| O6 | 11 | 244 |
| O7 | 12 | 298 |
| O8 | 15 | 465 |
| O9 | 9 | 163 |
| O10 | 14 | 383 |
| O11 | 10 | 65 |

---

## 2. ¿Están acordes con el impacto stack?

| Capa del prompt | ¿Sigue válido? | Nota |
|---|---|---|
| **IMPLEMENTAR** (RF/RNF IDs) | **Sí** | Comportamiento; no cambió por GoodApps |
| **LEER** (anexos §5–§18) | **Sí** | Anexos con banner DEC-111 y barrido C-05 en §7 |
| **PAN-, API-, EVT-, JOB-** citados | **Sí** | Semántica; OpenAPI diseño en `entregables/18-openapi/` |
| **ENTREGABLES** (carpetas `apps/api`, Mongoose, Zod, Vue, npm, BullMQ, Mongo compose) | **No** | Texto Connectia; aplicar §3 de este documento |
| **PRUEBAS** (Vitest, Supertest, `node --test`, Mongo en contenedor) | **No** | Sustituir por §4 |
| **VERIFICAR** (`npm ci`, scripts §2.5 del `03`) | **No** | Sustituir por §4 |
| Criterios de salida O0 (docker mongo/redis) | **Parcial** | Mismo **hito demostrable**; otra **forma** (§3) |

**Regla:** al ejecutar un `PRO-Ox-NN`, leer el bloque ```text del plan y **ignorar** líneas de stack Node/Mongo/Vue; cumplir RF con la columna **GoodApps** de §3.

---

## 3. Tabla de sustitución técnica (Connectia → GoodApps)

| Connectia (en prompts `03`) | GoodApps (norma vigente) |
|---|---|
| Monorepo `goodapps-coop`, `apps/api` Node ESM | Solución **.NET 10** monolito modular (proyecto por esquema `per`, `iam`, `pla`, … o capas Application/Domain/Infrastructure por módulo DEC-003) |
| Mongoose, colecciones, `ObjectId` | **EF Core**, tablas `07-ddl/sql/<esquema>/`, PK `uniqueidentifier`, `TenantId` |
| Zod en API | Validación **FluentValidation** o anotaciones + `ProblemDetails` RFC 9457 |
| BullMQ + Redis | **Azure Queue Storage** + worker .NET (misma semántica outbox/idempotencia RF-PLA) |
| `outboxEvents` Mongo | `pla.OutboxEvents` (SQL) + relay |
| S3 / MinIO | **Azure Blob** + `pla.StoredFiles` |
| OpenIddict (ya en T02) | **OpenIddict** en .NET (sin cambio de decisión) |
| `apps/admin`, `apps/pwa`, Vue 3 Pinia | **React 19** + Vite; shells T03 (AdminShell, AppShell, landing) |
| `packages/shared/schemas` | Proyecto **Contracts** o **Shared** (.NET) + tipos TS generados opcional |
| `manifest.js` / `index.js` módulo | Manifiesto DI + registro de endpoints minimal APIs o controllers |
| `npm run *` | `dotnet build/test`, `dotnet ef migrations`, pipeline CI acordado con GoodApps |
| Pruebas Supertest + Mongo real | **xUnit** + WebApplicationFactory; integración con **Azure SQL** local/Testcontainers o base diseño `07-ddl` |
| E2E Vitest/Playwright en front Vue | **Playwright** sobre React (mismos CP `20-casos-prueba/`, motor DEC-111) |
| `trace:check` npm | Mantener trazabilidad RF→prueba (`04-matriz-trazabilidad.md`); script GoodApps o mismo criterio R19 con nombres de test .NET |

**Físico por prompt:** antes de codificar, abrir `07-modelo-relacional-azure-sql.md` §2.x del esquema dueño y `07-catalogo-tablas-sql.md`.

---

## 4. Scripts y DoD (reemplazo de `03` §2.4–§2.5)

| Objetivo | Comando / artefacto GoodApps |
|---|---|
| Compilar | `dotnet build` (solución CoopApps) |
| Unitarias | `dotnet test --filter Category=Unit` |
| Integración API + SQL | `dotnet test --filter Category=Integration` (BD de diseño desde `deploy-coopapps-full.sql` o migraciones EF) |
| Aislamiento multitenant | Suite que cubre RF-PLA-034 / T08 (403/404 entre tenants) |
| E2E ola | Playwright `@O2`, etc., alineado a CP del módulo |
| Contrato API | OpenAPI generado desde ASP.NET o validado contra `entregables/18-openapi/` |
| Migración esquema | EF Core migrations + paridad con `07-ddl` en CI |
| Seeds demo | Idempotentes; bloqueados en producción (misma RN que RF-PLA-110) |

**DoD (adaptación R16):** mismos nueve criterios del plan, sustituyendo ítems 5–7 por la fila de esta tabla.

### 4.1 Checklist control pre-PR (`PRO-GEN-04`)

Marcar **sí / no / N/A** en el cuerpo del PR o en `docs/evidencias/<Ola>/PR-<prompt-id>.md`. Si algún ítem obligatorio falla, **no mergear** hasta corregir o abrir PA (R6).

| # | Control | Evidencia mínima | Obligatorio |
|---:|---|---|:---:|
| C1 | **RF/RN del prompt** cubiertos por tests con ID en nombre (R19) | Lista IDs → `dotnet test` / Playwright | Sí |
| C2 | **Matriz** `04-matriz-trazabilidad.md` actualizada para este PRO | Fila o commit en misma PR | Sí |
| C3 | **Sin RF huérfanos** en el alcance del PR | Misma cobertura que cita el `IMPLEMENTAR` del PRO | Sí |
| C4 | **Modelo físico**: tablas/columnas/FK alineadas a `07-ddl` del esquema dueño | Diff migración EF vs script en `07-ddl/sql/<esquema>/` | Sí si hay persistencia |
| C5 | **`TenantId`** en entidades multitenant y filtros globales (DEC-110) | Test aislamiento o integración que falle cross-tenant | Sí si toca datos tenant |
| C6 | **OpenAPI** sin drift grave vs `entregables/18-openapi/` del módulo | Diff o validador en CI | Sí si hay API nueva/cambio |
| C7 | **ProblemDetails** en errores API (DEC-111 stack) | Test de 400/403/404 | Si hay endpoints |
| C8 | **Outbox/jobs** (si el prompt cita EVT/JOB) | `pla.OutboxEvents` o cola Azure + test idempotencia | Si aplica al PRO |
| C9 | **Build y pruebas** §4 (unit + integration + `@Ox` si cierre de ola) | Salida CI verde | Sí |
| C10 | **Trazabilidad plan** (opcional en CI temprano) | `python docs/especificacion/_trabajo/plan_recuento.py` sin faltantes | Recomendado |
| C11 | **Spec**: sin decisiones nuevas encubiertas; huecos → `05-registro-huecos.md` | Comentario en PR si hay Q abierta | Sí |
| C12 | **Residuos stack** en código nuevo: sin Mongoose, `apps/api` Node, BullMQ en paths de producción | Revisión humana o grep en diff | Sí |

**Frecuencia:** ejecutar **PRO-GEN-04** al final de cada **PRO-Ox-NN** (antes del PR) y de nuevo en **PRO-GEN-02** (muestreo de la ola). Complementa **PRO-O0-02** (CI/`trace:check`), no lo reemplaza.

---

## 5. Bloque obligatorio — pegar antes de cada PRO-Ox-NN

```text
NORMA GOODAPPS (03-norma-ejecucion-goodapps.md §3–§4). Stack: .NET 10, EF Core, Azure SQL, React 19, Azure.
El prompt siguiente lista RF válidos; IGNORAR rutas apps/* Node, Mongoose, Zod, BullMQ, npm y compose Mongo/Redis.
Modelo físico: 07-ddl + 07-modelo-relacional-azure-sql.md §2.x del esquema dueño.
Contratos: entregables/18-openapi (diseño) + DEC-110 TenantId.
Aplicá reglas R1–R20 del 03 §2 salvo §2.4–§2.5 (usar §4 de 03-norma-ejecucion-goodapps.md).
```

---

## 6. PRO-GEN actualizados (reemplazan §3 del plan para build; **04** solo en `03-norma`)

### PRO-GEN-01 — Arranque de sesión

```text
PRO-GEN-01 — Arranque de sesión (GoodApps)
Sos el equipo de desarrollo de CoopApps (SaaS multitenant, DEC-111). Trabajás en el repositorio de implementación GoodApps (no el monorepo Node del plan histórico).
1. Leé: 00-ESPECIFICACION-MAESTRA.md §5; 06-impacto-adaptacion-stack-goodapps.md §5 y §12; 03-norma-ejecucion-goodapps.md; 01-registro-decisiones.md (DEC-110–119); 03-plan-de-olas-y-prompts.md §2 R1–R20 y la sección de la ola en curso; anexos citados por el próximo PRO-O con banner DEC-111.
2. Confirmá: ola actual, último PRO cerrado en 04-matriz-trazabilidad.md "Estado de implementación", próximo PRO-Ox-NN, esquema SQL dueño en 07.
3. No escribas código. Esperá el PRO-Ox-NN con el bloque §5 de 03-norma-ejecucion-goodapps.md prepended.
```

### PRO-GEN-02 — Cierre de ola

```text
PRO-GEN-02 — Cierre de la ola Ox (GoodApps)
Aplicá R1–R20 del 03 §2 y DoD §4 de 03-norma-ejecucion-goodapps.md.
0. Revalidá checklist §4.1 (muestreo: último PRO de la ola + cualquier PRO con migración SQL).
1. dotnet build && dotnet test (unit + integration + aislamiento) && e2e Playwright @Ox si aplica.
2. RF de la ola vs 04-matriz-trazabilidad.md: Implementado / Parcial / faltantes.
3. Evidencia en docs/evidencias/Ox/ (capturas React, salida tests).
4. 05-registro-huecos.md: huecos de la ola cerrados o justificados.
Sin funcionalidad nueva en este prompt.
```

### PRO-GEN-03 — Corrección dirigida

```text
PRO-GEN-03 — Corrección dirigida (GoodApps)
Aplicá R1–R20 y 03-norma-ejecucion-goodapps.md §4.
Falla: <prueba / IDs RF/RN>.
1. Leé anexo y PRO-Ox-NN origen.
2. Test que reproduce (xUnit o Playwright) con ID en el nombre; luego corrección.
3. Sin ampliar alcance; PA si cambia spec (R6).
4. Actualizá matriz (R19) y PR fix/<modulo>.
```

### PRO-GEN-04 — Control pre-PR (spec, SQL, trazabilidad)

```text
PRO-GEN-04 — Control pre-PR (GoodApps)
Ejecutá ANTES de abrir o mergear el PR del PRO-Ox-NN <id> (R17–R19, DoD §4 de 03-norma-ejecucion-goodapps.md).
1. Leé el PRO-Ox-NN origen en 03-plan (IMPLEMENTAR/LEER) y el esquema dueño en 07-modelo-relacional-azure-sql.md §2.x + 07-catalogo-tablas-sql.md.
2. Recorré checklist §4.1 de 03-norma (C1–C12). Por cada ítem: Sí / No / N/A y una línea de evidencia (comando, archivo, captura).
3. Modelo: si hay migración EF, compará tablas, tipos y FK con 07-ddl/sql/<esquema>/; documentá diferencias justificadas en PR o PA.
4. Trazabilidad: tests nombrados con IDs RF/RN; actualizá 04-matriz-trazabilidad.md en la misma rama.
5. Salida: tabla markdown C1–C12 en descripción del PR; si algún C obligatorio = No, listá bloqueadores y NO marques listo para review.
Sin funcionalidad nueva salvo tests faltantes estrictamente necesarios para C1.
```

---

## 7. Enriquecimiento del plan (roadmap)

| Fase | Acción | Estado |
|---|---|---|
| A | Este documento + PRO-GEN-01..04 GoodApps | **Hecho** (v1.1: PRO-GEN-04 + §4.1) |
| B | Cabecera en `03-plan` y enlace maestro `00` §15 | En curso |
| C | Barrido `03-plan` PRO-O (ENTREGABLES/VERIFICAR) | **Hecho** 19-11-2026 (`barrido_plan_connectia_goodapps.py`) |
| D | Export módulo a repo GoodApps por ola (DEC-118) | Operación equipo |

Para **construir toda la aplicación** hoy: usar **olas + 174 prompts** como **mapa funcional**; cada sesión = **PRO-GEN-01 → §5 + PRO-Ox-NN → PRO-GEN-04 → PR → (cierre ola) PRO-GEN-02**, interpretando entregables con §3.

---

## 8. Referencias

- `03-plan-de-olas-y-prompts.md` — RF, olas, textos PRO (histórico técnico Node en entregables).
- `07-modelo-relacional-azure-sql.md`, `07-ddl/` — físico.
- `entregables/20-casos-prueba.md` — aceptación (wording histórico en CP permitido; ver C-10).
- `entregables/18-contratos-api.md` — operaciones HTTP diseño.
- `13-auditoria-impacto-stack.md` — residuos documentales.