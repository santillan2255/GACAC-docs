# Casos de prueba de aceptación — T05 DAT — Modelo de datos canónico consolidado

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T05-DAT-modelo-datos.md`](../../especificacion/anexos/T05-DAT-modelo-datos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 0 CP de requisitos funcionales, 12 CP de escenarios ESC y 5 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 2. Casos por escenario y criterio de aceptación con ID

**CP-DAT-6001 — CA-DAT-01. Ninguna colección fuera de la lista blanca de §7.1.3 existe sin `tenantId` obligatorio. Prueba automática que…**

- Cubre: CA-DAT-01; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `legalEntities`: `TEN-001/LE-01`, `TEN-001/LE-02` "Cooperativa Ejemplo A Ltda." (emisora de servicios públicos) y "Ejemplo A Telecomunicaciones S.A." (emisora de Internet) (R14; antes "Cooperativa Demo Norte Ltda." y "Demo Norte…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Ninguna colección fuera de la lista blanca de §7.1.3 existe sin `tenantId` obligatorio. Prueba automática que recorre los modelos registrados.

**CP-DAT-6002 — CA-DAT-02. Una consulta sin contexto de tenant sobre una colección de negocio falla con error y no devuelve datos…**

- Cubre: CA-DAT-02; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T05 §18.
- Datos de prueba: `tenants`: `TEN-002` "Cooperativa Ejemplo B" (`coop-ejemplo-b`; R14; antes "Cooperativa Demo Sur"), perfil grande (para pruebas de volumen y aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Una consulta sin contexto de tenant sobre una colección de negocio falla con error y no devuelve datos. Prueba de aislamiento por colección (CI, T08).

**CP-DAT-6003 — CA-DAT-03. Con dos tenants demo cargados (`TEN-001`, `TEN-002`), ningún endpoint, job, exportación ni reporte devuelve…**

- Cubre: CA-DAT-03; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T05 §18.
- Datos de prueba: `tenants`: `TEN-002` "Cooperativa Ejemplo B" (`coop-ejemplo-b`; R14; antes "Cooperativa Demo Sur"), perfil grande (para pruebas de volumen y aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Con dos tenants demo cargados (`TEN-001`, `TEN-002`), ningún endpoint, job, exportación ni reporte devuelve documentos del otro tenant. Suite de aislamiento con datos de §18.

**CP-DAT-6004 — CA-DAT-04. Todo índice compuesto empieza por `tenantId`, salvo los de §7.1.3 y la tabla de excepciones de §7.8.1. Script…**

- Cubre: CA-DAT-04; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `legalEntities`: `TEN-001/LE-01`, `TEN-001/LE-02` "Cooperativa Ejemplo A Ltda." (emisora de servicios públicos) y "Ejemplo A Telecomunicaciones S.A." (emisora de Internet) (R14; antes "Cooperativa Demo Norte Ltda." y "Demo Norte…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Todo índice compuesto empieza por `tenantId`, salvo los de §7.1.3 y la tabla de excepciones de §7.8.1. Script que lee `listIndexes()` en el entorno de prueba.

**CP-DAT-6005 — CA-DAT-05. Las colecciones `A→` del catálogo no existen en la base. Script comparando colecciones contra el catálogo.**

- Cubre: CA-DAT-05; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `tenants`: `PLATFORM` Tenant técnico; `_id` fijo por ambiente.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Las colecciones `A→` del catálogo no existen en la base. Script comparando colecciones contra el catálogo.

**CP-DAT-6006 — CA-DAT-06. Un `deleteOne` o la edición de un campo protegido en una colección económica de §7.1.6 se rechaza en el…**

- Cubre: CA-DAT-06; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `legalEntities`: `TEN-001/LE-01`, `TEN-001/LE-02` "Cooperativa Ejemplo A Ltda." (emisora de servicios públicos) y "Ejemplo A Telecomunicaciones S.A." (emisora de Internet) (R14; antes "Cooperativa Demo Norte Ltda." y "Demo Norte…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Un `deleteOne` o la edición de un campo protegido en una colección económica de §7.1.6 se rechaza en el modelo y en la base (rol `appEconomicWriter`). Prueba de integración.

**CP-DAT-6007 — CA-DAT-07. Ningún importe se guarda como `Double`. Validador `$jsonSchema` y prueba que suma 0,1 + 0,2 en un renglón y…**

- Cubre: CA-DAT-07; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `legalEntities`: `TEN-001/LE-01`, `TEN-001/LE-02` "Cooperativa Ejemplo A Ltda." (emisora de servicios públicos) y "Ejemplo A Telecomunicaciones S.A." (emisora de Internet) (R14; antes "Cooperativa Demo Norte Ltda." y "Demo Norte…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Ningún importe se guarda como `Double`. Validador `$jsonSchema` y prueba que suma 0,1 + 0,2 en un renglón y obtiene 0,30 exacto.

**CP-DAT-6008 — CA-DAT-08. Las consultas de las pantallas de lista sobre colecciones de alto volumen no hacen `COLLSCAN` con el volumen…**

- Cubre: CA-DAT-08; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `tenants`: `TEN-002` "Cooperativa Ejemplo B" (`coop-ejemplo-b`; R14; antes "Cooperativa Demo Sur"), perfil grande (para pruebas de volumen y aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Las consultas de las pantallas de lista sobre colecciones de alto volumen no hacen `COLLSCAN` con el volumen de tenant grande (§7.8.2). `explain` en pruebas de carga (T08).

**CP-DAT-6009 — CA-DAT-09. Todo campo `x-pii: SE` y todo CBU se guarda cifrado; en la base se ve `{ct, iv, tag, dekId, v}`. Inspección…**

- Cubre: CA-DAT-09; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T05 §18.
- Datos de prueba: `legalEntities`: `TEN-001/LE-01`, `TEN-001/LE-02` "Cooperativa Ejemplo A Ltda." (emisora de servicios públicos) y "Ejemplo A Telecomunicaciones S.A." (emisora de Internet) (R14; antes "Cooperativa Demo Norte Ltda." y "Demo Norte…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Todo campo `x-pii: SE` y todo CBU se guarda cifrado; en la base se ve `{ct, iv, tag, dekId, v}`. Inspección directa en el entorno de prueba.

**CP-DAT-6010 — CA-DAT-10. Ningún documento de negocio contiene un secreto en claro (contraseña, token, clave privada). Escáner de…**

- Cubre: CA-DAT-10; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T05 §18.
- Datos de prueba: `persons` / `holders` / `accounts`: `TEN-001/PER-000001` a `PER-000050` "Persona Demo 001"… con documento de prueba; 50 suministros `SUM-000001`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Ningún documento de negocio contiene un secreto en claro (contraseña, token, clave privada). Escáner de patrones sobre un volcado de prueba.

**CP-DAT-6011 — CA-DAT-11. Todo documento migrado tiene `legacy.table` y `legacy.key`, y `legacyIdMap` resuelve cada referencia…**

- Cubre: CA-DAT-11; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `persons` / `holders` / `accounts`: `TEN-001/PER-000001` a `PER-000050` "Persona Demo 001"… con documento de prueba; 50 suministros `SUM-000001`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Todo documento migrado tiene `legacy.table` y `legacy.key`, y `legacyIdMap` resuelve cada referencia. Conciliación de T07.

**CP-DAT-6012 — CA-DAT-12. Los tiempos de TTL de §7.8.3 están configurados como índices TTL y no hay TTL en colecciones con datos…**

- Cubre: CA-DAT-12; T05 §17
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `tenants`: `PLATFORM` Tenant técnico; `_id` fijo por ambiente.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Criterios de aceptación» (T05 §17)
- Entonces Los tiempos de TTL de §7.8.3 están configurados como índices TTL y no hay TTL en colecciones con datos personales de negocio. Script sobre `listIndexes()`.

## 3. Casos por caso de uso (CU)

**CP-DAT-8001 — CU-DAT-01. Crear una colección nueva**

- Cubre: CU-DAT-01; T05 §16
- Ola: O0 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T05 §18.
- Datos de prueba: `tenants`: `TEN-002` "Cooperativa Ejemplo B" (`coop-ejemplo-b`; R14; antes "Cooperativa Demo Sur"), perfil grande (para pruebas de volumen y aislamiento).
- Dado actor: Desarrollador, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) Verificar que figure en el catálogo con estado `C`, `R` o `N` y en su ola; 2) esquema con `tenancyPlugin`, `auditPlugin`, `AuditFields`, `schemaVersion`, `retentionClass` y `x-pii`; 3) índices del catálogo con `tenantId` primero; 4) validador `$jsonSchema` si es económica; 5) prueba de aislamiento.
- Entonces Colección lista y registrada en `dataCatalogEntries`.

**CP-DAT-8002 — CU-DAT-02. Alta de tenant**

- Cubre: CU-DAT-02; T05 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `tenants`: `PLATFORM` Tenant técnico; `_id` fijo por ambiente.
- Dado actor: Operador de plataforma (T01), autenticado en TEN-001 con las capabilities de su rol
- Cuando Crea `tenants`, la primera `legalEntities`, `branches` inicial, adopciones de tablas de plataforma y semillas (`seedApplications`).
- Entonces Tenant operativo sin datos de otros tenants.

**CP-DAT-8003 — CU-DAT-03. Cambio de esquema con datos**

- Cubre: CU-DAT-03; T05 §16
- Ola: O0 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `memberships` / `identities`: `demo.operador@demo.invalid` Identidad con membresía en `TEN-001` y `TEN-002`: prueba de cambio de tenant.
- Dado actor: Desarrollador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Migración expandir/contraer (§7.1.14) registrada en `schemaMigrations`; relleno por lotes por tenant.
- Entonces Sin corte de servicio ni pérdida de datos.

**CP-DAT-8004 — CU-DAT-04. Supresión por retención o derecho del titular**

- Cubre: CU-DAT-04; T05 §16
- Ola: O0 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `tenants`: `PLATFORM` Tenant técnico; `_id` fijo por ambiente.
- Dado actor: T08, autenticado en TEN-001 con las capabilities de su rol
- Cuando `retentionRuns` aplica la política, respeta `legalHolds`, registra en `erasureLedger`.
- Entonces Datos suprimidos y reaplicables tras restaurar.

**CP-DAT-8005 — CU-DAT-05. Cargar datos migrados**

- Cubre: CU-DAT-05; T05 §16
- Ola: O0 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T05 §18.
- Datos de prueba: `persons` / `holders` / `accounts`: `TEN-001/PER-000001` a `PER-000050` "Persona Demo 001"… con documento de prueba; 50 suministros `SUM-000001`…
- Dado actor: T07, autenticado en TEN-001 con las capabilities de su rol
- Cuando Cada documento con `legacy`; `legacyIdMap` resuelve referencias; lo que no tiene estructura tipada en la ola va a `legacyRecords`.
- Entonces Trazabilidad registro a registro.
