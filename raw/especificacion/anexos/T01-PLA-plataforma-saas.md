# T01 PLA — Plataforma SaaS: arquitectura de referencia, stack, multitenancy, tenants, licencias, soporte, ambientes y backups

| Campo | Valor |
|---|---|
| Versión | 1.0 (lógico); alineación destino **1.1-impacto** 19-11-2026 (§7.0) |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | **Plataforma** (solución 4), y núcleo compartido por ERP / CRM / Landing-autogestión / Cobranza / Pasarelas / Impuestos / APIs |
| Olas | **O0** (fundaciones técnicas: monorepo, CI, packages, multitenancy EF, outbox + **Azure Queue**, Blob privado, observabilidad base) y **O1** (plataforma SaaS completa: tenants y ciclo de vida, licencias, catálogo de módulos, alta asistida, contrato SaaS, dashboards y alertas de plataforma, soporte con acceso temporal, sandbox, backups y restauración por tenant, actualizaciones). Extensiones puntuales en O4/O5 (ganchos de conciliación posrestauración para emisión fiscal y pagos; facturación del SaaS), O10 (agente local, vía T06) y O11 (medición de APIs de terceros). |
| Dueño de datos | `tenants`, `moduleCatalog`, `platformPlans`, `tenantLicenses`, `tenantModuleActivations`, `tenantChecklists`, `onboardingDrafts`, `saasContracts`, `usageSnapshots`, `supportCases`, `supportCaseMessages`, `supportAccessGrants` (dueño T02, CTR-DAT-02; T01 lo consume), `supportSessions`, `platformIncidents`, `alertRules`, `alerts`, `backupPolicies`, `backupRuns`, `restoreRequests`, `restoreTests`, `tenantExports`, `releases`, `featureFlags`, `outboxEvents`, `inboxReceipts`, `deadLetters`, `jobRuns`, `idempotencyKeys`, `storedFiles`, `aiUsage`, `healthSnapshots`, `schemaMigrations` (§7.11.28; T05 COL-PLA-32) |
| Fuentes consolidadas | BASE: Advertencia de arquitectura, Propósito y alcance, §1, §2 (Organización; Estructura multitenant; Marca y landing; Facturación por servicio; Autogestión y ERP; Servicios habilitables; Configuración independiente; Titularidad; Espacios de trabajo), §35, §42 (42.1–42.9), §54 (lado plataforma), §58 (ARQ-001), §64 (64.1–64.7), §66 (lado plataforma), §97.8, §97.9, §97.10 (lado plataforma), §97.11, §97.12, §99 (99.1–99.4, lo de plataforma/SaaS), §102.5 (102.5.1–102.5.6), §102.7, §102.8, §105, §106. AGR: AGR-001, AGR-002, AGR-004, AGR-005, AGR-016, AGR-019, AGR-020, AGR-034, AGR-035, AGR-036; §5 (5.1–5.6), §7, §8, §10 [R2]. CNX: §1, §2 (2.1–2.8), §3.2, §4.3, §4.6, §9, §10, §11. DFA: Módulo 1 (lo de plataforma), §33. RN-09: §3, §4 (4.1–4.3, solo lo de plataforma), §5 (5.1–5.8), §7 (1–10), §8 (1–8). FIC: §22. CAT: §28, §29. INV: `ProcoopNet.md` (frmLogin, Program, Inicio_ProCoop, frmConfiguraciones, frmSelectConfiguracion, frmMigrarTabla, IconoNotificacion, frmEncuestas, frmInformes, frmTransicion), `Configuracion.md` (frmProcesos, frmSoporteIP, frmAuditoriaLogin, frmChequearVersion, frmActualizar, frmOpcionesEspeciales, frmBaseDatos, frmRecuperaConfiguracion, abm_TareasProgramadas*, frmLoNuevo, frmAdjuntoProcoopar, frmComparadorCambios, abm_Equipos, frmAutorizaciones, abm_Users, abm_Perfiles, frmVariables, frmVariables_PMovil, frmProgressBar_WithLog, frmProcesoAutomatico). |

> **Norma de implementación (DEC-111, DEC-112, DEC-110).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId`), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md`. Checklist: `06-impacto-adaptacion-stack-goodapps.md`.
>
> **Límites con otros anexos.** Identidad, autenticación, roles, perfiles, alcance y auditoría genérica → **T02 IAM**. Design system, marca, diccionario, layouts y mapa del sitio → **T03 UXD**. Configuración versionada, registro de parámetros, tablas maestras, entidades jurídicas, sucursales, puestos y geografía → **T04 CFG** (DEC-064); los puntos de venta fiscales son de **M06 FIS**. Modelo de datos canónico → **T05 DAT**. Marco de integraciones, bóveda de credenciales, conectores, agente local → **T06 INT**. Migración desde ProCoop → **T07 MIG**. No funcionales detallados, seguridad, privacidad y pruebas → **T08 NFR** (aquí solo los propios de plataforma: backups, capacidad, ambientes, operación). Workflow, eventos de negocio y expediente documental → **T11 WFL**.

---

## 1. Objetivo

Definir, de forma desarrollable sin consultar otra fuente, la **plataforma SaaS multitenant** sobre la que corre CoopApps:

1. La **arquitectura de referencia y el stack** (**DEC-111, DEC-112, DEC-110**; funcional **DEC-003**): **monolito modular** .NET 10 + ASP.NET Core + EF Core + **Azure SQL** compartido, front **React 19**, módulos de dominio con fronteras estrictas, **outbox transaccional**, **workers** sobre **Azure Queue Storage**, **Azure Blob** privado, despliegue en **Microsoft Azure** (Container Apps). Patrones de Connectia/CNX aplican a producto y permisos, no al motor de persistencia del 04-11.
2. El **multitenancy en base única** con `tenantId` obligatorio y su aislamiento extremo a extremo: consultas, índices, jobs, archivos, caché, exportaciones, búsquedas, IA y logs; y el **tenant especial `PLATFORM`**.
3. El **ciclo de vida de la cooperativa como tenant** (Preparación, Prueba, Listo para habilitar, Operativo, Suspendido administrativo, Cierre/salida — AGR-004), con **checklists de habilitación por capacidad**, y el **alta asistida** con IA que propone logo, colores y textos (patrón Connectia).
4. El **licenciamiento en tres capas** (licencia de módulos de plataforma, activación, pantallas), el **catálogo de módulos vendibles** (`moduleCatalog`) y el **contrato comercial SaaS** con cupos y medición de uso (AGR-005, BASE §97.11).
5. Los **dashboards y alertas de plataforma** (BASE §54, lado plataforma), el **soporte con acceso temporal auditado** (AGR-034), los **ambientes y la prueba de configuración por tenant** (BASE §97.9, AGR-035), los **backups y la restauración por tenant** (AGR-019), la **capacidad y el aislamiento de carga** (AGR-020), la **operación** (monitoreo, logs, salud de jobs) y las **actualizaciones sin intervención del usuario**, que reemplazan el modelo de instalación local de ProCoop.
6. El **posicionamiento competitivo SaaS** (BASE §64, §99) y la materialización del **mapa de soluciones** (BASE §105) en módulos del monolito.

### 1.1. Resultado esperado

Dos o más cooperativas operan en la misma plataforma sin instalar nada ni administrar servidores; cada una con su marca, sus módulos contratados y activados, sus datos aislados, su ambiente de prueba, copias recuperables por tenant y un canal de soporte trazable; la plataforma se actualiza sin que ningún usuario ejecute instaladores ni chequeos de estructura.

### 1.2. Posicionamiento competitivo que este anexo materializa (BASE §64, §99)

| Aspecto (BASE §64.3) | Debilidad señalada sobre ProCoop | Respuesta de plataforma en CoopApps | Requisitos |
|---|---|---|---|
| Despliegue | Instalación local en máquinas de la cooperativa (`Procoop.exe`, `.pro`, DLLs en `Librerias\`). | Servicio administrado en la nube; navegador/PWA; nada que instalar del núcleo de gestión. | RF-PLA-001, RF-PLA-146 a RF-PLA-155 |
| Infraestructura | Servidores SQL propios, backups hechos por el usuario, Agente Windows vigilado. | Infraestructura y operación son responsabilidad de la plataforma: backups, monitoreo, colas y actualizaciones. | RF-PLA-117 a RF-PLA-145 |
| Integración | APIs ausentes o insuficientes. | APIs tokenizadas por tenant (detalle en T10), límites por tenant y medición de uso. | RF-PLA-129, RF-PLA-083 |
| Canal del socio | App inexistente o limitada en ciertas experiencias (ProCoop publica CoopOnline y P-Móvil: no se afirma inexistencia). | PWA por tenant con branding runtime y manifest dinámico (T03, M19); la plataforma la habilita por licencia. | RF-PLA-063 a RF-PLA-075 |
| Identidad visual | Personalización insuficiente. | Alta asistida con IA que propone logo/colores; marca y diccionario por tenant (T03). | RF-PLA-056 a RF-PLA-062 |
| Seguridad | Fallas percibidas; en el código: contraseñas reversibles, contraseñas maestras, credenciales en archivo local (RN-09 §4.1, §5.3). | Aislamiento verificable, secretos en gestor, auditoría, soporte sin compartir contraseñas, deudas CNX §10 corregidas. | RF-PLA-016 a RF-PLA-035, RNF-PLA-001 a RNF-PLA-012 |
| Soporte | Ineficiencias de atención (TeamViewer, webchat, `frmSoporteIP`). | Casos de soporte con número, responsable, estado, evidencias, SLA a acordar y acceso temporal auditado. | RF-PLA-096 a RF-PLA-108 |

Diferenciales que ningún proveedor relevado publica con este detalle (BASE §99.4) y que dependen de la plataforma: SaaS multitenant con marca y diccionario por cooperativa; APIs tokenizadas para BI; doble factor e ingreso con Google (T02); copia de configuración de servicios entre cooperativas (T04/M02, usando el aislamiento de este anexo); simulaciones separadas de producción (sandbox, §7.10). Funciones de mercado con impacto en plataforma: **elección de dónde residen los datos y portabilidad** (GestBit; MER-020) → RF-PLA-156 a RF-PLA-160 y PA-PLA-01; **planes comerciales por tamaño de cooperativa** (GestarCoop; BASE §97.11) → RF-PLA-076 y PA-PLA-09; **ERP instalado o en la nube** (GestBit) → CoopApps es solo nube (SaaS-001, SaaS-003). Los compromisos se expresan como capacidades verificables, no como promesas de ausencia total de fallas (BASE §64.7).

---

## 2. Límite y responsabilidades

### 2.1. Qué hace PLA

- Define y sostiene la **arquitectura técnica común** (monorepo, monolito modular, fronteras, packages, eventos, jobs, almacenamiento, Docker, entornos, CI/CD) que todos los anexos usan.
- Implementa el **mecanismo de multitenancy** (contexto de tenant, plugin Mongoose, índices, aislamiento en jobs/archivos/caché/exportaciones/búsquedas/IA/logs) y lo verifica con pruebas automáticas.
- Administra **tenants** y su **ciclo de vida**; ejecuta los **checklists de habilitación**; registra el **alta asistida**.
- Administra el **catálogo de módulos vendibles**, los **planes/packs**, las **licencias** por tenant y la **activación** de módulos (capas 1 y 2 del licenciamiento).
- Registra el **contrato comercial SaaS**, los **cupos** y la **medición de uso**; separa la facturación de la plataforma de la facturación que la cooperativa hace a sus socios (BASE §97.11).
- Provee **dashboards y alertas de plataforma** y el **motor genérico de alertas** que otros módulos usan para sus reglas de tenant.
- Gestiona **soporte de plataforma** (casos, incidentes generales) y **accesos temporales de soporte** a un tenant.
- Gestiona **ambientes**, **sandbox por cooperativa**, **releases**, **feature flags** y **anillos de actualización**.
- Gestiona **políticas de backup**, ejecuciones, **ensayos de restauración** y **restauraciones por tenant** con conciliación posterior.
- Gestiona **capacidad y aislamiento de carga** (colas por clase, límites por tenant, rate limiting, prioridades).
- Opera la **observabilidad** (logs estructurados, métricas, trazas, salud de jobs y outbox, bandeja técnica de fallos).
- Gestiona la **salida del tenant** (exportación completa, período de solo lectura, archivo y purga).

### 2.2. Qué NO hace PLA

- No autentica ni autoriza usuarios, ni define roles/perfiles/alcance, ni guarda la auditoría genérica: lo hace **T02 IAM** (PLA aporta la **capa 1 y 2** del licenciamiento; T02 aporta la **capa 3 pantallas** y el alcance).
- No define colores, tipografías, componentes, diccionario ni manifest de la PWA: **T03 UXD** (PLA solo dispara la propuesta de IA en el alta y entrega el resultado a T03).
- No define el registro de parámetros ni la publicación de configuración versionada: **T04 CFG** (PLA declara sus `PRM-PLA-*` en ese registro y usa los paquetes de configuración de T04 para sincronizar el sandbox).
- No guarda credenciales de integraciones ni opera conectores: **T06 INT** (PLA solo lee metadatos no secretos, como vencimiento de certificados, para alertas).
- No migra datos de ProCoop: **T07 MIG** (PLA solo exige su aprobación de saldos en el checklist).
- No es el CRM de la cooperativa: los reclamos de socios son de **M09 CRM**; el soporte de plataforma es otro expediente (BASE §64.5).
- No decide sobre contratos de servicio de socios: suspender un tenant **no** da de baja servicios ni contratos (AGR-004).

### 2.3. Delegaciones

| Necesidad | Delegada a | Interfaz |
|---|---|---|
| Usuario administrador inicial del tenant, invitación, 2FA | T02 IAM | `iam.services.inviteTenantAdmin()`; evento `iam.user.mfaEnabled` alimenta checklist |
| Rol de plataforma y capabilities `pla.*` | T02 IAM | catálogo de capabilities declarado en `modules/pla/manifest.js` |
| Auditoría de cada cambio de PLA | T02 IAM | plugin de auditoría de `apps/api/src/core/audit` + `auditLogs` de T02 (antes `auditEvents`, CTR-DAT-24) |
| Marca, colores, logos, diccionario resultantes del alta | T03 UXD | `uxd.services.applyBrandingProposal()` |
| Parámetros `PRM-PLA-*`, paquetes de configuración para sandbox | T04 CFG | registro de parámetros; `cfg.services.exportPackage()/importPackage()` |
| Estado de credenciales ARCA/pasarelas en checklist | T06 INT / M06 FIS / M07 COB | `checklistProvider` de cada módulo |
| Conciliación de operaciones externas posteriores a una restauración | T06 INT (`integrationOperations`; antes `externalOperations`), M05 FAC, M07 COB | `reconcileAfterRestore(tenantId, since)` expuesto por cada módulo |
| Saldos iniciales aprobados | T07 MIG | evento `mig.openingBalances.approved` |
| Reglas de tenant del motor de alertas y tableros del tenant | T10 BIA | API del motor de alertas de PLA |
| Bandeja de autorizaciones de dos pasos (restauración, break-glass) | T11 WFL | `wfl.services.requestApproval()` |
| Notificaciones (email, push, WhatsApp) de avisos de plataforma | T09 COM | `com.services.notify()` |
| Catálogo de servicios del tenant (Agua, Internet…) y contrato de cada socio | M02 CAT / M01 PER | PLA solo licencia la **capacidad** del servicio vertical (BASE §66: tres niveles) |

---

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Plataforma | El servicio SaaS CoopApps y su organización operadora. | `dict:pla.platform` | Proveedor ProCoop SRL (lista de clientes compilada en el ejecutable) |
| Tenant | Organización con ámbito propio de datos y administración; en CoopApps, cada cooperativa (MT-002). | `dict:pla.tenant` | Una base SQL por cooperativa + archivo `Configuracion*.pro` |
| Tenant `PLATFORM` | Tenant especial del operador del software; sus usuarios administran tenants, licencias y soporte. | `dict:pla.tenantPlatform` | — (SysAdmin `iNivel == -1`, sin separación de proveedor) |
| Código de tenant (`code`/slug) | Identificador corto, único y estable usado en URLs públicas y en el pre-login. | `dict:pla.tenantCode` | CUIT variable 519 / nombre de base |
| Ciclo de vida del tenant | Estados Preparación → Prueba → Listo para habilitar → Operativo ↔ Suspendido administrativo → Cierre/salida. | `dict:pla.lifecycle` | — (sin ciclo; demo de 30 días si el CUIT no está en la lista) |
| Checklist de habilitación | Lista de verificaciones automáticas y manuales que habilita una capacidad productiva. | `dict:pla.checklist` | — |
| Capacidad productiva | Módulo o servicio vertical en modo producción (emite, cobra, notifica a personas reales). | `dict:pla.productiveCapability` | Módulo habilitado en el campo `Modulos` del `.pro` |
| Módulo vendible | Renglón del `moduleCatalog`: producto que se vende; las pantallas que existen por él “cuelgan” y no se cobran aparte (CNX §2.4). | `dict:pla.sellableModule` | `MODULOS` (módulo y versión) |
| Pack / plan | Conjunto predefinido de módulos con cupos por defecto. | `dict:pla.plan` | — |
| Licencia (capa 1) | Qué módulos contrató el tenant y con qué vigencia y cupos. | `dict:pla.license` | Licencia del `.pro` + `Modulos` |
| Activación (capa 2) | Qué módulo licenciado está encendido hoy y en qué modo (prueba, producción, solo historia). | `dict:pla.activation` | — |
| Pantallas (capa 3) | Qué pantallas abre cada usuario (RBAC, T02). | `dict:pla.screens` | `MENUSYS` / `MENUVAL` |
| Contrato SaaS | Acuerdo comercial plataforma–cooperativa: plan, módulos, cupos, vigencia, SLA, región, condiciones de salida. | `dict:pla.saasContract` | — |
| Cupo (blando/duro) | Límite de uso por dimensión; el blando avisa, el duro aplica la política acordada. | `dict:pla.quota` | — |
| Caso de soporte | Incidencia que la cooperativa registra ante la plataforma (SUP-…), distinta de un reclamo de socio. | `dict:pla.supportCase` | Webchat de soporte / TeamViewer (`IniciarTeamViewer`) |
| Acceso temporal de soporte | Autorización acotada en modo, alcance y tiempo para que un agente de plataforma observe u opere en un tenant. | `dict:pla.supportGrant` | `frmSoporteIP` (soporte por IP) |
| Break-glass | Acceso de emergencia con doble aprobación de plataforma y notificación inmediata al tenant. | `dict:pla.breakGlass` | Contraseñas maestras hardcodeadas (`Nucleo.cs`) — **Reemplazado** |
| Incidente de plataforma | Evento que afecta a uno o más tenants (INC-…); agrupa casos. | `dict:pla.incident` | — |
| Alerta | Condición detectada con severidad, destinatarios, deduplicación y ciclo de estado. | `dict:pla.alert` | Avisos al abrir `Inicio_ProCoop` (backups vencidos, certificado AFIP, versión) |
| Ambiente | Despliegue independiente: local, ci, dev, staging, sandbox, demo, prod. | `dict:pla.environment` | Servidores de prueba hardcodeados (`Nucleo.cs:361–370`) |
| Sandbox de cooperativa | Tenant gemelo en el ambiente `sandbox` para probar configuración con integraciones de homologación. | `dict:pla.sandbox` | — |
| Release / anillo | Versión desplegada; anillo de despliegue gradual (interno, piloto, general). | `dict:pla.release` | `Version.gzip` en S3 del proveedor |
| Feature flag | Interruptor de funcionalidad por tenant o anillo. | `dict:pla.featureFlag` | `Modulos` / variables |
| RPO / RTO | Pérdida de datos tolerable / tiempo objetivo de recuperación (AGR-019). | `dict:pla.rpo` / `dict:pla.rto` | — |
| Restauración por tenant | Recuperación de los datos de un tenant a un punto en el tiempo sin retroceder a los demás. | `dict:pla.tenantRestore` | Backup SQL de la base completa (`GenerarBackup`) |
| Outbox | Colección donde cada cambio registra, en la misma transacción, los eventos a publicar. | `dict:pla.outbox` | — |
| Job | Trabajo en segundo plano idempotente, reanudable, con progreso (`<mod>:<proceso>`). | `dict:pla.job` | Tareas del Agente (`clsServicio_Procoop`) |
| Bandeja técnica | Lista de eventos/jobs fallidos no reparables automáticamente (AGR-016). | `dict:pla.deadLetters` | `LogProcoop.txt` |
| Salida del tenant | Exportación completa, solo lectura, archivo y purga al terminar el contrato. | `dict:pla.tenantExit` | — |

---

## 4. Actores, permisos y alcance

### 4.1. Roles del tenant `PLATFORM`

| Rol (plantilla, editable en T02) | Capabilities `pla.*` | Alcance de datos |
|---|---|---|
| Superadministrador de plataforma (USR-PLAT-001) | todas `pla.*`; no incluye `pla.soporte.accesoDatos` permanente | Global de plataforma; **sin** acceso a datos de negocio de tenants salvo acceso temporal |
| Implementación (onboarding) | `pla.tenants.ver`, `pla.tenants.crear`, `pla.tenants.editar`, `pla.tenants.cambiarEstado` (hasta Listo para habilitar), `pla.altaAsistida.usar`, `pla.checklists.ver`, `pla.checklists.verificar`, `pla.sandbox.crear`, `pla.licencias.ver`, `pla.soporte.accesos.solicitar` (antes `pla.accesos.solicitar`) | Tenants asignados (`onboarding.assignedImplementer`) |
| Comercial | `pla.tenants.ver`, `pla.contratos.ver`, `pla.contratos.crear`, `pla.contratos.editar`, `pla.planes.ver`, `pla.uso.ver` | Global, solo metadatos comerciales |
| Aprobador comercial / dirección | `pla.contratos.aprobar`, `pla.licencias.aprobar`, `pla.tenants.cambiarEstado` (Operativo, Suspendido, Cierre) | Global |
| Catálogo de producto | `pla.catalogo.ver`, `pla.catalogo.editar`, `pla.planes.editar` | Global |
| Soporte N1 | `pla.soporte.ver`, `pla.soporte.crear`, `pla.soporte.editar`, `pla.soporte.accesos.solicitar` (antes `pla.accesos.solicitar`) (modo observar) | Casos asignados a su cola |
| Soporte N2 / ingeniería | lo de N1 + `pla.soporte.accesos.solicitar` (antes `pla.accesos.solicitar`) (operar/configurar), `pla.jobs.reintentar`, `pla.jobs.cancelar`, `pla.deadLetters.reprocesar` | Casos asignados; tenant solo con acceso temporal vigente |
| Operaciones (SRE) | `pla.salud.ver`, `pla.jobs.ver`, `pla.jobs.reintentar`, `pla.colas.pausar`, `pla.backups.ver`, `pla.backups.ejecutar`, `pla.restauraciones.solicitar`, `pla.restauraciones.ejecutar`, `pla.releases.ver`, `pla.releases.publicar`, `pla.flags.editar`, `pla.incidentes.*`, `pla.alertas.*` | Global técnico; métricas sin datos personales |
| Seguridad / auditor de plataforma | `pla.soporte.accesos.ver` (antes `pla.accesos.ver`), `pla.soporte.accesos.aprobar` (antes `pla.accesos.aprobar`) (break-glass y restauración, segundo aprobador), `pla.soporte.accesos.revocar` (antes `pla.accesos.revocar`), `pla.auditoria.ver` (vía T02), `pla.restauraciones.aprobar` | Global, solo lectura salvo aprobaciones |
| Finanzas de plataforma | `pla.contratos.ver`, `pla.uso.ver`, `pla.facturacionSaas.ver`, `pla.facturacionSaas.exportar` | Global, metadatos comerciales |

### 4.2. Roles del tenant cooperativa (lado plataforma)

| Rol | Capabilities `pla.*` | Alcance |
|---|---|---|
| Administrador de cooperativa (USR-ADM-A) | `pla.miSuscripcion.ver`, `pla.habilitacion.ver`, `pla.habilitacion.verificar` (ítems manuales propios), `pla.soporte.crear`, `pla.soporte.ver`, `pla.soporte.accesos.ver` (antes `pla.accesosSoporte.ver`), `pla.soporte.accesos.aprobar` (antes `pla.accesosSoporte.aprobar`), `pla.soporte.accesos.revocar` (antes `pla.accesosSoporte.revocar`), `pla.exportacion.solicitar`, `pla.sandbox.ver`, `pla.sandbox.promover` (vía T04), `pla.novedadesPlataforma.ver`, `pla.estado.ver` | Su tenant |
| Usuario interno con permiso de soporte | `pla.soporte.crear`, `pla.soporte.ver` (propios) | Su tenant, casos propios |
| Financiero / Contable (USR-FIN-A, USR-CON-A) | `pla.miSuscripcion.ver` (si el administrador lo delega) | Su tenant |
| Socio / visitante | ninguna `pla.*`; consume `GET /api/public/<tenantSlug>/bootstrap` (API-POR-01, dueño M19; antes `<slug>`) | Público |

### 4.3. Actores técnicos

| Actor técnico | Identidad | Regla |
|---|---|---|
| Worker de jobs | Cuenta de servicio `svc:worker` con `actorType: 'system'` | Siempre ejecuta con `tenantId` del payload; nunca sin contexto de tenant salvo jobs declarados `scope: 'platform'`. |
| Relay de outbox | `svc:outbox` | Lee eventos pendientes de todos los tenants solo para encolarlos; no lee colecciones de negocio. |
| Agente de soporte en sesión | Usuario de `PLATFORM` + `supportGrantId` | Token con `tenantId` del tenant asistido, `actorType: 'support'`, capabilities = intersección del grant. |
| IA (gateway) | `svc:ai` | Solo propone; nunca confirma cambios (CNX §4.2). |
| Pipeline CI/CD | Identidad de despliegue | Ejecuta migraciones de esquema y de catálogos; sin acceso a datos de negocio. |

**Regla general de permisos:** `permitido = licenciaVigente(módulo) ∧ activación(módulo, modo) ∧ capability(rol/usuario) ∧ alcance(dato)`. Las tres primeras capas se evalúan en el middleware `requireCapability`; la cuarta, en el servicio del módulo dueño (T02 §alcance).

---

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.A. Arquitectura de referencia y stack (DEC-001, DEC-003, DEC-004)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-001 | La solución se presta como SaaS en la nube: la cooperativa no instala el núcleo de gestión ni opera servidores para alojarlo. | SaaS-001, SaaS-003, BASE §2 Estructura multitenant, §64.2 | Núcleo | O0 | Informado | Un tenant nuevo opera desde navegador/PWA sin instalar software de servidor ni cliente pesado. |
| RF-PLA-002 | Stack: Node.js 20 ESM, Express 4, MongoDB 7 en replica set, Mongoose 8, Vue 3.5 + Vite + Pinia + Vue Router + Tailwind, `vite-plugin-pwa`. | DEC-001, CNX §2.1 | Núcleo | O0 | Adoptado | `package.json` raíz con `engines.node >=20`; Mongo arranca como replica set (también en local) y las transacciones multi-documento funcionan. |
| RF-PLA-003 | Monorepo único con `apps/` (api, worker, admin, pwa, landing), `packages/` compartidos e `infra/`, según el árbol de §7.3. | DEC-001, CNX §2.2 | Núcleo | O0 | Adoptado | La estructura existe y `npm run check:structure` falla si un módulo no respeta la plantilla de carpetas. |
| RF-PLA-004 | Arquitectura de **monolito modular**: un backend con módulos de dominio (§7.4), cada uno dueño de sus colecciones; otros módulos solo invocan su API pública (`index.js`) o consumen sus eventos. | DEC-003, BASE §58 ARQ-001, §102.5.1, AGR-002, AGR §5.1 | Núcleo | O0 | Adoptado | `npm run check:boundaries` (dependency-cruiser) falla si un módulo importa `models/` o `services/` internos de otro; el registro de módulos falla si dos manifiestos declaran la misma colección. |
| RF-PLA-005 | Cada módulo declara un **manifiesto** (`manifest.js`): código, dependencias permitidas, colecciones propias, capabilities, eventos emitidos y consumidos, jobs, parámetros, ítems de menú, proveedores de checklist y ganchos de conciliación/exportación. | DEC-003, AGR-002 | Núcleo | O0 | Adoptado | El arranque valida todos los manifiestos y publica en `/api/platform/system/modules` el inventario; un evento emitido sin declarar en el manifiesto falla en pruebas. |
| RF-PLA-006 | Convención interna de cada módulo (maestro §5.2 ampliado): `index.js` (API pública), `manifest.js`, `model/` (esquemas Mongoose), `domain/` (lógica pura, sin IO), `service/` (casos de uso, transacciones, outbox), `adapters/` (IO externo propio), `routes/` (HTTP y orquestación mínima), `schemas/` (reexporta los Zod de `packages/shared/schemas/<cod>`), `events/`, `jobs/`, `seeds/`, `migrations/`, `tests/`. | CNX §2.2 (`lib/` vs `services/` vs `routes/`) [COPIAR], adaptado | Estándar | O0 | Adoptado | Plantilla generada con `npm run gen:module <cod>`; los tests de `domain/` corren sin Mongo ni red. |
| RF-PLA-007 | Grafo de dependencias entre módulos acíclico; las dependencias circulares se resuelven solo por eventos. | DEC-003 | Núcleo | O0 | Adoptado | `check:boundaries` detecta ciclos. |
| RF-PLA-008 | Las escrituras que afectan varias colecciones de un mismo módulo, o un cambio y su evento, se hacen en **una transacción** Mongo (`withTransaction`). | DEC-001, CNX §10 (transacciones multi-documento), AGR-016 | Núcleo | O0 | Adoptado | Prueba: si falla la inserción del evento en outbox, el cambio de negocio no queda persistido. |
| RF-PLA-009 | **Outbox de eventos**: todo evento de dominio se graba en `outboxEvents` en la misma transacción; un relay lo entrega a los suscriptores registrados vía BullMQ; los consumidores son idempotentes (`inboxReceipts`). | DEC-003, AGR-016, AGR §5.5 | Núcleo | O0 | Adoptado | Reiniciar el relay o el worker a mitad de entrega no duplica efectos; un evento entregado dos veces se procesa una sola vez. |
| RF-PLA-010 | **Workers BullMQ/Redis** separados del proceso API, escalables horizontalmente, con colas por clase de carga (§7.6). Prohibido `setInterval` para trabajos de negocio. | DEC-003, CNX §2.6 [MEJORAR], RN-09 §7.10, FIC §22 | Núcleo | O0 | Adoptado | Dos réplicas del worker no ejecutan dos veces el mismo job programado; el API arranca sin schedulers. |
| RF-PLA-011 | Cada job es **idempotente, reanudable y con progreso** persistido en `jobRuns`; nombre `<modulo>:<proceso>`. | Guía §5 Jobs, AGR-016 | Núcleo | O0 | Adoptado | Matar el worker a mitad de un job de 10.000 ítems y reanudar termina sin repetir los ya procesados (cursor en `jobRuns.cursor`). |
| RF-PLA-012 | **Almacenamiento de objetos privado** S3-compatible con URL firmadas de vida corta; ningún comprobante ni dato de socio se sirve por estático público. | DEC-001, CNX §2.6, CNX §10 V-01, FIC §22 | Núcleo | O0 | Adoptado | Acceso directo sin firma devuelve 403; una URL firmada vence en `PRM-PLA-020` segundos. |
| RF-PLA-013 | **Despliegue con Docker** agnóstico de nube: imágenes `api`, `worker`, `admin`, `pwa`, `landing` desde un Dockerfile multi-stage; AWS como referencia. | DEC-004, CNX §2.8 | Núcleo | O0 | Adoptado | `docker compose up` levanta todo el sistema en local; las mismas imágenes (mismo digest) se promueven a staging y prod. |
| RF-PLA-014 | Validación de entrada y salida con **Zod** en esquemas compartidos (`packages/shared/schemas`) entre backend y frontends; generación de OpenAPI desde esos esquemas. | DEC-001, CNX §2.6 [MEJORAR], CNX §4.6 | Núcleo | O0 | Adoptado | Un request inválido devuelve 400 `application/problem+json` con detalle de campos; el formulario del admin usa el mismo esquema. |
| RF-PLA-015 | Errores RFC 9457 con `requestId`; 5xx nunca exponen detalle técnico; paginación uniforme `{ items, total, page, size }` con tope de `size`. | Guía §5 API, CNX §2.6 [COPIAR], AGR §10 [R3] | Núcleo | O0 | Adoptado | Prueba de contrato sobre todas las rutas listadas en `/api/platform/system/routes`. |

### 5.B. Multitenancy en base única (**DEC-110**; redacción histórica DEC-002 en RF)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-016 | Aplicación multitenant: cada cooperativa es un tenant con sus propios asociados, empleados, usuarios y roles. | MT-001, MT-002, MT-004, MT-005, MT-007, MT-008, BASE §42.3 | Núcleo | O0 | Informado | Dos tenants con el mismo código interno de socio (ASO-001) no se mezclan (BASE §42.8). |
| RF-PLA-017 | **Una única base de datos** compartida; todo documento de negocio lleva `tenantId` (ObjectId) obligatorio e indexado. | DEC-002, CNX §2.3 | Núcleo | O0 | Adoptado | Prueba de esquema: toda colección registrada como `tenancy: 'tenant'` tiene `tenantId` `required`. |
| RF-PLA-018 | **Todos los índices compuestos empiezan por `tenantId`**, incluidos los únicos (ej. `{ tenantId: 1, number: 1 }`). | DEC-002, CNX §2.3 | Núcleo | O0 | Adoptado | `npm run check:indexes` recorre los esquemas y falla si un índice de colección de tenant no empieza por `tenantId`; única excepción: lista blanca de índices técnicos de plataforma (relay de outbox, bandeja global de soporte), leídos solo con `runAsPlatform` (§7.11.10, §7.11.23). |
| RF-PLA-019 | El tenant **sale del token** (claim `tid`) o del contexto del job; nunca de un header, query o body manipulable. Las rutas públicas resuelven el tenant por `tenantSlug`/host y solo exponen datos públicos. | DEC-002, CNX §2.3, BASE §42.7 (excepción) | Núcleo | O0 | Adoptado | Enviar `tenantId` de otro tenant en body/query es ignorado o rechazado; el resultado siempre pertenece al tenant del token. |
| RF-PLA-020 | **Plugin Mongoose de tenancy**: inyecta el filtro `tenantId` del contexto en `find*`, `count*`, `update*`, `delete*`, `replaceOne`, `distinct`, `aggregate` (primer `$match`) y `bulkWrite`; asigna `tenantId` en `save`/`insertMany`; **lanza error** si no hay contexto de tenant. | DEC-002 | Núcleo | O0 | Adoptado | Prueba: una consulta sin contexto lanza `TenantContextMissingError`; un `aggregate` sin `$match` inicial recibe el filtro inyectado; un `$lookup` a otra colección de tenant exige `tenantId` en el pipeline (lint de pipeline). |
| RF-PLA-021 | Contexto de ejecución con `AsyncLocalStorage` (`tenantId`, `userId`, `actorType`, `requestId`, `correlationId`, `supportGrantId`, `environment`) propagado a servicios, eventos, jobs, logs y auditoría. | DEC-002, BASE §54 Registro de auditoría | Núcleo | O0 | Adoptado | Un evento publicado y el job que dispara conservan `correlationId` y `tenantId` del request original. |
| RF-PLA-022 | Escape explícito `runAsPlatform(fn, { reason })` para operaciones globales; solo invocable desde código de PLA o jobs `scope: 'platform'`, auditado con motivo. | DEC-002 | Núcleo | O0 | Adoptado | `check:boundaries` impide usar `runAsPlatform` fuera de la lista blanca; cada uso genera evento de auditoría. |
| RF-PLA-023 | Colecciones **globales** (sin `tenantId`) declaradas en lista blanca: `tenants`, `moduleCatalog`, `platformPlans`, `releases`, `featureFlags`, `backupPolicies`, `alertRules` de ámbito plataforma, `schemaMigrations` (§7.11.28, agregada por T05 COL-PLA-32), `identities` y `federatedLinks` (T02), `outboxEvents` y `jobRuns` del despachador (llevan `tenantId`, pero se consultan con `runAsPlatform` técnico) y `erasureLedger` (T08, base aparte); la lista completa vive en T05 §7.1.3 (DEC-092; antes omitía las cinco últimas); todo el resto es de tenant. | DEC-002 | Núcleo | O0 | Adoptado | Una colección nueva sin declaración de `tenancy` hace fallar el arranque. |
| RF-PLA-024 | Aislamiento en **jobs**: el payload lleva `tenantId`; el worker establece el contexto antes de ejecutar; jobs de un tenant no leen datos de otro. | DEC-002, BASE §2 (aislamiento en procesos), AGR §10 [R2] | Núcleo | O0 | Adoptado | Prueba: un job con `tenantId` A no encuentra documentos de B aunque reciba sus ids. |
| RF-PLA-025 | Aislamiento en **archivos**: claves de objeto `tenants/<tenantId>/<modulo>/...`; metadatos en `storedFiles` con `tenantId`; la URL firmada solo se emite tras verificar tenant y permiso sobre el objeto dueño. | DEC-002, CNX §10 V-01 | Núcleo | O0 | Adoptado | Pedir la URL de un archivo de B con token de A devuelve 404. |
| RF-PLA-026 | Aislamiento en **caché/Redis**: toda clave de tenant lleva prefijo `t:<tenantId>:`; las claves globales `p:`; prohibido cachear respuestas sin clave de tenant. | DEC-002 | Núcleo | O0 | Adoptado | Lint del helper `cache.key()`; prueba de colisión entre dos tenants con el mismo id de recurso. |
| RF-PLA-027 | Aislamiento en **exportaciones** (XLSX/CSV/PDF/ZIP): se generan como job con `tenantId`, se guardan bajo el prefijo del tenant y solo las descarga el solicitante o quien tenga permiso. | DEC-002, BASE §2 (exportaciones) | Núcleo | O0 | Adoptado | Prueba de descarga cruzada rechazada; el archivo vence según `PRM-PLA-024`. |
| RF-PLA-028 | Aislamiento en **búsquedas**: búsqueda global, autocompletados y búsqueda de texto siempre filtran por `tenantId`; un motor externo futuro exige filtro de tenant obligatorio en cada índice. | DEC-002, BASE §42.5 (búsquedas) | Núcleo | O0 | Adoptado | La búsqueda “Pérez” en TEN-002 no devuelve a Ana Pérez de TEN-001. |
| RF-PLA-029 | Aislamiento en **IA** (clave del proveedor de IA provista por la plataforma, con opción de clave propia del tenant, DEC-020): el gateway solo envía al proveedor datos del tenant en contexto; sin entrenamiento con datos de clientes; registro de uso por tenant en `aiUsage`; prompts y respuestas no se cachean entre tenants. | DEC-002, CNX §4.5 (IA solo cita datos), AGR-030 (vía T08) | Núcleo | O1 | Adoptado | Prueba: el contexto armado para una pregunta de TEN-001 no contiene ids ni textos de TEN-002. |
| RF-PLA-030 | Aislamiento en **logs y métricas**: cada línea de log lleva `tenantId`, `requestId`, `module`; los logs no contienen datos personales, contraseñas ni tokens. | DEC-002, BASE §97.8 Observabilidad | Núcleo | O0 | Adoptado | Escáner de logs en CI detecta patrones de DNI/CUIT/email/token en mensajes de prueba. |
| RF-PLA-031 | Aislamiento en **notificaciones e integraciones**: remitentes, plantillas, credenciales y webhooks se resuelven por tenant; un webhook entrante se asocia a tenant por su ruta firmada, no por datos del cuerpo. | BASE §2 (integraciones), DEC-002 | Núcleo | O1 | Adoptado | Webhook de pasarela con firma de A hacia ruta de B es rechazado (detalle en T06). |
| RF-PLA-032 | Los identificadores de referencia (ASO-001, números de comprobante) se resuelven siempre dentro del tenant. | BASE §42.8 | Núcleo | O0 | Informado | Unicidad `{ tenantId, code }`. |
| RF-PLA-033 | Cambiar un identificador de cooperativa o de documento en una solicitud no permite acceder a datos de otro tenant (respuesta 404, no 403, para no revelar existencia). | BASE §42.7 Excepción, AGR §10 [R2] | Núcleo | O0 | Informado | Suite de pruebas de aislamiento §17.2 en verde en cada build. |
| RF-PLA-034 | Suite automática de **pruebas de aislamiento** que recorre todas las rutas y colecciones registradas con dos tenants. | AGR-035, AGR-036, BASE §102.7 C | Núcleo | O0 | Adoptado | Cobertura: 100 % de rutas `/api/admin`, `/api/<mod>`, `/api/v1/ext`. |
| RF-PLA-035 | Lectura analítica (BI, exportaciones grandes) contra nodo secundario con etiqueta `analytics` del replica set, nunca contra el primario en horario operativo. | AGR-020, BASE §97.8 Aislamiento de carga, BASE §58 Datos analíticos | Estándar | O1 | Adoptado | Las consultas de BI muestran `readPreference: secondary` con tag `analytics` en el perfilador. |

### 5.C. Tenant `PLATFORM`

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-036 | Existe el tenant especial `PLATFORM` (kind `platform`), creado por migración idempotente, que representa al operador del software. | DEC-002, CNX §2.3, MT-003 | Núcleo | O0 | Adoptado | Tras el primer despliegue existe exactamente un tenant `code: 'platform'`. |
| RF-PLA-037 | Solo usuarios de `PLATFORM` acceden a `/api/platform/*` y a rutas `meta.platformOnly` del admin; ningún rol de cooperativa puede obtener capabilities de plataforma. | MT-003, BASE §42.4, CNX §4.3 | Núcleo | O0 | Adoptado | Token de TEN-001 con rol administrador recibe 403 en `/api/platform/tenants`. |
| RF-PLA-038 | Los usuarios de `PLATFORM` **no** tienen acceso a datos de negocio de los tenants por pertenecer a la plataforma; solo mediante acceso temporal de soporte (§5.I). | BASE §42.4, §54 Límite, AGR-034 | Núcleo | O1 | Adoptado | USR-PLAT-001 sin grant recibe 403 en `/api/admin/per/persons` de TEN-001. |
| RF-PLA-039 | El tablero global de plataforma no habilita acceso irrestricto a datos personales ni a la contabilidad de los tenants. | BASE §54 Límite | Núcleo | O1 | Informado | Los KPIs de plataforma son agregados técnicos/comerciales; ninguna pantalla de plataforma lista personas de un tenant. |
| RF-PLA-040 | El tenant `PLATFORM` puede usar los módulos funcionales del propio sistema para su gestión (facturación del SaaS, CRM de soporte), como cualquier tenant y con el mismo aislamiento. | BASE §97.11, PA-PLA-08 | Extensión | O5 | Adoptado (DEC-065) | La facturación del SaaS a TEN-001 aparece en el ERP de `PLATFORM`, no en el de TEN-001. |

### 5.D. Ciclo de vida del tenant (AGR-004)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-041 | El administrador de plataforma registra cooperativas como tenants (alta, edición de identidad, contactos, región, zona horaria, dominio). | MT-003, BASE §42.5, CU-MT-01 paso 1, CNX §4.3 | Núcleo | O1 | Informado | Alta de TEN-001 genera tenant en estado Preparación con checklist base. |
| RF-PLA-042 | Estados del tenant: **Preparación**, **Prueba**, **Listo para habilitar**, **Operativo**, **Suspendido administrativo**, **Cierre/salida** (subestados En cierre, Cerrado, Purgado), con la máquina de §8.1. | AGR-004 | Núcleo | O1 | Adoptado | Ninguna transición fuera de la tabla §8.1 es aceptada por la API. |
| RF-PLA-043 | Cada transición registra actor, motivo, fecha, checklist evaluado y evidencia; se audita y emite evento. | AGR-004, BASE §54 GOB-004 | Núcleo | O1 | Adoptado | Historial visible en PAN-PLA-03. |
| RF-PLA-044 | En Preparación el tenant puede cargar marca, catálogo, configuración y usuarios, pero **no** habilitar emisión, cobro ni comunicaciones reales. | AGR-004 Ejemplo | Núcleo | O1 | Adoptado | Intentar activar `fac` en producción con tenant en Preparación devuelve 409 con el ítem de checklist faltante. |
| RF-PLA-045 | Prueba: el tenant usa su **sandbox** y/o modo prueba de módulos con integraciones de homologación; los datos de prueba se marcan y no pasan a producción. | AGR-004, AGR-035, BASE §97.9 | Núcleo | O1 | Adoptado | Documentos creados en modo prueba llevan `isTest: true` y numeración de prueba; no se informan a ARCA producción. |
| RF-PLA-046 | **Checklists de habilitación por capacidad** (§9.2): identidad, servicio, tarifas, emisión, pagos, usuarios, contactos, saldos iniciales, comunicaciones, landing, legales; ítems automáticos (provistos por cada módulo) y manuales (con evidencia). | AGR-004 | Núcleo | O1 | Adoptado | Una capacidad no pasa a producción con algún ítem obligatorio en `pending`/`failed` salvo dispensa (`waived`) aprobada y auditada. |
| RF-PLA-047 | No se activa una capacidad productiva con **datos de demostración** o dependencias faltantes. | AGR-004 Criterio, BASE §97.9 | Núcleo | O1 | Adoptado | El ítem automático `noDemoData` falla si existe algún documento con `isDemo: true` en el tenant. |
| RF-PLA-048 | Distinguir tres dimensiones independientes: **disponibilidad técnica** (estado del tenant y salud), **situación comercial SaaS** (contrato) y **prestación al socio** (servicios del tenant, M02). | AGR-004 Propuesta, BASE §66 (tres niveles) | Núcleo | O1 | Adoptado | Un contrato SaaS vencido no cambia estados de servicios de socios; solo puede llevar a Suspendido administrativo por decisión registrada. |
| RF-PLA-049 | **Suspensión administrativa** (deuda SaaS, incumplimiento, pedido de la cooperativa, riesgo de seguridad) con modo configurable; **no ejecuta bajas masivas** de servicios ni contratos ni borra datos. | AGR-004 Criterio | Núcleo | O1 | Adoptado / A validar (PA-PLA-04) | Suspender TEN-001 deja intactos contratos y deudas; el comportamiento del portal del socio sigue PA-PLA-04. |
| RF-PLA-050 | **Reactivación** desde Suspendido a Operativo, reanudando jobs pausados sin ejecutar “recuperaciones” duplicadas (recalcula desde el estado actual). | AGR-004 (reactivación) | Núcleo | O1 | Adoptado | Un ciclo de facturación programado durante la suspensión no se emite dos veces al reactivar; queda en bandeja para decisión del tenant. |
| RF-PLA-051 | Cierre/salida: aviso, **exportación completa** del tenant en formatos abiertos, período de **solo lectura**, cierre de accesos, archivo cifrado y **purga** con certificado al vencer la retención. | AGR-004, AGR-005 (acceso a documentos y exportación durante una transición), MER-020 | Núcleo | O1 | A validar (PA-PLA-12) | Exportación descargable y verificable por checksum; purga registrada con certificado. |
| RF-PLA-052 | Una decisión administrativa de plataforma **no** ejecuta bajas masivas de servicios de la cooperativa (los efectos sobre socios los decide la cooperativa en sus módulos). | AGR-004 Criterio | Núcleo | O1 | Adoptado | Ningún handler de `pla.tenant.suspended` modifica colecciones de M01–M19. |
| RF-PLA-053 | Habilitar o deshabilitar cooperativas y usuarios: la plataforma habilita/deshabilita el tenant; la cooperativa habilita/deshabilita a sus usuarios (T02). | BASE §42.9 (quién crea, habilita o deshabilita) | Núcleo | O1 | Adoptado | Matriz de §4 aplicada en pruebas de permisos negativos. |
| RF-PLA-054 | Dos tenants de prueba (TEN-001 y TEN-002) para verificar aislamiento y configuración propia, desde la ola O1; la semilla mínima de ambos (registro en `tenants` y un usuario por tenant) existe desde O0 para la suite de aislamiento de RF-PLA-034 (DEC-092). | AGR-036, BASE §102.7 C | Núcleo | O1 | Adoptado | Escenario §17 CU-MT-01 automatizado. |
| RF-PLA-055 | Tablero de habilitación del tenant (lado cooperativa): estado del tenant, checklist por capacidad, pendientes y responsables. | AGR-004, BASE §54 (configuraciones incompletas) | Estándar | O1 | Adoptado | PAN-PLA-16 muestra el avance; el administrador marca ítems manuales con evidencia. |

### 5.E. Alta asistida de cooperativa con IA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-056 | Asistente de alta de cooperativa en pasos: identidad → contactos → marca → módulos/plan → dominio y región → administrador inicial → resumen y confirmación. | CNX §4.3 (alta asistida), BASE §2 Marca y landing, CU-SaaS-01 | Estándar | O1 | Adoptado | Un tenant completo se registra en un único flujo con borrador recuperable (`onboardingDrafts`). |
| RF-PLA-057 | La IA **propone** a partir del logo subido y/o la URL del sitio de la cooperativa: logo recortado/vectorizable, paleta (primario, secundario, acento), nombre corto, slug, splash e íconos; además propuestas de diccionario (p. ej. “socio” vs “asociado” vs “usuario”). | CNX §4.3, CNX §3.2, CNX §4.2 (IA solo propone), BASE §2 (lenguaje propio), BASE §65 | Estándar | O1 | Adoptado | La propuesta queda en el borrador; nada se aplica sin confirmación humana. |
| RF-PLA-058 | La paleta propuesta se valida con contraste mínimo WCAG 2.2 AA sobre los tokens del tema oscuro (CNX §3.1/§4.1); si no cumple, se ajusta y se explica. | AGR-032 vía T03, AGR §10 [R1] | Estándar | O1 | Adoptado | Ningún color aceptado produce contraste < 4,5:1 en texto normal. |
| RF-PLA-059 | La razón social y domicilio fiscal pueden precargarse desde el padrón de ARCA por CUIT (servicio de T06) y siempre son editables y confirmados por una persona. | BASE §2, FIC padrón (T06) | Estándar | O1 | Adoptado | CUIT ficticio en demo devuelve datos simulados; en prod usa el conector del padrón. |
| RF-PLA-060 | El alta crea: tenant (Preparación), licencias del plan, activaciones en `off`, checklist base, invitación al administrador inicial (T02), branding y diccionario confirmados (T03), sandbox opcional. | CU-MT-01 pasos 1–2, AGR-004 | Núcleo | O1 | Adoptado | Todos los artefactos se crean en una operación idempotente con `Idempotency-Key`; un reintento no duplica el tenant. |
| RF-PLA-061 | El uso de IA en el alta se mide (`aiUsage`) y puede deshabilitarse por parámetro. | CNX §2.1 (IA por HTTP), PRM-PLA-040 | Estándar | O1 | Adoptado | Con `PRM-PLA-040 = false` el paso de marca es manual. |
| RF-PLA-062 | Un borrador de alta descartado no deja tenant ni usuarios creados; los archivos subidos se eliminan por job. | — (propio) | Estándar | O1 | Adoptado | JOB-PLA-17 limpia borradores vencidos. |

### 5.F. Licenciamiento en tres capas y catálogo de módulos vendibles

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-063 | **Catálogo global de módulos vendibles** (`moduleCatalog`): código, clase (módulo funcional, servicio vertical, complemento, canal, integración), etiqueta por diccionario, grupo, dependencias, packs, prefijos de capabilities que “cuelgan”, estado y ola mínima. | CNX §2.4 (`moduleCatalog.js`), BASE §66 CAT-001, BASE §66 Alcance (catálogo global con código, descripción, estado y capacidades) | Núcleo | O1 | Adoptado | El catálogo inicial de §7.11.3 se siembra por migración idempotente. |
| RF-PLA-064 | Regla de producto: **un renglón del catálogo = un producto que se vende**; una pantalla que solo existe porque existe ese producto cuelga de él y no se cobra aparte. | CNX §2.4 | Núcleo | O1 | Adoptado | Cada capability del sistema pertenece a exactamente un `moduleCode` (verificado en CI). |
| RF-PLA-065 | **Capa 1 — Licencia**: qué módulos contrató el tenant (`tenantLicenses`), con origen (plan, complemento, prueba, cortesía), vigencia y cupos. La plataforma habilita los servicios según la licencia; el administrador del tenant los publica, con aprobación de otro usuario en producción (DEC-021, M02). | CNX §2.4, AGR-005, DEC-021 | Núcleo | O1 | Adoptado | Un módulo sin licencia vigente no puede activarse. |
| RF-PLA-066 | **Capa 2 — Activación**: qué módulo licenciado está encendido hoy y en qué modo (`off`, `test`, `production`, `historyReadOnly`), por tenant. | CNX §2.4 (`Tenant.capabilities`), AGR-004 | Núcleo | O1 | Adoptado | Activar en `production` exige checklist completo (RF-PLA-046). |
| RF-PLA-067 | **Capa 3 — Pantallas**: RBAC del usuario (T02); el menú (`siteMapGroups`, T03) muestra solo ítems cuya capability pertenece a un módulo licenciado y activo y que el usuario tiene. | CNX §2.4, CNX §4.2 (árbol declarativo), DFA M1 Perfiles | Núcleo | O1 | Adoptado | Desactivar `crm` oculta sus ítems de menú en el siguiente refresh de token (≤ `PRM-PLA-007`). |
| RF-PLA-068 | Función única `getEffectiveModules(tenantId)` con caché en Redis e invalidación por versión (`modulesVersion` en el token). | CNX §2.4 | Núcleo | O1 | Adoptado | Cambiar una activación incrementa `modulesVersion` y los tokens viejos se refrescan. |
| RF-PLA-069 | Desactivar un módulo **no** oculta documentos históricos ni elimina expedientes: pasa a `historyReadOnly` (consulta y exportación sí; altas y operaciones no). | AGR-005 Ejemplo, BASE §66 (retirar oferta no borra) | Núcleo | O1 | Adoptado | Con `fac` en `historyReadOnly`, las facturas emitidas siguen consultables y descargables. |
| RF-PLA-070 | **Servicios verticales** (Internet, Electricidad, Agua, Gas, Cementerio parque, Banco de sangre, Telefonía, TV, Sepelio, Salud/ambulancias, Vivienda, Otros) son módulos licenciables; habilitar la capacidad **no** crea oferta ni contratos: la oferta la publica el tenant en M02. | BASE §66 (tres niveles), CAT-001, CAT-002, CAT-003, DEC-007 | Núcleo | O1 | Informado | Con licencia `svc.agua` activa y sin oferta publicada en M02, la landing de TEN-001 no muestra Agua. |
| RF-PLA-071 | Dependencias entre módulos del catálogo (ej. `fac` requiere `tar` y `fis`; `mor` requiere `cob`); la activación valida dependencias activas. | AGR-009 (dependencias), CNX §2.4 | Núcleo | O1 | Adoptado | Activar `mor` sin `cob` activo devuelve 409 con la dependencia faltante. |
| RF-PLA-072 | **Packs/planes** (`platformPlans`) agrupan módulos y cupos por defecto; un tenant puede tener plan + complementos. | CNX §2.4 (`packs: basico/todo`), BASE §99.3 (planes por tamaño), BASE §97.11, DEC-065 | Estándar | O1 | Adoptado (DEC-065: packs por tamaño más complementos con cupo por contratos activos) | Asignar plan “Estándar” genera las licencias de sus módulos. |
| RF-PLA-073 | Auditoría de toda habilitación, deshabilitación y modificación de alcance de módulos. | BASE §66 Alcance (auditar habilitaciones) | Núcleo | O1 | Informado | Cada cambio de `tenantLicenses`/`tenantModuleActivations` genera `auditLogs` con antes/después. |
| RF-PLA-074 | Determinar quién autoriza la habilitación en plataforma (Aprobador comercial) y quién administra la oferta dentro del tenant (administrador de cooperativa en M02). | BASE §66 Alcance | Núcleo | O1 | Adoptado | Matriz §4 y pruebas de permisos. |
| RF-PLA-075 | Disponibilidad para nuevas contrataciones y operación de contratos existentes se definen por separado (la capacidad `historyReadOnly` permite operar contratos existentes según política del módulo). | BASE §66 Alcance | Estándar | O1 | Adoptado | Desactivar nuevas altas de un servicio vertical mantiene facturación de contratos vigentes si el modo es `production` con `newSalesBlocked: true`. |

### 5.G. Contrato comercial SaaS y medición de uso (AGR-005, BASE §97.11)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-076 | Registrar por tenant el **contrato SaaS**: plan, módulos, cupos, vigencia, renovación, región, objetivos de servicio (SLA/RPO/RTO), condiciones de salida y documento firmado, con el contrato tipo de encargo de tratamiento (CoopApps como prestador por cuenta de la cooperativa, art. 25 Ley 25.326). | BASE §97.11, AGR-005, DEC-062, DEC-063, DEC-076 | Estándar | O1 | Adoptado | PAN-PLA-07 permite alta, aprobación y versiones del contrato. |
| RF-PLA-077 | Separar **capacidades contratadas a la plataforma**, **servicios ofrecidos por el tenant** y **contratos de sus socios**. | AGR-005 Propuesta, BASE §66 | Núcleo | O1 | Adoptado | El sistema explica, para un módulo, si su disponibilidad depende del contrato SaaS o del catálogo del tenant (PAN-PLA-16). |
| RF-PLA-078 | Cupos por dimensión (el consumo de mensajería del proveedor de plataforma se vende como complemento medido, DEC-077 y DEC-065): contratos de servicio activos, usuarios internos, almacenamiento (GB), mensajes salientes por mes (email/SMS/WhatsApp), llamadas de API de terceros por mes, tokens de IA por mes, sandboxes; con límite **blando** (aviso) y **duro** (política). | AGR-005 (cupos, límites blandos/duros, excedentes, avisos) | Estándar | O1 | A validar (PA-PLA-10) | Al 80 % (`PRM-PLA-031`) se emite alerta; al 100 % del duro se aplica la política de PA-PLA-10. |
| RF-PLA-079 | **Medición de uso** diaria por tenant y dimensión (`usageSnapshots`), consultable por plataforma y por el tenant. | BASE §97.11 (límites de uso), AGR-005 | Estándar | O1 | Adoptado | JOB-PLA-05 genera snapshots; la cooperativa ve su consumo en PAN-PLA-15. |
| RF-PLA-080 | **No** se implementa un precio o límite sin decisión comercial expresa: los importes del contrato son campos opcionales “a validar”; la plataforma no inventa tarifas. | AGR-005 Criterio, BASE §64.4 (“SaaS no define precio”) | Núcleo | O1 | Adoptado | Un contrato sin precio puede aprobarse; los cupos sin valor quedan “sin límite acordado” y se reportan. |
| RF-PLA-081 | Tratamiento de la **baja del cliente SaaS**: aviso, ventana de exportación, acceso a documentos durante la transición (RF-PLA-051). | AGR-005 | Estándar | O1 | A validar (PA-PLA-12) | Contrato en `terminated` lleva el tenant a En cierre con fecha de solo lectura. |
| RF-PLA-082 | **Facturación de la plataforma** a las cooperativas, separada de la facturación que cada cooperativa hace a sus socios. | BASE §97.11 | Estándar | O5 | Adoptado (DEC-065) | Prefactura mensual por contrato exportable (O1); facturación fiscal según PA-PLA-08. |
| RF-PLA-083 | La medición de llamadas de API de terceros y consultas BI pesadas alimenta cupos y límites de tasa por tenant. | AGR-020, BASE §97.8 Aislamiento de carga, SaaS (APIs) | Estándar | O11 | Adoptado | Un token de API que excede su límite recibe 429 con `Retry-After`. |
| RF-PLA-084 | Situación comercial visible al administrador de la cooperativa (plan, módulos, cupos, consumo, vigencia), sin precios si la plataforma no los publica. | BASE §97.11, AGR-005 | Estándar | O1 | Adoptado | PAN-PLA-15. |
| RF-PLA-085 | Cambios de plan o de cupos se versionan con vigencia y no son retroactivos sobre la medición ya registrada. | AGR-010 (fecha efectiva) | Estándar | O1 | Adoptado | Historial de versiones del contrato con `validFrom`. |

### 5.H. Dashboards de plataforma y alertas (BASE §54, lado plataforma)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-086 | **Dashboard del administrador de plataforma** con visión global autorizada de la solución y sus tenants. | GOB-001 | Núcleo | O1 | Informado | PAN-PLA-01 con los KPIs de §15.1. |
| RF-PLA-087 | Indicadores de plataforma: tenants por estado; errores de procesos e integraciones; trabajos pendientes; disponibilidad operativa; configuraciones/checklists incompletos; además: lag de outbox, bandeja técnica, uso vs cupo, último backup por tenant, ensayos de restauración vencidos, certificados a vencer, accesos de soporte activos, casos abiertos por prioridad, versión por ambiente. | BASE §54 Vista Plataforma, AGR-019, AGR-034 | Núcleo | O1 | Informado / Adoptado | Cada KPI declara universo, corte, frecuencia y permiso de detalle (§15). |
| RF-PLA-088 | Cada indicador define **universo, corte, frecuencia de actualización y permiso de detalle**. | BASE §54, AGR-022 | Núcleo | O1 | Informado | Ficha de KPI en `ScreenHelp` de PAN-PLA-01. |
| RF-PLA-089 | **Motor genérico de alertas**: reglas con condición, severidad, destinatarios, deduplicación, ventana de enfriamiento; alertas con estado (abierta, reconocida, resuelta, silenciada), reconocimiento, resolución y vínculo al objeto de origen. | GOB-003, BASE §54 (alertas) | Núcleo | O1 | Informado | Una misma condición repetida en la ventana `PRM-PLA-033` incrementa `count` en una sola alerta. |
| RF-PLA-090 | Las alertas de ámbito plataforma se dirigen a roles de `PLATFORM`; el motor expone API para que los módulos (T10) definan reglas de ámbito tenant. | GOB-003 | Núcleo | O1 | Adoptado | Una regla de tenant no puede tener destinatarios de otro tenant. |
| RF-PLA-091 | Canales de alerta: in-app (buzón), email, push, y webhook/ChatOps para guardias de plataforma (vía T09/T06). | CNX §2.7 | Estándar | O1 | Adoptado | Alerta crítica de plataforma llega por al menos dos canales. |
| RF-PLA-092 | Umbrales, canales y escalamiento son parámetros por regla (no fijos en código). | BASE §54 (“umbrales, canales y escalamiento quedan por acordar”) | Estándar | O1 | Adoptado | Editables en PAN-PLA-12 con auditoría. |
| RF-PLA-093 | Alertas automáticas de plataforma que reemplazan los avisos de escritorio de ProCoop: backup vencido o fallido (vars 2786/2051), certificado ARCA a vencer (var 2925), diferencia de versión (var 2085 → no aplica: hay versión única), agente local caído (vars 2730/2648/2731, vía T06), facturas electrónicas pendientes de CAE (vía M05). | RN-09 §5.6, §5.8 | Estándar | O1 | Reemplazado por RF-PLA-089 | Reglas precargadas `PLA-ALR-*` en §7.11. |
| RF-PLA-094 | El tablero del tenant (GOB-002) y los tableros de responsables de área se especifican en T10; PLA aporta el motor de alertas y el indicador “configuraciones pendientes” del checklist. | GOB-002, BASE §54 Vista Tenant / Responsables | Estándar | O1 | Adoptado (delegado T10) | El indicador "configuraciones pendientes" que expone PLA coincide con los ítems `pending`/`failed` del checklist del tenant; el tablero se acepta con los criterios de RF-BIA-049 y RF-BIA-050 de T10. |
| RF-PLA-095 | **Auditoría de cada cambio** de entidades de PLA con valores previos y posteriores (mecanismo genérico en T02). | GOB-004, BASE §54 Registro de auditoría | Núcleo | O0 | Informado | Todas las colecciones de PLA usan el plugin de auditoría; los secretos nunca aparecen en antes/después. |

### 5.I. Soporte de plataforma y acceso temporal auditado (AGR-034, BASE §64.5)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-096 | La cooperativa registra una **incidencia de plataforma** y recibe una referencia de seguimiento (SUP-AAAA-NNNNN). | SaaS-005, BASE §64.5, CU-SaaS-01 | Núcleo | O1 | Informado | SUP-DEMO-001 creado desde el admin de TEN-001 con estado Recibida. |
| RF-PLA-097 | El caso identifica módulo, impacto, contexto autorizado (pantalla, `requestId`, versión, navegador) y evidencias (capturas, archivos) **sin solicitar contraseñas ni secretos**. | BASE §64.5 | Núcleo | O1 | Informado | El formulario adjunta automáticamente el último `requestId` y bloquea campos que parezcan contraseñas/tokens (detector). |
| RF-PLA-098 | Asignar responsable, prioridad (P1–P4) y estado; conversación e historial de actuaciones; SLA de primera respuesta y resolución por prioridad (valores a acordar). | BASE §64.5, SaaS-005 | Núcleo | O1 | Adoptado (DEC-063) | Cada cambio de estado registra actor y fecha; el SLA se calcula en horario de soporte del contrato. |
| RF-PLA-099 | Comunicar avances, solución y eventual vinculación con un **incidente general** de plataforma (INC-…). | BASE §64.5 | Estándar | O1 | Informado | Al vincular 5 casos a INC-DEMO-001, los 5 reciben la notificación de resolución del incidente. |
| RF-PLA-100 | El soporte de plataforma **no se mezcla** con el CRM de la cooperativa: expedientes, permisos y responsables distintos. | BASE §64.5, CU-SaaS-01 | Núcleo | O1 | Informado | SUP-DEMO-001 no aparece en la bandeja de reclamos de M09 de TEN-001. |
| RF-PLA-101 | **Acceso temporal de soporte**: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. | AGR-034 Propuesta | Núcleo | O1 | Adoptado / A validar (PA-PLA-05) | Sin grant `active` el agente recibe 403; vencido el plazo, el token del agente deja de servir en ≤ 60 s. |
| RF-PLA-102 | Diferenciar **observar** de **operar**: en observar solo lectura y con datos personales enmascarados por defecto; operar y configurar requieren aprobación del administrador del tenant. | AGR-034 | Núcleo | O1 | Adoptado / A validar (PA-PLA-05) | Grant `observe` devuelve DNI/CUIT/email enmascarados; grant `operate` aprobado permite solo las capabilities listadas. |
| RF-PLA-103 | Toda acción en sesión de soporte conserva **identidad del agente y del tenant** (`actorType: 'support'`, `actorUserId`, `supportGrantId`); **sin compartir contraseñas ni impersonación sin rastro**. | AGR-034, RN-09 §4.1 (contraseñas maestras) | Núcleo | O1 | Adoptado | La auditoría de un cambio hecho por soporte muestra “Agente X (soporte) en TEN-001 por SUP-…”. |
| RF-PLA-104 | El tenant consulta todas las intervenciones de soporte (grants, sesiones, acciones) y puede **revocar** un grant activo. | AGR-034 Criterio | Núcleo | O1 | Adoptado | PAN-PLA-18 lista sesiones y enlaza a la auditoría filtrada por `supportGrantId`. |
| RF-PLA-105 | **Break-glass** para incidentes P1: acceso sin aprobación previa del tenant solo con doble aprobación de plataforma (Soporte N2 + Seguridad), duración máxima corta y notificación inmediata al tenant. | AGR-034, PA-PLA-05 | Estándar | O1 | A validar (PA-PLA-05) | Grant break-glass con un solo aprobador es rechazado; el administrador del tenant recibe notificación en ≤ 1 min. |
| RF-PLA-106 | Soporte sin acceso permanente: no se concede a todo soporte acceso a todas las cooperativas. | AGR-034 Ejemplo | Núcleo | O1 | Adoptado | No existe capability `pla.soporte.accesoDatos` asignable de forma permanente. |
| RF-PLA-107 | Encuesta de satisfacción al cerrar el caso y métricas de soporte (tiempos, reaperturas) para la plataforma. | BASE §64.7 (relevar problemas de soporte con casos y tiempos) | Extensión | O1 | Adoptado | KPI `SUP-TTR` en §15. |
| RF-PLA-108 | Novedades del proveedor (“Lo nuevo”, notas de versión, avisos de mantenimiento) visibles en el admin del tenant, reemplazando RSS/encuestas/adjuntos del proveedor de ProCoop. | RN-09 §5.6 (RSS de novedades, encuestas), INV frmLoNuevo, frmAdjuntoProcoopar, CAT `PROCOOPAR_ADJUNTOS`, INV frmEncuestas (ProcoopNet) | Estándar | O1 | Reemplazado por RF-PLA-108 | PAN-PLA-19 muestra notas de la versión desplegada y avisos vigentes. |

### 5.J. Ambientes, configuración y pruebas por tenant (BASE §97.9, AGR-035)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-109 | Ambientes separados: `local`, `ci`, `dev`, `staging`, `sandbox`, `demo`, `prod` (§7.10), con datos, secretos, dominios y credenciales de integración propios. | BASE §97.9, AGR-035 | Núcleo | O0 | Adoptado | Un secreto de prod no es legible desde otro ambiente (cuentas/espacios de secretos separados). |
| RF-PLA-110 | La **precarga de demostración no existe en producción**: los seeds de demo se niegan a ejecutar si `APP_ENV` es `prod`. | BASE §97.9, CNX §10 V-13 | Núcleo | O0 | Informado | `npm run seed:demo` con `APP_ENV=prod` termina con error y no escribe. |
| RF-PLA-111 | Una cooperativa puede probar una configuración nueva (tarifa, ciclo, regla) en un **entorno de prueba o simulación** antes de publicarla: sandbox gemelo por cooperativa + simulación in situ (T04). | BASE §97.9 | Núcleo | O1 | A validar (PA-PLA-06) | TEN-001 importa en su sandbox el paquete de configuración, simula una facturación y luego promueve el paquete a producción (T04). |
| RF-PLA-112 | En pruebas se **bloquean emisiones y cobros reales**: integraciones forzadas a homologación/mocks, correos redirigidos a lista blanca, sin envíos a socios reales. | AGR-035 Propuesta, AGR-035 Ejemplo (sin credenciales productivas) | Núcleo | O1 | Adoptado | En sandbox no existe forma de configurar credenciales marcadas `production` (validación de la bóveda en T06). |
| RF-PLA-113 | Juego **canónico de datos de prueba** para dos tenants, titulares con domicilio compartido y casos de excepción (ESC-01 a ESC-05). | AGR-035 | Núcleo | O0 | Adoptado | `npm run seed:canonical` carga el juego en `ci`, `dev`, `staging`, `demo`. |
| RF-PLA-114 | Matriz de verificación por entrega: recorridos críticos, permisos negativos, conciliación, interrupción/reintento, vinculada a requisitos, integraciones y versión liberada; un fallo relevante **impide promover** la versión. | AGR-035 Criterio | Núcleo | O0 | Adoptado | El pipeline bloquea la promoción a prod si falla una prueba marcada `gate`. |
| RF-PLA-115 | Versionado de la configuración con fecha de vigencia, aprobación y reversión (mecanismo en T04; PLA aporta el transporte de paquetes entre ambientes). | BASE §97.9, AGR §5.4 | Núcleo | O1 | Adoptado (delegado T04) | Un paquete exportado de sandbox lleva firma, versión de esquema y checksum; prod rechaza paquetes de esquema incompatible. |
| RF-PLA-116 | Datos personales reales no se copian a ambientes no productivos salvo copia **anonimizada** aprobada (PA-PLA-07). | AGR-035, BASE §1 Actualización 0.15 (datos DEMO no difundir) | Núcleo | O1 | A validar (PA-PLA-07) | El job de copia anonimizada reemplaza DNI/CUIT/nombres/emails/teléfonos/domicilios y lo certifica. |

### 5.K. Backups y restauración por tenant (AGR-019)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-117 | **Copias automáticas gestionadas por la plataforma**; el usuario no hace backups. | DFA M1 (Copia de seguridad → plataforma), FIC §22, RN-09 §5.8 | Núcleo | O1 | Reemplazado por RF-PLA-117 | No existe opción de backup en el admin del tenant; PAN-PLA-10 muestra el estado. |
| RF-PLA-118 | Backup continuo con **recuperación a un punto en el tiempo** (snapshot + oplog) del cluster Mongo, con retención `PRM-PLA-012`. | AGR-019, BASE §97.8 Recuperación | Núcleo | O1 | Adoptado | Ensayo restaura a T-30 min en un cluster aislado. |
| RF-PLA-119 | **Backup lógico por tenant** diario (export de todas las colecciones del tenant + manifiesto de objetos), cifrado y con checksum, para restauraciones selectivas y portabilidad. | AGR-019, MER-020 | Núcleo | O1 | Adoptado | JOB-PLA-09 genera `backupRuns` `tenant-logical` por tenant con `status: completed` y checksum verificable. |
| RF-PLA-120 | Almacenamiento de objetos con **versionado**, replicación a otra región/cuenta y bloqueo de objetos (WORM) para documentos fiscales y backups. | AGR-019 (adjuntos), CNX §10 (backups con restauración probada) | Núcleo | O1 | Adoptado | Borrar un PDF de factura no lo elimina de la versión retenida. |
| RF-PLA-121 | **RPO y RTO acordados por proceso**, sin inventar cifras: la plataforma propone valores iniciales y los contrata por tenant. | AGR-019, BASE §97.8 Recuperación | Núcleo | O1 | Adoptado (DEC-063) | Los valores vigentes se muestran en el contrato y en PAN-PLA-10. |
| RF-PLA-122 | **Restauración por tenant** sin retroceder a los demás: restauración del punto en el tiempo en un cluster aislado, extracción del tenant, diferencia contra el estado actual y aplicación controlada (registros puntuales o reemplazo completo del tenant en mantenimiento). | AGR-019 | Núcleo | O1 | Adoptado | Restaurar TEN-001 a T no modifica ningún documento de TEN-002 (verificado por hash de colecciones de TEN-002 antes/después). |
| RF-PLA-123 | Una restauración **no deshace** una emisión fiscal ni un cobro externo ya confirmado: tras restaurar se ejecuta **conciliación** con terceros (CAE emitidos, pagos confirmados, notificaciones enviadas) y se reanudan pendientes sin reenviar. | AGR-019, ESC-04 | Núcleo | O1 (marco) / O4–O5 (ganchos FAC/COB) | Adoptado | Escenario ESC-04 automatizado (§17.6). |
| RF-PLA-124 | La auditoría **no se revierte** con una restauración: los eventos de auditoría posteriores al punto restaurado se conservan y la restauración se registra como operación nueva. | BASE §54 (revertir produce operación nueva), AGR-019 | Núcleo | O1 | Adoptado | Tras restaurar, `auditLogs` posteriores a T siguen consultables. |
| RF-PLA-125 | Restaurar exige **doble aprobación** (Operaciones + Seguridad) y, para reemplazo completo, conformidad del administrador del tenant; queda expediente con motivo, punto, alcance y evidencias. | AGR-019, AGR-034 (expediente), T11 | Núcleo | O1 | Adoptado | Una solicitud con un solo aprobador no pasa a `executing`. |
| RF-PLA-126 | **Ensayos periódicos de restauración** con evidencia: recuperación del tenant, integridad de documentos (hashes de PDFs/XML), conciliación externa; no basta comprobar que existe el archivo. | AGR-019 Criterio, BASE §64.5 (pruebas de recuperación) | Núcleo | O1 | Adoptado | `restoreTests` con resultado y métricas de RTO real cada `PRM-PLA-014` días. |
| RF-PLA-127 | Claves de cifrado (KMS) y bóveda de secretos con su propio respaldo y procedimiento de recuperación; la bóveda usa cifrado por sobre en MongoDB con clave maestra en AWS KMS (DEC-074). | AGR-019 (claves), DEC-074 | Núcleo | O1 | Adoptado | Un ensayo de recuperación incluye descifrar un secreto restaurado en sandbox. |
| RF-PLA-128 | Restauración a sandbox para inspección (“¿qué tenía el tenant ayer?”) sin tocar producción. | AGR-019 | Estándar | O1 | Adoptado | Modo `sandbox-copy` de `restoreRequests` (§8.8). |

### 5.L. Capacidad, rendimiento y aislamiento de carga (AGR-020, BASE §97.8)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-129 | Un lote o una API de BI de un tenant **no degrada a otros**: colas por clase de carga, concurrencia máxima por tenant y por cola, prioridades, rate limiting por tenant y token. | BASE §97.8 Aislamiento de carga, AGR-020 | Núcleo | O1 | Adoptado | Escenario: TEN-001 exporta toda su historia mientras TEN-002 cobra en caja; p95 de la API de caja de TEN-002 se mantiene dentro del objetivo (§17.7). |
| RF-PLA-130 | Separar trabajos pesados del uso interactivo: el API no ejecuta procesos batch; los workers `batch` corren en réplicas separadas de los `integration` y `notifications`. | AGR-020 Propuesta | Núcleo | O0 | Adoptado | Despliegue con `WORKER_QUEUES` por réplica. |
| RF-PLA-131 | Perfil de volumen a relevar y mantener (referencia de DEC-075: tenant estándar 25.000 suministros, grande 150.000; diseño para 100 tenants y hasta 300 sin rediseño): tenants, usuarios, contratos, documentos por ciclo, tamaño de archivos, mensajes, consultas BI, trabajos de fondo; referencia DEMO: ~12.500 comprobantes en una semana de facturación masiva de una cooperativa. | AGR-020, BASE §97.8 Volumen | Núcleo | O1 | Adoptado | Documento `capacity-profile` versionado y usado por las pruebas de carga. |
| RF-PLA-132 | Objetivos de respuesta y ventanas batch acordados (tiempo máximo de un lote de facturación, consulta del socio, emisión fiscal), verificados con pruebas de carga k6 con métricas por tenant; no se promete capacidad ilimitada. | AGR-020 Criterio, BASE §97.8 Rendimiento, CNX §2.1 (k6) | Núcleo | O1 | Adoptado (DEC-063) | Informe de carga por release con p50/p95/p99 por tenant y escenario. |
| RF-PLA-133 | Rate limiting por IP en login, recuperación, IA, uploads y portal del socio; por tenant en API admin; por token en API de terceros. | CNX §10 V-07, CNX §2.5 [MEJORAR] | Núcleo | O0 | Adoptado | 6.º intento de login en 1 min desde la misma IP recibe 429. |
| RF-PLA-134 | Cuotas por tenant de exportaciones concurrentes, tamaño de archivo y almacenamiento. | AGR-020 | Estándar | O1 | Adoptado | `PRM-PLA-025` exportaciones simultáneas por tenant. |
| RF-PLA-135 | Prioridad de colas: operaciones de cobro/caja e integraciones de pago > emisión fiscal > notificaciones > lotes > exportaciones/BI > mantenimiento. | AGR-020 Ejemplo | Estándar | O1 | Adoptado | Configuración de prioridades de BullMQ en `apps/api/src/core/jobs/queues.js`. |

### 5.M. Operación: monitoreo, logs, salud de jobs

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-136 | Logs estructurados JSON (pino) con `requestId`, `tenantId`, `userId` seudonimizado, `module`, `jobId`, `correlationId`; reemplaza `morgan`. | BASE §97.8 Observabilidad, CNX §2.1 | Núcleo | O0 | Adoptado | Cada request produce una línea de acceso y las líneas de negocio correlacionadas. |
| RF-PLA-137 | Métricas (OpenTelemetry/Prometheus): latencia y errores por ruta y tenant, profundidad y edad de colas, jobs fallidos/estancados, lag de outbox, conexiones Mongo, uso de Redis, tamaño de almacenamiento por tenant. | BASE §97.8 Observabilidad | Núcleo | O0 | Adoptado | Panel de operaciones con estas series. |
| RF-PLA-138 | Trazas distribuidas API → outbox → job → integración con el mismo `correlationId`. | AGR-016 (correlación) | Estándar | O1 | Adoptado | Una factura emitida se puede seguir de punta a punta. |
| RF-PLA-139 | Endpoints de salud `/health/live` y `/health/ready` (Mongo, Redis, almacenamiento) para el orquestador; sin datos sensibles. | DEC-004 | Núcleo | O0 | Adoptado | `ready` devuelve 503 si Mongo no es primario alcanzable. |
| RF-PLA-140 | **Salud de jobs**: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; `jobRuns` con progreso visible también al usuario que lanzó el job. | AGR §5.5 (estados observables), INV frmProgressBar_WithLog, frmProcesoAutomatico | Núcleo | O1 | Adoptado | PAN-PLA-09; el usuario de TEN-001 ve el progreso de su lote en su pantalla de origen. |
| RF-PLA-141 | **Bandeja técnica** (`deadLetters`) para eventos/jobs agotados: causa, payload resumido (sin secretos), reintento manual, descarte justificado; los casos con impacto de negocio se muestran también al tenant en su bandeja operativa (T11). | AGR-016 Criterio, AGR §5.5 | Núcleo | O1 | Adoptado | Un evento fallido 10 veces aparece en PAN-PLA-09 y genera alerta. |
| RF-PLA-142 | Estados explícitos **Pendiente, Confirmado, Fallido y Resultado incierto** para integraciones y acciones relevantes; una cola técnica no es la única explicación de un estado de negocio. | AGR §5.5, BASE §102.5.5 | Núcleo | O0 | Adoptado | Enum común `operationStatus` en `packages/shared`. |
| RF-PLA-143 | Errores no controlados se registran en el sistema de errores de la plataforma; **prohibido** enviar excepciones a casillas personales o externas no contratadas. | RN-09 §4.3 (`LogProcoop.txt`, envío por mail, var −1, correo personal hardcodeado), RN-09 §8.6 | Núcleo | O0 | Reemplazado por RF-PLA-143 | Ningún destino de errores fuera de la lista de procesadores contratados. |
| RF-PLA-144 | **Incidentes de plataforma** con severidad, estado, tenants y módulos afectados, mensaje público (página de estado) y postmortem. | BASE §64.5 (respuesta a incidentes) | Estándar | O1 | Adoptado | INC-DEMO-001 visible en página de estado de los tenants afectados. |
| RF-PLA-145 | Retención de logs y métricas parametrizada; los logs no reemplazan la auditoría de negocio (T02). | BASE §97.8 Conservación | Estándar | O1 | Adoptado | `PRM-PLA-044`. |

### 5.N. Actualizaciones sin intervención del usuario

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-146 | Las actualizaciones las despliega la plataforma (CI/CD) sin intervención de usuarios; desaparecen `Version.gzip`, reemplazo de DLLs `_old_`, reinicio de IIS y control de versión al abrir. | DFA M1 (Actualizar → plataforma), RN-09 §5.7, INV frmChequearVersion, frmActualizar, `Inicio_ProCoop.ChequearVersion` | Núcleo | O0 | Reemplazado por RF-PLA-146 | Ningún usuario de tenant ve ni ejecuta una acción de actualización. |
| RF-PLA-147 | **Migraciones de esquema y de catálogos** (parámetros, capabilities, módulos, menú) forman parte del despliegue, idempotentes, ejecutadas por el pipeline, nunca por el primer usuario que entra. | RN-09 §7.9, RN-09 §5.7 (`RequiereChequearEstructura`, var 2085), INV frmProcesos.ChequearEstructura, `Inicio_ProCoop.ChequearEstructura` | Núcleo | O0 | Reemplazado por RF-PLA-147 | `migrations` registra cada script aplicado; reejecutar no cambia nada. |
| RF-PLA-148 | Despliegues sin corte (rolling/blue-green) con migraciones compatibles hacia adelante y atrás (expandir → migrar → contraer). | BASE §58 Operación (versionado, despliegues) | Núcleo | O1 | Adoptado | Durante un despliegue la API responde sin 5xx en prueba de humo continua. |
| RF-PLA-149 | **Anillos de actualización** (interno, piloto, general) y **feature flags** por tenant para habilitar gradualmente funcionalidades; todas las cooperativas corren la misma versión de código. | BASE §58 Operación | Estándar | O1 | A validar (PA-PLA-13) | Una funcionalidad bajo flag se enciende solo para TEN-001 (anillo piloto). |
| RF-PLA-150 | La PWA se actualiza sola (Workbox `autoUpdate`) avisando “Nueva versión disponible” sin perder la cola offline; los payloads offline llevan versión de esquema y el servidor acepta las dos últimas. | CNX §2.1 (`vite-plugin-pwa autoUpdate`), CNX §3.7 (vía T03/M10) | Núcleo | O1 | Adoptado | Un técnico con 20 operaciones en cola actualiza la app y sincroniza sin pérdida. |
| RF-PLA-151 | Ventanas de mantenimiento comunicadas con anticipación por tenant (aviso in-app y email) cuando un cambio lo requiera. | BASE §97.8 Disponibilidad (ventanas de mantenimiento) | Estándar | O1 | Adoptado | Aviso visible `PRM-PLA-046` horas antes. |
| RF-PLA-152 | Notas de versión (“Lo nuevo”) por release, con claves de diccionario, publicadas automáticamente al desplegar. | INV frmLoNuevo, RN-09 §5.6 | Estándar | O1 | Reemplazado por RF-PLA-108 | PAN-PLA-19. |
| RF-PLA-153 | APIs de terceros versionadas (`/api/v1/ext`) con política de deprecación anunciada. | BASE §105 APIs (versiones) | Estándar | O11 | Adoptado (delegado T10) | Se acepta con RF-BIA-076 de T10: un cambio incompatible exige `/api/v2/ext` y la versión anterior responde con cabeceras `Deprecation` y `Sunset`. |
| RF-PLA-154 | Tareas programadas de ProCoop (Agente) se traducen a **jobs programados del servidor** con monitoreo: backup, facturación electrónica pendiente, sincronización web, FTP, actividades, cálculo de variables, CoopOnline, trámites, consultas, capitalización, rendiciones de entes, purga de `AUDIT_MAIL`, aviso de mayoría de edad de adherentes. Cada una se asigna a su módulo dueño. | RN-09 §5.8, RN-09 §7.10, FIC §22, INV abm_TareasProgramadas, abm_TareasProgramadas_Acciones, abm_TareasProgramadas_Desencadenador | Núcleo | O0 (marco) | Reemplazado por RF-PLA-154 | Tabla de reemplazo §19.3. |
| RF-PLA-155 | No existen modos “por línea de comandos” ni ejecución de formularios/funciones por nombre (reflexión): cada proceso batch es un job registrado con contrato explícito. | RN-09 §5.2 (modos 1–12), §5.5 (`Assembly.Load`), INV Funciones.EjecutarFuncion, Program.Main | Núcleo | O0 | Reemplazado por RF-PLA-155 | El registro de jobs rechaza nombres no declarados en manifiestos. |

### 5.O. Salida, portabilidad y residencia de datos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-156 | **Exportación completa del tenant** a pedido del administrador (y obligatoria en la salida): JSON por colección + CSV legibles + documentos (PDF/XML fiscales) + manifiesto con checksums. | MER-020 (portabilidad), AGR-005, AGR-033 (vía T08) | Estándar | O1 | Adoptado | `tenantExports` completado con manifiesto verificable; descarga solo por URL firmada. |
| RF-PLA-157 | **Región de alojamiento** declarada por tenant en el contrato y visible; todos los datos y backups del tenant residen en la región acordada. | MER-020 (dónde residen los datos), BASE §64.4 (regiones no definidas) | Núcleo | O1 | Adoptado (DEC-062) | `tenants.dataRegion` coincide con la región real de almacenamiento (verificación de despliegue). |
| RF-PLA-158 | Período de solo lectura tras el cierre y plazo de conservación antes de la purga, según contrato y normativa. | AGR-004, AGR-005 | Estándar | O1 | A validar (PA-PLA-12) | `PRM-PLA-004`, `PRM-PLA-005`. |
| RF-PLA-159 | Purga definitiva del tenant: colecciones, objetos, cachés, índices de búsqueda, backups lógicos fuera de retención; con certificado de purga. | AGR-033 (vía T08) | Estándar | O1 | Adoptado | JOB-PLA-14 deja 0 documentos con `tenantId` purgado (verificación final). |
| RF-PLA-160 | Exportación de auditoría y registros de acceso del tenant como parte de la salida. | BASE §54 (exportación de auditoría), INV frmBaseDatos.ExportarAuditoriaExcel | Estándar | O1 | Adoptado | Incluida en el manifiesto de salida. |

### 5.P. Mapa de soluciones y entrega

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-161 | Las ocho soluciones de BASE §105 se despliegan como **un solo sistema modular** (DEC-003); cada solución se materializa en módulos de dominio según §7.4.2; el núcleo compartido (tenant, identidad, diccionario, auditoría, catálogo y configuración, auxiliar comercial, eventos) no se duplica. | BASE §105, §106 (decidir sistema modular o componentes), §102.5.1 | Núcleo | O0 | Adoptado | Tabla §7.4.2 sin solución huérfana. |
| RF-PLA-162 | Plan de entrega del piloto (Internet, DEC-005) con matriz de capacidades incluidas/excluidas por ola y criterios de aceptación firmables por rol; plataforma básica y dos tenants de prueba incluidos. | AGR-036, BASE §35, §97.12, §102.7 | Núcleo | O1 | Adoptado | Acta de aceptación de la ola registrada como ítem manual del checklist `tenant.operational`. |
| RF-PLA-163 | Registro único de requisitos con ID estable, origen, estado y criterio de aceptación (este anexo y el maestro aplican la convención de la guía). | AGR-001 | Núcleo | O0 | Adoptado | Ningún requisito de este anexo sin origen. |

### 5.Q. Requisitos no funcionales propios de plataforma

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RNF-PLA-001 | Secretos por ambiente en gestor de secretos (AWS Secrets Manager de referencia) con rotación; nunca en el repositorio, en `.env` mantenidos a mano en servidores ni en imágenes. | CNX §10 V-02, CNX §2.8 (`.env` a mano), CNX §10 Hallazgo propio (token en README), RN-09 §5.3, §7.6 | Núcleo | O0 | Adoptado | Escáner de secretos (gitleaks) en CI bloquea el merge. |
| RNF-PLA-002 | CORS con lista blanca obligatoria; el API no arranca en prod sin ella. | CNX §10 V-04 | Núcleo | O0 | Adoptado | Arranque falla sin `CORS_ALLOWLIST`. |
| RNF-PLA-003 | Sin proxies genéricos de medios (riesgo SSRF); descargas externas solo por conectores con lista de destinos. | CNX §10 V-05 | Núcleo | O0 | Adoptado | No existe ruta `/proxy?url=`. |
| RNF-PLA-004 | Nunca sembrar usuarios demo con clave conocida en entornos expuestos. | CNX §10 V-13 | Núcleo | O0 | Adoptado | RF-PLA-110. |
| RNF-PLA-005 | Conexión a Mongo con identidades de servicio separadas por proceso (api, worker, migraciones, analytics) y mínimo privilegio; TLS obligatorio. | RN-09 §5.3 (mismo usuario SQL para todos), §7.6 | Núcleo | O0 | Adoptado | Usuario `analytics` sin permisos de escritura. |
| RNF-PLA-006 | Cifrado en tránsito (TLS 1.2+) y en reposo (volúmenes, backups, objetos) con claves KMS por ambiente. | RN-09 §5.2 (fuerza TLS 1.2), BASE §60 (vía T08) | Núcleo | O0 | Adoptado | Verificación de configuración en despliegue. |
| RNF-PLA-007 | Hora del servidor sincronizada (NTP); las operaciones usan la hora del servidor, nunca la del puesto. | RN-09 §5.2 (control de desfase de reloj > 60 min) | Núcleo | O0 | Reemplazado por RNF-PLA-007 | — |
| RNF-PLA-008 | Imágenes mínimas (alpine/distroless), usuario no root, SBOM y escaneo de vulnerabilidades en CI. | DEC-004 | Estándar | O0 | Adoptado | Pipeline publica SBOM por imagen. |
| RNF-PLA-009 | Sin despliegue por SSH con `git reset --hard`; despliegue declarativo con imágenes inmutables por digest. | CNX §2.8 | Núcleo | O0 | Adoptado | Ningún servidor de prod tiene el repositorio clonado. |
| RNF-PLA-010 | Timeouts de proxy diferenciados: rutas interactivas cortas; rutas de IA hasta `PRM-PLA-042`; procesos largos siempre como job (no requests de minutos). | CNX §2.8 (timeouts de 7 min por IA) | Estándar | O0 | Adoptado | Ningún endpoint síncrono supera 30 s salvo IA en streaming. |
| RNF-PLA-011 | Disponibilidad mensual objetivo y horario de soporte acordados en contrato y medidos (uptime sintético por tenant). | BASE §97.8 Disponibilidad, §64.5 | Núcleo | O1 | Adoptado (DEC-063) | Informe mensual por tenant. |
| RNF-PLA-012 | Accesibilidad y uso en celulares de gama baja de landing y PWA (objetivo WCAG 2.2 AA; detalle en T03/T08). | BASE §97.8 Accesibilidad, AGR §10 [R1] | Estándar | O1 | Adoptado (delegado T03/T08) | — |
| RNF-PLA-013 | Funcionamiento sin conexión de apps de lectura y técnica (detalle en T03/M03/M10); la plataforma garantiza compatibilidad de versión de la cola offline. | BASE §97.8 Conectividad | Núcleo | O3 | Adoptado (delegado) | RF-PLA-150. |
| RNF-PLA-014 | Plazos de retención de comprobantes, auditoría y datos personales según normativa (detalle en T08); la plataforma los aplica en backups, objetos y purgas. | BASE §97.8 Conservación | Núcleo | O1 | Adoptado (delegado T08) | Políticas de ciclo de vida de buckets por clasificación de archivo. |
| RNF-PLA-015 | Escalado horizontal del API (sin estado en proceso; sesiones y rate limit en Redis) y de workers por cola. | DEC-003, DEC-004 | Núcleo | O0 | Adoptado | Dos réplicas del API detrás del balanceador sin afinidad de sesión. |

### 5.R. Copias entre tenants y plantillas de plataforma (DEC-025, DEC-026)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PLA-164 | **Copia de configuración entre tenants** con autorización explícita del tenant origen: el administrador del tenant origen otorga una autorización registrada (tenant destino, alcance —capacidad o servicio y versión de configuración—, vigencia y motivo), revocable en cualquier momento; la copia la ejecuta un operador de plataforma o el tenant destino desde el tenant `PLATFORM` con un contexto de solo lectura sobre el origen; se copian solo datos de configuración (fichas de servicio, productos, planes, categorías, estados, reglas y parámetros), nunca datos personales, cuentas, contratos, saldos, documentos, credenciales ni claves de integración; el destino recibe la copia como versión en borrador (`configVersions` de T04) que su administrador revisa y publica; la autorización, la lectura y la escritura quedan en `auditLogs` de ambos tenants. El contenido funcional de la copia es de M02 (RF-CAT-104 a 108). | DEC-025; BASE §81; RF-CAT-108 | Núcleo | O2 | Adoptado (DEC-025) | Sin autorización vigente del origen la copia responde 403 y queda auditada en ambos tenants; con autorización, el destino ve un borrador y el origen ve quién leyó qué y cuándo. |
| RF-PLA-165 | **Plantillas de plataforma**: catálogo global del tenant `PLATFORM` de plantillas versionadas (servicios de M02 y otras plantillas de configuración que publiquen los módulos) que no contienen precios, importes, cuadros tarifarios, condiciones reguladas (plazos legales, cargos o topes fijados por el regulador), referencias a tenants ni datos personales; las publica un rol de plataforma con una validación automática que rechaza esos campos; el tenant adopta una plantilla y obtiene una copia propia independiente, en borrador, que completa con sus precios y condiciones; publicar una versión nueva de la plantilla no modifica las copias ya adoptadas (se informa la novedad). | DEC-026; DFA M4 mejora "plantillas reutilizables"; RF-CAT-109 | Estándar | O2 | Adoptado (DEC-026) | Una plantilla con un precio o un cuadro tarifario no se puede publicar; un tenant nuevo adopta "Internet FTTH base" y define sus precios sin afectar a otros tenants. |

---

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PLA-001 | Unidad de aislamiento = tenant = una cooperativa. Toda operación, documento, reporte, exportación, búsqueda, archivo, job, mensaje e integración pertenece a exactamente un tenant (salvo colecciones globales de la lista blanca). | Una base SQL por cooperativa; sin identificador de empresa en tablas transaccionales; datos de empresa en variables 518–527 y 709 (RN-09 §3). | **Reemplazar**: base única con `TenantId` (**DEC-110**). | — | — |
| RN-PLA-002 | El tenant efectivo de un request autenticado es el claim `tid` del token. Si un parámetro de la solicitud referencia otro tenant, se ignora; si referencia un recurso de otro tenant, se responde 404. | Puesto que apunta a varias bases vía varios `Configuracion*.pro` y `frmSelectConfiguracion` (RN-09 §3). | **Reemplazar** (CNX §2.3). | — | — |
| RN-PLA-003 | Un usuario con pertenencia a varios tenants elige el ámbito antes de operar; el token se emite para un solo tenant y los permisos se recalculan al cambiarlo (detalle T02, AGR-006). | Selección de archivo de configuración al iniciar. | **Mejorar** (delegado T02). | — | — |
| RN-PLA-004 | Ninguna consulta a colección de tenant se ejecuta sin contexto de tenant; el error es de desarrollo (falla en pruebas), no se degrada a “todos los tenants”. | — | **Nueva**. | — | — |
| RN-PLA-005 | Un índice único de colección de tenant siempre incluye `tenantId` como primer campo: dos tenants pueden tener el mismo número de socio, de comprobante o de caso. | Códigos únicos por base. | **Replicar** semántica por tenant. | — | — |
| RN-PLA-006 | Los datos de la cooperativa (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) viven en la entidad tenant (identidad) y en T04/M06 (datos fiscales detallados, sucursales, puntos de venta, depósitos); no en variables. **Corregido (DEC-064):** `tenants` guarda los datos de contratación; los datos legales y fiscales básicos de cada persona jurídica viven en `legalEntities` de T04 (la entidad por defecto se crea con el tenant desde esos datos, T04 RF-CFG-135); sucursales en `branches` de T04; puntos de venta y perfil fiscal en M06; logo en T03. | Variables 518–527 y 709 en `Nucleo.Empresa.CrearEmpresa` (RN-09 §3). | **Reemplazar** (RN-09 §7.5). | — | — |
| RN-PLA-007 | El CUIT de un tenant de clase `cooperative` en un ambiente es único entre tenants no purgados de ese ambiente; el sandbox de la misma cooperativa vive en otro ambiente y puede repetirlo. | CUIT (var 519) buscado en la lista de clientes compilada. | **Mejorar**. | — | PA-PLA-14 respondida por DEC-064: un tenant puede tener varias entidades jurídicas con CUIT distintos en `legalEntities` (T04); la unicidad de esta regla aplica al CUIT principal del contrato. |
| RN-PLA-008 | Un módulo solo está disponible si: licencia vigente (fecha actual entre `validFrom` y `validTo`, estado `active`) ∧ activación en modo ≠ `off` ∧ dependencias activas. En `historyReadOnly` solo se permiten acciones `ver` y `exportar`. | Campo `Modulos` del `.pro`; demo de 30 días si el CUIT no figura en la lista (`ValidarVersion`, RN-09 §5.4). | **Reemplazar** por licencias y activaciones auditadas; la “demo de 30 días” se reemplaza por licencias de origen `trial` con `validTo`. | `PRM-PLA-008` (días de prueba por defecto) | — |
| RN-PLA-009 | La licencia no se deriva de datos técnicos (servidor, base) ni se valida en el cliente. | `Licencia` del `.pro` = transformación de `SQLServer + SQLBase` (RN-09 §5.4). | **Reemplazar**. | — | — |
| RN-PLA-010 | Una capacidad pasa a `production` solo con su checklist completo (ítems obligatorios `ok` o `waived` con aprobación) y con el tenant en Listo para habilitar u Operativo. | — | **Nueva** (AGR-004). | — | — |
| RN-PLA-011 | Dispensa (`waived`) de un ítem obligatorio: solo Aprobador comercial + Seguridad para ítems de seguridad; motivo y vencimiento obligatorios; los ítems `noDemoData` y `productionCredentials` **no** son dispensables. | — | **Nueva**. | — | — |
| RN-PLA-012 | Suspender un tenant: (a) bloquea nuevas operaciones del personal según `PRM-PLA-003`; (b) pausa jobs programados del tenant salvo los marcados `legalObligation` (p. ej. informes fiscales comprometidos); (c) mantiene el portal del socio según PA-PLA-04; (d) no modifica contratos, servicios, deudas ni documentos. | — | **Nueva** (AGR-004). | `PRM-PLA-003` | — |
| RN-PLA-013 | Al reactivar, los jobs programados durante la suspensión no se ejecutan en bloque: se listan en la bandeja del tenant para que decida ejecutar, reprogramar o descartar. | — | **Nueva**. | — | — |
| RN-PLA-014 | Cerrar un tenant: En cierre (solo lectura, exportación disponible) durante `PRM-PLA-004` días → Cerrado (sin accesos, datos cifrados retenidos) durante `PRM-PLA-005` días → Purgado con certificado. La cooperativa recibe su exportación antes de Cerrado. | — | **Nueva** (AGR-004, AGR-005). | `PRM-PLA-004`, `PRM-PLA-005` | Plazos legales de conservación (T08). |
| RN-PLA-015 | Un contrato SaaS vencido no suspende automáticamente: genera alerta y tarea comercial; la suspensión es una decisión registrada con motivo. | — | **Nueva** (AGR-004: distinguir situación comercial y disponibilidad). | `PRM-PLA-032` (días de gracia) | — |
| RN-PLA-016 | Superar un cupo blando genera alerta al tenant y a Comercial; superar un cupo duro aplica la política de la dimensión (PA-PLA-10); nunca bloquea operaciones en curso, cobros, consultas del socio ni la emisión de documentos de contratos existentes. | — | **Nueva** (AGR-005). | `PRM-PLA-031` | — |
| RN-PLA-017 | Precios del SaaS: solo se registran si hay decisión comercial expresa; si faltan, el contrato se aprueba con `price: null` y la prefactura muestra “a definir”. | — | **Nueva** (AGR-005). | — | — |
| RN-PLA-018 | Acceso de soporte: requiere caso abierto, modo, alcance mínimo, justificación y vencimiento ≤ `PRM-PLA-009`; observar sin datos personales puede iniciarse con aprobación de plataforma y notificación al tenant; observar con datos personales, operar y configurar requieren aprobación del administrador del tenant (PA-PLA-05). | `frmSoporteIP`, TeamViewer, webchat; contraseñas maestras y contraseña de administrador derivada de la fecha (RN-09 §4.1). | **Reemplazar**. | `PRM-PLA-009`, `PRM-PLA-010`, `PRM-PLA-011` | — |
| RN-PLA-019 | En sesión de soporte las capabilities efectivas son la intersección entre el grant y un techo de soporte (nunca `iam.*` de administración de usuarios ni cambio de credenciales de la bóveda, salvo grant `config` explícito). | — | **Nueva**. | — | — |
| RN-PLA-020 | El vencimiento o revocación de un grant invalida inmediatamente los tokens asociados (lista de revocación en Redis por `supportGrantId`). | — | **Nueva**. | `PRM-PLA-007` | — |
| RN-PLA-021 | Break-glass: solo para incidentes P1; dos aprobadores de plataforma distintos del agente; duración ≤ `PRM-PLA-011`; notificación inmediata al administrador del tenant; revisión posterior obligatoria. | — | **Nueva**. | `PRM-PLA-011` | — |
| RN-PLA-022 | Restaurar no altera hechos externos confirmados: si tras el punto restaurado existen CAE, pagos confirmados o mensajes enviados (registro `integrationOperations` de T06 (antes `externalOperations`) y consultas a terceros), se reconstituyen o concilian, nunca se reenvían. | Backup SQL completo de la base; restauración manual (`GenerarBackup`, `frmRecuperaConfiguracion`). | **Reemplazar** (AGR-019, ESC-04). | — | — |
| RN-PLA-023 | Una restauración completa de un tenant pone al tenant en mantenimiento (solo lectura, jobs pausados), y al terminar la conciliación lo devuelve a su estado previo. | — | **Nueva**. | — | — |
| RN-PLA-024 | La auditoría es de solo agregado: ni las restauraciones ni la purga parcial eliminan eventos de auditoría dentro del período de retención; la purga final del tenant los elimina tras exportarlos. | Auditoría selectiva, purga de `AUDIT_MAIL` por el Agente (RN-09 §4.3, §5.8). | **Mejorar**. | — | — |
| RN-PLA-025 | Toda operación económica o de integración recibe `Idempotency-Key`; la clave se guarda por `{tenantId, scope, key}` con hash del request: mismo hash → misma respuesta; hash distinto → 422. | — | **Nueva** (AGR-016). | `PRM-PLA-026` | — |
| RN-PLA-026 | Un evento se publica solo si su transacción confirma (outbox); un consumidor registra `inboxReceipts {consumer, eventId}` en la misma transacción que su efecto. | — | **Nueva** (AGR-016). | — | — |
| RN-PLA-027 | Reintentos de eventos y jobs con backoff exponencial y jitter hasta `PRM-PLA-027`/`PRM-PLA-028`; agotados, pasan a `deadLetters` y alerta; nunca se descartan en silencio. | Errores a `LogProcoop.txt` y mail (RN-09 §4.3). | **Reemplazar**. | `PRM-PLA-027`, `PRM-PLA-028` | — |
| RN-PLA-028 | Un job recibe siempre `tenantId` (o `scope: 'platform'` declarado); los jobs “por todos los tenants” se implementan como *fan-out*: un job planificador global encola un job por tenant activo con el módulo activado. | Agente único por instalación (RN-09 §5.8). | **Reemplazar**. | — | — |
| RN-PLA-029 | Concurrencia máxima por tenant y cola: si un tenant tiene `PRM-PLA-023` jobs activos en `batch`, sus siguientes jobs esperan aunque haya workers libres; otros tenants no esperan por él. | — | **Nueva** (AGR-020). | `PRM-PLA-022`, `PRM-PLA-023` | — |
| RN-PLA-030 | Archivos: clasificación obligatoria (`publicBrand`, `internal`, `personal`, `fiscal`, `backup`); solo `publicBrand` (logos, splash, íconos de la PWA, imágenes de landing publicadas) puede servirse por CDN público; todo lo demás por URL firmada. | `/uploads` público de Connectia (CNX §10 V-01); archivos en carpetas del servidor (FIC §22); `ADJUNTOS` (CAT §29). | **Reemplazar**. | `PRM-PLA-020`, `PRM-PLA-021` | — |
| RN-PLA-031 | Todo archivo subido pasa por verificación de tipo real (magic bytes), tamaño máximo y antivirus antes de quedar disponible (`scanStatus: clean`). | — | **Nueva**. | `PRM-PLA-021` | — |
| RN-PLA-032 | La IA del alta y de cualquier módulo solo propone; la confirmación es humana y queda auditada con la propuesta original. | Auditoría `AUDIT_IA` (DFA M1); asistente de fórmulas IA (INV frmAsistenteFormulas). | **Replicar y mejorar** (CNX §4.2). | `PRM-PLA-040`, `PRM-PLA-041` | — |
| RN-PLA-033 | Las colas de alta prioridad (cobro, pasarelas) tienen workers reservados que no atienden colas `batch`/`export`. | — | **Nueva** (AGR-020). | `PRM-PLA-022` | — |
| RN-PLA-034 | Ningún ambiente no productivo tiene credenciales productivas de terceros; ningún productivo tiene seeds de demo; el ambiente activo se muestra con banda visible en no productivos (“PRUEBA”, “DEMO”). | Servidores de prueba hardcodeados que alteran datos de empresa (`Nucleo.cs:361–370`). | **Reemplazar**. | — | — |
| RN-PLA-035 | Promoción de configuración sandbox → producción solo mediante paquete versionado y publicación con aprobación (T04); nunca copia directa de base. | — | **Nueva** (AGR-009 vía T04). | — | — |
| RN-PLA-036 | Una misma versión de código en todos los tenants del ambiente; las diferencias funcionales entre tenants se expresan con licencias, activaciones, configuración y feature flags, nunca con ramas por cliente. | Lista de clientes compilada en el ejecutable; casos especiales hardcodeados. | **Reemplazar**. | — | Ver PA-PLA-13. |
| RN-PLA-037 | Migraciones de esquema idempotentes, registradas en `migrations`, ejecutadas por el pipeline antes de activar la nueva versión; el catálogo de parámetros también se migra por scripts idempotentes (como `ChequearVariable`, pero desde el pipeline). | `RequiereChequearEstructura` compara var 2085 y el primer usuario ejecuta `RealizarChequeos` (RN-09 §5.7). | **Reemplazar** (RN-09 §7.9). | — | — |
| RN-PLA-038 | Ninguna funcionalidad se invoca por nombre de tipo/ensamblado; todo comando del menú es una ruta declarada (siteMap) con capability. | Comandos `1-Ensamblado.Namespace.Formulario`, `2-…`, `3-…`, `Tab_<n>` interpretados por reflexión (RN-09 §5.5). | **Reemplazar** (CNX §4.2 menú declarativo). | — | — |
| RN-PLA-039 | Las tareas de fondo que antes corrían en la cooperativa (servicio Windows) corren en la plataforma: cada tarea es un job del módulo dueño, con frecuencia configurable por tenant y monitoreo central. | `clsServicio_Procoop` con acciones y desencadenadores; `abm_TareasProgramadas*`; vigilado por modo 11 (RN-09 §5.8). | **Reemplazar** (FIC §22). | — | — |
| RN-PLA-040 | La sincronización con bases externas para portal/app desaparece: portal y app consumen la misma API. | Sincronización con MySQL para portal y app; `SincronizarPWeb`, `SincronizarTablas` (FIC §22, INV IconoNotificacion, Inicio_ProCoop). | **Reemplazar**. | — | — |
| RN-PLA-041 | Transferencias de archivos con entes por SFTP o API con registro de cada envío (detalle en T06). | `TransferirFTP`, `BorrarAFTP`, publicación web FTP/S3 (`WEB_*` del `.pro`) (FIC §22, RN-09 §5.3). | **Reemplazar** (delegado T06). | — | — |
| RN-PLA-042 | La plataforma no ejecuta en el puesto del usuario ningún componente de gestión; el único software local admitido es el **agente de hardware** (impresoras fiscales, lectores, turnero), registrado por tenant y gestionado en T06 (O10). | `EQUIPOS` (PC, kioscos, impresora, lectores, dispenser) y `abm_Equipos.ValidarLicenciaTap` (CAT §29, INV). | **Mejorar** (DEC-007, delegado T06). | — | — |
| RN-PLA-043 | La edición concurrente se resuelve con control optimista (`version`) y respuesta 409 con los cambios del otro usuario; no hay bloqueo de filas persistente. | `BLOQUEO_FILAS` bloqueo optimista/pesimista en ABM base (RN-09 §4.3, CAT §29). | **Reemplazar** (convención guía §5). | — | — |
| RN-PLA-044 | La integridad referencial entre módulos la garantiza el módulo dueño (validación en su servicio y eventos), no reglas genéricas configurables en tabla. | `INTEGRIDAD` reglas verificadas por el sistema (CAT §29). | **Reemplazar**. | — | — |
| RN-PLA-045 | Cada módulo es dueño exclusivo de sus colecciones; los demás solicitan acciones (comandos de su `index.js`) o consultan proyecciones; nadie escribe estados ajenos. Cerrar un ticket no cambia un contrato ni cancela deuda. | Acceso directo de todas las pantallas a todas las tablas vía EF. | **Reemplazar** (AGR-002). | — | — |
| RN-PLA-046 | Responsables de dato por solución (AGR §5.1): contratación decide sobre contratos (M01/M02), operación confirma actuaciones técnicas (M10), facturación emite documentos (M05), cuenta corriente aplica movimientos (M07), pagos confirma transacciones (M07/T06), contabilidad registra efectos (M15), CRM coordina expedientes (M09). | — | **Adoptar** (BASE §102.5.1). | — | — |
| RN-PLA-047 | El intento fallido relevante se registra distinguido del cambio confirmado; no se confirma un cambio sin su evidencia auditable (transacción con auditoría y outbox). | — | **Adoptar** (BASE §54). | — | — |
| RN-PLA-048 | La identidad de acceso es común; los registros de personas/asociados de cada cooperativa permanecen privados y no se fusionan entre tenants por correo o DNI sin acción autorizada. | — | **Adoptar** (BASE §102.5.2, delegado T02/M01). | — | — |
| RN-PLA-049 | La contraseña SQL, las credenciales SMTP, de publicación web y de prepaga nunca residen en un archivo del puesto; los secretos de tenant viven en la bóveda (T06) y los de plataforma en el gestor de secretos. | `.pro` cifrado con desplazamiento reversible de bytes que contiene contraseña SQL, SMTP, `WEB_*`, licencia (RN-09 §5.3). | **Reemplazar**. | — | — |
| RN-PLA-050 | Los datos personales de la DEMO de ProCoop no se transcriben ni se cargan en ningún ambiente; la precarga usa datos ficticios. | Capturas con datos que parecen reales (BASE Actualización 0.15). | **Adoptar** (guía §2). | — | — |
| RN-PLA-051 | Una copia entre tenants requiere una autorización vigente del tenant origen con alcance que cubra lo copiado; sin ella no hay lectura del origen. La copia nunca transporta datos personales ni datos de operación, y el destino la recibe en borrador. | No existe (cada cooperativa es una base aparte). | **Adoptar** (DEC-025). | PRM-CAT-103 | — |
| RN-PLA-052 | Una plantilla de plataforma no contiene precios, importes ni condiciones reguladas, ni referencias a tenants; la adopción crea una copia independiente del tenant. | No existe. | **Adoptar** (DEC-026). | — | — |

---

## 7. Arquitectura de referencia, stack y modelo de datos de plataforma
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


> Adaptación de las secciones 7–15 a un anexo transversal: la sección 7 contiene la arquitectura técnica completa (7.1–7.10) y el modelo de datos de las colecciones propiedad de PLA (7.11).

### 7.0 Stack vigente y mapeo físico (DEC-111, DEC-112, DEC-110, DIR-13)

| Capa | **Vigente (build GoodApps)** | §7.1–7.10 / RF-PLA (histórico Connectia 04-11) |
|---|---|---|
| Runtime API | **.NET 10**, ASP.NET Core, monolito modular | Node 20 + Express |
| Persistencia | **Azure SQL** + EF Core; esquema **`pla.*`** ([`07` §2.0](07-modelo-relacional-azure-sql.md)) | MongoDB 7 + Mongoose |
| Multitenancy | `TenantId` + filtro global EF; pruebas CI aislamiento | Plugin Mongoose, DEC-002 |
| Colas / jobs | **Azure Queue Storage** + workers .NET idempotentes | BullMQ + Redis |
| Outbox | `pla.OutboxEvents` transacción SQL + relay | `outboxEvents` Mongo + BullMQ |
| Archivos | **Azure Blob** + `pla.StoredFiles` | S3 / MinIO |
| Front | **React 19** + Vite (T03) | Vue 3.5 |
| Auth | **OpenIddict** (T02) | JWT en Node |
| Nube | **Microsoft Azure** Container Apps, Key Vault, App Insights | AWS DEC-004 |
| Observabilidad | OpenTelemetry → Application Insights | Prometheus/CloudWatch |

**Semántica funcional** de RF-PLA (multitenancy, outbox, backups por tenant, olas, licencias) **sin cambio**; sustituyen mecanismos de la columna derecha por los de la izquierda. Detalle campo a campo de plataforma: **`07-modelo-relacional-azure-sql.md` §2.0** + DDL `07-ddl/sql/pla/`.

### 7.1. Stack (DEC-001; versiones de referencia CNX §2.1)

| Capa | Tecnología | Versión de referencia | Origen / decisión |
|---|---|---|---|
| Runtime | Node.js ESM puro (`"type": "module"`) | 20 LTS (imagen `node:20-alpine`) | CNX §2.1 [COPIAR] |
| HTTP | Express | ^4.21 | CNX [COPIAR] |
| Base de datos | MongoDB **replica set** (también en local, nodo único) | 7.x | DEC-001; transacciones multi-documento |
| ODM | Mongoose | ^8.9 | CNX [COPIAR] + plugins de tenancy, auditoría, versión, borrado lógico |
| Validación | Zod, esquemas en `packages/shared/schemas` | 3.x | CNX §2.6 [MEJORAR] |
| Colas | BullMQ + Redis | BullMQ 5 / Redis 7 | CNX §2.6 [MEJORAR] (Redis ya estaba en dependencias sin uso) |
| Auth | JWT access + refresh rotativo hasheado, bcrypt/argon2, 2FA, OIDC | — | CNX §2.5 [COPIAR] (detalle T02) |
| Archivos | SDK S3 (`@aws-sdk/client-s3`) contra S3 o S3-compatible (MinIO en local) | — | CNX §2.6 [MEJORAR]; reemplaza `multer` a disco |
| Mail / Push / WhatsApp / SMS | nodemailer (SES/SMTP), web-push VAPID, Meta Cloud API, Twilio | — | CNX §2.7 [COPIAR] (detalle T09/T06) |
| Excel / PDF | exceljs, pdfkit o HTML→PDF en worker, qrcode | — | CNX §2.1; maestro §5.1 |
| IA | Gateway propio sobre OpenAI/Anthropic por HTTP (`AI_PROVIDER=auto`) | — | CNX §2.1; medición en `aiUsage` |
| Logs | pino (JSON) | — | **Reemplaza** `morgan` (CNX §2.1) |
| Métricas y trazas | OpenTelemetry SDK → colector (Prometheus/Grafana o CloudWatch) | — | BASE §97.8 Observabilidad |
| Tests | Vitest + Supertest + Mongo/Redis reales en contenedor; Playwright; k6 para carga | — | CNX §2.1 (k6), maestro §5.1 |
| Frontends | Vue 3.5 + Vite 6 + Pinia 2 + Vue Router 4 + Tailwind 3.4 + axios; `vite-plugin-pwa` | — | CNX §2.1 [COPIAR] |
| Mapas | Leaflet (OSM) | ^1.9 | CNX §2.1 |
| Contenedores | Docker multi-stage, docker compose en local | — | DEC-004, CNX §2.8 |
| Referencia nube | AWS: ECS Fargate (o EKS), MongoDB Atlas sobre AWS o replica set autogestionado, ElastiCache Redis, S3 + CloudFront, Secrets Manager + KMS, SES, ALB + WAF, CloudWatch/OTel | — | DEC-004; agnóstico: cualquier orquestador de contenedores, Mongo 7 RS, Redis 7, almacenamiento S3-compatible |

Sin librerías de componentes UI de terceros, de íconos, de gráficos ni de i18n (CNX §2.1): design system propio (T03).

### 7.2. Principios del monolito modular (DEC-003, AGR-002, AGR §5.1–5.5)

| ID | Principio | Implementación verificable |
|---|---|---|
| ARQ-PLA-01 | Un proceso API, N procesos worker, mismo código. | `apps/api` y `apps/worker` importan los mismos módulos de `apps/api/src/modules`. |
| ARQ-PLA-02 | Cada módulo es dueño exclusivo de sus colecciones (maestro ARQ-01). | El registro de modelos asocia cada colección a un `moduleCode`; `check:boundaries` prohíbe importar `modules/<x>/model` desde fuera de `<x>`. |
| ARQ-PLA-03 | Comunicación entre módulos: **comandos síncronos** a través de `modules/<x>/index.js` (en la misma transacción si el llamador pasa `session`) o **eventos asíncronos** vía outbox. | Lista de exportaciones de `index.js` documentada en el manifiesto. |
| ARQ-PLA-04 | Lecturas cruzadas por **proyecciones** o consultas del servicio dueño; nunca `$lookup` a colecciones de otro módulo. | Lint de pipelines. |
| ARQ-PLA-05 | Separación lógica ≠ bases o servidores separados (AGR §5.1): todo en la base única. | — |
| ARQ-PLA-06 | Sin event sourcing completo: estado actual + auditoría + outbox (AGR §5.3). | — |
| ARQ-PLA-07 | Estados observables Pendiente/Confirmado/Fallido/Resultado incierto (AGR §5.5). | Enum común. |
| ARQ-PLA-08 | Configuración por versiones publicadas (AGR §5.4) — T04. | — |
| ARQ-PLA-09 | Identidad de acceso común y relación de negocio separada (AGR §5.2) — T02/M01. | — |
| ARQ-PLA-10 | Autogestión con una tarea principal clara por pantalla (AGR §5.6) — T03/M19. | — |
| ARQ-PLA-11 | Ningún proceso masivo en el request HTTP (maestro ARQ-03). | Lint: rutas sin bucles sobre colecciones; procesos > `PRM-PLA-045` ítems → job. |
| ARQ-PLA-12 | Si en el futuro un módulo necesita escalar aparte, se extrae su worker/cola primero; la frontera por `index.js` + eventos permite extraerlo sin reescribir consumidores. | — |

### 7.3. Árbol de carpetas del monorepo

Se adapta la estructura de Connectia (`connectia/backend`, `frontend`, `admin`, `contracts`) a la del maestro §5.2, ampliada:

```
goodapps-coop/
├─ package.json                  # workspaces npm: apps/*, packages/*; scripts raíz (lint, test, check:*, gen:module)
├─ .nvmrc  .editorconfig  .gitignore  .gitleaks.toml
├─ dependency-cruiser.cjs        # reglas de fronteras entre módulos (ARQ-PLA-02/03/04)
├─ .github/workflows/            # ci.yml (lint, check, test, build, scan, sbom), release.yml (promoción por digest)
├─ apps/
│  ├─ api/
│  │  ├─ package.json
│  │  └─ src/
│  │     ├─ server.js            # solo arranque HTTP (sin schedulers)
│  │     ├─ app.js               # Express: middlewares y montaje de routers declarados por manifiestos
│  │     ├─ config/              # carga y validación Zod de variables de entorno por ambiente
│  │     ├─ core/
│  │     │  ├─ context/          # AsyncLocalStorage: tenantId, userId, actorType, requestId, correlationId, supportGrantId
│  │     │  ├─ tenancy/          # plugin Mongoose, runAsPlatform, lista blanca de colecciones globales, check de índices
│  │     │  ├─ db/               # conexión, withTransaction, plugins version/softDelete/timestamps/actor, readPreference analytics
│  │     │  ├─ audit/            # plugin de auditoría (colección auditLogs es de iam)
│  │     │  ├─ http/             # requestId, auth, requireCapability, requireModule, scope, rateLimit, idempotency, zodValidate, problemJson
│  │     │  ├─ outbox/           # modelo outboxEvents, publish(), relay, inboxReceipts, deadLetters
│  │     │  ├─ jobs/             # queues.js (clases y prioridades), defineJob(), jobRuns, semáforo por tenant, fan-out
│  │     │  ├─ storage/          # adaptador S3, claves por tenant, URL firmadas, storedFiles, antivirus
│  │     │  ├─ cache/            # cliente Redis, key() con prefijo t:/p:, invalidación por versión
│  │     │  ├─ search/           # helper de búsqueda tenant-scoped (texto/regex/índices); interfaz para motor externo futuro
│  │     │  ├─ ai/               # gateway IA: proveedores, plantillas de prompt, redacción de datos, medición aiUsage
│  │     │  ├─ observability/    # pino, OpenTelemetry, métricas, health
│  │     │  ├─ errors/           # errores tipados → RFC 9457
│  │     │  └─ registry/         # carga y validación de manifiestos, inventario de rutas, capabilities, eventos, jobs
│  │     ├─ modules/
│  │     │  ├─ pla/              # este anexo (estructura tipo, se repite en cada módulo)
│  │     │  │  ├─ index.js       # API pública: getEffectiveModules, getTenant, checklist hooks, alert API, files API
│  │     │  │  ├─ manifest.js    # code 'pla', collections, capabilities, events, jobs, params, siteMap, checklistProviders
│  │     │  │  ├─ model/         # tenant, moduleCatalog, platformPlan, tenantLicense, tenantModuleActivation, tenantChecklist,
│  │     │  │  │                 # onboardingDraft, saasContract, usageSnapshot, supportCase, supportCaseMessage,
│  │     │  │  │                 # supportAccessGrant, supportSession, platformIncident, alertRule, alert, backupPolicy,
│  │     │  │  │                 # backupRun, restoreRequest, restoreTest, tenantExport, release, featureFlag, healthSnapshot, aiUsage
│  │     │  │  ├─ domain/        # máquinas de estado (tenant, activation, grant, restore, contract), evaluador de checklist,
│  │     │  │  │                 # cálculo de módulos efectivos, evaluador de cupos, deduplicación de alertas
│  │     │  │  ├─ service/       # tenants, onboarding, licensing, contracts, usage, support, grants, alerts, backups,
│  │     │  │  │                 # restores, exports, sandboxes, releases, flags, health, dashboard
│  │     │  │  ├─ adapters/      # proveedor de backups (Atlas API / mongodump), página de estado, ChatOps
│  │     │  │  ├─ routes/        # platform.routes.js (/api/platform), admin.routes.js (/api/admin/pla), public.routes.js
│  │     │  │  ├─ events/        # handlers: iam.user.mfaEnabled, cfg.package.published, mig.openingBalances.approved…
│  │     │  │  ├─ jobs/          # JOB-PLA-01…JOB-PLA-20
│  │     │  │  ├─ seeds/         # catalog.seed.js (moduleCatalog, planes, reglas de alerta: siempre), demo.seed.js (nunca en prod)
│  │     │  │  ├─ migrations/    # 0001-platform-tenant.js, 0002-module-catalog.js, …
│  │     │  │  └─ tests/         # unit (domain), integration (service+Mongo), tenancy, permissions, contract
│  │     │  ├─ iam/  uxd/  cfg/  int/  mig/  wfl/  com/  bia/
│  │     │  └─ per/  cat/  med/  tar/  fac/  fis/  cob/  mor/  crm/  tec/  ven/  cmp/  stk/  tes/  con/  sue/  ins/  soc/  por/
│  │     └─ tests/               # e2e de API, suite de aislamiento multitenant (recorre registry), contrato OpenAPI
│  ├─ worker/
│  │  └─ src/
│  │     ├─ main.js              # levanta workers según WORKER_QUEUES (interactive,integration,events,notifications,batch,export,ai,maintenance)
│  │     ├─ scheduler.js         # job schedulers de BullMQ declarados en manifiestos (una sola instancia líder)
│  │     └─ outbox-relay.js      # relay de outbox (change stream + sondeo de respaldo)
│  ├─ admin/                     # SPA admin (AdminShell) + rutas meta.platformOnly / meta.tenantOnly
│  │  └─ src/
│  │     ├─ app/  router/  stores/  api/        # cliente axios único (Bearer, refresh compartido, reintento único)
│  │     ├─ layout/                             # AdminShell, AdminStickyHeader, ScreenHelp, SiteMap (T03)
│  │     ├─ siteMapGroups.js                     # menú declarativo único, compone los siteMap.js de cada módulo
│  │     └─ modules/<cod>/{pages,components,stores,api,siteMap.js}
│  ├─ pwa/                        # AppShell, landing por rol, branding runtime, manifest dinámico, cola offline IndexedDB
│  │  └─ src/modules/<cod>/{pages,components,stores,api,tabs.js}
│  └─ landing/                    # sitio público por tenant (prerender opcional), consume /api/public/<tenantSlug>
├─ packages/
│  ├─ shared/
│  │  ├─ schemas/<cod>/           # Zod compartidos backend/frontend (contratos de API y de eventos)
│  │  ├─ money/                   # decimal.js, redondeo por concepto, DECIMAL(18,4) <-> Decimal
│  │  ├─ dates/                   # UTC, zona del tenant, dd-mm-yyyy, calendarios
│  │  ├─ enums/                   # operationStatus, estados comunes, clases de archivo
│  │  ├─ capabilities/            # catálogo de capabilities generado desde manifiestos
│  │  └─ events/                  # catálogo de tipos de evento y versiones
│  ├─ ui/                         # design system: tokens, DataTable, ExcelImportWizard, modales sm/md/lg/xl, toasts, ConfirmDialog
│  ├─ dictionary/                 # claves base del diccionario y resolutor runtime (T03)
│  └─ connectors/                 # SDK de conectores de integración (T06)
├─ infra/
│  ├─ docker/Dockerfile           # multi-stage, targets: api, worker, admin, pwa, landing
│  ├─ compose/docker-compose.yml  # mongo (rs), redis, minio, mailpit, clamav, api, worker, admin, pwa, landing, nginx
│  ├─ nginx/                      # proxy local: /api → api; /admin/ → admin; /app/ → pwa; / → landing
│  ├─ aws/                        # IaC de referencia (Terraform/CDK): red, ECS, ALB/WAF, S3, CloudFront, KMS, Secrets, ElastiCache
│  └─ scripts/                    # migrate.js, seed.js (bloqueo en prod), restore-tenant.js, export-tenant.js
└─ docs/
   ├─ especificacion/             # esta especificación
   └─ adr/                        # registros de decisiones de arquitectura (ADR-0001 monolito modular, …)
```

### 7.4. Módulos de dominio del backend

#### 7.4.1. Lista de módulos con su código

| Código | Módulo | Anexo | Ola inicial | Colecciones principales (dueño) | Equivalente ProCoop (BASE §1 / DFA) |
|---|---|---|---|---|---|
| `pla` | Plataforma SaaS | T01 | O0–O1 | las de §7.11 | Copia de seguridad, Base de datos, Actualizar, licencia (DFA M1) |
| `iam` | Identidad, roles, perfiles, alcance, auditoría | T02 | O0–O1 | `users`, `memberships`, `roles`, `profiles`, `sessions`, `auditLogs`, `apiTokens` | `USERS*`, `PERFILES*`, `MENUVAL`, `AUDITO`, `AUDITORIA` |
| `uxd` | Marca, diccionario, menú y layouts (lado servidor) | T03 | O0 | `tenantBrandings` (CTR-DAT-51), `dictionaryEntries`, `pinnedShortcuts` | `FORMULARIOS_PERSONALIZACIONES`, `VARIABLE_PMOVIL` (textos) |
| `cfg` | Configuración versionada, parámetros, maestros, geografía, entidades jurídicas y sucursales | T04 | O0–O1 | `parameterValues` (alias `tenantParameters`, CTR-DAT-49), `configVersions` (antes citado como `configPackages`), `masterTableDefinitions` (antes `masterTables`), `legalEntities` y `branches` (O0, DEC-064), `workstations`, `geo*`; `pointsOfSale` es de M06 | `VARIABLE`, `PTOVENTA`, maestros geográficos |
| `int` | Marco de integraciones, bóveda, conectores, agente local | T06 | O1 | `integrationProviders`, `integrationConnections` (antes `connectors`), `integrationSecrets` (bóveda de T06, DEC-074; antes `vaultSecrets`, CTR-DAT-72), `integrationOperations` (antes `externalOperations`), `localAgents`, `localAgentCommands` (antes `edgeAgents`) — nombres de T06 y T05 COL-INT-01, 02, 03, 06, 16 y 17 | `WS_KEYS`, `MODEINT`, `EXPORTADOR`, `EQUIPOS` |
| `mig` | Migración y paralelo desde ProCoop | T07 | O11 (ensayos desde O2) | `migrationRuns`, `migrationMappings`, `reconciliations` | — |
| `wfl` | Workflow, autorizaciones, expediente documental | T11 | O1 | `approvalRequests`, `workflows`, `documents`, `entityLinks` | `AUTORIZACIONES`, `ADJUNTOS`, `RELACION_ENTIDADES` |
| `com` | Comunidad y comunicaciones, notificaciones, audiencia | T09 | O0 (notificaciones) / O2 | `posts`, `newsletters`, `communications`, `notifications`, `surveys`, `audiences` | SMS, CMS, `AUDIT_MAIL` |
| `bia` | Reportes, BI, tableros, APIs para terceros | T10 | O11 (tableros base desde O1) | `reportDefinitions`, `biRooms`, `extApiClients` | Power BI (`PERFILES_TABLAS`), informes |
| `per` | Personas, titulares, asociados, cuentas, inmuebles | M01 | O2 | `persons`, `holders`, `accounts`, `properties` | Asociados y usuarios |
| `cat` | Catálogo de servicios, productos, planes | M02 | O2 | `services`, `tenantServices`, `products`, `plans` | Servicios |
| `med` | Medidores, lecturas, consumos | M03 | O7 | `meters`, `readings`, `consumptions` | Consumos |
| `tar` | Tarifas y motor de cálculo | M04 | O4 | `tariffs`, `tariffVersions` | Cuadros tarifarios |
| `fac` | Facturación | M05 | O4 | `billingCycles`, `billingBatches`, `invoices` | Facturación |
| `fis` | Fiscal e impuestos | M06 | O4 | `taxRules`, `fiscalDocuments` | Impuestos, ARCA |
| `cob` | Cuenta corriente y cobranza | M07 | O5 | `ledgerEntries`, `payments`, `cashRegisters` | Cobranzas |
| `mor` | Mora y financiación | M08 | O6 | `dunningRuns`, `paymentPlans` | Créditos |
| `crm` | CRM y atención | M09 | O2 | `cases`, `tickets`, `queues` | Tickets, Turnero, Actividades |
| `tec` | Técnica, campo, redes | M10 | O3 | `workOrders`, `visits`, `networkAssets` | Técnica |
| `ven` | Ventas y POS | M11 | O8 | `quotes`, `sales` | Ventas, POS, R-Pos |
| `cmp` | Compras y proveedores | M12 | O8 | `suppliers`, `purchaseOrders` | Compras |
| `stk` | Stock, activos, fabricación | M13 | O3 (equipos) / O8 | `items`, `stockMoves`, `serialUnits` | Stock |
| `tes` | Tesorería y bancos | M14 | O8 | `bankAccounts`, `treasuryMoves` | Tesorería |
| `con` | Contabilidad | M15 | O5 | `chartOfAccounts`, `journalEntries` | Contabilidad |
| `sue` | Personal y sueldos | M16 | O9 | `employees`, `payrolls` | Sueldos |
| `ins` | Institucional | M17 | O10 | `members`, `capitalMoves`, `assemblies` | Capital, asambleas |
| `soc` | Servicios sociales y flota | M18 | O10 | `socialPlans`, `vehicles` | Servicios sociales, Traslados |
| `por` | Landing, portal y app del socio | M19 | O2 | `portalSessions`, `selfServiceRequests` (proyecciones) | CoopOnline, Web, P-Móvil |

Nota: se agregan `uxd` y `mig` al listado de directorios del maestro §5.2 porque tienen colecciones propias; T05 DAT y T08 NFR no son módulos ejecutables. La lista de colecciones de los módulos distintos de `pla` es indicativa: cada anexo es la fuente de verdad de su modelo.

#### 7.4.2. Materialización del mapa de soluciones (BASE §105) en módulos

| Solución BASE §105 | Módulos del monolito | Límite que se preserva |
|---|---|---|
| 1. ERP de gestión de cooperativas | `per`, `cat`, `med`, `tar`, `fac`, `tec`, `cmp`, `stk`, `con`, `ins`, `sue`, `soc`, `ven`, `tes` | Dueño de contratos, documentos, saldos y asientos; los demás le solicitan acciones (AGR-002). |
| 2. CRM | `crm`, `com` (campañas), `wfl` (bandejas) | Coordina expedientes; no cambia por sí solo contratos ni deudas. |
| 3. Landing y autogestión de cada tenant | `por`, `uxd`, `com` (muro/novedades), apps `landing` y `pwa` | Usa diccionario y marca; consume ERP, CRM y cobranza por sus APIs. |
| 4. Plataforma SaaS | `pla`, `iam`, `uxd`, `cfg`, núcleo `core/*` | Comparte capacidades sin mezclar datos; soporte temporal y auditado. |
| 5. Sistema de cobranza | `cob`, `mor` | Registra cobros e imputaciones; la emisión pertenece a `fac`. |
| 6. Pasarelas de pago | `int` (conectores) + `cob` (confirmación, conciliación) | No guarda tarjetas; pago incierto no se reenvía sin conciliar. |
| 7. Liquidación de impuestos | `fis` (+ `sue` para obligaciones laborales) | Calcula y prepara; la presentación es del contribuyente. |
| 8. Sistema de APIs | `bia` (APIs de terceros) + `int` (entrantes) + `core/http` | Respeta dueño de dato y aislamiento; no saltea controles del ERP. |
| Núcleo compartido | `core/*`, `pla`, `iam`, `uxd`, `cfg`, `wfl`, `cob` (auxiliar comercial), outbox | Cada solución lo consume, no lo duplica (BASE §105). |

#### 7.4.3. Manifiesto de módulo (contrato)

| Campo | Tipo | Descripción |
|---|---|---|
| `code` | string | Código de 3 letras minúsculas (`pla`). |
| `annex` | string | `T01`. |
| `dependsOn` | string[] | Módulos cuyo `index.js` puede importar. |
| `collections` | `{ name, tenancy: 'tenant'\|'global', owner: true }[]` | Colecciones propias. |
| `capabilities` | `{ key, label: dictKey, actions[] , moduleCode }[]` | Capabilities `cod.recurso.accion`. |
| `sellableModule` | string | Código del `moduleCatalog` del que cuelga (para `pla` = `core.platform`, no vendible). |
| `events.emits` / `events.consumes` | `{ type, version, schema }[]` | Contratos de eventos. |
| `jobs` | `{ name, queue, scope: 'tenant'\|'platform', schedule?, legalObligation? }[]` | Jobs registrados. |
| `params` | `PRM-*` declarados en T04 | Parámetros del módulo. |
| `routes` | `{ base, file, audience: 'platform'\|'admin'\|'app'\|'public'\|'ext' }[]` | Routers montados. |
| `siteMap` | ítems de menú con capability | Consumido por `siteMapGroups` (T03). |
| `checklistProviders` | `{ capabilityCode, items: [{ code, mandatory, waivable, evaluate(tenantId) }] }` | Ítems automáticos de habilitación. |
| `restoreHooks` | `{ reconcileAfterRestore(tenantId, since) }` | Conciliación posrestauración (AGR-019). |
| `exportHooks` | `{ exportTenant(tenantId, writer) }` | Exportación de salida (RF-PLA-156). |
| `purgeHooks` | `{ purgeTenant(tenantId) }` | Purga (RF-PLA-159). |
| `usageMeters` | `{ dimension, measure(tenantId, day) }` | Medición de uso (RF-PLA-079). |

### 7.5. Núcleo compartido (`apps/api/src/core`) y packages

| Componente | Responsabilidad | Ola |
|---|---|---|
| `core/context` | Contexto de ejecución por request/job (RF-PLA-021). | O0 |
| `core/tenancy` | Plugin de tenancy (RF-PLA-020), `runAsPlatform` (RF-PLA-022), lista blanca (RF-PLA-023), `check:indexes` (RF-PLA-018). | O0 |
| `core/db` | `withTransaction(fn)` con reintento de errores transitorios (`TransientTransactionError`, `UnknownTransactionCommitResult`); plugins `version` (control optimista), `actor` (`createdBy`/`updatedBy`), `softDelete` (`deletedAt`; prohibido en documentos económicos). | O0 |
| `core/audit` | Plugin que genera evento de auditoría con antes/después, filtrando campos `secret: true` (T02). | O0 |
| `core/http` | Middlewares: `requestId`, `authenticate`, `tenantContext`, `requireModule(code)`, `requireCapability(key)`, `scope`, `rateLimit`, `idempotency`, `zodValidate`, `problemJson`, `supportSessionGuard`. | O0 |
| `core/outbox` | `publish(event, { session })`, relay, `inboxReceipts`, `deadLetters` (§7.6). | O0 |
| `core/jobs` | `defineJob()`, colas por clase, `jobRuns`, semáforo por tenant, fan-out (§7.6). | O0 |
| `core/storage` | Claves por tenant, URL firmadas, `storedFiles`, antivirus (§7.7). | O0 |
| `core/cache` | Prefijos `t:<tenantId>:`/`p:` (RF-PLA-026). | O0 |
| `core/search` | Búsqueda tenant-scoped (RF-PLA-028). | O0 |
| `core/ai` | Gateway IA con aislamiento y medición (RF-PLA-029). | O1 |
| `core/observability` | Logs, métricas, trazas, health (RF-PLA-136 a RF-PLA-139). | O0 |
| `core/registry` | Manifiestos e inventarios (RF-PLA-005). | O0 |
| `packages/shared` | Esquemas Zod, money, dates, enums, capabilities, catálogo de eventos. | O0 |
| `packages/ui` | Design system y componentes genéricos (T03; `DataTable`, `ExcelImportWizard`, toasts, `ConfirmDialog` son [MEJORAR] de CNX §4.6). | O0 |
| `packages/dictionary` | Claves y resolutor (T03). | O0 |
| `packages/connectors` | SDK de conectores (T06). | O1 |

### 7.6. Outbox, eventos y workers BullMQ

**Modelo de entrega:**

1. El servicio del módulo hace el cambio y llama `publish()` con la misma `session`: se inserta en `outboxEvents` (`status: pending`).
2. `outbox-relay` (proceso del worker, instancia única por elección de líder con lock Redis) escucha el change stream de `outboxEvents` y, de respaldo, sondea cada `PRM-PLA-029` ms los `pending` con `nextAttemptAt <= now`.
3. Por cada suscriptor registrado para el `type`, encola en la cola `events` un job con `jobId = <eventId>:<consumer>` (deduplicación de BullMQ) y marca el evento `published`.
4. El handler del consumidor corre con el contexto del evento (`TenantId`, `correlationId`, `causationId = eventId`), aplica su efecto e inserta `inboxReceipts {consumer, eventId}` en la misma transacción; si ya existía, termina sin efecto.
5. Fallos: reintento con backoff exponencial y jitter (`PRM-PLA-027`); agotado → `deadLetters` + alerta `PLA-ALR-06`.

**Colas (clase de carga) y prioridades:**

| Cola | Contenido | Prioridad | Concurrencia global (default) | Concurrencia por tenant (default) |
|---|---|---|---|---|
| `interactive` | Trabajos cortos disparados por un usuario (PDF individual, validación de padrón, propuesta IA). | 1 | 20 | 4 |
| `integration` | Pasarelas, ARCA, redes de cobro, aprovisionamiento. Workers reservados (RN-PLA-033). | 1–2 | 20 | 4 |
| `events` | Consumidores de eventos de dominio. | 2 | 30 | 6 |
| `notifications` | Email, push, WhatsApp, SMS. | 3 | 20 | 5 |
| `batch` | Lotes de facturación, mora, recálculos, importaciones. | 4 | 8 | `PRM-PLA-023` (2) |
| `export` | Exportaciones, reportes pesados, BI programado, exportación de salida. | 5 | 4 | `PRM-PLA-025` (1) |
| `ai` | Llamadas IA no interactivas. | 5 | 6 | 2 |
| `maintenance` | Backups lógicos, purgas, limpieza, ensayos de restauración, medición de uso. | 6 | 2 | 1 |
| — (sin cola; excepción explícita) | JOB-PLA-01 `pla:outbox-relay`: proceso dedicado del worker que lee `outboxEvents` y alimenta la cola `events`; no es un job de BullMQ (ver la nota siguiente y §12) | — | 1 instancia por elección de líder | — |

**Excepción a las clases de cola:** JOB-PLA-01 `pla:outbox-relay` no corre en ninguna cola de BullMQ. Es un proceso dedicado del worker, de instancia única por elección de líder (paso 2), que lee `outboxEvents` y **alimenta** la cola `events`. Por eso no tiene prioridad ni concurrencia por tenant; se monitorea por el lag de outbox (alerta PLA-ALR-05) y por `healthSnapshots`. Ningún otro job puede declararse fuera de estas ocho clases.

**Reglas de jobs:** nombre `<modulo>:<proceso>`; `jobRuns` con `{tenantId, jobName, jobId (antes bullJobId), status: queued|running|paused|succeeded|failed|cancelled|uncertain, progress {done,total}, cursor, requestedBy, startedAt, finishedAt, summary, error}`; idempotencia por `jobKey` de negocio (ej. `fac:emitir-lote:<batchId>`); cancelación cooperativa (el handler revisa `cancelRequested` entre ítems); reanudación desde `cursor`; jobs programados por tenant mediante *fan-out* (RN-PLA-028); el `scheduler` es una única instancia líder.

### 7.7. Almacenamiento de objetos

| Aspecto | Especificación |
|---|---|
| Buckets por ambiente | `ga-<env>-private` (documentos, adjuntos, fotos), `ga-<env>-public-brand` (solo clase `publicBrand`, detrás de CDN), `ga-<env>-exports` (ciclo de vida `PRM-PLA-024` días), `ga-<env>-backups` (cuenta/región separada, Object Lock). |
| Clave de objeto | `tenants/<tenantId>/<moduleCode>/<entityType>/<yyyy>/<mm>/<uuidv7>.<ext>`; plataforma: `platform/<area>/…`. |
| Metadatos | Colección `storedFiles` (§7.11.25). |
| Subida | `POST /api/files/uploads` → URL firmada de subida (PUT) con tipo y tamaño máximos → callback de confirmación → job antivirus → `scanStatus: clean`. |
| Descarga | `GET /api/files/:id/url` → el módulo dueño confirma permiso (`canAccessFile`) → URL firmada GET de `PRM-PLA-020` s. |
| Versionado y WORM | Versionado habilitado en `private` y `backups`; Object Lock en clase `fiscal` y `backup` por el plazo de retención (T08). |
| Cifrado | SSE-KMS con clave por ambiente. |
| Reemplaza | `/uploads` público de Connectia (CNX §10 V-01), archivos en carpetas del servidor y servidor de archivos de ProCoop (FIC §22, RN-09 §5.3 rutas), `ADJUNTOS` (CAT §29) → metadatos en `storedFiles` + expediente en T11. |

### 7.8. Multitenancy técnico (detalle de implementación)

| Superficie | Mecanismo | Prueba obligatoria (§17.2) |
|---|---|---|
| Token | Claim `tid` (tenantId), `tcode`, `mv` (modulesVersion), `act` (actorType), `sgid` (supportGrantId si aplica). | Token alterado → 401. |
| Request | `tenantContext` toma `tid`; prohíbe `TenantId` en body/query salvo rutas `/api/platform` que lo reciben como **objeto de gestión** (no como contexto). | Body con `TenantId` ajeno ignorado. |
| Público | `/api/public/:tenantSlug/*` resuelve tenant por slug/host; solo datos `public` (branding, servicios publicados, noticias públicas). | Slug inexistente → 404 genérico. |
| Mongoose | Plugin de tenancy (RF-PLA-020). | Consulta sin contexto → error. |
| Agregaciones | Filtro inyectado como primer `$match`; `$lookup`/`$unionWith`/`$graphLookup` deben incluir `TenantId` (lint + verificación en runtime en desarrollo). | Pipeline sin filtro en `$lookup` falla en CI. |
| Índices | Primer campo `TenantId` (RF-PLA-018). | `check:indexes`. |
| Transacciones | La sesión hereda el contexto; una transacción no puede mezclar tenants (verificación en `withTransaction`). | Escritura de dos tenants en una sesión → error. |
| Outbox/eventos | `TenantId` obligatorio en el sobre; el consumidor ejecuta con ese contexto. | Evento sin tenant (salvo `scope: platform`) rechazado. |
| Jobs | `TenantId` en payload; semáforo por tenant. | Job de A no lee B. |
| Archivos | Prefijo + `storedFiles.tenantId`. | URL de B con token de A → 404. |
| Caché | Prefijo `t:<tenantId>:`. | Colisión de ids. |
| Exportaciones | Job + prefijo + permiso. | Descarga cruzada. |
| Búsquedas | Filtro de tenant en helper. | “Pérez” cruzado. |
| IA | Contexto armado solo con datos del tenant; sin caché compartida; `aiUsage` por tenant. | Inspección del prompt. |
| Logs/métricas | `TenantId` en cada línea; sin PII. | Escáner de logs. |
| Rate limit | Claves por IP, por tenant y por token. | 429 independiente por tenant. |
| Notificaciones | Remitente, plantillas y credenciales por tenant (T09/T06). | Plantilla de A no usable en B. |
| Webhooks | Ruta firmada por tenant (T06). | Firma de A en ruta de B rechazada. |
| Backups/restore | Backup lógico y restauración por `TenantId` (§9.7). | Hash de B inalterado tras restaurar A. |
| BI/analytics | Réplica `analytics` con el mismo plugin; ningún cubo mezcla tenants salvo métricas técnicas de plataforma agregadas sin PII. | Consulta BI de A no devuelve B. |

### 7.9. Tenant `PLATFORM`

- Documento `tenants` con `kind: 'platform'`, `code: 'platform'`, creado por la migración `0001-platform-tenant.js`; no puede suspenderse, cerrarse ni purgarse.
- Sus usuarios (T02) se autentican en el admin con el código de tenant `platform`; el AdminShell carga la estética diferenciada y las rutas `meta.platformOnly` (maestro §10).
- Las colecciones de PLA con `TenantId` (licencias, activaciones, checklists, contratos, casos, grants, alertas de tenant, backups lógicos, exportaciones) guardan en `TenantId` el **tenant gestionado** y se marcan `ownerScope: 'platform'`: solo rutas `/api/platform` las escriben; las rutas `/api/admin/pla/*` del tenant leen únicamente sus propios documentos y solo los campos permitidos (proyección explícita).
- `PLATFORM` puede usar módulos funcionales para su propia gestión (RF-PLA-040, PA-PLA-08) como un tenant más.

### 7.10. Docker, entornos y despliegue (DEC-004)

**Imágenes (un Dockerfile multi-stage):**

| Target | Base | Contenido | Puerto |
|---|---|---|---|
| `api` | `node:20-alpine` (usuario no root) | `apps/api` + `packages/*` | 4000 |
| `worker` | igual a `api` | `apps/worker` + módulos; `WORKER_QUEUES` define colas | — |
| `admin` | build Vite → `nginx:alpine` (o S3+CloudFront) | `apps/admin` | 8080 |
| `pwa` | build Vite → `nginx:alpine` (o S3+CloudFront) | `apps/pwa`; manifest dinámico servido por el API | 8080 |
| `landing` | build Vite/prerender → `nginx:alpine` | `apps/landing` | 8080 |

**Compose local:** `mongo` (7, `--replSet rs0`, inicialización automática), `redis` (7), `minio` (+ creación de buckets), `mailpit` (correo de prueba), `clamav` (opcional), `api`, `worker`, `admin`, `pwa`, `landing`, `nginx`. Comando único `docker compose up`.

**Enrutamiento por dominio (PA-PLA-11):** `<slug>.<dominio-plataforma>` → `/` landing, `/app/` PWA, `/admin/` admin, `/api` API; dominio propio opcional de la cooperativa (CNAME verificado, TLS automático); consola de plataforma en `plataforma.<dominio-plataforma>/admin/`.

**Ambientes:**

| Ambiente | Propósito | Datos | Integraciones | Despliegue |
|---|---|---|---|---|
| `local` | Desarrollo en la máquina | Juego canónico ficticio | Mocks | `docker compose` |
| `ci` | Pruebas automáticas efímeras | Juego canónico | Mocks | Por pipeline |
| `dev` | Integración continua del equipo | Canónico + datos de desarrollo | Mocks/homologación | Automático desde rama principal |
| `staging` | Preproducción, release candidate, pruebas de aceptación y carga | Canónico + volumen sintético | Homologación | Promoción del digest |
| `sandbox` | Pruebas de configuración de cada cooperativa (tenant gemelo) y homologación con terceros | Ficticios o copia anonimizada aprobada (PA-PLA-07) | Solo homologación | Misma versión que `prod` |
| `demo` | Demostraciones comerciales | Precarga de demostración (§18) | Mocks | Misma versión que `prod` |
| `prod` | Producción | Reales | Producción | Promoción del digest con gates (RF-PLA-114) |

**Pipeline:** lint → `check:structure`/`check:boundaries`/`check:indexes` → unit → integración con Mongo/Redis reales → suite de aislamiento → build de imágenes → SBOM + escaneo → gitleaks → deploy `dev` → deploy `staging` + migraciones + humo + e2e + carga (por release) → aprobación → deploy `sandbox`/`demo`/`prod` por anillos (RF-PLA-149) con migraciones expandir/contraer → humo → notas de versión (RF-PLA-152).

### 7.11. Modelo de datos (colecciones propiedad de PLA)

**Físico vigente:** tablas `pla.*` en Azure SQL (§7.0; inventario §2.0 en `07-modelo-relacional-azure-sql.md`). Las subsecciones 7.11.x describen **semántica lógica** (nombres de colección, tipos documento).

Campos comunes (**vigente**): `TenantId`, auditoría, `RowVersion`. *Histórico:* `TenantId` uniqueidentifier en tablas siguientes; no se repiten en cada subsección.

#### 7.11.1. `tenants` (global)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string (slug `^[a-z0-9-]{3,30}$`) | Sí | Código único, estable; usado en pre-login y URL. |
| `kind` | enum `platform`, `cooperative`, `demo`, `sandbox` | Sí | Clase de tenant. |
| `legalName` | string | Sí | Razón social. |
| `shortName` | string | Sí | Nombre corto visible. |
| `cuit` | string (11 dígitos, dígito verificador) | Sí (salvo `platform`) | CUIT principal. |
| `legalForm` | enum `cooperativa`, `mutual`, `asociacionCivil`, `sociedad`, `otra` | Sí | Forma jurídica. |
| `inaesRegistration` | string | No | Matrícula INAES. |
| `fiscalAddress` | objeto {street, number, city, province, postalCode} | Sí | Domicilio (detalle geográfico normalizado en T04). |
| `contacts` | array {role: `legal`\|`administrative`\|`technical`\|`billing`\|`security`\|`support`, name, email, phone} | Sí (mín. legal, administrativo, técnico) | Contactos de la cooperativa ante la plataforma. |
| `status` | enum `preparing`, `testing`, `readyToEnable`, `operational`, `suspended`, `closing`, `closed`, `purged` | Sí | Ciclo de vida (§8.1). |
| `statusHistory` | array {from, to, at, by, reason, checklistSnapshotId} | Sí | Historial. |
| `suspension` | objeto {reasonCode: `saasDebt`\|`breach`\|`tenantRequest`\|`securityRisk`\|`other`, detail, mode: `readOnlyStaff`\|`blockedStaff`, portalMode (PA-PLA-04), since, scheduledEnd} | Si `suspended` | Datos de suspensión. |
| `closing` | objeto {noticeAt, readOnlyUntil, closedAt, purgeAfter, purgedAt, purgeCertificateFileId} | Si cierre | Datos de salida. |
| `timezone` | string IANA | Sí (default `America/Argentina/Cordoba`) | AGR-017. |
| `locale` | string | Sí (default `es-AR`) | — |
| `currency` | string ISO 4217 | Sí (default `ARS`) | — |
| `dataRegion` | string | Sí | Región de alojamiento (PA-PLA-01). |
| `domains` | array {host, type: `subdomain`\|`custom`, verified, verifiedAt, tlsStatus} | Sí (subdominio) | PA-PLA-11. |
| `releaseRing` | enum `internal`, `pilot`, `general` | Sí (default `general`) | RF-PLA-149. |
| `environmentKind` | enum = ambiente | Sí | Ambiente en el que vive el documento. |
| `productionTenantRef` | {environment, tenantId, code} | Si `sandbox` | Gemelo productivo. |
| `sandboxes` | array {environment, tenantId, status, lastPackageSyncAt} | No | Sandboxes asociados. |
| `saasContractId` | uniqueidentifier → `saasContracts` | Desde Listo para habilitar | Contrato vigente. |
| `modulesVersion` | int | Sí | Se incrementa ante cambios de licencias/activaciones. |
| `onboarding` | objeto {draftId, assignedImplementerId, startedAt, completedAt} | No | — |
| `brandingRef` | uniqueidentifier → `tenantBrandings` (T03) | No | Referencia a T03 (nombre de la colección corregido por CTR-DAT-51). |
| `isDemo` | bool | Sí | true solo en `demo`. |

Índices: `{ code: 1 }` único; `{ cuit: 1, kind: 1, environmentKind: 1 }` único parcial (status ≠ `purged`, kind `cooperative`); `{ status: 1 }`; `{ 'domains.host': 1 }` único. Mapeo ProCoop: `Configuracion*.pro` + variables 518–527 y 709; `EMPRESAS` → `legalEntities` de T04 (DEC-064, PA-PLA-14).

#### 7.11.2. `moduleCatalog` (global)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Ej. `fac`, `svc.internet`, `addon.whatsapp`. Único. |
| `kind` | enum `module`, `serviceVertical`, `addon`, `channel`, `integration`, `core` | Sí | Clase. |
| `label` | dictKey | Sí | `dict:pla.module.<code>`. |
| `description` | dictKey | Sí | — |
| `group` | enum `nucleo`, `comercial`, `operacion`, `economico`, `administracion`, `institucional`, `comunidad`, `analitica`, `servicios`, `canales`, `integraciones` | Sí | Agrupación comercial. |
| `dependsOn` | string[] | No | Dependencias (RF-PLA-071). |
| `packs` | string[] | No | Planes que lo incluyen. |
| `capabilityPrefixes` | string[] | Sí | Capabilities que cuelgan (`fac.`). |
| `meteredDimensions` | string[] | No | Dimensiones de uso que consume. |
| `checklistCode` | string | No | Checklist de habilitación productiva. |
| `minWave` | string `O0`…`O11` | Sí | Ola en la que existe. |
| `status` | enum `draft`, `available`, `deprecated`, `retired` | Sí | — |
| `sellable` | bool | Sí | `core` = false. |

Índice `{ code: 1 }` único. Mapeo ProCoop: `MODULOS` (COD_MOD, DES_MOD, VERSION, CATEGORIA).

**Catálogo inicial (seed):**

| Código | Clase | Dependencias | Checklist |
|---|---|---|---|
| `core.platform`, `core.iam`, `core.uxd`, `core.cfg`, `core.wfl`, `core.notifications` | core | — | `tenant.base` |
| `per` Personas y cuentas | module | core | — |
| `cat` Catálogo de servicios | module | `per` | `chk.cat` |
| `crm` CRM y atención | module | `per` | `chk.crm` |
| `tec` Técnica y campo | module | `per`, `cat` | `chk.tec` |
| `stk.equipos` Equipos serializados | module | `tec` | — |
| `stk` Stock completo y activos | module | — | — |
| `med` Medición | module | `cat` | `chk.med` |
| `tar` Tarifas | module | `cat` | `chk.tar` |
| `fac` Facturación | module | `tar`, `fis` | `chk.fac` |
| `fis` Fiscal | module | — | `chk.fis` |
| `cob` Cuenta corriente y cobranza | module | `fac` | `chk.cob` |
| `mor` Mora y financiación | module | `cob` | `chk.mor` |
| `con` Contabilidad | module | — | `chk.con` |
| `ven` Ventas y POS | module | `cob` | — |
| `cmp` Compras | module | — | — |
| `tes` Tesorería | module | — | — |
| `sue` Sueldos | module | — | `chk.sue` |
| `ins` Institucional | module | `per` | — |
| `soc` Servicios sociales y flota | module | `cat` | — |
| `com.muro`, `com.novedades`, `com.encuestas` | module | `core.notifications` | `chk.com` |
| `bia.salas`, `bia.reportes` | module | — | — |
| `ext.api` APIs para terceros | addon | — | `chk.ext` |
| `mig` Migración ProCoop | addon | — | `chk.mig` |
| `addon.ai` Asistencia IA | addon | — | — |
| `addon.whatsapp`, `addon.sms` | addon | `core.notifications` | `chk.com` |
| `channel.landing`, `channel.pwaSocio`, `channel.pwaEmpleado`, `channel.pwaCampo` | channel | — | `chk.por` |
| `svc.internet`, `svc.electricidad`, `svc.agua`, `svc.gas`, `svc.telefonia`, `svc.tv`, `svc.cementerioParque`, `svc.bancoSangre`, `svc.sepelio`, `svc.salud`, `svc.vivienda`, `svc.otros` | serviceVertical | `cat` (+ `med` para medidos) | `chk.svc` |
| `int.arca`, `int.pasarelas`, `int.redesCobro`, `int.bancos`, `int.aprovisionamiento`, `int.agenteLocal` | integration | según conector | `chk.int` |

#### 7.11.3. `platformPlans` (global)

`code` (único), `label` (dictKey), `modules` (string[]), `defaultQuotas` [{dimension, soft, hard, overagePolicy}], `targetSize` (enum `pequena`, `mediana`, `grande`, `a medida`), `priceRef` (objeto opcional, A validar), `status` (`draft`, `available`, `retired`), `validFrom`, `validTo`. Precarga de planes ilustrativos: `PLAN-BASICO`, `PLAN-ESTANDAR`, `PLAN-TOTAL` (sin precios; PA-PLA-09).

#### 7.11.4. `tenantLicenses`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `moduleCode` | string → `moduleCatalog.code` | Sí | Módulo licenciado. |
| `source` | enum `plan`, `addon`, `trial`, `courtesy`, `pilot` | Sí | Origen. |
| `saasContractId` | uniqueidentifier | Si `plan`/`addon` | Contrato. |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia. |
| `quotaOverrides` | [{dimension, soft, hard}] | No | Cupos específicos. |
| `status` | enum `active`, `expired`, `revoked` | Sí | — |
| `approvedBy`, `approvedAt` | — | Sí | Aprobación. |

Índices: `{ tenantId: 1, moduleCode: 1, validFrom: -1 }`, `{ tenantId: 1, status: 1 }`. `ownerScope: platform`.

#### 7.11.5. `tenantModuleActivations`

`moduleCode`, `mode` (enum `off`, `test`, `production`, `historyReadOnly`), `newSalesBlocked` (bool, servicios verticales), `status` (enum `ok`, `pendingChecklist`, `blocked`), `checklistSnapshotId` (→ `tenantChecklists`, instantánea en `snapshots`), `activatedAt`, `activatedBy`, `reason`, `history` [{mode, at, by, reason}]. Índice único `{ tenantId: 1, moduleCode: 1 }`.

#### 7.11.6. `tenantChecklists`

`capabilityCode` (ej. `tenant.base`, `tenant.operational`, `chk.fac`), `items` [{`code`, `label` dictKey, `source` (`auto`\|`manual`), `mandatory`, `waivable`, `status` (`pending`, `ok`, `failed`, `waived`, `notApplicable`), `detail`, `evidenceFileIds`, `verifiedBy`, `verifiedAt`, `waiver` {reason, approvedBy, expiresAt}}], `overallStatus` (`incomplete`, `complete`), `evaluatedAt`, `snapshots` (referencias a versiones congeladas al usarse en una transición). Índice único `{ tenantId: 1, capabilityCode: 1 }`.

#### 7.11.7. `onboardingDrafts`

`step` (enum `identity`, `contacts`, `brand`, `modules`, `domain`, `admin`, `review`), `data` (objeto del asistente validado por Zod por paso), `aiProposal` {logoFileIds, palette {primary, secondary, accent, contrastReport}, shortName, slugSuggestions, splashFileId, dictionarySuggestions [{key, value}], model, promptVersion, aiUsageId}, `acceptedProposal` (lo confirmado por la persona), `status` (`draft`, `proposed`, `confirmed`, `discarded`, `expired`), `TenantId` (nulo hasta confirmar; se guarda con `tenantId = PLATFORM` mientras es borrador), `expiresAt`. Índice `{ tenantId: 1, status: 1 }`.

#### 7.11.8. `saasContracts`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string `SAAS-AAAA-NNNN` | Sí | Único por plataforma. |
| `planCode` | string | Sí | Plan. |
| `addons` | string[] | No | Complementos. |
| `quotas` | [{dimension: `activeServiceContracts`\|`internalUsers`\|`storageGb`\|`messagesMonth`\|`extApiCallsMonth`\|`aiTokensMonth`\|`sandboxes`, soft, hard, overagePolicy: `notify`\|`blockNew`\|`charge` (PA-PLA-10)}] | Sí | Cupos. |
| `validFrom` / `validTo` | Date | Sí | Vigencia. |
| `autoRenew` | bool | Sí | — |
| `billing` | {cycle: `monthly`\|`annual`, currency, priceRef (A validar), invoicingMode (PA-PLA-08)} | No | — |
| `serviceLevels` | {availabilityTarget, rpoMinutes, rtoHours, supportHours, responseTargets por prioridad} | No (A validar PA-PLA-02/03) | — |
| `dataRegion` | string | Sí | — |
| `exitTerms` | {exportWindowDays, readOnlyDays, retentionDays, fiscalCustody: `tenant`\|`platform`} | Sí | PA-PLA-12. |
| `status` | enum `draft`, `pendingApproval`, `active`, `suspended`, `terminated`, `expired` | Sí | §8.4. |
| `versions` | [{version, validFrom, changes, approvedBy, approvedAt}] | Sí | RF-PLA-085. |
| `signedDocumentFileId` | uniqueidentifier → `storedFiles` | Para `active` | Contrato firmado. |

Índices: `{ tenantId: 1, status: 1 }`, `{ number: 1 }` único (global vía `TenantId` + number).

#### 7.11.9. `usageSnapshots`

`day` (fecha del tenant), `dimension`, `value` (DECIMAL(18,4) para GB; int para el resto), `quotaSoft`, `quotaHard`, `pct`. Índice único `{ tenantId: 1, dimension: 1, day: 1 }`.

#### 7.11.10. `supportCases` y `supportCaseMessages`

`supportCases`: `number` (`SUP-AAAA-NNNNN`), `title`, `module` (moduleCode), `impact` (`blocking`, `high`, `medium`, `low`), `priority` (`P1`–`P4`), `status` (§8.5), `channel` (`admin`, `email`, `phone`, `platform`), `reportedBy` (userId del tenant), `assigneeId` (usuario de `PLATFORM`), `queue` (`N1`, `N2`, `ops`, `security`), `context` {requestId, appVersion, route, userAgent}, `evidenceFileIds`, `incidentId`, `grantIds` (→ `supportAccessGrants`), `sla` {firstResponseDue, resolutionDue, firstResponseAt, resolvedAt, breached}, `satisfaction` {score 1–5, comment}, `tags`. Índices: `{ tenantId: 1, number: 1 }` único, `{ tenantId: 1, status: 1, priority: 1 }`, `{ tenantId: 1, assigneeId: 1, status: 1 }`. La bandeja global de soporte consulta con `runAsPlatform` sobre el índice `{ status: 1, priority: 1, tenantId: 1 }`, única excepción al prefijo `TenantId` admitida para colecciones `ownerScope: platform` y registrada en la lista blanca de índices de plataforma (igual que el índice del relay de outbox).

`supportCaseMessages`: `caseId`, `authorType` (`tenantUser`, `platformAgent`, `system`), `authorId`, `body` (texto con detector de secretos), `visibility` (`public`, `internal` — internal solo plataforma), `attachmentFileIds`. Índice `{ tenantId: 1, caseId: 1, createdAt: 1 }`.

#### 7.11.11. `supportAccessGrants`

> **Reemplazado por `supportAccessGrants` de T02 (CTR-DAT-02):** la concesión de acceso es de T02 (dueño de autorización). T01 la crea por comando desde el caso de soporte y consume su estado; la tabla siguiente queda como requisito de campos para T02.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `caseId` | uniqueidentifier | Sí | Caso que lo justifica. |
| `agentUserId` | uniqueidentifier (usuario `PLATFORM`) | Sí | Agente. |
| `mode` | enum `observe`, `operate`, `config` | Sí | Modo. |
| `piiAccess` | bool | Sí | Ver datos personales sin enmascarar. |
| `scope` | {modules[], capabilities[], entityRefs [{type, id}]} | Sí | Alcance mínimo. |
| `justification` | string | Sí | — |
| `breakGlass` | bool | Sí | — |
| `approvals` | [{by, role: `tenantAdmin`\|`platformSupportLead`\|`platformSecurity`, decision, at, comment}] | Según RN-PLA-018/021 | — |
| `validFrom` / `expiresAt` | Date | Sí | Duración ≤ `PRM-PLA-009` (break-glass ≤ `PRM-PLA-011`). |
| `status` | enum `requested`, `approved`, `active`, `expired`, `revoked`, `rejected` | Sí | §8.6. |
| `revokedBy`, `revokedAt`, `revokeReason` | — | No | — |
| `actionsCount`, `lastActionAt` | — | No | Métricas. |
| `postReview` | {reviewedBy, at, notes} | Si break-glass | Revisión posterior. |

Índices `{ tenantId: 1, status: 1, expiresAt: 1 }`, `{ agentUserId: 1, status: 1 }` (plataforma). Mapeo ProCoop: `frmSoporteIP` (sin tabla).

#### 7.11.12. `supportSessions`

`supportAccessGrantId` (→ `supportAccessGrants`; nombre canónico de T05, antes `grantId`), `agentUserId`, `tokenJti`, `startedAt`, `endedAt`, `ip`, `userAgent`, `endReason` (`logout`, `expired`, `revoked`). Índice `{ tenantId: 1, supportAccessGrantId: 1 }` (antes `grantId`).

#### 7.11.13. `platformIncidents` (tenantId = `PLATFORM`)

`number` (`INC-AAAA-NNNN`), `title`, `severity` (`SEV1`–`SEV4`), `status` (§8.7), `affectedTenantIds` (vacío = todos), `affectedModules`, `startedAt`, `identifiedAt`, `resolvedAt`, `publicMessage` (dictKey o texto por idioma), `updates` [{at, message, public}], `linkedCaseIds` (→ `supportCases`), `postmortemFileId`. Índice `{ tenantId: 1, status: 1, startedAt: -1 }`.

#### 7.11.14. `alertRules` (global para ámbito plataforma; con `TenantId` para reglas de tenant)

`code`, `scope` (`platform`, `tenant`), `ownerModule`, `conditionType` (`metricThreshold`, `eventMatch`, `jobFailure`, `checklistIncomplete`, `expiry`, `quota`, `heartbeat`), `params` (objeto validado por tipo), `severity` (`info`, `warning`, `critical`), `recipients` [{type: `role`\|`user`\|`channel`, ref}], `channels` (`inApp`, `email`, `push`, `webhook`), `dedupeKeyTemplate`, `cooldownMinutes`, `escalation` [{afterMinutes, recipients}], `enabled`. Reglas precargadas:

| Código | Condición | Severidad | Reemplaza en ProCoop |
|---|---|---|---|
| PLA-ALR-01 | Backup lógico del tenant fallido o ausente > 26 h | critical | Aviso de backups vencidos (vars 2786/2051) |
| PLA-ALR-02 | Certificado ARCA del tenant vence en ≤ 30/15/7 días (metadato de la bóveda T06) | warning→critical | Aviso de vencimiento del certificado AFIP (var 2925) |
| PLA-ALR-03 | Agente local sin latido > `PRM` de T06 | warning | Vigilancia del Agente (modo 11, vars 2730/2648/2731) |
| PLA-ALR-04 | Comprobantes pendientes de CAE > umbral (evento de M05) | critical | Validación de facturas electrónicas pendientes al abrir (RN-09 §5.6) |
| PLA-ALR-05 | Lag de outbox > `PRM-PLA-030` s | critical | — |
| PLA-ALR-06 | Nuevo `deadLetters` | warning | `LogProcoop.txt` |
| PLA-ALR-07 | Cola con jobs estancados o fallidos > umbral | warning | — |
| PLA-ALR-08 | Cupo blando/duro alcanzado | warning/critical | — |
| PLA-ALR-09 | Contrato SaaS vence en ≤ 30 días o vencido | warning | Demo de 30 días (`ValidarVersion`) |
| PLA-ALR-10 | Grant de soporte activo > 80 % de su duración o break-glass iniciado | info/critical | — |
| PLA-ALR-11 | Ensayo de restauración vencido (> `PRM-PLA-014` días) o fallido | warning | — |
| PLA-ALR-12 | Error 5xx > umbral por tenant o disponibilidad sintética < objetivo | critical | — |
| PLA-ALR-13 | Checklist incompleto con fecha objetivo de habilitación vencida | warning | — |
| PLA-ALR-14 | Dominio propio con TLS por vencer o verificación perdida | warning | — |

#### 7.11.15. `alerts`

`ruleCode`, `scope`, `severity`, `status` (§8.9), `dedupeKey`, `count`, `firstAt`, `lastAt`, `title` (dictKey + parámetros), `objectRef` {module, type, id, url}, `ackBy`, `ackAt`, `resolvedBy`, `resolvedAt`, `resolution`, `silencedUntil`, `notifiedChannels`. Índices `{ tenantId: 1, status: 1, severity: 1 }`, único parcial `{ tenantId: 1, dedupeKey: 1 }` con `status` ∈ (`open`, `acknowledged`).

#### 7.11.16. `backupPolicies` (global)

`code`, `type` (`pitr`, `tenantLogical`, `objectsReplication`), `frequency` (cron), `retention` {days, monthly, yearly}, `encryptionKeyRef` (alias KMS, nunca la clave), `targetLocation` (alias), `appliesTo` (`all` o lista de contratos), `enabled`.

#### 7.11.17. `backupRuns`

`policyCode`, `type`, `scope` (`cluster`, `tenant`), `TenantId` (tenant respaldado; `PLATFORM` para cluster), `startedAt`, `finishedAt`, `status` (`running`, `completed`, `failed`, `verified`), `sizeBytes`, `objectCount`, `collectionsCount`, `checksum` (SHA-256 del manifiesto), `locationRef`, `retentionUntil`, `verifiedAt`, `error`. Índice `{ tenantId: 1, type: 1, startedAt: -1 }`.

#### 7.11.18. `restoreRequests`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | `RST-AAAA-NNNN` | Sí | — |
| `mode` | enum `partialRecords`, `fullTenant`, `sandboxCopy` | Sí | Modalidad. |
| `targetPointInTime` | Date | Sí | Punto a restaurar. |
| `scope` | {collections[], entityRefs[]} | Si `partialRecords` | — |
| `reason`, `caseId`, `incidentId` | — | Sí (motivo) | Expediente. |
| `approvals` | [{by, role: `ops`\|`security`\|`tenantAdmin`, decision, at}] | Sí (RF-PLA-125) | — |
| `status` | §8.8 | Sí | — |
| `stagingRef` | alias del cluster aislado | No | — |
| `diffSummary` | {perCollection: [{name, added, changed, removed}]} | No | Diferencias contra el estado actual. |
| `reconciliation` | {fiscalDocsAfterPoint, paymentsAfterPoint, messagesAfterPoint, externalOpsReconciled, pendingResumed, issues[]} | No | ESC-04. |
| `startedAt`, `finishedAt`, `rtoActualMinutes` | — | No | Métricas. |
| `evidenceFileIds` | — | No | Informe. |

#### 7.11.19. `restoreTests`

`TenantId` (tenant muestreado), `scheduledAt`, `executedAt`, `pointInTime`, `result` (`passed`, `failed`), `checks` [{code: `dataRestored`\|`documentHashes`\|`externalReconciliation`\|`secretsDecrypt`\|`rtoWithinTarget`, status, detail}], `rtoActualMinutes`, `reportFileId`.

#### 7.11.20. `tenantExports`

`purpose` (`onDemand`, `exit`, `legalRequest`), `scope` (`full` o lista de módulos), `format` (`jsonl+csv+docs`), `status` (`queued`, `running`, `ready`, `downloaded`, `expired`, `failed`), `jobRunId`, `files` [{storedFileId (antes `fileId`), module, part, sizeBytes, sha256}], `storedFileId` del manifiesto (antes `manifestFileId`), `expiresAt`, `requestedBy`, `downloads` [{by, at, ip}]. Índice `{ tenantId: 1, status: 1, createdAt: -1 }`.

#### 7.11.21. `releases` (global)

`version` (semver), `gitSha`, `imageDigests` {api, worker, admin, pwa, landing}, `migrations` [ids], `notes` [{audience: `tenantAdmin`\|`staff`\|`socio`\|`platform`, dictKey o texto, modules}], `deployments` [{environment, ring, at, by, status}], `status` (`candidate`, `deploying`, `deployed`, `rolledBack`).

#### 7.11.22. `featureFlags` (global)

`key`, `description`, `ownerModule`, `default` (bool), `rules` [{type: `ring`\|`tenant`, value, enabled}], `expiresAt` (fecha límite para retirar el flag), `status` (`active`, `retired`; §8.12; antes sin valores).

#### 7.11.23. `outboxEvents`, `inboxReceipts`, `deadLetters`

- `outboxEvents`: `eventId` (UUIDv7, único), `type` (`<mod>.<entidad>.<hecho>`), `schemaVersion`, `aggregateType`, `aggregateId`, `payload`, `occurredAt`, `correlationId`, `causationId`, `actor` {type, id}, `status` (`pending`, `published`, `failed`), `attempts`, `nextAttemptAt`, `publishedAt`, `lastError`. Índices `{ status: 1, nextAttemptAt: 1 }` (global del relay, permitido: lectura técnica sin datos de negocio), `{ tenantId: 1, aggregateType: 1, aggregateId: 1, occurredAt: 1 }`, TTL de publicados a `PRM-PLA-047` días.
- `inboxReceipts`: `consumer`, `eventId`, `processedAt`; índice único `{ tenantId: 1, consumer: 1, eventId: 1 }`, TTL igual.
- `deadLetters`: `kind` (`event`, `job`), `ref` (eventId o jobName+jobKey), `consumer`, `attempts`, `lastError` (sin secretos), `payloadSummary`, `status` (`open`, `reprocessed`, `discarded`), `resolvedBy`, `resolution`, `businessImpact` (bool; si true se muestra en bandeja del tenant, T11).

#### 7.11.24. `jobRuns` e `idempotencyKeys`

- `jobRuns`: campos definidos en las reglas de jobs de §7.6 (antes solo "ver §7.6"):

| Campo | Tipo | Obligatorio | Descripción | Referencia |
|---|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | Tenant del job (`PLATFORM` para jobs de plataforma). | `tenants` (T01) |
| `jobName` | String | Sí | Nombre `<modulo>:<proceso>` (12.3 de cada anexo). | — |
| `jobKey` | String | Sí | Clave de idempotencia de negocio (ej. `fac:emitir-lote:<batchId>`). | — |
| `jobId` | String | No | Identificador del job en BullMQ (nombre canónico de T05; antes `bullJobId`); nulo para JOB-PLA-01 (proceso dedicado). | — |
| `queue` | enum `interactive`, `integration`, `events`, `notifications`, `batch`, `export`, `ai`, `maintenance` | No | Clase de cola (§7.6); nulo para JOB-PLA-01. | — |
| `status` | enum `queued`, `running`, `paused`, `succeeded`, `failed`, `cancelled`, `uncertain` | Sí | Estado (§8.10). | — |
| `progress` | Object `{ done, total }` | No | Avance para la barra de progreso. | — |
| `cursor` | Object | No | Punto de reanudación. | — |
| `cancelRequested` | Boolean | Sí | Cancelación cooperativa pedida (default `false`). | — |
| `requestedBy` | uniqueidentifier | No | Usuario que lanzó el job; nulo si lo lanzó el `scheduler` o un evento. | `identities` (T02) |
| `startedAt`, `finishedAt` | Date | No | Inicio y fin. | — |
| `summary` | Object | No | Totales del resultado. | — |
| `error` | Object `{ code, message }` | No | Error final, sin secretos. | — |
| `migrationName` | String | No | Migración de esquema que disparó el relleno (§7.11.28). | `schemaMigrations` (T01) |

Índices de `jobRuns`: `{ tenantId: 1, jobName: 1, createdAt: -1 }`, único `{ tenantId: 1, jobKey: 1 }` parcial para estados no terminales.

- `idempotencyKeys`: `scope` (método+ruta o comando), `key`, `requestHash`, `status` (`processing`, `completed`, `failed`), `responseStatus`, `responseBody` (resumen), `expiresAt`; índice único `{ tenantId: 1, scope: 1, key: 1 }`, TTL por `expiresAt` (`PRM-PLA-026`).

#### 7.11.25. `storedFiles`

`key`, `bucketAlias`, `moduleCode`, `ownerRef` {type, id}, `classification` (`publicBrand`, `internal`, `personal`, `fiscal`, `backup`, `export`), `originalName`, `mime`, `sizeBytes`, `sha256`, `scanStatus` (`pending`, `clean`, `infected`, `failed`), `retentionUntil`, `legalHold`, `uploadedBy`, `deletedAt`. Índices `{ tenantId: 1, ownerRef.type: 1, ownerRef.id: 1 }`, `{ tenantId: 1, sha256: 1 }`. Mapeo ProCoop: `ADJUNTOS` (COD_ADJ, TIPO, COD_TIP, FECHA, FECHA_CAP, OBSERVA, USUARIO, NOM_ARC), `frmEliminarAdjuntos`.

#### 7.11.26. `aiUsage`

`feature` (`onboardingBrand`, `moderation`, `biAsk`, `formulaAssistant`, …), `moduleCode`, `provider`, `model`, `inputTokens`, `outputTokens`, `costRef` (opcional), `requestId`, `userId`, `outcome` (`proposed`, `accepted`, `rejected`, `error`). Índice `{ tenantId: 1, createdAt: -1 }`, `{ tenantId: 1, feature: 1, createdAt: -1 }`.

#### 7.11.27. `healthSnapshots` (tenantId = `PLATFORM` o tenant)

`at`, `component` (`api`, `worker:<cola>`, `sql`, `redis`, `storage`, `connector:<code>`), `status` (`up`, `degraded`, `down`), `metrics` {p95Ms, errorRate, queueDepth, oldestJobAgeS, outboxLagS}, `TenantId` (si la medición es por tenant, p. ej. uptime sintético). TTL `PRM-PLA-044` días.

#### 7.11.28. `schemaMigrations` (global)

Registro de las migraciones de esquema aplicadas por despliegue (T05 COL-PLA-32 y §7.1.14; hasta esta versión T05 la tenía como `N`, propuesta sin declarar en T01). Es una colección técnica **global** (sin `TenantId`, como `tenants` y `releases`; T05 §7.1.3): la ejecuta el pipeline de despliegue (§7.10, §9.11) antes de arrancar la nueva versión de la API y los workers. Los rellenos por tenant que una migración dispara corren como jobs BullMQ reanudables y se registran en `jobRuns` con `migrationName`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `name` | String | Sí | `AAAAMMDDhhmm-<mod>-<descripcion>` (archivo de `packages/db-migrations`). Único. |
| `moduleCode` | String | Sí | Módulo dueño de las colecciones afectadas (§7.4.1). |
| `phase` | enum `expand`, `backfill`, `contract` | Sí | Paso del patrón expandir/contraer (T05 §7.1.14). |
| `collections[]` | [String] | Sí | Colecciones e índices que toca. |
| `checksum` | String (SHA-256 del archivo) | Sí | Si cambia una migración ya aplicada, el despliegue se detiene. |
| `releaseId` | uniqueidentifier → `releases` | Sí | Versión que la aplicó (§7.11.21). |
| `appliedAt` | Date | Sí | Fin de la aplicación. |
| `durationMs` | Int | Sí | Duración. |
| `status` | enum `applied`, `failed`, `rolledBack` | Sí | `failed` bloquea el despliegue; `rolledBack` solo para pasos de la fase de expansión de `phase` sin datos escritos (antes "pasos `expand`": `expand` es un valor de `phase`, no de `status`). |
| `backfillJobKeys[]` | [String] | No | `jobKey` de los rellenos por tenant (`jobRuns`). |
| `error` | String (sin datos de negocio ni secretos) | No | Último error. |

Índices: `{ name: 1 }` único; `{ releaseId: 1, appliedAt: 1 }`. Sin TTL (se conserva todo el historial). Sin origen ProCoop (en ProCoop el esquema lo cambiaba cada actualización del ejecutable sobre la base de cada cooperativa).

#### 7.11.29. Referencias entre colecciones sin destino explícito

Destino de los campos `*Id` que el texto anterior nombraba sin colección (corrección del 05-11-2026):

| Campo | Colección destino | Anexo dueño |
|---|---|---|
| `tenantModuleActivations.checklistSnapshotId`, `tenants.statusHistory[].checklistSnapshotId` | Instantánea congelada dentro de `tenantChecklists.snapshots` | T01 |
| `supportCases.grantIds[]`, `supportSessions.supportAccessGrantId` (antes `grantId`) | `supportAccessGrants` | T02 (CTR-DAT-02) |
| `platformIncidents.linkedCaseIds[]` | `supportCases` | T01 |
| `jobRuns.requestedBy` | `identities` | T02 |

### 7.12 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-PLA-15 (Asumida, DEC-072).

**`platformPlans`** — Packs y complementos comerciales (DEC-065) (COL-PLA-03; definición en texto en §7.11.3)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | único |
| `label` | string | No | — | dictKey |
| `modules` | array de string | No | — | string[] |
| `defaultQuotas` | array | No | — | Según la definición en texto del §7 |
| `targetSize` | enum | No | — | enum `pequena`, `mediana`, `grande`, `a medida` |
| `priceRef` | object | No | — | objeto opcional, A validar |
| `status` | enum | Sí | — | `draft`, `available`, `retired` |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `moduleCodes` | array de array | Sí | — | Campo citado por T05 (referencias o clave única) |

**`tenantModuleActivations`** — Activación de módulos por tenant (COL-PLA-05; definición en texto en §7.11.5)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `moduleCode` | string | Sí | — | Según la definición en texto del §7 |
| `mode` | enum | No | — | enum `off`, `test`, `production`, `historyReadOnly` |
| `newSalesBlocked` | bool | No | — | bool, servicios verticales |
| `status` | enum | Sí | — | enum `ok`, `pendingChecklist`, `blocked` |
| `checklistSnapshotId` | uniqueidentifier | No | `tenantChecklists` (T01) | destino → `tenantChecklists` |
| `activatedAt` | Date | No | — | Según la definición en texto del §7 |
| `activatedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `reason` | string | No | — | Según la definición en texto del §7 |
| `history` | string | No | — | Según la definición en texto del §7 |

**`tenantChecklists`** — Lista de puesta en marcha (COL-PLA-06; definición en texto en §7.11.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `capabilityCode` | string | No | — | ej. `tenant.base`, `tenant.operational`, `chk.fac` |
| `items` | array | No | — | Según la definición en texto del §7 |
| `overallStatus` | enum | No | — | `incomplete`, `complete` |
| `evaluatedAt` | Date | No | — | Según la definición en texto del §7 |
| `snapshots` | array | No | — | referencias a versiones congeladas al usarse en una transición |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`onboardingDrafts`** — Alta asistida antes de crear el tenant (COL-PLA-07; definición en texto en §7.11.7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `step` | enum | No | — | enum `identity`, `contacts`, `brand`, `modules`, `domain`, `admin`, `review` |
| `data` | object | No | — | objeto del asistente validado por Zod por paso |
| `aiProposal` | string | No | — | Según la definición en texto del §7 |
| `acceptedProposal` | string | No | — | lo confirmado por la persona |
| `status` | enum | Sí | — | `draft`, `proposed`, `confirmed`, `discarded`, `expired` |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `draftCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`usageSnapshots`** — Consumo por tenant y período (cupos, facturación SaaS) (COL-PLA-09; definición en texto en §7.11.9)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `day` | Date | No | — | fecha del tenant |
| `dimension` | string | No | — | Según la definición en texto del §7 |
| `value` | DECIMAL(18,4) | No | — | DECIMAL(18,4) para GB; int para el resto |
| `quotaSoft` | string | No | — | Según la definición en texto del §7 |
| `quotaHard` | string | No | — | Según la definición en texto del §7 |
| `pct` | string | No | — | Según la definición en texto del §7 |
| `period` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `metric` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`supportCases`** — Casos de soporte del tenant (COL-PLA-10; definición en texto en §7.11.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `number` | string | Sí | — | `SUP-AAAA-NNNNN` |
| `title` | string | No | — | Según la definición en texto del §7 |
| `module` | string | No | — | moduleCode |
| `impact` | enum | No | — | `blocking`, `high`, `medium`, `low` |
| `priority` | int | No | — | `P1`–`P4` |
| `status` | enum | Sí | — | §8.5 |
| `channel` | enum | No | — | `admin`, `email`, `phone`, `platform` |
| `reportedBy` | uniqueidentifier | No | `memberships` (T02) | userId del tenant; destino → `memberships` |
| `assigneeId` | uniqueidentifier | No | `memberships` (T02) | usuario de `PLATFORM`; destino → `memberships` |
| `queue` | enum | No | — | `N1`, `N2`, `ops`, `security` |
| `context` | string | No | — | Según la definición en texto del §7 |
| `evidenceFileIds` | array de uniqueidentifier | No | `storedFiles` (T01) | destino → `storedFiles` |
| `incidentId` | uniqueidentifier | No | `platformIncidents` (T01) | destino → `platformIncidents` |
| `grantIds` | array de uniqueidentifier | No | `supportAccessGrants` (T02) | destino → `supportAccessGrants` |
| `sla` | string | No | — | Según la definición en texto del §7 |
| `satisfaction` | string | No | — | Según la definición en texto del §7 |
| `tags` | array | No | — | Según la definición en texto del §7 |
| `openedBy` | uniqueidentifier | Sí | `memberships` (T02) | destino → `memberships` |

**`supportCaseMessages`** — Mensajes del caso (COL-PLA-11; definición en texto en §7.11.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `supportCaseId` | uniqueidentifier | Sí | `supportCases` (T01) | antes `caseId` en el texto del §7 (nombre canónico de T05); destino → `supportCases` |
| `authorType` | enum | No | — | `tenantUser`, `platformAgent`, `system` |
| `authorId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `body` | string | No | — | texto con detector de secretos |
| `visibility` | string | No | — | `public`, `internal` — internal solo plataforma |
| `attachmentFileIds` | array de uniqueidentifier | No | `storedFiles` (T01) | destino → `storedFiles` |

**`supportSessions`** — Sesiones de soporte con acceso temporal (COL-PLA-13; definición en texto en §7.11.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `supportAccessGrantId` | uniqueidentifier | No | `supportAccessGrants` (T02) | antes `grantId` en el texto del §7 (nombre canónico de T05); destino → `supportAccessGrants` |
| `agentUserId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `tokenJti` | string | No | — | Según la definición en texto del §7 |
| `startedAt` | Date | No | — | Según la definición en texto del §7 |
| `endedAt` | Date | No | — | Según la definición en texto del §7 |
| `ip` | string | No | — | Según la definición en texto del §7 |
| `userAgent` | string | No | — | Según la definición en texto del §7 |
| `endReason` | enum | No | — | `logout`, `expired`, `revoked` |

**`platformIncidents`** — Incidentes operativos de plataforma (COL-PLA-14; definición en texto en §7.11.13)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `number` | string | Sí | — | `INC-AAAA-NNNN` |
| `title` | string | No | — | Según la definición en texto del §7 |
| `severity` | enum | No | — | `SEV1`–`SEV4` |
| `status` | enum | Sí | — | §8.7 |
| `affectedTenantIds` | array de uniqueidentifier | No | `tenants` (T01) | vacío = todos; destino → `tenants` |
| `affectedModules` | array | No | — | Según la definición en texto del §7 |
| `startedAt` | Date | No | — | Según la definición en texto del §7 |
| `identifiedAt` | Date | No | — | Según la definición en texto del §7 |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `publicMessage` | string | No | — | dictKey o texto por idioma |
| `updates` | array | No | — | Según la definición en texto del §7 |
| `linkedCaseIds` | array de uniqueidentifier | No | `supportCases` (T01) | destino → `supportCases` |
| `postmortemFileId` | uniqueidentifier | No | `storedFiles` (T01) | destino → `storedFiles` |

**`alertRules`** — Reglas de alerta operativas y de SLO (COL-PLA-15; definición en texto en §7.11.14)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `scope` | enum | No | — | `platform`, `tenant` |
| `ownerModule` | string | No | — | Según la definición en texto del §7 |
| `conditionType` | enum | No | — | `metricThreshold`, `eventMatch`, `jobFailure`, `checklistIncomplete`, `expiry`, `quota`, `heartbeat` |
| `params` | object | No | — | objeto validado por tipo |
| `severity` | enum | No | — | `info`, `warning`, `critical` |
| `recipients` | array | No | — | Según la definición en texto del §7 |
| `channels` | enum | No | — | `inApp`, `email`, `push`, `webhook` |
| `dedupeKeyTemplate` | string | No | — | Según la definición en texto del §7 |
| `cooldownMinutes` | int | No | — | Según la definición en texto del §7 |
| `escalation` | string | No | — | Según la definición en texto del §7 |
| `enabled` | bool | No | — | Según la definición en texto del §7 |
| `sloDefinitionId` | uniqueidentifier | Sí | `sloDefinitions` (T08) | destino → `sloDefinitions` |

**`alerts`** — Alertas disparadas (absorbe alertEvents de T08) (COL-PLA-16; definición en texto en §7.11.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `ruleCode` | string | No | — | Según la definición en texto del §7 |
| `scope` | string | No | — | Según la definición en texto del §7 |
| `severity` | enum | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | §8.9 |
| `dedupeKey` | string | No | — | Según la definición en texto del §7 |
| `count` | int | No | — | Según la definición en texto del §7 |
| `firstAt` | Date | No | — | Según la definición en texto del §7 |
| `lastAt` | Date | No | — | Según la definición en texto del §7 |
| `title` | string | No | — | dictKey + parámetros |
| `objectRef` | string | No | — | Según la definición en texto del §7 |
| `ackBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `ackAt` | Date | No | — | Según la definición en texto del §7 |
| `resolvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `resolution` | string | No | — | Según la definición en texto del §7 |
| `silencedUntil` | string | No | — | Según la definición en texto del §7 |
| `notifiedChannels` | array | No | — | Según la definición en texto del §7 |
| `alertRuleId` | uniqueidentifier | Sí | `alertRules` (T01) | destino → `alertRules` |

**`backupPolicies`** — Políticas de respaldo (COL-PLA-17; definición en texto en §7.11.16)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `type` | enum | No | — | `pitr`, `tenantLogical`, `objectsReplication` |
| `frequency` | string | No | — | cron |
| `retention` | string | No | — | Según la definición en texto del §7 |
| `encryptionKeyRef` | string | No | `encryptionKeys` (T08) | alias KMS, nunca la clave; destino → `encryptionKeys` |
| `targetLocation` | string | No | — | alias |
| `appliesTo` | string | No | — | `all` o lista de contratos |
| `enabled` | bool | No | — | Según la definición en texto del §7 |

**`backupRuns`** — Ejecuciones de respaldo y PITR (COL-PLA-18; definición en texto en §7.11.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `policyCode` | string | No | — | Según la definición en texto del §7 |
| `type` | enum | No | — | Según la definición en texto del §7 |
| `scope` | enum | No | — | `cluster`, `tenant` |
| `startedAt` | Date | No | — | Según la definición en texto del §7 |
| `finishedAt` | Date | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `running`, `completed`, `failed`, `verified` |
| `sizeBytes` | int | No | — | Según la definición en texto del §7 |
| `objectCount` | int | No | — | Según la definición en texto del §7 |
| `collectionsCount` | int | No | — | Según la definición en texto del §7 |
| `checksum` | string | No | — | SHA-256 del manifiesto |
| `locationRef` | string | No | — | Según la definición en texto del §7 |
| `retentionUntil` | string | No | — | Según la definición en texto del §7 |
| `verifiedAt` | Date | No | — | Según la definición en texto del §7 |
| `error` | string | No | — | Según la definición en texto del §7 |
| `backupPolicyId` | uniqueidentifier | Sí | `backupPolicies` (T01) | destino → `backupPolicies` |

**`restoreTests`** — Simulacros de restauración (absorbe restoreDrills de T08) (COL-PLA-20; definición en texto en §7.11.19)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `scheduledAt` | Date | No | — | Según la definición en texto del §7 |
| `executedAt` | Date | No | — | Según la definición en texto del §7 |
| `pointInTime` | string | No | — | Según la definición en texto del §7 |
| `result` | enum | No | — | `passed`, `failed` |
| `checks` | array | No | — | Según la definición en texto del §7 |
| `rtoActualMinutes` | int | No | — | Según la definición en texto del §7 |
| `reportFileId` | uniqueidentifier | No | `storedFiles` (T01) | destino → `storedFiles` |
| `backupRunId` | uniqueidentifier | Sí | `backupRuns` (T01) | destino → `backupRuns` |

**`tenantExports`** — Exportaciones completas del tenant (COL-PLA-21; definición en texto en §7.11.20)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `purpose` | enum | No | — | `onDemand`, `exit`, `legalRequest` |
| `scope` | string | No | — | `full` o lista de módulos |
| `format` | string | No | — | `jsonl+csv+docs` |
| `status` | enum | Sí | — | `queued`, `running`, `ready`, `downloaded`, `expired`, `failed` |
| `jobRunId` | uniqueidentifier | No | `jobRuns` (T01) | destino → `jobRuns` |
| `files` | array | No | — | Según la definición en texto del §7; cada parte con `storedFileId` → `storedFiles` (T01) (antes `fileId`; nombre canónico de T05 COL-PLA-21, PA-DAT-04) |
| `storedFileId` | uniqueidentifier | Sí | `storedFiles` (T01) | antes `manifestFileId` en el texto del §7 (nombre canónico de T05); destino → `storedFiles` |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `requestedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `downloads` | array | No | — | Según la definición en texto del §7 |

**`releases`** — Versiones desplegadas y notas (COL-PLA-22; definición en texto en §7.11.21)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `gitSha` | string | No | — | Según la definición en texto del §7 |
| `imageDigests` | array | No | — | Según la definición en texto del §7 |
| `migrations` | array | No | — | Según la definición en texto del §7 |
| `deployments` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `candidate`, `deploying`, `deployed`, `rolledBack` |

**`featureFlags`** — Banderas funcionales y de UI (absorbe uiFeatureFlags de T03) (COL-PLA-23; definición en texto en §7.11.22)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `key` | string | Sí | — | Según la definición en texto del §7 |
| `description` | string | No | — | Según la definición en texto del §7 |
| `ownerModule` | string | No | — | Según la definición en texto del §7 |
| `default` | bool | No | — | bool |
| `rules` | array | No | — | Según la definición en texto del §7 |
| `expiresAt` | Date | No | — | fecha límite para retirar el flag |
| `status` | enum | Sí | — | `active`, `retired`; §8.12; antes sin valores |
| `kind` | enum | Sí | — | Campo citado por T05 (referencias o clave única) |

**`outboxEvents`** — Outbox transaccional; TTL tras publicar (COL-PLA-24; definición en texto en §7.11.23)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `eventId` | string | Sí | — | UUIDv7, único |
| `type` | enum | No | — | `<mod>.<entidad>.<hecho>` |
| `aggregateType` | string | No | — | Según la definición en texto del §7 |
| `aggregateId` | string | No | — | Según la definición en texto del §7 |
| `payload` | string | No | — | Según la definición en texto del §7 |
| `occurredAt` | Date | No | — | Según la definición en texto del §7 |
| `correlationId` | string | No | — | Según la definición en texto del §7 |
| `causationId` | string | No | — | Según la definición en texto del §7 |
| `actor` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `pending`, `published`, `failed` |
| `attempts` | int | No | — | Según la definición en texto del §7 |
| `nextAttemptAt` | Date | No | — | Según la definición en texto del §7 |
| `publishedAt` | Date | No | — | Según la definición en texto del §7 |
| `lastError` | string | No | — | Según la definición en texto del §7 |
| `eventType` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`inboxReceipts`** — Recepciones idempotentes de consumidores; TTL (absorbe processedEvents de T08) (COL-PLA-25; definición en texto en §7.11.23)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `consumer` | string | Sí | — | Según la definición en texto del §7 |
| `eventId` | string | Sí | — | Según la definición en texto del §7 |
| `processedAt` | Date | No | — | Según la definición en texto del §7 |

**`deadLetters`** — Mensajes fallidos para reproceso (COL-PLA-26; definición en texto en §7.11.23)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `kind` | enum | No | — | `event`, `job` |
| `ref` | string | No | — | eventId o jobName+jobKey |
| `consumer` | string | No | — | Según la definición en texto del §7 |
| `attempts` | int | No | — | Según la definición en texto del §7 |
| `lastError` | string | No | — | sin secretos |
| `payloadSummary` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `open`, `reprocessed`, `discarded` |
| `resolvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `resolution` | string | No | — | Según la definición en texto del §7 |
| `businessImpact` | bool | No | — | bool; si true se muestra en bandeja del tenant, T11 |
| `eventId` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`idempotencyKeys`** — Claves de idempotencia de API; TTL (absorbe la de T08) (COL-PLA-28; definición en texto en §7.11.24)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `scope` | string | Sí | — | método+ruta o comando |
| `key` | string | Sí | — | Según la definición en texto del §7 |
| `requestHash` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `processing`, `completed`, `failed` |
| `responseStatus` | string | No | — | Según la definición en texto del §7 |
| `responseBody` | string | No | — | resumen |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |

**`storedFiles`** — Metadatos de binarios en almacenamiento privado (COL-PLA-29; definición en texto en §7.11.25)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `key` | string | No | — | Según la definición en texto del §7 |
| `bucketAlias` | array | No | — | Según la definición en texto del §7 |
| `moduleCode` | string | No | — | Según la definición en texto del §7 |
| `ownerRef` | string | No | — | Según la definición en texto del §7 |
| `classification` | enum | No | — | `publicBrand`, `internal`, `personal`, `fiscal`, `backup`, `export` |
| `originalName` | string | No | — | Según la definición en texto del §7 |
| `mime` | string | No | — | Según la definición en texto del §7 |
| `sizeBytes` | int | No | — | Según la definición en texto del §7 |
| `sha256` | string | No | — | Según la definición en texto del §7 |
| `scanStatus` | enum | No | — | `pending`, `clean`, `infected`, `failed` |
| `retentionUntil` | string | No | — | Según la definición en texto del §7 |
| `legalHold` | string | No | — | Según la definición en texto del §7 |
| `uploadedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `storageKey` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`aiUsage`** — Consumo agregado de IA por tenant y período (cupo) (COL-PLA-30; definición en texto en §7.11.26)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `feature` | string | Sí | — | `onboardingBrand`, `moderation`, `biAsk`, `formulaAssistant`, … |
| `moduleCode` | string | No | — | Según la definición en texto del §7 |
| `provider` | string | No | — | Según la definición en texto del §7 |
| `model` | string | No | — | Según la definición en texto del §7 |
| `inputTokens` | array | No | — | Según la definición en texto del §7 |
| `outputTokens` | array | No | — | Según la definición en texto del §7 |
| `costRef` | string | No | — | opcional |
| `requestId` | uniqueidentifier | No | `restoreRequests` (T01) | destino → `restoreRequests` |
| `userId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `outcome` | enum | No | — | `proposed`, `accepted`, `rejected`, `error` |
| `period` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`healthSnapshots`** — Fotos de salud de servicios; TTL (COL-PLA-31; definición en texto en §7.11.27)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `at` | string | No | — | Según la definición en texto del §7 |
| `component` | enum | No | — | `api`, `worker:<cola>`, `mongo`, `redis`, `storage`, `connector:<code>` |
| `status` | enum | Sí | — | `up`, `degraded`, `down` |
| `metrics` | array | No | — | Según la definición en texto del §7 |


---

## 8. Estados y transiciones (AGR-003)

### 8.1. Tenant (`tenants.status`, AGR-004)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (alta) → `preparing` (Preparación) | Implementación / Superadmin | Borrador de alta confirmado; CUIT válido y no duplicado | Crea checklist `tenant.base`, licencias del plan en `active` (o `trial`), activaciones `off`, invitación al administrador; evento `pla.tenant.created` | Descartar el tenant solo si no tiene documentos de negocio (pasa a `purged` directo con motivo) |
| `preparing` → `testing` (Prueba) | Implementación | Checklist `tenant.base` completo (identidad, contactos, administrador con 2FA, región, zona horaria, dominio, branding mínimo) | Habilita modo `test` de módulos y creación del sandbox; evento `pla.tenant.statusChanged` | `testing` → `preparing` (motivo) |
| `testing` → `readyToEnable` (Listo para habilitar) | Implementación | Al menos un módulo con checklist productivo completo; contrato SaaS `active` o aprobado; ensayo del recorrido piloto con evidencia (AGR-036) | Permite activar capacidades en `production`; aviso a Comercial | `readyToEnable` → `testing` |
| `readyToEnable` → `operational` (Operativo) | Aprobador comercial | Checklist `tenant.operational` completo (contrato activo, legales publicados, backup lógico inicial OK, `noDemoData`, usuarios de prueba deshabilitados, acta de aceptación) | Activa backups productivos y alertas del tenant; publica landing si `channel.landing` en `production`; evento | No se vuelve atrás: se suspende o se cierra |
| `operational` → `suspended` (Suspendido administrativo) | Aprobador comercial (deuda/incumplimiento/pedido) o Seguridad (riesgo) | Motivo, modo y comunicación previa registrados (salvo riesgo de seguridad) | Aplica RN-PLA-012; pausa jobs no obligatorios; banner en admin; notificación a contactos; evento `pla.tenant.suspended` | `suspended` → `operational` |
| `suspended` → `operational` | Aprobador comercial / Seguridad | Causa resuelta y registrada | Reanuda jobs; bandeja de jobs omitidos (RN-PLA-013); evento `pla.tenant.reactivated` | — |
| `operational` / `suspended` → `closing` (En cierre) | Aprobador comercial | Contrato `terminated` o pedido de la cooperativa; exportación de salida encolada | Solo lectura total; exportación completa disponible; landing con aviso; jobs pausados (salvo obligaciones legales y exportación) | `closing` → `operational` solo con nuevo contrato aprobado antes de `readOnlyUntil` |
| `closing` → `closed` (Cerrado) | Sistema (job) al vencer `readOnlyUntil` | Exportación entregada (descarga registrada o constancia de entrega) | Bloquea todo acceso; revoca tokens y API keys; detiene notificaciones; datos retenidos cifrados | `closed` → `closing` solo por orden legal o error, con doble aprobación |
| `closed` → `purged` (Purgado) | Sistema + aprobación de Seguridad | Vencido `purgeAfter`; sin retención legal pendiente (`legalHold`) | Purga (JOB-PLA-14) y certificado; evento `pla.tenant.closed` (con `purged: true`) | Irreversible |
| `preparing` / `testing` → `closing` | Aprobador comercial | Cooperativa desiste | Igual a cierre, con exportación si hubo datos | — |

`platform` (kind) no admite transiciones. `sandbox` y `demo` admiten `preparing` → `operational` directo (sin contrato) y `purged`.

### 8.2. Activación de módulo (`tenantModuleActivations.mode`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| `off` → `test` | Implementación / admin del tenant (si delegado) | Licencia vigente; dependencias en `test` o `production`; tenant ≥ `testing` | Módulo visible; integraciones en homologación; documentos `isTest` | `test` → `off` (los datos de prueba se descartan por job) |
| `test` → `production` | Aprobador comercial (o Implementación con permiso) | RN-PLA-010; tenant en `readyToEnable`/`operational` | Snapshot del checklist; `modulesVersion++`; evento `pla.capability.activated` | `production` → `historyReadOnly` |
| `off` → `production` | — | No permitido | — | — |
| `production` → `historyReadOnly` | Aprobador comercial / admin del tenant | Motivo; módulos dependientes en `historyReadOnly` u `off` | Solo `ver`/`exportar`; jobs del módulo detenidos; evento `pla.capability.deactivated` | `historyReadOnly` → `production` (checklist reevaluado) |
| `production` ↔ `production` con `newSalesBlocked` | Admin del tenant (servicio vertical) | — | Bloquea nuevas contrataciones; contratos existentes siguen | Quitar el bloqueo |
| cualquier → `off` | — | Solo si nunca estuvo en `production` | — | — |

Licencia vencida o revocada → la activación pasa automáticamente a `historyReadOnly` (nunca a `off`) y se alerta (PLA-ALR-09).

### 8.3. Checklist (`items[].status`)

`pending` → `ok` (evaluación automática exitosa o verificación manual con evidencia) · `pending`/`failed` → `failed` (evaluación negativa, con detalle) · `pending`/`failed` → `waived` (dispensa aprobada, RN-PLA-011, con vencimiento; al vencer vuelve a `pending`) · cualquier → `notApplicable` (justificado; p. ej. `mig` para cooperativa sin sistema previo) · `ok` → `pending` (cambio en la dependencia: credencial revocada, certificado vencido, tarifa despublicada; detectado por evento o reevaluación diaria JOB-PLA-02). Un `ok` → `pending` en una capacidad en `production` **no** la desactiva: genera alerta PLA-ALR-13 y aviso al tenant.

### 8.4. Contrato SaaS (`saasContracts.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| `draft` → `pendingApproval` | Comercial | Plan, cupos, región, condiciones de salida | Solicitud en bandeja (T11) |
| `pendingApproval` → `active` | Aprobador comercial | Documento firmado adjunto | Genera/actualiza `tenantLicenses`; evento `pla.saasContract.approved` |
| `pendingApproval` → `draft` | Aprobador | Rechazo con motivo | — |
| `active` → `active` (nueva versión) | Comercial + Aprobador | Cambio de plan/cupos con `validFrom` | Versiona; licencias nuevas desde `validFrom` |
| `active` → `suspended` | Sistema/Aprobador | Tenant suspendido por motivo comercial | Solo marca; no toca datos |
| `active` → `expired` | Sistema | `validTo` vencido sin renovación | Alerta; licencias pasan a `expired` tras `PRM-PLA-032` días de gracia |
| `active`/`expired` → `terminated` | Aprobador comercial | Baja comunicada | Lleva el tenant a `closing` |

### 8.5. Caso de soporte (`supportCases.status`)

`received` (Recibida) → `inAnalysis` (En análisis; asignado) → `waitingTenant` (Esperando a la cooperativa) ↔ `inAnalysis` → `inResolution` (En resolución) → `resolved` (Resuelta; notifica y pide encuesta) → `closed` (Cerrada; automático a los `PRM-PLA-034` días o por el tenant) · `resolved` → `reopened` → `inAnalysis` (dentro de `PRM-PLA-034` días) · cualquier → `cancelled` (el tenant desiste). El SLA se pausa en `waitingTenant`. Cerrar un caso revoca sus grants activos.

### 8.6. Acceso temporal de soporte (`supportAccessGrants.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| (solicitud) → `requested` | Agente de soporte | Caso abierto; modo, alcance, justificación, duración ≤ máximo | Notificación al admin del tenant (y a Seguridad si break-glass) |
| `requested` → `approved` | Admin del tenant (operate/config/PII) o líder de soporte (observe sin PII) o dos aprobadores de plataforma (break-glass) | RN-PLA-018 / RN-PLA-021 | — |
| `requested` → `rejected` | Aprobador | Motivo | Notifica al agente |
| `approved` → `active` | Agente (inicia sesión de soporte) | `now` ≥ `validFrom` y < `expiresAt` | Emite token de soporte; `supportSessions`; evento `pla.supportGrant.activated` |
| `active`/`approved` → `expired` | Sistema (JOB-PLA-04, cada minuto) | `now` ≥ `expiresAt` | Revoca tokens (RN-PLA-020); evento |
| `active`/`approved`/`requested` → `revoked` | Admin del tenant, Seguridad o el propio agente | — | Revoca tokens inmediatamente; evento `pla.supportGrant.revoked` |

No existe extensión de un grant: se solicita uno nuevo (queda trazabilidad).

### 8.7. Incidente de plataforma

`investigating` → `identified` → `monitoring` → `resolved` → `postmortem` (cerrado con documento) · `monitoring` → `investigating` (recurrencia). Cada cambio publica actualización en la página de estado de los tenants afectados y notifica los casos vinculados.

### 8.8. Solicitud de restauración (`restoreRequests.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| → `requested` | Operaciones (o admin del tenant vía caso) | Motivo, punto en el tiempo, modo | Expediente RST-… |
| `requested` → `approved` | Operaciones + Seguridad (+ admin del tenant si `fullTenant`) | RF-PLA-125 | — |
| `approved` → `stagingRestored` | Sistema (JOB-PLA-11) | Snapshot disponible para el punto | Cluster aislado restaurado |
| `stagingRestored` → `diffReady` | Sistema | Extracción del tenant | `diffSummary` para revisión |
| `diffReady` → `executing` | Operaciones (confirmación final) | Para `fullTenant`: tenant en mantenimiento (RN-PLA-023) | Aplica registros o reemplaza datos del tenant (excepto auditoría, RN-PLA-024) |
| `diffReady` → `completed` | Sistema | Modo `sandboxCopy`: copia al sandbox | — |
| `executing` → `reconciling` | Sistema (JOB-PLA-12) | — | Llama `restoreHooks` de cada módulo; consulta `integrationOperations` (antes `externalOperations`) y terceros |
| `reconciling` → `completed` | Operaciones | Sin `issues` bloqueantes | Tenant sale de mantenimiento; evento `pla.restore.completed`; informe |
| `reconciling` → `completedWithIssues` | Operaciones | Issues derivados a bandeja del tenant/soporte | Igual, con casos abiertos |
| cualquier no terminal → `cancelled` / `failed` | Operaciones / Sistema | — | Se descarta el cluster aislado; si falló en `executing`, se restaura el estado previo desde el backup tomado al iniciar `executing` |

### 8.9. Alerta (`alerts.status`)

`open` → `acknowledged` (reconocida por un destinatario) → `resolved` (manual o automática al desaparecer la condición) · `open`/`acknowledged` → `silenced` (hasta `silencedUntil`, con motivo) → `open` · `resolved` → `open` (recurrencia fuera de la ventana de deduplicación crea **nueva** alerta; dentro de la ventana reabre la misma).

### 8.10. Exportación de tenant y job

- `tenantExports`: `queued` → `running` → `ready` → `downloaded` → `expired`; `running` → `failed` → `queued` (reintento).
- `jobRuns`: `queued` → `running` → `succeeded` | `failed` | `cancelled` | `uncertain` (resultado externo desconocido; requiere conciliación); `running` → `paused` (suspensión del tenant o pausa de cola) → `running`.

### 8.11. Release

`candidate` → `deploying` (por ambiente/anillo) → `deployed` · `deploying`/`deployed` → `rolledBack` (vuelta al digest anterior; las migraciones expandir/contraer garantizan compatibilidad).

### 8.12. Estados de colecciones técnicas sin máquina propia

Corrección del 05-11-2026: las colecciones siguientes declaraban `status` en §7 sin transiciones. El estado inicial es el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `moduleCatalog` | — | `draft` | Alta del módulo en el catálogo | — | — |
| `moduleCatalog` | `draft` | `available` | Publicación por `pla.catalogo.editar` | Manifiesto del módulo validado | — |
| `moduleCatalog` | `available` | `deprecated` | Anuncio de retiro | — | EVT-PLA-16 (notas de versión) |
| `moduleCatalog` | `deprecated` | `retired` | Retiro definitivo | Ningún tenant con el módulo en `test` o `production` | — |
| `platformPlans` | — | `draft` | Alta por `pla.planes.editar` | — | — |
| `platformPlans` | `draft` | `available` | Publicación | — | — |
| `platformPlans` | `available` | `retired` | Retiro comercial | Las licencias vigentes del plan siguen hasta su `validTo` | — |
| `tenantLicenses` | — | `active` | Aprobación del contrato SaaS o alta por `pla.licencias.editar` | Contrato `approved` (§8.4) | EVT-PLA-08 |
| `tenantLicenses` | `active` | `expired` | JOB-PLA-03 al pasar `validTo` | — | EVT-PLA-08 |
| `tenantLicenses` | `active` | `revoked` | Baja por `pla.licencias.editar` con motivo | — | EVT-PLA-08 |
| `onboardingDrafts` | — | `draft` | Inicio del alta asistida | — | — |
| `onboardingDrafts` | `draft` | `proposed` | JOB-PLA-16 devuelve la propuesta de IA | `PRM-PLA-040 = true` | — |
| `onboardingDrafts` | `draft`, `proposed` | `confirmed` | La persona confirma el alta | Pasos validados | EVT-PLA-01 (`pla.tenant.created`) |
| `onboardingDrafts` | `draft`, `proposed` | `discarded` | La persona descarta | — | — |
| `onboardingDrafts` | `draft`, `proposed` | `expired` | JOB-PLA-17 al pasar `expiresAt` | — | — |
| `backupRuns` | — | `running` | JOB-PLA-09 | — | — |
| `backupRuns` | `running` | `completed` | Fin sin error | — | EVT-PLA-13 `pla.backup.completed` |
| `backupRuns` | `running` | `failed` | Error o tiempo agotado | — | EVT-PLA-13 `pla.backup.failed`; alerta PLA-ALR-01 |
| `backupRuns` | `completed` | `verified` | JOB-PLA-10 | Checksum del manifiesto coincide | — |
| `outboxEvents` | — | `pending` | `publish()` en la transacción del cambio | — | — |
| `outboxEvents` | `pending` | `published` | JOB-PLA-01 encola a los suscriptores | — | El propio evento |
| `outboxEvents` | `pending` | `failed` | Reintentos agotados (`PRM-PLA-027`) | — | Alta en `deadLetters`; PLA-ALR-06 |
| `deadLetters` | — | `open` | Evento o job agotado | — | PLA-ALR-06 |
| `deadLetters` | `open` | `reprocessed` | Reintento manual por `pla.deadLetters.reprocesar` | El consumidor es idempotente por `inboxReceipts` | — |
| `deadLetters` | `open` | `discarded` | Descarte justificado por `pla.deadLetters.reprocesar` | Motivo obligatorio | — |
| `idempotencyKeys` | — | `processing` | Primera solicitud con la clave | — | — |
| `idempotencyKeys` | `processing` | `completed` | Respuesta 2xx guardada | — | — |
| `idempotencyKeys` | `processing` | `failed` | Error del servidor; la clave puede reintentarse | — | — |
| `storedFiles.scanStatus` | — | `pending` | Confirmación de subida (API-PLA-63) | — | — |
| `storedFiles.scanStatus` | `pending` | `clean` | JOB-PLA-21 sin hallazgos | Tipo real coincide con el declarado | — |
| `storedFiles.scanStatus` | `pending` | `infected` | JOB-PLA-21 detecta malware | — | — (el archivo queda inaccesible) |
| `storedFiles.scanStatus` | `pending` | `failed` | Error del antivirus | — | PLA-ALR-07 |
| `schemaMigrations` | — | `applied` | Paso de migración ejecutado en el despliegue | — | — |
| `schemaMigrations` | — | `failed` | Error del paso | — | Bloquea el despliegue |
| `schemaMigrations` | `applied` | `rolledBack` | Vuelta atrás del release | Solo pasos de la fase de expansión (`phase`) sin datos escritos | — |
| `featureFlags` | — | `active` | Alta del flag con el despliegue | `expiresAt` informado | — |
| `featureFlags` | `active` | `retired` | El flag se retira del código | Al vencer `expiresAt`, PLA-ALR-07 avisa si sigue `active` | — |
| `healthSnapshots` | — | `up` | Muestra de JOB-PLA-08 con el servicio sano | — | — |
| `healthSnapshots` | — | `degraded` | Muestra de JOB-PLA-08 con el servicio degradado | — | — |
| `healthSnapshots` | — | `down` | Muestra de JOB-PLA-08 con el servicio caído | — | PLA-ALR-01 si corresponde |

`healthSnapshots.status` (`up`, `degraded`, `down`) es una medición inmutable de cada muestra y no tiene transiciones: cada muestra nace en su valor (filas "—" de la tabla).

### 8.13. Estados iniciales de las máquinas de §8.2 a §8.11

Corrección del cierre de residuales (05-11-2026; PA-PLA-15): explicita el estado de alta de las máquinas descritas en texto o con origen implícito. Las transiciones siguen en cada subsección.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `tenantModuleActivations.mode` | — | `off` | Alta de la activación al licenciar el módulo | Licencia vigente | — |
| `tenantChecklists.items.status` | — | `pending` | Generación del checklist del módulo | — | — |
| `saasContracts.status` | — | `draft` | Alta del contrato por Comercial | — | — |
| `supportCases.status` | — | `received` | Alta del caso (admin, correo, teléfono o plataforma) | — | — |
| `platformIncidents.status` | — | `investigating` | Declaración del incidente | — | — |
| `restoreRequests.status` | — | `requested` | Operaciones o admin del tenant vía caso (antes "→ `requested`") | Motivo, punto en el tiempo, modo | — |
| `alerts.status` | — | `open` | Regla de alerta disparada | Deduplicación por ventana | — |
| `tenantExports.status` | — | `queued` | Pedido de exportación (CU-PLA-14) | — | — |
| `jobRuns.status` | — | `queued` | Encolado del job | — | — |
| `releases.status` | — | `candidate` | Build aprobado por el pipeline | — | — |

---

## 9. Procesos y flujos

### 9.1. Alta asistida de una cooperativa (CU-PLA-01)

1. Implementación abre PAN-PLA-04 “Alta de cooperativa” (`pla.altaAsistida.usar`); se crea `onboardingDrafts` (`step: identity`).
2. Identidad: CUIT → consulta opcional al padrón (T06) → precarga razón social y domicilio; la persona confirma; validación de duplicado (RN-PLA-007).
3. Contactos: legal, administrativo, técnico (obligatorios); facturación, seguridad, soporte (opcionales).
4. Marca: sube logo y/o URL del sitio → job `pla:propuesta-ia-alta` (JOB-PLA-16, cola `interactive`) → la IA devuelve paleta, nombre corto, slugs, splash, íconos y sugerencias de diccionario → validación de contraste (RF-PLA-058) → **preview celular** de PWA y landing (patrón CNX §4.2) → la persona acepta, edita o descarta cada propuesta.
5. Módulos/plan: elige plan y complementos (sin precio si no está definido); se calculan dependencias.
6. Dominio y región: subdominio sugerido por el slug; dominio propio opcional; región (PA-PLA-01); zona horaria; anillo.
7. Administrador inicial: email y nombre → T02 genera invitación con 2FA obligatorio.
8. Resumen → **Confirmar** con `Idempotency-Key`: transacción que crea `tenants` (`preparing`), `tenantLicenses`, `tenantModuleActivations` (`off`), `tenantChecklists` (`tenant.base`), aplica branding y diccionario (T03, comando `uxd.applyBrandingProposal` en la misma sesión), registra `aiUsage.outcome`, publica `pla.tenant.created`. Consumidores: T02 envía la invitación; T09 notifica a contactos; JOB-PLA-02 evalúa el checklist.
9. Opcional: crear sandbox (§9.6).

**Excepciones:** IA no disponible → el paso 4 sigue manual; CUIT duplicado → bloqueo con enlace al tenant existente (si el usuario tiene permiso); reintento del paso 8 → misma respuesta (idempotencia); borrador sin actividad `PRM-PLA-039` días → `expired` y limpieza (JOB-PLA-17).

### 9.2. Habilitación por capacidad: checklists

**Evaluación:** JOB-PLA-02 `pla:evaluar-checklist` corre ante eventos relevantes (lista abajo) y diariamente; por cada `capabilityCode` llama a los `checklistProviders` de los módulos (comandos de lectura en su `index.js`); los ítems manuales los verifica una persona con evidencia.

| Checklist | Ítem | Tipo | Proveedor / evidencia | Dispensable |
|---|---|---|---|---|
| `tenant.base` | Razón social, CUIT válido, domicilio | auto | `pla` | No |
| | Contactos legal, administrativo y técnico | auto | `pla` | No |
| | Administrador del tenant activo con 2FA | auto | `iam` (`iam.user.mfaEnabled`) | No |
| | Región de datos y zona horaria | auto | `pla` | No |
| | Subdominio asignado | auto | `pla` | No |
| | Branding mínimo (logo, colores con contraste OK) | auto | `uxd` | Sí |
| | Diccionario base aplicado | auto | `uxd` | Sí |
| | Contrato SaaS al menos en borrador o licencia `trial`/`pilot` | auto | `pla` | No |
| `tenant.operational` | Contrato SaaS `active` con documento firmado | auto | `pla` | No |
| | Términos y condiciones y política de privacidad publicados | auto | `por`/`uxd` | No |
| | Contactos de soporte confirmados | manual | `pla` | Sí |
| | Al menos una capacidad en `production` | auto | `pla` | No |
| | Backup lógico inicial exitoso | auto | `pla` | No |
| | `noDemoData`: ningún documento con `isDemo: true` | auto | todos los módulos | **No** |
| | Usuarios de prueba deshabilitados | auto | `iam` | No |
| | Acta de aceptación del piloto/ola (AGR-036) | manual (archivo firmado) | `pla` | No |
| `chk.cat` / `chk.svc` (servicio vertical) | Servicio configurado y paquete publicado en M02 | auto | `cat`, `cfg` | No |
| | Tarifa vigente publicada | auto | `tar` | No |
| | Requisitos/documentos de solicitud y textos de landing | auto | `cat`, `uxd` | Sí |
| | Área de cobertura/factibilidad definida (si aplica) | auto | `cat`/`tec` | Sí |
| | Circuito de solicitud de alta y baja configurado | auto | `crm` | No |
| `chk.fac` (emisión real) | Certificado ARCA de producción vigente en bóveda (`productionCredentials`) | auto | `int`/`fis` | **No** |
| | Puntos de venta habilitados y vinculados | auto | `cfg`/`fis` | No |
| | Prueba de CAE en homologación exitosa | auto | `fis` | No |
| | Numeración inicial definida o importada | auto | `fac`/`mig` | No |
| | Plantillas de comprobante publicadas | auto | `fac` | No |
| | Ciclo de facturación configurado | auto | `fac` | No |
| | Conceptos e impuestos configurados | auto | `fis` | No |
| `chk.cob` (pagos) | Credenciales productivas de pasarela/red en bóveda | auto | `int` | **No** |
| | Webhook verificado (evento de prueba recibido) | auto | `int` | No |
| | Conciliación de prueba exitosa | auto | `cob` | No |
| | Cajas, medios y cuentas bancarias definidos | auto | `cob`/`tes` | No |
| `chk.com` (comunicaciones) | Dominio de correo verificado (SPF, DKIM, DMARC) o remitente de plataforma | auto | `com`/`int` | Sí |
| | Plantillas de WhatsApp aprobadas por Meta (si `addon.whatsapp`) | auto | `com` | No |
| | Política de consentimiento/opt-in configurada | auto | `com` | No |
| `chk.por` (canales) | Manifest PWA con íconos del tenant | auto | `uxd` | No |
| | Métodos de login del socio configurados | auto | `iam` | No |
| | Pasarela activa si hay pago en línea | auto | `cob` | No |
| `chk.mig` (saldos iniciales) | Migración ensayada y conciliada | auto | `mig` | No (si aplica) |
| | Saldos iniciales aprobados por la cooperativa (BASE §97.10) | auto (`mig.openingBalances.approved`) | `mig` | **No** |
| `chk.con` | Plan de cuentas, ejercicio abierto, mapeo de asientos automáticos | auto | `con` | No |
| `chk.sue` | Empleador(es), convenios, conceptos y prueba de F.931 | auto | `sue` | No |
| `chk.tec` | Cuadrillas, agenda y stock de equipos | auto | `tec`/`stk` | Sí |
| `chk.ext` | Cliente de API, límites y acuerdo de uso | auto | `bia` | No |
| `chk.int` | Conector probado (“probar conexión” OK) | auto | `int` | No |

Eventos que disparan reevaluación: `iam.mfa.enrolled` (EVT-IAM-08), `iam.membership.suspended` / `.revoked` (EVT-IAM-03), `uxd.branding.published` (EVT-UXD-01), `cfg.configVersion.published` (EVT-CFG-05), `tar.schedule.published` (EVT-TAR-004), `fis.credential.verified`, `int.credential.expiring` / `.rotated` (EVT-INT-05), `int.circuit.opened` / `.closed` (EVT-INT-04), `int.connection.activated` (EVT-INT-01), `mig.openingBalances.approved`, `pla.saasContract.approved`, `pla.backup.completed`.

### 9.3. Activación de un módulo en producción (CU-PLA-03)

1. Usuario con `pla.licencias.editar` (o admin del tenant con permiso delegado) pide `POST /api/platform/tenants/:id/modules/:code/activate { mode: 'production' }` con `Idempotency-Key`.
2. Validaciones: licencia vigente, dependencias, estado del tenant, checklist completo → si falla, 409 con lista de ítems faltantes (enlaces a la pantalla del módulo que los resuelve).
3. Transacción: actualiza activación, congela snapshot del checklist, `tenants.modulesVersion++`, outbox `pla.capability.activated`.
4. Invalida caché `t:<tenantId>:modules`; los tokens con `mv` anterior se refrescan al siguiente request.
5. Consumidores: el módulo activado programa sus jobs (fan-out), T03 recalcula menú, T09 avisa al administrador.

### 9.4. Suspensión y reactivación (CU-PLA-05)

1. Aprobador registra motivo, modo, modo del portal (PA-PLA-04), fecha prevista de fin y comunicación.
2. Transacción: `status: suspended`, `suspension`, outbox `pla.tenant.suspended`.
3. Consumidores: `core/jobs` pausa los jobs programados del tenant no marcados `legalObligation` (`jobRuns.status: paused`); `core/http` aplica el modo (middleware `tenantStatusGuard`: en `readOnlyStaff` rechaza métodos no GET con 423 `tenant-suspended`, salvo exportaciones y soporte); T09 notifica contactos; banner en admin.
4. Reactivación: `pla.tenant.reactivated` → reanuda jobs; los programados durante la suspensión se listan para decisión (RN-PLA-013).
5. Nunca: bajas de servicios, cambios de contratos, anulaciones, borrados.

### 9.5. Soporte con acceso temporal (CU-PLA-06)

1. La cooperativa crea el caso (PAN-PLA-17): título, módulo, impacto, descripción, evidencias; el sistema adjunta contexto técnico; detector de secretos en texto y adjuntos de texto.
2. Asignación automática a cola N1 por módulo/prioridad; SLA calculado.
3. Si el agente necesita ver datos: solicita grant (PAN-PLA-08) con modo, alcance y duración.
4. Aprobación según RN-PLA-018 (bandeja del admin del tenant PAN-PLA-18 y notificación).
5. El agente inicia la sesión de soporte: `POST /api/platform/support/grants/:id/sessions` → token de soporte (`tid` = tenant asistido, `act: support`, `sgid`, capabilities = intersección); el admin muestra banda “Sesión de soporte en <Cooperativa> — vence hh:mm”.
6. Cada acción se audita con agente + tenant + grant; en `observe` los serializadores enmascaran PII si `piiAccess: false`.
7. Fin: logout, vencimiento o revocación → tokens revocados (≤ 60 s); el caso registra la actuación; al resolver se notifica al tenant y se pide encuesta.
8. Break-glass: solicitud con `breakGlass: true` (solo P1), dos aprobadores de plataforma, notificación inmediata al tenant, duración ≤ `PRM-PLA-011`, revisión posterior obligatoria en ≤ 5 días hábiles.

### 9.6. Sandbox de cooperativa y prueba de configuración (CU-PLA-07)

1. Implementación o admin del tenant solicita sandbox (PAN-PLA-14) → JOB-PLA-15 `pla:crear-sandbox` crea en el ambiente `sandbox` un tenant `kind: sandbox` con el mismo `code` + sufijo `-sbx`, branding y diccionario copiados, usuarios invitados (mismos emails, cuentas separadas por ambiente), integraciones forzadas a homologación, email con lista blanca.
2. Datos: juego canónico ficticio por defecto; copia anonimizada solo con aprobación (PA-PLA-07; JOB-PLA-19).
3. Configuración: el tenant exporta un paquete de configuración de producción (T04) → se transfiere firmado al sandbox (JOB-PLA-18 `pla:sincronizar-config-sandbox`) → se modifica y simula en sandbox (p. ej. tarifa nueva + facturación de prueba) → se exporta el paquete resultante → se importa en producción como **borrador** → circuito de publicación de T04 (aprobación, vigencia) (RN-PLA-035).
4. Banda “PRUEBA” permanente; ninguna credencial productiva (RF-PLA-112).
5. La simulación sin sandbox (in situ, sobre la configuración en borrador) la provee T04 para cambios menores.

### 9.7. Backups y restauración por tenant (CU-PLA-08, AGR-019, ESC-04)

**Backups:**
- PITR del cluster continuo (snapshots + oplog) según `backupPolicies.pitr`; verificación diaria del último snapshot.
- JOB-PLA-09 `pla:backup-logico-tenant` (fan-out diario por tenant operativo): exporta todas las colecciones con `tenantId` (modo snapshot con `readConcern: majority` y marca de tiempo de clúster), manifiesto de objetos (claves + versión + sha256), cifra con KMS, guarda en `ga-<env>-backups`, registra `backupRuns`.
- Replicación de objetos a otra región/cuenta; Object Lock para `fiscal` y `backup`.
- JOB-PLA-10 `pla:verificar-backups`: verifica checksums, alerta PLA-ALR-01.

**Restauración:**
1. Solicitud (PAN-PLA-11) con modo, punto en el tiempo y motivo; aprobaciones.
2. JOB-PLA-11 `pla:restaurar-tenant`: restaura el snapshot PITR al punto en un cluster aislado; extrae los documentos del tenant (todas las colecciones de tenant) y el manifiesto de objetos a esa fecha; calcula `diffSummary` contra producción.
3. Revisión humana del diff; confirmación.
4. Ejecución:
   - `partialRecords`: reinsertar/actualizar solo los registros seleccionados, como operación nueva auditada (con `version` incrementada), respetando invariantes del módulo dueño (se aplica mediante comandos del módulo, no escritura directa, cuando el módulo lo expone).
   - `fullTenant`: tenant en mantenimiento; backup lógico “previo” del estado actual; reemplazo de colecciones del tenant **excepto** `auditLogs`, `outboxEvents` publicados, `supportCases`, `restoreRequests`, `backupRuns`; objetos restaurados a su versión del punto (sin borrar versiones posteriores).
   - `sandboxCopy`: los datos se cargan en el sandbox del tenant para inspección.
5. JOB-PLA-12 `pla:conciliar-post-restauracion`: para cada módulo con `restoreHooks`, `reconcileAfterRestore(tenantId, since=targetPointInTime)`: M05/M06 consultan ARCA por comprobantes autorizados posteriores (CAE/CAEA) y los reconstituyen desde `integrationOperations` (T06) (antes `externalOperations`) y evidencias guardadas; M07 consulta pasarelas/redes por pagos confirmados posteriores y los registra como “recuperados” sin volver a cobrar; T09 marca mensajes ya enviados para no reenviarlos; los jobs y eventos pendientes se reanudan con sus claves de idempotencia.
6. Informe de restauración (RTO real, diferencias, conciliación, issues) y fin del mantenimiento.

**Ensayos (JOB-PLA-13 `pla:ensayo-restauracion`)**: cada `PRM-PLA-014` días sobre una muestra de tenants (rotativa, todos al menos una vez por año) en modo `sandboxCopy` con verificación de hashes de documentos y descifrado de secretos; resultado en `restoreTests`.

### 9.8. Salida del tenant (CU-PLA-09)

1. Contrato `terminated` o pedido → `closing` con `readOnlyUntil = hoy + PRM-PLA-004`.
2. JOB-PLA-20 `pla:exportar-tenant` (cola `export`): llama `exportHooks` de cada módulo → JSONL por colección + CSV legibles + documentos (PDF/XML) + auditoría + manifiesto con sha256 → `tenantExports.ready` → notificación al administrador y contacto legal → descarga por URL firmada (registrada).
3. Al vencer `readOnlyUntil` (JOB-PLA-14 parte 1): `closed`; revoca accesos y API keys; desactiva dominios y landing (página de aviso).
4. Al vencer `purgeAfter` y sin `legalHold`: JOB-PLA-14 `pla:cerrar-y-purgar-tenant` parte 2 (antes se nombraba `pla:purgar-tenant`, que no existe en 12.3) llama `purgeHooks`, borra colecciones, objetos, claves Redis, backups lógicos fuera de retención; verificación final (0 documentos) y certificado PDF de purga.

### 9.9. Medición de uso y cupos

JOB-PLA-05 `pla:medir-uso` (diario, fan-out): llama `usageMeters` de cada módulo (contratos activos de `cat`/`per`, usuarios internos de `iam`, almacenamiento sumando `storedFiles`, mensajes de `com`, llamadas API de `bia`, tokens IA de `aiUsage`, sandboxes) → `usageSnapshots` → JOB-PLA-06 `pla:evaluar-cupos` compara con contrato → alertas PLA-ALR-08 y aplicación de política (PA-PLA-10) mediante flag `quotaBlocked.<dimension>` consultado por los módulos al crear (nunca en operaciones en curso, RN-PLA-016).

### 9.10. Alertas

JOB-PLA-07 `pla:evaluar-alertas` (cada minuto para reglas `metricThreshold`/`heartbeat`/`expiry`; las `eventMatch`/`jobFailure` se evalúan en el consumidor del evento): calcula `dedupeKey` → crea o incrementa alerta → notifica por canales (T09) → escalamiento por tiempo sin reconocimiento.

### 9.11. Despliegue y actualización (CU-PLA-10)

1. Merge a rama principal → pipeline (§7.10) → release `candidate`.
2. Staging: migraciones (expandir) → humo → e2e → aislamiento → carga (si release mayor) → evidencia de la matriz (RF-PLA-114).
3. Aprobación → anillo `internal` (tenant `PLATFORM` y demo) → `pilot` → `general`, cada uno con humo y ventana de observación `PRM-PLA-048` minutos; rollback automático si la tasa de errores supera el umbral.
4. Migraciones de contracción en un release posterior.
5. Publicación de notas de versión (PAN-PLA-19) y aviso “Nueva versión disponible” en PWA (RF-PLA-150).

### 9.12. Bandeja técnica y reprocesamiento

Operaciones/Soporte N2 revisa `deadLetters` (PAN-PLA-09): ver causa → corregir (configuración, dato, conector) → **reprocesar** (reencola con la misma clave de idempotencia) o **descartar** con justificación; si `businessImpact`, el tenant ve el caso en su bandeja operativa (T11) con explicación funcional, no técnica (AGR §5.5).

---

## 10. Pantallas

Patrón común (guía §8, CNX §4.2): AdminShell; rutas de plataforma con `meta.platformOnly` (estética diferenciada del contexto `PLATFORM`); `AdminStickyHeader` con título, subtítulo y acciones; `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso); `DataTable` genérico (columnas configurables, orden, filtros, paginación, exportar XLSX/CSV/PDF, selección masiva, vistas guardadas); modales `sm/md/lg/xl`; toasts y `ConfirmDialog`; estados vacíos honestos; todas las etiquetas `dict:pla.*`.

| PAN-ID | App | Ruta | Capability | Propósito | Contenido (filtros / columnas / campos) | Acciones y modales | Estado vacío / ayuda | Reemplaza (INV) |
|---|---|---|---|---|---|---|---|---|
| PAN-PLA-01 | plataforma | `/admin/plataforma/dashboard` | `pla.dashboard.ver` | Dashboard global (GOB-001) | Zona A KPIs §15.1 (tenants por estado, checklists incompletos, jobs fallidos, lag outbox, bandeja técnica, disponibilidad, último backup, ensayos vencidos, certificados a vencer, grants activos, casos por prioridad, versión por ambiente, uso vs cupo); Zona B selector de tenant/ambiente; alertas abiertas | Ir al detalle; reconocer alerta (modal sm) | “Sin alertas abiertas”; ficha de cada KPI | `Inicio_ProCoop` (avisos al abrir), `IconoNotificacion` |
| PAN-PLA-02 | plataforma | `/admin/plataforma/tenants` | `pla.tenants.ver` | Listado de tenants | Filtros: estado, clase, plan, anillo, región, implementador; columnas: código, nombre corto, CUIT, estado, plan, módulos en producción, % checklist, uso vs cupo, último backup, alertas | Nuevo (abre PAN-PLA-04), exportar, cambiar anillo masivo | “Todavía no hay cooperativas: iniciá un alta asistida” | `frmSelectConfiguracion`, `frmConfiguraciones` |
| PAN-PLA-03 | plataforma | `/admin/plataforma/tenants/:id` | `pla.tenants.ver` | Ficha del tenant | Pestañas: Identidad y contactos; Estado e historial (§8.1); Licencias y activaciones; Checklists; Contrato y uso; Dominios; Sandboxes; Soporte (casos/grants); Backups y restauraciones; Auditoría (vía T02) | Cambiar estado (modal md con motivo, checklist y confirmación), activar/desactivar módulo (modal md), editar identidad, verificar dominio, crear sandbox, solicitar exportación | — | `frmConfiguraciones`, `frmOpcionesEspeciales` |
| PAN-PLA-04 | plataforma | `/admin/plataforma/tenants/alta` | `pla.altaAsistida.usar` | Alta asistida (§9.1) | Asistente de 7 pasos; en Marca: subir logo/URL, botón “Proponer con IA”, paleta con contraste, preview celular PWA/landing, sugerencias de diccionario | Guardar borrador, proponer IA, aceptar/editar/descartar propuesta, confirmar alta (ConfirmDialog) | Ayuda: qué crea el alta y qué queda pendiente | — |
| PAN-PLA-05 | plataforma | `/admin/plataforma/catalogo` | `pla.catalogo.ver` | Catálogo de módulos vendibles | Filtros clase/grupo/estado/ola; columnas: código, etiqueta, clase, dependencias, packs, capabilities que cuelgan, checklist, estado | Nuevo/editar (modal lg), deprecar | — | `MODULOS` |
| PAN-PLA-06 | plataforma | `/admin/plataforma/planes` | `pla.planes.ver` | Planes/packs | Columnas: código, tamaño objetivo, módulos, cupos por defecto, estado | Nuevo/editar (modal lg) | “Sin planes: los módulos se licencian a la carta” | — |
| PAN-PLA-07 | plataforma | `/admin/plataforma/contratos` | `pla.contratos.ver` | Contratos SaaS | Filtros estado/vencimiento/plan; columnas: número, tenant, plan, vigencia, estado, cupos, región, versión | Nuevo/versión (modal xl), enviar a aprobación, aprobar/rechazar, adjuntar firmado, prefactura (exportar) | — | — |
| PAN-PLA-08 | plataforma | `/admin/plataforma/soporte/accesos` | `pla.soporte.accesos.ver` (antes `pla.accesos.ver`) | Accesos temporales | Filtros estado/modo/agente/tenant; columnas: tenant, caso, agente, modo, PII, alcance, desde/hasta, estado, acciones | Solicitar (modal md), aprobar (plataforma), iniciar sesión, revocar | — | `frmSoporteIP` |
| PAN-PLA-09 | plataforma | `/admin/plataforma/operacion/jobs` | `pla.jobs.ver` | Salud de colas, jobs, outbox y bandeja técnica | Pestañas: Colas (profundidad, activos, demorados, fallidos, estancados por cola y tenant); Jobs (`jobRuns`); Outbox (lag, pendientes); Bandeja técnica (`deadLetters`) | Reintentar, cancelar, pausar/reanudar cola, reprocesar/descartar DLQ (modal md con justificación) | “Sin fallos” | `frmProgressBar_WithLog`, `frmProcesoAutomatico`, `IconoNotificacion.btnTareasProgramadas` |
| PAN-PLA-10 | plataforma | `/admin/plataforma/operacion/backups` | `pla.backups.ver` | Backups | Políticas; ejecuciones por tenant (tipo, estado, tamaño, checksum, retención, verificado); ensayos | Ejecutar backup lógico a demanda, verificar | — | `frmOpcionesEspeciales.GenerarBackup`, `frmBaseDatos` |
| PAN-PLA-11 | plataforma | `/admin/plataforma/operacion/restauraciones` | `pla.restauraciones.solicitar` | Restauraciones | Lista RST-…; detalle con diff por colección y conciliación | Solicitar (modal lg), aprobar, confirmar ejecución (ConfirmDialog doble), ver informe | — | `frmRecuperaConfiguracion` |
| PAN-PLA-12 | plataforma | `/admin/plataforma/alertas` | `pla.alertas.ver` | Alertas y reglas | Alertas (severidad, estado, objeto, conteo, primera/última); reglas (condición, umbral, destinatarios, canales) | Reconocer, resolver, silenciar; editar regla (modal lg) | — | — |
| PAN-PLA-13 | plataforma | `/admin/plataforma/incidentes` | `pla.incidentes.ver` | Incidentes de plataforma | Número, severidad, estado, tenants/módulos afectados, inicio/fin, casos vinculados | Nuevo, actualizar estado y mensaje público, vincular casos, adjuntar postmortem | — | — |
| PAN-PLA-14 | plataforma y admin | `/admin/plataforma/sandboxes` y `/admin/pla/sandbox` | `pla.sandbox.crear` / `pla.sandbox.ver` | Sandboxes | Tenant, ambiente, estado, última sincronización, datos (ficticios/anonimizados) | Crear, sincronizar paquete, solicitar copia anonimizada, abrir sandbox | — | — |
| PAN-PLA-15 | admin (tenant) | `/admin/pla/suscripcion` | `pla.miSuscripcion.ver` | Mi suscripción | Plan, módulos licenciados y activos, cupos y consumo (gráfico de barras), vigencia, región, objetivos de servicio | Solicitar cambio (abre caso de soporte comercial) | — | — |
| PAN-PLA-16 | admin (tenant) | `/admin/pla/habilitacion` | `pla.habilitacion.ver` | Habilitación de la cooperativa | Estado del tenant; por capacidad: checklist con ítem, estado, responsable, enlace a la pantalla que lo resuelve; explicación “depende del contrato SaaS / depende de tu catálogo” (RF-PLA-077) | Marcar ítem manual con evidencia (modal md) | Ayuda: qué significa cada estado | — |
| PAN-PLA-17 | admin (tenant) | `/admin/pla/soporte` | `pla.soporte.ver` | Casos de soporte de plataforma | Número, título, módulo, prioridad, estado, SLA; detalle con conversación | Nuevo caso (modal lg con detector de secretos), responder, adjuntar, reabrir, cerrar, encuesta | “No tenés casos abiertos” | Webchat de soporte, `IniciarTeamViewer` |
| PAN-PLA-18 | admin (tenant) | `/admin/pla/accesos-soporte` | `pla.soporte.accesos.ver` (antes `pla.accesosSoporte.ver`) | Accesos de soporte a mi cooperativa | Pendientes de aprobación, activos, históricos; sesiones; enlace a auditoría filtrada | Aprobar/rechazar (modal md con alcance y duración), revocar | “Ningún agente accedió a tus datos” | — |
| PAN-PLA-19 | admin (tenant) | `/admin/pla/novedades` | `pla.novedadesPlataforma.ver` | Lo nuevo y avisos | Notas de versión por módulo, avisos de mantenimiento, incidentes que afectan al tenant | Marcar leído | — | `frmLoNuevo`, `frmAdjuntoProcoopar`, RSS del proveedor, `frmEncuestas` |
| PAN-PLA-20 | plataforma | `/admin/plataforma/releases` | `pla.releases.ver` | Releases y feature flags | Releases por ambiente/anillo, migraciones, digests; flags con reglas por anillo/tenant y vencimiento | Promover (con gates), rollback, editar flag | — | `frmChequearVersion`, `frmActualizar`, `frmProcesos` |
| PAN-PLA-21 | plataforma | `/admin/plataforma/soporte/casos` | `pla.soporte.ver` | Bandeja de soporte de plataforma | Filtros cola/prioridad/estado/SLA/tenant; columnas: número, tenant, título, prioridad, estado, asignado, vence | Asignar, cambiar estado, mensaje público/interno, vincular incidente, solicitar acceso | — | — |
| PAN-PLA-22 | plataforma | `/admin/plataforma/uso` | `pla.uso.ver` | Uso por tenant | Matriz tenant × dimensión con % de cupo y tendencia | Exportar | — | — |
| PAN-PLA-23 | admin (tenant) | `/admin/pla/exportaciones` | `pla.exportacion.solicitar` | Exportación completa de datos | Solicitudes, estado, tamaño, vencimiento, descargas | Solicitar exportación (ConfirmDialog), descargar | — | `frmBaseDatos.ExportarAuditoriaExcel`, `frmExportacionArchivos` (parcial) |
| PAN-PLA-24 | landing (pública) | `/estado` del dominio de plataforma y banda en admin/PWA | Pública, sin sesión, en el dominio de plataforma; la banda en admin y PWA se muestra a todo usuario con sesión del tenant afectado (antes "—") | Estado del servicio | Componentes y su estado; incidentes en curso para el tenant | — | “Todos los sistemas operativos” | — |
| PAN-PLA-25 | plataforma | `/admin/plataforma/sistema` | `pla.salud.ver` | Inventario técnico | Módulos registrados (manifiestos), rutas, eventos, jobs, colecciones, versión de esquema; health por componente | Exportar inventario | — | `frmBaseDatos` (conexiones abiertas, procesos bloqueados, reindex) |

---

## 11. API

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-PLA-01 | GET | `/api/platform/tenants` | `pla.tenants.ver` | Lista paginada con filtros | — |
| API-PLA-02 | POST | `/api/platform/tenants` | `pla.tenants.crear` | Alta directa (sin asistente) | Sí (`Idempotency-Key`) |
| API-PLA-03 | GET | `/api/platform/tenants/:id` | `pla.tenants.ver` | Ficha | — |
| API-PLA-04 | PATCH | `/api/platform/tenants/:id` | `pla.tenants.editar` | Editar identidad, contactos, zona, anillo (con `version`) | Sí (control optimista) |
| API-PLA-05 | POST | `/api/platform/tenants/:id/transitions` | `pla.tenants.cambiarEstado` | Transición de estado `{to, reason, suspension?, closing?}` | Sí |
| API-PLA-06 | GET | `/api/platform/tenants/:id/checklists` | `pla.checklists.ver` | Checklists del tenant | — |
| API-PLA-07 | POST | `/api/platform/tenants/:id/checklists/:capability/evaluate` | `pla.checklists.verificar` | Reevaluar ahora | Sí |
| API-PLA-08 | POST | `/api/platform/tenants/:id/checklists/:capability/items/:code` | `pla.checklists.verificar` | Verificar/dispensar ítem manual con evidencia | Sí |
| API-PLA-09 | GET | `/api/platform/tenants/:id/modules` | `pla.licencias.ver` | Licencias + activaciones + efectivos | — |
| API-PLA-10 | PUT | `/api/platform/tenants/:id/licenses/:moduleCode` | `pla.licencias.editar` | Alta/edición de licencia | Sí |
| API-PLA-11 | POST | `/api/platform/tenants/:id/modules/:moduleCode/activate` | `pla.licencias.editar` | Cambio de modo `{mode, newSalesBlocked?, reason}` | Sí |
| API-PLA-12 | POST | `/api/platform/onboarding/drafts` | `pla.altaAsistida.usar` | Crear borrador | Sí |
| API-PLA-13 | PATCH | `/api/platform/onboarding/drafts/:id` | `pla.altaAsistida.usar` | Guardar paso | Sí |
| API-PLA-14 | POST | `/api/platform/onboarding/drafts/:id/ai-proposal` | `pla.altaAsistida.usar` | Encola propuesta IA; devuelve `jobRunId` | Sí |
| API-PLA-15 | POST | `/api/platform/onboarding/drafts/:id/confirm` | `pla.tenants.crear` | Confirma alta | Sí |
| API-PLA-16 | GET/POST/PATCH | `/api/platform/module-catalog[/:code]` | `pla.catalogo.ver` / `pla.catalogo.editar` | Catálogo de módulos | Sí (POST/PATCH) |
| API-PLA-17 | GET/POST/PATCH | `/api/platform/plans[/:code]` | `pla.planes.ver` / `pla.planes.editar` | Planes | Sí |
| API-PLA-18 | GET/POST | `/api/platform/saas-contracts` | `pla.contratos.ver` / `pla.contratos.crear` | Lista / alta | Sí |
| API-PLA-19 | PATCH | `/api/platform/saas-contracts/:id` | `pla.contratos.editar` | Edición de borrador o nueva versión | Sí |
| API-PLA-20 | POST | `/api/platform/saas-contracts/:id/transitions` | `pla.contratos.aprobar` | Enviar, aprobar, rechazar, terminar | Sí |
| API-PLA-21 | GET | `/api/platform/usage?tenantId=&from=&to=` | `pla.uso.ver` | Uso por tenant y dimensión | — |
| API-PLA-22 | GET | `/api/platform/saas-contracts/:id/pre-invoice?period=` | `pla.facturacionSaas.exportar` | Prefactura exportable | — |
| API-PLA-23 | GET | `/api/platform/support/cases` | `pla.soporte.ver` | Bandeja global | — |
| API-PLA-24 | PATCH | `/api/platform/support/cases/:id` | `pla.soporte.editar` | Asignar, prioridad, estado, incidente | Sí |
| API-PLA-25 | POST | `/api/platform/support/cases/:id/messages` | `pla.soporte.editar` | Mensaje público/interno | Sí |
| API-PLA-26 | POST | `/api/platform/support/grants` | `pla.soporte.accesos.solicitar` (antes `pla.accesos.solicitar`) | Solicitar acceso temporal | Sí |
| API-PLA-27 | POST | `/api/platform/support/grants/:id/decision` | `pla.soporte.accesos.aprobar` (antes `pla.accesos.aprobar`) | Aprobación de plataforma (observe sin PII, break-glass) | Sí |
| API-PLA-28 | POST | `/api/platform/support/grants/:id/sessions` | `pla.soporte.accesos.solicitar` (antes `pla.accesos.solicitar`) (agente titular) | Inicia sesión de soporte y emite token | Sí |
| API-PLA-29 | POST | `/api/platform/support/grants/:id/revoke` | `pla.soporte.accesos.revocar` (antes `pla.accesos.revocar`) | Revoca | Sí |
| API-PLA-30 | GET/POST/PATCH | `/api/platform/incidents[/:id]` | `pla.incidentes.ver` / `pla.incidentes.editar` | Incidentes | Sí |
| API-PLA-31 | GET | `/api/platform/dashboard/summary` | `pla.dashboard.ver` | KPIs §15.1 | — |
| API-PLA-32 | GET | `/api/platform/alerts` | `pla.alertas.ver` | Alertas | — |
| API-PLA-33 | POST | `/api/platform/alerts/:id/{ack,resolve,silence}` | `pla.alertas.reconocer` | Ciclo de alerta | Sí |
| API-PLA-34 | GET/POST/PATCH | `/api/platform/alert-rules[/:code]` | `pla.alertas.configurar` | Reglas de plataforma | Sí |
| API-PLA-35 | GET | `/api/platform/ops/queues` | `pla.jobs.ver` | Métricas de colas por tenant | — |
| API-PLA-36 | GET | `/api/platform/ops/job-runs` | `pla.jobs.ver` | Jobs | — |
| API-PLA-37 | POST | `/api/platform/ops/job-runs/:id/{retry,cancel}` | `pla.jobs.reintentar` / `pla.jobs.cancelar` | Reintento/cancelación | Sí |
| API-PLA-38 | POST | `/api/platform/ops/queues/:name/{pause,resume}` | `pla.colas.pausar` | Pausa de cola | Sí |
| API-PLA-39 | GET | `/api/platform/ops/outbox` | `pla.jobs.ver` | Lag y pendientes | — |
| API-PLA-40 | GET/POST | `/api/platform/ops/dead-letters[/:id/{reprocess,discard}]` | `pla.deadLetters.reprocesar` | Bandeja técnica | Sí |
| API-PLA-41 | GET | `/api/platform/backups/runs` | `pla.backups.ver` | Ejecuciones | — |
| API-PLA-42 | POST | `/api/platform/backups/tenants/:id/run` | `pla.backups.ejecutar` | Backup lógico a demanda | Sí |
| API-PLA-43 | GET/POST | `/api/platform/restores` | `pla.restauraciones.solicitar` | Lista / solicitud | Sí |
| API-PLA-44 | POST | `/api/platform/restores/:id/{approve,execute,cancel}` | `pla.restauraciones.aprobar` / `pla.restauraciones.ejecutar` | Ciclo de restauración | Sí |
| API-PLA-45 | GET | `/api/platform/restore-tests` | `pla.backups.ver` | Ensayos | — |
| API-PLA-46 | POST | `/api/platform/tenants/:id/sandboxes` | `pla.sandbox.crear` | Crear sandbox | Sí |
| API-PLA-47 | POST | `/api/platform/tenants/:id/sandboxes/:sbx/sync` | `pla.sandbox.crear` | Transferir paquete de configuración / copia anonimizada | Sí |
| API-PLA-48 | GET/POST | `/api/platform/releases[/:version/promote\|rollback]` | `pla.releases.ver` / `pla.releases.publicar` | Releases | Sí |
| API-PLA-49 | GET/PUT | `/api/platform/feature-flags[/:key]` | `pla.flags.editar` | Flags | Sí |
| API-PLA-50 | GET | `/api/platform/system/{modules,routes,events,jobs}` | `pla.salud.ver` | Inventario técnico | — |
| API-PLA-51 | POST | `/api/platform/tenants/:id/exports` | `pla.tenants.editar` | Exportación de salida/legal | Sí |
| API-PLA-52 | GET | `/api/admin/pla/subscription` | `pla.miSuscripcion.ver` | Mi suscripción (proyección sin datos internos) | — |
| API-PLA-53 | GET | `/api/admin/pla/enablement` | `pla.habilitacion.ver` | Estado y checklists propios | — |
| API-PLA-54 | POST | `/api/admin/pla/enablement/:capability/items/:code` | `pla.habilitacion.verificar` | Verificar ítem manual propio | Sí |
| API-PLA-55 | GET/POST | `/api/admin/pla/support-cases` | `pla.soporte.ver` / `pla.soporte.crear` | Casos propios | Sí (POST) |
| API-PLA-56 | POST | `/api/admin/pla/support-cases/:id/{messages,reopen,close,survey}` | `pla.soporte.crear` | Interacción | Sí |
| API-PLA-57 | GET | `/api/admin/pla/support-grants` | `pla.soporte.accesos.ver` (antes `pla.accesosSoporte.ver`) | Accesos a mi tenant y sesiones | — |
| API-PLA-58 | POST | `/api/admin/pla/support-grants/:id/{approve,reject,revoke}` | `pla.soporte.accesos.aprobar` (antes `pla.accesosSoporte.aprobar`) / `pla.soporte.accesos.revocar` (antes `pla.accesosSoporte.revocar`) | Decisión del tenant | Sí |
| API-PLA-59 | GET/POST | `/api/admin/pla/exports` | `pla.exportacion.solicitar` | Exportación completa | Sí |
| API-PLA-60 | GET | `/api/admin/pla/release-notes` | `pla.novedadesPlataforma.ver` | Lo nuevo y avisos | — |
| API-PLA-61 | GET | `/api/admin/pla/status` | `pla.estado.ver` | Estado del tenant (banda, suspensión, mantenimiento) | — |
| API-PLA-62 | GET | `/api/files/:id/url` | `pla.archivos.ver` (implícita; el control efectivo es la capability de lectura del módulo dueño, que confirma `canAccessFile`; antes "capability de lectura de la entidad dueña del archivo, según storedFiles.moduleCode y ownerRef") | URL firmada de descarga | — |
| API-PLA-63 | POST | `/api/files/uploads` / `/api/files/uploads/:id/complete` | `pla.archivos.subir` (implícita; el control efectivo es la capability de alta o edición del módulo dueño; antes "capability de edición de la entidad a la que se adjunta") | URL firmada de subida y confirmación | Sí |
| API-PLA-64 | GET | `/api/public/:tenantSlug/bootstrap` (ruta de API-POR-01; antes `:slug`) | `public: true` (antes "pública") | **Referencia a API-POR-01** (dueño M19; no es un endpoint propio de T01; antes "Reemplazada por API-POR-01"), mismo endpoint: T01 aporta al payload los módulos y canales activos y el estado del tenant (sin datos internos). Motivo: T01, T03 y M19 declaraban la misma ruta | Sí (GET) |
| API-PLA-65 | GET | `/api/public/platform/status` | `public: true` (antes "público") | Estado de servicio (PAN-PLA-24) | — |
| API-PLA-66 | GET | `/health/live`, `/health/ready` | `pla.salud.sondear` (S-SYS; solo red privada del orquestador, sin sesión; antes "Infraestructura: solo red privada del orquestador") | Salud para el orquestador | — |
| API-PLA-67 | GET | `/api/me/job-runs/:id` | `pla.misProcesos.ver` (alcance self: solo quien lanzó el job; antes "sesión con alcance self sobre jobRuns.requestedBy") | Progreso de un job lanzado por el usuario | — |

Errores específicos (`type` RFC 9457): `tenant-context-missing` (500, solo en desarrollo), `tenant-suspended` (423), `tenant-closed` (410), `module-not-licensed` (403), `module-inactive` (403), `module-read-only` (409), `checklist-incomplete` (409, con `items[]`), `dependency-inactive` (409), `quota-exceeded` (429/409 según política), `idempotency-conflict` (422), `support-grant-expired` (401), `transition-not-allowed` (409), `version-conflict` (409).

---

## 12. Eventos y jobs

### 12.1. Eventos emitidos

| EVT-ID | Tipo | Payload principal | Consumidores |
|---|---|---|---|
| EVT-PLA-01 | `pla.tenant.created` | tenantId, code, kind, planCode, legalName, cuit, legalForm, inaesRegistration, fiscalAddress | `iam` (invitación admin), `uxd` (branding), `com` (aviso), `pla` (checklist), `cfg` (entidad jurídica por defecto y casa central, T04 §9.16, DEC-064) |
| EVT-PLA-02 | `pla.tenant.statusChanged` | from, to, reason | `iam` (tokens), `core/http` (caché de estado), `bia`, `com` |
| EVT-PLA-03 | `pla.tenant.suspended` | mode, portalMode, reasonCode | `core/jobs` (pausa), `com`, `por` (banda) |
| EVT-PLA-04 | `pla.tenant.reactivated` | tenantId, previousReasonCode, suspendedSince, skippedJobsCount (los de T11 EVT-PLA-04; antes "—") | `core/jobs` (reanuda), `com` |
| EVT-PLA-05 | `pla.tenant.closed` | stage (`closing`/`closed`/`purged`) | `iam` (revoca), `int` (desactiva webhooks), `com` |
| EVT-PLA-06 | `pla.capability.activated` | moduleCode, mode | módulo activado (fan-out de jobs), `uxd` (menú), `com` |
| EVT-PLA-07 | `pla.capability.deactivated` | moduleCode, newMode | módulo afectado (detiene jobs), `uxd` |
| EVT-PLA-08 | `pla.license.updated` | moduleCode, validFrom, validTo, status | `pla` (activaciones), `com` |
| EVT-PLA-09 | `pla.saasContract.approved` | contractId, version | `pla` (licencias, checklist), `con` de `PLATFORM` (si PA-PLA-08 A) |
| EVT-PLA-10 | `pla.usage.thresholdReached` | dimension, pct, level (`soft`/`hard`) | `pla` (alertas), módulos (flag de cupo), `com` |
| EVT-PLA-11 | `pla.supportCase.opened` / `.updated` / `.resolved` | caseId, status, priority | `com` (notificaciones), `pla` (SLA) |
| EVT-PLA-12 | `pla.supportGrant.requested` / `.approved` / `.activated` / `.revoked` / `.expired` | grantId, mode, breakGlass | `iam` (tokens de soporte y revocación), `com` (aviso al tenant), `pla` (alertas) |
| EVT-PLA-13 | `pla.backup.completed` / `pla.backup.failed` | runId, type, tenantId | `pla` (checklist, alertas) |
| EVT-PLA-14 | `pla.restore.requested` / `.completed` | requestId, mode, point | módulos con `restoreHooks`, `com` |
| EVT-PLA-15 | `pla.sandbox.created` | sandboxTenantId, environment | `com` |
| EVT-PLA-16 | `pla.release.deployed` | version, environment, ring | `com` (notas), PWA (aviso de versión) |
| EVT-PLA-17 | `pla.alert.raised` / `pla.alert.resolved` | alertId, ruleCode, severity | `com` (canales) |
| EVT-PLA-18 | `pla.tenantExport.ready` | exportId, purpose | `com` |
| EVT-PLA-19 | `pla.incident.updated` | incidentId, status, affectedTenantIds | `pla` (casos vinculados), `com` |
| EVT-PLA-20 | `pla.checklist.changed` | capabilityCode, overallStatus, itemsChanged | `com`, `bia` (configuraciones pendientes) |
| EVT-PLA-21 | `pla.branch.created` / `.updated` | branchId, code, name, status | `uxd` (slots de marca por sucursal), `cfg` — **Reemplazado por EVT-CFG-20 `cfg.branch.created/.updated/.deactivated` de T04** (dueño de `branches`, DEC-064; CTR-PLA-17) |
| EVT-PLA-22 | `pla.tenantProfile.updated` | tenantId, changedFields (razón social, CUIT, domicilio legal, logo) | `uxd` (pie y documentos), `wfl` (plantillas), `fis`. Los cambios de datos legales de cada entidad jurídica se publican en EVT-CFG-19 `cfg.legalEntity.updated` de T04 (DEC-064); este evento queda para los datos de contratación del tenant |

### 12.2. Eventos consumidos

`iam.mfa.enrolled` (EVT-IAM-08), `iam.membership.suspended` / `.revoked` (EVT-IAM-03), `uxd.branding.published` (EVT-UXD-01), `cfg.configVersion.published` (EVT-CFG-05), `tar.schedule.published` (EVT-TAR-004), `fis.credential.verified`, `int.credential.expiring` / `.rotated` (EVT-INT-05), `int.circuit.opened` / `.closed` (EVT-INT-04), `int.connection.activated` (EVT-INT-01), `int.agent.offline` (EVT-INT-22), `mig.openingBalances.approved`, `fac.cae.pendingThreshold`, y los eventos genéricos `*.job.failed` del núcleo (alertas PLA-ALR-07).

### 12.3. Jobs

| JOB-ID | Nombre | Cola | Ámbito | Frecuencia | Descripción |
|---|---|---|---|---|---|
| JOB-PLA-01 | `pla:outbox-relay` | — (proceso dedicado; excepción documentada en §7.6) | plataforma | Continuo + sondeo `PRM-PLA-029` | Entrega de eventos (§7.6) |
| JOB-PLA-02 | `pla:evaluar-checklist` | `events` | tenant | Por evento y diario 03:00 | Evalúa checklists (§9.2) |
| JOB-PLA-03 | `pla:vencimientos-contratos-licencias` | `maintenance` | plataforma (fan-out) | Diario 02:00 | Expira licencias/contratos, alertas PLA-ALR-09 |
| JOB-PLA-04 | `pla:expirar-accesos-soporte` | `events` | plataforma | Evento EVT-IAM-11 | Reacción: al recibir EVT-IAM-11 (`iam.supportAccess.ended` / `.revoked`) emite EVT-PLA-12 `pla.supportGrant.expired`; no revoca tokens. Ver JOB-IAM-02 (dueño). |
| JOB-PLA-05 | `pla:medir-uso` | `maintenance` | fan-out | Diario 01:00 | Snapshots de uso |
| JOB-PLA-06 | `pla:evaluar-cupos` | `maintenance` | tenant | Tras JOB-PLA-05 | Alertas y flags de cupo |
| JOB-PLA-07 | `pla:evaluar-alertas` | `maintenance` | plataforma | Cada minuto | Reglas de métricas, latidos y vencimientos |
| JOB-PLA-08 | `pla:recolectar-salud` | `maintenance` | plataforma | Cada `PRM-PLA-043` s | `healthSnapshots`, uptime sintético por tenant |
| JOB-PLA-09 | `pla:backup-logico-tenant` | `maintenance` | fan-out | Diario (escalonado) | Backup lógico por tenant |
| JOB-PLA-10 | `pla:verificar-backups` | `maintenance` | plataforma | Diario | Checksums, PITR disponible |
| JOB-PLA-11 | `pla:restaurar-tenant` | `maintenance` (worker dedicado) | tenant | A demanda | §9.7 pasos 2–4 |
| JOB-PLA-12 | `pla:conciliar-post-restauracion` | `integration` | tenant | Tras JOB-PLA-11 | §9.7 paso 5 |
| JOB-PLA-13 | `pla:ensayo-restauracion` | `maintenance` | plataforma | Cada `PRM-PLA-014` días | Ensayo con evidencia |
| JOB-PLA-14 | `pla:cerrar-y-purgar-tenant` | `maintenance` | tenant | Diario (evalúa fechas) | Cerrado y purga con certificado |
| JOB-PLA-15 | `pla:crear-sandbox` | `maintenance` | tenant | A demanda | Crea gemelo en `sandbox` |
| JOB-PLA-16 | `pla:propuesta-ia-alta` | `interactive` | plataforma | A demanda | Propuesta de marca y diccionario |
| JOB-PLA-17 | `pla:limpiar-borradores-y-temporales` | `maintenance` | plataforma | Diario | Borradores vencidos, exportaciones vencidas, idempotencia expirada (además del TTL), archivos huérfanos no confirmados |
| JOB-PLA-18 | `pla:sincronizar-config-sandbox` | `maintenance` | tenant | A demanda | Transferencia de paquetes T04 |
| JOB-PLA-19 | `pla:copia-anonimizada` | `maintenance` | tenant | A demanda (aprobada) | Copia anonimizada a sandbox |
| JOB-PLA-20 | `pla:exportar-tenant` | `export` | tenant | A demanda / salida | Exportación completa |
| JOB-PLA-21 | `pla:escanear-archivo` | `interactive` | tenant | Por subida | Antivirus y tipo real |
| JOB-PLA-22 | `pla:sla-soporte` | `maintenance` | plataforma | Cada 5 min | Vencimientos de SLA y escalamiento; cierre automático de casos resueltos |

Todos idempotentes por `jobKey`; los de fan-out encolan un job por tenant con `jobKey = <nombre>:<tenantId>:<fecha>`.

---

## 13. Integraciones

El marco de integraciones, la bóveda de credenciales por cooperativa, los conectores y el agente local están en **T06 INT**. Particularidades de plataforma:

| Integración | Uso en PLA | Particularidad |
|---|---|---|
| Padrón ARCA (consulta por CUIT) | Precarga de identidad en el alta (RF-PLA-059) | Solo propone; credenciales de la plataforma (no del tenant) para el alta. |
| Proveedor de IA (OpenAI/Anthropic) | Propuesta de marca y diccionario (RF-PLA-057) | Proveedor con retención cero o contractual mínima; sin entrenamiento con datos de clientes; medición `aiUsage`. |
| Proveedor de base de datos gestionada (Atlas o equivalente) | Snapshots, PITR, cluster aislado de restauración | Vía `adapters/backupProvider`; credenciales en gestor de secretos de plataforma. |
| Almacenamiento S3 | Archivos, exportaciones, backups | §7.7. |
| Correo transaccional de plataforma (SES/SMTP) | Avisos de plataforma, invitaciones, alertas | Remitente de plataforma distinto del remitente verificado de cada tenant (T09). |
| ChatOps / webhook de guardia | Alertas críticas a operaciones | Destino configurado por regla; sin datos personales en el mensaje. |
| Página de estado | Incidentes públicos (PAN-PLA-24) | Propia o servicio externo; sin datos de tenants. |
| DNS/TLS (certificados automáticos) | Subdominios y dominios propios verificados | Verificación por registro TXT/CNAME; renovación automática; alerta PLA-ALR-14. Al quitar un dominio propio o dar de baja el tenant se retiran la ruta y el certificado y se pide a la cooperativa borrar el CNAME; un control diario alerta los CNAME que siguen apuntando a la plataforma sin tenant activo, y un dominio retirado solo se reasigna con nueva verificación TXT (DEC-092). |
| Bóveda de T06 (metadatos) | Vencimientos de certificados, estado de credenciales para checklists | PLA **nunca** lee el secreto, solo `expiresAt`, `environment`, `status`. |
| `integrationOperations` de T06 (antes `externalOperations`) | Conciliación posrestauración (ESC-04) | Registro de cada operación con tercero (id externo, estado, evidencia). |
| Agente local de hardware (T06, O10) | Latido para alerta PLA-ALR-03 | Reemplaza `Agente Procoop.exe` vigilado por modo 11. |

---

## 14. Parámetros de configuración

Declarados en el registro de parámetros de T04 (ámbitos: plataforma, tenant). Los valores marcados “A validar” dependen de PA.

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n / fuente |
|---|---|---|---|---|---|---|
| PRM-PLA-001 | `pla.tenant.codePattern` | regex | plataforma | `^[a-z0-9-]{3,30}$` | Formato del código de tenant | — |
| PRM-PLA-002 | `pla.tenant.defaults` | objeto {timezone, locale, currency} | plataforma | `America/Argentina/Cordoba`, `es-AR`, `ARS` | Valores por defecto del alta | Guía §5; V2 #518–527, #709 (datos de empresa → entidad tenant) |
| PRM-PLA-003 | `pla.suspension.defaultMode` | enum `readOnlyStaff`/`blockedStaff` | plataforma | `readOnlyStaff` | Modo de suspensión por defecto | — |
| PRM-PLA-004 | `pla.closing.readOnlyDays` | int | plataforma (contrato puede sobrescribir) | 90 (A validar PA-PLA-12) | Días de solo lectura en cierre | — |
| PRM-PLA-005 | `pla.closing.purgeAfterDays` | int | plataforma | 365 (A validar PA-PLA-12) | Días en Cerrado antes de purgar | — |
| PRM-PLA-006 | `pla.suspension.portalMode` | enum `fullService`/`readAndPay`/`readOnly`/`offline` | plataforma/tenant | `readAndPay` (A validar PA-PLA-04) | Portal del socio durante la suspensión | — |
| PRM-PLA-007 | `pla.auth.modulesRefreshSeconds` | int | plataforma | 60 | Tiempo máximo hasta reflejar cambios de módulos/revocaciones en tokens | — |
| PRM-PLA-008 | `pla.license.trialDays` | int | plataforma | 30 | Días de licencia `trial` por defecto | V2: demo de 30 días de `ValidarVersion` (RN-09 §5.4) |
| PRM-PLA-009 | `pla.support.grantMaxHours` | int | plataforma | 8 | Duración máxima de un grant | — |
| PRM-PLA-010 | `pla.support.grantDefaultHours` | int | plataforma | 2 | Duración propuesta | — |
| PRM-PLA-011 | `pla.support.breakGlassMaxHours` | int | plataforma | 2 | Duración máxima de break-glass | — |
| PRM-PLA-012 | `pla.backup.pitrRetentionDays` | int | plataforma | 35 | Retención de PITR | — |
| PRM-PLA-013 | `pla.backup.logicalRetention` | objeto {daily, monthly, yearly} | plataforma | 35 diarios, 12 mensuales, 5 anuales (A validar T08) | Retención de backups lógicos por tenant | V2 #2786/#2051 (aviso backups) |
| PRM-PLA-014 | `pla.backup.restoreTestEveryDays` | int | plataforma | 90 | Frecuencia de ensayos | — |
| PRM-PLA-015 | `pla.backup.rpoMinutesTarget` | int | plataforma/contrato | 15 (A validar PA-PLA-02) | RPO objetivo | — |
| PRM-PLA-016 | `pla.backup.rtoTenantHoursTarget` | int | plataforma/contrato | 4 (A validar PA-PLA-02) | RTO de un tenant | — |
| PRM-PLA-017 | `pla.backup.rtoPlatformHoursTarget` | int | plataforma | 8 (A validar PA-PLA-02) | RTO de plataforma completa | — |
| PRM-PLA-018 | `pla.slo.availabilityMonthlyPct` | decimal | plataforma/contrato | 99,5 (A validar PA-PLA-03) | Disponibilidad objetivo | — |
| PRM-PLA-019 | `pla.slo.apiP95Ms` | int | plataforma | 800 interactivo (A validar PA-PLA-03) | Latencia p95 objetivo | — |
| PRM-PLA-020 | `pla.storage.signedUrlTtlSeconds` | int | plataforma | 300 | Vida de URL firmada | — |
| PRM-PLA-021 | `pla.storage.maxUploadMb` | int | plataforma/tenant | 25 | Tamaño máximo por archivo | — |
| PRM-PLA-022 | `pla.queues.concurrency` | objeto por cola | plataforma | tabla §7.6 | Concurrencia global | — |
| PRM-PLA-023 | `pla.queues.tenantBatchConcurrency` | int | plataforma/contrato | 2 | Jobs `batch` simultáneos por tenant | — |
| PRM-PLA-024 | `pla.exports.fileTtlDays` | int | plataforma | 7 | Vida de archivos de exportación | — |
| PRM-PLA-025 | `pla.exports.maxConcurrentPerTenant` | int | plataforma | 1 | Exportaciones simultáneas por tenant | — |
| PRM-PLA-026 | `pla.idempotency.ttlHours` | int | plataforma | 72 | Retención de claves de idempotencia | — |
| PRM-PLA-027 | `pla.outbox.retry` | objeto {maxAttempts, baseMs, maxMs} | plataforma | 10, 1.000, 3.600.000 | Reintentos de eventos | — |
| PRM-PLA-028 | `pla.jobs.retryDefault` | objeto {maxAttempts, baseMs} | plataforma | 5, 5.000 | Reintentos de jobs | — |
| PRM-PLA-029 | `pla.outbox.pollIntervalMs` | int | plataforma | 2.000 | Sondeo de respaldo del relay | — |
| PRM-PLA-030 | `pla.outbox.lagAlertSeconds` | int | plataforma | 60 | Umbral PLA-ALR-05 | — |
| PRM-PLA-031 | `pla.quota.softPct` | int | plataforma/contrato | 80 | % de cupo para aviso | — |
| PRM-PLA-032 | `pla.contract.graceDays` | int | plataforma/contrato | 15 | Gracia tras vencer contrato | — |
| PRM-PLA-033 | `pla.alerts.dedupeWindowMinutes` | int | plataforma | 60 | Ventana de deduplicación | — |
| PRM-PLA-034 | `pla.support.autoCloseDays` | int | plataforma | 7 | Cierre automático de resueltos / ventana de reapertura | — |
| PRM-PLA-035 | `pla.support.slaTargets` | objeto por prioridad | plataforma/contrato | P1: 1 h / 8 h; P2: 4 h / 2 d; P3: 1 d / 5 d; P4: 2 d / a planificar (A validar PA-PLA-03) | Primera respuesta / resolución | — |
| PRM-PLA-036 | `pla.support.hours` | objeto | plataforma/contrato | Lun–vie 8–18 (zona del tenant); P1 24×7 (A validar PA-PLA-03) | Horario de soporte | — |
| PRM-PLA-037 | `pla.rateLimit` | objeto {loginPerIpPerMin, recoveryPerIpPerHour, portalPerIpPerMin, adminPerTenantPerMin, aiPerUserPerMin, uploadsPerUserPerMin} | plataforma | 5, 5, 120, 1.200, 10, 30 | Límites de tasa | CNX §10 V-07 |
| PRM-PLA-038 | `pla.sandbox.emailAllowlist` | string[] | tenant (sandbox) | dominios de la cooperativa | Destinatarios permitidos en sandbox | — |
| PRM-PLA-039 | `pla.onboarding.draftExpiryDays` | int | plataforma | 30 | Vencimiento de borradores | — |
| PRM-PLA-040 | `pla.ai.onboardingEnabled` | bool | plataforma | true | IA en el alta | — |
| PRM-PLA-041 | `pla.ai.provider` | enum `auto`/`openai`/`anthropic` | plataforma | `auto` | Proveedor IA | CNX §2.1 (`AI_PROVIDER=auto`) |
| PRM-PLA-042 | `pla.ai.timeoutSeconds` | int | plataforma | 120 | Timeout de llamadas IA | CNX §2.8 (7 min) — reducido; lo largo va como job |
| PRM-PLA-043 | `pla.health.intervalSeconds` | int | plataforma | 30 | Recolección de salud | — |
| PRM-PLA-044 | `pla.observability.retentionDays` | objeto {logs, metrics, health} | plataforma | 30, 395, 30 | Retención técnica | V2 purga `AUDIT_MAIL` (RN-09 §5.8) → auditoría en T02 |
| PRM-PLA-045 | `pla.http.maxSyncItems` | int | plataforma | 500 | Ítems máximos en una operación síncrona; más → job | — |
| PRM-PLA-046 | `pla.maintenance.noticeHours` | int | plataforma | 48 | Anticipación de avisos de mantenimiento | — |
| PRM-PLA-047 | `pla.outbox.publishedTtlDays` | int | plataforma | 30 | Retención de eventos publicados e `inboxReceipts` | — |
| PRM-PLA-048 | `pla.release.ringObservationMinutes` | int | plataforma | 60 | Observación entre anillos | V2 #2085 (versión) — reemplazado |
| PRM-PLA-049 | `pla.tenant.dataRegion` | string | plataforma/contrato | región de PA-PLA-01 | Región de alojamiento | — |
| PRM-PLA-050 | `pla.domains.baseDomain` | string | plataforma | `<dominio-plataforma>` (a definir) | Dominio base de subdominios | — |
| PRM-PLA-051 | `pla.errors.externalDestinations` | string[] | plataforma | `[]` (solo sistema de errores contratado) | Destinos de errores | V2 #−1 (envío de errores por mail) — **Reemplazado** |
| PRM-PLA-052 | `pla.alerts.certExpiryDays` | int[] | plataforma | [30, 15, 7] | Avisos de vencimiento de certificados | V2 #2925 (certificado AFIP) |
| PRM-PLA-053 | `pla.alerts.edgeAgentHeartbeatMinutes` | int | tenant | 10 | Latido del agente local | V2 #2730, #2648, #2731 (vigilancia del Agente) |

---

## 15. Reportes, indicadores y exportaciones

### 15.1. KPIs del dashboard de plataforma (PAN-PLA-01; AGR-022: fórmula, universo, corte)

| KPI | Fórmula | Universo | Corte / frecuencia | Permiso de detalle |
|---|---|---|---|---|
| Tenants por estado | count(`tenants`) agrupado por `status` | kind `cooperative` del ambiente | Tiempo real | `pla.tenants.ver` |
| Checklists incompletos | count(`tenantChecklists` `overallStatus = incomplete`) por capacidad | Tenants no purgados | Tiempo real | `pla.checklists.ver` |
| Habilitaciones vencidas | tenants con fecha objetivo de habilitación < hoy y estado < `operational` | Tenants en alta | Diario | `pla.tenants.ver` |
| Jobs fallidos 24 h | count(`jobRuns` `failed`, últimas 24 h) por cola y tenant | Todos | Cada minuto | `pla.jobs.ver` |
| Jobs estancados | count(`stalled`) BullMQ | Todas las colas | Cada minuto | `pla.jobs.ver` |
| Lag de outbox | now − min(`occurredAt`) de `pending` | Global | Cada minuto | `pla.jobs.ver` |
| Bandeja técnica abierta | count(`deadLetters` `open`), con `businessImpact` destacado | Global | Tiempo real | `pla.deadLetters.reprocesar` |
| Disponibilidad | minutos con chequeo sintético OK / minutos del mes | Por tenant y global | Cada `PRM-PLA-043` s; mensual | `pla.salud.ver` |
| Latencia p95 y tasa de error | percentil 95 de duración; 5xx / total | Por tenant y ruta | 5 min | `pla.salud.ver` |
| Último backup por tenant | max(`backupRuns.finishedAt` `completed`) | Tenants operativos | Diario | `pla.backups.ver` |
| Ensayos de restauración vencidos | tenants sin `restoreTests` `passed` en `PRM-PLA-014` días (sobre muestra rotativa anual) | Tenants operativos | Diario | `pla.backups.ver` |
| Certificados a vencer | count(metadatos de bóveda con `expiresAt` ≤ 30 d) | Tenants con `fac` en producción | Diario | `pla.salud.ver` |
| Accesos de soporte activos | count(`supportAccessGrants` `active`), break-glass destacado | Global | Tiempo real | `pla.soporte.accesos.ver` (antes `pla.accesos.ver`) |
| Casos abiertos por prioridad y SLA | count(`supportCases` no cerrados) por prioridad; % con SLA vencido | Global | Tiempo real | `pla.soporte.ver` |
| SUP-TTR | mediana(resolvedAt − createdAt) por prioridad | Casos resueltos del mes | Mensual | `pla.soporte.ver` |
| Satisfacción de soporte | promedio(`satisfaction.score`) | Casos con encuesta | Mensual | `pla.soporte.ver` |
| Uso vs cupo | `usageSnapshots.pct` máximo por tenant | Tenants con contrato | Diario | `pla.uso.ver` |
| Versión por ambiente/anillo | `releases.deployments` vigentes | Ambientes | Por despliegue | `pla.releases.ver` |
| Contratos por vencer | count(`saasContracts` `validTo` ≤ 30 d) | Activos | Diario | `pla.contratos.ver` |

Ningún KPI de plataforma muestra datos personales ni importes contables de los tenants (BASE §54 Límite); los datos de uso son conteos.

### 15.2. Indicadores para el tenant (PAN-PLA-15/16)

Consumo por dimensión vs cupo (diario), % de checklist por capacidad (tiempo real), casos de soporte abiertos y SLA (tiempo real), disponibilidad mensual de su tenant.

### 15.3. Exportaciones

Listado de tenants, contratos, uso (XLSX/CSV), prefactura SaaS por período (XLSX/PDF), informe de restauración (PDF), informe de ensayo (PDF), certificado de purga (PDF), exportación completa del tenant (§9.8), inventario técnico (JSON). Todas vía job, bajo prefijo del tenant (o `platform/`) y URL firmada (RF-PLA-027).

---

## 16. Casos de uso

### 16.1. Casos originales de BASE

| ID original | Nombre | Resumen y resolución en este anexo |
|---|---|---|
| **CU-MT-01** (BASE §42.7) | Incorporación de cooperativas como tenants | 1) El administrador de plataforma registra TEN-001 — Cooperativa Ejemplo A (§9.1); 2) se habilita su administrador (invitación con 2FA, T02); 3) el administrador incorpora USR-FIN-A y USR-CON-A y vincula personal (T02); 4) la cooperativa registra asociados y habilita un socio (M01/T02); 5) cada usuario opera dentro de TEN-001; 6) se registra TEN-002 y se comprueba que los usuarios de TEN-001 no acceden a sus datos. **Excepción:** cambiar el identificador de cooperativa o de documento en la solicitud no da acceso (RF-PLA-033, §17.2). |
| **CU-GOB-01** (BASE §54, lado plataforma) | Cambio de regla con auditoría y pendiente en tablero | La regla BON-VAR-30 (30 % → 20 %) se versiona y aprueba en T04/T11; PLA aporta: la alerta ALT-DEMO-001 (regla pendiente de aprobación) en el motor de alertas, el indicador “configuración pendiente” y el aislamiento: el dashboard de TEN-002 no consulta eventos de TEN-001. Evidencia AUD-DEMO-001 en T02. |
| **CU-PLA-15** (parte PLA de CU-ARQ-01, dueño T11; antes CU-ARQ-01) (BASE §58) | Pedido de internet sin duplicados | El CRM (M09) registra el pedido; técnica (M10) gestiona la visita; contratos (M01/M02) confirma el alta; ERP (M05) liquida. PLA garantiza: comandos por `index.js`, eventos por outbox, consumidores idempotentes (`inboxReceipts`), `Idempotency-Key` y `jobKey` → un reintento no crea dos contratos ni dos facturas (RF-PLA-009, RN-PLA-025/026). |
| **CU-SaaS-01** (BASE §64.6) | Cooperativa que se incorpora y reporta un error | Se habilita el tenant sin servidores propios (§9.1–9.3), configura marca y servicios, dispone de landing; el responsable registra SUP-DEMO-001 (módulo Reportes, estado Recibida) en el soporte de plataforma (§9.5); el caso no se mezcla con un reclamo de agua de un socio. Sin plazo contractual fijado (PA-PLA-03). |
| **CU-CAT-01** (BASE §66, lado plataforma) | Servicios habilitados por cooperativa | Licencias: TEN-001 `svc.agua`, `svc.electricidad`, `svc.cementerioParque`; TEN-002 `svc.electricidad`, `svc.gas`. Un usuario de A ve las tres ofertas publicadas en M02; uno de B ve Electricidad y Gas. Retirar Agua de nuevas contrataciones en A = `newSalesBlocked: true` (RF-PLA-075); los contratos activos no desaparecen. |

### 16.2. Casos nuevos

| ID | Nombre | Actor | Flujo principal | Excepciones |
|---|---|---|---|---|
| CU-PLA-01 | Alta asistida con IA | Implementación | §9.1 | IA no disponible; CUIT duplicado; reintento |
| CU-PLA-02 | Pasar de Preparación a Operativo | Implementación, Aprobador | §8.1 + §9.2 | Ítem no dispensable pendiente |
| CU-PLA-03 | Activar facturación en producción | Aprobador | §9.3 | Certificado ARCA faltante → 409 |
| CU-PLA-04 | Desactivar un módulo conservando la historia | Aprobador / admin | §8.2 `historyReadOnly` | Dependencias activas |
| CU-PLA-05 | Suspender y reactivar por deuda SaaS | Aprobador comercial | §9.4 | Jobs omitidos a decidir |
| CU-PLA-06 | Soporte con acceso temporal | Admin del tenant, agente | §9.5 | Rechazo; vencimiento; break-glass |
| CU-PLA-07 | Probar una tarifa nueva en sandbox | Admin del tenant | §9.6 | Paquete incompatible con producción |
| CU-PLA-08 | Restaurar un tenant tras un error masivo | Operaciones, Seguridad, admin | §9.7 | Pagos/CAE posteriores al punto (ESC-04) |
| CU-PLA-09 | Salida de una cooperativa | Aprobador, admin | §9.8 | Retención legal (`legalHold`) |
| CU-PLA-10 | Desplegar una versión por anillos | Operaciones | §9.11 | Rollback por tasa de error |
| CU-PLA-11 | Aviso y gestión de cupo | Sistema, Comercial | §9.9 | Cupo duro según PA-PLA-10 |
| CU-PLA-12 | Incidente general con casos vinculados | Operaciones, Soporte | §8.7 + RF-PLA-099 | Recurrencia |
| CU-PLA-13 | Reprocesar evento fallido | Soporte N2 | §9.12 | Descarte justificado |
| CU-PLA-14 | Exportación completa a pedido | Admin del tenant | RF-PLA-156 | Exportación concurrente → cola |

---

## 17. Criterios de aceptación y escenarios de prueba

### 17.1. Estructura y fronteras

- `check:structure`, `check:boundaries`, `check:indexes` y gitleaks en verde en cada build.
- Un módulo que importa `modules/fac/model/invoice.js` desde `modules/crm` hace fallar el build.
- Dos manifiestos que declaran la misma colección impiden el arranque.

### 17.2. Aislamiento multitenant (permisos negativos; obligatorio en CI)

| # | Escenario | Resultado esperado |
|---|---|---|
| A1 | Usuario de TEN-001 pide `GET /api/admin/per/persons/:id` con id de TEN-002 | 404 |
| A2 | Usuario de TEN-001 envía `tenantId` de TEN-002 en body de un POST | Ignorado; el documento queda en TEN-001 |
| A3 | Código de servicio ejecuta `Model.find()` sin contexto | `TenantContextMissingError` |
| A4 | Pipeline con `$lookup` sin `tenantId` | Falla lint/CI |
| A5 | Job con `tenantId` A recibe ids de B | No encuentra documentos |
| A6 | URL firmada de archivo de B pedida con token de A | 404 |
| A7 | Clave de caché del recurso 123 en A y en B | Valores independientes |
| A8 | Exportación de A descargada por usuario de B | 404 |
| A9 | Búsqueda “Pérez” en TEN-002 | No devuelve a Ana Pérez (TEN-001) |
| A10 | Contexto de IA para una pregunta de TEN-001 | Sin ids ni textos de TEN-002 |
| A11 | Admin de TEN-001 llama `/api/platform/tenants` | 403 |
| A12 | USR-PLAT-001 sin grant consulta personas de TEN-001 | 403 |
| A13 | Agente con grant `observe` intenta un POST | 403 |
| A14 | Agente con grant vencido | 401 `support-grant-expired` en ≤ 60 s |
| A15 | Webhook con firma de A en ruta de B | Rechazado |
| A16 | ASO-001 en TEN-001 y en TEN-002 | Coexisten (unicidad por tenant) |

### 17.3. Ciclo de vida y licencias

- Activar `fac` en producción sin certificado → 409 con ítem `productionCredentials`.
- Tenant con documento `isDemo` no pasa a Operativo.
- Suspender TEN-001: contratos, servicios y deudas sin cambios (hash por colección antes/después); POST del personal → 423; portal según PA-PLA-04.
- Reactivar: un ciclo programado durante la suspensión no se emite automáticamente.
- `fac` en `historyReadOnly`: facturas consultables y descargables; emitir → 409 `module-read-only`.
- Licencia vencida → activación `historyReadOnly` y alerta PLA-ALR-09.

### 17.4. Outbox, jobs e idempotencia (AGR-016)

- Fallo después de escribir el cambio y antes del commit → ni cambio ni evento.
- Relay reiniciado a mitad de la entrega → cada consumidor procesa el evento una sola vez.
- Job de 10.000 ítems interrumpido → reanuda desde `cursor` sin repetir.
- Mismo `Idempotency-Key` y mismo cuerpo → misma respuesta; cuerpo distinto → 422.
- Evento fallido 10 veces → `deadLetters` + PLA-ALR-06; reprocesar no duplica efectos.
- Ejemplo AGR-016: servicio instalado y stock registrado, falla crear el cargo → reprocesar crea solo el cargo.

### 17.5. Soporte

- SUP-DEMO-001 no aparece en M09; el detector rechaza un mensaje con una cadena con forma de token.
- Grant `operate` sin aprobación del admin del tenant no puede activarse.
- Break-glass con un solo aprobador → rechazado; admin notificado en ≤ 1 min.
- Auditoría de un cambio por soporte muestra agente, tenant y grant; PAN-PLA-18 lo lista.

### 17.6. Backups y restauración (ESC-04)

- **ESC-04:** snapshot a las 10:00; a las 10:20 la pasarela confirma un pago por ARS 15.000 y se emite una factura con CAE; a las 10:40 se restaura TEN-001 a las 10:00 (`fullTenant`). Resultado: el pago se registra como recuperado desde la pasarela y `integrationOperations` (antes `externalOperations`) (sin nuevo cobro); el comprobante se reconstituye con su CAE (sin nueva solicitud a ARCA); los mensajes ya enviados no se reenvían; los `auditLogs` de 10:00–10:40 siguen visibles; TEN-002 sin cambios (hash).
- Ensayo trimestral con verificación de hashes de PDFs/XML y descifrado de un secreto; RTO real registrado.
- Restauración con un solo aprobador no pasa a `executing`.

### 17.7. Capacidad y aislamiento de carga (AGR-020)

- TEN-001 lanza la exportación completa de su historia y un lote de 12.500 comprobantes; en paralelo TEN-002 registra 50 cobros en caja: p95 de la API de caja de TEN-002 dentro de `PRM-PLA-019` y sus jobs de `integration` sin espera por TEN-001.
- 6.º intento de login por minuto desde la misma IP → 429.
- Token de API de terceros sobre su límite → 429 con `Retry-After`.

### 17.8. Ambientes y actualizaciones

- `seed:demo` con `APP_ENV=prod` falla sin escribir.
- En sandbox, configurar una credencial `production` es rechazado; los emails a destinatarios fuera de la lista blanca no salen.
- Despliegue rolling con humo continuo sin 5xx; rollback automático ante tasa de error > umbral.
- PWA con 20 operaciones offline se actualiza y sincroniza sin pérdida.
- Ninguna pantalla del tenant ofrece “actualizar”, “backup” ni “chequear estructura”.

### 17.9. ESC-01, ESC-02, ESC-03, ESC-05

No son de plataforma en su lógica de negocio (M07, M05, M10, M04/M05); PLA garantiza su ejecución en CI con el juego canónico (RF-PLA-113) y la idempotencia/outbox que exigen.

---

## 18. Datos de precarga de demostración (ficticios; solo ambientes `demo`, `dev`, `staging`, `ci`, `local`)

| Entidad | Datos |
|---|---|
| Tenants | `platform` (PLATFORM); `coop-ejemplo-a` TEN-001 — Cooperativa Ejemplo A, CUIT 30-99999991-0 (ficticio), Operativo, anillo `pilot`, región de PA-PLA-01; `coop-ejemplo-b` TEN-002 — Cooperativa Ejemplo B, CUIT 30-99999992-9 (ficticio), Prueba; `coop-ejemplo-a-sbx` sandbox de TEN-001 |
| Usuarios (T02) | USR-PLAT-001 (superadmin plataforma), USR-PLAT-IMP (implementación), USR-PLAT-SOP1 (soporte N1), USR-PLAT-SOP2 (soporte N2), USR-PLAT-OPS (operaciones), USR-PLAT-SEC (seguridad); USR-ADM-A, USR-FIN-A, USR-CON-A, EMP-A-001 (TEN-001); USR-ADM-B (TEN-002). Sin contraseñas conocidas: acceso por enlace de invitación en cada ambiente (RNF-PLA-004). |
| Planes | PLAN-BASICO, PLAN-ESTANDAR, PLAN-TOTAL (sin precios) |
| Contratos | SAAS-2026-0001 (TEN-001, PLAN-ESTANDAR + `svc.internet`, `svc.agua`, `svc.electricidad`, `svc.cementerioParque`, cupos: 5.000 contratos activos, 50 usuarios internos, 100 GB, `active`); SAAS-2026-0002 (TEN-002, borrador, `svc.electricidad`, `svc.gas`) |
| Activaciones TEN-001 | `per`, `cat`, `crm`, `tec`, `stk.equipos` en `production`; `fac`, `fis`, `cob` en `test`; `mor` `off` |
| Checklists | TEN-001 `chk.fac` con `productionCredentials` = `pending` (ilustra AGR-004 ejemplo); TEN-002 `tenant.base` 6/8 |
| Uso | TEN-001: 4.150 contratos activos (83 % → alerta blanda PLA-ALR-08), 31 usuarios, 22,4 GB |
| Soporte | SUP-DEMO-001 (TEN-001, módulo Reportes, P3, Recibida); grant GRT-DEMO-001 `observe` sin PII, vencido; INC-DEMO-001 (SEV3, resuelto, demora en notificaciones) |
| Alertas | ALT-DEMO-001 (regla BON-VAR-30 pendiente de aprobación, TEN-001); PLA-ALR-02 certificado ARCA de homologación a 12 días |
| Backups | 7 `backupRuns` lógicos de TEN-001 `verified`; RST-DEMO-001 `sandboxCopy` completado; ensayo `passed` con RTO real 38 min |
| Releases | 1.0.0 `deployed` en `demo`; flag `fac.nuevoPdf` encendido solo en anillo `pilot` |

Todos los documentos de precarga llevan `isDemo: true` (RF-PLA-047).

---

## 19. Migración desde ProCoop

### 19.1. Origen → destino

| Origen ProCoop | Destino CoopApps | Transformación | Validación de conciliación |
|---|---|---|---|
| Archivo `Configuracion*.pro` (servidor, base, usuario/contraseña SQL, puerto, punto de venta del puesto, rutas, SMTP, licencia, módulos, `WEB_*`, prepaga CoopOnline) | `tenants` (uno por base) + T04 (punto de venta) + T06 (bóveda: credenciales SMTP/web **nuevas**) | **No** se migran contraseñas ni credenciales: se generan nuevas en la bóveda; el campo `Modulos` sirve de referencia para la licencia inicial | Acta: módulos usados en ProCoop vs licenciados |
| Variables 518–527, 709 (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) y var 519 (CUIT) | `tenants` (identidad) + `legalEntities` de T04 (entidad por defecto, DEC-064) + M06 (perfil fiscal) + T03 (logo) | Normalización de CUIT y domicilio | CUIT coincide con padrón ARCA |
| `EMPRESAS` (empresas del grupo), `SU_EMPRESAS` (empleadores) | `legalEntities` de T04 y su subdocumento `employer` (DEC-064, CTR-DAT-06; T04 RF-CFG-142) | Match por CUIT | Conteo |
| `MODULOS` (módulo y versión) | Referencia para `moduleCatalog`/licencias | Tabla de equivalencias módulo ProCoop → `moduleCode` | Todos los módulos con datos tienen licencia |
| Lista de clientes compilada / demo de 30 días | `tenantLicenses` (`source: trial` si corresponde) | — | — |
| `PROCOOPAR_ADJUNTOS` (novedades del proveedor) | Descartado (contenido del proveedor anterior) | — | — |
| `ADJUNTOS` + archivos en carpetas/servidor de archivos | `storedFiles` + almacenamiento por tenant (T11 para el expediente) | Subida por job con sha256, clasificación y antivirus | Conteo y hash por archivo |
| `EQUIPOS` (terminales, kioscos, impresoras, lectores) | `localAgents` / dispositivos (T06, O10; antes `edgeAgents`) | Solo los que usan hardware local | Inventario confirmado por la cooperativa |
| `BLOQUEO_FILAS`, `INTEGRIDAD`, `ESTADOS`, `OPERACIONES`, `OPE_COM`, `RELACION_ENTIDADES` | Reemplazados (RN-PLA-043/044; T04/T11) | No se migran como tablas; `RELACION_ENTIDADES` → `entityLinks` (T11) si tiene datos | — |
| `AUDITO`, `AUDITORIA`, `INFO_SYS`/`INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA` | Archivo histórico de solo lectura (T02/T07) | Import como “auditoría heredada” | Conteo |
| Tareas programadas del Agente (`clsServicio_Procoop`, `abm_TareasProgramadas*`) | Jobs de cada módulo (§19.3) | Frecuencias como parámetros por tenant | Lista de tareas activas mapeadas 1:1 |
| Tablas CAT §28 (motor de pantallas y configuración) | §19.2 | — | — |

### 19.2. CAT §28 (configuración y motor de pantallas) — destino

| Tabla | Destino | Decisión |
|---|---|---|
| `ABM_VALIDACIONES` | Esquemas Zod (T03/T04) | Reemplazado; reglas personalizadas de la cooperativa → parámetros/validaciones configurables T04 |
| `ARCHIVOS`, `TIP_ARC` | Tipos de archivo de intercambio (T06) | Delegado |
| `DATOSETB`, `DATOSEXT`, `PROPIEITEMS`, `PROPIEITEMS_ASIGNACIONES`, `PROPIEITEMS_VALORES` | Campos personalizados por entidad (T04) | Delegado, migrar valores |
| `DATOSINT`, `FORMAINT`, `MODEINT`, `SERVINT`, `TIPOMOD` | Modelos de interfaz de archivos (T06) | Delegado |
| `EMPRESAS` | `legalEntities` de T04 (DEC-064) | Delegado |
| `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ENTIDACON`, `ENTIDACOU`, `ENTIDACRIT`, `ENTIDADCIR`, `ENTIDADES`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN`, `ENTIDA_ESTADOS` (motor de grillas dinámicas `frmTransicion`) | `DataTable` genérico + vistas guardadas (T03) + estados por entidad (T11) + `siteMapGroups` | Reemplazado por RF-PLA-155/RN-PLA-038; vistas de usuario (`ENTIDACOU`) → vistas guardadas |
| `EXPORTADOR`, `EXPORTADOR_COLUMNAS` | Definiciones de exportación (T06/T10) | Delegado |
| `FORMULARIOS_PERSONALIZACIONES` | Personalización de UI por diccionario y configuración (T03) | Reemplazado |
| `REPORTES` (reemplazo de reportes por equipo) | Plantillas de documentos por tenant (T10/T11) | Reemplazado (no por equipo) |
| `VARIABLE`, `VARIABLE_PMOVIL` | Registro de parámetros (T04, T04b); las de plataforma → `PRM-PLA-*` (§14) | Delegado |

### 19.3. Tareas del Agente → jobs (RF-PLA-154)

| Tarea ProCoop (RN-09 §5.8) | Job destino | Módulo |
|---|---|---|
| Backup SQL y de carpetas | JOB-PLA-09, PITR | `pla` |
| Facturación electrónica pendiente | `fis:solicitar-cae-pendientes` | `fis`/`fac` |
| Comando P6 (Procoop 6 heredado) | Descartado (sistema heredado) | — |
| Sincronización web | Descartado: portal sobre la misma API (RN-PLA-040) | — |
| FTP | `int:transferir-archivos` (SFTP/API) | `int` |
| Actividades | `crm:actividades-programadas` | `crm` |
| Cálculo de variables | Descartado: parámetros tipados sin cálculo batch | `cfg` |
| CoopOnline | Descartado (portal propio) | `por` |
| Trámites | `crm:vencimientos-tramites` | `crm` |
| Consultas | `bia:reportes-programados` | `bia` |
| Capitalización | `ins:capitalizacion` | `ins` |
| Rendiciones de entes | `cob:procesar-rendiciones` | `cob` |
| Purga de `AUDIT_MAIL` | Retención de comunicaciones (`com`) | `com` |
| Aviso de adherentes que cumplen la mayoría de edad | `ins:aviso-mayoria-edad` | `ins`/`per` |
| Modos de línea de comandos 1–12 (`Program.Main`): XML de llamadas, mails desde XML, integración, AVL Discar, Pagos360 (9, 10), vigilancia del Agente (11), impresión desde JSON (12) | Jobs de `tec`/telefonía, `com`, `int`, `soc` (flota), `cob`, alerta PLA-ALR-03, documentos T11 | Varios |

### 19.4. Validación

Un tenant migrado no pasa a Operativo sin `chk.mig` completo (saldos iniciales aprobados, BASE §97.10); la migración repetible y el paralelo factura por factura están en T07 (DFA §33 criterio de aceptación del paralelo).

---

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-PLA-01 | DFA Módulo 1 (“una base de datos por cooperativa”), RN-09 §7.5 (aislamiento por base) vs **DEC-110** | Aislamiento por base física vs base compartida | Base compartida con `TenantId` obligatorio, EF, índices con prefijo y suite de aislamiento (§7.10) | DEC (nivel 1) |
| CTR-PLA-02 | DFA Módulo 1 (OpenIddict / identidad .NET) vs stack histórico Node | Stack de identidad | **OpenIddict** en ASP.NET Core (DEC-111, T02); claim `tid` | DEC-111 |
| CTR-PLA-03 | BASE Advertencia, §2, §42.4, §58 (“no decide arquitectura”) vs DEC-003 | BASE no fija arquitectura | Monolito modular con módulos por código, `index.js` público y eventos por outbox (§7.2–7.6) | DEC-003 |
| CTR-PLA-04 | CNX §1/§2 vs **DEC-112** | Nube/stack | **.NET 10** + **Azure SQL** + **React 19** en **Microsoft Azure** | DEC-112 |
| CTR-PLA-05 | CNX §2.4–2.8 vs AGR-016, AGR-019, AGR §5 | Prácticas del prototipo | **Azure Queue** + `pla.JobRuns`; Blob + URL firmada; OpenTelemetry → App Insights; Key Vault; CI/CD con imágenes firmadas | AGR (nivel 2) sobre CNX (nivel 5) |
| CTR-PLA-06 | CNX §10 (token en README, V-01/V-02/V-04/V-05/V-07/V-13) vs RNF de seguridad | Secretos en repositorio, usuarios demo con clave | gitleaks bloqueante, rotación, sin usuarios demo con clave conocida; el token **no se copió** a este anexo | AGR + guía (seguridad) |
| CTR-PLA-07 | AGR-004 (cinco estados de tenant, sin “Suspendido”) vs pedido del solicitante y BASE §64 | Falta suspensión | Se agregan `suspended` y luego `closing/closed/purged` (§8.1); los cinco de AGR-004 se conservan como etapas de alta | Pedido explícito del solicitante (ampliación compatible con AGR) |
| CTR-PLA-08 | BASE §97.9 (no usar datos demo en producción) vs necesidad de probar con datos reales | Sandbox con datos | Sandbox en ambiente separado (`sandbox`), ficticios por defecto, copia anonimizada solo con aprobación (PA-PLA-06/07) | BASE + AGR-004 |
| CTR-PLA-09 | Maestro §6 (“producción y prueba por tenant con datos anonimizados”) vs BASE §97.9 y privacidad | Datos de prueba | Ficticios por defecto; anonimizados como opción aprobada (PA-PLA-07) | A validar (PA-PLA-07) |
| CTR-PLA-10 | DFA §33 (fechas de puesta en marcha 1/3/2027 y 1/7/2027) vs DEC-006 | Calendario | Sin fechas en el anexo; secuencia por olas O0→O1 | DEC-006 |
| CTR-PLA-11 | BASE §35 (etapas) y DFA (“contabilidad primero”) vs DEC-005/DEC-009 | Orden de implementación | Olas de la guía; piloto Internet; contabilidad en O5/O6 | DEC-005, DEC-009 |
| CTR-PLA-12 | Guía §5 (todos los índices comienzan por `tenantId`) vs necesidades técnicas de plataforma | Índices globales | Lista blanca técnica cerrada: relay de `outboxEvents`, bandeja global de soporte y colecciones `PLATFORM` (RF-PLA-018); `check:indexes` la valida | Guía, con excepción explícita documentada |
| CTR-PLA-13 | Maestro §5.2 (listado de módulos) vs necesidades de T03 y T07 | Códigos faltantes | Se agregan `uxd` y `mig` como módulos de plataforma (§7.4) | Coherencia con anexos T03/T07 |
| CTR-PLA-14 | BASE §99 MER-020 (soberanía/portabilidad, región no definida) vs DEC-004 (AWS) | Región de datos | Región parametrizable por contrato (`PRM-PLA-049`); AWS sa-east-1 con cláusulas contractuales de la AAIP (DEC-062) | DEC-062 |
| CTR-PLA-15 | RN-09 §5 (actualización, backup y chequeo de estructura desde el puesto del cliente; `frmActualizar`, `frmChequearVersion`, `frmBaseDatos`) vs modelo SaaS (BASE §64) | Operación en manos de la cooperativa | Operación exclusiva de plataforma; el tenant no ve esas funciones (§17.8) | BASE §64 + DEC-002 |
| CTR-PLA-16 | RN-09 §5.4 (licencia compilada / demo 30 días por base) vs licencias en tres capas | Licenciamiento | `tenantLicenses` + activaciones + pantallas (T02); trial por `PRM-PLA-008` | AGR-004 + BASE §66 |
| CTR-PLA-17 | §2, RN-PLA-006, EVT-PLA-21 y §19 de este anexo vs DEC-064 y T05 (COL-CFG-41/42, CTR-DAT-48) | Perfil legal, sucursales y sus eventos repartidos entre T01 y T04 | `legalEntities` y `branches` son de T04 desde O0; T01 conserva los datos de contratación en `tenants` y publica `pla.tenant.created` con ellos; los eventos de sucursal pasan a EVT-CFG-20 | DEC-064 |
| CTR-PLA-18 | Colecciones citadas por este anexo vs T05 | `brandingRef` → `uxd.tenantBranding`, `tenantParameters`, `configPackages`, `masterTables`, `pointsOfSale` en T04, `supportAccessGrants` y `auditEvents` como propios | `tenantBrandings` (T03, CTR-DAT-51); `parameterValues` (CTR-DAT-49); `configVersions` y `masterTableDefinitions` (T04); `pointsOfSale` (M06); `supportAccessGrants` y `auditLogs` (T02, CTR-DAT-02 y CTR-DAT-24) | T05 (modelo canónico) |

---

## 21. Preguntas abiertas

### PA-PLA-01 — Región de alojamiento de datos
- **Pregunta:** ¿En qué región se alojan los datos de producción de las cooperativas?
- **Contexto:** DEC-004 fija AWS pero no la región; la Ley 25.326 y criterios de la AAIP sobre transferencia internacional; latencia; costo. No hay región AWS en Argentina [VERIFICAR disponibilidad actual].
- **Opciones:**
  - A) AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia según AAIP **(Recomendada)** — menor latencia regional, cumplimiento contractual.
  - B) AWS us-east-1 — menor costo, mayor latencia y más exigencia contractual.
  - C) Proveedor con centro de datos en Argentina para la base y AWS para el resto — soberanía, mayor complejidad operativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-157, PRM-PLA-049, O1 (producción).
- **Estado:** Respondida (DEC-062): AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia internacional según la AAIP; diseño agnóstico de nube.

### PA-PLA-02 — Objetivos de RPO y RTO
- **Pregunta:** ¿Qué RPO y RTO se comprometen?
- **Contexto:** Define costo de backups (PITR) y procedimientos; BASE §64 exige continuidad sin fijar valores.
- **Opciones:**
  - A) RPO ≤ 15 min; RTO por tenant ≤ 4 h; plataforma completa ≤ 8 h **(Recomendada)** — alcanzable con PITR y backups lógicos por tenant.
  - B) RPO ≤ 24 h; RTO ≤ 24 h — más barato, riesgo de pérdida de cobros del día.
  - C) RPO ≤ 1 min; RTO ≤ 1 h — requiere multi-región activa, costo alto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-121, PRM-PLA-015..017, §17.6.
- **Estado:** Respondida (DEC-063): RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h para la plataforma completa.

### PA-PLA-03 — SLO de disponibilidad, latencia y SLA de soporte
- **Pregunta:** ¿Qué niveles de servicio se ofrecen en el contrato SaaS?
- **Contexto:** BASE §64.6 (CU-SaaS-01) no fija plazos; condicionan guardia y costos.
- **Opciones:**
  - A) 99,5 % mensual; p95 interactivo ≤ 800 ms; soporte lun–vie 8–18 con P1 24×7 y plazos de `PRM-PLA-035` **(Recomendada)** — valores iniciales razonables para un equipo chico.
  - B) 99,9 % y soporte 24×7 para todas las prioridades — exige guardia ampliada.
  - C) Sin SLA contractual en el piloto — simple, débil comercialmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-098, RF-PLA-132, RNF-PLA-011, PRM-PLA-018/019/035/036.
- **Estado:** Respondida (DEC-063): disponibilidad 99,5 % mensual; p95 interactivo ≤ 800 ms; soporte de lunes a viernes de 8 a 18 con P1 24×7.

### PA-PLA-04 — Portal del socio durante la suspensión del tenant
- **Pregunta:** Cuando se suspende una cooperativa, ¿qué pueden hacer sus socios en el portal?
- **Contexto:** Cortar el portal perjudica a los socios y a la cobranza; mantenerlo completo debilita la suspensión.
- **Opciones:**
  - A) Consulta y pagos activos; nuevas solicitudes bloqueadas **(Recomendada)** — protege al socio y la cobranza.
  - B) Solo consulta.
  - C) Portal fuera de servicio con aviso.
- **Impacto si no se responde:** se asume A (`PRM-PLA-006 = readAndPay`).
- **Bloquea:** RF-PLA-049, RN-PLA-012, §17.3.

### PA-PLA-05 — Aprobación del acceso de soporte
- **Pregunta:** ¿Quién aprueba los accesos temporales de soporte según su alcance?
- **Contexto:** BASE §64.5 exige acceso controlado; Ley 25.326 (datos personales).
- **Opciones:**
  - A) `observe` sin datos personales: aprobación de plataforma y aviso al tenant; con datos personales, `operate` o `config`: aprobación del administrador del tenant; break-glass: dos aprobadores de plataforma y aviso inmediato **(Recomendada)** — equilibrio entre agilidad y control.
  - B) Todo acceso requiere aprobación del tenant — máximo control, demora en P1.
  - C) Soporte con acceso permanente de lectura — rápido, inaceptable para privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-101, RF-PLA-102, RF-PLA-105, RN-PLA-018.

### PA-PLA-06 — Forma del ambiente de prueba de cada cooperativa
- **Pregunta:** ¿Cómo se ofrece el ambiente de prueba a cada cooperativa?
- **Contexto:** Maestro §6 pide prueba por tenant; BASE §97.9 prohíbe datos demo en producción.
- **Opciones:**
  - A) Ambiente `sandbox` separado con un tenant gemelo por cooperativa **(Recomendada)** — aislamiento total de credenciales y envíos.
  - B) Tenant de prueba dentro del ambiente de producción — más simple, riesgo de envíos reales.
  - C) Sin sandbox; solo `demo` común — no permite probar la configuración propia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-111, CU-PLA-07.

### PA-PLA-07 — Datos del sandbox
- **Pregunta:** ¿Con qué datos se carga el sandbox?
- **Contexto:** Maestro §6 dice “anonimizados”; la anonimización imperfecta es un riesgo de privacidad.
- **Opciones:**
  - A) Ficticios por defecto y copia anonimizada solo con aprobación del administrador y de seguridad **(Recomendada)**.
  - B) Siempre copia anonimizada de producción.
  - C) Copia sin anonimizar — descartable por privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-116, CTR-PLA-09.

### PA-PLA-08 — Facturación del servicio SaaS a las cooperativas
- **Pregunta:** ¿Con qué herramienta factura el proveedor el SaaS?
- **Contexto:** El contrato y el uso viven en PLA; la emisión fiscal está en M05/M06 (O4/O5).
- **Opciones:**
  - A) Con el propio módulo FAC bajo el tenant PLATFORM desde O5; en O1, prefactura exportable **(Recomendada)** — dogfooding y una sola lógica fiscal.
  - B) Sistema externo de facturación permanente.
  - C) Facturación manual sin prefactura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-040, RF-PLA-082, JOB de prefactura.
- **Estado:** Respondida (DEC-065): facturación del SaaS con M05 bajo el tenant `PLATFORM` desde O5 y prefactura exportable en O1.

### PA-PLA-09 — Modelo comercial
- **Pregunta:** ¿Cómo se estructura el precio del SaaS?
- **Contexto:** Define `platformPlans` y medición.
- **Opciones:**
  - A) Packs por tamaño más complementos, con cupo por contratos activos **(Recomendada)** — predecible y alineado al valor.
  - B) Precio por usuario interno.
  - C) Precio por módulo sin cupos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-072, `platformPlans`.
- **Estado:** Respondida (DEC-065): packs por tamaño más complementos con cupo por contratos activos; la mensajería revendida es un complemento medido (DEC-077).

### PA-PLA-10 — Comportamiento al superar el cupo duro
- **Pregunta:** Al superar el límite contratado, ¿qué se bloquea?
- **Contexto:** Bloquear la operación dañaría la facturación de la cooperativa.
- **Opciones:**
  - A) Solo nuevas altas de la dimensión excedida (p. ej. nuevos contratos); el resto sigue **(Recomendada)**.
  - B) Solo aviso y cargo por excedente, sin bloqueo.
  - C) Pasar el tenant a solo lectura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-078, RN-PLA-016, CU-PLA-11.

### PA-PLA-11 — Dominios de la cooperativa
- **Pregunta:** ¿Con qué dominio accede cada cooperativa a su landing y portal?
- **Contexto:** BASE §2 (marca y landing propias).
- **Opciones:**
  - A) Subdominio de la plataforma y dominio propio opcional verificado **(Recomendada)**.
  - B) Solo subdominio.
  - C) Dominio propio obligatorio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** `tenants.domains`, PRM-PLA-050.

### PA-PLA-12 — Política de salida de una cooperativa
- **Pregunta:** ¿Qué plazos y obligaciones rigen cuando una cooperativa deja el servicio?
- **Contexto:** Portabilidad (MER-020), conservación fiscal (10 años) [VERIFICAR] y privacidad.
- **Opciones:**
  - A) 90 días de solo lectura con exportación completa, luego retención de `PRM-PLA-005` días antes de purgar; la custodia fiscal queda en manos de la cooperativa con la exportación entregada **(Recomendada)**.
  - B) Custodia fiscal por el proveedor durante el plazo legal (servicio pago).
  - C) Purga inmediata tras exportar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-051, RF-PLA-081, RF-PLA-158, PRM-PLA-004/005.

### PA-PLA-13 — Versiones por cooperativa
- **Pregunta:** ¿Puede una cooperativa diferir una actualización?
- **Contexto:** Una sola versión simplifica operación; algunas cooperativas piden congelar cambios en cierres.
- **Opciones:**
  - A) Misma versión para todos; cambios visibles por feature flags y anillos, sin diferir **(Recomendada)**.
  - B) Diferir hasta 30 días.
  - C) Versiones por cooperativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-149, RN-PLA-036.

### PA-PLA-14 — Varias personas jurídicas en un mismo tenant
- **Pregunta:** ¿Un tenant puede agrupar varias personas jurídicas (CUIT distintos)?
- **Contexto:** ProCoop tiene `EMPRESAS` (grupo); algunas cooperativas tienen mutuales o sociedades vinculadas.
- **Opciones:**
  - A) Sí, mediante `legalEntities` del tenant gestionadas en T04 (emisión, contabilidad y sueldos por entidad) **(Recomendada)**.
  - B) No; un tenant por CUIT.
  - C) Solo para sueldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-PLA-007, §19 (`EMPRESAS`), T04, M05/M06/M16.
- **Estado:** Respondida (DEC-064): opción A; `legalEntities` y `branches` se definen en T04 (RF-CFG-134 a 142) desde O0, con `legalEntityId` obligatorio en los documentos económicos.

---

### PA-PLA-15 — Cierre de residuales del anexo (estados, referencias, API, colas y CU)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 10 máquinas no declaraban el estado de alta; `schemaMigrations` citaba `expand` (valor de `phase`) como si fuera de `status`; 5 referencias no tenían destino en la definición del campo; 24 colecciones del §7 no tenían tabla de campos; 5 filas de §11 citaban reglas de acceso en lugar de una capability; JOB-PLA-01 corría como "proceso dedicado" sin fila en la tabla de clases de cola; el ID CU-ARQ-01 es de T11.
- **Opciones:**
  - A) Agregar §8.13 y las filas "—" de `healthSnapshots`; aclarar `schemaMigrations`; declarar destinos en cada campo y usar los nombres canónicos de T05 (`supportAccessGrantId`, `jobId`); agregar las tablas de campos de §7.12 (derivadas del texto y de T05, obligatoriedad por regla); usar `public: true` y las capabilities implícitas o técnicas registradas en T02 (PA-IAM-18): `pla.archivos.ver`, `pla.archivos.subir`, `pla.misProcesos.ver`, `pla.salud.sondear`; agregar a la tabla de colas la fila de excepción de JOB-PLA-01; renumerar el CU propio a CU-PLA-15. **(Recomendada)**.
  - B) Mover JOB-PLA-01 a la cola `maintenance` y mantener el resto como está.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, ER y contratos OpenAPI de T01.
- **Estado:** Asumida (DEC-072): opción A.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `tenantExports.files[].fileId` pasa a `storedFileId` → `storedFiles` (antes `fileId`), nombre canónico de T05 COL-PLA-21 (PA-DAT-04).

## 22. Trazabilidad de fuentes

### 22.1. BASE

| Fuente | Destino en este anexo |
|---|---|
| Advertencia de arquitectura | CTR-PLA-03; §7.1–7.2 (ARQ-PLA-01..12) |
| Propósito y alcance | §1; §2 |
| §1 (historial de versiones; Actualización 0.15 datos DEMO) | RF-PLA-116, RN-PLA-050, §18 (solo ficticios) |
| §2 Organización | §3 (Tenant, Cooperativa); RF-PLA-001 |
| §2 Estructura multitenant | RF-PLA-001, RF-PLA-016..036, §7.10 |
| §2 Marca y landing | RF-PLA-056, RF-PLA-057; PA-PLA-11; detalle → T03 |
| §2 Facturación por servicio | RF-PLA-070 (habilitación por servicio); emisión → M05 |
| §2 Autogestión y ERP | RF-PLA-161, §7.5 (mapa de soluciones); portal → M17 |
| §2 Servicios habilitables | RF-PLA-063..077, CU-CAT-01 |
| §2 Configuración independiente | RF-PLA-037, RF-PLA-024; versionado → T04 |
| §2 Titularidad | Delegado a M01/T05; aislamiento RF-PLA-016..033 |
| §2 Espacios de trabajo | §7.11 (apps admin/pwa/plataforma); shells → T03 |
| §35 Etapas | RF-PLA-162, CTR-PLA-11 |
| §42.1 Objetivo | §1 |
| §42.2 Alcance | §2 |
| §42.3 Requisitos MT-001..008 | RF-PLA-016, RF-PLA-036, RF-PLA-037, RF-PLA-041 |
| §42.4 Arquitectura no definida | RF-PLA-037, RF-PLA-038, CTR-PLA-03 |
| §42.5 Alta de tenants y búsquedas | RF-PLA-028, RF-PLA-041 |
| §42.6 Datos ficticios | §18 |
| §42.7 CU-MT-01 y excepción | §16.1, RF-PLA-019, RF-PLA-033, §17.2 |
| §42.8 Permisos de plataforma | RF-PLA-032, §4 |
| §42.9 Quién crea, habilita o deshabilita | RF-PLA-053, §4 |
| §54 Gobierno (vista plataforma/tenant, responsables, auditoría, límite, GOB-001..004, CU-GOB-01) | RF-PLA-086..095, RF-PLA-038, RF-PLA-039, RF-PLA-124, RF-PLA-160, §15.1, CU-GOB-01 |
| §58 ARQ-001 y CU-ARQ-01 | RF-PLA-004, RF-PLA-035, RF-PLA-148, RF-PLA-149, CU-PLA-15 (antes CU-ARQ-01) |
| §64.1 Objetivo SaaS | §1 |
| §64.2 Alcance SaaS-001/003 | RF-PLA-001 |
| §64.3 Propuesta | §7 |
| §64.4 Precio y regiones no definidos | RF-PLA-080, RF-PLA-157, PA-PLA-01, PA-PLA-09 |
| §64.5 Soporte, incidentes, recuperación | RF-PLA-096..100, RF-PLA-126, RF-PLA-144, RNF-PLA-011 |
| §64.6 CU-SaaS-01 | §16.1 |
| §64.7 Relevamiento de soporte | RF-PLA-107 |
| §66 (lado plataforma: CAT-001..003, tres niveles, CU-CAT-01) | RF-PLA-048, RF-PLA-063, RF-PLA-069..077, CU-CAT-01; oferta → M02 |
| §97.8 NFR (disponibilidad, recuperación, carga, observabilidad, conservación, accesibilidad, conectividad) | RF-PLA-030, RF-PLA-035, RF-PLA-118..137, RF-PLA-145, RF-PLA-151, RNF-PLA-011..014; resto → T08 |
| §97.9 Demo y ambientes | RF-PLA-045, RF-PLA-047, RF-PLA-109..116, CTR-PLA-08 |
| §97.10 (lado plataforma: saldos iniciales para habilitar) | §19.4 (`chk.mig`); migración → T07 |
| §97.11 Comercial y límites | RF-PLA-040, RF-PLA-072, RF-PLA-076, RF-PLA-079, RF-PLA-082, RF-PLA-084 |
| §97.12 Implementación | RF-PLA-162 |
| §99.1–99.4 (MER-020 soberanía/portabilidad; planes por tamaño) | RF-PLA-051, RF-PLA-072, RF-PLA-119, RF-PLA-156, RF-PLA-157, CTR-PLA-14 |
| §102.5.1–102.5.6 (arquitectura, módulos, integración, eventos, jobs, despliegue) | RF-PLA-004, RF-PLA-142, RF-PLA-161, §7.2–7.6 |
| §102.7 (decisiones pendientes) | RF-PLA-034, RF-PLA-054, RF-PLA-162 |
| §102.8 | §21 (PA-PLA-01..14) |
| §105 Soluciones | §7.5, RF-PLA-153, RF-PLA-161 |
| §106 Decisión modular | RF-PLA-161, CTR-PLA-03 |

### 22.2. AGR

| Fuente | Destino |
|---|---|
| AGR-001 | RF-PLA-163 |
| AGR-002 | RF-PLA-004, RF-PLA-005 |
| AGR-004 | RF-PLA-042..055, RF-PLA-066, RF-PLA-158, §8.1–8.2, CTR-PLA-07 |
| AGR-005 | RF-PLA-051, RF-PLA-065, RF-PLA-069, RF-PLA-076..084, RF-PLA-156 |
| AGR-016 | RF-PLA-008, RF-PLA-009, RF-PLA-011, RF-PLA-138, RF-PLA-141, RN-PLA-025/026, §17.4 |
| AGR-019 | RF-PLA-087, RF-PLA-118..128, §9.7, §17.6 |
| AGR-020 | RF-PLA-035, RF-PLA-083, RF-PLA-129..135, §17.7 |
| AGR-034 | RF-PLA-038, RF-PLA-087, RF-PLA-101..106, §9.5 |
| AGR-035 | RF-PLA-034, RF-PLA-045, RF-PLA-109, RF-PLA-112..116 |
| AGR-036 | RF-PLA-034, RF-PLA-054, RF-PLA-162 |
| §5.1 Módulos | RF-PLA-004, §7.4 |
| §5.2–5.3 Contratos entre módulos / datos | RF-PLA-005, RF-PLA-007, §7.4 manifiesto |
| §5.4 Ambientes | RF-PLA-115, §7.12 |
| §5.5 Eventos y jobs | RF-PLA-009, RF-PLA-140..142, §12 |
| §5.6 Observabilidad | RF-PLA-136..138 |
| §7 (calidad/pruebas) | §17 |
| §8 (olas) | Encabezado y columna Ola |
| §10 [R1] | RF-PLA-058, RNF-PLA-012 |
| §10 [R2] | RF-PLA-024, RF-PLA-033 |
| §10 [R3] | RF-PLA-015 |

### 22.3. CNX (Connectia)

| Fuente | Destino |
|---|---|
| §1 Contexto / stack no decidido | CTR-PLA-04 |
| §2.1 Stack y dependencias | RF-PLA-002, RF-PLA-061, RF-PLA-132, RF-PLA-136, RF-PLA-150, PRM-PLA-041 |
| §2.2 Estructura | RF-PLA-003, RF-PLA-006 |
| §2.3 Multitenancy | RF-PLA-017..019, RF-PLA-036 |
| §2.4 Catálogo de módulos y packs | RF-PLA-063..068, RF-PLA-071, RF-PLA-072 |
| §2.5 Rate limit | RF-PLA-133 |
| §2.6 Servicios, jobs, validación | RF-PLA-010, RF-PLA-012, RF-PLA-014, RF-PLA-015 |
| §2.7 Notificaciones/alertas | RF-PLA-091 |
| §2.8 Despliegue (`.env`, SSH, timeouts) | RF-PLA-013, RNF-PLA-001, RNF-PLA-009, RNF-PLA-010, CTR-PLA-05 |
| §3.2 Branding | RF-PLA-057 |
| §4.2 Menú declarativo / IA propone | RF-PLA-057, RF-PLA-067, RN-PLA-038 |
| §4.3 Alta asistida | RF-PLA-037, RF-PLA-041, RF-PLA-056, RF-PLA-057 |
| §4.5 IA cita datos | RF-PLA-029 |
| §4.6 Validación | RF-PLA-014 |
| §9 Lecciones | CTR-PLA-05 |
| §10 V-01 (uploads públicos) | RF-PLA-012, RF-PLA-025, RN-PLA-030 |
| §10 V-02 (secretos) | RNF-PLA-001 |
| §10 V-04 | RNF-PLA-002 |
| §10 V-05 | RNF-PLA-003 |
| §10 V-07 (rate limit) | RF-PLA-133, PRM-PLA-037 |
| §10 V-13 (usuarios demo) | RF-PLA-110, RNF-PLA-004 |
| §10 Token en README | RNF-PLA-001, CTR-PLA-06 — **no copiado** |
| §10 restantes (V-03, V-06, V-08..V-12) | Delegado a T02/T08 (autenticación, cabeceras, validación) |
| §11 Recomendaciones | §7 (adoptadas), CTR-PLA-05 |
| §12 Pendientes | Descartado: propios del prototipo; las decisiones vigentes son las DEC |

### 22.4. DFA (Definición funcional y alcance)

| Fuente (Módulo 1) | Destino |
|---|---|
| Usuarios (`USERS*`, `CLAVES`) | Delegado a T02 |
| Perfiles (`PERFILES*`, `MENUSYS`, `MENUVAL`) | Delegado a T02; menú → RF-PLA-067 / T03 |
| `MODULOS` | RF-PLA-063, §19.1 |
| Auditoría (`AUDITO`, `AUDITORIA`, `INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA`) | T02; RN-PLA-024, RN-PLA-032, §19.1 |
| Autorización de operaciones (`AUTORIZACIONES`) | Delegado a T11 |
| Bloqueos (`BLOQUEO_FILAS`, solo lectura) | RN-PLA-043 |
| Copia de seguridad, Base de datos, Actualizar | RF-PLA-117, RF-PLA-146, CTR-PLA-15 |
| Firma digital/electrónica | Delegado a T11 |
| API para terceros (`WS_KEYS`, `WS_USERS*`) | T06; medición RF-PLA-083 |
| Configuración general (`ConfiguracionesSistema`, `INFO_SYS`) | T04; §19.1 |
| Mejoras: OpenIddict | CTR-PLA-02 |
| Mejoras: una base por cooperativa | CTR-PLA-01 |
| Mejoras: roles por acción, auditoría inmutable, aprobaciones | Delegado a T02/T11 |
| §33 Plan y fechas; criterio del paralelo | CTR-PLA-10; §19.4 → T07 |

### 22.5. RN-09 (reglas técnicas ProCoop)

| Fuente | Destino |
|---|---|
| §3 (empresa, `.pro`, varias bases) | RN-PLA-001..006, §19.1 |
| §4.1 (contraseñas maestras) | RF-PLA-103, RN-PLA-018 |
| §4.2 (auditoría) | T02; RN-PLA-024 |
| §4.3 (log, `BLOQUEO_FILAS`) | RF-PLA-143, RN-PLA-027, RN-PLA-043 |
| §5.1 (arranque) | RF-PLA-146 |
| §5.2 (modos 1–12, TLS, reloj) | RF-PLA-155, RNF-PLA-006, RNF-PLA-007, §19.3 |
| §5.3 (`.pro`, usuario SQL único) | RNF-PLA-001, RNF-PLA-005, RN-PLA-041, RN-PLA-049 |
| §5.4 (licencia) | RN-PLA-007..009, CTR-PLA-16 |
| §5.5 (reflexión) | RF-PLA-155, RN-PLA-038 |
| §5.6 (novedades, encuestas) | RF-PLA-093, RF-PLA-108, RF-PLA-152 |
| §5.7 (versión y estructura) | RF-PLA-146, RF-PLA-147, RN-PLA-037 |
| §5.8 (Agente) | RF-PLA-093, RF-PLA-117, RF-PLA-154, RN-PLA-028, RN-PLA-039, §19.3 |
| §7.1–7.10 (riesgos) | 7.5 → CTR-PLA-01; 7.6 → RNF-PLA-001/005; 7.9 → RF-PLA-147; 7.10 → RF-PLA-010, RF-PLA-154; 7.1–7.4, 7.7, 7.8 → RN-PLA-034, RN-PLA-036, RN-PLA-045, RN-PLA-049 y T08 |
| §8.1–8.8 (recomendaciones) | 8.6 → RF-PLA-143; resto adoptado en §7 (ARQ-PLA-01..12) y RNF-PLA-001..015 |

### 22.6. FIC §22, CAT §28–§29, INV

| Fuente | Destino |
|---|---|
| FIC §22 backup, tareas, carpetas, sincronización, FTP, padrón | RF-PLA-010, RF-PLA-012, RF-PLA-059, RF-PLA-117, RF-PLA-154, RN-PLA-030, RN-PLA-040, RN-PLA-041 |
| CAT §28 (33 tablas) | §19.2, tabla por tabla |
| CAT §29 `ADJUNTOS` | RN-PLA-030, §19.1 |
| CAT §29 `BLOQUEO_FILAS` | RN-PLA-043 |
| CAT §29 `EQUIPOS` | RN-PLA-042, §19.1 → T06 |
| CAT §29 `ESTADOS`, `OPERACIONES`, `OPE_COM` | §19.1 → T04/T11 |
| CAT §29 `INTEGRIDAD` | RN-PLA-044 |
| CAT §29 `MODULOS` | RF-PLA-063, §19.1 |
| CAT §29 `PROCOOPAR_ADJUNTOS` | RF-PLA-108, §19.1 (descartado el contenido) |
| CAT §29 `RELACION_ENTIDADES` | §19.1 → T11 |
| INV frmLogin, abm_Users, abm_Perfiles, frmAuditoriaLogin, frmAutorizaciones | Delegado a T02/T11 |
| INV Program, Inicio_ProCoop | RF-PLA-146, RF-PLA-147, RF-PLA-155 |
| INV frmConfiguraciones, frmSelectConfiguracion, frmRecuperaConfiguracion | RN-PLA-002, RN-PLA-003, RN-PLA-022, §19.1 |
| INV frmMigrarTabla | Delegado a T07 |
| INV IconoNotificacion | RN-PLA-040, RF-PLA-093 |
| INV frmEncuestas, frmLoNuevo, frmAdjuntoProcoopar | RF-PLA-108, RF-PLA-152 |
| INV frmInformes | Delegado a M18 (BIA) / T10 |
| INV frmTransicion | §19.2 (ENTIDA*), RN-PLA-038 |
| INV frmProcesos | RF-PLA-147 |
| INV frmSoporteIP | RN-PLA-018, RF-PLA-101..106 |
| INV frmChequearVersion, frmActualizar | RF-PLA-146 |
| INV frmOpcionesEspeciales | Descartado: opciones de mantenimiento local reemplazadas por operación de plataforma (CTR-PLA-15) |
| INV frmBaseDatos | RF-PLA-117, RF-PLA-160 |
| INV abm_TareasProgramadas* | RF-PLA-154, §19.3 |
| INV frmComparadorCambios | Delegado a T04 (diferencias entre versiones de configuración) |
| INV abm_Equipos | RN-PLA-042 |
| INV frmVariables, frmVariables_PMovil | §14, §19.2 → T04 |
| INV frmProgressBar_WithLog, frmProcesoAutomatico | RF-PLA-140 |

### 22.7. Variables V2 (orígenes de parámetros)

518–527, 709 → PRM-PLA-002, RN-PLA-006; 519 → RN-PLA-007; 2085 → RF-PLA-147, PRM-PLA-048; 2786/2051 → PRM-PLA-013; 2925 → PRM-PLA-052; 2730/2648/2731 → PRM-PLA-053; −1 → PRM-PLA-051; 2588 (forzar cambio de clave genérica) → Reemplazado: no existen claves genéricas (RNF-PLA-004); política de contraseñas en T02.

### 22.8. Decisiones del solicitante que alcanzan a T01

| DEC | Destino en este anexo |
|---|---|
| DEC-020 (claves de mapas e IA de plataforma, con opción propia del tenant) | RF-PLA-029; claves en la bóveda de T06 |
| DEC-021 (la plataforma habilita servicios por licencia; el tenant publica con aprobación en producción) | RF-PLA-065, RF-PLA-070 |
| DEC-025 (copias entre tenants con autorización explícita del tenant origen) | Reemplazado por RF-PLA-164 y RN-PLA-051. Texto anterior: sin requisito propio: la copia es de M02 y la recibe T04 como versión en borrador; el acceso de soporte entre tenants sigue la concesión de T02 |
| DEC-026 (plantillas de plataforma sin precios ni condiciones reguladas) | RF-PLA-165 y RN-PLA-052; además RF-PLA-070 (la oferta la crea el tenant; las plantillas de servicio las define M02) |
| DEC-062 (región AWS sa-east-1) | RF-PLA-076, CTR-PLA-14, PA-PLA-01 |
| DEC-063 (disponibilidad, RPO, RTO, latencia y soporte) | RF-PLA-076, PA-PLA-02, PA-PLA-03 |
| DEC-064 (varias entidades jurídicas por tenant) | RN-PLA-006, RN-PLA-007, EVT-PLA-01, EVT-PLA-21, EVT-PLA-22, §7.11.1, §19, CTR-PLA-17, PA-PLA-14 |
| DEC-065 (packs, complementos y facturación del SaaS) | RF-PLA-072, RF-PLA-078, PA-PLA-08, PA-PLA-09 |
| DEC-074 (bóveda con cifrado por sobre y AWS KMS) | RF-PLA-127 |
| DEC-075 (perfil de capacidad) | RF-PLA-131 |
| DEC-076 (CoopApps como prestador de tratamiento, art. 25) | RF-PLA-076 |
| DEC-077 (dos modelos de mensajería) | RF-PLA-078 |
