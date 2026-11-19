# Casos de prueba de aceptación — T06 INT — Integraciones externas: marco común de conectores y fichas

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T06-INT-integraciones.md`](../../especificacion/anexos/T06-INT-integraciones.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 86 CP de requisitos funcionales, 27 CP de escenarios ESC y 15 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T06 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Catálogo, conectores y conexiones (T06 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0001 | RF-INT-001; T06 §5.1; PRO-O0-10 | O0 | Núcleo | migración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Catálogo de plataforma de proveedores (`integrationProviders`): código, nombre, tipo de conector, capacidades, protocolos, ambientes (`test`/`production`) con URLs base, esquema de configuración y de credenciales (solo nombres y tipo)… | Un proveedor nuevo se agrega por semilla/migración sin tocar módulos de dominio; el catálogo se ve en `PAN-INT-01`. |
| CP-INT-0002 | RF-INT-002; T06 §5.1; PRO-O1-14 | O1 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Conexión por tenant (`integrationConnections`): instancia de un proveedor con nombre, configuración no secreta, referencias a secretos y certificados, alcance, modo, estado, calendario y políticas; varias conexiones por proveedor (ej. dos… | Dos conexiones SIRO con convenios distintos operan sin interferirse; aislamiento por `tenantId`. |
| CP-INT-0003 | RF-INT-003; T06 §5.1; PRO-O1-14 | O1 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Un conector solo se ofrece si la licencia del tenant lo incluye (capability de plataforma, T01) y el servicio asociado está habilitado (BASE §66). | Sin licencia, la conexión no puede crearse ni ejecutarse (prueba negativa). |
| CP-INT-0004 | RF-INT-004; T06 §5.1; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Alcance de la conexión: servicios, sucursales, puntos de venta, cajas, canales, zonas; el módulo dueño elige la conexión por alcance. | Una caja con QR usa la conexión asignada a esa caja; otra caja usa otra. |
| CP-INT-0005 | RF-INT-005; T06 §5.1; PRO-O0-10 | O0 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Capacidades declaradas por conector; la UI y los módulos solo invocan capacidades declaradas. Invocar una no declarada devuelve error tipado `capability-not-supported`. | Prueba unitaria por conector valida el manifiesto de capacidades. |
| CP-INT-0006 | RF-INT-006; T06 §5.1; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. `FEDummy`, `Healthcheck` ProvinciaNet, login OAuth, `GET account/balances`) y registra resultado en bitácora. | Resultado visible en `PAN-INT-03` con latencia y código; no expone secretos. |
| CP-INT-0007 | RF-INT-007; T06 §5.1; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Contingencia: Una contingencia fiscal cerrada con su acta de conciliación. | Cambios de configuración versionados con vigencia y auditoría (antes/después sin secretos). Cambios en conexiones `production` de tipo fiscal, pagos, débito o red requieren aprobación (T11). | Cambio sin aprobación queda en borrador; la aprobación genera su propio evento de auditoría. |
| CP-INT-0008 | RF-INT-008; T06 §5.1; PRO-O2-15 | O2 | Estándar | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Copiar configuración de una conexión entre tenants autorizados **sin** secretos, certificados, identificadores externos ni estados. | La copia queda en borrador y exige cargar credenciales propias. |
| CP-INT-0009 | RF-INT-009; T06 §5.1; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Suspender o desactivar una conexión sin perder historia; las operaciones en curso terminan, se reencolan a otra conexión permitida o pasan a contingencia según la política. | Desactivar no borra bitácora ni operaciones; las pendientes quedan con estado explícito. |
| CP-INT-0010 | RF-INT-010; T06 §5.1; PRO-O5-06 | O5 | Estándar | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Conexión por defecto por propósito y cadena de respaldo configurable (ej. pasarela para el portal: canal del socio → por defecto del tenant → offline). | La cadena se configura por tenant; nunca se cae en una pasarela no configurada. |
| CP-INT-0011 | RF-INT-011; T06 §5.1; PRO-O1-14 | O1 | Estándar | migración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Versionado de adaptadores (`adapterVersion`) y migración de conexiones entre versiones con prueba previa. | Una conexión puede quedar fijada a una versión hasta su migración. |
| CP-INT-0012 | RF-INT-012; T06 §5.1; PRO-O1-14 | O1 | Estándar | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Conexiones del tenant `PLATFORM` compartidas (ej. Google Maps, email de plataforma, LLM de plataforma) con consumo atribuido por tenant. | Reporte de consumo por tenant; un tenant puede reemplazarla por una propia si la licencia lo permite. |
| CP-INT-0013 | RF-INT-013; T06 §5.1; PRO-O1-14 | O1 | Estándar | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Consumo y costo por tenant (mensajes, consultas de mapas, tokens IA, consultas ARCA) para facturación de plataforma y cuotas. | Panel de consumo mensual por conexión y tenant. |
| CP-INT-0014 | RF-INT-014; T06 §5.1; PRO-O1-14 | O1 | Estándar | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Ficha técnica y ayuda contextual por conector (qué hace, qué pide, cómo obtener credenciales, ambiente de prueba). | `PAN-INT-02` muestra la ficha `FI-INT-NN` correspondiente. |
### 1.2 Bóveda de credenciales (T06 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0015 | RF-INT-015; T06 §5.2; PRO-O0-10 | O0 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con `keyId` y versión. | Un volcado de Mongo no permite recuperar ningún secreto; prueba de restauración con KMS. |
| CP-INT-0016 | RF-INT-016; T06 §5.2; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Secretos de solo escritura: UI y API devuelven nombre, tipo, huella (HMAC), últimos 4 caracteres cuando el tipo lo permite, fecha de carga, autor, vencimiento y estado. Nunca el valor. | Prueba negativa: ningún endpoint ni export contiene el valor. |
| CP-INT-0017 | RF-INT-017; T06 §5.2; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Rotación con doble versión: la nueva versión queda `pending` hasta probar la conexión; al confirmar pasa a `active` y la anterior a `rotated` (con período de gracia configurable) y luego `revoked`. | Durante la rotación no hay operaciones fallidas por credencial. |
| CP-INT-0018 | RF-INT-018; T06 §5.2; PRO-O1-14 | O1 | Estándar | integración | TEN-001 con Alertas: Certificado que vence en 7 días; circuito abierto en "SMS demo". | Política de rotación por tipo de secreto (días) con recordatorio y alerta; rotación forzada ante incidente. | Alerta `credential_rotation_due` a los responsables. |
| CP-INT-0019 | RF-INT-019; T06 §5.2; PRO-O1-14 | O1 | Núcleo | seguridad | TEN-001 con WhatsApp: Simulador con 2 plantillas aprobadas y 1 rechazada. | Vencimiento de credenciales conocido (tokens de larga vida de WhatsApp, refresh tokens, claves con expiración) con alertas escalonadas. | Igual esquema que certificados (RF-INT-025). |
| CP-INT-0020 | RF-INT-020; T06 §5.2; PRO-O1-14 | O1 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Auditoría de uso: cada descifrado registra proceso/usuario, conexión, operación y momento (sin valor). | Reporte de accesos por secreto. |
| CP-INT-0021 | RF-INT-021; T06 §5.2; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Separación por ambiente: claves maestras distintas para ambientes productivos y no productivos; un worker no productivo no puede descifrar secretos de producción. | Prueba: el worker de staging falla al descifrar un secreto de producción. |
| CP-INT-0022 | RF-INT-022; T06 §5.2; PRO-O4-02 | O4 | Núcleo | seguridad | TEN-001 con Conexión SIRO: Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`. | Caché de tokens de sesión (TA de WSAA, access tokens OAuth, tokens de sesión SIRO/ProntoPago/Macro) cifrada, compartida entre workers, con renovación anticipada (margen configurable) y bloqueo distribuido para no pedir dos a la vez. | Con 4 workers en paralelo se solicita un solo TA por servicio y CUIT. |
| CP-INT-0023 | RF-INT-023; T06 §5.2; PRO-O4-02 | O4 | Núcleo | migración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Credenciales heredadas de ProCoop se consideran comprometidas: no se importan; se solicita al tenant regenerarlas en cada proveedor antes de operar en producción. | Checklist de migración exige rotación por conexión (T07). |
### 1.3 Certificados (T06 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0024 | RF-INT-024; T06 §5.3; PRO-O4-02 | O4 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Generar par de claves (RSA 2048 o superior) y CSR en el servidor con los datos del tenant (CUIT en el *subject*, alias); la clave privada nunca sale de la bóveda. Alternativa: subir PFX/P12 con contraseña. | El certificado subido se valida contra la clave (módulo), CUIT del *subject*, vigencia y emisor. |
| CP-INT-0025 | RF-INT-025; T06 §5.3; PRO-O4-02 | O4 | Núcleo | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Alertas de vencimiento escalonadas (30, 14, 7, 3 y 1 días, y vencido) por in-app, email y tablero, a responsables del tenant y a plataforma. | Simulación de fecha genera las 6 alertas una sola vez cada una (deduplicación). |
| CP-INT-0026 | RF-INT-026; T06 §5.3; PRO-O4-02 | O4 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Varios certificados por conexión (vigente y próximo) para renovar sin corte; cambio de certificado activo auditado. | El TA se renueva con el nuevo certificado sin detener la cola. |
| CP-INT-0027 | RF-INT-027; T06 §5.3; PRO-O4-02 | O4 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Certificado vencido, revocado o rechazado ("expirado") ⇒ la conexión pasa a `blocked_credential`, la cola se pausa y los documentos quedan `pending` (no `rejected`). | Ningún comprobante cambia a rechazado por un error de certificado. |
### 1.4 Modo prueba / producción (T06 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0028 | RF-INT-028; T06 §5.4; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Modo `test` / `production` por conexión, con URLs del catálogo; cambio de modo auditado, con aprobación y prueba de conexión obligatoria. | No hay URLs ni claves "TEST" mezcladas; el modo es un campo explícito. |
| CP-INT-0029 | RF-INT-029; T06 §5.4; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Indicador visible "MODO PRUEBA" en toda pantalla y documento que use una conexión `test`; los documentos emitidos en prueba llevan marca sin validez. | PDF de factura en prueba lleva leyenda; no se envía al socio salvo destinatarios de prueba. |
| CP-INT-0030 | RF-INT-030; T06 §5.4; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Los ambientes no productivos de la plataforma solo pueden usar conexiones en `test` (bloqueo duro en el worker). | Staging con una conexión en `production` no ejecuta y alerta. |
| CP-INT-0031 | RF-INT-031; T06 §5.4; PRO-O0-10 | O0 | Estándar | integración | TEN-001 con Telemedición: Simulador MDM con 10 medidores ficticios, un comando de corte que responde tarde (incierto). | Simulador por conector (respuestas sintéticas deterministas, incluidas fallas y demoras) para desarrollo, demo y pruebas automatizadas. | Escenarios ESC con simulador reproducen timeout, rechazo, duplicado e incierto. |
### 1.5 Ejecución confiable (outbox, colas, reintentos, idempotencia, circuit breaker) (T06 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0032 | RF-INT-032; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Toda llamada externa originada por un cambio de negocio se registra como `integrationOperation` en la **misma transacción** que el cambio (outbox) y se ejecuta en un worker. | Si el proceso cae después del commit, la operación se ejecuta igual al reiniciar. |
| CP-INT-0033 | RF-INT-033; T06 §5.5; PRO-O0-10 | O0 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Colas BullMQ por categoría (`int-fiscal`, `int-payments`, `int-files`, `int-messaging`, `int-metering`, `int-network`, `int-ai`, `int-webhooks`, `int-maintenance`) con concurrencia por tenant y por conexión (aislamiento de carga). | Un tenant con 12.500 comprobantes no demora el cobro QR de otro tenant (prueba de carga). |
| CP-INT-0034 | RF-INT-034; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Reintentos con backoff exponencial y *jitter* (base, factor, tope y máximo de intentos por categoría de error y conector). | Un 503 se reintenta; un 400 de validación no. |
| CP-INT-0035 | RF-INT-035; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Taxonomía de errores normalizada: `transient`, `rate_limited`, `auth`, `credential_expired`, `validation`, `business_rejected`, `not_found`, `conflict`, `uncertain`, `circuit_open`, `config`, `unknown`; cada conector mapea sus códigos. | La bandeja muestra causa accionable y el mapeo es testeado. |
| CP-INT-0036 | RF-INT-036; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Timeouts explícitos de conexión y lectura por conector y operación (default WSFE 90 s). | Ninguna llamada usa el timeout por defecto del cliente HTTP. |
| CP-INT-0037 | RF-INT-037; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Idempotencia: clave `tenantId + operationType + businessKey`; si existe una operación `succeeded` se devuelve su resultado; si está en curso se espera; el conector envía la clave al proveedor cuando lo soporta (`X-Idempotency-Key`… | El mismo pago notificado 3 veces produce 1 sola confirmación (CU-13). |
| CP-INT-0038 | RF-INT-038; T06 §5.5; PRO-O4-03 | O4 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Estado `uncertain`: ante timeout o corte sin respuesta en operaciones no idempotentes del lado del proveedor, se ejecuta la **consulta de reconciliación** del conector (ej. `FECompUltimoAutorizado` + `FECompConsultar`, `GET… | Un timeout en `FECAESolicitar` nunca genera un segundo número para el mismo comprobante. |
| CP-INT-0039 | RF-INT-039; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión SIRO: Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`. | Circuit breaker por conexión y por operación: abre al superar el umbral de fallos en una ventana, retiene la cola, pasa a semiabierto con sondeo y cierra tras éxitos consecutivos; estado visible y evento al abrir/cerrar. | Caída simulada de SIRO abre el circuito en ≤ umbral y no agota reintentos de miles de operaciones. |
| CP-INT-0040 | RF-INT-040; T06 §5.5; PRO-O0-10 | O0 | Núcleo | seguridad | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Límite de tasa saliente por proveedor, conexión y tenant (token bucket en Redis), incluido el lote "N mensajes cada M segundos". | Envío masivo respeta el límite configurado sin errores 429 sostenidos. |
| CP-INT-0041 | RF-INT-041; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Prioridad: operaciones interactivas (caja, portal, QR) antes que batch (lotes, publicación masiva). | En plena emisión masiva, un CAE de caja se obtiene en el tiempo objetivo de T08. |
| CP-INT-0042 | RF-INT-042; T06 §5.5; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Pausar/reanudar manualmente una conexión, una operación tipo o un punto de venta (equivalente a `PTOVENTA.PAUSAR`). | Pausado, las operaciones quedan `queued` y la UI lo indica. |
| CP-INT-0043 | RF-INT-043; T06 §5.5; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Bandeja de operaciones detenidas (fallidas permanentes, inciertas no resueltas, bloqueadas por credencial) con filtros, causa, acción sugerida, reintentar, cancelar y resolver manualmente con evidencia. | Toda operación no exitosa tiene un estado final o una tarea pendiente asignada. |
| CP-INT-0044 | RF-INT-044; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Correlación: `correlationId` desde la acción del usuario/job hasta operación, mensajes, eventos y auditoría; `requestId` en errores RFC 9457. | Desde una factura se navega a todas sus operaciones y mensajes. |
| CP-INT-0045 | RF-INT-045; T06 §5.5; PRO-O5-06 | O5 | Estándar | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Debounce por intención: consultas repetidas del mismo estado en menos de N segundos se agrupan (equivalente a `FEC_CONSULTA` 10 s). | Doble clic en "verificar pago" produce una sola consulta. |
| CP-INT-0046 | RF-INT-046; T06 §5.5; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Los efectos se aplican vía eventos al módulo dueño; el conector no escribe colecciones de otros módulos. | Revisión de dependencias: los paquetes `integrations/*` no importan modelos de otros módulos. |
### 1.6 Bitácora de mensajes (T06 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0047 | RF-INT-047; T06 §5.6; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Bitácora de cada mensaje (HTTP/SOAP/archivo/SFTP/TCP/SSH/SQL/email/webhook) con dirección, endpoint sin parámetros sensibles, método, estado, duración, tamaño, intento, ambiente, operación y correlación. | Cada operación tiene ≥ 1 mensaje registrado. |
| CP-INT-0048 | RF-INT-048; T06 §5.6; PRO-O0-10 | O0 | Núcleo | seguridad | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Saneamiento obligatorio antes de persistir: se eliminan headers de autorización, cookies, tokens, contraseñas, claves, `sign`/`token` de WSAA, datos de tarjeta (PAN, CVV, vencimiento), CBU completo (enmascarado) y campos marcados por el… | Test automatizado inyecta secretos conocidos y verifica que no aparecen en bitácora, logs de aplicación ni errores. |
| CP-INT-0049 | RF-INT-049; T06 §5.6; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Cuerpos mayores a un umbral se guardan en almacenamiento privado (clave + hash SHA-256); retención configurable por tipo. | La purga respeta la retención y deja el metadato. |
| CP-INT-0050 | RF-INT-050; T06 §5.6; PRO-O1-14 | O1 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Ver cuerpos requiere `int.bitacora.verPayload` y queda auditado. | Acceso sin capability muestra solo metadatos. |
| CP-INT-0051 | RF-INT-051; T06 §5.6; PRO-O1-14 | O1 | Estándar | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Búsqueda y exportación de bitácora por conexión, operación, entidad de negocio, estado, fecha y correlación. | Export XLSX/CSV sin cuerpos salvo capability. |
| CP-INT-0052 | RF-INT-052; T06 §5.6; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Los logs de aplicación (stdout) nunca contienen cuerpos de integraciones; solo ids y códigos. | Lint/regla de logging verificada en CI. |
### 1.7 Webhooks entrantes (T06 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0053 | RF-INT-053; T06 §5.7; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Endpoint de webhook por conexión en `/api/public/{tenantSlug}/webhooks/{endpointKey}` con `endpointKey` aleatorio no adivinable; rotación del endpoint. | Un endpoint de un tenant no acepta eventos de otro. |
| CP-INT-0054 | RF-INT-054; T06 §5.7; PRO-O5-06 | O5 | Núcleo | seguridad | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Verificación de autenticidad según el proveedor: firma HMAC (ej. `X-Hub-Signature-256` de Meta, `x-signature` de Mercado Pago), secreto compartido, mTLS o lista de IP; ventana anti-replay por timestamp. | Firma inválida ⇒ 401, registro y alerta; sin efectos. |
| CP-INT-0055 | RF-INT-055; T06 §5.7; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Bandeja de entrada durable: se persiste el evento, se responde 2xx en < 2 s y se procesa en cola `int-webhooks`; deduplicación por id de evento del proveedor o hash. | Reenvíos del proveedor no generan efectos repetidos. |
| CP-INT-0056 | RF-INT-056; T06 §5.7; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | El webhook es **disparador**: antes de un efecto económico se reconsulta el estado al proveedor con credenciales propias (salvo excepción documentada en la ficha). | Un webhook falso con firma válida pero pago inexistente no confirma nada. |
| CP-INT-0057 | RF-INT-057; T06 §5.7; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | El retorno del navegador (`back_url`, página de éxito) nunca confirma un pago. | El socio que vuelve a "éxito" ve "pago en verificación" hasta la confirmación. |
| CP-INT-0058 | RF-INT-058; T06 §5.7; PRO-O2-15 | O2 | Estándar | integración | TEN-001 con WhatsApp: Simulador con 2 plantillas aprobadas y 1 rechazada. | Webhooks de verificación de suscripción (ej. `hub.challenge` de Meta) resueltos por el conector. | Alta del webhook de WhatsApp sin intervención manual. |
### 1.8 Intercambio de archivos (T06 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0059 | RF-INT-059; T06 §5.8; PRO-O5-05 | O5 | Núcleo | migración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Layouts declarativos versionados (`fileLayouts`): ancho fijo, CSV (separador configurable), XLSX, XML, JSON, TXT de ARCA, lectura DBF/Access para migración; registros de cabecera/detalle/pie; campos con posición, largo, tipo, relleno… | Red Link 19/10 y SIRO LAG se generan con layouts, sin clases específicas, y coinciden byte a byte con ProCoop. |
| CP-INT-0060 | RF-INT-060; T06 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Conexión SIRO: Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`. | Hooks de código acotados por layout para lo no declarable (DV especiales, reglas de ramas por cooperativa como el "0" antepuesto al convenio SIRO de LAG). | El hook se versiona con el layout y tiene prueba con archivo de referencia. |
| CP-INT-0061 | RF-INT-061; T06 §5.8; PRO-O4-01 | O4 | Núcleo | migración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Biblioteca de algoritmos de dígito verificador (módulo 10, módulo 11, Luhn, ponderados por ente; los 9 de `Codigo_Base`) y generador de códigos de barras/pago parametrizable por ente y cooperativa. | El código de barras de LAG coincide con el de ProCoop para la misma factura (paralelo). |
| CP-INT-0062 | RF-INT-062; T06 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. | El archivo entregado se puede reproducir y su hash coincide. |
| CP-INT-0063 | RF-INT-063; T06 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. | Reprocesar el mismo archivo no duplica pagos (CU-31 excepción). |
| CP-INT-0064 | RF-INT-064; T06 §5.8; PRO-O4-01 | O4 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Estados diferenciados: **generado ≠ entregado ≠ aceptado** (y para regímenes: presentado ≠ aceptado). | Exportar un archivo no marca "Presentado". |
| CP-INT-0065 | RF-INT-065; T06 §5.8; PRO-O5-05 | O5 | Estándar | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Transporte SFTP con clave privada en bóveda y huella de host fijada; FTP sin cifrar prohibido salvo excepción aprobada y registrada. | Conexión SFTP con huella distinta falla y alerta. |
| CP-INT-0066 | RF-INT-066; T06 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Validaciones comunes de importadores: duplicados, importes, comprobante inexistente/anulado/bloqueado, titular notificado, fuera de término (con la política de M07). | Cada línea queda `applied`, `rejected` (con causa) o `review`. |
### 1.9 Conciliación, monitoreo, alertas y contingencia (T06 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0067 | RF-INT-067; T06 §5.9; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Motor de conciliación por conector con tipos: pagos (externo vs. confirmado), publicación de deuda (enviado vs. aceptado), fiscal (CAE locales vs. ARCA), banco (movimientos vs. libro), mensajería (enviado vs. entregado). | Cada ejecución produce un acta con totales y diferencias. |
| CP-INT-0068 | RF-INT-068; T06 §5.9; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Ventana de conciliación configurable (default 4 días) y alta de transacciones externas sin intención previa ("pago app") a bandeja de revisión. | Un pago hecho desde la app del proveedor aparece en revisión, no se pierde. |
| CP-INT-0069 | RF-INT-069; T06 §5.9; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13). | Bruto, comisión, IVA de comisión y neto se informan por separado al módulo dueño. | ARS 8.000 / 160 / 7.840 del CU-13 se reproducen. |
| CP-INT-0070 | RF-INT-070; T06 §5.9; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Estado observable por conexión: salud, último éxito, tasa de error, latencia p95, backlog, circuito, credenciales y certificados por vencer, próximas ejecuciones. | `PAN-INT-04` muestra el semáforo por conexión. |
| CP-INT-0071 | RF-INT-071; T06 §5.9; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Alertas con tipo, severidad, deduplicación, destinatarios, reconocimiento, resolución y vínculo al objeto (conexión, operación, archivo, certificado). | Una alerta repetida incrementa contador, no crea otra. |
| CP-INT-0072 | RF-INT-072; T06 §5.9; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Tablero de plataforma (todas las conexiones de todos los tenants, sin secretos) y tablero del tenant. | Plataforma ve "errores de procesos e integraciones" por tenant. |
| CP-INT-0073 | RF-INT-073; T06 §5.9; PRO-O0-05 | O0 | Estándar | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Métricas y trazas exportables (OpenTelemetry) por conector y tenant (T08). | Métricas disponibles en el stack de observabilidad. |
| CP-INT-0074 | RF-INT-074; T06 §5.9; PRO-O4-03 | O4 | Núcleo | integración | TEN-001 con Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado). | Declarar contingencia por conexión (manual o sugerida por circuito abierto prolongado) con el modo alternativo de su ficha: CAEA (fiscal), archivo manual (redes/entes), cola diferida (mensajería), proveedor alternativo (email/SMS)… | La contingencia tiene inicio, fin, operaciones afectadas y reconciliación de cierre. |
| CP-INT-0075 | RF-INT-075; T06 §5.9; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Reemplazo manual con doble control: un usuario con `int.operaciones.resolverManual` registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado `manual_resolved` y se concilia después. | Un pago confirmado a mano sin evidencia no se puede aprobar. |
| CP-INT-0076 | RF-INT-076; T06 §5.9; PRO-O4-03 | O4 | Núcleo | integración | TEN-001 con Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual). | Cierre de contingencia exige conciliación completa (ej. informar CAEA, reprocesar archivos, verificar inciertos). | No se puede cerrar con operaciones inciertas abiertas. |
| CP-INT-0077 | RF-INT-077; T06 §5.9; PRO-O1-14 | O1 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Calendario de ejecuciones programadas por conexión (cron en zona horaria del tenant), con historial, saltos y ejecución manual. | Reemplaza las tareas del Agente con trazabilidad. |
### 1.10 Identificadores, seguridad, agente local, mensajería e IA (T06 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INT-0078 | RF-INT-078; T06 §5.10; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Registro de identificadores externos (`externalReferences`) por entidad, único por `tenantId + system + externalId`, con historia. | No pueden existir dos pagos con el mismo id externo del mismo sistema. |
| CP-INT-0079 | RF-INT-079; T06 §5.10; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con WhatsApp: Simulador con 2 plantillas aprobadas y 1 rechazada. | Lista de salida permitida (egress allowlist) por conector; prohibido destino arbitrario configurado por el tenant salvo tipos "genéricos" validados (anti-SSRF). | Una URL base hacia red interna es rechazada. |
| CP-INT-0080 | RF-INT-080; T06 §5.10; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | TLS 1.2+ con validación de certificados del servidor siempre activa; no existe opción para desactivarla. | No hay parámetro equivalente a 3160. |
| CP-INT-0081 | RF-INT-081; T06 §5.10; PRO-O5-06 | O5 | Núcleo | seguridad | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Los datos de tarjeta nunca pasan por GoodApps: formularios alojados o tokenización del proveedor (alcance PCI mínimo). | Revisión de código: ningún DTO contiene PAN/CVV. |
| CP-INT-0082 | RF-INT-082; T06 §5.10; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Minimización: a cada proveedor se envían solo los datos necesarios; los datos personales enviados se documentan en la ficha. | Ficha con sección "Datos intercambiados" completa. |
| CP-INT-0083 | RF-INT-083; T06 §5.10; PRO-O0-02 | O0 | Núcleo | seguridad | TEN-001 con Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador. | Escaneo de secretos en el repositorio y en imágenes (CI) bloquea el merge. | Commit con un token de prueba falla en CI. |
| CP-INT-0084 | RF-INT-084; T06 §5.10; PRO-O10-11 | O10 | Estándar | integración | TEN-001 con Agente local: Un agente emparejado "Sucursal Centro" con impresora térmica simulada y pantalla de turnero. | Agente local GoodApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de resultado; sin… | Un turno llamado en la PWA aparece en la pantalla del turnero vía agente en < 2 s. |
| CP-INT-0085 | RF-INT-085; T06 §5.10; PRO-O0-10 | O0 | Núcleo | integración | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Mensajería (email, SMS, WhatsApp, push) como conectores del marco: T09 decide qué y a quién; T06 entrega, aplica límites, registra estados (enviado, entregado, leído, rebotado, fallido) y recibe mensajes entrantes. | Un rebote actualiza el estado del destinatario en T09 por evento. |
| CP-INT-0086 | RF-INT-086; T06 §5.10; PRO-O2-15 | O2 | Estándar | seguridad | TEN-001 con Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados. | Proveedor LLM como conector con abstracción multi-proveedor, registro de uso (`aiUsageLogs`: función, modelo, tokens, costo, usuario), redacción de datos personales y política "IA solo propone". | Toda propuesta IA queda pendiente de confirmación humana. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-INT-6001 — CA-INT-01. Ningún secreto aparece en respuestas de API, logs, bitácora, exportaciones, errores ni trazas (búsqueda de…**

- Cubre: CA-INT-01; RF-INT-016, RF-INT-083; T06 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Ningún secreto aparece en respuestas de API, logs, bitácora, exportaciones, errores ni trazas (búsqueda de patrones en pruebas automatizadas).

**CP-INT-6002 — CA-INT-02. Un usuario sin `int.conexiones.configurar` recibe 403 al crear/editar conexiones y no ve el menú.**

- Cubre: CA-INT-02; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Un usuario sin `int.conexiones.configurar` recibe 403 al crear/editar conexiones y no ve el menú.

**CP-INT-6003 — CA-INT-03. Un usuario sin `int.credenciales.gestionar` no puede cargar ni rotar secretos aunque edite la conexión; sin…**

- Cubre: CA-INT-03; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Un usuario sin `int.credenciales.gestionar` no puede cargar ni rotar secretos aunque edite la conexión; sin `int.modo.cambiar` no puede pasar una conexión a `production`.

**CP-INT-6004 — CA-INT-04. Un usuario de soporte de plataforma ve el tablero de salud pero nunca valores de secretos ni cuerpos con…**

- Cubre: CA-INT-04; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Un usuario de soporte de plataforma ve el tablero de salud pero nunca valores de secretos ni cuerpos con datos personales sin acceso temporal aprobado (T01).

**CP-INT-6005 — CA-INT-05. Un webhook firmado para el tenant A con el `endpointId` del tenant B es rechazado; las operaciones, mensajes…**

- Cubre: CA-INT-05; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T06 §18.
- Datos de prueba: Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Un webhook firmado para el tenant A con el `endpointId` del tenant B es rechazado; las operaciones, mensajes y alertas de A nunca aparecen en consultas de B.

**CP-INT-6006 — CA-INT-06. Un worker que procesa un trabajo del tenant A no puede descifrar secretos del tenant B (clave de datos por…**

- Cubre: CA-INT-06; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Un worker que procesa un trabajo del tenant A no puede descifrar secretos del tenant B (clave de datos por tenant).

**CP-INT-6007 — CA-INT-07. 503 del proveedor ⇒ reintento con backoff; 400 de validación ⇒ sin reintento; 401 ⇒ conexión…**

- Cubre: CA-INT-07; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces 503 del proveedor ⇒ reintento con backoff; 400 de validación ⇒ sin reintento; 401 ⇒ conexión `blocked_credential`.

**CP-INT-6008 — CA-INT-08. Timeout en una operación no idempotente ⇒ `uncertain` y consulta de reconciliación antes de cualquier…**

- Cubre: CA-INT-08; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Timeout en una operación no idempotente ⇒ `uncertain` y consulta de reconciliación antes de cualquier reintento.

**CP-INT-6009 — CA-INT-09. El circuito se abre con el umbral y ninguna operación se envía mientras está abierto, salvo el sondeo.**

- Cubre: CA-INT-09; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Alertas: Certificado que vence en 7 días; circuito abierto en "SMS demo".
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces El circuito se abre con el umbral y ninguna operación se envía mientras está abierto, salvo el sondeo.

**CP-INT-6010 — CA-INT-10. El mismo archivo de rendición cargado dos veces no duplica pagos; el mismo webhook tres veces produce una…**

- Cubre: CA-INT-10; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces El mismo archivo de rendición cargado dos veces no duplica pagos; el mismo webhook tres veces produce una confirmación.

**CP-INT-6011 — CA-INT-11. La conciliación diaria detecta un pago externo sin intención y lo deja en revisión.**

- Cubre: CA-INT-11; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces La conciliación diaria detecta un pago externo sin intención y lo deja en revisión.

**CP-INT-6012 — CA-INT-12. Generar un archivo de régimen no lo marca presentado.**

- Cubre: CA-INT-12; RF-INT-064; T06 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Generar un archivo de régimen no lo marca presentado.

**CP-INT-6013 — CA-INT-13. La caída de Redis no pierde operaciones: al volver, JOB-INT-07 las recupera desde Mongo (outbox).**

- Cubre: CA-INT-13; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces La caída de Redis no pierde operaciones: al volver, JOB-INT-07 las recupera desde Mongo (outbox).

**CP-INT-6014 — CA-INT-14. En staging no se puede activar una conexión `production`.**

- Cubre: CA-INT-14; RF-INT-030; T06 §17.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces En staging no se puede activar una conexión `production`.

**CP-INT-6015 — CA-INT-15. Toda pantalla que use una conexión `test` muestra el indicador de modo prueba.**

- Cubre: CA-INT-15; RF-INT-029; T06 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios generales» (T06 §17.1)
- Entonces Toda pantalla que use una conexión `test` muestra el indicador de modo prueba.

**CP-INT-5001 — ESC-01. Pago excedente de un hermano (ARS 15.000 contra deuda de ARS 13.000)**

- Cubre: ESC-01; T06 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago excedente de un hermano (ARS 15.000 contra deuda de ARS 13.000)
- Entonces T06 confirma el pago tal como lo informa el proveedor (ARS 15.000) con su referencia; la aplicación de ARS 13.000 y el saldo de ARS 2.000 son de M07.

**CP-INT-5002 — ESC-02. Corrección después de emitir**

- Cubre: ESC-02; T06 §17.2
- Ola: O4 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corrección después de emitir
- Entonces T06 no reenvía a ARCA el comprobante original; la ND/NC de ARS 3.000 es una operación fiscal nueva con su propia idempotencia.

**CP-INT-5003 — ESC-03. Instalación offline en conflicto**

- Cubre: ESC-03; T06 §17.2
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalación offline en conflicto
- Entonces La firma capturada se envía al proveedor de firma una sola vez (clave por `clientMutationId`); el aprovisionamiento no se ejecuta dos veces.

**CP-INT-5004 — ESC-04. Restauración con operaciones externas posteriores a la copia**

- Cubre: ESC-04; T06 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Restauración con operaciones externas posteriores a la copia
- Entonces Tras restaurar, JOB-INT-07 y la conciliación consultan a ARCA y a las pasarelas por identificadores externos y reconstruyen los resultados: no se pide un CAE nuevo para un comprobante ya autorizado ni se cobra dos veces.

**CP-INT-5005 — ESC-05. Cambio de condiciones con lote parcialmente procesado**

- Cubre: ESC-05; T06 §17.2
- Ola: O4 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de condiciones con lote parcialmente procesado
- Entonces Las tandas ya autorizadas no se reenvían; las pendientes usan el contenido que M05 entregue con su versión.

**CP-INT-5006 — ESC-INT-01. ARCA caída 3 horas el día de facturación masiva**

- Cubre: ESC-INT-01; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando ARCA caída 3 horas el día de facturación masiva
- Entonces Circuito abierto, sugerencia de contingencia, CAEA si está habilitado; si no, lote `pending` y aviso; al volver, emisión ordenada sin duplicados.

**CP-INT-5007 — ESC-INT-02. Certificado vence un sábado**

- Cubre: ESC-INT-02; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Alertas: Certificado que vence en 7 días; circuito abierto en "SMS demo".
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Certificado vence un sábado
- Entonces Alertas desde 30 días; al vencer, conexión bloqueada y cola pausada; el lunes se carga el nuevo y la cola se reanuda sin rechazos.

**CP-INT-5008 — ESC-INT-03. SIRO devuelve rendición con una línea ya aplicada por webhook**

- Cubre: ESC-INT-03; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión SIRO: Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando SIRO devuelve rendición con una línea ya aplicada por webhook
- Entonces Deduplicación por id externo; la línea queda `duplicate`, no se imputa dos veces.

**CP-INT-5009 — ESC-INT-04. WhatsApp rechaza la plantilla**

- Cubre: ESC-INT-04; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: WhatsApp: Simulador con 2 plantillas aprobadas y 1 rechazada.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando WhatsApp rechaza la plantilla
- Entonces Mensajes `failed` con causa `validation`; T09 decide alternativa; T06 no reintenta.

**CP-INT-5010 — ESC-INT-05. Comando de reconexión sin respuesta**

- Cubre: ESC-INT-05; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Telemedición: Simulador MDM con 10 medidores ficticios, un comando de corte que responde tarde (incierto).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comando de reconexión sin respuesta
- Entonces `uncertain` ⇒ lectura de estado ⇒ si ya está reconectado se marca OK sin reenviar.

**CP-INT-5011 — ESC-INT-06. Agente local fuera de línea en caja**

- Cubre: ESC-INT-06; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Agente local: Un agente emparejado "Sucursal Centro" con impresora térmica simulada y pantalla de turnero.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Agente local fuera de línea en caja
- Entonces Impresión cae a PDF; alerta a la sucursal; los comandos expirados no se ejecutan al reconectar.

**CP-INT-5012 — ESC-INT-07. Token de prueba en un commit**

- Cubre: ESC-INT-07; T06 §17.2
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Token de prueba en un commit
- Entonces El escaneo de secretos de CI bloquea el merge.

## 3. Casos por caso de uso (CU)

**CP-INT-8001 — CU-13. Confirmar un pago online con comisión**

- Cubre: CU-13; T06 §16.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Confirmar un pago online con comisión
- Entonces Recibe el webhook, reconsulta, deduplica por id externo, emite `int.payment.confirmed` con bruto ARS 8.000, comisión ARS 160 y neto ARS 7.840 (ficticio); M07 imputa.

**CP-INT-8002 — CU-31. Importar una rendición de un ente**

- Cubre: CU-31; RF-INT-066; T06 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importar una rendición de un ente
- Entonces Motor de archivos: hash, layout, vista previa, validaciones (RF-INT-066), aplicación idempotente; reproceso sin duplicar.

**CP-INT-8003 — CU-API-01. Tercero consulta deuda por API**

- Cubre: CU-API-01; T06 §16.1
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tercero consulta deuda por API
- Entonces Se especifica en T10; T06 aporta idempotencia y `externalReferences`.

**CP-INT-8004 — CU-INT-01. Configurar y activar una conexión**

- Cubre: CU-INT-01; RF-INT-030; T06 §16.2
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado conector habilitado por plataforma y licencia (T01). -; actor: responsable de integraciones del tenant (`int.conexiones.configurar`, `int.credenciales.gestionar`; aprobador con `int.modo.cambiar`). -, autenticado en TEN-001 con las capabilities de su rol
- Cuando elige el conector del catálogo → completa configuración no secreta → carga secretos (solo escritura) → elige modo `test` → ejecuta prueba de conexión → resultado OK → solicita pasar a `production` → un segundo usuario aprueba → prueba de conexión en producción → `active`. -
- Entonces `int.connection.activated`; auditoría del cambio de modo. Alternativo o excepción: prueba falla ⇒ queda `draft` con el error normalizado; un ambiente no productivo intenta `production` ⇒ bloqueo (RF-INT-030). -

**CP-INT-8005 — CU-INT-02. Generar y cargar el certificado de ARCA**

- Cubre: CU-INT-02; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado actor: administrador fiscal. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando el sistema genera clave y CSR → el usuario descarga el CSR y lo tramita en ARCA → sube el certificado → el sistema valida módulo, CUIT, vigencia y emisor → el usuario asocia los servicios autorizados → prueba `FEDummy` y obtención de TA. -
- Entonces Se completa «Generar y cargar el certificado de ARCA» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: certificado que no corresponde a la clave ⇒ rechazo; servicio no autorizado en ARCA ⇒ error `auth` con indicación del servicio faltante.

**CP-INT-8006 — CU-INT-03. Autorizar un lote de facturación con resultado incierto**

- Cubre: CU-INT-03; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado actor: sistema (JOB-INT-01/02); supervisor de facturación. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando M05 aprueba el lote → T06 consulta último autorizado → envía en tandas → una tanda queda sin respuesta (timeout) → la operación pasa a `uncertain` → JOB-INT-02 consulta `FECompUltimoAutorizado` y `FECompConsultar` → los comprobantes autorizados se registran con su CAE y el resto se reenvía. -
- Entonces Ningún número duplicado ni salteado; `int.arca.caeObtained` por comprobante.

**CP-INT-8007 — CU-INT-04. Declarar contingencia fiscal y cerrarla**

- Cubre: CU-INT-04; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Contingencia: Una contingencia fiscal cerrada con su acta de conciliación.
- Dado actor: supervisor fiscal (`int.contingencias.declarar`). -, autenticado en TEN-001 con las capabilities de su rol
- Cuando circuito abierto de WSFE por más de PRM-INT-014 min → el sistema sugiere contingencia → el supervisor la declara → la emisión usa CAEA vigente → al recuperarse ARCA, el sistema informa los comprobantes CAEA → conciliación → cierre. -
- Entonces Se completa «Declarar contingencia fiscal y cerrarla» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: no hay CAEA vigente ⇒ la contingencia es "emisión diferida": los comprobantes quedan `pending` y no se entregan al socio como válidos.

**CP-INT-8008 — CU-INT-05. Resolver una operación incierta a mano**

- Cubre: CU-INT-05; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Operaciones: 50 operaciones de ejemplo en todos los estados (incluidas 2 inciertas y 1 en bandeja manual).
- Dado actor: operador con `int.operaciones.resolverManual`; aprobador. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando la operación agotó PRM-INT-012 reconsultas → bandeja → el operador verifica en el portal del proveedor → registra el resultado con evidencia → el aprobador confirma → `manual_resolved` → evento al módulo dueño → la conciliación posterior lo valida.
- Entonces Se completa «Resolver una operación incierta a mano» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-INT-8009 — CU-INT-06. Rotar una credencial comprometida**

- Cubre: CU-INT-06; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Email: Proveedor de plataforma con dominio `demo.ejemplo.com`; 3 rebotes simulados.
- Dado actor: administrador de integraciones. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando regenera la clave en el proveedor → carga el nuevo valor → prueba → período de gracia (PRM-INT-009) → la versión anterior pasa a `revoked`. -
- Entonces `int.credential.rotated`; ningún proceso usa la versión revocada.

**CP-INT-8010 — CU-INT-07. Recibir un webhook de pago duplicado y fuera de orden**

- Cubre: CU-INT-07; RN-INT-034; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Mercado Pago: Simulador con un pago aprobado de ARS 8.000, comisión ARS 160 (CU-13).
- Dado actor: pasarela. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando llega "paid" dos veces y luego "pending" → la firma se valida → el inbox deduplica por id de evento → la reconsulta devuelve `paid` → una sola confirmación; el "pending" tardío no retrocede el estado (RN-INT-034).
- Entonces Se completa «Recibir un webhook de pago duplicado y fuera de orden» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-INT-8011 — CU-INT-08. Conciliar cobranzas del día**

- Cubre: CU-INT-08; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión SIRO: Modo `test` contra simulador, convenio 9999999999 (ficticio), layout `siro.publicacion` y `siro.rendicion`.
- Dado actor: sistema (JOB-INT-06); tesorero. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando descarga el reporte de la pasarela/red → cruza contra confirmaciones locales → genera acta con coincidentes, faltantes locales (pagos "app" sin intención), faltantes externos y diferencias de importe → bandeja de revisión.
- Entonces Se completa «Conciliar cobranzas del día» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-INT-8012 — CU-INT-09. Enviar un comando de corte remoto**

- Cubre: CU-INT-09; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Telemedición: Simulador MDM con 10 medidores ficticios, un comando de corte que responde tarde (incierto).
- Dado actor: M08 (orden de corte aprobada). -, autenticado en TEN-001 con las capabilities de su rol
- Cuando `mor.interruption.approved` (EVT-MOR-12; antes `mor.cut-order.approved`) → T06 envía el comando al MDM/ISP → resultado OK ⇒ `int.meter.commandResult`/`int.network.provisioningResult` → M08 registra. -
- Entonces Se completa «Enviar un comando de corte remoto» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: sin respuesta ⇒ `uncertain` y consulta de estado del equipo; nunca se repite a ciegas; caída ⇒ orden manual en campo.

**CP-INT-8013 — CU-INT-10. Emparejar un agente local y llamar un turno**

- Cubre: CU-INT-10; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Agente local: Un agente emparejado "Sucursal Centro" con impresora térmica simulada y pantalla de turnero.
- Dado actor: administrador de sucursal; empleado de atención. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando instala el agente → ingresa el código de un solo uso → el agente queda `online` con sus dispositivos → el empleado llama el turno desde la PWA → el agente muestra el número en la pantalla.
- Entonces Se completa «Emparejar un agente local y llamar un turno» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-INT-8014 — CU-INT-11. Importar el padrón provincial de IIBB**

- Cubre: CU-INT-11; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión Red Link: Modo `test`, layout de publicación y rendición con archivo de ejemplo de 20 líneas (3 con errores: importe distinto, comprobante anulado, duplicado).
- Dado actor: analista fiscal. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando carga el archivo (o lo trae JOB-INT-26) → vista previa con totales → confirma → M06 aplica la vigencia → el lote de facturación siguiente usa el padrón nuevo.
- Entonces Se completa «Importar el padrón provincial de IIBB» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-INT-8015 — CU-INT-12. Generar un régimen informativo**

- Cubre: CU-INT-12; T06 §16.2
- Ola: O0 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T06 §18.
- Datos de prueba: Conexión ARCA: Modo `test`, CUIT 30-00000000-0 (ficticio), puntos de venta 0001 (servicios) y 0002 (caja), certificado de homologación generado por el simulador.
- Dado actor: analista fiscal. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando M06 pide el archivo del período → T06 genera con el layout vigente, totales y hash → el analista lo descarga y lo presenta en ARCA → carga el acuse → estado `accepted`.
- Entonces Se completa «Generar un régimen informativo» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio
