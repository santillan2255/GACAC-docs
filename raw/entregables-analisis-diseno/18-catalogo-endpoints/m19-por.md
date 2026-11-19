# Catálogo de endpoints · M19 · Landing, portal y app del socio (autogestión)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Dar a cada cooperativa (tenant) una presencia digital propia (landing con su marca, noticias, servicios habilitados, consultas públicas, botón de baja) y a cada persona de su comunidad una aplicación única de autogestión (PWA instalable) en la que pueda:

1. Registrarse de forma sencilla sin ser todavía asociado ni tener servicio (BASE §67, REG-001).
2. Vincular, con verificación suficiente, las cuentas y contratos existentes que le pertenecen o que le autorizaron (BASE §25, AGR-006, AGR-007), incluidos los usuarios que ya usaban CoopOnline, sin volver a registrarse (FIC 14.1).
3. Recorrer el ciclo completo de una prestación (BASE §50, AUT-001…006; DEC-005 piloto Internet): contratar con formularios por servicio, coordinar la visita, seguir la instalación, firmar conformidad, consultar consumos y facturas (separadas o agrupadas con apertura por servicio, FAC-011), pagar en línea con confirmación real, reclamar con fotos y seguimiento, suspender, reactivar y dar de baja.
4. Recibir notificaciones, responder encuestas y leer el muro y las novedades de su cooperativa (BASE §46, DEC-008, T09).
5. Actuar en nombre de otro solo con autorización vigente y trazable (AGR-007, ESC-01).
6. Si además es empleado de la cooperativa, acceder en la misma PWA a su espacio de empleado (recibos, vacaciones, licencias) sin mezclar datos (BASE §3 espacios de trabajo; RN-09 VAR_PMOVIL 41, VAR 3122, 3166).

Detalle completo en el anexo M19, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m19-por).

| Dato | Valor |
|---|---|
| Endpoints | 192 |
| Por método | DELETE 5, GET 88, PATCH 2, POST 89, PUT 8 |
| Grupos funcionales | 12 |
| Con requisito citado en el anexo | 44 |
| Con requisito inferido (a confirmar) | 148 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Públicas (landing, sin login)](#grupo-1) | 24 | Bootstrap público único: API-UXD-01 (T03) y API-PLA-64…; Oferta habilitada (M02); Ficha con planes y precios vigentes (M02/M04)… |
| [Sesión, ámbito e inicio (PWA)](#grupo-2) | 9 | Ámbitos, espacios disponibles, cuentas con acceso, rol de…; Cambia de espacio (socio/empleado); devuelve contexto.; Datos del inicio por rol (tarjetas, banners, acciones)… |
| [Cuentas, accesos y representaciones](#grupo-3) | 12 | Cuentas con acceso vigente.; Detalle de cuenta.; Vincular cuenta (método + datos)… |
| [Servicios, formularios y trámites](#grupo-4) | 16 | Contratos con estado de servicio y trámite en curso.; Detalle de contrato (plan, equipo, adherentes, primer…; Oferta para contratar con condiciones del usuario (aviso de…… |
| [Visitas](#grupo-5) | 7 | Franjas disponibles (M10); Visitas y detalle (ETA, resultado); Reservar.… |
| [Facturas, documentos y pagos](#grupo-6) | 20 | Comprobantes visibles (RN-POR-062); Detalle con apertura por servicio y explicación.; URL firmada del PDF.… |
| [Consumos, autolectura y prepaga](#grupo-7) | 7 | Historial de consumos (M03); URL "Mi Medidor" del proveedor (T06); Ventana vigente y último valor.… |
| [Gestiones, turnos y comunicaciones](#grupo-8) | 16 | Mis gestiones (incluye históricas migradas); Crear reclamo/consulta (M09); Detalle público del caso.… |
| [Portal del empleado](#grupo-9) | 12 | Inicio del empleado.; Recibos (M16); Firmar conformidad/disconformidad (OTP)… |
| [Tótem](#grupo-10) | 5 | Abre sesión de tótem (valida dispositivo y caja); Identificación por socio/cuenta/documento/QR (datos mínimos); Registrar cobro en la caja del dispositivo (M07)… |
| [Administración del portal](#grupo-11) | 44 | Parámetros del portal con vigencia (T04); Borrador de landing.; Revisión, aprobación, programación, publicación, reversión.… |
| [Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01)](#grupo-12) | 20 | Detalle de llamadas del período (PAN-POR-103): llamadas…; Plan de cuotas de obra del contrato, delegado en…; Búsqueda de difuntos delegada en API-SOC-061: nombre y…… |

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

## Públicas (landing, sin login)

24 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-01](#API-POR-01) | GET | `/api/public/{tenantSlug}/bootstrap` | Bootstrap público único: API-UXD-01 (T03) y API-PLA-64 (T01) lo referencian. app = admin, pwa o landing. Payload: de T03, la marca public... |
| [API-POR-02](#API-POR-02) | GET | `/api/public/{tenantSlug}/services` | Oferta habilitada (M02) |
| [API-POR-03](#API-POR-03) | GET | `/api/public/{tenantSlug}/services/{serviceCode}` | Ficha con planes y precios vigentes (M02/M04) |
| [API-POR-04](#API-POR-04) | POST | `/api/public/{tenantSlug}/coverage-checks` | Cobertura preliminar por domicilio (M10) |
| [API-POR-05](#API-POR-05) | GET | `/api/public/{tenantSlug}/streets` | Autocompletado de calles (T04) |
| [API-POR-06](#API-POR-06) | GET | `/api/public/{tenantSlug}/news` | Noticias canal landing (T09) |
| [API-POR-06-b](#API-POR-06-b) | GET | `/api/public/{tenantSlug}/news/{slug}` | Noticias canal landing (T09) |
| [API-POR-07](#API-POR-07) | GET | `/api/public/{tenantSlug}/outages` | Interrupciones programadas. |
| [API-POR-08](#API-POR-08) | GET | `/api/public/{tenantSlug}/forms` | Formularios publicados y PDF. |
| [API-POR-09](#API-POR-09) | GET | `/api/public/{tenantSlug}/forms/{code}/pdf` | URL firmada del PDF del trámite. |
| [API-POR-10](#API-POR-10) | POST | `/api/public/{tenantSlug}/unsubscribe-requests` | Recepción de baja pública; devuelve código. |
| [API-POR-11](#API-POR-11) | POST | `/api/public/{tenantSlug}/unsubscribe-requests/lookup` | Seguimiento por código + documento. |
| [API-POR-12](#API-POR-12) | POST | `/api/public/{tenantSlug}/contact-requests` | Contacto/consulta → caso M09. |
| [API-POR-13](#API-POR-13) | POST | `/api/public/{tenantSlug}/invoice-lookups` | Comprobantes impagos enmascarados por cuenta + verificador. |
| [API-POR-14](#API-POR-14) | POST | `/api/public/{tenantSlug}/guest-checkouts` | Checkout invitado sobre comprobantes de API-POR-13 (M07) |
| [API-POR-15](#API-POR-15) | POST | `/api/public/{tenantSlug}/payment-codes/lookup` | Datos mínimos de un código de pago (pagador eventual) |
| [API-POR-16](#API-POR-16) | POST | `/api/public/{tenantSlug}/payment-codes/checkouts` | Checkout por código de pago. |
| [API-POR-17](#API-POR-17) | GET | `/api/public/{tenantSlug}/legal/{type}` | Documento legal vigente. |
| [API-POR-18](#API-POR-18) | GET | `/api/public/{tenantSlug}/manifest.webmanifest` | Manifest dinámico (T03) |
| [API-POR-19](#API-POR-19) | GET | `/api/public/{tenantSlug}/sitemap.xml` | SEO y RSS. |
| [API-POR-19-b](#API-POR-19-b) | GET | `/api/public/{tenantSlug}/robots.txt` | SEO y RSS. |
| [API-POR-19-c](#API-POR-19-c) | GET | `/api/public/{tenantSlug}/news.rss` | SEO y RSS. |
| [API-POR-20](#API-POR-20) | GET | `/api/public/tenants` | Buscador de cooperativas (plataforma) |
| [API-POR-21](#API-POR-21) | GET | `/api/public/{tenantSlug}/payments/checkouts/{id}/status` | Estado de un checkout invitado. |

<a id="API-POR-01"></a>
#### API-POR-01 · `GET /api/public/{tenantSlug}/bootstrap`

- **Qué hace:** Bootstrap público único: API-UXD-01 (T03) y API-PLA-64 (T01) lo referencian. app = admin, pwa o landing. Payload: de T03, la marca public... Consulta «bootstrap» de un registro de `bootstrap`.
- **Para qué sirve:** RF-POR-001: Cada tenant dispone de una landing propia con su marca (T03), accesible por subdominio <tenantSlug>.<dominioPlataforma> y, opcionalmente, dominio propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1455 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-01)

<a id="API-POR-02"></a>
#### API-POR-02 · `GET /api/public/{tenantSlug}/services`

- **Qué hace:** Oferta habilitada (M02) Consulta «services» de un registro de `services`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1456 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-02)

<a id="API-POR-03"></a>
#### API-POR-03 · `GET /api/public/{tenantSlug}/services/{serviceCode}`

- **Qué hace:** Ficha con planes y precios vigentes (M02/M04) Obtiene el detalle de un registro de `services`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `serviceCode`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1457 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-03)

<a id="API-POR-04"></a>
#### API-POR-04 · `POST /api/public/{tenantSlug}/coverage-checks`

- **Qué hace:** Cobertura preliminar por domicilio (M10) Registra «coverage-checks» sobre un registro de `coverage-checks`.
- **Para qué sirve:** RF-POR-006: Consulta de cobertura/factibilidad preliminar por domicilio sin login, con autocompletado de calles y alternativa sin mapa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1458 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-04)

<a id="API-POR-05"></a>
#### API-POR-05 · `GET /api/public/{tenantSlug}/streets`

- **Qué hace:** Autocompletado de calles (T04) Consulta «streets» de un registro de `streets`.
- **Para qué sirve:** RF-POR-006: Consulta de cobertura/factibilidad preliminar por domicilio sin login, con autocompletado de calles y alternativa sin mapa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1459 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-05)

<a id="API-POR-06"></a>
#### API-POR-06 · `GET /api/public/{tenantSlug}/news`

- **Qué hace:** Noticias canal landing (T09) Consulta «news» de un registro de `news`.
- **Para qué sirve:** RF-POR-007: Noticias públicas (T09, canal landing) en lista y detalle, sin datos privados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1460 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-06)

<a id="API-POR-06-b"></a>
#### API-POR-06-b · `GET /api/public/{tenantSlug}/news/{slug}`

- **Qué hace:** Noticias canal landing (T09) Obtiene el detalle de un registro de `news`.
- **Para qué sirve:** RF-POR-007: Noticias públicas (T09, canal landing) en lista y detalle, sin datos privados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1460 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-06-b)

<a id="API-POR-07"></a>
#### API-POR-07 · `GET /api/public/{tenantSlug}/outages`

- **Qué hace:** Interrupciones programadas. Consulta «outages» de un registro de `outages`.
- **Para qué sirve:** RF-POR-008: Avisos de interrupciones y cortes programados por zona y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1461 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-07)

<a id="API-POR-08"></a>
#### API-POR-08 · `GET /api/public/{tenantSlug}/forms`

- **Qué hace:** Formularios publicados y PDF. Lista, con filtros y paginación, los registros de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de formularios del portal (`portalForms`) con `total`.
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1462 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-08)

<a id="API-POR-09"></a>
#### API-POR-09 · `GET /api/public/{tenantSlug}/forms/{code}/pdf`

- **Qué hace:** URL firmada del PDF del trámite. Descarga un archivo de `pdf`.
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `code`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1463 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-09)

<a id="API-POR-10"></a>
#### API-POR-10 · `POST /api/public/{tenantSlug}/unsubscribe-requests`

- **Qué hace:** Recepción de baja pública; devuelve código. Registra «unsubscribe-requests» sobre un registro de `unsubscribe-requests`.
- **Para qué sirve:** RF-POR-156: Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1464 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-10)

<a id="API-POR-11"></a>
#### API-POR-11 · `POST /api/public/{tenantSlug}/unsubscribe-requests/lookup`

- **Qué hace:** Seguimiento por código + documento. Busca sobre `lookup`.
- **Para qué sirve:** RF-POR-011: Seguimiento público de la baja por código + documento, mostrando solo estado y fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1465 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-11)

<a id="API-POR-12"></a>
#### API-POR-12 · `POST /api/public/{tenantSlug}/contact-requests`

- **Qué hace:** Contacto/consulta → caso M09. Registra «contact-requests» sobre un registro de `contact-requests`.
- **Para qué sirve:** RF-POR-014: Formulario público de contacto/consulta que crea un caso CRM de tipo consulta y notifica a la casilla configurada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1466 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-12)

<a id="API-POR-13"></a>
#### API-POR-13 · `POST /api/public/{tenantSlug}/invoice-lookups`

- **Qué hace:** Comprobantes impagos enmascarados por cuenta + verificador. Registra «invoice-lookups» sobre un registro de `invoice-lookups`.
- **Para qué sirve:** RF-POR-012: Consulta y pago de facturas sin login (opcional por tenant): número de cuenta + dato verificador; muestra solo comprobantes impagos y datos enmascarados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1467 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-13)

<a id="API-POR-14"></a>
#### API-POR-14 · `POST /api/public/{tenantSlug}/guest-checkouts`

- **Qué hace:** Checkout invitado sobre comprobantes de API-POR-13 (M07) Registra «guest-checkouts» sobre un registro de `guest-checkouts`.
- **Para qué sirve:** RF-POR-012: Consulta y pago de facturas sin login (opcional por tenant): número de cuenta + dato verificador; muestra solo comprobantes impagos y datos enmascarados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1468 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-14)

<a id="API-POR-15"></a>
#### API-POR-15 · `POST /api/public/{tenantSlug}/payment-codes/lookup`

- **Qué hace:** Datos mínimos de un código de pago (pagador eventual) Busca sobre `lookup`.
- **Para qué sirve:** RF-POR-100: Pago por representación o pagador eventual; un excedente no se aplica a la deuda de otro titular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1469 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-15)

<a id="API-POR-16"></a>
#### API-POR-16 · `POST /api/public/{tenantSlug}/payment-codes/checkouts`

- **Qué hace:** Checkout por código de pago. Registra un nuevo elemento u operación en `checkouts`.
- **Para qué sirve:** RF-POR-012: Consulta y pago de facturas sin login (opcional por tenant): número de cuenta + dato verificador; muestra solo comprobantes impagos y datos enmascarados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1470 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-16)

<a id="API-POR-17"></a>
#### API-POR-17 · `GET /api/public/{tenantSlug}/legal/{type}`

- **Qué hace:** Documento legal vigente. Obtiene el detalle de un registro de `legal`.
- **Para qué sirve:** RF-POR-011: Seguimiento público de la baja por código + documento, mostrando solo estado y fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `type`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1471 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-17)

<a id="API-POR-18"></a>
#### API-POR-18 · `GET /api/public/{tenantSlug}/manifest.webmanifest`

- **Qué hace:** Manifest dinámico (T03) Consulta «manifest.webmanifest» de un registro de `manifest.webmanifest`.
- **Para qué sirve:** RF-POR-145: PWA instalable con manifest dinámico, splash, ícono y theme-color por tenant; pasos de instalación para iOS. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1472 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-18)

<a id="API-POR-19"></a>
#### API-POR-19 · `GET /api/public/{tenantSlug}/sitemap.xml`

- **Qué hace:** SEO y RSS. Descarga un archivo de `sitemap.xml`.
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un archivo (application/xml).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1473 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-19)

<a id="API-POR-19-b"></a>
#### API-POR-19-b · `GET /api/public/{tenantSlug}/robots.txt`

- **Qué hace:** SEO y RSS. Descarga un archivo de `robots.txt`.
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un archivo (text/plain).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1473 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-19-b)

<a id="API-POR-19-c"></a>
#### API-POR-19-c · `GET /api/public/{tenantSlug}/news.rss`

- **Qué hace:** SEO y RSS. Descarga un archivo de `news.rss`.
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un archivo (application/rss+xml).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1473 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-19-c)

<a id="API-POR-20"></a>
#### API-POR-20 · `GET /api/public/tenants`

- **Qué hace:** Buscador de cooperativas (plataforma) Consulta `tenants`.
- **Para qué sirve:** RF-POR-016: Punto de entrada genérico de plataforma con buscador de cooperativa por nombre o localidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1474 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-20)

<a id="API-POR-21"></a>
#### API-POR-21 · `GET /api/public/{tenantSlug}/payments/checkouts/{id}/status`

- **Qué hace:** Estado de un checkout invitado. Consulta «status» de un registro de `status`.
- **Para qué sirve:** RF-POR-017: Encuesta externa por enlace con token sin login (T09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.1. Públicas (landing, sin login), línea 1475 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/P%C3%BAblicas%20%28landing%2C%20sin%20login%29/API-POR-21)

<a id="grupo-2"></a>

## Sesión, ámbito e inicio (PWA)

9 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-22](#API-POR-22) | GET | `/api/por/me/context` | Ámbitos, espacios disponibles, cuentas con acceso, rol de inicio por cuenta, parámetros del portal, términos pendientes. |
| [API-POR-23](#API-POR-23) | POST | `/api/por/me/space` | Cambia de espacio (socio/empleado); devuelve contexto. |
| [API-POR-24](#API-POR-24) | GET | `/api/por/home` | Datos del inicio por rol (tarjetas, banners, acciones) |
| [API-POR-25](#API-POR-25) | GET | `/api/por/me/preferences` | Preferencias del portal. |
| [API-POR-25-b](#API-POR-25-b) | PUT | `/api/por/me/preferences` | Preferencias del portal. |
| [API-POR-26](#API-POR-26) | POST | `/api/por/me/terms-acceptances` | Aceptar versión de términos. |
| [API-POR-27](#API-POR-27) | GET | `/api/por/me/profile` | Perfil; PATCH de contacto inicia verificación (T02) |
| [API-POR-27-b](#API-POR-27-b) | PATCH | `/api/por/me/profile` | Perfil; PATCH de contacto inicia verificación (T02) |
| [API-POR-28](#API-POR-28) | POST | `/api/por/legacy-activations` | Inicio de activación de usuario migrado (envía OTP) |

<a id="API-POR-22"></a>
#### API-POR-22 · `GET /api/por/me/context`

- **Qué hace:** Ámbitos, espacios disponibles, cuentas con acceso, rol de inicio por cuenta, parámetros del portal, términos pendientes. Consulta `context`.
- **Para qué sirve:** RF-POR-149: Configuración del portal por tenant (parámetros del §14) con vigencia y auditoría (T04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1481 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-22)

<a id="API-POR-23"></a>
#### API-POR-23 · `POST /api/por/me/space`

- **Qué hace:** Cambia de espacio (socio/empleado); devuelve contexto. Registra un nuevo elemento u operación en `space`.
- **Para qué sirve:** RF-POR-028: Espacios dentro del tenant (socio, empleado, campo) con selector cuando la persona tiene más de uno; cada espacio tiene menú, inicio y almacén de datos propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1482 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-23)

<a id="API-POR-24"></a>
#### API-POR-24 · `GET /api/por/home`

- **Qué hace:** Datos del inicio por rol (tarjetas, banners, acciones) Consulta `home`.
- **Para qué sirve:** RF-POR-144: Patrones CNX: 3 skeleton cards en cargas, estados vacíos con acción, pull-to-refresh, banner único de pendientes sin conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1483 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-24)

<a id="API-POR-25"></a>
#### API-POR-25 · `GET /api/por/me/preferences`

- **Qué hace:** Preferencias del portal. Lista, con filtros y paginación, los registros de preferencias del usuario (`portalUserPreferences`).
- **Para qué sirve:** RF-POR-032: Cierre de sesión por inactividad configurable y "cerrar sesión en todos los dispositivos" (T02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.preferencias.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de preferencias del usuario (`portalUserPreferences`) con `total`.
- **Pantallas:** PAN-POR-62 (Apariencia).
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-25)

<a id="API-POR-25-b"></a>
#### API-POR-25-b · `PUT /api/por/me/preferences`

- **Qué hace:** Preferencias del portal. Reemplaza o configura preferencias del usuario (`portalUserPreferences`).
- **Para qué sirve:** RF-POR-032: Cierre de sesión por inactividad configurable y "cerrar sesión en todos los dispositivos" (T02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.preferencias.editar`.
- **Recibe:** los datos de preferencias del usuario (`portalUserPreferences`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de preferencias del usuario (`portalUserPreferences`).
- **Pantallas:** PAN-POR-62 (Apariencia).
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-25-b)

<a id="API-POR-26"></a>
#### API-POR-26 · `POST /api/por/me/terms-acceptances`

- **Qué hace:** Aceptar versión de términos. Registra un nuevo elemento u operación en `terms-acceptances`.
- **Para qué sirve:** RF-POR-029: Aceptación versionada de términos y privacidad al registrarse y al publicarse una nueva versión (guard de router). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1485 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-26)

<a id="API-POR-27"></a>
#### API-POR-27 · `GET /api/por/me/profile`

- **Qué hace:** Perfil; PATCH de contacto inicia verificación (T02) Consulta `profile`.
- **Para qué sirve:** RF-POR-038: Si la verificación es insuficiente, se deniega y se ofrece el circuito de acreditación (presencial, envío de documentación, contacto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.perfil.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-59 (Mi perfil).
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-27)

<a id="API-POR-27-b"></a>
#### API-POR-27-b · `PATCH /api/por/me/profile`

- **Qué hace:** Perfil; PATCH de contacto inicia verificación (T02) Modifica algunos campos de un registro de `profile` (solo los enviados).
- **Para qué sirve:** RF-POR-038: Si la verificación es insuficiente, se deniega y se ofrece el circuito de acreditación (presencial, envío de documentación, contacto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.perfil.editar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-59 (Mi perfil).
- **Ola:** O2 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-27-b)

<a id="API-POR-28"></a>
#### API-POR-28 · `POST /api/por/legacy-activations`

- **Qué hace:** Inicio de activación de usuario migrado (envía OTP) Registra un nuevo elemento u operación en `legacy-activations`.
- **Para qué sirve:** RF-POR-173: Invitar a los usuarios migrados por correo/celular a activar su acceso, con plantilla del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M19 §11.2. Sesión, ámbito e inicio (PWA), línea 1487 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Sesi%C3%B3n%2C%20%C3%A1mbito%20e%20inicio%20%28PWA%29/API-POR-28)

<a id="grupo-3"></a>

## Cuentas, accesos y representaciones

12 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-29](#API-POR-29) | GET | `/api/por/accounts` | Cuentas con acceso vigente. |
| [API-POR-30](#API-POR-30) | GET | `/api/por/accounts/{accountId}` | Detalle de cuenta. |
| [API-POR-31](#API-POR-31) | POST | `/api/por/account-links` | Vincular cuenta (método + datos) |
| [API-POR-32](#API-POR-32) | POST | `/api/por/account-links/assisted` | Solicitar vinculación asistida o canjear código de invitación. |
| [API-POR-33](#API-POR-33) | DELETE | `/api/por/account-access/{accessId}` | Desvincularse. |
| [API-POR-34](#API-POR-34) | PATCH | `/api/por/account-access/{accessId}/default` | Marcar cuenta por defecto. |
| [API-POR-35](#API-POR-35) | GET | `/api/por/delegations` | Representaciones otorgadas y recibidas. |
| [API-POR-36](#API-POR-36) | POST | `/api/por/delegations` | Crear invitación. |
| [API-POR-37](#API-POR-37) | POST | `/api/por/delegations/accept` | Aceptar/rechazar invitación por token. |
| [API-POR-38](#API-POR-38) | DELETE | `/api/por/delegations/{id}` | Revocar/renunciar. |
| [API-POR-39](#API-POR-39) | POST | `/api/por/account-access/{accessId}/confirm` | Confirmar acceso pendienteConfirmacionTitular. |
| [API-POR-40](#API-POR-40) | POST | `/api/por/account-access/{accessId}/report` | "No fui yo": revoca y abre alerta. |

<a id="API-POR-29"></a>
#### API-POR-29 · `GET /api/por/accounts`

- **Qué hace:** Cuentas con acceso vigente. Consulta `accounts`.
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1493 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-29)

<a id="API-POR-30"></a>
#### API-POR-30 · `GET /api/por/accounts/{accountId}`

- **Qué hace:** Detalle de cuenta. Obtiene el detalle de un registro de `accounts`.
- **Para qué sirve:** RF-POR-082: Si el tenant agrupa, mostrar el resumen de cuenta corriente sin perder el detalle por factura y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.ver`.
- **Recibe:** en la ruta `accountId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-28 (Detalle de cuenta), PAN-POR-29 (Mis servicios), PAN-POR-30 (Detalle de servicio).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1494 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-30)

<a id="API-POR-31"></a>
#### API-POR-31 · `POST /api/por/account-links`

- **Qué hace:** Vincular cuenta (método + datos) Registra un nuevo elemento u operación en `account-links`.
- **Para qué sirve:** RF-POR-041: "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. · RF-POR-040: Aviso al titular (por sus canales verificados) de toda nueva vinculación o representación sobre su cuenta, con opción de revocarla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.cuentas.vincular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-27 (Vincular cuenta), PAN-IAM-32 (Vinculación de cuenta del socio).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1495 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-31)

<a id="API-POR-32"></a>
#### API-POR-32 · `POST /api/por/account-links/assisted`

- **Qué hace:** Solicitar vinculación asistida o canjear código de invitación. Registra un nuevo elemento u operación en `assisted`.
- **Para qué sirve:** RF-POR-037: Vinculación asistida: un operador emite desde admin un código de invitación de un solo uso para una cuenta y una persona identificada presencialmente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.cuentas.vincular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-27 (Vincular cuenta), PAN-IAM-32 (Vinculación de cuenta del socio).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1496 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-32)

<a id="API-POR-33"></a>
#### API-POR-33 · `DELETE /api/por/account-access/{accessId}`

- **Qué hace:** Desvincularse. Elimina o da de baja un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-041: "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** en la ruta `accessId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1497 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-33)

<a id="API-POR-34"></a>
#### API-POR-34 · `PATCH /api/por/account-access/{accessId}/default`

- **Qué hace:** Marcar cuenta por defecto. Modifica algunos campos de un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`) (solo los enviados).
- **Para qué sirve:** RF-POR-041: "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** en la ruta `accessId`; solo los campos a cambiar de vínculo usuario del portal–cuenta (`portalAccountAccess`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1498 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-34)

<a id="API-POR-35"></a>
#### API-POR-35 · `GET /api/por/delegations`

- **Qué hace:** Representaciones otorgadas y recibidas. Consulta `delegations`.
- **Para qué sirve:** RF-POR-043: Representaciones: el titular invita a otra persona (por correo/celular/DNI) con acciones y vigencia; la persona acepta; el titular puede revocar; al vencer se retira el acceso. · RF-POR-041: "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.representaciones.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-57 (Representaciones y autorizados), PAN-POR-58 (Invitación de representación).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1499 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-35)

<a id="API-POR-36"></a>
#### API-POR-36 · `POST /api/por/delegations`

- **Qué hace:** Crear invitación. Registra un nuevo elemento u operación en `delegations`.
- **Para qué sirve:** RF-POR-043: Representaciones: el titular invita a otra persona (por correo/celular/DNI) con acciones y vigencia; la persona acepta; el titular puede revocar; al vencer se retira el acceso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.representaciones.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-57 (Representaciones y autorizados), PAN-POR-58 (Invitación de representación).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1500 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-36)

<a id="API-POR-37"></a>
#### API-POR-37 · `POST /api/por/delegations/accept`

- **Qué hace:** Aceptar/rechazar invitación por token. Acepta sobre `accept`.
- **Para qué sirve:** RF-POR-043: Representaciones: el titular invita a otra persona (por correo/celular/DNI) con acciones y vigencia; la persona acepta; el titular puede revocar; al vencer se retira el acceso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O5 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1501 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-37)

<a id="API-POR-38"></a>
#### API-POR-38 · `DELETE /api/por/delegations/{id}`

- **Qué hace:** Revocar/renunciar. Elimina o da de baja un registro de `delegations`.
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1502 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-38)

<a id="API-POR-39"></a>
#### API-POR-39 · `POST /api/por/account-access/{accessId}/confirm`

- **Qué hace:** Confirmar acceso pendienteConfirmacionTitular. Confirma un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-094: Estados visibles del pago: generado, pendiente de confirmación, confirmado, imputado, comprobante enviado, rechazado; el retorno de la pasarela nunca confirma por sí solo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.representaciones.gestionar`.
- **Recibe:** en la ruta `accessId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-57 (Representaciones y autorizados), PAN-POR-58 (Invitación de representación).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1503 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-39)

<a id="API-POR-40"></a>
#### API-POR-40 · `POST /api/por/account-access/{accessId}/report`

- **Qué hace:** "No fui yo": revoca y abre alerta. Registra «report» sobre un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-040: Aviso al titular (por sus canales verificados) de toda nueva vinculación o representación sobre su cuenta, con opción de revocarla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.representaciones.gestionar`.
- **Recibe:** en la ruta `accessId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-57 (Representaciones y autorizados), PAN-POR-58 (Invitación de representación).
- **Ola:** O2 · **Fuente:** M19 §11.3. Cuentas, accesos y representaciones, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Cuentas%2C%20accesos%20y%20representaciones/API-POR-40)

<a id="grupo-4"></a>

## Servicios, formularios y trámites

16 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-41](#API-POR-41) | GET | `/api/por/contracts` | Contratos con estado de servicio y trámite en curso. |
| [API-POR-42](#API-POR-42) | GET | `/api/por/contracts/{contractId}` | Detalle de contrato (plan, equipo, adherentes, primer cobro, DDJJ) |
| [API-POR-43](#API-POR-43) | GET | `/api/por/catalog` | Oferta para contratar con condiciones del usuario (aviso de deuda, PRM-POR-071) |
| [API-POR-44](#API-POR-44) | GET | `/api/por/forms/{code}` | Definición vigente del formulario y prellenado. |
| [API-POR-45](#API-POR-45) | GET | `/api/por/drafts` | Borradores. |
| [API-POR-45-b](#API-POR-45-b) | GET | `/api/por/drafts/{id}` | Borradores. |
| [API-POR-45-c](#API-POR-45-c) | PUT | `/api/por/drafts/{id}` | Borradores. |
| [API-POR-45-d](#API-POR-45-d) | DELETE | `/api/por/drafts/{id}` | Borradores. |
| [API-POR-46](#API-POR-46) | POST | `/api/por/uploads` | Subida de adjunto a almacenamiento privado (URL firmada de subida) |
| [API-POR-47](#API-POR-47) | POST | `/api/por/form-submissions` | Enviar presentación → caso M09. |
| [API-POR-48](#API-POR-48) | GET | `/api/por/form-submissions/{id}` | Presentación y constancia. |
| [API-POR-49](#API-POR-49) | POST | `/api/por/form-submissions/{id}/responses` | Responder observación. |
| [API-POR-50](#API-POR-50) | POST | `/api/por/form-submissions/{id}/cancel` | Cancelar. |
| [API-POR-51](#API-POR-51) | POST | `/api/por/contracts/{contractId}/change-quotes` | Condiciones de baja/suspensión/reactivación/cambio de plan (M08/M02) |
| [API-POR-52](#API-POR-52) | POST | `/api/por/contracts/{contractId}/adherent-checks` | Validar adherente (GetInfoAdherente) |
| [API-POR-53](#API-POR-53) | GET | `/api/por/contracts/{contractId}/appliance-declarations` | DDJJ vigente e histórica. |

<a id="API-POR-41"></a>
#### API-POR-41 · `GET /api/por/contracts`

- **Qué hace:** Contratos con estado de servicio y trámite en curso. Consulta `contracts`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-28 (Detalle de cuenta), PAN-POR-29 (Mis servicios), PAN-POR-30 (Detalle de servicio).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1510 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-41)

<a id="API-POR-42"></a>
#### API-POR-42 · `GET /api/por/contracts/{contractId}`

- **Qué hace:** Detalle de contrato (plan, equipo, adherentes, primer cobro, DDJJ) Obtiene el detalle de un registro de `contracts`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-28 (Detalle de cuenta), PAN-POR-29 (Mis servicios), PAN-POR-30 (Detalle de servicio).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1511 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-42)

<a id="API-POR-43"></a>
#### API-POR-43 · `GET /api/por/catalog`

- **Qué hace:** Oferta para contratar con condiciones del usuario (aviso de deuda, PRM-POR-071) Consulta `catalog`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.contratar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-31 (Contratar un servicio).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-43)

<a id="API-POR-44"></a>
#### API-POR-44 · `GET /api/por/forms/{code}`

- **Qué hace:** Definición vigente del formulario y prellenado. Obtiene el detalle de un registro de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de formularios del portal (`portalForms`).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1513 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-44)

<a id="API-POR-45"></a>
#### API-POR-45 · `GET /api/por/drafts`

- **Qué hace:** Borradores. Lista, con filtros y paginación, los registros de borradores; TTL expiresAt (`portalDrafts`).
- **Para qué sirve:** RF-POR-172: Importar formularios de trámite (REQUISITOS/REQUISITOS_ITEMS) como borradores de formularios para revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.borradores.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de borradores; TTL expiresAt (`portalDrafts`) con `total`.
- **Pantallas:** PAN-POR-63 (Borradores).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-45)

<a id="API-POR-45-b"></a>
#### API-POR-45-b · `GET /api/por/drafts/{id}`

- **Qué hace:** Borradores. Obtiene el detalle de un registro de borradores; TTL expiresAt (`portalDrafts`).
- **Para qué sirve:** RF-POR-172: Importar formularios de trámite (REQUISITOS/REQUISITOS_ITEMS) como borradores de formularios para revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.borradores.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de borradores; TTL expiresAt (`portalDrafts`).
- **Pantallas:** PAN-POR-63 (Borradores).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-45-b)

<a id="API-POR-45-c"></a>
#### API-POR-45-c · `PUT /api/por/drafts/{id}`

- **Qué hace:** Borradores. Reemplaza o configura un registro de borradores; TTL expiresAt (`portalDrafts`).
- **Para qué sirve:** RF-POR-172: Importar formularios de trámite (REQUISITOS/REQUISITOS_ITEMS) como borradores de formularios para revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.borradores.gestionar`.
- **Recibe:** en la ruta `id`; los datos de borradores; TTL expiresAt (`portalDrafts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de borradores; TTL expiresAt (`portalDrafts`).
- **Pantallas:** PAN-POR-63 (Borradores).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-45-c)

<a id="API-POR-45-d"></a>
#### API-POR-45-d · `DELETE /api/por/drafts/{id}`

- **Qué hace:** Borradores. Elimina o da de baja un registro de borradores; TTL expiresAt (`portalDrafts`).
- **Para qué sirve:** RF-POR-172: Importar formularios de trámite (REQUISITOS/REQUISITOS_ITEMS) como borradores de formularios para revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.borradores.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-63 (Borradores).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-45-d)

<a id="API-POR-46"></a>
#### API-POR-46 · `POST /api/por/uploads`

- **Qué hace:** Subida de adjunto a almacenamiento privado (URL firmada de subida) Registra un nuevo elemento u operación en `uploads`.
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1515 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-46)

<a id="API-POR-47"></a>
#### API-POR-47 · `POST /api/por/form-submissions`

- **Qué hace:** Enviar presentación → caso M09. Da de alta un registro de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-061: Al enviar se crea el caso CRM (M09) de tipo solicitud de alta con su número y una constancia descargable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** los datos de envíos de formularios (`portalFormSubmissions`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de envíos de formularios (`portalFormSubmissions`).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1516 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-47)

<a id="API-POR-48"></a>
#### API-POR-48 · `GET /api/por/form-submissions/{id}`

- **Qué hace:** Presentación y constancia. Obtiene el detalle de un registro de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-087: Constancias descargables: libre deuda, constancia de alta, constancia de baja, constancia de trámite, certificado de servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de envíos de formularios (`portalFormSubmissions`).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1517 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-48)

<a id="API-POR-49"></a>
#### API-POR-49 · `POST /api/por/form-submissions/{id}/responses`

- **Qué hace:** Responder observación. Registra «responses» sobre un registro de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-063: Responder observaciones del operador: aportar documentación faltante o corregir datos sin rehacer el trámite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1518 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-49)

<a id="API-POR-50"></a>
#### API-POR-50 · `POST /api/por/form-submissions/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-062: Seguimiento del trámite con línea de tiempo: recibido, en revisión, observado, factibilidad, aprobado, visita coordinada, instalado, servicio activo / rechazado / cancelado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1519 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-50)

<a id="API-POR-51"></a>
#### API-POR-51 · `POST /api/por/contracts/{contractId}/change-quotes`

- **Qué hace:** Condiciones de baja/suspensión/reactivación/cambio de plan (M08/M02) Registra «change-quotes» sobre un registro de `change-quotes`.
- **Para qué sirve:** RF-POR-066: Solicitar suspensión temporal y reactivación mostrando condiciones, costos habilitados y efectos antes de confirmar; registrar aceptación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `contractId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O6 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1520 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-51)

<a id="API-POR-52"></a>
#### API-POR-52 · `POST /api/por/contracts/{contractId}/adherent-checks`

- **Qué hace:** Validar adherente (GetInfoAdherente) Registra «adherent-checks» sobre un registro de `adherent-checks`.
- **Para qué sirve:** RF-POR-068: Alta de adherentes en servicios que los admiten, validando existencia de la persona y la regla de adherente único por servicio. El trámite lo resuelve M18, dueño único de adherentes (RF-SOC-030, DEC-071), desde PAN-POR-98. · RF-POR-067: Trámites de modificación: cambio de plan, cambio de titularidad, cambio de domicilio postal, cambio de categoría, alta de adherentes, como formularios por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.adherentes.gestionar`.
- **Recibe:** en la ruta `contractId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-67 (Adherentes del servicio).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1521 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-52)

<a id="API-POR-53"></a>
#### API-POR-53 · `GET /api/por/contracts/{contractId}/appliance-declarations`

- **Qué hace:** DDJJ vigente e histórica. Consulta «appliance-declarations» de un registro de `appliance-declarations`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-28 (Detalle de cuenta), PAN-POR-29 (Mis servicios), PAN-POR-30 (Detalle de servicio).
- **Ola:** O2 · **Fuente:** M19 §11.4. Servicios, formularios y trámites, línea 1522 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Servicios%2C%20formularios%20y%20tr%C3%A1mites/API-POR-53)

<a id="grupo-5"></a>

## Visitas

7 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-54](#API-POR-54) | GET | `/api/por/visits/slots` | Franjas disponibles (M10) |
| [API-POR-56](#API-POR-56) | GET | `/api/por/visits` | Visitas y detalle (ETA, resultado) |
| [API-POR-55](#API-POR-55) | POST | `/api/por/visits` | Reservar. |
| [API-POR-56-b](#API-POR-56-b) | GET | `/api/por/visits/{id}` | Visitas y detalle (ETA, resultado) |
| [API-POR-57](#API-POR-57) | POST | `/api/por/visits/{id}/reschedule` | Reprogramar. |
| [API-POR-58](#API-POR-58) | POST | `/api/por/visits/{id}/cancel` | Cancelar. |
| [API-POR-59](#API-POR-59) | POST | `/api/por/visits/{id}/conformity` | Firmar conformidad o disconformidad. |

<a id="API-POR-54"></a>
#### API-POR-54 · `GET /api/por/visits/slots`

- **Qué hace:** Franjas disponibles (M10) Consulta `slots`.
- **Para qué sirve:** RF-POR-072: Coordinar visita: ver franjas disponibles compatibles con servicio, domicilio y requisitos (M10) y reservar sin duplicar recursos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1528 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-54)

<a id="API-POR-56"></a>
#### API-POR-56 · `GET /api/por/visits`

- **Qué hace:** Visitas y detalle (ETA, resultado) Consulta `visits`.
- **Para qué sirve:** RF-POR-077: Ver el resultado de la visita (realizada, fallida, sin acceso, reprogramada) y la próxima acción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1530 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-56)

<a id="API-POR-55"></a>
#### API-POR-55 · `POST /api/por/visits`

- **Qué hace:** Reservar. Registra un nuevo elemento u operación en `visits`.
- **Para qué sirve:** RF-POR-072: Coordinar visita: ver franjas disponibles compatibles con servicio, domicilio y requisitos (M10) y reservar sin duplicar recursos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1529 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-55)

<a id="API-POR-56-b"></a>
#### API-POR-56-b · `GET /api/por/visits/{id}`

- **Qué hace:** Visitas y detalle (ETA, resultado) Obtiene el detalle de un registro de `visits`.
- **Para qué sirve:** RF-POR-077: Ver el resultado de la visita (realizada, fallida, sin acceso, reprogramada) y la próxima acción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1530 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-56-b)

<a id="API-POR-57"></a>
#### API-POR-57 · `POST /api/por/visits/{id}/reschedule`

- **Qué hace:** Reprogramar. Reprograma un registro de `reschedule`.
- **Para qué sirve:** RF-POR-073: Reprogramar y cancelar la visita según reglas (anticipación mínima, cantidad de reprogramaciones). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1531 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-57)

<a id="API-POR-58"></a>
#### API-POR-58 · `POST /api/por/visits/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-POR-073: Reprogramar y cancelar la visita según reglas (anticipación mínima, cantidad de reprogramaciones). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-34 (Coordinar visita), PAN-POR-35 (Seguimiento de visita), PAN-POR-36 (Conformidad de visita).
- **Ola:** O2 · **Fuente:** M19 §11.5. Visitas, línea 1532 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-58)

<a id="API-POR-59"></a>
#### API-POR-59 · `POST /api/por/visits/{id}/conformity`

- **Qué hace:** Firmar conformidad o disconformidad. Registra «conformity» sobre un registro de `conformity`.
- **Para qué sirve:** RF-POR-076: Revisar el resumen de la instalación (tareas, equipo en comodato con número de serie), firmar conformidad en pantalla y responder la encuesta de satisfacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.conformidades.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M19 §11.5. Visitas, línea 1533 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Visitas/API-POR-59)

<a id="grupo-6"></a>

## Facturas, documentos y pagos

20 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-60](#API-POR-60) | GET | `/api/por/invoices` | Comprobantes visibles (RN-POR-062) |
| [API-POR-61](#API-POR-61) | GET | `/api/por/invoices/{id}` | Detalle con apertura por servicio y explicación. |
| [API-POR-62](#API-POR-62) | POST | `/api/por/invoices/{id}/pdf-url` | URL firmada del PDF. |
| [API-POR-63](#API-POR-63) | GET | `/api/por/accounts/{accountId}/statement` | Movimientos y resumen de cuenta. |
| [API-POR-64](#API-POR-64) | POST | `/api/por/checkouts/quote` | Recalcular deuda/recargos/percepciones para una selección. |
| [API-POR-65](#API-POR-65) | POST | `/api/por/checkouts` | Crear checkout (pasarela/QR) en M07. |
| [API-POR-66](#API-POR-66) | POST | `/api/por/payment-coupons` | Generar cupón único (PDF con código de barras) |
| [API-POR-67](#API-POR-67) | GET | `/api/por/checkouts/{id}` | Estado del checkout. |
| [API-POR-68](#API-POR-68) | GET | `/api/por/payments` | Historial de pagos. |
| [API-POR-69](#API-POR-69) | POST | `/api/por/payments/{id}/receipt-url` | URL firmada del recibo. |
| [API-POR-70](#API-POR-70) | GET | `/api/por/direct-debits` | Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... |
| [API-POR-70-b](#API-POR-70-b) | POST | `/api/por/direct-debits` | Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... |
| [API-POR-70-c](#API-POR-70-c) | GET | `/api/por/direct-debits/{id}` | Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... |
| [API-POR-70-d](#API-POR-70-d) | DELETE | `/api/por/direct-debits/{id}` | Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... |
| [API-POR-71](#API-POR-71) | GET | `/api/por/accounts/{accountId}/digital-invoice` | Adhesión a factura digital (M05) |
| [API-POR-71-b](#API-POR-71-b) | PUT | `/api/por/accounts/{accountId}/digital-invoice` | Adhesión a factura digital (M05) |
| [API-POR-72](#API-POR-72) | GET | `/api/por/agreements` | Convenios y cuotas (M08) |
| [API-POR-73](#API-POR-73) | GET | `/api/por/certificates` | Listar constancias / solicitar libre deuda. |
| [API-POR-73-b](#API-POR-73-b) | POST | `/api/por/certificates` | Listar constancias / solicitar libre deuda. |
| [API-POR-74](#API-POR-74) | POST | `/api/por/checkouts/by-code` | Pagar un comprobante ajeno con código (sesión) |

<a id="API-POR-60"></a>
#### API-POR-60 · `GET /api/por/invoices`

- **Qué hace:** Comprobantes visibles (RN-POR-062) Consulta `invoices`.
- **Para qué sirve:** RF-POR-079: Detalle de factura separada o comprobante agrupado con apertura por servicio: renglones, subtotal, saldo y pagos aplicados por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1539 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-60)

<a id="API-POR-61"></a>
#### API-POR-61 · `GET /api/por/invoices/{id}`

- **Qué hace:** Detalle con apertura por servicio y explicación. Obtiene el detalle de un registro de `invoices`.
- **Para qué sirve:** RF-POR-079: Detalle de factura separada o comprobante agrupado con apertura por servicio: renglones, subtotal, saldo y pagos aplicados por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1540 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-61)

<a id="API-POR-62"></a>
#### API-POR-62 · `POST /api/por/invoices/{id}/pdf-url`

- **Qué hace:** URL firmada del PDF. Registra «pdf-url» sobre un registro de `pdf-url`.
- **Para qué sirve:** RF-POR-081: Descarga del PDF (URL firmada de corta vida) con CAE, QR fiscal y código de barras. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.descargar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-62)

<a id="API-POR-63"></a>
#### API-POR-63 · `GET /api/por/accounts/{accountId}/statement`

- **Qué hace:** Movimientos y resumen de cuenta. Consulta «statement» de un registro de `statement`.
- **Para qué sirve:** RF-POR-083: Movimientos de cuenta corriente (débitos, créditos, pagos, notas de crédito, saldo a favor). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.ver`.
- **Recibe:** en la ruta `accountId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1542 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-63)

<a id="API-POR-64"></a>
#### API-POR-64 · `POST /api/por/checkouts/quote`

- **Qué hace:** Recalcular deuda/recargos/percepciones para una selección. Cotiza sobre `quote`.
- **Para qué sirve:** RF-POR-164: Ver deuda, seleccionar comprobantes y cuotas, ver total con recargos y percepciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.pagos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-40 (Pagar), PAN-POR-41 (Resultado del pago).
- **Ola:** O10 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-64)

<a id="API-POR-65"></a>
#### API-POR-65 · `POST /api/por/checkouts`

- **Qué hace:** Crear checkout (pasarela/QR) en M07. Registra un nuevo elemento u operación en `checkouts`.
- **Para qué sirve:** RF-POR-089: Pagar una o varias facturas (carro) creando un checkout en M07 con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.pagos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-40 (Pagar), PAN-POR-41 (Resultado del pago).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1544 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-65)

<a id="API-POR-66"></a>
#### API-POR-66 · `POST /api/por/payment-coupons`

- **Qué hace:** Generar cupón único (PDF con código de barras) Registra un nuevo elemento u operación en `payment-coupons`.
- **Para qué sirve:** RF-POR-090: Cupón único: generar un documento de pago con varias facturas y vencimiento propio (hoy + N días); opción de incluir siempre todas las facturas del cupón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.pagos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-40 (Pagar), PAN-POR-41 (Resultado del pago).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1545 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-66)

<a id="API-POR-67"></a>
#### API-POR-67 · `GET /api/por/checkouts/{id}`

- **Qué hace:** Estado del checkout. Obtiene el detalle de un registro de `checkouts`.
- **Para qué sirve:** RF-POR-089: Pagar una o varias facturas (carro) creando un checkout en M07 con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.pagos.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-40 (Pagar), PAN-POR-41 (Resultado del pago).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1546 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-67)

<a id="API-POR-68"></a>
#### API-POR-68 · `GET /api/por/payments`

- **Qué hace:** Historial de pagos. Lista, con filtros y paginación, los registros de `payments`.
- **Para qué sirve:** RF-POR-096: Historial de pagos con canal, medio, estado y comprobante. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1547 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-68)

<a id="API-POR-69"></a>
#### API-POR-69 · `POST /api/por/payments/{id}/receipt-url`

- **Qué hace:** URL firmada del recibo. Registra «receipt-url» sobre un registro de `receipt-url`.
- **Para qué sirve:** RF-POR-081: Descarga del PDF (URL firmada de corta vida) con CAE, QR fiscal y código de barras. · RF-POR-095: Recibo descargable y enviado por correo tras la imputación, con las facturas de intereses generadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.descargar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1548 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-69)

<a id="API-POR-70"></a>
#### API-POR-70 · `GET /api/por/direct-debits`

- **Qué hace:** Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... Consulta `direct-debits`.
- **Para qué sirve:** RF-POR-097: Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. · RF-POR-098: Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.debito.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-44 (Débito automático).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1549 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-70)

<a id="API-POR-70-b"></a>
#### API-POR-70-b · `POST /api/por/direct-debits`

- **Qué hace:** Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... Registra un nuevo elemento u operación en `direct-debits`.
- **Para qué sirve:** RF-POR-097: Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. · RF-POR-098: Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.debito.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-44 (Débito automático).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1549 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-70-b)

<a id="API-POR-70-c"></a>
#### API-POR-70-c · `GET /api/por/direct-debits/{id}`

- **Qué hace:** Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... Obtiene el detalle de un registro de `direct-debits`.
- **Para qué sirve:** RF-POR-097: Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. · RF-POR-098: Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.debito.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-44 (Débito automático).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1549 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-70-c)

<a id="API-POR-70-d"></a>
#### API-POR-70-d · `DELETE /api/por/direct-debits/{id}`

- **Qué hace:** Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), d... Elimina o da de baja un registro de `direct-debits`.
- **Para qué sirve:** RF-POR-097: Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. · RF-POR-098: Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.debito.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-44 (Débito automático).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1549 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-70-d)

<a id="API-POR-71"></a>
#### API-POR-71 · `GET /api/por/accounts/{accountId}/digital-invoice`

- **Qué hace:** Adhesión a factura digital (M05) Consulta «digital-invoice» de un registro de `digital-invoice`.
- **Para qué sirve:** RF-POR-170: Importar adhesiones a factura digital y débito automático vigentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturaDigital.gestionar`.
- **Recibe:** en la ruta `accountId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-45 (Factura digital).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1550 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-71)

<a id="API-POR-71-b"></a>
#### API-POR-71-b · `PUT /api/por/accounts/{accountId}/digital-invoice`

- **Qué hace:** Adhesión a factura digital (M05) Reemplaza o configura `digital-invoice`.
- **Para qué sirve:** RF-POR-170: Importar adhesiones a factura digital y débito automático vigentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturaDigital.gestionar`.
- **Recibe:** en la ruta `accountId`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-45 (Factura digital).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1550 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-71-b)

<a id="API-POR-72"></a>
#### API-POR-72 · `GET /api/por/agreements`

- **Qué hace:** Convenios y cuotas (M08) Consulta `agreements`.
- **Para qué sirve:** RF-POR-079: Detalle de factura separada o comprobante agrupado con apertura por servicio: renglones, subtotal, saldo y pagos aplicados por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.facturas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-72)

<a id="API-POR-73"></a>
#### API-POR-73 · `GET /api/por/certificates`

- **Qué hace:** Listar constancias / solicitar libre deuda. Lista, con filtros y paginación, los registros de `certificates`.
- **Para qué sirve:** RF-POR-087: Constancias descargables: libre deuda, constancia de alta, constancia de baja, constancia de trámite, certificado de servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.constancias.descargar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-POR-64 (Constancias y documentos).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-73)

<a id="API-POR-73-b"></a>
#### API-POR-73-b · `POST /api/por/certificates`

- **Qué hace:** Listar constancias / solicitar libre deuda. Registra un nuevo elemento u operación en `certificates`.
- **Para qué sirve:** RF-POR-087: Constancias descargables: libre deuda, constancia de alta, constancia de baja, constancia de trámite, certificado de servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.constancias.descargar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-64 (Constancias y documentos).
- **Ola:** O4 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-73-b)

<a id="API-POR-74"></a>
#### API-POR-74 · `POST /api/por/checkouts/by-code`

- **Qué hace:** Pagar un comprobante ajeno con código (sesión) Registra un nuevo elemento u operación en `by-code`.
- **Para qué sirve:** RF-POR-045: Pagador eventual: pagar un comprobante ajeno con su código de pago o código QR/barras, sin ver datos de la cuenta ni otros contratos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.pagos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-40 (Pagar), PAN-POR-41 (Resultado del pago).
- **Ola:** O5 · **Fuente:** M19 §11.6. Facturas, documentos y pagos, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Facturas%2C%20documentos%20y%20pagos/API-POR-74)

<a id="grupo-7"></a>

## Consumos, autolectura y prepaga

7 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-75](#API-POR-75) | GET | `/api/por/contracts/{contractId}/consumption` | Historial de consumos (M03) |
| [API-POR-76](#API-POR-76) | GET | `/api/por/contracts/{contractId}/my-meter-url` | URL "Mi Medidor" del proveedor (T06) |
| [API-POR-77](#API-POR-77) | GET | `/api/por/contracts/{contractId}/self-reading-window` | Ventana vigente y último valor. |
| [API-POR-78](#API-POR-78) | POST | `/api/por/self-readings` | Enviar autolectura con foto (M03) |
| [API-POR-79](#API-POR-79) | POST | `/api/por/self-readings/ocr` | Propuesta de valor por OCR (IA propone) |
| [API-POR-80](#API-POR-80) | POST | `/api/por/prepaid/quotes` | Cotizar recarga. |
| [API-POR-81](#API-POR-81) | POST | `/api/por/prepaid/purchases` | Crear recarga + checkout con TTL. |

<a id="API-POR-75"></a>
#### API-POR-75 · `GET /api/por/contracts/{contractId}/consumption`

- **Qué hace:** Historial de consumos (M03) Lista, con filtros y paginación, los registros de `consumption`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.consumos.ver`.
- **Recibe:** en la ruta `contractId`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-POR-47 (Mis consumos), PAN-POR-103 (Detalle de llamadas).
- **Ola:** O2 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1559 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-75)

<a id="API-POR-76"></a>
#### API-POR-76 · `GET /api/por/contracts/{contractId}/my-meter-url`

- **Qué hace:** URL "Mi Medidor" del proveedor (T06) Consulta «my-meter-url» de un registro de `my-meter-url`.
- **Para qué sirve:** RF-POR-106: Botón "Mi Medidor" hacia la consulta del proveedor de telemedición cuando el suministro está integrado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.consumos.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-47 (Mis consumos), PAN-POR-103 (Detalle de llamadas).
- **Ola:** O7 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1560 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-76)

<a id="API-POR-77"></a>
#### API-POR-77 · `GET /api/por/contracts/{contractId}/self-reading-window`

- **Qué hace:** Ventana vigente y último valor. Consulta «self-reading-window» de un registro de `self-reading-window`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.autolectura.crear`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-48 (Autolectura).
- **Ola:** O2 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-77)

<a id="API-POR-78"></a>
#### API-POR-78 · `POST /api/por/self-readings`

- **Qué hace:** Enviar autolectura con foto (M03) Registra un nuevo elemento u operación en `self-readings`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.autolectura.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-48 (Autolectura).
- **Ola:** O2 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-78)

<a id="API-POR-79"></a>
#### API-POR-79 · `POST /api/por/self-readings/ocr`

- **Qué hace:** Propuesta de valor por OCR (IA propone) Registra un nuevo elemento u operación en `ocr`.
- **Para qué sirve:** RF-POR-107: Autolectura con foto: el socio fotografía el medidor, informa el estado (o acepta la propuesta de OCR) dentro de la ventana de lectura; M03 la valida como cualquier lectura capturada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.autolectura.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-48 (Autolectura).
- **Ola:** O7 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1563 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-79)

<a id="API-POR-80"></a>
#### API-POR-80 · `POST /api/por/prepaid/quotes`

- **Qué hace:** Cotizar recarga. Registra un nuevo elemento u operación en `quotes`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.prepaga.comprar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-49 (Recarga prepaga).
- **Ola:** O2 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-80)

<a id="API-POR-81"></a>
#### API-POR-81 · `POST /api/por/prepaid/purchases`

- **Qué hace:** Crear recarga + checkout con TTL. Registra un nuevo elemento u operación en `purchases`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.prepaga.comprar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-49 (Recarga prepaga).
- **Ola:** O2 · **Fuente:** M19 §11.7. Consumos, autolectura y prepaga, línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Consumos%2C%20autolectura%20y%20prepaga/API-POR-81)

<a id="grupo-8"></a>

## Gestiones, turnos y comunicaciones

16 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-82](#API-POR-82) | GET | `/api/por/cases` | Mis gestiones (incluye históricas migradas) |
| [API-POR-83](#API-POR-83) | POST | `/api/por/cases` | Crear reclamo/consulta (M09) |
| [API-POR-84](#API-POR-84) | GET | `/api/por/cases/{id}` | Detalle público del caso. |
| [API-POR-85](#API-POR-85) | POST | `/api/por/cases/{id}/messages` | Mensaje con adjuntos. |
| [API-POR-86](#API-POR-86) | POST | `/api/por/cases/{id}/resolution` | Conformidad/rechazo de la solución. |
| [API-POR-87](#API-POR-87) | POST | `/api/por/cases/{id}/reopen` | Reabrir en plazo. |
| [API-POR-88](#API-POR-88) | POST | `/api/por/sync` | Lote offline con clientMutationId por ítem y resultado por ítem. |
| [API-POR-89](#API-POR-89) | GET | `/api/por/office-turns` | Turnos de atención (M09 turnero), tiempo estimado. |
| [API-POR-89-b](#API-POR-89-b) | POST | `/api/por/office-turns` | Turnos de atención (M09 turnero), tiempo estimado. |
| [API-POR-89-c](#API-POR-89-c) | GET | `/api/por/office-turns/{id}` | Turnos de atención (M09 turnero), tiempo estimado. |
| [API-POR-89-d](#API-POR-89-d) | DELETE | `/api/por/office-turns/{id}` | Turnos de atención (M09 turnero), tiempo estimado. |
| [API-POR-90](#API-POR-90) | GET | `/api/por/notifications` | Bandeja de avisos (T09) |
| [API-POR-90-b](#API-POR-90-b) | POST | `/api/por/notifications/read` | Bandeja de avisos (T09) |
| [API-POR-91](#API-POR-91) | GET | `/api/por/outages` | Interrupciones en mis zonas. |
| [API-POR-92](#API-POR-92) | GET | `/api/por/community/feed` | Proxy de feeds T09 filtrados por audiencia del rol. |
| [API-POR-92-b](#API-POR-92-b) | GET | `/api/por/community/surveys` | Proxy de feeds T09 filtrados por audiencia del rol. |

<a id="API-POR-82"></a>
#### API-POR-82 · `GET /api/por/cases`

- **Qué hace:** Mis gestiones (incluye históricas migradas) Consulta `cases`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-82)

<a id="API-POR-83"></a>
#### API-POR-83 · `POST /api/por/cases`

- **Qué hace:** Crear reclamo/consulta (M09) Registra un nuevo elemento u operación en `cases`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-83)

<a id="API-POR-84"></a>
#### API-POR-84 · `GET /api/por/cases/{id}`

- **Qué hace:** Detalle público del caso. Obtiene el detalle de un registro de `cases`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1573 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-84)

<a id="API-POR-85"></a>
#### API-POR-85 · `POST /api/por/cases/{id}/messages`

- **Qué hace:** Mensaje con adjuntos. Agrega un elemento («messages») a un registro de `messages`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-85)

<a id="API-POR-86"></a>
#### API-POR-86 · `POST /api/por/cases/{id}/resolution`

- **Qué hace:** Conformidad/rechazo de la solución. Registra «resolution» sobre un registro de `resolution`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-86)

<a id="API-POR-87"></a>
#### API-POR-87 · `POST /api/por/cases/{id}/reopen`

- **Qué hace:** Reabrir en plazo. Reabre un registro de `reopen`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.gestiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-32 (Trámite por pasos), PAN-POR-33 (Detalle y seguimiento de gestión), PAN-POR-50 (Mis gestiones) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-87)

<a id="API-POR-88"></a>
#### API-POR-88 · `POST /api/por/sync`

- **Qué hace:** Lote offline con clientMutationId por ítem y resultado por ítem. Sincroniza sobre `sync`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-POR-117: Gestión sin conexión: borrador local con fotos en IndexedDB y envío al recuperar señal con clientMutationId. · RF-POR-115: Mostrar al socio sus órdenes de trabajo asociadas (estado, fecha, resultado). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-88)

<a id="API-POR-89"></a>
#### API-POR-89 · `GET /api/por/office-turns`

- **Qué hace:** Turnos de atención (M09 turnero), tiempo estimado. Consulta `office-turns`.
- **Para qué sirve:** RF-POR-119: Ver número de turno, tiempo estimado de espera y cancelar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.turnos.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-52 (Mis turnos).
- **Ola:** O10 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-89)

<a id="API-POR-89-b"></a>
#### API-POR-89-b · `POST /api/por/office-turns`

- **Qué hace:** Turnos de atención (M09 turnero), tiempo estimado. Registra un nuevo elemento u operación en `office-turns`.
- **Para qué sirve:** RF-POR-119: Ver número de turno, tiempo estimado de espera y cancelar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.turnos.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-52 (Mis turnos).
- **Ola:** O10 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-89-b)

<a id="API-POR-89-c"></a>
#### API-POR-89-c · `GET /api/por/office-turns/{id}`

- **Qué hace:** Turnos de atención (M09 turnero), tiempo estimado. Obtiene el detalle de un registro de `office-turns`.
- **Para qué sirve:** RF-POR-119: Ver número de turno, tiempo estimado de espera y cancelar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.turnos.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-52 (Mis turnos).
- **Ola:** O10 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-89-c)

<a id="API-POR-89-d"></a>
#### API-POR-89-d · `DELETE /api/por/office-turns/{id}`

- **Qué hace:** Turnos de atención (M09 turnero), tiempo estimado. Elimina o da de baja un registro de `office-turns`.
- **Para qué sirve:** RF-POR-119: Ver número de turno, tiempo estimado de espera y cancelar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.turnos.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-52 (Mis turnos).
- **Ola:** O10 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-89-d)

<a id="API-POR-90"></a>
#### API-POR-90 · `GET /api/por/notifications`

- **Qué hace:** Bandeja de avisos (T09) Lista, con filtros y paginación, los registros de `notifications`.
- **Para qué sirve:** RF-POR-116: Avisos al tenant por correo de nuevos reclamos y trámites web, además de la bandeja CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `com.inbox.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-90)

<a id="API-POR-90-b"></a>
#### API-POR-90-b · `POST /api/por/notifications/read`

- **Qué hace:** Bandeja de avisos (T09) Registra un nuevo elemento u operación en `read`.
- **Para qué sirve:** RF-POR-116: Avisos al tenant por correo de nuevos reclamos y trámites web, además de la bandeja CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `com.inbox.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-90-b)

<a id="API-POR-91"></a>
#### API-POR-91 · `GET /api/por/outages`

- **Qué hace:** Interrupciones en mis zonas. Consulta `outages`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto… · RF-POR-002: La landing se compone de bloques configurables: portada (hero), servicios destacados, accesos rápidos (Ingresar, Registrarme, Pagar, Botón de baja, Turnos), noticias, avisos de interrupción, trámites y requisitos, preguntas… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.portal.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-91)

<a id="API-POR-92"></a>
#### API-POR-92 · `GET /api/por/community/feed`

- **Qué hace:** Proxy de feeds T09 filtrados por audiencia del rol. Consulta `feed`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-92)

<a id="API-POR-92-b"></a>
#### API-POR-92-b · `GET /api/por/community/surveys`

- **Qué hace:** Proxy de feeds T09 filtrados por audiencia del rol. Consulta `surveys`.
- **Para qué sirve:** RF-POR-180: Comunidad en la tabbar del socio (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** M19 §11.8. Gestiones, turnos y comunicaciones, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Gestiones%2C%20turnos%20y%20comunicaciones/API-POR-92-b)

<a id="grupo-9"></a>

## Portal del empleado

12 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-93](#API-POR-93) | GET | `/api/por/empleado/home` | Inicio del empleado. |
| [API-POR-94](#API-POR-94) | GET | `/api/por/empleado/payslips` | Recibos (M16) |
| [API-POR-94-b](#API-POR-94-b) | GET | `/api/por/empleado/payslips/{id}` | Recibos (M16) |
| [API-POR-95](#API-POR-95) | POST | `/api/por/empleado/payslips/{id}/signature` | Firmar conformidad/disconformidad (OTP) |
| [API-POR-96](#API-POR-96) | POST | `/api/por/empleado/payslips/{id}/pdf-url` | URL firmada (respeta 3122/3166) |
| [API-POR-97](#API-POR-97) | GET | `/api/por/empleado/vacations` | Saldo y solicitudes. |
| [API-POR-97-b](#API-POR-97-b) | POST | `/api/por/empleado/vacations` | Saldo y solicitudes. |
| [API-POR-98](#API-POR-98) | GET | `/api/por/empleado/leaves` | Licencias. |
| [API-POR-98-b](#API-POR-98-b) | POST | `/api/por/empleado/leaves` | Licencias. |
| [API-POR-99](#API-POR-99) | GET | `/api/por/empleado/record` | Legajo y solicitudes de actualización. |
| [API-POR-99-b](#API-POR-99-b) | POST | `/api/por/empleado/record` | Legajo y solicitudes de actualización. |
| [API-POR-99-c](#API-POR-99-c) | POST | `/api/por/empleado/record/update-requests` | Legajo y solicitudes de actualización. |

<a id="API-POR-93"></a>
#### API-POR-93 · `GET /api/por/empleado/home`

- **Qué hace:** Inicio del empleado. Consulta `home`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.empleado.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-69 (Inicio del empleado), PAN-POR-75 (Muro interno), PAN-POR-76 (Avisos internos).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-93)

<a id="API-POR-94"></a>
#### API-POR-94 · `GET /api/por/empleado/payslips`

- **Qué hace:** Recibos (M16) Consulta `payslips`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.recibos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-94)

<a id="API-POR-94-b"></a>
#### API-POR-94-b · `GET /api/por/empleado/payslips/{id}`

- **Qué hace:** Recibos (M16) Obtiene el detalle de un registro de `payslips`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-94-b)

<a id="API-POR-95"></a>
#### API-POR-95 · `POST /api/por/empleado/payslips/{id}/signature`

- **Qué hace:** Firmar conformidad/disconformidad (OTP) Registra «signature» sobre un registro de `signature`.
- **Para qué sirve:** RF-POR-130: Recibos de sueldo: lista, detalle, descarga PDF y firma de conformidad; no descargar antes de firmar; no acceder al mes actual sin firmar el anterior, según tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.recibos.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-71 (Detalle del recibo).
- **Ola:** O9 · **Fuente:** M19 §11.9. Portal del empleado, línea 1589 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-95)

<a id="API-POR-96"></a>
#### API-POR-96 · `POST /api/por/empleado/payslips/{id}/pdf-url`

- **Qué hace:** URL firmada (respeta 3122/3166) Registra «pdf-url» sobre un registro de `pdf-url`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.recibos.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1590 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-96)

<a id="API-POR-97"></a>
#### API-POR-97 · `GET /api/por/empleado/vacations`

- **Qué hace:** Saldo y solicitudes. Consulta `vacations`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.licencias.solicitar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1591 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-97)

<a id="API-POR-97-b"></a>
#### API-POR-97-b · `POST /api/por/empleado/vacations`

- **Qué hace:** Saldo y solicitudes. Registra un nuevo elemento u operación en `vacations`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.licencias.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1591 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-97-b)

<a id="API-POR-98"></a>
#### API-POR-98 · `GET /api/por/empleado/leaves`

- **Qué hace:** Licencias. Consulta `leaves`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.licencias.solicitar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1592 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-98)

<a id="API-POR-98-b"></a>
#### API-POR-98-b · `POST /api/por/empleado/leaves`

- **Qué hace:** Licencias. Registra un nuevo elemento u operación en `leaves`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.licencias.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1592 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-98-b)

<a id="API-POR-99"></a>
#### API-POR-99 · `GET /api/por/empleado/record`

- **Qué hace:** Legajo y solicitudes de actualización. Consulta `record`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.datos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-43 (Mis datos y documentos), PAN-POR-74 (Mi legajo).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-99)

<a id="API-POR-99-b"></a>
#### API-POR-99-b · `POST /api/por/empleado/record`

- **Qué hace:** Legajo y solicitudes de actualización. Registra un nuevo elemento u operación en `record`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.datos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-99-b)

<a id="API-POR-99-c"></a>
#### API-POR-99-c · `POST /api/por/empleado/record/update-requests`

- **Qué hace:** Legajo y solicitudes de actualización. Registra un nuevo elemento u operación en `update-requests`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `sue.portal.datos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.9. Portal del empleado, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Portal%20del%20empleado/API-POR-99-c)

<a id="grupo-10"></a>

## Tótem

5 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-100](#API-POR-100) | POST | `/api/por/kiosk/session` | Abre sesión de tótem (valida dispositivo y caja) |
| [API-POR-101](#API-POR-101) | POST | `/api/por/kiosk/identify` | Identificación por socio/cuenta/documento/QR (datos mínimos) |
| [API-POR-102](#API-POR-102) | POST | `/api/por/kiosk/payments` | Registrar cobro en la caja del dispositivo (M07) |
| [API-POR-103](#API-POR-103) | POST | `/api/por/kiosk/heartbeat` | Latido y estado de periféricos. |
| [API-POR-104](#API-POR-104) | POST | `/api/por/kiosk/close` | Cierre administrativo. |

<a id="API-POR-100"></a>
#### API-POR-100 · `POST /api/por/kiosk/session`

- **Qué hace:** Abre sesión de tótem (valida dispositivo y caja) Registra un nuevo elemento u operación en `session`.
- **Para qué sirve:** RF-POR-168: Cierre administrativo del tótem con clave de dispositivo y caja asociada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.totem.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-78 (Tótem: inicio), PAN-POR-79 (Tótem: identificación), PAN-POR-80 (Tótem: deuda) y 3 más.
- **Ola:** O10 · **Fuente:** M19 §11.10. Tótem, línea 1599 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/T%C3%B3tem/API-POR-100)

<a id="API-POR-101"></a>
#### API-POR-101 · `POST /api/por/kiosk/identify`

- **Qué hace:** Identificación por socio/cuenta/documento/QR (datos mínimos) Identifica sobre `identify`.
- **Para qué sirve:** RF-POR-163: Identificación del socio por número de socio, cuenta, documento o código QR de la factura, con opción por defecto configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.totem.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-78 (Tótem: inicio), PAN-POR-79 (Tótem: identificación), PAN-POR-80 (Tótem: deuda) y 3 más.
- **Ola:** O10 · **Fuente:** M19 §11.10. Tótem, línea 1600 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/T%C3%B3tem/API-POR-101)

<a id="API-POR-102"></a>
#### API-POR-102 · `POST /api/por/kiosk/payments`

- **Qué hace:** Registrar cobro en la caja del dispositivo (M07) Registra un nuevo elemento u operación en `payments`.
- **Para qué sirve:** RF-POR-168: Cierre administrativo del tótem con clave de dispositivo y caja asociada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.totem.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-78 (Tótem: inicio), PAN-POR-79 (Tótem: identificación), PAN-POR-80 (Tótem: deuda) y 3 más.
- **Ola:** O10 · **Fuente:** M19 §11.10. Tótem, línea 1601 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/T%C3%B3tem/API-POR-102)

<a id="API-POR-103"></a>
#### API-POR-103 · `POST /api/por/kiosk/heartbeat`

- **Qué hace:** Latido y estado de periféricos. Registra un nuevo elemento u operación en `heartbeat`.
- **Para qué sirve:** RF-POR-166: Recarga prepaga en el tótem. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.totem.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-78 (Tótem: inicio), PAN-POR-79 (Tótem: identificación), PAN-POR-80 (Tótem: deuda) y 3 más.
- **Ola:** O2 · **Fuente:** M19 §11.10. Tótem, línea 1602 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/T%C3%B3tem/API-POR-103)

<a id="API-POR-104"></a>
#### API-POR-104 · `POST /api/por/kiosk/close`

- **Qué hace:** Cierre administrativo. Cierra sobre `close`.
- **Para qué sirve:** RF-POR-168: Cierre administrativo del tótem con clave de dispositivo y caja asociada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.totem.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-78 (Tótem: inicio), PAN-POR-79 (Tótem: identificación), PAN-POR-80 (Tótem: deuda) y 3 más.
- **Ola:** O10 · **Fuente:** M19 §11.10. Tótem, línea 1603 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/T%C3%B3tem/API-POR-104)

<a id="grupo-11"></a>

## Administración del portal

44 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-105](#API-POR-105) | GET | `/api/admin/por/settings` | Parámetros del portal con vigencia (T04) |
| [API-POR-105-b](#API-POR-105-b) | PUT | `/api/admin/por/settings` | Parámetros del portal con vigencia (T04) |
| [API-POR-106](#API-POR-106) | GET | `/api/admin/por/landing/draft` | Borrador de landing. |
| [API-POR-106-b](#API-POR-106-b) | PUT | `/api/admin/por/landing/draft` | Borrador de landing. |
| [API-POR-107](#API-POR-107) | GET | `/api/admin/por/landing/versions` | Revisión, aprobación, programación, publicación, reversión. |
| [API-POR-107-b](#API-POR-107-b) | POST | `/api/admin/por/landing/versions` | Revisión, aprobación, programación, publicación, reversión. |
| [API-POR-107-c](#API-POR-107-c) | POST | `/api/admin/por/landing/versions/{id}/{action}` | Revisión, aprobación, programación, publicación, reversión. |
| [API-POR-108](#API-POR-108) | GET | `/api/admin/por/forms` | CRUD de formularios. |
| [API-POR-108-b](#API-POR-108-b) | POST | `/api/admin/por/forms` | CRUD de formularios. |
| [API-POR-108-c](#API-POR-108-c) | GET | `/api/admin/por/forms/{id}` | CRUD de formularios. |
| [API-POR-108-d](#API-POR-108-d) | PUT | `/api/admin/por/forms/{id}` | CRUD de formularios. |
| [API-POR-109](#API-POR-109) | POST | `/api/admin/por/forms/{id}/publish` | Publicar versión. |
| [API-POR-110](#API-POR-110) | GET | `/api/admin/por/form-submissions` | Presentaciones. |
| [API-POR-111](#API-POR-111) | POST | `/api/admin/por/form-submissions/{id}/{action}` | Observar, completar campos de operador, aceptar (ejecuta comando), rechazar. |
| [API-POR-112](#API-POR-112) | GET | `/api/admin/por/link-requests` | Bandeja de vinculaciones; aprobar/rechazar. |
| [API-POR-112-b](#API-POR-112-b) | POST | `/api/admin/por/link-requests` | Bandeja de vinculaciones; aprobar/rechazar. |
| [API-POR-112-c](#API-POR-112-c) | POST | `/api/admin/por/link-requests/{id}/{action}` | Bandeja de vinculaciones; aprobar/rechazar. |
| [API-POR-113](#API-POR-113) | POST | `/api/admin/por/link-invitations` | Emitir código de vinculación asistida. |
| [API-POR-114](#API-POR-114) | GET | `/api/admin/por/account-access` | Accesos de una cuenta. |
| [API-POR-114-b](#API-POR-114-b) | POST | `/api/admin/por/account-access` | Accesos de una cuenta. |
| [API-POR-114-c](#API-POR-114-c) | POST | `/api/admin/por/account-access/{id}/revoke` | Accesos de una cuenta. |
| [API-POR-114-d](#API-POR-114-d) | POST | `/api/admin/por/account-access/{id}/suspend` | Accesos de una cuenta. |
| [API-POR-115](#API-POR-115) | GET | `/api/admin/por/public-submissions` | Recepción pública: identificar, derivar, reenviar. |
| [API-POR-115-b](#API-POR-115-b) | POST | `/api/admin/por/public-submissions` | Recepción pública: identificar, derivar, reenviar. |
| [API-POR-115-c](#API-POR-115-c) | POST | `/api/admin/por/public-submissions/{id}/{action}` | Recepción pública: identificar, derivar, reenviar. |
| [API-POR-116](#API-POR-116) | POST | `/api/admin/por/legacy-imports` | Migración CoopOnline. |
| [API-POR-116-b](#API-POR-116-b) | POST | `/api/admin/por/legacy-imports/{id}/validate` | Migración CoopOnline. |
| [API-POR-116-c](#API-POR-116-c) | POST | `/api/admin/por/legacy-imports/{id}/import` | Migración CoopOnline. |
| [API-POR-116-d](#API-POR-116-d) | POST | `/api/admin/por/legacy-imports/{id}/invite` | Migración CoopOnline. |
| [API-POR-116-e](#API-POR-116-e) | POST | `/api/admin/por/legacy-imports/{id}/revert` | Migración CoopOnline. |
| [API-POR-117](#API-POR-117) | GET | `/api/admin/por/banners` | Banners. |
| [API-POR-117-b](#API-POR-117-b) | POST | `/api/admin/por/banners` | Banners. |
| [API-POR-117-c](#API-POR-117-c) | GET | `/api/admin/por/banners/{id}` | Banners. |
| [API-POR-117-d](#API-POR-117-d) | PUT | `/api/admin/por/banners/{id}` | Banners. |
| [API-POR-118](#API-POR-118) | GET | `/api/admin/por/metrics` | Métricas. |
| [API-POR-118-b](#API-POR-118-b) | GET | `/api/admin/por/metrics/export` | Métricas. |
| [API-POR-119](#API-POR-119) | POST | `/api/admin/por/member-view-sessions` | Abrir vista de socio solo lectura (motivo) |
| [API-POR-120](#API-POR-120) | GET | `/api/admin/por/kiosks` | Tótems. |
| [API-POR-120-b](#API-POR-120-b) | POST | `/api/admin/por/kiosks` | Tótems. |
| [API-POR-120-c](#API-POR-120-c) | GET | `/api/admin/por/kiosks/{id}` | Tótems. |
| [API-POR-120-d](#API-POR-120-d) | PUT | `/api/admin/por/kiosks/{id}` | Tótems. |
| [API-POR-120-e](#API-POR-120-e) | POST | `/api/admin/por/kiosks/{id}/rotate-secret` | Tótems. |
| [API-POR-121](#API-POR-121) | POST | `/api/admin/por/custom-domains` | Dominio propio (PA-POR-12) |
| [API-POR-121-b](#API-POR-121-b) | POST | `/api/admin/por/custom-domains/{id}/verify` | Dominio propio (PA-POR-12) |

<a id="API-POR-105"></a>
#### API-POR-105 · `GET /api/admin/por/settings`

- **Qué hace:** Parámetros del portal con vigencia (T04) Consulta `settings`.
- **Para qué sirve:** RF-POR-149: Configuración del portal por tenant (parámetros del §14) con vigencia y auditoría (T04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.parametros.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-84 (Configuración del portal).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1609 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-105)

<a id="API-POR-105-b"></a>
#### API-POR-105-b · `PUT /api/admin/por/settings`

- **Qué hace:** Parámetros del portal con vigencia (T04) Reemplaza o configura `settings`.
- **Para qué sirve:** RF-POR-149: Configuración del portal por tenant (parámetros del §14) con vigencia y auditoría (T04). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.parametros.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-84 (Configuración del portal).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1609 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-105-b)

<a id="API-POR-106"></a>
#### API-POR-106 · `GET /api/admin/por/landing/draft`

- **Qué hace:** Borrador de landing. Consulta `draft`.
- **Para qué sirve:** RF-POR-003: Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-85 (Editor de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-106)

<a id="API-POR-106-b"></a>
#### API-POR-106-b · `PUT /api/admin/por/landing/draft`

- **Qué hace:** Borrador de landing. Reemplaza o configura `draft`.
- **Para qué sirve:** RF-POR-003: Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-85 (Editor de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-106-b)

<a id="API-POR-107"></a>
#### API-POR-107 · `GET /api/admin/por/landing/versions`

- **Qué hace:** Revisión, aprobación, programación, publicación, reversión. Lista, con filtros y paginación, los registros de versiones publicadas de la landing (`landingPageVersions`).
- **Para qué sirve:** RF-POR-003: Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.publicar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas de la landing (`landingPageVersions`) con `total`.
- **Pantallas:** PAN-POR-86 (Versiones de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1611 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-107)

<a id="API-POR-107-b"></a>
#### API-POR-107-b · `POST /api/admin/por/landing/versions`

- **Qué hace:** Revisión, aprobación, programación, publicación, reversión. Da de alta un registro de versiones publicadas de la landing (`landingPageVersions`).
- **Para qué sirve:** RF-POR-003: Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.publicar`.
- **Recibe:** los datos de versiones publicadas de la landing (`landingPageVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones publicadas de la landing (`landingPageVersions`).
- **Pantallas:** PAN-POR-86 (Versiones de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1611 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-107-b)

<a id="API-POR-107-c"></a>
#### API-POR-107-c · `POST /api/admin/por/landing/versions/{id}/{action}`

- **Qué hace:** Revisión, aprobación, programación, publicación, reversión. Registra «{action}» sobre un registro de versiones publicadas de la landing (`landingPageVersions`).
- **Para qué sirve:** RF-POR-003: Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.publicar`.
- **Recibe:** en la ruta `id`, `action`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-86 (Versiones de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1611 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-107-c)

<a id="API-POR-108"></a>
#### API-POR-108 · `GET /api/admin/por/forms`

- **Qué hace:** CRUD de formularios. Lista, con filtros y paginación, los registros de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de formularios del portal (`portalForms`) con `total`.
- **Pantallas:** PAN-POR-88 (Constructor de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-108)

<a id="API-POR-108-b"></a>
#### API-POR-108-b · `POST /api/admin/por/forms`

- **Qué hace:** CRUD de formularios. Da de alta un registro de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.configurar`.
- **Recibe:** los datos de formularios del portal (`portalForms`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de formularios del portal (`portalForms`).
- **Pantallas:** PAN-POR-88 (Constructor de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-108-b)

<a id="API-POR-108-c"></a>
#### API-POR-108-c · `GET /api/admin/por/forms/{id}`

- **Qué hace:** CRUD de formularios. Obtiene el detalle de un registro de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de formularios del portal (`portalForms`).
- **Pantallas:** PAN-POR-88 (Constructor de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-108-c)

<a id="API-POR-108-d"></a>
#### API-POR-108-d · `PUT /api/admin/por/forms/{id}`

- **Qué hace:** CRUD de formularios. Reemplaza o configura un registro de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.configurar`.
- **Recibe:** en la ruta `id`; los datos de formularios del portal (`portalForms`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de formularios del portal (`portalForms`).
- **Pantallas:** PAN-POR-88 (Constructor de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-108-d)

<a id="API-POR-109"></a>
#### API-POR-109 · `POST /api/admin/por/forms/{id}/publish`

- **Qué hace:** Publicar versión. Publica un registro de formularios del portal (`portalForms`).
- **Para qué sirve:** RF-POR-056: Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1613 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-109)

<a id="API-POR-110"></a>
#### API-POR-110 · `GET /api/admin/por/form-submissions`

- **Qué hace:** Presentaciones. Lista, con filtros y paginación, los registros de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-069: Declaraciones juradas por servicio con la plantilla que define M02 para cada servicio (PRM-CAT-110, API-CAT-41): gas, artefactos a gas con potencia en kcal/h; energía, artefactos eléctricos (W) y vehículos eléctricos (dominio… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de envíos de formularios (`portalFormSubmissions`) con `total`.
- **Pantallas:** PAN-POR-87 (Formularios del portal), PAN-POR-97 (Presentaciones de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1614 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-110)

<a id="API-POR-111"></a>
#### API-POR-111 · `POST /api/admin/por/form-submissions/{id}/{action}`

- **Qué hace:** Observar, completar campos de operador, aceptar (ejecuta comando), rechazar. Registra «{action}» sobre un registro de envíos de formularios (`portalFormSubmissions`).
- **Para qué sirve:** RF-POR-152: Campos que completa el operador (no visibles al socio) en la presentación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.formularios.ver`.
- **Recibe:** en la ruta `id`, `action`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-87 (Formularios del portal), PAN-POR-97 (Presentaciones de formularios).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1615 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-111)

<a id="API-POR-112"></a>
#### API-POR-112 · `GET /api/admin/por/link-requests`

- **Qué hace:** Bandeja de vinculaciones; aprobar/rechazar. Lista, con filtros y paginación, los registros de `link-requests`.
- **Para qué sirve:** RF-POR-154: Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.vinculaciones.aprobar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-112)

<a id="API-POR-112-b"></a>
#### API-POR-112-b · `POST /api/admin/por/link-requests`

- **Qué hace:** Bandeja de vinculaciones; aprobar/rechazar. Registra un nuevo elemento u operación en `link-requests`.
- **Para qué sirve:** RF-POR-154: Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.vinculaciones.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-112-b)

<a id="API-POR-112-c"></a>
#### API-POR-112-c · `POST /api/admin/por/link-requests/{id}/{action}`

- **Qué hace:** Bandeja de vinculaciones; aprobar/rechazar. Registra «{action}» sobre un registro de `link-requests`.
- **Para qué sirve:** RF-POR-154: Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.vinculaciones.aprobar`.
- **Recibe:** en la ruta `id`, `action`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-112-c)

<a id="API-POR-113"></a>
#### API-POR-113 · `POST /api/admin/por/link-invitations`

- **Qué hace:** Emitir código de vinculación asistida. Registra un nuevo elemento u operación en `link-invitations`.
- **Para qué sirve:** RF-POR-154: Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.vinculaciones.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1617 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-113)

<a id="API-POR-114"></a>
#### API-POR-114 · `GET /api/admin/por/account-access`

- **Qué hace:** Accesos de una cuenta. Lista, con filtros y paginación, los registros de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.accesos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vínculo usuario del portal–cuenta (`portalAccountAccess`) con `total`.
- **Pantallas:** PAN-POR-90 (Accesos al portal por cuenta).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-114)

<a id="API-POR-114-b"></a>
#### API-POR-114-b · `POST /api/admin/por/account-access`

- **Qué hace:** Accesos de una cuenta. Da de alta un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.accesos.ver`.
- **Recibe:** los datos de vínculo usuario del portal–cuenta (`portalAccountAccess`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Pantallas:** PAN-POR-90 (Accesos al portal por cuenta).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-114-b)

<a id="API-POR-114-c"></a>
#### API-POR-114-c · `POST /api/admin/por/account-access/{id}/revoke`

- **Qué hace:** Accesos de una cuenta. Revoca un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.accesos.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-90 (Accesos al portal por cuenta).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-114-c)

<a id="API-POR-114-d"></a>
#### API-POR-114-d · `POST /api/admin/por/account-access/{id}/suspend`

- **Qué hace:** Accesos de una cuenta. Suspende un registro de vínculo usuario del portal–cuenta (`portalAccountAccess`).
- **Para qué sirve:** RF-POR-155: Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.accesos.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-90 (Accesos al portal por cuenta).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-114-d)

<a id="API-POR-115"></a>
#### API-POR-115 · `GET /api/admin/por/public-submissions`

- **Qué hace:** Recepción pública: identificar, derivar, reenviar. Lista, con filtros y paginación, los registros de envíos públicos sin sesión (`publicSubmissions`).
- **Para qué sirve:** RF-POR-156: Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.recepcionPublica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de envíos públicos sin sesión (`publicSubmissions`) con `total`.
- **Pantallas:** PAN-POR-91 (Recepción pública: bajas y contactos).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1619 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-115)

<a id="API-POR-115-b"></a>
#### API-POR-115-b · `POST /api/admin/por/public-submissions`

- **Qué hace:** Recepción pública: identificar, derivar, reenviar. Da de alta un registro de envíos públicos sin sesión (`publicSubmissions`).
- **Para qué sirve:** RF-POR-156: Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.recepcionPublica.ver`.
- **Recibe:** los datos de envíos públicos sin sesión (`publicSubmissions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de envíos públicos sin sesión (`publicSubmissions`).
- **Pantallas:** PAN-POR-91 (Recepción pública: bajas y contactos).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1619 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-115-b)

<a id="API-POR-115-c"></a>
#### API-POR-115-c · `POST /api/admin/por/public-submissions/{id}/{action}`

- **Qué hace:** Recepción pública: identificar, derivar, reenviar. Registra «{action}» sobre un registro de envíos públicos sin sesión (`publicSubmissions`).
- **Para qué sirve:** RF-POR-156: Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.recepcionPublica.ver`.
- **Recibe:** en la ruta `id`, `action`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-91 (Recepción pública: bajas y contactos).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1619 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-115-c)

<a id="API-POR-116"></a>
#### API-POR-116 · `POST /api/admin/por/legacy-imports`

- **Qué hace:** Migración CoopOnline. Registra un nuevo elemento u operación en `legacy-imports`.
- **Para qué sirve:** RF-POR-157: Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.migracion.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-92 (Migración de usuarios CoopOnline).
- **Ola:** O6 · **Fuente:** M19 §11.11. Administración del portal, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-116)

<a id="API-POR-116-b"></a>
#### API-POR-116-b · `POST /api/admin/por/legacy-imports/{id}/validate`

- **Qué hace:** Migración CoopOnline. Valida un registro de `validate`.
- **Para qué sirve:** RF-POR-157: Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.migracion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-92 (Migración de usuarios CoopOnline).
- **Ola:** O6 · **Fuente:** M19 §11.11. Administración del portal, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-116-b)

<a id="API-POR-116-c"></a>
#### API-POR-116-c · `POST /api/admin/por/legacy-imports/{id}/import`

- **Qué hace:** Migración CoopOnline. Importa un registro de `import`.
- **Para qué sirve:** RF-POR-157: Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.migracion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-92 (Migración de usuarios CoopOnline).
- **Ola:** O6 · **Fuente:** M19 §11.11. Administración del portal, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-116-c)

<a id="API-POR-116-d"></a>
#### API-POR-116-d · `POST /api/admin/por/legacy-imports/{id}/invite`

- **Qué hace:** Migración CoopOnline. Registra «invite» sobre un registro de `invite`.
- **Para qué sirve:** RF-POR-157: Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.migracion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-92 (Migración de usuarios CoopOnline).
- **Ola:** O6 · **Fuente:** M19 §11.11. Administración del portal, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-116-d)

<a id="API-POR-116-e"></a>
#### API-POR-116-e · `POST /api/admin/por/legacy-imports/{id}/revert`

- **Qué hace:** Migración CoopOnline. Revierte un registro de `revert`.
- **Para qué sirve:** RF-POR-157: Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.migracion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-92 (Migración de usuarios CoopOnline).
- **Ola:** O6 · **Fuente:** M19 §11.11. Administración del portal, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-116-e)

<a id="API-POR-117"></a>
#### API-POR-117 · `GET /api/admin/por/banners`

- **Qué hace:** Banners. Lista, con filtros y paginación, los registros de avisos y banners (`portalBanners`).
- **Para qué sirve:** RF-POR-158: Configuración de banners por rol y segmento. · RF-POR-052: Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.banners.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos y banners (`portalBanners`) con `total`.
- **Pantallas:** PAN-POR-93 (Banners).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-117)

<a id="API-POR-117-b"></a>
#### API-POR-117-b · `POST /api/admin/por/banners`

- **Qué hace:** Banners. Da de alta un registro de avisos y banners (`portalBanners`).
- **Para qué sirve:** RF-POR-158: Configuración de banners por rol y segmento. · RF-POR-052: Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.banners.configurar`.
- **Recibe:** los datos de avisos y banners (`portalBanners`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de avisos y banners (`portalBanners`).
- **Pantallas:** PAN-POR-93 (Banners).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-117-b)

<a id="API-POR-117-c"></a>
#### API-POR-117-c · `GET /api/admin/por/banners/{id}`

- **Qué hace:** Banners. Obtiene el detalle de un registro de avisos y banners (`portalBanners`).
- **Para qué sirve:** RF-POR-158: Configuración de banners por rol y segmento. · RF-POR-052: Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.banners.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de avisos y banners (`portalBanners`).
- **Pantallas:** PAN-POR-93 (Banners).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-117-c)

<a id="API-POR-117-d"></a>
#### API-POR-117-d · `PUT /api/admin/por/banners/{id}`

- **Qué hace:** Banners. Reemplaza o configura un registro de avisos y banners (`portalBanners`).
- **Para qué sirve:** RF-POR-158: Configuración de banners por rol y segmento. · RF-POR-052: Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.banners.configurar`.
- **Recibe:** en la ruta `id`; los datos de avisos y banners (`portalBanners`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de avisos y banners (`portalBanners`).
- **Pantallas:** PAN-POR-93 (Banners).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-117-d)

<a id="API-POR-118"></a>
#### API-POR-118 · `GET /api/admin/por/metrics`

- **Qué hace:** Métricas. Consulta `metrics`.
- **Para qué sirve:** RF-POR-159: Métricas del portal (§15) con exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.metricas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-94 (Métricas del portal).
- **Ola:** O11 · **Fuente:** M19 §11.11. Administración del portal, línea 1622 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-118)

<a id="API-POR-118-b"></a>
#### API-POR-118-b · `GET /api/admin/por/metrics/export`

- **Qué hace:** Métricas. Descarga un archivo de `export`.
- **Para qué sirve:** RF-POR-159: Métricas del portal (§15) con exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.metricas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-POR-94 (Métricas del portal).
- **Ola:** O11 · **Fuente:** M19 §11.11. Administración del portal, línea 1622 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-118-b)

<a id="API-POR-119"></a>
#### API-POR-119 · `POST /api/admin/por/member-view-sessions`

- **Qué hace:** Abrir vista de socio solo lectura (motivo) Registra un nuevo elemento u operación en `member-view-sessions`.
- **Para qué sirve:** RF-POR-160: "Ver portal como este socio" en solo lectura, auditado, desde la ficha de la cuenta (reemplaza el ingreso directo de escritorio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.vistaSocio.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-95 (Vista como socio).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1623 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-119)

<a id="API-POR-120"></a>
#### API-POR-120 · `GET /api/admin/por/kiosks`

- **Qué hace:** Tótems. Consulta `kiosks`.
- **Para qué sirve:** RF-POR-161: Alta y configuración de tótems de autogestión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.totems.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-96 (Tótems de autoservicio).
- **Ola:** O10 · **Fuente:** M19 §11.11. Administración del portal, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-120)

<a id="API-POR-120-b"></a>
#### API-POR-120-b · `POST /api/admin/por/kiosks`

- **Qué hace:** Tótems. Registra un nuevo elemento u operación en `kiosks`.
- **Para qué sirve:** RF-POR-161: Alta y configuración de tótems de autogestión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.totems.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-96 (Tótems de autoservicio).
- **Ola:** O10 · **Fuente:** M19 §11.11. Administración del portal, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-120-b)

<a id="API-POR-120-c"></a>
#### API-POR-120-c · `GET /api/admin/por/kiosks/{id}`

- **Qué hace:** Tótems. Obtiene el detalle de un registro de `kiosks`.
- **Para qué sirve:** RF-POR-161: Alta y configuración de tótems de autogestión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.totems.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-96 (Tótems de autoservicio).
- **Ola:** O10 · **Fuente:** M19 §11.11. Administración del portal, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-120-c)

<a id="API-POR-120-d"></a>
#### API-POR-120-d · `PUT /api/admin/por/kiosks/{id}`

- **Qué hace:** Tótems. Reemplaza o configura un registro de `kiosks`.
- **Para qué sirve:** RF-POR-161: Alta y configuración de tótems de autogestión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.totems.configurar`.
- **Recibe:** en la ruta `id`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-96 (Tótems de autoservicio).
- **Ola:** O10 · **Fuente:** M19 §11.11. Administración del portal, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-120-d)

<a id="API-POR-120-e"></a>
#### API-POR-120-e · `POST /api/admin/por/kiosks/{id}/rotate-secret`

- **Qué hace:** Tótems. Registra «rotate-secret» sobre un registro de `rotate-secret`.
- **Para qué sirve:** RF-POR-161: Alta y configuración de tótems de autogestión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.totems.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-96 (Tótems de autoservicio).
- **Ola:** O10 · **Fuente:** M19 §11.11. Administración del portal, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-120-e)

<a id="API-POR-121"></a>
#### API-POR-121 · `POST /api/admin/por/custom-domains`

- **Qué hace:** Dominio propio (PA-POR-12) Registra un nuevo elemento u operación en `custom-domains`.
- **Para qué sirve:** RF-POR-001: Cada tenant dispone de una landing propia con su marca (T03), accesible por subdominio <tenantSlug>.<dominioPlataforma> y, opcionalmente, dominio propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.publicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-86 (Versiones de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1625 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-121)

<a id="API-POR-121-b"></a>
#### API-POR-121-b · `POST /api/admin/por/custom-domains/{id}/verify`

- **Qué hace:** Dominio propio (PA-POR-12) Verifica un registro de `verify`.
- **Para qué sirve:** RF-POR-001: Cada tenant dispone de una landing propia con su marca (T03), accesible por subdominio <tenantSlug>.<dominioPlataforma> y, opcionalmente, dominio propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.landing.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-86 (Versiones de la landing).
- **Ola:** O2 · **Fuente:** M19 §11.11. Administración del portal, línea 1625 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Administraci%C3%B3n%20del%20portal/API-POR-121-b)

<a id="grupo-12"></a>

## Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01)

20 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-POR-122](#API-POR-122) | GET | `/api/por/contracts/{contractId}/calls` | Detalle de llamadas del período (PAN-POR-103): llamadas atribuidas de M10 con su importe tasado de M04, destino enmascarado, totales por... |
| [API-POR-123](#API-POR-123) | GET | `/api/por/contracts/{contractId}/installment-plan` | Plan de cuotas de obra del contrato, delegado en API-TAR-066 (M04): cuota n/N, cuotas facturadas, saldo, unidades, próxima cuota estimada... |
| [API-POR-124](#API-POR-124) | GET | `/api/public/{tenantSlug}/cemetery/deceased` | Búsqueda de difuntos delegada en API-SOC-061: nombre y ubicación, sin datos del titular del derecho (HUECO-CEM-02) |
| [API-POR-125](#API-POR-125) | GET | `/api/por/contracts/{contractId}/appliance-declarations/template` | Plantilla de DDJJ del servicio del contrato (PRM-CAT-110) leída de API-CAT-41: campos, unidad de potencia y obligatoriedad (HUE-GAS-01) |
| [API-POR-126](#API-POR-126) | GET | `/api/por/social/groups` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-b](#API-POR-126-b) | POST | `/api/por/social/groups` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-c](#API-POR-126-c) | GET | `/api/por/social/requests` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-d](#API-POR-126-d) | POST | `/api/por/social/requests` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-e](#API-POR-126-e) | GET | `/api/por/social/burial-rights` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-f](#API-POR-126-f) | POST | `/api/por/social/burial-rights` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-g](#API-POR-126-g) | GET | `/api/por/social/housing` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-126-h](#API-POR-126-h) | POST | `/api/por/social/housing` | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) |
| [API-POR-127](#API-POR-127) | GET | `/api/por/membership/me` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-b](#API-POR-127-b) | POST | `/api/por/membership/me` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-c](#API-POR-127-c) | GET | `/api/por/membership/capital-statement` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-d](#API-POR-127-d) | POST | `/api/por/membership/capital-statement` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-e](#API-POR-127-e) | GET | `/api/por/membership/credential` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-f](#API-POR-127-f) | POST | `/api/por/membership/credential` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-g](#API-POR-127-g) | GET | `/api/por/membership/requests` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |
| [API-POR-127-h](#API-POR-127-h) | POST | `/api/por/membership/requests` | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) |

<a id="API-POR-122"></a>
#### API-POR-122 · `GET /api/por/contracts/{contractId}/calls`

- **Qué hace:** Detalle de llamadas del período (PAN-POR-103): llamadas atribuidas de M10 con su importe tasado de M04, destino enmascarado, totales por... Consulta «calls» de un registro de `calls`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara… · RF-POR-175: Detalle de llamadas por período de una línea telefónica (PAN-POR-103): fecha y hora, número destino enmascarado según política, tipo (local, larga distancia, celular, CPP, internacional), duración e importe tasado; totales por…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.consumos.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-47 (Mis consumos), PAN-POR-103 (Detalle de llamadas).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1631 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-122)

<a id="API-POR-123"></a>
#### API-POR-123 · `GET /api/por/contracts/{contractId}/installment-plan`

- **Qué hace:** Plan de cuotas de obra del contrato, delegado en API-TAR-066 (M04): cuota n/N, cuotas facturadas, saldo, unidades, próxima cuota estimada... Consulta «installment-plan» de un registro de `installment-plan`.
- **Para qué sirve:** RF-POR-176: Bloque "Plan de cuotas de obra" en el detalle del contrato (PAN-POR-30) para contratos de obra (tipo 17): cuota actual n/N, cuotas facturadas, saldo, unidades facturadas sobre totales y próxima cuota estimada, en solo lectura…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.servicios.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-28 (Detalle de cuenta), PAN-POR-29 (Mis servicios), PAN-POR-30 (Detalle de servicio).
- **Ola:** O7 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1632 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-123)

<a id="API-POR-124"></a>
#### API-POR-124 · `GET /api/public/{tenantSlug}/cemetery/deceased`

- **Qué hace:** Búsqueda de difuntos delegada en API-SOC-061: nombre y ubicación, sin datos del titular del derecho (HUECO-CEM-02) Lista, con filtros y paginación, los registros de `deceased`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara… · RF-POR-177: Buscador público de difuntos en la landing (PAN-POR-104): por apellido y nombre devuelve nombre y ubicación (cementerio, sector, unidad) con datos de M18 (API-SOC-061). Solo se muestra si PRM-SOC-050 = true en algún…
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1633 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-124)

<a id="API-POR-125"></a>
#### API-POR-125 · `GET /api/por/contracts/{contractId}/appliance-declarations/template`

- **Qué hace:** Plantilla de DDJJ del servicio del contrato (PRM-CAT-110) leída de API-CAT-41: campos, unidad de potencia y obligatoriedad (HUE-GAS-01) Consulta `template`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara… · RF-POR-175: Detalle de llamadas por período de una línea telefónica (PAN-POR-103): fecha y hora, número destino enmascarado según política, tipo (local, larga distancia, celular, CPP, internacional), duración e importe tasado; totales por…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.ddjj.presentar`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-66 (Declaración jurada de artefactos).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1634 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-125)

<a id="API-POR-126"></a>
#### API-POR-126 · `GET /api/por/social/groups`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Consulta `groups`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126)

<a id="API-POR-126-b"></a>
#### API-POR-126-b · `POST /api/por/social/groups`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Registra un nuevo elemento u operación en `groups`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-31 (Solicitudes de prestación (componente embebido en PAN-POR-99)), PAN-POR-99 (Solicitudes sociales (tarjeta que embebe PAN-SOC-31)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-b)

<a id="API-POR-126-c"></a>
#### API-POR-126-c · `GET /api/por/social/requests`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Consulta `requests`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-c)

<a id="API-POR-126-d"></a>
#### API-POR-126-d · `POST /api/por/social/requests`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Registra un nuevo elemento u operación en `requests`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-31 (Solicitudes de prestación (componente embebido en PAN-POR-99)), PAN-POR-99 (Solicitudes sociales (tarjeta que embebe PAN-SOC-31)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-d)

<a id="API-POR-126-e"></a>
#### API-POR-126-e · `GET /api/por/social/burial-rights`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Consulta `burial-rights`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-e)

<a id="API-POR-126-f"></a>
#### API-POR-126-f · `POST /api/por/social/burial-rights`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Registra un nuevo elemento u operación en `burial-rights`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-31 (Solicitudes de prestación (componente embebido en PAN-POR-99)), PAN-POR-99 (Solicitudes sociales (tarjeta que embebe PAN-SOC-31)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-f)

<a id="API-POR-126-g"></a>
#### API-POR-126-g · `GET /api/por/social/housing`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Consulta `housing`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-g)

<a id="API-POR-126-h"></a>
#### API-POR-126-h · `POST /api/por/social/housing`

- **Qué hace:** Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) Registra un nuevo elemento u operación en `housing`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `soc.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-31 (Solicitudes de prestación (componente embebido en PAN-POR-99)), PAN-POR-99 (Solicitudes sociales (tarjeta que embebe PAN-SOC-31)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-126-h)

<a id="API-POR-127"></a>
#### API-POR-127 · `GET /api/por/membership/me`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Consulta `me`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127)

<a id="API-POR-127-b"></a>
#### API-POR-127-b · `POST /api/por/membership/me`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Registra un nuevo elemento u operación en `me`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-32 (Solicitud de ingreso).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-b)

<a id="API-POR-127-c"></a>
#### API-POR-127-c · `GET /api/por/membership/capital-statement`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Consulta `capital-statement`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-c)

<a id="API-POR-127-d"></a>
#### API-POR-127-d · `POST /api/por/membership/capital-statement`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Registra un nuevo elemento u operación en `capital-statement`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-32 (Solicitud de ingreso).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-d)

<a id="API-POR-127-e"></a>
#### API-POR-127-e · `GET /api/por/membership/credential`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Consulta `credential`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-e)

<a id="API-POR-127-f"></a>
#### API-POR-127-f · `POST /api/por/membership/credential`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Registra un nuevo elemento u operación en `credential`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-32 (Solicitud de ingreso).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-f)

<a id="API-POR-127-g"></a>
#### API-POR-127-g · `GET /api/por/membership/requests`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Consulta `requests`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-g)

<a id="API-POR-127-h"></a>
#### API-POR-127-h · `POST /api/por/membership/requests`

- **Qué hace:** Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) Registra un nuevo elemento u operación en `requests`.
- **Para qué sirve:** RF-POR-174: Composición de pantallas del socio: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de pwa-socio y landing; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara…
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ins.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-32 (Solicitud de ingreso).
- **Ola:** O2 · **Fuente:** M19 §11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01), línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m19-por#/Fachadas%20de%20composici%C3%B3n%20y%20consultas%20agregadas%20%28HUE-SRV-04%2C%20HUE-TEL-02%2C%20HUECO-OBR-03%2C%20HUECO-CEM-02%2C%20HUE-GAS-01%29/API-POR-127-h)
