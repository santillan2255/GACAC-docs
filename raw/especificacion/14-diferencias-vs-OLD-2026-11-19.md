# 14 — Diferencias: especificación vigente vs copia OLD (19-11-2026)

| Campo | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Copia OLD | `docs/especificacion/OLD/2026-11-19-pre-naming-coopapps/` |
| Motivo del backup | **DIR-02**: antes del naming **CoopApps** y del cierre de impacto GoodApps |
| Vigente | `docs/especificacion/` (canónico; portal y export) |

> **Regla.** Ante conflicto, **solo cuenta la vigente**. OLD sirve para diff histórico y auditoría; **no** entra en build ni en checklist §12 (`06` §12.4).

---

## 1. Resumen en una tabla

| Tema | OLD (19-11 pre-impacto) | Vigente (hoy) |
|---|---|---|
| **Nombre producto** | *GoodApps Cooperativas* (marca mezclada) | **CoopApps** (DEC-109); GoodApps = empresa |
| **Stack §5 `00`** | Node 20, Express, Mongo 7, Vue 3, BullMQ, AWS ref. | **.NET 10, EF Core, Azure SQL, React 19, Azure** (DEC-111–113, 112) |
| **DEC stack** | DEC-001/004 vigentes como build | DEC-001/004 **reemplazadas**; **DEC-110–119** nuevas |
| **Modelo físico** | Solo T05 «colecciones»; sin `07-*` | **`07-modelo`**, catálogo, **`07-ddl`** (1.058 tablas), §2.0–§2.28 |
| **Impacto / checklist** | No existe `06` | **`06-impacto-adaptacion-stack-goodapps.md`** v2.33, §12 C-01…C-10 |
| **Plan build** | `03` = guía única Cursor (Node/npm) | `03` = mapa olas + **174 PRO**; build en **`03-norma-ejecucion-goodapps.md`** |
| **Anexos M/T** | Sin banner; §7 solo Mongo/ObjectId | Banner **DEC-111**; **Barrido C-05** en §7; tipos SQL en tablas §7 |
| **Auditorías** | No | `13-auditoria-impacto-stack.md`, `13b` entregables, `13-coherencia-especificacion.md` |
| **Identidad marca** | Referencias GoodApps en títulos | **`08-identidad-marca-coopapps.md`**, `docs/brand/coopapps/` (DEC-119) |
| **Alcance funcional RF** | 4.213 RF / 293 RNF (plan 1.2) | **Igual** (sin recorte por stack) |
| **Contenido carpeta OLD** | **43 archivos** (maestro, 01–05, guía, anexos; sin `06`/`07`) | **~1.700+** archivos en `especificacion/` (incl. DDL) |

---

## 2. Qué contiene OLD (y qué no)

**Incluido en OLD** (snapshot parcial):

- `00`, `01`, `02`, `03`, `04`, `05`, `_GUIA-REDACCION-ANEXOS.md`
- **37 anexos** M/T en `anexos/` (mismo set que hoy, texto **pre-barrido**)

**No está en OLD** (solo en vigente):

| Artefacto | Función |
|---|---|
| `06-impacto-adaptacion-stack-goodapps.md` | Directivas, matriz impacto, checklist |
| `03-norma-ejecucion-goodapps.md` | Overlay build GoodApps sobre 174 PRO |
| `07-modelo-relacional-azure-sql.md` | Capa B ER SQL |
| `07-catalogo-tablas-sql.md` | Capa A inventario |
| `07-ddl/**` | Capa C (~1.058 `CREATE TABLE`) |
| `08-identidad-marca-coopapps.md` | Marca producto |
| `13-auditoria-impacto-stack.md` | Auditoría stack |
| `13-auditoria-impacto-entregables.md` | C-10 entregables |
| `13-coherencia-especificacion.md` | Informe coherencia |
| `entregables/00-C10-CIERRE-STACK.md` | (en carpeta entregables, no en OLD spec) |

---

## 3. Cambios por documento núcleo

### 3.1 `00-ESPECIFICACION-MAESTRA.md`

| Aspecto | OLD | Vigente |
|---|---|---|
| Título | GoodApps Cooperativas | **CoopApps** |
| Uso | «Desarrollar con Cursor» vía `03` solo | GACAC maestro + **GoodApps export** + `06` |
| §5 Stack | Tabla Connectia completa | Tabla **Azure/.NET/React** |
| §5.2 | Árbol `goodapps-coop/` Node monorepo | Estructura **modular .NET** + referencia repo GoodApps |
| §3 DEC | DEC-001 stack activo | Tabla reemplazo **DEC-001→DEC-111** |
| §15 olas | 172 prompts | **174** PRO + **`03-norma`** |
| §16 | Ausente o distinto | Uso con GoodApps, checklist `06` |
| Índice | Sin enlace impacto | §5b → **`06`** |

### 3.2 `01-registro-decisiones.md`

- OLD: termina en **DEC-108** (aprox.); DEC-001/004 sin marca «reemplazada».
- Vigente: **DEC-109–119** (naming, multitenancy SQL, stack, T04, export, marca); DEC-001/004 explícitamente reemplazadas.

### 3.3 `03-plan-de-olas-y-prompts.md`

| Aspecto | OLD | Vigente |
|---|---|---|
| Encabezado | Build directo Connectia | **DEC-118** + puntero **`03-norma`** |
| Total prompts tabla | 172 | **174** |
| §2.4–2.5 | npm, Mongo, Vitest, compose mongo/redis | **Sin cambiar texto PRO**; norma en **`03-norma` §4** |
| Cuerpos `PRO-O*` | 100 % prescripción Node | **Igual texto**; interpretación GoodApps obligatoria |

### 3.4 `04-matriz-trazabilidad.md`

- Contenido trazabilidad ProCoop→anexos: **esencialmente el mismo**.
- Vigente: cabecera **174 prompts**, referencias impacto/`07` donde se actualizaron notas 19-11.

### 3.5 `02`, `05`

- Sin cambio de **reglas de negocio** por OLD vs vigente en el backup; vigente puede tener PA **PA-STACK-*** adicionales en `02` (revisar `02` actual).

### 3.6 `_GUIA-REDACCION-ANEXOS.md`

- OLD: stack **DEC-001** en tabla guía.
- Vigente: **DEC-111** como norma; fila histórica DEC-001 citada.

---

## 4. Anexos M/T (37)

| Cambio | OLD | Vigente |
|---|---|---|
| Banner DEC-111 | **No** (0/37) | **Sí** (37/37) |
| §7.0 stack (T01, T05, T02, …) | Parcial / Mongo | §7.0 Azure + histórico T01 |
| Nota **Barrido C-05** tras `## 7.` | No | **34** anexos + **T12** x2 en cabecera |
| Tipos en tablas §7 | `ObjectId`, `Decimal128` | **`uniqueidentifier`**, `DECIMAL` (fino); T01/T05 conservan comparativas históricas |
| §7 físico canónico | Implícito colección | Enlace explícito **`07` §2.x** y `07-ddl/sql/<esquema>/` |

**RF, RN, CU, §5 requisitos:** no se eliminaron en el paso OLD→vigente; el diff por anexo es **marcadores + §7 + redacción física**, no recorte funcional.

---

## 5. Datos y entregables (solo vigente)

| Capa | OLD | Vigente |
|---|---|---|
| Lógico | T05 colecciones | T05 + **§6.1/§7.0** norma Azure |
| ER legible | — | **`07-modelo-relacional-azure-sql.md`** |
| Inventario | T05 §7.3–7.7 | **`07-catalogo-tablas-sql.md`** (1.058 tablas) |
| DDL | — | **`07-ddl`**, `deploy-coopapps-full.sql` |
| Entregables C-10 | Sin cierre stack | **`00-C10-CIERRE-STACK.md`**, OpenAPI diseño, CP históricos inventariados |

---

## 6. Qué NO cambió (deliberado)

- Número de módulos **M01–M19, T01–T12**.
- **4.213 RF** y **293 RNF** asignados a prompts (`plan_recuento.py`: 0 faltantes).
- Orden de olas **O0–O11** y dependencias del plan.
- Cobertura ProCoop (**DEC-007/009**).
- Reglas de negocio **DEC-011–108** (salvo las que ya estaban en ambas versiones).

---

## 7. Cómo comparar en detalle

```text
# Ejemplo: un anexo
fc / compare herramientas diff entre:
  docs/especificacion/OLD/2026-11-19-pre-naming-coopapps/anexos/T01-PLA-plataforma-saas.md
  docs/especificacion/anexos/T01-PLA-plataforma-saas.md

# Métricas automáticas
python docs/especificacion/_trabajo/audit_impacto_stack.py
```

Presentación: existe copia relacionada en `docs/presentacion-stakeholders/OLD/` (mismo criterio DIR-02; no duplicada dentro de `especificacion/OLD`).

---

## 8. Referencias cruzadas

| Documento | Relación |
|---|---|
| `06-impacto-adaptacion-stack-goodapps.md` §12.4 | OLD aislado; qué es incoherencia vs histórico |
| `13-coherencia-especificacion.md` | Estado vigente interno |
| `01-registro-decisiones.md` | DEC-109–119 explican el salto OLD→vigente |
| Portal | Solo sincroniza **vigente** (`portal/scripts/sync-content.mjs`); OLD no se publica |