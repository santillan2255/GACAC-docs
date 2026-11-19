# T08 NFR — Requisitos no funcionales, seguridad, privacidad, observabilidad y calidad

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma (transversal a ERP, CRM, Landing-autogestión, Cobranza, Pasarelas, Impuestos y APIs) |
| Olas | **O0** para toda la base técnica obligatoria (convenciones, librerías `money`/fechas/Zod/crypto/http, logs estructurados, trazas, métricas, headers, CSP, CORS, rate limit, upload seguro, URLs firmadas, idempotencia, control optimista, pruebas de aislamiento multitenant en CI, pipeline CI/CD, backups y PITR). **O1** para privacidad operativa (registro de tratamientos, avisos y consentimientos, solicitudes de derechos), auditoría reforzada de lecturas sensibles, rotación de claves, simulacros de restauración por tenant y tableros de salud. **O2** portal "Mis datos" del socio. **O4–O6** metas de rendimiento de facturación masiva, emisión fiscal y cobranza, con pruebas de carga obligatorias antes de cerrar cada ola. **O7** metas de lecturas y telemedición. **O10** controles reforzados de datos de salud (M18). **O11** metas de BI/APIs externas, versionado de API pública y ensayo de restauración con migración. Cada ola posterior **hereda** todas las metas y controles vigentes y agrega los propios (incremental). |
| Dueño de datos | Inventario de datos personales (`dataCatalogEntries`), registro de tratamientos (`processingActivities`), avisos de privacidad versionados (`privacyNotices`), consentimientos y preferencias (`consentRecords`), solicitudes de derechos de titulares (`dataSubjectRequests`), políticas de conservación (`retentionPolicies`), bloqueos legales (`legalHolds`), ejecuciones de conservación/anonimización (`retentionRuns`), incidentes de seguridad y de datos personales (`securityIncidents`), simulacros de restauración (`restoreTests`), metadatos de claves de cifrado (`encryptionKeys`), claves de idempotencia (`idempotencyKeys`), definiciones de SLO y reglas de alerta técnica (`sloDefinitions`, `alertRules`, `alerts`), reportes CSP (`cspReports`), corridas de pruebas de carga y evidencias de liberación (`qualityEvidence`). **No** es dueño de: identidades, sesiones, roles ni del registro de auditoría `auditLogs` (T02), ambientes, tenants, backups operativos y salida de tenant (T01), credenciales de integración por tenant y conectores (T06), outbox/jobs/workflow (T11), diccionario y design system (T03). |
| Fuentes consolidadas | `06-impacto-adaptacion-stack-goodapps.md`; `00` §5 (Azure, .NET). BASE §29 (seguridad, permisos y auditoría; CU-29), §34 (escenarios 6, 7, 14, 15, 16–21, 29, 42, 43, 45, 46, 48, 50, 53, 59, 70, 82, 86), §54 (registro de auditoría, alertas, tableros GOB-001..004, CU-GOB-01), §59 (API-001..003, CU-API-01), §60 (SEG-001..005, referencias SEG1–SEG5, protección transversal, CU-SEG-01), §64.5 (operación y soporte de la plataforma), §65 (diccionario, texto base de respaldo), §97.1 (protección de datos personales), §97.8 (dimensiones no funcionales), §97.9 (ambientes y pruebas), §97.12 (base desde el día uno), §98 (pendientes: rol ante Ley 25.326, plazos de conservación, metas no funcionales); AGR-011, AGR-016, AGR-017, AGR-019, AGR-020, AGR-025, AGR-030, AGR-032, AGR-033, AGR-034, AGR-035, ESC-01..ESC-05; CNX §2.1, §2.3, §2.5, §2.6, §2.8, §3.7, §4.5, §4.6, §10 (V-01, V-02, V-04, V-05, V-07, V-13, credenciales en `.env`, hallazgo de token en README), §11; RN-09 §3, §4.1, §4.2, §4.3, §5.2, §5.3, §5.4, §5.6, §5.7, §5.8, §7 (implicancias 1–10), §8 (duda 6); RN-10 §13 (secretos hardcodeados) y §14; RN-13 §17 (hallazgos de seguridad de pasarelas); DFA Módulo 1 (Plataforma, seguridad y auditoría: usuarios, perfiles, auditoría, `AUDIT_IA`, autorizaciones, bloqueos, copia de seguridad, firma digital, API para terceros, mejoras propuestas), DFA §32 (tablas de seguridad), DFA §33 (criterio de aceptación del paralelo). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

> **Norma de plataforma (DEC-112, DEC-111).** Alojamiento y servicios en **Microsoft Azure**; datos en **Azure SQL**; secretos en **Azure Key Vault**; observabilidad **Application Insights**. Pruebas de integración contra SQL relacional con aislamiento multitenant en CI.

Fijar, con métricas y criterios verificables, **cómo** debe comportarse CoopApps en todos sus módulos y canales, de modo que el equipo GoodApps construya una base técnica verificable desde el primer entregable:

1. **Rendimiento y capacidad**: tiempos de respuesta por tipo de pantalla y operación, metas de procesos masivos (facturación de N suministros en un tiempo X, emisión fiscal, distribución, importaciones, sincronización offline) y **aislamiento de carga** entre tenants (AGR-020).
2. **Disponibilidad y continuidad**: objetivo de disponibilidad, ventanas de mantenimiento, **RPO/RTO**, copias de seguridad con restauración **probada**, restauración selectiva de un tenant sin retroceder a los demás y sin duplicar efectos externos (AGR-019, ESC-04).
3. **Seguridad** alineada a **OWASP ASVS 5.0 nivel 2** (BASE §60 [SEG1]): cifrado en tránsito y en reposo, cifrado de campos sensibles con claves por tenant, bóveda y rotación, headers, CSP, CORS, rate limiting, antiautomatización, carga segura de archivos con antivirus, URLs firmadas, validación Zod, prevención de inyección NoSQL y SSRF, gestión de dependencias y de la cadena de suministro; sin repetir las deudas de ProCoop y Connectia.
4. **Privacidad y protección de datos personales** conforme a la **Ley 25.326** y la normativa de la AAIP (BASE §97.1, AGR-033): finalidad, consentimientos, derechos de acceso, rectificación, actualización y supresión, conservación y borrado, anonimización, registro de tratamientos, tratamiento reforzado de datos de salud (servicios sociales M18 y datos sanitarios que alcancen a M17/M01), minimización en APIs, BI, bot e IA.
5. **Auditoría, trazabilidad y observabilidad**: metas sobre el registro de auditoría de T02, logs estructurados con `tenantId`/`requestId`/`traceId`, métricas, trazas OpenTelemetry, alertas y tableros de salud de plataforma y tenant (BASE §54).
6. **Calidad**: estrategia de pruebas obligatoria en CI (unitarias, integración con Mongo real, contrato, e2e Playwright, carga, seguridad, **aislamiento multitenant**), cobertura mínima, datos de prueba ficticios, evidencias por entrega (AGR-035), CI/CD, versionado de API.
7. **Experiencia transversal**: compatibilidad de navegadores y dispositivos, offline PWA, accesibilidad (referencia a T03), internacionalización es-AR (moneda, formatos, zonas horarias).
8. **Exactitud**: aritmética monetaria y redondeos (AGR-011), concurrencia, control optimista e idempotencia de extremo a extremo (AGR-016).

## 2. Límite y responsabilidades

### 2.1 Qué hace este anexo

- Define **metas** (cifras objetivo de ingeniería), **controles** obligatorios y **criterios de verificación** que aplican a todos los anexos T01–T11 y M01–M19.
- Es dueño de las capacidades de **privacidad operativa** (registro de tratamientos, inventario de datos, avisos, consentimientos, solicitudes de derechos, conservación, bloqueos legales, anonimización), **gestión de incidentes de seguridad y de datos personales**, **simulacros de restauración**, **SLO y alertas técnicas**, **evidencias de calidad** e **idempotencia HTTP genérica**.
- Fija las librerías compartidas obligatorias de O0: `packages/shared/money`, `packages/shared/dates`, `packages/shared/schemas` (Zod), `packages/shared/crypto`, `packages/shared/http` (cliente saliente con protección SSRF), `packages/shared/logger`, `packages/shared/telemetry`, `packages/shared/idempotency`, `packages/shared/testing` (fábricas de datos ficticios y suite de aislamiento).
- Registra las **lecciones de seguridad** de ProCoop y Connectia como requisitos con ID (sección 9.13).

### 2.2 Qué NO hace

- No define identidad, autenticación, MFA, Google, sesiones, roles, perfiles, alcance ni el **modelo** del registro de auditoría: **T02 IAM**. Aquí solo se fijan metas y controles que T02 debe cumplir (por ejemplo, almacenamiento resistente de contraseñas, inmutabilidad de auditoría, auditoría de lecturas sensibles).
- No define el ciclo de vida de tenants, ambientes por tenant, sandbox de configuración, la operación de backups, la salida de una cooperativa ni el soporte con acceso temporal: **T01 PLA**. Aquí se fijan RPO/RTO, frecuencia, retención, cifrado, pruebas y criterios de restauración.
- No define la bóveda de credenciales por tenant ni los conectores: **T06 INT**. Aquí se fijan los controles criptográficos, de rotación y de egreso (SSRF) que la bóveda y los conectores cumplen.
- No define outbox, eventos, jobs ni workflow: **T11 WFL**. Aquí se fijan metas de latencia, reanudación e idempotencia.
- No define componentes visuales ni el diccionario: **T03 UXD**. Aquí se referencian WCAG 2.2 AA, presupuestos de rendimiento web y compatibilidad.
- No define reglas de redondeo de cada concepto tarifario o fiscal: **M04 TAR** y **M06 FIS**. Aquí se fija la infraestructura monetaria, los invariantes y el redondeo por defecto.
- No define la migración: **T07 MIG**. Aquí se fija qué datos de seguridad de ProCoop **no** se migran y cómo se tratan.

### 2.3 Qué delega y a quién

| Tema | Delegado a | Lo que T08 exige |
|---|---|---|
| Contraseñas, MFA, sesiones, recuperación | T02 | RNF-NFR-060 a 066 (ASVS 5.0 capítulos de autenticación y sesión, nivel 2) |
| Modelo `auditLogs` y consulta de auditoría | T02 | RNF-NFR-110 a 119 |
| Backups operativos, ambientes, salida del tenant | T01 | RNF-NFR-030 a 049, 170 |
| Bóveda de credenciales y conectores | T06 | RNF-NFR-067 a 071, 087, 088 |
| Jobs, outbox, reintentos | T11 | RNF-NFR-010 a 018, 214 a 222, 227 |
| Accesibilidad y design system | T03 | RNF-NFR-180 a 182 |
| Datos de salud y servicios sociales | M18 (y M17/M01 cuando registren datos sanitarios o de electrodependencia) | RNF-NFR-100 a 102 |
| Reportes y APIs de BI | T10 | RNF-NFR-019, 103, 106, 175 a 177 |

## 3. Glosario del anexo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| SLI | Indicador de nivel de servicio medido (por ejemplo, proporción de requests exitosos bajo 400 ms). | `dict:nfr.sli` | — |
| SLO | Objetivo interno sobre un SLI en una ventana (por ejemplo, 99,5 % mensual). | `dict:nfr.slo` | — |
| SLA | Compromiso contractual con la cooperativa, derivado de un SLO con margen (PA-NFR-01). | `dict:nfr.sla` | — |
| Presupuesto de error | 100 % − SLO; tiempo o proporción de fallas tolerada en la ventana. | `dict:nfr.errorBudget` | — |
| p95 / p99 | Percentil 95/99 del tiempo de respuesta medido en servidor (desde que el request llega al API hasta que se envía el último byte), salvo indicación de "medido en cliente". | `dict:nfr.percentil` | — |
| RPO | Pérdida máxima de datos tolerada, expresada en tiempo (AGR-019). | `dict:nfr.rpo` | — |
| RTO | Tiempo máximo para restablecer el servicio o el tenant (AGR-019). | `dict:nfr.rto` | — |
| PITR | Restauración a un punto en el tiempo a partir de snapshot + oplog. | `dict:nfr.pitr` | Backup SQL del Agente (`clsServicio_Procoop`) |
| Restauración selectiva | Recuperación de los datos de un solo tenant en un ambiente aislado y su reconciliación con producción, sin retroceder a otros tenants. | `dict:nfr.restauracionSelectiva` | — (una base por cooperativa) |
| Tenant ruidoso | Tenant cuya carga degrada a otros; se contiene con cuotas y colas separadas. | `dict:nfr.tenantRuidoso` | — |
| ASVS L2 | Nivel 2 del OWASP Application Security Verification Standard 5.0: recomendado para aplicaciones con datos sensibles. | `dict:nfr.asvsL2` | — |
| DEK / KEK | Clave de datos (por tenant) que cifra campos; clave maestra en KMS que envuelve a la DEK (cifrado de sobre). | `dict:nfr.dekKek` | `Nucleo.Encriptar` (ofuscación reversible, reemplazada) |
| Índice ciego | HMAC con clave secreta de un valor cifrado, que permite búsqueda exacta sin descifrar. | `dict:nfr.indiceCiego` | — |
| URL firmada | Enlace temporal, de un solo objeto, emitido tras verificar permisos, para descargar o subir a almacenamiento privado. | `dict:nfr.urlFirmada` | `/uploads` público (CNX V-01); FTP/S3 de publicación web (`WEB_*`) |
| Cuarentena | Zona de almacenamiento donde queda un archivo subido hasta pasar el análisis antivirus y de tipo. | `dict:nfr.cuarentena` | — |
| Clave de idempotencia | Identificador enviado en `Idempotency-Key` que garantiza que un reintento no repite el efecto. | `dict:nfr.idempotencyKey` | — |
| `clientMutationId` | Identificador único de una mutación generada offline (CNX §3.7). | `dict:nfr.clientMutationId` | — |
| Titular de los datos | Persona humana o jurídica cuyos datos se tratan (Ley 25.326 art. 2). | `dict:nfr.titularDatos` | — |
| Responsable de la base | La cooperativa (tenant), que decide finalidad y medios del tratamiento. | `dict:nfr.responsableBase` | — |
| Prestador de servicios de tratamiento (encargado) | CoopApps, que trata datos por cuenta de la cooperativa (Ley 25.326 art. 25). | `dict:nfr.encargado` | — |
| Subencargado | Proveedor que CoopApps usa para tratar datos (nube, correo, SMS, WhatsApp, mapas, pagos, IA, antivirus, observabilidad). | `dict:nfr.subencargado` | Amazon SES, Firebase, Google Maps, OpenAI (RN-10 §13) |
| Solicitud de derechos | Pedido del titular de acceso, rectificación, actualización o supresión (y oposición/revocación de consentimiento). En el texto se abrevia "ARCO". | `dict:nfr.solicitudDerechos` | — |
| Dato sensible | Dato que revela origen racial o étnico, opiniones políticas, convicciones religiosas, filosóficas o morales, afiliación sindical, información de salud o vida sexual (Ley 25.326 art. 2). | `dict:nfr.datoSensible` | Banco de sangre (servicio sin autenticación, RN-13 §17) |
| Bloqueo legal | Marca que impide suprimir o anonimizar datos mientras exista obligación legal, litigio o requerimiento. | `dict:nfr.bloqueoLegal` | — |
| Anonimización | Transformación irreversible que impide reidentificar al titular. | `dict:nfr.anonimizacion` | — |
| Seudonimización | Sustitución de identificadores por valores derivados con clave; reversible solo con la clave. | `dict:nfr.seudonimizacion` | — |
| Evidencia de liberación | Conjunto de resultados de pruebas, escaneos y aprobaciones vinculado a una versión liberada (AGR-035). | `dict:nfr.evidenciaLiberacion` | — |
| Congelamiento | Período en que no se despliegan cambios no urgentes (por ejemplo, durante facturación masiva o vencimientos). | `dict:nfr.congelamiento` | — |

## 4. Actores, permisos y alcance

| Rol | Ámbito | Capabilities | Alcance de datos |
|---|---|---|---|
| Administrador de plataforma | `PLATFORM` | `nfr.saludPlataforma.ver`, `nfr.incidentes.ver`, `nfr.incidentes.crear`, `nfr.incidentes.editar`, `nfr.incidentes.cerrar`, `nfr.restauracion.aprobar`, `nfr.claves.ver`, `nfr.alertas.configurar`, `nfr.evidencias.ver` | Metadatos técnicos de todos los tenants; **sin** acceso a datos personales u operativos de un tenant salvo acceso temporal de soporte (AGR-034, T01/T02). |
| Operador SRE / guardia de plataforma | `PLATFORM` | `nfr.saludPlataforma.ver`, `nfr.alertas.reconocer`, `nfr.incidentes.crear`, `nfr.incidentes.editar`, `nfr.restauracion.ejecutar` | Métricas, logs redactados y trazas; restauración en ambiente aislado. |
| Oficial de seguridad de plataforma | `PLATFORM` | `nfr.incidentes.ver`, `nfr.incidentes.gestionar`, `nfr.incidentes.editar` (antes `nfr.incidentes.*`, comodín; T02 §4.4.3), `nfr.claves.rotar`, `nfr.cspReportes.ver`, `nfr.evidencias.aprobar` | Eventos de seguridad de todos los tenants (redactados). |
| Responsable de privacidad de plataforma (encargado) | `PLATFORM` | `nfr.tratamientos.ver` (plantilla global), `nfr.subencargados.editar`, `nfr.incidentes.ver` | Registro de subencargados y plantillas; no datos de titulares. |
| Administrador de cooperativa | Tenant | `nfr.salud.ver`, `nfr.conservacion.ver`, `nfr.tratamientos.ver`, `nfr.restauracion.solicitar`, `nfr.incidentes.ver` | Su tenant. |
| Responsable de protección de datos del tenant | Tenant | `nfr.tratamientos.ver`, `nfr.tratamientos.editar`, `nfr.tratamientos.exportar`, `nfr.inventarioDatos.ver`, `nfr.avisos.ver`, `nfr.avisos.editar`, `nfr.avisos.publicar`, `nfr.consentimientos.ver`, `nfr.consentimientos.exportar`, `nfr.solicitudesDerechos.ver`, `nfr.solicitudesDerechos.editar`, `nfr.solicitudesDerechos.aprobar`, `nfr.solicitudesDerechos.exportar`, `nfr.conservacion.configurar`, `nfr.bloqueosLegales.crear`, `nfr.bloqueosLegales.aprobar`, `nfr.bloqueosLegales.anular`, `nfr.anonimizacion.aprobar` | Su tenant; datos de titulares solo dentro de una solicitud o tarea asignada. |
| Operador de atención | Tenant | `nfr.solicitudesDerechos.crear`, `nfr.solicitudesDerechos.ver` (propias) | Solicitudes que registra en nombre del titular (presencial, teléfono, correo). |
| Auditor interno del tenant | Tenant | `nfr.tratamientos.ver`, `nfr.solicitudesDerechos.ver`, `nfr.consentimientos.ver`, `nfr.salud.ver` | Solo lectura en su tenant. |
| Socio / titular | Tenant (PWA) | `por.misDatos.ver`, `por.misDatos.solicitar`, `por.consentimientos.editar` | Sus propios datos y los de las cuentas que tiene autorizadas (escenario 18). |
| Empleado (como titular) | Tenant (PWA empleado) | `por.misDatos.ver`, `por.misDatos.solicitar` | Sus datos de legajo visibles según M16. |
| Proceso automático (worker) | Tenant/plataforma | Identidad técnica por proceso (`svc:<modulo>:<proceso>`) | Solo las colecciones de su módulo; queda como actor técnico en auditoría (BASE §54). |
| Cliente técnico de API (BI) | Tenant | Alcances del token (T10/T02) | Su tenant, sin datos de salud ni documentos por defecto (AGR-033). |

**Reglas de autorización** (BASE §29): el permiso y el tenant se verifican **siempre en servidor**; ocultar un botón no autoriza ni deniega. Ninguna capability `nfr.*` de tenant puede ser asignada por un administrador de cooperativa a un usuario de otro tenant ni elevarse a `PLATFORM` (escenario 17).

## 5. Requisitos funcionales de soporte y mapa de requisitos no funcionales

### 5.1 Requisitos funcionales propios del anexo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-NFR-001 | Inventario de datos personales por entidad/colección: campo, categoría (identificatorio, contacto, fiscal, financiero, ubicación, salud, laboral, imagen, comunicación), sensibilidad (`publica`, `interna`, `personal`, `sensible`, `secreta`), finalidad, base legal, plazo de conservación, cifrado, exposición en API/BI/IA. Se genera desde metadatos declarados en los esquemas Mongoose (`x-pii`) y se completa en pantalla. | BASE §97.1; AGR-033 | Núcleo | O1 | Adoptado | Un script de CI falla si un campo nuevo no declara `x-pii`; la pantalla lista el 100 % de los campos declarados. |
| RF-NFR-002 | Registro de actividades de tratamiento por tenant, con plantilla precargada (gestión del suministro, facturación y cobranza, atención y reclamos, técnica y campo, comunicaciones institucionales, comunicaciones promocionales, comunidad/muro, servicios sociales y salud, personal y sueldos, institucional/asociados, videollamada/bot si se habilita, IA) y campos: finalidad, base legal (art. 5 inc.), categorías de titulares y datos, destinatarios y cesiones, subencargados, transferencias internacionales, plazo, medidas de seguridad. | BASE §97.1; Ley 25.326 arts. 3, 5, 6, 9, 11, 12, 21 [VERIFICAR] | Núcleo | O1 | Adoptado (DEC-076) | El tenant puede exportar el registro en XLSX/PDF; cada entrada tiene versión y fecha. |
| RF-NFR-003 | Avisos de privacidad versionados por tenant y canal (landing, registro, app, formulario presencial), con contenido mínimo del art. 6 (finalidad, destinatarios, existencia del archivo y responsable, obligatoriedad, consecuencias, derechos), publicados desde la configuración versionada (T04). | BASE §97.1; Ley 25.326 art. 6 | Núcleo | O1 | Adoptado | Cambiar el aviso crea versión nueva; los consentimientos previos quedan ligados a la versión aceptada. |
| RF-NFR-004 | Registro de consentimientos y preferencias: titular, finalidad, versión del aviso, canal, fecha, evidencia (IP truncada, agente de usuario, firma o formulario escaneado), estado (otorgado, revocado, vencido), revocación en un paso. | BASE §97.1 | Núcleo | O1 | Adoptado | Revocar el consentimiento promocional impide en ≤ 5 min que el motor de audiencia (T09) incluya al titular. |
| RF-NFR-005 | Separación de comunicaciones institucionales/transaccionales (factura, vencimiento, corte, reclamo) y promocionales; las promocionales exigen consentimiento u oposición respetada y consulta del Registro Nacional "No Llame" para llamadas y mensajes cuando aplique. | Ley 25.326 art. 27; Ley 26.951 [VERIFICAR]; CNX §2.7 | Estándar | O2 | A validar (PA-NFR-20) | Una campaña promocional excluye a quienes revocaron o figuran en el registro; queda evidencia de la consulta. |
| RF-NFR-006 | Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles (acceso: 10 días corridos; rectificación/actualización/supresión: 5 días hábiles) con semáforo, asignación, respuesta y evidencia. | BASE §97.1; Ley 25.326 arts. 14 y 16 [VERIFICAR] | Núcleo | O1 | Adoptado | Una solicitud de acceso genera el informe en ≤ 10 días corridos; la bandeja alerta al 70 % del plazo. |
| RF-NFR-007 | Informe de acceso del titular: generación automática (job `nfr:informe-acceso`) de todos los datos del titular en el tenant, en lenguaje claro, PDF y JSON legible, excluyendo datos de terceros y secretos. | Ley 25.326 art. 15 | Núcleo | O1 | Adoptado | El informe incluye cada colección marcada con `x-pii` en que figure el titular; prueba automatizada con titular ficticio en 2 tenants muestra solo los del tenant solicitado. |
| RF-NFR-008 | Supresión compatible con obligaciones de conservación: si hay bloqueo legal o plazo vigente, se **bloquea** el tratamiento (solo consulta para la obligación) y se programa la supresión o anonimización al vencer; si no, se suprime o anonimiza. | BASE §97.1; AGR-033 | Núcleo | O1 | Adoptado | Suprimir un socio con facturas de hace 3 años no borra facturas; anonimiza contacto y comunicación no obligatorios y marca bloqueo. |
| RF-NFR-009 | Políticas de conservación por categoría de dato y tipo de documento, parametrizables por tenant dentro de mínimos y máximos de plataforma, con job diario de aplicación (`nfr:aplicar-conservacion`) y reporte previo de impacto. | AGR-033; BASE §98 | Núcleo | O1 | A validar (PA-NFR-06) | Un ensayo con datos ficticios vencidos muestra el reporte previo, la aprobación y el resultado; nada se elimina sin aprobación de la primera ejecución por categoría. |
| RF-NFR-010 | Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. | AGR-033 | Estándar | O1 | Adoptado | Un bloqueo activo hace que el job de conservación omita esos datos y lo registre. |
| RF-NFR-011 | Anonimización irreversible para BI histórico y para titulares suprimidos: sustitución de identificadores, generalización de domicilio a localidad, fechas a mes, eliminación de texto libre e imágenes. | BASE §97.1; AGR-033 | Estándar | O1 | Adoptado | Pruebas de reidentificación: ningún registro anonimizado conserva DNI, CUIT, nombre, correo, teléfono, calle ni coordenadas. |
| RF-NFR-012 | Portal "Mis datos y privacidad" del socio/empleado: ver datos, descargar informe, pedir rectificación, revocar consentimientos, ver avisos aceptados y estado de solicitudes. | BASE §97.1; §50 | Estándar | O2 | Adoptado | Recorrido e2e Playwright con socio ficticio. |
| RF-NFR-013 | Registro de subencargados de plataforma (proveedor, servicio, datos tratados, país, garantía de transferencia, fecha de alta) visible para cada tenant, con aviso al tenant ≥ 30 días antes de incorporar uno nuevo. | BASE §97.1; Ley 25.326 art. 12 [VERIFICAR] | Núcleo | O1 | A validar (PA-NFR-05, PA-NFR-07) | El tenant ve la lista vigente y el historial; un alta genera notificación. |
| RF-NFR-014 | Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y cierre. | BASE §97.1, §60 | Núcleo | O1 | A validar (PA-NFR-08) | Un simulacro anual cumple los plazos de notificación de PA-NFR-08 con evidencia. |
| RF-NFR-015 | Simulacros de restauración: plan, ejecución, mediciones (RPO real, RTO real), verificación de integridad y conciliación externa, acta. | AGR-019 | Núcleo | O1 | Adoptado | Un simulacro mensual de plataforma y uno trimestral por tenant piloto con acta firmada. |
| RF-NFR-016 | Tablero de salud de plataforma: disponibilidad por servicio, latencias, errores, colas, jobs, integraciones, backups, certificados próximos a vencer, alertas activas, consumo por tenant. | BASE §54 GOB-001, GOB-003 | Núcleo | O1 | Adoptado | El tablero muestra datos con antigüedad ≤ 60 s. |
| RF-NFR-017 | Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. | BASE §54 GOB-002; RN-09 §5.6 (avisos de backups vencidos, vencimiento de certificado AFIP) | Núcleo | O1 | Adoptado | Un certificado ARCA que vence en ≤ 30 días aparece como alerta. |
| RF-NFR-018 | Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). | BASE §54 GOB-003 | Núcleo | O1 | Adoptado | Una alerta repetida dentro de la ventana de deduplicación no genera una segunda notificación. |
| RF-NFR-019 | Página de estado de la plataforma y aviso en el admin de incidentes y mantenimientos programados. | BASE §64.5 | Estándar | O1 | A validar (PA-NFR-15) | Un mantenimiento programado se publica ≥ 72 h antes. |
| RF-NFR-020 | Recepción de reportes CSP y de violaciones de seguridad del navegador (`report-to`), agregados y deduplicados. | ASVS (Frontend) | Estándar | O0 | Adoptado | Un reporte de violación aparece en `cspReports` en ≤ 1 min. |
| RF-NFR-021 | Publicación de `/.well-known/security.txt` y política de divulgación responsable. | ASVS (Configuración) | Estándar | O0 | Adoptado | El archivo responde con contacto y vencimiento válidos. |
| RF-NFR-022 | Evidencia de liberación por versión: resultados de pruebas, cobertura, SCA, SAST, DAST, imágenes escaneadas, SBOM, pruebas de carga cuando corresponda y aprobaciones. | AGR-035 | Núcleo | O0 | Adoptado | No se puede promover a producción una versión sin evidencia completa (gate del pipeline). |
| RF-NFR-023 | Consola de claves: listado de claves de cifrado y firma (metadatos, nunca material), fecha de creación, próxima rotación, estado, y rotación manual con doble aprobación. | ASVS (Criptografía); CNX V-02 | Estándar | O1 | Adoptado | Una rotación manual re-envuelve todas las DEK de un tenant sin indisponibilidad. |
| RF-NFR-024 | Restricción y registro de exportaciones con datos personales: motivo opcional, tope de filas por rol, marca de agua con usuario y fecha en PDF/XLSX, vencimiento del archivo generado. | BASE §29 ("restricción y registro de exportaciones") | Núcleo | O0 | Adoptado | Cada exportación queda en auditoría con filtros, cantidad y destino; el archivo expira a las 24 h. |
| RF-NFR-025 | Gestión de cuotas por tenant (requests por minuto, jobs concurrentes, almacenamiento, exportaciones, consumo de IA, llamadas BI) visible en el tablero del tenant y en plataforma. | AGR-020; BASE §59 | Estándar | O1 | Adoptado | Superar la cuota devuelve 429 con `Retry-After` y la cuota consumida se ve en el tablero. |

### 5.2 Mapa de requisitos no funcionales

| Sección | Tema | Rango de IDs |
|---|---|---|
| 7 | Rendimiento, capacidad, escalabilidad, aislamiento de carga, jobs | RNF-NFR-001 a 029 |
| 8 | Disponibilidad, ventanas, RPO/RTO, backups, restauración, continuidad | RNF-NFR-030 a 049 |
| 9 | Seguridad (ASVS L2, cifrado, bóveda, rotación, headers, CSP, CORS, rate limit, antiautomatización, uploads, URLs firmadas, Zod, NoSQL, SSRF, dependencias, infraestructura) y lecciones ProCoop/Connectia | RNF-NFR-050 a 099 y 230 a 238 |
| 10 | Privacidad y protección de datos personales, datos de salud | RNF-NFR-100 a 109 (+ RF-NFR-001 a 015) |
| 11 | Auditoría, trazabilidad y observabilidad | RNF-NFR-110 a 139 |
| 12 | Calidad, pruebas, CI/CD, ambientes, versionado de API | RNF-NFR-140 a 179 |
| 13 | Compatibilidad, offline PWA, accesibilidad, internacionalización | RNF-NFR-180 a 199 |
| 14 | Exactitud monetaria, redondeos, concurrencia e idempotencia, integridad referencial | RNF-NFR-200 a 229 y 260 (verificador de integridad referencial, DEC-100) |
| 15.9 | Mantenibilidad, arquitectura modular, portabilidad, interoperabilidad, usabilidad operativa, costos, soporte, agente local y crecimiento de datos | RNF-NFR-240 a 259 |
| 15.1–15.8 | Modelo de datos, estados, pantallas, API, eventos y jobs, integraciones, parámetros e indicadores propios del anexo | JOB-NFR, EVT-NFR, PAN-NFR, API-NFR, PRM-NFR, IND-NFR |

Formato de cada RNF: **ID | Requisito | Métrica / meta | Criterio verificable (cómo se prueba) | Origen | Prioridad | Ola | Estado**. Las metas numéricas son **objetivos de ingeniería internos** verificados en CI y en pruebas de carga sobre el **perfil de referencia** (sección 7.1); el compromiso contractual con cada cooperativa (SLA) se deriva de ellas según PA-NFR-01 y CTR-NFR-01.

## 6. Reglas de negocio transversales

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-NFR-001 | El tenant de toda operación sale del token o de la identidad técnica del job; nunca de un header, query o body. | Una base por cooperativa elegida por archivo `.pro` local (RN-09 §3). | Reemplazar (DEC-002, CNX §2.3) | — | — |
| RN-NFR-002 | Ninguna consulta, agregación, actualización o borrado sobre una colección de negocio se ejecuta sin `tenantId`; el plugin lanza error y la prueba de CI lo detecta. | No existe identificador de empresa en las tablas (RN-09 §3). | Reemplazar | — | — |
| RN-NFR-003 | Ningún secreto (contraseña, token, clave, certificado, semilla TOTP, clave de API) se guarda en código, repositorio, logs, auditoría, mensajes de error, URL ni almacenamiento del navegador accesible a JS. | Secretos hardcodeados y credenciales en `VARIABLE`/`.pro` con ofuscación reversible (RN-10 §13; RN-09 §5.3); token de GitHub en README (CNX §10). | Reemplazar | — | — |
| RN-NFR-004 | No existen contraseñas maestras, contraseñas por defecto fijas, puertas traseras ni credenciales de depuración precargadas en ningún ambiente. | Contraseñas maestras y derivadas de la fecha; precarga con depurador (RN-09 §4.1). | Descartar (deuda de seguridad) | — | — |
| RN-NFR-005 | Un importe se representa como `Decimal128`/`decimal.js`; está prohibido `Number` para importes, tasas, alícuotas y cantidades facturables. | — | Adoptar (convención §5 de la guía) | PRM-NFR-060 a 063 | — |
| RN-NFR-006 | La suma de las partes es exactamente igual al total en todo documento, distribución y prorrateo; el residuo de redondeo se asigna por el método de mayor resto y queda explicado. | — | Adoptar (AGR-011, escenario 72) | PRM-NFR-062 | — |
| RN-NFR-007 | Toda operación económica o de integración es idempotente por `Idempotency-Key` o por clave natural única; un reintento devuelve el mismo resultado y no repite efectos. | — | Adoptar (AGR-016; escenarios 6, 7, 50, 59, 70) | PRM-NFR-070 | — |
| RN-NFR-008 | Una confirmación de pago se acepta solo si la verifica el proveedor por canal servidor-a-servidor o webhook firmado; nunca por importe informado por el cliente o el portal. | ProvinciaNet acepta como pagado lo que informa el portal (RN-13 §17). | Reemplazar | — | — |
| RN-NFR-009 | Nunca se almacenan, transmiten ni procesan en componentes de CoopApps (servidores, agentes locales, bóveda, logs, colas, archivos de presentación ni migración) el número completo de tarjeta, el código de seguridad ni el vencimiento; los cobros con tarjeta usan formularios o campos alojados por el proveedor, redirección o terminal certificada, y el débito automático guarda solo token o número de adherente, marca y últimos 4. Alcance PCI DSS de CoopApps: SAQ A (SAQ P2PE para terminales certificadas), con certificación PCI DSS vigente de cada proveedor y controles de scripts en las páginas de pago (PCI DSS 4.0, 6.4.3 y 11.6.1). En la migración (DEC-103, que amplía DEC-091 y DEC-092), antes de cada extracción se escanea la base de origen buscando números de tarjeta con validación de Luhn y columnas con apariencia de credencial no listadas en T07 RN-MIG-013, incluida `CUPONTAR`; un hallazgo **bloquea la migración** hasta que la columna se clasifique y se suprima en la extracción, y el escaneo informa solo tabla, columna y cantidad de filas, nunca valores (T07 RN-MIG-013 y RN-MIG-056; sección 19). | Datos de tarjeta inyectados en HTML local del tótem (RN-13 §17). | Reemplazar | — | Resuelto por DEC-091 (antes "Alcance PCI DSS con cada pasarela") |
| RN-NFR-010 | Ningún dato personal se envía a un proveedor de IA sin acuerdo de tratamiento, evaluación previa y redacción de identificadores; los datos de salud nunca se envían. | Clave de OpenAI hardcodeada; `AUDIT_IA` (RN-10 §13; DFA M1). | Mejorar | PRM-NFR-090 | PA-NFR-09 |
| RN-NFR-011 | Mensajes, adjuntos y documentos son **datos**, no instrucciones: no pueden ampliar permisos, cambiar el tenant ni ejecutar acciones (prevención de inyección de prompt). | — | Adoptar (AGR-030) | — | — |
| RN-NFR-012 | La IA solo propone; ninguna clasificación de IA produce por sí sola una baja, un cobro, un corte ni una decisión clínica. | — | Adoptar (AGR-030; escenario 34) | — | — |
| RN-NFR-013 | La copia de servicios entre tenants y la reutilización de Connectyx nunca trasladan datos personales, credenciales ni secretos. | — | Adoptar (BASE §97.1 control; escenario 82) | — | — |
| RN-NFR-014 | Los datos de ambientes no productivos son ficticios; está prohibido copiar datos reales a desarrollo, pruebas o demostración. La precarga de demostración no existe en producción. | Usuarios demo con clave conocida (CNX V-13). | Adoptar (BASE §97.1, §97.9) | — | PA-NFR-19 |
| RN-NFR-015 | Desde un ambiente no productivo no se pueden emitir comprobantes fiscales reales, cobrar ni enviar mensajes a destinatarios reales: se usan homologación/sandbox y listas de destinatarios permitidos. | — | Adoptar (AGR-035) | PRM-NFR-081 | — |
| RN-NFR-016 | Una restauración no deshace una emisión fiscal, un cobro externo ni un mensaje ya confirmados: los reconcilia desde la evidencia externa antes de reanudar (ESC-04). | — | Adoptar (AGR-019) | — | — |
| RN-NFR-017 | Los documentos económicos nunca se borran (ni por supresión de datos personales): se anulan, revierten o anonimizan en sus campos no obligatorios cuando vence la conservación. | Anulaciones en tablas espejo (DFA §32). | Mejorar | PRM-NFR-040 a 049 | PA-NFR-06 |
| RN-NFR-018 | Las fechas de negocio (períodos, vencimientos, cortes, fecha efectiva) se calculan en la zona horaria del tenant; los instantes se guardan en UTC; la hora del cliente se registra pero no se confía en ella. | `CargarProcoop` bloquea si el reloj del puesto difiere > 60 min del servidor SQL (RN-09 §5.2). | Reemplazar | PRM-NFR-100 | — |
| RN-NFR-019 | Ninguna exportación, API o reporte general incluye datos de salud, datos bancarios completos ni documentos adjuntos salvo permiso explícito y finalidad registrada. | Servicio BancoSangre sin autenticación (RN-13 §17). | Reemplazar (AGR-033) | — | — |
| RN-NFR-020 | Un cambio persistente no se confirma sin su evento de auditoría en la misma transacción (o mecanismo durable equivalente). | Auditoría selectiva por sentencia, sin valores previos (RN-09 §4.3). | Mejorar (BASE §54) | — | — |
| RN-NFR-021 | Los errores técnicos se registran en la observabilidad interna con redacción de datos personales; nunca se envían por correo a casillas externas ni personales. | `LogProcoop.txt` y envío de excepciones por mail a casilla de un desarrollador (variable −1, `Nucleo.cs:2044`). | Reemplazar | — | RN-09 §8 duda 6 |
| RN-NFR-022 | Las migraciones de esquema y de catálogos se ejecutan en el pipeline de despliegue, de forma idempotente, nunca al primer login de un usuario. | `RequiereChequearEstructura` ejecuta los chequeos el primer usuario que entra (RN-09 §5.7). | Reemplazar | — | — |
| RN-NFR-023 | Las actualizaciones de binarios son imágenes inmutables firmadas desde un registro; no se reemplazan archivos en uso ni se descargan ejecutables en tiempo de ejecución. | `clsVersion` descarga `Version.gzip` de S3 y renombra archivos `_old_` (RN-09 §5.7). | Reemplazar | — | — |
| RN-NFR-024 | Las tareas programadas corren en workers con cola (BullMQ), monitoreo y alertas; no en un ejecutable vigilado por otro proceso ni con `setInterval` dentro del API. | `Agente Procoop.exe` vigilado por modo 11 (RN-09 §5.8); schedulers `setInterval` (CNX §2.6). | Reemplazar (DEC-003) | — | — |
| RN-NFR-025 | Un tenant no puede degradar a otro: toda carga pesada (lotes, exportaciones, BI, importaciones, IA) pasa por colas con cuota por tenant y prioridad. | — | Adoptar (AGR-020) | PRM-NFR-020 a 029 | — |
| RN-NFR-026 | Ningún enlace público entrega un comprobante o documento personal sin control: solo URLs firmadas de corta duración o enlaces de un solo documento revocables. | `/uploads` público (CNX V-01); FTP de PDF al portal (RN-10 §14). | Reemplazar | PRM-NFR-030, 031 | PA-NFR-10 |
| RN-NFR-027 | Mostrar un texto visible siempre pasa por el diccionario; si falta la etiqueta personalizada se usa el texto base, nunca la clave técnica vacía. | — | Adoptar (BASE §65; escenario 53) | — | — |

## 7. Rendimiento, capacidad, escalabilidad y aislamiento de carga
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.1 Perfil de carga de referencia (Adoptado, DEC-075)

BASE §97.8 pide definir volumen y simultaneidad sin comprometer cifras; el relevamiento DEMO muestra **unos 12.500 comprobantes en una semana** de facturación masiva de una sola cooperativa. Para poder diseñar, dimensionar y probar desde O0 se adopta este perfil como **perfil de referencia de ingeniería**; se recalibra con las mediciones de la piloto (AGR-020). Estado: adoptado por DEC-075 (PA-NFR-03 respondida; antes "A validar PA-NFR-03").

**Supuestos de las columnas de plataforma** (alineados con T05 §7.8.2): mezcla de **96 % tenants estándar y 4 % grandes**; 100 tenants de diseño = 96 estándar + 4 grandes; 300 tenants de escala = 288 estándar + 12 grandes (DEC-075 fija el tamaño por tenant y la escala, no la mezcla; esta mezcla reproduce los 3 M y 9 M de suministros originales del perfil y es la que usa T05 §7.8.2; reemplaza a la mezcla 85 %/15 % aplicada el 05-11-2026, que daba 13,1 M). Las filas de **volumen** (suministros, personas, comprobantes, movimientos, lecturas, archivos y clientes de API) son la suma por tenant con esa mezcla. Las filas de **simultaneidad** (usuarios concurrentes, socios en el día pico, técnicos simultáneos, mensajes del día pico y throughput HTTP) son el pico simultáneo de la plataforma y no la suma de los picos de cada tenant, porque los ciclos y vencimientos de los tenants no coinciden: el pico de plataforma es 0,6 × la suma de los picos por tenant en todas las filas de simultaneidad (PA-NFR-22, Asumida DEC-072), y una prueba de carga antes de O4 lo confirma o lo recalibra; antes "el factor de simultaneidad implícito (entre 35 % y 85 % de la suma, según la fila) se recalibra con la piloto [VERIFICAR]". Historial: el perfil original usaba 3.000.000 y 9.000.000 suministros; una corrección del 05-11-2026 lo llevó a 4.375.000 y 13.125.000 con la mezcla 85 %/15 %; la reconciliación con T05 del mismo día vuelve a 3 M y 9 M con la mezcla 96 %/4 % y recalcula las demás filas de volumen con esa mezcla.

| Dimensión | Tenant estándar | Tenant grande | Plataforma (diseño) | Plataforma (escala sin rediseño) |
|---|---|---|---|---|
| Tenants activos | — | — | 100 | 300 |
| Suministros/servicios contratados activos | 25.000 | 150.000 | 3.000.000 | 9.000.000 (antes 13.125.000, mezcla 85/15 reemplazada) |
| Personas/titulares | 20.000 | 120.000 | 2.400.000 | 7.200.000 (antes 10.500.000; original 7.500.000) |
| Comprobantes por ciclo mensual | 30.000 | 180.000 | 3.600.000 | 10.800.000 (antes 15.750.000; original 10.000.000) |
| Movimientos de cuenta corriente por año | 1.000.000 | 6.000.000 | 120.000.000 | 360.000.000 (antes 525.000.000) |
| Usuarios administrativos concurrentes | 30 | 150 | 2.088 (0,6 × 3.480; antes 2.500) | 6.264 (0,6 × 10.440; antes 7.500) |
| Socios activos en el día pico de vencimiento | 5.000 | 30.000 | 360.000 (0,6 × 600.000; antes 400.000) | 1.080.000 (0,6 × 1.800.000; antes 1.200.000) |
| Técnicos/lecturistas con app de campo simultáneos | 10 | 60 | 720 (0,6 × 1.200; antes 1.500) | 2.160 (0,6 × 3.600; antes 4.500) |
| Lecturas por ciclo (servicios medidos) | 20.000 | 150.000 | 2.520.000 | 7.560.000 (antes 11.850.000; original 6.000.000) |
| Archivos nuevos por año (fotos, PDF, adjuntos) | 15 GB | 80 GB | 1,8 TB | 5,3 TB (antes 7,4 TB; original 6 TB) |
| Clientes de API de BI | 3 | 10 | 328 | 984 (antes 1.215; original 900) |
| Mensajes salientes (correo, push, SMS, WhatsApp) por día pico | 30.000 | 200.000 | 2.208.000 (0,6 × 3.680.000; antes 3.000.000) | 6.624.000 (0,6 × 11.040.000; antes 9.000.000) |
| Throughput HTTP | 5 req/s sostenidas, 30 pico | 25 sostenidas, 150 pico | 348 req/s sostenidas, 2.088 pico (0,6 × 580 y 0,6 × 3.480; antes 300 y 1.000) | 1.044 sostenidas, 6.264 pico (0,6 × 1.740 y 0,6 × 10.440; antes 900 y 3.000) |

### 7.2 Tiempos de respuesta interactivos

Medidos en servidor (p95/p99) con el perfil de referencia al 100 % de carga pico, sin contar la latencia de servicios externos (ARCA, pasarelas, mapas), que se mide aparte. Toda pantalla que no pueda cumplir su meta **debe** volverse asíncrona (job con progreso) en lugar de relajar la meta.

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-001 | Lectura simple por ID (ficha, detalle de comprobante, detalle de ticket). | p95 ≤ 200 ms; p99 ≤ 500 ms. | Escenario k6 `read-by-id` en staging con dataset de referencia; el pipeline de carga falla si se excede. | BASE §97.8; AGR-020 | Núcleo | O0 | Adoptado |
| RNF-NFR-002 | Listado paginado en `DataTable` (≤ 50 filas por página, filtros y orden sobre campos indexados). | p95 ≤ 400 ms; p99 ≤ 1 s; `size` máximo 100 (CNX §2.6). | k6 `list-paginated` sobre las 20 pantallas más usadas por ola; `size=500` devuelve 400. | CNX §2.6; AGR-020 | Núcleo | O0 | Adoptado |
| RNF-NFR-003 | Búsqueda global (persona/cuenta/suministro por DNI, CUIT, número de socio, nombre, domicilio, número de medidor o comprobante). | p95 ≤ 500 ms en tenant grande; primeros resultados ≤ 20. | k6 `search` con 1.000 términos aleatorios del dataset; `explain` sin `COLLSCAN`. | BASE §34 esc. 19, 76 | Núcleo | O2 | Adoptado |
| RNF-NFR-004 | Escritura transaccional simple (alta/edición de entidad con auditoría y outbox). | p95 ≤ 500 ms; p99 ≤ 1,2 s. | k6 `write-simple`; prueba de integración verifica evento de auditoría y outbox en la misma transacción. | BASE §54 | Núcleo | O0 | Adoptado |
| RNF-NFR-005 | Operación económica interactiva (cobro en caja, imputación, anulación de recibo, emisión de un comprobante manual sin CAE). | p95 ≤ 800 ms; recibo listo para imprimir ≤ 2 s extremo a extremo medido en cliente. | k6 `cash-payment` con 30 cajas concurrentes por tenant grande; Playwright mide tiempo hasta habilitar "Imprimir". | AGR-020 (ejemplo cobranza en caja) | Núcleo | O5 | Adoptado |
| RNF-NFR-006 | Pantallas compuestas (ficha 360 del socio/cuenta, cuenta corriente con saldos por servicio, expediente). | p95 ≤ 1 s; cada bloque secundario carga diferido sin bloquear el principal. | k6 `account-360` y Playwright con skeletons (CNX §3). | AGR-011 | Núcleo | O5 | Adoptado |
| RNF-NFR-007 | Tableros y reportes sincrónicos. | Tableros p95 ≤ 2 s (desde agregados precalculados o vistas materializadas); reportes sincrónicos ≤ 5 s o pasan a job; exportaciones > 10.000 filas siempre asíncronas. | k6 `dashboards`; prueba de integración: exportar 10.001 filas devuelve 202 con `jobId`. | BASE §54; AGR-020 | Núcleo | O1 | Adoptado |
| RNF-NFR-008 | PWA (socio, empleado, campo): rendimiento web en dispositivo de gama baja (2 GB RAM, CPU 4× más lenta) y red 4G lenta. | LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1; JS inicial ≤ 250 KB comprimido; cada ruta diferida ≤ 100 KB; TTFB API p95 ≤ 400 ms. | Lighthouse CI en modo móvil sobre landing, login, "Mis servicios", "Mis facturas", "Pagar", "Nuevo reclamo"; puntaje rendimiento ≥ 85; RUM p75 en producción cumple las metas. | BASE §97.8 (celulares de gama baja); CNX §3 | Núcleo | O0 | Adoptado |
| RNF-NFR-009 | Admin web: carga inicial y navegación. | Primera carga LCP ≤ 3 s (escritorio, banda ancha 10 Mbps); cambio de ruta ≤ 1 s hasta datos visibles; JS inicial ≤ 400 KB comprimido con división por módulo. | Lighthouse CI en modo escritorio sobre AdminShell, DataTable y ficha 360; puntaje ≥ 80. | CNX §4 | Estándar | O0 | Adoptado |

### 7.3 Procesos masivos y jobs

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-010 | Facturación masiva: cálculo tarifario, generación de comprobantes (sin autorización fiscal), asientos y cuenta corriente para un lote. | **50.000 suministros ≤ 60 min** (≥ 14 comprobantes/s) con el pool estándar de 4 workers; **150.000 ≤ 3 h** escalando workers; simulación (escenario 39) con la misma meta y sin efectos. | Prueba k6/worker-bench `fac:emitir-lote` con dataset de tenant grande; mide duración, throughput y que no haya duplicados (índice único) al matar un worker al 50 %. | BASE §97.8 (12.500/semana DEMO), §69; AGR-020 | Núcleo | O4 | A validar (PA-NFR-04) |
| RNF-NFR-011 | Autorización fiscal ARCA (CAE) de un lote. | Throughput interno ≥ 10 comprobantes/s con tamaño de lote según el máximo informado por ARCA en tiempo de ejecución; lote de 50.000 ≤ 2 h cuando ARCA responde normal; si la latencia de ARCA supera 5 s p95 durante 15 min se alerta y se aplica la contingencia definida en M06 (CAEA). | Prueba contra homologación con 5.000 comprobantes, extrapolada; prueba de caos que simula timeouts y verifica consulta del último autorizado antes de reintentar (sin huecos ni duplicados). | BASE §97.2; escenario 61 | Núcleo | O4 | A validar (PA-NFR-04) |
| RNF-NFR-012 | Generación de PDF y distribución (correo, push, WhatsApp) del lote. | PDF: 50.000 ≤ 60 min; distribución: 50.000 ≤ 4 h respetando límites del proveedor y horario de no molestar del tenant (CNX §2.7); PDF individual bajo demanda p95 ≤ 3 s. | Bench `fac:generar-pdf` y `com:distribuir-lote` con proveedor simulado; prueba de que un reintento no reenvía mensajes ya aceptados. | CNX §2.7; RN-10 §14 | Núcleo | O4 | Adoptado |
| RNF-NFR-013 | Ciclo de vida de los jobs (T11): arranque, progreso, cancelación y reanudación. | Inicio ≤ 30 s desde que se encola en condiciones normales; progreso persistido cada ≤ 5 s o cada 1 %; cancelación efectiva ≤ 30 s; reanudación automática tras caída de un worker ≤ 2 min desde el último checkpoint, sin duplicados. | Prueba de caos en CI de integración: `kill -9` al worker durante un lote; el lote termina con el mismo resultado que sin caída (comparación por hash de documentos). | BASE §34 esc. 6, 59; AGR-016 | Núcleo | O0 | Adoptado |
| RNF-NFR-014 | Latencia de publicación de eventos de outbox. | p95 ≤ 5 s y p99 ≤ 30 s desde el commit hasta la entrega al consumidor; alerta si el evento más antiguo pendiente supera 60 s. | Métrica `outbox_lag_seconds` en tablero; prueba de integración con 10.000 eventos. | DEC-003 | Núcleo | O0 | Adoptado |
| RNF-NFR-015 | Importaciones (`ExcelImportWizard`, archivos de entes, rendiciones, lecturas). | Vista previa con errores de 10.000 filas ≤ 60 s; confirmación de 50.000 registros ≤ 15 min; lecturas: 150.000 ≤ 20 min; validación de consumos 150.000 ≤ 30 min; archivo máximo 25 MB / 100.000 filas por paso. | Bench con archivos sintéticos; un archivo de 100.001 filas se rechaza con mensaje claro. | CNX §4.6; AGR-020 | Núcleo | O1 | Adoptado |
| RNF-NFR-016 | Otros procesos batch de referencia. | Evaluación de mora de 150.000 cuentas ≤ 30 min; generación de archivo de débito automático de 50.000 adhesiones ≤ 10 min; imputación de rendición de 50.000 pagos ≤ 15 min; asientos automáticos de 50.000 documentos ≤ 30 min; liquidación de sueldos de 500 empleados ≤ 5 min; exportación completa de historia de un tenant grande ≤ 2 h sin afectar las metas interactivas de otros tenants. | Bench por proceso en la ola correspondiente (O5, O6, O8, O9, O11). | AGR-020 (ejemplo exportación vs. cobranza) | Estándar | O5–O11 | A validar (PA-NFR-04) |
| RNF-NFR-017 | Sincronización offline de la app de campo. | Lote de 200 mutaciones ≤ 10 s p95 (sin fotos); fotos comprimidas ≤ 1600 px y ≤ 400 KB c/u, subida en segundo plano con reanudación; resultado por ítem (CNX §3.7). | Prueba Playwright con red simulada; 3 reintentos del mismo lote producen un solo efecto por `clientMutationId`. | CNX §3.7; AGR-025 | Núcleo | O3 | Adoptado |
| RNF-NFR-018 | Webhooks entrantes de pasarelas, entes e integraciones. | Acuse (2xx) p95 ≤ 2 s tras validar firma y persistir el evento; procesamiento asíncrono; dedupe por identificador del proveedor. | Prueba de contrato con 1.000 notificaciones duplicadas y desordenadas: un solo cobro confirmado por pago (escenario 7). | BASE §34 esc. 7, 8; RN-13 §17 | Núcleo | O5 | Adoptado |
| RNF-NFR-019 | API de BI y APIs externas (`/api/v1/ext`). | p95 ≤ 800 ms por página de ≤ 1.000 registros; extracción incremental por `updatedAt`/cursor; límite por defecto 60 req/min y 50.000 registros/día por cliente (parametrizable por plan, PRM-NFR-024); exportación masiva solo asíncrona con vencimiento. | k6 `bi-extract` en paralelo con `cash-payment`: las metas de RNF-NFR-005 se mantienen. | BASE §59; AGR-020 | Estándar | O11 | Adoptado |

### 7.4 Escalabilidad, capacidad y aislamiento de carga

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-020 | Cuotas por tenant para carga pesada: jobs concurrentes, requests/minuto, exportaciones simultáneas, IA, BI y almacenamiento, configurables por plan de licencia (T01). | Por defecto: 4 jobs batch concurrentes por tenant, 2 exportaciones simultáneas, 600 req/min por usuario y 6.000 req/min por tenant; superar la cuota devuelve 429 o encola. | Prueba de integración: el tenant A lanza 10 lotes; solo 4 corren; B mantiene sus tiempos de respuesta. | AGR-020; RN-NFR-025 | Núcleo | O0 | Adoptado |
| RNF-NFR-021 | Separación de cargas: procesos API (interactivo) y workers (batch) en despliegues distintos; colas con prioridad (`critical`: pagos/webhooks/aprovisionamiento; `interactive`: PDF a demanda, notificaciones; `batch`: lotes, importaciones; `bulk`: exportaciones, BI, reprocesos). | Una cola `bulk` saturada no aumenta más de 10 % el p95 de las rutas interactivas. | Prueba de carga mixta (AGR-020: exportación de A mientras B cobra en caja). | AGR-020; DEC-003 | Núcleo | O0 | Adoptado |
| RNF-NFR-022 | Lecturas pesadas (reportes, BI, exportaciones) en nodos secundarios del base compartida multitenant con `readPreference: secondaryPreferred` y `maxStalenessSeconds: 90`, mostrando la fecha de corte de los datos. | 100 % de rutas de reporte/BI/exportación declaradas con preferencia de lectura; el informe muestra "datos al dd-mm-yyyy hh:mm". | Revisión automatizada: lint de rutas `bia.*` sin `readPreference` falla. | BASE §59 (fecha de corte) | Estándar | O1 | Adoptado |
| RNF-NFR-023 | API y workers sin estado en memoria (sesión, caché de negocio, locks) para escalar horizontalmente; autoescalado por CPU, latencia y profundidad de cola. | Agregar una réplica del API no requiere configuración manual; escala de 2 a 6 réplicas en ≤ 5 min ante pico. | Prueba en staging: duplicar carga y verificar autoescalado y cumplimiento de RNF-NFR-002. | DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-024 | Capacidad por tenant verificada: el tenant grande del perfil (150.000 suministros, 6 M movimientos/año, 5 años de historia) cumple todas las metas interactivas. | Dataset de 5 años sintético cargado; metas de 7.2 cumplidas. | Prueba de carga trimestral y antes de cerrar O4, O5, O6, O7 y O11. | AGR-020 | Núcleo | O4 | Adoptado |
| RNF-NFR-025 | Índices: toda consulta frecuente usa índice compuesto que empieza por `TenantId` (DEC-002); consultas lentas > 100 ms se registran; ninguna consulta de producción hace `COLLSCAN` sobre colecciones > 10.000 documentos. | 0 `COLLSCAN` en el informe semanal; profiler de Mongo con umbral 100 ms. | Script de CI que recorre las consultas declaradas en repositorios y ejecuta `explain` sobre el dataset de prueba; alerta por slow query. | DEC-002; CNX §2.3 | Núcleo | O0 | Adoptado |
| RNF-NFR-026 | Límites de tamaño: body JSON ≤ 1 MB (lotes de sincronización ≤ 5 MB), arrays embebidos acotados (≤ 1.000 elementos; si no, colección aparte), documentos ≤ 2 MB, campos de texto con `max` en Zod. | Requests que excedan devuelven 413/400 con problem+json. | Pruebas de contrato de límites. | ASVS (validación) | Núcleo | O0 | Adoptado |
| RNF-NFR-027 | Timeouts y resiliencia: request HTTP ≤ 30 s (rutas de IA ≤ 120 s en asíncrono, no los 7 min del proxy de Connectia); llamadas salientes con timeout de conexión 5 s y total 15 s por defecto, reintentos con backoff exponencial y jitter, circuit breaker por conector y tenant. | Ninguna ruta interactiva espera a un tercero más de 15 s; circuit breaker abre tras 5 fallas en 60 s. | Pruebas de caos con conector simulado lento. | CNX §2.8 (timeouts 7 min); AGR-021 | Núcleo | O0 | Adoptado |
| RNF-NFR-028 | Caché de configuración publicada, diccionario, branding, catálogos y permisos efectivos, con invalidación por evento. | Un cambio publicado se refleja en ≤ 60 s en todos los nodos; sin datos personales en caché compartida. | Prueba de integración publicar → leer en otra réplica. | BASE §65; T04 | Estándar | O1 | Adoptado |
| RNF-NFR-029 | Degradación controlada ante sobrecarga: rechazo temprano (load shedding) de `bulk` y `batch` antes que de `critical`; mensajes claros al usuario. | Con 2× la carga pico: tasa de error 5xx < 1 %, rutas `critical` dentro de meta, resto con 429/503 y `Retry-After`. | Prueba de pico k6 `spike-2x`. | AGR-020 | Estándar | O1 | Adoptado |

## 8. Disponibilidad, continuidad, backups y recuperación (RPO/RTO)

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-030 | Objetivo de disponibilidad mensual de los servicios productivos (API, admin, PWA, landing, webhooks). | SLO comprometido **99,5 %** mensual (≈ 3 h 39 min de indisponibilidad/mes; DEC-063); excluye mantenimientos programados dentro de la ventana; objetivo interno no contractual de 99,9 % para webhooks de cobro y API de pago desde O5. | Disponibilidad calculada por sondas sintéticas (RNF-NFR-031) y SLI de requests exitosos; informe mensual por tenant. | BASE §97.8, §64.5; DEC-063 | Núcleo | O0 | Adoptado (DEC-063) |
| RNF-NFR-031 | Medición de disponibilidad con sondas sintéticas externas desde 2 ubicaciones cada 60 s (login, landing por tenant, consulta de factura, salud del API, recepción de webhook de prueba). | Un minuto se cuenta indisponible si fallan ambas ubicaciones. | Tablero de plataforma; histórico de 13 meses. | BASE §54 GOB-001 | Núcleo | O1 | Adoptado |
| RNF-NFR-032 | Ventana de mantenimiento programado. | Domingo 02:00–06:00 (hora del tenant por defecto, ART), ≤ 4 h/mes, aviso ≥ 72 h en admin y página de estado; mantenimientos de emergencia con aviso inmediato y post-mortem. | Registro de mantenimientos con aviso, duración real e impacto. | BASE §97.8, §64.5 | Núcleo | O1 | A validar (PA-NFR-12) |
| RNF-NFR-033 | Despliegues sin corte: los cambios regulares se despliegan sin indisponibilidad (rolling o blue-green) y con compatibilidad hacia atrás de esquema (RNF-NFR-168). | 0 minutos de indisponibilidad atribuibles a despliegues regulares; ≤ 1 % de requests fallidos durante un despliegue. | Sonda sintética durante cada despliegue en staging y producción. | DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-034 | Congelamiento por calendario: cada tenant declara sus días críticos (facturación masiva, primeros vencimientos, cierre de caja de fin de mes); en esos días solo se despliegan correcciones urgentes aprobadas. | Calendario de congelamiento visible; el pipeline bloquea despliegues no urgentes si algún tenant en ventana crítica supera el 20 % de los tenants. | Prueba del gate del pipeline. | AGR-020; BASE §69 | Estándar | O1 | A validar (PA-NFR-12) |
| RNF-NFR-035 | RPO de plataforma (pérdida máxima de datos ante falla de infraestructura dentro de la región). | Compromiso **≤ 15 min** (DEC-063) para base y almacenamiento de objetos; objetivo interno ≤ 5 min para MongoDB (PITR continuo por oplog); 0 pérdida de transacciones confirmadas con `writeConcern: majority` ante caída de un nodo. | Simulacro mensual: restaurar a T−5 min en ambiente aislado y comparar conteos/hashes. | AGR-019; DEC-063 | Núcleo | O0 | Adoptado (DEC-063) |
| RNF-NFR-036 | RTO de plataforma (restablecer el servicio completo). | Caída de un nodo de base: ≤ 1 min (elección automática); caída de una zona: ≤ 15 min; corrupción lógica con restauración completa de la plataforma: compromiso **≤ 8 h** (DEC-063), objetivo interno ≤ 4 h. | Simulacros semestrales de caída de zona y anual de restauración completa con cronómetro y acta. | AGR-019; DEC-063 | Núcleo | O1 | Adoptado (DEC-063) |
| RNF-NFR-037 | Restauración selectiva de un tenant (error humano, borrado masivo, carga defectuosa) sin retroceder a los demás. | Datos del tenant a un punto en el tiempo disponibles en ambiente aislado en **≤ 4 h** (RTO por tenant, DEC-063); reconciliación y reincorporación de lo necesario con plan aprobado por el tenant; los demás tenants no se afectan. | Simulacro trimestral con tenant piloto y TEN-001/TEN-002 ficticios (escenario 15; AGR-019). | AGR-019; BASE §34 esc. 15; DEC-063 | Núcleo | O1 | Adoptado (DEC-063) |
| RNF-NFR-038 | Backups de MongoDB: PITR continuo + snapshot diario, semanal y mensual. | Retención: PITR 7 días; diarios 35 días; semanales 12 semanas; mensuales 13 meses. Sin copias anuales de 10 años: la conservación legal de 10 años de facturas, recibos, asientos y movimientos la dan los propios datos, que quedan en línea los 10 años (DEC-087, T05 §7.8.2), y el detalle de más de 36 meses se conserva en el archivo en frío de `retentionRuns` (cifrado, por tenant y período); los backups sirven para recuperar, no para conservar. Antes: "anuales 10 años (solo si PA-NFR-06 lo confirma para documentos económicos)". | Inventario automático de backups en tablero; alerta si falta un backup o falla la verificación. | BASE §29 (copias y pruebas); RN-09 §5.6 (aviso de backups vencidos 2786/2051); DEC-087 | Núcleo | O0 | Adoptado (DEC-087; PA-NFR-06 asumida por DEC-072; PA-NFR-23 asumida por DEC-072) |
| RNF-NFR-039 | Backups de almacenamiento de objetos: versionado de objetos, replicación a otra región y bloqueo de objetos (WORM) ≥ 35 días para comprobantes y documentos firmados. | Un borrado accidental de un comprobante se recupera ≤ 1 h desde la versión anterior. | Prueba trimestral de recuperación de 100 objetos al azar. | AGR-019 (adjuntos) | Núcleo | O0 | Adoptado |
| RNF-NFR-040 | Protección de backups: cifrados con claves KMS distintas de las de producción, en una cuenta/proyecto separado con acceso de solo escritura desde producción, inmutables durante la retención mínima; acceso de lectura solo por rol de restauración con doble aprobación. | 0 identidades de producción con permiso de borrar backups. | Revisión trimestral de permisos (IaC + escaneo); prueba de que el rol del API no puede listar ni borrar backups. | BASE §60 (protección de copias) | Núcleo | O0 | Adoptado |
| RNF-NFR-041 | Redis no es fuente de verdad: todo estado de jobs, progreso y resultado se persiste en Mongo; una pérdida total de Redis se recupera reencolando desde Mongo. | Recuperación de colas ≤ 15 min tras pérdida de Redis sin duplicar efectos. | Prueba de caos: vaciar Redis durante un lote y verificar reanudación (RNF-NFR-013). | DEC-003 | Núcleo | O0 | Adoptado |
| RNF-NFR-042 | Continuidad de claves: las claves de KMS y la configuración de la bóveda tienen respaldo y recuperación documentados; una restauración de datos cifrados es imposible sin las claves vigentes a esa fecha, por lo que la rotación conserva versiones anteriores durante la retención de backups. | 100 % de backups restaurables con sus claves en simulacro. | Simulacro anual de restauración de un backup de 12 meses. | ASVS (criptografía) | Núcleo | O1 | Adoptado |
| RNF-NFR-043 | Pruebas de restauración periódicas: no basta con que exista el backup (AGR-019). | Mensual (plataforma, automática con verificación de conteos e integridad de hashes de auditoría); trimestral por tenant piloto con conciliación; anual completa con cronómetro. | Registro en `restoreTests` con RPO/RTO medidos y acta. | AGR-019 | Núcleo | O1 | Adoptado |
| RNF-NFR-044 | Restauración con operaciones externas posteriores a la copia (ESC-04): tras restaurar, el sistema consulta y concilia ARCA (último comprobante autorizado por punto de venta y tipo), pasarelas y entes (pagos y rendiciones posteriores), proveedores de mensajería y aprovisionamiento antes de reanudar jobs; ninguna emisión ni cobro se repite. | 0 emisiones o cobros duplicados en simulacro. | Simulacro con emisión y pago confirmados después del punto de restauración. | AGR-019; ESC-04; RN-NFR-016 | Núcleo | O4 | Adoptado |
| RNF-NFR-045 | Supresiones y anonimizaciones posteriores al punto de restauración se reaplican automáticamente (lista de supresión durable fuera de la base restaurada). | 100 % de supresiones reaplicadas antes de habilitar el acceso. | Simulacro con titular suprimido después del backup. | Ley 25.326 art. 16; AGR-033 | Núcleo | O1 | Adoptado |
| RNF-NFR-046 | Recuperación ante desastre regional (pérdida de la región principal). | RPO ≤ 1 h; RTO ≤ 24 h en región secundaria, con backups y artefactos replicados e infraestructura como código. | Simulacro anual de despliegue completo en región secundaria. | AGR-019 | Estándar | O11 | Adoptado (DEC-063) |
| RNF-NFR-047 | Operación degradada ante indisponibilidad de terceros: si ARCA, una pasarela, el proveedor de mensajería o el de mapas no responden, el sistema encola, marca "Resultado incierto/Pendiente" (AGR-016) y sigue atendiendo el resto; la caja puede cobrar con medios propios y la factura queda pendiente de autorización sin marcarse emitida (BASE §97.2). | Ninguna pantalla queda bloqueada por un tercero caído; el tablero del tenant muestra el conector degradado en ≤ 2 min. | Pruebas de caos por conector. | BASE §97.2; AGR-016, AGR-021 | Núcleo | O4 | Adoptado |
| RNF-NFR-048 | Alta disponibilidad de datos: MongoDB replica set de 3 nodos en 3 zonas, `writeConcern: majority`, `readConcern: majority` (o `snapshot` en transacciones); Redis con réplica y failover; almacenamiento de objetos regional. | Caída de un nodo o zona sin pérdida de escrituras confirmadas. | Simulacro de caída de primario. | DEC-001; DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-049 | Runbooks versionados para restauración completa, selectiva, DR regional, rotación de emergencia de claves, caída de conector y fuga de credenciales; cada runbook se prueba al menos una vez por año. | 100 % de runbooks con fecha de última prueba ≤ 12 meses. | Revisión en el tablero de evidencias. | BASE §64.5 | Núcleo | O1 | Adoptado |

## 9. Seguridad de aplicación e infraestructura (OWASP ASVS 5.0 nivel 2)

BASE §60 toma como referencia OWASP ASVS 5.0.0 [SEG1], NIST SP 800-63B-4 [SEG2], RFC 9700 [SEG3] y Google OpenID Connect [SEG4], y aclara que **no constituye una certificación** sino un marco de verificación con revisión periódica. Este anexo adopta **ASVS 5.0 nivel 2** como mínimo para todo el sistema y **nivel 3** para los controles marcados (bóveda, firma de tokens, auditoría, datos de salud). La numeración exacta de capítulos de ASVS se cita por nombre y se verifica contra la versión vigente al iniciar cada ola [VERIFICAR].

### 9.1 Marco y gobierno

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-050 | Lista de verificación ASVS 5.0 nivel 2 mantenida en el repositorio (`docs/security/asvs-l2.md`), con estado por requisito (cumple / no aplica con motivo / pendiente con ticket), revisada en cada ola. | 100 % de requisitos L2 con estado; 0 "pendiente" sin ticket y fecha; ningún "no cumple" en capítulos de autenticación, sesión, autorización, validación, criptografía, archivos y API al cerrar O1. | Revisión por el oficial de seguridad como gate de cierre de ola (RF-NFR-022). | BASE §60 SEG-001 [SEG1] | Núcleo | O0 | Adoptado |
| RNF-NFR-051 | Modelado de amenazas (STRIDE o equivalente) por módulo antes de construirlo y por integración nueva, con riesgos, controles y riesgos residuales aceptados por responsable. | 1 modelo por anexo M01–M19 y por ficha de integración (T06) antes de la ola. | Documento versionado enlazado desde el anexo; sin él el prompt de la ola no se ejecuta. | BASE §60 | Núcleo | O0 | Adoptado |

### 9.2 Cifrado en tránsito

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-052 | TLS en todo tráfico externo: TLS 1.3 preferido, 1.2 mínimo con suites AEAD (sin CBC, RC4, 3DES), certificados automáticos con renovación ≥ 30 días antes del vencimiento, HSTS `max-age=31536000; includeSubDomains` (y `preload` en el dominio de producto), redirección 80→443, dominios personalizados de tenant con certificado propio gestionado. | Calificación A o superior en un escáner TLS público; 0 endpoints HTTP sin redirección. | Escaneo TLS semanal automatizado en staging y producción. | BASE §60 (protección del transporte) | Núcleo | O0 | Adoptado |
| RNF-NFR-053 | Cifrado en tránsito interno: conexiones a MongoDB, Redis, almacenamiento de objetos, KMS y proveedores con TLS y verificación de certificado; red privada sin IP pública para bases y colas; la API llama a terceros solo con TLS 1.2+ verificando la cadena (sin `rejectUnauthorized: false`). | 0 conexiones internas en texto plano. | Revisión IaC y prueba que falla si la URI de Mongo/Redis no tiene TLS en `production`. | ProCoop "fuerza TLS 1.2" (RN-09 §5.2) | Núcleo | O0 | Adoptado |

### 9.3 Cifrado en reposo y de campos sensibles

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-054 | Cifrado de volúmenes, bases gestionadas, snapshots y backups con claves de KMS (AES-256), claves de backup distintas de producción (RNF-NFR-040). | 100 % de volúmenes y buckets con cifrado por defecto. | Política IaC que rechaza recursos sin cifrado; escaneo de configuración de nube semanal. | BASE §60 | Núcleo | O0 | Adoptado |
| RNF-NFR-055 | Cifrado a nivel de campo (aplicación) para datos sensibles: datos de salud y diagnósticos (M18), condición de electrodependencia (M01/M04), CBU/CVU y número de cuenta bancaria completos (COB/TES/SUE), datos de tarjeta tokenizados (solo token y últimos 4), CUIL y datos de familiares a cargo del legajo (M16), números de documento escaneados y sus imágenes, notas marcadas "confidencial" en tickets, secretos de integración (bóveda T06), semillas TOTP y códigos de recuperación (T02). DNI y CUIT de titulares **no** se cifran a nivel de campo (son claves de búsqueda y fiscales) pero se protegen con cifrado en reposo, permisos y enmascarado en UI/logs. | 100 % de campos clasificados `sensible` o `secreta` en el inventario (RF-NFR-001) cifrados; lectura de la base cruda no revela su valor. | Prueba de integración que lee el documento crudo con el driver y verifica `BinData` cifrado; script de CI que cruza `x-pii` con el esquema. | BASE §97.1 (tratamiento reforzado); CNX §10 (datos fiscales y de socios) | Núcleo | O0 | Adoptado |
| RNF-NFR-056 | (Bóveda y cifrado de campos con cifrado por sobre en MongoDB y clave maestra en AWS KMS detrás de una interfaz agnóstica, DEC-074.) Cifrado de sobre por tenant: AES-256-GCM con DEK propia de cada tenant (y por categoría `salud`/`laboral`/`judicial`/`financiero`/`secreto`, con los nombres `dek-<categoría>` de T05; DEC-092; antes solo `salud`/`financiero`/`secreto`), DEK envuelta por una KEK en KMS; `packages/shared/crypto` es la única implementación permitida; nonce aleatorio de 96 bits por cifrado; dato autenticado adicional = `tenantId` + colección + campo + `_id` (impide copiar un cifrado a otro tenant o registro). | Un valor cifrado de TEN-001 copiado a un documento de TEN-002 falla al descifrar. | Prueba unitaria y de integración de aislamiento criptográfico. | DEC-002 (compensa la base compartida, CTR-NFR-02) | Núcleo | O0 | Adoptado |
| RNF-NFR-057 | Búsqueda exacta sobre campos cifrados mediante índice ciego (HMAC-SHA-256 con clave por tenant, truncado ≥ 16 bytes), sin búsqueda parcial sobre campos cifrados. | Búsqueda por CBU exacto p95 ≤ 300 ms. | Prueba de integración; revisión de que no existen índices sobre el texto plano. | ASVS (protección de datos) | Estándar | O5 | Adoptado |
| RNF-NFR-058 | Almacenamiento de objetos privado con cifrado del lado del servidor con KMS, claves de objeto `tenantId/<modulo>/<yyyy>/<mm>/<uuid>` sin datos personales en el nombre, bucket sin acceso público (bloqueo de acceso público a nivel cuenta) y documentos de salud en bucket o prefijo con clave KMS separada. | 0 objetos con ACL pública; 0 nombres con DNI/nombre. | Escaneo de configuración y de nombres de objetos semanal. | CNX §2.6, §10 V-01 | Núcleo | O0 | Adoptado |
| RNF-NFR-059 | Criptografía estándar: prohibido implementar algoritmos propios u ofuscaciones reversibles; aleatoriedad con `crypto.randomBytes`/`randomUUID`; algoritmos permitidos: AES-256-GCM, ChaCha20-Poly1305, SHA-256/384/512, HMAC-SHA-256, Ed25519/ECDSA P-256, RSA ≥ 3072 solo por requisito externo (ARCA); prohibidos MD5, SHA-1 (salvo compatibilidad externa documentada), DES/3DES, ECB, RC4. | 0 usos de algoritmos prohibidos. | Regla SAST (Semgrep) que bloquea el build. | RN-09 §4.1, §5.3 (`Encriptar` reversible) | Núcleo | O0 | Adoptado |

### 9.4 Autenticación y sesión (controles que T02 implementa)

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-060 | Contraseñas con Argon2id (memoria ≥ 19 MiB, iteraciones ≥ 2, paralelismo 1, o parámetros superiores calibrados a ≤ 500 ms) o bcrypt costo ≥ 12 como mínimo heredado de CNX; nunca reversibles. | Tiempo de verificación 100–500 ms en el hardware productivo. | Prueba unitaria de parámetros; SAST bloquea hash débil. | CNX §2.5; RN-09 §7.6; [SEG5] | Núcleo | O0 | Adoptado |
| RNF-NFR-061 | Política de contraseñas NIST: longitud mínima 12 para personal y 10 para socios, máximo admitido 128 (RF-IAM-040, dueño de la política, no admite la excepción de 8 con MFA; DEC-092; antes "longitud mínima 12 (8 si hay MFA obligatorio), máximo ≥ 64"), sin reglas arbitrarias de composición ni rotación periódica, bloqueo de contraseñas comprometidas (consulta por k-anonimidad o lista local) y de contraseñas del contexto (nombre del tenant, usuario). | 100 % de altas y cambios validados contra la lista. | Prueba unitaria con contraseñas filtradas conocidas de prueba. | BASE §60 [SEG2, SEG5] | Núcleo | O1 | Adoptado |
| RNF-NFR-062 | Tokens: access token ≤ 15 min; refresh token rotativo de un solo uso, guardado hasheado, vida ≤ 30 días (CNX §2.5) y ≤ 12 h para administradores de plataforma; reutilización de un refresh ya usado revoca toda la familia; `sessionEpoch` para cerrar todas las sesiones; revocación efectiva ≤ 60 s. | Revocar una asignación de rol corta el acceso a las operaciones afectadas en ≤ 60 s (escenario 20). | Prueba e2e de revocación y de reutilización de refresh. | CNX §2.5; BASE §34 esc. 20, 46 | Núcleo | O1 | Adoptado |
| RNF-NFR-063 | Firma de tokens con algoritmo asimétrico (EdDSA o ES256) y `kid`, rotación cada 90 días con superposición de verificación, rechazo de `alg: none` y de algoritmos no permitidos, validación de `iss`, `aud`, `exp`, `nbf`, `tenantId`. Secretos HS256 de ejemplo prohibidos (CNX V-02). | 0 tokens aceptados con algoritmo o `kid` inválido. | Pruebas de contrato con tokens manipulados. | CNX §2.5, §10 V-02; ASVS (tokens autocontenidos) | Núcleo | O1 | Adoptado |
| RNF-NFR-064 | Cookies de sesión/refresh: `HttpOnly`, `Secure`, `SameSite=Strict` (o `Lax` justificado para retorno de OIDC), prefijo `__Host-`, `Path=/`; el access token vive solo en memoria del front; nada sensible en `localStorage`/`sessionStorage`. | 0 tokens en almacenamiento web (inspección automatizada en Playwright). | Prueba e2e que inspecciona `localStorage`, `sessionStorage` e IndexedDB tras login. | ASVS (sesión) | Núcleo | O1 | Adoptado |
| RNF-NFR-065 | Protección CSRF para toda ruta que use cookies: verificación de `Origin`/`Sec-Fetch-Site` + token sincronizado o doble envío; rutas `/api/v1/ext` solo con token portador sin cookies. | 100 % de rutas con cookie protegidas. | Prueba automatizada que envía requests de origen cruzado. | ASVS (frontend) | Núcleo | O1 | Adoptado |
| RNF-NFR-066 | Antifuerza bruta en autenticación: bloqueo progresivo 5 intentos / 15 min por usuario (CNX §2.5) más límites por IP y por tenant (RNF-NFR-075), sin bloquear permanentemente al usuario legítimo (retardo exponencial y desbloqueo por MFA o correo); OTP con ≤ 5 intentos por código y vigencia ≤ 10 min; MFA obligatorio para administradores de plataforma y de tenant (BASE §60). | 0 cuentas comprometidas en prueba de credential stuffing simulada de 10.000 intentos. | Prueba k6 de stuffing contra staging. | CNX §2.5; BASE §60 SEG-002, SEG-005 | Núcleo | O1 | Adoptado |

### 9.5 Secretos, bóveda y rotación

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-067 | Secretos de plataforma (cadenas de conexión, claves de firma, credenciales de proveedores de plataforma) en un gestor de secretos con identidad de servicio por componente (API, worker, migraciones), separados por ambiente; `.env` solo en desarrollo local con valores ficticios. | 0 secretos en repositorio, imágenes, variables de CI en texto plano o servidores mantenidos a mano. | Secret scanning en CI y en historial; inspección de capas de imagen. | CNX §2.8 (`.env` a mano), §10 | Núcleo | O0 | Adoptado |
| RNF-NFR-068 | Bóveda por tenant (T06) para certificados y claves ARCA, credenciales de pasarelas, entes, bancos, Interbanking, correo, SMS, WhatsApp, telemedición y aprovisionamiento: cifrado de sobre (RNF-NFR-056, categoría `secreto`), API de solo escritura (el valor nunca se devuelve; solo huella y últimos 4), "probar conexión", auditoría de alta, cambio, uso y prueba; acceso del worker solo al secreto del tenant y conector del job. | 0 endpoints que devuelvan un secreto; 100 % de usos registrados (sin el valor). | Prueba de contrato: `GET` de un secreto devuelve solo metadatos; prueba de que el worker de TEN-001 no puede leer secretos de TEN-002. | CNX §4.6, §10; RN-10 §13; RN-13 §17 | Núcleo | O1 | Adoptado |
| RNF-NFR-069 | Rotación: claves de firma de tokens cada 90 días; DEK por tenant anual y ante incidente (re-envoltura sin indisponibilidad; re-cifrado de datos en job de fondo); KEK en KMS anual automática; secretos de integración según política del proveedor con recordatorio 30 días antes; rotación de emergencia de cualquier secreto ≤ 4 h desde la decisión. | 100 % de claves con fecha de rotación vigente en la consola (RF-NFR-023). | Simulacro anual de rotación de emergencia. | CNX §10 V-02; BASE §59 (rotación y revocación) | Núcleo | O1 | Adoptado |
| RNF-NFR-070 | Arranque seguro: en `production` el proceso no arranca si falta un secreto, si un secreto tiene longitud/entropía insuficiente o coincide con un valor de ejemplo conocido, si falta la lista blanca de CORS o si el seed de demostración está habilitado. | El contenedor sale con código ≠ 0 y log explícito. | Prueba de integración del módulo de configuración con cada caso. | CNX §10 V-02, V-04, V-13 | Núcleo | O0 | Adoptado |
| RNF-NFR-071 | Vencimiento de certificados y credenciales: alerta a 30, 15 y 7 días para certificados ARCA, TLS de dominios personalizados, tokens de proveedores y credenciales con vencimiento. | 0 vencimientos sin alerta previa. | Prueba con certificado ficticio que vence en 29 días. | RN-09 §5.6 (variable 2925, vencimiento del certificado AFIP) | Núcleo | O4 | Adoptado |

### 9.6 Headers, CSP y CORS

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-072 | Headers de seguridad en todas las respuestas (API y estáticos): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima (`camera=(self)`, `geolocation=(self)` solo en PWA de campo/socio; `microphone=()`, `payment=()`, `usb=()`), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-site`, `X-Frame-Options: DENY` (además de `frame-ancestors`), `Cache-Control: no-store` en respuestas de API con datos personales, sin `X-Powered-By` ni versión de servidor. | Calificación A en escáner de headers; prueba automatizada por ruta. | Test de integración que valida headers en una muestra de rutas de cada app. | ASVS (configuración, frontend) | Núcleo | O0 | Adoptado |
| RNF-NFR-073 | Content Security Policy estricta en admin, PWA y landing: `default-src 'self'`; `script-src 'self'` con nonce o hashes, sin `'unsafe-inline'` ni `'unsafe-eval'`; `style-src 'self'` (estilos dinámicos de branding solo vía variables CSS aplicadas por CSSOM); `img-src 'self' data: blob:` + dominio de almacenamiento firmado + teselas de mapas; `connect-src 'self'` + endpoint de telemetría; `font-src 'self'` (fuentes autoalojadas, no CDN); `object-src 'none'`; `base-uri 'none'`; `form-action 'self'` + pasarelas permitidas; `frame-ancestors 'none'`; `frame-src` solo para checkout alojado de pasarelas declaradas; `upgrade-insecure-requests`; `report-to` hacia RF-NFR-020. Despliegue inicial en `Report-Only` ≤ 2 semanas por app, luego obligatoria. | 0 violaciones CSP en recorridos e2e; 0 directivas inseguras. | Playwright registra violaciones (falla el test); verificación con evaluador de CSP. | ASVS (frontend); CNX §2.1 (sin librerías externas de UI) | Núcleo | O0 | Adoptado |
| RNF-NFR-074 | CORS con lista blanca explícita por ambiente (dominios de admin, PWA, landing y dominios personalizados registrados de cada tenant), `Access-Control-Allow-Credentials` solo para esos orígenes, nunca `*` con credenciales ni reflejo del `Origin`; `/api/v1/ext` sin CORS (servidor a servidor) salvo cliente registrado; el proceso no arranca sin la lista (CNX V-04). | 0 orígenes no registrados aceptados. | Prueba de contrato con `Origin` malicioso. | CNX §10 V-04 | Núcleo | O0 | Adoptado |

### 9.7 Rate limiting y antiautomatización

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-075 | Rate limiting con ventana deslizante en Redis, por IP, usuario, tenant y token, con valores por defecto: login 10/min por IP y 5/15 min por usuario; pre-login 30/min por IP; recuperación de contraseña 3/h por cuenta y 10/h por IP; verificación de OTP 5 por código; registro de socio 5/h por IP; endpoints públicos sin login (consulta pública, pago sin login, baja pública — BASE §53) 20/min por IP; uploads 30/h por usuario; IA 20/min por usuario y cuota diaria por tenant; API autenticada 600/min por usuario; BI 60/min por cliente; exportaciones 10/h por usuario. Respuesta 429 problem+json con `Retry-After`. | 100 % de rutas con política declarada (por defecto la general). | Prueba de integración por categoría; lint que falla si una ruta pública no declara política. | CNX §2.5 (MEJORAR rate limit por IP), §10 V-07 | Núcleo | O0 | Adoptado |
| RNF-NFR-076 | Antiautomatización en formularios públicos (registro, recuperación, consulta pública de deuda, baja pública, contacto, pago sin login): desafío CAPTCHA respetuoso de la privacidad activado de forma progresiva (tras 3 intentos o señales de riesgo), detección de velocidad anómala y de enumeración, campos trampa; nunca CAPTCHA en la app de campo autenticada. | Bloqueo de ≥ 95 % de un ataque automatizado simulado sin afectar al usuario normal (≤ 1 % de desafíos en tráfico legítimo). | Prueba automatizada con bot simulado en staging. | BASE §60 ("limitar intentos y automatización abusiva") | Núcleo | O2 | A validar (PA-NFR-11) |
| RNF-NFR-077 | Anti-enumeración: respuestas genéricas idénticas y de tiempo similar (±100 ms) en login, recuperación, registro y consulta pública; pre-login no revela usuarios (CNX §2.3); la consulta pública de deuda exige dos factores de identificación (por ejemplo, número de cuenta y DNI) y muestra datos mínimos. | Diferencia de tiempo de respuesta entre cuenta existente e inexistente < 100 ms p95. | Prueba estadística automatizada de 1.000 requests. | CNX §2.3, §2.5 | Núcleo | O1 | Adoptado |

### 9.8 Carga segura de archivos y URLs firmadas

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-078 | Validación de archivos subidos: lista blanca por categoría con verificación por firma de contenido (magic bytes), no por extensión ni `Content-Type` del cliente; imágenes JPEG/PNG/WebP/HEIC ≤ 10 MB; PDF ≤ 20 MB; planillas XLSX/CSV ≤ 25 MB (sin macros: `xlsm`, `xls` con VBA rechazados); certificados `.crt/.pem/.p12` solo en bóveda; prohibidos ejecutables, scripts, HTML, SVG (salvo logos sanitizados y rasterizados), archivos comprimidos anidados. Nombre original solo como metadato sanitizado. | 100 % de tipos fuera de lista rechazados con 415 problem+json. | Prueba con corpus de archivos maliciosos (polyglots, doble extensión, EICAR). | BASE §60 (control de archivos adjuntos); CNX §2.1 (`multer` a disco) | Núcleo | O0 | Adoptado |
| RNF-NFR-079 | Antivirus y cuarentena: todo archivo se sube a un prefijo de cuarentena (URL firmada de subida), un worker lo analiza con motor antivirus actualizado (firmas ≤ 24 h) y lo mueve al prefijo definitivo solo si está limpio; infectados se retienen 30 días aislados, se alerta y se registra; mientras tanto el archivo figura "En análisis" y no se puede descargar. | Análisis p95 ≤ 60 s para archivos ≤ 20 MB; EICAR detectado en 100 % de pruebas. | Prueba de integración con EICAR en CI (motor en contenedor). | BASE §60; CNX §2.6 (MEJORAR archivos) | Núcleo | O0 | Adoptado |
| RNF-NFR-080 | Procesamiento seguro: reencodificación de imágenes (elimina carga útil oculta), eliminación de metadatos EXIF de ubicación en imágenes de muro, comunidad y reclamos públicos (se conservan en evidencias de campo, donde la ubicación es dato requerido y protegido); límites contra bombas de descompresión (ratio ≤ 100:1, tamaño descomprimido ≤ 200 MB, ≤ 100.000 filas en planillas); parseo en worker aislado con timeout 60 s y memoria acotada; PDF entrantes no se renderizan en el servidor sin sandbox. | 0 caídas del worker con el corpus de bombas. | Prueba con corpus de archivos de estrés. | ASVS (archivos); BASE §97.1 (datos personales en fotos, AGR-031) | Núcleo | O0 | Adoptado |
| RNF-NFR-081 | URLs firmadas: emitidas solo tras verificar tenant, permiso y alcance sobre el objeto; de un solo objeto; descarga con vigencia ≤ 5 min (PRM-NFR-030) y `Content-Disposition: attachment`; subida con vigencia ≤ 10 min, tamaño y tipo fijados en la firma; nunca reutilizables entre tenants; no se registran completas en logs. Enlaces a comprobantes enviados por correo/WhatsApp apuntan a un endpoint propio que valida un token de un solo documento, revocable y con vencimiento (PRM-NFR-031), y luego emite la URL firmada. | Una URL vencida devuelve 403; una URL de TEN-001 no abre un objeto de TEN-002. | Prueba de integración y e2e. | CNX §2.6, §10 V-01; BASE §59 ("exportaciones con estado y vencimiento") | Núcleo | O0 | A validar (PA-NFR-10) |

### 9.9 Validación de entrada y prevención de inyecciones

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-082 | Validación con Zod en servidor de `params`, `query`, `headers` relevantes y `body` de **toda** ruta, con esquemas compartidos en `packages/shared/schemas` y reutilizados en el front; esquemas `.strict()` (rechazan claves desconocidas, evitando asignación masiva); longitudes máximas, enums, `ObjectId` validado, importes como cadena decimal validada, fechas ISO; coerciones explícitas. | 100 % de rutas con esquema (ruta sin esquema falla el build); 0 errores 500 por entrada inválida en fuzzing. | Test que recorre el registro de rutas; fuzzing derivado de OpenAPI en CI nocturno. | DEC-001; CNX §2.6, §4.6 (MEJORAR validación) | Núcleo | O0 | Adoptado |
| RNF-NFR-083 | Validación y filtrado de salida: las respuestas se construyen con esquemas de salida (DTO) que solo incluyen campos permitidos al rol (sin `passwordHash`, secretos, campos internos, datos de otro tenant); enmascarado de DNI/CUIT/CBU/teléfono según permiso. | 0 campos no declarados en respuestas (test de contrato). | Prueba de contrato de respuesta por ruta y rol. | BASE §59 (restringir por campo); ASVS (API) | Núcleo | O0 | Adoptado |
| RNF-NFR-084 | Inyección NoSQL: Mongoose con `sanitizeFilter: true` y `strictQuery: true`; rechazo de claves que empiezan con `$` o contienen `.` en entrada de usuario; filtros y ordenamientos construidos desde listas blancas de campos; prohibido pasar `req.body`/`req.query` directo a consultas; prohibidos `$where`, `$function`, `$accumulator` y `mapReduce`; JavaScript del lado del servidor deshabilitado en MongoDB. | 0 hallazgos en pruebas de inyección automatizadas (payloads `{"$ne": null}`, `{"$gt": ""}`, `$where`). | Suite de seguridad en CI sobre todas las rutas de búsqueda y login; regla SAST. | ASVS (inyección); RN-13 §17 (SQL concatenado en ProCoop) | Núcleo | O0 | Adoptado |
| RNF-NFR-085 | Expresiones regulares seguras: búsquedas de texto con escape de metacaracteres, longitud ≤ 100 caracteres, prefijo anclado o índice de texto; regex propias revisadas contra ReDoS (análisis estático) con timeout. | 0 regex vulnerables en el análisis. | Regla SAST de ReDoS en CI. | ASVS (validación) | Estándar | O0 | Adoptado |
| RNF-NFR-086 | XSS: Vue escapa por defecto; `v-html` prohibido salvo componente `SafeHtml` con DOMPurify y lista blanca (muro, novedades, plantillas); los textos del diccionario y de branding se tratan como texto, no HTML; plantillas de correo con escape automático; exportaciones CSV/XLSX con neutralización de fórmulas (prefijo `'` ante `=`, `+`, `-`, `@`). | 0 usos de `v-html` fuera de `SafeHtml` (lint); 0 hallazgos XSS en DAST. | Lint ESLint de Vue; DAST; prueba de inyección de fórmulas en exportación. | ASVS (codificación y sanitización) | Núcleo | O0 | Adoptado |
| RNF-NFR-087 | SSRF y egreso: no existen proxies genéricos de medios ni de URLs (CNX V-05); toda llamada saliente usa `packages/shared/http` con lista blanca de hosts por conector y ambiente, bloqueo de rangos privados, loopback, link-local (incluido el servicio de metadatos de la nube), IPv6 ULA, resolución DNS fijada (anti-rebinding), sin seguir redirecciones a otro host, solo `https`; egreso de red de la VPC por proxy/NAT con lista blanca; logos y archivos se suben, nunca se importan "desde URL". | 0 llamadas a destinos no listados (bloqueo en red y en librería). | Suite SSRF en CI (URLs a `169.254.169.254`, `localhost`, `10.0.0.1`, redirecciones). | CNX §10 V-05 | Núcleo | O0 | Adoptado |
| RNF-NFR-088 | Webhooks entrantes: verificación de firma del proveedor (HMAC o firma asimétrica) con tolerancia de reloj ≤ 5 min, protección de repetición por identificador de evento, lista blanca de IP cuando el proveedor la publica, secreto por tenant y conector en la bóveda; un webhook sin firma válida se registra y se descarta. Confirmación de pago siempre verificada contra la API del proveedor (RN-NFR-008). | 0 pagos confirmados por webhook falsificado en prueba. | Prueba de contrato con firmas inválidas y repetidas. | RN-13 §17 (ProvinciaNet, Macro) | Núcleo | O5 | Adoptado |
| RNF-NFR-089 | Redirecciones abiertas: parámetros `returnUrl`/`redirect` solo rutas relativas internas o dominios de la lista blanca del tenant. | 0 redirecciones externas no permitidas. | Prueba automatizada. | ASVS (frontend) | Estándar | O1 | Adoptado |

### 9.10 Autorización, errores y aislamiento

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-090 | Autorización en servidor en cada request: tenant del token, usuario habilitado, perfil de pantalla, capability de acción y alcance sobre el objeto (sucursal, zona, servicio, cuadrilla, propios) y por campo (BASE §29, §59); denegación por defecto; IDOR imposible porque toda búsqueda por `_id` incluye `tenantId` y filtro de alcance. | 100 % de rutas con declaración de capability; 0 accesos cruzados en la suite de aislamiento (RNF-NFR-148). | Test que recorre el registro de rutas y falla si alguna no declara capability; suite de permisos negativos. | BASE §29 (regla), §34 esc. 16–20, 30 | Núcleo | O0 | Adoptado |
| RNF-NFR-091 | Manejo de errores RFC 9457 (`application/problem+json`) con `requestId`; los 5xx nunca exponen stack, consultas, rutas internas ni versiones; 4xx con mensaje por clave de diccionario en español (CNX §2.6); errores de autorización no revelan si el recurso existe en otro tenant (404 uniforme); `type` con la forma `/problems/<módulo>/<código>` (DEC-090). | 0 stacks en respuestas (DAST y prueba de contrato). | Prueba que fuerza excepciones en `production`. | CNX §2.6; guía §5 (API) | Núcleo | O0 | Adoptado |

### 9.11 Dependencias, cadena de suministro y pruebas de seguridad

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-092 | Gestión de dependencias: lockfile obligatorio e instalación reproducible (`npm ci`), actualizaciones automáticas semanales (Renovate/Dependabot), análisis SCA en cada PR; el build falla con vulnerabilidades altas o críticas con corrección disponible; plazos de remediación desde la publicación: crítica ≤ 7 días, alta ≤ 30 días, media ≤ 90 días, baja en la siguiente actualización planificada; excepciones con justificación y vencimiento. | 0 críticas abiertas > 7 días en producción. | Tablero de vulnerabilidades; gate del pipeline. | BASE §60 ("análisis de dependencias y corrección de vulnerabilidades") | Núcleo | O0 | Adoptado |
| RNF-NFR-093 | Cadena de suministro: SBOM CycloneDX por imagen y versión; imágenes base mínimas fijadas por digest; escaneo de imágenes (bloquea críticas); firma de imágenes y verificación en el despliegue; control de licencias de dependencias con lista permitida (sin AGPL/SSPL en componentes distribuidos al cliente sin revisión); paquetes nuevos revisados (popularidad, mantenimiento, scripts `postinstall`). | 100 % de versiones liberadas con SBOM y firma. | Evidencia de liberación (RF-NFR-022). | ASVS (arquitectura y código seguro) | Núcleo | O0 | Adoptado |
| RNF-NFR-094 | Análisis estático: SAST (Semgrep/CodeQL con reglas propias: `Number` en importes, `v-html`, `$where`, `rejectUnauthorized`, algoritmos prohibidos, consultas sin `tenantId`) y secret scanning (pre-commit y CI, incluido historial) en cada PR. | 0 hallazgos altos sin resolver al fusionar. | Gate del pipeline. | CNX §10 (token en README); RN-10 §13 | Núcleo | O0 | Adoptado |
| RNF-NFR-095 | Pruebas dinámicas: DAST de línea base (OWASP ZAP) sobre staging en cada liberación y completo mensual autenticado con dos tenants; pruebas de penetración externas antes del go-live del piloto (DEC-092: antes de la primera salida a producción con datos reales de socios, y otra vez antes del corte comercial de LAG tras O7 según DEC-089), anuales y tras cambios mayores de autenticación, pagos o multitenancy; hallazgos con los plazos de RNF-NFR-092. | 0 hallazgos críticos/altos abiertos al go-live. | Informe del pentest y plan de remediación en evidencias. | BASE §60 ("pruebas de seguridad de API y aislamiento") | Núcleo | O1 | A validar (PA-NFR-17) |

### 9.12 Infraestructura, datos e IA

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-096 | Contenedores endurecidos: usuario no root, sistema de archivos de solo lectura salvo `/tmp`, sin herramientas de shell innecesarias, capacidades Linux eliminadas, límites de CPU/memoria; red con segmentación (bases y Redis solo accesibles desde API/workers), WAF delante de admin/PWA/landing/API con reglas OWASP gestionadas; acceso administrativo a infraestructura solo por SSO + MFA, sin SSH directo a producción (se reemplaza el autodeploy por SSH de CNX §2.8). | 0 contenedores root en producción; 0 puertos de administración expuestos. | Escaneo de configuración (CIS benchmark) mensual. | CNX §2.8, §10 (accesos SSH en README) | Núcleo | O0 | Adoptado |
| RNF-NFR-097 | Endurecimiento de datos: MongoDB con autenticación, TLS, auditoría de la base habilitada si el servicio la ofrece, `javascriptEnabled: false`, usuarios de base por componente con mínimo privilegio (API: lectura/escritura en colecciones de negocio y solo inserción en `auditLogs`; workers: según cola; migraciones: DDL solo en despliegue; BI: lectura en vistas de secundarios); Redis con ACL, TLS y sin comandos peligrosos (`FLUSHALL`, `CONFIG`, `KEYS`); la identidad del usuario final viaja hasta la auditoría (RN-09 §7.6). | 0 usuarios de base compartidos entre componentes. | Revisión IaC y prueba de permisos por rol de base. | RN-09 §5.3 (mismo usuario SQL para todos los puestos), §7.6 | Núcleo | O0 | Adoptado |
| RNF-NFR-098 | Seguridad de IA (AGR-030): cada función de IA declara finalidad, datos de entrada permitidos, proveedor, versión de modelo y prompt; las herramientas que la IA puede invocar están limitadas al tenant y al permiso del usuario que la usa; mensajes y adjuntos se marcan como contenido no confiable (RN-NFR-011); redacción de identificadores antes de enviar al proveedor; salidas validadas con esquema antes de usarse; registro de sugerencia y decisión humana; si la IA no está disponible, el flujo sigue sin ella. | 0 éxitos en la batería de inyección de prompt (instrucciones en fotos, mensajes y PDF que intentan cambiar de tenant o ejecutar acciones). | Suite de pruebas adversariales en CI para cada función de IA. | AGR-030; BASE §97.1 (minimización en bot e IA); DFA M1 (`AUDIT_IA`) | Núcleo | O2 | A validar (PA-NFR-09) |
| RNF-NFR-099 | Separación de ambientes (T01): cuentas/proyectos de nube distintos para producción y no producción, credenciales productivas inaccesibles desde no producción, homologación/sandbox para ARCA, pasarelas y mensajería en no producción con lista de destinatarios permitidos; el seed de demostración se niega a ejecutar en `production` o sobre un tenant marcado productivo (CNX V-13). | 0 credenciales productivas en no producción; 0 mensajes a destinatarios no permitidos desde no producción. | Prueba del seed en modo `production` (debe fallar); auditoría trimestral de accesos. | BASE §97.9; AGR-035; CNX §10 V-13 | Núcleo | O0 | Adoptado |

### 9.13 Lecciones de seguridad de ProCoop y Connectia

Cada deuda relevada se convierte en un control verificable. No se transcriben valores secretos; solo tipo y ubicación (RN-10 §13, RN-13 §17).

| Fuente | Hallazgo | Riesgo | Control en CoopApps |
|---|---|---|---|
| RN-09 §4.1 | Contraseñas almacenadas con transformación reversible (`Nucleo.Encriptar`/`Desencriptar`) y dígito verificador. | Recuperación de todas las contraseñas con acceso a la base. | RNF-NFR-059, RNF-NFR-060; las contraseñas **no se migran** (sección 19). |
| RN-09 §4.1 | Contraseñas maestras hardcodeadas, contraseña de administrador derivada de la fecha, credenciales precargadas con depurador, autenticación del importador con contraseña fija. | Puerta trasera universal. | RN-NFR-004; RNF-NFR-094 (SAST/secret scanning). |
| RN-09 §4.1; RN-10 §13 | Reset de usuarios a contraseña por defecto fija en código; forzado de cambio opcional (variable 2588). | Cuentas tomadas tras reset. | T02: recuperación por enlace de un solo uso + MFA (RNF-NFR-066); sin contraseñas por defecto. |
| RN-09 §4.2 | `iNivel == -1` (SysAdmin) saltea todos los controles; sin permisos por registro. | Privilegio total sin rastro. | RNF-NFR-090 (alcance por objeto); ningún rol saltea auditoría; plataforma sin acceso a datos sin acceso temporal (AGR-034). |
| RN-09 §4.3 | Auditoría selectiva por sentencia, sin valores previos/posteriores; errores a `LogProcoop.txt` y por mail a casilla personal. | No reconstruible; fuga de datos por correo. | RNF-NFR-110 a 119; RN-NFR-021. |
| RN-09 §5.3 | Archivo `.pro` con contraseña SQL ofuscada en cada puesto; un único usuario SQL para todos; identidad del usuario no llega a la base. | Compromiso total desde cualquier puesto. | RNF-NFR-067, RNF-NFR-097. |
| RN-09 §5.4 | Licencia validada contra lista de CUIT compilada en el ejecutable; 30 días de demo. | Evasión trivial. | Licencias en servidor (T01). |
| RN-09 §5.5 | Carga de formularios y funciones por reflexión desde texto de menú (`Assembly.Load` + `Activator.CreateInstance`) sin contrato. | Ejecución arbitraria de tipos públicos. | Menú declarativo `siteMapGroups` y registro explícito de rutas (CNX §4.6); sin invocación por nombre desde datos. |
| RN-09 §5.2 | Bloqueo por desfase de reloj del puesto > 60 min. | Depende del reloj del cliente. | RN-NFR-018; RNF-NFR-138. |
| RN-09 §5.7 | Esquema actualizado por el primer usuario; binarios descargados de un bucket y reemplazados en uso. | Actualizaciones no controladas, cadena de suministro. | RN-NFR-022, RN-NFR-023, RNF-NFR-093. |
| RN-09 §5.6, §5.8 | TeamViewer y webchat de soporte desde la app; backups locales disparados al login/logout; agente vigilado por otro proceso. | Acceso remoto no gobernado; backups no probados. | Soporte con acceso temporal auditado (AGR-034, T01); RNF-NFR-038 a 045; RN-NFR-024. |
| RN-09 §8 duda 6 | Variable −1 envía excepciones a una casilla externa. | Fuga de datos personales a terceros. | RN-NFR-021; RNF-NFR-121 (redacción). |
| RN-10 §13 | Credenciales de SES, AWS, Firebase, SQL central, OpenAI, Google Maps, API keys del proveedor y de CoopOnline hardcodeadas; claves derivadas de la fecha con patrón fijo; correos personales como destinatarios fijos. | Todas comprometidas. | RNF-NFR-067, RNF-NFR-068, RNF-NFR-094; sección 19: se rotan y recargan, nunca se migran. |
| RN-10 §13 | Credenciales de la cooperativa (SMTP, pasarelas, CoopOnline, WhatsApp, telemedición) en `VARIABLE`/`.pro` en texto plano; clave de casilla en XML. | Exposición por cualquier lectura de la base. | RNF-NFR-068 (bóveda por tenant). |
| RN-10 §14 | Portal del socio en base MySQL aparte sincronizada, Firebase y FTP de PDF. | Copias de datos fuera de control. | Portal lee la misma API (M19); RNF-NFR-081. |
| RN-13 §17 | Log de Pagos360 escribe el header de autorización y el cuerpo. | Fuga de token Bearer. | RNF-NFR-121 (redacción obligatoria de `authorization`, `cookie`, `x-api-key`, cuerpos de pasarelas). |
| RN-13 §17 | Clave secreta de Macro dentro del string del botón, guardada en `PAGOS360.URL_SUCCESS` y enviada al portal. | Falsificación de firmas de pago. | RNF-NFR-068; las firmas se calculan solo en servidor. |
| RN-13 §17 | Credenciales y token de Interbanking en tabla sin cifrar. | Transferencias fraudulentas. | RNF-NFR-068; aprobación a dos firmas en M14. |
| RN-13 §17 | Datos de tarjeta inyectados en HTML local del tótem. | Incumplimiento PCI, fuga. | RN-NFR-009. |
| CAT; `GenerarClaveWeb` (M01 RN-PER-119); RN-09 var 3048 | Clave web de socios en `SOCIOS` (aleatoria o igual al documento, según V2 914), clave del proveedor de IA en `VARIABLE`, posibles credenciales de proveedores, profesionales y empleados en columnas no listadas del catálogo y columnas no listadas de `CUPONTAR` que podrían traer el número de tarjeta. | Arrastre de secretos o de números de tarjeta a la plataforma por la migración. | RN-NFR-009; sección 19 (escaneo previo que bloquea la migración, DEC-103; T07 RN-MIG-013). |
| RN-13 §17 | ProvinciaNet acepta como pagado el importe informado por el portal. | Fraude de cobro. | RN-NFR-008; RNF-NFR-088. |
| RN-13 §17 | SQL armado por concatenación con datos de la pasarela. | Inyección. | RNF-NFR-082, RNF-NFR-084. |
| RN-13 §17 | Servicio BancoSangre sin autenticación devuelve resúmenes por DNI/CUIT. | Exposición de datos de salud. | RNF-NFR-090, RNF-NFR-100 a 102; RN-NFR-019. |
| CNX §10 V-01 | `/uploads` servido público sin autenticación. | Exposición de facturas y documentos. | RNF-NFR-058, RNF-NFR-081. |
| CNX §10 V-02 | Secretos JWT débiles o de ejemplo. | Falsificación de tokens. | RNF-NFR-063, RNF-NFR-070. |
| CNX §10 V-04 | CORS abierto si falta la variable. | Lectura cruzada desde sitios maliciosos. | RNF-NFR-074, RNF-NFR-070. |
| CNX §10 V-05 | Proxy de medios con riesgo SSRF. | Acceso a red interna y metadatos de nube. | RNF-NFR-087. |
| CNX §10 V-07 | Sin rate limiting. | Fuerza bruta, abuso. | RNF-NFR-075, RNF-NFR-076. |
| CNX §10 V-13 | Usuarios demo con clave conocida. | Acceso con credenciales públicas. | RNF-NFR-099; RN-NFR-014. |
| CNX §10 | Credenciales de integraciones en `.env` global. | Una fuga compromete todas las empresas. | RNF-NFR-068. |
| CNX §10 | Token personal de GitHub y accesos SSH en `README.md`. | Compromiso del repositorio y servidores. | RNF-NFR-094 (secret scanning con historial), RNF-NFR-096 (sin SSH directo). |
| CNX §10 V-03, V-06, V-08 a V-12 | Códigos citados por rango en la fuente sin detalle en el documento de referencia. | Desconocido. | [VERIFICAR] contra `CONNECTIA-OLA60-S05-ANALISIS-VULNERABILIDADES.md` antes de O0; cada hallazgo se incorpora a la lista ASVS (RNF-NFR-050). |
| CNX §2.6, §10 | Auditoría por dominio, sin transacciones en operaciones contables, backups sin restauración probada. | Inconsistencias en dinero. | RNF-NFR-110 a 113, RNF-NFR-211, RNF-NFR-043. |
| RN-09 §5.5 (modo 12) | Impresión desde JSON invocando funciones por reflexión (`clsFuncion.EjecutarFuncion`). | Ejecución arbitraria. | RNF-NFR-238 (lint que prohíbe `import()`/invocación dinámica con cadenas provenientes de datos). |

### 9.14 Controles complementarios de seguridad

Consolidan exigencias de detalle que completan los requisitos de 9.1 a 9.12 (capítulos ASVS 5.0 de referencia: V1 codificación y sanitización, V2 validación y lógica de negocio, V3 frontend web, V4 API y servicios web, V5 archivos, V6 autenticación, V7 sesión, V8 autorización, V9 tokens autocontenidos, V10 OAuth/OIDC, V11 criptografía, V12 comunicación segura, V13 configuración, V14 protección de datos, V15 codificación y arquitectura segura, V16 registro de seguridad y manejo de errores, V17 WebRTC solo si se habilita videollamada [VERIFICAR numeración contra la versión vigente]).

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-230 | Integridad de documentos emitidos (comprobantes PDF, constancias, conformidades firmadas, informes de acceso, recibos de sueldo): hash SHA-256 almacenado al emitir y verificable; firma digital cuando el régimen lo exija (Ley 25.506 [VERIFICAR]) con certificados del tenant en la bóveda. | 100 % de documentos emitidos con hash; verificación p95 ≤ 1 s. | Alterar un byte del PDF almacenado hace fallar la verificación y genera alerta. | DFA M1 (`FIRMADIGITAL*`, `FIRMASELECTRONICAS*`); AGR-023 | Estándar | O4 | Adoptado |
| RNF-NFR-231 | MFA y reautenticación por riesgo (T02): MFA obligatorio además para operadores con capabilities de dinero (`*.anular`, `*.aprobar`, `cob.*`, `tes.*`), soporte y responsables de privacidad; factores TOTP y WebAuthn/passkeys; reautenticación reforzada (factor con antigüedad ≤ 5 min) para operaciones de alto impacto; inactividad del admin ≤ 30 min y sesión absoluta ≤ 12 h; rehash transparente de contraseñas al cambiar parámetros. | Asignar `cob.recibos.anular` a un usuario sin MFA obliga a enrolarlo antes de usarla. | Prueba e2e. | BASE §60 SEG-002, CU-SEG-01; BASE §29 | Núcleo | O1 | Adoptado |
| RNF-NFR-232 | Recuperación que no debilita la cuenta (T02): no elimina MFA con solo un correo; tokens de un solo uso ≤ 15 min; notificación al titular; invalidación de sesiones; pérdida del factor solo con códigos de recuperación o procedimiento reforzado con evidencia. Acceso con Google/OIDC: validación de firma, emisor, audiencia, vigencia y `sub` estable; sin fusionar cuentas por coincidencia de correo ni conceder roles. | 0 caminos que desactiven MFA sin factor o procedimiento reforzado. | Pruebas negativas de escenarios 47 y 48. | BASE §60 SEG-003 a SEG-005 [SEG4]; BASE §34 esc. 47, 48 | Núcleo | O1 | Adoptado |
| RNF-NFR-233 | Credenciales de API de terceros (BI y `/api/v1/ext`): guardadas como hash, mostradas una sola vez, con alcance, vencimiento máximo 12 meses, rotación sin corte (dos vigentes en paralelo), revocación efectiva ≤ 60 s y registro solo del prefijo identificador. | Revocar un token impide su uso en ≤ 60 s (escenario 46). | Prueba de integración de revocación y de logs sin token. | BASE §59; BASE §34 esc. 45, 46 | Núcleo | O1 | Adoptado |
| RNF-NFR-234 | Límites de lógica de negocio contra abuso: tope de intentos de pago por comprobante y hora, de mensajes salientes por socio y día (CNX §2.7), de solicitudes de turno simultáneas por persona, de reclamos abiertos sin supervisión por cuenta y de exportaciones por rol (RF-NFR-024); si Redis no está disponible, los límites de autenticación fallan **cerrados** y el resto usa límite local por réplica. | Excederlos genera alerta de abuso; valores parametrizables por tenant. | Pruebas de integración por tope y con Redis caído. | ASVS V2; CNX §2.7 | Estándar | O2 | Adoptado |
| RNF-NFR-235 | Protección contra contaminación de prototipo y asignación de campos protegidos: `tenantId`, `createdBy`, `status`, importes calculados y `version` nunca se toman del cliente; parsers que rechazan `__proto__`/`constructor`; antivirus caído ⇒ archivo pendiente (falla cerrada) sin bloquear la operación de negocio; emisión de URL firmada auditada para documentos de identidad, salud, conformidades y recibos de sueldo; cliente HTTP saliente con límite de respuesta 10 MB, metadatos de instancia con IMDSv2 o deshabilitados y lint que prohíbe `fetch`/`axios` directos. | 0 hallazgos en las pruebas correspondientes. | `PATCH` con `tenantId` de TEN-002 no lo cambia; prueba con antivirus detenido; lint. | ASVS V1, V5, V15; CNX §10 V-01, V-05 | Núcleo | O0 | Adoptado |
| RNF-NFR-236 | Cadena de suministro reforzada: imágenes con Node 20 LTS por digest, firmadas (cosign/Sigstore) y verificadas por política de admisión (solo imágenes firmadas del registro propio); procedencia SLSA nivel 2 como objetivo; WAF con reglas OWASP CRS y protección DDoS de capa 3/4 y 7; deriva de IaC corregida ≤ 24 h. | 100 % de imágenes de producción firmadas; imagen sin firma rechazada. | Prueba de admisión en staging. | RN-09 §5.7; RN-NFR-023; DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-237 | Acceso de emergencia a producción (break-glass): SSO + MFA, aprobación de un segundo operador, sesión grabada, vigencia ≤ 4 h y revisión posterior ≤ 5 días hábiles; el acceso de soporte a datos de un tenant solo por el circuito temporal de AGR-034 (T01/T02). | 100 % de accesos break-glass con ticket y revisión. | Conciliación mensual de accesos privilegiados. | CNX §2.8, §10; AGR-034 | Núcleo | O0 | Adoptado |
| RNF-NFR-238 | Defensa en profundidad del aislamiento: el plugin de tenancy cubre también cada `$lookup`, `$unionWith` y `$graphLookup`, `bulkWrite` e `insert*`; el acceso sin tenant solo existe con un contexto explícito `platformScope()` auditado; claves de Redis, objetos de almacenamiento (`<tenantId>/...`), canales de push y nombres de jobs llevan el tenant; la suite de aislamiento (RNF-NFR-148) cubre además cachés, colas, notificaciones push, eventos de outbox, logs y métricas; prueba de mutación del plugin (deshabilitarlo debe romper la suite); prohibida la invocación dinámica de código a partir de datos. | 0 consultas de negocio sin `tenantId` en el profiler de staging la semana previa a cada liberación. | Prueba que llama cada método de Mongoose sin contexto y espera error; análisis del profiler. | DEC-002; CNX §2.3; RN-09 §5.5 | Núcleo | O0 | Adoptado |

## 10. Privacidad y protección de datos personales (Ley 25.326)

### 10.1 Marco y roles

- **Norma de referencia:** Ley 25.326 de Protección de Datos Personales, su Decreto reglamentario 1558/2001 y la normativa de la **AAIP** como autoridad de control (BASE §97.1), incluidas las medidas de seguridad recomendadas (Res. AAIP 47/2018) y los modelos de cláusulas para transferencias internacionales [VERIFICAR vigencia y números de resolución con asesoramiento legal]. Normas conexas a considerar: Ley 26.951 (Registro "No Llame") para comunicaciones promocionales por teléfono/mensajería, Ley 26.529 (derechos del paciente e historia clínica) para prestaciones de salud y ambulancias (M18), Ley 26.653 (accesibilidad web) para prestadores de servicios públicos (sección 13) [VERIFICAR alcance]. Se monitorea el proyecto de nueva ley de datos personales y se revisa este anexo si se sanciona.
- **Roles (A validar PA-NFR-07):** cada cooperativa es **responsable de su base** (decide finalidades); CoopApps actúa como **prestador de servicios de tratamiento** por cuenta de la cooperativa (art. 25): no aplica los datos a otra finalidad, no los cede, y al terminar el contrato los destruye, salvo autorización expresa de la cooperativa para conservarlos hasta **2 años** con las debidas condiciones de seguridad ante posibles encargos ulteriores (art. 25 inc. 2) [VERIFICAR]. Para los datos propios de la plataforma (usuarios de cooperativas como clientes del SaaS, facturación de la plataforma), CoopApps es responsable.
- **Principio de BASE §59:** que la información de los asociados "es de la cooperativa" se interpreta como **disponibilidad** de sus datos para el tenant, no como eliminación de los derechos de los titulares (CTR-NFR-09).
- **Bases legales típicas** (art. 5): relación contractual de suministro (inc. 2.c), obligación legal (fiscal, regulatoria), consentimiento (comunicaciones promocionales, muro/comunidad, IA, datos sensibles cuando no exista otra base) [VERIFICAR con asesor por finalidad].

### 10.2 Requisitos

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-100 | Datos de salud y sensibles (prestaciones de salud, ambulancias, banco de sangre, sepelio con causa de muerte, electrodependencia, certificados médicos de personal, discapacidad para tarifa social): colecciones propias del módulo dueño con `sensitivity: 'sensible'`, cifrado de campo con DEK de categoría `salud` (RNF-NFR-056), almacenamiento de documentos en prefijo con clave separada (RNF-NFR-058) y, cuando aplique, sin exponer la causa en la entidad comercial (la cuenta/servicio solo ve "condición acreditada: sí/no" y vigencia). | 100 % de campos de salud cifrados; 0 campos de salud en colecciones comerciales. | Script de CI que cruza `x-pii` con colecciones; revisión de esquemas de M18/M01/M16. | BASE §97.1 (tratamiento reforzado de salud y electrodependencia); RN-13 §17 (BancoSangre) | Núcleo | O2 (mecanismo de cifrado de categoría `salud` con RF-PER-014; se verifica de nuevo en O7 electrodependencia, O9 legajo y O10 prestaciones de salud; antes "O10 (electrodependencia en O7, legajo en O9)", alineado al plan de olas §18) | Adoptado |
| RNF-NFR-101 | Acceso a datos de salud solo con capability explícita del módulo (por ejemplo `soc.salud.ver`), alcance mínimo, motivo obligatorio al abrir una ficha sensible fuera de una tarea asignada, auditoría de **cada lectura** (RNF-NFR-114) y revisión mensual de accesos por el responsable del tenant. | 100 % de lecturas de datos de salud auditadas; informe mensual disponible. | Prueba de integración que lee una ficha y verifica el evento `read`. | BASE §97.1; Ley 26.529 [VERIFICAR] | Núcleo | O10 | Adoptado |
| RNF-NFR-102 | Exclusión de datos de salud de BI general, cubos, APIs externas, exportaciones genéricas, muro, notificaciones con contenido (el aviso dice "tenés una novedad en tu prestación", sin diagnóstico), bot e IA; una decisión clínica o de urgencia nunca depende de deuda ni de una regla comercial (BASE banco de sangre; AGR-030). | 0 campos de salud en el catálogo de datos expuestos a BI/API; prueba de que un deudor recibe igual el servicio de ambulancia. | Prueba de contrato del catálogo BI; escenario 94 y prueba de AGR-030. | BASE §97.1; AGR-030, AGR-033 | Núcleo | O10 | Adoptado |
| RNF-NFR-103 | Minimización: APIs, exportaciones, BI, bot e IA reciben solo los campos necesarios para la finalidad registrada; por defecto las APIs exponen identificadores internos y no DNI/CUIT/teléfono/correo/domicilio completo salvo alcance específico; las notificaciones en pantalla bloqueada no muestran importes de deuda ni datos sensibles (configurable por tenant). | 100 % de alcances de API con lista de campos; revisión del inventario por finalidad. | Prueba de contrato por alcance (BASE §59, "minimización de datos personales"). | BASE §59, §97.1; AGR-033 | Núcleo | O1 | Adoptado |
| RNF-NFR-104 | Menores de edad (adherentes de sepelio, beneficiarios, hijos en legajos): datos tratados con consentimiento del representante cuando corresponda, sin acceso propio a la app salvo decisión del tenant, sin uso en comunicaciones promocionales ni en el muro; aviso al alcanzar la mayoría de edad (ProCoop lo hace en el Agente) para regularizar titularidad y consentimiento. | 0 menores en audiencias promocionales. | Prueba del motor de audiencia (T09) con fecha de nacimiento < 18 años. | RN-09 §5.8 (aviso de adherentes que cumplen la mayoría de edad) | Estándar | O10 | Adoptado |
| RNF-NFR-105 | Localización y transferencias internacionales: los datos se alojan en AWS sa-east-1 (DEC-062); toda transferencia a un país sin nivel adecuado según la AAIP se ampara en cláusulas contractuales modelo u otra garantía válida, se informa en el aviso de privacidad y en el registro de subencargados (RF-NFR-013). | 100 % de subencargados con país y garantía registrados. | Revisión trimestral del registro. | Ley 25.326 art. 12 [VERIFICAR]; BASE §97.1 (subencargados) | Núcleo | O0 | Adoptado (DEC-062) |
| RNF-NFR-106 | BI y reportes agregados: los cubos certificados (CNX §4.5) trabajan con seudónimos; los agregados que puedan reidentificar (celdas con < 5 titulares en cruces por zona, categoría y condición) se suprimen o agrupan; salidas para terceros (reguladores, INAES) siguen el formato exigido con los datos mínimos requeridos. | 0 celdas < 5 en exportaciones agregadas no regulatorias. | Prueba automatizada de supresión de celdas pequeñas. | AGR-033; CNX §4.5 | Estándar | O11 | Adoptado |
| RNF-NFR-107 | Plazos de atención de derechos medidos y alertados: acceso ≤ 10 días corridos desde la solicitud verificada; rectificación, actualización y supresión ≤ 5 días hábiles; la gratuidad del acceso se respeta en intervalos ≥ 6 meses salvo interés legítimo (art. 14 inc. 3) [VERIFICAR]; respuesta fundada si se deniega (obligación de conservación, bloqueo legal). | ≥ 98 % de solicitudes dentro de plazo por trimestre; alerta al 70 % del plazo. | Indicador IND-NFR-07 en el tablero del tenant. | Ley 25.326 arts. 14 y 16 | Núcleo | O1 | Adoptado |
| RNF-NFR-108 | Fin del encargo: al dar de baja un tenant (T01) se entrega la exportación de salida y se destruyen sus datos en producción en ≤ 30 días desde la aceptación de la exportación (o se conservan cifrados hasta 2 años si la cooperativa lo autoriza expresamente), y en backups al vencer su retención; se emite constancia de destrucción. | Constancia emitida en el 100 % de bajas. | Simulacro con tenant ficticio TEN-099. | Ley 25.326 art. 25 [VERIFICAR]; AGR-033 (salida de datos) | Núcleo | O1 | Adoptado (DEC-076) |
| RNF-NFR-109 | Privacidad por diseño: toda funcionalidad nueva que trate datos sensibles, perfile socios, use IA, geolocalización continua o comparta datos con terceros requiere una evaluación de impacto (EIPD) documentada antes de su ola; la analítica de uso del front no usa cookies de terceros ni identificadores publicitarios; la landing solo usa cookies estrictamente necesarias salvo consentimiento. | 1 EIPD por funcionalidad alcanzada; 0 cookies de terceros sin consentimiento. | Revisión del gate de ola; escaneo de cookies en Playwright. | BASE §97.1; AGR-030, AGR-033 | Estándar | O1 | Adoptado |

### 10.3 Conservación propuesta por categoría (A validar PA-NFR-06)

BASE §98 deja pendiente fijar plazos y AGR-033 pide no inventar plazos universales sin consultar el marco aplicable. Se proponen estos valores por defecto, parametrizables por tenant dentro de mínimos y máximos de plataforma, **a validar con asesoramiento legal, fiscal y contable**. Al vencer el plazo: supresión o anonimización según la columna "Acción", salvo bloqueo legal.

| PRM | Categoría | Plazo propuesto | Desde | Acción al vencer | Fundamento a verificar |
|---|---|---|---|---|---|
| PRM-NFR-040 | Comprobantes, recibos, notas de crédito/débito, asientos, libros y documentación respaldatoria | 10 años | Cierre del ejercicio | Conservar documento; anonimizar contacto no fiscal | CCyC art. 328; Ley 11.683; normativa ARCA [VERIFICAR] |
| PRM-NFR-041 | Contratos de suministro, solicitudes de alta/baja y conformidades firmadas | 10 años | Fin del contrato | Anonimizar | Prescripción CCyC [VERIFICAR] |
| PRM-NFR-042 | Registro de auditoría de cambios económicos y de configuración | 10 años | Fecha del evento | Archivar en frío (WORM) | Igual que documentos que respalda |
| PRM-NFR-043 | Auditoría de accesos, lecturas sensibles y eventos de seguridad | 2 años en línea + 3 años archivo | Fecha del evento | Eliminar | Res. AAIP 47/2018 (registro de accesos) [VERIFICAR] |
| PRM-NFR-044 | Logs técnicos de aplicación | 30 días en línea, 1 año archivo (solo logs de seguridad) | Fecha del log | Eliminar | Operativo |
| PRM-NFR-045 | Tickets, reclamos, conversaciones y adjuntos de atención | 5 años | Cierre del caso | Anonimizar texto y eliminar adjuntos | Defensa del consumidor/regulador [VERIFICAR] |
| PRM-NFR-046 | Registro de personas sin vínculo (registro en la app sin solicitud concretada, leads, consultas públicas) | 24 meses de inactividad | Último acceso | Suprimir | Finalidad agotada (art. 4 inc. 7) |
| PRM-NFR-047 | Consentimientos y su evidencia | Vigencia + 5 años | Revocación o vencimiento | Eliminar evidencia | Prueba del consentimiento |
| PRM-NFR-048 | Legajos de personal y liquidaciones | 10 años desde el egreso (recibos y F.931 según normativa previsional) | Egreso | Anonimizar salvo bloqueo | LCT/previsional [VERIFICAR] |
| PRM-NFR-049 | Datos de salud y prestaciones sanitarias | 10 años | Última prestación | Según historia clínica: conservar o anonimizar | Ley 26.529 art. 18 [VERIFICAR] |
| PRM-NFR-050 | Muro y comunidad (comentarios, reacciones) | Mientras la publicación esté vigente + 2 años; contenido moderado como evidencia 2 años | Baja de la publicación | Eliminar contenido visible; conservar evidencia de moderación hasta plazo | AGR-031 |
| PRM-NFR-051 | Evidencias de campo (fotos, firma, geolocalización de la intervención) | Igual que la orden y el contrato asociados | Cierre de la orden | Según contrato | AGR-025 |
| PRM-NFR-052 | Registros institucionales (asociados, capital, actas, asambleas) y Cementerio parque (ocupaciones y derechos) | Permanente | — | No se suprimen; acceso restringido | Ley 20.337; derechos de sepultura (escenario 93) [VERIFICAR] |
| PRM-NFR-053 | Grabaciones o transcripciones de bot/IA | 12 meses | Fecha | Eliminar | Minimización |
| PRM-NFR-054 | Archivos de exportación generados | 24 h | Generación | Eliminar | RF-NFR-024 |
| PRM-NFR-055 | Archivos en cuarentena infectados | 30 días | Detección | Eliminar | RNF-NFR-079 |

### 10.4 Flujo de solicitud de derechos (resumen; estados en sección 15.2)

1. **Ingreso** por PWA ("Mis datos"), landing (formulario público con antiautomatización), presencial o correo (registrado por atención). Se crea `dataSubjectRequests` con tipo, canal, fecha de recepción y plazo calculado (días corridos o hábiles según tipo, calendario de feriados del tenant).
2. **Verificación de identidad** proporcional: sesión autenticada con MFA si la tiene; si no, validación de DNI/CUIT + dato de la cuenta (número de cliente, último importe facturado) o presentación presencial. El plazo corre desde la solicitud; la falta de verificación se informa al titular.
3. **Búsqueda** automática de todas las apariciones del titular en el tenant (colecciones con `x-pii`, por `personId`, DNI/CUIT e índices ciegos) — job `nfr:localizar-titular`.
4. **Evaluación**: para supresión, el sistema aplica `retentionPolicies` y `legalHolds` y propone por cada categoría: suprimir, anonimizar, bloquear (conservar para obligación) o rechazar con fundamento.
5. **Aprobación** por el responsable de protección de datos del tenant (`nfr.solicitudesDerechos.aprobar`).
6. **Ejecución** (job `nfr:ejecutar-solicitud`, idempotente) y registro de supresión durable para reaplicar tras restauraciones (RNF-NFR-045).
7. **Respuesta** al titular por el canal elegido con el informe (acceso) o la constancia; cierre con evidencia; auditoría completa.

### 10.5 Flujo de incidente de seguridad o de datos personales

1. **Detección** (alerta técnica, reporte de un tenant, de un investigador vía `security.txt` o de un proveedor) → `securityIncidents` en `Detectado`, severidad preliminar SEV1–SEV4.
2. **Contención** (rotación de emergencia RNF-NFR-069, bloqueo de cuentas, corte de conector, WAF).
3. **Evaluación de impacto**: tenants y titulares afectados, categorías de datos (agravante si hay salud, financieros o credenciales), probabilidad de daño.
4. **Notificación a cada cooperativa afectada** en los plazos de PA-NFR-08 (recomendado ≤ 24 h desde la confirmación, informe preliminar ≤ 72 h, informe final ≤ 15 días), con la información para que la cooperativa, como responsable, decida la comunicación a titulares y a la AAIP.
5. **Erradicación y recuperación**, verificación y monitoreo reforzado 30 días.
6. **Post-mortem** sin culpables en ≤ 10 días hábiles con acciones y responsables; cierre.

## 11. Auditoría, trazabilidad y observabilidad

### 11.1 Auditoría (metas sobre el registro `auditLogs` de T02)

Nombre canónico `auditLogs` de T02 (antes citado en este anexo como `auditEvents`; CTR-DAT-24).

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-110 | Cobertura: cada cambio persistente de negocio, configuración, reglas, roles, perfiles, asignaciones y estados, hecho por personas, procesos, bots o integraciones, genera un evento con tenant/ámbito, objeto, operación, actor humano y técnico, fecha, canal, `requestId`/`traceId`/`jobId`, valores previos y posteriores (o diferencia recuperable), motivo/autorización y resultado; también los intentos fallidos relevantes, diferenciados. | **100 %** de rutas y jobs de escritura cubiertos. | Test que recorre el registro de rutas y jobs de escritura y verifica un evento por operación (escenario 42). | BASE §54, §29; RN-09 §7.8 | Núcleo | O0 | Adoptado |
| RNF-NFR-111 | Atomicidad: el evento de auditoría se escribe en la misma transacción que el cambio; si falla la auditoría, falla el cambio. | 0 cambios sin evento en la prueba de caos (corte entre escritura y auditoría). | Prueba de integración con fallo inyectado. | BASE §54 ("no confirmar cambios sin su evidencia") | Núcleo | O0 | Adoptado |
| RNF-NFR-112 | Inmutabilidad: la identidad de base del API solo puede insertar en `auditLogs` (sin `update`/`delete`); no existe pantalla ni endpoint para editar auditoría; revertir un cambio produce otro evento. | 0 permisos de modificación en roles de base de aplicación. | Prueba de permisos del usuario de base. | BASE §54; DFA M1 (auditoría inmutable) | Núcleo | O0 | Adoptado |
| RNF-NFR-113 | Evidencia de integridad: encadenamiento de hash por tenant (cada evento incluye el hash del anterior por partición diaria) y anclaje diario del hash final en almacenamiento WORM fuera de la base; verificación automática diaria y en cada restauración. | Verificación diaria sin rupturas; alerta SEV2 si se detecta una. | Job `nfr:verificar-cadena-auditoria`; prueba que altera un evento y detecta la ruptura. | BASE §54 ("proteger contra modificación o borrado ordinario") | Estándar | O1 | Adoptado |
| RNF-NFR-114 | Auditoría de lecturas obligatoria para: datos de salud, datos bancarios completos, informes de acceso ARCO, exportaciones con datos personales, accesos de soporte de plataforma a un tenant, descarga de documentos de identidad y consultas a la bóveda; opcional configurable por tenant para el resto. | 100 % de lecturas alcanzadas auditadas. | Prueba de integración por categoría. | BASE §29, §54 ("puede agregarse según necesidad") | Núcleo | O1 | A validar (PA-NFR-16) |
| RNF-NFR-115 | Eventos de seguridad auditados: login exitoso y fallido, MFA alta/baja/uso, recuperación iniciada/completada, cambio de contraseña, emisión y revocación de tokens de API, cambios de roles y alcance, accesos de soporte, denegaciones de autorización y **cada intento de acceso cruzado entre tenants** (además genera alerta). | 100 % de tipos cubiertos. | Suite de seguridad verifica cada evento. | BASE §60 (CU-SEG-01); RN-09 §4.3 (`AUDITO`) | Núcleo | O1 | Adoptado |
| RNF-NFR-116 | Conservación de auditoría según PRM-NFR-042/043, con archivo en frío consultable bajo pedido en ≤ 48 h. | Recuperación de un evento archivado de hace 3 años en ≤ 48 h. | Simulacro anual. | BASE §54 (retención y archivo a definir) | Estándar | O1 | A validar (PA-NFR-06) |
| RNF-NFR-117 | Consulta de auditoría: por objeto, actor, rango de fechas y tipo, p95 ≤ 2 s sobre los últimos 90 días y ≤ 10 s sobre 2 años; exportación sujeta a permiso y auditada; un tenant nunca ve eventos de otro (CU-GOB-01). | Metas cumplidas en tenant grande. | k6 `audit-query`; prueba de aislamiento. | BASE §54 | Núcleo | O1 | Adoptado |
| RNF-NFR-118 | Sin secretos en auditoría: contraseñas, tokens, claves, semillas y certificados nunca se guardan como valores anteriores/posteriores (se registra "valor cambiado" y huella); datos sensibles se guardan cifrados o enmascarados según su clasificación. | 0 secretos en `auditLogs` (escaneo con patrones). | Job semanal de escaneo de patrones de secretos sobre muestras. | BASE §29, §54 | Núcleo | O0 | Adoptado |
| RNF-NFR-119 | Correlación extremo a extremo: todo evento de auditoría, log, traza, evento de outbox, job y llamada a integración comparte `requestId` o `correlationId` y `traceId`, de modo que un cambio en una factura se sigue desde el clic hasta ARCA y el asiento. | 100 % de eventos con `correlationId`. | Prueba e2e del piloto (escenario 71) reconstruye la cadena. | BASE §54 ("identificador de ejecución o correlación"); AGR-016 | Núcleo | O0 | Adoptado |

### 11.2 Logs estructurados

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-120 | Logs JSON en una línea (`packages/shared/logger`) con campos obligatorios: `ts` (ISO 8601 UTC), `level`, `service` (`api`/`worker`/`scheduler`), `env`, `version`, `tenantId` (o `PLATFORM`), `requestId`, `traceId`, `spanId`, `userId` o `actorType`+`actorId` técnico, `route`, `method`, `status`, `durationMs`; en jobs: `jobName`, `jobId`, `attempt`; en eventos: `eventType`, `eventId`; en integraciones: `connector`, `externalRequestId`. Sin `console.log` en código productivo. | 100 % de líneas válidas contra el esquema de log. | Test que valida muestras de logs; lint que prohíbe `console.*`. | CNX §2.1 (`morgan`), §2.6 (`requestId`) | Núcleo | O0 | Adoptado |
| RNF-NFR-121 | Redacción automática: encabezados `authorization`, `cookie`, `set-cookie`, `x-api-key`, `idempotency-key` (se registra hash); campos `password`, `token`, `secret`, `otp`, `cbu`, `cardNumber`, `cvv`, `certificate`, `privateKey`; cuerpos de pasarelas y de ARCA solo con campos permitidos; DNI/CUIT/teléfono/correo enmascarados (últimos 3 caracteres); nunca datos de salud. | 0 coincidencias en el escáner de patrones de secretos y PII sobre logs. | Prueba unitaria del redactor con corpus; escaneo diario de una muestra de logs. | RN-13 §17 (log de Pagos360); RN-09 §4.3 | Núcleo | O0 | Adoptado |
| RNF-NFR-122 | Niveles y volumen: `info` por request y por paso de job, `warn` para condiciones recuperables, `error` con `errorCode` y stack solo en log (no en respuesta); `debug` deshabilitado en producción salvo activación temporal por tenant ≤ 1 h auditada. Retención según PRM-NFR-044. | Volumen ≤ 2 KB promedio por request. | Medición en staging. | — | Estándar | O0 | Adoptado |

### 11.3 Métricas, trazas y RUM

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-123 | Propagación de contexto W3C Trace Context (`traceparent`, `tracestate`) y `baggage` con `tenantId` desde el front hasta la API, al outbox (guardado en el evento), a los jobs BullMQ (en los datos del job) y a las llamadas salientes. | 100 % de jobs y eventos con `traceparent`. | Prueba de integración que sigue una traza front → API → outbox → worker → conector simulado. | DEC-003 | Núcleo | O0 | Adoptado |
| RNF-NFR-124 | Métricas técnicas RED por ruta (tasa, errores, duración en histogramas) y USE por recurso (CPU, memoria, event loop lag, pool de conexiones Mongo, memoria Redis, profundidad y antigüedad de colas, lag de replicación). Exposición OpenTelemetry/Prometheus. | Event loop lag p99 ≤ 100 ms; lag de replicación ≤ 10 s. | Tablero de plataforma con todas las series. | BASE §97.8 (observabilidad por tenant y proceso) | Núcleo | O0 | Adoptado |
| RNF-NFR-125 | Métricas de proceso y negocio por tenant: lotes en curso, duración y throughput; comprobantes autorizados/rechazados/observados por ARCA; latencia de ARCA; pagos confirmados, pendientes e inciertos por canal; webhooks recibidos/rechazados; mensajes enviados/fallidos por canal; sincronizaciones offline y conflictos; importaciones con error; jobs fallidos; solicitudes ARCO por estado. | Todas las series visibles en el tablero del tenant (RF-NFR-017). | Prueba de tablero con datos sintéticos. | BASE §54 (vista plataforma/tenant) | Núcleo | O1 | Adoptado |
| RNF-NFR-126 | Control de cardinalidad: `tenantId` como etiqueta solo en métricas de proceso y SLI agregados (no en histogramas por ruta); nunca `userId`, `personId` ni identificadores de documento como etiqueta. | ≤ 50.000 series activas por entorno en el perfil de diseño. | Alerta de cardinalidad en el backend de métricas. | — | Estándar | O0 | Adoptado |
| RNF-NFR-127 | Trazas OpenTelemetry con autoinstrumentación de HTTP, Express, MongoDB, ioredis y BullMQ, más spans manuales en motor tarifario, emisión fiscal, imputación, conectores y sincronización; atributos sin datos personales. | 100 % de requests con traza raíz; spans de Mongo sin valores de filtros. | Inspección automatizada de atributos en CI de integración. | — | Núcleo | O0 | Adoptado |
| RNF-NFR-128 | Muestreo: 100 % de trazas con error o latencia > p99, 100 % de jobs de lote (traza por chunk), 10 % del resto (muestreo de cola en el collector); configurable por tenant temporalmente para diagnóstico. | Costo de trazas acotado; trazas de error siempre disponibles. | Prueba con errores inyectados: 100 % muestreados. | — | Estándar | O0 | Adoptado |
| RNF-NFR-129 | RUM del front (admin y PWA): Web Vitals (LCP, INP, CLS), errores JS y tiempo de llamadas API, enviados al backend propio sin cookies, sin datos personales y con `tenantId` y versión de app. | Percentil 75 de Web Vitals por app y tenant en el tablero. | Prueba e2e que verifica el envío. | RNF-NFR-008 | Estándar | O1 | Adoptado |
| RNF-NFR-130 | Health checks: `/livez` (proceso vivo), `/readyz` (Mongo, Redis, KMS alcanzables; migraciones aplicadas), `/version`; sin datos sensibles ni detalle de dependencias para llamadas no autenticadas. | Orquestador retira una réplica no lista en ≤ 30 s. | Prueba de despliegue con Mongo inaccesible. | — | Núcleo | O0 | Adoptado |

### 11.4 Alertas, guardia y tableros

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-131 | Alertas por consumo del presupuesto de error de los SLO (multiventana: 14,4× en 1 h y 5 min → SEV1/página; 6× en 6 h y 30 min → SEV2; 1× en 3 días → ticket). | 100 % de SLO de `sloDefinitions` con regla de burn rate. | Prueba de regla con datos sintéticos. | BASE §54 GOB-003 | Núcleo | O1 | Adoptado |
| RNF-NFR-132 | Catálogo de alertas técnicas mínimas: tasa 5xx > 2 % en 5 min; p95 de ruta crítica > 2× meta en 10 min; cola con trabajo más antiguo > 15 min (`critical` > 2 min); job fallido tras último reintento; lag de outbox > 60 s; rechazos ARCA > 5 % en 15 min o latencia ARCA > 5 s p95; webhook con firma inválida > 10 en 5 min; backup fallido o ausente; verificación de cadena de auditoría fallida; referencias rotas nuevas informadas por el verificador de integridad referencial (RNF-NFR-260, DEC-100); disco/almacenamiento > 80 %; lag de replicación > 10 s; certificado por vencer (RNF-NFR-071); crecimiento anómalo de 429. Cada alerta con severidad, destinatario, deduplicación, runbook y vínculo al objeto. | 100 % de alertas con runbook enlazado. | Revisión de `alertRules`; simulacro trimestral de disparo. | BASE §54 GOB-003; RN-09 §5.6 | Núcleo | O1 | Adoptado |
| RNF-NFR-133 | Alertas de seguridad: intento de acceso cruzado entre tenants (SEV2 inmediata), pico de logins fallidos por IP/tenant, uso de un refresh revocado, alta de rol administrador, acceso de soporte a un tenant (aviso al tenant), lectura masiva de datos personales (umbral por rol), exportaciones fuera de horario configurado, violaciones CSP nuevas, archivo infectado, cambios en la bóveda. | Tiempo de detección ≤ 5 min. | Simulacro trimestral (red team ligero). | BASE §60 ("monitoreo de eventos y respuesta a incidentes") | Núcleo | O1 | Adoptado |
| RNF-NFR-134 | Guardia y tiempos de respuesta: SEV1 (indisponibilidad o fuga en curso) reconocimiento ≤ 15 min 24×7, mitigación objetivo ≤ 4 h; SEV2 (degradación grave o proceso crítico detenido) ≤ 30 min 24×7; SEV3 ≤ 4 h hábiles; SEV4 ≤ 2 días hábiles; post-mortem obligatorio para SEV1/SEV2. | ≥ 95 % de alertas reconocidas dentro del plazo por mes. | Indicador IND-NFR-05. | BASE §64.5 (soporte con seguimiento) | Núcleo | O1 | Adoptado (DEC-063) |
| RNF-NFR-135 | Tablero de salud de plataforma (RF-NFR-016): SLO y presupuesto de error, disponibilidad por servicio, latencias, colas, jobs, integraciones por conector, backups y simulacros, certificados, vulnerabilidades abiertas, consumo por tenant (top 10), incidentes; sin datos personales ni contables de los tenants (BASE §54). | Actualización ≤ 60 s. | Revisión funcional y de permisos. | BASE §54 GOB-001 | Núcleo | O1 | Adoptado |
| RNF-NFR-136 | Tablero de salud del tenant (RF-NFR-017): procesos y lotes, emisión fiscal, cobranzas e inciertos, conectores y credenciales, cuotas, incidentes que lo afectan, solicitudes ARCO por vencer; sin datos de otro tenant (escenario 43). | Actualización ≤ 60 s; prueba de aislamiento. | Prueba e2e con dos tenants. | BASE §54 GOB-002; §34 esc. 43 | Núcleo | O1 | Adoptado |
| RNF-NFR-137 | Monitoreo sintético de recorridos críticos cada 5 min con tenant de prueba en producción aislado (no facturable, sin emisión real): login, consulta de factura, inicio de pago en sandbox, creación de reclamo. | Detección de rotura de recorrido ≤ 10 min. | Sondas configuradas y alertas. | BASE §64.5 | Estándar | O2 | Adoptado |
| RNF-NFR-138 | Sincronización de reloj (NTP) en todos los nodos con desvío ≤ 100 ms; la hora de negocio siempre del servidor (RN-NFR-018); la hora del dispositivo de campo se guarda como dato declarado junto a la hora de recepción. | Alerta si desvío > 500 ms. | Métrica de desvío por nodo. | RN-09 §5.2; AGR-025 | Núcleo | O0 | Adoptado |
| RNF-NFR-139 | Los proveedores de observabilidad (logs, métricas, trazas, errores) son subencargados: reciben solo datos redactados, se registran en RF-NFR-013 y cumplen la región/garantías de PA-NFR-05. | 0 datos personales en telemetría exportada (muestreo semanal). | Escaneo de muestras. | BASE §97.1 (subencargados) | Núcleo | O0 | Adoptado |

## 12. Calidad, pruebas, CI/CD, ambientes y versionado de API

### 12.1 Estrategia de pruebas (obligatoria en CI)

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-140 | Pirámide de pruebas obligatoria por PR: unitarias, integración con Mongo y Redis reales, contrato, aislamiento multitenant, permisos negativos, seguridad estática y e2e de humo; nocturnas: e2e completo, fuzzing, DAST de línea base, accesibilidad; semanales/por ola: carga, resistencia, caos y restauración. | Un PR no se fusiona sin todas las etapas obligatorias en verde. | Reglas de protección de rama (RNF-NFR-166). | AGR-035; BASE §34 | Núcleo | O0 | Adoptado |
| RNF-NFR-141 | Pruebas unitarias: backend con `node --test` (como CNX) y cobertura con c8; front y paquetes compartidos con Vitest + Vue Test Utils; la lógica pura vive en `lib/` (CNX §2.2) y se prueba sin red. | Suite unitaria completa ≤ 5 min. | Tiempo medido en CI. | CNX §2.1, §2.2 | Núcleo | O0 | Adoptado |
| RNF-NFR-142 | Pruebas de integración contra **MongoDB 7 real en replica set** (contenedor o binario real; no mocks de Mongoose) para poder probar transacciones, índices únicos, `explain` y el plugin de tenancy; Redis real para BullMQ y rate limit; almacenamiento S3-compatible local; antivirus en contenedor. | 100 % de repositorios y servicios con pruebas de integración; 0 mocks de base en pruebas de integración. | Revisión de la configuración de CI; lint que prohíbe mocks del driver en `*.int.test.js`. | DEC-001 (replica set, transacciones) | Núcleo | O0 | Adoptado |
| RNF-NFR-143 | Pruebas de contrato: OpenAPI generado desde los esquemas Zod (`zod-to-openapi` o equivalente) y verificado en cada PR (cambios incompatibles detectados con diff semántico); front y back comparten esquemas; conectores (T06) probados contra contratos grabados del proveedor y, en nocturno, contra homologación/sandbox (ARCA homologación, pasarelas sandbox); esquemas de eventos validados por productor y consumidor. | 0 cambios incompatibles no versionados (RNF-NFR-175). | Gate de diff de OpenAPI y de esquemas de eventos. | CNX §2.2 (`contracts/`); BASE §59 | Núcleo | O0 | Adoptado |
| RNF-NFR-144 | E2E con Playwright: recorridos críticos por ola sobre admin y PWA en Chromium, Firefox y WebKit + emulación móvil (Android gama baja y iPhone); humo (≤ 10 min) por PR; completo nocturno; verificación de CSP, tokens fuera del almacenamiento web y accesibilidad (axe) dentro de los mismos recorridos. Recorrido obligatorio del piloto Internet (escenario 37) desde O6. | Tasa de éxito ≥ 99 % en nocturno sin reintentos. | Informe Playwright adjunto a la evidencia de liberación. | AGR-035; BASE §34 esc. 37 | Núcleo | O0 | Adoptado |
| RNF-NFR-145 | Pruebas de carga con k6 (CNX §2.1) por escenario del perfil de referencia (sección 7): `read-by-id`, `list-paginated`, `search`, `write-simple`, `cash-payment`, `account-360`, `dashboards`, `bi-extract`, `audit-query`, `spike-2x`, y benchs de workers (`fac:emitir-lote`, importaciones, mora). Obligatorias antes de cerrar O0 (línea base), O4, O5, O6, O7 y O11, y semanalmente en staging desde O4. | Metas de RNF-NFR-001 a 029 cumplidas; regresión > 20 % respecto a la última línea base bloquea la liberación. | Resultados k6 en `qualityEvidence`. | AGR-020; BASE §97.8 | Núcleo | O0 | Adoptado |
| RNF-NFR-146 | Pruebas de resistencia (8 h al 70 % del pico sin fugas de memoria ni degradación > 10 %) y de caos (caída de worker, de primario de Mongo, de Redis, conector lento o caído, latencia de red) por ola económica. | Memoria estable (± 10 %) en 8 h; metas de reanudación cumplidas. | Informe de caos en evidencia. | AGR-016, AGR-019 | Estándar | O4 | Adoptado |
| RNF-NFR-147 | Pruebas de seguridad en CI: SAST y secret scanning por PR (RNF-NFR-094), SCA por PR (RNF-NFR-092), suite de inyección NoSQL/SSRF/XSS/uploads/CORS/headers por PR, fuzzing desde OpenAPI nocturno, DAST de línea base por liberación (RNF-NFR-095), batería adversarial de IA (RNF-NFR-098). | 0 hallazgos altos abiertos al liberar. | Gates del pipeline. | BASE §60 | Núcleo | O0 | Adoptado |
| RNF-NFR-148 | **Pruebas de aislamiento multitenant obligatorias en CI**: una suite genérica recorre el registro de rutas (`admin`, socio, `platform`, `public`, `ext`) y para cada una crea datos en TEN-001 y TEN-002 con el mismo código interno, y verifica que un usuario/token de TEN-002 **no** puede listar, leer, buscar, modificar, anular, exportar, descargar archivos ni disparar jobs sobre TEN-001 (respuesta 404/403 y sin efectos); incluye webhooks, sincronización offline, URLs firmadas, eventos y jobs (un job de TEN-002 no lee documentos de TEN-001). Una ruta nueva sin caso de aislamiento hace fallar el build. | **100 %** de rutas y jobs cubiertos; 0 fugas. | Informe de cobertura de la suite de aislamiento en cada PR. | BASE §34 esc. 16, 19, 21, 26, 29, 43, 45, 52, 56, 82, 86; DEC-002 | Núcleo | O0 | Adoptado |
| RNF-NFR-149 | Pruebas del plugin de tenancy y de índices: toda consulta, `aggregate` (primera etapa `$match` con `tenantId`), `update`, `delete`, `bulkWrite` y `countDocuments` sin `tenantId` lanza error; script de CI verifica que todos los índices compuestos de colecciones de negocio empiezan por `tenantId` y que las colecciones globales están en una lista blanca explícita. | 0 índices fuera de convención; 0 consultas sin tenant. | Test unitario del plugin + script `check-indexes`. | DEC-002 | Núcleo | O0 | Adoptado |
| RNF-NFR-150 | Matriz de permisos negativos: para cada capability, un usuario sin ella recibe 403 y no produce efectos; un usuario con la capability pero fuera de alcance (otra sucursal/zona) tampoco; un administrador de tenant no puede asignarse capabilities de plataforma (escenario 17); una pantalla visible no habilita acciones no permitidas (escenario 30). | 100 % de capabilities con caso negativo. | Suite generada desde el catálogo de capabilities (T02). | BASE §29 (CU-29), §34 esc. 17, 18, 20, 30 | Núcleo | O1 | Adoptado |
| RNF-NFR-151 | Pruebas de interrupción y reintento: cada job y cada operación económica tiene prueba de "falla a mitad y reintenta" (sin duplicados), de doble envío del mismo `Idempotency-Key` y de doble webhook (escenarios 6, 7, 8, 50, 59, 70). | 100 % de jobs y rutas económicas cubiertos. | Suite de idempotencia en CI de integración. | AGR-016, AGR-035 | Núcleo | O0 | Adoptado |
| RNF-NFR-152 | Pruebas basadas en propiedades (fast-check) para `money`, prorrateos, distribuciones, intereses, redondeos y fechas de negocio: invariantes "suma de partes = total", "no se crea ni se pierde un centavo", "resultado independiente del orden", "misma entrada, misma salida", "cálculo independiente del huso horario del servidor". | ≥ 10.000 casos por propiedad en nocturno. | Suite de propiedades. | AGR-011, AGR-017 | Núcleo | O0 | Adoptado |
| RNF-NFR-153 | Regresión de cálculo con conjuntos dorados: casos tarifarios, fiscales y de mora con resultado aprobado; desde O11, comparación factura por factura con ProCoop en paralelo (cantidades, importes por concepto, impuestos y vencimientos; toda diferencia explicada — DFA §33). | 0 diferencias no explicadas en el conjunto dorado. | Job de comparación con informe (T07). | DFA §33; BASE §34 esc. 5 | Núcleo | O4 | Adoptado |
| RNF-NFR-154 | Pruebas de migración repetibles (T07): ensayos completos con conciliación de socios, contratos, equipos, saldos y fondos; los ensayos usan copias de ProCoop tratadas en ambiente aislado autorizado por la cooperativa, nunca en ambientes compartidos de desarrollo. | Conciliación 100 % o diferencias aprobadas. | Informe de ensayo. | AGR-018; BASE §34 esc. 14 | Núcleo | O7 (DEC-089; antes O11) | A validar (PA-NFR-19) |
| RNF-NFR-155 | Accesibilidad automatizada con axe-core dentro de Playwright: 0 violaciones `serious` o `critical` en recorridos esenciales (referencia T03). | 0 violaciones en PR. | Informe axe. | AGR-032 | Núcleo | O0 | Adoptado |
| RNF-NFR-156 | Pruebas offline y de conflicto: emulación sin red, red intermitente y cierre de la app durante la cola; conflicto ESC-03 (orden modificada mientras el técnico estaba offline) y reserva simultánea (escenario 36). | Casos ESC-03 y escenario 36 en verde. | Suite Playwright offline. | AGR-025; CNX §3.7 | Núcleo | O3 | Adoptado |
| RNF-NFR-157 | Pruebas de restauración automáticas mensuales (RNF-NFR-043) con verificación de conteos, hashes de auditoría, reaplicación de supresiones (RNF-NFR-045) y conciliación externa simulada (RNF-NFR-044). | Simulacro mensual exitoso. | Registro en `restoreTests`. | AGR-019 | Núcleo | O1 | Adoptado |
| RNF-NFR-158 | Cobertura mínima de código: global líneas ≥ 80 % y ramas ≥ 70 %; `packages/shared/money`, `dates`, `crypto`, `idempotency`, plugin de tenancy, autorización, motor tarifario (M04), fiscal (M06), imputación (M07) y mora (M08): líneas ≥ 95 % y ramas ≥ 90 %; cobertura de líneas modificadas en el PR ≥ 85 %. La cobertura no reemplaza las suites obligatorias (aislamiento, permisos, idempotencia). | Umbrales aplicados como gate. | Informe c8/Vitest en CI. | AGR-035 | Núcleo | O0 | Adoptado |
| RNF-NFR-159 | Pruebas de mutación (Stryker) sobre `money`, motor tarifario, fiscal e imputación. | Puntaje de mutación ≥ 70 %. | Ejecución semanal con informe. | AGR-011 | Estándar | O4 | Adoptado |
| RNF-NFR-160 | Datos de prueba **ficticios**: fábricas en `packages/shared/testing` con generador determinista (semilla) de personas, domicilios, DNI y CUIT con dígito verificador válido dentro de rangos marcados como ficticios, CBU de prueba, teléfonos de rango reservado, correos en dominio de prueba (`@ejemplo.test`); flag `isFictitious` en tenants y personas de prueba; prohibido usar datos reales o de la DEMO de ProCoop. | 0 datos reales en repositorio, fixtures y ambientes no productivos (escaneo de patrones de DNI/CUIT reales conocidos y de dominios reales). | Revisión de fixtures en CI; política RN-NFR-014. | BASE §97.1; guía §2 (datos ficticios) | Núcleo | O0 | Adoptado |
| RNF-NFR-161 | Juego canónico de datos (AGR-035): dos tenants (TEN-001 "Cooperativa Ejemplo A", TEN-002 "Cooperativa Ejemplo B") con códigos internos iguales, titulares hermanos con domicilio compartido (escenarios 87, 88), socio con dos servicios (escenario 25), agrupación y separación (escenario 26), pagos excedentes (ESC-01), documento corregido (ESC-02), instalación offline en conflicto (ESC-03), restauración con operaciones externas (ESC-04), período parcialmente procesado (ESC-05), terminologías distintas Socio/Asociado (escenario 51). | Disponible desde O0 y ampliado por ola. | Script `seed:canonico` idempotente, bloqueado en producción. | AGR-035; BASE §34 | Núcleo | O0 | Adoptado |
| RNF-NFR-162 | Política de pruebas inestables: una prueba inestable se pone en cuarentena con ticket y responsable ≤ 24 h y se corrige o elimina en ≤ 7 días; las suites de aislamiento, permisos e idempotencia nunca se ponen en cuarentena. | ≤ 1 % de ejecuciones con reintentos. | Tablero de estabilidad de CI. | — | Estándar | O0 | Adoptado |
| RNF-NFR-163 | Trazabilidad pruebas ↔ requisitos: cada caso de prueba declara los IDs RF/RN/RNF/CU/ESC que verifica (etiqueta en el título o anotación); el informe de liberación lista cobertura por requisito de la ola. | 100 % de requisitos `Núcleo` de la ola con al menos una prueba. | Informe generado en CI. | AGR-035 ("vincular pruebas con requisitos") | Núcleo | O0 | Adoptado |

### 12.2 CI/CD y ambientes

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-164 | Pipeline de CI por PR: instalación reproducible → lint/formato → chequeos estáticos (SAST, secretos, SCA, licencias) → unitarias → integración (Mongo/Redis reales) → aislamiento y permisos → contrato (OpenAPI, eventos) → build de imágenes → escaneo de imágenes y SBOM → e2e de humo → informe. | Duración p50 ≤ 15 min, p95 ≤ 25 min. | Métricas del CI. | CNX §2.8 (GitHub Actions) | Núcleo | O0 | Adoptado |
| RNF-NFR-165 | Gates de promoción: `main` → staging automático; staging → producción con evidencia completa (RF-NFR-022), DAST de línea base sin altos, e2e completo verde, pruebas de carga cuando la ola lo exige, aprobación del responsable de la liberación; cualquier fallo relevante impide promover (AGR-035). | 0 promociones sin evidencia. | Registro en `qualityEvidence`. | AGR-035 | Núcleo | O0 | Adoptado |
| RNF-NFR-166 | Protección de ramas: `main` protegida, PR obligatorio, ≥ 1 revisión (≥ 2 y del dueño de código para `packages/shared/*`, tenancy, autorización, bóveda, pagos, fiscal e IaC), commits firmados, sin push forzado, historial lineal. | 100 % de cambios a `main` vía PR revisado. | Configuración del repositorio auditada trimestralmente. | — | Núcleo | O0 | Adoptado |
| RNF-NFR-167 | Despliegue con imágenes inmutables y firmadas desde un registro, estrategia rolling o blue-green, verificación de salud y sondas sintéticas tras el despliegue y **rollback automático o manual ≤ 15 min**; se reemplaza el autodeploy por SSH con `git reset --hard` y `docker compose build` en el servidor (CNX §2.8). | Rollback probado en cada ola. | Simulacro de rollback en staging. | CNX §2.8; RN-NFR-023 | Núcleo | O0 | Adoptado |
| RNF-NFR-168 | Migraciones de esquema y datos versionadas, idempotentes y ejecutadas como paso del despliegue (no al primer login — RN-NFR-022), con patrón expandir/contraer (la versión N y N−1 del código conviven con el esquema), reanudables y con tiempo máximo por paso; migraciones de datos masivas como jobs con progreso. | 0 despliegues con indisponibilidad por migración. | Prueba de despliegue N−1 → N con tráfico. | RN-09 §5.7, §7.9 | Núcleo | O0 | Adoptado |
| RNF-NFR-169 | Feature flags por tenant y por porcentaje para habilitar funcionalidades de forma gradual (piloto primero), con registro auditado y limpieza de flags ≤ 90 días tras habilitación general. | 0 flags vencidos > 90 días. | Reporte de flags. | DEC-005 (piloto) | Estándar | O0 | Adoptado |
| RNF-NFR-170 | Ambientes (detalle en T01): `local` (desarrollo con datos ficticios), `ci` (efímero por PR), `staging` (preproducción con datos sintéticos de volumen de referencia e integraciones en homologación), `demo` (precarga de demostración, sin datos reales, aislado), `production`; cuentas de nube separadas para producción; no producción no tiene rutas de red hacia producción. | 5 ambientes definidos por IaC. | Revisión IaC. | BASE §97.9; AGR-035 | Núcleo | O0 | Adoptado |
| RNF-NFR-171 | Infraestructura como código para todo recurso (red, cómputo, bases, colas, buckets, KMS, WAF, DNS, alertas), revisada por PR y con detección de deriva semanal. | 0 recursos productivos creados manualmente. | Informe de deriva. | DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-172 | Versionado y notas de liberación: versión semántica por liberación, changelog generado, notas para cooperativas en lenguaje funcional (qué cambia, si requiere acción, fecha de efecto), aviso ≥ 7 días antes de cambios visibles relevantes y ≥ 30 días para cambios de comportamiento de cálculo o de API externa. | 100 % de liberaciones con notas. | Revisión en evidencias. | BASE §64.5 (gestión de actualizaciones) | Estándar | O1 | Adoptado |
| RNF-NFR-173 | Métricas de entrega (DORA) medidas y publicadas en el tablero de plataforma: frecuencia de despliegue (meta ≥ semanal), tiempo de entrega de cambios (≤ 2 días), tasa de cambios fallidos (≤ 15 %), tiempo de restauración tras un despliegue fallido (≤ 1 h). | Metas trimestrales. | Tablero. | — | Extensión | O1 | Adoptado |

### 12.3 Versionado de API y compatibilidad

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-174 | APIs internas (`/api/...`, `/api/admin/...`, `/api/platform/...`) sin versión en la ruta pero compatibles con la versión N−1 del front durante ≥ 14 días (PWA con caché); el front envía `X-App-Version`; si es menor que la mínima soportada, el API responde 426 problem+json y la PWA fuerza la actualización del service worker con aviso no destructivo (sin perder la cola offline). | 0 errores por incompatibilidad front/back en despliegues. | Prueba e2e con front N−1 contra API N. | CNX §2.1 (`vite-plugin-pwa` `autoUpdate`) | Núcleo | O0 | Adoptado |
| RNF-NFR-175 | API externa versionada en ruta (`/api/v1/ext/...`): dentro de una versión mayor solo cambios aditivos (campos opcionales nuevos, recursos nuevos); un cambio incompatible exige `v2`; la versión anterior se soporta ≥ 12 meses desde la publicación de la nueva; las claves de contrato no cambian aunque el tenant personalice etiquetas (BASE §59, escenario 54). | 0 cambios incompatibles dentro de una versión (diff de OpenAPI). | Gate de diff de contrato. | BASE §59 | Núcleo | O11 | A validar (PA-NFR-18) |
| RNF-NFR-176 | Deprecación anunciada: encabezados `Deprecation` y `Sunset` (RFC 8594) y enlace a la guía de migración; aviso a los clientes registrados del tenant ≥ 6 meses antes del retiro; métricas de uso por versión y cliente. | 100 % de versiones deprecadas con `Sunset`. | Prueba de contrato de encabezados. | BASE §59 (documentar versiones) | Estándar | O11 | Adoptado |
| RNF-NFR-177 | Documentación publicada de la API externa (OpenAPI 3.1) con esquemas, filtros, paginación, fechas y zonas horarias, estados, significado de importes (cadena decimal, moneda), códigos de error, límites y ejemplos ficticios; inventario de datos disponibles y restricciones. | Documentación generada en cada liberación y validada. | Validación del OpenAPI en CI. | BASE §59 | Estándar | O11 | Adoptado |
| RNF-NFR-178 | Esquemas de eventos versionados (`schemaVersion` en cada evento de outbox), con compatibilidad hacia atrás para consumidores; un cambio incompatible crea un tipo de evento nuevo o una versión mayor con período de doble publicación. | 0 consumidores rotos por cambio de evento. | Prueba de contrato de eventos (RNF-NFR-143). | DEC-003; guía §5 (eventos) | Núcleo | O0 | Adoptado |
| RNF-NFR-179 | Compatibilidad de datos históricos: los documentos guardan `schemaVersion`; el código lee todas las versiones vigentes en la base (o se migran en job) y los cálculos históricos se reproducen con la versión de reglas y tarifas aplicada en su momento (escenario 5). | Reproducción de una liquidación de 24 meses atrás idéntica al original. | Prueba con conjunto dorado histórico. | BASE §34 esc. 5; AGR-009 | Núcleo | O4 | Adoptado |

## 13. Compatibilidad, offline PWA, accesibilidad e internacionalización

### 13.1 Accesibilidad (referencia a T03)

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-180 | Objetivo **WCAG 2.2 nivel AA** para landing, PWA (socio, empleado, campo) y admin; componentes, foco, teclado, etiquetas, mensajes de error y alternativas al mapa y a gestos definidos en T03. Se tiene en cuenta la Ley 26.653 de accesibilidad web para prestadores de servicios públicos [VERIFICAR alcance para cooperativas]. No se declara conformidad sin verificación (AGR-032). | 0 violaciones `serious`/`critical` de axe (RNF-NFR-155); 100 % de recorridos esenciales operables solo con teclado. | Automatizado + auditoría manual (RNF-NFR-181). | AGR-032; BASE §97.8 (accesibilidad) | Núcleo | O0 | Adoptado |
| RNF-NFR-181 | Auditoría manual por ola de los recorridos esenciales con teclado y lectores de pantalla (NVDA en escritorio, TalkBack en Android, VoiceOver en iOS), zoom 200 % y reflujo a 320 px. | Informe por ola sin bloqueantes. | Informe en evidencia de liberación. | AGR-032 | Estándar | O2 | Adoptado |
| RNF-NFR-182 | Branding del tenant accesible: al publicar colores de marca, el sistema calcula contraste (texto ≥ 4,5:1, texto grande y componentes ≥ 3:1) sobre los tokens CNX y bloquea la publicación o ajusta automáticamente; textos largos del diccionario no rompen el layout (prueba con +50 % de longitud). | 0 combinaciones publicadas por debajo del umbral. | Prueba unitaria del validador de marca y prueba visual con textos largos. | AGR-032; BASE §65 | Núcleo | O1 | Adoptado |

### 13.2 Navegadores y dispositivos

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-183 | Navegadores soportados: las 2 últimas versiones mayores de Chrome, Edge, Firefox y Safari (macOS e iOS) y Samsung Internet; Chrome/WebView en Android ≥ 9; Safari en iOS/iPadOS ≥ 16.4 (requisito de push web en PWA instalada). Sin soporte para Internet Explorer. Navegador no soportado: aviso con alternativa, sin bloquear la consulta de facturas ni el pago. | Matriz Playwright en verde (Chromium, Firefox, WebKit) + prueba manual por ola en dispositivos reales de referencia. | Informe de compatibilidad por ola. | BASE §97.8 | Núcleo | O0 | A validar (PA-NFR-13) |
| RNF-NFR-184 | Resoluciones: PWA desde 360 × 640 px (y reflujo a 320 px) en vertical, apaisado en tablet; admin optimizado ≥ 1280 × 720 y usable desde 1024 px; impresión de comprobantes y reportes en A4 (y ticket térmico de 80 mm para caja cuando se use impresora local vía agente, M07/M10). | Sin desbordes horizontales en las resoluciones mínimas. | Pruebas visuales Playwright por resolución. | CNX §3, §4 | Núcleo | O0 | Adoptado |
| RNF-NFR-185 | Gama baja y conectividad: PWA funcional en dispositivo de referencia de 2 GB de RAM con Android 9 y red 3G/4G lenta; imágenes responsivas (WebP/AVIF), carga diferida, sin animaciones costosas; modo "datos reducidos" que evita descargar imágenes del muro. | Metas de RNF-NFR-008 en el dispositivo de referencia. | Lighthouse con perfil de gama baja; prueba en dispositivo real por ola. | BASE §97.8 (celulares de gama baja) | Núcleo | O0 | Adoptado |

### 13.3 Offline PWA

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-186 | PWA instalable con manifest dinámico por tenant (nombre, íconos, colores), service worker Workbox que precachea el app shell; `/api` y descargas de documentos con estrategia NetworkOnly (los datos no se cachean por HTTP — CNX §3.7); actualización con aviso y sin perder la cola offline. | App shell disponible sin red tras la primera visita. | Prueba Playwright offline. | CNX §3.2, §3.7 | Núcleo | O0 | Adoptado |
| RNF-NFR-187 | Motor único de cola offline en IndexedDB para todos los dominios (lecturas, órdenes, cortes y reconexiones, inspecciones, firmas, fotos), con `clientMutationId` (UUIDv7) por mutación, envío por lotes a `/sync` con resultado por ítem, reintento automático al volver la red y botón "Reintentar" en el banner único; se reemplazan las 5 colas en `localStorage` de Connectia. | 1 sola implementación de cola en el código; 0 usos de `localStorage` para datos de negocio. | Lint y prueba de integración. | CNX §3.7 (MEJORAR) | Núcleo | O3 | Adoptado |
| RNF-NFR-188 | Capacidad offline de la app de campo: ≥ 7 días de trabajo sin conexión; ≥ 1.000 tareas descargadas (lecturas/órdenes) y ≥ 300 fotos comprimidas por dispositivo; aviso cuando el almacenamiento disponible baja del 20 % o cuando la cola supera 48 h sin sincronizar. | Prueba con 1.000 tareas y 300 fotos en dispositivo de referencia. | Prueba en dispositivo real. | CNX §3.7; AGR-025 | Núcleo | O3 | Adoptado |
| RNF-NFR-189 | Seguridad de datos offline: solo se descargan los datos necesarios de las tareas asignadas (minimización); datos cacheados con vencimiento ≤ 7 días; borrado de datos locales al cerrar sesión, al revocar la sesión desde el servidor (en la próxima conexión) y al cambiar de usuario; evidencias sensibles (firma, foto de documento) cifradas con clave no exportable de WebCrypto ligada a la sesión; nunca se guardan tokens de larga duración en IndexedDB. | 0 datos de tareas no asignadas en el dispositivo. | Inspección automatizada de IndexedDB en Playwright. | BASE §97.1; CNX §3.7 | Núcleo | O3 | A validar (PA-NFR-14) |
| RNF-NFR-190 | Conflictos de sincronización: cada tarea descargada lleva versión; al sincronizar se conserva la evidencia de campo con su hora real de intervención y hora de recepción, se detecta el conflicto y se deriva a una bandeja con responsable; no se duplica salida de equipo, activación ni cargo, ni se borra lo realizado (ESC-03, escenario 70). | ESC-03 y escenario 70 en verde. | RNF-NFR-156. | AGR-025; ESC-03 | Núcleo | O3 | Adoptado |
| RNF-NFR-191 | Operaciones que no se encolan offline (CNX §3.7): login, administración, cobros y pagos, anulaciones, cambios de configuración y toda operación con riesgo de duplicado no idempotente; la PWA del socio sin conexión muestra el último estado consultado de "Mis servicios" y "Mis facturas" (metadatos, sin PDF) con la fecha de actualización, y no permite pagar. | Botones de esas operaciones deshabilitados sin red. | Prueba Playwright offline. | CNX §3.7 | Núcleo | O2 | Adoptado |

### 13.4 Internacionalización y formatos

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-192 | Idioma y diccionario: locale base `es-AR`; todo texto visible por clave `dict:<clave>` con texto base de respaldo (RN-NFR-027) y personalización por tenant (BASE §65); la estructura soporta otros locales aunque el alcance es solo `es-AR`; se reemplaza la cultura `es-ES` de ProCoop. | 0 textos fijos en componentes (lint de cadenas literales en plantillas). | Lint + prueba de claves faltantes (escenario 53). | BASE §65; RN-09 §5.2 | Núcleo | O0 | Adoptado |
| RNF-NFR-193 | Formatos numéricos y de moneda con `Intl` `es-AR`: separador de miles `.`, decimal `,`, importes `$ 1.234,56` con código `ARS` donde haya ambigüedad; fuente monoespaciada IBM Plex Mono para importes y lecturas; entrada de importes acepta coma decimal y valida contra la precisión del concepto; nunca se formatea con `Number.toFixed` sobre importes. | 100 % de importes formateados por `packages/shared/money`. | Prueba unitaria y lint. | CNX §4.1; guía §5 (dinero) | Núcleo | O0 | Adoptado |
| RNF-NFR-194 | Fechas y zonas horarias: instantes guardados en UTC; fechas de negocio (período, vencimiento, fecha efectiva, fecha de lectura) guardadas como fecha local `YYYY-MM-DD` con la zona del tenant (`America/Argentina/Cordoba` por defecto, configurable por tenant y sucursal); visualización `dd-mm-yyyy` y 24 h; cálculos con base de datos IANA y librería de `packages/shared/dates`; calendario de feriados nacionales, provinciales y locales del tenant para plazos hábiles; jobs programados en la zona del tenant. | Casos de fin de mes, bisiesto y cambio de hora (si Argentina lo reintroduce) producen el mismo resultado con el servidor en UTC, en `America/New_York` o en `Asia/Tokyo`. | Prueba de propiedades con `TZ` variable (RNF-NFR-152). | AGR-017; guía §5 (fechas) | Núcleo | O0 | Adoptado |
| RNF-NFR-195 | Búsqueda y orden en español: colación `{ locale: 'es', strength: 1 }` en índices y consultas de nombres y calles (insensible a mayúsculas y acentos), `Intl.Collator('es')` en el front; normalización de espacios y caracteres; calles homónimas acotadas por localidad/provincia (escenario 76). | Buscar "Garcia" encuentra "GARCÍA". | Prueba de integración. | BASE §34 esc. 76 | Núcleo | O2 | Adoptado |
| RNF-NFR-196 | Identificadores argentinos: validación de CUIT/CUIL (módulo 11) y DNI; teléfonos en E.164 (`+54`) con ayuda para el formato local; CBU/CVU con dígitos verificadores; código postal CPA cuando esté disponible. | 100 % de entradas validadas con mensajes por clave de diccionario. | Pruebas unitarias con casos válidos e inválidos ficticios. | BASE §34 esc. 60, 89 | Núcleo | O1 | Adoptado |
| RNF-NFR-197 | Multimoneda: todo importe lleva `currency` (`ARS` por defecto); operaciones en otra moneda (compras, deudas en USD) guardan moneda original, tipo de cambio, fuente y fecha; no se suman importes de distinta moneda sin conversión explícita. | Intento de sumar ARS + USD lanza error. | Prueba unitaria de `money`. | Guía §5 (dinero); M12, M14 | Estándar | O5 | Adoptado |
| RNF-NFR-198 | Codificación: UTF-8 en toda la plataforma; archivos de intercambio con entes, bancos y ARCA en la codificación, ancho fijo, separadores y fin de línea que exija cada especificación (por ejemplo ASCII/ISO-8859-1 sin acentos), con transliteración explícita y prueba contra archivos de muestra ficticios. | 0 rechazos por codificación en pruebas de contrato de archivos. | Pruebas de contrato de archivos (T06). | RN-13 (formatos Interbanking, entes) | Núcleo | O5 | Adoptado |
| RNF-NFR-199 | PDF y documentos generados (HTML + CSS renderizado con Chromium sin interfaz en workers dedicados, con validación PDF/A posterior, DEC-080; render aislado según DEC-092: contenedor propio sin privilegios y separado de la API, sin red de salida, plantillas, fuentes e imágenes inyectadas antes del render, JavaScript de la página deshabilitado, escritura solo en un directorio temporal por trabajo y límites de tiempo y memoria): fuentes embebidas con soporte completo de español, tamaño A4, legibles al imprimir en blanco y negro; código de barras y QR fiscal con tamaño y margen que permitan su lectura (M05/M06); documentos accesibles (PDF etiquetado) para comprobantes enviados al socio cuando la librería lo permita. | Lectura del QR y código de barras al 100 % en prueba de impresión. | Prueba de escaneo automatizada sobre PDF rasterizado. | BASE §97.2 | Estándar | O4 | Adoptado |

## 14. Exactitud monetaria, redondeos, concurrencia e idempotencia

### 14.1 Dinero y redondeo

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-200 | Infraestructura monetaria: `Decimal128` en Mongo y `decimal.js` en `packages/shared/money` como única forma de operar importes, tasas, alícuotas, precios unitarios y cantidades facturables; tipo `Money { amount, currency }` inmutable; Mongoose con getters/setters que devuelven `Decimal`. | 0 operaciones aritméticas sobre importes fuera de `money` (SAST, RNF-NFR-206). | Pruebas unitarias y regla SAST. | Guía §5; AGR-011 | Núcleo | O0 | Adoptado |
| RNF-NFR-201 | Serialización: en la API los importes viajan como **cadena decimal** (`"1234.56"`) con moneda, nunca como número JSON; el front los parsea con `money`; las exportaciones XLSX escriben el valor numérico con formato de 2 decimales a partir del decimal exacto. | 0 importes numéricos en OpenAPI (validación del esquema). | Prueba de contrato. | AGR-011 | Núcleo | O0 | Adoptado |
| RNF-NFR-202 | Precisión por concepto configurable (M04/M06): precios unitarios y tarifas hasta 6 decimales; cantidades (kWh, m³, minutos) hasta 4 decimales; tasas e índices hasta 8 decimales; importes de línea y totales a 2 decimales; la precisión se guarda en la versión del concepto. | Precisión declarada para el 100 % de conceptos. | Validación de catálogo. | Guía §5 (precisión por concepto); AGR-011 | Núcleo | O4 | Adoptado |
| RNF-NFR-203 | Redondeo explícito: cada concepto declara modo (`HALF_UP` por defecto, `HALF_EVEN`, `DOWN`, `UP`) y momento (por línea o por total); el IVA se calcula por alícuota sobre la suma de netos del comprobante (o por línea si M06 lo define para un régimen) de modo que neto + IVA + tributos = total exactamente y dentro de la tolerancia que valide ARCA; ningún redondeo implícito del lenguaje. | 0 rechazos ARCA por diferencias de redondeo en el conjunto dorado. | Conjunto dorado fiscal (RNF-NFR-153). | AGR-011; guía §5 | Núcleo | O4 | A validar (PA-NFR-21) |
| RNF-NFR-204 | Distribuciones y prorrateos (centros de costo, cuotas de plan de pago, prorrateo entre cuadros tarifarios, imputación parcial, conceptos de terceros en pagos parciales) con método de **mayor resto**: la suma de las partes es exactamente el total y el residuo se asigna de forma determinista y explicada (escenario 72). | Propiedad "suma de partes = total" en 10.000 casos. | RNF-NFR-152. | AGR-011; BASE §34 esc. 72; §97.4 | Núcleo | O4 | Adoptado |
| RNF-NFR-205 | Invariantes del saldo (AGR-011): el saldo comercial se deriva de movimientos e imputaciones válidos, nunca de campos editables; el resumen agrupado no es otra deuda (escenarios 27, 28, 74); todo ajuste tiene operación, causa, autor y contrapartida; existen controles cruzados documento ↔ auxiliar ↔ caja/banco ↔ contabilidad. | Job diario `nfr:verificar-invariantes` sin diferencias no explicadas. | RNF-NFR-229. | AGR-011; BASE §34 esc. 27, 28, 71, 74, 81 | Núcleo | O5 | Adoptado |
| RNF-NFR-206 | Prohibición técnica de `Number` para importes: regla SAST/ESLint que detecta aritmética, `parseFloat`, `toFixed`, `Math.round` sobre campos o variables de dominio monetario (`amount`, `importe`, `price`, `total`, `rate`, `balance`, `saldo`) fuera de `money`. | 0 hallazgos al fusionar. | Gate del pipeline. | Guía §5 | Núcleo | O0 | Adoptado |
| RNF-NFR-207 | Conversión de moneda con tipo de cambio de fuente declarada (por ejemplo BNA vendedor del día hábil anterior, según M14/M06), guardado en el documento; diferencias de cambio contabilizadas explícitamente (M15). | 100 % de documentos en moneda extranjera con tipo, fuente y fecha. | Prueba de integración. | RNF-NFR-197 | Estándar | O8 | Adoptado |
| RNF-NFR-208 | Cálculo de intereses, recargos y prorrateos por días con reglas deterministas declaradas (base 360/365/366, inclusión del día inicial y final, meses cortos, bisiestos, feriados) según M04/M08; mismo resultado reproducible en cualquier momento con la misma versión (AGR-017). | Conjunto dorado de fin de mes y bisiesto en verde. | RNF-NFR-152, RNF-NFR-153. | AGR-017; BASE §97.3 | Núcleo | O6 | Adoptado |
| RNF-NFR-209 | Tolerancias: interna 0 (sin diferencias de centavo); con terceros (ARCA, entes, bancos) solo la tolerancia que la especificación del tercero admita, registrada y explicada en la conciliación. | 0 diferencias internas; diferencias externas con explicación. | Informe de conciliación. | AGR-011 | Núcleo | O4 | Adoptado |

### 14.2 Concurrencia, transacciones e idempotencia

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-210 | Control optimista en todo documento de negocio: campo `version`; toda actualización condiciona `{ _id, tenantId, version }`; si no coincide devuelve **409** problem+json con la versión vigente y la UI ofrece recargar o comparar, sin pisar cambios ajenos. | 0 actualizaciones perdidas en prueba de concurrencia de 50 escrituras simultáneas al mismo documento. | Prueba de integración concurrente. | Guía §5 (`version`); RN-09 §4.3 (`BLOQUEO_FILAS`) | Núcleo | O0 | Adoptado |
| RNF-NFR-211 | Transacciones multi-documento (replica set) en toda operación que toque más de un documento económico (factura + ítems + cuenta corriente + asiento + auditoría + outbox), con `writeConcern: majority`, `readConcern: snapshot`, reintento automático ante `TransientTransactionError` y `UnknownTransactionCommitResult` (≤ 3 intentos) y duración ≤ 5 s (lotes se dividen en chunks). | 0 estados parciales en prueba de caos. | Prueba de integración con fallos inyectados. | DEC-001; CNX §10 (transacciones en operaciones contables) | Núcleo | O0 | Adoptado |
| RNF-NFR-212 | `Idempotency-Key` obligatorio (UUID generado por el cliente) en todo `POST`/`PATCH` económico o de integración (cobros, imputaciones, anulaciones, emisión, confirmaciones de pago, aprovisionamiento, envíos a entes) y en las rutas `/api/v1/ext` de escritura: se guarda `{ tenantId, key, route, actor, requestHash, status, response }` en `idempotencyKeys` por ≥ 24 h (≥ 30 días para pagos, PRM-NFR-070); repetir con el mismo cuerpo devuelve la misma respuesta; con cuerpo distinto devuelve 422; mientras la primera está en curso devuelve 409. | 100 % de rutas económicas exigen la clave (sin ella: 400). | Suite de idempotencia (RNF-NFR-151). | AGR-016; guía §5 (API) | Núcleo | O0 | Adoptado |
| RNF-NFR-213 | Claves naturales únicas como segunda barrera: índice único `{ tenantId, contractId, serviceId, period, documentType }` para obligaciones de un ciclo (escenario 59); `{ tenantId, provider, externalPaymentId }` para pagos; `{ tenantId, pointOfSale, voucherType, number }` para comprobantes; `{ tenantId, serialNumber }` para equipos serializados (escenario 66); `{ tenantId, resourceId, slotStart }` para turnos (escenario 36); `{ tenantId, deviceId, clientMutationId }` para mutaciones offline. | Inserción duplicada rechazada en el 100 % de pruebas. | Pruebas de integración por índice. | BASE §34 esc. 36, 59, 66, 70 | Núcleo | O0 | Adoptado |
| RNF-NFR-214 | Consumidores de eventos idempotentes: el outbox entrega al menos una vez; cada consumidor registra `eventId` procesado (`inboxReceipts`, índice único por consumidor) y aplica el efecto en la misma transacción; el orden se garantiza por agregado cuando importa (clave de partición `tenantId`+`aggregateId`). | Entregar 3 veces el mismo evento produce un solo efecto. | Prueba de integración por consumidor. | DEC-003; AGR-016 | Núcleo | O0 | Adoptado |
| RNF-NFR-215 | Jobs idempotentes y reanudables: ID determinista (`<modulo>:<proceso>:<tenantId>:<loteId>:<chunk>`), universo congelado al iniciar (AGR-015/ESC-05), procesamiento por chunks con checkpoint persistido en Mongo, cada ítem con resultado; reejecutar un lote completado no genera nada nuevo; reejecutar uno interrumpido solo procesa lo pendiente. | Prueba de caos de RNF-NFR-013 sin duplicados. | Suite de jobs. | BASE §34 esc. 6, 59; ESC-05 | Núcleo | O0 | Adoptado |
| RNF-NFR-216 | Exclusión mutua de procesos sobre el mismo universo: lease en Mongo (`locks` con TTL y renovación) por `tenantId` + proceso + ciclo; un segundo lote sobre el mismo ciclo y universo se rechaza o se encola; sin locks en memoria. | 2 lanzamientos simultáneos del mismo lote: 1 se ejecuta, 1 se rechaza con mensaje. | Prueba de integración concurrente. | BASE §34 esc. 59 | Núcleo | O4 | Adoptado |
| RNF-NFR-217 | Numeración fiscal correlativa sin huecos ni duplicados por punto de venta y tipo: asignación atómica dentro de la transacción de emisión, consulta del último comprobante autorizado en ARCA antes de reintentar y reconciliación tras errores o restauraciones (BASE §97.2, ESC-04). | 0 huecos ni duplicados en prueba de 10.000 emisiones con fallos inyectados. | Prueba contra homologación + simulador. | BASE §97.2; escenario 50, 61 | Núcleo | O4 | Adoptado |
| RNF-NFR-218 | Webhooks y archivos de rendición deduplicados por identificador del proveedor y por hash de archivo; reprocesar un archivo ya imputado no genera cobros nuevos (escenario 7). | Reprocesar 2 veces el mismo archivo: 0 cobros nuevos. | Prueba de integración. | BASE §34 esc. 7 | Núcleo | O5 | Adoptado |
| RNF-NFR-219 | Sincronización offline idempotente por `clientMutationId`; el servidor responde el resultado previo si ya la procesó (CNX §3.7). | 3 envíos del mismo lote: 1 efecto por mutación. | RNF-NFR-017. | CNX §3.7 | Núcleo | O3 | Adoptado |
| RNF-NFR-220 | Recursos escasos (último turno, equipo serializado, cupo de cuadrilla, parcela de cementerio) reservados con operación atómica condicional o índice único y reserva temporal con vencimiento; nunca "leer y luego escribir" sin condición. | 2 socios reservando el último turno: 1 confirma, 1 recibe alternativa (escenario 36). | Prueba de concurrencia. | BASE §34 esc. 36; AGR-025 | Núcleo | O3 | Adoptado |
| RNF-NFR-221 | Estados explícitos de operaciones con terceros: `Pendiente`, `Confirmado`, `Fallido`, `Resultado incierto` (AGR-016); ante timeout no se asume ni éxito ni fracaso: se consulta al tercero (job de reconciliación) antes de reintentar. | 0 reintentos ciegos tras timeout en las pruebas de caos. | Prueba con conector que confirma después del timeout. | AGR-016; BASE §34 esc. 8, 61 | Núcleo | O4 | Adoptado |
| RNF-NFR-222 | Bandeja de operaciones detenidas: lo que no se repara automáticamente tras los reintentos queda en una bandeja técnica/operativa con contexto, responsable, acciones (reintentar, reconciliar, descartar con motivo) y auditoría. | 100 % de fallos finales visibles en la bandeja en ≤ 1 min. | Prueba de integración. | AGR-016, AGR-021 | Núcleo | O1 | Adoptado |
| RNF-NFR-223 | Reproducibilidad: cada cálculo guarda versión de tarifa, reglas, parámetros y datos de entrada usados; reejecutar un cálculo histórico o simular no modifica documentos ni deuda (escenarios 5, 39, 73). | Simulación: 0 escrituras en colecciones productivas. | Prueba de integración que cuenta escrituras durante simulación. | BASE §34 esc. 5, 39, 73; ESC-05 | Núcleo | O4 | Adoptado |
| RNF-NFR-224 | Concurrencia de caja: una caja abierta por cajero y puesto a la vez, cierre atómico que congela los movimientos, cobros simultáneos en distintas cajas sin bloqueo global. | 30 cajas concurrentes por tenant grande sin conflictos (RNF-NFR-005). | Prueba k6 `cash-payment`. | M07 | Núcleo | O5 | Adoptado |
| RNF-NFR-225 | Consistencia de reportes con fecha de corte: los reportes económicos se calculan con lectura consistente (snapshot o fecha de corte explícita) para que un total no cambie mientras se genera; muestran universo y fecha de corte (AGR-022). | Reporte generado durante un lote en curso coincide con el corte declarado. | Prueba de integración. | AGR-022; BASE §59 | Estándar | O5 | Adoptado |
| RNF-NFR-226 | Doble envío desde la UI: botones de acción económica se deshabilitan al primer clic, muestran progreso y reutilizan la misma `Idempotency-Key` en los reintentos automáticos del cliente. | Doble clic en "Cobrar": 1 recibo. | Prueba Playwright. | AGR-016 | Núcleo | O0 | Adoptado |
| RNF-NFR-227 | Reintentos con backoff exponencial y jitter (base 2 s, máximo 15 min, ≤ 8 intentos por defecto, configurable por conector), cola de mensajes muertos con alerta y reproceso manual auditado. | 0 tormentas de reintentos en prueba de caos (picos ≤ 2× tráfico normal). | Prueba de caos. | AGR-016, AGR-021 | Núcleo | O0 | Adoptado |
| RNF-NFR-228 | Tiempo: marcas de tiempo del servidor (no del cliente) para `createdAt`, `recordedAt` y orden de eventos; IDs ordenables (ObjectId/UUIDv7) para desempate; la fecha efectiva declarada por el usuario se guarda aparte (AGR-010). | 0 decisiones de orden basadas en la hora del cliente. | Revisión de código + prueba. | AGR-010; RN-NFR-018 | Núcleo | O0 | Adoptado |
| RNF-NFR-229 | Verificación automática diaria de invariantes por tenant (job `nfr:verificar-invariantes`): suma de comprobantes = suma de ítems; saldo auxiliar = suma de movimientos; cobros confirmados = imputados + a favor + no identificados; asientos balanceados; numeración sin huecos; equipos sin doble asignación; resultado en el tablero del tenant y alerta ante diferencia. | 0 diferencias no explicadas; alerta SEV2 ante diferencia. | Prueba con diferencia inyectada. | AGR-011; BASE §34 esc. 71, 80, 81 | Núcleo | O5 | Adoptado |
| RNF-NFR-260 | **Verificador nocturno de integridad referencial por tenant** (DEC-100; job `nfr:verificar-referencias`, JOB-NFR-25): recorre las referencias entre colecciones declaradas en el catálogo de T05 (§7.3 a §7.7, con los destinos de §7.2 y §7.2.1, leídas del registro de referencias generado desde los esquemas, T05 §7.1.16) y, por cada referencia cuyo documento de destino no existe en el mismo tenant, registra un hallazgo con colección y `_id` de origen, campo, colección de destino y `_id` inexistente. **Informa sin corregir**: no escribe en colecciones de negocio, lee de secundarios y corre en la cola de baja prioridad con la cuota del tenant (RN-NFR-025). Los hallazgos van a la **bandeja de integridad** del tenant (ítems de la bandeja operativa de T11, RF-WFL-010 y RNF-NFR-222, con tipo `referentialIntegrity`, deduplicados por la huella `<colección>:<campo>:<_id de origen>`) y generan **alerta a operaciones** de plataforma (RNF-NFR-132): SEV3 por tenant con hallazgos nuevos y SEV2 si la referencia apunta a un documento de otro tenant, que además se trata como posible falla de aislamiento (RNF-NFR-133). Una referencia reparada desaparece del informe siguiente y su ítem se cierra solo. Si un tenant grande no termina en la ventana, la corrida sigue la noche siguiente desde el último checkpoint (RNF-NFR-215). | Corrida completa de cada tenant dentro de la ventana nocturna (01:00 a 05:00 hora del tenant) con el perfil grande de DEC-075; 0 escrituras en colecciones de negocio; hallazgo visible en la bandeja ≤ 10 min después de terminar la corrida; tendencia en IND-NFR-19. | Prueba de integración con una referencia rota inyectada en TEN-001 (T05 CA-DAT-13); prueba que cuenta escrituras durante la corrida; prueba con una referencia a un documento de TEN-002 que dispara SEV2. | DEC-100 (aporte A8 del contraste del documento externo, 13.10); DEC-001; T05 §7.1.16; CAT `INTEGRIDAD` (reglas de integridad que ProCoop verifica por sistema) | Estándar | O1 | Adoptado |

## 15. Modelo de datos, estados, pantallas, API, eventos, integraciones, parámetros, indicadores y requisitos complementarios del anexo

Las secciones 7 a 14 adaptaron los títulos 7–15 de la plantilla a la naturaleza transversal del anexo (catálogos de RNF). Esta sección reúne los elementos de diseño propios de T08 que la plantilla ubica en 7–15 (15.1 a 15.8) y los requisitos no funcionales complementarios de mantenibilidad, portabilidad, usabilidad operativa, costos, soporte y crecimiento (15.9).

### 15.1 Modelo de datos

Todas las colecciones de tenant llevan `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`; las marcadas **[global]** pertenecen al ámbito `PLATFORM` y están en la lista blanca del plugin (RNF-NFR-149). Ninguna colección de T08 tiene equivalente en ProCoop salvo las indicadas.

**`dataCatalogEntries`** — inventario de datos personales (RF-NFR-001). Generado desde `x-pii` y completado por el tenant.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `module` | string (código de anexo, p. ej. `PER`) | Sí | Módulo dueño. |
| `collection` / `field` | string | Sí | Colección y ruta del campo. |
| `category` | enum `identificatorio`, `contacto`, `fiscal`, `financiero`, `ubicacion`, `salud`, `laboral`, `imagen`, `comunicacion`, `menor`, `credencial` | Sí | Categoría. |
| `sensitivity` | enum `publica`, `interna`, `personal`, `sensible`, `secreta` | Sí | Clasificación. |
| `encryption` | enum `ninguno`, `reposo`, `campo`, `hash` | Sí | Protección aplicada. |
| `purposes` | [ObjectId → `processingActivities`] | Sí | Finalidades. |
| `retentionPolicyId` | ObjectId | Sí | Política aplicable; → `retentionPolicies`. |
| `exposure` | `{ api: bool, bi: bool, ai: bool, export: bool, notifications: bool }` | Sí | Exposición permitida por defecto. |
| `maskRule` | string | No | Regla de enmascarado en UI/logs. |

Índices: `{ tenantId, collection, field }` único; `{ tenantId, sensitivity }`. Las entradas de plataforma (`tenantId = PLATFORM`) son la plantilla heredada.

**`processingActivities`** — registro de tratamientos (RF-NFR-002): `code` (string, único por tenant), `name` (`dict:` clave), `purpose`, `legalBasis` (enum `contrato`, `obligacionLegal`, `consentimiento`, `interesLegitimo` [VERIFICAR encuadre en Ley 25.326], `datosPublicos`), `dataSubjects` ([enum `socio`, `titular`, `solicitante`, `empleado`, `familiar`, `proveedor`, `beneficiario`, `menor`]), `dataCategories` ([enum de `category`]), `recipients` ([string]), `subprocessorIds` ([ObjectId]), `internationalTransfers` ([{ country, safeguard }]), `retentionPolicyIds`, `securityMeasures` ([string]), `status` (enum `borrador`, `vigente`, `retirada`), `validFrom`, `validTo`, `approvedBy`, `approvedAt`. Índice `{ tenantId, code }` único.

**`privacyNotices`** — avisos versionados (RF-NFR-003): `channel` (enum `landing`, `registro`, `app`, `presencial`, `empleado`), `versionNumber` (int), `content` (texto enriquecido sanitizado por clave de diccionario y variables), `purposesCovered` ([ObjectId]; → `processingActivities`), `status` (`borrador`, `publicado`, `reemplazado`), `publishedAt`, `contentHash` (SHA-256). Índice `{ tenantId, channel, versionNumber }` único.

**`consentRecords`** — consentimientos y preferencias (RF-NFR-004): `personId` (ObjectId → M01), `userId` (opcional), `purposeCode` (string), `noticeId` (→ `privacyNotices`) + `noticeVersion`, `status` (`otorgado`, `revocado`, `vencido`), `channel`, `grantedAt`, `revokedAt`, `evidence` ({ `ipTruncated`, `userAgentHash`, `documentObjectKey`, `signedBy` }), `representativePersonId` (menores, RNF-NFR-104), `expiresAt`. Índices `{ tenantId, personId, purposeCode, status }`; `{ tenantId, purposeCode, status }`. Nunca se edita: revocar crea un estado nuevo con auditoría. Campos que usa T09 (COL-COM-50 absorbida, CTR-DAT-18): `contactPointId` (ObjectId → M01), `address` (`{ hash, masked }`), `action` (`opt_in` → `otorgado`, `opt_out` → `revocado`), `source` (enum `portal`, `counter`, `import`, `keyword_stop`, `unsubscribe_link`, `migration`, `admin`), `textShown` y `textVersion` (texto exhibido y su versión, además de `noticeId`/`noticeVersion`), `actorUserId`, `occurredAt`, `evidenceRef`; el `purpose` de T09 es `purposeCode`, el `ipHash` va en `evidence.ipTruncated` y el agente de usuario se guarda solo como `evidence.userAgentHash`. Índice adicional `{ tenantId, personId, channel, purposeCode, occurredAt }` para la consulta de preferencias vigentes de T09.

**`dataSubjectRequests`** — solicitudes de derechos (RF-NFR-006): `number` (correlativo por tenant `DSR-AAAA-NNNNNN`), `type` (`acceso`, `rectificacion`, `actualizacion`, `supresion`, `oposicion`, `revocacion`), `channel`, `personId` (si se identifica), `requester` ({ nombre, documento enmascarado, contacto, `isRepresentative`, evidencia }), `receivedAt`, `verifiedAt`, `dueAt` (calculado), `dueRule` (`10diasCorridos` / `5diasHabiles`), `status` (`recibida`, `enVerificacion`, `verificada`, `rechazada`, `enAnalisis`, `pendienteAprobacion`, `aprobada`, `enEjecucion`, `respondida`, `cerrada`; sección 15.2; antes sin valores), `assignedTo`, `findings` ([{ collection, count }]), `decisions` ([{ category, action: `suprimir`/`anonimizar`/`bloquear`/`rechazar`, reason, retentionPolicyId, legalHoldId }]), `responseObjectKey`, `responseSentAt`, `closedAt`, `rejectionReason`. Índices `{ tenantId, number }` único; `{ tenantId, status, dueAt }`; `{ tenantId, personId }`.

**`retentionPolicies`** — conservación (RF-NFR-009): `code` (= PRM de 10.3), `category`, `retentionClass` (clase de retención que declara cada colección en su esquema, T05 §7.1.13 y COL-NFR-06: `legal10y`, `fiscal10y`, `labor10y`, `health`, `operational`, `technical`, `audit`, `legacy`), `durationMonths` (o `permanent: true`), `startEvent` (enum `cierreEjercicio`, `finContrato`, `cierreCaso`, `ultimoAcceso`, `egreso`, `ultimaPrestacion`, `evento`), `action` (`suprimir`, `anonimizar`, `archivar`, `conservar`), `platformMinMonths`, `platformMaxMonths`, `legalReference`, `status` (`borrador`, `vigente`, `reemplazada`; §15.2; antes sin valores), `validFrom`. Índice `{ tenantId, code, validFrom }`.

**`legalHolds`** — bloqueos legales (RF-NFR-010): `scope` (enum `persona`, `cuenta`, `documento`, `periodo`, `tenant`), `targetIds`, `reason` (enum `litigio`, `requerimientoJudicial`, `requerimientoAdministrativo`, `auditoriaFiscal`, `otro`), `description`, `status` (`propuesto`, `activo`, `liberado`, `anulado`; antes sin `anulado`), `requestedBy`, `approvedBy` (distinto del solicitante), `activeFrom`, `releasedAt`, `releaseReason`. Índice `{ tenantId, status, scope }`.

**`retentionRuns`** — ejecuciones de conservación/anonimización (RF-NFR-009, 011): `policyId`, `mode` (`vistaPrevia`, `ejecucion`), `status` (`preparada`, `pendienteAprobacion`, `aprobada`, `enCurso`, `completada`, `fallida`, `cancelada`), `candidates` (conteo por colección), `excludedByHold` (conteo), `approvedBy`, `startedAt`, `finishedAt`, `jobId`, `checkpoint`, `result` (conteos). Índice `{ tenantId, policyId, createdAt }`.

**`erasureLedger`** **[global, fuera de la base restaurable]** — lista durable de supresiones para reaplicar tras restauraciones (RNF-NFR-045): `tenantId`, `subjectRef` (HMAC del identificador), `scope`, `executedAt`, `requestId`. Se replica a almacenamiento WORM.

**`securityIncidents`** **[global con referencias a tenants]** (RF-NFR-014): `number` (`INC-AAAA-NNNN`), `title`, `severity` (`SEV1`–`SEV4`), `type` (enum `disponibilidad`, `accesoIndebido`, `fugaDatos`, `credencialComprometida`, `malware`, `fraude`, `vulnerabilidad`, `simulacro`), `status` (`detectado`, `confirmado`, `descartado`, `contenido`, `notificado`, `erradicado`, `recuperado`, `postmortem`, `cerrado`; sección 15.2; antes sin valores), `detectedAt`, `confirmedAt`, `containedAt`, `resolvedAt`, `affectedTenantIds`, `affectedDataCategories`, `affectedSubjectsEstimate` (por tenant), `notifications` ([{ tenantId, sentAt, channel, kind: `inicial`/`preliminar`/`final` }]), `timeline` ([{ at, actor, note }]), `rootCause`, `actions` ([{ description, owner, dueAt, status }]), `postmortemObjectKey`. Cada tenant ve solo su parte (proyección).

**`restoreTests`** **[global]** (RF-NFR-015; dueño T01 COL-PLA-20, antes `restoreDrills` en T08, CTR-DAT-21; T08 fija los campos que necesita): `type` (`plataforma`, `tenant`, `dr`, `objetos`, `claves`), `tenantId` (si aplica), `pointInTime`, `startedAt`, `availableAt`, `measuredRpoSeconds`, `measuredRtoSeconds`, `checks` ([{ name, result, detail }] — conteos, hashes de auditoría, supresiones reaplicadas, conciliación externa), `result` (`exitoso`, `conObservaciones`, `fallido`), `minutesObjectKey`, `approvedBy`.

**`encryptionKeys`** **[global y por tenant]** (RF-NFR-023): `purpose` (`dek-general`, `dek-salud`, `dek-financiero`, `dek-secreto`, `blind-index`, `token-signing`, `backup`), `tenantId` (o `PLATFORM`), `kmsKeyRef` (identificador, nunca material), `wrappedKey` (Binary, solo DEK envuelta), `keyVersion`, `status` (`activa`, `soloDescifrado`, `retirada`, `comprometida`), `createdAt`, `rotateAfter`, `rotatedAt`. Índice `{ tenantId, purpose, status }`.

**`idempotencyKeys`** (RNF-NFR-212; dueño T01 COL-PLA-28, CTR-DAT-21; T08 fija los requisitos): `key`, `route`, `actorId`, `requestHash`, `status` (`enCurso`, `completada`, `fallida`), `responseStatus`, `responseBody` (sin datos sensibles; o referencia al recurso), `expiresAt` (índice TTL). Índice `{ tenantId, key, route }` único.

**`inboxReceipts`** (RNF-NFR-214; dueño T01 COL-PLA-25, absorbe `processedEvents` de T08, CTR-DAT-21): `consumer`, `eventId`, `processedAt`, `expiresAt` (TTL ≥ 30 días). Índice `{ tenantId, consumer, eventId }` único.

**`locks`** (RNF-NFR-216; queda en T08 como respaldo de los locks de BullMQ, CTR-DAT-21): `resource` (`<modulo>:<proceso>:<cicloId>`), `owner` (worker + jobId), `leaseUntil`. Índice `{ tenantId, resource }` único; TTL sobre `leaseUntil`.

**`sloDefinitions`** **[global]**: `service`, `sli` (fórmula), `target` (porcentaje), `window` (`30d`), `burnRateRules`, `owner`. **`alertRules`** **[global y por tenant]** (dueño T01 COL-PLA-15, CTR-DAT-21): `code`, `condition` (expresión del backend de métricas), `severity`, `recipients` (roles/canales), `dedupMinutes`, `runbookUrl`, `enabled`. **`alerts`** (dueño T01 COL-PLA-16, antes `alertEvents` en T08, CTR-DAT-21): `ruleCode`, `tenantId` (si aplica), `firedAt`, `status` (`activa`, `reconocida`, `resuelta`, `silenciada`), `ackBy`, `resolvedAt`, `objectRef`, `fingerprint` (deduplicación).

**`cspReports`** **[global]**: `app`, `directive`, `blockedUri` (sin query), `documentUri` (sin query), `count`, `firstSeen`, `lastSeen`, `tenantId` (si se deduce del host). Índice `{ app, directive, blockedUri }` único (agregación).

**`qualityEvidence`** **[global]** (RF-NFR-022): `release` (semver), `commit`, `wave` (O0–O11), `checks` ([{ kind: `unit`/`integration`/`isolation`/`permissions`/`contract`/`e2e`/`load`/`sast`/`sca`/`secrets`/`dast`/`a11y`/`sbom`/`pentest`/`restore`, result, reportObjectKey, metrics }]), `asvsMatrixVersion`, `approvedBy`, `approvedAt`, `promotedAt`.

**`statusNotices`** **[global]** (RF-NFR-019, RNF-NFR-032): `type` (`mantenimiento`, `incidente`, `informativo`), `title` y `body` (claves `dict:`), `affectedServices` ([string]), `affectedTenantIds` ([ObjectId] o `all`), `scheduledFrom`, `scheduledTo`, `publishedAt`, `updates` ([{ at, text }]), `incidentId` (opcional → `securityIncidents`), `status` (`programado`, `enCurso`, `resuelto`, `cancelado`). Índice `{ status, scheduledFrom }`. Alimenta PAN-NFR-18 y el aviso en el admin.

**`usageSnapshots`** (RF-NFR-025, RNF-NFR-250; dueño T01 COL-PLA-09, antes `tenantUsageSnapshots` en T08, CTR-DAT-21): `granularity` (`hora`, `mes`), `period` (`YYYY-MM` o `YYYY-MM-DDTHH`), `metrics` ({ `workerSeconds` por cola, `dbGb`, `objectGb`, `messagesByChannel`, `aiTokens`, `biCalls`, `exports`, `egressGb`, `requests429` }), `planLimits` (copia de las cuotas vigentes de T01), `computedAt`. Índice `{ tenantId, granularity, period }` único. Recalculable (JOB-NFR-21).

**`subprocessors`** **[global]** (RF-NFR-013): `name`, `service`, `dataCategories`, `country`, `safeguard` (`adecuado`, `clausulasModelo`, `consentimiento`, `otro`), `addedAt`, `noticeSentAt`, `status` (`propuesto`, `vigente`, `retirado`; §15.2; antes sin valores).

**`statusNotices`** **[global]** (repetición de la definición anterior; se conserva el texto) (RF-NFR-019, RNF-NFR-032): `type` (`mantenimiento`, `incidente`, `informativo`), `title` y `body` (claves `dict:`), `affectedServices` ([string]), `affectedTenantIds` ([ObjectId] o `all`), `scheduledFrom`, `scheduledTo`, `publishedAt`, `updates` ([{ at, text }]), `incidentId` (opcional → `securityIncidents`), `status` (`programado`, `enCurso`, `resuelto`, `cancelado`). Índice `{ status, scheduledFrom }`. Alimenta PAN-NFR-18 y el aviso en el admin.

**`usageSnapshots`** (repetición de la definición anterior; se conserva el texto) (RF-NFR-025, RNF-NFR-250): `granularity` (`hora`, `mes`), `period` (`YYYY-MM` o `YYYY-MM-DDTHH`), `metrics` ({ `workerSeconds` por cola, `dbGb`, `objectGb`, `messagesByChannel`, `aiTokens`, `biCalls`, `exports`, `egressGb`, `requests429` }), `planLimits` (copia de las cuotas vigentes de T01), `computedAt`. Índice `{ tenantId, granularity, period }` único. Recalculable (JOB-NFR-21).

**Mapeo a ProCoop:** `AUDITO`, `AUDITORIA`, `INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA` → `auditLogs` (T02) con cobertura ampliada (RNF-NFR-110 a 119); `BLOQUEO_FILAS` → control optimista `version` (RNF-NFR-210); `ConfiguracionesSistema`/`INFO_SYS` → T04; `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS` → credenciales de API de T02/T10 con RNF-NFR-233; `FIRMADIGITAL*`, `FIRMASELECTRONICAS*` → documentos firmados (T11) con RNF-NFR-230. No hay tablas ProCoop de consentimientos, solicitudes de derechos, conservación ni incidentes.

#### 15.1.1 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `tenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-NFR-24 (Asumida, DEC-072).

**`processingActivities`** — Registro de tratamientos (COL-NFR-02; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | string, único por tenant |
| `name` | string | Sí | — | `dict:` clave |
| `purpose` | string | No | — | Según la definición en texto del §7 |
| `legalBasis` | enum | No | — | enum `contrato`, `obligacionLegal`, `consentimiento`, `interesLegitimo` [VERIFICAR encuadre en Ley 25.326], `datosPublicos` |
| `dataSubjects` | array de enum | No | — | [enum `socio`, `titular`, `solicitante`, `empleado`, `familiar`, `proveedor`, `beneficiario`, `menor`] |
| `dataCategories` | array de enum | No | — | [enum de `category`] |
| `recipients` | array de string | No | — | [string] |
| `subprocessorIds` | array de ObjectId | No | `subprocessors` (T08) | [ObjectId]; destino → `subprocessors` |
| `internationalTransfers` | array de object | No | — | [{ country, safeguard }] |
| `retentionPolicyIds` | array de ObjectId | No | `retentionPolicies` (T08) | destino → `retentionPolicies` |
| `securityMeasures` | array de string | No | — | [string] |
| `status` | enum | Sí | — | enum `borrador`, `vigente`, `retirada` |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `approvedBy` | ObjectId | No | `memberships` (T02) | destino → `memberships` |
| `approvedAt` | Date | No | — | Según la definición en texto del §7 |

**`privacyNotices`** — Avisos de privacidad versionados (COL-NFR-03; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `channel` | enum | Sí | — | enum `landing`, `registro`, `app`, `presencial`, `empleado` |
| `versionNumber` | int | No | — | int |
| `content` | string | No | — | texto enriquecido sanitizado por clave de diccionario y variables |
| `purposesCovered` | array de ObjectId | No | `processingActivities` (T08) | [ObjectId]; destino → `processingActivities` |
| `status` | enum | Sí | — | `borrador`, `publicado`, `reemplazado` |
| `publishedAt` | Date | No | — | Según la definición en texto del §7 |
| `contentHash` | string | No | — | SHA-256 |

**`consentRecords`** — Consentimientos (canónica; absorbe consents de M01 y consentRecords de T09) (COL-NFR-04; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `personId` | ObjectId | No | `persons` (M01) | ObjectId → M01; destino → `persons` |
| `userId` | ObjectId | No | `memberships` (T02) | opcional; destino → `memberships` |
| `purposeCode` | string | No | — | string |
| `noticeId` | ObjectId | No | `privacyNotices` (T08) | destino → `privacyNotices` |
| `noticeVersion` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `otorgado`, `revocado`, `vencido` |
| `channel` | enum | No | — | Según la definición en texto del §7 |
| `grantedAt` | Date | No | — | Según la definición en texto del §7 |
| `revokedAt` | Date | No | — | Según la definición en texto del §7 |
| `evidence` | object | No | — | { `ipTruncated`, `userAgentHash`, `documentObjectKey`, `signedBy` } |
| `representativePersonId` | ObjectId | No | `persons` (M01) | menores, RNF-NFR-104; destino → `persons` |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `purpose` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`dataSubjectRequests`** — Solicitudes de derechos (canónica; absorbe la de M01) (COL-NFR-05; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `number` | string | Sí | — | correlativo por tenant `DSR-AAAA-NNNNNN` |
| `type` | enum | No | — | `acceso`, `rectificacion`, `actualizacion`, `supresion`, `oposicion`, `revocacion` |
| `channel` | enum | No | — | Según la definición en texto del §7 |
| `personId` | ObjectId | No | `persons` (M01) | si se identifica; destino → `persons` |
| `requester` | object | No | — | { nombre, documento enmascarado, contacto, `isRepresentative`, evidencia } |
| `receivedAt` | Date | No | — | Según la definición en texto del §7 |
| `verifiedAt` | Date | No | — | Según la definición en texto del §7 |
| `dueAt` | Date | No | — | calculado |
| `dueRule` | enum | No | — | `10diasCorridos` / `5diasHabiles` |
| `status` | enum | Sí | — | `recibida`, `enVerificacion`, `verificada`, `rechazada`, `enAnalisis`, `pendienteAprobacion`, `aprobada`, `enEjecucion`, `respondida`, `cerrada`; inicial `recibida` (§15.2) |
| `assignedTo` | string | No | — | Según la definición en texto del §7 |
| `findings` | array de object | No | — | [{ collection, count }] |
| `decisions` | array de object | No | — | [{ category, action: `suprimir`/`anonimizar`/`bloquear`/`rechazar`, reason, retentionPolicyId, legalHoldId }] |
| `responseObjectKey` | string | No | — | Según la definición en texto del §7 |
| `responseSentAt` | Date | No | — | Según la definición en texto del §7 |
| `closedAt` | Date | No | — | Según la definición en texto del §7 |
| `rejectionReason` | string | No | — | Según la definición en texto del §7 |

**`retentionPolicies`** — Políticas de retención (canónica; absorbe la de T11) (COL-NFR-06; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | = PRM de 10.3 |
| `category` | enum | No | — | Según la definición en texto del §7 |
| `retentionClass` | string | No | — | clase de retención que declara cada colección en su esquema, T05 §7.1.13 y COL-NFR-06: `legal10y`, `fiscal10y`, `labor10y`, `health`, `operational`, `technical`, `audit`, `legacy` |
| `durationMonths` | array | No | — | o `permanent: true` |
| `startEvent` | enum | No | — | enum `cierreEjercicio`, `finContrato`, `cierreCaso`, `ultimoAcceso`, `egreso`, `ultimaPrestacion`, `evento` |
| `action` | enum | No | — | `suprimir`, `anonimizar`, `archivar`, `conservar` |
| `platformMinMonths` | array | No | — | Según la definición en texto del §7 |
| `platformMaxMonths` | array | No | — | Según la definición en texto del §7 |
| `legalReference` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `borrador`, `vigente`, `reemplazada`; §15.2; antes sin valores |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |

**`legalHolds`** — Retenciones legales (canónica; absorbe la de T11) (COL-NFR-07; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `scope` | enum | No | — | enum `persona`, `cuenta`, `documento`, `periodo`, `tenant` |
| `targetIds` | array de ObjectId | No | — | Según la definición en texto del §7 |
| `reason` | enum | No | — | enum `litigio`, `requerimientoJudicial`, `requerimientoAdministrativo`, `auditoriaFiscal`, `otro` |
| `description` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `propuesto`, `activo`, `liberado`, `anulado`; antes sin `anulado` |
| `requestedBy` | ObjectId | No | `memberships` (T02) | destino → `memberships` |
| `approvedBy` | ObjectId | No | `memberships` (T02) | distinto del solicitante; destino → `memberships` |
| `activeFrom` | string | No | — | Según la definición en texto del §7 |
| `releasedAt` | Date | No | — | Según la definición en texto del §7 |
| `releaseReason` | string | No | — | Según la definición en texto del §7 |
| `entityRefs` | array de array | Sí | — | Campo citado por T05 (referencias o clave única) |
| `number` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`retentionRuns`** — Corridas de supresión (COL-NFR-08; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `retentionPolicyId` | ObjectId | Sí | `retentionPolicies` (T08) | antes `policyId` en el texto del §7 (nombre canónico de T05); destino → `retentionPolicies` |
| `mode` | enum | No | — | `vistaPrevia`, `ejecucion` |
| `status` | enum | Sí | — | `preparada`, `pendienteAprobacion`, `aprobada`, `enCurso`, `completada`, `fallida`, `cancelada` |
| `candidates` | array | No | — | conteo por colección |
| `excludedByHold` | string | No | — | conteo |
| `approvedBy` | ObjectId | No | `memberships` (T02) | destino → `memberships` |
| `startedAt` | Date | No | — | Según la definición en texto del §7 |
| `finishedAt` | Date | No | — | Según la definición en texto del §7 |
| `jobId` | string | No | — | Según la definición en texto del §7 |
| `checkpoint` | string | No | — | Según la definición en texto del §7 |
| `result` | string | No | — | conteos |

**`erasureLedger`** — Libro de supresiones fuera de restauraciones (COL-NFR-09; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `subjectRef` | string | No | — | HMAC del identificador |
| `scope` | string | No | — | Según la definición en texto del §7 |
| `executedAt` | Date | No | — | Según la definición en texto del §7 |
| `requestId` | ObjectId | No | `dataSubjectRequests` (T08) | destino → `dataSubjectRequests` |
| `entityRef` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`securityIncidents`** — Incidentes de seguridad y privacidad (COL-NFR-10; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `number` | string | Sí | — | `INC-AAAA-NNNN` |
| `title` | string | No | — | Según la definición en texto del §7 |
| `severity` | enum | No | — | `SEV1`–`SEV4` |
| `type` | enum | No | — | enum `disponibilidad`, `accesoIndebido`, `fugaDatos`, `credencialComprometida`, `malware`, `fraude`, `vulnerabilidad`, `simulacro` |
| `status` | enum | Sí | — | `detectado`, `confirmado`, `descartado`, `contenido`, `notificado`, `erradicado`, `recuperado`, `postmortem`, `cerrado`; inicial `detectado` (§15.2) |
| `detectedAt` | Date | No | — | Según la definición en texto del §7 |
| `confirmedAt` | Date | No | — | Según la definición en texto del §7 |
| `containedAt` | Date | No | — | Según la definición en texto del §7 |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `affectedTenantIds` | array de ObjectId | No | `tenants` (T01) | destino → `tenants` |
| `affectedDataCategories` | array | No | — | Según la definición en texto del §7 |
| `affectedSubjectsEstimate` | string | No | — | por tenant |
| `notifications` | array de object | No | — | [{ tenantId, sentAt, channel, kind: `inicial`/`preliminar`/`final` }] |
| `timeline` | array de object | No | — | [{ at, actor, note }] |
| `rootCause` | string | No | — | Según la definición en texto del §7 |
| `actions` | array de object | No | — | [{ description, owner, dueAt, status }] |
| `postmortemObjectKey` | string | No | — | Según la definición en texto del §7 |
| `platformIncidentId` | ObjectId | Sí | `platformIncidents` (T01) | destino → `platformIncidents` |

**`encryptionKeys`** — DEK envueltas por categoría y tenant (COL-NFR-12; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `purpose` | enum | No | — | `dek-general`, `dek-salud`, `dek-financiero`, `dek-secreto`, `blind-index`, `token-signing`, `backup` |
| `kmsKeyRef` | string | No | — | identificador, nunca material |
| `wrappedKey` | Binary | No | — | Binary, solo DEK envuelta |
| `keyVersion` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `activa`, `soloDescifrado`, `retirada`, `comprometida` |
| `rotateAfter` | string | No | — | Según la definición en texto del §7 |
| `rotatedAt` | Date | No | — | Según la definición en texto del §7 |
| `category` | enum | Sí | — | Campo citado por T05 (referencias o clave única) |

**`locks`** — Locks distribuidos de respaldo a Redis; TTL (COL-NFR-15; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `resource` | string | Sí | — | `<modulo>:<proceso>:<cicloId>` |
| `owner` | string | No | — | worker + jobId |
| `leaseUntil` | string | No | — | Según la definición en texto del §7 |

**`sloDefinitions`** — Objetivos de nivel de servicio (COL-NFR-16; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `service` | string | No | — | Según la definición en texto del §7 |
| `sli` | string | No | — | fórmula |
| `target` | string | No | — | porcentaje |
| `window` | string | No | — | `30d` |
| `burnRateRules` | array | No | — | Según la definición en texto del §7 |
| `owner` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`cspReports`** — Reportes CSP; TTL (COL-NFR-19; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `app` | string | No | — | Según la definición en texto del §7 |
| `directive` | string | No | — | Según la definición en texto del §7 |
| `blockedUri` | string | No | — | sin query |
| `documentUri` | string | No | — | sin query |
| `count` | int | No | — | Según la definición en texto del §7 |
| `firstSeen` | string | No | — | Según la definición en texto del §7 |
| `lastSeen` | string | No | — | Según la definición en texto del §7 |

**`qualityEvidence`** — Evidencias de calidad por ola (COL-NFR-20; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `release` | string | No | — | semver |
| `commit` | string | No | — | Según la definición en texto del §7 |
| `wave` | string | Sí | — | O0–O11 |
| `checks` | array de object | No | — | [{ kind: `unit`/`integration`/`isolation`/`permissions`/`contract`/`e2e`/`load`/`sast`/`sca`/`secrets`/`dast`/`a11y`/`sbom`/`pentest`/`restore`, result, reportObjectKey, metrics }] |
| `asvsMatrixVersion` | string | No | — | Según la definición en texto del §7 |
| `approvedBy` | ObjectId | No | `memberships` (T02) | destino → `memberships` |
| `approvedAt` | Date | No | — | Según la definición en texto del §7 |
| `promotedAt` | Date | No | — | Según la definición en texto del §7 |
| `control` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`statusNotices`** — Página de estado (incidentes y mantenimientos) (COL-NFR-21; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `type` | enum | No | — | `mantenimiento`, `incidente`, `informativo` `mantenimiento`, `incidente`, `informativo` |
| `title` | string | No | — | Según la definición en texto del §7 |
| `body` | string | No | — | claves `dict:` claves `dict:` |
| `affectedServices` | array de string | No | — | [string] [string] |
| `affectedTenantIds` | array de ObjectId | No | `tenants` (T01) | [ObjectId] o `all` [ObjectId] o `all`; destino → `tenants` |
| `scheduledFrom` | string | No | — | Según la definición en texto del §7 |
| `scheduledTo` | string | No | — | Según la definición en texto del §7 |
| `publishedAt` | Date | No | — | Según la definición en texto del §7 |
| `updates` | array de object | No | — | [{ at, text }] [{ at, text }] |
| `incidentId` | ObjectId | No | `securityIncidents` (T08) | opcional → `securityIncidents` opcional → `securityIncidents` |
| `status` | enum | Sí | — | `programado`, `enCurso`, `resuelto`, `cancelado`; inicial `programado` (§15.2) |
| `platformIncidentId` | ObjectId | Sí | `platformIncidents` (T01) | destino → `platformIncidents` |

**`subprocessors`** — Registro público de subencargados (DEC-076) (COL-NFR-23; definición en texto en §15.1)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `service` | string | No | — | Según la definición en texto del §7 |
| `dataCategories` | array | No | — | Según la definición en texto del §7 |
| `country` | string | No | — | Según la definición en texto del §7 |
| `safeguard` | enum | No | — | `adecuado`, `clausulasModelo`, `consentimiento`, `otro` |
| `addedAt` | Date | No | — | Según la definición en texto del §7 |
| `noticeSentAt` | Date | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `propuesto`, `vigente`, `retirado`; §15.2; antes sin valores |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |


### 15.2 Estados y transiciones

**`dataSubjectRequests`**

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `recibida` | Titular, atención, formulario público | Datos mínimos | Calcula `dueAt`; evento EVT-NFR-04 | — |
| `recibida` | `enVerificacion` | Responsable de datos | — | Solicita evidencia | Vuelve a `recibida` |
| `enVerificacion` | `verificada` | Responsable de datos | Identidad acreditada | Dispara JOB-NFR-02 | — |
| `enVerificacion` | `rechazada` | Responsable de datos | Identidad no acreditada tras plazo informado | Respuesta fundada | Nueva solicitud |
| `verificada` | `enAnalisis` | Sistema | Búsqueda completa | Propone decisiones por categoría | — |
| `enAnalisis` | `pendienteAprobacion` | Responsable de datos | Decisiones cargadas | — | Vuelve a `enAnalisis` |
| `pendienteAprobacion` | `aprobada` | Aprobador (`nfr.solicitudesDerechos.aprobar`) | Distinto de quien analizó para supresiones | — | Vuelve a `enAnalisis` con motivo |
| `aprobada` | `enEjecucion` | Sistema | — | JOB-NFR-03 | — |
| `enEjecucion` | `respondida` | Sistema | Ejecución completa | Envía respuesta; registra en `erasureLedger` si suprime | — |
| `respondida` | `cerrada` | Sistema | 30 días sin reclamo o confirmación | — | Reapertura como solicitud nueva vinculada |
| cualquiera no final | `rechazada` | Responsable de datos | Fundamento (obligación de conservación, bloqueo, abuso) | Respuesta fundada | — |

**`securityIncidents`**: `detectado` → `confirmado` (o `descartado`) → `contenido` → `notificado` (si hay tenants afectados; puede ocurrir antes de `contenido` si el plazo vence) → `erradicado` → `recuperado` → `postmortem` → `cerrado`. Ningún estado se borra; `descartado` exige motivo. Actor: oficial de seguridad u operador SRE; `notificado` exige registro por tenant en `notifications`.

**`legalHolds`**: `propuesto` → `activo` (aprobación por un segundo usuario) → `liberado` (motivo). `propuesto` → `anulado`. Mientras `activo`, JOB-NFR-04 omite los datos alcanzados.

**`retentionRuns`**: `preparada` → `pendienteAprobacion` (la primera ejecución de cada política y toda ejecución con > 1.000 registros) → `aprobada` → `enCurso` → `completada`/`fallida` (reanudable desde `checkpoint`); `preparada`/`pendienteAprobacion` → `cancelada`.

**`consentRecords`**: `otorgado` → `revocado` (titular, en un paso) | `vencido` (sistema). Un nuevo otorgamiento crea un registro nuevo.

**`encryptionKeys`**: `activa` → `soloDescifrado` (al rotar) → `retirada` (cuando no quedan datos ni backups que la usen) ; cualquier estado → `comprometida` (rotación de emergencia y re-cifrado).

**`alerts`**: `activa` → `reconocida` → `resuelta`; `activa` → `silenciada` (con vencimiento ≤ 24 h y motivo) → `activa`.

**Colecciones con estado sin máquina propia** (corrección del 05-11-2026; §15.1 declaraba sus estados sin transiciones o sin valores). Estado inicial: el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `processingActivities` | — | `borrador` | Alta o copia de la plantilla de plataforma | — | — |
| `processingActivities` | `borrador` | `vigente` | Aprobación (`approvedBy`) | Base legal y plazo informados | — |
| `processingActivities` | `vigente` | `retirada` | La finalidad deja de usarse (`validTo`) | Ningún `privacyNotices` `publicado` la cubre sola | — |
| `privacyNotices` | — | `borrador` | Alta de versión por canal | — | — |
| `privacyNotices` | `borrador` | `publicado` | Publicación (`publishedAt`, `contentHash`) | Cubre todas las finalidades vigentes del canal | — |
| `privacyNotices` | `publicado` | `reemplazado` | Se publica una versión nueva del mismo canal | — | — |
| `retentionPolicies` | — | `borrador` | Alta por el tenant dentro de los mínimos y máximos de plataforma | `platformMinMonths` ≤ `durationMonths` ≤ `platformMaxMonths` | — |
| `retentionPolicies` | `borrador` | `vigente` | Aprobación desde `validFrom` | Validación del asesor antes de la primera ejecución real (PA-NFR-06) | — |
| `retentionPolicies` | `vigente` | `reemplazada` | Otra versión de la misma `code` entra en vigencia | — | — |
| `subprocessors` | — | `propuesto` | Alta del subencargado | — | — |
| `subprocessors` | `propuesto` | `vigente` | Pasan ≥ 30 días desde `noticeSentAt` (RF-NFR-013) | Aviso enviado a todos los tenants | — |
| `subprocessors` | `vigente` | `retirado` | Fin del servicio | — | — |
| `legalHolds` | `propuesto` | `anulado` | Se desiste antes de aprobar | Motivo | — |
| `consentRecords` | — | `otorgado` | Otorgamiento (cada otorgamiento crea un registro nuevo) | — | — |
| `consentRecords` | `otorgado` | `revocado` | Revocación por el titular, en un paso | — | — |
| `consentRecords` | `otorgado` | `vencido` | Vencimiento (sistema) | — | — |
| `legalHolds` | — | `propuesto` | Alta del bloqueo | — | — |
| `legalHolds` | `propuesto` | `activo` | Aprobación | Segundo usuario distinto de quien propuso | — |
| `legalHolds` | `activo` | `liberado` | Liberación | Motivo | — |
| `retentionRuns` | — | `preparada` | Preparación de la corrida (vista previa o ejecución) | — | — |
| `retentionRuns` | `preparada` | `pendienteAprobacion` | Primera ejecución de la política o más de 1.000 registros | — | — |
| `retentionRuns` | `preparada` | `aprobada` | Sin aprobación requerida | — | — |
| `retentionRuns` | `pendienteAprobacion` | `aprobada` | Aprobación | — | — |
| `retentionRuns` | `aprobada` | `enCurso` | Inicio de JOB-NFR-04 | — | — |
| `retentionRuns` | `enCurso` | `completada` | Fin sin errores | — | — |
| `retentionRuns` | `enCurso` | `fallida` | Error | — | — |
| `retentionRuns` | `fallida` | `enCurso` | Reanudación desde `checkpoint` | — | — |
| `retentionRuns` | `preparada`, `pendienteAprobacion` | `cancelada` | Cancelación | — | — |
| `encryptionKeys` | — | `activa` | Generación de la DEK | — | — |
| `encryptionKeys` | `activa` | `soloDescifrado` | Rotación | — | — |
| `encryptionKeys` | `soloDescifrado` | `retirada` | No quedan datos ni backups que la usen | — | — |
| `encryptionKeys` | `activa`, `soloDescifrado`, `retirada` | `comprometida` | Rotación de emergencia y re-cifrado | — | — |
| `securityIncidents` | — | `detectado` | Detección o reporte | — | — |
| `securityIncidents` | `detectado` | `confirmado` | Confirmación | — | — |
| `securityIncidents` | `detectado` | `descartado` | Descarte (exige motivo) | — | — |
| `securityIncidents` | `confirmado` | `contenido` | Contención | — | — |
| `securityIncidents` | `confirmado` | `notificado` | Vence el plazo de aviso antes de contener | Registro por tenant en `notifications` | — |
| `securityIncidents` | `contenido` | `notificado` | Hay tenants afectados | Registro por tenant en `notifications` | — |
| `securityIncidents` | `contenido` | `erradicado` | Sin tenants afectados | — | — |
| `securityIncidents` | `notificado` | `contenido` | Contención tras el aviso | — | — |
| `securityIncidents` | `notificado` | `erradicado` | Erradicación | — | — |
| `securityIncidents` | `erradicado` | `recuperado` | Recuperación | — | — |
| `securityIncidents` | `recuperado` | `postmortem` | Análisis posterior | — | — |
| `securityIncidents` | `postmortem` | `cerrado` | Cierre | — | — |
| `statusNotices` | — | `programado` | Alta del aviso (mantenimiento o incidente) | — | — |
| `statusNotices` | `programado` | `enCurso` | Llega `scheduledFrom` o se declara el incidente | — | — |
| `statusNotices` | `enCurso` | `resuelto` | Resolución | — | — |
| `statusNotices` | `programado` | `cancelado` | Cancelación | — | — |

Filas de alta agregadas en el cierre de residuales (05-11-2026; PA-NFR-24): `consentRecords`, `legalHolds`, `retentionRuns`, `encryptionKeys`, `securityIncidents` y `statusNotices` (las máquinas en texto de arriba siguen vigentes). `dataSubjectRequests` ya tenía su alta en la tabla de arriba y §15.1 lista ahora sus valores. La máquina de `alerts` de arriba usa nombres en castellano; la colección es de T01 (COL-PLA-15), cuyo §8 prevalece (`open` inicial). `retentionPolicies.status` y `subprocessors.status` no tenían valores en §15.1: se fijan `borrador`, `vigente`, `reemplazada` y `propuesto`, `vigente`, `retirado`. `legalHolds` agrega el estado `anulado` que la máquina de arriba ya usaba y §15.1 no declaraba.

Referencias de §15.1 sin destino explícito: `privacyNotices.purposesCovered[]` → `processingActivities` (T08); `consentRecords.noticeId` → `privacyNotices` (T08); `dataCatalogEntries.retentionPolicyId` y `dataSubjectRequests.decisions[].retentionPolicyId` → `retentionPolicies` (T08); `dataSubjectRequests.decisions[].legalHoldId` → `legalHolds` (T08); `retentionRuns.policyId` → `retentionPolicies` (T08); `documentTypes.retentionPolicyCode` (T11) → `retentionPolicies.code` (T08): el tipo documental usa `retentionPolicyCode` y no `retentionClass`, que es la clase de la colección (T05 COL-WFL-33); `processingActivities.subprocessorIds[]` → `subprocessors` (T08).

### 15.3 Pantallas

| PAN-ID | App | Ruta | Capability | Propósito y contenido | Layout CNX | Equivalencia ProCoop |
|---|---|---|---|---|---|---|
| PAN-NFR-01 | admin | `/admin/privacidad/tratamientos` | `nfr.tratamientos.ver` | Registro de tratamientos: `DataTable` (código, finalidad, base legal, categorías, subencargados, plazo, estado); modal `lg` de edición con versión; exportar XLSX/PDF; `ScreenHelp` (qué es, quién lo mantiene, cuándo revisarlo). Estado vacío: "Cargar plantilla". | AdminStickyHeader + DataTable | — |
| PAN-NFR-02 | admin | `/admin/privacidad/inventario` | `nfr.inventarioDatos.ver` | Inventario de datos por módulo/colección/campo con filtros por sensibilidad y exposición; solo lectura salvo finalidad y plazo. | DataTable | — |
| PAN-NFR-03 | admin | `/admin/privacidad/avisos` | `nfr.avisos.ver` | Avisos por canal y versión, vista previa "celular", publicar (`ConfirmDialog`), diferencias entre versiones. | DataTable + modal `xl` | — |
| PAN-NFR-04 | admin | `/admin/privacidad/consentimientos` | `nfr.consentimientos.ver` | Consulta por persona o finalidad, historial, evidencia, exportación auditada. | DataTable | — |
| PAN-NFR-05 | admin | `/admin/privacidad/solicitudes` | `nfr.solicitudesDerechos.ver` | Bandeja con semáforo de plazo, filtros por tipo/estado/canal, ficha con hallazgos por colección, decisiones por categoría, aprobación, respuesta y adjuntos. Alta desde FAB/botón "Registrar solicitud" (modal `md`). | DataTable + ficha | — |
| PAN-NFR-06 | admin | `/admin/privacidad/conservacion` | `nfr.conservacion.ver` | Políticas (tabla 10.3) con mínimos/máximos de plataforma, vista previa de impacto, ejecuciones y aprobación; pestaña de bloqueos legales. | DataTable + modal `lg` | — |
| PAN-NFR-07 | admin | `/admin/salud` | `nfr.salud.ver` | Tablero de salud del tenant (RF-NFR-017): procesos, emisión fiscal, cobranzas inciertas, conectores y credenciales por vencer, cuotas, incidentes, invariantes, referencias rotas abiertas del verificador de integridad (RNF-NFR-260, IND-NFR-19, con acceso a la bandeja de integridad; DEC-100), solicitudes por vencer. | Tablero (BiKpiGrid) | Avisos de `Inicio_ProCoop_Load`: backups vencidos (2786/2051), certificado AFIP (2925), facturas electrónicas pendientes, diferencia de versión (2085) |
| PAN-NFR-08 | admin | `/admin/salud/incidentes` | `nfr.incidentes.ver` | Incidentes de plataforma que afectan al tenant con su cronología y notificaciones; solicitud de restauración selectiva (`nfr.restauracion.solicitar`). | DataTable | — |
| PAN-NFR-09 | pwa-socio / pwa-empleado | `/app/mis-datos` | `por.misDatos.ver` | Mis datos y privacidad: datos visibles, descargar informe, pedir rectificación o supresión, preferencias y consentimientos con interruptores, avisos aceptados, estado de solicitudes. Alta de solicitud en modal desde FAB. | AppShell, cards | — |
| PAN-NFR-10 | landing | `/<tenantSlug>/privacidad` | pública | Aviso de privacidad vigente, formulario público de solicitud (con antiautomatización), datos de contacto del responsable. | Landing | — |
| PAN-NFR-11 | plataforma | `/admin/plataforma/salud` | `nfr.saludPlataforma.ver` | Tablero de salud global (RF-NFR-016, RNF-NFR-135). | Tablero | — |
| PAN-NFR-12 | plataforma | `/admin/plataforma/incidentes` | `nfr.incidentes.ver` | Gestión de incidentes, notificación por tenant, post-mortem. | DataTable + ficha | — |
| PAN-NFR-13 | plataforma | `/admin/plataforma/continuidad` | `nfr.restauracion.ejecutar` | Inventario de backups, simulacros (plan, ejecución, mediciones, actas), runbooks y su última prueba. | DataTable | Menú "Copia de seguridad, Base de Datos y Actualizar" (DFA M1) — **Reemplazado**: deja de ser tarea del usuario |
| PAN-NFR-14 | plataforma | `/admin/plataforma/claves` | `nfr.claves.ver` | Claves (metadatos), próxima rotación, rotación con doble aprobación. | DataTable | — |
| PAN-NFR-15 | plataforma | `/admin/plataforma/alertas` | `nfr.alertas.configurar` | Reglas de alerta y SLO, eventos activos, reconocimiento y silenciamiento. | DataTable | Variables 2730/2648/2731 (aviso de caída del Agente por mail) — **Reemplazado** |
| PAN-NFR-16 | plataforma | `/admin/plataforma/evidencias` | `nfr.evidencias.ver` | Evidencias por versión, matriz ASVS, vulnerabilidades abiertas, aprobación de promoción. | DataTable | — |
| PAN-NFR-17 | plataforma | `/admin/plataforma/subencargados` | `nfr.subencargados.editar` | Registro de subencargados y avisos a tenants. | DataTable | — |
| PAN-NFR-18 | landing (plataforma) | `/estado` | pública | Página de estado: servicios, incidentes y mantenimientos programados (RF-NFR-019). | Landing | — |

### 15.4 API

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-NFR-01 | GET | `/api/admin/nfr/processing-activities` | `nfr.tratamientos.ver` | Listar registro de tratamientos | Sí (lectura) |
| API-NFR-02 | POST / PATCH | `/api/admin/nfr/processing-activities[/:id]` | `nfr.tratamientos.editar` | Alta/edición con `version` | PATCH con `version` |
| API-NFR-03 | POST | `/api/admin/nfr/processing-activities/export` | `nfr.tratamientos.exportar` | Exportación asíncrona | `Idempotency-Key` |
| API-NFR-04 | GET | `/api/admin/nfr/data-catalog` | `nfr.inventarioDatos.ver` | Inventario de datos | Sí |
| API-NFR-05 | GET / POST | `/api/admin/nfr/privacy-notices` | `nfr.avisos.ver` / `nfr.avisos.editar` | Avisos y borradores | — |
| API-NFR-06 | POST | `/api/admin/nfr/privacy-notices/:id/publish` | `nfr.avisos.publicar` | Publicar versión | `Idempotency-Key` |
| API-NFR-07 | GET | `/api/admin/nfr/consents` | `nfr.consentimientos.ver` | Consultar consentimientos | Sí |
| API-NFR-08 | POST | `/api/admin/nfr/consents/export` | `nfr.consentimientos.exportar` | Exportación auditada | `Idempotency-Key` |
| API-NFR-09 | GET / POST | `/api/admin/nfr/data-subject-requests` | `nfr.solicitudesDerechos.ver` / `nfr.solicitudesDerechos.crear` | Bandeja y alta | POST con `Idempotency-Key` |
| API-NFR-10 | PATCH | `/api/admin/nfr/data-subject-requests/:id` | `nfr.solicitudesDerechos.editar` | Verificar, analizar, decidir | Con `version` |
| API-NFR-11 | POST | `/api/admin/nfr/data-subject-requests/:id/approve` | `nfr.solicitudesDerechos.aprobar` | Aprobar decisiones | `Idempotency-Key` |
| API-NFR-12 | POST | `/api/admin/nfr/data-subject-requests/:id/execute` | `nfr.solicitudesDerechos.aprobar` | Ejecutar (encola JOB-NFR-03) | `Idempotency-Key` |
| API-NFR-13 | GET | `/api/admin/nfr/data-subject-requests/:id/report` | `nfr.solicitudesDerechos.ver` | URL firmada del informe | Sí |
| API-NFR-14 | GET / PUT | `/api/admin/nfr/retention-policies` | `nfr.conservacion.ver` / `nfr.conservacion.configurar` | Políticas de conservación | PUT con `version` |
| API-NFR-15 | POST | `/api/admin/nfr/retention-runs` | `nfr.conservacion.configurar` | Vista previa o ejecución | `Idempotency-Key` |
| API-NFR-16 | POST | `/api/admin/nfr/retention-runs/:id/approve` | `nfr.anonimizacion.aprobar` | Aprobar ejecución | `Idempotency-Key` |
| API-NFR-17 | POST | `/api/admin/nfr/legal-holds` | `nfr.bloqueosLegales.crear` | Proponer bloqueo | `Idempotency-Key` |
| API-NFR-18 | POST | `/api/admin/nfr/legal-holds/:id/(approve\|release\|cancel)` | `nfr.bloqueosLegales.aprobar` / `nfr.bloqueosLegales.anular` | Transiciones | `Idempotency-Key` |
| API-NFR-19 | GET | `/api/admin/nfr/health` | `nfr.salud.ver` | Tablero de salud del tenant | Sí |
| API-NFR-20 | GET | `/api/admin/nfr/incidents` | `nfr.incidentes.ver` | Incidentes que afectan al tenant | Sí |
| API-NFR-21 | POST | `/api/admin/nfr/restore-requests` | `nfr.restauracion.solicitar` | Solicitar restauración selectiva | `Idempotency-Key` |
| API-NFR-22 | GET | `/api/admin/nfr/quotas` | `nfr.salud.ver` | Cuotas y consumo | Sí |
| API-NFR-23 | GET | `/api/admin/nfr/subprocessors` | `nfr.tratamientos.ver` | Subencargados vigentes e historial | Sí |
| API-NFR-24 | GET | `/api/por/my-data` | `por.misDatos.ver` | Datos del titular autenticado | Sí |
| API-NFR-25 | POST | `/api/por/my-data/requests` | `por.misDatos.solicitar` | Solicitud de derechos del titular | `Idempotency-Key` |
| API-NFR-26 | GET / PUT | `/api/por/consents` | `por.consentimientos.editar` | Preferencias y consentimientos | PUT idempotente |
| API-NFR-27 | GET | `/api/public/:tenantSlug/privacy/notice` | `public: true` (antes "pública") | Aviso vigente | Sí |
| API-NFR-28 | POST | `/api/public/:tenantSlug/privacy/requests` | `public: true` (con antiautomatización; antes "pública + antiautomatización") | Solicitud pública | `Idempotency-Key` |
| API-NFR-29 | GET | `/api/public/:tenantSlug/doc-links/:token` | `public: true` (requiere token de documento; antes "pública con token de documento") | Valida el enlace de un solo documento y redirige a URL firmada (RNF-NFR-081) | Sí |
| API-NFR-30 | POST | `/api/public/csp-reports` | `public: true` (limitada por tasa; antes "pública (limitada)") | Recepción de reportes CSP | Agregación |
| API-NFR-31 | GET | `/.well-known/security.txt` | `public: true` (antes "pública") | Contacto de seguridad | Sí |
| API-NFR-32 | GET | `/api/public/status` | `public: true` (antes "pública") | Estado de la plataforma | Sí |
| API-NFR-33 | GET | `/api/platform/nfr/health` | `nfr.saludPlataforma.ver` | Tablero global | Sí |
| API-NFR-34 | GET / POST / PATCH | `/api/platform/nfr/incidents[/:id]` | `nfr.incidentes.ver` (GET), `nfr.incidentes.gestionar` (POST, PATCH) (antes `nfr.incidentes.*`, comodín; T02 §4.4.3) | Gestión de incidentes | POST con `Idempotency-Key` |
| API-NFR-35 | POST | `/api/platform/nfr/incidents/:id/notify` | `nfr.incidentes.editar` | Notificar tenants afectados | `Idempotency-Key` |
| API-NFR-36 | GET / POST | `/api/platform/nfr/restore-drills` | `nfr.restauracion.ejecutar` | Simulacros y restauraciones | `Idempotency-Key` |
| API-NFR-37 | GET | `/api/platform/nfr/keys` | `nfr.claves.ver` | Metadatos de claves | Sí |
| API-NFR-38 | POST | `/api/platform/nfr/keys/:id/rotate` | `nfr.claves.rotar` (doble aprobación) | Rotación | `Idempotency-Key` |
| API-NFR-39 | GET / PUT | `/api/platform/nfr/alert-rules` | `nfr.alertas.configurar` | Reglas de alerta y SLO | PUT con `version` |
| API-NFR-40 | POST | `/api/platform/nfr/alert-events/:id/(ack\|silence\|resolve)` | `nfr.alertas.reconocer` | Gestión de alertas | Sí |
| API-NFR-41 | GET / POST | `/api/platform/nfr/quality-evidence[/:id/approve]` | `nfr.evidencias.ver` / `nfr.evidencias.aprobar` | Evidencias y aprobación de promoción | `Idempotency-Key` |
| API-NFR-42 | GET | `/api/platform/nfr/csp-reports` | `nfr.cspReportes.ver` | Reportes CSP agregados | Sí |
| API-NFR-43 | GET / PUT | `/api/platform/nfr/subprocessors` | `nfr.subencargados.editar` | Registro de subencargados | PUT con `version` |
| API-NFR-44 | GET | `/livez`, `/readyz`, `/version` | `pla.salud.sondear` (identidad técnica del orquestador, solo red privada, sin sesión; antes "Infraestructura: solo red privada del orquestador, sin sesión") | Salud del proceso (RNF-NFR-130) | Sí |

Todas responden errores RFC 9457 con `requestId`, paginan con `?page=&size=` y validan con Zod (RNF-NFR-082).

### 15.5 Eventos y jobs

**Eventos emitidos** (vía outbox, `schemaVersion` = 1):

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-NFR-01 | `nfr.privacyNotice.published` | Publicación de aviso | POR (mostrar y solicitar aceptación), COM |
| EVT-NFR-02 | `nfr.consent.granted` | Otorgamiento | COM (audiencias), CRM |
| EVT-NFR-03 | `nfr.consent.revoked` | Revocación | COM (excluir en ≤ 5 min, RF-NFR-004), BIA |
| EVT-NFR-04 | `nfr.dataSubjectRequest.received` | Alta de solicitud | Notificaciones al responsable |
| EVT-NFR-05 | `nfr.dataSubjectRequest.completed` / `.rejected` | Cierre | POR (aviso al titular), auditoría |
| EVT-NFR-06 | `nfr.personData.erasureRequested` | Ejecución de supresión/anonimización aprobada | **Todos los módulos con `x-pii`**: cada uno suprime/anonimiza lo propio y responde `<mod>.personData.erased` |
| EVT-NFR-07 | `nfr.legalHold.activated` / `.released` | Transición de bloqueo | Todos los módulos dueños de datos alcanzados |
| EVT-NFR-08 | `nfr.retentionRun.completed` | Fin de ejecución | Tablero, auditoría |
| EVT-NFR-09 | `nfr.securityIncident.notified` | Notificación a tenant | Admin del tenant (aviso), correo |
| EVT-NFR-10 | `nfr.restoreDrill.completed` | Fin de simulacro | Tablero de plataforma |
| EVT-NFR-11 | `nfr.key.rotated` | Rotación | Workers (recarga de DEK), JOB-NFR-08 |
| EVT-NFR-12 | `nfr.alert.fired` / `.resolved` | Alerta | Guardia, tablero, página de estado |
| EVT-NFR-13 | `nfr.invariant.violated` | JOB-NFR-06 detecta diferencia | Tablero del tenant, alerta SEV2 |
| EVT-NFR-14 | `nfr.quota.exceeded` | Superación de cuota | Tablero del tenant, plataforma |
| EVT-NFR-15 | `nfr.subprocessor.added` | Alta de subencargado | Admin de todos los tenants |
| EVT-NFR-16 | `nfr.file.infected` | Antivirus detecta malware | Seguridad, usuario que subió |
| EVT-NFR-17 | `nfr.auditChain.broken` | JOB-NFR-05 detecta ruptura del encadenamiento de auditoría | Guardia (alerta SEV2), oficial de seguridad |
| EVT-NFR-18 | `nfr.referentialIntegrity.broken` | JOB-NFR-25 encuentra una referencia rota nueva (DEC-100) | T11 (ítem de la bandeja de integridad), guardia de operaciones (alerta SEV3; SEV2 si apunta a otro tenant), tablero del tenant |

**Eventos consumidos:** `iam.login.failed` (EVT-IAM-07), `iam.securityAlert.raised` (EVT-IAM-14; incluye accesos entre tenants denegados), `iam.role.assigned` (EVT-IAM-04), `iam.supportAccess.granted` (EVT-IAM-11) (T02, alertas de seguridad); `pla.tenant.closed` (T01, fin de encargo, RNF-NFR-108); `per.person.updated` (M01, actualización del inventario de hallazgos); `<mod>.personData.erased` (confirmación por módulo para cerrar la solicitud); `wfl.job.failed` (T11, bandeja y alertas).

**Jobs:**

| JOB-ID | Nombre | Disparo / frecuencia | Descripción | Idempotencia y recuperación |
|---|---|---|---|---|
| JOB-NFR-01 | `nfr:informe-acceso` | Por solicitud verificada | Genera informe PDF + JSON del titular | Un informe por solicitud y versión; reanudable por colección |
| JOB-NFR-02 | `nfr:localizar-titular` | Por solicitud verificada | Busca apariciones del titular en colecciones `x-pii` | Resultado reemplazable; sin efectos |
| JOB-NFR-03 | `nfr:ejecutar-solicitud` | Por aprobación | Emite EVT-NFR-06 por módulo, espera confirmaciones, registra `erasureLedger` | Una ejecución por solicitud; reintento por módulo pendiente |
| JOB-NFR-04 | `nfr:aplicar-conservacion` | Diario 03:00 hora del tenant | Calcula candidatos por política, omite bloqueos, ejecuta lo aprobado | Checkpoint por colección; reanudable |
| JOB-NFR-05 | `nfr:verificar-cadena-auditoria` | — | **Retirado como job.** T08 define el control (RNF-NFR-113) y T02 lo ejecuta. Ver JOB-IAM-05 (dueño). | — |
| JOB-NFR-06 | `nfr:verificar-invariantes` | Diario 05:00 hora del tenant y bajo demanda | Controles de RNF-NFR-229 | Solo lectura; emite EVT-NFR-13 una vez por diferencia (huella) |
| JOB-NFR-07 | `nfr:simulacro-restauracion` | Mensual (plataforma), trimestral (tenant) | Restaura en ambiente aislado y ejecuta verificaciones | Ambiente efímero; registro en `restoreTests` |
| JOB-NFR-08 | `nfr:recifrar` | Tras rotación de DEK o compromiso | Re-cifra campos con la clave nueva | Por lotes con checkpoint; lectura con ambas versiones durante la transición |
| JOB-NFR-09 | `nfr:vencimientos-credenciales` | Diario 08:00 hora del tenant | Certificados y credenciales por vencer (RNF-NFR-071) | Una alerta por umbral y credencial |
| JOB-NFR-10 | `nfr:escanear-patrones` | Semanal | Escanea muestras de logs, auditoría y telemetría buscando secretos y PII (RNF-NFR-118, 121, 139) | Solo lectura |
| JOB-NFR-11 | `nfr:limpiar-exportaciones` | Cada hora | Elimina archivos de exportación vencidos (PRM-NFR-054) | Idempotente |
| JOB-NFR-12 | `nfr:antivirus-analizar` | — | **Retirado.** T08 fija la política (RNF-NFR-079) y T01 analiza. Ver JOB-PLA-21 (dueño). | — |
| JOB-NFR-13 | `nfr:actualizar-firmas-av` | Cada 6 h | Actualiza firmas del antivirus | Idempotente |
| JOB-NFR-14 | `nfr:destruir-tenant` | Por EVT `pla.tenant.closed` + plazo | Destrucción de datos del tenant y constancia (RNF-NFR-108) | Por colección con checkpoint; doble aprobación |
| JOB-NFR-15 | `nfr:reaplicar-supresiones` | Tras cada restauración | Reaplica `erasureLedger` (RNF-NFR-045) | Idempotente |
| JOB-NFR-16 | `nfr:agregar-csp` | Cada 5 min | Agrega reportes CSP | Idempotente |
| JOB-NFR-17 | `nfr:informe-sla` | Mensual, día 1 | Disponibilidad, latencias e incidentes por tenant | Reemplazable |
| JOB-NFR-18 | `nfr:inventario-backups` | Cada hora | Verifica existencia y estado de backups (RNF-NFR-038) | Solo lectura |
| JOB-NFR-19 | `nfr:conciliar-tras-restauracion` | — | **Retirado.** T08 fija los controles (RNF-NFR-044) y T01 concilia. Ver JOB-PLA-12 (dueño). | — |
| JOB-NFR-20 | `nfr:evaluar-slo` | Cada 60 s | Calcula SLI y burn rate y dispara `alerts` (RNF-NFR-131, 132) | Sin efectos salvo alertas deduplicadas por huella |
| JOB-NFR-21 | `nfr:medir-consumo` | Evento EVT-PLA-10 | Reacción: evalúa cuotas y topes (RNF-NFR-250, 251) sobre la medición de T01 y emite EVT-NFR-14. Ver JOB-PLA-05 (dueño). | Recalculable por período |
| JOB-NFR-22 | `nfr:informe-accesos-sensibles` | Mensual | Informe al responsable de datos del tenant con las lecturas de datos de salud, bancarios y de identidad (RNF-NFR-101, 114) | Reemplazable |
| JOB-NFR-23 | `nfr:anonimizar-dataset-bi` | Al publicar un cubo certificado y diario | Seudonimiza y suprime celdas menores que PRM-NFR-094 (RNF-NFR-106) | Reemplazable |
| JOB-NFR-24 | `nfr:escaneo-configuracion` | Semanal | TLS, encabezados, buckets públicos, nombres de objetos con PII, contenedores como root y deriva de IaC (RNF-NFR-052, 058, 072, 096, 171) | Solo lectura; hallazgo genera ticket con plazo de RNF-NFR-092 |
| JOB-NFR-25 | `nfr:verificar-referencias` | Diario 01:00 hora del tenant y bajo demanda | Verificador de integridad referencial por tenant (RNF-NFR-260, DEC-100; T05 §7.1.16): recorre las referencias del catálogo de T05 e informa las rotas en la bandeja de integridad | Solo lectura sobre colecciones de negocio; checkpoint por colección; un ítem por huella; emite EVT-NFR-18 una vez por hallazgo nuevo |

### 15.6 Integraciones (referencia a T06)

| Integración | Uso en T08 | Particularidades |
|---|---|---|
| KMS del proveedor de nube (o HSM/Vault compatible) | KEK, envoltura de DEK, firma | Agnóstico (DEC-004) mediante interfaz `KeyProvider`; claves de backup en cuenta separada. |
| Gestor de secretos | Secretos de plataforma | Inyección en tiempo de ejecución; rotación automática donde el proveedor lo permita. |
| Motor antivirus (ClamAV en contenedor o servicio) | RNF-NFR-079 | Sin envío de archivos a terceros salvo subencargado registrado. |
| Backend de observabilidad (OpenTelemetry Collector + almacenamiento de logs, métricas y trazas) | Sección 11 | Subencargado si es SaaS (RNF-NFR-139); redacción en el collector además de en la aplicación. |
| Proveedor de CAPTCHA | RNF-NFR-076 | PA-NFR-11; subencargado. |
| Consulta de contraseñas comprometidas | RNF-NFR-061 | Solo prefijos k-anónimos; alternativa con lista local. |
| Registro Nacional "No Llame" | RF-NFR-005 | Consulta según el procedimiento vigente del organismo [VERIFICAR]. |
| Página de estado | RF-NFR-019 | Puede ser propia o servicio externo. |
| Proveedores de IA | RNF-NFR-098 | Solo con acuerdo de tratamiento y sin entrenamiento con datos del tenant (PA-NFR-09). |

### 15.7 Parámetros de configuración

Ámbito: **P** plataforma, **T** tenant (dentro de los límites de plataforma), **S** servicio. Los valores por defecto son los de las secciones 7–14. No existen equivalentes V2 de ProCoop salvo los indicados.

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-NFR-001 | `nfr.api.pageSizeMax` | int | P | 100 | Tamaño máximo de página | — |
| PRM-NFR-002 | `nfr.export.syncRowLimit` | int | P | 10.000 | Filas máximas de exportación sincrónica | — |
| PRM-NFR-003 | `nfr.http.requestTimeoutMs` | int | P | 30.000 | Timeout de request | — |
| PRM-NFR-004 | `nfr.http.outboundTimeoutMs` | `{connect, total}` | P/conector | 5.000 / 15.000 | Timeouts salientes | — |
| PRM-NFR-005 | `nfr.http.circuitBreaker` | `{failures, windowSec, openSec}` | P/conector | 5 / 60 / 60 | Circuit breaker | — |
| PRM-NFR-006 | `nfr.http.bodyLimit` | `{json, sync}` | P | 1 MB / 5 MB | Límite de body | — |
| PRM-NFR-007 | `nfr.sync.batchMax` | int | P | 200 | Mutaciones por lote de sincronización | — |
| PRM-NFR-008 | `nfr.report.syncMaxSeconds` | int | P | 5 | Máximo de reporte sincrónico | — |
| PRM-NFR-009 | `nfr.cache.configTtlSec` | int | P | 60 | Vigencia de caché de configuración | — |
| PRM-NFR-020 | `nfr.quota.batchJobsConcurrent` | int | P/T (plan) | 4 | Jobs batch concurrentes por tenant | — |
| PRM-NFR-021 | `nfr.quota.exportsConcurrent` | int | P/T | 2 | Exportaciones simultáneas | — |
| PRM-NFR-022 | `nfr.rate.userPerMin` | int | P | 600 | Requests por usuario y minuto | — |
| PRM-NFR-023 | `nfr.rate.tenantPerMin` | int | P/T (plan) | 6.000 | Requests por tenant y minuto | — |
| PRM-NFR-024 | `nfr.quota.bi` | `{perMin, recordsPerDay}` | P/T (plan) | 60 / 50.000 | Límites de API de BI por cliente | — |
| PRM-NFR-025 | `nfr.rate.aiPerMinUser` | int | P | 20 | Llamadas de IA por usuario y minuto | — |
| PRM-NFR-026 | `nfr.quota.aiMonthly` | int (unidades) | P/T (plan) | según plan | Cupo mensual de IA | — |
| PRM-NFR-027 | `nfr.rate.uploadsPerHour` | int | P | 30 | Subidas por usuario y hora | — |
| PRM-NFR-028 | `nfr.quota.storageGb` | int | P/T (plan) | según plan | Almacenamiento por tenant | — |
| PRM-NFR-029 | `nfr.abuse.messagesPerMemberDay` | int | T | 5 | Mensajes no transaccionales por socio y día | CNX §2.7 (tope de campañas) |
| PRM-NFR-030 | `nfr.files.signedDownloadTtlSec` | int | P | 300 | Vigencia de URL firmada de descarga | — |
| PRM-NFR-031 | `nfr.files.documentLinkTtlDays` | int | T | 7 | Vigencia de enlace de un solo documento (PA-NFR-10) | — |
| PRM-NFR-032 | `nfr.files.signedUploadTtlSec` | int | P | 600 | Vigencia de URL firmada de subida | — |
| PRM-NFR-033 | `nfr.files.maxSize` | `{image, pdf, sheet}` | P | 10 / 20 / 25 MB | Tamaños máximos | — |
| PRM-NFR-034 | `nfr.files.allowedTypes` | map finalidad → tipos | P | sección 9.8 | Lista blanca de tipos | — |
| PRM-NFR-035 | `nfr.import.maxRows` | int | P | 100.000 | Filas por importación | — |
| PRM-NFR-036 | `nfr.av.signatureMaxAgeHours` | int | P | 24 | Antigüedad máxima de firmas AV | — |
| PRM-NFR-037 | `nfr.av.quarantineRetentionDays` | int | P | 30 | Retención de infectados | — |
| PRM-NFR-038 | `nfr.files.stripExifCategories` | [string] | P | muro, comunidad, reclamos públicos | Categorías sin EXIF | — |
| PRM-NFR-040 a 055 | `nfr.retention.<categoria>` | `{months, startEvent, action}` | P (mín/máx) / T | tabla 10.3 | Conservación por categoría | — |
| PRM-NFR-060 | `nfr.money.defaultRounding` | enum | P/concepto | `HALF_UP` | Modo de redondeo por defecto (PA-NFR-21) | — |
| PRM-NFR-061 | `nfr.money.amountScale` | int | P | 2 | Decimales de importes | — |
| PRM-NFR-062 | `nfr.money.allocationMethod` | enum | P | `largestRemainder` | Método de distribución de residuos | — |
| PRM-NFR-063 | `nfr.money.unitPriceScale` | int | P/concepto | 6 | Decimales de precios unitarios | — |
| PRM-NFR-070 | `nfr.idempotency.ttl` | `{defaultHours, paymentsDays}` | P | 24 h / 30 días | Conservación de claves de idempotencia | — |
| PRM-NFR-071 | `nfr.retry.policy` | `{baseSec, maxMin, attempts}` | P/conector | 2 / 15 / 8 | Reintentos con backoff | — |
| PRM-NFR-080 | `nfr.cors.allowedOrigins` | [url] | P (+ dominios de tenant) | — (obligatorio) | Lista blanca CORS | — |
| PRM-NFR-081 | `nfr.nonprod.recipientAllowlist` | [patrón] | P (no productivo) | `@ejemplo.test` | Destinatarios permitidos fuera de producción | — |
| PRM-NFR-082 | `nfr.captcha.threshold` | int | P/T | 3 | Intentos antes del desafío | — |
| PRM-NFR-083 | `nfr.auth.lockout` | `{attempts, windowMin}` | P | 5 / 15 | Bloqueo por cuenta (T02) | V2 2588 (forzar cambio de contraseña por defecto) — **Reemplazado** |
| PRM-NFR-084 | `nfr.csp.mode` | enum `reportOnly`/`enforce` | P/app | `enforce` (tras período report-only) | Modo CSP | — |
| PRM-NFR-085 | `nfr.cert.expiryAlertDays` | [int] | P/T | 30, 15, 7 | Alertas de vencimiento | V2 2925 (aviso de vencimiento de certificado AFIP) |
| PRM-NFR-086 | `nfr.keys.rotation` | `{signingDays, dekMonths, kekMonths}` | P | 90 / 12 / 12 | Rotación de claves | — |
| PRM-NFR-090 | `nfr.ai.policy` | `{enabledFeatures, piiRedaction, providers}` | P/T | redacción activa; salud excluida | Política de IA (PA-NFR-09) | — |
| PRM-NFR-091 | `nfr.privacy.dsrAlertPct` | int | P | 70 | Porcentaje de plazo para alertar | — |
| PRM-NFR-092 | `nfr.privacy.subprocessorNoticeDays` | int | P | 30 | Aviso previo de subencargado nuevo | — |
| PRM-NFR-093 | `nfr.audit.readOptionalCategories` | [string] | T | [] | Lecturas auditadas adicionales (PA-NFR-16) | — |
| PRM-NFR-094 | `nfr.bi.smallCellThreshold` | int | P | 5 | Supresión de celdas pequeñas | — |
| PRM-NFR-095 | `nfr.notifications.lockScreenDetail` | bool | T | false | Mostrar importes en pantalla bloqueada | — |
| PRM-NFR-096 | `nfr.ai.monthlyBudget` | decimal (ARS) | P/T (plan) | según plan | Tope mensual de costo de IA; al 80 % avisa y al 100 % degrada a "sin IA" (RNF-NFR-251) | — |
| PRM-NFR-097 | `nfr.messaging.monthlyBudget` | `{sms, whatsapp}` decimal (ARS) | P/T (plan) | según plan | Tope mensual de SMS y WhatsApp no transaccionales (RNF-NFR-251) | — |
| PRM-NFR-100 | `nfr.time.tenantTimezone` | IANA tz | T/sucursal | `America/Argentina/Cordoba` | Zona horaria de negocio | — |
| PRM-NFR-101 | `nfr.i18n.locale` | string | T | `es-AR` | Locale | ProCoop `es-ES` — **Reemplazado** |
| PRM-NFR-102 | `nfr.time.holidayCalendars` | [ref] | T | nacional + provincia del tenant | Feriados para plazos hábiles | — |
| PRM-NFR-103 | `nfr.money.defaultCurrency` | ISO 4217 | T | `ARS` | Moneda por defecto | — |
| PRM-NFR-104 | `nfr.offline.dataTtlDays` | int | T | 7 | Vigencia de datos offline | — |
| PRM-NFR-105 | `nfr.offline.queueWarnHours` | int | T | 48 | Aviso de cola sin sincronizar | — |
| PRM-NFR-106 | `nfr.app.minVersion` | semver por app | P | última − 1 | Versión mínima del front (426) | V2 2085 (versión de la capa de datos) — **Reemplazado** |
| PRM-NFR-110 | `nfr.ops.maintenanceWindow` | `{weekday, from, to, tz}` | P | domingo 02:00–06:00 ART | Ventana de mantenimiento (PA-NFR-12) | — |
| PRM-NFR-111 | `nfr.ops.freezeCalendar` | [rango] | T | días de lote y primeros vencimientos | Congelamiento | — |
| PRM-NFR-112 | `nfr.obs.traceSampleRate` | decimal | P/T (temporal) | 0,10 | Muestreo de trazas | — |
| PRM-NFR-113 | `nfr.obs.logRetentionDays` | `{hot, securityArchive}` | P | 30 / 365 | Retención de logs | V2 −1 (envío de errores por mail) — **Reemplazado** |
| PRM-NFR-114 | `nfr.obs.debugMaxMinutes` | int | P | 60 | Duración máxima de `debug` temporal | — |
| PRM-NFR-115 | `nfr.slo.targets` | map servicio → % | P | 99,5 comprometido; 99,9 interno para cobros | Objetivos SLO (DEC-063) | — |
| PRM-NFR-116 | `nfr.alert.dedupMinutes` | int | P/regla | 30 | Ventana de deduplicación | — |
| PRM-NFR-117 | `nfr.alert.outboxLagSec` | int | P | 60 | Umbral de lag de outbox | — |
| PRM-NFR-118 | `nfr.alert.queueAgeMin` | `{critical, default}` | P | 2 / 15 | Antigüedad máxima en cola | — |
| PRM-NFR-119 | `nfr.backup.alertMissingHours` | int | P | 26 | Alerta si falta backup diario | V2 2786/2051 (aviso de backups vencidos) — **Reemplazado** |

### 15.8 Indicadores (fórmula, universo, fecha de corte — AGR-022)

| IND-ID | Indicador | Fórmula | Universo | Corte / frecuencia |
|---|---|---|---|---|
| IND-NFR-01 | Disponibilidad mensual | minutos disponibles ÷ minutos del mes excluyendo mantenimiento programado | Servicio y tenant | Mes calendario en hora del tenant; diario |
| IND-NFR-02 | Latencia p95/p99 por tipo de operación | percentiles del histograma de duración | Rutas de la categoría (7.2) | Ventana móvil 30 días; 1 min |
| IND-NFR-03 | Presupuesto de error consumido | (1 − SLI) ÷ (1 − SLO) | SLO definidos | 30 días móviles |
| IND-NFR-04 | Throughput de lote | comprobantes procesados ÷ minutos de ejecución | Lotes completados | Por lote |
| IND-NFR-05 | MTTA / MTTR | promedio (reconocimiento − disparo) / (resolución − disparo) por severidad | Alertas e incidentes | Mensual |
| IND-NFR-06 | Tasa de éxito ARCA | autorizados ÷ enviados (excluye observados, reportados aparte) | Comprobantes del período | Diario |
| IND-NFR-07 | Solicitudes de derechos en plazo | respondidas en plazo ÷ respondidas | Solicitudes cerradas del trimestre | Trimestral |
| IND-NFR-08 | Vulnerabilidades abiertas por severidad y antigüedad | conteo con antigüedad > plazo de RNF-NFR-092 | Producción | Diario |
| IND-NFR-09 | Cobertura de pruebas y de aislamiento | líneas/ramas cubiertas; rutas con caso de aislamiento ÷ rutas | Repositorio | Por PR y liberación |
| IND-NFR-10 | Simulacros exitosos | simulacros `exitoso` ÷ simulacros planificados | `restoreTests` | Trimestral |
| IND-NFR-11 | RPO/RTO medidos | valores de `restoreTests` | Último simulacro por tipo | Por simulacro |
| IND-NFR-12 | Diferencias de invariantes | diferencias no explicadas | JOB-NFR-06 por tenant | Diario |
| IND-NFR-13 | Consumo de cuota | uso ÷ cuota por recurso | Tenant | Diario |
| IND-NFR-14 | Lag de outbox | antigüedad del evento pendiente más antiguo | Plataforma | 1 min |
| IND-NFR-15 | Web Vitals p75 | p75 de LCP, INP, CLS (RUM) | App y tenant | 28 días móviles |
| IND-NFR-16 | Métricas DORA | RNF-NFR-173 | Repositorio | Trimestral |
| IND-NFR-17 | Primera respuesta de soporte en plazo | tickets con primera respuesta dentro del plazo de su severidad ÷ tickets abiertos | Tickets de soporte de plataforma del mes, por tenant y severidad (RNF-NFR-252) | Mensual |
| IND-NFR-18 | Tickets técnicos resueltos sin acceso temporal | tickets técnicos cerrados sin `supportAccessGrants` ÷ tickets técnicos cerrados | Tickets técnicos del trimestre (RNF-NFR-257) | Trimestral |
| IND-NFR-19 | Referencias rotas abiertas | conteo de hallazgos abiertos de JOB-NFR-25 por colección y antigüedad (días desde el primer informe) | Tenant (RNF-NFR-260, DEC-100) | Diario, al terminar la corrida nocturna |

### 15.9 Requisitos no funcionales complementarios: mantenibilidad, portabilidad, usabilidad operativa, costos, soporte y crecimiento

| ID | Requisito | Métrica / meta | Criterio verificable | Origen | Prioridad | Ola | Estado |
|---|---|---|---|---|---|---|---|
| RNF-NFR-240 | Fronteras de módulo (DEC-003): cada módulo de dominio (`apps/api/src/modules/<cod>`) es dueño de sus colecciones; otro módulo solo invoca su servicio público (`index.js` del módulo) o consume sus eventos; prohibido importar modelos Mongoose, repositorios o archivos internos de otro módulo y prohibido escribir en colecciones ajenas. | 0 violaciones de dependencias entre módulos. | Regla de `dependency-cruiser` (o equivalente) en CI que falla ante un import cruzado; prueba de que cada colección tiene un único módulo escritor declarado en el catálogo de colecciones (T05). | DEC-003; AGR §5.1 (responsabilidades claras) | Núcleo | O0 | Adoptado |
| RNF-NFR-241 | Calidad de código estática: ESLint (reglas de seguridad, Vue, importaciones, prohibiciones de RNF-NFR-086, 120, 187, 206, 235, 238) y Prettier obligatorios; contratos tipados derivados de los esquemas Zod (`z.infer`) y verificación de tipos con `// @ts-check`/JSDoc o TypeScript en `packages/shared/*`; sin código muerto ni dependencias no usadas. | 0 errores de lint al fusionar; 0 dependencias sin uso (`knip` o equivalente). | Gate del pipeline (RNF-NFR-164). | CNX §2.1, §2.2 | Núcleo | O0 | Adoptado |
| RNF-NFR-242 | Complejidad y duplicación acotadas: complejidad ciclomática por función ≤ 15 (advertencia) y ≤ 25 (error); archivo fuente ≤ 600 líneas salvo generados; duplicación de código ≤ 3 % por paquete; funciones de cálculo (tarifa, fiscal, mora, imputación) puras y separadas de E/S (CNX §2.2 `lib/`). | Umbrales cumplidos en `main`. | Informe de análisis estático por PR (jscpd + regla de complejidad). | CNX §2.2; AGR-011 | Estándar | O0 | Adoptado |
| RNF-NFR-243 | Registro de decisiones de arquitectura (ADR) en `docs/adr/NNNN-titulo.md` (contexto, decisión, alternativas, consecuencias, estado): una por cada DEC, por cada contraposición técnica resuelta (CTR) y por cada decisión que afecte a más de un módulo o a la seguridad. | 100 % de DEC-001..010 y CTR técnicas con ADR enlazado. | Revisión de cierre de ola. | DEC-010; AGR §5 | Estándar | O0 | Adoptado |
| RNF-NFR-244 | Documentación técnica generada desde el código y sin deriva: OpenAPI (RNF-NFR-143), catálogo de eventos con esquemas, catálogo de jobs (nombre, cola, frecuencia, idempotencia, cuota), catálogo de capabilities (T02), catálogo de parámetros (T04), inventario de datos personales (RF-NFR-001), catálogo de alertas con runbook (RNF-NFR-132); README por módulo con responsabilidades, colecciones y eventos. | 100 % de rutas, eventos, jobs, capabilities y parámetros presentes en los catálogos generados. | Script de CI que compara el registro en tiempo de ejecución con los catálogos y falla ante una diferencia. | AGR-035; BASE §59 (documentar) | Núcleo | O0 | Adoptado |
| RNF-NFR-245 | Portabilidad de infraestructura (DEC-004): todos los componentes (API, workers, admin, PWA, landing, agente) se entregan como imágenes OCI; los servicios de nube se consumen detrás de adaptadores (`storage` S3-compatible, `kms`, `secrets`, `mailer`, `sms`, `push`, `queue`) con al menos una implementación de referencia en AWS y una implementación local/abierta (MinIO, gestor de secretos autoalojado, KMS local para no producción, Redis, MongoDB Community en replica set). | Despliegue completo en un entorno alternativo sin cambios de código, solo de configuración. | Ensayo anual de despliegue en el entorno alternativo con suite e2e de humo verde; prueba en CI que ejecuta integración con los adaptadores locales. | DEC-004 | Núcleo | O0 | Adoptado |
| RNF-NFR-246 | Portabilidad de datos del tenant (salida, T01; AGR-033): exportación completa en formatos abiertos — JSON por colección con esquema documentado, CSV para tablas planas, archivos originales con su metadato y manifiesto con hashes SHA-256 — sin secretos ni credenciales; disponible para descarga por URL firmada y con vencimiento. | Datos de un tenant grande ≤ 2 h (RNF-NFR-016) y archivos ≤ 24 h; 100 % de colecciones con `tenantId` incluidas. | Simulacro con TEN-099 ficticio: reimportación en un ambiente vacío y conciliación de conteos y hashes. | AGR-033; BASE §59 ("la información es de la cooperativa") | Núcleo | O1 | Adoptado |
| RNF-NFR-247 | Interoperabilidad: formatos estándar en toda interfaz pública — fechas ISO 8601 con zona, importes como cadena decimal con moneda (RNF-NFR-201), UTF-8, RFC 9457 para errores, OpenAPI 3.1, paginación uniforme `{ items, total, page, size }` y por cursor para extracción incremental; webhooks salientes (cuando un caso los requiera, AGR-021) con sobre estable (`id`, `type`, `tenantId`, `occurredAt`, `schemaVersion`, `data`), firma HMAC-SHA-256 con secreto por suscripción, reintentos con backoff y consulta de entregas. | 100 % de rutas públicas validadas contra estas convenciones. | Linter de OpenAPI (Spectral o equivalente) con reglas propias en CI. | AGR-021; guía §5 (API) | Estándar | O1 | Adoptado |
| RNF-NFR-248 | Autogestión tolerante a errores (AGR-032): los formularios largos (solicitud de servicio, alta de persona, reclamo con fotos, encuesta, solicitud de derechos) guardan borrador local cada ≤ 10 s y en servidor al cambiar de paso; tras recargar, cerrar la app o perder la sesión se recupera el borrador; un error de validación conserva todos los datos y enfoca el primer campo con error; existe alternativa al mapa para elegir domicilio. | 0 pérdida de datos en las pruebas de recarga, cierre y expiración de sesión. | Prueba Playwright por formulario largo. | AGR-032; CNX §3.5 | Núcleo | O2 | Adoptado |
| RNF-NFR-249 | Retroalimentación de operaciones: toda acción con respuesta > 1 s muestra indicador de progreso; > 10 s pasa a job con barra de progreso, posibilidad de seguir trabajando y notificación al terminar (reemplaza `frmProgressBar_WithLog` modal de ProCoop); los mensajes de resultado dicen qué pasó, qué queda pendiente y qué hacer, por clave de diccionario. | 0 pantallas bloqueadas > 10 s sin progreso. | Prueba Playwright con latencia inyectada. | AGR-016 (estados observables); INV `frmProgressBar_WithLog` | Estándar | O0 | Adoptado |
| RNF-NFR-250 | Medición de consumo por tenant (FinOps): cómputo de workers (segundos por cola), almacenamiento (GB de base y de objetos), mensajes por canal, llamadas de IA y tokens, consultas de BI, exportaciones y transferencia de red, consolidados por hora y por mes, para el plan contratado y la facturación de la plataforma (T01, BASE §97.11). | Consumo mensual por tenant disponible el día 2 de cada mes con error ≤ 2 %; alerta al tenant y a plataforma al superar 80 % y 100 % del plan. | Conciliación del consumo medido contra la facturación del proveedor de nube en staging. | BASE §97.11; AGR-020 | Estándar | O1 | Adoptado |
| RNF-NFR-251 | Topes de costo de servicios variables: IA, SMS y WhatsApp con tope mensual por tenant (PRM-NFR-096, PRM-NFR-097); al alcanzarlo, la IA se degrada a "sin IA" (el flujo continúa, RNF-NFR-098) y los mensajes no transaccionales se pausan con aviso al administrador; los transaccionales críticos (corte, vencimiento, constancias) no se pausan sin decisión del tenant. | 0 superaciones del tope sin aviso previo al 80 %. | Prueba de integración con tope bajo. | AGR-030; CNX §2.7 | Estándar | O2 | Adoptado |
| RNF-NFR-252 | Soporte a cooperativas (BASE §64.5; T01 opera la mesa): tickets de soporte de plataforma con severidad y tiempos de primera respuesta — Crítica (operación detenida, cobro o facturación imposible) ≤ 1 h 24×7; Alta (función principal degradada) ≤ 4 h hábiles; Media ≤ 1 día hábil; Baja ≤ 3 días hábiles; resolución o plan de acción comunicado en ≤ 1 día para Crítica; el soporte diagnostica con `correlationId`, logs redactados y trazas, sin acceder a datos personales salvo acceso temporal (AGR-034). | ≥ 95 % de tickets con primera respuesta en plazo por mes (IND-NFR-17). | Indicador mensual por tenant. | BASE §64.5; AGR-034 | Núcleo | O1 | Adoptado (DEC-063) |
| RNF-NFR-253 | Comunicaciones con estados verificables (AGR-024; dueño T09): cada mensaje registra creado, encolado, aceptado por proveedor, entregado, leído (si el canal lo informa), fallido y evidencia; una constancia regulada (intimación, aviso de corte, constancia de baja) no se da por cumplida con "aceptado por proveedor"; un fallo de entrega genera acción (canal alternativo o tarea). | 100 % de mensajes con estado final o "sin confirmación" en ≤ 72 h; 0 constancias reguladas sin evidencia de entrega o tarea. | Prueba de integración con proveedor simulado que acepta pero no entrega. | AGR-024 | Núcleo | O2 | Adoptado |
| RNF-NFR-254 | Expediente documental (AGR-023; dueño T11): versiones inmutables con hash (RNF-NFR-230), sustitución explícita con motivo que conserva la anterior, clasificación por finalidad y sensibilidad, revocación de enlaces y autorizaciones efectiva ≤ 60 s (un enlace antiguo deja de abrir el documento). | Enlace revocado devuelve 403 en ≤ 60 s. | Prueba e2e. | AGR-023 | Núcleo | O1 | Adoptado |
| RNF-NFR-255 | Alta operativa de un tenant (T01; escenario 22): desde la aprobación comercial hasta administración habilitada, landing publicada con marca y diccionario base, sin intervención de desarrollo ni despliegue. | ≤ 1 día hábil; la parte automatizada (crear tenant, claves DEK, buckets/prefijos, roles base, configuración inicial) ≤ 10 min. | Prueba e2e de alta de tenant en staging. | BASE §34 esc. 22; T01 | Estándar | O1 | Adoptado |
| RNF-NFR-256 | Reversibilidad de configuración (BASE §97.9; dueño T04): toda publicación de configuración versionada puede revertirse a la versión anterior sin pérdida de datos operativos creados en el intervalo, con efecto en todos los nodos ≤ 60 s (RNF-NFR-028); la reversión es una nueva publicación auditada. | Reversión ≤ 5 min de punta a punta. | Prueba de integración publicar → revertir. | BASE §97.9; AGR §5.4 | Núcleo | O1 | Adoptado |
| RNF-NFR-257 | Diagnóstico sin datos personales: el soporte y la guardia disponen de una vista de "seguimiento de operación" por `correlationId`/`jobId` que muestra la cadena request → auditoría → outbox → job → conector con tiempos, estados y errores redactados (RNF-NFR-119, 121), suficiente para resolver ≥ 80 % de los tickets técnicos sin acceso temporal a datos. | ≥ 80 % de tickets técnicos resueltos sin acceso temporal (medición trimestral). | Indicador IND-NFR-18. | AGR-034; BASE §54 | Estándar | O1 | Adoptado |
| RNF-NFR-258 | Agente de hardware local (turnero, impresoras térmicas/fiscales, lectores, balanzas, tótems — DEC-007, M09/M07/M10): servicio instalado en el puesto que solo inicia conexiones salientes (sin puertos entrantes), autenticado con certificado por dispositivo (mTLS) emitido y revocable desde el admin (DEC-092: lo emite una CA privada de la plataforma, con un emisor intermedio por tenant, al completar el emparejamiento de RF-INT-084 a partir de una solicitud de firma generada en el puesto, sin que la clave privada salga de él; vigencia 90 días; renovación automática por el canal ya autenticado desde 30 días antes del vencimiento; la revocación corta las sesiones abiertas en menos de 5 minutos), vinculado a un tenant y sucursal; ejecuta solo comandos de una lista declarada (sin ejecución arbitraria ni invocación por reflexión — RN-09 §5.5); actualizaciones firmadas y verificadas (RN-NFR-023); cola local cifrada ante corte de red; nunca almacena datos de tarjeta (RN-NFR-009) ni credenciales SQL; heartbeat cada 60 s visible en el tablero del tenant. | Revocación de un dispositivo efectiva ≤ 5 min; 0 puertos en escucha en el escaneo del puesto. | Prueba de revocación, escaneo de puertos y verificación de firma de actualización en el laboratorio de hardware. | DEC-007; RN-09 §5.5, §5.7, §5.8 (`Agente Procoop.exe`); RN-13 §17 (tótem) | Núcleo | O10 | Adoptado |
| RNF-NFR-259 | Crecimiento de datos sostenible: colecciones de alto volumen (movimientos de cuenta corriente, ítems de comprobantes, lecturas, `auditLogs`, eventos de outbox procesados, mensajes) con estrategia de archivo por antigüedad (en línea 36 meses para el detalle —renglones de comprobantes, lecturas de intervalo, llamadas, bitácoras y detalle de cobranzas— y luego archivo cifrado con consulta diferida y trazabilidad según PRM-NFR-040 a 055; comprobantes, recibos y asientos con sus PDF quedan siempre en línea; DEC-087, T05 §7.8.2; antes "en línea ≥ 24 meses") definida en T05; TTL para efímeros (`idempotencyKeys`, `inboxReceipts` vencidos, `locks`, sesiones, exportaciones); índices de trabajo en memoria ≤ 70 % de la RAM del nodo primario; revisión trimestral de índices no usados. | Índices ≤ 70 % RAM; 0 índices sin uso > 90 días sin justificación. | Informe trimestral de `$indexStats` y tamaño de colecciones; alerta de crecimiento > 20 % mensual no previsto. | AGR-020; DEC-002 | Estándar | O1 | Adoptado |

## 16. Casos de uso

### 16.1 Casos de uso originales de BASE (en lo que toca a T08)

| CU | Resumen (BASE) | Exigencias de T08 |
|---|---|---|
| CU-29 (BASE §29) | Alta de USR-CAJ-01 con rol Cajero en TEN-001 restringido a sucursal; intento de cambiar tarifa o anular sin aprobación es denegado y registrado; al perder la función se revocan permisos y sesiones. | RNF-NFR-062 (revocación ≤ 60 s), RNF-NFR-090, RNF-NFR-110, RNF-NFR-115, RNF-NFR-150. |
| CU-GOB-01 (BASE §54) | Cambio de BON-VAR-30 del 30 % al 20 % con vigencia futura y aprobación; evidencia visible al usuario autorizado; TEN-002 no ve los eventos. | RNF-NFR-110 a 113, RNF-NFR-117, RNF-NFR-148. |
| CU-API-01 (BASE §59) | CLI-BI-A con alcances `facturacion:leer` y `cobranza:leer` consulta TEN-001 paginado con fecha de corte; no accede a TEN-002 ni modifica; revocación efectiva. | RNF-NFR-019, RNF-NFR-022, RNF-NFR-103, RNF-NFR-233, RNF-NFR-175. |
| CU-SEG-01 (BASE §60) | USR-ADM-A registra factor, opera con verificación reforzada, recupera contraseña sin perder el factor y usa el procedimiento de pérdida de factor; se notifican cambios e invalidan sesiones. | RNF-NFR-060 a 066, RNF-NFR-231, RNF-NFR-232. |
| CU-SaaS-01 (BASE §64.6) | La cooperativa se incorpora sin servidores propios y registra SUP-DEMO-001 en el soporte de plataforma. | RNF-NFR-030 a 034, RF-NFR-019, RNF-NFR-134, RNF-NFR-237. |
| CU-ARQ-01 (BASE §58; dueño T11; la parte de plataforma de T01 es CU-PLA-15; aquí solo se citan los RNF) | Pedido de Internet que pasa por CRM, técnica, contratos y ERP sin que un reintento genere dos contratos o dos facturas. | RNF-NFR-212 a 215, RNF-NFR-221. |

### 16.2 Casos de uso nuevos

**CU-NFR-01 — Un socio pide acceso a sus datos.** Actor: socia ficticia ASO-001 de TEN-001. Desde PAN-NFR-09 pide "Descargar mis datos". Como está autenticada con MFA la solicitud queda `verificada`; JOB-NFR-02 localiza sus datos y JOB-NFR-01 genera el informe. El responsable de datos revisa y aprueba; la socia recibe aviso y descarga el PDF por URL firmada de 5 min. Control: el informe no incluye datos de su hermano que comparte domicilio (escenario 88) ni de TEN-002. Plazo: ≤ 10 días corridos (RNF-NFR-107).

**CU-NFR-02 — Supresión con obligación de conservación.** Un ex-socio sin servicios activos pide la supresión. Tiene facturas de hace 3 años. El análisis propone: suprimir teléfono, correo, preferencias, consentimientos promocionales y comentarios del muro; **bloquear** facturas, recibos y contrato (PRM-NFR-040/041) hasta su vencimiento; anonimizar tickets cerrados. Aprobación por un segundo usuario; EVT-NFR-06 a cada módulo; registro en `erasureLedger`; respuesta fundada al titular. Control: ninguna factura se borra (RN-NFR-017).

**CU-NFR-03 — Revocación de consentimiento promocional.** El socio desactiva "Novedades comerciales" en PWA. EVT-NFR-03 llega a COM y en ≤ 5 min queda fuera de audiencias promocionales; sigue recibiendo avisos de factura y corte (transaccionales, RF-NFR-005).

**CU-NFR-04 — Incidente: credencial de pasarela expuesta.** Una alerta de secret scanning detecta una credencial de sandbox en un PR (o una alerta de uso anómalo detecta uso de una credencial productiva). Se abre INC en `detectado`, se rota la credencial en la bóveda (≤ 4 h, RNF-NFR-069), se evalúa impacto, se notifica a la cooperativa en el plazo de PA-NFR-08 y se cierra con post-mortem.

**CU-NFR-05 — Restauración selectiva con operaciones externas (ESC-04).** Un operador de TEN-001 importa por error un archivo que sobrescribe domicilios de 5.000 cuentas. El tenant solicita restauración (API-NFR-21). Plataforma restaura TEN-001 a T−2 h en ambiente aislado (RNF-NFR-037), compara y reincorpora solo domicilios; JOB-NFR-19 verifica que los pagos confirmados y los CAE obtenidos después de T−2 h se conservan; JOB-NFR-15 reaplica supresiones. TEN-002 no se afecta.

**CU-NFR-06 — Lote interrumpido y reanudado.** Durante `fac:emitir-lote` de 50.000 suministros cae un worker al 60 %. El lote se reanuda desde el checkpoint en ≤ 2 min, termina dentro de la meta (RNF-NFR-010) y no hay comprobantes duplicados (índice único RNF-NFR-213; escenario 6).

**CU-NFR-07 — Tenant ruidoso.** TEN-002 lanza la exportación completa de su historia mientras TEN-001 cobra en 30 cajas. La exportación corre en cola `bulk` con cuota (RNF-NFR-020, 021); los cobros de TEN-001 mantienen p95 ≤ 800 ms (AGR-020).

**CU-NFR-08 — Archivo infectado.** Un técnico sube una foto que en realidad es un ejecutable renombrado: se rechaza por firma de contenido (RNF-NFR-078). Un PDF con malware pasa el tipo pero el antivirus lo detecta: queda en cuarentena, la orden sigue sin el adjunto y se genera EVT-NFR-16.

**CU-NFR-09 — Liberación bloqueada.** Una versión tiene una vulnerabilidad alta en una dependencia y una ruta nueva sin caso de aislamiento; el pipeline bloquea la promoción a producción (RNF-NFR-148, RNF-NFR-165) hasta corregir.

**CU-NFR-10 — Rotación de DEK de un tenant.** Por política anual se rota la DEK general de TEN-001: se crea la versión nueva, la anterior pasa a `soloDescifrado`, JOB-NFR-08 re-cifra en segundo plano sin indisponibilidad y la consola muestra el progreso.

**CU-NFR-11 — Pago excedente con webhook duplicado (ESC-01 + escenario 7).** Hermano A (deuda ARS 13.000) paga ARS 15.000 por pasarela; el webhook llega 3 veces. Se confirma un solo pago, se imputan ARS 13.000 y ARS 2.000 quedan a favor; B no se ve afectado.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Escenarios de calidad de AGR

| ESC | Descripción (AGR §6) | Cómo se verifica en T08 | Requisitos |
|---|---|---|---|
| ESC-01 | Pago excedente de un hermano: A debe ARS 13.000 y paga ARS 15.000; B tiene deuda propia; se confirman 13.000 contra A y 2.000 quedan a favor o pendientes; no se paga a B. | Prueba de integración y e2e con dataset canónico; propiedad monetaria "no se crea ni se pierde un centavo"; webhook triplicado. | RNF-NFR-152, 204, 205, 212, 213, 218, 229 |
| ESC-02 | Corrección recibida después de emitir: emitido ARS 12.000, recalculado ARS 15.000; se simula la diferencia de ARS 3.000, se aprueba y se conserva el original. | Prueba de que la simulación no escribe; que el original no cambia (hash RNF-NFR-230); auditoría del ajuste. | RNF-NFR-110, 179, 223, 230 |
| ESC-03 | Instalación offline en conflicto: la orden se modifica mientras el instalador está sin conexión; al sincronizar se conserva la evidencia y se detecta el conflicto, sin duplicar salida de equipo. | Suite Playwright offline + integración de sincronización. | RNF-NFR-017, 156, 187, 190, 213, 219 |
| ESC-04 | Recuperación con operaciones externas posteriores a la copia: se restaura información anterior a un pago o emisión fiscal; se reconcilian identificadores externos y no se reenvía. | Simulacro trimestral con emisión y pago posteriores al punto de restauración. | RNF-NFR-037, 043, 044, 045, 217, 221 |
| ESC-05 | Cambio de condiciones en un período parcialmente procesado: el lote mantiene universo y versiones aplicadas; reejecutar no reescribe documentos. | Prueba de lote con cambio tarifario a mitad; reejecución sin cambios. | RNF-NFR-013, 179, 215, 216, 223 |

### 17.2 Escenarios de validación de BASE §34 alcanzados

| Escenario BASE §34 | Requisitos que lo verifican |
|---|---|
| 5. Reproducir una liquidación anterior tras cambio de tarifa | RNF-NFR-179, 223 |
| 6. Proceso masivo interrumpido continúa sin duplicados | RNF-NFR-013, 151, 215 |
| 7. Doble confirmación de pago | RNF-NFR-018, 088, 218 |
| 8. Pago pendiente luego rechazado | RNF-NFR-221 |
| 14. Migración de saldos coincidente | RNF-NFR-154 |
| 15. Restaurar una copia y continuar operando | RNF-NFR-037, 043, 044 |
| 16. Usuario de TEN-001 intenta acceder a TEN-002 | RNF-NFR-090, 148, 238 |
| 17. Admin de cooperativa intenta privilegios de plataforma | RNF-NFR-150 |
| 18. Socio solo ve sus cuentas autorizadas | RNF-NFR-090, 150 |
| 19. Búsquedas y reportes con códigos internos iguales | RNF-NFR-148 |
| 20. Revocación de rol corta el acceso | RNF-NFR-062 |
| 21. Marca de TEN-001 no altera TEN-002 | RNF-NFR-148, 182 |
| 29. Resumen no incorpora facturas de otro socio ni tenant | RNF-NFR-148, 205 |
| 30. Pantalla visible sin acción permitida | RNF-NFR-150 |
| 34. IA equivocada no produce baja ni cobro | RN-NFR-012; RNF-NFR-098 |
| 36. Último turno reservado por dos socios | RNF-NFR-220 |
| 39. Simulación tarifaria sin efectos | RNF-NFR-223 |
| 42. Todo cambio persistente auditado | RNF-NFR-110, 111 |
| 43. Dashboards aislados | RNF-NFR-136 |
| 45. Token de BI de TEN-001 no consulta TEN-002 | RNF-NFR-148, 233 |
| 46. Credencial revocada/vencida no se usa | RNF-NFR-233 |
| 47. Google no concede afiliación por correo | RNF-NFR-232 |
| 48. Recuperación no elimina el segundo factor | RNF-NFR-232 |
| 50. Reintento fiscal no duplica retenciones | RNF-NFR-212, 221 |
| 53. Etiqueta faltante usa texto base | RN-NFR-027; RNF-NFR-192 |
| 54. Cambiar nombre visible no altera API | RNF-NFR-175 |
| 59. Ciclo batch sin duplicar por solapamiento o reintento | RNF-NFR-213, 215, 216 |
| 61. Autorización fiscal con observaciones no se reemite | RNF-NFR-011, 221 |
| 70. Repetir sincronización de cierre de instalación sin duplicar | RNF-NFR-190, 219 |
| 71. Factura y cobro rastreables a imputaciones y asientos | RNF-NFR-119, 229 |
| 72. Distribución entre centros conserva el total | RNF-NFR-204 |
| 73. Escenario simulado no modifica producción | RNF-NFR-223 |
| 82. Copia de servicio sin datos personales ni secretos | RN-NFR-013 |
| 86. Capacidades Connectyx conservan aislamiento | RNF-NFR-148 |
| 94. Banco de sangre sin stock comercial | RNF-NFR-102 |

### 17.3 Criterios de aceptación transversales (por ola)

1. **Aislamiento:** la suite RNF-NFR-148 cubre el 100 % de rutas y jobs nuevos de la ola, sin fallas.
2. **Permisos negativos:** cada capability nueva tiene su caso negativo (RNF-NFR-150).
3. **Reintentos e interrupción:** cada job y operación económica nueva tiene prueba de falla a mitad y doble envío (RNF-NFR-151).
4. **Conciliación:** desde O5, JOB-NFR-06 sin diferencias en el dataset canónico tras el recorrido de la ola.
5. **Rendimiento:** las metas de la sección 7 aplicables a la ola se cumplen en staging (RNF-NFR-145).
6. **Seguridad:** matriz ASVS actualizada, 0 hallazgos altos abiertos (RNF-NFR-050, 092, 095).
7. **Privacidad:** campos nuevos con `x-pii`; inventario y registro de tratamientos actualizados (RF-NFR-001, 002).
8. **Accesibilidad:** 0 violaciones `serious`/`critical` (RNF-NFR-155).
9. **Observabilidad:** métricas, logs y trazas de los procesos nuevos visibles; alertas con runbook (RNF-NFR-125, 132).
10. **Evidencia:** la liberación de cierre de ola tiene `qualityEvidence` completa y aprobada (RF-NFR-022).

## 18. Datos de precarga de demostración (ficticios)

Solo en ambientes `demo`, `staging` y `ci`; el seed se niega a ejecutar en producción (RNF-NFR-099). Sin contraseñas, semillas, tokens ni certificados reales.

| Dato | Valor ficticio |
|---|---|
| Tenants | TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099 "Cooperativa en baja" (para RNF-NFR-108); todos con `isFictitious: true` |
| Personas | ASO-001 (socia, con MFA), ASO-002 y ASO-003 (hermanos, mismo domicilio ficticio), ADH-001 (menor adherente con representante ASO-002); documentos y CUIT generados con dígito verificador válido en rango ficticio; correos `@ejemplo.test` |
| Usuarios | USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin TEN-002), USR-PLAT-01 (plataforma), USR-SRE-01 |
| Registro de tratamientos | Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas |
| Avisos | AVI-DEMO-001 v1 y v2 (landing), AVI-DEMO-002 v1 (app) |
| Consentimientos | ASO-001 otorgó "Novedades comerciales" con AVI v1 y lo revocó; ASO-002 vigente |
| Solicitudes | DSR-2026-000001 (acceso, `respondida`), DSR-2026-000002 (supresión con bloqueo de facturas, `pendienteAprobacion`), DSR-2026-000003 (rectificación, vencida al 80 % para mostrar alerta) |
| Bloqueo legal | LH-DEMO-001 sobre la cuenta de ASO-003 por "litigio" ficticio, `activo` |
| Incidente | INC-2026-0001 tipo `simulacro`, SEV3, cerrado con post-mortem |
| Simulacro | RST-DEMO-001 restauración selectiva de TEN-001 con RPO medido 4 min y RTO 3 h 10 min (valores ilustrativos) |
| Claves | Metadatos de DEK por tenant (sin material), una en `soloDescifrado` |
| Alertas | ALR-DEMO-001 "Certificado ARCA vence en 29 días" (certificado ficticio), ALR-DEMO-002 "Lag de outbox > 60 s" resuelta |
| Evidencia | Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento |
| Dataset de carga | Generador `seed:carga --perfil=grande` con 150.000 suministros y 5 años de movimientos sintéticos, solo en staging |

## 19. Migración desde ProCoop

| Origen ProCoop | Destino | Transformación | Validación |
|---|---|---|---|
| `USERS` (contraseñas con `Nucleo.Encriptar`) | `users` (T02) | **No se migran contraseñas** (reversibles, consideradas comprometidas). Se migran alias, nombre, punto de venta, área y depósitos; primer acceso por enlace de activación + MFA obligatorio para administradores. | 0 hashes o contraseñas de origen en destino. |
| `PERFILES`, `MENUSYS`, `MENUVAL`, `MODULOS` | Roles/perfiles (T02) | Mapeo de opciones de menú a capabilities; `iNivel = -1` no se replica. | Revisión de la matriz por la cooperativa. |
| `AUDITO`, `AUDITORIA`, `INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA` | Archivo histórico de solo lectura (T07) | Se importan como eventos `legacy` en colección de archivo, sin mezclarlos con la cadena de hash nueva; se aplica PRM-NFR-042/043. | Conteo por tabla y período. |
| `BLOQUEO_FILAS`, `AUTORIZACIONES` | — / workflow (T11) | No se migran bloqueos; autorizaciones pendientes se cierran antes del corte o se recrean. | Cero pendientes al corte. |
| Credenciales en `VARIABLE`, `.pro`, `CORREOS_INTERNOS`, `INTERBANKING`, `PAGOS360`, `V2_*` | Bóveda por tenant (T06) | **No se migran automáticamente**: la cooperativa genera credenciales nuevas (rotación) y las carga en la bóveda con "probar conexión"; las anteriores se revocan ante el proveedor. Incluye la clave del proveedor de IA guardada en `VARIABLE` (RN-09 var 3048, reemplazada por RF-IAM-151; DEC-103). | Checklist de credenciales rotadas por conector. |
| Clave web de socios (`SOCIOS`; M01 RN-PER-119) y credenciales de proveedores, profesionales y empleados si aparecen en la base real (DEC-103) | — (portal y usuarios de T02, M19) | **No se migran**: se suprimen en la extracción (T07 RN-MIG-013); el acceso se rehabilita por invitación o enlace de un solo uso (RF-IAM-041, PA-MIG-07). | 0 columnas de clave en staging ni en destino. |
| Escaneo previo de la base de origen (DEC-103) | — | Antes de cada extracción, T07 escanea el origen buscando números de tarjeta (validación de Luhn) y columnas con apariencia de credencial no listadas en RN-MIG-013, incluida `CUPONTAR` (cupones de tarjeta); un hallazgo bloquea la migración hasta que la columna se clasifique y se agregue a la supresión. El informe guarda tabla, columna, tipo de hallazgo y cantidad de filas, nunca valores (RN-NFR-003, RN-NFR-009). | Escaneo sin hallazgos abiertos como condición de cada extracción; prueba con una columna sembrada con un número de prueba válido por Luhn que bloquea la corrida. |
| `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS` | Clientes de API (T02/T10) | Se emiten tokens nuevos (RNF-NFR-233); los anteriores se revocan al by-pass. | Inventario de clientes externos avisados. |
| Datos personales de socios y empleados | Colecciones de M01, M16, M18 | Clasificación `x-pii`, cifrado de campos sensibles en la carga, normalización; base legal por finalidad registrada; consentimientos inexistentes en origen: se registran como "sin consentimiento" para finalidades que lo requieran y se solicita en el primer acceso. | Conteos y muestreo de cifrado (RNF-NFR-055). |
| Datos de salud (BancoSangre, ambulancias, sepelio) | M18 con RNF-NFR-100 | Carga en ambiente aislado, cifrado con DEK `salud`; acceso solo de usuarios habilitados. | Auditoría de lecturas desde el primer día. |
| Variables −1, 2085, 2588, 2730/2648/2731, 2786/2051, 2925 | PRM-NFR-113, 106, 083, alertas (PAN-NFR-15), 119, 085 | **Reemplazadas** por parámetros y alertas de plataforma; no se importa su valor salvo el de 2925 como referencia de vencimiento. | Tabla de equivalencias `COD_VAR → clave` (T04). |
| Copias de ProCoop usadas en ensayos | Ambiente aislado de migración | Nunca en `local`, `ci`, `staging` ni `demo`; eliminación al terminar el ensayo con constancia (PA-NFR-19). | Constancia de eliminación por ensayo. |
| `LogProcoop.txt`, archivos `Log360.txt` | — | No se migran (pueden contener secretos y datos personales). | — |

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-NFR-01 | BASE §97.8, §64.5 vs. pedido de metas medibles (DEC-010, guía §10) | BASE propone dimensiones "sin cifras comprometidas" y "no prometer cifras sin acuerdo"; la especificación necesita metas verificables para construir y probar. | Se fijan **metas de ingeniería internas** verificadas en CI y carga sobre un perfil de referencia; el **SLA contractual** se deriva con margen y se acuerda con cada cooperativa (PA-NFR-01 a 04). Se recalibran con la piloto. | 2 (BASE) se respeta al no comprometer contractualmente; las metas internas no contradicen BASE. |
| CTR-NFR-02 | DFA M1 ("una base por cooperativa"), RN-09 §3, CNX §2.3 (decisión pendiente) vs. DEC-002 | Base por cooperativa (aislamiento fuerte) vs. base compartida con `tenantId`. | Base compartida (DEC-002) compensada con cifrado de campo con DEK por tenant y datos asociados con `tenantId` (RNF-NFR-056), suite de aislamiento obligatoria (RNF-NFR-148, 238), restauración selectiva (RNF-NFR-037) y cuotas (RNF-NFR-020). | 1 (DEC-002). |
| CTR-NFR-03 | CNX §2.5 (JWT HS256 [COPIAR]) vs. CNX §10 V-02 y ASVS | Copiar la autenticación tal cual vs. corregir secretos débiles. | Firma asimétrica con `kid` y rotación de 90 días (RNF-NFR-063); se conserva el resto del modelo de CNX (access 15 min, refresh rotativo hasheado, `sessionEpoch`). | 4 (CNX marca su propia deuda como [MEJORAR]); DEC-001 incorpora las mejoras. |
| CTR-NFR-04 | CNX §2.5 (bcrypt costo 12) vs. RN-09 §7.6 (Argon2/bcrypt) y NIST [SEG5] | Algoritmo de hash. | Argon2id preferido; bcrypt ≥ 12 aceptado como mínimo (RNF-NFR-060). | 4 + BASE §60 (estándares actuales). |
| CTR-NFR-05 | CNX §2.6 (validación manual) vs. DEC-001 (Zod) | Validación. | Zod obligatorio en toda ruta (RNF-NFR-082). | 1 (DEC-001). |
| CTR-NFR-06 | CNX §2.6 (schedulers `setInterval`) vs. DEC-001/003 (BullMQ) | Ejecución de jobs. | Workers BullMQ con estado en Mongo (RN-NFR-024, RNF-NFR-041). | 1. |
| CTR-NFR-07 | CNX §2.1/§2.6 (`multer` a disco, `/uploads` público) vs. DEC-001 (almacenamiento privado con URL firmadas) | Archivos. | Almacenamiento privado, cuarentena, antivirus y URLs firmadas (RNF-NFR-058, 078 a 081). | 1. |
| CTR-NFR-08 | CNX §2.8 (autodeploy por SSH, `git reset --hard`, `.env` a mano) vs. DEC-004 y CNX §10 | Despliegue. | Imágenes inmutables firmadas, pipeline con gates, gestor de secretos, sin SSH (RNF-NFR-067, 096, 167, 236, 237). | 1 + 4 ([MEJORAR]). |
| CTR-NFR-09 | CNX §2.8 (timeouts de proxy de 7 min por IA) vs. AGR-020 | Requests largos bloquean recursos interactivos. | Requests ≤ 30 s; IA larga como job asíncrono (RNF-NFR-027). | 3 (AGR) sobre detalle técnico de CNX no marcado como [COPIAR]. |
| CTR-NFR-10 | CNX §3.7 (colas por dominio en `localStorage`) vs. CNX §3.7 [MEJORAR] | Cola offline. | Motor único en IndexedDB (RNF-NFR-187). | 4 (la propia mejora de CNX). |
| CTR-NFR-11 | DFA M1 mejoras ("OpenIddict"; "una base por cooperativa") vs. DEC-001/002 | Tecnología .NET y modelo de base. | Biblioteca OIDC sobre Node (T02); base compartida. | 1. |
| CTR-NFR-12 | ProCoop (backups locales al login/logout, menú "Copia de seguridad") vs. DFA M1 mejora y BASE §64.5 | Responsabilidad de backups. | Responsabilidad exclusiva de la plataforma con restauración probada (sección 8); el usuario no ejecuta backups. | 2 y 5 (DFA ya lo propone). |
| CTR-NFR-13 | ProCoop cultura `es-ES` (RN-09 §5.2) vs. guía §5 (es-AR) | Locale. | `es-AR` (RNF-NFR-192). | Guía/DEC sobre benchmark. |
| CTR-NFR-14 | ProCoop envío de excepciones por correo (variable −1) vs. BASE §97.1 | Privacidad de errores. | Observabilidad interna redactada; sin correos externos (RN-NFR-021). | 2 + deuda de seguridad (Reemplazado). |
| CTR-NFR-15 | BASE §54 (auditoría de lecturas "puede agregarse según necesidad") vs. BASE §97.1 (tratamiento reforzado de salud) | Alcance de la auditoría de lecturas. | Obligatoria para categorías sensibles, exportaciones, soporte y bóveda; opcional para el resto (RNF-NFR-114). | 2 (ambas son BASE; §97.1 es posterior y específica); política final en PA-NFR-16. |
| CTR-NFR-16 | BASE §59 ("los asociados y su info son de la cooperativa") vs. BASE §97.1 y Ley 25.326 | Disponibilidad del tenant vs. derechos del titular. | Ambos: el tenant dispone de sus datos y la plataforma es encargada; los titulares ejercen sus derechos (sección 10). BASE §59 ya lo aclara. | 2. |
| CTR-NFR-17 | BASE §97.1 (supresión) vs. obligaciones fiscales/contables de conservación (BASE §97.1 "se compatibiliza") | Borrar vs. conservar. | Bloqueo + anonimización de lo no obligatorio; documentos económicos nunca se borran (RN-NFR-017, RF-NFR-008). | 2. |
| CTR-NFR-18 | CNX §2.1 (IA por HTTP directo, `AI_PROVIDER=auto`) vs. BASE §97.1 y AGR-030 | Envío de datos a proveedores de IA. | Solo con acuerdo, redacción y exclusión de salud; proveedor fijado por tenant (RN-NFR-010, RNF-NFR-098; PA-NFR-09). | 2 y 3 sobre 4. |
| CTR-NFR-19 | ProCoop control de desfase de reloj del puesto (RN-09 §5.2) vs. modelo SaaS | Fuente de la hora. | Hora del servidor con NTP; hora del cliente solo declarada (RN-NFR-018, RNF-NFR-138). | Mejora sobre benchmark. |
| CTR-NFR-20 | CNX §2.5 (refresh 30 días para todos) vs. riesgo de cuentas de plataforma | Vida del refresh. | 30 días para socios con dispositivo confiable; ≤ 12 h para plataforma y sesión absoluta ≤ 12 h en admin (RNF-NFR-062, 231). | 4 adaptado por BASE §60 (exigencia según riesgo). |
| CTR-NFR-21 | Redacción del propio anexo: dos versiones de la sección 9 escritas en paralelo con la misma numeración RNF-NFR-050 a 099 | IDs con contenidos distintos. | Se conservó la versión coherente con las referencias cruzadas de las secciones 2, 5 y 10–19 y se integraron los controles que solo estaban en la otra como RNF-NFR-230 a 238 (sección 9.14). | Regla de la guía §5: IDs estables y no reutilizados. |
| CTR-NFR-22 | T08 15.1 (`tenantUsageSnapshots`, `processedEvents`, `restoreDrills`, `idempotencyKeys`, `alertRules`/`alertEvents`, `auditEvents`) vs. T01 y T02 (CTR-DAT-21 y CTR-DAT-24 de T05) | Colecciones técnicas definidas dos veces con nombres distintos. | Dueño T01: `usageSnapshots` (COL-PLA-09), `inboxReceipts` (COL-PLA-25), `restoreTests` (COL-PLA-20), `idempotencyKeys` (COL-PLA-28), `alertRules`/`alerts` (COL-PLA-15/16); `auditLogs` de T02; `locks` queda en T08. T08 conserva los requisitos y los campos que necesita; los nombres se corrigieron en el lugar. | Catálogo de datos (T05). |
| CTR-NFR-23 | T08 RNF-NFR-259 ("en línea ≥ 24 meses") y `consentRecords` de T08 vs DEC-087 y `consentRecords` de T09 | Plazo en línea del detalle y esquema de consentimientos con dos versiones. | Detalle en línea 36 meses y archivo con consulta diferida (DEC-087); `consentRecords` de T08 admite los campos de T09 (RF-NFR-004). | DEC > anexo; CTR-DAT-18 |

## 21. Preguntas abiertas

### PA-NFR-01 — Compromiso de disponibilidad (SLA) con las cooperativas
- **Pregunta:** ¿Qué disponibilidad mensual se compromete contractualmente?
- **Contexto:** BASE §97.8 y §64.5 piden definirla sin prometer cifras sin acuerdo; condiciona arquitectura, guardia y costos.
- **Opciones:**
  - A) 99,5 % durante el piloto y 99,9 % en operación general, con guardia 24×7 para SEV1/SEV2 **(Recomendada)** — equilibrio costo/riesgo; cubre facturación y cobranza.
  - B) 99,9 % desde el piloto — mayor costo inicial de infraestructura y guardia.
  - C) Sin SLA formal en el piloto, solo "mejor esfuerzo" — menor costo, riesgo comercial y de confianza.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-030, 134; PRM-NFR-115; O0–O1.
- **Estado:** Respondida (DEC-063): 99,5 % mensual comprometido; soporte lunes a viernes 8–18 con P1 24×7.

### PA-NFR-02 — RPO y RTO
- **Pregunta:** ¿Qué pérdida de datos y tiempo de recuperación se aceptan?
- **Contexto:** AGR-019 pide acordarlos sin inventar cifras; definen tipo de backup, réplica regional y costos.
- **Opciones:**
  - A) RPO ≤ 5 min y RTO ≤ 4 h en plataforma; restauración selectiva de tenant ≤ 8 h; DR regional RPO ≤ 1 h / RTO ≤ 24 h **(Recomendada)** — PITR estándar de Mongo gestionado.
  - B) RPO ≤ 1 h y RTO ≤ 24 h en todos los casos — menor costo, mayor exposición en días de cobranza.
  - C) RPO ≈ 0 y RTO ≤ 1 h con multirregión activa — costo y complejidad altos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-035 a 037, 046; O0, O1, O11.
- **Estado:** Respondida (DEC-063): RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h plataforma completa; los valores más exigentes quedan como objetivos internos; DR regional según la opción A.

### PA-NFR-03 — Perfil de capacidad de referencia
- **Pregunta:** ¿Se adopta el perfil de la sección 7.1 para dimensionar y probar?
- **Contexto:** AGR-020 indica que no existe perfil cuantificado; la DEMO muestra 12.500 comprobantes semanales.
- **Opciones:**
  - A) Tenant estándar 25.000 y grande 150.000 suministros; 100 tenants de diseño y 300 sin rediseño **(Recomendada)** — cubre cooperativas medianas y grandes.
  - B) Tenant grande 50.000 y 50 tenants — dimensionamiento menor; riesgo de rediseño temprano.
  - C) Tenant grande 500.000 — sobredimensiona y encarece las pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-010, 016, 024, 145.
- **Estado:** Respondida (DEC-075): tenant estándar 25.000 suministros y grande 150.000; diseño para 100 tenants y hasta 300 sin rediseño.

### PA-NFR-04 — Meta de facturación masiva
- **Pregunta:** ¿En cuánto tiempo debe completarse un lote de facturación?
- **Contexto:** BASE §97.8 pide fijar el tiempo máximo del lote y de la emisión fiscal.
- **Opciones:**
  - A) Cálculo y documentos de 50.000 suministros ≤ 60 min; CAE ≤ 2 h si ARCA responde normal; PDF ≤ 60 min; distribución ≤ 4 h **(Recomendada)** — permite emitir y distribuir en una jornada.
  - B) Ventana nocturna ≤ 8 h para todo — más barato, menos margen para reprocesos.
  - C) Todo en ≤ 1 h incluido CAE — depende de ARCA y no es garantizable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-010 a 012, 016; O4.

### PA-NFR-05 — Región de alojamiento y transferencias internacionales
- **Pregunta:** ¿Dónde se alojan los datos de producción?
- **Contexto:** Ley 25.326 art. 12 restringe transferencias a países sin protección adecuada; DEC-004 toma AWS como referencia.
- **Opciones:**
  - A) Región de nube de Sudamérica (por ejemplo São Paulo) con cláusulas contractuales modelo aprobadas por la AAIP, informadas en avisos y registro de subencargados **(Recomendada)** — servicios gestionados completos y latencia baja.
  - B) Infraestructura en Argentina (zona local o proveedor nacional) — menos transferencias, menos servicios gestionados y mayor costo operativo.
  - C) Región de Estados Unidos con cláusulas modelo — más servicios, mayor latencia y mayor transferencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-105, 139; RF-NFR-013; O0.
- **Estado:** Respondida (DEC-062): AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia según la AAIP.

### PA-NFR-06 — Plazos de conservación por categoría
- **Pregunta:** ¿Se aprueban los plazos de la tabla 10.3 como valores por defecto?
- **Contexto:** BASE §98 y AGR-033 los dejan pendientes; requieren asesoramiento legal, fiscal y contable.
- **Opciones:**
  - A) Aprobar la tabla 10.3 como default, parametrizable por tenant dentro de mínimos legales, con validación del asesor antes de la primera ejecución real **(Recomendada)** — permite construir y probar.
  - B) Conservar todo hasta la baja del tenant y definir plazos más adelante — incumple el principio de finalidad y acumula riesgo.
  - C) Solo los mínimos legales estrictos validados caso por caso antes de construir — bloquea O1.
- **Impacto si no se responde:** se asume A sin ejecutar supresiones reales hasta la validación.
- **Bloquea:** RF-NFR-009; RNF-NFR-038, 116; PRM-NFR-040 a 055.

### PA-NFR-07 — Rol de la plataforma ante la Ley 25.326 y contrato de encargo
- **Pregunta:** ¿Qué rol asume CoopApps frente a los datos de cada cooperativa?
- **Contexto:** BASE §97.1 y §98 piden confirmarlo y redactar el contrato.
- **Opciones:**
  - A) GoodApps prestador de servicios de tratamiento (art. 25) con contrato tipo, lista de subencargados y destrucción al fin del encargo **(Recomendada)** — coherente con SaaS y con BASE §59.
  - B) Corresponsable del tratamiento — más obligaciones y riesgo para la plataforma.
  - C) Definir caso por caso por cooperativa — complejidad operativa y documental.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-002, 013; RNF-NFR-108.
- **Estado:** Respondida (DEC-076): GoodApps es prestador de servicios de tratamiento por cuenta de la cooperativa (art. 25): contrato tipo de encargo, registro público de subencargados y destrucción o devolución al fin del encargo.

### PA-NFR-08 — Plazos de notificación de incidentes a la cooperativa
- **Pregunta:** ¿En qué plazos se notifica un incidente con datos personales?
- **Contexto:** BASE §97.1 pide procedimiento y notificación a la cooperativa; la ley no fija un plazo general [VERIFICAR].
- **Opciones:**
  - A) Aviso inicial ≤ 24 h desde la confirmación, informe preliminar ≤ 72 h y final ≤ 15 días **(Recomendada)** — permite a la cooperativa actuar como responsable.
  - B) Aviso ≤ 72 h — más margen, menor capacidad de reacción del tenant.
  - C) Según contrato de cada cooperativa — heterogéneo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-014; flujo 10.5.

### PA-NFR-09 — Uso de IA con datos personales
- **Pregunta:** ¿Bajo qué condiciones las funciones de IA procesan datos personales?
- **Contexto:** BASE §97.1 prohíbe enviar datos sin acuerdo y evaluación; AGR-030 pide gobierno de la IA.
- **Opciones:**
  - A) Solo proveedores con acuerdo de tratamiento y sin entrenamiento con datos, redacción de identificadores antes de enviar, habilitación por tenant y exclusión total de salud **(Recomendada)** — habilita bot y clasificación con riesgo acotado.
  - B) Prohibir todo dato personal (solo texto anonimizado) — reduce utilidad del bot y la clasificación.
  - C) Libre con consentimiento del socio — difícil de gestionar y probar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-NFR-010; RNF-NFR-098; PRM-NFR-090.

### PA-NFR-10 — Enlaces a comprobantes en correo o WhatsApp
- **Pregunta:** ¿Cómo accede el socio a la factura desde un mensaje?
- **Contexto:** ProCoop publica PDF por FTP al portal; CNX V-01 expone `/uploads`; BASE §97.2 pide envío digital.
- **Opciones:**
  - A) Enlace de un solo documento, revocable, que vence a los 7 días y luego exige iniciar sesión **(Recomendada)** — práctico y sin exponer el bucket.
  - B) Siempre exigir inicio de sesión — más seguro, más fricción para socios mayores.
  - C) Adjuntar el PDF en el correo — sin control posterior del documento; no aplicable a WhatsApp por tamaño y privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-081; PRM-NFR-031; API-NFR-29.

### PA-NFR-11 — Desafío antiautomatización (CAPTCHA)
- **Pregunta:** ¿Qué mecanismo se usa en formularios públicos?
- **Contexto:** RNF-NFR-076; el proveedor sería subencargado.
- **Opciones:**
  - A) Desafío de terceros respetuoso de la privacidad y accesible (tipo Turnstile), activado por riesgo **(Recomendada)** — baja fricción.
  - B) hCaptcha u otro con desafío visual — más fricción y problemas de accesibilidad.
  - C) Solo rate limiting y heurísticas propias — sin subencargado, menor eficacia ante bots distribuidos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-076; O2.

### PA-NFR-12 — Ventana de mantenimiento y congelamiento
- **Pregunta:** ¿Cuándo pueden hacerse mantenimientos con corte y en qué días se congela?
- **Contexto:** BASE §97.8 pide definir ventanas; la facturación y los vencimientos son críticos.
- **Opciones:**
  - A) Domingo 02:00–06:00 ART, ≤ 4 h/mes, aviso ≥ 72 h; congelamiento en días de lote y primeros vencimientos de cada tenant **(Recomendada)**.
  - B) Todas las noches 01:00–05:00 — más flexibilidad técnica, más cortes.
  - C) Sin ventana: solo despliegues sin corte — exige inversión extra en migraciones en línea.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-032, 034; PRM-NFR-110, 111.

### PA-NFR-13 — Soporte mínimo de dispositivos
- **Pregunta:** ¿Qué versiones mínimas de Android e iOS se soportan?
- **Contexto:** BASE §97.8 pide usabilidad en celulares de gama baja.
- **Opciones:**
  - A) Android 9+ e iOS 16.4+, últimas 2 versiones de navegadores **(Recomendada)** — cubre la gran mayoría del parque y permite push en iOS.
  - B) Android 8+ — más alcance, más pruebas y menos APIs web.
  - C) Android 11+ — menos esfuerzo, excluye equipos viejos de socios y técnicos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-183, 185.

### PA-NFR-14 — Protección de datos en el dispositivo offline
- **Pregunta:** ¿Cómo se protegen los datos guardados offline?
- **Contexto:** RNF-NFR-189; los técnicos llevan datos de socios y evidencias.
- **Opciones:**
  - A) Minimización, vencimiento a 7 días, borrado al cerrar o revocar sesión y cifrado con WebCrypto de evidencias sensibles **(Recomendada)**.
  - B) Sin cifrado adicional (solo minimización) — más simple, mayor riesgo ante pérdida del equipo.
  - C) Cifrar todo con PIN propio de la app — más seguro, más fricción y riesgo de pérdida de trabajo offline.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-189; O3.

### PA-NFR-15 — Página de estado e información de incidentes
- **Pregunta:** ¿Cómo se informan incidentes y mantenimientos a las cooperativas?
- **Contexto:** BASE §64.5 (comunicar avances y vincular con incidentes generales).
- **Opciones:**
  - A) Página de estado pública de la plataforma + aviso en el admin + correo a administradores **(Recomendada)**.
  - B) Solo aviso en el admin — invisible si el admin no está disponible.
  - C) Solo correo — sin historial público.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-019; PAN-NFR-18.

### PA-NFR-16 — Alcance de la auditoría de lecturas
- **Pregunta:** ¿Qué lecturas se auditan obligatoriamente?
- **Contexto:** BASE §54 la deja opcional; §97.1 exige tratamiento reforzado (CTR-NFR-15).
- **Opciones:**
  - A) Obligatoria para salud, datos bancarios completos, informes ARCO, exportaciones con datos personales, soporte y bóveda; opcional configurable para el resto **(Recomendada)** — costo acotado.
  - B) Todas las lecturas de datos personales — alto volumen y costo.
  - C) Ninguna lectura — incumple el tratamiento reforzado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-101, 114; PRM-NFR-093.

### PA-NFR-17 — Pruebas de penetración externas
- **Pregunta:** ¿Con qué frecuencia se contratan pruebas de penetración independientes?
- **Contexto:** BASE §60 pide verificación continuada.
- **Opciones:**
  - A) Antes del go-live del piloto, anual y ante cambios mayores de autenticación, pagos o tenancy **(Recomendada)**.
  - B) Solo anual — riesgo en el lanzamiento.
  - C) Solo pruebas internas — menor independencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-095; cierre de O6.

### PA-NFR-18 — Plazo de soporte de versiones de la API externa
- **Pregunta:** ¿Cuánto tiempo se mantiene una versión anterior de `/api/v1/ext`?
- **Contexto:** BASE §59 pide versiones documentadas y estabilidad para BI de las cooperativas.
- **Opciones:**
  - A) 12 meses desde la publicación de la nueva versión **(Recomendada)**.
  - B) 6 meses — menos mantenimiento, más presión sobre integradores.
  - C) 24 meses — más estabilidad, más costo de mantenimiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-175, 176; O11.

### PA-NFR-19 — Datos reales en ensayos
- **Pregunta:** ¿Se pueden usar datos reales de ProCoop para ensayos de migración y pruebas de carga?
- **Contexto:** BASE §97.1 prohíbe copiar datos reales a desarrollo o demostración; la migración (T07) necesita ensayar con datos reales.
- **Opciones:**
  - A) Pruebas de carga solo con datos sintéticos; ensayos de migración con copia real únicamente en un ambiente aislado de migración, autorizado por la cooperativa, con acceso restringido y eliminación documentada **(Recomendada)**.
  - B) Copia anonimizada irreversible para carga y migración — la anonimización puede invalidar la conciliación.
  - C) Nunca datos reales, ni en migración — impide ensayar la conciliación de saldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-NFR-014; RNF-NFR-154; T07.

### PA-NFR-20 — Comunicaciones promocionales y Registro "No Llame"
- **Pregunta:** ¿Cómo se gestionan las comunicaciones promocionales a socios?
- **Contexto:** Ley 25.326 art. 27 y Ley 26.951 [VERIFICAR]; T09 maneja audiencias.
- **Opciones:**
  - A) Separar transaccional de promocional; promocional con consentimiento u oposición respetada y consulta del registro para llamadas y mensajes **(Recomendada)**.
  - B) Tratar todo como institucional — riesgo legal.
  - C) Prohibir comunicaciones promocionales — limita la comercialización de servicios.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-005; T09.

### PA-NFR-21 — Redondeo por defecto
- **Pregunta:** ¿Qué regla de redondeo se usa por defecto cuando un concepto no define otra?
- **Contexto:** AGR-011 pide redondeo explícito; ARCA valida la coherencia de totales; M04/M06 pueden definir excepciones.
- **Opciones:**
  - A) Mitad hacia arriba a 2 decimales por línea, IVA por alícuota sobre la suma de netos del comprobante y residuos por mayor resto **(Recomendada)** — práctica comercial habitual.
  - B) Redondeo bancario (mitad al par) — reduce sesgo, poco habitual en facturación local.
  - C) Truncado — subfactura sistemáticamente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-203; PRM-NFR-060; O4.

### PA-NFR-22 — Factor de simultaneidad del pico de plataforma
- **Pregunta:** ¿Qué factor se aplica a la suma de los picos por tenant para obtener el pico simultáneo de la plataforma (§7.1)?
- **Contexto:** Los ciclos y vencimientos de los tenants no coinciden; el perfil usaba factores implícitos distintos por fila (entre 35 % y 85 %), sin una regla.
- **Opciones:**
  - A) 0,6 en todas las filas de simultaneidad, con prueba de carga antes de O4 que lo confirma o lo recalibra **(Recomendada)**.
  - B) 1,0 (todos los tenants en su pico a la vez): sobredimensiona la infraestructura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.1; RNF-NFR-010, 016, 024, 145.
- **Estado:** Asumida (DEC-072): opción A, aplicada en §7.1.

### PA-NFR-23 — Copias anuales de 10 años
- **Pregunta:** ¿La conservación legal de 10 años necesita copias de seguridad anuales?
- **Contexto:** RNF-NFR-038 preveía copias anuales de 10 años; DEC-087 deja en línea los datos económicos y pasa a archivo en frío el detalle de más de 36 meses.
- **Opciones:**
  - A) Sin copias anuales: los datos quedan en línea los 10 años y el detalle va al archivo en frío según DEC-087; los backups sirven para recuperar **(Recomendada)**.
  - B) Además, una copia anual inmutable de 10 años: más costo de almacenamiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-038, RNF-NFR-259.
- **Estado:** Asumida (DEC-072): opción A; RNF-NFR-038 ya la aplica.

### PA-NFR-24 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** varias máquinas de §15.2 estaban solo en texto sin estado de alta en tabla; `dataSubjectRequests` y `securityIncidents` no listaban valores en §15.1; 2 referencias no tenían destino en la definición del campo; 16 colecciones no tenían tabla de campos; 7 filas de §15.4 citaban reglas de acceso en lugar de una capability; CU-ARQ-01 se usaba como propio y es de T11.
- **Opciones:**
  - A) Agregar las filas de alta y transiciones en la tabla de §15.2; listar valores en §15.1; declarar destinos (`purposesCovered` → `processingActivities`, `noticeId` → `privacyNotices`); agregar §15.1.1 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `public: true` (con la condición) y `pla.salud.sondear` (registrada en T02 §4.4.2); citar CU-ARQ-01 como de T11. **(Recomendada)**.
  - B) Dejar las máquinas solo en texto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos y ER de T08.
- **Estado:** Asumida (DEC-072): opción A.

## 22. Trazabilidad de fuentes

| Fuente | Contenido | Destino en este anexo |
|---|---|---|
| BASE §29 | Seguridad, permisos y auditoría: dos niveles, roles/perfiles, MFA, Google, recuperación, auditoría de cada cambio, sesiones, exportaciones, protección de información, copias y recuperación, integraciones; regla de verificación en servidor; CU-29 | RF-NFR-024; RNF-NFR-038, 060 a 066, 090, 110 a 118, 150, 231 a 233; §4; §16.1 |
| BASE §34 | Escenarios 5, 6, 7, 8, 14, 15, 16–21, 29, 30, 34, 36, 39, 42, 43, 45–48, 50, 53, 54, 59, 61, 70–73, 82, 86, 94 | §17.2 |
| BASE §34 | Escenarios restantes (1–4, 9–13, 22–28, 31–33, 35, 37, 38, 40, 41, 44, 49, 51, 52, 55–58, 60, 62–69, 74–81, 83–85, 87–93, 95) | Funcionales de otros anexos; T08 aporta las suites transversales (RNF-NFR-140 a 163); 37 en RNF-NFR-144; 44 en RNF-NFR-075/076; 51–52 en RNF-NFR-161/148; 87–88 en RNF-NFR-161 |
| BASE §54 | GOB-001 a GOB-004, vistas de plataforma/tenant/áreas, alertas, registro de auditoría, CU-GOB-01 | RF-NFR-016 a 018; RNF-NFR-110 a 119, 131 a 136; §16.1 |
| BASE §58 | CU-ARQ-01 de T11 (reintentos sin duplicar contratos o facturas) | §16.1; RNF-NFR-212 a 215 |
| BASE §59 | API-001 a 003, alcance funcional (clientes, tokens, revocación, versiones, incremental, límites, fecha de corte, inventario), datos candidatos, CU-API-01 | RNF-NFR-019, 022, 083, 103, 106, 175 a 177, 233; CTR-NFR-16 |
| BASE §60 | SEG-001 a 005, referencias SEG1–SEG5, MFA y sesión, Google, contraseñas, protección transversal, CU-SEG-01 | Sección 9 completa; RNF-NFR-231, 232; §16.1 |
| BASE §64.4–64.6 | SaaS-001 a 005, operación y soporte de plataforma, objetivos medibles, CU-SaaS-01 | RNF-NFR-030 a 034, 049, 134, 137, 172; RF-NFR-019; CTR-NFR-01 |
| BASE §65 | Diccionario por tenant, texto base de respaldo | RN-NFR-027; RNF-NFR-028, 182, 192 |
| BASE §97.1 | Protección de datos personales completa (inventario, consentimientos, derechos, sensibles, minimización, registro, encargo, incidentes, datos de prueba, control de copia) | RF-NFR-001 a 014; RN-NFR-010, 013, 014; RNF-NFR-100 a 109; §10 |
| BASE §97.2 | Emisión masiva y resiliente ARCA (referencia) | RNF-NFR-011, 047, 199, 217 |
| BASE §97.8 | Dimensiones no funcionales (volumen 12.500/semana, rendimiento, disponibilidad, recuperación, aislamiento, conectividad, accesibilidad, observabilidad, conservación) | Secciones 7, 8, 10.3, 11, 13; CTR-NFR-01 |
| BASE §97.9 | Ambientes separados, precarga fuera de producción, pruebas de configuración, versionado | RN-NFR-014, 015; RNF-NFR-099, 170 |
| BASE §97.12 | Base desde el día uno | Asignación O0/O1 del encabezado |
| BASE §98 | Pendientes: rol ante Ley 25.326, plazos de conservación, metas no funcionales | PA-NFR-01 a 07 |
| AGR-011 | Invariantes monetarias | RN-NFR-005, 006; RNF-NFR-200 a 209, 229 |
| AGR-016 | Ejecución fiable entre componentes | RN-NFR-007; RNF-NFR-013, 210 a 227 |
| AGR-017 | Calendarios y zona horaria | RNF-NFR-194, 208 |
| AGR-019 | Recuperación por tenant, RPO/RTO | Sección 8; RF-NFR-015 |
| AGR-020 | Capacidad, rendimiento y aislamiento | Sección 7; RN-NFR-025 |
| AGR-022 | Fórmula, universo y corte de indicadores | §15.8; RNF-NFR-225 |
| AGR-025 | Offline con conflictos | RNF-NFR-156, 187 a 191 |
| AGR-030 | Gobierno de la IA | RN-NFR-011, 012; RNF-NFR-098 |
| AGR-031 | Moderación (datos personales en fotos) | RNF-NFR-080; PRM-NFR-050 |
| AGR-032 | Accesibilidad | RNF-NFR-180 a 182 |
| AGR-033 | Privacidad, conservación y salida | Sección 10; RF-NFR-008 a 011 |
| AGR-034 | Soporte con acceso temporal | §4; RNF-NFR-114, 237 |
| AGR-035 | Entornos, pruebas y evidencias | Sección 12; RF-NFR-022 |
| ESC-01 a ESC-05 | Escenarios de calidad | §17.1 |
| CNX §2.1 | Versiones, `morgan`, `node --test`, k6, `vite-plugin-pwa`, IA directa | RNF-NFR-120, 141, 145, 174; CTR-NFR-18 |
| CNX §2.3 | Base compartida, tenant del JWT, pre-login sin revelar usuarios | RN-NFR-001; RNF-NFR-077; CTR-NFR-02 |
| CNX §2.5 | JWT, refresh, `sessionEpoch`, 2FA, anti-enumeración, bcrypt, bloqueo, SSO, [MEJORAR] rate limit | RNF-NFR-060 a 066; CTR-NFR-03, 04, 20 |
| CNX §2.6 | Paginación, `requestId`, validación, borrado lógico, jobs, archivos | RNF-NFR-002, 082, 091; CTR-NFR-05 a 07 |
| CNX §2.7 | Topes de campañas y horario de no molestar | RNF-NFR-012; PRM-NFR-029 |
| CNX §2.8 | Docker, autodeploy SSH, `.env` a mano, timeouts 7 min | RNF-NFR-027, 067, 167; CTR-NFR-08, 09 |
| CNX §3.7 | Offline: SW, colas, `clientMutationId`, qué no se encola, [MEJORAR] | RNF-NFR-017, 186 a 191; CTR-NFR-10 |
| CNX §4.5, §4.6 | BI con cubos certificados; deudas del admin (tabla, importador, toasts, menú, credenciales, validación) | RNF-NFR-106; RNF-NFR-015, 068, 082 |
| CNX §10 | V-01, V-02, V-04, V-05, V-07, V-13, credenciales en `.env`, token en README, auditoría inmutable, transacciones, backups probados | §9.13; RNF-NFR-058, 063, 067, 068, 070, 074, 075, 081, 087, 094, 099 |
| CNX §10 | V-03, V-06, V-08 a V-12 (no detallados en la fuente) | [VERIFICAR] en §9.13; RNF-NFR-050 |
| CNX §11 | Orden sugerido (base de plataforma, componentes a construir) | Asignación a O0 (encabezado, §2.1) |
| RN-09 §3 | Una base por cooperativa, multiempresa por instalación, caso hardcodeado de servidores de prueba | CTR-NFR-02; RN-NFR-001, 002 |
| RN-09 §4.1 | Login, contraseñas reversibles, contraseñas maestras, reset por defecto, variable 2588 | RN-NFR-004; RNF-NFR-059, 060; §9.13; §19; PRM-NFR-083 |
| RN-09 §4.2 | Perfiles con horario, SysAdmin, autorización de supervisor | §9.13; RNF-NFR-090 (detalle funcional en T02) |
| RN-09 §4.3 | `AUDITO`, `AUDITORIA`, `INFO_SYS/INFO_AUD`, `AUDIT_MAIL`, `BLOQUEO_FILAS`, `LogProcoop.txt`, variable −1, backup automático | RN-NFR-020, 021; RNF-NFR-110 a 119, 210; §15.1; §19 |
| RN-09 §5.1 | Capas y ensamblados (`CapaDatos`, `ProMod_*`) | Contexto; sin requisito NFR propio (Descartado: arquitectura reemplazada por DEC-003) |
| RN-09 §5.2 | Arranque: TLS 1.2, cultura `es-ES`, desfase de reloj, modos de línea de comandos | RNF-NFR-053, 138, 192; CTR-NFR-13, 19; modos batch → RN-NFR-024 |
| RN-09 §5.3 | `.pro` con contraseña SQL ofuscada, autenticación SQL única | RNF-NFR-067, 097 |
| RN-09 §5.4 | Licenciamiento por lista compilada | §9.13 → T01 |
| RN-09 §5.5 | Menú y carga por reflexión | §9.13; RNF-NFR-238 |
| RN-09 §5.6 | Tareas al abrir (avisos de backups, certificado AFIP, versión; TeamViewer, webchat) | RF-NFR-017; RNF-NFR-071; PAN-NFR-07; PRM-NFR-085, 119; §9.13 |
| RN-09 §5.7 | Actualizaciones de esquema y binarios | RN-NFR-022, 023; RNF-NFR-168, 236 |
| RN-09 §5.8 | Agente: backups, tareas programadas, aviso de mayoría de edad | RN-NFR-024; RNF-NFR-104; PAN-NFR-15 |
| RN-09 §7 (1–10) | Implicancias: parámetros con nombre, ámbitos, no autoalta, migrar lo usado, multitenant, seguridad, permisos, auditoría, actualizaciones, tareas | 1–4 → T04; 5 → CTR-NFR-02; 6 → RNF-NFR-060, 067, 097; 7 → T02; 8 → RNF-NFR-110; 9 → RNF-NFR-168; 10 → RN-NFR-024 |
| RN-09 §8 | Duda 6 (variable −1) | RN-NFR-021; resto de dudas → T04 |
| RN-10 §13 | Secretos hardcodeados (solo ubicación) y credenciales en texto plano | §9.13; RNF-NFR-067, 068, 094; §19 |
| RN-10 §14 | Implicancias (conectores, portal sin base aparte, mensajería con auditoría) | RN-NFR-026; RNF-NFR-081; resto → T06 |
| RN-13 §17 | Hallazgos de seguridad de pasarelas | RN-NFR-008, 009, 019; RNF-NFR-084, 088, 121; §9.13 |
| DFA Módulo 1 | Usuarios, perfiles, auditoría (`AUDIT_IA`), autorizaciones, bloqueos y solo lectura, copia de seguridad (mejora SaaS), firma digital, API para terceros, configuración general, mejoras propuestas | §15.1 mapeo; RNF-NFR-110 a 113, 210, 230, 233; PAN-NFR-13; CTR-NFR-11, 12 |
| DFA §32 | Tablas de seguridad y patrones del modelo (anulaciones espejo, históricos, `*_EXTRAS`) | RN-NFR-017; §15.1; §19 |
| DFA §33 | Criterio de aceptación del paralelo factura por factura | RNF-NFR-153 |
| DFA §34 | Pendientes de definición (sin contenido NFR) | Descartado para T08: pendientes funcionales de otros anexos |
| Guía §5 | Convenciones (dinero, fechas, API, idempotencia, eventos, jobs, IDs) | Secciones 13 y 14; RNF-NFR-091, 178, 247 |
| DEC-003 | Monolito modular con fronteras estrictas, outbox y workers | RNF-NFR-240, 241, 244; RN-NFR-024 |
| DEC-004 | Despliegue agnóstico de nube con Docker | RNF-NFR-245, 236, 171 |
| DEC-007 | Hardware local vía agente (turnero, impresoras, tótems) | RNF-NFR-258; alta y revocación de dispositivos en T01/M09 |
| AGR-021 | Operación de APIs y conectores (errores, versiones, bandeja, notificaciones a terceros opcionales) | RNF-NFR-027, 222, 227, 247 |
| AGR-023 | Expediente documental, versiones y revocación de enlaces | RNF-NFR-230, 254 |
| AGR-024 | Estados de comunicaciones y constancias | RNF-NFR-253 |
| AGR-032 | Autogestión tolerante a errores (borradores, alternativa al mapa) | RNF-NFR-248 (además de RNF-NFR-180 a 182) |
| AGR §5.1, §5.4, §5.5 | Responsabilidades por módulo, configuración por versiones publicadas, estados observables | RNF-NFR-240, 249, 256 |
| BASE §97.11 | Comercialización de la plataforma (plan, límites de uso, facturación propia) | RNF-NFR-250, 251; PRM-NFR-096, 097 |
| BASE §34 esc. 22 | Alta de tenant habilita administración y landing | RNF-NFR-255 |
| DEC-100 (verificador de integridad referencial; aporte A8 del documento externo) | Proceso nocturno por tenant que informa referencias rotas sin corregirlas, con bandeja de integridad y alerta a operaciones | RNF-NFR-260; JOB-NFR-25; EVT-NFR-18; IND-NFR-19; RNF-NFR-132 (alerta); PAN-NFR-07 (tablero); T05 §7.1.16 |
| DEC-103 (supresión de secretos en la migración; aporte A11 del documento externo; amplía DEC-091 y DEC-092) | Clave web de `SOCIOS`, clave de IA en `VARIABLE` (var 3048), credenciales de proveedores, profesionales y empleados; escaneo previo del origen (Luhn y columnas con apariencia de credencial, incluida `CUPONTAR`) que bloquea la migración | RN-NFR-009; §9.13; §19 (tres filas); T07 RN-MIG-013 |
| INV `frmProgressBar_WithLog`, `frmChequearVersion`, `frmActualizar`, `frmSoporteIP`, `frmAuditoriaLogin`, `frmFirmaElectronica`, `frmUbicacionFirma` (Configuracion.md) | Progreso modal de procesos, chequeo de versión, actualización local, soporte por IP, auditoría de logueo, firma electrónica | RNF-NFR-249 (progreso); RN-NFR-022/023 y RNF-NFR-174 (versión/actualización: Reemplazado); soporte remoto → T01 (AGR-034); auditoría de logueo → T02 con RNF-NFR-115; firma → RNF-NFR-230 y T11 |
