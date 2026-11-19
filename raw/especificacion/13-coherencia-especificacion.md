# 13c — Informe de coherencia de la especificación canónica

**Fecha:** 19-11-2026  
**Ámbito:** `docs/especificacion/` (sin `OLD/`, sin `_trabajo/backup*`)

## Resumen ejecutivo

| Dimensión | Veredicto |
|---|---|
| **Funcional (RF/RN/DEC negocio)** | **Coherente** — 4.213 RF y 293 RNF asignados a prompts; 0 faltantes en `plan_recuento.py` |
| **Stack vigente (GoodApps)** | **Coherente** con matices — DEC-111+ en maestro `00` §5, `06`, banners; residuos Mongo documentados |
| **Modelo físico `07-*`** | **Coherente** — 1.058 tablas A/C; §2.0–§2.28; catálogo sin `Capa B: pendiente` |
| **Construcción (`03` + `03-norma`)** | **Coherente** — barrido Connectia→GoodApps en PRO-O y §2.3–§2.5 (19-11-2026); norma en `03-norma` |
| **Entregables (C-10)** | **Cerrado** — `00-C10-CIERRE-STACK.md`; CP/ER histórico inventariado |
| **Listo para construcción (export O0)** | **Sí** — ver [§8](#8-listo-para-construcción-19-11-2026) |

---

## 1. Documentos núcleo

| Doc | Rol | Coherencia |
|---|---|---|
| `00-ESPECIFICACION-MAESTRA.md` | Jerarquía, stack §5, DEC | OK (§15 actualizado a 174 prompts + `03-norma`) |
| `01-registro-decisiones.md` | DEC-110–119, reemplazos | OK |
| `02-preguntas-abiertas.md` | PA-STACK-* | Parcial (PA abiertas no bloquean spec) |
| `03-plan-de-olas-y-prompts.md` | 174 PRO, RF por ola | OK funcional; técnico Node supersedido por `03-norma` |
| `03-norma-ejecucion-goodapps.md` | Build .NET/SQL/React | OK |
| `04-matriz-trazabilidad.md` | Fuentes ↔ anexos | OK; algunos párrafos §15 históricos citan 172 (no afectan trazado) |
| `05-registro-huecos.md` | HUE-* | Vigente independiente del stack |
| `06-impacto-adaptacion-stack-goodapps.md` | Checklist §12, C-04/C-05/C-10 | OK v2.33 |
| `07-modelo-relacional-azure-sql.md` | Capa B | OK |
| `07-catalogo-tablas-sql.md` | Capa A | OK (métrica capa B corregida) |
| `07-ddl/` | Capa C | OK (31 pla + 1.027 resto = 1.058) |
| `_GUIA-REDACCION-ANEXOS.md` | Redacción | Tabla DEC-001 histórica + DEC-111 vigente (esperado) |

---

## 2. Anexos M/T (37)

| Control | Resultado |
|---|---|
| Banner DEC-111 | **37/37** (`13-auditoria-impacto-stack.md`) |
| Nota Barrido C-05 en §7 | **34** con `## 7.`; **T12** x2 con nota en cabecera |
| Barrido fino tipos SQL §7 | Aplicado salvo histórico T01/T05 |
| Tokens Mongo en cuerpo | §5 con **banner transversal** (34 anexos); §7 barrido C-05; comparativas T01/T07 preservadas |

---

## 3. Trazabilidad plan ↔ anexos

`python docs/especificacion/_trabajo/plan_recuento.py`:

| Métrica | Valor |
|---|---:|
| RF en anexos | 4.213 |
| RF asignados a un prompt | 4.213 |
| RNF asignados | 293 |
| Prompts con cuerpo `#### PRO-O` | **174** |
| RF faltantes en prompts | **0** |
| RF en más de un prompt (IMPLEMENTAR) | **74** (revisar si extensión vs duplicado) |
| Celdas ola «rara» en anexo (7 RF) | Anotación en celda, no bloqueante |

Contradicciones ola anexo vs primer prompt (3 RF): documentadas en plan §18/§19 (regla primera ola).

---

## 4. Incoherencias conocidas (no bloquean export)

| # | Tema | Detalle |
|---|---|---|
| I1 | **`03` PRO-O** | Barrido GoodApps aplicado (`barrido_plan_connectia_goodapps.py`); notas *Reemplaza Connectia* en §2.5 |
| I2 | **`04` §15** | Actualizado a 174 PRO-O / 4.213 RF (19-11-2026) |
| I3 | **Maestro §15 tabla O0** | Alineado a .NET/colas Azure (19-11-2026) |
| I4 | **`presentacion-stakeholders`** | Diagramas Connectia hasta regenerar IMG (C-07 menor) |
| I5 | **`02` PA-STACK-02** (2FA/SMS) | Abierta; no contradice T02 §7.0 |
| I6 | **DEC-001 en tabla §3 `00`** | Fila histórica + reemplazo §3.0 (DIR-13) |

---

## 5. Comandos de re-auditoría

```text
python docs/especificacion/_trabajo/audit_impacto_stack.py
python docs/especificacion/_trabajo/audit_entregables_stack.py
python docs/especificacion/_trabajo/plan_recuento.py
```

---

## 6. Diferencias vs OLD

Ver **`14-diferencias-vs-OLD-2026-11-19.md`** (backup DIR-02 del 19-11-2026).

## 7. Próximos cierres opcionales

1. ~~Cosmética 172 / PRO Connectia~~ — **Hecho** (barrido plan + `04` §15, 19-11-2026).
2. Portal: entrada de navegación a `03-norma` y `13-coherencia` (pendiente menú).
3. ~~Banner §5 anexos~~ — **Hecho** (`barrido_anexos_sec56_banner.py`, 34 archivos).
4. Regenerar ENTREGABLES PRO-O muy específicos (CNX §4.1) si molestan en export — bajo prioridad.

---

## 8. Listo para construcción (19-11-2026)

**Declaración:** el paquete canónico `docs/especificacion/` + entregables con política C-10 está **listo para export a GoodApps y arranque de implementación por olas** (empezar **O0** con `03-norma` + `PRO-GEN-01` → bloque §5 → `PRO-Ox-NN` → `PRO-GEN-04` → PR).  
**No implica** código desplegado, homogeneidad textual 100 % Azure en todos los CP, ni cierre de preguntas de producción (2FA, validación legal de PRM).

### 8.1 Semáforo

| Objetivo | Estado | Referencia |
|---|---|---|
| Contrato funcional + modelo SQL + DDL | **Verde** | `07-*`, anexos M/T, `05` sin huecos abiertos |
| Checklist alineación documental (core) | **Verde** | `06` §12.2 C-01…C-10 **Hecho** |
| Plan de build Cursor (RF ↔ prompt) | **Verde** | `03`, `plan_recuento.py` (0 RF faltantes) |
| Norma técnica GoodApps + control PR | **Verde** | `03-norma` v1.1, PRO-GEN-04 §4.1 |
| Redacción única stack en todo el corpus | **Amarillo** | I1–I4 §4; política `00-C10-CIERRE-STACK.md` |
| Implementación / producción | **Rojo** | Fuera de GACAC: repo GoodApps, CI, Azure, migración runtime |

### 8.2 Fuera de bloqueo para O0 (seguimiento recomendado)

| # | Tema | Nota |
|---:|---|---|
| A1 | Texto Node residual en `PRO-O` | Barrido automático + `03-norma` §3–§5 |
| A2 | Barrido Mongo §7.1.x en T05/T04/T07/T02/T03/T01 | §7.0 + `07-ddl` prevalecen (`06` §12.1) |
| A3 | ~5.710 CP con wording histórico | Comportamiento = RF/RN; motor = DEC-111 |
| A4 | ~~Cosmética 172 / BullMQ O0~~ | Cerrado en `04` y maestro §15 |
| A5 | Sidebar portal sin `03-norma` | `raw/` sincronizado; menú pendiente |

### 8.3 Acuerdos / validación (no agujeros de spec)

| # | Tema | Estado |
|---:|---|---|
| B1 | **PA-STACK-02** (2FA/SMS vs GoodApps) | Pendiente (diferido D-08) |
| B2 | **PA-STACK-07** (ampliar IA) | Pendiente si el solicitante lo pide |
| B3 | PRM con default *«requiere validación legal»* en `05` | OK para desarrollo; revisar antes de prod en esos regímenes |

### 8.4 Ingeniería (siguiente fase; no en este repo)

| # | Entregable |
|---:|---|
| C1 | Repositorio de implementación GoodApps + plantilla .NET/React |
| C2 | CI equivalente a **PRO-O0-02** (`dotnet test`, trazabilidad R19) |
| C3 | Pipeline export DEC-118 (módulos, sin PII) |
| C4 | Infra Azure (DEC-112): SQL, colas, Blob, identidad |
| C5 | Herramientas ETL/migración ProCoop (T07 en runtime) |
| C6 | `04-matriz-trazabilidad.md` — columna implementación (hoy diseño) |

### 8.5 Criterio de revalidación

Releer este §8 y ejecutar §5 si cambia: conteo de RF, checklist `06` §12, DEC stack (110–119), o se añaden anexos/RF sin pasar por `03`.
