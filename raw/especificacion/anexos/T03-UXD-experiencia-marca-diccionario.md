# T03 UXD — Experiencia, design system, marca por tenant, diccionario de términos y etiquetas, layouts y mapa del sitio

| Campo | Valor |
|---|---|
| Versión | 1.0 (lógico); alineación destino **1.1-impacto** 19-11-2026 (§7.B.0) |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Transversal a ERP / CRM / Landing-autogestión / Plataforma (capa de experiencia común a todas las soluciones) |
| Olas | **O0** (design system admin y PWA, tokens, tipografías, shells AdminShell/AppShell/landing/plataforma, componentes molde y genéricos, reglas UX, login UX base, branding runtime base, diccionario base con resolución y fallback, `siteMapGroups` inicial, accesibilidad como criterio de aceptación) · **O1** (editor de marca completo con recursos por canal y publicación versionada, editor de diccionario completo con previsualización, versiones, reversión e import/export, ayuda contextual editable, flags de UI, mapa del sitio completo con perfiles de pantalla de T02) · cada ola posterior agrega sus ítems de mapa del sitio, claves de diccionario y ayudas (sección 10.8) |
| Dueño de datos | `tenantBrandings`, `brandAssets`, `dictionaryKeys` (catálogo de producto, tenant `PLATFORM`), `tenantDictionaryEntries`, `dictionaryReleases`, `dictionaryMissingKeys`, `screenHelpArticles`, `uiFeatureFlags`, `userUiPreferences`, `dataTableViews`, `pwaNavConfigs`. El árbol `siteMapGroups` es **código versionado** (`packages/shared/siteMap`), no una colección |
| Fuentes consolidadas | BASE líneas 7–14 (advertencia y requisito transversal del diccionario), "Marca y landing por cooperativa" (83–88), "Espacios de trabajo" (117–132), §25 (UX del portal), §30 (tableros, lo visual), §43 completa (MAR-001…MAR-009, CU-MAR-01), §45 (ACC-001…ACC-004, CU-ACC-01, relación perfil de pantallas ↔ menú), §46 (NOT-001…NOT-003, canales), §65 completa (DIC-001…DIC-004, CU-DIC-01), §102.5.6 · AGR-032, AGR §5.6 · CNX §1, §2.3, §2.4, §2.7, §3 completa (3.1–3.8), §4 completa (4.1–4.6), §5.6, §7.1 (presentación en app), §8 (componente único de audiencia), §10 (V-01, V-07), §11 · REL §1 (menú completo de 9 pestañas, alerta de inicio) · DFA §1 (mapa de 29 módulos) y encabezados de los módulos 1–29, DFA M1 (Usuarios, Perfiles, `MENUSYS`), M21 (Noticias y centro de notificaciones), M26, M27, M28 (`FORMULARIOS_PERSONALIZACIONES`, "todos los listados tienen Exportar e Imprimir") · RN-09 §CONFIGURACION (parámetros `VAR_PMOVIL` 5, 6, 7, 8, 9, 34, 35, 40, 41, 65 y `VAR` 518, 709, 2027, 2028, 2029, 2090, 2242, 2251, 2264, 2275, 2280, 2294, 2683, 2790, 2812, 3029, 3093, 3157) · RN-10 §3 (CoopOnline: textos del portal, estados visibles al socio, notificaciones al portal `NOTI_COOP`) |

> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Backend .NET 10 + Azure SQL; admin, PWA y landing en **React 19** + **Vite**; UI compartida Radix/shadcn; textos vía `dict()` en TSX. Paquete ayuda M01+T02: `T03-UXD-screenhelp-base-m01-t02.md`. Físico UXD en `07-*`. Checklist: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Referencias CNX** (`*.vue`) = benchmark Connectia; implementación en componentes React equivalentes. RF/RN no cambian.


Convención de este anexo: todo texto visible se cita como `dict:<clave>`; el texto entre paréntesis que sigue a una clave es el **texto base** del producto (lo que se muestra si el tenant no personaliza). Los colores, tamaños y valores de tokens son normativos (no ilustrativos) salvo que se indique "demo".

> **Guía de desarrollo.** Apartado exclusivo para equipos que implementan UI: [`../GUIA-UI-UX-DESARROLLO.md`](../GUIA-UI-UX-DESARROLLO.md) (entrada única; este anexo T03 es el detalle normativo).

## 1. Objetivo

Definir, de una sola vez y para todas las aplicaciones de CoopApps (admin web, PWA del socio, PWA del empleado, PWA de campo, landing pública y consola de plataforma), **cómo se ve, cómo se navega, cómo habla y cómo se adapta a cada cooperativa** la interfaz, de modo que:

1. Cada módulo M01–M19 y cada transversal T01–T11 construya sus pantallas **solo** con los shells, componentes, tokens y reglas de este anexo, sin inventar variantes.
2. Cada cooperativa (tenant) tenga **su propia app** —nombre, colores, logos, splash, ícono instalable, `theme-color`— y **su propio lenguaje** —diccionario de términos y etiquetas— sin builds separados y sin tocar código (BASE §43, §65; CNX §3.2).
3. Exista **un único mapa del sitio** declarativo (`siteMapGroups`) que alimente el menú, el buscador "Mapa del sitio", el editor de roles/perfiles de pantalla (T02) y la verificación de cobertura frente al menú de ProCoop (sección 10.8 y 22).
4. Los recorridos esenciales cumplan **WCAG 2.2 AA** y sean tolerantes a errores (AGR-032), con una tarea principal clara por pantalla (BASE §102.5.6, AGR §5.6).

### 1.1 Marca comercial del producto (DEC-109)

| Campo | Valor normativo |
|---|---|
| Marca del producto | **CoopApps** (reemplaza «GoodApps Cooperativas» en toda experiencia de usuario) |
| Pronunciación de referencia | *Coop-apps* (español rioplatense) |
| Bajada de marca | `dict:product.tagline` → «Gestión inteligente para cooperativas» |
| Empresa / operador | **GoodApps** — consola de plataforma, contratos SaaS, encargo Ley 25.326; no sustituye la marca del producto en pantallas de tenant |
| Atribución comercial | Texto base protegido `dict:product.attribution` → «por GoodApps» (pie de landing, contratos, material comercial) |
| Logo del producto | Recurso fijo en `brandAssets` con `kind=productLogo` del tenant `PLATFORM`; alt `dict:product.logoAlt` → «CoopApps»; paleta, checklist y archivos en [`08-identidad-marca-coopapps.md`](../08-identidad-marca-coopapps.md) |

Las pantallas de **tenant** muestran la marca de la cooperativa; el nombre **CoopApps** aparece en login, splash, manifest, `theme-color` por defecto, pies legales, ayudas y documentación integrada. La **consola de plataforma** (`PlatformShell`) usa chip `dict:plt.banda` → «Plataforma GoodApps» (operación del servicio, no confundir con la marca del producto que ve el socio).

## 2. Límite y responsabilidades

**Qué hace este anexo (UXD):**

- Design system completo: tokens de color, tipografía, espaciado, radios, sombras, movimiento, iconografía, estados semánticos, temas claro/oscuro, piel `.pwa-mod`.
- Branding runtime por tenant: modelo de datos de marca, recursos por canal, aplicación en runtime (`applyBrandingCssVars`, `applyTenantPwaIdentity`, `applySystemChromeTheme`), manifest dinámico, splash, validación de contraste, publicación versionada.
- Layouts (MainLayouts): `AdminShell`, `AdminStickyHeader`, `ScreenHelp`, `AppShell` (PWA), `LandingLayout`, `PlatformShell`.
- Catálogo de componentes (molde de Connectia + genéricos nuevos) con su contrato de uso.
- Reglas UX transversales (anatomía de cards, altas en modal, skeletons, formato de fecha, errores inline, `notifKinds`, flags de apagado, estados vacíos, confirmaciones, deshacer).
- UX del login (pre-login con marca, pasos, ayudas de formato, selector de tenant, splash, oferta de instalación, landing por rol).
- Accesibilidad WCAG 2.2 AA como requisito verificable.
- Diccionario de términos y etiquetas por tenant: catálogo de claves, resolución con fallback, variables, pluralización, género gramatical, variantes por canal, textos protegidos, publicación versionada, reversión, auditoría, detección de claves faltantes, diccionario base inicial.
- Mapa del sitio completo de cada app con ruta propuesta, capability de "ver" y módulo dueño.
- Preferencias de UI del usuario (tema, densidad, accesos fijados, vistas guardadas de tablas).

**Qué NO hace y a quién delega:**

| Tema | Responsable | Relación con UXD |
|---|---|---|
| Funciones del portal y app del socio (pagar, vincular cuentas, trámites, baja pública), contenido y bloques editables de la landing | **M19 POR** | UXD define `AppShell`, `LandingLayout`, componentes, reglas y el mapa del sitio de la PWA socio y landing; M19 define cada pantalla y su lógica |
| Capabilities, roles, perfiles de pantalla, alcance, login (backend), 2FA, SSO, sesiones | **T02 IAM** | UXD fija la **relación capability → ítem de menú** y la UX del login; T02 define el modelo de permisos y la autenticación |
| Alta de tenant, licencias, packs, activación de capacidades, dominios/subdominios, soporte | **T01 PLA** | UXD consume licencia/activación para ocultar ítems; define el `PlatformShell` y el paso "marca" del alta asistida |
| Configuración versionada genérica, parámetros, publicación, tablas maestras, geografía/calles | **T04 CFG** | Marca y diccionario usan el **mismo patrón** borrador → publicado de T04; los parámetros `PRM-UXD-*` se registran también en el catálogo de T04 |
| Muro, novedades, encuestas, comunicaciones, push, plantillas de email/WhatsApp/SMS, motor de audiencia | **T09 COM** | UXD define los componentes compartidos (`AudiencePicker` único, `MobilePreview`, `notifKinds`) y la ubicación en el mapa; T09 define el dominio |
| BI, salas, KPIs, reportes, generador de reportes, APIs para terceros | **T10 BIA** | UXD define `BiKpiGrid`, `BiFilterBar`, `BiMetricBars`, `BiContextPicker`, `BiAiDrawer` y el "vacío honesto" visual; T10 define fórmulas y contratos |
| Workflow, autorizaciones, expediente documental, auditoría como dominio | **T11 WFL** / **T02 IAM** | UXD define `Timeline` de auditoría, `ApprovalBar`, `FileUploader` privado; el dominio lo define T11/T02 |
| Almacenamiento privado, URL firmadas, rate limiting, CSP, rendimiento, pruebas de accesibilidad automatizadas en CI | **T08 NFR** | UXD fija los criterios; T08 los instrumenta |
| Proveedor de mapas, geocodificación, bóveda de claves (Google Maps) | **T06 INT** / **T04 CFG** | UXD define `AddressPicker` y `MapView` y su alternativa sin mapa |
| Modelo de datos canónico | **T05 DAT** | Las colecciones de la sección 7.B se replican en T05 |
| Migración de textos y logos de ProCoop | **T07 MIG** | La sección 19 define el mapeo; T07 lo ejecuta |
| Documentos fiscales (PDF de factura) | **M05 FAC** / **M06 FIS** | Usan logos de `brandAssets` (canal `documentos`) y claves de diccionario no protegidas; las leyendas fiscales son textos protegidos (RN-UXD-034) |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop / Connectia equivalente |
|---|---|---|---|
| Design system | Conjunto normativo de tokens, componentes y reglas visuales y de interacción | — (término interno, no visible) | Connectia "piel" + `style.css` |
| Token | Variable de diseño con nombre estable (`--brand`, `--pwa-line`) que los componentes consumen; nunca se usan valores literales en componentes | — | CNX variables CSS |
| Piel oscura `.pwa-mod` | Clase raíz que aplica el ADN visual oscuro "tipo login" a listados, formularios y modales de la PWA | — | CNX §3.1 |
| Fondo glow | Gradiente radial lila sobre negro obligatorio en toda pantalla con piel `.pwa-mod` | — | CNX §3.1 |
| Tema | Modo claro u oscuro de una app, resuelto por política del tenant, preferencia del usuario y forzados de sistema | `dict:ui.tema.titulo` (Tema) | `data-theme` |
| Marca (branding) | Identidad visual del tenant: nombre, nombre corto, colores, logos, íconos, splash, imágenes por canal | `dict:uxd.marca.titulo` (Marca e identidad) | ProCoop: `WEB_Logos_Facturas`, `VAR` 518/709/2264/2812 |
| Canal | Superficie donde se presenta la interfaz: `admin`, `desktop`, `pwa-socio`, `pwa-empleado`, `pwa-campo`, `landing`, `plataforma`, `documentos`, `email`, `sms`, `whatsapp`, `push` | `dict:uxd.canal.*` | ProCoop: canales de `VARIABLE_PMOVIL` (CoopOnline, PWeb, PMovil) |
| Recurso de marca | Archivo de imagen asociado a un tenant, un tipo (`kind`), un canal y opcionalmente una sucursal | `dict:uxd.recurso.plural` (Recursos de marca) | Logos en `public/branding/...` (CNX) |
| Splash | Pantalla de presentación o carga inicial de la app con logo y color del tenant | `dict:uxd.splash.titulo` (Pantalla de inicio) | CNX `SplashScreen.vue` |
| Manifest dinámico | Archivo `manifest.webmanifest` generado por tenant con nombre, íconos y colores propios para instalar la PWA | — | CNX `/api/pwa/manifest.webmanifest?emp=` |
| Diccionario | Conjunto de valores visibles por tenant para las claves del catálogo base | `dict:uxd.diccionario.titulo` (Diccionario de términos) | ProCoop: textos sueltos en `VAR_PMOVIL` 5–9, 35, 65; `VAR` 3157 |
| Clave de diccionario | Identificador estable `namespace.objeto.variante` (ej. `per.asociado.plural`) que nunca cambia aunque cambie el texto | — | BASE §65.6 "clave estable" |
| Término (concepto) | Clave de tipo `term` que nombra un concepto de negocio reutilizable (Socio, Cuenta, Orden de trabajo) con singular, plural y género | `dict:uxd.termino.plural` (Términos) | BASE §65.5 "Concepto interno" |
| Etiqueta | Clave de tipo `label` específica de una pantalla, menú, campo o botón | `dict:uxd.etiqueta.plural` (Etiquetas) | BASE §65.6 |
| Texto protegido | Clave que el tenant no puede editar (leyendas fiscales, normativas, legales del producto) | `dict:uxd.protegido.badge` (Protegido) | BASE §65.3 |
| Publicación del diccionario | Versión inmutable numerada del conjunto de valores de un tenant, aplicada a todos los canales | `dict:uxd.publicacion.titulo` (Publicación) | — |
| Fallback | Cadena de resolución: valor del tenant para el canal → valor del tenant genérico → valor base del producto → (nunca) la clave cruda | — | BASE §65.4 |
| Mapa del sitio | Buscador visual de todas las pantallas permitidas, agrupadas por cluster → grupo → ítem | `dict:ui.mapaSitio.titulo` (Mapa del sitio) | CNX §4.2; ProCoop: cinta de 9 pestañas |
| `siteMapGroups` | Árbol declarativo único de navegación (clusters, grupos, ítems con capability, ruta y módulo) | — | CNX `admin/src/utils/siteMapGroups.js`; ProCoop `MENUSYS`/`MENUVAL` |
| Cluster | Primer nivel del mapa (ej. "Facturación y cobranza") | `dict:nav.cluster.*` | Pestaña de la cinta ProCoop |
| Grupo | Segundo nivel del mapa (ej. "Facturación") | `dict:nav.grupo.*` | Grupo de la cinta ProCoop |
| Ítem | Tercer nivel: una pantalla con ruta y capability de acceso | `dict:nav.item.*` | Botón de la cinta ProCoop |
| Acceso fijado | Ítem que el usuario fija en la topbar para acceso directo | `dict:ui.fijados.titulo` (Accesos fijados) | — |
| Cabecera sticky | `AdminStickyHeader`: título, subtítulo y acciones fijas al hacer scroll | — | CNX §4.2 |
| Ayuda contextual | `ScreenHelp`: modal con qué/quién/cuándo/dónde/por qué/cómo + caso de uso | `dict:ui.ayuda.titulo` (Ayuda de esta pantalla) | CNX §4.2 |
| FAB | Botón flotante central "+" de la tabbar cuya acción depende de la pantalla | `dict:ui.fab.aria` (Crear) | CNX `PwaFab.vue`, `useCreateAction` |
| Phone shell | Presentación de la PWA en escritorio como un teléfono centrado (máx. 430 px, radio 28 px) | — | CNX §3.3 |
| Skeleton | Placeholder con la forma de la card final mientras carga | — | CNX §3.5 |
| Estado vacío | Ilustración + título comercial + acción cuando no hay datos | `dict:ui.vacio.*` | CNX `PwaEmptyState.vue` |
| Vacío honesto | En BI, mensaje explícito cuando no hay datos para un KPI, en vez de un 0 engañoso | `dict:bia.vacio.honesto` | CNX §4.5 |
| Vista guardada | Combinación nombrada de columnas, orden, filtros y tamaño de página de un `DataTable` | `dict:ui.tabla.vistaGuardada` (Vista guardada) | — |
| Flag de UI | Interruptor que apaga una mejora o componente sin deploy | — | CNX §3.5 "flag de apagado" |
| `notifKinds` | Mapa central `tipo → {ícono, color, etiqueta}` de notificaciones | — | CNX `utils/notifKinds.js`; ProCoop `NOTI_COOP` |
| Landing por rol | Pantalla inicial distinta según tipo de usuario y estado de su perfil | — | CNX §3.3 guard, §3.8 rol externo |

## 4. Actores, permisos y alcance

Las capabilities siguen `modulo.recurso.accion` (guía §5). Las de este anexo usan el prefijo `uxd`. La relación **capability → ítem de menú** se define en la sección 10.8: un ítem se muestra si y solo si el tenant tiene la capacidad **licenciada y activada** (T01) **y** el usuario tiene la capability de "ver" del ítem **y** el ítem está incluido en su **perfil de pantallas** (T02, BASE §45 ACC-003). Mostrar un ítem no habilita acciones (ACC-004): cada acción vuelve a verificarse en backend.

| Rol (ilustrativo) | Capabilities UXD | Alcance de datos |
|---|---|---|
| Administrador de plataforma | `uxd.plataforma.tokens.ver`, `uxd.plataforma.tokens.editar`, `uxd.plataforma.diccionarioBase.ver`, `uxd.plataforma.diccionarioBase.editar`, `uxd.plataforma.diccionarioBase.publicar`, `uxd.plataforma.flags.configurar`, `uxd.plataforma.ayudaBase.editar`, `uxd.plataforma.marca.ver` (marca de cualquier tenant, solo lectura), `uxd.plataforma.marca.asistir` (paso de marca en el alta asistida), todas con alcance `global` (antes con prefijo `plt.uxd.*`, que no es código de módulo; forma canónica `uxd.plataforma.<recurso>.<accion>` de T02 §4.4 y §4.4.1) | Plataforma (todos los tenants, solo configuración de experiencia; nunca datos operativos — T01) |
| Administrador de cooperativa | `uxd.marca.ver`, `uxd.marca.editar`, `uxd.marca.publicar`, `uxd.diccionario.ver`, `uxd.diccionario.editar`, `uxd.diccionario.publicar`, `uxd.diccionario.revertir`, `uxd.diccionario.exportar`, `uxd.diccionario.importar`, `uxd.ayuda.editar`, `uxd.navegacion.configurar`, `uxd.flags.configurar`, `uxd.vistas.compartir` | Tenant |
| Responsable de comunicación / marca | `uxd.marca.ver`, `uxd.marca.editar`, `uxd.diccionario.ver`, `uxd.diccionario.editar` (sin publicar salvo que se le otorgue `uxd.*.publicar`) | Tenant |
| Usuario interno (cualquier rol) | `uxd.preferencias.editar` (implícita para todo usuario autenticado: tema, densidad, fijados, vistas propias) | Propios |
| Socio / titular / autorizado | `uxd.preferencias.editar` (tema, tamaño de texto, modo de feed) | Propios |
| Técnico / lecturista / cobrador | `uxd.preferencias.editar` | Propios |
| Soporte de plataforma con acceso temporal | Lo que conceda el acceso temporal de T01; por defecto `uxd.marca.ver`, `uxd.diccionario.ver` | Tenant asistido, durante la ventana del acceso |
| Visitante sin sesión | Ninguna; consume endpoints públicos de marca, manifest y diccionario del canal `landing`/`login` | Público del tenant resuelto por subdominio |

Regla de separación: quien edita el diccionario o la marca puede publicar solo si tiene `uxd.*.publicar`; si el parámetro `PRM-UXD-021` exige doble control, el publicador debe ser distinto del último editor (AGR de doble control, T11).

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Design system del admin

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-001 | El admin usa **tema oscuro por defecto** con tema claro disponible, conmutado por `data-theme` en `<html>` | CNX §4.1 | Núcleo | O0 | Adoptado | Al primer ingreso el admin abre en oscuro; el conmutador cambia a claro sin recargar y persiste en `userUiPreferences.theme` |
| RF-UXD-002 | Tokens del admin oscuro: `--canvas #111019`, `--panel #1e1a2b`, `--panel-2 #17141f`, `--ink #ece9f4`, `--line #2c2739`, `--brand #6b5bf0`, `--ok #5bd39b`, `--warn #e2b552`, `--bad #f0837b`, `--r 12px`, `--r-s 9px` (tabla completa en 7.A.1) | CNX §4.1 | Núcleo | O0 | Adoptado | Inspección de variables computadas en `:root[data-theme=dark]` devuelve exactamente esos valores |
| RF-UXD-003 | Tokens del admin claro derivados (7.A.1) con `--brand` igual en claro y oscuro salvo override del tenant | CNX §4.1 | Núcleo | O0 | Adoptado | Contraste de texto sobre superficies ≥ 4,5:1 en ambos temas (prueba automatizada) |
| RF-UXD-004 | Tipografías del admin: **Space Grotesk** (títulos), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (importes, lecturas, códigos, CUIT, números de comprobante y todo dato tabular) | CNX §4.1, guía §8 | Núcleo | O0 | Adoptado | Ningún importe de una tabla se renderiza fuera de `--font-mono`; las fuentes se sirven autoalojadas (PA-UXD-08) |
| RF-UXD-005 | Estados semánticos únicos `ok` / `warn` / `bad` / `info` / `neutral` usados por `StatusBadge`, toasts, rail de cards y KPIs; prohibido usar colores literales para estados | CNX §4.1 | Núcleo | O0 | Adoptado | Lint de estilos rechaza hex literales en componentes fuera de `tokens.css` |
| RF-UXD-006 | Radios `--r 12px` (paneles, modales, cards) y `--r-s 9px` (campos, botones, chips de filtro) | CNX §4.1 | Núcleo | O0 | Adoptado | Revisión visual del catálogo de componentes |
| RF-UXD-007 | Escala de espaciado, tipográfica, sombras, z-index y movimiento definida como tokens (7.A.3–7.A.6) | CNX §3.1, §4.1 (extendido) | Núcleo | O0 | Adoptado | Todos los componentes consumen tokens; ningún `margin`/`padding` literal en componentes de `packages/ui` |
| RF-UXD-008 | Densidad conmutables `cómoda` / `compacta` para tablas y formularios del admin, por preferencia del usuario | Nuevo (ERP) | Estándar | O1 | Adoptado | La densidad compacta reduce la altura de fila de 44 a 32 px sin bajar el área táctil de botones por debajo de 24×24 (WCAG 2.5.8) |
| RF-UXD-009 | Iconografía única `AppIcon` SVG inline 24×24, trazo 1,75, `currentColor`, con catálogo por nombre; sin librerías de íconos externas | CNX §2.1, §3.4 | Núcleo | O0 | Adoptado | Catálogo visible en la página de componentes; ícono inexistente muestra un placeholder y registra advertencia en desarrollo |
| RF-UXD-010 | Gráficos del admin en SVG/CSS propio (sin librería de gráficos), con tabla de datos alternativa accesible | CNX §2.1, §4.5; AGR-032 | Estándar | O0 | Adoptado | Todo gráfico tiene botón `dict:ui.grafico.verTabla` (Ver como tabla) |

### 5.2 Design system de la PWA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-011 | Piel oscura `.pwa-mod` aplicada a listados, formularios y modales de la PWA, independiente del tema de la empresa | CNX §3.1 | Núcleo | O0 | Adoptado (A validar PA-UXD-01 para socios) | Toda vista de la PWA monta su contenido dentro de un contenedor con clase `.pwa-mod` |
| RF-UXD-012 | Tokens `.pwa-mod`: `--pwa-bg #000` (página) / `#22222b` (hoja), `--pwa-brand` (default `#7a51ca`), `--pwa-lilac` (default `#8b78ff`), `--pwa-text #fff`, `--pwa-muted rgba(255,255,255,.72)`, `--pwa-dim rgba(255,255,255,.48)`, `--pwa-line rgba(255,255,255,.10)`, `--pwa-card-fill #22222b`, `--pwa-radius-field 14px`, `--pwa-radius-modal 18px` (7.A.2) | CNX §3.1 | Núcleo | O0 | Adoptado | Variables computadas coinciden; `--pwa-brand`/`--pwa-lilac` cambian con la marca del tenant |
| RF-UXD-013 | Fondo glow obligatorio: `background-color #000` + `radial-gradient(90% 55% at 50% -8%, rgba(139,120,255,.18), transparent 55%)` + `radial-gradient(70% 40% at 100% 100%, rgba(139,120,255,.05), transparent 50%)`, con el lila sustituido por el acento del tenant | CNX §3.1 | Núcleo | O0 | Adoptado | Captura de referencia por tenant demo; el glow usa `--pwa-lilac-rgb` |
| RF-UXD-014 | Tipografía única de la PWA: `'Sora', 'Montserrat', 'Segoe UI', sans-serif`, con cifras tabulares (`font-variant-numeric: tabular-nums`) en importes y lecturas | CNX §3.1; CTR-UXD-02 | Núcleo | O0 | Adoptado | Importes alineados por dígito en listas de facturas |
| RF-UXD-015 | Tema claro de base de la PWA (`style.css`): página `#f8fafc`, superficie `#ffffff`, texto `#0f172a`, secundario `#64748b`, marca `#8554c9`; tema oscuro: página `#000`, card `#22222b`, marca `#a78bfa` | CNX §3.1 | Núcleo | O0 | Adoptado | Conmutar `data-theme` cambia superficies fuera de `.pwa-mod` (topbar, tabbar, landing interna) |
| RF-UXD-016 | Resolución del tema en **tres niveles**: política del tenant (`dark` / `light` / `user`), preferencia del usuario (si la política lo permite) y **oscuro forzado** en login y splash | CNX §3.1 | Núcleo | O0 | Adoptado | Con política `dark` el selector de tema no aparece en Perfil; login y splash siempre oscuros |
| RF-UXD-017 | H1 de vista: `font-weight 600`, `letter-spacing -0.035em`, `font-size clamp(1.35rem, 4.5vw, 1.55rem)`; cada vista empieza con H1 + subtítulo | CNX §3.1, §3.3 | Núcleo | O0 | Adoptado | Ninguna vista de la PWA carece de H1 único (lint de accesibilidad) |
| RF-UXD-018 | Radios PWA `14 / 18 / 999px`; padding de página `1.25rem 1rem 5rem`; sombra de CTA `0 10px 28px rgba(122,81,202,.28)` recalculada con la marca | CNX §3.1 | Núcleo | O0 | Adoptado | Revisión visual |
| RF-UXD-019 | Animación de entrada `translateY(12px) → 0` en 0,45 s, desactivada con `prefers-reduced-motion: reduce` o preferencia del usuario | CNX §3.1; AGR-032 | Núcleo | O0 | Adoptado | Con reduce-motion activo no hay transformaciones en entrada de vistas |
| RF-UXD-020 | Tamaño de texto ajustable por el usuario (100 % / 115 % / 130 %) sin romper layout, en PWA socio | AGR-032 (WCAG 1.4.4) | Estándar | O1 | Adoptado | A 130 % ningún título de card se trunca ni se superpone |

### 5.3 Branding runtime por tenant

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-021 | El alta de un tenant crea su `tenantBranding` publicado con valores por defecto (nombre del tenant, colores default, logos de producto) para que admin, PWA y landing funcionen desde el primer minuto | BASE §43 MAR-001; CNX §4.3 | Núcleo | O0 | Adoptado | Un tenant recién creado abre admin, PWA y landing con su nombre y sin imágenes rotas |
| RF-UXD-022 | El tenant gestiona desde su admin: nombre de marca, nombre corto, colores (principal, acento, secundario), logos y splash | BASE MAR-002, MAR-003 | Núcleo | O1 | Informado | Pantalla PAN-UXD-01 permite editar y publicar cada campo |
| RF-UXD-023 | Recursos diferenciados por canal: logo admin (topbar), logo desktop, logo app móvil (interno), ícono de app (192, 512, maskable, apple-touch), favicon, splash móvil, splash desktop, logo app de empleados, logo app de socios, logo app de campo, fondo de login, imagen principal de landing, logo para documentos (factura/recibo), cabecera de email | BASE MAR-003…MAR-006, §43.5; CNX §3.2 | Núcleo | O1 | Informado (A validar PA-UXD-10 sucursal) | Cada `kind` de 7.B.2 tiene slot en el editor; un canal sin recurso propio hereda según la cadena de 9.2 |
| RF-UXD-024 | Permitir usar la misma imagen en varios canales sin volver a subirla ("usar también en…") | BASE §43.4 | Estándar | O1 | Informado | Un mismo `brandAssetId` puede referenciarse desde varios slots |
| RF-UXD-025 | `applyBrandingCssVars()` pisa en runtime solo las variables de marca (`--brand`, `--brand-accent`, `--brand-2`, `--pwa-brand`, `--pwa-lilac`, sus `-rgb`, `--brand-contrast` y derivados calculados), el resto hereda | CNX §3.2 | Núcleo | O0 | Adoptado | Cambiar el color publicado se refleja en todas las apps sin build |
| RF-UXD-026 | `applyTenantPwaIdentity()` cambia favicon, `<title>` (`{nombreCorto} · {pantalla}`) y enlaza el **manifest dinámico** `/api/public/{tenantSlug}/pwa/manifest.webmanifest?app={socio\|empleado\|campo}` | CNX §3.2 | Núcleo | O0 | Adoptado | Instalar la PWA en Android muestra ícono y nombre de la cooperativa |
| RF-UXD-027 | `applySystemChromeTheme()` actualiza `<meta name="theme-color">` según tema vigente y color del tenant (barra de estado Android, barra de título PWA en escritorio) | CNX §3.2 | Núcleo | O0 | Adoptado | Al cambiar tema, `theme-color` cambia en ≤ 1 frame |
| RF-UXD-028 | Logos **jerárquicos**: tenant → sucursal; si la sucursal no tiene logo se usa el del tenant; si el tenant no tiene, el del producto | CNX §3.2 | Estándar | O1 | A validar (PA-UXD-10) | Usuario con contexto de sucursal ve el logo de su sucursal en la topbar |
| RF-UXD-029 | Splash con logo y color del tenant, mostrado al abrir la PWA instalada y tras el login, con duración máxima 1,2 s o hasta que cargue el shell, lo que ocurra primero | CNX §3.4, §3.6; BASE MAR-003 | Núcleo | O0 | Adoptado | El splash nunca bloquea más de 1,2 s una app ya cargada |
| RF-UXD-030 | Validación automática de imágenes: formatos (SVG saneado, PNG, WebP, JPG), dimensiones mínimas por `kind`, peso máximo, transparencia requerida para íconos maskable, zona segura del 80 % | BASE §43.9 (formatos pendientes) | Núcleo | O1 | Adoptado | Un PNG de 100×100 rechazado como ícono 512 con error inline explicativo |
| RF-UXD-031 | Generación automática de variantes (íconos 48–512, maskable, apple-touch 180, favicon 32/16, splash por densidad) a partir de un original (JOB-UXD-01) | Nuevo | Estándar | O1 | Adoptado | Subir un SVG de 1024 produce todas las variantes y se listan en el editor |
| RF-UXD-032 | **Validación de contraste** de los colores del tenant contra fondos claros y oscuros; si no alcanza 4,5:1 (texto) o 3:1 (UI) se calcula un `--brand-contrast` accesible y se advierte en el editor, sin impedir publicar el color decorativo | AGR-032 | Núcleo | O1 | Adoptado | Un amarillo `#ffe14d` publicado usa texto `#111019` sobre botones y se muestra advertencia |
| RF-UXD-033 | Previsualización en contexto antes de publicar: admin (topbar), PWA socio, PWA empleado, login, splash, landing, ícono instalado, email y PDF de factura, en claro y oscuro | BASE §43.4 (previsualización propuesta); CNX §4.2 previews celular | Estándar | O1 | Adoptado | La previsualización usa la marca en borrador sin afectar a usuarios |
| RF-UXD-034 | Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) | BASE §65.4 (patrón), T04 | Núcleo | O1 | Adoptado | Revertir restaura la versión N-1 y genera una nueva versión N+1 |
| RF-UXD-035 | Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública **por tenant** con hash en el nombre | BASE §43.4, §43.6 excepciones; CNX §10 V-01 | Núcleo | O0 | Informado | Un usuario de TEN-001 no puede listar ni modificar recursos de TEN-002 (prueba negativa) |
| RF-UXD-036 | Pre-login con marca: al resolver el tenant (subdominio o código) se cargan logo, colores, fondo de login y botones de SSO **antes** de autenticar, sin revelar usuarios | CNX §2.3, §3.6 | Núcleo | O0 | Adoptado | `GET /api/public/{slug}/branding` responde sin datos personales |
| RF-UXD-037 | El paso "Marca" del alta asistida de tenant en plataforma permite proponer logo y colores con IA (solo propone; un humano confirma) | CNX §4.3 | Extensión | O1 | Adoptado | La propuesta queda en borrador hasta confirmación |
| RF-UXD-038 | Nombre visible del remitente por canal derivado de la marca: email (`emailSenderName`), SMS (`smsSenderName`, máx. 11 caracteres alfanuméricos), WhatsApp (nombre del perfil, informativo) | RN-09 VAR 709, 2812 | Estándar | O1 | Reemplazado (de VAR 709/2812) | El SMS de aviso usa el nombre corto configurado |
| RF-UXD-039 | Sigla/nombre corto de la cooperativa (`shortName`) usada en títulos de pestaña, archivos exportados y textos compactos | RN-09 VAR 2264 | Estándar | O1 | Reemplazado (de VAR 2264) | Exportar una tabla genera `{shortName}-{pantalla}-{dd-mm-yyyy}.xlsx` |
| RF-UXD-040 | Caché de marca por tenant en cliente (versión en `ETag`), invalidada al publicar mediante evento `uxd.branding.published` y comprobación de versión en cada arranque | BASE §65.8 (caché con contexto de tenant) | Núcleo | O0 | Adoptado | Tras publicar, un cliente abierto toma la nueva marca en el siguiente arranque o en ≤ 5 min |

### 5.4 Layouts del admin

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-041 | `AdminShell` único con **topbar**: logo del producto, logo del tenant, selector de contexto, botón `dict:ui.mapaSitio.titulo` (Mapa del sitio), accesos fijados, buscador global, centro de alertas, avisos, ayuda, menú de usuario | CNX §4.2 | Núcleo | O0 | Adoptado | Todas las rutas del admin con `meta.tenantOnly` se renderizan dentro de `AdminShell` |
| RF-UXD-042 | **Selector de contexto**: tenant (si el usuario pertenece a varios), sucursal/agencia, y cuando el módulo lo use, servicio y período; el contexto viaja en el cliente API y se recalculan perfiles y alcance (T02) | CNX §4.2; BASE §102.5.2 | Núcleo | O0 | Adoptado | Cambiar de sucursal recarga datos con el nuevo alcance sin cerrar sesión |
| RF-UXD-043 | **Mapa del sitio**: modal de pantalla completa con buscador (por etiqueta del diccionario, sinónimos, ruta y código ProCoop equivalente), clusters → grupos → ítems, solo ítems permitidos, y opción de fijar | CNX §4.2 | Núcleo | O0 | Adoptado | Buscar "libro iva" encuentra `SM-ADM-` del Libro IVA Ventas aunque el tenant haya renombrado el ítem |
| RF-UXD-044 | **Menú lateral** colapsable generado del mismo `siteMapGroups`; recuerda grupos abiertos; muestra badge de pendientes por ítem cuando el módulo lo provea | CNX §4.2 | Núcleo | O0 | Adoptado | No existe segunda fuente de menú (revisión de código) |
| RF-UXD-045 | **Accesos fijados** por el usuario (máx. 12) en la topbar, reordenables por arrastre y teclado | CNX §4.2 | Estándar | O0 | Adoptado | Persisten entre dispositivos en `userUiPreferences.pinnedItems` |
| RF-UXD-046 | Accesos sugeridos por el administrador del tenant por rol (fijados por defecto que el usuario puede quitar) | CNX §4.4 "Accesos rápidos" | Extensión | O1 | Adoptado | Un usuario nuevo con rol Cajero ve "Cobranza local" fijado |
| RF-UXD-047 | **`siteMapGroups` declarativo único** usado por menú, mapa del sitio, editor de roles/perfiles de pantalla (T02), breadcrumbs, buscador global y verificación de cobertura; prohibido parchar el menú en runtime | CNX §4.2, §4.6 | Núcleo | O0 | Adoptado | Test que compara rutas del router con ítems del mapa: toda ruta navegable tiene ítem (o `meta.hiddenFromMap` justificado) |
| RF-UXD-048 | `AdminStickyHeader`: título (`dict:`), subtítulo, breadcrumb, botones de acción a la derecha (máx. 1 primaria + 3 secundarias + menú "más"); debajo y fuera del sticky: ayuda, pestañas, filtros | CNX §4.2 | Núcleo | O0 | Adoptado | Al hacer scroll el título y las acciones permanecen visibles |
| RF-UXD-049 | `ScreenHelp`: botón `?` en la cabecera que abre modal con **qué / quién / cuándo / dónde / por qué / cómo + caso de uso**, contenido base del producto sobreescribible por tenant y con enlace a la CU de la especificación | CNX §4.2 | Núcleo | O0 (estructura) / O1 (editor) | Adoptado | Toda pantalla PAN-* de los anexos tiene `screenId` y artículo de ayuda base |
| RF-UXD-050 | **Modales en 4 tamaños** `sm 480 / md 720 / lg 960 / xl 1180 px`, `Teleport to="body"`, cabecera con color de marca, cierre por fuera, Esc y botón; atrapan el foco y lo devuelven al disparador | CNX §4.2; AGR-032 | Núcleo | O0 | Adoptado | Prueba de teclado: Tab no escapa del modal; Esc lo cierra salvo cambios sin guardar (pide confirmación) |
| RF-UXD-051 | Previews "celular" dentro del admin (`MobilePreview`) para publicaciones, encuestas, notificaciones, marca y diccionario | CNX §4.2 | Estándar | O1 | Adoptado | El preview usa la marca y el diccionario en borrador del tenant |
| RF-UXD-052 | Patrón **IA solo propone**: toda generación de IA aparece como borrador marcado `dict:ui.ia.propuesta` (Propuesta de IA) y requiere confirmación humana | CNX §4.2 | Núcleo | O0 | Adoptado | Ningún endpoint de IA persiste en estado publicado |
| RF-UXD-053 | Cliente API único: agrega `Bearer` + contexto; ante 401 hace **un único refresh compartido** y reintenta una vez; errores RFC 9457 mapeados a toasts/errores inline con `requestId` visible en "Detalles" | CNX §4.2; guía §5 | Núcleo | O0 | Adoptado | 10 requests concurrentes con token vencido disparan 1 solo refresh |
| RF-UXD-054 | Separación de router `meta.platformOnly` / `meta.tenantOnly`; `PlatformShell` para plataforma | CNX §4.3 | Núcleo | O0 | Adoptado | Un usuario de tenant que navega a `/plataforma/*` recibe 404 de UI y 403 de API |
| RF-UXD-055 | **Centro de alertas** del tenant en la topbar (badge) que reemplaza los avisos modales de inicio de ProCoop (ej. "Hay facturas electrónicas pendientes de autorizar") con enlace a la bandeja correspondiente | REL §1 (alerta de inicio); DFA M21 (Centro de notificaciones) | Núcleo | O0 (estructura) / O4 (alerta ARCA) | Reemplazado por | El ingreso no muestra modal bloqueante; la alerta aparece en el centro con contador |
| RF-UXD-056 | Breadcrumb `cluster / grupo / ítem / detalle` derivado del mapa | Nuevo | Estándar | O0 | Adoptado | Coincide con la jerarquía del mapa |
| RF-UXD-057 | Buscador global (Ctrl+K) que busca pantallas del mapa y, si el usuario tiene permiso, entidades (titular por nombre/DNI/CUIT/cuenta, comprobante por número, OT por número) | Nuevo (ERP) | Estándar | O1 | Adoptado | Resultados agrupados por tipo y filtrados por alcance |
| RF-UXD-058 | Admin **responsive** desde 1024 px como objetivo principal; 768–1023 px (tablet) soportado con menú colapsado; < 768 px aviso de usar la PWA de empleado | Nuevo | Estándar | O0 | A validar (PA-UXD-13) | En 1024 px ninguna tabla desborda sin scroll horizontal controlado |
| RF-UXD-059 | Ficha de entidad compleja (titular, cuenta, servicio contratado, proveedor, empleado) como **página de detalle** con cabecera resumen, pestañas y `Timeline` de auditoría; el **alta inicial** en modal `lg`/`xl` con los datos mínimos | CNX §4.2; REL §2 (fichas ProCoop con pestañas); CTR-UXD-05 | Núcleo | O0 | Adoptado | Alta de persona en modal; al guardar navega a la ficha |
| RF-UXD-060 | Modo **solo lectura** visible en fichas (cuando el usuario no tiene `editar`), con banda `dict:ui.soloLectura` (Solo lectura) | DFA M1 (modo "Sólo LECTURA") | Estándar | O0 | Replicar | Campos deshabilitados con aria-readonly y la banda visible |
| RF-UXD-061 | **Bloqueo de edición concurrente** visible: si otro usuario editó el registro (control optimista `version`), mostrar diálogo con diferencias y opciones recargar / sobrescribir (si tiene permiso) | DFA M1 (`BLOQUEO_FILAS`); guía §5 `version` | Núcleo | O0 | Mejorar | Guardar con versión vieja devuelve 409 y el diálogo muestra los campos en conflicto |
| RF-UXD-062 | Ayuda de formato siempre visible bajo cada campo con formato (DNI sin puntos, CUIT con guiones, CBU 22 dígitos) | CNX §3.6 punto 6 | Núcleo | O0 | Adoptado | Los campos con máscara muestran `hint` |

### 5.5 Layout de la PWA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-063 | **Una sola PWA** (`apps/pwa`) con landing por rol: socio, empleado, técnico, lecturista, cobrador; menú recortado por allowlist de rol y estado del perfil | Guía §8; CNX §3.3, §3.8 | Núcleo | O0 | Adoptado | Un mismo usuario socio y empleado ve selector de "espacio" (Mi cooperativa como socio / Mi trabajo) |
| RF-UXD-064 | `AppShell` único: topbar (menú · logo del tenant · pendientes · asistente IA opcional · avisos con badge), banner opcional, contenido con scroll único, tabbar | CNX §3.3 | Núcleo | O0 | Adoptado | Ninguna vista de la PWA define su propia topbar |
| RF-UXD-065 | **Banners** apilables con prioridad: offline/pendientes de envío > encuestas obligatorias > deuda vencida/servicio suspendido (socio) > corte programado en tu zona > instalación de la app; máximo 2 visibles, el resto en "ver más" | CNX §3.3, §3.4 | Núcleo | O0 | Adoptado | Con 4 banners activos se ven 2 y un contador |
| RF-UXD-066 | **Tabbar** de 5 posiciones con FAB "+" central; contenido por rol según 10.1.4 (socio: Inicio · Cuentas (antes "Cuentas y servicios"; rótulo corto de RN-UXD-006) · + · Gestiones · Comunidad, con Perfil en la topbar, conforme al maestro §9.2; esta es la versión que rige para el portal y el destino Comunidad abre PAN-POR-105 `/app/comunidad` de M19 (PA-POR-20; antes "la pantalla Comunidad de M19 (PA-POR asumida)"), agregador de muro, encuestas y novedades; empleado: Inicio · Recibos · + · Solicitudes · Perfil y registrado sin cuenta: Inicio · Contratar · + · Gestiones · Perfil, conforme a M19 §10.1 (M19 dueño del portal); campo: Hoy · Órdenes/Rutas/Cobranza · + · Stock en vehículo · Sincronización, maestro §9.3) | CNX §3.3; Maestro §9.2–9.3; CTR-UXD-12 | Núcleo | O0 | Adoptado | La tabbar del socio muestra `dict:nav.pws.inicio`, `dict:nav.pws.servicios`, `+`, `dict:nav.pws.gestiones`, `dict:nav.pws.comunidad` |
| RF-UXD-067 | **FAB contextual** mediante `useCreateAction` (provide/inject): cada vista registra su acción de alta; si la vista no registra, el FAB abre el menú de altas permitidas del rol | CNX §3.3, §3.4 | Núcleo | O0 | Adoptado | En "Mis gestiones" el FAB abre el modal de nueva gestión |
| RF-UXD-068 | **Menú hamburguesa** como modal de altura completa con buscador y grupos colapsables definidos como datos (`pwaSiteMap` por rol) | CNX §3.3 | Núcleo | O0 | Adoptado | Buscar "factura" encuentra el ítem aunque esté renombrado |
| RF-UXD-069 | **Phone shell** en escritorio: la PWA se centra con `max-width 430px` y `border-radius 28px` sobre el fondo glow | CNX §3.3 | Estándar | O0 | A validar (PA-UXD-11) | En 1440 px el contenido mide 430 px de ancho |
| RF-UXD-070 | Guard de router único: autenticación, términos pendientes, bloqueo de escritorio por tenant/rol, **ruteo por rol y por estado del perfil** (pendiente de validación / activo / moroso / suspendido / baja para socio; activo/suspendido para empleado) | CNX §3.3, §3.8 | Núcleo | O0 | Adoptado | Socio con servicio suspendido aterriza en Inicio con banner y acceso directo a pagar |
| RF-UXD-071 | Composables: `usePwaInstall` (A2HS con pasos para iOS), `usePullToRefresh`, `usePushSubscribe`, `useNotifBadge`, `useDictation`, `useOfflineQueue` (único) | CNX §3.4 | Estándar | O0 | Adoptado | Oferta de instalación tras el primer login exitoso, descartable y no repetida por 30 días |
| RF-UXD-072 | Autogestión con **una tarea principal clara por pantalla**: priorizar Mis servicios, Mis facturas y pagos, Mis gestiones y Noticias; estados del trámite y del servicio mostrados por separado | BASE §102.5.6; AGR §5.6 | Núcleo | O2 | Adoptado | Cada vista de la PWA socio declara `primaryTask` en su meta y tiene una sola acción primaria |
| RF-UXD-073 | Bandeja del empleado con **siguiente acción, responsable y contexto**; supervisor con pendientes sin asignar y excepciones | BASE §102.5.6; AGR §5.6 | Núcleo | O2 | Adoptado | La card de bandeja muestra "Siguiente: …" y responsable |
| RF-UXD-074 | Tiras horizontales en Inicio del socio (`MuroStripSection`): "Tu última factura", "Cortes programados en tu zona", "Encuesta de satisfacción", "Tus gestiones abiertas" | CNX §5.1 | Estándar | O2 | Adoptado | Las tiras respetan permisos y se ocultan si no hay datos |
| RF-UXD-075 | Estados del socio, de la solicitud y del servicio con textos distintos: `dict:estado.solicitud.recibida` (Solicitud recibida) ≠ `dict:estado.servicio.activo` (Activo); nunca representar una solicitud como servicio activado | BASE §43.3, §43.4, §43.8 | Núcleo | O2 | Informado | Prueba: solicitar alta de Internet muestra "Solicitud recibida", no "Activo" |

### 5.6 Landing y plataforma

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-076 | `LandingLayout` público por tenant (resuelto por subdominio): cabecera con logo y navegación, hero, servicios habilitados, noticias públicas, acceso a la app, consulta pública, pago sin login (si aplica), baja pública (si corresponde), contacto, pie con legales | BASE §43 MAR-007, MAR-008, §46 NOT-001; guía §8 | Núcleo | O2 | Informado | La landing de TEN-001 no muestra datos privados ni contenido marcado para empleados |
| RF-UXD-077 | La landing usa tipografía Sora y los tokens claros de la PWA por defecto (público general), con secciones en piel oscura opcionales | CNX §3.1 (extensión) | Estándar | O2 | A validar (PA-UXD-01) | Lighthouse accesibilidad ≥ 95 en landing demo |
| RF-UXD-078 | El ingreso a la app desde la landing conserva el contexto del tenant (no pide código de empresa) | BASE §43.4, MAR-008; CNX §3.6 | Núcleo | O2 | Informado | Click en `dict:lnd.acceso.app` abre `/login` del mismo subdominio con marca cargada |
| RF-UXD-079 | `PlatformShell`: misma estructura que `AdminShell` con marca del producto (sin marca de tenant), banda superior distintiva `dict:plt.banda` (Plataforma GoodApps) y selector "ver como tenant" solo con acceso temporal vigente (T01) | CNX §4.3; BASE §42 | Núcleo | O0 | Adoptado | La banda de plataforma es siempre visible y de color distinto al de cualquier tenant |
| RF-UXD-080 | Dashboard global de plataforma y dashboard de tenant separados; los indicadores globales no muestran detalle operativo de una cooperativa | BASE §30, §54 | Núcleo | O1 | Informado | Desde el dashboard global no hay enlaces a fichas de socios |

### 5.7 Componentes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-081 | Portar los **componentes molde** de la PWA: `PwaModal`, `PwaTabs`, `PwaFilters`, `PwaEmptyState`, `PwaFab`, `PwaFilePicker`, `PwaCardExtra`, `ConfirmSheet`, `AppIcon`, `SplashScreen`, `PwaOfflinePendingBanner`, `PendingSurveysBanner` (catálogo 10.2) | CNX §3.4 | Núcleo | O0 | Adoptado | Todos disponibles en `packages/ui` con historia en el catálogo |
| RF-UXD-082 | Construir `DataTable` genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor `?page=&size=`, selección masiva con acciones, exportar XLSX/CSV/PDF (respetando filtros y alcance), vistas guardadas propias y compartidas, totales por columna numérica, fila expandible, densidad, columnas fijas, estado vacío, skeleton, accesible por teclado | CNX §4.6; DFA M28 ("todos los listados tienen Exportar e Imprimir"); guía §8 | Núcleo | O0 | Mejorar | Ninguna pantalla de listado del admin implementa una tabla propia |
| RF-UXD-083 | Construir `ExcelImportWizard` de 3 pasos: subir (XLSX/CSV, plantilla descargable) → previsualizar con errores por fila y columna, mapeo de columnas → confirmar; ejecución en job con progreso, resultado por fila descargable, idempotencia por hash de archivo | CNX §4.6 | Núcleo | O0 | Mejorar | Importar 10.000 filas con 3 errores muestra los 3 errores y permite importar solo las válidas |
| RF-UXD-084 | Sistema de **toasts** único (éxito, info, advertencia, error) con cola, duración por tipo, acción "Deshacer" cuando aplique (6 s), `aria-live` | CNX §4.6, §6.3 (deshacer 6 s) | Núcleo | O0 | Mejorar | Errores no se cierran solos; éxitos sí a los 4 s |
| RF-UXD-085 | `ConfirmDialog` (admin) / `ConfirmSheet` (PWA) únicos para acciones destructivas o irreversibles, con texto del efecto, nombre del objeto y, para acciones económicas críticas, escritura de confirmación | CNX §3.4, §4.6 | Núcleo | O0 | Mejorar | Anular un lote exige tipear el número del lote |
| RF-UXD-086 | `AudiencePicker` **único** para todo el sistema (publicaciones, encuestas, push, boletines, comunicaciones masivas, avisos de corte), con dimensiones de la cooperativa y recorte al alcance del que publica | CNX §8 | Núcleo | O2 | Mejorar | No existe otro picker de audiencia en el código |
| RF-UXD-087 | `MoneyInput` / `MoneyDisplay` con `decimal.js`, separador de miles `.` y decimal `,` (es-AR), moneda, precisión por concepto, negativo con signo y color `bad` opcional, fuente mono/tabular | Guía §5 (Dinero) | Núcleo | O0 | Adoptado | `MoneyInput` nunca convierte a `Number`; pegar "1.234,56" produce `1234.56` |
| RF-UXD-088 | `DateInput` / `DateRange` / `PeriodPicker` con formato visible `dd-mm-yyyy`, zona horaria del tenant, atajos (hoy, este mes, mes anterior, últimos 30 días, ejercicio actual) y escritura manual | CNX §3.5; guía §5 | Núcleo | O0 | Adoptado | Escribir "05-11-2026" es válido; "2026-11-05" se normaliza |
| RF-UXD-089 | `AddressPicker` con catálogo de calles (T04), altura, piso/depto, localidad, y **mapa** opcional para ubicar el punto (coordenadas); siempre con alternativa sin mapa | BASE §77; AGR-032 | Núcleo | O2 | Adoptado | Un domicilio puede cargarse completo sin interactuar con el mapa |
| RF-UXD-090 | `EntityPicker` genérico con búsqueda server-side, filtros por alcance, alta rápida opcional (si tiene permiso), selección simple o múltiple, chips accesibles | Nuevo | Núcleo | O0 | Adoptado | Buscar titular por DNI, nombre, CUIT o cuenta |
| RF-UXD-091 | `StatusBadge` único con mapa `estado → {tono semántico, ícono, dict}` por entidad; nunca color como único indicador | Nuevo; AGR-032 (WCAG 1.4.1) | Núcleo | O0 | Adoptado | Todos los estados tienen ícono + texto |
| RF-UXD-092 | `Timeline` de auditoría: quién, cuándo, qué cambió (antes → después), origen (pantalla, API, job, integración), `requestId`, con filtros | BASE §54 (auditoría de cada cambio); DFA M1 | Núcleo | O0 | Adoptado | La ficha de titular muestra la línea de tiempo con diferencias |
| RF-UXD-093 | `FileUploader` **privado** (almacenamiento con URL firmadas, nunca `/uploads` público), con arrastre, cámara en móvil, progreso, tipos y tamaños permitidos, antivirus/escaneo asíncrono (T08) | CNX §10 V-01, §3.4 `PwaFilePicker` | Núcleo | O0 | Mejorar | Una URL de adjunto expira según T08 y no es accesible sin firma |
| RF-UXD-094 | `SignaturePad` accesible (trazo con dedo, lápiz o mouse; alternativa "firmo con mi PIN/OTP" para quien no puede trazar) | BASE §25 (firmar conformidad), §73; AGR-032 | Núcleo | O3 | Adoptado | Conformidad de instalación firmable por trazo o por OTP |
| RF-UXD-095 | `OfflineBanner` / `PwaOfflinePendingBanner` único con contador de pendientes, botón "Reintentar" y detalle por ítem; motor de cola único en IndexedDB con `clientMutationId` | CNX §3.7 [MEJORAR]; guía §8 | Núcleo | O3 | Mejorar | Sin red, una lectura queda en cola y se envía sola al volver la red |
| RF-UXD-096 | Componentes BI: `BiFilterBar`, `BiKpiGrid` (KPI con fórmula visible en tooltip y "vacío honesto"), `BiMetricBars`, `BiContextPicker` (hasta 40 ítems), `BiAiDrawer` (IA que solo cita KPI/ítem) | CNX §4.5 | Estándar | O1 (base) / O11 (salas) | Adoptado | Un KPI sin datos muestra `dict:bia.vacio.honesto` y no 0 |
| RF-UXD-097 | Catálogo completo de componentes del sistema en 10.2 (más de 70), documentado en un catálogo navegable interno (ruta `/plataforma/design-system` solo plataforma y entornos no productivos) | Nuevo | Estándar | O0 | Adoptado | Cada componente tiene ejemplo, props, estados y notas de accesibilidad |

### 5.8 Reglas UX

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-098 | **Card de listado** con anatomía fija: rail de color de estado · ícono de tipo · título que **nunca se trunca** · badge de estado · dato principal · 2–4 meta-tags · chevron; mínimo 5 datos legibles sin abrir el detalle | CNX §3.5 | Núcleo | O0 | Adoptado | Revisión de todas las listas PWA contra `ListCard` |
| RF-UXD-099 | **Alta siempre en modal** abierto desde el FAB (PWA), nunca en página completa; en admin, alta en modal según 10.3 | CNX §3.5; CTR-UXD-05 | Núcleo | O0 | Adoptado | Ninguna ruta `/nuevo` en la PWA |
| RF-UXD-100 | **Carga inicial con 3 skeleton cards** del mismo formato (nunca spinner centrado); al refrescar, la lista baja opacidad pero no se vacía | CNX §3.5 | Núcleo | O0 | Adoptado | Throttling de red muestra 3 skeletons |
| RF-UXD-101 | Fecha única `dd-mm-yyyy` desde helper central `formatDate` (y `dd-mm-yyyy HH:mm` para fecha-hora), en zona del tenant | CNX §3.5; guía §5 | Núcleo | O0 | Adoptado | Lint prohíbe `toLocaleDateString` fuera del helper |
| RF-UXD-102 | Errores **inline** en el formulario, nunca `alert()` del navegador; resumen de errores arriba del formulario con enlaces a cada campo; el formulario conserva lo cargado | CNX §3.5; AGR-032 | Núcleo | O0 | Adoptado | Enviar un formulario con 2 errores enfoca el resumen y conserva los valores |
| RF-UXD-103 | Mapa central `notifKinds` `tipo → {ícono, color, etiqueta dict}` con fallback por prefijo (`fac.*`, `cob.*`, `mor.*`, `crm.*`, `tec.*`, `com.*`) | CNX §3.5 | Núcleo | O0 | Adoptado | Un tipo nuevo `fac.invoice.reissued` sin entrada usa el ícono de `fac.*` |
| RF-UXD-104 | Cada mejora riesgosa de UI con **flag de apagado sin deploy** (`uiFeatureFlags`) y bitácora de reversión | CNX §3.5 | Núcleo | O0 | Adoptado | Apagar `pwa.offlineQueueV2` vuelve al comportamiento anterior sin publicar versión |
| RF-UXD-105 | Pestañas de texto con línea inferior (nunca chips) para alternar vistas; filtros como chips solo en barras de filtro | CNX §3.4 | Estándar | O0 | Adoptado | Revisión visual |
| RF-UXD-106 | Estados vacíos con ilustración SVG propia, título "comercial" y acción primaria (ej. `dict:por.misGestiones.vacio.titulo` "Todavía no iniciaste gestiones") | CNX §3.4 | Estándar | O0 | Adoptado | Ninguna lista vacía muestra solo "Sin datos" |
| RF-UXD-107 | **Guardar borradores** y recuperar carga interrumpida en formularios de más de 5 campos y en trámites del socio | AGR-032 | Núcleo | O1 | Adoptado | Cerrar la pestaña y volver ofrece `dict:ui.borrador.recuperar` |
| RF-UXD-108 | Acciones masivas con resumen previo (cuántos, qué efecto) y resultado por ítem | Nuevo (ERP); CNX §3.7 (resultado por ítem) | Núcleo | O0 | Adoptado | Aprobar 50 OT muestra "48 aprobadas, 2 con error" con detalle |
| RF-UXD-109 | Procesos largos (lotes, importaciones, cierres) muestran barra de progreso del job, son abandonables (siguen en segundo plano) y notifican al terminar | Guía §5 (jobs); DEC-003 | Núcleo | O0 | Adoptado | Cerrar la pantalla de un lote en curso no lo cancela; llega aviso al finalizar |
| RF-UXD-110 | Estados de integración visibles: `Pendiente`, `Confirmado`, `Fallido`, `Resultado incierto` con explicación comprensible | BASE §102.5.5 | Núcleo | O0 | Adoptado | Un pago en proceso no se ve como confirmado |
| RF-UXD-111 | Importes con explicación comprensible ("¿Por qué pago esto?") en la PWA socio | BASE §25 | Estándar | O4 | Adoptado | La factura en la app tiene desglose por concepto con lenguaje del diccionario |

### 5.9 Login UX

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-112 | Resolución del tenant por **subdominio** (`{slug}.{dominio}`); si se accede por dominio genérico, campo **código de cooperativa** que al salir del campo carga logo, colores, fondo y botones SSO | CNX §3.6 punto 1 y nota final | Núcleo | O0 | Adoptado (A validar PA-UXD-02 dominio propio) | En subdominio no se pide código |
| RF-UXD-113 | Pasos: usuario (email, DNI/CUIT para socios, legajo/usuario para empleados) → contraseña → 2FA si corresponde (reenvío con cuenta regresiva y "no volver a pedir en este dispositivo 30 días") | CNX §3.6 punto 2; CNX §2.5 | Núcleo | O0 | Adoptado | 2FA muestra reenvío habilitado a los 60 s |
| RF-UXD-114 | "Recordarme" decide `localStorage` vs `sessionStorage` | CNX §3.6 punto 3 | Núcleo | O0 | Adoptado | Sin "Recordarme", cerrar el navegador cierra la sesión |
| RF-UXD-115 | Selector de tenant si el usuario pertenece a varios, y de **espacio** (socio / empleado) si tiene ambas relaciones en el mismo tenant | CNX §3.6 punto 4; BASE §102.5.2 | Núcleo | O0 | Adoptado | Persona empleada de TEN-001 y socia de TEN-002 elige; nunca ve datos cruzados |
| RF-UXD-116 | Splash post-login, oferta de instalar la app y landing según rol | CNX §3.6 punto 5 | Núcleo | O0 | Adoptado | Técnico aterriza en `/campo/mi-dia`; socio en `/inicio` |
| RF-UXD-117 | Ayuda de formato bajo cada campo ("DNI sin puntos") y errores específicos para el usuario **sin** habilitar enumeración en backend: los mensajes del recupero son siempre genéricos; en el login se distingue "usuario inexistente" de "contraseña incorrecta" solo si T02 lo habilita por política | CNX §3.6 punto 6, §2.5 (anti-enumeración) | Núcleo | O0 | A validar (PA-UXD-14) | Recupero responde igual para usuario existente o no |
| RF-UXD-118 | Botones SSO (Google y los que configure T02) y **CiDi** (si el tenant lo habilita) con la marca del proveedor y texto `dict:login.sso.con` ("Ingresar con {proveedor}") | CNX §2.5; RN-09 VAR_PMOVIL 40 (CIDI); BASE §60 | Estándar | O1 | Adoptado | Con CiDi deshabilitado el botón no aparece |
| RF-UXD-119 | Enlace configurable bajo el login ("¿Necesitás ayuda?" / enlace de referencia) | RN-09 VAR_PMOVIL 34 | Estándar | O1 | Reemplazado por `dict:login.enlaceAyuda.*` + PRM-UXD-031 | El tenant define texto y URL |
| RF-UXD-120 | Registro sencillo desde el login/landing para cualquier persona (sin exigir datos fiscales), separado del alta como asociado o titular | BASE §25, §67 | Núcleo | O2 | Informado (detalle en M19) | El formulario de registro pide ≤ 5 datos |
| RF-UXD-121 | Bloqueo de sesión por inactividad con aviso previo de 60 s y conservación del trabajo en borrador | RN-09 VAR 2280 | Estándar | O1 | Replicar (parámetro en T02) | Tras el tiempo configurado aparece el diálogo de bloqueo; al reingresar recupera el borrador |
| RF-UXD-122 | Pantallas de términos pendientes y legales (`/terms`, `/legal/:tipo`) con aceptación versionada antes de continuar | CNX §3.3, §3.8 | Núcleo | O1 | Adoptado | Con términos nuevos el guard los exige |

### 5.10 Accesibilidad (AGR-032)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-123 | Objetivo **WCAG 2.2 nivel AA** para admin, PWA (todas las variantes), landing y plataforma; no se declara conformidad sin verificación | AGR-032 | Núcleo | O0 | Adoptado | Informe de verificación por ola (automática + manual) |
| RF-UXD-124 | Operación completa **por teclado**, orden de foco lógico, foco visible (`:focus-visible` con anillo de 2 px y contraste ≥ 3:1), sin trampas de foco salvo modales | AGR-032; WCAG 2.1.1, 2.4.7, 2.4.11 | Núcleo | O0 | Adoptado | Recorridos esenciales (sección 17) pasan sin mouse |
| RF-UXD-125 | Contraste ≥ 4,5:1 texto normal, ≥ 3:1 texto grande y componentes de UI, en ambos temas y con cualquier color de tenant (RF-UXD-032) | AGR-032; WCAG 1.4.3, 1.4.11 | Núcleo | O0 | Adoptado | Test automático con colores demo extremos |
| RF-UXD-126 | Etiquetas programáticas en todos los campos (`label` visible; `aria-describedby` para ayuda y error) | AGR-032; WCAG 1.3.1, 3.3.2 | Núcleo | O0 | Adoptado | axe sin errores "label" |
| RF-UXD-127 | Mensajes de error claros que indican qué falta y cómo corregir; sugerencia de corrección cuando se conoce | AGR-032; WCAG 3.3.1, 3.3.3 | Núcleo | O0 | Adoptado | Error de CUIT indica dígito verificador inválido |
| RF-UXD-128 | **Alternativa al mapa** y a cualquier gesto táctil (arrastrar, pinch, swipe, firma): siempre hay control equivalente con un solo puntero o teclado | AGR-032; WCAG 2.5.1, 2.5.7 | Núcleo | O0 | Adoptado | Reordenar fijados funciona con botones subir/bajar |
| RF-UXD-129 | Tamaño de objetivo mínimo 24×24 CSS px (44×44 recomendado en PWA) | WCAG 2.5.8 | Núcleo | O0 | Adoptado | Auditoría de objetivos en PWA |
| RF-UXD-130 | Sin autenticación basada en prueba cognitiva (no exigir transcribir códigos sin permitir pegar; permitir gestores de contraseñas) | WCAG 3.3.8 | Núcleo | O0 | Adoptado | Campo OTP acepta pegado y autocompletado `one-time-code` |
| RF-UXD-131 | Ayuda consistente: el acceso a ayuda (`?`/`ScreenHelp`, contacto) está en la misma ubicación en todas las pantallas | WCAG 3.2.6 | Núcleo | O0 | Adoptado | Revisión |
| RF-UXD-132 | No pedir dos veces la misma información en un mismo proceso (entrada redundante) | WCAG 3.3.7 | Núcleo | O0 | Adoptado | El domicilio del titular se ofrece como opción en el domicilio de servicio |
| RF-UXD-133 | Foco no oculto por la cabecera sticky ni la tabbar (`scroll-padding`) | WCAG 2.4.11 | Núcleo | O0 | Adoptado | El campo enfocado nunca queda bajo la cabecera |
| RF-UXD-134 | Regiones `aria-live` para toasts, progreso de jobs, resultados de búsqueda y estado offline | WCAG 4.1.3 | Núcleo | O0 | Adoptado | Lector de pantalla anuncia "Guardado" |
| RF-UXD-135 | Reflow a 320 px sin scroll horizontal (salvo tablas de datos, que tienen scroll controlado y vista de cards alternativa en móvil) | WCAG 1.4.10 | Núcleo | O0 | Adoptado | Prueba a 320 px |
| RF-UXD-136 | Textos largos del diccionario no rompen layout: límites de longitud por clave y previsualización con detección de desborde | AGR-032; BASE §65.4 | Núcleo | O1 | Adoptado | Un label de 60 caracteres en un botón con límite 24 es rechazado con aviso |
| RF-UXD-137 | Idioma de la página declarado (`lang="es-AR"`) y tiempos ajustables (avisos de sesión con extensión) | WCAG 3.1.1, 2.2.1 | Núcleo | O0 | Adoptado | Validación HTML |
| RF-UXD-138 | Alternativas textuales para imágenes de marca (`alt` desde diccionario: `dict:uxd.logo.alt` "Logo de {nombreMarca}") y para ilustraciones decorativas `alt=""` | WCAG 1.1.1 | Núcleo | O0 | Adoptado | axe sin errores "image-alt" |
| RF-UXD-139 | Recorridos esenciales probados con teclado y lector de pantalla (NVDA + Chrome en Windows, TalkBack en Android, VoiceOver en iOS) antes de cerrar cada ola que los incluya | AGR-032 | Núcleo | O0 en adelante | Adoptado | Acta de prueba por ola (sección 17) |

### 5.11 Diccionario de términos y etiquetas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-140 | Diccionario de términos por cooperativa | BASE §65 DIC-001 | Núcleo | O0 | Informado | TEN-001 y TEN-002 muestran "Socios" y "Asociados" respectivamente en el mismo menú |
| RF-UXD-141 | Etiquetas de UI configurables por tenant (títulos, menús, campos, botones, mensajes, estados vacíos, ayudas) dentro del catálogo habilitado | BASE DIC-002, §65.4 | Núcleo | O0 (mecanismo) / O1 (editor) | Informado | Ninguna pantalla muestra texto fijo: lint rechaza literales en componentes React fuera de `dict()` |
| RF-UXD-142 | Mecanismo disponible **desde la primera versión**: toda pantalla nueva usa claves desde su creación | BASE DIC-003, líneas 13 y 3550 | Núcleo | O0 | Informado | El pipeline de CI falla si una pantalla introduce un literal visible |
| RF-UXD-143 | Identidad = visual + lenguaje: el diccionario se administra junto a la marca (misma sección de configuración "Identidad") | BASE DIC-004, §43.4 | Núcleo | O1 | Informado | Cluster Configuración → grupo Experiencia muestra Marca y Diccionario juntos |
| RF-UXD-144 | Catálogo base de conceptos y textos con **clave estable**, tipo (`term`/`label`/`message`/`help`/`legal`), descripción funcional y contexto | BASE §65.4 | Núcleo | O0 | Informado | Cada clave del catálogo tiene descripción no vacía |
| RF-UXD-145 | Variantes por término: **singular, plural, título** (Title case opcional), **corta** (≤ 12 caracteres para tabbar) y **género gramatical** (m/f) para concordancia ("Nuevo socio" / "Nueva gestión") | BASE §65.4; CTR-UXD-08 | Núcleo | O0 | Adoptado | Cambiar "Gestión" (f) por "Ticket" (m) hace que `dict:crm.caso.crear` muestre "Nuevo ticket" |
| RF-UXD-146 | **Variables** con nombre `{nombre}` y **referencias a términos** `{t:per.asociado.one}` dentro de frases, en lugar de concatenar; formato ICU MessageFormat subset (plural `one/other`, select por género) | BASE §65.6 (textos con variables) | Núcleo | O0 | Adoptado | "Tenés {count, plural, one {# factura vencida} other {# facturas vencidas}}" resuelve correctamente |
| RF-UXD-147 | Resolución con **fallback**: tenant+canal → tenant genérico → base del producto; nunca se muestra la clave cruda en producción (en desarrollo se muestra `⟦clave⟧` resaltado) | BASE §65.4, §65.8 | Núcleo | O0 | Informado | Borrar una personalización vuelve al texto base |
| RF-UXD-148 | Variantes **por canal** opcionales: `admin`, `pwa-socio`, `pwa-empleado`, `pwa-campo`, `landing`, `documentos`, `email`, `sms`, `whatsapp`, `push` | BASE §65.4 (aplicar por canal), §65.9 (alcance por canal pendiente) | Estándar | O1 | A validar (PA-UXD-05) | `dict:por.cuenta.resumen` puede valer "Mi resumen" en PWA y "Resumen de cuenta" en documentos |
| RF-UXD-149 | Aplicar el vocabulario a landing, admin, desktop, app de socios y app de empleados (y campo, plataforma no) según canales habilitados | BASE §65.4 | Núcleo | O0 | Informado | El mismo cambio se ve en los tres canales tras publicar |
| RF-UXD-150 | Distinguir término de negocio reutilizado de texto específico de pantalla (las etiquetas referencian términos) | BASE §65.4 | Núcleo | O0 | Informado | Cambiar el término "Socio" actualiza las 40+ etiquetas que lo referencian sin editarlas una a una |
| RF-UXD-151 | Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias | BASE §65.4 | Núcleo | O0 | Informado | Un tenant nuevo no tiene entradas en `tenantDictionaryEntries` y la UI está completa |
| RF-UXD-152 | Previsualizar en contexto (menú, formulario de alta, canal del socio) y detectar textos demasiado largos o ambiguos antes de aplicar | BASE §65.4, CU-DIC-01 paso 3 | Estándar | O1 | Informado | El editor muestra dónde se usa cada clave y la previsualización con el borrador |
| RF-UXD-153 | Administración del diccionario solo con rol funcional (`uxd.diccionario.*`) y perfil de pantalla | BASE §65.4 | Núcleo | O1 | Informado | Usuario sin capability recibe 403 en API y no ve el ítem |
| RF-UXD-154 | **Versiones y auditoría** de cada cambio (autor, fecha, versión, valor anterior y posterior) y **publicación y reversión** | BASE §65.4, CU-DIC-01 paso 4 | Núcleo | O1 | Informado | Revertir a la versión 3 desde la 5 crea la versión 6 igual a la 3 |
| RF-UXD-155 | Mantener el mismo significado en UI, ayuda, atención y datos aunque cambie la denominación | BASE §65.4 | Núcleo | O0 | Informado | La ayuda contextual usa las mismas claves que la pantalla |
| RF-UXD-156 | **Textos protegidos** (leyendas fiscales, normativas, legales, denominaciones ARCA de comprobantes, textos de consentimiento) no editables por el tenant | BASE §65.3 | Núcleo | O0 | Informado | El editor muestra candado y la API rechaza con 422 |
| RF-UXD-157 | Claves de API, códigos de permisos, identificadores y estados internos no cambian al editar un label; los nombres visibles viajan como metadatos separados en exportaciones y BI | BASE §65.3, §65.8, CU-DIC-01 paso 6 | Núcleo | O0 | Informado | Exportación XLSX tiene encabezados con label del tenant y hoja "metadatos" con claves |
| RF-UXD-158 | Detección de **claves faltantes** en nuevas funciones: en CI (clave usada sin entrada en catálogo) y en runtime (registro en `dictionaryMissingKeys`) | BASE §65.8 | Núcleo | O0 | Informado | Usar `dict('x.y.z')` inexistente rompe el build |
| RF-UXD-159 | Actualizar o agregar pantallas **no borra** personalizaciones; claves deprecadas conservan su valor histórico y se informa al tenant de claves nuevas | BASE §65.8 | Núcleo | O0 | Informado | Migración de catálogo con renombre de clave mueve la personalización a la clave nueva (`renamedTo`) |
| RF-UXD-160 | **Sin reemplazos globales** sobre contenido libre: el diccionario nunca reescribe noticias, mensajes, documentos ni textos históricos | BASE §65.8 | Núcleo | O0 | Informado | Cambiar "Socio" no altera el cuerpo de publicaciones existentes |
| RF-UXD-161 | Documentos, reportes, exportaciones y plantillas de comunicación usan el diccionario del canal correspondiente y **congelan la versión** usada al generarse | BASE §65.8, §65.9 | Núcleo | O4 | A validar (PA-UXD-07) | Una factura reimpresa conserva el término vigente al emitirla |
| RF-UXD-162 | Soporte y auditoría ven la clave estable junto a la etiqueta (modo `dict:mostrarClaves` para usuarios con `uxd.diccionario.ver`) | BASE §65.8 | Estándar | O1 | Informado | Activar el modo muestra `[per.asociado.plural] Socios` |
| RF-UXD-163 | Bot/IA usan el diccionario conservando la relación con conceptos canónicos; la terminología no se interpreta como instrucción que altere permisos o reglas (los textos son contenido, no código) | BASE §65.6, §65.8 | Núcleo | O6 (DEC-056; antes O9+ cuando haya bot) | Informado | Un label con "ignora las reglas" no altera el comportamiento del bot (prueba) |
| RF-UXD-164 | Guardas semánticas: el editor advierte si se intenta dar a dos conceptos distintos el mismo texto en el mismo contexto (ej. `estado.servicio.baja` y `estado.servicio.suspendido` = "Baja"), y lo bloquea para pares declarados como **no equivalentes** | BASE §65.3, CU-DIC-01 excepción | Núcleo | O1 | Informado | Intentar "Baja" para suspensión se rechaza con explicación |
| RF-UXD-165 | **Importar/exportar** diccionario (XLSX con `ExcelImportWizard`, JSON) y **copiar desde plantilla** (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") | BASE §65.4, §65.9 (opciones pendientes) | Estándar | O1 | A validar (PA-UXD-04) | Importar un XLSX de 50 filas con 2 claves inexistentes las marca como error |
| RF-UXD-166 | Nombres de servicios, planes, productos, conceptos y categorías **no** son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") | BASE §65.9 (tratamiento de nombres de servicios) | Núcleo | O0 | Adoptado | Renombrar el plan "Fibra 300" se hace en M02, no en el diccionario |
| RF-UXD-167 | Los textos personalizables de CoopOnline/ProCoop (VAR_PMOVIL 5, 6, 7, 8, 9, 35, 65; VAR 3157) se reemplazan por claves de diccionario (sección 19) | RN-09 | Estándar | O2 | Reemplazado por claves `por.*` y `crm.*` | Ningún parámetro de texto de UI en el catálogo de parámetros de T04 |
| RF-UXD-168 | Un único idioma `es-AR` en esta versión; el modelo guarda `locale` para no impedir traducción futura | BASE §65.3 (traducción no solicitada) | Estándar | O0 | Adoptado (PA-UXD-06) | Todas las entradas tienen `locale: 'es-AR'` |
| RF-UXD-169 | Distribución eficiente: paquete compilado por tenant + canal + versión, servido con caché HTTP inmutable y versión en el nombre; el cliente lo carga antes del primer render (pre-login incluye solo el subconjunto `login.*`, `lnd.*`, `ui.*`) | BASE §65.8 | Núcleo | O0 | Adoptado | Cambio de versión invalida la caché; tamaño del paquete PWA socio ≤ 60 KB gzip |
| RF-UXD-170 | Textos de emails, SMS, WhatsApp y push renderizados en backend con el diccionario del tenant del destinatario (nunca del usuario que dispara el job) | BASE §65.8 (contexto de tenant en tareas y comunicaciones) | Núcleo | O2 | Informado | Job de avisos multi-tenant usa el diccionario correcto por destinatario |
| RF-UXD-179 | Catálogo base de claves transversales de servicio (10.9.12): estados canónicos del contrato de M02, etiquetas de dominio de servicio, motivos de baja comunes y por servicio, y tipos de reclamo por servicio (`crm.claimType`); los módulos referencian estas claves y no crean equivalentes | HUE-SRV-09, HUE-CLO-03, HUE-ALU-03 | Núcleo | O2 | Adoptado | Cada estado canónico de M02 §8 tiene una clave `estado.servicio.*`; un reclamo de luminaria apagada muestra `dict:crm.claimType.alu.luminariaApagada` |

### 5.12 Mapa del sitio y preferencias

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-UXD-171 | Mapa del sitio completo por app (admin, PWA socio, PWA empleado, PWA campo, landing, plataforma) según 10.8, con ID estable `SM-*`, ruta, capability y módulo | Instrucción de este anexo; REL §1; DFA §1 | Núcleo | O0 (estructura) / cada ola sus ítems | Adoptado | Cada PAN-* de cada anexo referencia un `SM-*` |
| RF-UXD-172 | Cada función del menú de ProCoop (9 pestañas) tiene un ítem equivalente o un estado `Absorbida` / `Reemplazada` / `Descartada` con motivo (sección 22) | Guía §1 (regla de oro); DEC-007 | Núcleo | O0 | Adoptado | Trazabilidad 22.1 sin filas vacías |
| RF-UXD-173 | Ítems sin licencia/activación o sin capability **no se muestran**; el administrador del tenant puede ver en el mapa del sitio, con marca `dict:ui.mapaSitio.noContratado` (No contratado), los módulos no licenciados | CNX §2.4; T01 | Estándar | O1 | A validar (PA-UXD-12) | Un cajero no ve Contabilidad; el admin ve Sueldos "No contratado" |
| RF-UXD-174 | Editor de roles/perfiles de pantalla (T02) presenta el mismo árbol del mapa con checkbox por ítem y por acción | CNX §4.2; BASE §45 | Núcleo | O1 | Adoptado | El árbol del editor de roles y el del menú son idénticos |
| RF-UXD-175 | Etiquetas de clusters, grupos e ítems resueltas por diccionario (`nav.*`) | BASE §65.4 (menús) | Núcleo | O0 | Informado | Renombrar `nav.item.per.titulares` cambia menú, mapa y editor de roles |
| RF-UXD-176 | Preferencias del usuario: tema (si política lo permite), densidad, tamaño de texto, reducción de movimiento, accesos fijados, recientes (últimos 10), vistas guardadas, modo de feed (carrusel/lista) | CNX §3.1, §4.2, §5.1 | Estándar | O0 | Adoptado | Preferencias sincronizadas entre dispositivos |
| RF-UXD-177 | Configuración por tenant de la navegación de la PWA por rol: 2 enlaces de tabbar, accesos rápidos de Inicio, orden del menú hamburguesa, ítems ocultos (sin otorgar permisos) | CNX §4.4 ("Menú de la app", "Accesos rápidos") | Estándar | O1 | Adoptado | Ocultar un ítem no revoca la capability |
| RF-UXD-178 | Exportación por defecto en XLSX con opción CSV y PDF (reemplaza "Tipo de exportación de Excel") | RN-09 VAR 2294 | Estándar | O0 | Reemplazado por `DataTable` | El menú exportar ofrece los 3 formatos |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop / Connectia (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-UXD-001 | **Ningún texto visible fijo**: todo texto de UI se obtiene con `dict(clave, variables)`; las únicas excepciones son datos del negocio (nombres de personas, servicios, conceptos) y contenido libre editorial | ProCoop: textos fijos en formularios WinForms, solo algunos personalizables por `VAR_PMOVIL` (RN-09) | Reemplazar (BASE §65) | — | — |
| RN-UXD-002 | **Resolución de texto**: `valor = entradaTenant[clave][canal] ?? entradaTenant[clave]['*'] ?? base[clave][canal] ?? base[clave]['*']`; si todo falla, en producción se muestra el texto base de la clave padre o `dict:ui.textoNoDisponible` y se registra en `dictionaryMissingKeys`; nunca la clave cruda | — | Nuevo (BASE §65.4, §65.8) | PRM-UXD-020 | — |
| RN-UXD-003 | **Referencias a términos**: una etiqueta puede incluir `{t:<termKey>.<forma>}` (forma `one`, `other`, `title`, `short`) y `{g:<termKey>\|<masculino>\|<femenino>}` para concordancia; se resuelven en tiempo de compilación del paquete por tenant | — | Nuevo (BASE §65.6) | — | — |
| RN-UXD-004 | **Pluralización** con categorías CLDR de `es` (`one`, `other`; `many` para números ≥ 1.000.000 se mapea a `other`); el 0 usa `other` salvo que la clave defina `=0` | — | Nuevo | — | — |
| RN-UXD-005 | **Variables permitidas** por clave declaradas en el catálogo (`variables[]`); al editar, la UI rechaza variables no declaradas y exige las obligatorias | — | Nuevo (BASE §65.6) | — | — |
| RN-UXD-006 | **Longitud máxima** por clave (`maxLength`); valores más largos se rechazan; para `short` el límite es 12 caracteres (tabbar) y 24 para botones | — | Nuevo (BASE §65.4, AGR-032) | — | — |
| RN-UXD-007 | **Textos protegidos** (`protected: true`) no aceptan entrada de tenant; incluyen todo `fis.*.leyenda`, `legal.*`, `cons.*` (consentimientos), denominaciones de comprobantes ARCA y textos regulatorios | — | Nuevo (BASE §65.3) | — | — |
| RN-UXD-008 | **Pares no equivalentes** declarados en el catálogo (`notEquivalentTo[]`): baja definitiva ≠ suspensión temporal; cuenta ≠ contrato ≠ suministro; asociado ≠ titular ≠ usuario registrado; factura ≠ resumen de cuenta; solicitud ≠ servicio activo; reclamo ≠ solicitud comercial. No pueden tener el mismo valor visible en el mismo canal | — | Nuevo (BASE §65.3, §65.5, §43.3) | — | — |
| RN-UXD-009 | Los **contenidos del diccionario son texto plano**: se escapan al renderizar; no admiten HTML, scripts ni Markdown salvo claves tipo `help` (Markdown restringido sin HTML ni enlaces externos no permitidos) | — | Nuevo (BASE §65.6 "no código ejecutable") | — | — |
| RN-UXD-010 | **Publicación del diccionario**: los cambios se guardan en borrador; al publicar se crea `dictionaryReleases.version = n+1` inmutable con el snapshot completo de entradas del tenant; los clientes reciben la nueva versión; la reversión crea una nueva versión copiando la elegida | — | Nuevo (BASE §65.4) | PRM-UXD-021 | — |
| RN-UXD-011 | **Auditoría del diccionario**: cada cambio registra autor, fecha, clave, canal, valor anterior y posterior, versión de borrador; cada publicación registra autor, versión, cantidad de claves cambiadas y nota | — | Nuevo (BASE §65.4, CU-DIC-01) | — | — |
| RN-UXD-012 | **Evolución del catálogo**: una clave nueva del producto aparece con su base; una clave renombrada (`renamedTo`) migra la personalización; una clave deprecada (`deprecatedAt`) deja de mostrarse en el editor pero conserva su historia; nunca se borran entradas de tenant automáticamente | — | Nuevo (BASE §65.8) | — | — |
| RN-UXD-013 | **Congelamiento en documentos**: todo documento generado (PDF de factura, recibo, constancia, email enviado) guarda `dictReleaseVersion`; reimprimir usa esa versión. Con el motor de PDF de DEC-080 (Chromium sin interfaz, PDF/A) la versión de marca y de diccionario se fija al renderizar el HTML | — | Nuevo (BASE §65.8, §65.9) | — | A validar PA-UXD-07 |
| RN-UXD-014 | **Contexto de tenant en caché**: las claves de caché de diccionario y marca incluyen `tenantId` + canal + versión; un job o un render de email resuelve el tenant del destinatario | — | Nuevo (BASE §65.8) | — | — |
| RN-UXD-015 | **Marca publicada por defecto**: todo tenant tiene siempre una `tenantBranding` publicada (versión 1 creada en el alta con defaults) | CNX §4.3 alta de suscriptor | Adoptar | — | — |
| RN-UXD-016 | **Herencia de recursos de marca** por canal: `pwa-socio` → `pwa` → `app` → producto; `pwa-empleado` → `pwa` → `app` → producto; `pwa-campo` → `pwa-empleado` → … ; `desktop` → `admin` → producto; `documentos` → `admin` → producto; sucursal → tenant (si PA-UXD-10 = sí) | CNX §3.2 logos jerárquicos; BASE §43.4 (misma imagen en varios canales) | Adoptar | — | — |
| RN-UXD-017 | **Colores derivados**: a partir de `brand` y `brandAccent` se calculan `-rgb`, `-hover` (±8 % luminancia), `-soft` (12 % alfa), `brandContrast` (texto sobre marca: `#ffffff` o `#111019`, el que dé mayor contraste); el tenant no edita derivados | CNX §3.2 ("pisa 2–3 variables; el resto hereda") | Adoptar | — | — |
| RN-UXD-018 | **Contraste mínimo** para usos de texto: si `brand` sobre `--canvas`/`--pwa-bg` < 4,5:1, el texto de marca (enlaces, tabs activas) usa `brandAccessible` (ajuste de luminancia hasta cumplir); el color original solo se usa en superficies y decoración | AGR-032 | Nuevo | PRM-UXD-010 | — |
| RN-UXD-019 | **Estados semánticos no personalizables**: `ok`/`warn`/`bad`/`info` no los cambia el tenant, para preservar significado y accesibilidad | CNX §4.1 | Adoptar | — | — |
| RN-UXD-020 | **Tipografías no personalizables** por tenant en esta versión | CNX §3.1, §4.1 | Adoptar | — | A validar PA-UXD-08 |
| RN-UXD-021 | **Tema**: `themePolicy` del tenant (`dark` default, `light`, `user`); si `user`, el usuario elige `dark`/`light`/`system`; login y splash siempre oscuros; `.pwa-mod` siempre oscura | CNX §3.1 | Adoptar | PRM-UXD-001, PRM-UXD-002 | A validar PA-UXD-01 |
| RN-UXD-022 | **Visibilidad de ítem de menú** = `licenciado(tenant, modulo) ∧ activado(tenant, modulo) ∧ tieneCapability(usuario, item.capability) ∧ enPerfilPantallas(usuario, item.id) ∧ ¬ocultoPorTenant(item.id, rol) ∧ flagsOK(item.flags)` | CNX §2.4; BASE §45 ACC-003/004; ProCoop `PERFILES`/`MENUSYS`/`MENUVAL` (permisos por opción de menú, DFA M1) | Mejorar | — | — |
| RN-UXD-023 | **Ocultar un ítem no quita permisos** y **mostrar un ítem no otorga acciones**: la API siempre verifica capability, tenant y alcance | BASE ACC-004, CU-ACC-01 excepción | Adoptar | — | — |
| RN-UXD-024 | **Enlace directo** a una ruta no permitida: la UI muestra `dict:ui.sinPermiso.titulo` (No tenés acceso a esta pantalla) con opción de volver; no revela si el recurso existe | BASE CU-ACC-01 excepción | Adoptar | — | — |
| RN-UXD-025 | **Un único `siteMapGroups`**: cada ítem tiene `id` estable (`SM-*`), `route`, `capability`, `module`, `labelKey`, `iconName`, `keywords[]`, `procoopEquivalents[]`, `flags[]`, `badgeSource?`; agregar una pantalla exige agregar su ítem | CNX §4.2, §4.6 | Mejorar | — | — |
| RN-UXD-026 | **Ruteo por rol y estado en la PWA**: socio `pendiente de validación` → `/inicio` con banner de completar requisitos; `activo` → `/inicio`; `con deuda vencida` → `/inicio` con banner de deuda y acceso a pagar; `suspendido` → `/inicio` con banner de suspensión, pagar y reactivar; `baja` → `/inicio` restringido (consultas, constancias, documentos históricos); empleado → `/trabajo`; técnico/lecturista/cobrador → `/campo/mi-dia` | CNX §3.8 (pendiente/suspendido/aprobado; socio moroso/suspendido/activo) | Adaptar | — | — |
| RN-UXD-027 | **Bloqueo de escritorio**: el tenant puede impedir que roles de campo usen la PWA en pantallas anchas (fuerza móvil) | CNX §3.3 (bloqueo de escritorio por empresa) | Adoptar | PRM-UXD-005 | A validar PA-UXD-15 |
| RN-UXD-028 | **Alta en modal**: en la PWA toda alta se abre en `PwaModal` desde el FAB; en admin las altas simples en modal `md`, compuestas en `lg`/`xl`, y entidades con ficha extensa con modal de datos mínimos + ficha | CNX §3.5, §4.2 | Adaptar | — | — |
| RN-UXD-029 | **Fecha visible** `dd-mm-yyyy`; hora `HH:mm` 24 h; zona del tenant; períodos `mm-yyyy`; nunca formato ISO visible | CNX §3.5; guía §5. ProCoop usa `dd/mm/yyyy` (REL) | Reemplazar | — | — |
| RN-UXD-030 | **Números**: separador de miles `.`, decimal `,`; importes con 2 decimales salvo precisión del concepto; cantidades de consumo con la unidad (`kWh`, `m³`); porcentajes con `%` sin espacio | Guía §5 | Adoptar | — | — |
| RN-UXD-031 | **Errores**: los 4xx se muestran inline (validación) o como toast de error con texto del diccionario `err.<codigo>`; los 5xx muestran `dict:err.generico` + `requestId` copiable; nunca detalle técnico | CNX §2.6 | Adoptar | — | — |
| RN-UXD-032 | **Notificaciones**: cada `kind` se mapea en `notifKinds`; sin entrada, fallback por prefijo de módulo; sin prefijo, ícono y color `info` | CNX §3.5 | Adoptar | — | — |
| RN-UXD-033 | **Flags de UI**: evaluación `plataforma > tenant > rol`; un flag apagado por plataforma no puede encenderse en el tenant; cada cambio registra motivo y autor | CNX §3.5 | Adoptar | — | — |
| RN-UXD-034 | **Leyendas fiscales y normativas** en documentos y pantallas fiscales son textos protegidos versionados por plataforma (no por tenant) | BASE §65.3 | Adoptar | — | — |
| RN-UXD-035 | **Recursos de marca públicos vs privados**: logos, íconos, splash, fondo de login, imagen de landing son públicos (sirven antes del login); logo para documentos y cabecera de email también públicos (se embeben); cualquier otro archivo es privado con URL firmada | CNX §10 V-01 | Mejorar | — | — |
| RN-UXD-036 | **SVG saneado**: los SVG subidos se sanean (sin scripts, `foreignObject`, eventos ni referencias externas) y se rasterizan para íconos | CNX §10 (seguridad) | Nuevo | — | — |
| RN-UXD-037 | **Manifest dinámico**: `name` = `brandName` (máx. 45), `short_name` = `shortName` (máx. 12), `start_url` según app (`/inicio`, `/trabajo`, `/campo/mi-dia`), `scope` `/`, `display: standalone`, `theme_color` = `--pwa-bg` o `brand` según política, `background_color` `#000000`, íconos 192/512/maskable, `id` = `{tenantSlug}-{app}` para que cada cooperativa sea una app distinta | CNX §3.2 | Adoptar | — | — |
| RN-UXD-038 | **Tres apps instalables por tenant** desde la misma PWA: "{shortName}" (socio), "{shortName} Equipo" (empleado), "{shortName} Campo" (campo); el texto del sufijo es clave de diccionario | BASE §43.5 (logos de empleados y socios); guía §8 (una sola PWA) | Adoptar | — | A validar PA-UXD-03 |
| RN-UXD-039 | **Una tarea principal por pantalla** en la PWA socio: una sola acción primaria visible; acciones secundarias en menú contextual | BASE §102.5.6 | Adoptar | — | — |
| RN-UXD-040 | **Separar estado del trámite y del servicio**: toda pantalla que muestre un servicio con trámite en curso presenta dos badges diferentes | BASE §102.5.6, §43.3 | Adoptar | — | — |
| RN-UXD-041 | **No representar solicitud como ejecución**: los textos de confirmación de una solicitud usan siempre `dict:estado.solicitud.*` | BASE §43.3 | Adoptar | — | — |
| RN-UXD-042 | **La landing pública no expone datos privados**: ningún componente de la landing accede a endpoints autenticados; consultas públicas solo devuelven datos no personales o enmascarados | BASE §43.6 excepciones, §46 | Adoptar | — | — |
| RN-UXD-043 | **Contenido interno nunca en landing**: el selector de canales de una noticia impide marcar `landing` si la audiencia es de empleados | BASE §46 | Adoptar (dominio T09) | — | — |
| RN-UXD-044 | **Exportaciones**: nombre `{shortName}-{pantallaSlug}-{dd-mm-yyyy-HHmm}.{ext}`; encabezados con labels del tenant; hoja/archivo de metadatos con claves estables, filtros aplicados, usuario, fecha y versión del diccionario | BASE §65.8; RN-09 VAR 2294, 2264 | Mejorar | — | — |
| RN-UXD-045 | **Exportar e imprimir** disponibles en todo listado según capability `<mod>.<recurso>.exportar`; impresión vía PDF generado (no impresión del navegador del DOM). El PDF lo genera el motor único de T11: HTML + CSS renderizado con Chromium sin interfaz en workers dedicados y validación PDF/A posterior (DEC-080); T03 aporta marca, tipografías y textos del diccionario a la plantilla | DFA M28 [P] | Replicar + Mejorar | — | — |
| RN-UXD-046 | **Skeletons y refresco**: primera carga 3 skeletons; refresco con opacidad 0,6 y lista conservada; error de carga con estado de error y "Reintentar" | CNX §3.5 | Adoptar | — | — |
| RN-UXD-047 | **Confirmación de acciones destructivas** con `ConfirmDialog`; acciones económicas irreversibles (anular lote, cerrar ejercicio, emitir lote) piden escribir el identificador | CNX §3.4 | Mejorar | — | — |
| RN-UXD-048 | **Deshacer** en descartes no económicos (descartar aviso, quitar fijado, archivar borrador): 6 s | CNX §6.3 | Adoptar | — | — |
| RN-UXD-049 | **IA solo propone**: todo resultado de IA se muestra como borrador con badge `dict:ui.ia.propuesta` y requiere acción humana para persistir o publicar | CNX §4.2 | Adoptar | — | — |
| RN-UXD-050 | **Offline**: solo se encolan operaciones de campo y respuestas de encuestas definidas como encolables; nunca login, admin ni operaciones con riesgo de duplicado económico; cada ítem con `clientMutationId` y resultado por ítem | CNX §3.7 | Adoptar + Mejorar (cola única IndexedDB) | — | — |
| RN-UXD-051 | **Banners**: máximo 2 visibles; prioridad fija (RF-UXD-065); un banner descartable vuelve a mostrarse solo si cambia su condición | CNX §3.3 | Adoptar | — | — |
| RN-UXD-052 | **Instalación de la app**: se ofrece tras el primer login exitoso y en Perfil; si se descarta, no se repite por 30 días; en iOS muestra pasos de "Agregar a inicio" | CNX §3.4 `usePwaInstall`, §3.6 | Adoptar | PRM-UXD-006 | — |
| RN-UXD-053 | **Accesos fijados**: máx. 12; un fijado cuyo ítem deja de estar permitido se oculta (no se borra) y reaparece si vuelve el permiso | CNX §4.2 | Adoptar | — | — |
| RN-UXD-054 | **Vistas guardadas**: privadas por defecto; compartidas por tenant con `uxd.vistas.compartir`; una vista compartida nunca amplía el alcance del que la usa | Nuevo | Nuevo | — | — |
| RN-UXD-055 | **Ayuda contextual**: base del producto por `screenId`; el tenant puede sobrescribir campos (qué/quién/cuándo/dónde/por qué/cómo/caso) sin perder la base; si la base cambia, el editor avisa | CNX §4.2 | Adoptar | — | — |
| RN-UXD-056 | **Mapas**: todo componente de mapa tiene alternativa textual (dirección, lista de puntos, coordenadas) y no es obligatorio para completar un trámite | AGR-032 | Adoptar | — | — |
| RN-UXD-057 | **Proveedor de mapas** configurable por tenant (Google por defecto según BASE §77; OSM/Leaflet como alternativa sin costo); coordenadas iniciales, zoom y tipo de mapa por tenant | RN-09 VAR 2027, 2028, 2029, 2090, 2251; CNX §2.1 Leaflet | Replicar (parámetros) + Mejorar (clave en bóveda) | PRM-UXD-040…043 | A validar PA-UXD-09 |
| RN-UXD-058 | **Sesión por inactividad** con aviso previo y conservación de borradores | RN-09 VAR 2280 | Replicar (en T02) | PRM-IAM (T02) | — |
| RN-UXD-059 | **No iniciar calendario/correo al arrancar** (optimización de escritorio) no aplica | RN-09 VAR 2275 | Descartar (arquitectura web: carga diferida por defecto) | — | — |
| RN-UXD-060 | **Renombrar formularios de transición y ABM de incidentes** se cubre con claves de diccionario `crm.incidente.*` | RN-09 VAR 3157 | Reemplazar por diccionario | — | — |
| RN-UXD-061 | **Copia local de adjuntos** en carpeta del usuario no aplica (descarga normal del navegador) | RN-09 VAR 3093 | Descartar (escritorio) | — | — |
| RN-UXD-062 | **Grilla con imágenes en el turnero** es una opción de presentación del módulo turnero | RN-09 VAR 3029 | Delegar a M09 (PRM del turnero) usando `DataTable`/cards | — | — |
| RN-UXD-063 | **Búsqueda de cuenta por defecto en autogestión** (Asociado / Cuenta / Documento / QR) es parámetro del portal | RN-09 VAR 2790 | Delegar a M19 (PRM-POR) con `EntityPicker` | — | — |
| RN-UXD-064 | **Botón de chat online con soporte** es un flag de UI del tenant que muestra el acceso al canal de soporte/chat (T01 soporte o M09 chat) | RN-09 VAR 2683 | Reemplazar por flag `ui.soporteChat` | PRM-UXD-033 | — |
| RN-UXD-065 | **Cabecera de la página del portal** (texto largo) se reemplaza por bloque editable de la landing/portal (M19) con clave `por.cabecera.texto` como fallback | RN-09 VAR_PMOVIL 65 | Reemplazar | — | — |
| RN-UXD-066 | **Estados visibles del pago web al socio** (`ESTADO_VENTA` 0 generado, 1 pagado, 2 registrado, 3 enviado) se presentan con claves `estado.pagoWeb.*` y solo avanzan | RN-10 §3.2 | Replicar (textos) / dominio en M07/M19 | — | — |
| RN-UXD-067 | **Mensajes de rechazo al socio** (ej. "El pago fue rechazado por la entidad", "Los importes de la cobranza no coinciden", "El número de documento del socio … no coincide con lo registrado en CiDi", "El servicio seleccionado no es un servicio de energía") se convierten en claves `err.*` con variables | RN-10 §3.3–§3.5 | Reemplazar por diccionario | — | — |
| RN-UXD-068 | **Notificaciones al portal** (`NOTI_COOP`: por cuenta, no leída, vigencia 1 mes, asunto, detalle) se presentan en la bandeja de avisos de la PWA con `notifKinds` y textos del diccionario para "singular/plural" del resultado | RN-10 §3.6 | Replicar (presentación); dominio T09 | — | — |

## 7. Design system y modelo de datos de experiencia
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Sección adaptada (anexo transversal): **7.A** es el design system normativo (tokens); **7.B** es el modelo de datos de las colecciones propiedad de UXD.

### 7.A Design system

Los tokens viven en `packages/ui/tokens/` en tres archivos: `tokens.core.css` (escala, radios, movimiento, z-index), `tokens.admin.css` (temas del admin) y `tokens.pwa.css` (temas de la PWA y piel `.pwa-mod`). Los componentes **solo** consumen variables; Tailwind se configura con `theme.extend.colors` apuntando a esas variables (`bg-[var(--panel)]` se expone como `bg-panel`).

#### 7.A.1 Tokens del admin

| Token | Oscuro (default) | Claro | Uso | Origen |
|---|---|---|---|---|
| `--canvas` | `#111019` | `#f6f5fa` | Fondo de página | CNX §4.1 (oscuro); claro derivado |
| `--panel` | `#1e1a2b` | `#ffffff` | Paneles, cards, modales | CNX §4.1 |
| `--panel-2` | `#17141f` | `#f0eef6` | Cabecera de tabla, zonas secundarias, filas alternas | CNX §4.1 |
| `--panel-3` | `#262136` | `#e7e4f0` | Hover de fila, inputs deshabilitados | Derivado |
| `--ink` | `#ece9f4` | `#17141f` | Texto principal | CNX §4.1 |
| `--ink-2` | `rgba(236,233,244,.72)` | `#4a4560` | Texto secundario | Derivado |
| `--ink-3` | `rgba(236,233,244,.52)` | `#6e6985` | Labels, placeholders (siempre ≥ 4,5:1 sobre `--panel` para labels; placeholders no reemplazan labels) | Derivado |
| `--line` | `#2c2739` | `#dcd8e6` | Bordes, divisores | CNX §4.1 |
| `--line-strong` | `#3b3450` | `#c3bdd3` | Bordes de campos (≥ 3:1) | Derivado (WCAG 1.4.11) |
| `--brand` | `#6b5bf0` | `#6b5bf0` | Marca (igual en ambos temas; override del tenant) | CNX §4.1 |
| `--brand-rgb` | `107,91,240` | `107,91,240` | Para alfas | Derivado |
| `--brand-hover` | calculado (+8 % luminancia) | calculado (−8 %) | Hover de botón primario | RN-UXD-017 |
| `--brand-soft` | `rgba(var(--brand-rgb),.14)` | `rgba(var(--brand-rgb),.10)` | Fondo de ítem activo, selección | Derivado |
| `--brand-contrast` | `#ffffff` o `#111019` | ídem | Texto sobre `--brand` | RN-UXD-017 |
| `--brand-accessible` | calculado | calculado | Texto/enlaces de marca sobre canvas/panel | RN-UXD-018 |
| `--ok` | `#5bd39b` | `#1f8f5f` | Estado correcto / confirmado | CNX §4.1 (oscuro); claro ajustado a 4,5:1 |
| `--warn` | `#e2b552` | `#9a6b00` | Advertencia / pendiente | CNX §4.1 |
| `--bad` | `#f0837b` | `#c2352b` | Error / vencido / rechazado | CNX §4.1 |
| `--info` | `#7cb4f5` | `#1d5fb3` | Informativo / en proceso | Nuevo |
| `--neutral` | `#9a95ab` | `#6e6985` | Borrador / inactivo / anulado | Nuevo |
| `--ok-soft`, `--warn-soft`, `--bad-soft`, `--info-soft` | color al 14 % | color al 10 % | Fondos de badges y banners | Derivado |
| `--focus-ring` | `0 0 0 2px var(--canvas), 0 0 0 4px var(--brand-accessible)` | ídem | Foco visible | WCAG 2.4.7 |
| `--r` | `12px` | `12px` | Paneles, modales, cards | CNX §4.1 |
| `--r-s` | `9px` | `9px` | Campos, botones, chips | CNX §4.1 |
| `--r-pill` | `999px` | `999px` | Badges, toggles | CNX §3.1 |
| `--shadow-1` | `0 1px 2px rgba(0,0,0,.4)` | `0 1px 2px rgba(23,20,31,.08)` | Cards | Nuevo |
| `--shadow-2` | `0 8px 24px rgba(0,0,0,.45)` | `0 8px 24px rgba(23,20,31,.12)` | Menús, popovers | Nuevo |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,.6)` | `0 24px 64px rgba(23,20,31,.18)` | Modales | Nuevo |
| `--overlay` | `rgba(8,7,13,.72)` | `rgba(23,20,31,.45)` | Fondo detrás de modales | Nuevo |
| `--modal-header` | `var(--brand)` | `var(--brand)` | Cabecera de modal con color de marca | CNX §4.2 |

#### 7.A.2 Tokens de la PWA

**Piel oscura `.pwa-mod`** (CNX §3.1; obligatoria en listados, formularios y modales):

| Token | Valor | Uso |
|---|---|---|
| `--pwa-bg` | `#000` (página) / `#22222b` (hoja, bottom-sheet) | Fondo |
| `--pwa-brand` | color del tenant (default `#7a51ca`) | CTA, foco, activo |
| `--pwa-lilac` | acento del tenant (default `#8b78ff`) | Glow, tab activa, enlaces |
| `--pwa-lilac-rgb` | `139,120,255` (derivado del acento) | Glow y alfas |
| `--pwa-text` | `#fff` | Texto principal |
| `--pwa-muted` | `rgba(255,255,255,.72)` | Texto secundario |
| `--pwa-dim` | `rgba(255,255,255,.48)` | Labels, inactivo (solo texto ≥ 18 px o no esencial; labels de campo usan `--pwa-muted` para cumplir 4,5:1) |
| `--pwa-line` | `rgba(255,255,255,.10)` | Bordes decorativos |
| `--pwa-line-field` | `rgba(255,255,255,.32)` | Borde de campos (≥ 3:1, WCAG 1.4.11) |
| `--pwa-card-fill` | `#22222b` | Cards, KPIs |
| `--pwa-field-fill` | `#17171d` | Fondo de inputs |
| `--pwa-radius-field` | `14px` | Campos, cards, botones |
| `--pwa-radius-modal` | `18px` | Modales |
| `--pwa-radius-pill` | `999px` | Chips, badges, FAB |
| `--pwa-radius-shell` | `28px` | Phone shell en escritorio |
| `--pwa-cta-shadow` | `0 10px 28px rgba(var(--pwa-brand-rgb),.28)` (default `rgba(122,81,202,.28)`) | Sombra de CTA |
| `--pwa-ok` / `--pwa-warn` / `--pwa-bad` / `--pwa-info` | `#5bd39b` / `#e2b552` / `#f0837b` / `#7cb4f5` | Estados (mismos valores que admin oscuro) |
| `--pwa-font` | `'Sora', 'Montserrat', 'Segoe UI', sans-serif` | Tipografía única |
| `--pwa-page-pad` | `1.25rem 1rem 5rem` | Padding de página (5rem inferior para la tabbar) |
| `--pwa-shell-max` | `430px` | Ancho del phone shell |

**Fondo glow** (obligatorio en pantallas con piel `.pwa-mod`, CNX §3.1):

```css
background-color: #000;
background-image:
  radial-gradient(90% 55% at 50% -8%, rgba(var(--pwa-lilac-rgb), .18), transparent 55%),
  radial-gradient(70% 40% at 100% 100%, rgba(var(--pwa-lilac-rgb), .05), transparent 50%);
```

**Tema claro/oscuro de base** (`style.css`, fuera de `.pwa-mod`: topbar, tabbar, landing interna, perfil):

| Token | Claro | Oscuro |
|---|---|---|
| `--page` | `#f8fafc` | `#000` |
| `--surface` | `#ffffff` | `#22222b` |
| `--text` | `#0f172a` | `#ffffff` |
| `--text-2` | `#64748b` (usar `#526072` para texto pequeño, 4,5:1) | `rgba(255,255,255,.72)` |
| `--brand-base` | `#8554c9` (override del tenant) | `#a78bfa` (acento del tenant aclarado) |

Resolución: `data-theme` en `<html>`; tres niveles (política del tenant → preferencia del usuario → oscuro forzado en login/splash) — RN-UXD-021.

#### 7.A.3 Tipografía

| Rol | Admin | PWA / landing | Tamaño / peso / interlineado |
|---|---|---|---|
| Display (títulos de página) | Space Grotesk 600 | Sora 600, `letter-spacing -0.035em` | Admin `1.5rem/1.25`; PWA H1 `clamp(1.35rem, 4.5vw, 1.55rem)` |
| H2 sección | Space Grotesk 600 | Sora 600 | `1.125rem/1.35` |
| H3 / título de card | Space Grotesk 500 | Sora 600 | `1rem/1.4` (nunca truncado) |
| Cuerpo | IBM Plex Sans 400 | Sora 400 | `0.9375rem/1.55` admin; `1rem/1.55` PWA |
| Cuerpo pequeño / meta | IBM Plex Sans 400 | Sora 400 | `0.8125rem/1.45` (mínimo absoluto 12 px) |
| Label de campo | IBM Plex Sans 500 | Sora 500 | `0.8125rem` |
| Botón | IBM Plex Sans 600 | Sora 600 | `0.875rem` admin; `0.9375rem` PWA |
| Datos tabulares, importes, lecturas, CUIT, CBU, números de comprobante, códigos | **IBM Plex Mono 400/500** | Sora con `tabular-nums` (CTR-UXD-02) | Igual que cuerpo; alineación a la derecha en tablas |
| KPI | Space Grotesk 600 + IBM Plex Mono para la cifra | Sora 600 `tabular-nums` | `1.75rem` |

Fuentes autoalojadas en `packages/ui/fonts` (WOFF2, `font-display: swap`, subconjunto latino extendido con `ñ`, tildes, `º`, `ª`, `$`, `€`). Sin carga desde CDN externo (PA-UXD-08).

#### 7.A.4 Espaciado, grilla y tamaños

| Token | Valor | Uso |
|---|---|---|
| `--s-0` … `--s-10` | `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48 px` | Escala única de espaciado |
| `--row-h` | `44px` (cómoda) / `32px` (compacta) | Altura de fila de `DataTable` |
| `--field-h` | `40px` admin / `48px` PWA | Altura de campo |
| `--hit-min` | `24px` (mínimo WCAG 2.5.8) / `44px` (PWA recomendado) | Área táctil |
| `--sidebar-w` | `264px` / colapsado `64px` | Menú lateral admin |
| `--topbar-h` | `56px` admin / `56px` PWA | Topbar |
| `--tabbar-h` | `64px` + `env(safe-area-inset-bottom)` | Tabbar PWA |
| `--content-max` | `1440px` | Ancho máximo de contenido admin |
| Modales | `sm 480 / md 720 / lg 960 / xl 1180 px` | CNX §4.2 |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` | Tailwind estándar |

#### 7.A.5 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--dur-fast` | `120ms` | Hover, foco |
| `--dur-base` | `200ms` | Abrir menús, toasts |
| `--dur-enter` | `450ms` | Entrada de vista PWA `translateY(12px) → 0` (CNX §3.1) |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | General |
| Reducción | `@media (prefers-reduced-motion: reduce)` o `userUiPreferences.reduceMotion` → duraciones `0ms`, sin transformaciones | AGR-032 |

#### 7.A.6 Capas (z-index)

`--z-base 0`, `--z-sticky 20` (AdminStickyHeader), `--z-topbar 30`, `--z-sidebar 35`, `--z-tabbar 40`, `--z-fab 45`, `--z-popover 50`, `--z-modal 60`, `--z-toast 70`, `--z-splash 80`.

#### 7.A.7 Iconografía e ilustraciones

- `AppIcon` SVG inline 24×24, trazo `1.75`, `stroke-linecap: round`, `currentColor` (CNX §3.4). Tamaños 16/20/24/32.
- Catálogo mínimo de íconos por dominio: persona, titular, cuenta, inmueble, servicio, electricidad, agua, gas, internet, telefonía, tv, sepelio, cementerio, sangre, salud, vivienda, medidor, lectura, factura, recibo, pago, caja, banco, cheque, tarjeta, mora, corte, reconexión, plan de pagos, reclamo, solicitud, ticket, turno, OT, cuadrilla, mapa, red, poste, transformador, stock, equipo, proveedor, compra, asiento, balance, sueldo, asamblea, acta, muro, novedad, encuesta, aviso, campana, mensaje, WhatsApp, email, SMS, reporte, tablero, configuración, diccionario, marca, usuario, rol, candado, auditoría, sincronizar, offline, cámara, firma, adjunto, descargar, imprimir, exportar, importar, filtro, buscar, fijar, ayuda, más, cerrar, chevron, check, alerta, info, error.
- Ilustraciones de estados vacíos: SVG propios monocromos que toman `--pwa-lilac`/`--brand`, `alt=""` (decorativas).
- Íconos de servicio configurables en M02 eligiendo del catálogo (no se suben íconos libres).

#### 7.A.8 Estados semánticos por entidad (contrato de `StatusBadge`)

| Tono | Significado transversal | Ejemplos |
|---|---|---|
| `ok` | Vigente, confirmado, pagado, activo, aprobado, sincronizado | Servicio activo, pago confirmado, CAE obtenido |
| `warn` | Pendiente, por vencer, requiere acción, resultado incierto | Factura por vencer, solicitud pendiente, integración incierta |
| `bad` | Vencido, rechazado, fallido, suspendido, cortado, error | Deuda vencida, pago rechazado, servicio suspendido |
| `info` | En proceso, programado, en camino | Lote en proceso, visita programada, técnico en camino |
| `neutral` | Borrador, inactivo, anulado, baja, archivado | Comprobante anulado, servicio dado de baja |

Cada módulo declara su mapa `estado → tono + ícono + dict:estado.<entidad>.<estado>` en `packages/shared/statusMaps`; prohibido decidir colores en la vista.

### 7.B Modelo de datos

#### 7.B.0 Mapeo lógico → físico (DEC-111, DEC-113, DEC-109)

| Rol | Vigente (build GoodApps) | Notas |
|---|---|---|
| **Front** | **React 19** + **Vite** + Tailwind 4; tokens en `packages/ui/tokens/` (§7.A, código, no SQL) | Radix/shadcn; `dict()` en TSX |
| **Persistencia UXD** | Esquema **`uxd.*`** en Azure SQL | `07-ddl/sql/uxd/`; ver [`07` §2.5](07-modelo-relacional-azure-sql.md) |
| **Mapa del sitio** | `packages/shared/siteMap` (TypeScript versionado) | No tabla; alimenta T02 `screenCatalog` |
| **Assets binarios** | `uxd.BrandAssets` → **`pla.StoredFiles`** / **Azure Blob** (T01) | URLs firmadas; sin BLOB en fila |
| **Flags UI** | `pla.FeatureFlags` (COL-PLA-23; absorbe `uiFeatureFlags` lógico) | T03 consume; no `uxd.UiFeatureFlags` |
| **Vistas de grilla** | `uxd.DataTableViews` (canónica; absorbió `savedViews` de T04) | CTR-DAT-11 |
| **Ayuda** | `uxd.ScreenHelpArticles` + anexo `T03-UXD-screenhelp-base-m01-t02.md` | Claves `dict:` en contenido |
| **Publicación marca/diccionario** | Versiones en SQL + invalidación CDN/caché por tenant | Misma transacción que auditoría T02 cuando aplique |

Traducción lógica → física: `TenantId` → `TenantId`; colección → tabla `uxd.*`. **§7.B.1 en adelante** conserva tipos lógicos; RF/RN no cambian.

Campos comunes (**vigente**): `TenantId`, auditoría, `RowVersion`. *Histórico:* uniqueidentifier y nombres de colección en tablas siguientes.

#### 7.B.1 `tenantBrandings`

Propósito: identidad visual del tenant, versionada (borrador y publicada).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `status` | enum `draft`, `published`, `superseded` | Sí | Solo una `published` y a lo sumo una `draft` por tenant |
| `releaseNumber` | Int | Sí | Número de publicación (1, 2, …) |
| `brandName` | String ≤ 80 | Sí | Nombre de marca ("Cooperativa Ejemplo A") |
| `shortName` | String ≤ 12 | Sí | Sigla/nombre corto (manifest `short_name`, pestaña, exportaciones). Reemplaza VAR 2264 |
| `legalName` | String | No | Solo lectura: se toma de T04 (datos de la cooperativa, VAR 518); se muestra en el pie |
| `emailSenderName` | String ≤ 60 | No | Remitente de emails. Reemplaza VAR 709 |
| `smsSenderName` | String ≤ 11 `[A-Za-z0-9]` | No | Remitente SMS. Reemplaza VAR 2812 |
| `colors.brand` | String hex `#RRGGBB` | Sí | Color principal |
| `colors.brandAccent` | String hex | Sí | Acento (lilac de la PWA, glow) |
| `colors.brand2` | String hex | No | Secundario (gráficos, ilustraciones, landing) |
| `colors.derived` | Object | Sí (calculado) | `brandRgb`, `brandHover`, `brandSoft`, `brandContrast`, `brandAccessibleDark`, `brandAccessibleLight`, `accentRgb` |
| `contrastReport` | Object | Sí (calculado) | Pares evaluados y ratio (`brandOnCanvasDark`, `brandOnCanvasLight`, `contrastOnBrand`, …) con `pass` |
| `themePolicy` | enum `dark`, `light`, `user` | Sí | Default `dark` (PRM-UXD-001) |
| `pwaThemeColorMode` | enum `surface`, `brand` | Sí | Qué color va en `theme-color` |
| `assets` | Object `{ <slot>: brandAssetId }` | No | Slots de 7.B.2 |
| `branchOverrides` | Array `{ branchId, assets: {slot: brandAssetId} }` | No | Logos por sucursal (PA-UXD-10) |
| `variants` | Array `{ variantKey, labelKey, assets: {slot: brandAssetId}, emailSenderName, documentFont }` | No | Variantes de marca para documentos y correos de una entidad jurídica (DEC-064). `variantKey` es único dentro de la publicación (`^[a-z0-9-]{2,32}$`); T04 lo referencia desde `legalEntities.brandingVariantKey`. Solo pueden cambiar logos de los canales `documentos` y `email`, remitente y tipografía de documentos; colores, tema y PWA son siempre los del tenant |
| `loginOptions` | Object | No | `backgroundAssetId`, `helpLinkEnabled` (PRM-UXD-031), `showCooperativeName` |
| `splash` | Object | No | `assetId`, `backgroundColor` (default `#000`), `maxMs` (≤ 1200) |
| `notes` | String | No | Nota de la publicación |
| `publishedAt`, `publishedBy` | Date, uniqueidentifier | Si publicada | — |

Resolución de marca de un documento: si la entidad jurídica emisora tiene `brandingVariantKey` (T04), se usa la variante de la publicación vigente al renderizar y, slot por slot, lo que la variante no define se toma de la marca base; sin valor, o con una clave inexistente en la publicación, se usa la marca base del tenant y se registra una advertencia en la publicación (no bloquea la emisión). Publicar una versión que elimine una `variantKey` referenciada por alguna entidad activa exige confirmación explícita. La versión usada queda congelada en el documento (RN-UXD-013).

Índices: `{tenantId, status}` único parcial para `status ∈ {draft, published}`; `{tenantId, releaseNumber}` único. Mapeo ProCoop: `VAR` 518/709/2264/2812 (RN-09), `WEB_Logos_Facturas` (DFA M26, `CapaDatos.PWeb`).

#### 7.B.2 `brandAssets`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `kind` | enum (abajo) | Sí | Tipo de recurso |
| `channel` | enum `admin`, `desktop`, `pwa`, `pwa-socio`, `pwa-empleado`, `pwa-campo`, `landing`, `documentos`, `email`, `todos` | Sí | Canal de destino |
| `branchId` | uniqueidentifier | No | Sucursal (logos jerárquicos) |
| `storageKey` | String | Sí | Clave en almacenamiento (T08); recursos públicos en el bucket público por tenant con hash |
| `public` | Boolean | Sí | RN-UXD-035 |
| `mime` | enum `image/svg+xml`, `image/png`, `image/webp`, `image/jpeg` | Sí | — |
| `width`, `height`, `bytes` | Int | Sí | — |
| `sha256` | String | Sí | Deduplicación |
| `variants` | Array `{ size, storageKey, purpose: any\|maskable\|monochrome }` | No | Generadas por JOB-UXD-01 |
| `altKey` | String | No | Clave de diccionario del texto alternativo (default `uxd.logo.alt`) |
| `status` | enum `processing`, `ready`, `rejected` | Sí | — |
| `rejectionReason` | String | No | — |
| `originalFileName` | String | Sí | — |
| `sanitized` | Boolean | Si SVG | RN-UXD-036 |

Enum `kind` y requisitos mínimos:

| `kind` | Canal por defecto | Mínimo | Formatos | Notas |
|---|---|---|---|---|
| `productLogo` | admin | alto 32 px (SVG preferido) | SVG, PNG | **Marca CoopApps**; solo tenant `PLATFORM`; semilla desde `docs/brand/coopapps/` (DEC-119, doc `08`) |
| `productLogoLight` | admin | ídem | SVG, PNG | Variante tema claro del logo producto |
| `productIsotype` | admin, pwa | 128×128 mín.; 1024 para generación | SVG, PNG | Isotipo CoopApps (splash producto, favicon base) |
| `logoAdmin` | admin | alto 64 px (SVG preferido) | SVG, PNG | Topbar del admin (**cooperativa**) |
| `logoAdminLight` | admin | ídem | SVG, PNG | Variante para tema claro (opcional) |
| `logoDesktop` | desktop | 512×128 | SVG, PNG | Presentación de escritorio (MAR-004) |
| `logoApp` | pwa | alto 64 px | SVG, PNG | Logo interno de la app móvil (MAR-003) |
| `logoPwaSocio` | pwa-socio | alto 64 px | SVG, PNG | MAR-006 |
| `logoPwaEmpleado` | pwa-empleado | alto 64 px | SVG, PNG | MAR-005 |
| `logoPwaCampo` | pwa-campo | alto 64 px | SVG, PNG | Hereda de empleado |
| `appIcon` | pwa | 1024×1024 cuadrado | SVG, PNG | Ícono de instalación; genera 48–512 |
| `appIconMaskable` | pwa | 1024×1024, zona segura 80 % | PNG | Android adaptativo |
| `appIconSocio` / `appIconEmpleado` / `appIconCampo` | pwa-* | 1024×1024 | SVG, PNG | Opcionales; heredan de `appIcon` |
| `appleTouchIcon` | pwa | 180×180 (generado) | PNG | — |
| `favicon` | todos | 32×32 (generado) | PNG, SVG | — |
| `splashMobile` | pwa | 1242×2688 o SVG centrado | SVG, PNG | MAR-003 |
| `splashDesktop` | desktop | 1920×1080 o SVG centrado | SVG, PNG | — |
| `loginBackground` | todos | 1920×1080 | WebP, JPG | Fondo de login (CNX §3.6) |
| `landingHero` | landing | 1920×800 | WebP, JPG | Imagen principal de landing |
| `landingOg` | landing | 1200×630 | PNG, JPG | Vista previa al compartir |
| `documentLogo` | documentos | 600×200, 300 dpi equivalente | PNG, SVG | Facturas, recibos, constancias (reemplaza `WEB_Logos_Facturas`) |
| `emailHeader` | email | 1200×300 | PNG, JPG | Cabecera de emails |

Límite de peso: 2 MB por archivo (PRM-UXD-011). Índices: `{tenantId, kind, channel, branchId}`, `{tenantId, sha256}`.

#### 7.B.3 `dictionaryKeys` (catálogo de producto, tenant `PLATFORM`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `key` | String `^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)+$` | Sí | Clave estable (único global) |
| `namespace` | String | Sí | Primer segmento (`per`, `fac`, `ui`, `nav`, …) |
| `kind` | enum `term`, `label`, `message`, `help`, `legal`, `state`, `error` | Sí | Tipo |
| `description` | String | Sí | Significado funcional (BASE §65.4) |
| `context` | String | Sí | Dónde aparece (pantalla, componente) |
| `screens[]` | String | No | `screenId` donde se usa (para el editor) |
| `channels[]` | enum de canales | Sí | Canales donde aplica |
| `base` | Object `{ one, other, title?, short?, zero? }` o `{ text }` | Sí | Texto base |
| `gender` | enum `m`, `f`, `n` | Si `term` | Género gramatical |
| `variables[]` | Array `{ name, type: string\|number\|date\|money\|term, required }` | No | Variables permitidas |
| `termRefs[]` | String | No | Términos que referencia (para propagar cambios) |
| `maxLength` | Int | Sí | Límite |
| `protected` | Boolean | Sí | Texto protegido |
| `notEquivalentTo[]` | String | No | Claves que no pueden compartir valor (RN-UXD-008) |
| `conceptKey` | String | No | Concepto canónico (para IA/bot y soporte) |
| `module` | String | Sí | Módulo dueño (M01…M19, T01…T11) |
| `introducedIn` | String (versión de producto) | Sí | — |
| `renamedTo` | String | No | RN-UXD-012 |
| `deprecatedAt` | Date | No | — |
| `procoopEquivalent` | String | No | Ej. `VAR_PMOVIL 7` |
| `locale` | String | Sí | `es-AR` |

Índices: `{key}` único, `{namespace, kind}`, `{module}`. Fuente: archivo `packages/dictionary/base/*.json` sincronizado a la colección en cada despliegue (JOB-UXD-05).

#### 7.B.4 `tenantDictionaryEntries`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `key` | String | Sí | Clave del catálogo |
| `channel` | String (`*` o canal) | Sí | `*` = todos los canales |
| `value` | Object `{ one, other, title?, short?, zero? }` o `{ text }` | Sí | Valor del tenant |
| `gender` | enum | Si `term` | Puede cambiar respecto del base ("Gestión" f → "Ticket" m) |
| `state` | enum `draft`, `published`, `deleted` | Sí | `deleted` = volver al base en el próximo release |
| `draftOf` | uniqueidentifier | No | Entrada publicada a la que reemplaza; → `tenantDictionaryEntries` |
| `note` | String | No | Motivo del cambio |
| `validation` | Object | Sí (calculado) | `lengthOk`, `variablesOk`, `ambiguityWarnings[]`, `contrastIrrelevant` |

Índices: `{tenantId, key, channel, state}` único parcial para `state ∈ {draft, published}`. Mapeo ProCoop: `VARIABLE_PMOVIL` (VAR_PMOVIL 5, 6, 7, 8, 9, 35, 65), VAR 3157 (sección 19).

#### 7.B.5 `dictionaryReleases`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `releaseNumber` | Int | Sí | 1, 2, … por tenant |
| `baseCatalogVersion` | String | Sí | Versión del catálogo de producto con que se compiló |
| `entries` | Array `{ key, channel, value, gender }` | Sí | Snapshot completo de entradas publicadas del tenant (inmutable) |
| `changes` | Array `{ key, channel, before, after }` | Sí | Diferencias respecto del release anterior |
| `revertedFrom` | Int | No | Si es una reversión |
| `bundleHashes` | Object `{ <canal>: sha256 }` | Sí | Paquetes compilados por canal |
| `publishedAt` | Date | Sí | Fecha de publicación (antes en la fila conjunta `publishedAt`, `publishedBy`, `note`) |
| `publishedBy` | uniqueidentifier | Sí | Quien publicó; → `memberships` |
| `note` | String | No | Motivo del release |

Índices: `{tenantId, releaseNumber}` único. Inmutable (sin `updatedAt` operativo).

#### 7.B.6 `dictionaryMissingKeys`

`TenantId`, `key`, `channel`, `screenId`, `appVersion`, `firstSeenAt`, `lastSeenAt`, `count`, `resolvedAt`. Índice `{tenantId, key, channel}` único. Alimenta el indicador IND-UXD-01.

#### 7.B.7 `screenHelpArticles`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `screenId` | String (`PAN-<COD>-NN`) | Sí | Pantalla |
| `scope` | enum `base`, `tenant` | Sí | Base de producto (tenant `PLATFORM`) o sobrescritura |
| `que`, `quien`, `cuando`, `donde`, `porQue`, `como` | String (Markdown restringido) | Sí en `base` | Las 6 preguntas (CNX §4.2) |
| `casoDeUso` | Object `{ cuId, resumen }` | No | Enlace a CU |
| `relatedItems[]` | String (`SM-*`) | No | Pantallas relacionadas |
| `videoUrl` | String | No | Video tutorial (URL permitida) |
| `status` | enum `draft`, `published` | Sí | — |
| `baseVersionSeen` | Int | Si `tenant` | Para avisar cambios de la base (RN-UXD-055) |

Índice `{tenantId, screenId, scope}` único.

#### 7.B.8 `uiFeatureFlags`

`key` (ej. `pwa.offlineQueueV2`), `scope` (`platform`/`tenant`/`role`), `roleKey?`, `enabled`, `reason`, `changedBy`, `changedAt`, `history[] { enabled, reason, by, at }`, `rollbackNote` (bitácora de reversión, CNX §3.5). Índice `{tenantId, key, scope, roleKey}` único.

#### 7.B.9 `userUiPreferences`

| Campo | Tipo | Descripción |
|---|---|---|
| `userId` | uniqueidentifier | Único por tenant + usuario |
| `theme` | enum `dark`, `light`, `system` | Si la política lo permite |
| `density` | enum `comfortable`, `compact` | Admin |
| `fontScale` | enum `100`, `115`, `130` | PWA |
| `reduceMotion` | Boolean | — |
| `pinnedItems[]` | Array `{ siteMapId, order }` (máx. 12) | Accesos fijados |
| `recentItems[]` | Array `{ siteMapId, at }` (máx. 10) | Recientes |
| `feedMode` | enum `carousel`, `list` | Muro (CNX §5.1) |
| `dismissed` | Object `{ installPromptUntil, tips[], banners[] }` | Descartes |
| `lastContext` | Object `{ branchId, serviceId, period, space: socio\|empleado }` | Último contexto |
| `showDictKeys` | Boolean | Modo soporte (RF-UXD-162) |

#### 7.B.10 `dataTableViews`

`tableId` (ej. `per.titulares.list`), `name`, `ownerId`, `shared` (Boolean), `isDefault`, `columns[] { id, visible, width, order, pinned }`, `sort[] { id, dir }`, `filters` (Object validado por el esquema de la tabla), `pageSize`, `density`. Índice `{tenantId, tableId, ownerId, name}` único.

Es la única colección de vistas de grilla: absorbe la `savedViews` de T04 (COL-CFG-35 → COL-UXD-10; CTR-DAT-11). `tableId` es el nombre canónico del campo (T05 COL-UXD-10 y §7.2); `screenCode` es solo un alias de documentación y no se usa en código (texto anterior: "`tableId` es el `screenCode` de T05 COL-UXD-10"). Las vistas guardadas de reportes siguen siendo `savedViews` de T10 (COL-BIA-03) y no se guardan acá.

#### 7.B.11 `pwaNavConfigs`

`role` (`socio`, `empleado`, `tecnico`, `lecturista`, `cobrador`), `tabbarSlots[2]` (ids `SM-PW*` permitidos para los dos enlaces configurables), `fabDefault` (acción por defecto en Inicio), `quickAccess[] { siteMapId, order }` (Inicio), `hiddenItems[]`, `menuOrder[]`. Índice `{tenantId, role}` único. No otorga permisos (RN-UXD-023).

#### 7.B.12 `siteMapGroups` (código, no colección)

Estructura TypeScript en `packages/shared/siteMap/{admin,pwa,landing,platform}.ts`:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String `SM-<APP>-NNN` | ID estable |
| `level` | `cluster` \| `group` \| `item` | — |
| `labelKey` | String | Clave `nav.*` |
| `icon` | String | Nombre de `AppIcon` |
| `route` | String | Ruta del router (ítems) |
| `capability` | String | Capability de "ver" (ítems) |
| `module` | String | Código de módulo dueño (licencia) |
| `keywords[]` | String | Sinónimos para el buscador (incluye término ProCoop) |
| `procoopEquivalents[]` | String | Funciones del menú ProCoop que cubre |
| `ola` | String | Ola en que se habilita |
| `flags[]` | String | Flags de UI que lo condicionan |
| `badgeSource` | String | Endpoint de contador (opcional) |
| `meta` | Object | `platformOnly`, `tenantOnly`, `hiddenFromMap`, `primaryTask` |

#### 7.B.13 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-UXD-18 (Asumida, DEC-072).

**`dictionaryMissingKeys`** — Claves faltantes detectadas (COL-UXD-06; definición en texto en §7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `key` | string | Sí | — | Según la definición en texto del §7 |
| `channel` | enum | No | — | Según la definición en texto del §7 |
| `screenId` | string | No | — | Según la definición en texto del §7 |
| `appVersion` | string | No | — | Según la definición en texto del §7 |
| `firstSeenAt` | Date | No | — | Según la definición en texto del §7 |
| `lastSeenAt` | Date | No | — | Según la definición en texto del §7 |
| `count` | int | No | — | Según la definición en texto del §7 |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `locale` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`dataTableViews`** — Vistas de grilla por usuario o compartidas (absorbe savedViews de T04) (COL-UXD-10; definición en texto en §7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tableId` | string | Sí | — | ej. `per.titulares.list` |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `ownerId` | uniqueidentifier | Sí | `memberships` (T02) | destino → `memberships` |
| `shared` | bool | No | — | Boolean |
| `isDefault` | bool | No | — | Según la definición en texto del §7 |
| `filters` | object | No | — | Object validado por el esquema de la tabla |
| `pageSize` | int | No | — | Según la definición en texto del §7 |
| `density` | string | No | — | Según la definición en texto del §7 |
| `screenCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`pwaNavConfigs`** — Navegación de la PWA por perfil (COL-UXD-11; definición en texto en §7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `role` | enum | No | — | `socio`, `empleado`, `tecnico`, `lecturista`, `cobrador` |
| `fabDefault` | string | No | — | acción por defecto en Inicio |
| `hiddenItems` | array | No | — | Según la definición en texto del §7 |
| `menuOrder` | array de string | No | — | Según la definición en texto del §7 |
| `screenProfileId` | uniqueidentifier | Sí | `screenProfiles` (T02) | destino → `screenProfiles` |
| `app` | string | Sí | — | Campo citado por T05 (referencias o clave única) |


## 8. Estados y transiciones

### 8.1 `tenantBrandings`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `published` (release 1) | Sistema (alta de tenant, T01) | Tenant creado | Defaults del producto; evento `uxd.branding.published` | — |
| `published` | (crea) `draft` | Usuario con `uxd.marca.editar` | No existe otro borrador | Copia del publicado | Descartar borrador |
| `draft` | `draft` | `uxd.marca.editar` | Control optimista `version` | Recalcula derivados y `contrastReport` | — |
| `draft` | `published` | `uxd.marca.publicar` (y distinto del editor si PRM-UXD-021) | Assets en `ready`; validaciones sin errores bloqueantes | El anterior pasa a `superseded`; JOB-UXD-02 compila manifest y CSS; evento `uxd.branding.published` | Revertir |
| `draft` | (eliminado) | `uxd.marca.editar` | — | — | — |
| `superseded` | `published` (vía nuevo release) | `uxd.marca.publicar` | — | "Revertir a versión N" crea release nuevo con el contenido de N | — |

### 8.2 `brandAssets`

`processing` → `ready` (JOB-UXD-01 valida y genera variantes) · `processing` → `rejected` (formato, tamaño, SVG no saneable) · `ready` → eliminado lógico solo si ningún release publicado lo referencia.

### 8.3 Entradas y releases del diccionario

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| (sin entrada) | `draft` | `uxd.diccionario.editar` | Clave existe, no protegida, validaciones OK | — |
| `draft` | `draft` | ídem | — | Revalida |
| `published` | `draft` (nueva) | ídem | — | `draftOf` apunta a la publicada |
| `published` | `deleted` (borrador de eliminación) | ídem | — | Al publicar vuelve al base |
| Borradores | Release `n+1` | `uxd.diccionario.publicar` | Sin errores bloqueantes; si PRM-UXD-021, publicador ≠ editor | Borradores → `published`; anteriores archivadas; snapshot inmutable; JOB-UXD-03 compila paquetes; evento `uxd.dictionary.published` |
| Release `n` | Release `n+1` = copia de `k` | `uxd.diccionario.revertir` | `k < n` | Evento `uxd.dictionary.reverted` |

### 8.4 Estado de perfil del usuario PWA (ruteo, RN-UXD-026)

| Estado | Destino de landing | Banner | Menú |
|---|---|---|---|
| Registrado sin relación | `/inicio` | `dict:por.banner.completarRegistro` | Contratar, consultas, comunidad pública |
| Pendiente de validación | `/inicio` | `dict:por.banner.validacionPendiente` | Recortado (sin pagos) |
| Activo | `/inicio` | — | Completo |
| Con deuda vencida | `/inicio` | `dict:por.banner.deudaVencida` (con importe) | Completo, FAB = Pagar |
| Suspendido | `/inicio` | `dict:por.banner.servicioSuspendido` | Completo, FAB = Pagar, acceso a reactivar |
| Baja | `/inicio` | `dict:por.banner.cuentaBaja` | Consultas, constancias, documentos históricos |
| Empleado activo | `/trabajo` | — | Allowlist del rol |
| Empleado suspendido | `/sin-acceso` | — | Ninguno |
| Campo activo | `/campo/mi-dia` | Offline/pendientes | Allowlist del rol |

### 8.5 Ítems de la cola offline (presentación)

`pendiente` (`warn`) → `enviando` (`info`) → `confirmado` (`ok`) · `enviando` → `error reintentable` (`warn`, reintento automático) · `enviando` → `rechazado` (`bad`, requiere acción del usuario con motivo) · `confirmado` se retira de la lista a las 24 h.

### 8.6 Flags de UI

`enabled` ↔ `disabled` por actor con `uxd.flags.configurar` (tenant) o `uxd.plataforma.flags.configurar` (plataforma; antes `plt.uxd.flags.configurar`, T02 §4.4.1), con motivo obligatorio; plataforma `disabled` bloquea el encendido en tenant.

### 8.7 `screenHelpArticles`

**Paquete base fase export (M01 + T02 núcleo):** contenido semilla en [`T03-UXD-screenhelp-base-m01-t02.md`](T03-UXD-screenhelp-base-m01-t02.md) (25 artículos `scope=base`, `status=draft`). Inventario y regeneración: `_trabajo/screenhelp-borrador-nucleo.md`, `_trabajo/generate_t03_screenhelp_annex.py`.

Corrección del 05-11-2026: §7 declaraba `status` (`draft`, `published`) sin transiciones. Estado inicial `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `draft` | Alta de la ayuda de una pantalla por `uxd.ayuda.editar` | `screenId` existe en el mapa del sitio | — |
| `draft` | `published` | Publicación por `uxd.ayuda.editar` | Las 6 preguntas tienen texto | — |
| `published` | `draft` | Nueva edición (se conserva la publicada hasta publicar el borrador) | — | — |

### 8.8 Tabla normalizada de estados iniciales (PA-UXD-18)

Explicita el estado de alta de las máquinas de §8.2 y §8.3. `dictionaryReleases` no tiene campo de estado: cada release es un documento inmutable y las filas "Release `n` → `n+1`" de §8.3 describen la secuencia de releases.

| Colección | Desde | Hasta | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `brandAssets.status` | — | `processing` | Carga del recurso por `uxd.marca.editar` | Formato y tamaño admitidos | — |
| `brandAssets.status` | `processing` | `ready` | JOB-UXD-01 valida y genera variantes | — | — |
| `brandAssets.status` | `processing` | `rejected` | JOB-UXD-01 rechaza (formato, tamaño, SVG no saneable) | — | — |
| `tenantDictionaryEntries.state` | — | `draft` | Edición de una clave por `uxd.diccionario.editar` (antes "(sin entrada)") | Clave existente, no protegida, validaciones correctas | — |
| `tenantDictionaryEntries.state` | `draft` | `published` | Publicación del release por `uxd.diccionario.publicar` | Sin errores bloqueantes | `uxd.dictionary.published` |
| `tenantDictionaryEntries.state` | `published` | `deleted` | Borrador de eliminación por `uxd.diccionario.editar` | — | — |

`tenantDictionaryEntries.draftOf` referencia la entrada publicada de la misma colección (`tenantDictionaryEntries`, T03).

## 9. Procesos y flujos

### 9.1 Arranque de cualquier app (branding runtime)

1. El cliente resuelve el `tenantSlug` por subdominio; si no hay, muestra el campo de código de cooperativa (login) o la landing genérica del producto.
2. `GET /api/public/{tenantSlug}/bootstrap?app={admin|pwa|landing}` (antes `{slug}`; API-POR-01 de M19, dueño del endpoint, que unifica API-UXD-01 y API-PLA-64; el parámetro `app` queda pendiente de alta en API-POR-01) devuelve en una sola respuesta, en el bloque que aporta UXD: `brandingRelease`, colores y derivados, URLs de recursos públicos, `themePolicy`, `dictRelease` y URL del paquete `login`/`landing`, métodos de login habilitados (de T02), flags públicos. Sin datos personales.
3. `applyBrandingCssVars(branding)` escribe en `:root` las variables de marca (RF-UXD-025).
4. `applyTenantPwaIdentity(branding, app)` actualiza `<title>`, favicon, `<link rel="manifest">` y `<link rel="apple-touch-icon">`.
5. `applySystemChromeTheme(theme)` escribe `<meta name="theme-color">`.
6. Se carga el paquete de diccionario pre-login (`login.*`, `lnd.*`, `ui.*`, `err.*`).
7. Se muestra el `SplashScreen` (si app instalada o post-login) hasta 1,2 s.
8. Tras el login, se carga el paquete completo del canal y se revalidan versiones (`ETag`); si cambian, se reaplica sin recargar.

### 9.2 Resolución de un recurso de marca

`slot pedido (ej. logoPwaSocio, sucursal S)` → override de sucursal S → recurso del tenant para el slot → slot padre según RN-UXD-016 → recurso del producto. Siempre devuelve una URL válida.

### 9.3 Edición y publicación de marca (CU-MAR-01, CU-UXD-01)

1. El usuario abre PAN-UXD-01; si no hay borrador, se crea copiando el publicado.
2. Carga nombre, colores y recursos; cada subida crea `brandAssets` en `processing` y encola JOB-UXD-01.
3. El editor recalcula derivados y contraste en vivo y muestra advertencias.
4. Previsualiza en los canales (RF-UXD-033).
5. Publica: validaciones → release → JOB-UXD-02 (manifest por app, CSS de variables, invalidación de caché CDN) → evento.
6. Los clientes abiertos aplican la nueva marca en el siguiente arranque o al detectar la versión (≤ 5 min, PRM-UXD-012).

### 9.4 Resolución de texto del diccionario (runtime)

1. En build, el plugin `vite-plugin-dict` verifica que toda clave usada exista en `packages/dictionary/base` (RF-UXD-158) y extrae el subconjunto por app.
2. En runtime, `dict(key, vars, { channel })` busca en el paquete compilado del tenant (que ya fusionó base + entradas publicadas del tenant + variantes del canal); aplica plural, género y variables con el formateador ICU subset; formatea `money`/`date` con los helpers centrales.
3. Si no encuentra la clave: RN-UXD-002 y POST asíncrono a `dictionaryMissingKeys` (con muestreo).

### 9.5 Edición y publicación del diccionario (CU-DIC-01)

1. El usuario abre PAN-UXD-02 y filtra por término, módulo, pantalla, canal o "solo personalizadas".
2. Elige un término (ej. `per.asociado`) y edita singular, plural, género, corta; el editor muestra **dónde se usa** (claves que lo referencian y pantallas) y la previsualización.
3. Las validaciones (longitud, variables, no equivalencia, protegidos) se ejecutan en vivo.
4. Publica con nota → release → JOB-UXD-03 compila paquetes por canal → evento.
5. Revertir: elige release `k` → release nuevo.

### 9.6 Alta de tenant (paso de experiencia, coordinado con T01)

1. T01 crea el tenant → evento `pla.tenant.created`.
2. UXD consume y crea `tenantBrandings` release 1 con defaults y `dictionaryReleases` release 0 (vacío = base) → JOB-UXD-04 (siembra).
3. Si el alta fue asistida con IA, la propuesta de marca queda como borrador (RF-UXD-037).
4. Opcional: aplicar diccionario plantilla elegido en el alta (borrador para revisión).

### 9.7 Login (UX)

Pasos de 10.4; cada error se muestra inline; la secuencia nunca pierde lo cargado; el foco va al primer campo con error.

### 9.8 Importación de Excel genérica (`ExcelImportWizard`)

1. **Subir**: plantilla descargable con encabezados del diccionario y hoja de instrucciones; arrastre o selector; validación de tamaño (PRM-UXD-013) y tipo.
2. **Previsualizar**: el backend parsea en job (`<mod>:importar-<recurso>`), mapea columnas (sugerencia automática por similitud con labels y claves), valida con el esquema Zod del recurso y devuelve errores por fila/columna; la UI muestra totales (válidas / con error / duplicadas) y permite descargar el detalle.
3. **Confirmar**: importa las válidas (o todo-o-nada si el recurso lo exige), con `Idempotency-Key` = hash del archivo + mapeo; progreso y resultado por fila descargable; auditoría.

### 9.9 Cola offline (PWA campo y encuestas)

Encolar en IndexedDB `{ clientMutationId, type, payload, attachments[], createdAt, attempts }` → `POST /api/sync` por lotes (máx. 50) → resultado por ítem → reintento exponencial (5 s, 30 s, 2 min, 10 min) → banner único con "Reintentar" y detalle. Fotos y firmas en IndexedDB hasta su confirmación.

### 9.10 Mapa del sitio filtrado

`GET /api/admin/uxd/site-map` (API-UXD-20) recibe el árbol del código y devuelve solo los ítems visibles para el usuario (RN-UXD-022) con labels ya resueltos y badges; el cliente lo cachea por sesión y lo invalida al cambiar contexto, rol o release del diccionario.

## 10. Pantallas, layouts, componentes y mapa del sitio

Sección adaptada: 10.1 layouts (MainLayouts), 10.2 catálogo de componentes, 10.3 reglas UX, 10.4 login, 10.5 accesibilidad, 10.6 pantallas propias de UXD, 10.7 catálogo base del diccionario, 10.8 mapa del sitio completo.

### 10.1 MainLayouts

#### 10.1.1 `AdminShell` (apps/admin, `meta.tenantOnly`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Topbar 56px: [≡] [logo producto] │ [logo tenant/sucursal] [Selector de contexto ▾]      │
│   [🔍 Buscar (Ctrl+K)] [Mapa del sitio] [★ fijado 1][★ 2]…  [🔔 alertas] [✉ avisos] [?] [avatar ▾] │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ Menú lateral │ AdminStickyHeader: breadcrumb · Título · subtítulo        [acciones →]   │
│ (siteMap-    ├─────────────────────────────────────────────────────────────────────────┤
│  Groups)     │ (fuera del sticky) ScreenHelp · pestañas · barra de filtros              │
│ clusters ▸   │ Contenido: DataTable / ficha / formulario / tablero                       │
│ grupos ▸     │                                                                           │
│ ítems        │                                                                           │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

| Zona | Contenido | Reglas |
|---|---|---|
| Logo del producto | Logo CoopApps (fijo) | Enlaza a Inicio del tenant |
| Logo del tenant | `logoAdmin` (o `logoAdminLight` en claro), override de sucursal | `alt` = `dict:uxd.logo.alt` |
| Selector de contexto | Tenant (si varios), sucursal/agencia, y por módulo servicio/período | Cambiar contexto recalcula perfiles y alcance (T02), invalida caché del mapa |
| Buscador | Pantallas del mapa + entidades permitidas (RF-UXD-057) | Ctrl+K / `/` abre; resultados por grupo; Enter navega |
| Mapa del sitio | Modal xl con buscador, clusters, grupos, ítems, fijar | RF-UXD-043 |
| Accesos fijados | Hasta 12 chips con ícono + label corto | Overflow en "más" |
| Alertas | Centro de alertas del tenant (pendientes ARCA, lotes con error, integraciones fallidas, conciliaciones con diferencias, jobs fallidos) | Reemplaza alerta modal de ProCoop (REL §1) |
| Avisos | Bandeja `AppNotification` del usuario | `notifKinds` |
| Ayuda `?` | Abre `ScreenHelp` de la pantalla actual | Misma ubicación siempre (WCAG 3.2.6) |
| Avatar | Perfil, preferencias (tema, densidad), cambiar de espacio, cerrar sesión, cerrar en todos los dispositivos | — |
| Menú lateral | Árbol `siteMapGroups` filtrado; colapsable a íconos; recuerda grupos abiertos; badges | Teclado: flechas, Home/End, Enter |

#### 10.1.2 Página estándar del admin

- `AdminStickyHeader`: breadcrumb, título `dict:`, subtítulo, acciones (1 primaria, hasta 3 secundarias, menú "más"); `position: sticky; top: var(--topbar-h)`.
- Debajo (no sticky): `ScreenHelp` (enlace "¿Qué es esta pantalla?"), `PwaTabs`-equivalente admin (`TabsLine`), `FilterBar`.
- Contenido típico: `DataTable` con vistas guardadas; ficha (`EntityDetailLayout`: cabecera resumen con `StatusBadge` y KPIs, pestañas, panel lateral de `Timeline`); formulario en modal; tablero (`BiKpiGrid` + gráficos).
- Modales `sm/md/lg/xl` con cabecera color de marca, pie con acciones (secundaria izquierda, primaria derecha), cierre por fuera/Esc/botón, confirmación si hay cambios sin guardar.

#### 10.1.3 `ScreenHelp`

Modal `md` con seis bloques (qué / quién / cuándo / dónde / por qué / cómo), bloque "Caso de uso" (CU-ID + resumen), "Pantallas relacionadas" (enlaces `SM-*`), video opcional y pie "¿Te sirvió?" (sí/no para indicador IND-UXD-05). Textos con claves y Markdown restringido.

#### 10.1.4 `AppShell` (apps/pwa)

```
┌──────────────────────────────────────┐
│ Topbar: [≡] [logo tenant] [pendientes⟳] [asistente IA*] [🔔 n] [avatar] │
├──────────────────────────────────────┤
│ Banners (máx. 2): offline/pendientes · encuestas obligatorias ·          │
│ deuda/suspensión · corte programado en tu zona · instalar app            │
├──────────────────────────────────────┤
│ Contenido (.pwa-mod, glow) — H1 + subtítulo, scroll único                │
├──────────────────────────────────────┤
│ Tabbar: [slot1] [slot2] ( + ) [slot3] [slot4]                            │
└──────────────────────────────────────┘
  * asistente IA solo si flag `pwa.asistente` (PA-UXD-16)
```

| Rol | Slot 1 | Slot 2 | FAB (default) | Slot 3 | Slot 4 | Perfil |
|---|---|---|---|---|---|---|
| Socio | `dict:nav.pws.inicio` (Inicio) | `dict:nav.pws.servicios` (Cuentas; `short` ≤ 12 caracteres, RN-UXD-006; título de la pantalla: Cuentas y servicios; antes "Cuentas y servicios") | `dict:nav.pws.fab.pagar` (Pagar) en Inicio/Facturas; Nueva gestión en Gestiones; Contratar en Servicios | `dict:nav.pws.gestiones` (Gestiones) | `dict:nav.pws.comunidad` (Comunidad: PAN-POR-105 de M19, PA-POR-20, SM-PWS-026; antes "pantalla Comunidad de M19 (PA-POR asumida)") | Avatar en topbar |
| Registrado sin cuenta | `dict:nav.pws.inicio` (Inicio, PAN-POR-25 en su variante registrado) | `dict:nav.pws.contratar` (Contratar, PAN-POR-31) | Según pantalla (`useCreateAction`): Contratar en Contratar; Nueva gestión en Gestiones; Vincular cuenta en Inicio | `dict:nav.pws.gestiones` (Gestiones, PAN-POR-50) | `dict:nav.pws.perfil` (Perfil, PAN-POR-59) | Slot 4 de la tabbar (M19 §10.1) |
| Empleado | `dict:nav.pwe.inicio` (Inicio, PAN-POR-69) | `dict:nav.pwe.recibos` (Recibos, PAN-POR-70; antes `dict:nav.pwe.bandeja` (Bandeja)) | Según pantalla (`useCreateAction`): Solicitar en Vacaciones y Licencias; nueva tarea, publicación o aprobación en Bandeja y Muro | `dict:nav.pwe.solicitudes` (Solicitudes: vacaciones y licencias, PAN-POR-72 y PAN-POR-73; antes `dict:nav.pwe.agenda` (Agenda)) | `dict:nav.pwe.perfil` (Perfil, PAN-POR-59; antes `dict:nav.pwe.avisos` (Avisos)) | Slot 4 de la tabbar (M19 §10.1; antes avatar en topbar). Bandeja, Agenda y Avisos se abren desde el menú |
| Técnico | `dict:nav.pwc.hoy` (Hoy) | `dict:nav.pwc.ordenes` (Órdenes) | "Nuevo" abre el menú de altas del rol (RF-UXD-067): Reclamo en campo (modal PAN-CRM-04, `crm.casos.crear`, SM-PWC-007); Incidente con foto y GPS (PAN-TEC-55 `/app/campo/work-orders/new`, `tec.ordenes.crear` (antes `tec.workOrder.create`), SM-PWC-008); Material usado (solo dentro de una OT abierta, PAN-TEC-51) | `dict:nav.pwc.stock` (Stock en vehículo) | `dict:nav.pwc.sync` (Sincronización) | Avatar |
| Lecturista | `dict:nav.pwc.hoy` | `dict:nav.pwc.rutas` (Rutas) | "Nuevo" abre: Lectura fuera de ruta (modal PAN-MED-29, `med.campo.leer`, SM-PWC-011) u Observación del punto de medición (modal de la ruta de lectura) | `dict:nav.pwc.stock` (oculto si no aplica → `dict:nav.pwc.mapa`) | `dict:nav.pwc.sync` | Avatar |
| Cobrador | `dict:nav.pwc.hoy` | `dict:nav.pwc.cobranza` (Cobranza) | "Nuevo cobro": abre el cobro en PAN-COB-29 `/app/campo/cobrador` con búsqueda de cuenta | `dict:nav.pwc.rendicion` (Rendición) | `dict:nav.pwc.sync` | Avatar |

Los slots configurables (RF-UXD-177) son los centrales 2 y 3 en empleado; socio y campo usan los del maestro por defecto y el tenant puede reemplazar el slot 4.

**Phone shell** en escritorio (≥ 768 px): contenedor centrado `max-width 430px`, `border-radius 28px`, sombra `--shadow-modal`, sobre el glow a pantalla completa; enlace "Abrir en vista amplia" para tablas largas (facturas, movimientos) si PA-UXD-11 = B.

**Menú hamburguesa**: `PwaModal` de altura completa, buscador arriba, grupos colapsables del `pwaSiteMap` del rol, pie con cambiar de espacio, tema, cerrar sesión.

#### 10.1.5 `LandingLayout` (apps/landing)

| Bloque | Contenido | Fuente |
|---|---|---|
| Header | Logo (`landing` → `logoApp`), navegación (Servicios, Noticias, Trámites, Contacto), CTA `dict:lnd.acceso.app` (Ingresar a la app de socios), `dict:lnd.pagar` (Pagar sin ingresar) si habilitado | BASE §43.7; M19 |
| Hero | `landingHero`, título y texto editables (`lnd.hero.titulo`, `lnd.hero.texto`, base: "Servicios de tu cooperativa, en un solo lugar" / "Consultá nuestros servicios e ingresá para gestionar los tuyos.") | BASE §43.7 |
| Servicios habilitados | Cards por servicio del catálogo habilitado (M02) con "Consultar" y "Contratar" | BASE §43.8, §66 |
| Noticias | Publicaciones con canal `landing` (T09) | BASE §46 NOT-001 |
| Accesos rápidos | Registrarme, Consultar deuda, Pagar, Reclamo/solicitud, Turno online, Baja del servicio (si corresponde) | Guía §8; BASE §53 |
| Contacto | Teléfonos, WhatsApp, horarios, sucursales con mapa y alternativa textual | M19 |
| Pie | Razón social (T04), CUIT, enlaces legales, "Botón de arrepentimiento/baja" si corresponde, accesibilidad | BASE §52–53 |

Tema claro por defecto (público general), Sora, `LandingLayout` sin tabbar; la marca se aplica igual que en las apps.

#### 10.1.6 `PlatformShell` (rutas `meta.platformOnly`)

Igual estructura que `AdminShell` con: logo del producto en ambas posiciones, **banda superior** de 4 px y chip `dict:plt.banda` (Plataforma GoodApps) en color fijo `#e2b552` sobre `--canvas`, selector de contexto restringido a "Plataforma" o "Tenant (acceso temporal vigente)" con contador de tiempo restante del acceso (T01), menú propio (10.8.6).

### 10.2 Catálogo de componentes

Columnas: origen CNX (**[COPIAR]** molde / **[MEJORAR]** construir / **Nuevo**), app (A = admin, P = PWA, L = landing, T = todas), ola.

#### 10.2.1 Shells y navegación

| Componente | Origen | App | Ola | Contrato |
|---|---|---|---|---|
| `AdminShell` | CNX §4.2 [COPIAR] | A | O0 | 10.1.1 |
| `AdminTopbar` | CNX §4.2 [COPIAR] | A | O0 | Zonas de 10.1.1 |
| `ContextSelector` | CNX §4.2 [COPIAR] | A | O0 | Tenant/sucursal/servicio/período; emite `context:changed` |
| `SideMenu` | CNX §4.2 [COPIAR] + [MEJORAR] solo declarativo | A | O0 | Consume `siteMap` filtrado |
| `SiteMapModal` | CNX §4.2 [COPIAR] | A, P (versión hamburguesa) | O0 | Buscador con keywords y equivalentes ProCoop |
| `PinnedShortcuts` | CNX §4.2 [COPIAR] | A | O0 | Máx. 12, reordenable con teclado |
| `GlobalSearch` | Nuevo | A | O1 | RF-UXD-057 |
| `AlertCenter` | Nuevo (reemplaza alerta de inicio ProCoop) | A | O0 | Contadores por tipo y enlaces |
| `NotificationBell` / `NotificationInbox` | CNX §6.3 [COPIAR] | A, P | O0 | Todas / No leídas / Leídas / Enviados; deshacer 6 s |
| `AdminStickyHeader` | CNX §4.2 [COPIAR] | A | O0 | Título, subtítulo, breadcrumb, acciones |
| `Breadcrumbs` | Nuevo | A | O0 | Derivado del mapa |
| `ScreenHelp` | CNX §4.2 [COPIAR] | A, P | O0 | 10.1.3 |
| `PlatformShell` | CNX §4.3 [ADAPTAR] | A | O0 | 10.1.6 |
| `AppShell` | CNX §3.3 [COPIAR] | P | O0 | 10.1.4 |
| `PwaTopbar` | CNX §3.3 [COPIAR] | P | O0 | — |
| `PwaTabbar` | CNX §3.3 [COPIAR] | P | O0 | 5 posiciones, `aria-current` |
| `PwaFab` | CNX §3.4 [COPIAR] | P | O0 | `useCreateAction` |
| `PwaMenuSheet` | CNX §3.3 [COPIAR] | P | O0 | Hamburguesa con buscador |
| `PhoneShell` | CNX §3.3 [COPIAR] | P | O0 | 430 px / 28 px |
| `BannerStack` | CNX §3.3 [COPIAR] + prioridades | P | O0 | RN-UXD-051 |
| `SplashScreen` | CNX §3.4 [COPIAR] | P, A | O0 | Logo + color, ≤ 1,2 s |
| `LandingLayout` | Nuevo (guía §8) | L | O2 | 10.1.5 |
| `SpaceSwitcher` | Nuevo (BASE §102.5.2) | P, A | O0 | Socio / empleado / tenant |
| `InstallPrompt` | CNX §3.4 `usePwaInstall` [COPIAR] | P | O0 | Pasos iOS |
| `NoAccessView` | Nuevo | T | O0 | RN-UXD-024 |

#### 10.2.2 Datos y listas

| Componente | Origen | App | Ola | Contrato |
|---|---|---|---|---|
| `DataTable` | CNX §4.6 [MEJORAR] | A | O0 | RF-UXD-082: columnas configurables, orden, filtros, paginación servidor, selección masiva, export XLSX/CSV/PDF, vistas guardadas, totales, fila expandible, densidad, columnas fijas, teclado (flechas por celda opcional), vista en cards bajo 768 px |
| `DataTableToolbar` | Nuevo | A | O0 | Búsqueda, filtros, vistas, exportar, columnas, densidad |
| `SavedViewsMenu` | Nuevo | A | O0 | RN-UXD-054. Opera sobre `dataTableViews` (vistas de grilla, T03); las vistas de reportes son `savedViews` de T10 (CTR-DAT-11) |
| `ExportMenu` | Nuevo (DFA M28) | A | O0 | RN-UXD-044/045 |
| `BulkActionBar` | Nuevo | A | O0 | RF-UXD-108 |
| `FilterBar` / `PwaFilters` | CNX §3.4 [COPIAR] | A, P | O0 | Chips de filtro + pestañas de texto |
| `TabsLine` / `PwaTabs` | CNX §3.4 [COPIAR] | A, P | O0 | Pestañas con línea inferior |
| `ListCard` | CNX §3.5 [COPIAR] | P | O0 | Anatomía fija (10.3.1) |
| `PwaCardExtra` | CNX §3.4 [COPIAR] | P | O0 | Banda de datos extra |
| `SkeletonCard` / `SkeletonTable` | CNX §3.5 [COPIAR] | T | O0 | 3 skeletons |
| `PwaEmptyState` / `EmptyState` | CNX §3.4 [COPIAR] | T | O0 | Ilustración + título comercial + acción |
| `ErrorState` | Nuevo | T | O0 | Mensaje + Reintentar + `requestId` |
| `PullToRefresh` | CNX §3.4 `usePullToRefresh` [COPIAR] | P | O0 | Alternativa: botón "Actualizar" (WCAG 2.5.1) |
| `InfiniteList` | CNX §5.1 [COPIAR] | P | O2 | Paginado de a 10, botón "Cargar más" alternativo |
| `EntityDetailLayout` | Nuevo | A | O0 | Ficha con cabecera, pestañas, panel lateral |
| `KeyValueGrid` | Nuevo | T | O0 | Datos de ficha en pares etiqueta/valor |
| `StatusBadge` | Nuevo | T | O0 | 7.A.8 |
| `Timeline` (auditoría) | Nuevo (BASE §54) | A | O0 | RF-UXD-092 |
| `ActivityFeed` | Nuevo | A, P | O2 | Historial de interacciones del socio (CRM) |
| `Stepper` / `ProgressTracker` | Nuevo | T | O2 | Seguimiento de trámite (solicitud → visita → instalación → activo) |
| `JobProgress` | Nuevo (ARQ-03) | A | O0 | Barra + estado + abandonar + aviso |
| `IntegrationStatus` | Nuevo (BASE §102.5.5) | T | O0 | Pendiente / Confirmado / Fallido / Resultado incierto |

#### 10.2.3 Formularios y entrada

| Componente | Origen | App | Ola | Contrato |
|---|---|---|---|---|
| `FormField` | Nuevo | T | O0 | Label, hint de formato, error inline, `aria-describedby` |
| `FormErrorSummary` | Nuevo (AGR-032) | T | O0 | Resumen con enlaces |
| `TextInput`, `TextArea`, `NumberInput`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch` | Nuevo | T | O0 | Tokens, tamaños, estados |
| `MaskedInput` (DNI, CUIT/CUIL con dígito verificador, CBU con validación, teléfono AR, CP) | Nuevo | T | O0 | Ayuda de formato visible (CNX §3.6) |
| `MoneyInput` / `MoneyDisplay` | Nuevo (guía §5) | T | O0 | RF-UXD-087 |
| `QuantityInput` (con unidad: kWh, m³, unidades) | Nuevo | T | O0 | Precisión por unidad |
| `DateInput`, `DateRange`, `PeriodPicker`, `TimeInput` | Nuevo | T | O0 | RF-UXD-088 |
| `AddressPicker` | Nuevo (BASE §77) | T | O2 | Calle (catálogo T04), altura, piso, depto, localidad, CP, referencias, mapa opcional, coordenadas |
| `MapView` | Nuevo (Leaflet/Google adaptador) | T | O2 | Alternativa textual obligatoria (RN-UXD-056) |
| `EntityPicker` | Nuevo | T | O0 | RF-UXD-090 |
| `AudiencePicker` | CNX §8 [MEJORAR] único | A, P (supervisor) | O2 | Dimensiones: tipo de destinatario, zona/ruta/sector, localidad/barrio, servicio, categoría tarifaria, estado (activo/moroso por instancia/suspendido/baja), ramal/transformador, personas puntuales/lista importada; recorte al alcance; contador de destinatarios |
| `FileUploader` / `PwaFilePicker` | CNX §3.4 [COPIAR] + [MEJORAR] privado | T | O0 | RF-UXD-093 |
| `CameraCapture` | Nuevo | P | O3 | Foto con GPS y hora (campo) |
| `SignaturePad` | Nuevo | P | O3 | RF-UXD-094 |
| `OtpInput` | Nuevo | T | O0 | Pegar, `one-time-code` |
| `RichTextEditor` (restringido) | CNX §4.2 `EmailTemplateRichEditor` [ADAPTAR] | A | O2 | Para muro, plantillas, ayudas |
| `VariableChips` | Nuevo | A | O1 | Inserta `{variable}` en plantillas y diccionario |
| `ColorPicker` con contraste | Nuevo | A | O1 | Muestra ratio y aprueba/advierte |
| `ImageSlotUploader` | Nuevo | A | O1 | Slot de marca con requisitos y preview |
| `DictationButton` | CNX §3.4 `useDictation` [COPIAR] | P | O3 | Observaciones por voz |
| `ExcelImportWizard` | CNX §4.6 [MEJORAR] | A | O0 | 9.8 |
| `QuestionField` (31 tipos) | CNX §7.2 [COPIAR] | P | O2 | Encuestas (T09) |

#### 10.2.4 Feedback y diálogos

| Componente | Origen | App | Ola | Contrato |
|---|---|---|---|---|
| `Modal` (`cx-modal--sm/md/lg/xl`) | CNX §4.2 [COPIAR] | A | O0 | 480/720/960/1180 |
| `PwaModal` (compact/standard/wide, bottom-sheet) | CNX §3.4 [COPIAR] | P | O0 | Teleport, foco, Esc |
| `ConfirmDialog` | CNX §4.6 [MEJORAR] | A | O0 | RN-UXD-047 |
| `ConfirmSheet` | CNX §3.4 [COPIAR] | P | O0 | Ídem en PWA |
| `ToastHost` / `useToast` | CNX §4.6 [MEJORAR] | T | O0 | RF-UXD-084 |
| `InlineAlert` | Nuevo | T | O0 | Tonos semánticos |
| `OfflineBanner` / `PwaOfflinePendingBanner` | CNX §3.4 [COPIAR] + cola única | P | O0 (banner) / O3 (cola) | RF-UXD-095 |
| `PendingSurveysBanner` | CNX §3.4 [COPIAR] | P | O2 | Encuestas obligatorias |
| `SessionTimeoutDialog` | Nuevo (VAR 2280) | T | O1 | Aviso 60 s |
| `ConflictDialog` | Nuevo (DFA `BLOQUEO_FILAS`) | A | O0 | RF-UXD-061 |
| `ApprovalBar` | Nuevo (T11) | A, P | O1 | Aprobar / rechazar con motivo / derivar |
| `AiProposalPanel` / `BiAiDrawer` | CNX §4.2, §4.5 [COPIAR] | A | O1 | Badge "Propuesta de IA", aceptar/editar/descartar |
| `MobilePreview` (`MobileFeedPreview`, `MobileSurveyPreview`, `SocialPostPreviewModal`) | CNX §4.2, §5.4, §7.6 [COPIAR] | A | O1 | Usa marca y diccionario en borrador |
| `EmailPreviewIframe` | CNX §6.4 [COPIAR] | A | O2 | — |
| `Tooltip` / `Popover` / `DropdownMenu` | Nuevo | T | O0 | Accesibles (Esc, foco) |

#### 10.2.5 BI y tableros

| Componente | Origen | App | Ola | Contrato |
|---|---|---|---|---|
| `BiFilterBar` | CNX §4.5 [COPIAR] | A | O1 | Período, universo, fecha de corte (AGR-022) |
| `BiKpiGrid` / `KpiCard` | CNX §4.5 [COPIAR] | A, P (supervisor) | O1 | Fórmula en tooltip, vacío honesto, enlace a registros (BASE §30) |
| `BiMetricBars`, `LineChart`, `BarChart`, `DonutChart`, `Sparkline` | CNX §4.5 [COPIAR] SVG propio | A | O1 | Tabla alternativa (RF-UXD-010) |
| `BiContextPicker` | CNX §4.5 [COPIAR] | A | O11 | Hasta 40 ítems |
| `BiRanking` | CNX §4.5 [COPIAR] | A | O1 | — |
| `ConsumptionChart` | Nuevo (BASE §25 evolución de uso) | P, A | O7 | Historial de consumos con tabla alternativa |

#### 10.2.6 Comunidad (compartidos con T09)

`PostCard`, `PostMedia`, `PostMediaCarousel`, `PostAudioButton`, `PostVideoSheet`, `PostComposerSheet`, `ReactionBar`, `MentionSuggest`, `SharePostSheet`, `NovedadesCarousel`, `MuroStripSection` (CNX §5.4, [COPIAR], O2); `AvisoComposerSheet` (CNX §6.4); `SurveyComposerSheet`, `SurveyUserPreview` (CNX §7.6). Su dominio y reglas están en T09; UXD garantiza que usan tokens, diccionario y accesibilidad.

#### 10.2.7 Utilidades (composables y helpers)

`dict()` / `useDict()`, `formatDate`, `formatMoney`, `formatQuantity`, `useCreateAction`, `usePwaInstall`, `usePullToRefresh`, `usePushSubscribe`, `useNotifBadge`, `useDictation`, `useOfflineQueue` (único), `useBranding`, `useTheme`, `useFeatureFlag`, `useSiteMap`, `useConfirm`, `useToast`, `useDraftAutosave`, `notifKinds`, `statusMaps`, `applyBrandingCssVars`, `applyTenantPwaIdentity`, `applySystemChromeTheme`.

**Total de componentes catalogados (10.2.1–10.2.6): 134** (26 shells y navegación, 27 datos y listas, 34 formularios, 22 feedback y diálogos, 11 BI, 14 comunidad) (contando cada nombre de componente listado; excluye utilidades de 10.2.7).

### 10.3 Reglas UX

#### 10.3.1 Anatomía fija de la card de listado (`ListCard`)

| Zona | Contenido | Regla |
|---|---|---|
| Rail | Barra vertical de 4 px con el tono del estado | Nunca único indicador (hay badge) |
| Ícono de tipo | `AppIcon` del tipo (servicio, comprobante, gestión) | 24 px |
| Título | Nombre principal (ej. "Internet 300 Mb · Cta. 1234") | **Nunca se trunca**; puede ocupar 2+ líneas |
| Badge de estado | `StatusBadge` | Arriba a la derecha |
| Dato principal | Importe, fecha de vencimiento, número de gestión | Destacado (600, mono/tabular si es número) |
| Meta-tags | 2–4 chips (ej. domicilio, período, vencimiento, canal) | Mínimo 5 datos legibles en total sin abrir |
| Chevron | Indica navegable | Toda la card es el objetivo táctil |

#### 10.3.2 Reglas transversales

| Regla | Detalle | Origen |
|---|---|---|
| Alta en modal | PWA: siempre `PwaModal` desde FAB. Admin: modal `md` (simple), `lg`/`xl` (compuesta), alta mínima + ficha (entidad extensa) | CNX §3.5; RN-UXD-028 |
| Edición | Admin: modal para edición puntual; edición en ficha con "Editar" que habilita la sección | Nuevo |
| Skeletons | 3 skeleton cards / 8 filas skeleton en tablas; nunca spinner centrado; refresco con opacidad 0,6 | CNX §3.5 |
| Fecha | `dd-mm-yyyy`, helper central | CNX §3.5 |
| Errores | Inline + resumen; nunca `alert()`; conservar datos | CNX §3.5; AGR-032 |
| Notificaciones | `notifKinds` con fallback por prefijo | CNX §3.5 |
| Flags | Toda mejora riesgosa con flag y bitácora | CNX §3.5 |
| Estados vacíos | Ilustración + título comercial + acción | CNX §3.4 |
| Pestañas | Texto con línea inferior, nunca chips | CNX §3.4 |
| Una tarea principal | Una acción primaria por pantalla en PWA socio | BASE §102.5.6 |
| Solicitud ≠ ejecución | Textos y badges diferenciados | BASE §43.3 |
| Confirmaciones | `ConfirmDialog` para destructivas; escribir identificador para irreversibles económicas | CNX §3.4 |
| Deshacer | 6 s en descartes no económicos | CNX §6.3 |
| IA | Solo propone | CNX §4.2 |
| Importes | Mono/tabular, alineados a la derecha, signo explícito en negativos, moneda | Guía §5 |
| Truncamiento | Solo en celdas de tabla con tooltip y texto completo accesible; nunca en títulos de card ni en importes | CNX §3.5 |
| Paginación | Servidor `?page=&size=`; tamaños 25/50/100 admin; infinito con "Cargar más" en PWA | CNX §2.6 |
| Exportar/Imprimir | En todo listado con permiso | DFA M28 |
| Microcopy | Segunda persona rioplatense ("Ingresá", "Tenés"), oraciones cortas, sin jerga técnica en PWA socio; todo por diccionario | BASE §65 |
| Navegación atrás | La PWA respeta el botón atrás del sistema (cierra modal antes de navegar) | Nuevo |

### 10.4 Login UX

| Paso | Pantalla / componente | Contenido | Reglas |
|---|---|---|---|
| 0 | Resolución de tenant | Subdominio; si no, `dict:login.codigo.label` (Código de cooperativa) con `dict:login.codigo.hint` | Al salir del campo carga marca, fondo y botones SSO (CNX §3.6.1) |
| 1 | Usuario | `dict:login.usuario.label` (Email, DNI o CUIT) + hint "DNI sin puntos" | Error de formato inline |
| 2 | Contraseña | `dict:login.clave.label`, mostrar/ocultar, `dict:login.olvide` | Gestor de contraseñas permitido; bloqueo 5 intentos/15 min (T02) |
| 3 | 2FA | `OtpInput`, `dict:login.2fa.reenviar` con cuenta regresiva, `dict:login.2fa.recordarDispositivo` (No volver a pedir en este dispositivo por 30 días) | WCAG 3.3.8 |
| 4 | Recordarme | `dict:login.recordarme` | `localStorage` vs `sessionStorage` |
| 5 | Selector de tenant/espacio | Lista de cooperativas y espacios | Solo si corresponde |
| 6 | Términos pendientes | Aceptación versionada | Guard |
| 7 | Splash → oferta de instalación → landing por rol | — | RN-UXD-026, RN-UXD-052 |
| Alternativos | SSO (Google, OIDC del tenant), CiDi, registro, recuperar acceso | Botones con marca del proveedor | Recupero siempre genérico |
| Pie | Enlace de ayuda configurable (VAR_PMOVIL 34), enlace a landing, accesibilidad | — | — |

Login y splash siempre en oscuro con `loginBackground` del tenant (si hay) bajo overlay `rgba(0,0,0,.6)` para contraste.

### 10.5 Accesibilidad WCAG 2.2 AA (AGR-032)

| Criterio | Aplicación concreta | RF |
|---|---|---|
| 1.1.1 Contenido no textual | `alt` de logos por diccionario; ilustraciones decorativas `alt=""`; gráficos con tabla | RF-UXD-138, 010 |
| 1.3.1 Información y relaciones | Labels programáticos, encabezados jerárquicos, tablas con `th`/`scope` | RF-UXD-126 |
| 1.3.5 Propósito de entrada | `autocomplete` en nombre, email, teléfono, domicilio, `one-time-code` | RF-UXD-130 |
| 1.4.1 Uso del color | Estado siempre con ícono + texto | RF-UXD-091 |
| 1.4.3 / 1.4.11 Contraste | 4,5:1 / 3:1 con colores del tenant ajustados | RF-UXD-032, 125 |
| 1.4.4 / 1.4.10 / 1.4.12 Texto y reflow | Escala de texto 130 %, reflow 320 px, espaciado de texto sin pérdida | RF-UXD-020, 135 |
| 1.4.13 Contenido en hover/foco | Tooltips descartables con Esc y persistentes | 10.2.4 |
| 2.1.1 / 2.1.2 Teclado | Todo operable; sin trampas salvo modales | RF-UXD-124 |
| 2.2.1 Tiempo ajustable | Aviso de sesión con extensión; toasts de error persistentes | RF-UXD-121, 084 |
| 2.3.3 Animación | Reducción de movimiento | RF-UXD-019 |
| 2.4.1 Saltar bloques | Enlace "Saltar al contenido" en AdminShell, AppShell y landing | Nuevo |
| 2.4.3 / 2.4.7 / 2.4.11 Foco | Orden lógico, visible, no oculto | RF-UXD-124, 133 |
| 2.4.6 Encabezados y etiquetas | H1 único por vista | RF-UXD-017 |
| 2.5.1 / 2.5.7 Gestos y arrastre | Alternativas de un puntero | RF-UXD-128 |
| 2.5.8 Tamaño de objetivo | ≥ 24 px (44 PWA) | RF-UXD-129 |
| 3.1.1 Idioma | `lang="es-AR"` | RF-UXD-137 |
| 3.2.6 Ayuda consistente | Ubicación fija del `?` | RF-UXD-131 |
| 3.3.1 / 3.3.3 Errores | Identificación y sugerencia | RF-UXD-127 |
| 3.3.7 Entrada redundante | Reutilizar datos ya cargados | RF-UXD-132 |
| 3.3.8 Autenticación accesible | Pegar, gestores, sin prueba cognitiva | RF-UXD-130 |
| 4.1.2 / 4.1.3 Nombre, rol, valor; mensajes de estado | Componentes con roles ARIA; `aria-live` | RF-UXD-134 |

Verificación: axe-core en CI sobre el catálogo de componentes y las pantallas de recorridos esenciales (T08); prueba manual con teclado y lectores (NVDA, TalkBack, VoiceOver) por ola; informe con hallazgos y estado; no se publica "conforme" sin informe (AGR-032).

### 10.6 Pantallas propias de UXD

| PAN-ID | App | Ruta | Capability | Propósito | Layout | Contenido y acciones | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|---|
| PAN-UXD-01 | admin | `/configuracion/experiencia/marca` | `uxd.marca.ver` (editar/publicar por acción) | Editar y publicar la marca | Página + panel de previsualización | Pestañas: Identidad (nombre, nombre corto, remitentes), Colores (3 pickers con contraste), Recursos por canal (slots 7.B.2), Sucursales, Login y splash, Tema (política), Previsualización (admin, PWA socio/empleado/campo, login, splash, landing, ícono instalado, email, PDF), Versiones (historial y revertir). Acciones: Guardar borrador, Descartar, Publicar, Revertir. Vacío: no aplica (siempre hay publicada). Ayuda: CU-MAR-01 | Configuración > Procoop WEB (logos `WEB_Logos_Facturas`); VAR 518/709/2264/2812 |
| PAN-UXD-02 | admin | `/configuracion/experiencia/diccionario` | `uxd.diccionario.ver` | Editar y publicar el diccionario | `DataTable` + panel lateral de edición | Filtros: texto, módulo, tipo (término/etiqueta/mensaje/ayuda), canal, pantalla, "solo personalizadas", "con advertencias", "protegidas". Columnas: clave, texto base, texto del tenant, canal, estado (borrador/publicado), advertencias, última modificación. Panel: singular/plural/título/corta/género, por canal, variables (chips), dónde se usa, previsualización en contexto, historial. Acciones: Publicar (con nota), Revertir, Exportar XLSX/JSON, Importar (wizard), Aplicar plantilla, Mostrar claves | VAR_PMOVIL 5–9, 34, 35, 65; VAR 3157 |
| PAN-UXD-03 | admin | `/configuracion/experiencia/diccionario/publicaciones` | `uxd.diccionario.ver` | Historial de releases | `DataTable` | Columnas: release, fecha, autor, cambios, nota, revertida de. Acciones: ver diferencias, revertir | — |
| PAN-UXD-04 | admin | modal global | autenticado | Mapa del sitio | `SiteMapModal` xl | Buscador, clusters/grupos/ítems, fijar, "No contratado" (admin) | Cinta de 9 pestañas (REL §1) |
| PAN-UXD-05 | admin | `/configuracion/experiencia/navegacion` | `uxd.navegacion.configurar` | Navegación de la PWA por rol y accesos sugeridos del admin por rol | Página con pestañas por rol | Slots de tabbar, FAB por defecto, accesos rápidos de Inicio, ítems ocultos, fijados sugeridos del admin | CNX "Menú de la app", "Accesos rápidos" |
| PAN-UXD-06 | admin | `/configuracion/experiencia/ayudas` | `uxd.ayuda.editar` | Sobrescribir ayudas contextuales | `DataTable` + modal lg | Por `screenId`: 6 preguntas + caso de uso; diferencias con base | CNX `ScreenHelp`, "Ayuda/FAQ" |
| PAN-UXD-07 | admin | `/configuracion/experiencia/flags` | `uxd.flags.configurar` | Flags de UI del tenant | `DataTable` | Flag, descripción, estado, motivo, historial | CNX flags de apagado |
| PAN-UXD-08 | PWA socio y admin (menú avatar; antes "admin y PWA") | `/app/perfil/apariencia` (PWA; ruta de M19 PAN-POR-62, AL-04; antes `/perfil/preferencias`) y menú avatar (admin) | autenticado | Preferencias del usuario | Modal md (admin) / vista (PWA) | Tema, densidad, tamaño de texto, reducir movimiento, modo de feed, instalar app, notificaciones (enlace T09) | — |
| PAN-UXD-09 | plataforma | `/plataforma/experiencia/diccionario-base` | `uxd.plataforma.diccionarioBase.ver` (antes `plt.uxd.diccionarioBase.ver`) | Catálogo de claves del producto, plantillas de diccionario y claves faltantes de todos los tenants | `DataTable` | Claves, descripciones, protegidas, deprecadas, plantillas (eléctrica, agua, telefónica, multiservicio), reporte de faltantes | — |
| PAN-UXD-10 | plataforma | `/plataforma/experiencia/design-system` | `uxd.plataforma.tokens.ver` (antes `plt.uxd.tokens.ver`) | Catálogo vivo de componentes y tokens | Página | Componentes con estados, tokens, prueba de contraste con colores arbitrarios | — |
| PAN-UXD-11 | plataforma | `/plataforma/experiencia/flags` | `uxd.plataforma.flags.configurar` (antes `plt.uxd.flags.configurar`) | Flags globales | `DataTable` | Ídem PAN-UXD-07 a nivel plataforma | — |
| PAN-UXD-12 | todas | `/sin-acceso` | autenticado (todo usuario con sesión; se muestra al denegar una ruta, RN-UXD-024; antes "—") | Sin permiso | `NoAccessView` | `dict:ui.sinPermiso.titulo`, volver | — |
| PAN-UXD-13 | todas | `/login` y subrutas | público | Login | Login oscuro con marca | 10.4 | Login de ProCoop/CoopOnline |
| PAN-UXD-14 | landing (y PWA instalada; antes "PWA") | `/instalar` | público | Guía de instalación | Vista | Pasos por plataforma (Android, iOS, escritorio) | — |
| PAN-UXD-15 | PWA socio y empleado | `/app/asistente` (topbar, ícono del asistente) | `por.asistente.ver` (socio) / `wfl.asistente.ver` (empleado); visible solo con flag `pwa.asistente`, apagado por defecto y habilitable en O11 (PA-UXD-16, DEC-072) | Asistente IA de la PWA (ítems SM-PWS-041 y SM-PWE-017). RF-UXD-064 (asistente IA opcional del `AppShell`); ola O0 (PRO-O0-15) oculta por flag, habilitable en O11 | Vista de conversación en `.pwa-mod` | Pregunta libre, sugerencias por contexto, respuestas con enlaces a pantallas permitidas del rol; nunca ejecuta acciones; motor y auditoría en T06 y T02 | — |
| PAN-UXD-16 | PWA empleado | `/app/empleado/directorio` | `iam.directorio.ver` (registrada en T02 §4.4.2; antes "pendiente de alta en T02") | Directorio interno (ítem SM-PWE-015). RF-UXD-063 (espacio del empleado de la PWA); ola O0 (PRO-O0-15) con la vista, datos de M16 desde O2 (SM-PWE-015) | Lista con buscador | Nombre, puesto, sector y sucursal (T02, M16, T04 `branches`); contacto interno; sin datos personales sensibles | — |
| PAN-UXD-17 | admin | `/admin/inicio/alertas` | `bia.tableros.ver` | Alertas activas (ítem SM-ADM-003). RF-UXD-055 (centro de alertas); ola O0 (PRO-O0-15); las alertas de cada módulo llegan con su ola | `DataTable` | Alertas activas de BIA-14, FIS-09 y NFR-07 por severidad, origen y antigüedad; ir al origen; marcar como vista (no cierra la alerta en el módulo dueño) | — |

### 10.7 Catálogo base del diccionario (inventario inicial O0)

Inventario inicial que resuelve el pendiente BASE §65.9 "Inventario inicial de conceptos y etiquetas editables". Cada módulo agrega sus claves de pantalla en su anexo con el prefijo de su código; las de esta sección son las **transversales y los términos de negocio** que todas las pantallas referencian. Las claves de navegación (`nav.*`) se listan en 10.8 junto a cada ítem. Formato del texto base: `singular / plural (género)` para términos.

#### 10.7.1 Términos de negocio (`kind: term`)

| Clave | Texto base | Descripción (significado) | No equivalente a | Ejemplo TEN-001 / TEN-002 |
|---|---|---|---|---|
| `per.persona` | Persona / Personas (f) | Persona humana o jurídica registrada | `per.titular`, `per.asociado` | — |
| `per.asociado` | Asociado / Asociados (m) | Relación institucional con la cooperativa (capital, padrón) | `per.titular`, `per.usuarioRegistrado` | Socio·Socios / Asociado·Asociados (BASE §65.5) |
| `per.titular` | Titular / Titulares (m) | Responsable de pago de un contrato, identificado por DNI/CUIT (BASE §83) | `per.asociado` | — |
| `per.usuarioRegistrado` | Usuario registrado / Usuarios registrados (m) | Persona con acceso al portal sin relación de negocio | `per.asociado`, `per.titular` | — |
| `per.autorizado` | Autorizado / Autorizados (m) | Persona habilitada por un titular para gestionar sus cuentas | `per.titular` | Representante |
| `per.adherente` | Adherente / Adherentes (m) | Integrante del grupo familiar en servicios sociales | `per.titular` | — |
| `per.cuenta` | Cuenta / Cuentas (f) | Agrupador comercial del titular (ProCoop "Cuenta") | `per.contrato`, `per.suministro` | — |
| `per.contrato` | Servicio contratado / Servicios contratados (m) | Contratación de un servicio por un titular | `per.cuenta`, `per.suministro` | Conexión |
| `per.suministro` | Suministro / Suministros (m) | Punto físico de prestación (medidor, conexión) | `per.cuenta`, `per.contrato` | — |
| `per.inmueble` | Inmueble / Inmuebles (m) | Bien donde se presta el servicio | — | Propiedad |
| `per.domicilio` | Domicilio / Domicilios (m) | Dirección postal o de servicio | — | — |
| `per.grupoFacturacion` | Grupo de facturación / Grupos de facturación (m) | Conjunto de servicios emitidos en un mismo comprobante (BASE §103) | `fac.resumenCuenta` | — |
| `org.sucursal` | Sucursal / Sucursales (f) | Unidad territorial o agencia | — | Agencia |
| `org.zona` | Zona / Zonas (f) | Zona de facturación o recorrido | — | Sector |
| `org.area` | Área / Áreas (f) | Unidad interna responsable | — | Área / Sector (BASE §65.5) |
| `org.entidadJuridica` | Entidad / Entidades (f) | Entidad jurídica del tenant (cooperativa, mutual u otra) que emite, contrata, emplea o asocia (`legalEntities` de T04; DEC-064, DEC-096). Etiqueta de filtros y columnas "Entidad" en M01, M15, M17, T02 y T10 (10.9.14) | `org.sucursal` | Cooperativa / Mutual |
| `cat.servicio` | Servicio / Servicios (m) | Prestación del catálogo (Energía, Agua, Internet) | `per.contrato` | Prestación |
| `cat.plan` | Plan / Planes (m) | Variante comercial de un servicio | — | — |
| `cat.producto` | Producto / Productos (m) | Producto o subservicio facturable | — | — |
| `cat.categoria` | Categoría / Categorías (f) | Categoría tarifaria | — | — |
| `med.medidor` | Medidor / Medidores (m) | Equipo de medición | — | Contador |
| `med.lectura` | Lectura / Lecturas (f) | Registro de un medidor en una fecha | `med.consumo` | — |
| `med.consumo` | Consumo / Consumos (m) | Diferencia entre lecturas o cantidad facturable | `med.lectura` | — |
| `med.ruta` | Ruta de lectura / Rutas de lectura (f) | Recorrido asignado a lecturista | — | Recorrido |
| `tar.cuadro` | Cuadro tarifario / Cuadros tarifarios (m) | Conjunto de precios vigentes | — | — |
| `tar.concepto` | Concepto / Conceptos (m) | Ítem facturable | — | — |
| `fac.factura` | Factura / Facturas (f) | Comprobante fiscal emitido | `fac.resumenCuenta` | — |
| `fac.comprobante` | Comprobante / Comprobantes (m) | Documento comercial genérico | — | — |
| `fac.notaCredito` | Nota de crédito / Notas de crédito (f) | Comprobante que reduce deuda | — | Protegido en documentos fiscales |
| `fac.notaDebito` | Nota de débito / Notas de débito (f) | Comprobante que aumenta deuda | — | Protegido en documentos fiscales |
| `fac.resumenCuenta` | Resumen de cuenta / Resúmenes de cuenta (m) | Presentación de obligaciones existentes | `fac.factura` | Resumen de cuenta / Estado de cuenta (BASE §65.5) |
| `fac.lote` | Lote de facturación / Lotes de facturación (m) | Proceso batch de emisión | — | — |
| `fac.ciclo` | Ciclo de facturación / Ciclos de facturación (m) | Calendario y universo de un servicio | — | Período |
| `fac.vencimiento` | Vencimiento / Vencimientos (m) | Fecha límite de pago | — | — |
| `cob.pago` | Pago / Pagos (m) | Ingreso de dinero del socio | — | Cobro |
| `cob.recibo` | Recibo / Recibos (m) | Constancia de cobro | — | — |
| `cob.caja` | Caja / Cajas (f) | Puesto de cobro con apertura y cierre | — | — |
| `cob.ente` | Ente recaudador / Entes recaudadores (m) | Red o entidad externa de cobro | — | Entidad de cobro |
| `cob.debito` | Débito automático / Débitos automáticos (m) | Adhesión de cobro automático | — | — |
| `cob.saldoFavor` | Saldo a favor / Saldos a favor (m) | Crédito del socio | — | — |
| `mor.deuda` | Deuda / Deudas (f) | Saldo vencido | — | — |
| `mor.instancia` | Instancia de mora / Instancias de mora (f) | Etapa del circuito de mora | — | Aviso |
| `mor.suspension` | Suspensión / Suspensiones (f) | Interrupción temporal del servicio | `mor.baja` | — |
| `mor.corte` | Corte / Cortes (m) | Ejecución física de la interrupción | `mor.baja` | — |
| `mor.reconexion` | Reconexión / Reconexiones (f) | Restitución del servicio | — | Rehabilitación |
| `mor.baja` | Baja definitiva / Bajas definitivas (f) | Fin del contrato | `mor.suspension`, `mor.corte` | — |
| `mor.planPago` | Plan de pagos / Planes de pagos (m) | Financiación de deuda | — | Convenio |
| `crm.caso` | Gestión / Gestiones (f) | Caso presentado para atención | — | Gestión / Solicitud (BASE §65.5) |
| `crm.casoRef` | Ticket / Tickets (m) | Referencia para seguir una gestión | — | Ticket / Número de gestión (BASE §65.5) |
| `crm.reclamo` | Reclamo / Reclamos (m) | Caso por falla o disconformidad | `crm.solicitud` | — |
| `crm.solicitud` | Solicitud / Solicitudes (f) | Pedido comercial (alta, baja, cambio) | `crm.reclamo` | Trámite |
| `crm.turno` | Turno / Turnos (m) | Atención presencial programada | — | — |
| `crm.expediente` | Expediente / Expedientes (m) | Mesa de entradas | — | — |
| `crm.incidente` | Incidente / Incidentes (m) | Incidente de mesa de entradas (reemplaza VAR 3157) | — | — |
| `tec.orden` | Orden de trabajo / Órdenes de trabajo (f) | Actuación técnica asignada | — | Orden de trabajo / Orden de servicio (BASE §65.5) |
| `tec.visita` | Visita / Visitas (f) | Turno técnico en domicilio | — | — |
| `tec.factibilidad` | Factibilidad / Factibilidades (f) | Evaluación técnica previa | — | — |
| `tec.cuadrilla` | Cuadrilla / Cuadrillas (f) | Equipo técnico | — | — |
| `tec.instalacion` | Instalación / Instalaciones (f) | Puesta en servicio | — | Conexión |
| `ven.presupuesto` | Presupuesto / Presupuestos (m) | Cotización a cliente | — | — |
| `cmp.supplier` | Proveedor / Proveedores (m) | Rol de una persona de M01 que vende bienes o servicios (M12 §3, DEC-097). Antes `cmp.proveedor`, renombrada a la clave que usan los anexos (`dict:cmp.supplier` de M12; `cmp.proveedor` queda con `renamedTo = cmp.supplier`, RN-UXD-012; 10-11-2026). | — | — |
| `cmp.ordenCompra` | Orden de compra / Órdenes de compra (f) | — | — | — |
| `stk.articulo` | Artículo / Artículos (m) | Material o producto de stock | — | Material |
| `stk.deposito` | Depósito / Depósitos (m) | — | — | Almacén |
| `stk.equipo` | Equipo / Equipos (m) | Bien serializado (ej. ONU en comodato) | — | — |
| `tes.cuentaBancaria` | Cuenta bancaria / Cuentas bancarias (f) | — | `per.cuenta` | — |
| `tes.cheque` | Cheque / Cheques (m) | — | — | — |
| `con.asiento` | Asiento / Asientos (m) | — | — | — |
| `con.cuentaContable` | Cuenta contable / Cuentas contables (f) | — | `per.cuenta` | — |
| `con.centroCosto` | Centro de costo / Centros de costo (m) | — | — | — |
| `sue.empleado` | Empleado / Empleados (m) | — | — | Colaborador |
| `sue.reciboSueldo` | Recibo de sueldo / Recibos de sueldo (m) | — | `cob.recibo` | — |
| `ins.asamblea` | Asamblea / Asambleas (f) | — | — | — |
| `ins.consejo` | Consejo de administración (m) | — | — | — |
| `ins.capital` | Capital social (m) | — | — | Cuotas sociales |
| `soc.beneficiario` | Beneficiario / Beneficiarios (m) | Servicios sociales | — | — |
| `com.publicacion` | Publicación / Publicaciones (f) | Pieza del muro | — | Noticia |
| `com.novedad` | Boletín / Boletines (m) | Newsletter | — | Revista |
| `com.encuesta` | Encuesta / Encuestas (f) | — | — | — |
| `com.aviso` | Aviso / Avisos (m) | Notificación in-app | — | Notificación |

#### 10.7.2 Interfaz común (`ui.*`, `kind: label`)

| Clave | Texto base | Clave | Texto base |
|---|---|---|---|
| `ui.accion.guardar` | Guardar | `ui.accion.cancelar` | Cancelar |
| `ui.accion.crear` | Crear {t:objeto.one} (concordancia `{g:objeto\|Nuevo\|Nueva}`) | `ui.accion.editar` | Editar |
| `ui.accion.eliminar` | Eliminar | `ui.accion.anular` | Anular |
| `ui.accion.aprobar` | Aprobar | `ui.accion.rechazar` | Rechazar |
| `ui.accion.exportar` | Exportar | `ui.accion.imprimir` | Imprimir |
| `ui.accion.importar` | Importar desde Excel | `ui.accion.buscar` | Buscar |
| `ui.accion.filtrar` | Filtrar | `ui.accion.limpiarFiltros` | Limpiar filtros |
| `ui.accion.reintentar` | Reintentar | `ui.accion.deshacer` | Deshacer |
| `ui.accion.volver` | Volver | `ui.accion.cerrar` | Cerrar |
| `ui.accion.continuar` | Continuar | `ui.accion.confirmar` | Confirmar |
| `ui.accion.publicar` | Publicar | `ui.accion.revertir` | Revertir |
| `ui.accion.verDetalle` | Ver detalle | `ui.accion.descargar` | Descargar |
| `ui.mapaSitio.titulo` | Mapa del sitio | `ui.mapaSitio.buscar` | Buscá una pantalla |
| `ui.mapaSitio.noContratado` | No contratado | `ui.fijados.titulo` | Accesos fijados |
| `ui.fijar` / `ui.desfijar` | Fijar / Quitar de fijados | `ui.buscador.placeholder` | Buscar pantallas, {t:per.titular.other}, comprobantes… |
| `ui.ayuda.titulo` | Ayuda de esta pantalla | `ui.ayuda.que` … `ui.ayuda.como` | Qué es / Quién lo usa / Cuándo / Dónde / Por qué / Cómo |
| `ui.ayuda.casoUso` | Caso de uso | `ui.ayuda.teSirvio` | ¿Te sirvió esta ayuda? |
| `ui.tabla.columnas` | Columnas | `ui.tabla.vistaGuardada` | Vista guardada |
| `ui.tabla.guardarVista` | Guardar vista | `ui.tabla.seleccionados` | {count, plural, one {# seleccionado} other {# seleccionados}} |
| `ui.tabla.total` | Total | `ui.tabla.densidad` | Densidad |
| `ui.paginacion.resumen` | {desde}–{hasta} de {total} | `ui.cargarMas` | Cargar más |
| `ui.vacio.titulo` | Todavía no hay nada por acá | `ui.vacio.filtros` | No hay resultados con estos filtros |
| `ui.error.carga` | No pudimos cargar la información | `ui.soloLectura` | Solo lectura |
| `ui.sinPermiso.titulo` | No tenés acceso a esta pantalla | `ui.sinPermiso.texto` | Si creés que es un error, consultá con el administrador de tu cooperativa |
| `ui.borrador.recuperar` | Tenés un borrador sin terminar. ¿Querés recuperarlo? | `ui.cambiosSinGuardar` | Tenés cambios sin guardar. ¿Querés salir igual? |
| `ui.conflicto.titulo` | Otra persona modificó este registro | `ui.sesion.porExpirar` | Tu sesión va a cerrarse en {segundos} segundos |
| `ui.ia.propuesta` | Propuesta de IA | `ui.ia.revisar` | Revisá antes de confirmar |
| `ui.tema.titulo` | Tema | `ui.tema.oscuro` / `ui.tema.claro` / `ui.tema.sistema` | Oscuro / Claro / Usar el del dispositivo |
| `ui.densidad.comoda` / `ui.densidad.compacta` | Cómoda / Compacta | `ui.textoTamano` | Tamaño del texto |
| `ui.reducirMovimiento` | Reducir animaciones | `ui.saltarContenido` | Saltar al contenido |
| `ui.offline.banner` | Sin conexión. {count, plural, one {# envío pendiente} other {# envíos pendientes}} | `ui.offline.reintentar` | Reintentar ahora |
| `ui.instalar.titulo` | Instalá la app de {marca} | `ui.instalar.ios` | Tocá Compartir y luego "Agregar a inicio" |
| `ui.fab.aria` | Crear | `ui.perfil.tab` | Perfil |
| `ui.grafico.verTabla` | Ver como tabla | `ui.textoNoDisponible` | Texto no disponible |
| `ui.espacio.socio` / `ui.espacio.empleado` | Mi cooperativa / Mi trabajo | `ui.cerrarSesion` / `ui.cerrarTodas` | Cerrar sesión / Cerrar sesión en todos los dispositivos |
| `ui.export.nombreArchivo` | {marcaCorta}-{pantalla}-{fecha} (no visible) | `ui.importar.paso1` / `paso2` / `paso3` | Subí el archivo / Revisá los datos / Confirmá la importación |
| `ui.importar.resumen` | {validas} filas válidas, {errores} con errores | `ui.job.enCurso` | Procesando… podés seguir trabajando; te avisamos al terminar |
| `ui.confirmar.escribir` | Para confirmar, escribí {identificador} | `ui.alertas.titulo` | Alertas |
| `ui.avisos.titulo` | Avisos | `ui.avisos.todas` / `noLeidas` / `leidas` / `enviados` | Todas / No leídas / Leídas / Enviados |

#### 10.7.3 Estados (`estado.*`, `kind: state`)

| Clave | Texto base | Tono |
|---|---|---|
| `estado.servicio.solicitado` | Solicitado | `warn` |
| `estado.servicio.pendienteInstalacion` | Pendiente de instalación | `info` |
| `estado.servicio.activo` | Activo | `ok` |
| `estado.servicio.suspendido` | Suspendido | `bad` (no equivalente a `baja`) |
| `estado.servicio.cortado` | Cortado | `bad` |
| `estado.servicio.baja` | Dado de baja | `neutral` |
| `estado.solicitud.recibida` | Solicitud recibida | `info` |
| `estado.solicitud.enRevision` | En revisión | `warn` |
| `estado.solicitud.requiereDatos` | Faltan datos | `warn` |
| `estado.solicitud.aprobada` | Aprobada | `ok` |
| `estado.solicitud.rechazada` | Rechazada | `bad` |
| `estado.solicitud.cancelada` | Cancelada | `neutral` |
| `estado.solicitud.finalizada` | Finalizada | `ok` |
| `estado.factura.emitida` | Emitida | `info` |
| `estado.factura.porVencer` | Vence el {fecha} | `warn` |
| `estado.factura.vencida` | Vencida | `bad` |
| `estado.factura.pagada` | Pagada | `ok` |
| `estado.factura.parcial` | Pago parcial | `warn` |
| `estado.factura.anulada` | Anulada | `neutral` |
| `estado.pago.enProceso` | Pago en proceso | `info` |
| `estado.pago.confirmado` | Pago confirmado | `ok` |
| `estado.pago.rechazado` | Pago rechazado | `bad` |
| `estado.pago.incierto` | Estamos verificando tu pago | `warn` |
| `estado.pagoWeb.generado` | Generado (ProCoop `ESTADO_VENTA` 0) | `info` |
| `estado.pagoWeb.pagado` | Pagado (1) | `ok` |
| `estado.pagoWeb.registrado` | Registrado (2) | `ok` |
| `estado.pagoWeb.enviado` | Comprobante enviado (3) | `ok` |
| `estado.tramiteWeb.cargado` / `aceptado` / `rechazado` / `cancelado` | Cargado / Aceptado / Rechazado / Cancelado (RN-10 §3.5) | `info` / `ok` / `bad` / `neutral` |
| `estado.orden.programada` | Programada | `info` |
| `estado.orden.enCamino` | Técnico en camino | `info` |
| `estado.orden.enCurso` | En curso | `info` |
| `estado.orden.finalizada` | Finalizada | `ok` |
| `estado.orden.reprogramada` | Reprogramada | `warn` |
| `estado.integracion.pendiente` / `confirmado` / `fallido` / `incierto` | Pendiente / Confirmado / Falló / Resultado incierto | `warn` / `ok` / `bad` / `warn` |
| `estado.sync.pendiente` / `enviando` / `confirmado` / `error` / `rechazado` | Pendiente / Enviando / Enviado / Error, reintentaremos / Rechazado | 8.5 |
| `estado.config.borrador` / `publicado` | Borrador / Publicado | `neutral` / `ok` |

#### 10.7.4 Errores (`err.*`, `kind: error`)

| Clave | Texto base | Origen |
|---|---|---|
| `err.generico` | Algo salió mal. Probá de nuevo en unos minutos. Código: {requestId} | CNX §2.6 |
| `err.red` | No hay conexión. Revisá tu red | — |
| `err.sesionExpirada` | Tu sesión expiró. Ingresá de nuevo | — |
| `err.sinPermiso` | No tenés permiso para hacer esto | BASE §45 |
| `err.conflicto` | Otra persona modificó este registro. Revisá los cambios | DFA `BLOQUEO_FILAS` |
| `err.campoObligatorio` | Completá {campo} | — |
| `err.formato.dni` | Ingresá el DNI sin puntos (7 u 8 números) | CNX §3.6 |
| `err.formato.cuit` | El CUIT no es válido. Revisá el último número | — |
| `err.formato.cbu` | El CBU debe tener 22 números | — |
| `err.formato.email` | Ingresá un email válido | — |
| `err.formato.fecha` | Usá el formato dd-mm-aaaa | — |
| `err.archivo.tamano` | El archivo supera {max} MB | — |
| `err.archivo.tipo` | Este tipo de archivo no está permitido. Permitidos: {tipos} | — |
| `err.login.credenciales` | El usuario o la contraseña no son correctos | CNX §2.5 |
| `err.login.bloqueado` | Por seguridad bloqueamos el acceso por {minutos} minutos | CNX §2.5 |
| `err.pago.rechazadoEntidad` | El pago fue rechazado por la entidad | RN-10 §3.3 |
| `err.pago.importesNoCoinciden` | Los importes no coinciden con la deuda actual. Actualizá y volvé a intentar | RN-10 §3.4 |
| `err.pago.importeMinimo` | El importe mínimo para pagar en línea es {importe} | RN-10 §3.3 (parámetro 904) |
| `err.pago.cuentaBloqueada` | Esta cuenta no admite pagos en línea. Comunicate con {marca} | RN-10 §3.3 (`BLOQUEAR_FAC_WEB`) |
| `err.tramite.documentoNoCoincide` | El documento del {t:per.titular.one} no coincide con el registrado en CiDi | RN-10 §3.5 |
| `err.tramite.servicioNoAdmite` | El {t:cat.servicio.one} seleccionado no admite este trámite | RN-10 §3.5 (DDJJ solo energía) |
| `err.vinculo.cuentaAjena` | No pudimos verificar que esta cuenta sea tuya. Iniciá la acreditación | BASE CU-25 |
| `err.diccionario.protegido` | Este texto está protegido y no se puede modificar | BASE §65.3 |
| `err.diccionario.ambiguo` | Este texto ya se usa para {otroConcepto}; elegí otro para no confundir | BASE §65.3 |
| `err.diccionario.largo` | Máximo {max} caracteres | AGR-032 |
| `err.diccionario.variable` | Falta la variable {variable} o usaste una no permitida | BASE §65.6 |

#### 10.7.5 Login (`login.*`)

`login.titulo` (Ingresá a {marca}), `login.codigo.label` (Código de cooperativa), `login.codigo.hint` (Lo encontrás en tu factura o en la web de tu cooperativa), `login.usuario.label` (Email, DNI o CUIT), `login.usuario.hint` (DNI o CUIT sin puntos ni guiones), `login.clave.label` (Contraseña), `login.clave.mostrar` (Mostrar contraseña), `login.olvide` (Olvidé mi contraseña), `login.recordarme` (Recordarme en este dispositivo), `login.ingresar` (Ingresar), `login.sso.con` (Ingresar con {proveedor}), `login.cidi` (Ingresar con CiDi), `login.registrarme` (Crear mi cuenta), `login.2fa.titulo` (Ingresá el código que te enviamos a {destino}), `login.2fa.reenviar` (Reenviar código {segundos}), `login.2fa.recordarDispositivo` (No volver a pedir en este dispositivo por 30 días), `login.recupero.enviado` (Si los datos son correctos, te enviamos un email con los pasos — texto genérico protegido por seguridad), `login.elegirCooperativa` (¿A qué cooperativa querés ingresar?), `login.elegirEspacio` (¿Cómo querés ingresar?), `login.enlaceAyuda.texto` (¿Necesitás ayuda?) y `login.enlaceAyuda.url` (dato del tenant, reemplaza VAR_PMOVIL 34), `login.terminos.aceptar` (Leí y acepto los términos y condiciones).

#### 10.7.6 Portal y app del socio (`por.*`, incluye reemplazos de CoopOnline)

| Clave | Texto base | Reemplaza |
|---|---|---|
| `por.misServicios.titulo` | Mis servicios | — (BASE §102.5.6) |
| `por.misFacturas.titulo` | Mis facturas y pagos | — |
| `por.misGestiones.titulo` | Mis gestiones | — |
| `por.noticias.titulo` | Noticias | — |
| `por.cuenta.resumen` | Mi resumen | BASE §65.6 `socio.cuenta.resumen` (TEN-002: Mi estado de cuenta) |
| `por.agregarCuenta.boton` | Agregar cuenta | VAR_PMOVIL 5 |
| `por.agregarCuenta.titulo` | Vinculá una cuenta | VAR_PMOVIL 6 |
| `por.agregarCuenta.codigoSocio` | Número de {t:per.asociado.one} | VAR_PMOVIL 7 |
| `por.agregarCuenta.clave` | Clave o número de {t:per.suministro.one} | VAR_PMOVIL 8 |
| `por.agregarCuenta.observacion` | Los encontrás en tu factura | VAR_PMOVIL 9 |
| `por.facturas.observacion` | (vacío por defecto; texto informativo bajo la lista de facturas) | VAR_PMOVIL 35 |
| `por.cabecera.texto` | (vacío por defecto; bloque informativo superior del portal) | VAR_PMOVIL 65 |
| `por.pagar.boton` | Pagar {importe} | — |
| `por.pagar.porQue` | ¿Por qué pago esto? | BASE §25 |
| `por.deuda.total` | Debés {importe} | — |
| `por.deuda.alDia` | Estás al día | — |
| `por.proximoVencimiento` | Próximo vencimiento: {fecha} | — |
| `por.contratar.boton` | Contratar {t:cat.servicio.one} | BASE §43.8 |
| `por.baja.boton` | Solicitar baja | BASE §43.8, §53 |
| `por.suspension.boton` | Solicitar suspensión temporal | BASE §25 |
| `por.reactivar.boton` | Reactivar | BASE §25 |
| `por.estadoReal.ayuda` | Te mostramos el estado de tu trámite y el de tu servicio por separado | BASE §102.5.6 |
| `por.instaladorEnCamino` | {nombre} está en camino. Llega aprox. a las {hora} | BASE §25 |
| `por.firmaConformidad` | Firmá la conformidad de la instalación | BASE §25, §73 |
| `por.banner.completarRegistro` | Completá tus datos para contratar servicios | 8.4 |
| `por.banner.validacionPendiente` | Estamos validando tus datos | 8.4 |
| `por.banner.deudaVencida` | Tenés {importe} vencido. Pagá ahora para evitar la suspensión | 8.4 |
| `por.banner.servicioSuspendido` | Tu {t:cat.servicio.one} {servicio} está suspendido | 8.4 |
| `por.banner.cuentaBaja` | Esta cuenta está dada de baja. Podés consultar tus documentos | 8.4 |
| `por.banner.corteProgramado` | Corte programado en tu zona el {fecha} de {desde} a {hasta} | CNX §5.6 |
| `por.misGestiones.vacio.titulo` | Todavía no iniciaste gestiones | CNX §3.4 |
| `por.misServicios.vacio.titulo` | Todavía no tenés servicios. Conocé lo que ofrece {marca} | — |

#### 10.7.7 Landing (`lnd.*`), marca y diccionario (`uxd.*`), plataforma (`plt.*`), BI (`bia.*`)

`lnd.hero.titulo` (Servicios de tu cooperativa, en un solo lugar), `lnd.hero.texto` (Consultá nuestros servicios e ingresá para gestionar los tuyos.), `lnd.acceso.app` (Ingresar a la app de socios), `lnd.pagar` (Pagar sin ingresar), `lnd.consultarDeuda` (Consultar deuda), `lnd.servicios.titulo` (Nuestros servicios), `lnd.servicio.consultar` (Consultar), `lnd.servicio.contratar` (Contratar), `lnd.noticias.titulo` (Novedades), `lnd.reclamo` (Hacer un reclamo), `lnd.turno` (Sacar turno), `lnd.baja` (Solicitar la baja de un servicio), `lnd.contacto.titulo` (Contacto), `lnd.legales` (Términos y privacidad), `lnd.registrarme` (Crear mi cuenta) · `uxd.marca.titulo` (Marca e identidad), `uxd.diccionario.titulo` (Diccionario de términos), `uxd.termino.plural` (Términos), `uxd.etiqueta.plural` (Etiquetas), `uxd.recurso.plural` (Recursos de marca), `uxd.splash.titulo` (Pantalla de inicio), `uxd.publicacion.titulo` (Publicación), `uxd.protegido.badge` (Protegido), `uxd.logo.alt` (Logo de {marca}), `uxd.contraste.advertencia` (Este color tiene poco contraste; usaremos una variante más legible para textos), `uxd.dondeSeUsa` (Dónde se usa), `uxd.app.socio` ({marcaCorta}), `uxd.app.empleado` ({marcaCorta} Equipo), `uxd.app.campo` ({marcaCorta} Campo), `uxd.canal.admin` … `uxd.canal.push` (nombres de los 12 canales) · `plt.banda` (Plataforma CoopApps), `plt.accesoTemporal` (Acceso temporal a {tenant}: quedan {minutos} min) · `bia.vacio.honesto` (No hay datos suficientes para este indicador en el período elegido), `bia.formula` (Cómo se calcula).

**Conteo del inventario base de 10.7** (sin `nav.*`): 79 términos + 108 claves de interfaz común (contando cada sufijo agrupado) + 47 estados + 26 errores + 22 de login + 32 de portal + 45 de landing/UXD/plataforma/BI (contando los 12 canales como claves individuales) = **359 claves**. Las claves `nav.*` del mapa del sitio (10.8) se suman aparte.

### 10.8 Mapa del sitio completo

Convenciones de las tablas:

- **ID** estable `SM-<APP>-NNN` (`ADM` admin, `PWS` PWA socio, `PWE` PWA empleado, `PWC` PWA campo, `LND` landing, `PLT` plataforma).
- **Clave de etiqueta**: `nav.item.<capability sin la acción>` (ej. ítem con capability `per.titulares.ver` → `nav.item.per.titulares`); clusters `nav.cluster.<id>` y grupos `nav.grupo.<id>`. El texto de la columna "Ítem" es el **texto base**.
- **Capability**: la de "ver" (acceso a la pantalla). Las acciones de cada pantalla las define el anexo del módulo y T02.
- **Rutas admin** relativas a `apps/admin` (servida en `/admin/`); rutas PWA relativas a `apps/pwa`; rutas landing relativas al subdominio del tenant.
- **Ola** = ola en que el ítem se habilita (puede existir antes oculto por flag).
- **ProCoop**: función del menú de ProCoop (REL §1: `Pestaña > Grupo > Función`) que el ítem cubre; la trazabilidad completa función → ítem está en 22.1.
- Visibilidad: RN-UXD-022.

#### 10.8.1 Admin (`apps/admin`) — 18 clusters (maestro §9.1)

**C01 Inicio** (`nav.cluster.inicio`)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-001 | Inicio | Tablero de la cooperativa | `/inicio` | `bia.tableros.ver` (antes `bia.tablero.ver`) | O1 | — (pantalla principal) |
| SM-ADM-002 | Inicio | Mi bandeja de tareas | `/inicio/bandeja` | `wfl.tareas.ver` | O1 | — |
| SM-ADM-003 | Inicio | Alertas | `/inicio/alertas` | `bia.tableros.ver` (antes `bia.alertas.ver`) | O0 | Alerta de inicio "Hay facturas electrónicas pendientes de autorizar" (REL §1) |
| SM-ADM-004 | Inicio | Avisos | `/inicio/avisos` | `com.inbox.ver` (antes `com.avisos.ver`) | O0 | Pantalla principal: "Centro de notificaciones", "Noticias Procoop" (DFA M21) |
| SM-ADM-005 | Inicio | Tablero de control | `/inicio/tablero-control` | `bia.tableros.ver` (antes `bia.tableroControl.ver`) | O1 | Herramientas > Tablero de Control |

**C02 Socios y cuentas** (M01 PER)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-006 | Personas y titulares | Personas | `/socios/personas` | `per.personas.ver` | O2 | Servicios a Titulares > Titulares > Administración de Personas |
| SM-ADM-007 | Personas y titulares | Titulares | `/socios/titulares` | `per.titulares.ver` | O2 | Servicios a Titulares > Titulares > Administración de Titulares |
| SM-ADM-008 | Personas y titulares | Cuentas | `/socios/cuentas` | `per.cuentas.ver` | O2 | (ficha de titular > Cuentas, REL §2) |
| SM-ADM-009 | Personas y titulares | Grupos de facturación | `/socios/grupos-facturacion` | `fac.grupos.ver` (antes `per.gruposFacturacion.ver`) | O4 | (Grupo Factura, REL §2; BASE §103) |
| SM-ADM-010 | Personas y titulares | Inmuebles y domicilios | `/socios/inmuebles` | `per.inmuebles.ver` | O2 | — |
| SM-ADM-011 | Relaciones | Autorizados y representantes | `/socios/autorizados` | `per.relaciones.ver` (antes `per.autorizados.ver`) | O2 | — |
| SM-ADM-012 | Relaciones | Grupo familiar y adherentes | `/socios/adherentes` | `soc.adherentes.ver` (antes `per.adherentes.ver`) | O2 | (`ADHSOC`, RN-10 §3.5) |
| SM-ADM-013 | Relaciones | Documentación del titular | `/socios/documentacion` | `per.documentacion.ver` (antes `per.documentos.ver`) | O2 | — |
| SM-ADM-014 | Calidad de datos | Unificación de duplicados | `/socios/duplicados` | `per.duplicados.ver` | O2 | — |
| SM-ADM-015 | Consultas | Consultas e informes de titulares | `/socios/informes` | `per.padron.ver` (antes `per.informes.ver`) | O2 | Servicios a Titulares > Titulares > Consultas e Informes |
| SM-ADM-016 | Configuración | Tablas de titulares | `/socios/configuracion` | `per.configuracion.configurar` (antes `per.config.configurar`) | O2 | Servicios a Titulares > Configuración |

**C03 Servicios** (M02 CAT)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-017 | Catálogo | Catálogo de servicios | `/servicios/catalogo` | `cat.servicios.ver` | O2 | (Tablas de Facturación, DFA M4) |
| SM-ADM-018 | Catálogo | Planes | `/servicios/planes` | `cat.planes.ver` | O2 | — |
| SM-ADM-019 | Catálogo | Productos y subservicios | `/servicios/productos` | `cat.productos.ver` | O2 | — |
| SM-ADM-020 | Catálogo | Categorías | `/servicios/categorias` | `cat.categorias.ver` | O2 | (`CATE_SER`) |
| SM-ADM-021 | Catálogo | Particularidades por servicio | `/servicios/particularidades` | `cat.clases.ver` (antes `cat.particularidades.ver`) | O2 | — |
| SM-ADM-022 | Catálogo | Requisitos por servicio | `/servicios/requisitos` | `cat.servicios.configurar` (antes `cat.requisitos.ver`) | O2 | (comparte con Configuración > Procoop WEB > Requisitos y Trámites) |
| SM-ADM-023 | Catálogo | Copiar servicio desde otra cooperativa | `/servicios/copiar` | `cat.copias.ejecutar` (antes `cat.copia.ver`) | O2 | — (BASE §81) |
| SM-ADM-024 | Contratos | Servicios contratados | `/servicios/contratados` | `cat.contratos.ver` | O2 | (ficha de servicio `SERSOC`) |
| SM-ADM-025 | Contratos | Altas, bajas y cambios | `/servicios/movimientos` | `cat.masivos.ejecutar` (antes `cat.movimientos.ver`) | O2 | — (BASE §48) |

**C04 Medición** (M03 MED)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-026 | Equipos | Medidores | `/medicion/medidores` | `med.medidores.ver` | O7 | (ficha de servicio > Medidor, DFA M5) |
| SM-ADM-027 | Lecturas | Rutas de lectura | `/medicion/rutas` | `med.rutas.ver` | O7 | — |
| SM-ADM-028 | Lecturas | Registro de lecturas | `/medicion/lecturas` | `med.lecturas.ver` | O7 | Servicios a Titulares > Consumos > Registro de Lectura |
| SM-ADM-029 | Lecturas | Validación de consumos | `/medicion/validacion` | `med.excepciones.ver` (antes `med.validacion.ver`) | O7 | Servicios a Titulares > Consumos > Opciones de consumos |
| SM-ADM-030 | Lecturas | Estimaciones | `/medicion/estimaciones` | `med.consumos.estimar` (antes `med.estimaciones.ver`) | O7 | Servicios a Titulares > Consumos > Opciones de consumos |
| SM-ADM-031 | Lecturas | Autolecturas de socios | `/medicion/autolecturas` | `med.excepciones.ver` (antes `med.autolecturas.ver`) | O7 | — |
| SM-ADM-032 | Telemedición | Administración de telemedición | `/medicion/telemedicion` | `med.telemedicion.ver` | O7 | Servicios a Titulares > Consumos > Telemed; Operaciones > Telemed > Administración |
| SM-ADM-033 | Telemedición | Configuración de telemedición | `/medicion/telemedicion/configuracion` | `med.telemedicion.configurar` | O7 | Operaciones > Telemed > Configuración |
| SM-ADM-034 | Telemedición | Prepago | `/medicion/prepago` | `med.prepago.ver` | O7 | — (prepaga CoopOnline, RN-10 §3.3) |
| SM-ADM-035 | Informes | Informes de consumos y telemedición | `/medicion/informes` | `med.informes.ver` | O7 | Servicios a Titulares > Consumos > Informes de Consumos; Operaciones > Telemed > Informes |

**C05 Facturación** (M04 TAR, M05 FAC, M06 FIS)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-036 | Tarifas | Cuadros tarifarios | `/facturacion/tarifas` | `tar.cuadros.ver` | O4 | (Tablas > Cuadros Tarifarios) |
| SM-ADM-037 | Tarifas | Conceptos y cargos | `/facturacion/conceptos` | `tar.eventos.ver` (antes `tar.conceptos.ver`) | O4 | — |
| SM-ADM-038 | Tarifas | Fórmulas y cargos adicionales | `/facturacion/formulas` | `tar.reglas.ver` (antes `tar.formulas.ver`) | O7 | — |
| SM-ADM-039 | Tarifas | Promociones y bonificaciones | `/facturacion/promociones` | `tar.promociones.ver` | O4 | — |
| SM-ADM-040 | Tarifas | Subsidios y tarifa social | `/facturacion/subsidios` | `tar.subsidios.ver` | O7 | — |
| SM-ADM-041 | Tarifas | Simulador de cálculo | `/facturacion/simulador` | `tar.simulador.ejecutar` (antes `tar.simulador.ver`) | O4 | — |
| SM-ADM-042 | Emisión | Ciclos y calendarios | `/facturacion/ciclos` | `fac.ciclos.ver` | O4 | — |
| SM-ADM-043 | Emisión | Lotes de facturación | `/facturacion/lotes` | `fac.lotes.ver` | O4 | Servicios a Titulares > Ventas y Facturación > Facturación |
| SM-ADM-044 | Emisión | Bandeja de no facturables | `/facturacion/no-facturables` | `fac.excepciones.ver` (antes `fac.noFacturables.ver`) | O4 | — (BASE §69) |
| SM-ADM-045 | Comprobantes | Comprobantes emitidos | `/facturacion/comprobantes` | `fac.comprobantes.ver` | O4 | — |
| SM-ADM-046 | Comprobantes | Pendientes de autorizar en ARCA | `/facturacion/pendientes-arca` | `fis.autorizaciones.ver` (antes `fis.autorizacion.ver`) | O4 | Grilla "Comprobantes Pendientes de Autorizar" (REL §1) |
| SM-ADM-047 | Comprobantes | Notas de crédito y débito | `/facturacion/ajustes` | `fac.comprobantes.anular` (antes `fac.ajustes.ver`) | O4 | — |
| SM-ADM-048 | Comprobantes | Movimiento de conceptos | `/facturacion/movimiento-conceptos` | `fac.cargos.crear` (antes `fac.movimientoConceptos.ver`) | O4 | Servicios a Titulares > Ventas y Facturación > Movimiento de Conceptos |
| SM-ADM-049 | Comprobantes | Distribución y envío | `/facturacion/distribucion` | `fac.distribucion.ver` | O4 | — |
| SM-ADM-050 | Comprobantes | Informes de facturación | `/facturacion/informes` | `fac.reportes.ver` (antes `fac.informes.ver`) | O4 | Servicios a Titulares > Ventas y Facturación > Informes de Ventas y Facturación (parte facturación) |
| SM-ADM-051 | Fiscal | Libro IVA Ventas | `/facturacion/fiscal/iva-ventas` | `fis.libroIva.ver` (antes `fis.ivaVentas.ver`) | O4 | Servicios a Titulares > Ventas y Facturación > Libro IVA Ventas |
| SM-ADM-052 | Fiscal | Libro IVA Compras | `/facturacion/fiscal/iva-compras` | `fis.libroIva.ver` (antes `fis.ivaCompras.ver`) | O8 | Compras y Stock > Informes > Libro IVA Compras |
| SM-ADM-053 | Fiscal | Percepciones | `/facturacion/fiscal/percepciones` | `fis.impuestos.configurar` (antes `fis.percepciones.ver`) | O4 | — |
| SM-ADM-054 | Fiscal | Regímenes de retención | `/facturacion/fiscal/regimenes-retencion` | `fis.retenciones.configurar` (antes `fis.regimenes.ver`) | O8 | — |
| SM-ADM-055 | Fiscal | Padrones fiscales | `/facturacion/fiscal/padrones` | `fis.padrones.importar` (antes `fis.padrones.ver`) | O4 | — |
| SM-ADM-056 | Fiscal | Regímenes informativos | `/facturacion/fiscal/regimenes-informativos` | `fis.regimenes.generar` (antes `fis.informativos.ver`) | O8 | — |
| SM-ADM-057 | Fiscal | Tasas de terceros | `/facturacion/fiscal/tasas-terceros` | `fis.terceros.configurar` (antes `fis.terceros.ver`) | O4 | — |
| SM-ADM-058 | Fiscal | Reguladores | `/facturacion/fiscal/reguladores` | `fis.reguladores.ver` | O7 | — |
| SM-ADM-059 | Fiscal | ARCA: puntos de venta, CAE y CAEA | `/facturacion/fiscal/arca` | `fis.arca.ver` | O4 | — |

**C06 Cobranza** (M07 COB)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-060 | Cuenta corriente | Cuenta corriente | `/cobranza/cuenta-corriente` | `cob.cuentaCorriente.ver` | O5 | (transversal, DFA M9) |
| SM-ADM-061 | Caja | Apertura y cierre de caja | `/cobranza/cajas` | `cob.caja.ver` (antes `cob.cajas.ver`) | O5 | Servicios a Titulares > Cobranza > Apertura de Caja |
| SM-ADM-062 | Caja | Cobranza en caja | `/cobranza/caja` | `cob.caja.cobrar` (antes `cob.cobranza.ver`) | O5 | Servicios a Titulares > Cobranza > Cobranza Local |
| SM-ADM-063 | Caja | Opciones de cobranza | `/cobranza/opciones` | `cob.medios.configurar` (antes `cob.opciones.ver`) | O5 | Servicios a Titulares > Cobranza > Opciones de Cobranza |
| SM-ADM-064 | Canales | Entes recaudadores | `/cobranza/entes` | `cob.entes.ver` | O5 | — (Tablas de Cobranzas) |
| SM-ADM-065 | Canales | Débitos automáticos | `/cobranza/debitos` | `cob.debitos.ver` | O5 | — |
| SM-ADM-066 | Canales | Pasarelas de pago | `/cobranza/pasarelas` | `cob.pasarelas.configurar` (antes `cob.pasarelas.ver`) | O5 | — |
| SM-ADM-067 | Control | Conciliación de cobranzas | `/cobranza/conciliacion` | `cob.conciliacion.ver` | O5 | — |
| SM-ADM-068 | Control | Pagos no identificados | `/cobranza/no-identificados` | `cob.noIdentificados.ver` | O5 | — |
| SM-ADM-069 | Control | Devoluciones y contracargos | `/cobranza/devoluciones` | `cob.devoluciones.solicitar` (antes `cob.devoluciones.ver`) | O5 | — |
| SM-ADM-070 | Informes | Informes de cobranza | `/cobranza/informes` | `cob.reportes.ver` (antes `cob.informes.ver`) | O5 | Servicios a Titulares > Cobranza > Informes de Cobranzas |

**C07 Mora** (M08 MOR)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-071 | Gestión de mora | Generar notificaciones | `/mora/generar` | `mor.candidatos.generar` (antes `mor.generacion.ver`) | O6 | Crédito y Gestión de Mora > Gestión de Mora > Generar Notificaciones (1ª instancia) |
| SM-ADM-072 | Gestión de mora | Notificaciones generadas | `/mora/notificaciones-generadas` | `mor.notificaciones.ver` | O6 | … > Tratamiento de Notificaciones Generadas |
| SM-ADM-073 | Gestión de mora | Tratamiento de morosos | `/mora/morosos` | `mor.tratamiento.ver` (antes `mor.morosos.ver`) | O6 | … > Tratamiento de Morosos |
| SM-ADM-074 | Gestión de mora | Envíos de notificaciones | `/mora/envios` | `mor.modelosAviso.configurar` (antes `mor.envios.ver`) | O6 | … > Notificaciones |
| SM-ADM-075 | Gestión de mora | Suspensiones, cortes y reconexiones | `/mora/cortes` | `mor.interrupciones.ver` (antes `mor.cortes.ver`) | O6 | — (flujo inferido DFA M11) |
| SM-ADM-076 | Configuración de mora | Instancias de mora | `/mora/instancias` | `mor.instancias.configurar` (antes `mor.instancias.ver`) | O6 | … > Instancias de Mora |
| SM-ADM-077 | Configuración de mora | Excepciones de mora | `/mora/excepciones` | `mor.excepciones.ver` | O6 | … > Excepciones de Mora |
| SM-ADM-078 | Configuración de mora | Causas de baja | `/mora/causas-baja` | `mor.causas.configurar` (antes `mor.causasBaja.ver`) | O6 | … > Causas de Baja |
| SM-ADM-079 | Configuración de mora | Intereses y recargos | `/mora/intereses` | `mor.politicasInteres.ver` (antes `mor.intereses.ver`) | O6 | — |
| SM-ADM-080 | Financiación | Planes de financiación | `/mora/financiacion` | `mor.convenios.ver` (antes `mor.planes.ver`) | O6 | Crédito y Gestión de Mora > Financiaciones > Emitir Plan de Financiación |
| SM-ADM-081 | Financiación | Garantías | `/mora/garantias` | `mor.garantias.ver` | O6 | — |
| SM-ADM-082 | Recupero | Incobrables | `/mora/incobrables` | `mor.incobrables.ver` | O6 | — |
| SM-ADM-083 | Recupero | Gestión judicial | `/mora/judicial` | `mor.gestionExterna.ver` (antes `mor.judicial.ver`) | O6 | — |
| SM-ADM-084 | Informes | Informes de mora y financiación | `/mora/informes` | `mor.informes.ver` | O6 | … > Financiaciones > Informes; … > Gestión de Mora > Informes |

**C08 Atención** (M09 CRM)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-085 | Casos | Bandeja de atención | `/atencion/bandeja` | `crm.casos.ver` | O2 | — |
| SM-ADM-086 | Casos | Carga rápida de reclamos | `/atencion/carga-rapida` | `crm.casos.crear` (antes `crm.cargaRapida.ver`) | O2 | Operaciones > Técnica > Carga Rápida de Reclamos |
| SM-ADM-087 | Casos | Solicitudes comerciales | `/atencion/solicitudes` | `crm.casos.ver` (antes `crm.solicitudes.ver`) | O2 | — |
| SM-ADM-088 | Casos | Reclamos | `/atencion/reclamos` | `crm.casos.ver` (antes `crm.reclamos.ver`) | O2 | — |
| SM-ADM-089 | Casos | Trámites web recibidos | `/atencion/tramites-web` | `por.formularios.ver` (antes `crm.tramitesWeb.ver`) | O2 | Configuración > Procoop WEB > Requisitos y Trámites (lado operador, RN-10 §3.5) |
| SM-ADM-090 | Casos | Conversaciones (WhatsApp, chat, bot) | `/atencion/conversaciones` | `crm.conversaciones.atender` (antes `crm.conversaciones.ver`) | O2 | (botón WhatsApp en ficha, DFA M21) |
| SM-ADM-091 | Mesa de entradas | Expedientes | `/atencion/mesa-entradas` | `crm.mesaEntradas.ver` (antes `crm.expedientes.ver`) | O2 | Herramientas > Mesa de Entradas > Administración |
| SM-ADM-092 | Mesa de entradas | Incidentes | `/atencion/incidentes` | `crm.incidentes.ver` | O2 | Herramientas > Mesa de Entradas > Incidentes |
| SM-ADM-093 | Turnero | Boxes | `/atencion/turnero/boxes` | `crm.turnero.configurar` (antes `crm.turneroBox.ver`) | O10 | Herramientas > Turnero > Box |
| SM-ADM-094 | Turnero | Atención de turnos | `/atencion/turnero` | `crm.turnero.ver` | O10 | Herramientas > Turnero > Turnero |
| SM-ADM-095 | Turnero | Selección de turnos | `/atencion/turnero/seleccion` | `crm.turnero.emitir` (antes `crm.turnos.ver`) | O10 | Herramientas > Turnero > Selección de Turnos |
| SM-ADM-096 | Turnero | Estadísticas del turnero | `/atencion/turnero/estadisticas` | `crm.reportes.ver` (antes `crm.turneroEstadisticas.ver`) | O10 | Herramientas > Turnero > Estadísticas |
| SM-ADM-097 | Actividades internas | Seguimiento de actividades | `/atencion/actividades` | `crm.actividades.ver` | O10 | Herramientas > Actividades > Seguimiento |
| SM-ADM-098 | Actividades internas | Informe de actividades | `/atencion/actividades/informe` | `crm.actividades.ver` (antes `crm.actividadesInforme.ver`) | O10 | Herramientas > Actividades > Informe |
| SM-ADM-099 | Configuración | Tipos, estados y SLA | `/atencion/configuracion` | `crm.config.tipos.configurar` (antes `crm.config.ver`) | O2 | — |
| SM-ADM-100 | Informes | Informes de atención | `/atencion/informes` | `crm.bandejaSupervision.ver` (antes `crm.informes.ver`) | O2 | Herramientas > Mesa de Entradas > Informes |

**C09 Técnica** (M10 TEC)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-101 | Operación | Agenda y visitas | `/tecnica/agenda` | `tec.agenda.ver` | O3 | — |
| SM-ADM-102 | Operación | Factibilidades | `/tecnica/factibilidades` | `tec.factibilidad.ver` (antes `tec.factibilidades.ver`) | O3 | Operaciones > Técnica > Factibilidades |
| SM-ADM-103 | Operación | Órdenes de trabajo | `/tecnica/ordenes` | `tec.ordenes.ver` | O3 | Operaciones > Técnica > Órdenes |
| SM-ADM-104 | Operación | Despacho y mapa de campo | `/tecnica/despacho` | `tec.despacho.gestionar` (antes `tec.despacho.ver`) | O3 | — |
| SM-ADM-105 | Operación | Cuadrillas y contratistas | `/tecnica/cuadrillas` | `tec.cuadrillas.gestionar` (antes `tec.cuadrillas.ver`) | O3 | — |
| SM-ADM-106 | Operación | Instalaciones | `/tecnica/instalaciones` | `tec.instalaciones.ver` | O3 | — (BASE §73) |
| SM-ADM-107 | TIC | Aprovisionamiento de Internet | `/tecnica/aprovisionamiento` | `tec.aprovisionamiento.ver` | O3 | — (`MIKROTIK`, DFA M25) |
| SM-ADM-108 | TIC | Telefonía: centrales y numeración | `/tecnica/telefonia` | `tec.telefonia.redFisica.ver` (antes `tec.telefonia.ver`) | O10 | Servicios a Titulares > Consumos > Opciones de Telefonía |
| SM-ADM-109 | TIC | Telefonía: CDR y tasación | `/tecnica/telefonia/cdr` | `tec.cdr.importar` (antes `tec.cdr.ver`) | O10 | Servicios a Titulares > Consumos > Opciones de Telefonía |
| SM-ADM-110 | TIC | TV y otros TIC | `/tecnica/tv` | `tec.aprovisionamiento.configurar` (antes `tec.tv.ver`) | O10 | — |
| SM-ADM-111 | Infraestructura | Redes y GIS | `/tecnica/redes` | `tec.redes.ver` | O7 | — (`REDES_*`, DFA M15) |
| SM-ADM-112 | Infraestructura | Obras y mantenimiento | `/tecnica/obras` | `tec.obras.ver` | O7 | — |
| SM-ADM-113 | Informes | Informes técnicos | `/tecnica/informes` | `tec.reportes.ver` (antes `tec.informes.ver`) | O3 | Operaciones > Técnica > Informes |

**C10 Ventas** (M11 VEN)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-114 | Ventas | Presupuestos | `/ventas/presupuestos` | `ven.presupuestos.ver` | O5 | Servicios a Titulares > Ventas y Facturación > Presupuestos |
| SM-ADM-115 | Ventas | Venta de productos | `/ventas/ventas` | `ven.ventas.ver` | O5 | Servicios a Titulares > Ventas y Facturación > Venta de Productos |
| SM-ADM-116 | Ventas | Punto de venta (POS) | `/ventas/pos` | `ven.pos.abrir` (antes `ven.pos.ver`) | O5 | — (complementos POS / R-Pos, BASE §1) |
| SM-ADM-117 | Ventas | Informes de ventas | `/ventas/informes` | `ven.ventas.exportar` (antes `ven.informes.ver`) | O5 | Servicios a Titulares > Ventas y Facturación > Informes de Ventas y Facturación (parte ventas) |

**C11 Administración** (M12 CMP, M13 STK, M14 TES, M15 CON)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-118 | Compras | Proveedores | `/administracion/compras/proveedores` | `cmp.proveedores.ver` | O8 | — |
| SM-ADM-119 | Compras | Solicitudes de aprovisionamiento | `/administracion/compras/solicitudes` | `cmp.solicitudes.ver` | O8 | Compras y Stock > Gestión de Compras > Solicitudes de Aprovisionamiento |
| SM-ADM-120 | Compras | Solicitudes de cotización | `/administracion/compras/cotizaciones` | `cmp.cotizaciones.ver` | O8 | … > Solicitudes de Cotización |
| SM-ADM-121 | Compras | Órdenes de compra | `/administracion/compras/ordenes` | `cmp.ordenes.ver` | O8 | … > Órdenes de Compra |
| SM-ADM-122 | Compras | Remitos de proveedores | `/administracion/compras/remitos` | `cmp.recepciones.registrar` (antes `cmp.remitos.ver`) | O8 | … > Remitos |
| SM-ADM-123 | Compras | Comprobantes de proveedores | `/administracion/compras/comprobantes` | `cmp.comprobantes.ver` | O8 | … > Comprobantes de Proveedores |
| SM-ADM-124 | Compras | Pago a proveedores | `/administracion/compras/pagos` | `cmp.ordenesPago.ver` (antes `cmp.pagos.ver`) | O8 | … > Pago a Proveedores |
| SM-ADM-125 | Compras | Retenciones practicadas | `/administracion/compras/retenciones` | `fis.retenciones.ver` (antes `cmp.retenciones.ver`) | O8 | … > Retenciones |
| SM-ADM-126 | Compras | Informes de compras | `/administracion/compras/informes` | `cmp.comprobantes.ver` (antes `cmp.informes.ver`) | O8 | Compras y Stock > Informes > Compras |
| SM-ADM-127 | Compras | Correspondencia | `/administracion/compras/correspondencia` | `cmp.proveedores.editar` (antes `cmp.correspondencia.ver`) | O8 | Compras y Stock > Informes > Correspondencia |
| SM-ADM-128 | Stock | Artículos y depósitos | `/administracion/stock/articulos` | `stk.articulos.ver` | O3 | — |
| SM-ADM-129 | Stock | Movimientos de stock | `/administracion/stock/movimientos` | `stk.movimientos.ver` | O3 | Compras y Stock > Stock > Movimientos |
| SM-ADM-130 | Stock | Equipos serializados y comodatos | `/administracion/stock/equipos` | `stk.series.ver` (antes `stk.equipos.ver`) | O3 | — (BASE §73) |
| SM-ADM-131 | Stock | Trazabilidad | `/administracion/stock/trazabilidad` | `stk.movimientos.ver` (antes `stk.trazabilidad.ver`) | O8 | Compras y Stock > Stock > Trazabilidad |
| SM-ADM-132 | Stock | Operaciones especiales | `/administracion/stock/operaciones-especiales` | `stk.revaluaciones.crear` (antes `stk.operacionesEspeciales.ver`) | O8 | Compras y Stock > Stock > Operaciones Especiales |
| SM-ADM-133 | Stock | Bienes de uso | `/administracion/stock/bienes-uso` | `stk.bienesUso.ver` | O8 | Compras y Stock > Stock > Bienes de Uso |
| SM-ADM-134 | Stock | Fabricación | `/administracion/stock/fabricacion` | `stk.fabricacion.ordenes.ver` (antes `stk.fabricacion.ver`) | O10 | Compras y Stock > Stock > Fabricación |
| SM-ADM-135 | Stock | RMA | `/administracion/stock/rma` | `stk.rma.ver` | O8 | Compras y Stock > RMA |
| SM-ADM-136 | Stock | Informes de stock | `/administracion/stock/informes` | `stk.informes.ver` | O8 | Compras y Stock > Informes > Stock |
| SM-ADM-137 | Tesorería | Cuentas bancarias propias | `/administracion/tesoreria/cuentas` | `tes.cuentas.ver` | O8 | Tesorería > Bancos > Cuentas Propias |
| SM-ADM-138 | Tesorería | Movimientos bancarios | `/administracion/tesoreria/movimientos-bancarios` | `tes.movimientos.ver` (antes `tes.movimientosBancarios.ver`) | O8 | Tesorería > Bancos > Movimientos Bancarios |
| SM-ADM-139 | Tesorería | Movimientos de tesorería | `/administracion/tesoreria/movimientos` | `tes.movimientos.ver` | O8 | Tesorería > Tesorería > Movimientos |
| SM-ADM-140 | Tesorería | Valores de terceros | `/administracion/tesoreria/valores-terceros` | `tes.valores.ver` (antes `tes.valoresTerceros.ver`) | O8 | Tesorería > Tesorería > Valores de Terceros |
| SM-ADM-141 | Tesorería | Cheques propios | `/administracion/tesoreria/cheques` | `tes.chequeras.ver` (antes `tes.cheques.ver`) | O8 | Tesorería > Tesorería > Cheques Propios |
| SM-ADM-142 | Tesorería | Cupones de tarjetas | `/administracion/tesoreria/cupones` | `tes.cupones.ver` | O8 | Tesorería > Tesorería > Cupones de Tarjetas |
| SM-ADM-143 | Tesorería | Retenciones recibidas | `/administracion/tesoreria/retenciones-recibidas` | `tes.retencionesRecibidas.ver` | O8 | Tesorería > Tesorería > Retenciones Recibidas |
| SM-ADM-144 | Tesorería | Cajas para pagos a proveedores | `/administracion/tesoreria/cajas-pagos` | `tes.cajasPago.abrir` (antes `tes.cajasPagos.ver`) | O8 | Tesorería > Tesorería > Cajas para Pagos a Proveedores |
| SM-ADM-145 | Tesorería | Cierre de cajas | `/administracion/tesoreria/cierre-cajas` | `tes.cierreCaja.cerrar` (antes `tes.cierreCajas.ver`) | O5 | Tesorería > Tesorería > Cierre de Cajas |
| SM-ADM-146 | Tesorería | Conciliación bancaria | `/administracion/tesoreria/conciliacion` | `tes.conciliacion.ver` | O8 | — |
| SM-ADM-147 | Tesorería | Interbanking | `/administracion/tesoreria/interbanking` | `tes.interbanking.configurar` (antes `tes.interbanking.ver`) | O8 | — (DFA M29) |
| SM-ADM-148 | Tesorería | Planificación de fondos | `/administracion/tesoreria/planificacion` | `tes.flujo.ver` (antes `tes.planificacion.ver`) | O8 | — (BASE §21) |
| SM-ADM-149 | Tesorería | Informes de tesorería | `/administracion/tesoreria/informes` | `tes.informes.ver` | O8 | Tesorería > Informes |
| SM-ADM-150 | Contabilidad | Plan de cuentas | `/administracion/contabilidad/plan` | `con.planes.ver` (antes `con.planCuentas.ver`) | O5 | — |
| SM-ADM-151 | Contabilidad | Ejercicios y períodos | `/administracion/contabilidad/ejercicios` | `con.ejercicios.ver` | O5 | — |
| SM-ADM-152 | Contabilidad | Centros de costo | `/administracion/contabilidad/centros-costo` | `con.centros.ver` (antes `con.centrosCosto.ver`) | O5 | — |
| SM-ADM-153 | Contabilidad | Asientos | `/administracion/contabilidad/asientos` | `con.asientos.ver` | O5 | Contabilidad > Movimientos > Asientos |
| SM-ADM-154 | Contabilidad | Asientos automáticos | `/administracion/contabilidad/asientos-automaticos` | `con.reglas.ver` | O5 | Contabilidad > Otras operaciones > Asientos Automáticos |
| SM-ADM-155 | Contabilidad | Consultar mayor | `/administracion/contabilidad/mayor` | `con.reportes.ver` (antes `con.mayor.ver`) | O5 | Contabilidad > Movimientos > Consultar Mayor |
| SM-ADM-156 | Contabilidad | Balance general / sumas y saldos | `/administracion/contabilidad/balance` | `con.reportes.ver` (antes `con.balance.ver`) | O8 | Contabilidad > Movimientos > Balance General / Sumas y Saldos |
| SM-ADM-157 | Contabilidad | Herramientas contables | `/administracion/contabilidad/herramientas` | `con.config.ver` (antes `con.herramientas.ver`) | O8 | Contabilidad > Otras operaciones > Herramientas |
| SM-ADM-158 | Contabilidad | Planes múltiples y simulaciones | `/administracion/contabilidad/simulaciones` | `con.simulaciones.ver` | O8 | — (BASE §55) |
| SM-ADM-159 | Contabilidad | Presupuesto económico | `/administracion/contabilidad/presupuestos` | `con.presupuestos.ver` | O8 | — |
| SM-ADM-160 | Contabilidad | Informes contables | `/administracion/contabilidad/informes` | `con.reportes.ver` (antes `con.informes.ver`) | O8 | Contabilidad > Informes > Contables |
| SM-ADM-161 | Contabilidad | Informes de gestión | `/administracion/contabilidad/informes-gestion` | `con.reportes.ver` (antes `con.gestion.ver`) | O8 | Contabilidad > Informes > de Gestión |

**C12 Personal** (M16 SUE)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-162 | Administración | Empleados | `/personal/empleados` | `sue.legajos.ver` (antes `sue.empleados.ver`) | O9 | Sueldos > Administración > Empleados |
| SM-ADM-163 | Administración | Empresas empleadoras | `/personal/empresas` | `sue.estructura.configurar` (antes `sue.empresas.ver`) | O9 | Sueldos > Administración > Empresas |
| SM-ADM-164 | Administración | Recibos | `/personal/recibos` | `sue.recibos.ver` | O9 | Sueldos > Administración > Recibos |
| SM-ADM-165 | Procesos | Novedades del período | `/personal/novedades` | `sue.novedades.ver` | O9 | — |
| SM-ADM-166 | Procesos | Liquidación masiva | `/personal/liquidaciones` | `sue.liquidaciones.ver` | O9 | Sueldos > Procesos > Liquidación Masiva |
| SM-ADM-167 | Procesos | Simulador de liquidación | `/personal/simulador` | `sue.liquidaciones.simular` (antes `sue.simulador.ver`) | O9 | Sueldos > Procesos > Simulador |
| SM-ADM-168 | Procesos | Impuesto a las Ganancias | `/personal/ganancias` | `sue.ganancias.ver` | O9 | Sueldos > Procesos > Impuesto a las Ganancias |
| SM-ADM-169 | Configuración | Variables | `/personal/variables` | `sue.variables.configurar` (antes `sue.variables.ver`) | O9 | Sueldos > Configuración > Variables |
| SM-ADM-170 | Configuración | Conceptos | `/personal/conceptos` | `sue.conceptos.configurar` (antes `sue.conceptos.ver`) | O9 | Sueldos > Configuración > Conceptos |
| SM-ADM-171 | Configuración | Aplicar aumentos | `/personal/aumentos` | `sue.aumentos.aplicar` (antes `sue.aumentos.ver`) | O9 | Sueldos > Configuración > Aplicar Aumentos |
| SM-ADM-172 | Informes | Libro de sueldos digital y F.931 | `/personal/lsd` | `sue.presentaciones.generar` (antes `sue.lsd.ver`) | O9 | Sueldos > Informes > Libro sueldo digital (deshabilitado en DEMO) |
| SM-ADM-173 | Informes | Informes de sueldos | `/personal/informes` | `sue.reportes.ver` (antes `sue.informes.ver`) | O9 | Sueldos > Informes > Informes de Sueldos |

**C13 Institucional** (M17 INS)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-174 | Institucional | Padrón de asociados | `/institucional/asociados` | `ins.asociados.ver` | O10 | — (`SOCIOS`, DFA M24) |
| SM-ADM-175 | Institucional | Capital social | `/institucional/capital` | `ins.capital.ver` | O10 | — (`CAPITAL`) |
| SM-ADM-176 | Institucional | Asambleas | `/institucional/asambleas` | `ins.reuniones.ver` (antes `ins.asambleas.ver`) | O10 | — |
| SM-ADM-177 | Institucional | Consejo y actas | `/institucional/consejo` | `ins.organos.gestionar` (antes `ins.consejo.ver`) | O10 | — (`CONSEJO`, `ACTAS`) |
| SM-ADM-178 | Institucional | Reuniones | `/institucional/reuniones` | `ins.reuniones.ver` | O10 | — (`REUNIONES*`) |
| SM-ADM-179 | Institucional | INAES | `/institucional/inaes` | `ins.inaes.exportar` (antes `ins.inaes.ver`) | O10 | — (`CAT_INAES`) |

**C14 Servicios sociales** (M18 SOC)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-180 | Vivienda | Planes de vivienda | `/sociales/vivienda` | `soc.vivienda.ver` | O10 | — (`PLANESVIV`) |
| SM-ADM-181 | Vivienda | Materiales para viviendas | `/sociales/vivienda/materiales` | `soc.vivienda.configurar` (antes `soc.viviendaMateriales.ver`) | O10 | Operaciones > Planes de Vivienda > Materiales |
| SM-ADM-182 | Vivienda | Construcción de viviendas | `/sociales/vivienda/construccion` | `soc.obra.gestionar` (antes `soc.viviendaConstruccion.ver`) | O10 | Operaciones > Planes de Vivienda > Construcción |
| SM-ADM-183 | Vivienda | Informes de vivienda | `/sociales/vivienda/informes` | `soc.reportes.ver` (antes `soc.viviendaInformes.ver`) | O10 | Operaciones > Planes de Vivienda > Informes |
| SM-ADM-184 | Prestaciones | Sepelio | `/sociales/sepelio` | `soc.sepelio.gestionar` (antes `soc.sepelio.ver`) | O10 | — |
| SM-ADM-185 | Prestaciones | Cementerio parque | `/sociales/cementerio` | `soc.cementerio.ver` | O10 | — |
| SM-ADM-186 | Prestaciones | Salud y ambulancias | `/sociales/salud` | `soc.salud.ver` | O10 | — (`AMBULANC`, `MEDICOS`, `INTERNAC`) |
| SM-ADM-187 | Prestaciones | Banco de sangre | `/sociales/banco-sangre` | `soc.sangre.ver` (antes `soc.bancoSangre.ver`) | O10 | — |
| SM-ADM-188 | Flota | Vehículos y choferes | `/sociales/flota` | `soc.flota.ver` | O10 | — (`CHOFERES`, `MAQUINAS`) |
| SM-ADM-189 | Flota | Viajes | `/sociales/traslados` | `soc.traslados.ver` | O10 | Herramientas > Traslados > Viajes |
| SM-ADM-190 | Flota | Informes y rendiciones de viajes | `/sociales/traslados/informes` | `soc.reportes.ver` (antes `soc.trasladosInformes.ver`) | O10 | Herramientas > Traslados > Informes |
| SM-ADM-191 | Flota | Seguimiento GPS | `/sociales/gps` | `soc.gps.ver` | O10 | — (`AVL_REG`) |

**C15 Comunidad** (T09 COM)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-192 | Muro | Publicaciones | `/comunidad/publicaciones` | `com.posts.ver` (antes `com.publicaciones.ver`) | O2 | Configuración > Procoop WEB (novedades web, VAR 2733) |
| SM-ADM-193 | Muro | Categorías de publicaciones | `/comunidad/categorias` | `com.posts.configurar` (antes `com.categorias.ver`) | O2 | — |
| SM-ADM-194 | Muro | Moderación | `/comunidad/moderacion` | `com.moderation.ver` (antes `com.moderacion.ver`) | O2 | — |
| SM-ADM-195 | Novedades | Boletines | `/comunidad/boletines` | `com.newsletters.ver` (antes `com.boletines.ver`) | O2 | — |
| SM-ADM-196 | Novedades | Centro de comunicaciones | `/comunidad/comunicaciones` | `com.communications.ver` (antes `com.comunicaciones.ver`) | O2 | — (`SENDMAIL`, `ENVIOS`) |
| SM-ADM-197 | Novedades | Plantillas de comunicación | `/comunidad/plantillas` | `com.templates.ver` (antes `com.plantillas.ver`) | O2 | — (`PLANTILLA_WSP`, `MailTemplates`) |
| SM-ADM-198 | Novedades | Campañas y avisos push | `/comunidad/campanas` | `com.campaigns.ver` (antes `com.campanas.ver`) | O2 | — |
| SM-ADM-199 | Novedades | SMS | `/comunidad/sms` | `com.campaigns.ver` (antes `com.sms.ver`) | O2 | Herramientas > SMS |
| SM-ADM-200 | Novedades | Saludos automáticos | `/comunidad/saludos` | `com.posts.configurar` (antes `com.saludos.ver`) | O2 | — |
| SM-ADM-201 | Encuestas | Encuestas | `/comunidad/encuestas` | `com.surveys.ver` (antes `com.encuestas.ver`) | O2 | — (`ENCUESTAS`) |
| SM-ADM-202 | Encuestas | Inteligencia de encuestas | `/comunidad/encuestas/inteligencia` | `com.surveys.resultados` (antes `com.encuestasInteligencia.ver`) | O11 | — |
| SM-ADM-203 | Audiencias | Audiencias guardadas | `/comunidad/audiencias` | `com.audiences.usar` (antes `com.audiencias.ver`) | O2 | — |

**C16 Sitio y portal** (M19 POR)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-204 | Landing | Landing de la cooperativa | `/portal/landing` | `por.landing.ver` | O2 | — (complemento Web/CMS, BASE §1) |
| SM-ADM-205 | Portal | Usuarios del portal | `/portal/usuarios` | `iam.portal.usuarios.ver` (antes `por.usuarios.ver`) | O2 | — (`WEB_LOG`, usuarios CoopOnline) |
| SM-ADM-206 | Portal | Trámites web: definición | `/portal/tramites` | `por.formularios.ver` (antes `por.tramites.ver`) | O2 | Configuración > Procoop WEB > Requisitos y Trámites |
| SM-ADM-207 | Portal | Archivos en la web | `/portal/archivos` | `por.landing.editar` (antes `por.archivos.ver`) | O2 | Configuración > Procoop WEB > Archivos en la Web |
| SM-ADM-208 | Portal | Operaciones web (pagos y prepagas) | `/portal/operaciones` | `cob.intenciones.ver` (antes `por.operaciones.ver`) | O5 | Configuración > Procoop WEB > Operaciones |
| SM-ADM-209 | Portal | Bajas públicas recibidas | `/portal/bajas-publicas` | `por.recepcionPublica.ver` (antes `por.bajasPublicas.ver`) | O2 | — (BASE §53) |
| SM-ADM-210 | Portal | Configuración del portal | `/portal/configuracion` | `por.parametros.configurar` (antes `por.config.ver`) | O2 | (variables `VAR_PMOVIL` no textuales) |

**C17 Reportes** (T10 BIA)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-211 | Reportes | Catálogo de reportes | `/reportes/catalogo` | `bia.reportes.ver` | O1 | — |
| SM-ADM-212 | Reportes | Salas de inteligencia | `/reportes/salas` | `bia.bi.ver` (antes `bia.salas.ver`) | O11 | — (`TABLAS_POWERBI`) |
| SM-ADM-213 | Reportes | Editor de reportes | `/reportes/editor` | `bia.disenador.usar` (antes `bia.editor.ver`) | O11 | Configuración > Reportes > Editor de Reportes |
| SM-ADM-214 | Reportes | Informes personalizados | `/reportes/personalizados` | `bia.reportes.ver` (antes `bia.personalizados.ver`) | O11 | Configuración > Reportes > Informes Personalizados |
| SM-ADM-215 | Reportes | Procesos personalizados | `/reportes/procesos` | `bia.reportes.programar` (antes `bia.procesos.ver`) | O11 | Configuración > Reportes > Procesos Personalizados |
| SM-ADM-216 | Reportes | Exportaciones programadas | `/reportes/exportaciones` | `bia.exportaciones.ver` | O11 | — (`EXPORTADOR`) |
| SM-ADM-217 | Reportes | APIs para terceros | `/reportes/apis` | `bia.api.clientes.ver` (antes `bia.apis.ver`) | O11 | — (`WS_KEYS`, `WS_USERS`) |

**C18 Configuración** (T01, T02, T03, T04, T06, T07, T11)

| ID | Grupo | Ítem | Ruta | Capability | Ola | ProCoop |
|---|---|---|---|---|---|---|
| SM-ADM-218 | Seguridad | Usuarios | `/configuracion/usuarios` | `iam.usuarios.ver` | O1 | Configuración > General > Usuarios |
| SM-ADM-219 | Seguridad | Roles | `/configuracion/roles` | `iam.roles.ver` | O1 | Configuración > General > Perfiles (parte funciones) |
| SM-ADM-220 | Seguridad | Perfiles de pantallas | `/configuracion/perfiles` | `iam.perfiles.ver` | O1 | Configuración > General > Perfiles (parte menú) |
| SM-ADM-221 | Seguridad | Alcances | `/configuracion/alcances` | `iam.usuarios.ver` (antes `iam.alcances.ver`) | O1 | (`USERS_AREA`, `USERS_DEPOSITO`) |
| SM-ADM-222 | Seguridad | Auditoría de ingresos | `/configuracion/auditoria-ingresos` | `iam.auditoria.accesos.ver` (antes `iam.auditoriaIngresos.ver`) | O1 | Configuración > General > Auditoría de Logueo |
| SM-ADM-223 | Seguridad | Auditoría de cambios | `/configuracion/auditoria` | `iam.auditoria.cambios.ver` (antes `iam.auditoria.ver`) | O0 | (`AUDITORIA`, `INFO_AUD`) |
| SM-ADM-224 | Seguridad | Sesiones y dispositivos | `/configuracion/sesiones` | `iam.sesiones.ver` | O1 | — |
| SM-ADM-225 | Organización | Datos de la cooperativa | `/configuracion/cooperativa` | `cfg.parametros.ver` (antes `cfg.organizacion.ver`) | O1 | (VAR 518–527, 706, 707) |
| SM-ADM-226 | Organización | Sucursales y puntos de venta | `/configuracion/sucursales` | `cfg.sucursales.ver` | O1 | — |
| SM-ADM-227 | Organización | Tablas del sistema | `/configuracion/tablas` | `cfg.maestros.ver` (antes `cfg.tablas.ver`) | O1 | Configuración > Tablas y Parámetros > Tablas del sistema |
| SM-ADM-228 | Organización | Parámetros del sistema | `/configuracion/parametros` | `cfg.parametros.ver` | O1 | Configuración > Tablas y Parámetros > Parámetros del Sistema |
| SM-ADM-229 | Organización | Parámetros externos | `/configuracion/parametros-externos` | `cfg.tecnica.ver` (antes `cfg.parametrosExternos.ver`) | O1 | Configuración > Tablas y Parámetros > Parámetros Externos |
| SM-ADM-230 | Organización | Geografía y calles | `/configuracion/geografia` | `cfg.geo.ver` (antes `cfg.geografia.ver`) | O1 | — (BASE §77) |
| SM-ADM-231 | Organización | Calendario y feriados | `/configuracion/calendario` | `cfg.calendarios.ver` (antes `cfg.calendario.ver`) | O1 | — |
| SM-ADM-232 | Organización | Índices económicos | `/configuracion/indices` | `cfg.indices.ver` | O1 | — |
| SM-ADM-233 | Organización | Publicaciones de configuración | `/configuracion/publicaciones` | `cfg.versiones.ver` (antes `cfg.publicaciones.ver`) | O1 | — |
| SM-ADM-234 | Experiencia | Marca e identidad | `/configuracion/experiencia/marca` | `uxd.marca.ver` | O1 | (PAN-UXD-01) |
| SM-ADM-235 | Experiencia | Diccionario de términos | `/configuracion/experiencia/diccionario` | `uxd.diccionario.ver` | O1 | (PAN-UXD-02) |
| SM-ADM-236 | Experiencia | Publicaciones del diccionario | `/configuracion/experiencia/diccionario/publicaciones` | `uxd.diccionario.ver` | O1 | (PAN-UXD-03) |
| SM-ADM-237 | Experiencia | Navegación de las apps | `/configuracion/experiencia/navegacion` | `uxd.navegacion.configurar` | O1 | (PAN-UXD-05) |
| SM-ADM-238 | Experiencia | Ayudas contextuales | `/configuracion/experiencia/ayudas` | `uxd.ayuda.editar` | O1 | (PAN-UXD-06) |
| SM-ADM-239 | Experiencia | Flags de interfaz | `/configuracion/experiencia/flags` | `uxd.flags.configurar` | O1 | (PAN-UXD-07) |
| SM-ADM-240 | Procesos | Autorización de operaciones | `/configuracion/autorizaciones` | `wfl.flujos.configurar` (antes `wfl.autorizaciones.ver`) | O1 | Configuración > Tablas y Parámetros > Autorización de Operaciones |
| SM-ADM-241 | Procesos | Workflows | `/configuracion/workflows` | `wfl.flujos.configurar` (antes `wfl.workflows.ver`) | O1 | — |
| SM-ADM-242 | Procesos | Plantillas de documentos | `/configuracion/plantillas-documentos` | `wfl.plantillas.ver` | O1 | — (`PLANTILLA`, `VARIABLEPLANT`) |
| SM-ADM-243 | Procesos | Expediente documental | `/configuracion/expedientes` | `wfl.expedientes.ver` | O1 | — |
| SM-ADM-244 | Procesos | Procesos y jobs | `/configuracion/jobs` | `wfl.jobs.ver` | O0 | — (Agente/servicio Procoop) |
| SM-ADM-245 | Integraciones | Integraciones | `/configuracion/integraciones` | `int.conexiones.ver` (antes `int.integraciones.ver`) | O1 | — |
| SM-ADM-246 | Integraciones | Bóveda de credenciales | `/configuracion/credenciales` | `int.credenciales.gestionar` (antes `int.credenciales.ver`) | O1 | — (CNX §4.6) |
| SM-ADM-247 | Integraciones | Webhooks | `/configuracion/webhooks` | `int.webhooks.configurar` (antes `int.webhooks.ver`) | O1 | — |
| SM-ADM-248 | Integraciones | Agente local y hardware | `/configuracion/agente` | `int.agentes.gestionar` (antes `int.agente.ver`) | O10 | — (lector de billetes VAR 2351/2352, turnero) |
| SM-ADM-249 | Migración | Migración desde ProCoop | `/configuracion/migracion` | `mig.conciliacion.ver` (antes `mig.migracion.ver`) | O11 | — |
| SM-ADM-250 | Migración | Paralelo y by-pass | `/configuracion/paralelo` | `mig.paralelo.ver` | O11 | — |
| SM-ADM-251 | Cuenta SaaS | Soporte y accesos temporales | `/configuracion/soporte` | `pla.soporte.ver` | O1 | — (VAR 2683 chat con soporte) |
| SM-ADM-252 | Cuenta SaaS | Licencia y módulos contratados | `/configuracion/licencia` | `pla.miSuscripcion.ver` (antes `pla.licencia.ver`) | O1 | — |
| SM-ADM-253 | Cuenta SaaS | Respaldos y exportación de datos | `/configuracion/respaldos` | `pla.exportacion.solicitar` (antes `pla.respaldos.ver`) | O1 | Configuración > General > Copia de Seguridad (Reemplazado) |
| SM-ADM-254 | Cuenta SaaS | Ambiente de prueba | `/configuracion/ambientes` | `pla.miSuscripcion.ver` (antes `pla.ambientes.ver`) | O1 | — (AGR-035) |

Total admin: **18 clusters, 63 grupos, 254 ítems**.

#### 10.8.2 PWA socio (`apps/pwa`, rol socio)

| ID | Grupo (menú hamburguesa) | Ítem | Ruta | Capability | Ola | Origen |
|---|---|---|---|---|---|---|
| SM-PWS-001 | Tabbar | Inicio | `/inicio` | `por.portal.ver` (antes `por.inicio.ver`) | O2 | Maestro §9.2; CNX §5.1 tiras |
| SM-PWS-002 | Tabbar | Cuentas (rótulo corto de la tabbar, RN-UXD-006; pantalla "Cuentas y servicios"; antes "Cuentas y servicios") | `/servicios` | `por.servicios.ver` | O2 | BASE §102.5.6 Mis servicios |
| SM-PWS-003 | Servicios | Detalle de servicio | `/servicios/:id` | `por.servicios.ver` | O2 | BASE §43.8 |
| SM-PWS-004 | Servicios | Vincular cuenta | `/cuentas/vincular` | `por.cuentas.vincular` | O2 | BASE §25; VAR_PMOVIL 5–9 |
| SM-PWS-005 | Servicios | Contratar un servicio | `/servicios/contratar` | `por.servicios.contratar` (antes `por.solicitudes.crear`) | O2 | BASE §43 MAR-009, §48 |
| SM-PWS-006 | Servicios | Baja, suspensión o reactivación | `/servicios/:id/cambios` | `por.servicios.solicitarBaja` (antes `por.solicitudes.crear`) | O2 | BASE §25, §53 |
| SM-PWS-007 | Facturas y pagos | Mis facturas y pagos | `/facturas` | `por.facturas.ver` | O4 | BASE §102.5.6 |
| SM-PWS-008 | Facturas y pagos | Detalle de factura | `/facturas/:id` | `por.facturas.ver` | O4 | BASE §25 explicación de importes |
| SM-PWS-009 | Facturas y pagos | Pagar (FAB) | `/pagar` | `por.pagos.crear` | O5 | Maestro §9.2 |
| SM-PWS-010 | Facturas y pagos | Resultado del pago | `/pagar/resultado/:id` | `por.pagos.crear` (antes `por.pagos.ver`) | O5 | BASE CU-25; RN-10 §3.2 estados |
| SM-PWS-011 | Facturas y pagos | Resumen de cuenta | `/resumen` | `por.facturas.ver` (antes `por.resumen.ver`) | O5 | BASE §44 |
| SM-PWS-012 | Facturas y pagos | Débito automático y factura digital | `/adhesiones` | `por.debito.gestionar` (antes `por.adhesiones.ver`) | O5 | BASE §1 CoopOnline |
| SM-PWS-013 | Facturas y pagos | Planes de pago y cuotas | `/planes` | `por.facturas.ver` (antes `por.planes.ver`) | O6 | BASE §25 |
| SM-PWS-014 | Consumos | Mis consumos | `/consumos` | `por.consumos.ver` | O7 | BASE §25 |
| SM-PWS-015 | Consumos | Autolectura con foto | `/consumos/autolectura` | `por.autolectura.crear` | O7 | DFA M26 |
| SM-PWS-016 | Consumos | Cargar saldo (prepago) | `/prepago` | `por.prepaga.comprar` (antes `por.prepago.crear`) | O7 | RN-10 §3.3 |
| SM-PWS-017 | Tabbar | Gestiones | `/gestiones` | `por.gestiones.crear` (antes `por.gestiones.ver`) | O2 | BASE §102.5.6 Mis gestiones |
| SM-PWS-018 | Gestiones | Nueva gestión (modal desde FAB) | modal | `por.gestiones.crear` | O2 | BASE §25 CRM con fotos |
| SM-PWS-019 | Gestiones | Detalle y seguimiento de gestión | `/gestiones/:id` | `por.gestiones.crear` (antes `por.gestiones.ver`) | O2 | BASE §25 ticket |
| SM-PWS-020 | Gestiones | Visitas | `/visitas` | `por.visitas.ver` | O3 | BASE §25 |
| SM-PWS-021 | Gestiones | Conformidad de instalación | `/visitas/:id/conformidad` | `por.visitas.gestionar` (antes `por.conformidad.firmar`) | O3 | BASE §25, §73 |
| SM-PWS-022 | Gestiones | Turnos | `/turnos` | `por.turnos.gestionar` (antes `por.turnos.ver`) | O10 | DFA M21 turnero web |
| SM-PWS-023 | Gestiones | Trámites | `/tramites` | `por.tramites.iniciar` (antes `por.tramites.ver`) | O2 | RN-10 §3.5 |
| SM-PWS-024 | Gestiones | Constancias y documentos | `/documentos` | `por.constancias.descargar` (antes `por.documentos.ver`) | O4 | BASE §25 |
| SM-PWS-025 | Avisos | Interrupciones y cortes programados | `/interrupciones` | `por.portal.ver` (antes `por.interrupciones.ver`) | O2 | BASE §25 |
| SM-PWS-026 | Tabbar | Comunidad | `/comunidad` | `por.portal.ver` y, por pestaña, la capability de T09 (`com.wall.ver` para muro y novedades, con alias `com.muro.ver` según T02 §4.4.1; `com.surveys.responder` para encuestas) (antes `com.muro.ver`) | O2 | BASE §46 NOT-002 |
| SM-PWS-027 | Comunidad | Publicación | `/comunidad/:id` | `com.muro.ver` | O2 | CNX §3.8 |
| SM-PWS-028 | Comunidad | Guardados | `/comunidad/guardados` | `com.muro.ver` | O2 | CNX §5.1 |
| SM-PWS-029 | Comunidad | Boletines | `/boletines` | `com.wall.ver` (antes `com.boletines.ver`) | O2 | CNX §6.1 |
| SM-PWS-030 | Comunidad | Encuestas | `/encuestas` | `com.encuestas.responder` | O2 | CNX §7.1 |
| SM-PWS-031 | Avisos | Avisos | `/avisos` | `com.inbox.ver` (antes `com.avisos.ver`) | O2 | CNX §6.3; RN-10 §3.6 |
| SM-PWS-032 | Perfil | Perfil | `/perfil` | `por.perfil.editar` (antes `por.perfil.ver`) | O2 | — |
| SM-PWS-033 | Perfil | Mis datos | `/perfil/datos` | `por.perfil.editar` | O2 | BASE §25 |
| SM-PWS-034 | Perfil | Autorizados | `/perfil/autorizados` | `por.representaciones.gestionar` (antes `por.autorizados.ver`) | O2 | BASE §25 |
| SM-PWS-035 | Perfil | Preferencias de comunicación | `/perfil/comunicaciones` | `por.preferencias.editar` | O2 | BASE §25 |
| SM-PWS-036 | Perfil | Preferencias de la app | `/perfil/preferencias` | `uxd.preferencias.editar` | O0 | PAN-UXD-08 |
| SM-PWS-037 | Perfil | Seguridad (contraseña, 2FA, dispositivos) | `/perfil/seguridad` | `iam.miCuenta.gestionar` (antes `iam.cuentaPropia.editar`) | O1 | CNX §2.5 |
| SM-PWS-038 | Otros | Servicios sociales | `/sociales` | `soc.mi.ver` (antes `soc.portal.ver`) | O10 | BASE §24 |
| SM-PWS-039 | Otros | Capital y asambleas | `/institucional` | `ins.mi.ver` (antes `ins.portal.ver`) | O10 | BASE §27 |
| SM-PWS-040 | Otros | Ayuda | `/ayuda` | `por.portal.ver` (antes `por.inicio.ver`) | O2 | CNX §3.8 |
| SM-PWS-041 | Otros | Asistente | `/asistente` | `por.asistente.ver` (flag `pwa.asistente`) | O11 | CNX §3.3 (PA-UXD-16) |

#### 10.8.3 PWA empleado (misma PWA, espacio "Mi trabajo")

| ID | Grupo | Ítem | Ruta | Capability | Ola | Origen |
|---|---|---|---|---|---|---|
| SM-PWE-001 | Tabbar | Inicio (muro interno) | `/trabajo` | `com.muro.ver` | O2 | BASE §46 NOT-003 |
| SM-PWE-002 | Menú (antes Tabbar; la tabbar del empleado es la de M19 §10.1) | Bandeja | `/trabajo/bandeja` | `wfl.tareas.ver` | O2 | BASE §102.5.6 |
| SM-PWE-003 | Trabajo | Casos asignados | `/trabajo/casos` | `crm.casos.ver` | O2 | BASE CU-ACC-01 |
| SM-PWE-004 | Trabajo | Aprobaciones | `/trabajo/aprobaciones` | `wfl.aprobaciones.decidir` (antes `wfl.aprobaciones.ver`) | O1 | CNX §3.8 |
| SM-PWE-005 | Menú (antes Tabbar; la tabbar del empleado es la de M19 §10.1) | Agenda | `/trabajo/agenda` | `wfl.agenda.ver` | O2 | CNX §3.8 |
| SM-PWE-006 | Menú (antes Tabbar; la tabbar del empleado es la de M19 §10.1) | Avisos | `/trabajo/avisos` | `com.inbox.ver` (antes `com.avisos.ver`) | O2 | CNX §6.3 |
| SM-PWE-007 | Supervisión | Pendientes sin asignar y excepciones | `/trabajo/supervision` | `wfl.bandeja.supervisar` (antes `wfl.supervision.ver`) | O2 | BASE §102.5.6 |
| SM-PWE-008 | Supervisión | Indicadores del equipo | `/trabajo/indicadores` | `bia.tableros.ver` (antes `bia.equipo.ver`) | O11 | CNX §4.5 |
| SM-PWE-009 | Supervisión | Publicar al equipo (modal) | modal | `com.publicaciones.crear` | O2 | CNX §5.1 |
| SM-PWE-010 | Supervisión | Encuesta rápida al equipo (modal) | modal | `com.surveys.rapidaEquipo` (antes `com.encuestas.crear`) | O2 | CNX §7.1 |
| SM-PWE-011 | Comunicación | Encuestas | `/trabajo/encuestas` | `com.encuestas.responder` | O2 | CNX §7.1 |
| SM-PWE-012 | Comunicación | Boletines | `/trabajo/boletines` | `com.wall.ver` (antes `com.boletines.ver`) | O2 | CNX §6.1 |
| SM-PWE-013 | Tabbar | Mis recibos de sueldo | `/trabajo/recibos` | `sue.portal.recibos.ver` (antes `sue.portal.ver`) | O9 | Maestro §7.2; VAR 3122, 3166; slot 2 de la tabbar del empleado (10.1.4; grupo antes Personal) |
| SM-PWE-014 | Personal | Firmar recibo | `/trabajo/recibos/:id/firmar` | `sue.portal.recibos.ver` (antes `sue.portal.firmar`) | O9 | VAR 3122, 3166 |
| SM-PWE-015 | Personal | Directorio | `/trabajo/directorio` | `iam.directorio.ver` | O2 | CNX §3.8 |
| SM-PWE-016 | Tabbar | Perfil y preferencias | `/perfil` | `por.perfil.editar` (antes `uxd.preferencias.editar`) | O0 | Slot 4 de la tabbar del empleado (10.1.4; grupo antes Perfil) |
| SM-PWE-017 | Otros | Asistente | `/asistente` | `wfl.asistente.ver` (flag) | O11 | CNX §3.3 |

#### 10.8.4 PWA campo (técnico, lecturista, cobrador; offline-first)

| ID | Grupo | Ítem | Ruta | Capability | Ola | Rol | Origen |
|---|---|---|---|---|---|---|---|
| SM-PWC-001 | Tabbar | Hoy (mi día) | `/campo/mi-dia` | `tec.campo.ver` \| `med.campo.leer` (antes `med.campo.ver`) \| `cob.cobranzaCampo.ver` (antes `cob.campo.ver`) | O3 | todos | CNX §3.8 `/mi-dia`; maestro §9.3 |
| SM-PWC-002 | Tabbar | Órdenes | `/campo/ordenes` | `tec.ordenes.ejecutar` | O3 | técnico | DFA M27 |
| SM-PWC-003 | Órdenes | Ejecución de orden | `/campo/ordenes/:id` | `tec.ordenes.ejecutar` | O3 | técnico | CNX §3.7 |
| SM-PWC-004 | Órdenes | Instalación integral (equipo, firma, encuesta) | `/campo/ordenes/:id/instalacion` | `tec.ordenes.editar` (antes `tec.instalaciones.ejecutar`) | O3 | técnico | BASE §73 |
| SM-PWC-005 | Órdenes | Cortes y reconexiones | `/campo/cortes` | `tec.ordenes.editar` (antes `mor.cortes.ejecutar`) | O6 | técnico | CNX §3.7 |
| SM-PWC-006 | Órdenes | Inspecciones y relevamientos | `/campo/inspecciones` | `tec.inspecciones.gestionar` (antes `tec.inspecciones.ejecutar`) | O3 | técnico | CNX §7.8 |
| SM-PWC-007 | Órdenes | Reclamo en campo (modal) | modal | `crm.casos.crear` (antes `crm.reclamos.crear`) | O3 | técnico | — |
| SM-PWC-008 | Órdenes | Incidente con foto y GPS | `/campo/alarma` | `tec.ordenes.crear` (antes `tec.incidentes.crear`) | O3 | todos | CNX §3.8 `/alarma` |
| SM-PWC-009 | Tabbar | Rutas de lectura | `/campo/rutas` | `med.campo.leer` (antes `med.lecturas.ejecutar`) | O7 | lecturista | BASE §1 P-Móvil |
| SM-PWC-010 | Rutas | Toma de lectura | `/campo/rutas/:id/lectura` | `med.campo.leer` (antes `med.lecturas.ejecutar`) | O7 | lecturista | P-Móvil: rango, observaciones, GPS |
| SM-PWC-011 | Rutas | Lectura fuera de ruta (modal) | modal | `med.campo.leer` (antes `med.lecturas.ejecutar`) | O7 | lecturista | — |
| SM-PWC-012 | Tabbar | Cobranza en domicilio | `/campo/cobranza` | `cob.cobranzaCampo.ver` (antes `cob.cobranzaCampo.crear`) | O5 | cobrador | DFA M27 |
| SM-PWC-013 | Cobranza | Rendición | `/campo/rendicion` | `cob.cobranzaCampo.ver` (antes `cob.rendicion.crear`) | O5 | cobrador | — |
| SM-PWC-014 | Tabbar | Stock en vehículo | `/campo/stock` | `stk.miStock.ver` (antes `stk.vehiculo.ver`) | O3 | técnico | Maestro §9.3 |
| SM-PWC-015 | Herramientas | Mapa | `/campo/mapa` | `tec.mapa.ver` | O3 | todos | CNX §2.1 (Leaflet + Google Maps/Waze) |
| SM-PWC-016 | Tabbar | Sincronización | `/campo/sync` | `tec.campo.ver` \| `med.campo.leer` (antes `med.campo.ver`) \| `cob.cobranzaCampo.ver` (antes `cob.campo.ver`) | O3 | todos | CNX §3.7 |
| SM-PWC-017 | Herramientas | Viajes (chofer) | `/campo/viajes` | `soc.mi.viajes.ver` (antes `soc.traslados.ejecutar`) | O10 | chofer | DFA M23 |
| SM-PWC-018 | Perfil | Perfil y preferencias | `/perfil` | `por.perfil.editar` (antes `uxd.preferencias.editar`) | O0 | todos | — |

#### 10.8.5 Landing (`apps/landing`, público por subdominio)

| ID | Ítem | Ruta | Acceso | Ola | Origen |
|---|---|---|---|---|---|
| SM-LND-001 | Inicio | `/` | Público | O2 | BASE MAR-007 |
| SM-LND-002 | Servicios | `/servicios` | Público | O2 | BASE §43.8 |
| SM-LND-003 | Detalle de servicio (requisitos, contratar) | `/servicios/:slug` | Público | O2 | BASE §43.8 |
| SM-LND-004 | Noticias | `/noticias` | Público | O2 | BASE NOT-001 |
| SM-LND-005 | Noticia | `/noticias/:id` | Público | O2 | BASE NOT-001 |
| SM-LND-006 | Registrarme | `/registro` | Público | O2 | BASE §67 |
| SM-LND-007 | Ingresar | `/login` | Público | O0 | BASE MAR-008 |
| SM-LND-008 | Recuperar acceso | `/recuperar` | Público | O0 | CNX §2.5 |
| SM-LND-009 | Consultar deuda | `/consulta` | Público con verificación | O5 | Guía §8 |
| SM-LND-010 | Pagar sin ingresar | `/pagar` | Público con verificación | O5 | Guía §8 |
| SM-LND-011 | Reclamo o solicitud sin ingresar | `/gestion` | Público con verificación | O2 | BASE §47 |
| SM-LND-012 | Seguimiento de gestión por código | `/seguimiento` | Público con código | O2 | BASE §47 |
| SM-LND-013 | Baja de un servicio | `/baja` | Público con verificación | O2 | BASE §43.3, §53 |
| SM-LND-014 | Turno online | `/turnos` | Público | O10 | DFA M21 mejora |
| SM-LND-015 | Trámites y requisitos | `/tramites` | Público | O2 | RN-10 §3.5 |
| SM-LND-016 | Encuesta externa | `/e/:token` | Token | O2 | CNX §7.1 |
| SM-LND-017 | Contacto y sucursales | `/contacto` | Público | O2 | M19 |
| SM-LND-018 | Legales | `/legal/:tipo` | Público | O1 | CNX §3.8 |
| SM-LND-019 | Instalar la app | `/instalar` | Público | O0 | PAN-UXD-14 |

#### 10.8.6 Plataforma (`meta.platformOnly`)

| ID | Grupo | Ítem | Ruta | Capability | Ola | Origen |
|---|---|---|---|---|---|---|
| SM-PLT-001 | Inicio | Dashboard global | `/plataforma` | `pla.dashboard.ver` | O1 | BASE §54; CNX §4.3 |
| SM-PLT-002 | Cooperativas | Tenants | `/plataforma/tenants` | `pla.tenants.ver` | O1 | CNX §4.3 `/suscriptores` |
| SM-PLT-003 | Cooperativas | Alta asistida de tenant | `/plataforma/tenants/nuevo` | `pla.tenants.crear` | O1 | CNX §4.3 (IA propone logo/colores) |
| SM-PLT-004 | Cooperativas | Licencias y packs | `/plataforma/licencias` | `pla.licencias.ver` | O1 | CNX §2.4 |
| SM-PLT-005 | Cooperativas | Contratos SaaS | `/plataforma/contratos` | `pla.contratos.ver` | O1 | Maestro §7.2 Comercial plataforma |
| SM-PLT-006 | Catálogos | Catálogo de módulos | `/plataforma/modulos` | `pla.catalogo.ver` (antes `pla.modulos.ver`) | O1 | CNX `moduleCatalog` |
| SM-PLT-007 | Catálogos | Catálogo global de servicios y plantillas | `/plataforma/servicios` | `cat.capacidades.ver` (antes `pla.servicios.ver`) | O2 | BASE §66, §81 |
| SM-PLT-008 | Catálogos | Tablas comunes (fiscales, índices, geografía) | `/plataforma/tablas` | `pla.cfg.tablasPlataforma.editar` (antes `pla.tablas.ver`) | O1 | Maestro §8 |
| SM-PLT-009 | Catálogos | Conectores de integración | `/plataforma/conectores` | `int.proveedores.configurar` (antes `pla.conectores.ver`) | O1 | T06 |
| SM-PLT-010 | Operación | Soporte y accesos temporales | `/plataforma/soporte` | `pla.soporte.ver` | O1 | AGR-034 |
| SM-PLT-011 | Operación | Salud del sistema | `/plataforma/salud` | `pla.salud.ver` | O0 | CNX §4.3 |
| SM-PLT-012 | Operación | Colas y jobs | `/plataforma/jobs` | `pla.jobs.ver` | O0 | DEC-003 |
| SM-PLT-013 | Operación | Respaldos y restauración | `/plataforma/respaldos` | `pla.backups.ver` (antes `pla.respaldos.ver`) | O1 | DFA M1 mejora (Copia de Seguridad) |
| SM-PLT-014 | Operación | Ambientes | `/plataforma/ambientes` | `pla.sandbox.crear` (antes `pla.ambientes.ver`) | O1 | AGR-035 |
| SM-PLT-015 | Operación | Versiones del producto | `/plataforma/versiones` | `pla.releases.ver` (antes `pla.versiones.ver`) | O1 | DFA M1 (Actualizar → Reemplazado) |
| SM-PLT-016 | Seguridad | Usuarios de plataforma | `/plataforma/usuarios` | `iam.plataforma.usuarios.gestionar` (antes `pla.usuarios.ver`) | O1 | BASE §42 |
| SM-PLT-017 | Seguridad | Auditoría de plataforma | `/plataforma/auditoria` | `pla.auditoria.ver` | O1 | BASE §54 |
| SM-PLT-018 | Experiencia | Diccionario base y plantillas | `/plataforma/experiencia/diccionario-base` | `uxd.plataforma.diccionarioBase.ver` (antes `plt.uxd.diccionarioBase.ver`) | O0 | PAN-UXD-09 |
| SM-PLT-019 | Experiencia | Design system | `/plataforma/experiencia/design-system` | `uxd.plataforma.tokens.ver` (antes `plt.uxd.tokens.ver`) | O0 | PAN-UXD-10 |
| SM-PLT-020 | Experiencia | Flags globales | `/plataforma/experiencia/flags` | `uxd.plataforma.flags.configurar` (antes `plt.uxd.flags.configurar`) | O0 | PAN-UXD-11 |

**Totales del mapa del sitio:** admin 254 ítems (18 clusters, 63 grupos), PWA socio 41, PWA empleado 17, PWA campo 18, landing 19, plataforma 20 → **369 ítems**, cada uno con su clave `nav.item.*` (369 claves de navegación adicionales a las 359 de 10.7, más 18 `nav.cluster.*` y 63 `nav.grupo.*` del admin).

### 10.9 Índice de pantallas de los anexos y alineación de rutas y capabilities

Las tablas de 10.8 fijan el **qué** (ítem, cluster, grupo, texto, ola y trazabilidad ProCoop). Esta subsección fija el **dónde** y el **con qué permiso**: vincula cada ítem con la pantalla (`PAN-*`) del anexo dueño y agrega los ítems que faltaban para que toda pantalla navegable de los anexos M01–M19 y T01–T11 tenga entrada en el mapa. El `siteMapGroups` se genera desde 10.8 + 10.9.

#### 10.9.1 Reglas de alineación

| Regla | Contenido |
|---|---|
| AL-01 Prevalencia | La **ruta** y la **capability** de una pantalla las define el anexo dueño del dominio (columna "PAN principal"). Si difieren de 10.8, prevalece 10.9 (CTR-UXD-17). La clave de texto `nav.item.*` de los ítems de 10.8 **no cambia** (es identificador estable de texto); los ítems nuevos derivan su clave de la capability canónica y, si colisiona con otra, agregan el último segmento de la ruta (`nav.item.fac.comprobantes.administracionPublica`). |
| AL-02 Base del admin | Las rutas de 10.8.1 son relativas a `/admin/`. Las rutas de los anexos que no empiezan con `/admin/` (`/cob/…`, `/crm/…`, `/med/…`, `/ven/…`, `/cmp/…`, `/stk/…`, `/con/…`, `/sue/…`, `/ins/…`, `/soc/…`, `/inicio/…`, `/configuracion/…`, `/operaciones`, `/expedientes/…`, `/tramites/instancias`, `/bi/…`) se normalizan anteponiendo `/admin` (CTR-UXD-18). |
| AL-03 Plataforma | Base canónica `/admin/plataforma/` (T01). `/platform/…`, `/admin/platform/…` y `/plataforma/…` se normalizan a `/admin/plataforma/…` conservando el resto del camino (CTR-UXD-19). |
| AL-04 PWA socio y empleado | Base canónica `/app/` (M19 dueño del shell). Si M19 y otro anexo describen la misma pantalla, la **ruta** es la de M19 y la **capability** la del anexo del dominio. Rutas de otros anexos sin `/app` se normalizan anteponiendo `/app`; las de M16 `/empleado/…` pasan a `/app/empleado/…` (CTR-UXD-20). Pantallas del empleado (PA-SUE-16 de M16; antes "PA 17 asumida"): PAN-SUE-41 a PAN-SUE-46 son de M16, dueño del contenido y de la capability; M19 las incrusta en su shell con PAN-POR-69 a PAN-POR-74 y publica la ruta `/app/empleado/…` (la regla general de ruta de M19 se mantiene; antes "M16 define pantalla, ruta (normalizada a `/app/empleado/…`) y capability"). |
| AL-05 PWA campo | Base canónica `/app/campo/` (POR-77). `/field/x` → `/app/campo/x`; `/campo/x` → `/app/campo/x`; `/cobrador` → `/app/campo/cobrador`; `/reparto` → `/app/campo/reparto`; `/ot/:id/x` y `/campo/ot/:id/x` → `/app/campo/work-orders/:id/x` (CTR-UXD-21). |
| AL-06 Landing | Rutas relativas al subdominio del tenant; el prefijo `/<tenantSlug>`, `/:tenantSlug`, `/p/:tenantSlug` o `/t/:tenantSlug` solo se usa en el dominio genérico y se omite en las tablas (CTR-UXD-22). |
| AL-07 Pantallas sin ítem | Modales, pestañas, componentes y overlays (por ejemplo PER-04, PER-06, PER-11, PER-12, PER-16, PER-17, PER-19, CAT-16, CAT-25, MED-04, MED-13, FAC-12, FAC-15, FAC-40, FIS-41, MOR-15 a MOR-18, MOR-20, TEC-06, TEC-33, TEC-37, TES-03, TES-15, TES-20, IAM-08, IAM-16, IAM-30, IAM-31, CFG-30 a CFG-32, COM-02, COM-09, COM-11, COM-20, COM-22, MIG-20) no tienen ítem propio: se listan como "asociadas" del ítem desde el que se abren. MOR-42 es API externa sin interfaz. UXD-12 (`/sin-acceso`) es vista de sistema que se muestra al denegar una ruta y no tiene ítem. Antes se citaban aquí COM-26 y COM-27; en T09 son pantallas con ítem (canales y avisos de corte, SM-ADM-365 y SM-ADM-364). |
| AL-08 Visibilidad con capability comodín | Si el anexo declara `mod.*.ver` (FIS-40; antes también MOR-37), el ítem es visible con cualquier capability `ver` del módulo. Si declara `mod.recurso.*`, el ítem es visible con cualquier capability de ese recurso (antes MOR-19, MOR-23 y MOR-33 a MOR-35; M08 ahora declara capabilities concretas y sus ítems usan la de `ver`, AL-01). Si la pantalla es "sesión" (sin capability), el ítem es visible para todo usuario autenticado del canal. |
| AL-09 Parámetros de consulta y segmentos opcionales | Un ítem cuya ruta agrega parámetros de consulta (`?tab=`, `?vista=`, `?origen=`, `?libro=`, `?tipo=`, `?canal=`) abre la pantalla del anexo en una pestaña o con un filtro precargado; la ruta canónica es la del anexo sin parámetros (por ejemplo CAT-04 `/admin/cat/services/:id`, FIS-29 `/admin/fis/vat-ledger`). Un segmento opcional `(/:id)` cubre lista y detalle de la misma pantalla. |
| AL-10 Pantallas relacionadas de otra app y transversales | Una pantalla de otra app que se cita en un ítem se marca "relacionada (otra app)" con el ítem propio que la contiene; no cuenta como pantalla del ítem. Las pantallas de identidad de T02 (IAM-02 a IAM-06: ingreso, MFA, selección de alcance, recuperación e invitación) son **transversales**: las usan todas las apps y se citan como "transversal" en el ítem de ingreso de cada canal. |
| AL-11 Numeración de comunidad | Los IDs `PAN-COM-*` son los de T09 (PAN-COM-01 a PAN-COM-34 admin y plataforma; PAN-COM-40 a PAN-COM-53 PWA, enlaces y landing). Las citas anteriores a la corrección del 05-11-2026 que usaban PAN-COM-30 a PAN-COM-39 para la PWA se reemplazaron por el ID de T09 y se conserva la cita anterior entre paréntesis ("antes COM-xx"). |

#### 10.9.2 Admin: alineación de los ítems de 10.8.1

| SM | PAN principal | Ruta canónica | Capability canónica | PAN asociadas / nota |
|---|---|---|---|---|
| SM-ADM-001 | BIA-10 | `/admin/tableros/:code` (`/admin/inicio` redirige al tablero del rol) | `bia.tableros.ver` | — |
| SM-ADM-002 | WFL-01 | `/admin/inicio/bandeja` | `wfl.tareas.ver` | WFL-03 |
| SM-ADM-003 | UXD-17 (este anexo; antes "— (vista UXD de alertas activas)") | `/admin/inicio/alertas` | `bia.tableros.ver` | Alimentada por BIA-14, FIS-09 y NFR-07 |
| SM-ADM-004 | COM-32 (antes COM-28, que en T09 es el consumo de mensajería) | `/admin/avisos` | sesión | — (antes COM-33, que en T09 son los avisos de plataforma de SM-PLT-023) |
| SM-ADM-005 | BIA-10 (código `control`) | `/admin/tableros/control` | `bia.tableros.ver` | BIA-12 |
| SM-ADM-006 | PER-03 | `/admin/per/personas` | `per.personas.ver` | PER-04, PER-16 |
| SM-ADM-007 | PER-01 | `/admin/per/titulares` | `per.titulares.ver` | PER-02, PER-11, PER-12, PER-17, PER-19, CRM-05 |
| SM-ADM-008 | PER-05 | `/admin/per/cuentas/:accountId` (listado desde PER-01) | `per.cuentas.ver` | — |
| SM-ADM-009 | FAC-25 | `/admin/fac/grupos` | `fac.grupos.ver` | Dueño M05 |
| SM-ADM-010 | PER-07 | `/admin/per/inmuebles` | `per.inmuebles.ver` | PER-06 |
| SM-ADM-011 | PER-09 (pestaña de PER-02) | `/admin/per/titulares/:holderId?tab=relaciones` | `per.relaciones.ver` | POR-90 |
| SM-ADM-012 | PER-10 (pestaña de PER-02) | `/admin/per/titulares/:holderId?tab=adherentes` | `soc.adherentes.ver` (PAN-PER-10, AL-01; antes `per.adherentes.ver`) | CAT-20, SOC-01 |
| SM-ADM-013 | PER-13 | `/admin/per/documentacion` | `per.documentacion.ver` | — |
| SM-ADM-014 | PER-18 | `/admin/per/duplicados` | `per.duplicados.ver` | MIG-11 |
| SM-ADM-015 | PER-20 | `/admin/per/padron` | `per.padron.ver` | BIA-01 (filtro módulo PER) |
| SM-ADM-016 | PER-22 | `/admin/per/configuracion` | `per.configuracion.configurar` | — |
| SM-ADM-017 | CAT-03 | `/admin/cat/services` | `cat.servicios.ver` | CAT-04, CAT-05, CAT-10, CAT-26 |
| SM-ADM-018 | CAT-07 | `/admin/cat/plans` | `cat.planes.ver` | — |
| SM-ADM-019 | CAT-06 | `/admin/cat/products` | `cat.productos.ver` | — |
| SM-ADM-020 | CAT-08 | `/admin/cat/categories` | `cat.categorias.ver` | — |
| SM-ADM-021 | CAT-09 | `/admin/cat/classes-properties` | `cat.clases.ver` | — |
| SM-ADM-022 | CAT-04 (pestaña Requisitos; ruta del anexo `/admin/cat/services/:id`, AL-09) | `/admin/cat/services/:id` (pestaña Requisitos con `?tab=requisitos`; ruta del anexo, AL-01; antes `/admin/cat/services/:id?tab=requisitos`) | `cat.servicios.configurar` | POR-87 |
| SM-ADM-023 | CAT-18 | `/admin/cat/copies` | `cat.copias.ejecutar` | — |
| SM-ADM-024 | CAT-13 | `/admin/cat/contracts` | `cat.contratos.ver` | CAT-14, CAT-15, CAT-16, CAT-25 |
| SM-ADM-025 | CAT-17 | `/admin/cat/bulk-operations` | `cat.masivos.ejecutar` | — |
| SM-ADM-026 | MED-02 | `/admin/med/medidores` | `med.medidores.ver` | MED-03, MED-04 |
| SM-ADM-027 | MED-05 | `/admin/med/rutas` | `med.rutas.ver` | MED-06 |
| SM-ADM-028 | MED-09 | `/admin/med/lecturas/registro` | `med.lecturas.crear` | MED-08, MED-10 |
| SM-ADM-029 | MED-11 | `/admin/med/excepciones` | `med.excepciones.ver` | MED-12, MED-13, MED-35 |
| SM-ADM-030 | MED-14 | `/admin/med/consumos/estimacion` | `med.consumos.estimar` | MED-15, MED-17 |
| SM-ADM-031 | MED-11 (filtro origen autolectura, AL-09) | `/admin/med/excepciones?origen=autolectura` | `med.excepciones.ver` | relacionada (PWA socio, AL-10): MED-32, ítem SM-PWS-015 |
| SM-ADM-032 | MED-24 | `/admin/med/telemedicion/operaciones` | `med.telemedicion.ver` | — |
| SM-ADM-033 | MED-23 | `/admin/med/config/telemedicion` | `med.telemedicion.configurar` | — |
| SM-ADM-034 | MED-25 | `/admin/med/prepago` | `med.prepago.ver` | — |
| SM-ADM-035 | MED-22 | `/admin/med/informes` | `med.informes.ver` | MED-27 |
| SM-ADM-036 | TAR-01 | `/admin/tarifas/cuadros` | `tar.cuadros.ver` | TAR-02 a TAR-05, TAR-09, TAR-10, TAR-21, TAR-29 |
| SM-ADM-037 | TAR-18 | `/admin/tarifas/cargos-evento` | `tar.eventos.ver` | CAT-12, TAR-28 |
| SM-ADM-038 | TAR-06 | `/admin/tarifas/reglas` | `tar.reglas.ver` | TAR-07, TAR-08 |
| SM-ADM-039 | TAR-14 | `/admin/tarifas/promociones` | `tar.promociones.ver` | TAR-11, TAR-26 |
| SM-ADM-040 | TAR-12 | `/admin/tarifas/subsidios` | `tar.subsidios.ver` | TAR-13 |
| SM-ADM-041 | TAR-15 | `/admin/tarifas/simulador` | `tar.simulador.ejecutar` | TAR-16, TAR-17, TAR-22 |
| SM-ADM-042 | FAC-02 | `/admin/fac/ciclos` | `fac.ciclos.ver` | FAC-03, FAC-04, FAC-39 |
| SM-ADM-043 | FAC-05 | `/admin/fac/lotes` | `fac.lotes.ver` | FAC-06, FAC-07 |
| SM-ADM-044 | FAC-08 | `/admin/fac/excepciones` | `fac.excepciones.ver` | FAC-42 |
| SM-ADM-045 | FAC-09 | `/admin/fac/comprobantes` | `fac.comprobantes.ver` | FAC-10, FAC-11, FAC-12, FAC-15, FAC-16, FAC-17 |
| SM-ADM-046 | FIS-09 | `/admin/fis/authorizations` | `fis.autorizaciones.ver` | FIS-10, FIS-11 |
| SM-ADM-047 | FAC-14 | `/admin/fac/anulaciones` | `fac.comprobantes.anular` | FAC-13 |
| SM-ADM-048 | FAC-21 | `/admin/fac/cargos` | `fac.cargos.crear` | FAC-36 (informe de movimiento de conceptos) |
| SM-ADM-049 | FAC-31 | `/admin/fac/distribucion` | `fac.distribucion.ver` | FAC-32, FAC-33, FAC-34 |
| SM-ADM-050 | FAC-36 | `/admin/fac/reportes` | `fac.reportes.ver` | — |
| SM-ADM-051 | FIS-29 (filtro ventas, AL-09) | `/admin/fis/vat-ledger` (filtro `?libro=ventas`; ruta del anexo, AL-01; antes `/admin/fis/vat-ledger?libro=ventas`) | `fis.libroIva.ver` | FIS-30 |
| SM-ADM-052 | FIS-29 (filtro compras, AL-09) | `/admin/fis/vat-ledger?libro=compras` | `fis.libroIva.ver` | FIS-30 |
| SM-ADM-053 | FIS-19 | `/admin/fis/taxes` | `fis.impuestos.configurar` | FIS-17, FIS-18, FIS-20, FIS-22 |
| SM-ADM-054 | FIS-24 | `/admin/fis/withholding/types` | `fis.retenciones.configurar` | FIS-06, FIS-25, FIS-27 |
| SM-ADM-055 | FIS-21 | `/admin/fis/registries` | `fis.padrones.importar` | FIS-23, CFG-10, CFG-19 |
| SM-ADM-056 | FIS-31 | `/admin/fis/filings` | `fis.regimenes.generar` | FIS-28, FIS-32 |
| SM-ADM-057 | FIS-33 | `/admin/fis/third-parties/agreements` | `fis.terceros.configurar` | FIS-34, COB-30 |
| SM-ADM-058 | FIS-35 | `/admin/fis/regulatory` | `fis.reguladores.ver` | FIS-36 |
| SM-ADM-059 | FIS-08 | `/admin/fis/points-of-sale` | `fis.puntosVenta.configurar` | FIS-07, FIS-12 a FIS-16, FIS-39, FAC-24 |
| SM-ADM-060 | COB-01 | `/admin/cob/cuentas/:currentAccountId` | `cob.cuentas.ver` | COB-02, COB-03, COB-05, COB-06, COB-07 |
| SM-ADM-061 | COB-09 | `/admin/cob/caja/apertura` | `cob.caja.abrir` (antes `cob.cajas.abrir`) | COB-12, COB-13 |
| SM-ADM-062 | COB-10 | `/admin/cob/caja/cobro` | `cob.caja.cobrar` | COB-11, COB-14, COB-33 |
| SM-ADM-063 | COB-15 | `/admin/cob/config/medios` | `cob.medios.configurar` | COB-16, COB-31, COB-32 |
| SM-ADM-064 | COB-17 | `/admin/cob/config/entes` | `cob.entes.configurar` | COB-18, COB-19, COB-20 |
| SM-ADM-065 | COB-21 | `/admin/cob/debitos/adhesiones` | `cob.debitos.ver` | COB-22 |
| SM-ADM-066 | COB-23 | `/admin/cob/config/pasarelas` | `cob.pasarelas.configurar` | COB-24, COB-25 |
| SM-ADM-067 | COB-27 | `/admin/cob/conciliacion` | `cob.conciliacion.ver` | — |
| SM-ADM-068 | COB-04 | `/admin/cob/no-identificados` | `cob.noIdentificados.ver` | — |
| SM-ADM-069 | COB-26 | `/admin/cob/devoluciones` | `cob.devoluciones.solicitar` | — |
| SM-ADM-070 | COB-36 | `/admin/cob/reportes` | `cob.reportes.ver` | — |
| SM-ADM-071 | MOR-13 | `/admin/mor/candidatos` | `mor.candidatos.generar` | — |
| SM-ADM-072 | MOR-14 | `/admin/mor/notificaciones` | `mor.notificaciones.ver` | MOR-15, MOR-16, MOR-17, MOR-21 |
| SM-ADM-073 | MOR-19 | `/admin/mor/tratamiento` | `mor.tratamiento.ver` (acciones con `mor.tratamiento.ejecutar`; AL-01, M08; antes `mor.tratamiento.*` por AL-08) | MOR-18, MOR-20 |
| SM-ADM-074 | MOR-12 | `/admin/mor/modelos-aviso` | `mor.modelosAviso.configurar` | MOR-14 (pestaña envíos) |
| SM-ADM-075 | MOR-27 | `/admin/mor/interrupciones` | `mor.interrupciones.ver` | MOR-24, MOR-25, MOR-28 |
| SM-ADM-076 | MOR-11 | `/admin/mor/instancias` | `mor.instancias.configurar` | MOR-10 |
| SM-ADM-077 | MOR-23 | `/admin/mor/excepciones` | `mor.excepciones.ver` (acciones con `mor.excepciones.editar` y `mor.excepciones.aprobar`; AL-01, M08; antes `mor.excepciones.*` por AL-08) | — |
| SM-ADM-078 | MOR-26 | `/admin/mor/causas` | `mor.causas.configurar` | — |
| SM-ADM-079 | MOR-02 | `/admin/mor/politicas-interes` | `mor.politicasInteres.ver` | MOR-03 a MOR-09 |
| SM-ADM-080 | MOR-31 | `/admin/mor/convenios` | `mor.convenios.ver` | MOR-29, MOR-30, MOR-32 |
| SM-ADM-081 | MOR-33 | `/admin/mor/garantias` | `mor.garantias.ver` (acciones con `mor.garantias.editar`; AL-01, M08; antes `mor.garantias.*` por AL-08) | — |
| SM-ADM-082 | MOR-35 | `/admin/mor/incobrables` | `mor.incobrables.ver` (acciones con `mor.incobrables.proponer` y `mor.incobrables.aprobar`; AL-01, M08; antes `mor.incobrables.*` por AL-08) | MOR-36 |
| SM-ADM-083 | MOR-34 | `/admin/mor/gestion-externa` | `mor.gestionExterna.ver` (acciones con `mor.gestionExterna.editar` y `mor.gestionExterna.registrarAvance`; AL-01, M08; antes `mor.gestionExterna.*` por AL-08) | MOR-42 (API para estudios) |
| SM-ADM-084 | MOR-37 | `/admin/mor/informes` | `mor.informes.ver` (exportar con `mor.informes.exportar`; AL-01, M08; antes `mor.*.ver` por AL-08) | — |
| SM-ADM-085 | CRM-02 | `/admin/crm/bandeja` | `crm.casos.ver` | CRM-03, CRM-06 |
| SM-ADM-086 | CRM-04 | `/admin/crm/carga-rapida` | `crm.casos.crear` | — (antes TEC-49, que M10 marca reemplazada por M09) |
| SM-ADM-087 | CRM-02 (filtro solicitudes) | `/admin/crm/bandeja?clase=solicitud` | `crm.casos.ver` | — |
| SM-ADM-088 | CRM-02 (filtro reclamos) | `/admin/crm/bandeja?clase=reclamo` | `crm.casos.ver` | — |
| SM-ADM-089 | POR-97 | `/admin/portal/presentaciones` | `por.formularios.ver` | WFL-08 |
| SM-ADM-090 | CRM-10 | `/admin/crm/conversaciones` | `crm.conversaciones.atender` | — |
| SM-ADM-091 | CRM-09 | `/admin/crm/mesa-entradas` | `crm.mesaEntradas.ver` | WFL-15 |
| SM-ADM-092 | CRM-07 | `/admin/crm/incidentes` | `crm.incidentes.ver` | CRM-08 |
| SM-ADM-093 | CRM-27 | `/admin/crm/turnero/config` | `crm.turnero.configurar` | — |
| SM-ADM-094 | CRM-24 | `/admin/crm/turnero/box` | `crm.turnero.llamar` | — |
| SM-ADM-095 | CRM-23 | `/admin/crm/turnero/recepcion` | `crm.turnero.emitir` | — |
| SM-ADM-096 | CRM-28 | `/admin/crm/turnero/estadisticas` | `crm.reportes.ver` | — |
| SM-ADM-097 | CRM-29 | `/admin/crm/actividades` | `crm.actividades.ver` | CRM-30, CRM-31 |
| SM-ADM-098 | CRM-29 (vista informe) | `/admin/crm/actividades?vista=informe` | `crm.actividades.ver` | — |
| SM-ADM-099 | CRM-11 | `/admin/crm/config/tipos` | `crm.config.tipos.configurar` | CRM-12 a CRM-18, CRM-20 |
| SM-ADM-100 | CRM-33 | `/admin/crm/tablero` | `crm.bandejaSupervision.ver` | CRM-34 (`/admin/bi/reclamos`) |
| SM-ADM-101 | TEC-11 | `/admin/tec/schedule` | `tec.agenda.gestionar` (antes `tec.schedule.manage`) | TEC-12 |
| SM-ADM-102 | TEC-01 | `/admin/tec/feasibility` | `tec.factibilidad.ver` (antes `tec.feasibility.read`) | TEC-02, TEC-03 |
| SM-ADM-103 | TEC-04 | `/admin/tec/work-orders` | `tec.ordenes.ver` (antes `tec.workOrder.read`) | TEC-05 a TEC-09, TEC-22, TEC-23 |
| SM-ADM-104 | TEC-10 | `/admin/tec/dispatch` | `tec.despacho.gestionar` (antes `tec.dispatch.manage`) | — |
| SM-ADM-105 | TEC-13 | `/admin/tec/crews` | `tec.cuadrillas.gestionar` (antes `tec.crew.manage`) | TEC-14, TEC-16 |
| SM-ADM-106 | TEC-25 | `/admin/tec/installations` | `tec.instalaciones.ver` (antes `tec.installation.read`) | — |
| SM-ADM-107 | TEC-36 | `/admin/tec/provisioning/systems` | `tec.aprovisionamiento.configurar` (antes `tec.provisioning.configure`) | TEC-37, TEC-38 |
| SM-ADM-108 | TEC-42 | `/admin/tec/phone/plant` | `tec.telefonia.redFisica.ver` (antes `tec.phone.plant`) | TEC-43, TEC-44, TEC-46 |
| SM-ADM-109 | TEC-45 | `/admin/tec/phone/cdr` | `tec.cdr.importar` (antes `tec.cdr.import`) | TAR-19, TAR-20 |
| SM-ADM-110 | TEC-36 (filtro tecnología TV) | `/admin/tec/provisioning/systems?tecnologia=tv` | `tec.aprovisionamiento.configurar` (antes `tec.provisioning.configure`) | M10 no define pantalla propia de TV |
| SM-ADM-111 | TEC-31 | `/admin/tec/networks/elements` | `tec.redes.gestionar` (antes `tec.network.manage`) | TEC-30, TEC-32, TEC-34, TEC-48 |
| SM-ADM-112 | TEC-39 | `/admin/tec/works` | `tec.obras.gestionar` (antes `tec.work.manage`) | TEC-40 |
| SM-ADM-113 | TEC-47 | `/admin/tec/reports` | `tec.reportes.ver` (antes `tec.report.read`) | — |

| SM-ADM-114 | VEN-02 | `/admin/ven/presupuestos` | `ven.presupuestos.ver` | VEN-03, VEN-21 |
| SM-ADM-115 | VEN-08 | `/admin/ven/ventas` | `ven.ventas.ver` | VEN-09, VEN-12, VEN-13, VEN-22 |
| SM-ADM-116 | VEN-11 | `/admin/ven/pos/sesiones` | `ven.pos.abrir` | VEN-10 |
| SM-ADM-117 | VEN-23 | `/admin/ven/reportes` | `ven.ventas.exportar` | — |
| SM-ADM-118 | CMP-01 | `/admin/cmp/proveedores` | `cmp.proveedores.ver` | CMP-02 |
| SM-ADM-119 | CMP-04 | `/admin/cmp/solicitudes` | `cmp.solicitudes.ver` | CMP-05 |
| SM-ADM-120 | CMP-06 | `/admin/cmp/cotizaciones` | `cmp.cotizaciones.ver` | CMP-07 |
| SM-ADM-121 | CMP-08 | `/admin/cmp/ordenes` | `cmp.ordenes.ver` | CMP-09 |
| SM-ADM-122 | CMP-10 | `/admin/cmp/recepciones` | `cmp.recepciones.registrar` | CMP-24 |
| SM-ADM-123 | CMP-11 | `/admin/cmp/comprobantes` | `cmp.comprobantes.ver` | CMP-12, CMP-13, CMP-17 |
| SM-ADM-124 | CMP-14 | `/admin/cmp/ordenes-pago` | `cmp.ordenesPago.ver` | CMP-15, CMP-18 |
| SM-ADM-125 | FIS-26 | `/admin/fis/withholding/applied` | `fis.retenciones.ver` | Dueño M06 |
| SM-ADM-126 | CMP-22 | `/admin/cmp/reportes` | `cmp.comprobantes.ver` | — |
| SM-ADM-127 | CMP-19 | `/admin/cmp/comunicaciones` | `cmp.proveedores.editar` | — |
| SM-ADM-128 | STK-01 | `/admin/stk/articulos` | `stk.articulos.ver` | STK-02, STK-03, STK-04 |
| SM-ADM-129 | STK-09 | `/admin/stk/documentos` | `stk.movimientos.ver` | STK-10 |
| SM-ADM-130 | STK-11 | `/admin/stk/series` | `stk.series.ver` | STK-12, STK-17, STK-18, STK-19, CAT-19 |
| SM-ADM-131 | STK-08 | `/admin/stk/kardex` | `stk.movimientos.ver` | — |
| SM-ADM-132 | STK-23 | `/admin/stk/revaluaciones` | `stk.revaluaciones.crear` | STK-22, STK-24 |
| SM-ADM-133 | STK-25 | `/admin/stk/bienes-uso` | `stk.bienesUso.ver` | STK-26, STK-27 |
| SM-ADM-134 | STK-32 | `/admin/stk/fabricacion/ordenes` | `stk.fabricacion.ordenes.ver` | STK-31, STK-33, STK-34 |
| SM-ADM-135 | STK-28 | `/admin/stk/rma` | `stk.rma.ver` | STK-29, STK-30 |
| SM-ADM-136 | STK-35 | `/admin/stk/informes` | `stk.informes.ver` | — |
| SM-ADM-137 | TES-02 | `/admin/tes/cuentas` | `tes.cuentas.ver` | TES-03, TES-04 |
| SM-ADM-138 | TES-07 | `/admin/tes/cuentas/:id/libro` | `tes.movimientos.ver` | TES-08 |
| SM-ADM-139 | TES-06 | `/admin/tes/movimientos` | `tes.movimientos.ver` | TES-05, TES-37 |
| SM-ADM-140 | TES-14 | `/admin/tes/valores` | `tes.valores.ver` | TES-15, TES-16, TES-17 |
| SM-ADM-141 | TES-18 | `/admin/tes/chequeras` | `tes.chequeras.ver` | TES-19, TES-20 |
| SM-ADM-142 | TES-22 | `/admin/tes/cupones` | `tes.cupones.ver` | TES-21, TES-23 |
| SM-ADM-143 | TES-24 | `/admin/tes/retenciones-recibidas` | `tes.retencionesRecibidas.ver` | — |
| SM-ADM-144 | TES-25 | `/admin/tes/cajas-pago` | `tes.cajasPago.abrir` | TES-26, TES-27 |
| SM-ADM-145 | TES-29 | `/admin/tes/cierre-caja` | `tes.cierreCaja.cerrar` | TES-28 |
| SM-ADM-146 | TES-09 | `/admin/tes/conciliacion/:cuenta` | `tes.conciliacion.conciliar` | TES-10 |
| SM-ADM-147 | TES-11 | `/admin/tes/interbanking` | `tes.interbanking.configurar` | TES-12, TES-13 |
| SM-ADM-148 | TES-32 | `/admin/tes/flujo` | `tes.flujo.ver` | TES-33, TES-34 |
| SM-ADM-149 | TES-36 | `/admin/tes/informes` | `tes.informes.ver` | — |
| SM-ADM-150 | CON-03 | `/admin/con/planes` | `con.planes.ver` | CON-04 a CON-07, CON-32, CON-38 |
| SM-ADM-151 | CON-10 | `/admin/con/ejercicios` | `con.ejercicios.ver` | CON-11, CON-31 |
| SM-ADM-152 | CON-24 | `/admin/con/centros` | `con.centros.ver` | CON-25, CON-26 |
| SM-ADM-153 | CON-12 | `/admin/con/asientos` | `con.asientos.ver` | CON-13, CON-14, CON-15, CON-18 |
| SM-ADM-154 | CON-08 | `/admin/con/reglas` | `con.reglas.ver` | CON-09, CON-16, CON-17 |
| SM-ADM-155 | CON-20 | `/admin/con/reportes/mayor` | `con.reportes.ver` | — |
| SM-ADM-156 | CON-21 | `/admin/con/reportes/sumas-saldos` | `con.reportes.ver` | CON-36 |
| SM-ADM-157 | CON-40 | `/admin/con/salud` | `con.config.ver` | CON-06, CON-19 |
| SM-ADM-158 | CON-33 | `/admin/con/simulaciones` | `con.simulaciones.ver` | — |
| SM-ADM-159 | CON-34 | `/admin/con/presupuestos` | `con.presupuestos.ver` | CON-35 |
| SM-ADM-160 | CON-22 | `/admin/con/reportes` | `con.reportes.ver` | CON-39 |
| SM-ADM-161 | CON-27 | `/admin/con/reportes/resultado-servicio` | `con.reportes.ver` | — |
| SM-ADM-162 | SUE-02 | `/admin/sue/empleados` | `sue.legajos.ver` | SUE-03, SUE-04, SUE-28 |
| SM-ADM-163 | SUE-05 | `/admin/sue/empresas` | `sue.estructura.configurar` | SUE-06 a SUE-10 |
| SM-ADM-164 | SUE-27 | `/admin/sue/recibos/:id` (listado en SUE-25) | `sue.recibos.ver` | — |
| SM-ADM-165 | SUE-18 | `/admin/sue/novedades` | `sue.novedades.ver` | SUE-17, SUE-19, SUE-20, SUE-21 |
| SM-ADM-166 | SUE-24 | `/admin/sue/liquidaciones` | `sue.liquidaciones.ver` | SUE-14, SUE-23, SUE-25, SUE-40 |
| SM-ADM-167 | SUE-26 | `/admin/sue/simulador` | `sue.liquidaciones.simular` | — |
| SM-ADM-168 | SUE-29 | `/admin/sue/ganancias` | `sue.ganancias.ver` | — |
| SM-ADM-169 | SUE-12 | `/admin/sue/config/variables` | `sue.variables.configurar` | — |
| SM-ADM-170 | SUE-13 | `/admin/sue/config/conceptos` | `sue.conceptos.configurar` | SUE-15 |
| SM-ADM-171 | SUE-16 | `/admin/sue/config/aumentos` | `sue.aumentos.aplicar` | — |
| SM-ADM-172 | SUE-30 | `/admin/sue/presentaciones` | `sue.presentaciones.generar` | — |
| SM-ADM-173 | SUE-38 | `/admin/sue/informes` | `sue.reportes.ver` | SUE-11 |
| SM-ADM-174 | INS-01 | `/admin/ins/asociados` | `ins.asociados.ver` | INS-02 a INS-05, INS-19, INS-27 |
| SM-ADM-175 | INS-07 | `/admin/ins/capital/movimientos` | `ins.capital.ver` | INS-06, INS-08 a INS-13 |
| SM-ADM-176 | INS-18 (entrada desde INS-16 con filtro asamblea) | `/admin/ins/reuniones?tipo=asamblea` | `ins.reuniones.ver` | INS-21, INS-22, INS-29 |
| SM-ADM-177 | INS-15 | `/admin/ins/organos` | `ins.organos.gestionar` | INS-23, INS-24, INS-25 |
| SM-ADM-178 | INS-16 | `/admin/ins/reuniones` | `ins.reuniones.ver` | INS-17 |
| SM-ADM-179 | INS-26 | `/admin/ins/inaes` | `ins.inaes.exportar` | — |
| SM-ADM-180 | SOC-17 | `/admin/soc/vivienda/planes` | `soc.vivienda.configurar` | SOC-18, SOC-19 |
| SM-ADM-181 | SOC-17 (pestaña Materiales) | `/admin/soc/vivienda/planes?tab=materiales` | `soc.vivienda.configurar` | TAR-29 |
| SM-ADM-182 | SOC-20 | `/admin/soc/vivienda/certificados` | `soc.obra.gestionar` | — |
| SM-ADM-183 | SOC-21 | `/admin/soc/vivienda/informes` | `soc.reportes.ver` | — |
| SM-ADM-184 | SOC-07 (entrada desde SOC-05) | `/admin/soc/solicitudes?tipo=sepelio` | `soc.sepelio.gestionar` | — |
| SM-ADM-185 | SOC-09 | `/admin/soc/cementerio/:cemeteryId/plano` | `soc.cementerio.ver` | SOC-10, SOC-11, SOC-12 |
| SM-ADM-186 | SOC-16 | `/admin/soc/autorizaciones` | `soc.autorizaciones.gestionar` | SOC-04 |
| SM-ADM-187 | SOC-13 | `/admin/soc/sangre` | `soc.sangre.ver` | — |
| SM-ADM-188 | SOC-22 | `/admin/soc/flota/vehiculos` | `soc.flota.ver` | SOC-23, SOC-24 |
| SM-ADM-189 | SOC-14 | `/admin/soc/traslados` | `soc.traslados.ver` | — |
| SM-ADM-190 | SOC-15 | `/admin/soc/traslados/informes` | `soc.reportes.ver` | SOC-25 |
| SM-ADM-191 | SOC-26 | `/admin/soc/flota/gps` | `soc.gps.ver` | — |
| SM-ADM-192 | COM-01 | `/admin/com/publicaciones` | `com.posts.ver` | COM-02 (antes también COM-09, que en T09 son las reglas de boletines) |
| SM-ADM-193 | COM-03 | `/admin/com/categorias` | `com.posts.configurar` | — |
| SM-ADM-194 | COM-04 | `/admin/com/moderacion` | `com.moderation.ver` | COM-05 a COM-07 (antes COM-05 a COM-08; COM-08 son los boletines) |
| SM-ADM-195 | COM-08 (antes COM-10, que en T09 son las encuestas) | `/admin/com/boletines` | `com.newsletters.ver` | COM-09 |
| SM-ADM-196 | COM-24 (historial de comunicaciones; antes COM-21, que en T09 son las campañas) | `/admin/com/historial` (antes `/admin/com/comunicaciones`) | `com.communications.ver` | COM-18, COM-23, COM-29, COM-30 (antes COM-20, COM-26 y COM-27) |
| SM-ADM-197 | COM-19 | `/admin/com/plantillas` | `com.templates.ver` | COM-20 |
| SM-ADM-198 | COM-21 (antes COM-17, que en T09 son los segmentos) | `/admin/com/campanas` | `com.campaigns.ver` | COM-22, COM-31 (antes COM-18 y COM-29) |
| SM-ADM-199 | COM-21 (canal SMS, AL-09; antes COM-17) | `/admin/com/campanas?canal=sms` | `com.campaigns.ver` | COM-26, COM-28 (antes COM-25) |
| SM-ADM-200 | COM-03 (pestaña Saludos automáticos, AL-09; antes COM-20, que en T09 son las variables de plantilla) | `/admin/com/categorias?tab=saludos` (antes `/admin/com/catalogo?tipo=saludo`) | `com.posts.configurar` (AL-01; antes `com.catalog.configurar`) | — |
| SM-ADM-201 | COM-10 (antes COM-11, que en T09 es el constructor) | `/admin/com/encuestas` | `com.surveys.ver` | COM-11, COM-13 (antes COM-12) |
| SM-ADM-202 | COM-12 (antes COM-13, que en T09 son las plantillas de encuesta) | `/admin/com/encuestas/:id/resultados` | `com.surveys.resultados` | — |
| SM-ADM-203 | COM-17 (antes COM-16, que en T09 es la validación de canje) | `/admin/com/segmentos` (antes `/admin/com/audiencias`) | `com.audiences.usar` | — |
| SM-ADM-204 | POR-85 | `/admin/portal/landing` | `por.landing.editar` | POR-86 |
| SM-ADM-205 | IAM-25 | `/admin/iam/portal-usuarios` | `iam.portal.usuarios.ver` | POR-90 |
| SM-ADM-206 | POR-87 | `/admin/portal/formularios` | `por.formularios.ver` | POR-88, WFL-07 |
| SM-ADM-207 | POR-85 (bloque de descargas) | `/admin/portal/landing?bloque=descargas` | `por.landing.editar` | POR-08 (lado público) |
| SM-ADM-208 | COB-24 | `/admin/cob/pasarelas/intenciones` | `cob.intenciones.ver` | MED-25 (prepagas) |
| SM-ADM-209 | POR-91 | `/admin/portal/recepcion-publica` | `por.recepcionPublica.ver` | — |
| SM-ADM-210 | POR-84 | `/admin/portal/configuracion` | `por.parametros.configurar` | — |
| SM-ADM-211 | BIA-01 | `/admin/reportes` | `bia.reportes.ver` | BIA-02, BIA-03, BIA-06, BIA-22 |
| SM-ADM-212 | BIA-12 | `/admin/bi/:room` | `bia.bi.ver` | BIA-18 |
| SM-ADM-213 | BIA-09 | `/admin/reportes/disenador` | `bia.disenador.usar` | BIA-08 |
| SM-ADM-214 | BIA-01 (filtro personalizados) | `/admin/reportes?origen=tenant` | `bia.reportes.ver` | — |
| SM-ADM-215 | BIA-05 | `/admin/reportes/programaciones` | `bia.reportes.programar` | — |
| SM-ADM-216 | BIA-04 | `/admin/reportes/exportaciones` | `bia.exportaciones.ver` | — |
| SM-ADM-217 | BIA-15 | `/admin/api/clientes` | `bia.api.clientes.ver` | BIA-16, BIA-17, IAM-24 (CTR-UXD-23) |
| SM-ADM-218 | IAM-09 | `/admin/iam/usuarios` | `iam.usuarios.ver` | IAM-10, IAM-31 |
| SM-ADM-219 | IAM-11 | `/admin/iam/roles` | `iam.roles.ver` | — |
| SM-ADM-220 | IAM-12 | `/admin/iam/perfiles` | `iam.perfiles.ver` | — |
| SM-ADM-221 | IAM-10 (pestaña Alcances) | `/admin/iam/usuarios/:id?tab=alcances` | `iam.usuarios.ver` | — |
| SM-ADM-222 | IAM-18 | `/admin/auditoria/accesos` | `iam.auditoria.accesos.ver` | — |
| SM-ADM-223 | IAM-17 | `/admin/auditoria/cambios` | `iam.auditoria.cambios.ver` | IAM-19, IAM-20, IAM-21 |
| SM-ADM-224 | IAM-29 | `/admin/iam/sesiones` | `iam.sesiones.ver` | — |
| SM-ADM-225 | CFG-01 | `/admin/cfg` | `cfg.parametros.ver` | — |
| SM-ADM-226 | CFG-34 (antes "CFG-08 (tabla sucursales)"; T04 define pantalla propia) | `/admin/cfg/sucursales` (antes `/admin/cfg/tablas/sucursales`) | `cfg.sucursales.ver` (AL-01; antes `cfg.maestros.ver`) | FIS-08 (puntos de venta) |
| SM-ADM-227 | CFG-07 | `/admin/cfg/tablas` | `cfg.maestros.ver` | CFG-08, CFG-09, CFG-30 |
| SM-ADM-228 | CFG-02 | `/admin/cfg/parametros` | `cfg.parametros.ver` | CFG-03, CFG-29 |
| SM-ADM-229 | CFG-28 | `/admin/cfg/tecnica` | `cfg.tecnica.ver` | — |
| SM-ADM-230 | CFG-11 | `/admin/cfg/geografia` | `cfg.geo.ver` | CFG-12 a CFG-15, CFG-32 |
| SM-ADM-231 | CFG-16 | `/admin/cfg/calendarios` | `cfg.calendarios.ver` | — |
| SM-ADM-232 | CFG-17 | `/admin/cfg/indices` | `cfg.indices.ver` | MOR-04, CON-29 (CTR-UXD-23) |
| SM-ADM-233 | CFG-04 | `/admin/cfg/versiones` | `cfg.versiones.ver` | CFG-05, CFG-06 |
| SM-ADM-234 a SM-ADM-239 | PAN-UXD-01 a PAN-UXD-07 (este anexo) | `/admin` + ruta de 10.8.1 | la de 10.8.1 | — |
| SM-ADM-240 | WFL-12 | `/admin/configuracion/operaciones` | `wfl.flujos.configurar` | WFL-09 |
| SM-ADM-241 | WFL-06 | `/admin/configuracion/workflows` | `wfl.flujos.configurar` | WFL-05, WFL-07, WFL-20 |
| SM-ADM-242 | WFL-17 | `/admin/configuracion/plantillas` | `wfl.plantillas.ver` | WFL-16, WFL-18, WFL-19 |
| SM-ADM-243 | WFL-15 | `/admin/expedientes/formales` | `wfl.expedientes.gestionar` | WFL-14 |
| SM-ADM-244 | WFL-21 | `/admin/configuracion/procesos` | `wfl.jobs.ver` | — |
| SM-ADM-245 | INT-03 | `/admin/integraciones/conexiones` | `int.conexiones.ver` | INT-02, INT-04, INT-08 a INT-10, INT-12 a INT-16, INT-18 a INT-20 |
| SM-ADM-246 | INT-06 | `/admin/integraciones/credenciales` | `int.credenciales.gestionar` | INT-07 |
| SM-ADM-247 | INT-11 | `/admin/integraciones/webhooks` | `int.webhooks.configurar` | BIA-17 (salientes) |
| SM-ADM-248 | INT-17 | `/admin/integraciones/agentes` | `int.agentes.gestionar` | — |
| SM-ADM-249 | MIG-13 | `/admin/migration/reconciliations` | `mig.conciliacion.ver` | MIG-06, MIG-08, MIG-10 a MIG-12, MIG-17 a MIG-19, MIG-23 |
| SM-ADM-250 | MIG-14 | `/admin/migration/parallel` | `mig.paralelo.ver` | MIG-15, MIG-16 |
| SM-ADM-251 | PLA-17 | `/admin/pla/soporte` | `pla.soporte.ver` | PLA-18 |
| SM-ADM-252 | PLA-15 | `/admin/pla/suscripcion` | `pla.miSuscripcion.ver` | PLA-16 |
| SM-ADM-253 | PLA-23 | `/admin/pla/exportaciones` | `pla.exportacion.solicitar` | — |
| SM-ADM-254 | PLA-15 (pestaña Ambientes; la creación es PLA-14 de plataforma) | `/admin/pla/suscripcion?tab=ambientes` | `pla.miSuscripcion.ver` | PLA-14 |

#### 10.9.3 Admin: ítems agregados (pantallas de los anexos sin entrada en 10.8.1)

Se agregan 139 ítems y 8 grupos nuevos (marcados "nuevo grupo"); con la fase 2 se suma SM-ADM-394 (140 ítems) y con la corrección del 05-11-2026 se suman SM-ADM-395 a SM-ADM-402, pantallas de T04, M10 y M12 que tenían ruta y no tenían ítem (148 ítems). La columna ProCoop de 22.1 no cambia: estos ítems cubren pantallas que los anexos de módulo crearon a partir de BASE, DFA o mejoras.

| ID | Cluster | Grupo | Ítem | Ruta | Capability | Ola | PAN |
|---|---|---|---|---|---|---|---|
| SM-ADM-255 | C01 Inicio | Inicio | Supervisión de bandejas | `/admin/inicio/bandeja/equipo` | `wfl.bandeja.supervisar` | O1 | WFL-02 |
| SM-ADM-256 | C01 Inicio | Inicio | Agenda | `/admin/inicio/agenda` | `wfl.agenda.ver` | O1 | WFL-04 |
| SM-ADM-257 | C01 Inicio | Inicio | Mis delegaciones | `/admin/inicio/delegaciones` | `wfl.aprobaciones.delegar` | O1 | WFL-11 (WFL-10) |
| SM-ADM-258 | C01 Inicio | Inicio | Bandeja operativa de eventos | `/admin/inicio/bandeja-operativa` | `wfl.eventos.ver` | O1 | WFL-22 |
| SM-ADM-259 | C01 Inicio | Inicio | Autorizaciones pendientes | `/admin/autorizaciones` | `iam.autorizaciones.bandeja` | O1 | IAM-15 (IAM-16, WFL-10) |
| SM-ADM-260 | C02 Socios | Personas y titulares | Puntos de prestación | `/admin/per/puntos` | `per.puntosPrestacion.ver` | O2 | PER-08 |
| SM-ADM-261 | C02 Socios | Personas y titulares | Mapa de domicilios y puntos | `/admin/per/mapa` | `per.puntosPrestacion.ver` | O2 | PER-28 |
| SM-ADM-262 | C02 Socios | Relaciones | Transferencias de titularidad | `/admin/per/transferencias` | `per.transferencias.ver` | O2 | PER-15 (PER-14) |
| SM-ADM-263 | C02 Socios | Calidad de datos | Operaciones especiales | `/admin/per/operaciones-especiales` | `per.operacionesEspeciales.ejecutar` | O2 | PER-21 |
| SM-ADM-264 | C02 Socios | Calidad de datos | Privacidad y derechos | `/admin/per/privacidad` | `per.privacidad.gestionar` | O2 | PER-23 |
| SM-ADM-265 | C02 Socios | Calidad de datos | Importación de personas | `/admin/per/importar` | `per.importaciones.crear` | O2 | PER-24 |
| SM-ADM-266 | C03 Servicios | Catálogo | Reglas de altas automáticas | `/admin/cat/auto-rules` | `cat.reglasAuto.configurar` | O2 | CAT-11 |
| SM-ADM-267 | C03 Servicios | Catálogo | Paquetes de prestaciones | `/admin/cat/bundles` | `cat.paquetes.ver` | O2 | CAT-27 |
| SM-ADM-268 | C03 Servicios | Contratos | Tablero de servicios | `/admin/cat/dashboard` | `cat.servicios.ver` | O2 | CAT-24 |
| SM-ADM-269 | C04 Medición | Equipos | Catálogos de medición | `/admin/med/config/catalogos` | `med.catalogos.ver` | O7 | MED-01 |
| SM-ADM-270 | C04 Medición | Equipos | Medidores testigo | `/admin/med/testigos` | `med.testigos.ver` | O7 | MED-18 |
| SM-ADM-271 | C04 Medición | Lecturas | Lotes de lectura | `/admin/med/lotes` | `med.lotes.ver` | O7 | MED-07 (MED-08) |
| SM-ADM-272 | C04 Medición | Lecturas | Conflictos de sincronización | `/admin/med/conflictos` | `med.conflictos.resolver` | O7 | MED-34 |
| SM-ADM-273 | C04 Medición | Consumos (nuevo grupo) | División y prorrateo | `/admin/med/consumos/division` | `med.consumos.dividir` | O7 | MED-16 |
| SM-ADM-274 | C04 Medición | Consumos | Demanda contratada | `/admin/med/demanda` | `med.demanda.ver` | O7 | MED-19 |
| SM-ADM-275 | C04 Medición | Consumos | Factores de gas | `/admin/med/config/factores-gas` | `med.gas.configurar` | O7 | MED-20 |
| SM-ADM-276 | C04 Medición | Consumos | Medición propia y pérdidas | `/admin/med/medicion-propia` | `med.medicionPropia.ver` | O7 | MED-21 |
| SM-ADM-277 | C04 Medición | Consumos | Generación distribuida | `/admin/med/generacion-distribuida` | `med.gd.ver` | O7 | MED-26 |
| SM-ADM-278 | C05 Facturación | Tarifas | Políticas de redondeo | `/admin/tarifas/redondeo` | `tar.redondeo.configurar` | O4 | TAR-25 |
| SM-ADM-279 | C05 Facturación | Tarifas | Configuración de tarifas | `/admin/tarifas/configuracion` | `tar.config.configurar` | O4 | TAR-27 |
| SM-ADM-280 | C05 Facturación | Emisión | Tablero de facturación | `/admin/fac` | `fac.lotes.ver` | O4 | FAC-01 |
| SM-ADM-281 | C05 Facturación | Emisión | Modificación masiva | `/admin/fac/modificacion-masiva` | `fac.modificacionMasiva.crear` | O4 | FAC-18 |
| SM-ADM-282 | C05 Facturación | Emisión | Recategorización | `/admin/fac/recategorizacion` | `fac.recategorizacion.simular` | O4 | FAC-19 |
| SM-ADM-283 | C05 Facturación | Emisión | Retroactivos | `/admin/fac/retroactivos` | `fac.retroactivos.crear` | O4 | FAC-20 |
| SM-ADM-284 | C05 Facturación | Emisión | Importaciones de terceros | `/admin/fac/importaciones` | `fac.importaciones.crear` | O4 | FAC-22 |
| SM-ADM-285 | C05 Facturación | Emisión | Cierre de ciclo | `/admin/fac/cierres` | `fac.cierre.proponer` | O4 | FAC-35 |
| SM-ADM-286 | C05 Facturación | Comprobantes | CVLP | `/admin/fac/cvlp` | `fac.cvlp.ver` | O4 | FAC-37 |
| SM-ADM-287 | C05 Facturación | Configuración de facturación (nuevo grupo) | Tipos de comprobante | `/admin/fac/config/tipos-comprobante` | `fac.tiposComprobante.configurar` | O4 | FAC-23 |
| SM-ADM-288 | C05 Facturación | Configuración de facturación | Modalidad de facturación | `/admin/fac/config/modalidad` | `fac.modalidad.configurar` | O4 | FAC-26 |
| SM-ADM-289 | C05 Facturación | Configuración de facturación | Tramas de recargo | `/admin/fac/config/tramas` | `fac.tramas.configurar` | O4 | FAC-27 (MOR-05) |
| SM-ADM-290 | C05 Facturación | Configuración de facturación | Diseño de comprobantes | `/admin/fac/config/diseno` | `fac.diseno.configurar` | O4 | FAC-28 (FAC-29) |
| SM-ADM-291 | C05 Facturación | Configuración de facturación | Formatos de código de barras | `/admin/fac/config/codigos` | `fac.codigoBarras.configurar` | O4 | FAC-30 |
| SM-ADM-292 | C05 Facturación | Configuración de facturación | Parámetros de facturación | `/admin/fac/config/parametros` | `fac.parametros.configurar` | O4 | FAC-41 |
| SM-ADM-293 | C05 Facturación | Fiscal | Perfil fiscal | `/admin/fis/profile` | `fis.perfil.ver` | O4 | FIS-04 (FIS-05) |
| SM-ADM-294 | C05 Facturación | Fiscal | Adopción de tablas normativas | `/admin/fis/normative-adoptions` | `fis.tablasNormativas.adoptar` | O4 | FIS-03 |
| SM-ADM-295 | C05 Facturación | Fiscal | Comprobantes de administración pública | `/admin/fis/public-admin` | `fis.admPublica.ver` | O4 | FIS-37 (FAC-38; CTR-UXD-23) |
| SM-ADM-296 | C05 Facturación | Fiscal | Modo pasarela | `/admin/fis/gateway` | `fis.pasarela.enviar` | O4 | FIS-38 |
| SM-ADM-297 | C05 Facturación | Fiscal | Reportes fiscales | `/admin/fis/reports` | `fis.*.ver` (AL-08; antes "cualquier `fis.*.ver`") | O4 | FIS-40 |
| SM-ADM-298 | C06 Cobranza | Caja | Configuración de cajas y QR | `/admin/cob/config/cajas` | `cob.caja.configurar` (antes `cob.cajas.configurar`) | O5 | COB-08 |
| SM-ADM-299 | C06 Cobranza | Canales | Cobradores y listas de cobro | `/admin/cob/cobradores` | `cob.cobradores.gestionar` | O5 | COB-28 |
| SM-ADM-300 | C06 Cobranza | Control | Excepciones de cobranza | `/admin/cob/excepciones` | `cob.excepciones.resolver` | O5 | COB-34 |
| SM-ADM-301 | C07 Mora | Gestión de mora | Tablero de mora | `/admin/mor/tablero` | `mor.deuda.ver` | O6 | MOR-01 |
| SM-ADM-302 | C07 Mora | Gestión de mora | Operaciones especiales | `/admin/mor/operaciones-especiales` | `mor.operacionesEspeciales.ejecutar` | O6 | MOR-22 |
| SM-ADM-303 | C07 Mora | Recupero | Expedientes de seguimiento de deuda | `/admin/mor/seguimiento` | `mor.deuda.ver` | O6 | MOR-38 |
| SM-ADM-304 | C08 Atención | Casos | Bandeja de supervisión | `/admin/crm/supervision` | `crm.bandejaSupervision.ver` | O2 | CRM-01 |
| SM-ADM-305 | C08 Atención | Casos | Trámites con vencimiento | `/admin/crm/tramites` | `crm.tramites.configurar` | O2 | CRM-21 |
| SM-ADM-306 | C08 Atención | Casos | Instancias de trámites | `/admin/tramites/instancias` | `wfl.tareas.ver` | O2 | WFL-08 |
| SM-ADM-307 | C08 Atención | Actividades internas | Proyectos, horas y bolsas | `/admin/crm/proyectos` | `crm.horas.ver` | O10 | CRM-22 |
| SM-ADM-308 | C08 Atención | Actividades internas | Circulares | `/admin/crm/circulares` | `crm.circulares.ver` | O10 | CRM-32 |
| SM-ADM-309 | C08 Atención | Configuración | Auditoría de IA de atención | `/admin/crm/auditoria-ia` | `crm.ia.auditar` | O11 | CRM-19 |
| SM-ADM-310 | C09 Técnica | Operación | Mapa operativo | `/admin/tec/map` | `tec.mapa.ver` (antes `tec.map.read`) | O3 | TEC-29 |
| SM-ADM-311 | C09 Técnica | Operación | Interrupciones e impacto | `/admin/tec/outages` | `tec.cortes.gestionar` (antes `tec.outage.manage`) | O3 | TEC-28 (COM-27; antes COM-23) |
| SM-ADM-312 | C09 Técnica | Operación | Inspecciones y fraude | `/admin/tec/inspections` | `tec.inspecciones.gestionar` (antes `tec.inspection.manage`) | O3 | TEC-41 |
| SM-ADM-313 | C09 Técnica | Operación | Conflictos de sincronización | `/admin/tec/sync-conflicts` | `tec.conflictos.resolver` (antes `tec.syncConflict.resolve`) | O3 | TEC-24 |
| SM-ADM-314 | C09 Técnica | Infraestructura | Activos y mantenimiento | `/admin/tec/maintenance` | `tec.mantenimiento.gestionar` (antes `tec.maintenance.manage`) | O7 | TEC-27 |
| SM-ADM-315 | C09 Técnica | Infraestructura | Equipos de red | `/admin/tec/network-devices` | `tec.equiposRed.gestionar` (antes `tec.networkDevice.manage`) | O3 | TEC-35 |
| SM-ADM-316 | C09 Técnica | Configuración técnica (nuevo grupo) | Catálogos técnicos | `/admin/tec/catalog/operations` | `tec.config.gestionar` (antes `tec.config.manage`) | O3 | TEC-17 (TEC-15, TEC-18 a TEC-21) |
| SM-ADM-317 | C09 Técnica | Configuración técnica | Formularios de campo | `/admin/tec/field-forms` | `tec.formulariosCampo.gestionar` (antes `tec.fieldForm.manage`) | O3 | TEC-26 |
| SM-ADM-318 | C10 Ventas | Ventas | Cargos por operación | `/admin/ven/cargos` | `ven.cargos.ver` | O5 | VEN-01 |
| SM-ADM-319 | C10 Ventas | Ventas | Cuotas de venta | `/admin/ven/cuotas` | `ven.cuotas.ver` | O5 | VEN-14 (VEN-15) |
| SM-ADM-320 | C10 Ventas | Ventas | Rendiciones de viajes de venta | `/admin/ven/rendiciones` | `ven.rendiciones.ver` | O5 | VEN-20 |
| SM-ADM-321 | C10 Ventas | Configuración de ventas (nuevo grupo) | Listas de precios | `/admin/ven/precios` | `ven.precios.ver` | O5 | VEN-17 |
| SM-ADM-322 | C10 Ventas | Configuración de ventas | Vendedores | `/admin/ven/config/vendedores` | `ven.vendedores.ver` | O5 | VEN-16 |
| SM-ADM-323 | C10 Ventas | Configuración de ventas | Condiciones, descuentos y planes | `/admin/ven/config` | `ven.config.configurar` | O5 | VEN-24 (VEN-04, VEN-18, VEN-19) |
| SM-ADM-324 | C11 Administración | Compras | Cuenta corriente de proveedores | `/admin/cmp/cuenta-corriente` | `cmp.comprobantes.ver` | O8 | CMP-16 |
| SM-ADM-325 | C11 Administración | Compras | Configuración de compras | `/admin/cmp/config` | `cmp.config.configurar` | O8 | CMP-21 (CMP-03, CMP-20) |
| SM-ADM-326 | C11 Administración | Stock | Depósitos y ubicaciones | `/admin/stk/depositos` | `stk.depositos.ver` | O3 | STK-05 (STK-06) |
| SM-ADM-327 | C11 Administración | Stock | Existencias | `/admin/stk/existencias` | `stk.saldos.ver` | O3 | STK-07 |
| SM-ADM-328 | C11 Administración | Stock | Reservas | `/admin/stk/reservas` | `stk.reservas.ver` | O3 | STK-13 |
| SM-ADM-329 | C11 Administración | Stock | Custodias de cuadrillas | `/admin/stk/cuadrillas` | `stk.custodias.ver` | O3 | STK-14 (STK-15) |
| SM-ADM-330 | C11 Administración | Stock | Conflictos de campo | `/admin/stk/conflictos` | `stk.consumos.validar` | O3 | STK-16 |
| SM-ADM-331 | C11 Administración | Stock | Inventarios físicos | `/admin/stk/inventarios` | `stk.inventarios.ver` | O8 | STK-20 |
| SM-ADM-332 | C11 Administración | Stock | Sugerencias de compra | `/admin/stk/reposicion` | `stk.sugerencias.ver` | O8 | STK-21 |
| SM-ADM-333 | C11 Administración | Stock | Configuración de stock | `/admin/stk/configuracion` | `stk.config.configurar` | O3 | STK-36 |
| SM-ADM-334 | C11 Administración | Tesorería | Posición diaria | `/admin/tes/tablero` | `tes.posicion.ver` | O8 | TES-01 |
| SM-ADM-335 | C11 Administración | Tesorería | Monedas y cotizaciones | `/admin/tes/monedas` | `tes.monedas.configurar` | O8 | TES-30 (CFG-18; CTR-UXD-23) |
| SM-ADM-336 | C11 Administración | Tesorería | Lotes de pago de haberes | `/admin/tes/haberes` | `tes.haberes.ejecutar` | O9 | TES-35 |
| SM-ADM-337 | C11 Administración | Tesorería | Excepciones de tesorería | `/admin/tes/excepciones` | `tes.movimientos.ver` | O8 | TES-38 |
| SM-ADM-338 | C11 Administración | Tesorería | Cierre de períodos | `/admin/tes/periodos` | `tes.periodos.cerrar` | O8 | TES-42 |
| SM-ADM-339 | C11 Administración | Tesorería | Configuración de tesorería | `/admin/tes/configuracion` | `tes.configuracion.configurar` | O8 | TES-39 (TES-31) |
| SM-ADM-340 | C11 Administración | Contabilidad | Tablero contable | `/admin/con` | `con.asientos.ver` | O5 | CON-01 |
| SM-ADM-341 | C11 Administración | Contabilidad | Configuración contable | `/admin/con/configuracion` | `con.config.ver` | O5 | CON-02 |
| SM-ADM-342 | C11 Administración | Contabilidad | Libros rubricados | `/admin/con/libros` | `con.libros.ver` | O8 | CON-23 |
| SM-ADM-343 | C11 Administración | Contabilidad | Conciliaciones contables | `/admin/con/conciliaciones` | `con.conciliaciones.ver` | O8 | CON-28 |
| SM-ADM-344 | C11 Administración | Contabilidad | Ajuste por inflación | `/admin/con/inflacion/corridas` | `con.inflacion.ejecutar` | O8 | CON-30 (CON-29) |
| SM-ADM-345 | C11 Administración | Contabilidad | Sistema contable externo | `/admin/con/externo` | `con.externo.ver` | O5 | CON-37 |
| SM-ADM-346 | C12 Personal | Administración | Tablero de sueldos | `/admin/sue` | `sue.reportes.ver` | O9 | SUE-01 |
| SM-ADM-347 | C12 Personal | Procesos | Licencias | `/admin/sue/licencias` | `sue.licencias.ver` | O9 | SUE-22 |
| SM-ADM-348 | C12 Personal | Procesos | Pago de haberes | `/admin/sue/pagos` | `sue.pagos.ver` | O9 | SUE-31 (TES-35) |
| SM-ADM-349 | C12 Personal | Procesos | Liquidación externa | `/admin/sue/importacion-externa` | `sue.importacionExterna.ver` | O9 | SUE-39 |
| SM-ADM-350 | C12 Personal | Configuración | Reglas de imputación contable | `/admin/sue/config/contabilidad` | `sue.reglasContables.configurar` | O9 | SUE-32 |
| SM-ADM-351 | C12 Personal | Informes | Certificados y constancias | `/admin/sue/certificados` | `sue.certificados.emitir` | O9 | SUE-33 |
| SM-ADM-352 | C12 Personal | Recursos humanos (nuevo grupo) | Evaluaciones, sanciones, accidentes y juicios | `/admin/sue/rrhh/evaluaciones` | `sue.rrhh.evaluaciones.ver` | O9 | SUE-34 (SUE-35, SUE-36, SUE-37) |
| SM-ADM-353 | C13 Institucional | Institucional | Distribución de excedentes | `/admin/ins/excedentes` | `ins.excedentes.calcular` | O10 | INS-14 |
| SM-ADM-354 | C13 Institucional | Institucional | Configuración institucional | `/admin/ins/config` | `ins.config.configurar` | O10 | INS-28 |
| SM-ADM-355 | C14 Servicios sociales | Prestaciones | Solicitudes de prestación | `/admin/soc/solicitudes` | `soc.solicitudes.ver` | O10 | SOC-05 (SOC-06) |
| SM-ADM-356 | C14 Servicios sociales | Prestaciones | Revisión de adherentes | `/admin/soc/adherentes/revision` | `soc.adherentes.gestionar` | O10 | SOC-02 |
| SM-ADM-357 | C14 Servicios sociales | Prestaciones | Planes de cobertura | `/admin/soc/config/planes` | `soc.planes.configurar` | O10 | SOC-03 |
| SM-ADM-358 | C14 Servicios sociales | Prestaciones | Subsidios por fallecimiento | `/admin/soc/subsidios` | `soc.subsidios.crear` | O10 | SOC-08 |
| SM-ADM-359 | C14 Servicios sociales | Otros servicios (nuevo grupo) | Banco ortopédico | `/admin/soc/otros/ortopedia` | `soc.ortopedia.gestionar` | O10 | SOC-27 |
| SM-ADM-360 | C14 Servicios sociales | Otros servicios | Retiros de dispenser | `/admin/soc/otros/dispenser` | `soc.dispenser.registrar` | O10 | SOC-28 |
| SM-ADM-361 | C14 Servicios sociales | Otros servicios | Configuración de servicios sociales | `/admin/soc/config` | `soc.config.configurar` | O10 | SOC-29 |
| SM-ADM-362 | C15 Comunidad | Eventos y beneficios (nuevo grupo) | Eventos | `/admin/com/eventos` | `com.events.ver` | O2 | COM-14 |
| SM-ADM-363 | C15 Comunidad | Eventos y beneficios | Beneficios | `/admin/com/beneficios` | `com.benefits.ver` | O2 | COM-15 |
| SM-ADM-364 | C15 Comunidad | Novedades | Avisos de interrupción | `/admin/com/avisos-corte` | `com.outages.ver` (AL-01; antes `com.outages.gestionar`) | O2 | COM-27 (antes COM-23, que en T09 son los mensajes en factura); relacionada: TEC-28; ruta antes `/admin/com/interrupciones` |
| SM-ADM-365 | C15 Comunidad | Novedades | Canales y remitentes | `/admin/com/canales` | `com.channels.configurar` | O2 | COM-26 (COM-28; CTR-UXD-25; antes COM-22 y COM-25) |
| SM-ADM-366 | C15 Comunidad | Audiencias | Preferencias de comunicación | `/admin/com/preferencias` | `com.consents.ver` | O2 | COM-25 (NFR-04; CTR-UXD-23; antes COM-24); ruta antes `/admin/com/consentimientos` |
| SM-ADM-367 | C16 Sitio y portal | Portal | Vinculaciones de cuentas | `/admin/portal/vinculaciones` | `por.vinculaciones.ver` | O2 | POR-89 |
| SM-ADM-368 | C16 Sitio y portal | Portal | Banners | `/admin/portal/banners` | `por.banners.configurar` | O2 | POR-93 |
| SM-ADM-369 | C16 Sitio y portal | Portal | Métricas del portal | `/admin/portal/metricas` | `por.metricas.ver` | O2 | POR-94 |
| SM-ADM-370 | C16 Sitio y portal | Portal | Ver como el socio | `/admin/portal/vista-socio/:accountId` | `por.vistaSocio.ver` | O2 | POR-95 |
| SM-ADM-371 | C16 Sitio y portal | Portal | Tótems de autoservicio | `/admin/portal/totems` | `por.totems.configurar` | O5 | POR-96 |
| SM-ADM-372 | C16 Sitio y portal | Portal | Migración de usuarios CoopOnline | `/admin/portal/migracion` | `por.migracion.ejecutar` | O11 | POR-92 |
| SM-ADM-373 | C17 Reportes | Reportes | Configuración del catálogo | `/admin/reportes/configuracion` | `bia.reportes.configurar` | O1 | BIA-07 |
| SM-ADM-374 | C17 Reportes | Reportes | Diseñador de tableros | `/admin/tableros/disenar` | `bia.tableros.disenar` | O11 | BIA-11 |
| SM-ADM-375 | C17 Reportes | Reportes | Indicadores y alertas | `/admin/indicadores` | `bia.indicadores.ver` | O1 | BIA-13 (BIA-14) |
| SM-ADM-376 | C17 Reportes | Reportes | Auditoría de reportes | `/admin/reportes/auditoria` | `bia.auditoria.ver` | O1 | BIA-19 |
| SM-ADM-377 | C17 Reportes | Reportes | Benchmark entre cooperativas | `/admin/bi/benchmark` | `bia.benchmark.ver` | O11 | BIA-20 |
| SM-ADM-378 | C17 Reportes | Reportes | Datos abiertos | `/admin/bi/datos-abiertos` | `bia.datosAbiertos.publicar` (PAN-BIA-21, AL-01; antes "cualquier bia.*.ver (AL-08)") | O11 | BIA-21 |
| SM-ADM-379 | C18 Configuración | Seguridad | Segregación de funciones | `/admin/iam/sod` | `iam.sod.configurar` | O1 | IAM-13 |
| SM-ADM-380 | C18 Configuración | Seguridad | Explicador de permisos | `/admin/iam/explicar` | `iam.permisos.explicar` | O1 | IAM-14 |
| SM-ADM-381 | C18 Configuración | Seguridad | Políticas de seguridad | `/admin/iam/politicas` | `iam.politicas.ver` | O1 | IAM-22 |
| SM-ADM-382 | C18 Configuración | Seguridad | Proveedores de identidad (SSO) | `/admin/iam/sso` | `iam.idp.configurar` | O1 | IAM-23 |
| SM-ADM-383 | C18 Configuración | Organización | Monedas | `/admin/cfg/monedas` | `cfg.maestros.editar` | O1 | CFG-18 |
| SM-ADM-384 | C18 Configuración | Organización | Enumeraciones | `/admin/cfg/enumeraciones` | `cfg.enumeraciones.configurar` | O1 | CFG-20 |
| SM-ADM-385 | C18 Configuración | Organización | Campos extra | `/admin/cfg/campos-extra` | `cfg.camposExtra.configurar` | O1 | CFG-21 |
| SM-ADM-386 | C18 Configuración | Organización | Formularios del registro | `/admin/cfg/formularios` | `cfg.formularios.configurar` | O1 | CFG-22 |
| SM-ADM-387 | C18 Configuración | Organización | Vistas guardadas | `/admin/cfg/vistas` | `cfg.vistas.crear` | O1 | CFG-23 |
| SM-ADM-388 | C18 Configuración | Procesos | Operaciones | `/admin/operaciones` | `wfl.operaciones.ver` | O1 | WFL-13 |
| SM-ADM-389 | C18 Configuración | Privacidad y salud (nuevo grupo) | Tratamientos y datos personales | `/admin/privacidad/tratamientos` | `nfr.tratamientos.ver` | O1 | NFR-01 (NFR-02, NFR-03, NFR-06) |
| SM-ADM-390 | C18 Configuración | Privacidad y salud | Consentimientos | `/admin/privacidad/consentimientos` | `nfr.consentimientos.ver` | O1 | NFR-04 |
| SM-ADM-391 | C18 Configuración | Privacidad y salud | Solicitudes de derechos | `/admin/privacidad/solicitudes` | `nfr.solicitudesDerechos.ver` | O1 | NFR-05 |
| SM-ADM-392 | C18 Configuración | Privacidad y salud | Salud del servicio | `/admin/salud` | `nfr.salud.ver` | O1 | NFR-07 (NFR-08) |
| SM-ADM-393 | C18 Configuración | Cuenta SaaS | Novedades de la plataforma | `/admin/pla/novedades` | `pla.novedadesPlataforma.ver` | O1 | PLA-19 |
| SM-ADM-394 | C05 Facturación | Emisión | Revisión previa | `/admin/fac/revision-previa` | `fac.revisionPrevia.ver` | O7 | FAC-47 (HUE-ELE-02; M05 declara `/admin/fac/revision-previa`, la misma ruta canónica, y conserva `/admin/facturacion/revision-previa` como ruta anterior; las acciones piden `fac.revisionPrevia.aprobar`; antes "M05 declara `/admin/facturacion/revision-previa`, que se acepta como alias") |
| SM-ADM-395 | C18 Configuración | Organización | Entidades jurídicas | `/admin/cfg/entidades-juridicas` | `cfg.entidadesJuridicas.ver` | O0 | CFG-33 (DEC-064) |
| SM-ADM-396 | C18 Configuración | Organización | Puestos y equipos | `/admin/cfg/puestos` | `cfg.puestos.editar` | O1 | CFG-35 |
| SM-ADM-397 | C11 Administración | Compras | Abastecimiento mayorista y balance | `/admin/cmp/abastecimiento` | `cmp.comprobantes.ver` | O8 | CMP-25 (HUE-ELE-01, HUE-GAS-04) |
| SM-ADM-398 | C11 Administración | Compras | Derechos de señales | `/admin/cmp/derechos-senales` | `cmp.comprobantes.ver` | O10 | CMP-26 (HUE-TV-01) |
| SM-ADM-399 | C09 Técnica | Operación | Guardias | `/admin/tec/on-call` | `tec.guardias.gestionar` (antes `tec.onCall.manage`) | O7 | TEC-61 (HUE-GAS-05) |
| SM-ADM-400 | C09 Técnica | Operación | Protocolos de emergencia | `/admin/tec/emergency-protocols` | `tec.config.gestionar` (antes `tec.config.manage`) | O7 | TEC-62 (HUE-GAS-05) |
| SM-ADM-401 | C09 Técnica | TIC | Portabilidad numérica | `/admin/tec/phone/portings` | `tec.telefonia.numeracion.ver` (PAN-TEC-63, AL-01; antes `tec.telefonia.numeracion.configurar` y, antes, `tec.phone.numbering`) | O10 | TEC-63 (HUE-TEL-05; visible si PRM-TEC-156 = true) |
| SM-ADM-402 | C09 Técnica | Infraestructura | Calidad del agua | `/admin/tec/water-quality` | `tec.calidadAgua.gestionar` (antes `tec.waterQuality.manage`) | O7 | TEC-64 (HUE-AG-01; visible si PRM-TEC-157 = true) |

#### 10.9.4 PWA socio: alineación y agregados

| SM | PAN principal | Ruta canónica | Capability canónica | PAN asociadas / nota |
|---|---|---|---|---|
| SM-PWS-001 | POR-25 | `/app/inicio` | `por.portal.ver` | POR-23, POR-24 |
| SM-PWS-002 | POR-26 | `/app/cuentas` | `por.portal.ver` | POR-28, POR-29, CAT-22 |
| SM-PWS-003 | POR-30 | `/app/servicios/:contractId` | `por.servicios.ver` | POR-66, POR-67, STK-40 (sección "Equipos"), POR-103 (`/app/servicios/:contractId/llamadas`, `por.consumos.ver`; HUE-TEL-02), bloque "Plan de cuotas de obra" (TAR, HUECO-OBR-03; datos con `por.planObra.ver` de API-TAR-066; antes `pwa.planObra.ver`) |
| SM-PWS-004 | POR-27 | `/app/cuentas/vincular` | `por.cuentas.vincular` | PER-26, IAM-32 (CTR-UXD-23) |
| SM-PWS-005 | POR-31 | `/app/contratar` | `por.servicios.contratar` | CAT-21 |
| SM-PWS-006 | POR-37 | `/app/servicios/:contractId/:accion` | `por.servicios.solicitarBaja` | MOR-41 (suspensión voluntaria) |
| SM-PWS-007 | POR-38 | `/app/facturas` | `por.facturas.ver` | FAC-43, COB-35 (M07 declara `/mi-cuenta`; se sirve dentro de la ruta de M19, AL-04) |
| SM-PWS-008 | POR-39 | `/app/facturas/:invoiceId` | `por.facturas.ver` | FAC-44, TAR-23 |
| SM-PWS-009 | POR-40 | `/app/pagar` | `por.pagos.crear` | — |
| SM-PWS-010 | POR-41 | `/app/pagos/:checkoutId` | `por.pagos.crear` | POR-42 (historial de pagos) |
| SM-PWS-011 | POR-43 | `/app/cuentas/:accountId/movimientos` | `por.facturas.ver` | COB-35 (M07 declara `/mi-cuenta`; ruta de M19, AL-04) |
| SM-PWS-012 | POR-44 | `/app/debito-automatico` | `por.debito.gestionar` | POR-45 (`/app/factura-digital`, `por.facturaDigital.gestionar`) |
| SM-PWS-013 | POR-46 | `/app/convenios` | `por.facturas.ver` | MOR-40 (simular y aceptar, `mor.simulador.usar`; CTR-UXD-23) |
| SM-PWS-014 | POR-47 | `/app/consumos(/:contractId)` | `por.consumos.ver` | MED-31 |
| SM-PWS-015 | POR-48 | `/app/autolectura/:contractId` | `por.autolectura.crear` | MED-32 |
| SM-PWS-016 | POR-49 | `/app/prepaga` | `por.prepaga.comprar` | MED-33 |
| SM-PWS-017 | POR-50 | `/app/gestiones` | `por.gestiones.crear` | — |
| SM-PWS-018 | POR-51 | `/app/gestiones/nueva` | `por.gestiones.crear` | POR-32, POR-63 (borradores) |
| SM-PWS-019 | POR-33 | `/app/gestiones/:caseId` | `por.gestiones.crear` | TEC-59 (estado de factibilidad, absorbida) |
| SM-PWS-020 | POR-35 | `/app/visitas/:visitId` | `por.visitas.gestionar` | POR-34, TEC-57, TEC-58 |
| SM-PWS-021 | POR-36 | `/app/visitas/:visitId/conformidad` | `por.visitas.gestionar` | — |
| SM-PWS-022 | POR-52 | `/app/turnos` | `por.turnos.gestionar` | — |
| SM-PWS-023 | WFL-25 | `/app/tramites` | sesión | POR-32 (`/app/tramites/nuevo/:formCode`) |
| SM-PWS-024 | POR-64 | `/app/constancias` | `por.constancias.descargar` | WFL-26 (`/app/documentos`), WFL-27 (`/app/firmar/:id`) |
| SM-PWS-025 | POR-68 | `/app/avisos-de-corte` | `por.portal.ver` | COM-48 (antes también COM-41, que en T09 es el detalle de publicación) |
| SM-PWS-026 | POR-105 (M19, PA-POR-20: agregador de muro, encuestas y novedades; antes "Pantalla Comunidad de M19 (PA-POR asumida)" y, antes, POR-55) | `/app/comunidad` (ruta de M19, AL-04; antes `/app/muro`) | `por.portal.ver` y, por pestaña, la capability de T09 (`com.wall.ver` para muro y novedades, con alias `com.muro.ver` según T02 §4.4.1; `com.surveys.responder` para encuestas) (antes `com.wall.ver`) | POR-55 (muro, `/app/muro(/:id)`, AL-09), COM-40, COM-51 (CTR-UXD-24; antes COM-30); enlaza a novedades (SM-PWS-029) y encuestas (SM-PWS-030) |
| SM-PWS-027 | POR-55 (detalle) | `/app/muro(/:id)` (ruta del anexo, AL-01; antes `/app/muro/:id`) | `com.wall.ver` | COM-41 (antes COM-31) |
| SM-PWS-028 | — (sin pantalla propia en esta app; pantalla relacionada COM-40, citada en 10.9.13; vista "Guardados" del muro, datos de API-COM-03; T09 no define pantalla propia; antes COM-32, que en T09 es la bandeja interna del admin) | `/app/guardados` | `com.wall.ver` | — |
| SM-PWS-029 | POR-56 | `/app/novedades(/:id)` | `com.wall.ver` | COM-44 (`/boletines`, alias; antes COM-34) |
| SM-PWS-030 | POR-54 | `/app/encuestas(/:id)` | `com.surveys.responder` | COM-43 (CTR-UXD-24; antes COM-35 y COM-36, inexistentes en T09) |
| SM-PWS-031 | POR-53 | `/app/avisos` | `com.inbox.ver` | COM-42 (CTR-UXD-24; antes COM-33) |
| SM-PWS-032 | POR-59 | `/app/perfil` | `por.perfil.editar` | — |
| SM-PWS-033 | PER-25 | `/app/mis-datos` | `per.me.ver` | NFR-09 (sección privacidad, CTR-UXD-23) |
| SM-PWS-034 | POR-57 | `/app/representaciones` | `por.representaciones.gestionar` | PER-27 (`/app/autorizados`, alias), POR-58 |
| SM-PWS-035 | POR-60 | `/app/perfil/comunicaciones` | `com.preferences.editar` | COM-47 (CTR-UXD-24; antes COM-40) |
| SM-PWS-036 | POR-62 | `/app/perfil/apariencia` | sesión | UXD-08 (este anexo; ruta alineada a la de M19) |
| SM-PWS-037 | POR-61 | `/app/perfil/seguridad` | `iam.miCuenta.gestionar` (capability implícita de todo usuario autenticado según T02; M19 la expresa como "Sesión") | IAM-07 (T02 declara `/perfil/seguridad`; ruta de M19, AL-04) |
| SM-PWS-038 | POR-98 (tarjeta M19 que embebe SOC-30; HUE-SRV-04) | `/app/mi-grupo` | `soc.mi.ver` | POR-67; SOC-31, SOC-32 y SOC-33 pasan a SM-PWS-046 a SM-PWS-048. Texto original: PAN principal SOC-30; asociadas SOC-31, SOC-32, SOC-33 |
| SM-PWS-039 | POR-102 (tarjeta M19 que embebe INS-30; HUE-SRV-04) | `/app/mi-asociacion` | `ins.mi.ver` | INS-31, INS-32. Texto original: PAN principal INS-30 |
| SM-PWS-040 | POR-65 | `/app/ayuda` | sesión | — |
| SM-PWS-041 | UXD-15 (este anexo; condicionada a PA-UXD-16; antes "— (PA-UXD-16)") | `/app/asistente` | `por.asistente.ver` (flag `pwa.asistente`) | — |

| ID | Grupo | Ítem | Ruta | Capability | Ola | PAN |
|---|---|---|---|---|---|---|
| SM-PWS-042 | Facturas y pagos | Mi deuda y avisos | `/app/deuda` | `mor.miDeuda.ver` | O6 | MOR-39 (componente embebido en POR-46 según M08; HUE-SRV-04) |
| SM-PWS-043 | Gestiones | Agenda (visitas, turnos y eventos) | `/app/agenda` | `com.events.ver` (AL-01; antes `com.wall.ver`) | O2 | COM-45 (antes COM-38, inexistente en T09) |
| SM-PWS-044 | Comunidad | Beneficios | `/app/beneficios(/:id)` | `com.benefits.ver` (AL-01; canjear pide `com.benefits.canjear`; antes `com.benefits.canjear`) | O2 | COM-46 (antes COM-39, inexistente en T09) |
| SM-PWS-045 | Otros | Historial ProCoop | `/app/history` | sesión | O11 | MIG-21 |
| SM-PWS-046 | Servicios sociales | Solicitudes sociales | `/app/solicitudes-sociales` | `soc.mi.solicitar` | O10 | POR-99 (embebe SOC-31; HUE-SRV-04) |
| SM-PWS-047 | Servicios sociales | Cementerio | `/app/cementerio` | `soc.mi.ver` | O10 | POR-100 (embebe SOC-32; HUE-SRV-04) |
| SM-PWS-048 | Servicios sociales | Vivienda | `/app/vivienda` | `soc.mi.ver` | O10 | POR-101 (embebe SOC-33; HUE-SRV-04) |
| SM-PWS-049 | Facturas y pagos | Mis presupuestos y cuotas | `/app/presupuestos` | `ven.misPresupuestos.ver` | O8 | VEN-06 (M11 declara `/presupuestos` y `/cuotas`; la pestaña cuotas usa `/app/cuotas` con `ven.misCuotas.ver`, AL-04) |

#### 10.9.5 PWA empleado: alineación y agregados

| SM | PAN principal | Ruta canónica | Capability canónica | PAN asociadas / nota |
|---|---|---|---|---|
| SM-PWE-001 | POR-69 | `/app/empleado` | `por.empleado.ver` | POR-75 (`/app/empleado/muro`, `com.muroInterno.ver`) |
| SM-PWE-002 | WFL-23 | `/app/bandeja` | `wfl.tareas.ver` | — |
| SM-PWE-003 | CRM-35 | `/app/casos` | `crm.casos.ver` | — |
| SM-PWE-004 | WFL-23 (filtro aprobaciones) | `/app/bandeja?tipo=aprobacion` | `wfl.aprobaciones.decidir` | relacionada (admin, AL-10): WFL-10 (detalle de aprobación, ítem SM-ADM-257) |
| SM-PWE-005 | WFL-24 | `/app/agenda` | `wfl.agenda.ver` | CRM-36, COM-45 (antes COM-38) |
| SM-PWE-006 | POR-76 | `/app/empleado/avisos` | `por.empleado.ver` | COM-42 (antes COM-33) |
| SM-PWE-007 | WFL-23 (vista equipo, AL-09; antes "WFL-02 (versión móvil)") | `/app/bandeja?vista=equipo` | `wfl.bandeja.supervisar` | relacionadas (admin, AL-10): WFL-02 (SM-ADM-255), CRM-01 (SM-ADM-304) |
| SM-PWE-008 | BIA-25 | `/app/tablero` | `bia.tableros.ver` | — |
| SM-PWE-009 | COM-52 | `/app/empleado/muro` (modal publicar) | `com.posts.publicarEquipo` | POR-75 (muro interno desde el que se abre; antes COM-42, que en T09 es la bandeja de avisos) |
| SM-PWE-010 | COM-52 (composer de encuesta rápida; antes "COM-12 (versión modal)") | modal desde `/app/empleado/muro` y `/app/empleado/avisos` | `com.surveys.rapidaEquipo` (AL-01; antes `com.surveys.crear`) | — |
| SM-PWE-011 | COM-43 (antes COM-35, inexistente en T09) | `/app/encuestas(/:id)` (ruta del anexo, AL-01; antes `/app/encuestas`) | `com.surveys.responder` | — |
| SM-PWE-012 | COM-44 (antes COM-34, que en T09 es el consumo de mensajería) | `/app/novedades(/:id)` (ruta del anexo, AL-01; antes `/app/novedades`) | `com.wall.ver` | POR-56 |
| SM-PWE-013 | SUE-41 (dueño M16, PA-SUE-16) | `/app/empleado/recibos` | `sue.portal.recibos.ver` | POR-70 (M19 la incrusta; CTR-UXD-23) |
| SM-PWE-014 | SUE-41 (detalle del recibo; dueño M16, PA-SUE-16; antes POR-71) | `/app/empleado/recibos/:id` | `sue.portal.recibos.ver` (capability de M16, que M19 usa en PAN-POR-71) | POR-71 (M19 la incrusta), WFL-27 (firma) |
| SM-PWE-015 | UXD-16 (este anexo; vista sobre datos de T02 y M16; antes "— (T02 no define pantalla)") | `/app/empleado/directorio` | `iam.directorio.ver` | Capability registrada en T02 §4.4.2 (antes "pendiente de alta en el catálogo de T02") |
| SM-PWE-016 | POR-59 | `/app/perfil` | `por.perfil.editar` | POR-62 |
| SM-PWE-017 | UXD-15 (este anexo; condicionada a PA-UXD-16; antes "— (PA-UXD-16)") | `/app/asistente` | `wfl.asistente.ver` (flag) | — |

| ID | Grupo | Ítem | Ruta | Capability | Ola | PAN |
|---|---|---|---|---|---|---|
| SM-PWE-018 | Tabbar | Vacaciones y licencias | `/app/empleado/licencias` | `sue.portal.licencias.solicitar` | O9 | SUE-42 (POR-72 `/app/empleado/vacaciones`, POR-73); slot 3 de la tabbar del empleado "Solicitudes" (10.1.4; grupo antes Personal) |
| SM-PWE-019 | Personal | Mis datos y documentos | `/app/empleado/legajo` (ruta de M19, PAN-POR-74, AL-04; `/empleado/datos` es la ruta de referencia de M16; antes `/app/empleado/datos`) | `sue.portal.datos.ver` | O9 | SUE-43 (dueño M16, PA-SUE-16; POR-74 la incrusta en el shell de M19; antes "POR-74; ruta de M19, AL-04; M16 declara `/empleado/datos`") |
| SM-PWE-020 | Personal | Mis certificados | `/app/empleado/certificados` | `sue.portal.certificados.ver` | O9 | SUE-45 |
| SM-PWE-021 | Personal | Mis evaluaciones | `/app/empleado/evaluaciones` | `sue.portal.evaluaciones.autoevaluar` | O9 | SUE-46 |
| SM-PWE-022 | Supervisión | Mi equipo | `/app/empleado/equipo` | `sue.equipo.ver` | O9 | SUE-44 |
| SM-PWE-023 | Trabajo | Firma de pagos | `/app/tesoreria/firmas` | `tes.pagos.firmar` | O8 | TES-40 |
| SM-PWE-024 | Supervisión | Posición de tesorería | `/app/tesoreria/posicion` | `tes.posicion.ver` | O8 | TES-41 |
| SM-PWE-025 | Trabajo | Entregas de depósito | `/app/deposito/entregas` | `stk.entregas.crear` | O3 | STK-41 |
| SM-PWE-026 | Trabajo | Acreditación en asamblea | `/app/ins/acreditacion/:meetingId` | `ins.asistencia.registrar` | O10 | INS-20 |
| SM-PWE-027 | Trabajo | Actos en el cementerio parque | `/app/soc/cementerio/actos` | `soc.actos.registrar` | O10 | SOC-35 |

#### 10.9.6 PWA campo: alineación y agregados

| SM | PAN principal | Ruta canónica | Capability canónica | PAN asociadas / nota |
|---|---|---|---|---|
| SM-PWC-001 | TEC-50 | `/app/campo/today` | cualquiera de las capabilities de campo (M10, `med.campo.leer`, `cob.cobranzaCampo.ver`) | POR-77, TEC-60 |
| SM-PWC-002 | TEC-50 (lista de OT) | `/app/campo/today?vista=ordenes` | `tec.ordenes.ver` (antes `tec.workOrder.read`) | — |
| SM-PWC-003 | TEC-51 | `/app/campo/work-orders/:id` | `tec.campo.ejecutar` (PAN-TEC-51, AL-01; antes `tec.ordenes.editar` y, antes, `tec.workOrder.update`) | STK-38 (`…/materiales`), VEN-07 (`…/presupuesto`), WFL-28 (`…/conformidad`) |
| SM-PWC-004 | TEC-51 (tipo instalación) | `/app/campo/work-orders/:id?tipo=instalacion` | `tec.ordenes.editar` (antes `tec.workOrder.update`) | relacionada (admin, AL-10): TEC-25 (SM-ADM-106) |
| SM-PWC-005 | TEC-51 (tipo corte o reconexión, generadas desde la mora) | `/app/campo/work-orders/:id?tipo=corte` | `tec.ordenes.editar` (antes `tec.workOrder.update`) | relacionada (admin, AL-10): MOR-27 (SM-ADM-075) |
| SM-PWC-006 | TEC-54 | `/app/campo/inspections/:id` | `tec.inspecciones.editar` (PAN-TEC-54, AL-01; antes `tec.inspecciones.gestionar` y, antes, `tec.inspection.manage`) | relacionada (admin, AL-10): TEC-41 (SM-ADM-312) |
| SM-PWC-007 | CRM-04 (modal "Nuevo caso" abierto desde el botón "Nuevo" de la barra inferior; antes TEC-49, que M10 marca reemplazada por M09) | modal | `crm.casos.crear` | — |
| SM-PWC-008 | TEC-55 | `/app/campo/work-orders/new` | `tec.campo.crearOrden` (PAN-TEC-55, AL-01; antes `tec.ordenes.crear` y, antes, `tec.workOrder.create`) | relacionada (admin, AL-10): CRM-07 (SM-ADM-092) |
| SM-PWC-009 | MED-28 | `/app/campo/lecturas` | `med.campo.leer` | — |
| SM-PWC-010 | MED-29 | `/app/campo/lecturas/:batchId/:taskId` | `med.campo.leer` | — |
| SM-PWC-011 | MED-29 (fuera de ruta) | modal | `med.campo.leer` | — |
| SM-PWC-012 | COB-29 | `/app/campo/cobrador` | `cob.cobranzaCampo.ver` | — |
| SM-PWC-013 | COB-29 (pestaña rendición) | `/app/campo/cobrador?tab=rendicion` | `cob.cobranzaCampo.ver` | relacionada (admin, AL-10): COB-13 (SM-ADM-061) |
| SM-PWC-014 | STK-37 | `/app/campo/mi-stock` | `stk.miStock.ver` | TEC-52 (absorbida, CTR-UXD-23), STK-39 (conteo) |
| SM-PWC-015 | TEC-56 | `/app/campo/map` | `tec.campo.ver` (PAN-TEC-56, AL-01; antes `tec.mapa.ver` y, antes, `tec.map.read`) | — |
| SM-PWC-016 | TEC-53 | `/app/campo/sync` | sesión de campo | MED-30 (absorbida, CTR-UXD-23) |
| SM-PWC-017 | SOC-34 | `/app/campo/viajes` | `soc.mi.viajes.ver` | — |
| SM-PWC-018 | POR-59 | `/app/perfil` | `por.perfil.editar` | — |

| ID | Grupo | Ítem | Ruta | Capability | Ola | Rol | PAN |
|---|---|---|---|---|---|---|---|
| SM-PWC-019 | Herramientas | Reparto de facturas | `/app/campo/reparto` | `fac.reparto.registrarEntrega` | O4 | repartidor | — (sin pantalla propia en esta app; pantalla relacionada FAC-46, citada en 10.9.13; M05 declara `/reparto`; normalizada por AL-05) |

#### 10.9.7 Landing: alineación y agregados

| SM | PAN principal | Ruta canónica | Acceso | PAN asociadas / nota |
|---|---|---|---|---|
| SM-LND-001 | POR-01 | `/` | Público | — |
| SM-LND-002 | POR-02 | `/servicios` | Público | CAT-23 (componente embebido en POR-02 y POR-03; HUE-SRV-04) |
| SM-LND-003 | POR-03 | `/servicios/:serviceCode` | Público | — |
| SM-LND-004 | POR-05 | `/noticias` | Público | COM-53 (antes también COM-43, que en T09 son las encuestas de la PWA) |
| SM-LND-005 | POR-06 | `/noticias/:slug` | Público | COM-53 (detalle; antes COM-44) |
| SM-LND-006 | POR-18 | `/registro` | Público | POR-20 (`/activar`); transversal (AL-10): IAM-06 (`/invite/:token`) |
| SM-LND-007 | POR-19 | `/ingresar` (alias `/login`) | Público | transversales (AL-10): IAM-02 (formulario T02), IAM-03, IAM-04 (CTR-UXD-26) |
| SM-LND-008 | POR-19 (M19 declara en PAN-POR-19 las rutas `/ingresar`, `/recuperar` y `/restablecer/:token`: misma app y recurso; PA-UXD-19; antes "— (sin pantalla propia en esta app; pantalla relacionada POR-19, citada en 10.9.13; M19 declara `/ingresar`, `/recuperar` y `/restablecer/:token`)") | `/recuperar`, `/restablecer/:token` | Público | transversal (AL-10): IAM-05 (`/forgot-password`, alias) |
| SM-LND-009 | FAC-45 | `/factura` | Público con verificación | M19 no define `/consulta`; se conserva como alias |
| SM-LND-010 | POR-12 | `/pagar` | Público con verificación | POR-22 (`/pagar/codigo`) |
| SM-LND-011 | POR-13 | `/contacto` | Público con verificación | relacionada (admin, AL-10): POR-91 (recepción, SM-ADM-209) |
| SM-LND-012 | POR-11 | `/baja/seguimiento` (alias `/seguimiento`) | Público con código | POR-10 |
| SM-LND-013 | POR-09 | `/baja` | Público con verificación | POR-10 |
| SM-LND-014 | POR-19 (ingreso con destino `/app/turnos`; antes "— (POR-52 requiere sesión)") | `/ingresar?next=/app/turnos` (ruta de POR-19 con destino, AL-09; `/turnos` queda como alias que redirige; antes "`/turnos` redirige a `/ingresar?next=/app/turnos`") | Público | relacionada (PWA socio, AL-10): POR-52 (SM-PWS-022); turno sin sesión: CRM-26 en tótem |
| SM-LND-015 | POR-08 | `/tramites` | Público | — |
| SM-LND-016 | COM-49 (antes COM-37, inexistente en T09) | `/e/:token` | Token | POR-17 (CTR-UXD-23) |
| SM-LND-017 | POR-13 | `/contacto` | Público | POR-14 (`/sucursales`) |
| SM-LND-018 | POR-16 | `/legal/:tipo` | Público | NFR-10 (`/privacidad`) |
| SM-LND-019 | UXD-14 (este anexo; antes "— (PAN-UXD-14)") | `/instalar` | Público | — |

| ID | Ítem | Ruta | Acceso | Ola | PAN |
|---|---|---|---|---|---|
| SM-LND-020 | Cobertura | `/cobertura` | Público | O2 | POR-04 |
| SM-LND-021 | Avisos de corte | `/avisos-de-corte` | Público | O2 | POR-07 |
| SM-LND-022 | Ayuda | `/ayuda` | Público | O2 | POR-15 |
| SM-LND-023 | Cuadros tarifarios | `/tarifas` | Público | O4 | TAR-24 |
| SM-LND-024 | Asambleas y convocatorias | `/asambleas` | Público | O10 | INS-33 |
| SM-LND-025 | Preferencias por enlace (reemplazado por SM-LND-026: T09 gestiona las preferencias por enlace en `/comunicaciones/:token`) | `/preferencias/:token` (alias que redirige a `/comunicaciones/:token`) | Token | O2 | — (sin pantalla propia en esta app; pantalla relacionada COM-50, citada en 10.9.13; antes COM-45, que en T09 es la agenda de la PWA) |
| SM-LND-026 | Comunicación por enlace | `/comunicaciones/:token` | Token | O2 | COM-50 |
| SM-LND-027 | Aceptar presupuesto | `/presupuesto/:token` | Token | O5 | VEN-05 |
| SM-LND-028 | Verificar documento | `/verificar` | Público | O1 | WFL-29 |
| SM-LND-029 | Documento por enlace | `/d/:token` | Token | O1 | WFL-30 |
| SM-LND-030 | Portal de proveedores | `/proveedores` | Sesión de proveedor | O8 | CMP-23 |
| SM-LND-031 | Directorio de cooperativas | `/cooperativas` | Público (solo dominio genérico) | O2 | POR-21 |
| SM-LND-032 | Estado del servicio | `/estado` | Público (dominio de plataforma) | O1 | PLA-24, NFR-18 |
| SM-LND-033 | Portal para desarrolladores | `/developers` | Público (dominio de plataforma) | O11 | BIA-24 |
| SM-LND-034 | Buscar difunto | `/cementerio/buscar` | Público, solo si PRM-SOC-050 = true (HUECO-CEM-02) | O10 | POR-104 (datos de API-SOC-061) |

#### 10.9.8 Plataforma: alineación y agregados

| SM | PAN principal | Ruta canónica | Capability canónica | PAN asociadas / nota |
|---|---|---|---|---|
| SM-PLT-001 | PLA-01 | `/admin/plataforma/dashboard` | `pla.dashboard.ver` | — |
| SM-PLT-002 | PLA-02 | `/admin/plataforma/tenants` | `pla.tenants.ver` | PLA-03 |
| SM-PLT-003 | PLA-04 | `/admin/plataforma/tenants/alta` | `pla.altaAsistida.usar` | — |
| SM-PLT-004 | PLA-06 | `/admin/plataforma/planes` | `pla.planes.ver` | CAT-02 (`/admin/plataforma/cat/enablement`) |
| SM-PLT-005 | PLA-07 | `/admin/plataforma/contratos` | `pla.contratos.ver` | — |
| SM-PLT-006 | PLA-05 | `/admin/plataforma/catalogo` | `pla.catalogo.ver` | — |
| SM-PLT-007 | CAT-01 | `/admin/plataforma/cat/capabilities` | `cat.capacidades.ver` | CFG-24 (semillas) |
| SM-PLT-008 | CFG-26 | `/admin/plataforma/cfg/tablas` | `pla.cfg.tablasPlataforma.editar` | FIS-01, FIS-02, SUE-47, CFG-25, CFG-27 |
| SM-PLT-009 | INT-01 | `/admin/plataforma/integraciones/proveedores` | `int.proveedores.configurar` | INT-05; relacionada (admin del tenant, AL-10): INT-13 (SM-ADM-245) |
| SM-PLT-010 | PLA-21 | `/admin/plataforma/soporte/casos` | `pla.soporte.ver` | PLA-08, IAM-27 |
| SM-PLT-011 | NFR-11 | `/admin/plataforma/salud` | `nfr.saludPlataforma.ver` | PLA-25, NFR-12/PLA-13 y NFR-15/PLA-12 (CTR-UXD-23) |
| SM-PLT-012 | PLA-09 | `/admin/plataforma/operacion/jobs` | `pla.jobs.ver` | — |
| SM-PLT-013 | PLA-10 | `/admin/plataforma/operacion/backups` | `pla.backups.ver` | PLA-11, NFR-13 |
| SM-PLT-014 | PLA-14 | `/admin/plataforma/sandboxes` | `pla.sandbox.crear` | — |
| SM-PLT-015 | PLA-20 | `/admin/plataforma/releases` | `pla.releases.ver` | — |
| SM-PLT-016 | IAM-26 | `/admin/plataforma/iam/usuarios` | `iam.plataforma.usuarios.gestionar` | — |
| SM-PLT-017 | IAM-28 | `/admin/plataforma/seguridad` | `iam.plataforma.auditoria.ver` | NFR-14, NFR-16, NFR-17 |
| SM-PLT-018 | UXD-09 (este anexo) | `/admin/plataforma/experiencia/diccionario-base` | `uxd.plataforma.diccionarioBase.ver` (antes `plt.uxd.diccionarioBase.ver`) | — (antes fila agrupada SM-PLT-018 a SM-PLT-020 con "la de 10.8.6") |
| SM-PLT-019 | UXD-10 (este anexo) | `/admin/plataforma/experiencia/design-system` | `uxd.plataforma.tokens.ver` (antes `plt.uxd.tokens.ver`) | — |
| SM-PLT-020 | UXD-11 (este anexo) | `/admin/plataforma/experiencia/flags` | `uxd.plataforma.flags.configurar` (antes `plt.uxd.flags.configurar`) | — |

| ID | Grupo | Ítem | Ruta | Capability | Ola | PAN |
|---|---|---|---|---|---|---|
| SM-PLT-021 | Cooperativas | Proyectos de migración | `/admin/plataforma/migrations` | `mig.proyectos.ver` | O11 | MIG-01 (MIG-02 a MIG-05, MIG-07, MIG-09, MIG-22) |
| SM-PLT-022 | Cooperativas | Uso por tenant | `/admin/plataforma/uso` | `pla.uso.ver` | O1 | PLA-22 |
| SM-PLT-023 | Operación | Avisos de plataforma | `/admin/plataforma/avisos` | `pla.notices.publicar` | O1 | COM-33 (antes COM-46, que en T09 son los beneficios de la PWA) |
| SM-PLT-024 | Operación | Consumo de mensajería | `/admin/plataforma/mensajeria` | `pla.messaging.consumo.ver` | O2 | COM-34 (antes COM-47) |
| SM-PLT-025 | Operación | Monitoreo de BI y API | `/admin/plataforma/bia` | `pla.bia.api.monitorear` | O11 | BIA-23 |

#### 10.9.9 Superficies de dispositivo (`DSP`)

Servidas por `apps/pwa` en modo kiosco (sin tabbar, sin menú, sesión por credencial de dispositivo de T02). Código de app nuevo `DSP` en los IDs `SM-DSP-NNN`.

| ID | Ítem | Ruta | Acceso | Ola | PAN |
|---|---|---|---|---|---|
| SM-DSP-001 | Tótem de autoservicio y turnos | `/totem` | `por.totem.operar` (identidad del dispositivo, M19 PAN-POR-78; antes "Credencial de dispositivo") | O5 | POR-78 (POR-79 a POR-83; el módulo turnos usa `/totem/turnos/:branchId`), CRM-26 (CTR-UXD-23) |
| SM-DSP-002 | Pantalla de llamados del turnero | `/pantalla/:displayId` | Token de pantalla | O10 | CRM-25 |

#### 10.9.10 Claves de diccionario agregadas

Claves que faltaban en 10.7 para cubrir filas "Diccionario" de T04b (trazabilidad completa en 22.4). Canal `pwa-socio` salvo indicación; texto base vacío significa "no se muestra si el tenant no lo completa".

| Clave | Texto base | Origen | Alias aceptados (`renamedTo` → esta clave) |
|---|---|---|---|
| `por.pagos.leyendaVistaPrevia` | (vacío) | VAR_PMOVIL 14 | `cob.pagar.vistaPrevia.ayuda` (sección 19) |
| `por.inicio.textoBienvenida` | Hola, {nombre} | VAR_PMOVIL 912 | — |
| `ven.pwa.comprobante.leyendaPie` | (vacío) | VAR_PMOVIL 23 (canales `pwa-socio` y `documentos`) | — |
| `cob.cupon.codigoAutorizacion` | Código de autorización | VAR 3083 (canal `admin` y `documentos`) | — |
| `fac.concepto.desconocido` | Concepto sin descripción | VAR 2318 (canales `admin` y `documentos`) | — |
| `ins.capital.estadoMovimiento.suscripto` | Suscripto | VAR 2314 (ProCoop "Vendido") | `ins.capital.estadosMovimiento` (T04b) |
| `ins.capital.estadoMovimiento.facturado` | Facturado | VAR 2314 | ídem |
| `ins.capital.estadoMovimiento.integrado` | Integrado | VAR 2314 (ProCoop "Pagado") | ídem |

`login.enlaceAyuda.texto` ya existe en 10.7. `login.enlaceAyuda.url` se retira del diccionario porque la URL es un parámetro de M19 (CTR-UXD-28).

#### 10.9.11 Totales del mapa del sitio con 10.9

| App | Ítems 10.8 | Ítems 10.9 | Total |
|---|---|---|---|
| Admin (18 clusters, 71 grupos) | 254 | 148 (antes 140; +SM-ADM-395 a SM-ADM-402, corrección del 05-11-2026) | 402 (antes 394) |
| PWA socio | 41 | 8 (antes 7; +SM-PWS-049, corrección del 05-11-2026) | 49 (antes 48) |
| PWA empleado | 17 | 10 | 27 |
| PWA campo | 18 | 1 | 19 |
| Landing | 19 | 15 (antes 14; +SM-LND-034, HUECO-CEM-02) | 34 (antes 33) |
| Plataforma | 20 | 5 | 25 |
| Dispositivo | — | 2 | 2 |
| **Total** | **369** | **189** (antes 180) | **558** (antes 549) |

Claves de navegación: 558 `nav.item.*` (antes 549) + 18 `nav.cluster.*` + 72 `nav.grupo.*` (antes 71; +1 grupo "Servicios sociales" de la PWA socio). Claves de diccionario funcionales: 359 de 10.7 + 8 de 10.9.10 − 1 retirada (`login.enlaceAyuda.url`) + 44 de 10.9.12 (5 estados, 17 dominios, 18 motivos de baja, 4 de tipos de reclamo) = **410** (antes 366; HUE-SRV-09) + 1 de 10.7.1 (`org.entidadJuridica`, DEC-096) + 30 de 10.9.14 (DEC-093 a DEC-107, 10-11-2026; antes 15: la ronda de cierre suma 11 claves de DEC-095 y DEC-107, y la verificación final 4 más: `fis.obligation.cancelled.creditBalance`, `fac.invoice.dueDatesShifted.title`, `.body` y `por.invoice.dueDatesShifted`) = **441** (antes 437; *Reemplazado (10-11-2026): "26 de 10.9.14 … = 437 (antes 426)"*).

#### 10.9.12 Claves de estados canónicos, dominios, motivos de baja y tipos de reclamo por servicio (HUE-SRV-09, HUE-CLO-03, HUE-ALU-03)

Catálogo base de RF-UXD-179. Canales `admin`, `pwa-socio` y `documentos`. M02, M09, M19 y los demás módulos referencian estas claves y no crean equivalentes. El nombre comercial de cada servicio sigue siendo un dato de M02 y no una clave (RF-UXD-166); las claves `cat.domain.*` son solo la etiqueta genérica del dominio, usada cuando el tenant no tiene nombre propio (filtros, reportes, plataforma).

**Estados canónicos del contrato (M02 §8).** La clave canónica sigue el patrón `estado.servicio.<estado>` de 10.7.3. Las claves `cat.contract.lifecycle.<estadoCanónico>` que citan M02 y otros anexos se aceptan como alias (`renamedTo` → la clave de esta tabla).

| Estado canónico M02 | Clave | Texto base | Tono | Alias aceptados | Nota |
|---|---|---|---|---|---|
| `requested` | `estado.servicio.solicitado` (existe en 10.7.3) | Solicitado | `warn` | `cat.contract.lifecycle.requested` | Distinto de `estado.solicitud.recibida` (RF-UXD-075) |
| `feasibility` | `estado.servicio.enFactibilidad` (nueva) | En evaluación de factibilidad | `warn` | `cat.contract.lifecycle.feasibility` | — |
| `pendingInstallation` | `estado.servicio.pendienteInstalacion` (existe en 10.7.3) | Pendiente de instalación | `info` | `cat.contract.lifecycle.pendingInstallation` | — |
| `active` | `estado.servicio.activo` (existe en 10.7.3) | Activo | `ok` | `cat.contract.lifecycle.active` | — |
| `suspended` | `estado.servicio.suspendido` (existe en 10.7.3) | Suspendido | `bad` | `cat.contract.lifecycle.suspended` | Si el motivo implica corte físico se muestra `estado.servicio.cortado` (estado operativo, no canónico) |
| `reactivationPending` | `estado.servicio.rehabilitacionEnTramite` (nueva) | Rehabilitación en trámite | `warn` | `cat.contract.lifecycle.reactivationPending` | — |
| `pendingTermination` | `estado.servicio.bajaEnTramite` (nueva) | Baja en trámite | `warn` | `cat.contract.lifecycle.pendingTermination` | Par no equivalente con `estado.servicio.baja` (RF-UXD-164) |
| `terminated` | `estado.servicio.baja` (existe en 10.7.3) | Dado de baja | `neutral` | `cat.contract.lifecycle.terminated` | — |
| `cancelled` | `estado.servicio.anulado` (nueva) | Anulado | `neutral` | `cat.contract.lifecycle.cancelled` | Solicitud o alta anulada antes de activarse; par no equivalente con `estado.servicio.baja` |
| `superseded` | `estado.servicio.noVigente` (nueva) | No vigente (reemplazado) | `neutral` | `cat.contract.lifecycle.superseded` | Contrato sustituido por transferencia o recontratación; no se muestra al socio como baja |

**Dominios de servicio (`cat.domain.<código>`, `kind: label`).** `dict:cat.domain` de M02 es el término de 10.7.1 ("Tipo de servicio"); estas son sus etiquetas por código.

| Clave | Texto base | Clave | Texto base |
|---|---|---|---|
| `cat.domain.INT` | Internet | `cat.domain.SEP` | Sepelio |
| `cat.domain.TEL` | Telefonía | `cat.domain.CEM` | Cementerio parque |
| `cat.domain.TV` | Televisión | `cat.domain.SAN` | Banco de sangre |
| `cat.domain.ELE` | Energía eléctrica | `cat.domain.SAL` | Ambulancias y salud |
| `cat.domain.AG` | Agua potable | `cat.domain.VIV` | Planes de vivienda |
| `cat.domain.CLO` | Cloacas | `cat.domain.TAS` | Tasas de terceros |
| `cat.domain.GAS` | Gas | `cat.domain.CAP` | Capital social |
| `cat.domain.ALU` | Alumbrado público | `cat.domain.OTR` | Otras prestaciones |
| `cat.domain.OBR` | Pavimento y obras | — | — |

**Motivos de baja (`cat.contract.terminationReason.<motivo>`, `kind: label`).** Los valores los usa `dict:cat.contract.terminationReason` de M02 (glosario, RF de baja y PAN-POR-37). La columna "Aplica a" filtra los motivos que se ofrecen por dominio; el tenant puede desactivar motivos pero no crear claves nuevas fuera de este catálogo sin alta en T03. Al socio solo se le ofrecen los motivos marcados "Socio"; el resto lo usa el operador.

| Clave | Texto base | Aplica a | Quién lo elige |
|---|---|---|---|
| `cat.contract.terminationReason.solicitudTitular` | A pedido del titular | Todos | Socio, operador |
| `cat.contract.terminationReason.mudanza` | Mudanza | Todos los servicios con suministro o domicilio | Socio, operador |
| `cat.contract.terminationReason.cambioPrestador` | Cambio de prestador | INT, TEL, TV, SAL | Socio, operador |
| `cat.contract.terminationReason.costo` | Costo del servicio | Todos | Socio, operador |
| `cat.contract.terminationReason.disconformidad` | Disconformidad con el servicio | Todos | Socio, operador |
| `cat.contract.terminationReason.fallecimiento` | Fallecimiento del titular | Todos | Operador (desde `per.person.deceased`) |
| `cat.contract.terminationReason.transferencia` | Transferencia a otro titular | Todos los servicios con contrato transferible | Operador (genera `superseded`) |
| `cat.contract.terminationReason.deuda` | Baja por deuda | Según M08 | Operador o proceso de M08 |
| `cat.contract.terminationReason.decisionCooperativa` | Decisión de la cooperativa | Todos | Operador |
| `cat.contract.terminationReason.finPlazo` | Fin del plazo o de las cuotas | OBR, VIV, SAL, servicios con permanencia | Proceso automático |
| `cat.contract.terminationReason.otro` | Otro motivo | Todos (exige observación) | Socio, operador |
| `cat.contract.terminationReason.cambioTecnologia` | Cambio de tecnología | INT, TEL, TV | Socio, operador |
| `cat.contract.terminationReason.inmuebleDeshabitado` | Inmueble deshabitado o demolido | ELE, AG, CLO, GAS | Socio, operador |
| `cat.contract.terminationReason.unificacionSuministros` | Unificación de suministros | ELE, AG, CLO, GAS | Operador |
| `cat.contract.terminationReason.instalacionNoApta` | Instalación interna no apta | GAS, ELE | Operador |
| `cat.contract.terminationReason.finConvenio` | Fin del convenio municipal | ALU, TAS | Operador |
| `cat.contract.terminationReason.cancelacionAnticipada` | Cancelación anticipada | OBR, VIV | Socio, operador |
| `cat.contract.terminationReason.cesionDerecho` | Cesión del derecho | CEM | Operador |

**Tipos de reclamo por servicio (`crm.claimType.*`, `kind: label`).** `crm.claimType` es la etiqueta del subtipo de caso de clase "reclamo" de M09 para cada dominio; M09 configura los subtipos referenciando estas claves. M02 indica en la fila "Atención" de cada ficha 6.C qué claves ofrece el servicio. Esta tabla cubre los tipos que no tenían clave; el resto de los subtipos de M09 se agregan aquí con el mismo patrón `crm.claimType.<dominio>.<tipo>`.

| Clave | Texto base | Dominio | Nota |
|---|---|---|---|
| `crm.claimType` | Tipo de reclamo | Todos | Término (`kind: term`); complementa `crm.reclamo` de 10.7.1 |
| `crm.claimType.clo.desborde` | Desborde cloacal | CLO | Prioridad sanitaria; ficha CLO de M02 |
| `crm.claimType.clo.obstruccion` | Obstrucción de cloaca | CLO | Ficha CLO de M02 |
| `crm.claimType.alu.luminariaApagada` | Luminaria apagada | ALU | Se deriva a la cooperativa o al municipio según el convenio (`domainAttributes.agreement.claimHandler` de M02; PRM-CAT-111) |

#### 10.9.13 Pantallas relacionadas de otra app, transversales y citas anteriores (AL-10, AL-11)

Corrección del cierre de residuales (05-11-2026; PA-UXD-18, Asumida DEC-072). Las columnas de PAN de 10.8 y 10.9 solo citan pantallas de la misma app y recurso que el ítem. Las pantallas de otra app (AL-10), las pantallas transversales de T02 y las citas anteriores a pantallas que no existen en el anexo dueño (AL-11) se registran acá, con el texto anterior de la celda. La fila no es un ítem del mapa: el ítem es el de la primera columna.

| Ítem del mapa | Pantalla citada | Tipo de cita | Ruta de la pantalla citada | Texto anterior de la celda |
|---|---|---|---|---|
| Ítem SM-ADM-004 | PAN-COM-33 | cita anterior | `/admin/plataforma/avisos` | — (antes COM-33, que en T09 son los avisos de plataforma de SM-PLT-023) |
| Ítem SM-ADM-031 | PAN-MED-32 | otra app o recurso (AL-10) | `/mis-servicios/:id/autolectura` | relacionada (PWA socio, AL-10): MED-32, ítem SM-PWS-015 |
| Ítem SM-PWS-007 | PAN-COB-35 | otra app o recurso (AL-10) | `/mi-cuenta` | FAC-43, COB-35 (M07 declara `/mi-cuenta`; se sirve dentro de la ruta de M19, AL-04) |
| Ítem SM-PWS-011 | PAN-COB-35 | otra app o recurso (AL-10) | `/mi-cuenta` | COB-35 (M07 declara `/mi-cuenta`; ruta de M19, AL-04) |
| Ítem SM-PWS-026 | PAN-COM-30 | cita anterior | `/admin/com/envio-manual` | POR-55 (muro, `/app/muro(/:id)`, AL-09), COM-40, COM-51 (CTR-UXD-24; antes COM-30); enlaza a novedades (SM-PWS-029) y encuestas (SM-PWS-030) |
| Ítem SM-PWS-027 | PAN-COM-31 | cita anterior | `/admin/com/exportaciones` | COM-41 (antes COM-31) |
| Ítem SM-PWS-028 | PAN-COM-40 | otra app o recurso (AL-10) | `/app/muro` | COM-40 (vista "Guardados" del muro, datos de API-COM-03; T09 no define pantalla propia; antes COM-32, que en T09 es la bandeja interna del admin) |
| Ítem SM-PWS-028 | PAN-COM-32 | cita anterior | `/admin/avisos` | COM-40 (vista "Guardados" del muro, datos de API-COM-03; T09 no define pantalla propia; antes COM-32, que en T09 es la bandeja interna del admin) |
| Ítem SM-PWS-029 | PAN-COM-34 | cita anterior | `/admin/plataforma/mensajeria` | COM-44 (`/boletines`, alias; antes COM-34) |
| Ítem SM-PWS-030 | PAN-COM-36 | inexistente en el anexo dueño (AL-11) | — | COM-43 (CTR-UXD-24; antes COM-35 y COM-36, inexistentes en T09) |
| Ítem SM-PWS-030 | PAN-COM-35 | inexistente en el anexo dueño (AL-11) | — | COM-43 (CTR-UXD-24; antes COM-35 y COM-36, inexistentes en T09) |
| Ítem SM-PWS-031 | PAN-COM-33 | cita anterior | `/admin/plataforma/avisos` | COM-42 (CTR-UXD-24; antes COM-33) |
| Ítem SM-PWS-043 | PAN-COM-38 | inexistente en el anexo dueño (AL-11) | — | COM-45 (antes COM-38, inexistente en T09) |
| Ítem SM-PWS-044 | PAN-COM-39 | inexistente en el anexo dueño (AL-11) | — | COM-46 (antes COM-39, inexistente en T09) |
| Ítem SM-PWE-004 | PAN-WFL-10 | otra app o recurso (AL-10) | `/inicio/aprobaciones/:id` | relacionada (admin, AL-10): WFL-10 (detalle de aprobación, ítem SM-ADM-257) |
| Ítem SM-PWE-005 | PAN-COM-38 | inexistente en el anexo dueño (AL-11) | — | CRM-36, COM-45 (antes COM-38) |
| Ítem SM-PWE-006 | PAN-COM-33 | cita anterior | `/admin/plataforma/avisos` | COM-42 (antes COM-33) |
| Ítem SM-PWE-007 | PAN-WFL-02 | cita anterior | `/inicio/bandeja/equipo` | WFL-23 (vista equipo, AL-09; antes "WFL-02 (versión móvil)") |
| Ítem SM-PWE-007 | PAN-CRM-01 | otra app o recurso (AL-10) | `/crm/supervision` | relacionadas (admin, AL-10): WFL-02 (SM-ADM-255), CRM-01 (SM-ADM-304) |
| Ítem SM-PWE-010 | PAN-COM-12 | cita anterior | `/admin/com/encuestas/:id/resultados` | COM-52 (composer de encuesta rápida; antes "COM-12 (versión modal)") |
| Ítem SM-PWE-011 | PAN-COM-35 | inexistente en el anexo dueño (AL-11) | — | COM-43 (antes COM-35, inexistente en T09) |
| Ítem SM-PWE-012 | PAN-COM-34 | cita anterior | `/admin/plataforma/mensajeria` | COM-44 (antes COM-34, que en T09 es el consumo de mensajería) |
| Ítem SM-PWE-019 | PAN-SUE-43 | otra app o recurso (AL-10) | `/empleado/datos` | SUE-43 (dueño M16, PA-SUE-16; POR-74 la incrusta en el shell de M19; antes "POR-74; ruta de M19, AL-04; M16 declara `/empleado/datos`") |
| Ítem SM-PWC-004 | PAN-TEC-25 | otra app o recurso (AL-10) | `/admin/tec/installations` | relacionada (admin, AL-10): TEC-25 (SM-ADM-106) |
| Ítem SM-PWC-005 | PAN-MOR-27 | otra app o recurso (AL-10) | `/admin/mor/interrupciones` | relacionada (admin, AL-10): MOR-27 (SM-ADM-075) |
| Ítem SM-PWC-006 | PAN-TEC-41 | otra app o recurso (AL-10) | `/admin/tec/inspections` | relacionada (admin, AL-10): TEC-41 (SM-ADM-312) |
| Ítem SM-PWC-008 | PAN-CRM-07 | otra app o recurso (AL-10) | `/crm/incidentes` | relacionada (admin, AL-10): CRM-07 (SM-ADM-092) |
| Ítem SM-PWC-013 | PAN-COB-13 | otra app o recurso (AL-10) | `/cob/caja/rendiciones` | relacionada (admin, AL-10): COB-13 (SM-ADM-061) |
| Ítem SM-PWC-019 | PAN-FAC-46 | otra app o recurso (AL-10) | `/reparto` | FAC-46 (M05 declara `/reparto`; normalizada por AL-05) |
| Ítem SM-LND-004 | PAN-COM-43 | cita anterior | `/app/encuestas(/:id)` | COM-53 (antes también COM-43, que en T09 son las encuestas de la PWA) |
| Ítem SM-LND-005 | PAN-COM-44 | cita anterior | `/app/novedades(/:id)` | COM-53 (detalle; antes COM-44) |
| Ítem SM-LND-006 | PAN-IAM-06 | otra app o recurso (AL-10) | `/invite/:token` | POR-20 (`/activar`); transversal (AL-10): IAM-06 (`/invite/:token`) |
| Ítem SM-LND-007 | PAN-IAM-04 | otra app o recurso (AL-10) | `/select-scope` | transversales (AL-10): IAM-02 (formulario T02), IAM-03, IAM-04 (CTR-UXD-26) |
| Ítem SM-LND-007 | PAN-IAM-02 | otra app o recurso (AL-10) | `/login` | transversales (AL-10): IAM-02 (formulario T02), IAM-03, IAM-04 (CTR-UXD-26) |
| Ítem SM-LND-007 | PAN-IAM-03 | otra app o recurso (AL-10) | `/login/mfa` | transversales (AL-10): IAM-02 (formulario T02), IAM-03, IAM-04 (CTR-UXD-26) |
| Ítem SM-LND-008 | PAN-POR-19 | Reemplazado: es la principal del ítem en 10.9.7 (PA-UXD-19; antes "otra app o recurso (AL-10)") | `/ingresar` | POR-19 (M19 declara `/ingresar`, `/recuperar` y `/restablecer/:token`) |
| Ítem SM-LND-008 | PAN-IAM-05 | otra app o recurso (AL-10) | `/forgot-password` | transversal (AL-10): IAM-05 (`/forgot-password`, alias) |
| Ítem SM-LND-011 | PAN-POR-91 | otra app o recurso (AL-10) | `/admin/portal/recepcion-publica` | relacionada (admin, AL-10): POR-91 (recepción, SM-ADM-209) |
| Ítem SM-LND-014 | PAN-POR-52 | cita anterior | `/app/turnos` | POR-19 (ingreso con destino `/app/turnos`; antes "— (POR-52 requiere sesión)") |
| Ítem SM-LND-016 | PAN-COM-37 | inexistente en el anexo dueño (AL-11) | — | COM-49 (antes COM-37, inexistente en T09) |
| Ítem SM-LND-025 | PAN-COM-50 | otra app o recurso (AL-10) | `/comunicaciones/:token` | COM-50 (antes COM-45, que en T09 es la agenda de la PWA) |
| Ítem SM-LND-025 | PAN-COM-45 | cita anterior | `/app/agenda` | COM-50 (antes COM-45, que en T09 es la agenda de la PWA) |
| Ítem SM-PLT-009 | PAN-INT-13 | otra app o recurso (AL-10) | `/admin/integraciones/layouts` | INT-05; relacionada (admin del tenant, AL-10): INT-13 (SM-ADM-245) |
| Ítem SM-PLT-023 | PAN-COM-46 | cita anterior | `/app/beneficios(/:id)` | COM-33 (antes COM-46, que en T09 son los beneficios de la PWA) |
| Ítem SM-PLT-024 | PAN-COM-47 | cita anterior | `/app/perfil/comunicaciones` | COM-34 (antes COM-47) |

#### 10.9.14 Claves de diccionario de las decisiones DEC-093 a DEC-107 (10-11-2026)

Claves `dict:` nuevas que citan los anexos al aplicar las decisiones del contraste del documento externo `NucleoTransversal-Modelo` y de la revisión de sus rechazos. Canal `admin` salvo indicación. El anexo citado es dueño de la pantalla; T03 registra la clave en `dictionaryKeys` (7.B.3) y su texto base. Las claves que esas decisiones solo volvieron a citar y que ya existían en su anexo (`per.relationship`, `per.guarantor`, `fis.lqsp`, `tec.fieldResource`, `ven.salesRep`, `cmp.supplier`, `soc.driver`, `cfg.glosario.sucursal`, `cfg.glosario.ambito`) no se repiten aquí. `cmp.supplier` figuraba en 10.7.1 como `cmp.proveedor`; se renombró a la clave que usan los anexos (M12 §3) y la anterior queda con `renamedTo` (RN-UXD-012; 10-11-2026).

| Clave | `kind` | Texto base | Anexo que la cita | Decisión | Alias aceptados (`renamedTo` → esta clave) / nota |
|---|---|---|---|---|---|
| `per.personRole` | `term` | Rol de la persona / Roles de la persona (m) | M01 glosario "Rol de persona en otro módulo", RF-PER-015 | DEC-097 | Proveedor, vendedor, chofer, profesional de salud y empleado como roles de una sola persona |
| `per.identificationStatus` | `term` | Estado de identificación (m) | M01 glosario, §7.1 `identificationStatus` | DEC-099 | — |
| `per.identificationStatus.identified` | `state` | Identificada | M01 §8.15 | DEC-099 | Tono `ok`; no se muestra chip en la ficha |
| `per.identificationStatus.approvedException` | `state` | Sin documento (excepción aprobada) | M01 §8.15, RF-PER-026 | DEC-099 | Tono `info` |
| `per.identificationStatus.documentPending` | `state` | Documento pendiente | M01 PAN-PER-02, PAN-PER-03 (filtro), PAN-PER-04 | DEC-099 | Tono `warn`; canales `admin` y `pwa-empleado` |
| `per.assistedCreate.title.supplier` | `label` | Nuevo proveedor: buscar o crear la persona | M01 PAN-PER-04 (modo búsqueda embebido), M12 | DEC-097 | Patrón `per.assistedCreate.title.<role>` de M01 |
| `per.assistedCreate.title.salesRep` | `label` | Nuevo vendedor: buscar o crear la persona | M01 PAN-PER-04, M11 | DEC-097 | Ídem |
| `per.assistedCreate.title.driver` | `label` | Nuevo chofer: buscar o crear la persona | M01 PAN-PER-04, M18 | DEC-097 | Ídem |
| `per.assistedCreate.title.medicalProfessional` | `label` | Nuevo profesional de salud: buscar o crear la persona | M01 PAN-PER-04, M18 | DEC-097 | Ídem |
| `per.assistedCreate.title.employee` | `label` | Nuevo legajo: buscar o crear la persona | M01 PAN-PER-04, M16 RF-SUE-004 | DEC-097 | Ídem |
| `soc.medicalProfessional` | `term` | Profesional de salud / Profesionales de salud (m) | M18 glosario | DEC-097 | Médico u otro profesional; ProCoop `MEDICOS` |
| `org.entidadJuridica` | `term` | Entidad / Entidades (f) | 10.7.1; M01 RF-PER-044 y PAN-PER-02/03; M17 §10; T10 filtros | DEC-096 | Registrada en 10.7.1 (término transversal); se lista aquí por trazabilidad y no suma al total de esta tabla. Alias: `ins.legalEntity` (M17 §10, columna y filtro "Entidad") |
| `tes.position.unremittedCash` | `label` | En cajas sin rendir | M14 RF-TES-145, RF-TES-168, PAN-TES-01 | DEC-101 | Línea separada de la posición; nunca se suma al disponible |
| `tar.formulaJustification.migratedPendingReview` | `label` | Traducida de ProCoop, pendiente de revisar | M04 RN-TAR-252 | DEC-105 | Texto fijo de la justificación de reglas con fórmula creadas por la migración; canal `documentos` en la revisión del cuadro |
| `cat.service.publicServiceSettlement` | `label` | Liquida como servicio público (LQSP) | M02 RF-CAT-117 | DEC-093 | Marca `tenantServices.profile.billing.publicServiceSettlement` |
| `crm.caseType.identityDocumentRegularization` | `label` | Regularización de documento | M09 RF-CRM-261 | DEC-099 | Nombre del tipo de gestión de sistema; no se muestra al socio |
| `com.notifKind.fis.obligation` | `label` | Obligación fiscal | T09 §9.6.4 (`notifKind` de los tipos `fis.obligation.created` y `fis.obligation.cancelled`) | DEC-095 | Etiqueta del mapa `notifKinds` (RF-UXD-103; convención `dict:com.notifKind.*` de T09 §3) (10-11-2026, ronda de cierre) |
| `fis.obligation.cancelled.title` | `message` | Obligación fiscal anulada | T09 §9.6.4, tipo de comunicación `fis.obligation.cancelled` (EVT-FIS-26) | DEC-095 | Asunto de la plantilla por defecto, que tiene el mismo código que el tipo; canales `A` y `E`, destinatario interno |
| `fis.obligation.cancelled.body` | `message` | Se anuló la obligación {tax} del período {period} de {legalEntity}. Motivo: {reason}. {replacement} | T09 §9.6.4 (EVT-FIS-26) | DEC-095 | `{reason}` se resuelve con `fis.obligation.cancelReason.*`; `{replacement}` solo si hay `replacedByObligationId` ("Se generó la obligación recalculada {number}") y, con `cancellationStatus = pendingPaymentReconciliation`, agrega `fis.obligation.status.cancellationPending` |
| `fis.obligation.cancelReason.manual` | `label` | Anulación manual | M06 §7.26 `cancelReason`, EVT-FIS-26 `reason` | DEC-095 | — |
| `fis.obligation.cancelReason.ownObligationRevoked` | `label` | Registro de obligación propia revocado | M06 RN-FIS-133 punto 8 | DEC-095 | — |
| `fis.obligation.cancelReason.capitalBaseReopened` | `label` | Base de capital reabierta | M06 RN-FIS-133 punto 7 | DEC-095 | — |
| `fis.obligation.cancelReason.recalculated` | `label` | Recalculada | M06 RN-FIS-133 puntos 7 y 9 | DEC-095 | — |
| `fis.obligation.status.cancellationPending` | `state` | Anulación pendiente de conciliación del pago | M06 §8 `taxObligations`, RN-FIS-133 punto 9 | DEC-095 | Tono `warn`; bandeja fiscal |
| `tes.paymentExecution.voidReason.taxObligationCancelled` | `label` | Obligación fiscal anulada | M14 §8.9 (motivo de la anulación automática de la ejecución) | DEC-095 | — |
| `tes.paymentInbox.alert.taxObligationCancelled` | `message` | Se anuló la obligación fiscal de este pago, que ya fue entregado o enviado al banco. Confirmá si se ejecutó o si el banco lo devolvió. | M14 §8.9 y §12.2 (aviso en la bandeja de pagos del tesorero con `delivered` o `sentToBank`) | DEC-095 | Tono `warn`; si se ejecutó, M06 registra el importe como saldo a favor ante el organismo (RN-FIS-133 punto 9) |
| `cob.fiscalGate.pendingAuthorization` | `state` | Pendiente de autorización fiscal | M07 RN-COB-158 punto 2 (estado de cuenta interno); M19 RF-POR-085 (compuerta que oculta el comprobante en el portal) | DEC-107 | Tono `info`; canal `admin`. En el portal el comprobante con este estado no se muestra (RF-POR-085), así que la clave no se usa en `pwa-socio` |
| `fis.obligation.cancelled.creditBalance` | `message` | El pago ya se había ejecutado: queda un saldo a favor de {creditBalanceAmount} ante el organismo. | T09 §9.6.4 (anulación definitiva con `creditBalanceAmount`); M14 aviso de §8.9 | DEC-095 | Se agrega al cuerpo de `fis.obligation.cancelled.body` y al aviso `tes.paymentInbox.alert.taxObligationCancelled` solo cuando viene `creditBalanceAmount` |
| `fac.invoice.dueDatesShifted.title` | `message` | Cambiaron los vencimientos de tu factura | T09 §9.6.4, tipo `fac.invoice.dueDatesShifted` (EVT-FAC-13 con `reason = lateAuthorization`) | DEC-107 | Canales del socio; asunto de la plantilla por defecto |
| `fac.invoice.dueDatesShifted.body` | `message` | La factura {number} se autorizó el {authorizedAt}. Sus vencimientos pasan a: {dueDates}. El importe no cambia y no se cobran intereses por el corrimiento. | T09 §9.6.4 (EVT-FAC-13) | DEC-107 | M05 RN-FAC-165 |
| `por.invoice.dueDatesShifted` | `message` | Vencimientos actualizados porque la factura se autorizó después de la fecha original. | M19 §12.2 (`invoiceView` con vencimientos corridos) | DEC-107 | Canal `pwa-socio`; tono `info` |

## 11. API

Errores RFC 9457 con `requestId`; paginación `{ items, total, page, size }`; validación Zod compartida (`packages/shared/schemas/uxd`). Los endpoints públicos tienen rate limiting por IP (CNX §10 V-07, T08).

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-UXD-01 | GET | `/api/public/{tenantSlug}/bootstrap?app=` (ruta de API-POR-01; antes `{slug}`) | `public: true` (antes "Pública") | **Referencia a API-POR-01** (dueño M19; no es un endpoint propio de T03; antes "Reemplazada por API-POR-01"), mismo endpoint: T03 aporta al payload la marca publicada, URLs de recursos, `themePolicy`, release de diccionario y URL del paquete pre-login, métodos de login y flags públicos (9.1). Motivo: tres anexos (T01, T03, M19) declaraban la misma ruta | Sí (GET, `ETag`) |
| API-UXD-02 | GET | `/api/public/{tenantSlug}/pwa/manifest.webmanifest?app={socio\|empleado\|campo}` | `public: true` (antes "Público") | Manifest dinámico (RN-UXD-037) | Sí |
| API-UXD-03 | GET | `/api/public/{tenantSlug}/dictionary/{release}/{channel}/{bundle}.json` | `public: true` para `login`/`landing`; `iam.sesion.autenticada` para el resto (antes "Público para `login`/`landing`; autenticado para el resto") | Paquete compilado de diccionario (caché inmutable) | Sí |
| API-UXD-04 | GET | `/api/public/{tenantSlug}/assets/{hash}.{ext}` | `public: true` (antes "Público") | Recurso de marca público | Sí |
| API-UXD-05 | GET | `/api/admin/uxd/branding` | `uxd.marca.ver` | Publicada + borrador vigente | Sí |
| API-UXD-06 | PUT | `/api/admin/uxd/branding/draft` | `uxd.marca.editar` | Crear/actualizar borrador (control `version`) | Sí (`If-Match`) |
| API-UXD-07 | DELETE | `/api/admin/uxd/branding/draft` | `uxd.marca.editar` | Descartar borrador | Sí |
| API-UXD-08 | POST | `/api/admin/uxd/branding/publish` | `uxd.marca.publicar` | Publicar borrador (`Idempotency-Key`) | Sí |
| API-UXD-09 | POST | `/api/admin/uxd/branding/revert` | `uxd.marca.publicar` | Revertir a `releaseNumber` | Sí (`Idempotency-Key`) |
| API-UXD-10 | GET | `/api/admin/uxd/branding/releases` | `uxd.marca.ver` | Historial | Sí |
| API-UXD-11 | POST | `/api/admin/uxd/branding/assets` | `uxd.marca.editar` | Subir recurso (multipart a URL firmada; crea `brandAssets` en `processing`) | Sí (por `sha256`) |
| API-UXD-12 | GET | `/api/admin/uxd/branding/assets?kind=&channel=` | `uxd.marca.ver` | Listar recursos | Sí |
| API-UXD-13 | DELETE | `/api/admin/uxd/branding/assets/{id}` | `uxd.marca.editar` | Baja lógica si no está referenciado | Sí |
| API-UXD-14 | POST | `/api/admin/uxd/branding/contrast-check` | `uxd.marca.ver` | Calcula derivados y contraste de colores arbitrarios | Sí |
| API-UXD-15 | GET | `/api/admin/uxd/dictionary/keys?q=&module=&kind=&channel=&screen=&customized=&warnings=&page=&size=` | `uxd.diccionario.ver` | Catálogo con valor base, valor del tenant y estado | Sí |
| API-UXD-16 | PUT | `/api/admin/uxd/dictionary/entries/{key}?channel=` | `uxd.diccionario.editar` | Crear/actualizar borrador de entrada (valida RN-UXD-005…009) | Sí (`If-Match`) |
| API-UXD-17 | DELETE | `/api/admin/uxd/dictionary/entries/{key}?channel=` | `uxd.diccionario.editar` | Borrador de vuelta al base | Sí |
| API-UXD-18 | POST | `/api/admin/uxd/dictionary/publish` | `uxd.diccionario.publicar` | Publicar borradores con nota | Sí (`Idempotency-Key`) |
| API-UXD-19 | POST | `/api/admin/uxd/dictionary/revert` | `uxd.diccionario.revertir` | Revertir a release `k` | Sí (`Idempotency-Key`) |
| API-UXD-20 | GET | `/api/admin/uxd/site-map?app=` | `iam.sesion.autenticada` (antes "Autenticado") | Árbol filtrado para el usuario con labels resueltos y badges (9.10) | Sí |
| API-UXD-21 | GET | `/api/admin/uxd/dictionary/releases` y `/releases/{n}/diff/{m}` | `uxd.diccionario.ver` | Historial y diferencias | Sí |
| API-UXD-22 | GET | `/api/admin/uxd/dictionary/export?format=xlsx\|json` | `uxd.diccionario.exportar` | Exportar | Sí |
| API-UXD-23 | POST | `/api/admin/uxd/dictionary/import` (pasos `upload`, `preview`, `confirm`) | `uxd.diccionario.importar` | Importación con `ExcelImportWizard` | Sí (hash archivo) |
| API-UXD-24 | POST | `/api/admin/uxd/dictionary/apply-template` | `uxd.diccionario.editar` | Copia una plantilla de plataforma como borradores | Sí |
| API-UXD-25 | GET | `/api/admin/uxd/dictionary/usage/{key}` | `uxd.diccionario.ver` | Dónde se usa (pantallas y claves que referencian el término) | Sí |
| API-UXD-26 | POST | `/api/uxd/dictionary/missing` | `iam.sesion.autenticada` o `public: true` con muestreo (antes "Autenticado o público con muestreo") | Reporte de clave faltante | Sí (agrega contador) |
| API-UXD-27 | GET/PUT | `/api/admin/uxd/help/{screenId}` | `uxd.ayuda.editar` (PUT) / autenticado (GET) | Ayuda contextual (base + override) | Sí |
| API-UXD-28 | GET/PUT | `/api/admin/uxd/flags` y `/flags/{key}` | `uxd.flags.configurar` | Flags del tenant | Sí |
| API-UXD-29 | GET/PUT | `/api/admin/uxd/pwa-nav/{role}` | `uxd.navegacion.configurar` | Navegación PWA por rol | Sí |
| API-UXD-30 | GET/PUT | `/api/me/ui-preferences` | `iam.sesion.autenticada` (antes "Autenticado") | Preferencias del usuario (tema, densidad, fijados, recientes, feed) | Sí |
| API-UXD-31 | GET/POST/PUT/DELETE | `/api/admin/uxd/table-views?tableId=` y `/{id}` | Autenticado (`uxd.vistas.compartir` para `shared=true`) | Vistas guardadas de `DataTable` | Sí |
| API-UXD-32 | GET | `/api/uxd/site-map?app=pwa&role=` | `iam.sesion.autenticada` (antes "Autenticado") | Menú PWA filtrado por rol | Sí |
| API-UXD-33 | GET/PUT/POST | `/api/platform/uxd/dictionary-keys` (+ `/publish`, `/templates`) | `uxd.plataforma.diccionarioBase.ver` (GET), `uxd.plataforma.diccionarioBase.editar` (PUT/POST), `uxd.plataforma.diccionarioBase.publicar` (`/publish`) (antes `plt.uxd.diccionarioBase.*`, comodín; T02 §4.4.3) | Catálogo de producto y plantillas | Sí |
| API-UXD-34 | GET | `/api/platform/uxd/dictionary-missing` | `uxd.plataforma.diccionarioBase.ver` (antes `plt.uxd.diccionarioBase.ver`) | Faltantes de todos los tenants (sin datos personales) | Sí |
| API-UXD-35 | GET/PUT | `/api/platform/uxd/flags` | `uxd.plataforma.flags.configurar` (antes `plt.uxd.flags.configurar`) | Flags globales | Sí |
| API-UXD-36 | GET | `/api/platform/uxd/branding/{tenantId}` | `uxd.plataforma.marca.ver` (antes `plt.uxd.marca.ver`) | Marca de un tenant (lectura) | Sí |
| API-UXD-37 | PUT | `/api/platform/uxd/branding/{tenantId}/draft` | `uxd.plataforma.marca.asistir` (antes `plt.uxd.marca.asistir`) | Propuesta de marca en el alta asistida (queda en borrador del tenant) | Sí |

## 12. Eventos y jobs

### 12.1 Eventos emitidos

| EVT-ID | Evento | Payload | Consumidores |
|---|---|---|---|
| EVT-UXD-01 | `uxd.branding.published` | `tenantId`, `releaseNumber`, `changedSlots[]` | Clientes (push de versión), M05/T09 (logos de documentos y emails), CDN |
| EVT-UXD-02 | `uxd.branding.reverted` | `tenantId`, `releaseNumber`, `revertedFrom` | Ídem |
| EVT-UXD-03 | `uxd.asset.processed` | `tenantId`, `assetId`, `status` | Editor de marca (actualiza slot) |
| EVT-UXD-04 | `uxd.dictionary.published` | `tenantId`, `releaseNumber`, `changedKeys[]` | Clientes, T09 (plantillas), M05 (documentos), T10 (metadatos BI), bot/IA (M09) |
| EVT-UXD-05 | `uxd.dictionary.reverted` | `tenantId`, `releaseNumber`, `revertedFrom` | Ídem |
| EVT-UXD-06 | `uxd.dictionary.missingKeyDetected` | `tenantId`, `key`, `channel`, `count` | Plataforma (alerta si supera umbral) |
| EVT-UXD-07 | `uxd.flag.changed` | `scope`, `tenantId?`, `key`, `enabled`, `reason` | Clientes, auditoría |
| EVT-UXD-08 | `uxd.catalog.updated` | `catalogVersion`, `added[]`, `renamed[]`, `deprecated[]` | JOB-UXD-03 (recompilar todos los tenants), aviso a administradores (RF-UXD-159) |

### 12.2 Eventos consumidos

| Evento | Origen | Acción UXD |
|---|---|---|
| `pla.tenant.created` | T01 | JOB-UXD-04 (siembra marca y diccionario) |
| `pla.license.updated` (EVT-PLA-08) / `pla.capability.activated` / `.deactivated` (EVT-PLA-06/07) | T01 | Invalidar caché del mapa del sitio del tenant |
| `iam.role.changed` / `iam.profile.changed` (EVT-IAM-05), `iam.role.assigned` / `.unassigned` (EVT-IAM-04) | T02 | Invalidar caché de mapa por usuario/rol |
| `cfg.branch.created` / `.updated` / `.deactivated` (EVT-CFG-20; antes `pla.branch.*` EVT-PLA-21, reemplazado por EVT-CFG-20) | T04 | Habilitar slots de marca por sucursal |
| `pla.tenantProfile.updated` (EVT-PLA-22) | T01 | Refrescar `legalName` en pie y documentos |

### 12.3 Jobs

| JOB-ID | Nombre | Disparo | Descripción | Reintentos |
|---|---|---|---|---|
| JOB-UXD-01 | `uxd:procesar-recurso` | Subida de recurso | Valida formato, sanea SVG, genera variantes (íconos 48–512, maskable, apple-touch, favicon, splash), calcula `sha256`, publica en bucket | 3, exponencial; `rejected` con motivo |
| JOB-UXD-02 | `uxd:compilar-marca` | `uxd.branding.published/reverted` | Genera CSS de variables por tenant, manifests por app, invalida CDN | 5 |
| JOB-UXD-03 | `uxd:compilar-diccionario` | `uxd.dictionary.published/reverted`, `uxd.catalog.updated` | Fusiona base + tenant + canal, resuelve referencias a términos, valida, genera paquetes por app/canal con hash | 5; si falla, el release queda `pending-build` y los clientes siguen con el anterior |
| JOB-UXD-04 | `uxd:sembrar-tenant` | `pla.tenant.created` | Crea `tenantBrandings` release 1 y release 0 del diccionario; opcional plantilla | 5, idempotente por `tenantId` |
| JOB-UXD-05 | `uxd:sincronizar-catalogo` | Despliegue | Sincroniza `packages/dictionary/base` con `dictionaryKeys`, aplica `renamedTo` a entradas de tenants, emite EVT-UXD-08 | 3 |
| JOB-UXD-06 | `uxd:resumen-claves-faltantes` | Diario 03:00 (zona plataforma) | Agrega `dictionaryMissingKeys` y alerta si una clave falta en > 1 tenant | 3 |
| JOB-UXD-07 | `uxd:auditar-contraste` | Semanal y al cambiar tokens base | Recalcula `contrastReport` de todos los tenants y avisa a los que no cumplen | 3 |

## 13. Integraciones

| Integración | Uso en UXD | Referencia |
|---|---|---|
| Almacenamiento de objetos (S3 compatible) | Recursos de marca (bucket público por tenant con hash; privado para el resto) | T08, CNX §10 V-01 |
| CDN | Servir recursos públicos, CSS de marca, manifests y paquetes de diccionario con caché inmutable | T08 |
| Proveedor de mapas (Google Maps por defecto, OSM/Leaflet alternativo) | `MapView`, `AddressPicker`, mapa de campo; clave en bóveda del tenant (reemplaza VAR 2251, 2242) | T06, BASE §77, PA-UXD-09 |
| Enlaces externos de navegación (Google Maps, Waze) | Botón "Cómo llegar" en PWA campo | CNX §2.1 |
| Web Push (VAPID) | `usePushSubscribe` | T09, CNX §2.7 |
| SSO (Google, OIDC) y CiDi | Botones del login | T02, BASE §60, VAR_PMOVIL 40 |
| Proveedor de IA | Propuesta de marca en alta asistida, propuestas de textos; solo propone | T06, CNX §4.2 |
| Herramientas de accesibilidad (axe-core) | CI | T08 |

## 14. Parámetros de configuración

Registrados también en el catálogo de T04 (ámbito `tenant` salvo indicación).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-UXD-001 | `uxd.theme.policy` | enum `dark`/`light`/`user` | tenant | `dark` | Política de tema de admin y PWA (fuera de `.pwa-mod`) | CNX §3.1 |
| PRM-UXD-002 | `uxd.theme.landingDefault` | enum `light`/`dark` | tenant | `light` | Tema por defecto de la landing | — |
| PRM-UXD-003 | `uxd.pwa.phoneShellDesktop` | Boolean | tenant | `true` | Phone shell en escritorio | CNX §3.3 |
| PRM-UXD-004 | `uxd.pwa.wideViewAllowed` | Boolean | tenant | `false` | "Vista amplia" en escritorio (PA-UXD-11) | — |
| PRM-UXD-005 | `uxd.pwa.blockDesktopRoles` | Array de roles | tenant | `[]` | Roles a los que se bloquea el escritorio | CNX §3.3 |
| PRM-UXD-006 | `uxd.pwa.installPromptCooldownDays` | Int | tenant | `30` | Días sin volver a ofrecer instalar | CNX §3.4 |
| PRM-UXD-007 | `uxd.pwa.feedModeDefault` | enum `carousel`/`list` | tenant | `list` | Modo del muro por defecto | CNX §5.1 |
| PRM-UXD-008 | `uxd.pwa.maxBanners` | Int (1–3) | plataforma | `2` | Banners visibles simultáneos | CNX §3.3 |
| PRM-UXD-009 | `uxd.pwa.splashMaxMs` | Int (0–1200) | tenant | `1200` | Duración máxima del splash | CNX §3.4 |
| PRM-UXD-010 | `uxd.contrast.minText` | Decimal | plataforma | `4.5` | Contraste mínimo para texto de marca | AGR-032 |
| PRM-UXD-011 | `uxd.assets.maxBytes` | Int | plataforma | `2097152` | Peso máximo de recurso de marca | — |
| PRM-UXD-012 | `uxd.branding.clientRefreshMinutes` | Int | plataforma | `5` | Revalidación de versión en clientes abiertos | — |
| PRM-UXD-013 | `uxd.import.maxBytes` / `maxRows` | Int | plataforma | `20 MB` / `100000` | Límites de `ExcelImportWizard` | — |
| PRM-UXD-014 | `uxd.table.pageSizes` | Array Int | plataforma | `[25, 50, 100]` | Tamaños de página | CNX §2.6 |
| PRM-UXD-015 | `uxd.table.exportDefault` | enum `xlsx`/`csv`/`pdf` | tenant | `xlsx` | Formato por defecto de exportación | VAR 2294 (Reemplazado) |
| PRM-UXD-016 | `uxd.table.exportMaxRows` | Int | plataforma | `200000` | Por encima, exportación por job con aviso | — |
| PRM-UXD-017 | `uxd.pinned.max` | Int | plataforma | `12` | Máximo de accesos fijados | — |
| PRM-UXD-018 | `uxd.toast.successMs` | Int | plataforma | `4000` | Duración de toasts de éxito | — |
| PRM-UXD-019 | `uxd.undo.windowMs` | Int | plataforma | `6000` | Ventana de "Deshacer" | CNX §6.3 |
| PRM-UXD-020 | `uxd.dict.missingKeyMode` | enum `fallback`/`highlight` | plataforma por ambiente | `fallback` (prod) / `highlight` (dev, prueba) | Comportamiento ante clave faltante | BASE §65.8 |
| PRM-UXD-021 | `uxd.publish.dualControl` | Boolean | tenant | `false` | Publicador distinto del editor (marca y diccionario) | PA-UXD-04 |
| PRM-UXD-022 | `uxd.dict.channelVariantsEnabled` | Boolean | tenant | `true` | Permitir variantes por canal | PA-UXD-05 |
| PRM-UXD-023 | `uxd.dict.templatesAllowed` | Boolean | tenant | `true` | Permitir aplicar plantillas | BASE §65.9 |
| PRM-UXD-024 | `uxd.branches.logosEnabled` | Boolean | tenant | `false` | Logos por sucursal | PA-UXD-10 |
| PRM-UXD-025 | `uxd.admin.minWidthWarning` | Int | plataforma | `768` | Ancho bajo el cual el admin sugiere la PWA | PA-UXD-13 |
| PRM-UXD-026 | `uxd.siteMap.showUnlicensedToAdmin` | Boolean | tenant | `true` | Mostrar "No contratado" al administrador | PA-UXD-12 |
| PRM-UXD-027 | `uxd.fontScale.allowed` | Array | plataforma | `[100, 115, 130]` | Escalas de texto | AGR-032 |
| PRM-UXD-030 | `uxd.login.showTenantCodeField` | Boolean | plataforma | `true` en dominio genérico | Campo de código de cooperativa | CNX §3.6 |
| PRM-UXD-031 | `uxd.login.helpLink.enabled` (+ `dict:login.enlaceAyuda.*`) | Boolean | tenant | `false` | Enlace de referencia en el login | VAR_PMOVIL 34 |
| PRM-UXD-032 | `uxd.login.userErrorDetail` | enum `generic`/`specific` | tenant | `generic` | Distinguir usuario inexistente de contraseña incorrecta (PA-UXD-14) | CNX §3.6 |
| PRM-UXD-033 | `uxd.ui.supportChatButton` | Boolean | tenant | `false` | Botón de chat con soporte | VAR 2683 |
| PRM-UXD-034 | `uxd.pwa.assistantEnabled` | Boolean | tenant | `false` | Asistente IA en topbar PWA | PA-UXD-16 |
| PRM-UXD-040 | `uxd.map.provider` | enum `google`/`osm` | tenant | `google` | Proveedor de mapa | VAR 2090 (Google/Bing → Google/OSM) |
| PRM-UXD-041 | `uxd.map.startCoordinates` | `{lat, lng}` | tenant | centro de la localidad del tenant (T04) | Coordenadas iniciales | VAR 2027 |
| PRM-UXD-042 | `uxd.map.startZoom` | Int | tenant | `13` | Zoom inicial | VAR 2028 |
| PRM-UXD-043 | `uxd.map.type` | enum `roadmap`/`satellite`/`hybrid`/`terrain` | tenant | `roadmap` | Tipo de mapa | VAR 2029 |
| PRM-UXD-044 | `uxd.map.apiKeyRef` | Referencia a bóveda | tenant | — | Clave del proveedor (en bóveda, nunca en parámetro) | VAR 2251 (Google); VAR 2242 (Bing → Descartado) |

Los identificadores PRM-UXD-028/029 y 035–039 quedan reservados sin uso.

## 15. Reportes, indicadores y exportaciones

| IND-ID | Indicador | Fórmula | Universo | Fecha de corte |
|---|---|---|---|---|
| IND-UXD-01 | Claves faltantes activas | `count(dictionaryMissingKeys where resolvedAt = null)` | Tenant / plataforma | Al momento |
| IND-UXD-02 | Grado de personalización del diccionario | `claves con entrada publicada del tenant / claves editables del catálogo × 100` | Tenant | Release vigente |
| IND-UXD-03 | Releases de diccionario y marca por período | `count(releases)` y reversiones | Tenant | Fin del período |
| IND-UXD-04 | Cumplimiento de contraste de la marca | Pares que cumplen / pares evaluados | Tenant | Release vigente |
| IND-UXD-05 | Utilidad de ayudas | `respuestas "sí" / respuestas totales` en `ScreenHelp` por `screenId` | Tenant / plataforma | Período |
| IND-UXD-06 | Instalaciones de la PWA | Eventos `appinstalled` por app (socio/empleado/campo) | Tenant | Período |
| IND-UXD-07 | Uso del mapa del sitio y búsqueda | Búsquedas sin resultado / búsquedas totales (sugiere `keywords` faltantes) | Tenant / plataforma | Período |
| IND-UXD-08 | Hallazgos de accesibilidad abiertos | Por severidad (crítico, serio, moderado) | Plataforma | Al cierre de ola |
| IND-UXD-09 | Pendientes offline antiguos | Ítems de cola con antigüedad > 24 h por usuario de campo | Tenant | Al momento |

Exportaciones: PAN-UXD-02 (diccionario XLSX/JSON), PAN-UXD-03 (diferencias de release CSV), auditoría de cambios de marca y diccionario vía `Timeline`/T02. Todas con metadatos (RN-UXD-044).

## 16. Casos de uso

| CU-ID | Nombre | Actor | Precondición | Flujo principal | Alternativos | Postcondición |
|---|---|---|---|---|---|---|
| CU-MAR-01 | Personalizar la marca de la cooperativa | Administrador de cooperativa | `uxd.marca.editar`; tenant activo | 1. Abre PAN-UXD-01. 2. Carga nombre, nombre corto y 3 colores (ve contraste en vivo). 3. Sube logos por canal (JOB-UXD-01 genera variantes). 4. Revisa previsualización (admin, PWA, login, splash, ícono, email, PDF). 5. Publica con nota. 6. Las apps abiertas toman la marca en ≤ PRM-UXD-012 | 2a. Contraste insuficiente: advertencia, propone color derivado; puede publicar solo si la combinación crítica (texto sobre `brand`) cumple. 3a. Recurso rechazado (formato/peso/SVG con scripts): motivo y reintento. 5a. PRM-UXD-021 activo: queda "pendiente de publicar" para otro usuario | Release nuevo de marca; evento EVT-UXD-01; auditoría |
| CU-UXD-01 | Revertir la marca a una versión anterior | Administrador de cooperativa | `uxd.marca.publicar`; ≥ 2 releases | 1. PAN-UXD-01 > Versiones. 2. Elige release N, ve diferencias. 3. Confirma con motivo. 4. Se crea release nuevo con el contenido de N | 2a. Recurso de N dado de baja: se restaura si existe en almacenamiento; si no, bloquea con detalle | Release nuevo; evento EVT-UXD-02 |
| CU-DIC-01 | Cambiar un término y que impacte en todo el sistema | Administrador de cooperativa | `uxd.diccionario.editar`, `uxd.diccionario.publicar` | 1. PAN-UXD-02, busca "Socio". 2. Edita `per.asociado`: singular "Asociado", plural "Asociados", género masculino. 3. Ve dónde se usa (pantallas, emails, PDF, menú). 4. Previsualiza en contexto. 5. Publica. 6. Admin, PWA, landing, emails nuevos, PDF nuevos, exportaciones y reportes usan "Asociados" | 2a. Valor vacío o con variables no declaradas: error en línea. 2b. Clave protegida (`fis.*`, legales): no editable, badge "Protegido". 6a. Documentos ya emitidos conservan la versión congelada (RF-UXD-161, PA-UXD-07) | Release `n+1`; EVT-UXD-04 |
| CU-DIC-02 | Revertir el diccionario | Administrador de cooperativa | `uxd.diccionario.revertir` | PAN-UXD-03 > release `k` > ver diferencias > revertir con nota | — | Release nuevo = copia de `k` |
| CU-DIC-03 | Importar textos desde Excel | Administrador de cooperativa | `uxd.diccionario.importar` | Exportar plantilla, completar, subir, previsualizar (nuevas/cambiadas/errores), confirmar como borradores | Filas con clave inexistente o protegida: se informan y no se importan | Borradores (no publica automáticamente) |
| CU-DIC-04 | Aplicar una plantilla de terminología | Administrador de cooperativa | `uxd.diccionario.editar`; PRM-UXD-023 | Elige plantilla ("Cooperativa eléctrica", "Mutual", "Usuarios en lugar de socios"), ve diferencias, aplica como borradores | Conflicto con entradas propias: elige conservar o reemplazar por clave | Borradores |
| CU-DIC-05 | Mantener el catálogo base | Administrador de plataforma | `uxd.plataforma.diccionarioBase.editar` (antes `plt.uxd.diccionarioBase.editar`) | Alta/renombre/deprecación de claves en código → JOB-UXD-05 → EVT-UXD-08 → recompilación y aviso a tenants | Renombre con personalizaciones: se mueven a la clave nueva | Catálogo nuevo; tenants sin perder textos (RF-UXD-159) |
| CU-UXD-07 (parte UX de CU-ACC-01, dueño T02; antes CU-ACC-01 (parte UX)) | Ver solo lo que corresponde | Cualquier usuario interno | Sesión válida | 1. Ingresa. 2. El sidebar y el mapa del sitio muestran solo ítems con RN-UXD-022 verdadera. 3. Una ruta directa sin permiso muestra `EmptyState` "No tenés acceso" (403) sin datos | 2a. Administrador ve "No contratado" (PRM-UXD-026) con enlace a licencia | — (la asignación de roles y perfiles es T02) |
| CU-25 (parte UX) | Pagar desde la PWA | Socio | Sesión PWA; deuda | 1. FAB Pagar. 2. Elige comprobantes (preseleccionados vencidos). 3. Elige medio. 4. Confirma. 5. Ve resultado con estado (`aprobado`, `pendiente`, `rechazado`) y comprobante | 5a. Sin conexión: no permite pagar, explica. 5b. Pendiente: aviso cuando se acredite (T09) | La lógica de cobro es M07; aquí solo flujo y estados visibles |
| CU-UXD-02 | Configurar la navegación de la PWA por rol | Administrador de cooperativa | `uxd.navegacion.configurar` | PAN-UXD-05: elige rol, ordena slots de tabbar (5 con FAB central), accesos rápidos, oculta ítems | Slot sin capability para el rol: no se permite | `pwaNavConfigs` actualizada |
| CU-UXD-03 | Instalar la PWA | Socio / empleado / técnico | Navegador compatible | 1. Banner de instalación tras primer uso útil. 2. Acepta. 3. Ícono con logo y nombre corto del tenant | 1a. iOS: instrucciones paso a paso (PAN-UXD-14). 1b. Rechaza: no se ofrece por PRM-UXD-006 días | App instalada (IND-UXD-06) |
| CU-UXD-04 | Guardar y compartir una vista de tabla | Usuario interno | Acceso a la tabla | Filtra, ordena, elige columnas, guarda vista; con `uxd.vistas.compartir` la comparte | — | `dataTableViews` |
| CU-UXD-05 | Usar el sistema solo con teclado | Usuario interno con discapacidad motriz | — | Salto a contenido, navegación del sidebar con flechas, `Ctrl+K` mapa del sitio, formularios y modales con foco atrapado y `Esc` | — | Recorrido completo sin mouse (10.5) |
| CU-UXD-06 | Operar en campo sin conexión | Técnico / lecturista | PWA campo con datos descargados | Ejecuta órdenes o lecturas offline; la cola muestra pendientes; al volver la conexión sincroniza y avisa conflictos | Conflicto: ítem marcado con el resultado por `clientMutationId` y acción de reintentar o descartar; la regla de conflicto la define el módulo dueño (M10, M03, M07) | Cola vacía |

CU-MAR-01 es de T03 (anexo dueño): rige la carga, revisión y publicación de la marca. M19 §16.1 lo cita como caso original de BASE §43 (alta de tenant con marca y landing) y solo es dueño de los pasos de landing y app del socio.

## 17. Criterios de aceptación y escenarios

### 17.1 Criterios generales

1. Ningún texto visible en admin, PWA, landing, emails, PDF, exportaciones, reportes o mensajes de error está escrito fijo en código: el linter `no-hardcoded-ui-text` y la prueba de catálogo pasan en CI (RF-UXD-141).
2. Cambiar `per.asociado` a "Asociados" en el tenant TEN-002 y publicar se refleja en sidebar, títulos, columnas, filtros, botones, validaciones, PWA, landing, email nuevo, PDF nuevo y exportación en ≤ 5 minutos, sin desplegar.
3. TEN-001 no ve el cambio de TEN-002 (aislamiento).
4. Publicar una marca cambia logo, colores, favicon, manifest y splash del tenant sin afectar a otros tenants; el ícono instalado se actualiza en la siguiente apertura del manifest.
5. Contraste AA (4,5:1 texto normal, 3:1 texto grande y componentes) en todos los temas y con cualquier marca publicada (PRM-UXD-010).
6. axe-core sin violaciones críticas ni serias en todas las pantallas del mapa del sitio; recorridos esenciales completos con teclado y lector de pantalla (NVDA y VoiceOver).
7. Cada pantalla tiene `ScreenHelp` con las 6 preguntas y su caso de uso.
8. Cada listado tiene filtros, orden, paginación, exportación con metadatos y vistas guardadas.
9. Cada ítem del mapa del sitio tiene clave de etiqueta, capability y ola; la sección 22.1 no tiene funciones ProCoop sin destino.

### 17.2 Escenarios

| ESC-ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-UXD-01 | Usuario con `uxd.marca.ver` sin `uxd.marca.editar` | Abre PAN-UXD-01 | Ve la marca en solo lectura; botones de edición ocultos; `PUT /branding/draft` devuelve 403 |
| ESC-UXD-02 | Usuario con `uxd.marca.editar` sin `uxd.marca.publicar` | Intenta publicar vía API | 403 `uxd.publish.forbidden`; borrador intacto |
| ESC-UXD-03 | PRM-UXD-021 activo | El mismo usuario que editó intenta publicar | 409 con mensaje `dict:uxd.error.dobleControl`; otro publicador puede |
| ESC-UXD-04 | Usuario de TEN-001 | Llama `GET /api/admin/uxd/dictionary/keys` con `tenantId` de TEN-002 en el cuerpo o query | Se ignora el parámetro; responde con TEN-001 (el tenant sale del token) |
| ESC-UXD-05 | Visitante anónimo | Pide `/api/public/ten-002/dictionary/{release}/admin/full.json` | 401; solo `login` y `landing` son públicos |
| ESC-UXD-06 | Subida de SVG con `<script>` | JOB-UXD-01 procesa | Recurso `rejected`, motivo "SVG con contenido activo"; no se publica |
| ESC-UXD-07 | Logo de 3 MB | Se sube | Rechazo inmediato por PRM-UXD-011 |
| ESC-UXD-08 | Color primario `#FFFF00` | Se previsualiza | Contraste insuficiente sobre blanco; se propone variante oscurecida para texto; publicar sin corregir bloqueado solo si afecta texto sobre `brand` |
| ESC-UXD-09 | Clave usada en pantalla sin entrada en catálogo | Se renderiza en producción | Se muestra el texto base del código (fallback), se registra en `dictionaryMissingKeys`; en desarrollo se resalta |
| ESC-UXD-10 | Edición con variable `{monto}` no declarada | Se guarda | Error en línea; no se guarda |
| ESC-UXD-11 | Clave `fis.comprobante.facturaA` (protegida) | Se intenta editar por API | 422 `uxd.dictionary.protectedKey` |
| ESC-UXD-12 | Release 7 vigente | Se revierte a 4 | Se crea release 8 igual a 4; historial conserva 5–7 |
| ESC-UXD-13 | Usuario sin `cob.caja.ver` (antes `cob.cajas.ver`) | Escribe `/admin/cobranza/cajas` | `EmptyState` 403 sin datos; ítem ausente del sidebar y del mapa del sitio |
| ESC-UXD-14 | Módulo no licenciado (M16) | Administrador abre el mapa del sitio | Cluster "Personal" con badge "No contratado" si PRM-UXD-026; usuario común no lo ve |
| ESC-UXD-15 | Socio en escritorio | Abre la PWA | Phone shell centrado (PRM-UXD-003); con PRM-UXD-005 para su rol ve bloqueo con QR |
| ESC-UXD-16 | Técnico sin conexión | Cierra 3 órdenes | Cola muestra 3 pendientes; badge en tabbar "Sincronización"; al reconectar sincroniza y toasts de resultado |
| ESC-UXD-17 | Recorrido teclado: alta de titular | Solo teclado | Llega al formulario, completa, guarda y vuelve al listado con foco en la fila nueva |
| ESC-UXD-18 | Recorrido teclado: cobranza en caja | Solo teclado | Busca cuenta, selecciona comprobantes, elige medio, confirma, imprime |
| ESC-UXD-19 | Recorrido lector de pantalla: pagar en PWA | VoiceOver | Cada paso se anuncia; estados `aria-live`; resultado leído |
| ESC-UXD-20 | Escala de texto 130 % | Cualquier pantalla | Sin cortes ni superposición; reflow a 320 px CSS |
| ESC-UXD-21 | `prefers-reduced-motion` | Navega PWA | Sin carruseles automáticos ni animaciones de splash |
| ESC-UXD-22 | Login con credenciales erróneas | PRM-UXD-032 `generic` | Mensaje genérico; sin revelar si existe el usuario; bloqueo progresivo de T02 |
| ESC-UXD-23 | Tenant con dominio genérico | Abre `/login` sin slug | Campo "Código de cooperativa" (PRM-UXD-030); al resolverlo aplica marca |
| ESC-UXD-24 | Soporte de plataforma con acceso temporal vencido | Pide `/api/admin/uxd/branding` | 403; auditoría del intento |
| ESC-UXD-25 | Exportación de listado | Se exporta | Nombre `{shortName}-{pantalla}-{fecha}`, encabezados con términos del tenant, hoja de metadatos con versión del diccionario |

## 18. Datos de precarga para demostración

Sin datos personales reales (Guía §15). Recursos de marca demo generados (no logos reales de cooperativas).

| Elemento | TEN-001 "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Eléctrica Demo Sur") | TEN-002 "Cooperativa Ejemplo B" (antes "Cooperativa de Servicios Demo Norte") |
|---|---|---|
| `brandName` / `shortName` | Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) | Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte) |
| Colores | `primary #145DA0`, `secondary #2E8B57`, `accent` derivado | `primary #7A51CA` (marca CoopApps), `secondary #0E7C86`, `accent #E2B552` |
| Recursos | Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing | Kit demo con isotipo distinto para probar aislamiento |
| Política de tema | `dark` | `user` |
| Diccionario | Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") | Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal `pwa-socio`: `cob.pagar` → "Pagar mi factura" (BASE §65.5, §65.6) |
| Releases | Marca 1; diccionario 0 | Marca 3 (incluye una reversión); diccionario 4 (incluye una reversión) |
| Faltantes | 0 | 2 claves simuladas para IND-UXD-01 |
| Ayudas | Base | 3 overrides (PAN-UXD-02, SM-ADM-062, SM-PWS-009) |
| Flags | Default | `pwa.asistente` apagado, `uxd.pwa.wideViewAllowed` encendido |
| Navegación PWA | Default maestro | Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración |
| Preferencias | 2 usuarios demo con tema claro y densidad compacta | 1 usuario con escala 130 % y movimiento reducido |
| Vistas de tabla | 2 privadas, 1 compartida en Titulares | 1 compartida en Comprobantes |

Usuarios demo por tenant: administrador de cooperativa, responsable de comunicación (sin publicar), cajero, técnico de campo, lecturista, socio y soporte de plataforma con acceso temporal (para los escenarios 17.2).

## 19. Migración desde ProCoop

La migración de experiencia es de **configuración**, no de datos operativos; corre en T07 MIG (paso "Experiencia") y es repetible (O11), con una carga inicial manual asistida en O1 para las cooperativas piloto.

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `VAR_PMOVIL` 5 (texto del botón agregar cuentas, CoopOnline) | `tenantDictionaryEntries` `por.cuenta.vincular.boton`, canal `pwa-socio` | Texto literal; si está vacío, no se crea entrada (queda base) | Cantidad de variables con valor = entradas creadas |
| `VAR_PMOVIL` 6 (título de la vista agregar cuenta) | `por.cuenta.vincular.titulo`, `pwa-socio` | Ídem | Ídem |
| `VAR_PMOVIL` 7 (texto del input código socio) | `por.cuenta.vincular.codigoSocio`, `pwa-socio` | Ídem; si menciona "socio" se sugiere usar el término `per.asociado` | Ídem |
| `VAR_PMOVIL` 8 (texto del input clave/suministro) | `por.cuenta.vincular.clave`, `pwa-socio` | Ídem | Ídem |
| `VAR_PMOVIL` 9 (observación en agregar cuenta) | `por.cuenta.vincular.ayuda`, `pwa-socio` | Ídem | Ídem |
| `VAR_PMOVIL` 14 (texto de vista previa de facturas seleccionadas) | `cob.pagar.vistaPrevia.ayuda`, `pwa-socio` | Ídem | Ídem |
| `VAR_PMOVIL` 34 (link de referencia en el login web) | PRM-UXD-031 = `true` + `login.enlaceAyuda.url` (parámetro) + `login.enlaceAyuda.texto` (diccionario) | Si la URL es válida (https) se habilita; si es http se registra advertencia y queda deshabilitado | Lista de tenants con enlace migrado |
| `VAR_PMOVIL` 35 (observación en facturas) | `fac.comprobante.observacionPortal`, canal `documentos` y `pwa-socio` | Texto literal | Ídem |
| `VAR_PMOVIL` 40 (habilitar CiDi en la web) | Botón SSO CiDi del login (T02 configura el proveedor; UXD muestra el botón) | Booleano → método de login habilitado | Coincidencia de métodos de login |
| `VAR_PMOVIL` 65 (texto de cabecera de la página) | Bloque editable de cabecera del portal (M19) con `por.cabecera.texto` como fallback (RN-UXD-065) | Texto largo; HTML se sanea a texto con saltos | Revisión visual en previsualización |
| `VAR_PMOVIL` 41 (perfil para empleados no usuarios del sistema, PWeb) | Rol por defecto de la PWA empleado (T02); UXD solo resuelve el espacio "Mi trabajo" | Código de perfil → rol equivalente según 22.1 | Ver T02 |
| `VAR` 3157 (permitir modificar el nombre del formulario de incidentes) | `tenantDictionaryEntries` `crm.incidente` (singular/plural/género) | El nombre personalizado del formulario pasa a término; se infiere género por terminación y se pide confirmación | El término aparece en PAN-UXD-02 como personalizado |
| `VAR` 518 (razón social) | `cfg.organization.legalName` (T04) leído por UXD para pie de documentos y `brandName` inicial | Copia; `brandName` editable después | Igual a T04 |
| `VAR` 709 (razón social para email) | `tenantBrandings.senderName.email` | Copia | — |
| `VAR` 2812 (razón social corta, SMS) | `tenantBrandings.senderName.sms` y propuesta de `shortName` (≤ 12) | Si supera 12 caracteres se trunca la propuesta y se marca para revisión | — |
| `VAR` 2264 (sigla del nombre del cliente) | Propuesta de `shortName` si 2812 está vacío; prefijo del nombre de exportaciones (RN-UXD-044) | Copia | — |
| `WEB_Logos_Facturas` (logos de la web y de facturas) | `brandAssets` `kind = documentLogo` (y `logoHorizontalLight` si no hay otro) | Imagen → JOB-UXD-01 (variantes, saneado) | Cantidad de logos migrados; revisión visual en PDF de prueba |
| Logo de empresa referido por variables 518–527/709 (`Nucleo.Empresa.CrearEmpresa`) | `brandAssets` `documentLogo` | Ídem | — |
| `VAR` 2027, 2028, 2029, 2090, 2251 (mapa) | PRM-UXD-041, 042, 043, 040 y PRM-UXD-044 (clave en bóveda T06) | `Bing` → `osm` con aviso (Bing descartado); coordenadas `lat; lng` → objeto | Mapa demo centrado igual que ProCoop |
| `VAR` 2242 (clave Bing) | — | **Descartado**: proveedor sin soporte; no se migra la clave | Registrado en informe de migración |
| `VAR` 2294 (tipo de exportación Excel) | PRM-UXD-015 | `Excel DevExpress`/`Excel Método anterior` → `xlsx`; `CSV` → `csv` | — |
| `VAR` 2683 (botón chat con soporte) | PRM-UXD-033 | Booleano | — |
| `VAR` 2280 (minutos de inactividad para bloqueo de sesión) | Parámetro de sesión de T02; UXD solo presenta la pantalla de bloqueo | Copia a T02 | Ver T02 |
| `MENUSYS` (opciones de menú) | No se migra como menú: se mapea opción → `SM-ADM-*` con la tabla 22.1 para traducir perfiles | Tabla de equivalencias versionada en T07 | Toda opción con perfil asignado tiene destino o motivo |
| `PERFILES` / `MENUVAL` (permisos por opción) | Roles y perfiles de pantallas de T02, usando la equivalencia `MENUSYS → SM-ADM → capability` | Un perfil ProCoop → un rol + un perfil de pantallas propuestos (revisión humana) | Usuario migrado ve los mismos ítems que veía en ProCoop salvo los Reemplazados/Descartados (informe por usuario) |
| `FORMULARIOS_PERSONALIZACIONES` (personalización de grillas y formularios, DFA M28) | `dataTableViews` compartidas (columnas visibles, orden) cuando la grilla tiene equivalente; renombres de campos → `tenantDictionaryEntries` | Solo personalizaciones de visibilidad, orden y rótulo; las de comportamiento se descartan con motivo | Informe de personalizaciones migradas / descartadas |
| `USUARIOS` (preferencias de apariencia, si existen) | `userUiPreferences` | Solo tema/densidad si hay dato; si no, default | — |

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-UXD-01 | CNX §4.1 (tema oscuro por defecto) vs. BASE §43 (marca del tenant) | ¿El color de marca del tenant reemplaza `--brand` del admin? | El admin mantiene su paleta de producto; la marca del tenant se aplica a logo de topbar, acentos (`--tenant-primary`) y a toda la PWA/landing. `--brand` del admin no se sobrescribe | Guía §8 (patrón CNX obligatorio) + BASE §43 aplicada donde no contradice |
| CTR-UXD-02 | CNX §3.1 (Sora única en PWA) vs. CNX §4.1/guía §8 (Plex Mono para importes) | Tipografía de importes en la PWA | PWA: Sora con `tabular-nums`; admin: IBM Plex Mono | Cada fuente rige su canal; guía §8 para admin |
| CTR-UXD-03 | BASE §77 (Google Maps) vs. CNX §2.1 (Leaflet) | Librería y proveedor de mapas | Componente `MapView` sobre Leaflet con proveedor de teselas configurable (Google por defecto, OSM alternativo) | BASE prevalece sobre CNX en proveedor; CNX en componente; PA-UXD-09 |
| CTR-UXD-04 | RN-09 (una base por cooperativa; identidad en VAR) vs. **DEC-110** (multitenant por `TenantId`) | Dónde vive la identidad | `uxd.TenantBrandings` por `TenantId` en base compartida | DEC prevalece |
| CTR-UXD-05 | CNX §3.5 (alta siempre en modal) vs. REL §2 (fichas complejas con pestañas) | Alta de entidades complejas | Alta mínima en modal; ficha completa como página con pestañas | Guía §8 + REL como evidencia funcional |
| CTR-UXD-06 | CNX (auth JWT + refresh) vs. propuestas de OpenIddict en DFA | Mecanismo de sesión que ve la UX | Sin efecto en UXD: el login usa lo que define T02; UXD solo define pantallas y mensajes | T02 es dueño |
| CTR-UXD-07 | ProCoop (menú construido en runtime desde `MENUSYS`) vs. CNX (`siteMapGroups` declarativo) | Fuente del menú | Declarativo en código; el tenant solo oculta/ordena (PWA) y fija accesos | Guía §8 |
| CTR-UXD-08 | BASE §65.4 (singular/plural) vs. necesidad de concordancia en español | Género gramatical | Se agrega `gender` al término y `{g:}` en mensajes | BASE extendida sin contradecirla |
| CTR-UXD-09 | CNX (tres pickers de color) vs. BASE §43 MAR-002 (color primario) | Cantidad de colores configurables | Tres: primario, secundario, acento; derivados automáticos | BASE es mínimo; CNX amplía |
| CTR-UXD-10 | CNX §3.7 (cola offline en `localStorage` en el prototipo) vs. guía §8 (IndexedDB + `clientMutationId`) | Almacenamiento de cola | IndexedDB, única por usuario y app | Guía prevalece sobre CNX |
| CTR-UXD-11 | ProCoop (fechas `dd/mm/yyyy`) vs. RN-UXD-044 nombres de archivo | Separador de fecha | En pantalla `dd/mm/aaaa`; en nombres de archivo `dd-mm-yyyy` (la barra no es válida en archivos) | Restricción técnica |
| CTR-UXD-12 | Maestro §9.2 (tabbar socio: Inicio, Cuentas y servicios, Pagar, Gestiones, Comunidad, Perfil) vs. CNX §3.3 (tabbar genérica de 5 slots con FAB) | Seis destinos en cinco slots | Cinco slots con FAB central = Pagar; Perfil en la topbar (avatar); rótulo corto "Cuentas" para el destino "Cuentas y servicios" (RN-UXD-006, PA-UXD-18 y PA-UXD-19; SM-PWS-002 y `dict:nav.pws.servicios`) | Maestro prevalece en contenido; CNX en patrón |
| CTR-UXD-13 | Guía §8 (una sola PWA) vs. BASE §43.5 (logos distintos para empleados y socios) | ¿Apps separadas? | Una PWA con tres manifests (`id` distinto por app) y slots de logo por canal | Guía prevalece; PA-UXD-03 |
| CTR-UXD-14 | REL §1 (alerta modal al iniciar sesión) vs. CNX §6.3 (centro de avisos no intrusivo) | Alertas de inicio | Alertas críticas como banner persistente + contador en SM-ADM-003; nunca modal bloqueante | CNX + AGR-032 (accesibilidad) |
| CTR-UXD-15 | BASE §65.3 (traducción no pedida) vs. modelo con `locale` | Multi-idioma | Un idioma, modelo preparado | BASE; PA-UXD-06 |
| CTR-UXD-16 | ProCoop "Copia de Seguridad" y "Base de Datos" en menú del cliente vs. DEC SaaS | Funciones de infraestructura en el tenant | Respaldo como solicitud de exportación del tenant (SM-ADM-253) y operación de plataforma (SM-PLT-013); Base de Datos descartada | DEC prevalece |
| CTR-UXD-17 | 10.8 de este anexo vs. tablas de pantallas de M01–M19 y T01–T11 | Rutas y capabilities de "ver" distintas para la misma pantalla (por ejemplo SM-ADM-060 `cob.cuentaCorriente.ver` vs. COB-01 `cob.cuentas.ver`; SM-ADM-205 `por.usuarios.ver` vs. IAM-25 `iam.portal.usuarios.ver`) | Ruta y capability se toman del anexo dueño del dominio (10.9.2 a 10.9.8); 10.8 conserva cluster, grupo, texto, ola y trazabilidad ProCoop; las claves `nav.item.*` de 10.8 no cambian (AL-01) | El dueño del dominio prevalece sobre el anexo transversal en lo propio de su dominio (guía §5, límites de módulo) |
| CTR-UXD-18 | M03, M07, M09, M11–M18 y T11 (rutas sin `/admin`) vs. maestro §8 (admin servido en `/admin/`) | Un mismo shell con bases de ruta mezcladas | Todas las rutas del admin cuelgan de `/admin/`; las rutas de los anexos sin ese prefijo se normalizan anteponiéndolo (AL-02) | Maestro §8 prevalece en la estructura de apps |
| CTR-UXD-19 | T01 (`/admin/plataforma/`) vs. M02, M06, M16, T02, T04, T07, T09 (`/platform/`), T10 (`/admin/platform/`) y 10.8.6 (`/plataforma/`) | Cuatro bases para la consola de plataforma | Base única `/admin/plataforma/` con `meta.platformOnly`; las demás se normalizan y quedan como redirecciones (AL-03) | T01 dueño de la consola de plataforma |
| CTR-UXD-20 | M19 (`/app/…`) vs. M01, M02, M03, M05, M07, M13, M16, T09, T10, T11 (rutas PWA sin `/app` o con otro camino) y 10.8.2–10.8.3 (`/inicio`, `/trabajo/…`) | Rutas distintas para la misma pantalla de la PWA (por ejemplo `/facturas` FAC-43 vs. `/app/facturas` POR-38; `/empleado/recibos` SUE-41 vs. `/app/empleado/recibos` POR-70) | Ruta de M19 cuando describe la pantalla; si no, ruta del dominio con prefijo `/app`; capability del dominio. `start_url` de RN-UXD-037 pasa a `/app/inicio`, `/app/empleado` y `/app/campo/today`; las rutas de 10.8 quedan como alias (AL-04) | M19 dueño del shell PWA; dominio dueño del permiso |
| CTR-UXD-21 | M10 (`/field/*`), M03 y M13 (`/campo/*`), M07 (`/cobrador`), M05 (`/reparto`), M11 y T11 (`/ot/:id/*`), M18 (`/app/campo/viajes`) vs. M19 POR-77 (`/app/campo`) | La PWA de campo con seis bases de ruta | Base única `/app/campo/` con el subcamino del anexo dueño; `/ot/:id/x` → `/app/campo/work-orders/:id/x` (AL-05) | M19 dueño del shell; M10 dueño de la OT |
| CTR-UXD-22 | M02, M05, M17, T08, T09 (`/<tenantSlug>/…`), M09 (`/t/:tenantSlug/…`), M11 y M12 (`/p/:tenantSlug/…`) vs. M19 y 10.8.5 (rutas relativas al subdominio) | Prefijo del tenant en la ruta pública | Ruta relativa al subdominio; el prefijo solo existe en el dominio genérico y lo resuelve el router (AL-06) | RF-UXD-112 (resolución por subdominio) |
| CTR-UXD-23 | Pantallas duplicadas entre anexos: STK-37 vs. TEC-52 (mi stock); TEC-53 vs. MED-30 (cola de sincronización); SUE-41 a SUE-43 vs. POR-70 a POR-74 (portal del empleado); BIA-15 vs. IAM-24 (clientes API); CFG-18 vs. TES-30 (monedas); CFG-17 vs. MOR-04 y CON-29 (índices); FIS-37 vs. FAC-38 (administración pública); FIS-08 vs. FAC-24 (puntos de venta); NFR-04 vs. COM-24 (consentimientos); NFR-12/NFR-15 vs. PLA-13/PLA-12 (incidentes y alertas de plataforma, misma ruta); PER-25 vs. NFR-09 (`/app/mis-datos`); POR-27 vs. PER-26 vs. IAM-32 (vincular cuenta); POR-46 vs. MOR-40 (`/app/convenios`); COM-37 vs. COM-49 vs. POR-17 (`/e/:token`); POR-78 vs. CRM-26 (tótem) | Dos o más PAN para una misma necesidad | Una pantalla por necesidad; principal = dueño del dato y las demás quedan como pestaña, sección o acción: STK-37, TEC-53 (cola única RN-UXD-050), SUE-41 a SUE-46 como principales con dueño M16 (contenido y capability), incrustadas por M19 con su ruta `/app/empleado/…` (PA-SUE-16 de M16; antes "PA 17 asumida"; antes "SUE-41 a SUE-43 con rutas M19"), BIA-15 (IAM-24 como pestaña "Seguridad"), CFG-18 maestro y TES-30 cotizaciones operativas, CFG-17 maestro con MOR-04 y CON-29 como vistas filtradas, FIS-37 con FAC-38 como lista de comprobantes, FIS-08 con FAC-24 como pestaña "Numeradores", NFR-04 registro legal y COM-24 preferencias de canal, NFR-12 y NFR-15, PER-25 con sección de privacidad de NFR-09, POR-27 (PER-26 e IAM-32 como lógica), POR-46 con acción MOR-40, COM-49 (POR-17 como alias; antes "COM-37 (las otras como alias)": T09 no define COM-37 y numera la pantalla por enlace como COM-49, AL-11), POR-78 con módulo CRM-26 | El dueño del dato prevalece; en la PWA, M19 para la ruta |
| CTR-UXD-24 | T09 (`com.wall.ver`, `com.inbox.ver`, `com.surveys.responder`, `com.preferences.editar`) vs. M19 y 10.8.2 (`com.muro.ver`, `por.portal.ver` para avisos, `com.encuestas.responder`, `por.preferencias.editar`) | Capabilities con nombres distintos para muro, avisos, encuestas y preferencias | Se usan las de T09; las de M19 y 10.8 quedan registradas como alias en el catálogo de capabilities de T02 para la migración de perfiles | T09 dueño de comunicaciones |
| CTR-UXD-25 | T04b VAR 709 y 2812 (destino T09 `com.email.nombreRemitente`, `com.sms.nombreRemitente`) vs. 7.B.1 (`emailSenderName`, `smsSenderName`) vs. sección 19 (`tenantBrandings.senderName.email/sms`) | Tres ubicaciones para el nombre visible del remitente | Dato único en `tenantBrandings.emailSenderName` y `smsSenderName` (7.B.1), editable en PAN-UXD-01; T09 (COM-22) lo lee como valor por defecto y puede sobrescribirlo por identidad de canal verificada; las claves de T04b y la ruta de la sección 19 son alias de lectura | T03 dueño de la identidad visible; T09 dueño de la identidad técnica del canal |
| CTR-UXD-26 | M19 POR-19 (`/ingresar`, `/recuperar`) vs. T02 IAM-01/IAM-02 (`/login`) e IAM-05 (`/forgot-password`) vs. 10.8.5 (`/login`) | Rutas del login | En la landing, `/ingresar` y `/recuperar` (M19); en admin y PWA, `/login` y `/forgot-password` (T02). Cada una redirige a la otra según el host; el formulario es uno solo (T02) | M19 dueño de las rutas públicas; T02 dueño del formulario |
| CTR-UXD-27 | T04b VAR 2264 (destino T01 `pla.tenant.sigla`, máx. 10, mayúsculas) vs. 7.B.1 `shortName` (≤ 12, "reemplaza VAR 2264") | Sigla del tenant | Dos datos distintos: `pla.tenant.sigla` (identificador corto de integración, T01) y `shortName` (presentación: manifest, pestaña, exportaciones). En el alta, `shortName` se propone igual a la sigla y es editable. La nota "Reemplaza VAR 2264" de 7.B.1 se lee como "se propone desde VAR 2264" | T01 dueño del dato de alta; T03 de la presentación |
| CTR-UXD-28 | T04b VAR_PMOVIL 34 (destino M19 `por.login.linkReferenciaUrl`) vs. RF-UXD-119 (`dict:login.enlaceAyuda.*`) vs. sección 19 (`login.enlaceAyuda.url` como parámetro) | Dónde vive la URL del enlace de referencia del login | URL = parámetro de M19 `por.login.linkReferenciaUrl` (https); texto = `dict:login.enlaceAyuda.texto` (10.7); PRM-UXD-031 solo muestra u oculta el enlace, que no se muestra si la URL está vacía | Una URL es parámetro, no texto (guía §5) |
| CTR-UXD-29 | Claves de diccionario para las mismas variables en tres lugares: 10.7.6 (`por.agregarCuenta.*`, `por.facturas.observacion`, `crm.incidente`), sección 19 (`por.cuenta.vincular.*`, `fac.comprobante.observacionPortal`, `cob.pagar.vistaPrevia.ayuda`) y T04b (`por.vincularCuenta.*`, `por.comprobantes.leyendaListado`, `crm.incidentes.tituloPantalla`, `por.pagos.leyendaVistaPrevia`) | Nombres de clave divergentes | Son canónicas las de 10.7 y 10.9.10; las de la sección 19 y T04b se registran como `renamedTo` en `dictionaryKeys` y JOB-UXD-05 las resuelve; la migración (T07) escribe siempre en la clave canónica | T03 dueño del catálogo de claves |
| CTR-UXD-30 | T04b VAR 2368 (Marca `branding.documentFont`) vs. RN-UXD-020 y PA-UXD-08 (tipografías fijas del producto) | Tipografía de los PDF | La UI mantiene tipografías fijas. Para documentos se agrega `tenantBrandings.documentFont`: lista cerrada de tipografías autoalojadas con licencia libre, por defecto la del producto. Queda sujeto a PA-UXD-17 | DEC-007 (alcance de lo que ProCoop hace) dentro del límite de RN-UXD-020 |
| CTR-UXD-31 | T04b VAR 180, 382, 406 y 370 (Marca `uxd.template.workOrder`, `purchaseVatBook`, `withholdingCertificate`, `chequePrint`) vs. T11 WFL-17 (`documentTemplates`) | Quién elige el diseño de impresión | La plantilla y su selección por propósito son de T11 (WFL-17, SM-ADM-242); T03 aporta logo `documentLogo`, colores y `documentFont`. Las claves `uxd.template.*` de T04b se reemplazan por la plantilla por defecto de cada propósito en T11 | T11 dueño de plantillas documentales |

## 21. Preguntas abiertas

### PA-UXD-01 — Tema de la PWA y de la landing para socios
- **Pregunta:** ¿La PWA de socios y la landing usan la piel oscura `.pwa-mod` o un tema claro por defecto?
- **Contexto:** CNX §3.1 define la piel oscura; el público de socios es amplio (adultos mayores, pantallas al sol) y la landing es pública.
- **Opciones:**
  - A) Landing clara por defecto; PWA socio según política del tenant (`dark` por defecto, con opción del usuario) **(Recomendada)** — coherencia de producto y legibilidad en lo público.
  - B) Todo oscuro — máxima coherencia visual, menor legibilidad al aire libre.
  - C) Todo claro — más convencional; se pierde la identidad de la piel.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-077, PRM-UXD-001/002, O2.

### PA-UXD-02 — Dominio propio de la cooperativa
- **Pregunta:** ¿Se permite que el tenant use su propio dominio (ej. `app.coopsur.com.ar`) además del subdominio del producto?
- **Contexto:** RF-UXD-112 resuelve por subdominio; el dominio propio requiere certificados y validación DNS (T08).
- **Opciones:**
  - A) Subdominio en O1; dominio propio en O2 como opción con verificación DNS y certificado automático **(Recomendada)** — no frena el arranque.
  - B) Solo subdominio — más simple; menos identidad propia.
  - C) Dominio propio desde O1 — más trabajo de infraestructura temprano.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-112, API-POR-01 (antes API-UXD-01), API-UXD-02, T08.

### PA-UXD-03 — Apps instalables y tiendas
- **Pregunta:** ¿Se ofrecen tres apps instalables (socio, equipo, campo) desde la misma PWA, y se publican en tiendas?
- **Contexto:** RN-UXD-038; guía §8 exige una sola PWA; las tiendas requieren cuentas de desarrollador por cooperativa o por producto.
- **Opciones:**
  - A) Tres manifests instalables desde la web; sin tiendas en esta versión **(Recomendada)** — sin costos de tiendas, actualización inmediata.
  - B) Una sola app instalable con cambio de espacio — menos íconos; mezcla audiencias.
  - C) Tres manifests y publicación en tiendas (TWA) — mayor alcance; gestión de cuentas y revisiones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-038, RF-UXD de manifest, O2.

### PA-UXD-04 — Plantillas, importación y control de publicación del diccionario
- **Pregunta:** ¿Se habilitan plantillas e importación XLSX del diccionario, y la publicación exige doble control?
- **Contexto:** BASE §65.9 deja abiertas las opciones; una mala publicación afecta a todo el tenant (aunque es reversible).
- **Opciones:**
  - A) Plantillas e importación habilitadas; doble control opcional por tenant (apagado por defecto) **(Recomendada)** — agilidad con reversión inmediata.
  - B) Plantillas e importación; doble control obligatorio — más seguro, más lento.
  - C) Sin importación (solo edición en pantalla) — menos riesgo, más trabajo inicial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-165, PRM-UXD-021/023, API-UXD-23/24.

### PA-UXD-05 — Variantes por canal
- **Pregunta:** ¿Un mismo texto puede tener valores distintos por canal (admin, PWA, documentos, email, SMS)?
- **Contexto:** BASE §65.4 lo menciona y §65.9 lo deja pendiente; agrega complejidad a la edición.
- **Opciones:**
  - A) Sí, opcional, con el valor general como fallback **(Recomendada)** — cubre SMS cortos y lenguaje cercano en PWA.
  - B) No, un valor por clave — más simple; textos largos en SMS.
  - C) Solo para SMS y push — intermedio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-148, PRM-UXD-022.

### PA-UXD-06 — Multi-idioma
- **Pregunta:** ¿Se requiere traducción a otros idiomas?
- **Contexto:** BASE §65.3 no lo pide; el modelo guarda `locale`.
- **Opciones:**
  - A) Solo `es-AR`, modelo preparado **(Recomendada)** — sin costo hoy.
  - B) `es-AR` + `en` desde O1 — duplica la carga de textos.
  - C) Multi-idioma completo por tenant — fuera de alcance del mercado objetivo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-168.

### PA-UXD-07 — Congelamiento de textos en documentos
- **Pregunta:** ¿Los documentos ya emitidos conservan los términos vigentes al emitirse o se re-renderizan con el diccionario actual?
- **Contexto:** RF-UXD-161; facturas y constancias tienen valor legal; reimprimir con otro término puede generar confusión.
- **Opciones:**
  - A) Congelar la versión del diccionario en el documento (la reimpresión es idéntica) **(Recomendada)** — integridad documental.
  - B) Re-renderizar siempre — coherencia con el término actual; riesgo legal.
  - C) Congelar solo comprobantes fiscales; resto re-renderiza — mixto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-161, M05, T09, O4.

### PA-UXD-08 — Tipografías personalizables por tenant
- **Pregunta:** ¿El tenant puede elegir tipografías propias?
- **Contexto:** RF-UXD-004; fuentes autoalojadas por rendimiento y privacidad; licencias de fuentes de terceros.
- **Opciones:**
  - A) No: tipografías del producto, autoalojadas **(Recomendada)** — rendimiento, accesibilidad y licencias controladas.
  - B) Elegir entre 3–4 fuentes curadas — algo de identidad, más pruebas.
  - C) Subir fuente propia — riesgo de licencias y legibilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-004, 7.A.

### PA-UXD-09 — Proveedor de mapas
- **Pregunta:** ¿Qué proveedor de mapas se usa por defecto y quién paga la clave?
- **Contexto:** BASE §77 nombra Google; CNX usa Leaflet; Google tiene costo por uso; RN-09 tiene Google y Bing.
- **Opciones:**
  - A) Google por defecto con clave del tenant en bóveda; OSM como alternativa sin costo **(Recomendada)** — continuidad con ProCoop y opción gratuita.
  - B) OSM por defecto; Google opcional — sin costo; menor calidad de geocodificación en localidades chicas.
  - C) Google con clave del producto — costo para GoodApps, menos fricción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-057, PRM-UXD-040…044, CTR-UXD-03.

### PA-UXD-10 — Logos por sucursal
- **Pregunta:** ¿Las sucursales pueden tener logo propio?
- **Contexto:** RF-UXD-028; cooperativas con sucursales en otras localidades o con marcas comerciales distintas.
- **Opciones:**
  - A) Sí, opcional (PRM-UXD-024 apagado por defecto), con herencia del tenant **(Recomendada)** — cubre casos sin complejidad para el resto.
  - B) No — un logo por tenant.
  - C) Marca completa por sucursal (colores incluidos) — mayor complejidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-028.

### PA-UXD-11 — PWA en escritorio
- **Pregunta:** ¿La PWA en escritorio se muestra siempre en phone shell o se permite una vista amplia?
- **Contexto:** RF-UXD-069; socios que usan PC; CNX §3.3 define phone shell.
- **Opciones:**
  - A) Phone shell por defecto; vista amplia opcional por tenant (PRM-UXD-004) en O2 **(Recomendada)** — un solo diseño garantizado y flexibilidad.
  - B) Siempre phone shell — más simple.
  - C) Diseño responsive completo para escritorio — duplica diseño y pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-069, PRM-UXD-003/004.

### PA-UXD-12 — Mostrar módulos "No contratado"
- **Pregunta:** ¿El administrador del tenant ve los módulos no licenciados en el mapa del sitio?
- **Contexto:** RF-UXD-173; oportunidad comercial vs. ruido.
- **Opciones:**
  - A) Solo el administrador, con badge y enlace a licencia; configurable (PRM-UXD-026) **(Recomendada)** — descubrimiento sin molestar a operadores.
  - B) Nadie — interfaz limpia, sin descubrimiento.
  - C) Todos los usuarios — ruido y frustración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-173, API-UXD-20.

### PA-UXD-13 — Admin en pantallas chicas
- **Pregunta:** ¿Hasta qué ancho se soporta el admin?
- **Contexto:** RF-UXD-058; tablas densas; la PWA empleado cubre lo móvil.
- **Opciones:**
  - A) Objetivo 1024 px; 768–1023 px soportado con menú colapsado; < 768 px aviso de usar la PWA **(Recomendada)** — esfuerzo acotado.
  - B) Totalmente responsive hasta 360 px — gran esfuerzo en tablas.
  - C) Solo ≥ 1280 px — excluye tablets y notebooks chicas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-058, PRM-UXD-025.

### PA-UXD-14 — Mensaje de error de login
- **Pregunta:** ¿El login distingue "usuario inexistente" de "contraseña incorrecta"?
- **Contexto:** CNX §3.6 pide errores específicos; la anti-enumeración (T02) pide mensajes genéricos.
- **Opciones:**
  - A) Mensaje genérico siempre, con ayuda de formato y enlace a recuperar **(Recomendada)** — seguridad sin perder guía.
  - B) Específico configurable por tenant (PRM-UXD-032) — más claro, riesgo de enumeración.
  - C) Específico solo en red interna — complejo de operar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-117, PRM-UXD-032, T02.

### PA-UXD-15 — Bloqueo de escritorio para roles de campo
- **Pregunta:** ¿El tenant puede impedir que roles de campo usen la PWA en escritorio?
- **Contexto:** RN-UXD-027; CNX §3.3 lo prevé; evita registrar lecturas o cobranzas desde la oficina como si fueran de campo.
- **Opciones:**
  - A) Sí, configurable por rol (PRM-UXD-005), vacío por defecto **(Recomendada)** — control para quien lo necesite.
  - B) Bloqueo fijo para roles de campo — rígido.
  - C) Sin bloqueo — se pierde control; la validación de GPS lo compensa parcialmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-027, PRM-UXD-005.

### PA-UXD-16 — Asistente IA en la PWA
- **Pregunta:** ¿Se incluye un asistente IA en la topbar de la PWA (socio y empleado)?
- **Contexto:** CNX §3.3 lo muestra; costo por uso; IA solo propone (CNX §4.2); M09 define el bot.
- **Opciones:**
  - A) Detrás de flag `pwa.asistente`, apagado por defecto, habilitable en O11 **(Recomendada)** — sin costo ni riesgo hasta validar.
  - B) Habilitado desde O2 para socios — atención 24 h; costo y riesgo de respuestas.
  - C) No incluir — se pierde diferencial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** SM-PWS-041, SM-PWE-017, PRM-UXD-034.

### PA-UXD-17 — Tipografía de los documentos PDF
- **Pregunta:** ¿La cooperativa puede elegir la tipografía de sus comprobantes y documentos PDF?
- **Contexto:** ProCoop permite elegir la fuente de los PDF (T04b VAR 2368). PA-UXD-08 recomienda no personalizar las tipografías de la interfaz. CTR-UXD-30 separa la interfaz de los documentos.
- **Opciones:**
  - A) Sí, solo para documentos, desde una lista cerrada de 3 tipografías autoalojadas con licencia libre (por defecto la del producto) **(Recomendada)** — conserva lo que ProCoop permite sin afectar la interfaz ni las licencias.
  - B) No: los documentos usan siempre la tipografía del producto — más simple; se pierde una opción que algunas cooperativas usan.
  - C) Carga libre de tipografías por el tenant — máxima libertad; riesgo de licencias, peso y legibilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** CTR-UXD-30, campo `tenantBrandings.documentFont` (22.4).

### PA-UXD-18 — Cierre de residuales del anexo (mapa del sitio, tabbar, estados, API y CU)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables (mapa de navegación, catálogo de pantallas, contratos y estados)?
- **Contexto:** el mapa citaba pantallas de otra app o recurso y citas anteriores a PAN inexistentes de T09 (PAN-COM-35 a 39); 7 capabilities y 4 rutas diferían del anexo dueño; el rótulo "Cuentas y servicios" supera los 12 caracteres de RN-UXD-006; SM-PWE-013, 016 y 018 son slots de la tabbar del empleado; 7 filas de §11 citaban "Público" o "Autenticado"; `brandAssets` y `tenantDictionaryEntries` no declaraban el estado de alta; el ID CU-ACC-01 es de T02; PAN-UXD-15, 16 y 17 no tenían RF ni ola.
- **Opciones:**
  - A) Dejar en las columnas de PAN solo pantallas de la misma app y recurso y registrar las demás en 10.9.13 con el texto anterior; tomar la capability y la ruta del anexo dueño (AL-01); rótulo corto "Cuentas"; grupo Tabbar para SM-PWE-013, 016 y 018; `public: true` o `iam.sesion.autenticada` (T02 PA-IAM-18) en §11; tabla 8.8 con los estados de alta; tablas de campos en 7.B.13; renumerar el CU propio a CU-UXD-07; asignar a PAN-UXD-15, 16 y 17 los RF existentes RF-UXD-064, 063 y 055 (ola O0, PRO-O0-15), sin crear RF nuevos. **(Recomendada)**.
  - B) Mantener las citas y documentar las diferencias en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** mapa de navegación, catálogo de pantallas y contratos OpenAPI de T03.
- **Estado:** Asumida (DEC-072): opción A.

### PA-UXD-19 - Sincronización posterior a la ronda de residuales (mapa del portal y rótulo corto)

- **Pregunta:** ¿cómo queda la correspondencia de PAN-POR-19, 52, 55 y 91 con los ítems del mapa y el rótulo corto "Cuentas" de la tabbar del socio después de la ronda de residuales de M19 (PA-POR-22)?
- **Contexto:** `_trabajo/residuales-sincronizacion.md` (sección M12-M19) y el catálogo de pantallas de M19 (`17-19-M19-POR.md`), que marcaba PAN-POR-19 como principal de SM-LND-008, PAN-POR-52 de SM-LND-014, PAN-POR-55 de SM-PWS-027 y PAN-POR-91 de SM-LND-011 con app o ruta distinta. Verificado contra M19 §10: PAN-POR-19 declara `/ingresar`, `/recuperar` y `/restablecer/:token` (landing); PAN-POR-52 `/app/turnos`; PAN-POR-55 `/app/muro(/:id)`; PAN-POR-91 `/admin/portal/recepcion-publica` (admin).
- **Opciones:**
  - A) PAN-POR-19 principal de SM-LND-007 y de SM-LND-008 (misma app y recurso); PAN-POR-52 principal de SM-PWS-022 y cita de otra app en SM-LND-014; PAN-POR-55 principal de SM-PWS-027 con la ruta del anexo; PAN-POR-91 principal de SM-ADM-209 y cita de otra app en SM-LND-011; rótulo corto "Cuentas" también en CTR-UXD-12. **(Recomendada)**.
  - B) Dejar SM-LND-008 sin pantalla propia y citar PAN-POR-19 como pantalla relacionada.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** mapa de navegación (10.9.4, 10.9.7, 10.9.13) y catálogo de pantallas de M19.
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026: 10.9.7 (SM-LND-008 con POR-19), 10.9.13 (fila de SM-LND-008 y PAN-POR-19 marcada como reemplazada) y CTR-UXD-12. Ya estaban alineados SM-PWS-002 (rótulo "Cuentas"), SM-PWS-022 (POR-52), SM-PWS-027 (POR-55, `/app/muro(/:id)`), SM-ADM-209 (POR-91), SM-LND-011 (POR-13; POR-91 en 10.9.13) y SM-LND-014 (POR-19 con destino; POR-52 en 10.9.13). Ya no bloquea.
  - 5-11-2026, pendientes de la sincronización: se restauran los IDs de pantalla de 38 filas del mapa (10.9.4 a 10.9.12; SM-ADM-004 a SM-PLT-024) que una ronda posterior a la r3 había reemplazado por "otra pantalla (cita en 10.9.13)" o "pantalla relacionada (cita en 10.9.13)", incluso dentro de los "antes" (por ejemplo SM-PWS-027 "antes COM-31", SM-LND-007 "IAM-02, IAM-03, IAM-04"); el texto se toma del respaldo `_trabajo/backup-cierre-T-20261105/T03-antes-r3.md`. Donde esa ronda dejó la principal en "— (sin pantalla propia en esta app …)" (SM-PWS-028, SM-PWC-019, SM-LND-025) se conserva la decisión y se nombra la pantalla relacionada (COM-40, FAC-46, COM-50). Las 5 tablas irregulares (RN-UXD-003, `variants`, `variables[]`, `lastContext`, `ui.accion.crear`) tenían `|` sin escapar dentro de código; se escapan como `\|` sin cambiar el texto mostrado. El generador del mapa debe leer las referencias a otra app desde 10.9.13 y no contar los IDs citados en "antes".

## 22. Trazabilidad de fuentes

### 22.1 Menú de ProCoop (REL §1) → mapa del sitio

Estados: **Absorbida** (la función existe en CoopApps con el mismo propósito en el ítem indicado), **Reemplazada** (se cubre con otro mecanismo o en otro lugar, indicado), **Descartada** (no se replica; motivo).

| PC-ID | Pestaña > Grupo > Función | Estado | Destino | Nota |
|---|---|---|---|---|
| PC-001 | (Inicio) Alerta "Hay facturas electrónicas pendientes de autorizar!" | Reemplazada | SM-ADM-003 (Alertas) + banner persistente | Ya no es modal bloqueante (CTR-UXD-14) |
| PC-002 | (Inicio) Grilla "Comprobantes Pendientes de Autorizar" (Exportar, Imprimir, Salir) | Absorbida | SM-ADM-046 | `DataTable` con `ExportMenu` |
| PC-003 | (Pantalla principal) Centro de notificaciones | Absorbida | SM-ADM-004, `AlertCenter` | DFA M21 |
| PC-004 | (Pantalla principal) Noticias Procoop | Reemplazada | SM-ADM-004 (avisos del producto) + novedades de versión en SM-PLT-015 | — |
| PC-005 | Servicios a Titulares > Titulares > Administración de Titulares | Absorbida | SM-ADM-007 | Ficha como página con pestañas (CTR-UXD-05) |
| PC-006 | Servicios a Titulares > Titulares > Administración de Personas | Absorbida | SM-ADM-006 | — |
| PC-007 | Servicios a Titulares > Titulares > Consultas e Informes | Absorbida | SM-ADM-015 | — |
| PC-008 | Servicios a Titulares > Consumos > Registro de Lectura | Absorbida | SM-ADM-028; SM-PWC-010 | Más carga en campo |
| PC-009 | Servicios a Titulares > Consumos > Telemed | Absorbida | SM-ADM-032 | — |
| PC-010 | Servicios a Titulares > Consumos > Opciones de consumos | Absorbida | SM-ADM-029, SM-ADM-030 | Dividida en validación y estimaciones |
| PC-011 | Servicios a Titulares > Consumos > Opciones de Telefonía | Absorbida | SM-ADM-108, SM-ADM-109 | — |
| PC-012 | Servicios a Titulares > Consumos > Informes de Consumos | Absorbida | SM-ADM-035 | — |
| PC-013 | Servicios a Titulares > Ventas y Facturación > Presupuestos | Absorbida | SM-ADM-114 | — |
| PC-014 | Servicios a Titulares > Ventas y Facturación > Venta de Productos | Absorbida | SM-ADM-115 | — |
| PC-015 | Servicios a Titulares > Ventas y Facturación > Facturación | Absorbida | SM-ADM-043, SM-ADM-045 | Lotes y comprobantes separados |
| PC-016 | Servicios a Titulares > Ventas y Facturación > Informes de Ventas y Facturación | Absorbida | SM-ADM-050, SM-ADM-117 | Dividido por dominio |
| PC-017 | Servicios a Titulares > Ventas y Facturación > Libro IVA Ventas | Absorbida | SM-ADM-051 | — |
| PC-018 | Servicios a Titulares > Ventas y Facturación > Movimiento de Conceptos | Absorbida | SM-ADM-048 | — |
| PC-019 | Servicios a Titulares > Cobranza > Apertura de Caja | Absorbida | SM-ADM-061 | — |
| PC-020 | Servicios a Titulares > Cobranza > Cobranza Local | Absorbida | SM-ADM-062 | — |
| PC-021 | Servicios a Titulares > Cobranza > Opciones de Cobranza | Absorbida | SM-ADM-063 | — |
| PC-022 | Servicios a Titulares > Cobranza > Informes de Cobranzas | Absorbida | SM-ADM-070 | — |
| PC-023 | Servicios a Titulares > Configuración | Absorbida | SM-ADM-016 (y tablas por dominio en SM-ADM-227) | — |
| PC-024 | Crédito y Gestión de Mora > Financiaciones > Emitir Plan de Financiación | Absorbida | SM-ADM-080 | — |
| PC-025 | Crédito y Gestión de Mora > Financiaciones > Informes | Absorbida | SM-ADM-084 | Unificado con informes de mora |
| PC-026 | Crédito y Gestión de Mora > Gestión de Mora > Generar Notificaciones (1ª instancia) | Absorbida | SM-ADM-071 | — |
| PC-027 | Crédito y Gestión de Mora > Gestión de Mora > Tratamiento de Notificaciones Generadas | Absorbida | SM-ADM-072 | — |
| PC-028 | Crédito y Gestión de Mora > Gestión de Mora > Tratamiento de Morosos | Absorbida | SM-ADM-073 | — |
| PC-029 | Crédito y Gestión de Mora > Gestión de Mora > Notificaciones | Absorbida | SM-ADM-074 | — |
| PC-030 | Crédito y Gestión de Mora > Gestión de Mora > Causas de Baja | Absorbida | SM-ADM-078 | — |
| PC-031 | Crédito y Gestión de Mora > Gestión de Mora > Instancias de Mora | Absorbida | SM-ADM-076 | — |
| PC-032 | Crédito y Gestión de Mora > Gestión de Mora > Excepciones de Mora | Absorbida | SM-ADM-077 | — |
| PC-033 | Crédito y Gestión de Mora > Gestión de Mora > Informes | Absorbida | SM-ADM-084 | — |
| PC-034 | Operaciones > Técnica > Factibilidades | Absorbida | SM-ADM-102 | — |
| PC-035 | Operaciones > Técnica > Órdenes | Absorbida | SM-ADM-103; SM-PWC-002/003 | — |
| PC-036 | Operaciones > Técnica > Carga Rápida de Reclamos | Absorbida | SM-ADM-086 | Pasa a Atención (M09) |
| PC-037 | Operaciones > Técnica > Informes | Absorbida | SM-ADM-113 | — |
| PC-038 | Operaciones > Telemed > Administración | Absorbida | SM-ADM-032 | Unificado con PC-009 |
| PC-039 | Operaciones > Telemed > Informes | Absorbida | SM-ADM-035 | Unificado con PC-012 |
| PC-040 | Operaciones > Telemed > Configuración | Absorbida | SM-ADM-033 | — |
| PC-041 | Operaciones > Planes de Vivienda > Materiales | Absorbida | SM-ADM-181 | Pasa a Servicios sociales |
| PC-042 | Operaciones > Planes de Vivienda > Construcción | Absorbida | SM-ADM-182 | — |
| PC-043 | Operaciones > Planes de Vivienda > Informes | Absorbida | SM-ADM-183 | — |
| PC-044 | Compras y Stock > Gestión de Compras > Solicitudes de Aprovisionamiento | Absorbida | SM-ADM-119 | — |
| PC-045 | Compras y Stock > Gestión de Compras > Solicitudes de Cotización | Absorbida | SM-ADM-120 | — |
| PC-046 | Compras y Stock > Gestión de Compras > Órdenes de Compra | Absorbida | SM-ADM-121 | — |
| PC-047 | Compras y Stock > Gestión de Compras > Remitos | Absorbida | SM-ADM-122 | — |
| PC-048 | Compras y Stock > Gestión de Compras > Comprobantes de Proveedores | Absorbida | SM-ADM-123 | — |
| PC-049 | Compras y Stock > Gestión de Compras > Pago a Proveedores | Absorbida | SM-ADM-124 | — |
| PC-050 | Compras y Stock > Gestión de Compras > Retenciones | Absorbida | SM-ADM-125 | — |
| PC-051 | Compras y Stock > Stock > Movimientos | Absorbida | SM-ADM-129 | — |
| PC-052 | Compras y Stock > Stock > Trazabilidad | Absorbida | SM-ADM-131 | — |
| PC-053 | Compras y Stock > Stock > Operaciones Especiales | Absorbida | SM-ADM-132 | — |
| PC-054 | Compras y Stock > Stock > Bienes de Uso | Absorbida | SM-ADM-133 | — |
| PC-055 | Compras y Stock > Stock > Fabricación | Absorbida | SM-ADM-134 | — |
| PC-056 | Compras y Stock > RMA | Absorbida | SM-ADM-135 | — |
| PC-057 | Compras y Stock > Informes > Compras | Absorbida | SM-ADM-126 | — |
| PC-058 | Compras y Stock > Informes > Stock | Absorbida | SM-ADM-136 | — |
| PC-059 | Compras y Stock > Informes > Libro IVA Compras | Absorbida | SM-ADM-052 | Pasa a Fiscal |
| PC-060 | Compras y Stock > Informes > Correspondencia | Absorbida | SM-ADM-127 | — |
| PC-061 | Tesorería > Bancos > Movimientos Bancarios | Absorbida | SM-ADM-138 | — |
| PC-062 | Tesorería > Bancos > Cuentas Propias | Absorbida | SM-ADM-137 | — |
| PC-063 | Tesorería > Tesorería > Movimientos | Absorbida | SM-ADM-139 | — |
| PC-064 | Tesorería > Tesorería > Valores de Terceros | Absorbida | SM-ADM-140 | — |
| PC-065 | Tesorería > Tesorería > Cheques Propios | Absorbida | SM-ADM-141 | — |
| PC-066 | Tesorería > Tesorería > Cupones de Tarjetas | Absorbida | SM-ADM-142 | — |
| PC-067 | Tesorería > Tesorería > Retenciones Recibidas | Absorbida | SM-ADM-143 | — |
| PC-068 | Tesorería > Tesorería > Cajas para Pagos a Proveedores | Absorbida | SM-ADM-144 | — |
| PC-069 | Tesorería > Tesorería > Cierre de Cajas | Absorbida | SM-ADM-145 | — |
| PC-070 | Tesorería > Informes | Absorbida | SM-ADM-149 | — |
| PC-071 | Sueldos > Administración > Empleados | Absorbida | SM-ADM-162 | — |
| PC-072 | Sueldos > Administración > Empresas | Absorbida | SM-ADM-163 | — |
| PC-073 | Sueldos > Administración > Recibos | Absorbida | SM-ADM-164; SM-PWE-013/014 | Más portal del empleado |
| PC-074 | Sueldos > Procesos > Liquidación Masiva | Absorbida | SM-ADM-166 | — |
| PC-075 | Sueldos > Procesos > Simulador | Absorbida | SM-ADM-167 | — |
| PC-076 | Sueldos > Procesos > Impuesto a las Ganancias | Absorbida | SM-ADM-168 | — |
| PC-077 | Sueldos > Configuración > Variables | Absorbida | SM-ADM-169 | — |
| PC-078 | Sueldos > Configuración > Conceptos | Absorbida | SM-ADM-170 | — |
| PC-079 | Sueldos > Configuración > Aplicar Aumentos | Absorbida | SM-ADM-171 | — |
| PC-080 | Sueldos > Informes > Informes de Sueldos | Absorbida | SM-ADM-173 | — |
| PC-081 | Sueldos > Informes > Libro sueldo digital (deshabilitado en DEMO) | Absorbida | SM-ADM-172 | Habilitado en CoopApps |
| PC-082 | Contabilidad > Movimientos > Asientos | Absorbida | SM-ADM-153 | — |
| PC-083 | Contabilidad > Movimientos > Consultar Mayor | Absorbida | SM-ADM-155 | — |
| PC-084 | Contabilidad > Movimientos > Balance General / Sumas y Saldos | Absorbida | SM-ADM-156 | — |
| PC-085 | Contabilidad > Otras operaciones > Asientos Automáticos | Absorbida | SM-ADM-154 | — |
| PC-086 | Contabilidad > Otras operaciones > Herramientas | Absorbida | SM-ADM-157 | — |
| PC-087 | Contabilidad > Informes > Contables | Absorbida | SM-ADM-160 | — |
| PC-088 | Contabilidad > Informes > de Gestión | Absorbida | SM-ADM-161 | — |
| PC-089 | Herramientas > Actividades > Seguimiento | Absorbida | SM-ADM-097 | — |
| PC-090 | Herramientas > Actividades > Informe | Absorbida | SM-ADM-098 | — |
| PC-091 | Herramientas > SMS | Absorbida | SM-ADM-199 | Integrado al centro de comunicaciones |
| PC-092 | Herramientas > Tablero de Control | Absorbida | SM-ADM-005 | — |
| PC-093 | Herramientas > Traslados > Viajes | Absorbida | SM-ADM-189; SM-PWC-017 | — |
| PC-094 | Herramientas > Traslados > Informes | Absorbida | SM-ADM-190 | — |
| PC-095 | Herramientas > Turnero > Box | Absorbida | SM-ADM-093 | — |
| PC-096 | Herramientas > Turnero > Turnero | Absorbida | SM-ADM-094 | — |
| PC-097 | Herramientas > Turnero > Selección de Turnos | Absorbida | SM-ADM-095; SM-PWS-022; SM-LND-014 | Más turno online |
| PC-098 | Herramientas > Turnero > Estadísticas | Absorbida | SM-ADM-096 | — |
| PC-099 | Herramientas > Mesa de Entradas > Administración | Absorbida | SM-ADM-091 | — |
| PC-100 | Herramientas > Mesa de Entradas > Incidentes | Absorbida | SM-ADM-092 | Nombre configurable `crm.incidente` (VAR 3157) |
| PC-101 | Herramientas > Mesa de Entradas > Informes | Absorbida | SM-ADM-100 | — |
| PC-102 | Configuración > General > Usuarios | Absorbida | SM-ADM-218 | — |
| PC-103 | Configuración > General > Perfiles | Reemplazada | SM-ADM-219 (roles) + SM-ADM-220 (perfiles de pantallas) | Separa funciones de menú (T02) |
| PC-104 | Configuración > General > Auditoría de Logueo | Absorbida | SM-ADM-222 | — |
| PC-105 | Configuración > General > Copia de Seguridad | Reemplazada | SM-ADM-253 (exportación del tenant) + SM-PLT-013 (respaldo de plataforma) | SaaS (CTR-UXD-16) |
| PC-106 | Configuración > General > Base de Datos (deshabilitado) | Descartada | — | Infraestructura gestionada por la plataforma; el tenant no administra bases (**DEC-110**) |
| PC-107 | Configuración > General > Actualizar | Reemplazada | SM-PLT-015 (versiones del producto) | Actualización continua SaaS; el tenant ve novedades, no actualiza |
| PC-108 | Configuración > Tablas y Parámetros > Tablas del sistema | Absorbida | SM-ADM-227 + configuración por dominio (SM-ADM-016, 099, …) | Los 15 submenús de REL §5 se reparten por cluster |
| PC-109 | Configuración > Tablas y Parámetros > Parámetros del Sistema | Absorbida | SM-ADM-228 | — |
| PC-110 | Configuración > Tablas y Parámetros > Parámetros Externos | Absorbida | SM-ADM-229 | — |
| PC-111 | Configuración > Tablas y Parámetros > Autorización de Operaciones | Absorbida | SM-ADM-240 | — |
| PC-112 | Configuración > Procoop WEB > Requisitos y Trámites | Absorbida | SM-ADM-206 (definición), SM-ADM-089 (recibidos), SM-ADM-022 (requisitos por servicio) | — |
| PC-113 | Configuración > Procoop WEB > Archivos en la Web | Absorbida | SM-ADM-207 | — |
| PC-114 | Configuración > Procoop WEB > Operaciones | Absorbida | SM-ADM-208 | — |
| PC-115 | Configuración > Procoop WEB (logos `WEB_Logos_Facturas`) | Reemplazada | SM-ADM-234 (marca e identidad) | Recursos por canal |
| PC-116 | Configuración > Reportes > Editor de Reportes | Absorbida | SM-ADM-213 | — |
| PC-117 | Configuración > Reportes > Informes Personalizados | Absorbida | SM-ADM-214 | — |
| PC-118 | Configuración > Reportes > Procesos Personalizados | Absorbida | SM-ADM-215 | — |
| PC-119 | (Transversal) Exportar / Imprimir en todos los listados (DFA M28) | Absorbida | `DataTable` + `ExportMenu` en todos los listados | RN-UXD-044 |
| PC-120 | (Transversal) Personalización de formularios `FORMULARIOS_PERSONALIZACIONES` | Reemplazada | Vistas guardadas (`dataTableViews`) + diccionario | Sección 19 |

Resultado: **120 funciones** — 112 Absorbidas, 7 Reemplazadas, 1 Descartada; ninguna sin destino.

### 22.2 Fuentes → este anexo

| Fuente | Destino en T03 |
|---|---|
| BASE líneas 7–14 (advertencia y requisito transversal del diccionario) | 1, 5.11 (RF-UXD-141…), 17.1 criterio 1 |
| BASE "Marca y landing por cooperativa" (83–88) | 5.3, 5.6, 7.B.1 `tenantBrandings`, SM-LND-* |
| BASE "Espacios de trabajo" (117–132) | 10.1 layouts por espacio, 10.8.2–10.8.4, RN-UXD-026 |
| BASE §25 (UX del portal) | 5.5, SM-PWS-*, M19 para funciones |
| BASE §30 (tableros, lo visual) | 10.2 componentes de tablero (`KpiCard`, gráficos), SM-ADM-001 |
| BASE §43 MAR-001…MAR-009 | 5.3 (RF-UXD-020…), 7.B.1–7.B.2, 9.1–9.3, PAN-UXD-01, CU-MAR-01 |
| BASE §43.5 (logos de empleados y socios) | RN-UXD-038, CTR-UXD-13, PA-UXD-03 |
| BASE §43.7 (kit de recursos demo) | 18 |
| BASE §43.8 (servicios en landing) | SM-LND-002/003, SM-PWS-003 |
| BASE §45 ACC-001…ACC-004, CU-ACC-01 | RN-UXD-022, 9.10, 16 CU-UXD-07 (antes CU-ACC-01 (parte UX)); permisos en T02 |
| BASE §46 NOT-001…NOT-003 | SM-LND-004/005, SM-PWS-026, SM-PWE-001; canales en T09 |
| BASE §65.1–§65.3 | 5.11, RF-UXD-168, PA-UXD-06 |
| BASE §65.4 | RF-UXD-141…150, 7.B.3–7.B.5 |
| BASE §65.5–§65.6 (ejemplos) | 10.7, 18 TEN-002 |
| BASE §65.8 | RF-UXD-159…162, PRM-UXD-020 |
| BASE §65.9 (pendientes) | PA-UXD-04, PA-UXD-05, PA-UXD-07 |
| BASE CU-DIC-01 | 9.5, 16 CU-DIC-01 |
| BASE CU-25 (parte UX) | 16 CU-25, SM-PWS-009/010 |
| BASE §77 (mapas, geografía) | RN-UXD-057, PRM-UXD-040…044, CTR-UXD-03, PA-UXD-09 |
| BASE §102.5.6 (bandejas y espacios) | SM-PWS-002/017, SM-PWE-002/007 |
| BASE §105 (soluciones) | Encabezado |
| AGR-032 (WCAG 2.2 AA) | 5.10, 10.5, 17.1 criterios 5–6, ESC-UXD-17…21, PRM-UXD-010/027 |
| AGR §5.6 | 10.3 reglas UX |
| AGR-034 / AGR-035 | SM-PLT-010, SM-ADM-254, SM-PLT-014 |
| CNX §1 (stack) | 2, 7.A |
| CNX §2.1 (Leaflet, navegación externa) | 13, CTR-UXD-03, SM-PWC-015 |
| CNX §2.3 (estructura de apps) | 10.1 |
| CNX §2.4 (licencias y capabilities en el menú) | RN-UXD-022, RF-UXD-173 |
| CNX §2.5 (auth, recupero) | 5.9, 10.4, RF-UXD-117 |
| CNX §2.6 (tablas) | 10.2 `DataTable`, PRM-UXD-014 |
| CNX §2.7 (push) | 13, `usePushSubscribe` |
| CNX §3.1 (piel `.pwa-mod`, tokens, Sora) | 5.2, 7.A, RF-UXD-014, CTR-UXD-02 |
| CNX §3.2 (manifest, logos jerárquicos) | RN-UXD-037, RF-UXD-028 |
| CNX §3.3 (AppShell, phone shell, banners, bloqueo de escritorio, asistente) | 5.5, 10.1.4, RN-UXD-027/051, PA-UXD-11/15/16 |
| CNX §3.4 (instalación, splash) | RN-UXD-052, PRM-UXD-006/009, PAN-UXD-14 |
| CNX §3.5 (alta en modal desde FAB) | RF-UXD-099, CTR-UXD-05 |
| CNX §3.6 (login) | 5.9, 10.4, PRM-UXD-030/032, PA-UXD-14 |
| CNX §3.7 (offline) | 9.9, RN-UXD-050, CTR-UXD-10 |
| CNX §3.8 (rutas PWA) | 10.8.2–10.8.4 |
| CNX §4.1 (tokens admin y tipografías) | 5.1, 7.A |
| CNX §4.2 (AdminShell, `ScreenHelp`, IA solo propone, mapa del sitio, fijados) | 5.4, 10.1, RN-UXD-053/055 |
| CNX §4.3 (plataforma) | 5.6, 10.8.6 |
| CNX §4.4–§4.6 (modales, credenciales, indicadores) | 10.2, SM-ADM-246, SM-PWE-008 |
| CNX §5.1, §5.6 (muro, tiras de inicio) | SM-PWS-001/026…028, PRM-UXD-007 |
| CNX §6.1, §6.3 (boletines, avisos, deshacer) | SM-PWS-029/031, PRM-UXD-019, CTR-UXD-14 |
| CNX §7.1 (presentación de encuestas en app), §7.8 | SM-PWS-030, SM-PWE-011, SM-PWC-006 |
| CNX §8 (componente único de audiencia) | 10.2 `AudiencePicker` (dominio T09) |
| CNX §10 V-01, V-07 | 13 almacenamiento, 11 rate limiting |
| CNX §11 | 20 (contraposiciones con el prototipo) |
| REL §1 (menú de 9 pestañas, alerta de inicio) | 22.1 completa |
| REL §2 (fichas con pestañas, acciones de grilla) | CTR-UXD-05, 10.3 |
| REL §5 (tablas del sistema por dominio) | PC-108 |
| DFA §1 (mapa de 29 módulos) y encabezados M1–M29 | 10.8.1 (clusters) |
| DFA M1 (Usuarios, Perfiles, `MENUSYS`, Copia de Seguridad, Actualizar) | 19, 22.1 PC-102…107 |
| DFA M21 (noticias, centro de notificaciones) | PC-003/004 |
| DFA M26, M27 (autolectura, app de campo) | SM-PWS-015, 10.8.4 |
| DFA M28 (`FORMULARIOS_PERSONALIZACIONES`, Exportar e Imprimir) | 19, PC-119/120, RN-UXD-044 |
| RN-09 `VAR_PMOVIL` 5, 6, 7, 8, 9, 14, 35 | 19 → diccionario |
| RN-09 `VAR_PMOVIL` 34 | PRM-UXD-031, 19 |
| RN-09 `VAR_PMOVIL` 40 | 19 (botón CiDi; proveedor en T02) |
| RN-09 `VAR_PMOVIL` 41 | 19 (rol por defecto en T02) |
| RN-09 `VAR_PMOVIL` 65 | RN-UXD-065, 19 |
| RN-09 `VAR` 518, 709, 2264, 2812 | 7.B.1, 19 |
| RN-09 `VAR` 2027, 2028, 2029, 2090, 2251 | RN-UXD-057, PRM-UXD-040…044, 19 |
| RN-09 `VAR` 2242 | Descartado (proveedor Bing sin soporte), 19 |
| RN-09 `VAR` 2275 | Descartado (RN-UXD-059) |
| RN-09 `VAR` 2280 | RN-UXD-058 (dominio T02) |
| RN-09 `VAR` 2294 | PRM-UXD-015 |
| RN-09 `VAR` 2683 | RN-UXD-064, PRM-UXD-033 |
| RN-09 `VAR` 2790 | RN-UXD-063 (delegado a M19) |
| RN-09 `VAR` 3029 | RN-UXD-062 (delegado a M09) |
| RN-09 `VAR` 3093 | Descartado (RN-UXD-061) |
| RN-09 `VAR` 3157 | RN-UXD-060, 19 |
| RN-10 §3.2 (estados del pago web) | RN-UXD-066 |
| RN-10 §3.3–§3.5 (mensajes de rechazo, trámites) | RN-UXD-067, SM-PWS-023 |
| RN-10 §3.6 (`NOTI_COOP`) | RN-UXD-068 |
| Maestro §9 (clusters, tabbars) | 10.8, RF-UXD-066, CTR-UXD-12 |
| Guía §8 (patrón Connectia) | 5, 10 completas |
| DEC-093, DEC-096, DEC-097, DEC-099, DEC-101, DEC-105 (claves `dict:` nuevas citadas por M01, M02, M04, M09, M14, M16, M17 y M18) | 10.7.1 `org.entidadJuridica`; 10.9.14; total de claves de 10.9.11 |
| DEC-095 y DEC-107 (ronda de cierre, 10-11-2026: tipo de comunicación `fis.obligation.cancelled` de T09 §9.6.4, aviso y motivo `taxObligationCancelled` de M14 §8.9, estado `cancellationPending` de M06, compuerta "pendiente de autorización fiscal" de M07 RN-COB-158 y M19 RF-POR-085) | 10.9.14 (11 claves: `com.notifKind.fis.obligation`, `fis.obligation.cancelled.*`, `fis.obligation.cancelReason.*`, `fis.obligation.status.cancellationPending`, `tes.paymentExecution.voidReason.taxObligationCancelled`, `tes.paymentInbox.alert.taxObligationCancelled`, `cob.fiscalGate.pendingAuthorization`); total de claves de 10.9.11 |

### 22.3 Dependencias con otros anexos

| Anexo | Relación |
|---|---|
| T01 PLA | Licencias y activación de módulos (visibilidad del menú), alta de tenant (`pla.tenant.created`), accesos temporales de soporte |
| T02 IAM | Capabilities, roles, perfiles de pantallas, login, sesión por inactividad, SSO/CiDi; UXD solo muestra |
| T04 CFG | Organización y sucursales (razón social, slots por sucursal), registro de parámetros PRM-UXD |
| T06 INT | Proveedor de mapas, bóveda de claves, IA |
| T05 DAT | Modelo canónico de las colecciones de 7.B |
| T07 MIG | Ejecución de la migración de la sección 19 y tabla de equivalencias `MENUSYS` → `SM-ADM` |
| T08 NFR | Almacenamiento, CDN, dominios, certificados, rate limiting, CI de accesibilidad |
| T09 COM | Avisos, push, plantillas de email/SMS que consumen diccionario y marca |
| T10 BIA | Tableros, reportes y metadatos con términos del tenant |
| T11 WFL | Autorizaciones, workflows y bandeja de tareas que se presentan con `ApprovalBar` y `Timeline` |
| M01–M19 | Cada módulo aporta sus ítems de mapa del sitio, claves de diccionario y ayudas; M19 define las funciones del portal y la landing |

Notas de dependencia agregadas por 10.9: los anexos de módulo y T01, T02, T04, T06, T07, T08, T09, T10 y T11 son dueños de ruta y capability de sus pantallas (CTR-UXD-17); T02 debe registrar los alias de capabilities de CTR-UXD-24 y la pantalla de directorio de SM-PWE-015; T07 escribe el diccionario solo en claves canónicas (CTR-UXD-29); T11 es dueño de las plantillas de impresión que antes eran Marca en T04b (CTR-UXD-31).

### 22.4 Trazabilidad de T04b: filas "Diccionario" y "Marca" con destino T03

| T04b | Variable | Decisión T04b | ID / clave en T04b | Destino en este anexo | Estado |
|---|---|---|---|---|---|
| Parte 1 | VAR_PMOVIL 5 | Diccionario | PRM-UXD-P1-001 `dict:por.vincularCuenta.botonAgregar` | `por.agregarCuenta.boton` (10.7.6); alias T04b y sección 19 (CTR-UXD-29) | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 6 | Diccionario | PRM-UXD-P1-002 `dict:por.vincularCuenta.titulo` | `por.agregarCuenta.titulo` | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 7 | Diccionario | PRM-UXD-P1-003 `dict:por.vincularCuenta.campoNumeroSocio` | `por.agregarCuenta.codigoSocio` | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 8 | Diccionario | PRM-UXD-P1-004 `dict:por.vincularCuenta.campoClaveSuministro` | `por.agregarCuenta.clave` | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 9 | Diccionario | PRM-UXD-P1-005 `dict:por.vincularCuenta.ayuda` | `por.agregarCuenta.observacion` | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 35 | Diccionario | PRM-UXD-P1-006 `dict:por.comprobantes.leyendaListado` | `por.facturas.observacion` (canales `pwa-socio` y `documentos`) | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 65 | Diccionario | PRM-UXD-P1-007 `dict:por.cabecera.texto` | `por.cabecera.texto` (RN-UXD-065); avisos temporales en banners (POR-93) | Reemplazado por diccionario |
| Parte 1 | VAR 3157 | Diccionario | PRM-UXD-P1-008 `dict:crm.incidentes.tituloPantalla` | Término `crm.incidente` (RN-UXD-060) | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 14 | Diccionario | PRM-UXD-P1-009 `dict:por.pagos.leyendaVistaPrevia` | `por.pagos.leyendaVistaPrevia` (10.9.10) | Reemplazado por diccionario |
| Parte 1 | VAR_PMOVIL 912 | Diccionario | PRM-UXD-P1-010 `dict:por.inicio.textoBienvenida` | `por.inicio.textoBienvenida` (10.9.10) | Reemplazado por diccionario |
| Parte 1 | VAR 2314 | Diccionario | PRM-UXD-P1-011 `dict:ins.capital.estadosMovimiento` | `ins.capital.estadoMovimiento.suscripto`, `.facturado`, `.integrado` (10.9.10) | Reemplazado por diccionario |
| Parte 2 | VAR 2368 | Marca | `branding.documentFont` | `tenantBrandings.documentFont` (CTR-UXD-30) | A validar PA-UXD-17 |
| Parte 2 | PMovil 23 | Diccionario | `dict:ven.pwa.comprobante.leyendaPie` | `ven.pwa.comprobante.leyendaPie` (10.9.10) | Reemplazado por diccionario |
| Parte 2 | VAR 2318 | Diccionario | `dict:fac.concepto.desconocido` | `fac.concepto.desconocido` (10.9.10) | Reemplazado por diccionario |
| Parte 3 | VAR 3083 | Diccionario | `dict:cob.cupon.codigoAutorizacion` | `cob.cupon.codigoAutorizacion` (10.9.10) | Reemplazado por diccionario |
| Parte 4 | VAR 180 | Marca | `uxd.template.workOrder` | Plantilla por defecto del propósito "orden de trabajo" en T11 (WFL-17) con marca del tenant | Reemplazado (CTR-UXD-31) |
| Parte 4 | VAR 382 | Marca | `uxd.template.purchaseVatBook` | Plantilla del libro IVA compras en T11 (WFL-17); datos de FIS-29 | Reemplazado (CTR-UXD-31) |
| Parte 4 | VAR 406 | Marca | `uxd.template.withholdingCertificate` | Plantilla del certificado de retención en T11 (WFL-17); datos de FIS-26 | Reemplazado (CTR-UXD-31) |
| Parte 4 | VAR 370 | Marca | `uxd.template.chequePrint` | Plantilla de impresión de cheques por chequera en T11 (WFL-17); TES-20 | Reemplazado (CTR-UXD-31) |

Los identificadores PRM-UXD-P1-001 a PRM-UXD-P1-011 de T04b **no son parámetros**: son claves de diccionario y no se registran en el catálogo de parámetros de T04 (sección 14). Se conservan como referencia de migración en la tabla de equivalencias de T07.

### 22.5 Trazabilidad de T04b: filas "Reemplazado" con destino T03

| T04b | Variable | Contenido ProCoop | Destino en CoopApps | Ámbito |
|---|---|---|---|---|
| Parte 1 | VAR 2294 | Tipo de exportación Excel | PRM-UXD-015 y exportación del `DataTable` (XLSX, CSV, PDF) | tenant |
| Parte 1 | VAR 50 | Filtros guardados del padrón de titulares | Vistas guardadas del `DataTable` (`dataTableViews`) en PER-20 (SM-ADM-015) | usuario |
| Parte 1 | VAR 2321 | Solo servicios activos por defecto en titulares | Filtro por defecto de la vista compartida de PER-01 (SM-ADM-007) | tenant |
| Parte 1 | VAR 2557 | Observación del servicio en titulares | Columna configurable en PER-02 | usuario |
| Parte 1 | VAR 2563 | Localidad en búsqueda de recorridos | Columna configurable en MED-05 y FAC-33 | usuario |
| Parte 1 | VAR 2744 | Observaciones de cuenta en búsqueda de titulares | Columna configurable del buscador de PER-01 | usuario |
| Parte 1 | VAR 3172 | Personalización de grillas | `DataTable` de este anexo; destino principal T10 | — |
| Parte 3 | VAR 2349 | Observación del domicilio del servicio en búsqueda por cuenta | Columna configurable del selector de titulares | usuario |
| Parte 3 | VAR 2436 | Observación del domicilio de la cuenta en búsqueda por cuenta | Columna configurable del selector de titulares | usuario |
| Parte 3 | VAR 2441 | Imprimir al marcar en consulta de deuda | Preferencia de usuario de COB-01 (`userUiPreferences`) | usuario |
| Parte 3 | VAR 2451 | Vencimiento en facturas con entregas | Columna configurable en FAC-31 | usuario |
| Parte 3 | VAR 2562 | Interés entre vencimientos en columna separada en caja | Columna de COB-10 disponible si PRM-MOR-P3-015 está activo | usuario |
| Parte 3 | VAR 2364 | Sin vista previa en recibo u operación de caja | Preferencia de usuario "Vista previa antes de imprimir" en COB-10 | usuario |
| Parte 3 | VAR 2747 | Columna Teléfono en administrador de Pagos360 | Columna configurable en COB-24 | usuario |

Todas las filas de T04b con destino T03 (17 de la parte 1, 3 de la parte 2, 8 de la parte 3 y 4 de la parte 4: 32 en total) quedan trazadas en 22.4, 22.5 o la sección 19.
