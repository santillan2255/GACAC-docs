# Casos de prueba de aceptación — T08 NFR — Requisitos no funcionales, seguridad, privacidad, observabilidad y calidad

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T08-NFR-no-funcionales-seguridad.md`](../../especificacion/anexos/T08-NFR-no-funcionales-seguridad.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 25 CP de requisitos funcionales, 5 CP de escenarios ESC y 16 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T08 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Requisitos funcionales propios del anexo (T08 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-NFR-0001 | RF-NFR-001; T08 §5.1; PRO-O1-18 | O1 | Núcleo | seguridad | TEN-001 con Bloqueo legal: LH-DEMO-001 sobre la cuenta de ASO-003 por "litigio" ficticio, `activo` | Inventario de datos personales por entidad/colección: campo, categoría (identificatorio, contacto, fiscal, financiero, ubicación, salud, laboral, imagen, comunicación), sensibilidad (`publica`, `interna`, `personal`, `sensible`… | Un script de CI falla si un campo nuevo no declara `x-pii`; la pantalla lista el 100 % de los campos declarados. |
| CP-NFR-0002 | RF-NFR-002; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Registro de actividades de tratamiento por tenant, con plantilla precargada (gestión del suministro, facturación y cobranza, atención y reclamos, técnica y campo, comunicaciones institucionales, comunicaciones promocionales… | El tenant puede exportar el registro en XLSX/PDF; cada entrada tiene versión y fecha. |
| CP-NFR-0003 | RF-NFR-003; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Avisos: AVI-DEMO-001 v1 y v2 (landing), AVI-DEMO-002 v1 (app) | Avisos de privacidad versionados por tenant y canal (landing, registro, app, formulario presencial), con contenido mínimo del art. 6 (finalidad, destinatarios, existencia del archivo y responsable, obligatoriedad, consecuencias, derechos)… | Cambiar el aviso crea versión nueva; los consentimientos previos quedan ligados a la versión aceptada. |
| CP-NFR-0004 | RF-NFR-004; T08 §5.1; PRO-O1-18 | O1 | Núcleo | regla | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Registro de consentimientos y preferencias: titular, finalidad, versión del aviso, canal, fecha, evidencia (IP truncada, agente de usuario, firma o formulario escaneado), estado (otorgado, revocado, vencido), revocación en un paso. | Revocar el consentimiento promocional impide en ≤ 5 min que el motor de audiencia (T09) incluya al titular. |
| CP-NFR-0005 | RF-NFR-005; T08 §5.1; PRO-O2-18 | O2 | Estándar | regla | TEN-001 con Evidencia: Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento | Separación de comunicaciones institucionales/transaccionales (factura, vencimiento, corte, reclamo) y promocionales; las promocionales exigen consentimiento u oposición respetada y consulta del Registro Nacional "No Llame" para llamadas y… | Una campaña promocional excluye a quienes revocaron o figuran en el registro; queda evidencia de la consulta. |
| CP-NFR-0006 | RF-NFR-006; T08 §5.1; PRO-O1-18 | O1 | Núcleo | regla | TEN-001 con Solicitudes: DSR-2026-000001 (acceso, `respondida`), DSR-2026-000002 (supresión con bloqueo de facturas, `pendienteAprobacion`), DSR-2026-000003 (rectificación… | Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles (acceso… | Una solicitud de acceso genera el informe en ≤ 10 días corridos; la bandeja alerta al 70 % del plazo. |
| CP-NFR-0007 | RF-NFR-007; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099… | Informe de acceso del titular: generación automática (job `nfr:informe-acceso`) de todos los datos del titular en el tenant, en lenguaje claro, PDF y JSON legible, excluyendo datos de terceros y secretos. | El informe incluye cada colección marcada con `x-pii` en que figure el titular; prueba automatizada con titular ficticio en 2 tenants muestra solo los del tenant solicitado. |
| CP-NFR-0008 | RF-NFR-008; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Bloqueo legal: LH-DEMO-001 sobre la cuenta de ASO-003 por "litigio" ficticio, `activo` | Supresión compatible con obligaciones de conservación: si hay bloqueo legal o plazo vigente, se **bloquea** el tratamiento (solo consulta para la obligación) y se programa la supresión o anonimización al vencer; si no, se suprime o… | Suprimir un socio con facturas de hace 3 años no borra facturas; anonimiza contacto y comunicación no obligatorios y marca bloqueo. |
| CP-NFR-0009 | RF-NFR-009; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin… | Políticas de conservación por categoría de dato y tipo de documento, parametrizables por tenant dentro de mínimos y máximos de plataforma, con job diario de aplicación (`nfr:aplicar-conservacion`) y reporte previo de impacto. | Un ensayo con datos ficticios vencidos muestra el reporte previo, la aprobación y el resultado; nada se elimina sin aprobación de la primera ejecución por categoría. |
| CP-NFR-0010 | RF-NFR-010; T08 §5.1; PRO-O1-18 | O1 | Estándar | funcional | TEN-001 con Bloqueo legal: LH-DEMO-001 sobre la cuenta de ASO-003 por "litigio" ficticio, `activo` | Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. | Un bloqueo activo hace que el job de conservación omita esos datos y lo registre. |
| CP-NFR-0011 | RF-NFR-011; T08 §5.1; PRO-O1-18 | O1 | Estándar | funcional | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Anonimización irreversible para BI histórico y para titulares suprimidos: sustitución de identificadores, generalización de domicilio a localidad, fechas a mes, eliminación de texto libre e imágenes. | Pruebas de reidentificación: ningún registro anonimizado conserva DNI, CUIT, nombre, correo, teléfono, calle ni coordenadas. |
| CP-NFR-0012 | RF-NFR-012; T08 §5.1; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Solicitudes: DSR-2026-000001 (acceso, `respondida`), DSR-2026-000002 (supresión con bloqueo de facturas, `pendienteAprobacion`), DSR-2026-000003 (rectificación… | Portal "Mis datos y privacidad" del socio/empleado: ver datos, descargar informe, pedir rectificación, revocar consentimientos, ver avisos aceptados y estado de solicitudes. | Recorrido e2e Playwright con socio ficticio. |
| CP-NFR-0013 | RF-NFR-013; T08 §5.1; PRO-O1-18 | O1 | Núcleo | regla | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Registro de subencargados de plataforma (proveedor, servicio, datos tratados, país, garantía de transferencia, fecha de alta) visible para cada tenant, con aviso al tenant ≥ 30 días antes de incorporar uno nuevo. | El tenant ve la lista vigente y el historial; un alta genera notificación. |
| CP-NFR-0014 | RF-NFR-014; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y cierre. | Un simulacro anual cumple los plazos de notificación de PA-NFR-08 con evidencia. |
| CP-NFR-0015 | RF-NFR-015; T08 §5.1; PRO-O1-18 | O1 | Núcleo | funcional | TEN-001 con Simulacro: RST-DEMO-001 restauración selectiva de TEN-001 con RPO medido 4 min y RTO 3 h 10 min (valores ilustrativos) | Simulacros de restauración: plan, ejecución, mediciones (RPO real, RTO real), verificación de integridad y conciliación externa, acta. | Un simulacro mensual de plataforma y uno trimestral por tenant piloto con acta firmada. |
| CP-NFR-0016 | RF-NFR-016; T08 §5.1; PRO-O1-18 | O1 | Núcleo | regla | TEN-001 con Alertas: ALR-DEMO-001 "Certificado ARCA vence en 29 días" (certificado ficticio), ALR-DEMO-002 "Lag de outbox > 60 s" resuelta | Tablero de salud de plataforma: disponibilidad por servicio, latencias, errores, colas, jobs, integraciones, backups, certificados próximos a vencer, alertas activas, consumo por tenant. | El tablero muestra datos con antigüedad ≤ 60 s. |
| CP-NFR-0017 | RF-NFR-017; T08 §5.1; PRO-O1-18 | O1 | Núcleo | integración | TEN-001 con Alertas: ALR-DEMO-001 "Certificado ARCA vence en 29 días" (certificado ficticio), ALR-DEMO-002 "Lag de outbox > 60 s" resuelta | Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. | Un certificado ARCA que vence en ≤ 30 días aparece como alerta. |
| CP-NFR-0018 | RF-NFR-018; T08 §5.1; PRO-O1-18 | O1 | Núcleo | regla | TEN-001 con Solicitudes: DSR-2026-000001 (acceso, `respondida`), DSR-2026-000002 (supresión con bloqueo de facturas, `pendienteAprobacion`), DSR-2026-000003 (rectificación… | Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). | Una alerta repetida dentro de la ventana de deduplicación no genera una segunda notificación. |
| CP-NFR-0019 | RF-NFR-019; T08 §5.1; PRO-O1-18 | O1 | Estándar | regla | TEN-001 con Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin… | Página de estado de la plataforma y aviso en el admin de incidentes y mantenimientos programados. | Un mantenimiento programado se publica ≥ 72 h antes. |
| CP-NFR-0020 | RF-NFR-020; T08 §5.1; PRO-O0-06 | O0 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099… | Recepción de reportes CSP y de violaciones de seguridad del navegador (`report-to`), agregados y deduplicados. | Un reporte de violación aparece en `cspReports` en ≤ 1 min. |
| CP-NFR-0021 | RF-NFR-021; T08 §5.1; PRO-O0-06 | O0 | Estándar | regla | TEN-001 con Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin… | Publicación de `/.well-known/security.txt` y política de divulgación responsable. | El archivo responde con contacto y vencimiento válidos. |
| CP-NFR-0022 | RF-NFR-022; T08 §5.1; PRO-O0-02 | O0 | Núcleo | funcional | TEN-001 con Evidencia: Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento | Evidencia de liberación por versión: resultados de pruebas, cobertura, SCA, SAST, DAST, imágenes escaneadas, SBOM, pruebas de carga cuando corresponda y aprobaciones. | No se puede promover a producción una versión sin evidencia completa (gate del pipeline). |
| CP-NFR-0023 | RF-NFR-023; T08 §5.1; PRO-O1-18 | O1 | Estándar | seguridad | TEN-001 con Claves: Metadatos de DEK por tenant (sin material), una en `soloDescifrado` | Consola de claves: listado de claves de cifrado y firma (metadatos, nunca material), fecha de creación, próxima rotación, estado, y rotación manual con doble aprobación. | Una rotación manual re-envuelve todas las DEK de un tenant sin indisponibilidad. |
| CP-NFR-0024 | RF-NFR-024; T08 §5.1; PRO-O0-06 | O0 | Núcleo | regla | TEN-001 con Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas | Restricción y registro de exportaciones con datos personales: motivo opcional, tope de filas por rol, marca de agua con usuario y fecha en PDF/XLSX, vencimiento del archivo generado. | Cada exportación queda en auditoría con filtros, cantidad y destino; el archivo expira a las 24 h. |
| CP-NFR-0025 | RF-NFR-025; T08 §5.1; PRO-O1-18 | O1 | Estándar | funcional | TEN-001 con Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin… | Gestión de cuotas por tenant (requests por minuto, jobs concurrentes, almacenamiento, exportaciones, consumo de IA, llamadas BI) visible en el tablero del tenant y en plataforma. | Superar la cuota devuelve 429 con `Retry-After` y la cuota consumida se ve en el tablero. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-NFR-5001 — ESC-01. Pago excedente de un hermano: A debe ARS 13.000 y paga ARS 15.000; B tiene deuda propia; se confirman 13.000 contra A y 2.000 quedan a…**

- Cubre: ESC-01; RNF-NFR-152, RNF-NFR-204, RNF-NFR-205, RNF-NFR-212, RNF-NFR-213, RNF-NFR-218, RNF-NFR-229; T08 §17.1
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Dataset de carga: Generador `seed:carga --perfil=grande` con 150.000 suministros y 5 años de movimientos sintéticos, solo en staging
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago excedente de un hermano: A debe ARS 13.000 y paga ARS 15.000; B tiene deuda propia; se confirman 13.000 contra A y 2.000 quedan a favor o pendientes; no se paga a B.
- Entonces Prueba de integración y e2e con dataset canónico; propiedad monetaria "no se crea ni se pierde un centavo"; webhook triplicado.

**CP-NFR-5002 — ESC-02. Corrección recibida después de emitir: emitido ARS 12.000, recalculado ARS 15.000; se simula la diferencia de ARS 3.000, se aprueba y se…**

- Cubre: ESC-02; RNF-NFR-230, RNF-NFR-110, RNF-NFR-179, RNF-NFR-223; T08 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099 "Cooperativa en baja" (para RNF-NFR-108); todos con `isFictitious: true`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corrección recibida después de emitir: emitido ARS 12.000, recalculado ARS 15.000; se simula la diferencia de ARS 3.000, se aprueba y se conserva el original.
- Entonces Prueba de que la simulación no escribe; que el original no cambia (hash RNF-NFR-230); auditoría del ajuste.

**CP-NFR-5003 — ESC-03. Instalación offline en conflicto: la orden se modifica mientras el instalador está sin conexión; al sincronizar se conserva la evidencia y…**

- Cubre: ESC-03; RNF-NFR-017, RNF-NFR-156, RNF-NFR-187, RNF-NFR-190, RNF-NFR-213, RNF-NFR-219; T08 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Evidencia: Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalación offline en conflicto: la orden se modifica mientras el instalador está sin conexión; al sincronizar se conserva la evidencia y se detecta el conflicto, sin duplicar salida de equipo.
- Entonces Suite Playwright offline + integración de sincronización.

**CP-NFR-5004 — ESC-04. Recuperación con operaciones externas posteriores a la copia: se restaura información anterior a un pago o emisión fiscal; se reconcilian…**

- Cubre: ESC-04; RNF-NFR-037, RNF-NFR-043, RNF-NFR-044, RNF-NFR-045, RNF-NFR-217, RNF-NFR-221; T08 §17.1
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Simulacro: RST-DEMO-001 restauración selectiva de TEN-001 con RPO medido 4 min y RTO 3 h 10 min (valores ilustrativos)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recuperación con operaciones externas posteriores a la copia: se restaura información anterior a un pago o emisión fiscal; se reconcilian identificadores externos y no se reenvía.
- Entonces Simulacro trimestral con emisión y pago posteriores al punto de restauración.

**CP-NFR-5005 — ESC-05. Cambio de condiciones en un período parcialmente procesado: el lote mantiene universo y versiones aplicadas; reejecutar no reescribe…**

- Cubre: ESC-05; RNF-NFR-013, RNF-NFR-179, RNF-NFR-215, RNF-NFR-216, RNF-NFR-223; T08 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Personas: ASO-001 (socia, con MFA), ASO-002 y ASO-003 (hermanos, mismo domicilio ficticio), ADH-001 (menor adherente con representante ASO-002); documentos y CUIT generados con dígito verificador válido en rango ficticio; correos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de condiciones en un período parcialmente procesado: el lote mantiene universo y versiones aplicadas; reejecutar no reescribe documentos.
- Entonces Prueba de lote con cambio tarifario a mitad; reejecución sin cambios.

## 3. Casos por caso de uso (CU)

**CP-NFR-8001 — CU-29. Alta de USR-CAJ-01 con rol Cajero en TEN-001 restringido a sucursal; intento de cambiar tarifa o anular sin aprobación es denegado y…**

- Cubre: CU-29; RNF-NFR-062, RNF-NFR-090, RNF-NFR-110, RNF-NFR-115, RNF-NFR-150; T08 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin TEN-002), USR-PLAT-01 (plataforma), USR-SRE-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Alta de USR-CAJ-01 con rol Cajero en TEN-001 restringido a sucursal; intento de cambiar tarifa o anular sin aprobación es denegado y registrado; al perder la función se revocan permisos y sesiones.
- Entonces RNF-NFR-062 (revocación ≤ 60 s), RNF-NFR-090, RNF-NFR-110, RNF-NFR-115, RNF-NFR-150.

**CP-NFR-8002 — CU-GOB-01. Cambio de BON-VAR-30 del 30 % al 20 % con vigencia futura y aprobación; evidencia visible al usuario autorizado; TEN-002 no ve los eventos**

- Cubre: CU-GOB-01; RNF-NFR-110, RNF-NFR-117, RNF-NFR-148; T08 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Evidencia: Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de BON-VAR-30 del 30 % al 20 % con vigencia futura y aprobación; evidencia visible al usuario autorizado; TEN-002 no ve los eventos.
- Entonces RNF-NFR-110 a 113, RNF-NFR-117, RNF-NFR-148.

**CP-NFR-8003 — CU-API-01. CLI-BI-A con alcances `facturacion:leer` y `cobranza:leer` consulta TEN-001 paginado con fecha de corte; no accede a TEN-002 ni modifica…**

- Cubre: CU-API-01; RNF-NFR-019, RNF-NFR-022, RNF-NFR-103, RNF-NFR-233, RNF-NFR-175; T08 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099 "Cooperativa en baja" (para RNF-NFR-108); todos con `isFictitious: true`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CLI-BI-A con alcances `facturacion:leer` y `cobranza:leer` consulta TEN-001 paginado con fecha de corte; no accede a TEN-002 ni modifica; revocación efectiva.
- Entonces RNF-NFR-019, RNF-NFR-022, RNF-NFR-103, RNF-NFR-233, RNF-NFR-175.

**CP-NFR-8004 — CU-SEG-01. USR-ADM-A registra factor, opera con verificación reforzada, recupera contraseña sin perder el factor y usa el procedimiento de pérdida de…**

- Cubre: CU-SEG-01; RNF-NFR-060, RNF-NFR-231, RNF-NFR-232; T08 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T08 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099 "Cooperativa en baja" (para RNF-NFR-108); todos con `isFictitious: true`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando USR-ADM-A registra factor, opera con verificación reforzada, recupera contraseña sin perder el factor y usa el procedimiento de pérdida de factor; se notifican cambios e invalidan sesiones.
- Entonces RNF-NFR-060 a 066, RNF-NFR-231, RNF-NFR-232.

**CP-NFR-8005 — CU-ARQ-01. Pedido de Internet que pasa por CRM, técnica, contratos y ERP sin que un reintento genere dos contratos o dos facturas**

- Cubre: CU-ARQ-01; RNF-NFR-212, RNF-NFR-221; T08 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Usuarios: USR-ADM-A (admin TEN-001, MFA requerido), USR-CAJ-01 (cajero), USR-DPO-A (responsable de datos TEN-001), USR-AUD-A (auditor), USR-ADM-B (admin TEN-002), USR-PLAT-01 (plataforma), USR-SRE-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pedido de Internet que pasa por CRM, técnica, contratos y ERP sin que un reintento genere dos contratos o dos facturas.
- Entonces RNF-NFR-212 a 215, RNF-NFR-221.

**CP-NFR-8006 — CU-NFR-01. Un socio pide acceso a sus datos**

- Cubre: CU-NFR-01; RNF-NFR-107; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T08 §18.
- Datos de prueba: Personas: ASO-001 (socia, con MFA), ASO-002 y ASO-003 (hermanos, mismo domicilio ficticio), ADH-001 (menor adherente con representante ASO-002); documentos y CUIT generados con dígito verificador válido en rango ficticio; correos…
- Dado actor: socia ficticia ASO-001 de TEN-001. Desde PAN-NFR-09 pide "Descargar mis datos". Como está autenticada con MFA la solicitud queda `verificada`; JOB-NFR-02 localiza sus datos y JOB-NFR-01 genera el informe. El responsable de datos revisa y aprueba; la socia recibe aviso y descarga el PDF por URL firmada de 5 min. Control: el informe no incluye datos de su hermano que comparte domicilio (escenario 88) ni de…
- Cuando Un socio pide acceso a sus datos
- Entonces Actor: socia ficticia ASO-001 de TEN-001. Desde PAN-NFR-09 pide "Descargar mis datos". Como está autenticada con MFA la solicitud queda `verificada`; JOB-NFR-02 localiza sus datos y JOB-NFR-01 genera el informe. El responsable de datos revisa y aprueba; la socia recibe aviso y descarga el PDF por URL firmada de 5 min. Control: el informe no incluye datos de su hermano que comparte domicilio (escenario 88) ni de TEN-002. Plazo: ≤ 10 días corridos (RNF-NFR-107).

**CP-NFR-8007 — CU-NFR-02. Supresión con obligación de conservación**

- Cubre: CU-NFR-02; RN-NFR-017; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Supresión con obligación de conservación
- Entonces Un ex-socio sin servicios activos pide la supresión. Tiene facturas de hace 3 años. El análisis propone: suprimir teléfono, correo, preferencias, consentimientos promocionales y comentarios del muro; bloquear facturas, recibos y contrato (PRM-NFR-040/041) hasta su vencimiento; anonimizar tickets cerrados. Aprobación por un segundo usuario; EVT-NFR-06 a cada módulo; registro en `erasureLedger`; respuesta fundada al titular. Control: ninguna factura se borra (RN-NFR-017).

**CP-NFR-8008 — CU-NFR-03. Revocación de consentimiento promocional**

- Cubre: CU-NFR-03; RF-NFR-005; T08 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Avisos: AVI-DEMO-001 v1 y v2 (landing), AVI-DEMO-002 v1 (app)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Revocación de consentimiento promocional
- Entonces El socio desactiva "Novedades comerciales" en PWA. EVT-NFR-03 llega a COM y en ≤ 5 min queda fuera de audiencias promocionales; sigue recibiendo avisos de factura y corte (transaccionales, RF-NFR-005).

**CP-NFR-8009 — CU-NFR-04. Incidente: credencial de pasarela expuesta**

- Cubre: CU-NFR-04; RNF-NFR-069; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T08 §18.
- Datos de prueba: Incidente: INC-2026-0001 tipo `simulacro`, SEV3, cerrado con post-mortem
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Incidente: credencial de pasarela expuesta
- Entonces Una alerta de secret scanning detecta una credencial de sandbox en un PR (o una alerta de uso anómalo detecta uso de una credencial productiva). Se abre INC en `detectado`, se rota la credencial en la bóveda (≤ 4 h, RNF-NFR-069), se evalúa impacto, se notifica a la cooperativa en el plazo de PA-NFR-08 y se cierra con post-mortem.

**CP-NFR-8010 — CU-NFR-05. Restauración selectiva con operaciones externas (ESC-04)**

- Cubre: CU-NFR-05; RNF-NFR-037; relacionados: ESC-04; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Simulacro: RST-DEMO-001 restauración selectiva de TEN-001 con RPO medido 4 min y RTO 3 h 10 min (valores ilustrativos)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Restauración selectiva con operaciones externas (ESC-04)
- Entonces Un operador de TEN-001 importa por error un archivo que sobrescribe domicilios de 5.000 cuentas. El tenant solicita restauración (API-NFR-21). Plataforma restaura TEN-001 a T−2 h en ambiente aislado (RNF-NFR-037), compara y reincorpora solo domicilios; JOB-NFR-19 verifica que los pagos confirmados y los CAE obtenidos después de T−2 h se conservan; JOB-NFR-15 reaplica supresiones. TEN-002 no se afecta.

**CP-NFR-8011 — CU-NFR-06. Lote interrumpido y reanudado**

- Cubre: CU-NFR-06; RNF-NFR-010, RNF-NFR-213; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Dataset de carga: Generador `seed:carga --perfil=grande` con 150.000 suministros y 5 años de movimientos sintéticos, solo en staging
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lote interrumpido y reanudado
- Entonces Durante `fac:emitir-lote` de 50.000 suministros cae un worker al 60 %. El lote se reanuda desde el checkpoint en ≤ 2 min, termina dentro de la meta (RNF-NFR-010) y no hay comprobantes duplicados (índice único RNF-NFR-213; escenario 6).

**CP-NFR-8012 — CU-NFR-07. Tenant ruidoso**

- Cubre: CU-NFR-07; RNF-NFR-020, RNF-NFR-021; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Registro de tratamientos: Plantilla completa de 12 finalidades (RF-NFR-002) en TEN-001; TEN-002 con 3 personalizadas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tenant ruidoso
- Entonces TEN-002 lanza la exportación completa de su historia mientras TEN-001 cobra en 30 cajas. La exportación corre en cola `bulk` con cuota (RNF-NFR-020, 021); los cobros de TEN-001 mantienen p95 ≤ 800 ms (AGR-020).

**CP-NFR-8013 — CU-NFR-08. Archivo infectado**

- Cubre: CU-NFR-08; RNF-NFR-078; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Incidente: INC-2026-0001 tipo `simulacro`, SEV3, cerrado con post-mortem
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Archivo infectado
- Entonces Un técnico sube una foto que en realidad es un ejecutable renombrado: se rechaza por firma de contenido (RNF-NFR-078). Un PDF con malware pasa el tipo pero el antivirus lo detecta: queda en cuarentena, la orden sigue sin el adjunto y se genera EVT-NFR-16.

**CP-NFR-8014 — CU-NFR-09. Liberación bloqueada**

- Cubre: CU-NFR-09; RNF-NFR-148, RNF-NFR-165; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T08 §18.
- Datos de prueba: Evidencia: Release 0.0.1-demo con todos los checks en verde y un SCA con una vulnerabilidad media aceptada con vencimiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Liberación bloqueada
- Entonces Una versión tiene una vulnerabilidad alta en una dependencia y una ruta nueva sin caso de aislamiento; el pipeline bloquea la promoción a producción (RNF-NFR-148, RNF-NFR-165) hasta corregir.

**CP-NFR-8015 — CU-NFR-10. Rotación de DEK de un tenant**

- Cubre: CU-NFR-10; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T08 §18.
- Datos de prueba: Claves: Metadatos de DEK por tenant (sin material), una en `soloDescifrado`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rotación de DEK de un tenant
- Entonces Por política anual se rota la DEK general de TEN-001: se crea la versión nueva, la anterior pasa a `soloDescifrado`, JOB-NFR-08 re-cifra en segundo plano sin indisponibilidad y la consola muestra el progreso.

**CP-NFR-8016 — CU-NFR-11. Pago excedente con webhook duplicado (ESC-01 + escenario 7)**

- Cubre: CU-NFR-11; relacionados: ESC-01; T08 §16.2
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T08 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (`America/Argentina/Cordoba`), TEN-002 "Cooperativa Ejemplo B" (`America/Argentina/Buenos_Aires`), TEN-099 "Cooperativa en baja" (para RNF-NFR-108); todos con `isFictitious: true`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago excedente con webhook duplicado (ESC-01 + escenario 7)
- Entonces Hermano A (deuda ARS 13.000) paga ARS 15.000 por pasarela; el webhook llega 3 veces. Se confirma un solo pago, se imputan ARS 13.000 y ARS 2.000 quedan a favor; B no se ve afectado.
