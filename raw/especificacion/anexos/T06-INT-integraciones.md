# T06 INT — Integraciones externas: marco común de conectores y fichas

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | APIs (sistema de integraciones, fila 8) / Plataforma / Cobranza / Pasarelas / Impuestos |
| Olas | O0 (marco, bóveda, outbox, colas, bitácora), O1 (pantallas de conexiones, credenciales, certificados, monitoreo), O2 (mensajería, Google, IA base), O3 (aprovisionamiento Internet), O4 (ARCA, padrones, rentas en factura), O5 (redes, pasarelas, débitos, webhooks, conciliación), O6 (comandos de corte/reconexión), O7 (telemedición, prepago, reguladores, subsidios), O8 (Interbanking, extractos, regímenes informativos), O9 (sueldos, firma digital), O10 (telefonía/CDR, TV, GPS, agente local y hardware, IVR); CiDi en O1/O2 (DEC-067), O11 (API BI, migración repetible) |
| Dueño de datos | `integrationProviders`, `integrationConnections`, `integrationSecrets`, `integrationCertificates`, `integrationTokens` (caché), `integrationOperations`, `integrationMessages`, `webhookEndpoints`, `webhookInbox`, `fileLayouts`, `integrationFileExchanges`, `integrationReconciliations`, `integrationAlerts`, `integrationContingencies`, `externalReferences`, `localAgents`, `localAgentCommands`, `aiUsageLogs`. **No** es dueño de facturas, pagos, lecturas, comprobantes fiscales ni contratos: esos pertenecen a M05, M07, M03, M06 y M02. |
| Fuentes consolidadas | FIC 0–23 completo; RN-10 §1–§16 (incluye §2.1, §3.1–§3.6, §6.1, §12.1, §13, §14, §15, §16.1–§16.8); RN-12 §1–§6; RN-13 §1–§20; RN-03 §2 (WSAA), §4 (CAEA/CESP), §5 (padrones) y §6 (carpetas IN/OUT) en lo que hace al conector; DFA M29 (§30); BASE §13, §29 (trazabilidad de integraciones), §31, §39.4, §47 (canales y bot), §50 (autogestión y pago), §54 (alertas y auditoría), §55 (ERP-001), §59 (APIs), §60 (Google y seguridad), §61 (organismos y agente de retención), §66 (habilitación por tenant), §77 (Google Maps y Georef), §86 (Internet), §89 (gas), §97.2, §97.4, §97.5, §97.6, §100 (MER-014 a MER-017, MER-019, MER-020), §103 (grupos de facturación, efecto en conectores), §105 (solución 8); AGR-016, AGR-019, AGR-020, AGR-021, AGR-035, AGR hipótesis 5.5; CNX §2.6, §2.7, §4.6, §10; CAT §7 (entes y pagos), §31 (comunicaciones) y tablas de interfaces, fiscales, telemedición, Interbanking, firma, IA, AVL, API (`WS_*`) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.

---

## 1. Objetivo

Definir **una sola arquitectura de integración** para todo CoopApps y la **ficha completa de cada integración externa** que el sistema necesita para reemplazar a ProCoop y cumplir la BASE. El marco común resuelve, una vez y para todos los conectores:

1. Catálogo de proveedores y **conector por tipo** con capacidades declaradas.
2. **Conexión por tenant** con configuración propia, alcance y **modo prueba / producción**.
3. **Bóveda de credenciales cifrada** por tenant, con rotación, vencimientos y auditoría de uso.
4. **Certificados X.509** con generación de CSR, vencimiento y alertas escalonadas.
5. Ejecución confiable: **outbox + cola BullMQ** con reintentos, backoff, timeouts, **idempotencia**, **circuit breaker**, límites de tasa, prioridades y bandeja de operaciones detenidas.
6. **Bitácora de mensajes** con petición y respuesta **sin secretos**.
7. **Webhooks entrantes firmados**, con bandeja de entrada durable, deduplicación y reconsulta.
8. **Intercambio de archivos** por layouts declarativos (en lugar de las ~504 clases de ProCoop).
9. **Conciliación** por conector, **monitoreo y alertas**, **contingencia y reemplazo manual**.
10. **Agente local** para hardware (turnero, impresoras, lectores, balanza).

El objetivo de negocio es que sumar una red de cobranza, una pasarela, un fabricante de medidores o un organismo sea **configuración o un adaptador acotado**, nunca un cambio en los módulos de dominio; y que ninguna caída externa produzca cobros duplicados, numeración fiscal salteada o socios marcados como erróneos por un problema global (AGR-016, AGR-021).

## 2. Límite y responsabilidades

### 2.1 Qué hace T06

- Transporta, autentica, firma, valida formato, reintenta, registra y concilia el **intercambio técnico** con terceros.
- Mantiene el **contrato técnico** de cada integración (operaciones, formato, layout, códigos de error, estados externos) y lo traduce a **eventos y resultados neutrales** que consume el módulo dueño.
- Custodia secretos y certificados; nadie más los lee.
- Expone la operación (salud, bitácora, bandejas, alertas, contingencias) a la plataforma y al tenant.

### 2.2 Qué NO hace T06 (y a quién delega)

| Tema | Lo decide / es dueño | T06 solo… |
|---|---|---|
| Qué se cobra, imputación, recargos, saldo, rechazos y contracargos en cuenta corriente | **M07 COB** | Crea la intención en la pasarela, recibe y valida la confirmación, emite `int.payment-*` neutral. |
| Mora, corte y reconexión (cuándo y a quién) | **M08 MOR** + M10 TEC | Ejecuta el comando remoto aprobado y devuelve el resultado confirmado/incierto. |
| Cálculo fiscal, tipos de comprobante, alícuotas, percepciones, regímenes y su contenido | **M06 FIS** (y M05 para la emisión) | Firma con WSAA, llama a WSFE/padrones, genera/recibe archivos con el layout que M06 define. |
| Lecturas, validación de consumo, prepago (saldo, crédito) | **M03 MED** | Lee del MDM/telemedidor y pide tokens de crédito al fabricante. |
| Aprovisionamiento de Internet (cuándo activar, plan) | **M10 TEC** | Ejecuta en MikroTik/RADIUS/OLT y confirma. |
| Qué mensaje mandar, a quién, consentimiento, plantillas y audiencia | **T09 COM** | Entrega por el proveedor, recibe estados de entrega/lectura/rebote y mensajes entrantes. |
| API pública para terceros y BI (tokens, alcances, contrato de datos) | **T10 BIA** | Comparte el motor de credenciales y la bitácora; la API de datos se especifica en T10. |
| Login Google/OIDC, 2FA | **T02 IAM** | Custodia `clientSecret` y valida configuración del proveedor. |
| Migración desde ProCoop | **T07 MIG** | Provee importadores de archivos y el registro de identificadores externos. |
| Seguridad, cifrado, retención, pruebas no funcionales | **T08 NFR** | Cumple y aporta los controles específicos de integraciones. |
| Workflow de aprobaciones y expediente | **T11 WFL** | Solicita aprobación para cambios sensibles (modo producción, rotación, contingencia). |
| Parámetros y su versionado | **T04 CFG** | Declara sus `PRM-INT-*`; la publicación versionada es de T04. |

### 2.3 Regla de frontera

Un conector **nunca** escribe colecciones de otro módulo. Su salida es (a) el resultado de una operación que el módulo dueño pidió, o (b) un evento `int.*` publicado por outbox que el módulo dueño consume y aplica con sus propias reglas (DEC-003). Esto reemplaza al Agente de ProCoop, que escribía directamente `PAGOS360`, facturas, cajas y planillas desde Firebase (RN-10 §3, §12).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Proveedor | Organismo o empresa externa (ARCA, SIRO, Meta, Discar…). | `dict:int.provider` | Ente, entidad digital, sistema de telemedición |
| Conector (adaptador) | Código que implementa el contrato técnico de un tipo de proveedor y declara sus capacidades. | `dict:int.connector` | Clase `clsPagos360`, `Importador_Base`, `SistemaTelemedicion`… |
| Tipo de conector | Familia con interfaz común: `fiscal`, `padron`, `paymentGateway`, `collectionNetwork`, `directDebit`, `bankInfo`, `messaging.email`, `messaging.sms`, `messaging.whatsapp`, `messaging.push`, `meteringMdm`, `prepaidVending`, `networkProvisioning`, `telephonyCdr`, `fleetGps`, `maps`, `geocoding`, `identity`, `signature`, `llm`, `regulatorReport`, `fileExchange`, `localDevice`. | `dict:int.connectorType` | Enum `EntidadDigital.API`, `Sistemas_Telemedicion` |
| Capacidad | Operación que un conector soporta (ej. `createPaymentIntent`, `getPayment`, `listCollections`, `refund`, `cutService`, `requestCae`). Lo no declarado no se ofrece. | `dict:int.capability` | Métodos abstractos con `NotImplementedException` |
| Conexión | Instancia de un proveedor en un tenant, con configuración, alcance, credenciales y modo. Puede haber varias por proveedor. | `dict:int.connection` | Fila de `BANCOS`, `TELEMEDICION`, `INTERBANKING`, parámetros `V2_*` |
| Modo | `test` (homologación/sandbox) o `production`. | `dict:int.mode` | Base DEMO / prefijo "TEST" de clave |
| Bóveda | Almacén cifrado de secretos por tenant. | `dict:int.vault` | Parámetros `VARIABLE` y `.pro` en texto plano |
| Secreto | Valor sensible (clave, token, client secret, clave privada, frase). Solo escritura. | `dict:int.secret` | `PASS_TEL`, `CLIENT_SECRET`, `PASS`, variables 901, 2493… |
| Huella | Hash no reversible de un secreto para identificar versiones sin revelarlo. | `dict:int.fingerprint` | — |
| Certificado | X.509 con clave privada (ARCA WSAA, firma, mTLS). | `dict:int.certificate` | Archivo del parámetro 2071 |
| Ticket de acceso (TA) | Token+sign de WSAA, vigencia 12 h. | `dict:int.arcaTicket` | `TA<servicio>.xml` |
| Operación de integración | Unidad idempotente de trabajo externo con estado, intentos y resultado. | `dict:int.operation` | Fila `PAGOS360` (estados 0–6), `ELECTRONICA_FC`, `TELEMED_COMM` |
| Clave de idempotencia | Identificador estable de una operación por tenant que impide efectos duplicados. | `dict:int.idempotencyKey` | `COD_PAG`, `external_reference` |
| Resultado incierto | No se sabe si el proveedor aplicó la operación (timeout, corte). Requiere reconsulta. | `dict:int.uncertain` | — (no existía) |
| Circuit breaker | Corte automático de llamadas a una conexión que falla, con sondeo de recuperación. | `dict:int.circuitBreaker` | — |
| Bitácora de mensajes | Registro de cada petición/respuesta, saneado. | `dict:int.messageLog` | `AUDITORIA_TELEMEDICION`, `AUDIT_MAIL`, `SU_AUDIT_TRA_INTERBANKING`, `AUDIT_IA`, archivos `LogProcoop.txt` |
| Webhook | Notificación HTTP entrante de un proveedor. | `dict:int.webhook` | Aviso a CoopOnline → Firebase → Agente |
| Bandeja de entrada (inbox) | Persistencia durable de webhooks antes de procesarlos. | `dict:int.webhookInbox` | Nodos `Venta_{n}` / `Cobranza_{n}` de Firebase |
| Layout | Definición declarativa de un archivo (registros, campos, posiciones, DV). | `dict:int.fileLayout` | `MODEINT`, `FORMAINT`, `DATOSINT`, clases `E_*` / importadores |
| Intercambio de archivo | Instancia de un archivo generado o recibido con hash, totales y estado. | `dict:int.fileExchange` | Archivos en carpetas del servidor, `SIRO_BASEDEUDA`, `RED_LINK` |
| Rendición | Archivo o listado de pagos que devuelve una red/ente. | `dict:int.remittance` | Rendición |
| Publicación de deuda | Envío de la deuda cobrable a una red. | `dict:int.debtPublication` | Exportación / base de deuda |
| Conciliación | Comparación externo vs. interno con diferencias a revisión. | `dict:int.reconciliation` | `CONCILIACION_AUTO`, `RESBAN_MOVINT` |
| Contingencia | Período declarado en que una conexión opera en modo alternativo. | `dict:int.contingency` | — |
| Reemplazo manual | Registro humano, con evidencia, del resultado de una operación externa. | `dict:int.manualOverride` | Carga manual en panel del ente |
| Agente local | Programa instalado en una PC de la cooperativa que habla con hardware y con CoopApps por canal saliente. | `dict:int.localAgent` | `Agente Procoop.exe` / `clsServicio_Procoop` (que hacía mucho más) |
| Ficha | Descripción completa de una integración (`FI-INT-NN`, sección 12). | `dict:int.sheet` | Ficha de FIC |
| Identificador externo | Id de una entidad en un sistema externo, único por tenant y sistema. | `dict:int.externalRef` | `ID_360`, `ID_SIRO`, `ID_ENTIDAD`, `QR_ID`, `DEBITO_360_ID` |

## 4. Actores, permisos y alcance

| Rol | Capabilities `int.*` | Alcance de datos |
|---|---|---|
| Administrador de plataforma | `int.proveedores.ver`, `int.proveedores.configurar` (catálogo, URLs de ambientes, versiones de conectores), `int.monitoreo.ver` global, `int.alertas.gestionar` global, `int.conexiones.ver` (sin secretos) de todos los tenants | Plataforma (tenant `PLATFORM`) + metadatos de todos los tenants; **nunca** valores de secretos |
| Soporte de plataforma | `int.conexiones.ver`, `int.bitacora.ver`, `int.operaciones.reintentar` solo con acceso temporal autorizado (T01/AGR-034) | Tenant del expediente, mientras dure la autorización |
| Administrador del tenant | Todas las `int.*` del tenant salvo `int.proveedores.configurar` | Tenant |
| Responsable de integraciones del tenant | `int.conexiones.ver/crear/editar/configurar/probar`, `int.credenciales.gestionar`, `int.certificados.gestionar`, `int.webhooks.configurar`, `int.modo.cambiar` (requiere aprobación), `int.bitacora.ver`, `int.alertas.gestionar`, `int.agentes.gestionar` | Tenant, opcionalmente limitado a tipos de conector |
| Responsable fiscal / contador | `int.conexiones.ver` (fiscales), `int.certificados.gestionar` (ARCA), `int.archivos.ver/generar/aprobar` (regímenes), `int.contingencias.declarar` (fiscal), `int.operaciones.reintentar` (fiscal) | Conexiones de tipo `fiscal`, `padron`, `regulatorReport` |
| Tesorero / responsable de cobranza | `int.conexiones.ver` (pagos/redes/bancos), `int.archivos.ver/generar/importar/aprobar`, `int.conciliaciones.ver/aprobar`, `int.operaciones.reintentar`, `int.operaciones.resolverManual`, `int.contingencias.declarar` (pagos) | Conexiones `paymentGateway`, `collectionNetwork`, `directDebit`, `bankInfo` |
| Operador de caja | `int.operaciones.ver` de sus intenciones QR/POS | Sus cajas |
| Responsable técnico / red | `int.conexiones.ver` y `int.operaciones.reintentar` sobre `networkProvisioning`, `meteringMdm`, `prepaidVending`, `fleetGps`, `telephonyCdr` | Servicios y zonas asignados |
| Auditor | `int.bitacora.ver`, `int.bitacora.verPayload` (con registro de acceso), `int.operaciones.ver`, `int.conciliaciones.ver`, exportar | Tenant, solo lectura |
| Proceso técnico (worker) | Identidad de servicio por cola; descifra solo los secretos de las conexiones que ejecuta | Tenant de la operación |
| Proveedor externo (webhook) | Sin usuario; autenticado por firma/secreto de endpoint | Solo su `webhookEndpoint` |
| Agente local | Identidad de dispositivo emparejado; `int.agentes.ejecutar` implícito sobre sus dispositivos | Sucursal/puesto del emparejamiento |

Permisos negativos obligatorios: nadie (ni plataforma) obtiene por API o UI el valor de un secreto; `int.bitacora.ver` sin `verPayload` muestra metadatos y códigos, no cuerpos; un usuario de un tenant no ve conexiones, bitácoras ni alertas de otro (DEC-002).

Capabilities renombradas al formato `modulo.recurso.accion` en camelCase (corrección del 05-11-2026): `int.operaciones.resolverManual` (antes `int.operaciones.resolver-manual`) e `int.bitacora.verPayload` (antes `int.bitacora.ver-payload`).

## 5. Requisitos funcionales

### 5.1 Catálogo, conectores y conexiones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-001 | Catálogo de plataforma de proveedores (`integrationProviders`): código, nombre, tipo de conector, capacidades, protocolos, ambientes (`test`/`production`) con URLs base, esquema de configuración y de credenciales (solo nombres y tipo), soporte de webhook, versión de adaptador, estado. | RN-10 §14.1; RN-13 §19.2; FIC 4.4, 5.2, 17 | Núcleo | O0 | Adoptado | Un proveedor nuevo se agrega por semilla/migración sin tocar módulos de dominio; el catálogo se ve en `PAN-INT-01`. |
| RF-INT-002 | Conexión por tenant (`integrationConnections`): instancia de un proveedor con nombre, configuración no secreta, referencias a secretos y certificados, alcance, modo, estado, calendario y políticas; varias conexiones por proveedor (ej. dos convenios Red Link, varios CUIT o puntos de venta). | CNX §4.6; RN-12 §2; FIC 4.1 | Núcleo | O1 | Adoptado | Dos conexiones SIRO con convenios distintos operan sin interferirse; aislamiento por `tenantId`. |
| RF-INT-003 | Un conector solo se ofrece si la licencia del tenant lo incluye (capability de plataforma, T01) y el servicio asociado está habilitado (BASE §66). | BASE §66; DEC-007 | Núcleo | O1 | Adoptado | Sin licencia, la conexión no puede crearse ni ejecutarse (prueba negativa). |
| RF-INT-004 | Alcance de la conexión: servicios, sucursales, puntos de venta, cajas, canales, zonas; el módulo dueño elige la conexión por alcance. | RN-10 §6 (canales `CANALES_PAGOS`); RN-03 (puntos de venta) | Núcleo | O1 | Adoptado | Una caja con QR usa la conexión asignada a esa caja; otra caja usa otra. |
| RF-INT-005 | Capacidades declaradas por conector; la UI y los módulos solo invocan capacidades declaradas. Invocar una no declarada devuelve error tipado `capability-not-supported`. | RN-13 §2.2 (`NotImplementedException`) | Núcleo | O0 | Adoptado | Prueba unitaria por conector valida el manifiesto de capacidades. |
| RF-INT-006 | "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. `FEDummy`, `Healthcheck` ProvinciaNet, login OAuth, `GET account/balances`) y registra resultado en bitácora. | CNX §4.6; RN-13 §12; RN-03 §2 | Núcleo | O1 | Adoptado | Resultado visible en `PAN-INT-03` con latencia y código; no expone secretos. |
| RF-INT-007 | Cambios de configuración versionados con vigencia y auditoría (antes/después sin secretos). Cambios en conexiones `production` de tipo fiscal, pagos, débito o red requieren aprobación (T11). | BASE §54 GOB-004; AGR-021 | Núcleo | O1 | Adoptado | Cambio sin aprobación queda en borrador; la aprobación genera su propio evento de auditoría. |
| RF-INT-008 | Copiar configuración de una conexión entre tenants autorizados **sin** secretos, certificados, identificadores externos ni estados. | BASE §81 | Estándar | O2 | Adoptado | La copia queda en borrador y exige cargar credenciales propias. |
| RF-INT-009 | Suspender o desactivar una conexión sin perder historia; las operaciones en curso terminan, se reencolan a otra conexión permitida o pasan a contingencia según la política. | BASE §66 (no borrar historia) | Núcleo | O1 | Adoptado | Desactivar no borra bitácora ni operaciones; las pendientes quedan con estado explícito. |
| RF-INT-010 | Conexión por defecto por propósito y cadena de respaldo configurable (ej. pasarela para el portal: canal del socio → por defecto del tenant → offline). | RN-13 §2.4 (2774, 2500, 901/904, 2645) | Estándar | O5 | Adoptado | La cadena se configura por tenant; nunca se cae en una pasarela no configurada. |
| RF-INT-011 | Versionado de adaptadores (`adapterVersion`) y migración de conexiones entre versiones con prueba previa. | AGR-021 (versiones) | Estándar | O1 | Adoptado | Una conexión puede quedar fijada a una versión hasta su migración. |
| RF-INT-012 | Conexiones del tenant `PLATFORM` compartidas (ej. Google Maps, email de plataforma, LLM de plataforma) con consumo atribuido por tenant. | CNX §2.7; BASE §77 | Estándar | O1 | A validar (PA-INT-01) | Reporte de consumo por tenant; un tenant puede reemplazarla por una propia si la licencia lo permite. |
| RF-INT-013 | Consumo y costo por tenant (mensajes, consultas de mapas, tokens IA, consultas ARCA) para facturación de plataforma y cuotas. | AGR-020; BASE §77 (cuotas) | Estándar | O1 | Adoptado | Panel de consumo mensual por conexión y tenant. |
| RF-INT-014 | Ficha técnica y ayuda contextual por conector (qué hace, qué pide, cómo obtener credenciales, ambiente de prueba). | Guía §8 (`ScreenHelp`) | Estándar | O1 | Adoptado | `PAN-INT-02` muestra la ficha `FI-INT-NN` correspondiente. |

### 5.2 Bóveda de credenciales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-015 | Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con `keyId` y versión. | RN-10 §14.5; RN-13 §19.2; CNX §4.6, §10; BASE §97.2 | Núcleo | O0 | Adoptado (DEC-074: clave maestra en AWS KMS) | Un volcado de Mongo no permite recuperar ningún secreto; prueba de restauración con KMS. |
| RF-INT-016 | Secretos de solo escritura: UI y API devuelven nombre, tipo, huella (HMAC), últimos 4 caracteres cuando el tipo lo permite, fecha de carga, autor, vencimiento y estado. Nunca el valor. | BASE §59 (no entregar secretos); RN-10 §13 | Núcleo | O1 | Adoptado | Prueba negativa: ningún endpoint ni export contiene el valor. |
| RF-INT-017 | Rotación con doble versión: la nueva versión queda `pending` hasta probar la conexión; al confirmar pasa a `active` y la anterior a `rotated` (con período de gracia configurable) y luego `revoked`. | RN-10 §14.5; BASE §59 (rotación) | Núcleo | O1 | Adoptado | Durante la rotación no hay operaciones fallidas por credencial. |
| RF-INT-018 | Política de rotación por tipo de secreto (días) con recordatorio y alerta; rotación forzada ante incidente. | BASE §59, §60 | Estándar | O1 | Adoptado | Alerta `credential_rotation_due` a los responsables. |
| RF-INT-019 | Vencimiento de credenciales conocido (tokens de larga vida de WhatsApp, refresh tokens, claves con expiración) con alertas escalonadas. | AGR-021 | Núcleo | O1 | Adoptado | Igual esquema que certificados (RF-INT-025). |
| RF-INT-020 | Auditoría de uso: cada descifrado registra proceso/usuario, conexión, operación y momento (sin valor). | BASE §29; RN-10 §13 | Núcleo | O1 | Adoptado | Reporte de accesos por secreto. |
| RF-INT-021 | Separación por ambiente: claves maestras distintas para ambientes productivos y no productivos; un worker no productivo no puede descifrar secretos de producción. | AGR-035; CNX §10 V-02 | Núcleo | O0 | Adoptado | Prueba: el worker de staging falla al descifrar un secreto de producción. |
| RF-INT-022 | Caché de tokens de sesión (TA de WSAA, access tokens OAuth, tokens de sesión SIRO/ProntoPago/Macro) cifrada, compartida entre workers, con renovación anticipada (margen configurable) y bloqueo distribuido para no pedir dos a la vez. | RN-03 §2.2; RN-13 §4.1, §7, §9, §13, §16.1 | Núcleo | O4 | Adoptado | Con 4 workers en paralelo se solicita un solo TA por servicio y CUIT. |
| RF-INT-023 | Credenciales heredadas de ProCoop se consideran comprometidas: no se importan; se solicita al tenant regenerarlas en cada proveedor antes de operar en producción. | RN-10 §13; RN-13 §17 | Núcleo | O4–O11 | Adoptado | Checklist de migración exige rotación por conexión (T07). |

### 5.3 Certificados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-024 | Generar par de claves (RSA 2048 o superior) y CSR en el servidor con los datos del tenant (CUIT en el *subject*, alias); la clave privada nunca sale de la bóveda. Alternativa: subir PFX/P12 con contraseña. | RN-03 §2.1 (PFX sin clave); BASE §97.2 | Núcleo | O4 | A validar (PA-INT-03) | El certificado subido se valida contra la clave (módulo), CUIT del *subject*, vigencia y emisor. |
| RF-INT-025 | Alertas de vencimiento escalonadas (30, 14, 7, 3 y 1 días, y vencido) por in-app, email y tablero, a responsables del tenant y a plataforma. | RN-03 §2.3 (14/7/3); RN-10 §8 (2925) | Núcleo | O4 | Adoptado | Simulación de fecha genera las 6 alertas una sola vez cada una (deduplicación). |
| RF-INT-026 | Varios certificados por conexión (vigente y próximo) para renovar sin corte; cambio de certificado activo auditado. | AGR-021 | Núcleo | O4 | Adoptado | El TA se renueva con el nuevo certificado sin detener la cola. |
| RF-INT-027 | Certificado vencido, revocado o rechazado ("expirado") ⇒ la conexión pasa a `blocked_credential`, la cola se pausa y los documentos quedan `pending` (no `rejected`). | RN-03 §2.2; AGR-021 ejemplo | Núcleo | O4 | Adoptado | Ningún comprobante cambia a rechazado por un error de certificado. |

### 5.4 Modo prueba / producción

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-028 | Modo `test` / `production` por conexión, con URLs del catálogo; cambio de modo auditado, con aprobación y prueba de conexión obligatoria. | RN-13 §2.1 (sin homologación); RN-03 §2.1 | Núcleo | O1 | Adoptado | No hay URLs ni claves "TEST" mezcladas; el modo es un campo explícito. |
| RF-INT-029 | Indicador visible "MODO PRUEBA" en toda pantalla y documento que use una conexión `test`; los documentos emitidos en prueba llevan marca sin validez. | AGR-035 | Núcleo | O1 | Adoptado | PDF de factura en prueba lleva leyenda; no se envía al socio salvo destinatarios de prueba. |
| RF-INT-030 | Los ambientes no productivos de la plataforma solo pueden usar conexiones en `test` (bloqueo duro en el worker). | AGR-035; RN-10 §2.1 (DEMO no envía) | Núcleo | O0 | Adoptado | Staging con una conexión en `production` no ejecuta y alerta. |
| RF-INT-031 | Simulador por conector (respuestas sintéticas deterministas, incluidas fallas y demoras) para desarrollo, demo y pruebas automatizadas. | AGR-035 | Estándar | O0 | Adoptado | Escenarios ESC con simulador reproducen timeout, rechazo, duplicado e incierto. |

### 5.5 Ejecución confiable (outbox, colas, reintentos, idempotencia, circuit breaker)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-032 | Toda llamada externa originada por un cambio de negocio se registra como `integrationOperation` en la **misma transacción** que el cambio (outbox) y se ejecuta en un worker. | DEC-003; AGR-016 | Núcleo | O0 | Informado | Si el proceso cae después del commit, la operación se ejecuta igual al reiniciar. |
| RF-INT-033 | Colas BullMQ por categoría (`int-fiscal`, `int-payments`, `int-files`, `int-messaging`, `int-metering`, `int-network`, `int-ai`, `int-webhooks`, `int-maintenance`) con concurrencia por tenant y por conexión (aislamiento de carga). | AGR-020; CNX §2.6 | Núcleo | O0 | Adoptado | Un tenant con 12.500 comprobantes no demora el cobro QR de otro tenant (prueba de carga). |
| RF-INT-034 | Reintentos con backoff exponencial y *jitter* (base, factor, tope y máximo de intentos por categoría de error y conector). | RN-13 §2.1 (sin reintentos), §19.3 | Núcleo | O0 | Adoptado | Un 503 se reintenta; un 400 de validación no. |
| RF-INT-035 | Taxonomía de errores normalizada: `transient`, `rate_limited`, `auth`, `credential_expired`, `validation`, `business_rejected`, `not_found`, `conflict`, `uncertain`, `circuit_open`, `config`, `unknown`; cada conector mapea sus códigos. | RN-13 §2.1 (errores como string); AGR-021 | Núcleo | O0 | Adoptado | La bandeja muestra causa accionable y el mapeo es testeado. |
| RF-INT-036 | Timeouts explícitos de conexión y lectura por conector y operación (default WSFE 90 s). | RN-03 §2.2; RN-13 §2.1 | Núcleo | O0 | Adoptado | Ninguna llamada usa el timeout por defecto del cliente HTTP. |
| RF-INT-037 | Idempotencia: clave `tenantId + operationType + businessKey`; si existe una operación `succeeded` se devuelve su resultado; si está en curso se espera; el conector envía la clave al proveedor cuando lo soporta (`X-Idempotency-Key`, `external_reference`, número de comprobante). | AGR-016; BASE §13, §31; RN-13 §19.2 | Núcleo | O0 | Informado | El mismo pago notificado 3 veces produce 1 sola confirmación (CU-13). |
| RF-INT-038 | Estado `uncertain`: ante timeout o corte sin respuesta en operaciones no idempotentes del lado del proveedor, se ejecuta la **consulta de reconciliación** del conector (ej. `FECompUltimoAutorizado` + `FECompConsultar`, `GET payment-request/{id}`) antes de cualquier reintento. | FIC 2.1; BASE §10 caso crítico; AGR hipótesis 5.5 | Núcleo | O4 | Adoptado | Un timeout en `FECAESolicitar` nunca genera un segundo número para el mismo comprobante. |
| RF-INT-039 | Circuit breaker por conexión y por operación: abre al superar el umbral de fallos en una ventana, retiene la cola, pasa a semiabierto con sondeo y cierra tras éxitos consecutivos; estado visible y evento al abrir/cerrar. | AGR-021 (indisponibilidad) | Núcleo | O0 | Adoptado | Caída simulada de SIRO abre el circuito en ≤ umbral y no agota reintentos de miles de operaciones. |
| RF-INT-040 | Límite de tasa saliente por proveedor, conexión y tenant (token bucket en Redis), incluido el lote "N mensajes cada M segundos". | RN-10 §2.1 (404/461), §5 (2872); BASE §77 (cuotas) | Núcleo | O0 | Adoptado | Envío masivo respeta el límite configurado sin errores 429 sostenidos. |
| RF-INT-041 | Prioridad: operaciones interactivas (caja, portal, QR) antes que batch (lotes, publicación masiva). | AGR-020 | Núcleo | O0 | Adoptado | En plena emisión masiva, un CAE de caja se obtiene en el tiempo objetivo de T08. |
| RF-INT-042 | Pausar/reanudar manualmente una conexión, una operación tipo o un punto de venta (equivalente a `PTOVENTA.PAUSAR`). | RN-03 §3.1 | Núcleo | O1 | Adoptado | Pausado, las operaciones quedan `queued` y la UI lo indica. |
| RF-INT-043 | Bandeja de operaciones detenidas (fallidas permanentes, inciertas no resueltas, bloqueadas por credencial) con filtros, causa, acción sugerida, reintentar, cancelar y resolver manualmente con evidencia. | AGR-016, AGR-021 | Núcleo | O1 | Adoptado | Toda operación no exitosa tiene un estado final o una tarea pendiente asignada. |
| RF-INT-044 | Correlación: `correlationId` desde la acción del usuario/job hasta operación, mensajes, eventos y auditoría; `requestId` en errores RFC 9457. | BASE §54; CNX §2.6 | Núcleo | O0 | Adoptado | Desde una factura se navega a todas sus operaciones y mensajes. |
| RF-INT-045 | Debounce por intención: consultas repetidas del mismo estado en menos de N segundos se agrupan (equivalente a `FEC_CONSULTA` 10 s). | RN-10 §3.4 | Estándar | O5 | Adoptado | Doble clic en "verificar pago" produce una sola consulta. |
| RF-INT-046 | Los efectos se aplican vía eventos al módulo dueño; el conector no escribe colecciones de otros módulos. | DEC-003; RN-10 §3, §12 | Núcleo | O0 | Informado | Revisión de dependencias: los paquetes `integrations/*` no importan modelos de otros módulos. |

### 5.6 Bitácora de mensajes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-047 | Bitácora de cada mensaje (HTTP/SOAP/archivo/SFTP/TCP/SSH/SQL/email/webhook) con dirección, endpoint sin parámetros sensibles, método, estado, duración, tamaño, intento, ambiente, operación y correlación. | BASE §31 (registro de errores); CAT `AUDITORIA_TELEMEDICION`, `AUDIT_MAIL`, `SU_AUDIT_TRA_INTERBANKING`, `AUDIT_IA` | Núcleo | O0 | Adoptado | Cada operación tiene ≥ 1 mensaje registrado. |
| RF-INT-048 | Saneamiento obligatorio antes de persistir: se eliminan headers de autorización, cookies, tokens, contraseñas, claves, `sign`/`token` de WSAA, datos de tarjeta (PAN, CVV, vencimiento), CBU completo (enmascarado) y campos marcados por el conector; se registra la lista de redacciones. | RN-13 §17 (Log360.txt); RN-10 §13 | Núcleo | O0 | Adoptado | Test automatizado inyecta secretos conocidos y verifica que no aparecen en bitácora, logs de aplicación ni errores. |
| RF-INT-049 | Cuerpos mayores a un umbral se guardan en almacenamiento privado (clave + hash SHA-256); retención configurable por tipo. | CNX §2.6 (S3 privado) | Núcleo | O0 | A validar (PA-INT-15) | La purga respeta la retención y deja el metadato. |
| RF-INT-050 | Ver cuerpos requiere `int.bitacora.verPayload` y queda auditado. | BASE §54 (acceso restringido) | Núcleo | O1 | Adoptado | Acceso sin capability muestra solo metadatos. |
| RF-INT-051 | Búsqueda y exportación de bitácora por conexión, operación, entidad de negocio, estado, fecha y correlación. | BASE §31 | Estándar | O1 | Adoptado | Export XLSX/CSV sin cuerpos salvo capability. |
| RF-INT-052 | Los logs de aplicación (stdout) nunca contienen cuerpos de integraciones; solo ids y códigos. | RN-13 §2.1 (`LogProcoop.txt`) | Núcleo | O0 | Adoptado | Lint/regla de logging verificada en CI. |

### 5.7 Webhooks entrantes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-053 | Endpoint de webhook por conexión en `/api/public/{tenantSlug}/webhooks/{endpointKey}` con `endpointKey` aleatorio no adivinable; rotación del endpoint. El tenant se toma de la conexión dueña del `endpointKey`, nunca del `tenantSlug` de la ruta; si el slug no coincide con el tenant de esa conexión, se responde 404 sin procesar el cuerpo y se audita (DEC-092). | RN-13 §2.3, §19.3 | Núcleo | O5 | Adoptado | Un endpoint de un tenant no acepta eventos de otro. |
| RF-INT-054 | Verificación de autenticidad según el proveedor: firma HMAC (ej. `X-Hub-Signature-256` de Meta, `x-signature` de Mercado Pago), secreto compartido, mTLS o lista de IP; ventana anti-replay por timestamp. | RN-13 §2.3 (sin firma); CNX §2.7 | Núcleo | O5 | Adoptado | Firma inválida ⇒ 401, registro y alerta; sin efectos. |
| RF-INT-055 | Bandeja de entrada durable: se persiste el evento, se responde 2xx en < 2 s y se procesa en cola `int-webhooks`; deduplicación por id de evento del proveedor o hash. | RN-10 §3.1 (Firebase); AGR-016 | Núcleo | O5 | Adoptado | Reenvíos del proveedor no generan efectos repetidos. |
| RF-INT-056 | El webhook es **disparador**: antes de un efecto económico se reconsulta el estado al proveedor con credenciales propias (salvo excepción documentada en la ficha). | RN-13 §2.3, §19.3 | Núcleo | O5 | Adoptado | Un webhook falso con firma válida pero pago inexistente no confirma nada. |
| RF-INT-057 | El retorno del navegador (`back_url`, página de éxito) nunca confirma un pago. | BASE §13 | Núcleo | O5 | Informado | El socio que vuelve a "éxito" ve "pago en verificación" hasta la confirmación. |
| RF-INT-058 | Webhooks de verificación de suscripción (ej. `hub.challenge` de Meta) resueltos por el conector. | CNX §2.7 | Estándar | O2 | Adoptado | Alta del webhook de WhatsApp sin intervención manual. |

### 5.8 Intercambio de archivos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-059 | Layouts declarativos versionados (`fileLayouts`): ancho fijo, CSV (separador configurable), XLSX, XML, JSON, TXT de ARCA, lectura DBF/Access para migración; registros de cabecera/detalle/pie; campos con posición, largo, tipo, relleno, alineación, decimales, formato de fecha, origen/destino; archivo de control asociado. Cada layout de exportación de deuda a entes de cobro declara cuántos vencimientos admite (`fileLayouts.dueDateCapacity`), que M07 usa para limitar lo publicado al ente y M05 para validar el tope de vencimientos (DEC-106; M07 RF-COB-099, RN-COB-159; M05 RN-FAC-163). | RN-10 §7, §14.6; FIC 4, 4.4; CAT `MODEINT`, `FORMAINT`, `DATOSINT`, `TIPOMOD`, `SERVINT`; DEC-106 | Núcleo | O5 | Adoptado | Red Link 19/10 y SIRO LAG se generan con layouts, sin clases específicas, y coinciden byte a byte con ProCoop. |
| RF-INT-060 | Hooks de código acotados por layout para lo no declarable (DV especiales, reglas de ramas por cooperativa como el "0" antepuesto al convenio SIRO de LAG). | RN-12 §1 | Núcleo | O5 | Adoptado | El hook se versiona con el layout y tiene prueba con archivo de referencia. |
| RF-INT-061 | Biblioteca de algoritmos de dígito verificador (módulo 10, módulo 11, Luhn, ponderados por ente; los 9 de `Codigo_Base`) y generador de códigos de barras/pago parametrizable por ente y cooperativa. | FIC 4.3 | Núcleo | O4 | Adoptado | El código de barras de LAG coincide con el de ProCoop para la misma factura (paralelo). |
| RF-INT-062 | Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. | FIC 4.1, 22 | Núcleo | O5 | Adoptado | El archivo entregado se puede reproducir y su hash coincide. |
| RF-INT-063 | Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. | BASE §31 CU-31; CNX §4.6 | Núcleo | O5 | Informado | Reprocesar el mismo archivo no duplica pagos (CU-31 excepción). |
| RF-INT-064 | Estados diferenciados: **generado ≠ entregado ≠ aceptado** (y para regímenes: presentado ≠ aceptado). | BASE §61 control | Núcleo | O4 | Informado | Exportar un archivo no marca "Presentado". |
| RF-INT-065 | Transporte SFTP con clave privada en bóveda y huella de host fijada; FTP sin cifrar prohibido salvo excepción aprobada y registrada. | FIC 22 (`TransferirFTP`) | Estándar | O5 | Adoptado | Conexión SFTP con huella distinta falla y alerta. |
| RF-INT-066 | Validaciones comunes de importadores: duplicados, importes, comprobante inexistente/anulado/bloqueado, titular notificado, fuera de término (con la política de M07). | FIC 4 (`Importador_Base`); RN-12 §2 | Núcleo | O5 | Adoptado | Cada línea queda `applied`, `rejected` (con causa) o `review`. |

### 5.9 Conciliación, monitoreo, alertas y contingencia

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-067 | Motor de conciliación por conector con tipos: pagos (externo vs. confirmado), publicación de deuda (enviado vs. aceptado), fiscal (CAE locales vs. ARCA), banco (movimientos vs. libro), mensajería (enviado vs. entregado). | BASE §13; RN-13 §16.3, §19.3 | Núcleo | O5 | Informado | Cada ejecución produce un acta con totales y diferencias. |
| RF-INT-068 | Ventana de conciliación configurable (default 4 días) y alta de transacciones externas sin intención previa ("pago app") a bandeja de revisión. | RN-13 §2.3, §3.3; RN-10 §12.1 | Núcleo | O5 | Adoptado | Un pago hecho desde la app del proveedor aparece en revisión, no se pierde. |
| RF-INT-069 | Bruto, comisión, IVA de comisión y neto se informan por separado al módulo dueño. | BASE §13 CU-13; RN-13 §3.2 | Núcleo | O5 | Informado | ARS 8.000 / 160 / 7.840 del CU-13 se reproducen. |
| RF-INT-070 | Estado observable por conexión: salud, último éxito, tasa de error, latencia p95, backlog, circuito, credenciales y certificados por vencer, próximas ejecuciones. | AGR-021; BASE §54 | Núcleo | O1 | Informado | `PAN-INT-04` muestra el semáforo por conexión. |
| RF-INT-071 | Alertas con tipo, severidad, deduplicación, destinatarios, reconocimiento, resolución y vínculo al objeto (conexión, operación, archivo, certificado). | BASE §54 GOB-003 | Núcleo | O1 | Informado | Una alerta repetida incrementa contador, no crea otra. |
| RF-INT-072 | Tablero de plataforma (todas las conexiones de todos los tenants, sin secretos) y tablero del tenant. | BASE §54 GOB-001/002 | Núcleo | O1 | Informado | Plataforma ve "errores de procesos e integraciones" por tenant. |
| RF-INT-073 | Métricas y trazas exportables (OpenTelemetry) por conector y tenant (T08). | AGR-020 | Estándar | O0 | Adoptado | Métricas disponibles en el stack de observabilidad. |
| RF-INT-074 | Declarar contingencia por conexión (manual o sugerida por circuito abierto prolongado) con el modo alternativo de su ficha: CAEA (fiscal), archivo manual (redes/entes), cola diferida (mensajería), proveedor alternativo (email/SMS), registro manual con evidencia (pagos), operación manual en campo (corte/reconexión). | AGR-021; BASE §97.2 (CAEA contingencia) | Núcleo | O4–O5 | Adoptado | La contingencia tiene inicio, fin, operaciones afectadas y reconciliación de cierre. |
| RF-INT-075 | Reemplazo manual con doble control: un usuario con `int.operaciones.resolverManual` registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado `manual_resolved` y se concilia después. | AGR-016 (bandeja para no reparables) | Núcleo | O5 | Adoptado | Un pago confirmado a mano sin evidencia no se puede aprobar. |
| RF-INT-076 | Cierre de contingencia exige conciliación completa (ej. informar CAEA, reprocesar archivos, verificar inciertos). | AGR-021 | Núcleo | O4 | Adoptado | No se puede cerrar con operaciones inciertas abiertas. |
| RF-INT-077 | Calendario de ejecuciones programadas por conexión (cron en zona horaria del tenant), con historial, saltos y ejecución manual. | RN-10 §12.1; FIC 22 | Núcleo | O1 | Adoptado | Reemplaza las tareas del Agente con trazabilidad. |

### 5.10 Identificadores, seguridad, agente local, mensajería e IA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INT-078 | Registro de identificadores externos (`externalReferences`) por entidad, único por `tenantId + system + externalId`, con historia. | BASE §31 | Núcleo | O0 | Informado | No pueden existir dos pagos con el mismo id externo del mismo sistema. |
| RF-INT-079 | Lista de salida permitida (egress allowlist) por conector; prohibido destino arbitrario configurado por el tenant salvo tipos "genéricos" validados (anti-SSRF). | CNX §10 V-05 | Núcleo | O0 | Adoptado | Una URL base hacia red interna es rechazada. |
| RF-INT-080 | TLS 1.2+ con validación de certificados del servidor siempre activa; no existe opción para desactivarla. | RN-10 §2 (variable 3160) | Núcleo | O0 | Adoptado | No hay parámetro equivalente a 3160. |
| RF-INT-081 | Los datos de tarjeta nunca pasan por CoopApps: formularios alojados o tokenización del proveedor (alcance PCI mínimo). | RN-13 §3.7, §17 | Núcleo | O5 | Adoptado | Revisión de código: ningún DTO contiene PAN/CVV. |
| RF-INT-082 | Minimización: a cada proveedor se envían solo los datos necesarios; los datos personales enviados se documentan en la ficha. | BASE §59 (minimización) | Núcleo | O0 | Adoptado | Ficha con sección "Datos intercambiados" completa. |
| RF-INT-083 | Escaneo de secretos en el repositorio y en imágenes (CI) bloquea el merge. | RN-10 §13; CNX §10 hallazgo propio | Núcleo | O0 | Adoptado | Commit con un token de prueba falla en CI. |
| RF-INT-084 | Agente local CoopApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de resultado; sin puertos entrantes. | FIC 19; RN-10 §11, §16.1; DEC-007 | Estándar | O10 | Adoptado | Un turno llamado en la PWA aparece en la pantalla del turnero vía agente en < 2 s. |
| RF-INT-085 | Mensajería (email, SMS, WhatsApp, push) como conectores del marco: T09 decide qué y a quién; T06 entrega, aplica límites, registra estados (enviado, entregado, leído, rebotado, fallido) y recibe mensajes entrantes. | CNX §2.7; RN-10 §2, §5 | Núcleo | O0–O2 | Adoptado | Un rebote actualiza el estado del destinatario en T09 por evento. |
| RF-INT-086 | Proveedor LLM como conector con abstracción multi-proveedor, registro de uso (`aiUsageLogs`: función, modelo, tokens, costo, usuario), redacción de datos personales y política "IA solo propone". | CNX §2.1 (IA), §4.5; FIC 20; CAT `AUDIT_IA` | Estándar | O2 | A validar (PA-INT-08) | Toda propuesta IA queda pendiente de confirmación humana. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-INT-001 | Frontera de módulos: el conector no escribe colecciones de otros módulos. | El Agente registra facturas, pagos, cajas y planillas desde Firebase (RN-10 §3.3–§3.4). | **Reemplazar** por eventos `int.*` consumidos por M07/M03/M10. | — | — |
| RN-INT-002 | Webhook como disparador y reconsulta autenticada antes de efectos. | `ConsultarPago<T>` reconsulta la pasarela tras el aviso (RN-13 §2.3). | **Replicar.** | PRM-INT-020 | — |
| RN-INT-003 | Deduplicación de pagos por id externo. | `PAGOS360_PAGOS` deduplica por `ID_360`, `ID_SIRO`, `ID_MERCADO_PAGO` (RN-13 §3.3, §4.3, §5). | **Replicar** con índice único en `externalReferences`. | — | — |
| RN-INT-004 | Reutilizar link/intención idéntica vigente. | Reutiliza link idéntico de los últimos 10 min (RN-13 §2.2). | **Replicar** parametrizable. | PRM-INT-021 | — |
| RN-INT-005 | Antes de reintentar un lote fiscal se consulta el último autorizado. | Diseño propuesto FIC 2.1. | **Replicar** (obligatorio). | — | — |
| RN-INT-006 | Ventana de conciliación de pagos por API. | Últimos 4 días (`Procesar_Archivo_Rendicion`, RN-13 §2.3). | **Replicar** parametrizable. | PRM-INT-022 | — |
| RN-INT-007 | Confirmación de QR en caja. | Polling cada pocos segundos hasta 10 min (RN-13 §2.3). | **Mejorar**: webhook + aviso en tiempo real a la caja (SSE/WebSocket); polling con backoff como respaldo, tope configurable. | PRM-INT-023 | — |
| RN-INT-008 | Sin esperas fijas bloqueantes. | SIRO espera 25 s (2776) antes de cada consulta; ProvinciaNet espera 10 s fijos (RN-13 §4.3, §12). | **Descartar**: reintentos asíncronos con backoff. | — | — |
| RN-INT-009 | Confirmación solo por consulta autenticada al proveedor. | ProvinciaNet toma como pagado el importe que informa el portal (RN-13 §12, §17). | **Reemplazar.** | — | — |
| RN-INT-010 | QR estático: una referencia por transacción. | Empareja por fecha + importe en la misma caja (ambiguo) (RN-13 §3.4). | **Reemplazar** por referencia única por cobro (`new-transaction` con referencia) o QR dinámico. | — | — |
| RN-INT-011 | Importe pagado distinto del recalculado. | "Los importes de la cobranza no coinciden": no imputa (RN-10 §3.4; RN-13 §2.3). | **Mejorar**: el conector confirma el pago tal como lo informa el proveedor; M07 aplica su regla y deriva diferencias a revisión. | — | — |
| RN-INT-012 | Credenciales por conexión y no por proceso. | Propiedades estáticas: un proceso = una cooperativa; el token de MP exige reiniciar (RN-13 §2.1). | **Reemplazar**: credenciales resueltas por operación desde la bóveda. | — | — |
| RN-INT-013 | Caché de tokens según `expires_in` con margen. | SIRO reutiliza 10 min; Interbanking persiste 7200 s; NaranjaX sin control; Pagos TIC hace login en cada llamada (RN-13 §4.1, §7, §9, §16.1). | **Mejorar** (RF-INT-022). | PRM-INT-005 | — |
| RN-INT-014 | Cola de correo con estados y lotes. | `AUDIT_MAIL.PENDIENTE` 1 → 4 → 2/3; N mails cada M s (404/461) (RN-10 §2.1). | **Replicar** como estados de entrega y límite de tasa por proveedor. | PRM-INT-030, PRM-INT-031 | — |
| RN-INT-015 | La cola no se traba por concurrencia. | Bandera `EnviandoMails` puede quedar en verdadero y frenar la cola (posible bug, RN-10 §2.1). | **Descartar** (locks con expiración de BullMQ). | — | [VERIFICAR] en logs de LAG si ocurrió (dato para migración). |
| RN-INT-016 | Error explícito si no se puede tomar un recurso. | `EnvioMail` devuelve falso sin enviar ni informar si no consigue el bloqueo (RN-10 §2.1). | **Reemplazar** por error tipado reintentable. | — | — |
| RN-INT-017 | Adjuntos referenciados por clave de almacenamiento. | Guarda solo el nombre y lo busca en 4 carpetas (RN-10 §2.1). | **Reemplazar** por `storageKey` + hash. | — | — |
| RN-INT-018 | Reintento por proveedor alternativo de correo. | Destinatarios Yahoo por SMTP con reintento por SES (RN-10 §2.1). | **Descartar** la regla por dominio; **adoptar** failover genérico entre conexiones de email configuradas. | PRM-INT-032 | — |
| RN-INT-019 | Correo con dominio propio del tenant. | SES de una cuenta compartida del proveedor según dominio `cooponline*` (RN-10 §2). | **Reemplazar**: dominio verificado por tenant (SPF, DKIM, DMARC) (FIC 13.1). | — | — |
| RN-INT-020 | Clave privada del certificado ARCA cifrada. | PFX/P12 sin contraseña en carpeta (RN-03 §2.1). | **Reemplazar** (RF-INT-024). | — | — |
| RN-INT-021 | Avisos de vencimiento de certificado. | 14/7/3 días, solo al iniciar escritorio y con permiso `ControlTitularesProcoopWeb` (RN-03 §2.3). | **Mejorar** a 30/14/7/3/1 por canales y tablero. | PRM-INT-006 | — |
| RN-INT-022 | TA de WSAA reutilizado hasta vencer, compartido. | Caché en memoria y en `TA<servicio>.xml` (RN-03 §2.2). | **Replicar** en caché cifrada compartida. | — | — |
| RN-INT-023 | CUIT representado explícito. | Si hay varias relaciones usa "la segunda" (RN-03 §2.2). | **Reemplazar**: `cuitRepresentado` configurado y validado contra el TA. | — | — |
| RN-INT-024 | Ambiente que no puede emitir. | Base DEMO bloquea FE y SMTP (RN-03 §2.1; RN-10 §2.1). | **Replicar** como RF-INT-030. | — | — |
| RN-INT-025 | Timeout de WSFE. | 90 s (RN-03 §2.2). | **Replicar** parametrizable. | PRM-INT-007 | — |
| RN-INT-026 | Lotes de SMS. | Lotes de 50 por POST (RN-10 §5). | **Replicar** como tamaño de lote por proveedor. | PRM-INT-033 | — |
| RN-INT-027 | Ritmo de WhatsApp y número de destino. | Demora entre mensajes 2872; destino 2824, 3051, 3121 (RN-10 §5). | **Replicar** el ritmo (T06); la elección de destino es de T09. | PRM-INT-034 | — |
| RN-INT-028 | Débito con tarjeta y día de corte. | Si el día del primer vencimiento ≥ 2779 (19), el débito pasa al mes siguiente (RN-13 §3.5). | **Replicar** como parámetro del conector de débito (la decisión de qué debitar es de M07). | PRM-INT-040 | — |
| RN-INT-029 | Modo explícito, no por prefijo de clave. | `key.Replace("TEST","")` en Pagos360 (RN-13 §2.1). | **Reemplazar** (RF-INT-028). | — | — |
| RN-INT-030 | Deduplicación de movimientos bancarios. | Interbanking deduplica por cuenta + importe + correlativo + fechas (RN-13 §16.2). | **Replicar.** | — | — |
| RN-INT-031 | Conciliación bancaria. | Manual N:M (`RESBAN_MOVINT`), sin reglas (RN-13 §16.3). | **Mejorar**: sugerencias automáticas por importe/fecha/referencia + confirmación manual N:M (M14). | — | — |
| RN-INT-032 | Avisos del portal y pagos web. | Firebase escuchado por el Agente; reinicio por temporizador (RN-10 §3.1). | **Reemplazar** por portal en la misma API y webhooks directos. | — | Intervalo del temporizador desconocido (RN-10 §15.11): irrelevante tras el reemplazo. |
| RN-INT-033 | Vencimiento de intención de pago. | Solicitud prepaga descartada si tiene más de 600 s (RN-10 §3.3); 38 % de links sin pago (RN-12 §3). | **Replicar** TTL por tipo de intención y **adoptar** vencimiento/limpieza de links impagos. | PRM-INT-024 | — |
| RN-INT-034 | Estados monotónicos. | `ESTADO_VENTA` solo avanza (RN-10 §3.2). | **Replicar** en máquinas de estado (sección 8). | — | — |
| RN-INT-035 | Persistencia del resultado. | `ActualizarEstadoPago` reintenta hasta 6 veces (RN-10 §3.4). | **Reemplazar** por transacción Mongo + outbox. | — | — |
| RN-INT-036 | Recuperación periódica de pendientes. | Ventana de 40 min y barrido del día anterior a las 4, 11, 16 y 23 h (RN-10 §3.4, §12.1). | **Mejorar**: `JOB-INT-07` recupera inciertos/pendientes con ventana y horarios configurables. | PRM-INT-025 | — |
| RN-INT-037 | Errores HTTP del proveedor. | "[]" ⇒ "No se encontraron resultados"; 500 ⇒ "reintente" genérico (RN-10 §6.1; RN-13 §2.1). | **Mejorar** con la taxonomía RF-INT-035. | — | — |
| RN-INT-038 | Política de reintento. | Solo el SDK de MP reintenta (2 veces, 0,5–5 s, idempotentes o con `X-Idempotency-Key`, en 409 y 5xx) (RN-13 §2.1). | **Replicar** como política general por defecto. | PRM-INT-002–004 | — |
| RN-INT-039 | Bitácora de telemedición. | `AUDITORIA_TELEMEDICION` guarda request/response por medidor (CAT). | **Replicar** en `integrationMessages` saneada. | — | — |
| RN-INT-040 | Comandos remotos sobre el servicio. | Corte/reconexión remotos por `TELEMED_COMM` y conectores ISP (RN-10 §9). | **Replicar/Mejorar**: solo ejecutan tras la decisión del circuito de mora/CRM (BASE §97.5, MER-017) y con confirmación del resultado; incierto ⇒ verificación de estado. | — | — |
| RN-INT-041 | Validaciones de importadores de rendición. | `Importador_Base`: duplicados, importes, anulados/bloqueados, notificados (FIC 4). | **Replicar** en el motor de archivos (RF-INT-066). | — | — |
| RN-INT-042 | Archivo de control de exportaciones. | `Exportar_Control` por cada exportación Red Link (FIC 4.1). | **Replicar** en layout. | — | — |
| RN-INT-043 | Pagos fuera de término. | `PERFUETER` + `FUETERBAN = 5`: sin tope (RN-12 §2). | El conector **transporta**; la aceptación es regla de M07. | — | — |
| RN-INT-044 | Secretos en código. | Credenciales hardcodeadas en ≥ 14 ubicaciones (RN-10 §13). | **Descartar**; RF-INT-083. | — | — |
| RN-INT-045 | Ejecución de SQL arbitrario. | `EjecutarSPTemporal` crea y ejecuta SQL recibido (RN-10 §16.6); SQL concatenado en Pagos360/Macro (RN-13 §17). | **Descartar**; consultas parametrizadas. | — | — |
| RN-INT-046 | Trámites web ejecutan procedimientos por nombre. | SP cuyo nombre es la descripción del requisito (RN-10 §3.5). | **Reemplazar** por workflow (T11) y acciones de dominio; los SP de LAG se relevan para migrar su lógica. | — | [VERIFICAR] procedimientos existentes en LAG (RN-10 §15.9). |
| RN-INT-047 | Claves derivadas de la fecha. | Clave de ruta/encabezado derivada de la fecha con patrón fijo (RN-10 §13). | **Descartar.** | — | — |
| RN-INT-048 | Clave de mapas. | Static Maps usa variable 2251 o una clave hardcodeada por defecto (RN-10 §10). | **Reemplazar** por conexión de plataforma o del tenant en bóveda, con restricción por referrer/IP. | — | — |
| RN-INT-049 | Servicios sin autenticación. | BancoSangre devuelve resúmenes de tarjeta por DNI/CUIT sin auth (RN-13 §14, §17). | **Reemplazar**: toda integración autenticada. | — | — |
| RN-INT-050 | Datos de tarjeta en tótem. | HTML local con número, vencimiento y CVV (RN-13 §3.7). | **Descartar** (RF-INT-081). | — | — |
| RN-INT-051 | Secreto en campo de negocio. | Clave secreta de Macro guardada en `PAGOS360.URL_SUCCESS` y enviada al portal (RN-13 §6, §17). | **Reemplazar**: firma calculada en servidor; nunca viaja al cliente. | — | — |
| RN-INT-052 | Método HTTP documentado. | Cancelación de débito CBU Pagos360 con `GET` (RN-13 §3.2). | Usar el método documentado por el proveedor. | — | [VERIFICAR] con documentación de Pagos360. |
| RN-INT-053 | Fecha de pago real. | SiPago registra `FECHA_PAG = FEC_REG`; si el importe difiere queda pagada sin pago (RN-13 §10; RN-10 §6.1). | **Mejorar**: fecha del proveedor y diferencias a revisión. | — | — |
| RN-INT-054 | Comparar importe siempre. | PayFun y Pagos TIC no comparan importe (RN-10 §6.1). | **Mejorar**: comparar contra la intención (por vencimiento) y derivar diferencias. | — | — |
| RN-INT-055 | Importe por vencimiento. | Helipagos/Macro aceptan `IMPORTE1` o `IMPORTE2` (RN-10 §6.1). | **Replicar** validación contra el importe del vencimiento aplicable. | — | — |
| RN-INT-056 | Devoluciones por API. | No existen en ninguna pasarela (RN-13 §3.6, §15). | **Mejorar**: capacidad `refund` donde el proveedor la ofrezca, con aprobación (PA-INT-21). | — | — |
| RN-INT-057 | Contracargos y reversiones. | Reporte de contracargos de Pagos360 ⇒ `ESTADO 5` y anticipo/nota (RN-13 §3.6). | El conector emite `int.payment.reversed`; el tratamiento contable/comercial es de M07. | — | — |
| RN-INT-058 | Actualización automática de componentes locales. | Integra se actualiza solo desde S3 del proveedor (RN-10 §12). | **Descartar** para servidor (SaaS); el agente local se actualiza desde canal firmado de CoopApps. | — | — |
| RN-INT-059 | Interop con Office. | Excel/Word/Access por interop (RN-10 §11). | **Reemplazar** por exportación XLSX/CSV/PDF en servidor y plantillas propias. | — | — |
| RN-INT-060 | Renovación de escuchas. | `ReiniciaEscuchas` reinicia suscripciones de Firebase periódicamente (RN-10 §3.1). | **Descartar** (no hay escucha). | — | — |
| RN-INT-061 | Datos que el proveedor exige por canal. | Pagos360 excluye canales/medios según flags `MEDIOS`, marcas 2743 y cuotas 2720 (RN-13 §3.3). | **Replicar** como configuración de la conexión (medios habilitados). | PRM-INT-041 | — |
| RN-INT-062 | Webhook vía Integra o Agente. | Tres disparadores de autorización (ciclo, webhook Integra, rendición) (RN-10 §3.4). | **Reemplazar** por webhook directo + `JOB-INT-07` + conciliación (`JOB-INT-06`). | — | — |
| RN-INT-063 | Errores de rendición a un mail fijo. | Errores enviados al mail del parámetro 3025 (RN-10 §12.1). | **Mejorar**: alertas con destinatarios por rol (RF-INT-071); 3025 se migra como destinatario adicional. | PRM-INT-026 | — |
| RN-INT-064 | El incremento por concurrencia no bloquea tablas. | `GetMaxValue_Boqueo` bloquea tablas para numerar (RN-10 §2.1; RN-13 §4.3). | **Reemplazar** por contadores atómicos y transacciones. | — | — |
| RN-INT-065 | Un intento de corte/reconexión no se repite sin verificar. | Sin control explícito (RN-10 §9). | **Adoptar**: operación `uncertain` ⇒ `getStatus` del equipo antes de reintentar. | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Convenciones de la guía §5: todo documento de tenant lleva `TenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`; índices compuestos empiezan por `TenantId`. Las colecciones de catálogo de plataforma usan `tenantId = PLATFORM`. Ninguna colección guarda secretos en claro.

### 7.1 `integrationProviders` (catálogo de plataforma)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código estable, ej. `arca.wsfe`, `siro.api`, `redlink.files`, `meta.whatsapp`, `discar.mdm`. Único. |
| `name` | string | Sí | Nombre visible (clave `dict:int.provider.<code>`). |
| `connectorType` | enum | Sí | Tipos del glosario. |
| `adapterVersion` | string | Sí | Versión semántica del adaptador. |
| `capabilities` | string[] | Sí | Ej. `healthCheck`, `requestCae`, `lastAuthorized`, `getVoucher`, `requestCaea`, `informCaea`, `informCaeaNoMovement`, `getParams`, `getPersona`, `createPaymentIntent`, `getPayment`, `listCollections`, `cancelIntent`, `refund`, `listChargebacks`, `createStaticQr`, `createDynamicQr`, `adhereDebit`, `requestDebit`, `cancelDebit`, `publishDebt`, `getDebtPublicationStatus`, `importRemittance`, `getAccounts`, `getBalances`, `getMovements`, `sendEmail`, `sendSms`, `sendWhatsappTemplate`, `sendWhatsappSession`, `sendPush`, `readMeter`, `cutService`, `reconnectService`, `assignMeter`, `removeMeter`, `changeCategory`, `vendCredit`, `provisionSubscriber`, `changePlan`, `suspendSubscriber`, `importCdr`, `getPositions`, `geocode`, `renderMap`, `signDocument`, `getSignatureStatus`, `complete`, `extractDocument`, `localPrint`, `localDisplay`, `readCard`, `readScale`. |
| `protocols` | enum[] | Sí | `rest`, `soap`, `file`, `sftp`, `tcp`, `ssh`, `sql`, `smtp`, `webhook`, `websocket`, `oidc`. |
| `environments` | object | Sí | `{ test: { baseUrls: {...}, docs }, production: { baseUrls: {...} } }`. URLs públicas del proveedor, sin claves. |
| `credentialSchema` | array | Sí | `[{ name, kind: password|apiKey|oauthClientSecret|accessToken|refreshToken|privateKey|certificate|hmacSecret|passphrase|sshKey, required, rotationDays, hasExpiry }]`. Solo nombres. |
| `configSchema` | object | Sí | Esquema Zod/JSON Schema de configuración no secreta (convenio, CUIT, punto de venta, ids de cuenta, ventanas). |
| `webhook` | object | No | `{ supported, signatureScheme: hmac-sha256|provider|mtls|ipAllowlist|none, verifyRequired, challenge }`. |
| `fileLayouts` | string[] | No | Códigos de `fileLayouts` aplicables. |
| `rateLimits` | object | No | Defaults del proveedor. |
| `retryPolicy` | object | Sí | `{ maxAttempts, baseMs, factor, maxMs, jitter, retryOn: [errorCategory] }`. |
| `timeouts` | object | Sí | `{ connectMs, readMs }` por operación. |
| `circuitBreaker` | object | Sí | `{ failureThreshold, windowMs, openMs, halfOpenProbes }`. |
| `egressHosts` | string[] | Sí | Lista de salida permitida. |
| `dataShared` | string[] | Sí | Datos personales que se envían (RF-INT-082). |
| `licenseCapability` | string | Sí | Capability de plataforma que habilita el conector (T01). |
| `sheet` | string | Sí | `FI-INT-NN` (sección 12). |
| `status` | enum | Sí | `draft`, `available`, `deprecated`, `retired`. |

Índices: `{ code: 1 }` único; `{ connectorType: 1, status: 1 }`.

### 7.2 `integrationConnections` (por tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | |
| `providerCode` | string | Sí | Ref. `integrationProviders.code`. |
| `adapterVersion` | string | Sí | Fijada a una versión (RF-INT-011). |
| `name` | string | Sí | Ej. "SIRO convenio energía". |
| `purpose` | string[] | No | `portalPayments`, `cashQr`, `debtPublication`, `invoiceAuthorization`, `notifications`… |
| `mode` | enum | Sí | `test`, `production`. |
| `status` | enum | Sí | Ver §8.1. |
| `config` | object | Sí | Validado por `configSchema` (sin secretos). Ej. `{ convenio, cuit, cuitRepresentado, puntosVenta[], ente, nroEmpresa, posId, merchantId }`. |
| `secretRefs` | object | Sí | `{ <credentialName>: secretId }`. |
| `certificateRefs` | uniqueidentifier[] | No | |
| `legalEntityId` | uniqueidentifier | No | Persona jurídica del tenant a la que pertenece la conexión (`legalEntities` de T04, DEC-064). Obligatorio en conexiones fiscales (ARCA), bancarias, de cobranza y de sueldos: cada entidad tiene su CUIT, certificado y puntos de venta, y `config.cuit` debe coincidir con el CUIT de la entidad. |
| `scope` | object | No | `{ serviceIds[], branchIds[], pointOfSaleIds[], cashBoxIds[], channelIds[], zoneIds[] }`. |
| `defaultFor` | string[] | No | Propósitos para los que es la conexión por defecto. |
| `fallbackConnectionIds` | uniqueidentifier[] | No | Cadena de respaldo (RF-INT-010); → `integrationConnections`. |
| `schedules` | array | No | `[{ jobCode, cron, timezone, enabled, lastRunAt, nextRunAt }]`. |
| `overrides` | object | No | `retryPolicy`, `timeouts`, `rateLimits`, `circuitBreaker` del tenant (dentro de topes de plataforma). |
| `webhookEndpointId` | uniqueidentifier | No | |
| `health` | object | No | `{ state: ok|degraded|down|unknown, lastSuccessAt, lastFailureAt, errorRate1h, p95Ms, backlog, circuit: closed|open|half_open, checkedAt }` (espejo de Redis). |
| `contacts` | array | No | Responsables y canal de alertas. |
| `validFrom` / `validTo` | Date | No | Vigencia. |
| `approvalRequestId` | uniqueidentifier | No | Aprobación pendiente (T11). |
| `copiedFrom` | object | No | `{ tenantId, connectionId }` (BASE §81). |
| `notes` | string | No | |

Índices: `{ tenantId: 1, providerCode: 1, name: 1 }` único; `{ tenantId: 1, status: 1 }`; `{ tenantId: 1, defaultFor: 1 }`.

### 7.3 `integrationSecrets` (bóveda)

Cifrado por sobre propio en Azure SQL con clave maestra en AWS KMS, detrás de una interfaz agnóstica de proveedor (DEC-074). Es la bóveda única de la plataforma: los demás anexos la referencian con el campo `credentialRef` (T05 §7.2, CTR-DAT-72).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | |
| `connectionId` | uniqueidentifier | Sí | |
| `name` | string | Sí | Nombre del `credentialSchema`. |
| `kind` | enum | Sí | Ver §7.1. |
| `versionNo` | int | Sí | Versión del secreto. |
| `ciphertext` | Binary | Sí | AES-256-GCM. |
| `iv`, `authTag` | Binary | Sí | |
| `dataKeyId` | string | Sí | Clave de datos del tenant (cifrada por KMS). |
| `kmsKeyId` | string | Sí | Clave maestra (por ambiente). |
| `fingerprint` | string | Sí | HMAC-SHA256 del valor con clave de plataforma (no reversible). |
| `hint` | string | No | Últimos 4 caracteres si `kind` lo permite (no para claves privadas). |
| `status` | enum | Sí | `pending`, `active`, `rotated`, `revoked`, `expired`. |
| `expiresAt` | Date | No | |
| `rotationDueAt` | Date | No | |
| `activatedAt`, `rotatedAt`, `revokedAt` | Date | No | |
| `lastUsedAt` | Date | No | |

Índices: `{ tenantId: 1, connectionId: 1, name: 1, versionNo: -1 }` único; `{ tenantId: 1, status: 1, expiresAt: 1 }`. Los accesos se registran en la auditoría genérica (T02) con `action: int.secret.decrypted`.

### 7.4 `integrationCertificates`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId`, `connectionId` | uniqueidentifier | Sí | |
| `purpose` | enum | Sí | `arcaWsaa`, `digitalSignature`, `mtls`, `webhookSigning`. |
| `alias` | string | Sí | Alias usado ante ARCA. |
| `cuit` | string | Sí (ARCA) | CUIT del *subject*. |
| `subject`, `issuer`, `serialNumber` | string | Sí al activar | |
| `notBefore`, `notAfter` | Date | Sí al activar | |
| `csrPem` | string | No | CSR (público). |
| `certificatePem` | string | No | Certificado (público). |
| `privateKeySecretId` | uniqueidentifier | Sí | Ref. a `integrationSecrets` (`kind: privateKey`). |
| `status` | enum | Sí | Ver §8.3. |
| `alertsSent` | array | No | `[{ thresholdDays, sentAt }]`. |
| `arcaServices` | string[] | No | Servicios autorizados en ARCA (`wsfe`, `wsfex`, `ws_sr_padron_a13`, `ws_sr_constancia_inscripcion`, `ws_sr_padron_a4`, `wscdc`, `wsfecred`). |

Índices: `{ tenantId: 1, connectionId: 1, status: 1 }`; `{ status: 1, notAfter: 1 }` (job de alertas, plataforma).

### 7.5 `integrationTokens` (caché de sesión, Redis + espejo opcional)

Clave Redis `int:tok:{tenantId}:{connectionId}:{service}` con valor cifrado (`token`, `sign`, `expiresAt`, `cuitRepresentado`), TTL = vencimiento − margen. Lock distribuido `int:toklock:...` para renovación única (RF-INT-022). No se persiste en Mongo salvo metadatos (`issuedAt`, `expiresAt`, `service`) para monitoreo.

Campos del espejo de metadatos en Mongo (corrección del 05-11-2026; el valor del token nunca se persiste fuera de Redis):

| Campo | Tipo | Obligatorio | Descripción | Referencia |
|---|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | Tenant. | `tenants` (T01) |
| `connectionId` | uniqueidentifier | Sí | Conexión que obtuvo el token. | `integrationConnections` (T06) |
| `service` | String | Sí | Servicio del proveedor (ej. `wsfe`, `ws_sr_padron_a13`). | — |
| `issuedAt` | Date | Sí | Emisión del token. | — |
| `expiresAt` | Date | Sí | Vencimiento informado por el proveedor. | — |
| `cuitRepresentado` | String | No | CUIT representado si el proveedor lo exige. | — |

### 7.6 `integrationOperations`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId`, `connectionId` | uniqueidentifier | Sí | |
| `operationType` | string | Sí | `<provider>.<capability>`, ej. `arca.wsfe.requestCae`. |
| `idempotencyKey` | string | Sí | `tenantId + operationType + businessKey`. |
| `businessRef` | object | Sí | `{ module, entity, id, displayRef }` (ej. `{ fac, invoice, …, "B 0022-00001234" }`). |
| `requestHash` | string | Sí | Hash del cuerpo saneado para detectar reintentos con contenido distinto (⇒ `conflict`). |
| `priority` | enum | Sí | `interactive`, `normal`, `batch`. |
| `status` | enum | Sí | Ver §8.4. |
| `attempts` | int | Sí | |
| `nextAttemptAt` | Date | No | |
| `lastError` | object | No | `{ category, code, providerCode, message, retryable }`. |
| `result` | object | No | Resultado neutral saneado (ej. `{ cae, caeDueDate, number }`, `{ externalId, checkoutUrl }`). |
| `externalIds` | object | No | Ids devueltos por el proveedor. |
| `correlationId` | string | Sí | |
| `jobId` | string | No | Id Azure Queue Storage. |
| `batchId` | uniqueidentifier | No | Lote de negocio (ej. lote de facturación). |
| `contingencyId` | uniqueidentifier | No | |
| `manualResolution` | object | No | `{ resolvedBy, approvedBy, evidenceStoredFileIds[], reason, at }` (antes `evidenceFileIds[]`, T05 §7.2). |
| `startedAt`, `finishedAt` | Date | No | |

Índices: `{ tenantId: 1, idempotencyKey: 1 }` único; `{ tenantId: 1, status: 1, nextAttemptAt: 1 }`; `{ tenantId: 1, "businessRef.entity": 1, "businessRef.id": 1 }`; `{ tenantId: 1, connectionId: 1, createdAt: -1 }`; `{ tenantId: 1, batchId: 1 }`.

### 7.7 `integrationMessages` (bitácora)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId`, `connectionId` | uniqueidentifier | Sí | |
| `operationId` | uniqueidentifier | No | (los webhooks pueden no tener operación aún) |
| `direction` | enum | Sí | `outbound`, `inbound`. |
| `channel` | enum | Sí | `http`, `soap`, `file`, `sftp`, `tcp`, `ssh`, `sql`, `smtp`, `webhook`, `websocket`. |
| `endpoint` | string | Sí | Host + ruta sin query sensible. |
| `method` / `action` | string | No | `POST`, `FECAESolicitar`, `PUT new-transaction`… |
| `statusCode` | int/string | No | HTTP o código del proveedor. |
| `durationMs`, `sizeBytes` | int | No | |
| `attempt` | int | No | |
| `mode` | enum | Sí | `test`/`production`. |
| `requestHeaders`, `responseHeaders` | object | No | Saneados. |
| `requestBody`, `responseBody` | object/string | No | Saneados; o `payloadRef` si superan el umbral. |
| `payloadRef` | object | No | `{ storageKey, sha256, sizeBytes }`. |
| `redactions` | string[] | Sí | Rutas redactadas. |
| `correlationId` | string | Sí | |
| `at` | Date | Sí | |
| `retentionUntil` | Date | Sí | Según PRM-INT-010/011. |

Índices: `{ tenantId: 1, operationId: 1, at: 1 }`; `{ tenantId: 1, connectionId: 1, at: -1 }`; `{ tenantId: 1, correlationId: 1 }`; TTL sobre `retentionUntil` solo para cuerpos (los metadatos se archivan; las bitácoras de más de 36 meses pasan a consulta diferida, DEC-087).

### 7.8 `webhookEndpoints` y `webhookInbox`

`webhookEndpoints`: `TenantId`, `connectionId`, `endpointKey` (aleatorio 32 bytes, único global), `signatureScheme`, `credentialRef` (bóveda, `integrationSecrets`; nombre canónico de T05 §7.2), `allowedIps[]`, `toleranceSeconds`, `status` (`active`, `rotating`, `disabled`), `previousKeyValidUntil`. Índice `{ endpointKey: 1 }` único.

`webhookInbox`: `TenantId`, `endpointId`, `connectionId`, `receivedAt`, `sourceIp`, `headers` (saneados), `bodyRef` o `body` (saneado), `providerEventId`, `dedupKey`, `signatureValid` (bool), `status` (§8.6), `attempts`, `operationId`, `error`. Índices: `{ tenantId: 1, connectionId: 1, dedupKey: 1 }` único; `{ status: 1, receivedAt: 1 }`.

### 7.9 `fileLayouts` (catálogo de plataforma, extensible por tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | `PLATFORM` o tenant (variantes propias). |
| `code`, `layoutVersion` | string | Sí | Ej. `redlink.debt.19-10`, `siro.debt.base`, `siro.remittance.integrado`, `redlink.remittance.lag`, `arca.lid.ventas`, `arca.sicore`, `sircar.percepciones`, `enargas.usr`. |
| `providerCode` | string | Sí | |
| `direction` | enum | Sí | `outbound`, `inbound`. |
| `format` | enum | Sí | `fixed`, `csv`, `xlsx`, `xml`, `json`, `dbf`, `mdb`. |
| `encoding`, `lineEnding`, `delimiter`, `quote`, `decimalSeparator` | string | Sí/No | |
| `fileNamePattern` | string | No | Ej. `{convenio}{yyyymmdd}.txt`. |
| `records` | array | Sí | `[{ type: header|detail|trailer|control, identifier, repeat, fields: [{ name, start, length, type: alpha|numeric|amount|date|time|constant|computed, pad, align, decimals, implicitDecimals, dateFormat, source (ruta del DTO), target, required, checkDigit, transform }] }]`. |
| `controlFile` | object | No | Layout del archivo de control (Red Link). |
| `dueDateCapacity` | int ≥ 1 | Cond. | Obligatorio en los layouts `outbound` de exportación de deuda a entes de cobro (publicación, actualización de deuda y débito; los que M07 usa como `collectionAgencies.exportLayoutId`): cantidad máxima de vencimientos distintos que el layout puede publicar por obligación, según los campos de vencimiento e importe que declara `records`. Se valida al pasar a `validated` (no puede superar los vencimientos que el layout realmente codifica) y es parte de la versión: un cambio exige `layoutVersion` nueva. M07 lo copia al ente (`collectionAgencies.dueDateCapacity`, o el valor del convenio si es menor), lo publica a M05 para validar el tope de vencimientos (PRM-FAC-163, RN-FAC-163) y exporta solo los primeros N vencimientos (RF-COB-099, RN-COB-159). Ejemplo: un layout con dos pares fecha-importe tiene capacidad 2 (10-11-2026, DEC-106). |
| `checkDigitAlgorithms` | string[] | No | |
| `hooks` | string[] | No | Hooks de código versionados (RF-INT-060). |
| `sampleFiles` | array | No | Archivos de referencia anonimizados para pruebas (FIC 23). |
| `validFrom`, `validTo` | Date | No | |
| `status` | enum | Sí | `draft`, `validated`, `active`, `deprecated`. |
| `procoopEquivalent` | string[] | No | Ej. `E_RedLink_19_10` (159 `PR_LINK_08`), `FAL_RedLink` (264), `E_SIRO` (140), `Siro_Integrado` (271). |

### 7.10 `integrationFileExchanges`

`TenantId`, `connectionId`, `layoutCode`, `layoutVersion`, `direction`, `businessBatchRef` `{ module, entity, id }`, `fileName`, `storedFileId` (→ `storedFiles` de T01; antes `storageKey`, T05 §7.2 y COL-INT-11), `sha256`, `recordCount`, `controlTotals` `{ amount: DECIMAL(18,4), count }`, `transport` (`manualDownload`, `manualUpload`, `sftp`, `api`, `email`), `status` (§8.7), `generatedAt`, `deliveredAt`, `acknowledgedAt`, `receivedAt`, `appliedAt`, `lineResults` (resumen) + `lineErrorsRef` (archivo de errores por línea), `approvedBy`, `supersedesId`, `externalTransactionNumber` (antes `externalTransactionId`; número de transacción del ente, no referencia) (ej. `nro_transaccion` SIRO). Índices: `{ tenantId: 1, connectionId: 1, sha256: 1 }` único para entrantes; `{ tenantId: 1, status: 1 }`.

### 7.11 `integrationReconciliations`

`TenantId`, `connectionId`, `type` (`payments`, `debtPublication`, `fiscal`, `bank`, `messaging`, `metering`), `periodFrom`, `periodTo`, `external` `{ count, gross, fees, feesVat, net }` (DECIMAL(18,4)), `internal` `{ … }`, `differences[]` `{ kind: missingInternal|missingExternal|amountMismatch|dateMismatch|duplicate, externalId, businessRef, externalAmount, internalAmount, status: open|explained|adjusted|ignored, resolvedBy, note }`, `status` (§8.8), `actStoredFileId` (acta de conciliación en `storedFiles`; antes `actFileId`, T05 §7.2), `approvedBy`, `closedAt`.

### 7.12 `integrationAlerts`

`TenantId` (o `PLATFORM`), `connectionId`, `type` (`certificate_expiring`, `certificate_expired`, `credential_expiring`, `credential_rotation_due`, `circuit_open`, `error_rate`, `backlog`, `uncertain_operations`, `reconciliation_differences`, `webhook_signature_invalid`, `quota_near`, `quota_exceeded`, `schedule_missed`, `agent_offline`, `file_not_received`, `mode_mismatch`), `severity` (`info`, `warning`, `critical`), `status` (`open`, `acknowledged`, `resolved`), `dedupKey`, `count`, `firstAt`, `lastAt`, `notifiedTo[]`, `ackBy`, `resolvedBy`, `link`. Índice `{ tenantId: 1, dedupKey: 1, status: 1 }`.

### 7.13 `integrationContingencies`

`TenantId`, `connectionId`, `reason`, `trigger` (`manual`, `circuit`, `credential`, `provider_notice`), `mode` (`caea`, `manualFile`, `deferredQueue`, `alternateProvider`, `manualRecord`, `fieldOperation`), `startedAt`, `declaredBy`, `approvedBy`, `endedAt`, `endedBy`, `affectedOperations` (conteo), `closingReconciliationId` (→ `integrationReconciliations`), `status` (§8.9).

### 7.14 `externalReferences`

`TenantId`, `system` (código de proveedor o sistema), `externalId`, `entity` `{ module, type, id }`, `kind` (`paymentId`, `intentId`, `qrId`, `debitAdhesionId`, `meterId`, `subscriberId`, `voucherId`, `legacyProcoopId`), `validFrom`, `validTo`, `supersededBy`. Índice único `{ tenantId: 1, system: 1, kind: 1, externalId: 1 }`; `{ tenantId: 1, "entity.type": 1, "entity.id": 1 }`.

### 7.15 `localAgents` y `localAgentCommands`

`localAgents`: `TenantId`, `branchId`, `name`, `os`, `agentVersion`, `publicKey`, `pairingCodeHash`, `pairingExpiresAt`, `status` (§8.10), `devices[]` `{ deviceId, type: thermalPrinter|fiscalPrinter|cardReader|billAcceptor|queueDisplay|queueKiosk|scale|scanner|barcodeReader|meterCollector|waterDispenser, model, port, config }`, `lastSeenAt`, `ip` (último), `capabilities[]`.

`localAgentCommands`: `TenantId`, `agentId`, `deviceId`, `command` (`print`, `display`, `readCard`, `readScale`, `scan`, `dispense`, `collectorDownload`, `collectorUpload`), `payloadRef`, `signature`, `expiresAt`, `status` (`queued`, `sent`, `acknowledged`, `done`, `failed`, `expired`), `result`, `operationId`.

### 7.16 `aiUsageLogs`

`TenantId`, `connectionId`, `feature` (`invoiceExtraction`, `ticketNotesAnalysis`, `formulaAssistant`, `moderation`, `biAsk`, `surveyAnalysis`, `postGeneration`, `crmClassification`), `provider`, `model`, `promptHash`, `piiRedacted` (bool), `tokensIn`, `tokensOut`, `cost` (DECIMAL(18,4)), `currency`, `userId`, `businessRef`, `status` (`ok`, `error`, `blocked`; §8.12; PA-INT-26), `latencyMs`, `outcome` (`proposed`, `accepted`, `rejected`, `edited`). Equivale a `AUDIT_IA` (sin guardar el texto completo salvo política del tenant).

### 7.17 Mapeo con tablas ProCoop

| Tabla ProCoop (CAT) | Destino CoopApps | Comentario |
|---|---|---|
| `VARIABLE` (credenciales de pasarelas 901, 2492/2493, 2553, 2756-2758, 2765-2768, 2793/2794, 2877-2883, 2956-2960, 2969-2971, 3046, 3077, 2870, 3048, 3035…) | `integrationSecrets` + `integrationConnections.config` | Secretos **no** se migran: se regeneran (RF-INT-023). La parte no secreta (URLs de retorno, convenios, ids) sí. |
| `.pro` (SMTP, WEB_*, rutas) | `integrationConnections` email/SFTP | Igual criterio. |
| `CORREOS_INTERNOS` | Conexiones `messaging.email` por módulo (remitente, responder-a) | Clave no migrada. |
| `INTERBANKING` | Conexión `interbanking.api` | `CLIENT_SECRET`, `ACCESS_TOKEN`, `PASS_SISTEMA` no migrados; vacía en LAG (RN-12 §3). |
| `TELEMEDICION` | Conexiones `meteringMdm`/`prepaidVending` | `USER_TEL`/`PASS_TEL` a bóveda tras regenerar. |
| `MIKROTIK` | Conexiones `networkProvisioning` (una por router o por controlador) | `CONTRASEÑA` no migrada. |
| `FIRMASDIGITALES` | Conexiones `signature` + `integrationCertificates` | `CLIENT_SECRET` no migrado. |
| `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS` | T10 (clientes API) / M19 (usuarios del portal) | `PASSWORD` del portal no se migra en claro (T07/T02). |
| `BANCOS` (`COD_ARC`, `COD_ARC2`, `ARC_CONFIG`, `CONVENIO`, `CAJA`, `COD_BANT`, comisiones) | `integrationConnections` (`collectionNetwork`) + config de M07 | Comisiones, `DIFERIR`, `PERFUETER`, `PERMITE_ENTREGA`, `RECARGO3VTO` son reglas de M07. |
| `CANALES_PAGOS` | `integrationConnections.purpose/defaultFor` + catálogo de canales de M07 | |
| `MODEINT`, `FORMAINT`, `DATOSINT`, `TIPOMOD`, `SERVINT` | `fileLayouts` | Modelos de interfaz de archivos y lectoras. |
| `PAGOS360`, `PAGOS360_ITEMS`, `PAGOS360_EXTRAS`, `PAGOS360_PAGOS` | Intenciones y pagos en M07 + `integrationOperations` + `externalReferences` | El modelo de intención es de M07; T06 guarda la operación técnica. |
| `SIRO_BASEDEUDA` | `integrationFileExchanges` / operaciones `siro.publishDebt` | |
| `RED_LINK`, `DEUDARED`, `DEUDARED_TIPO` | `integrationFileExchanges` + datos de publicación en M07 | |
| `CAJAS_QR` | `externalReferences` (`qrId` por caja) | |
| `SUMSOC_EXTRAS.DEBITO_360_ID/ESTADO` | `externalReferences` (`debitAdhesionId`) | |
| `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP` | M06 (comprobante fiscal) + `integrationOperations` `arca.wsfe.*` | |
| `CESPAFIP` | M06 (CAEA y CESP como entidades separadas) + operaciones `arca.wsfe.requestCaea/informCaea` | CTR-INT-19. |
| `EMPAFIP`, `ACTAFIP` | M06 (padrón offline y actividades) | Importación por layout `arca.condicionTributaria`. |
| `CVPIIBB`, `IIBB_LUA` | M06 | Padrón entrante por layout. |
| `AUDIT_MAIL`, `SENDMAIL`, `PROMAIL` (los de procesos) | T09 (mensajes) + `integrationMessages` | `PROMAIL` interno es mensajería entre usuarios (T09). |
| `MENSAJES`, `ENVIOS`, `MODEMS`, `RESULTADOS` | T09 + conexiones `messaging.sms` | Módems GSM reemplazados por proveedor (PA-INT-06). |
| `PLANTILLA`, `PLANTILLA_WSP`, `VARIABLES_PLANTILLA_WSP`, `VARIABLEPLANT` | T09 | Plantillas WhatsApp aprobadas por Meta referencian la conexión. |
| `IVR` | T09 `channelSettings` del canal `ivr_export` (intentos, franja, día de aviso) + conexión opcional `ivr` (FI-INT-66) | Parámetros de la exportación al discador externo; ProCoop no tiene IVR propio (DEC-104). |
| `AUDITORIA_TELEMEDICION`, `TELEMED_COMM` | `integrationMessages` + `integrationOperations` + M03/M10 | |
| `AVL_REG`, `MOVIL.NOM_AVL` | M18 (posiciones) + conexión `fleetGps` | |
| `AUDIT_IA` | `aiUsageLogs` | |
| `FIRMADIGITAL`, `FIRMADIGITAL_ITEMS`, `FIRMADIGITAL_USUARIOS` | `integrationOperations` `signature.*` + expediente T11 | |
| `MOV_INTERBANKING`, `RESBAN_MOVINT`, `SU_AUDIT_TRA_INTERBANKING` | M14 (movimientos, conciliación) + `integrationMessages` | |
| `TABLAS_POWERBI` | T10 | |
| `SISCONT` | M15 (mapeo operación → cuenta) + layouts de exportación contable | |
| `NOTI_COOP` | T09 | |
| `VARIABLE_PMOVIL` | Conexiones/config de M19/PWA (parámetros del canal) | Canal CoopOnline desaparece. |
| `TURNOS`, `TURNOS_HISTORIAL` | M09 (turnero) + `localAgents` | |
| `FACT_EPEC` | M03/M12 (compra de energía) | Carga por layout/manual. |
| `FACTURAS_TERCEROS`, `TERCEROS` | M06/M07 (terceros) + layouts de rendición | |
| `ENGAS_CANTMESES`, `INFOCTD`, `DEPTO/LOCALIDA/PROVINC/DOCUMENT` (códigos ARCA, INAES, ENARGAS, OCEBA) | M06/T04 (códigos de organismo en maestros) | Los códigos por organismo son tablas de correspondencia de T04. |
| `CORREOSINT` | M10 (casillas como servicio a socios) | `USER_PASS` no migra en claro. |

### 7.18 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-INT-27 (Asumida, DEC-072).

**`webhookEndpoints`** — Endpoints de entrada por proveedor (COL-INT-08; definición en texto en §7.8)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `endpointKey` | string | No | — | aleatorio 32 bytes, único global |
| `signatureScheme` | string | No | — | Según la definición en texto del §7 |
| `credentialRef` | string | No | `integrationSecrets` (T06) | bóveda, `integrationSecrets`; nombre canónico de T05 §7.2 |
| `allowedIps` | array | No | — | Según la definición en texto del §7 |
| `toleranceSeconds` | int | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `active`, `rotating`, `disabled` |
| `previousKeyValidUntil` | string | No | — | Según la definición en texto del §7 |
| `path` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`webhookInbox`** — Webhooks recibidos crudos; TTL (COL-INT-09; definición en texto en §7.8)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `endpointId` | uniqueidentifier | Sí | `webhookEndpoints` (T06) | destino → `webhookEndpoints` |
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `receivedAt` | Date | No | — | Según la definición en texto del §7 |
| `sourceIp` | string | No | — | Según la definición en texto del §7 |
| `headers` | array | No | — | saneados |
| `bodyRef` | string | No | — | Según la definición en texto del §7 |
| `body` | string | No | — | saneado |
| `providerEventId` | string | No | — | Según la definición en texto del §7 |
| `dedupeKey` | string | Sí | — | antes `dedupKey` en el texto del §7 (nombre canónico de T05) |
| `signatureValid` | bool | No | — | bool |
| `status` | enum | Sí | — | §8.6 |
| `attempts` | int | No | — | Según la definición en texto del §7 |
| `operationId` | string | No | — | Según la definición en texto del §7 |
| `error` | string | No | — | Según la definición en texto del §7 |

**`integrationFileExchanges`** — Archivos enviados/recibidos (COL-INT-11; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | Sí | `integrationConnections` (T06) | destino → `integrationConnections` |
| `layoutCode` | string | No | — | Según la definición en texto del §7 |
| `layoutVersion` | string | No | — | Según la definición en texto del §7 |
| `direction` | string | No | — | Según la definición en texto del §7 |
| `businessBatchRef` | string | No | — | Según la definición en texto del §7 |
| `fileName` | string | No | — | Según la definición en texto del §7 |
| `storedFileId` | uniqueidentifier | No | `storedFiles` (T01) | → `storedFiles` de T01; antes `storageKey`, T05 §7.2 y COL-INT-11 |
| `sha256` | string | No | — | Según la definición en texto del §7 |
| `recordCount` | int | No | — | Según la definición en texto del §7 |
| `controlTotals` | array | No | — | Según la definición en texto del §7 |
| `transport` | enum | No | — | `manualDownload`, `manualUpload`, `sftp`, `api`, `email` |
| `status` | enum | Sí | — | §8.7 |
| `generatedAt` | Date | No | — | Según la definición en texto del §7 |
| `deliveredAt` | Date | No | — | Según la definición en texto del §7 |
| `acknowledgedAt` | Date | No | — | Según la definición en texto del §7 |
| `receivedAt` | Date | No | — | Según la definición en texto del §7 |
| `appliedAt` | Date | No | — | Según la definición en texto del §7 |
| `lineResults` | array | No | — | resumen |
| `lineErrorsRef` | string | No | — | archivo de errores por línea |
| `approvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `supersedesId` | uniqueidentifier | No | `integrationFileExchanges` (T06) | destino → `integrationFileExchanges` |
| `externalTransactionNumber` | string | No | — | Número de transacción del ente, ej. `nro_transaccion` SIRO (no referencia); antes `externalTransactionId` |
| `fileLayoutId` | uniqueidentifier | Sí | `fileLayouts` (T06) | destino → `fileLayouts` |
| `fileHash` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`integrationReconciliations`** — Conciliaciones técnicas con proveedores (COL-INT-12; definición en texto en §7.11)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `type` | enum | No | — | `payments`, `debtPublication`, `fiscal`, `bank`, `messaging`, `metering` |
| `periodFrom` | string | No | — | Según la definición en texto del §7 |
| `periodTo` | string | No | — | Según la definición en texto del §7 |
| `external` | string | No | — | Según la definición en texto del §7 |
| `internal` | string | No | — | Según la definición en texto del §7 |
| `differences` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | §8.8 |
| `actStoredFileId` | uniqueidentifier | No | `storedFiles` (T01) | acta de conciliación en `storedFiles`; antes `actFileId`, T05 §7.2 |
| `approvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `closedAt` | Date | No | — | Según la definición en texto del §7 |

**`integrationAlerts`** — Alertas de integración (COL-INT-13; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `type` | enum | No | — | `certificate_expiring`, `certificate_expired`, `credential_expiring`, `credential_rotation_due`, `circuit_open`, `error_rate`, `backlog`, `uncertain_operations`, `reconciliation_differences`, `webhook_signature_invalid`, `quota_near`, `quota_exceeded`, `schedule_missed`, `agent_offline`, `file_not_received`, `mode_mismatch` |
| `severity` | enum | No | — | `info`, `warning`, `critical` |
| `status` | enum | Sí | — | `open`, `acknowledged`, `resolved` |
| `dedupKey` | string | No | — | Según la definición en texto del §7 |
| `count` | int | No | — | Según la definición en texto del §7 |
| `firstAt` | Date | No | — | Según la definición en texto del §7 |
| `lastAt` | Date | No | — | Según la definición en texto del §7 |
| `notifiedTo` | array de string | No | — | Según la definición en texto del §7 |
| `ackBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `resolvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `link` | string | No | — | Según la definición en texto del §7 |

**`integrationContingencies`** — Contingencias declaradas (ARCA caída, pasarela caída) (COL-INT-14; definición en texto en §7.13)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `reason` | string | No | — | Según la definición en texto del §7 |
| `trigger` | enum | No | — | `manual`, `circuit`, `credential`, `provider_notice` |
| `mode` | enum | No | — | `caea`, `manualFile`, `deferredQueue`, `alternateProvider`, `manualRecord`, `fieldOperation` |
| `startedAt` | Date | No | — | Según la definición en texto del §7 |
| `declaredBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `approvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `endedAt` | Date | No | — | Según la definición en texto del §7 |
| `endedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `affectedOperations` | array | No | — | conteo |
| `closingReconciliationId` | uniqueidentifier | No | `integrationReconciliations` (T06) | destino → `integrationReconciliations` |
| `status` | enum | Sí | — | §8.9 |

**`externalReferences`** — Identificadores externos de entidades propias (COL-INT-15; definición en texto en §7.14)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `system` | string | No | — | código de proveedor o sistema |
| `externalId` | string | Sí | — | Según la definición en texto del §7 |
| `entityRef` | string | Sí | — | antes `entity` en el texto del §7 (nombre canónico de T05) |
| `kind` | enum | No | — | `paymentId`, `intentId`, `qrId`, `debitAdhesionId`, `meterId`, `subscriberId`, `voucherId`, `legacyProcoopId` |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `supersededBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `providerCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `entityType` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`localAgents`** — Agentes de hardware local registrados (COL-INT-16; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `branchId` | uniqueidentifier | No | `branches` (T04) | destino → `branches` |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `os` | array | No | — | Según la definición en texto del §7 |
| `agentVersion` | string | No | — | Según la definición en texto del §7 |
| `publicKey` | string | No | — | Según la definición en texto del §7 |
| `pairingCodeHash` | string | No | — | Según la definición en texto del §7 |
| `pairingExpiresAt` | Date | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | §8.10 |
| `devices` | array | No | — | Según la definición en texto del §7 |
| `lastSeenAt` | Date | No | — | Según la definición en texto del §7 |
| `ip` | string | No | — | último |
| `capabilities` | array | No | — | Según la definición en texto del §7 |
| `workstationId` | uniqueidentifier | Sí | `workstations` (T04) | destino → `workstations` |
| `agentCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`localAgentCommands`** — Comandos al agente local; TTL (COL-INT-17; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `agentId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `localAgentId` | uniqueidentifier | Sí | `localAgents` (T06) | antes `deviceId` en el texto del §7 (nombre canónico de T05); destino → `localAgents` |
| `commandId` | enum | Sí | — | `print`, `display`, `readCard`, `readScale`, `scan`, `dispense`, `collectorDownload`, `collectorUpload`; antes `command` en el texto del §7 (nombre canónico de T05) |
| `payloadRef` | string | No | — | Según la definición en texto del §7 |
| `signature` | string | No | — | Según la definición en texto del §7 |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `queued`, `sent`, `acknowledged`, `done`, `failed`, `expired` |
| `result` | string | No | — | Según la definición en texto del §7 |
| `operationId` | string | No | — | Según la definición en texto del §7 |

**`aiUsageLogs`** — Llamadas a IA por request (costo, modelo, tokens) (COL-INT-18; definición en texto en §7.16)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `connectionId` | uniqueidentifier | No | `integrationConnections` (T06) | destino → `integrationConnections` |
| `feature` | enum | No | — | `invoiceExtraction`, `ticketNotesAnalysis`, `formulaAssistant`, `moderation`, `biAsk`, `surveyAnalysis`, `postGeneration`, `crmClassification` |
| `provider` | string | No | — | Según la definición en texto del §7 |
| `model` | string | No | — | Según la definición en texto del §7 |
| `promptHash` | string | No | — | Según la definición en texto del §7 |
| `piiRedacted` | bool | No | — | bool |
| `tokensIn` | int | No | — | Según la definición en texto del §7 |
| `tokensOut` | int | No | — | Según la definición en texto del §7 |
| `cost` | DECIMAL(18,4) | No | — | DECIMAL(18,4) |
| `currency` | string | No | — | Según la definición en texto del §7 |
| `actorId` | uniqueidentifier | Sí | `memberships` (T02) | antes `userId` en el texto del §7 (nombre canónico de T05); destino → `memberships` |
| `businessRef` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `ok`, `error`, `blocked`; §8.12; PA-INT-26 |
| `latencyMs` | int | No | — | Según la definición en texto del §7 |
| `outcome` | enum | No | — | `proposed`, `accepted`, `rejected`, `edited` |


## 8. Estados y transiciones

### 8.1 Conexión (`integrationConnections.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `draft` | Resp. integraciones | Licencia del conector | Se crea sin ejecutar | Eliminar borrador |
| `draft` → `testing` | Resp. integraciones | Config válida y secretos cargados | Permite "probar conexión" en modo `test` | → `draft` |
| `testing` → `active` | Resp. + aprobador (si `production` y tipo sensible) | Prueba OK en el modo elegido | Evento `int.connection.activated`; jobs programados | → `suspended` |
| `active` → `degraded` | Sistema | Error rate o circuito semiabierto | Alerta `warning` | Automático a `active` |
| `active`/`degraded` → `blocked_credential` | Sistema | Error `auth`/`credential_expired`/certificado vencido | Pausa colas; alerta `critical` | → `active` al cargar credencial válida y probar |
| `active` → `paused` | Resp. | — | Operaciones quedan `queued` | → `active` |
| `active` → `contingency` | Resp. (o sugerido) | Contingencia declarada | Modo alternativo de la ficha | → `active` al cerrar con conciliación |
| cualquiera → `suspended` | Resp./plataforma | — | No ejecuta; conserva historia | → `active` (con prueba) |
| `suspended` → `retired` | Admin tenant | Sin operaciones abiertas | Solo lectura | No |

Cambio de `mode` (`test` ↔ `production`) es una transición separada: requiere `int.modo.cambiar`, aprobación y prueba; emite `int.connection.modeChanged`.

### 8.2 Secreto

`pending` → `active` (prueba OK) → `rotated` (nueva versión activa; gracia PRM-INT-009) → `revoked`. `active` → `expired` (por `expiresAt`). `active` → `revoked` (incidente; la conexión pasa a `blocked_credential` si no hay otra versión activa). No hay reversión a una versión revocada: se carga una nueva.

### 8.3 Certificado

`csr_generated` → `pending_upload` (CSR descargado) → `active` (certificado subido y validado) → `expiring` (≤ 30 días) → `expired`. `active`/`expiring` → `superseded` (otro certificado activado) → (conservado para auditoría). Cualquiera → `revoked`. Un certificado `expired`/`revoked` no se puede reactivar.

### 8.4 Operación de integración

| Origen → Destino | Actor | Condición | Efecto |
|---|---|---|---|
| — → `queued` | Outbox | Cambio de negocio confirmado | Job encolado |
| `queued` → `in_progress` | Worker | Circuito cerrado/semiabierto, conexión activa, tasa disponible | Mensaje saliente |
| `in_progress` → `succeeded` | Worker | Respuesta válida | Evento `int.operation.succeeded` + evento de dominio del conector |
| `in_progress` → `retry_scheduled` | Worker | Error reintentable y quedan intentos | `nextAttemptAt` con backoff |
| `retry_scheduled` → `in_progress` | Worker | Llega `nextAttemptAt` | |
| `in_progress` → `uncertain` | Worker | Timeout/corte sin respuesta en operación con efecto externo | Se programa consulta de reconciliación |
| `uncertain` → `succeeded` / `queued` | Worker | La consulta confirma aplicado / no aplicado | Si no aplicado, reintento con la misma clave |
| `in_progress` → `failed` | Worker | Error permanente o sin intentos | Bandeja; evento `int.operation.failed` |
| `queued`/`retry_scheduled` → `blocked` | Sistema | Conexión `blocked_credential`/`paused`/circuito abierto | Espera, sin consumir intentos |
| `blocked` → `queued` | Sistema | Conexión vuelve a `active` | |
| `failed`/`uncertain` → `manual_resolved` | Usuario con capability (+ aprobador) | Evidencia | Evento `int.operation.manuallyResolved` |
| `queued`/`failed` → `cancelled` | Usuario o módulo dueño | La operación ya no aplica | Evento `int.operation.cancelled` |

`succeeded`, `manual_resolved` y `cancelled` son finales. Reglas: no hay transición de `succeeded` a otro estado; un reverso externo (contracargo, NC) es **otra operación**.

### 8.5 Mensaje de bitácora

Inmutable una vez escrito; solo cambia `retentionUntil` (purga del cuerpo conservando metadatos).

### 8.6 Webhook en bandeja

`received` → `rejected` (firma/IP inválida; final) · `received` → `verified` → `processing` → `processed` (final) · `processing` → `failed` → `processing` (reintento) · `received` → `duplicate` (final, si `dedupKey` ya existe).

### 8.7 Intercambio de archivo

Saliente: `generated` → `approved` (si exige aprobación) → `delivered` (descarga registrada o SFTP OK) → `acknowledged` (acuse/estado del ente, ej. SIRO `obtener_informacion_base`) o `rejected_by_provider`. `generated` → `superseded` (regenerado). Entrante: `received` → `parsed` → `validated` (con errores por línea) → `applied` / `partially_applied` / `failed`; `received` → `duplicate`. Un archivo `applied` no se reaplica; las correcciones son una nueva ejecución identificada (CU-31).

### 8.8 Conciliación

`open` → `in_review` (hay diferencias) → `closed` (sin diferencias abiertas) o `closed_with_differences` (aprobadas con explicación). `in_review` → `open` (recalcular). Cierre requiere `int.conciliaciones.aprobar`.

### 8.9 Contingencia

`declared` → `active` (aprobada si la ficha lo exige) → `closing` (conexión recuperada; conciliación en curso) → `closed`. `declared` → `cancelled`.

### 8.10 Agente local

`pairing` → `online` ↔ `offline` (sin latido por PRM-INT-050) → `revoked` (final). `online` → `outdated` (versión menor a la mínima) → `online` al actualizar.

### 8.11 Circuit breaker (Redis)

`closed` → `open` (fallos ≥ umbral en ventana) → `half_open` (tras `openMs`) → `closed` (sondeos OK) o `open` (falla sondeo). Cada transición emite `int.circuit.*` y actualiza `health`.

### 8.12 Colecciones con estado sin máquina propia

Corrección del 05-11-2026: §7 declaraba estos estados sin transiciones. Estado inicial: el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `integrationProviders` | — | `draft` | Alta del proveedor en el catálogo de plataforma | — | — |
| `integrationProviders` | `draft` | `available` | Publicación por `int.proveedores.configurar` | Adaptador desplegado y prueba de homologación OK | — |
| `integrationProviders` | `available` | `deprecated` | Anuncio de retiro | — | — |
| `integrationProviders` | `deprecated` | `retired` | Retiro definitivo | Ninguna conexión `active` lo usa | — |
| `integrationAlerts` | — | `open` | Regla de alerta cumplida (o repetición que suma `count` por `dedupKey`) | — | — |
| `integrationAlerts` | `open` | `acknowledged` | Reconocimiento por `int.alertas.gestionar` | — | — |
| `integrationAlerts` | `open`, `acknowledged` | `resolved` | Manual o automático cuando la condición deja de cumplirse | — | — |
| `localAgentCommands` | — | `queued` | Un módulo pide una acción de dispositivo | Agente `online` o en espera hasta `expiresAt` | — |
| `localAgentCommands` | `queued` | `sent` | Entrega por el canal del agente (API-INT-47) | Firma del comando válida | — |
| `localAgentCommands` | `sent` | `acknowledged` | El agente confirma recepción | — | — |
| `localAgentCommands` | `acknowledged` | `done` | Resultado OK | — | `int.agent.commandResult` |
| `localAgentCommands` | `sent`, `acknowledged` | `failed` | Error del dispositivo | — | `int.agent.commandResult` |
| `localAgentCommands` | `queued`, `sent` | `expired` | Pasa `expiresAt` sin resultado | — | — |
| `webhookEndpoints` | — | `active` | Alta del endpoint de la conexión | — | — |
| `webhookEndpoints` | `active` | `rotating` | Rotación de clave: conviven la nueva y la anterior hasta `previousKeyValidUntil` | — | `int.credential.rotated` |
| `webhookEndpoints` | `rotating` | `active` | Vence `previousKeyValidUntil` | — | — |
| `webhookEndpoints` | `active`, `rotating` | `disabled` | Baja de la conexión o incidente | — | — |

`aiUsageLogs` es un registro inmutable: cada llamada se escribe con su `status` final (`ok`, `error`, `blocked`: bloqueada por política o porque la IA está apagada en el tenant; PA-INT-26, Asumida DEC-072; antes `succeeded`, `failed`, `blockedByPolicy` [VERIFICAR]) y no cambia; solo `outcome` se actualiza cuando la persona acepta, rechaza o edita la sugerencia.

### 8.13 Tabla normalizada de las máquinas de §8.2, §8.3 y §8.6 a §8.10

Corrección del cierre de residuales (05-11-2026; PA-INT-27): una fila por transición de las máquinas descritas en texto, con el estado de alta explícito (`—`). Prevalece el texto de cada subsección si hay diferencia.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `integrationSecrets.status` | — | `pending` | Carga del secreto en la bóveda | — | — |
| `integrationSecrets.status` | `pending` | `active` | Prueba de conexión correcta | — | — |
| `integrationSecrets.status` | `active` | `rotated` | Nueva versión activa (gracia PRM-INT-009) | — | — |
| `integrationSecrets.status` | `rotated` | `revoked` | Fin de la gracia de rotación | — | — |
| `integrationSecrets.status` | `active` | `expired` | Pasa `expiresAt` | — | — |
| `integrationSecrets.status` | `active` | `revoked` | Incidente (la conexión pasa a `blocked_credential` si no hay otra versión activa) | — | — |
| `integrationCertificates.status` | — | `csr_generated` | Generación del CSR | — | — |
| `integrationCertificates.status` | `csr_generated` | `pending_upload` | Descarga del CSR | — | — |
| `integrationCertificates.status` | `pending_upload` | `active` | Certificado subido y validado | — | — |
| `integrationCertificates.status` | `active` | `expiring` | Faltan 30 días o menos para el vencimiento | — | — |
| `integrationCertificates.status` | `expiring` | `expired` | Vencimiento | — | — |
| `integrationCertificates.status` | `active` | `superseded` | Otro certificado activado | — | — |
| `integrationCertificates.status` | `expiring` | `superseded` | Otro certificado activado | — | — |
| `integrationCertificates.status` | `csr_generated` | `revoked` | Revocación | — | — |
| `integrationCertificates.status` | `pending_upload` | `revoked` | Revocación | — | — |
| `integrationCertificates.status` | `active` | `revoked` | Revocación | — | — |
| `integrationCertificates.status` | `expiring` | `revoked` | Revocación | — | — |
| `webhookInbox.status` | — | `received` | Llega el webhook (API-INT-30) | — | — |
| `webhookInbox.status` | `received` | `rejected` | Firma o IP inválida | — | — |
| `webhookInbox.status` | `received` | `verified` | Firma válida | — | — |
| `webhookInbox.status` | `received` | `duplicate` | `dedupKey` ya existente | — | — |
| `webhookInbox.status` | `verified` | `processing` | El worker toma el webhook | — | — |
| `webhookInbox.status` | `processing` | `processed` | Procesamiento correcto | — | — |
| `webhookInbox.status` | `processing` | `failed` | Error de procesamiento | — | — |
| `webhookInbox.status` | `failed` | `processing` | Reintento | — | — |
| `integrationFileExchanges.status` | — | `generated` | Generación del archivo saliente | — | — |
| `integrationFileExchanges.status` | — | `received` | Recepción del archivo entrante (manual, SFTP o API) | — | — |
| `integrationFileExchanges.status` | `generated` | `approved` | Aprobación (si la ficha la exige) | — | — |
| `integrationFileExchanges.status` | `generated` | `delivered` | Entrega sin aprobación | — | — |
| `integrationFileExchanges.status` | `approved` | `delivered` | Descarga registrada o SFTP correcto | — | — |
| `integrationFileExchanges.status` | `delivered` | `acknowledged` | Acuse del ente | — | — |
| `integrationFileExchanges.status` | `delivered` | `rejected_by_provider` | Rechazo del ente | — | — |
| `integrationFileExchanges.status` | `generated` | `superseded` | Regeneración | — | — |
| `integrationFileExchanges.status` | `received` | `parsed` | Parseo por layout | — | — |
| `integrationFileExchanges.status` | `received` | `duplicate` | Hash ya recibido | — | — |
| `integrationFileExchanges.status` | `parsed` | `validated` | Validación por línea | — | — |
| `integrationFileExchanges.status` | `validated` | `applied` | Confirmación: todas las líneas aplicadas | — | — |
| `integrationFileExchanges.status` | `validated` | `partially_applied` | Confirmación con líneas rechazadas | — | — |
| `integrationFileExchanges.status` | `validated` | `failed` | Error al aplicar | — | — |
| `integrationReconciliations.status` | — | `open` | Apertura de la conciliación del período | — | — |
| `integrationReconciliations.status` | `open` | `in_review` | Hay diferencias | — | — |
| `integrationReconciliations.status` | `in_review` | `open` | Recalcular | — | — |
| `integrationReconciliations.status` | `open` | `closed` | Cierre sin diferencias (`int.conciliaciones.aprobar`) | — | — |
| `integrationReconciliations.status` | `in_review` | `closed` | Cierre sin diferencias abiertas (`int.conciliaciones.aprobar`) | — | — |
| `integrationReconciliations.status` | `in_review` | `closed_with_differences` | Cierre con diferencias explicadas (`int.conciliaciones.aprobar`) | — | — |
| `integrationContingencies.status` | — | `declared` | Declaración de la contingencia | — | — |
| `integrationContingencies.status` | `declared` | `active` | Aprobación (si la ficha la exige) | — | — |
| `integrationContingencies.status` | `declared` | `cancelled` | Cancelación | — | — |
| `integrationContingencies.status` | `active` | `closing` | Conexión recuperada; conciliación en curso | — | — |
| `integrationContingencies.status` | `closing` | `closed` | Conciliación de cierre aprobada | — | — |
| `localAgents.status` | — | `pairing` | Alta del agente con código de emparejamiento (API-INT-48) | — | — |
| `localAgents.status` | `pairing` | `online` | Emparejamiento correcto y primer latido | — | — |
| `localAgents.status` | `online` | `offline` | Sin latido por PRM-INT-050 | — | — |
| `localAgents.status` | `offline` | `online` | Vuelve el latido | — | — |
| `localAgents.status` | `online` | `outdated` | Versión menor a la mínima | — | — |
| `localAgents.status` | `outdated` | `online` | Actualización del agente | — | — |
| `localAgents.status` | `online` | `revoked` | Baja del agente | — | — |
| `localAgents.status` | `offline` | `revoked` | Baja del agente | — | — |

Referencias de §7 sin destino explícito: `integrationConnections.fallbackConnectionIds[]` → `integrationConnections` (T06); `integrationSecrets.dataKeyId` → `encryptionKeys` (T08, propósito `dek-secreto`); `integrationSecrets.kmsKeyId` → clave maestra del KMS (referencia externa, no colección); `integrationFileExchanges.externalTransactionNumber` (antes `externalTransactionId`) → identificador del ente externo (no colección); `integrationContingencies.closingReconciliationId` → `integrationReconciliations` (T06); `localAgentCommands.agentId` → `localAgents` (T06); `localAgentCommands.deviceId` → `localAgents.devices[].deviceId` (T06); `localAgentCommands.operationId` → `integrationOperations` (T06). El `commandId` del contrato CAS (§ fichas) es la clave de idempotencia del comando, no una referencia.

## 9. Procesos y flujos

### 9.1 Llamada saliente estándar (JOB-INT-01 `int:ejecutar-operacion`)

1. El módulo dueño, dentro de su transacción, llama a `integrations.enqueue({ connectionPurpose|connectionId, operationType, businessRef, payload, idempotencyKey, priority })`. Se crea la `integrationOperation` (`queued`) y el registro outbox.
2. El relay del outbox publica en la cola de la categoría con `jobId = operationId` (BullMQ descarta duplicados).
3. El worker verifica: conexión activa y en el modo permitido por el ambiente (RF-INT-030), circuito, tasa, credenciales vigentes. Si algo bloquea ⇒ `blocked`.
4. Resuelve secretos de la bóveda (descifrado en memoria, auditado) y token de sesión (caché con lock).
5. Construye el mensaje con el adaptador, lo registra saneado (`integrationMessages`), lo envía con timeout.
6. Clasifica la respuesta (taxonomía). Éxito ⇒ `succeeded`, guarda `result` y `externalReferences`, publica `int.operation.succeeded` + evento del conector (ej. `int.arca.caeObtained`). Reintentable ⇒ `retry_scheduled`. Sin respuesta ⇒ `uncertain` (9.2). Permanente ⇒ `failed` + bandeja.
7. Actualiza métricas, `health` y circuito.

### 9.2 Resolución de resultado incierto (JOB-INT-02 `int:resolver-incierto`)

1. Se ejecuta la capacidad de consulta declarada por el conector (`lastAuthorized`/`getVoucher` en ARCA; `getPayment` en pasarelas; `getStatus` en equipos de red/medidores; `getDebtPublicationStatus` en SIRO).
2. Si el proveedor aplicó la operación ⇒ `succeeded` con el resultado obtenido de la consulta.
3. Si no ⇒ `queued` con la misma clave idempotente (reintento seguro).
4. Si la consulta tampoco responde ⇒ reprogramar con backoff hasta PRM-INT-012; vencido ⇒ `failed` con categoría `uncertain` y alerta `uncertain_operations` (no se reintenta sin humano).

### 9.3 Webhook entrante (JOB-INT-03 `int:procesar-webhook`)

1. `POST /api/public/{tenantSlug}/webhooks/{endpointKey}`: rate limit por IP; resolver endpoint; validar IP (si aplica), firma y timestamp; persistir en `webhookInbox` (`received`/`verified`/`rejected`) y bitácora; responder 2xx (o 401 si firma inválida).
2. Responder desafíos de verificación (Meta `hub.challenge`).
3. Encolar el procesamiento: deduplicar por `dedupKey`; mapear a la operación/intención (`external_reference`, `CodPag` equivalente).
4. Reconsultar al proveedor (RF-INT-056); con el estado confirmado publicar el evento de dominio (`int.payment.confirmed`, `int.message.delivered`, `int.signature.completed`…).
5. Errores ⇒ `failed` con reintento; excedidos ⇒ bandeja.

### 9.4 Publicación de deuda y rendición por archivo (JOB-INT-04 `int:generar-archivo`, JOB-INT-05 `int:procesar-archivo-entrante`)

Saliente: M07 entrega el universo (deuda cobrable por ente) ⇒ T06 aplica el layout (registros, DV, totales, archivo de control) ⇒ previsualización y aprobación (si aplica) ⇒ entrega (descarga firmada/SFTP/API) ⇒ espera acuse (SIRO `Get_BaseInfo`) ⇒ `acknowledged`/`rejected_by_provider` ⇒ evento `int.debtPublication.acknowledged`.

Entrante: archivo recibido (manual/SFTP/API) ⇒ hash y duplicado ⇒ parseo por layout ⇒ validación por línea (RF-INT-066) ⇒ preview con errores ⇒ confirmación ⇒ por cada línea válida evento `int.remittance.lineReceived` con id externo, importe, fecha de pago y de acreditación, canal ⇒ M07 imputa y devuelve resultado por línea ⇒ estado del archivo `applied`/`partially_applied` ⇒ conciliación automática del lote.

### 9.5 Conciliación (JOB-INT-06 `int:conciliar`)

Programada por conexión (diaria por defecto, ventana PRM-INT-022): obtiene el listado externo (`listCollections`, reporte de cobranza, `Listados/Proceso`, extracto) ⇒ compara con lo confirmado internamente por `externalReferences` ⇒ altas sin intención previa a revisión ("pago app") ⇒ diferencias a `integrationReconciliations` ⇒ alerta si hay diferencias ⇒ cierre con aprobación.

### 9.6 Recuperación de pendientes (JOB-INT-07 `int:recuperar-pendientes`)

Cada PRM-INT-025 minutos revisa intenciones/operaciones `queued`/`retry_scheduled` vencidas, `uncertain` y webhooks `failed`; con barridos amplios en horarios configurables (reemplaza la ventana de 40 min y los barridos de 4, 11, 16 y 23 h de ProCoop).

### 9.7 Salud y monitoreo (JOB-INT-08 `int:health-check`)

Cada PRM-INT-013 minutos por conexión activa con capacidad `healthCheck`; actualiza `health`; abre/cierra alertas `error_rate`, `backlog`, `schedule_missed`, `file_not_received` (archivo de rendición esperado que no llegó a la hora configurada).

### 9.8 Vencimientos (JOB-INT-09 `int:alertar-vencimientos`)

Diario (hora del tenant): certificados y credenciales con `notAfter`/`expiresAt`; umbrales PRM-INT-006; una alerta por umbral; al vencer, conexión `blocked_credential` (si no hay versión alternativa) y alerta `critical` a tenant y plataforma.

### 9.9 Rotación de credenciales (JOB-INT-10 `int:rotar-credencial`)

Manual o programada: carga de nueva versión (`pending`) ⇒ prueba de conexión con la nueva ⇒ activación ⇒ gracia ⇒ revocación de la anterior ⇒ auditoría. Para proveedores con API de rotación (tokens OAuth de larga vida), el job pide el nuevo token automáticamente.

### 9.10 Renovación de tokens (JOB-INT-11 `int:refrescar-tokens`)

Antes de `expiresAt − margen` renueva TA de WSAA por servicio/CUIT y tokens OAuth (Interbanking, NaranjaX, SiPago, Pagos TIC), tomando lock distribuido.

### 9.11 Contingencia (JOB-INT-12 `int:cerrar-contingencia`)

Declaración (manual o sugerida tras circuito abierto más de PRM-INT-014 min) ⇒ aprobación ⇒ modo alternativo (ej. fiscal: M06 emite con CAEA vigente; redes: exportación manual del archivo; mensajería: cola diferida o conexión alternativa) ⇒ al recuperar, `closing`: reproceso de diferidos, informe de CAEA, verificación de inciertos ⇒ conciliación ⇒ `closed`.

### 9.12 Reemplazo manual

Desde la bandeja: el usuario elige "registrar resultado externo", completa el resultado (ej. id de pago, importe, fecha), adjunta evidencia (captura del panel del proveedor, acuse), indica motivo; si la ficha exige doble control, otro usuario aprueba; la operación pasa a `manual_resolved` y emite el mismo evento de dominio con marca `manual: true`; la próxima conciliación lo verifica.

### 9.13 Mensajería saliente (JOB-INT-13 `int:entregar-mensaje`)

T09 entrega lotes de destinatarios ya resueltos ⇒ T06 aplica límite de tasa, plantillas aprobadas (WhatsApp), adjuntos por URL firmada ⇒ envío ⇒ estado `sent` ⇒ webhooks de estado (`delivered`, `read`, `bounced`, `complaint`, `failed`) ⇒ eventos `int.message.*` ⇒ failover a conexión alternativa si la primaria está caída (email/SMS).

### 9.14 Agente local (JOB-INT-14 `int:despachar-comando-agente`)

Comando de dominio (imprimir ticket, mostrar turno) ⇒ `localAgentCommands` firmado con expiración ⇒ envío por el WebSocket del agente ⇒ acuse ⇒ resultado ⇒ si el agente está `offline`, el comando espera hasta expirar y luego `expired` con alerta; el dominio decide alternativa (ej. imprimir PDF en navegador).

### 9.15 Purga y archivo de bitácora (JOB-INT-15 `int:purgar-bitacora`)

Diario: elimina cuerpos vencidos según retención (PRM-INT-010/011) y archiva metadatos antiguos en almacenamiento frío; nunca borra operaciones vinculadas a documentos económicos dentro del plazo legal.

### 9.16 Buzón SFTP (JOB-INT-16 `int:leer-buzon-sftp`) y entrega SFTP (JOB-INT-17 `int:entregar-sftp`)

Lectura programada del directorio del ente con patrón de nombre; descarga, hash, movimiento a "procesados" en el servidor remoto si el ente lo permite; entrega con reintento y verificación de tamaño/hash.

### 9.17 Sincronización de parámetros ARCA (JOB-INT-18 `int:sincronizar-parametros-arca`)

Semanal y a demanda: `FEParamGet*` (tipos de comprobante, IVA, tributos, monedas, puntos de venta, condición IVA del receptor, actividades, cotizaciones) ⇒ evento `int.arca.paramsSynced` ⇒ M06/T04 actualizan tablas maestras con vigencia.

## 10. Pantallas

Todas en `apps/admin` con `AdminShell`, `AdminStickyHeader`, `ScreenHelp`, `DataTable` genérico (columnas configurables, filtros, exportación XLSX/CSV/PDF, vistas guardadas), modales `sm/md/lg/xl`, `ConfirmDialog` y toasts (CNX §4.2, §4.6). Grupo del mapa del sitio: **Configuración → Integraciones** (tenant) y **Plataforma → Integraciones** (`meta.platformOnly`). Importes y códigos en IBM Plex Mono.

| PAN-ID | App | Ruta | Capability | Propósito | Contenido principal | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|
| PAN-INT-01 | plataforma | `/admin/plataforma/integraciones/proveedores` | `int.proveedores.configurar` | Catálogo de proveedores y versiones de adaptadores | DataTable: código, tipo, versión, estado, capacidades, ambientes, licencia; modal `xl` de edición (URLs por ambiente, esquema de credenciales, políticas por defecto, egress). Vacío: "No hay proveedores; ejecutá la semilla del catálogo". | — (en ProCoop está en código) |
| PAN-INT-02 | admin | `/admin/integraciones/catalogo` | `int.conexiones.ver` | Ver integraciones disponibles para la licencia del tenant y su ficha | Tarjetas por tipo (Fiscal, Cobranza, Pasarelas, Bancos, Mensajería, Medición, Red, Mapas, Identidad, Firma, IA, Hardware) con estado "Disponible / Conectada / No incluida en licencia"; botón "Conectar" abre asistente. `ScreenHelp` con la ficha `FI-INT-NN`. | Menú Procoop WEB, Configuración de entes |
| PAN-INT-03 | admin | `/admin/integraciones/conexiones` y `/:id` | `int.conexiones.ver` / `int.conexiones.editar` / `int.conexiones.configurar` / `int.conexiones.probar` | Alta y gestión de conexiones | Listado: nombre, proveedor, modo (chip MODO PRUEBA), estado, salud (semáforo), último éxito, próximos vencimientos. Detalle con pestañas: **General** (nombre, propósito, por defecto, respaldo), **Configuración** (formulario generado por `configSchema`), **Credenciales** (nombres, huella, hint, estado, vencimiento; botones "Cargar", "Rotar", "Revocar"; nunca muestra valores), **Certificados**, **Alcance** (servicios, sucursales, puntos de venta, cajas, canales), **Calendario** (jobs y cron), **Webhook** (URL a registrar en el proveedor, esquema de firma, rotar endpoint), **Salud** (métricas, circuito), **Historial** (versiones y auditoría). Acciones: Probar conexión, Activar, Pausar, Suspender, Cambiar modo (con aprobación), Copiar a otro tenant. | `abm_bankos`, parámetros `V2_*` de cada pasarela, ABM de telemedición, `CORREOS_INTERNOS`, configuración Interbanking, `frmEnacom` (conceptos) |
| PAN-INT-04 | admin | `/admin/integraciones/tablero` | `int.monitoreo.ver` | Tablero del tenant | KPIs: conexiones OK/degradadas/caídas, operaciones del día por estado, inciertas, bandeja abierta, webhooks rechazados, archivos esperados no recibidos, conciliaciones con diferencias, certificados/credenciales por vencer (30 días). Gráficos por categoría y conexión. "Vacío honesto" si no hay datos. | Alerta "Hay facturas electrónicas pendientes de autorizar!"; aviso de vencimiento de certificado al iniciar |
| PAN-INT-05 | plataforma | `/admin/plataforma/integraciones/tablero` | `int.monitoreo.ver` (plataforma) | Tablero global | Mismo contenido agregado por tenant y por proveedor; ranking de tenants con incidencias; estado de proveedores (caídas globales, ej. ARCA). | — |
| PAN-INT-06 | admin | `/admin/integraciones/credenciales` | `int.credenciales.gestionar` | Vista consolidada de la bóveda | DataTable: conexión, credencial, tipo, versión, estado, cargada por/fecha, vencimiento, próxima rotación, último uso. Acciones: cargar/rotar/revocar (modal `md` con campo de solo escritura y confirmación). Reporte de accesos. | — (secretos en `VARIABLE`) |
| PAN-INT-07 | admin | `/admin/integraciones/certificados` | `int.certificados.gestionar` | Certificados y asistente ARCA | Listado con vencimiento y estado; asistente en 4 pasos: (1) datos (CUIT, alias, servicios ARCA), (2) generar CSR y descargarlo, (3) instructivo para asociarlo en ARCA y autorizar servicios web, (4) subir certificado y validar. Alternativa "Subir PFX". | Parámetros 2071/2925 |
| PAN-INT-08 | admin | `/admin/integraciones/operaciones` y `/:id` | `int.operaciones.ver` | Seguimiento de operaciones | Filtros: conexión, tipo, estado, entidad de negocio, lote, fecha, correlación. Detalle: línea de tiempo de intentos, mensajes (metadatos; cuerpos con `verPayload`), resultado, eventos emitidos, enlaces al documento. Acciones: Reintentar, Cancelar. | Pantalla de pendientes de factura electrónica, grilla de `PAGOS360` |
| PAN-INT-09 | admin | `/admin/integraciones/bandeja` | `int.operaciones.reintentar` / `int.operaciones.resolverManual` | Bandeja de operaciones detenidas | Agrupado por causa (credencial, validación, incierta, permanente, circuito); acción sugerida; selección masiva para reintentar; modal `lg` "Registrar resultado externo" con evidencia y aprobación. | — (no existía) |
| PAN-INT-10 | admin | `/admin/integraciones/bitacora` | `int.bitacora.ver` (+ `int.bitacora.verPayload`) | Bitácora de mensajes | DataTable: fecha, conexión, dirección, canal, acción, estado, duración, correlación; visor de cuerpos saneados (JSON/XML formateado) con aviso de acceso auditado. | `AUDITORIA_TELEMEDICION`, `AUDIT_MAIL`, logs en disco |
| PAN-INT-11 | admin | `/admin/integraciones/webhooks` | `int.webhooks.configurar` | Bandeja de webhooks | Recibidos, verificados, rechazados, duplicados, fallidos; detalle saneado; reprocesar. | — (Firebase) |
| PAN-INT-12 | admin | `/admin/integraciones/archivos` | `int.archivos.ver` / `int.archivos.generar` / `int.archivos.importar` / `int.archivos.aprobar` | Intercambio de archivos | Pestañas Salientes / Entrantes: archivo, layout, conexión, registros, totales, estado, hash. Acciones: generar (desde el lote del módulo dueño), aprobar, descargar (URL firmada), reenviar SFTP; **ExcelImportWizard** para entrantes: subir → preview con errores por línea → confirmar; descargar archivo de errores. | Importar/Exportar archivos de entes, Importar/Exportar débitos automáticos, Importar Archivo de Novedades, exportadores de regímenes |
| PAN-INT-13 | plataforma/admin | `/admin/integraciones/layouts` | `int.proveedores.configurar` (plataforma) / `int.archivos.ver` (tenant) | Layouts | Visor de registros y campos; editor (plataforma o variante del tenant); prueba con archivo de muestra: genera y compara byte a byte o parsea y muestra resultado. | `MODEINT`/`FORMAINT` (modelos de interfaz) |
| PAN-INT-14 | admin | `/admin/integraciones/conciliaciones` | `int.conciliaciones.ver` / `int.conciliaciones.aprobar` | Conciliaciones por conector | Lista por período y conexión; detalle externo vs. interno (bruto, comisión, IVA comisión, neto); diferencias con acciones (explicar, derivar a M07, ignorar con motivo); acta PDF. | `frmConciliacionInterbanking` (bancaria es de M14; acá la técnica por conector) |
| PAN-INT-15 | admin/plataforma | `/admin/integraciones/alertas` | `int.alertas.ver` / `int.alertas.gestionar` | Alertas | Lista con severidad, tipo, conexión, contador, estado; reconocer, resolver, silenciar por período con motivo. | — |
| PAN-INT-16 | admin | `/admin/integraciones/contingencias` | `int.contingencias.declarar` | Contingencias | Declarar (modal con modo alternativo según ficha), seguimiento, cierre con conciliación. | — |
| PAN-INT-17 | admin | `/admin/integraciones/agentes` | `int.agentes.gestionar` | Agentes locales | Alta (código de emparejamiento de un uso), dispositivos, estado/latido, versión, comandos recientes, revocar. | Configuración del Agente, turnero (2006/2007), lectores (2351/2352/2357) |
| PAN-INT-18 | admin/plataforma | `/admin/integraciones/consumo` | `int.monitoreo.ver` | Consumo y cuotas | Por conexión y mes: mensajes, consultas de mapas, tokens IA, consultas ARCA, archivos; cuota y % usado. | — |
| PAN-INT-19 | admin | `/admin/integraciones/identificadores` | `int.operaciones.ver` | Búsqueda de identificadores externos | Buscar por id externo (pago, QR, adhesión, medidor) y navegar a la entidad. | Búsqueda por `ID_360`, `ID_SIRO` |
| PAN-INT-20 | admin | `/admin/integraciones/ia` | `int.monitoreo.ver` | Uso de IA | Por función: consultas, tokens, costo, % propuestas aceptadas; política de datos personales del tenant. | `AUDIT_IA` |

Pantallas de negocio que **usan** conectores (caja con QR, lote de facturación, envío de deuda, débitos, padrón ARCA en alta de persona, mapas) pertenecen a sus módulos (M01, M05, M06, M07, M10, M19, T09) y muestran el estado de la operación con el componente compartido `IntegrationStatusBadge` (pendiente, confirmado, fallido, resultado incierto — AGR hipótesis 5.5).

## 11. API

Errores RFC 9457 con `requestId`; paginación `{ items, total, page, size }`; validación Zod. Ningún endpoint devuelve secretos.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-INT-01 | GET | `/api/platform/int/providers` | `int.proveedores.ver` | Listar catálogo | Sí |
| API-INT-02 | POST/PUT | `/api/platform/int/providers[/:code]` | `int.proveedores.configurar` | Alta/edición de proveedor | `Idempotency-Key` |
| API-INT-03 | GET | `/api/admin/int/catalog` | `int.conexiones.ver` | Proveedores disponibles para la licencia del tenant | Sí |
| API-INT-04 | GET | `/api/admin/int/connections` | `int.conexiones.ver` | Listar conexiones | Sí |
| API-INT-05 | POST | `/api/admin/int/connections` | `int.conexiones.crear` | Crear conexión (borrador) | `Idempotency-Key` |
| API-INT-06 | GET | `/api/admin/int/connections/:id` | `int.conexiones.ver` | Detalle (sin secretos) | Sí |
| API-INT-07 | PATCH | `/api/admin/int/connections/:id` | `int.conexiones.configurar` | Editar configuración (versión optimista) | Por `version` |
| API-INT-08 | POST | `/api/admin/int/connections/:id/test` | `int.conexiones.probar` | Probar conexión | No (registra prueba) |
| API-INT-09 | POST | `/api/admin/int/connections/:id/activate` | `int.conexiones.configurar` | Activar (puede generar solicitud de aprobación) | `Idempotency-Key` |
| API-INT-10 | POST | `/api/admin/int/connections/:id/pause` · `/resume` · `/suspend` | `int.conexiones.configurar` | Pausar/reanudar/suspender | Sí |
| API-INT-11 | POST | `/api/admin/int/connections/:id/mode` | `int.modo.cambiar` | Solicitar cambio de modo | `Idempotency-Key` |
| API-INT-12 | POST | `/api/admin/int/connections/:id/copy` | `int.conexiones.crear` | Copiar configuración a tenant autorizado (sin secretos) | `Idempotency-Key` |
| API-INT-13 | GET | `/api/admin/int/connections/:id/secrets` | `int.credenciales.gestionar` | Metadatos de credenciales | Sí |
| API-INT-14 | PUT | `/api/admin/int/connections/:id/secrets/:name` | `int.credenciales.gestionar` | Cargar nueva versión (solo escritura; el cuerpo nunca se registra) | `Idempotency-Key` |
| API-INT-15 | POST | `/api/admin/int/connections/:id/secrets/:name/rotate` · `/revoke` | `int.credenciales.gestionar` | Activar versión pendiente / revocar | `Idempotency-Key` |
| API-INT-16 | GET | `/api/admin/int/secrets/access-log` | `int.credenciales.gestionar` | Accesos a secretos | Sí |
| API-INT-17 | POST | `/api/admin/int/certificates/csr` | `int.certificados.gestionar` | Generar par de claves y CSR | `Idempotency-Key` |
| API-INT-18 | POST | `/api/admin/int/certificates/:id/upload` | `int.certificados.gestionar` | Subir certificado emitido y validar | `Idempotency-Key` |
| API-INT-19 | POST | `/api/admin/int/certificates/pfx` | `int.certificados.gestionar` | Importar PFX/P12 con contraseña | `Idempotency-Key` |
| API-INT-20 | GET | `/api/admin/int/certificates` | `int.certificados.gestionar` | Listar certificados | Sí |
| API-INT-21 | POST | `/api/admin/int/certificates/:id/activate` | `int.certificados.gestionar` | Activar como vigente | `Idempotency-Key` |
| API-INT-22 | GET | `/api/admin/int/operations` y `/:id` | `int.operaciones.ver` | Listar/detallar operaciones | Sí |
| API-INT-23 | POST | `/api/admin/int/operations/:id/retry` | `int.operaciones.reintentar` | Reintentar | Sí (misma clave) |
| API-INT-24 | POST | `/api/admin/int/operations/:id/cancel` | `int.operaciones.reintentar` | Cancelar | Sí |
| API-INT-25 | POST | `/api/admin/int/operations/:id/manual-resolution` | `int.operaciones.resolverManual` | Registrar resultado externo con evidencia | `Idempotency-Key` |
| API-INT-26 | POST | `/api/admin/int/operations/:id/manual-resolution/approve` | `int.operaciones.resolverManual` (otro usuario) | Aprobar resolución manual | Sí |
| API-INT-27 | POST | `/api/admin/int/operations/bulk-retry` | `int.operaciones.reintentar` | Reintento masivo por filtro | `Idempotency-Key` |
| API-INT-28 | GET | `/api/admin/int/messages` y `/:id` | `int.bitacora.ver` | Bitácora (metadatos) | Sí |
| API-INT-29 | GET | `/api/admin/int/messages/:id/payload` | `int.bitacora.verPayload` | Cuerpos saneados (auditado) | Sí |
| API-INT-30 | POST | `/api/public/:tenantSlug/webhooks/:endpointKey` | `public: true` (requiere firma del proveedor; antes "Firma del proveedor") | Recepción de webhooks | Sí (deduplicación) |
| API-INT-31 | GET | `/api/public/:tenantSlug/webhooks/:endpointKey` | `public: true` (requiere token de verificación; antes "Token de verificación") | Desafío de verificación (Meta) | Sí |
| API-INT-32 | GET/POST | `/api/admin/int/webhooks[/:id/reprocess]` | `int.webhooks.configurar` | Bandeja y reproceso | Sí |
| API-INT-33 | POST | `/api/admin/int/connections/:id/webhook/rotate` | `int.webhooks.configurar` | Rotar `endpointKey`/secreto | `Idempotency-Key` |
| API-INT-34 | GET | `/api/admin/int/files` y `/:id` | `int.archivos.ver` | Intercambios de archivos | Sí |
| API-INT-35 | POST | `/api/admin/int/files/:id/approve` · `/deliver` | `int.archivos.aprobar` | Aprobar y entregar saliente | Sí |
| API-INT-36 | GET | `/api/admin/int/files/:id/download` | `int.archivos.ver` | URL firmada de descarga | Sí |
| API-INT-37 | POST | `/api/admin/int/files/inbound` (multipart) → `/:id/preview` → `/:id/confirm` | `int.archivos.importar` | Carga entrante en 3 pasos | Hash del archivo |
| API-INT-38 | GET/POST | `/api/admin/int/layouts[/:code/test]` | `int.archivos.ver` / `int.proveedores.configurar` | Ver layouts y probar con archivo | Sí |
| API-INT-39 | GET | `/api/admin/int/reconciliations` y `/:id` | `int.conciliaciones.ver` | Conciliaciones | Sí |
| API-INT-40 | POST | `/api/admin/int/reconciliations/:id/differences/:diffId` · `/close` | `int.conciliaciones.aprobar` | Resolver diferencia / cerrar | `Idempotency-Key` |
| API-INT-41 | GET/POST | `/api/admin/int/alerts[/:id/ack|resolve|mute]` | `int.alertas.gestionar` | Alertas | Sí |
| API-INT-42 | POST | `/api/admin/int/contingencies` · `/:id/close` | `int.contingencias.declarar` | Declarar/cerrar contingencia | `Idempotency-Key` |
| API-INT-43 | GET | `/api/admin/int/dashboard` · `/api/platform/int/dashboard` | `int.monitoreo.ver` | Tableros | Sí |
| API-INT-44 | GET | `/api/admin/int/usage` | `int.monitoreo.ver` | Consumo y cuotas | Sí |
| API-INT-45 | GET | `/api/admin/int/external-references?system=&externalId=` | `int.operaciones.ver` | Buscar identificador externo | Sí |
| API-INT-46 | POST | `/api/admin/int/agents` · `/:id/revoke` | `int.agentes.gestionar` | Emparejar/revocar agente local | `Idempotency-Key` |
| API-INT-47 | GET (WebSocket) | `/api/v1/ext/agents/connect` | `int.agentes.ejecutar` (identidad de dispositivo del agente, S-AGT; antes "Identidad de dispositivo") | Canal del agente local (latido, comandos, resultados) | — |
| API-INT-48 | POST | `/api/v1/ext/agents/pair` | `public: true` (requiere código de emparejamiento de un uso; antes "Código de emparejamiento") | Emparejamiento inicial del agente | Sí (código de un uso) |
| API-INT-49 | GET | `/api/admin/int/ai-usage` | `int.monitoreo.ver` | Uso de IA | Sí |
| API-INT-50 | GET | `/api/admin/int/connections/:id/schedules` · PUT | `int.conexiones.configurar` | Calendario de ejecuciones | Por `version` |

Servicio interno (no HTTP) para los módulos: `integrations.enqueue(...)`, `integrations.call(...)` (síncrono acotado con timeout, para caja/padrón), `integrations.resolveConnection(purpose, scope)`, `integrations.registerExternalRef(...)`. La API pública para terceros y BI es de T10.

## 12. Eventos, jobs y fichas de integraciones

### 12.1 Eventos emitidos por T06

Todos se publican por outbox; el payload lleva `tenantId`, `connectionId`, `operationId`, `correlationId`, `businessRef` y datos neutrales (sin secretos).

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-INT-01 | `int.connection.activated` / `int.connection.suspended` / `int.connection.modeChanged` | Cambios de estado/modo de conexión (alias: `int.connection.modeChanged` antes `int.connection.mode-changed`) | Módulos dueños (habilitan funciones), T01 (consumo), T02 (auditoría) |
| EVT-INT-02 | `int.connection.blocked` | Credencial o certificado inválido/vencido | M05/M06 (pausar emisión), M07, T09, alertas |
| EVT-INT-03 | `int.operation.succeeded` / `int.operation.failed` / `int.operation.uncertain` / `int.operation.manuallyResolved` / `int.operation.cancelled` | Fin de operación (alias: `int.operation.manuallyResolved` antes `int.operation.manually-resolved`) | Módulo dueño de `businessRef` |
| EVT-INT-04 | `int.circuit.opened` / `int.circuit.closed` | Circuit breaker | Tableros, alertas, contingencia |
| EVT-INT-05 | `int.certificate.expiring` / `int.certificate.expired` / `int.credential.expiring` / `int.credential.rotated` | Vencimientos y rotación | Alertas, T09 (aviso a responsables) |
| EVT-INT-06 | `int.arca.caeObtained` / `int.arca.caeRejected` / `int.arca.caeaObtained` / `int.arca.caeaInformed` / `int.arca.paramsSynced` | ARCA (alias: `int.arca.caeObtained` antes `int.arca.cae-obtained`, `int.arca.paramsSynced` antes `int.arca.params-synced`, `int.arca.caeRejected` antes `int.arca.cae-rejected`, `int.arca.caeaObtained` antes `int.arca.caea-obtained`, `int.arca.caeaInformed` antes `int.arca.caea-informed`) | M05, M06 |
| EVT-INT-07 | `int.padron.personaRetrieved` | Consulta de padrón (alias: `int.padron.personaRetrieved` antes `int.padron.persona-retrieved`) | M01, M12 |
| EVT-INT-08 | `int.paymentIntent.created` / `int.payment.confirmed` / `int.payment.rejected` / `int.payment.reversed` / `int.payment.refunded` / `int.payment.unmatched` | Pasarelas, QR, redes (alias: `int.paymentIntent.created` antes `int.payment-intent.created`) | M07, M19 (estado al socio) |
| EVT-INT-09 | `int.debtPublication.acknowledged` / `int.debtPublication.rejected` | Publicación de deuda (alias: `int.debtPublication.acknowledged` antes `int.debt-publication.acknowledged`, `int.debtPublication.rejected` antes `int.debt-publication.rejected`) | M07 |
| EVT-INT-10 | `int.remittance.lineReceived` / `int.remittance.fileApplied` | Rendiciones (alias: `int.remittance.lineReceived` antes `int.remittance.line-received`, `int.remittance.fileApplied` antes `int.remittance.file-applied`) | M07 |
| EVT-INT-11 | `int.directDebit.adhesionUpdated` / `int.directDebit.resultReceived` | Débitos (alias: `int.directDebit.adhesionUpdated` antes `int.direct-debit.adhesion-updated`, `int.directDebit.resultReceived` antes `int.direct-debit.result-received`) | M07, M01 |
| EVT-INT-12 | `int.bank.movementsReceived` / `int.bank.balancesReceived` | Interbanking/extractos (alias: `int.bank.movementsReceived` antes `int.bank.movements-received`, `int.bank.balancesReceived` antes `int.bank.balances-received`) | M14 |
| EVT-INT-13 | `int.message.sent` / `int.message.delivered` / `int.message.read` / `int.message.bounced` / `int.message.failed` / `int.message.inboundReceived` | Mensajería (alias: `int.message.inboundReceived` antes `int.message.inbound-received`) | T09, M09 (bot/CRM) |
| EVT-INT-14 | `int.meter.readingReceived` / `int.meter.commandResult` / `int.prepaid.creditIssued` | Telemedición y prepago (alias: `int.meter.readingReceived` antes `int.meter.reading-received`, `int.meter.commandResult` antes `int.meter.command-result`, `int.prepaid.creditIssued` antes `int.prepaid.credit-issued`) | M03, M08, M10 |
| EVT-INT-15 | `int.network.provisioningResult` | ISP (alias: `int.network.provisioningResult` antes `int.network.provisioning-result`) | M10, M08 |
| EVT-INT-16 | `int.cdr.batchReceived` | Telefonía (alias: `int.cdr.batchReceived` antes `int.cdr.batch-received`) | M03/M05 (tasación) |
| EVT-INT-17 | `int.fleet.positionsReceived` | GPS (alias: `int.fleet.positionsReceived` antes `int.fleet.positions-received`) | M18 |
| EVT-INT-18 | `int.signature.completed` / `int.signature.rejected` | Firma | M16, M08, M12, T11 |
| EVT-INT-19 | `int.file.generated` / `int.file.delivered` / `int.file.received` / `int.file.rejected` | Archivos | Módulo dueño del lote |
| EVT-INT-20 | `int.reconciliation.closed` / `int.reconciliation.differencesFound` | Conciliación (alias: `int.reconciliation.differencesFound` antes `int.reconciliation.differences-found`) | M07, M14, M06 |
| EVT-INT-21 | `int.contingency.started` / `int.contingency.ended` | Contingencia | M05, M06, M07, tableros |
| EVT-INT-22 | `int.agent.online` / `int.agent.offline` / `int.agent.commandResult` | Agente local (alias: `int.agent.commandResult` antes `int.agent.command-result`) | M09 (turnero), M07 (caja), M11 (POS) |
| EVT-INT-23 | `int.ai.completionReady` | Respuesta IA (propuesta) (alias: `int.ai.completionReady` antes `int.ai.completion-ready`) | Módulo que la pidió |
| EVT-INT-24 | `int.serviceUsage.received` | Consumo del período de un servicio TIC con cupo (casillas de correo FI-INT-112, pack SMS vendido al socio; DEC-084) leído del proveedor por API o por archivo (FI-INT-96). Payload: `connectionId`, `providerCode`, `period` (`YYYY-MM`), `receivedAt`, `fileExchangeId?`, `lines[{ externalRef (casilla, línea o cuenta del proveedor), unit (sms|mailbox|gb), quantity (Decimal128 ≥ 0), measuredFrom, measuredTo }]`, `messageId` (bitácora). T06 no resuelve contratos: entrega la referencia externa tal como la informa el proveedor | M10 (atribuye cada línea al contrato y la registra; RF-TEC-195), que a su vez informa a M04 (RN-TAR-251) |

**Eventos consumidos por T06** (disparan operaciones; los emite el dueño): `fac.billingRun.approved` (EVT-FAC-03) y `fac.invoice.issued` (EVT-FAC-07) (M05 → CAE/CAEA), `fis.regimeFile.requested` (antes `fis.regime-file.requested`) (M06), `cob.paymentIntent.requested` (antes `cob.payment-intent.requested`), `cob.debtPublication.requested` (antes `cob.debt-publication.requested`), `cob.directDebit.batchRequested` (antes `cob.direct-debit.batch-requested`), `cob.refund.approved` (EVT-COB-27) (M07), `mor.interruption.approved` (EVT-MOR-12; corte o reconexión) (M08 → comando remoto), `tec.provisioning.requested` (EVT-TEC-33) (M10), `med.readingRoute.published` (antes `med.reading-route.published`) (M03), `com.message.dispatchRequested` (antes `com.message.dispatch-requested`) (T09), `per.person.fiscalLookupRequested` (antes `per.person.fiscal-lookup-requested`) (M01), `tes.bankSync.requested` (antes `tes.bank-sync.requested`) / `tes.paymentFile.requested` (antes `tes.payment-file.requested`) (M14), `sue.payrollFiles.requested` (antes `sue.payroll-files.requested`) (M16), `crm.queueTicket.called` (EVT-CRM-20) (M09 → turnero).

### 12.2 Jobs

| JOB-ID | Nombre | Disparo / frecuencia | Descripción |
|---|---|---|---|
| JOB-INT-01 | `int:ejecutar-operacion` | Por operación | §9.1 |
| JOB-INT-02 | `int:resolver-incierto` | Por operación incierta, con backoff | §9.2 |
| JOB-INT-03 | `int:procesar-webhook` | Por webhook | §9.3 |
| JOB-INT-04 | `int:generar-archivo` | A pedido del módulo dueño | §9.4 saliente |
| JOB-INT-05 | `int:procesar-archivo-entrante` | Carga/buzón | §9.4 entrante |
| JOB-INT-06 | `int:conciliar` | Diario por conexión (configurable) | §9.5 |
| JOB-INT-07 | `int:recuperar-pendientes` | Cada PRM-INT-025 min + barridos | §9.6 |
| JOB-INT-08 | `int:health-check` | Cada PRM-INT-013 min | §9.7 |
| JOB-INT-09 | `int:alertar-vencimientos` | Diario | §9.8 |
| JOB-INT-10 | `int:rotar-credencial` | Manual/programado | §9.9 |
| JOB-INT-11 | `int:refrescar-tokens` | Antes de vencer | §9.10 |
| JOB-INT-12 | `int:cerrar-contingencia` | Al recuperar conexión | §9.11 |
| JOB-INT-13 | `int:entregar-mensaje` | Por lote T09 | §9.13 |
| JOB-INT-14 | `int:despachar-comando-agente` | Por comando | §9.14 |
| JOB-INT-15 | `int:purgar-bitacora` | Diario | §9.15 |
| JOB-INT-16 | `int:leer-buzon-sftp` | Cron por conexión | §9.16 |
| JOB-INT-17 | `int:entregar-sftp` | Por archivo | §9.16 |
| JOB-INT-18 | `int:sincronizar-parametros-arca` | Semanal y a demanda | §9.17 |
| JOB-INT-19 | `int:polling-cobranzas` | Cron por conexión de pasarela/red con API (ej. Pagos360 `report/collection`, SIRO `Listados/Proceso`) | Respaldo del webhook (FI-INT-37, 43) |
| JOB-INT-20 | `int:sincronizar-estados-debito` | Diario | Estados de adhesiones (Pagos360 `pending_to_sign`, `signed`, `canceled`) |
| JOB-INT-21 | `int:importar-movimientos-bancarios` | Diario por cuenta | Interbanking movimientos de días anteriores |
| JOB-INT-22 | `int:leer-telemedicion` | Cron por sistema MDM | Lecturas remotas |
| JOB-INT-23 | `int:recibir-cdr` | Cron/buzón por central | Recibe o descarga el archivo de CDR de la central y publica EVT-INT-16; no parsea ni atribuye. Ver JOB-TEC-09 (dueño del parseo). |
| JOB-INT-24 | `int:importar-posiciones-gps` | Cada N min | Posiciones AVL |
| JOB-INT-25 | `int:revalidar-padron` | Mensual (opcional por tenant) | Revalidación masiva de condición fiscal (FI-INT-06/07) |
| JOB-INT-26 | `int:importar-padron-provincial` | Mensual/al publicarse | Padrones IIBB (FI-INT-18, 21, 22) |
| JOB-INT-27 | `int:vencer-intenciones` | Horario | Solo limpia la bitácora técnica de intenciones (RN-INT-033); el vencimiento de negocio es de M07. Ver JOB-COB-12 (dueño). |
| JOB-INT-28 | `int:consumo-mensual` | Mensual | Cierre de consumo por tenant (RF-INT-013) |

### 12.3 Cómo leer las fichas

Cada ficha `FI-INT-NN` sigue el formato: **Propósito**, **Módulo dueño** (y consumidores), **Dirección**, **Protocolo / formato**, **Datos intercambiados**, **Frecuencia**, **Credenciales** (solo nombres; los valores van en la bóveda), **Errores y contingencia**, **Ola / Prioridad** (Núcleo / Estándar / Extensión), **Estado de la investigación**, **Origen**, **Preguntas** (a la cooperativa o PA). Estados de investigación usados:

Alcance de "LAG" y "cooperativa piloto" (DEC-088, que reemplaza a DEC-081): Laguna Larga (`LAG`, base `PR_LAG_DEMO`) es la **cooperativa piloto** comercial y de migración y, a la vez, la **base relevada de referencia** de ProCoop; sus configuraciones, formatos (Red Link, SIRO) y valores se usan para el mapeo, las pruebas de paralelo y los `[VERIFICAR]`. Las preguntas "a la cooperativa piloto" se dirigen a LAG. (Antes, con DEC-081: LAG era solo base de referencia y la piloto no estaba definida.) Lo marcado como "Confirmado en LAG" aplica a toda cooperativa migrada con la misma configuración.

- **Confirmado en LAG**: verificado en la base `PR_LAG_DEMO` o en pantallas (RN-12, REL).
- **Soportado por ProCoop**: existe en binarios [B]; uso en LAG no confirmado.
- **Confirmado no usado en LAG**: credenciales vacías o tabla vacía (RN-12 §3).
- **Nuevo**: no existe en ProCoop; lo pide la BASE/CNX o el mercado.
- **Reemplazado / Descartado**: no se replica; se indica por qué.

Todas las fichas heredan el marco común (secciones 5–9): bóveda, modo prueba/producción, cola con reintentos, idempotencia, circuito, bitácora saneada, conciliación y alertas. Solo se anotan las particularidades.

### 12.4 Fiscal nacional — ARCA

#### FI-INT-01 — ARCA WSAA (autenticación de servicios web)

| Campo | Detalle |
|---|---|
| Propósito | Obtener el Ticket de Acceso (token + sign) para cada servicio web de ARCA usado por el tenant. |
| Módulo dueño | T06 (transversal); consumidores M05, M06, M01, M12, M16. |
| Dirección | Saliente con respuesta inmediata. |
| Protocolo / formato | SOAP `loginCms`; `loginTicketRequest` XML firmado CMS/PKCS#7 con el certificado X.509 del tenant; respuesta XML con `token`, `sign`, `expirationTime` (vigencia 12 h). Servicios: `wsfe`, `wsfex`, `ws_sr_padron_a13`, `ws_sr_constancia_inscripcion`, `ws_sr_padron_a4`, `wscdc`, `wsfecred` (los habilitados en la conexión). |
| Datos intercambiados | CUIT (en el certificado), servicio, `uniqueId`, ventana de generación/expiración. No hay datos de socios. |
| Frecuencia | Bajo demanda, cacheado hasta vencer (RF-INT-022); renovación anticipada (JOB-INT-11). |
| Credenciales | `arcaCertificate` (certificado + `privateKey` en bóveda); configuración: `cuit`, `cuitRepresentado`, `alias`, `services[]`. Una conexión por persona jurídica del tenant (`legalEntityId`, DEC-064): el TA se pide y cachea por entidad y servicio. |
| Errores y contingencia | "Certificado expirado"/no autorizado ⇒ conexión `blocked_credential`, pausa de colas fiscales, alerta crítica (RF-INT-027). `ya posee un TA válido` ⇒ reutilizar el cacheado (lock evita pedir otro). Indisponibilidad de WSAA ⇒ circuito; con TA vigente se sigue operando; sin TA ⇒ contingencia CAEA (FI-INT-03). |
| Ola / Prioridad | O4 / Núcleo. |
| Estado investigación | Confirmado en LAG (FE en uso; 727 = espera CAE en caja; 2712 = 5000 por lote). |
| Origen | FIC 2.1; RN-03 §2 (2071, 2072, 2073, 2925; caché `TA<servicio>.xml`; CUIT "segunda relación"; timeout; TLS 1.2); RN-10 §8; BASE §97.2. |
| Preguntas | PA-INT-03 (custodia del certificado). Pedir a la cooperativa piloto: quién custodia el certificado actual y su vencimiento (FIC 2.1 pendiente). |

#### FI-INT-02 — ARCA WSFEv1: autorización CAE

| Campo | Detalle |
|---|---|
| Propósito | Autorizar comprobantes electrónicos (A, B, C, M, liquidaciones de servicios públicos, NC/ND, FCE con WSFEv1) comprobante por comprobante o en lotes. |
| Módulo dueño | M06 FIS (contenido fiscal) y M05 FAC (emisión); T06 transporta. |
| Dirección | Saliente con respuesta inmediata. |
| Protocolo / formato | SOAP WSFEv1. Operaciones: `FECAESolicitar`, `FECompUltimoAutorizado`, `FECompConsultar`, `FECompTotXRequest` (tope por request), `FEDummy` (salud), `FEParamGetTiposCbte`, `FEParamGetTiposIva`, `FEParamGetTiposTributos`, `FEParamGetTiposMonedas`, `FEParamGetTiposDoc`, `FEParamGetTiposConcepto`, `FEParamGetPtosVenta`, `FEParamGetCondicionIvaReceptor`, `FEParamGetActividades`, `FEParamGetCotizacion`. |
| Datos intercambiados | Por comprobante: tipo, punto de venta, número, fecha, concepto, fechas de servicio desde/hasta y vencimiento de pago, documento y condición IVA del receptor, importes (total, neto, no gravado, exento, IVA por alícuota, tributos con base y alícuota), moneda y cotización, comprobantes asociados, opcionales, compradores y actividades cuando corresponda. Respuesta: resultado A/R/P, CAE, vencimiento CAE, observaciones y errores. |
| Frecuencia | En cada emisión individual (caja, ventas, NC) y en lotes masivos (≈ 12.500 comprobantes/mes en LAG; hasta 5.000 por lote por parámetro 2712). |
| Credenciales | TA de FI-INT-01. |
| Errores y contingencia | Antes de cada lote y ante resultado incierto: `FECompUltimoAutorizado` + `FECompConsultar` para no duplicar ni saltear numeración (RF-INT-038). Rechazo (`R`) con observaciones ⇒ documento `rejected` con motivo de ARCA (no reintento automático). Error 10016 de correlatividad ⇒ reconciliación de numeración. Caída de ARCA ⇒ circuito y contingencia CAEA (FI-INT-03) si el tenant la tiene habilitada; si no, el lote queda `pending` sin marcar emitido (BASE §97.2, §10 caso crítico; AGR-015). Punto de venta pausado ⇒ `blocked`. |
| Ola / Prioridad | O4 / Núcleo. |
| Estado investigación | Confirmado en LAG (puntos de venta vistos 0022, 0028, 0097; alerta "Hay facturas electrónicas pendientes de autorizar!"). |
| Origen | FIC 2.1; RN-03 §2–§3 (cola de pendientes, `PTOVENTA.PAUSAR`, métodos no usados); CAT `ELECTRONICA_FC/IVA/TRIB/RELCOMP`; BASE §10, §97.2; RN-12 §4 (727, 2712, 2515). |
| Preguntas | PA-INT-04 (CAE vs. CAEA en masiva). Pedir a la cooperativa piloto: puntos de venta habilitados por servicio y modalidad. |

#### FI-INT-03 — ARCA WSFEv1: CAEA y CESP

| Campo | Detalle |
|---|---|
| Propósito | Obtener el Código de Autorización Anticipado por quincena para emisión masiva o contingencia, e informarlo después; registrar los CESP de liquidaciones de servicios públicos que ProCoop guarda junto con los CAEA. |
| Módulo dueño | M06 FIS; M05 los asigna al emitir. |
| Dirección | Saliente. |
| Protocolo / formato | SOAP WSFEv1: `FECAEASolicitar`, `FECAEAConsultar`, `FECAEARegInformativo`, `FECAEASinMovimientoInformar`, `FECAEASinMovimientoConsultar`. |
| Datos intercambiados | Período `yyyyMM` y orden (1ª/2ª quincena); CAEA, vigencia y fecha tope de informe; luego el detalle de cada comprobante emitido con ese CAEA (mismo contenido que CAE) en tandas; puntos de venta sin movimiento. |
| Frecuencia | Solicitud anticipada por quincena (JOB programado por conexión); informe dentro del plazo normativo posterior a la quincena; sin movimiento al cierre. |
| Credenciales | TA de FI-INT-01. |
| Errores y contingencia | Informe rechazado por comprobante ⇒ corrección y reinforme (bandeja); vencimiento del plazo de informe ⇒ alerta crítica escalonada. El CAEA es en sí el mecanismo de contingencia de FI-INT-02. |
| Ola / Prioridad | O4 / Núcleo (si el tenant usa CAEA) — Estándar en otro caso. |
| Estado investigación | Soportado por ProCoop (informe en tandas de 100; "sin movimiento" no implementado). Uso en LAG a confirmar. CESP: tabla `CESPAFIP` mezcla CESP y CAEA (CTR-INT-19). |
| Origen | FIC 2.1; RN-03 §4 (`ConsultarCAEA`, `InformarCAEA`, superposición de rangos no detectada, `TP_CODIGO`, QR tipo "A"); CAT `CESPAFIP`; BASE §97.2. |
| Preguntas | PA-INT-04. [VERIFICAR] plazos vigentes de solicitud e informe de CAEA y vigencia de CESP según normativa ARCA actual. |

#### FI-INT-04 — ARCA WSFEX (factura de exportación)

| Campo | Detalle |
|---|---|
| Propósito | Autorizar comprobantes clase E si la cooperativa exporta bienes o servicios. |
| Módulo dueño | M06/M11. |
| Dirección | Saliente. |
| Protocolo / formato | SOAP WSFEX (`FEXAuthorize`, `FEXGetLast_CMP`, `FEXGetCMP`, `FEXGetPARAM_*`). |
| Datos intercambiados | Comprobante E con destino, incoterms, moneda, cotización, permisos de embarque, ítems. |
| Frecuencia | Por emisión. |
| Credenciales | TA de FI-INT-01 (servicio `wsfex`). |
| Errores y contingencia | Igual patrón que FI-INT-02 (último autorizado antes de reintentar). Sin CAEA. |
| Ola / Prioridad | O8 / Extensión. |
| Estado investigación | Nuevo (no existe en ProCoop). |
| Origen | Pedido de la tarea (WSFE/WSFEX); DEC-007 no lo exige. |
| Preguntas | Confirmar si alguna cooperativa del mercado objetivo exporta; si no, queda solo en catálogo. |

#### FI-INT-05 — ARCA Factura de Crédito Electrónica MiPyME (WSFECRED)

| Campo | Detalle |
|---|---|
| Propósito | Gestionar el ciclo de la FCE MiPyME (aceptación, rechazo, cancelación, consulta de cuenta corriente FCE) cuando el receptor es gran empresa y el importe supera el mínimo. |
| Módulo dueño | M06 (emisión FCE vía WSFEv1) y M07/M12 (aceptación/rechazo y cobranza). |
| Dirección | Bidireccional (consulta de estados y acciones). |
| Protocolo / formato | SOAP `wsfecred` (consulta de comprobantes, aceptar/rechazar, informar cancelación, consultar obligado). |
| Datos intercambiados | CUIT emisor/receptor, comprobante, estado FCE, CBU informado, fechas de vencimiento y aceptación. |
| Frecuencia | Por emisión FCE y consulta diaria de estados. |
| Credenciales | TA de FI-INT-01 (servicio `wsfecred`). |
| Errores y contingencia | Estado no obtenido ⇒ reintento; vencimiento de aceptación tácita controlado por M07. |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado parcialmente por ProCoop (parámetro 2515: importe desde el cual se emite FCE, valor configurado en LAG); no se halló cliente `wsfecred` en el código. |
| Origen | RN-12 §4 (2515); BASE §61, §97.2. |
| Preguntas | [VERIFICAR] si LAG emite FCE a grandes empresas y cómo gestiona aceptación/rechazo hoy. |

#### FI-INT-06 — ARCA Padrón A13

| Campo | Detalle |
|---|---|
| Propósito | Obtener datos de persona por CUIT/CUIL y la lista de CUIT asociados a un DNI. |
| Módulo dueño | M01 PER (alta/modificación de personas), M12 CMP (proveedores). |
| Dirección | Saliente (consulta). |
| Protocolo / formato | SOAP `ws_sr_padron_a13`: `getPersona`, `getIdPersonaListByDocumento`. |
| Datos intercambiados | Envío: CUIT o DNI. Recepción: apellido, nombre, razón social, domicilios, actividad principal, forma jurídica, estado de la clave. |
| Frecuencia | A demanda en altas/modificaciones; revalidación masiva opcional (JOB-INT-25). |
| Credenciales | TA de FI-INT-01 (servicio `ws_sr_padron_a13`). |
| Errores y contingencia | Sin respuesta ⇒ el formulario se guarda con "pendiente de validar fiscalmente" y se reintenta en segundo plano; nunca bloquea el alta (BASE §77 analogía de caídas). |
| Ola / Prioridad | O4 / Núcleo (en O2 la persona puede darse de alta sin padrón). |
| Estado investigación | Soportado por ProCoop (proxy existe pero sin llamadas encontradas). |
| Origen | FIC 2.2; RN-03 §5; CTR-INT-05. |
| Preguntas | — |

#### FI-INT-07 — ARCA Padrón A5 (constancia de inscripción)

| Campo | Detalle |
|---|---|
| Propósito | Obtener la condición frente al IVA, Ganancias y monotributo (constancia de inscripción) para determinar el comprobante y percepciones correctas. |
| Módulo dueño | M01, M06, M12. |
| Dirección | Saliente (consulta). |
| Protocolo / formato | SOAP `ws_sr_constancia_inscripcion` (`getPersona_v2`, `dummy`). |
| Datos intercambiados | CUIT ⇒ datos generales, régimen general (impuestos inscriptos), monotributo (categoría), errores de constancia. |
| Frecuencia | A demanda y revalidación mensual opcional. |
| Credenciales | TA de FI-INT-01 (servicio `ws_sr_constancia_inscripcion`). |
| Errores y contingencia | "Error constancia" (datos inconsistentes) se muestra como observación sin bloquear; fallback al padrón offline (FI-INT-10). |
| Ola / Prioridad | O4 / Núcleo. |
| Estado investigación | Nuevo (no existe en ProCoop, RN-03 §5). |
| Origen | RN-03 §5; pedido de la tarea (A4/A5/A13). |
| Preguntas | — |

#### FI-INT-08 — ARCA Padrón A4

| Campo | Detalle |
|---|---|
| Propósito | Consulta de persona de alcance 4 (datos de inscripción), como alternativa al A5/A13 si el tenant ya la tiene autorizada. |
| Módulo dueño | M01, M12. |
| Dirección | Saliente. |
| Protocolo / formato | SOAP `ws_sr_padron_a4` (`getPersona`). |
| Datos intercambiados | CUIT ⇒ datos de persona, impuestos, actividades. |
| Frecuencia | A demanda. |
| Credenciales | TA de FI-INT-01 (servicio `ws_sr_padron_a4`). |
| Errores y contingencia | Como FI-INT-06. |
| Ola / Prioridad | O4 / Extensión. |
| Estado investigación | Nuevo. [VERIFICAR] vigencia del servicio A4 en ARCA; si está discontinuado se descarta. |
| Origen | Pedido de la tarea. |
| Preguntas | — |

#### FI-INT-09 — ARCA Padrón PUC nivel 3 (WSPN3) — legado

| Campo | Detalle |
|---|---|
| Propósito | Validación del CUIT en el ABM de personas de ProCoop. |
| Módulo dueño | M01. |
| Dirección | Saliente. |
| Protocolo / formato | SOAP `padron-puc-ws` (`get(cuit, token, sign)`), devuelve un texto. |
| Datos intercambiados | CUIT ⇒ cadena de datos del contribuyente. |
| Frecuencia | A demanda. |
| Credenciales | TA (servicio `WSPN3`). |
| Errores y contingencia | — |
| Ola / Prioridad | — / Reemplazado por FI-INT-06 y FI-INT-07. |
| Estado investigación | Soportado por ProCoop (único padrón efectivamente invocado). |
| Origen | RN-03 §5; FIC 2.2. |
| Preguntas | — |

#### FI-INT-10 — Padrón offline de condición tributaria (archivo ARCA)

| Campo | Detalle |
|---|---|
| Propósito | Cruzar masivamente la condición IVA/monotributo de titulares y proveedores con el archivo público de ARCA. |
| Módulo dueño | M06 (tabla de condición), M01/M12 (cruces). |
| Dirección | Entrante. |
| Protocolo / formato | Archivo de ancho fijo: CUIT (11), razón social (30), IVA en posiciones 44–45, monotributo en 46–47; layout `arca.condicionTributaria`; conversión `NI/MT/EX/NA/AC`. |
| Datos intercambiados | CUIT, denominación, condición IVA, monotributo. |
| Frecuencia | Mensual o a demanda (JOB-INT-26). |
| Credenciales | Ninguna (archivo público); SFTP/descarga manual. |
| Errores y contingencia | Archivo con formato distinto ⇒ `failed` con detalle; se conserva la versión anterior. |
| Ola / Prioridad | O4 / Estándar. |
| Estado investigación | Soportado por ProCoop (`EMPAFIP`, `clsImportacionArchivos`, control de proveedores parámetro 218). |
| Origen | RN-03 §5; CAT `EMPAFIP`; RN-10 §16.6. |
| Preguntas | — |

#### FI-INT-11 — ARCA Constatación de comprobantes (WSCDC)

| Campo | Detalle |
|---|---|
| Propósito | Verificar que las facturas de proveedores recibidas tienen CAE/CAEA válido antes de registrarlas o pagarlas. |
| Módulo dueño | M12 CMP. |
| Dirección | Saliente. |
| Protocolo / formato | SOAP `wscdc` (`ComprobanteConstatar`, `ComprobantesModalidadConsultar`, `ComprobantesTipoConsultar`). |
| Datos intercambiados | CUIT emisor, tipo, punto de venta, número, fecha, importe, código de autorización, documento del receptor. |
| Frecuencia | Por factura de compra (al cargarla o por lectura IA). |
| Credenciales | TA de FI-INT-01 (servicio `wscdc`). |
| Errores y contingencia | No constatado ⇒ marca "pendiente de constatar"; no bloquea la carga pero sí el pago si el tenant lo configura. |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Nuevo. |
| Origen | Pedido de la tarea (constatación); BASE §19. |
| Preguntas | — |

#### FI-INT-12 — ARCA Mis Comprobantes (importación)

| Campo | Detalle |
|---|---|
| Propósito | Cargar comprobantes recibidos/emitidos registrados en ARCA y cruzarlos con los libros de IVA. |
| Módulo dueño | M12 (compras) y M15/M06 (libros IVA). |
| Dirección | Entrante. |
| Protocolo / formato | CSV/Excel descargado de ARCA (layouts `arca.misComprobantes.recibidos` / `.emitidos`) mediante ExcelImportWizard. |
| Datos intercambiados | Fecha, tipo, punto de venta, número, CUIT contraparte, denominación, importes por alícuota, total, CAE. |
| Frecuencia | Mensual. |
| Credenciales | Ninguna (carga manual). |
| Errores y contingencia | Duplicados por clave del comprobante; diferencias a informe "comprobantes no registrados". |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop (`clsLibroIVAdigital.Importar_ComprobantesAfip`, `Comparar_LibroCompras/Venta`, `Get_Informe_ComprobantesNoProcoop`). |
| Origen | FIC 2.4. |
| Preguntas | [VERIFICAR] si ARCA ofrece hoy un servicio web habilitable para descarga automática; si existe, se agrega como capacidad. |

#### FI-INT-13 — Libro IVA Digital, CITI (RG 3685) y otros regímenes informativos

| Campo | Detalle |
|---|---|
| Propósito | Generar los archivos de los regímenes informativos que se presentan en el sitio de ARCA. |
| Módulo dueño | M06 (contenido) / M15. |
| Dirección | Saliente. |
| Protocolo / formato | TXT de ancho fijo por layout versionado: `arca.lid.ventas`, `arca.lid.ventasAlicuotas`, `arca.lid.compras`, `arca.lid.comprasAlicuotas` (RG 3685 / Libro IVA Digital, cabecera e ítems), `arca.rg1361`, `arca.rg3349`, `arca.rg3571`, `arca.cir7021`. Presentación humana en el sitio de ARCA (no hay servicio web). |
| Datos intercambiados | Comprobantes de ventas y compras con importes por alícuota, percepciones, datos de contraparte. |
| Frecuencia | Mensual según vencimiento de cada régimen. |
| Credenciales | Ninguna. |
| Errores y contingencia | Validación previa (totales, alícuotas, formato); estados generado ≠ presentado ≠ aceptado (RF-INT-064); acuse de presentación cargado como archivo. Durante el paralelo se pueden seguir generando desde ProCoop. |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop (`Facturacion.Archivos`: `RG3685`, `RG3685_ITEMS`, `RG1361`, `RG3349`, `RG3571`, `CIR7021`). Qué presenta la cooperativa piloto: a confirmar. |
| Origen | FIC 2.3; RN-10 §8; BASE §61. |
| Preguntas | Pedido 5 de FIC 23 (regímenes que presenta LAG). |

#### FI-INT-14 — SICORE (retenciones y percepciones)

| Campo | Detalle |
|---|---|
| Propósito | Exportar retenciones y percepciones practicadas (ventas, proveedores y sueldos) para su declaración. |
| Módulo dueño | M06 (régimen de agente de retención/percepción, BASE §61); M12/M16 originan. |
| Dirección | Saliente. |
| Protocolo / formato | TXT de importación SICORE por layout `arca.sicore.*`. |
| Datos intercambiados | Comprobante origen, fecha, código de impuesto y régimen, base, alícuota, importe, CUIT del sujeto, certificado. |
| Frecuencia | Mensual/quincenal según régimen. |
| Credenciales | Ninguna. |
| Errores y contingencia | Igual que FI-INT-13; rectificativas como nueva versión vinculada. |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop (`PercepcionSICORE`, `Exportar_Sueldos`). |
| Origen | FIC 2.3, 12; BASE §61 (SIRE/SICORE: no asumir que uno reemplaza al otro). |
| Preguntas | — |

#### FI-INT-15 — SIRE (F2004 / F2005) y seguridad social

| Campo | Detalle |
|---|---|
| Propósito | Declarar retenciones del Sistema Integral de Retenciones Electrónicas (regímenes migrados a SIRE) y exportar retenciones de seguridad social. |
| Módulo dueño | M06. |
| Dirección | Saliente. |
| Protocolo / formato | Archivo de importación SIRE (layouts `arca.sire.f2004`, `arca.sire.f2005`); `RetencionesMunicipales.Exportar_SeguridadSocialArca`. |
| Datos intercambiados | Retenciones, certificados, sujetos retenidos. |
| Frecuencia | Según vencimiento. |
| Credenciales | Ninguna por archivo. Si ARCA habilita servicio web para SIRE, credencial = TA. |
| Errores y contingencia | Como FI-INT-13. |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop (`clsSIRE`). [VERIFICAR] disponibilidad de servicio web oficial de SIRE y regímenes alcanzados. |
| Origen | FIC 2.3; BASE §61 [FIS-F2, FIS-F3]. |
| Preguntas | — |

#### FI-INT-16 — Libro de Sueldos Digital, SICOSS / F.931 y F.572

| Campo | Detalle |
|---|---|
| Propósito | Presentar la liquidación de sueldos a ARCA (LSD, registros 1 a 5), importar tablas SICOSS y recibir el formulario 572 (SIRADIG) de Ganancias. |
| Módulo dueño | M16 SUE. |
| Dirección | Saliente (LSD, F.931) y entrante (tablas SICOSS, F.572 XML). |
| Protocolo / formato | TXT LSD por layout; base Access de SICOSS (lectura MDB en importación controlada); XML de SIRADIG. |
| Datos intercambiados | Legajos, conceptos, remuneraciones, aportes y contribuciones; tablas de obras sociales, condición, modalidad, actividades, situación de revista. |
| Frecuencia | Mensual; SICOSS al cambiar versión. |
| Credenciales | Ninguna por archivo. |
| Errores y contingencia | Validación de vigencia de tablas con mes de dos dígitos (corrige el bug "20263", RN-10 §16.6); "archivo ya importado" por hash. |
| Ola / Prioridad | O9 / Estándar. |
| Estado investigación | Soportado por ProCoop (`LibroSueldoDigital`, `Importar_Sicoss`, `ImportarSicossDb`, `clsGanancias`); LSD deshabilitado en la DEMO; si LAG liquida en ProCoop: a confirmar. |
| Origen | FIC 12; RN-10 §16.6; BASE §104. |
| Preguntas | Pedido 9 de FIC 23. |

#### FI-INT-17 — Cotización de monedas

| Campo | Detalle |
|---|---|
| Propósito | Obtener la cotización oficial para comprobantes y valuaciones en moneda extranjera. |
| Módulo dueño | T04 (tabla de cotizaciones) / M06. |
| Dirección | Saliente. |
| Protocolo / formato | `FEParamGetCotizacion` de WSFEv1; alternativa: API pública del BCRA (tipo de cambio de referencia) [VERIFICAR] condiciones de uso. |
| Datos intercambiados | Moneda ⇒ cotización y fecha. |
| Frecuencia | Diaria y a demanda al emitir en moneda extranjera. |
| Credenciales | TA (WSFE). |
| Errores y contingencia | Sin cotización ⇒ carga manual auditada. |
| Ola / Prioridad | O8 / Extensión. |
| Estado investigación | Soportado por ProCoop (`clsTipMon.GetCotizacion`; el método del proxy ARCA no se usa). |
| Origen | FIC 11.3; RN-03 §3 (métodos no usados). |
| Preguntas | — |

### 12.5 Fiscal provincial y municipal

#### FI-INT-18 — Rentas Córdoba: padrón de Ingresos Brutos ("LUA")

| Campo | Detalle |
|---|---|
| Propósito | Importar el padrón provincial con alícuotas/condición de IIBB por CUIT y régimen con vigencia, para calcular percepciones en la factura. |
| Módulo dueño | M06 FIS. |
| Dirección | Entrante. |
| Protocolo / formato | Archivo publicado por la Dirección General de Rentas de Córdoba; layout `cba.iibb.padron` (régimen, fecha de publicación, vigencia desde/hasta, CUIT, tipo, alícuota). |
| Datos intercambiados | CUIT, régimen, alícuota, vigencia. |
| Frecuencia | Mensual (al publicarse) y antes de cada facturación (JOB-INT-26). |
| Credenciales | Usuario/clave del portal de Rentas si la descarga es autenticada (`rentasCbaUser`, `rentasCbaPassword`); en general descarga manual. |
| Errores y contingencia | Padrón no publicado/recibido ⇒ alerta `file_not_received` y se usa el vigente anterior hasta su fecha de fin; el lote de facturación muestra advertencia (sin padrón las facturas no coinciden en el paralelo). |
| Ola / Prioridad | O4 / Núcleo. |
| Estado investigación | Soportado por ProCoop (`IIBB_LUA`, `GetCondicionIIBB_LUA`, `ValidarLUA`); uso en LAG probable. Significado exacto de "LUA" sin confirmar. |
| Origen | FIC 3.1; CAT `IIBB_LUA`; DFA M29. |
| Preguntas | Pedido 5 de FIC 23; [VERIFICAR] qué es LUA y formato del padrón vigente. |

#### FI-INT-19 — Rentas Córdoba: Código de Validación Provincial (CVP)

| Campo | Detalle |
|---|---|
| Propósito | Registrar y aplicar el CVP por punto de venta y período, con leyenda impresa en el comprobante. |
| Módulo dueño | M06 / M05 (impresión). |
| Dirección | Entrante (código otorgado por el organismo; carga manual o archivo). |
| Protocolo / formato | Alta manual con vigencia; si el organismo expone servicio, conector. |
| Datos intercambiados | Punto de venta, comprobante, período, CVP, leyenda. |
| Frecuencia | Por período. |
| Credenciales | — |
| Errores y contingencia | CVP vencido ⇒ alerta antes del ciclo de emisión. |
| Ola / Prioridad | O4 / Núcleo (si la cooperativa piloto lo imprime). |
| Estado investigación | Soportado por ProCoop (`CVPIIBB`, `Get_CVP`). |
| Origen | FIC 3.1; BASE §97.2; CAT `CVPIIBB`. |
| Preguntas | [VERIFICAR] si el CVP se imprime en la factura de la cooperativa piloto y cómo se obtiene. |

#### FI-INT-20 — SIRCAR (Convenio Multilateral)

| Campo | Detalle |
|---|---|
| Propósito | Declarar percepciones y retenciones de IIBB como agente de recaudación en las jurisdicciones adheridas. |
| Módulo dueño | M06. |
| Dirección | Saliente. |
| Protocolo / formato | Archivos de importación SIRCAR (`sircar.percepciones`, `sircar.retenciones`); presentación en el aplicativo web de la Comisión Arbitral. |
| Datos intercambiados | Jurisdicción, CUIT, comprobante, base, alícuota, importe. |
| Frecuencia | Mensual/quincenal. |
| Credenciales | Ninguna por archivo. |
| Errores y contingencia | Igual a FI-INT-13. |
| Ola / Prioridad | O8 / Estándar (O4 si la percepción en factura requiere declaración inmediata; el cálculo está en O4). |
| Estado investigación | Soportado por ProCoop (`SIRCAR.Exportar_ArchivoPercepciones/Retenciones`). |
| Origen | FIC 3.1; BASE §61 [FIS-F4]. |
| Preguntas | — |

#### FI-INT-21 — ARBA (Buenos Aires)

| Campo | Detalle |
|---|---|
| Propósito | Padrón de alícuotas de percepción/retención por sujeto y DDJJ de agente para cooperativas bonaerenses. |
| Módulo dueño | M06. |
| Dirección | Entrante (padrón) y saliente (DDJJ). |
| Protocolo / formato | Padrón por archivo (`arba.padron`); DDJJ por archivo (`arba.iibb`); consulta de alícuota por servicio web si el tenant lo habilita [VERIFICAR]. |
| Datos intercambiados | CUIT, alícuotas, vigencias; percepciones/retenciones practicadas. |
| Frecuencia | Mensual. |
| Credenciales | `arbaUser`, `arbaPassword` (CIT) si se usa servicio web. |
| Errores y contingencia | Como FI-INT-18. |
| Ola / Prioridad | O8 / Extensión (C en la base relevada LAG). |
| Estado investigación | Soportado por ProCoop (`ImportarIIBB_BsAs`, `Exportar_IngresosBrutosArba`; `CATE_SER_EXTRAS.TIPO_PRESENTACION_ARBA`). |
| Origen | FIC 3.2; CAT. |
| Preguntas | PA-INT-24. |

#### FI-INT-22 — Otras jurisdicciones (Santa Fe, La Pampa, Río Negro y demás)

| Campo | Detalle |
|---|---|
| Propósito | Padrones y DDJJ de IIBB de cada provincia, como **configuración por jurisdicción** del motor de padrones y percepciones. |
| Módulo dueño | M06. |
| Dirección | Entrante y saliente. |
| Protocolo / formato | Layouts por jurisdicción: `rn.iibb.padron` (Río Negro 01/2017), `lpampa.iibb`, `sfe.iibb`, y los que se agreguen. |
| Datos intercambiados | Igual a FI-INT-18/20. |
| Frecuencia | Mensual. |
| Credenciales | Según organismo. |
| Errores y contingencia | Igual a FI-INT-18. |
| Ola / Prioridad | O8 / Extensión. |
| Estado investigación | Soportado por ProCoop (`ImportarIIBB_RN_012017`, `Exportar_IngresosBrutosLaPampa`, `Exportar_IngresosBrutosSantaFe`, `Get_RetencionesIIBB_RioNegro`). |
| Origen | FIC 3.2 ("cada jurisdicción una configuración y no un desarrollo"). |
| Preguntas | PA-INT-24. |

#### FI-INT-23 — Retenciones y tasas municipales

| Campo | Detalle |
|---|---|
| Propósito | Exportar retenciones municipales practicadas a proveedores y declaraciones de tasas municipales cuando la cooperativa es agente. |
| Módulo dueño | M06. |
| Dirección | Saliente. |
| Protocolo / formato | Archivo/planilla por municipio (layout por tenant). |
| Datos intercambiados | Retenciones por proveedor y período. |
| Frecuencia | Mensual. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ presentado. |
| Ola / Prioridad | O8 / Extensión. |
| Estado investigación | Soportado por ProCoop (`RetencionesMunicipales`). |
| Origen | FIC 2.3; BASE §61. |
| Preguntas | — |

### 12.6 Reguladores, subsidios y terceros

#### FI-INT-24 — Subsidios y segmentación (RASE, Resolución SE 493/25, gas SEF, Zona Fría)

| Campo | Detalle |
|---|---|
| Propósito | Importar los padrones de beneficiarios o segmentos de subsidio por suministro, aplicarlos a la facturación y exportar lo que pidan los organismos. |
| Módulo dueño | M06 FIS (padrones de terceros) / M04 TAR (reglas de subsidio) / M05 (aplicación); M01 (marca de beneficio). |
| Dirección | Entrante (padrones) y saliente (informes, si corresponde). |
| Protocolo / formato | Archivos (layouts `se.rase.padron`, `se.493-25`, `gas.sef`, `zonaFria`) con reglas de cruce por NIS/CUIT/DNI/medidor; tablas `ResolucionesSE_SubsidioEnergia`, `Resolucion493_25Detalle`. |
| Datos intercambiados | Identificación del suministro/titular, segmento (N1/N2/N3 o equivalente), vigencia, tope de consumo subsidiado. |
| Frecuencia | Al publicarse cada padrón (mensual o eventual). |
| Credenciales | Acceso al portal del organismo, si corresponde (`seUser`, `sePassword`). |
| Errores y contingencia | Registros no cruzados ⇒ bandeja de excepciones; lote de facturación con advertencia si el padrón del período falta. |
| Ola / Prioridad | O7 / Núcleo (servicios medidos: electricidad y gas). |
| Estado investigación | Soportado por ProCoop (`ImportarExcelResol493_25`, `ImportarPadronSubsidioGasSEF`); uso en LAG a confirmar. |
| Origen | FIC 7; BASE §50 (subsidios), §61; CAT. |
| Preguntas | [VERIFICAR] normativa vigente de segmentación (Resolución SE 493/25 y padrones activos al momento del piloto). |

#### FI-INT-25 — ERSeP (Córdoba)

| Campo | Detalle |
|---|---|
| Propósito | Informes regulatorios periódicos al Ente Regulador de los Servicios Públicos de Córdoba, padrón de tarifa social y reglas regulatorias (DNU 311). |
| Módulo dueño | M06 FIS (reguladores); datos de M04/M05; reportes con el motor de T10. |
| Dirección | Saliente (informes) y entrante (padrones de tarifa social). |
| Protocolo / formato | Archivos/planillas por layout `ersep.*` (resoluciones 166, 296, 617 y otras); no hay servicio web conocido. |
| Datos intercambiados | Usuarios por categoría, consumos y facturación agregados, beneficiarios de tarifa social, calidad de servicio. |
| Frecuencia | Mensual/según resolución. |
| Credenciales | Acceso al portal del ente, si existe. |
| Errores y contingencia | Generado ≠ presentado; plantillas versionadas por resolución. |
| Ola / Prioridad | O7 / Estándar. |
| Estado investigación | Soportado por ProCoop (`clsERSeP`, `ERSEP_166`, `TarifaSocial_ERSeP`, reglas DNU 311). |
| Origen | FIC 8.1; RN-13; BASE §61. |
| Preguntas | Pedido 11 de FIC 23 (qué informes presenta LAG y con qué formato). |

#### FI-INT-26 — ENARGAS

| Campo | Detalle |
|---|---|
| Propósito | Informes al regulador del gas (usuarios, consumos, reclamos) cuando la cooperativa distribuye gas. |
| Módulo dueño | M06 FIS (reguladores); reportes con el motor de T10. |
| Dirección | Saliente. |
| Protocolo / formato | Archivos/planillas por layout `enargas.*`. |
| Datos intercambiados | Agregados de usuarios, consumos, reclamos. |
| Frecuencia | Según exigencia. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ presentado. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop (`ENARGAS_Informes`). Uso en LAG a confirmar. |
| Origen | FIC 8.2. |
| Preguntas | — |

#### FI-INT-27 — ENACOM

| Campo | Detalle |
|---|---|
| Propósito | Informes al regulador de comunicaciones (servicios TIC, internet, TV, telefonía) si la cooperativa presta esos servicios. |
| Módulo dueño | M06 FIS (reguladores); datos de M10 (servicios TIC). |
| Dirección | Saliente. |
| Protocolo / formato | Archivos/planillas `enacom.*`. |
| Datos intercambiados | Abonados por servicio y localidad, velocidades, reclamos. |
| Frecuencia | Según exigencia. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ presentado. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop (`ENACOM_Informes`). |
| Origen | FIC 8.3. |
| Preguntas | — |

#### FI-INT-28 — Secretaría de Energía (CAMMESA y otros informes)

| Campo | Detalle |
|---|---|
| Propósito | Informes energéticos (cuadro de compras/ventas de energía, usuarios por categoría) y recepción de cuadros tarifarios mayoristas. |
| Módulo dueño | M06 FIS (reguladores); reportes con el motor de T10. |
| Dirección | Bidireccional (archivos). |
| Protocolo / formato | Planillas/archivos `se.*`. |
| Datos intercambiados | Energía comprada/vendida, usuarios, tarifas. |
| Frecuencia | Mensual. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ presentado. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop (`SE_Informes`). |
| Origen | FIC 8.4, 7. |
| Preguntas | — |

#### FI-INT-29 — Otros entes provinciales (EPRE, OCEBA y similares)

| Campo | Detalle |
|---|---|
| Propósito | Informes a entes reguladores de otras provincias para cooperativas fuera de Córdoba. |
| Módulo dueño | M06 FIS (reguladores); reportes con el motor de T10. |
| Dirección | Saliente. |
| Protocolo / formato | Plantillas configurables por ente (motor de reportes regulatorios). |
| Datos intercambiados | Según ente. |
| Frecuencia | Según ente. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ presentado. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop (`OCEBA_Informes`). |
| Origen | FIC 8; PA-INT-24. |
| Preguntas | PA-INT-24. |

#### FI-INT-30 — INAES

| Campo | Detalle |
|---|---|
| Propósito | Información institucional de la cooperativa al Instituto Nacional de Asociativismo y Economía Social (padrón de asociados, balances, asambleas). |
| Módulo dueño | M17 INS. |
| Dirección | Saliente. |
| Protocolo / formato | Reportes/planillas exportables; presentación humana. |
| Datos intercambiados | Asociados, capital, asambleas, balances. |
| Frecuencia | Anual / por evento. |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Nuevo (no hay conector en ProCoop; BASE lo menciona en societario). |
| Origen | Guía de anexos (M17 incluye INAES). |
| Preguntas | [VERIFICAR] formato vigente exigido por INAES. |

#### FI-INT-31 — FECESCOR (federación de cooperativas)

| Campo | Detalle |
|---|---|
| Propósito | Intercambio de información con la federación (estadísticas, aportes, servicios compartidos). |
| Módulo dueño | M17 INS. |
| Dirección | Saliente. |
| Protocolo / formato | Archivo/planilla según la federación. |
| Datos intercambiados | Agregados. |
| Frecuencia | Según convenio. |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop (referencias en informes); uso en LAG a confirmar. |
| Origen | FIC 9.1. |
| Preguntas | Confirmar con la cooperativa piloto si hoy envía algo a la federación. |

#### FI-INT-32 — Tasas y cargos de terceros (municipales, bomberos, Banco de Sangre, etc.)

| Campo | Detalle |
|---|---|
| Propósito | Recibir padrones/importes de terceros que se facturan en la boleta del servicio (por cuenta y orden) y rendirles lo cobrado. |
| Módulo dueño | M06 FIS (terceros) / M05 (facturación por cuenta de terceros) / M07 (rendición) / M14 (pago al tercero); M18 para Banco de Sangre y servicios sociales. |
| Dirección | Entrante (padrón/importes) y saliente (rendición). |
| Protocolo / formato | Planillas/archivos por tercero (layout por tenant). |
| Datos intercambiados | Suministro/titular, concepto, importe, período; rendición con cobrado/no cobrado. |
| Frecuencia | Mensual. |
| Credenciales | — |
| Errores y contingencia | Registros no cruzados a bandeja; rendición conciliada antes de pagar. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop (conceptos de terceros; `BancoSangre` en CAT). |
| Origen | FIC 9.2; CAT. |
| Preguntas | Listado de terceros por cuenta y orden en LAG. |

#### FI-INT-33 — EPEC (compra de energía / distribuidora provincial)

| Campo | Detalle |
|---|---|
| Propósito | Importar facturación/lecturas de compra de energía en bloque a la distribuidora provincial y datos para balance de energía. **Precisión (fase 2):** el archivo es la factura mensual del mayorista que M12 registra como comprobante de proveedor `supplierInvoices.wholesaleSupply` (`kind = energy`, RF-CMP-149), controla contra la medición propia de M03 (RF-CMP-150, API-MED-78) y usa en el balance comprado/facturado (RF-CMP-151). `FACT_EPEC` de ProCoop migra a esa misma estructura (T07). |
| Módulo dueño | M12 (RF-CMP-149 a RF-CMP-153) / M03 (medición de frontera y balance energético). |
| Dirección | Entrante. |
| Protocolo / formato | Archivo/planilla del mayorista (layout en `fileLayouts`, COL-INT-10) o carga manual en M12. |
| Datos intercambiados | Puntos de compra o frontera, período, energía activa por banda, reactiva, potencia registrada y contratada, cargos fijos y de transporte, tributos, importes. |
| Frecuencia | Mensual. |
| Credenciales | — |
| Errores y contingencia | Archivo repetido ⇒ sin duplicado (idempotencia de RF-CMP-149); renglón sin punto de medición conocido ⇒ `cmp/supply-point-unknown`. |
| Ola / Prioridad | O8 / Núcleo (servicio ELE; alineado con M12 RF-CMP-149). |
| Estado investigación | Resuelto el significado (CTR-INT-18): factura de compra mayorista, no lectura de clientes. Layout a relevar con el mayorista del tenant. |
| Origen | FIC 9.3; CAT (`FACT_EPEC`); M12 RF-CMP-149. |
| Preguntas | — (CTR-INT-18 resuelta por M12 RF-CMP-149). |

### 12.7 Redes de cobranza extrabancaria

#### FI-INT-34 — Código de barras y línea de pago

| Campo | Detalle |
|---|---|
| Propósito | Generar el código de barras/línea de pago de la factura con el formato que exige cada red, y leerlo en caja. |
| Módulo dueño | M07 COB (formato por convenio) / M05 (impresión). |
| Dirección | Interna (generación) + lectura física. |
| Protocolo / formato | Composición por plantilla versionada por convenio (empresa, cliente, importe, vencimientos, dígito verificador); simbología Interleaved 2 de 5 / Code128; lector de caja como teclado. |
| Datos intercambiados | Identificación de la cuenta/factura, importes y vencimientos. |
| Frecuencia | Por factura. |
| Credenciales | Ninguna; número de convenio por red (no secreto). |
| Errores y contingencia | Dígito verificador inválido ⇒ rechazo en caja; cambio de formato de la red ⇒ nueva versión de plantilla sin tocar las facturas ya emitidas. |
| Ola / Prioridad | O4 / Núcleo. |
| Estado investigación | Confirmado en LAG (SIRO con "0" antepuesto). |
| Origen | FIC 4.3; RN-12 §2; CAT. |
| Preguntas | — |

#### FI-INT-35 — Red Link (LinkPagos)

| Campo | Detalle |
|---|---|
| Propósito | Publicar la deuda en la red Link (home banking y cajeros) y aplicar los pagos rendidos. |
| Módulo dueño | M07. |
| Dirección | Saliente (publicación) y entrante (rendición). |
| Protocolo / formato | Archivo de publicación (`redlink.publicacion`; exportador LAG 159 `E_RedLink_19_10`) y archivo de rendición (`redlink.rendicion`; importador LAG 264 `FAL_RedLink`). Entrega por SFTP o portal del banco (FI-INT-102). |
| Datos intercambiados | Publicación: código de pago electrónico, importe, vencimientos. Rendición: código, fecha de pago, importe, canal. |
| Frecuencia | Publicación tras cada facturación y al modificar deuda; rendición diaria. |
| Credenciales | Usuario SFTP o portal (`redlinkSftpUser`, `redlinkSftpKey`), convenio D67 (no secreto). |
| Errores y contingencia | Rendición duplicada por hash; pago sin factura ⇒ `unmatched` a bandeja; publicación rechazada ⇒ reintento con archivo corregido. Contingencia: carga manual del archivo. |
| Ola / Prioridad | O5 / Núcleo. |
| Estado investigación | Confirmado en LAG. |
| Origen | RN-12 §2; FIC 4.1; RN-10. |
| Preguntas | Formato y canal de entrega actuales (SFTP o carga manual) a confirmar con la cooperativa piloto. |

#### FI-INT-36 — SIRO (Banco Roela) por archivos

| Campo | Detalle |
|---|---|
| Propósito | Publicar deuda en SIRO y aplicar la rendición de cobros de todos sus canales (Rapipago, Pago Fácil, Link, Banelco, tarjetas, débitos). |
| Módulo dueño | M07. |
| Dirección | Saliente y entrante. |
| Protocolo / formato | Publicación (`siro.publicacion`; exportador LAG 140 `E_SIRO`, identificador con "0" antepuesto) y rendición (`siro.rendicion`; importador LAG 271 `Siro_Integrado` con parámetro 2807 = 0). |
| Datos intercambiados | Cliente, comprobante, importes y vencimientos; rendición con canal, fecha, importe, comisión. |
| Frecuencia | Publicación tras facturación; rendición diaria. |
| Credenciales | Acceso al portal/SFTP SIRO (`siroSftpUser`, `siroSftpKey`); convenio 5150071619 (no secreto). |
| Errores y contingencia | Igual que FI-INT-35; si falla la API (FI-INT-37), se cae a archivo. |
| Ola / Prioridad | O5 / Núcleo. |
| Estado investigación | Confirmado en LAG (128.776 solicitudes, todas SIRO; ~70 % prepaga tipo 7; 38 % sin pago). |
| Origen | RN-12 §2–§3; FIC 4.2; CTR-INT-01. |
| Preguntas | PA-INT-11. |

#### FI-INT-37 — SIRO API (botón de pago, QR y consulta)

| Campo | Detalle |
|---|---|
| Propósito | Crear intenciones de pago (botón/QR) en SIRO y consultar el estado y los listados de cobranza en línea. |
| Módulo dueño | M07 / M19. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST JSON con token por sesión (`/Sesion`), creación de pago (`/Pago`), consulta de estado y listados de proceso; webhook/redirección de retorno + reconsulta (RN-INT-002); sin espera fija de 25 s (RN-INT-008). |
| Datos intercambiados | Referencia de operación, importe, concepto, vencimiento; estado y fecha de pago. |
| Frecuencia | Por intención; polling de respaldo JOB-INT-19. |
| Credenciales | `siroApiUser`, `siroApiPassword` (en bóveda; en ProCoop estaban en parámetros 2492–2495 en texto: lección de seguridad). |
| Errores y contingencia | Sin respuesta ⇒ `uncertain` + reconsulta; pago confirmado solo tras consulta (PRM-INT-020). Caída ⇒ ocultar botón en portal y ofrecer cupón (FI-INT-55). |
| Ola / Prioridad | O5 / Núcleo. |
| Estado investigación | Soportado por ProCoop (`clsSiro`); uso de API en LAG a confirmar (las 128.776 solicitudes sugieren uso). |
| Origen | RN-12 §3; FIC 4.2; RN-13 §4; CTR-INT-01. |
| Preguntas | PA-INT-11. |

#### FI-INT-38 — Banelco / Pago Mis Cuentas (PMC)

| Campo | Detalle |
|---|---|
| Propósito | Publicar deuda y recibir la rendición de la red Banelco. |
| Módulo dueño | M07. |
| Dirección | Saliente y entrante. |
| Protocolo / formato | Archivos `pmc.publicacion` / `pmc.rendicion` (directo o vía agregador). |
| Datos intercambiados | Como FI-INT-35. |
| Frecuencia | Como FI-INT-35. |
| Credenciales | `pmcSftpUser`, `pmcSftpKey`. |
| Errores y contingencia | Como FI-INT-35. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop; en LAG llega vía SIRO (no directo). |
| Origen | FIC 4.4; RN-12 §3. |
| Preguntas | — |

#### FI-INT-39 — Rapipago

| Campo | Detalle |
|---|---|
| Propósito | Rendición de cobros en bocas Rapipago (directo, sin agregador). |
| Módulo dueño | M07. |
| Dirección | Entrante (y publicación si el convenio la usa). |
| Protocolo / formato | Archivo `rapipago.rendicion`. |
| Datos intercambiados | Código de barras, fecha, importe. |
| Frecuencia | Diaria. |
| Credenciales | Acceso a portal/SFTP. |
| Errores y contingencia | Como FI-INT-35. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop; en LAG vía SIRO. |
| Origen | FIC 4.4. |
| Preguntas | — |

#### FI-INT-40 — Pago Fácil

| Campo | Detalle |
|---|---|
| Propósito | Rendición de cobros en Pago Fácil. |
| Módulo dueño | M07. |
| Dirección | Entrante. |
| Protocolo / formato | Archivo `pagofacil.rendicion`. |
| Datos intercambiados | Como FI-INT-39. |
| Frecuencia | Diaria. |
| Credenciales | Acceso a portal/SFTP. |
| Errores y contingencia | Como FI-INT-35. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop; en LAG vía SIRO. |
| Origen | FIC 4.4. |
| Preguntas | — |

#### FI-INT-41 — Otros entes recaudadores (Cobro Express, Bapro Pagos, Provincia Pagos y similares)

| Campo | Detalle |
|---|---|
| Propósito | Admitir cualquier otro ente por layout declarativo sin desarrollo. |
| Módulo dueño | M07. |
| Dirección | Entrante/saliente. |
| Protocolo / formato | Layout configurable (`fileLayouts`), PA-INT-12. |
| Datos intercambiados | Como FI-INT-35. |
| Frecuencia | Diaria. |
| Credenciales | Según ente. |
| Errores y contingencia | Como FI-INT-35. |
| Ola / Prioridad | O5 / Extensión. |
| Estado investigación | Soportado por ProCoop (catálogo de importadores/exportadores, decenas de entes). |
| Origen | FIC 4.4; CAT (tablas de interfaces). |
| Preguntas | — |

#### FI-INT-42 — Bancos recaudadores por archivo (Banco de Córdoba, Nación, Galicia y otros)

| Campo | Detalle |
|---|---|
| Propósito | Cobranza en ventanilla o recaudación bancaria con rendición por archivo propio del banco. |
| Módulo dueño | M07. |
| Dirección | Entrante (y publicación si aplica). |
| Protocolo / formato | Layout por banco. |
| Datos intercambiados | Como FI-INT-35. |
| Frecuencia | Diaria. |
| Credenciales | Acceso al canal del banco. |
| Errores y contingencia | Como FI-INT-35. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop (importadores por banco); uso en LAG no confirmado. |
| Origen | FIC 4.4; CAT. |
| Preguntas | — |

### 12.8 Pasarelas de pago y QR

Patrón común de pasarelas (RN-INT-002…011, 033, 053…057): intención con `Idempotency-Key`, link o QR con TTL (PRM-INT-024), reutilizar el link vigente si el importe no cambió (PRM-INT-021), webhook firmado como **disparador** y confirmación **solo por reconsulta** (PRM-INT-020), polling de respaldo (JOB-INT-19) con tope (PRM-INT-023), conciliación diaria contra el reporte de la pasarela (PRM-INT-022), comisiones informadas para M14, devoluciones con aprobación (PA-INT-21). La pasarela nunca imputa: emite `int.payment.confirmed` y M07 aplica.

Datos de tarjeta en todas las pasarelas (DEC-091): el número, el vencimiento y el código de seguridad se capturan solo en el componente del proveedor según `gatewayConnectors.cardDataMode` (`hostedFields`, `redirect` o `terminal`); CoopApps recibe resultado, autorización, marca y últimos 4, y para débito automático el token o identificador de adhesión. Requisitos para habilitar una pasarela con tarjeta: certificación PCI DSS vigente del proveedor (AOC) registrada en la conexión; la página que embebe el componente tiene política de seguridad de contenido restringida al dominio del proveedor, inventario e integridad de scripts y detección de cambios (PCI DSS 4.0, 6.4.3 y 11.6.1); los logs y trazas de la conexión filtran patrones de PAN. Una pasarela que solo acepte PAN por API servidor a servidor no se integra.

#### FI-INT-43 — Pagos360

| Campo | Detalle |
|---|---|
| Propósito | Solicitudes de pago (link/botón), débito automático por adhesión (CBU/tarjeta) y reporte de cobranzas. |
| Módulo dueño | M07 / M19. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST JSON con API key Bearer: `payment-request`, `adhesion`, `debit-request`, `report/collection`, webhooks de estado. |
| Datos intercambiados | Pagador (nombre, email, documento), concepto, importe, vencimientos; adhesión con CBU o con tarjeta capturada en el formulario alojado de la pasarela: CoopApps recibe solo el identificador de la adhesión (`externalId`), marca y últimos 4, y lo guarda como `cardToken` con `cardTokenType` = `gatewayToken` (DEC-091). La adhesión con tarjeta se habilita solo si el ambiente de pruebas confirma que el alta ocurre en el componente de Pagos360; si exige enviar el número desde el servidor, el conector se usa solo para CBU; estados `pending`, `paid`, `expired`, `reverted`. |
| Frecuencia | Por intención; reporte diario. |
| Credenciales | `pagos360ApiKey` (ProCoop la guardaba en parámetros: lección de seguridad). |
| Errores y contingencia | Patrón común. Adhesión en `pending_to_sign` sincronizada por JOB-INT-20. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Confirmado no usado en LAG (credenciales vacías). |
| Origen | RN-12 §3; FIC 5.1; RN-13 §2–§3; CTR-INT-02. |
| Preguntas | PA-INT-13. |

#### FI-INT-44 — Mercado Pago

| Campo | Detalle |
|---|---|
| Propósito | Checkout (preferencias), QR dinámico/estático en caja, link de pago, conciliación y débito automático con tarjeta por suscripción (capacidades `mandate` y `debit`, DEC-091). |
| Módulo dueño | M07 / M19 / M11 (POS). |
| Dirección | Bidireccional. |
| Protocolo / formato | REST JSON OAuth (access token por cuenta del tenant): preferencias, órdenes QR, pagos, reembolsos, suscripciones; notificaciones webhook firmadas (`x-signature`). La tarjeta de la suscripción se tokeniza en el navegador con los campos seguros del SDK de Mercado Pago (`cardDataMode` = `hostedFields`); el servidor de CoopApps recibe solo el token de un uso para crear la suscripción. |
| Datos intercambiados | Ítems/concepto, importe, `external_reference` = operación T06, estado del pago, comisión; en suscripciones, identificador de la suscripción (`externalId` y `cardToken`, `cardTokenType` = `gatewayToken`), marca y últimos 4. |
| Frecuencia | Por intención; conciliación diaria. |
| Credenciales | `mercadoPagoAccessToken`, `mercadoPagoWebhookSecret`; opcional OAuth de marketplace (PA-INT-01). |
| Errores y contingencia | Patrón común; reembolso solo con aprobación. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop; confirmado no usado en LAG. |
| Origen | FIC 5.2; RN-12 §3; RN-13 §5; BASE §54. |
| Preguntas | PA-INT-13. |

#### FI-INT-45 — QR interoperable (Transferencias 3.0)

| Campo | Detalle |
|---|---|
| Propósito | Cobrar con QR interoperable que cualquier billetera puede leer, mediante el adquirente/PSP elegido por el tenant. |
| Módulo dueño | M07 / M11. |
| Dirección | Bidireccional. |
| Protocolo / formato | QR EMVCo generado por el PSP; confirmación por webhook + reconsulta. |
| Datos intercambiados | Importe, referencia, estado. |
| Frecuencia | Por cobro. |
| Credenciales | Según PSP. |
| Errores y contingencia | Patrón común; polling con tope PRM-INT-023 mientras la pantalla de caja espera. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Nuevo (ProCoop usa QR de cada pasarela). |
| Origen | BASE §54; CNX §2.6. |
| Preguntas | — |

#### FI-INT-46 — Macro Click de Pago (PlusPagos)

| Campo | Detalle |
|---|---|
| Propósito | Botón de pago del Banco Macro. |
| Módulo dueño | M07 / M19. |
| Dirección | Bidireccional. |
| Protocolo / formato | Formulario firmado/REST según el producto. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `macroCommerceId`, `macroSecret`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG; nombre de producto a confirmar (CTR-INT-03). |
| Origen | FIC 5.2; RN-13 §6; CTR-INT-03. |
| Preguntas | — |

#### FI-INT-47 — NaranjaX (Ranty)

| Campo | Detalle |
|---|---|
| Propósito | Link/QR de pago NaranjaX. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST con OAuth client credentials. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `naranjaxClientId`, `naranjaxClientSecret`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-13 §7. |
| Preguntas | — |

#### FI-INT-48 — PayFun

| Campo | Detalle |
|---|---|
| Propósito | Pasarela PayFun. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `payfunApiKey`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-10 §6.1. |
| Preguntas | — |

#### FI-INT-49 — Pagos TIC (PayPerTIC)

| Campo | Detalle |
|---|---|
| Propósito | Pasarela Pagos TIC. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `pagosTicApiKey`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-10 §6.1. |
| Preguntas | — |

#### FI-INT-50 — SiPago (Geopagos)

| Campo | Detalle |
|---|---|
| Propósito | Pasarela/adquirencia SiPago. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `sipagoClientId`, `sipagoSecret`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-13 §10. |
| Preguntas | — |

#### FI-INT-51 — Helipagos

| Campo | Detalle |
|---|---|
| Propósito | Pasarela Helipagos. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `helipagosApiKey`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-10 §6.1. |
| Preguntas | — |

#### FI-INT-52 — ProntoPago

| Campo | Detalle |
|---|---|
| Propósito | Pasarela ProntoPago. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST/archivo. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por intención. |
| Credenciales | `prontopagoApiKey`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-13 §13. |
| Preguntas | — |

#### FI-INT-53 — ProvinciaNet QR (Banco Provincia)

| Campo | Detalle |
|---|---|
| Propósito | QR de cobro del Banco Provincia de Buenos Aires. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Patrón común. |
| Frecuencia | Por cobro. |
| Credenciales | `provincianetClientId`, `provincianetSecret`. |
| Errores y contingencia | Patrón común. |
| Ola / Prioridad | Extensión bajo demanda: se adelanta a la ola en que un tenant la pida o la necesite para su corte de migración (T07); sin pedido, O11 (DEC-015; CTR-INT-23). |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 5.2; RN-13 §12. |
| Preguntas | — |

#### FI-INT-54 — DEBIN, "Pagar" y transferencias inmediatas

| Campo | Detalle |
|---|---|
| Propósito | Solicitar débitos inmediatos (DEBIN) a la cuenta del pagador y recibir avisos de transferencias entrantes identificadas (CVU/alias por cuenta). |
| Módulo dueño | M07 / M14 (cuentas recaudadoras). |
| Dirección | Bidireccional. |
| Protocolo / formato | API del banco/PSP habilitado para DEBIN o CVU recaudador; webhooks de acreditación. |
| Datos intercambiados | CUIT/CBU/alias del pagador, importe, referencia; acreditaciones con originante. |
| Frecuencia | Por solicitud; acreditaciones en tiempo real. |
| Credenciales | Según banco/PSP. |
| Errores y contingencia | DEBIN vencido o rechazado ⇒ intención `expired/rejected`; transferencias sin referencia ⇒ `unmatched` y bandeja de imputación por CUIT. |
| Ola / Prioridad | O5 / Extensión. |
| Estado investigación | A validar: "Pagar" figura en la lista de la tarea sin definición en las fuentes ([VERIFICAR] si es "Pagar" de Red Link, botón Pagar de PMC o el producto DEBIN). |
| Origen | Pedido de la tarea; BASE §54. |
| Preguntas | Confirmar qué es "Pagar". |

#### FI-INT-55 — Cupón offline (contingencia de pasarelas)

| Campo | Detalle |
|---|---|
| Propósito | Ofrecer un cupón con código de barras/línea de pago cuando no hay pasarela disponible o el circuito está abierto. |
| Módulo dueño | M07 / M19. |
| Dirección | Interna. |
| Protocolo / formato | PDF con código de FI-INT-34. |
| Datos intercambiados | Deuda, vencimientos, código. |
| Frecuencia | A demanda. |
| Credenciales | — |
| Errores y contingencia | Es la contingencia. |
| Ola / Prioridad | O5 / Núcleo. |
| Estado investigación | Soportado por ProCoop (`Offline`). |
| Origen | FIC 5.2; RN-13 §14. |
| Preguntas | — |

### 12.9 Débito automático

#### FI-INT-56 — Débito directo en cuenta (CBU) por archivo bancario

| Campo | Detalle |
|---|---|
| Propósito | Enviar al banco los débitos de las facturas adheridas y procesar las respuestas (aceptado, rechazado con motivo). |
| Módulo dueño | M07 (lote y aplicación), M01 (adhesión y mandato). |
| Dirección | Saliente (presentación) y entrante (respuesta/rechazos). |
| Protocolo / formato | Layouts por banco/estándar (`debito.cbu.<banco>`), con cabecera, detalle y pie; códigos de rechazo normalizados (tabla por banco). |
| Datos intercambiados | CBU (enmascarado en la UI), CUIT del titular, identificación del adherente, importe, fecha de débito, referencia; respuesta con estado y motivo. |
| Frecuencia | Por ciclo de facturación según calendario de débitos (PRM-INT-040 para tarjetas, equivalente para CBU). |
| Credenciales | Acceso al canal bancario (SFTP/home banking empresa) `bancoDebitoSftpUser`, `bancoDebitoSftpKey`. |
| Errores y contingencia | Rechazo ⇒ factura sigue impaga y se notifica (T09); rechazos repetidos ⇒ propuesta de baja de adhesión (M07). Archivo no entregado antes del corte ⇒ alerta. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop; uso en LAG a confirmar (CTR-INT-21). |
| Origen | FIC 6; CAT; CTR-INT-21. |
| Preguntas | Pedido de FIC 23 sobre débitos activos. |

#### FI-INT-57 — Débito automático con tarjetas (Visa, Mastercard, Cabal, Naranja y otras)

| Campo | Detalle |
|---|---|
| Propósito | Presentar débitos recurrentes a las procesadoras de tarjetas y aplicar la respuesta. |
| Módulo dueño | M07 / M01. |
| Dirección | Saliente y entrante. |
| Protocolo / formato | Archivos por procesadora (`debito.tarjeta.visa`, `.master`, `.cabal`…) **solo con diseños de registro que identifican al adherente por un número asignado por la procesadora**; ese número se guarda como `cardToken` con `cardTokenType` = `processorAdherentId` (M07 COL-COB-30), junto con marca y últimos 4. El PAN nunca entra a CoopApps (DEC-091). |
| Datos intercambiados | Número de establecimiento, identificador del adherente, importe, fecha; respuesta con estado y motivo. |
| Frecuencia | Mensual según día de débito (PRM-INT-040, origen parámetro 2779). |
| Credenciales | Acceso al portal/SFTP de la procesadora. |
| Errores y contingencia | Como FI-INT-56. Si el diseño de registro de una procesadora exige el PAN completo, **no se construye la integración por archivo** para esa procesadora: la adhesión con tarjeta se hace por una pasarela con capacidades `mandate` y `debit` (FI-INT-43 u otra) o directamente en el sistema de la procesadora, que luego informa el número de adherente. Queda descartada la generación del archivo "en memoria a partir de una bóveda": exigiría guardar PAN y llevaría a CoopApps a alcance PCI completo (DEC-091; CTR-INT-21; RF-INT-081). Al habilitar una procesadora se verifica su diseño de registro y se deja constancia en la conexión. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Soportado por ProCoop (guarda números de tarjeta en tabla: lección de seguridad, RN-10 §16). |
| Origen | FIC 6; RN-10 §16; RN-12 §4 (2779). |
| Preguntas | — |

### 12.10 Bancos

#### FI-INT-58 — Interbanking API (saldos y movimientos)

| Campo | Detalle |
|---|---|
| Propósito | Obtener saldos y movimientos de las cuentas bancarias de la cooperativa para conciliación bancaria y detección de transferencias recibidas. |
| Módulo dueño | M14 TES. |
| Dirección | Entrante (consulta). |
| Protocolo / formato | REST con OAuth2 client credentials (token de 7200 s cacheado, RN-INT-013); endpoints de cuentas, saldos y movimientos por fecha. |
| Datos intercambiados | CUIT de la empresa, cuentas (banco, tipo, número/CBU enmascarado), saldos, movimientos (fecha, importe, concepto, correlativo, CUIT originante cuando lo informa). |
| Frecuencia | Diaria (JOB-INT-21) y a demanda. |
| Credenciales | `interbankingClientId`, `interbankingClientSecret`, `interbankingServiceCode` (aplicación registrada por el tenant, PA-INT-18). |
| Errores y contingencia | Deduplicación por cuenta + importe + correlativo + fechas (RN-INT-030). Sin servicio ⇒ importación manual de extracto (FI-INT-60). |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop (`clsInterbanking`, `RESBAN_MOVINT`); uso en LAG no confirmado. |
| Origen | RN-13 §16; FIC 11.1; CTR-INT-06. |
| Preguntas | PA-INT-18. |

#### FI-INT-59 — Interbanking: archivos de pago a proveedores y sueldos

| Campo | Detalle |
|---|---|
| Propósito | Generar los archivos de transferencias masivas (pago a proveedores y acreditación de haberes) para subirlos a Interbanking o al home banking empresa. |
| Módulo dueño | M14 (proveedores), M16 (sueldos). |
| Dirección | Saliente. |
| Protocolo / formato | Layouts `interbanking.pagos` y `interbanking.sueldos` (y por banco para haberes); parámetros de origen 2262 y 2573. |
| Datos intercambiados | CBU destino, CUIT, importe, referencia, fecha. |
| Frecuencia | Por orden de pago / liquidación. |
| Credenciales | Ninguna por archivo (carga humana con firma bancaria). |
| Errores y contingencia | El archivo generado no marca el pago como realizado: M14 lo confirma al ver el débito en el extracto (generado ≠ ejecutado). |
| Ola / Prioridad | O8 / Estándar. |
| Estado investigación | Soportado por ProCoop; DFA lo menciona como "transferencias" (CTR-INT-22). |
| Origen | DFA §30; RN-13 §16.4; CTR-INT-22. |
| Preguntas | — |

#### FI-INT-60 — Extractos bancarios por archivo

| Campo | Detalle |
|---|---|
| Propósito | Importar extractos (CSV/TXT/Excel/formatos bancarios) cuando no hay API. |
| Módulo dueño | M14. |
| Dirección | Entrante. |
| Protocolo / formato | Layout por banco; ExcelImportWizard. |
| Datos intercambiados | Movimientos. |
| Frecuencia | Diaria/semanal. |
| Credenciales | — |
| Errores y contingencia | Deduplicación igual a FI-INT-58. |
| Ola / Prioridad | O5 / Núcleo (DEC-059: extractos y conciliación bancaria de M14 en O5; CTR-INT-25). |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 11.2; BASE §66. |
| Preguntas | — |

### 12.11 Comunicaciones

T09 decide qué, a quién, por qué canal y con qué plantilla y consentimiento; T06 entrega, limita la tasa y devuelve estados (RF-INT-085).

#### FI-INT-61 — Email transaccional y masivo

| Campo | Detalle |
|---|---|
| Propósito | Enviar facturas, avisos, recuperaciones de clave, campañas y recibir rebotes/quejas. |
| Módulo dueño | T09 COM (contenido); T06 (entrega). |
| Dirección | Saliente + webhooks de estado; entrante opcional (buzón de respuestas/archivos). |
| Protocolo / formato | API del proveedor de plataforma (tipo SES/SendGrid/Postmark, PA-INT-07) o SMTP con TLS del tenant; webhooks firmados de entrega, rebote, queja y apertura. |
| Datos intercambiados | Remitente del dominio del tenant, destinatario, asunto, cuerpo, adjuntos (por `storageKey`), etiquetas de correlación. |
| Frecuencia | Continuo; masivos en lotes con tasa (PRM-INT-030/031). |
| Credenciales | `emailProviderApiKey` (plataforma) o `smtpHost`, `smtpUser`, `smtpPassword` (tenant); registros DNS SPF/DKIM/DMARC por dominio. Modelo de contratación (DEC-077): conector propio del tenant o proveedor de plataforma revendido con consumo medido (RF-INT-013, JOB-INT-28) facturado como complemento del pack (DEC-065). |
| Errores y contingencia | Rebote duro ⇒ marca de email inválido en T09; failover a otra conexión (PRM-INT-032); cola diferida si todo falla. |
| Ola / Prioridad | O0–O2 / Núcleo. |
| Estado investigación | Confirmado en LAG (`AUDIT_MAIL`, SES del proveedor compartido; credenciales SMTP en código: lección de seguridad). |
| Origen | RN-10 §2; FIC 13.1; CTR-INT-13. |
| Preguntas | PA-INT-07. |

#### FI-INT-62 — Doppler (email marketing)

| Campo | Detalle |
|---|---|
| Propósito | Sincronizar listas y campañas con Doppler. |
| Módulo dueño | T09. |
| Dirección | Saliente. |
| Protocolo / formato | REST. |
| Datos intercambiados | Suscriptores y listas. |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | — / Reemplazado por FI-INT-61 + campañas de T09. |
| Estado investigación | Soportado por ProCoop; no usado en LAG. |
| Origen | FIC 13.1. |
| Preguntas | — |

#### FI-INT-63 — WhatsApp (Meta Cloud API / BSP; Trii)

| Campo | Detalle |
|---|---|
| Propósito | Enviar plantillas aprobadas (facturas, avisos de corte, turnos) y conversar con el socio (bot y operador de M09). |
| Módulo dueño | T09 / M09. |
| Dirección | Bidireccional. |
| Protocolo / formato | Meta WhatsApp Cloud API (REST Graph, plantillas, webhooks firmados con `X-Hub-Signature-256`); adaptador opcional para BSP (ej. Trii) (PA-INT-05). |
| Datos intercambiados | Número del destinatario, plantilla y variables, medios (PDF por URL firmada temporal); entrantes: texto, medios, estados enviado/entregado/leído/fallido. |
| Frecuencia | Continuo; ritmo por número (PRM-INT-034, origen 2872). |
| Credenciales | `waPhoneNumberId`, `waBusinessAccountId`, `waAccessToken`, `waAppSecret` (verificación de webhook). Modelo de contratación (DEC-077): número y cuenta propios del tenant, o proveedor de plataforma revendido con consumo medido como complemento del pack (DEC-065). |
| Errores y contingencia | Plantilla rechazada/ventana de 24 h vencida ⇒ error `validation`; caída ⇒ cola diferida y alternativa SMS/email según política de T09. |
| Ola / Prioridad | O2 / Estándar. |
| Estado investigación | Soportado por ProCoop (parámetros 2870–2874, 3105; 2824/3051/3121 destino); uso en LAG a confirmar. |
| Origen | RN-10 §5; FIC 13.2; CTR-INT-09. |
| Preguntas | PA-INT-05. |

#### FI-INT-64 — SMS

| Campo | Detalle |
|---|---|
| Propósito | Avisos cortos y códigos de verificación. |
| Módulo dueño | T09; T02 (códigos OTP). |
| Dirección | Saliente + estados. |
| Protocolo / formato | REST del proveedor elegido (PA-INT-06), lotes (PRM-INT-033). |
| Datos intercambiados | Número, texto (≤ 160 caracteres o concatenado). |
| Frecuencia | Continuo. |
| Credenciales | `smsApiKey` / `smsAccountId`. Modelo de contratación (DEC-077): conector propio del tenant o proveedor de plataforma revendido con consumo medido como complemento del pack (DEC-065). Distinto del "pack SMS" que la cooperativa vende a sus socios como servicio de M02 (DEC-084). |
| Errores y contingencia | Failover a segundo proveedor si está configurado. |
| Ola / Prioridad | O2 / Estándar. |
| Estado investigación | Soportado por ProCoop (proveedor local con lotes de 50); CTR-INT-10. |
| Origen | RN-10 §5; FIC 13.3. |
| Preguntas | PA-INT-06. |

#### FI-INT-65 — Notificaciones push (PWA y app)

| Campo | Detalle |
|---|---|
| Propósito | Avisos al socio en la PWA/app y a técnicos en la app de campo. |
| Módulo dueño | T09; M19, M10 (app de campo). |
| Dirección | Saliente. |
| Protocolo / formato | Web Push (VAPID) y FCM/APNs para apps nativas si existieran. |
| Datos intercambiados | Token de dispositivo, título, cuerpo, enlace profundo (sin datos sensibles en el cuerpo). |
| Frecuencia | Continuo. |
| Credenciales | `vapidPrivateKey`, `fcmServiceAccount`. |
| Errores y contingencia | Token inválido ⇒ baja del dispositivo. |
| Ola / Prioridad | O2 / Estándar. |
| Estado investigación | Nuevo (ProCoop usa Firebase para sincronizar, no para push al socio). |
| Origen | CNX §2.7; BASE §86. |
| Preguntas | — |

#### FI-INT-66 — Conexión con discador o IVR externo

Tratamiento único del IVR (DEC-104): CoopApps no hace llamadas ni tiene un canal de voz propio. El **mecanismo base** es el canal `ivr_export` de T09 (RF-COM-130, RF-COM-148, PAN-COM-31, O6): genera desde una audiencia el archivo de contactos con el modelo del discador. Esta ficha es la **conexión opcional** con un discador o IVR externo que consume esa exportación sin descarga manual y devuelve el resultado de las llamadas. Los avisos telefónicos de mora de M08 (RF-MOR-089) se sirven por la exportación o por esta conexión. *Reemplazado (10-11-2026): título "IVR / telefonía de atención".*

| Campo | Detalle |
|---|---|
| Propósito | Entregar al discador o IVR externo la exportación `ivr_export` de T09 (avisos de deuda, mora, cortes) y recibir el resultado de cada llamada (atendida, no atendida, ocupado, número inválido, opción elegida) para registrarlo en el historial de la comunicación (T09) y, si es un aviso de mora, en la notificación de M08. Opcional, si el proveedor lo admite: consulta de deuda y estado de reclamos por teléfono y toma de reclamos en M09 sobre la API interna. *Reemplazado (10-11-2026): "Consultar deuda y estado de reclamos por teléfono, tomar reclamos y registrar llamadas en el CRM."* |
| Módulo dueño | T09 (exportación y resultado del aviso); M09 CRM para la consulta y toma de reclamos opcional. *Reemplazado (10-11-2026): "M09 CRM; T09."* |
| Dirección | Saliente (archivo o lote de contactos de `ivr_export`) y entrante (resultados de llamadas; consultas del IVR a la API interna si se habilita). *Reemplazado (10-11-2026): "Bidireccional (el IVR consulta la API interna y registra eventos)."* |
| Protocolo / formato | Archivo con los modelos de RF-COM-148 (IVR Logística, TeleAnnouncer Lite, texto fila/columna, texto + audio, Minerva, IVR SPE, Excel) entregado por SFTP o API del proveedor; resultados por archivo de retorno, webhook o API del proveedor (SIP/CPaaS) [VERIFICAR] proveedor. |
| Datos intercambiados | Salida: teléfono (con prefijo quitado según configuración), identificador de cuenta, mensaje o audio, importe y vencimiento si el modelo lo pide, intentos, franja horaria y día de aviso (parámetros de `channelSettings` del canal `ivr_export`). Entrada: identificador del contacto, resultado, fecha y hora, intentos realizados; en la consulta opcional, número llamante, opciones elegidas, deuda informada y reclamo creado. |
| Frecuencia | Por exportación (lote) y resultados por lote o por llamada. |
| Credenciales | `ivrApiKey`, `ivrWebhookSecret` (o credencial SFTP), en la bóveda del tenant. |
| Errores y contingencia | Sin conexión ⇒ el operador descarga la exportación de PAN-COM-31 y la carga en el discador (mecanismo base); sin resultados ⇒ el aviso queda "exportado sin resultado" y no cuenta como entregado. En la consulta opcional, sin API ⇒ el IVR deriva a operador. |
| Ola / Prioridad | O10 / Extensión (la exportación base de T09 es O6). |
| Estado investigación | ProCoop **no** hace llamadas ni tiene IVR propio: `clsIVR` genera archivos para discadores externos (TeleAnouncer, Minerva, IVR de logística) y la tabla `IVR` guarda intentos, horario y día de aviso de esa exportación (FIC 13.4; CAT `IVR`). Discador usado en LAG a confirmar. *Reemplazado (10-11-2026, DEC-104): "Soportado por ProCoop (tabla `IVR`); uso en LAG a confirmar."* |
| Origen | CAT; FIC 13.4; DEC-104. |
| Preguntas | PA-INT-23. |

### 12.12 Identidad, mapas y geografía

#### FI-INT-67 — Google (OIDC) para acceso de usuarios y socios

| Campo | Detalle |
|---|---|
| Propósito | Inicio de sesión con cuenta de Google en el backoffice (si el tenant lo habilita) y en el portal del socio. |
| Módulo dueño | T02 IAM. |
| Dirección | Bidireccional (OIDC). |
| Protocolo / formato | OpenID Connect con PKCE. |
| Datos intercambiados | `sub`, email verificado, nombre. |
| Frecuencia | Por inicio de sesión. |
| Credenciales | `googleOidcClientId`, `googleOidcClientSecret`. |
| Errores y contingencia | Caída ⇒ login con usuario y clave. |
| Ola / Prioridad | O1 / Estándar. |
| Estado investigación | Nuevo. |
| Origen | BASE §59; CNX §2.8. |
| Preguntas | — |

#### FI-INT-68 — CiDi (Ciudadano Digital Córdoba)

| Campo | Detalle |
|---|---|
| Propósito | Identificación del socio con identidad digital provincial (nivel de validación) para trámites del portal. |
| Módulo dueño | T02 / M19. |
| Dirección | Bidireccional. |
| Protocolo / formato | Integración oficial de CiDi para aplicaciones de terceros [VERIFICAR] mecanismo vigente (OAuth/OIDC). |
| Datos intercambiados | CUIL, nombre, nivel de validación, email. |
| Frecuencia | Por inicio de sesión. |
| Credenciales | `cidiAppId`, `cidiAppKey`. |
| Errores y contingencia | Caída ⇒ login alternativo. |
| Ola / Prioridad | O1 mecanismo genérico de proveedor federado (T02); O2 adaptador CiDi habilitable por tenant al publicar el portal; nivel mínimo 2 para vincular cuentas / Estándar (DEC-067). Si la provincia aún no habilitó la aplicación, el adaptador queda apagado sin bloquear la ola. |
| Estado investigación | Nuevo (pedido de la tarea). |
| Origen | Pedido de la tarea. |
| Preguntas | PA-INT-20 (respondida, DEC-067). |

#### FI-INT-69 — Google Maps (mapas y Static Maps)

| Campo | Detalle |
|---|---|
| Propósito | Mostrar suministros, reclamos, órdenes y rutas en mapas; imágenes estáticas en órdenes impresas. |
| Módulo dueño | T03 (componente de mapa); consumidores M10, M03, M09, M18. |
| Dirección | Saliente. |
| Protocolo / formato | Maps JavaScript API, Static Maps API. |
| Datos intercambiados | Coordenadas (sin datos personales en la URL). |
| Frecuencia | Interactivo. |
| Credenciales | `googleMapsApiKey` (plataforma, restringida por referrer/IP, cuota por tenant; RN-INT-048). |
| Errores y contingencia | Sin clave/cuota ⇒ mapa base libre (OpenStreetMap). |
| Ola / Prioridad | O3 / Estándar. |
| Estado investigación | Confirmado en LAG (parámetro 2251; clave por defecto hardcodeada en ProCoop: lección de seguridad). |
| Origen | RN-10 §10; FIC 16. |
| Preguntas | PA-INT-19. |

#### FI-INT-70 — Geocodificación y Places

| Campo | Detalle |
|---|---|
| Propósito | Autocompletar domicilios mientras el usuario escribe (Places) y, como respaldo, geocodificar con Google cuando Georef (FI-INT-71) no devuelve resultado. La normalización y geocodificación principal es de Georef (DEC-046). |
| Módulo dueño | M01 / M03. |
| Dirección | Saliente. |
| Protocolo / formato | Places Autocomplete; Geocoding API solo como respaldo habilitable (PRM-INT-054). |
| Datos intercambiados | Texto de dirección ⇒ candidatos y componentes; coordenadas con marca de fuente (`google`) y precisión. |
| Frecuencia | A demanda; nunca masivo en migración (la geocodificación masiva usa Georef). |
| Credenciales | La de FI-INT-69 (plataforma con opción de clave propia, DEC-020). |
| Errores y contingencia | Sin resultado ⇒ ubicación manual en mapa, estado "pendiente de georreferenciación" (BASE §77). |
| Ola / Prioridad | O3 / Estándar. |
| Estado investigación | Soportado por ProCoop (solo Google); el reparto con Georef es nuevo. |
| Origen | FIC 16; RN-10 §10; BASE §77; DEC-046. |
| Preguntas | — |

#### FI-INT-71 — Georef (API de normalización geográfica de Argentina)

| Campo | Detalle |
|---|---|
| Propósito | Normalizar provincias, departamentos, localidades y calles con la fuente oficial, y geocodificar domicilios (dirección ⇒ coordenadas) como fuente principal (DEC-046). |
| Módulo dueño | T04 (tablas geográficas) / M01 (domicilios). |
| Dirección | Saliente. |
| Protocolo / formato | REST pública del Estado nacional (normalización de direcciones y unidades territoriales); lote para la migración, respetando sus límites de uso [VERIFICAR] cuota vigente. |
| Datos intercambiados | Nombres y códigos geográficos; dirección ⇒ dirección normalizada, coordenadas y precisión, con marca de fuente (`georef`). |
| Frecuencia | Carga inicial y actualización periódica de tablas; geocodificación a demanda y masiva en migración. |
| Credenciales | Ninguna. |
| Errores y contingencia | Caché local de tablas; sin coincidencia ⇒ respaldo de Google si está habilitado (FI-INT-70) o ubicación manual. Una dirección no encontrada no prueba que el domicilio no exista (BASE §77). |
| Ola / Prioridad | O1 / Estándar (tablas); O3 / Estándar (geocodificación de domicilios de servicio). |
| Estado investigación | Nuevo. |
| Origen | BASE §77; CTR-INT-20; DEC-046. |
| Preguntas | — |

#### FI-INT-72 — GIS / KML de redes

| Campo | Detalle |
|---|---|
| Propósito | Importar/exportar trazas de red, postes, transformadores y zonas en KML/GeoJSON/Shapefile. |
| Módulo dueño | M10 TEC (GIS/redes); M03. |
| Dirección | Bidireccional (archivos). |
| Protocolo / formato | KML, GeoJSON, Shapefile. |
| Datos intercambiados | Geometrías y atributos técnicos. |
| Frecuencia | A demanda. |
| Credenciales | — |
| Errores y contingencia | Validación de geometría y sistema de referencia. |
| Ola / Prioridad | O3 / Extensión. |
| Estado investigación | Soportado por ProCoop (exportación KML). |
| Origen | FIC 16. |
| Preguntas | — |

### 12.13 Medición, telemedición y prepago

La lógica de lecturas, validación de consumos, estimación y saldo prepago es de M03; T06 aporta el conector, el contrato de datos y la operación (comandos con confirmación, RN-INT-040 y RN-INT-065).

#### FI-INT-73 — Colectores portátiles de lectura (PSION / MTP y similares)

| Campo | Detalle |
|---|---|
| Propósito | Descargar rutas de lectura a terminales portátiles y cargar las lecturas tomadas. |
| Módulo dueño | M03 MED. |
| Dirección | Bidireccional (archivos). |
| Protocolo / formato | Archivos de ruta y de lecturas por layout del equipo (`colector.<marca>.ruta` / `.lecturas`), vía agente local (FI-INT-91) o carga manual. |
| Datos intercambiados | Ruta, orden, medidor, lectura anterior, rangos de control; lecturas con fecha, novedad y lecturista. |
| Frecuencia | Por ciclo de lectura. |
| Credenciales | — |
| Errores y contingencia | Lecturas fuera de rango a revisión (regla de M03); archivo duplicado por hash. Contingencia: app de campo propia (M03/M10, PWA offline). |
| Ola / Prioridad | O7 / Estándar (solo si la cooperativa conserva colectores). |
| Estado investigación | Soportado por ProCoop; uso en LAG a confirmar. |
| Origen | FIC 10.1; RN-10 §4. |
| Preguntas | Pedido de FIC 23 (cómo lee LAG hoy). |

#### FI-INT-74 — PMovil / Captor (app de campo de ProCoop)

| Campo | Detalle |
|---|---|
| Propósito | App móvil de lecturas y órdenes sincronizada con ProCoop. |
| Módulo dueño | M03 / M10. |
| Dirección | Bidireccional. |
| Protocolo / formato | Sincronización propietaria. |
| Datos intercambiados | Rutas, lecturas, órdenes. |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | — / Reemplazado por la PWA de campo de CoopApps (M03/M10). |
| Estado investigación | Soportado por ProCoop. |
| Origen | RN-10 §4; FIC 10.1, 14.2. |
| Preguntas | — |

#### FI-INT-75 — Telemedición AMI / MDM

| Campo | Detalle |
|---|---|
| Propósito | Recibir lecturas, curvas de carga, eventos y alarmas de medidores inteligentes y enviar comandos (corte, reconexión, límite de potencia, lectura a demanda). |
| Módulo dueño | M03 MED (lecturas); M08 (corte/reconexión decididos); M10 (operación técnica). |
| Dirección | Bidireccional. |
| Protocolo / formato | Un adaptador por sistema de cabecera: REST/SOAP/archivo según proveedor (QUO, Kaptor, Silexis, Hexing, Rainbow, Partner, AION, BATCOM, Boiero, NEXO, Sensa). Contrato canónico: `readings[]`, `events[]`, `command{type, meterId, params}`, `commandResult`. |
| Datos intercambiados | Número de medidor, fecha/hora, registros (activa, reactiva, demanda), eventos (tapa abierta, falta de fase), estado del relé. |
| Frecuencia | Lecturas diarias o por intervalo (JOB-INT-22); comandos a demanda. |
| Credenciales | Por sistema: `mdmBaseUrl` (catálogo), `mdmUser`, `mdmPassword` o `mdmApiKey`. |
| Errores y contingencia | Comando sin respuesta ⇒ `uncertain` y consulta de estado antes de reintentar; nunca se repite un corte sin verificar. Caída ⇒ orden de trabajo manual en campo (M10). Bitácora por medidor (RN-INT-039). |
| Ola / Prioridad | O7 / Estándar (primer adaptador según la marca del piloto, PA-INT-14); resto Extensión. |
| Estado investigación | Soportado por ProCoop (`TELEMED_COMM`, `AUDITORIA_TELEMEDICION`); uso en LAG a confirmar. |
| Origen | FIC 10.2; RN-10 §9; CAT (telemedición); BASE §97.5; CTR-INT-04. |
| Preguntas | PA-INT-14. |

#### FI-INT-76 — Discar (medición y gestión remota)

| Campo | Detalle |
|---|---|
| Propósito | Integración con la plataforma Discar de telemetría. |
| Módulo dueño | M03. |
| Dirección | Bidireccional. |
| Protocolo / formato | Adaptador del contrato canónico de FI-INT-75. |
| Datos intercambiados | Como FI-INT-75. |
| Frecuencia | Como FI-INT-75. |
| Credenciales | `discarUser`, `discarPassword`. |
| Errores y contingencia | Como FI-INT-75. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 10.2; RN-10 §9. |
| Preguntas | — |

#### FI-INT-77 — Medidores prepagos (generación de tokens)

| Campo | Detalle |
|---|---|
| Propósito | Generar el token/código de recarga (STS o propietario) al acreditar una compra prepaga y registrar el crédito. |
| Módulo dueño | M03 (saldo prepago) / M07 (cobro). |
| Dirección | Saliente con respuesta inmediata. |
| Protocolo / formato | Adaptador por sistema de venta (CashPower, C_Token, NEXO, Boiero y otros): servicio web o librería del fabricante en el agente local. |
| Datos intercambiados | Número de medidor, importe/energía, tarifa; respuesta con token de 20 dígitos y número de transacción. |
| Frecuencia | Por recarga (≈ 70 % de las solicitudes SIRO de LAG son prepagas tipo 7). |
| Credenciales | Por sistema: `prepaidVendorUser`, `prepaidVendorKey`, módulo de seguridad del fabricante cuando aplica. |
| Errores y contingencia | Pago confirmado sin token ⇒ reintento idempotente por número de transacción; si sigue fallando, bandeja para emisión manual. Nunca se emiten dos tokens para el mismo pago. |
| Ola / Prioridad | O7 / Núcleo (la base relevada LAG vende prepago). |
| Estado investigación | Confirmado en LAG (uso de prepago); sistema de tokens exacto a confirmar. |
| Origen | FIC 10.3; RN-12 §3; RN-10 §9. |
| Preguntas | [VERIFICAR] marca y sistema de venta prepaga de la cooperativa piloto. |

#### FI-INT-78 — Mi Medidor (Mr. Dims)

| Campo | Detalle |
|---|---|
| Propósito | Consulta de consumo por el socio a través del servicio "Mi Medidor". |
| Módulo dueño | M03 / M19. |
| Dirección | Entrante. |
| Protocolo / formato | REST del proveedor. |
| Datos intercambiados | Medidor, consumos. |
| Frecuencia | Diaria. |
| Credenciales | `mrdimsApiKey`. |
| Errores y contingencia | Sin datos ⇒ el portal muestra el último consumo facturado. |
| Ola / Prioridad | O7 / Extensión. |
| Estado investigación | Soportado por ProCoop; uso en LAG a confirmar. |
| Origen | FIC 10.2. |
| Preguntas | — |

### 12.14 Red, aprovisionamiento y telefonía (servicios TIC)

#### FI-INT-79 — MikroTik (RouterOS)

| Campo | Detalle |
|---|---|
| Propósito | Alta, baja, suspensión y cambio de plan de abonados de internet (colas, listas de direcciones, PPPoE). |
| Módulo dueño | M10 TEC (aprovisionamiento); M08 decide suspensión/reconexión. |
| Dirección | Saliente. |
| Protocolo / formato | API de RouterOS (TLS) o REST (v7). |
| Datos intercambiados | Usuario PPPoE/IP, plan (velocidad), estado. |
| Frecuencia | Por evento de alta/cambio/suspensión. |
| Credenciales | `mikrotikHost` (lista permitida), `mikrotikUser`, `mikrotikPassword`. |
| Errores y contingencia | Resultado incierto ⇒ lectura de estado antes de reintentar (RN-INT-065); contingencia operación manual del NOC. |
| Ola / Prioridad | O3 / Núcleo (piloto Internet). |
| Estado investigación | Soportado por ProCoop; uso en LAG a confirmar. |
| Origen | FIC 17; RN-10 §9. |
| Preguntas | — |

#### FI-INT-80 — RADIUS

| Campo | Detalle |
|---|---|
| Propósito | Gestionar usuarios y atributos de servicio en el servidor RADIUS (autorización y contabilidad). |
| Módulo dueño | M10. |
| Dirección | Saliente (ABM) y entrante (contabilidad de uso, opcional). |
| Protocolo / formato | Base de datos/API del servidor RADIUS (FreeRADIUS u otro) mediante agente local o API. |
| Datos intercambiados | Usuario, plan, estado; sesiones y consumo. |
| Frecuencia | Por evento; contabilidad diaria. |
| Credenciales | `radiusApiUser`, `radiusApiKey`. |
| Errores y contingencia | Como FI-INT-79. |
| Ola / Prioridad | O3 / Estándar. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-81 — SmartOLT (FTTH)

| Campo | Detalle |
|---|---|
| Propósito | Autorizar ONU, asignar perfil, suspender y reactivar abonados de fibra. |
| Módulo dueño | M10. |
| Dirección | Saliente + consulta. |
| Protocolo / formato | REST con API key. |
| Datos intercambiados | Serie de ONU, OLT/puerto, perfil, estado y señal. |
| Frecuencia | Por evento. |
| Credenciales | `smartoltApiKey`, subdominio en catálogo. |
| Errores y contingencia | Como FI-INT-79. |
| Ola / Prioridad | O3 / Estándar. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-82 — Wispro

| Campo | Detalle |
|---|---|
| Propósito | Sincronizar abonados, planes y estados con la plataforma de gestión ISP Wispro. |
| Módulo dueño | M10. |
| Dirección | Bidireccional. |
| Protocolo / formato | REST. |
| Datos intercambiados | Cliente, contrato, plan, estado. |
| Frecuencia | Por evento. |
| Credenciales | `wisproApiToken`. |
| Errores y contingencia | Como FI-INT-79. |
| Ola / Prioridad | O3 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-83 — Otros gestores ISP (Ispfull, Sopnet y similares)

| Campo | Detalle |
|---|---|
| Propósito | Igual que FI-INT-82 para otras plataformas. |
| Módulo dueño | M10. |
| Dirección | Bidireccional. |
| Protocolo / formato | Adaptador por plataforma sobre el contrato canónico de aprovisionamiento. |
| Datos intercambiados | Como FI-INT-82. |
| Frecuencia | Por evento. |
| Credenciales | Según plataforma. |
| Errores y contingencia | Como FI-INT-79. |
| Ola / Prioridad | O3 / Extensión (bajo demanda). |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-84 — Centrales telefónicas (CDR)

| Campo | Detalle |
|---|---|
| Propósito | Importar los registros de llamadas para tasación y facturación de telefonía. |
| Módulo dueño | M10 (telefonía) / M03 (consumo) / M05 (facturación). |
| Dirección | Entrante. |
| Protocolo / formato | Archivos CDR por central (layout por marca) vía SFTP/agente local (JOB-INT-23). |
| Datos intercambiados | Origen, destino, fecha/hora, duración, troncal. |
| Frecuencia | Diaria/por cierre. |
| Credenciales | SFTP o agente. |
| Errores y contingencia | Archivo faltante ⇒ alerta antes del cierre de facturación; duplicados por hash y por clave de llamada. |
| Ola / Prioridad | O10 / Extensión (si presta telefonía). |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-85 — Telefonía móvil revendida (Claro / Personal)

| Campo | Detalle |
|---|---|
| Propósito | Importar la facturación del operador para refacturar líneas a socios. |
| Módulo dueño | M10 / M05. |
| Dirección | Entrante. |
| Protocolo / formato | Archivo del operador. |
| Datos intercambiados | Línea, plan, consumos, importes. |
| Frecuencia | Mensual. |
| Credenciales | — |
| Errores y contingencia | Líneas sin titular a bandeja. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17. |
| Preguntas | — |

#### FI-INT-86 — TV / sistemas de acceso condicional (CAS) y Sensa

| Campo | Detalle |
|---|---|
| Propósito | Habilitar/inhabilitar decodificadores y paquetes de TV por abonado. |
| Módulo dueño | M10 / M02 (paquetes). |
| Dirección | Saliente. |
| Protocolo / formato | API del CAS o del middleware (Sensa como proveedor de TV; CTR-INT-04 por la ambigüedad con medición). |
| Datos intercambiados | Serie de decodificador, paquetes, estado. Detalle en "Contrato del conector" (HUE-TV-04). |
| Frecuencia | Por evento. |
| Credenciales | Según CAS. |
| Errores y contingencia | Como FI-INT-79. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 17; CTR-INT-04; HUE-TV-04 (contrato del conector). |
| Preguntas | — |

**Contrato del conector CAS (HUE-TV-04).** Interfaz que todo adaptador de CAS o middleware de TV implementa; M10 la invoca con el perfil de aprovisionamiento de TV (M10 RF-TEC-183: `tvPackageCode`, `casPackageIds[]`, `includedDecoders`, `maxDecoders`) y el decodificador del servicio (`serviceTechnicalProfiles.decoders[]`).

| Elemento | Definición |
|---|---|
| Comandos | `activateDecoder`, `deactivateDecoder`, `suspend`, `resume`, `setPackages` (reemplaza el conjunto de paquetes), `addPackage`, `removePackage`, `pairSmartCard`, `resetPin`, `sendOsdMessage` (mensaje en pantalla, opcional), `queryStatus`. |
| Solicitud | `{ commandId (idempotencia), tenantId, systemId, contractId, decoderSerial, smartCardId?, casSubscriberId?, casPackageIds[], action, effectiveAt, requestedBy }`. El adaptador traduce `casPackageIds` a los códigos del proveedor según la tabla de equivalencias del sistema (M10 `provisioningSystems.profiles`). |
| Respuesta | Síncrona `accepted` con `externalRef`, o asíncrona por callback (API-TEC-50, firma HMAC): `{ commandId, status (done/failed/partial), appliedPackageIds[], decoderStatus (active/suspended/inactive/unpaired), providerCode, providerMessage (sanitizado), at }`. |
| Idempotencia | Un `commandId` repetido devuelve el resultado ya registrado; `setPackages` es declarativo (estado final), por lo que reenviarlo no duplica paquetes. |
| Errores normalizados | `int.cas.decoderNotFound`, `int.cas.smartCardMismatch`, `int.cas.packageUnknown`, `int.cas.maxDecodersExceeded`, `int.cas.providerUnavailable` (reintentable), `int.cas.authFailed`; errores no reintentables quedan en la consola de comandos de M10 (PAN-TEC-38) para acción manual. |
| Conciliación | `queryStatus` por lote diario compara paquetes y estado en el CAS contra `serviceTechnicalProfiles`; las diferencias quedan en bandeja, sin corrección automática. |
| Seguridad | Credenciales en bóveda (`integrationSecrets`, §7.3); nunca viajan PIN ni claves del decodificador en claro en la bitácora. |

#### FI-INT-87 — SITSA

| Campo | Detalle |
|---|---|
| Propósito | Intercambio con el sistema SITSA (servicios TIC). |
| Módulo dueño | M10. |
| Dirección | A validar. |
| Protocolo / formato | A validar. |
| Datos intercambiados | A validar. |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop; [VERIFICAR] qué es SITSA y si LAG lo usa. |
| Origen | FIC 17. |
| Preguntas | Confirmar con la cooperativa piloto. |

### 12.15 Flota, firma e inteligencia artificial

#### FI-INT-88 — GPS / AVL de flota

| Campo | Detalle |
|---|---|
| Propósito | Posición de vehículos y cuadrillas para despacho, recorridos y control de flota. |
| Módulo dueño | M18 (flota); M10 (despacho de cuadrillas). |
| Dirección | Entrante. |
| Protocolo / formato | API del proveedor de rastreo (REST/webhook) (JOB-INT-24). |
| Datos intercambiados | Patente/equipo, lat/long, velocidad, fecha, eventos (encendido, exceso). |
| Frecuencia | Cada pocos minutos. |
| Credenciales | `avlApiKey`. |
| Errores y contingencia | Sin datos ⇒ ubicación declarada por el técnico en la app. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Nuevo (pedido de la tarea). |
| Origen | Pedido de la tarea. |
| Preguntas | — |

#### FI-INT-89 — Firma digital y electrónica (Encustody u otro)

| Campo | Detalle |
|---|---|
| Propósito | Firmar contratos, solicitudes, convenios de pago, recibos de sueldo y actas con firma electrónica o digital. |
| Módulo dueño | T11 (expediente documental); consumidores M01, M08, M16, M17. |
| Dirección | Bidireccional (envío del documento y webhook de firma). |
| Protocolo / formato | REST del proveedor; documento PDF por URL firmada; webhook + reconsulta. |
| Datos intercambiados | PDF, firmantes (nombre, email, CUIL), orden de firma; resultado con PDF firmado y evidencia. |
| Frecuencia | Por documento. |
| Credenciales | `signatureApiKey`, `signatureWebhookSecret`. |
| Errores y contingencia | Sin firma en plazo ⇒ recordatorio y vencimiento; contingencia: firma ológrafa digitalizada. |
| Ola / Prioridad | O3 / Estándar (firma de la instalación integral); resto de documentos O9–O10. Según DEC-078: firma electrónica con OTP por defecto (instalación, convenios, trámites); firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9). |
| Estado investigación | Soportado por ProCoop (Encustody); uso en LAG a confirmar. |
| Origen | FIC 15; DEC-078. |
| Preguntas | PA-INT-22 (respondida, DEC-078). |

#### FI-INT-90 — Proveedores de IA (LLM)

| Campo | Detalle |
|---|---|
| Propósito | Asistentes que proponen: lectura de facturas de proveedores, respuestas sugeridas en CRM, resúmenes, clasificación de reclamos. |
| Módulo dueño | T06 (conector); consumidores M09, M12, T10. |
| Dirección | Saliente. |
| Protocolo / formato | API HTTPS del proveedor con abstracción multi-proveedor (RF-INT-086). |
| Datos intercambiados | Texto o imagen con datos personales redactados cuando no son necesarios; respuesta estructurada (JSON con esquema). |
| Frecuencia | A demanda, con cuota por tenant. |
| Credenciales | `llmApiKey` (plataforma o tenant, PA-INT-01). |
| Errores y contingencia | Sin IA ⇒ el flujo sigue manual; nunca ejecuta acciones sin confirmación humana. |
| Ola / Prioridad | O6 / Estándar para clasificar, resumir y sugerir en CRM; O10 para adjuntos e imágenes; apagada hasta que el tenant la acepte (DEC-056, DEC-020; CTR-INT-26). |
| Estado investigación | Soportado por ProCoop (`AUDIT_IA`); uso en LAG a confirmar. |
| Origen | FIC 20; CNX §2.1, §4.5. |
| Preguntas | PA-INT-08. |

### 12.16 Hardware local

Todo el hardware se integra **a través del agente local** (FI-INT-91); el navegador nunca habla directo con puertos locales ni con drivers (RF-INT-084). DEC-007 incluye el hardware en el alcance; su ola es O10 salvo la impresión de caja (CTR-INT-15).

#### FI-INT-91 — Agente local CoopApps

| Campo | Detalle |
|---|---|
| Propósito | Puente seguro entre la nube y los dispositivos de la sucursal (impresoras, lectores, turnero, balanzas, colectores, centrales). |
| Módulo dueño | T06; consumidores M07, M09, M11, M03, M10. |
| Dirección | Bidireccional por canal saliente desde el agente. |
| Protocolo / formato | WebSocket TLS iniciado por el agente; comandos firmados con expiración; latido (PRM-INT-050); cola local. |
| Datos intercambiados | Comandos (imprimir, leer, mostrar turno) y resultados; inventario de dispositivos. |
| Frecuencia | Continuo. |
| Credenciales | Identidad de dispositivo emitida en el emparejamiento (código de un solo uso); rotación automática. |
| Errores y contingencia | Agente desconectado ⇒ `int.agent.offline`, alerta y degradación (PDF para imprimir desde el navegador, llamado de turnos solo en la PWA). |
| Ola / Prioridad | O10 / Estándar (O5 si una sucursal exige impresión térmica de caja desde el inicio). |
| Estado investigación | Nuevo; reemplaza el Agente/Integra de ProCoop (RN-10 §12). |
| Origen | FIC 19; RN-10 §11, §12, §16.1; DEC-007. |
| Preguntas | PA-INT-09. |

#### FI-INT-92 — Impresoras térmicas y controladores fiscales

| Campo | Detalle |
|---|---|
| Propósito | Imprimir tickets, recibos de caja y comprobantes; controladores fiscales homologados si algún tenant los usa. |
| Módulo dueño | M07 (caja), M11 (POS). |
| Dirección | Saliente. |
| Protocolo / formato | ESC/POS por agente; protocolo del fabricante para controladores fiscales de nueva generación (Hasar, Epson) [VERIFICAR] vigencia normativa. |
| Datos intercambiados | Contenido del comprobante. |
| Frecuencia | Por operación. |
| Credenciales | — |
| Errores y contingencia | Impresora sin papel/apagada ⇒ PDF y reimpresión. |
| Ola / Prioridad | O10 / Estándar. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 19. |
| Preguntas | PA-INT-25. |

#### FI-INT-93 — Lectores de tarjeta, validadores de billetes y tótem de autoservicio

| Campo | Detalle |
|---|---|
| Propósito | Cobro presencial con terminal POS integrada y tótem de autopago. |
| Módulo dueño | M07. |
| Dirección | Bidireccional. |
| Protocolo / formato | SDK del adquirente/POS integrado por agente; el tótem usa la PWA en modo quiosco. **Nunca** se capturan número, vencimiento ni CVV en CoopApps (RN-INT-050, RF-INT-081). |
| Datos intercambiados | Importe, referencia; resultado con autorización y últimos 4 dígitos. |
| Frecuencia | Por cobro. |
| Credenciales | Según adquirente. |
| Errores y contingencia | Resultado incierto ⇒ consulta al adquirente antes de reintentar. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop (tótem con HTML local que pedía datos de tarjeta: lección de seguridad). |
| Origen | FIC 19; RN-13 §3.7. |
| Preguntas | — |

#### FI-INT-94 — Turnero

| Campo | Detalle |
|---|---|
| Propósito | Emitir turnos, mostrarlos en pantalla y llamar desde los puestos de atención. |
| Módulo dueño | M09 CRM. |
| Dirección | Bidireccional. |
| Protocolo / formato | Pantalla web (PWA en modo pantalla) y dispensador de tickets vía agente. |
| Datos intercambiados | Número de turno, motivo, puesto. |
| Frecuencia | Continuo. |
| Credenciales | Identidad del agente. |
| Errores y contingencia | Sin agente ⇒ turnos solo en pantalla. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 19. |
| Preguntas | — |

#### FI-INT-95 — Balanzas, escáneres, lectores de código y dispensadores

| Campo | Detalle |
|---|---|
| Propósito | Periféricos de ventas, depósito y digitalización de documentos. |
| Módulo dueño | M11, M13, T11 (digitalización). |
| Dirección | Entrante. |
| Protocolo / formato | Lectores como teclado (sin integración); balanza y escáner por agente (serial/TWAIN). |
| Datos intercambiados | Peso, código, imagen. |
| Frecuencia | Por uso. |
| Credenciales | — |
| Errores y contingencia | Carga manual. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 19. |
| Preguntas | — |

### 12.17 Datos, legado y servicios de plataforma

#### FI-INT-96 — Importación de planillas y archivos (Excel, CSV, DBF, Access)

| Campo | Detalle |
|---|---|
| Propósito | Importaciones masivas controladas (padrones, precios, lecturas, novedades de sueldos) con ExcelImportWizard y layouts declarativos. |
| Módulo dueño | T06 (motor); dueño = módulo destino. |
| Dirección | Entrante. |
| Protocolo / formato | XLSX/CSV; DBF y MDB solo en importación controlada en servidor aislado. |
| Datos intercambiados | Según layout. |
| Frecuencia | A demanda. |
| Credenciales | — |
| Errores y contingencia | Vista previa con errores por línea, aplicación idempotente. |
| Ola / Prioridad | O1 / Núcleo. |
| Estado investigación | Soportado por ProCoop (`clsImportacionArchivos`). |
| Origen | FIC 22; RN-10 §11, §16.6; BASE §31 CU-31. |
| Preguntas | — |

#### FI-INT-97 — Migración desde ProCoop

| Campo | Detalle |
|---|---|
| Propósito | Extraer datos de ProCoop (SQL Server) y cargarlos en CoopApps; paralelo y by-pass. |
| Módulo dueño | T07 MIG. |
| Dirección | Entrante. |
| Protocolo / formato | Ver T07. T06 aporta `externalReferences` (RF-INT-078) y la regla de no importar credenciales (RF-INT-023). |
| Datos intercambiados | Ver T07. |
| Frecuencia | Por ensayo y corte. |
| Credenciales | Acceso de solo lectura a la base del tenant, en bóveda, temporal. |
| Errores y contingencia | Ver T07. |
| Ola / Prioridad | O0–O11 / Núcleo. |
| Estado investigación | Ver T07. |
| Origen | FIC 21. |
| Preguntas | — |

#### FI-INT-98 — Power BI y herramientas de análisis

| Campo | Detalle |
|---|---|
| Propósito | Exponer datos a herramientas de BI. |
| Módulo dueño | T10 BIA. |
| Dirección | Saliente. |
| Protocolo / formato | Ver T10 (API de lectura / exportación). |
| Datos intercambiados | Ver T10. |
| Frecuencia | — |
| Credenciales | Token de API de T10. |
| Errores y contingencia | — |
| Ola / Prioridad | Ver T10. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 18.1. |
| Preguntas | — |

#### FI-INT-99 — Sistema contable externo (SISCONT y similares)

| Campo | Detalle |
|---|---|
| Propósito | Exportar asientos para un sistema contable externo cuando la cooperativa no usa M15. |
| Módulo dueño | M15 CON. |
| Dirección | Saliente. |
| Protocolo / formato | Archivo por layout del sistema destino. |
| Datos intercambiados | Asientos, cuentas, centros de costo. |
| Frecuencia | Mensual/diaria. |
| Credenciales | — |
| Errores y contingencia | Generado ≠ importado; reexportación versionada. |
| Ola / Prioridad | O8 / Extensión. |
| Estado investigación | Soportado por ProCoop. |
| Origen | FIC 18.2. |
| Preguntas | — |

#### FI-INT-100 — API para terceros (Integra / WS_KEYS)

| Campo | Detalle |
|---|---|
| Propósito | Que terceros consulten deuda, registren pagos o lean datos. |
| Módulo dueño | T10 BIA. |
| Dirección | Entrante. |
| Protocolo / formato | Ver T10 (`/api/v1/ext/...`, token por cliente, alcance, límites). |
| Datos intercambiados | Ver T10. |
| Frecuencia | — |
| Credenciales | Tokens emitidos por T10 (las claves `WS_KEYS` de ProCoop no se migran). |
| Errores y contingencia | — |
| Ola / Prioridad | Ver T10. |
| Estado investigación | Soportado por ProCoop (Integra). |
| Origen | FIC 14.3; RN-10 §12; CTR-INT-07. |
| Preguntas | — |

#### FI-INT-101 — CoopOnline (portal y app sincronizados por Firebase/MySQL/FTP)

| Campo | Detalle |
|---|---|
| Propósito | Portal y app del socio de ProCoop alimentados por réplica. |
| Módulo dueño | M19. |
| Dirección | — |
| Protocolo / formato | — |
| Datos intercambiados | — |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | Redirecciones de links viejos durante la transición (PA-INT-17). |
| Ola / Prioridad | — / Reemplazado por M19 sobre la misma API (sin réplica). |
| Estado investigación | Confirmado en LAG. |
| Origen | FIC 14.1; RN-10 §3; CTR-INT-11, CTR-INT-12. |
| Preguntas | PA-INT-17. |

#### FI-INT-102 — Almacenamiento de objetos, SFTP y FTP

| Campo | Detalle |
|---|---|
| Propósito | Guardar archivos (PDF, adjuntos, archivos de intercambio) y transportar archivos a terceros. |
| Módulo dueño | T01 (almacenamiento) / T06 (transporte). |
| Dirección | Bidireccional. |
| Protocolo / formato | Almacenamiento compatible S3 con prefijo por tenant y URLs firmadas; SFTP con huella fijada; FTP solo por excepción (RF-INT-065). |
| Datos intercambiados | Archivos. |
| Frecuencia | Continuo. |
| Credenciales | `storageAccessKey` (plataforma); `sftpUser`, `sftpPrivateKey` por conexión. |
| Errores y contingencia | Reintentos; descarga manual. |
| Ola / Prioridad | O0 / Núcleo. |
| Estado investigación | Soportado por ProCoop (`TransferirFTP`, S3 del proveedor). |
| Origen | FIC 22; RN-10 §12. |
| Preguntas | — |

#### FI-INT-103 — Servicios del proveedor de ProCoop (RSS, encuestas, soporte remoto, actualizaciones)

| Campo | Detalle |
|---|---|
| Propósito | Servicios auxiliares que ProCoop consume de su proveedor. |
| Módulo dueño | — |
| Dirección | — |
| Protocolo / formato | — |
| Datos intercambiados | — |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | — / Descartado (no aplica a un SaaS; encuestas en T09, soporte en T01). |
| Estado investigación | Soportado por ProCoop. |
| Origen | RN-10 §11, §12; RN-INT-058. |
| Preguntas | — |

#### FI-INT-104 — Office interop (Excel, Word, Access)

| Campo | Detalle |
|---|---|
| Propósito | Generación de planillas y documentos con Office instalado. |
| Módulo dueño | — |
| Dirección | — |
| Protocolo / formato | — |
| Datos intercambiados | — |
| Frecuencia | — |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | — / Reemplazado por exportación XLSX/CSV/PDF en servidor (RN-INT-059). |
| Estado investigación | Soportado por ProCoop. |
| Origen | RN-10 §11. |
| Preguntas | — |

#### FI-INT-105 — ProCoop 6 / tablas DBF heredadas

| Campo | Detalle |
|---|---|
| Propósito | Lectura de datos históricos de versiones anteriores. |
| Módulo dueño | T07. |
| Dirección | Entrante (una sola vez). |
| Protocolo / formato | DBF por importación controlada (FI-INT-96). |
| Datos intercambiados | Históricos. |
| Frecuencia | Migración. |
| Credenciales | — |
| Errores y contingencia | — |
| Ola / Prioridad | Según T07 / Extensión. |
| Estado investigación | Soportado por ProCoop; existencia de históricos DBF en LAG a confirmar. |
| Origen | FIC 21; RN-10 §16.6. |
| Preguntas | — |

#### FI-INT-106 — Calendario de feriados nacionales

| Campo | Detalle |
|---|---|
| Propósito | Mantener feriados para vencimientos, días hábiles bancarios y cortes. |
| Módulo dueño | T04 CFG. |
| Dirección | Entrante. |
| Protocolo / formato | Fuente pública oficial [VERIFICAR] disponibilidad de API; si no, carga anual manual. |
| Datos intercambiados | Fecha, tipo, jurisdicción. |
| Frecuencia | Anual y ante decretos. |
| Credenciales | — |
| Errores y contingencia | Carga manual auditada. |
| Ola / Prioridad | O1 / Estándar. |
| Estado investigación | Nuevo. |
| Origen | BASE §47 (vencimientos); AGR-017. |
| Preguntas | — |

### 12.18 Integraciones adicionales de la BASE y de las fuentes de ProCoop

Fichas que cubren requisitos de la BASE (MER-007, MER-008, MER-017, MER-020, §87) y del relevamiento (FIC 16; RN-10 §10; tabla `CORREOSINT`) que no tenían ficha propia.

#### FI-INT-107 — Cobranza fuera de oficina y puntos de venta remotos de prepago

| Campo | Detalle |
|---|---|
| Propósito | Que cobradores a domicilio y puntos remotos (kioscos, estaciones de servicio) cobren facturas y vendan energía prepaga, como el R-Pos de ProCoop, con rendición posterior. |
| Módulo dueño | M07 COB (cobranza y rendición); M03 MED (venta de prepago); T06 aporta el canal y la idempotencia. |
| Dirección | Bidireccional. |
| Protocolo / formato | PWA de cobrador/punto de venta sobre la API interna, con cola sin conexión y `clientMutationId` por cobro; terceros con sistema propio usan la API de T10 con alcance de cobranza. |
| Datos intercambiados | Lista de cobro, comprobantes a cancelar, cobros (importe, medio, recibo); para prepago: compra y token (FI-INT-77). |
| Frecuencia | Por cobro; sincronización al recuperar conexión. |
| Credenciales | Usuario del cobrador (T02) con permiso acotado a su lista; token de cliente de T10 para terceros. Sin claves en el dispositivo. |
| Errores y contingencia | Sin conexión ⇒ recibo provisorio numerado por dispositivo y sincronización con control de duplicados; un cobro repetido no cancela dos veces (BASE MER-007). Venta de prepago sin conexión: solo si el sistema de prepago admite tokens diferidos [VERIFICAR] por proveedor. |
| Ola / Prioridad | O5 / Extensión (cobrador); O7 / Extensión (prepago remoto). |
| Estado investigación | Soportado por ProCoop (R-Pos, según BASE [MER1]); uso en LAG a confirmar. |
| Origen | BASE §100 MER-007; FIC 10.3. |
| Preguntas | — |

#### FI-INT-108 — Imprenta y distribución física de facturas

| Campo | Detalle |
|---|---|
| Propósito | Entregar a una imprenta el lote de facturas para imprimir y ensobrar por ruta de reparto, y recibir la constancia de entrega o devolución. |
| Módulo dueño | M05 FAC (lote y orden de impresión); T09 COM (constancia de entrega). |
| Dirección | Bidireccional. |
| Protocolo / formato | PDF unificado o por ruta y archivo índice (CSV) por layout declarativo; entrega por SFTP o descarga autenticada (FI-INT-102); devolución por planilla importada (FI-INT-96). |
| Datos intercambiados | Facturas ya autorizadas, ruta, secuencia, mensaje personalizado; novedades de reparto (entregada, domicilio inexistente, rechazada). |
| Frecuencia | Por ciclo de facturación. |
| Credenciales | `sftpUser`/`sftpPrivateKey` de la imprenta, si usa SFTP. |
| Errores y contingencia | Archivo rechazado por la imprenta ⇒ regeneración versionada; el lote nunca incluye comprobantes sin CAE. |
| Ola / Prioridad | O5 / Estándar. |
| Estado investigación | Nuevo (BASE); ProCoop imprime en la cooperativa. |
| Origen | BASE §100 MER-008; AGR-024. |
| Preguntas | — |

#### FI-INT-109 — Monitoreo de red y equipos ISP

| Campo | Detalle |
|---|---|
| Propósito | Recibir el estado de nodos, OLT y enlaces para vincular las caídas con incidentes de zona y tickets, sin operar la red. |
| Módulo dueño | M10 TEC (incidentes de zona); M09 CRM (aviso a los afectados). |
| Dirección | Entrante. |
| Protocolo / formato | Webhook de alertas del sistema de monitoreo de la cooperativa (por ejemplo Zabbix o LibreNMS) al endpoint de T06, o lectura del estado por la API de SmartOLT (FI-INT-81). CoopApps no hace sondeo SNMP propio. |
| Datos intercambiados | Equipo, nodo, severidad, inicio y fin del evento. |
| Frecuencia | Por evento. |
| Credenciales | Secreto de firma del webhook; credencial de lectura del sistema de monitoreo. |
| Errores y contingencia | Sin alertas ⇒ M10 declara el incidente a mano; una alerta repetida no crea otro incidente. |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Nuevo (BASE; el benchmark lo atribuye a otro proveedor). |
| Origen | BASE §100 MER-017; BASE §86. |
| Preguntas | — |

#### FI-INT-110 — Registro de electrodependientes

| Campo | Detalle |
|---|---|
| Propósito | Identificar suministros con personas electrodependientes, para bloquear el corte por mora y priorizar en interrupciones. |
| Módulo dueño | M01 PER / M03 (marca del suministro); M08 MOR (bloqueo de corte). |
| Dirección | Entrante. |
| Protocolo / formato | Por ahora carga manual con certificado adjunto (T11) o planilla del organismo (FI-INT-96). Consulta automática solo si el registro nacional o provincial publica un servicio [VERIFICAR]. |
| Datos intercambiados | Documento, suministro, vigencia y constancia. Es un dato de salud: acceso restringido y sin exportación a BI. |
| Frecuencia | Alta y renovación. |
| Credenciales | — |
| Errores y contingencia | Ante duda se mantiene la protección; el vencimiento genera aviso, no la baja automática. |
| Ola / Prioridad | O7 / Estándar (carga manual); consulta automática Extensión. |
| Estado investigación | Nuevo (BASE §87 cita regímenes nacionales y provinciales). |
| Origen | BASE §87. |
| Preguntas | — |

#### FI-INT-111 — Exportación integral de datos del tenant (salida del cliente)

| Campo | Detalle |
|---|---|
| Propósito | Entregar todos los datos de una cooperativa que deja la plataforma, en formatos documentados, con plazo y eliminación certificada posterior. |
| Módulo dueño | T01 PLA (proceso de salida); T10 BIA (formatos); T06 aporta el transporte. |
| Dirección | Saliente. |
| Protocolo / formato | Paquete de archivos (JSON/CSV por colección, PDF y adjuntos) con manifiesto, hash e índice; descarga autenticada o SFTP (FI-INT-102). |
| Datos intercambiados | Datos de negocio del tenant. **Se excluyen** los secretos de la bóveda, los tokens y las claves privadas (RF-INT-016…020); el tenant los regenera con sus proveedores. |
| Frecuencia | Única (salida) o a pedido, con permiso reforzado. |
| Credenciales | — |
| Errores y contingencia | Paquete parcial ⇒ reanudación por manifiesto. |
| Ola / Prioridad | O11 / Estándar. |
| Estado investigación | Nuevo. |
| Origen | BASE §100 MER-020; AGR-033. |
| Preguntas | — |

#### FI-INT-112 — Correo provisto a socios (casillas)

| Campo | Detalle |
|---|---|
| Propósito | Dar de alta, suspender y dar de baja casillas de correo que la cooperativa vende como servicio a sus socios. |
| Módulo dueño | M10 TEC (servicio); T06 (conector). |
| Dirección | Saliente. |
| Protocolo / formato | API del panel del hosting de correo de la cooperativa [VERIFICAR] proveedor; sin API ⇒ tarea manual con checklist. |
| Datos intercambiados | Dirección, plan o cuota, estado. La contraseña la define el socio en el proveedor; CoopApps no la guarda. **Consumo del período** (DEC-084, RN-TAR-251 de M04): por casilla, unidad (`mailbox` o `gb`) y cantidad medida entre dos fechas, leído del panel del proveedor o importado por archivo (FI-INT-96); T06 lo publica como EVT-INT-24 `int.serviceUsage.received` con la referencia externa y M10 lo atribuye al contrato. El mismo contrato de datos vale para el pack SMS vendido al socio (unidad `sms`), con la conexión del proveedor que el tenant configure para ese servicio (distinta de la de FI-INT-64, que es para avisos de la cooperativa). |
| Frecuencia | Por alta, baja o mora; consumo: una vez por período, antes del cierre de cálculo del ciclo (sin dato a tiempo, M04 aplica RN-TAR-251 punto 5). |
| Credenciales | `mailHostingApiKey` por conexión. |
| Errores y contingencia | Comando incierto ⇒ consulta de estado antes de reintentar (como FI-INT-79). |
| Ola / Prioridad | O10 / Extensión. |
| Estado investigación | Soportado por ProCoop (`CORREOSINT`, que guarda contraseñas: no se migran en claro). |
| Origen | M10 §13 (correo provisto); §7.17 (`CORREOSINT`). |
| Preguntas | — |

#### FI-INT-113 — GIS externo de la cooperativa y catastro de parcelas

| Campo | Detalle |
|---|---|
| Propósito | Importar parcelas y nomenclatura catastral, e intercambiar capas con el GIS que ya use la cooperativa. |
| Módulo dueño | M01 / M03 (inmueble y suministro); M10 (redes, con FI-INT-72). |
| Dirección | Bidireccional. |
| Protocolo / formato | Importación de parcelas por archivo (SHP, GeoJSON, KML o CSV con nomenclatura) mediante FI-INT-96; exportación de suministros georreferenciados en GeoJSON/KML. No se conecta a bases GIS locales (ProCoop lo hacía por OleDb). |
| Datos intercambiados | Nomenclatura catastral, polígono o centroide, vínculo con el inmueble. |
| Frecuencia | Carga inicial y actualizaciones. |
| Credenciales | — |
| Errores y contingencia | Parcelas sin coincidencia ⇒ bandeja de revisión; nunca se reasigna un suministro sin confirmación. |
| Ola / Prioridad | O3 / Extensión. |
| Estado investigación | Soportado por ProCoop (`Import_Parcelas`, GIS por cooperativa). |
| Origen | FIC 16; RN-10 §10. |
| Preguntas | — |

#### FI-INT-114 — Distribuidora de gas de referencia: intercambio de formularios

| Campo | Detalle |
|---|---|
| Propósito | Intercambiar con la distribuidora de referencia del subdistribuidor (por ejemplo, la licenciataria de la zona) los formularios del trámite de gas: solicitud de factibilidad o de primera alta con aprobación técnica, presentación del legajo técnico del matriculado, DDJJ de artefactos, solicitud de habilitación y colocación de medidor, y sus respuestas (aprobado, observado, rechazado) (M02 ficha 6.C.7). |
| Módulo dueño | M02 (legajo y documentos del contrato GAS); M10 (factibilidad, inspección y OT de habilitación). |
| Dirección | Bidireccional. |
| Protocolo / formato | Sin API pública relevada: (a) generación de los formularios en PDF desde plantillas T11 con los datos del contrato y del legajo, y envío por correo o carga manual en el portal de la distribuidora; (b) registro de la respuesta como documento T11 con estado y número de trámite de la distribuidora. Si la distribuidora publica un servicio web, se agrega como adaptador sin cambiar el contrato interno. |
| Datos intercambiados | Número de trámite, datos del suministro e inmueble, matriculado y matrícula (M10 `certifiedInstallers`), potencia de artefactos en kcal/h (M02 sección 7.21), planos y constancias, resultado y observaciones de la distribuidora. |
| Frecuencia | Por trámite (alta, ampliación, rehabilitación tras suspensión con revisión técnica). |
| Credenciales | Usuario del portal de la distribuidora en bóveda (`integrationSecrets`, §7.3), si aplica. |
| Errores y contingencia | Trámite sin respuesta en el plazo configurado ⇒ alerta al responsable y tarea en M09; respuesta "observado" ⇒ el contrato queda en `reactivationPending` o pendiente de alta hasta nueva presentación; nunca se habilita el suministro sin la aprobación registrada. |
| Ola / Prioridad | O7 / Extensión (solo tenants subdistribuidores de gas). |
| Estado investigación | A relevar con la distribuidora del tenant piloto (formularios y canal vigentes). |
| Origen | M02 6.C.7 ("formularios y respuestas de la distribuidora"); T12 parte 1, ficha GAS paso 6. |
| Preguntas | — |

#### FI-INT-115 — Distribuidora de gas: factura de compra de abastecimiento

| Campo | Detalle |
|---|---|
| Propósito | Recibir la factura mensual de la distribuidora de gas (o del proveedor mayorista) al subdistribuidor, para registrarla en M12 como comprobante de proveedor `supplierInvoices.wholesaleSupply` con `kind = gas` (RF-CMP-152), controlarla contra la medición propia de los puntos de compra de M03 y usarla en el balance comprado/facturado (RF-CMP-151). Complementa FI-INT-114, que cubre los formularios técnicos con la misma distribuidora. |
| Módulo dueño | M12 (comprobante y control); M03 (volumen medido en el punto de compra, API-MED-78); M04 (corrección de volumen, DEC-085). |
| Dirección | Entrante. |
| Protocolo / formato | Archivo de la distribuidora (layout en `fileLayouts`, COL-INT-10), comprobante electrónico de ARCA del proveedor o carga manual en M12. |
| Datos intercambiados | Punto de compra, período, m³ medidos y corregidos, poder calorífico o factor de corrección informado, cargos fijos, transporte y distribución, tributos e importes. |
| Frecuencia | Mensual. |
| Credenciales | Usuario del portal de la distribuidora en bóveda (`integrationSecrets`, §7.3), si la descarga es por portal. |
| Errores y contingencia | Archivo repetido ⇒ sin duplicado (idempotencia de RF-CMP-149); factor de corrección distinto del que aplica M04 ⇒ excepción `meteringMismatch` en M12; punto de compra desconocido ⇒ rechazo del renglón. |
| Ola / Prioridad | O8 / Estándar (solo tenants subdistribuidores de gas). |
| Estado investigación | A relevar con la distribuidora del tenant piloto (layout y canal). |
| Origen | M12 RF-CMP-152; HUE-GAS-04; fase 2 de consolidación (G4). |
| Preguntas | — |

## 13. Matriz de integraciones por módulo dueño y ola

### 13.1 Por ola

| Ola | Núcleo | Estándar | Extensión |
|---|---|---|---|
| O0 | 61 (email base), 97 (inicio), 102 | — | — |
| O1 | 96 | 67, 71, 106 | — |
| O2 | — | 63, 64, 65 | — |
| O3 | 79 | 69, 70, 71 (geocodificación), 80, 81, 89 | 72, 82, 83, 113 |
| O4 | 01, 02, 03 (si usa CAEA), 06, 07, 18, 19, 34 | 10 | 08 |
| O5 | 35, 36, 37, 55, 60 | 32, 38, 39, 40, 42, 43, 44, 45, 56, 57, 108 | 41, 54, 107 (cobrador) |
| O6 | — | 90 (CRM) | — |
| O7 | 24, 77 | 25, 73, 75 (primer adaptador), 110 | 26, 27, 28, 29, 76, 78, resto de 75, 107 (prepago remoto), 114 (33 pasa a O8) |
| O8 | 33 | 05, 11, 12, 13, 14, 15, 20, 58, 59, 115 | 04, 17, 21, 22, 23, 99 |
| O9 | — | 16 | — |
| O10 | — | 91, 92 | 30, 31, 66, 68, 84–88, 90 (adjuntos), 93, 94, 95, 109, 112 |
| O11 | — | 111 | 46–53 (DEC-015) |
| Según T07/T10 | 97, 105 | 98, 100 | — |
| Reemplazado / descartado | 09, 62, 74, 101, 103, 104 | | |

### 13.2 Por módulo dueño

| Módulo | Fichas |
|---|---|
| T06 INT (transversal) | 01, 90, 91, 96, 102 (transporte) |
| T01 PLA | 102 (almacenamiento), 111 |
| T02 IAM | 67, 68, 64 (OTP) |
| T03 UXD | 69 (componente de mapa) |
| T04 CFG | 17, 71, 106 |
| T07 MIG | 97, 105 |
| T09 COM | 61, 62, 63, 64, 65 |
| T10 BIA | 98, 100 |
| T11 WFL | 89, 95 (digitalización) |
| M01 PER | 06, 07, 08, 09, 70, 71 (domicilios), 110, 113 |
| M02 CAT | 114 (legajo y documentos del contrato GAS) |
| M03 MED | 73, 74, 75, 76, 77, 78, 84 (consumo), 107 (prepago remoto) |
| M05 FAC | 02 (emisión), 34 (impresión), 85, 108 |
| M06 FIS | 02, 03, 04, 05, 10, 13, 14, 15, 18–29, 32, 33 (con M12) |
| M07 COB | 32, 34–57, 92, 93, 107 |
| M08 MOR | 110 (bloqueo de corte) |
| M09 CRM | 66, 94 |
| M10 TEC | 72, 79–87, 109, 112, 114 (factibilidad e inspección de gas) |
| M11 VEN | 04, 92, 95 |
| M12 CMP | 06, 11, 12, 33 (factura mayorista de energía), 115 (factura de compra de gas) |
| M14 TES | 54, 58, 59, 60 |
| M15 CON | 99 |
| M16 SUE | 16, 59 (sueldos) |
| M17 INS | 30, 31 |
| M18 SOC | 32 (Banco de Sangre), 88 |
| M19 POR | 37, 101 |

**Resumen:** 115 fichas — 109 vigentes (FI-INT-114 agregada por la ficha GAS de T12 y FI-INT-115 por la factura de compra de gas de M12; 4 de ellas se especifican en T07 o T10: 97, 98, 100, 105) y 6 reemplazadas o descartadas (09, 62, 74, 101, 103, 104).

**Olas ajustadas por decisiones vigentes:** las pasarelas secundarias 46–53 pasan a O11 (DEC-015); MikroTik, Radius y SmartOLT quedan en O3 (DEC-042); los extractos (60) pasan a O5 (DEC-059) e Interbanking (58, 59) queda en O8; la IA (90) pasa a O6 y queda apagada hasta que el tenant la acepte (DEC-056); Georef geocodifica y Google queda para mapa y autocompletado (DEC-046; FI-INT-70/71); los sueldos quedan con importación en O8 y liquidación propia en O9 (DEC-058; FI-INT-16, 59).

## 14. Parámetros

Los parámetros se gestionan con el versionado de T04 (vigencia y auditoría). Los de conexión viven en `integrationConnections.settings` y se validan contra el esquema del conector; los de alcance general del tenant, en T04. La columna "V2" indica el parámetro de ProCoop que reemplazan (T04b).

| PRM-ID | Nombre | Alcance | Default | Origen V2 | Uso |
|---|---|---|---|---|---|
| PRM-INT-001 | `integrations.enabled` | tenant | sí | — | Interruptor general (plataforma puede suspender). |
| PRM-INT-002 | `retry.maxAttempts` | conector/categoría | 5 (pagos 8, mensajería 6) | — | RF-INT-034. |
| PRM-INT-003 | `retry.baseDelayMs` / `retry.factor` | conector | 2.000 ms / 2 | — | Backoff exponencial con jitter. |
| PRM-INT-004 | `retry.maxDelayMs` | conector | 15 min | — | Tope del backoff. |
| PRM-INT-005 | `token.renewMarginSec` | conector | 600 s (WSAA 30 min) | — | RN-INT-013. |
| PRM-INT-006 | `certificate.alertDays` | tenant | 30, 14, 7, 3, 1 | 2925 | RN-INT-021. |
| PRM-INT-007 | `arca.wsfe.timeoutSec` | conexión | 90 | 2071–2073 (configuración WS) | RN-INT-025. |
| PRM-INT-008 | `arca.wsfe.batchSize` | conexión | por request: el que devuelve `FECompTotXRequest` [VERIFICAR] valor vigente; por lote 5.000 | 2712 | FI-INT-02. |
| PRM-INT-009 | `credential.rotationGraceHours` | conexión | 24 h | — | Convivencia de credencial vieja y nueva. |
| PRM-INT-010 | `log.bodyRetentionMonths` | plataforma/tenant | 13 | — | PA-INT-15. |
| PRM-INT-011 | `log.metadataRetentionYears` | plataforma | 10 | — | PA-INT-15. |
| PRM-INT-012 | `uncertain.maxChecks` | conector | 10 | — | Tope de reconsultas antes de bandeja manual. |
| PRM-INT-013 | `health.intervalMin` | conector | 5 | — | JOB-INT-08. |
| PRM-INT-014 | `contingency.suggestAfterMin` | conector | fiscal 30, pagos 15 | — | RF-INT-074. |
| PRM-INT-015 | `circuit.failureThreshold` / `circuit.windowSec` / `circuit.halfOpenAfterSec` | conector | 50 % en 60 s con ≥ 20 llamadas / 120 s | — | RF-INT-039. |
| PRM-INT-016 | `concurrency.perConnection` | conector | 4 | — | Aislamiento de carga. |
| PRM-INT-017 | `rateLimit.perMinute` | conector | según proveedor | — | Token bucket. |
| PRM-INT-018 | `arca.caea.enabled` | conexión | no | — | FI-INT-03; PA-INT-04. |
| PRM-INT-019 | `arca.cuitRepresentado` | conexión | CUIT del tenant | — | RN-INT-023. |
| PRM-INT-020 | `webhook.requireRecheck` | conector | sí (no desactivable en pagos) | — | RN-INT-002. |
| PRM-INT-021 | `payment.reuseLinkMinutes` | conexión | 10 | — | RN-INT-004. |
| PRM-INT-022 | `reconciliation.windowDays` | conexión | 4 | — | RN-INT-006. |
| PRM-INT-023 | `qr.pollingMaxMinutes` | conexión | 10 | — | RN-INT-007. |
| PRM-INT-024 | `paymentIntent.ttlSec` | conexión/tipo | prepaga 600; link 72 h | 2496 [VERIFICAR] | RN-INT-033. |
| PRM-INT-025 | `pending.recoveryWindowMin` / `pending.sweepHours` | tenant | 40 / 4, 11, 16, 23 h | — | RN-INT-036. |
| PRM-INT-026 | `alerts.extraEmails` | tenant | vacío | 3025 | RN-INT-063. |
| PRM-INT-027 | `siro.convenio` / `siro.prefixZero` | conexión | — / no (LAG: sí) | 2492–2495, 2500, 2804, 2805 | FI-INT-36 (valores no secretos; las claves de 2492–2495 van a bóveda). |
| PRM-INT-028 | `siro.applyMode` | conexión | integrado | 2807 (LAG = 0) | FI-INT-36. |
| PRM-INT-029 | `siro.waitBeforeQuerySec` | — | — | 2776 | **Descartado** (RN-INT-008). |
| PRM-INT-030 | `email.batchSize` | conexión | 50 | 404 | RN-INT-014. |
| PRM-INT-031 | `email.batchIntervalSec` | conexión | 60 | 461 | RN-INT-014. |
| PRM-INT-032 | `email.failoverConnectionId` | tenant | vacío | — | RN-INT-018. |
| PRM-INT-033 | `sms.batchSize` | conexión | 50 | 2696, 2693 | RN-INT-026. |
| PRM-INT-034 | `whatsapp.delayBetweenMessagesMs` | conexión | según proveedor | 2872 (+2870, 2873, 2874, 3105) | RN-INT-027. |
| PRM-INT-035 | `tls.allowInsecure` | — | — | 3160 | **Descartado** (RF-INT-080). |
| PRM-INT-036 | `maps.monthlyQuota` | tenant | según plan | 2251 | FI-INT-69. |
| PRM-INT-037 | `fiscal.fceMinAmount` | tenant (T04/M06) | según normativa | 2515 | FI-INT-05 (dueño M06; se cita). |
| PRM-INT-038 | `cash.waitCaeSec` | tenant (M07) | 30 | 727, 726 | FI-INT-02 (espera de CAE en caja). |
| PRM-INT-039 | `debit.cbu.presentationDays` | conexión | según banco | 2005–2007, 2014, 2209, 3064 [VERIFICAR] | FI-INT-56. |
| PRM-INT-040 | `debit.card.cutoffDay` | conexión | 19 | 2779 | RN-INT-028. |
| PRM-INT-041 | `payment.enabledMethods` / `payment.maxInstallments` | conexión | todos / 1 | MEDIOS, 2743, 2720 | RN-INT-061. |
| PRM-INT-042 | `pagos360.reportHours` | conexión | 6, 14, 22 | 2553–2555, 3139, 2579 [VERIFICAR] | FI-INT-43. |
| PRM-INT-043 | `interbanking.accounts` | conexión | — | 2262, 2573 | FI-INT-58/59. |
| PRM-INT-044 | `iibb.padronSource` | tenant (M06) | archivo | 901–914 [VERIFICAR] | FI-INT-18/22. |
| PRM-INT-045 | `redlink.exportLayout` / `redlink.importLayout` | conexión | — (LAG: 159 / 264) | 2497, 2082 | FI-INT-35. |
| PRM-INT-046 | `telemetry.readingCron` | conexión | diario 02:00 | 2336, 2504, 2594, 3116 [VERIFICAR] | FI-INT-75. |
| PRM-INT-047 | `prepaid.vendorSystem` | conexión | — | 2256–2260, 2603, 2728 [VERIFICAR] | FI-INT-77. |
| PRM-INT-048 | `isp.provisioningSystem` | conexión | — | 737, 2408, 2748, 2823 [VERIFICAR] | FI-INT-79–83. |
| PRM-INT-049 | `ai.enabled` / `ai.redactPii` / `ai.monthlyTokenQuota` | tenant | no / sí / según plan | 3199, 2981 [VERIFICAR] | FI-INT-90; PA-INT-08. |
| PRM-INT-050 | `agent.heartbeatSec` / `agent.offlineAfterSec` | plataforma | 30 / 120 | — | FI-INT-91. |
| PRM-INT-051 | `files.ftpAllowed` | conexión | no | — | RF-INT-065. |
| PRM-INT-052 | `messaging.quietHours` | tenant (T09) | 21–8 h | 2990, 2993 [VERIFICAR] | T09 decide; T06 respeta la ventana en entregas diferidas. |
| PRM-INT-053 | `integrations.legacyParams` | — | — | 55, 68, 2027–2029, 2425, 2645, 2774, 2789, 2831, 2931, 2996, 3034, 3035, 3048, 3096, 3114, 2351, 2352, 2357, 2752 | Parámetros de integración de V2 relevados en T04b cuyo destino es una conexión concreta: T07 los mapea a `integrationConnections.settings` o los descarta, conexión por conexión. [VERIFICAR] semántica individual en T04b. |
| PRM-INT-054 | `geo.googleGeocodingFallback` | tenant | no | — | FI-INT-70/71: habilita Google como respaldo de Georef (DEC-046); con "no", solo Georef o ubicación manual. |

**Parámetros que T06 lee pero no posee (sin clave duplicada, CTR-INT-27):** el día de corte del débito con tarjeta (PRM-INT-040) toma su valor de `cob.ente.pagos360.debito.diaCorteMesSiguiente` (PRM-COB-P3-070, M07). Los medios y tarjetas habilitados (PRM-INT-041) salen de PRM-COB-P3-083 y de las filas `cob.ente.*.mediosPago` de M07. El intervalo entre mensajes de WhatsApp (PRM-INT-034) es el límite técnico del conector; su valor inicial migra de PRM-COM-P4-004 (T09), y si los dos difieren, se aplica el más restrictivo. Los parámetros "Reemplazado" de T04b parte 3 que son URLs de retorno y de notificación (902/903/907, 2494/2495, 2554/2555, 2795/2796, 2881–2883, 2958–2960, 3078/3079, 3139, 2501) **no** se configuran: la plataforma los calcula con la ruta de RF-INT-053 (CTR-INT-24).

Ningún parámetro contiene secretos: los valores sensibles que ProCoop guardaba en parámetros (claves de SIRO, Pagos360, mapas, SMTP) pasan a la bóveda y **se regeneran** (RF-INT-023).

## 15. Indicadores y reportes

| Indicador / reporte | Definición | Audiencia | Origen |
|---|---|---|---|
| Disponibilidad por conexión | % de health checks OK en el período | Tenant, plataforma | RF-INT-070 |
| Tasa de error por conector | Operaciones `failed` / total, por categoría de error | Plataforma | RF-INT-035 |
| Latencia p50/p95 | Por operación y proveedor | Plataforma (T08) | RF-INT-073 |
| Backlog | Operaciones `pending`/`retrying`/`uncertain` y antigüedad | Tenant, plataforma | RF-INT-070 |
| Inciertos abiertos | Cantidad y antigüedad; meta 0 al cierre del día | Tenant | RF-INT-038 |
| Pendientes de CAE | Comprobantes sin CAE por punto de venta | M05/M06 | FI-INT-02 |
| CAEA por informar | Comprobantes con CAEA no informados y días al vencimiento | M06 | FI-INT-03 |
| Cobranza por canal | Importe y cantidad por red/pasarela, comisión y neto | M07, M14 | RF-INT-069 |
| Links/intenciones sin pago | % de intenciones vencidas (LAG: 38 %) | M07, M19 | RN-INT-033 |
| Diferencias de conciliación | Partidas abiertas por conexión y antigüedad | M07, M14 | RF-INT-067 |
| Rendiciones no recibidas | Archivos esperados no llegados | M07 | RF-INT-063 |
| Rechazos de débito | Por motivo y banco | M07 | FI-INT-56/57 |
| Entregabilidad de mensajes | Enviados, entregados, rebotados, leídos por canal | T09 | RF-INT-085 |
| Vencimientos | Certificados y credenciales por vencer en 30 días | Tenant, plataforma | RF-INT-025 |
| Contingencias | Cantidad, duración y operaciones afectadas | Tenant, plataforma | RF-INT-074 |
| Consumo por tenant | Mensajes, consultas de mapas, tokens IA, consultas ARCA | Plataforma (facturación) | RF-INT-013 |
| Comandos remotos | Cortes/reconexiones enviados, confirmados, inciertos | M08, M10 | RN-INT-065 |
| Agentes locales | En línea/fuera de línea por sucursal | Tenant | FI-INT-91 |
| Accesos a secretos | Descifrados por secreto, proceso y usuario | Seguridad | RF-INT-020 |

Los reportes se construyen con el motor de T10 sobre las colecciones de la sección 7; el tablero operativo es `PAN-INT-04`.

## 16. Casos de uso

### 16.1 Casos de uso de la BASE en los que T06 participa

| CU | Nombre | Rol de T06 |
|---|---|---|
| CU-13 (BASE §13) | Confirmar un pago online con comisión | Recibe el webhook, reconsulta, deduplica por id externo, emite `int.payment.confirmed` con bruto ARS 8.000, comisión ARS 160 y neto ARS 7.840 (ficticio); M07 imputa. |
| CU-31 (BASE §31) | Importar una rendición de un ente | Motor de archivos: hash, layout, vista previa, validaciones (RF-INT-066), aplicación idempotente; reproceso sin duplicar. |
| CU-API-01 (BASE §59) | Tercero consulta deuda por API | Se especifica en T10; T06 aporta idempotencia y `externalReferences`. |

### 16.2 Casos de uso nuevos

#### CU-INT-01 — Configurar y activar una conexión

- **Actor:** responsable de integraciones del tenant (`int.conexiones.configurar`, `int.credenciales.gestionar`; aprobador con `int.modo.cambiar`).
- **Precondición:** conector habilitado por plataforma y licencia (T01).
- **Flujo:** elige el conector del catálogo → completa configuración no secreta → carga secretos (solo escritura) → elige modo `test` → ejecuta prueba de conexión → resultado OK → solicita pasar a `production` → un segundo usuario aprueba → prueba de conexión en producción → `active`.
- **Excepciones:** prueba falla ⇒ queda `draft` con el error normalizado; un ambiente no productivo intenta `production` ⇒ bloqueo (RF-INT-030).
- **Postcondición:** `int.connection.activated`; auditoría del cambio de modo.

#### CU-INT-02 — Generar y cargar el certificado de ARCA

- **Actor:** administrador fiscal.
- **Flujo:** el sistema genera clave y CSR → el usuario descarga el CSR y lo tramita en ARCA → sube el certificado → el sistema valida módulo, CUIT, vigencia y emisor → el usuario asocia los servicios autorizados → prueba `FEDummy` y obtención de TA.
- **Excepciones:** certificado que no corresponde a la clave ⇒ rechazo; servicio no autorizado en ARCA ⇒ error `auth` con indicación del servicio faltante.

#### CU-INT-03 — Autorizar un lote de facturación con resultado incierto

- **Actor:** sistema (JOB-INT-01/02); supervisor de facturación.
- **Flujo:** M05 aprueba el lote → T06 consulta último autorizado → envía en tandas → una tanda queda sin respuesta (timeout) → la operación pasa a `uncertain` → JOB-INT-02 consulta `FECompUltimoAutorizado` y `FECompConsultar` → los comprobantes autorizados se registran con su CAE y el resto se reenvía.
- **Postcondición:** ningún número duplicado ni salteado; `int.arca.caeObtained` por comprobante.

#### CU-INT-04 — Declarar contingencia fiscal y cerrarla

- **Actor:** supervisor fiscal (`int.contingencias.declarar`).
- **Flujo:** circuito abierto de WSFE por más de PRM-INT-014 min → el sistema sugiere contingencia → el supervisor la declara → la emisión usa CAEA vigente → al recuperarse ARCA, el sistema informa los comprobantes CAEA → conciliación → cierre.
- **Excepciones:** no hay CAEA vigente ⇒ la contingencia es "emisión diferida": los comprobantes quedan `pending` y no se entregan al socio como válidos.

#### CU-INT-05 — Resolver una operación incierta a mano

- **Actor:** operador con `int.operaciones.resolverManual`; aprobador.
- **Flujo:** la operación agotó PRM-INT-012 reconsultas → bandeja → el operador verifica en el portal del proveedor → registra el resultado con evidencia → el aprobador confirma → `manual_resolved` → evento al módulo dueño → la conciliación posterior lo valida.

#### CU-INT-06 — Rotar una credencial comprometida

- **Actor:** administrador de integraciones.
- **Flujo:** regenera la clave en el proveedor → carga el nuevo valor → prueba → período de gracia (PRM-INT-009) → la versión anterior pasa a `revoked`.
- **Postcondición:** `int.credential.rotated`; ningún proceso usa la versión revocada.

#### CU-INT-07 — Recibir un webhook de pago duplicado y fuera de orden

- **Actor:** pasarela.
- **Flujo:** llega "paid" dos veces y luego "pending" → la firma se valida → el inbox deduplica por id de evento → la reconsulta devuelve `paid` → una sola confirmación; el "pending" tardío no retrocede el estado (RN-INT-034).

#### CU-INT-08 — Conciliar cobranzas del día

- **Actor:** sistema (JOB-INT-06); tesorero.
- **Flujo:** descarga el reporte de la pasarela/red → cruza contra confirmaciones locales → genera acta con coincidentes, faltantes locales (pagos "app" sin intención), faltantes externos y diferencias de importe → bandeja de revisión.

#### CU-INT-09 — Enviar un comando de corte remoto

- **Actor:** M08 (orden de corte aprobada).
- **Flujo:** `mor.interruption.approved` (EVT-MOR-12; antes `mor.cut-order.approved`) → T06 envía el comando al MDM/ISP → resultado OK ⇒ `int.meter.commandResult`/`int.network.provisioningResult` → M08 registra.
- **Excepciones:** sin respuesta ⇒ `uncertain` y consulta de estado del equipo; nunca se repite a ciegas; caída ⇒ orden manual en campo.

#### CU-INT-10 — Emparejar un agente local y llamar un turno

- **Actor:** administrador de sucursal; empleado de atención.
- **Flujo:** instala el agente → ingresa el código de un solo uso → el agente queda `online` con sus dispositivos → el empleado llama el turno desde la PWA → el agente muestra el número en la pantalla.

#### CU-INT-11 — Importar el padrón provincial de IIBB

- **Actor:** analista fiscal.
- **Flujo:** carga el archivo (o lo trae JOB-INT-26) → vista previa con totales → confirma → M06 aplica la vigencia → el lote de facturación siguiente usa el padrón nuevo.

#### CU-INT-12 — Generar un régimen informativo

- **Actor:** analista fiscal.
- **Flujo:** M06 pide el archivo del período → T06 genera con el layout vigente, totales y hash → el analista lo descarga y lo presenta en ARCA → carga el acuse → estado `accepted`.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Criterios generales

| # | Criterio | Verifica |
|---|---|---|
| CA-INT-01 | Ningún secreto aparece en respuestas de API, logs, bitácora, exportaciones, errores ni trazas (búsqueda de patrones en pruebas automatizadas). | RF-INT-016…020, RF-INT-083 |
| CA-INT-02 | Un usuario sin `int.conexiones.configurar` recibe 403 al crear/editar conexiones y no ve el menú. | Permisos negativos |
| CA-INT-03 | Un usuario sin `int.credenciales.gestionar` no puede cargar ni rotar secretos aunque edite la conexión; sin `int.modo.cambiar` no puede pasar una conexión a `production`. | Permisos negativos |
| CA-INT-04 | Un usuario de soporte de plataforma ve el tablero de salud pero nunca valores de secretos ni cuerpos con datos personales sin acceso temporal aprobado (T01). | Permisos negativos |
| CA-INT-05 | Un webhook firmado para el tenant A con el `endpointId` del tenant B es rechazado; las operaciones, mensajes y alertas de A nunca aparecen en consultas de B. | Aislamiento de tenant |
| CA-INT-06 | Un worker que procesa un trabajo del tenant A no puede descifrar secretos del tenant B (clave de datos por tenant). | Aislamiento |
| CA-INT-07 | 503 del proveedor ⇒ reintento con backoff; 400 de validación ⇒ sin reintento; 401 ⇒ conexión `blocked_credential`. | Reintentos |
| CA-INT-08 | Timeout en una operación no idempotente ⇒ `uncertain` y consulta de reconciliación antes de cualquier reintento. | Reintentos |
| CA-INT-09 | El circuito se abre con el umbral y ninguna operación se envía mientras está abierto, salvo el sondeo. | Circuit breaker |
| CA-INT-10 | El mismo archivo de rendición cargado dos veces no duplica pagos; el mismo webhook tres veces produce una confirmación. | Idempotencia |
| CA-INT-11 | La conciliación diaria detecta un pago externo sin intención y lo deja en revisión. | Conciliación |
| CA-INT-12 | Generar un archivo de régimen no lo marca presentado. | RF-INT-064 |
| CA-INT-13 | La caída de Redis no pierde operaciones: al volver, JOB-INT-07 las recupera desde Mongo (outbox). | Recuperación |
| CA-INT-14 | En staging no se puede activar una conexión `production`. | RF-INT-030 |
| CA-INT-15 | Toda pantalla que use una conexión `test` muestra el indicador de modo prueba. | RF-INT-029 |

### 17.2 Escenarios

| ESC | Escenario | Comportamiento esperado de T06 |
|---|---|---|
| ESC-01 (AGR) | Pago excedente de un hermano (ARS 15.000 contra deuda de ARS 13.000) | T06 confirma el pago tal como lo informa el proveedor (ARS 15.000) con su referencia; la aplicación de ARS 13.000 y el saldo de ARS 2.000 son de M07. |
| ESC-02 (AGR) | Corrección después de emitir | T06 no reenvía a ARCA el comprobante original; la ND/NC de ARS 3.000 es una operación fiscal nueva con su propia idempotencia. |
| ESC-03 (AGR) | Instalación offline en conflicto | La firma capturada se envía al proveedor de firma una sola vez (clave por `clientMutationId`); el aprovisionamiento no se ejecuta dos veces. |
| ESC-04 (AGR) | Restauración con operaciones externas posteriores a la copia | Tras restaurar, JOB-INT-07 y la conciliación consultan a ARCA y a las pasarelas por identificadores externos y reconstruyen los resultados: no se pide un CAE nuevo para un comprobante ya autorizado ni se cobra dos veces. |
| ESC-05 (AGR) | Cambio de condiciones con lote parcialmente procesado | Las tandas ya autorizadas no se reenvían; las pendientes usan el contenido que M05 entregue con su versión. |
| ESC-INT-01 | ARCA caída 3 horas el día de facturación masiva | Circuito abierto, sugerencia de contingencia, CAEA si está habilitado; si no, lote `pending` y aviso; al volver, emisión ordenada sin duplicados. |
| ESC-INT-02 | Certificado vence un sábado | Alertas desde 30 días; al vencer, conexión bloqueada y cola pausada; el lunes se carga el nuevo y la cola se reanuda sin rechazos. |
| ESC-INT-03 | SIRO devuelve rendición con una línea ya aplicada por webhook | Deduplicación por id externo; la línea queda `duplicate`, no se imputa dos veces. |
| ESC-INT-04 | WhatsApp rechaza la plantilla | Mensajes `failed` con causa `validation`; T09 decide alternativa; T06 no reintenta. |
| ESC-INT-05 | Comando de reconexión sin respuesta | `uncertain` ⇒ lectura de estado ⇒ si ya está reconectado se marca OK sin reenviar. |
| ESC-INT-06 | Agente local fuera de línea en caja | Impresión cae a PDF; alerta a la sucursal; los comandos expirados no se ejecutan al reconectar. |
| ESC-INT-07 | Token de prueba en un commit | El escaneo de secretos de CI bloquea el merge. |

## 18. Datos de precarga de demostración (ficticios)

Tenant demo **"Cooperativa de Servicios Los Aromos Ltda."** (datos ficticios; ningún dato de la DEMO de ProCoop):

| Objeto | Datos |
|---|---|
| Conexión ARCA | Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. |
| Conexión SIRO | Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`. |
| Conexión Red Link | Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). |
| Conexión Mercado Pago | Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). |
| Email | Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. |
| WhatsApp | Simulador con 2 plantillas aprobadas y 1 rechazada. |
| Telemedición | Simulador MDM con 10 medidores ficticios, un comando de corte que responde tarde (incierto). |
| Agente local | Un agente emparejado "Sucursal Centro" con impresora térmica simulada y pantalla de turnero. |
| Operaciones | 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). |
| Alertas | Certificado que vence en 7 días; circuito abierto en "SMS demo". |
| Contingencia | Una contingencia fiscal cerrada con su acta de conciliación. |

Los secretos de la demo son valores aleatorios generados en la instalación; nunca se versionan.

## 19. Migración desde ProCoop

| Origen ProCoop | Destino | Transformación | Validación / conciliación |
|---|---|---|---|
| `PAGOS360` (configuración por pasarela) | `integrationConnections` | Una conexión por pasarela con datos no secretos; **los secretos no se migran** (RF-INT-023): se marcan "pendiente de credencial". | Lista de conexiones esperadas por tenant vs. creadas. |
| Parámetros de integración (T04b; sección 14) | `integrationConnections.settings` / T04 | Según la columna V2 de la sección 14; valores sensibles descartados. | Checklist parámetro por parámetro. |
| `BANCOS` (entes, exportadores e importadores) | `integrationConnections` + `fileLayouts` | Exportador/importador ⇒ layout del catálogo (LAG: 159, 264, 140, 271); cada layout de exportación de deuda se carga con su `dueDateCapacity`, derivada de los vencimientos que el exportador de ProCoop publica (DEC-106). | Archivo generado por CoopApps idéntico al de ProCoop para el mismo universo (paralelo). |
| `PAGOS360_PAGOS` (solicitudes y pagos de todas las pasarelas) | `externalReferences` + histórico de `integrationOperations` (solo lectura) | Id externo (`ID_360`, `ID_SIRO`, `ID_MERCADO_PAGO`) ⇒ `externalReferences`; estado ⇒ operación `succeeded`/`expired`. | Total de pagos y montos por pasarela coincide con ProCoop (LAG: 128.776 solicitudes SIRO). |
| `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP` | M06/M05 (comprobantes) + `externalReferences` (CAE) | CAE y vencimiento por comprobante. | Muestreo con `FECompConsultar`. |
| `CESPAFIP` | M06 (CAEA y CESP separados) | Se separa por tipo (CTR-INT-19). | Rangos sin superposición. |
| `PTOVENTA` | M06 puntos de venta + conexión ARCA | Pausado ⇒ estado del punto de venta. | `FEParamGetPtosVenta`. |
| `AUDIT_MAIL` | `integrationMessages` (histórico, 13 meses) | Estados 1/4/2/3 ⇒ `queued/sending/sent/failed`. | Conteo por mes. |
| `AUDITORIA_TELEMEDICION`, `TELEMED_COMM` | `integrationMessages` (histórico) | Solo metadatos. | — |
| `RESBAN_MOVINT` | M14 movimientos | Correlativo ⇒ clave de deduplicación. | Saldos por cuenta. |
| `IIBB_LUA`, `CVPIIBB`, `EMPAFIP` | M06 | Vigencias. | Conteos. |
| `WS_KEYS` | — | **No se migra**; T10 emite tokens nuevos. | Lista de terceros a re-registrar. |
| `AUDIT_IA` | `aiUsageLogs` (histórico) | Opcional. | — |
| `IVR` | T09 `channelSettings` (canal `ivr_export`); conexión `ivr` (FI-INT-66) solo si el tenant la habilita | Configuración de la exportación (DEC-104). | — |
| Certificado ARCA (archivo PFX) | `integrationCertificates` | Se recomienda **no** reutilizar: generar CSR nuevo (PA-INT-03). | TA obtenido en homologación y producción. |
| Archivos en carpetas locales/FTP | Almacenamiento de objetos | Solo los vinculados a documentos migrados (T07). | Hash. |
| Identificador de pago de ProCoop (código de barras, clave de Red Link y de SIRO en facturas ya emitidas) | `externalReferences` (tipo `legacyPaymentKey`) | Se emite un identificador nuevo y autocontenido, y la rendición sigue resolviendo la clave de ProCoop hasta que venzan sus facturas (DEC-050). | Rendiciones del paralelo: 100 % de líneas con clave vieja resueltas o en revisión. |

**Lección de seguridad para el corte:** las fuentes de ProCoop contienen credenciales en código y en parámetros (RN-10 §13; RN-13 §17). Antes de poner una conexión en producción se exige regenerar cada credencial en el proveedor y revocar las anteriores; el checklist de T07 no permite el by-pass sin esa rotación.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-INT-01 | FIC 4.2 vs. RN-12 §3 / RN-13 §4 | FIC describe SIRO por archivos; RN-12/13 muestran uso de la API (128.776 solicitudes). | Se soportan ambos canales (FI-INT-36 y 37); PA-INT-11. | RN (dato real) completa FIC; mismo nivel ⇒ ambos. |
| CTR-INT-02 | BASE §54 / O5 vs. RN-12 §3 | La BASE prioriza Pagos360; LAG no lo usa (credenciales vacías). | Pagos360 queda Estándar en O5 (lo pide la BASE para el mercado) y no bloquea a la cooperativa piloto. | BASE > RN. |
| CTR-INT-03 | FIC 5.2 vs. RN-13 §6 | "Macro" como botón propio vs. "Click de Pago (PlusPagos)". | Se nombra según RN-13 (producto real). | Dato técnico verificado. |
| CTR-INT-04 | FIC 10.2 vs. FIC 17 | "Sensa" aparece como telemedición y como TV. | Dos adaptadores distintos (FI-INT-75 y 86) hasta confirmar. | Mismo nivel ⇒ [VERIFICAR]. |
| CTR-INT-05 | RN-03 §5 vs. FIC 2.2 | ProCoop usa PUC N3; FIC propone A13/A5. | A13 + A5 (FI-INT-06/07); PUC N3 reemplazado. | FIC/RN mismo nivel; se adopta lo vigente en ARCA. |
| CTR-INT-06 | RN-13 §16 vs. FIC 11.1 vs. DFA §30 | Interbanking como API de movimientos, como archivos de pago y como "transferencias". | Dos fichas: API (58) y archivos de pago (59). | Complementarias. |
| CTR-INT-07 | BASE §59 vs. FIC 14.3 | La BASE limita la API de terceros a consulta; FIC releva escritura de pagos (Integra). | La escritura de pagos por terceros es de T10 con alcance explícito; T06 no expone API pública. | BASE > FIC. |
| CTR-INT-08 | AGR-021 vs. RN-10 §3 | AGR exige webhook confiable; ProCoop recibe avisos por Firebase/Integra. | Webhook directo + inbox + reconsulta + polling de respaldo. | AGR > RN. |
| CTR-INT-09 | FIC 13.2 vs. RN-10 §5 | Trii (BSP) vs. Meta Cloud API directo. | Meta Cloud API + adaptador BSP opcional (PA-INT-05). | Mismo nivel ⇒ PA. |
| CTR-INT-10 | FIC 13.3 vs. RN-10 §5 | SMS por proveedor HTTP vs. módems/proveedor local. | Proveedor HTTP con lotes; sin módems (PA-INT-06). | DEC-001 (SaaS). |
| CTR-INT-11 | DEC-007 vs. RN-10 §3 | Todo ProCoop en alcance vs. app CoopOnline con MySQL propio. | La función se mantiene (M19), la arquitectura de réplica se reemplaza. | DEC > RN. |
| CTR-INT-12 | DEC-003 vs. RN-10 §3 | Monolito modular vs. portal sincronizado por réplica. | Portal sobre la misma API. | DEC > RN. |
| CTR-INT-13 | FIC 13.1 vs. RN-10 §2 | Dominio propio del tenant vs. SES compartido del proveedor. | Dominio verificado por tenant (PA-INT-07). | FIC (propuesta) + BASE (marca por tenant) > RN. |
| CTR-INT-14 | AGR-035 vs. RN-13 §2.1 | AGR exige ambientes de prueba; ProCoop no homologa (prefijo "TEST"). | Modo explícito por conexión y simulador. | AGR > RN. |
| CTR-INT-15 | DEC-007 vs. FIC 19 (prioridad C) | Hardware en alcance vs. prioridad baja. | En alcance, ola O10 (impresión de caja puede adelantarse). | DEC > FIC. |
| CTR-INT-16 | FIC 1 (prioridades A/B/C) vs. olas de la guía | Dos esquemas de prioridad. | Se usa Núcleo/Estándar/Extensión + ola; A/B/C queda como dato de origen. | Guía (BASE) > FIC. |
| CTR-INT-17 | RN-10 §3.4 vs. RN-13 §2.3 | "Importes no coinciden" bloquea la imputación vs. pago real recibido. | T06 confirma lo que informa el proveedor; M07 decide y deriva diferencias. | Frontera de módulos (DEC-003). |
| CTR-INT-18 | FIC 9.3 vs. CAT | EPEC como proveedor de energía vs. referencias ambiguas. | Ficha FI-INT-33 Extensión, a validar. **Resuelta (fase 2):** es la factura mayorista de compra que M12 registra en `supplierInvoices.wholesaleSupply` (RF-CMP-149); FI-INT-33 pasa a O8 Núcleo y el gas se cubre con FI-INT-115. | Mismo nivel ⇒ [VERIFICAR]; resuelto por el anexo dueño (M12). |
| CTR-INT-19 | CAT `CESPAFIP` vs. RN-03 §4 | Una tabla con CESP y CAEA a la vez. | Se separan en la migración y en el modelo de M06. | RN (comportamiento) + diseño. |
| CTR-INT-20 | FIC 16 vs. hallazgo propio | Google como única fuente geográfica vs. Georef oficial. | Georef para tablas maestras, normalización y geocodificación; Google para mapa y autocompletado, con geocodificación de respaldo opcional (PRM-INT-054). | DEC-046 > FIC. |
| CTR-INT-21 | FIC 6 vs. RN-13 §3.7, §17 | Débito con tarjeta guarda números completos en ProCoop. | Tokenización/identificador de adherente; nunca PAN en claro (RF-INT-081). **Precisado por DEC-091**: tampoco PAN cifrado ni en memoria; procesadoras por archivo solo con número de adherente; los PAN de ProCoop no se migran. | BASE §59 (seguridad) > RN. |
| CTR-INT-22 | DFA §30 vs. RN-13 §16.1–16.4 | DFA habla de "transferencias" por Interbanking; en el código la API solo consulta saldos y movimientos y los pagos salen como archivos (§16.4). | Las transferencias son archivos generados por CoopApps y firmados por la cooperativa en Interbanking (FI-INT-59); no se ejecutan pagos por API. | Mismo nivel ⇒ prevalece el dato verificado en código. |
| CTR-INT-23 | DEC-015 vs. M07 §13 y versión previa de este anexo | M07 ubica Macro y NaranjaX en O7 y otras pasarelas en O10; este anexo las tenía en O5 como Extensión. | Pagos360, Mercado Pago, SIRO y Red Link en O5; Macro, NaranjaX, PayFun, Pagos TIC, SiPago, Helipagos, ProntoPago y ProvinciaNet como Extensión bajo demanda (criterio de M07 RF-COB-132): se construyen en la ola en que un tenant las pida o las requiera para su corte de migración (T07, DEC-068); sin pedido, O11 (FI-INT-46…53). DEBIN (54) y el QR interoperable (45) no forman parte de esa lista y conservan su ola. | DEC > anexos. |
| CTR-INT-24 | T04b parte 3 vs. RF-INT-053 | T04b nombra los webhooks reemplazados como `/api/v1/ext/webhooks/<proveedor>/<tenantSlug>`; T06 usa `/api/public/{tenantSlug}/webhooks/{endpointKey}`. | Rige la ruta de T06 con `endpointKey` aleatorio por conexión: no expone el proveedor y es rotable. La ruta de T04b se lee como "URL calculada por la plataforma". | T06 (dueño del contrato de webhooks) > T04b (catálogo de parámetros). |
| CTR-INT-25 | DEC-059 vs. FIC 11.2 y versión previa de FI-INT-60 | Extractos bancarios en O8 vs. tesorería con extractos y conciliación en O5. | FI-INT-60 en O5 / Núcleo; Interbanking (58, 59) en O8. | DEC > FIC. |
| CTR-INT-26 | DEC-056 / DEC-020 vs. versión previa de FI-INT-90 | IA disponible desde O2 vs. IA de atención en O6, adjuntos en O10 y apagada hasta que el tenant la acepte. | FI-INT-90 en O6 (CRM) y O10 (adjuntos); clave de plataforma con opción de clave propia; `ai.enabled` en "no" por defecto (PRM-INT-049). | DEC > anexo. |
| CTR-INT-27 | T04b partes 3 y 4 vs. §14 | El día de corte del débito, los medios de pago habilitados y el intervalo de WhatsApp aparecen como parámetros de M07/T09 y de T06. | Una sola clave, la del dueño funcional (M07 o T09); T06 la lee. Solo el límite técnico del conector es propio de T06, y entre los dos valores se aplica el más restrictivo. | Regla de frontera (§2.3): el dueño del dato posee el parámetro. |
| CTR-INT-28 | FI-INT-66 (IVR como integración bidireccional "Soportado por ProCoop") vs. T09 RF-COM-148 (`ivr_export`), M08 RF-MOR-089 (aviso telefónico) y FIC 13.4 (`clsIVR` solo genera archivos) | Tres anexos trataban el IVR de forma distinta y la ficha atribuía a ProCoop un IVR que no tiene. | Tratamiento único: `ivr_export` de T09 es el mecanismo base; FI-INT-66 es la conexión opcional con un discador o IVR externo que consume esa exportación y devuelve resultados; el aviso telefónico de M08 se sirve por una u otra; no se define canal de voz propio. | DEC-104 |

## 21. Preguntas abiertas

### 21.0 Estado de las preguntas según las decisiones vigentes

Según DEC-047, solo quedan abiertas las preguntas de alto impacto. Las resueltas por una DEC se aplican tal como dice la decisión. Las de detalle se toman con su opción recomendada (**Asumida (recomendada)**) y se pueden revisar sin bloquear la ola.

| PA | Estado | Resolución que rige |
|---|---|---|
| PA-INT-01 | Resuelta en parte por DEC-020 | Mapas e IA: plataforma con clave propia opcional. Para fiscal, bancos y pasarelas se asume A (credenciales del tenant). |
| PA-INT-02 | Respondida (DEC-074) | Cifrado por sobre propio en MongoDB con clave maestra en AWS KMS, detrás de una interfaz agnóstica (§7.3). |
| PA-INT-03 | Resuelta por DEC-053 | Clave y CSR generados por la plataforma (clave en bóveda); se admite PFX existente. |
| PA-INT-04 | Resuelta por DEC-018 y DEC-038 | Masiva: se emite y encola, y solo se pausa la autorización; CAEA si está habilitado. Mostrador: espera del CAE con tope y después CAEA o comprobante pendiente no entregable como fiscal. |
| PA-INT-05 | Resuelta por DEC-055 | Meta Cloud API por defecto, con adaptador para Trii. |
| PA-INT-06 | Asumida (recomendada) | A. |
| PA-INT-07 | Asumida (recomendada) | A. |
| PA-INT-08 | Resuelta en parte por DEC-056 y DEC-020 | Ola O6/O10 y apagada hasta que el tenant la acepte; clave de plataforma. Política de datos: se asume A. |
| PA-INT-09 | Asumida (recomendada) | A. |
| PA-INT-10 | Asumida (recomendada) | A. |
| PA-INT-11 | Abierta (alto impacto: cooperativa piloto, O5) | — |
| PA-INT-12 | Asumida (recomendada) | A. |
| PA-INT-13 | Resuelta por DEC-015 | Pagos360, Mercado Pago, SIRO y Red Link en O5; el resto en O11 como Extensión. |
| PA-INT-14 | Abierta (alto impacto: O7) | — |
| PA-INT-15 | Asumida (recomendada) | A. |
| PA-INT-16 | Asumida (recomendada) | A. |
| PA-INT-17 | Asumida (recomendada) | A. |
| PA-INT-18 | Asumida (recomendada); ola O8 fijada por DEC-059 | A. |
| PA-INT-19 | Resuelta por DEC-020 y DEC-046 | Clave de plataforma con opción propia; Google para mapa y autocompletado, Georef para geocodificar. |
| PA-INT-20 | Respondida (DEC-067) | Mecanismo federado en O1; CiDi en O2 habilitable por tenant. |
| PA-INT-21 | Asumida (recomendada) | A. |
| PA-INT-22 | Respondida (DEC-078) | Firma electrónica con OTP por defecto; firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9); proveedor elegido antes de O3 detrás de la interfaz propia. |
| PA-INT-23 | Asumida (recomendada) | A. |
| PA-INT-24 | Asumida (recomendada); IIBB según DEC-054 (Córdoba en O4, el resto en O8) | A. |
| PA-INT-25 | Asumida (recomendada) | A. |
| PA-INT-26 | Asumida (DEC-072) | A: `aiUsageLogs.status` toma `ok`, `error` o `blocked`. |

### PA-INT-01 — Modelo de contratación de proveedores

- **Pregunta:** ¿Las cuentas con proveedores externos las contrata cada cooperativa o CoopApps como plataforma?
- **Contexto:** fiscal y pasarelas exigen titularidad del tenant; mensajería, mapas e IA pueden ser compartidas con cuota (RF-INT-013).
- **Opciones:**
  - A) Credenciales propias del tenant para fiscal, bancos y pasarelas; conexiones de plataforma compartidas para email, SMS, mapas e IA, reemplazables por las del tenant **(Recomendada)** — menor fricción de alta y costo trasladable.
  - B) Todo con credenciales del tenant — más trabajo de alta por cooperativa.
  - C) Todo de plataforma — imposible para fiscal y cobros (titularidad).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-INT-010…013; FI-INT-61, 64, 69, 90.

### PA-INT-02 — Bóveda de secretos y KMS

- **Pregunta:** ¿Qué servicio de gestión de claves se usa para la bóveda?
- **Contexto:** RF-INT-014…021 exigen envelope encryption y separación por ambiente.
- **Opciones:**
  - A) Envelope encryption propio en Mongo con clave maestra en un KMS gestionado del proveedor de nube, detrás de una interfaz agnóstica **(Recomendada)** — portable y auditable.
  - B) HashiCorp Vault autogestionado — más operación.
  - C) Clave maestra en variable de entorno — no cumple separación ni rotación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** O0 (bóveda), RF-INT-014…021.
- **Estado:** Respondida (DEC-074): opción A, con clave maestra en AWS KMS detrás de una interfaz agnóstica de proveedor; nunca se transcriben ni registran valores.

### PA-INT-03 — Custodia del certificado ARCA

- **Pregunta:** ¿Dónde se genera la clave privada del certificado de ARCA?
- **Contexto:** ProCoop guarda el PFX sin contraseña en carpeta (RN-03 §2.1).
- **Opciones:**
  - A) Clave y CSR generados en el servidor; la clave nunca sale de la bóveda **(Recomendada)** — sin manipulación de archivos sensibles.
  - B) La cooperativa sube un PFX con contraseña — permitido como alternativa.
  - C) Reutilizar el certificado de ProCoop — se desaconseja (comprometido).
- **Impacto si no se responde:** A con B como alternativa.
- **Bloquea:** RF-INT-024; FI-INT-01; O4.

### PA-INT-04 — CAE o CAEA en facturación masiva

- **Pregunta:** ¿La facturación masiva usa CAE por lotes o CAEA?
- **Contexto:** LAG emite ≈ 12.500 comprobantes/mes; el CAEA obliga a informar después.
- **Opciones:**
  - A) CAE en lotes como modo normal y CAEA solo como contingencia, si el tenant lo habilita **(Recomendada)** — validación inmediata.
  - B) CAEA como modo normal — más rápido, más riesgo de rechazos tardíos.
  - C) Solo CAE, sin contingencia — la caída de ARCA frena la emisión.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-02/03; PRM-INT-018; O4.

### PA-INT-05 — Proveedor de WhatsApp

- **Pregunta:** ¿WhatsApp se integra directo con Meta o mediante un BSP (ej. Trii)?
- **Opciones:**
  - A) Meta Cloud API directo, con adaptador BSP opcional por tenant **(Recomendada)** — menor costo y sin intermediarios.
  - B) Solo BSP — servicios de bandeja ya resueltos, mayor costo.
  - C) Ambos obligatorios — duplicación.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-63; CTR-INT-09; O2.

### PA-INT-06 — Proveedor de SMS

- **Pregunta:** ¿Qué proveedor de SMS usa la plataforma?
- **Contexto:** ProCoop usa un proveedor local con lotes de 50.
- **Opciones:**
  - A) Un agregador local argentino como conexión de plataforma, con interfaz que permita agregar otro (ej. Twilio) por tenant **(Recomendada)** — costo y entregabilidad locales.
  - B) Proveedor global único — más caro por mensaje.
  - C) Sin SMS — perdería OTP y avisos.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-64; O2.

### PA-INT-07 — Proveedor y dominio de email

- **Pregunta:** ¿Cómo se envía el email de cada tenant?
- **Opciones:**
  - A) Proveedor transaccional de plataforma con dominio verificado por tenant (SPF/DKIM/DMARC) y SMTP propio opcional **(Recomendada)**.
  - B) Solo SMTP del tenant — entregabilidad variable.
  - C) Dominio compartido de CoopApps — afecta marca y reputación.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-61; CTR-INT-13; O0–O2.

### PA-INT-08 — Proveedor de IA y datos personales

- **Pregunta:** ¿Con qué proveedor(es) de IA y bajo qué política de datos?
- **Opciones:**
  - A) Abstracción multi-proveedor, redacción de datos personales no necesarios, sin entrenamiento con datos del cliente, activación opt-in por tenant **(Recomendada)**.
  - B) Proveedor único — dependencia.
  - C) Sin IA — se pierde la propuesta de valor de CNX.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-086; FI-INT-90; PRM-INT-049.

### PA-INT-09 — Agente local

- **Pregunta:** ¿Se desarrolla un agente propio para hardware local?
- **Opciones:**
  - A) Agente propio CoopApps (O10), saliente por WebSocket, multiplataforma **(Recomendada)** — reemplaza Agente/Integra con seguridad.
  - B) Solo impresión desde el navegador (PDF) — sin turnero ni periféricos.
  - C) Software de terceros por dispositivo — heterogéneo.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-084; FI-INT-91…95.

### PA-INT-10 — Reconsulta de webhooks

- **Pregunta:** ¿Se exige reconsultar siempre al proveedor antes de dar por confirmado un pago?
- **Opciones:**
  - A) Siempre, sin opción de desactivarlo en pagos **(Recomendada)** — cierra el fraude por aviso falso (RN-INT-009).
  - B) Confiar en webhooks firmados — más rápido, menos seguro.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-INT-020; FI-INT-43…54.

### PA-INT-11 — SIRO por archivo o por API

- **Pregunta:** ¿Qué canal de SIRO se implementa para la cooperativa piloto (la base relevada LAG usa archivo y API)?
- **Opciones:**
  - A) Ambos: archivos para publicación/rendición y API para botón/QR y consulta **(Recomendada)** — refleja el uso real.
  - B) Solo archivos — sin pago online inmediato.
  - C) Solo API — dependencia total del servicio en línea.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-36/37; CTR-INT-01; O5.

### PA-INT-12 — Layouts de archivos

- **Pregunta:** ¿Cómo se definen los formatos de archivos de entes y bancos?
- **Opciones:**
  - A) Layouts declarativos versionados + hooks de código acotados para lo no declarable **(Recomendada)**.
  - B) Un programa por formato — como ProCoop, caro de mantener.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-058…061; FI-INT-35…42, 56, 57.

### PA-INT-13 — Pasarelas en O5

- **Pregunta:** ¿Qué pasarelas se construyen en O5?
- **Opciones:**
  - A) SIRO como Núcleo; Pagos360 y Mercado Pago como Estándar; el resto bajo demanda de un tenant **(Recomendada)**.
  - B) Todas las de ProCoop en O5 — demora la ola.
  - C) Solo SIRO — no cumple la BASE.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-43…54; O5.

### PA-INT-14 — Primer adaptador de telemedición

- **Pregunta:** ¿Con qué sistema de telemedición se empieza?
- **Opciones:**
  - A) El que use la cooperativa piloto de servicios medidos; el resto bajo demanda **(Recomendada)**.
  - B) Los 11 sistemas relevados — esfuerzo alto sin uso confirmado.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-75; O7.

### PA-INT-15 — Retención de la bitácora

- **Pregunta:** ¿Cuánto tiempo se guardan los cuerpos de request/response?
- **Opciones:**
  - A) Cuerpos saneados 13 meses; metadatos 10 años (plazo de conservación contable) **(Recomendada)**.
  - B) Todo 10 años — costo y exposición de datos.
  - C) 90 días — insuficiente para auditorías fiscales.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-INT-010/011; JOB-INT-15.

### PA-INT-16 — Ambientes de prueba de proveedores

- **Pregunta:** ¿Quién tramita las credenciales de homologación (ARCA, pasarelas)?
- **Opciones:**
  - A) GoodApps mantiene cuentas de homologación de plataforma para desarrollo; cada tenant usa las suyas para su prueba previa a producción **(Recomendada)**.
  - B) Solo simuladores — no valida contra el proveedor real.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-028…031.

### PA-INT-17 — Links viejos de CoopOnline

- **Pregunta:** ¿Se redirigen los links del portal viejo (facturas, pagos) al nuevo?
- **Opciones:**
  - A) Redirecciones durante 12 meses desde el corte **(Recomendada)** — no rompe links en facturas impresas.
  - B) Sin redirección — reclamos de socios.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-101; T07.

### PA-INT-18 — Interbanking

- **Pregunta:** ¿Cómo se autentica CoopApps ante Interbanking?
- **Opciones:**
  - A) Aplicación registrada por cada cooperativa con sus credenciales **(Recomendada)**.
  - B) Aplicación de plataforma — requiere convenio de CoopApps con Interbanking.
  - C) Solo archivos — sin automatización.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-58; O8.

### PA-INT-19 — Clave de Google Maps

- **Pregunta:** ¿La clave de mapas es de la plataforma o del tenant?
- **Opciones:**
  - A) Clave de plataforma restringida, con cuota por tenant y opción de clave propia **(Recomendada)**.
  - B) Siempre clave del tenant — fricción de alta.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-69/70; PRM-INT-036.

### PA-INT-20 — CiDi

- **Pregunta:** ¿Se integra CiDi para el portal del socio?
- **Opciones:**
  - A) Sí, como Extensión en O10, si la provincia habilita la integración **(Recomendada)**.
  - B) En O2 junto con el portal — adelanta un trámite externo incierto.
  - C) No integrar.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-68.
- **Estado:** Respondida (DEC-067, pregunta equivalente PA-IAM-02): mecanismo federado en O1; adaptador CiDi en O2 habilitable por tenant, nivel mínimo 2; apagado mientras la provincia no habilite la aplicación.

### PA-INT-21 — Devoluciones por API

- **Pregunta:** ¿Las devoluciones a socios se ejecutan por API de la pasarela?
- **Opciones:**
  - A) Sí, donde el proveedor lo permita, con aprobación de M07 y doble control **(Recomendada)**.
  - B) Siempre manual en el portal del proveedor.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-INT-056; FI-INT-43/44.

### PA-INT-22 — Proveedor de firma

- **Pregunta:** ¿Qué proveedor de firma electrónica/digital se usa?
- **Opciones:**
  - A) Interfaz de firma propia; proveedor concreto a decidir antes de O3 (firma de instalación), evaluando Encustody y alternativas **(Recomendada)**.
  - B) Encustody directamente — continuidad con ProCoop.
  - C) Solo firma en pantalla sin proveedor — menor valor probatorio.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-89; O3.
- **Estado:** Respondida (DEC-078): opción A. Firma electrónica con OTP por defecto (instalación, convenios, trámites); firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9); el proveedor concreto se elige antes de O3 detrás de la interfaz de firma propia.

### PA-INT-23 — IVR

- **Pregunta:** ¿Se integra un IVR?
- **Opciones:**
  - A) Sí, como Extensión en O10 sobre la API interna **(Recomendada)**.
  - B) No integrar.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-66.
- **Alcance aclarado (DEC-104):** la opción A es la conexión opcional con un discador o IVR externo que consume la exportación `ivr_export` de T09 (mecanismo base, O6, siempre disponible) y devuelve resultados; no es un canal de voz propio ni reemplaza la exportación. Con la opción B, los avisos telefónicos se siguen haciendo con la exportación manual.

### PA-INT-24 — Jurisdicciones fuera de Córdoba

- **Pregunta:** ¿En qué ola entran los fiscos y reguladores de otras provincias?
- **Opciones:**
  - A) Motor configurable en O4/O7 con Córdoba; otras jurisdicciones como configuración cuando haya un tenant de esa provincia **(Recomendada)**.
  - B) Todas desde el inicio.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-21, 22, 29.

### PA-INT-25 — Controladores fiscales

- **Pregunta:** ¿Se soportan controladores fiscales (Hasar/Epson)?
- **Opciones:**
  - A) No por defecto (la cooperativa emite electrónica); solo si un tenant lo exige, en O10 **(Recomendada)**.
  - B) Sí desde O5 en caja.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-92.

### PA-INT-26 — Estados de `aiUsageLogs`

- **Pregunta:** ¿Qué valores toma `aiUsageLogs.status`?
- **Contexto:** §7.16 y §8.12 declaraban `succeeded`, `failed` y `blockedByPolicy` [VERIFICAR]; el registro es inmutable y solo cambia `outcome`.
- **Opciones:**
  - A) `ok`, `error` y `blocked` (bloqueada por política o porque la IA está apagada en el tenant) **(Recomendada)**.
  - B) Sin estado: solo un código de resultado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-INT-086; FI-INT-90.
- **Estado:** Asumida (DEC-072): opción A.

### PA-INT-27 — Cierre de residuales del anexo (tipos de evento, estados, referencias y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 27 tipos de evento usaban guiones fuera de la convención `<mod>.<agregado>.<hecho>` en camelCase; 7 máquinas descritas en texto no declaraban el estado de alta; 3 referencias no tenían destino en la definición del campo; 10 colecciones del §7 no tenían tabla de campos; 4 filas de §11 citaban reglas de acceso en lugar de una capability.
- **Opciones:**
  - A) Renombrar los tipos a camelCase y conservar el nombre anterior como alias en la descripción del evento de §12 (T11 los registra en su §12.4); agregar §8.13 con una fila por transición; declarar destinos (`externalTransactionNumber`, antes `externalTransactionId`, porque es un número del ente y no una referencia); agregar las tablas de campos de §7.18 (derivadas del texto y de T05, obligatoriedad por regla); usar `public: true` (con la condición) y `int.agentes.ejecutar` en §11. **(Recomendada)**.
  - B) Mantener los nombres con guiones y registrarlos como excepción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** catálogo de eventos (T11 §12.4), diagramas de estados y contratos de T06.
- **Estado:** Asumida (DEC-072): opción A.
- **Sincronización (5-11-2026), Asumida (DEC-072):** los tipos de evento que T06 consume con guion (§12, eventos consumidos) pasan a camelCase con el nombre anterior como "antes": `fis.regimeFile.requested`, `cob.paymentIntent.requested`, `cob.debtPublication.requested`, `cob.directDebit.batchRequested`, `med.readingRoute.published`, `com.message.dispatchRequested`, `per.person.fiscalLookupRequested`, `tes.bankSync.requested`, `tes.paymentFile.requested` y `sue.payrollFiles.requested`; CU-INT-09 dispara con el canónico `mor.interruption.approved` (EVT-MOR-12; antes `mor.cut-order.approved`). Los productores (M06, M07, M03, T09, M01, M14, M16) deben declarar esos nombres en su §12 y T11 §12.4 registrar los alias.

## 22. Trazabilidad de fuentes

### 22.1 FIC — `integraciones-fichas.md`

| Sección FIC | Destino en T06 |
|---|---|
| 0. Cómo leer / hallazgo principal | §1, §12.3 (estados de investigación) |
| 1. Resumen (prioridades A/B/C) | §13; CTR-INT-16 |
| 2.1 WSAA + WSFEv1 | FI-INT-01, 02, 03; RF-INT-022…027, 038; RN-INT-005, 020…025; PRM-INT-005…008; PA-INT-03, 04 |
| 2.2 Padrón A13 y constancia | FI-INT-06, 07, 08, 09; CTR-INT-05 |
| 2.3 Regímenes informativos | FI-INT-13, 14, 15, 23; RF-INT-064 |
| 2.4 Mis Comprobantes | FI-INT-12 |
| 3.1 Rentas Córdoba (IIBB, CVP, SIRCAR) | FI-INT-18, 19, 20 |
| 3.2 Otras provincias | FI-INT-21, 22; PA-INT-24 |
| 4. Cobranza por redes (`Importador_Base`) | RF-INT-066; RN-INT-041, 042 |
| 4.1 Red Link | FI-INT-35 |
| 4.2 SIRO | FI-INT-36, 37; CTR-INT-01; PA-INT-11 |
| 4.3 Código de barras | FI-INT-34; RF-INT-061 |
| 4.4 Otras redes y entes | FI-INT-38…42 |
| 5.1 Pagos360 | FI-INT-43 |
| 5.2 Mercado Pago, Macro y otros | FI-INT-44…55; CTR-INT-03 |
| 6. Débito automático | FI-INT-56, 57; CTR-INT-21 |
| 7. Subsidios y tarifa social | FI-INT-24 |
| 8.1–8.4 ERSeP, ENARGAS, ENACOM, Secretaría de Energía | FI-INT-25…29 |
| 9.1 FECESCOR · 9.2 Tasas de terceros · 9.3 EPEC | FI-INT-31, 32, 33; CTR-INT-18 |
| 10.1 Lectores portátiles y app | FI-INT-73, 74 |
| 10.2 Telemedición | FI-INT-75, 76, 78; PA-INT-14; CTR-INT-04 |
| 10.3 Prepagos | FI-INT-77 |
| 11.1 Interbanking | FI-INT-58, 59; CTR-INT-06; PA-INT-18 |
| 11.2 Extractos | FI-INT-60 |
| 11.3 Cotización de monedas | FI-INT-17 |
| 12. Sueldos | FI-INT-16, 59 |
| 13.1 E-mail | FI-INT-61, 62; RN-INT-014…019; CTR-INT-13; PA-INT-07 |
| 13.2 WhatsApp | FI-INT-63; CTR-INT-09; PA-INT-05 |
| 13.3 SMS | FI-INT-64; CTR-INT-10; PA-INT-06 |
| 13.4 IVR | FI-INT-66; PA-INT-23; CTR-INT-28 (DEC-104: archivos para discadores externos, sin IVR propio) |
| 14.1 Portal CoopOnline | FI-INT-101; PA-INT-17; CTR-INT-11, 12 |
| 14.2 App de campo | FI-INT-74 (reemplazada por PWA) |
| 14.3 API para terceros | FI-INT-100 → T10; CTR-INT-07 |
| 15. Firma digital | FI-INT-89; PA-INT-22 |
| 16. GIS y mapas | FI-INT-69…72, 113; RN-INT-048; CTR-INT-20; PA-INT-19 |
| 17. Servicios TIC | FI-INT-79…87 |
| 18.1 Power BI · 18.2 Contable externo | FI-INT-98 (T10), FI-INT-99 |
| 19. Hardware local | FI-INT-91…95; RF-INT-084; PA-INT-09, 25; CTR-INT-15 |
| 20. Inteligencia artificial | FI-INT-90; RF-INT-086; PA-INT-08 |
| 21. Migración | FI-INT-97, 105; §19 → T07 |
| 22. Infraestructura que reemplaza procesos | §9 (JOB-INT-01…18), RF-INT-062, 065, 077; FI-INT-102 |
| 23. Pedidos a la cooperativa | Columna "Preguntas" de cada ficha (FI-INT-01, 13, 16, 18, 25, 32, 35, 56, 73, 77…) |

### 22.2 RN-10 — Integraciones externas

| Sección | Destino |
|---|---|
| §1 Panorama | §1, §12 |
| §2 Correo · §2.1 Cola y reglas de envío | FI-INT-61; RN-INT-014…019, 024; PRM-INT-030…032; RF-INT-080 (variable 3160) |
| §3 CoopOnline | FI-INT-101; RN-INT-001, 032 |
| §3.1 Identificación y canales | RN-INT-032, 060 |
| §3.2 Datos publicados | FI-INT-101 (reemplazado por M19) |
| §3.3 Operaciones aceptadas | RN-INT-033, 034 |
| §3.4 Autorización y registración del pago | RN-INT-011, 035, 062 |
| §3.5 Trámites web | RN-INT-046 → T11 |
| §3.6 Notificaciones al portal | FI-INT-65 (push) |
| §4 PMovil / Captor | FI-INT-74 |
| §5 SMS y WhatsApp | FI-INT-63, 64; RN-INT-026, 027; PRM-INT-033, 034 |
| §6 Pasarelas · §6.1 Mapeo de resultados | FI-INT-43…55; RN-INT-037, 053, 054, 055 |
| §7 Entes, débitos y bancos | FI-INT-35…42, 56…60 |
| §8 AFIP, reguladores y fiscos | FI-INT-01…33 |
| §9 Telemedición, prepago, ISP | FI-INT-75…83; RN-INT-040, 065 |
| §10 Mapas y GIS | FI-INT-69…72; RN-INT-048 |
| §11 Otras integraciones | FI-INT-92…96, 103, 104; RN-INT-059 |
| §12 Integra y Agente · §12.1 Tareas del Agente | FI-INT-91, 100, 102, 103; RN-INT-036, 058, 062, 063; RF-INT-077 |
| §13 Secretos hardcodeados | RN-INT-044, 047; RF-INT-023, 083; §19 (lección de seguridad; no se transcriben valores) |
| §14 Implicancias | §2, §5 |
| §15 Dudas abiertas | [VERIFICAR] en RN-INT-015, 032, 046; PA-INT-01…25 |
| §16.1 Turnero | FI-INT-94 |
| §16.2 Adjuntos | RN-INT-017 |
| §16.3 Calendario, agenda y correo interno | Fuera de T06 → T09 / M09 (no es integración externa) |
| §16.4 Navegador genérico de entidades | Fuera de T06 → T10 (no es integración externa) |
| §16.5 Informes | §15 → T10 |
| §16.6 Importación de archivos y SQL | FI-INT-10, 16, 96, 105; RN-INT-045 |
| §16.7 Fórmulas, mapas y escáner | FI-INT-69, 95; fórmulas → M04 |
| §16.8 Novedades y encuestas del proveedor | FI-INT-103 (descartado) |

### 22.3 RN-12 — Configuración real de LAG

| Sección | Destino |
|---|---|
| §1 Sigla | RF-INT-060 (hooks por cooperativa); FI-INT-36 |
| §2 Entes (`BANCOS`) | FI-INT-34, 35, 36; RN-INT-043; §19 |
| §3 Pasarelas online | FI-INT-37, 43, 44 (no usadas); RN-INT-033; §15 (38 % sin pago) |
| §4 Parámetros relevantes | §14 (2712, 727, 2515, 2779, 2807…) |
| §5 Implicancias | §13; PA-INT-11, 13 |
| §6 Dudas abiertas | Preguntas de FI-INT-35, 37, 77 |

### 22.4 RN-13 — Pasarelas de pago e Interbanking

| Sección | Destino |
|---|---|
| §1 Panorama | §12.8 |
| §2.1 Patrón de transporte | RN-INT-012, 029, 037, 038; RF-INT-034…036 |
| §2.2 Ciclo de vida de la solicitud | RN-INT-004; §8.4 |
| §2.3 Webhook, polling o archivo | RN-INT-002, 006, 007, 011; JOB-INT-19 |
| §2.4 Elección de la pasarela | PRM-INT-041; PA-INT-13 |
| §3.1–3.4 Pagos360 (ambiente, endpoints, link, QR) | FI-INT-43; RN-INT-003, 010, 052, 061 |
| §3.5 Débito automático | FI-INT-56, 57; RN-INT-028; JOB-INT-20 |
| §3.6 Contracargos y reversiones | RN-INT-056, 057 |
| §3.7 Tótem | FI-INT-93; RN-INT-050 |
| §4.1–4.3 SIRO | FI-INT-37; RN-INT-008, 013 |
| §5 Mercado Pago | FI-INT-44 |
| §6 Macro Click de Pago | FI-INT-46; RN-INT-051; CTR-INT-03 |
| §7 NaranjaX | FI-INT-47 |
| §8 PayFun | FI-INT-48 |
| §9 Pagos TIC | FI-INT-49 |
| §10 SiPago | FI-INT-50; RN-INT-053 |
| §11 Helipagos | FI-INT-51 |
| §12 ProvinciaNet | FI-INT-53; RN-INT-008, 009 |
| §13 ProntoPago | FI-INT-52 |
| §14 OffLine y resumen de tarjeta de terceros | FI-INT-55; FI-INT-32 (Banco de Sangre); RN-INT-049 |
| §15 Cobertura por medio | §13; RN-INT-056 |
| §16.1 API Interbanking | FI-INT-58; RN-INT-013 |
| §16.2 Saldos y movimientos | FI-INT-58; RN-INT-030 |
| §16.3 Conciliación bancaria | RN-INT-031 → M14 |
| §16.4 Archivos de pago | FI-INT-59; CTR-INT-22 |
| §17 Hallazgos de seguridad | RN-INT-044, 045, 049, 051; RF-INT-079…083; §19 |
| §18 Resto de `ProMod_WebService` | FI-INT-100 → T10; FI-INT-103 [VERIFICAR] endpoint por endpoint en T10 |
| §19.1 Prioridades | §13; PA-INT-13 |
| §19.2 Diseño genérico | §5, §7, §9 |
| §19.3 Webhooks vs. polling | RN-INT-002; PA-INT-10; RF-INT-034 |
| §19.4 No replicar | RN-INT-008, 009, 044, 045, 050, 051 |
| §20 Dudas abiertas | RN-INT-052 [VERIFICAR]; FI-INT-54 |

### 22.5 Otras fuentes

| Fuente | Destino |
|---|---|
| DEC-001…003, DEC-007 | §2; RF-INT-032; CTR-INT-11, 12, 15 |
| BASE §10 (caso crítico de emisión) | RF-INT-038; FI-INT-02 |
| BASE §13 (CU-13) | RF-INT-037, 067, 069; §16.1 |
| BASE §19, §29 | FI-INT-11; RF-INT-020 |
| BASE §31 (CU-31) | RF-INT-063, 078; FI-INT-96 |
| BASE §39.4, §47, §50 | FI-INT-106, 24 |
| BASE §54 (GOB-001…003) | RF-INT-070…072; FI-INT-44, 45 |
| BASE §59 (seguridad, API) | RF-INT-082; CTR-INT-07, 21; FI-INT-67 |
| BASE §60–61 (fiscal y regímenes) | FI-INT-05, 13…15, 20, 23, 25 |
| BASE §65, §66, §77, §86 | Diccionario (§10); FI-INT-60; RF-INT-013; FI-INT-65 |
| BASE §97.2–97.7 | FI-INT-01…03, 75; RN-INT-040 |
| BASE §100 (MER-012…020) | RN-INT-040; FI-INT-75, 79; MER-007 ⇒ FI-INT-107; MER-008 ⇒ FI-INT-108; MER-014 ⇒ FI-INT-25…29; MER-015 ⇒ FI-INT-88; MER-016 ⇒ FI-INT-63, 66; MER-017 ⇒ FI-INT-84, 109; MER-020 ⇒ FI-INT-111 |
| BASE §77 (CU-GEO-01) | FI-INT-69, 70, 71; PRM-INT-054; CTR-INT-20 |
| BASE §87 (electrodependencia) | FI-INT-110 |
| BASE §103, §104, §105 | §1; FI-INT-16 |
| AGR-015…021, AGR-034, AGR-035, hipótesis 5.5 | §5.5, §5.9; RF-INT-030, 031, 037, 038; CTR-INT-08, 14 |
| AGR ESC-01…05 | §17.2 |
| CNX §2.1, §2.4–2.8, §4.5–4.6, §9, §10 | §4, §10, RF-INT-033, 079, 085, 086 |
| RN-03 §2–§5 | FI-INT-01…03, 06, 09, 10; RN-INT-020…025 |
| DFA §30, DFA M29 | FI-INT-59, 18; CTR-INT-22 |
| CAT: tablas de interfaces, pagos, comunicaciones, telemedición, Interbanking, firma, IA, WS | §7.17; §19 |
| T04b (parámetros V2) | §14; CTR-INT-24, 27 |
| M10 §13 (sistemas de red y correo provisto) | FI-INT-79…87, 112; DEC-042 |
| RN-10 §10 (Bing 2242, GIS por OleDb 2425) · RN-10 §5 y T04b parte 4 (SMS por AWS SNS, 3018–3021) · FIC 13.4 (IVR TeleAnouncer/Minerva) · FIC 4.4 (Fiserv, PampaPagos y bancos) | Bing ⇒ descartado, con Google y Georef (DEC-046; FI-INT-69…71); GIS ⇒ FI-INT-113; SNS ⇒ un adaptador posible de FI-INT-64 (PA-INT-06); IVR ⇒ FI-INT-66; redes y bancos ⇒ FI-INT-41, 42 por layout (PA-INT-12) |

### 22.6 Decisiones vigentes aplicadas

| DEC | Efecto en T06 |
|---|---|
| DEC-014 | La confirmación de pago (`int.payment.confirmed`) dispara la reconexión automática de servicios remotos sin deuda vencida; T06 ejecuta el comando (FI-INT-75, 79–83) y M08/M10 deciden. |
| DEC-015 | FI-INT-46…53 en O11 / Extensión; PA-INT-13 resuelta; CTR-INT-23. |
| DEC-018, DEC-038 | Espera del CAE con tope en mostrador; en masiva se emite y encola, y solo se pausa la autorización; PA-INT-04 resuelta; CU-INT-04, ESC-INT-01. |
| DEC-020 | Mapas e IA con clave de plataforma y opción de clave propia; PA-INT-01 (en parte), PA-INT-19. |
| DEC-024 | Banco de Sangre solo administrativo, sin datos clínicos (FI-INT-32). |
| DEC-041 | Aprovisionamiento automático asíncrono por conector con respaldo manual (FI-INT-79…83). |
| DEC-042 | MikroTik, Radius y SmartOLT en O3 (FI-INT-79…81). |
| DEC-046 | Georef normaliza y geocodifica; Google para mapa y autocompletado (FI-INT-70, 71; PRM-INT-054; CTR-INT-20). |
| DEC-047 | Estado de las preguntas (§21.0). |
| DEC-050 | Identificador de pago nuevo y resolución de la clave de ProCoop durante la transición (§19). |
| DEC-051 | El interés por pago online de una factura vencida se difiere a la próxima factura: la intención de pago que T06 crea lleva el importe que informa M07, sin recargo calculado por el conector. |
| DEC-053 | Clave y CSR generados por la plataforma; se admite PFX (PA-INT-03; CU-INT-02). |
| DEC-054 | IIBB Córdoba en O4 y el resto en O8 (FI-INT-18…22; PA-INT-24). |
| DEC-055 | WhatsApp por Meta Cloud API con adaptador para Trii (FI-INT-63; PA-INT-05). |
| DEC-056 | IA en O6 (CRM) y O10 (adjuntos), apagada hasta que el tenant la acepte (FI-INT-90; CTR-INT-26). |
| DEC-058 | Sueldos: importación en O8 y liquidación propia en O9 (FI-INT-16, 59). |
| DEC-059 | Extractos y conciliación en O5; Interbanking en O8 (FI-INT-58…60; CTR-INT-25). |
| DEC-064 | Varias personas jurídicas por tenant: `integrationConnections.legalEntityId` (§7.2); ARCA con una conexión, certificado y TA por entidad (FI-INT-01). |
| DEC-074 | Bóveda con cifrado por sobre propio y clave maestra en AWS KMS (§7.3; RF-INT-015; PA-INT-02 respondida). |
| DEC-077 | Mensajería con conector propio del tenant o proveedor de plataforma revendido con consumo medido (FI-INT-61, 63, 64; RF-INT-013; JOB-INT-28). |
| DEC-078 | Firma electrónica con OTP por defecto y firma digital licenciada solo para sueldos y actas (FI-INT-89; PA-INT-22 respondida). |
| DEC-081 | LAG es la base relevada de referencia, no el piloto (§12.3). Reemplazada por DEC-088. |
| DEC-088 | LAG es la cooperativa piloto y la base relevada de referencia; las preguntas a la piloto se dirigen a LAG (§12.3). |
| DEC-084 | El pack SMS que se vende al socio es un servicio de M02; no se confunde con el modelo de contratación de FI-INT-64. El consumo del período de correo y pack SMS llega por EVT-INT-24 `int.serviceUsage.received` (FI-INT-112) a M10, que lo atribuye y lo informa a M04 (RN-TAR-251). |
| DEC-085 | La corrección de volumen de gas la aplica M04; FI-INT-115 informa el factor de la distribuidora para el control de M12. |
| DEC-087 | Bitácoras de más de 36 meses con consulta diferida (§7, índices de mensajes). |
| DEC-106 | Cada layout de exportación de deuda a entes de cobro declara `fileLayouts.dueDateCapacity` (§7.9; RF-INT-059), que M07 copia a `collectionAgencies.dueDateCapacity` (RF-COB-099, RN-COB-159) y M05 usa para validar el tope de vencimientos (RN-FAC-163). Los layouts actuales de ProCoop publican hasta 4 vencimientos; la capacidad de cada uno se carga al validar el layout (10-11-2026). |
| T05 CTR-DAT-30, 72 | `credentialRef` → `integrationSecrets` (`webhookEndpoints`, §7.3). |
| M12 RF-CMP-149, RF-CMP-152 | FI-INT-33 (energía, CTR-INT-18 resuelta) y FI-INT-115 (gas, nueva). |
