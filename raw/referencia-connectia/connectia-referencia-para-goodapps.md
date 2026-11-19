# Connectia como referencia para el ERP de cooperativas (GoodApps)

Relevamiento de solo lectura del proyecto `C:\Users\lenovo\Documents\CONNECTYX\connectia` (último commit `ba3598a`, 03-11-2026), para reutilizar su stack, su UI/UX, su panel admin, su PWA móvil y, en particular, **Muro, Novedades y Encuestas**.

Estado: **stack no decidido todavía**. Este documento deja todo lo necesario para que, si se elige el camino Mongo + Node + Vue, se pueda copiar sin volver a investigar.

Leyenda de marcas usadas en todo el documento:

| Marca | Significado |
|---|---|
| **[COPIAR]** | Llevar tal cual (o casi). Ya es genérico. |
| **[ADAPTAR]** | Llevar, pero cambiar nombres/dominio (de retail/RRHH a cooperativa). |
| **[MEJORAR]** | Connectia lo tiene resuelto de forma débil o duplicada; hacerlo mejor desde el día uno. |
| **[NO LLEVAR]** | Específico del cliente ECR/SAP o de RRHH, no aplica. |

---

## 1. Resumen ejecutivo

- Connectia es una plataforma SaaS multi-empresa con tres aplicaciones: **API** (Node + Express + Mongoose), **PWA móvil** (Vue 3) y **panel admin web** (Vue 3). Todo en un monorepo, desplegado con Docker en AWS EC2.
- Tamaño actual: 115 colecciones Mongo, 133 routers, 100 pantallas en la PWA, 69 en el admin, 306 archivos de test.
- **Lo más valioso para copiar:**
  1. El **design system de la PWA** ("piel oscura" tipo login, tokens CSS, branding por cliente en runtime, manifest de instalación por cliente).
  2. El **modelo de permisos en dos ejes**: qué pantalla abre (capability) y sobre quién/qué opera (alcance). Más la capa de **licenciamiento** por cliente.
  3. **Muro** (publicaciones, reacciones, comentarios, menciones, moderación con IA, programación, fijado, vencimiento).
  4. **Novedades** (boletín/revista con aprobación + centro de comunicaciones email/WhatsApp/SMS).
  5. **Encuestas** (31 tipos de pregunta, lógica condicional, scoring, offline, link externo sin login, sala de inteligencia con IA).
  6. El patrón **offline del técnico de campo** (cola local + fotos en IndexedDB + sync idempotente).
  7. El patrón de **BI "cubo certificado + IA que solo cita datos"**.
- **Lo que hay que hacer mejor** (el propio equipo de Connectia lo documenta como deuda): rate limiting inexistente, `/uploads` público, CORS abierto por defecto, tres motores de audiencia distintos, menú del admin "reparado" en runtime, sin componente genérico de tabla ni de importación Excel, sin bóveda de credenciales de integraciones por cliente, jobs con `setInterval` (no escala horizontal).

---

## 2. Stack y arquitectura

### 2.1 Versiones

| Capa | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js (ESM puro, `"type": "module"`) | 20.18 (imagen `node:20.18.0-alpine`) |
| HTTP | Express | ^4.21 |
| Base de datos | MongoDB + Mongoose | Mongo 7 / Mongoose ^8.9 |
| Auth | `jsonwebtoken` (JWT propio HS256) + `bcryptjs` | ^9 / ^2.4 |
| Uploads | `multer` (disco local) | ^2.2 |
| Mail | `nodemailer` (Gmail/SMTP/SES) | ^7 |
| Push | `web-push` (VAPID, sin Firebase) | ^3.6 |
| SMS / WhatsApp | Twilio / Meta Cloud API por HTTP | — |
| Excel / PDF | `exceljs`, `xlsx`, `pdfkit`, `pdf-parse`, `mammoth`, `qrcode` | — |
| IA | OpenAI / Anthropic por HTTP directo (`AI_PROVIDER=auto`) | — |
| Logs | `morgan` | — |
| Tests | `node --test` nativo + k6 para carga | — |
| Frontend y admin | Vue 3.5 + Vite 6 + Pinia 2 + Vue Router 4 + Tailwind 3.4 + axios | — |
| PWA | `vite-plugin-pwa` (Workbox, `autoUpdate`) | ^1.3 |
| Mapas | Leaflet (OSM) + links a Google Maps/Waze | ^1.9 |
| Export client-side (admin) | `xlsx`, `docx`, `jspdf` | — |

No usan librería de componentes (ni Vuetify, ni PrimeVue, ni Quasar), ni de iconos, ni de gráficos, ni de i18n. Todo es CSS propio + Tailwind + SVG.

### 2.2 Estructura del repositorio

```
connectia/                 ← raíz del repo (docs CONNECTIA-*.md, Dockerfile, docker-compose.yaml, nginx.config, deploy/)
  connectia/
    backend/               ← API Node
      server.js            ← entrypoint único: monta ~140 routers, CORS, estáticos, schedulers
      src/
        config/            ← conexión Mongo
        constants/         ← catálogos: capabilities admin, menú, módulos vendibles (moduleCatalog.js)
        lib/               ← ~300 helpers de dominio puros (sin red)
        services/          ← ~140: IO externo (mail, push, WhatsApp, IA, SAP) y schedulers
        middleware/auth.js ← JWT + RBAC + alcance
        models/            ← 115 esquemas Mongoose
        routes/            ← 133 routers (uno por dominio; admin y miembro separados)
        scripts/           ← seeds y migraciones idempotentes (npm run seed:*)
        tests/             ← 306 *.test.js
    frontend/              ← PWA móvil (usuario final)
    admin/                 ← panel web de administración
    contracts/             ← OpenAPI de integraciones externas
```

**[COPIAR]** la convención `lib/` (lógica pura, testeable) vs `services/` (habla con el exterior) vs `routes/` (HTTP + orquestación). No hay capa de controllers: el handler vive en el router.

### 2.3 Multi-empresa (multi-tenant)

- **Una sola base Mongo**, aislamiento por campo `tenantId` en cada colección; todos los índices compuestos empiezan por `tenantId`.
- El tenant **no se elige en el request**: sale del JWT (`user.tenantId`). No hay header `X-Tenant` que se pueda falsificar.
- Pre-login: `POST /api/auth/pre-login` con el código de empresa (`empCodigo`) devuelve branding y métodos de login de esa empresa, sin revelar usuarios.
- Tenant especial `PLATFORM` = el proveedor del software (super-admin que gestiona clientes y licencias).

> **Decisión pendiente para GoodApps:** el plan original preveía **una base por cooperativa**. Connectia usa **una base compartida con `tenantId`**. Con Mongo ambas son viables; la compartida simplifica operación y BI cruzado, la separada da aislamiento fuerte (útil por datos fiscales y personales de socios). Definir antes de diseñar.

### 2.4 Licenciamiento y permisos (tres capas)

| Capa | Pregunta que responde | Dónde vive |
|---|---|---|
| **Licencia** | ¿Qué módulos compró esta empresa? | `Tenant.licensedCapabilities` + catálogo `constants/moduleCatalog.js` (cada módulo: `id`, `label`, `group`, `packs: basico/todo`) |
| **Activación** | ¿Qué tiene prendido hoy (dentro de lo comprado)? | `Tenant.capabilities` |
| **Pantallas (RBAC)** | ¿Qué pantallas puede abrir esta persona? | `Role.capabilities[]` (roles con nombre por empresa) + `User.roleIds[]` + `User.capabilities[]` extra; `admin` ve todo |
| **Alcance (grant)** | ¿Sobre qué gente/sucursales opera cuando entra? | `alcance = { modo: 'tenant'\|'ramas'\|'nada', ramas: [...] }` en el rol y/o usuario; el efectivo es la **unión** |

Regla de producto citada en su spec: *"Un renglón en Suscriptores = un producto que se vende. Una pantalla que solo existe porque existe ese producto se cuelga, no se cobra aparte."*

**[COPIAR]** el modelo completo. **[ADAPTAR]** el árbol de alcance: en Connectia es `mundo → empresa → cliente → sucursal → área → cargo` (retail/SAP); para la cooperativa sería algo como `cooperativa → sucursal/agencia → zona/ruta → servicio → sector/cuadrilla → cargo`.

### 2.5 Autenticación

- JWT access (15 min) + refresh (30 días) **rotativo y guardado hasheado** en el usuario. `sessionEpoch` permite "cerrar sesión en todos los dispositivos".
- 2FA por email o SMS con OTP hasheado; "no volver a pedir en este aparato (30 días)" vía token de dispositivo confiable.
- Recupero de contraseña con respuesta siempre genérica (anti-enumeración); bcrypt costo 12.
- Bloqueo 5 intentos / 15 min por usuario.
- SSO OIDC (Microsoft, Google, Okta) configurable por empresa.
- **[COPIAR]** todo lo anterior. **[MEJORAR]** agregar rate limit por IP (no existe) y, para el portal del socio, login por DNI/CUIT + número de socio.

### 2.6 Patrones de backend

- **Paginación uniforme:** `?page=&size=` (tope de `size`), `skip/limit` + `countDocuments` en paralelo, respuesta `{ items, total, page, size }`. **[COPIAR]**
- **Errores:** cada request lleva `requestId` (devuelto en el JSON); 5xx nunca expone el detalle técnico; 4xx con mensaje en español. **[COPIAR]**
- **Validación:** manual en cada ruta, sin Joi/Zod. **[MEJORAR]** usar Zod (o similar) con esquemas compartidos.
- **Config por empresa:** bloques `Mixed` en `Tenant` normalizados en runtime con `normalizeXConfig()`; evita migraciones. **[COPIAR]** con cuidado (documentar cada bloque).
- **Borrado lógico** (`activo: false`) y auditoría por dominio. **[COPIAR]** **[MEJORAR]** a una colección de auditoría genérica única.
- **Jobs:** ~15 schedulers con `setInterval` dentro del proceso. **[MEJORAR]** para un ERP (facturación masiva, envíos a entes, mora) hace falta una cola real (BullMQ + Redis, que ya está en dependencias pero no se usa) con un único worker.
- **Archivos:** disco local montado como volumen. **[MEJORAR]** a S3/Blob con URLs firmadas; nunca servir comprobantes ni datos de socios por estático público.

### 2.7 Notificaciones

| Canal | Mecanismo | Servicio |
|---|---|---|
| In-app | colección `AppNotification` (buzón por usuario) | `notify*.js` por dominio |
| Push web | `web-push` + VAPID; suscripciones en `User.pushSubscriptions[]` | `services/pushService.js` |
| Email | nodemailer | `services/emailService.js` |
| WhatsApp | Meta Cloud API + webhook de estados | `services/whatsappService.js` |
| SMS | Twilio | `services/smsService.js` |

Cada módulo tiene su `notifyX.js` que decide canales según preferencias del usuario (`User.notifPrefs`) y config de la empresa (horario de no molestar, tope de campañas por día). **[COPIAR]**. Para la cooperativa: avisos de factura emitida, vencimiento, corte programado, deuda, reclamo resuelto.

### 2.8 Despliegue

- Un `Dockerfile` multi-stage con tres targets: `backend` (Node, puerto 4000), `frontend` y `admin` (build Vite servido con Nginx).
- `docker-compose.yaml`: mongo, backend, frontend (5173), admin (5174). En producción todo bajo un dominio con proxy: `/` PWA, `/admin/` admin, `/api` API.
- Autodeploy con GitHub Actions por SSH a EC2 (`git reset --hard`, `docker compose build && up -d`). El `.env` del backend se mantiene a mano en el servidor.
- Timeouts de proxy de 7 minutos por llamadas de IA.

> El plan original de GoodApps hablaba de Azure Container Apps. Si se va por este stack, el mismo `Dockerfile` corre en Azure Container Apps sin cambios.

---

## 3. PWA móvil (usuario final) — UI/UX

Aplicación: `connectia/frontend`. Es el modelo para el **Portal del Socio** y la **App del técnico de campo**.

### 3.1 Design system **[COPIAR]**

Archivos: `frontend/src/style.css` (tema claro/oscuro), `frontend/src/styles/pwaModule.css` (piel oscura), `frontend/src/utils/applyBrandingCssVars.js` (color por empresa), `frontend/src/stores/theme.js`.

**El ADN visual es la "piel oscura tipo login" (`.pwa-mod`)**, aplicada a listados, formularios y modales independientemente del tema de la empresa.

| Token | Valor | Uso |
|---|---|---|
| `--pwa-bg` | `#000` (página) / `#22222b` (hoja) | fondo |
| `--pwa-brand` / `--pwa-lilac` | color de la empresa (default `#7a51ca` / `#8b78ff`) | CTA, foco, activo |
| `--pwa-text` | `#fff` | texto principal |
| `--pwa-muted` | `rgba(255,255,255,.72)` | texto secundario |
| `--pwa-dim` | `rgba(255,255,255,.48)` | labels, inactivo |
| `--pwa-line` | `rgba(255,255,255,.10)` | bordes |
| `--pwa-card-fill` | `#22222b` | cards, KPIs |
| `--pwa-radius-field` | `14px` | campos, cards, botones |
| `--pwa-radius-modal` | `18px` | modales |
| Tipografía | `'Sora', 'Montserrat', 'Segoe UI', sans-serif` | única |

Fondo "glow" obligatorio en toda pantalla con esta piel:

```css
background-color: #000;
background-image:
  radial-gradient(90% 55% at 50% -8%, rgba(139,120,255,.18), transparent 55%),
  radial-gradient(70% 40% at 100% 100%, rgba(139,120,255,.05), transparent 50%);
```

Tema claro de base (`style.css`): página `#f8fafc`, superficie `#ffffff`, texto `#0f172a`, secundario `#64748b`, marca `#8554c9`. Tema oscuro: página `#000`, card `#22222b`, marca `#a78bfa`. Se cambia con `data-theme` en `<html>`; tres niveles: política de la empresa, preferencia del usuario, oscuro forzado en login/splash.

Otros valores: H1 de vista `font-weight 600`, `letter-spacing -0.035em`, `clamp(1.35rem, 4.5vw, 1.55rem)`; radios `14 / 18 / 999px`; padding de página `1.25rem 1rem 5rem`; sombra de CTA `0 10px 28px rgba(122,81,202,.28)`; animación de entrada `translateY(12px)→0` en 0,45 s respetando `prefers-reduced-motion`.

### 3.2 Branding por empresa (multi-marca) **[COPIAR]**

Clave para que **cada cooperativa tenga su app** sin builds separados:

- `applyBrandingCssVars()` pisa 2–3 variables de color en runtime; el resto del sistema hereda.
- `applyTenantPwaIdentity()` cambia favicon, `<title>` y **manifest de instalación dinámico** (`/api/pwa/manifest.webmanifest?emp=CODIGO`) → ícono y nombre propios de la cooperativa al "instalar la app".
- `applySystemChromeTheme()` cambia el `theme-color` (barra de estado Android).
- Logos jerárquicos (empresa → sub-unidad) en `public/branding/...`. En la cooperativa: logo de la cooperativa y, si aplica, de cada sucursal.

### 3.3 App shell y navegación **[COPIAR]**

Único layout: `frontend/src/layouts/AppShell.vue`.

```
┌──────────────────────────────┐
│ Topbar: menú · logo empresa · pendientes · asistente IA · avisos (badge) │
├──────────────────────────────┤
│ Banner opcional: encuestas pendientes / envíos offline pendientes         │
├──────────────────────────────┤
│ Contenido (scroll único; cada vista empieza con H1 + subtítulo)           │
├──────────────────────────────┤
│ Tabbar: Inicio · Agenda · [Enlaces] · (+) · Perfil                        │
└──────────────────────────────┘
```

- **"Phone shell"**: en escritorio la PWA se ve como un teléfono centrado (`max-width: 430px`, `border-radius: 28px`). Ideal para el portal del socio usado desde PC.
- Menú hamburguesa = modal de altura completa con buscador y grupos colapsables definidos como datos.
- Botón central **"+" (FAB)** cuya acción cambia según la pantalla (`useCreateAction` vía provide/inject).
- Guard de router único: autenticación, términos pendientes, bloqueo de escritorio por empresa y **ruteo por rol** (landing distinta por tipo de usuario).

### 3.4 Componentes molde (portar primero) **[COPIAR]**

| Componente | Rol |
|---|---|
| `PwaModal.vue` | Modal / bottom-sheet único (tamaños compact/standard/wide), Teleport, foco, Esc |
| `PwaTabs.vue` / `PwaFilters.vue` | Pestañas de texto con línea inferior (nunca chips) |
| `PwaEmptyState.vue` | Estado vacío con ilustración SVG propia y título "comercial" |
| `PwaFab.vue` | Botón "+" de alta |
| `PwaFilePicker.vue` | Reemplazo del input file nativo |
| `PwaCardExtra.vue` | Banda de datos extra en la card |
| `ConfirmSheet.vue` | Confirmaciones |
| `AppIcon.vue` | Iconos SVG inline (24×24, trazo 1.75) |
| `SplashScreen.vue` | Splash con logo y color de la empresa |
| `PwaOfflinePendingBanner.vue` | Banner único de "pendientes de enviar" |
| `PendingSurveysBanner.vue` | Banner de encuestas obligatorias |

Composables útiles: `usePwaInstall` (instalación A2HS con pasos para iOS), `usePullToRefresh`, `usePushSubscribe`, `useNotifBadge`, `useDictation` (dictado por voz), colas offline por dominio.

### 3.5 Reglas de UX documentadas (`CONNECTIA-PWA-UI-SPEC.md`) **[COPIAR]**

- **Card de listado** con anatomía fija: rail de color de estado · ícono de tipo · título que **nunca se trunca** · badge de estado · dato principal · 2–4 meta-tags · chevron. Mínimo 5 datos legibles sin abrir el detalle.
- **Alta siempre en modal** abierto desde el FAB, nunca en página completa.
- **Carga inicial con 3 skeleton cards** del mismo formato (nunca spinner centrado); al refrescar, la lista baja opacidad pero no se vacía.
- Fecha única `dd-mm-yyyy` desde un helper central.
- Errores inline en el formulario, nunca `alert()` del navegador.
- Notificaciones: mapa central `tipo → {ícono, color, etiqueta}` (`utils/notifKinds.js`) con fallback por prefijo.
- Cada mejora riesgosa con **flag de apagado sin deploy** y bitácora de reversión (`CONNECTIA-OLA63-OFFLINE-ROLLBACK.md`).

### 3.6 Login UX **[COPIAR]**

1. Código de empresa → al salir del campo carga logo, colores, fondo y botones SSO de esa empresa **antes** de loguear.
2. Usuario o ID → contraseña → 2FA si corresponde (con reenvío y "no volver a pedir 30 días").
3. "Recordarme" decide `localStorage` vs `sessionStorage`.
4. Si el usuario pertenece a varias empresas, selector.
5. Splash post-login, oferta de instalar la app y landing según rol.
6. Ayuda de formato siempre visible bajo el campo (p. ej. "DNI sin puntos"), errores específicos (usuario inexistente vs contraseña incorrecta).

Para la cooperativa: el "código de empresa" puede resolverse por subdominio (`lagunalarga.goodapps...`) y el usuario del socio ser DNI/CUIT.

### 3.7 Offline (clave para el técnico de campo) **[COPIAR]** **[MEJORAR]**

- Service Worker Workbox: precachea el app shell; `/api` y `/uploads` son **NetworkOnly** (los datos no se cachean por HTTP).
- El offline de datos es a nivel aplicación: **una cola por dominio en `localStorage`** + **fotos/evidencias en IndexedDB** + envío con `clientMutationId` (idempotencia) a un endpoint `/sync` por lotes con resultado por ítem.
- Reintento automático al volver la red + botón "Reintentar" en el banner único.
- Lo que **no** se encola a propósito: login, admin, operaciones con riesgo de duplicado.
- **[MEJORAR]**: un único motor de cola en IndexedDB para todo (Connectia tiene 5 colas separadas y un "motor" que solo las lee).

Uso directo en GoodApps: lecturas de medidores, órdenes de trabajo, cortes y reconexiones, inspecciones con fotos y GPS, firma del socio.

### 3.8 Inventario de pantallas PWA (referencia)

| Área | Rutas principales |
|---|---|
| Acceso | `/login`, `/forgot-password`, `/reset-password`, `/terms`, `/legal/:tipo` |
| Inicio / muro | `/muro`, `/muro/:id`, `/muro/mias`, `/guardados`, `/home-alt` |
| Novedades | `/avisos` (bandeja), `/boletines`, `/boletines/:id` |
| Encuestas | `/encuestas`, `/encuestas/:id`, `/e/:token` (externa, sin login) |
| Campo | `/relevamientos`, `/relevamientos/:id` (ejecución), `/mi-dia`, `/alarma` (incidente con foto + GPS) |
| Supervisión | `/supervision/*`, `/mi-equipo/*`, `/bandeja-lider` |
| Trámites | `/solicitudes`, `/servicios`, `/pedidos`, `/aprobaciones` |
| Perfil | `/perfil`, `/directorio`, `/organigrama` |
| Otros | `/agenda`, `/chat`, `/asistente` (IA), `/docs`, `/politicas`, `/ayuda`, `/beneficios`, `/juegos`, `/en-vivo`, `/tv` |

Patrón de **rol externo sobre la misma PWA** (`CONNECTIA-FLOW-ENCARGADO-PWA-SPEC.md`): landing distinta según estado del perfil (pendiente / suspendido / aprobado), menú recortado por un archivo de allowlist. **[ADAPTAR]** exactamente así para **Socio** vs **Técnico** vs **Administrativo** en una sola PWA (y "socio moroso / suspendido / activo").

---

## 4. Panel de administración web

Aplicación: `connectia/admin`.

### 4.1 Design system del admin **[COPIAR]**

Tema oscuro por defecto (claro disponible), en `admin/src/style.css`:

| Token | Oscuro | Uso |
|---|---|---|
| `--canvas` | `#111019` | fondo |
| `--panel` / `--panel-2` | `#1e1a2b` / `#17141f` | paneles, cabecera de tabla |
| `--ink` | `#ece9f4` | texto |
| `--line` | `#2c2739` | bordes |
| `--brand` | `#6b5bf0` | marca (igual en claro y oscuro) |
| `--ok` / `--warn` / `--bad` | `#5bd39b` / `#e2b552` / `#f0837b` | estados |
| `--r` / `--r-s` | `12px` / `9px` | radios |

Tipografías: **Space Grotesk** (títulos), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (números/datos tabulares — muy apropiado para importes y lecturas).

### 4.2 Layout y patrones **[COPIAR]**

- **Topbar** con logo del producto, logo de la empresa, selector de contexto, botón **"Mapa del sitio"** (buscador visual de todas las pantallas agrupadas) y accesos fijados por el usuario.
- **Cabecera sticky estándar** (`AdminStickyHeader.vue`): título + subtítulo + botones de acción a la derecha. Debajo, fuera del sticky: ayuda, pestañas, filtros.
- **Ayuda contextual** (`ScreenHelp.vue`): modal con qué/quién/cuándo/dónde/por qué/cómo + caso de uso. Excelente para un ERP con usuarios no técnicos.
- **Modales en 4 tamaños** (`cx-modal--sm/md/lg/xl`: 480/720/960/1180 px), siempre `Teleport to="body"`, cabecera con color de marca, cierre por fuera y Esc.
- **Árbol de menú declarativo** (`admin/src/utils/siteMapGroups.js`): clusters → grupos → ítems, usado por el menú, el mapa del sitio y el editor de roles. Una sola fuente de verdad.
- **Previews "celular"** dentro del admin (cómo se verá la publicación/encuesta en la app antes de publicar).
- **IA solo propone** (borradores, textos, ficha de alta); una persona revisa y confirma. Patrón repetido en todo el admin.
- Cliente API único con axios: interceptor que agrega Bearer + contexto, y ante 401 hace **un único refresh compartido** y reintenta una vez.

### 4.3 Dos niveles **[COPIAR]**

- **Plataforma (GoodApps):** Dashboard global + `/suscriptores` (alta de cooperativas, packs de módulos por checkbox, activar/desactivar, alta asistida por IA con logo y colores propuestos).
- **Empresa (cada cooperativa):** todas las pantallas operativas, filtradas por capability del usuario. Separación en el router con `meta.platformOnly` / `meta.tenantOnly`.

### 4.4 Pantallas del admin (referencia)

| Grupo | Pantallas | Relevancia para la cooperativa |
|---|---|---|
| Comunidad | Dashboard, Comunidad (branding, módulos, login), KB del asistente | Alta |
| Usuarios | Usuarios (ABM, import Excel, dispositivos, actividad), Roles (pantallas + alcance) | Alta |
| Comunicación | Publicaciones, Stories, Eventos, Saludos, Categorías, Emociones, Newsletters, Comunicaciones, Notificaciones | **Alta (muro y novedades)** |
| Moderación | Comentarios, Chat | Media |
| Encuestas e inteligencia | Encuestas, Inteligencia de encuestas, Inteligencia (salas BI), Reportes | **Alta** |
| Operaciones en terreno | Relevamientos, Asignación, Asistencia, Supervisión, Equipos, Pedidos/alarmas con mapa | Alta (OTs, lecturas, cuadrillas) |
| Trámites | Solicitudes, Tipos, Estados, Workflows (diseñador de aprobaciones) | Alta (trámites del socio: alta de servicio, cambio de titular, reclamos) |
| Configuración | Menú de la app, Parámetros tipados, Accesos rápidos, Ayuda/FAQ | Alta |
| RRHH (legajos, licencias, onboarding, talento, cultura, beneficios, juegos) | — | **[NO LLEVAR]** salvo decisión de sumar un módulo de personal |
| ECR/SAP (divisiones, cuentas, vacaciones, integraciones SAP) | — | **[NO LLEVAR]** |

### 4.5 BI **[COPIAR]**

Patrón "**cubo certificado primero, IA después**":

- **Zona A**: KPIs con fórmula documentada y "vacío honesto" (si no hay datos, lo dice), 4–6 gráficos, ranking.
- **Zona B**: selector de contexto (hasta 40 ítems).
- **Zona C**: IA con preguntas de catálogo o libres, **solo sobre A + B**, siempre citando el KPI o el ítem. Nunca inventa números.
- Contrato de API uniforme por "sala": `summary`, `items`, `export.xlsx`, `analyze-auto`, `ask`, `schedule`.
- Componentes: `BiFilterBar`, `BiKpiGrid`, `BiMetricBars`, `BiContextPicker`, `BiInteligenciaAiDrawer` (gráficos en SVG/CSS propio).

Para la cooperativa: salas de Facturación, Cobranza, Mora, Consumos, Reclamos, Técnica.

### 4.6 Lo que el admin hace mal (hacerlo mejor) **[MEJORAR]**

- Sin componente de **tabla genérica** (columnas configurables, orden, paginación, export): cada vista la reimplementa. En un ERP es imprescindible un `<DataTable>` único.
- Sin componente de **importación Excel** genérico (se repite ~10 veces). Hacer un `<ExcelImportWizard>` de 3 pasos: subir → preview con errores → confirmar.
- Sin sistema de **toasts** ni `<ConfirmDialog>` comunes.
- Menú del admin parchado en runtime con ~30 funciones; usar solo el archivo declarativo.
- Sin pantalla de **credenciales de integraciones por empresa** (hoy en `.env` global). En GoodApps: bóveda por cooperativa para ARCA, Red Link, SIRO, bancos, con "probar conexión" y auditoría.
- Validación de formularios manual: usar un esquema compartido con el backend.

---

## 5. MURO — **[COPIAR]** (prioridad alta)

### 5.1 Qué hace

**En la app (socio/empleado):**
- Feed con dos modos: **carrusel de cards** o **lista infinita** (paginado de a 10). Persistencia de la preferencia.
- "Tiras" horizontales embebidas en el muro con otros módulos (encuestas pendientes, agenda, trámites…). En la cooperativa: "Tu última factura", "Cortes programados en tu zona", "Encuesta de satisfacción".
- Card de publicación: imagen / galería / video / audio, título, cuerpo, tipo, sección (`#hashtag`), reacciones, comentarios, compartir, guardar, "no me interesa".
- Detalle con comentarios (1 nivel de respuestas), foto/GIF en comentario, edición/borrado propio, `@menciones`, emojis, deep-link a un comentario.
- Filtros: texto, tipo, origen (institucional vs de usuarios), sección.
- Guardados y "Mis publicaciones".
- Supervisores publican a **su equipo** desde la app.

**En el admin:**
- Editor con: título, cuerpo enriquecido, tipo, categoría administrable, sección, portada + galería, audio, layout (vertical / horizontal / banner).
- **Programar** (`scheduledAt`), **fijar** con vencimiento (`pinnedUntil`), **expirar** (`expiresAt` → archivada).
- **Audiencia** con el picker unificado.
- Opciones por publicación: notificar a la audiencia (push + email + in-app), permitir comentarios, permitir reacciones, promover a base de conocimiento.
- **Moderación** de publicaciones de usuarios: entran como `pending_review`; análisis de riesgo con IA; aprobar / rechazar con motivo.
- Generación con IA, importación de noticias web, banco de imágenes, plantillas, importación masiva, métricas de engagement (vistas, reacciones, ranking).

### 5.2 Modelo de datos

**`Post`** (`backend/src/models/Post.js`):

```js
{
  tenantId,                                   // ObjectId → Tenant, requerido, indexado
  titulo: String,                             // requerido
  cuerpo: String,
  tipo: enum['noticia','aviso','beneficio','evento','general','celebracion'],
  categoryId,                                 // → PostCategory
  imageUrl, imageUrls: [String], audioUrl,
  layout: enum['vertical','horizontal','banner'],
  pinned: Boolean, pinnedUntil: Date,
  expiresAt: Date,
  section: String,                            // hashtag/sección editorial (máx 80)
  isKnowledge: Boolean, kbArticleId, kbPromotedAt, kbCategoria,
  priority: Number,
  notifyAudience: Boolean,
  status: enum['draft','pending_review','scheduled','published','rejected','archived'],
  scheduledAt, publishedAt,
  authorId, authorName,
  origin: enum['admin','member'],             // institucional vs generado por usuarios
  moderatedBy, moderatedAt, rejectionReason,
  moderationAi: { status, analyzedAt, provider, model, risk, score, suggestedAction,
                  summary, reasons[], categories[], policyFlags[], error },
  reactions: { like, love, laugh, fire, wow, clap },   // contadores
  reactors: Map<userId, reactionKey>,                  // una reacción por usuario
  viewCount: Number,
  audience: { mode: enum['all','restricted','users','none'],
              areaIds[], groupIds[], userIds[], clientIds[], paradigma, ramas[] },
  display: { show: Mixed },                   // qué partes mostrar según tipo
  linkedSurveyId,                             // encuesta embebida en el post
  commentsEnabled: Boolean, reactionsEnabled: Boolean,
  greeting: { ruleId, eventType, forUserId, forUserIds[], runKey }  // saludos automáticos
}
// timestamps: true
// índices: (tenantId,status,pinned,priority,publishedAt), (tenantId,status,scheduledAt),
//          (tenantId,authorId,createdAt), (tenantId,origin,status), único parcial (tenantId,greeting.runKey)
```

Colecciones satélite:

| Modelo | Campos clave | Para qué |
|---|---|---|
| `PostCategory` | key, nombre, slug, icono, color, parentId, orden, activo, sistema | categorías jerárquicas administrables |
| `PostTemplate` | nombre, tipo, titulo, cuerpo, layout, section, imageUrl, pinned | plantillas del editor |
| `PostView` | postId, userId, kind (detail/impression), channel, dayKey (único por día) | telemetría de lectura |
| `Comment` | postId, parentId, authorId, texto (≤4000), imageUrl, status (visible/pending_review/hidden/deleted), adminReply, moderationAi (+ imagen), editedAt | comentarios moderables |
| `SavedPost` / `HiddenPost` | userId, postId (único) | guardado / "no me interesa" |

### 5.3 API

PWA (`/api/posts`): `GET /feed`, `GET /saved`, `GET /mine`, `GET /:id`, `GET /muro-sections`, `GET /:id/mention-candidates`, `POST /` (UGC → revisión), `POST /:id/reactions`, `POST /:id/save`, `POST|DELETE /:id/hide`, `POST /:id/share`, `DELETE /:id/review`, `POST /ai/generate`.

Admin (`/api/admin/posts`, capability `admin.publicaciones`): `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`, `PATCH /:id/approve`, `PATCH /:id/reject`, `POST /:id/analyze`, `POST /:id/to-kb`, `GET /engagement`, `GET /:id/engagement`, `GET|PUT /config`, `GET /schedule-conflicts`, `GET /audiencia-opciones`, `GET /export-media`.

Comentarios (`/api/comments`): `GET /?postId=`, `POST /upload`, `POST /`, `PATCH /:id`, `DELETE /:id`. Moderación (`/api/admin/comments`): `GET|PUT /config`, `GET /`, `GET /export.csv`, `PATCH /:id/approve|hide|reply`, `POST /:id/analyze|accept-suggestion|ignore-suggestion`, `DELETE /:id`.

### 5.4 Archivos a copiar

- Backend: `models/Post.js`, `PostCategory.js`, `PostTemplate.js`, `PostView.js`, `Comment.js`, `SavedPost.js`, `HiddenPost.js`; `routes/posts.js`, `postsAdmin.js`, `comments.js`, `commentsAdmin.js`, `postCategoriesAdmin.js`, `postTemplatesAdmin.js`; `services/postPublish.js`, `postPublishScheduler.js`, `notifyPost.js`, `notifyComment.js`, `notifyMention.js`, `ugcModerationAi.js`, `commentModerationAi.js`; `lib/mentionResolve.js`.
- PWA: `views/MuroView.vue`, `PostDetailView.vue`, `MisPublicacionesView.vue`, `GuardadosView.vue`; `components/PostCard.vue`, `PostMedia.vue`, `PostMediaCarousel.vue`, `PostAudioButton.vue`, `PostVideoSheet.vue`, `PostComposerSheet.vue`, `ReactionBar.vue`, `MentionSuggest.vue`, `SharePostSheet.vue`, `NovedadesCarousel.vue`, `MuroStripSection.vue`; `constants/reactions.js`.
- Admin: `views/PublicacionesView.vue`, `CategoriasPublicacionesView.vue`, `ModeracionComentariosView.vue`; `components/CommentModerationPanel.vue`, `SocialPostPreviewModal.vue`, `MobileFeedPreview.vue`, `AudiencePicker.vue`.

### 5.5 Reacciones, comentarios y menciones

- 5 reacciones fijas: ❤️ Me encanta (`love`), 😂 Me divierte (`laugh`), 🔥 Me prende (`fire`), 😮 Me sorprende (`wow`), 👏 Aplausos (`clap`). Una por usuario. Barra estilo WhatsApp.
- Menciones `@usuario`: el autocompletar solo sugiere personas que **ya pueden ver** la publicación; al publicar se notifica (in-app + push), sin auto-mención, máximo 10 por pieza, idempotente, no se notifica si el comentario está en revisión.

### 5.6 Adaptación a la cooperativa

- **Tipos de publicación** sugeridos: `noticia`, `aviso`, `corte_programado`, `asamblea`, `beneficio`, `evento`, `institucional`. Un `corte_programado` debería poder llevar zona/ramal y franja horaria, y notificar solo a los socios afectados.
- **Audiencia** por zona, localidad, servicio contratado (energía, agua, internet, sepelio…), categoría tarifaria, estado del socio, consejo/empleados.
- **Comentarios y publicaciones de usuarios**: decidir si los socios pueden comentar/publicar (probablemente solo reaccionar y comentar con moderación; publicar solo empleados).
- Cumpleaños y saludos automáticos (`celebracion` + `GreetingRule`): sirve para socios y empleados sin cambios.

---

## 6. NOVEDADES — **[COPIAR]** (prioridad alta)

En Connectia "novedades" son dos cosas distintas que conviene llevar juntas:

### 6.1 Boletín / revista (`Newsletter` + `NewsletterRule`)

**Flujo:**
1. Una **regla** define cadencia (cada N horas o calendario: días + hora + zona horaria), formato (`corto`, `digest`, `revista`), cuántas publicaciones, criterio (`latest`, `pinned_first`, `priority_first`, `oldest_first`), tipos, antigüedad máxima, evitar repetidos y audiencia.
2. Un scheduler genera el boletín en `pending_review`, con **variantes por audiencia** (cada destinatario recibe solo lo que puede ver) y lista de destinatarios con estado de entrega individual.
3. Un responsable revisa y aprueba: asunto, "desde la redacción" (con IA opcional), nota de tapa, saludo personalizado (`Hola {{nombre}}…`), agregar/quitar destinatarios.
4. Estados `pending_review → approved → sending → sent` (o `rejected` / `cancelled`), con **auditoría completa** de quién hizo qué.
5. Envío por email con tema visual; PDF y preview HTML.
6. En la app: lista de boletines recibidos y detalle tipo revista con botón "Abrir en el muro".

**`Newsletter`** — campos clave: `subject`, `status`, `posts[]` (snapshot inmutable: postId, titulo, tipo, cuerpo, imageUrl), `format`, `featuredPostId`, `lede`/`ledeAi`, `greetingTemplate`, `visibleInApp`, `variants[{ fingerprint, postIds[], summary, recipientCount, emailableCount }]`, `recipients[{ userId, email, nombre, fingerprint, postIds[], canEmail, included, isExternal, deliveryStatus, sentAt, error }]`, `totals`, actores (`createdBy/reviewedBy/approvedBy/rejectedBy/sentBy/cancelledBy` con nota y fecha), `auditLog[]`.

**`NewsletterRule`**: `nombre`, `intervalHours`, `scheduleMode: interval|calendar`, `calendarWeekdays[]`, `calendarTime`, `timezone`, `format`, `greetingTemplate`, `requireReview`, `postCount`, `selectMode`, `tipos[]`, `maxAgeHours`, `avoidRepeats`, `audience`, `enabled`, `lastRunAt`, `nextRunAt`.

API admin (`/api/admin/newsletters`): `GET /`, `GET /stats`, `POST /`, `POST /suggest`, CRUD `/rules` + `POST /rules/preview`, `GET|PATCH /:id`, `POST /:id/approve|reject|cancel|send`, `GET /:id/pdf`, `GET /:id/preview-html`. PWA (`/api/newsletters`): `GET /`, `GET /:id`.

### 6.2 Centro de comunicaciones (`Communication*`)

Motor genérico de envíos transaccionales y masivos por **email, WhatsApp, SMS o app**:

- `CommunicationType`: catálogo de tipos (código, nombre).
- `CommunicationTemplate`: por tipo y canal, con asunto, cuerpo con variables, adjuntos, tema visual del email y versión.
- `Communication`: cada envío con destinatario, texto renderizado, estado (`pending/sent/delivered/failed/read`), id del proveedor, **clave de idempotencia**.
- Admin `ComunicacionesView.vue`: tipos, plantillas (con IA), preview, config de canales, **envío masivo** a una audiencia, historial, salud del servicio. Editor de email propio con variables `{{nombre}}`.

**En GoodApps este es el motor para**: aviso de factura emitida (con PDF), recordatorio de vencimiento, aviso de deuda por instancia de mora, aviso de corte, confirmación de pago, reclamo recibido/resuelto, convocatoria a asamblea. Encaja directo con el módulo de Mora relevado en Procoop (instancias Candidatos / Primer aviso / Segundo aviso).

### 6.3 Avisos y push (`AppNotification` + `PushCampaign`)

- `AppNotification`: buzón por usuario (`kind`, título, cuerpo, link interno, imagen, `refType/refId`, remitente, `readAt`, `dismissedAt`), con índice único parcial para no duplicar avisos.
- `PushCampaign`: campaña armada por un admin (título, cuerpo, link, imagen, audiencia, segmento "inactivos N días", envío ahora o programado, canales in-app/push, estadísticas, idempotencia).
- App: bandeja **Todas / No leídas / Leídas / Enviados**, marcar leído, descartar con "deshacer" (6 s), badge global.
- Admin: composer con **selector de destino del link** (pantalla, publicación, encuesta, documento, URL), audiencia, programación, copy con IA, vista de **lecturas** por campaña y listado de menciones.

### 6.4 Archivos a copiar

- Backend: `models/Newsletter.js`, `NewsletterRule.js`, `Communication.js`, `CommunicationTemplate.js`, `CommunicationType.js`, `AppNotification.js`, `PushCampaign.js`; `routes/newsletterAdmin.js`, `newsletterPwa.js`, `communicationsAdmin.js`, `whatsappWebhook.js`, `notifications.js`, `notificationsAdmin.js`; `services/newsletterService.js`, `newsletterAuto.js`, `newsletterRuleScheduler.js`, `communicationService.js`, `emailService.js`, `smsService.js`, `whatsappService.js`, `pushService.js`, `pushCampaignScheduler.js`, `pushCopyAi.js`.
- PWA: `views/BoletinesView.vue`, `BoletinDetailView.vue`, `AvisosView.vue`; `components/AvisoComposerSheet.vue`; `public/push-sw.js`; `utils/notifKinds.js`; `composables/useNotifBadge.js`, `usePushSubscribe.js`.
- Admin: `views/NewslettersView.vue`, `ComunicacionesView.vue`, `NotificacionesAdminView.vue`; `components/EmailTemplateRichEditor.vue`, `EmailPreviewIframe.vue`.

---

## 7. ENCUESTAS — **[COPIAR]** (prioridad alta)

El motor más completo de Connectia (lo comparan contra un catálogo de 490 funciones de SurveyMonkey/Typeform y declaran ~70–75 % de cobertura; ver `CONNECTIA-ENCUESTAS-COBERTURA.md`).

### 7.1 Qué hace

**Admin:**
- Constructor: título, nombre interno, descripción, instrucciones, bienvenida y cierre, portada (imagen/galería/video), contexto para la IA.
- Estados `draft → published → paused / closed → archived`. Vigencia desde/hasta, zona horaria, categoría, tags, tiempo estimado.
- Presentación: todo en una página / **una pregunta por pantalla** con barra de progreso / páginas con título.
- Opciones: volver atrás, pantalla de repaso antes de enviar, editar después de enviar, respuestas múltiples, recurrencia periódica, **anónima**.
- **Consentimiento** con texto versionado.
- **Scoring**: puntaje por opción, bandas de resultado con color, umbral de aprobación, mostrar o no el puntaje; **alertas críticas** por respuesta.
- **Recordatorios automáticos** (cantidad, intervalo, excluir a quien ya respondió) e **informe programado por email**.
- Multi-idioma por pregunta.
- **Audiencia** con snapshot al publicar (para medir participación real) o **lista importada** por Excel/CSV.
- Plantillas propias, generación con IA, **versionado** con historial (20 versiones) y restauración, duplicar, comparar oleadas.
- **Link externo sin login + QR** (para encuestar a personas que no tienen usuario).
- Anonimizar respuestas existentes; auditoría de exportaciones.
- Exportación CSV / JSON / XLSX / PDF / DOCX.

**App:**
- Pestañas **Pendientes / Iniciadas / Finalizadas**, card con portada, "cierra en N días" y progreso.
- Un campo por tipo de pregunta, navegación anterior/siguiente, **autoguardado de borrador**, **cola offline**, lógica condicional en vivo, repaso final.
- Puede aparecer embebida en una publicación del muro (`Post.linkedSurveyId`) y como banner de pendientes.
- Supervisores pueden lanzar encuestas rápidas a su equipo desde la app.

### 7.2 Tipos de pregunta (31, en `backend/src/lib/surveyQuestions.js`)

| Grupo | Tipos |
|---|---|
| Texto | `text`, `textarea` |
| Datos | `number`, `percent`, `currency`, `url`, `document_id` |
| Elección | `yesno`, `single`, `multiple`, `dropdown`, `ranking` |
| Escala | `likert`, `matrix`, `rating`, `nps`, `slider` |
| Fecha / hora | `date`, `time`, `datetime` |
| Contacto | `email`, `phone` |
| Ubicación | `geopoint` |
| Archivos | `file`, `image`, `signature` |
| Estructura (no piden respuesta) | `heading`, `info` |
| Privacidad | `consent` |
| Avanzado | `hidden` (precargado), `calculated` (fórmula) |

Por pregunta: obligatoria, ayuda, ejemplo, placeholder, opción "Otro" / "No aplica" / "Prefiero no decir", opciones con imagen, mezclar opciones, validaciones (mín/máx, largo, cantidad de opciones, tamaño y tipo de archivo, mensaje propio), precarga desde el perfil, valor por defecto, filas/columnas de matriz, fórmula, puntaje y alerta crítica.

**Lógica condicional** (`lib/surveyLogic.js`): `visibleIf` (mostrar), `finishIf` (terminar), `askExplainIf` (pedir explicación), `askFileIf` (pedir archivo); bloques AND/OR con operadores `eq, neq, in, nin, gt, gte, lt, lte, answered, empty`.

### 7.3 Modelo de datos

**`Survey`** (`backend/src/models/Survey.js`), resumido:

```js
{
  tenantId, nombreInterno, titulo, descripcion, instrucciones, welcomeMessage, thanksMessage, aiContext,
  imageUrl, imageUrls[], videoUrl,
  status: enum['draft','published','paused','closed','archived'],
  questions: [{
    id, texto, tipo /* 31 tipos */, required, opciones[], optionItems[{label,imageUrl}],
    sensitive, locales, grupo, pageId, imageUrl, help, example, placeholder,
    allowOther, allowNA, allowPreferNot, scaleMin, scaleMax, likertPreset,
    validations: { min, max, minLength, maxLength, minOptions, maxOptions, maxFileSizeMb, accept, customError },
    visibleIf, finishIf, askExplainIf, askFileIf,          // { logic: and|or, rules: [{questionId, op, value}] }
    scoreMap, points, criticalAlert: { enabled, op, value, message },
    prefillFrom: enum['','email','phone','nombre','apellido'], defaultValue,
    matrixRows[], matrixColumns[], formula, shuffleOptions
  }],
  pages: [{ id, title, description }],
  version,
  audience: { mode: enum['all','restricted','users','import','none'], areaIds[], groupIds[], userIds[], clientIds[], paradigma, ramas[] },
  audienceSnapshot: { invitedCount, capturedAt, mode, ... },
  startsAt, endsAt, timezone, tags[], estimatedMinutes, anonymous,
  questionFlow: enum['all','one_by_one','pages'], showProgress, allowBack, requireReview, allowEditAfterSubmit,
  allowMultiple, periodDays,
  consent: { enabled, text, version },
  scoring: { enabled, mode, showToRespondent, passThreshold, bands: [{ id, label, color, min, max }] },
  thanksByBand: [{ bandId, message }],
  reminders: { enabled, maxCount, intervalHours, excludeResponded, sentCount, lastSentAt, nextAt },
  reportSchedule: { enabled, everyDays, emails[], lastSentAt, nextAt },
  periodic: { enabled, everyDays, nextOpenAt },
  versionHistory: [{ version, savedAt, authorName, questions, pages }],   // máx. 20
  languages[], defaultLanguage, webhookUrl, templateId,
  exportAudit: [{ at, userId, userName, format, includeRespondents }],
  categoria, purpose, authorId, authorName, publishedAt, deletedAt, externalId,
  aiAuto: { analysis, provider, model, basedOnAnswered, at }               // cache de la sala de inteligencia
}
```

**`SurveyResponse`**:

```js
{
  tenantId, surveyId, fieldAssignmentId /* puente con relevamientos de campo */, surveyVersion,
  userId /* null si es externa */, guestKey, guestLabel,
  answers: [{ questionId, value }],
  status: enum['draft','submitted'], startedAt, lastSavedAt, submittedAt,
  channel, device, attemptNumber, invalid, invalidReason,
  scoreTotal, scoreByGroup, scoreBand,
  consentAcceptedAt, consentVersion,
  alerts: []
}
// únicos: 1 borrador por usuario/encuesta; 1 enviada por usuario (salvo allowMultiple); 1 por guestKey; 1 por fieldAssignmentId
```

**`SurveyTenantTemplate`**: plantillas propias de cada empresa (preguntas, páginas, scoring, consentimiento).

### 7.4 API

- PWA (`/api/surveys`): `GET /`, `GET /:id`, `PUT /:id/draft`, `POST /:id/respond`.
- Externa sin login (`/api/surveys/external`): `GET /:token`, `POST /:token/respond`, `POST /:token/upload`.
- Admin (`/api/admin/surveys`, capability `admin.encuestas`, 30+ endpoints): listado, CRUD, categorías y tipos configurables, generación con IA (`/generate`, `/generate-questions`), audiencia y su importación, plantillas (`/templates`, `/from-template/:id`, `/:id/save-as-template`), `/:id/duplicate`, `/:id/compare`, `/:id/results`, `/:id/stats`, `/:id/export`, `/:id/restore-version`, `/:id/anonymize-responses`, `/:id/qr`, `/:id/external-link`, `/:id/analyze`.
- Sala de inteligencia (`/api/admin/surveys-intelligence`): `GET /:id`, `GET /:id/export.xlsx`, `POST /:id/analyze-auto`.

### 7.5 Analítica e "inteligencia de encuestas"

- Base (`lib/surveyAnalytics.js`): resultados por pregunta y por grupo, participación hoy/7/30 días, exportes.
- Avanzada (`lib/surveyAdvancedAnalytics.js`): **cruce de dos preguntas**, tiempo mediano de respuesta, tendencia diaria.
- **Sala de inteligencia** (pantalla aparte, `EncuestasInteligenciaAdminView.vue`): responde **Quién** (invitados vs respondieron vs no), **Cuándo** (curva diaria), **Dónde** (tasa por zona/sucursal/área, mapa de huecos), **Qué** (distribución, temas de texto libre), **Cómo** (canal, versión), **Por qué** (deducciones con IA citando `n`). Capas: A) piso determinístico siempre visible; B) IA automática cacheada (se recalcula cada 24 h o +15 respuestas); C) IA a pedido. Sin clave de IA, la capa A funciona igual.

### 7.6 Archivos a copiar

- Backend: `models/Survey.js`, `SurveyResponse.js`, `SurveyTenantTemplate.js`; `routes/surveys.js`, `surveysAdmin.js`, `surveysExternal.js`, `surveysIntelligence.js`, `uploadsSurveysAdmin.js`, `uploadsSurveyAnswers.js`; `lib/surveyQuestions.js`, `surveyLogic.js`, `surveyScoring.js`, `surveyAnalytics.js`, `surveyAdvancedAnalytics.js`, `surveyIntelligence.js`, `surveyNormalize.js`, `surveyPresets.js`, `surveyTemplates.js`, `surveyCategories.js`, `surveyFormulas.js`, `surveyAudienceImport.js`, `surveyExternalToken.js`; `services/surveyAi.js`, `notifySurvey.js`, `surveyReminder.js`, `surveyReminderScheduler.js`, `surveyReport.js`, `surveyReportScheduler.js`.
- PWA: `views/EncuestasView.vue`, `EncuestaDetailView.vue`; `components/SurveyQuestionField.vue`, `SurveyComposerSheet.vue`, `SurveyUserPreview.vue`, `PendingSurveysBanner.vue`; `composables/useSurveyOfflineQueue.js`, `usePendingSurveys.js`.
- Admin: `views/EncuestasAdminView.vue`, `EncuestasInteligenciaAdminView.vue`; `components/QuestionTypePicker.vue`, `QuestionTypeIcon.vue`, `QuestionTypeExample.vue`, `MobileSurveyPreview.vue`, `components/bi/BiSurveyQuestionCard.vue`.

### 7.7 Usos en la cooperativa

- **Satisfacción post-reclamo** (NPS + comentario), disparada al cerrar la orden de trabajo.
- **Encuesta de calidad del servicio** periódica por zona (con mapa de huecos por zona/localidad).
- **Consulta a socios** previa a asamblea (con consentimiento; ojo: no reemplaza votación formal).
- **Censo / actualización de datos del socio** (precarga desde el perfil, `document_id`, `geopoint`, `phone`, `email`).
- **Inspección de campo / checklist** con fotos, firma y GPS (mismo motor, embebido en la OT vía el puente `fieldAssignmentId`).
- **Link externo + QR** en la factura impresa para que respondan sin registrarse.

### 7.8 Encuestas vs relevamientos

Comparten el motor de preguntas. Las **encuestas** van a una audiencia amplia; los **relevamientos** (`FieldForm`/`FieldAssignment`/`FieldSubmission`) se **asignan** a una persona/día/ruta/punto con check-in GPS, foto y geocerca, y una visita puede llevar hasta 3 formularios + 3 encuestas. Para GoodApps, los relevamientos son la base natural de **órdenes de trabajo, rutas de lectura e inspecciones** (segunda etapa).

---

## 8. Audiencia y segmentación — **[ADAPTAR]** **[MEJORAR]**

Motor transversal (`backend/src/lib/audience.js`, `audienceParadigms.js`, `models/audienceFields.js`) usado por publicaciones, encuestas, push y boletines.

- Modos: `all`, `restricted` (áreas/grupos o ramas + personas), `users` (personas puntuales), `import` (solo encuestas), `none`.
- Funciones clave: `normalizeAudience`, `clampAudienceToGrant` (**nadie puede segmentar fuera de su propio alcance**), `userMatchesAudience`, `usersFilterForAudience` (audiencia → destinatarios, para notificar), `audienceFilterForUser` (usuario → qué ve en el feed).
- Regla: *la audiencia ⊆ el alcance del que publica*.

**Problema documentado por ellos:** conviven **tres pickers de audiencia** distintos según el módulo (completo, legado, corto), y lo están unificando retroactivamente en 20+ pantallas.

**Para GoodApps (hacerlo bien desde el día uno):** un **solo motor y un solo componente** de audiencia para todos los módulos, con dimensiones propias de la cooperativa:

| Dimensión | Ejemplos | Fuente de datos (Procoop) |
|---|---|---|
| Tipo de destinatario | socio, empleado, consejero | `SOCIOS`, legajos |
| Zona / ruta / sector | zona de facturación, recorrido | `SUMSOC` (zona/sector/recorrido) |
| Localidad / barrio | Laguna Larga, rural | `PERSONAS`, `SUMSOC` |
| Servicio contratado | energía, agua, internet, sepelio | `SERSOC` |
| Categoría tarifaria | residencial, comercial, rural, T. social | `SERSOC.COD_CAT` |
| Estado | activo, moroso (instancia), suspendido, baja | Mora / cuenta corriente |
| Ramal / transformador | para cortes programados | Técnica / Redes |
| Personas puntuales / lista importada | comisión, lista Excel | — |

---

## 9. Qué no llevar **[NO LLEVAR]**

- Todo lo ECR/SAP: `EcrDivision`, `EcrSapRegistro`, `ecrSapSync*`, `ecrIntegraciones.js`, `supervisionEcr.js`, GeoVictoria, ausentismos ECR, vacaciones ECR, catálogos de retail.
- El paradigma de audiencia por "mundos/ramas SAP" y los campos `User.extraFields.ecr*`.
- Módulos de RRHH (legajos, licencias, onboarding, talento, cultura, beneficios corporativos, juegos, vale de gas, FLOW de turnos), salvo que se decida un módulo de personal. Ojo: Procoop sí tiene **Sueldos**, que es otra cosa (liquidación) y no está en Connectia.
- Tipos de pregunta de relevamientos `ia`, `coleccion`, `registro_coleccion` (útiles a futuro, no ahora).

---

## 10. Deudas de seguridad a no repetir **[MEJORAR]**

Documentadas por el propio equipo en `CONNECTIA-OLA60-*`:

| Código | Problema | Qué hacer en GoodApps |
|---|---|---|
| V-01 | `/uploads` servido público sin autenticación | Almacenamiento privado (S3/Blob) con URLs firmadas; facturas y documentos de socios nunca públicos |
| V-02 | Secretos JWT débiles/de ejemplo | Secretos por entorno en un gestor de secretos; rotación |
| V-04 | CORS abierto si falta la variable | Lista blanca obligatoria; no arrancar en prod sin ella |
| V-05 | Proxy de medios con riesgo SSRF (ya mitigado) | No exponer proxies genéricos |
| V-07 | Sin rate limiting | Límite por IP en login, IA, uploads y portal del socio |
| V-13 | Usuarios demo con clave conocida | Nunca sembrar demo en entornos expuestos |
| — | Credenciales de integraciones en `.env` global | Bóveda por cooperativa con auditoría |

**Hallazgo propio:** el `README.md` raíz de Connectia tiene en texto plano un **token personal de GitHub** y los comandos de acceso SSH a los servidores de producción y desarrollo. Conviene revocar ese token y sacar esos datos del repositorio. Este documento no los copia.

Además, para un ERP con datos fiscales y de socios: auditoría inmutable de cambios en dinero (facturas, pagos, ajustes), transacciones Mongo multi-documento en operaciones contables, y backups con restauración probada.

---

## 11. Si se elige este camino: orden sugerido

1. **Base de plataforma** (copiar): monorepo, Dockerfile, auth completo, multi-empresa, licencias + roles + alcance, cliente API, AppShell de PWA y AdminShell, design system, branding por cooperativa, notificaciones.
2. **Componentes que Connectia no tiene** (construir): `<DataTable>` genérico, `<ExcelImportWizard>`, toasts/confirmaciones, motor único de audiencia, cola de jobs real, almacenamiento privado, rate limiting.
3. **Comunicación con el socio** (copiar + adaptar): Muro, Novedades (boletín + comunicaciones + avisos), Encuestas.
4. **Módulos ERP** desde la definición funcional de Procoop (`procoop-relevamiento/definicion-funcional-alcance.md` y el catálogo de tablas), con la UI de este documento.
5. **App de campo** sobre el patrón de relevamientos + offline.

---

## 12. Documentos fuente en Connectia

Para profundizar (todos en la raíz del repo `C:\Users\lenovo\Documents\CONNECTYX\connectia\`):

| Tema | Documento |
|---|---|
| Reglamento de UI de la PWA | `CONNECTIA-PWA-UI-SPEC.md`, `CONNECTIA-PWA-LIGHT-ON-DARK.md`, `CONNECTIA-OLA59-PWA-RESTYLE-BITACORA.md` |
| Login | `CONNECTIA-OLA57-LOGIN-UX-SPEC.md` |
| Offline | `CONNECTIA-OLA63-OFFLINE-ROLLBACK.md` |
| Rol externo en la PWA | `CONNECTIA-FLOW-ENCARGADO-PWA-SPEC.md` |
| Admin: cabeceras y modales | `CONNECTIA-ADMIN-PANTALLAS-CABECERA.md`, `CONNECTIA-ADMIN-MODALES-BITACORA.md` |
| Permisos y alcance | `CONNECTIA-SPEC-GRANT-ADMIN.md`, `CONNECTIA-CARTA-MAGNA-ALCANCE.md` |
| Licenciamiento | `CONNECTIA-OLA41-A4-LICENCIAMIENTO-SPEC.md` |
| Audiencia | `CONNECTIA-AUDIENCIA-BITACORA.md` |
| Encuestas | `CONNECTIA-ENCUESTAS-COBERTURA.md`, `CONNECTIA-OLA58-EXCEL15-INTELIGENCIA-ENCUESTAS-SPEC.md`, `CONNECTIA-FLOW-SURVEYS-SPEC.md` |
| Menciones | `CONNECTIA-OLA58-MENCIONES-SPEC.md` |
| Cumpleaños / saludos | `CONNECTIA-OLA54-C01-CUMPLES-MISMO-DIA-SPEC.md` |
| BI | `CONNECTIA-OLA61-BI-SUPERVISOR-VIRTUAL-SPEC.md`, `CONNECTIA-OLA61-REPORTERIA-ADDON-SPEC.md` |
| Seguridad | `CONNECTIA-OLA60-S05-ANALISIS-VULNERABILIDADES.md` y `CONNECTIA-OLA60-V0*-*.md` |
| Instalación / build | `CONNECTIA-BUILD.md`, `CONNECTIA-INSTALACION-PRODUCCION.md`, `deploy/README.md` |
| Catálogo de funciones | `CONNECTIA-CATALOGO-FUNCIONES.md` |
