# Catálogo de endpoints · T03 · Experiencia, design system, marca por tenant, diccionario de términos y etiquetas, layouts y mapa del sitio

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir, de una sola vez y para todas las aplicaciones de GoodApps Cooperativas (admin web, PWA del socio, PWA del empleado, PWA de campo, landing pública y consola de plataforma), cómo se ve, cómo se navega, cómo habla y cómo se adapta a cada cooperativa la interfaz, de modo que:

1. Cada módulo M01–M19 y cada transversal T01–T11 construya sus pantallas solo con los shells, componentes, tokens y reglas de este anexo, sin inventar variantes.
2. Cada cooperativa (tenant) tenga su propia app —nombre, colores, logos, splash, ícono instalable, theme-color— y su propio lenguaje —diccionario de términos y etiquetas— sin builds separados y sin tocar código (BASE §43, §65; CNX §3.2).
3. Exista un único mapa del sitio declarativo (siteMapGroups) que alimente el menú, el buscador "Mapa del sitio", el editor de roles/perfiles de pantalla (T02) y la verificación de cobertura frente al menú de ProCoop (sección 10.8 y 22).
4. Los recorridos esenciales cumplan WCAG 2.2 AA y sean tolerantes a errores (AGR-032), con una tarea principal clara por pantalla (BASE §102.5.6, AGR §5.6).

Detalle completo en el anexo T03, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t03-uxd).

| Dato | Valor |
|---|---|
| Endpoints | 56 |
| Por método | DELETE 5, GET 24, POST 15, PUT 12 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 51 |
| Sin requisito identificable | 5 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 56 | Manifest dinámico (RN-UXD-037); Paquete compilado de diccionario (caché inmutable); Recurso de marca público.… |

## Cómo leer cada ficha

Cada endpoint tiene una ficha con estos datos:

| Dato | De dónde sale |
|---|---|
| **Qué hace** | La descripción de la fila API del anexo (§11), seguida de una frase armada con el método HTTP, la forma de la ruta y el nombre de la colección en T05. |
| **Para qué sirve** | El requisito funcional (RF) que el endpoint implementa, con su texto del §5 del anexo. Si la fila API o el anexo lo vinculan, se cita tal cual. Si no, se elige el RF del anexo con más palabras en común y se marca *a confirmar*. |
| **Quién lo usa** | El canal, según el prefijo de la ruta (backoffice, portal del socio, app de campo, consola de plataforma, terceros, público), y el permiso (capability) de T02. |
| **Recibe / Devuelve** | Parámetros, cuerpo y respuesta exitosa del contrato OpenAPI. |
| **Pantallas** | Pantallas del catálogo 4.5 que exigen el mismo permiso. |
| **Ola y fuente** | Ola de construcción y línea de la fila API en el anexo. |

<a id="grupo-1"></a>

## API

56 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-UXD-02](#API-UXD-02) | GET | `/api/public/{tenantSlug}/pwa/manifest.webmanifest` | Manifest dinámico (RN-UXD-037) |
| [API-UXD-03](#API-UXD-03) | GET | `/api/public/{tenantSlug}/dictionary/{release}/{channel}/{bundle}.json` | Paquete compilado de diccionario (caché inmutable) |
| [API-UXD-04](#API-UXD-04) | GET | `/api/public/{tenantSlug}/assets/{hash}.{ext}` | Recurso de marca público. |
| [API-UXD-05](#API-UXD-05) | GET | `/api/admin/uxd/branding` | Publicada + borrador vigente. |
| [API-UXD-06](#API-UXD-06) | PUT | `/api/admin/uxd/branding/draft` | Crear/actualizar borrador (control version) |
| [API-UXD-07](#API-UXD-07) | DELETE | `/api/admin/uxd/branding/draft` | Descartar borrador. |
| [API-UXD-08](#API-UXD-08) | POST | `/api/admin/uxd/branding/publish` | Publicar borrador (Idempotency-Key) |
| [API-UXD-09](#API-UXD-09) | POST | `/api/admin/uxd/branding/revert` | Revertir a releaseNumber. |
| [API-UXD-10](#API-UXD-10) | GET | `/api/admin/uxd/branding/releases` | Historial. |
| [API-UXD-12](#API-UXD-12) | GET | `/api/admin/uxd/branding/assets` | Listar recursos. |
| [API-UXD-11](#API-UXD-11) | POST | `/api/admin/uxd/branding/assets` | Subir recurso (multipart a URL firmada; crea brandAssets en processing) |
| [API-UXD-13](#API-UXD-13) | DELETE | `/api/admin/uxd/branding/assets/{id}` | Baja lógica si no está referenciado. |
| [API-UXD-14](#API-UXD-14) | POST | `/api/admin/uxd/branding/contrast-check` | Calcula derivados y contraste de colores arbitrarios. |
| [API-UXD-15](#API-UXD-15) | GET | `/api/admin/uxd/dictionary/keys` | Catálogo con valor base, valor del tenant y estado. |
| [API-UXD-16](#API-UXD-16) | PUT | `/api/admin/uxd/dictionary/entries/{key}` | Crear/actualizar borrador de entrada (valida RN-UXD-005…009) |
| [API-UXD-17](#API-UXD-17) | DELETE | `/api/admin/uxd/dictionary/entries/{key}` | Borrador de vuelta al base. |
| [API-UXD-18](#API-UXD-18) | POST | `/api/admin/uxd/dictionary/publish` | Publicar borradores con nota. |
| [API-UXD-19](#API-UXD-19) | POST | `/api/admin/uxd/dictionary/revert` | Revertir a release k. |
| [API-UXD-20](#API-UXD-20) | GET | `/api/admin/uxd/site-map` | Árbol filtrado para el usuario con labels resueltos y badges (9.10) |
| [API-UXD-21](#API-UXD-21) | GET | `/api/admin/uxd/dictionary/releases` | Historial y diferencias. |
| [API-UXD-21-b](#API-UXD-21-b) | GET | `/api/admin/uxd/dictionary/releases/{n}/diff/{m}` | Historial y diferencias. |
| [API-UXD-22](#API-UXD-22) | GET | `/api/admin/uxd/dictionary/export` | Exportar. |
| [API-UXD-23](#API-UXD-23) | POST | `/api/admin/uxd/dictionary/import` | Importación con ExcelImportWizard. |
| [API-UXD-23-b](#API-UXD-23-b) | POST | `/api/admin/uxd/dictionary/preview` | Importación con ExcelImportWizard. |
| [API-UXD-23-c](#API-UXD-23-c) | POST | `/api/admin/uxd/dictionary/confirm` | Importación con ExcelImportWizard. |
| [API-UXD-24](#API-UXD-24) | POST | `/api/admin/uxd/dictionary/apply-template` | Copia una plantilla de plataforma como borradores. |
| [API-UXD-25](#API-UXD-25) | GET | `/api/admin/uxd/dictionary/usage/{key}` | Dónde se usa (pantallas y claves que referencian el término) |
| [API-UXD-26](#API-UXD-26) | POST | `/api/uxd/dictionary/missing` | Reporte de clave faltante. |
| [API-UXD-27](#API-UXD-27) | GET | `/api/admin/uxd/help/{screenId}` | Ayuda contextual (base + override) |
| [API-UXD-27-b](#API-UXD-27-b) | PUT | `/api/admin/uxd/help/{screenId}` | Ayuda contextual (base + override) |
| [API-UXD-28](#API-UXD-28) | GET | `/api/admin/uxd/flags` | Flags del tenant. |
| [API-UXD-28-b](#API-UXD-28-b) | PUT | `/api/admin/uxd/flags` | Flags del tenant. |
| [API-UXD-28-c](#API-UXD-28-c) | GET | `/api/admin/uxd/flags/{key}` | Flags del tenant. |
| [API-UXD-28-d](#API-UXD-28-d) | PUT | `/api/admin/uxd/flags/{key}` | Flags del tenant. |
| [API-UXD-29](#API-UXD-29) | GET | `/api/admin/uxd/pwa-nav/{role}` | Navegación PWA por rol. |
| [API-UXD-29-b](#API-UXD-29-b) | PUT | `/api/admin/uxd/pwa-nav/{role}` | Navegación PWA por rol. |
| [API-UXD-30](#API-UXD-30) | GET | `/api/me/ui-preferences` | Preferencias del usuario (tema, densidad, fijados, recientes, feed) |
| [API-UXD-30-b](#API-UXD-30-b) | PUT | `/api/me/ui-preferences` | Preferencias del usuario (tema, densidad, fijados, recientes, feed) |
| [API-UXD-31](#API-UXD-31) | GET | `/api/admin/uxd/table-views` | Vistas guardadas de DataTable. |
| [API-UXD-31-c](#API-UXD-31-c) | PUT | `/api/admin/uxd/table-views` | Vistas guardadas de DataTable. |
| [API-UXD-31-b](#API-UXD-31-b) | POST | `/api/admin/uxd/table-views` | Vistas guardadas de DataTable. |
| [API-UXD-31-d](#API-UXD-31-d) | DELETE | `/api/admin/uxd/table-views` | Vistas guardadas de DataTable. |
| [API-UXD-31-e](#API-UXD-31-e) | GET | `/api/admin/uxd/table-views/{id}` | Vistas guardadas de DataTable. |
| [API-UXD-31-f](#API-UXD-31-f) | PUT | `/api/admin/uxd/table-views/{id}` | Vistas guardadas de DataTable. |
| [API-UXD-31-g](#API-UXD-31-g) | DELETE | `/api/admin/uxd/table-views/{id}` | Vistas guardadas de DataTable. |
| [API-UXD-32](#API-UXD-32) | GET | `/api/uxd/site-map` | Menú PWA filtrado por rol. |
| [API-UXD-33](#API-UXD-33) | GET | `/api/platform/uxd/dictionary-keys` | Catálogo de producto y plantillas. |
| [API-UXD-33-b](#API-UXD-33-b) | PUT | `/api/platform/uxd/dictionary-keys` | Catálogo de producto y plantillas. |
| [API-UXD-33-c](#API-UXD-33-c) | POST | `/api/platform/uxd/dictionary-keys` | Catálogo de producto y plantillas. |
| [API-UXD-33-d](#API-UXD-33-d) | POST | `/api/platform/uxd/dictionary-keys/publish` | Catálogo de producto y plantillas. |
| [API-UXD-33-e](#API-UXD-33-e) | POST | `/api/platform/uxd/dictionary-keys/templates` | Catálogo de producto y plantillas. |
| [API-UXD-34](#API-UXD-34) | GET | `/api/platform/uxd/dictionary-missing` | Faltantes de todos los tenants (sin datos personales) |
| [API-UXD-35](#API-UXD-35) | GET | `/api/platform/uxd/flags` | Flags globales. |
| [API-UXD-35-b](#API-UXD-35-b) | PUT | `/api/platform/uxd/flags` | Flags globales. |
| [API-UXD-36](#API-UXD-36) | GET | `/api/platform/uxd/branding/{tenantId}` | Marca de un tenant (lectura) |
| [API-UXD-37](#API-UXD-37) | PUT | `/api/platform/uxd/branding/{tenantId}/draft` | Propuesta de marca en el alta asistida (queda en borrador del tenant) |

<a id="API-UXD-02"></a>
#### API-UXD-02 · `GET /api/public/{tenantSlug}/pwa/manifest.webmanifest`

- **Qué hace:** Manifest dinámico (RN-UXD-037) Consulta `manifest.webmanifest`.
- **Para qué sirve:** RF-UXD-026: applyTenantPwaIdentity() cambia favicon, <title> ({nombreCorto} · {pantalla}) y enlaza el manifest dinámico /api/public/{tenantSlug}/pwa/manifest.webmanifest?app={socio\ *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2846 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-02)

<a id="API-UXD-03"></a>
#### API-UXD-03 · `GET /api/public/{tenantSlug}/dictionary/{release}/{channel}/{bundle}.json`

- **Qué hace:** Paquete compilado de diccionario (caché inmutable) Obtiene el detalle de un registro de `dictionary`.
- **Para qué sirve:** RF-UXD-169: Distribución eficiente: paquete compilado por tenant + canal + versión, servido con caché HTTP inmutable y versión en el nombre; el cliente lo carga antes del primer render (pre-login incluye solo el subconjunto login.*, lnd.*… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `iam.sesion.autenticada`.
- **Recibe:** en la ruta `tenantSlug`, `release`, `channel`, `bundle`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2847 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-03)

<a id="API-UXD-04"></a>
#### API-UXD-04 · `GET /api/public/{tenantSlug}/assets/{hash}.{ext}`

- **Qué hace:** Recurso de marca público. Obtiene el detalle de un registro de recursos de marca (`brandAssets`).
- **Para qué sirve:** RF-UXD-035: Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública por tenant con hash en el nombre *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `hash`, `ext`.
- **Devuelve:** 200: el registro de recursos de marca (`brandAssets`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2848 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-04)

<a id="API-UXD-05"></a>
#### API-UXD-05 · `GET /api/admin/uxd/branding`

- **Qué hace:** Publicada + borrador vigente. Consulta `branding`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-01 (Editar y publicar la marca).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2849 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-05)

<a id="API-UXD-06"></a>
#### API-UXD-06 · `PUT /api/admin/uxd/branding/draft`

- **Qué hace:** Crear/actualizar borrador (control version) Reemplaza o configura `draft`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2850 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-06)

<a id="API-UXD-07"></a>
#### API-UXD-07 · `DELETE /api/admin/uxd/branding/draft`

- **Qué hace:** Descartar borrador. Elimina o da de baja un registro de `draft`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.editar`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2851 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-07)

<a id="API-UXD-08"></a>
#### API-UXD-08 · `POST /api/admin/uxd/branding/publish`

- **Qué hace:** Publicar borrador (Idempotency-Key) Publica sobre `publish`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.publicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2852 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-08)

<a id="API-UXD-09"></a>
#### API-UXD-09 · `POST /api/admin/uxd/branding/revert`

- **Qué hace:** Revertir a releaseNumber. Revierte sobre `revert`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.publicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2853 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-09)

<a id="API-UXD-10"></a>
#### API-UXD-10 · `GET /api/admin/uxd/branding/releases`

- **Qué hace:** Historial. Lista, con filtros y paginación, los registros de versiones publicadas del diccionario (`dictionaryReleases`).
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas del diccionario (`dictionaryReleases`) con `total`.
- **Pantallas:** PAN-UXD-01 (Editar y publicar la marca).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2854 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-10)

<a id="API-UXD-12"></a>
#### API-UXD-12 · `GET /api/admin/uxd/branding/assets`

- **Qué hace:** Listar recursos. Lista, con filtros y paginación, los registros de recursos de marca (`brandAssets`).
- **Para qué sirve:** RF-UXD-035: Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública por tenant con hash en el nombre *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recursos de marca (`brandAssets`) con `total`.
- **Pantallas:** PAN-UXD-01 (Editar y publicar la marca).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2856 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-12)

<a id="API-UXD-11"></a>
#### API-UXD-11 · `POST /api/admin/uxd/branding/assets`

- **Qué hace:** Subir recurso (multipart a URL firmada; crea brandAssets en processing) Da de alta un registro de recursos de marca (`brandAssets`).
- **Para qué sirve:** RF-UXD-035: Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública por tenant con hash en el nombre *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.editar`.
- **Recibe:** los datos de recursos de marca (`brandAssets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de recursos de marca (`brandAssets`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2855 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-11)

<a id="API-UXD-13"></a>
#### API-UXD-13 · `DELETE /api/admin/uxd/branding/assets/{id}`

- **Qué hace:** Baja lógica si no está referenciado. Elimina o da de baja un registro de recursos de marca (`brandAssets`).
- **Para qué sirve:** RF-UXD-035: Aislamiento: un recurso de marca solo se sirve para su tenant; URL firmadas para recursos no públicos; recursos públicos (logo, ícono, splash, fondo de login) servidos desde ruta pública por tenant con hash en el nombre *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2857 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-13)

<a id="API-UXD-14"></a>
#### API-UXD-14 · `POST /api/admin/uxd/branding/contrast-check`

- **Qué hace:** Calcula derivados y contraste de colores arbitrarios. Registra un nuevo elemento u operación en `contrast-check`.
- **Para qué sirve:** RF-UXD-025: applyBrandingCssVars() pisa en runtime solo las variables de marca (--brand, --brand-accent, --brand-2, --pwa-brand, --pwa-lilac, sus -rgb, --brand-contrast y derivados calculados), el resto hereda *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.marca.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-01 (Editar y publicar la marca).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2858 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-14)

<a id="API-UXD-15"></a>
#### API-UXD-15 · `GET /api/admin/uxd/dictionary/keys`

- **Qué hace:** Catálogo con valor base, valor del tenant y estado. Lista, con filtros y paginación, los registros de claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-179: Catálogo base de claves transversales de servicio (10.9.12): estados canónicos del contrato de M02, etiquetas de dominio de servicio, motivos de baja comunes y por servicio, y tipos de reclamo por servicio (crm.claimType); los… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de claves de diccionario y texto base (`dictionaryKeys`) con `total`.
- **Pantallas:** PAN-UXD-02 (Editar y publicar el diccionario), PAN-UXD-03 (Historial de releases).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2859 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-15)

<a id="API-UXD-16"></a>
#### API-UXD-16 · `PUT /api/admin/uxd/dictionary/entries/{key}`

- **Qué hace:** Crear/actualizar borrador de entrada (valida RN-UXD-005…009) Reemplaza o configura un registro de textos propios del tenant (`tenantDictionaryEntries`).
- **Para qué sirve:** RF-UXD-167: Los textos personalizables de CoopOnline/ProCoop (VAR_PMOVIL 5, 6, 7, 8, 9, 35, 65; VAR 3157) se reemplazan por claves de diccionario (sección 19) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.editar`.
- **Recibe:** en la ruta `key`; los datos de textos propios del tenant (`tenantDictionaryEntries`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de textos propios del tenant (`tenantDictionaryEntries`).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2860 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-16)

<a id="API-UXD-17"></a>
#### API-UXD-17 · `DELETE /api/admin/uxd/dictionary/entries/{key}`

- **Qué hace:** Borrador de vuelta al base. Elimina o da de baja un registro de textos propios del tenant (`tenantDictionaryEntries`).
- **Para qué sirve:** RF-UXD-151: Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.editar`.
- **Recibe:** en la ruta `key`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2861 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-17)

<a id="API-UXD-18"></a>
#### API-UXD-18 · `POST /api/admin/uxd/dictionary/publish`

- **Qué hace:** Publicar borradores con nota. Publica sobre `publish`.
- **Para qué sirve:** RF-UXD-034: Publicación versionada de la marca: borrador → publicado; versión anterior recuperable con un clic (reversión) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.publicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2862 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-18)

<a id="API-UXD-19"></a>
#### API-UXD-19 · `POST /api/admin/uxd/dictionary/revert`

- **Qué hace:** Revertir a release k. Revierte sobre `revert`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.revertir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2863 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-19)

<a id="API-UXD-20"></a>
#### API-UXD-20 · `GET /api/admin/uxd/site-map`

- **Qué hace:** Árbol filtrado para el usuario con labels resueltos y badges (9.10) Consulta `site-map`.
- **Para qué sirve:** RF-UXD-175: Etiquetas de clusters, grupos e ítems resueltas por diccionario (nav.*) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2864 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-20)

<a id="API-UXD-21"></a>
#### API-UXD-21 · `GET /api/admin/uxd/dictionary/releases`

- **Qué hace:** Historial y diferencias. Lista, con filtros y paginación, los registros de versiones publicadas del diccionario (`dictionaryReleases`).
- **Para qué sirve:** RF-UXD-151: Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas del diccionario (`dictionaryReleases`) con `total`.
- **Pantallas:** PAN-UXD-02 (Editar y publicar el diccionario), PAN-UXD-03 (Historial de releases).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2865 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-21)

<a id="API-UXD-21-b"></a>
#### API-UXD-21-b · `GET /api/admin/uxd/dictionary/releases/{n}/diff/{m}`

- **Qué hace:** Historial y diferencias. Obtiene el detalle de un registro de versiones publicadas del diccionario (`dictionaryReleases`).
- **Para qué sirve:** RF-UXD-151: Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.ver`.
- **Recibe:** en la ruta `n`, `m`.
- **Devuelve:** 200: el registro de versiones publicadas del diccionario (`dictionaryReleases`).
- **Pantallas:** PAN-UXD-02 (Editar y publicar el diccionario), PAN-UXD-03 (Historial de releases).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2865 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-21-b)

<a id="API-UXD-22"></a>
#### API-UXD-22 · `GET /api/admin/uxd/dictionary/export`

- **Qué hace:** Exportar. Descarga un archivo de `export`.
- **Para qué sirve:** RF-UXD-165: Importar/exportar diccionario (XLSX con ExcelImportWizard, JSON) y copiar desde plantilla (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") · RF-UXD-161: Documentos, reportes, exportaciones y plantillas de comunicación usan el diccionario del canal correspondiente y congelan la versión usada al generarse *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.exportar`.
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2866 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-22)

<a id="API-UXD-23"></a>
#### API-UXD-23 · `POST /api/admin/uxd/dictionary/import`

- **Qué hace:** Importación con ExcelImportWizard. Importa sobre `import`.
- **Para qué sirve:** RF-UXD-165: Importar/exportar diccionario (XLSX con ExcelImportWizard, JSON) y copiar desde plantilla (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2867 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-23)

<a id="API-UXD-23-b"></a>
#### API-UXD-23-b · `POST /api/admin/uxd/dictionary/preview`

- **Qué hace:** Importación con ExcelImportWizard. Previsualiza sin efectos sobre `preview`.
- **Para qué sirve:** RF-UXD-165: Importar/exportar diccionario (XLSX con ExcelImportWizard, JSON) y copiar desde plantilla (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2867 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-23-b)

<a id="API-UXD-23-c"></a>
#### API-UXD-23-c · `POST /api/admin/uxd/dictionary/confirm`

- **Qué hace:** Importación con ExcelImportWizard. Confirma sobre `confirm`.
- **Para qué sirve:** RF-UXD-165: Importar/exportar diccionario (XLSX con ExcelImportWizard, JSON) y copiar desde plantilla (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2867 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-23-c)

<a id="API-UXD-24"></a>
#### API-UXD-24 · `POST /api/admin/uxd/dictionary/apply-template`

- **Qué hace:** Copia una plantilla de plataforma como borradores. Registra un nuevo elemento u operación en `apply-template`.
- **Para qué sirve:** RF-UXD-165: Importar/exportar diccionario (XLSX con ExcelImportWizard, JSON) y copiar desde plantilla (diccionarios plantilla de plataforma, ej. "Cooperativa eléctrica", "Cooperativa de agua", "Cooperativa telefónica") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2868 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-24)

<a id="API-UXD-25"></a>
#### API-UXD-25 · `GET /api/admin/uxd/dictionary/usage/{key}`

- **Qué hace:** Dónde se usa (pantallas y claves que referencian el término) Obtiene el detalle de un registro de `usage`.
- **Para qué sirve:** RF-UXD-150: Distinguir término de negocio reutilizado de texto específico de pantalla (las etiquetas referencian términos) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.diccionario.ver`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-02 (Editar y publicar el diccionario), PAN-UXD-03 (Historial de releases).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2869 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-25)

<a id="API-UXD-26"></a>
#### API-UXD-26 · `POST /api/uxd/dictionary/missing`

- **Qué hace:** Reporte de clave faltante. Registra un nuevo elemento u operación en `missing`.
- **Para qué sirve:** RF-UXD-158: Detección de claves faltantes en nuevas funciones: en CI (clave usada sin entrada en catálogo) y en runtime (registro en dictionaryMissingKeys) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2870 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-26)

<a id="API-UXD-27"></a>
#### API-UXD-27 · `GET /api/admin/uxd/help/{screenId}`

- **Qué hace:** Ayuda contextual (base + override) Obtiene el detalle de un registro de `help`.
- **Para qué sirve:** RF-UXD-144: Catálogo base de conceptos y textos con clave estable, tipo (term/label/message/help/legal), descripción funcional y contexto *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.ayuda.editar`.
- **Recibe:** en la ruta `screenId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-06 (Sobrescribir ayudas contextuales).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2871 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-27)

<a id="API-UXD-27-b"></a>
#### API-UXD-27-b · `PUT /api/admin/uxd/help/{screenId}`

- **Qué hace:** Ayuda contextual (base + override) Reemplaza o configura un registro de `help`.
- **Para qué sirve:** RF-UXD-144: Catálogo base de conceptos y textos con clave estable, tipo (term/label/message/help/legal), descripción funcional y contexto *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.ayuda.editar`.
- **Recibe:** en la ruta `screenId`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-06 (Sobrescribir ayudas contextuales).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2871 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-27-b)

<a id="API-UXD-28"></a>
#### API-UXD-28 · `GET /api/admin/uxd/flags`

- **Qué hace:** Flags del tenant. Consulta `flags`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.flags.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-07 (Flags de UI del tenant).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2872 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-28)

<a id="API-UXD-28-b"></a>
#### API-UXD-28-b · `PUT /api/admin/uxd/flags`

- **Qué hace:** Flags del tenant. Reemplaza o configura `flags`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.flags.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-07 (Flags de UI del tenant).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2872 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-28-b)

<a id="API-UXD-28-c"></a>
#### API-UXD-28-c · `GET /api/admin/uxd/flags/{key}`

- **Qué hace:** Flags del tenant. Obtiene el detalle de un registro de `flags`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.flags.configurar`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-07 (Flags de UI del tenant).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2872 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-28-c)

<a id="API-UXD-28-d"></a>
#### API-UXD-28-d · `PUT /api/admin/uxd/flags/{key}`

- **Qué hace:** Flags del tenant. Reemplaza o configura un registro de `flags`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.flags.configurar`.
- **Recibe:** en la ruta `key`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-07 (Flags de UI del tenant).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2872 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-28-d)

<a id="API-UXD-29"></a>
#### API-UXD-29 · `GET /api/admin/uxd/pwa-nav/{role}`

- **Qué hace:** Navegación PWA por rol. Obtiene el detalle de un registro de `pwa-nav`.
- **Para qué sirve:** RF-UXD-177: Configuración por tenant de la navegación de la PWA por rol: 2 enlaces de tabbar, accesos rápidos de Inicio, orden del menú hamburguesa, ítems ocultos (sin otorgar permisos) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.navegacion.configurar`.
- **Recibe:** en la ruta `role`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-05 (Navegación de la PWA por rol y accesos sugeridos del admin por rol).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2873 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-29)

<a id="API-UXD-29-b"></a>
#### API-UXD-29-b · `PUT /api/admin/uxd/pwa-nav/{role}`

- **Qué hace:** Navegación PWA por rol. Reemplaza o configura un registro de `pwa-nav`.
- **Para qué sirve:** RF-UXD-177: Configuración por tenant de la navegación de la PWA por rol: 2 enlaces de tabbar, accesos rápidos de Inicio, orden del menú hamburguesa, ítems ocultos (sin otorgar permisos) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.navegacion.configurar`.
- **Recibe:** en la ruta `role`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-05 (Navegación de la PWA por rol y accesos sugeridos del admin por rol).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2873 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-29-b)

<a id="API-UXD-30"></a>
#### API-UXD-30 · `GET /api/me/ui-preferences`

- **Qué hace:** Preferencias del usuario (tema, densidad, fijados, recientes, feed) Lista, con filtros y paginación, los registros de preferencias de UI por usuario (`userUiPreferences`).
- **Para qué sirve:** RF-UXD-176: Preferencias del usuario: tema (si política lo permite), densidad, tamaño de texto, reducción de movimiento, accesos fijados, recientes (últimos 10), vistas guardadas, modo de feed (carrusel/lista) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de preferencias de UI por usuario (`userUiPreferences`) con `total`.
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2874 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-30)

<a id="API-UXD-30-b"></a>
#### API-UXD-30-b · `PUT /api/me/ui-preferences`

- **Qué hace:** Preferencias del usuario (tema, densidad, fijados, recientes, feed) Reemplaza o configura preferencias de UI por usuario (`userUiPreferences`).
- **Para qué sirve:** RF-UXD-176: Preferencias del usuario: tema (si política lo permite), densidad, tamaño de texto, reducción de movimiento, accesos fijados, recientes (últimos 10), vistas guardadas, modo de feed (carrusel/lista) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `iam.sesion.autenticada`.
- **Recibe:** los datos de preferencias de UI por usuario (`userUiPreferences`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de preferencias de UI por usuario (`userUiPreferences`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2874 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-30-b)

<a id="API-UXD-31"></a>
#### API-UXD-31 · `GET /api/admin/uxd/table-views`

- **Qué hace:** Vistas guardadas de DataTable. Lista, con filtros y paginación, los registros de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vistas de grilla por usuario o compartidas (`dataTableViews`) con `total`.
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31)

<a id="API-UXD-31-c"></a>
#### API-UXD-31-c · `PUT /api/admin/uxd/table-views`

- **Qué hace:** Vistas guardadas de DataTable. Reemplaza o configura vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** los datos de vistas de grilla por usuario o compartidas (`dataTableViews`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-c)

<a id="API-UXD-31-b"></a>
#### API-UXD-31-b · `POST /api/admin/uxd/table-views`

- **Qué hace:** Vistas guardadas de DataTable. Da de alta un registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** los datos de vistas de grilla por usuario o compartidas (`dataTableViews`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-b)

<a id="API-UXD-31-d"></a>
#### API-UXD-31-d · `DELETE /api/admin/uxd/table-views`

- **Qué hace:** Vistas guardadas de DataTable. Elimina o da de baja un registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-d)

<a id="API-UXD-31-e"></a>
#### API-UXD-31-e · `GET /api/admin/uxd/table-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable. Obtiene el detalle de un registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-e)

<a id="API-UXD-31-f"></a>
#### API-UXD-31-f · `PUT /api/admin/uxd/table-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable. Reemplaza o configura un registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** en la ruta `id`; los datos de vistas de grilla por usuario o compartidas (`dataTableViews`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-f)

<a id="API-UXD-31-g"></a>
#### API-UXD-31-g · `DELETE /api/admin/uxd/table-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable. Elimina o da de baja un registro de vistas de grilla por usuario o compartidas (`dataTableViews`).
- **Para qué sirve:** RF-UXD-082: Construir DataTable genérico: columnas configurables (mostrar/ocultar/reordenar/ancho), orden multi-columna, filtros por columna y globales, paginación servidor ?page=&size=, selección masiva con acciones, exportar XLSX/CSV/PDF… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `uxd.vistas.compartir`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2875 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-31-g)

<a id="API-UXD-32"></a>
#### API-UXD-32 · `GET /api/uxd/site-map`

- **Qué hace:** Menú PWA filtrado por rol. Consulta `site-map`.
- **Para qué sirve:** RF-UXD-121: Bloqueo de sesión por inactividad con aviso previo de 60 s y conservación del trabajo en borrador *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2876 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-32)

<a id="API-UXD-33"></a>
#### API-UXD-33 · `GET /api/platform/uxd/dictionary-keys`

- **Qué hace:** Catálogo de producto y plantillas. Lista, con filtros y paginación, los registros de claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-166: Nombres de servicios, planes, productos, conceptos y categorías no son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de claves de diccionario y texto base (`dictionaryKeys`) con `total`.
- **Pantallas:** PAN-UXD-09 (Catálogo de claves del producto).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2877 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-33)

<a id="API-UXD-33-b"></a>
#### API-UXD-33-b · `PUT /api/platform/uxd/dictionary-keys`

- **Qué hace:** Catálogo de producto y plantillas. Reemplaza o configura claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-166: Nombres de servicios, planes, productos, conceptos y categorías no son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.editar`.
- **Recibe:** los datos de claves de diccionario y texto base (`dictionaryKeys`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de claves de diccionario y texto base (`dictionaryKeys`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2877 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-33-b)

<a id="API-UXD-33-c"></a>
#### API-UXD-33-c · `POST /api/platform/uxd/dictionary-keys`

- **Qué hace:** Catálogo de producto y plantillas. Da de alta un registro de claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-166: Nombres de servicios, planes, productos, conceptos y categorías no son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.editar`.
- **Recibe:** los datos de claves de diccionario y texto base (`dictionaryKeys`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de claves de diccionario y texto base (`dictionaryKeys`).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2877 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-33-c)

<a id="API-UXD-33-d"></a>
#### API-UXD-33-d · `POST /api/platform/uxd/dictionary-keys/publish`

- **Qué hace:** Catálogo de producto y plantillas. Publica sobre claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-166: Nombres de servicios, planes, productos, conceptos y categorías no son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2877 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-33-d)

<a id="API-UXD-33-e"></a>
#### API-UXD-33-e · `POST /api/platform/uxd/dictionary-keys/templates`

- **Qué hace:** Catálogo de producto y plantillas. Registra un nuevo elemento u operación en claves de diccionario y texto base (`dictionaryKeys`).
- **Para qué sirve:** RF-UXD-166: Nombres de servicios, planes, productos, conceptos y categorías no son claves de diccionario: son datos del catálogo (M02) con su propio nombre editable; el diccionario solo cubre etiquetas genéricas ("Servicio", "Plan") *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2877 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-33-e)

<a id="API-UXD-34"></a>
#### API-UXD-34 · `GET /api/platform/uxd/dictionary-missing`

- **Qué hace:** Faltantes de todos los tenants (sin datos personales) Consulta `dictionary-missing`.
- **Para qué sirve:** RF-UXD-151: Comenzar con el diccionario base y personalizar progresivamente; el tenant solo guarda diferencias *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.diccionarioBase.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-09 (Catálogo de claves del producto).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2878 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-34)

<a id="API-UXD-35"></a>
#### API-UXD-35 · `GET /api/platform/uxd/flags`

- **Qué hace:** Flags globales. Consulta `flags`.
- **Para qué sirve:** RF-UXD-080: Dashboard global de plataforma y dashboard de tenant separados; los indicadores globales no muestran detalle operativo de una cooperativa *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.flags.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-11 (Flags globales).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2879 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-35)

<a id="API-UXD-35-b"></a>
#### API-UXD-35-b · `PUT /api/platform/uxd/flags`

- **Qué hace:** Flags globales. Reemplaza o configura `flags`.
- **Para qué sirve:** RF-UXD-080: Dashboard global de plataforma y dashboard de tenant separados; los indicadores globales no muestran detalle operativo de una cooperativa *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.flags.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-11 (Flags globales).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2879 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-35-b)

<a id="API-UXD-36"></a>
#### API-UXD-36 · `GET /api/platform/uxd/branding/{tenantId}`

- **Qué hace:** Marca de un tenant (lectura) Obtiene el detalle de un registro de `branding`.
- **Para qué sirve:** RF-UXD-037: El paso "Marca" del alta asistida de tenant en plataforma permite proponer logo y colores con IA (solo propone; un humano confirma) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.marca.ver`.
- **Recibe:** en la ruta `tenantId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T03 §11. API, línea 2880 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-36)

<a id="API-UXD-37"></a>
#### API-UXD-37 · `PUT /api/platform/uxd/branding/{tenantId}/draft`

- **Qué hace:** Propuesta de marca en el alta asistida (queda en borrador del tenant) Reemplaza o configura `draft`.
- **Para qué sirve:** RF-UXD-037: El paso "Marca" del alta asistida de tenant en plataforma permite proponer logo y colores con IA (solo propone; un humano confirma) *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `uxd.plataforma.marca.asistir`.
- **Recibe:** en la ruta `tenantId`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T03 §11. API, línea 2881 · [Ver en Swagger](../18-swagger/index.html?api=t03-uxd#/API/API-UXD-37)
