# Especificación — Portal web de documentación GACAC / CoopApps

| Campo | Valor |
|---|---|
| Versión del documento | 1.0 |
| Fecha | 19-11-2026 |
| Estado | **Implementado** en `portal/` (VitePress + visor Markdown para anexos extensos) |
| Alcance | Landing, lectura de Markdown, navegación por índices, búsqueda global y descarga ZIP por paquetes |
| Relación con la especificación funcional | Este artefacto **no** forma parte del alcance CoopApps. Describe **cómo publicar** la documentación del repo. Ante duda de contenido de negocio, prevalece `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`. |

---

## 1. Objetivo

Disponibilizar en una **landing accesible y clara** toda la documentación del proyecto que vive en local dentro de `GACAC`: especificación, entregables de análisis y diseño, relevamiento, material de stakeholders, alcance, marca y archivo de trabajo. Cada documento debe leerse en **Markdown renderizado** (tablas, código, diagramas Mermaid), con **índices y apartados** fáciles de seguir, **búsqueda en todo el corpus** y **descarga en ZIP por partes** desde la misma landing.

### 1.1 Veredicto de viabilidad

**Sí, es viable.** El repositorio ya tiene índices maestros, estructura por paquetes y cientos de `.md` enlazados. No hace falta reescribir la documentación: hace falta un **visor estático** (generado en build) con navegación, TOC por página, buscador y empaquetado ZIP.

---

## 2. Decisiones de producto (cerradas)

| Tema | Decisión |
|---|---|
| Alcance en el sitio | Documentación **vigente** (~417 `.md` sin `_trabajo`, `OLD`, `backup`, `_descartados`, `binarios`) más carpetas auxiliares en sección aparte **«Archivo / borradores»** |
| Acceso | URL publicable con **clave compartida** entre el equipo (autenticación en hosting; no solo JavaScript en el cliente) |
| Capturas ProCoop | **No** incluir en web ni ZIP (`procoop-relevamiento/capturas/` — datos personales; ver README del relevamiento) |
| Búsqueda | **Imprescindible** desde el MVP (DEC, CU, pantallas, módulos M/T, etc.) |
| Binarios ProCoop | **Fuera** del sitio y ZIP por defecto (`procoop-relevamiento/binarios/`) |

### 2.1 Decisiones de implementación (19-11-2026)

| Tema | Resolución |
|------|------------|
| Título landing | **CoopApps — Documentación GACAC** |
| Prototipo | Enlace `/prototipo/index.html` en `public/` |
| Archivo en web | Índice + ZIP `99-archivo-completo.zip` (sin pre-render de `_trabajo`/`OLD` en el sitio) |
| Anexos muy grandes | **Visor Markdown** (`/visor?p=…` + copia en `/raw/`) para anexos M/T y subárboles voluminosos de entregables |
| Artefactos `_trabajo` | Solo en ZIP, no en sitio estático |

---

## 3. Inventario del repositorio (referencia)

Cifras tomadas del análisis del 19-11-2026; conviene **regenerar en cada build** o con script de inventario (ver §10).

| Área | Aprox. | Rol |
|------|--------|-----|
| Total proyecto | ~425 MB, **928** `.md` | — |
| Documentación vigente | **~417** `.md` | Lectura principal |
| Auxiliar / archivo | **~511** `.md` en `_trabajo`, `OLD`, backups, etc. | Sección «Archivo / borradores» |
| `docs/especificacion/` | 242 md, ~70 MB | Maestra `00`, decisiones, anexos M/T, DDL |
| `docs/entregables-analisis-diseno/` | 537 md, ~153 MB | `00-INDICE.md`, BPMN, ER, CU, OpenAPI, prototipo |
| `docs/presentacion-stakeholders/` | 90 md | Comparativos, prompts, lotes IMG |
| `docs/alcance-funcional/`, `base-funcional/`, `revision-externa/`, `brand/` | ~26 md | Alcance, revisión, marca |
| `procoop-relevamiento/` | 32 md (texto) | Relevamiento; sin capturas ni binarios en portal |
| `referencia-connectia/` | 1 md | Referencia histórica |
| Diagramas | **317+** archivos con bloques `mermaid` | Render obligatorio en build |

**Índices rectoras existentes** (el menú del portal debe apoyarse en ellos):

- `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
- `docs/entregables-analisis-diseno/00-INDICE.md`
- `procoop-relevamiento/reglas-negocio/00-indice.md` (y README del relevamiento)

**Retos técnicos:** documentos muy largos (p. ej. anexos T02/T03), miles de enlaces relativos `.md` → `.md`, duplicación si vigente y archivo no están claramente separados en la UI.

---

## 4. Experiencia de usuario

### 4.1 Landing

- Hero del proyecto (CoopApps / GACAC según decisión §2.1): propósito del paquete documental, versión o fecha de build, enlaces rápidos a **Especificación maestra** e **Índice de entregables**.
- **Tarjetas por paquete documental** (explorar + descargar ZIP):

  1. Especificación  
  2. Entregables análisis y diseño  
  3. Relevamiento ProCoop (solo texto)  
  4. Presentación stakeholders  
  5. Alcance, base funcional y revisión externa  
  6. Marca e identidad  
  7. Referencia Connectia  
  8. **Archivo / borradores** (`_trabajo`, `OLD`, backups, `_descartados`) — badge «no vigente»

- En cada tarjeta: cantidad de documentos (vigentes), botón **Explorar** y **Descargar ZIP**.
- Aviso de uso interno donde aplique (documentación de negocio sensible en texto).

### 4.2 Lector de Markdown

- Tipografía legible, ancho de lectura contenido, tablas con scroll horizontal si hace falta, bloques de código resaltados.
- **Tabla de contenidos** lateral (H2–H4) en páginas largas; ancla «volver arriba».
- **Migas de pan:** Paquete → carpeta → documento.
- Enlaces internos entre `.md` resueltos a rutas del sitio generado.
- Pie opcional: ruta del archivo fuente en el repo (para quien edita en Cursor).

### 4.3 Navegación en tres capas

| Capa | Fuente |
|------|--------|
| Sidebar global | Paquetes + árbol de carpetas |
| Índices oficiales | Páginas que reflejan o enlazan `00-INDICE`, maestra §índice, etc. |
| Búsqueda | Índice full-text sobre HTML generado |

Los archivos `*PROMPT*` de generación con IA pueden agruparse bajo «Herramientas / generación» para no mezclarlos con entregables contractuales.

### 4.4 Contenido no Markdown

| Recurso | Tratamiento |
|---------|-------------|
| `docs/entregables-analisis-diseno/25-prototipo-navegable/` | Enlace «Abrir prototipo» (copiar a `public/` en build) |
| OpenAPI / Swagger en `18-openapi/`, `18-swagger/` | Visor estático o descarga `.yaml` / `.json` |
| Assets `docs/brand/coopapps/` | Tema visual del portal |

---

## 5. Descarga ZIP por partes

Generar en **cada build** (misma versión que el sitio publicado):

| Archivo ZIP | Contenido |
|-------------|-----------|
| `01-especificacion.zip` | `docs/especificacion/` vigente |
| `01a-archivo-especificacion.zip` | Solo `_trabajo` / `OLD` bajo especificación (opcional) |
| `02-entregables-analisis-diseno.zip` | Entregables sin `_trabajo` / `_descartados` |
| `03-relevamiento-procoop.zip` | `.md` relevamiento y reglas; **sin** `capturas/` ni `binarios/` |
| `04-presentacion-stakeholders.zip` | `docs/presentacion-stakeholders/` (criterio vigente vs archivo) |
| `05-alcance-base-revision.zip` | alcance, base, revisión externa |
| `06-marca-referencia.zip` | brand + `referencia-connectia/` |
| `99-archivo-completo.zip` | Carpetas auxiliares acordadas en §2 |
| `GACAC-documentacion-vigente.zip` | Unión de paquetes vigentes 01–06 |

Cada ZIP incluye `MANIFEST.json`: lista de archivos, fecha de build, hash o commit git si está disponible.

---

## 6. Acceso y seguridad

- Sitio **estático** (salida `dist/` o equivalente).
- **Clave compartida:** preferir protección en hosting (Basic Auth, Cloudflare Access, regla en Azure Static Web Apps, etc.). Un gate solo en el navegador no es seguridad real.
- **Excluido por política:** capturas con datos personales; binarios/decompilado ProCoop en descargas por defecto.
- Si la clave se filtra, el riesgo se mitiga por no publicar capturas y por aviso de confidencialidad en la landing.

---

## 7. Búsqueda global

- Motor tipo **Pagefind** (u opción equivalente del generador elegido) sobre el HTML del build.
- Búsqueda full-text en corpus vigente; filtro opcional por paquete (incluir pestaña o filtro «Archivo»).
- Reindexar en cada build; no manual.

---

## 8. Enfoque técnico recomendado

Ubicación sugerida del código del portal: carpeta nueva en la raíz del repo, p. ej. `portal/` (no existe `package.json` hoy).

**Recomendación principal:** **VitePress** o **Astro Starlight**.

- Pre-render en build (rendimiento en anexos grandes).
- Soporte Mermaid y TOC.
- Tema alineado a `docs/brand/coopapps/`.
- Sidebar generable por script desde índices `00-*` y árbol de directorios.

**Alternativa:** MkDocs Material (robusto para volumen; UI menos «producto»).

**No recomendado como única solución:** lector Markdown solo en runtime en el navegador para documentos de cientos de KB.

### 8.1 Calidad en build

- Comprobación de **enlaces rotos** entre páginas generadas (reporte en CI o post-build).
- Transformación consistente de enlaces `.md` relativos.

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Enlaces rotos | Checker en build |
| Páginas muy largas | TOC, anclas; opcional fragmentación futura |
| Mezcla vigente / archivo | Sidebar y ZIP separados; etiqueta «Archivo» |
| Capturas / datos personales | Exclusión explícita (§2) |
| Clave filtrada | Auth en hosting + sin capturas |

---

## 10. Actualización cuando cambie la documentación

El portal **no es la fuente de verdad**; la fuente sigue siendo el árbol `docs/`, `procoop-relevamiento/` y carpetas hermanas. Cada cambio en especificación, entregables o relevamiento debe reflejarse en el sitio publicado mediante **regeneración**, no editando HTML a mano.

### 10.1 Disparadores de actualización

Regenerar sitio, buscador y ZIP cuando ocurra cualquiera de:

- Cambios en `docs/especificacion/` (maestra, `01-registro-decisiones`, anexos, DDL, `02-preguntas-abiertas`, etc.).
- Cambios en `docs/entregables-analisis-diseno/` (nuevos entregables, versiones de `00-INDICE.md`).
- Cambios en relevamiento, stakeholders, alcance, marca o referencia Connectia.
- Altas o bajas en carpetas `_trabajo` / `OLD` si siguen publicándose en «Archivo».
- Cambios en esta especificación del portal (`docs/portal/00-ESPECIFICACION-PORTAL-DOCUMENTACION.md`).

### 10.2 Flujo operativo (manual o CI)

1. **Commit** de la documentación en git (como hoy).
2. Ejecutar en `portal/`:  
   - `npm run build` (o comando equivalente): genera HTML, índice de búsqueda, ZIPs y `MANIFEST.json`.  
   - Opcional: `npm run check-links` si existe.
3. **Desplegar** la carpeta de salida al hosting protegido con clave.
4. Actualizar en la landing la **fecha de build** y, si aplica, **versión de la especificación** leída de la maestra (campo Versión/Fecha de `00-ESPECIFICACION-MAESTRA.md`).

### 10.3 Automatización recomendada (fase 2)

- Pipeline (GitHub Actions u otro) que en push a `main` (o tag) ejecute build + deploy.
- Script `portal/scripts/sync-meta.ts` (o Python en `scripts/`) que lea:
  - Versión/fecha de `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
  - Versión de `docs/entregables-analisis-diseno/00-INDICE.md`
  - Conteos de `.md` por paquete  
  y los escriba en `portal/.vitepress/theme/home-meta.json` (o equivalente) para la landing.

### 10.4 Versionado de **esta** especificación

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.0 | 19-11-2026 | Especificación inicial tras análisis de inventario y decisiones de alcance, acceso, capturas y búsqueda. |
| 1.1 | 19-11-2026 | Portal implementado en `portal/` (comandos en `portal/README.md`). |

Al modificar requisitos del portal (nuevos ZIP, otra regla de archivo, otro tipo de auth), **incrementar la versión** en la tabla del encabezado y registrar una fila en §10.4.

### 10.5 Criterio de coherencia

Si el contenido publicado en el portal **contradice** la especificación funcional vigente, **prevalece siempre** la especificación en `docs/especificacion/`. El portal solo muestra copia renderizada; la corrección se hace en los `.md` fuente y luego un nuevo build.

---

## 11. Esfuerzo estimado

| Fase | Contenido | Orden de magnitud |
|------|-----------|-------------------|
| MVP | Landing, paquetes vigentes, TOC, sidebar, Mermaid, ZIP, Pagefind | 2–4 días |
| Pulido | Tema CoopApps, índices espejo, prototipo + OpenAPI | +2–3 días |
| Archivo | Sección auxiliar + ZIP 99 | +1 día |
| Publicación | Deploy con clave, MANIFEST, smoke de enlaces | +0,5–1 día |

---

## 11b. Uso (post-implementación)

```bash
cd portal
npm install
npm run dev      # http://localhost:5173
npm run update   # tras cambios en docs/: sync + build + ZIP + Pagefind
npm run preview  # sirve .vitepress/dist/
```

Ver `portal/README.md` para detalle de scripts, visor de anexos y despliegue con clave.

**Producción:** https://santillan2255.github.io/GACAC-docs/ (workflow en `.github/workflows/deploy-docs-portal.yml` → repo público `GACAC-docs`).

---

## 12. Referencias internas

- `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` — alcance del producto CoopApps  
- `docs/entregables-analisis-diseno/00-INDICE.md` — mapa de entregables formal  
- `procoop-relevamiento/README.md` — política de capturas y datos personales  
- `docs/brand/coopapps/` — identidad visual para el tema del portal  

---

*Documento vivo: actualizar §10.4 y la versión del encabezado cuando cambien los requisitos del portal o el proceso de publicación.*