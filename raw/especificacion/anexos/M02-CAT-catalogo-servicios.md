# M02 CAT — Catálogo de servicios, productos, planes, categorías, estados, contrato de servicio, habilitación por tenant, copia entre tenants y particularidades por servicio

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (catálogo y contrato de servicio) / CRM (consumidor de oferta y estados) / Landing-autogestión (oferta pública y "Mis servicios") / Plataforma (catálogo global de capacidades y habilitación por tenant) |
| Olas | O2 (núcleo: catálogo, habilitación, perfil, productos, planes, categorías, estados, contrato, copia entre tenants, oferta en landing/PWA), O3 (activación de Internet, equipos en comodato), O4 (estructura de conceptos facturables consumida por tarifas y facturación, tasas por cuenta de terceros, telefonía básica como abono), O7 (fichas de Electricidad, Agua, Cloacas, Gas, Alumbrado, obras, generación distribuida, grandes usuarios, recategorización por segmentación), O10 (Sepelio, Cementerio parque, Banco de sangre, Salud/ambulancias, Vivienda, Telefonía con CDR, TV, adherentes y beneficiarios, Capital social como concepto), O11 (migración repetible) |
| Dueño de datos | `serviceCapabilities`, `tenantServices`, `serviceConfigVersions`, `serviceConcessions`, `serviceProducts`, `billableConcepts`, `servicePlans`, `servicePlanVersions`, `serviceBundles`, `serviceCategories`, `serviceCategoryGroups`, `serviceClasses`, `serviceProperties`, `serviceStatuses`, `eventChargeRules`, `eventChargeWaivers`, `autoServiceRules`, `serviceContracts`, `serviceContractHistory`, `contractEquipmentAssignments`, `contractMembers` (Reemplazada por `serviceDependents` de M18, HUECO-TRV-01; beneficiarios en `serviceBeneficiaries` de M18, DEC-086; no se crea, CTR-DAT-58), `applianceTypes`, `contractDeclaredAppliances`, `generationAgreements` (Reemplazada por `distributedGenerationContracts` de M03, CTR-DAT-59, DEC-060), `contractSpecialConditions`, `serviceCopyRuns`, `bulkContractOperations`, `serviceTemplates` |
| Fuentes consolidadas | BASE §1 (servicios habilitables, configuración independiente, titularidad y particularidades — líneas 99-116), §5 (CU-05), §32, §37, §39.2, §48 (SOL-001/002, CU-SOL-01, en lo que define el servicio), §53 (CIC-001..004, CU-CIC-01, en lo que define estados), §66 (CAT-001..003, CU-CAT-01), §71, §72 (PRO-001..004, CU-PRO-01), §74, §80, §81 (COP-001..003, CU-COP-01), §84, §85, §86, §87 (CU-ESP-ELE), §88 (CU-ESP-AG), §89 (CU-ESP-GAS), §90 (CU-ESP-CEM), §91 (CU-ESP-SAN), §92, §93 (ESP-001..006), §94 (ESP1–ESP28), §95, §98, §101, §106, §102 MER-001 (CU-MER-01), MER-003, MER-017 · AGR-002, AGR-003, AGR-005, AGR-009, AGR-010, AGR-017 · DFA M4 (catálogo de servicios, categorías y conexiones), DFA M25 (telefonía, Internet, vivienda, salud como servicios) · REL "Administración de Servicios" (ficha del servicio) · RN-01 §2 (tipos de cálculo `TIP_CAL`, condición del servicio), RN-01 §9 (adherentes), RN-01 §10 (telefonía) · RN-06 §3 (altas, validaciones, configuración, guardado, altas automáticas, conceptos por conexión), §4 (estados, conexión/desconexión, trámites masivos), §5 (bajas de socio, en lo relativo a servicios), §6 (cambios de categoría y clase, segmentación), §7 (transferencias), §8 (domicilios del servicio), §10 (adherentes y beneficiarios), §11 (grupos de facturación) · RN-09 §6.4 parámetros TITULARES y VENTAS_Y_FACTURACION relativos a servicios · CAT §1 (tablas `SERSOC*`, `ADHSOC`, `BENSOC`, `VINCULOS`), CAT §2 completa (Servicios, categorías y tarifas), CAT §12 (Telefonía e Internet, en lo que define servicios TIC como productos) · INV `Configuracion.md` (abm_Servicio y afines), `ProMod_Titulares.md`, `ProMod_Facturacion.md` · CNX §2.4 (licencia/activación/pantallas/alcance; "un renglón en Suscriptores = un producto que se vende"), §4.2, §4.3 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.

---

## 1. Objetivo

Definir, sin necesidad de programar, **qué servicios puede prestar cada cooperativa (tenant), con qué productos, planes, categorías, conceptos facturables, requisitos, estados y reglas propias**, y administrar el **contrato de servicio** (suscripción) que vincula a un titular identificado por DNI/CUIT con una prestación concreta, desde que se solicita hasta su baja, conservando la historia completa.

El módulo resuelve cuatro necesidades del solicitante:

1. **Catálogo de capacidades de plataforma y habilitación por tenant** (BASE §66, CAT-001..003): cada cooperativa enciende un conjunto distinto de servicios (Agua, Electricidad, Cementerio parque en una; Electricidad y Gas en otra), y esa selección determina qué ve su comunidad en landing, PWA y administración.
2. **Configuración independiente por servicio y tenant, y copia entre tenants** (BASE §81, COP-001..003): cada servicio tiene un perfil de configuración propio (BASE §84) y puede copiarse como base a otra cooperativa sin copiar datos operativos.
3. **Composición económica estructural** (BASE §72, PRO-001..004): servicio → producto/subservicio → plan/oferta (versionada) → conceptos facturables y reglas → condiciones congeladas del contrato. Los **importes y el motor de cálculo** pertenecen a M04 TAR; este módulo define la estructura y el vínculo al cuadro tarifario.
4. **Particularidades por dominio** (BASE §84–95, DEC-007): fichas para Internet (piloto, DEC-005), Telefonía, TV/cable, Energía, Agua, Cloacas, Gas, Alumbrado público, Pavimento/obras, Sepelio, Cementerio parque, Banco de sangre, Ambulancias/salud, Vivienda, Tasas por cuenta de terceros, Capital social como concepto y otras prestaciones (banco ortopédico, traslados, seguro, vehículo eléctrico, dispenser de agua, correo electrónico, pack SMS), sin forzar todas en una fórmula universal P × Q.

El resultado esperado es que el piloto Internet (contratación → factibilidad → instalación → equipo en comodato → activación → facturación → mora/suspensión → baja) funcione extremo a extremo sobre este catálogo y que cualquier otro servicio de ProCoop pueda configurarse luego sin cambiar el núcleo.

## 2. Límite y responsabilidades

### 2.1 Qué hace

- Mantiene el **catálogo global de capacidades de servicio** (tenant `PLATFORM`) y la **habilitación por tenant** dentro de lo licenciado.
- Mantiene, por tenant y servicio, el **perfil de configuración** (13 dimensiones de BASE §84) versionado y publicable de forma íntegra (AGR-009).
- Mantiene **productos, subservicios, conceptos facturables (estructura), planes y sus versiones, paquetes, categorías, grupos de categorías, clases, propiedades, estados operativos, reglas de conceptos por evento, bonificaciones de conexión y reglas de altas automáticas**.
- Es **dueño del contrato de servicio** (`serviceContracts`): su creación, condiciones contratadas, estado canónico y operativo, fechas solicitadas y efectivas, flags, cambios de plan/categoría/clase, transferencias, traslado del domicilio del servicio, adherentes/beneficiarios (Reemplazado por M18 `serviceDependents`, DEC-071, HUECO-TRV-01: CAT solo declara en la ficha del servicio si admite miembros), equipos asignados en comodato, declaración de artefactos, vínculos de generación distribuida (Reemplazado: los registra M03 en `distributedGenerationContracts`, DEC-060, CTR-DAT-59) y condiciones especiales de grandes usuarios (AGR-002).
- Ejecuta las **transiciones de estado** del contrato cuando recibe el comando del módulo que corresponde (CRM, Técnica, Mora) o la confirmación del hecho (instalación, desconexión), y publica eventos.
- Ejecuta la **copia de configuración de servicio entre tenants** (BASE §81).
- Expone la **oferta** a landing y PWA y la vista **"Mis servicios"** del socio.

### 2.2 Qué NO hace y a quién lo delega

| Tema | Responsable | Qué consume/expone CAT |
|---|---|---|
| Precios, cuadros tarifarios, tramos, coeficientes, cargos adicionales con fórmulas, descuentos, recargos, tarifas de adherentes, promociones (cálculo), prorrateos, motor P×Q y tipos de cálculo | **M04 TAR** | CAT declara `calculationType`, conceptos, categorías y el vínculo plan/categoría → cuadro tarifario por vigencia. |
| Emisión de comprobantes, ciclos, lotes, grupos de facturación (definición), cuentas no facturables a nivel cuenta | **M05 FAC** | CAT guarda en el contrato el grupo de facturación asignado y el flag `doNotBill`; FAC lee contratos facturables. |
| IVA, percepciones, tasas e impuestos, tratamiento fiscal de cada concepto, padrones | **M06 FIS** | CAT referencia la clase fiscal del concepto. |
| Cuenta corriente, cobranza, reconexión automática por pago | **M07 COB**, **M08 MOR** | CAT recibe órdenes de suspensión/reactivación de MOR. |
| Mora, suspensión por deuda (política), corte, convenios, financiación (cronograma) | **M08 MOR** | CAT define en el plan si existe opción de financiación de instalación (estructura); MOR genera el cronograma. |
| Circuito de solicitud de alta/baja/cambio, tickets, botón de baja, conversación | **M09 CRM** | CAT expone oferta, requisitos y contrato; recibe "solicitud admitida/desistida". |
| Factibilidad, visitas, órdenes de trabajo, instalación, aprovisionamiento de red (MikroTik/Radius/OLT), numeración telefónica, CDR, centrales, red | **M10 TEC** | CAT pide factibilidad/instalación/desconexión y recibe confirmación; guarda solo referencias técnicas no secretas. |
| Medidores, lecturas, consumos, demandas por período, factores de corrección, telemedición, prepago | **M03 MED** | CAT asocia el contrato al punto de suministro; MED vincula medidor. |
| Stock, unidades serializadas, depósitos, valorización de equipos, RMA | **M13 STK** | CAT registra la **asignación** del equipo al contrato (comodato); STK es dueño de la unidad. |
| Personas, titulares, cuentas, inmuebles, domicilios postales, vínculos de parentesco (catálogo), fallecimiento | **M01 PER** | CAT usa `personId`, `accountId`, `propertyId`. Nombres canónicos de T05 §7.2: `holderId`, `personId`, `accountId`, `servicePointId` y `premiseId` (el `propertyId` como inmueble queda reemplazado; CTR-DAT-66, CTR-DAT-67). |
| Registro físico de parcelas, inhumaciones, convenios de banco de sangre, expedientes de vivienda, traslados de ambulancia | **M18 SOC** | CAT define el servicio, productos, planes y contrato; SOC opera el dominio. Adherentes y beneficiarios: dueño único M18 (`serviceDependents`, RF-SOC-011 a RF-SOC-030, DEC-071, HUECO-TRV-01; beneficiarios en `serviceBeneficiaries`, DEC-086). Registraciones del contrato (vehículo eléctrico, dispositivo): `contractRegistrations` de M18 (RF-SOC-148); CAT declara en `tenantServices.registrations` qué tipos admite el servicio. |
| Capital social, asociados, rescate | **M17 INS** | CAT define el concepto facturable de capital; INS lleva el libro. |
| Licencias SaaS de módulos de plataforma, packs, ciclo de vida del tenant | **T01 PLA** | CAT solo habilita servicios cuya capacidad está licenciada. |
| Roles, capabilities, alcance | **T02 IAM** | CAT declara sus capabilities. |
| Diccionario, branding | **T03 UXD** | Etiquetas por `dict:`. |
| Parámetros versionados, tablas maestras, geografía | **T04 CFG** | CAT registra sus parámetros en el catálogo de T04. |
| Workflow de autorizaciones, expediente documental | **T11 WFL** | Aprobaciones de publicación y documentos del contrato. |
| Asientos contables | **M15 CON** | CAT emite eventos con referencias contables mapeadas. |

### 2.3 Principios de frontera

- **Solicitar no equivale a ejecutar** (BASE §48): un caso CRM nunca cambia por sí solo el estado del contrato; CAT confirma el cambio efectivo y FAC calcula consecuencias (AGR-002).
- **Encender no contrata** (BASE §66): habilitar o publicar un servicio no crea contratos ni obligaciones para los usuarios del tenant (BASE §81).
- **Apagar no borra** (BASE §66, AGR-005): deshabilitar una oferta no da de baja contratos, no oculta facturas ni elimina expedientes.
- **Copiar no es publicar** (BASE §81).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Capacidad de servicio | Dominio funcional que la plataforma sabe gestionar (Internet, Agua, Cementerio parque…), con su perfil de registración y tipos de cálculo soportados. | `dict:cat.capability` | (no existe; ProCoop instala todo) |
| Servicio del tenant | Habilitación y configuración de una capacidad en una cooperativa; es lo que se oferta a su comunidad. | `dict:cat.tenantService` | `SERVICIO` |
| Dominio de servicio | Clasificación funcional de la capacidad (INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR); etiquetas `dict:cat.domain.<código>` publicadas en T03 §10.9.12 (HUE-SRV-09). | `dict:cat.domain` | `TIP_SERVI` (aproximado) |
| Perfil de configuración | Conjunto de definiciones por tenant y servicio en las 13 dimensiones de BASE §84. | `dict:cat.configProfile` | Flags de `SERVICIO` y `SERVICIO_EXTRAS` |
| Versión de configuración | Paquete coherente de cambios de un servicio con validaciones, simulación y fecha efectiva (AGR-009). | `dict:cat.configVersion` | `HIS_SERVICIO`, `HIS_SERVICIO_EXTRAS` (por cuadro) |
| Producto / subservicio | Oferta identificable dentro de un servicio (Fibra hogar, Línea fija, Parcela). Un subservicio es un producto adicional o componente (IP fija, decodificador adicional). | `dict:cat.product` | `PROD_SER` (parcial), `TEL_SERVICIO`, `SERTEL` |
| Concepto facturable | Elemento económico individualizable (instalación, abono, cargo por evento, cuota, ajuste, tasa de tercero, capital). Su precio vive en TAR. | `dict:cat.billableConcept` | `PROD_SER` (productos/conceptos) |
| Plan / oferta | Combinación comercial versionada de producto, componentes, requisitos y condiciones. | `dict:cat.plan` | Categoría + productos (no hay plan explícito) |
| Paquete | Combinación de planes de distintos servicios ofrecida en conjunto. | `dict:cat.bundle` | (no existe) |
| Categoría | Clasificación tarifaria/regulatoria del suministro o contrato (Residencial, Comercial, Alumbrado público, Jubilados). | `dict:cat.category` | `CATE_SER` |
| Grupo de categorías | Agrupación de categorías con código regulatorio (ej. ENARGAS). | `dict:cat.categoryGroup` | `GRP_CAT` |
| Clase de servicio | Clasificación complementaria con valores asociados (ej. tasa hospital, tipo de suministro). | `dict:cat.serviceClass` | `CLASESER` |
| Propiedad del servicio | Atributo técnico-comercial del suministro (tensión, mínimos, cargo fijo asociado). | `dict:cat.serviceProperty` | `PROPIESER` |
| Contrato de servicio | Vínculo entre un titular (DNI/CUIT), una cuenta, un servicio/plan y un punto de prestación, con estado y condiciones. | `dict:cat.contract` | `SERSOC` (servicio de la cuenta) |
| Estado canónico | Estado del contrato controlado por el sistema (Solicitado, Activo, Suspendido, Baja…); claves canónicas `dict:estado.servicio.<estado>` publicadas en T03 §10.9.12, que acepta `dict:cat.contract.lifecycle.<estado>` como alias (HUE-SRV-09). | `dict:cat.contract.lifecycle` | `CONDICION` (derivada de fechas) |
| Estado operativo | Estado configurable por servicio que se muestra y opera (CONECTADO, CORTADO, BAJA…) mapeado a un estado canónico. | `dict:cat.contract.operationalStatus` | `ESTASER` |
| Alta administrativa / técnica | Fecha en que se carga el contrato / fecha efectiva de conexión. | `dict:cat.contract.adminStart` / `dict:cat.contract.effectiveStart` | `ALTA_ADM` / `FEC_ALTA` |
| Baja administrativa / efectiva | Fecha de solicitud o decisión de baja / fecha efectiva de desconexión. | `dict:cat.contract.terminationRequested` / `dict:cat.contract.effectiveEnd` | `BAJA_ADM` / `FEC_BAJA` |
| Servicio técnico | Servicio cuyas altas y bajas se ejecutan por orden de trabajo. | `dict:cat.requiresWorkOrder` | `SERVICIO.TECNICA` |
| Equipo en comodato | Bien entregado al titular en préstamo vinculado al contrato, con devolución. | `dict:cat.equipmentLoan` | `SERSOC_PRODUCTOS` |
| Adherente | Persona vinculada a un contrato que cuenta para la categoría o la tarifa (sepelio, salud). Dueño: M18 `serviceDependents` (DEC-071, HUECO-TRV-01); CAT solo declara si el servicio lo admite. | `dict:cat.member.adherent` | `ADHSOC` |
| Beneficiario | Persona que goza de un beneficio o cobertura del contrato (banco de sangre, tarifa social). Dueño: M18 (RF-SOC-024, DEC-071, HUECO-TRV-01). Con DEC-086 el beneficiario es solo la persona cubierta por el contrato (`serviceBeneficiaries` de M18); la tarifa social no es un beneficiario: sale de la categoría social (M02) y de la segmentación (M04). | `dict:cat.member.beneficiary` | `BENSOC` |
| Motivo de baja | Causa codificada de la baja del contrato, común o propia del dominio (valores en T03 §10.9.12, HUE-SRV-09). | `dict:cat.contract.terminationReason` | `SERSOC.OBSERVA` (texto libre) |
| Régimen de medición | Indica si el contrato se factura con medidor (`metered`) o sin medidor (`unmetered`); cambia solo por el comando `changeMeteringRegime` (RF-CAT-114, HUE-AG-03). | `dict:cat.contract.meteringRegime` | (sin equivalente; se cambiaba editando la categoría) |
| Carencia | Período desde el alta durante el cual una cobertura no rige. | `dict:cat.waitingPeriod` | `SERVICIO_EXTRAS.CARENCIA` |
| Regla de alta automática | Regla que, ante un evento, propone o crea otro contrato (ej. alumbrado al conectar energía). | `dict:cat.autoRule` | `ALTASEAU` |
| Concepto por evento | Cargo estructural que se genera al alta, reconexión, transferencia u OT. | `dict:cat.eventCharge` | `CONEXION` |
| Copia de servicio | Creación en un tenant destino de una configuración independiente tomada de otro tenant. | `dict:cat.serviceCopy` | (no existe; una base por cooperativa) |
| Matrícula | Identificador del punto de suministro del servicio, único por servicio salvo parámetro. | `dict:cat.contract.supplyCode` | `SERSOC.MATRICULA` |
| ZSR | Zona, sector y recorrido del servicio (ruta de lectura/reparto). | `dict:cat.contract.route` | `ZONA/SECTOR/RECORRIDO` |
| Provisorio | Contrato de carácter transitorio (ver PA-CAT-09). | `dict:cat.contract.provisional` | Marca "Provisorio" |
| Alta desde portal | Contrato originado por autogestión. | `dict:cat.contract.originPortal` | "Alta desde CoopOnline" |

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Operador de plataforma (GoodApps) | `cat.capacidades.ver`, `cat.capacidades.crear`, `cat.capacidades.editar`, `cat.habilitacion.ver`, `cat.habilitacion.configurar`, `cat.plantillas.crear`, `cat.plantillas.editar`, `cat.copias.ejecutar`, `cat.copias.leerOrigen` (con autorización del tenant origen, PA-CAT-07) | Tenant `PLATFORM`; datos de configuración de tenants autorizados; nunca datos personales de contratos |
| Administrador del tenant | `cat.servicios.ver`, `cat.servicios.configurar`, `cat.servicios.publicar`, `cat.servicios.retirar`, `cat.versiones.crear`, `cat.versiones.aprobar`, `cat.estados.configurar`, `cat.reglasAuto.configurar`, `cat.copias.ejecutar` (como destino), `cat.copias.autorizarOrigen` | Tenant |
| Responsable comercial | `cat.productos.ver/crear/editar`, `cat.planes.ver/crear/editar/publicar/discontinuar`, `cat.paquetes.ver/editar` (antes `cat.paquetes.*`), `cat.categorias.ver/crear/editar`, `cat.clases.ver/editar` (antes `cat.clases.*`), `cat.propiedades.ver/editar` (antes `cat.propiedades.*`), `cat.conceptos.ver/crear/editar`, `cat.versiones.crear` | Tenant / servicios asignados |
| Responsable fiscal/contable | `cat.conceptos.ver`, `cat.conceptos.configurarFiscal`, `cat.versiones.aprobar` (cambios fiscales) | Tenant |
| Operador de atención / comercial de mostrador | `cat.contratos.ver`, `cat.contratos.crear`, `cat.contratos.editar`, `cat.contratos.solicitarBaja`, `cat.contratos.cambiarPlan`, `cat.adherentes.ver/crear/editar` (Reemplazadas por `soc.adherentes.ver` / `soc.adherentes.gestionar` de M18, HUECO-TRV-01), `cat.comodatos.ver` | Sucursales / servicios asignados |
| Supervisor comercial | Todo lo anterior + `cat.contratos.activar` (servicios no técnicos), `cat.contratos.suspender`, `cat.contratos.reactivar`, `cat.contratos.baja`, `cat.contratos.anular`, `cat.contratos.transferir`, `cat.contratos.cambiarCategoria`, `cat.contratos.cambiarRegimenMedicion` (HUE-AG-03), `cat.contratos.forzarAdvertencia`, `cat.masivos.ejecutar` | Sucursales / servicios |
| Técnico / coordinador técnico (vía M10) | `cat.contratos.ver`, `cat.comodatos.asignar`, `cat.comodatos.devolver`; las transiciones las ejecuta el sistema al cerrar la OT | Zonas / cuadrillas |
| Proceso del sistema (workers) | Identidad técnica con `cat.contratos.transicionar` (antes `cat.contratos.transicionSistema`), `cat.reglasAuto.ejecutar` | Tenant del job |
| Socio / titular (PWA) | `cat.misServicios.ver`, `cat.oferta.ver`; inicia solicitudes vía CRM | Propios (contratos donde es titular o representante vigente, AGR-007) |
| Visitante (landing) | Oferta pública sin login | Servicios publicados del tenant |
| Auditor | `cat.*.ver`, `cat.auditoria.ver` | Tenant |

Reglas: denegación por defecto; alcance por servicio obligatorio para contratos de dominios sensibles (Banco de sangre, Salud): un supervisor de Agua no ve beneficiarios de Banco de sangre (AGR-008). Toda transición de contrato verifica permiso **y** alcance en servidor.

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Catálogo de plataforma y habilitación por tenant

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-001 | Mantener un catálogo global de capacidades de servicio con código, nombre (dict), dominio, descripción, estado (`draft`, `available`, `deprecated`), madurez (`confirmed`, `candidate`), perfiles de registración y tipos de cálculo soportados, capacidades técnicas asociadas y ficha de dominio. | BASE §66 CAT-001, §92 | Núcleo | O2 | Informado | Plataforma crea INT y lo marca `available`; un tenant no lo ve hasta habilitarlo. |
| RF-CAT-002 | Habilitar y deshabilitar capacidades por tenant con fecha desde/hasta, solo si el tenant tiene la licencia correspondiente (T01). | BASE §66 CAT-001, AGR-005, CNX §2.4 | Núcleo | O2 | Informado | Intentar habilitar Gas sin licencia devuelve 409 con explicación de dependencia de licencia. |
| RF-CAT-003 | Distinguir tres niveles: capacidad de plataforma, servicio habilitado/ofertado por el tenant y contrato de una persona. | BASE §66 | Núcleo | O2 | Informado | Habilitar Agua en TEN-001 no crea ningún contrato. |
| RF-CAT-004 | Definir por separado disponibilidad para nuevas contrataciones (`offerStatus`) y operación de contratos existentes (`operationStatus`). | BASE §66 | Núcleo | O2 | Informado | Con oferta cerrada, landing no muestra el servicio pero los contratos activos siguen facturándose. |
| RF-CAT-005 | Al retirar una oferta, exigir que el administrador declare el alcance (solo nuevas contrataciones / cierre total con plan de salida) y no borrar contratos, documentos, deuda ni casos. | BASE §66, §71, AGR-005 | Núcleo | O2 | Adoptado (DEC-022; PA-CAT-03) | Retirar Agua de A deja contratos activos visibles y facturables. |
| RF-CAT-006 | Auditar toda habilitación, deshabilitación, publicación, retiro y modificación de alcance con actor, fecha, antes/después. | BASE §66, §54 GOB-004 | Núcleo | O2 | Informado | Cada cambio genera registro de auditoría consultable. |
| RF-CAT-007 | Reflejar la selección del tenant en landing, contratación, apps y pantallas de administración según perfiles. | BASE §66 CAT-002 | Núcleo | O2 | Informado | Un usuario de B ve solo Electricidad y Gas (CU-CAT-01). |
| RF-CAT-008 | Incluir Cementerio parque como prestación distinta de servicios sociales, sin equivalencia con consumo medido ni con sepelio. | BASE §66 CAT-003, §90 | Estándar | O2 (catálogo) / O10 (operación) | Informado | Existe capacidad CEM separada de SEP y SOC. |
| RF-CAT-009 | Registrar por dominio si es servicio confirmado por el solicitante o candidato investigado, y la documentación prioritaria pendiente para pasar a configuración real (BASE §95). | BASE §92, §95 | Estándar | O2 | Informado | La ficha de capacidad muestra madurez y checklist de insumos. |
| RF-CAT-010 | Ofrecer como capacidades todos los dominios que ProCoop gestiona: Internet, Telefonía fija, Telefonía móvil, Pack SMS, TV/cable, Energía eléctrica, Agua, Cloacas, Gas, Alumbrado público, Pavimento/obras (cuotas de obras), Sepelio, Subsidio por fallecimiento, Cementerio parque, Banco de sangre, Ambulancias/salud, Vivienda, Seguro, Vehículo eléctrico, Dispenser de agua, Correo electrónico, Banco ortopédico, Traslados, Tasas por cuenta de terceros y Capital social como concepto. | DEC-007, DFA M4, M25, RN-06 §3.3, BASE §92 | Estándar | según ficha | Adoptado | El catálogo de plataforma contiene las 25 capacidades con ficha. |
| RF-CAT-011 | Permitir marcar un servicio principal del tenant (por defecto en búsquedas, reportes y altas). | RN-09 V2 573 | Estándar | O2 | Adoptado | La ficha de cuenta abre por defecto el servicio principal. |
| RF-CAT-012 | Mantener tipos de servicio (agrupador de reporte) configurables por tenant, independientes del dominio. | CAT `TIP_SERVI` | Extensión | O2 | Adoptado | Un reporte agrupa contratos por tipo "Energía y conexos". |

### 5.2 Perfil de configuración por servicio

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-013 | Mantener por tenant y servicio un perfil de configuración en las 13 dimensiones: prestador y jurisdicción, titularidad, unidad de prestación, oferta, cantidad, excepciones, facturación, cuenta y pago, ciclo comercial, operación, cambios y salida, atención, control. | BASE §84 | Núcleo | O2 | Informado | La ficha de servicio tiene una pestaña por dimensión y cada una admite "No aplica". |
| RF-CAT-014 | Registrar prestador y jurisdicción: modalidad (prestación directa, subdistribución, convenio, intermediación administrativa), autoridad de aplicación/regulador, título habilitante, concesión, fuente normativa, jurisdicción y vigencia de cada configuración regulada. | BASE §84, §85, ESP-005, CAT `CONCESIO` | Núcleo | O2 | Informado | No se publica un servicio regulado sin autoridad y título habilitante cargados. |
| RF-CAT-015 | Definir la unidad de prestación del servicio (conexión, suministro, punto de medición, cobertura, parcela/unidad, acto, línea, grupo/beneficiario, plan de vivienda, cuota de obra) sin equivalencias automáticas entre dominios. | BASE §84, §93 | Núcleo | O2 | Informado | CEM usa unidad "derecho/unidad de sepultura" y no admite lectura. |
| RF-CAT-016 | Asignar al servicio un perfil de registración que determina qué datos y pestañas pide el contrato (medidor, adherentes, dispositivos, línea, perfil Internet, vivienda, seguro, cuotas de obra, vehículo eléctrico, cantidad). | RN-06 §3.3 `TipoRegistracion` | Núcleo | O2 | Adoptado | Un servicio con perfil "Adherentes" muestra la pestaña de adherentes y oculta la de medidor. |
| RF-CAT-017 | Declarar el tipo de cálculo del servicio (17 tipos de ProCoop más los nuevos que defina TAR) y su variante para grandes clientes; el algoritmo lo ejecuta TAR. | RN-01 §2, RN-06 §3.3 | Núcleo | O2 (declaración) / O4-O7 (motor) | Adoptado | Cambiar el tipo de cálculo exige nueva versión de configuración y simulación TAR. |
| RF-CAT-018 | Configurar los requisitos de alta del contrato: domicilio del servicio, fecha de alta (salvo servicio técnico), categoría, cantidad/dispositivos, matrícula, designación catastral, inmueble, actividad, clase, zona/sector/recorrido, dispositivo, factibilidad previa, garante, profesional/certificado, referencia, zona, propiedades, grupo contable; cada requisito con modo `noExigir`/`advertir`/`exigir`. | RN-06 §3.2, V2 213, 319, 343, 2050, 2343, 2462, 2529, 2738 | Núcleo | O2 | Adoptado | Con factibilidad en `exigir`, el alta sin factibilidad aprobada se rechaza con mensaje. |
| RF-CAT-019 | Marcar si el servicio es técnico (altas, bajas, reconexiones y cambios por orden de trabajo), si genera OT automáticamente al guardar, si consulta dar baja administrativa al generar OT de desconexión y qué tipo de operación técnica corresponde a cada evento (alta, baja, reconexión, cambio de categoría, transferencia, cambio de estado). | RN-06 §3.3, §4.2, §6, V2 332, 2330, 3194 | Núcleo | O2 | Adoptado | En INT técnico, aprobar el alta crea pedido de instalación a TEC y el contrato queda Pendiente de instalación. |
| RF-CAT-020 | Configurar grupo de facturación por defecto del servicio y su herencia en altas automáticas; el valor "sin grupo" es inválido. | RN-06 §3.2 paso 5, §3.5, §11 | Núcleo | O2 | Adoptado | Un contrato sin grupo de facturación no puede pasar a Activo. |
| RF-CAT-117 | **Marca de liquidación como servicio público** (DEC-093): declarar por servicio si liquida como servicio público ante ARCA (`tenantServices.profile.billing.publicServiceSettlement`, bool, default `false`; ex `SERVICIO.LIQ_AFIP`, que en ProCoop vale 1 cuando el servicio liquida LQSP; etiqueta `dict:cat.service.publicServiceSettlement`). Es un cambio de tipo `fiscal` de la versión de configuración (`serviceConfigVersions.changeKinds`), lo edita el responsable fiscal/contable (`cat.conceptos.configurarFiscal`) y su aprobación sigue `cat.versiones.aprobar`. M02 solo declara la marca: M05 la lee para asignar la clase de comprobante de cada renglón y separar la LQSP de la factura común (RN-FAC-040, RF-FAC-028, RF-FAC-067), M06 la usa para determinar la clase (RF-FIS-076), validar la autorización CESP vigente (RF-FIS-072) y avisar si no hay CESP activos (RF-FIS-074). Internet, telefonía, TV, sepelio y servicios sociales no se marcan (recomendación de PA-FIS-23); los conceptos accesorios admitidos dentro de la LQSP no se marcan aquí sino en `conceptFiscalCases.publicServiceAccessory` de M06. | DEC-093; RN-02 §3.2 (`GetComprobanteOperacion`), `ValidarCESP`; RN-06 `Get_LiquidaServiciosPublicos`; CAT `SERVICIO.LIQ_AFIP` | Núcleo | O4 | Adoptado | Energía con la marca en `true` e internet con `false` en el mismo grupo de facturación generan una LQSP y una factura común (M05). Publicar la marca sin el permiso fiscal devuelve 403. La migración de un `SERVICIO` con `LIQ_AFIP = 1` deja la marca en `true`. |
| RF-CAT-021 | Declarar para servicios medidos: medidor registrado en stock, lectura inicial al conectar, facturar sin consumo (cobrar cargo fijo), servicio relacionado cuyo consumo se usa (ej. cloaca sobre agua) y modo de división de consumo; la ejecución pertenece a MED/TAR. | RN-06 §3.3, RN-01 §2, V2 2701, 3143 | Estándar | O7 | Adoptado | CLO configurado con servicio relacionado AG; TAR toma lecturas de AG de la misma cuenta. |
| RF-CAT-022 | Declarar si el servicio admite adherentes y/o beneficiarios, exclusiones de cómputo (menores del último año, mayores, personas con discapacidad, jubilados), carencia, recategorización por edad del titular y si se exige adherente titular. **Alcance tras HUECO-TRV-01:** M02 conserva solo el atributo "admite miembros" (`members.allowsAdherents`, `members.allowsBeneficiaries`); exclusiones, carencia, recategorización y adherente titular: Reemplazado por PRM-SOC-001 a PRM-SOC-013 y RF-SOC-001, RF-SOC-005, RF-SOC-012 (M18, HUECO-TRV-01). | RN-01 §9, RN-06 §10, CAT `SERVICIO` (ADHER, BENEF, MENORES, MAYORES, DISCAPA, JUBILAD), `SERVICIO_EXTRAS.CARENCIA`, V2 109 | Estándar | O10 | Adoptado | Un sepelio con carencia 6 meses muestra la fecha de inicio de cobertura de cada adherente. |
| RF-CAT-023 | Configurar el estado operativo por defecto que asume el contrato en cada evento: alta, baja, reconexión, cambio de medidor, transferencia, desconectado, y selección automática del estado principal al dar de alta. | CAT `SERVICIO_EXTRAS` (COD_EST_*), V2 2435 | Núcleo | O2 | Adoptado | Al confirmar la instalación el contrato toma el estado operativo configurado para "alta". |
| RF-CAT-024 | Configurar documentos y plantillas por servicio: contrato de alta, fianza del servicio, informe/constancia de baja, formulario de desconexión, DDJJ (artefactos), constancia de entrega y devolución de equipos; y si se consulta imprimir/enviar al dar de alta o baja. | RN-09 V2 206, 2522, 2532, 2535, 2742, 2781 | Estándar | O2 | Adoptado | Al activar INT se genera la constancia de alta con la versión de condiciones. |
| RF-CAT-025 | Configurar canales habilitados por servicio y operación: landing, PWA, mostrador, teléfono, bot, botón de baja público. | BASE §48, §53, §66 | Núcleo | O2 | Informado | Si INT tiene baja por PWA habilitada, el socio ve "Solicitar baja" en su contrato. |
| RF-CAT-026 | Referenciar por servicio los motivos y tiempos de atención aplicables (catálogo en CRM), incluidos los plazos diferenciados por motivo de ENACOM para TIC. | BASE §84 Atención, §86 | Estándar | O2 | Informado | INT referencia motivos técnico/facturación/otros con plazos distintos. |
| RF-CAT-027 | Mapear por servicio área responsable, centro de costos, cuentas contables, depósito de equipos y sucursales, usando entidades del tenant. | BASE §81, §84 | Núcleo | O2 (estructura) / O5 (contable) | Informado | La publicación se detiene si falta la equivalencia contable (AGR-009). |
| RF-CAT-028 | Representar las diferencias por configuración y componentes de dominio explícitos; prohibido convertir particularidades en texto libre o forzarlas en P × Q. | BASE §84 | Núcleo | O2 | Informado | Las fichas de dominio exponen atributos tipados, no un campo "observaciones regulatorias". |
| RF-CAT-029 | Permitir marcar "No aplica" en cualquier dimensión o concepto que no corresponda al dominio, en lugar de forzar un cargo o proceso ficticio. | BASE §93 | Núcleo | O2 | Informado | SAN marca "Cantidad: No aplica". |
| RF-CAT-030 | Declarar permisos y operaciones admitidas por servicio: suspensión voluntaria (sí/no, duración máxima), reactivación, cambio de plan, cambio de titular, transferencia, traslado, baja parcial, cesión (CEM). | BASE §53, §84 Cambios y salida | Núcleo | O2 | Informado | Si CEM no admite baja por botón, la PWA muestra "Consultar trámite" (BASE §90). |

### 5.3 Versionado y publicación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-031 | Agrupar los cambios de un servicio en una versión de configuración con dependencias, validaciones, simulación, revisión, aprobación y fecha efectiva. | AGR-009, BASE §5 | Núcleo | O2 | Adoptado | Una versión no aprobada no afecta landing ni contratos. |
| RF-CAT-032 | Clasificar cada cambio como comercial, fiscal, técnico o de presentación; un cambio solo de etiqueta no exige revisión tarifaria. | AGR-009 | Estándar | O2 | Adoptado | Corregir una etiqueta publica sin simulación TAR. |
| RF-CAT-033 | Publicación íntegra: impedir publicar un plan sin precio vigente en TAR, sin equivalencia contable, con referencias al tenant origen o con impuestos no configurados. | AGR-009 | Núcleo | O2 | Adoptado | Publicar INT-100 sin cuadro tarifario vigente devuelve lista de bloqueos. |
| RF-CAT-034 | Conservar fecha efectiva y fecha de registro de cada versión y cambio; consultar la configuración vigente a una fecha. | AGR-010, CAT `HIS_SERVICIO`, `HIS_SERVICIO_EXTRAS` | Núcleo | O2 | Adoptado | Consultar INT "a 01-03-2026" devuelve la versión entonces vigente. |
| RF-CAT-035 | Exigir aprobación de un segundo usuario para publicar versiones con cambios comerciales o fiscales en producción (configurable). | AGR-008, AGR-009, BASE §39.1 | Estándar | O2 | Adoptado (DEC-021; PA-CAT-02) | El autor no puede aprobar su propia versión. |

### 5.4 Productos, conceptos, planes y paquetes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-036 | Definir productos y subservicios dentro de cada servicio del tenant. | BASE §72 PRO-001, §5 | Núcleo | O2 | Informado | INT tiene productos "Fibra hogar" y "IP fija" (subservicio). |
| RF-CAT-037 | Definir conceptos facturables individualizables por servicio, tipificados: una sola vez, recurrente, por cantidad, por evento, cuota, ajuste, tasa por cuenta de terceros, aporte de capital. | BASE §72 PRO-002, CAT `PROD_SER` | Núcleo | O2 | Informado | Instalación (una vez) y abono (recurrente) de INT son conceptos distintos vinculados a INT. |
| RF-CAT-038 | Establecer el disparador de cada concepto: aprobación, instalación efectiva, activación, inicio de período, evento (reconexión, transferencia, OT), vencimiento de hito. | BASE §72 | Núcleo | O2 | Informado | La instalación de INT se devenga al confirmar la instalación, no al aprobar. |
| RF-CAT-039 | Referenciar en cada concepto su clase fiscal (FIS), cuenta/rubro contable (CON), centro de costo y unidad de medida; el importe lo define TAR. | BASE §72, §84 | Núcleo | O2 / O4 | Informado | No se publica un concepto sin clase fiscal. |
| RF-CAT-040 | Distinguir costo interno de prestación y precio al socio; un costo interno no se factura sin concepto habilitado. | BASE §72, §74, §87 | Núcleo | O2 | Informado | El costo de instalación interna no aparece en factura si no existe concepto de instalación publicado. |
| RF-CAT-041 | Registrar planes comerciales con atributos del dominio (tecnología, velocidad bajada/subida, unidad, periodicidad, modalidad medida/no medida, requisitos, componentes incluidos, opciones, equipamiento requerido, necesidad de instalación/evaluación técnica). | BASE §5, CU-05, §86 | Núcleo | O2 | Informado | INT-100 declara 100 Mbps, mensual, requiere factibilidad y equipo. |
| RF-CAT-042 | Mantener versiones históricas de cada plan; un plan discontinuado no se ofrece a nuevos clientes pero conserva sus condiciones en los contratos anteriores; un cambio comercial puede aplicarse solo a nuevas contrataciones. | BASE §5 | Núcleo | O2 | Informado | Discontinuar INT-50 no modifica contratos INT-50 existentes. |
| RF-CAT-043 | Vincular plan y categoría a la tarifa vigente de TAR por vigencia; el contrato guarda referencia a la versión de plan y a condiciones pactadas, no un precio libre. | BASE §5 CU-05, §72 | Núcleo | O2 / O4 | Informado | El contrato muestra "Tarifa vigente: cuadro X" y no un importe editable. |
| RF-CAT-044 | Administrar paquetes de prestaciones (planes de varios servicios) con componentes y condiciones; la contratación de un paquete crea un contrato por servicio vinculados por `bundleSubscriptionId`. | BASE §5 | Estándar | O4 | Informado | Paquete INT+TV crea dos contratos enlazados; la baja de uno sigue la regla del paquete. |
| RF-CAT-045 | Definir promociones como componentes del plan con inicio/fin de vigencia de oferta, base (concepto afectado), duración (meses calendario, ciclos facturados u otra explícita) y regla de inicio; el cálculo es de TAR. | BASE §5, §72 PRO-003, AGR-017 | Núcleo | O2 / O4 | Informado | "50 % sobre abono durante 3 ciclos" queda en el contrato con su criterio de duración. |
| RF-CAT-046 | Ofrecer en el plan opciones de financiación de instalación (principal, anticipo, cuotas, método) como alternativa excluyente del pago de contado; el cronograma lo genera MOR y se evita la duplicación. | BASE §72 PRO-004, CU-PRO-01 | Estándar | O4 / O6 | Informado | Elegir financiar anula la alternativa de contado en el mismo contrato. |
| RF-CAT-047 | No aplicar subsidios por defecto; un subsidio exige régimen o beneficio real autorizado y se representa con categoría o beneficio vinculado a TAR/FIS. | BASE §72 | Núcleo | O2 | Informado | Un plan INT no tiene subsidio salvo régimen configurado. |
| RF-CAT-048 | Declarar compatibilidad y orden entre promociones, subsidios, bonificaciones y otras excepciones del plan. | BASE §72 | Estándar | O4 | Informado | Dos promociones incompatibles no pueden asignarse al mismo contrato. |
| RF-CAT-049 | Definir unidades de medición y periodicidad del servicio y del plan (mensual, bimestral, anual, por evento). | BASE §5 | Núcleo | O2 | Informado | GAS bimestral y INT mensual conviven en el tenant. |
| RF-CAT-050 | Configurar conceptos por evento (alta de servicio, alta de cuenta, alta de titular, reconexión, después de OT, antes de OT, transferencia) con filtros (socio activo, moroso, prepago, referencia, localidad, categoría, clase, medidor retirado, provisorio, propiedad, estado), cantidad, "una sola vez" y bonificaciones de conexión por cuenta. | RN-06 §3.6, CAT `CONEXION`, `CONE_BONIF` | Estándar | O3 / O4 | Adoptado | Al reconectar ELE se propone "Cargo de reconexión" solo si la política de MOR lo habilita. |
| RF-CAT-051 | Declarar productos entregables en comodato (equipos) por plan, con modalidad (comodato, venta, alquiler, propio del cliente). | BASE §74, §86, CAT `SERSOC_PRODUCTOS` | Núcleo | O3 | Adoptado (DEC-013; PA-CAT-10) | INT-100 declara ONT en comodato obligatoria. |
| RF-CAT-052 | Mostrar al socio el detalle de su precio vigente y la fecha de finalización de beneficios temporales. | BASE §72 | Estándar | O4 | Informado | "Mis servicios" muestra "Promoción 50 % hasta el ciclo 03-2027". |
| RF-CAT-053 | Mantener clases de servicio con valores asociados (ej. tasa hospital, tipo de suministro). | CAT `CLASESER`, REL ficha | Estándar | O2 | Adoptado | Un contrato ELE con clase "Tasa hospital municipal" informa VALOR1 al motor. |
| RF-CAT-054 | Mantener propiedades del servicio (tensión, mínimos, cargo fijo asociado, tensión regulatoria) y propiedades personalizadas tipadas con lista de valores. | CAT `PROPIESER`, INV abm_propieItems | Estándar | O2 / O7 | Adoptado | ELE tiene propiedad "Tensión" con valores BT/MT. |

### 5.5 Categorías

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-055 | Mantener categorías por servicio con atributos estructurales: social, prepaga, residencial, generador, categoría con subsidio asociada, categoría SEF asociada, código de tarifa regulatorio, perfil de red (Internet), grupo, códigos para ENARGAS/ARBA/Secretaría de Energía, cantidad de adherentes que la determina, permite cambio de categoría proporcional. | CAT `CATE_SER`, `CATE_SER_EXTRAS`, RN-06 §6, RN-01 §9 | Núcleo | O2 / O7 | Adoptado | La categoría "Jubilados" se marca `isSocial` explícitamente. |
| RF-CAT-056 | Mantener grupos de categorías con código regulatorio. | CAT `GRP_CAT` | Estándar | O7 | Adoptado | Grupo "Residencial gas" informa su código ENARGAS. |
| RF-CAT-057 | Conservar historial de categoría por vigencia en el contrato para facturar cada período con la categoría que correspondía. | DFA M4 mejora, AGR-010 | Núcleo | O2 | Adoptado | Un cambio de categoría del día 15 genera dos tramos consultables. |
| RF-CAT-058 | Permitir recategorización automática (por segmentación, consumo, edad o adherentes) respetando la marca "No aplica recategorización" del contrato. | DFA M4, RN-06 §6, REL flags | Estándar | O7 | Adoptado | El contrato marcado queda excluido del job de recategorización. |
| RF-CAT-059 | Para servicios con adherentes según cantidad, determinar la categoría por cantidad de adherentes computables y registrarla en el contrato como cambio de categoría. | RN-01 §9 | Estándar | O10 | Adoptado | Al pasar de 3 a 4 adherentes el contrato cambia a categoría "Familiar 4". |
| RF-CAT-060 | Restablecer en bloque categorías subsidiadas a su categoría base (por niveles o por régimen), excluyendo contratos marcados y bajas de más de 60 días. | RN-06 §6, V2 3155 | Estándar | O7 | Adoptado | El restablecimiento informa cantidad de contratos excluidos por cada motivo. |

### 5.6 Estados del contrato

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-061 | Mantener una máquina de estados canónica explícita del contrato (sección 8) con transiciones, actores, precondiciones, efectos y reversión; no existe edición libre del estado. | AGR-003, BASE §53 | Núcleo | O2 | Adoptado | Un PATCH de `lifecycleStatus` devuelve 405; solo existen comandos de transición. |
| RF-CAT-062 | Mantener por servicio un catálogo de estados operativos configurables, cada uno mapeado a un estado canónico, con marca de "implica desconexión" y "estado principal". | CAT `ESTASER`, DFA M4 | Núcleo | O2 | Adoptado | El estado operativo "CORTADO" de ELE mapea a `suspended` con `impliesDisconnection=true`. |
| RF-CAT-063 | Registrar por separado fecha solicitada y fecha efectiva de alta, suspensión, reactivación y baja; nunca presumir que coinciden. | BASE §48, §53, RN-06 §4.1 | Núcleo | O2 | Informado | Un contrato tiene `terminationRequestedAt` 10-05 y `effectiveEnd` 31-05. |
| RF-CAT-064 | Registrar fecha, actor, origen y motivo del último cambio de estado y la historia completa. | DFA M4, REL "fecha del último estado" | Núcleo | O2 | Adoptado | La ficha muestra "Activo desde 12-04-2026 por cierre de OT-123". |
| RF-CAT-065 | Distinguir suspensión temporal solicitada por el socio, suspensión por mora, suspensión técnica/seguridad, suspensión regulatoria/administrativa y reactivación; cada una con duración, motivo, fecha efectiva y modo (restringido o interrumpido). | BASE §53 CIC-002, CIC-003 | Núcleo | O2 / O6 | Informado | Una suspensión por mora de INT con modo "restringido" no figura como "Baja". |
| RF-CAT-066 | Mostrar "Rehabilitación en trámite" mientras falte la confirmación técnica; el contrato no vuelve a Activo por el solo registro de un pago. | BASE §53, §89 | Núcleo | O6 | Informado | Pagar la deuda de GAS suspendido deja el contrato en `reactivationPending` hasta la inspección. |

### 5.7 Contrato de servicio

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-067 | Vincular cada contrato con un titular identificado por DNI o CUIT y una cuenta; un mismo domicilio puede tener varios contratos del mismo servicio con titulares distintos; la dirección no es clave del contrato ni determina responsabilidad de pago. | BASE §1 (Titularidad), §83, §86 | Núcleo | O2 | Informado | Dos hermanos con INT en DIR-CASA-001 tienen contratos, equipos y deudas independientes. |
| RF-CAT-068 | La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS, latitud/longitud), servicio (actividad ARCA, observaciones, garante, grupo de facturación, fechas de alta/baja), generalidades (estado y fecha del último estado), otros (profesional instalador, certificado número/vencimiento, id cliente externo, fecha de vencimiento), lectura (zona, sector, recorrido), varios (última facturación, id de factibilidad, matrícula). Medidor y demanda se muestran desde MED. | REL "Administración de Servicios", DFA M4 | Núcleo | O2 | Adoptado | Todos los bloques aparecen en la ficha, ocultando los que el perfil marca "No aplica". |
| RF-CAT-069 | Mantener flags del contrato: No facturar (con autorización y vigencia), Provisorio, Cobrar provisorio, No aplica recategorización, Alta desde portal (origen), Lectura con factor de multiplicación, Enviar factura electrónica por defecto, No cobrar recargo (referencia a COB). | REL flags, DFA M4, V2 2303, 2642, 3135 | Núcleo | O2 | Adoptado (DEC-027; PA-CAT-09) | Marcar "No facturar" exige permiso, motivo y fecha hasta; FAC excluye el contrato y lo lista en la bandeja de no facturables. |
| RF-CAT-070 | Congelar en el contrato las condiciones contratadas: versión del plan, componentes, promociones con su criterio de duración, financiación elegida, aceptación (fecha, canal, evidencia) y documento de condiciones. | BASE §5, §72, §86 | Núcleo | O2 | Informado | Cambiar el plan publicado no modifica las condiciones guardadas del contrato. |
| RF-CAT-071 | Registrar cantidad o dispositivos en servicios por cantidad (tipos 7/8) y por dispositivos. | RN-06 §3.2 paso 2, RN-01 §2 | Estándar | O4 | Adoptado | Un servicio "por cantidad" exige cantidad > 0 para activarse. |
| RF-CAT-072 | Registrar origen del contrato (canal, caso CRM, usuario, regla automática, migración, transferencia) y enlazar el caso. | BASE §48, REL "Alta desde CoopOnline" | Núcleo | O2 | Informado | Un alta desde PWA queda con `origin.channel=pwa` y `crmCaseId`. |
| RF-CAT-073 | Ejecutar las validaciones de alta configuradas (sección 6, RN-CAT-020..031) devolviendo todos los errores y advertencias juntos. | RN-06 §3.2 | Núcleo | O2 | Adoptado | Un alta con tres faltantes devuelve los tres en un único problem+json. |
| RF-CAT-074 | Controlar matrícula única por servicio entre contratos no dados de baja salvo parámetro, y generar matrícula automática cuando el servicio lo indique. | RN-06 §3.2 paso 3, V2 2250 | Estándar | O2 | Adoptado | Con unicidad activa, repetir la matrícula ELE-0001 devuelve 409. |
| RF-CAT-075 | Impedir que un asociado tenga más de un contrato del mismo servicio en categoría social cuando el parámetro lo indique, usando la marca explícita `isSocial` de la categoría. | RN-06 §3.2 paso 9, V2 2740 | Estándar | O7 | Adoptado | El segundo contrato social ELE del mismo titular se rechaza o se recategoriza según la regla de prioridad. |
| RF-CAT-076 | Advertir (o exigir autorización) si existen deudas, vencidas o totales, en otras cuentas con el mismo domicilio o la misma parcela catastral al dar de alta o cambiar el titular. | RN-06 §3.1, V2 2482, 2668, 2669 | Estándar | O2 | Adoptado (DEC-029; PA-CAT-12) | El alta muestra advertencia y registra quién continuó. |
| RF-CAT-077 | Configurar si se permiten contratos para titulares no activos o dados de baja. | V2 734, 741 | Estándar | O2 | Adoptado | Con el parámetro activo, un titular dado de baja no puede recibir un contrato nuevo. |
| RF-CAT-078 | Configurar si se permiten contratos iguales (mismo servicio) medidos o no medidos en una misma cuenta. | V2 2269, 2715 | Estándar | O2 | Adoptado (DEC-028; PA-CAT-11) | Por defecto INT admite dos contratos en la misma cuenta; ELE no admite dos en el mismo punto de suministro. |
| RF-CAT-079 | Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja de equipos pendientes de devolución al dar de baja. | CAT `SERSOC_PRODUCTOS`, INV abm_Sersoc_Productos, BASE §74, §86 | Núcleo | O3 | Adoptado | Dar de baja INT con ONT no devuelta crea pendiente de retiro y no bloquea la baja comercial. |
| RF-CAT-080 | **Reemplazado por RF-SOC-011 a RF-SOC-030 (M18, DEC-071, HUECO-TRV-01).** Texto original: Gestionar adherentes y beneficiarios del contrato: persona, vínculo, titular sí/no, fechas de alta/baja, tarifa de adherente asignada, inicio de cobertura tras carencia, cascada de desconexión/reconexión configurable, consulta al reconectar, aviso de mayoría de edad, baja por fallecimiento, ocultar fallecidos, adherente repetido, control de deuda de adherentes. | RN-06 §10, RN-01 §9, CAT `ADHSOC`, `BENSOC`, V2 109, 2400, 2401, 2521, 2545, 3058, 3186, 3187 | Estándar | O10 | Reemplazado por RF-SOC-011 a RF-SOC-030 (HUECO-TRV-01) | Registrar el fallecimiento de un adherente en PER da de baja su vínculo con fecha y causa y conserva la historia. |
| RF-CAT-081 | Cambiar el plan de un contrato registrando nueva oferta, aceptación, fecha efectiva y tratamiento de promociones y período en curso. | BASE §86 Cambio | Núcleo | O3 / O4 | Adoptado (DEC-032; PA-CAT-15) | Un cambio de INT-100 a INT-300 queda como nuevo tramo de condiciones con fecha efectiva. |
| RF-CAT-082 | Cambiar la categoría de un contrato de forma inmediata, en fecha futura, o al cerrar la OT correspondiente, impidiendo dos OT pendientes del mismo tipo, y aplicando el día límite para cobrar proporcional. | RN-06 §6, V2 2330, 2455, 2755 | Estándar | O2 / O7 | Adoptado | Con modo "al cerrar OT", la categoría nueva se aplica en la fecha de cierre. |
| RF-CAT-083 | Ejecutar cambios masivos de categoría solicitados por otros módulos (paso a prepago por deuda desde MOR; recategorización por segmentación desde TAR) con origen, criterio, simulación previa y reversión. | RN-06 §6 | Estándar | O6 / O7 | Adoptado | Un lote de recategorización muestra antes/después y puede revertirse mientras no haya facturación con la nueva categoría. |
| RF-CAT-084 | Transferir un contrato a otra cuenta/titular creando un contrato nuevo (con o sin mantener fecha de alta) y dejando el original en "No vigente", trasladando línea, beneficiarios, vivienda, punto de suministro y propiedades; adherentes según política; generando conceptos de transferencia; permitiendo o no transferir contratos dados de baja y marcar como principal. | RN-06 §7, V2 422, 2291, 2541, 2599, 2782, 3195 | Estándar | O2 | Adoptado | La transferencia conserva la deuda en el titular original y la historia en el contrato original. |
| RF-CAT-085 | Trasladar el domicilio del servicio por orden de trabajo (aplicar el domicilio nuevo al cerrarla, opcionalmente también a las personas adherentes) y, a pedido, copiar el domicilio de la cuenta a sus contratos; validar mismo domicilio cuando el parámetro lo indique. | RN-06 §8, V2 2461, 2710 | Estándar | O3 | Adoptado | El traslado de INT queda con domicilio anterior y nuevo con fechas. |
| RF-CAT-086 | Ejecutar reglas de altas automáticas ante eventos (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtros (categoría, propiedad, clase, actividad, localidad, referencia, zona, tipo de medidor, condición del titular) y herencia de grupo de facturación. | RN-06 §3.5, CAT `ALTASEAU`, V2 332 | Estándar | O4 / O7 | Adoptado (DEC-023; PA-CAT-04) | Conectar ELE en una localidad con alumbrado configurado crea el contrato ALU vinculado. |
| RF-CAT-087 | Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la validación de desconexión. | RN-06 §4.3 | Estándar | O4 | Adoptado | Un trámite masivo informa procesados, rechazados y motivo por contrato. |
| RF-CAT-088 | Dar de baja un contrato: recibir la solicitud sin cargo, fijar fecha efectiva, ordenar desactivación/retiro, conservar facturas, deuda e historia, dejar equipos pendientes, no extinguir la condición de asociado. | BASE §48, §53 CIC-001, §86 | Núcleo | O3 / O6 | Informado | La baja de INT de B no afecta INT de A ni la asociación de B. |
| RF-CAT-089 | Configurar si se permite la baja de contratos con cuotas relacionadas pendientes (financiaciones, cuotas de obra o vivienda) y cómo se informan. | V2 2316 | Estándar | O6 | Adoptado | Con el parámetro apagado, la baja muestra las cuotas pendientes y requiere supervisor. |
| RF-CAT-090 | Reconectar/reactivar un contrato aplicando la regla de fecha de alta para no medidos en el mismo mes de la desconexión y la regla sobre titulares fallecidos. | RN-06 §4.2, V2 2707, 2301 | Estándar | O6 | Adoptado | La reconexión de un no medido en el mismo mes conserva la fecha de alta anterior si el parámetro está apagado. |
| RF-CAT-091 | Anular un contrato antes de su activación (desistimiento, factibilidad negativa, OT de alta eliminada) sin exigir circuito de retiro de equipo no instalado. | AGR-003, V2 2753 | Núcleo | O3 | Adoptado | Anular un contrato en `pendingInstallation` sin equipo asignado lo pasa a `cancelled`. |
| RF-CAT-092 | Al desconectar el último servicio de un titular, informar si sigue siendo adherente, beneficiario o garante en otros contratos. | V2 2571 | Extensión | O2 | Adoptado | La baja muestra el aviso con enlaces. |
| RF-CAT-093 | Declarar por servicio si se admiten consumos de contratos dados de baja (no permitir/controlar/permitir); la carga la gestiona MED. | V2 2550 | Estándar | O7 | Adoptado | MED rechaza una lectura posterior a la baja si el servicio está en "no permitir". |
| RF-CAT-094 | En listados: mostrar por defecto solo contratos activos, mostrar observación del servicio junto a su descripción, permitir desagrupar servicios de la cuenta y buscar por matrícula aproximada. | V2 2321, 2557, 3152, 3108 | Extensión | O2 | Adoptado | La búsqueda "ELE-00" devuelve todas las matrículas que empiezan así si el parámetro está activo. |
| RF-CAT-095 | Registrar la declaración jurada de artefactos **por servicio**, con plantilla definida en M02 por servicio (PRM-CAT-110) e historial: **GAS** artefactos a gas con potencia en kcal/h (artefacto, cantidad, potencia, marca, serie, modelo, año, usuario, estado, observaciones); **ELE** artefactos eléctricos con potencia en W y vehículos eléctricos (dominio, modelo, potencia del cargador en kW). El socio la presenta desde M19 (RF-POR-069) y el operador la acepta en PAN-CAT-25 (HUE-GAS-01). Texto original: "Registrar la declaración jurada de artefactos del contrato de gas (artefacto, cantidad, marca, serie, modelo, año, usuario, estado, observaciones) con historial y plantilla de trámite." | CAT `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS`, V2 44, 59, 75, 2742, DFA M4 Gas, HUE-GAS-01 | Estándar | O7 | Adoptado | Cada cambio de la DDJJ queda en historia con fecha y usuario; una DDJJ de gas sin potencia en kcal/h se rechaza y una de ELE acepta vehículos eléctricos. |
| RF-CAT-096 | Registrar el vínculo de generación distribuida asociado al suministro eléctrico: clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; su cambio de titular y baja siguen al suministro. El registro lo hace M03 en `distributedGenerationContracts` (DEC-060, CTR-DAT-59); M02 solo exige que exista el contrato ELE y propaga su cambio de titular y baja. | BASE MER-001, CAT `SERSOC_EXTRAS` (ALTA_GENERA, POTENCIA_GENERA), `CATE_SER_EXTRAS.GENERADOR` | Estándar | O7 | Informado | Un contrato ELE con GD muestra su vínculo y potencia; la baja del suministro cierra el vínculo. |
| RF-CAT-097 | Registrar condiciones especiales de grandes usuarios: precio particular, potencia contratada, plazo, penalidades, aprobación y versión; revisión previa obligatoria de la factura por su importe (marca para FAC). | BASE MER-003, RN-06 §3.3 (cálculo grandes clientes) | Estándar | O7 | Informado | Un contrato GU no puede activarse sin condiciones aprobadas. |
| RF-CAT-098 | Telefonía: asignar número/línea al contrato (con fechas y tarifa), modalidad (fija/móvil), plan, pack SMS, producto de telefonía prepaga que genera OT al venderse; la numeración y CDR los gestiona TEC. | BASE §32, §92, MER-017, CAT `TEL_SERSOC`, `TEL_MODALIDAD`, `TEL_SERVICIO`, `SERTEL`, V2 2253, 2708 | Estándar | O4 (abono) / O10 (CDR) | Informado | Un contrato TEL muestra su número vigente y los anteriores con fechas. |
| RF-CAT-099 | Internet: referenciar el perfil técnico del contrato (identificador de acceso, nodo/OLT, puerto/recurso, perfil de velocidad de la categoría) sin almacenar secretos en CAT ni exponerlos en catálogo público o BI. | BASE §86, CAT `INTERNET`, `CATE_SER_EXTRAS.PERFIL_MIKROTIK` | Núcleo | O3 | Informado | La API de contratos nunca devuelve contraseñas de acceso. |
| RF-CAT-100 | Correo electrónico como producto TIC del contrato (casilla, dominio) con credenciales gestionadas en la bóveda. Alcance y aprovisionamiento según PA-CAT-19 (HUECO-OTR-03). | CAT `CORREOSINT` | Extensión | O10 | Adoptado (DEC-084; PA-CAT-19) | La casilla se lista sin contraseña. |
| RF-CAT-101 | Dispenser de agua como servicio con límite diario de litros, litros por atención y días para cálculo de deuda. | V2 2581, 2582, 2583, 2584 | Extensión | O10 | Adoptado | El contrato de dispenser informa el límite diario vigente. |
| RF-CAT-102 | Vehículo eléctrico como perfil de registración (datos del vehículo, carga habilitable desde el portal). | RN-06 §3.3, V2 75 (canal portal) | Extensión | O10 | Adoptado | El perfil pide dominio y modelo del vehículo. |
| RF-CAT-103 | Seguro como perfil de registración (cobertura, asegurados, vigencia). | RN-06 §3.3 | Extensión | O10 | Adoptado | El perfil pide asegurados como adherentes. |
| RF-CAT-114 | Cambiar el **régimen de medición** del contrato (`metered` ↔ `unmetered`) con el comando `changeMeteringRegime`, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28 `cat.contract.meteringRegimeChanged`, que M03 consume para crear el punto de medición (RF-MED-012) o registrar el retiro (RF-MED-022). Aplica a los servicios cuyo perfil declara medición opcional (AG, y los que el tenant habilite). | HUE-AG-03; ficha 6.C.5 | Estándar | O7 | Adoptado | Pasar un contrato AG de `unmetered` a `metered` con fecha 01/12/2026 publica EVT-CAT-28 y desde esa fecha el contrato se factura por consumo; los períodos anteriores siguen como cuota fija. |
| RF-CAT-115 | Crear los **contratos de obra** (tipo 17, dominio OBR) al aprobarse el prorrateo de una obra: consumir EVT-TEC-25 `tec.levy.approved` y, por cada beneficiario, crear un contrato con API-CAT-33 vinculado a la obra, al inmueble y a la cuenta del beneficiario, con las cuotas del prorrateo en `domainAttributes`; idempotente por obra + inmueble (JOB-CAT-13). | HUECO-OBR-01; ficha 6.C.9 | Estándar | O7 | Adoptado | Reprocesar el mismo EVT-TEC-25 de la obra OBR-DEMO-01 con 40 beneficiarios no crea contratos duplicados: el resultado sigue siendo 40 contratos. |
| RF-CAT-116 | **Informe de abonados activos por paquete a una fecha de corte**: por servicio (TV en el uso principal, aplicable a cualquier servicio con paquetes) y producto de tipo paquete, cantidad de contratos que a la fecha de corte estaban en `active` o `suspended` en modo `restricted` con ese paquete contratado (incluye la grilla mínima), calculada sobre la historia de estados y de condiciones contratadas (`serviceContractHistory`, `agreedConditions`), no sobre el estado actual. Se expone como REP-CAT-16 y por API-CAT-56 para JOB-CMP-09 de M12 (RF-CMP-155), que lo toma el día PRM-CMP-116. | HUE-TV-01; RF-CMP-155 | Estándar | O10 | Adoptado | Con 1.200 contratos TV del paquete básico activos al 31/10/2026 y 30 dados de baja el 01/11/2026, el informe con corte 31/10/2026 devuelve 1.200 aunque se consulte el 05/11/2026. |

### 5.8 Configuración independiente y copia entre tenants

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-104 | Cada servicio de cada tenant tiene configuración propia e independiente sobre la misma capacidad de plataforma. | BASE §81 COP-001 | Núcleo | O2 | Informado | Cambiar INT en A no altera INT en B. |
| RF-CAT-105 | Copiar la configuración de un servicio (tenant, servicio y versión de origen) a un destino autorizado, eligiendo componentes (productos, planes, conceptos, reglas comerciales, categorías, estados, formularios, tipos de gestión, plantillas), clasificando qué se copia, qué se conserva del destino y qué debe mapearse; sin copiar asociados, usuarios, contratos, direcciones, facturas, deuda, pagos, tickets, respuestas, stock físico, series ni credenciales. | BASE §81 COP-002 | Núcleo | O2 | Informado | La copia de INT de A a B no trae ningún documento con `tenantId` de A salvo la procedencia. |
| RF-CAT-106 | Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. | BASE §81 COP-003, AGR-009 | Núcleo | O2 | Informado | La copia sobre un INT existente en B crea "versión 2 borrador" y conserva la versión 1 publicada. |
| RF-CAT-107 | Registrar identidad de la copia, procedencia, versión, componentes elegidos, actor, fecha, resultado, dependencias pendientes; evitar duplicados por reintentos. | BASE §81 | Núcleo | O2 | Informado | Reintentar con el mismo `Idempotency-Key` devuelve la misma ejecución. |
| RF-CAT-108 | Exigir permiso explícito de lectura en origen y de escritura en destino; ser administrador de B no autoriza a leer A. | BASE §81 | Núcleo | O2 | Adoptado (DEC-025; PA-CAT-07) | Un administrador de B sin autorización de A recibe 403. |
| RF-CAT-109 | Mantener plantillas de servicio de plataforma (sin precios ni referencias de tenants) reutilizables para lanzar servicios. | DFA M4 mejora "plantillas reutilizables" | Estándar | O2 | Adoptado (DEC-026; PA-CAT-08) | Un tenant nuevo crea INT desde la plantilla "Internet FTTH base". |

### 5.9 Oferta, portal y landing

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CAT-110 | Publicar en la landing del tenant los servicios y planes con oferta abierta, sus requisitos y canales para solicitar, sin login. | BASE §66 CAT-002, §1 | Núcleo | O2 | Informado | La landing de TEN-002 muestra Electricidad y Gas. |
| RF-CAT-111 | En la PWA, mostrar servicios disponibles y contratados con estado, condiciones, beneficios temporales, equipos asignados y acciones permitidas. | BASE §48, §72 | Núcleo | O2 | Informado | Ana ve su INT Activo, su ONT en comodato y "Solicitar baja". |
| RF-CAT-112 | Desde la oferta o el contrato, iniciar solicitudes de alta, baja, suspensión, reactivación o cambio de plan; la solicitud la gestiona CRM y no cambia el contrato hasta su ejecución. | BASE §48 SOL-001, SOL-002, §53 | Núcleo | O2 | Informado | Solicitar la baja deja el contrato Activo con marca "Baja solicitada" hasta su ejecución. |
| RF-CAT-113 | Proveer indicadores del catálogo: contratos por servicio/estado/plan/categoría, altas pendientes, suspensiones, bajas, equipos pendientes de devolución, contratos no facturables, planes discontinuados con contratos vigentes. | BASE §54, §86 Indicadores | Estándar | O2 / O11 | Informado | El tablero muestra cada indicador con universo y fecha de corte. |

## 6. Reglas de negocio

### 6.A Reglas generales

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CAT-001 | Un servicio solo puede habilitarse en un tenant si la capacidad está `available` y licenciada. | Todo instalado; módulos por licencia `.pro` (RN-09 §5.4). | Reemplazar (T01 + CAT). | — | — |
| RN-CAT-002 | Habilitar/publicar no genera contratos ni cobros. | No aplica. | Replicar principio BASE §66/§81. | — | — |
| RN-CAT-003 | Deshabilitar oferta (`offerStatus=closed`) impide nuevas solicitudes y altas; los contratos existentes siguen su ciclo. Deshabilitar operación (`operationStatus=closed`) solo es posible sin contratos no terminados o con plan de salida aprobado. | No aplica. | Mejorar. | PRM-CAT-001 | — |
| RN-CAT-004 | Toda modificación de configuración publicada se hace mediante una nueva versión; la versión publicada es inmutable. | `HIS_SERVICIO` por cuadro tarifario; edición directa de `SERVICIO`. | Mejorar (AGR-009). | — | — |
| RN-CAT-005 | Una versión no se publica si falla alguna validación bloqueante: plan sin precio vigente en TAR, concepto sin clase fiscal, servicio regulado sin autoridad/título, falta de equivalencia contable, referencia a otro tenant, estado operativo sin mapeo canónico, evento sin estado por defecto. | No aplica. | Mejorar. | — | — |
| RN-CAT-006 | La fecha efectiva de una versión puede ser futura; nunca anterior a la última facturación cerrada del servicio salvo versión correctiva aprobada que dispara ajustes en FAC. | Cuadros con desde/hasta (`CUADROS`). | Mejorar (AGR-010). | — | — |
| RN-CAT-007 | Un plan discontinuado no se ofrece a nuevas contrataciones y conserva condiciones de contratos anteriores. | No hay plan explícito. | Replicar BASE §5. | — | — |
| RN-CAT-008 | Un cambio comercial del plan genera nueva versión; los contratos conservan la versión aceptada hasta un cambio de plan propio o una política de migración aprobada y comunicada. | No aplica. | Replicar BASE §5/§72. | — | — |
| RN-CAT-009 | Cada concepto facturable pertenece a un único servicio del tenant (salvo conceptos transversales: capital, tasas de terceros, franqueo), conservando su vínculo con el servicio aun en facturas agrupadas. | `PROD_SER` global con rubro. | Mejorar (BASE §72). | — | — |
| RN-CAT-010 | No se crea un servicio de facturación independiente por concepto: instalación y abono de Internet pertenecen a Internet. | — | Replicar BASE §72. | — | — |
| RN-CAT-011 | Instalación al contado y financiada son alternativas excluyentes en el contrato; elegir una anula la otra. | — | Replicar BASE §72 CU-PRO-01. | — | — |
| RN-CAT-012 | Una bonificación comercial no es subsidio estatal; un subsidio exige régimen registrado. | Categoría con subsidio (`COD_CATSER_SS`). | Replicar con tipificación explícita. | — | — |
| RN-CAT-013 | Promoción: guarda base, porcentaje/importe (TAR), duración, unidad de duración (`calendarMonths`, `billedCycles`, `days`), regla del primer período parcial (consume/no consume) y fin. | — | Replicar BASE §72, AGR-017. | — | A validar con TAR |
| RN-CAT-014 | Un plan solo puede incluir conceptos del mismo servicio o transversales permitidos; un paquete combina planes de servicios habilitados. | — | Mejorar. | — | — |
| RN-CAT-015 | La categoría del contrato es la base estructural; si una lectura trae otra categoría del mismo servicio, prevalece la de la lectura para ese período (regla de TAR; CAT valida que exista). | RN-01 §2 "categoría del consumo". | Replicar (delegado a TAR). | — | — |
| RN-CAT-016 | Una categoría se considera social solo si tiene `isSocial=true`; se descarta la inferencia por descripción "JUBILADOS". | `Es_Categoria_Social` por `CAT_SOC` o descripción. | Reemplazar. | PRM-CAT-030 | — |
| RN-CAT-017 | El estado operativo siempre mapea a un estado canónico; la transición la gobierna el estado canónico. | `ESTASER` libre + `CONDICION` derivada de fechas. | Reemplazar (AGR-003). | — | — |
| RN-CAT-018 | Las fechas nulas se guardan como `null`; se elimina la fecha centinela. | Fechas nulas normalizadas a 1901-01-01 (RN-06 §4.1). | Reemplazar. | — | — |
| RN-CAT-019 | "Conectado a efectos de facturación y lecturas" = estados canónicos `active`, `suspended` (cuando el servicio declara que la suspensión factura cargos), `pendingTermination`. | Condición 2 o 3 (RN-06 §4.1). | Mejorar (configurable por servicio). | PRM-CAT-040 | — |
| RN-CAT-020 | Alta: servicio y domicilio del servicio son obligatorios; fecha de alta obligatoria salvo servicio técnico (la pone el cierre de la OT). | RN-06 §3.2 paso 1. | Replicar. | — | — |
| RN-CAT-021 | Alta: categoría obligatoria; cantidad obligatoria en servicios por cantidad o por dispositivos. | RN-06 §3.2 paso 2. | Replicar. | — | — |
| RN-CAT-022 | Matrícula única dentro del servicio entre contratos no dados de baja salvo parámetro "permitir duplicada"; si el servicio genera matrícula automática, se controla siempre. | RN-06 §3.2 paso 3 (V2 2250, corregido en segunda pasada). | Replicar. | PRM-CAT-020 | — |
| RN-CAT-023 | Designación catastral e inmueble obligatorios si el servicio lo exige; no se duplica la misma parcela en el mismo servicio salvo autorización (subdivisión/unificación, BASE §88). | RN-06 §3.2 paso 4, V2 319. | Replicar y mejorar con excepción autorizada. | PRM-CAT-011 | — |
| RN-CAT-024 | Grupo de facturación obligatorio y válido. | RN-06 §3.2 paso 5 (−1 inválido). | Replicar. | — | — |
| RN-CAT-025 | Actividad, clase, ZSR y dispositivo obligatorios según el perfil. | RN-06 §3.2 paso 6. | Replicar. | PRM-CAT-010, 012 | — |
| RN-CAT-026 | Factibilidad: si el servicio la exige, el contrato no pasa de `feasibility` a `pendingInstallation` sin factibilidad aprobada por TEC asociada. Por DEC-040 la exigencia es configurable por servicio y obligatoria por defecto en Internet y en los servicios con red. | RN-06 §3.2 paso 7, V2 2050; DEC-040. | Replicar con estado explícito. | PRM-CAT-013 (lectura derivada de PRM-TEC-024, M10, HUE-SRV-07) | — |
| RN-CAT-027 | Garante: si el servicio lo exige, bloquea siempre. | RN-06 §3.2 paso 8. | Replicar. | PRM-CAT-014 | — |
| RN-CAT-028 | Tarifa social única: un titular no puede tener más de un contrato social del mismo servicio; si el proceso de segmentación encuentra varios, prioriza jubilado, luego cuenta principal, luego el contrato más antiguo. | RN-06 §3.2 paso 9, §6 (V2 2740). | Replicar. | PRM-CAT-030 | — |
| RN-CAT-029 | Certificado de instalador: según parámetro no exigir/advertir/exigir; si se informa número, se exigen profesional y fecha salvo parámetro. El nivel lo fija M10 al cerrar la OT de instalación (PRM-TEC-043); CAT lo lee y no lo redefine (HUE-ELE-04). | V2 2343, 2529. | Replicar. | PRM-CAT-015 (lectura derivada de PRM-TEC-043, HUE-ELE-04), 016 | — |
| RN-CAT-030 | Deuda en domicilio/parcela: buscar otras cuentas con el mismo domicilio (calle, número, barrio, localidad, piso, departamento, edificio) o misma nomenclatura; según parámetro, total o vencida; resultado advertencia (por defecto) o autorización de supervisor; nunca traslada deuda. | RN-06 §3.1, V2 2482, 2668, 2669. | Mejorar (BASE §1/§89). | PRM-CAT-017, 018 | — |
| RN-CAT-031 | Titular no activo / dado de baja: según parámetro se impide el alta. | V2 734, 741. | Replicar. | PRM-CAT-019 | — |
| RN-CAT-032 | Dos contratos iguales en la misma cuenta: según parámetro por servicio (medidos/no medidos). | V2 2269, 2715. | Replicar con default distinto (PA-CAT-11). | PRM-CAT-021, 022 | — |
| RN-CAT-033 | Guardado del contrato es transaccional con: creación del pedido de OT (servicio técnico), movimiento de stock del medidor/equipo trazable (vía STK), orden de telemedición (vía MED), extras, adherentes, beneficiarios y datos de dominio; todo efecto externo se publica por outbox. | RN-06 §3.4 (una transacción, `UPDATE` directos). | Mejorar (DEC-003 outbox). | — | — |
| RN-CAT-034 | "Forzar guardado aunque no haya cambios" no se replica; el control optimista por `version` reemplaza al guardado rápido. | V2 2286. | Descartar (deuda técnica). | — | — |
| RN-CAT-035 | Altas automáticas: ante el evento configurado y si se cumplen los filtros, se propone o crea el contrato del servicio destino; grupo de facturación = defecto del destino salvo "tomar grupo" del origen; condición del titular: todos / solo activos / solo no activos. | RN-06 §3.5. | Replicar con modo `propose`/`create` (PA-CAT-04). | PRM-CAT-050 | — |
| RN-CAT-036 | Una regla automática no crea duplicados: si ya existe contrato no terminado del servicio destino en la misma cuenta y punto, no actúa. | No documentado. | Mejorar. | — | — |
| RN-CAT-037 | Conceptos por evento: con "una sola vez", no se repite el mismo concepto dentro del mismo lote ni (mejora) si ya se cobró para el mismo contrato y evento; no se configuran dos conceptos "una vez" con el mismo producto y tipo. | RN-06 §3.6 (no controla operaciones anteriores). | Mejorar. | — | — |
| RN-CAT-038 | Conceptos por evento con costo para suspensión/reactivación solo se aplican si la política de MOR los habilita para ese servicio y jurisdicción; la solicitud de baja nunca genera cargo. | `CONEXION` tipo 4 (reconexión) sin control normativo. | Mejorar (BASE §53 CIC-004). | — | — |
| RN-CAT-039 | Servicio técnico: la baja administrativa no corta; crea pedido de desconexión a TEC y el contrato pasa a `pendingTermination`; la baja efectiva ocurre al confirmar la OT. Servicio no técnico: la baja efectiva puede registrarse en el acto por un usuario con permiso. | RN-06 §4.2. | Replicar. | — | — |
| RN-CAT-040 | Al generar OT de desconexión, si el servicio "consulta baja", se pregunta si se registra también la baja administrativa. | RN-06 §4.2 (`CONSULTA_BAJA`). | Replicar como opción del comando. | — | — |
| RN-CAT-041 | Al confirmar desconexión efectiva, si la baja administrativa estaba vacía se completa con la misma fecha. | RN-06 §4.2. | Replicar. | — | — |
| RN-CAT-042 | Cierre de OT (eventos de TEC): alta → `active` con fecha efectiva, copia de matrícula, lectura inicial 0 si el servicio lo pide (MED); traslado → domicilio nuevo; desconexión → medidor retirado (MED) y, según parámetro, se limpian matrícula y número de medidor; reconexión → `active` y posible bonificación de reconexión. Si la integración de telemedición falla, la OT no se cierra y el contrato no cambia. | RN-06 §4.2 "Cierre de la OT". | Replicar con eventos y saga. | PRM-CAT-041 | — |
| RN-CAT-043 | Reconexión de no medido en el mismo mes y año de la última baja efectiva: si el parámetro está apagado se restaura la fecha de alta anterior para no partir el período; en medidos o con parámetro activo, fecha nueva. | RN-06 §4.2 (V2 2707, corregido). | Replicar. | PRM-CAT-042 | — |
| RN-CAT-044 | Reconexión a titulares fallecidos: prohibida salvo parámetro. | V2 2301. | Replicar. | PRM-CAT-043 | — |
| RN-CAT-045 | **Reemplazado por RF-SOC-019 y PRM-SOC-004/005 (M18, HUECO-TRV-01)**: M18 aplica la cascada al consumir los eventos de estado del contrato. Texto original: Desconexión/reconexión del contrato se propaga a adherentes y beneficiarios según política del servicio (`cascade`, `ask`, `none`); con "consultar al reconectar" se pregunta. | RN-06 §10 (siempre en cascada), V2 2401. | Mejorar (CTR-CAT-03). | PRM-CAT-060 (Reemplazado) | — |
| RN-CAT-046 | Integraciones externas por cambio de estado (BATCOM, Discar, SITSA, AION, telemedición) se configuran por servicio y se ejecutan por outbox con confirmación; nunca con código de servicio fijo. | V2 2713 + V2 car 2264 "BAT" con `COD_SER = 1` fijo; V2 3116; V2 car 3034. | Reemplazar (T06). | — | — |
| RN-CAT-047 | Cambio de categoría individual: si el servicio genera OT, no se admite una segunda OT pendiente del mismo tipo; la categoría se aplica inmediata, en fecha o al cierre de la OT según `categoryChangeMode`. | RN-06 §6 (V2 2330, V2 2455). | Replicar con modo explícito. | PRM-CAT-044, 045 | [VERIFICAR] semántica V2 2455 (CTR-CAT-07) |
| RN-CAT-048 | Cambio de categoría dentro del período: si la fecha es posterior al día límite configurado, se cobra proporcional (TAR). | V2 2755. | Replicar. | PRM-CAT-046 | — |
| RN-CAT-049 | Cambio masivo por deuda solo a categorías prepagas (paso a prepago del moroso) y solo por orden de MOR con política habilitada. | RN-06 §6 `ModificarCategoria`. | Replicar acotado. | — | — |
| RN-CAT-050 | Recategorización por segmentación: guarda categoría anterior, actualiza consumos no facturados (MED/TAR), deja nota "Recategorización" en el contrato; excluye marcados "No aplica recategorización" y bajas de más de 60 días; opción de incluir desconectados. | RN-06 §6, V2 2825, 3155. | Replicar. | PRM-CAT-031, 032 | — |
| RN-CAT-051 | Transferencia: siempre se crea contrato nuevo en destino (fecha de alta = fecha de transferencia salvo "mantener fecha"); el original recibe baja efectiva y estado `superseded` (si el parámetro está activo) o `terminated`; la deuda queda en el titular original. | RN-06 §7 (modos eliminar y clonado; V2 2541, V2 422). | Mejorar: se descarta el modo "eliminar" (CTR-CAT-08). | PRM-CAT-051 | — |
| RN-CAT-052 | (Tratamiento de miembros: Reemplazado por RF-SOC-022 y PRM-SOC-012 de M18 al consumir EVT-CAT-17, HUECO-TRV-01.) Transferencia de adherentes y beneficiarios: copiar dados de baja (histórico) / copiar activos / no copiar (equivalente a "eliminar": en CoopApps se dan de baja en origen sin borrarlos). | V2 int 2291. | Replicar sin borrado físico. | PRM-CAT-052 | — |
| RN-CAT-053 | Transferencia de contratos dados de baja: solo con parámetro. | V2 2599. | Replicar. | PRM-CAT-053 | — |
| RN-CAT-054 | Al transferir a un titular nuevo puede marcarse la cuenta destino como principal según parámetro. | V2 3195. | Replicar (efecto en PER). | PRM-CAT-054 | — |
| RN-CAT-055 | Traslado de domicilio del servicio solo por OT en servicios técnicos; en no técnicos por comando con permiso; se guarda domicilio anterior con vigencia. | RN-06 §8. | Replicar. | PRM-CAT-055 | — |
| RN-CAT-056 | **Reemplazado por RF-SOC-026 (M18, HUECO-TRV-01).** Texto original: Adherentes computables: los no dados de baja, excluyendo según marcas del servicio (menores nacidos en el último año al fin del mes siguiente, jubilados, personas con discapacidad); la edad se calcula al último día del período. | RN-01 §9. | Replicar (cálculo en TAR, datos en CAT). | — | — |
| RN-CAT-057 | **Reemplazado por RF-SOC-015, RF-SOC-016 y RF-SOC-018 (M18, HUECO-TRV-01).** Texto original: Adherentes fuera de rango (edad, ocupación, vínculo no admitido por la categoría) se detectan en lote; se dan de baja o cambian de categoría por trámite masivo con aprobación; se excluyen personas con discapacidad. | RN-06 §10. | Replicar. | — | — |
| RN-CAT-058 | **Reemplazado por RF-SOC-017 y JOB-SOC-01 (M18, HUECO-TRV-01).** Texto original: Aviso de hijos que cumplen 21 años a la fecha (job) y por correo si el parámetro lo indica. | RN-06 §10, V2 3186, 3187. | Replicar (notificación T09). | PRM-CAT-061, 062 (Reemplazados por PRM-SOC-009..011) | — |
| RN-CAT-059 | **Reemplazado por RF-SOC-020 y RF-SOC-021 (M18, HUECO-TRV-01).** Texto original: Fallecimiento registrado en PER da de baja los vínculos (adherente, beneficiario) con fecha de fallecimiento; según parámetro se ocultan en la ficha. | RN-06 §10, V2 3058. | Replicar por evento `per.person.deceased`. | PRM-CAT-063 (Reemplazado por PRM-SOC-007) | — |
| RN-CAT-060 | **Reemplazado por RF-SOC-013 (M18, HUECO-TRV-01).** Texto original: Adherente que ya existe en el mismo servicio: según parámetro se permite o se consulta si darlo de baja del otro titular. | V2 2400, 2521. | Replicar. | PRM-CAT-064, 065 (Reemplazados por PRM-SOC-002, 003) | — |
| RN-CAT-061 | Equipo en comodato: solo se asigna una unidad serializada disponible en STK del depósito del técnico/servicio; al asignar, STK mueve la unidad a "en comodato"; al devolver, STK la recibe; la baja comercial no espera la devolución. | `SERSOC_PRODUCTOS` + stock trazable. | Replicar y mejorar (BASE §86). | — | — |
| RN-CAT-062 | "No facturar": requiere parámetro habilitante, permiso, motivo y vigencia; FAC lista estos contratos en la bandeja de no facturables; al vencer, se reanuda la facturación y se avisa. | V2 2303, `SUMNOFAC` (a nivel cuenta). | Mejorar (vigencia obligatoria). | PRM-CAT-070 | — |
| RN-CAT-063 | "Provisorio": contrato transitorio con fecha de vencimiento obligatoria; al vencer, se notifica y se propone baja o conversión a definitivo. "Cobrar provisorio" indica si se factura durante la condición provisoria. | Marcas Provisorio / Cobrar provisorio; filtro "provisorio" en `CONEXION`; trámite masivo "marcar provisorio". | Mejorar | PRM-CAT-071 | [VERIFICAR] semántica exacta (PA-CAT-09) |
| RN-CAT-064 | Un contrato no pasa a `active` sin: titular, cuenta, plan/categoría vigente, grupo de facturación, requisitos del perfil cumplidos y, si es técnico, confirmación de instalación. | RN-06 §3.2. | Replicar. | — | — |
| RN-CAT-065 | La baja del servicio no da de baja al asociado; la baja del titular con servicios activos está prohibida salvo parámetro (regla de PER que CAT informa). | BASE §48; RN-06 §5 (V2 340, 337). | Replicar (PER). | — | — |
| RN-CAT-066 | Consulta histórica: toda consulta del contrato "a una fecha" declara si interpreta fecha efectiva o fecha de registro. | — | Adoptar AGR-010. | — | — |
| RN-CAT-067 | Cambios dentro del período (plan, categoría, titular, suspensión) guardan cada tramo con su regla y zona horaria del tenant; inclusión de días según la regla del servicio (TAR). | — | Adoptar AGR-017. | — | — |
| RN-CAT-068 | Copia entre tenants: nunca se copian datos operativos ni credenciales; toda referencia interna se mapea al destino o queda pendiente; la configuración copiada es independiente (sin sincronización posterior). | No aplica (una base por cooperativa). | Replicar BASE §81. | — | — |
| RN-CAT-069 | Copia: marca y diccionario del destino prevalecen; el régimen fiscal y subsidios no se presumen aplicables. | — | Replicar BASE §81. | — | — |
| RN-CAT-070 | Las transiciones son idempotentes por `commandId`; un reintento no duplica cargos ni ejecuciones. | — | Adoptar AGR-016, BASE §53. | — | — |
| RN-CAT-071 | Un ticket CRM cerrado no cambia por sí solo el contrato ni cancela deuda. | — | Adoptar AGR-002. | — | — |
| RN-CAT-072 | Baja de contrato con cuotas relacionadas (financiación, obra, vivienda) según parámetro: permitir, o exigir supervisor mostrando las cuotas; las cuotas no desaparecen. | V2 2316. | Replicar. | PRM-CAT-072 | — |
| RN-CAT-073 | "Facturar sin consumo": en servicios medidos (tipos 1 a 4) conectados o pendientes de desconexión, si no hay consumos se factura cargo fijo con consumo 0; sin la marca, no genera ítems. | RN-01 §2. | Replicar (TAR lee la marca de CAT). | — | — |
| RN-CAT-074 | Servicio relacionado: si el servicio usa consumo de otro, TAR toma las lecturas del servicio relacionado en la misma cuenta (opcionalmente solo no facturadas). | RN-01 §2 (`REL_SER`, `USA_COT`, V2 2701, 3143). | Replicar. | PRM-CAT-080 | — |
| RN-CAT-075 | Telefonía: el contrato telefónico factura la suma de llamadas tarifadas (TEC/TAR); si no hay llamadas y el parámetro lo indica, el ítem va en 0; CPP e internacionales a conceptos propios configurados en el servicio; los conceptos de CPP e internacionales los fija M04 (PRM-TAR-081, PRM-TAR-082, RN-TAR-083) y CAT solo los muestra (HUE-TEL-03). | RN-01 §10 (V2 2514, 19, 24). | Replicar (CAT define conceptos; TAR calcula). | PRM-CAT-090; PRM-CAT-091..092 (solo lectura, HUE-TEL-03) | — |
| RN-CAT-076 | **Alumbrado sin doble cobro** (HUE-ALU-02): según el criterio del tenant (PRM-CAT-111), el alumbrado se cobra como contrato ALU accesorio (tipo 6) vinculado al ELE o como regla de tipo impuesto `tasa_alumbrado` de M04 sobre el ELE, nunca ambos. CAT rechaza activar un contrato ALU cuyo `parentContractId` ELE tenga una regla `tasa_alumbrado` vigente en M04, y rechaza cambiar el criterio mientras existan contratos ALU activos sin plan de migración. Error `CAT_ALU_DOUBLE_CHARGE`. M04 aplica la validación recíproca al dar de alta la regla (RF-TAR-057). | ProCoop admite ambos esquemas a la vez (alumbrado como servicio por `ALTASEAU` y como tasa por cuenta de terceros). | Mejorar. | PRM-CAT-111 | — |
| RN-CAT-077 | **Sin precio por unidad de sangre** (HUECO-SAN-01): en servicios con capacidad SAN, la publicación rechaza todo concepto facturable cuya base de cálculo sea la unidad de sangre, el hemocomponente o la transfusión (`kind` por uso o por cantidad con esa unidad). Solo se admiten cuota o aporte del plan, gastos administrativos y cargos por evento no vinculados a la cantidad de sangre (RF-SOC-067). Error `CAT_SAN_BLOOD_UNIT_PRICE`; se suma a las validaciones de RN-CAT-005. | Ficha 6.C.12; ProCoop no lo impide. | Mejorar (Ley 22.990). | — | — |
| RN-CAT-078 | **Cambio de régimen de medición** (HUE-AG-03): `changeMeteringRegime` solo se acepta en contratos `active` o `suspended` de servicios con medición opcional; la fecha efectiva no puede ser anterior al último período facturado ni coincidir con otro cambio de régimen pendiente. Al pasar a `metered` el contrato se factura por consumo desde la primera lectura válida posterior a la fecha efectiva, y mientras M03 no confirme el punto de medición (RF-MED-012) sigue la cuota fija. Al pasar a `unmetered`, M03 registra el retiro con lectura final (RF-MED-022) y desde la fecha efectiva rige la cuota fija. Cada cambio queda en `serviceContractHistory` y publica EVT-CAT-28. | ProCoop lo resuelve cambiando categoría y medidor a mano. | Mejorar. | — | — |
| RN-CAT-079 | **Paquete de grilla mínima de TV** (HUE-TV-03): cada servicio de dominio TV puede tener como máximo un producto de tipo paquete marcado `tvMinimumLineup = true`, en estado `active`; no se puede discontinuar mientras PRM-MOR-200 de M08 lo referencie. Al suspender por mora en modo `restricted`, el contrato conserva solo ese paquete y M10 reprovisiona la señal; al reactivarse vuelven las condiciones contratadas. | No existe en ProCoop. | Nuevo. | PRM-MOR-200 (M08) | Sí: validación legal de la grilla mínima exigible (RN-MOR-138). |

### 6.B Perfil de configuración por servicio (BASE §84) — estructura obligatoria

Cada `tenantService` tiene un perfil con estas 13 dimensiones. Para cada una se indica qué campos la materializan (sección 7) y qué módulo la consume.

| Dimensión | Contenido obligatorio | Campos (`tenantServices.profile.*`) | Consumidor |
|---|---|---|---|
| Prestador y jurisdicción | Modalidad: `direct`, `subdistribution`, `agreement`, `administrativeIntermediation`; autoridad/regulador; título habilitante; concesión; jurisdicción (nacional/provincial/municipal); fuente normativa con vigencia. | `provider.mode`, `provider.authorityIds[]`, `provider.licenseRef`, `provider.concessionId`, `provider.jurisdiction`, `provider.normativeSources[]{code,title,url,validFrom,validTo,verifiedAt}` | FIS, BIA (reguladores) |
| Titularidad | Identificación DNI/CUIT obligatoria, representación admitida, responsables, beneficiarios, cambio de titular admitido y condiciones. | `ownership.idTypes[]`, `ownership.allowsRepresentation`, `ownership.allowsBeneficiaries`, `ownership.allowsAdherents`, `ownership.ownerChangeMode` | PER, CRM |
| Unidad de prestación | Unidad central del dominio sin equivalencias automáticas. | `unit.kind` (enum sección 7), `unit.label` (dict) | TAR, FAC |
| Oferta | Productos, planes, lista/versión de precios vinculada y condiciones. | `offer.productIds[]`, `offer.planIds[]`, `offer.tariffBinding` | TAR, landing |
| Cantidad | Medida real/estimada, capacidad, tiempo, unidad o cobertura. | `quantity.mode` (`metered`, `unmetered`, `byQuantity`, `byDevices`, `byAdherents`, `byCalls`, `byProperty`, `installments`, `coverage`, `notApplicable`), `quantity.unitOfMeasure` | MED, TAR |
| Excepciones | Beneficios, descuentos, exclusiones, cargos, recargos e intereses habilitados con base y vigencia. | `exceptions.allowed[]` (referencias a TAR/MOR) | TAR, MOR |
| Facturación | Conceptos permitidos, ciclos, corte, anticipado/vencido, prorrateo, clase fiscal, grupo de facturación por defecto, facturar sin consumo, liquidación como servicio público ante ARCA (LQSP; DEC-093, RF-CAT-117). | `billing.conceptIds[]`, `billing.cycleIds[]`, `billing.timing` (`inAdvance`/`inArrears`), `billing.prorationRule`, `billing.defaultBillingGroupId`, `billing.billWithoutConsumption`, `billing.publicServiceSettlement` (bool, ex `SERVICIO.LIQ_AFIP`; DEC-093) | FAC, TAR, FIS |
| Cuenta y pago | Auxiliar por contrato/servicio, agrupación autorizada, imputación, conciliación. | `account.ledgerMode` (`perContract`, `perService`, `unified`), `account.allowGrouping` | COB |
| Ciclo comercial | Solicitud, validación, presupuesto, alta y fecha efectiva; requisitos de alta; factibilidad; aprobación. | `commercial.requirements{}` (sección 7), `commercial.requiresFeasibility`, `commercial.requiresQuote`, `commercial.approvalMode` | CRM, TEC |
| Operación | Visitas, recursos, equipos, registros, evidencia, responsables; servicio técnico; operaciones técnicas por evento. | `operation.requiresWorkOrder`, `operation.autoWorkOrderOnSave`, `operation.askAdminTerminationOnDisconnectionWO`, `operation.workOrderTypes{}`, `operation.equipment[]` | TEC, STK |
| Cambios y salida | Cambio de plan/titular, suspensión, reactivación, baja, obligaciones remanentes, cascadas. | `lifecycle.allowedOperations{}`, `lifecycle.defaultOperationalStatus{}`, `lifecycle.memberCascade`, `lifecycle.categoryChangeMode` | CRM, MOR |
| Atención | Motivos, urgencias, tiempos, escalamiento y canales regulatorios. | `support.reasonCatalogRef`, `support.regulatoryChannel` | CRM |
| Control | Auditoría, reportes específicos, integraciones y restricciones de datos (sensibles). | `control.sensitiveData` (bool), `control.integrations[]`, `control.reports[]` | IAM, BIA, INT |

### 6.C Fichas por dominio de servicio

Cada ficha es la **plantilla de capacidad** que la plataforma ofrece (`serviceCapabilities.domainSheet`) y que el tenant completa en su perfil. Los atributos listados se materializan como `domainAttributes` tipados del contrato (sección 7.18) validados por el esquema de la capacidad. Importes: siempre en TAR; aquí solo estructura. "No aplica" se marca explícitamente (BASE §93).

#### 6.C.1 INT — Internet (piloto, DEC-005)

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión/contrato por titular; varias conexiones independientes en un domicilio (BASE §86). |
| Régimen y autoridad | Servicio TIC; ENACOM; Reglamento de Clientes TIC (Res. 733/2017): contratación, información, facturación, reclamos con plazos diferenciados por motivo y número de gestión previa ante el prestador [ESP10–ESP12]. |
| Perfil de registración / cálculo | Perfil "Internet"; tipo de cálculo "importe fijo" (6) con proporcional de alta y baja; medición de tráfico solo si existe fuente definida (BASE §86). |
| Atributos de dominio | Tecnología (FTTH, inalámbrico, cablemódem, DSL), velocidad bajada/subida ofrecida, cobertura/zona, nodo/OLT/puerto (referencia TEC), identificador de acceso (referencia; secreto en bóveda), MAC/IP asignada (referencia TEC), perfil de red de la categoría (`networkProfileCode`, ex `PERFIL_MIKROTIK`), IP fija (subservicio), id de factibilidad. |
| Estados propios | Canónicos completos; suspensión por mora en modo `restricted` (velocidad reducida) o `interrupted`; `reactivationPending` hasta confirmación del aprovisionamiento. |
| Hito de alta / salida | Alta: instalación/activación confirmada (prueba y conformidad). Salida: baja comercial + orden de desactivación + retiro de equipo; devolver el router no equivale a baja procesada (BASE §86). |
| Documentos | Contrato/condiciones TIC versionadas, constancia de instalación con firma, constancia de entrega de equipo en comodato, constancia de baja con número de gestión. |
| Productos y conceptos típicos | Producto "Fibra hogar"; planes por velocidad; instalación (una vez, devenga al instalar), abono (recurrente desde activación), promoción por ciclos, financiación de instalación, IP fija, equipo en comodato/venta, cambio de domicilio, reconexión (si la política lo habilita). |
| Límites | Aprovisionamiento (MikroTik/Radius/OLT), diagnóstico, monitoreo de nodos e incidentes de zona → M10 TEC; ninguna acción de red sin circuito CRM o MOR (MER-017). Mostrar estado en la app no configura la red. |
| Ola | O2 (catálogo, contrato) – O3 (activación, equipos) – O4 (facturación) – O6 (suspensión). |
| Origen | BASE §72, §86, §93, MER-017; CAT `INTERNET`, `MIKROTIK`, `CATE_SER_EXTRAS.PERFIL_MIKROTIK`; DFA M25. |

#### 6.C.2 TEL — Telefonía (fija, móvil, pack SMS)

| Aspecto | Definición |
|---|---|
| Unidad central | Línea/número asignado a un contrato. |
| Régimen y autoridad | Servicio TIC; ENACOM; reglas TIC específicas. |
| Perfil / cálculo | Perfil "Teléfono"; tipo de cálculo 5 (suma de llamadas tarifadas) o 14 (telefonía móvil, importe fijo) o 16 (pack SMS, importe fijo). |
| Atributos de dominio | Número asignado con fecha alta/baja y tarifa telefónica (ex `TEL_SERSOC`), modalidad (fija/móvil, ex `TEL_MODALIDAD`), servicio telefónico (ex `TEL_SERVICIO`), central/repartidor/regleta/puerto (referencia TEC), plan de descuento (TAR), operador (móvil), guía telefónica (publicar sí/no). |
| Estados propios | Canónicos; sub-estado "línea bloqueada saliente" mapeado a `suspended/restricted`. |
| Hito de alta / salida | Alta: línea activa en central. Salida: baja de línea, liberación del número a "en cuarentena" en TEC. |
| Documentos | Contrato TIC, detalle de llamadas (impresión desde ficha; el socio lo consulta por período en PAN-POR-103 de M19, de solo lectura sobre M04/M10, HUE-TEL-02), guía telefónica. |
| Productos y conceptos típicos | Abono de línea, minutos/llamadas (tasación de CDR en TEC/TAR), CPP (concepto configurado en M04 PRM-TAR-081, V2 19; HUE-TEL-03), internacionales (concepto configurado en M04 PRM-TAR-082, V2 24; HUE-TEL-03), servicios telefónicos adicionales (ex `SERTEL`: código, producto, importe, precio proveedor, consumo, tipo), pack SMS (V2 2253), telefonía prepaga (producto que genera OT al venderse, V2 2708). |
| Límites | Centrales, DSLAM, numeración, importación/tasación de CDR, bandas, claves, rechazos → M10 TEC / M04 TAR. |
| Ola | O4 (abono) – O10 (CDR y tasación). |
| Origen | BASE §32, §39.2, §92, MER-017; RN-01 §10; CAT §12 (`TEL_*`, `TARTEL`, `SERTEL`, `LLAMADAS`, `LLA_CEL`, `INTERNAC`, `GRATIS`, `OPERADOR`, `PLANDES`); DFA M25. |

#### 6.C.3 TV — Televisión / cable

| Aspecto | Definición |
|---|---|
| Unidad central | Contrato con paquete y puntos/equipos. |
| Régimen y autoridad | Servicio TIC/audiovisual; ENACOM. |
| Perfil / cálculo | Perfil "Fijos con dispositivos"; importe fijo; cantidad de puntos/decodificadores como dispositivos. |
| Atributos de dominio | Paquete, puntos de conexión, decodificadores (series en STK), señales adicionales, tecnología (cable/IPTV). |
| Estados propios | Canónicos. |
| Hito de alta / salida | Alta: activación de señal. Salida: corte de señal y retiro de equipos. |
| Documentos | Contrato, constancia de equipos. |
| Productos y conceptos típicos | Abono por paquete, adicionales (pack de señales), punto adicional, decodificador en comodato (modalidad por defecto `loan`, PRM-CAT-093, DEC-013, HUE-TV-02), instalación. |
| Paquete de grilla mínima | El tenant marca un producto de tipo paquete del servicio TV como grilla mínima (`serviceProducts.tvMinimumLineup = true`, uno por servicio; RN-CAT-079). M08 lo referencia en PRM-MOR-200 (`delinquencyPolicies.finalAction.tvMinimumLineupPackageId`) para la suspensión por mora en modo `restricted` (RN-MOR-138, HUE-TV-03): el abonado conserva solo ese paquete. |
| Abonados por paquete | Informe de abonados activos por paquete a una fecha de corte (RF-CAT-116, REP-CAT-16, API-CAT-56), base de la liquidación de derechos de señales de M12 (RF-CMP-155, JOB-CMP-09; HUE-TV-01). El paquete es un producto del servicio TV en `serviceProducts`: `signalRightsContracts.packageIds[]` y `signalRightsSettlements.lines.packageId` de M12 apuntan a `serviceProducts` (M02), no a `servicePlans` (PA-CAT-23). |
| Límites | Derechos de señales, aprovisionamiento → TEC; a relevar por tenant (BASE §92). La liquidación a las programadoras la hace M12 con el informe de RF-CAT-116. |
| Ola | O10. |
| Origen | BASE §32, §39.2, §48, §92. |

#### 6.C.4 ELE — Energía eléctrica (incluye generación distribuida y grandes usuarios)

| Aspecto | Definición |
|---|---|
| Unidad central | Suministro y punto de medición. |
| Régimen y autoridad | Córdoba: ERSeP (Ley 8835) regulador; EPEC prestadora mayorista con tarifa de abastecimiento a cooperativas [ESP1–ESP4]; Reglamento de Suministros (RG ERSeP 11/2005, referencia histórica) [ESP26]; Ley 10281 seguridad eléctrica e instalador habilitado [ESP7]; electrodependencia Ley 27351 y Ley 10511 [ESP8–ESP9]; Ley 10739 contenido de facturas [ESP5]; Secretaría de Energía y OCEBA/EPRE en otras jurisdicciones. |
| Perfil / cálculo | Perfil "Energía"; tipos 1, 2 o 4; variante grandes clientes (incluye medidor testigo). |
| Atributos de dominio | Destino/uso, categoría local, tipo de suministro (permanente/transitorio), tensión, potencia solicitada/autorizada (kW), características de acometida, tipo de medidor (monofásico/trifásico — MED), demanda pico/fuera de pico (MED), aptitud de instalación (fecha, instalador habilitado, certificado número/vencimiento), condición de electrodependencia acreditada (vigencia), NIS u otro identificador regulatorio, código de empresa ERSeP (tenant), descripción de lectura HP/kVA (V2 2477). |
| Estados propios | `suspended` con `impliesDisconnection`; restricción de corte para electrodependientes (MOR). |
| Hito de alta / salida | Alta: conexión habilitada con lectura inicial. Salida: baja con lectura final; tratamiento de medidor; la deuda queda en quien corresponda. |
| Documentos | Solicitud de suministro, certificado de instalador (nivel de exigencia fijado por M10 PRM-TEC-043, por defecto `require` en ELE con jurisdicción Córdoba por Ley 10281; CAT lo lee en PRM-CAT-015, HUE-ELE-04), presupuesto de obra, constancia de electrodependencia, contrato de suministro, fianza, DDJJ de artefactos eléctricos y vehículos eléctricos (RF-CAT-095, HUE-GAS-01). |
| Productos y conceptos típicos | Cargo fijo, energía (kWh), potencia/demanda (kW), franjas, energía reactiva/factor de potencia, cargos y fondos habilitados por norma, derecho de conexión, reconexión, subsidios/segmentación (categoría con subsidio, SEF). |
| Generación distribuida (vínculo, no servicio) | `generationAgreements` (Reemplazada por `distributedGenerationContracts` de M03; DEC-060, CTR-DAT-59; M02 solo conserva el contrato ELE del suministro): clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; liquidación de demanda e inyección separadas y cuenta de créditos → TAR/FAC/COB; rendición ARCA (RG 5746/2025) → FIS (MER-001). |
| Grandes usuarios | `contractSpecialConditions`: precio particular, potencia contratada, plazo, penalidades, aprobación y versión; lecturas por franja pico/valle/resto, demanda en punta y fuera de punta, reactiva (MED/TAR); revisión previa de factura (FAC) (MER-003). |
| Límites | No equiparar kWh y kW; no aplicar tarifa mayorista como minorista; compra de energía (`FACT_EPEC`), pérdidas y costos → CMP/CON (BASE §87). |
| Ola | O7. |
| Origen | BASE §32, §39.2, §87, MER-001, MER-003; DFA M4; REL ficha; CAT `PROPIESER` (tensión OCEBA), `CATE_SER_EXTRAS` (GENERADOR, CODIGO_TARIFA), `SERSOC_EXTRAS` (ALTA_GENERA, POTENCIA_GENERA). |

#### 6.C.5 AG — Agua potable

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión / unidad de facturación (inmueble, parcela, unidad funcional). |
| Régimen y autoridad | Según concesión: ERSeP, autoridad local o marco hídrico provincial (Decreto 529/94) [ESP1, ESP6]; Ley 10739 [ESP5]; referencias de modalidades: Aguas Cordobesas medido/no medido y lecturas [ESP15, ESP16, ESP28]; cooperativa del interior [ESP17]. |
| Perfil / cálculo | Perfil "Otros medidos" o "Fijos"; tipo 1/2 (medido) o 15 (agua según inmueble: fórmula sobre datos catastrales) o 6 (fijo). |
| Atributos de dominio | Régimen `metered`/`unmetered` con fecha efectiva (se cambia solo con el comando `changeMeteringRegime`, RF-CAT-114, RN-CAT-078, EVT-CAT-28; HUE-AG-03), destino de uso, urbano/rural, radio servido, datos catastrales usados por la fórmula (superficie, frente, categoría de inmueble — PER), punto de servicio, diámetro de conexión. |
| Estados propios | Canónicos; baja contractual distinta de la situación física de la conexión y de la obligación regulatoria del inmueble (BASE §88). |
| Hito de alta / salida | Alta: conexión y condición del régimen. Salida: baja y efectos sobre el inmueble según régimen. |
| Documentos | Solicitud de conexión, factibilidad, presupuesto de obra, inspección. |
| Productos y conceptos típicos | Cargo fijo, bloques/franquicias, excedente (solo si el régimen local los prevé), conexión, obras urbanas/rurales, rehabilitación. |
| Límites | Calidad/laboratorio no se certifica por dato libre; red, válvulas, pozos → TEC; no copiar suspensión de Internet. Dispenser de agua → ficha OTR. |
| Ola | O7. |
| Origen | BASE §39.2, §88; RN-01 §2 (tipo 15). |

#### 6.C.6 CLO — Cloacas / saneamiento

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión al inmueble. |
| Régimen y autoridad | Concesión local/provincial [ESP6]. |
| Perfil / cálculo | Perfil "Fijos" o "Otros medidos" con **servicio relacionado AG** (usa consumo de agua de la misma cuenta) o tipo 17 si es cuota de obra. |
| Atributos de dominio | Servicio relacionado y base de cálculo, conexión domiciliaria, frente. |
| Estados propios | Canónicos. |
| Hito de alta / salida | Alta: conexión habilitada. Salida: según régimen. |
| Productos y conceptos típicos | Cargo de saneamiento, conexión, cuota de obra de red cloacal. |
| Atención | Reclamos por desborde u obstrucción con tipo propio `dict:crm.claimType.clo.desborde` y `dict:crm.claimType.clo.obstruccion` (T03 §10.9.12; HUE-CLO-03), atendidos como incidente de red en M10. |
| Límites | No se habilita automáticamente por existir agua (BASE §88). |
| Ola | O7. |
| Origen | BASE §88, §92; RN-01 §2 (`REL_SER`, `USA_COT`, tipo 17). |

#### 6.C.7 GAS — Gas (natural por red, propano por red, envasado)

| Aspecto | Definición |
|---|---|
| Unidad central | Suministro/medidor/modalidad. |
| Régimen y autoridad | ENReGE (funciones federales ex ENARGAS/ENRE) [ESP13]; subdistribuidor autorizado [ESP14]; distribuidora de referencia (ej. Ecogas: primera alta con aprobación técnica, reglamento de medición y corrección) [ESP22–ESP23]; derechos del usuario [ESP24]. |
| Perfil / cálculo | Perfil "Otros medidos"; tipo 3 (corrección por factor calórico y tramas). |
| Variante envasado (DEC-082) | Gas envasado (garrafas y cilindros) en alcance como variante "envasado" del servicio GAS: venta con stock de M13 y entrega de M10, sin medidor, sin corrección de volumen ni DDJJ de artefactos; tipo de cálculo por cantidad; habilitable por tenant con PRM-CAT-112 (PA-CAT-17 respondida, HUE-GAS-02). En red natural y propano por red la corrección de volumen la aplica M04 (DEC-085). |
| Atributos de dominio | Tipo de gas y modalidad (red natural / propano por red / envasado — PA-CAT-13; variante envasado según PA-CAT-17, HUE-GAS-02), condición de subdistribución, distribuidora de referencia, zona (zona fría), categoría y grupo con código regulatorio, legajo técnico (referencia TEC), matriculado interviniente, aprobación de instalación, DDJJ de artefactos con potencia en kcal/h (sección 7.21, plantilla PRM-CAT-110, HUE-GAS-01), estado de beneficio por zona. |
| Estados propios | `reactivationPending` obligatorio tras suspensión con revisión técnica: "Rehabilitación en trámite" hasta inspección; el pago no acredita instalación segura (BASE §89). |
| Hito de alta / salida | Alta: aprobación técnica/habilitación y colocación del medidor. Salida: baja con lectura final, estado técnico, documentación. |
| Documentos | Legajo, formularios y respuestas de la distribuidora, DDJJ de artefactos, constancia de inspección. |
| Productos y conceptos típicos | Cargo fijo, m³ corregidos (factores por período/categoría, PCS — MED/TAR), componentes del precio, subsidios (SEF), rehabilitación. M03 entrega el volumen medido y M04 aplica la corrección (DEC-085, RN-TAR-035). Envasado: garrafa o cilindro por unidad con su entrega (DEC-082). |
| Límites | El bot recibe y deriva incidentes pero no sustituye emergencias ni decide seguridad; cambiar titular no traslada deuda histórica del inmueble (BASE §89). Informes ENARGAS → BIA/FIS. |
| Ola | O7. |
| Origen | BASE §39.2, §89; DFA M4 Gas; CAT `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS`, `CORREGAS`, `FACTOR_CAL`, `PRCAGAS`, `GRP_CAT`, `ENGAS_CANTMESES`. |

#### 6.C.8 ALU — Alumbrado público

| Aspecto | Definición |
|---|---|
| Unidad central | Contrato accesorio al suministro eléctrico o al inmueble (tasa). |
| Régimen y autoridad | Ordenanza/convenio municipal; puede ser tasa por cuenta de terceros (ver TAS). |
| Perfil / cálculo | Perfil "Fijos"; importe fijo o porcentaje sobre energía (TAR). |
| Atributos de dominio | Convenio municipal, localidad, base de cálculo. |
| Estados propios | Sigue al suministro principal (vínculo `parentContractId`). |
| Hito de alta / salida | Alta automática al conectar ELE si la regla lo prevé (RN-06 §3.5) — sujeto a PA-CAT-04; baja junto con el principal. |
| Productos y conceptos típicos | Cargo de alumbrado; categoría "19 Alumbrado público" para suministros del municipio (REL). |
| Criterio de cobro por tenant | PRM-CAT-111: `accessoryContract` (contrato ALU accesorio tipo 6 vinculado al ELE) o `taxRuleOnEle` (regla de tipo impuesto `tasa_alumbrado` de M04 sobre el ELE, RF-TAR-057); RN-CAT-076 impide tener ambos activos sobre el mismo ELE (HUE-ALU-02). |
| Atención | Reclamo por luminaria apagada con tipo `dict:crm.claimType.alu.luminariaApagada` (T03 §10.9.12); se deriva al municipio o lo atiende la cooperativa según el convenio (`domainAttributes.agreement.claimHandler`) (HUE-ALU-03). |
| Límites | Rendición al municipio → FIS/COB. |
| Ola | O4 (como tasa) – O7. |
| Origen | REL ficha (categoría 19 Alumbrado público), RN-06 §3.5, RN-01 §2 tipo 17. |

#### 6.C.9 OBR — Pavimento y obras (cuotas de obras, contribución por mejoras)

| Aspecto | Definición |
|---|---|
| Unidad central | Cuota de obra por inmueble/frente. |
| Régimen y autoridad | Convenio u ordenanza de obra pública, contribución por mejoras. |
| Perfil / cálculo | Perfil "Cuotas de obras"; tipo 17 (pavimento, cloaca, alumbrado o vivienda). |
| Atributos de dominio | Obra, tramo, metros de frente, cantidad de cuotas, cuotas pagas, unidades totales/facturadas/originales, porcentajes de instalaciones básicas/redes (ex `SERSOC_EXTRAS`: CNT_CUOTAS, CNT_UNIDADES, CNT_UNIDADES_FACTURADAS, CNT_UNIDADES_TOTALES, CNT_CUOTAS_PAGAS, PORC_INST_BASICAS, PORC_INST_REDES, CNT_UNIDADES_ORIGINAL), plan (COD_PLA). |
| Estados propios | `active` hasta completar cuotas → `terminated` (fin natural); baja anticipada solo con cancelación (V2 2316). |
| Hito de alta / salida | Alta: adhesión/asignación de la obra; al aprobarse el prorrateo (EVT-TEC-25 `tec.levy.approved`) JOB-CAT-13 `cat:crear-contratos-obra` crea un contrato por beneficiario con API-CAT-33, idempotente por obra + inmueble (RF-CAT-115, HUECO-OBR-01). Salida: última cuota o cancelación. |
| Productos y conceptos típicos | Cuota de obra, cancelación anticipada, intereses de financiación (MOR). |
| Límites | Gestión de la obra → TEC (obras); grupos de obra (V2 2900). |
| Ola | O7. |
| Origen | RN-01 §2 tipo 17, RN-06 §3.3 (perfil Cuotas de obras), CAT `SERSOC_EXTRAS`, BASE §102 (obras y contribución por mejoras). |

#### 6.C.10 SEP — Sepelio (y subsidio por fallecimiento)

| Aspecto | Definición |
|---|---|
| Unidad central | Cobertura por grupo (titular + adherentes). |
| Régimen y autoridad | Reglamento del servicio/fondo de la cooperativa; prestador de sepelio. |
| Perfil / cálculo | Perfil "Adherentes" / "Adherentes según tarifas"; tipos 9 a 13. |
| Atributos de dominio | Grupo cubierto, carencia, alcance territorial, exclusiones, prestador. Subsidio por fallecimiento: beneficiario, expediente, aprobación, pago (no es automáticamente seguro). |
| Estados propios | Canónicos; cobertura por adherente con `coverageFrom` (alta + carencia). |
| Hito de alta / salida | Alta: adhesión con grupo registrado. Salida: baja de adhesión o de adherente. |
| Documentos | Ficha de adherentes, credencial, solicitud de servicio por evento. |
| Productos y conceptos típicos | Cuota por grupo, cuota por adherente según edad/vínculo/ocupación, excedente de adherentes (`COBRAEXCEDENTE`), servicio por evento no cubierto. |
| Límites | Coordinación del evento → SOC; distinguir de cementerio parque y subsidio (BASE §90). |
| Ola | O10. |
| Origen | BASE §92; RN-01 §9; RN-06 §3.5 (alta automática de sepelio), §10; CAT `ADHSOC`, `TAR_ADHE`. |

#### 6.C.11 CEM — Cementerio parque

| Aspecto | Definición |
|---|---|
| Unidad central | Derecho sobre unidad de sepultura (parcela, nicho, urnario). |
| Régimen y autoridad | Código Civil y Comercial arts. 2103–2113 (cementerios privados: afectación, reglamento, registros de inhumaciones y titulares, derechos de sepultura, mantenimiento) y policía mortuoria nacional/provincial/municipal [ESP18]; verificar si encuadra o es concesión. |
| Perfil / cálculo | Perfil propio "Derecho de sepultura" (nuevo); importe fijo/cuotas por derecho, mantenimiento periódico, actos por evento. |
| Atributos de dominio | Establecimiento, habilitación, reglamento y versión, modalidad jurídica del derecho, unidad (sector, manzana/fila, número — registro en SOC), titular del derecho, responsables y autorizados, instrumento firmado. |
| Estados propios | Contrato: canónicos; la unidad tiene estados propios en SOC (disponible, reservada, adjudicada, ocupada) separados; la mora no libera la unidad ni autoriza disponer de restos (BASE §90). |
| Hito de alta / salida | Alta: constitución/adjudicación del derecho. Salida: transferencia, cesión, extinción según régimen; sin botón de baja simple. |
| Documentos | Instrumento del derecho, reglamento aceptado, autorizaciones de actos. |
| Productos y conceptos típicos | Derecho (cuotas de adquisición), mantenimiento, inhumación, exhumación, reducción, traslado. |
| Límites | Registro de ocupaciones, actos y turnos → M18 SOC; restos humanos no son stock. |
| Ola | O2 (catálogo) – O10 (operación). |
| Origen | BASE §66 CAT-003, §90, §93, §95. |

#### 6.C.12 SAN — Banco de sangre (cobertura por convenio)

| Aspecto | Definición |
|---|---|
| Unidad central | Convenio / grupo / beneficiario. |
| Régimen y autoridad | Ley 22990 (habilitación, prohibición de intermediación lucrativa, límites al cobro al receptor) [ESP19]; autoridad sanitaria; modelos COOPLA y Tío Pujio [ESP20–ESP21]. |
| Perfil / cálculo | Perfil "Adherentes" o "Beneficiarios"; modalidad financiada por la cooperativa (importe 0 al socio), aporte permitido o gratuita según convenio; nunca precio por unidad de sangre (validado al publicar por RN-CAT-077, RF-SOC-067; HUECO-SAN-01). |
| Atributos de dominio | Convenio (referencia SOC), red/prestador, ámbito, vigencia, grupo familiar/conviviente, beneficiarios con fechas. Datos de salud: ninguno en CAT (`control.sensitiveData=true`). |
| Estados propios | Contrato: canónicos; cobertura del beneficiario a la fecha. |
| Hito de alta / salida | Alta: cobertura vigente por convenio. Salida: baja de adhesión o de beneficiario. |
| Documentos | Adhesión, constancia de cobertura. |
| Productos y conceptos típicos | Adhesión (puede ser 0), aporte de cobertura (si el convenio lo permite). |
| Límites | Solicitudes de cobertura, campañas, turnos de donación, costos del convenio → M18 SOC; el ERP no decide aptitud clínica ni compatibilidad; edades de donante (V2 2527) solo como filtro administrativo de campañas; no publicar en muro ni BI general (BASE §91). |
| Ola | O10. |
| Origen | BASE §39.2, §91, §93, §95; RN-09 V2 2527. |

#### 6.C.13 SAL — Ambulancias y salud (traslados, médicos, internación)

| Aspecto | Definición |
|---|---|
| Unidad central | Cobertura por grupo o servicio por evento (traslado). |
| Régimen y autoridad | Habilitación sanitaria del prestador; tipo de traslado. |
| Perfil / cálculo | Perfil "Adherentes" (cobertura) y servicio por evento (traslado con km, importe). |
| Atributos de dominio | Grupo cubierto, plan de cobertura, carencia; para eventos: referencia al traslado en SOC (origen/destino, km, médico). |
| Estados propios | Canónicos. |
| Productos y conceptos típicos | Cuota de cobertura, traslado no cubierto (por km), coseguro. |
| Límites | Registro de traslados (`AMBULANC`), médicos (`MEDICOS`), internaciones (`INTERNAC` en salud) → M18 SOC; no asumir urgencias médicas (BASE §92). |
| Ola | O10. |
| Origen | BASE §32 (servicios sociales), §39.2 (SOC-FAM), §92; DFA M4, M25. |

#### 6.C.14 VIV — Planes de vivienda

| Aspecto | Definición |
|---|---|
| Unidad central | Plan de vivienda por titular (inscripción → adjudicación → construcción → entrega). |
| Régimen y autoridad | Reglamento del plan de la cooperativa. |
| Perfil / cálculo | Perfil "Plan de vivienda"; tipo 17 (cuotas) o aportes con mínimos/máximos por categoría. |
| Atributos de dominio | Plan (categoría con mínimos: eventual, después de adjudicación, antes/después de entrega, máximo anual antes de entrega, fecha de aporte teórico — ex `CATE_SER_EXTRAS.VIV_*`, `PLANESVIV`), fechas de inscripción, adjudicación, forma de adjudicación, entrega, inicio/fin de construcción (ex `VIVIENDAS`), tipología. |
| Estados propios | Contrato canónico + etapa del plan (inscripto, adjudicado, en construcción, entregado) en SOC. |
| Hito de alta / salida | Alta: inscripción. Salida: baja de plan con comisión configurada (V2 413/414) o rescisión; transferencia con texto propio (V2 417). |
| Documentos | Texto de transferencias, bajas, cambios de planes (V2 417, 418, 419), comprobante a generar (V2 415). |
| Productos y conceptos típicos | Aporte/cuota, comisión por baja, materiales (SOC/STK). |
| Límites | Etapas, actividades, progreso, materiales y retiros → M18 SOC. |
| Ola | O10. |
| Origen | DFA M25; CAT `PLANESVIV`, `VIVIENDAS`, `PRECIOSVIV`, `VIV_*`; RN-09 VIVIENDA y V2 413–419. |

#### 6.C.15 TAS — Tasas y conceptos por cuenta de terceros

| Aspecto | Definición |
|---|---|
| Unidad central | Obligación de tercero (municipio, hospital, bomberos) cobrada en la factura del servicio o como contrato propio. |
| Régimen y autoridad | Convenio u ordenanza con fundamento; Ley 10739 limita conceptos en facturas de energía/agua en Córdoba [ESP5]. |
| Perfil / cálculo | Concepto transversal o contrato "Fijos"; base fija, porcentaje o por clase de servicio (ej. clase "4 Tasa hospital municipal"). Con DEC-083 el concepto de terceros siempre cuelga de un contrato propio del socio: un contrato existente al que se asocia o un contrato con perfil de servicio **"convenio de terceros"** de tipo accesorio (sin técnica ni medición), uno por convenio y cuenta; nunca se factura por inmueble sin contrato. La marca del convenio que habilita incluirlo en saldo elegible, recargos y corte es de M06 (`thirdPartyAgreements.moraPolicy`). |
| Atributos de dominio | Tercero beneficiario, convenio, fundamento normativo, base, rendición. |
| Productos y conceptos típicos | Tasa municipal, tasa hospital, aporte bomberos. Conceptos de terceros sin servicio propio: cuelgan de un contrato propio del socio con perfil "convenio de terceros" accesorio, según PA-CAT-18 (HUECO-TAS-01), respondida por DEC-083. La clasificación de cada tasa migrada (concepto de terceros, tributo propio o de terceros) sigue RF-FIS-163/RN-FIS-126 de M06 y RN-MIG-051 de T07. |
| Límites | Liquidación, rendición y tratamiento fiscal → FIS/COB; no se habilita un rubro por un campo editable (BASE §85). |
| Ola | O4. |
| Origen | REL ficha (clase 4 Tasa hospital municipal), DFA M4 (clase de servicio), BASE §85, §98 (convenios por cuenta de terceros), CAT `CLASESER`, `CON_TASAS` (solo como antecedente: la tabla es de Compras y va a `purchaseConcepts` de M12, HUECO-TAS-03). |

#### 6.C.16 CAP — Capital social como concepto

| Aspecto | Definición |
|---|---|
| Unidad central | Concepto facturable transversal, no servicio con contrato propio. |
| Régimen y autoridad | Ley de cooperativas, estatuto; INAES. |
| Perfil / cálculo | Concepto de tipo `capitalContribution`, generable desde ítems facturados, comprobantes, importe de capital del servicio al alta (`IMP_CAPITAL`) o pagos. |
| Atributos | Rubro capitalizable, momento de suscripción (al facturar / en la afiliación — V2 73, 2636). |
| Límites | Libro de capital, integración, reserva, rescate → M17 INS (RN-06 §9). CAT solo define el concepto y el importe de capital por servicio al alta. |
| Ola | O10 (O4 si el piloto factura capital — dependencia con INS). |
| Origen | RN-06 §9, BASE §98 (capital y aportes), CAT `RUBCAPI` (referencia). |

#### 6.C.17 OTR — Otras prestaciones

| Prestación | Definición estructural | Origen | Ola |
|---|---|---|---|
| Banco ortopédico | Elementos identificados en préstamo (comodato) con devolución, limpieza/mantenimiento; no es venta por defecto. | BASE §92 | O10 |
| Traslados (no médicos) | Se modelan como viaje de M18 según RF-SOC-147 (viaje de RF-SOC-074 con la característica "no sanitario" de RF-SOC-076, `NON_MEDICAL`), sin datos de salud; M02 define solo servicio, plan y concepto por evento (HUECO-OTR-02). Texto original: "Solicitud, origen/destino, agenda, recursos, constancia." | BASE §92, HUECO-OTR-02 | O10 |
| Seguro | Perfil "Seguro": cobertura, asegurados como adherentes, vigencia. | RN-06 §3.3 | O10 |
| Vehículo eléctrico | Perfil "Vehículo eléctrico": datos del vehículo, carga desde el portal (V2 75). El vehículo se registra en `contractRegistrations` de M18 (RF-SOC-148) con tipo `electricVehicle`, que el servicio declara en `tenantServices.registrations`. | RN-06 §3.3; RF-SOC-148 | O10 |
| Dispenser de agua | Servicio con límite diario de litros, litros por atención, días para cálculo de deuda (V2 2581–2584). | RN-09 | O10 |
| Correo electrónico | Producto TIC: casilla, dominio; credenciales en bóveda (ex `CORREOSINT`; `integrationSecrets` de T06, DEC-074). Alcance según PA-CAT-19 (HUECO-OTR-03): servicio de M02 con aprovisionamiento por T06 y control de cupo, habilitable por tenant (DEC-084, PRM-CAT-113). | CAT §12; DEC-084 | O10 |
| Pack SMS | Producto TEL de importe fijo (tipo 16, V2 2253). Alcance según PA-CAT-19 (HUECO-OTR-03): servicio de M02 con aprovisionamiento por T06 y control de cupo y consumo, habilitable por tenant (DEC-084, PRM-CAT-113). | RN-01 §2; DEC-084 | O10 |
| Dispositivos registrables | Servicios con perfil "dispositivos" o "dispositivos y adherentes" registran cada equipo en `contractRegistrations` de M18 (RF-SOC-148, tipo `device`); el tipo combinado se compone con `serviceDependents`. | RF-SOC-148 | O10 |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Convenciones comunes a todas las colecciones (no se repiten): `_id` uniqueidentifier; `TenantId` uniqueidentifier obligatorio (en catálogo de plataforma = tenant `PLATFORM`); `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista); `deletedAt` solo en configuración no publicada (los contratos y documentos económicos nunca se borran). Todo índice compuesto empieza por `TenantId`. Etiquetas por `labelKey` (`dict:`). Importes en `DECIMAL(18,4)`.

Nombres canónicos de T05 §7.2 (CTR-DAT-30): `serviceId` → `tenantServices` (antes `tenantServiceId` en todo este anexo, incluidos payloads de eventos y API); `holderId` → `holders` (antes `holderPersonId`, CTR-DAT-67); `servicePointId` → `servicePoints` y `premiseId` → `premises` de M01 (antes `serviceAddress.propertyId`, CTR-DAT-66); `inventoryItemId` y `serialUnitId` → M13 (antes `stockItemId` y `stockUnitId`); `credentialRef` → `integrationSecrets` de T06 (DEC-074). `propertyId` se conserva solo cuando apunta a `serviceProperties` (propiedades del servicio, 7.13), nunca al inmueble. Los datos de migración van en el subdocumento `legacy` de T05 §19.1 (CTR-DAT-32), no en `migration`.

### 7.1 `serviceCapabilities` (plataforma)

Propósito: catálogo global de capacidades de servicio. Origen ProCoop: no existe (implícito en `SERVICIO`, `TIP_SERVI`, `TipoRegistracion`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, SUBF, CEM, SAN, SAL, VIV, SEG, VEL, DSP, MAIL, SMS, ORT, TRA, TAS, CAP (único). |
| `domain` | enum | Sí | `tic`, `energy`, `water`, `sanitation`, `gas`, `publicLighting`, `works`, `social`, `funeral`, `cemetery`, `bloodBank`, `health`, `housing`, `insurance`, `thirdPartyFees`, `capital`, `other`. |
| `labelKey`, `descriptionKey` | string | Sí | Claves dict. |
| `status` | enum | Sí | `draft`, `available`, `deprecated`. |
| `maturity` | enum | Sí | `confirmed` (solicitante), `candidate` (investigado), `procoopParity` (DEC-007). |
| `registrationProfiles[]` | enum[] | Sí | `energy`, `otherMetered`, `phone`, `fixed`, `fixedWithDevices`, `adherents`, `adherentsByTariff`, `devicesAndAdherents`, `internet`, `quantity`, `housingPlan`, `insurance`, `worksInstallments`, `electricVehicle`, `burialRight`, `beneficiaries`. |
| `calculationTypes[]` | int[] | Sí | Tipos de cálculo admitidos (1–17 ProCoop + nuevos TAR). |
| `unitKinds[]` | enum[] | Sí | `connection`, `supply`, `meteringPoint`, `coverage`, `burialUnit`, `act`, `line`, `group`, `housingPlan`, `worksInstallment`, `device`, `concept`. |
| `domainAttributeSchema` | object (JSON Schema) | Sí | Atributos de dominio tipados (fichas 6.C). |
| `domainSheet` | object | Sí | Ficha: régimen, autoridades sugeridas, hitos de alta/salida, documentos, productos típicos, límites. |
| `requiredPlatformModules[]` | string[] | Sí | Capabilities de licencia T01 requeridas (ej. `mod.tec.aprovisionamiento`). |
| `sensitiveData` | bool | Sí | Datos sensibles (SAN, SAL). |
| `insumosPendientes[]` | string[] | No | Checklist BASE §95. |

Índices: `{tenantId, code}` único.

### 7.2 `tenantServices`

Propósito: servicio habilitado/ofertado por el tenant y su perfil. Origen: `SERVICIO`, `SERVICIO_EXTRAS`, `TIP_SERVI`.

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `capabilityId` | uniqueidentifier | Sí | → `serviceCapabilities`. |
| `code` | string | Sí | Código del tenant (ej. "INT"); ex `COD_SER`. |
| `labelKey` | string | Sí | ex `DES_SER`. |
| `serviceTypeCode` | string | No | Agrupador de reporte; ex `TIP_SERVI`. |
| `isPrincipal` | bool | No | V2 573. |
| `enablement` | object | Sí | `{status: enabled\|disabled, validFrom, validTo, enabledBy, licenseCheckAt}`. |
| `offerStatus` | enum | Sí | `notPublished`, `open`, `closed`. |
| `operationStatus` | enum | Sí | `operating`, `windingDown`, `closed`. |
| `currentConfigVersionId` | uniqueidentifier | No | Versión publicada vigente. |
| `profile` | object | Sí | 13 dimensiones (6.B). Incluye `profile.billing.publicServiceSettlement` (bool, obligatorio, default `false`; ex `SERVICIO.LIQ_AFIP`): el servicio liquida como servicio público ante ARCA (LQSP) y sus conceptos tarifarios van al comprobante de clase LQSP, nunca mezclados con los de factura común (DEC-093; RF-CAT-117; RN-FAC-040 de M05; RF-FIS-072 y RF-FIS-076 de M06). |
| `registrationProfile` | enum | Sí | ex `TIP_REG`/`TipoRegistracion`. |
| `calculationType` | int | Sí | ex `TIP_CAL`. |
| `calculationTypeLargeCustomers` | int | No | ex `TipoCalculo_GrandesClientes`. |
| `flags` | object | Sí | `requiresWorkOrder` (ex `TECNICA`), `autoWorkOrderOnSave` (ex `GENERAR_OT`, V2 332), `askAdminTerminationOnDisconnectionWO` (ex `CONSULTA_BAJA`), `meterInStock` (ex `REG_STO`), `autoSupplyCode` (ex `MATRICULA_AUTO`), `requiresFeasibility` (ex `FACTI_ALTA`), `initialReadingOnConnect` (ex `CONSUMO_ALTA`), `billWithoutConsumption` (ex `FAC_SIN_CONSUMO`), `autoCategoryByAge` (ex `CAT_AUTO`), `monthly` (ex `MENSUAL`). |
| `requirements` | object | Sí | Cada uno `noRequire\|warn\|require`: `cadastre` (ex `REG_CATASTRO`, V2 319), `property` (ex `REG_INMUEBLE`, V2 2462), `activity` (ex `REG_ACT`), `serviceClass` (ex `REG_CLS`), `route` (ex `REG_ZSR`, V2 213), `device` (ex `REG_DSP`), `guarantor` (ex `REG_GARANTE`), `reference` (V2 343), `installerCertificate` (V2 2343), `installerAndDateWhenCertificate` (V2 2529), `accountingGroup` (V2 2738). |
| `relatedService` | object | No | `{serviceId, useConsumption: bool, onlyUnbilled: bool}` ex `REL_SER`, `USA_COT`, V2 2701/3143. |
| `consumptionSplitMode` | enum | No | `none`, `generalPeriod`, `periodAndSequence` (ex `DIVISION_CONSUMO` 1/2). |
| `members` | object | No | Tras HUECO-TRV-01 M02 conserva solo `allowsAdherents` y `allowsBeneficiaries` ("admite miembros"); el resto de las marcas: Reemplazado por PRM-SOC-001 a PRM-SOC-013 y los planes de cobertura de M18 (RF-SOC-001). Texto original: `{allowsAdherents (ADHER), allowsBeneficiaries (BENEF), adherentPricing (PRE_C_AD, ADH_PRE), excludeUnderOneYear (MENORES), excludeOlder (MAYORES), excludeDisability (DISCAPA), excludeRetired (JUBILAD), waitingPeriodDays (CARENCIA), requireHolderAdherent (V2 109), cascade: cascade\|ask\|none (V2 2401), allowDuplicateInService (V2 2400), askRemoveDuplicate (V2 2521), controlMemberDebt (V2 2545)}`. |
| `registrations` | object | No | `{allowsBeneficiaries (`serviceBeneficiaries` de M18, DEC-086), registrationTypes[]: electricVehicle\|device\|other}`: qué tipos de registración del contrato acepta el servicio en `contractRegistrations` de M18 (RF-SOC-148). Vacío = ninguno. M18 rechaza una registración de un tipo no declarado aquí. |
| `legalEntityId` | uniqueidentifier | Sí | Entidad jurídica del tenant que presta y factura el servicio (`legalEntities` de T04; DEC-064). Un tenant con una sola entidad la toma por defecto. |
| `defaultOperationalStatus` | object | Sí | `{onActivation, onTermination, onReconnection, onMeterChange, onTransfer, onDisconnected}` → `serviceStatuses` (ex `COD_EST_ALTA`, `COD_EST_BAJA`, `COD_EST_RECONEXION`, `COD_EST_CAMBIOMEDIDOR`, `COD_EST_TRANSFERENCIA`, `COD_CON_DESCONECTADO`); `autoSelectPrincipal` (V2 2435). |
| `workOrderTypes` | object | No | `{activation (COD_TRAN_ALTA), categoryChange (V2 2330), transfer (COD_TRAN_TRANSFERENCIA), statusChange[] (V2 3194)}` → tipos de OT de TEC. |
| `transfer` | object | No | `{conditionAfter (CONDICION_TRANSFERENCIA), markOriginalSuperseded (V2 2541), memberMode (V2 2291), allowTerminated (V2 2599), chargeConcepts (V2 2782), markPrincipal (V2 3195)}`. |
| `defaultBillingGroupId` | uniqueidentifier | Sí | ex `GF_DEFECTO`. Referencia: `billingGroups` (M05). |
| `phoneMobileType` | enum | No | ex `TIP_CELULAR`. |
| `uniqueness` | object | Sí | `{supplyCodeUnique (¬V2 2250), allowSameMeteredInAccount (V2 2269), allowSameUnmeteredInAccount (V2 2715), oneSocialPerHolder (V2 2740), validateSameAddress (V2 2710)}`. |
| `addressDebtCheck` | object | Sí | `{enabled (V2 2482), mode: warn\|requireApproval (V2 2668), overdueOnly (V2 2669)}`. |
| `holderRules` | object | Sí | `{blockInactiveHolders (V2 734), blockTerminatedHolders (V2 741), allowReconnectionDeceased (V2 2301)}`. |
| `lifecycle` | object | Sí | `{allowedOperations{voluntarySuspension{enabled,maxDays}, reactivation, planChange, ownerChange, transfer, relocation, partialTermination, cession}, categoryChangeMode: immediate\|scheduled\|onWorkOrderClose (V2 2455), prorateCategoryChangeAfterDay (V2 2755), reconnectionKeepsStartSameMonth (¬V2 2707), allowTerminationWithInstallments (V2 2316), consumptionAfterTermination: deny\|warn\|allow (V2 2550), billingStatesCanonical[] }`. |
| `documents` | object | No | Plantillas (T11): `activationContract`, `serviceGuarantee` (V2 206), `terminationReport`, `disconnectionForm` (V2 2522), `applianceDeclaration` (V2 2742), `equipmentDelivery`, `equipmentReturn`; `askPrint{activation (V2 2532), termination (V2 2535)}`. |
| `channels` | object | Sí | `{landing, pwa, counter, phone, bot, publicTerminationButton}` por operación. |
| `mappings` | object | No | `{areaId, costCenterId, accountingAccounts{}, warehouseId, branchIds[]}`. |
| `integrations[]` | object[] | No | `{kind (provisioning, telemetering, batcom, discar, sitsa, aion), connectorId, events[]}`. |
| `copiedFrom` | object | No | `{tenantId, serviceId, configVersionId, copyRunId}`. |

Índices: `{tenantId, code}` único; `{tenantId, capabilityId}`; `{tenantId, offerStatus}`.

### 7.3 `serviceConfigVersions`

Propósito: paquete versionado y publicable (AGR-009). Origen: `HIS_SERVICIO`, `HIS_SERVICIO_EXTRAS` (por cuadro).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | |
| `number` | int | Sí | Correlativo por servicio. |
| `status` | enum | Sí | `draft`, `inReview`, `approved`, `scheduled`, `published`, `superseded`, `rejected`, `discarded`. |
| `changeKinds[]` | enum[] | Sí | `commercial`, `fiscal`, `technical`, `presentation`. |
| `snapshot` | object | Sí | Copia inmutable de perfil + ids/versiones de productos, conceptos, planes, categorías, estados, reglas. |
| `diffFromPrevious` | object | No | Diferencias calculadas. |
| `validations[]` | object[] | Sí | `{code, severity: blocking\|warning, message, ref}`. |
| `simulationRunIds[]` | uniqueidentifier[] | No | Simulaciones TAR. |
| `effectiveFrom` | Date | Sí | Fecha efectiva. |
| `recordedAt` | Date | Sí | Fecha de registro (AGR-010). |
| `submittedBy`, `approvedBy`, `approvedAt`, `publishedAt` | | No | |
| `workflowInstanceId` | uniqueidentifier | No | T11. |

Índices: `{tenantId, serviceId, number}` único; `{tenantId, serviceId, status, effectiveFrom}`.

### 7.4 `serviceConcessions`

Origen: `CONCESIO`. Campos: `code`, `name` (ex `NOM_CESI`), `grantor`, `authorityIds[]`, `jurisdiction`, `instrumentRef`, `validFrom`, `validTo`, `serviceIds[]`, `documents[]`. Índice `{tenantId, code}` único.

Campos de `serviceConcessions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | Ex `NOM_CESI` | — |
| `grantor` | [VERIFICAR] | [VERIFICAR] | — | — |
| `authorityIds[]` | uniqueidentifier[] | [VERIFICAR] | — | Autoridad concedente registrada en M01, asumida en PA-CAT-21 (DEC-072); antes [VERIFICAR] (T05 no declara colección; posible `enumerationItems` de T04) |
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `instrumentRef` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `serviceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `tenantServices` (M02) |
| `documents[]` | array [VERIFICAR] | [VERIFICAR] | — | — |

### 7.5 `serviceProducts`

Propósito: productos y subservicios dentro de un servicio. Origen: `PROD_SER` (parte comercial), `TEL_SERVICIO`, `SERTEL`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | |
| `code`, `labelKey` | string | Sí | |
| `kind` | enum | Sí | `main`, `addon` (subservicio), `equipment`, `oneTimeService`, `ticAccount` (correo), `phoneService`. |
| `tvMinimumLineup` | bool | No | Paquete de grilla mínima del servicio TV (RN-CAT-079; referenciado por PRM-MOR-200 de M08). |
| `attributes` | object | No | Según esquema de dominio (tecnología, velocidad…). |
| `requiresProductIds[]`, `excludesProductIds[]` | uniqueidentifier[] | No | Compatibilidad. Referencia: → `serviceProducts` (M02, autorreferencia). |
| `inventoryItemId` | uniqueidentifier | No | Ítem STK cuando `kind=equipment` (antes `stockItemId`, CTR-DAT-30). |
| `status` | enum | Sí | `active`, `discontinued`. |
| `validFrom`, `validTo` | Date | Sí/No | |

Índices: `{tenantId, serviceId, code}` único.

### 7.6 `billableConcepts`

Propósito: estructura de conceptos facturables (el precio vive en TAR). Origen: `PROD_SER` (COD_PRO, COD_RUB, DES_PRO, DES_FOR, UNI_MED, IVA_*), `SERTEL`, `IMPUESTOS_X_CAT` (referencia), `RUBCAPI`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | No | Nulo = transversal (capital, tasas, franqueo). |
| `code`, `labelKey`, `invoiceLabelKey` | string | Sí | ex `DES_PRO`, `DES_FOR`. |
| `kind` | enum | Sí | `oneTime`, `recurring`, `perQuantity`, `perEvent`, `installment`, `adjustment`, `thirdPartyFee`, `capitalContribution`, `usage`, `penalty`, `waiver`. |
| `trigger` | enum | Sí | `approval`, `installationConfirmed`, `activation`, `periodStart`, `event`, `milestone`, `manual`. |
| `eventTypes[]` | enum[] | No | Para `perEvent`: `serviceActivation`, `accountCreation`, `holderCreation`, `reconnection`, `afterWorkOrder`, `beforeWorkOrder`, `transfer`, `suspension`, `relocation`. |
| `unitOfMeasure` | string | Sí | ex `UNI_MED`. |
| `fiscalClassId` | uniqueidentifier | Sí | FIS. Referencia: `fiscalClasses` (M06, PA-FIS-21); antes «clase fiscal de M06» (PA-CAT-21) y [VERIFICAR]. |
| `accountingRubricId` | uniqueidentifier | No | ex `COD_RUB`. Referencia: `accountRubrics` (M15). |
| `costCenterId` | uniqueidentifier | No | |
| `thirdPartyId` | uniqueidentifier | No | Para tasas. Referencia: tercero beneficiario registrado en M01, asumido en PA-CAT-21 (DEC-072); antes [VERIFICAR] (posible `thirdPartyAgreements`, M06). |
| `isInternalCost` | bool | Sí | true = costo interno, no facturable (BASE §72). |
| `rounding` | object | No | Precisión y regla (AGR-011). |
| `status`, `validFrom`, `validTo` | | Sí | |

Índices: `{tenantId, code}` único; `{tenantId, serviceId, kind}`.

### 7.7 `servicePlans` y 7.8 `servicePlanVersions`

`servicePlans`: `serviceId`, `serviceProductId` (antes `productId`; nombre de T05), `code` (ej. INT-100), `labelKey`, `status` (`draft`, `published`, `discontinued`, `retired`), `currentVersionId`, `offerChannels[]`, `publicVisibility`.

Campos de `servicePlans` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `serviceProductId` | uniqueidentifier | Sí | Antes `productId`; nombre de T05 | `serviceProducts` (M02) |
| `code` | string | Sí | Ej. INT-100 | — |
| `labelKey` | string | [VERIFICAR] | — | — |
| `status` | enum | Sí | `draft`, `published`, `discontinued`, `retired` | — |
| `currentVersionId` | uniqueidentifier | [VERIFICAR] | — | `servicePlanVersions` (M02) |
| `offerChannels[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `publicVisibility` | [VERIFICAR] | [VERIFICAR] | — | — |

**`servicePlanVersions`**:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `planId` | uniqueidentifier | Sí | |
| `number` | int | Sí | |
| `attributes` | object | Sí | Esquema de dominio (velocidad, tecnología, unidad, modalidad medida/no medida). |
| `periodicity` | enum | Sí | `monthly`, `bimonthly`, `quarterly`, `yearly`, `perEvent`, `oneTime`. |
| `allowedCategoryIds[]` | uniqueidentifier[] | Sí | |
| `components[]` | object[] | Sí | `{conceptId, mandatory, quantity, triggerOverride}`. |
| `promotions[]` | object[] | No | `{code, conceptIds[], durationUnit: calendarMonths\|billedCycles\|days, duration, partialFirstPeriodConsumes: bool, offerValidFrom, offerValidTo, compatibleWith[], priority}`. |
| `financingOptions[]` | object[] | No | `{conceptId, installments, downPaymentRule, method, mutuallyExclusiveWithCash: true}` (cronograma: MOR). |
| `equipment[]` | object[] | No | `{inventoryItemId, mode: loan\|sale\|rent\|customerOwned, mandatory, returnRequired}` (antes `productId`, CTR-DAT-30; default de modalidad según DEC-013). |
| `requirements` | object | Sí | `{feasibility, installation, technicalEvaluation, documents[]}`. |
| `tariffBinding` | object | Sí | `{tariffScheduleRef, categoryMap}` → TAR. |
| `effectiveFrom`, `effectiveTo`, `recordedAt` | Date | Sí | |
| `configVersionId` | uniqueidentifier | Sí | |

Índices: `{tenantId, planId, number}` único; `{tenantId, planId, effectiveFrom}`.

### 7.9 `serviceBundles`

`code`, `labelKey`, `planVersionIds[]` (de servicios distintos), `rules` (`{terminationOfOne: keepOthers|terminateAll|loseBundleBenefit}`), `status`, `validFrom`, `validTo`.

Campos de `serviceBundles` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | — | — |
| `planVersionIds[]` | uniqueidentifier[] | [VERIFICAR] | De servicios distintos | `servicePlanVersions` (M02) |
| `rules` | [VERIFICAR] | [VERIFICAR] | `{terminationOfOne: keepOthers/terminateAll/loseBundleBenefit}` | — |
| `status` | enum | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.10 `serviceCategories`

Propósito: categorías estructurales. Origen: `CATE_SER` (COD_SER, COD_CAT, DES_CAT; IVA y mínimos → TAR/FIS), `CATE_SER_EXTRAS`, `HIS_CATE_SER`, `HIS_CATE_SER_EXTRAS`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | |
| `code`, `labelKey` | string | Sí | ex `COD_CAT`, `DES_CAT`. |
| `groupId` | uniqueidentifier | No | → `serviceCategoryGroups`. |
| `isSocial` | bool | Sí | Reemplaza inferencia (RN-CAT-016). |
| `isPrepaid` | bool | Sí | Destino válido del paso a prepago. |
| `isResidential` | bool | No | |
| `isGenerator` | bool | No | ex `GENERADOR`. |
| `subsidizedCategoryId`, `sefCategoryId` | uniqueidentifier | No | ex `COD_CATSER_SS`, `COD_CATSER_SEF`. |
| `regulatoryCodes` | object | No | `{tariffCode (CODIGO_TARIFA), arbaPresentationType (TIPO_PRESENTACION_ARBA), seId (ID_SE), enargas}`. |
| `networkProfileCode` | string | No | ex `PERFIL_MIKROTIK` (INT). |
| `adherentCount` | int | No | ex `CAN_ADH` (tipos 9/10). |
| `allowsProportionalChange` | bool | No | ex `PROP_CAMBIO_CAT`. |
| `housingMinimums` | object | No | ex `VIV_MIN_*`, `VIV_MAX_ANUAL_ANTES_ENTREGA`, `VIV_FECHA_APORTE_TEORICO`. |
| `consumeMinimumOnTermination` | bool | No | V2 2465 (marca consumida por TAR). |
| `status`, `validFrom`, `validTo` | | Sí | |

Índices: `{tenantId, serviceId, code}` único.

### 7.11 `serviceCategoryGroups`

Origen `GRP_CAT`: `code`, `labelKey` (ex `DES_GRU`), `regulatoryCode` (ex `COD_ENGAS`), `serviceId`.

Campos de `serviceCategoryGroups` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | Ex `DES_GRU` | — |
| `regulatoryCode` | string | [VERIFICAR] | Ex `COD_ENGAS` | — |
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |

### 7.12 `serviceClasses`

Origen `CLASESER`: `serviceId`, `code`, `labelKey` (ex `DES_CLS`), `value1`, `value2` (DECIMAL(18,4); ex `VALOR1`, `VALOR2`), `notes` (ex `OBS_CLS`), `thirdPartyConceptId` (si la clase representa una tasa).

Campos de `serviceClasses` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | Ex `DES_CLS` | — |
| `value1` | [VERIFICAR] | [VERIFICAR] | — | — |
| `value2` | [VERIFICAR] | [VERIFICAR] | DECIMAL(18,4); ex `VALOR1`, `VALOR2` | — |
| `notes` | [VERIFICAR] | [VERIFICAR] | Ex `OBS_CLS` | — |
| `thirdPartyConceptId` | uniqueidentifier | [VERIFICAR] | Si la clase representa una tasa | [VERIFICAR] destino no declarado |

### 7.13 `serviceProperties`

Origen `PROPIESER` y propiedades personalizadas (`abm_propieItems`): `serviceId`, `code`, `labelKey` (ex `DES_PROP`/`NOM_PROP`), `valueType` (`text`, `number`, `list`, `bool`, `date`), `listValues[]`, `tension` (ex `TENSION_OCEBA`), `linkedConcepts` (`{minimumConceptId (IMP_MINM/IMP_CMINM), fixedChargeConceptId (COD_CF/IMP_CF/CAN_CF), cmConceptId (COD_CM)}` — importes en TAR).

Campos de `serviceProperties` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | Ex `DES_PROP`/`NOM_PROP` | — |
| `valueType` | enum | [VERIFICAR] | `text`, `number`, `list`, `bool`, `date` | — |
| `listValues[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `tension` | [VERIFICAR] | [VERIFICAR] | Ex `TENSION_OCEBA` | — |
| `linkedConcepts` | [VERIFICAR] | [VERIFICAR] | (`{minimumConceptId (IMP_MINM/IMP_CMINM), fixedChargeConceptId (COD_CF/IMP_CF/CAN_CF), cmConceptId (COD_CM)}` — importes en TAR) | — |

### 7.14 `serviceStatuses`

Origen `ESTASER` (COD_EST, COD_SER, DES_EST, DESCONEC, PRINCIPAL).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | |
| `code`, `labelKey` | string | Sí | ej. CONECTADO, CORTADO, BAJA. |
| `canonicalStatus` | enum | Sí | Estado canónico (sección 8). |
| `impliesDisconnection` | bool | Sí | ex `DESCONEC`. |
| `isPrincipal` | bool | Sí | ex `PRINCIPAL` (uno por canónico). |
| `visibleToMember` | bool | Sí | Si se muestra al socio o se muestra el canónico. |
| `color`, `order` | | No | |

Índices: `{tenantId, serviceId, code}` único.

### 7.15 `eventChargeRules` y 7.16 `eventChargeWaivers`

`eventChargeRules` (origen `CONEXION`, `abm_Conexion`): `serviceId`, `eventType` (1 alta de servicio, 2 alta de cuenta, 3 alta de titular, 4 reconexión, 5 después de la OT, 6 antes de la OT, 7 transferencia), `conceptId` (ex `COD_PRO`/`COD_CON`), `quantity`, `oncePerContractEvent` (ex `UNA_VEZ`), `filters` (`{memberActive, delinquent, prepaid, referenceIds[], localityIds[], categoryIds[], classIds[], meterRemoved, provisional, propertyIds[], statusIds[], workOrderTypeIds[] (COD_TRAN)}`), `allowAmountOverride`, `amountCap`, `requiresMorPolicy` (bool), `status` (ex `DESACTIVAR`), `validFrom`, `validTo`.

`eventChargeWaivers` (origen `CONE_BONIF`): `accountId` (ex `COD_SUM`), `serviceId`, `eventType` (ex `COD_TRAN`), `conceptId`, `categoryId`, `waivedQuantity` (ex `CANT_BONIFICADAS`), `usedQuantity`, `reason`, `approvedBy`.

### 7.17 `autoServiceRules`

Origen `ALTASEAU` (ID_AS, DES_AS, TIPO_AS, COD_SER, COD_CAT, COD_LOC, ZONA, TIT_SOC, COD_SAS, COD_CAS, COD_REF, COD_CLS, COD_ACT…).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `labelKey` | string | Sí | ex `DES_AS`. |
| `triggerEvent` | enum | Sí | `serviceActivated`, `accountCreated`, `serviceTerminated`, `serviceReconnected`, `categoryChanged`, `workOrderCreated`, `addressChanged` (ex `OperacionServicioAutomatico` 1–7). |
| `sourceServiceId` | uniqueidentifier | Sí | ex `COD_SER`. |
| `targetServiceId`, `targetCategoryId` | uniqueidentifier | Sí | ex `COD_SAS`, `COD_CAS`. |
| `filters` | object | No | `{categoryIds, propertyIds, classIds, activityIds, localityIds, referenceIds, zones, meterTypeIds, holderCondition: all\|activeOnly\|inactiveOnly}`. |
| `billingGroupMode` | enum | Sí | `targetDefault`, `inheritFromSource` (ex `TOMAR_GRUPO`). |
| `mode` | enum | Sí | `propose`, `create` (PA-CAT-04). |
| `legalBasis` | string | Cond. | Obligatorio si `mode=create` y el servicio destino es opcional para el socio. |
| `status`, `validFrom`, `validTo` | | Sí | |
| `code` | string | Sí | Código de la regla (único en T05, COL-CAT; la ficha no lo declaraba). |

### 7.18 `serviceContracts`

Propósito: contrato de servicio (suscripción). Origen: `SERSOC` (+106 columnas), `SERSOC_EXTRAS`, `INTERNET` (no secretos), `TEL_SERSOC`, `VIVIENDAS` (referencia).

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `number` | string | Sí | Número de contrato visible; único por tenant (ex `ID_SERSOC` / "Contrato"). |
| `serviceId` | uniqueidentifier | Sí | ex `COD_SER`. |
| `holderId` | uniqueidentifier | Sí | Titular → `holders` de M01 (ex `COD_SOC`). Antes `holderPersonId` (CTR-DAT-67); si hace falta la persona se agrega `personId`. |
| `holderIdentifierSnapshot` | object | Sí (al activar) | Foto de identificación del titular que M01 exige del contrato (contrato de interfaz de M01; servicio `per.getHolderSnapshot`): `{documentTypeId, number, verificationStatus, identificationStatus}`, tomada al activar el contrato y refrescada al consumir `per.person.identificationRegularized` (EVT-PER-27, §12.2; DEC-099, 10-11-2026). `identificationStatus` (enum de M01 `identified`, `approvedException`, `documentPending`) agregado el 10-11-2026 por DEC-099: con `documentPending` (persona migrada sin ningún documento), `documentTypeId` y `number` van vacíos. M02 copia la foto de M01 sin validarla ni reinterpretarla; la restricción fiscal de una persona `documentPending` la aplica M05 con su propia foto a la fecha de prevalidación (RN-FAC-162 de M05; RF-PER-175 de M01). |
| `legalEntityId` | uniqueidentifier | No | Excepción a la entidad jurídica del servicio (`legalEntities` de T04; DEC-064); vacío = `tenantServices.legalEntityId`. M05 la usa para elegir punto de venta y numeración. |
| `accountId` | uniqueidentifier | Sí | Cuenta (ex `COD_SUM`). |
| `payerAccountId` | uniqueidentifier | No | Si difiere (AGR-007). |
| `planId`, `planVersionId` | uniqueidentifier | Cond. | Obligatorio si el servicio tiene planes. |
| `categoryId` | uniqueidentifier | Sí | ex `COD_CAT`. |
| `categoryHistory[]` | object[] | Sí | `{categoryId, validFrom, validTo, reason, origin, previousCategoryId (CAT_ANT)}`. |
| `serviceClassId` | uniqueidentifier | No | ex clase. |
| `propertyValues[]` | object[] | No | `{propertyId, value, validFrom}`. |
| `activityId` | uniqueidentifier | No | Actividad ARCA. Referencia: `normativeTables` de M06 con `code = arcaActivities` (catálogo de actividades ARCA; PA-CAT-22); antes «actividades económicas de T04» (PA-CAT-21) y [VERIFICAR]. |
| `quantity` | DECIMAL(18,4) | Cond. | ex `CANTIDAD`. |
| `serviceAddress` | object | Sí | `{streetId, number, floor, unit, neighborhood, localityId, postalCode, referenceId, cadastre{cod,sec,man,par,ph,lote} (CAT_CIR/CAT_LOT/CAT_MAN/CAT_PAR/CAT_PH/CAT_LT), propertyId, geo{lat,lng}, gisRef, validFrom}`. `serviceAddress.propertyId` queda reemplazado por `servicePointId` (campo propio de primer nivel) y `premiseId` (CTR-DAT-66); el resto del domicilio es una proyección de M01. |
| `servicePointId` | uniqueidentifier | Sí | Punto de servicio de M01 (ubicación técnica); uno por contrato medido (DEC-028; CTR-DAT-66). |
| `premiseId` | uniqueidentifier | No | Inmueble de M01; proyección desde el punto de servicio. |
| `addressHistory[]` | object[] | Sí | Domicilios anteriores con vigencia. |
| `route` | object | No | `{zone, sector, route}` (ZSR). |
| `supplyCode` | string | No | Matrícula. |
| `meteringPointId` | uniqueidentifier | No | → MED. |
| `externalClientId` | uniqueidentifier (antes string) | No | "Id Cliente". Referencia: `persons` (M01), asumida en PA-CAT-22 (DEC-072); antes [VERIFICAR] cliente externo (T05 no declara la colección). |
| `feasibilityRef` | uniqueidentifier | No | ex `COD_SOL` (`FACTIBIL`, TEC). Referencia: → `feasibilityRequests` (M10, COL-TEC-01), confirmada en PA-CAT-23 (DEC-072; antes [VERIFICAR]). |
| `declaredAffidavitRef` | uniqueidentifier | No | DD JJ. Referencia: → `documents` (T11), confirmada en PA-CAT-23 (DEC-072; antes [VERIFICAR]). |
| `guarantorPersonId` | uniqueidentifier | No | Garante. |
| `installer` | object | No | `{professionalId (PROFESIO), certificateNumber, certificateExpiresAt}`. |
| `dueDate` | Date | No | "Fecha Vto". |
| `billingGroupId` | uniqueidentifier | Sí | ex `GRUPO_FACTURA`. |
| `lastBilledPeriod` | string | No | ex `ULT_FAC` (proyección de FAC). |
| `lifecycleStatus` | enum | Sí | Canónico (sección 8). |
| `operationalStatusId` | uniqueidentifier | Sí | → `serviceStatuses`. |
| `statusChangedAt`, `statusChangedBy`, `statusReason` | | Sí | "fecha del último estado". |
| `suspension` | object | No | `{reason: voluntary\|debt\|technical\|regulatory\|administrative, mode: restricted\|interrupted, requestedAt, effectiveAt, expectedEndAt, orderedBy (module), commandId}`. |
| `dates` | object | Sí | `{requestedAt, adminStart (ALTA_ADM), effectiveStart (FEC_ALTA), terminationRequestedAt (BAJA_ADM), effectiveEnd (FEC_BAJA), cancelledAt}` — `null` cuando no corresponde. |
| `flags` | object | Sí | `{doNotBill{active, reason, until, approvedBy}, provisional{active, until}, billWhileProvisional, noRecategorization (NO_APLICA_RECATEGORIZACION), readingWithMultiplier, sendEInvoice (V2 2642), noLateFee (V2 3135, referencia COB)}`. |
| `origin` | object | Sí | `{channel: counter\|pwa\|landing\|bot\|phone\|autoRule\|transfer\|migration, crmCaseId, autoRuleId, transferFromContractId, createdFromPortal (Alta desde CoopOnline)}`. |
| `agreedConditions[]` | object[] | Sí | Tramos `{planVersionId, components[], promotions[]{code, startsAt, endsAt, unitsConsumed}, financingChoice, acceptedAt, acceptanceChannel, evidenceDocId, validFrom, validTo}`. |
| `domainAttributes` | object | No | Según `domainAttributeSchema` (INT: `accessIdRef`, `nodeRef`, `oltPortRef`, `macRef`, `ipRef`; TEL: `lines[]{numberRef, tariffRef, from, to}`; ELE: `voltage`, `contractedPowerKw`, `supplyType`, `electroDependent{validFrom, validTo, evidenceDocId}`, `nis`; AG: `meteringRegime[]{value: metered\|unmetered, validFrom, validTo, commandId}` (HUE-AG-03); ALU: `agreement{municipalityRef, claimHandler: municipality\|cooperative}` (HUE-ALU-03); OBR (contrato creado por JOB-CAT-13): `workRef`, `levyRef` (HUECO-OBR-01); GAS: `gasType`, `subdistribution`, `technicalFileRef`; OBR: `installments{total, paid, units, unitsBilled, unitsTotal, unitsOriginal, pctBasic, pctNetworks, planRef}`; VIV: `housingFileRef`; CEM: `rightRef`; SAN/SAL: `agreementRef`). |
| `capitalAmountAtActivation` | DECIMAL(18,4) | No | ex `IMP_CAPITAL` (concepto CAP). |
| `parentContractId` | uniqueidentifier | No | Contrato principal (ALU sobre ELE). |
| `bundleSubscriptionId` | uniqueidentifier | No | Paquete. Referencia: `bundleSubscriptions` (M02, §7.29; PA-CAT-22); antes [VERIFICAR] suscripción a combo (`serviceBundles`, M02, no tiene colección de suscripciones). |
| `observations` | string | No | ex `OBSERVA` (visible según V2 2557). |
| `supersededByContractId` | uniqueidentifier | No | Transferencia. |
| `legacy` | object | No | Subdocumento de T05 §19.1: `{system: 'procoop', table: 'SERSOC', key: ID_SERSOC, runId, hash, readOnly}` (CTR-DAT-32). Antes `migration` `{sourceSystem: 'procoop', sourceId (ID_SERSOC), importedAt}`. |

Índices: `{tenantId, number}` único; `{tenantId, accountId, serviceId, lifecycleStatus}`; `{tenantId, holderPersonId}` (pasa a `{tenantId, holderId}`, CTR-DAT-67); `{tenantId, servicePointId, serviceId}` (reemplaza al de `serviceAddress.propertyId`, CTR-DAT-66); `{tenantId, legalEntityId, serviceId}` (DEC-064); `{tenantId, 'legacy.table', 'legacy.key'}` disperso; `{tenantId, serviceId, supplyCode}` (único parcial cuando `uniqueness.supplyCodeUnique` y estado ≠ `terminated|superseded|cancelled`); `{tenantId, lifecycleStatus, serviceId}`; `{tenantId, "serviceAddress.propertyId"}` (reemplazado por `{tenantId, servicePointId, serviceId}`); `{tenantId, billingGroupId}`.

### 7.19 `serviceContractHistory`

Origen `SERSOC_HST` (+109 columnas, foto completa por cambio). En CoopApps: evento por transición o cambio de atributo.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | |
| `eventType` | enum | Sí | `created`, `statusChanged`, `planChanged`, `categoryChanged`, `classChanged`, `activityChanged`, `referenceChanged`, `addressChanged`, `holderTransferred`, `flagChanged`, `memberChanged` (Reemplazado: la historia de miembros la lleva M18, HUECO-TRV-01), `meteringRegimeChanged` (HUE-AG-03), `equipmentChanged`, `attributeChanged`, `note` (ej. "Recategorización"). |
| `from`, `to` | object | Sí | Valores anteriores y nuevos. |
| `effectiveAt` | Date | Sí | Fecha efectiva. |
| `recordedAt` | Date | Sí | Fecha de registro. |
| `actor` | object | Sí | `{userId\|system, module, commandId}`. |
| `sourceRef` | object | No | `{crmCaseId, workOrderId, bulkOperationId, morOrderId}`. |

Índices: `{tenantId, contractId, effectiveAt}`; colección append-only.

### 7.20 `contractEquipmentAssignments`

Origen `SERSOC_PRODUCTOS` (ID_SERPROD, ID_SERSOC, COD_PRO, COD_PTH, FECHA_ENTREGA, FECHA_DEVOLUCION, FECHA_DEVUELTO, OBSERVA, COD_DPS, PRECIO).

Colección única del equipo entregado al contrato: cubre los campos de la ex §7.17 de M13 (equipo `inventoryItemId`, serie `serialUnitId`/`serialNumber`, modalidad comodato/venta según DEC-013, fechas de entrega y devolución). M13 mueve la unidad y la valoriza; no mantiene una colección paralela.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | |
| `accountId`, `premiseId`, `serviceId` | uniqueidentifier | Sí | Proyección del contrato al momento de la entrega (cuenta de M01, inmueble `premises` de M01, servicio `tenantServices`); permite a M13 valorizar el comodato y seguir la devolución por inmueble sin leer el contrato (ex §7.17 de M13). |
| `inventoryItemId` | uniqueidentifier | Sí | Equipo: artículo de M13 (ex `COD_PRO`). Antes `productId` (CTR-DAT-30); en la ex §7.17 de M13, `itemId`. |
| `quantity` | DECIMAL(18,4) | Sí | 1 para serializados; cantidad entregada para no serializados (ex §7.17 de M13). |
| `serialUnitId` | uniqueidentifier | Cond. | Unidad serializada de M13 (`serialUnits`, ex `COD_PTH`). Antes `stockUnitId` (CTR-DAT-30). |
| `serialNumber` | string | Cond. | Proyección. |
| `warehouseId` | uniqueidentifier | Sí | Depósito de origen (ex `COD_DPS`; `sourceWarehouseId` en la ex §7.17 de M13). |
| `mode` | enum | Sí | `loan`, `temporaryLoan`, `sale`, `rent`, `customerOwned`, `networkIncorporation`. Default por plan (`defaultDeliveryMode` del artículo de M13); comodato (`loan`) por defecto en Internet y TV, valorizado en stock (DEC-013). Equivalencia con M13 (§7.5 `defaultDeliveryMode`): `loanForUse` = `loan`, `rental` = `rent`; el resto con el mismo nombre. Texto anterior: "`loan`, `sale`, `rent`, `customerOwned`". |
| `status` | enum | Sí | `assigned`, `delivered`, `returnPending`, `returned`, `lost`, `chargeProposed`, `chargedAsLost`, `replaced`, `convertedToSale`. Equivalencia con los estados de M13 §8.4 (nombres de M13 entre comillas, no son valores de este campo): «active» = `delivered`, «pendingReturn» = `returnPending`, «returnedIncomplete» = `returned` con `returnCondition = incomplete`, «notRecovered» = `chargedAsLost`, «swapped» = `replaced`; `chargeProposed` y `convertedToSale` se agregan desde M13. Texto anterior: "`assigned`, `delivered`, `returnPending`, `returned`, `lost`, `chargedAsLost`, `replaced`". |
| `returnCondition` | enum | No | `ok`, `damaged`, `incomplete`, `notRecovered` (ex §7.17 de M13); lo informa M13 al recibir la unidad. |
| `chargeProposalId` | uniqueidentifier | No | Propuesta de cargo por no devolución de M13 (RN-STK-038); el cargo aprobado lo crea M04 en `billableItems` de M05 (RN-TAR-246). Referencia: → `approvalRequests` (T11): la propuesta es la solicitud de aprobación del cargo (RN-STK-038); el ítem aprobado queda en `billableItems` (M05) (PA-CAT-23; antes «Referencia: `billableItems` (M05)»). |
| `saleDocumentRef` | object `{ module: FAC\|VEN, documentId }` | Cond. | Comprobante de M05/M11 cuando `mode = sale` o al pasar a `convertedToSale`. |
| `deliveredAt` | Date | Sí | ex `FECHA_ENTREGA`. |
| `expectedReturnAt` | Date | No | ex `FECHA_DEVOLUCION`. |
| `returnedAt` | Date | No | ex `FECHA_DEVUELTO`. |
| `referencePrice` | DECIMAL(18,4) | No | ex `PRECIO` (valorización en STK). |
| `deliveryEvidenceDocId`, `returnEvidenceDocId` | uniqueidentifier | No | Constancias firmadas. Nombres de rol que apuntan a `documents` de T11 (`documentRefId`, T05 §7.2); no son `storedFileId`. Cubren el `deliveryReceiptStoredFileId` de la ex §7.17 de M13: el binario de la constancia es el `storedFileId` del documento de T11. |
| `workOrderId` | uniqueidentifier | No | OT de instalación. |
| `retrievalWorkOrderId` | uniqueidentifier | No | OT de retiro (ex §7.17 de M13). |
| `notes` | string | No | ex `OBSERVA`. |

Índices: `{tenantId, contractId, status}`; `{tenantId, serialUnitId}` (antes `stockUnitId`) único parcial con `status in [assigned, delivered, returnPending, chargeProposed]`; `{tenantId, status, expectedReturnAt}` (seguimiento de devolución de M13, RN-STK-037; ex §7.17 de M13). Texto anterior del parcial: "`status in [assigned, delivered, returnPending]`".

> **Alineación con T05 (05-11-2026):** T05 declara `serviceProductId`; la ficha usa `inventoryItemId` (artículo de M13) por CTR-DAT-30. Se informa a T05 (posible error de T05; no se cambia).

### 7.21 `applianceTypes` y `contractDeclaredAppliances`

`applianceTypes` (origen `ARTEFACTO`): `code`, `labelKey` (ex `DES_ART`), `isObservation` (ex `ES_OBSERVA`), `serviceIds[]`, `kind` (`gasAppliance`, `electricAppliance`, `electricVehicle`; HUE-GAS-01), `powerUnit` (`kcal/h` en GAS, `W` en artefactos eléctricos, `kW` en cargadores de vehículos eléctricos).

Campos de `applianceTypes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | Ex `DES_ART` | — |
| `isObservation` | bool | [VERIFICAR] | Ex `ES_OBSERVA` | — |
| `serviceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `tenantServices` (M02) |
| `kind` | enum | [VERIFICAR] | `gasAppliance`, `electricAppliance`, `electricVehicle`; HUE-GAS-01 | — |
| `powerUnit` | [VERIFICAR] | [VERIFICAR] | `kcal/h` en GAS, `W` en artefactos eléctricos, `kW` en cargadores de vehículos eléctricos | — |

`contractDeclaredAppliances` (origen `ARTEFSUMS`, `HIS_ARTEFSUMS`): `contractId`, `templateRef` (plantilla del servicio, PRM-CAT-110; HUE-GAS-01), `applianceTypeId` (ex `COD_ART`), `quantity` (ex `CAN_ART`), `power` + `powerUnit` (obligatorios en GAS y ELE; HUE-GAS-01), `vehicle{plate, model}` (solo `electricVehicle`), `brand` (ex `MAR_ART`), `serialNumber` (ex `SN_ART`), `model` (ex `MD_ART`), `declaredDate` (ex `FEC_ART`), `use` (ex `USU_ART`), `status` (ex `ESTADO`), `notes` (ex `OBS_ART`/`OBSERVA`), `declarationDocId`, `history[]` (append-only, ex `HIS_ARTEFSUMS`), `recordedAt` (ex `FEC_REG`).

**`contractDeclaredAppliances`** — tabla de campos.

Campos de `contractDeclaredAppliances` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `templateRef` | [VERIFICAR] | [VERIFICAR] | Plantilla del servicio, PRM-CAT-110; HUE-GAS-01 | — |
| `applianceTypeId` | uniqueidentifier | Sí | Ex `COD_ART` | `applianceTypes` (M02) |
| `quantity` | [VERIFICAR] | [VERIFICAR] | Ex `CAN_ART` | — |
| `power` | [VERIFICAR] | [VERIFICAR] | + `powerUnit` (obligatorios en GAS y ELE; HUE-GAS-01), `vehicle{plate, model}` (solo `electricVehicle`) | — |
| `brand` | [VERIFICAR] | [VERIFICAR] | Ex `MAR_ART` | — |
| `serialNumber` | int | [VERIFICAR] | Ex `SN_ART` | — |
| `model` | [VERIFICAR] | [VERIFICAR] | Ex `MD_ART` | — |
| `declaredDate` | date | [VERIFICAR] | Ex `FEC_ART` | — |
| `use` | [VERIFICAR] | [VERIFICAR] | Ex `USU_ART` | — |
| `status` | enum | Sí | `active`, `removed` (ex columna ESTADO de ProCoop; inicial `active`, §8.5). | — |
| `notes` | [VERIFICAR] | [VERIFICAR] | Ex `OBS_ART`/`OBSERVA` | — |
| `declarationDocId` | uniqueidentifier | [VERIFICAR] | — | `documents` (T11) |
| `history[]` | array [VERIFICAR] | [VERIFICAR] | Append-only, ex `HIS_ARTEFSUMS` | — |
| `recordedAt` | datetime | [VERIFICAR] | Ex `FEC_REG` | — |

### 7.22 `contractMembers`

**No se crea (CTR-DAT-26, CTR-DAT-58).** Adherentes → `serviceDependents` de M18 (RF-SOC-011 a RF-SOC-030, EVT-SOC-01; DEC-071, HUECO-TRV-01); beneficiarios (`BENSOC`) → `serviceBeneficiaries` de M18 (DEC-086; no es tarifa social: esta sale de la categoría social de M02 y de la segmentación de M04); cotitulares → `holders`/`relationships` de M01. Texto anterior: "Reemplazada por `serviceDependents` de M18 (RF-SOC-011 a RF-SOC-030, EVT-SOC-01; DEC-071, HUECO-TRV-01)". M02 no persiste adherentes ni beneficiarios; solo declara en `tenantServices.members` si el servicio los admite. Se conserva la definición original como referencia de mapeo:

Origen `ADHSOC` (COD_ADH, COD_SOC, COD_SUM, COD_SER, COD_PER, COD_VIN, TITULAR, FEC_ALT, FEC_BAJ, FEC_IMP, MAR_IMP, RECUPERA, COD_TAD…), `BENSOC` (COD_BEN, COD_SOC, COD_SUM, COD_SER, COD_PER, COD_VIN, FEC_ALT, FEC_BAJ, COD_CSE, OBSERVA, ACTIVO, ID_SERSOC).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | |
| `role` | enum | Sí | `adherent`, `beneficiary`. |
| `personId` | uniqueidentifier | Sí | PER. |
| `relationshipTypeId` | uniqueidentifier | Sí | PER (ex `VINCULOS`). |
| `isHolder` | bool | Sí | ex `TITULAR`. |
| `adherentTariffId` | uniqueidentifier | No | TAR (ex `COD_TAD`). |
| `benefitRef` | uniqueidentifier | No | Para beneficiarios de beneficio (tarifa social) o cobertura. |
| `joinedAt`, `leftAt`, `leaveReason` | Date/enum | Sí/No | `voluntary`, `deceased`, `outOfRange`, `transfer`, `contractTerminated`. |
| `coverageFrom` | Date | No | `joinedAt` + carencia. |
| `cardPrintedAt`, `cardPrintMark` | | No | ex `FEC_IMP`, `MAR_IMP` (credencial). |
| `recovered` | bool | No | ex `RECUPERA` [VERIFICAR] semántica. |
| `notes` | string | No | |

Índices: `{tenantId, contractId, role, leftAt}`; `{tenantId, personId}`.

### 7.23 `generationAgreements`

**Reemplazada por `distributedGenerationContracts` de M03 (CTR-DAT-59; DEC-060).** M02 solo conserva el contrato ELE del suministro; el vínculo de usuario-generador, la potencia, el medidor bidireccional y la inyección los registra M03. Se conserva la definición original como referencia de mapeo:

MER-001: `contractId` (suministro ELE), `generatorClassification`, `installedPowerKw` (ex `POTENCIA_GENERA`), `equipment`, `connectedAt` (ex `ALTA_GENERA`), `installerId`, `bidirectionalMeterRef` (MED), `injectionTariffRef` (TAR), `status` (`requested`, `active`, `terminated`), `validFrom`, `validTo`, `documents[]`. La cuenta de créditos vive en COB/FAC.

### 7.24 `contractSpecialConditions`

MER-003: `contractId`, `version`, `priceTermsRef` (TAR), `contractedPower{peakKw, offPeakKw}`, `termMonths`, `penalties[]`, `requiresInvoicePreReview` (bool), `approvedBy`, `approvedAt`, `validFrom`, `validTo`, `status`.

Campos de `contractSpecialConditions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `version` | int | Sí | — | — |
| `priceTermsRef` | [VERIFICAR] | [VERIFICAR] | (TAR), `contractedPower{peakKw, offPeakKw}` | — |
| `termMonths` | int | [VERIFICAR] | — | — |
| `penalties[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `requiresInvoicePreReview` | bool | [VERIFICAR] | Bool | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `approvedAt` | datetime | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `status` | enum | Sí | `draft`, `approved`, `expired`, `cancelled` (inicial `draft`, §8.5). | — |

### 7.25 `serviceCopyRuns`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `sourceTenantId`, `sourceServiceId`, `sourceConfigVersionId` | uniqueidentifier | Sí | |
| `targetTenantId` | uniqueidentifier | Sí | `TenantId` del documento = destino. |
| `targetServiceId` | uniqueidentifier | No | Existente o creado. |
| `targetMode` | enum | Sí | `createService`, `newDraftVersion`. |
| `components` | object | Sí | `{products, plans, concepts, categories, classes, properties, statuses, eventChargeRules, autoRules, forms, ticketTypes, templates, surveyTemplates}` (bool cada uno). |
| `dependencies[]` | object[] | Sí | `{kind (area, costCenter, account, warehouse, tariff, tax, authority, branch, connector), sourceRef, resolution: mapped\|pending\|keepTarget, targetRef}`. |
| `excluded[]` | string[] | Sí | Constante: persons, users, contracts, addresses, invoices, debt, payments, tickets, surveyResponses, physicalStock, serials, credentials. |
| `status` | enum | Sí | `requested`, `authorized`, `running`, `completedWithPending`, `completed`, `failed`, `cancelled`. |
| `authorization` | object | Sí | `{sourceApprovedBy, sourceApprovedAt, platformOperatorId}`. |
| `idempotencyKey` | string | Sí | |
| `result` | object | No | Ids creados, advertencias, versión destino. |

Índices: `{tenantId, idempotencyKey}` único.

### 7.26 `bulkContractOperations`

Origen: trámites masivos (`clsTramites`) y cambios masivos de categoría. Campos: `operation` (`markProvisional`, `changeActivity`, `changeClass`, `changeCategory`, `changeReference`, `terminate`, `recategorize`, `resetCategories`, `memberOutOfRangeAction`), `criteria`, `contractIds[]`, `alsoUnbilledConsumption` (bool), `requestedBy`, `originModule` (`cat`, `mor`, `tar`), `status` (`draft`, `simulated`, `approved`, `running`, `completed`, `partiallyFailed`, `reverted`), `results[]{contractId, outcome, message}`, `revertibleUntil`, `jobId`.

Campos de `bulkContractOperations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operation` | enum | [VERIFICAR] | `markProvisional`, `changeActivity`, `changeClass`, `changeCategory`, `changeReference`, `terminate`, `recategorize`, `resetCategories`, `memberOutOfRangeAction` | — |
| `criteria` | [VERIFICAR] | [VERIFICAR] | — | — |
| `contractIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `serviceContracts` (M02) |
| `alsoUnbilledConsumption` | [VERIFICAR] | [VERIFICAR] | Bool | — |
| `requestedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `originModule` | enum | [VERIFICAR] | `cat`, `mor`, `tar` | — |
| `status` | enum | Sí | (`draft`, `simulated`, `approved`, `running`, `completed`, `partiallyFailed`, `reverted`), `results[]{contractId, outcome, message}` | — |
| `revertibleUntil` | [VERIFICAR] | [VERIFICAR] | — | — |
| `jobId` | uniqueidentifier | Sí | — | `jobRuns` (T01) |

### 7.27 `serviceTemplates` (plataforma)

`capabilityId`, `code`, `labelKey`, `snapshot` (perfil, productos, planes sin precios, categorías, estados, reglas), `version`, `status`. Adoptado (DEC-026; PA-CAT-08).

Campos de `serviceTemplates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `capabilityId` | uniqueidentifier | Sí | — | `serviceCapabilities` (M02) |
| `code` | string | Sí | — | — |
| `labelKey` | string | [VERIFICAR] | — | — |
| `snapshot` | [VERIFICAR] | [VERIFICAR] | Perfil, productos, planes sin precios, categorías, estados, reglas | — |
| `version` | int | Sí | — | — |
| `status` | enum | Sí | — | — |

### 7.28 Relaciones principales

`serviceCapabilities 1—N tenantServices 1—N serviceConfigVersions`; `tenantServices 1—N serviceProducts 1—N servicePlans 1—N servicePlanVersions`; `tenantServices 1—N serviceCategories / serviceClasses / serviceProperties / serviceStatuses / billableConcepts / eventChargeRules`; `serviceContracts N—1 tenantServices, N—1 persons, N—1 accounts, N—1 servicePlanVersions`; `serviceContracts 1—N serviceContractHistory / contractEquipmentAssignments / contractDeclaredAppliances` (`contractMembers` reemplazada por M18 `serviceDependents`, HUECO-TRV-01); `serviceContracts 1—0..1 generationAgreements / contractSpecialConditions` (`generationAgreements` reemplazada por `distributedGenerationContracts` de M03, CTR-DAT-59); `serviceContracts N—1 holders, N—1 servicePoints` (CTR-DAT-66/67); `serviceContracts 1—N serviceBeneficiaries / contractRegistrations` de M18 (DEC-086, RF-SOC-148); `tenantServices N—1 legalEntities` (DEC-064).

### 7.29 `bundleSubscriptions` — suscripción a un combo (PA-CAT-22)

Colección declarada el 05-11-2026 (PA-CAT-22): agrupa los contratos que nacen de contratar un paquete (RF-CAT-044); cada `serviceContracts.bundleSubscriptionId` apunta aquí. No existe en ProCoop.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `bundleId` | uniqueidentifier | Sí | Paquete contratado. | `serviceBundles` (M02) |
| `bundleVersion` | int | Sí | Versión del paquete vigente al contratar. | — |
| `holderId` | uniqueidentifier | Sí | Titular. | `holders` (M01) |
| `accountId` | uniqueidentifier | Sí | Cuenta. | `accounts` (M01) |
| `contractIds` | uniqueidentifier[] | Sí | Contratos del combo, uno por servicio. | `serviceContracts` (M02) |
| `validFrom` / `validTo` | date | Sí / No | Vigencia de la suscripción. | — |
| `status` | enum | Sí | `active`, `partial`, `terminated` (§8.3). | — |

Índice `{tenantId, accountId, bundleId, validFrom}`.

## 8. Estados y transiciones

### 8.1 Reconciliación de fuentes

| ProCoop `CONDICION` (RN-01 §2, RN-06 §4.1) | ProCoop `ESTASER` (ejemplos) | BASE §48/§53/§89 | Estado canónico CoopApps |
|---|---|---|---|
| — (la solicitud vive en trámites/CoopOnline) | — | Solicitud registrada sin contrato activo | `requested` — Solicitado |
| — (`FACTIBIL` separado) | — | Factibilidad/cobertura | `feasibility` — En factibilidad |
| 1 Pendiente de conexión (sin `FEC_ALTA`) | (pendiente) | Aprobado, pendiente de instalación | `pendingInstallation` — Pendiente de instalación/conexión |
| 2 Conectado | CONECTADO | Activo | `active` — Conectado/Activo |
| 2 (con `ESTASER` que implica desconexión) | CORTADO | Suspensión por mora / otro motivo / temporal solicitada | `suspended` — Suspendido (motivo y modo) |
| — | — | Rehabilitación en trámite | `reactivationPending` — Rehabilitación en trámite |
| 3 Pendiente de desconexión (`BAJA_ADM` sin `FEC_BAJA`) | — | Baja solicitada/en ejecución | `pendingTermination` — Baja en trámite |
| 4 Baja/desconectado (`FEC_BAJA`) | BAJA | Baja contractual efectiva | `terminated` — Baja |
| — (OT de alta eliminada, V2 2753 → 5) | — | Desistimiento/rechazo antes de activar | `cancelled` — Anulado/Desistido |
| 5 No vigente (transferencia, V2 2541) | — | — | `superseded` — No vigente (reemplazado) |

Los estados operativos del tenant (`serviceStatuses`) se muestran y operan; el canónico gobierna reglas, facturación y permisos.

### 8.2 Transiciones del contrato

| # | Origen → Destino | Comando / evento | Actor | Precondiciones | Efectos | Reversión |
|---|---|---|---|---|---|---|
| T01 | (nuevo) → `requested` | `cat.contract.create` desde `crm.commandRequest.requested` (EVT-CRM-13) o mostrador | CRM / operador | Servicio con oferta abierta; titular identificado; plan publicado; canal habilitado | Contrato con `dates.requestedAt`; sin facturación; evento `cat.contract.requested` | `cancel` (T13) |
| T02 | `requested` → `feasibility` | `requestFeasibility` | Sistema/operador | Servicio exige factibilidad | Pedido a TEC; `feasibilityRef` | `cancel` |
| T03 | `feasibility` → `pendingInstallation` | `tec.feasibility.verdictIssued` (EVT-TEC-02, aprobada) | TEC | Factibilidad aprobada | Si técnico: pedido de instalación/OT de alta; `dates.adminStart` | Volver a `feasibility` solo si TEC revoca antes de agendar |
| T04 | `feasibility` → `cancelled` | `tec.feasibility.verdictIssued` (EVT-TEC-02, rechazada) | TEC | — | Motivo; notificación al socio vía CRM | Nueva solicitud |
| T05 | `requested` → `pendingInstallation` | `approve` | Supervisor | Servicio sin factibilidad; requisitos cumplidos | Igual T03 | `cancel` |
| T06 | `pendingInstallation` → `active` | `tec.installation.activationConfirmed` (EVT-TEC-16) / `tec.workOrder.closed(activation)` (EVT-TEC-07) (técnico) o `activate` (no técnico) | TEC / supervisor | RN-CAT-064; equipos obligatorios asignados; provisión confirmada (INT) | `dates.effectiveStart`; estado operativo `onActivation`; conceptos por evento tipo 1/5; lectura inicial (MED); `cat.contract.activated` (FAC inicia devengamiento; altas automáticas) | Solo por `cancelActivation` en el mismo día sin facturación emitida; si no, baja |
| T07 | `pendingInstallation` → `pendingInstallation` (reagenda) | `tec.visit.failed` | TEC | Visita fallida | Registra intento; no cambia estado; indicador "visitas fallidas" (BASE §86) | — |
| T08 | `active` → `suspended` | `suspend{reason, mode}` desde `mor.interruption.approved` (EVT-MOR-12, tipo suspensión), solicitud voluntaria ejecutada, orden técnica/regulatoria | MOR / CRM / TEC / supervisor | Operación permitida en el perfil; para mora: política MOR y límites normativos (electrodependencia, etc.) | `suspension{}`; estado operativo con `impliesDisconnection` si corresponde; orden técnica si `interrupted` en servicio técnico; `cat.contract.suspended` | `reactivate` |
| T09 | `suspended` → `reactivationPending` | `requestReactivation` (pago confirmado por MOR, fin de suspensión voluntaria, solicitud) | MOR / CRM / sistema | Causa de suspensión levantada | Pedido de reconexión a TEC (si técnico o requiere inspección) | Volver a `suspended` si TEC rechaza (ej. inspección de gas fallida) |
| T10 | `reactivationPending` → `active` | `tec.workOrder.closed(reconnection)` / `tec.provisioning.confirmed` o `reactivate` directo en no técnico | TEC / sistema | Confirmación técnica | Regla de fecha de alta (RN-CAT-043); conceptos tipo 4 si la política MOR lo habilita; estado `onReconnection`; `cat.contract.reactivated` | — |
| T11 | `suspended` → `active` | `reactivate` | Sistema / supervisor | Servicio no técnico sin inspección (reconexión automática por pago, V2 3112 en MOR) | Igual T10 | — |
| T12 | `active`/`suspended` → `pendingTermination` | `requestTermination` (solicitud CRM ejecutable, decisión de la cooperativa con causa, orden de MOR para baja definitiva) | CRM / supervisor / MOR | Ninguna para baja solicitada por el socio (sin cargo, sin bloqueo por deuda) | `dates.terminationRequestedAt`; OT de desconexión si técnico (RN-CAT-039/040); equipos → `returnPending` | `withdrawTermination` antes de la efectiva (desistimiento del socio) → estado previo |
| T13 | `requested`/`feasibility`/`pendingInstallation` → `cancelled` | `cancel{reason}` | Socio (desistimiento) vía CRM / supervisor / TEC (OT de alta eliminada) | Sin activación; si hay equipo entregado → `returnPending` | `dates.cancelledAt`; no genera retiro si no hubo instalación | Nueva solicitud |
| T14 | `pendingTermination` → `terminated` | `tec.workOrder.closed(disconnection)` o `terminate` (no técnico) | TEC / supervisor | — | `dates.effectiveEnd` (y `terminationRequestedAt` si vacío, RN-CAT-041); lectura final (MED); facturación final (FAC); cascada a miembros (la aplica M18 al consumir `cat.contract.terminated`, HUECO-TRV-01); altas automáticas de evento baja; `cat.contract.terminated` | No reversible: reactivar un contrato terminado exige nueva alta (BASE §53), salvo `reopenTermination` dentro de N días sin facturación final emitida (PRM-CAT-047) |
| T15 | `active`/`suspended`/`pendingTermination` → `superseded` | `transfer` | Supervisor | Reglas de transferencia (RN-CAT-051..054) | Contrato nuevo en destino (`requested`→`active` inmediato con fecha de transferencia o mantenida); original con `effectiveEnd` y `supersededByContractId` | No reversible; corrección por nueva transferencia |
| T16 | `terminated` → `superseded` | `transfer` de contrato dado de baja | Supervisor | V2 2599 activo | Igual T15 | — |
| T17 | cualquier no terminal → mismo estado | `changePlan`, `changeCategory`, `changeClass`, `relocate`, `setFlag`, `changeHolderPayer`, `changeMeteringRegime` (solo `active`/`suspended`, RN-CAT-078, HUE-AG-03) | según capability (`cat.contratos.cambiarRegimenMedicion` para el régimen) | Operación permitida | Nuevo tramo/historia; OT si corresponde; `changeMeteringRegime` publica EVT-CAT-28 | Por nueva operación |

Estados terminales: `terminated`, `cancelled`, `superseded`. Marcas no canónicas que se muestran en la ficha sin cambiar el estado: "Baja solicitada (en CRM)", "Suspensión solicitada", "Cambio de plan programado", "Provisorio vence el dd-mm-yyyy".

### 8.3 Estados de otras entidades

| Entidad | Estados | Transiciones clave |
|---|---|---|
| `serviceCapabilities` | `draft` → `available` → `deprecated` | `deprecated` impide nuevas habilitaciones; tenants existentes siguen operando. |
| `tenantServices.enablement` | `enabled` ⇄ `disabled` | `disabled` solo si `operationStatus=closed` o con plan de salida (RN-CAT-003). |
| `tenantServices.offerStatus` | `notPublished` → `open` ⇄ `closed` | `open` exige versión publicada sin bloqueos. |
| `serviceConfigVersions` | `draft` → `inReview` → `approved` → `scheduled` → `published` → `superseded`; `inReview` → `rejected` → `draft`; `draft` → `discarded` | Publicar exige validaciones sin bloqueos; la anterior pasa a `superseded` en `effectiveFrom`. |
| `servicePlans` | `draft` → `published` → `discontinued` → `retired` | `retired` solo sin contratos no terminales. |
| `contractEquipmentAssignments` | `assigned` → `delivered` → `returnPending` → `returned` / `lost` → `chargedAsLost`; `delivered` → `replaced`; `returnPending` → `chargeProposed` → `chargedAsLost` (aprobado) o → `returnPending` (rechazo o prórroga); `chargedAsLost` → `returned` (recupero tardío); `delivered` → `convertedToSale` | `lost` dispara concepto de equipo no devuelto solo si está configurado y aceptado en condiciones. Las transiciones que nacen de hechos de stock (retiro, devolución, propuesta de cargo, no recuperado) las dispara M13 con sus eventos (M13 §8.4, con la equivalencia de estados de §7.20). |
| `serviceCopyRuns` | `requested` → `authorized` → `running` → `completed` / `completedWithPending` / `failed`; `requested` → `cancelled` | Reintento idempotente desde `failed`. |
| `bulkContractOperations` | `draft` → `simulated` → `approved` → `running` → `completed` / `partiallyFailed` → `reverted` | Reversión mientras `revertibleUntil` y sin facturación con el cambio. |
| `bundleSubscriptions` | `active` → `partial` → `terminated`; `active` → `terminated` | `partial` cuando se da de baja un contrato del combo y la regla del paquete conserva los demás (RF-CAT-044); `terminated` cuando no queda contrato vigente (PA-CAT-22). |
| `generationAgreements` | `requested` → `active` → `terminated` | Termina con el suministro. Reemplazada por `distributedGenerationContracts` de M03 (CTR-DAT-59); el ciclo lo define M03. |

### 8.4 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5).

**Valores declarados** (la ficha de §7 tenía el campo sin valores):

| Entidad | Campo | Valores | Estado inicial | Fuente |
|---|---|---|---|---|
| `billableConcepts`, `serviceCategories`, `autoServiceRules` | `status` | `active`, `inactive` (propuestos, aceptados en PA-CAT-21, DEC-072; antes [VERIFICAR]) | `active` | Viven dentro de `serviceConfigVersions`: la vigencia la dan `validFrom`/`validTo` y la versión publicada (§8.3). |
| `serviceBundles` | `status` | `draft`, `published`, `discontinued`, `retired` (propuestos, aceptados en PA-CAT-21, DEC-072; antes [VERIFICAR]) | `draft` | Mismo ciclo que `servicePlans` (§8.3), porque un combo agrupa versiones de planes. |
| `serviceStatuses` | `canonicalStatus` | Los diez estados canónicos de §8.1 (clasificación del estado operativo, no ciclo de vida del registro; antes se enumeraban aquí y el índice de cobertura los leía como estados sin transiciones, ver §8.5) | — (catálogo) | Estados canónicos de §8.1. |
| `contractDeclaredAppliances` | `status` | `active`, `removed` (propuestos, aceptados en PA-CAT-21, DEC-072; antes [VERIFICAR]) (ex columna ESTADO de ProCoop) | `active` | El artefacto declarado queda en la historia (`history[]`). |
| `contractSpecialConditions` | `status` | `draft`, `approved`, `expired`, `cancelled` (propuestos, aceptados en PA-CAT-21, DEC-072; antes [VERIFICAR]) | `draft` | Exige `approvedBy`/`approvedAt` para aplicar. |
| `serviceTemplates` | `status` | `draft`, `published`, `deprecated` (propuestos, aceptados en PA-CAT-21, DEC-072; antes [VERIFICAR]) | `draft` | Igual criterio que `serviceCapabilities` (§8.3). |

**Transiciones agregadas:**

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `serviceProducts` | — | `active` | Alta en la versión de configuración | RN-CAT-005 (validaciones de publicación) | `cat.tenantService.published` |
| `serviceProducts` | `active` | `discontinued` | Versión de configuración publicada que lo discontinúa | Sin planes publicados que lo exijan | `cat.tenantService.published` |
| `contractEquipmentAssignments` | — | `assigned` | Asignación de equipo al contrato | Equipos obligatorios del plan | — |

Los valores `active`, `pendingReturn`, `returnedIncomplete`, `notRecovered` y `swapped` de `contractEquipmentAssignments.status` son nombres de M13 §8.4 que §7.20 declara como equivalencias (`active` = `delivered`, etc.); no son estados propios y no llevan transición. Por eso el índice de cobertura los marcaba como inalcanzables.

### 8.5 Estados iniciales y transiciones completadas (residuales del 05-11-2026)

Ronda de residuales del 05-11-2026 (PA-CAT-23, DEC-072): estado de alta explícito de las máquinas de §8.3 y §8.4 que no lo indicaban y transiciones de las colecciones que solo enumeraban estados. `serviceStatuses` es un catálogo: su `canonicalStatus` clasifica el estado operativo del contrato (§8.1) y no tiene transiciones; el registro sigue el patrón de tablas maestras (alta y desactivación). `generationAgreements` no se crea (CTR-DAT-59): su ciclo es el de `distributedGenerationContracts` de M03.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `serviceCapabilities` | — | `draft` | Alta de la capacidad en plataforma | — | — |
| `tenantServices.enablement` | — | `enabled` | Habilitación del servicio para el tenant | Licencia vigente (RN-CAT-003) | — |
| `tenantServices.offerStatus` | — | `notPublished` | Alta del servicio del tenant | — | — |
| `serviceConfigVersions` | — | `draft` | Nueva versión de configuración | — | — |
| `servicePlans` | — | `draft` | Alta del plan | — | — |
| `contractDeclaredAppliances` | — | `active` | Declaración del artefacto en el contrato (DDJJ) | Potencia y unidad obligatorias en GAS y ELE (HUE-GAS-01) | — |
| `contractDeclaredAppliances` | `active` | `removed` | Retiro o reemplazo del artefacto declarado | Queda en `history[]` | — |
| `contractSpecialConditions` | — | `draft` | Alta de condiciones especiales (MER-003) | — | — |
| `contractSpecialConditions` | `draft` | `approved` | Aprobación (`approvedBy`, `approvedAt`) | Exige aprobación para aplicarse | — |
| `contractSpecialConditions` | `approved` | `expired` | Vence `validTo` | — | — |
| `contractSpecialConditions` | `draft`/`approved` | `cancelled` | Anulación con motivo | — | — |
| `serviceCopyRuns` | — | `requested` | Solicitud de copia entre tenants | — | — |
| `bulkContractOperations` | — | `draft` | Alta de la operación masiva | — | — |
| `bundleSubscriptions` | — | `active` | Alta del combo con sus contratos | — | — |

## 9. Procesos y flujos

### 9.1 Lanzar un servicio en un tenant (CU-05, CU-CAT-01)

1. Plataforma verifica licencia (T01) y habilita la capacidad (`tenantServices.enablement=enabled`).
2. El administrador crea la versión de configuración 1 en `draft` (desde cero, plantilla o copia).
3. Completa perfil (13 dimensiones), productos, conceptos, planes, categorías, clases, propiedades, estados y mapeos.
4. Solicita a TAR el cuadro tarifario y vincula los planes (`tariffBinding`).
5. El sistema ejecuta validaciones (RN-CAT-005) y simulación de primera factura sin crear deuda (TAR/FAC en modo simulación).
6. Envía a revisión; un aprobador distinto aprueba (RF-CAT-035).
7. Publica con fecha efectiva; `offerStatus=open`; evento `cat.tenantService.published`; landing y PWA muestran la oferta.

### 9.2 Alta de contrato — piloto Internet (CU-PRO-01, CU-SOL-01 en lo que toca al contrato)

1. CRM admite la solicitud de Ana (`crm.commandRequest.requested` (EVT-CRM-13) con el comando `cat.contract.create`, titular, domicilio, plan elegido, aceptación de condiciones) → CAT crea contrato en `requested` (T01) (PA-CAT-01).
2. Como INT exige factibilidad → `feasibility` (T02); TEC evalúa cobertura.
3. Factibilidad aprobada → `pendingInstallation` (T03); TEC agenda la visita (M10).
4. En la visita, el técnico asigna la ONT en comodato (`contractEquipmentAssignments.assigned/delivered`, STK mueve la unidad), instala, prueba, toma conformidad firmada.
5. TEC confirma aprovisionamiento (MikroTik/OLT) → `tec.installation.activationConfirmed` (EVT-TEC-16) → CAT activa (T06), registra `effectiveStart`, estado operativo "CONECTADO", genera conceptos por evento (instalación) y publica `cat.contract.activated`.
6. FAC/TAR inician el devengamiento del abono desde la activación con promoción y prorrateo según condiciones (M04/M05).

### 9.3 Suspensión, reactivación y baja (CU-CIC-01 en lo que toca al contrato)

- **Voluntaria:** CRM registra la solicitud; si el perfil la admite, al ejecutarse se envía `suspend{reason:voluntary}`; al vencer `expectedEndAt` el job `cat:fin-suspension-voluntaria` solicita la reactivación.
- **Por mora:** MOR emite `mor.interruption.approved` (EVT-MOR-12, tipo suspensión) → CAT T08 (modo según servicio) → TEC ejecuta si `interrupted`. Pago y orden de MOR → T09/T10 o T11.
- **Baja:** CRM recibe por cualquier canal (incluido botón público) → al ejecutarse, `requestTermination` (T12) → TEC desconecta y retira equipo → T14. La baja no espera la devolución del equipo; el pendiente queda en la bandeja.

### 9.4 Cambio de plan y de categoría

1. Solicitud (CRM o mostrador) con plan destino y fecha deseada.
2. CAT valida compatibilidad, requisitos y operación permitida; calcula (vía TAR) el efecto sobre el período en curso y promociones (PA-CAT-15).
3. Aceptación del socio (evidencia) → nuevo tramo en `agreedConditions` con `validFrom`.
4. Si requiere cambio técnico (velocidad), pedido de reprovisión a TEC; el tramo rige desde la confirmación.
5. Cambio de categoría: según `categoryChangeMode` inmediato, programado o al cerrar OT (V2 2330/2455); proporcional según día límite (V2 2755).

### 9.5 Transferencia de servicio (RN-06 §7)

1. Supervisor elige contrato origen y cuenta/titular destino; el sistema muestra deuda del origen (que no se transfiere), adherentes y equipos.
2. Valida reglas (titular destino activo, contratos dados de baja, conceptos de transferencia).
3. Crea contrato destino (mantener fecha opcional), traslada línea, beneficiarios, vivienda, punto de suministro, propiedades; adherentes según modo.
4. Cierra el origen como `superseded` (o `terminated`), con `supersededByContractId`.
5. Genera conceptos por evento tipo 7; sincroniza integraciones configuradas (ex AION).

### 9.6 Copia de servicio entre tenants (CU-COP-01)

1. Operador autorizado elige origen (TEN-001/INT/v1) y destino (TEN-002); el tenant origen autoriza la lectura (PA-CAT-07).
2. Elige componentes; el sistema arma la lista de dependencias y la clasificación copiar/conservar/mapear.
3. Job `cat:copiar-servicio` crea `tenantService` o versión `draft` en destino; registra procedencia; excluye datos operativos y credenciales.
4. B resuelve pendientes (precios TAR, calendario, área técnica, cuentas, cobertura, marca y lenguaje propios).
5. Simula una contratación y la primera factura sin deuda real.
6. Aprueba y publica (9.1 pasos 6-7). Cambios posteriores en A no afectan a B.

### 9.7 Altas automáticas (RN-06 §3.5)

1. Un evento (`cat.contract.activated`, `per.account.created`, `cat.contract.terminated`, `cat.contract.reactivated`, `cat.contract.categoryChanged`, `tec.workOrder.created`, `cat.contract.addressChanged`) dispara `cat:altas-automaticas`.
2. El job evalúa reglas vigentes del servicio origen y filtros; verifica no duplicado (RN-CAT-036).
3. Modo `propose`: crea tarea para el operador con el contrato propuesto. Modo `create`: crea el contrato destino (`requested` → `active` si no técnico) con grupo de facturación según regla y `origin.autoRuleId`.
4. Para el evento baja, la regla puede proponer la baja de contratos accesorios (`parentContractId`).

### 9.8 Trámites masivos y recategorización

1. Usuario o módulo (TAR para segmentación, MOR para paso a prepago) crea `bulkContractOperations` en `draft` con criterio.
2. Simulación: lista de contratos afectados, excluidos y motivo (marca "No aplica recategorización", bajas > 60 días, validación de desconexión para bajas).
3. Aprobación; job `cat:tramite-masivo` procesa en lotes de 1000 de forma idempotente y reanudable; cada contrato genera historia y nota.
4. Resultado por contrato; reversión disponible según `revertibleUntil`.

### 9.9 Jobs

| Job | Disparador | Descripción | Reintentos / recuperación |
|---|---|---|---|
| JOB-CAT-01 `cat:altas-automaticas` | Evento | Evalúa `autoServiceRules`. | Idempotente por `(eventId, ruleId)`; 5 reintentos exponenciales; DLQ con alerta. |
| JOB-CAT-02 `cat:tramite-masivo` | Aprobación | Ejecuta `bulkContractOperations` por lotes. | Reanudable desde el último lote confirmado. |
| JOB-CAT-03 `cat:copiar-servicio` | Comando | Copia configuración entre tenants. | Idempotente por `idempotencyKey`; transacción por componente; estado `completedWithPending`. |
| JOB-CAT-04 `cat:publicar-version-programada` | Diario 00:05 zona del tenant | Publica versiones `scheduled` cuyo `effectiveFrom` llegó. | Reintento horario. |
| JOB-CAT-05 `cat:vencimiento-provisorios` | Diario | Notifica y propone baja/conversión de provisorios vencidos. | — |
| JOB-CAT-06 `cat:vencimiento-no-facturar` | Diario | Quita la marca "No facturar" vencida y avisa. | — |
| JOB-CAT-07 `cat:mayoria-edad-adherentes` | — (antes: Diario, V2 3186) | **Reemplazado por JOB-SOC-01** (M18, dueño único; no se ejecuta). Texto original: lista adherentes que cumplen 21 años; envía correo/notificación. | — |
| JOB-CAT-08 `cat:fin-suspension-voluntaria` | Diario | Dueño único del vencimiento de la suspensión voluntaria: al vencer, reactiva el contrato (T10/T11) y publica EVT-CAT-12 `cat.contract.reactivated`; M08 solo reacciona a ese evento (JOB-MOR-08) y cierra su caso. | Idempotente por (`contractId`, fin de suspensión). |
| JOB-CAT-09 `cat:devoluciones-vencidas` | Evento EVT-STK-07 `stk.equipment.returnOverdue` | Reacción: marca la asignación con devolución vencida en la ficha del contrato. La detección diaria y la tarea de retiro son de M13. Ver JOB-STK-05 (dueño). | Idempotente por `eventId`. |
| JOB-CAT-10 `cat:fin-promociones` | Evento EVT-TAR-012 `tar.promotion.ended` | Reacción: actualiza el tramo de condiciones contratadas del contrato (RF-CAT-052). El fin de la promoción y el aviso al socio son de M04. Ver JOB-TAR-11 (dueño). | Idempotente por `eventId`. |
| JOB-CAT-11 `cat:carencias` | — (antes: Diario) | **Reemplazado por M18** (RF-SOC-005, RF-SOC-032 y PRM-SOC-013: la carencia se evalúa a la fecha del evento en la verificación de cobertura; DEC-071, HUECO-TRV-01; no se ejecuta). Texto original: Activa coberturas al cumplirse la carencia y notifica. | — |
| JOB-CAT-12 `cat:fin-cuotas-obra` | Evento de FAC (última cuota) | Cierra contratos OBR completados. | — |
| JOB-CAT-13 `cat:crear-contratos-obra` | Evento EVT-TEC-25 `tec.levy.approved` | Por cada beneficiario del prorrateo crea el contrato de obra (tipo 17, dominio OBR) con API-CAT-33 vinculado a la obra, al inmueble y a la cuenta, con cuotas y unidades del prorrateo en `domainAttributes.installments`; los contratos sin servicio técnico pasan a `active` con la fecha de aprobación. Informe del lote: creados, existentes y rechazados con motivo (RF-CAT-115, HUECO-OBR-01). | Idempotente por (`workId`, `premiseId`) (antes `propertyId`, CTR-DAT-30): si el contrato ya existe no se crea otro; reanudable por beneficiario; 5 reintentos exponenciales; DLQ con alerta. |

## 10. Pantallas

Todas siguen el patrón CNX: AdminShell, `AdminStickyHeader`, `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` con columnas configurables, filtros, exportación XLSX/CSV/PDF, vistas guardadas; modales `sm/md/lg/xl`; `ConfirmDialog` en toda transición; etiquetas por `dict:`; importes en IBM Plex Mono. Ubicación en `siteMapGroups`: cluster "Comercial" → grupo "Catálogo de servicios" y grupo "Contratos"; cluster "Plataforma" → "Capacidades".

| PAN-ID | App | Ruta | Capability | Propósito, layout y contenido | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|
| PAN-CAT-01 | plataforma | `/platform/cat/capabilities` | `cat.capacidades.ver` | Catálogo global de capacidades. DataTable: código, dominio, estado, madurez, perfiles, tipos de cálculo, tenants que la usan. Acciones: crear, editar ficha de dominio y esquema de atributos (modal xl con editor JSON Schema validado), deprecar. Estado vacío: "Todavía no hay capacidades; cargue la semilla de plataforma". | — (nuevo) |
| PAN-CAT-02 | plataforma | `/platform/cat/enablement` | `cat.habilitacion.ver` | Matriz tenants × capacidades (CU-CAT-01) con estado, fechas, licencia. Acciones: habilitar/deshabilitar (modal md con fecha y motivo; muestra dependencia de licencia). | CNX §4.3 `/suscriptores` (packs) |
| PAN-CAT-03 | admin | `/admin/cat/services` | `cat.servicios.ver` | Servicios del tenant. Columnas: código, nombre, dominio, oferta (abierta/cerrada), operación, versión vigente, versión borrador, contratos activos, principal. Acciones: nuevo (desde cero/plantilla/copia), abrir, publicar, cerrar oferta, retirar (modal lg con alcance y plan de salida). | `abm_Servicio` (listado) |
| PAN-CAT-04 | admin | `/admin/cat/services/:id` | `cat.servicios.configurar` | Ficha de configuración del servicio en pestañas: General (código, nombre, tipo, principal), Prestador y jurisdicción, Titularidad, Unidad y cantidad, Registración y cálculo, Requisitos de alta (cada uno No exigir/Advertir/Exigir), Operación (técnico, OT por evento), Estados por defecto, Miembros (adherentes/beneficiarios), Cambios y salida, Transferencias, Unicidad y controles, Facturación (grupo por defecto, sin consumo, servicio relacionado, división), Documentos y plantillas, Canales, Atención, Mapeos contables, Integraciones, Control. Banner de "versión borrador en edición". Ayuda contextual con caso de uso CU-05. | `abm_Servicio` (ConfigurarForm, Guardar, Propiedades, Categorías, TarAdhe), `abm_Servicio_OT` |
| PAN-CAT-05 | admin | `/admin/cat/services/:id/versions` | `cat.versiones.crear` / `cat.versiones.aprobar` | Versiones: lista con estado y fecha efectiva; detalle con diff lado a lado, validaciones (bloqueantes/advertencias), botón "Simular primera factura" (resultado de TAR/FAC en modo simulación), enviar a revisión, aprobar/rechazar (modal con comentario), programar publicación. | — (nuevo; ProCoop usa `HIS_*` por cuadro) |
| PAN-CAT-06 | admin | `/admin/cat/products` | `cat.productos.ver` | Productos/subservicios y conceptos facturables por servicio (dos pestañas). Columnas concepto: código, nombre, tipo, disparador, unidad, clase fiscal, rubro, interno sí/no, estado. Modal lg de concepto. Importación por `ExcelImportWizard`. | `abm_prod_ser`, `abm_prod_ser_combos` |
| PAN-CAT-07 | admin | `/admin/cat/plans` | `cat.planes.ver` | Planes y versiones: código, producto, estado, versión vigente, contratos por versión. Editor de versión (xl): atributos, periodicidad, categorías admitidas, componentes, promociones (duración y unidad), financiación, equipos, requisitos, vínculo tarifario. Acciones: publicar, discontinuar, preview "celular" de la tarjeta del plan en la PWA. | — (nuevo) |
| PAN-CAT-08 | admin | `/admin/cat/categories` | `cat.categorias.ver` | Categorías y grupos por servicio: código, nombre, grupo, social, prepaga, generador, códigos regulatorios, perfil de red, adherentes. Acciones: crear, clonar categoría, editar, ver contratos. Los precios se editan en TAR (enlace). | `abm_Servicio_Categorias` (parte estructural), `abm_GrpCat` |
| PAN-CAT-09 | admin | `/admin/cat/classes-properties` | `cat.clases.ver` | Clases de servicio (valores 1 y 2) y propiedades del servicio y personalizadas (tipo, lista de valores). | `abm_ClaseSer`, `abm_Servicio_Propiedad`, `abm_propieItems`, `abm_propieitems_valores` |
| PAN-CAT-10 | admin | `/admin/cat/statuses` | `cat.estados.configurar` | Estados operativos por servicio: código, nombre, canónico, implica desconexión, principal, visible al socio. Diagrama de la máquina canónica (solo lectura) con los operativos mapeados. | `abm_EstaSer` |
| PAN-CAT-11 | admin | `/admin/cat/auto-rules` | `cat.reglasAuto.configurar` | Reglas de altas automáticas: evento, servicio origen/destino, categoría destino, filtros, modo propose/create, fundamento, grupo de facturación. Simulador "qué contratos se habrían creado el último mes". | `abm_AltasEau` |
| PAN-CAT-12 | admin | `/admin/cat/event-charges` | `cat.conceptos.editar` | Conceptos por evento y bonificaciones de conexión: tipo de evento, concepto, filtros, una vez, requiere política MOR; pestaña de bonificaciones por cuenta. Acción masiva "modificar precio" redirige a TAR. | `abm_Conexion` |
| PAN-CAT-13 | admin | `/admin/cat/contracts` | `cat.contratos.ver` | Contratos: número, titular (nombre y DNI/CUIT enmascarado según permiso), cuenta, servicio, plan, categoría, estado canónico y operativo, fecha del último estado, matrícula, domicilio del servicio, flags. Filtros: servicio, estado, plan, categoría, zona/ruta, sucursal, flags, fechas. Por defecto solo activos (V2 2321); búsqueda por matrícula aproximada (V2 3108). Selección masiva → PAN-CAT-17. | `frmTitulares` (grilla de servicios), `abm_Socios` |
| PAN-CAT-14 | admin | `/admin/cat/contracts/:id` | `cat.contratos.ver` | Ficha del contrato por bloques (RF-CAT-068): Cabecera, Ubicación (mapa), Servicio, Estado (línea de tiempo de transiciones), Condiciones contratadas (tramos y promociones con fin), Flags, Equipos (PAN-CAT-19), Miembros (PAN-CAT-20, reemplazado por enlace a PAN-SOC-01, HUECO-TRV-01), Dominio (atributos según ficha: Internet perfil técnico sin secretos; Telefonía líneas; Gas DDJJ — PAN-CAT-25; ELE GD/GU), Medidor y lecturas (desde MED), Deuda y facturas (desde COB/FAC, solo lectura), Casos CRM y OT vinculados, Documentos, Historia. Acciones según estado y capability (PAN-CAT-16). | `abm_Socios` (NuevoServicio, ModificarServicio, CambiarMedidor, CambioDomicilio, DesconectarServicio, ImprimirContrato, ImprimirFianzaServicio, ImprimirFichaAdherentes, ImprimirDetalleLlamadas), REL capturas 14 y 15 |
| PAN-CAT-15 | admin | `/admin/cat/contracts/new` | `cat.contratos.crear` | Asistente de alta (modal xl, pasos): 1 titular y cuenta (búsqueda PER), 2 servicio y plan (solo ofertas abiertas), 3 domicilio del servicio (calle normalizada, mapa, catastro), 4 requisitos del perfil (errores y advertencias juntos), 5 condiciones y aceptación, 6 resumen (incluye advertencia de deuda en domicilio y conceptos por evento). Al confirmar: contrato `requested` y caso CRM vinculado. | `frmTitulares.btnAltaBajaServicio`, `abm_Socios.NuevoServicio` |
| PAN-CAT-16 | admin | modales en PAN-CAT-14 | la capability del comando de API-CAT-35 que ejecuta cada acción (p. ej. `cat.contratos.suspender`; antes: «según acción») | Transiciones: Aprobar, Activar (no técnico), Suspender (motivo, modo, fechas), Reactivar, Solicitar baja (fecha, motivo, consulta de baja administrativa si OT), Baja efectiva, Anular, Desistir baja, Cambiar plan (comparador y efecto en período), Cambiar categoría (modo), Cambiar régimen de medición (fecha efectiva, motivo y evidencia; RF-CAT-114, HUE-AG-03), Cambiar clase/actividad/referencia, Trasladar domicilio, Transferir (asistente con deuda informativa y modo de adherentes), Marcar No facturar/Provisorio (motivo y vigencia). Cada modal muestra precondiciones incumplidas. | `frmTitulares` (btnModificacionCategoria, btnFacturarNoFac, btnBaja, btnFallecimiento), `frmTranferenciaCapital.Transferir_Servicios`, `frmTransferenciasCuenta` |
| PAN-CAT-17 | admin | `/admin/cat/bulk-operations` | `cat.masivos.ejecutar` | Trámites masivos: elegir operación, criterio o lista (importación Excel), simular, aprobar, seguir progreso, ver resultado por contrato, revertir. | `frmPTramites`, `clsTramites` (RN-06 §4.3), `frmRecategorizacion` (parte de contrato), `frmSegmentacion_Restablecer` |
| PAN-CAT-18 | admin / plataforma | `/admin/cat/copies` | `cat.copias.ejecutar` | Asistente de copia: origen (tenant/servicio/versión autorizados), destino, componentes, dependencias con mapeo, exclusiones fijas (lista visible), confirmar; seguimiento y resultado con pendientes. | — (nuevo) |
| PAN-CAT-19 | admin | `/admin/cat/equipment-loans` | `cat.comodatos.ver` | Equipos en comodato: por contrato y bandeja global de devoluciones pendientes/vencidas (serie, producto, titular, contrato, fecha de entrega, devolución prevista, estado). Acciones: asignar (con stock disponible del depósito), registrar devolución, marcar perdido, reemplazar; constancias. | `abm_Sersoc_Productos` |
| PAN-CAT-20 | admin | `/admin/cat/contracts/:id/members` | `cat.adherentes.ver` | **Reemplazado por PAN-SOC-01 y PAN-SOC-02 (M18, DEC-071, HUECO-TRV-01)**; la pestaña Miembros de PAN-CAT-14 enlaza a PAN-SOC-01. Texto original: Adherentes y beneficiarios: persona, vínculo, titular, alta/baja, cobertura desde, tarifa de adherente, credencial. Acciones: agregar (con control de repetidos), dar de baja, imprimir ficha/credencial; bandeja de fuera de rango y mayoría de edad. Alcance sensible para SAN/SAL. | `frmTitulares.btnBajaAdherentes`, `abm_Socios.ImprimirFichaAdherentes`, `abm_Vinculos` (catálogo en PER) |
| PAN-CAT-21 | pwa-socio | `/servicios/disponibles` | `cat.oferta.ver` | **Componente embebido en PAN-POR-31** (M19 es dueño de la ruta `/app/contratar` y de la composición; datos por API-CAT-49; HUE-SRV-04, HUECO-TRV-04). Oferta del tenant: cards por servicio con planes publicados (anatomía CNX), detalle del plan (características, requisitos, conceptos, promociones vigentes con fin), FAB "+" "Solicitar" abre modal de solicitud CRM. 3 skeleton cards; estado vacío "Tu cooperativa todavía no publicó servicios". | CoopOnline (alta desde portal) |
| PAN-CAT-22 | pwa-socio | `/servicios/mios` | `cat.misServicios.ver` | **Componente embebido en PAN-POR-29 y PAN-POR-30** (M19 es dueño de las rutas `/app/servicios` y `/app/servicios/:contractId`; datos por API-CAT-50; HUE-SRV-04, HUECO-TRV-04). Mis servicios: cards de contratos propios o representados con estado legible ("Activo", "Rehabilitación en trámite", "Baja solicitada"), plan, promociones y fecha de fin, equipos en comodato, últimas facturas (enlace COB). Acciones según canales del servicio: solicitar baja, suspensión, reactivación, cambio de plan (todas vía CRM). | CoopOnline |
| PAN-CAT-23 | landing | `/:tenantSlug/servicios` | `por.ofertas.ver` (pública; antes `public.ofertas.ver`, originalmente «público») | **Componente embebido en PAN-POR-02 y PAN-POR-03** (M19 es dueño de las rutas `/servicios` y `/servicios/:serviceCode` de la landing; datos por API-CAT-51; HUE-SRV-04, HUECO-TRV-04). Catálogo público de servicios y planes publicados, requisitos, cobertura (consulta por domicilio cuando TEC lo provea), botón "Quiero contratar" (registro simple) y acceso al botón de baja público (CRM). | Sitio web/CMS |
| PAN-CAT-24 | admin | `/admin/cat/dashboard` | `cat.servicios.ver` | Tablero: indicadores de sección 15 con filtros por servicio y período. | — |
| PAN-CAT-25 | admin | pestaña en PAN-CAT-14 (GAS, ELE; HUE-GAS-01) | `cat.contratos.editar` | Declaración jurada de artefactos por servicio según la plantilla PRM-CAT-110 (GAS: artefactos con potencia en kcal/h; ELE: artefactos eléctricos y vehículos eléctricos): grilla de artefactos con historia, plantilla de trámite DDJJ, carga desde portal si el tenant lo habilita (V2 44; presentación en PAN-POR-66), aceptación o rechazo con motivo. | `abm_Artefactos` |
| PAN-CAT-26 | admin | `/admin/cat/concessions` | `cat.servicios.configurar` | Concesiones y fuentes normativas por servicio con vigencia y verificación. | `CONCESIO` (ABM genérico) |
| PAN-CAT-27 | admin | `/admin/cat/bundles` | `cat.paquetes.ver` | Paquetes de prestaciones: planes incluidos, reglas de baja parcial, vigencia. | — (nuevo) |

## 11. API

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CAT-01 | GET | `/api/platform/cat/capabilities` | `cat.capacidades.ver` | Listar capacidades. | — |
| API-CAT-02 | POST | `/api/platform/cat/capabilities` | `cat.capacidades.crear` | Crear capacidad. | Sí (`Idempotency-Key`) |
| API-CAT-03 | PATCH | `/api/platform/cat/capabilities/:id` | `cat.capacidades.editar` | Editar ficha/esquema (nueva versión de esquema). | Sí |
| API-CAT-04 | GET | `/api/platform/cat/enablement` | `cat.habilitacion.ver` | Matriz tenants × capacidades. | — |
| API-CAT-05 | POST | `/api/platform/cat/tenants/:tenantId/capabilities/:capabilityId/enable` | `cat.habilitacion.configurar` | Habilitar (valida licencia). | Sí |
| API-CAT-06 | POST | `/api/platform/cat/tenants/:tenantId/capabilities/:capabilityId/disable` | `cat.habilitacion.configurar` | Deshabilitar (valida RN-CAT-003). | Sí |
| API-CAT-07 | GET | `/api/admin/cat/services` | `cat.servicios.ver` | Servicios del tenant. | — |
| API-CAT-08 | GET | `/api/admin/cat/services/:id` | `cat.servicios.ver` | Detalle con perfil vigente y borrador. | — |
| API-CAT-09 | POST | `/api/admin/cat/services` | `cat.servicios.configurar` | Crear servicio (desde cero o plantilla). | Sí |
| API-CAT-10 | POST | `/api/admin/cat/services/:id/versions` | `cat.versiones.crear` | Crear versión borrador. | Sí |
| API-CAT-11 | PATCH | `/api/admin/cat/services/:id/versions/:versionId` | `cat.versiones.crear` | Editar borrador (perfil y componentes). | Sí (`If-Match` versión) |
| API-CAT-12 | POST | `/api/admin/cat/services/:id/versions/:versionId/validate` | `cat.versiones.crear` | Ejecutar validaciones. | Sí |
| API-CAT-13 | POST | `/api/admin/cat/services/:id/versions/:versionId/simulate` | `cat.versiones.crear` | Simular primera factura (TAR/FAC). | Sí |
| API-CAT-14 | POST | `/api/admin/cat/services/:id/versions/:versionId/submit` | `cat.versiones.crear` | Enviar a revisión. | Sí |
| API-CAT-15 | POST | `/api/admin/cat/services/:id/versions/:versionId/approve` | `cat.versiones.aprobar` | Aprobar/rechazar. | Sí |
| API-CAT-16 | POST | `/api/admin/cat/services/:id/versions/:versionId/publish` | `cat.servicios.publicar` | Publicar o programar. | Sí |
| API-CAT-17 | POST | `/api/admin/cat/services/:id/offer` | `cat.servicios.publicar` / `cat.servicios.retirar` | Abrir/cerrar oferta, retirar con alcance. | Sí |
| API-CAT-18 | GET/POST/PATCH | `/api/admin/cat/products` | `cat.productos.ver` / `cat.productos.editar` (antes `cat.productos.*`; comodín solo admitido en plantillas de plataforma, T02) | Productos y subservicios. | POST/PATCH sí |
| API-CAT-19 | GET/POST/PATCH | `/api/admin/cat/concepts` | `cat.conceptos.ver` / `cat.conceptos.editar` (antes `cat.conceptos.*`; comodín solo admitido en plantillas de plataforma, T02) | Conceptos facturables. | POST/PATCH sí |
| API-CAT-20 | GET/POST/PATCH | `/api/admin/cat/plans` | `cat.planes.ver` / `cat.planes.editar` (antes `cat.planes.*`; comodín solo admitido en plantillas de plataforma, T02) | Planes. | Sí |
| API-CAT-21 | POST | `/api/admin/cat/plans/:id/versions` | `cat.planes.editar` | Nueva versión de plan. | Sí |
| API-CAT-22 | POST | `/api/admin/cat/plans/:id/discontinue` | `cat.planes.discontinuar` | Discontinuar plan. | Sí |
| API-CAT-23 | GET/POST/PATCH | `/api/admin/cat/bundles` | `cat.paquetes.ver` / `cat.paquetes.editar` (antes `cat.paquetes.*`; comodín solo admitido en plantillas de plataforma, T02) | Paquetes. | Sí |
| API-CAT-24 | GET/POST/PATCH | `/api/admin/cat/categories` | `cat.categorias.ver` / `cat.categorias.editar` (antes `cat.categorias.*`; comodín solo admitido en plantillas de plataforma, T02) | Categorías y grupos. | Sí |
| API-CAT-25 | GET/POST/PATCH | `/api/admin/cat/classes` | `cat.clases.ver` / `cat.clases.editar` (antes `cat.clases.*`; comodín solo admitido en plantillas de plataforma, T02) | Clases de servicio. | Sí |
| API-CAT-26 | GET/POST/PATCH | `/api/admin/cat/properties` | `cat.propiedades.ver` / `cat.propiedades.editar` (antes `cat.propiedades.*`; comodín solo admitido en plantillas de plataforma, T02) | Propiedades. | Sí |
| API-CAT-27 | GET/POST/PATCH | `/api/admin/cat/statuses` | `cat.estados.configurar` | Estados operativos. | Sí |
| API-CAT-28 | GET/POST/PATCH | `/api/admin/cat/event-charges` | `cat.conceptos.editar` | Conceptos por evento y bonificaciones. | Sí |
| API-CAT-29 | GET/POST/PATCH | `/api/admin/cat/auto-rules` | `cat.reglasAuto.configurar` | Reglas automáticas. | Sí |
| API-CAT-30 | POST | `/api/admin/cat/auto-rules/:id/simulate` | `cat.reglasAuto.configurar` | Simular regla. | Sí |
| API-CAT-31 | GET | `/api/admin/cat/contracts` | `cat.contratos.ver` | Buscar contratos (paginado). | — |
| API-CAT-32 | GET | `/api/admin/cat/contracts/:id` | `cat.contratos.ver` | Ficha; `?asOf=&dateKind=effective\|recorded`. | — |
| API-CAT-33 | POST | `/api/admin/cat/contracts` | `cat.contratos.crear` | Crear contrato (`requested`); devuelve todos los errores/advertencias. | Sí |
| API-CAT-34 | PATCH | `/api/admin/cat/contracts/:id` | `cat.contratos.editar` | Editar atributos no de estado (observaciones, referencias, atributos de dominio). | Sí (`If-Match`) |
| API-CAT-35 | POST | `/api/admin/cat/contracts/:id/commands/:command` | según comando (`cat.contratos.activar`, `.suspender`, `.reactivar`, `.solicitarBaja`, `.baja`, `.anular`, `.cambiarPlan`, `.cambiarCategoria`, `.cambiarRegimenMedicion`, `.transferir`, `.trasladar`, `.marcar`) | Ejecutar transición/cambio (`approve`, `requestFeasibility`, `activate`, `suspend`, `requestReactivation`, `reactivate`, `requestTermination`, `withdrawTermination`, `terminate`, `reopenTermination`, `cancel`, `changePlan`, `changeCategory`, `changeClass`, `changeActivity`, `changeReference`, `relocate`, `transfer`, `setFlag`, `changeMeteringRegime` con `{toRegime, effectiveAt, reason, evidenceDocId}` — HUE-AG-03). | Sí (`commandId`) |
| API-CAT-36 | GET | `/api/admin/cat/contracts/:id/history` | `cat.contratos.ver` | Historia. | — |
| API-CAT-37 | GET/POST | `/api/admin/cat/contracts/:id/equipment` | `cat.comodatos.ver` / `cat.comodatos.asignar` | Equipos del contrato; asignar. | POST sí |
| API-CAT-38 | POST | `/api/admin/cat/equipment-assignments/:id/return` | `cat.comodatos.devolver` | Registrar devolución/pérdida/reemplazo. | Sí |
| API-CAT-39 | GET | `/api/admin/cat/equipment-assignments?status=returnPending` | `cat.comodatos.ver` | Bandeja de devoluciones. | — |
| API-CAT-40 | GET/POST/PATCH | `/api/admin/cat/contracts/:id/members` | `cat.adherentes.ver` / `cat.adherentes.editar` (antes `cat.adherentes.*`; comodín solo admitido en plantillas de plataforma, T02) | **Reemplazado por API-SOC-001 a API-SOC-005 (M18, HUECO-TRV-01).** Texto original: Adherentes y beneficiarios. | Sí |
| API-CAT-41 | GET/POST/PATCH | `/api/admin/cat/contracts/:id/appliances` | `cat.contratos.editar` | DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); `GET .../appliances/template` devuelve la plantilla que M19 usa para armar el formulario. | Sí |
| API-CAT-42 | GET/POST/PATCH | `/api/admin/cat/contracts/:id/generation-agreement` | `cat.contratos.editar` | Vínculo de generación distribuida. | Sí |
| API-CAT-43 | GET/POST | `/api/admin/cat/contracts/:id/special-conditions` | `cat.contratos.editar` + `cat.versiones.aprobar` | Condiciones de grandes usuarios. | Sí |
| API-CAT-44 | POST | `/api/admin/cat/bulk-operations` | `cat.masivos.ejecutar` | Crear trámite masivo. | Sí |
| API-CAT-45 | POST | `/api/admin/cat/bulk-operations/:id/{simulate\|approve\|run\|revert}` | `cat.masivos.ejecutar` | Ciclo del trámite. | Sí |
| API-CAT-46 | POST | `/api/admin/cat/copies` | `cat.copias.ejecutar` | Solicitar copia entre tenants. | Sí |
| API-CAT-47 | POST | `/api/admin/cat/copies/:id/authorize-source` | `cat.copias.autorizarOrigen` | Autorización del tenant origen. | Sí |
| API-CAT-48 | GET | `/api/admin/cat/copies/:id` | `cat.copias.ejecutar` | Estado y pendientes. | — |
| API-CAT-49 | GET | `/api/cat/offers` | `cat.oferta.ver` | Oferta para la PWA (la consume el componente embebido en PAN-POR-31; HUE-SRV-04). | — |
| API-CAT-50 | GET | `/api/cat/my-contracts` | `cat.misServicios.ver` | Contratos propios/representados (componente embebido en PAN-POR-29/30; HUE-SRV-04). | — |
| API-CAT-51 | GET | `/api/public/:tenantSlug/cat/offers` | `por.ofertas.ver` (pública, con límite de tasa; antes `public.ofertas.ver`, originalmente «público (rate limit)») | Oferta pública de la landing (componente embebido en PAN-POR-02/03; HUE-SRV-04). | — |
| API-CAT-52 | GET | `/api/admin/cat/dashboard` | `cat.servicios.ver` | Indicadores. | — |
| API-CAT-53 | GET | `/api/admin/cat/concessions` y POST/PATCH | `cat.servicios.configurar` | Concesiones y fuentes normativas. | Sí |
| API-CAT-54 | GET | `/api/v1/ext/cat/contracts` | `bia.cat.contratos.ver` (token de tercero; antes `ext.cat.contratos.ver`, originalmente «token de tercero con alcance `cat.read`») | Contratos para APIs de terceros/BI (sin datos sensibles ni secretos). | — |
| API-CAT-55 | GET/POST | `/api/platform/cat/templates` | `cat.plantillas.ver` / `cat.plantillas.editar` (antes `cat.plantillas.*`; comodín solo admitido en plantillas de plataforma, T02) | Plantillas de servicio de plataforma (Adoptado DEC-026, PA-CAT-08). | Sí |
| API-CAT-56 | GET | `/api/admin/cat/reports/active-subscribers-by-package?serviceId=&cutoffDate=` | `cat.contratos.ver` (o credencial de servicio de M12) | Abonados activos por paquete a la fecha de corte (RF-CAT-116, REP-CAT-16): `{serviceId, cutoffDate, items[{serviceProductId, code, tvMinimumLineup, activeCount}], generatedAt}`. Consumidor: JOB-CMP-09 de M12. | Sí (GET; mismo resultado para la misma fecha de corte) |

Errores: RFC 9457 con `requestId`; validaciones de alta devuelven `errors[]` y `warnings[]` con `code` estable (`CAT_REQ_FEASIBILITY`, `CAT_SUPPLYCODE_DUP`, `CAT_SOCIAL_DUP`, `CAT_ADDRESS_DEBT`, `CAT_HOLDER_INACTIVE`, `CAT_BILLING_GROUP`, `CAT_GUARANTOR`, `CAT_TRANSITION_NOT_ALLOWED`…). Validación Zod compartida en `packages/shared/cat`.

## 12. Eventos y jobs

Todos los eventos se publican por outbox en la misma transacción que el cambio (T11 WFL), con `eventId`, `tenantId`, `occurredAt`, `effectiveAt`, `correlationId`, `actor`, `schemaVersion` y sin datos personales más allá de identificadores. Los IDs EVT-CAT-01 a EVT-CAT-25 son los que T11 §12.3 había asignado como provisionales; EVT-CAT-26 y EVT-CAT-27 cubren brechas detectadas en T11 §12.4. EVT-CAT-28 se agrega por HUE-AG-03. EVT-CAT-23 queda reemplazado por EVT-SOC-01 (HUECO-TRV-01).

### 12.1 Eventos emitidos

| EVT-ID | Evento | Cuándo | Payload mínimo | Consumidores |
|---|---|---|---|---|
| EVT-CAT-01 | `cat.tenantService.enabled` / `.disabled` | Habilitación de capacidad | `serviceId`, `capabilityId` | PLA, UXD (menú), POR |
| EVT-CAT-02 | `cat.tenantService.published` | Oferta abierta | `serviceId`, `configVersionId`, `effectiveFrom` | POR, landing, CRM, TAR |
| EVT-CAT-03 | `cat.tenantService.withdrawn` | Oferta cerrada / retiro | `serviceId`, `scope` | POR, CRM |
| EVT-CAT-04 | `cat.configVersion.published` | Versión vigente | `configVersionId`, `diffSummary` | TAR, FAC, MOR, TEC, CRM (caché de perfil) |
| EVT-CAT-05 | `cat.plan.published` / `.discontinued` | Ciclo del plan | `planId`, `planVersionId` | POR, CRM, TAR |
| EVT-CAT-06 | `cat.contract.requested` | T01 | `contractId`, `accountId`, `holderId`, `planVersionId`, `requestId` | CRM, TEC (si factibilidad) |
| EVT-CAT-07 | `cat.contract.feasibilityRequested` | T02 | `contractId`, `serviceAddress` | TEC |
| EVT-CAT-08 | `cat.contract.installationRequested` | T03/T05 técnico | `contractId`, `requirements`, `equipment` | TEC, STK |
| EVT-CAT-09 | `cat.contract.activated` | T06 | `contractId`, `effectiveStart`, `planVersionId`, `categoryId`, `billingGroupId`, `eventCharges[]` | FAC, TAR, MED, COB, CRM, PER (estado de socio), INS, CAT (altas automáticas) |
| EVT-CAT-10 | `cat.contract.suspended` | T08 | `contractId`, `reason`, `mode`, `effectiveAt` | FAC, TEC, MOR, CRM, POR |
| EVT-CAT-11 | `cat.contract.reactivationRequested` | T09 | `contractId` | TEC |
| EVT-CAT-12 | `cat.contract.reactivated` | T10/T11 | `contractId`, `effectiveAt`, `startDateRule` | FAC, MOR, CRM |
| EVT-CAT-13 | `cat.contract.terminationRequested` | T12 | `contractId`, `requestedAt`, `reason` | TEC, CRM |
| EVT-CAT-14 | `cat.contract.terminationWithdrawn` | Desiste baja | `contractId` | TEC, CRM |
| EVT-CAT-15 | `cat.contract.terminated` | T14 | `contractId`, `effectiveEnd`, `pendingEquipment[]` | FAC (factura final), MED, COB, PER, INS, CRM, CAT (cascada/altas) |
| EVT-CAT-16 | `cat.contract.cancelled` | T04/T13 | `contractId`, `reason` | CRM, TEC, STK |
| EVT-CAT-17 | `cat.contract.transferred` | T15 | `fromContractId`, `toContractId`, `mode` | FAC, COB, PER, MED, integraciones |
| EVT-CAT-18 | `cat.contract.planChanged` | Cambio de plan | `contractId`, `fromPlanVersionId`, `toPlanVersionId`, `validFrom` | TAR, FAC, TEC (reprovisión), POR |
| EVT-CAT-19 | `cat.contract.categoryChanged` | Cambio de categoría | `contractId`, `from`, `to`, `validFrom`, `mode` | TAR, FAC, FIS, CAT (altas) |
| EVT-CAT-20 | `cat.contract.addressChanged` | Traslado | `contractId`, `validFrom` | TEC, MED, FIS (jurisdicción), CAT (altas) |
| EVT-CAT-21 | `cat.contract.flagChanged` | Marcas No facturar / Provisorio / etc. | `contractId`, `flag`, `value`, `validTo` | FAC, TAR, MED |
| EVT-CAT-22 | `cat.contract.equipmentAssigned` / `.equipmentReturned` / `.equipmentLost` | Comodato | `assignmentId`, `contractId`, `inventoryItemId`, `serialUnitId` (antes `stockUnitId`, CTR-DAT-30) | STK, FAC (si cargo), CON (vía STK) |
| EVT-CAT-23 | `cat.contract.memberAdded` / `.memberRemoved` | **Reemplazado por EVT-SOC-01 `soc.dependent.*` (M18, HUECO-TRV-01); no se publica.** Texto original: Adherentes/beneficiarios | `contractId`, `memberId`, `role` | TAR (cargo adherente), FAC, SOC |
| EVT-CAT-24 | `cat.bulkOperation.completed` | Fin de trámite masivo | `operationId`, `counts` | Notificación al solicitante, TAR/MOR origen |
| EVT-CAT-25 | `cat.serviceCopy.completed` | Fin de copia | `copyRunId`, `pendingItems` | Plataforma, tenant destino |
| EVT-CAT-26 | `cat.serviceCopy.prepared` | Copia autorizada y validada, antes de escribir en el tenant destino | `copyRunId`, `sourceTenantId`, `targetTenantId`, `components[]` | T04 (crea el borrador de configuración del destino, si M02 no invoca su API) |
| EVT-CAT-27 | `cat.command.rejected` | Un comando recibido (por ejemplo, de M09 vía EVT-CRM-13) no se pudo ejecutar | `commandRequestId`, `command`, `contractId`, `errorCode`, `errors[]` | M09 (marca el comando `rejected` en el caso) |
| EVT-CAT-28 | `cat.contract.meteringRegimeChanged` | Comando `changeMeteringRegime` aceptado (RF-CAT-114, RN-CAT-078; HUE-AG-03) | `contractId`, `serviceId`, `fromRegime`, `toRegime`, `effectiveAt`, `meteringPointId` (si existe), `commandId` | M03 MED (a `metered`: crea el punto de medición, RF-MED-012; a `unmetered`: retiro con lectura final, RF-MED-022), M04 TAR (cambia la base de cálculo desde `effectiveAt`), M05 FAC, POR |

### 12.2 Eventos consumidos

| Evento | Productor | Efecto en CAT |
|---|---|---|
| `crm.commandRequest.requested` (EVT-CRM-13) | M09 CRM | Crea contrato `requested` (T01) con el comando `cat.contract.create` o ejecuta el comando pedido (baja, suspensión, cambio). Si no puede ejecutarlo publica EVT-CAT-27 `cat.command.rejected`. |
| `crm.case.cancelled` (EVT-CRM-11) | M09 CRM | Anula contrato no activado (T13) o desiste baja (T12 reversión). M02 lo consume aunque T11 no lo lista como consumidor (se informa a T11, 05-11-2026). |
| `tec.feasibility.verdictIssued` (EVT-TEC-02) | M10 TEC | T03 / T04. |
| `tec.visit.failed` (EVT-TEC-14) | M10 TEC | T07 (registro). |
| `tec.installation.activationConfirmed` (EVT-TEC-16) / `tec.provisioning.confirmed` (EVT-TEC-21) | M10 TEC | T06 / T10. |
| `tec.workOrder.closed` (EVT-TEC-07) | M10 TEC | Según `purpose`: activación, reconexión, desconexión, cambio de domicilio, cambio de categoría diferido. |
| `tec.workOrder.created` (EVT-TEC-04) | M10 TEC | Dispara reglas automáticas de evento OT. |
| `mor.interruption.approved` (EVT-MOR-12; el tipo, suspensión, reconexión o conversión a prepago, va en el payload) | M08 MOR | T08 / T09-T11 / trámite de cambio de plan o categoría a prepago. |
| `per.person.deceased` (EVT-PER-03) | M01 PER | Marca de fallecido; bloqueo de reconexión (RN-CAT-044); oculta miembros según PRM-CAT-063 (Reemplazado: lo hace M18 con PRM-SOC-007, HUECO-TRV-01); tarea de revisión de titularidad. |
| `per.person.identificationRegularized` (EVT-PER-27) | M01 PER | Refresca `serviceContracts.holderIdentifierSnapshot` de los contratos no terminados cuyo titular es esa persona: vuelve a pedir la foto a M01 (`per.getHolderSnapshot`) y la copia sin validarla ni reinterpretarla (`documentTypeId`, `number`, `verificationStatus` e `identificationStatus` pasan de `documentPending` a `identified` o `approvedException`); idempotente por `{personId, toStatus}`; no cambia el estado del contrato ni dispara reglas de evento. M05 sigue usando su propia foto a la fecha de prevalidación (RN-FAC-162) (DEC-099, 10-11-2026). |
| `per.account.created` (EVT-PER-11) | M01 PER | Reglas automáticas de evento "alta de cuenta". |
| `per.holder.closed` (EVT-PER-10) | M01 PER | Advertencia en contratos activos del titular. |
| `stk.equipment.retrieved` / `stk.equipment.swapped` (EVT-STK-05/06) | M13 STK | Cierra/actualiza asignación de comodato. |
| `stk.equipment.returnOverdue` (EVT-STK-07) | M13 STK | JOB-CAT-09 marca la devolución vencida en la ficha del contrato. |
| `fac.billingCycle.closed` (EVT-FAC-17) | M05 FAC | JOB-CAT-12 cuotas de obra. |
| `tec.levy.approved` (EVT-TEC-25) | M10 TEC | JOB-CAT-13 `cat:crear-contratos-obra`: crea un contrato de obra (tipo 17) por beneficiario con API-CAT-33, idempotente por obra + inmueble (RF-CAT-115, HUECO-OBR-01). |
| `tar.promotion.ended` (EVT-TAR-012) | M04 TAR | JOB-CAT-10 actualiza el tramo de condiciones del contrato. |
| `pla.capability.deactivated` (EVT-PLA-07) / `pla.license.updated` (EVT-PLA-08) | T01 PLA | Cierra oferta; abre plan de salida; no altera contratos sin decisión. |

## 13. Integraciones

| Integración | Dirección | Descripción | Regla |
|---|---|---|---|
| Aprovisionamiento de Internet (MikroTik / OLT / RADIUS) | Salida vía TEC | El plan define el perfil técnico (velocidad, VLAN, pool); TEC aprovisiona y confirma. | Credenciales en bóveda (T06); CAT solo referencia `secretRef`; nunca guarda contraseñas en claro (CTR-CAT-10). |
| Telemedición (prepago energía/agua, integradores tipo Discar) | Salida vía MED/TEC | Alta/baja/corte del medidor inteligente ligado al contrato. | Si falla, la OT no cierra y el contrato no cambia (RN-CAT-041). |
| Centrales de terceros de servicios fúnebres / salud (ex BATCOM) | Bidireccional, configurable | Envío de padrón de contratos y beneficiarios. | Servicio configurable por mapeo; no se fija un código de servicio en código (CTR-CAT-14). |
| Sistemas de gestión de expedientes / municipales (ex SITSA) | Entrada/salida | Tasas por cuenta de terceros y obras. | Mapeo de conceptos por convenio (FIS/TAR). |
| Sincronización de transferencias (ex AION) | Salida | Notificar transferencias de servicio a sistemas externos. | Por evento `cat.contract.transferred`; reintentos T06. |
| Padrones de tarifa social (nacionales/provinciales) | Entrada vía TAR | Importación de beneficiarios (por cuenta o DNI). | CAT marca categoría social; TAR aplica subsidio; trazabilidad de la fuente. |
| Reguladores / ENRE-ERSeP / ENACOM | Salida (reportes) | Códigos regulatorios de categoría y servicio. | CAT provee mapeo; reportes en el módulo regulatorio correspondiente. |
| APIs a terceros / BI | Salida | API-CAT-54 de solo lectura con alcance. | Sin datos sensibles, enmascarado de documentos, auditoría de consultas. |

Todas las integraciones usan el marco T06 (conector, credencial en bóveda, idempotencia, reintentos con backoff, DLQ, panel de salud).

## 14. Parámetros

Ámbitos: `plataforma`, `tenant`, `servicio` (dentro de la versión de configuración), `plan`. Todos los parámetros de ámbito `servicio` se versionan con la configuración (RN-CAT-007).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CAT-001 | `cat.service.exitPlanRequired` | bool | tenant | true | Exige plan de salida aprobado para cerrar operación con contratos vigentes. | — |
| PRM-CAT-002 | `cat.publish.dualApproval` | enum `always/productionOnly/never` | tenant | productionOnly | Aprobación por usuario distinto para publicar. | — |
| PRM-CAT-003 | `cat.publish.requireSimulation` | bool | tenant | true | Exige simulación de primera factura antes de publicar. | — |
| PRM-CAT-010 | `cat.req.activity` / `cat.req.class` / `cat.req.zsr` | enum `none/warn/require` | servicio | warn | Exigencia de actividad, clase y zona/sector/ruta en el alta. | RN-06 §3.2 |
| PRM-CAT-011 | `cat.req.uniqueParcel` | enum `none/warn/require` | servicio | require (medidos) | Unicidad de parcela/nomenclatura catastral por servicio. | 319 |
| PRM-CAT-012 | `cat.req.device` | enum `none/warn/require` | servicio | require (medidos) | Dispositivo (medidor) obligatorio para activar. | RN-06 §3.2 |
| PRM-CAT-013 | `cat.req.feasibility` | bool | servicio | true (INT, ELE, AG, GAS) | **Lectura derivada de PRM-TEC-024 `feasibility.required` (dueño M10, HUE-SRV-07)**: vale `true` cuando PRM-TEC-024 = `required`; CAT no lo edita. Texto original: Exige factibilidad aprobada. | 2050 |
| PRM-CAT-014 | `cat.req.guarantor` | bool | servicio | false | Exige garante. | RN-06 §3.2 |
| PRM-CAT-015 | `cat.req.installerCertificate` | enum `none/warn/require` | servicio | none (require GAS); `require` en ELE con jurisdicción Córdoba (Ley 10281) | **Lectura derivada de PRM-TEC-043 `workOrder.close.installerCertificate` (dueño M10, HUE-ELE-04)**; CAT no lo edita. Texto original: Exige número de certificado de instalador. | 2343 |
| PRM-CAT-016 | `cat.req.installerProfessionalAndDate` | bool | servicio | true | Si hay número de certificado, exige profesional y fecha. | 2529 |
| PRM-CAT-017 | `cat.req.addressDebtCheck` | enum `none/warn/supervisor` | servicio | warn | Control de deuda en el domicilio del servicio (PA-CAT-12). | 2482, 2668 |
| PRM-CAT-018 | `cat.req.addressDebtScope` | enum `sameService/allServices` | servicio | sameService | Universo de deuda consultada. | 2669 |
| PRM-CAT-019 | `cat.req.activeHolder` | bool | tenant | true | Impide alta a titular no activo/dado de baja. | 734, 741 |
| PRM-CAT-020 | `cat.supplyCode.allowDuplicate` | bool | servicio | false | Permite matrícula duplicada (si no es automática). | 2250 |
| PRM-CAT-021 | `cat.contract.allowSameServiceInAccount.metered` | bool | servicio | false | Dos contratos iguales en la misma cuenta (medidos). | 2269 |
| PRM-CAT-022 | `cat.contract.allowSameServiceInAccount.unmetered` | bool | servicio | true | Ídem no medidos (PA-CAT-11). | 2715 |
| PRM-CAT-023 | `cat.contract.supplyCodeAuto` | bool | servicio | true | Matrícula/número de suministro autogenerado por secuencia del servicio. | 213 |
| PRM-CAT-024 | `cat.contract.copyAddressFromAccount` | bool | servicio | true | Propone el domicilio de la cuenta como domicilio del servicio. | 343 |
| PRM-CAT-025 | `cat.contract.billingGroupDefault` | ref | servicio | — | Grupo de facturación por defecto del servicio. | 573, 2329 |
| PRM-CAT-026 | `cat.contract.defaultList.activeOnly` | bool | tenant | true | Listado de contratos muestra solo activos por defecto. | 2321 |
| PRM-CAT-027 | `cat.contract.search.fuzzySupplyCode` | bool | tenant | true | Búsqueda aproximada por matrícula. | 3108 |
| PRM-CAT-030 | `cat.category.socialPriority` | lista ordenada | servicio | `retiree, mainAccount, oldest` | Prioridad cuando hay varias categorías sociales candidatas; además impide dos sociales por persona. | 2740, 2435 |
| PRM-CAT-031 | `cat.recat.excludeTerminatedOlderThanDays` | int | servicio | 60 | Recategorización excluye bajas con antigüedad mayor. | 2825 |
| PRM-CAT-032 | `cat.recat.includeDisconnected` | bool | servicio | false | Recategorización incluye desconectados. | 3155 |
| PRM-CAT-033 | `cat.category.requireRegulatoryCode` | bool | servicio | false (true ELE) | Exige código regulatorio en categorías. | 2461, 2462 |
| PRM-CAT-040 | `cat.billing.billableStates` | lista | servicio | `active, pendingTermination` | Estados canónicos que devengan cargos fijos (suspensión configurable). | RN-06 §4.1 |
| PRM-CAT-041 | `cat.ot.blockCloseOnTelemetryError` | bool | servicio | true | La OT no cierra si falla la telemedición. | 2532 |
| PRM-CAT-042 | `cat.reconnect.keepPreviousStart` | bool | servicio | true (no medidos) | En reconexión restaura la fecha de alta anterior. | 2707 |
| PRM-CAT-043 | `cat.reconnect.allowDeceasedHolder` | bool | tenant | false | Permite reconectar a titular fallecido. | 2301 |
| PRM-CAT-044 | `cat.category.changeMode` | enum `immediate/scheduled/onWorkOrderClose` | servicio | immediate | Momento de aplicación del cambio de categoría. | 2330, 2455 |
| PRM-CAT-045 | `cat.category.changeRequiresWorkOrder` | bool | servicio | false | Cambio de categoría genera OT. | 2455 |
| PRM-CAT-046 | `cat.category.prorateCutoffDay` | int (1-31) | servicio | 15 | Día límite para cobro proporcional. | 2755 |
| PRM-CAT-047 | `cat.termination.reopenWindowDays` | int | servicio | 0 | Días para reabrir una baja sin factura final emitida. | — |
| PRM-CAT-048 | `cat.termination.askAdministrativeOnWorkOrder` | bool | servicio | true | Consultar si generar baja administrativa al crear OT de baja. | 2545 |
| PRM-CAT-049 | `cat.activation.cancelWorkOrderToCancelled` | bool | servicio | true | Eliminar OT de alta pasa el contrato a Anulado. | 2753 |
| PRM-CAT-050 | `cat.autoRules.defaultMode` | enum `propose/create` | tenant | propose | Modo por defecto de reglas automáticas (PA-CAT-04). | 2550, 2571 |
| PRM-CAT-051 | `cat.transfer.keepOriginalStartDate` | bool | servicio | false | Mantiene fecha de alta original en transferencia. | 2541, 422 |
| PRM-CAT-052 | `cat.transfer.membersMode` | enum `all/activeOnly/none` | servicio | activeOnly | Copia de adherentes al transferir. | 2291 |
| PRM-CAT-053 | `cat.transfer.allowTerminated` | bool | servicio | false | Transferencia de contratos dados de baja. | 2599 |
| PRM-CAT-054 | `cat.transfer.markDestinationMain` | bool | tenant | false | Marca la cuenta destino como principal. | 3195 |
| PRM-CAT-055 | `cat.relocation.requiresWorkOrder` | bool | servicio | true (técnicos) | Traslado de domicilio por OT. | RN-06 §8 |
| PRM-CAT-056 | `cat.transfer.chargeConcept` | ref concepto | servicio | — | Concepto por evento de transferencia. | 3194 |
| PRM-CAT-060 | `cat.members.cascadeOnDisconnect` | enum `cascade/ask/none` | servicio | ask | **Reemplazado por PRM-SOC-004 y PRM-SOC-005 (M18, HUECO-TRV-01).** Texto original: Efecto sobre miembros al dar de baja/desconectar. | 2401 |
| PRM-CAT-061 | `cat.members.adultAgeNotice` | int | servicio | 21 | **Reemplazado por PRM-SOC-009 (M18, HUECO-TRV-01).** Texto original: Edad que dispara aviso de mayoría de edad. | 3186 |
| PRM-CAT-062 | `cat.members.adultAgeEmail` | bool | servicio | false | **Reemplazado por PRM-SOC-010 y PRM-SOC-011 (M18, HUECO-TRV-01).** Texto original: Aviso por correo además de bandeja. | 3187 |
| PRM-CAT-063 | `cat.members.hideDeceased` | bool | servicio | true | **Reemplazado por PRM-SOC-007 (M18, HUECO-TRV-01).** Texto original: Oculta miembros fallecidos en la ficha. | 3058 |
| PRM-CAT-064 | `cat.members.allowDuplicateInService` | bool | servicio | false | **Reemplazado por PRM-SOC-002 (M18, HUECO-TRV-01).** Texto original: Permite el mismo adherente en dos titulares. | 2400 |
| PRM-CAT-065 | `cat.members.askMoveFromOtherHolder` | bool | servicio | true | **Reemplazado por PRM-SOC-003 (M18, HUECO-TRV-01).** Texto original: Consulta si dar de baja del otro titular. | 2521 |
| PRM-CAT-066 | `cat.members.maxPerContract` | int | plan | 0 (sin límite) | **Reemplazado por el plan de cobertura de M18 (RF-SOC-001, cantidad máxima de adherentes; HUECO-TRV-01).** Texto original: Máximo de adherentes por contrato. | 2522 |
| PRM-CAT-067 | `cat.members.waitingPeriodDays` | int | plan | 0 | **Reemplazado por PRM-SOC-013 (M18, HUECO-TRV-01).** Texto original: Carencia para cobertura. | 2535 |
| PRM-CAT-070 | `cat.flags.noBill.maxDays` | int | servicio | 90 | Vigencia máxima de "No facturar" (obligatoria). | 2303 |
| PRM-CAT-071 | `cat.flags.provisional.maxDays` | int | servicio | 180 | Vigencia de "Provisorio" (PA-CAT-09). | 2710 |
| PRM-CAT-072 | `cat.termination.withPendingInstallments` | enum `allow/supervisor` | servicio | supervisor | Baja con cuotas pendientes de financiación/obra/vivienda. | 2316 |
| PRM-CAT-073 | `cat.flags.readingFactor.enabled` | bool | servicio | false | Habilita lectura con factor (MED aplica). | 2477 |
| PRM-CAT-074 | `cat.flags.portalOrigin.track` | bool | tenant | true | Registra "alta desde CoopOnline/PWA". | 2738 |
| PRM-CAT-080 | `cat.related.readingsFromService` | ref servicio | servicio | — | Servicio relacionado del que se toman lecturas (y si solo no facturadas). | 2701, 3143 |
| PRM-CAT-081 | `cat.billing.splitByService` | bool | servicio | false | Factura separada por servicio. | 2642, 3135 |
| PRM-CAT-082 | `cat.billing.noConsumptionCharge` | bool | servicio | false | Genera cargo fijo sin consumo. | 2465 |
| PRM-CAT-083 | `cat.billing.minimumOnSuspension` | bool | servicio | false | Factura mínimo durante suspensión. | 2797 |
| PRM-CAT-090 | `cat.tel.freeCallsZeroRate` | bool | servicio (TEL) | true | Llamadas gratuitas a costo cero. | 2514 |
| PRM-CAT-091 | `cat.tel.cppConcept` | ref concepto | servicio (TEL) | — | **Solo lectura: Reemplazado por PRM-TAR-081 `tar.phone.cppConceptId` (dueño M04, RN-TAR-083; HUE-TEL-03).** CAT muestra el valor de M04 en la ficha del servicio. Texto original: Concepto para llamadas CPP. | 19 |
| PRM-CAT-092 | `cat.tel.internationalConcept` | ref concepto | servicio (TEL) | — | **Solo lectura: Reemplazado por PRM-TAR-082 `tar.phone.internationalConceptId` (dueño M04, RN-TAR-083; HUE-TEL-03).** Texto original: Concepto para llamadas internacionales. | 24 |
| PRM-CAT-093 | `cat.equipmentDefaultModality` (alias aceptado: `cat.int.equipmentDefaultModality`) | enum `loan/sale/rent/own` | servicio (todo servicio con equipos: INT, TV, TEL y los que el tenant habilite) | `loan` en INT y TV (DEC-013); sin valor en servicios sin equipos | Modalidad por defecto de equipos (PA-CAT-10); generalizado a ámbito servicio por HUE-TV-02. Texto original: clave `cat.int.equipmentDefaultModality`, ámbito servicio (INT), default loan. | 2581-2584 |
| PRM-CAT-094 | `cat.int.equipmentReturnDays` | int | servicio | 15 | Plazo de devolución tras la baja. | 2253 |
| PRM-CAT-095 | `cat.tv.decodersPerContract` | int | plan (TV) | 1 | Decodificadores incluidos. | 2708 |
| PRM-CAT-096 | `cat.affidavit.requireBeforeActivation` (alias aceptado: `cat.gas.requireApplianceAffidavit`) | bool | servicio (GAS, ELE y los que tengan plantilla PRM-CAT-110) | true en GAS; false en ELE | DDJJ de artefactos obligatoria antes de habilitar; generalizado a todo servicio con plantilla de DDJJ por HUE-GAS-01. Texto original: clave `cat.gas.requireApplianceAffidavit`, ámbito servicio (GAS). | 44, 59, 75, 109 |
| PRM-CAT-097 | `cat.cem.plotRequired` | bool | servicio (CEM) | true | Parcela/nicho obligatorio. | 3152 |
| PRM-CAT-098 | `cat.voluntarySuspension.enabled` | bool | servicio | false | Admite suspensión voluntaria (PA-CAT-14). | — |
| PRM-CAT-099 | `cat.voluntarySuspension.maxDays` | int | servicio | 90 | Duración máxima. | — |
| PRM-CAT-100 | `cat.plan.changeEffective` | enum `immediate/nextCycle/date` | servicio | nextCycle | Fecha efectiva de cambio de plan (PA-CAT-15). | — |
| PRM-CAT-101 | `cat.plan.minStayMonths` | int | plan | 0 | Permanencia mínima (si la normativa lo permite; nunca bloquea la baja). | — |
| PRM-CAT-102 | `cat.sale.publicCancelButton` | bool | tenant | true | Muestra acceso al botón de baja en landing/PWA (CRM ejecuta). | — |
| PRM-CAT-103 | `cat.copy.requireSourceConsent` | bool | plataforma | true | Copia exige consentimiento del tenant origen (PA-CAT-07). | — |
| PRM-CAT-104 | `cat.bulk.batchSize` | int | plataforma | 1000 | Tamaño de lote de trámites masivos. | — |
| PRM-CAT-105 | `cat.bulk.revertWindowDays` | int | tenant | 7 | Ventana de reversión de trámites masivos. | — |
| PRM-CAT-106 | `cat.categories.maxSocialPerPerson` | int | servicio | 1 | Máximo de contratos con categoría social por persona. | 2435 |
| PRM-CAT-107 | `cat.activation.requireEquipmentAssigned` | bool | servicio | true (INT, TV) | Exige equipo obligatorio asignado para activar. | 2582 |
| PRM-CAT-108 | `cat.services.mainServiceForMembership` | ref servicio | tenant | — | Servicio cuyo contrato activo sostiene la condición de asociado (lo consume PER/SOC). | 206, 2742 |
| PRM-CAT-109 | `cat.contract.observationsMaxLength` | int | tenant | 2000 | Longitud de observaciones (texto libre sin datos sensibles). | 3108 |
| PRM-CAT-110 | `cat.affidavit.template` | ref plantilla (`gasAppliances` / `electricAppliances` / `electricAppliancesAndVehicles` / ninguna) | servicio | `gasAppliances` en GAS; `electricAppliancesAndVehicles` en ELE; ninguna en el resto | Plantilla de DDJJ del servicio que M19 usa para armar el formulario (RF-CAT-095, RF-POR-069): campos, unidad de potencia (kcal/h en GAS, W en artefactos eléctricos, kW en cargadores de vehículos eléctricos) y obligatoriedad (HUE-GAS-01). | 44, 59, 75 |
| PRM-CAT-111 | `cat.alu.billingModel` | enum `accessoryContract/taxRuleOnEle` | tenant | `accessoryContract` | Criterio de cobro del alumbrado: contrato ALU accesorio tipo 6 vinculado al ELE, o regla de tipo impuesto `tasa_alumbrado` de M04 sobre el ELE (RF-TAR-057). RN-CAT-076 impide ambos sobre el mismo ELE (HUE-ALU-02). | — |
| PRM-CAT-112 | `cat.gas.bottledVariantEnabled` | bool | tenant | false | Habilita la variante gas envasado como venta con stock (M13) y entrega (M10), sin medidor ni corrección (PA-CAT-17, HUE-GAS-02). | — |
| PRM-CAT-113 | `cat.tic.mailAndSmsEnabled` | enum `none/mail/sms/both` | tenant | `none` | Habilita correo electrónico y pack SMS como servicios de M02 con aprovisionamiento por T06 y cupo/consumo (PA-CAT-19, HUECO-OTR-03). | — |

Parámetros V2 delegados (no se definen aquí): 340, 337 (PER, titularidad y cuentas); 3112, 3113 (MOR, reconexión automática y cargos); 2464, 2540, 2750, 3148 (MED, lecturas y medidores); 2443, 2787 (FAC/TAR, facturación de conceptos); 2395, 2679 (VEN/STK, venta de productos); 3116, 3170, 3034, 2713, 2264 (INT/T06, integraciones); 2399 (TEC, OT); 413-419 y 2527 (SOC, servicios sociales y donantes, solo filtro administrativo CTR-CAT-20); 73, 2636 (INS, capital social). 2286 se descarta (dependía del borrado físico en transferencias).

## 15. Reportes e indicadores

Corte temporal según AGR-022: toda métrica se calcula "a fecha efectiva" (por defecto) o "a fecha de registro", y se indica en el encabezado.

| ID | Nombre | Fórmula | Universo | Dimensiones |
|---|---|---|---|---|
| REP-CAT-01 | Contratos por estado | `count(contracts)` agrupado por estado canónico y operativo al corte | Contratos del tenant no `cancelled` | Servicio, plan, categoría, zona, sucursal |
| REP-CAT-02 | Altas netas | `activaciones(período) − bajas efectivas(período)` | Eventos T06 y T14 en el período | Servicio, plan, canal |
| REP-CAT-03 | Tasa de baja (churn) | `bajas efectivas(período) / activos al inicio` | Contratos activos al inicio | Servicio, plan, motivo |
| REP-CAT-04 | Tiempo de solicitud a activación | Mediana y p90 de `effectiveStart − requestedAt` | Contratos activados en el período | Servicio, zona, etapa (factibilidad, instalación) |
| REP-CAT-05 | Embudo de alta | `requested → feasibility → pendingInstallation → active` con conversión y anulaciones por etapa | Contratos creados en el período | Servicio, canal |
| REP-CAT-06 | Suspendidos | `count(suspended)` por motivo y antigüedad | Contratos `suspended` al corte | Motivo, modo, servicio |
| REP-CAT-07 | Equipos en comodato | Entregados, pendientes de devolución, vencidos, perdidos | Asignaciones del tenant | Producto, zona, antigüedad |
| REP-CAT-08 | Contratos por plan y versión | `count(active)` por `planVersionId` | Activos al corte | Plan, versión (detecta versiones discontinuadas con contratos) |
| REP-CAT-09 | Promociones por finalizar | Contratos con promoción que termina en los próximos N ciclos | Activos con promoción | Plan, promoción |
| REP-CAT-10 | Adherentes y beneficiarios (Reemplazado por RF-SOC-027 de M18, HUECO-TRV-01) | Total, altas, bajas, fuera de rango de edad | Miembros vigentes | Servicio, vínculo |
| REP-CAT-11 | Marcas de excepción | Contratos con No facturar / Provisorio / lectura con factor, vencidos y por vencer | Contratos con marca vigente | Marca, servicio, usuario que marcó |
| REP-CAT-12 | Altas automáticas | Propuestas, aceptadas, rechazadas, creadas | Ejecuciones de reglas | Regla, servicio |
| REP-CAT-13 | Socios con varios servicios | Distribución de cantidad de servicios activos por titular | Titulares con contratos activos | Combinación de servicios |
| REP-CAT-14 | Auditoría de configuración | Versiones publicadas, cambios por usuario, aprobaciones | Versiones del período | Servicio, aprobador |
| REP-CAT-15 | Padrón regulatorio por categoría | `count(active)` por código regulatorio | Activos ELE/AG/GAS/TEL | Código regulatorio, jurisdicción |
| REP-CAT-16 | Abonados activos por paquete a fecha de corte (RF-CAT-116) | `count(contratos en active o suspended-restricted con el paquete en agreedConditions vigentes a la fecha de corte)` | Contratos del servicio a la fecha de corte, reconstruidos desde la historia | Servicio, paquete, fecha de corte, zona |

Las exportaciones respetan enmascarado de documentos y alcances (T02); los reportes con datos de salud (SAN/SAL) requieren capability adicional.

## 16. Casos de uso

| CU | Nombre | Actor | Flujo resumido | Resultado |
|---|---|---|---|---|
| CU-05 (BASE) | Configurar y publicar un servicio | Administrador del tenant | 9.1 | Servicio publicado con versión vigente. |
| CU-CAT-01 (BASE) | Habilitar capacidades a un tenant | Operador de plataforma | PAN-CAT-02: elige tenant, capacidad, fecha; valida licencia; confirma | `tenantService` habilitado sin oferta. |
| CU-COP-01 (BASE) | Copiar un servicio de A a B | Operador + admin B | 9.6 | Borrador en B con pendientes; A intacto. |
| CU-PRO-01 (BASE; anexo dueño según PA-CAT-20; M04 y M11 citan su parte) | Contratar Internet (piloto) | Ana (socia), comercial, técnico | 9.2 | Contrato activo, comodato registrado, facturación iniciada. |
| CU-SOL-01 (BASE, parte CAT) | Solicitud de alta por portal (definición en M09 §16, anexo dueño; aquí la parte CAT) | Socio | PAN-CAT-21 (embebido en PAN-POR-31) → CRM → T01 | Contrato `requested` vinculado a la solicitud. |
| CU-CIC-01 (BASE, parte CAT) | Ciclo de vida del contrato (definición en M08 §16, anexo dueño según PA-MOR-21 y PA-CAT-20; aquí la parte CAT) | Varios | 9.3 | Transiciones auditadas. |
| CU-CAT-13 (antes CU-MER-01; el CU-MER-01 de BASE lo define M03 §16, PA-CAT-20) | Ofrecer servicio a un mercado nuevo (no socio) | Comercial | Alta con titular no asociado si el perfil lo admite (`holderRules.requiresMember=false`) | Contrato sin condición de socio. |
| CU-ESP-ELE (BASE) | Alta de suministro eléctrico con medidor y GD | Comercial, técnico | Factibilidad → OT de conexión → medidor (MED) → T06; vínculo GD opcional | Suministro activo con categoría regulatoria. |
| CU-ESP-AG (BASE) | Alta de agua con conexión | Comercial, técnico | Igual ELE, con parcela única | Conexión activa. |
| CU-ESP-GAS (BASE) | Alta de gas con DDJJ de artefactos | Comercial, gasista matriculado, técnico | Certificado de instalador → DDJJ → inspección → T06 | Servicio habilitado con artefactos registrados. |
| CU-ESP-CEM (BASE, parte CAT) | Contratar parcela de cementerio parque (definición en M18 §16, anexo dueño según PA-CAT-20; aquí la parte de contratación) | Comercial | Alta con parcela/nicho (PRM-CAT-097), financiación, beneficiarios | Contrato con cuotas (FAC) y beneficiarios. |
| CU-ESP-SAN (BASE, parte CAT) | Adhesión a banco de sangre (definición en M18 §16, anexo dueño según PA-CAT-20; aquí la parte de contratación) | Comercial | Alta administrativa con convenio (PA-CAT-06) | Contrato y beneficiarios; sin datos clínicos. |
| CU-CAT-02 | Dar de baja un contrato | Socio / comercial / técnico | Solicitud CRM (botón de baja) → T12 → OT → T14; equipos a devolución | Baja efectiva sin bloqueo por deuda. |
| CU-CAT-03 | Suspender y reactivar por mora | MOR, técnico | `mor.interruption.approved` (EVT-MOR-12) → T08; pago → T09 → T10 | Servicio restablecido con regla de fecha. |
| CU-CAT-04 | Cambiar de plan | Socio / comercial | 9.4 | Nuevo tramo de condiciones con fecha efectiva. |
| CU-CAT-05 | Recategorización masiva | Responsable comercial | 9.8 | Contratos recategorizados con historia, reversibles. |
| CU-CAT-06 | Transferir un servicio | Supervisor | 9.5 | Contrato nuevo en destino, original `superseded`. |
| CU-CAT-07 | Registrar y devolver equipo en comodato | Técnico / comercial | PAN-CAT-19 | Equipo trazable en STK y contrato. |
| CU-CAT-08 | Administrar adherentes (Reemplazado por M18, PAN-SOC-01; HUECO-TRV-01) | Comercial | PAN-CAT-20 (Reemplazado por PAN-SOC-01) | Miembros vigentes con controles. |
| CU-CAT-09 | Configurar alta automática | Administrador | PAN-CAT-11 con simulación | Regla vigente. |
| CU-CAT-10 | Marcar contrato como No facturar | Supervisor | PAN-CAT-16 con motivo y vigencia | Marca con vencimiento; bandeja. |
| CU-CAT-11 | Consultar mis servicios | Socio | PAN-CAT-22 (embebido en PAN-POR-29/30, HUE-SRV-04) | Visión de contratos, equipos y promociones. |
| CU-CAT-12 | Retirar un servicio de la oferta | Administrador | PAN-CAT-03 con alcance (PA-CAT-03) | Oferta cerrada; contratos vigentes intactos o plan de salida. |

## 17. Criterios de aceptación y escenarios

### 17.1 Escenarios obligatorios (ESC de la guía)

| ESC | Escenario | Dado / Cuando / Entonces |
|---|---|---|
| ESC-01 | Piloto Internet extremo a extremo | Dado TEN-001 con INT publicado y plan "Fibra 100", cuando Ana solicita por la PWA, TEC aprueba factibilidad, instala con ONT en comodato y confirma provisión, entonces el contrato pasa `requested → feasibility → pendingInstallation → active`, existe asignación `delivered`, se emite `cat.contract.activated` una sola vez y FAC inicia el devengamiento. |
| ESC-02 | Copia entre tenants | Dado INT v1 en TEN-001, cuando se copia a TEN-002 con consentimiento, entonces TEN-002 tiene borrador con `copiedFrom`, sin contratos, sin credenciales ni precios de A (pendientes de TAR), y cambiar A después no altera B. |
| ESC-03 | Hermanos en el mismo domicilio | Dados dos titulares (A y B) en DIR-CASA-001, cuando ambos contratan INT, entonces existen dos contratos independientes; la deuda de A no bloquea a B (solo advertencia si PRM-CAT-017=warn) ni se traslada. |
| ESC-04 | Baja sin trabas | Cuando un socio con deuda pide la baja por el botón público, entonces CRM la admite, CAT ejecuta T12 sin cargo ni bloqueo, y la deuda queda en COB. |
| ESC-05 | Reactivación gratuita vs. arancelada | Dado SUS-DEMO-GRATIS (sin cargo) y REACT-DEMO-ARANCEL (deshabilitado por política MOR), cuando se reactiva, entonces solo se genera concepto tipo 4 si la política MOR lo habilita. |

### 17.2 Criterios funcionales

1. Ninguna solicitud del socio activa por sí sola un contrato (T01 siempre crea `requested`); intentar `activate` sin precondiciones devuelve `CAT_TRANSITION_NOT_ALLOWED` con la lista de precondiciones incumplidas.
2. Toda transición genera una fila en `serviceContractHistory` con actor, motivo, `effectiveAt` y `recordedAt`; consulta `asOf` reconstruye el estado al día.
3. Publicar una versión con validaciones bloqueantes devuelve 422; con advertencias exige confirmación explícita y la registra.
4. Cambiar el precio de un plan no se hace en CAT: la pantalla de plan redirige a TAR y la versión del plan solo referencia `tariffBinding`.
5. Un contrato terminado no se reactiva (solo nueva alta o `reopenTermination` en ventana).
6. El alta valida todos los requisitos y devuelve todos los errores y advertencias en una única respuesta.
7. El estado operativo mostrado siempre corresponde a un canónico; no se puede configurar un operativo sin mapeo.
8. Marcas "No facturar" y "Provisorio" no se pueden guardar sin vigencia.
9. Los valores `1901-01-01` no existen: fechas no informadas son `null`.
10. La transferencia nunca borra el contrato origen.

### 17.3 Permisos negativos

| Caso | Resultado esperado |
|---|---|
| Comercial de mostrador intenta `suspend` | 403 `cat.contratos.suspender` requerido. |
| Admin de TEN-002 consulta contrato de TEN-001 por ID | 404 (no revela existencia). |
| Operador de plataforma abre ficha de contrato de un tenant | 403; plataforma solo ve configuración. |
| Socio consulta contrato de otro titular desde PWA | 404; solo propios o representados vigentes. |
| Usuario sin capability de salud abre beneficiarios de SAN | Datos sensibles ocultos; acceso auditado. |
| Mismo usuario crea y aprueba una versión en producción | Rechazado si PRM-CAT-002 lo exige. |
| Responsable comercial intenta editar clase fiscal de concepto | 403 `cat.conceptos.configurarFiscal`. |

### 17.4 Aislamiento de tenant

- Todas las colecciones tienen `tenantId` primero en índices; consultas sin `tenantId` fallan en el repositorio (T01 PLA).
- La copia entre tenants es la única operación que lee configuración de otro tenant y lo hace con autorización registrada; nunca copia contratos, personas, deuda, credenciales ni documentos.
- Eventos llevan `tenantId` y los consumidores rechazan eventos de otro tenant.

### 17.5 Reintentos e idempotencia

- Comandos con `commandId`/`Idempotency-Key`: repetir devuelve el mismo resultado sin duplicar transición ni evento.
- Recibir dos veces `tec.installation.activationConfirmed` (EVT-TEC-16) no duplica la activación ni los conceptos por evento (inbox con `eventId`).
- Trámites masivos reanudables; un contrato que falla no aborta el lote.
- Altas automáticas idempotentes por `(eventId, ruleId)`.

### 17.6 No funcionales

- Búsqueda de contratos p95 < 800 ms con 200 000 contratos por tenant.
- Ficha de contrato p95 < 1,5 s incluyendo bloques de otros módulos (carga diferida).
- Trámite masivo de 50 000 contratos < 30 min.
- Accesibilidad WCAG 2.1 AA en PWA y landing; textos por `dict:`.

## 18. Precarga de demostración (datos ficticios)

Todos los datos son inventados; ningún nombre, documento, domicilio ni importe proviene de bases reales. Importes en ARS solo para simulación (los precios reales los define TAR).

Este es el **seed único del catálogo** para el recorrido de los ocho servicios (INT, TEL, TV, ELE, AG, CLO, GAS, ALU) de T12 (HUE-SRV-05). M04 reutiliza los valores de INT-100 (abono ARS 15.000 e instalación ARS 20.000) y los demás anexos citan estos códigos en lugar de definir los suyos.

| Código | Tipo | Contenido |
|---|---|---|
| TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte") | Tenant | Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) |
| TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur") | Tenant | Capacidad INT habilitada, sin oferta (destino de copia). |
| INT | Servicio | Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. |
| INT-100 "Fibra 100" | Plan | 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción **PROMO-INT-50x3** es 50 % sobre el **abono** durante 3 ciclos; la instalación (ARS 20.000, una sola vez) no tiene descuento. Con activación el 21/11/2026, el primer comprobante del ejemplo de M04 (9.3.9, ESC-TAR-03) es ARS 30.000,00 neto: fracción de noviembre 5.000,00 − 2.500,00 + diciembre 15.000,00 − 7.500,00 + instalación 20.000,00. |
| INT-300 "Fibra 300" | Plan | 300/100 Mbps; abono ficticio ARS 22.000. |
| ELE-RES | Categoría | Residencial con código regulatorio ficticio R1. |
| ELE-RES-SOC | Categoría | Residencial social (`isSocial=true`). |
| AG-RES | Categoría | Agua residencial. |
| CLO-RES | Categoría | Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). |
| GAS-RES | Categoría | Gas natural residencial (capacidad habilitada en TEN-001; demo de DDJJ con plantilla `gasAppliances`, PRM-CAT-110). |
| ALU-MUN | Plan | Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio `accessoryContract` (PRM-CAT-111) y reclamos atendidos por la cooperativa (HUE-SRV-05). |
| TEL-BAS | Plan | Línea básica con conceptos CPP e internacional. |
| TV-BAS | Plan | Grilla básica, 1 decodificador. |
| SOC-FAM | Plan | Sepelio familiar con adherentes, carencia 90 días. |
| CEM-PAR | Plan | Parcela cementerio parque en 24 cuotas ficticias. |
| SAN-CONV | Plan | Banco de sangre por convenio CONV-SAN-DEMO (solo administrativo). |
| Ana Demo (DNI ficticio 00000001) | Titular | Socia de TEN-001 para ESC-01. |
| Hermano A / Hermano B | Titulares | Contratos INT-H-A-001 e INT-H-B-001 en DIR-CASA-001 (ESC-03); A con deuda ficticia. |
| BAJA-DEMO | Contrato | INT activo con deuda ficticia para ESC-04. |
| SUS-DEMO-GRATIS | Contrato | INT suspendido por mora con reactivación sin cargo. |
| REACT-DEMO-GRATIS / REACT-DEMO-ARANCEL | Política | Reconexión gratuita (activa) / arancelada (deshabilitada) en MOR para ESC-05. |
| COP-DEMO-001 | Copia | Plantilla de corrida de copia TEN-001 → TEN-002. |
| PAR-DEMO-001 | Regla automática | Alta de SEP propuesta al activar ELE (modo `propose`). |
| ONT-DEMO-0001..0010 | Unidades de stock | ONT ficticias en el depósito demo (STK). |

La precarga se ejecuta con `pnpm seed:demo` por tenant y es idempotente por código.

## 19. Migración desde ProCoop

### 19.1 Mapeo de tablas

| Origen ProCoop | Destino CoopApps | Transformación | Conciliación |
|---|---|---|---|
| `SERVICIO`, `SERVICIO_EXTRAS` | `tenantServices` + `serviceConfigVersions` (v1 `published`) | Cada `COD_SER` → servicio; columnas de configuración → dimensiones del perfil (6.B); `LIQ_AFIP` (1 o mayor que 0) → `profile.billing.publicServiceSettlement = true`, si no `false` (RF-CAT-117, DEC-093); `capabilityId` por dominio (CTR-CAT-06 para MODEMS/SERVINT). | Conteo de servicios; revisión del perfil por el tenant antes de abrir oferta; cantidad de servicios con `LIQ_AFIP > 0` igual a la de servicios con la marca LQSP. |
| `HIS_SERVICIO`, `HIS_SERVICIO_EXTRAS` | `serviceConfigVersions` (`superseded`) | Cada cambio fechado → versión histórica de solo lectura. | Fechas consecutivas sin huecos. |
| `TIP_SERVI` | `serviceCapabilities` (mapeo) / `tenantServices.type` | Tipo → dominio y `measured/technical`. | Todo servicio con capacidad asignada. |
| `CLASESER` | `serviceClasses` | Valores de clase 1/2; tasa hospital → concepto de tercero (CTR-CAT-17). Antes de cargar, cada clase que represente una tasa se clasifica con la regla de M06 (RF-FIS-163, RN-FIS-126) que aplica T07 (RN-MIG-051): concepto de terceros → concepto de M02 colgado de un contrato propio con perfil "convenio de terceros" (DEC-083); tributo propio o de terceros → `taxes` de M06; sin resultado → rechazo bloqueante en saneamiento (HUECO-TAS-03). | Conteo por servicio; ninguna clase-tasa sin clasificar. |
| `CATE_SER`, `CATE_SER_EXTRAS`, `HIS_CATE_SER`, `HIS_CATE_SER_EXTRAS` | `serviceCategories` (estructura) | Atributos estructurales; precios y coeficientes → TAR; `CAT_SOC` → `isSocial` (CTR-CAT-13). | Conteo por servicio; categorías sociales revisadas. |
| `GRP_CAT` | `serviceCategoryGroups` | Directo. | Conteo. |
| `PROPIESER` | `serviceProperties` | Directo con tipo de valor. | Conteo. |
| `PROD_SER`, `HIS_PROD_SER` | `serviceProducts` + `billableConcepts` (estructura) | Producto/concepto; precio → TAR. | Conteo por servicio; conceptos sin uso marcados `inactive`. |
| `ESTASER` | `serviceStatuses` | Asignar `canonicalStatus` e `impliesDisconnection` (CORTADO → `suspended`). | Ningún estado sin mapeo. |
| `SERSOC`, `SERSOC_EXTRAS` | `serviceContracts` | `CONDICION` + fechas + `ESTASER` → estado canónico según 8.1; fechas `1901-01-01` → `null` (CTR-CAT-09); flags (No facturar con vigencia por defecto PRM-CAT-070 y tarea de revisión; Provisorio; Cobrar provisorio; No aplica recategorización; Alta desde CoopOnline; Lectura con factor). | Conteo por `COD_SER × CONDICION` = conteo por servicio × estado canónico; suma de contratos activos igual al último período facturado. |
| `SERSOC_HST` | `serviceContractHistory` | Cada registro → evento histórico con `source=migration`. | Último estado histórico coincide con el actual. |
| `SERSOC_PRODUCTOS` | `contractEquipmentAssignments` | Modalidad comodato/venta; serie → unidad STK (si STK migra antes). | Equipos con serie conciliados con STK; sin serie → tarea. |
| `ALTASEAU` | `autoServiceRules` | Modo `propose` salvo marcados obligatorios con fundamento (CTR-CAT-05). | Revisión del tenant. |
| `CONEXION` | `eventChargeRules` | Tipo de evento 1..7; precio → TAR. | Conteo por evento. |
| `CONE_BONIF` | `eventChargeWaivers` | Directo. | Conteo. |
| `ADHSOC` | M18 `serviceDependents` (Reemplaza el destino `contractMembers`, DEC-071, HUECO-TRV-01) | Lo migra M18; persona → PER (sin duplicar); vínculo → `VINCULOS` (PER). M02 solo migra la marca "admite adherentes" del servicio (`SERVICIO.ADHER`). | Conteo por servicio; repetidos reportados (en M18). |
| `BENSOC` | M18 `serviceBeneficiaries` (DEC-086, HUECO-SEP-02; no es tarifa social ni va a M04). Texto anterior: "`contractMembers` (destino sin cambios en este anexo: pendiente de HUECO-SEP-02, lo define T07/M18)" | Persona → PER (sin duplicar); vínculo → `VINCULOS` (PER). | Conteo por servicio; repetidos reportados. |
| `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS` | `applianceTypes`, `contractDeclaredAppliances` | Directo con historia; `kind` y `powerUnit` según el servicio (HUE-GAS-01). El destino queda en M02 (no en M01 ni M03). | Conteo por contrato GAS y ELE. |
| `SUMNOFAC` | `serviceContracts.flags.noBill` | Nivel cuenta → por contrato con vigencia. | Contratos marcados. |
| `CONCESIO` | `serviceConcessions` | Directo; `verified=false`. | Revisión legal. |
| `TEL_SERSOC`, `TEL_SERVICIO`, `TEL_MODALIDAD`, `SERTEL`, `TEL_NUMEROS` | `serviceContracts.domainAttributes` (TEL) / planes TEL | Línea, modalidad, número; planta externa (`TEL_CAJAS`, `TEL_REPARTIDOR`, `TEL_PUERTOS_*`, `TEL_DSLAM`, regletas) → TEC. | Líneas activas = contratos TEL activos. |
| `INTERNET` (sin secretos) | `serviceContracts.domainAttributes` (INT) | Usuario, perfil, IP; contraseñas → bóveda o regeneración (CTR-CAT-10). | Contratos INT activos con perfil técnico. |
| `CORREOSINT`, `MIKROTIK` | T06 (bóveda) / TEC | Credenciales nunca en colecciones CAT. | — |
| `TRANSFER` (tipo 2, servicios) | `serviceContractHistory` + `supersededByContractId` | Relación origen-destino. | Pares conciliados. |
| `PLANESVIV`, `VIVIENDAS` | Planes VIV / contratos VIV (parte contractual) | Financiación → FAC. Un contrato M02 por vivienda, con estado según inscripción, adjudicación o entrega (T07 RN-MIG-052, PRM-MIG-063; HUECO-VIV-03). | Conteo. |
| `AMBULANC`, `MEDICOS`, `PROFESIO` | Recursos de SAL (catálogos operativos) → TEC/CFG; `PROFESIO` → PER | Sin datos clínicos. | — |
| `FACTIBIL` | TEC | — | — |
| `SERSOC_DEMANDASXPERIODO`, `SERSOC_REDES` | MED / TEC | — | — |
| `SERVINT`, `MODEMS` | CFG (modelo de interfaz) / T09 (módems GSM de SMS) | No son Internet (CTR-CAT-06). | — |
| `PREPAGA`, `ENGAS_CANTMESES` | TAR / MED | — | — |
| `PROD_SER_RET`, `PROD_SER_UBICACION` | TAR / STK | — | — |
| `OBSESTAD`, `RESESTAD`, `CERESTAD` | MED (observaciones de lectura) | No son estados de servicio. | — |
| `TEMPMODIFBONIF` | Descartado (temporal de proceso) | — | — |

### 19.2 Orden y controles

1. PER (personas, cuentas, domicilios) → STK (unidades) → CAT configuración → TAR (precios) → CAT contratos → MED → FAC/COB.
2. Ensayo en tenant de pruebas; informe de conciliación por servicio × estado, contratos sin titular, contratos sin domicilio, fechas inconsistentes (`FEC_BAJA < FEC_ALTA`), contratos activos sin categoría, estados sin mapeo.
3. Validación del tenant firmada antes del corte; los contratos con anomalías migran con marca `migrationIssue` y bandeja.
4. Reejecución idempotente por `legacyKey` (`COD_SER`, `NRO_SOC`, `NRO_SUM`/secuencia).

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla |
|---|---|---|---|---|
| CTR-CAT-01 | BASE §48 vs. RN-06 §3 | BASE: solicitar no es ejecutar. ProCoop: el alta no técnica queda conectada al grabarse. | Prevalece BASE: toda alta nace `requested` y requiere aprobación (automática configurable solo en no técnicos sin requisitos pendientes). | RN-CAT-064, T01/T05 |
| CTR-CAT-02 | RN-01 §2 / RN-06 §4.1 vs. AGR-003 | Estado derivado de fechas vs. máquina explícita. | Estado explícito con fechas como atributos; mapeo en 8.1. | RN-CAT-017 |
| CTR-CAT-03 | RN-06 §10 vs. AGR-007 / BASE §91 | Cascada automática a adherentes vs. decisión trazable. | Configurable `cascade/ask/none` con historia. | RN-CAT-045, PRM-CAT-060 |
| CTR-CAT-04 | ProCoop paso masivo a prepago vs. BASE §53/§70 | Conversión masiva del moroso vs. límites normativos. | Solo por orden de MOR con política y simulación; CAT ejecuta el trámite. | RN-CAT-049 |
| CTR-CAT-05 | RN-06 §3.5 (`ALTASEAU`) vs. BASE §66/§81 | Encender un servicio no implica contratarlo. | Modo `propose` por defecto; `create` solo con `legalBasis` (PA-CAT-04). | RN-CAT-035 |
| CTR-CAT-06 | DFA M4 vs. CAT §12 | DFA lista `MODEMS`/`SERVINT` como Internet; CAT los describe como módems GSM y modelo de interfaz. | Prevalece CAT (fuente más específica): no pertenecen a INT. | 19.1 |
| CTR-CAT-07 | RN-06 §6 vs. RN-09 (V2 2455) | Semántica del cambio de categoría con OT. | `categoryChangeMode` explícito; [VERIFICAR] con usuarios clave. | RN-CAT-047, PRM-CAT-044/045 |
| CTR-CAT-08 | RN-06 §7 (modo eliminar) vs. AGR-007/AGR-010 | Borrado físico en transferencia. | Siempre clonado; el origen queda `superseded`. | RN-CAT-051 |
| CTR-CAT-09 | RN-01 §2 vs. convenciones de datos (T05 DAT) | Fecha centinela `1901-01-01`. | `null`. | RN-CAT-018 |
| CTR-CAT-10 | CAT §12 (`INTERNET`, `CORREOSINT`, `MIKROTIK`) vs. T02/T06 | Credenciales en claro. | Bóveda; CAT guarda `secretRef`. | Sección 13, RN-CAT-046 |
| CTR-CAT-11 | BASE §92 vs. DEC-007 | Solo seis servicios confirmados vs. todo ProCoop en alcance. | DEC-007: fichas para todos los dominios ProCoop. | 6.C |
| CTR-CAT-12 | BASE §32 vs. DEC-007 | Servicios "candidatos" vs. alcance completo. | Adoptados como capacidades. | RF-CAT-001 |
| CTR-CAT-13 | `Es_Categoria_Social` (descripción "JUBILADOS") vs. BASE §5 | Inferencia por texto. | Flag `isSocial`. | RN-CAT-016 |
| CTR-CAT-14 | Integración BATCOM con `COD_SER=1` fijo vs. BASE §66 | Código fijo. | Integración configurable por servicio. | 13 |
| CTR-CAT-15 | V2 2269/2715 vs. BASE §1/§83 | Prohibir servicios iguales en la cuenta vs. múltiples contrataciones. | Configurable; default permitir no medidos (PA-CAT-11). | RN-CAT-032 |
| CTR-CAT-16 | V2 2482/2668 vs. BASE §1/§89 | Deuda del domicilio bloquea alta vs. la dirección no determina deuda. | Advertencia por defecto (PA-CAT-12); nunca traslado. | RN-CAT-030 |
| CTR-CAT-17 | `CLASESER` tasa hospital vs. dominio TAS | Clase usada como tasa. | Clase = clasificación; tasa = concepto de tercero. | 6.C.15 |
| CTR-CAT-18 | `IMP_CAPITAL` en servicio vs. INS | Capital social cobrado como servicio. | Concepto CAP; libro de capital en INS. | 6.C.16 |
| CTR-CAT-19 | BASE §66 vs. DEC-003 | BASE no decide arquitectura. | DEC-003 monolito modular: CAT es módulo. | 2.3 |
| CTR-CAT-20 | V2 2527 vs. BASE §91 | Edades de donante como regla clínica. | Solo filtro administrativo configurable; sin decisión clínica. | 6.C.12 |

## 21. Preguntas abiertas

### PA-CAT-01 — Momento de creación del contrato

- **Pregunta:** ¿El contrato se crea cuando el socio envía la solicitud, cuando CRM la admite o cuando se aprueba?
- **Contexto:** BASE §48 separa solicitar de ejecutar; ProCoop crea el registro `SERSOC` al grabar el alta. Crear demasiado pronto llena la base de contratos de solicitudes inválidas; crear tarde impide reservar equipo y agendar.
- **Opciones:**
  - A) **(Recomendada)** Al admitir la solicitud en CRM, en estado `requested`, sin efectos de facturación.
  - B) Al enviar la solicitud desde cualquier canal.
  - C) Solo al aprobar (la solicitud vive en CRM hasta entonces).
- **Impacto si no se responde:** se aplica A; ajustar luego obliga a migrar contratos `requested`.
- **Bloquea:** RF-CAT-067, T01, integración CRM–CAT (O3).
- **Estado:** Respondida (DEC-011): opción A, el contrato se crea al admitir la solicitud en CRM, en estado `requested`.

### PA-CAT-02 — Quién habilita capacidades y quién publica servicios

- **Pregunta:** ¿Quién habilita una capacidad en un tenant y quién publica la oferta? (BASE §71)
- **Contexto:** la habilitación depende de licencia (T01); la publicación compromete condiciones frente a los socios.
- **Opciones:**
  - A) **(Recomendada)** La plataforma habilita según licencia; el administrador del tenant configura y publica con aprobación por usuario distinto en producción (PRM-CAT-002).
  - B) El tenant habilita y publica sin intervención de plataforma.
  - C) La plataforma habilita y publica a pedido del tenant.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** RF-CAT-002, RF-CAT-005, PAN-CAT-02.
- **Estado:** Respondida (DEC-021): opción A, la plataforma habilita según licencia y el administrador del tenant publica con aprobación de otro usuario en producción.

### PA-CAT-03 — Efecto de apagar una capacidad u oferta con contratos vigentes

- **Pregunta:** ¿Qué pasa con los contratos vigentes si se cierra la oferta o se deshabilita la capacidad? (BASE §71)
- **Contexto:** apagar no debe dejar socios sin servicio ni facturación huérfana.
- **Opciones:**
  - A) **(Recomendada)** Cerrar oferta solo impide nuevas contrataciones; cerrar operación exige plan de salida aprobado (bajas programadas, aviso, migración de plan).
  - B) Deshabilitar da de baja automáticamente todos los contratos.
  - C) No se permite deshabilitar mientras haya contratos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-001=true.
- **Bloquea:** RN-CAT-003, CU-CAT-12.
- **Estado:** Respondida (DEC-022): opción A, cerrar la oferta frena altas y cerrar la operación exige plan de salida.

### PA-CAT-04 — Altas automáticas de servicios opcionales

- **Pregunta:** ¿Puede una regla automática crear contratos de servicios opcionales (ej. sepelio al conectar electricidad)?
- **Contexto:** ProCoop (`ALTASEAU`) los crea; BASE §66/§81 y la normativa de defensa del consumidor exigen consentimiento para servicios no obligatorios.
- **Opciones:**
  - A) **(Recomendada)** `create` solo para servicios obligatorios con fundamento normativo registrado (`legalBasis`); opcionales en modo `propose` con consentimiento del socio.
  - B) Permitir `create` en cualquier servicio, a criterio del tenant.
  - C) Solo `propose` en todos los casos.
- **Impacto si no se responde:** se aplica A; la migración de `ALTASEAU` crea reglas en `propose`.
- **Bloquea:** RF-CAT-086, RN-CAT-035, CTR-CAT-05.
- **Estado:** Respondida (DEC-023): opción A, altas directas solo para servicios obligatorios con fundamento normativo; los opcionales se proponen con consentimiento.

### PA-CAT-05 — Jerarquía definitiva servicio, producto, subservicio y plan

- **Pregunta:** ¿Cuál es la jerarquía definitiva? (BASE §74)
- **Contexto:** ProCoop usa servicio → categoría → producto (`PROD_SER`); BASE §72 habla de productos, planes y subservicios.
- **Opciones:**
  - A) **(Recomendada)** Servicio del tenant → producto (incluye subservicio como producto `addon`) → plan versionado → conceptos facturables; la categoría es eje estructural transversal al plan.
  - B) Servicio → plan → subservicios, sin entidad producto.
  - C) Servicio → categoría → producto (modelo ProCoop).
- **Impacto si no se responde:** se aplica A, que admite migrar el modelo ProCoop.
- **Bloquea:** modelo de datos 7.5–7.10, M04 TAR.
- **Estado:** Respondida (DEC-012): opción A, servicio → producto (subservicio = producto adicional) → plan versionado → conceptos facturables.

### PA-CAT-06 — Alcance de Banco de sangre

- **Pregunta:** ¿Banco de sangre se limita a cobertura administrativa por convenio? (BASE §91, §95)
- **Contexto:** gestionar información clínica implica régimen de datos de salud y habilitaciones sanitarias.
- **Opciones:**
  - A) **(Recomendada)** Solo administrativo: contrato, beneficiarios, convenio, autorización de cobertura; sin datos clínicos ni decisión de aptitud.
  - B) Incluir registro de donaciones y aptitud.
  - C) No incluirlo en la primera versión.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.12, CU-ESP-SAN.
- **Estado:** Respondida (DEC-024): opción A, solo administrativo por convenio, sin datos clínicos.

### PA-CAT-07 — Autorización del tenant origen en copias

- **Pregunta:** ¿Hace falta consentimiento del tenant origen para copiar su configuración a otro?
- **Contexto:** la configuración (planes, condiciones, textos) puede ser información comercial propia de cada cooperativa.
- **Opciones:**
  - A) **(Recomendada)** Sí: autorización explícita del tenant origen más ejecución por operador de plataforma o admin del destino.
  - B) La plataforma copia sin consentimiento (configuración no es dato personal).
  - C) Solo se copian plantillas de plataforma, nunca configuración de tenants.
- **Impacto si no se responde:** se aplica A (PRM-CAT-103).
- **Bloquea:** RF-CAT-104..108, API-CAT-47.
- **Estado:** Respondida (DEC-025): opción A, autorización explícita del tenant origen.

### PA-CAT-08 — Plantillas de plataforma

- **Pregunta:** ¿CoopApps mantiene plantillas de servicio propias (sin tenant origen)?
- **Contexto:** acelera el lanzamiento en cooperativas nuevas; riesgo de sugerir precios o condiciones como oficiales.
- **Opciones:**
  - A) **(Recomendada)** Sí, sin precios ni condiciones reguladas; solo estructura, conceptos, estados y textos de ejemplo.
  - B) Sí, con precios de referencia.
  - C) No; solo copia entre tenants.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** RF-CAT-109, API-CAT-55.
- **Estado:** Respondida (DEC-026): opción A, plantillas de plataforma sin precios ni condiciones reguladas.

### PA-CAT-09 — Semántica de "Provisorio" y "Cobrar provisorio"

- **Pregunta:** ¿Qué significan exactamente las marcas de `SERSOC` "Provisorio" y "Cobrar provisorio"?
- **Contexto:** las fuentes no lo describen con precisión ([VERIFICAR]); se usan en filtros de `CONEXION` y trámites masivos.
- **Opciones:**
  - A) **(Recomendada)** Provisorio = suministro transitorio (obra, evento) con vencimiento obligatorio; Cobrar provisorio = se factura durante la condición provisoria con conceptos propios.
  - B) Provisorio = alta pendiente de documentación.
  - C) Eliminar las marcas y reemplazarlas por planes específicos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-071.
- **Bloquea:** RF-CAT-069, RN-CAT-063, migración de flags.
- **Estado:** Respondida (DEC-027): opción A, suministro transitorio con vencimiento obligatorio, facturable en esa condición.

### PA-CAT-10 — Modalidad por defecto de equipos

- **Pregunta:** ¿Los equipos se entregan en comodato, venta o alquiler por defecto, y quién los valoriza? (BASE §74)
- **Opciones:**
  - A) **(Recomendada)** Modalidades configurables por plan; por defecto comodato en INT y TV; valorización y custodia en STK; cargo por no devolución solo si figura en las condiciones aceptadas.
  - B) Siempre venta financiada.
  - C) Siempre comodato sin cargo por pérdida.
- **Impacto si no se responde:** se aplica A (PRM-CAT-093).
- **Bloquea:** RF-CAT-051, RF-CAT-079, RF-CAT-101.
- **Estado:** Respondida (DEC-013): opción A, configurable por plan; comodato por defecto en Internet y TV, valorizado en stock.

### PA-CAT-11 — Contratos iguales en la misma cuenta

- **Pregunta:** ¿Se permite que una cuenta tenga dos contratos del mismo servicio?
- **Contexto:** V2 2269/2715 lo prohíben; BASE §1/§83 exige múltiples contrataciones independientes.
- **Opciones:**
  - A) **(Recomendada)** Permitir en no medidos; en medidos uno por punto de suministro (con distinto domicilio o medidor se permiten).
  - B) Prohibir siempre.
  - C) Permitir siempre.
- **Impacto si no se responde:** se aplica A (PRM-CAT-021/022).
- **Bloquea:** RN-CAT-032, RF-CAT-078.
- **Estado:** Respondida (DEC-028): opción A, permitido en no medidos; en medidos, uno por punto de suministro.

### PA-CAT-12 — Deuda en el domicilio del servicio

- **Pregunta:** ¿La deuda de otra cuenta en el mismo domicilio bloquea el alta?
- **Contexto:** ProCoop puede bloquear; BASE §1/§89 dice que la dirección no determina la deuda de otro titular (ESC-03).
- **Opciones:**
  - A) **(Recomendada)** Advertencia por defecto; el tenant puede exigir autorización de supervisor; nunca bloqueo automático ni traslado de deuda.
  - B) Bloqueo configurable.
  - C) Sin control.
- **Impacto si no se responde:** se aplica A (PRM-CAT-017).
- **Bloquea:** RN-CAT-030, RF-CAT-076.
- **Estado:** Respondida (DEC-029): opción A, advertencia con autorización opcional; nunca bloqueo ni traslado de deuda.

### PA-CAT-13 — Modalidades de gas

- **Pregunta:** ¿Qué modalidades de gas se modelan (red natural, propano por redes, envasado)?
- **Contexto:** BASE §89 distingue condición de prestador/subdistribuidor; ProCoop tiene `CORREGAS`, `PRCAGAS`, `ENGAS_CANTMESES`.
- **Opciones:**
  - A) **(Recomendada)** Variantes de la capacidad GAS (red natural, propano por red, envasado) habilitables por tenant con perfil propio.
  - B) Solo gas natural por red.
  - C) Capacidades separadas por modalidad.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.7.
- **Estado:** Respondida (DEC-030): opción A, red natural, propano por red y envasado, habilitables por tenant; el envasado se detalla en PA-CAT-17 (DEC-082).

### PA-CAT-14 — Suspensión voluntaria

- **Pregunta:** ¿La suspensión voluntaria (vacaciones, ausencia) está disponible por defecto?
- **Opciones:**
  - A) **(Recomendada)** Configurable por servicio, deshabilitada por defecto; con duración máxima y efecto sobre cargos definidos en TAR.
  - B) Habilitada por defecto en todos los servicios.
  - C) No se ofrece.
- **Impacto si no se responde:** se aplica A (PRM-CAT-098/099).
- **Bloquea:** T08 motivo `voluntary`, JOB-CAT-08.
- **Estado:** Respondida (DEC-031): opción A, configurable por servicio y deshabilitada por defecto.

### PA-CAT-15 — Fecha efectiva del cambio de plan

- **Pregunta:** ¿Desde cuándo rige un cambio de plan?
- **Opciones:**
  - A) **(Recomendada)** Configurable; por defecto el próximo período de facturación; inmediato con prorrateo (TAR) si el tenant lo habilita; upgrades técnicos desde la confirmación de reprovisión.
  - B) Siempre inmediato con prorrateo.
  - C) Siempre al próximo período.
- **Impacto si no se responde:** se aplica A (PRM-CAT-100).
- **Bloquea:** RF-CAT-081, 9.4.
- **Estado:** Respondida (DEC-032): opción A, próximo período; inmediato con prorrateo si el tenant lo habilita.

### PA-CAT-16 — Hito que confirma la activación

- **Pregunta:** ¿Qué hito activa el contrato técnico y qué rol tiene la revisión supervisora? (BASE §74)
- **Contexto:** activar antes de la provisión genera cargos sin servicio; esperar a la revisión retrasa la facturación.
- **Opciones:**
  - A) **(Recomendada)** Activa la confirmación técnica (`tec.installation.activationConfirmed`, EVT-TEC-16, con provisión confirmada y conformidad); la revisión supervisora es posterior y, si observa, abre corrección sin revertir automáticamente.
  - B) Activa la aprobación del supervisor tras la instalación.
  - C) Activa el cierre administrativo de la OT.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** T06, RN-CAT-042, M10 TEC.
- **Estado:** Respondida (DEC-033): opción A, activa la confirmación técnica de instalación y aprovisionamiento; la revisión del supervisor es posterior.

### PA-CAT-17 — Gas envasado

- **Pregunta:** ¿Cómo se ofrece el gas envasado (garrafas, cilindros) dentro del servicio GAS? (HUE-GAS-02)
- **Contexto:** la ficha 6.C.7 lista la modalidad envasado (PA-CAT-13), pero el perfil GAS asume medidor, factor de corrección y DDJJ de artefactos, que no aplican a una garrafa. Algunas cooperativas venden garrafas con entrega a domicilio.
- **Opciones:**
  - A) **(Recomendada)** Variante "envasado" del servicio GAS como venta con stock en M13 y entrega en M10, sin medidor ni corrección (tipo de cálculo por cantidad), habilitable por tenant con PRM-CAT-112 (deshabilitada por defecto).
  - B) Fuera de alcance hasta que un tenant lo pida.
- **Impacto si no se responde:** se aplica A con PRM-CAT-112 = false.
- **Bloquea:** ficha 6.C.7 (modalidad envasado), PRM-CAT-112.
- **Estado:** Respondida (DEC-082): opción A, el gas envasado entra en el alcance como variante "envasado" del servicio GAS (venta con stock de M13 y entrega de M10, sin medidor ni corrección de volumen), habilitable por tenant. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

### PA-CAT-18 — Conceptos de terceros sin servicio propio

- **Pregunta:** ¿De qué se cuelga un concepto por cuenta de terceros (tasa municipal, aporte a bomberos, tasa hospital) cuando el socio no tiene un servicio al que asociarlo? (HUECO-TAS-01)
- **Contexto:** la ficha 6.C.15 admite el concepto transversal o un contrato "Fijos", pero no define qué pasa si el socio no tiene contrato que lo soporte; FAC necesita un contrato para facturar y COB para imputar.
- **Opciones:**
  - A) **(Recomendada)** Siempre cuelgan de un contrato propio del socio: si no hay un contrato al que asociarlo, se crea uno con el perfil de servicio "convenio de terceros" de tipo accesorio (sin técnica ni medición), configurable por tenant y por convenio.
  - B) Se facturan por inmueble sin contrato.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.15, mapeo `CLASESER` de §19.1 (pendiente de HUECO-TAS-03; resuelto con RF-FIS-163/RN-FIS-126 de M06 y RN-MIG-051 de T07), M05 FAC.
- **Estado:** Respondida (DEC-083): opción A, los conceptos de terceros siempre cuelgan de un contrato propio del socio con perfil de servicio "convenio de terceros" de tipo accesorio; nunca se facturan por inmueble sin contrato. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

### PA-CAT-19 — Correo electrónico y pack SMS

- **Pregunta:** ¿Se mantienen como servicios el correo electrónico (`CORREOSINT`) y el pack SMS? (HUECO-OTR-03)
- **Contexto:** ProCoop los vende como productos TIC; el aprovisionamiento real lo hace un proveedor externo y hoy casi no tienen altas nuevas.
- **Opciones:**
  - A) **(Recomendada)** Servicios de M02 con aprovisionamiento por T06 (integración con el proveedor) y cupo/consumo, habilitables por tenant con PRM-CAT-113 (deshabilitados por defecto).
  - B) Discontinuar y migrar solo los históricos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-113 = `none`.
- **Bloquea:** RF-CAT-100, ficha 6.C.17 (correo y pack SMS), T06.
- **Estado:** Respondida (DEC-084): opción A, correo electrónico y pack SMS se mantienen como servicios de M02 con aprovisionamiento por T06 y control de cupo y consumo, habilitables por tenant. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

### PA-CAT-20 - Dueño de casos de uso compartidos con definiciones distintas
- **Pregunta:** ¿qué anexo define CU-MER-01, CU-PRO-01, CU-CIC-01, CU-ESP-CEM y CU-ESP-SAN, que hoy tienen definiciones distintas en varios anexos?
- **Contexto:** CU-MER-01 es en M02 "Ofrecer servicio a un mercado nuevo (no socio)" y en M03, M04 y M06 "Usuario-generador"; CU-PRO-01 es en M02 "Contratar Internet (piloto)", en M04 "Fibra hogar con instalación y promoción" y en M11 "Instalación financiada en el piloto"; CU-CIC-01 aparece en M02 (parte CAT), M08, M09 y M19 con flujos distintos; CU-ESP-CEM y CU-ESP-SAN están en M02 y M18. La regla de corrección pide que el CU quede en el anexo dueño y los demás lo citen, pero elegir el dueño en estos casos es una decisión.
- **Opciones:**
  - A) **(Recomendada)** CU-MER-01 → M03 (lo marca "original") y el de M02 pasa a un ID nuevo `CU-CAT-08`; CU-PRO-01 → M02 (contratación del piloto) y M04/M11 citan su parte; CU-CIC-01 → M09 (trámite) y M02, M08 y M19 citan su parte; CU-ESP-CEM y CU-ESP-SAN → M18 y M02 cita la parte de contratación.
  - B) Mantener definiciones parciales en cada anexo con el sufijo "parte X", sin dueño único.
  - C) Centralizar los CU de BASE en T12 (fichas verticales) y que los módulos citen.
- **Impacto si no se responde:** se mantienen las definiciones actuales; la matriz de trazabilidad puede contar el mismo CU con flujos incompatibles.
- **Bloquea:** §16 de M02, M03, M04, M06, M08, M09, M11, M18 y M19; 04-matriz.
- **Estado:** Asumida (DEC-072): opción A, con el cambio de la pasada de cierre para CU-CIC-01 (dueño M08, registrado en PA-MOR-21; antes en esta opción: M09). Resultado: CU-MER-01 → M03, y el CU de M02 pasa a `CU-CAT-13` (no `CU-CAT-08`, que ya era «Administrar adherentes»); CU-PRO-01 → M02, y M04 y M11 citan su parte; CU-CIC-01 → M08, y M02, M09 y M19 citan su parte; CU-ESP-CEM y CU-ESP-SAN → M18, y M02 cita la parte de contratación. Aplicado en M02, M04, M08 y M09; M19 debe citar a M08.

### PA-CAT-21 - Destino de referencias y valores de estado propuestos
- **Pregunta:** ¿a qué colección apuntan `billableConcepts.fiscalClassId`, `billableConcepts.thirdPartyId`, `serviceContracts.activityId`, `serviceContracts.externalClientId`, `serviceContracts.bundleSubscriptionId` y `serviceConcessions.authorityIds`, y se aceptan los valores de estado propuestos en el §8 marcados `[VERIFICAR]`?
- **Contexto:** al completar las tablas del §7 y los estados del §8 (05-11-2026) estos destinos y valores no se pudieron deducir de T05 ni del anexo.
- **Opciones:**
  - A) **(Recomendada)** Confirmar destinos con el dueño de T05 (M06 para clase fiscal, M01 para terceros y autoridades, T04 para actividades) y aceptar los valores propuestos.
  - B) Quitar los campos o valores que ningún RF ni RN usa.
- **Impacto si no se responde:** quedan `[VERIFICAR]` y sin validación de integridad.
- **Bloquea:** T05 §7.2.
- **Estado:** Asumida (DEC-072): opción A. `fiscalClassId` → clase fiscal de M06 (colección `fiscalClasses`, declarada en PA-FIS-21); `thirdPartyId` y `authorityIds` → terceros y autoridades de M01; `activityId` → actividades económicas de T04 (reemplazado por PA-CAT-22: `normativeTables` de M06, `arcaActivities`); se aceptan los valores de estado propuestos del §8. `externalClientId` y `bundleSubscriptionId` quedan resueltos en PA-CAT-22 (antes: «siguen `[VERIFICAR]` porque la opción no les fija destino»). T05 debe agregar las referencias.

### PA-CAT-22 - Destino de `externalClientId`, `bundleSubscriptionId` y `activityId` (cierre, segunda ronda)
- **Pregunta:** ¿a qué colección apuntan `serviceContracts.externalClientId`, `serviceContracts.bundleSubscriptionId` y `serviceContracts.activityId`?
- **Contexto:** PA-CAT-21 no fijó destino para los dos primeros y mandó `activityId` a T04, que no declara la colección; el catálogo de actividades ARCA está en `normativeTables` de M06 (`code = arcaActivities`). M02 no tenía colección de suscripciones a combos.
- **Opciones:**
  - A) **(Recomendada)** `externalClientId` → `persons` (M01); `bundleSubscriptionId` → colección nueva `bundleSubscriptions` de M02 (§7.29); `activityId` → `normativeTables` de M06 con `code = arcaActivities`.
  - B) Quitar los campos que ningún RF ni RN usa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T05 §7.2; RF-CAT-044.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en la ficha de `serviceContracts` (§7.18), en la colección nueva `bundleSubscriptions` (§7.29) y en §8.3. T05 debe agregar `bundleSubscriptions` y las tres referencias.

### PA-CAT-23 — Residuales de estados y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones que faltaban, el tratamiento de `serviceStatuses.canonicalStatus` como clasificación y los destinos de las referencias sin colección?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 10 máquinas de M02 sin estado inicial, `serviceStatuses`, `contractDeclaredAppliances` y `contractSpecialConditions` con estados sin transiciones, y `contractEquipmentAssignments` con valores de §7 inalcanzables (eran los nombres de M13 de la equivalencia); 03-er marcó sin destino `requiresProductIds`, `excludesProductIds`, `declaredAffidavitRef` y `chargeProposalId`.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.5 el estado de alta de cada máquina y las transiciones de `contractDeclaredAppliances` (`active` → `removed`) y `contractSpecialConditions` (`draft` → `approved` → `expired`; → `cancelled`); tratar `canonicalStatus` como clasificación sin ciclo; escribir la equivalencia con M13 fuera de código; `requiresProductIds`/`excludesProductIds` → `serviceProducts`; `declaredAffidavitRef` → `documents` (T11); `feasibilityRef` → `feasibilityRequests` (M10); `chargeProposalId` → `approvalRequests` (T11).
  - B) Dejar los estados iniciales implícitos y `chargeProposalId` apuntando a `billableItems`.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), T05 §7.2.1.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.5, §7.8, §7.18, §7.20, §7.21, §7.24, §8.4 y §8.5. T05 debe registrar los destinos; M13 §7 (`chargeProposalId`) debe citar `approvalRequests` (T11).
- **Residual (5-11-2026), Asumida (DEC-072):** pedido de M12 (PA-CMP-16) de confirmar `packageIds` → `servicePlans`: no se confirma. El paquete de TV que cuentan RF-CAT-116, REP-CAT-16 y API-CAT-56 es un producto (`serviceProducts`, el mismo que marca `tvMinimumLineup`, RN-CAT-079, y que cita PRM-MOR-200 de M08); `servicePlans` son los planes comerciales de ese producto y `serviceBundles` los combos de varios servicios. Destino: `serviceProducts` (M02, COL-CAT-05). M12 §7.13.21 y T05 §7.2.1 y COL-CMP-22 deben cambiar `servicePlans` por `serviceProducts`.

## 22. Trazabilidad

### 22.1 Requisitos y secciones BASE asignadas

| Origen | Contenido | Cobertura en este anexo |
|---|---|---|
| BASE §1 Servicios habilitables y alta pública | Servicios por tenant, alta pública | RF-CAT-001..008, RF-CAT-110, PAN-CAT-21/23 |
| BASE §1 Configuración independiente y copia | Configuración por tenant, comunidad | RF-CAT-013, RF-CAT-104..108 |
| BASE §1 Titularidad y particularidades | DNI/CUIT, conexiones múltiples independientes | RF-CAT-067, RN-CAT-030/032, ESC-03, PA-CAT-11/12 |
| BASE §5 Catálogo de prestaciones y planes, CU-05 | Prestaciones, planes, unidades, requisitos, precarga | RF-CAT-031, 036, 041..045, 049, 070; CU-05; 18 |
| BASE §32 Particularidades según servicio | Antecedente de servicios | 6.C, CTR-CAT-12 |
| BASE §39.1 / §39.2 Precarga, servicios, unidades y liquidación | Sugerencias por servicio, unidad, periodicidad | RF-CAT-016, 017, 035; 18 |
| BASE §48 SOL-001, SOL-002, CU-SOL-01 | Solicitud de alta y baja de cualquier servicio (parte que define el servicio) | RF-CAT-025, 063, 072, 088, 111, 112; T01, T12; CU-SOL-01; CTR-CAT-01 |
| BASE §53 CIC-001..004 | Baja, suspensión, reactivación, modalidades con y sin costo | RF-CAT-030, 061, 063, 065, 066, 088; 8.2; RN-CAT-038; ESC-04/05 |
| BASE §54 GOB-004 / indicadores | Gobierno de configuración, indicadores | RF-CAT-006, 113; 15 |
| BASE §66 CAT-001, CAT-002, CAT-003, CU-CAT-01 | Capacidades por tenant, oferta a la comunidad, cementerio parque | RF-CAT-001..008, 110; 6.C.11; CU-CAT-01 |
| BASE §71 Pendientes de catálogo | Quién habilita/publica; efecto de apagar; cementerio parque; registro público; mínimo de pago; afectación cruzada; costos de reactivación; fechas de corte; universos; excepciones batch; contingencia fiscal | PA-CAT-02; PA-CAT-03; 6.C.11; registro público → M01 PER/M18 SOC; mínimo de pago → M08 MOR; afectación cruzada → M08 MOR (CAT expone `suspension.mode` por servicio); costos de reactivación → RN-CAT-038 + M08 MOR; fechas/universos/batch → M05 FAC; contingencia fiscal → M06 FIS |
| BASE §72 PRO-001..004, CU-PRO-01 | Productos, subservicios, bonificación por X meses, financiación | RF-CAT-036..048, 052; RN-CAT-009..014; CU-PRO-01; ESC-01 |
| BASE §74 Pendientes de composición e instalación | Jerarquía; costo interno vs. precio; promociones; financiación; equipos; visitas; firma; hito de activación; prorrateo; encuestas | PA-CAT-05; RF-CAT-037 (concepto interno) + M04 TAR; RN-CAT-013 + M04; M04/M05; PA-CAT-10; M10 TEC (T07 registra visita fallida); M10 TEC; PA-CAT-16; M04 TAR; M09 CRM |
| BASE §80 Pendientes de geografía y compras | Inmueble, dirección, punto de acceso y varios contratos; artículos y servicios | RF-CAT-067, RN-CAT-023; M01 PER; M13 STK / M15 CON |
| BASE §81 COP-001..003, CU-COP-01 | Copia de configuración entre tenants | RF-CAT-104..108; RN-CAT-068/069; 9.6; ESC-02; PA-CAT-07 |
| BASE §84 Núcleo común y perfil | Perfil de configuración por servicio | RF-CAT-013..030; 6.B |
| BASE §85 Autoridades, Córdoba, vigencia | Fuente, jurisdicción, vigencia | RF-CAT-014; `serviceConcessions`; PAN-CAT-26 |
| BASE §86 Internet | Factibilidad, instalación, equipos, perfil técnico, reclamos | 6.C.1; RF-CAT-051, 079, 099..101; 9.2; ESC-01 |
| BASE §87 Electricidad Córdoba, CU-ESP-ELE | Categorías ERSeP, medición, GD, grandes usuarios | 6.C.4; RF-CAT-096, 097; CU-ESP-ELE |
| BASE §88 Agua y saneamiento, CU-ESP-AG | Medido/no medido, inmueble, conexión | 6.C.5, 6.C.6; CU-ESP-AG |
| BASE §89 Gas, CU-ESP-GAS | Prestador/subdistribuidor, artefactos, rehabilitación | 6.C.7; RF-CAT-095; PAN-CAT-25; PA-CAT-13; CU-ESP-GAS |
| BASE §90 Cementerio parque, CU-ESP-CEM | Unidades, derechos, actos | 6.C.11; PRM-CAT-097; CU-ESP-CEM |
| BASE §91 Banco de sangre, CU-ESP-SAN | Convenio, beneficiarios, límites sanitarios | 6.C.12; PA-CAT-06; CTR-CAT-20; CU-ESP-SAN |
| BASE §92 Otros servicios | Extensiones a relevar | RF-CAT-009, 010; 6.C.2, 6.C.3, 6.C.8..6.C.10, 6.C.13..6.C.17; CTR-CAT-11 |
| BASE §93 Reglas transversales, ESP-001..006 | Reglas por servicio; seis dominios; productos/ciclo; auxiliar por servicio; fuente/vigencia; extensiones sin activación indiscriminada | ESP-001 → RF-CAT-013, 6.B; ESP-002 → 6.C.1, 6.C.4, 6.C.5, 6.C.7, 6.C.11, 6.C.12; ESP-003 → 6.C (productos típicos y estados); ESP-004 → RF-CAT-067, ESC-03 (auxiliar en M07 COB); ESP-005 → RF-CAT-014; ESP-006 → RF-CAT-002, RN-CAT-002, PA-CAT-04 |
| BASE §94 Fuentes | Fuentes de la investigación | `serviceConcessions.sources`; 6.C |
| BASE §95 Validación pendiente por servicio | Insumos por dominio; DNI/CUIT; ERSeP; categorías e importes; formularios; límites sanitarios; convertir fichas | 6.C (bloque "Validación pendiente" de cada ficha); M01 PER; 6.C.4 [VERIFICAR]; M04 TAR; 10 y 16; PA-CAT-06; 10–17 |
| BASE §37 Pendientes generales | Piloto, roles, procesos, pantallas, datos, integraciones, migración, criterios | DEC-001 (piloto Internet); 4; 9; 10; 7; 13; 19; 17 |
| BASE §98 Pendientes 0.15 | Rol de plataforma frente a Ley 25.326 | Fuera de alcance (T02); CAT aplica minimización en 17.4 y RN-CAT-068 |
| BASE §101 Pendientes de mercado | Emisión separada por servicio; consumo no registrado | PRM-CAT-081 + M05 FAC; M03 MED |
| BASE §106 Pendientes 0.17 | Servicios en mismo comprobante; periodicidad distinta en grupo | M05 FAC (CAT provee `billingGroupDefault` y periodicidad del plan) |
| BASE MER-001 | Usuario-generador | RF-CAT-096; `generationAgreements` (reemplazada por `distributedGenerationContracts` de M03, CTR-DAT-59); 6.C.4 |
| BASE MER-003 | Grandes usuarios y contratos especiales | RF-CAT-097; `contractSpecialConditions` |
| BASE MER-017 | Telefonía y red de ISP | RF-CAT-098, 099; 6.C.1, 6.C.2; planta externa → M10 TEC |

### 22.2 Agregados, decisiones y referencias

| Origen | Cobertura |
|---|---|
| DEC-001 (piloto Internet) | 6.C.1, 9.2, ESC-01, 18 |
| DEC-003 (monolito modular) | 2.3, CTR-CAT-19 |
| DEC-007 (todo ProCoop en alcance) | RF-CAT-010, 6.C, CTR-CAT-11/12 |
| DEC-011 a DEC-013, DEC-021 a DEC-033 (PA-CAT-01 a PA-CAT-16) | PA-CAT-01 a PA-CAT-16 "Respondida"; requisitos antes "A validar" pasados a "Adoptado (DEC-xxx)" |
| DEC-013 (comodato INT/TV) | PRM-CAT-093, RF-CAT-051, 6.C.1, 6.C.3 |
| DEC-040 (factibilidad configurable, obligatoria por defecto en INT y servicios con red) | RN-CAT-026, RF-CAT-018, PRM-CAT-013 |
| DEC-060 (generación distribuida en M03) | RF-CAT-096, 7.23 (reemplazada por `distributedGenerationContracts`, CTR-DAT-59) |
| DEC-064 (entidades jurídicas) | `tenantServices.legalEntityId`, `serviceContracts.legalEntityId` (7.2, 7.18) |
| DEC-093 (factura agrupada sin mezclar LQSP y factura común) | RF-CAT-117; 6.B dimensión Facturación y 7.2 `tenantServices.profile.billing.publicServiceSettlement` (ex `SERVICIO.LIQ_AFIP`); §19 fila `SERVICIO`; consumidores RN-FAC-040 (M05), RF-FIS-072, RF-FIS-074 y RF-FIS-076 (M06) |
| DEC-099 (personas migradas sin documento) | 7.18 `serviceContracts.holderIdentifierSnapshot` `{documentTypeId, number, verificationStatus, identificationStatus}` declarada el 10-11-2026 según el contrato de interfaz de M01 (antes solo la exigía M01; T05 COL-CAT-18 y PA-DAT-05); §12.2 consume EVT-PER-27 `per.person.identificationRegularized` para refrescar esa foto (10-11-2026, ronda de cierre) |
| DEC-071 / DEC-086 (adherentes y beneficiarios en M18) | 7.22, §19.1 `ADHSOC`/`BENSOC`, `tenantServices.registrations` |
| DEC-073 (fichas verticales T12) | 6.C (cada ficha de dominio es el punto de partida de su ficha en T12) |
| DEC-082 (gas envasado) | PA-CAT-17, 6.C.7, PRM-CAT-112 |
| DEC-083 (conceptos de terceros con contrato propio) | PA-CAT-18, 6.C.15, §19.1 `CLASESER` |
| DEC-084 (correo y pack SMS) | PA-CAT-19, RF-CAT-100, 6.C.17, PRM-CAT-113 |
| T05 CTR-DAT-26, 30, 32, 58, 59, 66, 67 | §7 (nota de nombres canónicos), 7.18, 7.20, 7.22, 7.23 |
| AGR-002 (CRM no ejecuta) | RN-CAT-071, 12.2 |
| AGR-003 (máquina de estados explícita, reversión) | RF-CAT-061, 091, 8, CTR-CAT-02 |
| AGR-005 (catálogo de capacidades) | RF-CAT-002, 005 |
| AGR-007 (titularidad y representación) | 4 (alcance socio), CTR-CAT-03/08 |
| AGR-008 / AGR-009 (versionado y aprobación) | RF-CAT-031..035, 106 |
| AGR-010 (historia, sin borrado físico) | RF-CAT-034, 057, CTR-CAT-08 |
| AGR-017 (promociones y beneficios) | RF-CAT-045, RN-CAT-013 |
| AGR-022 (corte temporal) | RN-CAT-066, 15 |
| DFA Módulo 4 (líneas 242-312) | RF-CAT-010, 057, 058, 062, 064, 068, 069, 095, 109; CTR-CAT-06 |
| DFA M25 / servicios TIC, vivienda y salud (1060-1085) | RF-CAT-010, 6.C.1–6.C.3, 6.C.13, 6.C.14 |
| README (administración de servicios, ficha) | RF-CAT-068, PAN-CAT-14 |
| REL (capturas de administración de servicios y flags) | RF-CAT-053, 058, 064, 068, 069, 072 |
| RN-01 §2 tipos de cálculo `TIP_CAL` | RF-CAT-017, 021, 071; RN-CAT-073/074; 6.B |
| RN-01 §9 adherentes | RF-CAT-022, 055, 059, 080 |
| RN-01 §10 telefonía | RN-CAT-075, PRM-CAT-090..092 |
| RN-06 §3.1–§3.6 altas, validaciones, configuración, altas automáticas, conexión | RF-CAT-016..020, 050, 071..078, 086, 102, 103; RN-CAT-020..037 |
| RN-06 §4.1–§4.3 estados, conexión/desconexión, trámites | RF-CAT-063, 087, 090; RN-CAT-019, 039..046; 8.1; 9.8 |
| RN-06 §5 bajas | RF-CAT-088, 089; RN-CAT-065, 072 |
| RN-06 §6 cambios de categoría y clase | RF-CAT-055, 058, 060, 082, 083; RN-CAT-047..050; CTR-CAT-07 |
| RN-06 §7 transferencias | RF-CAT-084; RN-CAT-051..054; 9.5 |
| RN-06 §8 domicilio | RF-CAT-085; RN-CAT-055 |
| RN-06 §10–§11 adherentes y grupos de facturación | RF-CAT-020, 080; RN-CAT-024, 056..060 |
| RN-09 parámetros | 14 (todas las claves V2 listadas y delegadas) |
| CNX §2.4 (un renglón de suscriptores = un producto) | RF-CAT-002; 7.1–7.2 (capacidad licenciada ≠ servicio del tenant) |
| CNX §4.2–§4.3 (layout y patrones) | 10 |

### 22.3 Tablas ProCoop — catálogo §2 (servicios)

| Tabla | Destino |
|---|---|
| `ALTASEAU` | CAT `autoServiceRules` (RF-CAT-086, RN-CAT-035) |
| `ARTEFACTO` | CAT `applianceTypes` (RF-CAT-095) |
| `ARTEFSUMS` | CAT `contractDeclaredAppliances` (RF-CAT-095) |
| `CARGOS_ADICIONALES` | M04 TAR |
| `CATE_SER` | CAT `serviceCategories` estructura (RF-CAT-055); precios → M04 TAR |
| `CATE_SER_COEFICIENTES` | M04 TAR |
| `CATE_SER_EXTRAS` | CAT `serviceCategories` (generador, perfil de red, sociales) (RF-CAT-055, 096, 099) |
| `CATTARIF` | M04 TAR (CAT referencia `tariffBinding`) |
| `CATTMC` | M04 TAR |
| `CLASESER` | CAT `serviceClasses` (RF-CAT-053, CTR-CAT-17) |
| `CONCESIO` | CAT `serviceConcessions` (RF-CAT-014) |
| `CONEXION` | CAT `eventChargeRules` (RF-CAT-050); precio → M04 TAR |
| `CONE_BONIF` | CAT `eventChargeWaivers` (RF-CAT-050) |
| `CON_TASAS` | M12 CMP `purchaseConcepts` (concepto de compra con tasa y columna del libro de compras; T05 COL-CMP-05, T07 §19.2, HUECO-TAS-03). Antes: "M06 FIS / M04 TAR (6.C.15)" |
| `CORREGAS` | M03 MED / M04 TAR |
| `CUADRI` | M04 TAR |
| `CUADROS` | M04 TAR |
| `DESCPOS` | M04 TAR |
| `ESTASER` | CAT `serviceStatuses` (RF-CAT-062, 8.1) |
| `ESTINM` | M01 PER |
| `FACTOR_CAL` | M03 MED / M04 TAR (flag lectura con factor en CAT, PRM-CAT-073) |
| `FACT_EPEC` | Compras/costos de energía (M15 CON y módulo de compras) |
| `GRP_CAT` | CAT `serviceCategoryGroups` (RF-CAT-056) |
| `HIS_ARTEFSUMS` | CAT historia de `contractDeclaredAppliances` |
| `HIS_CARGOS_ADICIONALES` | M04 TAR |
| `HIS_CATE_SER` | CAT historia de `serviceCategories` (versionado) |
| `HIS_CATE_SER_EXTRAS` | CAT historia de `serviceCategories` |
| `HIS_CATTARIF` | M04 TAR |
| `HIS_IMPUESTO` | M06 FIS |
| `HIS_PROD_SER` | CAT historia de `serviceProducts`/`billableConcepts`; precios → M04 TAR |
| `HIS_SERVICIO` | CAT `serviceConfigVersions` (RF-CAT-034) |
| `HIS_SERVICIO_EXTRAS` | CAT `serviceConfigVersions` (RF-CAT-034) |
| `HIS_TAR_ADHE` | M04 TAR |
| `IMPUESTO` | M06 FIS (CAT asigna clase fiscal al concepto) |
| `IMPUESTOS_X_CAT` | M06 FIS |
| `PRCAGAS` | M03 MED / M04 TAR |
| `PROD_SER` | CAT `serviceProducts` + `billableConcepts` (RF-CAT-037) |
| `PROD_SER_REC_DES` | M04 TAR / M08 MOR |
| `PROPIESER` | CAT `serviceProperties` (RF-CAT-054) |
| `RECARGOS` | M04 TAR |
| `REFEREN` | M01 PER / CFG (CAT referencia en contrato) |
| `SERVICIO` | CAT `tenantServices` + `serviceConfigVersions` (RF-CAT-013..030) |
| `SERVICIO_EXTRAS` | CAT `serviceConfigVersions` (RF-CAT-022..024) |
| `TAR_ADHE` | M04 TAR (CAT define adherentes computables) |
| `TEMPMODIFBONIF` | Descartado (tabla temporal de proceso) |
| `TIPOLOTE` | CFG |
| `TIP_SERVI` | CAT `serviceCapabilities` / `tenantServices.type` (RF-CAT-012) |
| `USOINM` | M01 PER |

### 22.4 Tablas ProCoop — contratos y miembros (§1)

| Tabla | Destino |
|---|---|
| `SERSOC` | CAT `serviceContracts` (RF-CAT-067..103) |
| `SERSOC_EXTRAS` | CAT `serviceContracts` (flags, GD) (RF-CAT-069, 096) |
| `SERSOC_HST` | CAT `serviceContractHistory` |
| `SERSOC_PRODUCTOS` | CAT `contractEquipmentAssignments` (RF-CAT-079) |
| `SERSOC_DEMANDASXPERIODO` | M03 MED |
| `SERSOC_REDES` | M10 TEC |
| `SUMNOFAC` | CAT flag `noBill` (RF-CAT-069) |
| `ADHSOC` | M18 `serviceDependents` (RF-SOC-011 a RF-SOC-030); antes CAT `contractMembers` (RF-CAT-080, reemplazado por HUECO-TRV-01) |
| `BENSOC` | M18 `serviceBeneficiaries` (DEC-086); antes CAT `contractMembers` (RF-CAT-080, reemplazado) |
| `VINCULOS` | M01 PER (catálogo de vínculos) |
| `FACTIBIL` | M10 TEC |
| `PROFESIO` | M01 PER |
| `PLANESVIV`, `VIVIENDAS` | CAT planes y contratos VIV (6.C.14); financiación → M05 FAC |
| `AMBULANC`, `MEDICOS` | Recursos operativos de SAL → M10 TEC / CFG (6.C.13) |
| `SERVINT` | CFG (modelo de interfaz) (CTR-CAT-06) |
| `MODEMS` | T09 notificaciones (módems GSM de SMS) (CTR-CAT-06) |
| `PREPAGA` | M04 TAR / M03 MED |
| `ENGAS_CANTMESES` | M03 MED |
| `PROD_SER_RET`, `PROD_SER_UBICACION` | M04 TAR / M13 STK |
| `OBSESTAD`, `RESESTAD`, `CERESTAD` | M03 MED (no son estados de servicio) |
| `TRANSFER` (tipo 2) | CAT historia de transferencias (RF-CAT-084) |

### 22.5 Tablas ProCoop — catálogo §12 (servicios TIC)

| Tabla | Destino |
|---|---|
| `INTERNET` | CAT `serviceContracts.domainAttributes` INT (sin secretos) (RF-CAT-099, CTR-CAT-10) |
| `CORREOSINT` | CAT producto correo (RF-CAT-100); credenciales → T06 bóveda |
| `MIKROTIK` | M10 TEC / T06 (bóveda) |
| `SERTEL`, `TEL_SERSOC`, `TEL_SERVICIO`, `TEL_MODALIDAD`, `TEL_NUMEROS` | CAT planes y contratos TEL (RF-CAT-098) |
| `TEL_PREFIJO`, `TARTEL`, `TARCLA`, `TARESP`, `BANDAS`, `BANCLA`, `TIPOBAN`, `CARACTER`, `PLANDES`, `GRATIS`, `INTERNAC`, `OPERADOR` | M04 TAR (tarifación telefónica; CAT define conceptos CPP/internacional, PRM-CAT-090..092) |
| `LLAMADAS`, `LLA_CEL`, `ENTRANTE`, `TIPOLLAM`, `RECHAZOS`, `CLAVES` | M03 MED (registros de llamadas) / M04 TAR |
| `CENTRALT`, `TEL_CENTRAL`, `TEL_PUERTOS_CENTRAL`, `TEL_DSLAM`, `TEL_PUERTOS_DSLAM`, `TEL_CAJAS`, `TEL_REGLETAS_CAJAS`, `TEL_POS_REG_CAJA`, `TEL_REPARTIDOR`, `TEL_GRUPOS_REPARTIDOR`, `TEL_REGLETAS_GRUPOS`, `TEL_POS_REG_GRUPOS`, `TEL_FRACCIONES` | M10 TEC (planta externa e interna) |

### 22.6 Formularios ProCoop (INV)

| Formulario | Pantalla |
|---|---|
| `abm_Servicio`, `abm_Servicio_OT` | PAN-CAT-03, PAN-CAT-04 |
| `abm_Servicio_Categorias`, `abm_GrpCat` | PAN-CAT-08 (precios → TAR) |
| `abm_Servicio_Cattarif`, `abm_Servicio_TarAdhe`, `abm_CateSer_Coeficientes`, `abm_prod_ser_rec_des` | M04 TAR |
| `abm_Servicio_Propiedad`, `abm_propieItems`, `abm_propieitems_valores`, `abm_ClaseSer` | PAN-CAT-09 |
| `abm_prod_ser`, `abm_prod_ser_combos` | PAN-CAT-06 |
| `abm_AltasEau` | PAN-CAT-11 |
| `abm_Propieda` | M01 PER (inmuebles) |
| `abm_Conexion` | PAN-CAT-12 |
| `abm_EstaSer` | PAN-CAT-10 |
| `abm_Sersoc_Productos` | PAN-CAT-19 |
| `abm_Socios`, `frmTitulares` | PAN-CAT-13..16, PAN-CAT-20 (datos de persona → M01 PER) |
| `abm_Artefactos` | PAN-CAT-25 |
| `abm_Profesio`, `abm_Vinculos` | M01 PER |
| `frmTranferenciaCapital` (servicios), `frmTransferenciasCuenta` | PAN-CAT-16 transferir (capital → M17 INS) |
| `frmPTramites`, `frmRecategorizacion`, `frmSegmentacion_Restablecer` | PAN-CAT-17 |
| `frmTarifaSocial_Importar`, `frmTarifaSocial_ImportarPorDni` | M04 TAR (CAT marca `isSocial`) |
| `frmRetroactivos`, `abm_GruposFactura`, `abm_GruposGrafico` | M05 FAC |
| `Datos_Vivienda`, `frmBajaVivienda`, `frmConstruccionVivienda`, `frmConsultaCambioPlanVivienda`, `frmInformesVivienda`, `frmViviendaActividad` | PAN-CAT-14 (dominio VIV) y 6.C.14; financiación → M05 FAC |

### 22.7 Contraposiciones y preguntas

CTR-CAT-01..20 (sección 20) y PA-CAT-01..19 (sección 21) quedan registradas en el índice de decisiones del proyecto al consolidar los anexos.
