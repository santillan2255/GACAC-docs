# Registro de decisiones de arquitectura (ADR) — GoodApps Cooperativas

**Entregable de Análisis y Diseño Detallado — Artefacto 5.3 (Registro de decisiones de arquitectura)**

| Campo | Valor |
|---|---|
| Producto | GoodApps Cooperativas — plataforma SaaS multitenant de gestión para cooperativas de servicios, reemplazo de ProCoop |
| Documento | Registro de decisiones de arquitectura y técnicas, en formato ADR (Michael Nygard / MADR) |
| Artefacto | 5.3 Registro de decisiones de arquitectura (ADR) del índice `00-INDICE.md` |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | `docs/especificacion/01-registro-decisiones.md` (DEC-001 a DEC-089); `00-ESPECIFICACION-MAESTRA.md` §3, §5, §6, §13 y §14; anexos T01 (plataforma), T02 (identidad, roles y auditoría), T05 (modelo de datos), T06 (integraciones y bóveda `integrationSecrets`), T07 (migración), T08 (no funcionales y seguridad), T10 y T11 en lo citado; `02-preguntas-abiertas.md`; documento de arquitectura `02-arquitectura-c4.md` de esta carpeta |
| Carácter | Documento derivado. No reemplaza la especificación: ante cualquier diferencia prevalecen la maestra, los anexos y el registro de decisiones `01`. |

## Control de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 05-11-2026 | Equipo de análisis y diseño (a definir nominalmente) | Versión inicial: 55 ADR derivados de las decisiones técnicas del registro `01` y de las decisiones implícitas en T01, T02, T05, T06, T07 y T08; lista de DEC no técnicas excluidas; observaciones e inconsistencias. |

## Aprobaciones

| Rol | Nombre | Fecha | Firma |
|---|---|---|---|
| Responsable de arquitectura | A definir | — | — |
| Responsable de seguridad (P-SEC) | A definir | — | — |
| Responsable de operaciones (P-OPS) | A definir | — | — |
| Representante del solicitante | A definir | — | — |

---

## Índice de ADR

| ADR | Título | Estado | Origen principal |
|---|---|---|---|
| [ADR-001](#adr-001--stack-tecnológico-nodejs-mongodb-y-vue) | Stack tecnológico Node.js, MongoDB y Vue | Aceptada | DEC-001 |
| [ADR-002](#adr-002--monolito-modular-con-fronteras-estrictas) | Monolito modular con fronteras estrictas | Aceptada | DEC-003 |
| [ADR-003](#adr-003--despliegue-en-contenedores-agnóstico-de-nube) | Despliegue en contenedores agnóstico de nube | Aceptada | DEC-004 |
| [ADR-004](#adr-004--región-de-alojamiento-aws-sa-east-1) | Región de alojamiento AWS sa-east-1 | Aceptada | DEC-062 |
| [ADR-005](#adr-005--continuidad-replica-set-multizona-pitr-y-restauración-por-tenant) | Continuidad: replica set multizona, PITR y restauración por tenant | Aceptada | DEC-063 |
| [ADR-006](#adr-006--design-system-propio-sin-librerías-de-interfaz-de-terceros) | Design system propio sin librerías de interfaz de terceros | Aceptada | T01 §7.1 |
| [ADR-007](#adr-007--configuración-tipada-y-versionada-y-diccionario-de-textos) | Configuración tipada y versionada y diccionario de textos | Aceptada | ARQ-05, ARQ-07 |
| [ADR-008](#adr-008--extensibilidad-acotada-sin-ejecución-dinámica-de-código) | Extensibilidad acotada, sin ejecución dinámica de código | Aceptada | DEC-079; RF-PLA-155 |
| [ADR-009](#adr-009--base-de-datos-única-compartida-con-tenantid) | Base de datos única compartida con `tenantId` | Aceptada | DEC-002 |
| [ADR-010](#adr-010--aislamiento-de-tenant-forzado-en-todas-las-superficies) | Aislamiento de tenant forzado en todas las superficies | Aceptada | DEC-002; RF-PLA-019 a RF-PLA-034 |
| [ADR-011](#adr-011--tenant-platform-y-colecciones-globales-en-lista-blanca) | Tenant `PLATFORM` y colecciones globales en lista blanca | Aceptada | RF-PLA-023, RF-PLA-036; DEC-065 |
| [ADR-012](#adr-012--colas-por-clase-de-carga-y-cuotas-por-tenant) | Colas por clase de carga y cuotas por tenant | Aceptada | DEC-075; RN-NFR-025 |
| [ADR-013](#adr-013--copia-entre-tenants-y-plantillas-de-plataforma-sin-datos-personales) | Copia entre tenants y plantillas de plataforma sin datos personales | Aceptada | DEC-025, DEC-026 |
| [ADR-014](#adr-014--outbox-transaccional-inbox-idempotente-y-workers-bullmq) | Outbox transaccional, inbox idempotente y workers BullMQ | Aceptada | DEC-003; RF-PLA-008 a RF-PLA-011 |
| [ADR-015](#adr-015--redis-no-es-fuente-de-verdad) | Redis no es fuente de verdad | Aceptada | RNF-NFR-041 |
| [ADR-016](#adr-016--almacén-analítico-en-un-miembro-dedicado-del-replica-set) | Almacén analítico en un miembro dedicado del replica set | Aceptada (asumida, DEC-072) | PA-BIA-01; RF-PLA-035 |
| [ADR-017](#adr-017--dinero-en-decimal128-y-decimaljs) | Dinero en `Decimal128` y `decimal.js` | Aceptada | RN-NFR-005; RN-DAT-005 |
| [ADR-018](#adr-018--idempotencia-por-idempotency-key-y-claves-naturales) | Idempotencia por `Idempotency-Key` y claves naturales | Aceptada | RN-NFR-007; ARQ-02 |
| [ADR-019](#adr-019--transacciones-multidocumento-y-control-optimista) | Transacciones multidocumento y control optimista | Aceptada | RNF-NFR-210, RNF-NFR-211 |
| [ADR-020](#adr-020--documentos-económicos-inmutables-y-anulación-por-contrapartida) | Documentos económicos inmutables y anulación por contrapartida | Aceptada | RN-DAT-004; RN-NFR-017 |
| [ADR-021](#adr-021--instantes-en-utc-y-fechas-de-negocio-en-la-zona-del-tenant) | Instantes en UTC y fechas de negocio en la zona del tenant | Aceptada | RN-NFR-018; RN-DAT-006 |
| [ADR-022](#adr-022--personas-jurídicas-por-tenant-y-cuenta-corriente-por-entidad) | Personas jurídicas por tenant y cuenta corriente por entidad | Aceptada | DEC-064, DEC-087 |
| [ADR-023](#adr-023--contrato-de-api-zod-rfc-9457-y-paginación-uniforme) | Contrato de API: Zod, RFC 9457 y paginación uniforme | Aceptada | RF-PLA-014, RF-PLA-015 |
| [ADR-024](#adr-024--versionado-de-api-externa-y-de-eventos) | Versionado de API externa y de eventos | Aceptada | RNF-NFR-174 a RNF-NFR-179 |
| [ADR-025](#adr-025--identidad-común-con-pertenencias-privadas-por-tenant) | Identidad común con pertenencias privadas por tenant | Aceptada | RF-IAM-001 a RF-IAM-010 |
| [ADR-026](#adr-026--autenticación-del-personal-y-modelo-de-sesión) | Autenticación del personal y modelo de sesión | Aceptada | RF-IAM-021, RF-IAM-035; RNF-NFR-060 a RNF-NFR-064 |
| [ADR-027](#adr-027--ingreso-del-socio-con-contraseña-u-otp-sin-enlace-mágico) | Ingreso del socio con contraseña u OTP, sin enlace mágico | Aceptada | DEC-066 |
| [ADR-028](#adr-028--proveedores-de-identidad-federados-y-cidi-córdoba) | Proveedores de identidad federados y CiDi Córdoba | Aceptada | DEC-067 |
| [ADR-029](#adr-029--autorización-por-capabilities-en-capas-con-denegación-por-defecto) | Autorización por capabilities en capas con denegación por defecto | Aceptada | RF-IAM-060, RF-IAM-061; RNF-NFR-090 |
| [ADR-030](#adr-030--acceso-de-soporte-temporal-y-acceso-de-emergencia) | Acceso de soporte temporal y acceso de emergencia | Aceptada con validación pendiente | RF-PLA-101 a RF-PLA-106; PA-PLA-05 |
| [ADR-031](#adr-031--auditoría-transaccional-inmutable-con-cadena-de-hash) | Auditoría transaccional inmutable con cadena de hash | Aceptada | RNF-NFR-110 a RNF-NFR-119 |
| [ADR-032](#adr-032--bóveda-de-secretos-propia-con-cifrado-por-sobre-y-kms) | Bóveda de secretos propia con cifrado por sobre y KMS | Aceptada | DEC-074 |
| [ADR-033](#adr-033--cifrado-de-campos-sensibles-por-tenant-y-categoría) | Cifrado de campos sensibles por tenant y categoría | Aceptada | RNF-NFR-055 a RNF-NFR-057 |
| [ADR-034](#adr-034--secretos-de-plataforma-en-gestor-de-secretos-y-arranque-seguro) | Secretos de plataforma en gestor de secretos y arranque seguro | Aceptada | RNF-PLA-001; RNF-NFR-067, RNF-NFR-070 |
| [ADR-035](#adr-035--almacenamiento-de-objetos-privado-con-url-firmadas-y-antivirus) | Almacenamiento de objetos privado con URL firmadas y antivirus | Aceptada | RF-PLA-012; RNF-NFR-058, RNF-NFR-078 a RNF-NFR-081 |
| [ADR-036](#adr-036--integraciones-solo-por-conectores-con-estados-explícitos) | Integraciones solo por conectores con estados explícitos | Aceptada | ARQ-06; DEC-041 |
| [ADR-037](#adr-037--webhooks-entrantes-como-disparadores-verificados) | Webhooks entrantes como disparadores verificados | Aceptada | RF-INT-053 a RF-INT-057; RN-NFR-008 |
| [ADR-038](#adr-038--egreso-controlado-y-protección-contra-ssrf) | Egreso controlado y protección contra SSRF | Aceptada | RF-INT-079; RNF-NFR-087 |
| [ADR-039](#adr-039--emisión-fiscal-con-contingencia-y-numeración-sin-huecos) | Emisión fiscal con contingencia y numeración sin huecos | Aceptada | DEC-018, DEC-035, DEC-038 |
| [ADR-040](#adr-040--certificado-arca-generado-en-la-plataforma) | Certificado ARCA generado en la plataforma | Aceptada | DEC-053 |
| [ADR-041](#adr-041--credenciales-de-proveedor-de-plataforma-o-propias-del-tenant) | Credenciales de proveedor de plataforma o propias del tenant | Aceptada | DEC-020, DEC-077 |
| [ADR-042](#adr-042--proveedores-iniciales-detrás-de-adaptadores-canónicos) | Proveedores iniciales detrás de adaptadores canónicos | Aceptada | DEC-015, DEC-046, DEC-055 |
| [ADR-043](#adr-043--aprovisionamiento-automático-asíncrono-con-respaldo-manual) | Aprovisionamiento automático asíncrono con respaldo manual | Aceptada | DEC-041, DEC-042 |
| [ADR-044](#adr-044--la-inteligencia-artificial-solo-propone) | La inteligencia artificial solo propone | Aceptada | ARQ-08; DEC-056 |
| [ADR-045](#adr-045--motor-de-pdf-con-chromium-sin-interfaz-en-workers-dedicados) | Motor de PDF con Chromium sin interfaz en workers dedicados | Aceptada | DEC-080 |
| [ADR-046](#adr-046--interfaz-de-firma-propia-con-otp-y-firma-digital-licenciada) | Interfaz de firma propia con OTP y firma digital licenciada | Aceptada | DEC-078 |
| [ADR-047](#adr-047--pwa-única-con-cola-offline-idempotente) | PWA única con cola offline idempotente | Aceptada | RNF-NFR-187; RNF-NFR-219 |
| [ADR-048](#adr-048--agente-local-propio-con-canal-saliente) | Agente local propio con canal saliente | Aceptada (asumida, DEC-072) | PA-INT-09; RF-INT-084 |
| [ADR-049](#adr-049--encargado-de-tratamiento-exportación-purga-y-libro-de-supresiones) | Encargado de tratamiento: exportación, purga y libro de supresiones | Aceptada | DEC-076 |
| [ADR-050](#adr-050--observabilidad-con-opentelemetry-y-correlación-extremo-a-extremo) | Observabilidad con OpenTelemetry y correlación extremo a extremo | Aceptada | RNF-NFR-119 a RNF-NFR-139 |
| [ADR-051](#adr-051--entrega-continua-con-imágenes-firmadas-y-migraciones-expandircontraer) | Entrega continua con imágenes firmadas y migraciones expandir/contraer | Aceptada | RNF-NFR-164 a RNF-NFR-168 |
| [ADR-052](#adr-052--ambientes-separados-y-datos-ficticios-fuera-de-producción) | Ambientes separados y datos ficticios fuera de producción | Aceptada | RF-PLA-109, RF-PLA-110; RN-NFR-014 |
| [ADR-053](#adr-053--migración-con-extracción-de-solo-lectura-snapshots-e-histórico-acotado) | Migración con extracción de solo lectura, snapshots e histórico acotado | Aceptada | DEC-070, DEC-087; RF-MIG-010, RF-MIG-011 |
| [ADR-054](#adr-054--convivencia-con-procoop-y-corte-por-etapas) | Convivencia con ProCoop y corte por etapas | Aceptada | DEC-068, DEC-069, DEC-088, DEC-089 |
| [ADR-055](#adr-055--identificador-de-pago-autocontenido-durante-la-transición) | Identificador de pago autocontenido durante la transición | Aceptada | DEC-050 |

---

## 1. Propósito, alcance y convenciones

### 1.1 Propósito

Este registro documenta, en formato ADR, cada decisión de arquitectura o técnica vigente de GoodApps Cooperativas: el problema que resuelve, la opción elegida, las alternativas evaluadas y sus consecuencias. Sirve como fuente única para el equipo de desarrollo (asistido por Cursor IA, maestra §16) y como base de los ADR por archivo que exige RNF-NFR-243 en el repositorio de código (`docs/adr/NNNN-titulo.md`).

### 1.2 Criterio de selección

- **Incluidas**: las DEC de `01-registro-decisiones.md` con efecto técnico (stack, datos, despliegue, seguridad, integraciones, documentos, identidad, migración) y las decisiones técnicas implícitas en los anexos T01, T02, T05, T06, T07 y T08 que cumplen al menos una condición de RNF-NFR-243: afectan a más de un módulo, a la seguridad o resuelven una contraposición técnica (CTR).
- **Excluidas**: las DEC de reglas de negocio puras (catálogo, facturación, mora, CRM, contabilidad funcional) y de organización del entregable. Se listan en la sección 3 con el motivo.
- Una DEC puede originar varios ADR y un ADR puede consolidar varias DEC cuando resuelven el mismo problema técnico.

### 1.3 Convenciones

- **Estados**: *Aceptada* (DEC vigente o requisito `Adoptado`); *Aceptada (asumida, DEC-072)* cuando proviene de una pregunta abierta resuelta con la opción recomendada por la política DEC-047/DEC-072, revisable por el solicitante; *Aceptada con validación pendiente* cuando parte del requisito figura `A validar` en su anexo. Ningún ADR de este registro está *Reemplazado*; DEC-081 (reemplazada por DEC-088) no es técnica.
- **Alternativas**: se citan las opciones de la pregunta abierta (PA) o de la contraposición (CTR) que la especificación registra. Cuando la fuente no documenta alternativas, se indica *(alternativa de análisis, no registrada en la especificación)*.
- **Origen**: identificadores DEC, RF, RN, RNF, CTR, PA y ARQ de la especificación; las referencias a `02-arquitectura-c4.md` usan sus propios códigos (RT-, RA-, DT-).
- Este registro no contradice `02-arquitectura-c4.md` §10, que es un resumen tabular; aquí se agregan alternativas, consecuencias y decisiones implícitas.

---

## 2. Registro de decisiones

### 2.1 Estilo de arquitectura y plataforma

#### ADR-001 — Stack tecnológico Node.js, MongoDB y Vue

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-001, vigente desde 04-11-2026) |
| Origen | DEC-001; maestra §3 y §5.1; RF-PLA-002; RT-01 de `02-arquitectura-c4.md`; CTR-NFR-05, CTR-NFR-11 |

**Contexto.** ProCoop es una aplicación .NET de escritorio sobre SQL Server con un portal (CoopOnline) sobre MySQL. El documento funcional previo (DFA) proponía .NET, Azure y SQL Server. El solicitante dispone de Connectia, un producto propio con patrones probados en Node y Vue, con mejoras marcadas [MEJORAR].

**Decisión.** Node.js 20 LTS (ESM) con Express 4; MongoDB 7 en replica set con Mongoose 8; Vue 3.5 + Vite + Pinia + Vue Router + Tailwind; Zod para validación compartida; Redis + BullMQ para colas; `vite-plugin-pwa` e IndexedDB para la PWA. Se reutilizan los patrones de Connectia aplicando sus correcciones.

**Alternativas consideradas.** .NET + Azure + SQL Server (DFA): descartada por DEC-001. Biblioteca OpenIddict propuesta en DFA M1: reemplazada por una biblioteca OIDC sobre Node (CTR-NFR-11). Validación manual de Connectia: reemplazada por Zod (CTR-NFR-05).

**Consecuencias.** Monorepo JavaScript único (`apps/`, `packages/`, `infra/`) con esquemas compartidos entre backend y frontends. Las transacciones multidocumento exigen replica set también en local y CI. MongoDB no ofrece aritmética decimal en la aplicación, lo que obliga a ADR-017. Los defectos heredados de Connectia (firma HS256, schedulers con `setInterval`, archivos en disco público) se corrigen en ADR-026, ADR-014 y ADR-035.

#### ADR-002 — Monolito modular con fronteras estrictas

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-003, vigente) |
| Origen | DEC-003; maestra §5.3 ARQ-01; RF-PLA-004 a RF-PLA-007; ARQ-PLA-01 a ARQ-PLA-06 y ARQ-PLA-12; RNF-NFR-240 |

**Contexto.** El producto abarca 26 módulos de dominio y transversales con un equipo acotado y desarrollo asistido por IA. Se necesitan fronteras claras sin el costo operativo de muchos servicios distribuidos.

**Decisión.** Un único código desplegado como un proceso API y N procesos worker (ARQ-PLA-01). Cada módulo vive en `apps/api/src/modules/<cod>/` con plantilla fija, declara un `manifest.js` y es dueño exclusivo de sus colecciones. Otros módulos solo usan su `index.js` (comandos síncronos) o sus eventos. Grafo de dependencias acíclico verificado por `check:boundaries`; prohibido `$lookup` a colecciones de otro módulo (ARQ-PLA-04).

**Alternativas consideradas.** Separación en bases o servidores por módulo: descartada (ARQ-PLA-05). Event sourcing completo: descartado; se usa estado actual + auditoría + outbox (ARQ-PLA-06). Microservicios desde el inicio *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Un solo despliegue y una sola base simplifican la operación y las transacciones. El riesgo de erosión de fronteras (RA-02 de `02-arquitectura-c4.md`) se controla en CI. Si un módulo necesita escalar aparte, se extrae primero su worker o cola (ARQ-PLA-12).

#### ADR-003 — Despliegue en contenedores agnóstico de nube

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-004, vigente) |
| Origen | DEC-004; RF-PLA-013; RNF-NFR-171, RNF-NFR-245; RNF-PLA-008, RNF-PLA-009; CTR-NFR-08 |

**Contexto.** Se busca evitar la dependencia de un proveedor de nube y poder operar en otro proveedor o en infraestructura propia.

**Decisión.** Imágenes Docker inmutables (`api`, `worker`, `admin`, `pwa`, `landing`) desde un Dockerfile multi-stage, promovidas por digest entre ambientes. Servicios de nube consumidos detrás de adaptadores (almacenamiento S3-compatible, KMS y secretos detrás de interfaz, colas sobre Redis). AWS es la referencia. Infraestructura como código con detección de deriva semanal.

**Alternativas consideradas.** Despliegue por SSH con `git reset --hard` y `.env` a mano (Connectia §2.8): descartado (CTR-NFR-08, RNF-PLA-009). Servicios propietarios no sustituibles (funciones sin servidor, bases propietarias) *(alternativa de análisis, no registrada en la especificación)*: descartados por DEC-004.

**Consecuencias.** Portabilidad a costa de no aprovechar servicios gestionados exclusivos. Quedan a definir el orquestador (ECS Fargate o EKS), la herramienta de IaC (Terraform o CDK) y si MongoDB es Atlas sobre AWS o autogestionado (`02-arquitectura-c4.md` §9). La dependencia de KMS y Secrets Manager se acota con interfaces agnósticas (RA-07).

#### ADR-004 — Región de alojamiento AWS sa-east-1

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-062, vigente) |
| Origen | DEC-062; PA-PLA-01; PA-NFR-05; RNF-NFR-105; RF-PLA-157; RF-NFR-013 |

**Contexto.** Los datos personales de socios argentinos se alojan fuera del país si se usa una región de nube pública. Se requiere baja latencia regional y cumplimiento de la Ley 25.326 sobre transferencias internacionales.

**Decisión.** Producción en AWS sa-east-1 (San Pablo), con cláusulas contractuales de transferencia internacional según la AAIP, informadas en el aviso de privacidad y en el registro de subencargados. La región se declara por tenant en el contrato y todos sus datos y backups residen en ella.

**Alternativas consideradas.** (PA-PLA-01) B: AWS us-east-1, menor costo y mayor latencia y exigencia contractual. C: proveedor con centro de datos en Argentina para la base y AWS para el resto, más soberanía y mayor complejidad operativa.

**Consecuencias.** Transferencia internacional permanente que exige el registro de subencargados (incluidos los de observabilidad e IA). La región secundaria de recuperación ante desastre y la cuenta de backups quedan a definir; su elección debe respetar las mismas garantías.

#### ADR-005 — Continuidad: replica set multizona, PITR y restauración por tenant

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-063, vigente) |
| Origen | DEC-063; PA-PLA-02/03; RNF-NFR-030 a RNF-NFR-049; RF-PLA-118 a RF-PLA-125; RN-NFR-016 |

**Contexto.** Las cooperativas facturan y cobran en días críticos; perder cobros del día o restaurar a todos los tenants por el error de uno es inaceptable en una base compartida.

**Decisión.** Disponibilidad 99,5 % mensual; RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h de plataforma completa. MongoDB en replica set de 3 nodos en 3 zonas con `writeConcern: majority`; PITR continuo con snapshots diarios, semanales y mensuales; backup lógico diario por tenant; restauración selectiva en un cluster aislado con diferencia y aplicación controlada; conciliación con ARCA, pasarelas y mensajería antes de reanudar; backups en cuenta separada con claves KMS propias; ensayos periódicos.

**Alternativas consideradas.** (PA-PLA-02) B: RPO y RTO de 24 h, más barato y con riesgo de perder los cobros del día. C: RPO de 1 min y RTO de 1 h, que requiere multirregión activa de alto costo.

**Consecuencias.** La restauración no revierte efectos externos ya confirmados (RN-NFR-016) ni la auditoría (RF-PLA-124) y reaplica las supresiones posteriores (ver ADR-049). La recuperación regional tiene objetivos distintos (RPO ≤ 1 h, RTO ≤ 24 h, RNF-NFR-046). Costo de almacenamiento y de ensayos mensuales y trimestrales.

#### ADR-006 — Design system propio sin librerías de interfaz de terceros

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | T01 §7.1; RT-12 de `02-arquitectura-c4.md`; maestra §11; RNF-NFR-180, RNF-NFR-182 |

**Contexto.** Cada cooperativa aplica su marca en tiempo de ejecución y la interfaz debe cumplir WCAG 2.2 AA en dispositivos de gama baja.

**Decisión.** Design system propio en `packages/ui`, compartido por admin y PWA, sin librerías de componentes, íconos, gráficos ni i18n de terceros. Tokens de marca por tenant con cálculo de contraste al publicar.

**Alternativas consideradas.** Librerías de componentes de terceros *(alternativa de análisis, no registrada en la especificación)*: descartadas por T01 §7.1.

**Consecuencias.** Mayor esfuerzo inicial en O0; control total de accesibilidad, tamaño de paquete (RNF-NFR-008) y superficie de dependencias (menor exposición de cadena de suministro).

#### ADR-007 — Configuración tipada y versionada y diccionario de textos

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §5.3 ARQ-05 y ARQ-07; ARQ-PLA-08; RNF-NFR-028, RNF-NFR-192, RNF-NFR-256; RN-NFR-027 |

**Contexto.** ProCoop dispersa su comportamiento en miles de variables y constantes; cada cooperativa necesita reglas y textos propios sin cambios de código.

**Decisión.** Configuración tipada, versionada y publicada (T04), con caché invalidada por evento en ≤ 60 s y reversión a la versión anterior sin pérdida de datos operativos. Ningún texto fijo en la interfaz: claves `dict:<clave>` con texto base de respaldo y personalización por tenant.

**Alternativas consideradas.** Constantes en código y variables sin tipo heredadas de ProCoop: descartadas (ARQ-05).

**Consecuencias.** Toda regla configurable requiere esquema, validación y versión; las cachés de configuración no contienen datos personales (RNF-NFR-028).

#### ADR-008 — Extensibilidad acotada, sin ejecución dinámica de código

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-079, vigente) |
| Origen | DEC-079; PA-WFL-04; RF-PLA-155; RNF-NFR-238; RN-INT-045, RN-INT-046 |

**Contexto.** ProCoop ejecuta procedimientos por nombre, formularios por reflexión y SQL recibido en tiempo de ejecución, lo que abre la puerta a inyección y ejecución arbitraria.

**Decisión.** El tenant ajusta plantillas de plataforma en puntos de extensión y crea trámites nuevos solo de tipo "solicitud genérica" que terminan en tarea o caso. No existen modos por línea de comandos ni ejecución de funciones por nombre; cada proceso batch es un job registrado. Prohibida la invocación dinámica de código a partir de datos.

**Alternativas consideradas.** (PA-WFL-04) B: diseñador libre con acciones tipadas y nodos obligatorios por dominio. C: solo plantillas de plataforma sin edición.

**Consecuencias.** Menor flexibilidad para el tenant; superficie de ataque acotada y comportamiento verificable en pruebas.

### 2.2 Multitenancy y aislamiento

#### ADR-009 — Base de datos única compartida con `tenantId`

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-002, vigente) |
| Origen | DEC-002; maestra §6; RF-PLA-016 a RF-PLA-018; RN-DAT-001; RNF-NFR-025; CTR-NFR-02, CTR-NFR-11 |

**Contexto.** ProCoop usa una base por cooperativa elegida por archivo local; DFA proponía mantenerla. El solicitante pidió explícitamente "multitenant tradicional, una base de datos única con todo pero con identificadores de a qué cooperativa pertenecés".

**Decisión.** Una sola base MongoDB compartida por ambiente; todo documento de negocio lleva `tenantId` (ObjectId, obligatorio, inmutable); todo índice compuesto, incluidos únicos, parciales, TTL y geoespaciales, empieza por `tenantId`.

**Alternativas consideradas.** Base por cooperativa (ProCoop, DFA M1): descartada (CTR-NFR-02). Base o esquema por tenant con enrutamiento por conexión *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Operación, migraciones e índices únicos para todos los tenants. El riesgo principal es la fuga entre tenants (RA-01), que se compensa con ADR-010 y con el cifrado de campo por tenant de ADR-033 (CTR-NFR-02). La restauración de un tenant requiere backup lógico por tenant (ADR-005) y el vecino ruidoso requiere ADR-012.

#### ADR-010 — Aislamiento de tenant forzado en todas las superficies

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | DEC-002; RF-PLA-019 a RF-PLA-034; RN-NFR-001, RN-NFR-002; RN-DAT-002; RNF-NFR-148, RNF-NFR-149, RNF-NFR-238; RNF-NFR-115, RNF-NFR-133 |

**Contexto.** Con base compartida, una consulta sin filtro o un identificador manipulado expone datos de otra cooperativa. La disciplina del programador no alcanza como control.

**Decisión.** El tenant sale del claim `tid` del token o del contexto del job, nunca de un header, query o body. Un contexto `AsyncLocalStorage` propaga `tenantId`, actor, `requestId`, `correlationId` y `supportGrantId`. El plugin de tenancy de Mongoose inyecta el filtro en toda operación (incluidos `$lookup`, `$unionWith`, `$graphLookup`, `bulkWrite` e `insert*`) y lanza error si falta el contexto. El único escape es `runAsPlatform` con motivo y auditoría. Jobs, eventos, objetos, claves de Redis, exportaciones, búsquedas, IA, logs y webhooks llevan el tenant. Un acceso cruzado responde 404, se audita y alerta SEV2. Una suite de aislamiento con dos tenants recorre todas las rutas y jobs y bloquea el merge; una prueba de mutación verifica que deshabilitar el plugin rompe la suite.

**Alternativas consideradas.** Filtro por convención en cada consulta, sin plugin *(alternativa de análisis, no registrada en la especificación)*. Tenant informado por header o selector del cliente: descartado (RN-NFR-001).

**Consecuencias.** Toda colección nueva declara su tenancy o el arranque falla (RF-PLA-023). Costo de mantenimiento de la suite y del lint de agregaciones. Detalle de controles en `28-modelo-amenazas-seguridad.md` §6.

#### ADR-011 — Tenant `PLATFORM` y colecciones globales en lista blanca

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RF-PLA-023, RF-PLA-036 a RF-PLA-040; DEC-065; PA-PLA-08; T05 §7.1.2 y §7.1.3 |

**Contexto.** El operador del SaaS necesita catálogos globales, facturar el servicio y operar la plataforma sin romper el modelo de tenancy.

**Decisión.** Existe el tenant técnico `PLATFORM`, creado por migración idempotente, que aloja catálogos de plataforma de solo lectura para los tenants y usa los módulos funcionales para su propia gestión (incluida la facturación del SaaS con M05 desde O5). Solo las colecciones de una lista blanca no llevan `tenantId`; cualquier otra sin `tenantId` es defecto bloqueante.

**Alternativas consideradas.** (PA-PLA-08) B: sistema externo de facturación permanente. C: facturación manual sin prefactura. Colecciones globales sin lista cerrada *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Pertenecer a `PLATFORM` no da acceso a datos de negocio de los tenants (RF-PLA-038); ese acceso pasa por ADR-030. La lista blanca difiere entre T01 y T05 (ver sección 4, OBS-ADR-03).

#### ADR-012 — Colas por clase de carga y cuotas por tenant

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-075, vigente) |
| Origen | DEC-075; PA-NFR-03; RN-NFR-025; RF-PLA-129 a RF-PLA-135; RNF-NFR-020 a RNF-NFR-024, RNF-NFR-029; DT-01 de `02-arquitectura-c4.md` |

**Contexto.** El perfil de capacidad va de 25.000 a 150.000 suministros por tenant, con diseño para 100 tenants y crecimiento a 300 sin rediseño. Un lote de un tenant grande no puede degradar la caja de otro.

**Decisión.** Colas BullMQ por clase de carga (`interactive`, `integration`, `events`, `notifications`, `batch`, `export`, `ai`, `maintenance`) con prioridad y concurrencia global y por tenant; réplicas de workers separadas por cola; rate limiting y cuotas por tenant configurables por plan; lecturas pesadas en secundarios; rechazo temprano de `batch` y `bulk` ante sobrecarga.

**Alternativas consideradas.** (PA-NFR-03) B: tenant grande de 50.000 y 50 tenants, con riesgo de rediseño temprano. C: tenant grande de 500.000, que sobredimensiona. Cola única FIFO o workers dedicados por tenant *(alternativas de análisis, no registradas en la especificación)*.

**Consecuencias.** Las clases de cola y la concurrencia batch por tenant difieren entre T01 y T08 (DT-01 del documento C4); debe unificarse antes de O0.

#### ADR-013 — Copia entre tenants y plantillas de plataforma sin datos personales

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-025 y DEC-026, vigentes) |
| Origen | DEC-025, DEC-026; RF-PLA-164, RF-PLA-165; RF-INT-008; RN-NFR-013 |

**Contexto.** Las cooperativas quieren reutilizar configuraciones de servicios entre sí y la plataforma quiere ofrecer plantillas, sin romper el aislamiento.

**Decisión.** La copia de configuración entre tenants requiere autorización explícita del tenant origen. Las plantillas de plataforma no incluyen precios ni condiciones reguladas. Ninguna copia traslada datos personales, credenciales, secretos, identificadores externos ni estados.

**Alternativas consideradas.** Copia libre por la plataforma sin consentimiento del origen *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** La copia se implementa como operación de plataforma auditada (`runAsPlatform` con motivo) con lista blanca de campos copiables.

### 2.3 Consistencia, datos y dinero

#### ADR-014 — Outbox transaccional, inbox idempotente y workers BullMQ

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-003, vigente) |
| Origen | DEC-003; RF-PLA-008 a RF-PLA-011; T01 §7.6; RNF-NFR-013, RNF-NFR-014, RNF-NFR-214, RNF-NFR-215; RN-NFR-024; CTR-NFR-06 |

**Contexto.** Los efectos entre módulos (factura → cuenta corriente → asiento) deben ocurrir siempre y una sola vez, aunque fallen procesos o redes.

**Decisión.** El cambio de negocio, su evento (`outboxEvents`) y su auditoría se escriben en la misma transacción. Un relay único por elección de líder (lock en Redis) lee por change stream con sondeo de respaldo y encola un job por consumidor (`jobId = <eventId>:<consumer>`). Cada consumidor aplica su efecto e inserta `inboxReceipts` en la misma transacción. Jobs `<modulo>:<proceso>` idempotentes, reanudables, con progreso en `jobRuns`; agotados los reintentos van a `deadLetters` con alerta.

**Alternativas consideradas.** Schedulers con `setInterval` dentro del API (Connectia): descartados (CTR-NFR-06). Event sourcing completo: descartado (ARQ-PLA-06). Publicar a la cola después del commit sin outbox *(alternativa de análisis, no registrada en la especificación)*: pierde eventos ante caídas.

**Consecuencias.** Entrega al menos una vez: todo consumidor debe ser idempotente. Latencia de outbox p95 ≤ 5 s con alerta a 60 s (RNF-NFR-014). El relay único es un punto de riesgo (RA-05) mitigado con elección de líder y reprocesamiento.

#### ADR-015 — Redis no es fuente de verdad

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-NFR-041; RNF-NFR-023; RF-PLA-026; RNF-PLA-015 |

**Contexto.** Redis aloja colas, caché, rate limiting, locks, circuit breakers y tokens de integración; su pérdida no puede perder trabajo ni duplicar efectos.

**Decisión.** Todo estado de jobs, progreso y resultado se persiste en MongoDB. Ante pérdida total de Redis se reencola desde Mongo en ≤ 15 min sin duplicar efectos. Claves con prefijo `t:<tenantId>:` o `p:`; prohibido cachear respuestas con datos personales en caché compartida.

**Alternativas consideradas.** Redis con persistencia como almacén de estado *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** API y workers sin estado en memoria; escalado horizontal sin afinidad de sesión. Redis con réplica y failover para disponibilidad, no para durabilidad.

#### ADR-016 — Almacén analítico en un miembro dedicado del replica set

| Campo | Valor |
|---|---|
| Estado | Aceptada (asumida, DEC-072) |
| Origen | PA-BIA-01; T10 §7.15; RF-PLA-035; RNF-NFR-022, RNF-NFR-106 |

**Contexto.** BI y exportaciones pesadas no deben afectar la facturación ni la atención, y DEC-001/DEC-004 fijan MongoDB y despliegue agnóstico.

**Decisión.** Base lógica `<db>_analytics` con colecciones `bi_*` proyectadas desde eventos, leída desde un miembro oculto del replica set con etiqueta `analytics` (prioridad 0). Lecturas pesadas con `secondaryPreferred` y desfase máximo de 90 s, mostrando la fecha de corte.

**Alternativas consideradas.** (PA-BIA-01) B: cluster MongoDB separado para analítica, más aislamiento y más costo. C: sin almacén, todo BI sobre secundarios operativos, con riesgo en horas pico y sin historización.

**Consecuencias.** Sin tecnología nueva. Los cubos trabajan con seudónimos y suprimen celdas reidentificables (RNF-NFR-106). El miembro analítico comparte hardware de replicación y requiere dimensionamiento propio (a definir).

#### ADR-017 — Dinero en `Decimal128` y `decimal.js`

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §13; RN-NFR-005, RN-NFR-006; RN-DAT-005; T05 §7.1.7; RNF-NFR-152, RNF-NFR-200 a RNF-NFR-206; RT-05 |

**Contexto.** La exactitud económica es el segundo atributo de calidad prioritario: cero diferencias de centavos entre comprobante, cuenta corriente y contabilidad. ProCoop usa `money`/`float` en SQL Server.

**Decisión.** Importes, tasas, alícuotas, precios y cantidades facturables en `Decimal128` en Mongo y `decimal.js` en `packages/shared/money` (precisión 34). En la API viajan como cadena decimal con moneda. Redondeo explícito por concepto; distribuciones por método de mayor resto. Regla SAST/ESLint que prohíbe `Number`, `parseFloat`, `toFixed` y `Math.round` en dominio monetario.

**Alternativas consideradas.** `Number` de JavaScript: prohibido (RN-NFR-005). Enteros en centavos *(alternativa de análisis, no registrada en la especificación)*: no cubre precios unitarios de 6 decimales ni tasas de 8 (RNF-NFR-202).

**Consecuencias.** Pruebas basadas en propiedades y de mutación sobre `money`. Agregaciones con `$toDecimal`. Serialización consistente entre API, eventos y exportaciones.

#### ADR-018 — Idempotencia por `Idempotency-Key` y claves naturales

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §5.3 ARQ-02 y §13; RN-NFR-007; RNF-NFR-151, RNF-NFR-212 a RNF-NFR-219, RNF-NFR-226; RF-INT-037 |

**Contexto.** Reintentos de red, doble clic, reenvío de webhooks y reprocesamiento de archivos de rendición pueden duplicar cobros o comprobantes.

**Decisión.** `Idempotency-Key` (UUID generado por el cliente) obligatorio en todo `POST`/`PATCH` económico o de integración; un reintento devuelve el mismo resultado. Claves naturales únicas como segunda barrera (por ejemplo `{tenantId, provider, externalPaymentId}`). Consumidores con `inboxReceipts`; jobs con ID determinista; offline con `clientMutationId`; archivos deduplicados por hash; operaciones de integración por `tenantId + operationType + businessKey`.

**Alternativas consideradas.** Deduplicación solo por clave natural *(alternativa de análisis, no registrada en la especificación)*: no cubre operaciones sin clave natural previa.

**Consecuencias.** La clave se registra en logs solo como hash (RNF-NFR-121). La colección que guarda las claves tiene definiciones duplicadas entre anexos (CTR-NFR-22, ver OBS-ADR-05).

#### ADR-019 — Transacciones multidocumento y control optimista

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-NFR-210, RNF-NFR-211, RNF-NFR-216, RNF-NFR-220; RF-IAM-139; T05 §7.1.4 y §7.1.15; RF-PLA-008; ARQ-PLA-03 |

**Contexto.** Una operación económica toca varios documentos (factura, ítems, cuenta corriente, asiento, auditoría, outbox) y varios usuarios editan las mismas fichas.

**Decisión.** Transacciones multidocumento con `writeConcern: majority` en toda operación que toque más de un documento económico. Campo `version` en todo documento de negocio; las actualizaciones condicionan `{_id, tenantId, version}` y un conflicto devuelve 409 problem+json. Exclusión mutua de procesos sobre el mismo universo con lease en Mongo; recursos escasos reservados con operación atómica condicional.

**Alternativas consideradas.** Bloqueos de filas al estilo ProCoop (`BLOQUEO_FILAS`, `GetMaxValue_Boqueo`): descartados (RN-INT-064, RF-IAM-140 los reemplaza por aviso de edición concurrente).

**Consecuencias.** Requiere replica set en todos los ambientes. El alcance de una transacción entre módulos está descripto de forma distinta en T01 y T05 (ver OBS-ADR-04).

#### ADR-020 — Documentos económicos inmutables y anulación por contrapartida

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RN-DAT-004; T05 §7.1.6; RN-NFR-017; RNF-NFR-205; CTR-NFR-17 |

**Contexto.** Facturas, recibos, asientos y movimientos tienen valor fiscal y contable; ProCoop usa tablas espejo de anulación.

**Decisión.** Los documentos económicos no se borran ni se editan después de emitidos; se corrigen con documentos de signo contrario (`reversalOf`/`reversedBy`). El modelo bloquea `deleteOne`/`deleteMany` y el usuario de base de la aplicación no tiene privilegio `remove` sobre esas colecciones (rol `appEconomicWriter`); validador `$jsonSchema` en base.

**Alternativas consideradas.** Tablas espejo `ANUFAC`, `ANUPAG_SOC` y similares de ProCoop: descartadas; se migran como documentos anulados.

**Consecuencias.** La supresión de datos personales no borra documentos económicos: bloquea y anonimiza los campos no obligatorios al vencer la conservación (CTR-NFR-17, ADR-049).

#### ADR-021 — Instantes en UTC y fechas de negocio en la zona del tenant

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RN-NFR-018; RN-DAT-006; RNF-NFR-138, RNF-NFR-194, RNF-NFR-228; RF-IAM-046; RNF-PLA-007; CTR-NFR-19 |

**Contexto.** ProCoop controla el desfase de reloj del puesto y usa fechas locales; en SaaS la hora del cliente no es confiable para auditoría ni vencimientos.

**Decisión.** Instantes en UTC con hora del servidor sincronizada por NTP; fechas de negocio como `YYYY-MM-DD` interpretadas en la zona del tenant (`America/Argentina/Cordoba` por defecto); períodos `YYYY-MM`. La hora del dispositivo de campo se guarda como dato declarado.

**Alternativas consideradas.** Control de desfase de reloj del puesto (ProCoop): reemplazado (CTR-NFR-19).

**Consecuencias.** Las marcas de auditoría y sesión no dependen del cliente; los cálculos de vencimiento son reproducibles.

#### ADR-022 — Personas jurídicas por tenant y cuenta corriente por entidad

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-064 y DEC-087, vigentes) |
| Origen | DEC-064; PA-PLA-14; DEC-087 (PA-DAT-01); RN-DAT-008; T05 §7.1.10 |

**Contexto.** Algunas cooperativas operan con más de un CUIT (equivalente a `EMPRESAS` de ProCoop), con emisión, contabilidad y sueldos separados.

**Decisión.** `legalEntities` del tenant (T04) y `legalEntityId` obligatorio en documentos económicos y fiscales desde O0. Una cuenta corriente por titular y por entidad jurídica; un cobro de caja puede cubrir varias entidades con un recibo por entidad.

**Alternativas consideradas.** (PA-PLA-14) B: un tenant por CUIT. C: solo para sueldos. (PA-DAT-01) B: cuenta corriente única con recibo de la entidad principal. C: cobro separado por entidad.

**Consecuencias.** Índices únicos de numeración por entidad y punto de venta; certificados y conexiones ARCA por entidad; mayor complejidad de imputación en caja.

### 2.4 Contratos de API y eventos

#### ADR-023 — Contrato de API: Zod, RFC 9457 y paginación uniforme

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §13; RF-PLA-014, RF-PLA-015; RNF-NFR-082, RNF-NFR-083, RNF-NFR-091, RNF-NFR-201, RNF-NFR-247; RT-07; CTR-NFR-05 |

**Contexto.** Cinco familias de rutas (`/api`, `/api/admin`, `/api/platform`, `/api/public/<tenantSlug>`, `/api/v1/ext`) consumidas por tres frontends, terceros y la IA de desarrollo requieren un contrato uniforme y seguro.

**Decisión.** Validación con esquemas Zod `.strict()` compartidos en `packages/shared/schemas` para `params`, `query`, headers relevantes y `body` de toda ruta; DTO de salida por rol; errores RFC 9457 (`application/problem+json`) con `requestId`, sin stack ni detalles internos en 5xx; paginación `{items, total, page, size}` con tope; OpenAPI generado desde los esquemas y verificado en cada PR.

**Alternativas consideradas.** Validación manual de Connectia: reemplazada (CTR-NFR-05). Formato de error propio *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Front y back comparten tipos; los cambios incompatibles se detectan por diff semántico de OpenAPI (RNF-NFR-143).

#### ADR-024 — Versionado de API externa y de eventos

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-NFR-174 a RNF-NFR-179; RF-PLA-153; PA-NFR-18; T11 §12.1; DT-08 de `02-arquitectura-c4.md` |

**Contexto.** Terceros integran contra `/api/v1/ext` y los consumidores internos dependen de la forma de los eventos; la PWA puede quedar en caché con una versión anterior.

**Decisión.** API interna sin versión en la ruta pero compatible con el front N-1 durante ≤ 14 días (`X-App-Version`). API externa versionada en ruta, solo cambios aditivos dentro de una versión mayor, deprecación con encabezados `Deprecation` y `Sunset` y aviso previo. Eventos con `schemaVersion`; un cambio incompatible crea un tipo nuevo o una versión mayor con doble publicación. Documentos con `schemaVersion` por colección.

**Alternativas consideradas.** Versionado por header *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Catálogo de eventos versionado (T11 §12.4); la convención de nombres de eventos aún no está normalizada entre anexos (DT-08).

### 2.5 Identidad y acceso

#### ADR-025 — Identidad común con pertenencias privadas por tenant

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §6; RF-IAM-001 a RF-IAM-010; ARQ-PLA-09; T05 §7.1.3 (`identities`, `federatedLinks`) |

**Contexto.** Una persona puede ser empleada de una cooperativa y socia de otra; ProCoop tiene usuarios por base.

**Decisión.** Una identidad de acceso común por persona (correo verificado como identificador global) con pertenencias privadas por tenant y contexto (`staff`, `portal`). Selección de ámbito explícita y verificada en servidor; el cambio de ámbito emite un token nuevo y limpia cachés del cliente. La coincidencia de DNI, CUIT, correo o teléfono nunca crea pertenencias ni fusiona identidades.

**Alternativas consideradas.** Usuario por tenant sin identidad común (modelo ProCoop) *(alternativa de análisis, no registrada en la especificación)*. Fusión automática por correo o documento: descartada (RF-IAM-006).

**Consecuencias.** `identities` y `federatedLinks` son colecciones globales: un tenant no puede consultar ni inferir las pertenencias de una persona en otro (RF-IAM-002).

#### ADR-026 — Autenticación del personal y modelo de sesión

| Campo | Valor |
|---|---|
| Estado | Aceptada con validación pendiente (PA-IAM-13 asumida) |
| Origen | RF-IAM-020 a RF-IAM-023, RF-IAM-033 a RF-IAM-044; RNF-NFR-060 a RNF-NFR-066, RNF-NFR-231, RNF-NFR-232; CTR-NFR-03, CTR-NFR-04, CTR-NFR-20; PA-IAM-11 |

**Contexto.** Connectia firma tokens con HS256 y un secreto compartido; ProCoop usa contraseñas maestras y derivadas de la fecha.

**Decisión.** Pre-login por subdominio o código sin revelar usuarios. Contraseñas con Argon2id (bcrypt costo ≥ 12 como mínimo heredado) y política NIST. MFA obligatoria para plataforma, T-ADM, T-USR y capabilities sensibles; SMS no admitido para roles de plataforma ni T-ADM; passkeys opcionales. Access JWT de 15 min firmado con EdDSA o ES256 y `kid`, rotación cada 90 días; refresh opaco rotativo de un solo uso guardado hasheado en `sessions`, en cookie `__Host-` `HttpOnly; Secure; SameSite=Strict`; reutilización de un refresh revoca la familia; revocación efectiva ≤ 60 s; refresh ≤ 12 h para administradores de plataforma. Step-up para acciones sensibles.

**Alternativas consideradas.** HS256 con secreto compartido (Connectia §2.5): reemplazado (CTR-NFR-03). bcrypt como único algoritmo: Argon2id preferido (CTR-NFR-04). Refresh de 30 días para todos: acotado para plataforma (CTR-NFR-20).

**Consecuencias.** El access token vive solo en memoria del front; nada sensible en `localStorage`. Gestión de claves de firma con rotación y superposición de verificación.

#### ADR-027 — Ingreso del socio con contraseña u OTP, sin enlace mágico

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-066, vigente) |
| Origen | DEC-066; PA-IAM-01; RF-IAM-024, RF-IAM-026, RF-IAM-048; DEC-043 |

**Contexto.** Los socios ingresan desde celulares de gama baja; se busca simplicidad sin abrir sesiones en navegadores ajenos.

**Decisión.** DNI o CUIT + contraseña dentro del tenant; OTP de 6 dígitos por correo o SMS habilitable por tenant; sin enlace mágico. La vinculación de un usuario a un titular exige prueba (código de factura + documento, código al contacto o validación presencial) con intentos limitados.

**Alternativas consideradas.** (PA-IAM-01) B: OTP y enlace mágico, con riesgo de sesiones abiertas en navegadores ajenos. C: solo contraseña y federados, con más pedidos de recuperación.

**Consecuencias.** El OTP cuenta como un factor; requiere rate limiting y anti-enumeración estrictos en pre-login, OTP y registro (RNF-NFR-075 a RNF-NFR-077).

#### ADR-028 — Proveedores de identidad federados y CiDi Córdoba

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-067, vigente) |
| Origen | DEC-067; PA-IAM-02; RF-IAM-025, RF-IAM-027 a RF-IAM-029 |

**Contexto.** CoopOnline ofrece CiDi; el personal de algunas cooperativas usa un proveedor corporativo.

**Decisión.** Mecanismo genérico de proveedor federado en O1; Google OIDC para socios con vínculo explícito; SSO OIDC por tenant para staff con dominios permitidos; CiDi Córdoba habilitable por tenant al publicar el portal (O2) con nivel mínimo 2 para vincular cuentas. Un IdP externo no satisface la política de MFA salvo que declare `amr`/`acr` y el tenant lo acepte.

**Alternativas consideradas.** (PA-IAM-02) B: CiDi solo en O2 junto con el portal. C: fuera de alcance hasta que una cooperativa lo pida.

**Consecuencias.** Sin fusión de cuentas por correo; la cadena de confianza incluye a cada IdP habilitado como subencargado o tercero.

#### ADR-029 — Autorización por capabilities en capas con denegación por defecto

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §7.1; RF-IAM-060 a RF-IAM-077, RF-IAM-090 a RF-IAM-096; RNF-NFR-090, RNF-NFR-150 |

**Contexto.** 40 roles en cuatro espacios, alcance por sucursal, zona o cuadrilla, límites de importe y separación de funciones.

**Decisión.** Capability `modulo.recurso.accion` declarada en código; acceso efectivo = licencia ∩ activación ∩ rol ∩ alcance. Un endpoint sin capability declarada no se monta. Denegaciones explícitas prevalecen; separación de funciones dinámica y estática; autorización de supervisor en el momento o diferida; `authzVersion` aplica cambios en ≤ 60 s; campos sensibles enmascarados salvo capability específica.

**Alternativas consideradas.** Permisos por pantalla al estilo `PERFILES` de ProCoop sin capabilities de acción *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Matriz de permisos negativos en CI; explicador de permisos para soporte (RF-IAM-069).

#### ADR-030 — Acceso de soporte temporal y acceso de emergencia

| Campo | Valor |
|---|---|
| Estado | Aceptada con validación pendiente (PA-PLA-05 y PA-IAM-06 asumidas) |
| Origen | RF-PLA-101 a RF-PLA-106; RF-IAM-111, RF-IAM-112; PA-PLA-05; PA-IAM-06; RNF-NFR-237; RN-NFR-004 |

**Contexto.** ProCoop tiene contraseñas maestras; un SaaS debe poder dar soporte sin que el operador vea datos de todas las cooperativas.

**Decisión.** Los roles de plataforma no acceden a datos operativos por defecto. El acceso de soporte es un permiso temporal vinculado a un caso, con alcance mínimo, modo observar (datos personales enmascarados) u operar/configurar (con aprobación del administrador del tenant), vencimiento y revocación; las acciones quedan con `actorType: 'support'` y `supportGrantId`. Acceso de emergencia para incidentes P1 con doble aprobación de plataforma y notificación inmediata al tenant; acceso de emergencia a infraestructura con SSO + MFA, segundo aprobador, sesión grabada y vigencia ≤ 4 h.

**Alternativas consideradas.** Contraseñas maestras o impersonación sin rastro: descartadas (RN-NFR-004, RF-PLA-103). Acceso permanente de soporte a todas las cooperativas: descartado (RF-PLA-106).

**Consecuencias.** El tenant ve y puede revocar las intervenciones. Las reglas de aprobación del acceso de emergencia no coinciden entre fuentes (ver OBS-ADR-06).

### 2.6 Seguridad, secretos y auditoría

#### ADR-031 — Auditoría transaccional inmutable con cadena de hash

| Campo | Valor |
|---|---|
| Estado | Aceptada con validación pendiente (PA-NFR-16 asumida) |
| Origen | T02 §7.17; RF-IAM-130 a RF-IAM-138; RNF-NFR-110 a RNF-NFR-119; RN-NFR-020 |

**Contexto.** ProCoop audita de forma selectiva y sin valores previos; las cooperativas necesitan evidencia confiable de cada cambio.

**Decisión.** Registros `auditLogs`, `auditAccess`, `auditReads`, `auditMessages` y `auditAi`. Cada cambio persistente se audita en la misma transacción (si falla la auditoría, falla el cambio). La identidad de base del API solo inserta y lee. Encadenamiento de hash por tenant con anclaje diario en almacenamiento WORM fuera de la base. Secretos nunca como valores (se registra "valor cambiado" y huella). Auditoría de lecturas obligatoria para salud, datos bancarios, informes de acceso, exportaciones, soporte y bóveda.

**Alternativas consideradas.** Auditoría selectiva por sentencia (ProCoop): reemplazada (RN-NFR-020). Event sourcing como auditoría: descartado (ARQ-PLA-06).

**Consecuencias.** Volumen alto de `auditLogs` con archivo en frío (RNF-NFR-116); una restauración no revierte la auditoría (RF-PLA-124).

#### ADR-032 — Bóveda de secretos propia con cifrado por sobre y KMS

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-074, vigente) |
| Origen | DEC-074; PA-INT-02; T06 §5.2 y §7.3; RF-INT-015 a RF-INT-023; RNF-NFR-056, RNF-NFR-068, RNF-NFR-069; RN-DAT-010 |

**Contexto.** ProCoop guarda credenciales en tablas y en código; cada tenant tiene decenas de credenciales de ARCA, pasarelas, bancos, mensajería y red.

**Decisión.** Bóveda única `integrationSecrets` en MongoDB con cifrado por sobre: AES-256-GCM con clave de datos por tenant, envuelta por una clave maestra en AWS KMS por ambiente, detrás de una interfaz agnóstica. API de solo escritura (solo nombre, huella HMAC y últimos 4 cuando corresponde); rotación con doble versión; cada descifrado auditado (`int.secret.decrypted`); el worker solo accede al secreto del tenant y conector del job; los demás anexos referencian la bóveda por `credentialRef`. Nunca se transcriben ni registran valores.

**Alternativas consideradas.** (PA-INT-02) B: HashiCorp Vault autogestionado, más operación. C: clave maestra en variable de entorno, sin separación ni rotación.

**Consecuencias.** Las credenciales heredadas de ProCoop se tratan como comprometidas y se regeneran (RF-INT-023). La continuidad de claves KMS condiciona las restauraciones (RNF-NFR-042).

#### ADR-033 — Cifrado de campos sensibles por tenant y categoría

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-NFR-055 a RNF-NFR-057, RNF-NFR-100; T05 §7.1.12; RN-DAT-009; CTR-NFR-02 |

**Contexto.** En una base compartida, un error de filtro o un acceso indebido a la base cruda expondría datos de salud o bancarios de todas las cooperativas.

**Decisión.** Cifrado a nivel de aplicación (`packages/shared/crypto`, única implementación permitida) con AES-256-GCM, nonce de 96 bits y clave de datos por tenant y por categoría; dato autenticado adicional con `tenantId`, colección, campo e `_id`. Alcance: salud, electrodependencia, CBU/CVU y cuentas, CUIL y familiares, documentos escaneados, notas confidenciales, secretos y semillas TOTP. Búsqueda exacta por índice ciego HMAC-SHA-256 por tenant. DNI y CUIT no se cifran a nivel de campo (son claves de búsqueda) pero se enmascaran.

**Alternativas consideradas.** Solo cifrado en reposo de volúmenes: insuficiente frente a la base compartida (CTR-NFR-02). Cifrado nativo del motor de base *(alternativa de análisis, no registrada en la especificación)*.

**Consecuencias.** Sin búsqueda parcial sobre campos cifrados. Rotación de claves de datos con re-cifrado diferido. Las categorías de clave difieren entre T05 y T08 (ver OBS-ADR-02).

#### ADR-034 — Secretos de plataforma en gestor de secretos y arranque seguro

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-PLA-001, RNF-PLA-005; RNF-NFR-067, RNF-NFR-069, RNF-NFR-070, RNF-NFR-099; RN-NFR-003, RN-NFR-004; RF-INT-083; CTR-NFR-08 |

**Contexto.** Cadenas de conexión, claves de firma de tokens y credenciales de proveedores de plataforma no pertenecen a un tenant y no pueden vivir en el repositorio ni en archivos `.env` mantenidos a mano.

**Decisión.** Gestor de secretos por ambiente (AWS Secrets Manager de referencia) con identidad de servicio por componente (API, worker, migraciones, analítica). En producción el proceso no arranca si falta un secreto, si tiene entropía insuficiente, si coincide con un valor de ejemplo o si falta la lista blanca de CORS. Escaneo de secretos en commits, CI e imágenes. Sin contraseñas por defecto ni puertas traseras en ningún ambiente.

**Alternativas consideradas.** `.env` a mano en servidores (Connectia §2.8): descartado (CTR-NFR-08).

**Consecuencias.** Credenciales productivas inaccesibles desde no producción (RNF-NFR-099); rotación de emergencia en ≤ 4 h.

#### ADR-035 — Almacenamiento de objetos privado con URL firmadas y antivirus

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RF-PLA-012, RF-PLA-025, RF-PLA-027, RF-PLA-120; RNF-NFR-039, RNF-NFR-058, RNF-NFR-078 a RNF-NFR-081; RN-NFR-026; CTR-NFR-07 |

**Contexto.** Connectia guarda archivos con `multer` en disco y sirve `/uploads` públicamente; ProCoop envía PDF al portal por FTP.

**Decisión.** Buckets privados por ambiente con cifrado del lado del servidor por KMS, claves de objeto con prefijo de tenant sin datos personales en el nombre; URL firmadas de un solo objeto emitidas tras verificar tenant, permiso y alcance (descarga ≤ 5 min). Toda subida entra a cuarentena, se valida por firma de contenido, se analiza con antivirus y se reencodifica si es imagen antes de habilitarse. Versionado y bloqueo WORM para comprobantes y documentos firmados.

**Alternativas consideradas.** `/uploads` público y disco local (Connectia): descartado (CTR-NFR-07). FTP de PDF al portal (ProCoop): descartado (RN-NFR-026).

**Consecuencias.** El producto antivirus de producción queda a definir (ClamAV en el entorno local, `02-arquitectura-c4.md` §4.2).

### 2.7 Integraciones

#### ADR-036 — Integraciones solo por conectores con estados explícitos

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | Maestra §5.3 ARQ-06; T06 §5.1 y §5.5; RF-INT-001 a RF-INT-014, RF-INT-032 a RF-INT-046; RF-PLA-142; RNF-NFR-047, RNF-NFR-221, RNF-NFR-222, RNF-NFR-227; RN-INT-012, RN-INT-035 |

**Contexto.** ProCoop integra con decenas de terceros mediante procesos por cooperativa, credenciales estáticas, esperas fijas y reintentos ad hoc.

**Decisión.** Toda integración pasa por un conector del marco T06 con catálogo de proveedores, conexión por tenant, capacidades declaradas, modo prueba/producción, credenciales en bóveda y colas por categoría. Cada llamada originada por un cambio de negocio se registra como `integrationOperation` en la misma transacción. Estados Pendiente, Confirmado, Fallido y Resultado incierto; ante incertidumbre se ejecuta la consulta de reconciliación antes de reintentar. Circuit breaker por conexión, límite de tasa saliente, taxonomía de errores, bandeja de operaciones detenidas y bitácora saneada. El conector no escribe colecciones de otros módulos; los efectos llegan por eventos.

**Alternativas consideradas.** Un proceso por cooperativa con credenciales estáticas (ProCoop, RN-INT-012): reemplazado. Reintentos de persistencia en bucle (RN-INT-035): reemplazados por transacción + outbox.

**Consecuencias.** Nuevo proveedor = nuevo adaptador sin tocar el dominio. Requiere simulador por conector para pruebas (RF-INT-031).

#### ADR-037 — Webhooks entrantes como disparadores verificados

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RF-INT-053 a RF-INT-058; RF-PLA-031; RNF-NFR-018, RNF-NFR-088; RN-NFR-008; RN-INT-009, RN-INT-032 |

**Contexto.** En ProCoop una pasarela acepta como pagado el importe que informa el portal y los avisos llegan por Firebase escuchado por un agente.

**Decisión.** Endpoint por conexión en `/api/public/{tenantSlug}/webhooks/{endpointKey}` con clave aleatoria rotable; verificación de firma del proveedor (HMAC, firma asimétrica, mTLS o lista de IP) con ventana anti-repetición; bandeja durable, acuse 2xx en < 2 s y procesamiento asíncrono con deduplicación. El webhook es solo disparador: antes de un efecto económico se reconsulta el estado al proveedor con credenciales propias. El retorno del navegador nunca confirma un pago.

**Alternativas consideradas.** Confirmación por importe informado por el cliente o el portal: descartada (RN-INT-009, RN-NFR-008). Escucha de Firebase por agente: reemplazada (RN-INT-032).

**Consecuencias.** Un webhook falso con firma válida no confirma pagos inexistentes. Dependencia de la API de consulta de cada proveedor.

#### ADR-038 — Egreso controlado y protección contra SSRF

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RF-INT-079, RF-INT-080; RNF-NFR-053, RNF-NFR-087; RNF-PLA-003 |

**Contexto.** Connectia expone un proxy genérico de medios (riesgo SSRF) y ProCoop permite desactivar la validación de certificados con una variable.

**Decisión.** Toda llamada saliente usa un cliente HTTP único (`packages/shared/http`) con lista blanca de hosts por conector y ambiente, bloqueo de rangos privados, loopback y servicio de metadatos de la nube. TLS 1.2+ con validación de certificado siempre activa, sin opción para desactivarla. Egreso de los workers por NAT o proxy con lista blanca.

**Alternativas consideradas.** Proxy genérico de medios (Connectia V-05): descartado. Parámetro para desactivar la validación TLS (ProCoop): descartado (RF-INT-080).

**Consecuencias.** Los tipos de conector "genéricos" con URL configurable por el tenant requieren validación adicional de destino.

#### ADR-039 — Emisión fiscal con contingencia y numeración sin huecos

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-018, DEC-035 y DEC-038, vigentes) |
| Origen | DEC-018, DEC-035, DEC-038; PA-CFG-P2-06; RF-INT-038, RF-INT-074, RF-INT-076; RN-INT-005; RNF-NFR-011, RNF-NFR-217 |

**Contexto.** ARCA puede estar lenta o caída en una facturación masiva o en mostrador; un timeout en la solicitud de CAE puede generar números duplicados.

**Decisión.** En mostrador se espera el CAE con tiempo máximo; luego CAEA (si está habilitado) o comprobante pendiente no entregable como fiscal. En masiva se emite y encola, pausando solo la autorización. El número fiscal se asigna al emitir, en orden del lote, dentro de la transacción; si ARCA rechaza se reenvía el mismo número; antes de reintentar se consulta el último autorizado. El cierre de contingencia exige conciliación completa.

**Alternativas consideradas.** (PA-CFG-P2-06) B: entregar siempre y autorizar en diferido, con comprobantes sin CAE. C: bloquear la venta hasta que ARCA responda.

**Consecuencias.** Estados "incierto" y circuit breaker por conexión fiscal; tablero de comprobantes pendientes de CAE.

#### ADR-040 — Certificado ARCA generado en la plataforma

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-053, vigente) |
| Origen | DEC-053; PA-FIS-03; RF-INT-024 a RF-INT-027; RN-INT-020; RNF-NFR-071 |

**Contexto.** ProCoop guarda el PFX del certificado ARCA sin contraseña en una carpeta.

**Decisión.** La plataforma genera el par de claves (RSA 2048 o superior) y el CSR con los datos del tenant; la clave privada nunca sale de la bóveda. Se admite importar un PFX existente. Varios certificados por conexión para renovar sin corte; alertas de vencimiento escalonadas; certificado vencido o rechazado bloquea la conexión y pausa la cola.

**Alternativas consideradas.** (PA-FIS-03) B: solo carga de PFX, con la clave pasando por equipos del usuario. C: solo generación en plataforma, que obliga a renovar certificados vigentes.

**Consecuencias.** La importación de PFX es el camino de menor seguridad y debe auditarse y rotarse en la primera renovación.

#### ADR-041 — Credenciales de proveedor de plataforma o propias del tenant

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-020 y DEC-077, vigentes) |
| Origen | DEC-020 (PA-CFG-P1-03); DEC-077 (PA-COM-04); DEC-065; RF-INT-012, RF-INT-013; RF-PLA-029; RNF-NFR-250, RNF-NFR-251 |

**Contexto.** Mapas, IA y mensajería pueden contratarse por la plataforma y revenderse, o por cada cooperativa.

**Decisión.** La plataforma provee claves de mapas e IA, con opción de clave propia del tenant en la bóveda. La mensajería admite conector propio del tenant o proveedor de plataforma revendido con consumo medido como complemento del pack. El consumo se atribuye por tenant y tiene tope mensual.

**Alternativas consideradas.** (PA-CFG-P1-03) B: cada tenant carga su clave. C: solo plataforma. (PA-COM-04) B: solo proveedor de plataforma. C: solo conector propio.

**Consecuencias.** Las conexiones de `PLATFORM` compartidas deben aislar contexto y caché por tenant (RF-PLA-029); al alcanzar el tope la IA se degrada a "sin IA".

#### ADR-042 — Proveedores iniciales detrás de adaptadores canónicos

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-015, DEC-046 y DEC-055, vigentes; PA-INT-06 asumida) |
| Origen | DEC-015 (PA-CFG-P3-05); DEC-046 (PA-PER-13); DEC-055 (PA-CRM-06); PA-INT-06; DT-05 y DT-06 de `02-arquitectura-c4.md` |

**Contexto.** Hay muchos proveedores posibles por categoría y el piloto necesita un conjunto acotado.

**Decisión.** Pasarelas Pagos360, Mercado Pago, SIRO y Red Link en O5 y el resto como extensión en O11; Georef para normalizar y geocodificar y Google Maps para mapa y autocompletado; WhatsApp con Meta Cloud API por defecto y adaptador para Trii; SMS con agregador local de plataforma e interfaz para otros. Todos detrás de contratos canónicos de T06.

**Alternativas consideradas.** (PA-CFG-P3-05) B: todas las pasarelas en O5. C: solo las de cada tenant migrado. (PA-CRM-06) B: solo Trii. C: solo Meta Cloud API.

**Consecuencias.** Cada proveedor es subencargado o tercero con ficha de datos intercambiados (RF-INT-082). Quedan inconsistencias menores de T01 §7.1 (Leaflet, Twilio) registradas como DT-05 y DT-06.

#### ADR-043 — Aprovisionamiento automático asíncrono con respaldo manual

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-041 y DEC-042, vigentes) |
| Origen | DEC-041 (PA-TEC-09); DEC-042; DEC-014; RN-INT-040, RN-INT-065 |

**Contexto.** El alta, el corte y la reconexión de Internet deben reflejarse en la red (MikroTik, RADIUS, SmartOLT) sin intervención manual sistemática.

**Decisión.** Aprovisionamiento automático y asíncrono vía conector con respaldo manual al agotar reintentos; MikroTik, RADIUS y SmartOLT en O3. Un intento de corte o reconexión no se repite sin verificar su estado.

**Alternativas consideradas.** (PA-TEC-09) B: solo manual con tarea para el NOC. C: automático sin respaldo manual.

**Consecuencias.** Credenciales de equipos de red en bóveda; comandos remotos solo por operaciones declaradas del conector.

### 2.8 Inteligencia artificial, documentos y canales

#### ADR-044 — La inteligencia artificial solo propone

| Campo | Valor |
|---|---|
| Estado | Aceptada (ARQ-08; DEC-056 vigente) |
| Origen | Maestra §5.3 ARQ-08; DEC-056; DEC-008; PA-INT-08; PA-NFR-09; RN-NFR-010 a RN-NFR-012; RF-IAM-150 a RF-IAM-153; RF-INT-086; RF-PLA-029; RNF-NFR-098; CTR-NFR-18 |

**Contexto.** La IA se usa en alta de tenants, moderación del muro, atención y BI; Connectia la invoca por HTTP directo y ProCoop tiene una clave de proveedor en código.

**Decisión.** La IA solo propone; toda acción con efecto requiere confirmación humana y auditoría. Actúa con los permisos del usuario que la invoca. Proveedor como conector multiproveedor con registro de uso; datos personales minimizados y redactados, nunca datos de salud; contenido de mensajes y adjuntos tratado como datos, no instrucciones; salidas validadas por esquema; funciones habilitables por tenant y apagadas hasta su aceptación.

**Alternativas consideradas.** IA por HTTP directo con proveedor automático (Connectia §2.1): reemplazada (CTR-NFR-18).

**Consecuencias.** Batería adversarial de inyección de instrucciones en CI (RA-12); `auditAi` por cada uso.

#### ADR-045 — Motor de PDF con Chromium sin interfaz en workers dedicados

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-080, vigente) |
| Origen | DEC-080; PA-WFL-05; RNF-NFR-012, RNF-NFR-199, RNF-NFR-230; DT-10 de `02-arquitectura-c4.md` |

**Contexto.** Se necesitan PDF/A con fuentes embebidas, código de barras y QR fiscal, plantillas editables por el tenant y lotes de 50.000 documentos en ≤ 60 min.

**Decisión.** HTML + CSS renderizado con Chromium sin interfaz en workers dedicados, con validación PDF/A posterior; hash SHA-256 de cada documento emitido.

**Alternativas consideradas.** (PA-WFL-05) B: biblioteca de composición programática, más rápida y sin plantilla editable. C: servicio externo de render, con costo por documento y datos personales fuera. Interop con Office (ProCoop, RN-INT-059): descartada.

**Consecuencias.** Imagen, cola y dimensionamiento de los workers de PDF no están declarados en T01 (DT-10). El aislamiento del navegador sin interfaz no está especificado (ver `28-modelo-amenazas-seguridad.md`).

#### ADR-046 — Interfaz de firma propia con OTP y firma digital licenciada

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-078, vigente; proveedor a elegir antes de O3) |
| Origen | DEC-078; PA-INT-22; PA-WFL-06; RNF-NFR-230 |

**Contexto.** Conformidades de instalación, convenios y trámites requieren firma del socio; recibos de sueldo y actas requieren firma digital.

**Decisión.** Interfaz de firma propia; firma electrónica con OTP por defecto; firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9). El proveedor se elige antes de O3.

**Alternativas consideradas.** (PA-WFL-06) B: firma digital en todo desde O1. C: solo firma electrónica interna sin proveedor.

**Consecuencias.** El proveedor de firma digital es un subencargado aún no definido (RA-08).

#### ADR-047 — PWA única con cola offline idempotente

| Campo | Valor |
|---|---|
| Estado | Aceptada con validación pendiente (PA-NFR-14 asumida) |
| Origen | Maestra §8; RF-PLA-150; RNF-NFR-017, RNF-NFR-186 a RNF-NFR-191, RNF-NFR-219; PA-NFR-14; CTR-NFR-10 |

**Contexto.** Técnicos, lecturistas y cobradores trabajan sin conexión hasta 7 días; Connectia usa colas por dominio en `localStorage`.

**Decisión.** Una sola PWA con experiencia por rol (socio, empleado, campo) y un motor único de cola offline en IndexedDB con `clientMutationId` (UUIDv7) por mutación y envío por lotes idempotente. Solo se descargan los datos de tareas asignadas con vencimiento ≤ 7 días; borrado al cerrar o revocar sesión; evidencias sensibles cifradas con clave WebCrypto no exportable; sin tokens de larga duración en IndexedDB. Login, cobros, anulaciones y configuración nunca se encolan offline. `/api` con estrategia NetworkOnly.

**Alternativas consideradas.** Colas por dominio en `localStorage` (Connectia §3.7): reemplazadas (CTR-NFR-10).

**Consecuencias.** Conflictos de sincronización derivados a una bandeja; actualización automática sin perder la cola.

#### ADR-048 — Agente local propio con canal saliente

| Campo | Valor |
|---|---|
| Estado | Aceptada (asumida, DEC-072) |
| Origen | PA-INT-09; DEC-007; RF-INT-084; RF-IAM-049; RNF-NFR-258; T06 §7.15; RN-INT-058 |

**Contexto.** Impresoras térmicas y fiscales, turnero, balanzas, lectores y colectores requieren software en el puesto. ProCoop usa un agente vigilado por otro proceso que se autoactualiza desde un bucket del proveedor.

**Decisión.** Agente propio GoodApps (O10), multiplataforma, emparejado por código de un solo uso, con identidad de dispositivo, canal saliente WebSocket TLS sin puertos entrantes, comandos firmados con expiración de una lista declarada, cola local cifrada, latido cada 60 s y actualizaciones firmadas y verificadas. Nunca almacena datos de tarjeta ni credenciales de base.

**Alternativas consideradas.** (PA-INT-09) B: solo impresión desde el navegador, sin turnero ni periféricos. C: software de terceros por dispositivo, heterogéneo. Autoactualización desde bucket del proveedor (ProCoop): descartada (RN-INT-058).

**Consecuencias.** Requiere emisión y revocación de credenciales por dispositivo; la tecnología de implementación del agente está a definir.

### 2.9 Privacidad, operación y entrega

#### ADR-049 — Encargado de tratamiento: exportación, purga y libro de supresiones

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-076, vigente) |
| Origen | DEC-076; PA-NFR-07; RNF-NFR-045, RNF-NFR-107, RNF-NFR-108; RF-PLA-156 a RF-PLA-160; RF-NFR-006 a RF-NFR-013; T05 §7.1.1 y §7.1.13 |

**Contexto.** La cooperativa es responsable de los datos de sus socios; la plataforma los trata por su cuenta y debe poder devolverlos o destruirlos.

**Decisión.** GoodApps actúa como prestador de servicios de tratamiento (art. 25 Ley 25.326): contrato tipo de encargo, registro público de subencargados, exportación completa del tenant en formatos abiertos y destrucción en ≤ 30 días desde la aceptación de la exportación (o conservación cifrada hasta 2 años si la cooperativa lo autoriza), con constancia. Las supresiones se registran en `erasureLedger`, en una base separada excluida de las restauraciones, y se reaplican antes de habilitar el acceso tras restaurar.

**Alternativas consideradas.** (PA-NFR-07) B: corresponsable del tratamiento. C: definir caso por caso.

**Consecuencias.** La plataforma no decide finalidades; los derechos de los titulares se gestionan en nombre del tenant (bandeja de solicitudes, informe de acceso).

#### ADR-050 — Observabilidad con OpenTelemetry y correlación extremo a extremo

| Campo | Valor |
|---|---|
| Estado | Aceptada (backend de observabilidad a definir) |
| Origen | RNF-NFR-119 a RNF-NFR-139; RF-PLA-136 a RF-PLA-145; RN-NFR-021; CTR-NFR-14 |

**Contexto.** ProCoop envía excepciones por correo y guarda logs en archivos locales; en SaaS hay que seguir una operación desde el clic hasta ARCA sin exponer datos personales.

**Decisión.** Logs JSON en una línea (pino) con `tenantId`, `requestId`, `traceId`, redacción automática de secretos y datos personales; métricas RED/USE con control de cardinalidad; trazas OpenTelemetry con W3C Trace Context desde el front hasta outbox, jobs y conectores; alertas por presupuesto de error y de seguridad; proveedores de observabilidad como subencargados que solo reciben datos redactados.

**Alternativas consideradas.** Envío de excepciones por correo (ProCoop): descartado (CTR-NFR-14, RN-NFR-021).

**Consecuencias.** El backend (Prometheus/Grafana o CloudWatch) queda a definir; endpoints de salud con convención aún no unificada (DT-02).

#### ADR-051 — Entrega continua con imágenes firmadas y migraciones expandir/contraer

| Campo | Valor |
|---|---|
| Estado | Aceptada |
| Origen | RNF-NFR-164 a RNF-NFR-169, RNF-NFR-236; RF-PLA-146 a RF-PLA-149; RN-NFR-022, RN-NFR-023; T01 §7.10 |

**Contexto.** ProCoop se actualiza descargando binarios y ejecuta chequeos de estructura al primer login.

**Decisión.** Pipeline por PR con lint, chequeos de estructura, fronteras e índices, pruebas unitarias e integración con Mongo y Redis reales, aislamiento, permisos negativos, contrato, SAST, SCA, secretos, SBOM y escaneo de imágenes. Imágenes firmadas y verificadas por política de admisión; despliegue rolling o blue-green por anillos con rollback ≤ 15 min; migraciones versionadas e idempotentes como paso del despliegue con patrón expandir/contraer; feature flags por tenant. Plataforma de CI de referencia: GitHub Actions.

**Alternativas consideradas.** Descarga de binarios en tiempo de ejecución (ProCoop `Version.gzip`): descartada (RN-NFR-023). Migraciones al primer login: descartadas (RN-NFR-022).

**Consecuencias.** Congelamiento de despliegues en días críticos del tenant (RNF-NFR-034); dos revisiones obligatorias en código de tenancy, autorización, bóveda, pagos, fiscal e IaC (RNF-NFR-166).

#### ADR-052 — Ambientes separados y datos ficticios fuera de producción

| Campo | Valor |
|---|---|
| Estado | Aceptada (PA-PLA-07 asumida) |
| Origen | RF-PLA-109, RF-PLA-110; RN-NFR-014, RN-NFR-015; RNF-NFR-099, RNF-NFR-160, RNF-NFR-161, RNF-NFR-170; RF-INT-030; PA-PLA-07; DT-03 de `02-arquitectura-c4.md` |

**Contexto.** ProCoop y Connectia tienen usuarios demo con clave conocida y bases DEMO; los ensayos con datos reales exponen a los socios.

**Decisión.** Siete ambientes (`local`, `ci`, `dev`, `staging`, `sandbox`, `demo`, `prod`) con datos, secretos, dominios y credenciales propios; cuentas de nube separadas para producción sin rutas de red con no producción. Datos de no producción ficticios (juego canónico TEN-001 y TEN-002); la precarga de demostración se niega a ejecutar en producción; desde no producción no se emiten comprobantes reales, no se cobra ni se envían mensajes reales.

**Alternativas consideradas.** (PA-PLA-07) Copia anonimizada en sandbox solo con aprobación del administrador y de seguridad, como excepción.

**Consecuencias.** El tratamiento de copias reales para ensayos de migración requiere precisión (ver OBS-ADR-07).

### 2.10 Migración y transición

#### ADR-053 — Migración con extracción de solo lectura, snapshots e histórico acotado

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-070 y DEC-087, vigentes) |
| Origen | DEC-070 (PA-MIG-01); DEC-087 (PA-DAT-02); RF-MIG-010, RF-MIG-011, RF-MIG-060, RF-MIG-062, RF-MIG-090, RF-MIG-095 a RF-MIG-097; RN-MIG-013; PA-MIG-07; T05 §7.1.11 |

**Contexto.** ProCoop tiene 659 tablas, adjuntos y una base del portal; la migración debe ser repetible, trazable y no alterar el origen.

**Decisión.** Extracción con usuario de solo lectura, sin bloqueos, como snapshot inmutable cifrado en almacenamiento privado con manifiesto y hash. Ejercicio en curso + 24 meses en estructuras tipadas; el resto en `legacyRecords`; copia del origen conservada 10 años con acceso restringido y auditado. Subdocumento `legacy` en todo documento migrado. Detalle histórico de más de 36 meses archivado con consulta diferida; facturas, recibos y asientos siempre en línea. Credenciales y contraseñas nunca se migran; los usuarios reciben invitación de activación. Perfiles de anonimización para ensayos.

**Alternativas consideradas.** (PA-MIG-01) B: todo tipado. C: solo saldos vivos y archivo. (PA-DAT-02) B: todo en línea 10 años. C: en línea 24 meses.

**Consecuencias.** Doble modelo de consulta (tipado y `legacyRecords`); custodia de un snapshot con datos personales durante 10 años.

#### ADR-054 — Convivencia con ProCoop y corte por etapas

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-068, DEC-069, DEC-088 y DEC-089, vigentes) |
| Origen | DEC-068 (PA-MIG-04); DEC-069; DEC-088; DEC-089; RA-10 de `02-arquitectura-c4.md` |

**Contexto.** La cooperativa piloto Laguna Larga (`LAG`) opera electricidad (con prepago) y gas por redes; un corte único concentra el riesgo.

**Decisión.** Corte comercial (M01 a M09) primero, por servicio: electricidad, gas por redes y prepago de LAG después del cierre de O7, cuando el paralelo apruebe los ciclos consecutivos; contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo en O11. Durante la convivencia GoodApps contabiliza en un plan marcado no oficial y concilia contra ProCoop. De `PR_LAG_DEMO` solo se toma configuración, nunca datos personales.

**Alternativas consideradas.** (PA-MIG-04) B: corte único total. C: corte por servicio con convivencia larga (adoptada parcialmente por DEC-089 para el corte comercial).

**Consecuencias.** Doble fuente de verdad contable temporal (RA-10); interfaces de intercambio con ProCoop durante la convivencia.

#### ADR-055 — Identificador de pago autocontenido durante la transición

| Campo | Valor |
|---|---|
| Estado | Aceptada (DEC-050, vigente) |
| Origen | DEC-050 (PA-COB-09); T07; M07 |

**Contexto.** Al migrar, circulan facturas de ProCoop con códigos de pago publicados en redes de cobranza.

**Decisión.** GoodApps usa un identificador de pago nuevo y autocontenido y resuelve además la clave ProCoop hasta que vencen sus facturas.

**Alternativas consideradas.** Las opciones de PA-COB-09 no están detalladas en las fuentes leídas *(se recomienda completarlas al pasar este ADR al repositorio)*.

**Consecuencias.** Tabla de alias de claves heredadas (`legacyKeyAliases`) con vencimiento; imputación con doble resolución durante el período de transición.

---

## 3. Decisiones no incluidas como ADR

Las siguientes DEC son reglas de negocio u organización del entregable y no constituyen decisiones de arquitectura; su efecto técnico, cuando existe, queda cubierto por los ADR citados.

| DEC | Tema | Motivo de exclusión |
|---|---|---|
| DEC-005, DEC-006, DEC-007, DEC-010 | Piloto Internet, olas sin fechas, alcance total, formato del entregable | Planificación y alcance. DEC-007 se refleja en ADR-048. |
| DEC-008, DEC-009 | Muro editorial; contabilidad temprana | Producto y planificación funcional. La moderación con IA se rige por ADR-044. |
| DEC-011 a DEC-014, DEC-016, DEC-017, DEC-019, DEC-021 a DEC-024, DEC-027 a DEC-034, DEC-036, DEC-037, DEC-039, DEC-040, DEC-043 a DEC-045, DEC-048, DEC-049, DEC-051, DEC-052, DEC-054, DEC-057 a DEC-061, DEC-071, DEC-082 a DEC-086 | Reglas de catálogo, facturación, cobranza, mora, técnica, personas, fiscal, institucional y servicios | Reglas de negocio funcionales. DEC-014 y DEC-043 se citan en ADR-043 y ADR-027. |
| DEC-047, DEC-072, DEC-073 | Política de preguntas; asunción de recomendadas; fichas verticales | Gobierno de la especificación. DEC-072 define el estado "asumida". |
| DEC-065 | Modelo comercial del SaaS | Comercial; su efecto técnico (tenant `PLATFORM` y cupos) está en ADR-011 y ADR-041. |
| DEC-081 | Cooperativa piloto no definida | Reemplazada por DEC-088 (ADR-054). |

---

## 4. Observaciones e inconsistencias detectadas

Diferencias encontradas al elaborar este registro. No se corrige la especificación; se registran para su resolución por el responsable de cada anexo. Las inconsistencias DT-01 a DT-10 de `02-arquitectura-c4.md` §11.2 siguen vigentes y no se repiten.

| ID | Tema | Observación | ADR afectado |
|---|---|---|---|
| OBS-ADR-01 | Ubicación de los ADR | RNF-NFR-243 exige un ADR por archivo en `docs/adr/NNNN-titulo.md` para **cada** DEC (incluidas DEC-001 a DEC-010) y cada CTR técnica. Este registro filtra las DEC no técnicas (sección 3) y es un documento derivado; la especificación no aclara si las DEC de negocio también requieren ADR. | Todos |
| OBS-ADR-02 | Categorías de clave de datos | T08 RNF-NFR-056 y `02-arquitectura-c4.md` §8.4 definen claves de datos por categoría `salud`, `financiero` y `secreto`; T05 §7.1.12 usa `dek-salud`, `dek-laboral`, `dek-judicial` y `dek-financiero` y deja los secretos solo en la bóveda. | ADR-033 |
| OBS-ADR-03 | Lista blanca de colecciones globales | RF-PLA-023 (T01) lista `tenants`, `moduleCatalog`, `platformPlans`, `releases`, `featureFlags`, `backupPolicies`, `alertRules` y `schemaMigrations`; T05 §7.1.3 agrega `identities`, `federatedLinks`, `outboxEvents` y `jobRuns` del despachador y `erasureLedger`, y no menciona `platformPlans`, `releases`, `featureFlags`, `backupPolicies` ni `alertRules`. | ADR-011, ADR-025 |
| OBS-ADR-04 | Transacciones entre módulos | ARQ-PLA-03 (T01) permite comandos síncronos de otro módulo "en la misma transacción si el llamador pasa `session`"; T05 §7.1.15 dice que "las transacciones no cruzan módulos" y que la coordinación es por eventos o por `operations` de T11. | ADR-002, ADR-019 |
| OBS-ADR-05 | Colecciones técnicas duplicadas | CTR-NFR-22 registra que T08 §15.1 define `idempotencyKeys`, `processedEvents`, `auditEvents` y otras colecciones que T01 y T02 definen con otro nombre (`inboxReceipts`, `auditLogs`); la conciliación remite a T05 sin que el nombre canónico de la colección de claves de idempotencia quede explícito en las fuentes leídas. | ADR-018 |
| OBS-ADR-06 | Aprobación del acceso de emergencia | RF-PLA-105 exige doble aprobación de plataforma (Soporte N2 + Seguridad); PA-IAM-06 admite emergencia "por P-SUP con aviso inmediato y revisión posterior"; RNF-NFR-237 pide "aprobación de un segundo operador" con vigencia ≤ 4 h. No queda claro si son el mismo circuito ni qué rol aprueba. | ADR-030 |
| OBS-ADR-07 | Datos reales en ensayos de migración | RN-NFR-014 prohíbe copiar datos reales a ambientes no productivos; PA-NFR-19 (asumida) admite copia real "en un ambiente aislado de migración" y RF-MIG-096 admite snapshots no anonimizados en "el tenant de ensayo de la propia cooperativa". Ese ambiente no figura entre los siete de RF-PLA-109. | ADR-052, ADR-053 |
| OBS-ADR-08 | Credenciales de ProCoop | RF-INT-023 considera comprometidas las credenciales heredadas y exige regenerarlas en cada proveedor; RN-MIG-013 dice que "se suprimen en la extracción y se reingresan en la bóveda", lo que admite reingresar el mismo valor. | ADR-032, ADR-053 |
| OBS-ADR-09 | Longitud mínima de contraseña | RF-IAM-040 fija mínimo 12 para staff y 10 para socios; RNF-NFR-061 fija mínimo 12 (8 con MFA obligatoria) sin distinguir socios. | ADR-026, ADR-027 |
| OBS-ADR-10 | Herramientas de prueba | La maestra §5.1 indica "Vitest/Jest, Supertest"; T08 RNF-NFR-141 indica `node --test` con c8 para el backend (ampliación de DT-07). | ADR-051 |
| OBS-ADR-11 | Alternativas de PA-COB-09 | Las fuentes leídas no registran las opciones evaluadas para el identificador de pago en la migración (DEC-050). | ADR-055 |

---

## 5. Referencias

| Documento | Secciones usadas |
|---|---|
| `docs/especificacion/01-registro-decisiones.md` | DEC-001 a DEC-089 |
| `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` | §3 decisiones rectoras; §5 arquitectura y stack (ARQ-01 a ARQ-08); §6 multitenancy; §7 permisos; §13 convenciones; §14 RNF |
| `docs/especificacion/02-preguntas-abiertas.md` y anexos | Opciones de PA-PLA-01, PA-PLA-02, PA-PLA-05, PA-PLA-07, PA-PLA-08, PA-PLA-14, PA-IAM-01, PA-IAM-02, PA-IAM-06, PA-IAM-13, PA-INT-02, PA-INT-06, PA-INT-09, PA-NFR-03, PA-NFR-07, PA-NFR-14, PA-NFR-19, PA-BIA-01, PA-WFL-04, PA-WFL-05, PA-WFL-06, PA-CRM-06, PA-MIG-01, PA-MIG-04, PA-DAT-01, PA-DAT-02, PA-TEC-09, PA-CFG-P1-03, PA-CFG-P2-06, PA-CFG-P3-05, PA-COM-04, PA-FIS-03 |
| `anexos/T01-PLA-plataforma-saas.md` | RF-PLA-001 a RF-PLA-165; RNF-PLA-001 a RNF-PLA-015; ARQ-PLA-01 a ARQ-PLA-12; §7.1, §7.6, §7.10 |
| `anexos/T02-IAM-identidad-roles-auditoria.md` | RF-IAM-001 a RF-IAM-153; §7.17 |
| `anexos/T05-DAT-modelo-datos.md` | RN-DAT-001 a RN-DAT-012; §7.1.1 a §7.1.15 |
| `anexos/T06-INT-integraciones.md` | RF-INT-001 a RF-INT-086; RN-INT-005 a RN-INT-065; §7.3, §7.15 |
| `anexos/T07-MIG-migracion-procoop.md` | RF-MIG-010, RF-MIG-011, RF-MIG-060, RF-MIG-062, RF-MIG-090, RF-MIG-095 a RF-MIG-097; RN-MIG-013 |
| `anexos/T08-NFR-no-funcionales-seguridad.md` | RN-NFR-001 a RN-NFR-027; RNF-NFR-001 a RNF-NFR-259; RF-NFR-001 a RF-NFR-025; CTR-NFR-01 a CTR-NFR-23 |
| `docs/entregables-analisis-diseno/02-arquitectura-c4.md` | §1.3, §2, §4, §6 a §11 |
| `docs/entregables-analisis-diseno/28-modelo-amenazas-seguridad.md` | Modelo de amenazas que aplica los controles de estos ADR |
