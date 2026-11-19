# Casos de prueba de aceptación — T03 UXD — Experiencia, design system, marca por tenant, diccionario de términos y etiquetas, layouts y mapa del sitio

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T03-UXD-experiencia-marca-diccionario.md`](../../especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 179 CP de requisitos funcionales, 25 CP de escenarios ESC y 14 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T03 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Design system del admin (T03 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0001 | RF-UXD-001; T03 §5.1; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Política de tema: `dark` `user` | El admin usa **tema oscuro por defecto** con tema claro disponible, conmutado por `data-theme` en `<html>` | Al primer ingreso el admin abre en oscuro; el conmutador cambia a claro sin recargar y persiste en `userUiPreferences.theme` |
| CP-UXD-0002 | RF-UXD-002; T03 §5.1; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Tokens del admin oscuro: `--canvas #111019`, `--panel #1e1a2b`, `--panel-2 #17141f`, `--ink #ece9f4`, `--line #2c2739`, `--brand #6b5bf0`, `--ok #5bd39b`, `--warn #e2b552`, `--bad #f0837b`, `--r 12px`, `--r-s 9px` (tabla completa en 7.A.1) | Inspección de variables computadas en `:root[data-theme=dark]` devuelve exactamente esos valores |
| CP-UXD-0003 | RF-UXD-003; T03 §5.1; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Tokens del admin claro derivados (7.A.1) con `--brand` igual en claro y oscuro salvo override del tenant | Contraste de texto sobre superficies ≥ 4,5:1 en ambos temas (prueba automatizada) |
| CP-UXD-0004 | RF-UXD-004; T03 §5.1; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Tipografías del admin: **Space Grotesk** (títulos), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (importes, lecturas, códigos, CUIT, números de comprobante y todo dato tabular) | Ningún importe de una tabla se renderiza fuera de `--font-mono`; las fuentes se sirven autoalojadas (PA-UXD-08) |
| CP-UXD-0005 | RF-UXD-005; T03 §5.1; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Estados semánticos únicos `ok` / `warn` / `bad` / `info` / `neutral` usados por `StatusBadge`, toasts, rail de cards y KPIs; prohibido usar colores literales para estados | Lint de estilos rechaza hex literales en componentes fuera de `tokens.css` |
| CP-UXD-0006 | RF-UXD-006; T03 §5.1; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Radios `--r 12px` (paneles, modales, cards) y `--r-s 9px` (campos, botones, chips de filtro) | Revisión visual del catálogo de componentes |
| CP-UXD-0007 | RF-UXD-007; T03 §5.1; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Escala de espaciado, tipográfica, sombras, z-index y movimiento definida como tokens (7.A.3–7.A.6) | Todos los componentes consumen tokens; ningún `margin`/`padding` literal en componentes de `packages/ui` |
| CP-UXD-0008 | RF-UXD-008; T03 §5.1; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Densidad conmutables `cómoda` / `compacta` para tablas y formularios del admin, por preferencia del usuario | La densidad compacta reduce la altura de fila de 44 a 32 px sin bajar el área táctil de botones por debajo de 24×24 (WCAG 2.5.8) |
| CP-UXD-0009 | RF-UXD-009; T03 §5.1; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Iconografía única `AppIcon` SVG inline 24×24, trazo 1,75, `currentColor`, con catálogo por nombre; sin librerías de íconos externas | Catálogo visible en la página de componentes; ícono inexistente muestra un placeholder y registra advertencia en desarrollo |
| CP-UXD-0010 | RF-UXD-010; T03 §5.1; PRO-O0-14 | O0 | Estándar | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Gráficos del admin en SVG/CSS propio (sin librería de gráficos), con tabla de datos alternativa accesible | Todo gráfico tiene botón `dict:ui.grafico.verTabla` (Ver como tabla) |
### 1.2 Design system de la PWA (T03 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0011 | RF-UXD-011; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Política de tema: `dark` `user` | Piel oscura `.pwa-mod` aplicada a listados, formularios y modales de la PWA, independiente del tema de la empresa | Toda vista de la PWA monta su contenido dentro de un contenedor con clase `.pwa-mod` |
| CP-UXD-0012 | RF-UXD-012; T03 §5.2; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Tokens `.pwa-mod`: `--pwa-bg #000` (página) / `#22222b` (hoja), `--pwa-brand` (default `#7a51ca`), `--pwa-lilac` (default `#8b78ff`), `--pwa-text #fff`, `--pwa-muted rgba(255,255,255,.72)`, `--pwa-dim rgba(255,255,255,.48)`, `--pwa-line… | Variables computadas coinciden; `--pwa-brand`/`--pwa-lilac` cambian con la marca del tenant |
| CP-UXD-0013 | RF-UXD-013; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Fondo glow obligatorio: `background-color #000` + `radial-gradient(90% 55% at 50% -8%, rgba(139,120,255,.18), transparent 55%)` + `radial-gradient(70% 40% at 100% 100%, rgba(139,120,255,.05), transparent 50%)`, con el lila sustituido por… | Captura de referencia por tenant demo; el glow usa `--pwa-lilac-rgb` |
| CP-UXD-0014 | RF-UXD-014; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Tipografía única de la PWA: `'Sora', 'Montserrat', 'Segoe UI', sans-serif`, con cifras tabulares (`font-variant-numeric: tabular-nums`) en importes y lecturas | Importes alineados por dígito en listas de facturas |
| CP-UXD-0015 | RF-UXD-015; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Tema claro de base de la PWA (`style.css`): página `#f8fafc`, superficie `#ffffff`, texto `#0f172a`, secundario `#64748b`, marca `#8554c9`; tema oscuro: página `#000`, card `#22222b`, marca `#a78bfa` | Conmutar `data-theme` cambia superficies fuera de `.pwa-mod` (topbar, tabbar, landing interna) |
| CP-UXD-0016 | RF-UXD-016; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Política de tema: `dark` `user` | Resolución del tema en **tres niveles**: política del tenant (`dark` / `light` / `user`), preferencia del usuario (si la política lo permite) y **oscuro forzado** en login y splash | Con política `dark` el selector de tema no aparece en Perfil; login y splash siempre oscuros |
| CP-UXD-0017 | RF-UXD-017; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | H1 de vista: `font-weight 600`, `letter-spacing -0.035em`, `font-size clamp(1.35rem, 4.5vw, 1.55rem)`; cada vista empieza con H1 + subtítulo | Ninguna vista de la PWA carece de H1 único (lint de accesibilidad) |
| CP-UXD-0018 | RF-UXD-018; T03 §5.2; PRO-O0-14 | O0 | Núcleo | regla | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Radios PWA `14 / 18 / 999px`; padding de página `1.25rem 1rem 5rem`; sombra de CTA `0 10px 28px rgba(122,81,202,.28)` recalculada con la marca | Revisión visual |
| CP-UXD-0019 | RF-UXD-019; T03 §5.2; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Animación de entrada `translateY(12px) → 0` en 0,45 s, desactivada con `prefers-reduced-motion: reduce` o preferencia del usuario | Con reduce-motion activo no hay transformaciones en entrada de vistas |
| CP-UXD-0020 | RF-UXD-020; T03 §5.2; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Tamaño de texto ajustable por el usuario (100 % / 115 % / 130 %) sin romper layout, en PWA socio | A 130 % ningún título de card se trunca ni se superpone |
### 1.3 Branding runtime por tenant (T03 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0021 | RF-UXD-021; T03 §5.3; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | El alta de un tenant crea su `tenantBranding` publicado con valores por defecto (nombre del tenant, colores default, logos de producto) para que admin, PWA y landing funcionen desde el primer minuto | Un tenant recién creado abre admin, PWA y landing con su nombre y sin imágenes rotas |
| CP-UXD-0022 | RF-UXD-022; T03 §5.3; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | El tenant gestiona desde su admin: nombre de marca, nombre corto, colores (principal, acento, secundario), logos y splash | Pantalla PAN-UXD-01 permite editar y publicar cada campo |
| CP-UXD-0023 | RF-UXD-023; T03 §5.3; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Recursos diferenciados por canal: logo admin (topbar), logo desktop, logo app móvil (interno), ícono de app (192, 512, maskable, apple-touch), favicon, splash móvil, splash desktop, logo app de empleados, logo app de socios, logo app de… | Cada `kind` de 7.B.2 tiene slot en el editor; un canal sin recurso propio hereda según la cadena de 9.2 |
| CP-UXD-0024 | RF-UXD-024; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Permitir usar la misma imagen en varios canales sin volver a subirla ("usar también en…") | Un mismo `brandAssetId` puede referenciarse desde varios slots |
| CP-UXD-0025 | RF-UXD-025; T03 §5.3; PRO-O0-14 | O0 | Núcleo | regla | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | `applyBrandingCssVars()` pisa en runtime solo las variables de marca (`--brand`, `--brand-accent`, `--brand-2`, `--pwa-brand`, `--pwa-lilac`, sus `-rgb`, `--brand-contrast` y derivados calculados), el resto hereda | Cambiar el color publicado se refleja en todas las apps sin build |
| CP-UXD-0026 | RF-UXD-026; T03 §5.3; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | `applyTenantPwaIdentity()` cambia favicon, `<title>` (`{nombreCorto} · {pantalla}`) y enlaza el **manifest dinámico** `/api/public/{tenantSlug}/pwa/manifest.webmanifest?app={socio/empleado/campo}` | Instalar la PWA en Android muestra ícono y nombre de la cooperativa |
| CP-UXD-0027 | RF-UXD-027; T03 §5.3; PRO-O0-14 | O0 | Núcleo | regla | TEN-001 con Política de tema: `dark` `user` | `applySystemChromeTheme()` actualiza `<meta name="theme-color">` según tema vigente y color del tenant (barra de estado Android, barra de título PWA en escritorio) | Al cambiar tema, `theme-color` cambia en ≤ 1 frame |
| CP-UXD-0028 | RF-UXD-028; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Logos **jerárquicos**: tenant → sucursal; si la sucursal no tiene logo se usa el del tenant; si el tenant no tiene, el del producto | Usuario con contexto de sucursal ve el logo de su sucursal en la topbar |
| CP-UXD-0029 | RF-UXD-029; T03 §5.3; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Splash con logo y color del tenant, mostrado al abrir la PWA instalada y tras el login, con duración máxima 1,2 s o hasta que cargue el shell, lo que ocurra primero | El splash nunca bloquea más de 1,2 s una app ya cargada |
| CP-UXD-0030 | RF-UXD-030; T03 §5.3; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Validación automática de imágenes: formatos (SVG saneado, PNG, WebP, JPG), dimensiones mínimas por `kind`, peso máximo, transparencia requerida para íconos maskable, zona segura del 80 % | Un PNG de 100×100 rechazado como ícono 512 con error inline explicativo |
| CP-UXD-0031 | RF-UXD-031; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Generación automática de variantes (íconos 48–512, maskable, apple-touch 180, favicon 32/16, splash por densidad) a partir de un original (JOB-UXD-01) | Subir un SVG de 1024 produce todas las variantes y se listan en el editor |
| CP-UXD-0032 | RF-UXD-032; T03 §5.3; PRO-O1-13 | O1 | Núcleo | regla | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | **Validación de contraste** de los colores del tenant contra fondos claros y oscuros; si no alcanza 4,5:1 (texto) o 3:1 (UI) se calcula un `--brand-contrast` accesible y se advierte en el editor, sin impedir publicar el color decorativo | Un amarillo `#ffe14d` publicado usa texto `#111019` sobre botones y se muestra advertencia |
| CP-UXD-0033 | RF-UXD-033; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Previsualización en contexto antes de publicar: admin (topbar), PWA socio, PWA empleado, login, splash, landing, ícono instalado, email y PDF de factura, en claro y oscuro | La previsualización usa la marca en borrador sin afectar a usuarios |
| CP-UXD-0034 | RF-UXD-034; T03 §5.3; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Releases: Marca 1; diccionario 0 Marca 3 (incluye una reversión); diccionario 4 (incluye una reversión) | Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) | Revertir restaura la versión N-1 y genera una nueva versión N+1 |
| CP-UXD-0035 | RF-UXD-035; T03 §5.3; PRO-O0-14 | O0 | Núcleo | seguridad | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública **por tenant** con hash en el nombre | Un usuario de TEN-001 no puede listar ni modificar recursos de TEN-002 (prueba negativa) |
| CP-UXD-0036 | RF-UXD-036; T03 §5.3; PRO-O0-14 | O0 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Pre-login con marca: al resolver el tenant (subdominio o código) se cargan logo, colores, fondo de login y botones de SSO **antes** de autenticar, sin revelar usuarios | `GET /api/public/{slug}/branding` responde sin datos personales |
| CP-UXD-0037 | RF-UXD-037; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | El paso "Marca" del alta asistida de tenant en plataforma permite proponer logo y colores con IA (solo propone; un humano confirma) | La propuesta queda en borrador hasta confirmación |
| CP-UXD-0038 | RF-UXD-038; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Nombre visible del remitente por canal derivado de la marca: email (`emailSenderName`), SMS (`smsSenderName`, máx. 11 caracteres alfanuméricos), WhatsApp (nombre del perfil, informativo) | El SMS de aviso usa el nombre corto configurado |
| CP-UXD-0039 | RF-UXD-039; T03 §5.3; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Sigla/nombre corto de la cooperativa (`shortName`) usada en títulos de pestaña, archivos exportados y textos compactos | Exportar una tabla genera `{shortName}-{pantalla}-{dd-mm-yyyy}.xlsx` |
| CP-UXD-0040 | RF-UXD-040; T03 §5.3; PRO-O0-14 | O0 | Núcleo | regla | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Caché de marca por tenant en cliente (versión en `ETag`), invalidada al publicar mediante evento `uxd.branding.published` y comprobación de versión en cada arranque | Tras publicar, un cliente abierto toma la nueva marca en el siguiente arranque o en ≤ 5 min |
### 1.4 Layouts del admin (T03 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0041 | RF-UXD-041; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | `AdminShell` único con **topbar**: logo del producto, logo del tenant, selector de contexto, botón `dict:ui.mapaSitio.titulo` (Mapa del sitio), accesos fijados, buscador global, centro de alertas, avisos, ayuda, menú de usuario | Todas las rutas del admin con `meta.tenantOnly` se renderizan dentro de `AdminShell` |
| CP-UXD-0042 | RF-UXD-042; T03 §5.4; PRO-O0-15 | O0 | Núcleo | regla | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | **Selector de contexto**: tenant (si el usuario pertenece a varios), sucursal/agencia, y cuando el módulo lo use, servicio y período; el contexto viaja en el cliente API y se recalculan perfiles y alcance (T02) | Cambiar de sucursal recarga datos con el nuevo alcance sin cerrar sesión |
| CP-UXD-0043 | RF-UXD-043; T03 §5.4; PRO-O0-15 | O0 | Núcleo | migración | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Mapa del sitio**: modal de pantalla completa con buscador (por etiqueta del diccionario, sinónimos, ruta y código ProCoop equivalente), clusters → grupos → ítems, solo ítems permitidos, y opción de fijar | Buscar "libro iva" encuentra `SM-ADM-` del Libro IVA Ventas aunque el tenant haya renombrado el ítem |
| CP-UXD-0044 | RF-UXD-044; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Menú lateral** colapsable generado del mismo `siteMapGroups`; recuerda grupos abiertos; muestra badge de pendientes por ítem cuando el módulo lo provea | No existe segunda fuente de menú (revisión de código) |
| CP-UXD-0045 | RF-UXD-045; T03 §5.4; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | **Accesos fijados** por el usuario (máx. 12) en la topbar, reordenables por arrastre y teclado | Persisten entre dispositivos en `userUiPreferences.pinnedItems` |
| CP-UXD-0046 | RF-UXD-046; T03 §5.4; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Accesos sugeridos por el administrador del tenant por rol (fijados por defecto que el usuario puede quitar) | Un usuario nuevo con rol Cajero ve "Cobranza local" fijado |
| CP-UXD-0047 | RF-UXD-047; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **`siteMapGroups` declarativo único** usado por menú, mapa del sitio, editor de roles/perfiles de pantalla (T02), breadcrumbs, buscador global y verificación de cobertura; prohibido parchar el menú en runtime | Test que compara rutas del router con ítems del mapa: toda ruta navegable tiene ítem (o `meta.hiddenFromMap` justificado) |
| CP-UXD-0048 | RF-UXD-048; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `AdminStickyHeader`: título (`dict:`), subtítulo, breadcrumb, botones de acción a la derecha (máx. 1 primaria + 3 secundarias + menú "más"); debajo y fuera del sticky: ayuda, pestañas, filtros | Al hacer scroll el título y las acciones permanecen visibles |
| CP-UXD-0049 | RF-UXD-049; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | `ScreenHelp`: botón `?` en la cabecera que abre modal con **qué / quién / cuándo / dónde / por qué / cómo + caso de uso**, contenido base del producto sobreescribible por tenant y con enlace a la CU de la especificación | Toda pantalla PAN-* de los anexos tiene `screenId` y artículo de ayuda base |
| CP-UXD-0050 | RF-UXD-050; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | **Modales en 4 tamaños** `sm 480 / md 720 / lg 960 / xl 1180 px`, `Teleport to="body"`, cabecera con color de marca, cierre por fuera, Esc y botón; atrapan el foco y lo devuelven al disparador | Prueba de teclado: Tab no escapa del modal; Esc lo cierra salvo cambios sin guardar (pide confirmación) |
| CP-UXD-0051 | RF-UXD-051; T03 §5.4; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Previews "celular" dentro del admin (`MobilePreview`) para publicaciones, encuestas, notificaciones, marca y diccionario | El preview usa la marca y el diccionario en borrador del tenant |
| CP-UXD-0052 | RF-UXD-052; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Patrón **IA solo propone**: toda generación de IA aparece como borrador marcado `dict:ui.ia.propuesta` (Propuesta de IA) y requiere confirmación humana | Ningún endpoint de IA persiste en estado publicado |
| CP-UXD-0053 | RF-UXD-053; T03 §5.4; PRO-O0-15 | O0 | Núcleo | seguridad | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Cliente API único: agrega `Bearer` + contexto; ante 401 hace **un único refresh compartido** y reintenta una vez; errores RFC 9457 mapeados a toasts/errores inline con `requestId` visible en "Detalles" | 10 requests concurrentes con token vencido disparan 1 solo refresh |
| CP-UXD-0054 | RF-UXD-054; T03 §5.4; PRO-O0-15 | O0 | Núcleo | seguridad | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Separación de router `meta.platformOnly` / `meta.tenantOnly`; `PlatformShell` para plataforma | Un usuario de tenant que navega a `/plataforma/*` recibe 404 de UI y 403 de API |
| CP-UXD-0055 | RF-UXD-055; T03 §5.4; PRO-O0-15 | O0 | Núcleo | migración | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Centro de alertas** del tenant en la topbar (badge) que reemplaza los avisos modales de inicio de ProCoop (ej. "Hay facturas electrónicas pendientes de autorizar") con enlace a la bandeja correspondiente | El ingreso no muestra modal bloqueante; la alerta aparece en el centro con contador |
| CP-UXD-0056 | RF-UXD-056; T03 §5.4; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Breadcrumb `cluster / grupo / ítem / detalle` derivado del mapa | Coincide con la jerarquía del mapa |
| CP-UXD-0057 | RF-UXD-057; T03 §5.4; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Buscador global (Ctrl+K) que busca pantallas del mapa y, si el usuario tiene permiso, entidades (titular por nombre/DNI/CUIT/cuenta, comprobante por número, OT por número) | Resultados agrupados por tipo y filtrados por alcance |
| CP-UXD-0058 | RF-UXD-058; T03 §5.4; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Admin **responsive** desde 1024 px como objetivo principal; 768–1023 px (tablet) soportado con menú colapsado; < 768 px aviso de usar la PWA de empleado | En 1024 px ninguna tabla desborda sin scroll horizontal controlado |
| CP-UXD-0059 | RF-UXD-059; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Ficha de entidad compleja (titular, cuenta, servicio contratado, proveedor, empleado) como **página de detalle** con cabecera resumen, pestañas y `Timeline` de auditoría; el **alta inicial** en modal `lg`/`xl` con los datos mínimos | Alta de persona en modal; al guardar navega a la ficha |
| CP-UXD-0060 | RF-UXD-060; T03 §5.4; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Modo **solo lectura** visible en fichas (cuando el usuario no tiene `editar`), con banda `dict:ui.soloLectura` (Solo lectura) | Campos deshabilitados con aria-readonly y la banda visible |
| CP-UXD-0061 | RF-UXD-061; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | **Bloqueo de edición concurrente** visible: si otro usuario editó el registro (control optimista `version`), mostrar diálogo con diferencias y opciones recargar / sobrescribir (si tiene permiso) | Guardar con versión vieja devuelve 409 y el diálogo muestra los campos en conflicto |
| CP-UXD-0062 | RF-UXD-062; T03 §5.4; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Ayuda de formato siempre visible bajo cada campo con formato (DNI sin puntos, CUIT con guiones, CBU 22 dígitos) | Los campos con máscara muestran `hint` |
### 1.5 Layout de la PWA (T03 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0063 | RF-UXD-063; T03 §5.5; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Una sola PWA** (`apps/pwa`) con landing por rol: socio, empleado, técnico, lecturista, cobrador; menú recortado por allowlist de rol y estado del perfil | Un mismo usuario socio y empleado ve selector de "espacio" (Mi cooperativa como socio / Mi trabajo) |
| CP-UXD-0064 | RF-UXD-064; T03 §5.5; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | `AppShell` único: topbar (menú · logo del tenant · pendientes · asistente IA opcional · avisos con badge), banner opcional, contenido con scroll único, tabbar | Ninguna vista de la PWA define su propia topbar |
| CP-UXD-0065 | RF-UXD-065; T03 §5.5; PRO-O0-15 | O0 | Núcleo | integración | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Banners** apilables con prioridad: offline/pendientes de envío > encuestas obligatorias > deuda vencida/servicio suspendido (socio) > corte programado en tu zona > instalación de la app; máximo 2 visibles, el resto en "ver más" | Con 4 banners activos se ven 2 y un contador |
| CP-UXD-0066 | RF-UXD-066; RN-UXD-006; T03 §5.5; PRO-O0-15 | O0 | Núcleo | integración | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Tabbar** de 5 posiciones con FAB "+" central; contenido por rol según 10.1.4 (socio: Inicio · Cuentas (antes "Cuentas y servicios"; rótulo corto de RN-UXD-006) · + · Gestiones · Comunidad, con Perfil en la topbar, conforme al maestro… | La tabbar del socio muestra `dict:nav.pws.inicio`, `dict:nav.pws.servicios`, `+`, `dict:nav.pws.gestiones`, `dict:nav.pws.comunidad` |
| CP-UXD-0067 | RF-UXD-067; T03 §5.5; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **FAB contextual** mediante `useCreateAction` (provide/inject): cada vista registra su acción de alta; si la vista no registra, el FAB abre el menú de altas permitidas del rol | En "Mis gestiones" el FAB abre el modal de nueva gestión |
| CP-UXD-0068 | RF-UXD-068; T03 §5.5; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Menú hamburguesa** como modal de altura completa con buscador y grupos colapsables definidos como datos (`pwaSiteMap` por rol) | Buscar "factura" encuentra el ítem aunque esté renombrado |
| CP-UXD-0069 | RF-UXD-069; T03 §5.5; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Phone shell** en escritorio: la PWA se centra con `max-width 430px` y `border-radius 28px` sobre el fondo glow | En 1440 px el contenido mide 430 px de ancho |
| CP-UXD-0070 | RF-UXD-070; T03 §5.5; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Guard de router único: autenticación, términos pendientes, bloqueo de escritorio por tenant/rol, **ruteo por rol y por estado del perfil** (pendiente de validación / activo / moroso / suspendido / baja para socio; activo/suspendido para… | Socio con servicio suspendido aterriza en Inicio con banner y acceso directo a pagar |
| CP-UXD-0071 | RF-UXD-071; T03 §5.5; PRO-O0-15 | O0 | Estándar | integración | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Composables: `usePwaInstall` (A2HS con pasos para iOS), `usePullToRefresh`, `usePushSubscribe`, `useNotifBadge`, `useDictation`, `useOfflineQueue` (único) | Oferta de instalación tras el primer login exitoso, descartable y no repetida por 30 días |
| CP-UXD-0072 | RF-UXD-072; T03 §5.5; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Autogestión con **una tarea principal clara por pantalla**: priorizar Mis servicios, Mis facturas y pagos, Mis gestiones y Noticias; estados del trámite y del servicio mostrados por separado | Cada vista de la PWA socio declara `primaryTask` en su meta y tiene una sola acción primaria |
| CP-UXD-0073 | RF-UXD-073; T03 §5.5; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Bandeja del empleado con **siguiente acción, responsable y contexto**; supervisor con pendientes sin asignar y excepciones | La card de bandeja muestra "Siguiente: …" y responsable |
| CP-UXD-0074 | RF-UXD-074; T03 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Tiras horizontales en Inicio del socio (`MuroStripSection`): "Tu última factura", "Cortes programados en tu zona", "Encuesta de satisfacción", "Tus gestiones abiertas" | Las tiras respetan permisos y se ocultan si no hay datos |
| CP-UXD-0075 | RF-UXD-075; T03 §5.5; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Estados del socio, de la solicitud y del servicio con textos distintos: `dict:estado.solicitud.recibida` (Solicitud recibida) ≠ `dict:estado.servicio.activo` (Activo); nunca representar una solicitud como servicio activado | Prueba: solicitar alta de Internet muestra "Solicitud recibida", no "Activo" |
### 1.6 Landing y plataforma (T03 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0076 | RF-UXD-076; T03 §5.6; PRO-O2-16 | O2 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | `LandingLayout` público por tenant (resuelto por subdominio): cabecera con logo y navegación, hero, servicios habilitados, noticias públicas, acceso a la app, consulta pública, pago sin login (si aplica), baja pública (si corresponde)… | La landing de TEN-001 no muestra datos privados ni contenido marcado para empleados |
| CP-UXD-0077 | RF-UXD-077; T03 §5.6; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | La landing usa tipografía Sora y los tokens claros de la PWA por defecto (público general), con secciones en piel oscura opcionales | Lighthouse accesibilidad ≥ 95 en landing demo |
| CP-UXD-0078 | RF-UXD-078; T03 §5.6; PRO-O2-16 | O2 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | El ingreso a la app desde la landing conserva el contexto del tenant (no pide código de empresa) | Click en `dict:lnd.acceso.app` abre `/login` del mismo subdominio con marca cargada |
| CP-UXD-0079 | RF-UXD-079; T03 §5.6; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | `PlatformShell`: misma estructura que `AdminShell` con marca del producto (sin marca de tenant), banda superior distintiva `dict:plt.banda` (Plataforma GoodApps) y selector "ver como tenant" solo con acceso temporal vigente (T01) | La banda de plataforma es siempre visible y de color distinto al de cualquier tenant |
| CP-UXD-0080 | RF-UXD-080; T03 §5.6; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Dashboard global de plataforma y dashboard de tenant separados; los indicadores globales no muestran detalle operativo de una cooperativa | Desde el dashboard global no hay enlaces a fichas de socios |
### 1.7 Componentes (T03 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0081 | RF-UXD-081; T03 §5.7; PRO-O0-16 | O0 | Núcleo | integración | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Portar los **componentes molde** de la PWA: `PwaModal`, `PwaTabs`, `PwaFilters`, `PwaEmptyState`, `PwaFab`, `PwaFilePicker`, `PwaCardExtra`, `ConfirmSheet`, `AppIcon`, `SplashScreen`, `PwaOfflinePendingBanner`, `PendingSurveysBanner`… | Todos disponibles en `packages/ui` con historia en el catálogo |
| CP-UXD-0082 | RF-UXD-082; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Construir `DataTable` genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor `?page=&size=`, selección masiva con acciones, exportar XLSX/CSV/PDF… | Ninguna pantalla de listado del admin implementa una tabla propia |
| CP-UXD-0083 | RF-UXD-083; T03 §5.7; PRO-O0-16 | O0 | Núcleo | integración | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Construir `ExcelImportWizard` de 3 pasos: subir (XLSX/CSV, plantilla descargable) → previsualizar con errores por fila y columna, mapeo de columnas → confirmar; ejecución en job con progreso, resultado por fila descargable, idempotencia… | Importar 10.000 filas con 3 errores muestra los 3 errores y permite importar solo las válidas |
| CP-UXD-0084 | RF-UXD-084; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Sistema de **toasts** único (éxito, info, advertencia, error) con cola, duración por tipo, acción "Deshacer" cuando aplique (6 s), `aria-live` | Errores no se cierran solos; éxitos sí a los 4 s |
| CP-UXD-0085 | RF-UXD-085; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `ConfirmDialog` (admin) / `ConfirmSheet` (PWA) únicos para acciones destructivas o irreversibles, con texto del efecto, nombre del objeto y, para acciones económicas críticas, escritura de confirmación | Anular un lote exige tipear el número del lote |
| CP-UXD-0086 | RF-UXD-086; T03 §5.7; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `AudiencePicker` **único** para todo el sistema (publicaciones, encuestas, push, boletines, comunicaciones masivas, avisos de corte), con dimensiones de la cooperativa y recorte al alcance del que publica | No existe otro picker de audiencia en el código |
| CP-UXD-0087 | RF-UXD-087; T03 §5.7; PRO-O0-16 | O0 | Núcleo | regla | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `MoneyInput` / `MoneyDisplay` con `decimal.js`, separador de miles `.` y decimal `,` (es-AR), moneda, precisión por concepto, negativo con signo y color `bad` opcional, fuente mono/tabular | `MoneyInput` nunca convierte a `Number`; pegar "1.234,56" produce `1234.56` |
| CP-UXD-0088 | RF-UXD-088; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `DateInput` / `DateRange` / `PeriodPicker` con formato visible `dd-mm-yyyy`, zona horaria del tenant, atajos (hoy, este mes, mes anterior, últimos 30 días, ejercicio actual) y escritura manual | Escribir "05-11-2026" es válido; "2026-11-05" se normaliza |
| CP-UXD-0089 | RF-UXD-089; T03 §5.7; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `AddressPicker` con catálogo de calles (T04), altura, piso/depto, localidad, y **mapa** opcional para ubicar el punto (coordenadas); siempre con alternativa sin mapa | Un domicilio puede cargarse completo sin interactuar con el mapa |
| CP-UXD-0090 | RF-UXD-090; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | `EntityPicker` genérico con búsqueda server-side, filtros por alcance, alta rápida opcional (si tiene permiso), selección simple o múltiple, chips accesibles | Buscar titular por DNI, nombre, CUIT o cuenta |
| CP-UXD-0091 | RF-UXD-091; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `StatusBadge` único con mapa `estado → {tono semántico, ícono, dict}` por entidad; nunca color como único indicador | Todos los estados tienen ícono + texto |
| CP-UXD-0092 | RF-UXD-092; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `Timeline` de auditoría: quién, cuándo, qué cambió (antes → después), origen (pantalla, API, job, integración), `requestId`, con filtros | La ficha de titular muestra la línea de tiempo con diferencias |
| CP-UXD-0093 | RF-UXD-093; T03 §5.7; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `FileUploader` **privado** (almacenamiento con URL firmadas, nunca `/uploads` público), con arrastre, cámara en móvil, progreso, tipos y tamaños permitidos, antivirus/escaneo asíncrono (T08) | Una URL de adjunto expira según T08 y no es accesible sin firma |
| CP-UXD-0094 | RF-UXD-094; T03 §5.7; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `SignaturePad` accesible (trazo con dedo, lápiz o mouse; alternativa "firmo con mi PIN/OTP" para quien no puede trazar) | Conformidad de instalación firmable por trazo o por OTP |
| CP-UXD-0095 | RF-UXD-095; T03 §5.7; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | `OfflineBanner` / `PwaOfflinePendingBanner` único con contador de pendientes, botón "Reintentar" y detalle por ítem; motor de cola único en IndexedDB con `clientMutationId` | Sin red, una lectura queda en cola y se envía sola al volver la red |
| CP-UXD-0096 | RF-UXD-096; T03 §5.7; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Componentes BI: `BiFilterBar`, `BiKpiGrid` (KPI con fórmula visible en tooltip y "vacío honesto"), `BiMetricBars`, `BiContextPicker` (hasta 40 ítems), `BiAiDrawer` (IA que solo cita KPI/ítem) | Un KPI sin datos muestra `dict:bia.vacio.honesto` y no 0 |
| CP-UXD-0097 | RF-UXD-097; T03 §5.7; PRO-O0-16 | O0 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Catálogo completo de componentes del sistema en 10.2 (más de 70), documentado en un catálogo navegable interno (ruta `/plataforma/design-system` solo plataforma y entornos no productivos) | Cada componente tiene ejemplo, props, estados y notas de accesibilidad |
### 1.8 Reglas UX (T03 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0098 | RF-UXD-098; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Card de listado** con anatomía fija: rail de color de estado · ícono de tipo · título que **nunca se trunca** · badge de estado · dato principal · 2–4 meta-tags · chevron; mínimo 5 datos legibles sin abrir el detalle | Revisión de todas las listas PWA contra `ListCard` |
| CP-UXD-0099 | RF-UXD-099; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Alta siempre en modal** abierto desde el FAB (PWA), nunca en página completa; en admin, alta en modal según 10.3 | Ninguna ruta `/nuevo` en la PWA |
| CP-UXD-0100 | RF-UXD-100; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Carga inicial con 3 skeleton cards** del mismo formato (nunca spinner centrado); al refrescar, la lista baja opacidad pero no se vacía | Throttling de red muestra 3 skeletons |
| CP-UXD-0101 | RF-UXD-101; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Fecha única `dd-mm-yyyy` desde helper central `formatDate` (y `dd-mm-yyyy HH:mm` para fecha-hora), en zona del tenant | Lint prohíbe `toLocaleDateString` fuera del helper |
| CP-UXD-0102 | RF-UXD-102; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Errores **inline** en el formulario, nunca `alert()` del navegador; resumen de errores arriba del formulario con enlaces a cada campo; el formulario conserva lo cargado | Enviar un formulario con 2 errores enfoca el resumen y conserva los valores |
| CP-UXD-0103 | RF-UXD-103; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Mapa central `notifKinds` `tipo → {ícono, color, etiqueta dict}` con fallback por prefijo (`fac.*`, `cob.*`, `mor.*`, `crm.*`, `tec.*`, `com.*`) | Un tipo nuevo `fac.invoice.reissued` sin entrada usa el ícono de `fac.*` |
| CP-UXD-0104 | RF-UXD-104; T03 §5.8; PRO-O0-16 | O0 | Núcleo | integración | TEN-001 con Releases: Marca 1; diccionario 0 Marca 3 (incluye una reversión); diccionario 4 (incluye una reversión) | Cada mejora riesgosa de UI con **flag de apagado sin deploy** (`uiFeatureFlags`) y bitácora de reversión | Apagar `pwa.offlineQueueV2` vuelve al comportamiento anterior sin publicar versión |
| CP-UXD-0105 | RF-UXD-105; T03 §5.8; PRO-O0-16 | O0 | Estándar | funcional | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | Pestañas de texto con línea inferior (nunca chips) para alternar vistas; filtros como chips solo en barras de filtro | Revisión visual |
| CP-UXD-0106 | RF-UXD-106; T03 §5.8; PRO-O0-16 | O0 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Estados vacíos con ilustración SVG propia, título "comercial" y acción primaria (ej. `dict:por.misGestiones.vacio.titulo` "Todavía no iniciaste gestiones") | Ninguna lista vacía muestra solo "Sin datos" |
| CP-UXD-0107 | RF-UXD-107; T03 §5.8; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Guardar borradores** y recuperar carga interrumpida en formularios de más de 5 campos y en trámites del socio | Cerrar la pestaña y volver ofrece `dict:ui.borrador.recuperar` |
| CP-UXD-0108 | RF-UXD-108; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Acciones masivas con resumen previo (cuántos, qué efecto) y resultado por ítem | Aprobar 50 OT muestra "48 aprobadas, 2 con error" con detalle |
| CP-UXD-0109 | RF-UXD-109; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Procesos largos (lotes, importaciones, cierres) muestran barra de progreso del job, son abandonables (siguen en segundo plano) y notifican al terminar | Cerrar la pantalla de un lote en curso no lo cancela; llega aviso al finalizar |
| CP-UXD-0110 | RF-UXD-110; T03 §5.8; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Estados de integración visibles: `Pendiente`, `Confirmado`, `Fallido`, `Resultado incierto` con explicación comprensible | Un pago en proceso no se ve como confirmado |
| CP-UXD-0111 | RF-UXD-111; T03 §5.8; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Importes con explicación comprensible ("¿Por qué pago esto?") en la PWA socio | La factura en la app tiene desglose por concepto con lenguaje del diccionario |
### 1.9 Login UX (T03 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0112 | RF-UXD-112; T03 §5.9; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Resolución del tenant por **subdominio** (`{slug}.{dominio}`); si se accede por dominio genérico, campo **código de cooperativa** que al salir del campo carga logo, colores, fondo y botones SSO | En subdominio no se pide código |
| CP-UXD-0113 | RF-UXD-113; T03 §5.9; PRO-O0-15 | O0 | Núcleo | seguridad | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Pasos: usuario (email, DNI/CUIT para socios, legajo/usuario para empleados) → contraseña → 2FA si corresponde (reenvío con cuenta regresiva y "no volver a pedir en este dispositivo 30 días") | 2FA muestra reenvío habilitado a los 60 s |
| CP-UXD-0114 | RF-UXD-114; T03 §5.9; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | "Recordarme" decide `localStorage` vs `sessionStorage` | Sin "Recordarme", cerrar el navegador cierra la sesión |
| CP-UXD-0115 | RF-UXD-115; T03 §5.9; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Selector de tenant si el usuario pertenece a varios, y de **espacio** (socio / empleado) si tiene ambas relaciones en el mismo tenant | Persona empleada de TEN-001 y socia de TEN-002 elige; nunca ve datos cruzados |
| CP-UXD-0116 | RF-UXD-116; T03 §5.9; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Splash post-login, oferta de instalar la app y landing según rol | Técnico aterriza en `/campo/mi-dia`; socio en `/inicio` |
| CP-UXD-0117 | RF-UXD-117; T03 §5.9; PRO-O0-15 | O0 | Núcleo | seguridad | TEN-001 con Política de tema: `dark` `user` | Ayuda de formato bajo cada campo ("DNI sin puntos") y errores específicos para el usuario **sin** habilitar enumeración en backend: los mensajes del recupero son siempre genéricos; en el login se distingue "usuario inexistente" de… | Recupero responde igual para usuario existente o no |
| CP-UXD-0118 | RF-UXD-118; T03 §5.9; PRO-O1-08 | O1 | Estándar | funcional | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Botones SSO (Google y los que configure T02) y **CiDi** (si el tenant lo habilita) con la marca del proveedor y texto `dict:login.sso.con` ("Ingresar con {proveedor}") | Con CiDi deshabilitado el botón no aparece |
| CP-UXD-0119 | RF-UXD-119; T03 §5.9; PRO-O1-08 | O1 | Estándar | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Enlace configurable bajo el login ("¿Necesitás ayuda?" / enlace de referencia) | El tenant define texto y URL |
| CP-UXD-0120 | RF-UXD-120; T03 §5.9; PRO-O2-16 | O2 | Núcleo | regla | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Registro sencillo desde el login/landing para cualquier persona (sin exigir datos fiscales), separado del alta como asociado o titular | El formulario de registro pide ≤ 5 datos |
| CP-UXD-0121 | RF-UXD-121; T03 §5.9; PRO-O1-08 | O1 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Bloqueo de sesión por inactividad con aviso previo de 60 s y conservación del trabajo en borrador | Tras el tiempo configurado aparece el diálogo de bloqueo; al reingresar recupera el borrador |
| CP-UXD-0122 | RF-UXD-122; T03 §5.9; PRO-O1-08 | O1 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Pantallas de términos pendientes y legales (`/terms`, `/legal/:tipo`) con aceptación versionada antes de continuar | Con términos nuevos el guard los exige |
### 1.10 Accesibilidad (AGR-032) (T03 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0123 | RF-UXD-123; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Objetivo **WCAG 2.2 nivel AA** para admin, PWA (todas las variantes), landing y plataforma; no se declara conformidad sin verificación | Informe de verificación por ola (automática + manual) |
| CP-UXD-0124 | RF-UXD-124; T03 §5.10; PRO-O0-16 | O0 | Núcleo | regla | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Operación completa **por teclado**, orden de foco lógico, foco visible (`:focus-visible` con anillo de 2 px y contraste ≥ 3:1), sin trampas de foco salvo modales | Recorridos esenciales (sección 17) pasan sin mouse |
| CP-UXD-0125 | RF-UXD-125; T03 §5.10; PRO-O0-16 | O0 | Núcleo | regla | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Contraste ≥ 4,5:1 texto normal, ≥ 3:1 texto grande y componentes de UI, en ambos temas y con cualquier color de tenant (RF-UXD-032) | Test automático con colores demo extremos |
| CP-UXD-0126 | RF-UXD-126; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Etiquetas programáticas en todos los campos (`label` visible; `aria-describedby` para ayuda y error) | axe sin errores "label" |
| CP-UXD-0127 | RF-UXD-127; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Mensajes de error claros que indican qué falta y cómo corregir; sugerencia de corrección cuando se conoce | Error de CUIT indica dígito verificador inválido |
| CP-UXD-0128 | RF-UXD-128; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | **Alternativa al mapa** y a cualquier gesto táctil (arrastrar, pinch, swipe, firma): siempre hay control equivalente con un solo puntero o teclado | Reordenar fijados funciona con botones subir/bajar |
| CP-UXD-0129 | RF-UXD-129; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Tamaño de objetivo mínimo 24×24 CSS px (44×44 recomendado en PWA) | Auditoría de objetivos en PWA |
| CP-UXD-0130 | RF-UXD-130; T03 §5.10; PRO-O0-16 | O0 | Núcleo | seguridad | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Sin autenticación basada en prueba cognitiva (no exigir transcribir códigos sin permitir pegar; permitir gestores de contraseñas) | Campo OTP acepta pegado y autocompletado `one-time-code` |
| CP-UXD-0131 | RF-UXD-131; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Ayuda consistente: el acceso a ayuda (`?`/`ScreenHelp`, contacto) está en la misma ubicación en todas las pantallas | Revisión |
| CP-UXD-0132 | RF-UXD-132; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | No pedir dos veces la misma información en un mismo proceso (entrada redundante) | El domicilio del titular se ofrece como opción en el domicilio de servicio |
| CP-UXD-0133 | RF-UXD-133; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Navegación PWA: Default maestro Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración | Foco no oculto por la cabecera sticky ni la tabbar (`scroll-padding`) | El campo enfocado nunca queda bajo la cabecera |
| CP-UXD-0134 | RF-UXD-134; T03 §5.10; PRO-O0-16 | O0 | Núcleo | integración | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Regiones `aria-live` para toasts, progreso de jobs, resultados de búsqueda y estado offline | Lector de pantalla anuncia "Guardado" |
| CP-UXD-0135 | RF-UXD-135; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Reflow a 320 px sin scroll horizontal (salvo tablas de datos, que tienen scroll controlado y vista de cards alternativa en móvil) | Prueba a 320 px |
| CP-UXD-0136 | RF-UXD-136; T03 §5.10; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Textos largos del diccionario no rompen layout: límites de longitud por clave y previsualización con detección de desborde | Un label de 60 caracteres en un botón con límite 24 es rechazado con aviso |
| CP-UXD-0137 | RF-UXD-137; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Idioma de la página declarado (`lang="es-AR"`) y tiempos ajustables (avisos de sesión con extensión) | Validación HTML |
| CP-UXD-0138 | RF-UXD-138; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Alternativas textuales para imágenes de marca (`alt` desde diccionario: `dict:uxd.logo.alt` "Logo de {nombreMarca}") y para ilustraciones decorativas `alt=""` | axe sin errores "image-alt" |
| CP-UXD-0139 | RF-UXD-139; T03 §5.10; PRO-O0-16 | O0 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Recorridos esenciales probados con teclado y lector de pantalla (NVDA + Chrome en Windows, TalkBack en Android, VoiceOver en iOS) antes de cerrar cada ola que los incluya | Acta de prueba por ola (sección 17) |
### 1.11 Diccionario de términos y etiquetas (T03 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0140 | RF-UXD-140; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Diccionario de términos por cooperativa | TEN-001 y TEN-002 muestran "Socios" y "Asociados" respectivamente en el mismo menú |
| CP-UXD-0141 | RF-UXD-141; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Ayudas: Base 3 overrides (PAN-UXD-02, SM-ADM-062, SM-PWS-009) | Etiquetas de UI configurables por tenant (títulos, menús, campos, botones, mensajes, estados vacíos, ayudas) dentro del catálogo habilitado | Ninguna pantalla muestra texto fijo: lint rechaza literales en plantillas Vue fuera de `dict()` |
| CP-UXD-0142 | RF-UXD-142; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Faltantes: 0 2 claves simuladas para IND-UXD-01 | Mecanismo disponible **desde la primera versión**: toda pantalla nueva usa claves desde su creación | El pipeline de CI falla si una pantalla introduce un literal visible |
| CP-UXD-0143 | RF-UXD-143; T03 §5.11; PRO-O1-13 | O1 | Núcleo | regla | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Identidad = visual + lenguaje: el diccionario se administra junto a la marca (misma sección de configuración "Identidad") | Cluster Configuración → grupo Experiencia muestra Marca y Diccionario juntos |
| CP-UXD-0144 | RF-UXD-144; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Catálogo base de conceptos y textos con **clave estable**, tipo (`term`/`label`/`message`/`help`/`legal`), descripción funcional y contexto | Cada clave del catálogo tiene descripción no vacía |
| CP-UXD-0145 | RF-UXD-145; T03 §5.11; PRO-O0-17 | O0 | Núcleo | regla | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Variantes por término: **singular, plural, título** (Title case opcional), **corta** (≤ 12 caracteres para tabbar) y **género gramatical** (m/f) para concordancia ("Nuevo socio" / "Nueva gestión") | Cambiar "Gestión" (f) por "Ticket" (m) hace que `dict:crm.caso.crear` muestre "Nuevo ticket" |
| CP-UXD-0146 | RF-UXD-146; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Variables** con nombre `{nombre}` y **referencias a términos** `{t:per.asociado.one}` dentro de frases, en lugar de concatenar; formato ICU MessageFormat subset (plural `one/other`, select por género) | "Tenés {count, plural, one {# factura vencida} other {# facturas vencidas}}" resuelve correctamente |
| CP-UXD-0147 | RF-UXD-147; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Resolución con **fallback**: tenant+canal → tenant genérico → base del producto; nunca se muestra la clave cruda en producción (en desarrollo se muestra `⟦clave⟧` resaltado) | Borrar una personalización vuelve al texto base |
| CP-UXD-0148 | RF-UXD-148; T03 §5.11; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Variantes **por canal** opcionales: `admin`, `pwa-socio`, `pwa-empleado`, `pwa-campo`, `landing`, `documentos`, `email`, `sms`, `whatsapp`, `push` | `dict:por.cuenta.resumen` puede valer "Mi resumen" en PWA y "Resumen de cuenta" en documentos |
| CP-UXD-0149 | RF-UXD-149; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Aplicar el vocabulario a landing, admin, desktop, app de socios y app de empleados (y campo, plataforma no) según canales habilitados | El mismo cambio se ve en los tres canales tras publicar |
| CP-UXD-0150 | RF-UXD-150; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Distinguir término de negocio reutilizado de texto específico de pantalla (las etiquetas referencian términos) | Cambiar el término "Socio" actualiza las 40+ etiquetas que lo referencian sin editarlas una a una |
| CP-UXD-0151 | RF-UXD-151; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias | Un tenant nuevo no tiene entradas en `tenantDictionaryEntries` y la UI está completa |
| CP-UXD-0152 | RF-UXD-152; T03 §5.11; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Previsualizar en contexto (menú, formulario de alta, canal del socio) y detectar textos demasiado largos o ambiguos antes de aplicar | El editor muestra dónde se usa cada clave y la previsualización con el borrador |
| CP-UXD-0153 | RF-UXD-153; T03 §5.11; PRO-O1-13 | O1 | Núcleo | seguridad | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Administración del diccionario solo con rol funcional (`uxd.diccionario.*`) y perfil de pantalla | Usuario sin capability recibe 403 en API y no ve el ítem |
| CP-UXD-0154 | RF-UXD-154; T03 §5.11; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con Releases: Marca 1; diccionario 0 Marca 3 (incluye una reversión); diccionario 4 (incluye una reversión) | **Versiones y auditoría** de cada cambio (autor, fecha, versión, valor anterior y posterior) y **publicación y reversión** | Revertir a la versión 3 desde la 5 crea la versión 6 igual a la 3 |
| CP-UXD-0155 | RF-UXD-155; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Faltantes: 0 2 claves simuladas para IND-UXD-01 | Mantener el mismo significado en UI, ayuda, atención y datos aunque cambie la denominación | La ayuda contextual usa las mismas claves que la pantalla |
| CP-UXD-0156 | RF-UXD-156; T03 §5.11; PRO-O0-17 | O0 | Núcleo | integración | TEN-001 con Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes | **Textos protegidos** (leyendas fiscales, normativas, legales, denominaciones ARCA de comprobantes, textos de consentimiento) no editables por el tenant | El editor muestra candado y la API rechaza con 422 |
| CP-UXD-0157 | RF-UXD-157; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Faltantes: 0 2 claves simuladas para IND-UXD-01 | Claves de API, códigos de permisos, identificadores y estados internos no cambian al editar un label; los nombres visibles viajan como metadatos separados en exportaciones y BI | Exportación XLSX tiene encabezados con label del tenant y hoja "metadatos" con claves |
| CP-UXD-0158 | RF-UXD-158; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Faltantes: 0 2 claves simuladas para IND-UXD-01 | Detección de **claves faltantes** en nuevas funciones: en CI (clave usada sin entrada en catálogo) y en runtime (registro en `dictionaryMissingKeys`) | Usar `dict('x.y.z')` inexistente rompe el build |
| CP-UXD-0159 | RF-UXD-159; T03 §5.11; PRO-O0-17 | O0 | Núcleo | migración | TEN-001 con Faltantes: 0 2 claves simuladas para IND-UXD-01 | Actualizar o agregar pantallas **no borra** personalizaciones; claves deprecadas conservan su valor histórico y se informa al tenant de claves nuevas | Migración de catálogo con renombre de clave mueve la personalización a la clave nueva (`renamedTo`) |
| CP-UXD-0160 | RF-UXD-160; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Sin reemplazos globales** sobre contenido libre: el diccionario nunca reescribe noticias, mensajes, documentos ni textos históricos | Cambiar "Socio" no altera el cuerpo de publicaciones existentes |
| CP-UXD-0161 | RF-UXD-161; T03 §5.11; PRO-O4-15 | O4 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Documentos, reportes, exportaciones y plantillas de comunicación usan el diccionario del canal correspondiente y **congelan la versión** usada al generarse | Una factura reimpresa conserva el término vigente al emitirla |
| CP-UXD-0162 | RF-UXD-162; T03 §5.11; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Soporte y auditoría ven la clave estable junto a la etiqueta (modo `dict:mostrarClaves` para usuarios con `uxd.diccionario.ver`) | Activar el modo muestra `[per.asociado.plural] Socios` |
| CP-UXD-0163 | RF-UXD-163; T03 §5.11; PRO-O6-09 | O6 | Núcleo | regla | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Bot/IA usan el diccionario conservando la relación con conceptos canónicos; la terminología no se interpreta como instrucción que altere permisos o reglas (los textos son contenido, no código) | Un label con "ignora las reglas" no altera el comportamiento del bot (prueba) |
| CP-UXD-0164 | RF-UXD-164; T03 §5.11; PRO-O1-13 | O1 | Núcleo | regla | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Guardas semánticas: el editor advierte si se intenta dar a dos conceptos distintos el mismo texto en el mismo contexto (ej. `estado.servicio.baja` y `estado.servicio.suspendido` = "Baja"), y lo bloquea para pares declarados como **no… | Intentar "Baja" para suspensión se rechaza con explicación |
| CP-UXD-0165 | RF-UXD-165; T03 §5.11; PRO-O1-13 | O1 | Estándar | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | **Importar/exportar** diccionario (XLSX con `ExcelImportWizard`, JSON) y **copiar desde plantilla** (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") | Importar un XLSX de 50 filas con 2 claves inexistentes las marca como error |
| CP-UXD-0166 | RF-UXD-166; T03 §5.11; PRO-O0-17 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Nombres de servicios, planes, productos, conceptos y categorías **no** son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") | Renombrar el plan "Fibra 300" se hace en M02, no en el diccionario |
| CP-UXD-0167 | RF-UXD-167; T03 §5.11; PRO-O2-17 | O2 | Estándar | migración | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Los textos personalizables de CoopOnline/ProCoop (VAR_PMOVIL 5, 6, 7, 8, 9, 35, 65; VAR 3157) se reemplazan por claves de diccionario (sección 19) | Ningún parámetro de texto de UI en el catálogo de parámetros de T04 |
| CP-UXD-0168 | RF-UXD-168; T03 §5.11; PRO-O0-17 | O0 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Un único idioma `es-AR` en esta versión; el modelo guarda `locale` para no impedir traducción futura | Todas las entradas tienen `locale: 'es-AR'` |
| CP-UXD-0169 | RF-UXD-169; T03 §5.11; PRO-O0-17 | O0 | Núcleo | regla | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Distribución eficiente: paquete compilado por tenant + canal + versión, servido con caché HTTP inmutable y versión en el nombre; el cliente lo carga antes del primer render (pre-login incluye solo el subconjunto `login.*`, `lnd.*`, `ui.*`) | Cambio de versión invalida la caché; tamaño del paquete PWA socio ≤ 60 KB gzip |
| CP-UXD-0170 | RF-UXD-170; T03 §5.11; PRO-O2-17 | O2 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Textos de emails, SMS, WhatsApp y push renderizados en backend con el diccionario del tenant del destinatario (nunca del usuario que dispara el job) | Job de avisos multi-tenant usa el diccionario correcto por destinatario |
| CP-UXD-0179 | RF-UXD-179; T03 §5.11; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Catálogo base de claves transversales de servicio (10.9.12): estados canónicos del contrato de M02, etiquetas de dominio de servicio, motivos de baja comunes y por servicio, y tipos de reclamo por servicio (`crm.claimType`); los módulos… | Cada estado canónico de M02 §8 tiene una clave `estado.servicio.*`; un reclamo de luminaria apagada muestra `dict:crm.claimType.alu.luminariaApagada` |
### 1.12 Mapa del sitio y preferencias (T03 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-UXD-0171 | RF-UXD-171; T03 §5.12; PRO-O0-15 | O0 | Núcleo | seguridad | TEN-001 con Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner… | Mapa del sitio completo por app (admin, PWA socio, PWA empleado, PWA campo, landing, plataforma) según 10.8, con ID estable `SM-*`, ruta, capability y módulo | Cada PAN-* de cada anexo referencia un `SM-*` |
| CP-UXD-0172 | RF-UXD-172; T03 §5.12; PRO-O0-15 | O0 | Núcleo | migración | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Cada función del menú de ProCoop (9 pestañas) tiene un ítem equivalente o un estado `Absorbida` / `Reemplazada` / `Descartada` con motivo (sección 22) | Trazabilidad 22.1 sin filas vacías |
| CP-UXD-0173 | RF-UXD-173; T03 §5.12; PRO-O1-13 | O1 | Estándar | seguridad | TEN-001 con Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552` | Ítems sin licencia/activación o sin capability **no se muestran**; el administrador del tenant puede ver en el mapa del sitio, con marca `dict:ui.mapaSitio.noContratado` (No contratado), los módulos no licenciados | Un cajero no ve Contabilidad; el admin ve Sueldos "No contratado" |
| CP-UXD-0174 | RF-UXD-174; T03 §5.12; PRO-O1-13 | O1 | Núcleo | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Editor de roles/perfiles de pantalla (T02) presenta el mismo árbol del mapa con checkbox por ítem y por acción | El árbol del editor de roles y el del menú son idénticos |
| CP-UXD-0175 | RF-UXD-175; T03 §5.12; PRO-O0-15 | O0 | Núcleo | funcional | TEN-001 con Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m)… | Etiquetas de clusters, grupos e ítems resueltas por diccionario (`nav.*`) | Renombrar `nav.item.per.titulares` cambia menú, mapa y editor de roles |
| CP-UXD-0176 | RF-UXD-176; T03 §5.12; PRO-O0-15 | O0 | Estándar | integración | TEN-001 con Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido | Preferencias del usuario: tema (si política lo permite), densidad, tamaño de texto, reducción de movimiento, accesos fijados, recientes (últimos 10), vistas guardadas, modo de feed (carrusel/lista) | Preferencias sincronizadas entre dispositivos |
| CP-UXD-0177 | RF-UXD-177; T03 §5.12; PRO-O1-13 | O1 | Estándar | seguridad | TEN-001 con Navegación PWA: Default maestro Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración | Configuración por tenant de la navegación de la PWA por rol: 2 enlaces de tabbar, accesos rápidos de Inicio, orden del menú hamburguesa, ítems ocultos (sin otorgar permisos) | Ocultar un ítem no revoca la capability |
| CP-UXD-0178 | RF-UXD-178; T03 §5.12; PRO-O0-15 | O0 | Estándar | funcional | TEN-001 con `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo… | Exportación por defecto en XLSX con opción CSV y PDF (reemplaza "Tipo de exportación de Excel") | El menú exportar ofrece los 3 formatos |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-UXD-5001 — ESC-UXD-01. Abre PAN-UXD-01**

- Cubre: ESC-UXD-01; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552`
- Dado Usuario con `uxd.marca.ver` sin `uxd.marca.editar`
- Cuando Abre PAN-UXD-01
- Entonces Ve la marca en solo lectura; botones de edición ocultos; `PUT /branding/draft` devuelve 403

**CP-UXD-5002 — ESC-UXD-02. Intenta publicar vía API**

- Cubre: ESC-UXD-02; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552`
- Dado Usuario con `uxd.marca.editar` sin `uxd.marca.publicar`
- Cuando Intenta publicar vía API
- Entonces 403 `uxd.publish.forbidden`; borrador intacto

**CP-UXD-5003 — ESC-UXD-03. El mismo usuario que editó intenta publicar**

- Cubre: ESC-UXD-03; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido
- Dado PRM-UXD-021 activo
- Cuando El mismo usuario que editó intenta publicar
- Entonces 409 con mensaje `dict:uxd.error.dobleControl`; otro publicador puede

**CP-UXD-5004 — ESC-UXD-04. Llama `GET /api/admin/uxd/dictionary/keys` con `tenantId` de TEN-002 en el cuerpo o query**

- Cubre: ESC-UXD-04; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido
- Dado Usuario de TEN-001
- Cuando Llama `GET /api/admin/uxd/dictionary/keys` con `tenantId` de TEN-002 en el cuerpo o query
- Entonces Se ignora el parámetro; responde con TEN-001 (el tenant sale del token)

**CP-UXD-5005 — ESC-UXD-05. Pide `/api/public/ten-002/dictionary/{release}/admin/full.json`**

- Cubre: ESC-UXD-05; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado Visitante anónimo
- Cuando Pide `/api/public/ten-002/dictionary/{release}/admin/full.json`
- Entonces 401; solo `login` y `landing` son públicos

**CP-UXD-5006 — ESC-UXD-06. JOB-UXD-01 procesa**

- Cubre: ESC-UXD-06; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Subida de SVG con `<script>`
- Cuando JOB-UXD-01 procesa
- Entonces Recurso `rejected`, motivo "SVG con contenido activo"; no se publica

**CP-UXD-5007 — ESC-UXD-07. Se sube**

- Cubre: ESC-UXD-07; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado Logo de 3 MB
- Cuando Se sube
- Entonces Rechazo inmediato por PRM-UXD-011

**CP-UXD-5008 — ESC-UXD-08. Se previsualiza**

- Cubre: ESC-UXD-08; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Color primario `#FFFF00`
- Cuando Se previsualiza
- Entonces Contraste insuficiente sobre blanco; se propone variante oscurecida para texto; publicar sin corregir bloqueado solo si afecta texto sobre `brand`

**CP-UXD-5009 — ESC-UXD-09. Se renderiza en producción**

- Cubre: ESC-UXD-09; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado Clave usada en pantalla sin entrada en catálogo
- Cuando Se renderiza en producción
- Entonces Se muestra el texto base del código (fallback), se registra en `dictionaryMissingKeys`; en desarrollo se resalta

**CP-UXD-5010 — ESC-UXD-10. Se guarda**

- Cubre: ESC-UXD-10; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Edición con variable `{monto}` no declarada
- Cuando Se guarda
- Entonces Error en línea; no se guarda

**CP-UXD-5011 — ESC-UXD-11. Se intenta editar por API**

- Cubre: ESC-UXD-11; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Clave `fis.comprobante.facturaA` (protegida)
- Cuando Se intenta editar por API
- Entonces 422 `uxd.dictionary.protectedKey`

**CP-UXD-5012 — ESC-UXD-12. Se revierte a 4**

- Cubre: ESC-UXD-12; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Release 7 vigente
- Cuando Se revierte a 4
- Entonces Se crea release 8 igual a 4; historial conserva 5–7

**CP-UXD-5013 — ESC-UXD-13. Escribe `/admin/cobranza/cajas`**

- Cubre: ESC-UXD-13; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Usuario sin `cob.caja.ver` (antes `cob.cajas.ver`)
- Cuando Escribe `/admin/cobranza/cajas`
- Entonces `EmptyState` 403 sin datos; ítem ausente del sidebar y del mapa del sitio

**CP-UXD-5014 — ESC-UXD-14. Administrador abre el mapa del sitio**

- Cubre: ESC-UXD-14; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido
- Dado Módulo no licenciado (M16)
- Cuando Administrador abre el mapa del sitio
- Entonces Cluster "Personal" con badge "No contratado" si PRM-UXD-026; usuario común no lo ve

**CP-UXD-5015 — ESC-UXD-15. Abre la PWA**

- Cubre: ESC-UXD-15; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado Socio en escritorio
- Cuando Abre la PWA
- Entonces Phone shell centrado (PRM-UXD-003); con PRM-UXD-005 para su rol ve bloqueo con QR

**CP-UXD-5016 — ESC-UXD-16. Cierra 3 órdenes**

- Cubre: ESC-UXD-16; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Navegación PWA: Default maestro Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración
- Dado Técnico sin conexión
- Cuando Cierra 3 órdenes
- Entonces Cola muestra 3 pendientes; badge en tabbar "Sincronización"; al reconectar sincroniza y toasts de resultado

**CP-UXD-5017 — ESC-UXD-17. Solo teclado**

- Cubre: ESC-UXD-17; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado Recorrido teclado: alta de titular
- Cuando Solo teclado
- Entonces Llega al formulario, completa, guarda y vuelve al listado con foco en la fila nueva

**CP-UXD-5018 — ESC-UXD-18. Solo teclado**

- Cubre: ESC-UXD-18; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado Recorrido teclado: cobranza en caja
- Cuando Solo teclado
- Entonces Busca cuenta, selecciona comprobantes, elige medio, confirma, imprime

**CP-UXD-5019 — ESC-UXD-19. VoiceOver**

- Cubre: ESC-UXD-19; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado Recorrido lector de pantalla: pagar en PWA
- Cuando VoiceOver
- Entonces Cada paso se anuncia; estados `aria-live`; resultado leído

**CP-UXD-5020 — ESC-UXD-20. Cualquier pantalla**

- Cubre: ESC-UXD-20; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Preferencias: 2 usuarios demo con tema claro y densidad compacta 1 usuario con escala 130 % y movimiento reducido
- Dado Escala de texto 130 %
- Cuando Cualquier pantalla
- Entonces Sin cortes ni superposición; reflow a 320 px CSS

**CP-UXD-5021 — ESC-UXD-21. Navega PWA**

- Cubre: ESC-UXD-21; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado `prefers-reduced-motion`
- Cuando Navega PWA
- Entonces Sin carruseles automáticos ni animaciones de splash

**CP-UXD-5022 — ESC-UXD-22. PRM-UXD-032 `generic`**

- Cubre: ESC-UXD-22; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado Login con credenciales erróneas
- Cuando PRM-UXD-032 `generic`
- Entonces Mensaje genérico; sin revelar si existe el usuario; bloqueo progresivo de T02

**CP-UXD-5023 — ESC-UXD-23. Abre `/login` sin slug**

- Cubre: ESC-UXD-23; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Tenant con dominio genérico
- Cuando Abre `/login` sin slug
- Entonces Campo "Código de cooperativa" (PRM-UXD-030); al resolverlo aplica marca

**CP-UXD-5024 — ESC-UXD-24. Pide `/api/admin/uxd/branding`**

- Cubre: ESC-UXD-24; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Soporte de plataforma con acceso temporal vencido
- Cuando Pide `/api/admin/uxd/branding`
- Entonces 403; auditoría del intento

**CP-UXD-5025 — ESC-UXD-25. Se exporta**

- Cubre: ESC-UXD-25; T03 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Exportación de listado
- Cuando Se exporta
- Entonces Nombre `{shortName}-{pantalla}-{fecha}`, encabezados con términos del tenant, hoja de metadatos con versión del diccionario

## 3. Casos por caso de uso (CU)

**CP-UXD-8001 — CU-MAR-01. Personalizar la marca de la cooperativa**

- Cubre: CU-MAR-01; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Colores: `primary #145DA0`, `secondary #2E8B57`, `accent` derivado `primary #7A51CA` (marca GoodApps), `secondary #0E7C86`, `accent #E2B552`
- Dado `uxd.marca.editar`; tenant activo; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. Abre PAN-UXD-01. 2. Carga nombre, nombre corto y 3 colores (ve contraste en vivo). 3. Sube logos por canal (JOB-UXD-01 genera variantes). 4. Revisa previsualización (admin, PWA, login, splash, ícono, email, PDF). 5. Publica con nota. 6. Las apps abiertas toman la marca en ≤ PRM-UXD-012
- Entonces Release nuevo de marca; evento EVT-UXD-01; auditoría. Alternativo o excepción: 2a. Contraste insuficiente: advertencia, propone color derivado; puede publicar solo si la combinación crítica (texto sobre `brand`) cumple. 3a. Recurso rechazado (formato/peso/SVG con scripts): motivo y reintento. 5a. PRM-UXD-021 activo: queda "pendiente de publicar" para otro usuario

**CP-UXD-8002 — CU-UXD-01. Revertir la marca a una versión anterior**

- Cubre: CU-UXD-01; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Releases: Marca 1; diccionario 0 Marca 3 (incluye una reversión); diccionario 4 (incluye una reversión)
- Dado `uxd.marca.publicar`; ≥ 2 releases; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. PAN-UXD-01 > Versiones. 2. Elige release N, ve diferencias. 3. Confirma con motivo. 4. Se crea release nuevo con el contenido de N
- Entonces Release nuevo; evento EVT-UXD-02. Alternativo o excepción: 2a. Recurso de N dado de baja: se restaura si existe en almacenamiento; si no, bloquea con detalle

**CP-UXD-8003 — CU-DIC-01. Cambiar un término y que impacte en todo el sistema**

- Cubre: CU-DIC-01; RF-UXD-161; T03 §16
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado `uxd.diccionario.editar`, `uxd.diccionario.publicar`; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. PAN-UXD-02, busca "Socio". 2. Edita `per.asociado`: singular "Asociado", plural "Asociados", género masculino. 3. Ve dónde se usa (pantallas, emails, PDF, menú). 4. Previsualiza en contexto. 5. Publica. 6. Admin, PWA, landing, emails nuevos, PDF nuevos, exportaciones y reportes usan "Asociados"
- Entonces Release `n+1`; EVT-UXD-04. Alternativo o excepción: 2a. Valor vacío o con variables no declaradas: error en línea. 2b. Clave protegida (`fis.*`, legales): no editable, badge "Protegido". 6a. Documentos ya emitidos conservan la versión congelada (RF-UXD-161, PA-UXD-07)

**CP-UXD-8004 — CU-DIC-02. Revertir el diccionario**

- Cubre: CU-DIC-02; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado `uxd.diccionario.revertir`; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-UXD-03 > release `k` > ver diferencias > revertir con nota
- Entonces Release nuevo = copia de `k`.

**CP-UXD-8005 — CU-DIC-03. Importar textos desde Excel**

- Cubre: CU-DIC-03; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado `uxd.diccionario.importar`; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando Exportar plantilla, completar, subir, previsualizar (nuevas/cambiadas/errores), confirmar como borradores
- Entonces Borradores (no publica automáticamente). Alternativo o excepción: Filas con clave inexistente o protegida: se informan y no se importan

**CP-UXD-8006 — CU-DIC-04. Aplicar una plantilla de terminología**

- Cubre: CU-DIC-04; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado `uxd.diccionario.editar`; PRM-UXD-023; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando Elige plantilla ("Cooperativa eléctrica", "Mutual", "Usuarios en lugar de socios"), ve diferencias, aplica como borradores
- Entonces Borradores. Alternativo o excepción: Conflicto con entradas propias: elige conservar o reemplazar por clave

**CP-UXD-8007 — CU-DIC-05. Mantener el catálogo base**

- Cubre: CU-DIC-05; RF-UXD-159; T03 §16
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado `uxd.plataforma.diccionarioBase.editar` (antes `plt.uxd.diccionarioBase.editar`); actor: Administrador de plataforma, autenticado en TEN-001 con las capabilities de su rol
- Cuando Alta/renombre/deprecación de claves en código → JOB-UXD-05 → EVT-UXD-08 → recompilación y aviso a tenants
- Entonces Catálogo nuevo; tenants sin perder textos (RF-UXD-159). Alternativo o excepción: Renombre con personalizaciones: se mueven a la clave nueva

**CP-UXD-8008 — CU-UXD-07. Ver solo lo que corresponde**

- Cubre: CU-UXD-07; RN-UXD-022; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado Sesión válida; actor: Cualquier usuario interno, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. Ingresa. 2. El sidebar y el mapa del sitio muestran solo ítems con RN-UXD-022 verdadera. 3. Una ruta directa sin permiso muestra `EmptyState` "No tenés acceso" (403) sin datos
- Entonces — (la asignación de roles y perfiles es T02). Alternativo o excepción: 2a. Administrador ve "No contratado" (PRM-UXD-026) con enlace a licencia

**CP-UXD-8009 — CU-25. Pagar desde la PWA**

- Cubre: CU-25; T03 §16
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Diccionario: Base sin cambios ("Socio", "Titular", "Cuenta", "Reclamo") Plantilla "Cooperativa de servicios": `per.asociado` → Asociado/Asociados (m), `crm.reclamo` → Gestión/Gestiones (f), `crm.incidente` → Incidencia (f), canal…
- Dado Sesión PWA; deuda; actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. FAB Pagar. 2. Elige comprobantes (preseleccionados vencidos). 3. Elige medio. 4. Confirma. 5. Ve resultado con estado (`aprobado`, `pendiente`, `rechazado`) y comprobante
- Entonces La lógica de cobro es M07; aquí solo flujo y estados visibles. Alternativo o excepción: 5a. Sin conexión: no permite pagar, explica. 5b. Pendiente: aviso cuando se acredite (T09)

**CP-UXD-8010 — CU-UXD-02. Configurar la navegación de la PWA por rol**

- Cubre: CU-UXD-02; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Navegación PWA: Default maestro Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración
- Dado `uxd.navegacion.configurar`; actor: Administrador de cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-UXD-05: elige rol, ordena slots de tabbar (5 con FAB central), accesos rápidos, oculta ítems
- Entonces `pwaNavConfigs` actualizada. Alternativo o excepción: Slot sin capability para el rol: no se permite

**CP-UXD-8011 — CU-UXD-03. Instalar la PWA**

- Cubre: CU-UXD-03; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Recursos: Kit demo BASE §43.7: logo horizontal claro/oscuro, isotipo, favicon, íconos PWA 192/512/maskable, splash, logo de documentos, imagen de login, banner landing Kit demo con isotipo distinto para probar aislamiento
- Dado Navegador compatible; actor: Socio / empleado / técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1. Banner de instalación tras primer uso útil. 2. Acepta. 3. Ícono con logo y nombre corto del tenant
- Entonces App instalada (IND-UXD-06). Alternativo o excepción: 1a. iOS: instrucciones paso a paso (PAN-UXD-14). 1b. Rechaza: no se ofrece por PRM-UXD-006 días

**CP-UXD-8012 — CU-UXD-04. Guardar y compartir una vista de tabla**

- Cubre: CU-UXD-04; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Vistas de tabla: 2 privadas, 1 compartida en Titulares 1 compartida en Comprobantes
- Dado Acceso a la tabla; actor: Usuario interno, autenticado en TEN-001 con las capabilities de su rol
- Cuando Filtra, ordena, elige columnas, guarda vista; con `uxd.vistas.compartir` la comparte
- Entonces `dataTableViews`.

**CP-UXD-8013 — CU-UXD-05. Usar el sistema solo con teclado**

- Cubre: CU-UXD-05; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: Navegación PWA: Default maestro Tabbar socio con "Turnos" en lugar de "Comunidad" para probar configuración
- Dado actor: Usuario interno con discapacidad motriz, autenticado en TEN-001 con las capabilities de su rol
- Cuando Salto a contenido, navegación del sidebar con flechas, `Ctrl+K` mapa del sitio, formularios y modales con foco atrapado y `Esc`
- Entonces Recorrido completo sin mouse (10.5).

**CP-UXD-8014 — CU-UXD-06. Operar en campo sin conexión**

- Cubre: CU-UXD-06; T03 §16
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T03 §18.
- Datos de prueba: `brandName` / `shortName`: Cooperativa Ejemplo A / CoopEjA (antes Cooperativa Eléctrica Demo Sur / CoopSur) Cooperativa Ejemplo B / CoopEjB (antes Cooperativa de Servicios Demo Norte / CoopNorte)
- Dado PWA campo con datos descargados; actor: Técnico / lecturista, autenticado en TEN-001 con las capabilities de su rol
- Cuando Ejecuta órdenes o lecturas offline; la cola muestra pendientes; al volver la conexión sincroniza y avisa conflictos
- Entonces Cola vacía. Alternativo o excepción: Conflicto: ítem marcado con el resultado por `clientMutationId` y acción de reintentar o descartar; la regla de conflicto la define el módulo dueño (M10, M03, M07)
