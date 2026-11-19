# 13b — Auditoría impacto stack — entregables (C-10)

Generado **19-11-2026** por `_trabajo/audit_entregables_stack.py`.
Carpeta: `docs/entregables-analisis-diseno/` (522 archivos `.md`).

## Resumen

| Métrica | Valor |
|---|---|
| Archivos revisados | 522 |
| Con norma impacto en texto | 5 (índice, OpenAPI, pruebas, C4, STRIDE, CP maestro; ver §12.3 en `06`) |
| Mencionan Azure SQL | 5 |
| Líneas Mongo (revisar) | 10793 |
| Líneas Node/Vue (revisar) | 30 |
| Líneas DEC-001 (revisar) | 39 |

### Interpretación (C-10)

- **Hecho para export comercial:** índice entregables + `18-contratos-api` declaran rol OpenAPI y stack Azure.
- **Barrido pendiente:** casos de prueba y C4/pruebas conservan escenarios escritos contra Mongo; alinear por ola o marcar nota histórica.
- Cerrar **C-10** cuando el barrido esté aceptado o inventariado como «caso de prueba histórico».

## Mongo / Mongoose / ObjectId (10793 líneas)

- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L15: > **Norma stack CoopApps (C-10, DEC-111–113, DEC-110).** Diagramas que muestran MongoDB, Redis, Node
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L67: - **Datos**: una sola base MongoDB 7 compartida, con `tenantId` obligatorio en todo documento de neg
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L68: - **Asincronía**: outbox transaccional (`outboxEvents`) más BullMQ sobre Redis; consumidores idempot
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L77: | 3 | **Disponibilidad y recuperabilidad** | 99,5 % mensual; RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L101: | RT-01 | Stack obligatorio: Node.js 20 LTS (ESM) con Express; MongoDB 7 en replica set con Mongoose
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L319: API["API<br/>apps/api<br/>Node 20 ESM, Express, Zod, Mongoose 8"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L320: WRK["Workers BullMQ<br/>apps/worker<br/>colas por clase de carga"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L324: REDIS[("Redis 7<br/>BullMQ, caché, rate limit,<br/>locks, circuit breaker")]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L325: MONGO[("MongoDB 7 replica set<br/>base única con tenantId")]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L373: | API (`apps/api`) | Expone las familias de rutas `/api`, `/api/admin`, `/api/platform`, `/api/publi
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L374: | Workers (`apps/worker`) | Consumidores BullMQ que reutilizan los módulos de `apps/api`; cada répli
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L378: | MongoDB 7 replica set | Base operativa única con `tenantId`; transacciones multi-documento; colecc
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L379: | Almacén analítico `bi_*` | Base lógica `<db>_analytics` con dimensiones y hechos proyectados desde
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L380: | Redis 7 | Colas BullMQ, caché con prefijos `t:<tenantId>:` y `p:`, rate limiting, locks del relay,
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L412: TEN["tenancy<br/>plugin Mongoose, runAsPlatform"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L587: PLUG["Plugin de tenancy de Mongoose<br/>inyecta tenantId en find, update,<br/>delete, aggregate y bu
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L588: DB[("MongoDB base única<br/>índices con tenantId primero")]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L590: JOB["Job BullMQ<br/>tenantId en payload,<br/>semáforo por tenant"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L631: Un tenant no debe degradar a otro (RN-NFR-025): colas por clase de carga con concurrencia global y p
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L684: participant Q as Redis y BullMQ
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L686: participant DB as MongoDB
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L745: participant DB as MongoDB
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L746: participant Q as Redis y BullMQ
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L829: | En tránsito | TLS 1.3 preferido, 1.2 mínimo con suites AEAD; HSTS; TLS interno hacia MongoDB, Redi
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L838: - **Entrada y salida**: Zod `.strict()` en toda ruta; DTO de salida por rol; Mongoose con `sanitizeF
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L859: - Agnóstico de nube: cualquier orquestador de contenedores, MongoDB 7 en replica set, Redis 7 y alma
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L895: MDB[("MongoDB 7 replica set<br/>3 nodos en 3 zonas<br/>+ miembro oculto analytics<br/>Atlas sobre AW
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L939: Correspondencia con servicios de AWS de referencia (T01 §7.1): ECS Fargate o EKS, MongoDB Atlas sobr
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L945: | `local` | Desarrollo en la máquina | Juego canónico ficticio | Mocks | `docker compose up` (mongo 
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L981: | MongoDB | PITR continuo por oplog + snapshots: PITR 7 días; diarios 35 días; semanales 12 semanas;
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1020: | DEC-001 | Stack Node + Mongo + Vue (Connectia) | Reemplazo de .NET/Azure/SQL Server de DFA; reutil
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1022: | DEC-003 | Monolito modular | Simplicidad operativa con fronteras estrictas. | Outbox + BullMQ; man
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1025: | DEC-063 | Continuidad y niveles de servicio | PA-PLA-02/03. | 99,5 % mensual; RPO ≤ 15 min; RTO ≤ 
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1026: | DEC-074 | Bóveda con cifrado por sobre en MongoDB y KMS | PA-INT-02. | `integrationSecrets` con in
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1093: | BullMQ | Biblioteca de colas de trabajos sobre Redis usada para jobs y consumidores de eventos. |
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1097: | Change stream | Flujo de cambios de MongoDB usado por el relay para detectar eventos nuevos en `ou
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1101: | `Decimal128` | Tipo decimal de 128 bits de MongoDB, usado para importes junto con `decimal.js`. |
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1113: | Replica set | Conjunto de nodos MongoDB con un primario y secundarios replicados; requerido para t
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L47: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L61: ObjectId maritalStatusId FK "T04 enumerationItems"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L62: ObjectId occupationId FK "T04 enumerationItems"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L63: ObjectId nationalityCountryId FK "T04 countries"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L75: ObjectId mergedIntoPersonId FK "→ persons"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L79: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L80: ObjectId documentTypeId FK, UK "T04 identityDocumentTypes; UK {documentTypeId, number, exceptionId}"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L82: ObjectId personId FK "→ persons"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L83: ObjectId exceptionId FK, UK "T11 approvalRequests; UK {documentTypeId, number, exceptionId}"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L86: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L87: ObjectId personId FK, UK "→ persons"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L90: ObjectId evidenceDocumentId FK "T11 documents"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L93: ObjectId consentId FK "T08 consentRecords"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L97: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L98: ObjectId personId FK "→ persons"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L104: ObjectId closeReasonId FK "T04 enumerationItems"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L110: ObjectId principalAccountId FK "→ accounts"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L114: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L115: ObjectId holderId FK, UK "→ holders; UK {holderId, isPrincipal} parcial"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L123: ObjectId postalAddressId FK "→ addresses"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L125: ObjectId postalCompanyId FK "M05 postalCarriers"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L127: ObjectId districtSectionId FK "T04 cadastralDistricts"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L128: ObjectId accountingGroupId FK "M07 collectionAccountingGroups"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L140: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L141: ObjectId countryId FK "T04 countries"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L142: ObjectId provinceId FK "T04 provinces"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L143: ObjectId departmentId FK "T04 departments"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L144: ObjectId localityId FK "T04 localities"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L146: ObjectId streetId FK "T04 streets"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L155: ObjectId neighborhoodId FK "T04 neighborhoods"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L163: ObjectId streetRequestId FK "destino no declarado"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L166: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L167: ObjectId addressId FK "→ addresses"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L172: ObjectId actorId FK "T02 memberships"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L178: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L180: ObjectId addressId FK "→ addresses"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L181: ObjectId ownerPostalAddressId FK "→ addresses"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L194: ObjectId usageId FK "T04 enumerationItems"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L195: ObjectId stateId FK "T04 enumerationItems"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L205: ObjectId id PK "_id"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L207: ObjectId addressId FK "→ addresses"
- `docs/entregables-analisis-diseno/03-er/M01-PER-personas-titulares-cuentas.md` L208: ObjectId premiseId FK "→ premises"
- _… y 10713 más._

## Node / Vue (30 líneas)

- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L101: | RT-01 | Stack obligatorio: Node.js 20 LTS (ESM) con Express; MongoDB 7 en replica set con Mongoose
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L316: ADMIN["Admin web<br/>apps/admin<br/>Vue 3.5, Vite, Pinia, Tailwind"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L317: PWA["PWA socio, empleado y campo<br/>apps/pwa<br/>Vue 3.5, vite-plugin-pwa, IndexedDB"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L318: LAND["Landing por tenant<br/>apps/landing<br/>Vue 3.5, Vite, prerender opcional"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L319: API["API<br/>apps/api<br/>Node 20 ESM, Express, Zod, Mongoose 8"]
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L370: | Admin web (`apps/admin`) | SPA de gestión con AdminShell; menú declarativo `siteMapGroups` filtrad
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L371: | PWA (`apps/pwa`) | Una sola PWA con experiencia por rol: socio, empleado y campo (técnico, lecturi
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L372: | Landing (`apps/landing`) | Sitio público por tenant: institucional, noticias, servicios publicados
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L373: | API (`apps/api`) | Expone las familias de rutas `/api`, `/api/admin`, `/api/platform`, `/api/publi
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L374: | Workers (`apps/worker`) | Consumidores BullMQ que reutilizan los módulos de `apps/api`; cada répli
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1092: | AsyncLocalStorage | Mecanismo de Node.js para propagar el contexto de ejecución (tenant, usuario, 
- `docs/entregables-analisis-diseno/06y-secuencias-integraciones-fi-int.md` L527: Note over INT,X1: FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos,…
- `docs/entregables-analisis-diseno/06y-secuencias-integraciones-fi-int.md` L545: | FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos, Provi… | M07. | Entrante/saliente.
- `docs/entregables-analisis-diseno/16-catalogo-reglas-negocio.md` L1455: | RN-COB-097 | Rendición Banelco/Pago Fácil/Rapipago/Cobro Express: cliente por cuenta y comprobante
- `docs/entregables-analisis-diseno/16-catalogo-reglas-negocio.md` L2612: | RN-POR-009 | El cambio de ámbito (tenant) o de espacio (socio/empleado) recalcula permisos y purga
- `docs/entregables-analisis-diseno/18-catalogo-endpoints/t01-pla.md` L9: 1. La arquitectura de referencia y el stack (DEC-001 a DEC-004): monorepo derivado de Connectia, ada
- `docs/entregables-analisis-diseno/20-casos-prueba/T01-PLA-plataforma-saas.md` L18: | CP-PLA-0002 | RF-PLA-002; T01 §5; PRO-O0-01 | O0 | Núcleo | funcional | TEN-001 con Tenants: `plat
- `docs/entregables-analisis-diseno/20-casos-prueba/T02-IAM-identidad-roles-auditoria.md` L20: | CP-IAM-0004 | RF-IAM-004; T02 §5.1; PRO-O1-08 | O1 | Núcleo | seguridad | TEN-001 con TEN-001: ASO
- `docs/entregables-analisis-diseno/27-registro-adr.md` L37: | [ADR-001](#adr-001--stack-tecnológico-nodejs-mongodb-y-vue) | Stack tecnológico Node.js, MongoDB y
- `docs/entregables-analisis-diseno/27-registro-adr.md` L120: #### ADR-001 — Stack tecnológico Node.js, MongoDB y Vue
- `docs/entregables-analisis-diseno/27-registro-adr.md` L129: **Decisión.** Node.js 20 LTS (ESM) con Express 4; MongoDB 7 en replica set con Mongoose 8; Vue 3.5 +
- `docs/entregables-analisis-diseno/28-modelo-amenazas-seguridad.md` L167: API["API Express<br/>autenticación, contexto de tenant,<br/>autorización y validación"]
- `docs/entregables-analisis-diseno/_trabajo/backup-gen06-20261105-152141/md/06u-secuencias-integraciones-fi-int.md` L527: Note over INT,X1: FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos,…
- `docs/entregables-analisis-diseno/_trabajo/backup-gen06-20261105-152141/md/06u-secuencias-integraciones-fi-int.md` L545: | FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos, Provi… | M07. | Entrante/saliente.
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2-20261105/06x-secuencias-integraciones-fi-int.md` L527: Note over INT,X1: FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos,…
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2-20261105/06x-secuencias-integraciones-fi-int.md` L545: | FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos, Provi… | M07. | Entrante/saliente.
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/20-casos-prueba/T01-PLA-plataforma-saas.md` L18: | CP-PLA-0002 | RF-PLA-002; T01 §5; PRO-O0-01 | O0 | Núcleo | funcional | TEN-001 con Tenants: `plat
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/20-casos-prueba/T02-IAM-identidad-roles-auditoria.md` L20: | CP-IAM-0004 | RF-IAM-004; T02 §5.1; PRO-O1-08 | O1 | Núcleo | seguridad | TEN-001 con TEN-001: ASO
- `docs/entregables-analisis-diseno/_trabajo/gen06_respaldo/06u-secuencias-integraciones-fi-int.md` L527: Note over INT,X1: FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos,…
- `docs/entregables-analisis-diseno/_trabajo/gen06_respaldo/06u-secuencias-integraciones-fi-int.md` L545: | FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos, Provi… | M07. | Entrante/saliente.

## DEC-001 citada (39 líneas)

- `docs/entregables-analisis-diseno/00-INDICE.md` L5: > **Norma de implementación (impacto stack, DEC-111–113, DEC-110).** El **comportamiento** y los con
- `docs/entregables-analisis-diseno/01-resumen-ejecutivo-vision.md` L441: La especificación registra 87 decisiones del solicitante (DEC-001 a DEC-087). De las 516 preguntas d
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L101: | RT-01 | Stack obligatorio: Node.js 20 LTS (ESM) con Express; MongoDB 7 en replica set con Mongoose
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L378: | MongoDB 7 replica set | Base operativa única con `tenantId`; transacciones multi-documento; colecc
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1020: | DEC-001 | Stack Node + Mongo + Vue (Connectia) | Reemplazo de .NET/Azure/SQL Server de DFA; reutil
- `docs/entregables-analisis-diseno/02-arquitectura-c4.md` L1128: | `docs/especificacion/01-registro-decisiones.md` | DEC-001 a DEC-006, DEC-015, DEC-018, DEC-020, DE
- `docs/entregables-analisis-diseno/04f-procesos-identidad-acceso.md` L615: **Situación actual en ProCoop (nota de cambio).** DFA M1 proponía OpenIddict sobre .NET; el servidor
- `docs/entregables-analisis-diseno/10-caratula-control-versiones.md` L49: | `01-registro-decisiones.md` | Decisiones DEC-001 a DEC-088 con fecha, fundamento y estado | Sin ca
- `docs/entregables-analisis-diseno/10-caratula-control-versiones.md` L125: | Decisiones rectoras | 04-11-2026 | Solicitante (`[Nombre y apellido]`, Patrocinador) | DEC-001 a D
- `docs/entregables-analisis-diseno/10-caratula-control-versiones.md` L206: - Un cambio que afecta una decisión rectora (DEC-001 a DEC-010) o el alcance requiere aprobación del
- `docs/entregables-analisis-diseno/11-glosario-negocio.md` L261: | CNX | Connectia, referencia técnica y de UI/UX | Maestra §2.1; DEC-001 |
- `docs/entregables-analisis-diseno/12-supuestos-dependencias.md` L11: | Fuentes | `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` (§12, §15, §18); `01-registro-decisio
- `docs/entregables-analisis-diseno/15-analisis-brechas-procoop.md` L93: | Plataforma | Aplicación de escritorio instalada en cada puesto, con actualización manual desde el 
- `docs/entregables-analisis-diseno/18-catalogo-endpoints/t01-pla.md` L9: 1. La arquitectura de referencia y el stack (DEC-001 a DEC-004): monorepo derivado de Connectia, ada
- `docs/entregables-analisis-diseno/18-catalogo-endpoints/t07-mig.md` L7: Definir, de forma ejecutable y comprobable, cómo se trasladan los datos de cada cooperativa que hoy 
- `docs/entregables-analisis-diseno/18-catalogo-endpoints.md` L45: | T01 | Plataforma SaaS: arquitectura de referencia, stack, multitenancy, tenants, licencias, soport
- `docs/entregables-analisis-diseno/18-catalogo-endpoints.md` L50: | T07 | Migración desde ProCoop, convivencia, corrida paralela y by-pass | Definir, de forma ejecuta
- `docs/entregables-analisis-diseno/20-casos-prueba/T01-PLA-plataforma-saas.md` L13: ### 1.1 5.A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004) (T01 §5)
- `docs/entregables-analisis-diseno/21-casos-de-uso/21-T01-PLA.md` L37: CUG_PLA_01(["CUG-PLA-01<br/>A. Arquitectura de referencia y stack (DEC-001, DEC-003..."])
- `docs/entregables-analisis-diseno/21-casos-de-uso/21-T01-PLA.md` L133: CUG_PLA_01(["CUG-PLA-01<br/>A. Arquitectura de referencia y stack (DEC-001..."])
- `docs/entregables-analisis-diseno/21-casos-de-uso/21-T01-PLA.md` L189: ### CUG-PLA-01 — A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004)
- `docs/entregables-analisis-diseno/21-casos-de-uso/21-T01-PLA.md` L195: | Objetivo | A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004): La solución se prest
- `docs/entregables-analisis-diseno/27-registro-adr.md` L13: | Fuentes | `docs/especificacion/01-registro-decisiones.md` (DEC-001 a DEC-089); `00-ESPECIFICACION-
- `docs/entregables-analisis-diseno/27-registro-adr.md` L37: | [ADR-001](#adr-001--stack-tecnológico-nodejs-mongodb-y-vue) | Stack tecnológico Node.js, MongoDB y
- `docs/entregables-analisis-diseno/27-registro-adr.md` L124: | Estado | Aceptada (DEC-001, vigente desde 04-11-2026) |
- `docs/entregables-analisis-diseno/27-registro-adr.md` L125: | Origen | DEC-001; maestra §3 y §5.1; RF-PLA-002; RT-01 de `02-arquitectura-c4.md`; CTR-NFR-05, CTR
- `docs/entregables-analisis-diseno/27-registro-adr.md` L131: **Alternativas consideradas.** .NET + Azure + SQL Server (DFA): descartada por DEC-001. Biblioteca O
- `docs/entregables-analisis-diseno/27-registro-adr.md` L356: **Contexto.** BI y exportaciones pesadas no deben afectar la facturación ni la atención, y DEC-001/D
- `docs/entregables-analisis-diseno/27-registro-adr.md` L986: | OBS-ADR-01 | Ubicación de los ADR | RNF-NFR-243 exige un ADR por archivo en `docs/adr/NNNN-titulo.
- `docs/entregables-analisis-diseno/27-registro-adr.md` L1004: | `docs/especificacion/01-registro-decisiones.md` | DEC-001 a DEC-089 |
- `docs/entregables-analisis-diseno/28-modelo-amenazas-seguridad.md` L13: | Fuentes | `docs/especificacion/01-registro-decisiones.md` (DEC-001 a DEC-089); `00-ESPECIFICACION-
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2-20261105/04f-procesos-identidad-acceso.md` L615: **Situación actual en ProCoop (nota de cambio).** DFA M1 proponía OpenIddict sobre .NET; el servidor
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2-20261105/_trabajo/reglas-comunes-ampliacion.md` L8: 2. **Prevalece la especificación**: T05 para nombres de colecciones y campos; el §7 de cada anexo pa
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/20-casos-prueba/T01-PLA-plataforma-saas.md` L13: ### 1.1 5.A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004) (T01 §5)
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/21-casos-de-uso/21-T01-PLA.md` L37: CUG_PLA_01(["CUG-PLA-01<br/>A. Arquitectura de referencia y stack (DEC-001, DEC-003..."])
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/21-casos-de-uso/21-T01-PLA.md` L133: CUG_PLA_01(["CUG-PLA-01<br/>A. Arquitectura de referencia y stack (DEC-001..."])
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/21-casos-de-uso/21-T01-PLA.md` L189: ### CUG-PLA-01 — A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004)
- `docs/entregables-analisis-diseno/_trabajo/backup-regen2b-2026-11-05/21-casos-de-uso/21-T01-PLA.md` L195: | Objetivo | A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004): La solución se prest
- `docs/entregables-analisis-diseno/_trabajo/reglas-comunes-ampliacion.md` L8: 2. **Prevalece la especificación**: T05 para nombres de colecciones y campos; el §7 de cada anexo pa
