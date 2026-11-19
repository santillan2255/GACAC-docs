# Catálogo de endpoints · M01 · Personas, titulares, asociados, cuentas, inmuebles y domicilios

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Mantener, dentro de cada cooperativa (tenant), una identidad de negocio única y consistente de cada persona física o jurídica y de todas sus relaciones con esa cooperativa: titularidad comercial, condición de asociado (solo el vínculo; el detalle institucional es de M17), cuentas, domicilios, inmuebles, puntos de prestación, representaciones, garantías, adherencias, documentación, observaciones y bloqueos. El módulo ofrece la ficha 360 desde la que se consulta todo lo que la persona tiene con la cooperativa y es la fuente de verdad que consumen contratos (M02), facturación (M05), fiscal (M06), cobranza (M07), mora (M08), CRM (M09), técnica (M10), institucional (M17) y el portal del socio (M19). Debe resolver, sin perder ninguna capacidad de ProCoop:

1. La jerarquía ProCoop Persona → Titular → Cuenta → Grupo de facturación → Servicio contratado y el modelo BASE persona → rol en el tenant → contrato por servicio con titular DNI/CUIT, admitiendo varios contratos del mismo servicio en un domicilio con titulares distintos (TIT-001..003).
2. Que una persona contrate varios servicios en distintos inmuebles sin duplicarse, y que membresía, titularidad comercial y ocupación de una vivienda sean relaciones diferentes (BASE §3).
3. Que cambiar el titular no reescriba el pasado: cada cargo conserva quién era titular cuando se generó (BASE §4).

Detalle completo en el anexo M01, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m01-per).

| Dato | Valor |
|---|---|
| Endpoints | 108 |
| Por método | DELETE 2, GET 40, PATCH 12, POST 51, PUT 3 |
| Grupos funcionales | 4 |
| Con requisito citado en el anexo | 11 |
| Con requisito inferido (a confirmar) | 97 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Backoffice](#grupo-1) | 83 | Lista y búsqueda de personas.; Alta de persona (exige duplicateCheckToken de API-PER-03).; Devuelve candidatos con puntaje y token de control.… |
| [Administración del tenant](#grupo-2) | 10 | Parámetros del módulo (sección 14).; Tipos de requisito documental y acciones.; Catálogos del módulo (7.18) sobre el motor de T04. |
| [Portal del socio (PWA)](#grupo-3) | 13 | Personas vinculadas, titularidades y cuentas visibles con…; Alta y cambio de contactos (fuente portal), con…; Solicita y verifica vínculo con una persona (intentos…… |
| [Externa (`/api/v1/ext`)](#grupo-4) | 2 | Titular (nombre y documento enmascarado), estado y bloqueos…; Consulta para integraciones autorizadas (por ejemplo… |

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

## Backoffice

83 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-PER-01](#API-PER-01) | GET | `/api/admin/per/persons` | Lista y búsqueda de personas. |
| [API-PER-02](#API-PER-02) | POST | `/api/admin/per/persons` | Alta de persona (exige duplicateCheckToken de API-PER-03). |
| [API-PER-03](#API-PER-03) | POST | `/api/admin/per/persons/matches` | Devuelve candidatos con puntaje y token de control. |
| [API-PER-04](#API-PER-04) | GET | `/api/admin/per/persons/{personId}` | Detalle de persona. |
| [API-PER-05](#API-PER-05) | PATCH | `/api/admin/per/persons/{personId}` | Modificación con fecha efectiva opcional y motivo. |
| [API-PER-06](#API-PER-06) | POST | `/api/admin/per/persons/{personId}/identifiers` | Agrega o reemplaza identificación. |
| [API-PER-07](#API-PER-07) | POST | `/api/admin/per/persons/{personId}/identifiers/{identifierId}/verifications` | Verificación ARCA (asíncrona, devuelve 202 con estado) o manual con evidencia. |
| [API-PER-08](#API-PER-08) | POST | `/api/admin/per/persons/{personId}/contacts/{contactId}/verifications` | Inicia o confirma verificación por código. |
| [API-PER-09](#API-PER-09) | POST | `/api/admin/per/persons/{personId}/death` | Registra fallecimiento y efectos. |
| [API-PER-10](#API-PER-10) | POST | `/api/admin/per/persons/{personId}/death/reverse` | Revierte un fallecimiento con motivo. |
| [API-PER-11](#API-PER-11) | GET | `/api/admin/per/persons/{personId}/sensitive-data/{category}` | Lee o actualiza datos sensibles (auditado). |
| [API-PER-11-b](#API-PER-11-b) | PUT | `/api/admin/per/persons/{personId}/sensitive-data/{category}` | Lee o actualiza datos sensibles (auditado). |
| [API-PER-12](#API-PER-12) | GET | `/api/admin/per/persons/{personId}/roles` | Roles de la persona en el tenant con enlaces. |
| [API-PER-13](#API-PER-13) | GET | `/api/admin/per/holders` | Búsqueda unificada de titulares y cuentas (PAN-PER-01). |
| [API-PER-14](#API-PER-14) | POST | `/api/admin/per/holders` | Alta de titular (con primera cuenta opcional en el mismo cuerpo). |
| [API-PER-15](#API-PER-15) | GET | `/api/admin/per/holders/{holderId}` | Resumen de ficha 360 (datos propios + proyecciones). |
| [API-PER-16](#API-PER-16) | PATCH | `/api/admin/per/holders/{holderId}` | Modificación del titular. |
| [API-PER-17](#API-PER-17) | GET | `/api/admin/per/holders/{holderId}/closure-check` | Lista impedimentos y advertencias para la baja. |
| [API-PER-18](#API-PER-18) | POST | `/api/admin/per/holders/{holderId}/close` | Baja con causa, fecha efectiva y conserva número. |
| [API-PER-19](#API-PER-19) | POST | `/api/admin/per/holders/{holderId}/reactivate` | Reactivación con motivo. |
| [API-PER-20](#API-PER-20) | GET | `/api/admin/per/accounts` | Lista de cuentas con filtros. |
| [API-PER-21](#API-PER-21) | POST | `/api/admin/per/holders/{holderId}/accounts` | Alta de cuenta. |
| [API-PER-22](#API-PER-22) | GET | `/api/admin/per/accounts/{accountId}` | Detalle de cuenta. |
| [API-PER-23](#API-PER-23) | PATCH | `/api/admin/per/accounts/{accountId}` | Modificación de cuenta (con propuesta de copiar domicilio a contratos, RN-PER-063). |
| [API-PER-24](#API-PER-24) | POST | `/api/admin/per/accounts/{accountId}/set-principal` | Marca como principal (desmarca la anterior en la misma transacción). |
| [API-PER-25](#API-PER-25) | POST | `/api/admin/per/accounts/{accountId}/close` | Cierra la cuenta. |
| [API-PER-26](#API-PER-26) | GET | `/api/admin/per/accounts/{accountId}/structure` | Árbol cuenta → grupos → contratos (proyección). |
| [API-PER-27](#API-PER-27) | POST | `/api/admin/per/addresses` | Crea domicilio normalizado. |
| [API-PER-28](#API-PER-28) | PATCH | `/api/admin/per/addresses/{addressId}` | Modifica domicilio (nueva versión). |
| [API-PER-29](#API-PER-29) | POST | `/api/admin/per/addresses/{addressId}/location` | Confirma, corrige, marca aproximado o para revisión con motivo. |
| [API-PER-30](#API-PER-30) | GET | `/api/admin/per/addresses/suggestions` | Autocompletado (catálogo T04 + proveedor). |
| [API-PER-31](#API-PER-31) | GET | `/api/admin/per/premises` | Lista y alta de inmuebles. |
| [API-PER-31-b](#API-PER-31-b) | POST | `/api/admin/per/premises` | Lista y alta de inmuebles. |
| [API-PER-32](#API-PER-32) | GET | `/api/admin/per/premises/{premiseId}` | Detalle y modificación. |
| [API-PER-32-b](#API-PER-32-b) | PATCH | `/api/admin/per/premises/{premiseId}` | Detalle y modificación. |
| [API-PER-33](#API-PER-33) | GET | `/api/admin/per/service-points` | Lista, alta o reutilización, modificación. |
| [API-PER-33-b](#API-PER-33-b) | POST | `/api/admin/per/service-points` | Lista, alta o reutilización, modificación. |
| [API-PER-33-c](#API-PER-33-c) | GET | `/api/admin/per/service-points/{servicePointId}` | Lista, alta o reutilización, modificación. |
| [API-PER-33-d](#API-PER-33-d) | PATCH | `/api/admin/per/service-points/{servicePointId}` | Lista, alta o reutilización, modificación. |
| [API-PER-34](#API-PER-34) | POST | `/api/admin/per/validations/address-debt` | Resultado none/warning/blocking sin detalle de terceros (RN-PER-062). |
| [API-PER-35](#API-PER-35) | POST | `/api/admin/per/relationships/check-authorization` | ¿Puede la persona X hacer la acción A sobre el destino D? Devuelve relación habilitante. |
| [API-PER-36](#API-PER-36) | GET | `/api/admin/per/relationships` | Lista y alta de relaciones. |
| [API-PER-36-b](#API-PER-36-b) | POST | `/api/admin/per/relationships` | Lista y alta de relaciones. |
| [API-PER-37](#API-PER-37) | POST | `/api/admin/per/relationships/{relationshipId}/verify` | Verifica o revoca. |
| [API-PER-37-b](#API-PER-37-b) | POST | `/api/admin/per/relationships/{relationshipId}/revoke` | Verifica o revoca. |
| [API-PER-41](#API-PER-41) | GET | `/api/admin/per/blocks/effective` | Bloqueos activos que afectan un destino y efecto (incluye herencia titular → cuenta → contrato). |
| [API-PER-42](#API-PER-42) | GET | `/api/admin/per/blocks` | Lista y aplicación. |
| [API-PER-42-b](#API-PER-42-b) | POST | `/api/admin/per/blocks` | Lista y aplicación. |
| [API-PER-43](#API-PER-43) | POST | `/api/admin/per/blocks/{blockId}/lift` | Levanta con motivo. |
| [API-PER-44](#API-PER-44) | GET | `/api/admin/per/notes` | Lista por destino y alta. |
| [API-PER-44-b](#API-PER-44-b) | POST | `/api/admin/per/notes` | Lista por destino y alta. |
| [API-PER-45-b](#API-PER-45-b) | DELETE | `/api/admin/per/notes/{noteId}` | Nueva versión o borrado lógico con motivo (no aplica a notas de sistema). |
| [API-PER-45](#API-PER-45) | PATCH | `/api/admin/per/notes/{noteId}` | Nueva versión o borrado lógico con motivo (no aplica a notas de sistema). |
| [API-PER-46](#API-PER-46) | GET | `/api/admin/per/document-submissions` | Requisitos exigibles, presentaciones y validación. |
| [API-PER-46-b](#API-PER-46-b) | POST | `/api/admin/per/document-submissions` | Requisitos exigibles, presentaciones y validación. |
| [API-PER-46-c](#API-PER-46-c) | GET | `/api/admin/per/document-submissions/{submissionId}` | Requisitos exigibles, presentaciones y validación. |
| [API-PER-46-d](#API-PER-46-d) | PATCH | `/api/admin/per/document-submissions/{submissionId}` | Requisitos exigibles, presentaciones y validación. |
| [API-PER-47](#API-PER-47) | POST | `/api/admin/per/transfers/simulate` | Simula y devuelve efectos y advertencias. |
| [API-PER-52](#API-PER-52) | GET | `/api/admin/per/transfers` | Lista y detalle con pasos y constancia. |
| [API-PER-48](#API-PER-48) | POST | `/api/admin/per/transfers` | Crea borrador o envía a aprobación (con simulación vigente). |
| [API-PER-49](#API-PER-49) | POST | `/api/admin/per/transfers/{transferId}/approve` | Aprueba o rechaza. |
| [API-PER-50](#API-PER-50) | POST | `/api/admin/per/transfers/{transferId}/execute` | Encola la ejecución; 202. |
| [API-PER-51](#API-PER-51) | POST | `/api/admin/per/transfers/{transferId}/reverse` | Crea la transferencia inversa. |
| [API-PER-52-b](#API-PER-52-b) | GET | `/api/admin/per/transfers/{transferId}` | Lista y detalle con pasos y constancia. |
| [API-PER-53](#API-PER-53) | GET | `/api/admin/per/history/{entityType}/{entityId}` | Revisiones; parámetros asOfValid, asOfRecorded. |
| [API-PER-54](#API-PER-54) | GET | `/api/admin/per/duplicate-cases` | Bandeja de casos. |
| [API-PER-55](#API-PER-55) | POST | `/api/admin/per/duplicate-cases/{caseId}/decision` | Dismissed o confirmedSame con motivo. |
| [API-PER-56](#API-PER-56) | POST | `/api/admin/per/duplicate-cases/{caseId}/merge` | Solicita fusión con elección por campo. |
| [API-PER-57](#API-PER-57) | POST | `/api/admin/per/duplicate-cases/{caseId}/merge/approve` | Aprueba (otro usuario) o revierte. |
| [API-PER-57-b](#API-PER-57-b) | POST | `/api/admin/per/duplicate-cases/{caseId}/merge/reverse` | Aprueba (otro usuario) o revierte. |
| [API-PER-58](#API-PER-58) | POST | `/api/admin/per/roll/exports` | Encola exportación (JOB-PER-12). |
| [API-PER-59](#API-PER-59) | GET | `/api/admin/per/roll` | Vista previa paginada con columnas y filtros. |
| [API-PER-60](#API-PER-60) | GET | `/api/admin/per/privacy/requests` | Solicitudes de derechos. |
| [API-PER-60-b](#API-PER-60-b) | POST | `/api/admin/per/privacy/requests` | Solicitudes de derechos. |
| [API-PER-60-c](#API-PER-60-c) | GET | `/api/admin/per/privacy/requests/{requestId}` | Solicitudes de derechos. |
| [API-PER-60-d](#API-PER-60-d) | PATCH | `/api/admin/per/privacy/requests/{requestId}` | Solicitudes de derechos. |
| [API-PER-61](#API-PER-61) | POST | `/api/admin/per/persons/{personId}/anonymize` | Anonimiza (encola JOB-PER-11). |
| [API-PER-62](#API-PER-62) | GET | `/api/admin/per/user-links` | Gestión de vínculos usuario–persona desde backoffice. |
| [API-PER-62-b](#API-PER-62-b) | POST | `/api/admin/per/user-links` | Gestión de vínculos usuario–persona desde backoffice. |
| [API-PER-62-c](#API-PER-62-c) | POST | `/api/admin/per/user-links/{linkId}/verify` | Gestión de vínculos usuario–persona desde backoffice. |
| [API-PER-62-d](#API-PER-62-d) | POST | `/api/admin/per/user-links/{linkId}/revoke` | Gestión de vínculos usuario–persona desde backoffice. |
| [API-PER-63](#API-PER-63) | POST | `/api/admin/per/imports` | Valida y encola importación (JOB-PER-09). |
| [API-PER-64](#API-PER-64) | POST | `/api/admin/per/special-operations` | Renumeración y correcciones especiales con aprobación. |

<a id="API-PER-01"></a>
#### API-PER-01 · `GET /api/admin/per/persons`

- **Qué hace:** Lista y búsqueda de personas. Lista, con filtros y paginación, los registros de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-027: Tipo de documento por defecto para personas físicas y jurídicas configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de persona humana o jurídica (`persons`) con `total`.
- **Pantallas:** PAN-PER-03 (Personas).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1482 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-01)

<a id="API-PER-02"></a>
#### API-PER-02 · `POST /api/admin/per/persons`

- **Qué hace:** Alta de persona (exige duplicateCheckToken de API-PER-03). Da de alta un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-001: Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. · RF-PER-002: Buscar coincidencias antes de crear una persona (documento, CUIT/CUIL, nombre aproximado, fecha de nacimiento, contacto, domicilio).
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.crear`.
- **Recibe:** los datos de persona humana o jurídica (`persons`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de persona humana o jurídica (`persons`).
- **Pantallas:** PAN-PER-04 (Alta y edición de persona).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1483 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-02)

<a id="API-PER-03"></a>
#### API-PER-03 · `POST /api/admin/per/persons/matches`

- **Qué hace:** Devuelve candidatos con puntaje y token de control. Registra un nuevo elemento u operación en persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-001: Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. · RF-PER-002: Buscar coincidencias antes de crear una persona (documento, CUIT/CUIL, nombre aproximado, fecha de nacimiento, contacto, domicilio).
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-04 (Alta y edición de persona).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-03)

<a id="API-PER-04"></a>
#### API-PER-04 · `GET /api/admin/per/persons/{personId}`

- **Qué hace:** Detalle de persona. Obtiene el detalle de un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-027: Tipo de documento por defecto para personas físicas y jurídicas configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.ver`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: el registro de persona humana o jurídica (`persons`).
- **Pantallas:** PAN-PER-03 (Personas).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1485 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-04)

<a id="API-PER-05"></a>
#### API-PER-05 · `PATCH /api/admin/per/persons/{personId}`

- **Qué hace:** Modificación con fecha efectiva opcional y motivo. Modifica algunos campos de un registro de persona humana o jurídica (`persons`) (solo los enviados).
- **Para qué sirve:** RF-PER-046: Reactivar un titular dado de baja con motivo, aprobación y nueva fecha efectiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.editar`.
- **Recibe:** en la ruta `personId`; solo los campos a cambiar de persona humana o jurídica (`persons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de persona humana o jurídica (`persons`).
- **Pantallas:** PAN-PER-04 (Alta y edición de persona), PAN-PER-06 (Editor de domicilio con mapa).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-05)

<a id="API-PER-06"></a>
#### API-PER-06 · `POST /api/admin/per/persons/{personId}/identifiers`

- **Qué hace:** Agrega o reemplaza identificación. Registra «identifiers» sobre un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-115: Reemplazado por RF-SOC-023 (M18, dueño único; HUECO-TRV-01). Texto original: Consultar la deuda del adherente (cuentas donde es titular o persona de la cuenta) al agregarlo, según política. · RF-PER-001: Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.editar`.
- **Recibe:** en la ruta `personId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-04 (Alta y edición de persona), PAN-PER-06 (Editor de domicilio con mapa).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1487 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-06)

<a id="API-PER-07"></a>
#### API-PER-07 · `POST /api/admin/per/persons/{personId}/identifiers/{identifierId}/verifications`

- **Qué hace:** Verificación ARCA (asíncrona, devuelve 202 con estado) o manual con evidencia. Registra «verifications» sobre un registro de persona humana o jurídica (`persons`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PER-028: Historial de verificaciones de cada identificación (fuente, fecha, actor, resultado, evidencia). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.identificaciones.verificar`.
- **Recibe:** en la ruta `personId`, `identifierId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1488 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-07)

<a id="API-PER-08"></a>
#### API-PER-08 · `POST /api/admin/per/persons/{personId}/contacts/{contactId}/verifications`

- **Qué hace:** Inicia o confirma verificación por código. Registra «verifications» sobre un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-030: Varios contactos tipados por persona (correo, celular, fijo, WhatsApp, fax), con principal, etiqueta, fuente (backoffice, portal, importación, legado web) y estado de verificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.editar`.
- **Recibe:** en la ruta `personId`, `contactId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-04 (Alta y edición de persona), PAN-PER-06 (Editor de domicilio con mapa).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1489 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-08)

<a id="API-PER-09"></a>
#### API-PER-09 · `POST /api/admin/per/persons/{personId}/death`

- **Qué hace:** Registra fallecimiento y efectos. Registra «death» sobre un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-010: Revertir un fallecimiento registrado por error, con aprobación y reversión documentada de sus efectos. · RF-PER-009: Registrar el fallecimiento con fecha, evidencia, efectos sobre adhesiones y beneficios y tareas pendientes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.registrarFallecimiento`.
- **Recibe:** en la ruta `personId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-16 (Registrar fallecimiento).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1490 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-09)

<a id="API-PER-10"></a>
#### API-PER-10 · `POST /api/admin/per/persons/{personId}/death/reverse`

- **Qué hace:** Revierte un fallecimiento con motivo. Revierte sobre persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-001: Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.registrarFallecimiento`.
- **Recibe:** en la ruta `personId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-16 (Registrar fallecimiento).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1491 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-10)

<a id="API-PER-11"></a>
#### API-PER-11 · `GET /api/admin/per/persons/{personId}/sensitive-data/{category}`

- **Qué hace:** Lee o actualiza datos sensibles (auditado). Obtiene el detalle de un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-161: "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.datosSensibles.ver`.
- **Recibe:** en la ruta `personId`, `category`.
- **Devuelve:** 200: el registro de persona humana o jurídica (`persons`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1492 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-11)

<a id="API-PER-11-b"></a>
#### API-PER-11-b · `PUT /api/admin/per/persons/{personId}/sensitive-data/{category}`

- **Qué hace:** Lee o actualiza datos sensibles (auditado). Reemplaza o configura un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-161: "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.datosSensibles.ver`.
- **Recibe:** en la ruta `personId`, `category`; los datos de persona humana o jurídica (`persons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de persona humana o jurídica (`persons`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1492 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-11-b)

<a id="API-PER-12"></a>
#### API-PER-12 · `GET /api/admin/per/persons/{personId}/roles`

- **Qué hace:** Roles de la persona en el tenant con enlaces. Consulta «roles» de un registro de persona humana o jurídica (`persons`).
- **Para qué sirve:** RF-PER-003: Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.ver`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: el registro de persona humana o jurídica (`persons`).
- **Pantallas:** PAN-PER-03 (Personas).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1493 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-12)

<a id="API-PER-13"></a>
#### API-PER-13 · `GET /api/admin/per/holders`

- **Qué hace:** Búsqueda unificada de titulares y cuentas (PAN-PER-01). Lista, con filtros y paginación, los registros de titular (`holders`).
- **Para qué sirve:** RF-PER-071: La cuenta de PER es la unidad estructural; la modalidad de cuenta corriente separada o unificada es política de M07 y nunca mezcla titulares. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de titular (`holders`) con `total`.
- **Pantallas:** PAN-PER-01 (Búsqueda de titulares y cuentas), PAN-PER-02 (Ficha 360 del titular).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1494 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-13)

<a id="API-PER-14"></a>
#### API-PER-14 · `POST /api/admin/per/holders`

- **Qué hace:** Alta de titular (con primera cuenta opcional en el mismo cuerpo). Da de alta un registro de titular (`holders`).
- **Para qué sirve:** RF-PER-001: Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. · RF-PER-002: Buscar coincidencias antes de crear una persona (documento, CUIT/CUIL, nombre aproximado, fecha de nacimiento, contacto, domicilio).
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.crear`.
- **Recibe:** los datos de titular (`holders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de titular (`holders`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1495 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-14)

<a id="API-PER-15"></a>
#### API-PER-15 · `GET /api/admin/per/holders/{holderId}`

- **Qué hace:** Resumen de ficha 360 (datos propios + proyecciones). Obtiene el detalle de un registro de titular (`holders`).
- **Para qué sirve:** RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.ver`.
- **Recibe:** en la ruta `holderId`.
- **Devuelve:** 200: el registro de titular (`holders`).
- **Pantallas:** PAN-PER-01 (Búsqueda de titulares y cuentas), PAN-PER-02 (Ficha 360 del titular).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1496 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-15)

<a id="API-PER-16"></a>
#### API-PER-16 · `PATCH /api/admin/per/holders/{holderId}`

- **Qué hace:** Modificación del titular. Modifica algunos campos de un registro de titular (`holders`) (solo los enviados).
- **Para qué sirve:** RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.editar`.
- **Recibe:** en la ruta `holderId`; solo los campos a cambiar de titular (`holders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de titular (`holders`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1497 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-16)

<a id="API-PER-17"></a>
#### API-PER-17 · `GET /api/admin/per/holders/{holderId}/closure-check`

- **Qué hace:** Lista impedimentos y advertencias para la baja. Lista, con filtros y paginación, los registros de titular (`holders`).
- **Para qué sirve:** RF-PER-045: Dar de baja al titular con controles: servicios activos, capital integrado (consulta a M17), titular sin cuentas, relaciones en otras cuentas; con solicitud de baja imprimible.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.baja`.
- **Recibe:** en la ruta `holderId`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de titular (`holders`) con `total`.
- **Pantallas:** PAN-PER-17 (Baja y reactivación de titular).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1498 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-17)

<a id="API-PER-18"></a>
#### API-PER-18 · `POST /api/admin/per/holders/{holderId}/close`

- **Qué hace:** Baja con causa, fecha efectiva y conserva número. Cierra un registro de titular (`holders`).
- **Para qué sirve:** RF-PER-047: Conservar el número de titular al dar de baja, cuando así se indique. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.baja`.
- **Recibe:** en la ruta `holderId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-17 (Baja y reactivación de titular).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1499 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-18)

<a id="API-PER-19"></a>
#### API-PER-19 · `POST /api/admin/per/holders/{holderId}/reactivate`

- **Qué hace:** Reactivación con motivo. Reactiva un registro de titular (`holders`).
- **Para qué sirve:** RF-PER-046: Reactivar un titular dado de baja con motivo, aprobación y nueva fecha efectiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.titulares.reactivar`.
- **Recibe:** en la ruta `holderId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-17 (Baja y reactivación de titular).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1500 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-19)

<a id="API-PER-20"></a>
#### API-PER-20 · `GET /api/admin/per/accounts`

- **Qué hace:** Lista de cuentas con filtros. Lista, con filtros y paginación, los registros de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuenta de servicios (`accounts`) con `total`.
- **Pantallas:** PAN-PER-05 (Cuenta).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1501 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-20)

<a id="API-PER-21"></a>
#### API-PER-21 · `POST /api/admin/per/holders/{holderId}/accounts`

- **Qué hace:** Alta de cuenta. Da de alta un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-138: Crear el titular destino dentro de la transferencia, con opciones de no exigir cuenta principal y de marcar la cuenta transferida como principal. · RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.crear`.
- **Recibe:** en la ruta `holderId`; los datos de cuenta de servicios (`accounts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cuenta de servicios (`accounts`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1502 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-21)

<a id="API-PER-22"></a>
#### API-PER-22 · `GET /api/admin/per/accounts/{accountId}`

- **Qué hace:** Detalle de cuenta. Obtiene el detalle de un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-154: Historial integrado en la ficha (cuenta, contrato, factibilidad, OT, presupuesto) con detalle de cambios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.ver`.
- **Recibe:** en la ruta `accountId`.
- **Devuelve:** 200: el registro de cuenta de servicios (`accounts`).
- **Pantallas:** PAN-PER-05 (Cuenta).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1503 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-22)

<a id="API-PER-23"></a>
#### API-PER-23 · `PATCH /api/admin/per/accounts/{accountId}`

- **Qué hace:** Modificación de cuenta (con propuesta de copiar domicilio a contratos, RN-PER-063). Modifica algunos campos de un registro de cuenta de servicios (`accounts`) (solo los enviados).
- **Para qué sirve:** RF-PER-120: Notas automáticas del sistema no editables (cuenta creada, alta/desconexión del contrato, OT y transacción, recategorización, modificación especial, transferencia). · RF-PER-058: Condición IVA por cuenta (catálogo de M06) con valor propuesto desde el perfil fiscal del titular y advertencia si difiere de la constancia de ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.editar`.
- **Recibe:** en la ruta `accountId`; solo los campos a cambiar de cuenta de servicios (`accounts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuenta de servicios (`accounts`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-23)

<a id="API-PER-24"></a>
#### API-PER-24 · `POST /api/admin/per/accounts/{accountId}/set-principal`

- **Qué hace:** Marca como principal (desmarca la anterior en la misma transacción). Marca como principal un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-056: Exactamente una cuenta principal por titular con cuentas; cambiar la principal en una sola transacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.editar`.
- **Recibe:** en la ruta `accountId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1505 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-24)

<a id="API-PER-25"></a>
#### API-PER-25 · `POST /api/admin/per/accounts/{accountId}/close`

- **Qué hace:** Cierra la cuenta. Cierra un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-057: Cerrar una cuenta sin contratos vigentes, con motivo; reabrirla con aprobación. El saldo pendiente se informa desde M07 y no impide cerrar la estructura si la política lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.cerrar`.
- **Recibe:** en la ruta `accountId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1506 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-25)

<a id="API-PER-26"></a>
#### API-PER-26 · `GET /api/admin/per/accounts/{accountId}/structure`

- **Qué hace:** Árbol cuenta → grupos → contratos (proyección). Consulta «structure» de un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-069: Estructura de la cuenta en árbol: cuenta → grupos de facturación (M05) → contratos (M02) con servicio, identificador de medidor o conexión, estado y categoría; indicador "posee varios grupos". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.ver`.
- **Recibe:** en la ruta `accountId`.
- **Devuelve:** 200: el registro de cuenta de servicios (`accounts`).
- **Pantallas:** PAN-PER-05 (Cuenta).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1507 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-26)

<a id="API-PER-27"></a>
#### API-PER-27 · `POST /api/admin/per/addresses`

- **Qué hace:** Crea domicilio normalizado. Da de alta un registro de domicilios normalizados con geoReference (`addresses`).
- **Para qué sirve:** RF-PER-074: Conservar el texto original y la versión normalizada con su procedencia (fuente, identificador en la fuente, versión del catálogo, fecha). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.domicilios.editar`.
- **Recibe:** los datos de domicilios normalizados con geoReference (`addresses`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de domicilios normalizados con geoReference (`addresses`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1508 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-27)

<a id="API-PER-28"></a>
#### API-PER-28 · `PATCH /api/admin/per/addresses/{addressId}`

- **Qué hace:** Modifica domicilio (nueva versión). Modifica algunos campos de un registro de domicilios normalizados con geoReference (`addresses`) (solo los enviados).
- **Para qué sirve:** RF-PER-074: Conservar el texto original y la versión normalizada con su procedencia (fuente, identificador en la fuente, versión del catálogo, fecha). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.domicilios.editar`.
- **Recibe:** en la ruta `addressId`; solo los campos a cambiar de domicilios normalizados con geoReference (`addresses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de domicilios normalizados con geoReference (`addresses`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1509 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-28)

<a id="API-PER-29"></a>
#### API-PER-29 · `POST /api/admin/per/addresses/{addressId}/location`

- **Qué hace:** Confirma, corrige, marca aproximado o para revisión con motivo. Registra «location» sobre un registro de domicilios normalizados con geoReference (`addresses`).
- **Para qué sirve:** RF-PER-077: Estado y precisión del punto: confirmado, aproximado, pendiente, para revisar, no disponible; sin mostrar precisión inexistente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.domicilios.confirmarUbicacion`.
- **Recibe:** en la ruta `addressId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1510 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-29)

<a id="API-PER-30"></a>
#### API-PER-30 · `GET /api/admin/per/addresses/suggestions`

- **Qué hace:** Autocompletado (catálogo T04 + proveedor). Consulta domicilios normalizados con geoReference (`addresses`).
- **Para qué sirve:** RF-PER-074: Conservar el texto original y la versión normalizada con su procedencia (fuente, identificador en la fuente, versión del catálogo, fecha). · RF-PER-061: Distrito y sección de la cuenta, con autocompletado del distrito al ingresar la sección y exigencia configurable en la cuenta principal (excepto titulares no asociados). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.domicilios.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de domicilios normalizados con geoReference (`addresses`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1511 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-30)

<a id="API-PER-31"></a>
#### API-PER-31 · `GET /api/admin/per/premises`

- **Qué hace:** Lista y alta de inmuebles. Lista, con filtros y paginación, los registros de inmuebles (`premises`).
- **Para qué sirve:** RF-PER-086: Registrar inmuebles con domicilio, nomenclatura catastral de seis partes configurable (numérica o alfanumérica), partida, chacra, quinta, fracción, parcela y subparcela, y todos los atributos de PROPIEDA. · RF-PER-093: Puntos de prestación: dirección normalizada, inmueble, unidad, ubicación, datos de acceso y referencias; uno o varios contratos, incluso del mismo servicio y de titulares distintos.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.inmuebles.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de inmuebles (`premises`) con `total`.
- **Pantallas:** PAN-PER-07 (Inmuebles).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-31)

<a id="API-PER-31-b"></a>
#### API-PER-31-b · `POST /api/admin/per/premises`

- **Qué hace:** Lista y alta de inmuebles. Da de alta un registro de inmuebles (`premises`).
- **Para qué sirve:** RF-PER-086: Registrar inmuebles con domicilio, nomenclatura catastral de seis partes configurable (numérica o alfanumérica), partida, chacra, quinta, fracción, parcela y subparcela, y todos los atributos de PROPIEDA. · RF-PER-093: Puntos de prestación: dirección normalizada, inmueble, unidad, ubicación, datos de acceso y referencias; uno o varios contratos, incluso del mismo servicio y de titulares distintos.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.inmuebles.crear`.
- **Recibe:** los datos de inmuebles (`premises`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de inmuebles (`premises`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-31-b)

<a id="API-PER-32"></a>
#### API-PER-32 · `GET /api/admin/per/premises/{premiseId}`

- **Qué hace:** Detalle y modificación. Obtiene el detalle de un registro de inmuebles (`premises`).
- **Para qué sirve:** RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.inmuebles.ver`.
- **Recibe:** en la ruta `premiseId`.
- **Devuelve:** 200: el registro de inmuebles (`premises`).
- **Pantallas:** PAN-PER-07 (Inmuebles).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1513 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-32)

<a id="API-PER-32-b"></a>
#### API-PER-32-b · `PATCH /api/admin/per/premises/{premiseId}`

- **Qué hace:** Detalle y modificación. Modifica algunos campos de un registro de inmuebles (`premises`) (solo los enviados).
- **Para qué sirve:** RF-PER-036: Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.inmuebles.editar`.
- **Recibe:** en la ruta `premiseId`; solo los campos a cambiar de inmuebles (`premises`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de inmuebles (`premises`).
- **Pantallas:** PAN-PER-06 (Editor de domicilio con mapa).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1513 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-32-b)

<a id="API-PER-33"></a>
#### API-PER-33 · `GET /api/admin/per/service-points`

- **Qué hace:** Lista, alta o reutilización, modificación. Lista, con filtros y paginación, los registros de punto de suministro en un inmueble (`servicePoints`).
- **Para qué sirve:** RF-PER-003: Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.puntosPrestacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de punto de suministro en un inmueble (`servicePoints`) con `total`.
- **Pantallas:** PAN-PER-08 (Puntos de prestación), PAN-PER-28 (Mapa de domicilios y puntos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-33)

<a id="API-PER-33-b"></a>
#### API-PER-33-b · `POST /api/admin/per/service-points`

- **Qué hace:** Lista, alta o reutilización, modificación. Da de alta un registro de punto de suministro en un inmueble (`servicePoints`).
- **Para qué sirve:** RF-PER-003: Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.puntosPrestacion.editar`.
- **Recibe:** los datos de punto de suministro en un inmueble (`servicePoints`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de punto de suministro en un inmueble (`servicePoints`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-33-b)

<a id="API-PER-33-c"></a>
#### API-PER-33-c · `GET /api/admin/per/service-points/{servicePointId}`

- **Qué hace:** Lista, alta o reutilización, modificación. Obtiene el detalle de un registro de punto de suministro en un inmueble (`servicePoints`).
- **Para qué sirve:** RF-PER-003: Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.puntosPrestacion.ver`.
- **Recibe:** en la ruta `servicePointId`.
- **Devuelve:** 200: el registro de punto de suministro en un inmueble (`servicePoints`).
- **Pantallas:** PAN-PER-08 (Puntos de prestación), PAN-PER-28 (Mapa de domicilios y puntos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-33-c)

<a id="API-PER-33-d"></a>
#### API-PER-33-d · `PATCH /api/admin/per/service-points/{servicePointId}`

- **Qué hace:** Lista, alta o reutilización, modificación. Modifica algunos campos de un registro de punto de suministro en un inmueble (`servicePoints`) (solo los enviados).
- **Para qué sirve:** RF-PER-003: Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.puntosPrestacion.editar`.
- **Recibe:** en la ruta `servicePointId`; solo los campos a cambiar de punto de suministro en un inmueble (`servicePoints`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de punto de suministro en un inmueble (`servicePoints`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-33-d)

<a id="API-PER-34"></a>
#### API-PER-34 · `POST /api/admin/per/validations/address-debt`

- **Qué hace:** Resultado none/warning/blocking sin detalle de terceros (RN-PER-062). Registra un nuevo elemento u operación en `address-debt`.
- **Para qué sirve:** RF-PER-107: El pago de un tercero se registra en M07 como pagador sin crear relación ni derechos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.cuentas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M01 §11.1 Backoffice, línea 1515 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-34)

<a id="API-PER-35"></a>
#### API-PER-35 · `POST /api/admin/per/relationships/check-authorization`

- **Qué hace:** ¿Puede la persona X hacer la acción A sobre el destino D? Devuelve relación habilitante. Registra un nuevo elemento u operación en vínculos entre personas (`relationships`).
- **Para qué sirve:** RF-PER-099: Relaciones persona–persona tipadas (cónyuge, hijo, padre/madre, hermano, conviviente, grupo familiar, discapacitado a cargo, representante legal, apoderado, tutor/curador, miembro de organización) con vigencia y evidencia. · RF-PER-100: Representaciones y autorizaciones sobre titular, cuenta o contrato, con alcance por acción (consultar, pagar, solicitar gestiones, solicitar baja, firmar conformidad, recibir notificaciones, actualizar datos), vigencia y…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.relaciones.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-09 (Relaciones y representaciones).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1516 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-35)

<a id="API-PER-36"></a>
#### API-PER-36 · `GET /api/admin/per/relationships`

- **Qué hace:** Lista y alta de relaciones. Lista, con filtros y paginación, los registros de vínculos entre personas (`relationships`).
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.relaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vínculos entre personas (`relationships`) con `total`.
- **Pantallas:** PAN-PER-09 (Relaciones y representaciones).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1517 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-36)

<a id="API-PER-36-b"></a>
#### API-PER-36-b · `POST /api/admin/per/relationships`

- **Qué hace:** Lista y alta de relaciones. Da de alta un registro de vínculos entre personas (`relationships`).
- **Para qué sirve:** RF-PER-107: El pago de un tercero se registra en M07 como pagador sin crear relación ni derechos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.relaciones.crear`.
- **Recibe:** los datos de vínculos entre personas (`relationships`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de vínculos entre personas (`relationships`).
- **Pantallas:** PAN-PER-09 (Relaciones y representaciones).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1517 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-36-b)

<a id="API-PER-37"></a>
#### API-PER-37 · `POST /api/admin/per/relationships/{relationshipId}/verify`

- **Qué hace:** Verifica o revoca. Verifica un registro de vínculos entre personas (`relationships`).
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.relaciones.verificar`.
- **Recibe:** en la ruta `relationshipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1518 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-37)

<a id="API-PER-37-b"></a>
#### API-PER-37-b · `POST /api/admin/per/relationships/{relationshipId}/revoke`

- **Qué hace:** Verifica o revoca. Revoca un registro de vínculos entre personas (`relationships`).
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.relaciones.verificar`.
- **Recibe:** en la ruta `relationshipId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1518 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-37-b)

<a id="API-PER-41"></a>
#### API-PER-41 · `GET /api/admin/per/blocks/effective`

- **Qué hace:** Bloqueos activos que afectan un destino y efecto (incluye herencia titular → cuenta → contrato). Consulta bloqueos de cuenta (`blocks`).
- **Para qué sirve:** RF-PER-124: Servicio de consulta de bloqueos vigentes por destino y efecto, que consumen M05, M07, M08, M02 y M19 antes de operar. · RF-PER-125: Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo).
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.bloqueos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de bloqueos de cuenta (`blocks`).
- **Pantallas:** PAN-PER-12 (Bloqueos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1522 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-41)

<a id="API-PER-42"></a>
#### API-PER-42 · `GET /api/admin/per/blocks`

- **Qué hace:** Lista y aplicación. Lista, con filtros y paginación, los registros de bloqueos de cuenta (`blocks`).
- **Para qué sirve:** RF-PER-125: Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.bloqueos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bloqueos de cuenta (`blocks`) con `total`.
- **Pantallas:** PAN-PER-12 (Bloqueos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1523 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-42)

<a id="API-PER-42-b"></a>
#### API-PER-42-b · `POST /api/admin/per/blocks`

- **Qué hace:** Lista y aplicación. Da de alta un registro de bloqueos de cuenta (`blocks`).
- **Para qué sirve:** RF-PER-125: Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.bloqueos.aplicar`.
- **Recibe:** los datos de bloqueos de cuenta (`blocks`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de bloqueos de cuenta (`blocks`).
- **Pantallas:** PAN-PER-12 (Bloqueos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1523 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-42-b)

<a id="API-PER-43"></a>
#### API-PER-43 · `POST /api/admin/per/blocks/{blockId}/lift`

- **Qué hace:** Levanta con motivo. Levanta un registro de bloqueos de cuenta (`blocks`).
- **Para qué sirve:** RF-PER-125: Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.bloqueos.levantar`.
- **Recibe:** en la ruta `blockId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-12 (Bloqueos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1524 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-43)

<a id="API-PER-44"></a>
#### API-PER-44 · `GET /api/admin/per/notes`

- **Qué hace:** Lista por destino y alta. Lista, con filtros y paginación, los registros de notas de cuenta, titular o persona (`notes`).
- **Para qué sirve:** RF-PER-118: Notas con fecha, título, texto, autor, destino (persona, titular, cuenta, contrato), categoría y visibilidad (interna, caja, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.notas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de notas de cuenta, titular o persona (`notes`) con `total`.
- **Pantallas:** PAN-PER-11 (Notas).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1525 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-44)

<a id="API-PER-44-b"></a>
#### API-PER-44-b · `POST /api/admin/per/notes`

- **Qué hace:** Lista por destino y alta. Da de alta un registro de notas de cuenta, titular o persona (`notes`).
- **Para qué sirve:** RF-PER-138: Crear el titular destino dentro de la transferencia, con opciones de no exigir cuenta principal y de marcar la cuenta transferida como principal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.notas.crear`.
- **Recibe:** los datos de notas de cuenta, titular o persona (`notes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de notas de cuenta, titular o persona (`notes`).
- **Pantallas:** PAN-PER-11 (Notas).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1525 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-44-b)

<a id="API-PER-45-b"></a>
#### API-PER-45-b · `DELETE /api/admin/per/notes/{noteId}`

- **Qué hace:** Nueva versión o borrado lógico con motivo (no aplica a notas de sistema). Elimina o da de baja un registro de notas de cuenta, titular o persona (`notes`).
- **Para qué sirve:** RF-PER-119: Historial de modificaciones de cada nota y borrado lógico con motivo, conservando la evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.notas.eliminar`.
- **Recibe:** en la ruta `noteId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1526 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-45-b)

<a id="API-PER-45"></a>
#### API-PER-45 · `PATCH /api/admin/per/notes/{noteId}`

- **Qué hace:** Nueva versión o borrado lógico con motivo (no aplica a notas de sistema). Modifica algunos campos de un registro de notas de cuenta, titular o persona (`notes`) (solo los enviados).
- **Para qué sirve:** RF-PER-119: Historial de modificaciones de cada nota y borrado lógico con motivo, conservando la evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.notas.editar`.
- **Recibe:** en la ruta `noteId`; solo los campos a cambiar de notas de cuenta, titular o persona (`notes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de notas de cuenta, titular o persona (`notes`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1526 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-45)

<a id="API-PER-46"></a>
#### API-PER-46 · `GET /api/admin/per/document-submissions`

- **Qué hace:** Requisitos exigibles, presentaciones y validación. Lista, con filtros y paginación, los registros de documentos presentados por persona (`documentSubmissions`).
- **Para qué sirve:** RF-PER-129: Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de documentos presentados por persona (`documentSubmissions`) con `total`.
- **Pantallas:** PAN-PER-13 (Documentación y requisitos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1527 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-46)

<a id="API-PER-46-b"></a>
#### API-PER-46-b · `POST /api/admin/per/document-submissions`

- **Qué hace:** Requisitos exigibles, presentaciones y validación. Da de alta un registro de documentos presentados por persona (`documentSubmissions`).
- **Para qué sirve:** RF-PER-129: Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.editar`.
- **Recibe:** los datos de documentos presentados por persona (`documentSubmissions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentos presentados por persona (`documentSubmissions`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1527 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-46-b)

<a id="API-PER-46-c"></a>
#### API-PER-46-c · `GET /api/admin/per/document-submissions/{submissionId}`

- **Qué hace:** Requisitos exigibles, presentaciones y validación. Obtiene el detalle de un registro de documentos presentados por persona (`documentSubmissions`).
- **Para qué sirve:** RF-PER-129: Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.ver`.
- **Recibe:** en la ruta `submissionId`.
- **Devuelve:** 200: el registro de documentos presentados por persona (`documentSubmissions`).
- **Pantallas:** PAN-PER-13 (Documentación y requisitos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1527 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-46-c)

<a id="API-PER-46-d"></a>
#### API-PER-46-d · `PATCH /api/admin/per/document-submissions/{submissionId}`

- **Qué hace:** Requisitos exigibles, presentaciones y validación. Modifica algunos campos de un registro de documentos presentados por persona (`documentSubmissions`) (solo los enviados).
- **Para qué sirve:** RF-PER-129: Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.editar`.
- **Recibe:** en la ruta `submissionId`; solo los campos a cambiar de documentos presentados por persona (`documentSubmissions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de documentos presentados por persona (`documentSubmissions`).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1527 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-46-d)

<a id="API-PER-47"></a>
#### API-PER-47 · `POST /api/admin/per/transfers/simulate`

- **Qué hace:** Simula y devuelve efectos y advertencias. Simula sin efectos sobre transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-132: Transferir una cuenta completa a otro titular (existente o nuevo) con validaciones (deuda, titular destino de baja, bloqueos) y efectos (contratos, grupos, débitos, IIBB, adherentes). · RF-PER-133: Cambio de titularidad de un contrato con fecha efectiva, preservando deuda e historia en el titular anterior; M02 ejecuta sobre el contrato.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-14 (Asistente de transferencia).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1528 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-47)

<a id="API-PER-52"></a>
#### API-PER-52 · `GET /api/admin/per/transfers`

- **Qué hace:** Lista y detalle con pasos y constancia. Lista, con filtros y paginación, los registros de transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-137: Registro de transferencias consultable y reimprimible (constancia con plantilla). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de transferencias de titularidad (`transfers`) con `total`.
- **Pantallas:** PAN-PER-15 (Transferencias).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1533 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-52)

<a id="API-PER-48"></a>
#### API-PER-48 · `POST /api/admin/per/transfers`

- **Qué hace:** Crea borrador o envía a aprobación (con simulación vigente). Da de alta un registro de transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-138: Crear el titular destino dentro de la transferencia, con opciones de no exigir cuenta principal y de marcar la cuenta transferida como principal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.crear`.
- **Recibe:** los datos de transferencias de titularidad (`transfers`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de transferencias de titularidad (`transfers`).
- **Pantallas:** PAN-PER-14 (Asistente de transferencia).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1529 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-48)

<a id="API-PER-49"></a>
#### API-PER-49 · `POST /api/admin/per/transfers/{transferId}/approve`

- **Qué hace:** Aprueba o rechaza. Aprueba un registro de transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-134: Iniciar desde la ficha la transferencia de capital entre titulares; la ejecuta M17. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.aprobar`.
- **Recibe:** en la ruta `transferId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1530 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-49)

<a id="API-PER-50"></a>
#### API-PER-50 · `POST /api/admin/per/transfers/{transferId}/execute`

- **Qué hace:** Encola la ejecución; 202. Ejecuta un registro de transferencias de titularidad (`transfers`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PER-134: Iniciar desde la ficha la transferencia de capital entre titulares; la ejecuta M17. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.ejecutar`.
- **Recibe:** en la ruta `transferId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1531 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-50)

<a id="API-PER-51"></a>
#### API-PER-51 · `POST /api/admin/per/transfers/{transferId}/reverse`

- **Qué hace:** Crea la transferencia inversa. Revierte un registro de transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-010: Revertir un fallecimiento registrado por error, con aprobación y reversión documentada de sus efectos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.revertir`.
- **Recibe:** en la ruta `transferId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1532 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-51)

<a id="API-PER-52-b"></a>
#### API-PER-52-b · `GET /api/admin/per/transfers/{transferId}`

- **Qué hace:** Lista y detalle con pasos y constancia. Obtiene el detalle de un registro de transferencias de titularidad (`transfers`).
- **Para qué sirve:** RF-PER-137: Registro de transferencias consultable y reimprimible (constancia con plantilla). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.transferencias.ver`.
- **Recibe:** en la ruta `transferId`.
- **Devuelve:** 200: el registro de transferencias de titularidad (`transfers`).
- **Pantallas:** PAN-PER-15 (Transferencias).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1533 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-52-b)

<a id="API-PER-53"></a>
#### API-PER-53 · `GET /api/admin/per/history/{entityType}/{entityId}`

- **Qué hace:** Revisiones; parámetros asOfValid, asOfRecorded. Obtiene el detalle de un registro de `history`.
- **Para qué sirve:** RF-PER-079: Ubicación por coordenadas o referencias cuando no hay coincidencia de calle y altura, con revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.historial.ver`.
- **Recibe:** en la ruta `entityType`, `entityId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-19 (Historial).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1534 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-53)

<a id="API-PER-54"></a>
#### API-PER-54 · `GET /api/admin/per/duplicate-cases`

- **Qué hace:** Bandeja de casos. Lista, con filtros y paginación, los registros de casos de posibles duplicados (`duplicateCases`).
- **Para qué sirve:** RF-PER-156: Bandeja de duplicados con decisión registrada: "no es la misma persona" o "es la misma persona". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.duplicados.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de casos de posibles duplicados (`duplicateCases`) con `total`.
- **Pantallas:** PAN-PER-18 (Duplicados y fusión).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1535 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-54)

<a id="API-PER-55"></a>
#### API-PER-55 · `POST /api/admin/per/duplicate-cases/{caseId}/decision`

- **Qué hace:** Dismissed o confirmedSame con motivo. Registra la decisión sobre un registro de casos de posibles duplicados (`duplicateCases`).
- **Para qué sirve:** RF-PER-155: Detectar posibles duplicados al alta y en un proceso periódico, con puntaje por documento, CUIT/CUIL (incluido DNI extraído del CUIL), nombre fonético, fecha de nacimiento, contacto y domicilio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.duplicados.resolver`.
- **Recibe:** en la ruta `caseId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-18 (Duplicados y fusión).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1536 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-55)

<a id="API-PER-56"></a>
#### API-PER-56 · `POST /api/admin/per/duplicate-cases/{caseId}/merge`

- **Qué hace:** Solicita fusión con elección por campo. Fusiona un registro de casos de posibles duplicados (`duplicateCases`).
- **Para qué sirve:** RF-PER-155: Detectar posibles duplicados al alta y en un proceso periódico, con puntaje por documento, CUIT/CUIL (incluido DNI extraído del CUIL), nombre fonético, fecha de nacimiento, contacto y domicilio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.duplicados.resolver`.
- **Recibe:** en la ruta `caseId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-18 (Duplicados y fusión).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1537 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-56)

<a id="API-PER-57"></a>
#### API-PER-57 · `POST /api/admin/per/duplicate-cases/{caseId}/merge/approve`

- **Qué hace:** Aprueba (otro usuario) o revierte. Aprueba sobre casos de posibles duplicados (`duplicateCases`).
- **Para qué sirve:** RF-PER-156: Bandeja de duplicados con decisión registrada: "no es la misma persona" o "es la misma persona". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.unificar`.
- **Recibe:** en la ruta `caseId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-18 (Duplicados y fusión).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1538 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-57)

<a id="API-PER-57-b"></a>
#### API-PER-57-b · `POST /api/admin/per/duplicate-cases/{caseId}/merge/reverse`

- **Qué hace:** Aprueba (otro usuario) o revierte. Revierte sobre casos de posibles duplicados (`duplicateCases`).
- **Para qué sirve:** RF-PER-156: Bandeja de duplicados con decisión registrada: "no es la misma persona" o "es la misma persona". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.unificar`.
- **Recibe:** en la ruta `caseId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-18 (Duplicados y fusión).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1538 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-57-b)

<a id="API-PER-58"></a>
#### API-PER-58 · `POST /api/admin/per/roll/exports`

- **Qué hace:** Encola exportación (JOB-PER-12). Registra un nuevo elemento u operación en `exports`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PER-148: Padrón de titulares con filtros (estado, fechas de alta, deuda, servicios, facturas, distrito), columnas elegibles, credenciales, filtros guardados y exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.padron.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-PER-20 (Padrón de titulares).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1539 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-58)

<a id="API-PER-59"></a>
#### API-PER-59 · `GET /api/admin/per/roll`

- **Qué hace:** Vista previa paginada con columnas y filtros. Consulta `roll`.
- **Para qué sirve:** RF-PER-148: Padrón de titulares con filtros (estado, fechas de alta, deuda, servicios, facturas, distrito), columnas elegibles, credenciales, filtros guardados y exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.padron.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-20 (Padrón de titulares).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1540 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-59)

<a id="API-PER-60"></a>
#### API-PER-60 · `GET /api/admin/per/privacy/requests`

- **Qué hace:** Solicitudes de derechos. Consulta `requests`.
- **Para qué sirve:** RF-PER-163: Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.privacidad.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-23 (Privacidad y derechos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-60)

<a id="API-PER-60-b"></a>
#### API-PER-60-b · `POST /api/admin/per/privacy/requests`

- **Qué hace:** Solicitudes de derechos. Registra un nuevo elemento u operación en `requests`.
- **Para qué sirve:** RF-PER-163: Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.privacidad.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-23 (Privacidad y derechos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-60-b)

<a id="API-PER-60-c"></a>
#### API-PER-60-c · `GET /api/admin/per/privacy/requests/{requestId}`

- **Qué hace:** Solicitudes de derechos. Obtiene el detalle de un registro de `requests`.
- **Para qué sirve:** RF-PER-163: Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.privacidad.gestionar`.
- **Recibe:** en la ruta `requestId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-23 (Privacidad y derechos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-60-c)

<a id="API-PER-60-d"></a>
#### API-PER-60-d · `PATCH /api/admin/per/privacy/requests/{requestId}`

- **Qué hace:** Solicitudes de derechos. Modifica algunos campos de un registro de `requests` (solo los enviados).
- **Para qué sirve:** RF-PER-163: Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.privacidad.gestionar`.
- **Recibe:** en la ruta `requestId`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-23 (Privacidad y derechos).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-60-d)

<a id="API-PER-61"></a>
#### API-PER-61 · `POST /api/admin/per/persons/{personId}/anonymize`

- **Qué hace:** Anonimiza (encola JOB-PER-11). Anonimiza un registro de persona humana o jurídica (`persons`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PER-011: Estados de la persona: activa, fallecida, fusionada, archivada (anonimizada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.personas.anonimizar`.
- **Recibe:** en la ruta `personId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1542 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-61)

<a id="API-PER-62"></a>
#### API-PER-62 · `GET /api/admin/per/user-links`

- **Qué hace:** Gestión de vínculos usuario–persona desde backoffice. Consulta `user-links`.
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.vinculosUsuario.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-62)

<a id="API-PER-62-b"></a>
#### API-PER-62-b · `POST /api/admin/per/user-links`

- **Qué hace:** Gestión de vínculos usuario–persona desde backoffice. Registra un nuevo elemento u operación en `user-links`.
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.vinculosUsuario.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-62-b)

<a id="API-PER-62-c"></a>
#### API-PER-62-c · `POST /api/admin/per/user-links/{linkId}/verify`

- **Qué hace:** Gestión de vínculos usuario–persona desde backoffice. Verifica un registro de `verify`.
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.vinculosUsuario.editar`.
- **Recibe:** en la ruta `linkId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-62-c)

<a id="API-PER-62-d"></a>
#### API-PER-62-d · `POST /api/admin/per/user-links/{linkId}/revoke`

- **Qué hace:** Gestión de vínculos usuario–persona desde backoffice. Revoca un registro de `revoke`.
- **Para qué sirve:** RF-PER-160: Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.vinculosUsuario.editar`.
- **Recibe:** en la ruta `linkId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-62-d)

<a id="API-PER-63"></a>
#### API-PER-63 · `POST /api/admin/per/imports`

- **Qué hace:** Valida y encola importación (JOB-PER-09). Registra un nuevo elemento u operación en `imports`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PER-030: Varios contactos tipados por persona (correo, celular, fijo, WhatsApp, fax), con principal, etiqueta, fuente (backoffice, portal, importación, legado web) y estado de verificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.importaciones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-PER-24 (Importación).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1544 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-63)

<a id="API-PER-64"></a>
#### API-PER-64 · `POST /api/admin/per/special-operations`

- **Qué hace:** Renumeración y correcciones especiales con aprobación. Registra un nuevo elemento u operación en `special-operations`.
- **Para qué sirve:** RF-PER-169: Operaciones especiales de corrección: cambiar el número visible del titular o de la cuenta, corregir fecha de alta del titular, recuperar titular; con permiso propio, motivo, aprobación y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.operacionesEspeciales.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-21 (Operaciones especiales).
- **Ola:** O2 · **Fuente:** M01 §11.1 Backoffice, línea 1545 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Backoffice/API-PER-64)

<a id="grupo-2"></a>

## Administración del tenant

10 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-PER-65](#API-PER-65) | GET | `/api/admin/per/settings` | Parámetros del módulo (sección 14). |
| [API-PER-65-b](#API-PER-65-b) | PUT | `/api/admin/per/settings` | Parámetros del módulo (sección 14). |
| [API-PER-66](#API-PER-66) | GET | `/api/admin/per/document-requirement-types` | Tipos de requisito documental y acciones. |
| [API-PER-66-b](#API-PER-66-b) | POST | `/api/admin/per/document-requirement-types` | Tipos de requisito documental y acciones. |
| [API-PER-66-c](#API-PER-66-c) | GET | `/api/admin/per/document-requirement-types/{id}` | Tipos de requisito documental y acciones. |
| [API-PER-66-d](#API-PER-66-d) | PATCH | `/api/admin/per/document-requirement-types/{id}` | Tipos de requisito documental y acciones. |
| [API-PER-67](#API-PER-67) | GET | `/api/admin/per/catalogs/{catalogKey}` | Catálogos del módulo (7.18) sobre el motor de T04. |
| [API-PER-67-b](#API-PER-67-b) | POST | `/api/admin/per/catalogs/{catalogKey}` | Catálogos del módulo (7.18) sobre el motor de T04. |
| [API-PER-67-c](#API-PER-67-c) | GET | `/api/admin/per/catalogs/{catalogKey}/{id}` | Catálogos del módulo (7.18) sobre el motor de T04. |
| [API-PER-67-d](#API-PER-67-d) | PATCH | `/api/admin/per/catalogs/{catalogKey}/{id}` | Catálogos del módulo (7.18) sobre el motor de T04. |

<a id="API-PER-65"></a>
#### API-PER-65 · `GET /api/admin/per/settings`

- **Qué hace:** Parámetros del módulo (sección 14). Consulta `settings`.
- **Para qué sirve:** RF-PER-017: Administración de personas separada de titulares: alta, edición y consulta de personas que no son titulares. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-65)

<a id="API-PER-65-b"></a>
#### API-PER-65-b · `PUT /api/admin/per/settings`

- **Qué hace:** Parámetros del módulo (sección 14). Reemplaza o configura `settings`.
- **Para qué sirve:** RF-PER-017: Administración de personas separada de titulares: alta, edición y consulta de personas que no son titulares. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-65-b)

<a id="API-PER-66"></a>
#### API-PER-66 · `GET /api/admin/per/document-requirement-types`

- **Qué hace:** Tipos de requisito documental y acciones. Lista, con filtros y paginación, los registros de requisitos documentales por trámite (`documentRequirementTypes`).
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de requisitos documentales por trámite (`documentRequirementTypes`) con `total`.
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-66)

<a id="API-PER-66-b"></a>
#### API-PER-66-b · `POST /api/admin/per/document-requirement-types`

- **Qué hace:** Tipos de requisito documental y acciones. Da de alta un registro de requisitos documentales por trámite (`documentRequirementTypes`).
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.configurar`.
- **Recibe:** los datos de requisitos documentales por trámite (`documentRequirementTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de requisitos documentales por trámite (`documentRequirementTypes`).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-66-b)

<a id="API-PER-66-c"></a>
#### API-PER-66-c · `GET /api/admin/per/document-requirement-types/{id}`

- **Qué hace:** Tipos de requisito documental y acciones. Obtiene el detalle de un registro de requisitos documentales por trámite (`documentRequirementTypes`).
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de requisitos documentales por trámite (`documentRequirementTypes`).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-66-c)

<a id="API-PER-66-d"></a>
#### API-PER-66-d · `PATCH /api/admin/per/document-requirement-types/{id}`

- **Qué hace:** Tipos de requisito documental y acciones. Modifica algunos campos de un registro de requisitos documentales por trámite (`documentRequirementTypes`) (solo los enviados).
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.documentacion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de requisitos documentales por trámite (`documentRequirementTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de requisitos documentales por trámite (`documentRequirementTypes`).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-66-d)

<a id="API-PER-67"></a>
#### API-PER-67 · `GET /api/admin/per/catalogs/{catalogKey}`

- **Qué hace:** Catálogos del módulo (7.18) sobre el motor de T04. Obtiene el detalle de un registro de `catalogs`.
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** en la ruta `catalogKey`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-67)

<a id="API-PER-67-b"></a>
#### API-PER-67-b · `POST /api/admin/per/catalogs/{catalogKey}`

- **Qué hace:** Catálogos del módulo (7.18) sobre el motor de T04. Registra un nuevo elemento u operación en `catalogs`.
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** en la ruta `catalogKey`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-67-b)

<a id="API-PER-67-c"></a>
#### API-PER-67-c · `GET /api/admin/per/catalogs/{catalogKey}/{id}`

- **Qué hace:** Catálogos del módulo (7.18) sobre el motor de T04. Obtiene el detalle de un registro de `catalogs`.
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** en la ruta `catalogKey`, `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-67-c)

<a id="API-PER-67-d"></a>
#### API-PER-67-d · `PATCH /api/admin/per/catalogs/{catalogKey}/{id}`

- **Qué hace:** Catálogos del módulo (7.18) sobre el motor de T04. Modifica algunos campos de un registro de `catalogs` (solo los enviados).
- **Para qué sirve:** RF-PER-171: Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `per.configuracion.configurar`.
- **Recibe:** en la ruta `catalogKey`, `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-22 (Configuración del módulo).
- **Ola:** O2 · **Fuente:** M01 §11.2 Administración del tenant, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Administraci%C3%B3n%20del%20tenant/API-PER-67-d)

<a id="grupo-3"></a>

## Portal del socio (PWA)

13 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-PER-68](#API-PER-68) | GET | `/api/per/me` | Personas vinculadas, titularidades y cuentas visibles con relación aplicable. |
| [API-PER-69](#API-PER-69) | PATCH | `/api/per/me/contacts` | Alta y cambio de contactos (fuente portal), con verificación; acepta clientMutationId. |
| [API-PER-70](#API-PER-70) | POST | `/api/per/me/links` | Solicita y verifica vínculo con una persona (intentos limitados). |
| [API-PER-70-b](#API-PER-70-b) | POST | `/api/per/me/links/{linkId}/verify` | Solicita y verifica vínculo con una persona (intentos limitados). |
| [API-PER-71](#API-PER-71) | GET | `/api/per/me/authorized-persons` | Otorga, lista y revoca autorizaciones que el titular concede. |
| [API-PER-71-b](#API-PER-71-b) | POST | `/api/per/me/authorized-persons` | Otorga, lista y revoca autorizaciones que el titular concede. |
| [API-PER-71-c](#API-PER-71-c) | GET | `/api/per/me/authorized-persons/{relationshipId}` | Otorga, lista y revoca autorizaciones que el titular concede. |
| [API-PER-71-d](#API-PER-71-d) | DELETE | `/api/per/me/authorized-persons/{relationshipId}` | Otorga, lista y revoca autorizaciones que el titular concede. |
| [API-PER-72](#API-PER-72) | POST | `/api/per/me/data-subject-requests` | Solicitud de acceso, rectificación o supresión. |
| [API-PER-73](#API-PER-73) | GET | `/api/per/me/preferences` | Preferencias y consentimientos. |
| [API-PER-73-b](#API-PER-73-b) | PUT | `/api/per/me/preferences` | Preferencias y consentimientos. |
| [API-PER-76](#API-PER-76) | POST | `/api/per/me/links/contact-code` | Envía el código de un solo uso al contacto verificado del titular de la cuenta o suministro indicado y lo verifica (RF-PER-173, DEC-043).... |
| [API-PER-76-b](#API-PER-76-b) | POST | `/api/per/me/links/contact-code/{attemptId}/verify` | Envía el código de un solo uso al contacto verificado del titular de la cuenta o suministro indicado y lo verifica (RF-PER-173, DEC-043).... |

<a id="API-PER-68"></a>
#### API-PER-68 · `GET /api/per/me`

- **Qué hace:** Personas vinculadas, titularidades y cuentas visibles con relación aplicable. Consulta `me`.
- **Para qué sirve:** RF-PER-162: En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-25 (PWA "Mis datos").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1559 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-68)

<a id="API-PER-69"></a>
#### API-PER-69 · `PATCH /api/per/me/contacts`

- **Qué hace:** Alta y cambio de contactos (fuente portal), con verificación; acepta clientMutationId. Modifica algunos campos de un registro de `contacts` (solo los enviados).
- **Para qué sirve:** RF-PER-030: Varios contactos tipados por persona (correo, celular, fijo, WhatsApp, fax), con principal, etiqueta, fuente (backoffice, portal, importación, legado web) y estado de verificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.editarContactos`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-25 (PWA "Mis datos").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1560 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-69)

<a id="API-PER-70"></a>
#### API-PER-70 · `POST /api/per/me/links`

- **Qué hace:** Solicita y verifica vínculo con una persona (intentos limitados). Registra un nuevo elemento u operación en `links`.
- **Para qué sirve:** RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.vincular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-26 (PWA "Vincular cuenta").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-70)

<a id="API-PER-70-b"></a>
#### API-PER-70-b · `POST /api/per/me/links/{linkId}/verify`

- **Qué hace:** Solicita y verifica vínculo con una persona (intentos limitados). Verifica un registro de `verify`.
- **Para qué sirve:** RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.vincular`.
- **Recibe:** en la ruta `linkId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-26 (PWA "Vincular cuenta").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-70-b)

<a id="API-PER-71"></a>
#### API-PER-71 · `GET /api/per/me/authorized-persons`

- **Qué hace:** Otorga, lista y revoca autorizaciones que el titular concede. Consulta `authorized-persons`.
- **Para qué sirve:** RF-PER-162: En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. · RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.autorizados.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-27 (PWA "Autorizados y representantes").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-71)

<a id="API-PER-71-b"></a>
#### API-PER-71-b · `POST /api/per/me/authorized-persons`

- **Qué hace:** Otorga, lista y revoca autorizaciones que el titular concede. Registra un nuevo elemento u operación en `authorized-persons`.
- **Para qué sirve:** RF-PER-162: En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. · RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.autorizados.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-27 (PWA "Autorizados y representantes").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-71-b)

<a id="API-PER-71-c"></a>
#### API-PER-71-c · `GET /api/per/me/authorized-persons/{relationshipId}`

- **Qué hace:** Otorga, lista y revoca autorizaciones que el titular concede. Obtiene el detalle de un registro de `authorized-persons`.
- **Para qué sirve:** RF-PER-162: En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. · RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.autorizados.gestionar`.
- **Recibe:** en la ruta `relationshipId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-27 (PWA "Autorizados y representantes").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-71-c)

<a id="API-PER-71-d"></a>
#### API-PER-71-d · `DELETE /api/per/me/authorized-persons/{relationshipId}`

- **Qué hace:** Otorga, lista y revoca autorizaciones que el titular concede. Elimina o da de baja un registro de `authorized-persons`.
- **Para qué sirve:** RF-PER-162: En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. · RF-PER-105: Autorizados gestionados por el titular desde el portal, con alcance limitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.autorizados.gestionar`.
- **Recibe:** en la ruta `relationshipId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-PER-27 (PWA "Autorizados y representantes").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-71-d)

<a id="API-PER-72"></a>
#### API-PER-72 · `POST /api/per/me/data-subject-requests`

- **Qué hace:** Solicitud de acceso, rectificación o supresión. Registra un nuevo elemento u operación en `data-subject-requests`.
- **Para qué sirve:** RF-PER-163: Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-25 (PWA "Mis datos").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1563 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-72)

<a id="API-PER-73"></a>
#### API-PER-73 · `GET /api/per/me/preferences`

- **Qué hace:** Preferencias y consentimientos. Consulta `preferences`.
- **Para qué sirve:** RF-PER-161: "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.editarContactos`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-25 (PWA "Mis datos").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-73)

<a id="API-PER-73-b"></a>
#### API-PER-73-b · `PUT /api/per/me/preferences`

- **Qué hace:** Preferencias y consentimientos. Reemplaza o configura `preferences`.
- **Para qué sirve:** RF-PER-161: "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.editarContactos`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-25 (PWA "Mis datos").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-73-b)

<a id="API-PER-76"></a>
#### API-PER-76 · `POST /api/per/me/links/contact-code`

- **Qué hace:** Envía el código de un solo uso al contacto verificado del titular de la cuenta o suministro indicado y lo verifica (RF-PER-173, DEC-043).... Registra un nuevo elemento u operación en `contact-code`.
- **Para qué sirve:** RF-PER-173: Enviar el código de vinculación al contacto verificado del titular (DEC-043, método otpToRegisteredContact) a pedido de M19 (RF-POR-179): dada la cuenta o el suministro, M01 resuelve el titular, elige su correo o celular… · RF-POR-179: Vincular con código al contacto del titular (DEC-043): el usuario indica la cuenta o el suministro; M19 pide a M01 enviar un código de 6 dígitos de un solo uso al correo o celular verificado del titular (enmascarado en pantalla)…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.vincular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-26 (PWA "Vincular cuenta").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-76)

<a id="API-PER-76-b"></a>
#### API-PER-76-b · `POST /api/per/me/links/contact-code/{attemptId}/verify`

- **Qué hace:** Envía el código de un solo uso al contacto verificado del titular de la cuenta o suministro indicado y lo verifica (RF-PER-173, DEC-043).... Verifica un registro de `verify`.
- **Para qué sirve:** RF-PER-173: Enviar el código de vinculación al contacto verificado del titular (DEC-043, método otpToRegisteredContact) a pedido de M19 (RF-POR-179): dada la cuenta o el suministro, M01 resuelve el titular, elige su correo o celular… · RF-POR-179: Vincular con código al contacto del titular (DEC-043): el usuario indica la cuenta o el suministro; M19 pide a M01 enviar un código de 6 dígitos de un solo uso al correo o celular verificado del titular (enmascarado en pantalla)…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `per.me.vincular`.
- **Recibe:** en la ruta `attemptId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-26 (PWA "Vincular cuenta").
- **Ola:** O2 · **Fuente:** M01 §11.3 Portal del socio (PWA), línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Portal%20del%20socio%20%28PWA%29/API-PER-76-b)

<a id="grupo-4"></a>

## Externa (`/api/v1/ext`)

2 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-PER-74](#API-PER-74) | GET | `/api/v1/ext/per/accounts/{accountNumber}/summary` | Titular (nombre y documento enmascarado), estado y bloqueos de pago para pasarelas y recaudadoras. |
| [API-PER-75](#API-PER-75) | GET | `/api/v1/ext/per/holders` | Consulta para integraciones autorizadas (por ejemplo, organismos con convenio) con campos mínimos y auditoría. |

<a id="API-PER-74"></a>
#### API-PER-74 · `GET /api/v1/ext/per/accounts/{accountNumber}/summary`

- **Qué hace:** Titular (nombre y documento enmascarado), estado y bloqueos de pago para pasarelas y recaudadoras. Consulta «summary» de un registro de cuenta de servicios (`accounts`).
- **Para qué sirve:** RF-PER-065: Ver y gestionar desde la cuenta la adhesión a débito automático (tarjeta, CBU, titular de la tarjeta, estado en la pasarela, exclusiones por tipo de comprobante), delegando la operación a M07. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `per.cuentas.ver`.
- **Recibe:** en la ruta `accountNumber`.
- **Devuelve:** 200: el registro de cuenta de servicios (`accounts`).
- **Pantallas:** PAN-PER-05 (Cuenta).
- **Ola:** O2 · **Fuente:** M01 §11.4 Externa (`/api/v1/ext`), línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Externa%20%28%60%2Fapi%2Fv1%2Fext%60%29/API-PER-74)

<a id="API-PER-75"></a>
#### API-PER-75 · `GET /api/v1/ext/per/holders`

- **Qué hace:** Consulta para integraciones autorizadas (por ejemplo, organismos con convenio) con campos mínimos y auditoría. Lista, con filtros y paginación, los registros de titular (`holders`).
- **Para qué sirve:** RF-PER-045: Dar de baja al titular con controles: servicios activos, capital integrado (consulta a M17), titular sin cuentas, relaciones en otras cuentas; con solicitud de baja imprimible. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `per.titulares.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de titular (`holders`) con `total`.
- **Pantallas:** PAN-PER-01 (Búsqueda de titulares y cuentas), PAN-PER-02 (Ficha 360 del titular).
- **Ola:** O2 · **Fuente:** M01 §11.4 Externa (`/api/v1/ext`), línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=m01-per#/Externa%20%28%60%2Fapi%2Fv1%2Fext%60%29/API-PER-75)
