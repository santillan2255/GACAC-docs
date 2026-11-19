# 29a — Casos de prueba de aceptación: olas O0 a O3

| Campo | Valor |
|---|---|
| Documento | 29a — Casos de prueba de aceptación y criterios por ola (parte 1 de 4) |
| Portada | [`29-criterios-y-casos-aceptacion-por-ola.md`](29-criterios-y-casos-aceptacion-por-ola.md) (formato del caso, criterios comunes, resumen de cobertura, observaciones) |
| Artefactos | 9.2 Casos de prueba de aceptación; 9.3 Criterios de aceptación por ola |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Contenido | Sección 2.1 (O0), 2.2 (O1), 2.3 (O2) y 2.4 (O3) |

Todos los datos de este documento son ficticios y salen del juego canónico (T08 RNF-NFR-161, T01 §18, M02 §18). El formato de cada caso, la escala de prioridad y los tipos están en la sección 1 de la portada. Los criterios comunes de entrada, de salida y la definición de terminado que se aplican a todas las olas están en la sección 2.0 de la portada; acá se agregan solo las condiciones propias de cada ola.

---

## 2.1 O0 — Fundaciones

### 2.1.1 Criterios de aceptación de O0

| ID | Condición de salida de O0 | Fuente |
|---|---|---|
| CS-O0-01 | `docker compose up` levanta API, web, worker, MongoDB, Redis, almacenamiento de objetos, correo de prueba y simuladores, con `npm run seed:demo` cargado. | `03` §4.2 (1) |
| CS-O0-02 | Un usuario de prueba entra por el pre-login de `coop-ejemplo-a`, ve el AdminShell con el menú vacío filtrado por capability, cierra sesión y el refresh rota. | `03` §4.2 (2) |
| CS-O0-03 | Una consulta con un ID de TEN-002 devuelve 404; un plugin sin contexto de tenant lanza error. | `03` §4.2 (3) |
| CS-O0-04 | Un cambio de prueba deja auditoría encadenada y evento en outbox; el relay lo publica y un job lo consume una sola vez. | `03` §4.2 (4) |
| CS-O0-05 | Un PDF se genera desde plantilla y se descarga por URL firmada; un secreto se guarda en la bóveda y no aparece en logs. | `03` §4.2 (5) |
| CS-O0-06 | El CI completo está verde (lint, `check:structure`, unitarias, integración, aislamiento, contrato, imagen, SBOM, e2e de humo). | `03` §4.2 (6); `07` §10.1 |
| CS-O0-07 | Línea base de carga k6 de login y lectura por ID en `staging` registrada (carga obligatoria en O0). | PRO-O0-21; RNF-NFR-001; RNF-NFR-145; `07` §11.3 |
| CS-O0-08 | Los 305 RF de O0 en `Implementado` o `Parcial` con la parte de O0 cumplida, `npm run trace:check` sin faltantes y evidencia en `docs/evidencias/O0/`. | `03` §1, R20; PRO-GEN-02 |
| CS-O0-09 | Casos CPA-O0 de prioridad P1 aprobados al 100 %; P2 al 100 % o con defecto S3/S4 con ticket, responsable y ola de corrección. | `07` §12.1; sección 1.2 de la portada |

### 2.1.2 Casos de prueba de O0

#### CPA-O0-001 — Entorno local completo con un comando

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (1); RNF-NFR-161 (juego canónico desde O0) |
| Precondiciones | Repositorio clonado; Docker disponible; sin variables productivas. |
| Datos ficticios | `seed:demo` con TEN-001 "Cooperativa Ejemplo A" (`coop-ejemplo-a`), TEN-002 "Cooperativa Ejemplo B", tenant PLATFORM. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `local` |

```gherkin
Escenario: CPA-O0-001 levantar el entorno completo
  Dado un equipo de desarrollo sin servicios en ejecución
  Cuando se ejecuta "docker compose up" y luego "npm run seed:demo"
  Entonces API, web, worker, MongoDB, Redis, almacenamiento de objetos, correo de prueba y simuladores quedan saludables
  Y los tenants TEN-001 y TEN-002 existen con datos marcados como ficticios
```

#### CPA-O0-002 — Login de personal por pre-login y menú filtrado por capability

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (2); TST-IAM-15, TST-IAM-16, TST-IAM-30; ESC-UXD-13, ESC-UXD-23 |
| Precondiciones | Seed de O0 cargado; usuario de personal de TEN-001 activo sin capabilities de negocio. |
| Datos ficticios | Usuario `operador.a@example.com` en `coop-ejemplo-a`; contraseña de prueba generada por el seed. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O0`) · `ci` y `staging` |

```gherkin
Escenario: CPA-O0-002 login, menú vacío filtrado, logout y rotación del refresh
  Dado el pre-login de "coop-ejemplo-a" muestra el nombre del tenant elegido
  Cuando el operador ingresa con sus credenciales
  Entonces ve el AdminShell con el menú vacío porque no tiene capabilities de negocio
  Y un ítem cuya capability no tiene no aparece en el menú (ESC-UXD-13)
  Cuando el operador refresca la sesión
  Entonces recibe un refresh token nuevo y el anterior queda invalidado (TST-IAM-15)
  Cuando el operador cierra sesión
  Entonces el refresh token deja de servir (TST-IAM-16)
  Y una ruta registrada sin capability impide el arranque de la API en CI (TST-IAM-30)
```

#### CPA-O0-003 — Login fallido con mensaje genérico, bloqueo y recuperación

| Campo | Valor |
|---|---|
| Cubre | TST-IAM-10, TST-IAM-11, TST-IAM-12, TST-IAM-13, TST-IAM-14, TST-IAM-21; ESC-UXD-22 |
| Precondiciones | Política de bloqueo por intentos fallidos con sus valores por defecto de T02. |
| Datos ficticios | `operador.a@example.com` y un correo inexistente `noexiste@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O0-003 el login no revela si la cuenta existe
  Dado el pre-login de "coop-ejemplo-a"
  Cuando se ingresa una contraseña incorrecta para un usuario existente y luego para un correo inexistente
  Entonces ambos casos muestran el mismo mensaje genérico
  Cuando se supera el umbral de intentos fallidos
  Entonces la cuenta queda bloqueada temporalmente y el intento queda auditado
  Cuando el usuario pide recuperar la contraseña
  Entonces recibe un enlace de un solo uso con vencimiento y las sesiones anteriores se revocan al cambiarla
```

#### CPA-O0-004 — Aislamiento entre tenants por HTTP, recursos y cambio de ámbito

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (3); A1, A2, A6, A7, A8, A9, A16 (T01 §17.2); TST-IAM-01, TST-IAM-02, TST-IAM-03, TST-IAM-05; CA-WFL-30; equivalente parcial de AC-13 de `07` |
| Precondiciones | Suite `npm run test:isolation` habilitada; TEN-001 y TEN-002 con códigos internos iguales (RNF-NFR-161). |
| Datos ficticios | Documento de prueba con `_id` de TEN-002; archivo `doc-demo-b.pdf` de TEN-002; usuario con membresía en ambos tenants. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración y extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O0-004 un usuario de TEN-001 no ve ni infiere datos de TEN-002
  Dado un operador autenticado en TEN-001
  Cuando consulta por ID un recurso que pertenece a TEN-002
  Entonces recibe 404 sin revelar que el recurso existe
  Y cambiar el identificador de tenant en el encabezado, el token o el cuerpo no le da acceso
  Y la URL firmada de un archivo de TEN-002 no se puede generar desde TEN-001
  Cuando un usuario con membresía en ambos tenants cambia de ámbito
  Entonces el token emitido solo habilita el tenant elegido y la caché no mezcla datos de los dos
```

#### CPA-O0-005 — Plugin de tenancy, jobs y eventos sin contexto

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (3); A3, A4, A5 (T01 §17.2); TST-IAM-04; CA-WFL-31, CA-WFL-32; RNF-NFR-149 |
| Precondiciones | Plugin de tenancy de Mongoose activo; worker de jobs en ejecución. |
| Datos ficticios | Job de prueba `demo:echo` y evento `demo.changed` de TEN-001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-005 ninguna operación corre sin contexto de tenant
  Dado el plugin de tenancy activo
  Cuando una consulta, un agregado o una actualización masiva se ejecuta sin contexto de tenant
  Entonces la operación lanza error y no devuelve ni modifica documentos
  Cuando se encola un job sin tenantId o un evento de TEN-001 lo procesa un consumidor con contexto de TEN-002
  Entonces el job se rechaza y el consumidor no lee datos del otro tenant
```

#### CPA-O0-006 — Auditoría encadenada, outbox y consumo único

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (4); TST-IAM-60, TST-IAM-61, TST-IAM-63, TST-IAM-68; CA-WFL-50, CA-WFL-51; T01 §17.4 |
| Precondiciones | Relay de outbox y worker activos. |
| Datos ficticios | Entidad de prueba `demoItem` de TEN-001 con valor "Ejemplo 1". |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-006 un cambio audita, publica y se consume una vez
  Dado un operador de TEN-001 con permiso sobre "demoItem"
  Cuando modifica el valor de "Ejemplo 1" a "Ejemplo 2"
  Entonces queda un registro de auditoría con antes y después, enlazado por hash al registro anterior
  Y el evento queda en outbox en la misma transacción
  Cuando la transacción falla antes del commit
  Entonces no queda ni el cambio ni el evento
  Cuando el relay publica el evento dos veces por un reintento
  Entonces el job consumidor lo procesa una sola vez
  Y la auditoría no se puede modificar ni borrar desde la API
```

#### CPA-O0-007 — Idempotencia de operaciones con Idempotency-Key

| Campo | Valor |
|---|---|
| Cubre | TST-IAM-65; T01 §17.4; RNF-NFR-212 |
| Precondiciones | Endpoint de escritura de prueba con soporte de `Idempotency-Key`. |
| Datos ficticios | Clave `idem-demo-0001`. |
| Prioridad · Tipo | P1 · No funcional (confiabilidad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-007 doble envío con la misma clave
  Dado una operación de escritura enviada con la clave "idem-demo-0001"
  Cuando se reenvía con la misma clave y el mismo cuerpo
  Entonces se devuelve la misma respuesta sin repetir el efecto
  Cuando se reenvía con la misma clave y un cuerpo distinto
  Entonces se rechaza con un error de conflicto en formato RFC 9457
```

#### CPA-O0-008 — Job masivo reanudable y orden de eventos

| Campo | Valor |
|---|---|
| Cubre | CA-WFL-52, CA-WFL-56; T01 §17.4; RNF-NFR-215 |
| Precondiciones | Job de prueba de 10.000 ítems con cursor persistido. |
| Datos ficticios | 10.000 registros `demoItem` generados por el seed de volumen. |
| Prioridad · Tipo | P2 · No funcional (confiabilidad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-008 un job interrumpido retoma desde su cursor
  Dado un job masivo procesando 10.000 ítems
  Cuando el worker se detiene a mitad del proceso
  Entonces al reiniciar el job continúa desde el último cursor confirmado
  Y ningún ítem queda procesado dos veces ni sin procesar
  Y los eventos de una misma entidad se consumen en orden
```

#### CPA-O0-009 — PDF desde plantilla, URL firmada y numeración sin huecos

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (5); CA-WFL-07, CA-WFL-08, CA-WFL-11 |
| Precondiciones | Servicio de documentos y numeración activos; plantilla de prueba publicada. |
| Datos ficticios | Plantilla "Constancia demo" con variables `{nombre}` y `{fecha}`; serie de numeración `DEMO-A`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O0-009 generar y descargar un PDF
  Dado la plantilla "Constancia demo" publicada en TEN-001
  Cuando se genera la constancia para "Ana Demo"
  Entonces el PDF queda en el almacenamiento privado y se descarga por una URL firmada con vencimiento
  Y una URL vencida o alterada se rechaza
  Cuando se genera con una variable obligatoria faltante
  Entonces la generación falla con un error explícito y no deja un PDF incompleto
  Cuando dos procesos piden número de la serie "DEMO-A" en paralelo
  Entonces reciben números consecutivos distintos y la serie no tiene huecos
```

#### CPA-O0-010 — Gestión documental con versiones y cuarentena

| Campo | Valor |
|---|---|
| Cubre | CA-WFL-09, CA-WFL-10 |
| Precondiciones | Antivirus simulado activo en el pipeline de archivos. |
| Datos ficticios | `adjunto-demo.pdf` y el archivo de prueba EICAR. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-010 versionar un documento y bloquear un archivo infectado
  Dado un documento con "adjunto-demo.pdf" en versión 1
  Cuando se carga una versión nueva
  Entonces la versión 1 se conserva y la vigente es la 2
  Cuando se carga el archivo de prueba EICAR
  Entonces queda en cuarentena y no se puede descargar
```

#### CPA-O0-011 — Bóveda de secretos sin exposición en logs

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (5); CA-INT-01, CA-INT-06; TST-IAM-22 |
| Precondiciones | Bóveda configurada con clave por tenant. |
| Datos ficticios | Secreto de prueba `TOKEN-DEMO-NO-REAL` para un conector simulado de TEN-001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O0-011 un secreto se guarda cifrado y nunca se muestra
  Dado un administrador de TEN-001
  Cuando guarda el secreto "TOKEN-DEMO-NO-REAL" en la bóveda
  Entonces la API devuelve solo una referencia y la interfaz lo muestra enmascarado
  Y ningún log, traza ni evento contiene el valor
  Y un worker con contexto de TEN-002 no puede descifrarlo
```

#### CPA-O0-012 — Marco de conectores con simulador: reintentos, tiempo de espera y corte de circuito

| Campo | Valor |
|---|---|
| Cubre | CA-INT-07, CA-INT-08, CA-INT-09, CA-INT-13 |
| Precondiciones | Simulador de proveedor configurable (éxito, error, demora). |
| Datos ficticios | Conector `demo-proveedor` en modo simulación. |
| Prioridad · Tipo | P2 · No funcional (resiliencia) |
| Nivel · Ambiente | Contrato e integración · `ci` |

```gherkin
Escenario: CPA-O0-012 el conector se protege de un proveedor que falla
  Dado el conector "demo-proveedor" contra el simulador
  Cuando el simulador responde 503
  Entonces se reintenta con espera creciente
  Y un 400 de validación no se reintenta y un 401 deja la conexión "blocked_credential"
  Cuando una operación no idempotente agota el tiempo de espera
  Entonces queda "uncertain" y se consulta para reconciliar antes de cualquier reintento
  Cuando las fallas superan el umbral del circuito
  Entonces el circuito se abre y no se envía ninguna operación salvo el sondeo
  Cuando Redis cae y vuelve
  Entonces ninguna operación se pierde: se recuperan desde el outbox en MongoDB
```

#### CPA-O0-013 — Shells, diccionario y accesibilidad base

| Campo | Valor |
|---|---|
| Cubre | ESC-UXD-04, ESC-UXD-05, ESC-UXD-09, ESC-UXD-15, ESC-UXD-20, ESC-UXD-21, ESC-UXD-25; RNF-NFR-155 |
| Precondiciones | Design system y diccionario base publicados. |
| Datos ficticios | Término "Socio" en TEN-001 y "Asociado" en TEN-002 (escenario 51 de BASE). |
| Prioridad · Tipo | P2 · No funcional (accesibilidad y experiencia) |
| Nivel · Ambiente | Extremo a extremo con axe · `ci` |

```gherkin
Escenario: CPA-O0-013 la interfaz usa el diccionario y es accesible
  Dado los shells de administración y de socio
  Cuando se navega con teclado, con texto ampliado y con movimiento reducido
  Entonces los componentes conservan foco visible y no hay violaciones "serious" ni "critical"
  Y TEN-001 muestra "Socio" donde TEN-002 muestra "Asociado"
  Y una clave sin traducción muestra el valor por defecto, nunca la clave cruda
  Y la exportación de un listado respeta los filtros y las columnas visibles
```

#### CPA-O0-014 — Pipeline de CI bloqueante

| Campo | Valor |
|---|---|
| Cubre | `03` §4.2 (6); ESC-INT-07; TST-IAM-23; T01 §17.1; T01 §17.8; RNF-NFR-164, RNF-NFR-165 |
| Precondiciones | Pipeline de `07` §10.1 configurado. |
| Datos ficticios | Rama de prueba con un secreto ficticio agregado a propósito y un import entre módulos prohibido. |
| Prioridad · Tipo | P1 · No funcional (calidad) |
| Nivel · Ambiente | CI · `ci` |

```gherkin
Escenario: CPA-O0-014 el pipeline bloquea lo que no cumple
  Dado un PR que agrega un secreto ficticio y un import directo entre módulos
  Cuando corre el pipeline
  Entonces el escaneo de secretos y "check:structure" fallan y el PR no se puede integrar
  Cuando se corrigen ambos problemas
  Entonces el pipeline completo queda verde dentro de la duración de RNF-NFR-164
  Y "npm run seed:demo" con variables de producción se niega a correr
```

#### CPA-O0-015 — Línea base de carga de login y lectura por ID

| Campo | Valor |
|---|---|
| Cubre | CS-O0-07; RNF-NFR-001; RNF-NFR-145 |
| Precondiciones | `staging` con volumen sintético. |
| Datos ficticios | 200 usuarios de prueba de TEN-001 generados por el seed de volumen. |
| Prioridad · Tipo | P1 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga k6 · `staging` |

```gherkin
Escenario: CPA-O0-015 registrar la línea base de rendimiento
  Dado el escenario k6 de login y lectura por ID de PRO-O0-21
  Cuando se ejecuta con el perfil de carga de referencia de "07" §6.1
  Entonces los percentiles cumplen las metas de RNF-NFR-001 y el informe queda en "docs/evidencias/O0/"
```

---

## 2.2 O1 — Plataforma, IAM, configuración y workflow

### 2.2.1 Criterios de aceptación de O1

| ID | Condición de salida de O1 | Fuente |
|---|---|---|
| CS-O1-01 | Un administrador de plataforma da de alta TEN-001 con el asistente, completa el checklist y lo pasa de Preparación a Prueba. | `03` §5.2 (1) |
| CS-O1-02 | TEN-001 tiene licencia PLAN-ESTANDAR con `svc.internet` y módulos activados. | `03` §5.2 (2) |
| CS-O1-03 | El administrador de la cooperativa crea usuarios con 2FA, asigna un rol con alcance por sucursal y publica configuración con aprobación de un segundo usuario. | `03` §5.2 (3) |
| CS-O1-04 | Se cargan calles con geocodificación. | `03` §5.2 (4) |
| CS-O1-05 | El soporte entra con permiso temporal consentido y auditado. | `03` §5.2 (5) |
| CS-O1-06 | Un reporte base se exporta por job con URL firmada. | `03` §5.2 (6) |
| CS-O1-07 | Herramienta de migración base operativa: proyecto, conjunto de mapeo, corrida reanudable y conciliación de prueba (T07 §9.1, entregable de O1). | T07 §9.1; RF-MIG-043, RF-MIG-050 |
| CS-O1-08 | Carga k6 de lectura de configuración ejecutada (PRO-O1-20). | `03` §5.8 |
| CS-O1-09 | Los 458 RF de O1 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O1/` y casos P1 de CPA-O1 aprobados. | `03` R20; PRO-GEN-02 |

### 2.2.2 Casos de prueba de O1

#### CPA-O1-001 — Alta asistida de una cooperativa hasta el estado Prueba

| Campo | Valor |
|---|---|
| Cubre | CS-O1-01, CS-O1-02; CU-MT-01 (T01 §17) |
| Precondiciones | Usuario de plataforma con capability de alta de tenants; catálogo de planes con PLAN-ESTANDAR. |
| Datos ficticios | TEN-001 "Cooperativa Ejemplo A", CUIT 30-99999991-0, slug `coop-ejemplo-a`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O1`) · `staging` |

```gherkin
Escenario: CPA-O1-001 alta asistida con checklist
  Dado un administrador de plataforma en PLATFORM
  Cuando registra "Cooperativa Ejemplo A" con el asistente y le asigna PLAN-ESTANDAR con "svc.internet"
  Entonces el tenant queda en Preparación con el checklist de puesta en marcha visible
  Cuando se completan los ítems obligatorios del checklist
  Entonces el tenant pasa a Prueba y el cambio queda auditado
  Y un usuario de TEN-001 no accede a datos de TEN-002 aunque cambie el identificador en la solicitud
```

#### CPA-O1-002 — Licencia, activación, rol y alcance combinados

| Campo | Valor |
|---|---|
| Cubre | TST-IAM-31, TST-IAM-32, TST-IAM-33, TST-IAM-34, TST-IAM-35, TST-IAM-40, TST-IAM-41; ESC-UXD-14; ESC-CFG-27 |
| Precondiciones | TEN-001 con PLAN-ESTANDAR; un módulo licenciado pero no activado. |
| Datos ficticios | Rol "Operador comercial" de prueba; usuario `comercial.a@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O1-002 una capability exige licencia, activación y rol
  Dado un usuario con el rol "Operador comercial"
  Cuando el módulo está licenciado pero no activado
  Entonces el menú no lo muestra y la API responde 403
  Cuando el administrador activa el módulo
  Entonces el usuario lo ve solo con las acciones que su rol habilita
  Y quitar la capability del rol revoca el acceso en la siguiente solicitud
```

#### CPA-O1-003 — Segundo factor obligatorio y login con Google sin fusión automática

| Campo | Valor |
|---|---|
| Cubre | CS-O1-03 (2FA); TST-IAM-17, TST-IAM-18, TST-IAM-19, TST-IAM-20 |
| Precondiciones | Política de 2FA obligatoria para personal de TEN-001. |
| Datos ficticios | `admin.a@example.com`; aplicación TOTP de prueba. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O1-003 el personal no entra sin segundo factor
  Dado un usuario de personal nuevo invitado por correo
  Cuando acepta la invitación
  Entonces debe enrolar un segundo factor antes de operar
  Cuando ingresa con un código TOTP inválido
  Entonces se rechaza sin revelar cuál factor falló
  Cuando ingresa con Google usando un correo que ya existe con contraseña
  Entonces no se fusionan las cuentas automáticamente y se pide vinculación explícita
```

#### CPA-O1-004 — Rol con alcance por sucursal

| Campo | Valor |
|---|---|
| Cubre | CS-O1-03 (alcance); TST-IAM-36, TST-IAM-37, TST-IAM-38, TST-IAM-42, TST-IAM-43 |
| Precondiciones | TEN-001 con sucursales "Centro" y "Norte" (ficticias). |
| Datos ficticios | Usuario `cajero.centro@example.com` con alcance "Centro". |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-004 el alcance por sucursal filtra datos y exportaciones
  Dado un usuario con rol de consulta y alcance en la sucursal "Centro"
  Cuando lista o exporta registros
  Entonces solo obtiene los de "Centro"
  Y consultar por ID un registro de "Norte" devuelve 404
```

#### CPA-O1-005 — Segregación de funciones y autorizaciones

| Campo | Valor |
|---|---|
| Cubre | TST-IAM-50, TST-IAM-51, TST-IAM-52, TST-IAM-53, TST-IAM-54, TST-IAM-55, TST-IAM-56; CA-WFL-35 |
| Precondiciones | Matriz de segregación de T02 cargada. |
| Datos ficticios | Usuarios `solicitante.a@example.com` y `aprobador.a@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-005 nadie aprueba lo que solicitó
  Dado una operación sujeta a doble control solicitada por "solicitante.a"
  Cuando el mismo usuario intenta aprobarla
  Entonces se rechaza por segregación de funciones y queda auditado
  Cuando la aprueba "aprobador.a"
  Entonces la operación se ejecuta y la auditoría registra ambos usuarios
  Y asignar a un usuario dos roles incompatibles requiere excepción aprobada y vencimiento
```

#### CPA-O1-006 — Publicación de configuración con aprobación de un segundo usuario

| Campo | Valor |
|---|---|
| Cubre | CS-O1-03 (publicación); ESC-CFG-01, ESC-CFG-04, ESC-CFG-05, ESC-CFG-08, ESC-CFG-09, ESC-CFG-29 |
| Precondiciones | Parámetro de prueba con circuito de aprobación. |
| Datos ficticios | Parámetro ficticio de TEN-001 con valor 10 que pasa a 15. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O1`) · `staging` |

```gherkin
Escenario: CPA-O1-006 un cambio de configuración necesita segundo usuario
  Dado un borrador que cambia el parámetro de 10 a 15
  Cuando el autor intenta publicarlo
  Entonces queda pendiente de aprobación de otro usuario
  Cuando otro administrador lo aprueba
  Entonces se publica una versión nueva con vigencia, autor y aprobador
  Y la versión anterior sigue consultable
  Y un valor fuera de rango o de tipo incorrecto no se puede publicar
```

#### CPA-O1-007 — Precedencia de parámetros, vigencias y calendarios

| Campo | Valor |
|---|---|
| Cubre | ESC-CFG-02, ESC-CFG-03, ESC-CFG-10, ESC-CFG-11, ESC-CFG-12, ESC-CFG-14 |
| Precondiciones | Parámetro con valor de plataforma y override de tenant; feriados ficticios cargados. |
| Datos ficticios | Feriado ficticio 20-11-2026 en TEN-001. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-007 el valor efectivo respeta precedencia y vigencia
  Dado un parámetro con valor de plataforma y un override de TEN-001 con vigencia futura
  Cuando se consulta hoy y luego en la fecha de vigencia
  Entonces hoy rige el valor de plataforma y desde la vigencia rige el override
  Y el cálculo de días hábiles salta el feriado ficticio del tenant
```

#### CPA-O1-008 — Calles con geocodificación

| Campo | Valor |
|---|---|
| Cubre | CS-O1-04; ESC-CFG-06, ESC-CFG-13, ESC-CFG-15 |
| Precondiciones | Proveedor de geocodificación simulado. |
| Datos ficticios | Calle "Calle Ficticia 1" y "Calle Ficticia 2" de la localidad de prueba de TEN-001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O1-008 cargar y geocodificar calles
  Dado un archivo de calles ficticias de TEN-001
  Cuando se importa
  Entonces cada calle queda normalizada y geocodificada, o marcada para revisión si el proveedor no la encuentra
  Y una calle duplicada por grafía distinta se propone para consolidar
```

#### CPA-O1-009 — Importaciones de maestros

| Campo | Valor |
|---|---|
| Cubre | ESC-CFG-16, ESC-CFG-17, ESC-CFG-18, ESC-CFG-21, ESC-CFG-22, ESC-CFG-23, ESC-CFG-25 |
| Precondiciones | Plantillas de importación publicadas. |
| Datos ficticios | Planilla de 100 filas ficticias con 3 filas inválidas. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-009 importar un maestro con filas inválidas
  Dado una planilla de 100 filas con 3 inválidas
  Cuando se ejecuta la importación por job
  Entonces se cargan 97 filas y las 3 inválidas quedan en el informe con su motivo
  Y reimportar la misma planilla no duplica registros
```

#### CPA-O1-010 — Entidades jurídicas del tenant

| Campo | Valor |
|---|---|
| Cubre | ESC-CFG-31, ESC-CFG-32, ESC-CFG-33, ESC-CFG-34; DEC-064 |
| Precondiciones | TEN-001 con dos entidades jurídicas ficticias (T05 §18: LE-01 y LE-02). |
| Datos ficticios | LE-01 emisora de servicios públicos y LE-02 emisora de Internet, CUIT de prueba. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-010 cada documento económico pertenece a una entidad jurídica
  Dado TEN-001 con las entidades LE-01 y LE-02
  Cuando se configura un punto de venta o una serie
  Entonces queda asociado a una sola entidad jurídica
  Y no se puede desactivar una entidad con documentos o configuración vigente asociada
```

#### CPA-O1-011 — Acceso de soporte temporal, consentido y auditado

| Campo | Valor |
|---|---|
| Cubre | CS-O1-05; A11, A12, A13, A14 (T01 §17.2); TST-IAM-70, TST-IAM-71, TST-IAM-72; CA-WFL-39; ESC-UXD-24; CA-INT-04 |
| Precondiciones | Usuario de soporte de PLATFORM; administrador de TEN-001. |
| Datos ficticios | `soporte@ejemplo.test`; ticket ficticio SOP-DEMO-001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O1-011 soporte entra solo con permiso del tenant
  Dado el ticket SOP-DEMO-001 de TEN-001
  Cuando el soporte intenta leer datos de TEN-001 sin permiso
  Entonces recibe 403 y el intento queda auditado
  Y un administrador de tenant que llama a una API de plataforma también recibe 403
  Cuando el administrador de TEN-001 concede acceso temporal con motivo y vencimiento
  Entonces el soporte ve una banda visible de "acceso de soporte" y cada acción queda auditada con el ticket
  Y en el tablero de salud de integraciones nunca ve valores de secretos
  Cuando vence el plazo o el administrador revoca el acceso
  Entonces la sesión de soporte termina en la siguiente solicitud
```

#### CPA-O1-012 — Aprobaciones, delegación y bandeja de tareas

| Campo | Valor |
|---|---|
| Cubre | CA-WFL-01, CA-WFL-02, CA-WFL-03, CA-WFL-04, CA-WFL-13, CA-WFL-15, CA-WFL-36, CA-WFL-55 |
| Precondiciones | Motor de workflow con un circuito de aprobación de dos niveles de prueba. |
| Datos ficticios | Circuito "Aprobación demo" con aprobadores `jefe.a@example.com` y `gerente.a@example.com`. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-012 una aprobación de dos niveles con delegación
  Dado una solicitud que entra al circuito "Aprobación demo"
  Cuando el primer aprobador delega por ausencia en un usuario habilitado
  Entonces la tarea aparece en la bandeja del delegado y la auditoría registra la delegación
  Cuando se vence el plazo de un nivel
  Entonces se escala según el circuito sin perder la tarea
```

#### CPA-O1-013 — Conexiones de integración, certificados y webhooks firmados

| Campo | Valor |
|---|---|
| Cubre | CA-INT-02, CA-INT-03, CA-INT-05, CA-INT-14, CA-INT-15; ESC-INT-02; A15 (T01 §17.2) |
| Precondiciones | Conector de prueba con certificado ficticio próximo a vencer. |
| Datos ficticios | Certificado ficticio que vence en 15 días; webhook de prueba con firma HMAC. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Contrato · `ci` |

```gherkin
Escenario: CPA-O1-013 una conexión avisa vencimientos y valida firmas
  Dado una conexión configurada con un certificado ficticio que vence en 15 días
  Cuando corre el control de vencimientos
  Entonces el administrador recibe una alerta y el panel muestra el estado de la conexión
  Cuando llega un webhook firmado para TEN-001 con el endpoint de TEN-002
  Entonces se rechaza sin procesarlo y las operaciones de un tenant nunca aparecen en el otro
  Y un usuario sin permiso de configurar conexiones o de gestionar credenciales recibe 403
  Y en "staging" no se puede activar una conexión en modo producción
  Y toda pantalla que usa una conexión de prueba muestra el indicador de modo prueba
```

#### CPA-O1-014 — Reporte base exportado por job con URL firmada

| Campo | Valor |
|---|---|
| Cubre | CS-O1-06; ESC-BIA-01, ESC-BIA-02, ESC-BIA-03, ESC-BIA-12, ESC-BIA-13, ESC-BIA-14, ESC-BIA-16, ESC-BIA-17; TST-IAM-66 |
| Precondiciones | Reporte base publicado; worker de exportaciones activo. |
| Datos ficticios | Listado ficticio de 5.000 usuarios de prueba de TEN-001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O1-014 exportar un reporte grande
  Dado un usuario con permiso de exportación
  Cuando pide exportar el reporte base con 5.000 filas
  Entonces la exportación corre como job, avisa al terminar y se descarga por URL firmada con vencimiento
  Y la exportación respeta permisos, alcance y enmascaramiento de datos personales
  Y la exportación queda auditada
```

#### CPA-O1-015 — Editor de marca y diccionario del tenant

| Campo | Valor |
|---|---|
| Cubre | ESC-UXD-01, ESC-UXD-02, ESC-UXD-03, ESC-UXD-06, ESC-UXD-07, ESC-UXD-08, ESC-UXD-10, ESC-UXD-11, ESC-UXD-12 |
| Precondiciones | Editor de marca habilitado para el administrador de TEN-001. |
| Datos ficticios | Logo SVG ficticio; colores #145DA0 y #2E8B57 (M19 §18). |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O1-015 publicar marca y términos propios
  Dado el administrador de TEN-001 en el editor de marca
  Cuando carga el logo, define los colores y cambia un término del diccionario
  Entonces la vista previa muestra el resultado y advierte si el contraste no cumple accesibilidad
  Cuando publica
  Entonces la marca y el término nuevo aparecen en TEN-001 sin afectar a TEN-002
```

#### CPA-O1-016 — Restauración por tenant (parte de O1 de ESC-04)

| Campo | Valor |
|---|---|
| Cubre | ESC-04 de T01 §17.6 en su parte de O1 (mecanismo de restauración selectiva); RNF-NFR-037, RNF-NFR-044. La parte de emisión fiscal y cobro se cubre en CPA-O5-006 (AC-15 de `07`, O4–O5). |
| Precondiciones | Respaldo de TEN-001 tomado a las 10:00. |
| Datos ficticios | Cambios ficticios en un maestro de TEN-001 entre las 10:00 y las 10:40. |
| Prioridad · Tipo | P2 · No funcional (respaldo) |
| Nivel · Ambiente | Simulacro · `staging` |

```gherkin
Escenario: CPA-O1-016 restaurar un tenant sin afectar a otro
  Dado un punto de restauración de TEN-001 de las 10:00
  Cuando se restaura TEN-001 a las 10:40
  Entonces TEN-001 vuelve al estado de las 10:00 con el informe de lo revertido
  Y TEN-002 no sufre cambios
```

#### CPA-O1-017 — Herramienta de migración base con proyecto, mapeo y corrida reanudable

| Campo | Valor |
|---|---|
| Cubre | CS-O1-07; ESC-MIG-01, ESC-MIG-07, ESC-MIG-08; CU-31 de BASE (cuenta sin titular rechazada); RF-MIG-043, RF-MIG-050, RF-MIG-052, RF-MIG-053, RF-MIG-096 |
| Precondiciones | Snapshot de la base de demostración anonimizada (T07 §18, proyecto MIG-DEMO-001) en el ambiente aislado de migración. |
| Datos ficticios | Proyecto MIG-DEMO-001 con un registro de cuenta sin titular. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · ambiente aislado de migración |

```gherkin
Escenario: CPA-O1-017 corrida de prueba de la herramienta de migración
  Dado el proyecto MIG-DEMO-001 con su conjunto de mapeo publicado
  Cuando se ejecuta una corrida y se interrumpe a mitad
  Entonces al reanudar continúa desde el último lote confirmado sin duplicar
  Y la cuenta sin titular queda rechazada con su motivo en el informe
  Cuando un documento ya cargado se modificó operativamente en GoodApps y se reprocesa
  Entonces la corrida lo informa como conflicto y no lo pisa
```

#### CPA-O1-018 — Verificación de la cadena de auditoría y rechazo de acciones de IA

| Campo | Valor |
|---|---|
| Cubre | TST-IAM-62, TST-IAM-67 |
| Precondiciones | Cadena de auditoría con verificación periódica habilitada. |
| Datos ficticios | Registros de auditoría de TEN-001 del seed. |
| Prioridad · Tipo | P2 · No funcional (seguridad) |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O1-018 una alteración de la auditoría se detecta
  Dado la cadena de auditoría de TEN-001 íntegra
  Cuando en un entorno de prueba se altera un registro directamente en la base
  Entonces la verificación de la cadena informa el primer registro roto y genera alerta
  Y una acción propuesta por IA sin confirmación humana no se ejecuta y queda registrada como rechazada
```

---

## 2.3 O2 — Personas, catálogo, landing, portal base, CRM de solicitudes y comunidad

### 2.3.1 Criterios de aceptación de O2

| ID | Condición de salida de O2 | Fuente |
|---|---|---|
| CS-O2-01 | Ana Demo se registra en el portal con OTP y vincula su cuenta con código. | `03` §6.2 (1, 2) |
| CS-O2-02 | Ana ve la oferta INT-100 en la landing y la solicita como trámite con formulario dinámico. | `03` §6.2 (3, 4) |
| CS-O2-03 | El operador recibe la solicitud en el expediente CRM y el contrato queda `requested`. | `03` §6.2 (5, 6) |
| CS-O2-04 | Se envía la notificación por correo e in-app con plantilla y audiencia. | `03` §6.2 (7) |
| CS-O2-05 | El servicio Internet está configurado según T12 parte 1 §1.2–1.3 (plan, categoría, conceptos, equipo en comodato). | `03` §6.2 (8) |
| CS-O2-06 | Casos AC-13 (parte O2) y AC-14 de `07` §15.1 aprobados. | `07` §15.1 |
| CS-O2-07 | Carga k6 de búsqueda de personas ejecutada (PRO-O2-19). | `03` §6.8 |
| CS-O2-08 | Los 613 RF de O2 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O2/` y casos P1 de CPA-O2 aprobados. | `03` R20 |

### 2.3.2 Casos de prueba de O2

#### CPA-O2-001 — Registro en el portal con OTP y vinculación por código

| Campo | Valor |
|---|---|
| Cubre | CS-O2-01; PR-POR-27, PR-POR-28; AC-PER-34, AC-PER-35 |
| Precondiciones | Ana Demo existe como titular de TEN-001 con código de vinculación vigente. |
| Datos ficticios | Ana Demo, DNI 00000001, `ana.demo@example.com`, código de vinculación de prueba. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O2`, `@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O2-001 Ana se registra y vincula su cuenta
  Dado el portal de TEN-001
  Cuando Ana se registra con su correo y valida el OTP
  Entonces su usuario queda activo sin acceso a cuentas
  Cuando ingresa el código de vinculación de su cuenta
  Entonces ve su cuenta y sus datos de titular
  Y un código vencido, ya usado o de otro tenant se rechaza con mensaje genérico
```

#### CPA-O2-002 — Solicitud de Internet INT-100 como trámite hasta contrato requested

| Campo | Valor |
|---|---|
| Cubre | CS-O2-02, CS-O2-03, CS-O2-04; ESC-SRV-INT-01 (parcial: hasta crear el contrato); M02 §17.2 criterios 1, 2 y 6; CA-WFL-06 |
| Precondiciones | Plan INT-100 publicado (M02 §18); Ana vinculada (CPA-O2-001). |
| Datos ficticios | INT-100 "Fibra 100", abono ARS 15.000, instalación ARS 20.000, ONT en comodato. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O2-002 Ana solicita Internet desde la landing
  Dado la landing de TEN-001 muestra la oferta INT-100
  Cuando Ana elige INT-100 y completa el formulario dinámico del trámite
  Entonces se crea el trámite con la versión del formulario usada
  Y el operador lo ve en el expediente CRM de Ana
  Y el contrato queda en estado "requested"
  Y Ana recibe la notificación por correo y en la bandeja in-app con la plantilla configurada
```

#### CPA-O2-003 — Hermanos en el mismo domicilio

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-07; ESC-03 de M02 §17.5; AC-PER-07, AC-PER-08; AC-14 de `07` |
| Precondiciones | Hermano A con deuda vencida en DIR-CASA-001. |
| Datos ficticios | Hermano A (contrato INT-H-A-001), Hermano B, domicilio DIR-CASA-001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O2-003 la deuda de un hermano no bloquea al otro
  Dado Hermano A con deuda en el domicilio DIR-CASA-001
  Cuando Hermano B solicita Internet en el mismo domicilio
  Entonces el sistema advierte la deuda del domicilio sin bloquear la solicitud
  Y el contrato de Hermano B se crea independiente
  Y la deuda de Hermano A no se traslada a Hermano B
```

#### CPA-O2-004 — Alta de persona sin duplicados y con validación de CUIT

| Campo | Valor |
|---|---|
| Cubre | AC-PER-01, AC-PER-02, AC-PER-03, AC-PER-04, AC-PER-06, AC-PER-40 |
| Precondiciones | Ana Demo ya existe en TEN-001. |
| Datos ficticios | DNI 00000001; CUIT ficticio con dígito verificador inválido `20-00000001-0`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O2-004 no se duplican personas
  Dado Ana Demo registrada con DNI 00000001 en TEN-001
  Cuando un operador intenta dar de alta otra persona con el mismo documento
  Entonces el sistema muestra la coincidencia y no crea un duplicado
  Cuando se carga un CUIT con dígito verificador inválido
  Entonces se rechaza con el motivo
  Y la misma persona puede existir en TEN-002 sin conflicto
```

#### CPA-O2-005 — Cuenta principal única con concurrencia

| Campo | Valor |
|---|---|
| Cubre | AC-PER-05, AC-PER-24 |
| Precondiciones | Titular con dos cuentas. |
| Datos ficticios | Cuentas ficticias 1001 y 1002 de Ana Demo. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-005 dos operadores marcan cuenta principal a la vez
  Dado Ana con las cuentas 1001 y 1002
  Cuando dos operadores marcan cada una como principal al mismo tiempo
  Entonces una operación gana y la otra recibe conflicto de versión
  Y Ana queda con una sola cuenta principal
```

#### CPA-O2-006 — Cambio de titularidad idempotente

| Campo | Valor |
|---|---|
| Cubre | AC-PER-09, AC-PER-10, AC-PER-11, AC-PER-12 |
| Precondiciones | Cuenta 1001 de Ana con contrato vigente. |
| Datos ficticios | Nuevo titular ficticio "Beto Demo", DNI 00000002. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-006 transferir la titularidad una sola vez
  Dado la cuenta 1001 de Ana
  Cuando se confirma el cambio de titularidad a Beto Demo con fecha efectiva
  Entonces la historia conserva a Ana hasta la fecha y a Beto desde la fecha
  Y reenviar la misma operación no genera un segundo cambio
```

#### CPA-O2-007 — Bloqueos por documentación vencida y fallecimiento

| Campo | Valor |
|---|---|
| Cubre | AC-PER-13, AC-PER-14 |
| Precondiciones | Persona ficticia con documento obligatorio vencido. |
| Datos ficticios | Persona "Carla Demo", DNI 00000003. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-007 una persona con bloqueo no opera lo bloqueado
  Dado Carla Demo con un documento obligatorio vencido
  Cuando se intenta una operación que exige ese documento
  Entonces la operación se bloquea con el motivo visible
  Cuando se registra el fallecimiento de un titular
  Entonces quedan las tareas de seguimiento y la persona no recibe comunicaciones comerciales
```

#### CPA-O2-008 — Relaciones entre personas y apoderados en el portal

| Campo | Valor |
|---|---|
| Cubre | AC-PER-16, AC-PER-17; PR-POR-21, PR-POR-25; NEG-CRM-01 |
| Precondiciones | Ana con un apoderado registrado con alcance limitado. |
| Datos ficticios | Apoderado ficticio "Dario Demo", DNI 00000004. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O2-008 un apoderado opera solo lo autorizado
  Dado Dario apoderado de Ana para consultar facturas
  Cuando Dario entra al portal
  Entonces ve las cuentas de Ana solo con las acciones autorizadas
  Y no puede iniciar un trámite que no está en su alcance
```

#### CPA-O2-009 — Domicilios normalizados y geocodificados

| Campo | Valor |
|---|---|
| Cubre | AC-PER-18, AC-PER-19, AC-PER-20 |
| Precondiciones | Calles de TEN-001 cargadas (CPA-O1-008). |
| Datos ficticios | Domicilio "Calle Ficticia 1 123" y uno sin número ("S/N"). |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-009 cargar domicilios
  Dado las calles ficticias de TEN-001
  Cuando se carga un domicilio con calle existente y otro sin número
  Entonces el primero queda normalizado con coordenadas y el segundo queda marcado sin número
```

#### CPA-O2-010 — Fusión de personas con doble control e importación

| Campo | Valor |
|---|---|
| Cubre | AC-PER-21, AC-PER-22, AC-PER-25 |
| Precondiciones | Dos registros ficticios de la misma persona. |
| Datos ficticios | "Eva Demo" duplicada con DNI 00000005. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-010 fusionar duplicados con aprobación
  Dado dos registros de Eva Demo con el mismo DNI
  Cuando un operador propone la fusión
  Entonces queda pendiente de aprobación de otro usuario
  Cuando se aprueba
  Entonces las relaciones pasan al registro sobreviviente y la fusión queda auditada
```

#### CPA-O2-011 — Permisos negativos y aislamiento de personas, contratos y portal

| Campo | Valor |
|---|---|
| Cubre | AC-PER-30, AC-PER-31, AC-PER-32, AC-PER-33, AC-PER-36, AC-PER-41, AC-PER-42, AC-PER-43, AC-PER-44; PR-POR-24; ESC-SRV-INT-06 (parcial: contratos de O2) |
| Precondiciones | Operador de TEN-002 con permiso de ver personas y contratos. |
| Datos ficticios | Ana Demo y su contrato de TEN-001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O2-011 nadie ve personas ni contratos ajenos
  Dado un operador de TEN-002
  Cuando consulta por ID a Ana Demo o su contrato de TEN-001
  Entonces recibe 404 sin revelar existencia
  Y un operador de TEN-001 sin la capability de ver datos sensibles los ve enmascarados
  Y un socio en el portal no ve cuentas que no tiene vinculadas
```

#### CPA-O2-012 — Eventos de personas por outbox

| Campo | Valor |
|---|---|
| Cubre | AC-PER-50, AC-PER-51, AC-PER-53 |
| Precondiciones | Consumidores de eventos de personas activos. |
| Datos ficticios | Cambio de correo de Ana a `ana.nuevo@example.com`. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O2-012 un cambio de persona se propaga una vez
  Dado Ana con correo verificado
  Cuando cambia su correo
  Entonces se emite el evento de cambio por outbox y los consumidores lo procesan una vez
  Y el correo nuevo queda sin verificar hasta validarlo
```

#### CPA-O2-013 — Catálogo: publicación validada y copia entre tenants

| Campo | Valor |
|---|---|
| Cubre | CS-O2-05; ESC-02 de M02 §17.5; M02 §17.2 criterios 3, 4, 7, 8 y 9 |
| Precondiciones | Catálogo de Internet de TEN-001 publicado; TEN-002 sin catálogo. |
| Datos ficticios | Copia COP-DEMO-001 de TEN-001 a TEN-002 (T04, CU-COP-01). |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O2-013 copiar el catálogo a otro tenant
  Dado el catálogo de Internet publicado en TEN-001
  Cuando se publica un plan sin categoría o sin concepto tarifario
  Entonces la publicación se rechaza con el motivo
  Cuando se ejecuta la copia COP-DEMO-001 hacia TEN-002
  Entonces TEN-002 recibe la configuración como borrador propio, sin contratos, personas ni secretos de TEN-001
```

#### CPA-O2-014 — Expediente CRM: derivación, comando a contratos, duplicado y reapertura

| Campo | Valor |
|---|---|
| Cubre | CS-O2-03; ESC-CRM-02, ESC-CRM-03, ESC-CRM-16, ESC-CRM-25; NEG-CRM-02, NEG-CRM-03, NEG-CRM-04, NEG-CRM-05; TEN-CRM-01, TEN-CRM-05; RET-CRM-01, RET-CRM-03 |
| Precondiciones | Solicitud de Ana creada (CPA-O2-002). |
| Datos ficticios | Expediente ficticio de Ana; área "Comercial" y "Técnica". |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O2-014 el expediente gestiona la solicitud sin perder trazabilidad
  Dado la solicitud de Ana en el área "Comercial"
  Cuando el operador la deriva a "Técnica"
  Entonces el historial conserva la derivación y el responsable nuevo
  Y el número del caso se mantiene y el SLA continúa
  Cuando llega otra solicitud del mismo subtipo, cuenta y servicio dentro de la ventana
  Entonces se propone vincularla como duplicado
  Cuando el caso requiere un cambio de contrato
  Entonces el CRM emite un comando a contratos y el contrato cambia solo cuando contratos lo confirma
  Y si contratos no responde, el comando se reintenta con la misma clave sin crear un segundo contrato
  Cuando un agente sin la capability de derivar o un operador de comunicaciones intenta derivar o cambiar el estado
  Entonces recibe 403
  Cuando un empleado del área "Agua" abre un caso derivado solo a "Energía" sin alcance ampliado
  Entonces recibe 403
  Cuando un empleado sin "crm.notasRestringidas.ver" abre el caso
  Entonces la nota restringida aparece como "Nota restringida" sin contenido
  Cuando el operador hace doble clic en "Crear reclamo" con la misma Idempotency-Key
  Entonces existe un solo caso y la segunda respuesta devuelve el mismo
  Cuando un usuario de TEN-001 consulta "GET /crm/cases/:id" con un id de TEN-002
  Entonces recibe 404
  Y TEN-001 y TEN-002 pueden tener ambos el caso "TCK-2026-000001" con contadores independientes
  Cuando el socio responde un caso cerrado fuera de la ventana de reapertura
  Entonces se crea un caso nuevo vinculado al anterior
```

#### CPA-O2-015 — Comunidad: muro y moderación

| Campo | Valor |
|---|---|
| Cubre | ESC-COM-01, ESC-COM-02, ESC-COM-03, ESC-COM-04, ESC-COM-05, ESC-COM-06, ESC-COM-07, ESC-COM-08, ESC-COM-09, ESC-COM-10; ESC-COM-53, ESC-COM-54 |
| Precondiciones | Muro de comunidad habilitado en TEN-001. |
| Datos ficticios | Novedad "Corte programado demo" y comentario ficticio de Ana. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O2-015 publicar y moderar en el muro
  Dado un editor de TEN-001
  Cuando publica una novedad segmentada por localidad
  Entonces solo la ven los socios de esa audiencia
  Cuando Ana comenta y otro socio denuncia el comentario
  Entonces el comentario queda en moderación con registro de la decisión
  Y ningún socio de TEN-002 ve la novedad
```

#### CPA-O2-016 — Campañas y comunicaciones con consentimiento

| Campo | Valor |
|---|---|
| Cubre | CS-O2-04; ESC-COM-11, ESC-COM-19, ESC-COM-20, ESC-COM-21, ESC-COM-23, ESC-COM-26, ESC-COM-27, ESC-COM-28, ESC-COM-29, ESC-COM-31, ESC-COM-32; ESC-COM-55, ESC-COM-59; ESC-COM-70, ESC-COM-71, ESC-COM-73 |
| Precondiciones | Plantillas de correo e in-app publicadas; proveedor de correo simulado. |
| Datos ficticios | Campaña "Bienvenida demo" a 50 socios ficticios, 2 sin consentimiento comercial. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O2-016 enviar una campaña respetando preferencias
  Dado la campaña "Bienvenida demo" dirigida a 50 socios
  Cuando se ejecuta el envío
  Entonces se envía a 48 y los 2 sin consentimiento quedan excluidos con motivo
  Y cada envío registra su estado y un rebote marca el contacto como inválido
  Y un mensaje transaccional se envía aunque no haya consentimiento comercial
```

#### CPA-O2-017 — Trámites y formularios versionados

| Campo | Valor |
|---|---|
| Cubre | CS-O2-02; CA-WFL-05, CA-WFL-06, CA-WFL-14, CA-WFL-16, CA-WFL-17; PR-POR-13, PR-POR-14 |
| Precondiciones | Formulario "Solicitud de servicio" en versión 1 con trámites en curso. |
| Datos ficticios | Trámite ficticio TRM-DEMO-001 iniciado con la versión 1. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `ci` |

```gherkin
Escenario: CPA-O2-017 cambiar un formulario no rompe trámites en curso
  Dado el trámite TRM-DEMO-001 iniciado con la versión 1 del formulario
  Cuando se publica la versión 2 con un campo obligatorio nuevo
  Entonces TRM-DEMO-001 sigue con la versión 1
  Y los trámites nuevos usan la versión 2 y validan el campo obligatorio
```

#### CPA-O2-018 — Migración de usuarios del portal

| Campo | Valor |
|---|---|
| Cubre | ESC-MIG-10; PR-POR-16; RF-MIG-090 |
| Precondiciones | Snapshot MIG-DEMO-001 con usuarios del portal heredado. |
| Datos ficticios | 20 usuarios ficticios del portal heredado, con correo `@example.com`. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · ambiente aislado de migración |

```gherkin
Escenario: CPA-O2-018 los usuarios del portal heredado se migran sin credenciales
  Dado 20 usuarios del portal heredado en el snapshot
  Cuando se ejecuta el cargador de usuarios del portal
  Entonces cada usuario queda vinculado a su titular y debe activar su acceso por invitación
  Y ninguna contraseña ni credencial del origen se migra
```

#### CPA-O2-019 — Landing y portal: rendimiento y accesibilidad

| Campo | Valor |
|---|---|
| Cubre | CS-O2-07; PR-POR-34, PR-POR-35, PR-POR-36, PR-POR-39, PR-POR-40; RNF-NFR-008; RNF-NFR-155 |
| Precondiciones | `staging` con volumen sintético de 20.000 personas ficticias. |
| Datos ficticios | Personas ficticias del seed de volumen. |
| Prioridad · Tipo | P2 · No funcional (rendimiento y accesibilidad) |
| Nivel · Ambiente | Carga k6 y extremo a extremo con axe · `staging` |

```gherkin
Escenario: CPA-O2-019 la landing y la búsqueda de personas cumplen las metas
  Dado el escenario k6 de búsqueda de personas de PRO-O2-19
  Cuando se ejecuta con el perfil de referencia
  Entonces los percentiles cumplen las metas de T08 aplicables
  Y la landing y el portal no tienen violaciones de accesibilidad "serious" ni "critical"
```

---

## 2.4 O3 — Técnica del piloto Internet

### 2.4.1 Criterios de aceptación de O3

| ID | Condición de salida de O3 | Fuente |
|---|---|---|
| CS-O3-01 | La solicitud de Ana pasa por factibilidad, genera OT y se agenda la visita. | `03` §7.2 |
| CS-O3-02 | El instalador, en la app de campo sin conexión, instala la ONT-DEMO-0001 tomada de su custodia, registra el comodato, captura la firma y sincroniza sin duplicar. | `03` §7.2 |
| CS-O3-03 | El aprovisionamiento simulado confirma la activación y el contrato pasa a Activo. | `03` §7.2 |
| CS-O3-04 | Un reclamo "sin servicio" genera OT de reparación que se cierra con encuesta. | `03` §7.2 |
| CS-O3-05 | Casos AC-02, AC-03 y AC-04 de `07` §15.1 aprobados; AC-01 aprobado hasta la activación. | `07` §15.1 |
| CS-O3-06 | Conciliación de custodia y comodatos de prueba (RF-MIG-056) sin diferencias. | T07 §5; `03` §7 |
| CS-O3-07 | Carga k6 de sincronización con 50 dispositivos ejecutada (PRO-O3-13). | `03` §7.8 |
| CS-O3-08 | Los 319 RF de O3 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O3/` y casos P1 de CPA-O3 aprobados. | `03` R20 |

### 2.4.2 Casos de prueba de O3

#### CPA-O3-001 — Factibilidad favorable, vencida y anulada

| Campo | Valor |
|---|---|
| Cubre | CS-O3-01; ESC-TEC-01, ESC-TEC-02 |
| Precondiciones | Contrato de Ana en `requested` (CPA-O2-002). |
| Datos ficticios | Domicilio de Ana dentro de la zona ficticia de cobertura. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@O3`, `@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O3-001 resolver la factibilidad
  Dado el contrato de Ana en "requested"
  Cuando el técnico registra factibilidad favorable
  Entonces el contrato avanza y se habilita la OT de instalación
  Cuando una factibilidad vence sin usarse
  Entonces queda vencida y exige una nueva antes de instalar
```

#### CPA-O3-002 — OT de instalación sin duplicados

| Campo | Valor |
|---|---|
| Cubre | CS-O3-01; ESC-TEC-03, ESC-TEC-04 |
| Precondiciones | Factibilidad favorable de Ana. |
| Datos ficticios | OT ficticia OT-DEMO-0001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O3-002 crear la OT una sola vez
  Dado la factibilidad favorable de Ana
  Cuando el evento que crea la OT se procesa dos veces
  Entonces existe una sola OT-DEMO-0001 vinculada al contrato
```

#### CPA-O3-003 — Agenda y reserva de la visita

| Campo | Valor |
|---|---|
| Cubre | CS-O3-01; ESC-TEC-05, ESC-TEC-06; PR-POR-09 |
| Precondiciones | Agenda de la cuadrilla ficticia "Cuadrilla 1" con turnos libres. |
| Datos ficticios | Turno ficticio del 20-11-2026 de 9 a 12. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-003 Ana reserva el turno de instalación
  Dado turnos libres de "Cuadrilla 1"
  Cuando Ana elige el turno del 20-11-2026 desde el portal
  Entonces la visita queda agendada y Ana recibe la confirmación
  Cuando otro socio intenta reservar el mismo cupo ocupado
  Entonces no se sobreasigna y se le ofrecen otros turnos
```

#### CPA-O3-004 — ONT en custodia del instalador y comodato

| Campo | Valor |
|---|---|
| Cubre | CS-O3-02; ESC-STK-01, ESC-STK-03, ESC-STK-16, ESC-STK-37; ESC-TEC-16 |
| Precondiciones | ONT-DEMO-0001..0010 en el depósito central. |
| Datos ficticios | Instalador ficticio `tecnico.a@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Integración y extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-004 la ONT pasa del depósito a la custodia y al comodato
  Dado ONT-DEMO-0001 en el depósito central
  Cuando se transfiere a la custodia del instalador
  Entonces la serie está en un solo lugar: la custodia del instalador
  Cuando el instalador la aplica en el contrato de Ana
  Entonces queda en comodato del contrato con su constancia
  Y una serie ya aplicada no se puede aplicar en otro contrato
```

#### CPA-O3-005 — Instalación sin conexión con firma y sincronización sin duplicar

| Campo | Valor |
|---|---|
| Cubre | CS-O3-02; ESC-TEC-09; ESC-STK-10, ESC-STK-11; ESC-UXD-16; AC-04 de `07`; RNF-NFR-017, RNF-NFR-219 |
| Precondiciones | App de campo con la OT-DEMO-0001 descargada; dispositivo en modo avión. |
| Datos ficticios | Firma ficticia de Ana; foto de prueba; `clientMutationId` `mut-demo-0001`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O3-005 el instalador trabaja sin señal
  Dado el instalador sin conexión con la OT-DEMO-0001 en la app
  Cuando registra la ONT-DEMO-0001, la foto y la firma de Ana
  Entonces la app guarda las mutaciones en la cola local con su "clientMutationId"
  Cuando recupera la señal
  Entonces la cola se sincroniza en orden y la OT queda ejecutada
  Cuando el dispositivo reenvía el lote con el mismo "clientMutationId"
  Entonces el servidor responde "duplicate" sin repetir movimientos de stock ni cambios de estado
```

#### CPA-O3-006 — Conflicto de una orden modificada mientras el técnico estaba sin conexión

| Campo | Valor |
|---|---|
| Cubre | ESC-03 (T08 §17.1; M10 ESC-TEC-08); ESC-STK-12; ESC-03 de M09 §17.5; AC-03 de `07` |
| Precondiciones | OT-DEMO-0002 descargada en el dispositivo; un supervisor la modifica en el servidor. |
| Datos ficticios | ONT-DEMO-0002; supervisor `supervisor.a@example.com`. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-006 un conflicto offline se resuelve sin perder evidencia
  Dado la OT-DEMO-0002 modificada en el servidor mientras el técnico la ejecutaba sin conexión
  Cuando el técnico sincroniza
  Entonces la evidencia del técnico se conserva y se abre un conflicto
  Y no hay doble movimiento de stock de la ONT-DEMO-0002
  Cuando el supervisor resuelve el conflicto
  Entonces la resolución queda auditada con ambas versiones
```

#### CPA-O3-007 — Aprovisionamiento confirmado y contrato activo

| Campo | Valor |
|---|---|
| Cubre | CS-O3-03; ESC-01 de M02 §17.5; ESC-TEC-10, ESC-TEC-30; ESC-SRV-INT-01 (parcial: hasta la activación); ESC-COM-13, ESC-COM-14; AC-01 de `07` (parte O3) |
| Precondiciones | OT-DEMO-0001 ejecutada (CPA-O3-005); simulador de aprovisionamiento en modo éxito. |
| Datos ficticios | Activación confirmada el 21-11-2026. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O3-007 el contrato se activa con la confirmación del aprovisionamiento
  Dado la OT-DEMO-0001 ejecutada con la ONT-DEMO-0001 aplicada
  Cuando el simulador de aprovisionamiento confirma "activate" el 21-11-2026
  Entonces el contrato pasa a "active" con fecha de inicio efectiva 21-11-2026
  Y Ana recibe el aviso de servicio activo y la encuesta de la instalación
```

#### CPA-O3-008 — Aprovisionamiento con tiempo de espera agotado

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-02; ESC-TEC-11; AC-02 de `07` |
| Precondiciones | Contrato en `pendingInstallation` con OT cerrada en campo; simulador en modo `timeout`. |
| Datos ficticios | ONT-DEMO-0003; contrato ficticio de prueba. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-008 la activación no se confirma
  Dado un contrato en "pendingInstallation" con la OT cerrada en campo
  Cuando el aprovisionamiento responde "timeout" tres veces
  Entonces el contrato no se activa ni se factura
  Y se crea una tarea manual para el NOC
  Y el socio ve "activación en curso"
```

#### CPA-O3-009 — Visita fallida

| Campo | Valor |
|---|---|
| Cubre | ESC-TEC-07; PR-POR-10 |
| Precondiciones | Visita agendada. |
| Datos ficticios | Motivo ficticio "domicilio cerrado". |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-009 una visita fallida no activa ni cobra
  Dado una visita de instalación agendada
  Cuando el técnico la registra como fallida por "domicilio cerrado"
  Entonces el contrato no se activa
  Y el socio puede reprogramar desde el portal
```

#### CPA-O3-010 — Reclamo "sin servicio" con OT de reparación y encuesta

| Campo | Valor |
|---|---|
| Cubre | CS-O3-04; ESC-CRM-01, ESC-CRM-09; ESC-COM-12; RET-CRM-04; PR-POR-19 |
| Precondiciones | Contrato de Ana activo (CPA-O3-007). |
| Datos ficticios | Reclamo ficticio REC-DEMO-0001. |
| Prioridad · Tipo | P1 · Funcional |
| Nivel · Ambiente | Extremo a extremo (`@piloto-internet`) · `staging` |

```gherkin
Escenario: CPA-O3-010 Ana reclama y la reparación cierra con encuesta
  Dado el contrato de Ana activo
  Cuando Ana crea el reclamo "sin servicio" desde la app con la derivación automática desactivada
  Entonces el caso queda en "received" en la bandeja de supervisión y ninguna área lo ve hasta derivarlo
  Cuando el supervisor lo deriva a Técnica
  Entonces corre su SLA, que no consume tiempo mientras espera al socio, y se genera una OT de reparación
  Y si el cierre de la OT llega antes que su creación, el consumidor los aplica en orden por versión
  Cuando el técnico cierra la OT
  Entonces el reclamo se resuelve, Ana recibe la encuesta y su respuesta queda registrada
```

#### CPA-O3-011 — Incidente de zona con aviso a afectados

| Campo | Valor |
|---|---|
| Cubre | ESC-CRM-08, ESC-CRM-10; ESC-COM-34, ESC-COM-35 |
| Precondiciones | Varios contratos activos en la misma zona ficticia. |
| Datos ficticios | Incidente ficticio INC-DEMO-001 en la zona "Norte". |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Extremo a extremo · `staging` |

```gherkin
Escenario: CPA-O3-011 un corte de zona agrupa reclamos y avisa
  Dado el incidente INC-DEMO-001 en la zona "Norte"
  Cuando llegan reclamos de socios de esa zona
  Entonces se vinculan al incidente y los socios afectados reciben el aviso
  Cuando técnica informa el servicio restablecido
  Entonces los casos pasan a "resuelto pendiente de confirmación" y no se cierran solos
  Y un caso cuyo socio responde que sigue sin servicio se reabre
  Y un caso con SLA crítico alerta al 75 % del plazo y al vencer escala y queda marcado incumplido
```

#### CPA-O3-012 — Reglas de existencias del stock

| Campo | Valor |
|---|---|
| Cubre | ESC-STK-02, ESC-STK-04, ESC-STK-05, ESC-STK-06, ESC-STK-07, ESC-STK-08, ESC-STK-09, ESC-STK-13, ESC-STK-14, ESC-STK-15 |
| Precondiciones | Depósitos ficticios "Central" y "Móvil 1". |
| Datos ficticios | 100 conectores ficticios y ONT-DEMO-0004..0010. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O3-012 el stock nunca queda inconsistente
  Dado 100 conectores en "Central"
  Cuando se intenta egresar 101 sin permiso de stock negativo
  Entonces se rechaza
  Cuando se transfieren 20 a "Móvil 1"
  Entonces "Central" queda con 80 y "Móvil 1" con 20, con movimientos trazables
  Y una serie no puede estar en dos depósitos a la vez
```

#### CPA-O3-013 — Cierre de OT con requisitos y anulación

| Campo | Valor |
|---|---|
| Cubre | ESC-TEC-12, ESC-TEC-13, ESC-TEC-14, ESC-TEC-15 |
| Precondiciones | Tipo de OT con requisitos obligatorios (foto, firma). |
| Datos ficticios | OT-DEMO-0005 sin foto. |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · `ci` |

```gherkin
Escenario: CPA-O3-013 una OT no cierra sin sus requisitos
  Dado la OT-DEMO-0005 sin la foto obligatoria
  Cuando el técnico intenta cerrarla
  Entonces se rechaza indicando el requisito faltante
  Cuando se anula una OT con materiales entregados
  Entonces los materiales vuelven a stock y la anulación queda auditada
```

#### CPA-O3-014 — Permisos y aislamiento de técnica y stock

| Campo | Valor |
|---|---|
| Cubre | ESC-SRV-INT-06; ESC-TEC-22, ESC-TEC-23, ESC-TEC-24, ESC-TEC-25, ESC-TEC-26, ESC-TEC-27; ESC-STK-35, ESC-STK-36, ESC-STK-38, ESC-STK-39; AC-13 de `07` |
| Precondiciones | Operador de TEN-002 con permiso de ver contratos y equipos. |
| Datos ficticios | Contrato de Ana y ONT-DEMO-0001 de TEN-001. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Integración (`test:isolation`) · `ci` |

```gherkin
Escenario: CPA-O3-014 un operador de otro tenant no ve el contrato ni la ONT
  Dado un operador de TEN-002 con permiso de ver contratos
  Cuando consulta por ID el contrato de Ana y la ONT-DEMO-0001
  Entonces recibe 404 sin revelar existencia
  Y los jobs de TEN-002 no leen comandos de aprovisionamiento de TEN-001
  Y un técnico sin la capability de cierre no puede cerrar una OT
```

#### CPA-O3-015 — Conciliación de custodia y comodatos

| Campo | Valor |
|---|---|
| Cubre | CS-O3-06; ESC-TEC-29; ESC-STK-40, ESC-STK-43; RF-MIG-056 |
| Precondiciones | Snapshot MIG-DEMO-001 con equipos en comodato. |
| Datos ficticios | 30 equipos ficticios en comodato (muestreo de T07 §17.2). |
| Prioridad · Tipo | P2 · Funcional |
| Nivel · Ambiente | Integración · ambiente aislado de migración |

```gherkin
Escenario: CPA-O3-015 conciliar equipos migrados
  Dado 30 equipos en comodato en el snapshot
  Cuando se cargan y se ejecuta la conciliación
  Entonces cada serie está en un solo lugar y coincide con su contrato
  Y las diferencias quedan listadas con su motivo
```

#### CPA-O3-016 — Carga de sincronización de campo con 50 dispositivos

| Campo | Valor |
|---|---|
| Cubre | CS-O3-07; ESC-STK-42; RNF-NFR-017, RNF-NFR-188 |
| Precondiciones | `staging` con 50 dispositivos simulados y colas de 20 operaciones cada uno. |
| Datos ficticios | OT ficticias generadas por el seed de volumen. |
| Prioridad · Tipo | P2 · No funcional (rendimiento) |
| Nivel · Ambiente | Carga k6 · `staging` |

```gherkin
Escenario: CPA-O3-016 50 dispositivos sincronizan a la vez
  Dado 50 dispositivos con 20 operaciones en cola cada uno
  Cuando sincronizan en simultáneo
  Entonces se cumplen las metas de RNF-NFR-017 sin operaciones perdidas ni duplicadas
```
