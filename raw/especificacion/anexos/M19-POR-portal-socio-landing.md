# M19 POR — Landing, portal y app del socio (autogestión)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Landing-autogestión (solución 3: "Landing page y autogestión de cada tenant") |
| Olas | O2 (landing, registro, vinculación, portal base, contratación con formularios, gestiones, baja pública, comunidad), O3 (visitas, instalador en camino, conformidad), O4 (facturas, factura digital), O5 (pagos online, cupón único, débito automático, representaciones de pago), O6 (mora en portal, convenios, suspensión/reactivación, migración de usuarios del piloto), O7 (consumos, autolectura, prepaga), O9 (portal del empleado), O10 (turnos online, tótem de autogestión), O11 (migración repetible de CoopOnline, métricas avanzadas) |
| Dueño de datos | `landingPages`, `landingPageVersions`, `portalAccountAccess`, `portalLinkAttempts`, `portalDelegationInvites`, `portalForms`, `portalFormSubmissions`, `portalDrafts`, `publicSubmissions`, `portalUserPreferences`, `portalBanners`, `legacyPortalImports`, `legacyPortalUserMap`, `kioskDevices`. **No** es dueño de usuarios/credenciales (T02), marca/diccionario (T03), personas/cuentas/contratos (M01), catálogo (M02), lecturas (M03), comprobantes (M05), pagos/cuenta corriente (M07), mora/convenios (M08), casos CRM/turnos (M09), visitas/OT (M10), legajos/recibos (M16) ni publicaciones/notificaciones/encuestas (T09). |
| Fuentes consolidadas | BASE §3 (marca y landing, autogestión y ERP, servicios habilitables y alta pública, espacios de trabajo), §25, §35 checklist ítems 35–37, 44, 47, §41, §43, §46, §48, §50, §52.3, §53, §57, §65, §66, §67, §71, §82, §97.12, §98, §101, §103 (FAC-011), §105 solución 3, §106, MER-018; AGR-006, AGR-007, AGR-024, AGR-031, AGR-032, ESC-01; DFA M26; FIC 14.1; RN-10 §3 (3, 3.1–3.6), §11 (tótem), §12, §13, §14, §15, §16 (turnero, calendario web, canal RSS/encuestas del proveedor); RN-09 parámetros `VARIABLE_PMOVIL` canal CoopOnline/PWeb y `VARIABLE` WEB/CoopOnline/Autogestión (lista completa en §14 y §22); CAT §26 (`REQUISITOS`, `REQUISITOS_ITEMS`, `RSSFEED`, `WEB_LOG`, `WEB_NOVEDADES`, `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS`); INV `AutoGestion.md` (71 tipos); CNX §2.5, §2.7, §3.1–§3.8 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Dar a cada cooperativa (tenant) una **presencia digital propia** (landing con su marca, noticias, servicios habilitados, consultas públicas, botón de baja) y a cada persona de su comunidad una **aplicación única de autogestión** (PWA instalable) en la que pueda:

1. Registrarse de forma sencilla sin ser todavía asociado ni tener servicio (BASE §67, REG-001).
2. Vincular, con verificación suficiente, las cuentas y contratos existentes que le pertenecen o que le autorizaron (BASE §25, AGR-006, AGR-007), incluidos los usuarios que ya usaban CoopOnline, **sin volver a registrarse** (FIC 14.1).
3. Recorrer el **ciclo completo de una prestación** (BASE §50, AUT-001…006; DEC-005 piloto Internet): contratar con formularios por servicio, coordinar la visita, seguir la instalación, firmar conformidad, consultar consumos y facturas (separadas o agrupadas con apertura por servicio, FAC-011), pagar en línea con confirmación real, reclamar con fotos y seguimiento, suspender, reactivar y dar de baja.
4. Recibir notificaciones, responder encuestas y leer el muro y las novedades de su cooperativa (BASE §46, DEC-008, T09).
5. Actuar en nombre de otro solo con autorización vigente y trazable (AGR-007, ESC-01).
6. Si además es empleado de la cooperativa, acceder en la **misma PWA** a su espacio de empleado (recibos, vacaciones, licencias) sin mezclar datos (BASE §3 espacios de trabajo; RN-09 VAR_PMOVIL 41, VAR 3122, 3166).

Todo ello accesible (objetivo WCAG 2.2 AA verificado, AGR-032), tolerante a errores (borradores, recuperación de carga interrumpida) y con el **lenguaje y la marca del tenant** (diccionario `dict:`, BASE §65; branding T03).

El piloto Internet exige que, al cierre de O6, el socio pueda **contratar (O2), coordinar visita (O3), ver factura (O4), pagar factura (O5), reclamar (O2) y pedir la baja (O2)** desde este módulo.

## 2. Límite y responsabilidades

### 2.1. Qué hace este módulo

- Especifica y construye las **superficies de cara al público y al socio**: landing pública por tenant (`apps/landing` o rutas públicas de la PWA), PWA del socio (`apps/pwa`, espacio `socio`), espacio del empleado dentro de la misma PWA (`apps/pwa`, espacio `empleado`), enrutamiento por rol hacia la app de campo (M10/M03) y el **modo tótem** de autogestión presencial (PA-POR-06).
- Define las **pantallas, recorridos, mapa de sitio y reglas de visibilidad** (qué ve cada rol, con qué datos, en qué estado).
- Expone los **endpoints de cara al socio** (`/api/por/...`), al empleado (`/api/por/empleado/...`), públicos (`/api/public/<tenantSlug>/...`) y la administración del portal (`/api/admin/por/...`). Estos endpoints son **fachadas (BFF)**: validan alcance del socio y delegan en los servicios de los módulos dueños; nunca escriben directamente colecciones ajenas (DEC-003).
- Es dueño de: configuración y versiones de la landing; **accesos del portal** (vínculo usuario ↔ cuenta con alcance por acción y vigencia); intentos de vinculación; invitaciones de representación; **motor de formularios por servicio** (definición, versiones, presentaciones); borradores; recepciones públicas (baja pública, contacto, consulta) hasta su derivación al CRM; preferencias del portal; banners por rol; migración de usuarios de CoopOnline; tótems.
- Calcula el **rol de inicio** (landing por rol) en servidor a partir de los datos de los módulos dueños.

### 2.2. Qué NO hace (y a quién delega)

| Tema | Responsable | Qué consume este módulo |
|---|---|---|
| Usuarios, credenciales, registro técnico, login, 2FA, Google/CiDi, recuperación, sesiones, pertenencias a tenants, auditoría genérica | T02 IAM | `iam` comandos `registerUser`, `login`, `verifyContact`, `selectTenant`, `listMemberships`; eventos `iam.identity.created` (EVT-IAM-01), `iam.membership.*` (EVT-IAM-03) |
| Marca, colores, logos por canal, splash, manifest, diccionario, tokens de diseño, componentes PWA | T03 UXD | `brandingRuntime(tenantSlug)`, `dict:` claves, componentes `PwaModal`, `PwaTabs`, `PwaEmptyState`, `PwaFab`, `PwaFilePicker`, `ConfirmSheet`, `SplashScreen`, `PwaOfflinePendingBanner`, `PendingSurveysBanner` |
| Parámetros versionados, calles/geografía | T04 CFG | lectura de `PRM-POR-*`, autocompletado de calles |
| Personas, titulares, asociados, cuentas, inmuebles, domicilios, contratos, representaciones legales (evidencia) | M01 PER | vistas `accountSummary`, `contractsByAccount`, `personRelations`; comandos `requestAddressChange`, `requestOwnershipChange` |
| Catálogo y oferta habilitada, planes, requisitos, capacidades por servicio (adherentes, artefactos, autolectura, prepaga, botón de baja) | M02 CAT | `publicOffer(tenant)`, `serviceCapabilities(serviceCode)`; componentes embebidos PAN-CAT-21/22/23 con API-CAT-49/50/51; plantilla de DDJJ por servicio (PRM-CAT-110, API-CAT-41) (HUE-SRV-04, HUE-GAS-01) |
| Tarifas: explicación de factura, plan de cuotas de obra, importe de llamadas tasadas | M04 TAR | API-TAR-060 (explicación), API-TAR-066 (plan de cuotas de obra, solo lectura; HUECO-OBR-03), importe tasado por llamada (HUE-TEL-02) |
| Equipos asignados al contrato | M13 STK | componente PAN-STK-40 con API-STK-45 (HUE-SRV-04) |
| Servicios sociales del socio: grupo y coberturas, solicitudes, cementerio, vivienda; buscador público de difuntos | M18 SOC | componentes PAN-SOC-30 a PAN-SOC-33 con API-SOC-056 a API-SOC-059; API-SOC-061 (si PRM-SOC-050) (HUE-SRV-04, HUECO-CEM-02) |
| Lecturas, consumos, autolectura (validación), prepago y telemedición | M03 MED | `consumptionHistory`, comando `submitSelfReading`, `prepaidQuote`, `prepaidSell` |
| Comprobantes, PDF, apertura por servicio, factura digital (canal de entrega) | M05 FAC | `invoicesByAccount`, `invoiceDetail` (con renglones por servicio), `invoicePdfUrl`, comando `setDeliveryChannel` |
| Percepciones e impuestos de recargos | M06 FIS | cálculo dentro de checkout M07 |
| Cuenta corriente, saldos, checkout, pasarelas, cupón de pago, débito automático, recibos, imputación | M07 COB | `accountStatement`, comandos `createCheckout`, `createPaymentCoupon`, `adhereDirectDebit`, `cancelDirectDebit`; eventos `cob.paymentIntent.statusChanged` (EVT-COB-20), `cob.payment.confirmed` (EVT-COB-04, con recibo e imputación), `cob.directDebitMandate.changed` (EVT-COB-17) |
| Mora, suspensión, reconexión, convenios, cuotas, costos de reactivación | M08 MOR | `delinquencyStatus(account)`, `agreements`, comandos `requestAgreement`, `quoteReactivation` |
| Casos CRM (solicitudes de alta/baja, reclamos, consultas, trámites), chat/bot, SLA, turnero | M09 CRM | comandos `openCase`, `addCaseMessage`, `confirmResolution`, `reopenCase`, `bookOfficeTurn`; eventos `crm.case.*` |
| Factibilidad, agenda de visitas, OT, instalación, conformidad, equipos en comodato, aprovisionamiento | M10 TEC | `availableSlots`, comandos `bookVisit`, `rescheduleVisit`, `cancelVisit`, `signInstallationConformity`; eventos `tec.visit.*`, `tec.workOrder.*` |
| Recibos de sueldo, vacaciones, licencias, legajo | M16 SUE | `payslips`, `signPayslip`, `leaveBalances`, `requestLeave` |
| Solicitud de ingreso como asociado; "Mi asociación" | M17 INS | comando `requestMembership`; componente PAN-INS-30 con API-INS-063 a API-INS-066 (HUE-SRV-04) |
| Muro, novedades, boletines, encuestas, notificaciones, preferencias de comunicación, audiencia, moderación | T09 COM | feeds y comandos de T09 filtrados por audiencia del rol |
| Workflow de aprobaciones, expediente documental, almacenamiento privado | T11 WFL | adjuntos al expediente del caso, URL firmadas |
| Integraciones externas (CiDi, Discar "Mi Medidor", pasarelas, push, WhatsApp, dominio propio) | T06 INT | conectores |
| Métricas y BI | T10 BIA | indicadores del §15 publicados como cubos |
| Migración masiva de datos de ProCoop | T07 MIG | este anexo define el mapeo de usuarios y accesos de CoopOnline |

### 2.3. Principios de frontera

1. **Canal, no dueño del proceso** (BASE §25 límite): el portal no puede cambiar tarifas, aprobar acuerdos excepcionales ni validar un pago por la sola acción del usuario.
2. **Solicitar no equivale a ejecutar** (BASE §48): toda activación, suspensión, reactivación o baja se presenta como trámite hasta que el módulo dueño confirme el hecho.
3. **Ningún dato privado en lo público** (BASE §43.6, §46): la landing y las consultas sin login nunca devuelven datos que identifiquen a una persona más allá de lo que el propio solicitante aportó.
4. **El portal lee los mismos datos** (FIC 14.1, RN-10 §14 punto 3): desaparecen la base MySQL externa, Firebase, la sincronización `clsWEB` y el FTP de PDF.
5. **M19 es dueño de la ruta y de la composición** en `pwa-socio` y `landing` (HUE-SRV-04, HUECO-TRV-04): las pantallas de socio que declaran otros módulos (CAT, FAC, MED, TEC, STK, MOR, SOC, INS) son componentes embebidos en una PAN-POR; el módulo dueño aporta datos, reglas y API, y M19 aporta ruta, navegación, capability de acceso y mapa del sitio (§10.6.A).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Landing | Sitio público de la cooperativa con su marca, noticias, servicios y accesos. | `dict:por.landing` | Página de CoopOnline / "Procoop WEB" |
| Portal / app del socio | PWA autenticada de autogestión. | `dict:por.portal` | CoopOnline (web y app), PWeb |
| Usuario registrado | Persona con identidad de acceso en la plataforma y pertenencia al tenant, sin cuentas vinculadas. | `dict:por.usuarioRegistrado` | `WS_USERS` sin `WS_USERS_ACCOUNTS` |
| Asociado | Persona con vínculo institucional con la cooperativa (M17). | `dict:per.asociado` | Socio (`SOCIOS`) |
| Titular | Persona responsable de un contrato/cuenta (M01). | `dict:per.titular` | Titular |
| Cuenta | Agrupador de contratos de un titular (M01). | `dict:per.cuenta` | Cuenta / `CUENTAS` |
| Contrato / servicio contratado | Prestación de un servicio a un titular en un inmueble (M01/M02). | `dict:per.contrato` | Servicio de la cuenta (`SERSOC`), suministro |
| Acceso del portal | Vínculo verificado entre un usuario y una cuenta con un alcance de acciones y una vigencia. | `dict:por.acceso` | `WS_USERS_ACCOUNTS` |
| Vinculación | Proceso por el que un usuario acredita su relación con una cuenta. | `dict:por.vincularCuenta` | "Agregar cuenta" (VAR_PMOVIL 5–9) |
| Autorizado / representante | Persona a la que el titular otorga acciones sobre su cuenta, con vigencia. | `dict:por.autorizado` | — (no existía) |
| Pagador eventual | Persona que paga un comprobante ajeno por código de pago, sin ver datos de la cuenta. | `dict:por.pagadorEventual` | Pago con código de barras/QR de un tercero |
| Trámite | Caso CRM originado por el socio (solicitud de alta, baja, suspensión, cambio, DDJJ). | `dict:por.tramite` | Trámite web (`REQUISITOS`, `Requisitos_Usuarios`) |
| Estado del trámite | Situación del caso CRM (recibido, en revisión, observado…). | `dict:por.estadoTramite` | `Tipo_Estado_Req` (cargado, aceptado, rechazado, cancelado) |
| Estado del servicio | Situación real del contrato (pendiente de alta, activo, suspendido, dado de baja). | `dict:por.estadoServicio` | `CONDICION` 1 a 4 de `SERSOC` |
| Formulario por servicio | Definición versionada de los campos que el socio completa para un trámite. | `dict:por.formulario` | `REQUISITOS` + `REQUISITOS_ITEMS` |
| Borrador | Presentación guardada sin enviar, recuperable. | `dict:por.borrador` | — |
| Gestión | Reclamo, consulta o trámite con número de seguimiento. | `dict:por.gestion` | Reclamo web / incidente |
| Cupón único | Documento de pago que reúne varias facturas con un vencimiento propio. | `dict:por.cuponUnico` | Talón de pago (`crearCobranza`, "todas las facturas del talón") |
| Checkout | Intención de pago creada en M07 para una pasarela. | `dict:por.checkout` | Solicitud `PAGOS360` tipo 9 (cobranza CoopOnline) |
| Recarga prepaga | Compra de crédito de un servicio prepago. | `dict:por.recargaPrepaga` | Venta de prepaga, `PAGOS360` tipo 7 |
| Factura digital | Adhesión a recibir el comprobante por canal electrónico en lugar de papel. | `dict:por.facturaDigital` | Adhesión a factura web / facturación electrónica (VAR_PMOVIL 32, 911) |
| Débito automático | Adhesión a cobro recurrente por tarjeta o CBU. | `dict:por.debitoAutomatico` | Adhesión débito automático (VAR_PMOVIL 27) |
| Autolectura | Lectura de medidor informada por el socio con foto. | `dict:por.autolectura` | — (MER-018) |
| Baja pública / botón de baja | Recepción de solicitud de baja sin registro previo. | `dict:por.botonBaja` | — (Res. 316/2018) |
| Código identificador de baja | Código que se entrega al solicitante para seguir su baja. | `dict:por.codigoBaja` | — |
| Rol de inicio | Perfil de navegación calculado (visitante, registrado, socio activo, moroso, suspendido, con baja, empleado, técnico, representante). | `dict:por.rolInicio` | — |
| Espacio | Contexto de trabajo dentro de la PWA: socio, empleado, campo. | `dict:por.espacio` | CoopOnline vs PWeb |
| Ámbito | Tenant seleccionado por el usuario. | `dict:por.ambito` | Número de cliente del proveedor (`Cod_Sum`) |
| Tótem | Terminal presencial de autogestión (pago, recarga) en sucursal. | `dict:por.totem` | `AutoGestion.exe` |
| DDJJ de artefactos | Declaración jurada de artefactos del suministro **por servicio**, con la plantilla que define M02 (PRM-CAT-110): gas, artefactos con potencia en kcal/h; energía, artefactos eléctricos y vehículos eléctricos (HUE-GAS-01). Texto original: "Declaración jurada de artefactos eléctricos del suministro." | `dict:por.ddjjArtefactos` | `CrearDDJJ_Artefactos`, `ARTEFSUMS` |
| Detalle de llamadas | Listado por período de las llamadas atribuidas y tasadas de una línea telefónica, de solo lectura (HUE-TEL-02). | `dict:por.detalleLlamadas` | `ImprimirDetalleLlamadas` |
| Plan de cuotas de obra | Cuota actual n/N, saldo y unidades de un contrato de obra, de solo lectura desde M04 (HUECO-OBR-03). | `dict:por.planCuotasObra` | — |
| Buscador de difuntos | Consulta pública de la ubicación de un difunto en el cementerio parque, si el tenant la habilita (HUECO-CEM-02). | `dict:por.buscarDifunto` | — |
| Componente embebido | Bloque de pantalla de otro módulo que M19 compone dentro de una ruta propia; el módulo dueño aporta datos y reglas por su API y M19 es dueño de la ruta, la navegación y la composición (HUE-SRV-04). | `dict:por.componenteEmbebido` | — |
| Adherente | Persona beneficiaria agregada a un servicio que lo admite. | `dict:per.adherente` | `ADHSOC` |
| Mi Medidor | Enlace a la consulta del proveedor de telemedición. | `dict:por.miMedidor` | `GetURLMiMedidorDiscar` (VAR_PMOVIL 55) |

## 4. Actores, permisos y alcance

Las capabilities de cara al socio se otorgan por el **perfil de portal** (T02) a toda persona con pertenencia al tenant; el **alcance** se resuelve por los `portalAccountAccess` vigentes y la acción concreta (consultar, pagar, gestionar, solicitar baja, firmar). Las capabilities de administración siguen el patrón `por.recurso.accion`.

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Visitante (sin sesión) | Ninguna (endpoints `/api/public/<tenantSlug>/...` con rate limit) | Contenido público del tenant; sus propias recepciones públicas por código |
| Usuario registrado | `por.portal.ver`, `por.cuentas.vincular`, `por.servicios.contratar`, `por.gestiones.crear` (consultas), `por.borradores.gestionar`, `por.perfil.editar`, `por.preferencias.editar` (preferencias del portal), `com.wall.ver`, `com.surveys.responder`, `com.inbox.ver`, `com.preferences.editar` | Sus datos personales, sus borradores, sus trámites de alta sin cuenta |
| Socio titular | Lo anterior + `por.servicios.ver`, `por.servicios.solicitarBaja`, `por.servicios.suspender`, `por.visitas.gestionar`, `por.facturas.ver`, `por.facturas.descargar`, `por.pagos.crear`, `por.debito.gestionar`, `por.facturaDigital.gestionar`, `por.consumos.ver`, `por.autolectura.crear`, `por.prepaga.comprar`, `por.gestiones.crear`, `por.turnos.gestionar`, `por.representaciones.gestionar`, `por.constancias.descargar`, `por.ddjj.presentar`, `por.adherentes.gestionar`, `por.conformidades.firmar` | Cuentas con acceso `titular` vigente: todas las acciones |
| Cotitular / representante legal | Igual que titular | Cuentas con acceso `cotitular` o `representanteLegal` vigente, con el alcance de la evidencia validada |
| Autorizado por el titular | Subconjunto otorgado: `consultar` → `por.servicios.ver`, `por.facturas.ver`, `por.consumos.ver`; `pagar` → `por.pagos.crear`; `gestionar` → `por.gestiones.crear`, `por.visitas.gestionar`; `solicitarBaja` → `por.servicios.solicitarBaja`; `firmar` → `por.conformidades.firmar` (antes: conformidades) | Solo las cuentas y acciones de la invitación aceptada, dentro de su vigencia |
| Pagador eventual | `por.pagos.crear` restringido a un cupón/código | Importe y vencimiento del cupón, sin datos de la cuenta |
| Socio moroso / suspendido | Igual que titular (no se recortan consulta, pago, reclamo, baja, constancias) | Igual; las nuevas contrataciones según PRM-POR-071 |
| Empleado | `por.empleado.ver`, `sue.portal.recibos.ver` (antes `sue.recibos.ver`), `sue.portal.recibos.firmar` (antes `sue.recibos.firmar`), `sue.portal.licencias.solicitar` (antes `sue.vacaciones.solicitar`), `sue.portal.licencias.solicitar` (antes `sue.licencias.solicitar`), `sue.portal.datos.ver` (antes `sue.legajo.ver`), `com.wall.verInterno`, `com.inbox.ver` | Solo su legajo (`scope: propios`) |
| Empleado no usuario del sistema | Perfil de portal de empleado (VAR_PMOVIL 41) | Solo su legajo; sin acceso a admin |
| Tótem de autogestión (identidad de dispositivo) | `por.totem.operar` (antes: credencial de dispositivo, sin capability); la operación de cobro usa además el alcance de la persona identificada en PAN-POR-79 | Solo la cuenta identificada en la sesión del tótem; sin datos personales en pantalla más allá de lo necesario para pagar |
| Técnico, lecturista, cobrador | Capabilities de M10/M03/M07 | Redirección a la app de campo; fuera de este anexo |
| Operador de atención | `por.vinculaciones.ver`, `por.vinculaciones.aprobar`, `por.accesos.ver`, `por.accesos.revocar`, `por.recepcionPublica.ver`, `por.recepcionPublica.derivar`, `por.vistaSocio.ver` | Sucursales/servicios de su alcance (T02) |
| Administrador de marca y contenidos | `por.landing.ver`, `por.landing.editar`, `por.landing.publicar`, `por.banners.configurar` | Tenant |
| Administrador funcional del portal | `por.parametros.configurar`, `por.formularios.ver`, `por.formularios.configurar`, `por.formularios.publicar`, `por.totems.configurar`, `por.metricas.ver`, `por.metricas.exportar` | Tenant |
| Responsable de migración | `por.migracion.ver`, `por.migracion.ejecutar` | Tenant |
| Soporte de plataforma | `por.vistaSocio.ver` solo con acceso temporal auditado (T01/T02) | Tenant asignado y período del acceso |

Regla transversal: **ninguna capability de socio se evalúa sin el alcance** del acceso a la cuenta; poseer `por.facturas.ver` no permite ver facturas de una cuenta sin acceso vigente (BASE §25 control).

## 5. Requisitos funcionales

Prioridad: N = Núcleo, E = Estándar, X = Extensión. Estado: I = Informado, A = Adoptado, AV = A validar (PA indicada).

### 5.1. Landing pública

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-001 | Cada tenant dispone de una landing propia con su marca (T03), accesible por subdominio `<tenantSlug>.<dominioPlataforma>` y, opcionalmente, dominio propio. | BASE §3, MAR-007, §43.4 | N | O2 | AV (PA-POR-12) | Al crear y publicar TEN-001, `https://coop-a.<dominio>/` muestra la marca de TEN-001 y nunca la de otro tenant. |
| RF-POR-002 | La landing se compone de bloques configurables: portada (hero), servicios destacados, accesos rápidos (Ingresar, Registrarme, Pagar, Botón de baja, Turnos), noticias, avisos de interrupción, trámites y requisitos, preguntas frecuentes, contacto, sucursales y horarios, redes, pie legal. | MAR-007, §43.4, §43.7 | E | O2 | AV (PA-POR-13) | El administrador activa/desactiva y ordena bloques; el orden se refleja tras publicar. |
| RF-POR-003 | Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. | §43.4 (propuesta), §43.9 | E | O2 | A | Solo existe una versión publicada; revertir restaura la anterior en menos de 1 minuto y queda auditado. |
| RF-POR-004 | Catálogo público con los servicios habilitados del tenant para nuevas contrataciones (M02), sin servicios no ofertados. | CAT-002, §66, §67 | N | O2 | I | TEN-001 (Agua, Electricidad, Cementerio parque) no muestra Gas; TEN-002 sí. |
| RF-POR-005 | Ficha pública de servicio: descripción, planes publicables con precio vigente e impuestos incluidos, requisitos y documentación, cobertura, condiciones, T&C, preguntas frecuentes y botón "Contratar". | §43.8, §72, §52.2 | N | O2 | A | Los precios mostrados coinciden con la tarifa vigente de M04 para la fecha de consulta y declaran si incluyen impuestos. |
| RF-POR-006 | Consulta de cobertura/factibilidad preliminar por domicilio sin login, con autocompletado de calles y **alternativa sin mapa**. | §50, AGR-032, M10 | E | O2 | A | Ingresando calle y altura se obtiene "con cobertura / a evaluar / sin cobertura" sin operar un mapa. |
| RF-POR-007 | Noticias públicas (T09, canal `landing`) en lista y detalle, sin datos privados. | NOT-001, §46 | N | O2 | I | Una noticia publicada solo para empleados no aparece en la landing. |
| RF-POR-008 | Avisos de interrupciones y cortes programados por zona y servicio. | §25 | E | O2 | I | Un aviso con zona "Centro" se muestra con fecha, horario y servicios afectados. |
| RF-POR-009 | Botón de baja visible en la portada y en el pie de toda página de la landing para los servicios alcanzados. Servicios alcanzados según DEC-057: habilitado en Internet, TV y telefonía, configurable en los demás; el código de seguimiento se entrega dentro de las 24 h. | §52.3 (Res. 316/2018), §43.3, §48, CIC-001; DEC-057 | N | O2 | I | El botón es visible sin desplazamiento en la portada (escritorio y celular) y en el pie. |
| RF-POR-010 | Baja pública sin registro previo: el solicitante elige servicio, se identifica con datos mínimos (DNI/CUIT, número de cuenta o suministro si lo conoce, domicilio) y un medio de contacto; recibe un **código identificador** por el mismo medio y una constancia. | §52.3, §53, checklist 44 | N | O2 | I | La solicitud se registra sin crear usuario; el código se entrega en pantalla y por el medio informado dentro del plazo de PRM-POR-081. |
| RF-POR-011 | Seguimiento público de la baja por código + documento, mostrando solo estado y fechas. | §52.3, §57 | E | O2 | A | Con código y DNI correctos se ve "Recibida / En proceso / Ejecutada con fecha efectiva"; con datos incorrectos, respuesta genérica. |
| RF-POR-012 | Consulta y pago de facturas sin login (opcional por tenant): número de cuenta + dato verificador; muestra solo comprobantes impagos y datos enmascarados. | V2 VAR_PMOVIL 60, 61; §25 control | E | O5 | AV (PA-POR-02) | Con el parámetro apagado la ruta responde "no disponible"; encendido, nunca se muestran nombre completo ni domicilio completo. |
| RF-POR-013 | Sección pública de trámites y requisitos: lista de formularios con descripción, documentación requerida, PDFs descargables y aviso de si requieren sesión. | CAT `REQUISITOS` (tipo PDF), RN-10 §3.5, DFA M26 "Requisitos y Trámites" | E | O2 | A | Un formulario tipo PDF se descarga sin login; uno tipo trámite web lleva a ingresar y retoma el formulario tras el login. |
| RF-POR-014 | Formulario público de contacto/consulta que crea un caso CRM de tipo consulta y notifica a la casilla configurada. | V2 VAR 812, 804 | E | O2 | A | El caso aparece en la bandeja de M09 con canal `landing`; el solicitante recibe número de seguimiento. |
| RF-POR-015 | Accesos "Ingresar" y "Registrarme" que mantienen el contexto del tenant (marca, diccionario, servicio elegido). | MAR-008, §43.4 | N | O2 | I | Desde la ficha de Internet, "Contratar" → registro → vuelve al formulario de Internet con la marca del tenant. |
| RF-POR-016 | Punto de entrada genérico de plataforma con buscador de cooperativa por nombre o localidad. | §67 | X | O2 | A | Buscar "Ejemplo" lista TEN-001 y TEN-002 y redirige a su landing. |
| RF-POR-017 | Encuesta externa por enlace con token sin login (T09). | CNX §3.8 `/e/:token` | E | O2 | A | Un token vencido muestra mensaje claro; uno válido permite responder una sola vez. |
| RF-POR-018 | Páginas legales por tenant: términos, privacidad, declaración de accesibilidad, T&C por servicio, con versión vigente. | §98 (Ley 25.326), AGR-032 | N | O2 | A | Cada página muestra versión y fecha de vigencia. |
| RF-POR-019 | Metadatos SEO, Open Graph, `sitemap.xml` y `robots.txt` por tenant; feed RSS opcional de noticias públicas. | CAT `RSSFEED` | X | O2 | A | `sitemap.xml` lista solo páginas públicas del tenant. |
| RF-POR-020 | Redirecciones permanentes desde las URLs de CoopOnline que la cooperativa ya difundió. | RN-10 §14 punto 3 | E | O7 (DEC-089; antes O11) | A | Una URL configurada responde 301 a la ruta equivalente. |
| RF-POR-021 | Aislamiento de contenido entre tenants y ausencia de datos de cuentas en la landing. | §43.6, §43.4 | N | O2 | I | Prueba automatizada: ninguna respuesta pública contiene identificadores de cuentas no aportados por el solicitante. |
| RF-POR-177 | Buscador público de difuntos en la landing (PAN-POR-104): por apellido y nombre devuelve nombre y ubicación (cementerio, sector, unidad) con datos de M18 (API-SOC-061). Solo se muestra si PRM-SOC-050 = true en algún establecimiento del tenant; sin documento ni datos del titular del derecho. | HUECO-CEM-02; M18 PRM-SOC-050 | E | O10 | A | Con PRM-SOC-050 = false la ruta responde "no disponible" y el ítem no figura en el menú; con true, buscar "Demo" lista solo nombre y ubicación. |

### 5.2. Registro, identidad y ámbito

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-022 | Registro sencillo desde la landing: correo o celular, contraseña o Google; verificación del medio por OTP/enlace (T02). Ingreso con contraseña o con código OTP de 6 dígitos por correo o SMS, habilitable por tenant, sin enlace mágico (DEC-066). | REG-001, §25, §67; DEC-066 | N | O2 | I | Una persona sin cuenta en la cooperativa se registra en menos de 2 minutos y queda "Usuario registrado". |
| RF-POR-023 | El registro no crea asociado, titular, cuenta ni contrato; el inicio muestra las opciones de contratar y vincular. | REG-001, §3, §67 | N | O2 | I | Tras registrarse, M01 y M17 no tienen registros nuevos. |
| RF-POR-024 | Datos mínimos en el registro; los datos fiscales y de domicilio se piden en la etapa del trámite que los requiera. | §25, §67 | N | O2 | I | El registro no exige CUIT; el formulario de contratación lo pide solo si el servicio lo requiere para facturar. |
| RF-POR-025 | Recuperación de acceso (T02) con respuesta genérica anti-enumeración. | §25, CNX §2.5 | N | O2 | I | Un correo inexistente recibe la misma respuesta que uno existente. |
| RF-POR-026 | Ingreso con Google y, si el tenant lo habilita, con identidad federada provincial (CiDi). Por DEC-067 el mecanismo de proveedor federado está en O1 (T02) y CiDi se habilita por tenant al publicar el portal (O2), con nivel mínimo 2 para vincular cuentas. | §67, V2 VAR_PMOVIL 40; DEC-067 | E | O2 | A (DEC-067; antes AV PA-POR-04) | Con 40 apagado no se muestra CiDi; Google no concede pertenencia ni vínculo por coincidencia de correo (checklist 47). |
| RF-POR-027 | Selección explícita del ámbito (tenant), comprobada en servidor y visible en la barra superior; el cambio recalcula permisos y purga caché, descargas y colas locales del ámbito anterior. | AGR-006 | N | O2 | A | Al pasar de TEN-001 a TEN-002, ningún dato de TEN-001 queda en pantalla, caché del Service Worker ni IndexedDB. |
| RF-POR-028 | Espacios dentro del tenant (socio, empleado, campo) con selector cuando la persona tiene más de uno; cada espacio tiene menú, inicio y almacén de datos propios. | BASE §3 espacios, CNX §3.8 rol externo | N | O2 | A | Un socio-empleado ve el selector; al cambiar de espacio se limpian los stores del otro. |
| RF-POR-029 | Aceptación versionada de términos y privacidad al registrarse y al publicarse una nueva versión (guard de router). | §98, CNX §3.3 | N | O2 | A | Con nueva versión publicada, el usuario debe aceptarla antes de seguir; queda registrada la versión aceptada. |
| RF-POR-030 | Exigir y verificar teléfono y/o correo del usuario según el tenant; reconfirmarlos periódicamente al ingresar si se configura. | V2 VAR_PMOVIL 15, 18, 19 | E | O2 | A | Con 18 activo, sin correo verificado no se puede adherir a factura digital ni vincular cuentas. |
| RF-POR-031 | Activación de usuarios migrados de CoopOnline sin re-registro: al ingresar con su correo/celular conocido reciben OTP, definen contraseña y encuentran sus cuentas vinculadas. | FIC 14.1, RN-10 §15 pregunta 4 | N | O6 | AV (PA-POR-03) | Un usuario migrado entra, valida OTP y ve sus 2 cuentas sin repetir la vinculación. |
| RF-POR-032 | Cierre de sesión por inactividad configurable y "cerrar sesión en todos los dispositivos" (T02). | V2 VAR 2280 (análogo), CNX §2.5 | E | O2 | A | Tras el tiempo configurado sin actividad se pide reingreso conservando el borrador abierto. |

### 5.3. Vinculación de cuentas, accesos y representaciones

La verificación del vínculo usuario-titular sigue DEC-043 (PA-PER-01 de M01): se acepta **código de factura + documento del titular** (RF-POR-035, RF-POR-034), **código enviado a un contacto verificado del titular** (RF-POR-179) o **validación presencial** (RF-POR-037, RF-POR-154); el código de socio + clave impresa de CoopOnline (RF-POR-033) se mantiene como dato de conocimiento de la factura, siempre con intentos limitados (RN-POR-005, RF-POR-039). La identidad federada (RF-POR-036) es un método adicional con nivel mínimo (DEC-067). M01 es dueño del vínculo; M19 solo lo origina.

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-033 | Vincular cuenta con código de socio + clave/suministro, con textos de botón, título, campos y observación configurables por tenant. | V2 VAR_PMOVIL 5, 6, 7, 8, 9; VAR 800 | N | O2 | A | Los textos se toman de `dict:por.vincular.*` editables por el tenant. |
| RF-POR-034 | Vincular con número de suministro/medidor + DNI/CUIT del titular. | §25, §67 | N | O2 | A | Con datos correctos se crea el acceso; con DNI que no coincide, se rechaza con mensaje genérico. |
| RF-POR-035 | Vincular con datos de una factura: número de comprobante + importe total + fecha de vencimiento. | DFA M26 "registro y vinculación de cuentas" | E | O4 | A | La combinación de los tres datos de una factura de los últimos 12 meses habilita la vinculación como `titular` solo si además coincide el DNI informado en el perfil; si no, queda `autorizadoConsulta` pendiente de confirmación del titular. |
| RF-POR-036 | Vincular por identidad federada verificada (CiDi u otra) cuando el DNI verificado coincide con el titular. Exige CiDi nivel 2 o superior (DEC-067). | RN-10 §3.5 `ValidarNroDocumento`; DEC-067 | E | O2 | A (DEC-067; antes AV PA-POR-04) | Con el método habilitado y DNI verificado igual al del titular, el acceso se crea y se avisa al titular. |
| RF-POR-037 | Vinculación asistida: un operador emite desde admin un código de invitación de un solo uso para una cuenta y una persona identificada presencialmente. | §25 "circuito de acreditación" | N | O2 | A | El código vence a las 72 h y solo lo puede usar el usuario cuyo DNI coincide. |
| RF-POR-179 | Vincular con **código al contacto del titular** (DEC-043): el usuario indica la cuenta o el suministro; M19 pide a M01 enviar un código de 6 dígitos de un solo uso al correo o celular verificado del titular (enmascarado en pantalla); el acceso se crea al ingresar el código antes de su vencimiento. Mismo límite de intentos que RF-POR-039 y respuesta genérica si la cuenta no existe o no tiene contacto verificado. | DEC-043 (PA-PER-01) | N | O2 | A | Con el código correcto dentro de los 10 minutos se crea el acceso y se avisa al titular; un sexto intento fallido bloquea la vinculación 15 minutos. |
| RF-POR-038 | Si la verificación es insuficiente, se deniega y se ofrece el circuito de acreditación (presencial, envío de documentación, contacto). | CU-25 excepción | N | O2 | I | El mensaje no revela si la cuenta existe; ofrece "Solicitar vinculación asistida". |
| RF-POR-039 | Límite de intentos y anti-enumeración: misma respuesta y tiempo ante cuenta inexistente o datos erróneos; bloqueo temporal; alerta de seguridad. | §25 control, CNX §2.5 [MEJORAR] | N | O2 | A | Al sexto intento fallido en 15 min el usuario queda bloqueado para vincular durante 15 min. |
| RF-POR-040 | Aviso al titular (por sus canales verificados) de toda nueva vinculación o representación sobre su cuenta, con opción de revocarla. | AGR-007 | N | O2 | A | El titular recibe aviso y un enlace "No fui yo / Revocar". |
| RF-POR-041 | "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. | §25 | N | O2 | I | Desvincular retira el acceso futuro y no borra el historial de lo actuado. |
| RF-POR-042 | Alcance por acción en cada acceso: consultar, pagar, gestionar, solicitar baja, firmar. | AGR-007 | N | O2 | A | Un autorizado con "consultar" no ve el botón Pagar; la API devuelve 403 si lo intenta. |
| RF-POR-043 | Representaciones: el titular invita a otra persona (por correo/celular/DNI) con acciones y vigencia; la persona acepta; el titular puede revocar; al vencer se retira el acceso. | AGR-007, §25 "Autorizar a otras personas" | E | O5 | A | Revocar en el portal impide el acceso en la siguiente solicitud de la persona revocada. |
| RF-POR-044 | Representación legal, apoderados y personas jurídicas: la persona sube la evidencia (poder, estatuto, designación) y un operador la valida; el acceso nace de la relación validada en M01. | AGR-007, §83 | E | O5 | A | Sin validación del operador no se crea el acceso; la evidencia queda en el expediente. |
| RF-POR-045 | Pagador eventual: pagar un comprobante ajeno con su código de pago o código QR/barras, sin ver datos de la cuenta ni otros contratos. | AGR-007 ejemplo, ESC-01 | E | O5 | AV (PA-POR-08) | El pagador ve solo importe, vencimiento y nombre enmascarado de la cooperativa/servicio. |
| RF-POR-046 | Toda gestión en nombre de tercero registra quién actuó y por quién (acceso utilizado). | AGR-007 criterio | N | O2 | A | El caso CRM y el checkout guardan `actorUserId` y `onBehalfOfPersonId`. |

### 5.4. Inicio por rol y navegación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-047 | Landing por rol calculada en servidor: visitante, usuario registrado sin cuenta, socio activo, socio moroso, socio suspendido, socio con baja, representante, empleado, técnico/lecturista/cobrador (redirección a app de campo). | CNX §3.3 guard, §3.8 rol externo | N | O2 | A | Un usuario con una cuenta suspendida por mora entra a `/app/inicio` con la variante "suspendido". |
| RF-POR-048 | Inicio del socio: saldo y próximo vencimiento por cuenta, acciones rápidas (Pagar, Reclamar, Contratar, Coordinar visita), trámites en curso, visitas próximas, avisos no leídos, encuestas pendientes, publicación destacada del muro. | §25, §50 | N | O2 | A | Cada tarjeta lleva a su detalle en un toque; sin datos, estado vacío con acción sugerida. |
| RF-POR-049 | Variante moroso: banner con deuda vencida, botones Pagar y Ver convenios; no bloquea consultas, reclamos ni baja. | §53, V2 VAR_PMOVIL 37 | E | O6 | A | El banner aparece cuando M08 informa deuda vencida y desaparece al confirmarse el pago. |
| RF-POR-050 | Variante suspendido: estado del servicio, causa, pasos para reconectar, costo habilitado y estado real de la reconexión. | §53 control | E | O6 | A | Tras pagar, el banner dice "Pago confirmado — reconexión en trámite" hasta el evento de reconexión. |
| RF-POR-051 | Variante usuario registrado sin cuenta: contratar, vincular cuenta existente, novedades, trámites en curso de alta. | §67 | N | O2 | I | El inicio no muestra secciones vacías de facturas. |
| RF-POR-052 | Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). | §43.4, CNX §3.3 banner | E | O2 | A | Un banner para "morosos de Internet" solo lo ven socios con ese estado. |
| RF-POR-053 | Selector de cuenta activa: al cambiarla se recalculan inicio, rol y menú. | §25 "Ingresar y seleccionar la cuenta" | N | O2 | I | Con dos cuentas (una al día y otra morosa), el banner sigue a la cuenta seleccionada. |

### 5.5. Mis servicios, contratación y trámites

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-054 | "Mis servicios": por cuenta, cada contrato con su **estado del servicio** (M01/M02) separado del **estado del trámite** en curso (M09). | §43.4, §48, RN-10 §3.2 `GetDetalleServicios` | N | O2 | I | Un contrato activo con baja solicitada muestra "Servicio: Activo" y "Trámite de baja: En proceso". |
| RF-POR-055 | Detalle del servicio: plan, domicilio, medidor, fechas de alta/baja, equipo en comodato, adherentes, fecha efectiva de inicio y detalle del primer cobro (prorrateo, anticipado/vencido). | §25, RN-10 §3.2 | N | O3 | I | Tras la activación de Internet se ve fecha efectiva y el importe prorrateado del primer período. |
| RF-POR-056 | Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). | SOL-001, §67, CAT `REQUISITOS` | N | O2 | I | Ana inicia "Internet Fibra 100" y completa el asistente en 4 pasos. |
| RF-POR-057 | Tipos de campo del motor de formularios: texto, número, fecha, lista, consulta a catálogo, archivo/foto, adherentes, domicilio con calles normalizadas, selección de plan, firma manuscrita en pantalla, aceptación de T&C, grilla de DDJJ, campo informativo. | RN-10 §3.5 `ValidarValor` (0,1,2,3,4,7,9) | N | O2 | A | Cada tipo valida en cliente y servidor con el mismo esquema Zod. |
| RF-POR-058 | Validación inline, guardado automático de borrador y recuperación de la carga interrumpida. | AGR-032 | N | O2 | A | Cerrar la pestaña en el paso 3 y volver permite continuar en el paso 3. |
| RF-POR-059 | Adjuntar requisitos (DNI frente y dorso, título o contrato de locación, constancia fiscal) con cámara o archivo, compresión y verificación de tipo/tamaño. | RN-10 §3.5 (archivos, fotos de DNI) | N | O2 | A | Un PDF de 30 MB se rechaza con el límite explicado; una foto se comprime antes de subir. |
| RF-POR-060 | Si el servicio exige asociación, el asistente informa e inicia la solicitud de ingreso (M17) sin bloquear el resto del trámite. | §67, V2 VAR 335 | E | O2 | A | El trámite queda "En revisión — asociación pendiente". |
| RF-POR-061 | Al enviar se crea el caso CRM (M09) de tipo solicitud de alta con su número y una constancia descargable. | SOL-001, §48 | N | O2 | I | La constancia contiene número, fecha, servicio y datos aportados. |
| RF-POR-062 | Seguimiento del trámite con línea de tiempo: recibido, en revisión, observado, factibilidad, aprobado, visita coordinada, instalado, servicio activo / rechazado / cancelado. | §43.4, §67, §50 | N | O2 | I | Cada hito muestra fecha y, si corresponde, la próxima acción del socio. |
| RF-POR-063 | Responder observaciones del operador: aportar documentación faltante o corregir datos sin rehacer el trámite. | §67 | N | O2 | A | El trámite observado se reabre en el campo observado y vuelve a "En revisión". |
| RF-POR-064 | Cancelar una solicitud de alta antes de su ejecución. | §48 | E | O2 | A | Tras cancelar, la visita reservada se libera en M10. |
| RF-POR-065 | Solicitar baja de un servicio contratado desde la sesión, sin cargo por solicitarla, con constancia y código. | SOL-002, CIC-001, §52.3 | N | O2 | I | La baja se registra aunque la cuenta tenga deuda. |
| RF-POR-066 | Solicitar suspensión temporal y reactivación mostrando condiciones, costos habilitados y efectos antes de confirmar; registrar aceptación. | CIC-002, CIC-003, CIC-004, §25 | E | O6 | I | Para SUS-DEMO-GRATIS se muestra ARS 0 y la fecha efectiva solicitada. |
| RF-POR-067 | Trámites de modificación: cambio de plan, cambio de titularidad, cambio de domicilio postal, cambio de categoría, alta de adherentes, como formularios por servicio. | DFA M26 "trámites (alta, baja, cambio de titularidad)" | E | O2 | A | Cada trámite crea su caso con el contrato objeto. |
| RF-POR-068 | Alta de adherentes en servicios que los admiten, validando existencia de la persona y la regla de adherente único por servicio. El trámite lo resuelve M18, dueño único de adherentes (RF-SOC-030, DEC-071), desde PAN-POR-98. | RN-10 §3.2 `GetInfoAdherente`, §3.5 `GuardarAdherentes`, V2 VAR 2400 | E | O10 | A | Con 2400 apagado, una persona ya adherente del mismo servicio en otra cuenta es rechazada con explicación. |
| RF-POR-069 | Declaraciones juradas **por servicio** con la plantilla que define M02 para cada servicio (PRM-CAT-110, API-CAT-41): **gas**, artefactos a gas con potencia en kcal/h; **energía**, artefactos eléctricos (W) y vehículos eléctricos (dominio, modelo, kW del cargador; con PRM-POR-069); advertencia de DDJJ no presentada. El portal arma el formulario desde la plantilla, presenta la DDJJ y M02 la registra (RF-CAT-095) (HUE-GAS-01). Texto original: "Declaraciones juradas por servicio: artefactos eléctricos y vehículos eléctricos, con advertencia de DDJJ no presentada." | RN-10 §3.5 DDJJ, V2 VAR_PMOVIL 44, 59, 75; VAR 2742; HUE-GAS-01 | E | O7 | AV (PA-POR-16) | Con 59 activo, la cuenta sin DDJJ muestra la advertencia en Mis servicios; un contrato GAS muestra la grilla con potencia en kcal/h y rechaza una fila sin potencia. |
| RF-POR-070 | Activación inmediata solo para acciones declaradas de autoservicio sin intervención (adhesiones, recarga prepaga, cambios de plan digitales configurados); todo lo demás es trámite. | §43.3, §48 | E | O2 | AV (PA-POR-05) | Un cambio de plan de Internet configurado como autoservicio queda aplicado con fecha efectiva del próximo período y se informa así. |
| RF-POR-071 | El portal nunca muestra "Activo" o "Dado de baja" hasta recibir el evento del módulo dueño. | §43.3, §48, §53 | N | O2 | I | Con el caso aprobado pero sin `cat.contract.activated`, el servicio figura "Pendiente de alta". |
| RF-POR-174 | **Composición de pantallas del socio**: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de `pwa-socio` y `landing`; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara el componente y la API de cada módulo (§10.6.A). Ningún módulo publica rutas propias en esos canales. | HUE-SRV-04, HUECO-TRV-04 | N | O2 | A | Cada PAN de canal socio o landing de otro anexo figura en §10.6.A con su PAN-POR contenedora; el mapa del sitio de T03 apunta a la PAN-POR. |
| RF-POR-176 | Bloque **"Plan de cuotas de obra"** en el detalle del contrato (PAN-POR-30) para contratos de obra (tipo 17): cuota actual n/N, cuotas facturadas, saldo, unidades facturadas sobre totales y próxima cuota estimada, en solo lectura desde M04 (API-TAR-066) a través de API-POR-123. | HUECO-OBR-03 | E | O7 | A | Un contrato de obra con 4 de 10 cuotas facturadas muestra "Cuota 5 de 10", el saldo y las unidades; el bloque no aparece en contratos que no son de obra. |
| RF-POR-178 | **Servicios sociales e institucionales del socio** como tarjetas de M19: Mi grupo (PAN-POR-98), Solicitudes sociales (PAN-POR-99), Cementerio (PAN-POR-100), Vivienda (PAN-POR-101) y Mi asociación (PAN-POR-102), que embeben PAN-SOC-30 a PAN-SOC-33 y PAN-INS-30; cada tarjeta se muestra solo si el tenant tiene el servicio y el usuario la capability del módulo dueño. | HUE-SRV-04, HUECO-TRV-04; M18 §10, M17 §10 | E | O10 | A | Un socio sin servicios sociales no ve las tarjetas; con sepelio activo ve "Mi grupo" con sus integrantes. |
| RF-POR-180 | **Comunidad en la tabbar del socio** (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto; Comunidad agrega en pestañas el muro, las encuestas y las novedades de T09 filtrados por audiencia (API-POR-92), y muestra solo las pestañas para las que el usuario tiene capability. | PA-POR-20; T03 RF-UXD-066, CTR-UXD-12; maestro §9.2 | N | O2 | A | Un socio con `com.wall.ver` y sin `com.surveys.responder` ve Comunidad con Muro y Novedades, sin la pestaña Encuestas; la tabbar no muestra "Facturas" ni "Perfil". |

### 5.6. Visitas e instalación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-072 | Coordinar visita: ver franjas disponibles compatibles con servicio, domicilio y requisitos (M10) y reservar sin duplicar recursos. | AUT-003, §50, checklist 36 | N | O3 | I | Dos socios que eligen el último turno: uno confirma, el otro recibe "La franja ya no está disponible" y nuevas opciones. |
| RF-POR-073 | Reprogramar y cancelar la visita según reglas (anticipación mínima, cantidad de reprogramaciones). | §50 | N | O3 | I | Fuera del plazo permitido se ofrece contactar a la cooperativa. |
| RF-POR-074 | Recordatorios de visita (push/correo/WhatsApp según preferencias). | §50, T09 | E | O3 | A | Se envía recordatorio 24 h antes. |
| RF-POR-075 | "El instalador está en camino" con hora estimada; ubicación en mapa solo si el tenant lo habilita. | §25 | E | O3 | I | Cuando M10 emite `tec.visit.statusChanged` con `status = enRoute` el socio recibe aviso y ve la hora estimada. |
| RF-POR-076 | Revisar el resumen de la instalación (tareas, equipo en comodato con número de serie), firmar conformidad en pantalla y responder la encuesta de satisfacción. | §25 | N | O3 | I | La conformidad firmada queda en el expediente; la encuesta se ofrece sin bloquear. |
| RF-POR-077 | Ver el resultado de la visita (realizada, fallida, sin acceso, reprogramada) y la próxima acción. | AUT-004, §50 control | N | O3 | I | Una visita "sin acceso" ofrece reprogramar y no activa el servicio. |

### 5.7. Facturas y documentos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-078 | "Mis facturas" por cuenta y servicio con filtros (estado, servicio, período), opción "solo adeudadas" y agrupación por vencimiento configurables. | §25, V2 VAR_PMOVIL 913, 71 | N | O4 | I | Con 913 activo, el filtro inicial es "Adeudadas". |
| RF-POR-079 | Detalle de factura separada o comprobante agrupado con **apertura por servicio**: renglones, subtotal, saldo y pagos aplicados por servicio. | FAC-011, §103, §25 | N | O4 | I | En un comprobante con Agua e Internet se ve cuánto corresponde y cuánto se pagó de cada uno. |
| RF-POR-080 | Explicación comprensible de importes: qué es cada concepto, tributos discriminados, prorrateos, bonificaciones, intereses y su base. | §25 | E | O4 | I | Tocando un concepto se abre su explicación con la clave `dict:` del concepto. |
| RF-POR-081 | Descarga del PDF (URL firmada de corta vida) con CAE, QR fiscal y código de barras. | §25, CNX §2.6 [MEJORAR] | N | O4 | I | El enlace caduca a los 5 minutos y no funciona en otra sesión. |
| RF-POR-082 | Si el tenant agrupa, mostrar el resumen de cuenta corriente sin perder el detalle por factura y servicio. | §44, §25 | E | O5 | I | El resumen lista facturas con su servicio y saldo. |
| RF-POR-083 | Movimientos de cuenta corriente (débitos, créditos, pagos, notas de crédito, saldo a favor). | §25 "Consultar obligaciones y movimientos" | N | O5 | I | El saldo mostrado coincide con M07 a la fecha. |
| RF-POR-084 | Textos configurables de observación en facturas y de vista previa de facturas seleccionadas. | V2 VAR_PMOVIL 35, 14 | E | O4 | A | Se editan como claves `dict:por.facturas.observacion` y `dict:por.facturas.vistaPrevia`. |
| RF-POR-085 | Visibilidad: comprobantes desde la fecha de corte configurada, tipos visibles, ocultar PDF de comprobantes bloqueados, historial de N meses. **Sin autorización fiscal no se publica (DEC-107; 10-11-2026):** un comprobante que requiere autorización y todavía no tiene CAE, CAEA vigente asignado o CESP no aparece en "Mis facturas", en la deuda pagable ni en el resumen de cuenta, no ofrece PDF, código de barras, QR ni botón de pago, y no dispara el aviso de factura emitida. El portal no decide la autorización: lee la compuerta fiscal de la obligación de M07 (`obligations.fiscalGate`, RN-COB-158; solo `authorized` o `notRequired` se muestran) y la proyección `invoiceView`. Un comprobante que M05 devuelve a borrador o a la cola (`fac.invoice.returnedToDraft`, EVT-FAC-22) deja de mostrarse si llegó a cachearse; uno renumerado (`fac.invoice.renumbered`, EVT-FAC-23) actualiza su número visible. El portal referencia el comprobante por `invoiceId`, nunca por número (RN-FAC-164 de M05). | V2 VAR_PMOVIL 17, 20, 36, 39, 74; VAR 829, 2261, 2448, 3168; DEC-107; M05 RN-FAC-164; M07 RN-COB-158 | E | O4 | A | Un comprobante de tipo no visible no aparece; uno bloqueado aparece sin PDF y con "Consultá en la cooperativa". Un lote de 100 facturas CAE con una rechazada por ARCA: el socio ve las 99 autorizadas con PDF y pago; la rechazada no aparece hasta que se reemite y autoriza, y entonces se ve con su número definitivo. |
| RF-POR-086 | Adhesión y baja de factura digital por correo y/o WhatsApp con medio verificado. | DFA M26, V2 VAR_PMOVIL 32, 911 | N | O4 | I | Con 911 = "mail y teléfono" se exigen ambos verificados. |
| RF-POR-087 | Constancias descargables: libre deuda, constancia de alta, constancia de baja, constancia de trámite, certificado de servicio. | §25 "Descargar constancias" | E | O4 | I | El libre deuda solo se emite si M07 confirma saldo vencido cero. |
| RF-POR-088 | Consultar acuerdos de pago y cuotas (M08) con estado de cada cuota. | §25 | E | O6 | I | La cuota vencida se destaca y permite pagarla. |

### 5.8. Pagos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-089 | Pagar una o varias facturas (carro) creando un checkout en M07 con `Idempotency-Key`. | §25, AUT-005, V2 VAR_PMOVIL 45 | N | O5 | I | Repetir el envío con la misma clave devuelve el mismo checkout. |
| RF-POR-090 | Cupón único: generar un documento de pago con varias facturas y vencimiento propio (hoy + N días); opción de incluir siempre todas las facturas del cupón. | RN-10 §3.3, V2 VAR_PMOVIL 13, VAR 2585 | N | O5 | A | Con 2585 = 3, el cupón generado hoy vence en 3 días. |
| RF-POR-091 | Medios según pasarelas habilitadas: tarjeta, QR, billetera, transferencia, efectivo con cupón PDF con código de barras. | RN-10 §3.3, V2 VAR_PMOVIL 21, VAR 2645 | N | O5 | I | Con 21 activo y sin entidad por defecto, se ofrece "Descargar cupón para pagar en efectivo". |
| RF-POR-092 | Validar importe mínimo y no permitir pagar facturas bloqueadas ni cuentas bloqueadas para la web, explicando el motivo y el canal alternativo. | RN-10 §3.3 (904, `Id_blo`, `BLOQUEAR_FAC_WEB`) | N | O5 | A | Un total menor al mínimo muestra "El importe mínimo es ARS X". |
| RF-POR-093 | Mostrar el recargo por mora calculado al día (M08) o diferido al próximo período según política. | RN-10 §3.3, V2 VAR_PMOVIL 12 | E | O5 | A | Con 12 activo el recargo se muestra "Se incluirá en tu próxima factura". |
| RF-POR-094 | Estados visibles del pago: generado, pendiente de confirmación, confirmado, imputado, comprobante enviado, rechazado; el retorno de la pasarela nunca confirma por sí solo. | RN-10 §3.2 `ESTADO_VENTA`, BASE §25 CU-25 (cita corregida: antes "§25 CU-25" se leía como RN-10 §25, que no existe), AGR-012 | N | O5 | I | Si el socio vuelve de la pasarela antes del webhook, ve "Pendiente de confirmación". |
| RF-POR-095 | Recibo descargable y enviado por correo tras la imputación, con las facturas de intereses generadas. | RN-10 §3.4 (`ReciboCooponline`) | N | O5 | A | El recibo lista facturas pagadas e intereses facturados. |
| RF-POR-096 | Historial de pagos con canal, medio, estado y comprobante. | §25 | N | O5 | I | Se listan pagos de todos los canales (caja, débito, portal). |
| RF-POR-097 | Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. | DFA M26, V2 VAR_PMOVIL 27, VAR 2857 | N | O5 | A | El portal nunca recibe el número completo de tarjeta; la constancia se descarga. |
| RF-POR-098 | Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. | V2 VAR_PMOVIL 63 | E | O5 | A | Con "solo con recargo", una factura adherida sin recargo no es seleccionable. |
| RF-POR-099 | Control de deuda vencida en la web: aviso y regla configurable para nuevas contrataciones, sin bloquear pago, reclamo ni baja. | V2 VAR_PMOVIL 37 | E | O6 | AV (PA-POR-15) | Con 37 activo y deuda vencida, "Contratar" muestra el aviso y la política elegida. |
| RF-POR-100 | Pago por representación o pagador eventual; un excedente no se aplica a la deuda de otro titular. | ESC-01, AGR-007 | N | O5 | A | ESC-01: A debe ARS 13.000, paga ARS 15.000; se imputan 13.000 a A y 2.000 quedan según política; la deuda de B no cambia. |
| RF-POR-101 | Saldo a favor visible; "pago a cuenta" solo si la política de M07 lo habilita. | FAC-008, AGR-011 | E | O5 | AV (PA-POR-09) | Con la política apagada no se ofrece importe libre. |
| RF-POR-102 | Pago de resúmenes de terceros (tarjeta regional u otros convenios por cuenta de terceros). | RN-10 §3.3 `CrearCobranzaResumenTarjeta`, V2 VAR 3114, VAR_PMOVIL 68 | X | O8 | AV (PA-POR-18) | Deshabilitado por defecto; habilitado, genera checkout de tipo terceros en M07. |

### 5.9. Consumos, autolectura y prepaga

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-103 | Historial y gráfico de consumos por servicio medido (12 a 24 períodos), comparación con período anterior y mismo mes del año previo, promedio diario, tabla accesible equivalente al gráfico. | DFA M26, §25, AUT-005 | N | O7 | I | El gráfico tiene tabla alternativa navegable por teclado. |
| RF-POR-104 | No mostrar consumos para servicios sin fuente de medición. | §50 control | N | O7 | I | Internet abono fijo no muestra pestaña de consumos. |
| RF-POR-105 | Deshabilitar la pestaña de consumos por tenant. | V2 VAR_PMOVIL 31 | E | O7 | A | Con 31 activo no aparece la pestaña. |
| RF-POR-106 | Botón "Mi Medidor" hacia la consulta del proveedor de telemedición cuando el suministro está integrado. | RN-10 §3.2 `GetURLMiMedidorDiscar`, V2 VAR_PMOVIL 55 | X | O7 | A | Si el servicio no está en el proveedor, el botón no aparece. |
| RF-POR-107 | Autolectura con foto: el socio fotografía el medidor, informa el estado (o acepta la propuesta de OCR) dentro de la ventana de lectura; M03 la valida como cualquier lectura capturada. | MER-018, DFA M26 | E | O7 | AV (PA-POR-14) | Una autolectura fuera de rango queda "En revisión" y se explica el resultado. |
| RF-POR-108 | Recarga prepaga: elegir servicio prepago, importe (con mínimo y múltiplos), ver capital a acreditar, recargo, bonificación, retención por deuda y energía equivalente; pagar y recibir crédito/token. | RN-10 §3.3 `crearVenta`, §3.4 `AutorizarPrepaga`, INV `ctrlPrepaga_Seleccion` | E | O7 | A | Con importe ARS 5.000 y recargo ARS 500, se informa capital ARS 4.500 antes de pagar. |
| RF-POR-175 | **Detalle de llamadas** por período de una línea telefónica (PAN-POR-103): fecha y hora, número destino enmascarado según política, tipo (local, larga distancia, celular, CPP, internacional), duración e importe tasado; totales por tipo; descarga PDF/CSV. Solo lectura sobre M10 (llamadas atribuidas, API-TEC-55) y M04 (importe tasado, API-TAR-067), con capability `por.consumos.ver` y acceso `consultar` a la cuenta (HUE-TEL-02). Los períodos de más de 36 meses se piden como consulta diferida (DEC-087). | HUE-TEL-02; M10 RF-TEC-211, RF-TEC-237; M04 RN-TAR-082, RF-TAR-120; DEC-087 | E | O10 | A | Para la línea de TEL-BAS del período 11/2026 la suma de importes coincide con el renglón de llamadas de la factura; un usuario sin acceso a la cuenta recibe 403. |

### 5.10. Gestiones (reclamos, consultas, trámites)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-109 | Nueva gestión (reclamo, consulta, trámite) con tipología por servicio (M09), descripción, fotos y adjuntos, ubicación opcional (con alternativa textual) y contrato afectado. | §25, AUT-006, DFA M26 | N | O2 | I | Un reclamo "Sin servicio de Internet" con foto crea un caso con número. |
| RF-POR-110 | Seguimiento de la gestión: número, estado, línea de tiempo, plazo comprometido y responsable visible (área). | §25 | N | O2 | I | El estado cambia al recibir `crm.case.statusChanged`. |
| RF-POR-111 | Conversación con la cooperativa dentro del caso (chat) y asistente/bot (M09) con traspaso a humano. | §25 "formulario, chat o bot", V2 VAR 2683 | E | O2 | I | Un mensaje del operador llega como aviso y se responde en el caso. |
| RF-POR-112 | Conformidad al cierre, reapertura dentro del plazo configurado y encuesta de satisfacción. | §47, §50 | E | O2 | A | Rechazar la solución reabre el caso dentro de los 7 días configurados. |
| RF-POR-113 | Un reclamo técnico genera orden de trabajo automáticamente si el tenant lo configura. | V2 VAR_PMOVIL 58 | E | O3 | A | Con 58 activo, el reclamo de falla crea la OT en M10 y el socio la ve en la línea de tiempo. |
| RF-POR-114 | Ocultar observaciones internas de las órdenes y casos. | V2 VAR_PMOVIL 73 | N | O2 | A | Ninguna nota marcada interna llega al portal, con independencia de 73 (73 controla además las observaciones técnicas de la OT). |
| RF-POR-115 | Mostrar al socio sus órdenes de trabajo asociadas (estado, fecha, resultado). | V2 VAR 801 | E | O3 | A | La OT de instalación figura en el detalle del trámite. |
| RF-POR-116 | Avisos al tenant por correo de nuevos reclamos y trámites web, además de la bandeja CRM. | V2 VAR 804, VAR_PMOVIL 49 | X | O2 | A | Con casilla configurada, cada caso del portal genera un correo al tenant. |
| RF-POR-117 | Gestión sin conexión: borrador local con fotos en IndexedDB y envío al recuperar señal con `clientMutationId`. | CNX §3.7 | E | O2 | A | Un reclamo creado sin señal se envía una sola vez al volver la conexión. |

### 5.11. Turnos de atención presencial

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-118 | Solicitar turno de atención en sucursal por área (fecha y hora, o turno del día) desde el portal. | DFA M26 "turnos", V2 VAR_PMOVIL 67, VAR 3064, RN-10 §16 turnero | E | O10 | I | Con 67 activo se ofrece "Pedir turno"; el número se forma según 3064. |
| RF-POR-119 | Ver número de turno, tiempo estimado de espera y cancelar. | RN-10 §16 `GetTiempoEstimadoTurno` | E | O10 | A | El tiempo estimado se actualiza al refrescar. |
| RF-POR-120 | Recordatorio del turno y presentación en sucursal con QR. | §50 recordatorios | X | O10 | A | El QR se lee en el turnero y pasa el turno a "en espera". |

### 5.12. Comunicaciones y comunidad

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-121 | Bandeja de avisos in-app con tipos (factura emitida, vencimiento, corte programado, deuda, visita, reclamo resuelto, trámite observado, pago confirmado), marcar leído y acceso directo al objeto. | DFA M26 "notificaciones", CNX §2.7, RN-10 §3.6 | N | O2 | I | Un aviso "Factura emitida" abre el detalle de la factura. |
| RF-POR-122 | Push web con consentimiento, preferencias por categoría y canal, horario de no molestar (T09). | CNX §2.7, BASE §25 "preferencias de comunicación" (cita corregida: antes "§25" se leía como CNX §25, que no existe) | E | O2 | I | Desactivar "Promociones" no desactiva "Constancias". |
| RF-POR-123 | Diferenciar avisos comerciales, operativos y constancias reguladas; las constancias guardan evidencia de entrega y un fallo genera acción. | AGR-024 | N | O2 | A | Una constancia de baja rebotada genera tarea al operador y queda visible en el portal. |
| RF-POR-124 | Encuestas en el portal (T09) con banner de pendientes que nunca bloquea operaciones esenciales. | CNX §3.4, §7; BASE §25 (cita corregida: antes "CNX §25", que no existe) | E | O2 | A | Con encuesta pendiente el socio puede pagar y pedir la baja. |
| RF-POR-125 | Muro de socios (T09): publicaciones editoriales por audiencia; reacciones y comentarios con moderación cuando el tenant y la publicación lo habilitan. | NOT-002, DEC-008, AGR-031 | E | O2 | I | Con comentarios deshabilitados no se muestra el campo de comentario. |
| RF-POR-126 | Novedades y boletines (T09). | CNX §6, CAT `WEB_NOVEDADES` | E | O2 | A | Un boletín publicado para socios de Internet aparece solo a esos socios. |
| RF-POR-127 | Notificaciones por cuenta con vigencia (por defecto 1 mes) migradas desde ProCoop. | RN-10 §3.6 `GuardarNoti` | E | O7 (DEC-089; antes O11) | A | Las notificaciones vencidas no se muestran. |
| RF-POR-128 | Mensaje automático (SMS/WhatsApp) al registrar un pago o una venta del portal. | V2 VAR_PMOVIL 53 | X | O5 | A | Con 53 = WhatsApp se envía la plantilla de pago registrado. |

### 5.13. Portal del empleado

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-129 | Espacio empleado en la misma PWA, con marca de empleados (T03), menú y almacén de datos separados del espacio socio. | BASE §3, MAR-005, §104 | N | O9 | I | Un socio-empleado no ve recibos en el espacio socio ni facturas en el espacio empleado. |
| RF-POR-130 | Recibos de sueldo: lista, detalle, descarga PDF y firma de conformidad; no descargar antes de firmar; no acceder al mes actual sin firmar el anterior, según tenant. | V2 VAR 3122, 3166, §104 | N | O9 | AV (PA-POR-11) | Con 3166 activo y el recibo anterior sin firmar, el actual muestra "Firmá primero el recibo de septiembre". |
| RF-POR-131 | Vacaciones: saldo, solicitud con fechas, estado del workflow (M16). | §104 | E | O9 | A | La solicitud aparece en la bandeja del jefe. |
| RF-POR-132 | Licencias: solicitud por tipo con certificado adjunto, estado. | §104 | E | O9 | A | Una licencia médica sin certificado queda "Falta certificado". |
| RF-POR-133 | Mis datos de legajo en consulta y solicitud de actualización (domicilio, contacto, cuenta sueldo, familiares). | §104 | E | O9 | A | La actualización crea una solicitud para RR. HH., no modifica el legajo directamente. |
| RF-POR-134 | Muro y avisos internos de empleados (T09, audiencia interna). | NOT-003 | E | O2 | I | Una publicación interna nunca se ve en el espacio socio ni en la landing. |
| RF-POR-135 | Empleados que no son usuarios del sistema acceden solo al portal del empleado con el perfil configurado. | V2 VAR_PMOVIL 41 (PWeb) | E | O9 | A | Ese perfil no tiene ninguna capability de admin. |
| RF-POR-136 | Reautenticación o segundo factor para ver recibos y legajo. | AGR-006, §104 | E | O9 | A | Pasados 15 minutos desde el último factor se vuelve a pedir. |

### 5.14. Accesibilidad, UX y tolerancia a errores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-137 | Objetivo WCAG 2.2 nivel AA verificado en landing, PWA socio y empleado; declaración de accesibilidad publicada sin afirmar conformidad no verificada. | AGR-032 | N | O2 | A | Auditoría automática (axe) sin errores críticos y prueba manual de recorridos esenciales con teclado y lector de pantalla. |
| RF-POR-138 | Navegación completa por teclado, foco visible no oculto (2.4.11), orden lógico, etiquetas y nombres accesibles, objetivos táctiles de al menos 24×24 px (2.5.8). | AGR-032 | N | O2 | A | Los recorridos contratar, pagar, reclamar y baja se completan solo con teclado. |
| RF-POR-139 | Validación de contraste de los colores de marca del tenant con ajuste automático del texto y CTA cuando no alcanzan 4.5:1. | AGR-032, CNX §3.2 | N | O2 | A | Un color de marca amarillo claro genera texto oscuro en el botón. |
| RF-POR-140 | Alternativa a mapa y a gestos de arrastre (2.5.7) en toda funcionalidad. | AGR-032 ejemplo | N | O2 | A | La coordinación de visita y la ubicación del reclamo funcionan sin mapa. |
| RF-POR-141 | Tolerancia a errores: borradores, recuperación tras expiración de sesión sin perder datos, no repetir información ya aportada (3.3.7). | AGR-032 | N | O2 | A | Al expirar la sesión en el paso 4, el reingreso vuelve al paso 4 con los datos. |
| RF-POR-142 | Mensajes de error claros, junto al campo y en un resumen con enlaces, indicando qué falta. | AGR-032, CNX §3.5 | N | O2 | A | Nunca se usa `alert()`; el resumen enfoca el primer error. |
| RF-POR-143 | Lenguaje claro y diccionario del tenant (`dict:`) en todas las etiquetas. | BASE §65 | N | O2 | I | No hay textos fijos en componentes (lint de claves). |
| RF-POR-144 | Patrones CNX: 3 skeleton cards en cargas, estados vacíos con acción, pull-to-refresh, banner único de pendientes sin conexión. | CNX §3.4, §3.5 | E | O2 | A | Una lista vacía muestra ilustración y acción sugerida. |
| RF-POR-145 | PWA instalable con manifest dinámico, splash, ícono y `theme-color` por tenant; pasos de instalación para iOS. | MAR-003, MAR-006, CNX §3.2 | N | O2 | I | Instalar desde TEN-001 crea el ícono "Cooperativa Ejemplo A". |
| RF-POR-146 | Respeto de `prefers-reduced-motion`, zoom al 200 % y reflujo a 320 px sin pérdida de contenido. | AGR-032 | N | O2 | A | A 320 px no hay desplazamiento horizontal salvo tablas con alternativa. |
| RF-POR-147 | Autenticación accesible (3.3.8): permitir pegar, gestores de contraseñas y autocompletar OTP. | AGR-032 | N | O2 | A | El campo OTP acepta `autocomplete="one-time-code"`. |
| RF-POR-148 | Ayuda contextual por pantalla y acceso a soporte de la cooperativa (chat CRM, teléfono, sucursales). | CNX §4.2 ScreenHelp (adaptado), V2 VAR 2683 | E | O2 | A | Cada pantalla tiene "¿Necesitás ayuda?" con contenido del tenant. |

### 5.15. Administración del portal

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-149 | Configuración del portal por tenant (parámetros del §14) con vigencia y auditoría (T04). | RN-09 VAR_PMOVIL canal CoopOnline | N | O2 | A | Cambiar 913 se refleja en el portal en la siguiente carga. |
| RF-POR-150 | Editor de la landing por bloques con previsualización escritorio/celular y circuito de publicación. | MAR-007, §43.4 | E | O2 | AV (PA-POR-13) | El editor no permite HTML libre ni scripts. |
| RF-POR-151 | Constructor de formularios por servicio: campos, tipos, máscaras, obligatoriedad, visibilidad condicional, orden, ayuda, dato requerido (persona, cuenta, servicio), T&C, repetición permitida, PDF asociado, versión. | CAT `REQUISITOS`, `REQUISITOS_ITEMS`, RN-10 §3.5 | N | O2 | A | Publicar una nueva versión no altera las presentaciones hechas con la anterior. |
| RF-POR-152 | Campos que completa el operador (no visibles al socio) en la presentación. | `REQUISITOS_ITEMS.REGISTRA_USER`, `ConsultarValoresTramite` | E | O2 | A | El operador ve "Datos del formulario" y "Datos que registra el usuario" separados. |
| RF-POR-153 | Acción de ejecución tipada por formulario (comando del módulo dueño) con resultado (mensaje, aceptado, id creado). | RN-10 §3.5 `EjecutarTramite` (reemplazado) | N | O2 | A | No existe ejecución de código o SQL configurable; solo comandos registrados. |
| RF-POR-154 | Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. | §25, AGR-007 | N | O2 | A | Rechazar notifica al solicitante con motivo. |
| RF-POR-155 | Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. | §25, AGR-007 | N | O2 | A | Revocar desde admin corta el acceso en la siguiente solicitud. |
| RF-POR-156 | Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. | §52.3, §57 | N | O2 | A | Una baja pública sin código emitido a las 20 h se resalta en rojo. |
| RF-POR-157 | Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). | FIC 14.1 | N | O6 | A | El informe de conciliación cuadra usuarios y vínculos del volcado. |
| RF-POR-158 | Configuración de banners por rol y segmento. | §43.4 | E | O2 | A | Vista previa del banner por rol. |
| RF-POR-159 | Métricas del portal (§15) con exportación. | §15 de este anexo | E | O11 | A | Los indicadores se recalculan diariamente. |
| RF-POR-160 | "Ver portal como este socio" en solo lectura, auditado, desde la ficha de la cuenta (reemplaza el ingreso directo de escritorio). | RN-10 §3 (`Nucleo.cs:1116` `GetEncryptedKey`) | E | O2 | A | La sesión de vista no permite pagar ni enviar; queda en auditoría con motivo. |
| RF-POR-161 | Alta y configuración de tótems de autogestión. | INV `AutoGestion.md`, V2 VAR 2347, 2351, 2352, 2790 | X | O10 | AV (PA-POR-06) | El tótem queda asociado a sucursal y caja. |

### 5.16. Tótem de autogestión presencial

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-162 | Modo tótem: pantalla táctil de inicio con mosaicos (Pagar facturas, Recargar prepaga) y regreso automático al inicio por inactividad. | INV `frmAutoGestion` (`AddTileCobranza`, `AddTilePrepaga`, `GoHome`) | X | O10 | AV (PA-POR-06) | Tras 60 s sin uso vuelve al inicio y borra los datos de la sesión. |
| RF-POR-163 | Identificación del socio por número de socio, cuenta, documento o código QR de la factura, con opción por defecto configurable. | INV `clsBusquedaSocio`, `clsSocioIdentificado`, V2 VAR 2790 | X | O10 | AV (PA-POR-06) | Con 2790 = "Código QR", la pantalla abre la cámara/lector. |
| RF-POR-164 | Ver deuda, seleccionar comprobantes y cuotas, ver total con recargos y percepciones. | INV `ctrlCobranza_Seleccion` (`CargarPantallaDeuda`, `GetComprobantesPagar`, `ActualizarTotalpagar`, `ValidarIIBB`), `clsValidadorIIBB` | X | O10 | AV (PA-POR-06) | El total coincide con el cálculo de M07/M06. |
| RF-POR-165 | Pagar con tarjeta (lector), QR o efectivo con lector de billetes vía agente local; anticipo con el excedente de efectivo si se configura. | INV `ctrlPagoTarjeta`, `ctrlPagQr`, `ctrlAutoGestionBase` (`IngresarDinero`, `LeerTarjeta`, `CrearAnticipo`, `RegistrarAnticipo`), `WebPagos360` | X | O10 | AV (PA-POR-06) | Un pago en efectivo con billetes por ARS 10.000 sobre deuda de ARS 9.500 registra ARS 500 como anticipo si la política lo permite. |
| RF-POR-166 | Recarga prepaga en el tótem. | INV `ctrlPrepaga_Seleccion` | X | O10 | AV (PA-POR-06) | Mismo cálculo que RF-POR-108. |
| RF-POR-167 | Comprobante impreso o enviado por correo a elección. | INV `ctrlImpresionMail`, `clsEnvioRecibo`, `Settings.EnviarMailRecibo` | X | O10 | AV (PA-POR-06) | Elegir correo valida el formato antes de enviar. |
| RF-POR-168 | Cierre administrativo del tótem con clave de dispositivo y caja asociada. | INV `IngresaClaveCierre`, `AbrirCaja`, `ObtenerCajaAbierta`, V2 VAR 2347 | X | O10 | AV (PA-POR-06) | Sin clave no se sale del modo tótem. |

### 5.17. Migración desde CoopOnline

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-POR-169 | Importar usuarios del portal (correo, celular, nombre, apellido, fecha de alta y validación) y sus cuentas vinculadas. | CAT `WS_USERS`, `WS_USERS_ACCOUNTS`, FIC 14.1 | N | O6 | A | Cada `WS_USERS_ACCOUNTS` válido genera un `portalAccountAccess` de rol `titular` o `autorizadoConsulta` según coincidencia de documento. |
| RF-POR-170 | Importar adhesiones a factura digital y débito automático vigentes. | FIC 14.1, RN-10 §15 pregunta 4 | N | O6 | A | El canal de entrega de M05 queda igual al de CoopOnline para cada cuenta migrada. |
| RF-POR-171 | Importar trámites web del último año con su estado y adjuntos como histórico consultable. | RN-10 §3.5 `ConsultarTramite_Usuario_PorId` | E | O11 | A | El socio ve sus trámites anteriores en "Mis gestiones" con etiqueta "Histórico". |
| RF-POR-172 | Importar formularios de trámite (`REQUISITOS`/`REQUISITOS_ITEMS`) como borradores de formularios para revisión. | CAT §26 | E | O11 | A | Cada requisito importado queda en estado borrador con mapeo de tipos. |
| RF-POR-173 | Invitar a los usuarios migrados por correo/celular a activar su acceso, con plantilla del tenant. | FIC 14.1 | N | O6 | A | El informe muestra enviados, entregados, activados. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | Verificar |
|---|---|---|---|---|---|
| RN-POR-001 | Registrarse crea solo una identidad de acceso con pertenencia al tenant; no crea asociado, titular, cuenta ni contrato. | No existía registro sin cuenta; `WS_USERS` sin cuentas (CAT §26) | Replicar y mejorar (BASE §67) | — | — |
| RN-POR-002 | La coincidencia de DNI, correo o nombre **no** concede pertenencia ni acceso a una cuenta. | CoopOnline vinculaba con código de socio + clave (VAR_PMOVIL 7, 8) | Mejorar (AGR-006, checklist 47) | — | — |
| RN-POR-003 | Conocer un número de cuenta no basta para acceder a información privada; la vinculación exige al menos **dos datos de conocimiento** de documentos de la cuenta o una identidad verificada que coincida con el titular. Métodos admitidos según DEC-043: código de factura + documento, código al contacto verificado o validación presencial, con intentos limitados (RN-POR-005). | Clave impresa en factura (VAR 800 "WEB - Tipo Clave") | Mejorar (BASE §25 control) | PRM-POR-010, PRM-POR-011 | [VERIFICAR] qué "tipo de clave" usa la piloto (VAR 800) |
| RN-POR-004 | Las respuestas de vinculación, recuperación y consulta pública son genéricas y de tiempo constante (anti-enumeración). | No documentado | Mejorar (CNX §2.5) | — | — |
| RN-POR-005 | Límite de intentos de vinculación: 5 fallidos en 15 min por usuario y 20 por hora por IP; superado, bloqueo de 15 min y alerta de seguridad al usuario. | No documentado | Mejorar (CNX §2.5 [MEJORAR]) | PRM-POR-012, PRM-POR-013 | — |
| RN-POR-006 | Toda nueva vinculación, representación o cambio de alcance se avisa al titular por sus canales verificados con enlace de revocación. | No existía | Adoptar (AGR-007) | — | — |
| RN-POR-007 | Cada acceso tiene rol (`titular`, `cotitular`, `representanteLegal`, `autorizado`, `autorizadoConsulta`), acciones permitidas (`consultar`, `pagar`, `gestionar`, `solicitarBaja`, `firmar`), vigencia y evidencia; fuera de vigencia no habilita nada y lo actuado se conserva. | `WS_USERS_ACCOUNTS` sin alcance ni vigencia | Mejorar (AGR-007) | PRM-POR-014 | — |
| RN-POR-008 | La revocación o el vencimiento de un acceso invalidan de inmediato su uso: la siguiente solicitud recibe 403; las URL firmadas emitidas caducan en ≤ 5 min. | No existía | Adoptar (AGR-007) | PRM-POR-015 | — |
| RN-POR-009 | El cambio de ámbito (tenant) o de espacio (socio/empleado) recalcula permisos y purga caché del Service Worker, stores Pinia, IndexedDB del ámbito anterior, descargas en curso y colas locales; los trabajos de fondo se reetiquetan o cancelan. | No aplicaba (un portal por cooperativa) | Adoptar (AGR-006) | — | — |
| RN-POR-010 | Los datos del espacio empleado y del espacio socio nunca se mezclan: endpoints distintos (`/api/por/...` vs `/api/por/empleado/...`), stores distintos, menú distinto y alcance `propios` en empleado. | PWeb era otra variante del portal (RN-10 §3) | Mejorar | — | — |
| RN-POR-011 | **Solicitar no equivale a ejecutar**: el estado del servicio solo cambia con el evento del módulo dueño (`cat.contract.activated`, `cat.contract.suspended`, `cat.contract.reactivated`, `cat.contract.terminated`; productor M02). | Trámite web ejecutaba un procedimiento que podía crear el servicio al aceptarse (RN-10 §3.5) | Mejorar (BASE §48, §43.3) | — | — |
| RN-POR-012 | El estado del trámite y el estado del servicio se presentan **siempre separados**, con etiquetas y colores distintos (ver tabla del §8.9). | `CONDICION` 1–4 y `Tipo_Estado_Req` en pantallas distintas | Mejorar | — | — |
| RN-POR-013 | La solicitud de baja no tiene cargo, no se supedita a registrarse, pagar deuda, aceptar cargos ni responder encuestas; la deuda previa y los documentos históricos se conservan sin ser impedimento. | No existía botón de baja | Adoptar (BASE §52.3, §53, Ley 24.240 art. 10 quáter) | — | — |
| RN-POR-014 | Para los servicios marcados en M02 con capacidad "botón de baja" (incluye Internet), la landing recibe la baja sin registro y emite **código identificador dentro de 24 h** por el mismo medio; la **constancia** se emite dentro de las 72 h. El tenant puede acortar, nunca alargar estos plazos. | No existía | Adoptar (Res. 316/2018; Ley 24.240 art. 10 ter) | PRM-POR-080, PRM-POR-081, PRM-POR-082 | Validar plazos por servicio y jurisdicción (§57) |
| RN-POR-015 | El código identificador de baja se genera y muestra **en el momento** de la recepción (cumple holgadamente el plazo) y se reenvía por el medio informado; si el envío falla se genera tarea al operador (AGR-024). | — | Adoptar | — | — |
| RN-POR-016 | La recepción pública no expone datos privados: la respuesta solo incluye el código, la fecha y los datos que aportó el solicitante. | — | Adoptar (BASE §52.3) | — | — |
| RN-POR-017 | Una baja pública no identificada se identifica después sin barreras: el operador la vincula al contrato o contacta al solicitante; la fecha de solicitud es la de recepción. | — | Adoptar (BASE §57 "identificación posterior sin barreras") | — | — |
| RN-POR-018 | La baja de un servicio no da de baja el vínculo de asociado. | — | Adoptar (BASE §48) | — | — |
| RN-POR-019 | Suspensión y reactivación muestran solo costos habilitados y validados para el servicio y la jurisdicción (M08); se registra la aceptación de condiciones con versión y fecha. | — | Adoptar (BASE §53, CIC-004) | — | — |
| RN-POR-020 | "Reactivado" solo con la confirmación técnica; el pago de un cargo admisible no cambia el estado del servicio. | — | Adoptar (BASE §53 control) | — | — |
| RN-POR-021 | Una visita fallida no activa el contrato. | — | Adoptar (BASE §50) | — | — |
| RN-POR-022 | Los consumos solo se presentan si existe fuente de medición definida; un abono no medido no inventa consumos. | Pestaña de consumos global (VAR_PMOVIL 31) | Mejorar (BASE §50) | PRM-POR-060 | — |
| RN-POR-023 | La reserva de visitas y turnos es atómica en M10/M09: dos reservas simultáneas del último recurso no se confirman ambas. | — | Adoptar (checklist 36) | — | — |
| RN-POR-024 | Un pago se muestra "Confirmado" solo con evento de M07 (webhook firmado o conciliación); el retorno del navegador desde la pasarela solo muestra "Pendiente de confirmación". | Autorización por Firebase/Integra/rendición (RN-10 §3.4) | Mejorar (AGR-012, ESC-04) | — | — |
| RN-POR-025 | Toda creación de checkout, cupón, recarga, adhesión o envío de formulario lleva `Idempotency-Key` (online) o `clientMutationId` (offline); reintentos no duplican. | `ActualizarEstadoPago` reintenta 6 veces; antirrebote 10 s (RN-10 §3.4) | Mejorar (AGR-016) | — | — |
| RN-POR-026 | Al iniciar el checkout se recalcula la deuda; si cambió respecto de lo mostrado, se informa la diferencia y se rehace la selección (opción "todas las facturas del cupón"). | `GetInfoCobranza`; VAR_PMOVIL 13 (RN-10 §3.3) | Replicar | PRM-POR-041 | [VERIFICAR] VAR_PMOVIL 13 en LAG |
| RN-POR-027 | El total a pagar no puede ser 0 y debe ser ≥ al importe mínimo configurado. | VAR 904 usado como importe mínimo (RN-10 §3.3) | Replicar separando "habilitar pagos" de "importe mínimo" (CTR-POR-05) | PRM-POR-040, PRM-POR-042 | [VERIFICAR] 904 en LAG |
| RN-POR-028 | No se pagan por el portal facturas bloqueadas ni cuentas bloqueadas para la web; se explica el motivo y el canal alternativo. | `Id_blo > 0`, `BLOQUEAR_FAC_WEB` (RN-10 §3.3) | Replicar | — | — |
| RN-POR-029 | El cupón único vence hoy + N días (si N > 1); al vencer, los recargos se recalculan y se genera uno nuevo. | VAR 2585 (RN-10 §3.3) | Replicar | PRM-POR-043 | [VERIFICAR] 2585 |
| RN-POR-030 | Un excedente pagado por un titular o representante no se aplica automáticamente a la deuda de otro titular, aunque compartan domicilio; queda saldo a favor o pendiente según política de M07. | Cobranza rechazaba si importes no coincidían (RN-10 §3.4) | Mejorar (ESC-01, AGR-011, AGR-012) | — | — |
| RN-POR-031 | Pagos parciales de comprobantes agrupados se imputan según la política del tenant (antigüedad, prioridad de servicio o elección del socio); el portal muestra la regla antes de confirmar. | — | Adoptar (FAC-008) | — | Depende de §106 |
| RN-POR-032 | Con "diferir intereses", el recargo del pago web es 0 y se factura en el período siguiente (M08). | VAR_PMOVIL 12 (RN-10 §3.3) | Replicar como política de M08 | PRM-POR-044 | [VERIFICAR] 12 |
| RN-POR-033 | Una solicitud de recarga prepaga expira si no se paga en el plazo configurado (600 s por defecto). | Identificador con < 600 s (RN-10 §3.3 `crearVenta`) | Replicar | PRM-POR-064 | — |
| RN-POR-034 | Recarga prepaga: solo servicios con categoría prepaga y telemedición; rechazada si la cuenta no factura (`NOF_SUM`) o está bloqueada para la web; importe ≥ mínimo de venta; capital = importe − recargo + bonificación (0 si no cubre el recargo); se informa energía equivalente y retención por deuda. | RN-10 §3.3 `crearVenta` | Replicar (cálculo en M03/M07) | PRM-POR-063 | [VERIFICAR] si LAG vende prepaga |
| RN-POR-035 | El estado visible de una operación digital solo avanza: generado → pagado → registrado → enviado; nunca retrocede salvo "rechazado" desde generado. | `ESTADO_VENTA` 0–3, `ActualizaEstado` (RN-10 §3.2) | Replicar | — | — |
| RN-POR-036 | Tras imputar, se envía factura (prepaga) o recibo (cobranza) con las facturas de intereses generadas, con copia opcional a una casilla del tenant. | Plantillas `FacturaCooponline.html`, `ReciboCooponline.html`, VAR 2499, 2551 (RN-10 §3.4) | Replicar con plantillas T09 | PRM-POR-046, PRM-POR-047 | [VERIFICAR] 2499 |
| RN-POR-037 | El medio de pago se registra según el resultado de la pasarela: sin identificador externo, efectivo (cupón pagado en red); con identificador, transferencia/tarjeta en la moneda y cuenta de la entidad. | `GetMedioPago` (RN-10 §3.4), VAR 186, 2774 | Replicar en M07 | PRM-POR-045 | [VERIFICAR] 2774 |
| RN-POR-038 | Las percepciones de IVA e IIBB sobre recargos se calculan con las reglas fiscales vigentes (mínimo imponible, agrupación, discriminación). | `ValidarImpuestos` (VAR 758, 1056, 2826) | Replicar en M06 | — | — |
| RN-POR-039 | El portal nunca recibe ni almacena datos de tarjeta (número, vencimiento, código de seguridad): se capturan solo en el componente alojado de la pasarela y el portal recibe token o identificador de adhesión, marca y últimos 4 (DEC-091). El CBU sí se ingresa en el portal: viaja por TLS a la API, se valida y se guarda cifrado (`cbuEncrypted`), y en adelante solo se muestra enmascarado; antes "datos completos de tarjeta o CBU fuera del componente tokenizado". | Lector y SDK en tótem (`ctrlPagoTarjeta`, `ObtenerSDKPagos360`) | Mejorar (BASE §105 sol. 6) | — | — |
| RN-POR-040 | La adhesión a factura digital exige el medio elegido verificado; la baja de la adhesión es libre e inmediata para el período siguiente no emitido. | VAR_PMOVIL 32, 911 | Replicar con verificación | PRM-POR-050, PRM-POR-051 | — |
| RN-POR-041 | Pago de facturas con débito adherido: no permitir / permitir siempre / permitir solo con recargo de mora. | VAR_PMOVIL 63 | Replicar | PRM-POR-048 | — |
| RN-POR-042 | DDJJ de artefactos: solo para servicios con plantilla de DDJJ en M02 (PRM-CAT-110: GAS y ELE; en ProCoop, solo energía `COD_SER = 1`); la grilla y la unidad de potencia salen de la plantilla del servicio (kcal/h en gas, W en artefactos eléctricos, kW en vehículos eléctricos); al registrar, los artefactos vigentes pasan a histórico; se omiten filas con cantidad 0 sin observación; se conserva la fecha original; todo en una transacción que revierte si falla. | `RegistrarArtefacto` (RN-10 §3.5) | Replicar (M02 dueño de `contractDeclaredAppliances`, RF-CAT-095; HUE-GAS-01. Texto original: "M01/M03 dueño de artefactos") | PRM-POR-066, PRM-POR-067, PRM-CAT-110 | — |
| RN-POR-043 | Adherentes: el servicio debe admitir adherentes; la persona debe existir o se crea con el domicilio del titular; con la regla de adherente único activa, no puede ser adherente del mismo servicio en otra cuenta; alta y fotos de documento en una transacción. | `GetInfoAdherente`, `GuardarAdherentes` (RN-10 §3.2, §3.5), VAR 2400 | Replicar | PRM-POR-068 | [VERIFICAR] 2400 |
| RN-POR-044 | Conversión de valores del formulario por tipo: texto; número con cultura invariante; fecha ISO; lista (código → descripción); consulta a catálogo permitido (con opción "No registrar"); archivo; adherentes (JSON con tipo de documento y vínculo); un tipo desconocido se rechaza (no se descarta en silencio). | `ValidarValor` (RN-10 §3.5) | Mejorar | — | — |
| RN-POR-045 | Un formulario con "comparar documento" exige que el DNI/CUIL verificado del usuario coincida con el del titular de la persona, cuenta o servicio requerido; si no coincide, se rechaza con mensaje claro. | `ValidarNroDocumento` vs CiDi (RN-10 §3.5) | Replicar con identidad verificada (PA-POR-04) | — | — |
| RN-POR-046 | La ejecución de un formulario invoca un **comando tipado** registrado del módulo dueño; devuelve mensaje, resultado y referencia creada; si es exitoso, la presentación pasa a "aceptada", los adjuntos van al expediente y los adherentes se dan de alta; si falla, nada se persiste parcialmente. | Procedimiento almacenado con nombre = descripción (RN-10 §3.5) | Reemplazar (CTR-POR-07) | — | [VERIFICAR] qué trámites tiene publicados LAG (RN-10 §15 pregunta 9) |
| RN-POR-047 | Estados de una presentación: borrador, enviada, observada, aceptada, rechazada, cancelada. | `Tipo_Estado_Req`: cargado, aceptado, rechazado, cancelado | Mejorar (agrega borrador y observada) | — | — |
| RN-POR-048 | Cada formulario declara el dato requerido: persona, cuenta o servicio; el asistente exige elegirlo entre los accesos vigentes del usuario (o ninguno para altas). | `DATO_REQUIERE` 1, 2, 3 | Replicar | — | — |
| RN-POR-049 | Borradores: guardado automático al cambiar de paso y cada 30 s; vencen a los N días con aviso previo; los adjuntos del borrador viven en almacenamiento privado y se purgan al vencer. | — | Adoptar (AGR-032) | PRM-POR-090 | — |
| RN-POR-050 | La expiración de sesión durante un formulario no pierde datos: el reingreso retoma el mismo paso. | — | Adoptar (AGR-032) | — | — |
| RN-POR-051 | Una publicación solo aparece en la landing si su canal incluye `landing`; copiar una plantilla o cambiar el autor no cambia la audiencia. | Novedades web (`WEB_NOVEDADES`, VAR 2733) | Mejorar (AGR-031) | PRM-POR-085 | — |
| RN-POR-052 | Comentarios y reacciones de socios solo si el tenant y la publicación los habilitan; moderación IA (propone) + humano (decide). | — | Adoptar (DEC-008) | PRM-POR-086 | — |
| RN-POR-053 | Las encuestas nunca bloquean baja, pago, reclamo ni consulta. | — | Adoptar (CTR-POR-15) | PRM-POR-087 | — |
| RN-POR-054 | Una comunicación que cumple un hito (constancia de baja, código, intimación) requiere evidencia de entrega; "aceptado por el proveedor" no basta; un fallo genera acción. | Correo vía SES del proveedor sin evidencia | Mejorar (AGR-024) | — | — |
| RN-POR-055 | Avisos comerciales respetan la baja voluntaria del socio; las constancias reguladas y avisos operativos no se pueden desactivar pero sí elegir canal. | — | Adoptar (AGR-024) | — | — |
| RN-POR-056 | El rol de inicio se calcula en servidor por cuenta seleccionada con prioridad: suspendido > moroso > activo > con baja; sin cuentas: registrado; los roles de empleado y campo se ofrecen como espacios. | — | Adoptar (CNX §3.8) | PRM-POR-091 | — |
| RN-POR-057 | Moroso o suspendido no pierde consulta, pago, reclamo, baja ni descarga de constancias; las nuevas contrataciones siguen la política configurada. | VAR_PMOVIL 37 | Adoptar | PRM-POR-071 | PA-POR-15 |
| RN-POR-058 | Recibos de sueldo: solo los propios; con la opción activa no se descargan antes de firmar; con la otra, no se accede al del mes actual si el anterior no está firmado. | VAR 3122, 3166 | Replicar | PRM-POR-095, PRM-POR-096 | — |
| RN-POR-059 | Los empleados no usuarios del sistema reciben únicamente el perfil de portal del empleado configurado. | VAR_PMOVIL 41 (`GetUserCoop`) | Replicar | PRM-POR-097 | — |
| RN-POR-060 | La consulta pública de facturas exige número de cuenta + dato verificador, muestra solo comprobantes impagos con datos enmascarados y tiene límite de consultas por IP. | VAR_PMOVIL 60 ("mostrar todos los comprobantes sin login"), 61 | Mejorar (CTR-POR-06) | PRM-POR-052, PRM-POR-053 | PA-POR-02 |
| RN-POR-061 | Los PDF se sirven solo por URL firmada de corta vida, ligada a la sesión, nunca por ruta estática pública. | PDF en FTP/S3 del proveedor (RN-10 §3) | Reemplazar (CNX §2.6) | PRM-POR-015 | — |
| RN-POR-062 | Visibilidad de comprobantes: desde la fecha de corte del tenant; solo tipos marcados visibles; comprobantes bloqueados sin PDF si así se configura; historial limitado a N meses en pantalla (el archivo se conserva según T08). | VAR_PMOVIL 17, 20, 36, 39, 74; VAR 829, 2261, 2448, 3168 | Replicar como filtros de presentación | PRM-POR-030 a PRM-POR-035 | — |
| RN-POR-063 | Si el color de marca no alcanza contraste 4.5:1 (texto) o 3:1 (componentes), se calcula automáticamente un tono accesible para esos usos. | — | Adoptar (AGR-032) | — | — |
| RN-POR-064 | La IA solo propone (OCR de autolectura, clasificación de reclamos, respuestas del bot); el socio confirma y el operador decide. | — | Adoptar (checklist 34, DEC-001) | — | — |
| RN-POR-065 | Autolectura: solo servicios habilitados, dentro de la ventana de lectura del ciclo, con foto obligatoria; se valida en M03 como lectura capturada (rango, consumo histórico); el resultado (aceptada, en revisión, rechazada con motivo) se informa. | — | Adoptar (MER-018) | PRM-POR-061, PRM-POR-062 | PA-POR-14 |
| RN-POR-066 | Toda acción del portal registra actor, cuenta, acceso utilizado, IP/dispositivo y `requestId` en la auditoría (T02). | `WEB_LOG` solo registraba sincronización | Mejorar | — | — |
| RN-POR-067 | Una sola versión de landing publicada por tenant; publicar archiva la anterior y permite revertir. | — | Adoptar | — | — |
| RN-POR-068 | Un mismo domicilio puede tener varias contrataciones del mismo servicio con titulares distintos; el portal agrupa por cuenta/titular, nunca por domicilio. | — | Adoptar (BASE §83) | — | — |
| RN-POR-069 | "Ver como socio" desde admin es de solo lectura, exige motivo, queda auditado y no muestra datos de pago tokenizados. | Ingreso directo con clave cifrada desde escritorio (`GetEncryptedKey`) | Reemplazar | — | — |
| RN-POR-070 | Un reclamo técnico genera OT automáticamente solo si el tenant lo configura y la tipología lo requiere. | VAR_PMOVIL 58 | Replicar | PRM-POR-074 | — |
| RN-POR-071 | Las observaciones internas de casos y órdenes nunca se envían al portal; las observaciones técnicas de la OT se ocultan si se configura. | VAR_PMOVIL 73 | Replicar y endurecer | PRM-POR-073 | — |
| RN-POR-072 | Las notificaciones por cuenta tienen vigencia (1 mes por defecto) y estado leído/no leído. | `NOTI_COOP` (RN-10 §3.6) | Replicar en T09 | PRM-POR-088 | — |
| RN-POR-073 | Turnos: número correlativo por día y área; con la opción activa, el código visible usa los últimos 3 dígitos del DNI y no se imprime; tiempo estimado por turnos pendientes y boxes abiertos. | `clsTurnero.CrearTurno`, `GetTiempoEstimadoTurno`, VAR 3064 (RN-10 §16) | Replicar en M09 | PRM-POR-076, PRM-POR-077 | [VERIFICAR] si LAG usa turnero |
| RN-POR-074 | Tótem: dispositivo registrado con caja y sucursal; si la caja del día no está abierta y la política lo permite, se abre automáticamente con observación; el cierre exige clave del dispositivo. | `AbrirCaja`, "Apertura automatica Cooponline", VAR 2347 | Replicar con caja virtual por dispositivo (M07) | PRM-POR-100 a PRM-POR-103 | PA-POR-06 |
| RN-POR-075 | Teléfono y correo exigidos según el tenant; con reconfirmación activa se piden en cada ingreso; los datos de contacto que el socio actualiza en el portal no se sobrescriben con los del ERP si así se configura (se registran como contacto preferido en M01). | VAR_PMOVIL 15, 18, 19; VAR 2460 | Replicar | PRM-POR-020 a PRM-POR-023 | — |
| RN-POR-076 | Un cambio de datos personales sensibles (DNI, CUIT, titularidad) nunca se aplica desde el portal: genera trámite. Correo, teléfono y preferencias se aplican tras verificación. | — | Adoptar (§25 "Actualizar datos permitidos") | — | — |
| RN-POR-077 | El tenant no puede desactivar restricciones normativas (botón de baja, gratuidad de baja, plazos) por ser administrador. | — | Adoptar (BASE §52.4) | — | — |
| RN-POR-078 | Un servicio retirado de la oferta deja de mostrarse para nuevas contrataciones, pero los contratos existentes siguen visibles y operables. | — | Adoptar (BASE §66) | — | — |

## 7. Modelo de datos

Convenciones: todo documento lleva `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`; los índices empiezan por `tenantId`. Ninguna colección de este módulo almacena importes propios (los importes se leen de M05/M07 y viajan como `Decimal128` en las vistas). Los adjuntos se guardan en almacenamiento privado (T11) y aquí solo se referencian por `fileId`. Nombres canónicos de T05 (CTR-DAT-30, CTR-DAT-32): `fileId` se lee `storedFileId` (binario en `storedFiles` de T01) o `documentRefId` (expediente de T11) según apunte a archivo o a documento; `legacyRef` se reemplaza por el subdocumento `legacy` de T05 §19.1 (`{system, table, key, runId, hash, readOnly}`); las solicitudes de derechos del titular de datos que origina el portal se guardan en `dataSubjectRequests` de T08 (CTR-DAT-19), M19 solo las inicia y muestra su estado.

> **Corrección 05-11-2026 (tablas de campos):** las tablas de este §7 incorporan la columna Referencia, que declara la colección destino y su anexo dueño según los nombres canónicos de T05 §7.2 (`userId` → `memberships` de T02, `accountId` → `accounts` de M01, `contractIds` → `serviceContracts` de M02). Se agregan los campos de referencia que T05 declara y este anexo no describía (`tenantBrandingId`, `formVersionId`, `migrationRunId`, `localAgentId`), con obligatoriedad `[VERIFICAR]`, y `portalForms.serviceCode` pasa a `serviceId` (nombre de T05).

### 7.1. `landingPages`

Propósito: configuración vigente de la landing de un tenant (una por tenant y por idioma).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `tenantId` | ObjectId | Sí |  | `tenants` (T01) |
| `locale` | String | Sí | `es-AR` por defecto | — |
| `slug` | String | Sí | Subdominio (`coop-a`) | — |
| `customDomain` | String | No | Dominio propio verificado (PA-POR-12). Copia validada contra el registro único de dominios `tenants.domains` de T01, que es el que resuelve el tenant (CTR-DAT-56); no se acepta un valor que no exista allí | — |
| `customDomainStatus` | Enum | No | `pendienteVerificacion`, `verificado`, `certificadoEmitido`, `error` | — |
| `publishedVersionId` | ObjectId | No | Versión publicada vigente | `landingPageVersions` (M19) |
| `draftVersionId` | ObjectId | No | Versión en edición | `landingPageVersions` (M19) |
| `seo` | Object | No | `{ titleKey, descriptionKey, ogImageStoredFileId, indexable: Boolean }` (antes `ogImageFileId`, CTR-DAT-30) | — |
| `legacyRedirects` | Array | No | `[{ fromPath, toPath, active }]` (RF-POR-020) | — |
| `status` | Enum | Sí | `activa`, `suspendida` (tenant suspendido T01) | — |
| `tenantBrandingId` | ObjectId | [VERIFICAR] | Marca del tenant que usa la landing; T05 (COL-POR-01) la declara y este anexo no la describía | `tenantBrandings` (T03) |

Índices: `{ tenantId: 1, locale: 1 }` único; `{ slug: 1 }` único global (resolución de tenant desde subdominio, sin tenant en token); `{ customDomain: 1 }` único parcial (control de consistencia; la unicidad y la resolución de dominios propios las garantiza `tenants.domains` de T01, CTR-DAT-56).

### 7.2. `landingPageVersions`

Propósito: versiones inmutables de la landing (RN-POR-067).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `landingPageId` | ObjectId | Sí |  | `landingPages` (M19) |
| `number` | Int | Sí | Correlativo | — |
| `status` | Enum | Sí | `borrador`, `enRevision`, `aprobada`, `programada`, `publicada`, `archivada`, `rechazada` | — |
| `blocks` | Array | Sí | `[{ blockId, type, order, visible, props }]`; `type` ∈ `hero`, `serviciosDestacados`, `accesosRapidos`, `noticias`, `avisosInterrupcion`, `tramites`, `faq`, `contacto`, `sucursales`, `redes`, `botonBaja`, `textoLibre`, `imagenTexto`, `pieLegal` | — |
| `blocks[].props` | Object | Sí | Validado por esquema Zod por tipo; textos como claves `dict:` o texto plano saneado (sin HTML) | — |
| `scheduledAt` | Date | No | Publicación programada | — |
| `publishedAt` / `publishedBy` | Date / ObjectId | No |  | `memberships` (T02) (solo `publishedBy`) |
| `reviewComment` | String | No |  | — |
| `previousVersionId` | ObjectId | No | Para revertir | `landingPageVersions` (M19) |

Reglas: el bloque `botonBaja` no puede ocultarse si el tenant tiene servicios con capacidad "botón de baja" (RN-POR-077); el validador lo exige en portada y pie. Índices: `{ tenantId: 1, landingPageId: 1, number: -1 }`.

### 7.3. `portalAccountAccess`

Propósito: acceso de un usuario a una cuenta con rol, alcance y vigencia (reemplaza `WS_USERS_ACCOUNTS`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `userId` | ObjectId | Sí | Usuario T02 | `memberships` (T02) |
| `personId` | ObjectId | Sí | Persona M01 del usuario en este tenant | `persons` (M01) |
| `accountId` | ObjectId | Sí | Cuenta M01 | `accounts` (M01) |
| `contractIds` | [ObjectId] | No | Si el acceso se limita a contratos concretos (vacío = todos los de la cuenta) | `serviceContracts` (M02) |
| `role` | Enum | Sí | `titular`, `cotitular`, `representanteLegal`, `autorizado`, `autorizadoConsulta` | — |
| `actions` | [Enum] | Sí | `consultar`, `pagar`, `gestionar`, `solicitarBaja`, `firmar` | — |
| `origin` | Enum | Sí | `codigoSocioClave`, `suministroDocumento`, `factura`, `codigoContactoTitular` (RF-POR-179, DEC-043), `identidadFederada`, `invitacionOperador`, `invitacionTitular`, `relacionLegalValidada`, `migracionCoopOnline`, `altaPorTramite` | — |
| `evidence` | Object | No | `{ relationId (M01), storedFileIds, verifiedBy, verifiedAt, idpLevel }` (antes `fileIds`, CTR-DAT-30) | — |
| `grantedByUserId` | ObjectId | No | Titular que invitó | `memberships` (T02) |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia | — |
| `status` | Enum | Sí | `pendienteVerificacion`, `pendienteConfirmacionTitular`, `activo`, `suspendido`, `revocado`, `vencido` | — |
| `revokedAt` | Date | No | Antes en una fila conjunta con `revokedBy` y `revokeReason` (PA-POR-22) | — |
| `revokedBy` | ObjectId | No | Usuario que revocó | `memberships` (T02) |
| `revokeReason` | String | No | Motivo de la revocación | — (texto, no es referencia) |
| `isDefault` | Boolean | No | Cuenta por defecto del usuario | — |
| `lastUsedAt` | Date | No |  | — |
| `legacy` | Object | No | Subdocumento de T05 §19.1 (`table: 'WS_USERS_ACCOUNTS'`, `key`, `runId`, `hash`, `readOnly`; CTR-DAT-32). Antes `legacyRef` `{ codAccount, codUser, codSum, codSoc }` | — |

Índices: `{ tenantId: 1, userId: 1, status: 1 }`; `{ tenantId: 1, accountId: 1, status: 1 }`; único parcial `{ tenantId: 1, userId: 1, accountId: 1 }` donde `status ∈ {activo, pendiente*}`.

### 7.4. `portalLinkAttempts`

Propósito: intentos de vinculación para limitar abuso y auditar (RN-POR-005).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `userId` | ObjectId | Sí |  | `memberships` (T02) |
| `method` | Enum | Sí | Igual a `origin` de 7.3 | — |
| `inputFingerprint` | String | Sí | Hash HMAC de los datos ingresados (nunca en claro) | — |
| `result` | Enum | Sí | `exito`, `datosInvalidos`, `bloqueado`, `requiereAsistencia`, `pendienteTitular` | — |
| `accountId` | ObjectId | No | Solo si `exito` | `accounts` (M01) |
| `ip` / `userAgentHash` | String | Sí |  | — |
| `expiresAt` | Date | Sí | TTL 90 días | — |

Índices: `{ tenantId: 1, userId: 1, createdAt: -1 }`; `{ tenantId: 1, ip: 1, createdAt: -1 }`; TTL en `expiresAt`.

### 7.5. `portalDelegationInvites`

Propósito: invitaciones de representación del titular a un tercero (AGR-007).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | ObjectId | Sí |  | `accounts` (M01) |
| `contractIds` | [ObjectId] | No |  | `serviceContracts` (M02) |
| `grantorUserId` | ObjectId | Sí | Titular | `memberships` (T02) |
| `inviteeContact` | Object | Sí | `{ email?, phone?, documentType?, documentNumberHash? }` | — |
| `inviteeUserId` | ObjectId | No | Al aceptar | `memberships` (T02) |
| `actions` | [Enum] | Sí | Igual a 7.3 | — |
| `validTo` | Date | Sí | ≤ hoy + PRM-POR-014 | — |
| `tokenHash` | String | Sí | Token de un solo uso (hash) | — |
| `status` | Enum | Sí | `enviada`, `aceptada`, `rechazada`, `vencida`, `revocada` | — |
| `accessId` | ObjectId | No | Acceso creado al aceptar | `portalAccountAccess` (M19) |

Índices: `{ tenantId: 1, accountId: 1, status: 1 }`; `{ tokenHash: 1 }` único.

### 7.6. `portalForms`

Propósito: definición versionada de formularios por servicio y tipo de trámite (reemplaza `REQUISITOS` y `REQUISITOS_ITEMS`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `INT-ALTA`, `INT-BAJA`, `ENE-DDJJ-ART`… | — |
| `nameKey` / `descriptionKey` | String | Sí | Claves `dict:` | — |
| `serviceId` | ObjectId | No | Servicio M02 (vacío = general). Antes `serviceCode` (String; nombre de T05, COL-POR-06) | `tenantServices` (M02) |
| `kind` | Enum | Sí | `solicitudAlta`, `solicitudBaja`, `suspension`, `reactivacion`, `cambioPlan`, `cambioTitularidad`, `cambioDomicilioPostal`, `cambioCategoria`, `altaAdherente`, `ddjjArtefactos`, `ddjjVehiculosElectricos`, `reclamo`, `consulta`, `tramiteGeneral`, `pdfDescargable` (ProCoop `TIPO_TRAMITE`: PDF, trámite web, DDJJ) | — |
| `requiredSubject` | Enum | Sí | `ninguno`, `persona`, `cuenta`, `servicio` (`DATO_REQUIERE` 1–3) | — |
| `audience` | Enum | Sí | `publico` (sin login, solo baja/contacto), `registrado`, `conAcceso` | — |
| `requiredAction` | Enum | No | Acción del acceso exigida (`gestionar`, `solicitarBaja`) | — |
| `repetition` | Enum | Sí | `ilimitada`, `unaVigentePorSujeto`, `unaPorPeriodo` (`REPETICION`) | — |
| `compareDocument` | Boolean | Sí | `COMPARAR_DOCUMENTO` | — |
| `showTerms` / `termsKey` / `termsVersion` | Boolean / String / String | No | `MOSTRAR_TYC`, `DESCRIP_TYC` | — |
| `pdfStoredFileId` | ObjectId | No | `PDFFILE` (antes `pdfFileId`, CTR-DAT-30) | `storedFiles` (T01) |
| `contactRequired` | Boolean | Sí | `DATO_CONTACTO` | — |
| `executionCommand` | String | No | Comando tipado registrado (`crm.openServiceRequest`, `per.registerAppliances`…) (RN-POR-046) | — |
| `notifyEmail` | String | No | VAR_PMOVIL 49 | — |
| `selfServiceImmediate` | Boolean | Sí | Si la acción se ejecuta sin intervención (PA-POR-05) | — |
| `status` | Enum | Sí | `borrador`, `publicado`, `retirado` | — |
| `currentVersion` | Int | Sí | Reemplazado por `formVersionId` (versión publicada vigente en `formVersions` de T11; PA-POR-21). Se conserva como número de versión de lectura. | — |
| `versions` | Array | No (antes Sí) | Reemplazado por `formVersions` de T11 (PA-POR-21): las versiones publicadas, sus pasos y campos viven en T11 y son inmutables; antes `[{ number, publishedAt, steps: [{ stepId, titleKey, fields: [...] }] }]` embebido. | `formVersions` (T11) |
| `versions[].steps[].fields[]` | Object | No (antes Sí) | Reemplazado por los campos de `formVersions` de T11 (PA-POR-21); definición anterior: `{ fieldId, labelKey, helpKey, type, mask, required, visibleIf, order, operatorOnly, sendToCommand, options: [{code, labelKey}], catalogSource, maxFiles, maxSizeMb, acceptedTypes, min, max, pattern }` | — |
| `fields[].type` | Enum | Sí | `texto`, `numero`, `fecha`, `lista`, `consultaCatalogo`, `archivo`, `foto`, `adherentes`, `domicilio`, `plan`, `firma`, `aceptacion`, `grillaDdjj`, `informativo`, `contacto` | — |
| `legacy` | Object | No | Subdocumento de T05 §19.1 (CTR-DAT-32). Antes `legacyRef` `{ requisitoId }` | — |
| `formVersionId` | ObjectId | Sí (al publicar) | Versión publicada vigente del formulario en `formVersions` de T11 (PA-POR-21, como T05 COL-POR-06); antes "[VERIFICAR] cuál prevalece" frente a `versions` embebido. | `formVersions` (T11) |

Mapeo ProCoop: `REQUISITOS.ORDEN` → orden en lista pública; `INICIO_QUERY`/`FIN_QUERY`/`QUERY_CONSULTA_WS` → **no se migran como SQL**: se reemplazan por `catalogSource` de catálogos permitidos; `REQUISITOS_ITEMS.DES_DATO` → `labelKey`; `TIPO_DATO` → `type`; `MASCARA` → `mask`/`options`; `OBLIGATORIO` → `required`; `QUERY` (HTML del control) → descartado (lo genera el componente); `COMBINADO` → `visibleIf`; `VISIBLE` → visibilidad; `TABLA` → `catalogSource`; `REGISTRA_USER` → `operatorOnly`; `NOENVIAR_PROC` → `sendToCommand = false`.

Índices: `{ tenantId: 1, code: 1 }` único; `{ tenantId: 1, serviceId: 1, kind: 1, status: 1 }`. (Antes `serviceCode` en el índice.)

### 7.7. `portalFormSubmissions`

Propósito: presentaciones de formularios (reemplaza `Requisitos_Usuarios` y los valores guardados en la API de CoopOnline).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `formId` / `formVersion` | ObjectId / Int | Sí | Versión usada (inmutable) | `portalForms` (M19) (solo `formId`) |
| `formVersionId` | ObjectId | Sí | Versión de T11 usada en la presentación (inmutable; PA-POR-21). `formVersion` queda como número de lectura. | `formVersions` (T11) |
| `userId` | ObjectId | No | Vacío si es público | `memberships` (T02) |
| `actorUserId` / `onBehalfOfPersonId` | ObjectId | No | RF-POR-046 | `memberships` (T02) / `persons` (M01) |
| `subject` | Object | No | `{ type: persona/cuenta/servicio, personId?, accountId?, contractId? }` | — |
| `serviceCode` | String | No |  | — |
| `values` | Object | Sí | Valores por `fieldId`, ya normalizados (RN-POR-044) | — |
| `operatorValues` | Object | No | Campos `operatorOnly` | — |
| `storedFileIds` | [ObjectId] | No | Antes `fileIds` (CTR-DAT-30) | `storedFiles` (T01) |
| `termsAccepted` | Object | No | `{ version, acceptedAt, ip }` | — |
| `status` | Enum | Sí | `enviada`, `observada`, `aceptada`, `rechazada`, `cancelada` | — |
| `observations` | Array | No | `[{ fieldIds, messageKey/text, createdBy, createdAt, resolvedAt }]` | — |
| `crmCaseId` | ObjectId | No | Caso M09 creado | `crmCases` (M09) |
| `executionResult` | Object | No | `{ ok, message, createdRef: { type, id } }` | — |
| `channel` | Enum | Sí | `pwa`, `landing`, `totem`, `operador`, `migracion` | — |
| `idempotencyKey` | String | Sí |  | — |
| `receiptStoredFileId` | ObjectId | No | Constancia PDF (antes `receiptFileId`, CTR-DAT-30) | `storedFiles` (T01) |
| `legacy` | Object | No | Subdocumento de T05 §19.1 (CTR-DAT-32). Antes `legacyRef` `{ idRequisitoUsuario }` | — |

Índices: `{ tenantId: 1, userId: 1, createdAt: -1 }`; `{ tenantId: 1, formId: 1, status: 1 }`; `{ tenantId: 1, idempotencyKey: 1 }` único; `{ tenantId: 1, crmCaseId: 1 }`.

### 7.8. `portalDrafts`

Propósito: borradores de formularios, gestiones, pagos en armado (AGR-032).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `userId` | ObjectId | Sí |  | `memberships` (T02) |
| `space` | Enum | Sí | `socio`, `empleado` | — |
| `kind` | Enum | Sí | `formulario`, `gestion`, `vinculacion`, `representacion`, `licencia` | — |
| `formId` / `formVersion` | ObjectId / Int | No |  | `portalForms` (M19) (solo `formId`) |
| `formVersionId` | ObjectId | No | Versión de T11 del formulario en armado (PA-POR-21). | `formVersions` (T11) |
| `currentStep` | String | No |  | — |
| `values` | Object | Sí | Cifrado a nivel de campo para datos sensibles (DNI, CBU) | — |
| `storedFileIds` | [ObjectId] | No | Antes `fileIds` (CTR-DAT-30) | `storedFiles` (T01) |
| `clientMutationId` | String | No | Para sincronización offline | — (identificador de la mutación offline generado por el cliente, no es referencia) |
| `expiresAt` | Date | Sí | Hoy + PRM-POR-090 | — |
| `expiryNoticeSentAt` | Date | No |  | — |

Índices: `{ tenantId: 1, userId: 1, kind: 1, updatedAt: -1 }`; TTL en `expiresAt` (el job purga además adjuntos).

### 7.9. `publicSubmissions`

Propósito: recepciones sin login desde la landing (baja pública, contacto, consulta) hasta su derivación al CRM.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | Enum | Sí | `bajaServicio`, `contacto`, `consulta`, `consultaFactura` (solo log) | — |
| `publicCode` | String | Sí | Código identificador legible (`BJ-7K4P-2Q`), único por tenant | — |
| `serviceCode` | String | No |  | — |
| `declared` | Object | Sí | `{ fullName, documentType, documentNumber, accountNumber?, supplyNumber?, address?, reason? }` (cifrado en reposo) | — |
| `contact` | Object | Sí | `{ channel: email/phone/whatsapp, value, verified: Boolean }` | — |
| `sameChannelAsContract` | Boolean | No | Si coincide con el medio de contratación (Ley 24.240 art. 10 ter) | — |
| `receivedAt` | Date | Sí | Fecha de solicitud a efectos legales | — |
| `codeDeliveredAt` / `codeDeliveryEvidence` | Date / Object | No | Evidencia T09 (RN-POR-054) | — |
| `receiptIssuedAt` / `receiptStoredFileId` | Date / ObjectId | No | Constancia (antes `receiptFileId`, CTR-DAT-30) | `storedFiles` (T01) (solo `receiptStoredFileId`) |
| `dueCodeAt` / `dueReceiptAt` | Date | Sí | Plazos calculados (24 h / 72 h) | — |
| `identification` | Object | No | `{ status: pendiente/identificada/noIdentificable, accountId, contractId, identifiedBy, identifiedAt }` | — |
| `crmCaseId` | ObjectId | No |  | `crmCases` (M09) |
| `status` | Enum | Sí | `recibida`, `codigoEntregado`, `identificada`, `derivada`, `constanciaEmitida`, `cerrada`, `descartadaSpam` | — |
| `captchaScore` / `ip` | Number / String | No | Antiabuso | — |

Índices: `{ tenantId: 1, publicCode: 1 }` único; `{ tenantId: 1, status: 1, dueCodeAt: 1 }`; `{ tenantId: 1, kind: 1, receivedAt: -1 }`.

### 7.10. `portalUserPreferences`

Propósito: preferencias del portal por usuario y tenant (las preferencias de comunicación son de T09).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `userId` | ObjectId | Sí |  | `memberships` (T02) |
| `defaultAccountId` | ObjectId | No |  | `accounts` (M01) |
| `defaultSpace` | Enum | No | `socio`, `empleado` | — |
| `theme` | Enum | No | `oscuro`, `claro`, `altoContraste`, `sistema` | — |
| `textScale` | Number | No | 1.0–2.0 | — |
| `reduceMotion` | Boolean | No |  | — |
| `wideLayout` | Boolean | No | PA-POR-07 | — |
| `dismissedBannerIds` | [ObjectId] | No |  | `portalBanners` (M19) |
| `installPromptState` | Enum | No | `noMostrado`, `rechazado`, `instalado` | — |
| `lastContactConfirmationAt` | Date | No | VAR_PMOVIL 19 | — |
| `acceptedTerms` | Array | No | `[{ docType, version, acceptedAt }]` | — |

Índices: `{ tenantId: 1, userId: 1 }` único.

### 7.11. `portalBanners`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `titleKey` / `bodyKey` | String | Sí |  | — |
| `severity` | Enum | Sí | `info`, `exito`, `advertencia`, `critico` | — |
| `audience` | Object | Sí | `{ roles: [visitante, registrado, socioActivo, socioMoroso, socioSuspendido, socioConBaja, representante, empleado], serviceCodes, zones, segmentId (T09) }` | — |
| `surface` | Enum | Sí | `landing`, `pwaInicio`, `pwaGlobal`, `empleadoInicio` | — |
| `cta` | Object | No | `{ labelKey, route }` | — |
| `validFrom` / `validTo` | Date | Sí |  | — |
| `dismissible` | Boolean | Sí |  | — |
| `priority` | Int | Sí |  | — |
| `status` | Enum | Sí | `borrador`, `activo`, `pausado`, `vencido` | — |

Índices: `{ tenantId: 1, surface: 1, status: 1, validFrom: 1, validTo: 1 }`.

### 7.12. `legacyPortalImports`

Propósito: lotes de importación de CoopOnline.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sourceKind` | Enum | Sí | `wsUsers`, `wsUsersAccounts`, `adhesionesFacturaDigital`, `adhesionesDebito`, `requisitos`, `tramitesUsuarios`, `notificaciones`, `novedades` | — |
| `storedFileId` | ObjectId | Sí | Volcado cargado (antes `fileId`, CTR-DAT-30) | `storedFiles` (T01) |
| `status` | Enum | Sí | `cargado`, `validando`, `validado`, `conErrores`, `importando`, `importado`, `revertido` | — |
| `counters` | Object | Sí | `{ rows, valid, invalid, duplicates, conflicts, imported, invited, activated }` | — |
| `errors` | Array | No | `[{ row, code, message }]` (sin datos personales en claro) | — |
| `jobId` | String | No |  | `jobRuns` (T01) |
| `migrationRunId` | ObjectId | [VERIFICAR] | Corrida de migración de T07 que agrupa la importación; T05 (COL-POR-12) la declara y este anexo no la describía | `migrationRuns` (T07) |

### 7.13. `legacyPortalUserMap`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `importId` | ObjectId | Sí |  | `legacyPortalImports` (M19) |
| `legacyCodUser` | Int | Sí | `WS_USERS.COD_USER` | — |
| `userId` | ObjectId | No | Usuario T02 creado o existente | `memberships` (T02) |
| `emailNormalized` / `phoneE164` | String | No |  | — |
| `legacyValidatedAt` | Date | No | `WS_USERS.FEC_VALIDACION` | — |
| `status` | Enum | Sí | `pendiente`, `creado`, `fusionado`, `conflicto`, `invitado`, `activado`, `descartado` | — |
| `conflictReason` | String | No | Correo compartido por varias personas, documento no coincide… | — |

Índices: `{ tenantId: 1, legacyCodUser: 1 }` único; `{ tenantId: 1, status: 1 }`.

### 7.14. `kioskDevices`

Propósito: tótems de autogestión (PA-POR-06).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` / `name` | String | Sí |  | — |
| `branchId` | ObjectId | Sí | Sucursal | `branches` (T04) |
| `cashboxId` | ObjectId | Sí | Caja M07 asociada | `cashRegisters` (M07); antes `[VERIFICAR]` (T05 podría nombrar el campo `cashRegisterId`); T05 no declara otro nombre y se conserva `cashboxId` (PA-POR-22) |
| `capabilities` | [Enum] | Sí | `cobranza`, `prepaga`, `turnos` | — |
| `paymentMethods` | [Enum] | Sí | `tarjeta`, `qr`, `efectivo` | — |
| `defaultSearch` | Enum | Sí | `asociado`, `cuenta`, `documento`, `codigoQr` (VAR 2790) | — |
| `peripherals` | Object | No | `{ billReader: { agentEndpoint }, cardReader: {...}, printer: {...} }` (VAR 2351, 2352) vía agente local | — |
| `closeSecretHash` | String | Sí | Clave de cierre (VAR 2347) | — |
| `idleSeconds` | Int | Sí |  | — |
| `allowAdvance` | Boolean | Sí | Anticipo con excedente (`CrearAnticipo`) | — |
| `orientation` | Enum | Sí | `horizontal`, `vertical` (variantes `_Vertical` de INV) | — |
| `status` | Enum | Sí | `activo`, `fueraDeServicio`, `baja` | — |
| `lastHeartbeatAt` | Date | No |  | — |
| `localAgentId` | ObjectId | [VERIFICAR] | Agente local de T06 que maneja los periféricos (`peripherals`); T05 (COL-POR-14) lo declara y este anexo no lo describía | `localAgents` (T06) |

Índices: `{ tenantId: 1, code: 1 }` único.

### 7.15. Vistas de lectura consumidas (no son colecciones de POR)

| Vista | Dueño | Campos expuestos al portal |
|---|---|---|
| `accountSummary` | M01 + M07 + M08 | cuenta, titular (nombre), contratos, saldo vencido, saldo total, próximo vencimiento, `delinquencyState` (`alDia`, `moroso`, `suspendido`, `conBaja`) |
| `contractView` | M01/M02 | servicio, plan, domicilio de suministro, medidor, `serviceStatus`, fechas efectivas, equipo en comodato, adherentes, capacidades del servicio |
| `caseView` | M09 | número, tipo, `caseStatus`, línea de tiempo pública, plazo, mensajes no internos |
| `invoiceView` | M05 + M07 | comprobante, tipo, punto de venta, número, CAE, vencimientos (los vigentes, incluidos los corridos por autorización tardía con su marca `reason = lateAuthorization` de EVT-FAC-13; M05 RN-FAC-165, 10-11-2026), renglones por servicio, subtotales, saldo por servicio, pagos aplicados. Clave `invoiceId` (el número puede cambiar antes de la autorización, EVT-FAC-23); solo incluye comprobantes con `fiscalGate` `authorized` o `notRequired` en M07 (RF-POR-085; DEC-107; 10-11-2026) |
| `paymentView` | M07 | checkout, estado, medio, importe, imputación, recibo |
| `consumptionView` | M03 | períodos, consumo, unidad, lectura, tipo de lectura |
| `visitView` | M10 | franja, estado, técnico (nombre), ETA, resultado, conformidad |
| `payslipView` | M16 | período, neto, estado de firma, PDF |

## 8. Estados y transiciones

### 8.1. `portalAccountAccess.status`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `activo` | Sistema | Verificación suficiente (RN-POR-003) o migración con documento coincidente | Evento `por.accountAccess.granted`; aviso al titular (RN-POR-006) | Revocar |
| — | `pendienteVerificacion` | Sistema | Método requiere validación de operador (evidencia legal, asistida) | Tarea en bandeja PAN-POR-89 | Rechazo → `revocado` |
| — | `pendienteConfirmacionTitular` | Sistema | Vinculación por factura sin coincidencia de documento | Aviso al titular para confirmar | Vence a 7 días → `revocado` |
| `pendienteVerificacion` | `activo` | Operador | Evidencia validada | Evento `granted` | Revocar |
| `pendienteConfirmacionTitular` | `activo` | Titular | Confirma | Evento `granted` | Revocar |
| `activo` | `suspendido` | Operador/Sistema | Sospecha de fraude, titularidad en disputa, fallecimiento informado | Evento `por.accountAccess.suspended`; el usuario ve "Acceso en revisión" | Reactivar → `activo` |
| `suspendido` | `activo` | Operador | Revisión favorable | Evento `granted` | — |
| `activo` / `suspendido` | `revocado` | Titular, usuario (se desvincula), operador | — | Evento `por.accountAccess.revoked`; purga de caché y URL firmadas | Nueva vinculación |
| `activo` | `vencido` | Job `por:vencer-accesos` | `validTo` < ahora | Evento `por.accountAccess.expired` | Nueva invitación |
| `activo` | `revocado` | Sistema | Cambio de titularidad ejecutado en M01 (`per.ownership.changed`) para accesos `titular` del titular saliente | Aviso a ambos | — |

### 8.2. `portalDelegationInvites.status`

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `enviada` | Titular | Acceso con rol titular/cotitular | Mensaje con enlace al invitado |
| `enviada` | `aceptada` | Invitado | Token válido, usuario autenticado, documento coincide si se indicó | Crea `portalAccountAccess` rol `autorizado` |
| `enviada` | `rechazada` | Invitado | — | Aviso al titular |
| `enviada` | `vencida` | Job | 7 días sin respuesta | — |
| `enviada` / `aceptada` | `revocada` | Titular | — | Revoca el acceso asociado |

### 8.3. `landingPageVersions.status`

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `borrador` | Editor | — | — |
| `borrador` | `enRevision` | Editor | Validación de bloques OK (botón de baja presente si corresponde) | Notifica a publicadores |
| `enRevision` | `rechazada` | Publicador | Comentario obligatorio | Vuelve a edición como nuevo borrador |
| `enRevision` | `aprobada` | Publicador (`por.landing.publicar`) | — | — |
| `aprobada` | `programada` | Publicador | `scheduledAt` futura | Job programado |
| `aprobada` / `programada` | `publicada` | Publicador / job | — | La anterior pasa a `archivada`; evento `por.landing.published`; invalidación de CDN |
| `publicada` | `archivada` | Sistema | Otra versión publicada | — |
| `archivada` | `publicada` | Publicador | Reversión | Evento `por.landing.published` con `rollback: true` |

### 8.4. `portalForms.status`

Estado inicial: alta → `borrador` (PA-POR-22).

`borrador` → `publicado` (publicador; crea una versión inmutable en `formVersions` de T11 y actualiza `formVersionId`, PA-POR-21; antes crea `versions[n]` inmutable) → `retirado` (deja de ofrecerse; las presentaciones existentes siguen). `retirado` → `publicado` (republicación con nueva versión).

### 8.5. `portalFormSubmissions.status`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| (borrador en `portalDrafts`) | `enviada` | Usuario | Validación completa, T&C aceptados, `compareDocument` OK | Crea caso M09 (`openCase`), constancia, evento `por.formSubmission.submitted` | Cancelar |
| `enviada` | `observada` | Operador (M09) | Faltante o error | Aviso al socio con campos observados | Socio responde → `enviada` |
| `enviada` | `aceptada` | Operador o comando automático | Comando de ejecución OK | Adjuntos al expediente; adherentes; evento `por.formSubmission.accepted` | No (las correcciones son nuevo trámite) |
| `enviada` / `observada` | `rechazada` | Operador | Motivo obligatorio | Aviso | Nuevo trámite |
| `enviada` / `observada` | `cancelada` | Usuario | Sin ejecución iniciada (M09 lo confirma) | Libera visita reservada | — |

### 8.6. `publicSubmissions.status`

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `recibida` | Visitante | Captcha/antiabuso OK, datos mínimos | Código generado y mostrado en pantalla |
| `recibida` | `codigoEntregado` | Sistema | Evidencia de entrega por el medio informado (T09) | — ; si falla → tarea al operador |
| `codigoEntregado` | `identificada` | Sistema/Operador | Coincidencia con contrato (documento + cuenta/suministro/domicilio) | Caso M09 `solicitudBaja` con fecha = `receivedAt` |
| `codigoEntregado` | `derivada` | Operador | No identificable automáticamente | Caso M09 de identificación y contacto |
| `identificada` / `derivada` | `constanciaEmitida` | Sistema | Caso creado | Constancia PDF enviada por el mismo medio |
| `constanciaEmitida` | `cerrada` | Sistema | Caso M09 cerrado (baja ejecutada o desistida por el solicitante) | Aviso final |
| `recibida` | `descartadaSpam` | Operador | Evidencia de abuso, con motivo | Auditoría (nunca para una solicitud plausible) |

### 8.7. `legacyPortalImports.status`

`cargado` → `validando` → `validado` | `conErrores` → (`validado`) `importando` → `importado` → (opcional, dentro de 7 días y sin activaciones) `revertido`.

### 8.8. `kioskDevices.status`

Estado inicial: alta → `activo` (al registrar el dispositivo; PA-POR-22).

`activo` ↔ `fueraDeServicio` (heartbeat perdido > 5 min o periférico con error; vuelve al recuperar) → `baja`.

### 8.9. Presentación de estados ajenos (reglas de visibilidad)

**Estado del servicio** (de M01/M02; ProCoop `CONDICION` 1–4), mostrado con rail de color y etiqueta `dict:por.estadoServicio.*`:

| Estado dueño | Etiqueta socio | Color | Acciones disponibles |
|---|---|---|---|
| `pendienteAlta` | Pendiente de alta | Gris | Ver trámite, coordinar visita, cancelar |
| `activo` | Activo | Verde | Facturas, consumos, reclamar, cambiar plan, suspender, baja |
| `suspendidoPorSocio` | Suspendido a tu pedido hasta dd-mm-yyyy | Ámbar | Reactivar, baja |
| `suspendidoPorMora` | Suspendido por deuda | Rojo | Pagar, convenio, reclamar, baja |
| `suspendidoOtro` | Suspendido (motivo visible) | Rojo | Reclamar, baja |
| `bajaEnCurso` | Activo — baja solicitada para dd-mm-yyyy | Verde con marca | Ver trámite, desistir si se permite |
| `dadoDeBaja` | Dado de baja el dd-mm-yyyy | Gris oscuro | Facturas históricas, constancia, pagar saldo |

**Estado del trámite** (de M09), con badge y línea de tiempo `dict:por.estadoTramite.*`: `recibido`, `enRevision`, `observado` (requiere acción del socio), `factibilidad`, `aprobado`, `visitaCoordinada`, `enEjecucion`, `resuelto`, `rechazado`, `cancelado`, `cerrado`. Nunca se muestra un estado del trámite en el lugar del estado del servicio (RN-POR-012).

**Estado del pago** (de M07): `generado`, `pendienteConfirmacion`, `confirmado`, `imputado`, `comprobanteEnviado`, `rechazado`, `vencido` (cupón).

**Estado de visita** (de M10): `reservada`, `confirmada`, `tecnicoEnCamino`, `enCurso`, `realizada`, `fallida`, `sinAcceso`, `reprogramada`, `cancelada`.

### 8.10. Tablas de transiciones agregadas (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** se agregan tablas de transiciones para las colecciones cuyo §7 enumeraba estados sin transiciones (`landingPages`, `portalUserPreferences.installPromptState`, `portalBanners`, `legacyPortalUserMap`) y para `legacyPortalImports`, cuyo texto del §8.7 dejaba `revertido` sin una transición identificable. El texto del §8.7 se conserva. "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso; las transiciones sin respaldo explícito llevan `[VERIFICAR]`.

#### 8.10.1. `legacyPortalImports.status`

Estado inicial: `cargado`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `cargado` | Carga del volcado de CoopOnline | — | — |
| `cargado` | `validando` | Inicio de la validación | — | — |
| `validando` | `validado` | Validación sin errores | — | — |
| `validando` | `conErrores` | Validación con errores | — | — |
| `conErrores` | `validado` | Corrección y nueva validación | — | — |
| `validado` | `importando` | Confirmación de la importación | — | — |
| `importando` | `importado` | Fin de la importación | — | EVT-POR-13 `por.legacyImport.completed` |
| `importado` | `revertido` | Reversión opcional | Dentro de los 7 días y sin activaciones (§8.7) | — |

#### 8.10.2. `landingPages.status`

Estado inicial: `activa`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `activa` | Alta de la landing del tenant | — | — |
| `activa` | `suspendida` | Suspensión del tenant en T01 | — | — |
| `suspendida` | `activa` | Reactivación del tenant en T01 | — | — |

#### 8.10.3. `portalUserPreferences.installPromptState`

Estado inicial: `noMostrado`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `noMostrado` | Primer ingreso del usuario | — | — |
| `noMostrado` | `rechazado` | El usuario descarta la invitación a instalar la PWA | — | — |
| `noMostrado`, `rechazado` | `instalado` | Instalación de la PWA | — | — |

#### 8.10.4. `portalBanners.status`

Estado inicial: `borrador`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `borrador` | Carga del banner (RF-POR-052) | — | — |
| `borrador` | `activo` | Activación con vigencia `validFrom`/`validTo` | — | — |
| `activo` | `pausado` | Pausa manual | — | — |
| `pausado` | `activo` | Reanudación | — | — |
| `activo`, `pausado` | `vencido` | Vence `validTo` (job) `[VERIFICAR]` | — | — |

#### 8.10.5. `legacyPortalUserMap.status`

Estado inicial: `pendiente`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `pendiente` | Lectura del usuario de `WS_USERS` | — | — |
| `pendiente` | `creado` | Usuario T02 creado | — | — |
| `pendiente` | `fusionado` | Usuario T02 existente con el mismo correo o documento | — | — |
| `pendiente` | `conflicto` | Correo compartido o documento que no coincide (`conflictReason`) | — | — |
| `conflicto` | `creado`, `fusionado`, `descartado` | Resolución manual del conflicto `[VERIFICAR]` | — | — |
| `creado`, `fusionado` | `invitado` | Envío de la invitación de activación | — | — |
| `invitado` | `activado` | El usuario activa su cuenta | — | EVT-POR-14 `por.legacyUser.activated` |
| `pendiente` | `descartado` | Descarte manual `[VERIFICAR]` | — | — |

## 9. Procesos y flujos

### 9.1. Resolución de tenant y carga de marca (landing y PWA)

1. El navegador llega a `https://<slug>.<dominio>/` o a un dominio propio; el edge resuelve `slug` → `tenantId` con `landingPages` (único lugar donde el tenant no sale del token: solo para contenido público).
2. `GET /api/public/<tenantSlug>/bootstrap` devuelve marca (T03), diccionario público, versión publicada de la landing, oferta pública (M02), parámetros públicos del portal y estado del tenant.
3. Si el tenant está suspendido (T01) se muestra página de servicio no disponible con datos de contacto, salvo el **botón de baja**, que sigue operativo (RN-POR-077).
4. La PWA aplica `applyBrandingCssVars`, `applyTenantPwaIdentity` (manifest dinámico) y `applySystemChromeTheme` (CNX §3.2), con el ajuste de contraste de RN-POR-063.

### 9.2. Registro y primer ingreso (O2)

1. Visitante toca "Registrarme" (con `returnTo` del servicio elegido si venía de "Contratar").
2. T02 registra: correo o celular, contraseña (o Google/CiDi), verificación OTP; acepta términos (versión).
3. T02 crea pertenencia al tenant con perfil "portal socio"; emite `iam.identity.created` y `iam.membership.activated` (EVT-IAM-01/03).
4. POR crea `portalUserPreferences`, calcula rol `registrado` y muestra el inicio de usuario registrado (o retoma `returnTo`).
5. Si el correo/celular coincide con un `legacyPortalUserMap` en estado `invitado`, se ofrece "Ya usabas el portal de tu cooperativa: activá tu acceso" (flujo 9.4).

### 9.3. Vinculación de cuenta (O2)

1. Usuario abre "Vincular cuenta" (modal desde FAB en Mis cuentas). Elige método entre los habilitados (PRM-POR-010).
2. Ingresa datos; el cliente envía `POST /api/por/account-links` con `Idempotency-Key`.
3. Servidor verifica límites (RN-POR-005); calcula `inputFingerprint`; consulta M01 con los datos (sin revelar resultado parcial).
4. Si coincide y el método es suficiente → crea acceso `activo` con rol según relación en M01 (titular si el documento del perfil coincide con el titular; si no, `autorizadoConsulta` + `pendienteConfirmacionTitular`).
5. Si requiere evidencia (representante legal, persona jurídica) → `pendienteVerificacion` con `storedFileIds`; tarea en bandeja.
6. Si falla → respuesta genérica "No pudimos verificar los datos. Revisalos o pedí ayuda" con acción "Solicitar vinculación asistida" (RF-POR-037).
7. Evento `por.accountAccess.granted` → T09 avisa al titular (RN-POR-006).

### 9.4. Migración y activación de usuarios de CoopOnline (O6 piloto, O11 repetible)

1. Responsable carga el volcado (PAN-POR-92): `WS_USERS`, `WS_USERS_ACCOUNTS`, adhesiones a factura digital y débito, notificaciones vigentes.
2. Job `por:importar-usuarios-cooponline` valida: correo normalizado, celular E.164, duplicados, cuentas existentes en M01 (migradas por T07), coincidencia de documento del usuario con el titular cuando el dato existe.
3. Crea/fusiona usuarios en T02 **sin contraseña** (PA-POR-03): estado "pendiente de activación"; nunca se importa `WS_USERS.PASSWORD`.
4. Crea `portalAccountAccess` con `origin = migracionCoopOnline`: `titular` si el documento coincide; si no hay documento comparable, `autorizado` con acciones `consultar` y `pagar` (equivalente a lo que tenía) y marca de revisión.
5. Aplica adhesiones a factura digital y débito en M05/M07 (mismos canales).
6. Job `por:invitar-usuarios-migrados` envía invitación con plantilla del tenant (T09) y registra entrega.
7. El usuario entra con su correo/celular → OTP → define contraseña → ve sus cuentas. Estado `activado` en `legacyPortalUserMap`.
8. Informe de conciliación: filas del volcado = creados + fusionados + conflictos + descartados; vínculos del volcado = accesos creados + rechazados con motivo.
9. Reversión: dentro de 7 días y solo para usuarios no activados.

### 9.5. Contratación de un servicio (piloto Internet, O2–O3)

1. Desde la landing (ficha Internet) o el portal (Contratar), el usuario elige plan; si no tiene sesión, registro/ingreso y retorno.
2. Consulta de cobertura por domicilio (M10 `checkCoverage`), con alternativa sin mapa.
3. Asistente del formulario `INT-ALTA` (versión vigente): datos del titular (prellenados desde el perfil/M01), domicilio de instalación, plan, requisitos adjuntos, condición fiscal si se factura con CUIT, asociación si se exige, T&C y firma.
4. Borrador automático en cada paso (RN-POR-049).
5. Envío → `portalFormSubmissions.enviada` → `crm.openCase(caseTypeCode=serviceActivation)` (antes `crm.openCase(type=solicitudAlta)`: `solicitudAlta` es el `kind` del formulario de M19, no un tipo de caso; el tipo de caso de M09 es `serviceActivation` y la firma de `crm.openCase` está en M09 §11.5); constancia.
6. M09/M10 realizan factibilidad; cada cambio llega por `crm.case.statusChanged` y actualiza la línea de tiempo.
7. Con el caso aprobado y la capacidad "agenda", el portal ofrece "Coordinar visita" (9.6).
8. Tras la instalación, conformidad y encuesta (9.6 pasos 6–7).
9. `cat.contract.activated` → el contrato aparece "Activo" con fecha efectiva y primer cobro (RF-POR-055); si el usuario no tenía cuenta, M01 creó la cuenta y POR crea el acceso `titular` con `origin = altaPorTramite`.

### 9.6. Coordinación de visita e instalación (O3)

1. `GET /api/por/visits/slots?caseId=` → franjas de M10 compatibles.
2. El socio elige; `POST /api/por/visits` con `Idempotency-Key` → M10 reserva atómicamente (RN-POR-023); conflicto → 409 con nuevas franjas.
3. Recordatorio (job de T09 según preferencias).
4. Reprogramar/cancelar con reglas PRM-POR-092/093.
5. `tec.visit.statusChanged` con `status = enRoute` → aviso "El instalador está en camino" con ETA.
6. `tec.visit.statusChanged` con `status = completed` y resumen → el socio revisa tareas y equipo en comodato y firma (`POST /api/por/visits/:id/conformity`; firma manuscrita + aceptación con OTP opcional).
7. Encuesta de satisfacción (T09) sin bloquear.
8. `tec.visit.failed` (incluye motivo "sin acceso") → ofrecer reprogramar; el servicio sigue "Pendiente de alta" (RN-POR-021).

### 9.7. Consulta y pago de facturas (O4–O5)

1. Mis facturas → `GET /api/por/invoices?accountId=&status=` (filtros PRM-POR-030…035).
2. Detalle con apertura por servicio y explicación de conceptos.
3. Selección (carro si PRM-POR-049) → "Pagar".
4. `POST /api/por/checkouts` con `Idempotency-Key`: M07 recalcula deuda (RN-POR-026), valida mínimo (RN-POR-027), bloqueos (RN-POR-028), débito (RN-POR-041), recargos/percepciones (M08/M06) y devuelve resumen; si cambió, el portal muestra diferencias y pide confirmar.
5. El socio elige medio: pasarela (redirect o componente embebido), QR, o "cupón para efectivo" (PDF con código de barras, vencimiento PRM-POR-043).
6. Retorno de la pasarela → pantalla "Pendiente de confirmación" con polling corto (`GET /api/por/checkouts/:id`, cada 3 s hasta 60 s) y luego aviso push.
7. `cob.paymentIntent.statusChanged` con estado confirmado → "Confirmado"; `cob.payment.confirmed` (recibo e imputación) → "Imputado" + recibo; envío de recibo/factura de intereses (RN-POR-036) → "Comprobante enviado".
8. `cob.paymentIntent.statusChanged` con estado rechazado → "Rechazado" con motivo de la entidad y opción de reintentar (nueva clave de idempotencia).
9. Incierto (sin confirmación en el plazo de M07) → "En verificación"; no se permite pagar las mismas facturas por otro medio hasta conciliar (BASE §105 sol. 6: un pago incierto no se reenvía sin conciliar), salvo cupón en efectivo con aviso.

### 9.8. Pago por terceros (O5)

- **Autorizado con `pagar`**: igual que 9.7 dentro de las cuentas autorizadas; el checkout registra `onBehalfOfPersonId`.
- **Pagador eventual** (PA-POR-08): `POST /api/por/checkouts/by-code` con código de pago impreso/QR; solo devuelve importe, vencimiento y servicio genérico; el excedente sigue ESC-01 (RN-POR-030).

### 9.9. Baja pública (O2)

1. Visitante toca "Botón de baja" en la landing.
2. Elige servicio (solo servicios con capacidad botón de baja o todos si el tenant amplía).
3. Ingresa nombre, documento, número de cuenta o suministro si lo conoce, domicilio del servicio y medio de contacto. Sin registro, sin login, sin pago.
4. Antiabuso no obstructivo (captcha invisible; ante sospecha, verificación del medio por OTP, nunca bloqueo).
5. `POST /api/public/<tenantSlug>/unsubscribe-requests` → `publicSubmissions.recibida`, código mostrado en pantalla (RN-POR-015) y enviado por el medio informado.
6. Job `por:identificar-bajas-publicas` intenta identificar contrato (documento + cuenta/suministro/domicilio); éxito → caso M09 `solicitudBaja`; si no, caso de identificación.
7. Constancia emitida y enviada ≤ 72 h (job de control `por:controlar-plazos-baja-publica` cada 15 min alerta a las 20 h y 60 h).
8. Seguimiento por código en `/baja/seguimiento`.

### 9.10. Baja, suspensión y reactivación en sesión (O2/O6)

1. Desde el detalle del servicio, "Solicitar baja" / "Suspender" / "Reactivar".
2. El portal pide a M08/M02 las condiciones (`quoteServiceChange`): fecha efectiva posible, cargos habilitados (0 para baja), efectos (equipos a devolver, facturación de lo devengado).
3. El socio confirma (aceptación registrada); se crea la presentación del formulario correspondiente y el caso M09.
4. El servicio muestra "baja solicitada" hasta `cat.contract.terminated`.

### 9.11. Gestión (reclamo) con fotos y offline (O2)

1. FAB "+" → modal "Nueva gestión": tipo, servicio/contrato, descripción, fotos (cámara), ubicación opcional.
2. Sin señal: se guarda en la cola IndexedDB con `clientMutationId`; banner de pendientes.
3. Con señal: `POST /api/por/cases` (o `/api/por/sync` por lotes) → M09 `openCase`; si PRM-POR-074 y tipología técnica → OT M10.
4. Seguimiento, chat, conformidad, reapertura (PRM-POR-084), encuesta.

### 9.12. Autolectura (O7)

1. M03 abre la ventana de lectura del ciclo; T09 avisa a los socios con autolectura habilitada.
2. El socio fotografía el medidor; OCR propone el valor (IA propone); el socio confirma o corrige.
3. `POST /api/por/self-readings` → M03 `submitSelfReading` (lectura capturada con origen `socio`, foto, geolocalización si la dio).
4. M03 valida (rango, consumo histórico); estado `aceptada` / `enRevision` / `rechazada` con motivo, visible en Consumos.

### 9.13. Recarga prepaga (O7)

1. Elegir servicio prepago → importe (mínimo, múltiplos) → `POST /api/por/prepaid/quotes` (M03/M07): capital, recargo, bonificación, retención, energía equivalente.
2. Confirmar → checkout tipo `prepaga` con TTL (RN-POR-033).
3. Confirmación → M03 acredita y devuelve token/crédito; factura de autogestión enviada (RN-POR-036).

### 9.14. Representación (O5)

1. Titular → Representaciones → "Autorizar a alguien" (modal): contacto del invitado, cuentas/contratos, acciones, vigencia.
2. `POST /api/por/delegations` → invitación con token.
3. Invitado ingresa/registra, acepta → acceso `autorizado`.
4. Titular puede revocar en cualquier momento; job vence accesos.

### 9.15. Portal del empleado (O9)

1. Usuario con legajo M16 y pertenencia de empleado ve el selector de espacio; elige "Mi trabajo".
2. Se limpia el store de socio; se carga menú de empleado; paso de reautenticación si corresponde (RF-POR-136).
3. Recibos: lista → detalle → firma (OTP + hash del PDF, PA-POR-11) → descarga (reglas 3122/3166).
4. Vacaciones/licencias: formulario → workflow M16/T11 → estados.

### 9.16. Tótem (O10, PA-POR-06)

1. Tótem arranca en modo kiosco con su credencial de dispositivo; heartbeat cada 60 s.
2. Inicio con mosaicos → identificación (método por defecto 2790) → deuda/selección o recarga → medio de pago (agente local para lector de tarjeta/billetes; QR) → registro en la caja del dispositivo (M07) → comprobante impreso o por correo → vuelta al inicio y borrado de datos.
3. Cierre administrativo con clave del dispositivo.

### 9.17. Jobs del módulo

| Job | Frecuencia | Descripción | Idempotencia / recuperación |
|---|---|---|---|
| `JOB-POR-01` `por:vencer-borradores` | Diario 03:00 | Avisa 3 días antes y purga borradores vencidos y sus adjuntos | Por documento; reanudable por cursor |
| `JOB-POR-02` `por:vencer-accesos` | Cada hora | Pasa a `vencido` accesos e invitaciones vencidos; emite eventos | Condición de estado en el update |
| `JOB-POR-03` `por:identificar-bajas-publicas` | Al recibir + cada 15 min | Intenta identificar contratos y crear casos M09 | Clave `publicSubmissionId` |
| `JOB-POR-04` `por:controlar-plazos-baja-publica` | Cada 15 min | Alerta código sin entregar a 20 h, constancia a 60 h; reintenta envío por canal alternativo | Sin efectos duplicados (flags de alerta) |
| `JOB-POR-05` `por:importar-usuarios-cooponline` | A demanda | Valida e importa volcado | Por fila con `legacyCodUser`; reanudable |
| `JOB-POR-06` `por:invitar-usuarios-migrados` | A demanda, en tandas de 500/hora | Envía invitaciones | Marca `invitado` por usuario |
| `JOB-POR-07` `por:publicar-landing-programada` | Cada minuto | Publica versiones `programada` vencidas | Transición condicional |
| `JOB-POR-08` `por:purgar-intentos-vinculacion` | Continua (índice TTL de MongoDB) | Reemplazado por el índice TTL en `portalLinkAttempts.expiresAt` (§7.4): MongoDB borra los intentos a los 90 días y no hay job de BullMQ ni cola. El ID se conserva para no renumerar. | No aplica: el borrado lo hace el motor |
| `JOB-POR-09` `por:metricas-portal` | Diario 04:00 | Calcula indicadores del §15 para T10 | Recalculable por fecha |
| `JOB-POR-10` `por:vencer-banners` | Cada hora | Pasa banners a `vencido` | — |
| `JOB-POR-11` `por:heartbeat-totems` | Cada minuto | Marca `fueraDeServicio` sin heartbeat 5 min y alerta | — |
| `JOB-POR-12` `por:recordar-acciones-pendientes` | Diario 10:00 | Recordatorios de trámites observados, conformidades sin firmar y recibos sin firmar | Una vez por objeto y día |

## 10. Pantallas

> **Corrección 05-11-2026 (capabilities de pantallas):** las fichas que indicaban "Pública", "Sesión", "Dispositivo" o una regla en texto libre en la columna Capability usan ahora `public: true` o una capability `modulo.recurso.accion` de la convención de T02. El valor anterior queda entre paréntesis como "antes: …". Las pantallas y endpoints de empleado usan los nombres de capability que define M16, dueño del recurso (`sue.portal.*`). Según la regla AL-01 de T03, prevalece este anexo y T03 se ajusta.

### 10.1. Patrones de layout aplicados

- **Landing** (`apps/landing`, Vue 3 SSR/SSG por tenant para SEO y velocidad): encabezado con logo del tenant, navegación (Servicios, Noticias, Trámites, Ayuda, Contacto), botones "Ingresar" y "Registrarme", **botón de baja** en encabezado móvil (menú) y pie; contenido por bloques; pie legal. Tema claro por defecto para lectura pública con tokens de marca del tenant (T03); contraste validado (RN-POR-063).
- **PWA** (`apps/pwa`): `AppShell` CNX §3.3 con topbar (menú · logo tenant · selector de cuenta · avisos con badge · ayuda), banners (rol, encuestas pendientes, pendientes sin conexión), contenido con H1 + subtítulo, tabbar. Piel `.pwa-mod` oscura por defecto con alternativa clara y alto contraste (CTR-POR-12). "Phone shell" de 430 px en escritorio con vista ancha opcional para facturas, consumos y gestiones (PA-POR-07). Cards de listado con anatomía fija (rail de estado, ícono, título sin truncar, badge, dato principal, 2–4 meta-tags, chevron); altas en modal desde FAB; 3 skeleton cards; errores inline; fecha `dd-mm-yyyy`.
- **Tabbar por espacio**: socio = Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad, con Perfil desde el avatar de la topbar y FAB = Pagar por defecto; en la tabbar el destino "Cuentas y servicios" usa el rótulo corto **"Cuentas"** (RN-UXD-006, máximo 12 caracteres; el título de la pantalla sigue siendo "Cuentas y servicios"; PA-POR-22) (PA-POR-20; T03 RF-UXD-066 y CTR-UXD-12; antes Inicio · Servicios · (+) · Facturas · Perfil; Facturas se abre desde Cuentas y servicios y desde el FAB Pagar); Comunidad abre PAN-POR-105; empleado = Inicio · Recibos · (+) · Solicitudes · Perfil; registrado sin cuenta = Inicio · Contratar · (+) · Gestiones · Perfil. La acción del FAB cambia por pantalla (`useCreateAction`): en Gestiones "Nueva gestión", en Cuentas "Vincular cuenta", en Servicios "Contratar", en Representaciones "Autorizar", en Licencias "Solicitar licencia".
- **Admin** (`apps/admin`): `AdminShell`, `AdminStickyHeader`, `ScreenHelp`, `DataTable`, modales `sm/md/lg/xl`, previsualización "celular" (CNX §4).
- **Tótem**: PWA en modo kiosco, tipografía y objetivos táctiles ampliados (mín. 48 px), variante horizontal y vertical (INV `_Vertical`), sin teclado físico (teclado en pantalla accesible).

### 10.2. Mapa del sitio — Landing pública (`https://<slug>.<dominio>/`)

```
/                               PAN-POR-01 Portada (bloques)
├── /servicios                  PAN-POR-02 Servicios habilitados
│   └── /servicios/:serviceCode PAN-POR-03 Ficha del servicio  → "Contratar" → /registro?returnTo=/app/tramites/nuevo/:formCode
├── /cobertura                  PAN-POR-04 Consulta de cobertura por domicilio
├── /noticias                   PAN-POR-05 Noticias
│   └── /noticias/:slug         PAN-POR-06 Noticia
├── /avisos-de-corte            PAN-POR-07 Interrupciones programadas
├── /tramites                   PAN-POR-08 Trámites y requisitos (PDF / formularios)
├── /baja                       PAN-POR-09 Botón de baja (sin registro)
│   ├── /baja/recibida/:code    PAN-POR-10 Baja recibida — código identificador
│   └── /baja/seguimiento       PAN-POR-11 Seguimiento por código
├── /pagar                      PAN-POR-12 Consulta y pago sin login (PA-POR-02)
│   └── /pagar/codigo           PAN-POR-22 Pago por código (pagador eventual)
├── /contacto                   PAN-POR-13 Contacto / consulta
├── /sucursales                 PAN-POR-14 Sucursales, horarios y canales
├── /ayuda                      PAN-POR-15 Preguntas frecuentes
├── /legal/:tipo                PAN-POR-16 Términos, privacidad, accesibilidad, T&C por servicio
├── /e/:token                   PAN-POR-17 Encuesta externa
├── /registro                   PAN-POR-18 Registro
├── /ingresar                   PAN-POR-19 Ingresar (+ /recuperar, /restablecer/:token)
├── /activar                    PAN-POR-20 Activación de usuario migrado de CoopOnline
├── /cementerio/buscar          PAN-POR-104 Buscar difunto (solo si PRM-SOC-050; HUECO-CEM-02)
├── /sitemap.xml, /robots.txt, /noticias.rss
└── (legado) rutas de CoopOnline → 301 a su equivalente (RF-POR-020)

https://<dominio>/cooperativas  PAN-POR-21 Selector de cooperativa (plataforma)
```

### 10.3. Mapa del sitio — PWA (`https://<slug>.<dominio>/app`)

```
/app                                   PAN-POR-23 Splash + selector de espacio (Socio / Mi trabajo / Campo) y de ámbito
/app/terminos                          PAN-POR-24 Aceptación de términos (guard)
── Espacio SOCIO ─────────────────────────────────────────────────────────
/app/inicio                            PAN-POR-25 Inicio por rol (registrado, activo, moroso, suspendido, con baja, representante)
/app/cuentas                           PAN-POR-26 Mis cuentas            [FAB: Vincular cuenta → PAN-POR-27]
/app/cuentas/:accountId                PAN-POR-28 Detalle de cuenta
/app/cuentas/:accountId/movimientos    PAN-POR-43 Cuenta corriente / resumen
/app/servicios                         PAN-POR-29 Mis servicios          [FAB: Contratar → PAN-POR-31]
/app/servicios/:contractId             PAN-POR-30 Detalle del servicio
/app/servicios/:contractId/adherentes  PAN-POR-67 Adherentes
/app/servicios/:contractId/llamadas    PAN-POR-103 Detalle de llamadas por período (TEL; HUE-TEL-02)
/app/servicios/:contractId/:accion     PAN-POR-37 Baja / suspensión / reactivación / cambio de plan
/app/ddjj/:contractId                  PAN-POR-66 Declaraciones juradas
/app/contratar                         PAN-POR-31 Catálogo para contratar
/app/tramites/nuevo/:formCode          PAN-POR-32 Asistente de formulario
/app/gestiones                         PAN-POR-50 Mis gestiones (reclamos, consultas, trámites)  [FAB: Nueva gestión → PAN-POR-51]
/app/gestiones/:caseId                 PAN-POR-33 Detalle de trámite/gestión
/app/visitas/coordinar/:caseId         PAN-POR-34 Coordinar visita
/app/visitas/:visitId                  PAN-POR-35 Detalle de visita (instalador en camino)
/app/visitas/:visitId/conformidad      PAN-POR-36 Conformidad de instalación
/app/facturas                          PAN-POR-38 Mis facturas
/app/facturas/:invoiceId               PAN-POR-39 Detalle de factura
/app/pagar                             PAN-POR-40 Pagar (selección, cupón, medio)
/app/pagos                             PAN-POR-42 Mis pagos
/app/pagos/:checkoutId                 PAN-POR-41 Resultado del pago
/app/debito-automatico                 PAN-POR-44 Débito automático
/app/factura-digital                   PAN-POR-45 Factura digital
/app/convenios                         PAN-POR-46 Convenios y cuotas
/app/consumos(/:contractId)            PAN-POR-47 Consumos y gráficos
/app/autolectura/:contractId           PAN-POR-48 Autolectura con foto
/app/prepaga                           PAN-POR-49 Recarga prepaga
/app/turnos                            PAN-POR-52 Turnos de atención
/app/avisos                            PAN-POR-53 Bandeja de avisos
/app/avisos-de-corte                   PAN-POR-68 Interrupciones que me afectan
/app/comunidad                         PAN-POR-105 Comunidad (tabbar; agrega muro, encuestas y novedades)
/app/encuestas(/:id)                   PAN-POR-54 Encuestas
/app/muro(/:id)                        PAN-POR-55 Muro de socios
/app/novedades(/:id)                   PAN-POR-56 Novedades y boletines
/app/representaciones                  PAN-POR-57 Representaciones  [FAB: Autorizar a alguien → PAN-POR-58]
/app/invitacion/:token                 PAN-POR-58 Aceptar invitación
/app/constancias                       PAN-POR-64 Constancias y documentos
/app/borradores                        PAN-POR-63 Mis borradores
/app/perfil                            PAN-POR-59 Perfil y datos
/app/perfil/comunicaciones             PAN-POR-60 Preferencias de comunicación
/app/perfil/seguridad                  PAN-POR-61 Seguridad (T02)
/app/perfil/apariencia                 PAN-POR-62 Accesibilidad y apariencia
/app/ayuda                             PAN-POR-65 Ayuda y contacto
/app/mi-grupo                          PAN-POR-98 Mi grupo y coberturas (embebe PAN-SOC-30; HUE-SRV-04)
/app/solicitudes-sociales              PAN-POR-99 Solicitudes sociales (embebe PAN-SOC-31)
/app/cementerio                        PAN-POR-100 Mis derechos de sepultura (embebe PAN-SOC-32)
/app/vivienda                          PAN-POR-101 Mi plan de vivienda (embebe PAN-SOC-33)
/app/mi-asociacion                     PAN-POR-102 Mi asociación (embebe PAN-INS-30)
── Espacio EMPLEADO ──────────────────────────────────────────────────────
/app/empleado                          PAN-POR-69 Inicio del empleado
/app/empleado/recibos                  PAN-POR-70 Recibos de sueldo
/app/empleado/recibos/:id              PAN-POR-71 Recibo y firma
/app/empleado/vacaciones               PAN-POR-72 Vacaciones   [FAB: Solicitar]
/app/empleado/licencias                PAN-POR-73 Licencias    [FAB: Solicitar]
/app/empleado/legajo                   PAN-POR-74 Mi legajo
/app/empleado/equipo                   (sin PAN-POR; incrusta PAN-SUE-44 de M16) Mi equipo (encargado), acceso desde PAN-POR-69
/app/empleado/certificados             (sin PAN-POR; incrusta PAN-SUE-45 de M16) Mis certificados, acceso desde PAN-POR-69
/app/empleado/evaluaciones             (sin PAN-POR; incrusta PAN-SUE-46 de M16) Mis evaluaciones, acceso desde PAN-POR-69
/app/empleado/muro                     PAN-POR-75 Muro interno
/app/empleado/avisos                   PAN-POR-76 Avisos del empleado
── Espacio CAMPO ─────────────────────────────────────────────────────────
/app/campo                             PAN-POR-77 Redirección a la app de campo (M10/M03/M07)
── Modo TÓTEM ────────────────────────────────────────────────────────────
/totem                                 PAN-POR-78 Inicio con mosaicos
/totem/identificar                     PAN-POR-79 Identificación
/totem/deuda                           PAN-POR-80 Deuda y selección
/totem/pago                            PAN-POR-81 Medio de pago
/totem/prepaga                         PAN-POR-82 Recarga prepaga
/totem/fin                             PAN-POR-83 Comprobante
```

**Menú hamburguesa (socio)**, grupos declarativos con capability: *Mi cuenta* (Inicio, Mis cuentas, Mis servicios, Contratar, Representaciones); *Facturas y pagos* (Facturas, Pagar, Pagos, Débito automático, Factura digital, Convenios, Recarga prepaga); *Consumos* (Consumos, Autolectura); *Gestiones* (Mis gestiones, Turnos, Constancias, Borradores); *Servicios sociales* (Mi grupo, Solicitudes sociales, Cementerio, Vivienda, Mi asociación; HUE-SRV-04); *Comunidad* (Muro, Novedades, Encuestas, Avisos de corte); *Perfil* (Datos, Comunicaciones, Seguridad, Apariencia, Ayuda, Cambiar de espacio/cooperativa, Salir). Cada ítem se oculta si el parámetro o la capability no aplica.

**Allowlist por rol de inicio** (menú recortado, CNX §3.8): registrado → Inicio, Contratar, Vincular, Gestiones (consultas y trámites de alta), Comunidad, Perfil; autorizadoConsulta → sin Pagar ni gestiones; pagador eventual → solo `/pagar/codigo`.

### 10.4. Mapa del sitio — Administración del portal (`apps/admin`, cluster "Canales digitales")

```
Canales digitales
├── Portal y app del socio
│   ├── Configuración del portal          PAN-POR-84
│   ├── Formularios por servicio           PAN-POR-87 → PAN-POR-88
│   ├── Presentaciones de formularios      PAN-POR-97
│   ├── Banners por rol                    PAN-POR-93
│   └── Métricas del portal                PAN-POR-94
├── Landing
│   ├── Editor de landing                  PAN-POR-85
│   └── Versiones y publicación            PAN-POR-86
├── Accesos de socios
│   ├── Vinculaciones pendientes           PAN-POR-89
│   ├── Accesos de una cuenta              PAN-POR-90 (también desde la ficha de cuenta M01)
│   └── Ver como socio                     PAN-POR-95 (desde ficha de cuenta)
├── Recepción pública (bajas y contactos)  PAN-POR-91
├── Tótems de autogestión                  PAN-POR-96
└── Migración CoopOnline                   PAN-POR-92
```

### 10.5. Fichas de pantallas — Landing

| PAN | App | Ruta | Capability | Propósito y contenido | Acciones y modales | Vacío / ayuda | Equivalencia ProCoop |
|---|---|---|---|---|---|---|---|
| PAN-POR-01 | landing | `/` | `public: true` (antes: Pública) | Portada por bloques de la versión publicada: hero (título y texto `dict:`), accesos rápidos (Ingresar, Registrarme, Pagar, Botón de baja, Pedir turno), servicios destacados, noticias recientes (3), avisos de corte vigentes, trámites, FAQ, contacto, pie legal con botón de baja | Navegar; "Contratar" por servicio | Si no hay noticias, el bloque no se muestra | Página CoopOnline (VAR_PMOVIL 65 cabecera, 912 texto web) |
| PAN-POR-02 | landing | `/servicios` | `public: true` (antes: Pública) | Cards de servicios habilitados (ícono, nombre, resumen, desde ARS X) | Filtrar por categoría (Energía, Agua, Conectividad, Sociales) | "Pronto sumaremos servicios" | — |
| PAN-POR-03 | landing | `/servicios/:serviceCode` | `public: true` (antes: Pública) | Descripción, planes con precio final, requisitos, documentación, cobertura, condiciones, T&C, FAQ | "Contratar" (→ registro/ingreso con `returnTo`), "Consultar cobertura", descargar requisitos | Servicio no ofertado → 404 amable con lista de servicios | — |
| PAN-POR-04 | landing | `/cobertura` | `public: true` (antes: Pública) | Calle (autocompletado), altura, localidad; resultado por servicio; mapa opcional | Consultar; "Contratar" si hay cobertura | Ayuda "No encontrás tu calle? Escribila y la verificamos" | — |
| PAN-POR-05 | landing | `/noticias` | `public: true` (antes: Pública) | Lista de noticias públicas (T09 canal landing) con imagen, título, fecha | Paginación | "Todavía no hay noticias" | `WEB_NOVEDADES`, `RSSFEED` |
| PAN-POR-06 | landing | `/noticias/:slug` | `public: true` (antes: Pública) | Noticia completa, imágenes con texto alternativo | Compartir | — | `WEB_NOVEDADES` |
| PAN-POR-07 | landing | `/avisos-de-corte` | `public: true` (antes: Pública) | Interrupciones programadas por zona/servicio con fecha y horario | Filtrar por localidad/servicio | "No hay cortes programados" | — |
| PAN-POR-08 | landing | `/tramites` | `public: true` (antes: Pública) | Formularios publicados (`audience` público/registrado/conAcceso) con descripción y requisitos; PDF descargables | Descargar PDF; "Iniciar" (pide sesión si corresponde) | — | Procoop WEB "Requisitos y Trámites", "Archivos en la Web" (DFA M26) |
| PAN-POR-09 | landing | `/baja` | `public: true` (antes: Pública) | Paso 1 servicio; paso 2 identificación (nombre, documento, cuenta/suministro opcional, domicilio); paso 3 medio de contacto; resumen; leyenda "La solicitud de baja no tiene costo" | Enviar; ayuda "¿Qué pasa después?" | — | No existía |
| PAN-POR-10 | landing | `/baja/recibida/:code` | `public: true` (antes: Pública (token de sesión efímero)) | Código identificador grande, fecha y hora de recepción, medio por el que se envió, próximos pasos y plazos | Copiar código, descargar comprobante de recepción | — | — |
| PAN-POR-11 | landing | `/baja/seguimiento` | `public: true` (antes: Pública) | Código + documento → estado y fechas (sin datos privados) | Consultar | Respuesta genérica si no coincide | — |
| PAN-POR-12 | landing | `/pagar` | `public: true` (antes: Pública (si PRM-POR-052)) | Número de cuenta + verificador → comprobantes impagos enmascarados (servicio, período, vencimiento, importe). Componente embebido: PAN-FAC-45 de M05 (§10.6.A) | Seleccionar y pagar (checkout invitado), descargar cupón | "No encontramos comprobantes impagos para esos datos" | VAR_PMOVIL 60, 61 "facturas sin login" |
| PAN-POR-13 | landing | `/contacto` | `public: true` (antes: Pública) | Motivo, mensaje, contacto, adjunto opcional | Enviar → caso M09 consulta | — | VAR 812 "Mail para contactos" |
| PAN-POR-14 | landing | `/sucursales` | `public: true` (antes: Pública) | Sucursales, horarios, teléfonos, WhatsApp, cómo llegar (texto + mapa opcional) | Llamar, abrir mapa | — | — |
| PAN-POR-15 | landing | `/ayuda` | `public: true` (antes: Pública) | Preguntas frecuentes por tema del tenant | Buscar | — | — |
| PAN-POR-16 | landing | `/legal/:tipo` | `public: true` (antes: Pública) | Documento legal vigente con versión y fecha | Descargar PDF | — | — |
| PAN-POR-17 | landing | `/e/:token` | `public: true` (antes: Pública con token) | Encuesta T09 | Responder | Token vencido/usado: mensaje | — |
| PAN-POR-18 | landing | `/registro` | `public: true` (antes: Pública) | Correo o celular, contraseña (o Google/CiDi), aceptación de términos; OTP | Registrarme | Ayuda de formato bajo cada campo | — (no existía registro sin cuenta) |
| PAN-POR-19 | landing | `/ingresar`, `/recuperar`, `/restablecer/:token` | `public: true` (antes: Pública) | Login T02 con marca del tenant; enlace de referencia configurable | Ingresar, recuperar | Errores específicos sin enumeración | Login web CoopOnline (VAR_PMOVIL 34) |
| PAN-POR-20 | landing | `/activar` | `public: true` (antes: Pública) | Usuario migrado: correo/celular → OTP → nueva contraseña → bienvenida "Encontramos tus N cuentas" | Activar | Si no figura: "Registrate como nuevo usuario" | `WS_USERS` |
| PAN-POR-21 | plataforma | `/cooperativas` | `public: true` (antes: Pública) | Buscador de cooperativas por nombre/localidad | Ir a la landing | — | Número de cliente del proveedor |
| PAN-POR-22 | landing | `/pagar/codigo` | `public: true` (antes: Pública) | Código de pago (o lectura de QR/código de barras) → importe, vencimiento, servicio genérico | Pagar | Código inexistente/vencido: mensaje genérico | Pago con código de barras/QR de tercero |
| PAN-POR-104 | landing | `/cementerio/buscar` | `public: true` (antes: Pública (solo si PRM-SOC-050 = true; HUECO-CEM-02)) | Buscar difunto: apellido y nombre (mínimo 3 caracteres), establecimiento si hay más de uno; resultado con nombre, fecha de inhumación (año) y ubicación (cementerio, sector, unidad) desde API-SOC-061 vía API-POR-124; sin documento ni datos del titular del derecho (RF-POR-177) | Buscar; "Cómo llegar" al establecimiento | "No encontramos coincidencias: verificá el nombre o consultá en la administración"; con PRM-SOC-050 = false la ruta responde "no disponible" | — (no existía) |

### 10.6. Fichas de pantallas — PWA socio

| PAN | App | Ruta | Capability | Propósito y contenido | Acciones y modales | Vacío / ayuda | Equivalencia ProCoop |
|---|---|---|---|---|---|---|---|
| PAN-POR-23 | pwa-socio | `/app` | `por.portal.ver` (antes: Sesión) | Splash con logo del tenant; si hay varios ámbitos/espacios, selector; oferta de instalar | Elegir espacio/ámbito | — | Ingreso CoopOnline/PWeb |
| PAN-POR-24 | pwa-socio | `/app/terminos` | `por.portal.ver` (antes: Sesión) | Documento nuevo con cambios resaltados | Aceptar (obligatorio para continuar), descargar | — | — |
| PAN-POR-25 | pwa-socio | `/app/inicio` | `por.portal.ver` | Variante por rol (§10.8): saldo/vencimiento, acciones rápidas, trámites en curso, visitas, avisos, encuestas, muro destacado, banners | Pagar, Reclamar, Contratar, Coordinar visita, cambiar cuenta | Registrado: "Contratá tu primer servicio o vinculá tu cuenta" | Inicio CoopOnline |
| PAN-POR-26 | pwa-socio | `/app/cuentas` | `por.portal.ver` | Cards de cuentas: número, titular, rol de acceso, servicios, saldo, badge de estado | FAB Vincular; marcar por defecto; desvincular (ConfirmSheet) | "Todavía no vinculaste cuentas" + Vincular | "Agregar cuentas" (VAR_PMOVIL 5, 6) |
| PAN-POR-27 | pwa-socio | `/app/cuentas/vincular` (modal) | `por.cuentas.vincular` | Método (pestañas): Código de socio y clave; Suministro y documento; Datos de factura; Código al contacto del titular (RF-POR-179); Identidad verificada; Código de invitación. Textos configurables. Métodos según DEC-043 | Vincular; "Solicitar vinculación asistida" | Ayuda con imagen de dónde está cada dato en la factura | VAR_PMOVIL 6, 7, 8, 9 |
| PAN-POR-28 | pwa-socio | `/app/cuentas/:accountId` | `por.servicios.ver` | Titular, domicilio postal, servicios, saldo, accesos de terceros (si soy titular), adhesiones | Ver movimientos, Pagar, Autorizar a alguien | — | Ficha de cuenta web |
| PAN-POR-29 | pwa-socio | `/app/servicios` | `por.servicios.ver` | Cards por contrato: servicio, plan, domicilio, **estado del servicio** (rail) y **badge de trámite** en curso | Filtrar por cuenta/estado; FAB Contratar | "No tenés servicios activos" + Contratar | `GetDetalleServicios` |
| PAN-POR-30 | pwa-socio | `/app/servicios/:contractId` | `por.servicios.ver` | Plan, domicilio, medidor, alta/baja, fecha efectiva, primer cobro, equipo en comodato (serie), adherentes, DDJJ, trámites, OT; bloque **"Plan de cuotas de obra"** en contratos de obra: cuota n/N, saldo, unidades facturadas/totales y próxima cuota estimada, solo lectura desde API-TAR-066 vía API-POR-123 (RF-POR-176, HUECO-OBR-03). Componentes embebidos: PAN-CAT-22 (detalle del contrato) y PAN-STK-40 (sección "Equipos") (§10.6.A) | Cambiar plan, Suspender, Reactivar, Baja, Reclamar, Consumos, Autolectura, Mi Medidor, Detalle de llamadas (TEL → PAN-POR-103) | Advertencia de DDJJ no presentada (VAR_PMOVIL 59) | `GetDetalleServicios`, `GetURLMiMedidorDiscar` |
| PAN-POR-31 | pwa-socio | `/app/contratar` | `por.servicios.contratar` | Catálogo habilitado con planes; aviso de deuda vencida si PRM-POR-071 | Elegir plan → PAN-POR-32 | — | "Alta desde CoopOnline" (DFA M26) |
| PAN-POR-32 | pwa-socio | `/app/tramites/nuevo/:formCode` | `por.gestiones.crear` (además, `audience` y `requiredAction` del formulario) (antes: Según `audience`/`requiredAction`) | Asistente por pasos con barra de progreso, campos del formulario, adjuntos, T&C, firma; resumen final | Siguiente/Anterior, Guardar y salir, Enviar | Recuperación de borrador "Retomá donde dejaste" | `REQUISITOS`/`REQUISITOS_ITEMS` |
| PAN-POR-33 | pwa-socio | `/app/gestiones/:caseId` | `por.gestiones.crear` o titular del caso | Número, tipo, estado, línea de tiempo, plazo, mensajes, adjuntos, observaciones a responder, visita y OT vinculadas. Componente embebido: PAN-TEC-59 de M10 (seguimiento de factibilidad) (§10.6.A) | Responder observación, enviar mensaje, adjuntar, cancelar, conformidad/rechazo, reabrir, encuesta | — | Seguimiento de trámite/reclamo web |
| PAN-POR-34 | pwa-socio | `/app/visitas/coordinar/:caseId` | `por.visitas.gestionar` | Días disponibles y franjas (lista accesible; calendario opcional). Componentes embebidos: PAN-TEC-57 (coordinación de visita) y PAN-TEC-59 (estado de factibilidad) de M10 (§10.6.A) | Reservar (ConfirmSheet) | "No hay franjas en los próximos 14 días: te contactaremos" | — |
| PAN-POR-35 | pwa-socio | `/app/visitas/:visitId` | `por.visitas.gestionar` | Fecha/franja, estado, técnico (nombre), ETA, instrucciones de preparación, resultado. Componentes embebidos: PAN-TEC-58 (seguimiento de la visita) y PAN-TEC-59 (estado de factibilidad) de M10 (§10.6.A) | Reprogramar, cancelar, llamar | — | — |
| PAN-POR-36 | pwa-socio | `/app/visitas/:visitId/conformidad` | `por.visitas.gestionar` + acción `firmar` | Resumen de tareas, equipo en comodato con serie, fotos, observaciones públicas | Firmar (trazo + nombre + OTP opcional), "No estoy conforme" (abre gestión) | — | — |
| PAN-POR-37 | pwa-socio | `/app/servicios/:contractId/:accion` | `por.servicios.solicitarBaja` / `por.servicios.suspender` | Condiciones: fecha efectiva elegible, costo habilitado (ARS 0 en baja), efectos, equipos a devolver; aceptación. Componente embebido para suspensión y reactivación voluntarias: PAN-MOR-41 de M08 (§10.6.A). Botón de baja habilitado en Internet, TV y telefonía y configurable en los demás servicios, con código de seguimiento en 24 h (DEC-057) | Confirmar | — | — |
| PAN-POR-38 | pwa-socio | `/app/facturas` | `por.facturas.ver` | Pestañas Adeudadas / Todas; cards: servicio(s), período, vencimiento, importe, saldo, estado; agrupadas por vencimiento si PRM-POR-035; carro. Componente embebido: PAN-FAC-43 de M05 (§10.6.A) | Filtrar (cuenta, servicio, período); seleccionar; Pagar | Estado vacío ilustrado "No tenés facturas adeudadas" | Facturas CoopOnline (VAR_PMOVIL 71, 913, 45) |
| PAN-POR-39 | pwa-socio | `/app/facturas/:invoiceId` | `por.facturas.ver` | Encabezado fiscal, vencimientos, **apertura por servicio** (renglones, lecturas, conceptos, tributos, subtotal, pagado, saldo), explicación por concepto, pagos aplicados, observación configurable. Componente embebido: PAN-FAC-44 de M05 (§10.6.A) | Descargar PDF, Pagar, Reclamar por esta factura | PDF bloqueado: "Consultá en la cooperativa" | `GetlstFacturas`, VAR_PMOVIL 35, 17 |
| PAN-POR-40 | pwa-socio | `/app/pagar` | `por.pagos.crear` | Facturas seleccionadas, recargos al día o diferidos, percepciones, total, regla de imputación, medios disponibles, vista previa (VAR_PMOVIL 14) | Pagar con pasarela, QR, cupón efectivo; quitar facturas | Mínimo no alcanzado: error inline | `crearCobranza`, `ctrlCobranza_Seleccion` |
| PAN-POR-41 | pwa-socio | `/app/pagos/:checkoutId` | `por.pagos.crear` | Estado (stepper: generado → pendiente → confirmado → imputado → comprobante enviado), importe, medio, facturas | Descargar recibo, reintentar si rechazado | — | `ESTADO_VENTA` |
| PAN-POR-42 | pwa-socio | `/app/pagos` | `por.facturas.ver` | Historial de pagos de todos los canales | Filtrar; descargar recibo | "Aún no registramos pagos" | Pagos sincronizados (VAR_PMOVIL 3) |
| PAN-POR-43 | pwa-socio | `/app/cuentas/:accountId/movimientos` | `por.facturas.ver` | Movimientos débito/crédito, saldo, saldo a favor; resumen de cuenta si agrupación | Descargar resumen | — | Cuenta corriente web |
| PAN-POR-44 | pwa-socio | `/app/debito-automatico` | `por.debito.gestionar` | Estado de adhesión por cuenta/servicio, medio enmascarado | Adherir (componente tokenizado), dar de baja, descargar constancia | — | VAR_PMOVIL 27 (URL externa) |
| PAN-POR-45 | pwa-socio | `/app/factura-digital` | `por.facturaDigital.gestionar` | Estado por cuenta, canales (correo, WhatsApp), medio verificado | Adherir, cambiar canal, dar de baja | Requiere verificar contacto | VAR_PMOVIL 32, 911 |
| PAN-POR-46 | pwa-socio | `/app/convenios` | `por.facturas.ver` | Convenios con cuotas, estado, próximas cuotas. Componentes embebidos: PAN-MOR-39 (deuda vencida y avisos) y PAN-MOR-40 (simular y aceptar convenio) de M08 (§10.6.A) | Pagar cuota, solicitar convenio (si M08 ofrece autoservicio) | "No tenés convenios" | VAR 2448 (cuotas de financiación en web), VAR_PMOVIL 4 |
| PAN-POR-47 | pwa-socio | `/app/consumos(/:contractId)` | `por.consumos.ver` | Gráfico de barras por período + tabla, comparaciones, promedio diario, tipo de lectura (real, estimada, autolectura). Componente embebido: PAN-MED-31 de M03 (§10.6.A) | Cambiar servicio/rango; Mi Medidor | Servicio no medido: no se muestra | Pestaña Consumos (VAR_PMOVIL 31, 55) |
| PAN-POR-48 | pwa-socio | `/app/autolectura/:contractId` | `por.autolectura.crear` | Ventana vigente, instrucciones, cámara con guía, valor propuesto por OCR, último valor. Componente embebido: PAN-MED-32 de M03 (§10.6.A) | Tomar foto, confirmar/corregir valor, enviar | Fuera de ventana: "La próxima ventana abre el dd-mm-yyyy" | — (MER-018) |
| PAN-POR-49 | pwa-socio | `/app/prepaga` | `por.prepaga.comprar` | Servicios prepagos, saldo/crédito, importes sugeridos, cálculo (capital, recargo, bonificación, retención, energía). Componente embebido: PAN-MED-33 de M03 (§10.6.A) | Recargar → checkout | Sin servicios prepagos: no aparece | `crearVenta`, `ctrlPrepaga_Seleccion` |
| PAN-POR-50 | pwa-socio | `/app/gestiones` | `por.gestiones.crear` | Pestañas Abiertas / Cerradas / Históricas (migradas); cards con tipo, número, estado, fecha, servicio | FAB Nueva gestión; filtrar | "No tenés gestiones abiertas" | Reclamos y trámites web |
| PAN-POR-51 | pwa-socio | `/app/gestiones/nueva` (modal) | `por.gestiones.crear` | Tipo (Reclamo, Consulta, Trámite → elige formulario), servicio/contrato, motivo (tipología M09), descripción con dictado, fotos (`PwaFilePicker`), ubicación opcional | Enviar (offline: encolar) | — | VAR_PMOVIL 58 |
| PAN-POR-52 | pwa-socio | `/app/turnos` | `por.turnos.gestionar` | Turnos vigentes con número, área, sucursal, tiempo estimado, QR | Pedir turno (modal: sucursal, área, día/hora o turno del día), cancelar | "No tenés turnos" | Turnero (VAR_PMOVIL 67, VAR 3064) |
| PAN-POR-53 | pwa-socio | `/app/avisos` | `com.inbox.ver` (+ `por.portal.ver`) | Bandeja con tipo (ícono/color de `notifKinds`), fecha, leído | Abrir objeto, marcar todo leído | "Estás al día" | `NOTI_COOP` |
| PAN-POR-54 | pwa-socio | `/app/encuestas(/:id)` | `com.surveys.responder` (+ `por.portal.ver`) | Pendientes y respondidas | Responder | — | — |
| PAN-POR-55 | pwa-socio | `/app/muro(/:id)` | `com.wall.ver` (+ `por.portal.ver`) | Feed editorial T09 por audiencia; reacciones/comentarios si habilitados | Reaccionar, comentar, denunciar | — | — |
| PAN-POR-56 | pwa-socio | `/app/novedades(/:id)` | `com.wall.ver` (+ `por.portal.ver`) | Boletines y novedades | Leer | — | `WEB_NOVEDADES` |
| PAN-POR-105 | pwa-socio | `/app/comunidad` | `por.portal.ver`; cada pestaña exige además la capability de T09 (`com.wall.ver` muro y novedades, `com.surveys.responder` encuestas) | **Comunidad**: destino "Comunidad" de la tabbar (PA-POR-20, RF-POR-180): agregador con pestañas Muro (PAN-POR-55), Encuestas (PAN-POR-54) y Novedades (PAN-POR-56); muestra las últimas publicaciones y las encuestas pendientes, y cada tarjeta abre la pantalla de detalle | Cambiar de pestaña, abrir publicación, responder encuesta, leer novedad | 3 skeleton cards; «Todavía no hay novedades de tu cooperativa»; una pestaña sin capability no se muestra | — (nueva; maestro §9.2) |
| PAN-POR-57 | pwa-socio | `/app/representaciones` | `por.representaciones.gestionar` | Pestañas "Autoricé" (personas, cuentas, acciones, vigencia, estado) y "Me autorizaron" | FAB Autorizar; revocar; renunciar | — | — |
| PAN-POR-58 | pwa-socio | `/app/invitacion/:token` y modal "Autorizar a alguien" | `por.representaciones.gestionar` | Modal: contacto, cuentas/contratos, acciones (casillas), vigencia; aceptación: quién invita, qué podrá hacer | Enviar invitación / Aceptar / Rechazar | — | — |
| PAN-POR-59 | pwa-socio | `/app/perfil` | `por.perfil.editar` | Nombre, documento (solo lectura), correo y celular (verificables), domicilio postal (trámite), datos fiscales (trámite) | Editar contacto (OTP), iniciar trámite de cambio | — | VAR_PMOVIL 15, 18, 19; VAR 2460 |
| PAN-POR-60 | pwa-socio | `/app/perfil/comunicaciones` | `com.preferences.editar` (+ `por.portal.ver`) | Categorías × canales (T09), no molestar, push | Guardar | Constancias no desactivables (explicado) | — |
| PAN-POR-61 | pwa-socio | `/app/perfil/seguridad` | `iam.miCuenta.gestionar` (antes: Sesión) | Contraseña, 2FA, dispositivos, sesiones (T02) | Cambiar, cerrar sesiones | — | — |
| PAN-POR-62 | pwa-socio | `/app/perfil/apariencia` | `por.preferencias.editar` (antes: Sesión) | Tema (oscuro, claro, alto contraste, sistema), tamaño de texto, reducir movimiento, vista ancha | Guardar | — | — |
| PAN-POR-63 | pwa-socio | `/app/borradores` | `por.borradores.gestionar` | Borradores con tipo, paso, vencimiento | Continuar, eliminar | "No tenés borradores" | — |
| PAN-POR-64 | pwa-socio | `/app/constancias` | `por.constancias.descargar` | Constancias emitidas (alta, baja, trámite, libre deuda, conformidad, adhesiones) | Descargar, solicitar libre deuda | — | — |
| PAN-POR-65 | pwa-socio | `/app/ayuda` | `por.portal.ver` (antes: Sesión) | FAQ, chat/bot (M09), teléfonos, sucursales, declaración de accesibilidad | Iniciar chat, llamar | — | VAR 2683 (chat) |
| PAN-POR-66 | pwa-socio | `/app/ddjj/:contractId` | `por.ddjj.presentar` | Grilla armada con la plantilla del servicio (PRM-CAT-110 vía API-POR-125; HUE-GAS-01): gas, artefactos con potencia en kcal/h; energía, artefactos eléctricos (W) y vehículos eléctricos (dominio, modelo, kW del cargador). Columnas comunes: código, cantidad, potencia, marca, modelo, serie, año de compra, protección, observación; "Otros" con texto libre; DDJJ vigente. Texto original: "Grilla de artefactos/vehículos: código, cantidad, marca, modelo, serie, año de compra, protección, observación; "Otros" con texto libre; DDJJ vigente" | Presentar nueva DDJJ | — | `CrearDDJJ_Artefactos`, `ConsultarValoresDDJJ` |
| PAN-POR-67 | pwa-socio | `/app/servicios/:contractId/adherentes` | `por.adherentes.gestionar` | Adherentes con vínculo y fecha de alta (componente PAN-SOC-30 filtrado por contrato, con API-SOC-056/057; dueño M18, DEC-071) | Agregar (modal: documento, vínculo, fotos DNI), solicitar baja de adherente | — | `GetInfoAdherente`, `GuardarAdherentes` |
| PAN-POR-68 | pwa-socio | `/app/avisos-de-corte` | `por.portal.ver` | Interrupciones que afectan las zonas de mis suministros | — | "Sin cortes programados en tus domicilios" | — |
| PAN-POR-98 | pwa-socio | `/app/mi-grupo` | `soc.mi.ver` (+ `por.portal.ver`) | Tarjeta M19 "Mi grupo y coberturas" que embebe PAN-SOC-30: integrantes por servicio, carencias, prestaciones usadas (API-SOC-056) (RF-POR-178, HUE-SRV-04) | Solicitar alta/baja de integrante (API-SOC-057) | "No tenés servicios sociales" | Sin equivalente |
| PAN-POR-99 | pwa-socio | `/app/solicitudes-sociales` | `soc.mi.solicitar` (+ `por.portal.ver`) | Tarjeta M19 que embebe PAN-SOC-31: formulario por tipo sin datos clínicos y seguimiento (API-SOC-057); emergencias muestran el número del prestador | Enviar solicitud, adjuntar documentos | — | Sin equivalente |
| PAN-POR-100 | pwa-socio | `/app/cementerio` | `soc.mi.ver` (+ `por.portal.ver`) | Tarjeta M19 que embebe PAN-SOC-32: unidad, modalidad, obligaciones, actos programados (API-SOC-058) | Solicitar acto (API-SOC-057, pendiente de validación) | "No tenés derechos de sepultura" | Sin equivalente |
| PAN-POR-101 | pwa-socio | `/app/vivienda` | `soc.mi.ver` (+ `por.portal.ver`) | Tarjeta M19 que embebe PAN-SOC-33: tipología, % aportado, cuotas, avance de obra (API-SOC-059) | Descargar estado | "No tenés planes de vivienda" | Sin equivalente |
| PAN-POR-102 | pwa-socio | `/app/mi-asociacion` | `ins.mi.ver` (+ `por.portal.ver`) | Tarjeta M19 que embebe PAN-INS-30: estado, número, antigüedad, capital, credencial digital con QR, documentos (API-INS-063, API-INS-064, API-INS-065) | Descargar estado de capital, mostrar credencial, solicitar egreso (API-INS-066) | "Todavía no sos asociado" + "Asociarme" | Sin equivalente |
| PAN-POR-103 | pwa-socio | `/app/servicios/:contractId/llamadas` | `por.consumos.ver` + acceso `consultar` | Detalle de llamadas por período (selector de período facturado): fecha y hora, destino enmascarado, tipo, duración, importe tasado; totales por tipo; solo lectura sobre M10 (API-TEC-55) y M04 (API-TAR-067) vía API-POR-122 (RF-POR-175, HUE-TEL-02); más de 36 meses en consulta diferida (DEC-087) | Cambiar período, descargar PDF/CSV | "No registramos llamadas en este período"; solo para contratos TEL | `ImprimirDetalleLlamadas` |

#### 10.6.A Composición: componentes y API embebidos por pantalla (HUE-SRV-04, HUECO-TRV-04)

M19 es dueño de la ruta y de la composición (RF-POR-174). Cada fila indica qué componente de otro módulo embebe la PAN-POR y qué API del módulo dueño consume (directamente o a través de la fachada `/api/por/...` indicada). Las PAN de los módulos dueños se marcan en su anexo como "componente embebido en PAN-POR-xx".

| PAN-POR | Ruta | Módulo | Componente embebido | API del módulo dueño | Fachada M19 |
|---|---|---|---|---|---|
| PAN-POR-02 | `/servicios` | M02 CAT | PAN-CAT-23 (listado) | API-CAT-51 | API-POR-02 |
| PAN-POR-03 | `/servicios/:serviceCode` | M02 CAT, M04 TAR | PAN-CAT-23 (ficha del servicio) | API-CAT-51; precios vigentes de M04 | API-POR-03 |
| PAN-POR-12 | `/pagar` | M05 FAC | PAN-FAC-45 | API-FAC-154 | — |
| PAN-POR-29 | `/app/servicios` | M02 CAT | PAN-CAT-22 (cards) | API-CAT-50 | API-POR-41 |
| PAN-POR-30 | `/app/servicios/:contractId` | M02 CAT, M13 STK, M04 TAR | PAN-CAT-22 (detalle); PAN-STK-40 (equipos); bloque "Plan de cuotas de obra"; DDJJ vigente | API-CAT-50, API-CAT-41; API-STK-45; API-TAR-066 | API-POR-42, API-POR-53, API-POR-123 |
| PAN-POR-31 | `/app/contratar` | M02 CAT | PAN-CAT-21 | API-CAT-49 | API-POR-43 |
| PAN-POR-33 | `/app/gestiones/:caseId` | M10 TEC | PAN-TEC-59 (seguimiento de factibilidad) | API-TEC-40 | — |
| PAN-POR-34 | `/app/visitas/coordinar/:caseId` | M10 TEC | PAN-TEC-57; PAN-TEC-59 (estado de factibilidad) | API-TEC-40 | — |
| PAN-POR-35 | `/app/visitas/:visitId` | M10 TEC | PAN-TEC-58; PAN-TEC-59 (estado de factibilidad) | API-TEC-40 | — |
| PAN-POR-37 | `/app/servicios/:contractId/:accion` | M08 MOR | PAN-MOR-41 (suspensión y reactivación) | API-MOR-93 a API-MOR-95 | — |
| PAN-POR-38 | `/app/facturas` | M05 FAC | PAN-FAC-43 | API-FAC-150 | — |
| PAN-POR-39 | `/app/facturas/:invoiceId` | M05 FAC, M04 TAR | PAN-FAC-44 | API-FAC-151, API-FAC-152; API-TAR-060 (explicación) | — |
| PAN-POR-46 | `/app/convenios` | M08 MOR | PAN-MOR-39 (deuda vencida y avisos; ruta original `/app/deuda`); PAN-MOR-40 (convenios) | API-MOR-86, API-MOR-87; API-MOR-88 a API-MOR-91 | — |
| PAN-POR-47 | `/app/consumos(/:contractId)` | M03 MED | PAN-MED-31 | API-MED-70 | API-POR-75 |
| PAN-POR-48 | `/app/autolectura/:contractId` | M03 MED | PAN-MED-32 | API-MED-71, API-MED-72 | API-POR-77, API-POR-78 |
| PAN-POR-49 | `/app/prepaga` | M03 MED | PAN-MED-33 | API-MED-73 | API-POR-80, API-POR-81 |
| PAN-POR-66 | `/app/ddjj/:contractId` | M02 CAT | Plantilla de DDJJ por servicio (PRM-CAT-110) | API-CAT-41 | API-POR-53, API-POR-125 |
| PAN-POR-67 | `/app/servicios/:contractId/adherentes` | M18 SOC | PAN-SOC-30 (filtrado por contrato) | API-SOC-056, API-SOC-057 | API-POR-126 |
| PAN-POR-98 | `/app/mi-grupo` | M18 SOC | PAN-SOC-30 | API-SOC-056, API-SOC-057 | API-POR-126 |
| PAN-POR-99 | `/app/solicitudes-sociales` | M18 SOC | PAN-SOC-31 | API-SOC-057 | API-POR-126 |
| PAN-POR-100 | `/app/cementerio` | M18 SOC | PAN-SOC-32 | API-SOC-058 | API-POR-126 |
| PAN-POR-101 | `/app/vivienda` | M18 SOC | PAN-SOC-33 | API-SOC-059 | API-POR-126 |
| PAN-POR-102 | `/app/mi-asociacion` | M17 INS | PAN-INS-30 | API-INS-063 a API-INS-066 | API-POR-127 |
| PAN-POR-103 | `/app/servicios/:contractId/llamadas` | M10 TEC, M04 TAR | — (vista propia de M19 sobre datos de solo lectura) | Llamadas atribuidas (M10) e importe tasado (M04): ~~API de lectura a declarar por sus dueños~~ Reemplazado por API-TEC-55 (M10, llamadas con `ratingRef`) + API-TAR-067 (M04, `tar.getRatedCalls`); períodos de más de 36 meses en consulta diferida (DEC-087) | API-POR-122 |
| PAN-POR-104 | `/cementerio/buscar` | M18 SOC | — (vista propia de M19) | API-SOC-061 | API-POR-124 |
| PAN-POR-69 | `/app/empleado` | M16 SUE, T09 COM | Resumen de PAN-SUE-41 a PAN-SUE-46 (último recibo, saldo de vacaciones, solicitudes, accesos a equipo, certificados y evaluaciones); muro interno de T09 | API-SUE-78, API-SUE-80 | API-POR-93 |
| PAN-POR-70 | `/app/empleado/recibos` | M16 SUE | PAN-SUE-41 (listado de recibos) | API-SUE-78 | API-POR-94 |
| PAN-POR-71 | `/app/empleado/recibos/:id` | M16 SUE, T11 WFL | PAN-SUE-41 (vista del recibo y firma) | API-SUE-78, API-SUE-79; firma en T11 (API-WFL-77 a API-WFL-79) | API-POR-94 a API-POR-96 |
| PAN-POR-72 | `/app/empleado/vacaciones` | M16 SUE | PAN-SUE-42 (saldo y solicitudes de vacaciones) | API-SUE-80 | API-POR-97 |
| PAN-POR-73 | `/app/empleado/licencias` | M16 SUE | PAN-SUE-42 (licencias) | API-SUE-80 | API-POR-98 |
| PAN-POR-74 | `/app/empleado/legajo` | M16 SUE | PAN-SUE-43 | API-SUE-81 | API-POR-99 |
| — (sin PAN-POR; acceso desde PAN-POR-69) | `/app/empleado/equipo` | M16 SUE | PAN-SUE-44 (Mi equipo del encargado; `sue.equipo.ver`) | API-SUE-83 | — (consume la API de M16) |
| — (sin PAN-POR; acceso desde PAN-POR-69) | `/app/empleado/certificados` | M16 SUE | PAN-SUE-45 (certificados y constancias; `sue.portal.certificados.ver`) | API-SUE-82 | — (consume la API de M16) |
| — (sin PAN-POR; acceso desde PAN-POR-69) | `/app/empleado/evaluaciones` | M16 SUE | PAN-SUE-46 (evaluaciones y objetivos propios; `sue.portal.evaluaciones.autoevaluar`) | API-SUE-84 | — (consume la API de M16) |
| PAN-POR-105 | `/app/comunidad` | T09 COM | Muro (PAN-POR-55), encuestas (PAN-POR-54) y novedades (PAN-POR-56) en pestañas | Feeds de T09 filtrados por audiencia | API-POR-92 |

### 10.7. Fichas de pantallas — PWA empleado, campo y tótem

| PAN | App | Ruta | Capability | Propósito y contenido | Acciones y modales | Vacío / ayuda | Equivalencia ProCoop |
|---|---|---|---|---|---|---|---|
| PAN-POR-69 | pwa-empleado | `/app/empleado` | `por.empleado.ver` | **Incrusta un resumen de PAN-SUE-41 a PAN-SUE-46 de M16** (dueño del contenido; PA-SUE-16 de M16) — Último recibo (firmado/pendiente), saldo de vacaciones, solicitudes en curso, muro interno destacado, avisos | Firmar recibo, solicitar | — | PWeb (VAR_PMOVIL 41) |
| PAN-POR-70 | pwa-empleado | `/app/empleado/recibos` | `sue.portal.recibos.ver` (antes `sue.recibos.ver`) | **Incrusta PAN-SUE-41 de M16** (dueño; PA-SUE-16) — Recibos por período con estado de firma | Abrir | "Aún no hay recibos publicados" | Recibos web (VAR 3122, 3166) |
| PAN-POR-71 | pwa-empleado | `/app/empleado/recibos/:id` | `sue.portal.recibos.ver` (antes `sue.recibos.ver`), `sue.portal.recibos.firmar` (antes `sue.recibos.firmar`) | **Incrusta PAN-SUE-41 de M16** (dueño; PA-SUE-16) — Vista del recibo (PDF accesible + datos clave: neto, haberes, deducciones) | Firmar conformidad (OTP), "Firmar en disconformidad" con motivo, descargar | Bloqueos 3122/3166 explicados | VAR 3122, 3166 |
| PAN-POR-72 | pwa-empleado | `/app/empleado/vacaciones` | `sue.portal.licencias.solicitar` (antes `sue.vacaciones.solicitar`) | **Incrusta PAN-SUE-42 de M16** (dueño; PA-SUE-16) — Saldo por período, solicitudes con estado | FAB Solicitar (modal: desde/hasta, observación) | — | — |
| PAN-POR-73 | pwa-empleado | `/app/empleado/licencias` | `sue.portal.licencias.solicitar` (antes `sue.licencias.solicitar`) | **Incrusta PAN-SUE-42 de M16** (dueño; PA-SUE-16) — Licencias con tipo, fechas, estado, certificado | FAB Solicitar (modal: tipo, fechas, certificado) | — | — |
| PAN-POR-74 | pwa-empleado | `/app/empleado/legajo` | `sue.portal.datos.ver` (antes `sue.legajo.ver`) | **Incrusta PAN-SUE-43 de M16** (dueño; PA-SUE-16) — Datos personales, contacto, cuenta sueldo enmascarada, familiares, puesto | Solicitar actualización (modal) | — | — |
| PAN-POR-75 | pwa-empleado | `/app/empleado/muro` | `com.wall.verInterno` (+ `por.empleado.ver`) | **Incrusta el componente de muro interno de T09** (dueño) — Muro interno T09 | Reaccionar/comentar según reglas | — | — |
| PAN-POR-76 | pwa-empleado | `/app/empleado/avisos` | `com.inbox.ver` (+ `por.empleado.ver`) | **Incrusta la bandeja de avisos de T09** (dueño) — Avisos internos | — | — | — |
| PAN-POR-77 | pwa-campo | `/app/campo` | Capabilities M10/M03/M07 | Redirección a la landing de campo del rol (Mi día técnico, rutas de lectura, cobranza) | — | — | PMovil/Captor (fuera de este anexo) |
| PAN-POR-78 | pwa-socio (tótem) | `/totem` | `por.totem.operar` (identidad del dispositivo) (antes: Credencial de dispositivo) | Mosaicos dinámicos (Pagar facturas, Recargar prepaga, Pedir turno) con marca | Elegir | Fuera de servicio: pantalla de aviso | `frmAutoGestion` (`AddDinamicTiles`, `AddTileCobranza`, `AddTilePrepaga`, `setTile`, `GetItemTextTile`) |
| PAN-POR-79 | pwa-socio (tótem) | `/totem/identificar` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Asociado / cuenta / documento / QR con teclado numérico en pantalla | Buscar | No encontrado: mensaje | `clsBusquedaSocio`, `clsServicioBusquedaSocio`, `clsSocioIdentificado`, `DatosPersona`, `Calc_Touch1` |
| PAN-POR-80 | pwa-socio (tótem) | `/totem/deuda` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Comprobantes y cuotas con casillas, créditos disponibles, total con recargos y percepciones | Seleccionar, continuar | Sin deuda: "Estás al día" | `ctrlCobranza_Seleccion(_Vertical)` (`CargarPantallaDeuda`, `GetComprobantesPagar`, `GetDetallesMarcados`, `GetDetallesCreditos`, `CargarCuotas`, `ActualizarImportes`, `ActualizarTotalpagar`, `ValidarIIBB`), `clsGridTouchScrollHelper` |
| PAN-POR-81 | pwa-socio (tótem) | `/totem/pago` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Medios habilitados: tarjeta (lector), QR, efectivo (billetero) con importe ingresado en vivo | Pagar, cancelar | Error de periférico: alternativa | `ctrlPagoTarjeta`, `ctrlPagoTarjeta2`, `ctrlPagoTarjeta_Vertical`, `ctrlPagQr`, `ctrlPagoQr_Vertical`, `ctrlAutoGestionBase` (`IngresarDinero`, `LeerTarjeta`, `GetFormaPago`), `WebPagos360`, `clsMedioPagoFactory`, `enumFormaPago`, `Tipo_Tarjeta` |
| PAN-POR-82 | pwa-socio (tótem) | `/totem/prepaga` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Servicio prepago, importe, cálculo de capital | Recargar | — | `ctrlPrepaga_Seleccion` (`CalcularVenta`, `CalcularCapital`, `ImporteValido`, `EsMultiploDe`, `AddCreditos`, `CerrarVenta*`) |
| PAN-POR-83 | pwa-socio (tótem) | `/totem/fin` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Resultado y comprobante | Imprimir, enviar por correo | — | `ctrlImpresionMail`, `clsEnvioRecibo`, `EviarMail_Recibo`, `Finalizar` |

### 10.8. Variantes de la pantalla de inicio por rol (PAN-POR-25)

| Rol | Bloques (en orden) | Acción principal | Banner |
|---|---|---|---|
| Registrado sin cuenta | Bienvenida; Contratar un servicio; Vincular cuenta existente; Mis trámites de alta; Novedades | Contratar | "¿Ya sos socio? Vinculá tu cuenta" |
| Socio activo | Saldo y próximo vencimiento; Acciones rápidas; Trámites en curso; Próxima visita; Avisos; Muro | Pagar (si hay saldo) / Reclamar | Campañas activas |
| Socio moroso | Deuda vencida destacada; Pagar; Ver convenios; Acciones rápidas; Trámites | Pagar | "Tenés facturas vencidas por ARS X" (crítico) |
| Socio suspendido | Estado del servicio suspendido y causa; Cómo reconectar (pasos, costo habilitado); Pagar; Estado de reconexión | Pagar / Ver reconexión | "Tu servicio está suspendido" (crítico) |
| Socio con baja | Saldo pendiente si hay; Constancia de baja; Facturas históricas; Contratar nuevamente | Descargar constancia | — |
| Representante / autorizado | Cuentas de terceros con acciones permitidas; Pagar (si `pagar`) | Según acciones | "Estás gestionando la cuenta de …" (persistente) |
| Empleado | (Espacio empleado, PAN-POR-69) | — | — |
| Técnico/lecturista/cobrador | (Redirección PAN-POR-77) | — | — |

### 10.9. Fichas de pantallas — Administración

| PAN | App | Ruta | Capability | Propósito y contenido | Acciones y modales | Vacío / ayuda | Equivalencia ProCoop |
|---|---|---|---|---|---|---|---|
| PAN-POR-84 | admin | `/admin/portal/configuracion` | `por.parametros.configurar` | Parámetros PRM-POR-* agrupados (Acceso, Vinculación, Facturas, Pagos, Consumos, Gestiones, Turnos, Comunidad, Empleado, Tótem) con vigencia; textos `dict:` editables con preview celular | Guardar con vigencia, ver historial | `ScreenHelp` por grupo | `frmVariables` (VARIABLE_PMOVIL canal CoopOnline/PWeb) |
| PAN-POR-85 | admin | `/admin/portal/landing` | `por.landing.editar` | Editor por bloques (lista ordenable con alternativa por botones subir/bajar), panel de propiedades, preview escritorio/celular | Agregar/ocultar bloque, guardar borrador, enviar a revisión | Validación de botón de baja | — |
| PAN-POR-86 | admin | `/admin/portal/landing/versiones` | `por.landing.publicar` | DataTable de versiones (número, estado, autor, fechas) | Aprobar, rechazar, programar, publicar, revertir, comparar | — | — |
| PAN-POR-87 | admin | `/admin/portal/formularios` | `por.formularios.ver` | DataTable: código, nombre, servicio, tipo, audiencia, versión, estado, presentaciones del mes | Nuevo, duplicar, retirar, importar desde ProCoop | — | `frmRequisitos` |
| PAN-POR-88 | admin | `/admin/portal/formularios/:id` | `por.formularios.configurar` | Constructor: datos generales (tipo, sujeto requerido, repetición, comparar documento, T&C, PDF, contacto, comando de ejecución, correo de aviso, autoservicio inmediato), pasos y campos (tipo, máscara, obligatorio, visibilidad condicional, solo operador, enviar al comando, opciones, catálogo), preview celular | Guardar, publicar versión (`por.formularios.publicar`) | — | `frmRequisitos`, `REQUISITOS_ITEMS`, `GetPlantillaDDJJ` (VAR 2742) |
| PAN-POR-89 | admin | `/admin/portal/vinculaciones` | `por.vinculaciones.ver` | Bandeja de accesos `pendienteVerificacion`/asistidos: usuario, cuenta, método, evidencia, antigüedad | Aprobar, rechazar con motivo, emitir código de invitación (modal) | — | — |
| PAN-POR-90 | admin | `/admin/portal/accesos` | `por.accesos.ver` | Por cuenta: usuarios con acceso, rol, acciones, vigencia, origen, último uso; historial | Revocar (`por.accesos.revocar`), suspender | — | Usuarios web por cuenta (`Get_Usuario_CoopOnline`) |
| PAN-POR-91 | admin | `/admin/portal/recepcion-publica` | `por.recepcionPublica.ver` | Bajas y contactos públicos: código, servicio, estado, plazos (semáforo 24 h / 72 h), identificación | Identificar (buscar contrato), derivar a CRM, reenviar código/constancia | — | — |
| PAN-POR-92 | admin | `/admin/portal/migracion` | `por.migracion.ejecutar` | Asistente: subir volcado → validar → ver errores/conflictos → importar → invitar → informe de conciliación | Importar, revertir, exportar informe | — | — |
| PAN-POR-93 | admin | `/admin/portal/banners` | `por.banners.configurar` | DataTable de banners con audiencia y vigencia; preview por rol | Nuevo, pausar | — | — |
| PAN-POR-94 | admin | `/admin/portal/metricas` | `por.metricas.ver` | Indicadores del §15 con filtros de período, servicio, canal | Exportar XLSX/CSV/PDF | — | `WEB_LOG` (reemplazado) |
| PAN-POR-95 | admin | `/admin/portal/vista-socio/:accountId` | `por.vistaSocio.ver` | Marco "celular" con la PWA en modo solo lectura de la cuenta; banda superior "Vista de operador — solo lectura" | Motivo obligatorio al abrir; cerrar | — | Ingreso directo a CoopOnline desde escritorio (`GetEncryptedKey`) |
| PAN-POR-96 | admin | `/admin/portal/totems` | `por.totems.configurar` | DataTable de tótems: sucursal, caja, estado, último heartbeat, medios | Alta (modal), editar, regenerar clave de cierre, fuera de servicio | — | `AutoGestion.exe` (VAR 2347, 2351, 2352, 2790) |
| PAN-POR-97 | admin | `/admin/portal/presentaciones` | `por.formularios.ver` | Presentaciones por formulario/estado; detalle con "Datos del formulario" y "Datos que registra el usuario" (operador), adjuntos nombrados `{id}_{campo}`, DDJJ abierta por fila | Completar campos de operador, observar, aceptar (ejecuta comando), rechazar | — | `ConsultarValoresTramite`, `ConsultarValoresDDJJ`, `ConsultarTramites` |

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …". **Corrección 05-11-2026 (parámetros de ruta):** el parámetro del tenant en las rutas públicas se llama `tenantSlug`, como en la maestra (`/api/public/<tenantSlug>`) y en M16, M17 y M18 (antes `:slug`).

Reglas: el tenant sale del token (rutas `/api/por/...`) o del `slug` resuelto (rutas públicas, solo lectura de contenido público y recepciones). Todas las rutas de socio verifican **capability + acceso vigente a la cuenta/contrato + acción**; si falta, 404 para recursos ajenos (no revelar existencia) y 403 para acción no permitida sobre recurso propio. Paginación `?page=&size=` → `{ items, total, page, size }`. Errores RFC 9457 con `requestId`. Rate limit por IP y usuario en rutas públicas y de vinculación.

### 11.1. Públicas (landing, sin login)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-01 | GET | `/api/public/:tenantSlug/bootstrap?app=` (antes sin `?app=`) | `public: true` (antes: Pública) | Bootstrap público único: API-UXD-01 (T03) y API-PLA-64 (T01) lo referencian. `app` = `admin`, `pwa` o `landing`. Payload: de T03, la marca publicada (colores, URLs de recursos por canal), `themePolicy`, release del diccionario público y URL del paquete pre-login, métodos de login (de T02) y flags públicos; de T01, los módulos y canales activos y el estado del tenant (sin datos internos); de M19, la landing publicada y los parámetros públicos (antes "Marca, diccionario público, landing publicada, parámetros públicos, estado del tenant") | Sí (GET, `ETag`) (antes Sí (GET)) |
| API-POR-02 | GET | `/api/public/:tenantSlug/services` | `public: true` (antes: Pública) | Oferta habilitada (M02) | Sí |
| API-POR-03 | GET | `/api/public/:tenantSlug/services/:serviceCode` | `public: true` (antes: Pública) | Ficha con planes y precios vigentes (M02/M04) | Sí |
| API-POR-04 | POST | `/api/public/:tenantSlug/coverage-checks` | `public: true` (antes: Pública) | Cobertura preliminar por domicilio (M10) | Sí (sin efectos) |
| API-POR-05 | GET | `/api/public/:tenantSlug/streets?q=` | `public: true` (antes: Pública) | Autocompletado de calles (T04) | Sí |
| API-POR-06 | GET | `/api/public/:tenantSlug/news`, `/news/:slug` | `public: true` (antes: Pública) | Noticias canal landing (T09) | Sí |
| API-POR-07 | GET | `/api/public/:tenantSlug/outages` | `public: true` (antes: Pública) | Interrupciones programadas | Sí |
| API-POR-08 | GET | `/api/public/:tenantSlug/forms` | `public: true` (antes: Pública) | Formularios publicados y PDF | Sí |
| API-POR-09 | GET | `/api/public/:tenantSlug/forms/:code/pdf` | `public: true` (antes: Pública) | URL firmada del PDF del trámite | Sí |
| API-POR-10 | POST | `/api/public/:tenantSlug/unsubscribe-requests` | `public: true` (antes: Pública) | Recepción de baja pública; devuelve código | Sí (`Idempotency-Key`) |
| API-POR-11 | POST | `/api/public/:tenantSlug/unsubscribe-requests/lookup` | `public: true` (antes: Pública) | Seguimiento por código + documento | Sí |
| API-POR-12 | POST | `/api/public/:tenantSlug/contact-requests` | `public: true` (antes: Pública) | Contacto/consulta → caso M09 | Sí (`Idempotency-Key`) |
| API-POR-13 | POST | `/api/public/:tenantSlug/invoice-lookups` | `public: true` (antes: Pública (PRM-POR-052)) | Comprobantes impagos enmascarados por cuenta + verificador | Sí |
| API-POR-14 | POST | `/api/public/:tenantSlug/guest-checkouts` | `public: true` (antes: Pública (PRM-POR-052)) | Checkout invitado sobre comprobantes de API-POR-13 (M07) | Sí (`Idempotency-Key`) |
| API-POR-15 | POST | `/api/public/:tenantSlug/payment-codes/lookup` | `public: true` (antes: Pública) | Datos mínimos de un código de pago (pagador eventual) | Sí |
| API-POR-16 | POST | `/api/public/:tenantSlug/payment-codes/checkouts` | `public: true` (antes: Pública) | Checkout por código de pago | Sí (`Idempotency-Key`) |
| API-POR-17 | GET | `/api/public/:tenantSlug/legal/:type` | `public: true` (antes: Pública) | Documento legal vigente | Sí |
| API-POR-18 | GET | `/api/public/:tenantSlug/manifest.webmanifest` | `public: true` (antes: Pública) | Manifest dinámico (T03) | Sí |
| API-POR-19 | GET | `/api/public/:tenantSlug/sitemap.xml`, `/robots.txt`, `/news.rss` | `public: true` (antes: Pública) | SEO y RSS | Sí |
| API-POR-20 | GET | `/api/public/tenants?q=` | `public: true` (antes: Pública) | Buscador de cooperativas (plataforma) | Sí |
| API-POR-21 | GET | `/api/public/:tenantSlug/payments/checkouts/:id/status` | `public: true` (antes: Pública con token del checkout) | Estado de un checkout invitado | Sí |

### 11.2. Sesión, ámbito e inicio (PWA)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-22 | GET | `/api/por/me/context` | `por.portal.ver` | Ámbitos, espacios disponibles, cuentas con acceso, rol de inicio por cuenta, parámetros del portal, términos pendientes | Sí |
| API-POR-23 | POST | `/api/por/me/space` | `por.portal.ver` (antes: Sesión) | Cambia de espacio (socio/empleado); devuelve contexto | Sí |
| API-POR-24 | GET | `/api/por/home?accountId=` | `por.portal.ver` | Datos del inicio por rol (tarjetas, banners, acciones) | Sí |
| API-POR-25 | GET/PUT | `/api/por/me/preferences` | `por.preferencias.editar` | Preferencias del portal | PUT sí |
| API-POR-26 | POST | `/api/por/me/terms-acceptances` | `por.portal.ver` (antes: Sesión) | Aceptar versión de términos | Sí |
| API-POR-27 | GET/PATCH | `/api/por/me/profile` | `por.perfil.editar` | Perfil; PATCH de contacto inicia verificación (T02) | PATCH sí |
| API-POR-28 | POST | `/api/por/legacy-activations` | `public: true` (antes: Pública (rate limit)) | Inicio de activación de usuario migrado (envía OTP) | Sí |

### 11.3. Cuentas, accesos y representaciones

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-29 | GET | `/api/por/accounts` | `por.portal.ver` | Cuentas con acceso vigente | Sí |
| API-POR-30 | GET | `/api/por/accounts/:accountId` | `por.servicios.ver` + acceso `consultar` (antes: Acceso `consultar`) | Detalle de cuenta | Sí |
| API-POR-31 | POST | `/api/por/account-links` | `por.cuentas.vincular` | Vincular cuenta (método + datos) | Sí (`Idempotency-Key`) |
| API-POR-32 | POST | `/api/por/account-links/assisted` | `por.cuentas.vincular` | Solicitar vinculación asistida o canjear código de invitación | Sí |
| API-POR-33 | DELETE | `/api/por/account-access/:accessId` | `por.portal.ver` (solo el acceso propio) (antes: Propio) | Desvincularse | Sí |
| API-POR-34 | PATCH | `/api/por/account-access/:accessId/default` | `por.portal.ver` (solo el acceso propio) (antes: Propio) | Marcar cuenta por defecto | Sí |
| API-POR-35 | GET | `/api/por/delegations` | `por.representaciones.gestionar` | Representaciones otorgadas y recibidas | Sí |
| API-POR-36 | POST | `/api/por/delegations` | `por.representaciones.gestionar` + rol titular | Crear invitación | Sí (`Idempotency-Key`) |
| API-POR-37 | POST | `/api/por/delegations/accept` | `por.portal.ver` (antes: Sesión) | Aceptar/rechazar invitación por token | Sí |
| API-POR-38 | DELETE | `/api/por/delegations/:id` | `por.portal.ver` (solo titular o invitado de la representación) (antes: Titular o invitado) | Revocar/renunciar | Sí |
| API-POR-39 | POST | `/api/por/account-access/:accessId/confirm` | `por.representaciones.gestionar` (rol titular) (antes: Titular) | Confirmar acceso `pendienteConfirmacionTitular` | Sí |
| API-POR-40 | POST | `/api/por/account-access/:accessId/report` | `por.representaciones.gestionar` (rol titular) (antes: Titular) | "No fui yo": revoca y abre alerta | Sí |

### 11.4. Servicios, formularios y trámites

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-41 | GET | `/api/por/contracts?accountId=` | `por.servicios.ver` + acceso `consultar` (antes: Acceso `consultar`) | Contratos con estado de servicio y trámite en curso | Sí |
| API-POR-42 | GET | `/api/por/contracts/:contractId` | `por.servicios.ver` + acceso `consultar` (antes: Acceso `consultar`) | Detalle de contrato (plan, equipo, adherentes, primer cobro, DDJJ) | Sí |
| API-POR-43 | GET | `/api/por/catalog` | `por.servicios.contratar` | Oferta para contratar con condiciones del usuario (aviso de deuda, PRM-POR-071) | Sí |
| API-POR-44 | GET | `/api/por/forms/:code` | `por.portal.ver` (además, la audiencia del formulario) (antes: Según audiencia) | Definición vigente del formulario y prellenado | Sí |
| API-POR-45 | GET/PUT/DELETE | `/api/por/drafts(/:id)` | `por.borradores.gestionar` | Borradores | PUT sí (por `id`/`clientMutationId`) |
| API-POR-46 | POST | `/api/por/uploads` | `por.portal.ver` (antes: Sesión) | Subida de adjunto a almacenamiento privado (URL firmada de subida) | Sí (por hash) |
| API-POR-47 | POST | `/api/por/form-submissions` | `por.gestiones.crear` (además, `requiredAction` del formulario contra el acceso) (antes: Según formulario) | Enviar presentación → caso M09 | Sí (`Idempotency-Key`) |
| API-POR-48 | GET | `/api/por/form-submissions/:id` | `por.gestiones.crear` (solo presentaciones propias) (antes: Propio) | Presentación y constancia | Sí |
| API-POR-49 | POST | `/api/por/form-submissions/:id/responses` | `por.gestiones.crear` (solo presentaciones propias) (antes: Propio) | Responder observación | Sí (`Idempotency-Key`) |
| API-POR-50 | POST | `/api/por/form-submissions/:id/cancel` | `por.gestiones.crear` (solo presentaciones propias) (antes: Propio) | Cancelar | Sí |
| API-POR-51 | POST | `/api/por/contracts/:contractId/change-quotes` | `por.gestiones.crear` + acceso `gestionar`, o `por.servicios.solicitarBaja` + acceso `solicitarBaja` (antes: Acceso `gestionar`/`solicitarBaja`) | Condiciones de baja/suspensión/reactivación/cambio de plan (M08/M02) | Sí (sin efectos) |
| API-POR-52 | POST | `/api/por/contracts/:contractId/adherent-checks` | `por.adherentes.gestionar` + acceso `gestionar` (antes: Acceso `gestionar`) | Validar adherente (`GetInfoAdherente`) | Sí |
| API-POR-53 | GET | `/api/por/contracts/:contractId/appliance-declarations` | `por.servicios.ver` + acceso `consultar` (antes: Acceso `consultar`) | DDJJ vigente e histórica | Sí |

### 11.5. Visitas

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-54 | GET | `/api/por/visits/slots?caseId=` | `por.visitas.gestionar` | Franjas disponibles (M10) | Sí |
| API-POR-55 | POST | `/api/por/visits` | `por.visitas.gestionar` | Reservar | Sí (`Idempotency-Key`) |
| API-POR-56 | GET | `/api/por/visits(/:id)` | `por.visitas.gestionar` | Visitas y detalle (ETA, resultado) | Sí |
| API-POR-57 | POST | `/api/por/visits/:id/reschedule` | `por.visitas.gestionar` | Reprogramar | Sí (`Idempotency-Key`) |
| API-POR-58 | POST | `/api/por/visits/:id/cancel` | `por.visitas.gestionar` | Cancelar | Sí |
| API-POR-59 | POST | `/api/por/visits/:id/conformity` | `por.conformidades.firmar` + acceso `firmar` (antes: Acceso `firmar`) | Firmar conformidad o disconformidad | Sí (`Idempotency-Key`) |

### 11.6. Facturas, documentos y pagos

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-60 | GET | `/api/por/invoices?accountId=&status=&serviceCode=&from=&to=` | `por.facturas.ver` | Comprobantes visibles (RN-POR-062) | Sí |
| API-POR-61 | GET | `/api/por/invoices/:id` | `por.facturas.ver` | Detalle con apertura por servicio y explicación | Sí |
| API-POR-62 | POST | `/api/por/invoices/:id/pdf-url` | `por.facturas.descargar` | URL firmada del PDF | Sí |
| API-POR-63 | GET | `/api/por/accounts/:accountId/statement` | `por.facturas.ver` | Movimientos y resumen de cuenta | Sí |
| API-POR-64 | POST | `/api/por/checkouts/quote` | `por.pagos.crear` | Recalcular deuda/recargos/percepciones para una selección | Sí (sin efectos) |
| API-POR-65 | POST | `/api/por/checkouts` | `por.pagos.crear` | Crear checkout (pasarela/QR) en M07 | Sí (`Idempotency-Key`) |
| API-POR-66 | POST | `/api/por/payment-coupons` | `por.pagos.crear` | Generar cupón único (PDF con código de barras) | Sí (`Idempotency-Key`) |
| API-POR-67 | GET | `/api/por/checkouts/:id` | `por.pagos.crear` (solo checkouts propios) (antes: Propio) | Estado del checkout | Sí |
| API-POR-68 | GET | `/api/por/payments?accountId=` | `por.facturas.ver` | Historial de pagos | Sí |
| API-POR-69 | POST | `/api/por/payments/:id/receipt-url` | `por.facturas.descargar` | URL firmada del recibo | Sí |
| API-POR-70 | GET/POST/DELETE | `/api/por/direct-debits(/:id)` | `por.debito.gestionar` | Consultar, adherir (sesión tokenizada de M07: API-COB-81 devuelve la sesión del componente del proveedor y el portal la abre; DEC-091), dar de baja | POST/DELETE sí (`Idempotency-Key`) |
| API-POR-71 | GET/PUT | `/api/por/accounts/:accountId/digital-invoice` | `por.facturaDigital.gestionar` | Adhesión a factura digital (M05) | PUT sí |
| API-POR-72 | GET | `/api/por/agreements?accountId=` | `por.facturas.ver` | Convenios y cuotas (M08) | Sí |
| API-POR-73 | GET/POST | `/api/por/certificates` | `por.constancias.descargar` | Listar constancias / solicitar libre deuda | POST sí |
| API-POR-74 | POST | `/api/por/checkouts/by-code` | `por.pagos.crear` | Pagar un comprobante ajeno con código (sesión) | Sí (`Idempotency-Key`) |

### 11.7. Consumos, autolectura y prepaga

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-75 | GET | `/api/por/contracts/:contractId/consumption?periods=` | `por.consumos.ver` | Historial de consumos (M03) | Sí |
| API-POR-76 | GET | `/api/por/contracts/:contractId/my-meter-url` | `por.consumos.ver` | URL "Mi Medidor" del proveedor (T06) | Sí |
| API-POR-77 | GET | `/api/por/contracts/:contractId/self-reading-window` | `por.autolectura.crear` | Ventana vigente y último valor | Sí |
| API-POR-78 | POST | `/api/por/self-readings` | `por.autolectura.crear` | Enviar autolectura con foto (M03) | Sí (`Idempotency-Key`/`clientMutationId`) |
| API-POR-79 | POST | `/api/por/self-readings/ocr` | `por.autolectura.crear` | Propuesta de valor por OCR (IA propone) | Sí (sin efectos) |
| API-POR-80 | POST | `/api/por/prepaid/quotes` | `por.prepaga.comprar` | Cotizar recarga | Sí (sin efectos) |
| API-POR-81 | POST | `/api/por/prepaid/purchases` | `por.prepaga.comprar` | Crear recarga + checkout con TTL | Sí (`Idempotency-Key`) |

### 11.8. Gestiones, turnos y comunicaciones

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-82 | GET | `/api/por/cases?status=` | `por.gestiones.crear` | Mis gestiones (incluye históricas migradas) | Sí |
| API-POR-83 | POST | `/api/por/cases` | `por.gestiones.crear` | Crear reclamo/consulta (M09) | Sí (`Idempotency-Key`) |
| API-POR-84 | GET | `/api/por/cases/:id` | `por.gestiones.crear` (casos propios o de una cuenta con acceso) (antes: Propio/acceso) | Detalle público del caso | Sí |
| API-POR-85 | POST | `/api/por/cases/:id/messages` | `por.gestiones.crear` (casos propios o de una cuenta con acceso) (antes: Propio/acceso) | Mensaje con adjuntos | Sí (`Idempotency-Key`) |
| API-POR-86 | POST | `/api/por/cases/:id/resolution` | `por.gestiones.crear` (casos propios o de una cuenta con acceso) (antes: Propio/acceso) | Conformidad/rechazo de la solución | Sí |
| API-POR-87 | POST | `/api/por/cases/:id/reopen` | `por.gestiones.crear` (casos propios o de una cuenta con acceso) (antes: Propio/acceso) | Reabrir en plazo | Sí |
| API-POR-88 | POST | `/api/por/sync` | `por.portal.ver` (antes: Sesión) | Lote offline con `clientMutationId` por ítem y resultado por ítem | Sí |
| API-POR-89 | GET/POST/DELETE | `/api/por/office-turns(/:id)` | `por.turnos.gestionar` | Turnos de atención (M09 turnero), tiempo estimado | POST sí |
| API-POR-90 | GET | `/api/por/notifications` (+ `POST /read`) | `com.inbox.ver` (+ `por.portal.ver`) | Bandeja de avisos (T09) | POST sí |
| API-POR-91 | GET | `/api/por/outages` | `por.portal.ver` | Interrupciones en mis zonas | Sí |
| API-POR-92 | GET | `/api/por/community/feed`, `/surveys` | `com.wall.ver` (feed) / `com.surveys.responder` (encuestas), + `por.portal.ver` | Proxy de feeds T09 filtrados por audiencia del rol | Sí |

### 11.9. Portal del empleado

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-93 | GET | `/api/por/empleado/home` | `por.empleado.ver` | Inicio del empleado | Sí |
| API-POR-94 | GET | `/api/por/empleado/payslips(/:id)` | `sue.portal.recibos.ver` (antes `sue.recibos.ver`) | Recibos (M16) | Sí |
| API-POR-95 | POST | `/api/por/empleado/payslips/:id/signature` | `sue.portal.recibos.firmar` (antes `sue.recibos.firmar`) | Firmar conformidad/disconformidad (OTP) | Sí (`Idempotency-Key`) |
| API-POR-96 | POST | `/api/por/empleado/payslips/:id/pdf-url` | `sue.portal.recibos.ver` (antes `sue.recibos.ver`) | URL firmada (respeta 3122/3166) | Sí |
| API-POR-97 | GET/POST | `/api/por/empleado/vacations` | `sue.portal.licencias.solicitar` (antes `sue.vacaciones.solicitar`) | Saldo y solicitudes | POST sí |
| API-POR-98 | GET/POST | `/api/por/empleado/leaves` | `sue.portal.licencias.solicitar` (antes `sue.licencias.solicitar`) | Licencias | POST sí |
| API-POR-99 | GET/POST | `/api/por/empleado/record` (+ `/update-requests`) | `sue.portal.datos.ver` (GET), `sue.portal.datos.editar` (POST `/update-requests`; nueva en M16) (antes `sue.legajo.ver`) | Legajo y solicitudes de actualización | POST sí |

### 11.10. Tótem

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-100 | POST | `/api/por/kiosk/session` | `por.totem.operar` (identidad del dispositivo) (antes: Credencial de dispositivo) | Abre sesión de tótem (valida dispositivo y caja) | Sí |
| API-POR-101 | POST | `/api/por/kiosk/identify` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Identificación por socio/cuenta/documento/QR (datos mínimos) | Sí |
| API-POR-102 | POST | `/api/por/kiosk/payments` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Registrar cobro en la caja del dispositivo (M07) | Sí (`Idempotency-Key`) |
| API-POR-103 | POST | `/api/por/kiosk/heartbeat` | `por.totem.operar` (identidad del dispositivo) (antes: Dispositivo) | Latido y estado de periféricos | Sí |
| API-POR-104 | POST | `/api/por/kiosk/close` | `por.totem.operar` (identidad del dispositivo) + clave de cierre (antes: Dispositivo + clave) | Cierre administrativo | Sí |

### 11.11. Administración del portal

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-105 | GET/PUT | `/api/admin/por/settings` | `por.parametros.configurar` | Parámetros del portal con vigencia (T04) | PUT sí |
| API-POR-106 | GET/PUT | `/api/admin/por/landing/draft` | `por.landing.editar` | Borrador de landing | PUT sí |
| API-POR-107 | GET/POST | `/api/admin/por/landing/versions(/:id/:action)` | `por.landing.publicar` | Revisión, aprobación, programación, publicación, reversión | Sí |
| API-POR-108 | GET/POST/PUT | `/api/admin/por/forms(/:id)` | `por.formularios.configurar` | CRUD de formularios | PUT sí |
| API-POR-109 | POST | `/api/admin/por/forms/:id/publish` | `por.formularios.publicar` | Publicar versión | Sí |
| API-POR-110 | GET | `/api/admin/por/form-submissions` | `por.formularios.ver` | Presentaciones | Sí |
| API-POR-111 | POST | `/api/admin/por/form-submissions/:id/:action` | `por.formularios.ver` + permiso CRM | Observar, completar campos de operador, aceptar (ejecuta comando), rechazar | Sí (`Idempotency-Key`) |
| API-POR-112 | GET/POST | `/api/admin/por/link-requests(/:id/:action)` | `por.vinculaciones.aprobar` | Bandeja de vinculaciones; aprobar/rechazar | Sí |
| API-POR-113 | POST | `/api/admin/por/link-invitations` | `por.vinculaciones.aprobar` | Emitir código de vinculación asistida | Sí (`Idempotency-Key`) |
| API-POR-114 | GET/POST | `/api/admin/por/account-access?accountId=` (+ `/:id/revoke`, `/:id/suspend`) | `por.accesos.ver`/`revocar` | Accesos de una cuenta | Sí |
| API-POR-115 | GET/POST | `/api/admin/por/public-submissions(/:id/:action)` | `por.recepcionPublica.ver`/`derivar` | Recepción pública: identificar, derivar, reenviar | Sí |
| API-POR-116 | POST | `/api/admin/por/legacy-imports` (+ `/:id/validate`, `/:id/import`, `/:id/invite`, `/:id/revert`) | `por.migracion.ejecutar` | Migración CoopOnline | Sí |
| API-POR-117 | GET/POST/PUT | `/api/admin/por/banners(/:id)` | `por.banners.configurar` | Banners | PUT sí |
| API-POR-118 | GET | `/api/admin/por/metrics` (+ `/export`) | `por.metricas.ver`/`exportar` | Métricas | Sí |
| API-POR-119 | POST | `/api/admin/por/member-view-sessions` | `por.vistaSocio.ver` | Abrir vista de socio solo lectura (motivo) | Sí |
| API-POR-120 | GET/POST/PUT | `/api/admin/por/kiosks(/:id)` (+ `/rotate-secret`) | `por.totems.configurar` | Tótems | PUT sí |
| API-POR-121 | POST | `/api/admin/por/custom-domains` (+ `/:id/verify`) | `por.landing.publicar` | Dominio propio (PA-POR-12) | Sí |

### 11.12. Fachadas de composición y consultas agregadas (HUE-SRV-04, HUE-TEL-02, HUECO-OBR-03, HUECO-CEM-02, HUE-GAS-01)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-POR-122 | GET | `/api/por/contracts/:contractId/calls?period=` | `por.consumos.ver` + acceso `consultar` | Detalle de llamadas del período (PAN-POR-103): llamadas atribuidas de M10 con su importe tasado de M04, destino enmascarado, totales por tipo; `?format=pdf\|csv` para descarga (HUE-TEL-02). Combina API-TEC-55 (M10, llamadas atribuidas con `ratingRef`) y API-TAR-067 (M04, importe tasado por `callId`); si el período tiene más de 36 meses responde `202` con una solicitud de consulta diferida y avisa en el portal cuando está lista (DEC-087) | Sí (lectura) |
| API-POR-123 | GET | `/api/por/contracts/:contractId/installment-plan` | `por.servicios.ver` + acceso `consultar`; hacia M04 se propaga `por.planObra.ver` (capability de API-TAR-066, solo cuentas propias; antes `pwa.planObra.ver`) | Plan de cuotas de obra del contrato, delegado en API-TAR-066 (M04): cuota n/N, cuotas facturadas, saldo, unidades, próxima cuota estimada (HUECO-OBR-03) | Sí (lectura) |
| API-POR-124 | GET | `/api/public/:tenantSlug/cemetery/deceased?q=` | `public: true` (antes: Pública (solo si PRM-SOC-050; límite de tasa y captcha tras N consultas)) | Búsqueda de difuntos delegada en API-SOC-061: nombre y ubicación, sin datos del titular del derecho (HUECO-CEM-02) | Sí (lectura) |
| API-POR-125 | GET | `/api/por/contracts/:contractId/appliance-declarations/template` | `por.ddjj.presentar` + acceso `consultar` | Plantilla de DDJJ del servicio del contrato (PRM-CAT-110) leída de API-CAT-41: campos, unidad de potencia y obligatoriedad (HUE-GAS-01) | Sí (lectura) |
| API-POR-126 | GET/POST | `/api/por/social/(groups\|requests\|burial-rights\|housing)` | `soc.mi.ver` / `soc.mi.solicitar` (+ `por.portal.ver`) | Fachada de PAN-POR-67 y PAN-POR-98 a PAN-POR-101 sobre API-SOC-056 a API-SOC-059 (M18) (HUE-SRV-04) | GET sí; POST con `Idempotency-Key` |
| API-POR-127 | GET/POST | `/api/por/membership/(me\|capital-statement\|credential\|requests)` | `ins.mi.ver` / `ins.mi.solicitar` (+ `por.portal.ver`) | Fachada de PAN-POR-102 sobre API-INS-063 a API-INS-066 (M17) (HUE-SRV-04) | GET sí; POST con `Idempotency-Key` |

## 12. Eventos y jobs

### 12.1. Eventos emitidos (outbox)

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-POR-01 | `por.accountAccess.granted` | Acceso activo creado | T09 (aviso al titular), T02 auditoría, T10 |
| EVT-POR-02 | `por.accountAccess.revoked` | Revocación/desvinculación | T09, caché de sesiones (purga), T10 |
| EVT-POR-03 | `por.accountAccess.expired` | Vencimiento | T09 |
| EVT-POR-04 | `por.accountAccess.suspended` | Suspensión por operador | T09 |
| EVT-POR-05 | `por.linkAttempt.blocked` | Bloqueo por intentos | T02 (seguridad), T09 (alerta al usuario) |
| EVT-POR-06 | `por.delegation.invited` / `.accepted` / `.revoked` | Representaciones | T09 |
| EVT-POR-07 | `por.formSubmission.submitted` | Envío de formulario | M09 (si no se invocó sincrónicamente), T09 (correo PRM-POR-078), T10 |
| EVT-POR-08 | `por.formSubmission.accepted` / `.rejected` / `.cancelled` | Cambios de estado | T09, T10 |
| EVT-POR-09 | `por.publicSubmission.received` | Baja/contacto público | M09, T09 (envío del código) |
| EVT-POR-10 | `por.publicSubmission.receiptIssued` | Constancia emitida | T09 (envío por el mismo medio), T10 |
| EVT-POR-11 | `por.publicSubmission.deadlineAtRisk` | Plazo en riesgo | M09 supervisión, T09 |
| EVT-POR-12 | `por.landing.published` | Publicación/reversión | CDN (invalidación), T10 |
| EVT-POR-13 | `por.legacyImport.completed` | Fin de importación | T07, T10 |
| EVT-POR-14 | `por.legacyUser.activated` | Activación de migrado | T10 |
| EVT-POR-15 | `por.memberView.opened` | "Ver como socio" | T02 auditoría |
| EVT-POR-16 | `por.kiosk.statusChanged` | Tótem fuera de servicio/activo | M07 (caja), T09 (alerta) |

### 12.2. Eventos consumidos

| Evento | Productor | Efecto en el portal |
|---|---|---|
| `iam.identity.created` (EVT-IAM-01) | T02 | Crear preferencias, detectar usuario migrado |
| `iam.membership.invited` / `.activated` / `.suspended` / `.revoked` (EVT-IAM-03) | T02 | Recalcular espacios/ámbitos |
| `cat.contract.activated` / `.suspended` / `.reactivated` / `.terminated` (EVT-CAT-09/10/12/15) | M02 | Actualizar estado del servicio; crear acceso `titular` en alta por trámite |
| `per.ownership.changed` (EVT-PER-23) | M01 | Revocar accesos del titular saliente; avisar |
| `per.relationship.granted` / `.revoked` / `.expired` (EVT-PER-18) | M01 | Crear/revocar accesos de representación legal |
| `cat.tenantService.published` / `.withdrawn`, `cat.plan.published` / `.discontinued` (EVT-CAT-02/03/05) | M02 | Invalidar caché de catálogo y landing |
| `crm.case.statusChanged` (incluye el estado observado) / `crm.case.resolved` (EVT-CRM-05/08), `crm.message.sent` (EVT-CRM-17) | M09 | Línea de tiempo, avisos, observaciones a responder. Campos usados: `caseId`, `from`, `to`, `publicStatusKey` (EVT-CRM-05); `caseId`, `resolutionCode` (EVT-CRM-08); `messageId`, `conversationId`, `channel` (EVT-CRM-17, solo `crm.message.sent`) |
| `tec.visit.statusChanged` (EVT-TEC-13; estados `confirmed`, `enRoute`, `completed`, `rescheduled`, `cancelled`) / `tec.visit.failed` (EVT-TEC-14; incluye sin acceso) | M10 | Visitas, ETA, conformidad |
| `tec.workOrder.created` / `.closed` (EVT-TEC-04/07) | M10 | OT visibles |
| `fac.invoice.issued` | M05 | Aviso "Factura emitida" (si preferencia), solo cuando el comprobante ya está autorizado o no requiere autorización; si llega con `requiresAuthorization = true`, el aviso y la publicación esperan `fis.invoice.authorized` (RF-POR-085; DEC-107; antes el aviso salía al emitir) |
| `fis.invoice.authorized` (EVT-FIS-01) | M06 | Publica el comprobante en "Mis facturas" y en la deuda pagable, habilita PDF, código de pago y el aviso pendiente (RF-POR-085; DEC-107; 10-11-2026) |
| `fac.invoice.returnedToDraft` (EVT-FAC-22) | M05 | Retira de la vista y de la caché el comprobante devuelto a borrador o a la cola (`kind = returnedToDraft` o `requeued`); no se muestra ni se paga hasta su reemisión y autorización (RF-POR-085; DEC-107; 10-11-2026) |
| `fac.invoice.renumbered` (EVT-FAC-23) | M05 | Actualiza el número visible (`fullNumber`) del comprobante identificado por `invoiceId` en la caché de `invoiceView` (RF-POR-085; DEC-107; 10-11-2026) |
| `fac.invoice.dueDatesChanged` (EVT-FAC-13) | M05 | Actualiza los vencimientos (`dueDates`) del comprobante identificado por `invoiceId` en la caché de `invoiceView` y en la deuda pagable; los importes no cambian. Con `reason = lateAuthorization` (vencimientos corridos por autorización fiscal tardía, M05 RN-FAC-165) el detalle de la factura muestra los vencimientos corridos con la leyenda `dict:por.invoice.dueDatesShifted` ("Los vencimientos se corrieron porque la autorización fiscal se demoró"), sin mostrar las fechas originales de `lateAuthorizationShift`; el aviso al socio lo envía T09 (tipo `fac.invoice.dueDatesShifted`). Con `reason = massModification` solo actualiza las fechas. Si el comprobante todavía no se muestra (RF-POR-085), guarda las fechas para cuando se publique (DEC-107; 10-11-2026, última ronda) |
| `cob.paymentIntent.statusChanged` (EVT-COB-20; confirmado, rechazado, incierto) / `cob.payment.confirmed` (EVT-COB-04) | M07 | Estado del pago, recibo, banners |
| `cob.directDebitMandate.changed` (EVT-COB-17) | M07 | Estado de adhesión, constancia |
| `cob.payment.informed` (EVT-COB-24) | M07 | Estado "pago informado, a verificar" en la cuenta corriente y en el detalle de la deuda |
| `mor.evaluation.closed` (EVT-MOR-06), `mor.interruption.executed` (EVT-MOR-13; suspensión o reconexión según tipo), `mor.agreement.created` (EVT-MOR-14) | M08 | Rol de inicio y banners |
| `med.selfReading.accepted` / `.rejected` (EVT-MED-27) | M03 | Resultado de autolectura |
| `med.prepaidTopUp.delivered` (EVT-MED-23) | M03 | Resultado de recarga |
| `sue.payslip.issued` (EVT-SUE-14) | M16 | Aviso al empleado |
| `com.post.published` (EVT-COM-01) | T09 | Invalidar caché de noticias de landing |
| `soc.dependent.added` / `.ended` / `.categoryChanged` / `.restored` (EVT-SOC-01) | M18 | Actualizar integrantes en PAN-POR-67 y PAN-POR-98 (HUECO-TRV-01, HUE-SRV-04) |
| `cat.contract.meteringRegimeChanged` (EVT-CAT-28) | M02 | Mostrar u ocultar Consumos y Autolectura en PAN-POR-30 desde la fecha efectiva (HUE-AG-03) |
| `ins.membership.approved` (EVT-INS-02) | M17 | Con `associateMembershipId` y `memberNumber` (antes `membershipId`), invalida la caché de "Mi asociación" (PAN-POR-102), deja de ofrecer "Asociarme" y avisa al socio. Consumo declarado en T11 §12 (corrección de cierre 05-11-2026, Asumida DEC-072) |
| `ins.membership.suspended` / `ins.membership.reinstated` (EVT-INS-04) | M17 | Con `associateMembershipId` y `date` (antes `membershipId`), invalida la caché de "Mi asociación" (PAN-POR-102) y actualiza el estado de asociado mostrado. Consumo declarado en T11 §12 |
| `ins.membership.exited` (EVT-INS-06) | M17 | Con `associateMembershipId` y `effectiveDate` (antes `membershipId`), invalida la caché de "Mi asociación" (PAN-POR-102) y muestra la condición de ex asociado desde la fecha efectiva; no revoca accesos a cuentas ni servicios. Consumo declarado en T11 §12 |
| `ins.capitalMovement.recorded` (EVT-INS-08; antes `ins.capital.movement.recorded`, alias en T11 §12.4, PA-INS-13 de M17) | M17 | Invalida la caché de capital social en "Mi asociación" (PAN-POR-102). Consumo declarado en T11 §12 |

Nota de alias (T11 §12.4 y §12.4.1): los nombres usados antes en este anexo quedan como alias en `eventTypes.aliases` y no se usan en suscripciones nuevas: `iam.user.registered` → `iam.identity.created`; `iam.membership.changed` → `iam.membership.*`; `per.contract.*` → `cat.contract.*` (productor M02); `per.account.ownerChanged` → `per.ownership.changed`; `per.relation.validated` / `.ended` → `per.relationship.granted` / `.revoked` / `.expired`; `cat.offer.changed` → `cat.tenantService.published` / `.withdrawn`, `cat.plan.published` / `.discontinued`; `crm.case.messageAdded` → `crm.message.sent`; `crm.case.observed` → `crm.case.statusChanged`; `tec.visit.scheduled` / `.technicianEnRoute` / `.completed` → `tec.visit.statusChanged`; `tec.visit.noAccess` → `tec.visit.failed`; `cob.payment.rejected` / `.uncertain` → `cob.paymentIntent.statusChanged`; `cob.payment.allocated` → `cob.payment.confirmed`; `cob.directDebit.adhered` / `.cancelled` → `cob.directDebitMandate.changed`; `mor.account.delinquent` → `mor.evaluation.closed`; `mor.account.suspended` / `.reconnected` → `mor.interruption.executed`; `med.selfReading.validated` → `med.selfReading.accepted`; `med.prepaid.credited` → `med.prepaidTopUp.delivered`; `sue.payslip.published` → `sue.payslip.issued`.

Nombres que otros anexos usan para eventos de M19 (T09 §9.6; CNC-WFL-033/034/035/067/068/069): `por.authorization.granted` y `por.account.linked` → `por.accountAccess.granted` (EVT-POR-01); `por.delegation.changed` → `por.delegation.invited` / `.accepted` / `.revoked` (EVT-POR-06); `por.formSubmission.received` → `por.formSubmission.submitted` (EVT-POR-07); `por.formSubmission.decided` → `por.formSubmission.accepted` / `.rejected` / `.cancelled` (EVT-POR-08); `por.registration.completed` no es un evento de M19: el registro lo publica T02 como `iam.identity.created` (el candidato `por.legacyImport.completed` sugerido por T11 no aplica). Las capabilities de comunidad usan las claves de T09 (CTR-COM-09, CTR-UXD-24); los alias `com.muro.ver`, `com.muroInterno.ver` y `com.encuestas.responder` quedan registrados en T02 §4.4.1.

### 12.3. Jobs

Ver §9.17 (`JOB-POR-01` a `JOB-POR-12`).

## 13. Integraciones

Todas se implementan en el marco de T06 (conectores, bóveda de credenciales por tenant, reintentos, observabilidad). Particularidades del portal:

| Integración | Uso en el portal | Ola | Referencia |
|---|---|---|---|
| CiDi (Ciudadano Digital Córdoba) u otro IdP provincial (OIDC) | Ingreso y verificación de identidad para vinculación y formularios con "comparar documento" | O2 (opcional por tenant) | VAR_PMOVIL 40; RN-10 §3.5; T02/T06 |
| Google OIDC | Ingreso social (T02) | O2 | BASE §67 |
| Pasarelas (Pagos360, Mercado Pago, SIRO, Macro, Helipagos, SiPago, ProvinciaNet y otras) | Checkout, QR, cupón, débito automático tokenizado | O5 | M07; RN-10 §3.3–3.4; VAR_PMOVIL 42, 43 |
| Proveedor de telemedición (Discar "Mi Medidor") | URL de consulta del suministro | O7 | RN-10 §3.2; VAR_PMOVIL 55 |
| Web Push (VAPID), correo, WhatsApp, SMS | Avisos y constancias con evidencia de entrega | O2 | T09; CNX §2.7 |
| OCR (proveedor de IA) | Propuesta de valor de autolectura | O7 | M03; IA solo propone |
| Mapas (opcional) | Cobertura, sucursales, ubicación de reclamo — siempre con alternativa textual | O2 | AGR-032; VAR 2027–2029, 2090, 2242, 2251 (configuración de mapa del tenant en T04) |
| Agente local de hardware | Lector de billetes, lector de tarjetas e impresora del tótem | O10 | RN-10 §11 (VAR 2351, 2352, 2357); T06 |
| DNS/TLS para dominio propio | Verificación TXT y emisión automática de certificado | O2 | PA-POR-12; T01 |
| CDN | Cacheo de landing publicada e invalidación al publicar | O2 | DEC-004 |

**Integraciones de ProCoop que desaparecen** (CTR-POR-04): base MySQL de CoopOnline (`Conexion_MySql`, VAR 808–811), sincronización `clsWEB` (titulares, cuentas, órdenes, facturas, PDF, pagos, consumos, parámetros), escucha Firebase (`Venta_{n}`, `Cobranza_{n}`), publicación de PDF por FTP/S3 del proveedor, `RegistrarCobranzasEntidad` REST con APIKEY fija, API de trámites de CoopOnline, Integra como intermediario del portal. Se reemplazan por lectura directa de los mismos datos vía API y webhooks firmados de pasarelas (RN-10 §14 puntos 3 y 7).

## 14. Parámetros de configuración

Ámbito: P = plataforma, T = tenant, S = servicio, C = categoría. Todos versionados con vigencia (T04). Los textos se gestionan como claves de diccionario del tenant.

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-POR-001 | `por.portal.enabled` | Boolean | T | true | Habilita el portal del socio | — |
| PRM-POR-002 | `por.landing.slug` | String | T | (del alta) | Subdominio | — |
| PRM-POR-003 | `por.landing.customDomain` | String | T | — | Dominio propio; debe existir verificado en `tenants.domains` de T01 (CTR-DAT-56) | — |
| PRM-POR-004 | `por.registration.enabled` | Boolean | T | true | Registro público | — |
| PRM-POR-005 | `por.registration.methods` | [Enum] | T | `[email, phone, google]` | Métodos de registro | — |
| PRM-POR-006 | `por.idp.cidi.enabled` | Boolean | T | false | Ingreso/verificación con CiDi | VAR_PMOVIL 40 |
| PRM-POR-007 | `por.login.referenceLink` | URL | T | — | Enlace de referencia en el ingreso | VAR_PMOVIL 34 |
| PRM-POR-008 | `dict:por.landing.cabecera` | Texto largo | T | — | Texto de cabecera de la página | VAR_PMOVIL 65 |
| PRM-POR-009 | `dict:por.landing.textoWeb` | Texto | T | — | Texto general para mostrar en la web | VAR_PMOVIL 912 |
| PRM-POR-010 | `por.linking.methods` | [Enum] | T | `[codigoSocioClave, suministroDocumento, invitacionOperador]` | Métodos de vinculación habilitados | VAR 800 (tipo de clave) |
| PRM-POR-011 | `por.linking.invoiceLookbackMonths` | Int | T | 12 | Antigüedad máxima de la factura usada para vincular | — |
| PRM-POR-012 | `por.linking.maxAttemptsUser` | Object | P | `{ count: 5, windowMin: 15, lockMin: 15 }` | Límite por usuario | — |
| PRM-POR-013 | `por.linking.maxAttemptsIp` | Object | P | `{ count: 20, windowMin: 60 }` | Límite por IP | — |
| PRM-POR-014 | `por.delegation.maxDays` | Int | T | 365 | Vigencia máxima de una representación | — |
| PRM-POR-015 | `por.signedUrl.ttlSeconds` | Int | P | 300 | Vida de URL firmadas | — |
| PRM-POR-016 | `dict:por.vincular.*` (`boton`, `titulo`, `codigoSocio`, `claveSuministro`, `observacion`) | Texto | T | Textos estándar | Textos de "agregar cuenta" | VAR_PMOVIL 5, 6, 7, 8, 9 |
| PRM-POR-017 | `por.linking.assistedCodeTtlHours` | Int | T | 72 | Vigencia del código de vinculación asistida | — |
| PRM-POR-018 | `por.session.idleMinutes` | Int | T | 30 | Inactividad para pedir reingreso | VAR 2280 (análogo de escritorio) |
| PRM-POR-019 | `por.terms.currentVersions` | Object | T | — | Versiones vigentes de términos y privacidad | — |
| PRM-POR-020 | `por.profile.requirePhone` | Boolean | T | false | Exigir teléfono | VAR_PMOVIL 15 |
| PRM-POR-021 | `por.profile.requireEmail` | Boolean | T | true | Exigir correo | VAR_PMOVIL 18 |
| PRM-POR-022 | `por.profile.reconfirmContactOnLogin` | Enum | T | `nunca` | `nunca`, `cadaIngreso`, `cada90Dias` | VAR_PMOVIL 19 |
| PRM-POR-023 | `por.profile.keepPortalContact` | Boolean | T | true | No sobrescribir el contacto preferido del portal con datos del ERP | VAR 2460 |
| PRM-POR-024 | `por.ui.wideLayoutDesktop` | Boolean | T | true | Vista ancha en escritorio (PA-POR-07) | — |
| PRM-POR-030 | `por.invoices.visibleFrom` | Date | T | Fecha de corte de migración | Comprobantes visibles desde | VAR_PMOVIL 20, 74; VAR 3168 |
| PRM-POR-031 | `por.invoices.visibleDocumentTypes` | [Ref] | T | Facturas, NC, ND, recibos, cuotas | Tipos de comprobante visibles; incluye cuotas de financiación y facturación diaria/mensual | VAR 829, 2261, 2448; VAR_PMOVIL 39 |
| PRM-POR-032 | `por.invoices.hideBlockedPdf` | Boolean | T | true | Ocultar PDF de comprobantes bloqueados | VAR_PMOVIL 17 |
| PRM-POR-033 | `por.invoices.historyMonths` | Int | T | 24 | Meses de historial en pantalla | VAR_PMOVIL 36 |
| PRM-POR-034 | `por.invoices.onlyDebtsDefault` | Boolean | T | true | Filtro inicial "Adeudadas" | VAR_PMOVIL 913 |
| PRM-POR-035 | `por.invoices.groupByDueDate` | Boolean | T | true | Agrupar/ordenar por vencimiento | VAR_PMOVIL 71 |
| PRM-POR-036 | `dict:por.facturas.observacion` | Texto | T | — | Observación en facturas | VAR_PMOVIL 35 |
| PRM-POR-037 | `dict:por.facturas.vistaPrevia` | Texto | T | — | Texto de vista previa de seleccionadas | VAR_PMOVIL 14 |
| PRM-POR-040 | `por.payments.enabled` | Boolean | T | false | Habilita pagos online | VAR 2622; VAR 904 (parte lógica); VAR_PMOVIL 11 |
| PRM-POR-041 | `por.payments.allInvoicesOfCoupon` | Boolean | T | false | Rehacer el cupón con todas sus facturas si cambió la deuda | VAR_PMOVIL 13 |
| PRM-POR-042 | `por.payments.minAmount` | Decimal | T | 0 | Importe mínimo por pago | VAR 904 (parte numérica) |
| PRM-POR-043 | `por.payments.couponDueDays` | Int | T | 3 | Días de vencimiento del cupón | VAR 2585 |
| PRM-POR-044 | `por.payments.deferInterest` | Boolean | T/S | false | Diferir recargos al próximo período (política M08) | VAR_PMOVIL 12 |
| PRM-POR-045 | `por.payments.defaultEntity` | Ref | T | — | Entidad/pasarela por defecto | VAR 2774 |
| PRM-POR-046 | `por.payments.receiptCopyEmail` | Email | T | — | Copia de comprobantes de pago/recarga | VAR 2499 |
| PRM-POR-047 | `por.payments.templates` | Object | T | Plantillas estándar | Plantillas de factura de autogestión, recibo y comprobante para pago | VAR 2551; `FacturaCooponline.html`, `ReciboCooponline.html` |
| PRM-POR-048 | `por.payments.allowDirectDebitInvoices` | Enum | T | `noPermitir` | `noPermitir`, `siempre`, `soloConRecargo` | VAR_PMOVIL 63 |
| PRM-POR-049 | `por.payments.cartEnabled` | Boolean | T | true | Carro de facturas | VAR_PMOVIL 45 |
| PRM-POR-050 | `por.digitalInvoice.channels` | Enum | T | `soloMail` | `noPermitir`, `soloMail`, `mailYWhatsapp` | VAR_PMOVIL 32 |
| PRM-POR-051 | `por.digitalInvoice.requiredContacts` | Enum | T | `mail` | `mail`, `mailYTelefono` | VAR_PMOVIL 911 |
| PRM-POR-052 | `por.publicInvoiceLookup.enabled` | Boolean | T | false | Consulta/pago sin login | VAR_PMOVIL 61 |
| PRM-POR-053 | `por.publicInvoiceLookup.scope` | Enum | T | `soloImpagas` | `soloImpagas` (único permitido; ver CTR-POR-06) | VAR_PMOVIL 60 |
| PRM-POR-054 | `por.payments.cashCouponPdf` | Boolean | T | true | Cupón PDF para pago en efectivo | VAR_PMOVIL 21 |
| PRM-POR-055 | `por.payments.channelsMode` | Enum | T | `todos` | `soloOffline`, `offlineOnlineYCaja`, `todos` | VAR 2645 |
| PRM-POR-056 | `por.directDebit.mode` | Enum | T | `nativo` | `nativo`, `urlExterna` (URL en `por.directDebit.externalUrl`) | VAR_PMOVIL 27 |
| PRM-POR-057 | `por.payments.confirmationMessage` | Enum | T | `ninguno` | `ninguno`, `sms`, `whatsapp` | VAR_PMOVIL 53 |
| PRM-POR-058 | `por.payments.thirdPartySummary.enabled` | Boolean | T | false | Cobro de resúmenes de terceros (PA-POR-18); entidad y sucursal en M07 | VAR 3114; VAR_PMOVIL 68 |
| PRM-POR-059 | `dict:por.prepaga.conceptoPasarela` | Texto | T | — | Descripción del concepto de recarga en la pasarela (convenio SIRO en bóveda M07) | VAR_PMOVIL 42, 43 |
| PRM-POR-060 | `por.consumption.enabled` | Boolean | T | true | Pestaña de consumos | VAR_PMOVIL 31 (inverso) |
| PRM-POR-061 | `por.selfReading.enabled` | Boolean | S/C | false | Autolectura habilitada | MER-018 |
| PRM-POR-062 | `por.selfReading.windowDays` | Int | S | 5 | Días de ventana de autolectura | MER-018 |
| PRM-POR-063 | `por.prepaid.enabled` | Boolean | T/S | false | Recarga prepaga en el portal | VAR_PMOVIL 11 (prepaga CoopOnline) |
| PRM-POR-064 | `por.prepaid.requestTtlSeconds` | Int | T | 600 | Vida de la solicitud de recarga | RN-10 §3.3 |
| PRM-POR-065 | `por.consumption.myMeterButton` | Boolean | T | false | Botón "Mi Medidor" | VAR_PMOVIL 55 |
| PRM-POR-066 | `por.ddjj.requireData` | Boolean | T | true | Exigir datos completos en DDJJ de artefactos | VAR_PMOVIL 44 |
| PRM-POR-067 | `por.ddjj.showMissingWarning` | Boolean | T | false | Advertencia de DDJJ no presentada (formulario base en `portalForms`, ex plantilla VAR 2742) | VAR_PMOVIL 59; VAR 2742 |
| PRM-POR-068 | `por.adherents.allowSameServiceOtherAccount` | Boolean | T | false | Adherente del mismo servicio en otra cuenta | VAR 2400 |
| PRM-POR-069 | `por.evCharging.enabled` | Boolean | T | false | Carga/declaración de vehículos eléctricos | VAR_PMOVIL 75 |
| PRM-POR-070 | `por.contracting.documentTemplates` | Object | T/S | — | Plantillas de solicitud de ingreso, contrato de servicio y fianzas firmadas en la contratación online | VAR 103, 205, 206, 335 |
| PRM-POR-071 | `por.contracting.overdueDebtPolicy` | Enum | T/S | `avisar` | `noControlar`, `avisar`, `requerirRegularizar` (nunca afecta baja, pago ni reclamo) | VAR_PMOVIL 37 |
| PRM-POR-072 | `por.contracting.immediateActions` | [Enum] | T/S | `[adhesionFacturaDigital, adhesionDebito, recargaPrepaga]` | Acciones de autoservicio inmediato (PA-POR-05) | — |
| PRM-POR-073 | `por.orders.hideTechnicalObservations` | Boolean | T | true | Ocultar observaciones técnicas de OT | VAR_PMOVIL 73 |
| PRM-POR-074 | `por.claims.autoWorkOrder` | Boolean | T/S | false | Reclamo técnico genera OT | VAR_PMOVIL 58 |
| PRM-POR-075 | `por.orders.showWorkOrders` | Boolean | T | true | Mostrar OT al socio | VAR 801 |
| PRM-POR-076 | `por.appointments.enabled` | Boolean | T | false | Turnos online | VAR_PMOVIL 67 |
| PRM-POR-077 | `por.appointments.dniSuffixCode` | Boolean | T | false | Código de turno con últimos 3 dígitos del DNI, sin impresión | VAR 3064 |
| PRM-POR-078 | `por.notifyEmails` | Object | T | — | `{ reclamos, contactos, tramites }` casillas de aviso al tenant | VAR 804, 812; VAR_PMOVIL 49 |
| PRM-POR-079 | `por.chat.enabled` | Boolean | T | true | Chat/bot con la cooperativa (M09) | VAR 2683 (reinterpretado) |
| PRM-POR-080 | `por.publicUnsubscribe.extraServices` | [Ref] | T | [] | Servicios adicionales a los obligatorios con botón de baja | — |
| PRM-POR-081 | `por.publicUnsubscribe.codeHours` | Int | P/T | 24 | Plazo máximo de código (el tenant solo puede reducir) | Res. 316/2018 |
| PRM-POR-082 | `por.publicUnsubscribe.receiptHours` | Int | P/T | 72 | Plazo máximo de constancia (solo reducible) | Ley 24.240 art. 10 ter |
| PRM-POR-083 | `por.visits.technicianLiveMap` | Boolean | T | false | Mostrar ubicación del técnico | — |
| PRM-POR-084 | `por.claims.reopenDays` | Int | T/S | 7 | Plazo de reapertura | — |
| PRM-POR-085 | `por.news.enabled` | Boolean | T | true | Noticias/novedades en landing y portal | VAR 2733 |
| PRM-POR-086 | `por.wall.commentsDefault` | Boolean | T | false | Comentarios de socios por defecto (PA-POR-17) | DEC-008 |
| PRM-POR-087 | `por.surveys.bannerEnabled` | Boolean | T | true | Banner de encuestas pendientes (nunca bloqueante) | CNX §3.4 |
| PRM-POR-088 | `por.notifications.defaultValidityDays` | Int | T | 30 | Vigencia de notificaciones por cuenta | RN-10 §3.6 |
| PRM-POR-089 | `por.landing.legacyRedirects` | [Object] | T | [] | Redirecciones de URLs de CoopOnline | RN-10 §14 |
| PRM-POR-090 | `por.drafts.retentionDays` | Int | T | 30 | Vigencia de borradores | — |
| PRM-POR-091 | `por.roleLanding.overrides` | Object | T | — | Ruta de inicio por rol (si el tenant personaliza) | CNX §3.3 |
| PRM-POR-092 | `por.visits.rescheduleMinHours` | Int | T/S | 24 | Anticipación mínima para reprogramar/cancelar | BASE §50 |
| PRM-POR-093 | `por.visits.maxReschedules` | Int | T/S | 2 | Reprogramaciones por autoservicio | BASE §50 |
| PRM-POR-094 | `por.employee.enabled` | Boolean | T | false | Portal del empleado | §104 |
| PRM-POR-095 | `por.employee.payslip.signBeforeDownload` | Boolean | T | false | No descargar recibo antes de firmar | VAR 3122 |
| PRM-POR-096 | `por.employee.payslip.requirePreviousSigned` | Boolean | T | false | No acceder al recibo actual sin firmar el anterior | VAR 3166 |
| PRM-POR-097 | `por.employee.nonUserProfile` | Ref | T | Perfil "Portal empleado" | Perfil para empleados no usuarios | VAR_PMOVIL 41 |
| PRM-POR-098 | `por.employee.stepUpMinutes` | Int | T | 15 | Reautenticación para recibos/legajo | — |
| PRM-POR-099 | `por.ui.defaultTheme` | Enum | T | `oscuro` | `oscuro`, `claro`, `sistema` (alto contraste siempre disponible) | CNX §3.1 |
| PRM-POR-100 | `por.kiosk.enabled` | Boolean | T | false | Tótems habilitados | INV `AutoGestion` |
| PRM-POR-101 | `por.kiosk.defaultSearch` | Enum | T | `documento` | `asociado`, `cuenta`, `documento`, `codigoQr` (por dispositivo en `kioskDevices`) | VAR 2790 |
| PRM-POR-102 | `por.kiosk.idleSeconds` | Int | T | 60 | Inactividad para volver al inicio | INV `GoHome` |
| PRM-POR-103 | `por.kiosk.autoOpenCashbox` | Boolean | T | true | Abrir caja del dispositivo si está cerrada (clave de cierre y lector de billetes por dispositivo) | RN-10 §3.3; VAR 2347, 2351, 2352 |
| PRM-POR-104 | `por.uploads.limits` | Object | T | `{ maxSizeMb: 10, maxFiles: 10, types: [jpg, png, pdf, heic] }` | Límites de adjuntos | — |
| PRM-POR-105 | `por.landing.rssEnabled` | Boolean | T | false | Feed RSS de noticias | CAT `RSSFEED` |

## 15. Reportes, indicadores y exportaciones

Todos con filtro de tenant (y servicio, sucursal, canal cuando aplique), fecha de corte = fin del día anterior en la zona del tenant salvo indicación, exportables XLSX/CSV/PDF y publicados a T10.

| Indicador | Fórmula | Universo | Fecha de corte |
|---|---|---|---|
| Usuarios registrados | Cantidad de pertenencias con perfil portal | Pertenencias activas del tenant | Corte |
| Tasa de vinculación | Cuentas con ≥ 1 acceso `titular` activo / cuentas con contratos activos | Cuentas activas M01 | Corte |
| Adopción de factura digital | Cuentas adheridas / cuentas activas | Cuentas activas | Corte |
| Participación del pago online | Importe cobrado por canal portal (incluye tótem separado) / importe cobrado total del período | Pagos imputados del período | Fin de período |
| Tiempo de contratación | Mediana de (fecha `at` del evento `cat.contract.activated` − `formSubmission.submittedAt`; antes `cat.contract.activated.at`, PA-POR-22) | Altas por portal activadas en el período | Fin de período |
| Abandono de formularios | Borradores vencidos sin envío / (borradores iniciados) por formulario | Borradores del período | Fin de período |
| Bajas públicas en plazo | Bajas con código entregado ≤ 24 h y constancia ≤ 72 h / bajas públicas recibidas | Recepciones públicas del período | Fin de período |
| Vinculaciones fallidas | Intentos con `datosInvalidos` / intentos totales; bloqueos | Intentos del período | Diario |
| Autoservicio de gestiones | Casos abiertos por portal / casos totales | Casos M09 del período | Fin de período |
| Satisfacción | Promedio de encuestas post-instalación y post-reclamo | Respuestas del período | Fin de período |
| Pagos inciertos | Checkouts en `uncertain` > 24 h | Checkouts del período | Diario |
| Activación de migrados | Usuarios activados / usuarios importados | Lote de migración | Diario |
| Uso por rol y espacio | Sesiones únicas por rol de inicio/espacio | Sesiones del período | Diario |
| Disponibilidad de tótems | Minutos `activo` / minutos de horario de sucursal | Tótems activos | Diario |
| Accesibilidad | Errores críticos de auditoría automática por release | Rutas esenciales | Por release |

Exportaciones operativas: accesos de una cuenta (PAN-POR-90), recepciones públicas con plazos (PAN-POR-91), presentaciones por formulario (PAN-POR-97), informe de conciliación de migración (PAN-POR-92).

## 16. Casos de uso

### 16.1. Casos de uso originales de BASE

| CU | Título | Actor | Flujo resumido | Resultado / excepción | Requisitos |
|---|---|---|---|---|---|
| CU-25 | Consultar y pagar una factura | Asociada titular (Ana) con acceso validado a SUM-AG-001 | 1) Ingresa y selecciona la cuenta. 2) Consulta FAC-DEMO-001 y, con saldo, inicia el pago por el canal habilitado. 3) Ve el resultado confirmado y descarga el comprobante o registra una consulta. | Gestión con acceso restringido a cuentas autorizadas y estado de pago consistente con el backend. **Excepción:** si intenta vincular una cuenta ajena sin verificación suficiente se deniega y se ofrece el circuito de acreditación. | RF-POR-033…039, 078…096; RN-POR-003, 024 |
| CU-MAR-01 | Alta de tenant con marca y landing (definición dueña: T03 «CU-MAR-01 — Personalizar la marca de la cooperativa»; aquí se cita el caso original de BASE §43 y M19 solo es dueño de los pasos de landing y app del socio) | Administrador de plataforma y administrador de la cooperativa | 1) Alta de TEN-001. 2) La cooperativa dispone de admin y configuración de landing. 3) Carga marca, colores, logos (desktop, móvil, empleados, socios) y splash (T03). 4) Configura la landing (bloques, servicios, acceso a la app). 5) Revisa y publica. 6) Un socio consulta Internet e ingresa a la app. 7) En su sesión consulta servicios y solicita la activación de Internet. 8) Si solicita desactivar, se aplica el circuito y se ve el estado real. | Administración y landing con marca; el socio gestiona servicios sin confundir solicitud con ejecución. **Controles:** no modificar marca de otro tenant; no divulgar cuentas desde la landing; no gestionar contratos ajenos. | RF-POR-001…005, 015, 054, 056, 065, 071, 150; RN-POR-011, 012, 067 |
| CU-NOT-01 | Publicar noticias por canal | Empleado con rol de publicación | Crea "Mantenimiento programado de agua" para landing y muro de socios; crea "Capacitación interna" solo para empleados (T09). | La primera aparece en landing y muro de socios; la segunda solo en el espacio empleado. **Excepción:** sin permiso de publicación, solo lectura. | RF-POR-007, 125, 134; RN-POR-051 |
| CU-AUT-01 | Ciclo completo de Internet | Socia ASO-001 (Ana) | Consulta INT-100 en la landing → contrata en la app → caso y requisitos → elige franja VIS-DEMO-001 (10-11-2026, 09:00–11:00) → OT-INT-DEMO-001 → instalación y activación con fecha efectiva → consulta factura separada de Internet → paga → reclamo con foto por chat → puede suspender, reactivar o dar de baja. | Cada gestión conserva resultado, fechas y relación con facturación. **Controles:** visita fallida no activa; Internet abono fijo no muestra consumos inventados. | RF-POR-056…077, 078…096, 109…112; RN-POR-021, 022 |
| CU-CIC-01 | Suspensión temporal y reactivación (definición dueña: M08 «CU-CIC-01 — Suspensión temporal y reactivación de Internet», PA-MOR-21; aquí solo el tramo del portal) | Ana | Solicita suspender Internet desde una fecha; ve condiciones (SUS-DEMO-GRATIS, ARS 0); el tenant ejecuta; solicita reactivar; el sistema muestra si es gratuita (REACT-DEMO-GRATIS) o con cargo válido. | Vuelve a "Activo" solo con confirmación técnica; el pago de un cargo no anuncia "reactivado". | RF-POR-066; RN-POR-019, 020 |
| CU-REG-01 | Registro y contratación por persona nueva | Persona nueva (USR-NUEVO-B) en TEN-002 | Entra a la landing de B, se registra, elige Gas, completa solicitud y requisitos; si necesita asociarse, se informa y registra. | Usuario registrado con solicitud en trámite antes de tener suministro; la cuenta se asigna cuando corresponda. | RF-POR-022…024, 056, 060; RN-POR-001 |

### 16.2. Casos de uso nuevos

| CU | Título | Actor | Precondición | Flujo principal | Alternativas / excepciones | Requisitos |
|---|---|---|---|---|---|---|
| CU-POR-01 | Vincular cuenta existente con código de socio y clave | Socio registrado | Tiene factura con código y clave | Mis cuentas → FAB → método "Código de socio y clave" → datos → acceso `titular` activo → aviso al titular | Datos erróneos: mensaje genérico; 6.º intento: bloqueo 15 min; documento no coincide: `autorizadoConsulta` pendiente de confirmación | RF-POR-033, 039, 040; RN-POR-003…006 |
| CU-POR-02 | Vinculación asistida en sucursal | Operador + socio | Socio identificado presencialmente | Operador emite código (PAN-POR-89) → socio lo canjea en la app → acceso activo | Código vencido (72 h) o usado por otro DNI: rechazo | RF-POR-037, 154 |
| CU-POR-03 | Activar acceso de usuario migrado de CoopOnline | Usuario de CoopOnline | Importado y invitado | Abre invitación o `/activar` → OTP → contraseña → ve sus cuentas y adhesiones | Correo compartido por varias personas: conflicto, vinculación asistida | RF-POR-031, 169…173 |
| CU-POR-04 | Baja pública de Internet sin registro | Visitante titular | Servicio con botón de baja | Botón de baja → servicio → identificación → medio → código en pantalla y por correo → constancia ≤ 72 h → seguimiento por código | No identificable automáticamente: operador identifica; envío fallido: tarea y canal alternativo | RF-POR-009…011, 156; RN-POR-013…017 |
| CU-POR-05 | Pagar varias facturas con cupón único en efectivo | Socio titular | Pagos habilitados, cupón PDF habilitado | Facturas → seleccionar 3 → Pagar → "Cupón para efectivo" → PDF con código de barras, vence hoy + 3 | Deuda cambió: aviso y rehacer; factura bloqueada: no seleccionable | RF-POR-089…092; RN-POR-026…029 |
| CU-POR-06 | Pago con tarjeta y confirmación diferida | Socio titular | Pasarela habilitada | Checkout → pasarela → retorno "Pendiente de confirmación" → webhook → "Confirmado" → "Imputado" → recibo por correo | Rechazo: motivo y reintento con nueva clave; incierto: "En verificación" sin permitir pagar dos veces | RF-POR-094, 095; RN-POR-024, 025, 035 |
| CU-POR-07 | Hermano paga la factura del otro (ESC-01) | Hermano A con acceso `pagar` a la cuenta de B o pagador eventual | — | Paga con código la factura de B por ARS 13.000 | Si paga de más, el excedente no cancela otras deudas ajenas | RF-POR-045, 100; RN-POR-030 |
| CU-POR-08 | Autorizar a un familiar a consultar y pagar | Titular | Acceso titular | Representaciones → Autorizar → contacto, cuenta, acciones `consultar` y `pagar`, vigencia 6 meses → invitado acepta | Titular revoca: siguiente solicitud del invitado → 403 | RF-POR-043; RN-POR-007, 008 |
| CU-POR-09 | Coordinar y reprogramar visita de instalación | Socio | Caso aprobado | Coordinar visita → franja → confirmar → recordatorio → reprogramar dentro del plazo → técnico en camino → conformidad firmada → encuesta | Última franja tomada: 409 y nuevas opciones; visita sin acceso: reprogramar, servicio sigue pendiente | RF-POR-072…077; RN-POR-021, 023 |
| CU-POR-10 | Reclamo con foto sin conexión | Socio | — | Nueva gestión sin señal → borrador en cola → al volver señal se envía una vez → número de caso → OT automática (si configurado) | Reenvío duplicado: misma respuesta por `clientMutationId` | RF-POR-109, 113, 117; RN-POR-025, 070 |
| CU-POR-11 | Autolectura de agua | Socio con servicio medido | Ventana abierta | Autolectura → foto → OCR propone 01234 → confirma → M03 valida → "Aceptada" | Fuera de rango: "En revisión"; ventana cerrada: próxima fecha | RF-POR-107; RN-POR-064, 065 |
| CU-POR-12 | Recarga prepaga | Socio con servicio prepago | Prepaga habilitada | Prepaga → ARS 5.000 → capital ARS 4.500 (recargo ARS 500) → pagar → crédito acreditado → factura de autogestión | Solicitud vencida (600 s): nueva cotización | RF-POR-108; RN-POR-033, 034 |
| CU-POR-13 | Adherirse a factura digital y débito automático | Socio titular | Correo verificado | Factura digital → correo → confirmado; Débito → componente tokenizado → constancia | Correo sin verificar: verificar primero | RF-POR-086, 097; RN-POR-039, 040 |
| CU-POR-14 | Presentar DDJJ de artefactos | Socio de gas o de energía (HUE-GAS-01; texto original: "Socio de energía") | Plantilla de DDJJ del servicio en M02 (PRM-CAT-110) y formulario publicado | DDJJ → grilla según la plantilla del servicio (gas: potencia en kcal/h; energía: artefactos eléctricos y vehículos eléctricos) → presentar → operador acepta en PAN-CAT-25 → artefactos vigentes pasan a histórico | Servicio sin plantilla de DDJJ: no se ofrece (texto original: "Servicio no energía: no se ofrece"); fila de gas sin potencia: se rechaza en el campo | RF-POR-069; RN-POR-042; RF-CAT-095 |
| CU-POR-15 | Pedir turno de atención presencial | Socio | Turnos habilitados | Turnos → sucursal, área, hora → número y tiempo estimado → QR en sucursal | Sin disponibilidad: próximo día | RF-POR-118…120; RN-POR-073 |
| CU-POR-16 | Firmar recibo de sueldo | Empleado-socio | Espacio empleado habilitado | Cambia a "Mi trabajo" → reautenticación → recibo de octubre → firmar con OTP → descargar | Recibo anterior sin firmar con 3166 activo: bloqueo explicado | RF-POR-129, 130, 136; RN-POR-010, 058 |
| CU-POR-17 | Inicio de socio moroso y suspendido | Socio | Deuda vencida / suspensión por mora | Ingresa → banner crítico → paga → "Pago confirmado — reconexión en trámite" → evento de reconexión → banner desaparece | Puede pedir la baja con deuda | RF-POR-047, 049, 050; RN-POR-056, 057 |
| CU-POR-18 | Publicar nueva versión de landing | Administrador de contenidos + publicador | — | Editor → bloques → revisión → aprobar → programar → publicación automática → revertir si hace falta | Quitar botón de baja con Internet ofertado: validación lo impide | RF-POR-002, 003, 150; RN-POR-067, 077 |
| CU-POR-19 | Crear formulario de alta de un servicio | Administrador funcional | Servicio habilitado | Formularios → nuevo → pasos/campos → comando `crm.openServiceRequest` → publicar v1 | Cambios posteriores → v2; presentaciones de v1 intactas | RF-POR-151…153; RN-POR-046 |
| CU-POR-20 | Pagar factura sin ingresar | Visitante | PRM-POR-052 activo | `/pagar` → cuenta + verificador → impagas enmascaradas → pagar como invitado | Datos erróneos: respuesta genérica; límite por IP | RF-POR-012; RN-POR-060 |
| CU-POR-21 | Cambiar de cooperativa | Persona socia de TEN-001 y TEN-002 | Dos pertenencias | Selector de ámbito → TEN-002 → se purgan datos de TEN-001 → inicio de TEN-002 | — | RF-POR-027; RN-POR-009 |
| CU-POR-22 | Pago en tótem con efectivo | Socio en sucursal | Tótem activo | Tótem → documento → deuda → efectivo en billetero → recibo impreso | Excedente: anticipo si permitido; periférico con error: fuera de servicio | RF-POR-162…168; RN-POR-074 |
| CU-POR-23 | Ver portal como socio | Operador de atención | Llamada del socio | Ficha de cuenta → "Ver como socio" → motivo → vista solo lectura | Intento de pagar: botón deshabilitado | RF-POR-160; RN-POR-069 |

## 17. Criterios de aceptación y escenarios de prueba

### 17.1. Escenarios funcionales

| ID | Escenario | Resultado esperado | Requisitos |
|---|---|---|---|
| PR-POR-01 | Piloto Internet extremo a extremo (O6): registrarse, contratar INT-100, coordinar visita, firmar conformidad, ver factura, pagar, reclamar, pedir la baja | Cada paso completado desde la PWA; estados de trámite y servicio siempre separados; la baja no genera cargo | DEC-005, CU-AUT-01 |
| PR-POR-02 | ESC-01: A debe ARS 13.000 y paga ARS 15.000; B (mismo domicilio) tiene deuda | ARS 13.000 imputados a A; ARS 2.000 a favor/pendiente según política; la deuda de B no cambia; conciliación cuadra | RN-POR-030 |
| PR-POR-03 | Doble envío del mismo checkout (doble toque, reintento de red) | Un solo checkout; misma respuesta | RN-POR-025 |
| PR-POR-04 | Retorno de pasarela sin webhook | "Pendiente de confirmación"; no se libera deuda; al llegar webhook pasa a confirmado | RN-POR-024 |
| PR-POR-05 | Webhook duplicado | Un solo pago imputado | M07, RN-POR-025 |
| PR-POR-06 | Deuda cambió entre la consulta y el pago (se generó interés) | Se informa diferencia y se pide confirmar | RN-POR-026 |
| PR-POR-07 | Baja pública de Internet sin registro | Código mostrado al instante y enviado; constancia ≤ 72 h; sin pedir deuda ni registro | RN-POR-013…015, checklist 44 |
| PR-POR-08 | Envío del código de baja rebota | Tarea al operador, intento por canal alternativo, indicador de plazo en riesgo | RN-POR-054 |
| PR-POR-09 | Dos socios reservan la última franja | Solo una reserva confirmada | RN-POR-023, checklist 36 |
| PR-POR-10 | Visita fallida | Servicio sigue "Pendiente de alta" | RN-POR-021 |
| PR-POR-11 | Pago de cargo de reactivación sin confirmación técnica | Servicio sigue suspendido con "Reconexión en trámite" | RN-POR-020 |
| PR-POR-12 | Comprobante agrupado Agua + Internet con pago parcial | Saldo por servicio cuadra con el total según regla de imputación visible | FAC-008, FAC-011 |
| PR-POR-13 | Borrador interrumpido por expiración de sesión | Reingreso retoma el mismo paso con los datos | RN-POR-050 |
| PR-POR-14 | Formulario publicado v2 con presentaciones v1 en curso | Las v1 se procesan con su versión | RF-POR-151 |
| PR-POR-15 | Ejecución de formulario falla a mitad (adherentes) | No queda nada persistido parcialmente; presentación sigue `enviada` con error visible al operador | RN-POR-046 |
| PR-POR-16 | Migración: volcado con 1.000 usuarios, 1.300 vínculos, 20 correos duplicados | Informe cuadra: creados + fusionados + conflictos + descartados = 1.000; vínculos creados + rechazados = 1.300 | RF-POR-169 |
| PR-POR-17 | Encuesta pendiente | El socio puede pagar, reclamar y pedir la baja | RN-POR-053 |
| PR-POR-18 | Servicio no medido | Sin pestaña de consumos | RN-POR-022 |
| PR-POR-19 | Offline: reclamo con 3 fotos creado sin red | Enviado una vez al volver; fotos completas | RF-POR-117 |
| PR-POR-20 | Tenant suspendido por plataforma | Landing muestra aviso pero el botón de baja funciona | RN-POR-077 |

### 17.2. Permisos negativos y aislamiento

| ID | Escenario | Resultado esperado |
|---|---|---|
| PR-POR-21 | Usuario A pide `GET /api/por/invoices/:id` de una factura de cuenta sin acceso | 404 (no revela existencia); auditoría |
| PR-POR-22 | Autorizado con solo `consultar` llama `POST /api/por/checkouts` | 403 |
| PR-POR-23 | Acceso revocado; el usuario usa una URL firmada de PDF emitida antes | Falla al caducar (≤ 5 min) y no se emiten nuevas |
| PR-POR-24 | Token de TEN-001 sobre recurso de TEN-002 (aun con IDs válidos) | 404; el plugin de tenancy impide la consulta |
| PR-POR-25 | Cambio de ámbito TEN-001 → TEN-002 | Sin datos de TEN-001 en Pinia, Service Worker, IndexedDB ni colas |
| PR-POR-26 | Socio-empleado en espacio socio llama `/api/por/empleado/payslips` sin cambiar de espacio | 403 hasta seleccionar espacio y pasar reautenticación |
| PR-POR-27 | Login con Google cuyo correo coincide con un titular | No se crea acceso a ninguna cuenta (checklist 47) |
| PR-POR-28 | Enumeración: 100 vinculaciones con números de cuenta consecutivos | Respuestas idénticas en contenido y tiempo; bloqueo a los 5 intentos; alerta |
| PR-POR-29 | Consulta pública de factura con número válido y verificador erróneo | Respuesta genérica; nunca nombre ni domicilio |
| PR-POR-30 | Publicación interna intentada en landing por copia de plantilla | No aparece en landing |
| PR-POR-31 | Editor sin `por.landing.publicar` intenta publicar | 403 |
| PR-POR-32 | Operador abre "ver como socio" e intenta pagar | Acción deshabilitada y 403 en API; auditoría con motivo |
| PR-POR-33 | Tótem con credencial revocada | Sesión rechazada; pantalla fuera de servicio |

### 17.3. Accesibilidad y no funcionales del canal

| ID | Escenario | Resultado esperado |
|---|---|---|
| PR-POR-34 | Recorridos contratar, pagar, reclamar, baja pública solo con teclado y lector de pantalla (NVDA/VoiceOver) | Completables; foco visible; anuncios de errores |
| PR-POR-35 | Color de marca amarillo claro | Contraste ajustado automáticamente ≥ 4.5:1 |
| PR-POR-36 | Zoom 200 % y ancho 320 px | Sin pérdida de contenido ni desplazamiento horizontal (salvo tablas con alternativa) |
| PR-POR-37 | Coordinación de visita sin mapa ni arrastre | Completable con lista de franjas |
| PR-POR-38 | Auditoría axe por release | Sin errores críticos en rutas esenciales |
| PR-POR-39 | Rendimiento landing (4G simulado) | LCP ≤ 2,5 s en portada publicada (meta a validar en T08) |
| PR-POR-40 | Instalación PWA desde TEN-001 | Ícono, nombre y splash de TEN-001 |

## 18. Datos de precarga (ficticios)

Todos los datos son ficticios; los correos usan `example.com` y no corresponden a personas reales.

### 18.1. Tenants y landing

| Código | Datos | Uso |
|---|---|---|
| TEN-001 | "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet, Sepelio | Piloto Internet; CU-MAR-01, CU-AUT-01 |
| TEN-002 | "Cooperativa Ejemplo B", slug `coop-ejemplo-b` (R14; antes `ejemplo-b`), colores #6A1B9A / #F9A825 (contraste ajustado por RN-POR-063), servicios Gas, Energía | CU-REG-01; aislamiento PR-POR-24 |
| LND-A-v1 | Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja, pie legal | PAN-POR-01 |
| LND-A-v2 | Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión | CU-POR-18 |
| LND-B-v1 | Landing de TEN-002 publicada | CU-REG-01 |

### 18.2. Usuarios, cuentas y accesos

| Código | Datos | Accesos |
|---|---|---|
| USR-ANA | ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 | `titular` de SUM-AG-001 (Agua) y del contrato INT-100 |
| USR-HNO | hermano-a@example.com | `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) |
| USR-NUEVO-B | nuevo-b@example.com, registrado en TEN-002 sin cuenta | Ninguno; solicitud de Gas en trámite |
| USR-MIGR | migrado@example.com, importado de CoopOnline con 2 vínculos | `invitado` hasta activar |
| USR-EMP | empleado@example.com, socio de TEN-001 y empleado | Espacio socio + espacio empleado |
| USR-MOROSO | moroso@example.com | `titular` de SUM-EN-010 con deuda vencida ARS 48.000 |
| USR-SUSP | suspendido@example.com | `titular` de SUM-EN-011 suspendido por mora |

### 18.3. Servicio, trámites, visitas y facturas

| Código | Datos |
|---|---|
| INT-100 | Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por 3 ciclos), instalación ARS 20.000 sin descuento, ONT en comodato; primer comprobante neto ARS 30.000,00 (M04 9.3.9). Texto de la versión de la fase 1: "abono ficticio ARS 15.000, instalación ARS 20.000 con promoción 50 % por 3 meses, ONT en comodato". Los importes de FAC-DEMO-001/002 son totales finales ficticios con impuestos. Texto original: "Plan Internet 100 Mb, abono ARS 18.000 final, instalación ARS 0 en campaña" |
| CASE-INT-001 | Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" |
| VIS-DEMO-001 | Visita 10/11/2026, franja 09:00–11:00, técnico "Técnico Demo 1" |
| OT-INT-DEMO-001 | Orden de instalación ligada a VIS-DEMO-001, con módem en comodato SN `DEMO-SN-0001` |
| FAC-DEMO-001 | Factura de Internet período 11/2026, ARS 18.000, vence 10/12/2026 |
| FAC-DEMO-002 | Comprobante agrupado Agua + Internet ARS 31.500 (Agua 13.500, Internet 18.000) |
| FAC-HNO-001 | Factura de SUM-AG-002 ARS 13.000 (ESC-01) |
| BAJA-DEMO | Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo |
| SUS-DEMO-GRATIS | Suspensión temporal de Internet hasta 3 meses, ARS 0 |
| REACT-DEMO-GRATIS | Reactivación dentro del plazo, ARS 0 |
| REACT-DEMO-ARANCEL | Reactivación posterior al plazo ARS 5.000, **deshabilitada** hasta validación legal |
| PRE-DEMO-001 | Servicio de energía prepaga con crédito ARS 2.300 |

### 18.4. Formularios, contenidos y dispositivos

| Código | Datos |
|---|---|
| FRM-INT-ALTA | Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` |
| FRM-DDJJ-ART | DDJJ de artefactos v1 (energía): artefactos eléctricos y vehículos eléctricos, plantilla `electricAppliancesAndVehicles` de M02 (HUE-GAS-01) |
| FRM-DDJJ-GAS | DDJJ de artefactos a gas v1: artefacto, cantidad y potencia en kcal/h, plantilla `gasAppliances` de M02 para GAS-RES (HUE-GAS-01) |
| CEM-BUSCAR-DEMO | Buscador de difuntos habilitado en TEN-001 (PRM-SOC-050 = true) con un registro ficticio "Difunto Demo", sector A, unidad 12 (HUECO-CEM-02) |
| FRM-ADHERENTE | Alta de adherente a Sepelio v1 |
| FRM-CAMBIO-TIT | Cambio de titularidad v1 con evidencia obligatoria |
| NOT-001 | Noticia pública "Mantenimiento programado de agua" (landing + muro de socios) |
| NOT-002 | Aviso interno "Capacitación interna" (solo empleados) |
| BAN-001 | Banner "Tenés facturas vencidas" para rol `socioMoroso` |
| BAN-002 | Banner "Internet 300 Mb en tu zona" para `registradoSinCuenta` |
| KSK-001 | Tótem "Sucursal Centro", caja 5, búsqueda por documento, efectivo + QR |
| PUB-BAJA-001 | Recepción pública de baja de Internet con código `BJ-26-000123` (identificada) |

## 19. Migración

### 19.1. Mapeo de origen a destino

| Origen ProCoop / CoopOnline | Destino CoopApps | Tratamiento |
|---|---|---|
| `WS_USERS` (correo, celular, nombre, apellido, fecha de alta, fecha de validación) | T02 (identidad) + `legacyPortalUserMap` | Se importan datos de contacto y fechas; **las contraseñas no se importan** (PA-POR-03); correo validado → `emailVerified` si `FEC_VALIDACION` existe; duplicados por correo se fusionan por persona o pasan a conflicto |
| `WS_USERS_ACCOUNTS` (usuario, suministro, titular) | `portalAccountAccess` | Rol `titular` si el DNI del usuario coincide con el titular de M01; si no, `autorizadoConsulta` en `pendienteVerificacion` con aviso al titular |
| `REQUISITOS` / `REQUISITOS_ITEMS` | `portalForms` en `borrador` | Campos y tipos se convierten; las consultas SQL embebidas (`INICIO_QUERY`, `FIN_QUERY`, `QUERY`, `QUERY_CONSULTA_WS`) **no se migran**: el administrador asigna catálogo o comando tipado (CTR-POR-07) |
| `Requisitos_Usuarios` del último año | `portalFormSubmissions` con `historico: true` | Solo lectura; adjuntos a almacenamiento privado; estados mapeados a RN-POR-047 |
| `WEB_NOVEDADES` | T09 (publicaciones canal landing/muro) | Título, descripción, orden, tipo |
| `NOTI_COOP` vigentes | T09 (avisos por cuenta) | Solo los no vencidos |
| `RSSFEED` | No se migra | El feed se regenera desde T09 (PRM-POR-105) |
| `WEB_LOG` | No se migra | Log de sincronización que desaparece |
| `WS_KEYS` | No se migra | Las claves de API se reemiten en T10 |
| Adhesiones a factura digital y débito automático vigentes | M05 / M07 | Por los importadores de esos módulos; el portal solo valida el conteo |
| `PAGOS360` pendientes de tipos 7, 9 y 11 | M07 | Se concilian antes del corte; los no resueltos pasan a `uncertain` |
| `ARTEFSUMS` / `HIS_ARTEFSUMS` | M02 `contractDeclaredAppliances` (RF-CAT-095; HUE-GAS-01; texto original: "M01 / M03") | Vigentes e históricos de DDJJ |
| `ADHSOC` | M18 `serviceDependents` (DEC-071, HUECO-TRV-01; texto original: "M01") | Adherentes |
| `VARIABLE_PMOVIL` (canal 1 y 3) y VAR web | PRM-POR-* | Según la tabla de origen del §14 y §22.5 |
| URLs públicas de CoopOnline | PRM-POR-089 | Redirecciones 301 |

### 19.2. Proceso y conciliación

1. Volcado de solo lectura de la base CoopOnline y de ProCoop (T11).
2. Validación en PAN-POR-92: formato, duplicados, cuentas inexistentes en M01, vínculos huérfanos.
3. Corrida de prueba en tenant de ensayo; informe de conciliación.
4. Corrida definitiva en la ventana de corte; redirecciones activas; JOB-POR de invitaciones.
5. Seguimiento del indicador "Activación de migrados" (§15).

Reglas de conciliación (bloquean el cierre del lote si no cuadran):

| Control | Fórmula |
|---|---|
| Usuarios | creados + fusionados + conflictos + descartados = filas de `WS_USERS` |
| Vínculos | accesos creados + pendientes + rechazados (cuenta inexistente, duplicado) = filas de `WS_USERS_ACCOUNTS` |
| Formularios | borradores creados = filas de `REQUISITOS` activas; campos = filas de `REQUISITOS_ITEMS` |
| Presentaciones | históricas importadas + descartadas (más de 1 año) = filas de `Requisitos_Usuarios` |
| Adhesiones | conteo de M05/M07 = adhesiones vigentes del origen |
| Pagos digitales | pendientes en origen = conciliados + `uncertain` en M07 |

Ninguna contraseña, token de dispositivo, clave de API ni credencial de la base web se transfiere.

## 20. Contraposiciones resueltas

| ID | Fuentes y conflicto | Resolución | Regla de prevalencia / justificación |
|---|---|---|---|
| CTR-POR-01 | BASE §25/§43 "activar/desactivar servicios" desde la app vs. BASE §48 "solicitar no equivale a ejecutar" | El portal **solicita**; el estado cambia solo con el evento del módulo dueño (RN-POR-011); excepciones en PRM-POR-072 | §48 es la regla específica y protege al socio de estados falsos |
| CTR-POR-02 | BASE §43 menciona costos de baja vs. BASE §52/§53 y Ley 24.240 art. 10 ter (baja sin cargo) | La solicitud de baja es siempre gratuita; solo pueden existir costos de servicios efectivamente prestados o devolución de equipos (RN-POR-013) | Prevalece la norma de orden público |
| CTR-POR-03 | BASE §44 (agrupación de servicios sin factura multiservicio) vs. BASE §103 (comprobante agrupado) | El portal muestra ambos casos: facturas separadas o comprobante agrupado con apertura por servicio (RF-POR-079, 082) | Lo decide la configuración de M05; el portal no impone uno |
| CTR-POR-04 | FIC 14.1 (base CoopOnline sincronizada por FTP/MySQL/Firebase) vs. portal como parte del mismo sistema (DEC-001, DEC-003) | El portal consume vistas y comandos en vivo; desaparecen la base espejo, `clsWEB` y los procesos de subida (§13) | Elimina desfasajes de deuda y pagos duplicados |
| CTR-POR-05 | VAR 904 "Acepta pago online" usado también como importe mínimo | Se separa en PRM-POR-040 (habilitar) y PRM-POR-042 (mínimo) | Un parámetro con dos semánticas induce errores |
| CTR-POR-06 | VAR_PMOVIL 60 (todos los comprobantes sin login) vs. control de BASE §25 (conocer la cuenta no basta) | Consulta sin login limitada a impagas y enmascaradas (PRM-POR-053, RN-POR-060; PA-POR-02) | Minimiza exposición de datos personales |
| CTR-POR-07 | Trámites de CoopOnline ejecutan un procedimiento almacenado cuyo nombre es la descripción del trámite vs. seguridad y DEC-003 | Cada formulario invoca un comando tipado registrado (RN-POR-046) | Elimina ejecución dinámica y acopla a contratos estables |
| CTR-POR-08 | Validación del DNI con CiDi en CoopOnline (vincula por coincidencia) vs. AGR-006 (identidad no concede pertenencia) | La identidad federada solo vincula si el tenant lo habilita y el DNI verificado coincide con el titular, con aviso (PA-POR-04) | Equilibra autoservicio y control |
| CTR-POR-09 | CoopOnline rechaza la cobranza si el importe pagado difiere del registrado vs. ESC-01 y AGR-012 (imputación con excedente) | El pago se imputa; el excedente queda a favor o pendiente según política, nunca contra otra deuda ajena (RN-POR-030) | Evita pagos "perdidos" y protege a terceros |
| CTR-POR-10 | Agente abre caja automáticamente si está cerrada vs. caja virtual por canal (M07) | Pagos del portal en caja virtual del canal; el tótem abre caja de dispositivo solo con PRM-POR-103 | Separa la cobranza digital de la presencial |
| CTR-POR-11 | CNX "phone shell" fijo vs. uso del portal desde PC | Phone shell en móvil y vista ancha en escritorio para facturas, consumos y gestiones (PRM-POR-024, PA-POR-07) | Muchos socios gestionan desde PC |
| CTR-POR-12 | Piel oscura forzada de CNX vs. WCAG 2.2 AA y tema del tenant | Tema por defecto configurable, alto contraste siempre disponible y corrección automática de contraste (PRM-POR-099, RN-POR-063) | Accesibilidad obligatoria (AGR-032) |
| CTR-POR-13 | CNX pide código de empresa en el login vs. subdominio por tenant | El tenant se resuelve por subdominio o dominio propio; el código solo en el buscador de plataforma (PAN-POR-21) | Menos fricción y menos errores de ingreso |
| CTR-POR-14 | BASE §46 deja comentarios de socios como pendiente vs. DEC-008 (muro editorial con comentarios moderados) | Comentarios habilitables por tenant y publicación, deshabilitados por defecto (PRM-POR-086, PA-POR-17) | Prevalece DEC-008 con prudencia operativa |
| CTR-POR-15 | CNX muestra banner de encuestas obligatorias vs. libre acceso a baja, pago y reclamo | Las encuestas nunca bloquean (RN-POR-053) | Ninguna encuesta puede ser barrera |
| CTR-POR-16 | AutoGestion.exe (tótem de escritorio Windows) vs. arquitectura web (DEC-001) | Modo tótem de la PWA con agente local para periféricos, en O10 (PA-POR-06) | Una sola base de código y misma lógica de cobro |
| CTR-POR-17 | TTL de solicitud prepaga de 600 s fijo en el Agente vs. parametrización por tenant | PRM-POR-064 con 600 s por defecto | Conserva el comportamiento con flexibilidad |
| CTR-POR-18 | VAR 2496/2752 (autorizar prepaga automáticamente o no registrarla en ProCoop) vs. confirmación por evento de M07 | La recarga se acredita solo con la confirmación de M07 (webhook o conciliación) | Evita acreditar sin cobro |

## 21. Preguntas abiertas

### PA-POR-01 — Identidad global o por tenant
- **Pregunta:** ¿La identidad de acceso del socio es única en la plataforma o se crea una por cooperativa?
- **Contexto:** AGR-006 separa identidad de pertenencia; una persona puede ser socia de dos cooperativas (CU-POR-21). CNX trabaja con código de empresa.
- **Opciones:**
  - A) Identidad común en la plataforma con pertenencias privadas por tenant y selector de ámbito **(Recomendada)** — un solo login; ningún tenant ve las pertenencias de otro.
  - B) Una identidad por tenant — aislamiento total, pero la persona repite registro y contraseña.
  - C) Identidad común visible entre tenants — más simple, pero viola la privacidad entre cooperativas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-022, 027; RN-POR-001, 009; T02; O2.

### PA-POR-02 — Consulta y pago de facturas sin login
- **Pregunta:** ¿Se permite consultar y pagar facturas sin iniciar sesión?
- **Contexto:** CoopOnline lo permite (VAR_PMOVIL 60/61), incluso mostrando todos los comprobantes; BASE §25 exige que conocer una cuenta no alcance para ver datos privados.
- **Opciones:**
  - A) Permitir, opcional por tenant, con número de cuenta + dato verificador, solo impagas y datos enmascarados **(Recomendada)** — mantiene la facilidad de pago sin exponer datos.
  - B) No permitir; solo pago por código (PAN-POR-22) — máxima privacidad, más fricción.
  - C) Replicar CoopOnline (todos los comprobantes) — expone historial a cualquiera con el número.
- **Impacto si no se responde:** se asume A con PRM-POR-052 en `false`.
- **Bloquea:** RF-POR-012; RN-POR-060; PAN-POR-12; O5.

### PA-POR-03 — Migración de credenciales de CoopOnline
- **Pregunta:** ¿Cómo acceden los usuarios actuales de CoopOnline al nuevo portal?
- **Contexto:** `WS_USERS` guarda contraseñas en un esquema heredado; migrarlas sería inseguro, pero exigir re-registro pierde usuarios.
- **Opciones:**
  - A) Migrar usuarios, vínculos y adhesiones; activar con OTP al correo/celular sin re-registro; nunca importar contraseñas **(Recomendada)** — continuidad y seguridad.
  - B) Re-registro completo y nueva vinculación — limpio, pero alta pérdida de usuarios y carga en atención.
  - C) Importar contraseñas y re-hashear al primer ingreso — conserva el hábito, arrastra un riesgo de seguridad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-031, 169…173; PAN-POR-20, 92; O6.

### PA-POR-04 — Vinculación por identidad federada verificada (CiDi)
- **Pregunta:** ¿Se permite vincular cuentas automáticamente cuando el DNI verificado por CiDi coincide con el titular?
- **Contexto:** CoopOnline habilita CiDi (VAR_PMOVIL 40); AGR-006 prohíbe vincular por mera coincidencia de datos.
- **Opciones:**
  - A) Permitir solo si el tenant lo habilita y el DNI verificado coincide con el titular, avisando al titular **(Recomendada)** — autoservicio con verificación fuerte.
  - B) CiDi solo como método de ingreso, sin vincular — más conservador.
  - C) Vincular por cualquier coincidencia de DNI — rápido pero inseguro.
- **Impacto si no se responde:** se asume A con PRM-POR-006 en `false`.
- **Bloquea:** RF-POR-026, 036; O2.
- **Estado:** Respondida (DEC-067): mecanismo federado en O1, CiDi habilitable por tenant al publicar el portal (O2), nivel mínimo 2 para vincular cuentas.

### PA-POR-05 — Activación inmediata frente a solicitud
- **Pregunta:** ¿Qué acciones del portal se ejecutan al instante y cuáles generan solicitud?
- **Contexto:** BASE §25/§43 habla de "activar/desactivar"; §48 dice que solicitar no es ejecutar (CTR-POR-01).
- **Opciones:**
  - A) Siempre solicitud; inmediata solo para adhesiones, recarga prepaga y cambios de plan configurados en PRM-POR-072 **(Recomendada)** — estados reales y autoservicio donde no hay riesgo.
  - B) Todo como solicitud — más control, más carga operativa.
  - C) Activación inmediata en general — rápido, pero muestra estados falsos sin instalación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-070, 071; RN-POR-011; O2–O6.

### PA-POR-06 — Tótem de autogestión
- **Pregunta:** ¿Cómo se reemplaza AutoGestion.exe (tótem presencial)?
- **Contexto:** INV AutoGestion muestra un tótem Windows con lector de tarjetas, billetero, QR e impresión; CoopApps es web (DEC-001).
- **Opciones:**
  - A) Modo tótem de la PWA con agente local para periféricos, en O10, prioridad Extensión **(Recomendada)** — misma lógica de cobro que el portal.
  - B) Mantener AutoGestion.exe contra la API nueva — reutiliza hardware, duplica lógica en otra tecnología.
  - C) Descartar el tótem — simplifica, pero pierde un canal presencial existente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-161…168; PAN-POR-78…83, 96; O10.

### PA-POR-07 — Layout de escritorio
- **Pregunta:** ¿El portal en PC mantiene el marco de teléfono de CNX?
- **Contexto:** CNX usa phone shell fijo; muchos socios consultan facturas desde PC (CTR-POR-11).
- **Opciones:**
  - A) Phone shell en móvil y vista ancha para facturas, consumos y gestiones **(Recomendada)** — legibilidad en PC sin duplicar pantallas.
  - B) Phone shell siempre — coherencia visual, peor uso en PC.
  - C) Diseño de escritorio completo separado — mejor experiencia, doble mantenimiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-POR-024; T03; O2.

### PA-POR-08 — Pagador eventual
- **Pregunta:** ¿Puede una persona sin acceso a la cuenta pagar una factura ajena?
- **Contexto:** ESC-01 (hermano que paga por otro); BASE §25 protege los datos privados.
- **Opciones:**
  - A) Pagar por código de pago/QR sin ver el detalle **(Recomendada)** — facilita la cobranza sin exponer datos.
  - B) Solo con representación otorgada — más control, menos cobranza.
  - C) Pago libre con número de cuenta — expone deuda a terceros.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-045, 100; PAN-POR-22; O5.

### PA-POR-09 — Pago a cuenta o parcial
- **Pregunta:** ¿Se permite pagar un importe distinto del total de las facturas seleccionadas?
- **Contexto:** CoopOnline rechaza importes distintos (CTR-POR-09); AGR-012 contempla imputación parcial.
- **Opciones:**
  - A) Solo si la política de imputación de M07 lo habilita para el tenant **(Recomendada)** — flexible sin perder control.
  - B) Nunca — simple, pero frustra a socios con dificultad de pago.
  - C) Siempre — máxima flexibilidad, complica la conciliación.
- **Impacto si no se responde:** se asume A con la política deshabilitada.
- **Bloquea:** RF-POR-101; RN-POR-031; O5.

### PA-POR-10 — Portal del empleado con la misma identidad
- **Pregunta:** ¿El empleado que además es socio usa la misma identidad para ambos espacios?
- **Contexto:** BASE §104 y CNX incluyen portal del empleado; RN-POR-010 exige no mezclar datos.
- **Opciones:**
  - A) Misma identidad, espacio separado y reautenticación para recibos y legajo **(Recomendada)** — un solo acceso con aislamiento.
  - B) Identidades distintas — aislamiento fuerte, doble gestión de credenciales.
  - C) Misma identidad y mismo espacio — riesgo de mezcla de datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-028, 129…136; O9.

### PA-POR-11 — Firma de recibos de sueldo
- **Pregunta:** ¿Con qué mecanismo firma el empleado su recibo?
- **Contexto:** VAR 3122/3166 exigen firma; la firma digital con certificado es costosa para el empleado.
- **Opciones:**
  - A) Conformidad electrónica con OTP, hash del documento y sello de tiempo **(Recomendada)** — trazable y simple.
  - B) Firma digital con certificado — máxima validez, alta fricción.
  - C) Aceptación con un clic — simple, evidencia débil.
- **Impacto si no se responde:** se asume A; validación legal pendiente con el asesor laboral del tenant.
- **Bloquea:** RF-POR-130; RN-POR-058; O9.

### PA-POR-12 — Dominio de la landing
- **Pregunta:** ¿Dónde se publica la landing de cada cooperativa?
- **Contexto:** RF-POR-001; muchas cooperativas ya tienen dominio propio.
- **Opciones:**
  - A) Subdominio de la plataforma + dominio propio opcional con TLS automático **(Recomendada)** — arranque inmediato y marca propia.
  - B) Solo subdominio — simple, sin marca propia.
  - C) Solo dominio propio — depende de cada cooperativa para salir.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-POR-002, 003; T08; O2.

### PA-POR-13 — Editor de landing
- **Pregunta:** ¿Qué grado de libertad tiene la cooperativa para diseñar su landing?
- **Contexto:** BASE §101/§105 pide landing por tenant; un editor libre arriesga accesibilidad y la obligación del botón de baja.
- **Opciones:**
  - A) Bloques predefinidos con circuito de publicación **(Recomendada)** — accesible, con marca y sin romper obligaciones.
  - B) Editor libre HTML/CSS — máxima libertad, alto riesgo.
  - C) Plantilla fija — sin esfuerzo, poca personalización.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-002, 003, 150; PAN-POR-85, 86; O2.

### PA-POR-14 — Autolectura
- **Pregunta:** ¿Se ofrece al socio informar su propia lectura del medidor?
- **Contexto:** MER-018 la propone; la lectura impacta facturación (M03).
- **Opciones:**
  - A) Habilitable por servicio; la lectura se valida en M03 antes de facturar **(Recomendada)** — reduce visitas sin perder control.
  - B) No ofrecer — sin riesgo, sin beneficio.
  - C) Lectura del socio directa a facturación — riesgo de errores y fraude.
- **Impacto si no se responde:** se asume A con PRM-POR-061 en `false`.
- **Bloquea:** RF-POR-107; RN-POR-065; O7.

### PA-POR-15 — Socio moroso o suspendido
- **Pregunta:** ¿Qué puede hacer en el portal un socio con deuda vencida o servicio suspendido?
- **Contexto:** VAR_PMOVIL 37 controla deuda vencida en la web; la baja y el reclamo no pueden condicionarse.
- **Opciones:**
  - A) Nunca bloquear consulta, pago, reclamo ni baja; nuevas contrataciones según PRM-POR-071 **(Recomendada)** — cumple la norma y favorece la regularización.
  - B) Bloquear todo excepto pagar — presiona el cobro, viola el derecho a la baja.
  - C) Sin controles — permite contratar con deuda.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-049, 050, 099; RN-POR-057; O5–O6.

### PA-POR-16 — DDJJ de artefactos y vehículos eléctricos
- **Pregunta:** ¿Se incluyen las declaraciones juradas de artefactos y vehículos eléctricos?
- **Contexto:** CoopOnline las ofrece (`CrearDDJJ_Artefactos`, VAR_PMOVIL 44, 59, 75).
- **Opciones:**
  - A) En alcance vía el motor de formularios, habilitables por tenant **(Recomendada)** — sin desarrollo específico.
  - B) Desarrollo dedicado — más rico, más costo.
  - C) Fuera de alcance — pierde una función usada por cooperativas eléctricas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-069; RN-POR-042; PAN-POR-66; O7. Con HUE-GAS-01 el motor de formularios se alimenta de la plantilla por servicio de M02 (PRM-CAT-110), que cubre gas y energía.

### PA-POR-17 — Comentarios del muro
- **Pregunta:** ¿Los socios pueden comentar publicaciones del muro?
- **Contexto:** DEC-008 permite comentarios moderados; BASE §46 lo dejaba pendiente (CTR-POR-14).
- **Opciones:**
  - A) Deshabilitados por defecto; habilitables por tenant y publicación con moderación **(Recomendada)** — prudencia sin perder la función.
  - B) Habilitados por defecto — más participación, más carga de moderación.
  - C) Nunca — contradice DEC-008.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-125; PRM-POR-086; O2.

### PA-POR-18 — Resúmenes de terceros (FECESCOR)
- **Pregunta:** ¿Se mantiene el cobro de resúmenes de tarjetas regionales u otros convenios de terceros?
- **Contexto:** CoopOnline cobra resúmenes FECESCOR (`CrearCobranzaResumenTarjeta`, VAR 3114, VAR_PMOVIL 68).
- **Opciones:**
  - A) Extensión en O8, deshabilitada por defecto **(Recomendada)** — conserva la función para quien la usa.
  - B) Núcleo en O5 — adelanta una función minoritaria.
  - C) Descartar — perjudica a las cooperativas con ese convenio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-102; PRM-POR-058; O8.

### PA-POR-19 — App en tiendas
- **Pregunta:** ¿Se publica la app en Google Play y App Store?
- **Contexto:** CNX es PWA; algunas cooperativas esperan "app en la tienda" y push en iOS tiene limitaciones.
- **Opciones:**
  - A) PWA instalable sin tiendas al inicio; empaquetado TWA/Capacitor opcional por tenant después **(Recomendada)** — sin costo de publicación inicial.
  - B) Apps nativas desde el inicio — mejor presencia, mucho más costo.
  - C) Solo web sin instalación — pierde push y acceso rápido.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-145; O10.

### PA-POR-20 — Tabbar del socio y pantalla Comunidad (PA 16 del pendiente de cierre)
- **Pregunta:** ¿Cuál es la tabbar del socio y qué abre el destino "Comunidad"?
- **Contexto:** este anexo tenía Inicio · Servicios · (+) · Facturas · Perfil; T03 (RF-UXD-066, CTR-UXD-12) y el maestro §9.2 fijan Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad, con Perfil en la topbar, y T03 SM-PWS-026 espera una pantalla Comunidad de M19.
- **Opciones:**
  - A) Alinear con T03 y el maestro; FAB = Pagar por defecto; nueva PAN-POR-105 `/app/comunidad` que agrega muro, encuestas y novedades con la capability existente `por.portal.ver` (RF-POR-180) **(Recomendada)**.
  - B) Mantener la tabbar de este anexo y que T03 se ajuste.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §10.1, §10.3, PAN-POR-105, RF-POR-180.
- **Estado:** Asumida la recomendada (DEC-072). Las tabbars de empleado y de registrado sin cuenta no cambian en esta corrección.

### PA-POR-21 — Versiones de formularios del portal (PA 18 del pendiente de cierre)
- **Pregunta:** ¿Las versiones de `portalForms` se guardan embebidas (`versions`) o en `formVersions` de T11?
- **Contexto:** T05 (COL-POR-06) declara `portalForms` sobre `formVersions` de T11; este anexo versionaba en `versions` embebido.
- **Opciones:**
  - A) `formVersions` de T11: `portalForms` guarda la configuración del portal y `formVersionId`; las presentaciones y borradores guardan el `formVersionId` usado **(Recomendada)**.
  - B) Versionado embebido en M19.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.6 a §7.8, §8.4.
- **Estado:** Asumida la recomendada (DEC-072); `versions` y `currentVersion` quedan marcados como reemplazados.

### PA-POR-22 - Residuales del 05-11-2026 (estados, referencias, rótulo corto y nombre de PAN-POR-105)
- **Pregunta:** ¿Cómo se cierran los residuales de M19 que detectaron los entregables regenerados?
- **Contexto:** el índice de estados marcó `portalForms` y `kioskDevices` sin estado inicial; el modelo entidad-relación, `revokeReason`, `accessId` y `cashboxId` sin destino; el catálogo de pantallas, la fila de PAN-POR-105 sin nombre; RN-UXD-006 limita a 12 caracteres el rótulo de la tabbar y "Cuentas y servicios" tiene 19; M17 renombró EVT-INS-08.
- **Opciones:**
  - A) Estado inicial `borrador` en `portalForms` y `activo` en `kioskDevices`; separar la fila de revocación para que solo `revokedBy` apunte a `memberships`; confirmar `cashboxId` → `cashRegisters` (M07) sin renombrar; nombrar PAN-POR-105 "Comunidad"; rótulo corto "Cuentas" en la tabbar con el título completo en la pantalla; consumir `ins.capitalMovement.recorded` **(Recomendada)**.
  - B) Mantener el texto y resolver en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.3, §7.14, §8.4, §8.8, §10.1, §10.3, §12.2.
- **Estado:** Asumida la recomendada (DEC-072). T03 debe usar el rótulo corto "Cuentas" en SM-PWS-002 y en la clave de diccionario de la tabbar.

## 22. Trazabilidad de fuentes

### 22.1. BASE (solución 3 de §105 y secciones relacionadas)

| Fuente | Contenido | Dónde quedó |
|---|---|---|
| BASE §25 | Autogestión del socio: ingresar y seleccionar cuenta, consultar servicios y facturas, pagar, reclamar, adherir, constancias; conocer la cuenta no basta | RF-POR-022…053, 078…102, 109…117; RN-POR-003, 004; CU-25 |
| BASE §25 "activar/desactivar" | Acción directa sobre servicios | Reemplazado por RF-POR-065, 066, 070 (CTR-POR-01) |
| BASE §41 | Catálogo de servicios por tenant | RF-POR-004, 005; RN-POR-078 |
| BASE §43 | Landing configurable, ingreso, oferta, baja | RF-POR-001…021, 158; CTR-POR-02 |
| BASE §43.4 | Banners y campañas | RF-POR-052, 158; PAN-POR-93 |
| BASE §43.6 | Aislamiento de contenido de la landing | RF-POR-021; PR-POR-24, 30 |
| BASE §44 | Agrupación sin factura multiservicio | RF-POR-079, 082 (CTR-POR-03) |
| BASE §46 | Noticias y muro, comentarios pendientes | RF-POR-007, 125, 134; RN-POR-051, 052; CTR-POR-14; PA-POR-17 |
| BASE §48 | Solicitar no equivale a ejecutar | RN-POR-011, 012, 018; RF-POR-071 |
| BASE §50 | Visitas: coordinación, reprogramación, resultado | RF-POR-072…077; RN-POR-021, 023; PRM-POR-092, 093 |
| BASE §52 / §52.3 / §53 | Baja sin cargo, código, constancia, seguimiento | RF-POR-009…011, 065, 156; RN-POR-013…017, 077; PRM-POR-080…082 |
| BASE §57 | Suspensión y reactivación | RF-POR-066; RN-POR-019, 020; CU-CIC-01 |
| BASE §65 | Comunidad y comunicaciones del socio | RF-POR-121…128; RN-POR-053…055 |
| BASE §67 | Identidad, vinculación y representaciones | RF-POR-022…046; RN-POR-001…010 |
| BASE §71 | Constancias | RF-POR-087; PAN-POR-64 |
| BASE §82 | Encuestas y satisfacción | RF-POR-124; RN-POR-053; §15 |
| BASE §97.12 | Prepaga / autogestión de recarga | RF-POR-108; RN-POR-033, 034 |
| BASE §98 | Turnos y atención | RF-POR-118…120; RN-POR-073 |
| BASE §101 | Landing por tenant y marca | RF-POR-001, 015; PA-POR-12, 13 |
| BASE §103 | Comprobante agrupado con apertura por servicio | RF-POR-079, 082 |
| BASE §104 | Portal del empleado | RF-POR-129…136; PA-POR-10 |
| BASE §105 solución 3 | Landing y autogestión de cada tenant | Todo el anexo |
| BASE §106 | Checklist de aceptación | §17 |
| MAR-001…MAR-006 | Alta de tenant, marca, logos, splash | T03; RF-POR-001, 129, 145; CU-MAR-01 |
| MAR-007, MAR-008 | Landing propia; consultar e ingresar a la app | RF-POR-001…003, 015 |
| MAR-009 | Consultar, activar y desactivar servicios | RF-POR-054…071 (CTR-POR-01) |
| NOT-001, NOT-002, NOT-003 | Noticias en landing, muro socio, muro empleado | RF-POR-007, 125, 134; CU-NOT-01 |
| AUT-001 | Autogestión de la cooperativa | RF-POR-149…161 |
| AUT-002 | Autogestión del socio en todo el ciclo | RF-POR-062; CU-AUT-01 |
| AUT-003, AUT-004 | Concertar y recibir visita | RF-POR-072…077 |
| AUT-005 | Consumos, factura y pago | RF-POR-078…108 |
| AUT-006 | Reclamar y terminar el servicio | RF-POR-065, 109…112 |
| CIC-001…CIC-004 | Baja, suspensión, reactivación, costos | RF-POR-009…011, 065, 066; RN-POR-013, 019, 020 |
| REG-001 | Alta pública sencilla | RF-POR-022…024; RN-POR-001; CU-REG-01 |
| SOL-001, SOL-002 | Solicitar alta y baja de cualquier servicio | RF-POR-056, 065 |
| CAT-002 | Disponibilidad de la oferta en landing y apps | RF-POR-004, 031; RN-POR-078 |
| MER-018 | Autolectura | RF-POR-107; PRM-POR-061, 062; PA-POR-14 |
| FAC-008, FAC-011 | Imputación de pagos parciales; vista por servicio | RN-POR-031; RF-POR-079; PR-POR-12 |
| Checklist 34 | IA propone, no ejecuta | RN-POR-064 |
| Checklist 35 | Alta y baja distinguiendo solicitud y ejecución | RN-POR-011; PR-POR-01 |
| Checklist 36 | Último turno sin doble reserva | RN-POR-023; PR-POR-09 |
| Checklist 37 | Ciclo completo | CU-AUT-01; PR-POR-01 |
| Checklist 44 | Baja pública sin cuenta | RN-POR-013; PR-POR-07 |
| Checklist 47 | Google no concede afiliación | RN-POR-002; PR-POR-27 |
| CU-25, CU-MAR-01, CU-NOT-01, CU-AUT-01, CU-CIC-01, CU-REG-01 | Casos de uso originales | §16.1 |

### 22.2. AGR, DFA, FIC y CNX

| Fuente | Contenido | Dónde quedó |
|---|---|---|
| AGR-006 | Identidad, pertenencia, selección de cooperativa | RF-POR-022…028; RN-POR-001, 002, 009; PA-POR-01; CTR-POR-08 |
| AGR-007 | Representaciones y titulares | RF-POR-041…046; RN-POR-007, 008; CU-POR-08 |
| AGR-011, AGR-012 | Saldo único; excedentes | RN-POR-030, 031; CTR-POR-09; PA-POR-09 |
| AGR-024 | Comunicaciones y constancias con evidencia | RN-POR-054, 055; RF-POR-123 |
| AGR-031 | Moderación de comunidad | RN-POR-052; PA-POR-17 |
| AGR-032 | Accesibilidad y tolerancia a errores | RF-POR-137…148; RN-POR-063; PR-POR-34…38 |
| ESC-01 | Excedente no aplica a deuda ajena | RN-POR-030; CU-POR-07; PR-POR-02 |
| DFA M26 — menús Procoop WEB (Requisitos y Trámites, Archivos en la Web, Operaciones) | Administración web | PAN-POR-87, 88, 97; Archivos en la Web: Reemplazado por URL firmadas (RN-POR-061) |
| DFA M26 — `CapaDatos.PWeb` (`CUENTAS_*`, `USERS`, `MODULOS`, `WEB_Logos_Facturas`, `WEB_Novedades`) | Espejo de datos del portal | Reemplazado: vistas en vivo (§7.15); logos → T03; novedades → T09 |
| DFA M26 — marca "Alta desde CoopOnline" | Origen del alta | Canal `portal` en el caso M09 (RF-POR-061) |
| DFA M26 — `WEB_LOG` | Registro de uso | Reemplazado por auditoría (RN-POR-066) |
| DFA M26 — funciones esperadas | Cuentas, pagos, consumos, gestiones | RF-POR-033…120 |
| FIC 14.1 | Sincronización CoopOnline y migración de usuarios | CTR-POR-04; RF-POR-169…173; §19 |
| CNX §2.5 | Recuperación anti-enumeración | RF-POR-025 |
| CNX §3.1 | AppShell, piel, tema | RF-POR-144, 145; CTR-POR-12; PRM-POR-099 |
| CNX §3.3 | Landing por rol | RF-POR-047…053; PRM-POR-091 |
| CNX §3.4 | Encuestas con banner | RN-POR-053; CTR-POR-15 |
| CNX §3.8 | Encuesta externa `/e/:token` | RF-POR-017 |
| CNX §6 | Muro, novedades | RF-POR-125, 126 |
| CNX — phone shell, código de empresa en login | Patrones de interfaz | CTR-POR-11, 13 |
| CNX — FAB, cards, 3 skeleton cards, cola offline | Patrones PWA | RF-POR-117, 144 |
| DEC-107 (10-11-2026; verificado en M05 RN-FAC-165 y §12.1) | Comprobante sin autorización fiscal no se publica; vencimientos corridos por autorización tardía | RF-POR-085; §7 `invoiceView`; §12.2 EVT-FIS-01, EVT-FAC-22, EVT-FAC-23 y EVT-FAC-13 (consumo sumado en la última ronda). Nota para T03: la clave `dict:por.invoice.dueDatesShifted` (canal `pwa-socio`) todavía no está en §10.9.14 |

### 22.3. RN-10 §3 — CoopOnline, método por método

| Método / regla | Dónde quedó |
|---|---|
| `clsWEB` sincronización de titulares, cuentas, órdenes, facturas, PDF, pagos, consumos, parámetros hacia MySQL | Reemplazado: vistas en vivo (CTR-POR-04, §13) |
| `clsServicio_Procoop.TransferirFTP` / S3 de PDF | Reemplazado: almacenamiento privado con URL firmada (RN-POR-061) |
| `clsWEB.EnviarPagosEntidad` (POST con APIKEY fija) | Reemplazado: eventos de M07 (§12) |
| `clsWEB.RegistrarFactura`, `RegistrarPagosFacturasWeb`, `RegistrarPDFFILE` | Reemplazado: el portal lee M05/M07 en vivo |
| Escucha Firebase (`IniciarEscuchaPrepaga`, `IniciarEscuchaCobranza`) | Reemplazado: comandos API + webhook M07 |
| `CheckearVenta`, `CheckearCobranza` | Reemplazado por API-POR de checkout/recarga con idempotencia (RN-POR-025) |
| `ReiniciaEscuchas` | Descartado: no hay escuchas |
| Credenciales Firebase hardcodeadas | Descartado: bóveda por tenant (T06 INT, DEC-074) |
| `GetEncryptedKey` (ingreso directo desde escritorio) | Reemplazado por "Ver como socio" (RF-POR-160, RN-POR-069) |
| PWeb (canal 3) | Integrado en la misma PWA (espacio empleado, RF-POR-129) |
| Número de cliente del proveedor / CUIT genérico 999 | Reemplazado por tenant del token (DEC-002); buscador PAN-POR-21 |
| `GetDetalleServicios` | RF-POR-054, 055 (vista de M02) |
| `GetInfoAdherente` | RF-POR-068; RN-POR-043; PRM-POR-068 |
| `GetURLMiMedidorDiscar` | RF-POR-106; PRM-POR-065 |
| `GetLinksPrepaga` (tipos 7, 9, 11) | RF-POR-094, 096; §19.1 |
| `Get_Cuenta` | Reemplazado: el checkout guarda la cuenta explícitamente (M07) |
| `ESTADO_VENTA` 0–3, `ActualizaEstado` solo avanza | RN-POR-035; RF-POR-094 |
| `ValidarConfiguracion` | RF-POR-149; PRM-POR-040, 063 |
| `ValidarCaja` y apertura automática | CTR-POR-10; PRM-POR-103 (tótem) |
| `crearVenta` (600 s, prepaga + telemedición, `NOF_SUM`, `BLOQUEAR_FAC_WEB`, mínimo, capital, energía equivalente) | RF-POR-108; RN-POR-033, 034; PRM-POR-064; CTR-POR-17 |
| `crearCobranza` (recalcular deuda, total ≠ 0, talón completo, mínimo 904, bloqueadas, vencimiento 2585, diferir intereses) | RF-POR-089…093; RN-POR-026…029, 032; CTR-POR-05 |
| `SubirPDFPagoEfectivo` | RF-POR-090; PRM-POR-054 |
| `CrearCobranzaResumenTarjeta` (tipo 11, FECESCOR) | RF-POR-102; PA-POR-18 |
| Disparador 1: ciclo del Agente (2496) | Reemplazado: conciliación de M07 (CTR-POR-18) |
| Disparador 2: webhook vía Integra, `Get_SolicitudOriginal` (2789) | M07 webhook; RN-POR-024 |
| Disparador 3: rendición del Agente | M07 conciliación |
| Bug `RegistrarFacturasAuto` (lee 2496, escribe 726) | Descartado: no se replica |
| `AutorizarPrepaga` (`ConsultarPago`, antirrebote 10 s) | M07; RN-POR-024 |
| `RegistrarVenta` | M07 + M05 (factura de autogestión); RN-POR-036 |
| `ActualizarEstadoPago` (6 reintentos) | Reemplazado por outbox idempotente (DEC-003) |
| Envío `FacturaCooponline.html` / `ReciboCooponline.html` | RN-POR-036; PRM-POR-046, 047 |
| `AutorizarCobranza`, `GenerarFacturaTerceros` | M07; RF-POR-102 |
| "Los importes de la cobranza no coinciden" | Reemplazado por imputación con excedente (CTR-POR-09) |
| `RegistrarCobranza`, recibo con facturas de intereses | RF-POR-095; RN-POR-036 |
| Rechazo (`ESTADO` 6) | RF-POR-094; CU-POR-06 |
| `GetMedioPago` | RN-POR-037 |
| `ValidarImpuestos` (758, 1056, 2826) | RN-POR-038 (cálculo en M04/M07) |
| `Get_DatosCobranza` | RF-POR-041 (resumen del checkout) |
| Tipos de trámite (PDF, web, DDJJ); dato requerido 1–3; estados cargado/aceptado/rechazado/cancelado | RF-POR-013, 056; RN-POR-047, 048 |
| `GetValoresTramite`, `ConsultarTramites`, `ConsultarTramite_Usuario_PorId` | PAN-POR-97; API de presentaciones (§11) |
| `ValidarValor` (tipos 0, 1, 2, 3, 4, 7, 9) | RN-POR-044; RF-POR-057 |
| Consulta genérica con `SELECT` armado desde máscara | Reemplazado por catálogo tipado (CTR-POR-07) |
| `ConsultarValoresTramite` (campos del socio y `REGISTRA_USER`) | RF-POR-152 |
| `ConsultarValoresDDJJ` | RF-POR-069; PAN-POR-66 |
| `ValidarNroDocumento` (`COMPARAR_DOCUMENTO`, CiDi) | RN-POR-045; CTR-POR-08 |
| `EjecutarTramite` (procedimiento con nombre del requisito, `NOENVIAR_PROC`) | Reemplazado por comando tipado (RN-POR-046, CTR-POR-07) |
| `ActualizarTramite` (PUT a la API) | RN-POR-047 |
| `GuardarAdherentes` (transacción, fotos del documento) | RF-POR-068; RN-POR-043 |
| `CrearDDJJ_Artefactos` (con `UPDATE` masivo de comillas, HTML en `QUERY`) | RF-POR-069 vía motor de formularios; el `UPDATE` y el HTML embebido: Descartado |
| `ActualizarTramiteDDJJ_Artefactos` | Reemplazado por versionado de formulario (RF-POR-151) |
| `RegistrarArtefacto` (solo energía, histórico, cantidad 0) | RN-POR-042; M01/M03 |
| `clsNoti_Coop.GuardarNoti` (vigencia 1 mes) | RF-POR-127; RN-POR-072; PRM-POR-088 |

### 22.4. RN-10 §14–§16

| Fuente | Dónde quedó |
|---|---|
| §14 Implicancias para CoopApps | §13; PRM-POR-089 (redirecciones) |
| §15 Dudas abiertas (adhesiones, usuarios) | RF-POR-169, 170; PA-POR-03 |
| §16.1 Turnero (`clsTurnero`) | RF-POR-118…120; PRM-POR-076, 077; M09 |
| §16.3 Calendario y agenda web | Fuera de alcance de M19 (herramienta interna) |
| §16.8 Novedades y encuestas del proveedor (`clsRss`) | Descartado para el socio (canal del proveedor ProCoop); T01 |

### 22.5. Parámetros `VARIABLE_PMOVIL` (canales CoopOnline y PWeb)

| N° | Descripción de origen | Dónde quedó |
|---|---|---|
| 3, 4 | Sincronizar detalle de pagos / refinanciación | Reemplazado: no hay sincronización (CTR-POR-04) |
| 5, 6, 7, 8, 9 | Textos de "agregar cuenta" (botón, título, código de socio, clave/suministro, observación) | PRM-POR-016 |
| 11 | Registrar pagos a través de CoopOnline | PRM-POR-040, 063 |
| 12 | Diferir intereses | PRM-POR-044; RN-POR-032 |
| 13 | Todas las facturas del talón | PRM-POR-041 |
| 14 | Texto de vista previa de facturas seleccionadas | PRM-POR-037 |
| 15 | Exigir teléfono | PRM-POR-020 |
| 17 | No subir PDF de comprobantes bloqueados | PRM-POR-032 |
| 18 | Exigir correo | PRM-POR-021 |
| 19 | Confirmar teléfono/correo siempre al ingresar | PRM-POR-022; RN-POR-075 |
| 20 | No subir facturas posteriores a una fecha | PRM-POR-030 |
| 21 | PDF para pago en efectivo | PRM-POR-054 |
| 27 | URL para adhesión a débito automático | PRM-POR-056 |
| 31 | Deshabilitar pestaña de consumos | PRM-POR-060 |
| 32 | Adhesión a facturación electrónica (mail / mail y WhatsApp) | PRM-POR-050 |
| 34 | Enlace de referencia en el login | PRM-POR-007 |
| 35 | Texto de observación en facturas | PRM-POR-036 |
| 36 | Meses de antigüedad de PDF a borrar | PRM-POR-033 (no hay copia de PDF que borrar) |
| 37 | Controlar deuda vencida en la web | PRM-POR-071; RF-POR-099; PA-POR-15 |
| 39 | Solo subir facturación diaria | Reemplazado: no hay subida |
| 40 | Habilitar CiDi | PRM-POR-006; PA-POR-04 |
| 41 | Perfil para empleados no usuarios (PWeb) | PRM-POR-097; RN-POR-059 |
| 42 | Concepto de prepaga en SIRO | PRM-POR-059 |
| 43 | Id de convenio SIRO | M07 (bóveda de credenciales) |
| 44 | Requerir datos en DDJJ de artefactos | PRM-POR-066 |
| 45 | Carro de facturas | PRM-POR-049 |
| 46 | No subir cuentas sin servicios ni deuda | Reemplazado: no hay subida |
| 49 | Correo para avisos de trámites web | PRM-POR-078 |
| 52 | Subir factura a CoopOnline al registrar ventas (PMovil) | Reemplazado: la factura se ve en vivo |
| 53 | Mensaje automático al registrar ventas | PRM-POR-057; RF-POR-128 |
| 55 | Botón "Mi Medidor" | PRM-POR-065 |
| 58 | Reclamo web genera OT | PRM-POR-074; RN-POR-070 |
| 59 | Advertencia de DDJJ no presentada | PRM-POR-067 |
| 60 | Todos los comprobantes sin login | PRM-POR-053 (CTR-POR-06) |
| 61 | Facturas sin login | PRM-POR-052; PA-POR-02 |
| 63 | Pagar facturas adheridas a débito | PRM-POR-048; RN-POR-041 |
| 65 | Texto de cabecera de la página | PRM-POR-008 |
| 67 | Turnos desde la web | PRM-POR-076 |
| 68 | Sucursal de FECESCOR | M07 (configuración del convenio); PRM-POR-058 |
| 71 | Agrupar y ordenar por vencimiento | PRM-POR-035 |
| 73 | Ocultar observaciones en órdenes | PRM-POR-073; RN-POR-071 |
| 74 | Descargar PDF desde una fecha | PRM-POR-030 |
| 75 | Vehículos eléctricos | PRM-POR-069; PA-POR-16 |
| 911 | Adhesión a factura web con contactos requeridos | PRM-POR-051 |
| 912 | Texto para la web | PRM-POR-009 |
| 913 | Solo comprobantes adeudados | PRM-POR-034 |
| 2534 | Sincronizar facturas adeudadas al MySQL | Reemplazado: no hay sincronización |
| 1, 2, 10, 16, 22–26, 28–30, 33, 38, 47, 48, 50, 51, 54, 56, 57, 62, 64, 66, 69, 70, 72 | Canal PMovil (app de campo: lecturas, OT, ventas, impresión) | Otro anexo: M03, M10 y M06 (app de campo, PAN-POR-77) |

### 22.6. Parámetros `VARIABLE` relacionados con el portal

| N° | Descripción de origen | Dónde quedó |
|---|---|---|
| 518, 519 | Razón social y CUIT de la empresa | T01 (datos del tenant) |
| 800 | WEB – Tipo de clave | Reemplazado por T02 |
| 801 | WEB – Enviar órdenes de trabajo | PRM-POR-075 |
| 802 | WEB – Enviar deuda | Reemplazado: deuda en vivo |
| 803, 805 | WEB – Fecha y horario de envío | Reemplazado: no hay envío |
| 804 | WEB – Mail para reclamos | PRM-POR-078 |
| 808, 809, 810, 811 | WEB – Servidor, usuario, clave y base | Reemplazado: no hay base espejo (ninguna credencial se migra) |
| 812 | WEB – Mail para contactos | PRM-POR-078; PAN-POR-13 |
| 829 | Seleccionar comprobantes para exportar a la web | Reemplazado por PRM-POR-031 |
| 904 | Acepta pago online (usado como mínimo) | PRM-POR-040, 042 (CTR-POR-05) |
| 2261 | WEB – Solo facturación mensual | Reemplazado por PRM-POR-031 |
| 2280 | Inactividad de sesión | PRM-POR-018 (análogo) |
| 2347 | Clave de cierre del módulo de autogestión | `kioskDevices` (clave por dispositivo); RF-POR-168 |
| 2351 | IP del lector de billetes | `kioskDevices` (agente local); PA-POR-06 |
| 2396, 2397, 2689, 2817 | WEB – zona a subir, aviso de sincronización, sincronización por webservice, borrado de archivos | Reemplazado: no hay sincronización |
| 2400 | Adherente existente en el mismo servicio | PRM-POR-068 |
| 2448 | WEB – Incluir cuotas de financiación | PRM-POR-031 |
| 2460 | WEB – Mantener teléfono y correo web | PRM-POR-023 |
| 2489 | Usuario de registración CoopOnline | Reemplazado por caja virtual del canal (M07, CTR-POR-10) |
| 2496, 2752 | Autorizar prepaga automáticamente / no registrar con Integra | Reemplazado por confirmación de M07 (CTR-POR-18) |
| 2499 | Copia de notificación de prepaga | PRM-POR-046 |
| 2551 | Plantilla de comprobante para pago | PRM-POR-047 |
| 2585 | Días de vencimiento del talón | PRM-POR-043 |
| 2622 | Activar pagos online | PRM-POR-040 |
| 2645 | Solo links de entidades fuera de línea | PRM-POR-055 |
| 2683 | Botón de chat con soporte | PRM-POR-079 (reinterpretado: chat con la cooperativa) |
| 2733 | Novedades web | PRM-POR-085 |
| 2742 | Plantilla de DDJJ de artefactos | PRM-POR-067 (formulario base en `portalForms`) |
| 2774 | Entidad por defecto en cobranza web | PRM-POR-045 |
| 2789 | Cobranzas de CB y QR vía Integra | M07 (webhook) |
| 2790 | Búsqueda por defecto en autogestión | PRM-POR-101 |
| 2857 | Imprimir alta/baja de débito | RF-POR-097 (constancia descargable) |
| 3025 | Mail de errores de rendición | M07 / T06 |
| 3064 | Turno con últimos 3 dígitos del DNI | PRM-POR-077 |
| 3114 | Entidad de terceros FECESCOR | PRM-POR-058; M07 |
| 3122, 3166 | Firma de recibos de sueldo | PRM-POR-095, 096 |
| 3131, 3132 | Cambio forzado y complejidad de contraseña | T02 |
| 3168 | Fecha de facturas de ProCoop | PRM-POR-030 |
| 103, 205, 206, 335 | Plantillas de fianza y solicitud de ingreso | PRM-POR-070 |
| 186, 2452 | Moneda de caja; recibo oficial siempre | M07 |
| 726 | Autorizar facturas ARCA automáticamente | M05 |
| 758, 1056, 2826 | Mínimo imponible IIBB, intereses agrupados, discriminar IIBB | M04 / M07 (RN-POR-038) |
| 2027, 2251 | Coordenadas iniciales y clave de mapa | T03 / T10 (mapa opcional en PAN-POR-04, 14) |
| `.pro` `WEB_*` (FTP/S3, horarios) y prepaga CoopOnline | Configuración del Agente | Reemplazado: no hay publicación |

### 22.7. Tablas (CAT §26 y relacionadas)

| Tabla | Dónde quedó |
|---|---|
| `REQUISITOS` | `portalForms` (§7); §19.1 |
| `REQUISITOS_ITEMS` | `portalForms.fields`; §19.1 |
| `Requisitos_Usuarios` | `portalFormSubmissions` (histórico) |
| `RSSFEED` | No se migra; PRM-POR-105 |
| `WEB_LOG` | No se migra; auditoría RN-POR-066 |
| `WEB_NOVEDADES` | T09; PAN-POR-05, 56 |
| `WS_KEYS` | No se migra; T10 |
| `WS_USERS` | T02 + `legacyPortalUserMap` |
| `WS_USERS_ACCOUNTS` | `portalAccountAccess` |
| `NOTI_COOP` | T09; RF-POR-127 |
| `PAGOS360`, `PAGOS360_EXTRAS`, `PAGOS360_PAGOS` | M07 (checkouts); §19.1 |
| `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS` | M01/M03; RF-POR-069 |
| `ADHSOC` | M01; RF-POR-068 |
| `SERSOC`, `CATE_SER`, `CANALES_PAGOS` | M02 / M07 (vistas consumidas, §7.15) |
| Base MySQL de CoopOnline y nodos Firebase `Venta_{n}` / `Cobranza_{n}` | Reemplazado; solo fuente de migración (§19) |

### 22.8. Inventario AutoGestion.exe (71 tipos)

| Tipo | Dónde quedó |
|---|---|
| `frmAutoGestion` (mosaicos dinámicos, `GoHome`, `IngresaClaveCierre`) | PAN-POR-78; RF-POR-162, 168; PRM-POR-102 |
| `ctrlCobranza_Seleccion`, `ctrlCobranza_Seleccion_Vertical` (deuda, cuotas, créditos, efectivo, QR, tarjeta, IIBB, caja) | PAN-POR-79…81; RF-POR-163…165 |
| `ctrlPrepaga_Seleccion` (servicio, capital, créditos pendientes, múltiplos) | PAN-POR-82; RF-POR-166 |
| `ctrlPagQr`, `ctrlPagoQr_Vertical` | PAN-POR-81 (QR) |
| `ctrlPagoTarjeta`, `ctrlPagoTarjeta2`, `ctrlPagoTarjeta_Vertical` (lector, cuotas, correo) | PAN-POR-81; RF-POR-165; RN-POR-039 |
| `ctrlImpresionMail`, `clsEnvioRecibo`, `Settings.EnviarMailRecibo` | PAN-POR-83; RF-POR-167 |
| `WebPagos360` | M07 (pasarela) |
| `ctrlAutoGestionBase` (anticipo, billetero, lector) | RF-POR-165; RN-POR-074 |
| `DatosPersona`, `clsBusquedaSocio`, `clsServicioBusquedaSocio`, `clsSocioIdentificado` | PAN-POR-79; RF-POR-163 |
| `clsMedioPagoFactory`, `enumFormaPago`, `Tipo_Tarjeta`, `Resultado` | RN-POR-037 |
| `clsValidadorIIBB` | RN-POR-038 |
| `clsGridTouchScrollHelper` | RF-POR-162 (interfaz táctil) |
| `Program`, `Resources` | Descartado: infraestructura del ejecutable |
| `<>c`, `<>c__DisplayClass*`, `<>f__AnonymousType*`, `<Module>` | Descartado: artefactos del compilador |
