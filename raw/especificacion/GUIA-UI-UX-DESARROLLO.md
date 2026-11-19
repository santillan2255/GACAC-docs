# Guía UI/UX para todo el desarrollo — CoopApps

| Campo | Valor |
|---|---|
| Versión | 1.1 |
| Fecha | 19-11-2026 |
| Estado | Vigente |
| Audiencia | Desarrollo front y full stack, diseño, QA, export GoodApps |

> **Documento de entrada.** Esta guía es el **apartado exclusivo** de UI/UX para implementar cualquier pantalla, flujo o componente. Stack UI vigente: **React 19** (DEC-113). El detalle normativo completo vive en **`anexos/T03-UXD-experiencia-marca-diccionario.md`**. Export al cliente: redacción afirmativa según **DIR-13** en `06-impacto-adaptacion-stack-goodapps.md`.

## Índice

1. [Jerarquía documental](#1-jerarquía-documental)
2. [Aplicaciones y shell obligatorio](#2-aplicaciones-y-shell-obligatorio)
3. [Checklist por pantalla nueva](#3-checklist-por-pantalla-nueva)
4. [Reglas no negociables](#4-reglas-no-negociables)
5. [Tokens y temas (resumen)](#5-tokens-y-temas-resumen)
6. [Componentes: usar solo el catálogo](#6-componentes-usar-solo-el-catálogo)
7. [Reglas UX transversales](#7-reglas-ux-transversales)
8. [Diccionario y microcopy](#8-diccionario-y-microcopy)
9. [Marca en runtime](#9-marca-en-runtime)
10. [Ayuda al usuario](#10-ayuda-al-usuario)
11. [IA en la interfaz](#11-ia-en-la-interfaz)
12. [Accesibilidad mínima (WCAG 2.2 AA)](#12-accesibilidad-mínima-wcag-22-aa)
13. [Anti‑patrones prohibidos](#13-antipatrones-prohibidos)
14. [Stack de implementación](#14-stack-de-implementación)
15. [Mapa de profundidad en T03](#15-mapa-de-profundidad-en-t03)

---

## 1. Jerarquía documental

| Prioridad | Documento | Uso en desarrollo |
|---|---|---|
| 1 | **Esta guía** | Decisiones diarias: qué shell, qué componente, qué regla |
| 1b | **`08-identidad-marca-coopapps.md`** | Paleta y logos del **producto** CoopApps; assets `docs/brand/coopapps/` |
| 2 | **T03 UXD** | Tokens, RF-UXD-*, catálogo §10.2, mapa del sitio §10.8, pantallas PAN-UXD-* |
| 3 | **`00-ESPECIFICACION-MAESTRA.md` §8–11** | Resumen de apps, layouts y design system |
| 4 | **Anexo del módulo** (M01…M19, T*) | Contenido funcional: campos, flujos, `PAN-<COD>-NN`, capabilities |
| 5 | **CNX** (`referencia-connectia/…`) | Referencia histórica Connectia; prevalencia vía T03 |
| 6 | **`06-impacto-adaptacion-stack-goodapps.md`** | Adaptación marca/stack (CoopApps, React, SQL); no recorta UX |

**Regla:** Los módulos **no inventan** layouts ni componentes paralelos. Describen la pantalla en su anexo; la **forma** la cumple T03 + esta guía.

---

## 2. Aplicaciones y shell obligatorio

Toda ruta debe montarse dentro de **un solo** MainLayout según la app:

| App | Paquete / meta | Layout | API base |
|---|---|---|---|
| Admin cooperativa | `apps/admin`, `meta.tenantOnly` | `AdminShell` + página §10.1.2 | `/api/admin/*` |
| Consola plataforma | `meta.platformOnly` | `PlatformShell` | `/api/platform/*` |
| PWA socio / empleado / campo | `apps/pwa` | `AppShell` + `.pwa-mod` en contenido | `/api/*` |
| Landing pública | `apps/landing` | `LandingLayout` | `/api/public/{slug}/*` |

Diagramas y zonas: **T03 §10.1** (`AdminShell`, `AppShell`, `ScreenHelp`, tabbar, FAB).

| Principio | Referencia |
|---|---|
| Un **H1** por vista (PWA) | RF-UXD-017 |
| **Una tarea principal** por pantalla (socio) | BASE §102.5.6 |
| Menú lateral = mismo árbol que mapa del sitio y perfiles T02 | RF-UXD-047 |
| PWA en escritorio: **phone shell** 430 px (salvo excepción PA-UXD-11) | T03 §10.1.4 |

---

## 3. Checklist por pantalla nueva

Completar **antes** de dar por cerrada una `PAN-<COD>-NN` (en PR o export):

- [ ] **`screenId`** estable y entrada en `siteMapGroups` (código versionado, T03 §10.8).
- [ ] Ruta registrada; capability de **ver** alineada con T02 (`modulo.recurso.ver`).
- [ ] Contenido dentro del **shell** correcto (§2).
- [ ] Títulos, botones, vacíos y errores solo vía **`dict:<clave>`** (sin literales en UI).
- [ ] Listado admin: **`DataTable`** (no tabla custom). Listado PWA: **`ListCard`** con anatomía §10.3.1.
- [ ] Alta PWA: **modal desde FAB**, sin ruta `/nuevo` (RF-UXD-099).
- [ ] **`ScreenHelp`** base (6 preguntas + CU) o enlace explícito a CU en spec.
- [ ] Estados: carga (skeleton), vacío (ilustración + acción), error (reintentar + `requestId`).
- [ ] Formularios: errores **inline** + resumen; dinero con **`MoneyInput`**; fechas `dd-mm-yyyy`.
- [ ] Acciones destructivas: **`ConfirmDialog`** / **`ConfirmSheet`**; económicas críticas con confirmación por tipeo.
- [ ] Accesibilidad: foco en modales, labels, contraste, teclado en flujo principal.
- [ ] Caso de prueba CP-* que cite el RF del módulo y un RF-UXD aplicable.

---

## 4. Reglas no negociables

1. **Cero texto fijo visible** fuera del diccionario (RF-UXD-141/142). El CI debe rechazar literales en plantillas.
2. **Cero tablas admin ad hoc** (RF-UXD-082). Vistas guardadas y export sobre el mismo `DataTable`.
3. **Cero menú duplicado**: una fuente `siteMapGroups` (RF-UXD-047).
4. **Cero `alert()` del navegador** (RF-UXD-102).
5. **Cero importes con `Number` de JS** en UI (RF-UXD-087; ver convenciones de dinero en maestra §13).
6. **Cero color como único indicador de estado** (RF-UXD-091): ícono + texto.
7. **Cero publicación directa desde IA** (RF-UXD-052): borrador marcado «Propuesta de IA».
8. **Marca CoopApps** en login/splash/manifest; cooperativa en operación (DEC-109, T03 §1.1).

---

## 5. Tokens y temas (resumen)

Detalle completo: **T03 §7.A**.

### Admin (`data-theme` en `<html>`)

- Oscuro por defecto: `--canvas #111019`, `--panel #1e1a2b`, `--brand #6b5bf0`, estados `ok/warn/bad`, radios `--r 12px` / `--r-s 9px`.
- Tipografías: **Space Grotesk** (títulos), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (importes, códigos, tabular).
- Componentes consumen **tokens CSS**; hex literales solo en `tokens.css`.

### PWA (`.pwa-mod` + tema global)

- Fondo glow obligatorio; tokens `--pwa-brand`, `--pwa-lilac`, `--pwa-line`, radios 14/18 px.
- Tipografía: **Sora** (stack CNX); importes con cifras tabulares.
- Login y splash **siempre oscuros** (RF-UXD-016).

### Marca del tenant

Solo pisan variables de marca (`applyBrandingCssVars`, RF-UXD-025); el resto hereda del design system.

---

## 6. Componentes: usar solo el catálogo

Catálogo normativo: **T03 §10.2** (134 componentes). Agrupaciones:

| Necesidad | Componente(s) | § T03 |
|---|---|---|
| Listado backoffice | `DataTable`, `DataTableToolbar`, `FilterBar`, `BulkActionBar` | 10.2.2 |
| Listado PWA | `ListCard`, `PwaFilters`, `InfiniteList` / paginación | 10.2.2, 10.3.1 |
| Ficha entidad | `EntityDetailLayout`, `Timeline`, `StatusBadge` | 10.2.2 |
| Formulario | `FormField`, `MaskedInput`, `MoneyInput`, `DateInput`, `EntityPicker`, `AddressPicker` | 10.2.3 |
| Import masivo | `ExcelImportWizard` | 10.2.3, RF-UXD-083 |
| Feedback | `ToastHost`, `ConfirmDialog`, `ConfirmSheet`, `JobProgress` | 10.2.4 |
| Comunicaciones | **`AudiencePicker` único** (no duplicar) | RF-UXD-086 |
| BI | `BiKpiGrid`, vacío honesto, tabla alternativa en gráficos | 10.2.5, RF-UXD-010 |
| Offline campo | `PwaOfflinePendingBanner`, `useOfflineQueue` | 10.2.4, RF-UXD-095 |

Si falta un componente, se **extiende** `packages/ui` con historia en catálogo interno (`/plataforma/design-system`, RF-UXD-097), no se copia en el módulo.

**Composables obligatorios** (10.2.7): `dict()`, `formatDate`, `formatMoney`, `useToast`, `useConfirm`, `notifKinds`, `useCreateAction` (FAB), `useBranding`, `useSiteMap`.

---

## 7. Reglas UX transversales

Resumen de **T03 §5.8** y **§10.3.2**:

| Tema | Regla |
|---|---|
| Carga | 3 skeleton cards o 8 filas; refresh con opacidad, sin vaciar lista |
| Fechas visibles | Solo `formatDate` → `dd-mm-yyyy` (zona tenant) |
| Pestañas | Línea inferior (`TabsLine`); chips solo en barra de filtros |
| Vacíos | Ilustración + título comercial + CTA (`dict:ui.vacio.*`) |
| Paginación | Servidor `?page=&size=`; export respeta filtros y alcance |
| Procesos largos | Barra de job, abandonable, aviso al terminar |
| Integraciones | Estados Pendiente / Confirmado / Fallido / Resultado incierto visibles |
| Microcopy PWA | Segunda persona («Ingresá», «Tenés»); todo por diccionario |
| Navegación PWA | Atrás del sistema cierra modal antes de salir de la ruta |

---

## 8. Diccionario y microcopy

- Resolver textos con **`dict('<clave>')`** y fallback tenant → producto (T03 §5.11, §9).
- Claves estables `namespace.objeto.variante`; tipos `term` | `label` | `message` | `help` | `legal`.
- Pluralización y género: ICU subset / `{t:…}` (RF-UXD-145, RF-UXD-146).
- Etiquetas de tabbar: variante **corta** ≤ 12 caracteres (RN-UXD-006).
- Textos **protegidos** (fiscal/legal): no editables por tenant (RN-UXD-034).

Editor y publicación: PAN-UXD-* en T03; mismos patrones borrador → publicado que T04.

---

## 9. Marca en runtime

- Cargar marca pública sin PII: `GET /api/public/{slug}/branding`.
- Aplicar: `applyBrandingCssVars`, `applyTenantPwaIdentity`, manifest dinámico, `theme-color` (RF-UXD-025–027).
- Logos por **canal** (`admin`, `pwa-socio`, `landing`, `documentos`, …); jerarquía tenant → sucursal → producto.
- Facturas y emails usan `brandAssets` canal `documentos` + diccionario.

---

## 10. Ayuda al usuario

| Canal | Mecanismo | Dónde se configura |
|---|---|---|
| **Todas las pantallas admin/PWA** | `ScreenHelp` (`?`): qué/quién/cuándo/dónde/por qué/cómo + CU | T03 §10.1.3; editor PAN-UXD-06; `screenHelpArticles` |
| **Landing / PWA ayuda** | FAQ por tema, bloque `faq` | M19 PAN-POR-15, `/ayuda`, `/app/ayuda` |
| **Bot** | Intención `faq` + lista Q&A | M09 PAN-CRM-17 |

No existe un **FAQ global del ERP** en admin: la cobertura operativa es **ayuda por pantalla** (ScreenHelp). Ver `06-impacto-adaptacion-stack-goodapps.md` §6.1 y **§6.2** (necesidad FAQ vs cobertura en todo el sistema; inventario en export).

---

## 11. IA en la interfaz

- Principio **P6** (maestra §1.3): la IA **propone**, la persona **confirma**; auditoría obligatoria.
- UI: `AiProposalPanel`, `BiAiDrawer`, badge `dict:ui.ia.propuesta` (RF-UXD-052).
- Asistente PWA: solo si flag `pwa.asistente` (T03 §10.1.4); dominio M09.

---

## 12. Accesibilidad mínima (WCAG 2.2 AA)

Objetivo **RF-UXD-123**. Checklist de entrega:

- [ ] Flujo principal operable solo con teclado (modales atrapan foco).
- [ ] Contraste 4,5:1 texto / 3:1 UI con colores del tenant (RF-UXD-032, 125).
- [ ] Labels + `aria-describedby` en campos; H1 único por vista.
- [ ] Estado nunca solo por color (ícono + texto).
- [ ] Objetivos táctiles ≥ 24 px (44 px recomendado en PWA).
- [ ] `lang="es-AR"`; `prefers-reduced-motion` respetado.
- [ ] Ayuda `?` en la **misma ubicación** en todas las pantallas (RF-UXD-131).
- [ ] Gráficos: botón «Ver como tabla».

Matriz extendida: **T03 §10.5**.

---

## 13. Anti‑patrones prohibidos

| Anti‑patrón | Hacer en su lugar |
|---|---|
| Tabla HTML propia en admin | `DataTable` + vistas guardadas |
| Spinner centrado en lista PWA | 3× `SkeletonCard` |
| Ruta `/nuevo` en PWA | Modal + FAB |
| Segundo picker de audiencia | `AudiencePicker` (T09 consume el mismo) |
| Menú hardcodeado por módulo | Ítem en `siteMapGroups` |
| `toLocaleDateString` suelto | `formatDate` |
| Subir archivos a carpeta pública | `FileUploader` privado + URL firmada |
| KPI en 0 sin datos | Vacío honesto `dict:bia.vacio.honesto` |
| Texto en español en JSX/TSX sin clave | Clave en catálogo + `dict()` |
| Variante visual «porque es facturación» | Tokens y componentes compartidos |

---

## 14. Stack de implementación

| Tema | Especificación | Nota |
|---|---|---|
| UI normativa | T03 (comportamiento y tokens) | Independiente del framework |
| Stack vigente GoodApps | DEC-111, DEC-113 | **.NET 10**, **React 19**, **shadcn/ui** donde equivalga a componentes T03 |
| Migración desde spec Vue/Connectia | T03 a reescribir ejemplos hacia React | Reglas de §4–13 **no cambian** |

Implementación: biblioteca compartida (`packages/ui` o equivalente monorepo GoodApps) es dueña de componentes §10.2; apps solo componen pantallas.

---

## 15. Mapa de profundidad en T03

| Necesito… | Ir a T03 |
|---|---|
| RF completos UX | §5 (5.1–5.12) |
| Reglas de negocio UXD | §6 |
| Tokens y colecciones UX | §7 |
| Layouts y wire ASCII | §10.1 |
| Lista de componentes | §10.2 |
| Reglas de cards y modales | §10.3 |
| Login paso a paso | §10.4 |
| WCAG detallado | §10.5 |
| Pantallas de configuración UXD | §10.6 |
| Mapa del sitio completo (SM-*) | §10.8 |
| APIs branding/diccionario/mapa | §11 |
| Recorridos de prueba accesibilidad | §17 |

---

### Bitácora

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 19-11-2026 | Creación del apartado exclusivo; enlace desde maestra §11 y guía de anexos |
| 1.1 | 19-11-2026 | Enlace a `08-identidad-marca-coopapps.md` (DEC-119) |