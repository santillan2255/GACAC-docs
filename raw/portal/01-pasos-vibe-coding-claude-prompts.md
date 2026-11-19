# Pasos para construir con vibe coding (Claude) y los prompts del repo

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 19-11-2026 |
| Alcance | Portal de documentación GACAC (`portal/`), publicación en GitHub Pages y **catálogo de prompts** ya versionados (producto CoopApps + material stakeholders) |
| Relación | Complementa [`00-ESPECIFICACION-PORTAL-DOCUMENTACION.md`](00-ESPECIFICACION-PORTAL-DOCUMENTACION.md). Para implementar **CoopApps**, prevalecen [`03-plan-de-olas-y-prompts.md`](../especificacion/03-plan-de-olas-y-prompts.md) y [`03-norma-ejecucion-goodapps.md`](../especificacion/03-norma-ejecucion-goodapps.md). |

---

## 1. Qué significa “vibe coding” aquí

Trabajar en **sesiones cortas con Claude** (Claude.ai, Claude Code o Cursor con modelo Claude): pegás un **prompt autocontenido**, adjuntás los `.md` que el prompt nombra, revisás el diff y corrés los comandos de verificación. No sustituye la especificación: **los prompts del repo son la receta**; el modelo solo ejecuta y propone cambios.

Dos circuitos distintos:

| Circuito | Objetivo | Prompts principales |
|---|---|---|
| **A — Portal y documentación** | VitePress, sync, ZIP, Pagefind, GitHub Pages, prototipo embebido | Este documento §4 (`PORTAL-GEN-*`) |
| **B — Producto CoopApps** | Código .NET + React por olas O0–O11 | `03-plan` (`PRO-O*`, `PRO-GEN-*`) + `03-norma` |

---

## 2. Antes de empezar

1. Cloná el monorepo **GACAC** (privado) con `docs/`, `portal/`, `procoop-relevamiento/`.
2. **Node 18+** en `portal/` → `npm install`.
3. En Claude: modo que admita **archivos adjuntos** o proyecto con acceso al repo (Cursor: abrir carpeta GACAC).
4. Regla de oro: **no inventar rutas ni PA/RF**; si el prompt pide una tabla de un `.md`, ese archivo es la fuente.

Comandos locales habituales:

```bash
cd portal
npm run dev          # iterar UI
npm run update       # sync + build + ZIP + Pagefind (obligatorio antes de merge si tocó docs/)
set VP_BASE=/GACAC-docs/
npm run update       # mismo build que producción
node scripts/verify-dist-routes.mjs
```

**Producción:** https://santillan2255.github.io/GACAC-docs/ (workflow `.github/workflows/deploy-docs-portal.yml` → repo `GACAC-docs`).

---

## 3. Catálogo de prompts ya en el repositorio

### 3.1 Producto CoopApps (construcción por olas)

| Prompt / doc | Uso | Dónde |
|---|---|---|
| **PRO-GEN-01** — Arranque de sesión | Leer maestra, DEC, reglas R1–R20; confirmar ola y siguiente `PRO-Ox-NN` | [`03-plan-de-olas-y-prompts.md`](../especificacion/03-plan-de-olas-y-prompts.md) §3 |
| **PRO-GEN-02** — Cierre de ola | Pruebas, matriz, huecos, evidencias | Ídem §3 |
| **PRO-GEN-03** — Corrección dirigida | Bug con IDs RF sin ampliar alcance | Ídem §3 |
| **PRO-GEN-04** — Control pre-PR | Checklist C1–C12 GoodApps | [`03-norma-ejecucion-goodapps.md`](../especificacion/03-norma-ejecucion-goodapps.md) §4.1 y §6 |
| **PRO-O0-01 … PRO-O11-10** (174) | Implementación por bloque de RF | [`03-plan`](../especificacion/03-plan-de-olas-y-prompts.md) cuerpo por ola |
| **Norma stack** | Sustituir texto histórico Node/Mongo en prompts | [`03-norma-ejecucion-goodapps.md`](../especificacion/03-norma-ejecucion-goodapps.md) §3–§4 |

**Orden:** una ola por vez (R1); dentro de la ola, prompts en orden numérico (R2). Antes de cada sesión de producto, pegá **PRO-GEN-01** y después el `PRO-Ox-NN` que toque.

### 3.2 Presentación y stakeholders (artefactos con Claude)

Cada archivo incluye bloque **“copiar y pegar en Claude”** y lista de adjuntos obligatorios.

| Archivo | Entregable |
|---|---|
| [`decisiones-por-equipo-ppt-PROMPT-CLAUDE.md`](../presentacion-stakeholders/decisiones-por-equipo-ppt-PROMPT-CLAUDE.md) | PPT de preguntas PA-* por equipo |
| [`enumeracion-ppt-catálogo-funciones-PROMPT-CLAUDE.md`](../presentacion-stakeholders/enumeracion-ppt-catálogo-funciones-PROMPT-CLAUDE.md) | Catálogo de funciones en PPT |
| [`lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md`](../presentacion-stakeholders/lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md) | Comparativo “lo nuevo” |
| [`comparativo-funcional-procoop-vs-coopapps-PROMPT-CLAUDE-COMPLETO.md`](../presentacion-stakeholders/comparativo-funcional-procoop-vs-coopapps-PROMPT-CLAUDE-COMPLETO.md) | Comparativo funcional completo |
| [`comparativo-funcional-imagenes-exhaustivas-PROMPT-V10-V25-CLAUDE.md`](../presentacion-stakeholders/comparativo-funcional-imagenes-exhaustivas-PROMPT-V10-V25-CLAUDE.md) | Lotes de imágenes comparativas |
| [`comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`](../presentacion-stakeholders/comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md) | Variante imágenes F |
| [`img-n-lotes/PROMPT-A-pegar-primero.txt`](../presentacion-stakeholders/img-n-lotes/PROMPT-A-pegar-primero.txt) | Prefijo para trabajar por lotes IMG |

Publicados en el portal bajo **Presentación stakeholders**; en ZIP `04-presentacion-stakeholders.zip`.

### 3.3 Portal de documentación (este paquete)

| Prompt | Sección |
|---|---|
| **PORTAL-GEN-01** | §4.1 — Arranque sesión portal |
| **PORTAL-GEN-02** | §4.2 — Cambio en `docs/` + sync/build |
| **PORTAL-GEN-03** | §4.3 — URLs limpias y 404 en GitHub Pages |
| **PORTAL-GEN-04** | §4.4 — Publicación y smoke en producción |

---

## 4. Prompts pegables — portal GACAC

### PORTAL-GEN-01 — Arranque de sesión (portal)

```text
Sos el equipo que mantiene el portal VitePress de documentación GACAC (carpeta portal/).

1. Leé: portal/README.md, docs/portal/00-ESPECIFICACION-PORTAL-DOCUMENTACION.md, docs/portal/01-pasos-vibe-coding-claude-prompts.md (este archivo, §4–§5).
2. Confirmá en 5 líneas: rama actual, último cambio en docs/ o portal/, si hace falta npm run update, base VP_BASE (/GACAC-docs/ en producción).
3. No escribas código todavía. Esperá la tarea concreta (PORTAL-GEN-02 en adelante).
```

### PORTAL-GEN-02 — Actualizar documentación y regenerar sitio

```text
PORTAL-GEN-02 — Sync y build del portal
Contexto: el usuario cambió archivos en docs/, procoop-relevamiento/, referencia-connectia/ o portal/.

1. Identificá qué paquetes tocaron (portal/scripts/lib/paths.mjs → PACKAGES).
2. Si cambió navegación o hubs: revisá portal/scripts/lib/portal-ia.mjs (PORTAL_HOME_BLOCKS) y portal/scripts/sync-content.mjs (guía, índice /especificacion/).
3. Ejecutá en portal/: npm run update con VP_BASE=/GACAC-docs/ si el objetivo es paridad con GitHub Pages.
4. Ejecutá: node scripts/verify-dist-routes.mjs (debe salir OK).
5. Informá: archivos fuente editados, rutas nuevas en el menú, y si el workflow deploy-docs-portal.yml publicará solo (push main) o hace falta workflow_dispatch.
Regla: no reordenar docs/ en Git; solo portal/src es espejo generado.
```

### PORTAL-GEN-03 — Corregir 404 / enlaces rotos (GitHub Pages)

```text
PORTAL-GEN-03 — Enlaces y rutas estáticas
Problema: en producción (https://santillan2255.github.io/GACAC-docs/) alguna URL da 404 al refrescar o al entrar sin barra final.

1. Leé portal/scripts/mirror-clean-url-dirs.mjs y portal/scripts/verify-dist-routes.mjs.
2. Reproducí con GET (no confiar solo en HEAD de PowerShell).
3. Corregí: mirror foo/index.html, copy-public-assets sin pisar HTML, hubs en sync-content.mjs.
4. verify-dist-routes en dist con VP_BASE=/GACAC-docs/.
5. Listá rutas críticas: /, /guia-del-portal/, /especificacion/, /prototipo/index.html, enlaces del bloque landing en portal-ia.mjs.
```

### PORTAL-GEN-04 — Smoke post-deploy

```text
PORTAL-GEN-04 — Verificación en producción
Base: https://santillan2255.github.io/GACAC-docs/

1. GET a rutas del menú y a los enlaces del hero de la landing (portal/.vitepress/theme y portal-ia PORTAL_HOME_BLOCKS).
2. Navegá “Índice de anexos (menú)” → /especificacion/.
3. Abrí /prototipo/index.html (misma sesión de clave que el portal si aplica).
4. Reportá solo URLs con status >= 400 o título 404; el resto “OK”.
No commits salvo que detectes bug reproducible en main.
```

---

## 5. Pasos recomendados (orden) — construir o extender el portal

Secuencia usada para llevar el portal de cero a producción con vibe coding; cada paso = una o más sesiones Claude/Cursor con **PORTAL-GEN-01** al inicio.

| Paso | Qué se construye | Archivos / scripts clave | Verificación |
|---:|---|---|---|
| 1 | Esqueleto VitePress + sync desde `docs/` | `portal/`, `paths.mjs`, `sync-content.mjs` | `npm run dev` muestra paquetes |
| 2 | Sidebar por IA (`portal-ia.mjs`) + visor `/visor` | `generate-sidebar.mjs`, `MarkdownViewer.vue` | Anexo M01 abre en visor |
| 3 | Landing con bloques de entrega | `portal-ia.mjs` `PORTAL_HOME_BLOCKS`, `HomePortalSections.vue` | Home enlaza maestra y entregables |
| 4 | ZIP + Pagefind + manifiesto | `build-zips.mjs`, postbuild Pagefind | `/zips/MANIFEST.json` |
| 5 | Tema CoopApps + prototipo en `public/` | `copy-public-assets`, prototipo en `docs/entregables/.../25-prototipo-navegable` | `/prototipo/index.html` |
| 6 | GitHub Actions → `GACAC-docs` | `.github/workflows/deploy-docs-portal.yml`, `VP_BASE=/GACAC-docs/` | URL pública responde 200 |
| 7 | Mirror URLs limpias + `verify-dist-routes` | `mirror-clean-url-dirs.mjs` | Sin 404 en refresh |
| 8 | Gate de clave (disuasión) | `PasswordGate.vue`, `auth-guard.js`, `auth-config.mjs` | Prototipo respeta sesión |
| 9 | Hubs `/especificacion/`, norma/coherencia en sync | `writeEspecificacionIndexPage`, publicar MD nuevos en `docs/especificacion/` | Enlaces landing OK |
| 10 | Smoke producción (navegador o GET) | **PORTAL-GEN-04** | Cero 404 en rutas críticas |

Si el cambio es **solo contenido** (texto en `docs/especificacion/…`), bastan los pasos **2 → 4 → 6** (editar MD, `npm run update`, push `main`).

---

## 6. Pasos recomendados — producto CoopApps (resumen)

No duplicar los 174 prompts: seguir el plan oficial.

1. Pegar **PRO-GEN-01** (en [`03-plan`](../especificacion/03-plan-de-olas-y-prompts.md)).
2. Abrir **03-norma** §3 y aplicar sustitución GoodApps al leer cada `PRO-Ox-NN`.
3. Ejecutar el bloque ```text del siguiente **PRO-Ox-NN** en orden.
4. Antes del PR: **PRO-GEN-04** y actualizar [`04-matriz-trazabilidad.md`](../especificacion/04-matriz-trazabilidad.md) (R19).
5. Al terminar la ola: **PRO-GEN-02**.

Para **documentación derivada** (PPT, comparativos IMG), usá los prompts de §3.2; no mezclar con `PRO-O*` en la misma sesión.

---

## 7. Definition of done (portal)

- `npm run update` con `VP_BASE=/GACAC-docs/` sin error.
- `verify-dist-routes.mjs` → OK.
- Enlaces nuevos aparecen en landing (`portal-ia.mjs`) si son entrada visible.
- Si hay deploy: rutas críticas **200** en producción (§5 paso 10).
- Versión/fecha de este doc o de `00-ESPECIFICACION-PORTAL` actualizada si cambió el proceso.

---

## 8. Referencias

- [`00-ESPECIFICACION-PORTAL-DOCUMENTACION.md`](00-ESPECIFICACION-PORTAL-DOCUMENTACION.md) — requisitos del portal  
- [`portal/README.md`](../../portal/README.md) — comandos  
- [`03-plan-de-olas-y-prompts.md`](../especificacion/03-plan-de-olas-y-prompts.md) — prompts de construcción CoopApps  
- [`03-norma-ejecucion-goodapps.md`](../especificacion/03-norma-ejecucion-goodapps.md) — stack GoodApps en prompts  
- [Guía del portal en el sitio](/guia-del-portal/) — mapa de lectura para humanos  

---

*Documento vivo: al agregar un `*PROMPT-CLAUDE*` nuevo en stakeholders o un script portal relevante, actualizar §3 y la versión del encabezado.*