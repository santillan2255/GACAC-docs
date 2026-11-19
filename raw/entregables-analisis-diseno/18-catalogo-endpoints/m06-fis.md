# Catálogo de endpoints · M06 · Fiscal e impuestos (ARCA, IVA, percepciones, retenciones, regímenes, terceros, reguladores)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Proveer a cada cooperativa (tenant) un módulo fiscal único que:

1. Autorice ante ARCA (ex AFIP) los comprobantes que emite el módulo de facturación (M05) y otros módulos emisores (M07, M11, M18), con autenticación WSAA, autorización WSFEv1 por CAE, CAEA para contingencia o modalidad habilitada, CAI para talonarios y CESP para liquidaciones de servicios públicos cuando corresponda, de forma masiva, resiliente, idempotente y conciliable (BASE §97.2, FIC 2.1, RN-03…
2. Determine la condición frente al IVA de emisor y receptor, valide la clase de comprobante (en particular la factura A, BASE §69) y calcule IVA, percepciones de IVA e Ingresos Brutos, tributos provinciales y municipales y conceptos por cuenta de terceros, con explicación reproducible de cada cálculo (RN-01 §17, AGR-010).
3. Opere como agente de retención y percepción (BASE §61, FIS-001): catálogo de organismos, regímenes y condición de agente; motor de retenciones a proveedores (invocado por M12/M14); certificados; obligaciones; preparación de declaraciones; registro de presentación, acuse y rectificación; conciliación con tesorería y contabilidad.
4. Prepare libros de IVA ventas y compras, el Libro IVA Digital, la conciliación contra "Mis Comprobantes" y los regímenes informativos (RG 3685/CITI histórico, RG 1361, RG 3349, RG 3571/RCSP y su versión RG 5746/2025, Circular 70/2021 ERSeP, SICORE, SIRE F2004/F2005, SIRCAR y exportadores provinciales) (MER-002, FIC 2.3).
5. Gestione convenios de cobro por cuenta y orden de terceros (tasas municipales, alumbrado público, fondos), su exhibición separada, el pasivo con el tercero y su rendición (BASE §97.4, FIC 9.2).
6. Genere los informes a entes reguladores (ERSeP, ENARGAS/ENReGE, ENACOM, Secretaría de Energía) y a la federación FECESCOR (MER-014, FIC 8, FIC 9.1).
7. Mantenga todas las tablas normativas (alícuotas, condiciones, códigos ARCA, regímenes, formatos, vencimientos, padrones) versionadas con fuente y vigencia, mantenidas por la plataforma y adoptadas por cada tenant, sin valores fiscales fijos en el código (BASE §52.1, §52.2, §61).

Detalle completo en el anexo M06, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m06-fis).

| Dato | Valor |
|---|---|
| Endpoints | 122 |
| Por método | DELETE 1, GET 42, POST 59, PUT 20 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 121 |
| Sin requisito identificable | 1 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 122 | Lista tablas y versiones.; Crea versión borrador con fuente.; Publica versión.… |

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

122 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FIS-01](#API-FIS-01) | GET | `/api/platform/fis/normative-tables` | Lista tablas y versiones. |
| [API-FIS-02](#API-FIS-02) | POST | `/api/platform/fis/normative-tables/{code}/versions` | Crea versión borrador con fuente. |
| [API-FIS-03](#API-FIS-03) | POST | `/api/platform/fis/normative-tables/{code}/versions/{id}/publish` | Publica versión. |
| [API-FIS-04](#API-FIS-04) | POST | `/api/platform/fis/arca-params/sync` | Sincroniza tablas ARCA. |
| [API-FIS-05](#API-FIS-05) | GET | `/api/admin/fis/normative-adoptions` | Versiones pendientes y adoptadas. |
| [API-FIS-07](#API-FIS-07) | POST | `/api/admin/fis/normative-adoptions` | Adopta con fecha efectiva. |
| [API-FIS-06](#API-FIS-06) | POST | `/api/admin/fis/normative-adoptions/{versionId}/simulate` | Simula impacto. |
| [API-FIS-08](#API-FIS-08) | GET | `/api/admin/fis/profile` | Perfil fiscal (nueva versión en PUT) |
| [API-FIS-08-b](#API-FIS-08-b) | PUT | `/api/admin/fis/profile` | Perfil fiscal (nueva versión en PUT) |
| [API-FIS-09](#API-FIS-09) | GET | `/api/admin/fis/surveys` | Relevamiento fiscal. |
| [API-FIS-09-c](#API-FIS-09-c) | PUT | `/api/admin/fis/surveys` | Relevamiento fiscal. |
| [API-FIS-09-b](#API-FIS-09-b) | POST | `/api/admin/fis/surveys` | Relevamiento fiscal. |
| [API-FIS-10](#API-FIS-10) | GET | `/api/admin/fis/agent-registrations` | Condiciones de agente. |
| [API-FIS-10-c](#API-FIS-10-c) | PUT | `/api/admin/fis/agent-registrations` | Condiciones de agente. |
| [API-FIS-10-b](#API-FIS-10-b) | POST | `/api/admin/fis/agent-registrations` | Condiciones de agente. |
| [API-FIS-11](#API-FIS-11) | POST | `/api/admin/fis/arca/credentials/csr` | Genera clave y CSR en bóveda. |
| [API-FIS-12](#API-FIS-12) | POST | `/api/admin/fis/arca/credentials` | Sube certificado (multipart) |
| [API-FIS-13](#API-FIS-13) | POST | `/api/admin/fis/arca/credentials/{id}/test` | Prueba el conector. |
| [API-FIS-14](#API-FIS-14) | POST | `/api/admin/fis/arca/credentials/{id}/activate` | Activa producción. |
| [API-FIS-15](#API-FIS-15) | POST | `/api/admin/fis/arca/credentials/{id}/revoke` | Revoca. |
| [API-FIS-16](#API-FIS-16) | GET | `/api/admin/fis/connector/status` | Estado observable. |
| [API-FIS-17](#API-FIS-17) | GET | `/api/admin/fis/points-of-sale` | Puntos de venta y modalidades. |
| [API-FIS-17-c](#API-FIS-17-c) | PUT | `/api/admin/fis/points-of-sale` | Puntos de venta y modalidades. |
| [API-FIS-17-b](#API-FIS-17-b) | POST | `/api/admin/fis/points-of-sale` | Puntos de venta y modalidades. |
| [API-FIS-18](#API-FIS-18) | POST | `/api/admin/fis/points-of-sale/sync` | Sincroniza con FEParamGetPtosVenta. |
| [API-FIS-19](#API-FIS-19) | POST | `/api/admin/fis/points-of-sale/{id}/pause` | Pausa o reanuda. |
| [API-FIS-19-b](#API-FIS-19-b) | POST | `/api/admin/fis/points-of-sale/{id}/resume` | Pausa o reanuda. |
| [API-FIS-20](#API-FIS-20) | GET | `/api/admin/fis/authorizations` | Lista paginada con filtros. |
| [API-FIS-21](#API-FIS-21) | GET | `/api/admin/fis/authorizations/{id}` | Detalle, intentos, traza. |
| [API-FIS-22](#API-FIS-22) | POST | `/api/admin/fis/authorizations/submit` | Encola selección (ids o filtros) |
| [API-FIS-23](#API-FIS-23) | POST | `/api/admin/fis/authorizations/{id}/retry` | Reintenta (consulta previa si incierto) |
| [API-FIS-24](#API-FIS-24) | POST | `/api/admin/fis/authorizations/{id}/await` | Espera sincrónica con timeout. |
| [API-FIS-25](#API-FIS-25) | GET | `/api/admin/fis/authorizations/{id}/preview` | Vista previa del request. |
| [API-FIS-26](#API-FIS-26) | POST | `/api/admin/fis/authorizations/{id}/derive` | Deriva a corrección (responsable) |
| [API-FIS-27](#API-FIS-27) | PUT | `/api/admin/fis/authorizations/auto` | Enciende/apaga autorización automática. |
| [API-FIS-28](#API-FIS-28) | GET | `/api/admin/fis/arca/last-authorized` | FECompUltimoAutorizado. |
| [API-FIS-29](#API-FIS-29) | GET | `/api/admin/fis/arca/document` | FECompConsultar. |
| [API-FIS-30](#API-FIS-30) | POST | `/api/admin/fis/reconciliations/arca` | Ejecuta conciliación de inconsistencias. |
| [API-FIS-31](#API-FIS-31) | POST | `/api/admin/fis/reconciliations/arca/{id}/approve` | Aprueba reparación. |
| [API-FIS-32](#API-FIS-32) | GET | `/api/admin/fis/caea` | Lista / solicita o consulta CAEA. |
| [API-FIS-32-b](#API-FIS-32-b) | POST | `/api/admin/fis/caea` | Lista / solicita o consulta CAEA. |
| [API-FIS-33](#API-FIS-33) | POST | `/api/admin/fis/caea/{id}/report` | Informa comprobantes CAEA. |
| [API-FIS-34](#API-FIS-34) | POST | `/api/admin/fis/caea/{id}/report-no-movement` | Informa sin movimiento. |
| [API-FIS-35](#API-FIS-35) | POST | `/api/admin/fis/contingency` | Activa/desactiva contingencia. |
| [API-FIS-36](#API-FIS-36) | GET | `/api/admin/fis/cesp` | CESP. |
| [API-FIS-36-c](#API-FIS-36-c) | PUT | `/api/admin/fis/cesp` | CESP. |
| [API-FIS-36-b](#API-FIS-36-b) | POST | `/api/admin/fis/cesp` | CESP. |
| [API-FIS-37](#API-FIS-37) | GET | `/api/admin/fis/cvp` | CVP. |
| [API-FIS-37-c](#API-FIS-37-c) | PUT | `/api/admin/fis/cvp` | CVP. |
| [API-FIS-37-b](#API-FIS-37-b) | POST | `/api/admin/fis/cvp` | CVP. |
| [API-FIS-38](#API-FIS-38) | GET | `/api/admin/fis/vat/conditions` | Configuración por condición IVA. |
| [API-FIS-38-b](#API-FIS-38-b) | PUT | `/api/admin/fis/vat/conditions` | Configuración por condición IVA. |
| [API-FIS-39](#API-FIS-39) | GET | `/api/admin/fis/vat/rates` | Alícuotas y matriz. |
| [API-FIS-39-b](#API-FIS-39-b) | PUT | `/api/admin/fis/vat/rates` | Alícuotas y matriz. |
| [API-FIS-39-c](#API-FIS-39-c) | GET | `/api/admin/fis/vat/matrix` | Alícuotas y matriz. |
| [API-FIS-39-d](#API-FIS-39-d) | PUT | `/api/admin/fis/vat/matrix` | Alícuotas y matriz. |
| [API-FIS-40](#API-FIS-40) | GET | `/api/admin/fis/taxes` | Catálogo de tributos. |
| [API-FIS-40-c](#API-FIS-40-c) | PUT | `/api/admin/fis/taxes` | Catálogo de tributos. |
| [API-FIS-40-b](#API-FIS-40-b) | POST | `/api/admin/fis/taxes` | Catálogo de tributos. |
| [API-FIS-41](#API-FIS-41) | GET | `/api/admin/fis/gross-income` | Configuración IIBB. |
| [API-FIS-41-b](#API-FIS-41-b) | PUT | `/api/admin/fis/gross-income` | Configuración IIBB. |
| [API-FIS-42](#API-FIS-42) | POST | `/api/admin/fis/tax-engine/calculate` | Calcula impuestos de un documento. |
| [API-FIS-43](#API-FIS-43) | GET | `/api/admin/fis/tax-engine/traces/{documentId}` | Traza de cálculo. |
| [API-FIS-45](#API-FIS-45) | GET | `/api/admin/fis/registries` | Lista / importa padrón. |
| [API-FIS-45-b](#API-FIS-45-b) | POST | `/api/admin/fis/registries` | Lista / importa padrón. |
| [API-FIS-46](#API-FIS-46) | POST | `/api/admin/fis/registries/{id}/approve` | Activa padrón. |
| [API-FIS-48](#API-FIS-48) | GET | `/api/admin/fis/determined-rates` | Alícuotas determinadas y exclusiones. |
| [API-FIS-48-c](#API-FIS-48-c) | PUT | `/api/admin/fis/determined-rates` | Alícuotas determinadas y exclusiones. |
| [API-FIS-48-b](#API-FIS-48-b) | POST | `/api/admin/fis/determined-rates` | Alícuotas determinadas y exclusiones. |
| [API-FIS-48-d](#API-FIS-48-d) | GET | `/api/admin/fis/exemptions` | Alícuotas determinadas y exclusiones. |
| [API-FIS-48-f](#API-FIS-48-f) | PUT | `/api/admin/fis/exemptions` | Alícuotas determinadas y exclusiones. |
| [API-FIS-48-e](#API-FIS-48-e) | POST | `/api/admin/fis/exemptions` | Alícuotas determinadas y exclusiones. |
| [API-FIS-49](#API-FIS-49) | GET | `/api/admin/fis/taxpayer-lookup` | Consulta A13/constancia. |
| [API-FIS-50](#API-FIS-50) | POST | `/api/admin/fis/taxpayer-lookup/revalidations` | Lanza revalidación masiva. |
| [API-FIS-51](#API-FIS-51) | GET | `/api/admin/fis/withholding/types` | Configuración de retenciones. |
| [API-FIS-51-c](#API-FIS-51-c) | PUT | `/api/admin/fis/withholding/types` | Configuración de retenciones. |
| [API-FIS-51-b](#API-FIS-51-b) | POST | `/api/admin/fis/withholding/types` | Configuración de retenciones. |
| [API-FIS-51-d](#API-FIS-51-d) | GET | `/api/admin/fis/withholding/scales` | Configuración de retenciones. |
| [API-FIS-51-f](#API-FIS-51-f) | PUT | `/api/admin/fis/withholding/scales` | Configuración de retenciones. |
| [API-FIS-51-e](#API-FIS-51-e) | POST | `/api/admin/fis/withholding/scales` | Configuración de retenciones. |
| [API-FIS-51-g](#API-FIS-51-g) | GET | `/api/admin/fis/withholding/assignments` | Configuración de retenciones. |
| [API-FIS-51-i](#API-FIS-51-i) | PUT | `/api/admin/fis/withholding/assignments` | Configuración de retenciones. |
| [API-FIS-51-h](#API-FIS-51-h) | POST | `/api/admin/fis/withholding/assignments` | Configuración de retenciones. |
| [API-FIS-52](#API-FIS-52) | POST | `/api/admin/fis/withholding/calculate` | Calcula retenciones de una OP. |
| [API-FIS-55](#API-FIS-55) | GET | `/api/admin/fis/withholding/applied` | Retenciones practicadas. |
| [API-FIS-56](#API-FIS-56) | GET | `/api/admin/fis/withholding/{id}/certificate.pdf` | Certificado (URL firmada) |
| [API-FIS-57](#API-FIS-57) | GET | `/api/admin/fis/withholding/suffered-types` | Tipos de retenciones sufridas. |
| [API-FIS-57-c](#API-FIS-57-c) | PUT | `/api/admin/fis/withholding/suffered-types` | Tipos de retenciones sufridas. |
| [API-FIS-57-b](#API-FIS-57-b) | POST | `/api/admin/fis/withholding/suffered-types` | Tipos de retenciones sufridas. |
| [API-FIS-58](#API-FIS-58) | GET | `/api/admin/fis/obligations` | Obligaciones y calendario. |
| [API-FIS-59](#API-FIS-59) | POST | `/api/admin/fis/vat-ledgers` | Genera libro (job) |
| [API-FIS-60](#API-FIS-60) | POST | `/api/admin/fis/vat-ledgers/{id}/close` | Cierra/reabre. |
| [API-FIS-60-b](#API-FIS-60-b) | POST | `/api/admin/fis/vat-ledgers/{id}/reopen` | Cierra/reabre. |
| [API-FIS-61](#API-FIS-61) | POST | `/api/admin/fis/arca-received/imports` | Importa archivo de ARCA. |
| [API-FIS-62](#API-FIS-62) | GET | `/api/admin/fis/arca-received/reconciliations/{id}` | Resultado de conciliación. |
| [API-FIS-63](#API-FIS-63) | GET | `/api/admin/fis/filings` | Lista / genera declaración. |
| [API-FIS-63-b](#API-FIS-63-b) | POST | `/api/admin/fis/filings` | Lista / genera declaración. |
| [API-FIS-64](#API-FIS-64) | POST | `/api/admin/fis/filings/{id}/validate` | Valida archivos. |
| [API-FIS-65](#API-FIS-65) | POST | `/api/admin/fis/filings/{id}/approve` | Aprueba. |
| [API-FIS-66](#API-FIS-66) | POST | `/api/admin/fis/filings/{id}/submission` | Registra presentación y acuse. |
| [API-FIS-67](#API-FIS-67) | POST | `/api/admin/fis/filings/{id}/result` | Registra aceptación/rechazo. |
| [API-FIS-68](#API-FIS-68) | POST | `/api/admin/fis/filings/{id}/rectify` | Crea rectificativa. |
| [API-FIS-69](#API-FIS-69) | POST | `/api/admin/fis/files/analyze` | Analiza archivo por línea/correlatividad. |
| [API-FIS-70](#API-FIS-70) | GET | `/api/admin/fis/third-parties/agreements` | Convenios. |
| [API-FIS-70-c](#API-FIS-70-c) | PUT | `/api/admin/fis/third-parties/agreements` | Convenios. |
| [API-FIS-70-b](#API-FIS-70-b) | POST | `/api/admin/fis/third-parties/agreements` | Convenios. |
| [API-FIS-71](#API-FIS-71) | GET | `/api/admin/fis/third-parties/remittances` | Rendiciones. |
| [API-FIS-71-b](#API-FIS-71-b) | POST | `/api/admin/fis/third-parties/remittances` | Rendiciones. |
| [API-FIS-72](#API-FIS-72) | POST | `/api/admin/fis/third-parties/remittances/{id}/approve` | Aprueba y solicita OP a M14. |
| [API-FIS-73](#API-FIS-73) | GET | `/api/admin/fis/regulatory/runs` | Informes regulatorios. |
| [API-FIS-73-b](#API-FIS-73-b) | POST | `/api/admin/fis/regulatory/runs` | Informes regulatorios. |
| [API-FIS-74](#API-FIS-74) | POST | `/api/admin/fis/regulatory/runs/{id}/submission` | Presentación y acuse. |
| [API-FIS-75](#API-FIS-75) | GET | `/api/admin/fis/regulatory/concept-maps` | Mapas de conceptos. |
| [API-FIS-75-b](#API-FIS-75-b) | PUT | `/api/admin/fis/regulatory/concept-maps` | Mapas de conceptos. |
| [API-FIS-76](#API-FIS-76) | GET | `/api/admin/fis/public-admin/selections` | Selección de administración pública (DELETE quita ítems, no borra comprobantes) |
| [API-FIS-76-b](#API-FIS-76-b) | POST | `/api/admin/fis/public-admin/selections` | Selección de administración pública (DELETE quita ítems, no borra comprobantes) |
| [API-FIS-76-c](#API-FIS-76-c) | DELETE | `/api/admin/fis/public-admin/selections` | Selección de administración pública (DELETE quita ítems, no borra comprobantes) |
| [API-FIS-77](#API-FIS-77) | POST | `/api/v1/ext/fis/documents` | Envía comprobante externo. |
| [API-FIS-78](#API-FIS-78) | GET | `/api/v1/ext/fis/documents/{id}` | Estado y CAE. |
| [API-FIS-79](#API-FIS-79) | POST | `/api/admin/fis/gateway/imports` | Importa CSV del modo pasarela. |
| [API-FIS-80](#API-FIS-80) | GET | `/api/admin/fis/reports/{code}` | Reportes de la sección 15. |
| [API-FIS-81](#API-FIS-81) | GET | `/api/fis/documents/{documentId}/fiscal-data` | CAE, vencimiento, QR y leyendas del propio comprobante. |

<a id="API-FIS-01"></a>
#### API-FIS-01 · `GET /api/platform/fis/normative-tables`

- **Qué hace:** Lista tablas y versiones. Lista, con filtros y paginación, los registros de catálogo de tablas normativas fiscales y regulatorias (`normativeTables`).
- **Para qué sirve:** RF-FIS-001: Catálogo de tablas normativas fiscales mantenido por la plataforma (tenant PLATFORM): cada versión con fuente (norma, organismo, URL, fecha de consulta), vigencia desde/hasta, estado (borrador, en revisión, publicada, retirada) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `fis.tablasNormativas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo de tablas normativas fiscales y regulatorias (`normativeTables`) con `total`.
- **Pantallas:** PAN-FIS-01 (Catálogo de tablas normativas).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-01)

<a id="API-FIS-02"></a>
#### API-FIS-02 · `POST /api/platform/fis/normative-tables/{code}/versions`

- **Qué hace:** Crea versión borrador con fuente. Agrega un elemento («versions») a un registro de catálogo de tablas normativas fiscales y regulatorias (`normativeTables`).
- **Para qué sirve:** RF-FIS-001: Catálogo de tablas normativas fiscales mantenido por la plataforma (tenant PLATFORM): cada versión con fuente (norma, organismo, URL, fecha de consulta), vigencia desde/hasta, estado (borrador, en revisión, publicada, retirada) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `fis.tablasNormativas.crear`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1829 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-02)

<a id="API-FIS-03"></a>
#### API-FIS-03 · `POST /api/platform/fis/normative-tables/{code}/versions/{id}/publish`

- **Qué hace:** Publica versión. Publica un registro de catálogo de tablas normativas fiscales y regulatorias (`normativeTables`).
- **Para qué sirve:** RF-FIS-001: Catálogo de tablas normativas fiscales mantenido por la plataforma (tenant PLATFORM): cada versión con fuente (norma, organismo, URL, fecha de consulta), vigencia desde/hasta, estado (borrador, en revisión, publicada, retirada) y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `fis.tablasNormativas.publicar`.
- **Recibe:** en la ruta `code`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-03)

<a id="API-FIS-04"></a>
#### API-FIS-04 · `POST /api/platform/fis/arca-params/sync`

- **Qué hace:** Sincroniza tablas ARCA. Sincroniza sobre `sync`.
- **Para qué sirve:** RF-FIS-004: Sincronización de tablas paramétricas ARCA (FEParamGetTiposCbte, TiposMonedas, TiposIva, TiposConcepto, TiposTributos, TiposDoc, TiposOpcional, TiposPaises, CondicionIvaReceptor, Actividades, Cotizacion) por job de plataforma en… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `fis.arcaParametros.sincronizar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-02 (Sincronización de tablas ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-04)

<a id="API-FIS-05"></a>
#### API-FIS-05 · `GET /api/admin/fis/normative-adoptions`

- **Qué hace:** Versiones pendientes y adoptadas. Lista, con filtros y paginación, los registros de adopción por tenant con filas propias (`normativeAdoptions`).
- **Para qué sirve:** RF-FIS-005: Historia bitemporal: fecha efectiva y fecha de registro de cada versión y adopción; reconstrucción de qué tablas, reglas y versiones se usaron en cada comprobante, retención o declaración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.tablasNormativas.adoptar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de adopción por tenant con filas propias (`normativeAdoptions`) con `total`.
- **Pantallas:** PAN-FIS-03 (Adopción de versiones por el tenant).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-05)

<a id="API-FIS-07"></a>
#### API-FIS-07 · `POST /api/admin/fis/normative-adoptions`

- **Qué hace:** Adopta con fecha efectiva. Da de alta un registro de adopción por tenant con filas propias (`normativeAdoptions`).
- **Para qué sirve:** RF-FIS-005: Historia bitemporal: fecha efectiva y fecha de registro de cada versión y adopción; reconstrucción de qué tablas, reglas y versiones se usaron en cada comprobante, retención o declaración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.tablasNormativas.adoptar`.
- **Recibe:** los datos de adopción por tenant con filas propias (`normativeAdoptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de adopción por tenant con filas propias (`normativeAdoptions`).
- **Pantallas:** PAN-FIS-03 (Adopción de versiones por el tenant).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1834 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-07)

<a id="API-FIS-06"></a>
#### API-FIS-06 · `POST /api/admin/fis/normative-adoptions/{versionId}/simulate`

- **Qué hace:** Simula impacto. Simula sin efectos un registro de adopción por tenant con filas propias (`normativeAdoptions`).
- **Para qué sirve:** RF-FIS-009: Simulación de una nueva versión de tabla normativa sobre los comprobantes de un período (sin efectos) antes de adoptarla, con diferencias por comprobante. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.tablasNormativas.adoptar`.
- **Recibe:** en la ruta `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-03 (Adopción de versiones por el tenant).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-06)

<a id="API-FIS-08"></a>
#### API-FIS-08 · `GET /api/admin/fis/profile`

- **Qué hace:** Perfil fiscal (nueva versión en PUT) Consulta `profile`.
- **Para qué sirve:** RF-FIS-002: Adopción por tenant de cada versión publicada con fecha efectiva y aprobación del responsable fiscal; sin adopción la versión no se aplica en producción. Notificación al tenant cuando la plataforma publica una nueva versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.perfil.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-04 (Perfil fiscal del tenant).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-08)

<a id="API-FIS-08-b"></a>
#### API-FIS-08-b · `PUT /api/admin/fis/profile`

- **Qué hace:** Perfil fiscal (nueva versión en PUT) Reemplaza o configura `profile`.
- **Para qué sirve:** RF-FIS-002: Adopción por tenant de cada versión publicada con fecha efectiva y aprobación del responsable fiscal; sin adopción la versión no se aplica en producción. Notificación al tenant cuando la plataforma publica una nueva versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.perfil.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-05 (Relevamiento fiscal).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-08-b)

<a id="API-FIS-09"></a>
#### API-FIS-09 · `GET /api/admin/fis/surveys`

- **Qué hace:** Relevamiento fiscal. Lista, con filtros y paginación, los registros de relevamiento fiscal (`fiscalSurveys`).
- **Para qué sirve:** RF-FIS-129: RG 3349 consumos relevantes con opción de incluir conceptos asociados al servicio (V2 2358). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.perfil.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de relevamiento fiscal (`fiscalSurveys`) con `total`.
- **Pantallas:** PAN-FIS-05 (Relevamiento fiscal).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-09)

<a id="API-FIS-09-c"></a>
#### API-FIS-09-c · `PUT /api/admin/fis/surveys`

- **Qué hace:** Relevamiento fiscal. Reemplaza o configura relevamiento fiscal (`fiscalSurveys`).
- **Para qué sirve:** RF-FIS-129: RG 3349 consumos relevantes con opción de incluir conceptos asociados al servicio (V2 2358). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.perfil.editar`.
- **Recibe:** los datos de relevamiento fiscal (`fiscalSurveys`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de relevamiento fiscal (`fiscalSurveys`).
- **Pantallas:** PAN-FIS-05 (Relevamiento fiscal).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-09-c)

<a id="API-FIS-09-b"></a>
#### API-FIS-09-b · `POST /api/admin/fis/surveys`

- **Qué hace:** Relevamiento fiscal. Da de alta un registro de relevamiento fiscal (`fiscalSurveys`).
- **Para qué sirve:** RF-FIS-129: RG 3349 consumos relevantes con opción de incluir conceptos asociados al servicio (V2 2358). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.perfil.editar`.
- **Recibe:** los datos de relevamiento fiscal (`fiscalSurveys`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de relevamiento fiscal (`fiscalSurveys`).
- **Pantallas:** PAN-FIS-05 (Relevamiento fiscal).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-09-b)

<a id="API-FIS-10"></a>
#### API-FIS-10 · `GET /api/admin/fis/agent-registrations`

- **Qué hace:** Condiciones de agente. Lista, con filtros y paginación, los registros de condiciones de agente de retención/percepción (`taxAgentRegistrations`).
- **Para qué sirve:** RF-FIS-014: Condiciones de agente: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de condiciones de agente de retención/percepción (`taxAgentRegistrations`) con `total`.
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-10)

<a id="API-FIS-10-c"></a>
#### API-FIS-10-c · `PUT /api/admin/fis/agent-registrations`

- **Qué hace:** Condiciones de agente. Reemplaza o configura condiciones de agente de retención/percepción (`taxAgentRegistrations`).
- **Para qué sirve:** RF-FIS-014: Condiciones de agente: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de condiciones de agente de retención/percepción (`taxAgentRegistrations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de condiciones de agente de retención/percepción (`taxAgentRegistrations`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-10-c)

<a id="API-FIS-10-b"></a>
#### API-FIS-10-b · `POST /api/admin/fis/agent-registrations`

- **Qué hace:** Condiciones de agente. Da de alta un registro de condiciones de agente de retención/percepción (`taxAgentRegistrations`).
- **Para qué sirve:** RF-FIS-014: Condiciones de agente: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de condiciones de agente de retención/percepción (`taxAgentRegistrations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de condiciones de agente de retención/percepción (`taxAgentRegistrations`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-10-b)

<a id="API-FIS-11"></a>
#### API-FIS-11 · `POST /api/admin/fis/arca/credentials/csr`

- **Qué hace:** Genera clave y CSR en bóveda. Registra un nuevo elemento u operación en metadatos de certificado ARCA (`arcaCredentials`).
- **Para qué sirve:** RF-FIS-025: Generación de clave y CSR dentro de la plataforma para que el tenant obtenga el certificado en ARCA, o carga de un PFX existente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.arca.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-07 (Certificados y conector ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1838 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-11)

<a id="API-FIS-12"></a>
#### API-FIS-12 · `POST /api/admin/fis/arca/credentials`

- **Qué hace:** Sube certificado (multipart) Da de alta un registro de metadatos de certificado ARCA (`arcaCredentials`).
- **Para qué sirve:** RF-FIS-024: Certificados por tenant y ambiente (homologación/producción) en la bóveda de credenciales del tenant; en la base solo metadatos: CUIT, alias, emisor, número de serie, NotBefore/NotAfter, servicios autorizados (wsfe… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.arca.configurar`.
- **Recibe:** los datos de metadatos de certificado ARCA (`arcaCredentials`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de metadatos de certificado ARCA (`arcaCredentials`).
- **Pantallas:** PAN-FIS-07 (Certificados y conector ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-12)

<a id="API-FIS-13"></a>
#### API-FIS-13 · `POST /api/admin/fis/arca/credentials/{id}/test`

- **Qué hace:** Prueba el conector. Prueba un registro de metadatos de certificado ARCA (`arcaCredentials`).
- **Para qué sirve:** RF-FIS-031: Estado observable del conector por tenant (AGR-021): último éxito, último error, certificado, TA vigente, cola pendiente, servicios de ARCA caídos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.arca.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-07 (Certificados y conector ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-13)

<a id="API-FIS-14"></a>
#### API-FIS-14 · `POST /api/admin/fis/arca/credentials/{id}/activate`

- **Qué hace:** Activa producción. Activa un registro de metadatos de certificado ARCA (`arcaCredentials`).
- **Para qué sirve:** RF-FIS-024: Certificados por tenant y ambiente (homologación/producción) en la bóveda de credenciales del tenant; en la base solo metadatos: CUIT, alias, emisor, número de serie, NotBefore/NotAfter, servicios autorizados (wsfe… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.arca.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-07 (Certificados y conector ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-14)

<a id="API-FIS-15"></a>
#### API-FIS-15 · `POST /api/admin/fis/arca/credentials/{id}/revoke`

- **Qué hace:** Revoca. Revoca un registro de metadatos de certificado ARCA (`arcaCredentials`).
- **Para qué sirve:** RF-FIS-024: Certificados por tenant y ambiente (homologación/producción) en la bóveda de credenciales del tenant; en la base solo metadatos: CUIT, alias, emisor, número de serie, NotBefore/NotAfter, servicios autorizados (wsfe… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.arca.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-07 (Certificados y conector ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-15)

<a id="API-FIS-16"></a>
#### API-FIS-16 · `GET /api/admin/fis/connector/status`

- **Qué hace:** Estado observable. Consulta `status`.
- **Para qué sirve:** RF-FIS-031: Estado observable del conector por tenant (AGR-021): último éxito, último error, certificado, TA vigente, cola pendiente, servicios de ARCA caídos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.conector.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-39 (Estado del conector fiscal).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-16)

<a id="API-FIS-17"></a>
#### API-FIS-17 · `GET /api/admin/fis/points-of-sale`

- **Qué hace:** Puntos de venta y modalidades. Lista, con filtros y paginación, los registros de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-034: Modalidad por (tipo de comprobante × punto de venta): CAE, CAEA, CAI o CESP, con prioridad de asignación CAEA (si hay vigente y la modalidad está activa) → CAE → CAI → CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de (punto de venta único: canónica en M06) (`pointsOfSale`) con `total`.
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-17)

<a id="API-FIS-17-c"></a>
#### API-FIS-17-c · `PUT /api/admin/fis/points-of-sale`

- **Qué hace:** Puntos de venta y modalidades. Reemplaza o configura (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-034: Modalidad por (tipo de comprobante × punto de venta): CAE, CAEA, CAI o CESP, con prioridad de asignación CAEA (si hay vigente y la modalidad está activa) → CAE → CAI → CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** los datos de (punto de venta único: canónica en M06) (`pointsOfSale`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-17-c)

<a id="API-FIS-17-b"></a>
#### API-FIS-17-b · `POST /api/admin/fis/points-of-sale`

- **Qué hace:** Puntos de venta y modalidades. Da de alta un registro de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-034: Modalidad por (tipo de comprobante × punto de venta): CAE, CAEA, CAI o CESP, con prioridad de asignación CAEA (si hay vigente y la modalidad está activa) → CAE → CAI → CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** los datos de (punto de venta único: canónica en M06) (`pointsOfSale`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-17-b)

<a id="API-FIS-18"></a>
#### API-FIS-18 · `POST /api/admin/fis/points-of-sale/sync`

- **Qué hace:** Sincroniza con FEParamGetPtosVenta. Sincroniza sobre (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-033: Puntos de venta fiscales: número, descripción, sistema de emisión ARCA (web service CAE, CAEA, CAI talonario), sucursal, servicio/canal, domicilio, estado (activo, pausado, baja); sincronización con FEParamGetPtosVenta (no… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1845 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-18)

<a id="API-FIS-19"></a>
#### API-FIS-19 · `POST /api/admin/fis/points-of-sale/{id}/pause`

- **Qué hace:** Pausa o reanuda. Pausa un registro de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-068: CAEA sin movimiento (FECAEASinMovimientoInformar) por punto de venta sin uso en la quincena. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-19)

<a id="API-FIS-19-b"></a>
#### API-FIS-19-b · `POST /api/admin/fis/points-of-sale/{id}/resume`

- **Qué hace:** Pausa o reanuda. Reanuda un registro de (punto de venta único: canónica en M06) (`pointsOfSale`).
- **Para qué sirve:** RF-FIS-068: CAEA sin movimiento (FECAEASinMovimientoInformar) por punto de venta sin uso en la quincena. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-19-b)

<a id="API-FIS-20"></a>
#### API-FIS-20 · `GET /api/admin/fis/authorizations`

- **Qué hace:** Lista paginada con filtros. Lista, con filtros y paginación, los registros de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-074: Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. · RF-FIS-131: SIRCAR: percepciones y retenciones de IIBB por jurisdicción (Córdoba, Río Negro; 904 con constancia), versión de formato (v12 o anterior), validación de CUIT con lista de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de autorizaciones CESP (`cespAuthorizations`) con `total`.
- **Pantallas:** PAN-FIS-09 (Tablero de la cola de autorización).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1847 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-20)

<a id="API-FIS-21"></a>
#### API-FIS-21 · `GET /api/admin/fis/authorizations/{id}`

- **Qué hace:** Detalle, intentos, traza. Obtiene el detalle de un registro de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-083: Traza de cálculo por comprobante: reglas, versiones, bases, alícuotas, mínimos y exclusiones aplicadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de autorizaciones CESP (`cespAuthorizations`).
- **Pantallas:** PAN-FIS-09 (Tablero de la cola de autorización).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1848 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-21)

<a id="API-FIS-22"></a>
#### API-FIS-22 · `POST /api/admin/fis/authorizations/submit`

- **Qué hace:** Encola selección (ids o filtros) Envía a revisión o presenta sobre autorizaciones CESP (`cespAuthorizations`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FIS-151: Selección de facturas impagas de cuentas de organismos públicos (u otras liquidadas en bloque) por período o fecha de emisión, con filtros (empresa postal, cuenta, titular, tipo de factura, servicio, rango de vencimiento) y datos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.enviar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-22)

<a id="API-FIS-23"></a>
#### API-FIS-23 · `POST /api/admin/fis/authorizations/{id}/retry`

- **Qué hace:** Reintenta (consulta previa si incierto) Reintenta un registro de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-060: Tablero de autorizaciones por estado, punto, tipo y fecha, con motivo de ARCA, acciones masivas (reintentar, consultar, derivar) y exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1850 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-23)

<a id="API-FIS-24"></a>
#### API-FIS-24 · `POST /api/admin/fis/authorizations/{id}/await`

- **Qué hace:** Espera sincrónica con timeout. Pone en espera un registro de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-056: Disparo: automático (activable por tenant y por punto, V2 726) con auditoría de cada encendido/apagado; manual por selección; espera sincrónica breve para venta mostrador y cobranza con factura (V2 727). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-24)

<a id="API-FIS-25"></a>
#### API-FIS-25 · `GET /api/admin/fis/authorizations/{id}/preview`

- **Qué hace:** Vista previa del request. Consulta «preview» de un registro de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-055: Vista previa del request que aplica todas las reglas según el código ARCA real (C, FCE, asociados), sin enviarlo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.autorizaciones.previsualizar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de autorizaciones CESP (`cespAuthorizations`).
- **Pantallas:** PAN-FIS-11 (Vista previa del request).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1852 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-25)

<a id="API-FIS-26"></a>
#### API-FIS-26 · `POST /api/admin/fis/authorizations/{id}/derive`

- **Qué hace:** Deriva a corrección (responsable) Deriva un registro de autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-042: Prevalidación fiscal en lote (BASE §69): un caso configurado como factura A sin CUIT se identifica como dict:fis.motivo.facturaASinCuit ("No apto para emisión: falta CUIT del receptor") y se deriva a corrección; no se inventa el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.bandeja.derivar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-26)

<a id="API-FIS-27"></a>
#### API-FIS-27 · `PUT /api/admin/fis/authorizations/auto`

- **Qué hace:** Enciende/apaga autorización automática. Reemplaza o configura autorizaciones CESP (`cespAuthorizations`).
- **Para qué sirve:** RF-FIS-167: Emisión fiscal por entidad jurídica (DEC-064): perfil fiscal, CUIT, credencial ARCA, puntos de venta, CAEA/CESP, libros IVA, regímenes y obligaciones por legalEntityId (RN-FIS-130). T04 guarda solo los datos legales básicos de la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.puntosVenta.configurar`.
- **Recibe:** los datos de autorizaciones CESP (`cespAuthorizations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de autorizaciones CESP (`cespAuthorizations`).
- **Pantallas:** PAN-FIS-08 (Puntos de venta y modalidades).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1854 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-27)

<a id="API-FIS-28"></a>
#### API-FIS-28 · `GET /api/admin/fis/arca/last-authorized`

- **Qué hace:** FECompUltimoAutorizado. Consulta `last-authorized`.
- **Para qué sirve:** RF-FIS-037: Consulta de último comprobante autorizado (FECompUltimoAutorizado) y de un comprobante (FECompConsultar) a demanda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.ultimoComprobante.consultar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-12 (Consultas a ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1855 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-28)

<a id="API-FIS-29"></a>
#### API-FIS-29 · `GET /api/admin/fis/arca/document`

- **Qué hace:** FECompConsultar. Consulta `document`.
- **Para qué sirve:** RF-FIS-037: Consulta de último comprobante autorizado (FECompUltimoAutorizado) y de un comprobante (FECompConsultar) a demanda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.ultimoComprobante.consultar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-12 (Consultas a ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-29)

<a id="API-FIS-30"></a>
#### API-FIS-30 · `POST /api/admin/fis/reconciliations/arca`

- **Qué hace:** Ejecuta conciliación de inconsistencias. Registra un nuevo elemento u operación en conciliación con ARCA (`vatReconciliations`).
- **Para qué sirve:** RF-FIS-059: Conciliación con ARCA (inconsistencias) por rango, período o punto: CAE distinto, importe distinto (tolerancia 0,02), inexistente en ARCA; propuesta de reparación con aprobación, informe de individuales y rangos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.conciliacion.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-13 (Inconsistencias con ARCA).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1857 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-30)

<a id="API-FIS-31"></a>
#### API-FIS-31 · `POST /api/admin/fis/reconciliations/arca/{id}/approve`

- **Qué hace:** Aprueba reparación. Aprueba un registro de conciliación con ARCA (`vatReconciliations`).
- **Para qué sirve:** RF-FIS-059: Conciliación con ARCA (inconsistencias) por rango, período o punto: CAE distinto, importe distinto (tolerancia 0,02), inexistente en ARCA; propuesta de reparación con aprobación, informe de individuales y rangos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.conciliacion.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-13 (Inconsistencias con ARCA).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1858 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-31)

<a id="API-FIS-32"></a>
#### API-FIS-32 · `GET /api/admin/fis/caea`

- **Qué hace:** Lista / solicita o consulta CAEA. Lista, con filtros y paginación, los registros de `caea`.
- **Para qué sirve:** RF-FIS-065: Solicitud y consulta de CAEA por período yyyyMM y quincena (FECAEASolicitar / FECAEAConsultar), anticipada por job dentro de la ventana de solicitud vigente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.caea.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-FIS-14 (CAEA por quincena).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-32)

<a id="API-FIS-32-b"></a>
#### API-FIS-32-b · `POST /api/admin/fis/caea`

- **Qué hace:** Lista / solicita o consulta CAEA. Registra un nuevo elemento u operación en `caea`.
- **Para qué sirve:** RF-FIS-065: Solicitud y consulta de CAEA por período yyyyMM y quincena (FECAEASolicitar / FECAEAConsultar), anticipada por job dentro de la ventana de solicitud vigente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.caea.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-14 (CAEA por quincena).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-32-b)

<a id="API-FIS-33"></a>
#### API-FIS-33 · `POST /api/admin/fis/caea/{id}/report`

- **Qué hace:** Informa comprobantes CAEA. Registra «report» sobre un registro de `report`.
- **Para qué sirve:** RF-FIS-070: Alertas de plazos de informe CAEA y de comprobantes CAEA no informados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.caea.informar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-33)

<a id="API-FIS-34"></a>
#### API-FIS-34 · `POST /api/admin/fis/caea/{id}/report-no-movement`

- **Qué hace:** Informa sin movimiento. Informa sin movimiento un registro de `report-no-movement`.
- **Para qué sirve:** RF-FIS-068: CAEA sin movimiento (FECAEASinMovimientoInformar) por punto de venta sin uso en la quincena. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.caea.informar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1861 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-34)

<a id="API-FIS-35"></a>
#### API-FIS-35 · `POST /api/admin/fis/contingency`

- **Qué hace:** Activa/desactiva contingencia. Registra un nuevo elemento u operación en `contingency`.
- **Para qué sirve:** RF-FIS-069: Contingencia: activación manual o automática de CAEA ante caída prolongada de WSFE (umbral configurable), con evento y aviso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.caea.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-14 (CAEA por quincena).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-35)

<a id="API-FIS-36"></a>
#### API-FIS-36 · `GET /api/admin/fis/cesp`

- **Qué hace:** CESP. Consulta `cesp`.
- **Para qué sirve:** RF-FIS-074: Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.cesp.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-15 (CESP de LQSP).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-36)

<a id="API-FIS-36-c"></a>
#### API-FIS-36-c · `PUT /api/admin/fis/cesp`

- **Qué hace:** CESP. Reemplaza o configura `cesp`.
- **Para qué sirve:** RF-FIS-074: Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.cesp.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-15 (CESP de LQSP).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-36-c)

<a id="API-FIS-36-b"></a>
#### API-FIS-36-b · `POST /api/admin/fis/cesp`

- **Qué hace:** CESP. Registra un nuevo elemento u operación en `cesp`.
- **Para qué sirve:** RF-FIS-074: Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.cesp.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-15 (CESP de LQSP).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-36-b)

<a id="API-FIS-37"></a>
#### API-FIS-37 · `GET /api/admin/fis/cvp`

- **Qué hace:** CVP. Lista, con filtros y paginación, los registros de códigos de validación provincial (`provincialValidationCodes`).
- **Para qué sirve:** RF-FIS-093: Regímenes de percepción de IVA aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de códigos de validación provincial (`provincialValidationCodes`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-37)

<a id="API-FIS-37-c"></a>
#### API-FIS-37-c · `PUT /api/admin/fis/cvp`

- **Qué hace:** CVP. Reemplaza o configura códigos de validación provincial (`provincialValidationCodes`).
- **Para qué sirve:** RF-FIS-093: Regímenes de percepción de IVA aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de códigos de validación provincial (`provincialValidationCodes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de códigos de validación provincial (`provincialValidationCodes`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-37-c)

<a id="API-FIS-37-b"></a>
#### API-FIS-37-b · `POST /api/admin/fis/cvp`

- **Qué hace:** CVP. Da de alta un registro de códigos de validación provincial (`provincialValidationCodes`).
- **Para qué sirve:** RF-FIS-093: Regímenes de percepción de IVA aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de códigos de validación provincial (`provincialValidationCodes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de códigos de validación provincial (`provincialValidationCodes`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-37-b)

<a id="API-FIS-38"></a>
#### API-FIS-38 · `GET /api/admin/fis/vat/conditions`

- **Qué hace:** Configuración por condición IVA. Consulta `conditions`.
- **Para qué sirve:** RF-FIS-014: Condiciones de agente: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. · RF-FIS-093: Regímenes de percepción de IVA aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-38)

<a id="API-FIS-38-b"></a>
#### API-FIS-38-b · `PUT /api/admin/fis/vat/conditions`

- **Qué hace:** Configuración por condición IVA. Reemplaza o configura `conditions`.
- **Para qué sirve:** RF-FIS-014: Condiciones de agente: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. · RF-FIS-093: Regímenes de percepción de IVA aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-38-b)

<a id="API-FIS-39"></a>
#### API-FIS-39 · `GET /api/admin/fis/vat/rates`

- **Qué hace:** Alícuotas y matriz. Lista, con filtros y paginación, los registros de (duplicada con M06) (`vatRates`).
- **Para qué sirve:** RF-FIS-085: Situaciones frente a IIBB (exento, base mínima), alícuotas IIBB (rendir en facturación, impuesto, grupo), matriz situación × alícuota y alícuota por comprobante (con cálculo sobre IVA). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de (duplicada con M06) (`vatRates`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-39)

<a id="API-FIS-39-b"></a>
#### API-FIS-39-b · `PUT /api/admin/fis/vat/rates`

- **Qué hace:** Alícuotas y matriz. Reemplaza o configura (duplicada con M06) (`vatRates`).
- **Para qué sirve:** RF-FIS-085: Situaciones frente a IIBB (exento, base mínima), alícuotas IIBB (rendir en facturación, impuesto, grupo), matriz situación × alícuota y alícuota por comprobante (con cálculo sobre IVA). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de (duplicada con M06) (`vatRates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de (duplicada con M06) (`vatRates`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-39-b)

<a id="API-FIS-39-c"></a>
#### API-FIS-39-c · `GET /api/admin/fis/vat/matrix`

- **Qué hace:** Alícuotas y matriz. Lista, con filtros y paginación, los registros de matriz alícuota × condición (`vatRateMatrix`).
- **Para qué sirve:** RF-FIS-085: Situaciones frente a IIBB (exento, base mínima), alícuotas IIBB (rendir en facturación, impuesto, grupo), matriz situación × alícuota y alícuota por comprobante (con cálculo sobre IVA). · RF-FIS-079: Matriz alícuota × condición: porcentaje de IVA, segunda tasa (IVA 2) y percepción de IVA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de matriz alícuota × condición (`vatRateMatrix`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-39-c)

<a id="API-FIS-39-d"></a>
#### API-FIS-39-d · `PUT /api/admin/fis/vat/matrix`

- **Qué hace:** Alícuotas y matriz. Reemplaza o configura matriz alícuota × condición (`vatRateMatrix`).
- **Para qué sirve:** RF-FIS-085: Situaciones frente a IIBB (exento, base mínima), alícuotas IIBB (rendir en facturación, impuesto, grupo), matriz situación × alícuota y alícuota por comprobante (con cálculo sobre IVA). · RF-FIS-079: Matriz alícuota × condición: porcentaje de IVA, segunda tasa (IVA 2) y percepción de IVA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de matriz alícuota × condición (`vatRateMatrix`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de matriz alícuota × condición (`vatRateMatrix`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-39-d)

<a id="API-FIS-40"></a>
#### API-FIS-40 · `GET /api/admin/fis/taxes`

- **Qué hace:** Catálogo de tributos. Lista, con filtros y paginación, los registros de `taxes`.
- **Para qué sirve:** RF-FIS-084: Código de impuesto IVA para informes de composición de deuda y asientos (V2 543) como mapeo del catálogo de tributos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-40)

<a id="API-FIS-40-c"></a>
#### API-FIS-40-c · `PUT /api/admin/fis/taxes`

- **Qué hace:** Catálogo de tributos. Reemplaza o configura `taxes`.
- **Para qué sirve:** RF-FIS-084: Código de impuesto IVA para informes de composición de deuda y asientos (V2 543) como mapeo del catálogo de tributos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-40-c)

<a id="API-FIS-40-b"></a>
#### API-FIS-40-b · `POST /api/admin/fis/taxes`

- **Qué hace:** Catálogo de tributos. Registra un nuevo elemento u operación en `taxes`.
- **Para qué sirve:** RF-FIS-084: Código de impuesto IVA para informes de composición de deuda y asientos (V2 543) como mapeo del catálogo de tributos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-40-b)

<a id="API-FIS-41"></a>
#### API-FIS-41 · `GET /api/admin/fis/gross-income`

- **Qué hace:** Configuración IIBB. Consulta `gross-income`.
- **Para qué sirve:** RF-FIS-097: Tipos de retención configurables (IIBB, IVA, Ganancias, Seguridad Social) con régimen, mínimo imponible, mínimo de retención, valores fijos, banderas de suma/resta de componentes, factor, solo pago total, cálculo por ítem… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-41)

<a id="API-FIS-41-b"></a>
#### API-FIS-41-b · `PUT /api/admin/fis/gross-income`

- **Qué hace:** Configuración IIBB. Reemplaza o configura `gross-income`.
- **Para qué sirve:** RF-FIS-097: Tipos de retención configurables (IIBB, IVA, Ganancias, Seguridad Social) con régimen, mínimo imponible, mínimo de retención, valores fijos, banderas de suma/resta de componentes, factor, solo pago total, cálculo por ítem… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-41-b)

<a id="API-FIS-42"></a>
#### API-FIS-42 · `POST /api/admin/fis/tax-engine/calculate`

- **Qué hace:** Calcula impuestos de un documento. Calcula sobre `calculate`.
- **Para qué sirve:** RF-FIS-006: Relevamiento fiscal del tenant versionado (BASE §52.4): CUIT y condición del prestador, provincia, localidad, concesión, autoridad aplicable, servicios, tributos (impuesto, fundamento, base, alícuota, excepciones, tratamiento… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.service.calculateTaxes`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-42)

<a id="API-FIS-43"></a>
#### API-FIS-43 · `GET /api/admin/fis/tax-engine/traces/{documentId}`

- **Qué hace:** Traza de cálculo. Obtiene el detalle de un registro de traza de cálculo fiscal por documento (`taxCalculationTraces`).
- **Para qué sirve:** RF-FIS-083: Traza de cálculo por comprobante: reglas, versiones, bases, alícuotas, mínimos y exclusiones aplicadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.ver`.
- **Recibe:** en la ruta `documentId`.
- **Devuelve:** 200: el registro de traza de cálculo fiscal por documento (`taxCalculationTraces`).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1870 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-43)

<a id="API-FIS-45"></a>
#### API-FIS-45 · `GET /api/admin/fis/registries`

- **Qué hace:** Lista / importa padrón. Lista, con filtros y paginación, los registros de padrones importados (`taxpayerRegistries`).
- **Para qué sirve:** RF-FIS-087: Padrones de alícuotas por CUIT (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios… · RF-FIS-019: Padrón offline de condición tributaria (archivo masivo de ARCA de ancho fijo: CUIT, razón social, IVA, monotributo) importable, con conversión a códigos (MT, EX, NA, AC, NI) y cruce con titulares y proveedores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.padrones.importar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de padrones importados (`taxpayerRegistries`) con `total`.
- **Pantallas:** PAN-FIS-21 (Padrones fiscales).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1872 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-45)

<a id="API-FIS-45-b"></a>
#### API-FIS-45-b · `POST /api/admin/fis/registries`

- **Qué hace:** Lista / importa padrón. Da de alta un registro de padrones importados (`taxpayerRegistries`).
- **Para qué sirve:** RF-FIS-087: Padrones de alícuotas por CUIT (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios… · RF-FIS-019: Padrón offline de condición tributaria (archivo masivo de ARCA de ancho fijo: CUIT, razón social, IVA, monotributo) importable, con conversión a códigos (MT, EX, NA, AC, NI) y cruce con titulares y proveedores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.padrones.importar`.
- **Recibe:** los datos de padrones importados (`taxpayerRegistries`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de padrones importados (`taxpayerRegistries`).
- **Pantallas:** PAN-FIS-21 (Padrones fiscales).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1872 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-45-b)

<a id="API-FIS-46"></a>
#### API-FIS-46 · `POST /api/admin/fis/registries/{id}/approve`

- **Qué hace:** Activa padrón. Aprueba un registro de padrones importados (`taxpayerRegistries`).
- **Para qué sirve:** RF-FIS-018: Revalidación masiva periódica de condición IVA y monotributo de titulares y proveedores contra padrón, con informe de diferencias y actualización con aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.padrones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-46)

<a id="API-FIS-48"></a>
#### API-FIS-48 · `GET /api/admin/fis/determined-rates`

- **Qué hace:** Alícuotas determinadas y exclusiones. Lista, con filtros y paginación, los registros de alícuota determinada por cuenta (`determinedRates`).
- **Para qué sirve:** RF-FIS-087: Padrones de alícuotas por CUIT (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alícuota determinada por cuenta (`determinedRates`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48)

<a id="API-FIS-48-c"></a>
#### API-FIS-48-c · `PUT /api/admin/fis/determined-rates`

- **Qué hace:** Alícuotas determinadas y exclusiones. Reemplaza o configura alícuota determinada por cuenta (`determinedRates`).
- **Para qué sirve:** RF-FIS-087: Padrones de alícuotas por CUIT (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de alícuota determinada por cuenta (`determinedRates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de alícuota determinada por cuenta (`determinedRates`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48-c)

<a id="API-FIS-48-b"></a>
#### API-FIS-48-b · `POST /api/admin/fis/determined-rates`

- **Qué hace:** Alícuotas determinadas y exclusiones. Da de alta un registro de alícuota determinada por cuenta (`determinedRates`).
- **Para qué sirve:** RF-FIS-087: Padrones de alícuotas por CUIT (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de alícuota determinada por cuenta (`determinedRates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de alícuota determinada por cuenta (`determinedRates`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48-b)

<a id="API-FIS-48-d"></a>
#### API-FIS-48-d · `GET /api/admin/fis/exemptions`

- **Qué hace:** Alícuotas determinadas y exclusiones. Lista, con filtros y paginación, los registros de exclusiones y certificados (`taxExemptions`).
- **Para qué sirve:** RF-FIS-102: Exclusiones, certificados de no retención y reducciones por proveedor, régimen y vigencia, con respaldo y consulta de padrones de exclusión cuando existan. · RF-FIS-003: Tablas extensibles por tenant (tributos municipales, convenios, conceptos regulatorios, alícuotas determinadas): el tenant agrega filas con fundamento obligatorio; no puede editar filas de plataforma ni desactivar restricciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de exclusiones y certificados (`taxExemptions`) con `total`.
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48-d)

<a id="API-FIS-48-f"></a>
#### API-FIS-48-f · `PUT /api/admin/fis/exemptions`

- **Qué hace:** Alícuotas determinadas y exclusiones. Reemplaza o configura exclusiones y certificados (`taxExemptions`).
- **Para qué sirve:** RF-FIS-102: Exclusiones, certificados de no retención y reducciones por proveedor, régimen y vigencia, con respaldo y consulta de padrones de exclusión cuando existan. · RF-FIS-003: Tablas extensibles por tenant (tributos municipales, convenios, conceptos regulatorios, alícuotas determinadas): el tenant agrega filas con fundamento obligatorio; no puede editar filas de plataforma ni desactivar restricciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de exclusiones y certificados (`taxExemptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de exclusiones y certificados (`taxExemptions`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48-f)

<a id="API-FIS-48-e"></a>
#### API-FIS-48-e · `POST /api/admin/fis/exemptions`

- **Qué hace:** Alícuotas determinadas y exclusiones. Da de alta un registro de exclusiones y certificados (`taxExemptions`).
- **Para qué sirve:** RF-FIS-102: Exclusiones, certificados de no retención y reducciones por proveedor, régimen y vigencia, con respaldo y consulta de padrones de exclusión cuando existan. · RF-FIS-003: Tablas extensibles por tenant (tributos municipales, convenios, conceptos regulatorios, alícuotas determinadas): el tenant agrega filas con fundamento obligatorio; no puede editar filas de plataforma ni desactivar restricciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.impuestos.configurar`.
- **Recibe:** los datos de exclusiones y certificados (`taxExemptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de exclusiones y certificados (`taxExemptions`).
- **Pantallas:** PAN-FIS-16 (Código de Validación Provincial), PAN-FIS-17 (Condiciones frente al IVA), PAN-FIS-18 (Alícuotas y matriz IVA) y 3 más.
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-48-e)

<a id="API-FIS-49"></a>
#### API-FIS-49 · `GET /api/admin/fis/taxpayer-lookup`

- **Qué hace:** Consulta A13/constancia. Consulta `taxpayer-lookup`.
- **Para qué sirve:** RF-FIS-016: Consulta de padrón ARCA (A13 y constancia de inscripción) para autocompletar razón social, domicilio fiscal, condición IVA, monotributo, actividades y estado de la clave, conservando fecha y resultado de la consulta como… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.padron.consultar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-23 (Consulta de padrón ARCA).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-49)

<a id="API-FIS-50"></a>
#### API-FIS-50 · `POST /api/admin/fis/taxpayer-lookup/revalidations`

- **Qué hace:** Lanza revalidación masiva. Registra un nuevo elemento u operación en `revalidations`.
- **Para qué sirve:** RF-FIS-018: Revalidación masiva periódica de condición IVA y monotributo de titulares y proveedores contra padrón, con informe de diferencias y actualización con aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.padrones.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-21 (Padrones fiscales).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1877 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-50)

<a id="API-FIS-51"></a>
#### API-FIS-51 · `GET /api/admin/fis/withholding/types`

- **Qué hace:** Configuración de retenciones. Lista, con filtros y paginación, los registros de tipos de retención (`withholdingTypes`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de retención (`withholdingTypes`) con `total`.
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51)

<a id="API-FIS-51-c"></a>
#### API-FIS-51-c · `PUT /api/admin/fis/withholding/types`

- **Qué hace:** Configuración de retenciones. Reemplaza o configura tipos de retención (`withholdingTypes`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de tipos de retención (`withholdingTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de tipos de retención (`withholdingTypes`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-c)

<a id="API-FIS-51-b"></a>
#### API-FIS-51-b · `POST /api/admin/fis/withholding/types`

- **Qué hace:** Configuración de retenciones. Da de alta un registro de tipos de retención (`withholdingTypes`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de tipos de retención (`withholdingTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de retención (`withholdingTypes`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-b)

<a id="API-FIS-51-d"></a>
#### API-FIS-51-d · `GET /api/admin/fis/withholding/scales`

- **Qué hace:** Configuración de retenciones. Lista, con filtros y paginación, los registros de escalas de retención (`withholdingScales`).
- **Para qué sirve:** RF-FIS-100: Cálculo del importe: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de escalas de retención (`withholdingScales`) con `total`.
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-d)

<a id="API-FIS-51-f"></a>
#### API-FIS-51-f · `PUT /api/admin/fis/withholding/scales`

- **Qué hace:** Configuración de retenciones. Reemplaza o configura escalas de retención (`withholdingScales`).
- **Para qué sirve:** RF-FIS-100: Cálculo del importe: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de escalas de retención (`withholdingScales`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de escalas de retención (`withholdingScales`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-f)

<a id="API-FIS-51-e"></a>
#### API-FIS-51-e · `POST /api/admin/fis/withholding/scales`

- **Qué hace:** Configuración de retenciones. Da de alta un registro de escalas de retención (`withholdingScales`).
- **Para qué sirve:** RF-FIS-100: Cálculo del importe: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de escalas de retención (`withholdingScales`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de escalas de retención (`withholdingScales`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-e)

<a id="API-FIS-51-g"></a>
#### API-FIS-51-g · `GET /api/admin/fis/withholding/assignments`

- **Qué hace:** Configuración de retenciones. Lista, con filtros y paginación, los registros de asignación de retenciones (`withholdingAssignments`).
- **Para qué sirve:** RF-FIS-098: Asignación de tipos de retención a proveedores, productos y conceptos de compra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de asignación de retenciones (`withholdingAssignments`) con `total`.
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-g)

<a id="API-FIS-51-i"></a>
#### API-FIS-51-i · `PUT /api/admin/fis/withholding/assignments`

- **Qué hace:** Configuración de retenciones. Reemplaza o configura asignación de retenciones (`withholdingAssignments`).
- **Para qué sirve:** RF-FIS-098: Asignación de tipos de retención a proveedores, productos y conceptos de compra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de asignación de retenciones (`withholdingAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de asignación de retenciones (`withholdingAssignments`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-i)

<a id="API-FIS-51-h"></a>
#### API-FIS-51-h · `POST /api/admin/fis/withholding/assignments`

- **Qué hace:** Configuración de retenciones. Da de alta un registro de asignación de retenciones (`withholdingAssignments`).
- **Para qué sirve:** RF-FIS-098: Asignación de tipos de retención a proveedores, productos y conceptos de compra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de asignación de retenciones (`withholdingAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de asignación de retenciones (`withholdingAssignments`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-51-h)

<a id="API-FIS-52"></a>
#### API-FIS-52 · `POST /api/admin/fis/withholding/calculate`

- **Qué hace:** Calcula retenciones de una OP. Calcula sobre `calculate`.
- **Para qué sirve:** RF-FIS-100: Cálculo del importe: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.calcular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-52)

<a id="API-FIS-55"></a>
#### API-FIS-55 · `GET /api/admin/fis/withholding/applied`

- **Qué hace:** Retenciones practicadas. Lista, con filtros y paginación, los registros de retenciones practicadas con certificado (`withholdingsApplied`).
- **Para qué sirve:** RF-FIS-157: Eventos contables: IVA débito por alícuota, percepciones (productos, no categorizados), IIBB, retenciones practicadas y sufridas, pasivo con terceros, IVA crédito, devengamiento de IVA en refinanciaciones; mapeo de cuentas por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de retenciones practicadas con certificado (`withholdingsApplied`) con `total`.
- **Pantallas:** PAN-FIS-26 (Retenciones practicadas y certificados).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-55)

<a id="API-FIS-56"></a>
#### API-FIS-56 · `GET /api/admin/fis/withholding/{id}/certificate.pdf`

- **Qué hace:** Certificado (URL firmada) Descarga un archivo de `certificate.pdf`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.certificadosRetencion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-56)

<a id="API-FIS-57"></a>
#### API-FIS-57 · `GET /api/admin/fis/withholding/suffered-types`

- **Qué hace:** Tipos de retenciones sufridas. Lista, con filtros y paginación, los registros de tipos de retención sufrida (`withholdingSufferedTypes`).
- **Para qué sirve:** RF-FIS-110: Retenciones sufridas: catálogo de tipos con cuenta contable, validación (régimen, certificado, CUIT del agente) para que M07 las registre en cobros, y consolidación para informes y crédito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de retención sufrida (`withholdingSufferedTypes`) con `total`.
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-57)

<a id="API-FIS-57-c"></a>
#### API-FIS-57-c · `PUT /api/admin/fis/withholding/suffered-types`

- **Qué hace:** Tipos de retenciones sufridas. Reemplaza o configura tipos de retención sufrida (`withholdingSufferedTypes`).
- **Para qué sirve:** RF-FIS-110: Retenciones sufridas: catálogo de tipos con cuenta contable, validación (régimen, certificado, CUIT del agente) para que M07 las registre en cobros, y consolidación para informes y crédito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de tipos de retención sufrida (`withholdingSufferedTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de tipos de retención sufrida (`withholdingSufferedTypes`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-57-c)

<a id="API-FIS-57-b"></a>
#### API-FIS-57-b · `POST /api/admin/fis/withholding/suffered-types`

- **Qué hace:** Tipos de retenciones sufridas. Da de alta un registro de tipos de retención sufrida (`withholdingSufferedTypes`).
- **Para qué sirve:** RF-FIS-110: Retenciones sufridas: catálogo de tipos con cuenta contable, validación (régimen, certificado, CUIT del agente) para que M07 las registre en cobros, y consolidación para informes y crédito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.retenciones.configurar`.
- **Recibe:** los datos de tipos de retención sufrida (`withholdingSufferedTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de retención sufrida (`withholdingSufferedTypes`).
- **Pantallas:** PAN-FIS-06 (Condiciones de agente), PAN-FIS-24 (Tipos de retención y escalas), PAN-FIS-25 (Asignaciones a proveedores/productos/conceptos) y 1 más.
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-57-b)

<a id="API-FIS-58"></a>
#### API-FIS-58 · `GET /api/admin/fis/obligations`

- **Qué hace:** Obligaciones y calendario. Lista, con filtros y paginación, los registros de obligaciones fiscales a pagar (`taxObligations`).
- **Para qué sirve:** RF-FIS-111: Ganancias 4.ª categoría, F.931 y LSD se liquidan en M16; FIS solo recibe los datos para SICORE de sueldos y muestra las obligaciones en el calendario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.obligaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de obligaciones fiscales a pagar (`taxObligations`) con `total`.
- **Pantallas:** PAN-FIS-28 (Obligaciones fiscales y calendario).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-58)

<a id="API-FIS-59"></a>
#### API-FIS-59 · `POST /api/admin/fis/vat-ledgers`

- **Qué hace:** Genera libro (job) Registra un nuevo elemento u operación en libros IVA por período (`vatLedgers`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FIS-117: Cierre del período del libro: snapshot inmutable; reapertura con autorización y motivo; rectificación vinculada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.libroIva.generar`.
- **Recibe:** los datos de libros IVA por período (`vatLedgers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FIS-30 (Conciliación con Mis Comprobantes).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-59)

<a id="API-FIS-60"></a>
#### API-FIS-60 · `POST /api/admin/fis/vat-ledgers/{id}/close`

- **Qué hace:** Cierra/reabre. Cierra un registro de libros IVA por período (`vatLedgers`).
- **Para qué sirve:** RF-FIS-041: Validaciones previas: código ARCA del tipo configurado y numérico; sin comprobante anterior pendiente del mismo par; numeración correlativa sin huecos; TA y certificado vigentes; punto no pausado; receptor completo; condición IVA… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.libroIva.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-60)

<a id="API-FIS-60-b"></a>
#### API-FIS-60-b · `POST /api/admin/fis/vat-ledgers/{id}/reopen`

- **Qué hace:** Cierra/reabre. Reabre un registro de libros IVA por período (`vatLedgers`).
- **Para qué sirve:** RF-FIS-041: Validaciones previas: código ARCA del tipo configurado y numérico; sin comprobante anterior pendiente del mismo par; numeración correlativa sin huecos; TA y certificado vigentes; punto no pausado; receptor completo; condición IVA… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.libroIva.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-60-b)

<a id="API-FIS-61"></a>
#### API-FIS-61 · `POST /api/admin/fis/arca-received/imports`

- **Qué hace:** Importa archivo de ARCA. Da de alta un registro de importación de Mis Comprobantes (`arcaReceivedImports`).
- **Para qué sirve:** RF-FIS-019: Padrón offline de condición tributaria (archivo masivo de ARCA de ancho fijo: CUIT, razón social, IVA, monotributo) importable, con conversión a códigos (MT, EX, NA, AC, NI) y cruce con titulares y proveedores. · RF-FIS-126: Generación de declaración por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.libroIva.generar`.
- **Recibe:** los datos de importación de Mis Comprobantes (`arcaReceivedImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de importación de Mis Comprobantes (`arcaReceivedImports`).
- **Pantallas:** PAN-FIS-30 (Conciliación con Mis Comprobantes).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-61)

<a id="API-FIS-62"></a>
#### API-FIS-62 · `GET /api/admin/fis/arca-received/reconciliations/{id}`

- **Qué hace:** Resultado de conciliación. Obtiene el detalle de un registro de conciliación con ARCA (`vatReconciliations`).
- **Para qué sirve:** RF-FIS-123: Resultados de la conciliación: inexistente en GoodApps, inexistente en ARCA, diferencias mayores a la tolerancia (ARS 1 por defecto) en neto, no gravado, exento, IVA (todas las alícuotas), percepciones y total; signos correctos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.libroIva.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conciliación con ARCA (`vatReconciliations`).
- **Pantallas:** PAN-FIS-29 (Libro IVA ventas y compras).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-62)

<a id="API-FIS-63"></a>
#### API-FIS-63 · `GET /api/admin/fis/filings`

- **Qué hace:** Lista / genera declaración. Lista, con filtros y paginación, los registros de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-126: Generación de declaración por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.generar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presentaciones de regímenes (`regimeFilings`) con `total`.
- **Pantallas:** PAN-FIS-31 (Declaraciones y regímenes informativos).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-63)

<a id="API-FIS-63-b"></a>
#### API-FIS-63-b · `POST /api/admin/fis/filings`

- **Qué hace:** Lista / genera declaración. Da de alta un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-126: Generación de declaración por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.generar`.
- **Recibe:** los datos de presentaciones de regímenes (`regimeFilings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentaciones de regímenes (`regimeFilings`).
- **Pantallas:** PAN-FIS-31 (Declaraciones y regímenes informativos).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-63-b)

<a id="API-FIS-64"></a>
#### API-FIS-64 · `POST /api/admin/fis/filings/{id}/validate`

- **Qué hace:** Valida archivos. Valida un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-126: Generación de declaración por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.validar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-32 (Validador de archivos).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-64)

<a id="API-FIS-65"></a>
#### API-FIS-65 · `POST /api/admin/fis/filings/{id}/approve`

- **Qué hace:** Aprueba. Aprueba un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-149: Presentación y acuse de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. · RF-FIS-127: Registro de presentación: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-65)

<a id="API-FIS-66"></a>
#### API-FIS-66 · `POST /api/admin/fis/filings/{id}/submission`

- **Qué hace:** Registra presentación y acuse. Registra «submission» sobre un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-149: Presentación y acuse de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. · RF-FIS-127: Registro de presentación: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-66)

<a id="API-FIS-67"></a>
#### API-FIS-67 · `POST /api/admin/fis/filings/{id}/result`

- **Qué hace:** Registra aceptación/rechazo. Registra «result» sobre un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-127: Registro de presentación: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-67)

<a id="API-FIS-68"></a>
#### API-FIS-68 · `POST /api/admin/fis/filings/{id}/rectify`

- **Qué hace:** Crea rectificativa. Rectifica un registro de presentaciones de regímenes (`regimeFilings`).
- **Para qué sirve:** RF-FIS-127: Registro de presentación: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.rectificar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-68)

<a id="API-FIS-69"></a>
#### API-FIS-69 · `POST /api/admin/fis/files/analyze`

- **Qué hace:** Analiza archivo por línea/correlatividad. Registra un nuevo elemento u operación en perfil fiscal del emisor por entidad jurídica (`fiscalProfiles`).
- **Para qué sirve:** RF-FIS-121: Validación de archivos generados: análisis por línea (largo fijo, 266 caracteres en RG 3685) y por correlatividad, informando el rango faltante completo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.regimenes.validar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FIS-32 (Validador de archivos).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1896 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-69)

<a id="API-FIS-70"></a>
#### API-FIS-70 · `GET /api/admin/fis/third-parties/agreements`

- **Qué hace:** Convenios. Lista, con filtros y paginación, los registros de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`).
- **Para qué sirve:** RF-FIS-135: Exhibición separada en el comprobante del cargo propio y del concepto de terceros; tratamiento fiscal del concepto de terceros (no gravado/no ingreso propio, según convenio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.terceros.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`) con `total`.
- **Pantallas:** PAN-FIS-33 (Convenios por cuenta de terceros).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-70)

<a id="API-FIS-70-c"></a>
#### API-FIS-70-c · `PUT /api/admin/fis/third-parties/agreements`

- **Qué hace:** Convenios. Reemplaza o configura convenios de cobro por cuenta de terceros (`thirdPartyAgreements`).
- **Para qué sirve:** RF-FIS-135: Exhibición separada en el comprobante del cargo propio y del concepto de terceros; tratamiento fiscal del concepto de terceros (no gravado/no ingreso propio, según convenio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.terceros.configurar`.
- **Recibe:** los datos de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`).
- **Pantallas:** PAN-FIS-33 (Convenios por cuenta de terceros).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-70-c)

<a id="API-FIS-70-b"></a>
#### API-FIS-70-b · `POST /api/admin/fis/third-parties/agreements`

- **Qué hace:** Convenios. Da de alta un registro de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`).
- **Para qué sirve:** RF-FIS-135: Exhibición separada en el comprobante del cargo propio y del concepto de terceros; tratamiento fiscal del concepto de terceros (no gravado/no ingreso propio, según convenio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.terceros.configurar`.
- **Recibe:** los datos de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de convenios de cobro por cuenta de terceros (`thirdPartyAgreements`).
- **Pantallas:** PAN-FIS-33 (Convenios por cuenta de terceros).
- **Ola:** O4 · **Fuente:** M06 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-70-b)

<a id="API-FIS-71"></a>
#### API-FIS-71 · `GET /api/admin/fis/third-parties/remittances`

- **Qué hace:** Rendiciones. Lista, con filtros y paginación, los registros de rendiciones a terceros (`thirdPartyRemittances`).
- **Para qué sirve:** RF-FIS-128: RG 3571 RCSP / RG 5746/2025: rendición de comprobantes de servicios públicos con detalle de generadores, análisis por línea y correlatividad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.rendiciones.generar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rendiciones a terceros (`thirdPartyRemittances`) con `total`.
- **Pantallas:** PAN-FIS-34 (Rendiciones a terceros).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-71)

<a id="API-FIS-71-b"></a>
#### API-FIS-71-b · `POST /api/admin/fis/third-parties/remittances`

- **Qué hace:** Rendiciones. Da de alta un registro de rendiciones a terceros (`thirdPartyRemittances`).
- **Para qué sirve:** RF-FIS-128: RG 3571 RCSP / RG 5746/2025: rendición de comprobantes de servicios públicos con detalle de generadores, análisis por línea y correlatividad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.rendiciones.generar`.
- **Recibe:** los datos de rendiciones a terceros (`thirdPartyRemittances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rendiciones a terceros (`thirdPartyRemittances`).
- **Pantallas:** PAN-FIS-34 (Rendiciones a terceros).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-71-b)

<a id="API-FIS-72"></a>
#### API-FIS-72 · `POST /api/admin/fis/third-parties/remittances/{id}/approve`

- **Qué hace:** Aprueba y solicita OP a M14. Aprueba un registro de rendiciones a terceros (`thirdPartyRemittances`).
- **Para qué sirve:** RF-FIS-138: Imputación de pagos parciales entre conceptos propios y de terceros según la política aprobada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.rendiciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-72)

<a id="API-FIS-73"></a>
#### API-FIS-73 · `GET /api/admin/fis/regulatory/runs`

- **Qué hace:** Informes regulatorios. Lista, con filtros y paginación, los registros de presentaciones a reguladores (`regulatoryReportRuns`).
- **Para qué sirve:** RF-FIS-149: Presentación y acuse de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.reguladores.generar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presentaciones a reguladores (`regulatoryReportRuns`) con `total`.
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-73)

<a id="API-FIS-73-b"></a>
#### API-FIS-73-b · `POST /api/admin/fis/regulatory/runs`

- **Qué hace:** Informes regulatorios. Da de alta un registro de presentaciones a reguladores (`regulatoryReportRuns`).
- **Para qué sirve:** RF-FIS-149: Presentación y acuse de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.reguladores.generar`.
- **Recibe:** los datos de presentaciones a reguladores (`regulatoryReportRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentaciones a reguladores (`regulatoryReportRuns`).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-73-b)

<a id="API-FIS-74"></a>
#### API-FIS-74 · `POST /api/admin/fis/regulatory/runs/{id}/submission`

- **Qué hace:** Presentación y acuse. Registra «submission» sobre un registro de presentaciones a reguladores (`regulatoryReportRuns`).
- **Para qué sirve:** RF-FIS-149: Presentación y acuse de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.reguladores.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-74)

<a id="API-FIS-75"></a>
#### API-FIS-75 · `GET /api/admin/fis/regulatory/concept-maps`

- **Qué hace:** Mapas de conceptos. Lista, con filtros y paginación, los registros de mapeo de conceptos por informe (`regulatoryConceptMaps`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.reguladores.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mapeo de conceptos por informe (`regulatoryConceptMaps`) con `total`.
- **Pantallas:** PAN-FIS-36 (Configuración de conceptos regulatorios).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-75)

<a id="API-FIS-75-b"></a>
#### API-FIS-75-b · `PUT /api/admin/fis/regulatory/concept-maps`

- **Qué hace:** Mapas de conceptos. Reemplaza o configura mapeo de conceptos por informe (`regulatoryConceptMaps`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.reguladores.configurar`.
- **Recibe:** los datos de mapeo de conceptos por informe (`regulatoryConceptMaps`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de mapeo de conceptos por informe (`regulatoryConceptMaps`).
- **Pantallas:** PAN-FIS-36 (Configuración de conceptos regulatorios).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-75-b)

<a id="API-FIS-76"></a>
#### API-FIS-76 · `GET /api/admin/fis/public-admin/selections`

- **Qué hace:** Selección de administración pública (DELETE quita ítems, no borra comprobantes) Lista, con filtros y paginación, los registros de selecciones de comprobantes de administración pública (`publicAdminSelections`).
- **Para qué sirve:** RF-FIS-152: Guardar selección con reemplazo controlado del período/fecha (sin duplicados), aviso si ya existe una selección y eliminación de comprobantes elegidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.admPublica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de selecciones de comprobantes de administración pública (`publicAdminSelections`) con `total`.
- **Pantallas:** PAN-FIS-37 (Comprobantes de administración pública).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-76)

<a id="API-FIS-76-b"></a>
#### API-FIS-76-b · `POST /api/admin/fis/public-admin/selections`

- **Qué hace:** Selección de administración pública (DELETE quita ítems, no borra comprobantes) Da de alta un registro de selecciones de comprobantes de administración pública (`publicAdminSelections`).
- **Para qué sirve:** RF-FIS-152: Guardar selección con reemplazo controlado del período/fecha (sin duplicados), aviso si ya existe una selección y eliminación de comprobantes elegidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.admPublica.editar`.
- **Recibe:** los datos de selecciones de comprobantes de administración pública (`publicAdminSelections`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de selecciones de comprobantes de administración pública (`publicAdminSelections`).
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-76-b)

<a id="API-FIS-76-c"></a>
#### API-FIS-76-c · `DELETE /api/admin/fis/public-admin/selections`

- **Qué hace:** Selección de administración pública (DELETE quita ítems, no borra comprobantes) Elimina o da de baja un registro de selecciones de comprobantes de administración pública (`publicAdminSelections`).
- **Para qué sirve:** RF-FIS-152: Guardar selección con reemplazo controlado del período/fecha (sin duplicados), aviso si ya existe una selección y eliminación de comprobantes elegidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.admPublica.editar`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O5 · **Fuente:** M06 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-76-c)

<a id="API-FIS-77"></a>
#### API-FIS-77 · `POST /api/v1/ext/fis/documents`

- **Qué hace:** Envía comprobante externo. Da de alta un registro de documentos en modo pasarela (`gatewayDocuments`).
- **Para qué sirve:** RF-FIS-154: Modo pasarela: autorizar comprobantes generados por sistemas externos mediante API (/api/v1/ext/fis/...) e importación CSV (diseño de 46 columnas posicionales con separador configurable V2 2497), sin carpetas compartidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `fis.pasarela.enviar`.
- **Recibe:** los datos de documentos en modo pasarela (`gatewayDocuments`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de documentos en modo pasarela (`gatewayDocuments`).
- **Pantallas:** PAN-FIS-38 (Modo pasarela).
- **Ola:** O11 · **Fuente:** M06 §11. API, línea 1904 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-77)

<a id="API-FIS-78"></a>
#### API-FIS-78 · `GET /api/v1/ext/fis/documents/{id}`

- **Qué hace:** Estado y CAE. Obtiene el detalle de un registro de documentos en modo pasarela (`gatewayDocuments`).
- **Para qué sirve:** RF-FIS-156: Resultado del modo pasarela: por API o archivo de salida con tipo, punto, número, fecha, importe, CAE, vencimiento y error; marcas de exportado/error que se reexportan al autorizar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `fis.pasarela.consultar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de documentos en modo pasarela (`gatewayDocuments`).
- **Ola:** O11 · **Fuente:** M06 §11. API, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-78)

<a id="API-FIS-79"></a>
#### API-FIS-79 · `POST /api/admin/fis/gateway/imports`

- **Qué hace:** Importa CSV del modo pasarela. Da de alta un registro de importación de Mis Comprobantes (`arcaReceivedImports`).
- **Para qué sirve:** RF-FIS-154: Modo pasarela: autorizar comprobantes generados por sistemas externos mediante API (/api/v1/ext/fis/...) e importación CSV (diseño de 46 columnas posicionales con separador configurable V2 2497), sin carpetas compartidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fis.pasarela.enviar`.
- **Recibe:** los datos de importación de Mis Comprobantes (`arcaReceivedImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de importación de Mis Comprobantes (`arcaReceivedImports`).
- **Pantallas:** PAN-FIS-38 (Modo pasarela).
- **Ola:** O8 · **Fuente:** M06 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-79)

<a id="API-FIS-80"></a>
#### API-FIS-80 · `GET /api/admin/fis/reports/{code}`

- **Qué hace:** Reportes de la sección 15. Obtiene el detalle de un registro de catálogo de informes a reguladores (`regulatoryReports`).
- **Para qué sirve:** RF-FIS-143: Catálogo de informes regulatorios por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; acceso según el anexo: «fis.*.ver».
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de catálogo de informes a reguladores (`regulatoryReports`).
- **Pantallas:** PAN-FIS-40 (Reportes fiscales).
- **Ola:** O7 · **Fuente:** M06 §11. API, línea 1907 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-80)

<a id="API-FIS-81"></a>
#### API-FIS-81 · `GET /api/fis/documents/{documentId}/fiscal-data`

- **Qué hace:** CAE, vencimiento, QR y leyendas del propio comprobante. Consulta «fiscal-data» de un registro de documentos en modo pasarela (`gatewayDocuments`).
- **Para qué sirve:** RF-FIS-156: Resultado del modo pasarela: por API o archivo de salida con tipo, punto, número, fecha, importe, CAE, vencimiento y error; marcas de exportado/error que se reexportan al autorizar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.facturas.ver`.
- **Recibe:** en la ruta `documentId`.
- **Devuelve:** 200: el registro de documentos en modo pasarela (`gatewayDocuments`).
- **Pantallas:** PAN-FIS-41 (Datos fiscales del comprobante (componente en M19)), PAN-POR-38 (Mis facturas), PAN-POR-39 (Detalle de factura) y 3 más.
- **Ola:** O11 · **Fuente:** M06 §11. API, línea 1908 · [Ver en Swagger](../18-swagger/index.html?api=m06-fis#/API/API-FIS-81)
