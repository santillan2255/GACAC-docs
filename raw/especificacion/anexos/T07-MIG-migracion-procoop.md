# T07 MIG — Migración desde ProCoop, convivencia, corrida paralela y by-pass

| Campo | Valor |
|---|---|
| Versión | 1.0 (lógico); alineación destino **1.1-impacto** 19-11-2026 (§7.0) |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma (herramienta de migración, staging, archivo histórico, anonimización) / ERP (cargas por dominio, conciliación, paralelo) / APIs (extracción desde SQL Server y MySQL del portal, sincronización de convivencia) |
| Olas | **O0** (convenciones `legacy`, almacenamiento de snapshots, base del pipeline y del mapa de IDs), **O1** (herramienta de migración completa: proyectos, corridas, reglas de mapeo versionadas, staging, rechazos, reprocesos idempotentes, anonimización, cargas de maestros de plataforma/IAM/configuración), **O2–O10** (cargadores y criterios de aceptación de cada dominio, en la ola del módulo dueño), **O7** (migración de datos vigentes comerciales, corrida paralela con facturación comparada factura por factura, congelamiento, by-pass por módulo, corte comercial por servicio y rollback, DEC-089), **O11** (ensayo integral repetible por cooperativa, históricos y archivo, corte administrativo y apagado de ProCoop) (DEC-089; antes O11 incluía también el paralelo, el by-pass, el corte definitivo y el rollback). |
| Dueño de datos | Proyectos de migración por cooperativa (`migrationProjects`), corridas y lotes (`migrationRuns`, `migrationBatches`), snapshots de extracción (`legacySnapshots`), registros de staging (`migStagingRecords`), reglas y conjuntos de mapeo versionados (`migrationMappingSets`, `migrationMappingRules`, `migrationValueMaps`), mapa de identificadores legacy → nuevos (`legacyIdMap`), alias de claves externas heredadas (`legacyKeyAliases`), rechazos y advertencias (`migrationIssues`), conciliaciones (`migrationReconciliations`), corridas paralelas y comparaciones (`parallelRuns`, `parallelComparisons`), plan de convivencia/by-pass (`bypassPlans`, `coexistenceSyncs`), plan de corte y rollback (`cutoverPlans`, `rollbackJournal`), archivo histórico de solo lectura genérico (`legacyRecords`), perfiles de anonimización (`anonymizationProfiles`). **No** es dueño de ninguna entidad de negocio: cada documento cargado pertenece al módulo destino indicado en la matriz (§19). |
| Fuentes consolidadas | BASE §31 (alcance de integraciones/importaciones/migración, CU-31, precarga MIG-DEMO-001), §35 (priorización), §64.7 (migración y adopción, continuidad de operación), §97.8 (volumen y conservación), §97.9 (ambientes y pruebas por tenant), §97.10 (plan de migración desde ProCoop y requisitos), §97.12 (priorización), §98 (pendientes: conservación, Grupo Factura), §102/AGR-018 (estrategia ejecutable, plan de retorno), AGR-010, AGR-011, AGR-012, AGR-016, AGR-017, AGR-019 (restauración que no deshace hechos externos), AGR §7 etapa F (preparación operativa y acta de aceptación), §103 (FAC-005 a FAC-012, en especial **FAC-012**), §4713 nota P-014 (Grupo Factura impacta migración); DFA §32 (modelo de datos de referencia y patrones: tablas espejo de anulación, `HIS_*`/`*_HST`, `*_EXTRAS`), §33 (etapas, hitos de paralelo y by-pass, nota contable, criterio de aceptación del paralelo), §34 (pendientes: datos reales de parametrización, validar módulos usados), §30 (importación de padrones y DBF); FIC tabla de clasificación (Migración, una sola vez), 14.1 (portal CoopOnline y migración de usuarios), 14.2 (app de campo sincronizada con MySQL), 14.3 (API para terceros), 18.2 (contabilidad externa durante el paralelo), **21** (migración desde ProCoop: fuentes, diseño repetible, pendientes), 22 (infraestructura que reemplaza procesos); RN-11 §3 fila 5 (criterio de "factura migrada" `USUARIO`), §5 (consultas de solo lectura en `PR_LAG_DEMO`), "Implicancias para CoopApps (by-pass y transición)" 1–8, Dudas 1–10 (en especial 7); REL README (advertencia de datos personales y anonimización); CAT §1 a §31 (659 tablas, todas mapeadas en §19); CNX `ExcelImportWizard` (subir → preview con errores → confirmar), DataTable, auditoría genérica, outbox y BullMQ. |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Definir, de forma ejecutable y comprobable, cómo se trasladan los datos de cada cooperativa que hoy opera con ProCoop (SQL Server de escritorio + portal CoopOnline sobre MySQL) a **CoopApps** (SaaS multitenant en **Azure SQL** compartida, **`TenantId`** por cooperativa — DEC-110, DEC-111), y cómo se convive con ProCoop hasta apagarlo, sin interrumpir la operación diaria de la cooperativa (BASE §64.7) y sin perder trazabilidad de ningún saldo, documento, equipo instalado o dato histórico (BASE §31 "Criterio").

El anexo cubre:

1. La **estrategia** de migración por cooperativa, por módulo y por ola.
2. Las **fases**: inventario, perfilado de calidad, mapeo, limpieza, extracción, transformación, carga, validación, conciliación (saldos, deuda, stock, contabilidad), corrida paralela, by-pass, corte definitivo y rollback.
3. La **herramienta de migración**: pipeline ETL con staging, reglas de mapeo versionadas, informes de rechazos, reprocesos idempotentes, mapa de IDs legacy → nuevos conservando `legacyId`.
4. Los **criterios de aceptación por dominio** (personas/cuentas, suministros, medidores y lecturas, cuadros tarifarios, deuda y cuenta corriente, comprobantes históricos, cobranzas, financiaciones, stock, contabilidad, proveedores, sueldos, institucional).
5. El **tratamiento del histórico** (qué se migra vivo, qué como histórico de solo lectura y qué se archiva).
6. La **calidad de datos** (CUIT/DNI inválidos, duplicados, direcciones y calles).
7. La **corrida paralela** con facturación comparada factura por factura (BASE §103 FAC-012, DFA §33).
8. El **by-pass** de ProCoop: qué módulos siguen en ProCoop durante la convivencia y cómo se sincronizan.
9. La **anonimización** para ambientes de prueba (REL README, FIC 21 "Pendiente").
10. La **matriz completa de mapeo de las 659 tablas** de ProCoop (CAT), con destino, anexo dueño, ola y estrategia.

## 2. Límite y responsabilidades

### 2.1 Qué hace

- Administra el **proyecto de migración** de cada cooperativa (tenant destino), su inventario de fuentes, su plan de olas, su calendario de ensayos (sin fechas comprometidas en la especificación, DEC-006) y su acta de aceptación.
- **Extrae** en modo de solo lectura desde la base SQL Server de ProCoop (ej. `PR_LAG_DEMO` en la DEMO), la base MySQL del portal/app (usuarios web, adhesiones), las carpetas de adjuntos y PDF (servidor y Amazon S3) y archivos heredados DBF/Access/Excel (FIC 21).
- Congela cada extracción en un **snapshot inmutable** fechado y con hash, cifrado, en almacenamiento de objetos privado.
- **Perfila** calidad, **transforma** con reglas de mapeo versionadas, **valida** en staging y **carga** cada dominio invocando el servicio del módulo dueño (DEC-003: nunca escribe directamente en colecciones de otro módulo).
- Mantiene el **mapa de identificadores** legacy → nuevos (`legacyIdMap`) y los **alias de claves externas** heredadas (códigos de barra, identificadores Red Link/SIRO, `FACTURAS.USUARIO`, cuentas "cuenta × 100 + servicio", RN-11).
- Produce **informes de rechazos, advertencias y diferencias**, permite corregir y **reprocesar de forma idempotente**.
- **Concilia** cantidades y sumas de control por dominio (personas, cuentas, contratos activos, equipos, deuda por titular y servicio, fondos, stock por depósito, saldos contables, acumulados de sueldos).
- Ejecuta la **corrida paralela** (CoopApps calcula sin emitir fiscalmente) y la **comparación factura por factura** contra ProCoop.
- Orquesta el **by-pass** progresivo (módulo por módulo) y la **sincronización de convivencia** mientras ambos sistemas operan.
- Planifica y ejecuta el **corte definitivo** (congelamiento, delta final, aceptación) y el **rollback** (plan de retorno que no hace desaparecer los hechos posteriores al corte, AGR-018).
- Genera **ambientes de prueba anonimizados** desde snapshots reales.
- Publica el **archivo histórico de solo lectura** consultable desde las fichas del sistema y, cuando corresponde, desde el portal del socio.

### 2.2 Qué NO hace y a quién delega

| No hace | Lo hace |
|---|---|
| Definir el modelo canónico de cada entidad/tabla destino | T05 DAT, `07-catalogo-tablas-sql.md` y el anexo dueño de cada dominio (M01–M19) |
| Aplicar reglas de negocio de facturación, mora, fiscal | M05 FAC, M08 MOR, M06 FIS (la migración invoca sus servicios en modo `migration`) |
| Emitir comprobantes fiscales en ARCA durante el paralelo | Nadie: en paralelo CoopApps **no** autoriza en ARCA (RN-MIG-030); la emisión real empieza en el corte (M06) |
| Gestionar credenciales de integraciones | T06 INT (bóveda de credenciales por tenant). Las credenciales de ProCoop **no se migran** (CTR-MIG-08) |
| Gestionar usuarios, roles y 2FA | T02 IAM (la migración solo propone usuarios y mapeo de perfiles) |
| Configuración versionada y parámetros | T04 CFG (la migración entrega valores V2 mapeados a PRM para su publicación) |
| Restauración de backups | T01 PLA (AGR-019); el rollback de migración es un proceso distinto (§9.11) |
| Reportes y BI posteriores | T10 BIA |
| Importaciones operativas recurrentes (padrones, rendiciones) | T06 INT y el módulo dueño; la herramienta de migración se reutiliza solo para cargas iniciales y reprocesos de migración |

### 2.3 Principios del límite

1. **Solo lectura en el origen.** Ninguna operación de migración escribe en la base de ProCoop (BASE §97.10). Las únicas excepciones son las que la cooperativa ejecuta en ProCoop por sus propios medios (ej. congelar usuarios en el corte).
2. **Carga vía servicio del módulo dueño** (API .NET / caso de uso del dominio), con `origin = 'procoop-migration'`, `migrationRunId` y validaciones del dominio activas (no se eluden reglas de negocio, BASE §31 "Límite"); persistencia en tablas del módulo dueño (`07-ddl`), sin escritura cruzada de esquemas.
3. **Aceptación técnica ≠ aceptación funcional**: una carga sin errores técnicos no queda aceptada hasta que el responsable funcional del dominio aprueba la conciliación (BASE §31).
4. **Todo es repetible**: cada corrida es reproducible desde un snapshot y una versión de reglas (FIC 21, AGR-018).
5. **Nada se pierde**: las 659 tablas se archivan crudas en el snapshot aunque su estrategia sea "No migrar" (Regla de oro de la guía).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop / origen |
|---|---|---|---|
| Proyecto de migración | Conjunto de trabajo de una cooperativa: fuentes, tenant destino, plan de olas, ensayos, corte. | `dict:mig.project` | — |
| Corrida (run) | Ejecución identificada de extracción → transformación → carga para un alcance (dominios/tablas) y una versión de reglas. | `dict:mig.run` | "Lote" MIG-DEMO-001 (BASE §31) |
| Ensayo (dry run) | Corrida completa en ambiente de prueba o tenant de ensayo, descartable. | `dict:mig.dryRun` | "Ejecuciones de prueba" (BASE §31) |
| Snapshot | Copia inmutable, fechada, con hash SHA-256, de las tablas origen extraídas. | `dict:mig.snapshot` | Backup `PR_<SIGLA>` |
| Staging | Zona intermedia donde se guardan los registros extraídos y transformados antes de cargarlos, con su estado de validación. | `dict:mig.staging` | — |
| Regla de mapeo | Transformación versionada de un campo/tabla origen a un campo/colección destino. | `dict:mig.mappingRule` | — |
| Conjunto de mapeo | Versión publicada de todas las reglas aplicables a una corrida. | `dict:mig.mappingSet` | — |
| Mapa de valores | Tabla de equivalencias de códigos (ej. `SITIVA.COD_SIT` → `taxConditions.code`). | `dict:mig.valueMap` | Tablas maestras ProCoop |
| legacyId | Identificador original en ProCoop (tabla + clave primaria compuesta serializada) conservado en el documento destino. | `dict:mig.legacyId` | `COD_*`, `ID_*` |
| Alias de clave externa | Identificador heredado que terceros siguen usando (código de barras, identificador Red Link/SIRO, código del sistema anterior). | `dict:mig.keyAlias` | `FACTURAS.USUARIO`, `FAC_EXTRAS` |
| Rechazo | Registro que no puede cargarse (error bloqueante). | `dict:mig.rejection` | — |
| Advertencia | Registro cargado con observación de calidad pendiente de saneamiento. | `dict:mig.warning` | — |
| Reproceso | Nueva corrida acotada a rechazos corregidos; idempotente. | `dict:mig.reprocess` | — |
| Conciliación | Comparación de conteos y sumas de control entre origen y destino, aprobada por un responsable. | `dict:mig.reconciliation` | "Conciliación de saldos iniciales" (BASE §31) |
| Migrar vivo | El dato pasa a ser operativo en CoopApps (editable, participa de procesos). | `dict:mig.strategy.live` | — |
| Histórico | El dato se carga de solo lectura, consultable, sin participar de procesos. | `dict:mig.strategy.historical` | Tablas `HIS_*`, `*_HST`, `ANU*` |
| Archivo | Snapshot crudo conservado cifrado durante el plazo de conservación, sin carga. | `dict:mig.strategy.archive` | — |
| No migrar | La tabla no se carga (Descartar o Reemplazado por); igual se archiva. | `dict:mig.strategy.none` | — |
| Corrida paralela | Período en que CoopApps calcula los mismos ciclos que ProCoop, sin efecto fiscal, para comparar. | `dict:mig.parallelRun` | "Paralelo" (DFA §33) |
| Facturación comparada | Comparación factura por factura de cantidades, importes por concepto, impuestos y vencimientos. | `dict:mig.billingComparison` | Criterio de aceptación del paralelo (DFA §33) |
| By-pass | Traspaso de la operación de un módulo de ProCoop a CoopApps mientras otros siguen en ProCoop. | `dict:mig.bypass` | "By pass de Procoop" (DFA §33, FIC 21) |
| Convivencia | Período en que ambos sistemas operan con una frontera definida de responsabilidad por módulo. | `dict:mig.coexistence` | "Período de convivencia" (BASE §97.10) |
| Sincronización de convivencia | Flujo de datos entre sistemas durante la convivencia (delta ProCoop → CoopApps o exportación CoopApps → ProCoop). | `dict:mig.coexistenceSync` | — |
| Corte definitivo (cutover) | Momento en que ProCoop deja de ser sistema de registro para un alcance; delta final y aceptación. | `dict:mig.cutover` | — |
| Congelamiento | Bloqueo de cambios en ProCoop para el alcance que se corta. | `dict:mig.freeze` | — |
| Rollback / plan de retorno | Procedimiento para volver a operar en ProCoop sin perder lo registrado en CoopApps después del corte. | `dict:mig.rollback` | "Plan de retorno" (AGR-018) |
| Saldo inicial | Documento abierto o saldo de apertura migrado con titular, contrato, documento/período y origen (AGR-018). | `dict:mig.openingBalance` | Deuda en `FACTURAS`/`TALONFAC` |
| Anonimización | Transformación irreversible de datos personales para ambientes no productivos. | `dict:mig.anonymization` | — |
| Factura migrada (ProCoop) | Comprobante cargado por una migración anterior a ProCoop (`USUARIO = 'MIGRA_SP'` o `= COD_SUM` en LAG). | `dict:mig.priorMigratedInvoice` | RN-11 §3 fila 5 |

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Implementador de plataforma (tenant `PLATFORM`, acceso de soporte temporal T01/T02) | `mig.proyectos.ver`, `mig.proyectos.crear`, `mig.proyectos.configurar`, `mig.snapshots.crear`, `mig.corridas.ejecutar`, `mig.corridas.cancelar`, `mig.reglas.editar`, `mig.reglas.publicar`, `mig.rechazos.ver`, `mig.rechazos.exportar`, `mig.anonimizacion.ejecutar`, `mig.archivo.ver` | Solo los tenants con proyecto de migración asignado y acceso de soporte vigente |
| Líder de migración (plataforma) | Todas las del implementador + `mig.corte.planificar`, `mig.corte.ejecutar`, `mig.rollback.ejecutar`, `mig.bypass.configurar`, `mig.paralelo.ejecutar` | Proyectos asignados |
| Analista de datos de la cooperativa | `mig.proyectos.ver`, `mig.perfilado.ver`, `mig.rechazos.ver`, `mig.rechazos.editar` (corrección en staging), `mig.rechazos.exportar`, `mig.valores.editar` (mapas de valores propios del tenant), `mig.calidad.sanear` | Su tenant |
| Responsable funcional de dominio (cooperativa) | `mig.conciliacion.ver`, `mig.conciliacion.aprobar` (solo dominios asignados), `mig.paralelo.ver`, `mig.paralelo.justificar` | Su tenant y sus dominios |
| Contador de la cooperativa | `mig.conciliacion.aprobar` sobre COB, CON, FIS, TES, SUE; `mig.saldosIniciales.aprobar` | Su tenant |
| Responsable de la cooperativa (gerencia/consejo) | `mig.paralelo.aprobar`, `mig.bypass.aprobar`, `mig.corte.aprobar`, `mig.rollback.aprobar`, `mig.actaAceptacion.firmar` | Su tenant |
| Auditor | `mig.*.ver`, `mig.rechazos.exportar`, `mig.archivo.ver` | Su tenant (solo lectura) |
| Empleado de la cooperativa | `mig.archivo.ver` (histórico desde fichas, según el permiso del módulo dueño) | Alcance de su rol (sucursales/servicios) |
| Socio (PWA) | Ver sus comprobantes, pagos y consumos históricos migrados (permiso del portal M19) | Sus cuentas |
| Sistema (workers) | Ejecuta jobs `mig:*` con identidad técnica auditada | Tenant del job |

Reglas de permisos: la aprobación de una conciliación y su ejecución nunca la hace la misma persona (segregación, RN-MIG-041). Las capabilities de ejecución del corte y del rollback exigen 2FA reciente y doble aprobación (T11 workflow de autorizaciones).

## 5. Requisitos funcionales

### 5.1 Proyecto, inventario y estrategia

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-001 | Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. | AGR-018, RN-11 §5.1 | Núcleo | O1 | Adoptado | Un proyecto no puede apuntar a dos tenants; la sigla queda registrada y visible en todos los informes. |
| RF-MIG-002 | Inventariar fuentes: base SQL Server, MySQL del portal/app, carpetas de adjuntos y PDF (servidor/S3), archivos DBF/Access/Excel. | FIC 21 | Núcleo | O1 | Informado | El inventario lista cada fuente con responsable, medio de acceso de solo lectura y volumen estimado. |
| RF-MIG-003 | Precargar el inventario de las 659 tablas de CAT con su estrategia, destino, anexo dueño y ola por defecto (matriz §19), editable por proyecto con justificación. | CAT, Guía §1 | Núcleo | O1 | Adoptado | El proyecto muestra 659 filas; cambiar la estrategia de una tabla exige motivo y queda auditado. |
| RF-MIG-004 | Detectar tablas con datos y tablas vacías en la base de la cooperativa (conteo por tabla) y marcar módulos no usados. | DFA §34 punto 4 | Núcleo | O1 | Adoptado | Tabla vacía → estrategia sugerida "No migrar (sin datos)"; informe de uso por módulo. |
| RF-MIG-005 | Definir la estrategia de la cooperativa: orden de dominios por ola, dominios que siguen en ProCoop durante la convivencia, fecha-hito (condición, no fecha fija) de paralelo y de corte. | DFA §33, DEC-006, DEC-068 | Núcleo | O1 | Adoptado en el orden de corte (DEC-068; antes A validar PA-MIG-04); A validar (PA-MIG-03) en el modo de sincronización | El plan muestra para cada dominio su estado: no iniciado, ensayado, en paralelo, en by-pass, cortado. |
| RF-MIG-006 | Registrar el congelamiento de cambios por alcance (qué módulos de ProCoop quedan solo lectura desde qué momento). | AGR-018 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | Un corte no puede ejecutarse sin congelamiento confirmado por la cooperativa. |
| RF-MIG-007 | Detectar migraciones anteriores dentro de ProCoop (`FACTURAS.USUARIO = 'MIGRA_SP'` o igual a `COD_SUM`) y tratarlas como origen de alias. | RN-11 §3 fila 5, §5.5 | Estándar | O4 | Adoptado | El perfilado informa cuántas facturas tienen marca de migración previa y su último uso. |

### 5.2 Extracción y snapshots

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-010 | Extraer desde SQL Server con un usuario de solo lectura, sin bloqueos (lectura con instantánea o desde un backup restaurado), tabla por tabla. El servidor de la cooperativa nunca se expone a Internet: la extracción corre dentro de su red y sube los datos por conexión saliente cifrada, o el backup se cifra y se sube al almacenamiento del tenant con una URL prefirmada de un solo uso (DEC-092). Cada extracción va precedida del escaneo previo de secretos y números de tarjeta de RN-MIG-013, que bloquea la extracción si encuentra hallazgos sin clasificar (DEC-103). | BASE §97.10, FIC 21; DEC-103 | Núcleo | O1 | Informado | La extracción no produce escrituras en el origen (verificable por auditoría de SQL Server). Una base de prueba con una columna no listada que contiene un número de prueba válido por Luhn, o una columna llamada como credencial, deja el snapshot `blocked` sin extraer ninguna tabla, y el informe del escaneo no contiene el valor. |
| RF-MIG-011 | Guardar cada extracción como snapshot inmutable (formato JSON Lines o Parquet por tabla) cifrado en **Azure Blob** privado, con manifiesto (tablas, filas, columnas, hash SHA-256, versión de ProCoop, fecha de corte de datos). | AGR-018, DEC-112 | Núcleo | O0 | Adoptado | Re-extraer la misma base da el mismo hash por tabla; el manifiesto es descargable. |
| RF-MIG-012 | Extraer la base MySQL de CoopOnline/PMovil (usuarios web, cuentas vinculadas, adhesiones a factura digital, trámites). | FIC 14.1, 14.2, 21 | Estándar | O2 | Informado | Los usuarios web quedan en staging vinculados a sus cuentas. |
| RF-MIG-013 | Extraer adjuntos y PDF (facturas, actas, documentos de empleados, firmas) desde carpetas o S3, con hash y vínculo a su registro origen (`ADJUNTOS`, `ACTAS.CONTENIDO_PDF`, `FIRMADIGITAL_ITEMS`). | FIC 21 | Estándar | O1 | Informado | Cada archivo queda en el almacenamiento privado; los huérfanos se informan. |
| RF-MIG-014 | Leer archivos heredados DBF, Access y Excel mediante perfiles de importación reutilizando `ExcelImportWizard`. | FIC 21, DFA §33 (nota; antes "DFA §30"), CNX | Estándar | O1 | Adoptado | Un DBF se previsualiza con errores por fila antes de cargar. |
| RF-MIG-015 | Extracción incremental (delta) por tabla mediante columnas de fecha de registro/modificación (`FEC_REG`, `FECHA`, `FEC_ACT`) o comparación de hash por fila cuando no existan. | AGR-018 | Núcleo | O1 | Adoptado | Un delta trae solo filas nuevas o modificadas; las borradas en origen se detectan por ausencia de clave. |
| RF-MIG-016 | Registrar la fecha de corte de datos ("as of") de cada snapshot y la zona horaria del origen. | AGR-017 | Núcleo | O0 | Adoptado | Todas las fechas sin zona se interpretan en la zona del tenant y se guardan en UTC. |

### 5.3 Perfilado, calidad y limpieza

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-020 | Perfilado automático por tabla y columna: nulos, cardinalidad, mínimos/máximos, formatos, huérfanos de claves foráneas, duplicados de clave natural. | AGR-018 | Núcleo | O1 | Adoptado | El informe de perfilado se genera para cada snapshot y se compara con el anterior. |
| RF-MIG-021 | Validar CUIT/CUIL con dígito verificador módulo 11 y DNI por rango y formato; clasificar en válido, corregible (formato) o inválido. | BASE §97.10 | Núcleo | O2 | Adoptado | Un CUIT con DV incorrecto se marca inválido y no bloquea la carga de la persona (PA-MIG-11). |
| RF-MIG-022 | Detectar personas duplicadas por documento normalizado, CUIT, nombre normalizado + fecha de nacimiento, y proponer fusiones con puntaje. | BASE §97.10, AGR-018 | Núcleo | O2 | A validar (PA-MIG-10) | Ninguna fusión automática entre documentos distintos; las fusiones propuestas requieren aprobación. |
| RF-MIG-023 | Prohibir fusionar contratos o cuentas por coincidencia de persona o domicilio. | AGR-018, BASE TIT-003 | Núcleo | O2 | Informado | Dos cuentas con igual domicilio siguen siendo dos cuentas. |
| RF-MIG-024 | Normalizar domicilios contra el callejero del tenant (`CALLES`/`RNQCALL` → `streets`), barrios y localidades; marcar no normalizables. | BASE §97.10 | Núcleo | O1 | A validar (PA-MIG-12) | % de domicilios normalizados visible por localidad; los no normalizados quedan con texto original. |
| RF-MIG-025 | Consolidar catálogos duplicados (`CALLES` vs `RNQCALL`, `DEPARTA` vs `DEPTO`, `CENTRALT` vs `TEL_CENTRAL`, `SECCION` vs `CTSECCION`, `NIV_*` vs `REDES_*`). | CAT §11, §12, §17, §30 | Estándar | O1 | A validar (PA-MIG-13) | Cada par queda con una regla de consolidación documentada. |
| RF-MIG-026 | Validar correos y celulares (formato E.164 Argentina) sin bloquear la carga. | BASE §97.10 | Estándar | O2 | Adoptado | Contactos inválidos se cargan marcados `unverified`. |
| RF-MIG-027 | Cola de saneamiento por tipo de problema con asignación a usuarios de la cooperativa, corrección en staging y reproceso. | BASE CU-31 | Núcleo | O1 | Adoptado | Corregir una fila en staging y reprocesar no duplica lo ya cargado. |
| RF-MIG-028 | Limpieza en origen opcional: la cooperativa puede corregir en ProCoop y la próxima extracción lo trae. La herramienta indica qué corregir dónde. | AGR-018 | Estándar | O1 | Adoptado | El informe de calidad indica para cada problema si se corrige en origen o en staging. |

### 5.4 Mapeo y transformación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-030 | Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. | AGR-018 | Núcleo | O1 | Adoptado | Cada corrida referencia un conjunto publicado; un conjunto publicado es inmutable. |
| RF-MIG-031 | Reglas base de plataforma (comunes a toda cooperativa ProCoop) y reglas de tenant (overrides) con precedencia explícita. | DEC-002 | Núcleo | O1 | Adoptado | Un override del tenant A no afecta al tenant B. |
| RF-MIG-032 | Mapas de valores para códigos maestros (situaciones IVA, tipos de documento, estados de servicio, causas, transacciones técnicas, tipos de comprobante, medios de pago). | BASE §97.10 | Núcleo | O1 | Adoptado | Un código origen sin mapeo es rechazo bloqueante del registro que lo usa. |
| RF-MIG-033 | Transformar tablas espejo de anulación (`ANUFAC`, `ANUITEMSFAC`, `ANUPAG_SOC`, `ANUIT_PAGSO`, `ANUPLAN_CAJ`) en el mismo documento con estado anulado y vínculo de reversión. | DFA §32 | Núcleo | O4 | Adoptado | Un comprobante anulado aparece una sola vez, con estado `voided`. |
| RF-MIG-034 | Transformar históricos `HIS_*` y `*_HST` en versiones con `validFrom`/`validTo` del documento destino. | DFA §32 | Núcleo | O2 | Adoptado | La versión vigente a una fecha se reconstruye igual que en ProCoop. |
| RF-MIG-035 | Transformar tablas `*_EXTRAS` en campos del documento principal o atributos configurables tipados. | DFA §32 | Núcleo | O1 | Adoptado | Ningún `*_EXTRAS` queda como colección suelta. |
| RF-MIG-036 | Convertir importes a `Decimal128` con la escala de origen sin redondeo; registrar diferencias de redondeo explícitas. | Guía §5, AGR-011 | Núcleo | O0 | Adoptado | La suma de importes migrados por tabla coincide al centavo con el origen. |
| RF-MIG-037 | Convertir fechas a UTC según zona del tenant; fechas nulas o `1900-01-01` tratadas como ausentes. | AGR-017 | Núcleo | O0 | Adoptado | Ningún vencimiento cambia de día por zona horaria. |
| RF-MIG-038 | Mapear `GRUPOS_FACTURA` a grupos de facturación equivalentes, con validación fiscal previa de cada combinación de servicios. | BASE §103 FAC-012 | Núcleo | O4 | Informado | Cada grupo ProCoop tiene su grupo CoopApps o un rechazo con motivo fiscal. |
| RF-MIG-039 | Mapear `SERSOC` (servicio de la cuenta) a contrato + categoría + equipo/instalación y estado del catálogo de BASE §39.5. | BASE §97.10 | Núcleo | O2 | Informado | Cada servicio activo en ProCoop es un contrato activo con su estado mapeado. |
| RF-MIG-099 | Plantillas de `ExcelImportWizard` definidas por T07 para los dominios que ProCoop no registra en tablas propias o que registra de forma incompleta (cementerio parque, banco ortopédico, dispenser de agua), con columnas, validaciones por fila, orden de carga y conciliación propios (§19.33). La carga usa el servicio del módulo dueño en modo `migration` (RF-MIG-040) y queda en `legacyIdMap` con `legacy.table = 'XLS:<plantilla>'`. | HUECO-CEM-03, HUECO-OTR-01; BASE CU-31; CNX `ExcelImportWizard` | Estándar | O10 | Adoptado | La plantilla de unidades de cementerio rechaza una fila con código de unidad repetido en el establecimiento y la conciliación por unidad lista las unidades con niveles ocupados mayores que su capacidad. |

### 5.5 Carga, mapa de IDs e idempotencia

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-040 | Cargar por dominio invocando el servicio del módulo dueño en modo `migration` (validaciones de dominio activas, sin emitir eventos de negocio que disparen efectos externos). | DEC-003 | Núcleo | O1 | Adoptado | Una carga no envía mails, SMS, ni publica deuda a entes. |
| RF-MIG-041 | Mantener `legacyIdMap` (tenant, tabla origen, clave origen serializada → colección, `_id` destino, corrida, hash del registro). | Pedido | Núcleo | O0 | Adoptado | Para cualquier `legacyId` se obtiene el documento nuevo y viceversa. |
| RF-MIG-042 | Guardar en cada documento destino `legacy: { system: 'procoop', table, key, runId, hash }`. | Pedido | Núcleo | O0 | Adoptado | Búsqueda por número ProCoop (N° de cuenta, N° de socio, NIP, N° de comprobante) desde la UI. |
| RF-MIG-043 | Reprocesos idempotentes: misma clave origen + mismo hash → sin cambio; mismo origen con hash distinto → actualización versionada (solo si el documento destino no tuvo cambios operativos posteriores); si los tuvo → conflicto. | FIC 21, BASE CU-31 | Núcleo | O1 | Adoptado | Ejecutar dos veces el mismo lote no duplica (BASE CU-31 "Excepción"). |
| RF-MIG-044 | Cargas por lotes con tamaño configurable, transacciones por lote, reanudables desde el último lote confirmado. | Guía §5 Jobs | Núcleo | O1 | Adoptado | Un corte de energía a mitad de carga se retoma sin duplicar. |
| RF-MIG-045 | Orden topológico de carga según dependencias (maestros → personas → cuentas → contratos → medidores → tarifas → documentos → pagos → saldos). | AGR-018 | Núcleo | O1 | Adoptado | Ningún documento referencia un `_id` inexistente. |
| RF-MIG-046 | Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. | AGR-018 | Núcleo | O1 | Adoptado | Tras borrar la corrida, el tenant de ensayo queda sin documentos con ese `runId`. |
| RF-MIG-047 | Tabla de alias de claves externas (`legacyKeyAliases`): códigos de barra ProCoop, identificador Red Link/SIRO, `FACTURAS.USUARIO`, cuentas "cuenta × 100 + servicio", `CNT_NOT`, `TALONFAC.NUMERO`. | RN-11 Implicancias 1–2 | Núcleo | O5 | Informado | Un pago que llega con la clave vieja se resuelve a cuenta + servicio + comprobante CoopApps. |

### 5.6 Validación, rechazos y conciliación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-050 | Validación previa por fila con errores bloqueantes y advertencias, mostrada antes de confirmar (patrón ExcelImportWizard). | BASE CU-31, CNX | Núcleo | O1 | Informado | En MIG-DEMO-001 se ven 3 filas, 2 válidas, 1 error "Suministro sin titular asociado". |
| RF-MIG-051 | Informe de rechazos por corrida: tabla, clave, regla, campo, valor, severidad, acción sugerida; exportable XLSX/CSV. | Pedido, FIC 21 | Núcleo | O1 | Adoptado | El informe permite filtrar por dominio y exportar. |
| RF-MIG-052 | Exclusión explícita de una fila (con motivo y aprobación) para poder aprobar una carga. | BASE CU-31 | Núcleo | O1 | Informado | La fila excluida figura en la conciliación como diferencia explicada. |
| RF-MIG-053 | Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. | BASE §31, AGR-018 | Núcleo | O1 | Informado | Sin aprobación el dominio no puede pasar a "cortado". |
| RF-MIG-054 | Conciliación de deuda por titular y por servicio, con total general igual al saldo de deudores por servicios de la contabilidad. | BASE §97.10, AGR-018 | Núcleo | O5 | Informado | Ejemplo AGR-018: saldo inicial ARS 8.000 conserva titular, contrato, documento/período y origen y coincide con el total contable. |
| RF-MIG-055 | Conciliación de fondos: cajas abiertas, valores en cartera, cuentas bancarias, saldos a favor y pagos no identificados. | AGR-018 | Núcleo | O5 | Adoptado | Suma de fondos migrados = saldo contable de las cuentas de disponibilidades. |
| RF-MIG-056 | Conciliación de stock por depósito, producto y número de serie; equipos instalados en comodato por cuenta. | AGR-018 | Núcleo | O3 | Adoptado | Cada equipo serializado está en un depósito o en una cuenta, nunca en ambos. |
| RF-MIG-057 | Conciliación contable: balance de sumas y saldos a la fecha de corte igual en ambos sistemas. | DEC-009 | Núcleo | O5 | Adoptado | Diferencia 0 por cuenta contable a la fecha de corte. |
| RF-MIG-058 | Conservar el informe de conciliación firmado como evidencia en el expediente documental (T11). | BASE CU-31 | Núcleo | O1 | Informado | El informe es inmutable y descargable con hash. |

### 5.7 Histórico, archivo y consulta

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-060 | Cargar históricos tipados de solo lectura en la colección del módulo dueño con `legacy.readOnly = true` (comprobantes, recibos, lecturas, asientos, recibos de sueldo) según la profundidad definida. | BASE §31 "Carga de históricos con su procedencia" | Núcleo | por dominio | Adoptado (DEC-070; antes A validar PA-MIG-01) | Un histórico no puede editarse, anularse ni reimprimirse como original; se exhibe con marca "Migrado de ProCoop". |
| RF-MIG-061 | Archivo histórico genérico `legacyRecords` para tablas Histórico sin modelo tipado: payload JSON del registro origen, tabla, clave, fechas, búsqueda por cuenta/persona. | AGR-018 | Estándar | O11 | Adoptado | Desde la ficha de la cuenta se abre "Histórico ProCoop" con los registros vinculados. |
| RF-MIG-062 | Archivar el snapshot completo (las 659 tablas) durante el plazo de conservación, con acceso restringido y auditado. | BASE §97.8 Conservación | Núcleo | O1 | Adoptado (DEC-070: copia del origen 10 años; antes A validar PA-MIG-01) | Una consulta al archivo frío requiere permiso `mig.archivo.ver` y queda auditada. |
| RF-MIG-063 | Exhibir al socio en el portal sus comprobantes y pagos históricos migrados (con PDF original si existe). | FIC 14.1 | Estándar | O11 | Adoptado | El socio ve facturas ProCoop de los últimos 24 meses con su PDF. |
| RF-MIG-064 | Reimpresión de duplicados de comprobantes históricos con leyenda "Duplicado – emitido por el sistema anterior", usando el PDF original o una representación reconstruida. | BASE §31 | Estándar | O11 | Adoptado | Nunca se reimprime con nuevo CAE. |

### 5.8 Corrida paralela y facturación comparada

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-070 | Ejecutar ciclos de facturación en paralelo sobre el mismo padrón y período que ProCoop, en modo simulación (sin CAE, sin publicar deuda, sin notificar). | DFA §33, FAC-012 | Núcleo | O7 (DEC-089; antes O11) | Informado | El lote paralelo no genera ningún efecto externo. |
| RF-MIG-071 | Importar los comprobantes reales emitidos por ProCoop del período (delta) y emparejarlos con los simulados por cuenta + servicio + período (+ grupo de facturación). | DFA §33 | Núcleo | O7 (DEC-089; antes O11) | Informado | % de emparejamiento visible; los no emparejados se listan por motivo. |
| RF-MIG-072 | Comparar factura por factura: cantidades (consumos, días, unidades), importes por concepto, impuestos/percepciones/tasas, totales, cuatro vencimientos con sus importes, grupo de facturación y apertura por servicio. | DFA §33, FAC-007, FAC-012 | Núcleo | O7 (DEC-089; antes O11) | Informado | Para el mismo período y padrón, cada diferencia queda clasificada y explicada. |
| RF-MIG-073 | Clasificar diferencias (configuración, dato migrado, redondeo, regla corregida a propósito, error CoopApps, error ProCoop conocido) y asignarles responsable y justificación. | DFA §33, RN-11 Implicancias 8 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | No se aprueba un ciclo con diferencias sin clasificar. |
| RF-MIG-074 | Comparar también mora (intereses y recargos de cobros del período), cobranzas imputadas y asientos generados (modo simulación). | DFA §33, FIC 18.2 | Estándar | O7 (DEC-089; antes O11) | Adoptado | Los intereses de cada cobro coinciden o la diferencia está explicada. |
| RF-MIG-075 | Tablero de paralelo: comprobantes comparados, iguales, distintos dentro de tolerancia, distintos fuera de tolerancia, explicados, pendientes; por servicio, categoría, ruta y concepto. | DFA §33 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | El tablero se exporta como evidencia del acta. |
| RF-MIG-076 | Aprobación del paralelo por ciclo y por servicio cuando se cumplen los criterios del §17. | AGR §7 F | Núcleo | O7 (DEC-089; antes O11) | A validar (PA-MIG-02) | Requiere los ciclos consecutivos definidos con 100 % explicado. |

### 5.9 By-pass, convivencia, corte y rollback

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-080 | Plan de by-pass por módulo con estado: ProCoop maestro → CoopApps en paralelo → CoopApps maestro (ProCoop solo consulta) → ProCoop apagado. | DFA §33, FIC 21, DEC-068 | Núcleo | O7 (DEC-089; antes O11) | Adoptado (DEC-068; antes A validar PA-MIG-04) | En cada momento cada dominio tiene un único sistema de registro. |
| RF-MIG-081 | Sincronización ProCoop → CoopApps por deltas programados mientras ProCoop es maestro (para paralelo y ensayos). | FIC 21 | Núcleo | O7 (DEC-089; antes O11) | A validar (PA-MIG-03) | Delta diario configurable; la duración y el resultado de cada delta quedan registrados. |
| RF-MIG-082 | Exportaciones CoopApps → ProCoop para módulos que siguen en ProCoop (asientos contables con formato `ImportarAsientos`/`ImportarAsientosConSeccion`, novedades de sueldos, altas de cuentas para módulos dependientes). | FIC 18.2, DFA §33 nota, DEC-068, DEC-069 | Estándar | O7 (DEC-089; antes O11) | Adoptado (DEC-068 y DEC-069; antes A validar PA-MIG-04) | El asiento exportado se importa en ProCoop sin edición manual. |
| RF-MIG-083 | Resolutor de claves heredadas durante la transición (Red Link, SIRO, códigos de barra ProCoop en caja, `FACTURAS.USUARIO`) que solo imputa a comprobantes impagos y no imputa ante ambigüedad. | RN-11 Implicancias 1–4 | Núcleo | O5 | Informado | Dos candidatos → pago a cuenta con aviso; nunca a una factura paga. |
| RF-MIG-084 | Lectura en caja de los formatos de código de barra ProCoop vigentes (incluido SIRO-Roela 56 dígitos `0447`, `0448`, `0449`) hasta que venzan los comprobantes ProCoop. | RN-11 Implicancias 4 | Núcleo | O5 | Informado | Un comprobante ProCoop impago se cobra en caja CoopApps leyendo su código. |
| RF-MIG-085 | Publicar a los entes, desde el corte, un identificador de comprobante autocontenido y convivir con el padrón anterior hasta el vencimiento de lo emitido por ProCoop. | RN-11 Implicancias 3 | Estándar | O5 | Informado | Coordinado con Red Link/SIRO; doble padrón durante la transición. |
| RF-MIG-086 | Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. | AGR-018 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | El corte no se habilita si algún criterio go está en rojo. |
| RF-MIG-087 | Delta final post-congelamiento, conciliación final y acta de aceptación firmada. | AGR-018, AGR §7 F | Núcleo | O7 (DEC-089; antes O11) | Informado | El acta firmada habilita el tenant en producción para el alcance cortado. |
| RF-MIG-088 | Rollback: plan de retorno con diario (`rollbackJournal`) de todo hecho registrado en CoopApps después del corte (cobros, comprobantes, lecturas, altas) y exportación para cargarlo en ProCoop. | AGR-018 | Núcleo | O7 (DEC-089; antes O11) | Informado | "Los cambios realizados después del corte no desaparecen si se debe volver al sistema anterior" (AGR-018). |
| RF-MIG-089 | Ventana de rollback acotada: después de la primera emisión fiscal real o del primer cobro por entes en CoopApps, el rollback solo puede ser "hacia adelante" (reexportación), nunca restauración. | AGR-019 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | La UI bloquea el rollback por restauración pasado ese hito. |
| RF-MIG-090 | Migrar usuarios del portal (correos, cuentas vinculadas, adhesiones a factura digital) para que los socios no se registren de nuevo, sin contraseñas. | FIC 14.1 | Núcleo | O2 | A validar (PA-MIG-07) | El socio recibe invitación de activación y ve sus cuentas ya vinculadas. |

### 5.10 Anonimización y ambientes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MIG-095 | Perfiles de anonimización por tabla/campo: seudonimización determinística (mismo valor → mismo seudónimo, para conservar duplicados), generalización (fechas de nacimiento a año), supresión (credenciales, observaciones libres), CUIT/DNI ficticios con DV válido. | REL README, FIC 21 | Núcleo | O1 | A validar (PA-MIG-15) | Ningún dato personal real llega a desarrollo/pruebas; los CUIT generados validan DV. |
| RF-MIG-096 | Prohibir cargar snapshots no anonimizados en ambientes distintos de producción y del tenant de ensayo de la propia cooperativa. | BASE §97.9 | Núcleo | O1 | Adoptado | El job rechaza el destino si el snapshot no tiene marca `anonymized`. |
| RF-MIG-097 | Anonimizar también adjuntos (PDF de facturas, actas, documentos) reemplazándolos por PDF genéricos. | REL README | Estándar | O1 | Adoptado | Ningún PDF real en ambientes de prueba. |
| RF-MIG-098 | Las capturas, informes y ejemplos de esta documentación usan datos ficticios. | REL README, Guía §2 | Núcleo | O0 | Informado | Revisión de documentación sin datos personales. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | Verificación |
|---|---|---|---|---|---|
| RN-MIG-001 | Solo lectura en origen. | — | Replicar requisito BASE §97.10: usuario de solo lectura o backup restaurado. | — | — |
| RN-MIG-002 | Una cooperativa = un proyecto = un tenant. Varias "empresas" de ProCoop (`EMPRESAS`, `SU_EMPRESAS`) se convierten en razones sociales del mismo tenant salvo decisión distinta. Por DEC-064 son `legalEntities` de T04 (no de T01, CTR-DAT-48) y todo documento económico migrado (comprobantes, recibos, asientos, comprobantes de proveedor, recibos de sueldo) lleva `legalEntityId`; un documento sin entidad resoluble es rechazo bloqueante. **Datos sin empresa en ProCoop (10-11-2026, DEC-096):** las membresías de asociado que salen de `SOCIOS` (`associateMemberships` de M17, con `legalEntityId` obligatorio) se asignan a la entidad por defecto (`legalEntities.isDefault`, T04 RF-CFG-142) salvo que la cooperativa indique otra por lista o por regla antes de F3 (M17 §19); los centros de costo de `CTSECCION` y `SECCION` se crean con la entidad por defecto como dueña y compartidos con todas las entidades del tenant (`sharedWithLegalEntityIds`, M15 RF-CON-081, RN-CON-127). La conciliación cuenta membresías y centros de costo por entidad. | Una base por cooperativa (deuda técnica, Guía §3.5) | Reemplazar por tenant único (DEC-002) con varias entidades jurídicas (DEC-064). | PRM-MIG-001 | [VERIFICAR] cooperativas con varias razones sociales |
| RN-MIG-003 | Estrategia por tabla: Migrar vivo, Histórico o No migrar (Descartar/Reemplazado por). Toda tabla se archiva en el snapshot. | — | Adoptar matriz §19. | — | — |
| RN-MIG-004 | Se migra vivo todo lo necesario para operar el día siguiente al corte: maestros, personas, cuentas, contratos activos y dados de baja con deuda, equipos instalados, tarifas vigentes y las necesarias para períodos abiertos, documentos abiertos, saldos, convenios vigentes, stock, saldos contables, legajos activos. | BASE §97.10 | Adoptar. | — | — |
| RN-MIG-005 | Tarifas: se migran los cuadros vigentes y los necesarios para reproducir períodos abiertos (refacturación, NC/ND sobre períodos no prescriptos). | BASE §97.10 | Replicar. | PRM-MIG-010 (meses de cuadros a migrar vivos, default 24) | — |
| RN-MIG-006 | Deuda: documento por documento abierto (no saldo neto), conservando número ProCoop, vencimientos (hasta 4), importes por vencimiento, servicio y período, y conciliación por titular y servicio antes del corte. | BASE §97.10, AGR-018, FAC-008 | Adoptar. | — | A validar (PA-MIG-05) |
| RN-MIG-007 | Comprobante agrupado ProCoop (Grupo Factura): se migra como un documento con renglones por servicio y una obligación por servicio en el auxiliar (FAC-008); si los renglones no permiten asignar un ítem a un servicio, se asigna por `ITEMSFAC.COD_SER` y, en su defecto, a un servicio "sin asignar" con advertencia. | `GRUPOS_FACTURA`, `ITEMSFAC.COD_SER` | Replicar con mejora (FAC-012). | — | — |
| RN-MIG-008 | Pagos parciales históricos: el saldo por servicio de un comprobante agrupado se calcula aplicando `IT_PAGSO` (cancelaciones reales). Si ProCoop no discrimina el servicio en el pago, se prorratea proporcional al saldo de cada servicio con advertencia. | `IT_PAGSO.SAL_ACT`, `ENTREGA` | Mejorar (regla explícita AGR-012). | PRM-MIG-011 | [VERIFICAR] con datos |
| RN-MIG-009 | Anulaciones: un registro en tablas `ANU*` se transforma en estado `voided` del documento original + documento/evento de reversión; nunca se duplica. | `ANUFAC`, `ANUPAG_SOC` (DFA §32) | Reemplazar. | — | — |
| RN-MIG-010 | Versiones: `HIS_*`/`*_HST` se transforman a versiones con `validFrom`/`validTo`; si los rangos se solapan se usa la fecha de registro más reciente y se informa advertencia. | DFA §32 | Reemplazar. | — | — |
| RN-MIG-011 | `*_EXTRAS` se integran al documento principal (1:1) o a atributos configurables tipados. | DFA §32 | Reemplazar. | — | — |
| RN-MIG-012 | Campos configurables (`DATOSEXT`/`DATOSETB`, `PROPIEITEMS*`) se migran como definiciones de atributos tipados (T04) + valores. | CAT §28 | Reemplazar. | — | — |
| RN-MIG-013 | Credenciales y secretos (`TELEMEDICION.PASS_TEL`, `MIKROTIK.CONTRASEÑA`, `INTERBANKING.*SECRET/TOKEN/PASS`, `CORREOS_INTERNOS.PASS`, `FIRMASDIGITALES.CLIENT_SECRET/HASH`, `WS_KEYS.API_KEY`, `USERS.PASSWORD`, `RESPONSA.PAS_RES`, `WS_USERS.PASSWORD`, `INTERNET.USER_PASS`, `CORREOSINT.USER_PASS`, `TICKETS_CONTACTOS.CLAVE`; además, por DEC-103: la clave web de `SOCIOS` generada por `GenerarClaveWeb` (M01 RN-PER-119), la clave del proveedor de IA guardada en `VARIABLE` (RN-09 var 3048, reemplazada por T02 RF-IAM-151) y las credenciales de proveedores, profesionales y empleados si aparecen en la base real) **nunca** se migran ni se copian a staging en claro; se suprimen en la extracción y se regeneran en cada proveedor y solo el valor nuevo se carga en la bóveda (T06, RF-INT-023; DEC-092; antes "se reingresan en la bóveda", que permitía reutilizar el valor heredado). Los accesos de socios y usuarios se rehabilitan por invitación de activación (PA-MIG-07, T02 RF-IAM-041), no con la clave heredada. **Escaneo previo de secretos (DEC-103)**: antes de cada extracción (completa o delta, RF-MIG-010 y RF-MIG-015) `mig-extractor` escanea en el propio origen las columnas que la extracción va a leer y busca (a) números de tarjeta: secuencias de 13 a 19 dígitos que pasan la validación de Luhn, en cualquier columna de texto o numérica, incluida `CUPONTAR`; y (b) columnas con apariencia de credencial no listadas en esta regla: nombre que contiene `PASS`, `CLAVE`, `CONTRASE`, `SECRET`, `TOKEN`, `API_KEY`, `KEY`, `HASH`, `PIN` o `PWD`, o contenido con forma de hash, clave de API o token (alta entropía, longitud fija). Si encuentra alguno, el snapshot queda `blocked` y la migración no avanza hasta que la cooperativa y el equipo de migración clasifiquen cada columna (credencial → se agrega a la supresión de esta regla; número de tarjeta → se aplica RN-MIG-056; falso positivo → se registra el descarte con su justificación, aprobado por el responsable de seguridad del proyecto) y la extracción se repita con la columna suprimida. El escaneo registra solo tabla, columna, tipo de hallazgo y cantidad de filas, **nunca** valores ni fragmentos (T08 RN-NFR-003 y RN-NFR-009, sección 19). | Contraseñas reversibles (Guía §3.5); DEC-103 (aporte A11) | Reemplazar. | PRM-MIG-064 | — |
| RN-MIG-014 | Persona: se deduplica; titular/cuenta/contrato no. Una persona con dos documentos distintos nunca se fusiona automáticamente. **Persona única en los maestros de rol (DEC-097)**: proveedores (`PROVEED` → M12), vendedores (`VENDEDOR` → M11), choferes (`CHOFERES` → M18) y médicos o profesionales (`MEDICOS` → M18) no copian la identidad a la ficha del rol: cada fila se vincula a una persona existente del padrón ya migrado (titulares de `PERSONAS`, empleados de `SU_EMPLEADOS`, otros maestros de rol) o crea una nueva, con las mismas reglas de unificación que el padrón (RF-MIG-022, M01 RF-PER-155; coincidencia por CUIT o por el DNI contenido en la CUIT, M01 RN-PER-011; sin fusión automática entre documentos distintos), y la ficha del rol se carga con `personId` obligatorio. Un socio que además es proveedor o chofer queda con una sola persona y varios roles. Las coincidencias por debajo del umbral se resuelven en la cola de saneamiento antes de cargar el rol; si la fila no trae documento, la persona nueva queda `documentPending` (RN-MIG-058). Por eso el orden topológico de F7 carga estos maestros después de `PERSONAS` y `SU_EMPLEADOS`. | BASE §97.10, AGR-018, TIT-003; DEC-097 (aporte A5) | Adoptar. | PRM-MIG-020 (umbral de similitud) | A validar (PA-MIG-10) |
| RN-MIG-015 | El NIP y el número de titular de ProCoop se conservan como identificadores externos visibles y buscables. | BASE §97.10 | Replicar. | — | — |
| RN-MIG-016 | La condición fiscal de `SUMSOC.COD_SIT` pasa a la persona o al contrato según corresponda: si todas las cuentas de un titular tienen la misma situación → persona; si difieren → contrato con advertencia. | BASE §97.10 | Adoptar. | — | — |
| RN-MIG-017 | Estados de servicio ProCoop (`ESTASER`, con `DESCONEC`) se mapean al catálogo de estados de BASE §39.5 mediante mapa de valores aprobado por la cooperativa. | BASE §97.10 | Adoptar. | — | — |
| RN-MIG-018 | Zona, sector y recorrido (`SUMSOC`, `CONNRUTA`, `CALLES.RUTA/ORDEN`) se migran a rutas de lectura conservando el orden de lectura. | BASE §97.10 | Replicar. | — | — |
| RN-MIG-019 | Observaciones con bloqueo (`NOTA_SUM.BLO_CAJ`, `MSG_CAJ`) se migran como bloqueos operativos con efecto explícito (bloqueo de cobro en caja, mensaje en caja). | BASE §97.10 | Mejorar. | — | — |
| RN-MIG-020 | Medidores: se migra el medidor instalado con última lectura válida (`MEDSOC.FEC_LEC`, `EST_LEC`), factor multiplicador y dígitos; el historial de cambios como histórico. | CAT §3 | Adoptar. | — | — |
| RN-MIG-021 | Lecturas: se migran vivas las lecturas del período abierto y los consumos necesarios para promedios/estimaciones (por defecto 12 períodos); el resto histórico. | — | Adoptar. | PRM-MIG-012 (períodos de consumo vivos, default 13) | — |
| RN-MIG-022 | Prepago: el saldo de crédito prepago vigente por medidor se migra vivo con conciliación contra `PREPAGA` y ventas de recarga; las recargas pendientes de acreditar en el medidor se informan. | RN-11 (70 % recargas prepagas) | Adoptar. | — | — |
| RN-MIG-023 | Intereses de mora devengados al corte: CoopApps los recalcula desde cada vencimiento con las tablas de mora migradas (`TABMORA`, `INDICESMORA`, `MORATAS`, `TRAMASREC`) y la diferencia con ProCoop se concilia en el paralelo. | `IT_PAGSO_INTERES*` | Adoptar. | — | A validar (PA-MIG-06) |
| RN-MIG-024 | Intereses diferidos (`INT_DIFE` pendientes de facturar) se migran vivos como conceptos a facturar en el próximo comprobante. | CAT §8 | Replicar. | — | — |
| RN-MIG-025 | Convenios de refinanciación vigentes (`REC_CON`, `IT_RECCO`) se migran vivos con cuotas pendientes; los cancelados/caídos como histórico. | CAT §9 | Adoptar. | — | — |
| RN-MIG-026 | Excepciones de mora vigentes (`EXC_MORA` con `VIGENCIA` futura) se migran vivas. | CAT §8 | Replicar. | — | — |
| RN-MIG-027 | Notificaciones de mora abiertas (`NOTIFICA` no resueltas, `COMPNOTI`) se migran vivas para conservar la instancia y el código de barras de notificación (tipo 5). | RN-11 §2.3 | Adoptar. | — | — |
| RN-MIG-028 | Numeración fiscal: el último número autorizado por punto de venta y tipo (`COMPPOS.ULT_NUM`) se toma de ARCA (FECompUltimoAutorizado) en el corte y se compara con ProCoop; si difieren, prevalece ARCA. | CAT §5 | Adoptar. | — | A validar (PA-MIG-08) |
| RN-MIG-029 | No puede haber comprobantes ProCoop pendientes de autorizar en ARCA al corte (alerta "Hay facturas electrónicas pendientes de autorizar!"). | REL README | Adoptar como criterio go/no-go. | — | — |
| RN-MIG-030 | En la corrida paralela CoopApps no solicita CAE/CAEA, no publica deuda a Red Link/SIRO/Pagos360, no envía notificaciones ni genera asientos oficiales. | DFA §33 | Adoptar. | — | — |
| RN-MIG-031 | Durante la convivencia cada dominio tiene un único sistema de registro; está prohibido registrar el mismo hecho en ambos (ej. cobrar la misma factura en las dos cajas). | AGR-018 | Adoptar. | — | — |
| RN-MIG-032 | Los alias de claves heredadas se mantienen hasta el vencimiento del último comprobante ProCoop más un margen; luego se desactivan (no se borran). | RN-11 Implicancias 1–3, Duda 7, DEC-050 | Adoptar. Por DEC-050 los comprobantes nuevos llevan un identificador de pago autocontenido de M07 y la clave ProCoop se resuelve por alias solo hasta que vencen las facturas migradas. | PRM-MIG-030 (días de margen, default 180) | Criterio respondido (DEC-050); margen A validar (PA-MIG-16) |
| RN-MIG-033 | Resolución de pagos con clave heredada: solo comprobantes impagos; desempate por vencimiento vigente a la fecha de cobro y luego por el más antiguo; si persisten dos candidatos, pago a cuenta con aviso; identificadores como texto o entero de 64 bits. | RN-11 Implicancias 1 (Procoop elige la más reciente aunque esté paga; desborde `Int32`) | Mejorar. | — | — |
| RN-MIG-034 | Facturas de la migración anterior a ProCoop (`USUARIO = 'MIGRA_SP'` o `= COD_SUM` en LAG) se migran con el alias del código anterior; el criterio de exclusión de ENARGAS se reproduce por marca `legacy.priorMigration = true`. | RN-11 §3 fila 5 | Replicar con mejora. | — | [VERIFICAR] RN-11 §5.5 |
| RN-MIG-035 | Equipos en comodato (`SERSOC_PRODUCTOS`) se migran como equipos asignados a contrato, con número de serie de `PROD_TRH`; el stock del depósito excluye esas unidades. | CAT §1, §15 | Adoptar. | — | — |
| RN-MIG-036 | Contabilidad: saldos de apertura del ejercicio en curso + asientos del ejercicio en curso vivos/tipados; ejercicios cerrados como histórico. | DEC-009 | Adoptar. | — | A validar (PA-MIG-09) |
| RN-MIG-037 | Sueldos: legajos activos, novedades del período abierto y acumulados del año fiscal y del semestre (SAC, Ganancias, vacaciones) vivos; recibos anteriores históricos tipados. | CAT §18 | Adoptar. | PRM-MIG-013 (meses de recibos tipados, default 24) | — |
| RN-MIG-038 | Datos sensibles de salud (`AMBULANC`, causas, médicos) se migran cifrados a nivel de campo con acceso restringido. | Ley 25.326 (BASE §98) | Adoptar. | — | A validar (PA-MIG-19) |
| RN-MIG-039 | Una corrida queda en `loaded` solo si 0 rechazos bloqueantes o todos excluidos explícitamente con aprobación. | BASE CU-31 | Adoptar. | — | — |
| RN-MIG-040 | Tolerancias de conciliación: cantidades 0 diferencia; importes 0,00 ARS por documento salvo diferencias de redondeo explicadas ≤ 0,01 por documento; totales por dominio 0,00 explicados. | DFA §33 | Adoptar. | PRM-MIG-040 | — |
| RN-MIG-041 | Segregación: quien ejecuta una corrida no aprueba su conciliación; el corte y el rollback requieren doble aprobación y 2FA. | T02, T11 | Adoptar. | — | — |
| RN-MIG-042 | Reproceso sobre documento modificado operativamente en CoopApps → conflicto, nunca sobrescritura. | AGR-018 | Adoptar. | — | — |
| RN-MIG-043 | Las cargas en modo `migration` no disparan eventos externos ni notificaciones; los eventos internos se emiten con `migration: true` para que los consumidores los ignoren o los procesen en modo silencioso. | DEC-003 | Adoptar. | — | — |
| RN-MIG-044 | Los catálogos normativos nacionales (escalas de Ganancias, salario mínimo, alícuotas IVA, tipos de documento ARCA) no se migran desde la cooperativa: se usan las tablas de plataforma y la copia ProCoop solo sirve para conciliar. | CAT §5, §18 | Reemplazar. | — | — |
| RN-MIG-045 | Padrones externos (`EMPAFIP`, `IIBB_LUA`) no se migran: se reimportan vigentes desde la fuente oficial (M06). | CAT §5 | Reemplazar. | — | — |
| RN-MIG-046 | Tablas temporales y de trabajo (`TEMPMODIFBONIF`, `MOROSO_TEMPORAL`, `IMP_WORK`, `BLOQUEO_FILAS`, exportaciones técnicas) no se migran. | CAT | Descartar. | — | — |
| RN-MIG-047 | El motor de pantallas y menús de ProCoop (`ENTIDA*`, `MENUSYS`, `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES`) no se migra: se reemplaza por `siteMapGroups`, DataTable con vistas guardadas y Zod; su contenido se usa como inventario de cobertura. | CNX, DFA | Reemplazar. | — | — |
| RN-MIG-048 | Las fórmulas embebidas de ProCoop (`CARGOS_ADICIONALES.FORMULA_*`, `SU_CONCEPTOS.FORMULA_*`, `SU_VARIABLES.FORMULA`, `TIP_FIN.FOR_CAL`, `REQUISITOS.*QUERY*`, `TRAMITES_ACCIONES.SCRIPT_ACCION`) se traducen al lenguaje de fórmulas de CoopApps con revisión humana y prueba en paralelo; las que contienen SQL no se ejecutan nunca. | CAT §2, §18, §26 | Reemplazar. | — | [VERIFICAR] con datos reales |
| RN-MIG-049 | Parámetros V2 (`VARIABLE`) se mapean al catálogo PRM (T04b) por número V2; un V2 sin PRM equivalente se registra para decisión. | T04b | Adoptar. | — | — |
| RN-MIG-050 | La migración nunca comunica al socio cambios de número de cuenta: los números ProCoop se conservan como número visible de cuenta salvo colisión. | BASE §97.10 | Adoptar. | PRM-MIG-002 | — |
| RN-MIG-051 | **Clasificación de tasas y tributos** (HUECO-TAS-03). Cada fila de `IMPUESTO` y cada clase de `CLASESER` (y de `CON_TASAS` solo si el perfilado encuentra una fila usada en facturación; ver la fila de §19.2) que represente una tasa se clasifica, antes de cargarse, en **tributo propio**, **tributo de terceros** o **concepto de terceros** aplicando la regla de clasificación de M06 (RN-FIS-126, RF-FIS-163; HUECO-TAS-03). T07 arma las entradas de la regla por fila: (1) organismo según `IMPUESTO.ORIGEN` (0 otros, 1 municipal, 2 provincial, 3 nacional, 4 internos); (2) existencia de convenio de cobranza por cuenta de terceros con ese organismo o entidad (M02/M06); (3) forma del importe (porcentaje sobre base imponible o valor fijo por clase, `CLASESER.VALOR1/2`). Destino según el resultado: tributo propio o de terceros → `taxes` de M06 con su organismo; concepto de terceros → concepto de terceros de M02 colgado del convenio (CTR-CAT-17). Una fila sin resultado (organismo desconocido, convenio no informado) es rechazo bloqueante con acción "clasificar" en la cola de saneamiento; nunca se asume una clase por defecto. Los valores de `IMPUESTO.ORIGEN` que usa cada cooperativa no se fijan en este anexo: el perfilado de F1 lista los `ORIGEN` presentes por tenant con la cantidad de filas, y las que no resuelven la regla van a la cola de clasificación (resolución final de HUECO-TAS-03; antes [VERIFICAR]). | `IMPUESTO.ORIGEN` (RN-03), `CLASESER` (tasa hospital), `CON_TASAS` (de Compras, confirmado en el relevamiento) | Adoptar. | — | — (antes: "[VERIFICAR] los `ORIGEN` cargados en la cooperativa y si `CON_TASAS` es de compras (§19.2)") |
| RN-MIG-052 | **Contrato de cada vivienda** (HUECO-VIV-03). Cada fila de `VIVIENDAS` (clave `ID_SERSOC`) corresponde a **un único** contrato de M02 del servicio de plan de vivienda: se usa el contrato migrado desde ese `SERSOC` y, si no existe, se rechaza la fila (no se crea un contrato sin servicio de origen). El estado canónico del contrato (M02 §8.1) se deriva así: con `FECINSC` y sin baja → `active` con `effectiveStart = FECINSC` (el plan factura aportes desde la inscripción); la adjudicación (`FECADJU`/`ADJUDICA`) y la entrega (`ENTREGAP`, `ENTREGA`) **no cambian** el estado canónico, solo el estado de `housingUnits` (`enrolled` → `allocated` → `underConstruction` si hay `INICONST` → `partiallyDelivered` → `delivered`); `SERSOC` con `FEC_BAJA`, rescisión o `CONDICION = 5` (no vigente) → `terminated`; servicio original de una transferencia (condición posterior configurada en `CONDICION_TRANSFERENCIA`, M02 `transfer.conditionAfter`) → `superseded`. Resuelto con el relevamiento del código (antes [VERIFICAR] el valor de condición de la cooperativa): `CONDICION_TRANSFERENCIA` (de `SERVICIO_EXTRAS` del servicio) toma valores de la condición del servicio (0 ninguna, 1 pendiente de conexión, 2 conectado, 3 pendiente de desconexión, 4 baja, 5 no vigente) y al transferir ProCoop la graba en `SERSOC.CONDICION` del servicio de origen (con 4 además fecha de baja). Por eso el cargador no necesita el valor de la cooperativa: un `SERSOC` de vivienda origen de una transferencia (`TRANSFER`) con `CONDICION` 3, 4 o 5 → `superseded`; con 1 o 2 se carga según su condición y se informa advertencia "transferencia sin baja del origen". `CONDICION = 5` es "no vigente" (RN-01). Una vivienda entregada con 100 % facturado y pagado conserva el contrato `active` salvo PRM-MIG-063. Sin `FECINSC` → rechazo bloqueante. | `VIVIENDAS`, `SERSOC.CONDICION`, RN-06 §3.3 (`TIP_REG = 11`) | Adoptar. | PRM-MIG-063 | — |
| RN-MIG-053 | **Plan de cuotas de obra** (HUECO-OBR-05). Las columnas `SERSOC_EXTRAS.CNT_*` (`CNT_CUOTAS`, `CNT_CUOTAS_PAGAS`, `CNT_UNIDADES`, `CNT_UNIDADES_FACTURADAS`, `CNT_UNIDADES_TOTALES`, `CNT_UNIDADES_ORIGINAL`) se cargan en `worksInstallmentPlans` de M04 (RN-TAR-071): cuotas totales → `installments`, cuotas facturadas → `billedInstallments`, unidades por cuota y totales en el plan; el contrato y la obra se resuelven por `legacyIdMap`. Solo se crea plan si alguna `CNT_*` es distinta de cero. En `serviceContracts.extras` quedan únicamente los atributos no tarifarios. | RN-01 §7 (`SERSOC_EXTRAS.CNT_*`), RN-TAR-071 | Adoptar. | — | — |
| RN-MIG-054 | **Adherentes y beneficiarios con destino único** (HUECO-TRV-01, HUECO-SEP-02). `ADHSOC` → `serviceDependents` y `BENSOC` → `serviceBeneficiaries`, ambos de M18; ningún registro de estas tablas va a M01, a `contractMembers` de M02 ni a beneficios tarifarios de M04. Una fila de `BENSOC` cuyo servicio no admita beneficiarios según la ficha de M02 se rechaza con acción "revisar ficha del servicio". La tarifa social migra desde la categoría social (`CATE_SER.CAT_SOC`) y la segmentación (M02/M04), no desde `BENSOC`. Destino único ratificado por DEC-086 (arbitraje de CTR-DAT-27: no se divide `BENSOC` entre M18 y beneficios tarifarios). | CAT §1, RN-06 §10, DEC-071, DEC-086 | Adoptar. | — | — |
| RN-MIG-055 | **Conceptos de terceros "Fijos" sin servicio propio** (HUECO-TAS-01). Cada concepto de terceros que ProCoop factura como cargo fijo al inmueble o a la cuenta se migra colgado de un contrato propio del socio, con perfil de servicio "convenio de terceros" de tipo accesorio (M02); si el socio no tiene ese contrato, la migración lo crea en estado activo vinculado al inmueble y a la cuenta de origen, y lo informa en el reporte de conciliación. Ningún concepto de terceros queda facturándose por inmueble sin contrato. | DEC-083, PA-CAT-18 | Adoptar. | — | — |
| RN-MIG-056 | **Tarjetas de débito automático sin PAN** (DEC-091). `SUMSOC.NUM_TARJ` y cualquier otra columna con número de tarjeta nunca se extraen: la consulta de `mig-extractor` calcula en el propio SQL Server de origen la marca y los últimos 4 (`RIGHT(NUM_TARJ, 4)`) y no selecciona la columna, de modo que el número no viaja; la opción de backup restaurado en la plataforma solo se admite si la cooperativa entrega el backup con esa columna ya vaciada, y la validación de ingesta rechaza el snapshot si detecta un patrón de PAN válido por Luhn. Cada adhesión con tarjeta migra según el primer caso que aplique: (a) con identificador del proveedor (`SUMSOC_EXTRAS.DEBITO_360_ID` o número de adherente de la procesadora) → `cardToken` con ese identificador y estado `active`; (b) con tokenización masiva ofrecida por el proveedor y ejecutada por la cooperativa con la herramienta del proveedor → se importan token, marca y últimos 4, estado `active`; (c) en otro caso → `pendingSignature`, con pedido de re-adhesión al socio por el portal (campaña de T09). Mientras dure la convivencia, ProCoop sigue debitando las tarjetas del caso (c); al corte comercial las que no se re-adhirieron dejan de debitarse y se listan por cuenta en el reporte de conciliación. | DEC-091; M07 RN-COB-109; T08 RN-NFR-009 | Reemplazar (seguridad). | — | — |
| RN-MIG-057 | **Sucursales derivadas de `PTOVENTA.SUC_COM`** (DEC-098). Las sucursales (`branches` de T04) se derivan de los valores distintos de `PTOVENTA.SUC_COM`; `EMPRESAS` y `CAJASJP` no tienen esa columna y no son origen de sucursales (T04 RF-CFG-142, corregido por DEC-098). F1 arma la lista propuesta con, por cada valor, los puntos de venta y las cajas que lo usan y la entidad jurídica de cada punto de venta; en F3 la cooperativa la revisa y confirma (nombre, domicilio, fusión de valores que son la misma sucursal, descarte de valores sin uso) con aprobación registrada en la corrida. Hasta que la lista esté confirmada, `PTOVENTA` (`pointsOfSale`) y `CAJASJP` (`cashRegisters`) no se cargan: sus filas quedan en staging con rechazo bloqueante "sucursal sin confirmar". Un punto de venta con `SUC_COM` vacío o fuera de la lista confirmada es rechazo bloqueante con acción "asignar sucursal". | DEC-098 (aporte A6); `PTOVENTA.SUC_COM` | Adoptar. | — | — |
| RN-MIG-058 | **Personas sin ningún documento** (DEC-099). Una persona de ProCoop que no tiene ningún documento (sin tipo y número de documento, sin CDI y sin CUIT/CUIL en `PERSONAS` ni en `SOCIOS`; tampoco en los maestros de rol de RN-MIG-014 que no traen documento, como `CHOFERES` y `MEDICOS`) se carga con `identificationStatus = documentPending` de M01 (RN-PER-136, RF-PER-175), sin inventar un número: queda fuera del control de duplicados por documento y se compara por nombre normalizado y domicilio, con aviso y sin fusión automática; figura en el informe de migración (sección "personas con documento pendiente", con cantidad por lote y lista por persona); y M01 abre una tarea de regularización en M09 por persona o por lote (RF-PER-175). Mientras siga pendiente, M05 no le emite comprobantes fiscales que exijan identificar al receptor por documento (RN-FAC-162). **No es lo mismo que un documento inválido** (RF-MIG-021, PA-MIG-11): la persona que trae un CUIT/CUIL o DNI con dígito verificador incorrecto, fuera de rango o de relleno se carga con su documento marcado `invalid` y va a la cola de saneamiento; la persona sin ningún documento no tiene qué validar y va a regularización. Un documento de relleno (por ejemplo `0`) se trata como inválido, no como ausente, salvo que el perfilado de F1 demuestre que la cooperativa lo usaba para "sin documento" y la cooperativa apruebe tratarlo como ausente. Urgente para LAG (piloto). | DEC-099 (aporte A7); `PERSONAS.TIP_DNI/NUM_DNI/CDI`, `SOCIOS.CUIT` | Adoptar. | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.0 Destino físico y pipeline (impacto stack)

| Rol | Vigente (DEC-111, DEC-110) | Notas |
|---|---|---|
| **Origen** | ProCoop SQL Server + MySQL portal + archivos (sin cambio) | Solo lectura en origen (§2.3) |
| **Destino operativo** | **Azure SQL** compartida; tablas de negocio con `TenantId` | Catálogo y DDL en `07-*`; matriz §19 sin cambio funcional |
| **Staging / control mig** | Tablas esquema `mig` (`migrationProjects`, `migStagingRecords`, …) | Mismo almacén SQL; no segunda base Mongo por cooperativa |
| **Snapshots crudos** | **Azure Blob** privado, cifrado, manifiesto con hash | RF-MIG-011; JSON Lines/Parquet en blob, no en motor transaccional |
| **Colas / jobs ETL** | **Azure Queue** + workers .NET | Idempotencia y reintentos; equivalente a outbox/Azure Queue Storage en lógica |
| **Carga a dominio** | Servicio del módulo dueño + transacción SQL | DEC-003; `legacy` / `legacyIdMap` según T05 §19 y §7.13 |
| **Convivencia / portal** | Misma base multitenant; portal y staff en React | Sincronización según RF de coexistencia; MySQL portal sigue siendo **origen** hasta corte |

En §7.1 en adelante, «colección» y `uniqueidentifier` describen el **contrato lógico** del anexo; tipos físicos y FK en `07-ddl` (esquema `mig` + módulos destino).

Todas las entidades de control de migración llevan **`TenantId`**, auditoría estándar y control optimista (`version`) como en T05 §6.1.

*Redacción histórica en subsecciones:* `TenantId` uniqueidentifier, índices Mongo, staging “en Mongo” — usar la fila **Vigente** de la tabla anterior al implementar.

### 7.1 `migrationProjects`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Ej. `MIG-LAG-01`. Único por tenant. |
| `sourceSystem` | enum `procoop` | Sí | Extensible a otros orígenes. |
| `sourceVersion` | string | Sí | Ej. `10.4.6.722`. |
| `sourceSigla` | string | Sí | V2 2264 (ej. `LAG`). |
| `sources[]` | `{ kind: sqlserver\|mysql\|files\|s3\|dbf\|access\|excel, name, accessMode: readonly, credentialRef, notes }` | Sí | `credentialRef` apunta a la bóveda T06; nunca la credencial. |
| `status` | enum (§8.1) | Sí | `draft`\|`inventoried`\|`mapping`\|`rehearsing`\|`parallel`\|`bypassing`\|`cutover`\|`live`\|`closed`\|`cancelled`; inicial `draft` (§8.8). |
| `strategy` | `{ domains[]: { domain, annex, wave, coexistenceRole: procoopMaster\|parallel\|goodappsMaster\|procoopOff, cutoverId } }` | Sí | Plan por dominio. |
| `tableInventory[]` | `{ catSection, table, rowCount, strategy, destination, ownerAnnex, wave, overriddenReason }` | Sí | Precargado desde §19. |
| `responsibles[]` | `{ userId, role, domains[] }` | Sí | |
| `acceptanceActId` | uniqueidentifier | No | Acta en `documents` de T11 con tipo documental `DOC-ACTA-MIG` de T11 §18.6 (PA-MIG-20; antes `acta`; antes "Documento T11 del acta"). |

Índices: `{ tenantId, code }` único; `{ tenantId, status }`.

### 7.2 `legacySnapshots`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `projectId` | uniqueidentifier | Sí | |
| `kind` | enum `full\|delta\|final` | Sí | |
| `asOf` | date | Sí | Fecha de corte de datos. |
| `baseSnapshotId` | uniqueidentifier | No | Para deltas; → `legacySnapshots`. |
| `manifest[]` | `{ table, rows, columns[], sha256, objectKey, extractedAt, suppressedColumns[] }` | Sí | `suppressedColumns` = credenciales suprimidas (RN-MIG-013). |
| `anonymized` | boolean | Sí | |
| `anonymizationProfileId` | uniqueidentifier | No | |
| `retentionUntil` | date | Sí | Plazo de conservación (DEC-070: 10 años). |
| `secretScan` | `{ startedAt, finishedAt, scannedTables, scannedColumns, findings[]: { table, column, kind: cardNumber\|credentialLike, rowCount, classification: credential\|cardNumber\|falsePositive\|null, classifiedBy, classifiedAt, issueId }, status: clean\|blocked\|cleared }` | Sí | Escaneo previo de RN-MIG-013 (DEC-103). Nunca guarda valores, fragmentos ni filas de muestra: solo tabla, columna, tipo y cantidad. `cleared` = todos los hallazgos clasificados y la extracción repetida con la columna suprimida. |
| `status` | enum `scanning\|blocked\|extracting\|ready\|failed\|expired` | Sí | `scanning` y `blocked` agregados por DEC-103 (escaneo previo); *Reemplazado (10-11-2026): "enum `extracting\|ready\|failed\|expired`"*. |

Índices: `{ tenantId, projectId, asOf }`.

### 7.3 `migrationMappingSets`, `migrationMappingRules`, `migrationValueMaps`

`migrationMappingSets`: `code`, `semver`, `scope` (`platform`\|`tenant`), `baseSetId` (para overrides; → `migrationMappingSets`), `status` (`draft`\|`published`\|`retired`), `publishedAt`, `publishedBy`, `changelog`. Publicado = inmutable.

**`migrationMappingRules`**:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `mappingSetId` | uniqueidentifier | Sí | → `migrationMappingSets` (antes `setId`; nombre canónico de T05). |
| `ruleCode` | string | Sí | Ej. `MAP-PER-SOCIOS-001`; clave natural, no referencia (antes `ruleId`). |
| `sourceTable` | string | Sí | Tabla CAT. |
| `sourceColumns[]` | string[] | Sí | |
| `target` | `{ annex, collection, field }` | Sí | |
| `transform` | `{ kind: copy\|map\|lookup\|expression\|split\|merge\|version\|decimal\|date\|normalizeAddress\|validateTaxId\|suppress\|anonymize, params }` | Sí | Expresiones en DSL seguro (sin código arbitrario). |
| `validations[]` | `{ code, severity: error\|warning, message: dict:* }` | No | |
| `order` | int | Sí | Orden topológico. |
| `notes` | string | No | |

`migrationValueMaps`: `code` (ej. `SITIVA→taxConditions`), `entries[] { sourceValue, targetValue, approvedBy, approvedAt }`, `defaultAction` (`reject`\|`warn-and-default`).

Índices: `{ tenantId, setId, sourceTable, order }`, `{ tenantId, code }`.

### 7.4 `migrationRuns` y `migrationBatches`

`migrationRuns`:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `projectId`, `snapshotId`, `mappingSetId` | uniqueidentifier | Sí | Reproducibilidad. |
| `kind` | enum `profile\|dryRun\|load\|reprocess\|delta\|parallelImport\|final` | Sí | |
| `scope` | `{ domains[], tables[], filters }` | Sí | |
| `targetEnvironment` | enum `test\|staging\|production` | Sí | |
| `targetTenantId` | uniqueidentifier | Sí | Tenant de ensayo o productivo. |
| `status` | enum (§8.2) | Sí | `queued`\|`extracting`\|`reading`\|`transforming`\|`validating`\|`awaitingApproval`\|`loading`\|`loaded`\|`reconciling`\|`accepted`\|`rejected`\|`cancelled`\|`failed`\|`purged`; inicial `queued` (§8.8). |
| `stats` | `{ read, transformed, valid, warnings, rejected, excluded, loaded, unchanged, updated, conflicts }` por tabla | Sí | |
| `startedAt`, `finishedAt`, `executedBy` | | Sí | |
| `idempotencyKey` | string | Sí | `snapshotId + mappingSetId + scopeHash`. |

`migrationBatches`: `runId`, `table`, `seq`, `fromKey`, `toKey`, `status` (`pending`\|`running`\|`committed`\|`failed`; §8.7; antes sin valores), `attempts`, `error`. Reanudación desde el último `committed`.

### 7.5 `migStagingRecords`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `runId` | uniqueidentifier | Sí | |
| `sourceTable`, `sourceKey` | string | Sí | Clave serializada (`COD_SUM=1234`; compuestas `COD_TAL=..;ID_REC=..`). |
| `sourceHash` | string | Sí | SHA-256 del registro normalizado. |
| `raw` | object | Sí | Registro origen (sin columnas suprimidas). |
| `transformed` | object | No | Documento destino propuesto. |
| `status` | enum `extracted\|transformed\|valid\|warning\|rejected\|excluded\|loaded\|conflict` | Sí | |
| `issues[]` | uniqueidentifier → `migrationIssues` | No | |
| `targetRef` | `{ collection, _id }` | No | |
| `expiresAt` | date | Sí | TTL (PRM-MIG-050). |

Índices: `{ tenantId, runId, sourceTable, sourceKey }` único; `{ tenantId, runId, status }`; TTL sobre `expiresAt`.

### 7.6 `legacyIdMap` y `legacyKeyAliases`

`legacyIdMap`:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `sourceSystem` | `procoop` | Sí | |
| `sourceTable`, `sourceKey` | string | Sí | |
| `targetAnnex`, `targetCollection` | string | Sí | |
| `targetId` | uniqueidentifier | Sí | |
| `firstRunId`, `lastRunId` | uniqueidentifier | Sí | |
| `lastSourceHash` | string | Sí | Idempotencia (RF-MIG-043). |
| `targetVersionAtLoad` | int | Sí | Para detectar cambios operativos posteriores (RN-MIG-042). |
| `status` | enum `active\|superseded\|merged\|deleted-in-source` | Sí | `merged` = persona fusionada. |
| `mergedIntoId` | uniqueidentifier | No | |

Índices: `{ tenantId, sourceTable, sourceKey }` único; `{ tenantId, targetCollection, targetId }`.

En cada documento destino: `legacy: { system: 'procoop', table, key, displayKey, runId, hash, readOnly, priorMigration }`. Índice `{ tenantId, 'legacy.table', 'legacy.key' }` sparse en las colecciones que reciben datos migrados.

`legacyKeyAliases`: `kind` (`barcode`\|`redLinkId`\|`siroId`\|`priorSystemUser`\|`accountServiceComposite`\|`noticeNumber`\|`stubNumber`\|`pagos360Id`), `value` (string, sin desborde), `target { accountId, contractId, documentId, stubId }`, `validFrom`, `validTo`, `active`. Índice `{ tenantId, kind, value }` único.

### 7.7 `migrationIssues`

`runId`, `snapshotId` (hallazgos del escaneo previo, anteriores a la corrida; DEC-103), `stagingRecordId`, `sourceTable`, `sourceKey`, `ruleId`, `code` (ej. `PER-TAXID-DV`, `SUM-NO-HOLDER`, `FAC-GROUP-FISCAL`, `PER-DOC-PENDING` de RN-MIG-058, `ORG-BRANCH-UNCONFIRMED` de RN-MIG-057, `PER-USAGE-CLASS-UNCONFIRMED` (uso de inmueble sin clase confirmada, matriz §19 `USOINM`, DEC-102), `SEC-CARD-PAN` y `SEC-CREDENTIAL-LIKE` de RN-MIG-013), `severity` (`error`\|`warning`\|`info`), `field`, `value` (enmascarado si es dato personal; siempre vacío en los `SEC-*`, DEC-103), `message` (`dict:`), `suggestedAction`, `fixLocation` (`source`\|`staging`\|`valueMap`\|`rule`), `assignedTo`, `status` (`open`\|`fixed`\|`excluded`\|`accepted`), `resolution`, `resolvedBy`, `resolvedAt`. Índices: `{ tenantId, runId, severity, status }`, `{ tenantId, code }`.

### 7.8 `migrationReconciliations`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `projectId`, `runId` | uniqueidentifier | Sí | |
| `domain` | enum (PER, SUM, MED, TAR, DEU, FAC, COB, FIN, STK, CON, CMP, SUE, INS, …) | Sí | |
| `checks[]` | `{ code, description, sourceValue (DECIMAL(18,4)\|int), targetValue, difference, tolerance, status: ok\|explained\|failed, explanation }` | Sí | |
| `breakdown[]` | `{ key (titular/servicio/depósito/cuenta contable), source, target, diff }` | No | Detalle descargable. |
| `status` | enum `draft\|submitted\|approved\|rejected` | Sí | |
| `approvedBy`, `approvedAt`, `evidenceDocId` | | No | Segregación RN-MIG-041. |

### 7.9 `parallelRuns` y `parallelComparisons`

`parallelRuns`: `projectId`, `service`, `billingPeriod`, `procoopRunRef` (`FACTMES.ID_REC`), `goodappsBatchId` (lote simulado; → `billingRuns` de M05), `status` (`planned`\|`simulated`\|`imported`\|`compared`\|`approved`\|`rejected`), `summary { compared, equal, withinTolerance, explained, unexplained, unmatchedProcoop, unmatchedGoodapps }`.

**`parallelComparisons`**:

| Campo | Tipo | Descripción |
|---|---|---|
| `parallelRunId` | uniqueidentifier | → `parallelRuns`. |
| `accountId`, `contractId`, `billingGroupId` | uniqueidentifier | → `accounts` (M01), `serviceContracts` (M02), `billingGroups` (M05). |
| `procoopInvoiceKey` | string | `COD_COM-SUC_COM-NUM_COM` / `ID_FAC`. |
| `goodappsSimDocId` | uniqueidentifier | → `documents` (T11). |
| `diffs[]` | `{ dimension: quantity\|concept\|tax\|total\|dueDate\|dueAmount\|group\|category\|tariffVersion, key, procoop, goodapps, delta }` | |
| `classification` | enum `equal\|rounding\|configuration\|migratedData\|intendedFix\|goodappsDefect\|procoopKnownDefect\|pending` | |
| `explanation`, `responsibleId`, `ticketRef` | | `responsibleId` → `memberships` (T02). |
| `itemKey` | string | Clave del ítem comparado, única por corrida paralela (campo citado por T05; agregado en el cierre de residuales). |

Índices: `{ tenantId, parallelRunId, classification }`.

### 7.10 `bypassPlans`, `coexistenceSyncs`, `cutoverPlans`, `rollbackJournal`

- `bypassPlans`: `projectId`, `domains[] { domain, systemOfRecord: procoop\|goodapps, since, syncs[] (ids), exitCriteria[] }`, `status` (`draft`\|`approved`\|`active`\|`closed`\|`cancelled`; §8.7; antes sin valores).
- `coexistenceSyncs`: `direction` (`procoopToGoodapps`\|`goodappsToProcoop`), `domain`, `mechanism` (`deltaExtract`\|`fileExport`\|`asientosImport`\|`manual`), `schedule` (cron en zona del tenant), `lastRunAt`, `lastStatus`, `lastStats`.
- `cutoverPlans`: `projectId`, `scope` (dominios), `steps[] { seq, title, owner, prerequisites, goCriteria[], status, startedAt, finishedAt, evidenceDocId }`, `freezeAt`, `finalSnapshotId` (→ `legacySnapshots`), `goDecision { decidedBy[], decidedAt, result }`, `rollbackDeadline` (RF-MIG-089), `status` (`draft`\|`planned`\|`go`\|`executing`\|`completed`\|`rolledBack`\|`cancelled`; §8.7; antes sin valores).
- `rollbackJournal`: `cutoverId`, `eventType`, `entityRef`, `occurredAt`, `payloadForProcoop` (formato exportable), `exportedAt`. Se alimenta del outbox desde el corte hasta `rollbackDeadline`.

### 7.11 `legacyRecords` (archivo histórico genérico de solo lectura)

| Campo | Tipo | Descripción |
|---|---|---|
| `sourceTable`, `sourceKey` | string | |
| `catSection` | int | 1–31. |
| `links` | `{ personId?, accountId?, contractId?, supplierId?, employeeId?, documentId? }` | Para mostrarlo en fichas. |
| `recordDate` | date | Fecha principal del registro (para filtros). |
| `payload` | object | Registro origen sin columnas suprimidas, con nombres originales. |
| `schemaRef` | string | Versión de esquema ProCoop. |
| `runId` | uniqueidentifier | |

Índices: `{ tenantId, 'links.accountId', recordDate }`, `{ tenantId, sourceTable, sourceKey }` único. Sin endpoints de escritura.

### 7.12 `anonymizationProfiles`

`code`, `rules[] { table, column, method: pseudonymize\|generalize\|suppress\|fakeTaxId\|fakeName\|fakeAddress\|fakePhone\|fakeEmail\|shiftDate\|keep, params }`, `seedRef` (secreto en bóveda; determinismo por proyecto), `status` (`draft`\|`active`\|`retired`; §8.7; antes sin valores). Perfil base de plataforma precargado con todas las columnas personales de CAT (PERSONAS, SOCIOS, SUMSOC, PROPIEDA, SU_EMPLEADOS, SU_EMP_FAMILIARES, PROVEED, AMBULANC, MEDICOS, WS_USERS, TICKETS_CONTACTOS, TELEFON, MENSAJES, AUDIT_MAIL, CONSEJO, VENDEDOR, PROFESIO, RESPONSA, entre las que tienen documento, nombre, domicilio, teléfono, correo, CBU o datos de salud; la lista exhaustiva se genera del catálogo de columnas `CapaDatos-tablas.md` marcando columnas `NUM_DNI`, `CUIT`, `CUIL`, `APELLIDOS`, `NOMBRES`, `NOM_*`, `DOM_*`, `TEL*`, `CELULAR`, `MAIL*`, `CORREO*`, `CBU`, `DNI`, `DOC_*`).

### 7.13 Campos `legacy` exigidos en colecciones destino

Toda colección listada como destino en la matriz §19 debe aceptar el subdocumento `legacy` (T05 DAT). Las colecciones con históricos tipados aceptan además `legacy.readOnly = true`, que el plugin de dominio usa para rechazar cualquier modificación (`409 Conflict`, `type: /problems/legacy-read-only`).

### 7.14 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto (`migrationMappingRules` y `parallelComparisons` ya tenían tabla en §7.3 y §7.9). Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-MIG-21 (Asumida, DEC-072).

**`migrationValueMaps`** — Mapas de valores (enums, códigos) (COL-MIG-05; definición en texto en §7.3)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | ej. `SITIVA→taxConditions` |
| `defaultAction` | enum | No | — | `reject`\/`warn-and-default` |
| `mappingSetId` | uniqueidentifier | Sí | `migrationMappingSets` (T07) | destino → `migrationMappingSets` |
| `domain` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `sourceValue` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`migrationBatches`** — Lotes por tabla y corrida (COL-MIG-07; definición en texto en §7.4)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `runId` | uniqueidentifier | Sí | `migrationRuns` (T07) | destino → `migrationRuns` |
| `table` | string | No | — | Según la definición en texto del §7 |
| `seq` | string | No | — | Según la definición en texto del §7 |
| `fromKey` | string | No | — | Según la definición en texto del §7 |
| `toKey` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `pending`\/`running`\/`committed`\/`failed`; §8.7; antes sin valores |
| `attempts` | int | No | — | Según la definición en texto del §7 |
| `error` | string | No | — | Según la definición en texto del §7 |
| `committed` | string | No | — | Según la definición en texto del §7 |
| `sourceTable` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `batchNo` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`legacyKeyAliases`** — Alias de claves ProCoop vigentes (usuario, ID_FAC; DEC-050) (COL-MIG-10; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `kind` | enum | Sí | — | `barcode`\/`redLinkId`\/`siroId`\/`priorSystemUser`\/`accountServiceComposite`\/`noticeNumber`\/`stubNumber`\/`pagos360Id` |
| `value` | string | No | — | string, sin desborde |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `active` | bool | No | — | Según la definición en texto del §7 |
| `targetRef` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `alias` | array | Sí | — | Campo citado por T05 (referencias o clave única) |

**`migrationIssues`** — Rechazos y advertencias (COL-MIG-11; definición en texto en §7.7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `runId` | uniqueidentifier | No | `migrationRuns` (T07) | destino → `migrationRuns` |
| `snapshotId` | uniqueidentifier | No | `legacySnapshots` (T07) | Hallazgo del escaneo previo, que ocurre antes de que exista una corrida (DEC-103) |
| `stagingRecordId` | uniqueidentifier | No | `migStagingRecords` (T07) | destino → `migStagingRecords` |
| `sourceTable` | string | No | — | Según la definición en texto del §7 |
| `sourceKey` | string | No | — | Según la definición en texto del §7 |
| `ruleId` | uniqueidentifier | No | `migrationMappingRules` (T07) | destino → `migrationMappingRules` |
| `code` | string | Sí | — | ej. `PER-TAXID-DV`, `SUM-NO-HOLDER`, `FAC-GROUP-FISCAL`, `PER-DOC-PENDING` (persona sin documento, aviso; RN-MIG-058, DEC-099), `ORG-BRANCH-UNCONFIRMED` (RN-MIG-057, DEC-098), `PER-USAGE-CLASS-UNCONFIRMED` (aviso; matriz §19 `USOINM`, DEC-102), `SEC-CARD-PAN` y `SEC-CREDENTIAL-LIKE` (escaneo previo, bloqueantes; RN-MIG-013, DEC-103) || `severity` | enum | No | — | `error`\/`warning`\/`info` |
| `field` | string | No | — | Según la definición en texto del §7 |
| `value` | string | No | — | enmascarado si es dato personal; siempre vacío en los hallazgos `SEC-*` del escaneo previo, que no guardan el valor ni enmascarado (DEC-103) |
| `message` | string | No | — | `dict:` |
| `suggestedAction` | string | No | — | Según la definición en texto del §7 |
| `fixLocation` | enum | No | — | `source`\/`staging`\/`valueMap`\/`rule` |
| `assignedTo` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `open`\/`fixed`\/`excluded`\/`accepted` |
| `resolution` | string | No | — | Según la definición en texto del §7 |
| `resolvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `batchId` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bypassPlans`** — By-pass por módulo (COL-MIG-15; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `projectId` | uniqueidentifier | Sí | `migrationProjects` (T07) | destino → `migrationProjects` |
| `status` | enum | Sí | — | `draft`\/`approved`\/`active`\/`closed`\/`cancelled`; §8.7; antes sin valores |
| `moduleCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`coexistenceSyncs`** — Sincronizaciones de convivencia (COL-MIG-16; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `direction` | enum | No | — | `procoopToGoodapps`\/`goodappsToProcoop` |
| `domain` | string | No | — | Según la definición en texto del §7 |
| `mechanism` | enum | No | — | `deltaExtract`\/`fileExport`\/`asientosImport`\/`manual` |
| `schedule` | string | No | — | cron en zona del tenant |
| `lastRunAt` | Date | No | — | Según la definición en texto del §7 |
| `lastStatus` | string | No | — | Según la definición en texto del §7 |
| `lastStats` | array | No | — | Según la definición en texto del §7 |

**`cutoverPlans`** — Plan de corte (COL-MIG-17; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `projectId` | uniqueidentifier | Sí | `migrationProjects` (T07) | destino → `migrationProjects` |
| `scope` | string | No | — | dominios |
| `freezeAt` | Date | No | — | Según la definición en texto del §7 |
| `finalSnapshotId` | uniqueidentifier | No | `legacySnapshots` (T07) | destino → `legacySnapshots` |
| `rollbackDeadline` | string | No | — | RF-MIG-089 |
| `status` | enum | Sí | — | `draft`\/`planned`\/`go`\/`executing`\/`completed`\/`rolledBack`\/`cancelled`; §8.7; antes sin valores |

**`rollbackJournal`** — Diario de reversión (COL-MIG-18; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `cutoverId` | uniqueidentifier | No | `cutoverPlans` (T07) | destino → `cutoverPlans` |
| `eventType` | string | No | — | Según la definición en texto del §7 |
| `entityRef` | string | No | — | Según la definición en texto del §7 |
| `occurredAt` | Date | No | — | Según la definición en texto del §7 |
| `payloadForProcoop` | string | No | — | formato exportable |
| `exportedAt` | Date | No | — | Según la definición en texto del §7 |
| `rollbackDeadline` | string | No | — | Según la definición en texto del §7 |
| `runId` | uniqueidentifier | Sí | `migrationRuns` (T07) | destino → `migrationRuns` |

**`anonymizationProfiles`** — Perfiles de anonimización para ensayos (COL-MIG-20; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `seedRef` | string | No | — | secreto en bóveda; determinismo por proyecto |
| `status` | enum | Sí | — | `draft`\/`active`\/`retired`; §8.7; antes sin valores |


## 8. Estados y transiciones

### 8.1 Proyecto de migración

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| `draft` → `inventoried` | Implementador | Fuentes registradas, snapshot `full` listo | Inventario de 659 tablas con conteos | Volver a `draft` |
| `inventoried` → `mapping` | Implementador | Perfilado ejecutado | Habilita edición de reglas de tenant | — |
| `mapping` → `rehearsing` | Líder | Conjunto de mapeo publicado | Permite `dryRun` | — |
| `rehearsing` → `parallel` | Responsable cooperativa | Ensayo integral con conciliaciones aprobadas de PER, SUM, MED, TAR, DEU | Habilita `parallelRuns` | Volver a `rehearsing` |
| `parallel` → `bypassing` | Responsable cooperativa | Paralelo aprobado (PA-MIG-02) para el primer dominio | Primer dominio con `systemOfRecord = goodapps` | Rollback del dominio |
| `bypassing` → `cutover` | Responsable cooperativa (doble aprobación) | Todos los dominios restantes listos o con convivencia aprobada | Congelamiento, delta final | Rollback (§9.11) |
| `cutover` → `live` | Responsable cooperativa | Acta de aceptación firmada | ProCoop solo consulta | Rollback dentro de `rollbackDeadline` |
| `live` → `closed` | Líder | ProCoop apagado, archivo verificado, alias vencidos o programados | Retención del snapshot | — |
| cualquier → `cancelled` | Líder + responsable | Motivo | Conserva evidencias | — |

### 8.2 Corrida

`queued` → `extracting`/`reading` → `transforming` → `validating` → `awaitingApproval` (si hay rechazos o exclusiones) → `loading` → `loaded` → `reconciling` → `accepted` \| `rejected`. Desde cualquier estado previo a `loaded`: `cancelled`; `failed` permite `resume` desde el último lote. Una corrida `accepted` es inmutable; una corrida `dryRun` puede pasar a `purged` (RF-MIG-046).

### 8.3 Registro de staging

`extracted` → `transformed` → (`valid` \| `warning` \| `rejected`) → `loaded` \| `excluded` \| `conflict`. `rejected` → `transformed` (tras corregir y reprocesar). `conflict` → `loaded` solo con decisión explícita ("conservar CoopApps" o "aplicar origen").

### 8.4 Conciliación

`draft` → `submitted` → `approved` \| `rejected` → (`draft` tras nueva corrida). Aprobada por alguien distinto del ejecutor.

### 8.5 Dominio en convivencia

`procoopMaster` → `parallel` → `goodappsMaster` → `procoopOff`. Retroceso `goodappsMaster` → `procoopMaster` solo por rollback aprobado.

### 8.6 Comparación paralela

`pending` → `equal` \| `rounding` \| `configuration` \| `migratedData` \| `intendedFix` \| `goodappsDefect` \| `procoopKnownDefect`. `goodappsDefect` obliga a ticket y nueva simulación; `configuration`/`migratedData` obligan a corregir y re-simular.

### 8.7 Colecciones con estado sin máquina propia

Corrección del 05-11-2026: §7 declaraba estos estados sin transiciones; en `migrationBatches`, `bypassPlans`, `cutoverPlans` y `anonymizationProfiles` tampoco tenía valores (se declaran aquí). Estado inicial: el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `legacySnapshots` | — | `scanning` | Extracción por `mig.snapshots.crear`: primero corre el escaneo previo (RN-MIG-013, DEC-103); *Reemplazado (10-11-2026): "— → `extracting`"* | — | — |
| `legacySnapshots` | `scanning` | `extracting` | Escaneo sin hallazgos (`secretScan.status = clean`) | RN-MIG-013 | — |
| `legacySnapshots` | `scanning` | `blocked` | El escaneo encuentra números de tarjeta o columnas con apariencia de credencial no listadas | RN-MIG-013 | EVT-MIG-10 `mig.snapshot.blocked` |
| `legacySnapshots` | `blocked` | `scanning` | Todos los hallazgos clasificados y la supresión ajustada; se repite el escaneo | Hallazgos con `classification` y `issueId` resueltos; falsos positivos aprobados por el responsable de seguridad del proyecto | — |
| `legacySnapshots` | `blocked` | `failed` | Cancelación de la extracción | — | — |
| `legacySnapshots` | `extracting` | `ready` | Fin de extracción con manifiesto | Checksums del manifiesto OK | EVT-MIG-01 `mig.snapshot.ready` |
| `legacySnapshots` | `extracting` | `failed` | Error de lectura o tiempo agotado | — | — |
| `legacySnapshots` | `ready` | `expired` | Vence la retención del snapshot (`live` → `closed`, §8.1) [VERIFICAR parámetro de plazo] | Sin corrida en curso que lo use | — |
| `migrationBatches` | — | `pending` | La corrida divide la tabla en lotes | — | — |
| `migrationBatches` | `pending` | `running` | Worker toma el lote | — | — |
| `migrationBatches` | `running` | `committed` | Lote escrito en la transacción | — | — |
| `migrationBatches` | `running` | `failed` | Error; suma `attempts` | — | EVT-MIG-02 `mig.run.failed` si agota intentos |
| `migrationBatches` | `failed` | `running` | `resume` de la corrida (§8.2) | Desde el último `committed` | — |
| `legacyIdMap` | — | `active` | Carga del registro destino | — | — |
| `legacyIdMap` | `active` | `superseded` | Otra corrida reemplaza el destino del mismo origen | `lastSourceHash` distinto | — |
| `legacyIdMap` | `active` | `merged` | Fusión de personas aprobada (`mergedIntoId`) | — | EVT-MIG-09 `mig.person.merged` |
| `legacyIdMap` | `active` | `deleted-in-source` | Un delta detecta que el origen ya no existe | RN-MIG-042 si el destino cambió en CoopApps | — |
| `migrationIssues` | — | `open` | Validación de la corrida | — | EVT-MIG-03 `mig.issue.assigned` al asignar |
| `migrationIssues` | `open` | `fixed` | Corrección en `fixLocation` y reproceso | — | — |
| `migrationIssues` | `open` | `excluded` | Exclusión del registro por `mig.rechazos.editar` | Motivo | — |
| `migrationIssues` | `open` | `accepted` | Se acepta la advertencia | Solo `severity` `warning` o `info` | — |
| `parallelRuns` | — | `planned` | Alta del ciclo del paralelo | Proyecto en `parallel` | — |
| `parallelRuns` | `planned` | `simulated` | M05 genera el lote simulado (`goodappsBatchId`) | — | — |
| `parallelRuns` | `simulated` | `imported` | Importación de la facturación ProCoop del período | — | — |
| `parallelRuns` | `imported` | `compared` | Comparación terminada (§8.6) | — | EVT-MIG-05 `mig.parallel.compared` |
| `parallelRuns` | `compared` | `approved` | Aprobación por `mig.paralelo.aprobar` | Sin diferencias `pending` ni `goodappsDefect` abiertas | EVT-MIG-05 `mig.parallel.approved` |
| `parallelRuns` | `compared` | `rejected` | Rechazo con motivo | — | — |
| `bypassPlans` | — | `draft` | Alta por `mig.bypass.configurar` | — | — |
| `bypassPlans` | `draft` | `approved` | Aprobación por `mig.bypass.aprobar` | Paralelo aprobado del primer dominio | — |
| `bypassPlans` | `approved` | `active` | Primer dominio con `systemOfRecord = goodapps` | — | EVT-MIG-06 `mig.domain.switched` |
| `bypassPlans` | `active` | `closed` | Todos los dominios en `procoopOff` (§8.5) | — | — |
| `bypassPlans` | `draft`, `approved`, `active` | `cancelled` | Cancelación del proyecto o rollback | Motivo | EVT-MIG-08 si hubo rollback |
| `cutoverPlans` | — | `draft` | Alta por `mig.corte.planificar` | — | — |
| `cutoverPlans` | `draft` | `planned` | Pasos y criterios completos | — | — |
| `cutoverPlans` | `planned` | `go` | Decisión de avanzar (`goDecision`) por `mig.corte.aprobar` | Doble aprobación (§8.1) | — |
| `cutoverPlans` | `go` | `executing` | Inicio de pasos por `mig.corte.ejecutar` | Congelamiento en `freezeAt` | — |
| `cutoverPlans` | `executing` | `completed` | Último paso OK y acta firmada | — | EVT-MIG-07 `mig.cutover.completed` |
| `cutoverPlans` | `executing`, `completed` | `rolledBack` | Rollback por `mig.rollback.ejecutar` | Antes de `rollbackDeadline` y con `mig.rollback.aprobar` | EVT-MIG-08 `mig.rollback.executed` |
| `cutoverPlans` | `draft`, `planned` | `cancelled` | Cancelación | Motivo | — |
| `anonymizationProfiles` | — | `draft` | Alta o copia del perfil base | — | — |
| `anonymizationProfiles` | `draft` | `active` | Aprobación para su uso | Todas las columnas personales del catálogo tienen método | — |
| `anonymizationProfiles` | `active` | `retired` | Reemplazo por otra versión | — | — |

### 8.8 Tabla normalizada de las máquinas de §8.1 a §8.4 y §8.6

Corrección del cierre de residuales (05-11-2026; PA-MIG-21): una fila por transición, con el estado de alta explícito (`—`). Prevalece el texto de cada subsección si hay diferencia. El rol de convivencia de §8.5 es un campo del plan (`strategy.domains[].coexistenceRole`) y no se repite. Se agrega `migrationMappingSets`, que tenía estados sin transiciones.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `migrationProjects.status` | — | `draft` | Alta del proyecto por `mig.proyectos.crear` | — | — |
| `migrationProjects.status` | `draft` | `inventoried` | Inventario con snapshot `full` listo | — | — |
| `migrationProjects.status` | `inventoried` | `draft` | Volver a borrador | — | — |
| `migrationProjects.status` | `inventoried` | `mapping` | Perfilado ejecutado | — | — |
| `migrationProjects.status` | `mapping` | `rehearsing` | Conjunto de mapeo publicado | — | — |
| `migrationProjects.status` | `rehearsing` | `parallel` | Ensayo integral con conciliaciones aprobadas | — | — |
| `migrationProjects.status` | `parallel` | `rehearsing` | Volver a ensayo | — | — |
| `migrationProjects.status` | `parallel` | `bypassing` | Paralelo aprobado del primer dominio | — | — |
| `migrationProjects.status` | `bypassing` | `cutover` | Doble aprobación del corte | — | — |
| `migrationProjects.status` | `cutover` | `live` | Acta de aceptación firmada | — | — |
| `migrationProjects.status` | `live` | `closed` | ProCoop apagado y archivo verificado | — | — |
| `migrationProjects.status` | `draft`, `inventoried`, `mapping`, `rehearsing`, `parallel`, `bypassing`, `cutover`, `live` | `cancelled` | Cancelación con motivo (líder + responsable) | — | — |
| `migrationRuns.status` | — | `queued` | Alta de la corrida | — | — |
| `migrationRuns.status` | `queued` | `extracting` | Inicio con extracción | — | — |
| `migrationRuns.status` | `queued` | `reading` | Inicio leyendo un snapshot existente | — | — |
| `migrationRuns.status` | `extracting` | `transforming` | Fin de extracción | — | — |
| `migrationRuns.status` | `reading` | `transforming` | Fin de lectura | — | — |
| `migrationRuns.status` | `transforming` | `validating` | Fin de transformación | — | — |
| `migrationRuns.status` | `validating` | `awaitingApproval` | Hay rechazos o exclusiones | — | — |
| `migrationRuns.status` | `validating` | `loading` | Sin rechazos | — | — |
| `migrationRuns.status` | `awaitingApproval` | `loading` | Aprobación | — | — |
| `migrationRuns.status` | `loading` | `loaded` | Todos los lotes `committed` | — | — |
| `migrationRuns.status` | `loaded` | `reconciling` | Inicio de conciliación | — | — |
| `migrationRuns.status` | `reconciling` | `accepted` | Conciliaciones aprobadas | — | — |
| `migrationRuns.status` | `reconciling` | `rejected` | Conciliación rechazada | — | — |
| `migrationRuns.status` | `failed` | `loading` | `resume` desde el último lote | — | — |
| `migrationRuns.status` | `queued`, `extracting`, `reading`, `transforming`, `validating`, `awaitingApproval`, `loading` | `cancelled` | Cancelación | — | — |
| `migrationRuns.status` | `extracting`, `reading`, `transforming`, `validating`, `loading` | `failed` | Error no recuperable | — | — |
| `migrationRuns.status` | `accepted`, `rejected`, `cancelled` | `purged` | Purga de una corrida `dryRun` (RF-MIG-046) | Solo `dryRun`; `accepted` real es inmutable | — |
| `migStagingRecords.status` | — | `extracted` | Extracción del registro | — | — |
| `migStagingRecords.status` | `extracted` | `transformed` | Transformación | — | — |
| `migStagingRecords.status` | `transformed` | `valid` | Validación sin observaciones | — | — |
| `migStagingRecords.status` | `transformed` | `warning` | Validación con advertencias | — | — |
| `migStagingRecords.status` | `transformed` | `rejected` | Validación con error | — | — |
| `migStagingRecords.status` | `rejected` | `transformed` | Corrección y reproceso | — | — |
| `migStagingRecords.status` | `valid`, `warning` | `loaded` | Carga | — | — |
| `migStagingRecords.status` | `valid`, `warning`, `rejected` | `excluded` | Exclusión | — | — |
| `migStagingRecords.status` | `valid`, `warning` | `conflict` | El destino cambió en CoopApps (RN-MIG-042) | — | — |
| `migStagingRecords.status` | `conflict` | `loaded` | Decisión explícita ("conservar CoopApps" o "aplicar origen") | — | — |
| `migrationReconciliations.status` | — | `draft` | Cálculo de la conciliación de la corrida | — | — |
| `migrationReconciliations.status` | `draft` | `submitted` | Envío a aprobación | — | — |
| `migrationReconciliations.status` | `submitted` | `approved` | Aprobación | Aprobador distinto del ejecutor (RN-MIG-041) | — |
| `migrationReconciliations.status` | `submitted` | `rejected` | Rechazo | — | — |
| `migrationReconciliations.status` | `rejected` | `draft` | Nueva corrida | — | — |
| `parallelComparisons.classification` | — | `pending` | Comparación ítem a ítem | — | — |
| `parallelComparisons.classification` | `pending` | `equal` | Clasificación del ítem | — | — |
| `parallelComparisons.classification` | `pending` | `rounding` | Clasificación del ítem | — | — |
| `parallelComparisons.classification` | `pending` | `configuration` | Clasificación del ítem | Explicación si no es `equal` ni `rounding` | — |
| `parallelComparisons.classification` | `pending` | `migratedData` | Clasificación del ítem | Explicación si no es `equal` ni `rounding` | — |
| `parallelComparisons.classification` | `pending` | `intendedFix` | Clasificación del ítem | Explicación si no es `equal` ni `rounding` | — |
| `parallelComparisons.classification` | `pending` | `goodappsDefect` | Clasificación del ítem | Explicación si no es `equal` ni `rounding` | — |
| `parallelComparisons.classification` | `pending` | `procoopKnownDefect` | Clasificación del ítem | Explicación si no es `equal` ni `rounding` | — |
| `migrationMappingSets.status` | — | `draft` | Alta o copia del conjunto | — | — |
| `migrationMappingSets.status` | `draft` | `published` | Publicación (queda inmutable) | — | — |
| `migrationMappingSets.status` | `published` | `retired` | Reemplazo por otra versión | — | — |

Referencias de §7 sin destino explícito: `migrationProjects.acceptanceActId` → `documents` (T11) con `documentTypeCode` = `acta` (PA-MIG-20, Asumida DEC-072; antes "documento del acta en T11 [VERIFICAR colección]"); `legacySnapshots.baseSnapshotId`, `cutoverPlans.finalSnapshotId` → `legacySnapshots` (T07); `migrationMappingSets.baseSetId` → `migrationMappingSets` (T07); `migrationMappingRules.ruleCode` (antes `ruleId`) → código de regla (clave natural, no referencia); `migStagingRecords.runId`, `migrationBatches.runId`, `migrationIssues.runId`, `legacyIdMap.firstRunId`, `legacyIdMap.lastRunId`, `legacyRecords.runId` → `migrationRuns` (T07); `migrationIssues.stagingRecordId` → `migStagingRecords` (T07); `parallelRuns.goodappsBatchId` → `billingRuns` (M05; lote simulado; antes "lote simulado de facturación de M05"); `rollbackJournal.cutoverId` → `cutoverPlans` (T07).

## 9. Estrategia y procesos

### 9.1 Estrategia general

**Por cooperativa.** Cada cooperativa es un proyecto independiente (un tenant). La primera es la cooperativa piloto de migración, **Laguna Larga** (sigla `LAG`, RN-11) (DEC-088, que reemplaza a DEC-081; antes "todavía no está definida"); su base relevada es además la referencia del conjunto de mapeo; como opera servicios medidos, su primera migración real ocurre después de O7; las siguientes reutilizan el conjunto de mapeo de plataforma y solo agregan overrides de tenant. El orden de cooperativas lo decide el solicitante (PA-MIG-17). Las cooperativas sin ProCoop usan la misma herramienta con otro `sourceSystem` (fuera de esta especificación).

**Por módulo (dominio).** La unidad de migración, conciliación, paralelo y by-pass es el dominio (anexo dueño). Un dominio se corta cuando su cargador, sus criterios de aceptación (§17) y los dominios de los que depende están aprobados. Dependencias mínimas:

| Dominio | Depende de |
|---|---|
| Maestros/geografía/configuración (T04), IAM (T02) | — |
| Personas, titulares, cuentas, inmuebles (M01) | T04 |
| Catálogo de servicios, categorías, productos (M02) | T04 |
| Contratos/suministros (M01 + M02) | M01, M02 |
| Fiscal (M06: situaciones, puntos de venta, numeración) | T04 |
| Tarifas (M04) | M02, M06 |
| Medición (M03) | Contratos, M04 |
| Técnica/redes/equipos (M10, M13 serializados) | Contratos, M13 depósitos |
| Facturación (M05: comprobantes abiertos e históricos) | Contratos, M04, M06 |
| Cuenta corriente y cobranza (M07) | M05 |
| Mora y financiación (M08) | M05, M07 |
| Contabilidad (M15) | Plan de cuentas; saldos dependen de M05/M07/M12/M14 |
| Compras, stock, tesorería (M12, M13, M14) | M06, M15 |
| Sueldos (M16) | M01, M15 |
| Institucional y social (M17, M18) | M01, M02 |
| Portal (M19), comunidad (T09) | M01, T02 |

**Por ola.** La herramienta se construye en O0/O1; cada cargador se construye y prueba en la ola de su módulo (con datos anonimizados de la DEMO); la corrida paralela, el by-pass y el corte comercial de los servicios medidos de la piloto se ejecutan al cerrar O7, y cada servicio restante al cerrar la ola de su vertical; el ensayo integral, los históricos, el corte administrativo y el apagado de ProCoop se ejecutan en O11 (DEC-089; antes: "el ensayo integral, el paralelo, el by-pass y el corte se ejecutan en O11, cuando todos los módulos que la cooperativa usa están disponibles (Guía §7)").

| Ola | Entregable de migración |
|---|---|
| O0 | Convención `legacy`, `legacySnapshots`, `legacyIdMap`, extractor SQL Server de solo lectura, almacenamiento cifrado, librerías money/fechas usadas por los transformadores. |
| O1 | Herramienta completa (§9.3), anonimización, perfilado, cola de saneamiento; cargadores de T01 (empresas), T02 (usuarios y perfiles propuestos), T04 (geografía, calles, feriados, documentos, monedas, parámetros V2 → PRM), T11 (adjuntos). |
| O2 | Cargadores M01 (personas, titulares, cuentas, inmuebles, notas, transferencias; los adherentes y beneficiarios pasan a M18 en O4, HUECO-TRV-01), M02 (servicios, categorías, productos, rubros, contratos `SERSOC`, HUECO-TRV-06), M09 (trámites, reclamos, tickets), M19/T02 (usuarios del portal), T09 (plantillas, novedades, encuestas). |
| O3 | Cargadores M10 (factibilidades, OT, transacciones, cuadrillas, redes GIS, internet/MikroTik), M13 serializados y comodatos. |
| O4 | Cargadores M18 (adherentes `ADHSOC` y beneficiarios `BENSOC`, DEC-071, PA-SOC-14), M04 (cuadros, impuestos de cuadro), M05 (comprobantes abiertos e históricos, grupos de facturación FAC-012, talones), M06 (situaciones fiscales, puntos de venta, numeración, CAEA, CVP, libro IVA ventas histórico). |
| O5 | Cargadores M07 (saldos/documentos abiertos, recibos históricos, cajas, medios de pago, entes, alias de claves, resolutor), M15 núcleo (plan, ejercicios, centros de costo, reglas de asientos, saldos de apertura). |
| O6 | Cargadores M08 (tablas de mora, índices, instancias, excepciones, notificaciones abiertas, convenios y planes, intereses diferidos). |
| O7 | Cargadores M03 (medidores, rutas, lecturas, consumos, telemedición, prepago, testigos), M04 medidos (escalones, cargos adicionales, factores de gas, planes de cuotas de obra `worksInstallmentPlans`, HUECO-OBR-05), M10 obras (`OBRAS`, `GRPOBRA`, HUECO-OBR-04), M06 reguladores (ENARGAS, OCEBA/ERSeP), compra de energía EPEC. |
| O8 | Cargadores M12, M13 completo (stock, bienes de uso, RMA), M14, M15 completo (asientos históricos, inflación), M11, retenciones a proveedores. |
| O9 | Cargadores M16. |
| O10 | Cargadores M17, M18 (vivienda, ambulancias, flota, cementerio y otros servicios por plantilla de §19.33), telefonía (M10), turnero y actividades (M09), fabricación (M13). |
| O7 | Migración de datos vigentes comerciales (configuración, entidades, cuadros tarifarios, talones y notificaciones vigentes), corrida paralela con facturación comparada, congelamiento, by-pass por módulo, corte comercial por servicio y rollback (DEC-089). |
| O11 | Ensayo integral repetible, archivo `legacyRecords`, histórico en portal, corte administrativo y apagado de ProCoop (DEC-089; antes también corrida paralela, by-pass, corte definitivo y rollback, que pasan a O7). |

### 9.2 Fases (aplican a cada cooperativa y a cada dominio)

| # | Fase | Entradas | Actividades | Salida verificable | Responsable |
|---|---|---|---|---|---|
| F1 | Inventario | Accesos de solo lectura, matriz §19 | Registrar fuentes; escaneo previo de secretos y números de tarjeta (RN-MIG-013, DEC-103); extraer snapshot `full`; conteo de filas por tabla; lista propuesta de sucursales desde `PTOVENTA.SUC_COM` (RN-MIG-057, DEC-098); detectar módulos sin uso (DFA §34 punto 4); listar adjuntos; leer V2 clave (2264, 518, 519, RN-11 §5) | Inventario de 659 tablas con conteos y estrategia ajustada | Implementador + analista |
| F2 | Perfilado de calidad | Snapshot | Perfilado por columna; huérfanos; duplicados; CUIT/DNI; domicilios; importes y fechas anómalas; facturas ≥ ARS 100.000 para códigos SIRO (RN-11 §5.8); `FACTURAS.USUARIO` (RN-11 §5.5); rango de `COD_SUM` (RN-11 §5.4) | Informe de perfilado y lista de problemas por dominio | Analista |
| F3 | Mapeo | Perfilado, anexos dueños | Confirmación de sucursales por la cooperativa antes de mapear puntos de venta y cajas (RN-MIG-057, DEC-098); ajustar overrides de tenant; mapas de valores (situaciones IVA, estados, transacciones, comprobantes, medios de pago, causas); grupos de facturación (FAC-012); V2 → PRM | Conjunto de mapeo publicado | Implementador + responsables funcionales |
| F4 | Limpieza | Problemas del F2 | Corrección en origen (la cooperativa en ProCoop) o en staging; fusiones aprobadas de personas; normalización de calles | Cola de saneamiento con % resuelto por tipo | Analista + cooperativa |
| F5 | Extracción | Escaneo previo sin hallazgos abiertos (RN-MIG-013, DEC-103) | Escaneo previo de secretos y números de tarjeta; snapshot `full` (ensayos) o `delta` (paralelo/convivencia) o `final` (corte) | Manifiesto con hash y resultado del escaneo | Sistema |
| F6 | Transformación | Snapshot + conjunto de mapeo | Aplicar reglas; anulaciones → estado; `HIS_*` → versiones; `*_EXTRAS` → campos; importes Decimal128; fechas UTC; supresión de credenciales | Staging `transformed` | Sistema |
| F7 | Carga | Staging válido | Orden topológico; servicio del módulo dueño en modo `migration`; `legacyIdMap`; lotes reanudables | Corrida `loaded` | Sistema |
| F8 | Validación | Destino | Reglas de dominio post-carga (integridad referencial, invariantes: saldo por servicio = suma de obligaciones; equipo en un solo lugar; asiento balanceado) | 0 errores bloqueantes | Sistema + analista |
| F9 | Conciliación | Destino + origen | Conteos y sumas de control por dominio (§17); deuda por titular y servicio; stock; contabilidad; fondos | Conciliaciones aprobadas | Responsables funcionales, contador |
| F10 | Corrida paralela | Deltas periódicos | Simular ciclos; importar emitidos ProCoop; comparar factura por factura; clasificar y explicar | Paralelo aprobado | Facturación + implementador |
| F11 | By-pass | Paralelo aprobado | Cambiar sistema de registro por dominio; activar sincronizaciones de convivencia; resolutor de claves | Dominios en `goodappsMaster` | Líder + cooperativa |
| F12 | Corte definitivo | Todos los dominios listos | Congelamiento; delta final; conciliación final; go/no-go; activación de emisión fiscal y publicación a entes | Acta de aceptación | Líder + responsable cooperativa |
| F13 | Rollback | Incidente bloqueante | Ejecutar plan de retorno (§9.11) | ProCoop operativo con hechos posteriores al corte reinyectados | Líder + cooperativa |

### 9.3 Herramienta de migración (pipeline ETL)

1. **Conectores de extracción** (worker `mig-extractor`): SQL Server (TDS, usuario de solo lectura, `READ COMMITTED SNAPSHOT` o backup restaurado en un SQL Server de la plataforma), MySQL (portal/PMovil), sistema de archivos/S3 (adjuntos), DBF/Access/Excel. Paginación por clave primaria; columnas suprimidas por regla en el propio extractor (las credenciales nunca salen del origen; los números de tarjeta tampoco: se reducen a marca y últimos 4 en la consulta de origen y un backup restaurado debe llegar con esa columna vaciada, RN-MIG-056).
2. **Snapshot** (JSON Lines comprimido por tabla) en almacenamiento privado cifrado (KMS por tenant), con manifiesto y hash.
3. **Staging** (`migStagingRecords`): registro crudo + transformado + estado + issues.
4. **Motor de reglas** declarativo (DSL seguro con funciones de la librería `packages/shared`: `decimal`, `date`, `taxId`, `address`, `lookup`, `valueMap`, `version`, `split`, `merge`), versionado por conjunto.
5. **Validadores**: esquema Zod del documento destino (compartido con la API del módulo) + validaciones de migración.
6. **Cargadores por dominio**: cada módulo expone `importFromMigration(batch, { runId, mode })` en su servicio (contrato T05), transaccional por lote, que devuelve `_id` creados/actualizados/sin cambio/conflictos.
7. **Mapa de IDs** y **alias** (§7.6) actualizados en la misma transacción del lote.
8. **Informes**: perfilado, rechazos, advertencias, conciliación, paralelo, delta (exportables XLSX/CSV/PDF desde DataTable).
9. **Reprocesos idempotentes**: `idempotencyKey` por corrida, `sourceHash` por registro, conflicto si el documento fue modificado operativamente (`version` > `targetVersionAtLoad`).
10. **Orquestación**: jobs BullMQ (`mig:*`, §12), un job padre por corrida y jobs hijos por tabla/lote, con progreso, cancelación y reanudación.
11. **Observabilidad**: métricas por tenant y corrida (filas/s, errores, duración), alertas (T08).

### 9.4 Tratamiento de datos históricos

| Categoría | Qué incluye | Tratamiento | Dónde queda |
|---|---|---|---|
| **Vivo** | Maestros y catálogos en uso; personas, titulares, cuentas, inmuebles; contratos activos y dados de baja con deuda o con equipos; medidores instalados y última lectura; lecturas del período abierto y consumos para promedios (13 períodos por defecto); cuadros tarifarios vigentes y los necesarios para períodos abiertos (24 meses por defecto); comprobantes con saldo; talones, convenios, planes y cuotas pendientes; intereses diferidos; notificaciones de mora abiertas; excepciones vigentes; cajas y valores en cartera; anticipos y saldos a favor; stock por depósito y unidades serializadas; equipos en comodato; bienes de uso con amortización acumulada; proveedores y sus comprobantes impagos; OC/pedidos abiertos; cheques propios no debitados; cuentas bancarias con saldo y movimientos no conciliados; plan de cuentas, ejercicios, centros de costo, saldos de apertura y asientos del ejercicio en curso; legajos activos y acumulados del año; usuarios y perfiles; plantillas; adjuntos vinculados a lo vivo. | Documento operativo con `legacy` | Colección del módulo dueño |
| **Histórico tipado** (solo lectura) | Comprobantes cancelados y anulados, recibos, lecturas/consumos, asientos, recibos de sueldo, OT cerradas, reclamos cerrados, movimientos de stock y bancarios, dentro de la profundidad definida (DEC-070: ejercicio en curso + 24 meses). | `legacy.readOnly = true`; visible en fichas, informes y portal | Colección del módulo dueño |
| **Histórico genérico** | Resto de tablas con estrategia "Histórico" (logs útiles, historiales `*_HST`, notas de seguimiento, CDR, notificaciones cerradas) y lo tipado anterior a la profundidad. | Payload JSON, búsqueda por vínculo | `legacyRecords` |
| **Archivo** | Las 659 tablas completas del snapshot final + adjuntos. | Cifrado, acceso auditado, sin carga | Almacenamiento de objetos, hasta `retentionUntil` (DEC-070) |
| **Detalle accesorio de cobranzas** | Rendiciones de entes por renglón, archivos de novedades, intenciones de pago, transacciones de pasarela cerradas y bitácoras de entes (`agencySettlementLines`, `agencyNoveltyFiles`, `paymentIntents`, `gatewayTransactions` de M07). | Se carga tipado solo lo de los últimos 36 meses; lo anterior va directo al archivo en frío por período (DEC-087, RF-COB-191), con resumen y referencia en el documento operativo. Recibos, obligaciones, imputaciones y saldos nunca se archivan. | Colección de M07 (36 meses) y archivo en frío de `retentionRuns` (T08) |
| **No migrar** | Temporales, motor de pantallas/menús, credenciales (incluidas las columnas que detecte el escaneo previo; se suprimen en la extracción, así que tampoco llegan al archivo; RN-MIG-013, DEC-103), logs técnicos sin valor, padrones externos, catálogos normativos nacionales. | Se registra motivo (`Descartar` o `Reemplazado por`) | Solo archivo |

### 9.5 Calidad de datos

| Problema | Detección | Tratamiento | Bloquea |
|---|---|---|---|
| CUIT/CUIL con DV inválido | Módulo 11 | Persona cargada con `taxIdStatus = invalid`; cola de saneamiento; no puede recibir factura A ni ser agente de retención hasta corregir (PA-MIG-11) | Emisión clase A |
| CUIT de formato corregible (guiones, espacios) | Regex | Normalizar a 11 dígitos | No |
| DNI fuera de rango, ceros, repetidos de relleno (ej. `0`, `11111111`) | Reglas | `documentStatus = invalid`, advertencia | No |
| Persona sin ningún documento (sin tipo y número, CDI ni CUIT/CUIL) (DEC-099) | Ausencia de todos los identificadores en `PERSONAS` y `SOCIOS` (o fila de un maestro de rol sin documento) | `identificationStatus = documentPending` (M01 RN-PER-136); sin control de duplicados por documento, comparación por nombre y domicilio con aviso; issue `PER-DOC-PENDING`; sección propia en el informe de migración; tarea de regularización (RN-MIG-058). No confundir con la fila anterior: un documento presente pero inválido se marca `invalid` y va a saneamiento (PA-MIG-11) | No bloquea la carga; bloquea los comprobantes que exigen documento del receptor (M05 RN-FAC-162) |
| Tipo de documento inconsistente con número | `DOCUMENT.COD_AFIP` vs largo | Advertencia y propuesta | No |
| Persona duplicada | Documento normalizado; nombre normalizado + fecha de nacimiento; CUIT | Propuesta de fusión con puntaje; aprobación humana; `legacyIdMap.status = merged` | No |
| Titular duplicado (dos `SOCIOS` misma persona) | `COD_PER` repetido | Se mantienen dos titulares si tienen número de socio distinto y deuda/capital propios; propuesta de unificación como asociado único (M17) | No |
| Cuenta sin titular | FK `SUMSOC.COD_SOC` huérfana | Rechazo (ejemplo BASE CU-31) | Sí |
| Servicio sin cuenta o sin categoría | FK huérfanas | Rechazo | Sí |
| Domicilio con calle inexistente | `COD_CAL` huérfano o texto libre | Normalizar contra `streets`; si no, texto original con `addressStatus = unnormalized` | No |
| Calles duplicadas (`CALLES` vs `RNQCALL`, mismas calles con grafías distintas) | Similitud de nombre por localidad | Consolidar con mapa aprobado | No |
| Numeración de puerta faltante o "S/N" | Regex | `streetNumber = null`, `withoutNumber = true` | No |
| Coordenadas GPS fuera del área del tenant | Bounding box | Descartar coordenada, advertencia | No |
| Correos/celulares inválidos | Formato | `unverified` | No |
| Importes con más decimales que la escala | Escala | Conservar exacto en Decimal128; informar | No |
| Fechas nulas/`1900-01-01`/futuras imposibles | Reglas | Ausente o advertencia | Depende del campo |
| Comprobante con saldo negativo o mayor al total | Reglas | Advertencia y conciliación manual | En DEU |
| Factura agrupada con servicios de distintos titulares | `GRUPOS_FACTURA` + `SERSOC` | Rechazo fiscal (BASE §103.3) | Sí |
| Cuenta ≥ 10 dígitos (desborde Int32 en ProCoop) | Rango | Identificadores como string | No |

### 9.6 Corrida paralela y facturación comparada (BASE FAC-012, DFA §33)

1. **Preparación**: dominio PER, SUM, MED, TAR, FIS, FAC (configuración) conciliados; grupos de facturación migrados (FAC-012); cuadros vigentes del período.
2. **Delta de entrada** del período: novedades de padrón, lecturas cargadas en ProCoop (`CONS_SER`, `IMP_WORK` si la lectura se hace en ProCoop) o lecturas tomadas con la app CoopApps e importadas a ProCoop (según PA-MIG-03).
3. **Simulación** en CoopApps del ciclo (`fac:emitir-lote` en modo `simulation`): sin CAE, sin numeración fiscal, sin publicación.
4. **Importación** de lo que ProCoop emitió (`FACTURAS`, `ITEMSFAC`, `ITEMSFAC_EXTRAS`, `FAC_EXTRAS`, `TALONFAC`, `FACTMES*`, `SFACTME`).
5. **Emparejamiento** por cuenta + servicio + período (+ grupo); los comprobantes de ProCoop fuera de lote (manuales) se comparan solo si tienen equivalente.
6. **Comparación factura por factura** en las dimensiones de RF-MIG-072. Para comprobantes agrupados, se compara además el subtotal por servicio (FAC-007) y la reconstrucción "como si se hubiera emitido solo".
7. **Clasificación** de cada diferencia (§8.6) con responsable. Diferencias "intencionales" (errores de ProCoop que CoopApps corrige a propósito, ej. RN-11 Implicancias 8) se documentan una vez como regla y se aplican automáticamente.
8. **Comparación complementaria**: intereses de mora en cobros del período, imputación de cobranzas, asientos (simulados) vs asientos ProCoop.
9. **Aprobación** por servicio y ciclo con los criterios del §17.4 (antes citaba §17.6, que no contiene esos criterios).
10. Repetir por los ciclos definidos (PA-MIG-02). El paralelo puede abarcar varios servicios con calendarios distintos; el by-pass de facturación es por servicio.

### 9.7 By-pass y convivencia

Durante la convivencia rige un **único sistema de registro por dominio** (RN-MIG-031). Esquema adoptado (DEC-068 para el orden de corte; PA-MIG-03 opción A para la sincronización):

| Etapa | Dominios en CoopApps (maestro) | Dominios en ProCoop (maestro) | Sincronización |
|---|---|---|---|
| E0 Ensayos | Ninguno | Todos | Snapshots `full` a tenant de ensayo |
| E1 Paralelo comercial | Ninguno (CoopApps simula) | Todos | Delta ProCoop → CoopApps diario; comparación |
| E2 By-pass comercial (corte 1) | Personas, cuentas, contratos, catálogo, tarifas, medición, facturación, fiscal ventas, cuenta corriente, cobranza, entes, mora, financiación, CRM, técnica, portal, comunicaciones | Compras, stock no serializado, tesorería, contabilidad oficial, sueldos, institucional, social (si no fueron cortados) | CoopApps → ProCoop: asientos resumidos diarios (formato importable `ImportarAsientos`/`ImportarAsientosConSeccion`), cobranzas para tesorería, retiros de materiales para stock, descuentos de empleados (`SU_EMPLEADOS_SUMSOC`) |
| E3 By-pass administrativo (corte 2) | + compras, stock, tesorería, contabilidad, retenciones | Sueldos, institucional, social (si no fueron cortados) | CoopApps → ProCoop: asientos de sueldos se importan en CoopApps desde ProCoop (sentido inverso) |
| E4 Apagado | Todos | Ninguno (ProCoop solo consulta hasta el cierre del ejercicio, luego archivo) | — |

Reglas de convivencia:

- Una vez cortado un dominio, ProCoop queda **solo lectura** para ese dominio (congelamiento por perfiles en ProCoop: la cooperativa quita permisos de alta/modificación en `MENUVAL`).
- El portal CoopOnline se apaga en el corte comercial: los socios pasan al portal CoopApps (usuarios migrados, PA-MIG-07). La sincronización ProCoop → MySQL (`clsWEB.Sincronizar*`) se detiene (FIC 14.1).
- Los cobros que entran por entes con claves ProCoop se resuelven con el **resolutor de claves heredadas** (RF-MIG-083) hasta el vencimiento del último comprobante ProCoop (PA-MIG-16).
- Las funciones de ProCoop atadas a la "cuenta Procoop" (WhatsApp, SMS, login directo, PMovil) dependen de V2 518/519: no modificar esos parámetros en ProCoop durante la transición (RN-11 Implicancias 7).
- La registración bancaria de rendiciones se acuerda con la contaduría (por caja o por fecha de acreditación, RN-11 Implicancias 5) antes del corte comercial.
- Gas desde el día 1 si la cooperativa piloto de migración opera gas (como la base relevada LAG): servicio GS, categorías ENARGAS, exportaciones CMD (A/B + punto de venta + número) y Usr (RN-11 Implicancias 6) deben estar en CoopApps antes del corte comercial.

### 9.8 Conciliación de saldos, deuda, stock y contabilidad

1. **Deuda**: Σ saldos de documentos abiertos migrados por (titular, servicio) = Σ saldos ProCoop; total = cuenta contable de deudores por servicios a la fecha de corte; diferencias explicadas (pagos en tránsito, entes rendidos no importados).
2. **Saldos a favor y anticipos** (`ANTICIPOS.SDO_ANT`), pagos no identificados: conciliados contra pasivo contable.
3. **Convenios**: capital e interés pendientes por convenio y cuota.
4. **Fondos**: cajas (`CAJAS`/`PLAN_CAJ` del día), valores en cartera (`VALORES` por estado), cupones de tarjeta no acreditados (`CUPONTAR`), saldos bancarios (`BANKOS.SALDO` vs `RESBAN`), cheques propios no debitados (`CHEQUERAS`).
5. **Stock**: cantidad por depósito y producto (`MOV_PRO` acumulado vs `PROD_SER.STO_ACT`), unidades serializadas por estado/ubicación (`PROD_TRH`, `MOV_TRH`), comodatos (`SERSOC_PRODUCTOS`); valorización contra cuenta de bienes de cambio.
6. **Contabilidad**: sumas y saldos por cuenta y centro de costo al corte; asientos del ejercicio en curso balanceados; saldo de apertura = cierre ProCoop.
7. **Sueldos**: acumulados por legajo (remunerativo, Ganancias, SAC) del año.
8. **Prepago**: saldo de crédito por medidor.

### 9.9 Corte definitivo

Runbook (pasos mínimos): (1) comunicación a socios y entes; (2) verificar 0 comprobantes pendientes de CAE en ProCoop (RN-MIG-029); (3) cierre de cajas en ProCoop; (4) congelamiento; (5) snapshot `final`; (6) delta final y carga; (7) conciliaciones finales aprobadas; (8) último número autorizado en ARCA por punto de venta (RN-MIG-028); (9) go/no-go con doble aprobación; (10) activar emisión fiscal, publicación de deuda a entes, débitos, pasarelas, notificaciones; (11) activar resolutor y alias; (12) habilitar portal y enviar invitaciones; (13) acta de aceptación; (14) monitoreo reforzado y soporte de arranque (AGR §7 F).

Criterios go: conciliaciones aprobadas de todos los dominios del alcance; paralelo aprobado; usuarios y permisos cargados; credenciales de integraciones en bóveda y probadas; plan de rollback revisado; soporte disponible.

### 9.10 Anonimización para ambientes de prueba

- Origen: snapshot real; destino: ambientes `dev`/`test`/`demo` o tenants de ensayo de otras cooperativas. Nunca datos reales fuera de producción y del tenant de ensayo propio (BASE §97.9, REL README).
- Métodos por columna (§7.12). Determinismo por proyecto (mismo DNI → mismo DNI ficticio en todas las tablas) para preservar duplicados y relaciones; CUIT ficticios con DV válido; nombres/calles de diccionarios ficticios; fechas de nacimiento generalizadas; importes **no** se alteran (son necesarios para el paralelo) salvo en ambientes `demo`, donde se escalan por un factor.
- Texto libre (`OBSERVA`, `TEXTO`, `DESCRIPCION`, notas, mails, SMS) se suprime o reemplaza por texto genérico.
- Adjuntos reemplazados por PDF genéricos.
- Verificación automática post-anonimización: búsqueda de patrones de DNI/CUIT/correo/teléfono reales del origen en el destino → 0 coincidencias.

### 9.11 Rollback (plan de retorno)

1. **Antes del corte**: no hay rollback; un dominio en paralelo simplemente no se corta.
2. **Entre el corte y `rollbackDeadline`** (antes de la primera emisión fiscal real o el primer cobro por entes en CoopApps): se reabre ProCoop para el alcance, se exporta `rollbackJournal` (altas, modificaciones, cobros en caja, lecturas) en formatos importables en ProCoop (planillas para carga y archivos de cobranza) y se reprocesa en ProCoop; CoopApps vuelve a `procoopMaster` para el alcance.
3. **Después de `rollbackDeadline`**: solo "rollback hacia adelante": se corrige en CoopApps; si se decide volver a ProCoop, los comprobantes autorizados y cobros confirmados en CoopApps se exportan a ProCoop como comprobantes de terceros/recibos manuales; nunca se restaura una copia que deshaga hechos fiscales o cobros externos (AGR-019).
4. Toda decisión de rollback requiere doble aprobación y queda en el expediente.

## 10. Pantallas

Todas en `apps/admin` bajo el cluster `dict:sitemap.platform.migration` (rutas `meta.platformOnly` para el implementador) y el cluster `dict:sitemap.tenant.migration` (vista del tenant para analista, responsables y contador). Layout CNX: `AdminStickyHeader`, `ScreenHelp`, `DataTable` con exportación XLSX/CSV/PDF y vistas guardadas, modales `md/lg/xl`, `ConfirmDialog` para acciones irreversibles.

| PAN-ID | App | Ruta | Capability | Propósito | Contenido principal | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|
| PAN-MIG-01 | plataforma | `/platform/migrations` | `mig.proyectos.ver` | Listado de proyectos por cooperativa | Columnas: código, tenant, sigla, versión ProCoop, estado, dominio actual, último snapshot, próximo hito. Acción "Nuevo proyecto" (modal md). Vacío: "Todavía no hay migraciones". | — |
| PAN-MIG-02 | plataforma/admin | `/platform/migrations/:id` | `mig.proyectos.ver` | Tablero del proyecto | Línea de fases F1–F13; tarjetas por dominio con estado de convivencia; conciliaciones pendientes; issues abiertos por severidad; acciones según estado (§8.1). | — |
| PAN-MIG-03 | plataforma | `/platform/migrations/:id/sources` | `mig.proyectos.configurar` | Fuentes y accesos | Fuentes con tipo, modo `readonly`, referencia de credencial (bóveda), prueba de conexión. | `frmCopiaSeguridad` (referencia) |
| PAN-MIG-04 | plataforma | `/platform/migrations/:id/inventory` | `mig.proyectos.ver` | Inventario de 659 tablas | DataTable: sección CAT, tabla, filas, estrategia, destino, anexo, ola, override y motivo; filtros por sección/estrategia/anexo; edición en modal con motivo. | Catálogo CAT |
| PAN-MIG-05 | plataforma | `/platform/migrations/:id/snapshots` | `mig.snapshots.crear` | Snapshots | Listado (tipo, asOf, tablas, filas, hash, anonimizado, retención); acciones: extraer full/delta/final, descargar manifiesto, anonimizar a nuevo snapshot. | — |
| PAN-MIG-06 | admin | `/admin/migration/profiling` | `mig.perfilado.ver` | Perfilado de calidad | Por tabla/columna: nulos, distintos, min/max, formatos, huérfanos; comparación con snapshot anterior; gráfico de calidad por dominio. | — |
| PAN-MIG-07 | plataforma | `/platform/migrations/mapping-sets` | `mig.reglas.editar` | Conjuntos y reglas de mapeo | Árbol tabla → reglas; editor de regla (modal xl) con vista previa sobre 20 filas reales del snapshot; publicar con changelog; diff entre versiones. | — |
| PAN-MIG-08 | admin | `/admin/migration/value-maps` | `mig.valores.editar` | Mapas de valores | Valor origen (con descripción ProCoop), valor destino (select del catálogo CoopApps), aprobado por; importación por ExcelImportWizard. | Tablas del sistema ProCoop |
| PAN-MIG-09 | plataforma | `/platform/migrations/:id/runs` | `mig.corridas.ejecutar` | Corridas | Listado con tipo, alcance, estado, estadísticas; lanzar corrida (modal lg: tipo, snapshot, conjunto, dominios, destino); progreso en vivo por tabla/lote; cancelar/reanudar; purgar ensayo. | — |
| PAN-MIG-10 | admin | `/admin/migration/issues` | `mig.rechazos.ver` | Rechazos y advertencias | DataTable: corrida, tabla, clave ProCoop, código, severidad, campo, valor (enmascarado), acción sugerida, dónde corregir, asignado, estado; acciones masivas: asignar, excluir (con motivo), aceptar advertencia, corregir en staging (modal con el registro), reprocesar selección. | — |
| PAN-MIG-11 | admin | `/admin/migration/quality/persons` | `mig.calidad.sanear` | Saneamiento de personas y duplicados | Pares/grupos candidatos con puntaje, comparación lado a lado, fusionar/no fusionar, corregir CUIT/DNI. | `frmPersonas` (referencia) |
| PAN-MIG-12 | admin | `/admin/migration/quality/addresses` | `mig.calidad.sanear` | Normalización de domicilios y calles | Calles origen vs callejero, sugerencias por similitud, consolidación `CALLES`/`RNQCALL`, mapa de geocodificación opcional. | Tablas de calles |
| PAN-MIG-13 | admin | `/admin/migration/reconciliations` | `mig.conciliacion.ver` | Conciliaciones por dominio | Checks con origen/destino/diferencia/tolerancia/estado; detalle por titular-servicio, depósito, cuenta contable; enviar, aprobar o rechazar (segregación); adjuntar evidencia. | Informes de saldos ProCoop |
| PAN-MIG-14 | admin | `/admin/migration/parallel` | `mig.paralelo.ver` | Tablero de corrida paralela | Por servicio y período: comparados, iguales, tolerancia, explicados, pendientes, no emparejados; drill-down por concepto, categoría, ruta. | Facturación masiva (`FACTMES`) |
| PAN-MIG-15 | admin | `/admin/migration/parallel/:runId/compare/:id` | `mig.paralelo.justificar` | Comparación de una factura | Dos columnas (ProCoop / CoopApps) con renglones, cantidades, conceptos, impuestos, vencimientos; diferencias resaltadas; clasificar y justificar; ver traza de cálculo CoopApps. | Detalle de comprobante ProCoop |
| PAN-MIG-16 | admin | `/admin/migration/coexistence` | `mig.bypass.configurar` | Convivencia y by-pass | Matriz dominio × sistema de registro; sincronizaciones con último resultado; criterios de salida; aprobar by-pass de un dominio. | — |
| PAN-MIG-17 | admin | `/admin/migration/cutover` | `mig.corte.planificar` | Plan de corte | Runbook con pasos, responsables, prerrequisitos, criterios go/no-go en semáforo; decisión go (doble aprobación, 2FA); `rollbackDeadline` visible. | — |
| PAN-MIG-18 | admin | `/admin/migration/rollback` | `mig.rollback.ejecutar` | Rollback | Diario post-corte por tipo; exportar a formatos ProCoop; ejecutar con doble aprobación. | — |
| PAN-MIG-19 | admin | `/admin/migration/key-aliases` | `mig.proyectos.ver` | Alias de claves heredadas | Búsqueda por valor (código de barras, identificador ente, código anterior), destino, vigencia; pagos resueltos por alias y ambigüedades. | Importador Red Link LAG |
| PAN-MIG-20 | admin (componente) | pestaña "Histórico ProCoop" en fichas de persona, cuenta, contrato, proveedor, empleado | `mig.archivo.ver` + permiso de la ficha | Consultar histórico | Listado de `legacyRecords` y documentos `readOnly` vinculados, con filtros por tabla y fecha; vista JSON legible con etiquetas del diccionario. | Fichas ProCoop en modo "Sólo LECTURA" |
| PAN-MIG-21 | pwa-socio | `/app/history` (sección dentro de Facturas/Pagos) | Sesión del socio; solo sus cuentas (relación autorizada de M01) (antes "portal") | Ver comprobantes y pagos históricos | Cards con marca "Sistema anterior", descarga de PDF original. | CoopOnline |
| PAN-MIG-22 | plataforma | `/platform/migrations/anonymization` | `mig.anonimizacion.ejecutar` | Perfiles de anonimización | Reglas por tabla/columna, prueba sobre muestra, verificación de fuga. | — |
| PAN-MIG-23 | admin | `/admin/migration/acceptance` | `mig.actaAceptacion.firmar` | Acta de aceptación | Resumen de conciliaciones, paralelo y pendientes aceptados; firma electrónica (T11). | — |

Ayuda contextual (`ScreenHelp`) en cada pantalla: qué es, quién la usa, cuándo (fase), dónde impacta, por qué (requisito de origen) y caso de uso CU-MIG asociado.

## 11. API

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-MIG-01 | GET/POST | `/api/platform/migration/projects` | `mig.proyectos.ver` / `mig.proyectos.crear` | Listar / crear proyectos | POST con `Idempotency-Key` |
| API-MIG-02 | GET/PATCH | `/api/platform/migration/projects/:id` | `mig.proyectos.ver` / `mig.proyectos.configurar` | Detalle / actualizar estrategia | PATCH con `version` |
| API-MIG-03 | POST | `/api/platform/migration/projects/:id/transition` | Según la transición de §8.1: `mig.proyectos.configurar` (hasta `rehearsing` y a `closed` o `cancelled`), `mig.paralelo.aprobar` (a `parallel`), `mig.bypass.aprobar` (a `bypassing`), `mig.corte.aprobar` (a `cutover`), `mig.actaAceptacion.firmar` (a `live`) (antes "según transición") | Cambiar estado (§8.1) | Sí |
| API-MIG-04 | GET/PATCH | `/api/platform/migration/projects/:id/inventory` | `mig.proyectos.ver` / `mig.proyectos.configurar` | Inventario de tablas | PATCH con `version` |
| API-MIG-05 | POST | `/api/platform/migration/projects/:id/snapshots` | `mig.snapshots.crear` | Extraer snapshot full/delta/final | Sí |
| API-MIG-06 | GET | `/api/platform/migration/snapshots/:id/manifest` | `mig.proyectos.ver` | Manifiesto | — |
| API-MIG-07 | GET/POST | `/api/platform/migration/mapping-sets` | `mig.reglas.editar` | Conjuntos de mapeo | Sí |
| API-MIG-08 | POST | `/api/platform/migration/mapping-sets/:id/publish` | `mig.reglas.publicar` | Publicar (inmutable) | Sí |
| API-MIG-09 | POST | `/api/platform/migration/mapping-rules/:id/preview` | `mig.reglas.editar` | Vista previa sobre muestra | — |
| API-MIG-10 | GET/PUT | `/api/admin/migration/value-maps/:code` | `mig.valores.editar` | Mapas de valores del tenant | PUT con `version` |
| API-MIG-11 | POST | `/api/platform/migration/runs` | `mig.corridas.ejecutar` | Lanzar corrida | Sí (`idempotencyKey`) |
| API-MIG-12 | POST | `/api/platform/migration/runs/:id/{cancel\|resume\|purge}` | `mig.corridas.cancelar` / `mig.corridas.ejecutar` | Control de corrida | Sí |
| API-MIG-13 | GET | `/api/admin/migration/runs/:id` | `mig.proyectos.ver` | Estado y estadísticas | — |
| API-MIG-14 | GET | `/api/admin/migration/issues` | `mig.rechazos.ver` | Rechazos/advertencias paginados `{ items, total, page, size }` | — |
| API-MIG-15 | PATCH | `/api/admin/migration/issues/:id` | `mig.rechazos.editar` | Asignar, excluir, aceptar | Con `version` |
| API-MIG-16 | PATCH | `/api/admin/migration/staging/:id` | `mig.rechazos.editar` | Corregir registro en staging | Con `version` |
| API-MIG-17 | POST | `/api/admin/migration/runs/:id/reprocess` | `mig.corridas.ejecutar` | Reprocesar selección | Sí |
| API-MIG-18 | GET | `/api/admin/migration/issues/export` | `mig.rechazos.exportar` | Exportar XLSX/CSV | — |
| API-MIG-19 | GET/POST | `/api/admin/migration/quality/person-merges` | `mig.calidad.sanear` | Candidatos y decisiones de fusión | Sí |
| API-MIG-20 | GET/POST | `/api/admin/migration/reconciliations` | `mig.conciliacion.ver` | Conciliaciones | — |
| API-MIG-21 | POST | `/api/admin/migration/reconciliations/:id/{submit\|approve\|reject}` | `mig.conciliacion.aprobar` | Flujo de aprobación | Sí |
| API-MIG-22 | POST | `/api/admin/migration/parallel-runs` | `mig.paralelo.ejecutar` | Crear corrida paralela (simular + importar + comparar) | Sí |
| API-MIG-23 | GET | `/api/admin/migration/parallel-runs/:id/comparisons` | `mig.paralelo.ver` | Comparaciones paginadas | — |
| API-MIG-24 | PATCH | `/api/admin/migration/parallel-comparisons/:id` | `mig.paralelo.justificar` | Clasificar y justificar | Con `version` |
| API-MIG-25 | POST | `/api/admin/migration/parallel-runs/:id/approve` | `mig.paralelo.aprobar` | Aprobar ciclo | Sí |
| API-MIG-26 | GET/PUT | `/api/admin/migration/bypass-plan` | `mig.bypass.configurar` | Plan de by-pass | PUT con `version` |
| API-MIG-27 | POST | `/api/admin/migration/bypass-plan/domains/:domain/switch` | `mig.bypass.aprobar` | Cambiar sistema de registro | Sí |
| API-MIG-28 | GET/POST | `/api/admin/migration/coexistence-syncs` | `mig.bypass.configurar` | Sincronizaciones y ejecución manual | Sí |
| API-MIG-29 | GET/PUT | `/api/admin/migration/cutover` | `mig.corte.planificar` | Runbook | PUT con `version` |
| API-MIG-30 | POST | `/api/admin/migration/cutover/{go\|execute-step}` | `mig.corte.aprobar` / `mig.corte.ejecutar` | Decisión go y pasos | Sí |
| API-MIG-31 | POST | `/api/admin/migration/rollback` | `mig.rollback.ejecutar` | Ejecutar plan de retorno | Sí |
| API-MIG-32 | GET | `/api/admin/migration/rollback/journal/export` | `mig.rollback.ejecutar` | Exportar diario en formatos ProCoop | — |
| API-MIG-33 | GET | `/api/admin/migration/key-aliases` | `mig.proyectos.ver` | Buscar alias | — |
| API-MIG-34 | POST | `/api/admin/migration/key-aliases/resolve` | `mig.clavesHeredadas.resolver` (identidad de servicio de M07 y redes de cobro; sin acceso de usuario; antes "Identidad de servicio (M07, redes de cobro)…") | Resolver clave heredada → destino | Sí |
| API-MIG-35 | GET | `/api/admin/legacy/records` | `mig.archivo.ver` | Histórico por vínculo (`?accountId=&table=&from=&to=`) | — |
| API-MIG-36 | GET | `/api/legacy/history` | `mig.miHistorial.ver` (sesión del socio; solo sus cuentas por relación autorizada de M01; antes "Sesión del socio…") | Histórico propio en PWA | — |
| API-MIG-37 | GET/POST | `/api/platform/migration/anonymization-profiles` | `mig.anonimizacion.ejecutar` | Perfiles y ejecución | Sí |
| API-MIG-38 | GET | `/api/admin/migration/legacy-id-map` | `mig.proyectos.ver` | Consultar mapa de IDs (`?table=&key=` o `?collection=&id=`) | — |

Errores RFC 9457: `/problems/mig-mapping-unpublished`, `/problems/mig-run-conflict`, `/problems/mig-segregation`, `/problems/mig-go-criteria-unmet`, `/problems/legacy-read-only`, `/problems/mig-snapshot-not-anonymized`.

## 12. Eventos y jobs

### 12.1 Eventos emitidos

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-MIG-01 | `mig.snapshot.ready` | Snapshot extraído | Perfilado automático |
| EVT-MIG-02 | `mig.run.started` / `mig.run.loaded` / `mig.run.failed` / `mig.run.accepted` | Ciclo de la corrida | Notificaciones a responsables (T09), auditoría |
| EVT-MIG-03 | `mig.issue.assigned` | Issue asignado | Bandeja del usuario |
| EVT-MIG-04 | `mig.reconciliation.approved` / `rejected` | Aprobación | Tablero del proyecto |
| EVT-MIG-05 | `mig.parallel.compared` / `approved` | Paralelo | Tablero |
| EVT-MIG-06 | `mig.domain.switched` | By-pass de un dominio | Módulos dueños (activan procesos reales), M07 (resolutor), T06 (habilita integraciones) |
| EVT-MIG-07 | `mig.cutover.completed` | Corte | M05/M06 (emisión real), M07 (publicación a entes), M19 (invitaciones), T09 |
| EVT-MIG-08 | `mig.rollback.executed` | Rollback | Todos los módulos del alcance (vuelven a modo no maestro) |
| EVT-MIG-09 | `mig.person.merged` | Fusión aprobada | M01 y módulos que referencian personas |
| EVT-MIG-10 | `mig.snapshot.blocked` | El escaneo previo encuentra números de tarjeta o columnas con apariencia de credencial no listadas (RN-MIG-013, DEC-103). Carga útil: `snapshotId`, cantidad de hallazgos por tipo y tablas afectadas; nunca valores | Notificación al líder de migración y al responsable de seguridad del proyecto (T09); auditoría (T02) |

Todos los eventos de negocio emitidos por los módulos durante una carga llevan `migration: true` (RN-MIG-043).

### 12.2 Eventos consumidos

| Evento | Uso |
|---|---|
| Todos los eventos de negocio posteriores al corte (`*.*.*` vía outbox) | Alimentan `rollbackJournal` hasta `rollbackDeadline` |
| `cob.payment.confirmed` (EVT-COB-04) con clave no resuelta | Resolutor de alias (RF-MIG-083) |
| `fac.billingRun.prebilled` (EVT-FAC-02) | Dispara comparación paralela |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-MIG-01 | `mig:extraer-snapshot` | A demanda / programado (delta diario en paralelo) | Escaneo previo de secretos y números de tarjeta (RN-MIG-013, DEC-103; si hay hallazgos, deja el snapshot `blocked` y no extrae) y luego extracción por tabla, reanudable |
| JOB-MIG-02 | `mig:perfilar` | Tras snapshot | Perfilado |
| JOB-MIG-03 | `mig:transformar` | Por corrida | Aplicación de reglas |
| JOB-MIG-04 | `mig:validar` | Por corrida | Validaciones |
| JOB-MIG-05 | `mig:cargar-dominio` | Por corrida (hijos por tabla/lote) | Carga vía servicio del módulo |
| JOB-MIG-06 | `mig:conciliar` | Tras carga | Cálculo de checks |
| JOB-MIG-07 | `mig:reprocesar` | A demanda | Reproceso de selección |
| JOB-MIG-08 | `mig:paralelo-simular` | Por ciclo | Invoca `fac:emitir-lote` en modo `simulation` |
| JOB-MIG-09 | `mig:paralelo-comparar` | Tras simular e importar | Comparación factura por factura |
| JOB-MIG-10 | `mig:sync-convivencia` | Según `coexistenceSyncs.schedule` | Deltas y exportaciones de convivencia |
| JOB-MIG-11 | `mig:exportar-asientos-procoop` | Diario en convivencia E2 | Archivo importable en ProCoop |
| JOB-MIG-12 | `mig:anonimizar` | A demanda | Snapshot anonimizado + verificación de fuga |
| JOB-MIG-13 | `mig:archivar-historico` | O11, tras corte | Carga de `legacyRecords` |
| JOB-MIG-14 | `mig:vencer-alias` | Diario | Desactiva alias vencidos (PRM-MIG-030) |
| JOB-MIG-15 | `mig:purgar-staging` | Diario | TTL y purga de ensayos |
| JOB-MIG-16 | `mig:migrar-adjuntos` | Por corrida | Copia de archivos con hash |

Todos idempotentes, reanudables y con progreso (Guía §5).

## 13. Integraciones

| Fuente/destino | Dirección | Medio | Particularidades | Referencia |
|---|---|---|---|---|
| SQL Server de ProCoop (`PR_<SIGLA>`) | Entrante | Conexión TDS de solo lectura o backup `.bak` restaurado en instancia de plataforma | Consultas por tabla; ninguna escritura; credencial en bóveda | FIC 21, T06 |
| MySQL de CoopOnline/PMovil | Entrante | Conexión de solo lectura o dump | Usuarios web, cuentas vinculadas, adhesiones, trámites, órdenes PMovil | FIC 14.1, 14.2, 21 |
| Adjuntos y PDF | Entrante | Carpetas del servidor (SFTP) y Amazon S3 | Hash, vínculo a `ADJUNTOS`/`ACTAS`/`FIRMADIGITAL_ITEMS`; PDF de facturas para histórico | FIC 21 |
| DBF, Access, Excel | Entrante | Archivos | `ExcelImportWizard` con perfiles | FIC 21, DFA §33 (nota; antes "DFA §30") |
| ARCA | Consulta | WSFEv1 `FECompUltimoAutorizado` | Numeración al corte (RN-MIG-028); consulta de CAE de comprobantes abiertos para validar | T06, M06 |
| Red Link, SIRO, Pagos360 | Bidireccional en transición | Archivos/API de cada ente | Doble padrón y resolutor de claves heredadas | RN-11, M07, T06 |
| ProCoop (convivencia) | Saliente | Archivos importables (`ImportarAsientos`, `ImportarAsientosConSeccion`, planillas de cobranza) | Solo en E2/E3 | FIC 18.2 |
| Sistema anterior a ProCoop (LAG) | — | — | Solo alias `FACTURAS.USUARIO` | RN-11 Duda 7 |

## 14. Parámetros de configuración

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MIG-001 | `mig.legalEntities.mergeIntoTenant` | boolean | tenant | `true` | Varias empresas ProCoop → `legalEntities` de T04 en un tenant (DEC-064, CTR-DAT-48) | — |
| PRM-MIG-002 | `mig.accounts.keepLegacyNumber` | boolean | tenant | `true` | Conservar número de cuenta ProCoop como número visible | — |
| PRM-MIG-010 | `mig.tariffs.liveMonths` | int | tenant | `24` | Meses de cuadros tarifarios a migrar como versiones vivas | — |
| PRM-MIG-011 | `mig.receivables.partialPaymentServiceSplit` | enum `proportional\|oldestFirst\|servicePriority` | tenant | `proportional` | Reparto por servicio de pagos parciales históricos sin discriminación | — |
| PRM-MIG-012 | `mig.metering.liveConsumptionPeriods` | int | servicio | `13` | Períodos de consumo vivos para promedios/estimaciones | — |
| PRM-MIG-013 | `mig.payroll.typedPayslipMonths` | int | tenant | `24` | Meses de recibos de sueldo tipados | — |
| PRM-MIG-014 | `mig.history.typedMonths` | int | tenant | `24` | Profundidad del histórico tipado (más ejercicio en curso; DEC-070) | — |
| PRM-MIG-015 | `mig.archive.retentionYears` | int | plataforma/tenant | `10` | Años de conservación del snapshot archivado (DEC-070; antes A validar PA-MIG-01) | — |
| PRM-MIG-020 | `mig.persons.dedupThreshold` | decimal | tenant | `0.92` | Umbral de similitud para proponer fusión | — |
| PRM-MIG-021 | `mig.persons.autoMergeSameDocument` | boolean | tenant | `false` | Fusión automática solo mismo tipo+número de documento y nombre ≥ umbral (PA-MIG-10) | — |
| PRM-MIG-022 | `mig.taxId.invalidPolicy` | enum `loadFlagged\|reject` | tenant | `loadFlagged` | Política ante CUIT/DNI inválido (PA-MIG-11) | — |
| PRM-MIG-023 | `mig.address.geocoding` | enum `off\|suggest\|auto` | tenant | `suggest` | Geocodificación de domicilios (PA-MIG-12) | — |
| PRM-MIG-030 | `mig.aliases.graceDays` | int | tenant | `180` | Margen tras el vencimiento del último comprobante ProCoop (DEC-050) | — |
| PRM-MIG-031 | `mig.aliases.ambiguityPolicy` | enum `onAccount\|reject` | tenant | `onAccount` | Ante dos candidatos: pago a cuenta con aviso | — |
| PRM-MIG-040 | `mig.reconciliation.roundingTolerancePerDoc` | decimal | plataforma | `0.01` | Tolerancia de redondeo por documento (ARS) | — |
| PRM-MIG-041 | `mig.parallel.requiredCycles` | int | tenant/servicio | `2` | Ciclos consecutivos aprobados requeridos (PA-MIG-02) | — |
| PRM-MIG-042 | `mig.parallel.maxUnexplained` | int | tenant | `0` | Diferencias sin explicar admitidas para aprobar | — |
| PRM-MIG-043 | `mig.parallel.deltaSchedule` | cron | tenant | `0 2 * * *` | Delta diario ProCoop → CoopApps | — |
| PRM-MIG-050 | `mig.staging.ttlDays` | int | plataforma | `90` | TTL de registros de staging | — |
| PRM-MIG-051 | `mig.batch.size` | int | plataforma | `1000` | Tamaño de lote de carga | — |
| PRM-MIG-052 | `mig.rollback.deadlinePolicy` | enum `firstFiscalOrExternalPayment\|fixedHours` | tenant | `firstFiscalOrExternalPayment` | Fin de la ventana de rollback por restauración | — |
| PRM-MIG-060 | `mig.anonymization.demoAmountScale` | decimal | plataforma | `0.37` | Factor de escala de importes en ambientes demo | — |
| PRM-MIG-061 | `mig.sourceSigla` | string | tenant | — | Sigla ProCoop de la cooperativa | V2 #2264 |
| PRM-MIG-062 | `mig.sourceLegalName` / `mig.sourceTaxId` | string | tenant | — | Razón social y CUIT registrados en ProCoop (solo verificación) | V2 #518, #519 |
| PRM-MIG-063 | `mig.housing.terminateDeliveredFullyPaid` | boolean | tenant | `false` | Cerrar como `terminated` el contrato de una vivienda entregada con 100 % facturado y pagado (RN-MIG-052, HUECO-VIV-03) | — |
| PRM-MIG-064 | `mig.secretScan.extraNamePatterns` | string[] | plataforma | `[]` | Fragmentos de nombre de columna que el escaneo previo trata como credencial además de la lista fija de RN-MIG-013; solo puede **agregar** patrones, nunca quitar los fijos ni desactivar el escaneo ni la búsqueda de números de tarjeta (DEC-103) | — |

## 15. Reportes, indicadores y exportaciones

| Reporte | Fórmula / contenido | Universo | Fecha de corte |
|---|---|---|---|
| Inventario de tablas | Filas por tabla y estrategia; % tablas con datos por módulo | 659 tablas | `asOf` del snapshot |
| Perfilado de calidad | % nulos, % inválidos por regla, huérfanos, duplicados | Por tabla/columna | `asOf` |
| Índice de calidad por dominio | 1 − (registros con issue error o warning / registros) | Dominio | `asOf` |
| Rechazos y advertencias | Conteo por código, severidad, tabla, estado | Corrida | Fin de la corrida |
| Avance de saneamiento | Issues resueltos / issues totales por tipo y responsable | Proyecto | Al día |
| Conciliación por dominio | Checks origen vs destino con diferencia | Dominio | `asOf` |
| Deuda por titular y servicio | Σ saldo abierto origen vs destino por (titular, servicio) | Documentos abiertos | `asOf` |
| Antigüedad de deuda migrada | Saldos por tramo de vencimiento (0–30, 31–60, 61–90, >90 días) | Documentos abiertos | `asOf` |
| Paralelo factura por factura | Comparados, iguales, tolerancia, explicados, sin explicar; diferencia total por concepto | Ciclo y servicio | Fecha de emisión ProCoop |
| Tendencia de paralelo | % iguales por ciclo | Proyecto | Por ciclo |
| Uso de alias | Pagos resueltos por alias, ambiguos, no resueltos | Post-corte | Al día |
| Diario de rollback | Hechos post-corte por tipo | Corte | Al día |
| Acta de aceptación | Resumen ejecutivo | Proyecto | Corte |

Todos exportables a XLSX/CSV/PDF y guardados como evidencia en T11.

## 16. Casos de uso

### CU-31 (BASE §31, original) — Importación con validación previa

**Actor:** implementador y responsable del área. **Situación inicial:** archivo de demostración con tres suministros, uno inconsistente. **Desarrollo:** (1) validación previa con errores por fila; (2) corregir la fila observada o excluirla explícitamente y aprobar la carga; (3) importar, comparar cantidades y saldos y conservar el reporte de conciliación. **Resultado esperado:** datos aceptados con identificador de ejecución y evidencia del control realizado. **Excepción:** si se repite el mismo lote, reconocerlo y evitar duplicados; una corrección debe tener una ejecución identificada. Cubierto por RF-MIG-043, RF-MIG-050, RF-MIG-052, RF-MIG-053. Datos: lote `MIG-DEMO-001`, 3 filas, 2 válidas, error "Suministro sin titular asociado".

### CU-MIG-01 — Inventariar y perfilar una cooperativa

Implementador registra fuentes, extrae snapshot full, el sistema perfila y precarga la matriz de 659 tablas con conteos; el analista revisa módulos sin uso y ajusta estrategias con motivo.

### CU-MIG-02 — Ensayo completo en tenant de ensayo

Líder lanza `dryRun` de todos los dominios; revisa rechazos; analista corrige en origen o staging; reproceso; conciliaciones; purga del ensayo y repetición con nuevo snapshot hasta 0 rechazos bloqueantes.

### CU-MIG-03 — Saneamiento de personas duplicadas

Analista revisa grupo de tres registros con mismo DNI ficticio `20.000.001`; fusiona dos (mismo nombre) y deja el tercero (nombre distinto) para corregir en origen; las cuentas de ambos titulares siguen separadas.

### CU-MIG-04 — Conciliar deuda por titular y servicio

Contador revisa que la deuda migrada (ARS 1.245.300,00 ficticio) coincide con ProCoop y con la cuenta de deudores por servicios; una diferencia de ARS 8.000 corresponde a una rendición Red Link no importada; se importa, se reconcilia y se aprueba (ejemplo AGR-018).

### CU-MIG-05 — Corrida paralela de energía y gas

Facturación simula el ciclo del período, importa lo emitido por ProCoop, compara 12.500 comprobantes (volumen BASE §97.8); 12.430 iguales, 50 por redondeo dentro de tolerancia, 20 explicados (configuración de un cargo adicional corregida y re-simulada); aprueba el ciclo.

### CU-MIG-06 — Comparar un comprobante agrupado (FAC-012)

Un grupo ProCoop con energía, internet y una tasa de terceros se compara renglón por renglón y por subtotal de servicio; internet difiere por prorrateo de alta a mitad de período; se clasifica `intendedFix` (regla AGR-017 documentada).

### CU-MIG-07 — By-pass comercial

Responsable aprueba el by-pass de los dominios comerciales; ProCoop queda solo lectura para ellos; se activa la exportación diaria de asientos a ProCoop porque la contabilidad oficial sigue allí (DEC-069).

### CU-MIG-08 — Cobro con código de barras ProCoop después del corte

Un socio paga en caja CoopApps una factura emitida por ProCoop; el lector reconoce formato SIRO 56 dígitos; el resolutor encuentra el comprobante impago por alias y lo imputa.

### CU-MIG-09 — Rendición Red Link con identificador viejo ambiguo

Llega un pago con cuenta + servicio + importe que coincide con dos comprobantes impagos; el resolutor no imputa: genera pago a cuenta con aviso a cobranzas (RN-MIG-033).

### CU-MIG-10 — Corte definitivo

Runbook §9.9 completo, go con doble aprobación, emisión real habilitada, invitaciones al portal enviadas, acta firmada.

### CU-MIG-11 — Rollback dentro de la ventana

Al día siguiente del corte, falla crítica antes de la primera emisión fiscal: se exporta el diario (cobros en caja y altas), se reabre ProCoop, se cargan los hechos y CoopApps vuelve a `procoopMaster`.

### CU-MIG-12 — Ambiente de prueba anonimizado

Implementador genera snapshot anonimizado desde el real; la verificación de fuga da 0 coincidencias; se carga en `test` para pruebas de una ola.

### CU-MIG-13 — Socio consulta su historial

El socio entra al portal y ve sus facturas ProCoop de los últimos 24 meses con el PDF original.

### CU-MIG-14 — Reproceso con conflicto

Tras el corte de un dominio, un delta trae un cambio de domicilio de ProCoop sobre una cuenta ya modificada en CoopApps; el sistema registra conflicto y no sobrescribe.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Criterios transversales

- Conteo de filas extraídas = conteo de origen por tabla (manifiesto).
- 0 rechazos bloqueantes no excluidos; exclusiones aprobadas y listadas.
- 100 % de los documentos migrados con `legacy` y entrada en `legacyIdMap`.
- Reproceso del mismo snapshot y conjunto → 0 cambios (idempotencia).
- Aislamiento de tenant: una corrida del tenant A no lee ni escribe documentos del tenant B (prueba negativa).
- Permisos negativos: un analista no puede aprobar una conciliación que ejecutó; un empleado sin `mig.archivo.ver` no ve la pestaña histórica; nadie puede editar un documento `readOnly`.
- Ninguna credencial de ProCoop aparece en snapshots, staging, logs ni informes (búsqueda automática de columnas suprimidas).
- Corrida reanudada tras corte forzado del worker sin duplicados.

### 17.2 Criterios por dominio

| Dominio | Conteos (origen = destino) | Sumas/controles | Muestreo y reglas | Aprueba |
|---|---|---|---|---|
| **Personas y cuentas** (M01) | Personas (menos fusionadas, explicadas); titulares/socios; cuentas (`SUMSOC`); inmuebles; notas; adherentes y beneficiarios | % CUIT/DNI válidos; % domicilios normalizados; 0 cuentas sin titular | 50 fichas al azar comparadas campo por campo; NIP y N° de titular buscables; condición fiscal correcta | Responsable de atención/titulares |
| **Suministros / contratos** (M01+M02) | Servicios por estado y categoría (`SERSOC`); conectados = activos | Altas/bajas por mes últimos 12 meses iguales | Estado mapeado según §39.5; grupo de facturación asignado; ruta y orden de lectura | Responsable comercial |
| **Medidores y lecturas** (M03) | Medidores instalados por servicio; medidores en depósito; lecturas del período abierto; consumos vivos | Σ consumo por período y categoría últimos 13 períodos igual | Última lectura y factor por medidor; testigos; distribuciones `DST_CONSUMO`; saldo prepago por medidor | Responsable de medición |
| **Cuadros tarifarios** (M04) | Cuadros/versiones; categorías; escalones; cargos adicionales; impuestos de cuadro | — | Recalcular 100 facturas del último período cerrado con la versión migrada → mismo resultado; fórmulas traducidas aprobadas | Responsable de tarifas |
| **Deuda y cuenta corriente** (M07) | Documentos abiertos por tipo | Σ saldo por titular y servicio = origen; total = contabilidad; antigüedad por tramo igual; saldos a favor y anticipos iguales | 100 cuentas al azar con estado de cuenta idéntico (documento, vencimientos, importes por vencimiento) | Contador + cobranzas |
| **Comprobantes históricos** (M05/M06) | Comprobantes por tipo, punto de venta y mes dentro de la profundidad; anulados | Σ totales y Σ IVA por mes = libro IVA ventas ProCoop (`IVAVTA`) | CAE y vencimiento de CAE presentes; PDF original vinculado si existe; ningún histórico editable | Contador |
| **Cobranzas** (M07) | Recibos por mes; ítems de recibo; cajas | Σ cobrado por mes, medio de pago y caja = origen | Imputación (qué comprobante canceló cada recibo) idéntica en 100 recibos | Cobranzas |
| **Financiaciones** (M08) | Convenios vigentes; cuotas pendientes; planes de cuotas | Σ capital e interés pendiente = origen | Próximo vencimiento y cuota de 30 convenios; intereses diferidos pendientes | Cobranzas + contador |
| **Stock** (M13) | Productos; depósitos; unidades serializadas por estado; comodatos; bienes de uso | Σ cantidad por depósito y producto; valorización = cuenta contable; amortización acumulada = origen | Cada serie en un solo lugar; 30 equipos en comodato verificados en campo o por llamada | Responsable de depósito + contador |
| **Contabilidad** (M15) | Cuentas del plan; centros de costo; ejercicios; asientos del ejercicio en curso | Sumas y saldos por cuenta y centro al corte: diferencia 0; Σ debe = Σ haber por asiento | Saldos de apertura = cierre ProCoop; reglas de asientos automáticos probadas con 1 evento por tipo | Contador |
| **Proveedores** (M12) | Proveedores activos; comprobantes impagos; OC abiertas; retenciones del período | Σ saldo por proveedor = origen; Σ retenciones del período = SICORE/SIRCAR de ProCoop | CUIT, condición IVA, CBU (enmascarado en informes) de 30 proveedores | Compras + contador |
| **Sueldos** (M16) | Legajos activos; conceptos; categorías; novedades del período abierto | Acumulados anuales por legajo (bruto, Ganancias, SAC) = origen | Reliquidar un período cerrado con la configuración migrada → mismo neto en 100 % de los legajos o diferencia explicada | RRHH + contador |
| **Institucional** (M17) | Asociados; capital suscripto/integrado; consejo vigente; actas | Σ capital suscripto, integrado y pendiente por asociado = origen | Actas con PDF vinculado | Secretaría / consejo |
| **Técnica y CRM** (M10/M09) | OT, factibilidades, reclamos y tickets abiertos | — | Estado y responsable de 30 abiertos | Responsable técnico / atención |
| **Tesorería** (M14) | Cuentas bancarias; valores en cartera; cheques propios pendientes | Saldo por cuenta bancaria; Σ valores por estado | Movimientos no conciliados idénticos | Tesorería + contador |
| **Portal y usuarios** (M19/T02) | Usuarios web; cuentas vinculadas; usuarios del sistema | — | Socio de prueba activa su cuenta y ve sus cuentas | Atención |

### 17.3 Escenarios

| ESC | Escenario | Resultado esperado |
|---|---|---|
| ESC-MIG-01 | Repetir el lote MIG-DEMO-001 | 0 duplicados; corrida `unchanged` |
| ESC-MIG-02 | Snapshot con una factura agrupada que mezcla titulares | Rechazo fiscal `FAC-GROUP-FISCAL` |
| ESC-MIG-03 | Pago parcial histórico sin servicio | Reparto por PRM-MIG-011 con advertencia; saldo por servicio cuadra con total |
| ESC-MIG-04 | Cuenta con `COD_SUM` de 10 dígitos | Identificador como texto, sin desborde |
| ESC-MIG-05 | Factura ProCoop ≥ ARS 100.000 cobrada con código SIRO extendido `0448` | Leída y resuelta |
| ESC-MIG-06 | Dos comprobantes impagos de igual importe en rendición vieja | Pago a cuenta con aviso |
| ESC-MIG-07 | Reproceso tras cambio operativo en CoopApps | Conflicto, sin sobrescritura |
| ESC-MIG-08 | Intento de cargar snapshot real en `test` | Rechazado `/problems/mig-snapshot-not-anonymized` |
| ESC-MIG-09 | Rollback después de la primera emisión fiscal | Bloqueado; solo rollback hacia adelante |
| ESC-MIG-10 | Usuario del portal con correo duplicado en dos cuentas | Un usuario con dos cuentas vinculadas |
| ESC-01..05 (AGR) | ESC-05 (cambio de condiciones en período parcialmente procesado) aplicado a un período abierto al corte | Las versiones tarifarias migradas permiten refacturar sin reescribir documentos |

### 17.4 Criterio de aprobación del paralelo

Para el mismo período y padrón, cada factura del sistema nuevo coincide con la de ProCoop en cantidades, importes por concepto, impuestos y vencimientos; toda diferencia está explicada (DFA §33). Además: PRM-MIG-041 ciclos consecutivos aprobados por servicio, PRM-MIG-042 = 0 diferencias sin explicar, emparejamiento ≥ 99,9 % con los no emparejados justificados, y mora/cobranzas/asientos simulados conciliados.

## 18. Datos de precarga de demostración (ficticios)

| Dato | Valor ilustrativo |
|---|---|
| Proyecto | `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` |
| Lote CU-31 | `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" |
| Snapshot | `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) |
| Persona duplicada | DNI 20.000.001 "Pérez, Ana" ×2 + "Pérez, Ana M." (fusión propuesta 0,95) |
| CUIT inválido | 20-00000001-0 (DV incorrecto) |
| Deuda migrada | ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada |
| Paralelo | 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados |
| Alias | Código anterior `A-000123` → cuenta 1001 servicio Energía |
| Rollback | Ventana hasta la primera emisión fiscal real |

Los datos de precarga no existen en producción (BASE §97.9).

## 19. Migración desde ProCoop — matriz completa de mapeo de las 659 tablas

### 19.0 Convenciones de la matriz

- **Sección CAT**: sección del catálogo `Procoop-catalogo-tablas.md` (§1 a §31).
- **Destino**: colección CoopApps (camelCase plural; `coleccion.campo` cuando la tabla se integra como subdocumento o campo), `Histórico (legacyRecords)` para el archivo genérico, `Descartar` o `Reemplazado por …`.
- **Anexo dueño**: anexo que define la colección destino y su cargador (M01–M19, T01–T11).
- **Ola**: ola en que se construye y prueba el cargador del dominio (Guía §7). La ejecución real sobre la cooperativa ocurre en el paralelo y el corte comercial al cerrar **O7** y en el corte administrativo de **O11** (DEC-089; antes: "en el ensayo integral, paralelo y corte de O11").
- **Estrategia**: `Migrar vivo` (operativo; puede incluir una parte histórica tipada indicada en Observaciones), `Histórico` (solo lectura, tipado en la colección del dueño o en `legacyRecords`) o `No migrar` (Descartar o Reemplazado por). **Toda tabla, cualquiera sea su estrategia, queda en el snapshot archivado** (RN-MIG-003).
- Las columnas de credenciales se suprimen en la extracción (RN-MIG-013) y se indican en Observaciones.
- Cada mapeo campo a campo se define como regla `MAP-<COD>-<TABLA>-NNN` en el conjunto de mapeo de plataforma (§7.3); esta matriz es su índice obligatorio.

### 19.1 Socios, cuentas y servicios (CAT §1 — 24 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §1 | `ADHSOC` | Adherentes de un servicio (familiares, beneficiarios de sepelio/salud) | `serviceDependents` (+ `dependentEvents`) | M18 | O4 | Migrar vivo | Dueño corregido: M18 es dueño único de adherentes y beneficiarios (DEC-071, HUECO-TRV-01; antes "M01", O2). Vigentes vivos; bajas como registros cerrados (`endDate`, causa inferida o `unknown`). `COD_PER` → `persons` de M01 (dedup); `COD_VIN` → `relationshipTypes`; `COD_TAD` → tarifa de adherente de M04; `ID_SERSOC` → contrato de M02 por `legacyIdMap`. M01 no carga adherentes: solo los muestra. |
| §1 | `BENSOC` | Beneficiarios de un servicio (persona y vínculo) con vigencia | `serviceBeneficiaries` | M18 | O4 | Migrar vivo | Destino único corregido (HUECO-SEP-02, confirmado por DEC-086; antes `tariffBenefits` de M04, O4). Verificado en el catálogo y el código relevado: cada fila trae persona (`COD_PER`), vínculo (`COD_VIN`), servicio (`ID_SERSOC`, `COD_CSE` = código compuesto del servicio, no una causa), fechas, `OBSERVA` y `ACTIVO`; se graba y se desconecta junto con `ADHSOC` (RN-06 §10) y `AMBULANC.COD_BEN` la referencia. La tarifa social de ProCoop no se registra en `BENSOC`: sale de la categoría social (`CATE_SER.CAT_SOC`, V2 2740) y de la segmentación (`clsSegmentacion`, `clsTarifaSocial`), que migran por M02/M04 (RN-MIG-054). |
| §1 | `CAPITAL` | Movimientos de capital social por asociado (facturado, integrado, comprometido) | `capitalMovements` | M17 | O10 | Migrar vivo | Destino corregido (HUECO-CAP-03; antes `capitalInstallments`): movimientos tipo `migration` cargados por RF-INS-055 (saldo de apertura por asociado y rubro) más detalle histórico de solo lectura; `FACTURADO`/`PAGADO`/`COMPVEN` → `billed`/`paid`/`committed` si se migra el detalle. Facturadas vinculadas al comprobante (`ID_FAC` → `legacyIdMap`). Distinguir aporte de precio (BASE §97.7). Conciliación de M17 §19. |
| §1 | `CAPITAL_RES` | Reservas y resumen de capital suscripto, vendido y pagado | `capitalReserves` (+ validación de `capitalBalances`) | M17 | O10 | Migrar vivo | Destino corregido (HUECO-CAP-03; antes `capitalAccounts`): reservas activas → `capitalReserves`; `SUSCRIPTO`/`VENDIDO` no crean saldos: validan la proyección `capitalBalances` (M17 §7.33) recalculada desde `capitalMovements` (CTR-INS-03). Conciliar con contabilidad (§17.2 Institucional). |
| §1 | `NOTA_SUM` | Notas de cuenta con bloqueo y mensaje en caja | `accountNotes` | M01 | O2 | Migrar vivo | `BLO_CAJ`/`MSG_CAJ` → bloqueo operativo explícito (RN-MIG-019). Texto libre suprimido al anonimizar. |
| §1 | `NOT_ELIMINADAS_HST` | Historial de notas eliminadas | Histórico (legacyRecords) | M01 | O2 | Histórico | Evidencia de auditoría; vínculo a cuenta. |
| §1 | `PERSONAS` | Personas físicas/jurídicas | `persons` | M01 | O2 | Migrar vivo | Deduplicación (PA-MIG-10), validación CUIT/DNI (PA-MIG-11), domicilio normalizado (PA-MIG-12). Perfil de anonimización completo. Sin ningún documento → `identificationStatus = documentPending` con tarea de regularización (RN-MIG-058, DEC-099). Padrón base para vincular los maestros de rol (RN-MIG-014, DEC-097). |
| §1 | `PERSONAS_EXTRAS` | Datos laborales extra de la persona | `persons.employmentInfo` | M01 | O2 | Migrar vivo | Integra `*_EXTRAS` (RN-MIG-011). |
| §1 | `PROPIEDA` | Inmueble/catastro de la cuenta | `premises` (nombre canónico de M01 §7 y T05 COL-PER-08; antes `properties`) | M01 | O2 | Migrar vivo | 100 columnas: domicilio de servicio y postal (`PDOM_*`), catastro (`DISTRITO_SECCION`), uso (`premises.usageId` → ítem de `premiseUsages`, ver `USOINM`) y estado (catálogo `premiseStates` de M01 §7.18 en `enumerationItems` de T04). |
| §1 | `PTRAMITES` | Trámites iniciados por socio/cuenta | `requests` | M09 | O2 | Migrar vivo | Abiertos vivos; cerrados histórico tipado. `ID_AC_TRA` no se ejecuta (RN-MIG-048). |
| §1 | `RUBCAPI` | Rubros de capital con cuenta contable | `capitalItems` | M17 | O10 | Migrar vivo | Destino corregido (HUECO-CAP-03; antes `capitalCategories`): rubros de M17 §7.5. `COD_CTA` → `entityAccountAssignments` de M15 con `entityType: capitalRubric` (CTR-DAT-57; antes `chartOfAccounts`); `COD_RUB` → rubros de productos de M02 (cada rubro de producto en un solo `capitalItem`). |
| §1 | `SERSOC` | Servicio de una cuenta | `serviceContracts` | M02 | O2 | Migrar vivo | Dueño corregido: el contrato es de M02 (DEC-011, DEC-012, HUECO-TRV-06; antes "M01"). 118 columnas; categoría (M02), estado §39.5 (RN-MIG-017), medidor (M03), grupo de facturación (M05), `ULT_FAC`. Activos y bajas con deuda/equipo vivos; bajas sin saldo histórico tipado. Contratos de plan de vivienda: RN-MIG-052. |
| §1 | `SERSOC_EXTRAS` | Datos extra del servicio (cuotas, unidades, generación distribuida) | `worksInstallmentPlans` (columnas `CNT_*`) + `serviceContracts.extras` (resto) | M04 / M02 | O7 / O2 | Migrar vivo | Dueño corregido a M02 para el contrato (HUECO-TRV-06). Columnas tarifarias `CNT_*` → plan de cuotas de obra de M04 (RN-TAR-071, HUECO-OBR-05, RN-MIG-053); en `extras` quedan solo atributos no tarifarios (`GIS`, `PORC_INST_BASICAS`, `PORC_INST_REDES` [VERIFICAR] y columnas no detalladas). `ALTA_GENERA`/`POTENCIA_GENERA` → contrato de generación distribuida (M03, O7); `COD_PLA` → plan (M02). |
| §1 | `SERSOC_HST` | Historial de cambios del servicio | `serviceContracts` (versiones) | M02 | O2 | Histórico | Dueño corregido a M02 (HUECO-TRV-06). Versiones con `validFrom/validTo` (RN-MIG-010). |
| §1 | `SERSOC_PRODUCTOS` | Productos entregados en comodato con un servicio | `loanedEquipment` (+ `orthopedicItems`/`orthopedicLoans` de M18 para el servicio de ortopedia) | M13 / M18 | O3 / O10 | Migrar vivo | Sin devolución → vivo; `COD_PTH` → `serializedUnits` (RN-MIG-035); devueltos histórico tipado. Las filas cuyo servicio sea el banco ortopédico (mapa de valores de servicios; `PROD_SER.PRE_ATRASO` y V2 3134 cobran el atraso en la devolución) se cargan como préstamos de M18 con `FECHA_ENTREGA` → `startDate`, `FECHA_DEVOLUCION` → `dueDate`, `FECHA_DEVUELTO` → `returnedAt` (HUECO-OTR-01, §19.33) [VERIFICAR] con datos. |
| §1 | `SOCIOS` | Titulares/socios | `holders` (+ `associateMemberships` y `membershipEvents` en M17; antes "`members` en M17") | M01 | O2 | Migrar vivo | Condición de asociado → `associateMemberships` con `legalEntityId` obligatorio: `SOCIOS` no tiene empresa, así que toda membresía se asigna a la entidad jurídica por defecto (`legalEntities.isDefault = true`, la que sale de la empresa principal de `EMPRESAS`, T04 RF-CFG-142) salvo que la cooperativa indique, por lista o por regla (por ejemplo, socios de servicios de la mutual), otra entidad; una persona puede terminar con una membresía por entidad (RN-MIG-002, DEC-096; M17 §19). `COD_SOC` → `holderNumber` cargado manualmente: es el único caso en que se admite número de titular manual (DEC-017); la secuencia única del tenant arranca después del máximo migrado. N° de socio/NIP como identificador externo (RN-MIG-015); `ACTA`, `CAU_BAJA`; condición asociado → M17. La clave web del socio se suprime en la extracción y no se migra; el acceso al portal se rehabilita por invitación (RN-MIG-013, DEC-103; PA-MIG-07). |
| §1 | `SUMSOC` | Cuentas/suministros | `accounts` | M01 | O2 | Migrar vivo | 71 columnas; columnas de débito (`DEB_TARJ`, `NUM_TARJ`…) → `directDebitMandates` de M07 sin el número de tarjeta (RN-MIG-056); zona/sector/recorrido → `readingRoutes` (M03, RN-MIG-018); `COD_SIT` → RN-MIG-016; número visible conservado (RN-MIG-050); `COD_SUM` como texto (ESC-MIG-04). |
| §1 | `SUMSOC_EXTRAS` | Mail/teléfono web, débito Pagos360, ficha, redondeo | `accounts` (contacto y adhesiones) | M01 | O2 | Migrar vivo | `DEBITO_360_*` → adhesión de débito (M07); `DEBITO_360_ID` es el `cardToken` o `externalId` de la adhesión (RN-MIG-056). |
| §1 | `SUMSOC_HST` | Historial de cambios de la cuenta | `accounts` (versiones) | M01 | O2 | Histórico | Versiones (RN-MIG-010). |
| §1 | `TRAMITES` | Tipos de trámite | `requestTypes` | M09 | O2 | Migrar vivo | `COD_PLA` → plantilla (T09); `DIAS_VENCE` → SLA. |
| §1 | `TRAMITES_ACCIONES` | Acciones automáticas de trámites (script) | Reemplazado por acciones de workflow (T11) | T11 | O1 | No migrar | `SCRIPT_ACCION` nunca se ejecuta; se usa como inventario para reconfigurar (RN-MIG-048). |
| §1 | `TRANSFER` | Transferencias de servicios entre cuentas/titulares | `transfers` (M01, titularidad); filas de stock → `stockDocuments` (M13); filas de capital (`TIPO_TRA = 3`) → `capitalTransfers` (M17) | M01 / M13 / M17 | O2 (titularidad); O3 (stock); O10 (capital) | Histórico | Corregido (CTR-DAT-45): `TRANSFER` es homónimo y el cargador rutea cada fila por su discriminador de tipo; destino anterior `serviceTransfers` (M01), nombre que T05 no reconoce. Histórico tipado vinculado a contratos origen/destino. [VERIFICAR] valores del discriminador para stock en la base relevada. |
| §1 | `VIAINGTE` | Vías de ingreso de trámites | `crmChannels` (antes `intakeChannels`; CTR-DAT-77, COL-CRM-23) | M09 | O2 | Migrar vivo | `VALIDAR_CELULAR`/`VALIDAR_MAIL` → reglas del canal. |
| §1 | `VINCULOS` | Tipos de vínculo | `relationshipTypes` | T04 | O1 | Migrar vivo | Mapa de valores. |

### 19.2 Servicios, categorías y tarifas (CAT §2 — 48 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §2 | `ALTASEAU` | Altas automáticas de servicios | `autoServiceTemplates` | M02 | O2 | Migrar vivo | Reglas de alta por servicio/categoría/localidad/zona. |
| §2 | `ARTEFACTO` | Catálogo de artefactos declarables | `appliances` | M02 | O7 | Migrar vivo | Artefactos de gas y eléctricos. |
| §2 | `ARTEFSUMS` | Artefactos declarados en un servicio | `contractDeclaredAppliances` | M02 | O7 | Migrar vivo | Dueño M02 (COL-CAT-22 de T05; antes `declaredAppliances`). Vínculo al contrato de M02. M04 y M03 solo leen. |
| §2 | `CARGOS_ADICIONALES` | Cargos adicionales con fórmulas | `additionalCharges` | M04 | O7 | Migrar vivo | `FORMULA_FIL/CAN/BI/IMP` traducidas con revisión y prueba en paralelo (RN-MIG-048). |
| §2 | `CATE_SER` | Categorías tarifarias por servicio | `tariffCategories` | M02 | O2 | Migrar vivo | 96 columnas: IVA → M06, mínimos/tramas → M04, `COD_ENGAS`. |
| §2 | `CATE_SER_COEFICIENTES` | Coeficientes por categoría y fecha | `categoryCoefficients` | M04 | O4 | Migrar vivo | Con vigencia `FEC_COEF`. |
| §2 | `CATE_SER_EXTRAS` | Extras de categorías (Mikrotik, generación, viviendas) | `tariffCategories.extras` | M02 | O2 | Migrar vivo | `PERFIL_MIKROTIK` → M10 (O3); `VIV_*` → M18 (O10); `TIPO_PRESENTACION_ARBA` → M06. |
| §2 | `CATTARIF` | Escalones/precios de la tarifa vigente | `tariffRates` | M04 | O4 | Migrar vivo | Fijos en O4; escalones de servicios medidos (diurno/nocturno, rangos) en O7. |
| §2 | `CATTMC` | Variante de precios por cuadro (tabla de trabajo) | Reemplazado por borrador de versión tarifaria (M04) | M04 | O4 | No migrar | Tabla de trabajo; si hay un cuadro en preparación al corte, se recrea como borrador. |
| §2 | `CLASESER` | Clases de servicio con valores | `serviceClasses` | M02 | O2 | Migrar vivo | `VALOR1/2` → atributos tipados. Cada clase que represente una tasa (por ejemplo, tasa hospital) se clasifica con RN-MIG-051 y la regla RN-FIS-126/RF-FIS-163 de M06 (HUECO-TAS-03) antes de cargarse como concepto de terceros o tributo. |
| §2 | `CONCESIO` | Concesiones | `concessions` | T04 | O1 | Migrar vivo | Maestro. |
| §2 | `CONEXION` | Conceptos a facturar al conectar | `connectionCharges` | M02 | O3 | Migrar vivo | Prerrequisito del piloto (instalación). Precios → M04. |
| §2 | `CONE_BONIF` | Bonificaciones de conexión por cuenta | `connectionChargeWaivers` | M02 | O3 | Migrar vivo | Saldos de bonificación pendientes. |
| §2 | `CON_TASAS` | Conceptos y tasas aplicadas | `purchaseConcepts` (concepto de compra con tasa y columna del libro de compras) | M12 (antes M06 / M02) | O8 (antes O4) | Migrar vivo | **Resuelto con el relevamiento del código (HUECO-TAS-03):** la tabla solo se administra desde una pantalla del módulo Compras ("Administración de conceptos asociados a tasas": descripción, tasa y columna asignada) y ninguna regla de facturación la lee, así que no es un tributo de facturación y no pasa por RN-MIG-051; si el perfilado de F1 encontrara una fila referenciada desde facturación, esa fila se clasifica con RN-MIG-051 y se informa. Destino anterior: `taxes` (tasas) o concepto de terceros según RN-MIG-051 (M06 / M02, O4). Texto anterior: Consolidar con `IMPUESTO`. Cada fila se clasifica en tributo propio, tributo de terceros o concepto de terceros con RN-MIG-051 y la regla RN-FIS-126/RF-FIS-163 de M06 (HUECO-TAS-03). Hallazgo: en ProCoop la tabla se administra desde el módulo Compras ("Administración de conceptos asociados a tasas"; `COLUMNA` = columna asignada), por lo que puede ser una tabla de compras y no de facturación ~~[VERIFICAR] con M06/M12 antes de O4~~ (resuelto: es de Compras). |
| §2 | `CORREGAS` | Factores de corrección de gas por período | `gasCalorificFactors` | M04 | O7 | Migrar vivo | Corregido (HUE-GAS-03, DEC-085, CTR-DAT-33): dueño M04; antes `gasCorrectionFactors` de M03. Períodos abiertos + 13. |
| §2 | `CUADRI` | Catálogo de cuadros | `tariffSchedules` | M04 | O4 | Migrar vivo | Cabecera de cuadro. |
| §2 | `CUADROS` | Cuadros tarifarios con vigencia | `tariffScheduleVersions` | M04 | O4 | Migrar vivo | Vigentes y los de PRM-MIG-010 (24 meses) vivos; anteriores histórico (RN-MIG-005). |
| §2 | `DESCPOS` | Descuentos por servicio y categoría | `discountRules` | M04 | O4 | Migrar vivo | Prioridad conservada. |
| §2 | `ESTASER` | Estados de un servicio | `serviceStates` | M02 | O2 | Migrar vivo | Mapa al catálogo §39.5 (RN-MIG-017); `DESCONEC`. |
| §2 | `ESTINM` | Estados de inmueble | `premiseStates` (catálogo de M01 §7.18 en `enumerationItems` de T04; 10-11-2026, alineado con `USOINM` y el anexo dueño; antes `propertyStates`) | M01 (antes T04) | O2 (antes O1) | Migrar vivo | Maestro. |
| §2 | `FACTOR_CAL` | Factor de corrección por presión y temperatura (gas) | `gasCalorificFactors` | M04 | O7 | Migrar vivo | Corregido (HUE-GAS-03, DEC-085, CTR-DAT-33): dueño M04; antes `gasCorrectionFactors` de M03. Consolidar con `CORREGAS` por período y categoría. `SERSOC.COEF_CORRECTOR` sigue en M03 (`meteringPoints.gasCorrectionCoefficient`). |
| §2 | `FACT_EPEC` | Montos facturados por EPEC por cuenta y período | `supplierInvoices.wholesaleSupply` | M12 | O8 | Histórico | Corregido (CTR-DAT-75, HUE-ELE-01; RF-CMP-149): comprobante de proveedor mayorista de M12, con balance en `supplyBalances`; antes `energyPurchaseBills` de M04, O7 (colección que no se crea). M04 solo lee el dato (RN-TAR-227). Insumo de conciliación de compra de energía; tipado 24 meses (DEC-070). |
| §2 | `GRP_CAT` | Grupos de categorías (código ENARGAS) | `categoryGroups` | M02 | O2 | Migrar vivo | `COD_ENGAS` necesario para LAG (RN-11 §4). |
| §2 | `HIS_ARTEFSUMS` | Historial de artefactos declarados | `contractDeclaredAppliances` (versiones; antes `declaredAppliances`) | M02 | O7 | Histórico | Versiones. |
| §2 | `HIS_CARGOS_ADICIONALES` | Cargos adicionales por cuadro | `additionalCharges` (versiones) | M04 | O7 | Migrar vivo | Versiones dentro de PRM-MIG-010 vivas; anteriores histórico. |
| §2 | `HIS_CATE_SER` | Categorías vigentes en cada cuadro | `tariffCategories` (versiones por cuadro) | M04 | O4 | Migrar vivo | Idem. |
| §2 | `HIS_CATE_SER_EXTRAS` | Extras de categorías por cuadro | `tariffCategories` (versiones) | M04 | O4 | Migrar vivo | Idem. |
| §2 | `HIS_CATTARIF` | Precios/escalones por cuadro | `tariffRates` (versiones) | M04 | O4 | Migrar vivo | Idem; necesarios para refacturar períodos abiertos (ESC-05). |
| §2 | `HIS_IMPUESTO` | Impuestos y tasas por cuadro | `taxes` (versiones) | M06 | O4 | Migrar vivo | Idem. |
| §2 | `HIS_PROD_SER` | Productos y precios por cuadro | `productPrices` (versiones) | M04 | O4 | Migrar vivo | Idem. |
| §2 | `HIS_SERVICIO` | Configuración de servicios por cuadro | `services` (versiones) | M02 | O4 | Migrar vivo | Idem; 147 columnas. |
| §2 | `HIS_SERVICIO_EXTRAS` | Extras de servicios por cuadro | `services` (versiones) | M02 | O4 | Migrar vivo | Idem. |
| §2 | `HIS_TAR_ADHE` | Tarifas de adherentes por cuadro | `adherentRates` (versiones; nombre canónico COL-TAR-05, antes `dependentTariffs`) | M04 | O4 | Migrar vivo | Idem. |
| §2 | `IMPUESTO` | Impuestos y tasas a facturar | `taxes` | M06 | O4 | Migrar vivo | `ORIGEN`/organismo → terceros (M06); orden en factura → layout (M05). `ORIGEN` (0 otros, 1 municipal, 2 provincial, 3 nacional, 4 internos, según RN-03) es una de las entradas de la clasificación de RN-MIG-051, que aplica la regla RN-FIS-126/RF-FIS-163 de M06 (HUECO-TAS-03). |
| §2 | `IMPUESTOS_X_CAT` | Impuestos por servicio | `taxApplicability` | M06 | O4 | Migrar vivo | Productos/servicios. |
| §2 | `PRCAGAS` | Cálculo de consumo de gas prorrateado | `billableItems` (`pending`) | M05 | O4 | Migrar vivo | Corregido (CTR-DAT-38): las filas no facturadas migran como ítems facturables pendientes de M05 (`sourceType = gasProration`); las ya facturadas (con `COD_COM`/`NUM_COM`) quedan en `legacyRecords` dentro de la profundidad de DEC-070. Destino anterior: `gasProratedConsumptions` de M03, O7, histórico tipado 13 períodos (colección que M03 no declara). |
| §2 | `PROD_SER` | Productos y conceptos facturables | `products` | M02 | O2 | Migrar vivo | 90 columnas (DEC-104; antes "89 columnas"): precios → M04, stock → M13 (`STO_ACT` solo para conciliar), IVA → M06, rubro → `productCategories`. |
| §2 | `PROD_SER_REC_DES` | Recargos/descuentos automáticos por producto | `productSurchargeRules` | M04 | O4 | Migrar vivo | Condiciones (días de deuda, forma de pago). |
| §2 | `PROPIESER` | Propiedades de servicio (tensión, mínimos, cargo fijo) | `serviceProperties` | M02 | O7 | Migrar vivo | `TENSION_OCEBA` → reportes regulatorios (M06). |
| §2 | `RECARGOS` | Recargos/descuentos por servicio, categoría, ocupación o zona | `surchargeRules` | M04 | O4 | Migrar vivo | Rangos de consumo. |
| §2 | `REFEREN` | Referencias de ubicación | `locationReferences` | T04 | O1 | Migrar vivo | Maestro. |
| §2 | `SERVICIO` | Servicios que presta la cooperativa | `services` | M02 | O2 | Migrar vivo | 149 columnas; parámetros por servicio → PRM de servicio (T04). |
| §2 | `SERVICIO_EXTRAS` | Estados por defecto del servicio | `services` (estados por defecto) | M02 | O2 | Migrar vivo | `COD_EST_*`, `COD_TRAN_*` → transiciones (M10). |
| §2 | `TAR_ADHE` | Tarifas de adherentes por edad | `adherentRates` (nombre canónico COL-TAR-05, antes `dependentTariffs`) | M04 | O4 | Migrar vivo | Sepelio/salud (M18). |
| §2 | `TEMPMODIFBONIF` | Temporal de recálculo de bonificaciones | Descartar | M04 | O4 | No migrar | Tabla temporal (RN-MIG-046). |
| §2 | `TIPOLOTE` | Tipos de lote | `lotTypes` | M13 (antes T04; CTR-DAT-46) | O3 (antes O1) | Migrar vivo | Maestro. |
| §2 | `TIP_SERVI` | Tipos de servicio | `serviceTypes` | M02 | O2 | Migrar vivo | Maestro. |
| §2 | `USOINM` | Usos de inmueble | `premiseUsages` (catálogo de M01 §7.18, guardado en `enumerations`/`enumerationItems` de T04; T05 §7.5.1, CTR-DAT-12) (10-11-2026, DEC-102; antes `propertyUses`) | M01 (antes T04) | O2 (antes O1: se carga con los catálogos de M01, antes de `PROPIEDA`) | Migrar vivo | Maestro. Cada uso se carga con `code` y `name` de ProCoop y con la clase normalizada `usageClass` (`residential`, `commercial`, `industrial`, `rural`, `other`; M01 RF-PER-089), que M06 usa como condición opcional de la alícuota de IVA (DEC-102, desactivada por defecto). La clase no está en ProCoop: F1 propone una por descripción (por ejemplo "vivienda" → `residential`, "comercio" o "local" → `commercial`, "industria" → `industrial`, "rural" o "campo" → `rural`, el resto → `other`) y la cooperativa la confirma en la revisión de catálogos de F3; un uso sin clase confirmada se carga `other` con advertencia `PER-USAGE-CLASS-UNCONFIRMED`. |

### 19.3 Medición y consumos (CAT §3 — 24 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §3 | `AUDITORIA_TELEMEDICION` | Log de llamadas a APIs de telemedición | Descartar | M03 | O7 | No migrar | Log técnico; queda en archivo. |
| §3 | `CERESTAD` | Certificados/estados de lectura | `readingCertificateCodes` | M03 | O7 | Migrar vivo | Mapa de valores. |
| §3 | `CONNRUTA` | Rutas de lectura | `readingRoutes` | M03 | O7 | Migrar vivo | Conserva orden de lectura (RN-MIG-018). |
| §3 | `CONNZONA` | Zonas de cada ruta | `readingRoutes.zones` | M03 | O7 | Migrar vivo | Integra a la ruta. |
| §3 | `CONSUMOP` | Consumos propios de la cooperativa | `ownMeterReadings` | M03 | O7 | Migrar vivo | 13 períodos vivos; resto histórico (pérdidas, compra de energía). |
| §3 | `CONS_SER` | Lecturas y consumos por servicio y período | `readings` + `consumptions` | M03 | O7 | Migrar vivo | Período abierto + PRM-MIG-012 vivos; resto histórico tipado. Insumo del paralelo. |
| §3 | `CONS_SER_TESTIGO` | Lecturas de medidores testigo | `controlMeterReadings` | M03 | O7 | Histórico | Tipado 13 períodos. |
| §3 | `DISPOSI` | Medidores/dispositivos | `meters` | M03 | O7 | Migrar vivo | En depósito o instalados; prepago. |
| §3 | `DST_CONSUMO` | Distribución de consumo entre servicios | `consumptionDistributions` | M03 | O7 | Migrar vivo | Padre-hijos, porcentaje, tope. |
| §3 | `HISWORK` | Histórico de planillas de trabajo de lecturas | Histórico (legacyRecords) | M03 | O7 | Histórico | Trazabilidad de confirmaciones. |
| §3 | `HIS_MEDSOC` | Historial de cambios de medidor de un servicio | `meterInstallations` (cerradas) | M03 | O7 | Histórico | Tipado; necesario para auditoría de cambios de medidor. |
| §3 | `IMP_WORK` | Planilla de lecturas a importar | Descartar | M03 | O7 | No migrar | Tabla de trabajo; durante el paralelo se lee como delta (PA-MIG-03). |
| §3 | `LEC_MEDTEL` | Lecturas por sistema de telemedición y tipo de medidor | `telemetryRegisterMaps` | M03 | O7 | Migrar vivo | Mapeo de registros. |
| §3 | `MARMED` | Marcas de medidores | `meterBrands` | M03 | O7 | Migrar vivo | Maestro. |
| §3 | `MEDIDORP` | Medidores propios | `ownMeters` | M03 | O7 | Migrar vivo | Medición de frontera. |
| §3 | `MEDSOC` | Medidor instalado en un servicio | `meterInstallations` (vigentes) | M03 | O7 | Migrar vivo | Última lectura, factor, contratado (RN-MIG-020). |
| §3 | `MED_TESTIGO` | Medidores testigo | `controlMeters` | M03 | O7 | Migrar vivo | |
| §3 | `OBSESTAD` | Observaciones de lectura | `readingObservationCodes` | M03 | O7 | Migrar vivo | `GENERA_OT`/`COD_TRAN` → tipo de orden (M10). |
| §3 | `OBSMED` | Observaciones de medidor | `meterObservationCodes` | M03 | O7 | Migrar vivo | |
| §3 | `RESESTAD` | Resultados de lectura | `readingResultCodes` | M03 | O7 | Migrar vivo | |
| §3 | `SERSOC_DEMANDASXPERIODO` | Demanda de potencia por período | `demandRecords` | M03 | O7 | Migrar vivo | 13 períodos vivos. |
| §3 | `TELEMEDICION` | Sistemas de telemedición (URL, credenciales) | `telemetrySystems` + bóveda (T06) | M03 | O7 | Migrar vivo | Solo configuración no secreta; `USER_TEL`/`PASS_TEL` suprimidos y reingresados (RN-MIG-013). |
| §3 | `TELEMED_COMM` | Comandos remotos a medidores | `remoteMeterCommands` | M03 | O7 | Histórico | Tipado 24 meses. |
| §3 | `TIPMED` | Tipos de medidor | `meterTypes` | M03 | O7 | Migrar vivo | Prepago, telemedido, redondeo prepago. |

### 19.4 Facturación (CAT §4 — 35 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §4 | `ANTICIPOS` | Anticipos/pagos a cuenta | `creditBalances` | M07 | O5 | Migrar vivo | Con saldo vivo; aplicados histórico. Conciliar con pasivo. |
| §4 | `ANTIFACTU` | Aplicación de anticipos a facturas | `creditBalanceApplications` | M07 | O5 | Histórico | Tipado. |
| §4 | `ANUFAC` | Cabecera de facturas anuladas (tabla espejo) | `invoices` (estado `voided`) | M05 | O4 | Histórico | Reemplaza tabla espejo (RN-MIG-009); un solo documento con estado y reversión. |
| §4 | `ANUITEMSFAC` | Renglones de facturas anuladas | `invoices.lines` (de anuladas) | M05 | O4 | Histórico | Idem. |
| §4 | `ANUITEMSFAC_EXTRAS` | Coseno fi de renglones anulados | `invoices.lines` (de anuladas) | M05 | O4 | Histórico | Idem. |
| §4 | `CAUBLOQ` | Causas de bloqueo de comprobantes | `holdReasons` | M08 | O5 | Migrar vivo | Corregido (CTR-DAT-36): motivos de bloqueo de documento, cuenta o contrato en `holdReasons` de M08; antes `documentBlockReasons` de M05, O4. Maestro. |
| §4 | `CLASIFICACION_ITEMS` | Clasificación jerárquica de artículos | `itemClassifications` | M13 | O3 | Migrar vivo | Corregido (CTR-DAT-44): dueño M13 (antes `taxItemClassifications` de M06, O4); M05 y M06 la citan. Coeficiente MO. |
| §4 | `COMPROB` | Tipos de comprobante | `documentTypes` | M05 | O4 | Migrar vivo | Código ARCA → M06; leyendas → layout; `ULT_NUM` solo para conciliar (RN-MIG-028). |
| §4 | `COMPROBANTES_ADM` | Comprobantes administrativos por factura | Histórico (legacyRecords) | M05 | O4 | Histórico | Vinculados a la factura. |
| §4 | `CONJUNTO` | Conjuntos de facturación | `billingSets` | M05 | O4 | Migrar vivo | Agrupación de cuentas para facturar juntas. |
| §4 | `CREDITOS_NOAUTOMATICOS` | NC marcadas como no automáticas | `invoices.flags` | M05 | O4 | Histórico | Marca en el documento. |
| §4 | `FACTMES` | Corridas de facturación masiva | `billingRuns` (históricos) | M05 | O4 | Histórico | Insumo del paralelo (`procoopRunRef`). |
| §4 | `FACTMES_COMP` | Rango de comprobantes por corrida | `billingRuns.documentRanges` | M05 | O4 | Histórico | Idem. |
| §4 | `FACTMES_CTAS` | Cuentas por corrida | `billingRuns.accounts` | M05 | O4 | Histórico | Idem. |
| §4 | `FACTURAS` | Cabecera de comprobantes de servicios | `invoices` | M05 | O4 | Migrar vivo | Con saldo vivos (RN-MIG-006, PA-MIG-05); cancelados histórico tipado (DEC-070). `USUARIO` → alias/`priorMigration` (RN-MIG-034). Cuatro vencimientos con totales. |
| §4 | `FACTURAS_EXTRAS` | Moneda y cotización | `invoices.currency` | M05 | O4 | Migrar vivo | |
| §4 | `FAC_EXTRAS` | Códigos de barra, código Link, deuda, distrito | `invoices.paymentCodes` + `legacyKeyAliases` | M05 | O4 | Migrar vivo | Claves heredadas para cobro durante la transición (RF-MIG-047, RF-MIG-084). |
| §4 | `FAC_EXTRAS_ITEMS` | Ítems extra impresos | `invoices.printExtras` | M05 | O4 | Migrar vivo | |
| §4 | `GRUPOS_FACTURA` | Grupos de factura (servicios que salen juntos) | `billingGroups` | M05 | O4 | Migrar vivo | FAC-012 con validación fiscal (RF-MIG-038). |
| §4 | `GRUPOS_GRAFICO` | Grupos del gráfico de consumo | `invoiceLayouts.consumptionChartGroups` | M05 | O4 | Migrar vivo | |
| §4 | `HISBLOQ` | Historial de bloqueos de facturas | `documentHolds` (historial) | M08 | O5 | Histórico | Corregido (CTR-DAT-36): antes `documentBlocks` de M05, O4. Bloqueo vigente se toma del estado del comprobante. |
| §4 | `ITEMSFAC` | Renglones de factura | `invoices.lines` | M05 | O4 | Migrar vivo | De comprobantes vivos; de cancelados histórico. `COD_SER` → obligación por servicio (RN-MIG-007). |
| §4 | `ITEMSFAC_EXTRAS` | Coseno fi, penalización, cuadro aplicado | `invoices.lines` | M05 | O4 | Migrar vivo | `COD_CUA` → versión tarifaria aplicada. |
| §4 | `ITEMSORD` | Orden de impresión de ítems | `invoiceLayouts.lineOrder` | M05 | O4 | Migrar vivo | |
| §4 | `OB_FACT` | Observación libre de factura | `invoices.notes` | M05 | O4 | Migrar vivo | |
| §4 | `PARSERFA` | Parámetros de servicio por tipo de facturación | `billingCycles.serviceParams` | M05 | O4 | Migrar vivo | |
| §4 | `POSTALES` | Empresas de distribución postal | `postalCarriers` | M05 | O4 | Migrar vivo | |
| §4 | `PREPAGA` | Facturas prepagas de energía | `prepaidSales` | M05 | O7 | Migrar vivo | Conciliación del saldo prepago (RN-MIG-022). |
| §4 | `RELACION_COMP` | Relación entre comprobantes (NC/ND, anulaciones) | `documentLinks` | M05 | O4 | Migrar vivo | Necesario para NC sobre facturas migradas. |
| §4 | `SFACTME` | Servicios y período de cada corrida masiva | `billingRuns.services` | M05 | O4 | Histórico | |
| §4 | `SUMNOFAC` | Cuentas marcadas para no facturar | `blocks` (efecto no facturar) | M01 | O2 | Migrar vivo | Corregido (CTR-DAT-36): bloqueo de cuenta en `blocks` de M01 (absorbe `billingHolds` de M05); antes `billingExclusions` de M05, O4. Solo `ACTIVO`. |
| §4 | `TALONFAC` | Talones de pago de una factura | `paymentStubs` | M05 | O4 | Migrar vivo | Con saldo vivos; `NUMERO` → alias tipo 9 (RN-11 §2.3). |
| §4 | `TALONFAC_HST` | Historial de talones | `paymentStubs` (versiones) | M05 | O4 | Histórico | |
| §4 | `TIPO_FAC` | Tipos de facturación mensual por servicio | `billingCycles` | M05 | O4 | Migrar vivo | 57 columnas (DEC-104; antes "56 columnas"); `FECD_ULTFAC` → último período facturado. |
| §4 | `TIP_COMP` | Tipos de comprobante (agrupación) | `documentTypeGroups` | M05 | O4 | Migrar vivo | |

### 19.5 Fiscal / ARCA / impuestos (CAT §5 — 26 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §5 | `ACTAFIP` | Actividades ARCA por servicio | `economicActivities` | M06 | O4 | Migrar vivo | Validar contra nomenclador vigente. |
| §5 | `ALI_IBR` | Alícuotas de IIBB | `grossIncomeRates` | M06 | O4 | Migrar vivo | |
| §5 | `ALI_IBR_CF` | % IIBB por alícuota y situación | `grossIncomeRates.byCondition` | M06 | O4 | Migrar vivo | |
| §5 | `ALI_IBR_COMP` | Alícuotas IIBB por tipo de comprobante | `grossIncomeRates.byDocumentType` | M06 | O4 | Migrar vivo | |
| §5 | `ALI_IVA` | Alícuotas de IVA con cuentas contables | `vatRates` (tenant: cuentas) | M06 | O4 | Migrar vivo | Alícuota de catálogo de plataforma; cuentas → M15 (RN-MIG-044). |
| §5 | `ALI_IVA_CF` | % IVA y percepción por condición | `vatRates.byCondition` | M06 | O4 | Migrar vivo | |
| §5 | `CAT_RETG` | Escala de retenciones de Ganancias | Reemplazado por tabla normativa de plataforma | M06 | O8 | No migrar | Se usa solo para conciliar (RN-MIG-044). |
| §5 | `CESPAFIP` | CAEA/CESP por punto de venta y período | `caeaCodes` | M06 | O4 | Histórico | CAEA vigente al corte vivo si existe contingencia abierta. |
| §5 | `COMPPOS` | Numeración por punto de venta y comprobante | `fiscalNumbering` | M06 | O4 | Migrar vivo | Último número verificado contra ARCA (RN-MIG-028, PA-MIG-08); CAI/CAEA. |
| §5 | `CVPIIBB` | Código de Validación Provincial | `provincialValidationCodes` | M06 | O4 | Migrar vivo | Vigentes. |
| §5 | `ELECTRONICA_FC` | Facturas enviadas a ARCA (CAE) | `invoices.fiscalAuthorization` | M06 | O4 | Histórico | CAE/vencimiento en el comprobante; 0 pendientes al corte (RN-MIG-029). |
| §5 | `ELECTRONICA_IVA` | IVA informado a ARCA | `invoices.fiscalAuthorization.vat` | M06 | O4 | Histórico | |
| §5 | `ELECTRONICA_RELCOMP` | Comprobantes asociados informados | `invoices.fiscalAuthorization.related` | M06 | O4 | Histórico | |
| §5 | `ELECTRONICA_TRIB` | Otros tributos informados | `invoices.fiscalAuthorization.taxes` | M06 | O4 | Histórico | |
| §5 | `EMPAFIP` | Padrón de CUIT con situación ARCA | Reemplazado por consulta de padrón ARCA (M06) | M06 | O4 | No migrar | Se reconsulta (RN-MIG-045); usado para sanear CUIT. |
| §5 | `ENGAS_CANTMESES` | Cantidades por mes para ENARGAS | `regulatoryReports` (históricos) | M06 | O7 | Histórico | |
| §5 | `IIBB_LUA` | Padrón de IIBB con vigencia | Reemplazado por importación del padrón vigente (M06) | M06 | O4 | No migrar | RN-MIG-045. |
| §5 | `IVAVTA` | Libro IVA Ventas por alícuota | `vatSalesBook` | M06 | O4 | Histórico | Períodos declarados; control de conciliación de comprobantes históricos. |
| §5 | `PROD_SER_RET` | Retenciones por producto | `withholdingApplicability` | M06 | O8 | Migrar vivo | |
| §5 | `PTOVENTA` | Puntos de venta | `pointsOfSale` | M06 | O4 | Migrar vivo | `PAUSAR`. `SUC_COM` es el origen de las sucursales (`branches`, T04): los puntos de venta se cargan solo después de que la cooperativa confirme la lista de sucursales (RN-MIG-057, DEC-098). |
| §5 | `RETE_TIPO` | Tipos de retención | `withholdingTypes` | M06 | O8 | Migrar vivo | Mínimos y bases por tenant; régimen normativo de plataforma. |
| §5 | `RETE_TIPO_BASE` | Bases de tipos de retención | `withholdingTypes.bases` | M06 | O8 | Migrar vivo | |
| §5 | `RETS_TIPO` | Tipos de retenciones sufridas | `sufferedWithholdingTypes` | M06 | O5 | Migrar vivo | `CTA_CONT` → M15. |
| §5 | `RET_COM` | Retenciones practicadas a proveedores | `withholdingsIssued` | M06 | O8 | Migrar vivo | Período no declarado vivo; resto histórico. Conciliar con SICORE/SIRCAR. |
| §5 | `SITIBR` | Situaciones frente a IIBB | `grossIncomeConditions` | M06 | O4 | Migrar vivo | Mapa de valores. |
| §5 | `SITIVA` | Condiciones de IVA | `taxConditions` | M06 | O4 | Migrar vivo | Mapa a códigos ARCA; comprobante por defecto. |

### 19.6 Cobranza y caja (CAT §6 — 21 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §6 | `ANUIT_PAGSO` | Ítems de recibos anulados | `receipts.allocations` (anulados) | M07 | O5 | Histórico | Reemplaza tabla espejo (RN-MIG-009). |
| §6 | `ANUPAG_SOC` | Recibos anulados (cabecera) | `receipts` (estado `voided`) | M07 | O5 | Histórico | Idem. |
| §6 | `ANUPLAN_CAJ` | Movimientos de caja anulados | `cashMovements` (anulados) | M07 | O5 | Histórico | Idem. |
| §6 | `CAJAS` | Cajas por día (totales, apertura, cierre) | `cashSessions` | M07 | O5 | Histórico | Cajas abiertas al corte deben cerrarse en ProCoop (§9.9). |
| §6 | `CAJASJP` | Catálogo de cajas | `cashRegisters` | M07 | O5 | Migrar vivo | No es origen de sucursales (no tiene `SUC_COM`); cada caja toma la sucursal de su punto de venta y se carga después de la confirmación de sucursales (RN-MIG-057, DEC-098). |
| §6 | `CAJAS_QR` | QR por caja | `cashRegisters.qr` | M07 | O5 | Migrar vivo | Revalidar con el proveedor QR (T06). |
| §6 | `COBRANZA_LOG` | Log de eventos de cobranza | Histórico (legacyRecords) | M07 | O5 | Histórico | |
| §6 | `CUPONTAR` | Cupones de tarjeta | `cardVouchers` | M14 | O8 | Migrar vivo | No acreditados vivos; resto histórico. Incluida siempre en el escaneo previo de números de tarjeta (Luhn) y credenciales; una columna con número de tarjeta se suprime y solo migran marca y últimos 4 (RN-MIG-013, RN-MIG-056; DEC-103). |
| §6 | `DESCUENTO_CAJA` | Descuentos por pago en caja | `cashDiscountRules` | M07 | O5 | Migrar vivo | |
| §6 | `EFEC_OP` | Movimientos de efectivo (moneda local/extranjera) | `cashMovements.cash` | M07 | O5 | Histórico | |
| §6 | `ESQUEMAS_INFORMES_COBRANZAS` | Esquemas de informes de cobranzas | Reemplazado por vistas guardadas e informes (T10) | T10 | O11 | No migrar | Inventario de informes a reproducir. |
| §6 | `IT_PAGSO` | Ítems de recibos (qué cancela cada pago) | `receipts.allocations` | M07 | O5 | Histórico | Base del saldo por servicio (RN-MIG-008). |
| §6 | `PAG_SOC` | Recibos de cobranza | `receipts` | M07 | O5 | Histórico | Tipado dentro de la profundidad de DEC-070. |
| §6 | `PLAN_CAJ` | Planilla de caja | `cashMovements` | M07 | O5 | Histórico | |
| §6 | `RETENCIO` | Retenciones recibidas en cobranzas | `withholdingsSuffered` | M07 | O5 | Histórico | Período fiscal abierto vivo para compensar. |
| §6 | `TALONFAC_PAGO` | Relación talón ↔ recibo | `receipts.allocations.stubId` | M07 | O5 | Histórico | |
| §6 | `TARJETAS` | Tarjetas aceptadas | `paymentCards` | M07 | O5 | Migrar vivo | Comercio y presentación. |
| §6 | `TARJETAS_RECARGO` | Recargos por cuotas con tarjeta | `paymentCards.installmentSurcharges` | M07 | O5 | Migrar vivo | |
| §6 | `TIP_VAL` | Tipos de valores (medios de pago) | `paymentMethods` | M07 | O5 | Migrar vivo | `CTA_CONTA` → M15. |
| §6 | `TRAN_OP` | Transferencias recibidas en caja | `cashMovements.transfers` | M07 | O5 | Histórico | No conciliadas → M14 vivas. |
| §6 | `VALORES` | Cheques de terceros recibidos | `thirdPartyChecks` | M14 | O8 | Migrar vivo | En cartera vivos (RF-MIG-055); depositados/rechazados histórico. |

### 19.7 Entes recaudadores y pagos electrónicos (CAT §7 — 13 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §7 | `BANCOS` | Entes de cobranza externos | `collectionAgents` | M07 | O5 | Migrar vivo | `COD_ARC`/`COD_ARC2` → adaptadores (T06); convenios; credenciales a bóveda. |
| §7 | `CANALES_PAGOS` | Canales de pago electrónico (APIs) | Reemplazado por pasarelas configuradas (M07/T06) | M07 | O5 | No migrar | Se reconfiguran; inventario. |
| §7 | `DEBITO_EXCLUSION` | Cuentas excluidas del débito | `directDebitExclusions` | M07 | O5 | Migrar vivo | |
| §7 | `DEUDARED` | Deuda publicada a la red por cuenta | `agencyPublishedDebts` | M07 | O5 | Migrar vivo | Corregido (CTR-DAT-42, COL-COB-26; antes `accounts.networkPublication`, "Parámetro por cuenta"). El saldo de redondeo de RN-01 §15 no se toma de esta tabla: lo recalcula M04 en `roundingCarryEntries`. [VERIFICAR] en la base de la cooperativa piloto si `DEUDARED` guarda también arrastres de redondeo; si los guarda, el cargador separa esas filas por `DEUDARED_TIPO` y las envía a `roundingCarryEntries` de M04. |
| §7 | `DEUDARED_TIPO` | Redondeo de deuda publicada | `agencyPublishedDebts` (tipo) | M07 | O5 | Migrar vivo | Corregido (CTR-DAT-42; antes `accounts.networkPublication.rounding`): discriminador de las filas de `DEUDARED`; las de arrastre de redondeo, si existen, van a `roundingCarryEntries` de M04. |
| §7 | `FACTURAS_TERCEROS` | Facturas de terceros cobradas | `thirdPartyCollections` | M06 | O5 | Migrar vivo | Sin rendir vivas; rendidas histórico. |
| §7 | `PAGOS360` | Solicitudes de pago Pagos360 | `paymentGatewayRequests` | M07 | O5 | Migrar vivo | Abiertas vivas (resolución por `ID_360` alias); resto histórico. |
| §7 | `PAGOS360_EXTRAS` | Metadata de solicitudes | `paymentGatewayRequests.metadata` | M07 | O5 | Histórico | |
| §7 | `PAGOS360_ITEMS` | Comprobantes de cada solicitud | `paymentGatewayRequests.items` | M07 | O5 | Migrar vivo | Idem `PAGOS360`. |
| §7 | `PAGOS360_PAGOS` | Pagos acreditados | `gatewayPayments` | M07 | O5 | Histórico | Comisiones → conciliación M14. |
| §7 | `RED_LINK` | Deuda publicada a Red Link | `networkDebtPublications` + `legacyKeyAliases` | M07 | O5 | Migrar vivo | Publicaciones vigentes vivas para doble padrón (RF-MIG-085); resto histórico. |
| §7 | `SIRO_BASEDEUDA` | Envíos de base de deuda a SIRO | `networkDebtPublications` (SIRO) | M07 | O5 | Histórico | |
| §7 | `TERCEROS` | Terceros por cuenta de quienes se cobra | `thirdPartyAgreements` | M06 | O5 | Migrar vivo | Comisión y forma de cálculo. |

### 19.8 Mora y notificaciones (CAT §8 — 17 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §8 | `CAUSAS` | Causas genéricas por tipo | `causes` | T04 | O1 | Migrar vivo | Mapa de valores por tipo (baja, corte). |
| §8 | `CIRCUCTA` | Circulares enviadas a una cuenta | Histórico (legacyRecords) | M08 | O6 | Histórico | |
| §8 | `CIRCULAR` | Modelos de circular | `messageTemplates` (mora) | T09 | O6 | Migrar vivo | Texto convertido a plantilla con variables mapeadas. |
| §8 | `COMPNOTI` | Comprobantes por lote de notificación | `delinquencyNotices.documents` | M08 | O6 | Migrar vivo | Abiertas vivas (código tipo 5, RN-MIG-027). |
| §8 | `CONCEPTOS_INT` | Conceptos sobre los que se calcula interés | `interestConcepts` | M08 | O6 | Migrar vivo | |
| §8 | `EXC_MORA` | Excepciones de mora por cuenta | `delinquencyExceptions` | M08 | O6 | Migrar vivo | Vigentes vivas (RN-MIG-026). |
| §8 | `INDICESMORA` | Índices de recargo por mora | `interestIndexes` | M08 | O6 | Migrar vivo | Todos los necesarios para recalcular deuda abierta (RN-MIG-023). |
| §8 | `INSTANCI` | Instancias de mora | `delinquencyInstances` | M08 | O6 | Migrar vivo | Candidatos, 1ª, 2ª. |
| §8 | `INT_DIFE` | Intereses diferidos | `deferredInterest` | M08 | O6 | Migrar vivo | Pendientes de facturar (RN-MIG-024). |
| §8 | `IT_PAGSO_INTERES` | Parámetros del interés en cada ítem cobrado | `receipts.allocations.interest` | M08 | O6 | Histórico | Insumo de comparación de mora en paralelo. |
| §8 | `IT_PAGSO_INTERES_TRAMAS` | Detalle del interés por tramo | `receipts.allocations.interest.brackets` | M08 | O6 | Histórico | Idem. |
| §8 | `MORATAS` | Tasas de mora con vigencia | `interestRates` | M08 | O6 | Migrar vivo | |
| §8 | `MORATAS_CATSER` | Categorías por tasa | `interestRates.categories` | M08 | O6 | Migrar vivo | |
| §8 | `MOROSO_TEMPORAL` | Temporal de morosos por lote | Descartar | M08 | O6 | No migrar | Temporal (RN-MIG-046). |
| §8 | `NOTIFICA` | Notificaciones de mora por socio | `delinquencyNotices` | M08 | O6 | Migrar vivo | No resueltas vivas; resueltas histórico; promesas de pago vigentes. |
| §8 | `TABMORA` | Tablas de recargo por mora | `interestRateTables` | M08 | O6 | Migrar vivo | |
| §8 | `TRAMASREC` | Tramos de recargo | `surchargeBrackets` | M08 | O6 | Migrar vivo | |

### 19.9 Financiación y convenios (CAT §9 — 6 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §9 | `DEUDAVTA` | Cuotas de deuda por ventas/financiaciones | `installmentReceivables` | M08 | O6 | Migrar vivo | Cuotas pendientes vivas con capital/interés; pagadas histórico. Ventas de productos (M11) referencian estas cuotas. |
| §9 | `FORMAPA` | Formas de pago (días) | `paymentTerms` | T04 | O1 | Migrar vivo | Usado por ventas y compras. |
| §9 | `IT_RECCO` | Ítems de convenios (comprobantes incluidos, cuotas) | `paymentPlans.items` | M08 | O6 | Migrar vivo | Vigentes (RN-MIG-025). |
| §9 | `PLAN_CUO` | Planes de cuotas/financiación | `financingPlans` | M08 | O6 | Migrar vivo | Tasas, mínimos, recargos. |
| §9 | `REC_CON` | Convenios de refinanciación | `paymentPlans` | M08 | O6 | Migrar vivo | Vigentes vivos; cancelados/caídos histórico. |
| §9 | `TIP_FIN` | Tipos de financiación (fórmula) | `financingPlans.calculationMethod` | M08 | O6 | Migrar vivo | `FOR_CAL` traducida (RN-MIG-048). |

### 19.10 Técnica, reclamos y obras (CAT §10 — 38 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §10 | `AVL_REG` | Posiciones GPS de vehículos (AVL) | Histórico (legacyRecords) | M18 | O10 | Histórico | Solo si se requiere trazabilidad de viajes; volumen alto, candidata a archivo. |
| §10 | `CAT_INCI` | Categorías de incidencias/obras con cuentas | `workCategories` | M10 | O8 | Migrar vivo | `COD_CTA`/`COD_CTH` → M15; `COD_TRAN` → tipo de orden. |
| §10 | `CHOFERES` | Choferes | `drivers` | M18 | O10 | Migrar vivo | `personId` obligatorio: se vincula a la persona existente (por ejemplo, el empleado de `SU_EMPLEADOS`) o se crea con las reglas de unificación del padrón (RN-MIG-014, DEC-097); `DES_CHO` no se copia a la ficha. Sin documento → persona `documentPending` (RN-MIG-058, DEC-099). *Reemplazado (10-11-2026): "Vincular a `employees` (M16) si corresponde."* |
| §10 | `CLAS_INC` | Clases de incidencias con numerador | `workClasses` | M10 | O8 | Migrar vivo | `ULT_NUM` → secuencia. |
| §10 | `EXPEDIENTES` | Expedientes técnicos (profesional, domicilio) | `technicalFiles` | M10 | O7 | Migrar vivo | Abiertos vivos; cerrados histórico. `COD_USER_MYSQL` → usuario del portal (M19). |
| §10 | `EXPEDIENTES_TRAM` | Etapas de expedientes | `technicalFiles.steps` | M10 | O7 | Migrar vivo | `ADJUNTO` → documentos (T11). |
| §10 | `FACTIBIL` | Solicitudes de factibilidad | `feasibilityRequests` | M10 | O3 | Migrar vivo | Abiertas vivas; resueltas histórico tipado. 57 columnas. |
| §10 | `FACTIBIL_NOTA` | Notas de factibilidades | `feasibilityRequests.notes` | M10 | O3 | Migrar vivo | De las abiertas; resto histórico. |
| §10 | `FALLAS` | Tipos de falla | `failureTypes` | M10 | O3 | Migrar vivo | Maestro. |
| §10 | `GRPOBRA` | Grupos de obras con cuentas | `workGroups` | M10 | O7 | Migrar vivo | Cuentas → M15. Ola alineada a O7 como M10 (RF-TEC-169) y M02 §6.C.9 (HUECO-OBR-04; antes O8). |
| §10 | `GRPTAREA` | Grupos de tareas | `taskGroups` | M10 | O3 | Migrar vivo | Maestro. |
| §10 | `MOVIL` | Vehículos | `vehicles` | M18 | O10 | Migrar vivo | Asignación a OT en O3 usa este maestro (se carga antes si la cooperativa lo usa en técnica). |
| §10 | `OBRAS` | Obras | `works` | M10 | O7 | Migrar vivo | Abiertas vivas; `OCULTAR`. Ola alineada a O7 como M10 (RF-TEC-168) y M02 §6.C.9 (HUECO-OBR-04; antes O8). Los planes de cuotas por obra de cada contrato salen de `SERSOC_EXTRAS.CNT_*` (RN-MIG-053). |
| §10 | `OT_REPORTE` | Reporte de impresión por tipo de OT | Reemplazado por plantillas de documento (T11) | T11 | O3 | No migrar | Inventario de formatos. |
| §10 | `PARTICUA` | Responsables por cuadrilla | `crews.members` | M10 | O3 | Migrar vivo | |
| §10 | `PARTIINC` | Participantes de incidencias | `works.participants` | M10 | O8 | Histórico | |
| §10 | `PARTIORD` | Horas de responsables en OT | `workOrders.laborHours` | M10 | O3 | Histórico | OT abiertas vivas; costos por hora. |
| §10 | `PROFESIO` | Profesionales/instaladores matriculados | `certifiedInstallers` (nombre del anexo dueño, M10 §7.22.27, y de T05 COL-TEC-26; 10-11-2026, antes `licensedProfessionals`) | M10 | O7 | Migrar vivo | Datos personales; anonimizar. Persona única (DEC-097, ampliada el 10-11-2026 a los instaladores): cada fila vincula una persona existente o la crea con las reglas de unificación del padrón (RN-MIG-014) y la ficha guarda `personId` obligatorio; nombre, documento, contactos y domicilio van a la persona de M01. *Reemplazado (10-11-2026): "Hoy M10 guarda en la ficha nombre, documento, contacto y domicilio propios (no está en el alcance de DEC-097 …); la carga sigue la ficha de M10."* |
| §10 | `RECLAMOS` | Reclamos de socios | `claims` | M09 | O2 | Migrar vivo | Abiertos vivos; cerrados histórico tipado. |
| §10 | `RECLAMOS_HIST` | Historial de estados de reclamos | `claims.statusHistory` | M09 | O2 | Histórico | |
| §10 | `RECLAMOS_NOTAS` | Notas de reclamos | `claims.notes` | M09 | O2 | Migrar vivo | De abiertos; resto histórico. |
| §10 | `RESOL_OT` | Resoluciones de OT | `workOrderResolutions` | M10 | O3 | Migrar vivo | Mapa de valores. |
| §10 | `RESPONSA` | Responsables/técnicos/cobradores | `fieldResources` (+ propuesta de `users` T02) | M10 | O3 | Migrar vivo | `PAS_RES` suprimido (RN-MIG-013). |
| §10 | `RESPONSA_NOTIFICA` | Notificaciones automáticas a responsables | `notificationRules` | T09 | O3 | Migrar vivo | Horarios, feriados, tipo de orden. |
| §10 | `RUB_REC` | Rubros de reclamos | `claimCategories` | M09 | O2 | Migrar vivo | `EMAIL` → destinatarios. |
| §10 | `TAREAS` | Tareas | `tasks` | M10 | O3 | Migrar vivo | Maestro. |
| §10 | `TAREASOM` | Tareas de OT por grupo y servicio | `tasks` (por grupo/servicio) | M10 | O3 | Migrar vivo | Consolidar con `TAREAS`. |
| §10 | `TAROTM` | Tareas por OT | `workOrders.tasks` | M10 | O3 | Migrar vivo | De OT abiertas; resto histórico. |
| §10 | `TECNGREXP` | Grupos de exportación de OT | Reemplazado por app de campo offline (M10/CNX §3.7) | M10 | O3 | No migrar | Mecanismo de exportación a colectoras. |
| §10 | `TECNICA` | Órdenes de trabajo | `workOrders` | M10 | O3 | Migrar vivo | 129 columnas; abiertas vivas; cerradas histórico tipado (DEC-070). `NEW_*` (cambios de domicilio) → payload. |
| §10 | `TECNICA_EXTRAS` | Extras de OT (daños, OCEBA) | `workOrders.damageClaim` | M10 | O3 | Migrar vivo | Reclamos por daños regulatorios (M06 O7). |
| §10 | `TECNICA_MOVIL` | Vehículos por OT | `workOrders.vehicles` | M10 | O3 | Histórico | |
| §10 | `TECNICA_NECESIDAD` | Materiales solicitados/autorizados/usados en OT | `workOrders.materials` | M10 | O3 | Migrar vivo | Pendientes de retiro/uso vivos; conciliar con stock (M13). |
| §10 | `TECNICA_NOTA` | Notas de OT | `workOrders.notes` | M10 | O3 | Migrar vivo | De abiertas; resto histórico. |
| §10 | `TECNOTEXP` | Estados exportados de OT | Reemplazado por app de campo offline | M10 | O3 | No migrar | |
| §10 | `TECNSEEXP` | Servicios por grupo de exportación | Reemplazado por app de campo offline | M10 | O3 | No migrar | |
| §10 | `TPTRAB` | Tipos de trabajo/orden | `workOrderTypes` | M10 | O3 | Migrar vivo | `REPORTE` → plantilla. |
| §10 | `TRANSAC` | Transacciones técnicas y efecto en estado del servicio | `workOrderTypes.transitions` | M10 | O3 | Migrar vivo | Efecto sobre estado §39.5; flags web/SMS/PMovil. |

### 19.11 Redes GIS (CAT §11 — 12 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §11 | `NIV_CAPA` | Capas de red por servicio (modelo antiguo) | `networkLayers` | M10 | O3 | Migrar vivo | Consolidar con `REDES_CAPAS` (PA-MIG-13). |
| §11 | `NIV_REDES` | Elementos de red con GPS (modelo antiguo) | `networkElements` | M10 | O3 | Migrar vivo | Idem; si `REDES_RED_INSTALADA` tiene datos, prevalece. |
| §11 | `NIV_SERV` | Niveles de red por servicio | `networkComponentTypes` | M10 | O3 | Migrar vivo | Idem. |
| §11 | `REDES` | Redes | `networks` | M10 | O3 | Migrar vivo | |
| §11 | `REDES_ATRIBUTOS` | Atributos de elementos instalados | `networkElements.attributes` | M10 | O3 | Migrar vivo | Tipados según componente. |
| §11 | `REDES_ATRIBUTOS_COMPONENTES` | Definición de atributos por componente | `networkComponentTypes.attributeDefs` | M10 | O3 | Migrar vivo | |
| §11 | `REDES_CAPAS` | Capas de cada red | `networkLayers` | M10 | O3 | Migrar vivo | |
| §11 | `REDES_COMPONENTES` | Tipos de componentes | `networkComponentTypes` | M10 | O3 | Migrar vivo | |
| §11 | `REDES_RED_INSTALADA` | Elementos instalados (jerarquía, GPS) | `networkElements` | M10 | O3 | Migrar vivo | Coordenadas validadas (§9.5). |
| §11 | `REDES_RELACIONES_COMPONENTES` | Relaciones permitidas | `networkComponentTypes.allowedChildren` | M10 | O3 | Migrar vivo | |
| §11 | `REDES_SERVICIOS` | Servicios por red | `networks.services` | M10 | O3 | Migrar vivo | |
| §11 | `SERSOC_REDES` | Conexión del servicio a elemento de red | `networkConnections` | M10 | O3 | Migrar vivo | Vigentes vivas; desconectadas histórico. |

### 19.12 Telefonía e internet (CAT §12 — 39 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §12 | `BANCLA` | Claves de tarifación por banda y tipo de llamada | `phoneRatingKeys` | M04 | O10 | Migrar vivo | Tasación de CDR. |
| §12 | `BANDAS` | Bandas horarias de tarifación | `phoneTimeBands` | M04 | O10 | Migrar vivo | |
| §12 | `CARACTER` | Características/bloques de numeración | `phoneNumberingBlocks` | M10 | O10 | Migrar vivo | |
| §12 | `CENTRALT` | Centrales telefónicas (modelo antiguo) | `phoneSwitches` | M10 | O10 | Migrar vivo | Consolidar con `TEL_CENTRAL` (RF-MIG-025). |
| §12 | `CLAVES` | Claves de tarifación | `phoneRatingKeys` | M04 | O10 | Migrar vivo | |
| §12 | `CORREOSINT` | Casillas de correo provistas a socios | `provisionedMailboxes` | M10 | O10 | Migrar vivo | `USER_PASS` suprimido; restablecer en proveedor. |
| §12 | `ENTRANTE` | Llamadas entrantes | `callRecords` (entrantes) | M10 | O10 | Histórico | Período no facturado vivo para tasar. |
| §12 | `GRATIS` | Números gratuitos | `phoneFreeNumbers` | M04 | O10 | Migrar vivo | |
| §12 | `INTERNAC` | Llamadas internacionales | `callRecords` | M10 | O10 | Histórico | Idem `ENTRANTE`. |
| §12 | `INTERNET` | Datos técnicos de internet (usuario, MAC, IP, nodo, OLT) | `internetProvisioning` | M10 | O3 | Migrar vivo | Piloto; `USER_PASS` suprimido y regenerado en Radius/MikroTik. |
| §12 | `LLAMADAS` | Llamadas tarifadas | `callRecords` | M10 | O10 | Histórico | Período no facturado vivo; insumo de paralelo de telefonía. |
| §12 | `LLA_CEL` | Llamadas a celulares (CPP) | `callRecords` (CPP) | M10 | O10 | Histórico | Idem. |
| §12 | `MIKROTIK` | Credenciales de routers MikroTik | `provisioningDevices` + bóveda (T06) | M10 | O3 | Migrar vivo | Solo IP/puerto/BMU; `USUARIO`/`CONTRASEÑA` a bóveda (RN-MIG-013). |
| §12 | `OPERADOR` | Operadores telefónicos | `phoneCarriers` | M10 | O10 | Migrar vivo | `COD_SUM` → cuenta del operador. |
| §12 | `PLANDES` | Planes de descuento telefónicos | `phoneDiscountPlans` | M04 | O10 | Migrar vivo | |
| §12 | `RECHAZOS` | Llamadas rechazadas | Histórico (legacyRecords) | M10 | O10 | Histórico | |
| §12 | `SERTEL` | Conceptos de servicios telefónicos | `phoneServiceConcepts` | M04 | O10 | Migrar vivo | `COD_PRO` → `products`. |
| §12 | `TARCLA` | Tarifas por clave | `phoneRates` | M04 | O10 | Migrar vivo | |
| §12 | `TARESP` | Tarifas especiales | `phoneRates.special` | M04 | O10 | Migrar vivo | |
| §12 | `TARTEL` | Tarifas telefónicas | `phoneTariffs` | M04 | O10 | Migrar vivo | |
| §12 | `TEL_CAJAS` | Cajas de distribución | `phonePlant` (cajas) | M10 | O10 | Migrar vivo | GPS. |
| §12 | `TEL_CENTRAL` | Centrales telefónicas | `phoneSwitches` | M10 | O10 | Migrar vivo | `ID_TEL` → integración; prevalece sobre `CENTRALT`. |
| §12 | `TEL_DSLAM` | Equipos DSLAM | `phonePlant` (DSLAM) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_FRACCIONES` | Fraccionamiento de tarifación | `callRecords.fractions` | M10 | O10 | Histórico | |
| §12 | `TEL_GRUPOS_REPARTIDOR` | Grupos de repartidor | `phonePlant` (grupos) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_MODALIDAD` | Modalidades telefónicas | `phoneModalities` | M10 | O10 | Migrar vivo | |
| §12 | `TEL_NUMEROS` | Numeración disponible/asignada | `phoneNumbers` | M10 | O10 | Migrar vivo | |
| §12 | `TEL_POS_REG_CAJA` | Posiciones de regleta en cajas | `phonePlant` (posiciones) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_POS_REG_GRUPOS` | Posiciones de regleta en grupos | `phonePlant` (posiciones) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_PREFIJO` | Prefijos | `phonePrefixes` | M10 | O10 | Migrar vivo | |
| §12 | `TEL_PUERTOS_CENTRAL` | Puertos de central | `phonePlant` (puertos) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_PUERTOS_DSLAM` | Puertos de DSLAM | `phonePlant` (puertos) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_REGLETAS_CAJAS` | Regletas de cajas | `phonePlant` (regletas) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_REGLETAS_GRUPOS` | Regletas de grupos | `phonePlant` (regletas) | M10 | O10 | Migrar vivo | |
| §12 | `TEL_REPARTIDOR` | Repartidores | `phonePlant` (repartidores) | M10 | O10 | Migrar vivo | GPS. |
| §12 | `TEL_SERSOC` | Número asignado a un servicio | `phoneLines` | M10 | O10 | Migrar vivo | Vigentes vivos; bajas histórico. |
| §12 | `TEL_SERVICIO` | Servicios telefónicos | `phoneServiceTypes` | M10 | O10 | Migrar vivo | |
| §12 | `TIPOBAN` | Tipos de banda | `phoneTimeBands.types` | M04 | O10 | Migrar vivo | |
| §12 | `TIPOLLAM` | Tipos de llamada | `phoneCallTypes` | M04 | O10 | Migrar vivo | |

### 19.13 Ventas de productos y presupuestos (CAT §13 — 13 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §13 | `COMP_VEN` | Comprobantes de venta de productos | `salesDocuments` | M11 | O8 | Migrar vivo | Con saldo vivos (cuotas en `installmentReceivables`); resto histórico tipado. |
| §13 | `COMP_VEN_RENDICION` | Rendición de viajes de una venta | `tripSettlements` (`source.kind = salesDocument`) | M18 | O8 (antes O10; COL-SOC-50) | Histórico | `ID_COMPV` → comprobante de venta de M11; canónica, absorbe `freightSettlements` de M11 (CTR-DAT-53). |
| §13 | `COMP_VEN_RENDICION_ITEMS` | Cargas de combustible de rendición | `tripSettlements.items` (antes `tripSettlements.fuel`, nombre de M18 §7) | M18 | O8 (antes O10) | Histórico | |
| §13 | `IT_COMPV` | Renglones de comprobantes de venta | `salesDocuments.lines` | M11 | O8 | Migrar vivo | `CAN_PEN` pendientes de entrega vivos. |
| §13 | `MAQUINAS` | Máquinas/equipos vendidos o en reparación | `equipmentUnits` | M13 | O8 | Migrar vivo | En reparación vivos. |
| §13 | `OB_COMPV` | Observaciones y transporte de ventas | `salesDocuments.shipping` | M11 | O8 | Migrar vivo | |
| §13 | `PRESUIT` | Renglones de presupuestos | `quotes.lines` | M11 | O8 | Migrar vivo | De presupuestos vigentes. |
| §13 | `PRESUIT_CONJUNTOS` | Conjuntos de presupuestos | `quotes.bundles` | M11 | O8 | Migrar vivo | |
| §13 | `PRESUPU` | Presupuestos | `quotes` | M11 | O8 | Migrar vivo | Vigentes vivos; presupuestos de conexión del piloto se cargan en O3 si existen. |
| §13 | `PRESUPU_COMPROBANTES` | Comprobantes generados desde presupuesto | `documentLinks` | M11 | O8 | Histórico | |
| §13 | `PRESUPU_CONDICION` | Condiciones de venta | `salesConditions` | M11 | O8 | Migrar vivo | |
| §13 | `PRESUPU_NOTAS` | Notas de presupuestos | `quotes.notes` | M11 | O8 | Migrar vivo | |
| §13 | `VENDEDOR` | Vendedores | `salesReps` (antes `salespeople`; nombre de M11 §7.9) | M11 | O8 | Migrar vivo | Datos personales; anonimizar. `personId` obligatorio: se vincula a la persona existente (titular, empleado o proveedor) o se crea con las reglas de unificación del padrón; nombre, domicilio y teléfonos van a la persona, no a la ficha (RN-MIG-014, DEC-097). Sin documento → `documentPending` (RN-MIG-058, DEC-099). |

### 19.14 Compras y proveedores (CAT §14 — 34 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §14 | `CMPORDE` | Relación OT ↔ comprobantes de venta | `documentLinks` | M11 | O8 | Histórico | |
| §14 | `COMBUSTIBLES` | Tipos de combustible | `fuelTypes` | M18 | O8 (antes O10; COL-SOC-48) | Migrar vivo | Canónica (CTR-DAT-54): no va a `purchaseLookups` de M12. |
| §14 | `COMPRAS_RELACION` | Cadena pedido → OC → remito → factura | `documentChains` | M12 | O8 | Migrar vivo | De documentos abiertos. |
| §14 | `COMP_COM` | Comprobantes de compra (remitos/cabecera) | `purchaseReceipts` | M12 | O8 | Migrar vivo | Pendientes de facturar vivos; resto histórico. |
| §14 | `CON_COM` | Conceptos de compra | `purchaseConcepts` | M12 | O8 | Migrar vivo | Rubro, IVA, IIBB. |
| §14 | `CON_COM_RET` | Retenciones por concepto | `purchaseConcepts.withholdings` | M12 | O8 | Migrar vivo | |
| §14 | `DESTINATARIO_SAPROV` | Destinatarios de solicitudes | `purchaseRequestRecipients` | M12 | O8 | Migrar vivo | |
| §14 | `FPALIC_IVA` | Alícuotas IVA de comprobantes de proveedores | `supplierInvoices.vat` | M12 | O8 | Migrar vivo | |
| §14 | `FPITEMS` | Renglones de comprobantes de proveedores | `supplierInvoices.lines` | M12 | O8 | Migrar vivo | |
| §14 | `IT_APROV` | Renglones de solicitudes de aprovisionamiento | `purchaseRequests.lines` | M12 | O8 | Migrar vivo | |
| §14 | `IT_COMPC` | Renglones de comprobantes de compra | `purchaseReceipts.lines` | M12 | O8 | Migrar vivo | |
| §14 | `IT_NPED` | Renglones de notas de pedido | `purchaseOrders.lines` (pedidos) | M12 | O8 | Migrar vivo | |
| §14 | `IT_SCOTIZ` | Renglones de cotización | `quotationRequests.lines` | M12 | O8 | Migrar vivo | |
| §14 | `IVACOM` | Comprobantes de proveedores (libro IVA compras) | `supplierInvoices` | M12 | O8 | Migrar vivo | Impagos vivos; pagados histórico; libro de períodos declarados histórico (M06). |
| §14 | `IVACOM_COMBUSTIBLES` | Combustible en compras | `fuelLoads` (con `purchaseInvoiceRef` al comprobante de M12) | M18 | O8 (antes O10; COL-SOC-49) | Histórico | Corregido: antes `supplierInvoices.fuel`, colección de M12 con dueño M18 inconsistente. |
| §14 | `IVACOM_WEB` | Comprobantes recibidos por la web | `supplierPortalSubmissions` | M12 | O8 | Migrar vivo | Pendientes de aprobación vivos. |
| §14 | `NPEDIDO` | Notas de pedido | `purchaseOrders` (pedidos) | M12 | O8 | Migrar vivo | Abiertas vivas. |
| §14 | `OBS_PRO` | Observaciones de proveedores | `suppliers.notes` | M12 | O8 | Migrar vivo | |
| §14 | `OCOMPRA` | Órdenes de compra | `purchaseOrders` | M12 | O8 | Migrar vivo | Abiertas vivas; cumplidas histórico. |
| §14 | `PREV_COM` | Previsiones de compras periódicas | `purchaseForecasts` | M12 | O8 | Migrar vivo | |
| §14 | `PROVEED` | Proveedores | `suppliers` | M12 | O8 | Migrar vivo | CUIT validado. `personId` obligatorio para todo proveedor, físico o jurídico: se vincula a la persona existente por CUIT o por el DNI contenido en la CUIT (M01 RN-PER-011) o se crea con las reglas de unificación del padrón; un socio contratista queda con una sola persona y dos roles; dos `PROVEED` con la misma CUIT van a la misma persona y se informan para unificar la ficha (RN-MIG-014, DEC-097; M12 §19). *Reemplazado (10-11-2026): "persona en `persons` (M01) cuando es física."* |
| §14 | `PROVEED_AUT` | Personas autorizadas del proveedor | `suppliers.authorizedPersons` | M12 | O8 | Migrar vivo | Vigentes. |
| §14 | `PROVEED_CBU` | CBU de proveedores | `suppliers.bankAccounts` | M12 | O8 | Migrar vivo | Dato sensible; enmascarado en informes. |
| §14 | `PROVEED_RET` | Retenciones por proveedor | `suppliers.withholdings` | M12 | O8 | Migrar vivo | |
| §14 | `PROVEED_TIPPROD` | Tipos de producto por proveedor | `suppliers.productTypes` | M12 | O8 | Migrar vivo | |
| §14 | `PROVEED_VALORACIONES` | Evaluaciones de proveedores | `supplierEvaluations` | M12 | O8 | Histórico | |
| §14 | `PROVSUM` | Relación proveedor-cuenta | `suppliers.accountLinks` | M12 | O8 | Migrar vivo | Compensación proveedor-socio. |
| §14 | `RPSPROV` | Rubros de proveedores (padrón) | `supplierCategories` | M12 | O8 | Migrar vivo | Consolidar con `RUBPROV`. |
| §14 | `RPSXPROV` | Rubros por proveedor (padrón) | `suppliers.categories` | M12 | O8 | Migrar vivo | |
| §14 | `RUBPROV` | Rubros con banco y pago diferido | `supplierCategories` | M12 | O8 | Migrar vivo | |
| §14 | `RUBXPRO` | Rubros asignados | `suppliers.categories` | M12 | O8 | Migrar vivo | Consolidar con `RPSXPROV`. |
| §14 | `SAPROV` | Solicitudes de aprovisionamiento | `purchaseRequests` | M12 | O8 | Migrar vivo | Abiertas vivas; autorizaciones pendientes → T11. |
| §14 | `SCOTIZ` | Solicitudes de cotización | `quotationRequests` | M12 | O8 | Migrar vivo | Vigentes vivas. |
| §14 | `UNIDADES_GASTOS` | Unidades de gasto | `expenseUnits` | M13 (antes M12; CTR-DAT-54) | O8 | Migrar vivo | Canónica de M13; no va a `purchaseLookups`. |

### 19.15 Stock, bienes de uso y fabricación (CAT §15 — 38 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §15 | `BIENES_USO` | Bienes de uso | `fixedAssets` | M13 | O8 | Migrar vivo | Valor de origen, vida útil, amortización acumulada al corte. |
| §15 | `BIENES_USO_AMORT` | Amortizaciones calculadas (ajuste por inflación) | `depreciations` | M13 | O8 | Histórico | Acumulado del ejercicio en curso vivo como saldo. |
| §15 | `BIENES_USO_CTSEC` | Bienes de uso por centro de costo | `fixedAssets.costAllocation` | M15 | O8 | Migrar vivo | |
| §15 | `BIENES_USO_DISM` | Disminuciones de valor | `fixedAssets.impairments` | M13 | O8 | Migrar vivo | |
| §15 | `BIENES_USO_HST` | Historial de bienes de uso | `fixedAssets` (versiones) | M13 | O8 | Histórico | |
| §15 | `COMBOS` | Productos que componen un combo | `products.bundle` | M02 | O2 | Migrar vivo | |
| §15 | `DEPAPROD` | Departamentos por producto | `productDepartments` | M13 | O8 | Migrar vivo | |
| §15 | `DEPOSITO` | Depósitos | `warehouses` | M13 | O3 | Migrar vivo | Prerrequisito de stock serializado del piloto. |
| §15 | `ESTADOS_RECEP` | Estados de recepción de equipos | `equipmentReceptionStates` | M13 | O8 | Migrar vivo | |
| §15 | `ETAFAB` | Etapas de fabricación | `manufacturingStages` | M13 | O10 | Migrar vivo | |
| §15 | `HIS_PRODFAB` | Historial de estructuras de fabricación | `billsOfMaterials` (versiones) | M13 | O10 | Histórico | |
| §15 | `HIS_PRODFAB_DIVISIONES` | Historial de divisiones | `billsOfMaterials.divisions` (versiones) | M13 | O10 | Histórico | |
| §15 | `ITRE_EST` | Estados de ítems en recepción | `equipmentReceptions.items.statusHistory` | M13 | O8 | Histórico | |
| §15 | `ITRE_PRO` | Productos de cada recepción | `equipmentReceptions.items` | M13 | O8 | Migrar vivo | De recepciones abiertas. |
| §15 | `IT_RETM` | Renglones de retiro de materiales | `materialWithdrawals.lines` | M13 | O8 | Migrar vivo | Pendientes (`SAL_CANTRO`) vivos. |
| §15 | `MOV_PRO` | Movimientos de stock | `stockMovements` | M13 | O8 | Histórico | Saldo por depósito/producto al corte como movimiento de apertura vivo (§9.8). |
| §15 | `MOV_PRO_EXTRAS` | Extras de movimientos (quién recibe) | `stockMovements.receivedBy` | M13 | O8 | Histórico | |
| §15 | `MOV_TRH` | Movimientos de productos serializados | `serializedUnits.movements` | M13 | O3 | Histórico | Ubicación vigente derivada al corte. |
| §15 | `OF_PARTE_COMPONENTE` | Componentes en partes de producción | `productionReports.components` | M13 | O10 | Migrar vivo | De partes abiertos. |
| §15 | `OF_PARTE_ITEM` | Ítems de partes de producción | `productionReports.items` | M13 | O10 | Migrar vivo | |
| §15 | `OF_PARTE_PRODUCCION` | Partes de producción | `productionReports` | M13 | O10 | Migrar vivo | Abiertos vivos. |
| §15 | `ORCOFAB` | Componentes de órdenes de fabricación | `manufacturingOrders.components` | M13 | O10 | Migrar vivo | |
| §15 | `ORDAFAB` | Avance por etapa | `manufacturingOrders.progress` | M13 | O10 | Migrar vivo | |
| §15 | `ORDEFAB` | Órdenes de fabricación | `manufacturingOrders` | M13 | O10 | Migrar vivo | Abiertas vivas. |
| §15 | `ORDEFAB_EXT` | Extensiones de plazo | `manufacturingOrders.extensions` | M13 | O10 | Migrar vivo | |
| §15 | `ORPRFAB` | Productos a producir por orden | `manufacturingOrders.outputs` | M13 | O10 | Migrar vivo | |
| §15 | `PRODFAB` | Estructura de productos (BOM) | `billsOfMaterials` | M13 | O10 | Migrar vivo | |
| §15 | `PRODFAB_DIVISIONES` | Divisiones de productos fabricados | `billsOfMaterials.divisions` | M13 | O10 | Migrar vivo | |
| §15 | `PRODPUES` | Productos por puesto/equipo | Descartar | M13 | O8 | No migrar | Uso no identificado [VERIFICAR]; si tiene datos con uso real, se reevalúa en F1. |
| §15 | `PROD_SER_UBICACION` | Ubicación de productos en depósito | `stockLocations.capacity` | M13 | O8 | Migrar vivo | |
| §15 | `PROD_TRH` | Unidades con número de serie | `serializedUnits` | M13 | O3 | Migrar vivo | Equipos del piloto (ONU, routers); en depósito o en comodato, nunca ambos (RN-MIG-035). |
| §15 | `RECEPCIONES` | Recepción de equipos de clientes | `equipmentReceptions` | M13 | O8 | Migrar vivo | Abiertas vivas. |
| §15 | `RETI_MAT` | Retiros de materiales | `materialWithdrawals` | M13 | O8 | Migrar vivo | Pendientes vivos; vinculados a OT (M10) y vivienda (M18). |
| §15 | `RMA_HISTORIAL` | Historial de RMA | `rmaCases.statusHistory` | M13 | O8 | Histórico | |
| §15 | `RMA_PRODUCTOS` | Devoluciones/reparaciones (RMA) | `rmaCases` | M13 | O8 | Migrar vivo | Abiertos vivos. |
| §15 | `RUB_PYS` | Rubros de productos/servicios (jerarquía, cuentas) | `productCategories` | M02 | O2 | Migrar vivo | Cuentas contables → M15 (O5); amortización → M13. |
| §15 | `TIP_PROD` | Tipos de producto | `productTypes` | M02 | O2 | Migrar vivo | |
| §15 | `UBICACIONES` | Ubicaciones dentro de depósitos | `stockLocations` | M13 | O3 | Migrar vivo | Jerarquía padre/hijo. |

### 19.16 Tesorería y bancos (CAT §16 — 23 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §16 | `BANKOS` | Cuentas bancarias propias | `bankAccounts` | M14 | O8 | Migrar vivo | Saldo al corte conciliado (§9.8). En O5 se carga la cuenta para conciliación de cobranzas. |
| §16 | `CAJAPAGO` | Caja de pagos a proveedores por día | `paymentDesks.sessions` | M14 | O8 | Histórico | Configuración de medios habilitados → parámetros. |
| §16 | `CATB_MOVS` | Categorías bancarias ↔ tipos de movimiento | `bankMovementCategories.links` | M14 | O8 | Migrar vivo | |
| §16 | `CAT_BANC` | Categorías de movimientos bancarios | `bankMovementCategories` | M14 | O8 | Migrar vivo | Cuenta contable → M15. |
| §16 | `CHEQUERAS` | Cheques propios emitidos | `ownChecks` | M14 | O8 | Migrar vivo | No debitados vivos; resto histórico. |
| §16 | `CONTES` | Conceptos de tesorería | `treasuryConcepts` | M14 | O8 | Migrar vivo | |
| §16 | `COT_DOL` | Cotizaciones por fecha | `exchangeRates` | T04 | O1 | Migrar vivo | Necesarias para documentos en moneda extranjera migrados. |
| §16 | `CTASUCE` | Cuentas de sucursales para recibir pagos | `bankAccounts.collectionAccounts` | M14 | O5 | Migrar vivo | CBU para cobranza por transferencia. |
| §16 | `ENTFIN` | Entidades financieras | `financialInstitutions` | M14 (antes `banks` de T04, O1) | O5 | Migrar vivo | Canónica COL-TES-01 para la entidad. Los planes de financiación de cada entidad (columnas de plan de `ENTFIN` y `TIP_FIN` cuando la fórmula es de una entidad financiera) van a `financingInstitutionPlans` de M08 (COL-MOR-27, O6) con `financialInstitutionId` (CTR-DAT-43; antes "absorbe `financialEntities` de M08"). Contrastar con padrón BCRA de plataforma. |
| §16 | `INTERBANKING` | Credenciales API Interbanking | Reemplazado por bóveda de credenciales (T06) | T06 | O8 | No migrar | Todas las columnas son secretos (RN-MIG-013). |
| §16 | `MOV_INTERBANKING` | Movimientos recibidos por Interbanking | `bankStatementLines` | M14 | O8 | Histórico | No conciliados vivos. |
| §16 | `PAGOTAR` | Liquidaciones de tarjetas | `cardSettlements` | M14 | O8 | Histórico | Pendientes de conciliar vivas. |
| §16 | `PPAGOS` | Órdenes de pago a proveedores | `paymentOrders` (cabecera, M12) + `paymentExecutions` (firma, entrega y medios, M14) | M12 / M14 | O8 | Histórico | Corregido (CTR-DAT-52; antes solo `paymentOrders` de M14). Pendientes de firma/entrega vivas. Discriminador: fila con `COD_PROV` informado → orden de pago a proveedor; si el perfilado de F1 encuentra filas de convenios con socios (sin proveedor y con cuenta de servicios), se rutean a `agreements` de M08 y se informa la cantidad. |
| §16 | `PPAGOS_FIRMANTES` | Firmantes autorizados | `treasuryAccountSigners` | M14 | O5 (antes O8; COL-TES-04) | Migrar vivo | Corregido (CTR-DAT-78): registro de firmantes vigentes por empresa y módulo (`COD_FRMTES`, `COD_EMP` → `legalEntityId`, `COD_MOD`, `FECHA_DESDE`, `FECHA_HASTA`), no la firma de un documento. `paymentOrderSigners` no se crea y la tabla no carga `signatureParticipants` de T11, que toma los firmantes vigentes de M14 al armar cada pedido de firma. Texto anterior: destino `paymentOrderSigners` (M14, O8); "Vigentes → reglas de autorización (T11). Destino pendiente de la decisión de T05 entre `signatureParticipants` (T11) y `treasuryAccountSigners` (M14); el cargador usa el nombre que fije T05." |
| §16 | `PPAGOS_FIRMAS` | Firmas de cada OP | `paymentExecutions` (firmas) y `signatureRequests` (T11) | M14 / T11 | O8 | Histórico | Corregido (CTR-DAT-52, COL-TES-35, COL-WFL-48; antes `paymentOrders.signatures` de M14). |
| §16 | `PPITEMS` | Comprobantes cancelados por OP | `paymentOrders.items` | M12 (antes M14; CTR-DAT-52) | O8 | Histórico | Base de saldo por proveedor. |
| §16 | `RESBAN` | Movimientos bancarios | `bankMovements` | M14 | O8 | Migrar vivo | No conciliados vivos; conciliados histórico. |
| §16 | `RESBAN_MOVINT` | Conciliación banco ↔ Interbanking | `bankReconciliations` | M14 | O8 | Histórico | |
| §16 | `SUCENT` | Sucursales de bancos | `banks.branches` | T04 | O1 | Migrar vivo | |
| §16 | `TESORE` | Movimientos de tesorería | `treasuryMovements` | M14 | O8 | Histórico | No conciliados vivos. |
| §16 | `TIP_MON` | Monedas y cotización | `currencies` | T04 | O1 | Migrar vivo | Mapa a ISO 4217. |
| §16 | `VAL_ESTA` | Estados de valores | `checkStates` | M14 | O8 | Migrar vivo | Mapa de valores. |
| §16 | `VAL_MVTO` | Movimientos de valores | `thirdPartyChecks.statusHistory` | M14 | O8 | Histórico | |

### 19.17 Contabilidad (CAT §17 — 24 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §17 | `CAT_INCI_CTSEC` | Categorías de incidencias por centro de costo | `costAllocationRules` | M15 | O8 | Migrar vivo | |
| §17 | `CIERRE` | Asientos de cierre de ejercicio | `journalEntries` (cierre) | M15 | O8 | Histórico | Ejercicios cerrados (PA-MIG-09). |
| §17 | `CTASIEN` | Asientos (cabecera) | `journalEntries` | M15 | O5 | Migrar vivo | Ejercicio en curso tipado; anteriores histórico (RN-MIG-036). |
| §17 | `CTCUENTA_ASIGNA` | Asignación de cuentas por tipo de facturación, zona y rubro | `postingRules` | M15 | O5 | Migrar vivo | Reglas iniciales del motor de asientos (DEC-009). |
| §17 | `CTEJER` | Ejercicios contables | `fiscalYears` | M15 | O5 | Migrar vivo | |
| §17 | `CTITASIE` | Renglones de asientos | `journalEntries.lines` | M15 | O5 | Migrar vivo | Idem `CTASIEN`. |
| §17 | `CTITASIE_SECCIONES` | Renglones por centro de costo | `journalEntries.lines.costCenters` | M15 | O5 | Migrar vivo | |
| §17 | `CTPLAN` | Plan de cuentas | `chartOfAccounts` | M15 | O5 | Migrar vivo | `SDO_CTA`/`SAL_ACT` solo para conciliar. |
| §17 | `CTPLAN_SUBRUBROS` | Subrubros del plan | `chartOfAccounts.subcategories` | M15 | O5 | Migrar vivo | |
| §17 | `CTRLCNC` | Control de conceptos/productos por tipo | `postingRules.productControls` | M15 | O5 | Migrar vivo | Uso a confirmar con datos [VERIFICAR]. |
| §17 | `CTSECCION` | Centros de costo | `costCenters` | M15 | O5 | Migrar vivo | Cada sección se crea con la entidad jurídica por defecto (`isDefault`) como dueña (`legalEntityId`) y compartida con todas las demás entidades del tenant (`sharedWithLegalEntityIds`), que conserva el comportamiento de ProCoop; la cooperativa puede restringirla o cambiar la dueña antes del primer asiento que la use (RN-MIG-002, DEC-096; M15 RF-CON-081, RN-CON-127). |
| §17 | `CTSECCION_ASIGNA` | Imputación a centros de costo | `costAllocationRules` | M15 | O5 | Migrar vivo | |
| §17 | `CTSECCION_GP_ASIGNA` | Centros de costo por grupo | `costCenterGroups.members` | M15 | O5 | Migrar vivo | |
| §17 | `CTSECCION_GRUPOS` | Grupos de centros de costo | `costCenterGroups` | M15 | O5 | Migrar vivo | |
| §17 | `CTSECC_X_CTA` | Centros habilitados por cuenta | `chartOfAccounts.allowedCostCenters` | M15 | O5 | Migrar vivo | |
| §17 | `CTSRUBROS` | Rubros contables | `accountCategories` | M15 | O5 | Migrar vivo | |
| §17 | `FPITEMS_CTSEC` | Renglones de compra por centro de costo | `supplierInvoices.lines.costCenters` | M15 | O8 | Migrar vivo | De comprobantes vivos. |
| §17 | `GRPOBRA_CTSEC` | Grupos de obra por centro de costo | `costAllocationRules` | M15 | O8 | Migrar vivo | |
| §17 | `GRU_CON` | Grupos contables de cobranza | `collectionAccountingGroups` + `entityAccountAssignments` (M15) (antes `postingRules` (cobranza); PA-COB-20) | M07 (antes M15) | O5 | Migrar vivo | Cuentas de caja, capital, intereses, IVA; el grupo va a M07 y sus cuentas a `entityAccountAssignments` de M15. |
| §17 | `INFLACIO` | Índices de inflación por mes | `economicIndexValues` | T04 (antes `inflationIndexes` de M15, O8; CTR-DAT-29) | O1 | Migrar vivo | Contrastar con serie oficial de plataforma. |
| §17 | `RESULTA` | Cuentas de resultados | `chartOfAccounts.resultMapping` | M15 | O8 | Migrar vivo | |
| §17 | `SECCION` | Secciones | `costCenters` | M15 | O5 | Migrar vivo | Consolidar con `CTSECCION` (RF-MIG-025). Mismo tratamiento de entidad: dueña la entidad por defecto y compartida con todas (RN-MIG-002, DEC-096; M15 RF-CON-081). |
| §17 | `SISCONT` | Operaciones del sistema con su cuenta (asientos automáticos) | `postingRules` | M15 | O5 | Migrar vivo | Inventario de eventos contables. |
| §17 | `TABINFL` | Tablas de índices de inflación | `economicIndexSeries` | T04 (antes `inflationIndexes.tables` de M15, O8; CTR-DAT-29) | O1 | Migrar vivo | |

### 19.18 Sueldos (CAT §18 — 56 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §18 | `SU_ACTIVIDADES` | Actividades (SICOSS) | Reemplazado por tabla normativa SICOSS de plataforma | M16 | O9 | No migrar | Mapa de valores para legajos (RN-MIG-044). |
| §18 | `SU_ANTIGUE` | Escala de antigüedad por categoría | `seniorityScales` | M16 | O9 | Migrar vivo | Convenio de la cooperativa. |
| §18 | `SU_ASIENTOS` | Configuración de asientos de sueldos | `postingRules` (sueldos) | M15 | O9 | Migrar vivo | Cuentas debe/haber por empresa, sindicato, categoría, centro. |
| §18 | `SU_AUDIT_TRA_INTERBANKING` | Transferencias de sueldos por Interbanking | Histórico (legacyRecords) | M16 | O9 | Histórico | JSON de envío/respuesta sin datos de autenticación. |
| §18 | `SU_BENEFICIOS_SICOSS` | Beneficios SICOSS | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Mapa de valores. |
| §18 | `SU_CARGO` | Cargos | `jobPositions` | M16 | O9 | Migrar vivo | |
| §18 | `SU_CATE` | Categorías salariales | `salaryCategories` | M16 | O9 | Migrar vivo | Básico vigente con vigencia. |
| §18 | `SU_CONCEPTOS` | Conceptos de liquidación con fórmulas | `payrollConcepts` | M16 | O9 | Migrar vivo | Fórmulas traducidas y verificadas por reliquidación (RN-MIG-048, §17.2). |
| §18 | `SU_CONCEPTO_TIPO` | Conceptos por tipo de recibo | `payrollConcepts.receiptTypes` | M16 | O9 | Migrar vivo | |
| §18 | `SU_CONDICION` | Condiciones SICOSS | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Mapa de valores. |
| §18 | `SU_CONTRATACION` | Modalidades de contratación | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Mapa de valores. |
| §18 | `SU_DEDUCCIONES` | Deducciones de Ganancias por mes | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Se usa para conciliar acumulados (RN-MIG-044). |
| §18 | `SU_DEDUCCIONES_ESPECIAL` | Deducción especial por sueldo promedio | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Idem. |
| §18 | `SU_DEDUCCIONES_TIPOS` | Tipos de deducción | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Idem. |
| §18 | `SU_DESVICULACION` | Motivos de desvinculación | `terminationReasons` | M16 | O9 | Migrar vivo | |
| §18 | `SU_DESVIC_EXTRAS` | Importes extra por desvinculación | `terminationReasons.extras` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EMPLEADOS` | Legajos | `employees` | M16 | O9 | Migrar vivo | Activos y egresados con liquidación pendiente vivos; resto histórico. Persona en `persons` (M01). |
| §18 | `SU_EMPLEADOS_DOCUMENTOS` | Documentación de empleados | `employees.documents` | M16 | O9 | Migrar vivo | Archivos al expediente (T11); vencimientos. |
| §18 | `SU_EMPLEADOS_SEC` | Empleados por centro de costo | `employees.costAllocation` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EMPLEADOS_SUMSOC` | Cuentas de servicio de empleados (descuentos) | `employees.serviceAccounts` | M16 | O9 | Migrar vivo | Sincronización en convivencia (§9.7). |
| §18 | `SU_EMPRESAS` | Empresas empleadoras | `legalEntities` (empleador) | T04 (antes T01; DEC-064, CTR-DAT-48) | O9 | Migrar vivo | Consolidar con `EMPRESAS` (RN-MIG-002). |
| §18 | `SU_EMP_CBU` | Cuentas bancarias de empleados | `employees.bankAccounts` | M16 | O9 | Migrar vivo | Dato sensible. |
| §18 | `SU_EMP_EXTRAS` | Importes extra por empleado | `employees.fixedExtras` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EMP_FAMILIARES` | Familiares a cargo | `employees.dependents` | M16 | O9 | Migrar vivo | Persona en `persons`; F.572. |
| §18 | `SU_EMP_FAMILIARES_EXTRAS` | Datos anuales de familiares | `employees.dependents.yearly` | M16 | O9 | Migrar vivo | Año en curso vivo. |
| §18 | `SU_EMP_HISCAT_EMP` | Historial de categorías del empleado | `employees` (versiones de categoría) | M16 | O9 | Histórico | |
| §18 | `SU_EMP_NOVEDADES` | Novedades de liquidación | `payrollNews` | M16 | O9 | Migrar vivo | Período abierto y cuotas de anticipos pendientes vivas. |
| §18 | `SU_EMP_OBS` | Observaciones de empleados | `employees.notes` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EMP_OPER` | Relación encargado-operario | `employees.supervisor` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EMP_TURNOS` | Turnos asignados | `employees.shifts` | M16 | O9 | Migrar vivo | Vigentes. |
| §18 | `SU_EXTRAS` | Conceptos extra | `payrollExtras` | M16 | O9 | Migrar vivo | |
| §18 | `SU_EXTRAS_GRUPOS` | Grupos de conceptos extra | `payrollExtras.groups` | M16 | O9 | Migrar vivo | |
| §18 | `SU_GRUPO_GRAFICO` | Grupos para gráficos | Reemplazado por tableros (T10) | T10 | O11 | No migrar | |
| §18 | `SU_HORAS_LECTOR` | Fichadas de reloj | `timeClockPunches` | M16 | O9 | Histórico | No procesadas del período abierto vivas. |
| §18 | `SU_LICENCIAS` | Licencias | `leaves` | M16 | O9 | Migrar vivo | Vigentes/futuras y saldo de vacaciones vivos; resto histórico. |
| §18 | `SU_LICENCIAS_CAUSAS` | Causas de licencia | `leaveTypes` | M16 | O9 | Migrar vivo | |
| §18 | `SU_NOTIFICACIONES` | Notificaciones a empleados (recibos, firma) | `employeeNotifications` | M16 | O9 | Histórico | Firma de recibos → expediente (T11). |
| §18 | `SU_OBRA` | Obras sociales | `healthInsurers` | M16 | O9 | Migrar vivo | Códigos RNOS de plataforma; porcentajes del tenant. |
| §18 | `SU_SALARIO_MINIMO` | Salario mínimo vital y móvil | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | |
| §18 | `SU_SINDICATO` | Sindicatos | `unions` | M16 | O9 | Migrar vivo | Cuentas contables → M15. |
| §18 | `SU_SINIESTRADO` | Códigos de siniestrado | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | |
| §18 | `SU_SITUACION_REVISTA` | Situaciones de revista | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Mapa de valores. |
| §18 | `SU_SIT_REVISTA_EMPLEADO` | Situación de revista de cada empleado | `employees.employmentStatus` | M16 | O9 | Migrar vivo | Versiones con vigencia. |
| §18 | `SU_SUELDOS` | Recibos de sueldo (cabecera) | `payslips` | M16 | O9 | Migrar vivo | Año fiscal y semestre en curso vivos (SAC, Ganancias); PRM-MIG-013 tipados; resto histórico (RN-MIG-037). |
| §18 | `SU_SUELDOSIT` | Conceptos de cada recibo | `payslips.lines` | M16 | O9 | Migrar vivo | Idem. |
| §18 | `SU_SUELDOS_DETGAN` | Detalle de Ganancias por recibo | `payslips.incomeTax` | M16 | O9 | Migrar vivo | Idem; acumulados anuales. |
| §18 | `SU_TAREAS_EXTRAS` | Tareas extra a pagar (lecturas, cortes) | `payrollPieceWork` | M16 | O9 | Migrar vivo | Período abierto vivo. |
| §18 | `SU_TAREAS_EXTRAS_EMPLEADOS` | Tareas extra por empleado | `payrollPieceWork.employees` | M16 | O9 | Migrar vivo | Idem. |
| §18 | `SU_TIPOEMPLEADOR` | Tipos de empleador | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | |
| §18 | `SU_TIPO_NOVEDADES` | Tipos de novedad (SIRADIG) | `payrollNewsTypes` | M16 | O9 | Migrar vivo | Códigos SIRADIG de plataforma. |
| §18 | `SU_TIPO_RECIBOS` | Tipos de recibo | `payslipTypes` | M16 | O9 | Migrar vivo | |
| §18 | `SU_TRAMAS` | Escalas de Ganancias | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | Conciliación (RN-MIG-044). |
| §18 | `SU_TRAMAS_TIPOS` | Tipos de escala | Reemplazado por tabla normativa de plataforma | M16 | O9 | No migrar | |
| §18 | `SU_TURNOS` | Turnos de trabajo | `shifts` | M16 | O9 | Migrar vivo | |
| §18 | `SU_TURNOSIT` | Horarios de cada turno | `shifts.schedule` | M16 | O9 | Migrar vivo | |
| §18 | `SU_VARIABLES` | Variables de liquidación con fórmula | `payrollVariables` | M16 | O9 | Migrar vivo | Fórmulas traducidas (RN-MIG-048). |

### 19.19 Planes de vivienda (CAT §19 — 11 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §19 | `PLANESVIV` | Planes de vivienda por categoría | `housingPlans` | M18 | O10 | Migrar vivo | Aportes mínimos/máximos. |
| §19 | `PRECIOSVIV` | Precios de vivienda por fecha | `housingPrices` | M18 | O10 | Migrar vivo | Destino corregido al nombre de M18 §7.6 (HUECO-VIV-02; antes `housingPlans.prices`). M18 es dueño de precios y mínimos y los expone a M04 por `billing-inputs` (API-SOC-006); M04 solo calcula y no recibe `PRECIOSVIV`. Una fila por tipología (`COD_CATSER`) y fecha, estado `approved`. |
| §19 | `VIVIENDAS` | Viviendas (inscripción, adjudicación, entrega) | `housingUnits` (+ contrato `serviceContracts` de M02) | M18 | O10 | Migrar vivo | Vinculadas a `serviceContracts` de M02: un contrato por vivienda con estado canónico según inscripción, adjudicación o entrega (RN-MIG-052, HUECO-VIV-03). |
| §19 | `VIV_ACTIVIDAD` | Actividades de construcción | `housingActivities` | M18 | O10 | Migrar vivo | |
| §19 | `VIV_ETAPA` | Etapas de construcción | `housingStages` | M18 | O10 | Migrar vivo | |
| §19 | `VIV_MAT` | Materiales entregados por vivienda | `housingMaterialAllocations` | M18 | O10 | Histórico | Saldo de materiales comprometidos vivo. Nombre alineado con M18 §7.6 (coherencia de HUECO-VIV-02; antes `housingUnits.materials`). |
| §19 | `VIV_MATACT` | Materiales por actividad | `housingActivityMaterials` | M18 | O10 | Migrar vivo | Nombre alineado con M18 §7.6 (antes `housingActivities.materials`). |
| §19 | `VIV_PROGMAT` | Materiales por avance | `housingProgressMaterials` | M18 | O10 | Histórico | Nombre alineado con M18 §7.6 (antes `housingProgress.materials`). |
| §19 | `VIV_PROGRESO` | Avance de obra por vivienda | `housingProgress` | M18 | O10 | Migrar vivo | Porcentaje vigente vivo; certificados vinculados a compras. |
| §19 | `VIV_RETM` | Retiros de materiales para vivienda | `housingMaterialWithdrawals` (el movimiento de stock asociado lo migra M13 por `COD_MOV`) | M18 | O10 | Histórico | Pendientes vivos. Dueño y nombre alineados con M18 §7.6 y RF-SOC-101 (antes `materialWithdrawals` (vivienda), M13). |
| §19 | `VIV_RET_IT` | Ítems de retiro para vivienda | `housingMaterialWithdrawals.items` | M18 | O10 | Histórico | Antes `materialWithdrawals.lines`, M13. |

### 19.20 Ambulancias / salud (CAT §20 — 5 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §20 | `AMBUCARACTE` | Características de traslados | `tripCharacteristics` | M18 | O10 | Migrar vivo | Nombre de M18 §7.3 (HUECO-SAL-02; antes `ambulanceTripFeatures`). `COD_CAR` → `code`, `DES_CAR` → `name`; la característica "no sanitario" (RF-SOC-076) se crea en la precarga, no viene de ProCoop. |
| §20 | `AMBULANC` | Traslados en ambulancia | `transportTrips` (`kind = sanitary`) + `tripLegs` | M18 | O10 | Histórico | Nombre de M18 §7.3 (HUECO-SAL-02; antes `ambulanceTrips`). `COD_AMB_ORIG` → `parentTripId`; `COD_BEN` → `serviceBeneficiaries` (`BENSOC`). Datos de salud: cifrado de campo y acceso restringido (RN-MIG-038, PA-MIG-19); pendientes de facturar vivos. |
| §20 | `AMBUMED` | Médicos por traslado | `transportTrips.professionalIds` | M18 | O10 | Histórico | Idem (HUECO-SAL-02; antes `ambulanceTrips.physicians`). |
| §20 | `ESPE_MED` | Especialidades médicas | `medicalSpecialties` | M18 | O10 | Migrar vivo | |
| §20 | `MEDICOS` | Médicos | `medicalProfessionals` | M18 | O10 | Migrar vivo | Nombre de M18 §7.2 (HUECO-SAL-02; antes `physicians`). `personId` obligatorio: se vincula a la persona existente o se crea con las reglas de unificación del padrón (RN-MIG-014, DEC-097); `DES_MED` no se copia a la ficha. Como `MEDICOS` no trae documento, la persona nueva queda `documentPending` (RN-MIG-058, DEC-099). |

### 19.21 Mesa de ayuda / tickets (CAT §21 — 14 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §21 | `TICKETS` | Tickets de mesa de ayuda/incidentes | `tickets` | M09 | O2 | Migrar vivo | Abiertos vivos; cerrados 12 meses histórico (PA-MIG-14). |
| §21 | `TICKETS_ASIGNACIONES` | Asignaciones | `tickets.assignments` | M09 | O2 | Histórico | Asignado vigente en el ticket. |
| §21 | `TICKETS_CONTACTOS` | Contactos de tickets | `tickets.contacts` | M09 | O2 | Migrar vivo | `CLAVE`/`ID_REMOTO` suprimidos (RN-MIG-013). |
| §21 | `TICKETS_ESTADOS` | Estados de tickets | `ticketStates` | M09 | O2 | Migrar vivo | Mapa al flujo de T11. |
| §21 | `TICKETS_EXTRAS` | Extras de tickets | `tickets.extras` | M09 | O2 | Migrar vivo | |
| §21 | `TICKETS_HSBONIF` | Horas bonificadas por venta | Descartar | M09 | O2 | No migrar | Uso propio del proveedor de software [VERIFICAR] (PA-MIG-14). |
| §21 | `TICKETS_MEDIOSATENCION` | Medios de atención | `crmChannels` (antes `intakeChannels`; CTR-DAT-77) | M09 | O2 | Migrar vivo | Consolidar con `VIAINGTE`. |
| §21 | `TICKETS_MODULOS` | Módulos de tickets | `ticketCategories` | M09 | O2 | Migrar vivo | |
| §21 | `TICKETS_NOTAS` | Notas de tickets | `tickets.notes` | M09 | O2 | Migrar vivo | De abiertos; resto histórico. |
| §21 | `TICKETS_PROYECTO` | Proyectos de tickets | `ticketCategories` (nivel superior) | M09 | O2 | Migrar vivo | |
| §21 | `TICKETS_RESPONSABLES` | Responsables de tickets | `ticketQueues.members` | M09 | O2 | Migrar vivo | `BONIF_VENTA` descartado. |
| §21 | `TICKETS_SUBTIPOS` | Subtipos | `ticketTypes.subtypes` | M09 | O2 | Migrar vivo | Plantillas → T09. |
| §21 | `TICKETS_TIPOS` | Tipos | `ticketTypes` | M09 | O2 | Migrar vivo | |
| §21 | `TICKETS_TIPOSESTADOS` | Tipos de estado | `ticketStates.groups` | M09 | O2 | Migrar vivo | |

### 19.22 Turnero (CAT §22 — 7 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §22 | `TURNOS` | Turnos de atención | `queueTickets` | M09 | O10 | Histórico | Estadística; turnos del día no se migran. |
| §22 | `TURNOS_HISTORIAL` | Historial de turnos | Histórico (legacyRecords) | M09 | O10 | Histórico | |
| §22 | `TUR_AREAS` | Áreas del turnero | `serviceDeskAreas` | M09 | O10 | Migrar vivo | `IMAGEN` a almacenamiento. |
| §22 | `TUR_AREAS_USERS` | Usuarios por área | `serviceDeskAreas.users` | M09 | O10 | Migrar vivo | Vía `legacyIdMap` de usuarios. |
| §22 | `TUR_BOX` | Boxes de atención | `serviceDesks` | M09 | O10 | Migrar vivo | |
| §22 | `TUR_BOX_HISTORIAL` | Apertura/cierre de boxes | Histórico (legacyRecords) | M09 | O10 | Histórico | |
| §22 | `TUR_TIPO_BOX` | Tipos de box | `serviceDeskTypes` | M09 | O10 | Migrar vivo | |

### 19.23 Actividades y agenda (CAT §23 — 10 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §23 | `ACTIPREV` | Actividades previas/preventivas | `internalActivities.prerequisites` | M09 | O10 | Migrar vivo | |
| §23 | `ACTIV` | Actividades programadas | `internalActivities` | M09 | O10 | Migrar vivo | Recurrentes y pendientes vivas. |
| §23 | `ACTIV_SEG` | Seguimiento de actividades | `internalActivities.occurrences` | M09 | O10 | Migrar vivo | Abiertas vivas; cerradas histórico. |
| §23 | `ACT_AREAS` | Áreas responsables | `activityAreas` | M09 | O10 | Migrar vivo | |
| §23 | `ACT_FREC` | Frecuencias | `activityFrequencies` | M09 | O10 | Migrar vivo | Convertidas a regla de recurrencia. |
| §23 | `ACT_RBR` | Rubros de actividades | `activityCategories` | M09 | O10 | Migrar vivo | |
| §23 | `ACT_TIPOS` | Tipos de actividad | `activityTypes` | M09 | O10 | Migrar vivo | Plantilla → T09. |
| §23 | `CALENDARIO` | Eventos de calendario de usuarios | `calendarEvents` | M09 | O10 | Migrar vivo | Futuros y recurrentes vivos; pasados histórico. |
| §23 | `CALENDARIO_TIPO` | Tipos de evento con color | `calendarEventTypes` | M09 | O10 | Migrar vivo | |
| §23 | `TIP_EVEN` | Tipos de evento | `calendarEventTypes` | M09 | O10 | Migrar vivo | Consolidar con `CALENDARIO_TIPO`. |

### 19.24 Institucional (CAT §24 — 7 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §24 | `ACTAS` | Actas del consejo con PDF y estado de firma | `minutes` | M17 | O10 | Migrar vivo | PDF a almacenamiento privado (T11); estado de firma. |
| §24 | `CAT_INAES` | Categorías INAES | `inaesCategories` | M17 | O10 | Migrar vivo | Contrastar con catálogo de plataforma. |
| §24 | `CONSEJO` | Integrantes del consejo | `boardMembers` | M17 | O10 | Migrar vivo | Documento → `persons`. |
| §24 | `REUNIONES` | Reuniones de consejo/asamblea | `meetings` | M17 | O10 | Migrar vivo | |
| §24 | `REUNIONES_ASIST` | Asistentes | `meetings.attendees` | M17 | O10 | Migrar vivo | |
| §24 | `REUNIONES_PERMISOS` | Permisos sobre reuniones | Reemplazado por alcance de permisos (T02) | T02 | O10 | No migrar | Propuesta de asignación de alcance. |
| §24 | `REUNIONES_TEMAS` | Temas del orden del día y resolución | `meetings.agenda` | M17 | O10 | Migrar vivo | |

### 19.25 Informes y tablero (CAT §25 — 12 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §25 | `ESTATAB` | Estados de indicadores del tablero | Reemplazado por umbrales de KPI (T10) | T10 | O11 | No migrar | |
| §25 | `GRAFTAB` | Gráficos del tablero por estado | Reemplazado por tableros (T10) | T10 | O11 | No migrar | |
| §25 | `GRUPTAB` | Grupos del tablero de control | Reemplazado por tableros (T10) | T10 | O11 | No migrar | |
| §25 | `GRUTAB` | Agrupaciones de tablas del tablero | Reemplazado por tableros (T10) | T10 | O11 | No migrar | |
| §25 | `INFOCTD` | Configuración de informes al ente regulador | `regulatoryReportConfigs` | M06 | O7 | Migrar vivo | Base del informe OCEBA/ENARGAS; validar contra salida de ProCoop en paralelo. |
| §25 | `INFOCTG` | Filas del informe regulatorio | `regulatoryReportConfigs.rows` | M06 | O7 | Migrar vivo | Tarifas y categorías vía `legacyIdMap`. |
| §25 | `INFOCTN` | Columnas del informe regulatorio | `regulatoryReportConfigs.columns` | M06 | O7 | Migrar vivo | Conceptos e impuestos vía `legacyIdMap`. |
| §25 | `INFO_SYS` | Catálogo de informes del sistema | Reemplazado por catálogo de reportes (§15) | T10 | O11 | No migrar | Inventario para verificar cobertura de reportes. |
| §25 | `TABLAS_POWERBI` | Tablas publicadas en Power BI | Reemplazado por exportación analítica (T10) | T10 | O11 | No migrar | Inventario de consumos externos. |
| §25 | `TABLERO` | Indicadores del tablero | `kpiDefinitions` | T10 | O11 | No migrar | Se redefinen; la definición sirve de insumo funcional. |
| §25 | `TENDTAB` | Valores históricos de indicadores | `kpiSnapshots` (histórico) | T10 | O11 | Histórico | Serie para tendencias. |
| §25 | `TIPO_TAB` | Tipos de indicador | Reemplazado por tableros (T10) | T10 | O11 | No migrar | |

### 19.26 Web / CoopOnline / APIs (CAT §26 — 8 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §26 | `REQUISITOS` | Trámites online y sus requisitos | `procedureTypes.requirements` | M09 | O2 | Migrar vivo | Las consultas SQL embebidas no se ejecutan ni migran (RN-MIG-013). |
| §26 | `REQUISITOS_ITEMS` | Campos de formularios de trámite | `procedureTypes.formFields` | M09 | O2 | Migrar vivo | Idem. |
| §26 | `RSSFEED` | Noticias RSS | Histórico (legacyRecords) | T09 | O2 | Histórico | |
| §26 | `WEB_LOG` | Log de sincronización con la web | Descartar | M19 | O2 | No migrar | La sincronización con el portal desaparece (CTR-MIG-12). |
| §26 | `WEB_NOVEDADES` | Novedades del portal | `portalNews` | T09 | O2 | Migrar vivo | Vigentes. |
| §26 | `WS_KEYS` | API keys de web services | Reemplazado por credenciales de integración (T06) en bóveda | T06 | O1 | No migrar | Secreto: no se lee ni copia (RN-MIG-013, CTR-MIG-08). |
| §26 | `WS_USERS` | Usuarios del portal/app | `users` (portal) | T02 | O2 | Migrar vivo | Sin contraseñas: invitación de activación (PA-MIG-07). |
| §26 | `WS_USERS_ACCOUNTS` | Cuentas vinculadas a usuarios web | `portalAccountLinks` | M19 | O2 | Migrar vivo | Vía `legacyIdMap` de cuentas y socios. |

### 19.27 Usuarios, seguridad y auditoría (CAT §27 — 20 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §27 | `AUDITO` | Ingresos/egresos de usuarios | `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) | T02 | O11 (antes O1) | Histórico | Retención según DEC-070. |
| §27 | `AUDITORIA` | Auditoría de cambios | `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) | T02 | O11 (antes O1) | Histórico | Sentencias SQL guardadas como texto, no ejecutables. |
| §27 | `AUDIT_IA` | Log de consultas a asistente de IA | `legacyAuditRecords` | T02 | O11 | Histórico | Corregido (CTR-DAT-04; antes "Descartar", O1, "No migrar"): migra como auditoría de solo lectura, con acceso restringido y auditado porque `COMANDO` y `RESPUESTA` pueden contener datos personales en texto libre; no alimenta `aiInvoiceExtractions` de M12. |
| §27 | `AUTORIZACIONES` | Solicitudes de autorización de operaciones | `approvalRequests` | T11 | O1 | Histórico | Pendientes vivas. |
| §27 | `FIRMADIGITAL` | Solicitudes de firma digital | `signatureRequests` | T11 | O1 | Histórico | Tokens suprimidos; pendientes se reemiten. |
| §27 | `FIRMADIGITAL_ITEMS` | PDFs a firmar/firmados | `signatureRequests.documents` | T11 | O1 | Histórico | PDFs firmados al expediente. |
| §27 | `FIRMADIGITAL_USUARIOS` | Usuarios habilitados por firma | `signatureProviders.users` | T11 | O1 | Migrar vivo | |
| §27 | `FIRMASDIGITALES` | Proveedores de firma configurados | `signatureProviders` | T11 | O1 | Migrar vivo | `CLIENT_SECRET`/`HASH` no se copian: se cargan en la bóveda (CTR-MIG-08). |
| §27 | `FIRMASELECTRONICAS` | Firmas electrónicas realizadas | `electronicSignatures` | T11 | O1 | Histórico | |
| §27 | `FIRMASELECTRONICAS_DOCUMENTOS` | Documentos que requieren firma | `signableDocumentTypes` | T11 | O1 | Migrar vivo | |
| §27 | `FIRMASELECTRONICAS_DOC_USUARIOS` | Firmantes por documento | `signableDocumentTypes.signers` | T11 | O1 | Migrar vivo | |
| §27 | `INFO_AUD` | Auditoría de visualización de informes | `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) | T02 | O11 (antes O1) | Histórico | |
| §27 | `MENUSYS` | Menú del sistema | Reemplazado por navegación de plataforma | T02 | O1 | No migrar | Insumo para la matriz de roles. |
| §27 | `MENUVAL` | Permisos de menú por perfil | Reemplazado por capacidades (T02) | T02 | O1 | No migrar | Propuesta de mapeo perfil→capacidades revisada por humano. |
| §27 | `PERFILES` | Perfiles de usuario | `roles` | T02 | O1 | Migrar vivo | Horario de acceso → política de sesión. |
| §27 | `PERFILES_TABLAS` | Tablas habilitadas por perfil | Reemplazado por capacidades (T02) | T02 | O1 | No migrar | Idem `MENUVAL`. |
| §27 | `USERS` | Usuarios del sistema | `users` | T02 | O1 | Migrar vivo | Sin contraseñas (PA-MIG-07); flags `US_*` → roles; puntos de venta/depósitos → alcances. |
| §27 | `USERS_AREA` | Áreas de usuarios | `crmAreas.members` (áreas de atención de M09) + alcance por área de `roleAssignments` (T02) (DEC-104; antes `orgUnits`, colección que no existe) | M09 (DEC-104; antes T01) | O2 (DEC-104; antes O1: se carga con las áreas de M09) | Migrar vivo | Cada fila asigna un usuario (`USERS`, vía `legacyIdMap`) a un área de atención; el área se resuelve contra `crmAreas` (CTR-DAT-69) y la pertenencia alimenta el alcance por área del rol en T02. |
| §27 | `USERS_DEPOSITO` | Depósitos por usuario | `users.scopes` (depósito) | T02 | O1 | Migrar vivo | |
| §27 | `USERS_EXTRAS` | Opciones extra de usuario | `users.preferences` | T02 | O1 | Migrar vivo | |

### 19.28 Configuración y motor de pantallas (CAT §28 — 31 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §28 | `ABM_VALIDACIONES` | Validaciones de formularios | Reemplazado por validaciones del dominio | T04 | O1 | No migrar | Insumo funcional para reglas de cada anexo. |
| §28 | `ARCHIVOS` | Definiciones de archivos de intercambio | Reemplazado por conectores (T06) | T06 | O1 | No migrar | Inventario de formatos. |
| §28 | `DATOSETB` | Valores de campos extendidos | `customFieldValues` | T04 | O1 | Migrar vivo | Cargados con la entidad dueña en su ola. |
| §28 | `DATOSEXT` | Definición de campos extendidos | `customFieldDefinitions` | T04 | O1 | Migrar vivo | |
| §28 | `DATOSINT` | Datos de interfaces | Reemplazado por conectores (T06) | T06 | O1 | No migrar | |
| §28 | `EMPRESAS` | Empresas del grupo | `legalEntities` | T04 (antes T01; DEC-064, CTR-DAT-48) | O0 (antes O1; COL-CFG-41 de T05) | Migrar vivo | Consolidar con `SU_EMPRESAS`. No es origen de sucursales (no tiene `SUC_COM`; RN-MIG-057, DEC-098). Cada empresa es una entidad jurídica del tenant (DEC-064); su `_id` se resuelve en `legacyIdMap` antes de cargar cualquier documento económico, que lleva `legalEntityId` desde O0. Las cuentas corrientes se abren por titular y entidad jurídica (DEC-087). |
| §28 | `ENTIDACOL` | Columnas de entidades configurables | Reemplazado por vistas guardadas | T04 | O1 | No migrar | Motor de pantallas propio de ProCoop. |
| §28 | `ENTIDACOL_EXTRA` | Columnas calculadas (SQL) | Descartar | T04 | O1 | No migrar | SQL embebido no se ejecuta. |
| §28 | `ENTIDACON` | Condiciones de entidades | Reemplazado por filtros guardados | T04 | O1 | No migrar | |
| §28 | `ENTIDACOU` | Condiciones por usuario | Reemplazado por filtros guardados | T04 | O1 | No migrar | |
| §28 | `ENTIDACRIT` | Criterios de agrupación | Reemplazado por vistas guardadas | T04 | O1 | No migrar | |
| §28 | `ENTIDADCIR` | Documentos circulados por entidad | Histórico (legacyRecords) | T11 | O1 | Histórico | |
| §28 | `ENTIDADES` | Entidades configurables (grillas dinámicas) | Reemplazado por vistas guardadas | T04 | O1 | No migrar | Inventario para cobertura funcional. |
| §28 | `ENTIDAEST` | Árbol de estados por entidad | Reemplazado por vistas guardadas | T04 | O1 | No migrar | |
| §28 | `ENTIDAGRUP` | Grupos de entidades | Reemplazado por navegación | T04 | O1 | No migrar | |
| §28 | `ENTIDAMEN` | Acciones por entidad | Reemplazado por acciones de plataforma | T04 | O1 | No migrar | |
| §28 | `ENTIDA_ESTADOS` | Estados por entidad | `stateCatalogs` | T04 | O1 | Migrar vivo | Como mapa de valores de estados. |
| §28 | `EXPORTADOR` | Definiciones de exportación | `exportDefinitions` | T06 | O1 | Migrar vivo | Revisadas; origen SQL no se migra. |
| §28 | `EXPORTADOR_COLUMNAS` | Columnas de exportación | `exportDefinitions.columns` | T06 | O1 | Migrar vivo | |
| §28 | `FORMAINT` | Formato de archivos de interfaz | `fileLayouts.fields` | T06 | O1 | Migrar vivo | Layouts de bancos/lectoras vigentes. |
| §28 | `FORMULARIOS_PERSONALIZACIONES` | Personalizaciones de formularios | Descartar | T04 | O1 | No migrar | Propias de la UI de ProCoop. |
| §28 | `MODEINT` | Modelos de interfaz de archivos | `fileLayouts` | T06 | O1 | Migrar vivo | Solo modelos en uso; consultas embebidas descartadas. |
| §28 | `PROPIEITEMS` | Propiedades personalizadas | `customFieldDefinitions` | T04 | O1 | Migrar vivo | Consolidar con `DATOSEXT`. |
| §28 | `PROPIEITEMS_ASIGNACIONES` | Valores de propiedades por registro | `customFieldValues` | T04 | O1 | Migrar vivo | Cargados con la entidad dueña. |
| §28 | `PROPIEITEMS_VALORES` | Valores posibles de propiedades | `customFieldDefinitions.options` | T04 | O1 | Migrar vivo | |
| §28 | `REPORTES` | Reemplazo de reportes por equipo | Descartar | T04 | O1 | No migrar | |
| §28 | `SERVINT` | Servicios por modelo de interfaz | `fileLayouts.services` | T06 | O1 | Migrar vivo | |
| §28 | `TIPOMOD` | Tipos de modelo de interfaz | `fileLayouts.type` | T06 | O1 | Migrar vivo | Mapa de valores. |
| §28 | `TIP_ARC` | Tipos de archivo | Reemplazado por conectores (T06) | T06 | O1 | No migrar | |
| §28 | `VARIABLE` | Parámetros del sistema | Parámetros PRM de cada anexo, valores en `parameterValues` de T04 (CTR-DAT-49; no `tenantParameters`) | T04 | O1 | Migrar vivo | Mapa variable→PRM revisado; las no mapeadas se reportan como incidencia. Las variables con credenciales (entre ellas la clave del proveedor de IA, var 3048) se suprimen en la extracción y se regeneran en la bóveda (RN-MIG-013, DEC-103; T06 RF-INT-023). |
| §28 | `VARIABLE_PMOVIL` | Parámetros de la app móvil | Parámetros PRM de apps (T04) | T04 | O1 | Migrar vivo | Idem. |

### 19.29 Sistema general (CAT §29 — 10 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §29 | `ADJUNTOS` | Adjuntos de registros | `attachments` (expediente) | T11 | O1 | Migrar vivo | Archivos a almacenamiento privado; vinculados en la ola de la entidad dueña. |
| §29 | `BLOQUEO_FILAS` | Bloqueo de edición concurrente | Descartar | T04 | O1 | No migrar | La plataforma usa control optimista. |
| §29 | `EQUIPOS` | Terminales con punto de venta y periféricos | `devices` | T01 | O1 | Migrar vivo | Punto de venta → M07; periféricos a revisar en sitio. |
| §29 | `ESTADOS` | Estados genéricos | `stateCatalogs` | T04 | O1 | Migrar vivo | Mapa de valores. |
| §29 | `INTEGRIDAD` | Reglas de integridad referencial de ProCoop | Descartar (insumo de validación) | T07 | O0 | No migrar | Alimenta los chequeos de integridad del staging (§9.5). |
| §29 | `MODULOS` | Módulos y versión de ProCoop | Descartar | T07 | O0 | No migrar | Se registra en `legacySnapshots` como versión de origen. |
| §29 | `OPERACIONES` | Tipos de operación | `stateCatalogs` (operaciones) | T04 | O1 | Migrar vivo | Mapa de valores. |
| §29 | `OPE_COM` | Operaciones por comprobante | `documentTypes.operations` | T04 | O1 | Migrar vivo | |
| §29 | `PROCOOPAR_ADJUNTOS` | Novedades del proveedor ProCoop | Descartar | T07 | O0 | No migrar | |
| §29 | `RELACION_ENTIDADES` | Relaciones genéricas entre registros | Según el tipo de destino (DEC-104; antes `recordLinks`, colección que no existe): `documentLinks` (T11 RF-WFL-154) cuando un extremo es un documento o adjunto; `relationships` (M01 RF-PER-099) entre persona, titular, cuenta, contrato o inmueble; `fieldResources.serviceIds`/`operationTypeIds` (M10 RF-TEC-104) para responsable–servicio; el resto a `legacyRecords` | T11 | O1 | Migrar vivo | T11 conduce la carga; M01 y M10 reciben los pares que les corresponden (DEC-104). Se resuelven ambos extremos vía `legacyIdMap`; huérfanos a incidencias. El perfilado de F2 lista los pares de tipos presentes por tenant para fijar el destino de cada par en el mapeo. |

### 19.30 Maestros generales (CAT §30 — 15 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §30 | `BARRIOS` | Barrios por localidad | `geo.neighborhoods` | T04 | O1 | Migrar vivo | |
| §30 | `CALLES` | Calles con ruta, orden y sector | `geo.streets` | T04 | O1 | Migrar vivo | Ruta/orden → rutas de lectura (M04). |
| §30 | `DEPARTA` | Departamentos (división política) | `geo.departments` | T04 | O1 | Migrar vivo | Consolidar con `DEPTO`. |
| §30 | `DEPTO` | Departamentos con códigos INAES/ENARGAS/OCEBA | `geo.departments` | T04 | O1 | Migrar vivo | Códigos regulatorios contrastados con plataforma. |
| §30 | `DISTRITO_SECCION` | Distritos y secciones catastrales | `geo.cadastralDistricts` | T04 | O1 | Migrar vivo | |
| §30 | `DOCUMENT` | Tipos de documento | Tabla normativa de plataforma | T04 | O1 | No migrar | Mapa de valores (RN-MIG-044). |
| §30 | `EST_CIVIL` | Estados civiles | Tabla de plataforma | T04 | O1 | No migrar | Mapa de valores. |
| §30 | `FERIADOS` | Feriados | `holidays` | T04 | O1 | Migrar vivo | Solo feriados locales; nacionales de plataforma. |
| §30 | `LOCALIDA` | Localidades con códigos | `geo.localities` | T04 | O1 | Migrar vivo | Contrastar con catálogo oficial; `KILOMETROS` se conserva. |
| §30 | `MAPA` | Configuración de mapas | Descartar | T04 | O1 | No migrar | Centro/zoom se configura en GIS. |
| §30 | `OCUPACIO` | Ocupaciones | `occupations` | T04 | O1 | Migrar vivo | |
| §30 | `PAISES` | Países | Tabla de plataforma | T04 | O1 | No migrar | Mapa de valores. |
| §30 | `PROVINC` | Provincias | Tabla de plataforma | T04 | O1 | No migrar | Mapa de valores. |
| §30 | `RNQCALL` | Calles (variante para rutas) | `geo.streets` | T04 | O1 | Migrar vivo | Consolidar con `CALLES`. |
| §30 | `ZONAS` | Zonas con importe y recargo por baldío | `geo.zones` | T04 | O1 | Migrar vivo | Importe/recargo → regla de tarifa (M04). |

### 19.31 Comunicaciones (CAT §31 — 18 tablas)

| Sección CAT | Tabla | Descripción | Destino | Anexo dueño | Ola | Estrategia | Observaciones |
|---|---|---|---|---|---|---|---|
| §31 | `AUDIT_MAIL` | Cola y auditoría de mails | `legacyAuditRecords` (antes "Histórico (legacyRecords)" de T09, O2; COL-IAM-29) | T02 | O11 | Histórico | Pendientes no se reenvían. |
| §31 | `CIRCUPRO` | Circulares a proveedores | `messageTemplates` | T09 | O2 | Migrar vivo | |
| §31 | `CORREOS_INTERNOS` | Cuentas SMTP | Reemplazado por canales de T09 con secretos en bóveda | T09 | O1 | No migrar | `PASS` nunca se copia (RN-MIG-013). |
| §31 | `ENCUESTAS` | Encuestas a socios | `surveys` | T09 | O2 | Migrar vivo | Vigentes; resto histórico. |
| §31 | `ENVIOS` | Envíos de SMS por módem | Descartar | T09 | O2 | No migrar | |
| §31 | `IVR` | Avisos telefónicos automáticos | Reemplazado por la exportación al discador de T09 (canal `ivr_export`, RF-COM-148, configuración en `channelSettings`) y, si la cooperativa contrata un IVR en línea, la conexión `ivr` de T06 (FI-INT-66); ProCoop no tiene IVR propio (DEC-104; antes "Reemplazado por canal de voz (T09)") | T09 | O6 (DEC-104; antes O2: ola del canal `ivr_export`) | No migrar | Configuración como insumo. |
| §31 | `MENSAJES` | SMS enviados/pendientes | Histórico (legacyRecords) | T09 | O2 | Histórico | Pendientes no se reenvían. |
| §31 | `MODEMS` | Módems GSM | Descartar | T09 | O2 | No migrar | Reemplazado por proveedor de SMS. |
| §31 | `NOTI_COOP` | Notificaciones a socios en portal | `portalNotifications` | T09 | O2 | Migrar vivo | Vigentes. |
| §31 | `PLANTILLA` | Plantillas de mensajes | `messageTemplates` | T09 | O2 | Migrar vivo | Variables traducidas; revisión humana. |
| §31 | `PLANTILLA_WSP` | Plantillas de WhatsApp | `messageTemplates` (WhatsApp) | T09 | O2 | Migrar vivo | Reaprobación ante el proveedor. |
| §31 | `PROMAIL` | Mails de procesos | Descartar | T09 | O2 | No migrar | |
| §31 | `RESPUESTAS` | Respuestas a encuestas | `surveys.responses` | T09 | O2 | Migrar vivo | De encuestas vigentes; resto histórico. |
| §31 | `RESULTADOS` | Resultados de envío de SMS | Descartar | T09 | O2 | No migrar | |
| §31 | `SENDMAIL` | Envíos de mail | Descartar | T09 | O2 | No migrar | |
| §31 | `TELEFON` | Agenda telefónica | Histórico (legacyRecords) | T09 | O2 | Histórico | Contactos relevantes pueden darse de alta en `persons` a pedido. |
| §31 | `VARIABLEPLANT` | Variables de plantillas | `messageTemplates.variables` | T09 | O2 | Migrar vivo | Mapa a variables de T09. |
| §31 | `VARIABLES_PLANTILLA_WSP` | Variables de plantillas WhatsApp | `messageTemplates.variables` | T09 | O2 | Migrar vivo | |

### 19.32 Resumen de la matriz

Total verificado: **659 tablas** (coincide con CAT). Estrategia: **Migrar vivo 470 · Histórico 111 · No migrar 78**.

**Por sección CAT** (total / vivo / histórico / no migrar):

| §CAT | Total | Vivo | Hist. | No | §CAT | Total | Vivo | Hist. | No |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 24 | 19 | 4 | 1 | 17 | 24 | 23 | 1 | 0 |
| 2 | 48 | 43 | 3 | 2 | 18 | 56 | 38 | 4 | 14 |
| 3 | 24 | 18 | 4 | 2 | 19 | 11 | 7 | 4 | 0 |
| 4 | 35 | 23 | 12 | 0 | 20 | 5 | 3 | 2 | 0 |
| 5 | 26 | 16 | 7 | 3 | 21 | 14 | 12 | 1 | 1 |
| 6 | 21 | 8 | 12 | 1 | 22 | 7 | 4 | 3 | 0 |
| 7 | 13 | 9 | 3 | 1 | 23 | 10 | 10 | 0 | 0 |
| 8 | 17 | 13 | 3 | 1 | 24 | 7 | 6 | 0 | 1 |
| 9 | 6 | 6 | 0 | 0 | 25 | 12 | 3 | 1 | 8 |
| 10 | 38 | 29 | 5 | 4 | 26 | 8 | 5 | 1 | 2 |
| 11 | 12 | 12 | 0 | 0 | 27 | 20 | 9 | 7 | 4 |
| 12 | 39 | 33 | 6 | 0 | 28 | 31 | 15 | 1 | 15 |
| 13 | 13 | 10 | 3 | 0 | 29 | 10 | 6 | 0 | 4 |
| 14 | 34 | 31 | 3 | 0 | 30 | 15 | 10 | 0 | 5 |
| 15 | 38 | 28 | 9 | 1 | 31 | 18 | 8 | 3 | 7 |
| 16 | 23 | 13 | 9 | 1 | **Total** | **659** | **470** | **111** | **78** |

**Por anexo dueño** (total / vivo / histórico / no migrar): M01 14/10/4/0 · M02 21/20/1/0 · M03 27/20/5/2 · M04 30/27/1/2 · M05 32/21/11/0 · M06 36/26/7/3 · M07 31/14/16/1 · M08 20/16/3/1 · M09 40/34/5/1 · M10 69/57/9/3 · M11 11/9/2/0 · M12 31/30/1/0 · M13 38/26/11/1 · M14 20/11/9/0 · M15 26/25/1/0 · M16 53/36/4/13 · M17 9/9/0/0 · M18 21/13/8/0 · M19 2/1/0/1 · T01 4/4/0/0 · T02 13/5/3/5 · T04 51/33/0/18 · T06 11/6/0/5 · T07 3/0/0/3 · T09 22/11/4/7 · T10 11/0/1/10 · T11 13/6/5/2.

**Por ola de carga**: O0 3 · O1 88 · O2 72 · O3 44 · O4 73 · O5 52 · O6 21 · O7 42 · O8 98 · O9 55 · O10 100 · O11 11.

**Ajuste del pase de huecos (nov-2026)**. Los cambios de dueño y de ola de HUECO-TRV-01, HUECO-TRV-06, HUECO-SEP-02, HUECO-OBR-04 y la alineación de vivienda con M18 (`VIV_RETM`, `VIV_RET_IT`) modifican los totales anteriores (el total de 659 y la estrategia por tabla no cambian; las filas con dos dueños u olas se cuentan por el primero): **por anexo dueño** M01 10/7/3/0 (antes 14/10/4/0) · M02 23/21/2/0 (antes 21/20/1/0) · M04 30/27/1/2 (sin cambio neto: sale `BENSOC`, entra `SERSOC_EXTRAS`) · M13 36/26/9/1 (antes 38/26/11/1) · M18 25/15/10/0 (antes 21/13/8/0); **por ola** O2 70 (antes 72) · O4 74 (antes 73) · O7 45 (antes 42) · O8 96 (antes 98). Las plantillas de §19.33 no son tablas ProCoop y no suman a la matriz.

**Ajuste de las fases 2 y 3 (nov-2026)**. Los cambios de dueño y de ola por CTR-DAT de T05 (04, 29, 33, 36, 38, 42, 43, 44, 45, 46, 48, 52, 53, 54, 75, 77, 78) y DEC-064 reemplazan los totales de los dos párrafos anteriores. Recuento sobre las 659 filas (las filas con dos dueños u olas se cuentan por el primero; el total y la cantidad por estrategia no cambian: 471 vivo, 111 histórico, 77 no migrar): **por anexo dueño** M01 11/8/3/0 · M02 23/21/2/0 · M03 24/18/4/2 · M04 31/29/0/2 · M05 30/20/10/0 · M06 34/24/7/3 · M07 31/14/16/1 · M08 22/17/4/1 · M09 40/34/5/1 · M10 69/57/9/3 · M11 11/9/2/0 · M12 34/30/4/0 · M13 39/29/9/1 · M14 19/12/7/0 · M15 24/23/1/0 · M16 53/36/4/13 · M17 9/9/0/0 · M18 25/15/10/0 · M19 2/1/0/1 · T01 2/2/0/0 · T02 14/5/5/4 · T04 53/35/0/18 · T06 11/6/0/5 · T07 3/0/0/3 · T09 21/11/3/7 · T10 11/0/1/10 · T11 13/6/5/2; **por ola** O0 4 · O1 83 · O2 70 · O3 46 · O4 70 · O5 56 · O6 21 · O7 43 · O8 99 · O9 55 · O10 96 · O11 16.

**Ajuste DEC-104 (10-11-2026)**. `USERS_AREA` pasa de T01 (`orgUnits`, inexistente) a M09 (`crmAreas`) y de O1 a O2; `IVR` pasa de O2 a O6. Sobre el recuento del párrafo anterior: **por anexo dueño** T01 1/1/0/0 (antes 2/2/0/0) · M09 41/35/5/1 (antes 40/34/5/1); **por ola** O1 82 (antes 83) · O2 70 (sin cambio neto: entra `USERS_AREA`, sale `IVR`) · O6 22 (antes 21). `RELACION_ENTIDADES` conserva dueño (T11) y ola. Las correcciones de cantidad de columnas (`PROD_SER` 90, `TIPO_FAC` 57) no cambian conteos. El total y la cantidad por estrategia no cambian (471 vivo, 111 histórico, 77 no migrar).

### 19.33 Plantillas de `ExcelImportWizard` para dominios sin tabla ProCoop (RF-MIG-099)

Reglas comunes: una plantilla por entidad con encabezados fijos (`dict:` del módulo dueño), fechas `dd-mm-yyyy`, importes con coma decimal, personas identificadas por tipo y número de documento (se buscan en M01 con la deduplicación de RN-MIG-014; si no existen se crea una persona mínima marcada para revisión), validación previa por fila (RF-MIG-050), rechazos con motivo (RF-MIG-051) y carga idempotente por la clave natural de cada plantilla (RF-MIG-043). Los valores de las columnas enumeradas se escriben en español y se traducen a los enums del modelo de M18 con `migrationValueMaps` (por ejemplo, `parcela` → `plot`, `perpetuo` → `perpetual`, `ocupada` → `occupied`). Los ejemplos de la plantilla descargable son ficticios.

**Cementerio parque** (HUECO-CEM-03; dueño M18 §7.4; no hay tablas ProCoop relevadas). Orden de carga obligatorio: unidades → derechos → titulares → autorizados → ocupaciones.

| Plantilla | Destino (M18) | Clave natural | Columnas | Validaciones por fila |
|---|---|---|---|---|
| TPL-MIG-CEM-01 Unidades | `burialUnits` | establecimiento + código de unidad | Establecimiento, código, sector, manzana, fila, número, tipo (`parcela`, `nicho`, `urnario`, `osario`, `otro`), niveles (capacidad), disponibilidad (`disponible`, `reservada`, `asignada`, `bloqueada`), latitud y longitud (opcionales) | Código único en el establecimiento; niveles ≥ 1; el establecimiento existe en `cemeteries`. |
| TPL-MIG-CEM-02 Derechos | `burialRights` | número de derecho | Número, código de unidad, versión de reglamento, modalidad (`perpetuo`, `temporario`, `uso`), fecha de inicio, fecha de fin, cuenta pagadora (número de cuenta), forma de adquisición (`contado`, `financiada`), referencia del instrumento, estado | La unidad existe; un solo derecho vigente por unidad (RN-SOC-023); sin instrumento → estado `pendingDocumentation`. |
| TPL-MIG-CEM-03 Titulares | `burialRights.holders` | número de derecho + documento | Número de derecho, tipo y número de documento, apellido y nombre, rol (`titular`, `cotitular`), porcentaje | Σ porcentaje por derecho = 100; al menos un `titular`. |
| TPL-MIG-CEM-04 Autorizados | `burialRights.authorizedPersons` | número de derecho + documento | Número de derecho, tipo y número de documento, apellido y nombre, alcance (actos que puede pedir), vigente hasta | El derecho existe; la fecha de vigencia no es anterior al inicio del derecho. |
| TPL-MIG-CEM-05 Ocupaciones | `burialOccupancies` (+ acto `interment` histórico en `cemeteryActs`) | código de unidad + nivel + difunto | Código de unidad, nivel, tipo y número de documento del difunto (si se conoce), apellido y nombre, fecha de fallecimiento, fecha de inhumación, estado (`ocupada`, `reducida`, `trasladada`), número de permiso municipal (opcional) | Nivel ≤ capacidad de la unidad; una ocupación `ocupada` por unidad y nivel; la ocupación nunca se descarta por falta de derecho: queda cargada con incidencia. |

Conciliación **por unidad** (aprobación del administrador de cementerio, RF-MIG-053): para cada unidad, (1) niveles ocupados cargados ≤ niveles de capacidad; (2) ocupaciones `ocupada` = registro físico del parque (libro de inhumaciones o relevamiento en sitio); (3) unidad con ocupación y sin derecho vigente → incidencia "ocupación sin derecho" (no se crea derecho automático ni se libera la unidad, RF-SOC-058); (4) unidad `asignada` sin derecho → incidencia; (5) totales por establecimiento y tipo de unidad = REP-SOC-07 calculado en CoopApps. El resultado se guarda como `migrationReconciliations` del dominio cementerio.

**Banco ortopédico y dispenser** (HUECO-OTR-01; dueño M18 §7.5). Relevamiento del catálogo ProCoop: no hay tablas propias de préstamos ortopédicos ni de retiros de dispenser. Los préstamos ortopédicos se registran como productos entregados con un servicio en `SERSOC_PRODUCTOS` (fechas de entrega, de devolución prevista y de devolución real) y el atraso se cobra con `PROD_SER.PRE_ATRASO` y V2 3134; esas filas se migran por §19.1 [VERIFICAR] con datos. El dispenser (`clsDispenser`, V2 2581 a 2584) registra cada retiro como consumo del servicio configurado en la tabla de consumos `CONS_SER` (cuenta-servicio identificada por número de tarjeta en `SERSOC.NUM_MED`, fecha y litros); el límite diario y el excedente mensual se calculan sumando esas filas. Resuelto con el relevamiento del código (HUECO-OTR-01; antes "[VERIFICAR] si usa la tabla de consumos del servicio"): los retiros del mes en curso se cargan desde `CONS_SER` del servicio de PRM-SOC-036 y TPL-MIG-OTR-03 queda solo como alternativa si la cooperativa no usó el dispenser de ProCoop. Para lo que no esté en esas tablas se usan estas plantillas:

| Plantilla | Destino (M18) | Clave natural | Columnas | Validaciones por fila |
|---|---|---|---|---|
| TPL-MIG-OTR-01 Elementos ortopédicos | `orthopedicItems` | código | Código, tipo, descripción, estado (`disponible`, `prestado`, `mantenimiento`, `baja`), sucursal, número de bien de uso (opcional, M13) | Código único; `prestado` exige un préstamo activo en TPL-MIG-OTR-02. |
| TPL-MIG-OTR-02 Préstamos ortopédicos | `orthopedicLoans` | código de elemento + fecha de inicio | Código de elemento, tipo y número de documento del beneficiario, número de cuenta, fecha de inicio, vencimiento, fecha de devolución, depósito (importe y recibo), estado | Un solo préstamo `active`/`overdue` por elemento; vencido sin devolución → `overdue`. |
| TPL-MIG-OTR-03 Retiros de dispenser del mes en curso | `dispenserWithdrawals` | número de cuenta + fecha y hora | Número de cuenta, servicio, documento de quien retira, litros, fecha y hora, sucursal | Solo el mes en curso (para el acumulado mensual de RN-SOC-051); el historial queda en el snapshot archivado. Alternativa: el origen normal es `CONS_SER` (párrafo anterior). |

Conciliación: elementos prestados = préstamos activos; litros del mes por contrato = planilla del tenant.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-MIG-01 | DFA §33 (propuesta de etapas; antes citada como "DFA §30–34") vs DEC-006 | DFA fija fechas de corte (1/3/2027, 1/7/2027); DEC-006 ordena por olas sin fechas comprometidas. | El corte de cada etapa se dispara por condiciones de salida (§9.9, §17), no por fecha calendario. | Decisiones (DEC) > DFA |
| CTR-MIG-02 | DFA (contabilidad en etapa 4) vs DEC-009 | DFA difiere la contabilidad; DEC-009 exige el núcleo contable desde la cobranza. | Núcleo contable (plan, asientos automáticos, saldos de apertura) en O5; contabilidad completa en O8. | DEC > DFA |
| CTR-MIG-03 | DFA ("667 tablas") vs CAT (659) | Diferencia de conteo de tablas. | Rige el catálogo CAT verificado (659); la diferencia se atribuye a vistas/tablas temporales [VERIFICAR] en el inventario F1. | Fuente técnica más precisa (CAT) > DFA |
| CTR-MIG-04 | BASE §97.10 vs BASE §103 FAC-012 | §97.10 habla de "política de agrupación" en el paralelo; FAC-012 exige comparación factura por factura. | Comparación documento por documento con tolerancia PRM y diferencias explicadas (§9.6). | Sección más específica y posterior (§103) |
| CTR-MIG-05 | FIC 21 vs RF-MIG (corridas) | FIC 21 prevé una corrida para paralelo y otra para by-pass. | Corridas repetibles N veces, idempotentes, con snapshot versionado (§9.3). | Mejora sobre deuda técnica (Guía §3.5) |
| CTR-MIG-06 | Guía §7 (migración en O11) vs necesidad de herramienta temprana | Si todo se migra en O11 no se validan los dominios a medida que se construyen. | Herramienta en O0/O1; cargadores por dominio en la ola de su módulo; corte por etapas (DEC-068, DEC-088, DEC-089): el corte comercial de LAG (M01-M09) ocurre por servicio después del cierre de O7, una vez aprobado el paralelo (§17.4, PRM-MIG-041 ciclos consecutivos); contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo final y el apagado de ProCoop en O11. Antes decía "paralelo, by-pass y corte final en O11". | Guía (alcance) interpretada por DEC-006 |
| CTR-MIG-07 | DEC-005 (piloto Internet) vs RN-11 / LAG | El primer servicio construido es Internet; la cooperativa piloto es LAG (DEC-088; antes "no está definida", DEC-081), que opera electricidad, gas y prepago. | Piloto de herramienta con datos sintéticos de Internet; primera migración real de LAG después de O7, con prepago disponible (PA-MIG-17, CTR-COB-21). | DEC > RN |
| CTR-MIG-08 | CAT (credenciales en tablas) vs Guía §3.5 / Ley 25.326 | ProCoop guarda contraseñas y secretos en tablas. | `Reemplazado por` bóveda de secretos; nunca se copian ni a staging (RN-MIG-013). Por DEC-103 la lista suma la clave web de `SOCIOS`, la clave de IA de `VARIABLE` y las credenciales de proveedores, profesionales y empleados, y un escaneo previo bloquea la migración ante columnas con apariencia de credencial o números de tarjeta no listados, porque una lista cerrada no garantiza que la base real no tenga otras. | Seguridad > benchmark |
| CTR-MIG-09 | CAT (tablas espejo `ANU*`) vs modelo CoopApps | Anulaciones guardadas en tablas copia. | Se migran como estado anulado + documento de reversión enlazado. | Modelo destino (BASE) > CAT |
| CTR-MIG-10 | CAT (`HIS_*`, `*_HST`) vs modelo con vigencias | Historia en tablas separadas. | Se convierten en versiones con vigencia del documento destino. | BASE > CAT |
| CTR-MIG-11 | Deduplicación de personas vs AGR-018 / TIT-003 | Unificar personas podría arrastrar fusión de contratos/cuentas. | Se deduplican personas (asistido, PA-MIG-10); los contratos/cuentas nunca se fusionan. | AGR (negocio) > conveniencia técnica |
| CTR-MIG-12 | FIC 22 (sync con MySQL del portal) vs DEC-002 | ProCoop sincroniza con una base web externa. | La sincronización desaparece: el portal (M19) lee la base única; `WEB_LOG` no se migra. | DEC > benchmark (deuda técnica) |
| CTR-MIG-13 | RN-11 (`USUARIO = COD_SUM` en factura) vs `legacyIdMap` | El identificador impreso en facturas/códigos de barra viejos es el código ProCoop. | Tabla de alias `legacyKeyAliases` resuelve cobros con códigos viejos durante PRM de vigencia (PA-MIG-16). | Continuidad operativa (BASE §31) |
| CTR-MIG-14 | DEC-002 (base única) vs staging aislado | El staging no debe contaminar la base productiva. | Colecciones `mig*` con `tenantId` y TTL + snapshot en almacenamiento de objetos cifrado. | DEC con mitigación técnica |
| CTR-MIG-15 | T04 RF-CFG-142 (sucursales desde `EMPRESAS`/`CAJASJP`) vs CAT (`PTOVENTA.SUC_COM`) | Las tablas citadas por T04 no tienen columna de sucursal; la sucursal comercial está en el punto de venta. | Las sucursales se derivan de `PTOVENTA.SUC_COM` y la cooperativa confirma la lista antes de cargar puntos de venta y cajas (RN-MIG-057, DEC-098). | DEC > anexo; fuente técnica (CAT) |
| CTR-MIG-16 | CAT (`PROVEED`, `VENDEDOR`, `CHOFERES`, `MEDICOS` con nombre, documento y domicilio propios) vs persona única (DEC-097) | Cada maestro de ProCoop repite la identidad; copiarla crearía personas duplicadas o fichas sin persona. | Cada fila se vincula a una persona existente o la crea con las reglas de unificación del padrón y la ficha guarda solo datos del rol (RN-MIG-014). | DEC > benchmark |
| CTR-MIG-17 | Matriz §19 de este anexo (`SOCIOS` → "`members` en M17", `USOINM` → `propertyUses` de T04, `PROFESIO` → `licensedProfessionals`, `PROPIEDA` → `properties`) vs anexos dueños (M17 `associateMemberships` con `legalEntityId`, M15 `costCenters.sharedWithLegalEntityIds`, M01 §7.18 `premiseUsages` con `usageClass`, M10 `certifiedInstallers`, M01 `premises`) | Los destinos de la matriz no coincidían con las colecciones de los dueños y no decían a qué entidad van los datos sin empresa. | Destinos alineados a los dueños; membresías y centros de costo a la entidad por defecto (RN-MIG-002, DEC-096); `usageClass` propuesta y confirmada por la cooperativa (DEC-102). | DEC > anexo; anexo dueño prevalece (PA-DAT-05) |

## 21. Preguntas abiertas

### PA-MIG-01 — Profundidad del histórico y plazo de archivo
- **Pregunta:** ¿Cuánta historia se migra tipada (consultable y operable) y cuánto se archiva solo consultable?
- **Contexto:** ProCoop acumula décadas de facturas, cobros y movimientos; migrar todo tipado encarece la carga y el paralelo; la ley fiscal exige conservar 10 años.
- **Opciones:**
  - A) Ejercicio en curso + 24 meses tipados; el resto en `legacyRecords` consultable; snapshot conservado 10 años **(Recomendada)** — carga acotada, cumplimiento fiscal.
  - B) Todo tipado — máxima consulta, carga y paralelo mucho más largos.
  - C) Solo saldos vivos + archivo — carga mínima, pierde consultas operativas recientes.
- **Impacto si no se responde:** se asume A (PRM-MIG-014 = 24).
- **Bloquea:** RN-MIG de histórico, §9.4, cargadores de O4–O9.
- **Estado:** Respondida (DEC-070): opción A.

### PA-MIG-02 — Duración y criterio de aprobación de la corrida paralela
- **Pregunta:** ¿Cuántos ciclos de facturación en paralelo y con qué tolerancia se aprueba el by-pass?
- **Contexto:** BASE FAC-012 exige comparación factura por factura; la duración define el calendario de O11.
- **Opciones:**
  - A) 2 ciclos consecutivos por servicio con 0 diferencias sin explicar **(Recomendada)** — evidencia suficiente con costo acotado.
  - B) 1 ciclo — más rápido, riesgo de errores estacionales.
  - C) 3 ciclos o más — más seguro, doble carga operativa prolongada.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.6, ESC de paralelo, corte comercial tras O7 (DEC-089; antes "O11").

### PA-MIG-03 — Modo de sincronización durante la convivencia
- **Pregunta:** ¿Cómo se sincronizan ProCoop y CoopApps mientras conviven?
- **Contexto:** Doble digitación genera errores; la sincronización bidireccional es costosa y riesgosa.
- **Opciones:**
  - A) Delta unidireccional ProCoop→CoopApps mientras ProCoop es maestro; luego exportaciones CoopApps→ProCoop para módulos que siguen en ProCoop **(Recomendada)** — un solo maestro por dominio.
  - B) Bidireccional en tiempo real — complejo, conflictos.
  - C) Sin sincronización, doble carga manual — barato, propenso a errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.7, JOB de convivencia, O11.

### PA-MIG-04 — Módulos que permanecen en ProCoop tras el corte comercial
- **Pregunta:** ¿En qué orden se cortan los dominios?
- **Contexto:** DEC-006/DEC-009 y la DFA proponen etapas; la cooperativa puede preferir un corte único.
- **Opciones:**
  - A) E2: corte comercial primero (socios, servicios, facturación, cobranza, mora); contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta E3 corte administrativo **(Recomendada)** — riesgo repartido.
  - B) Corte único total — un solo esfuerzo, riesgo concentrado.
  - C) Corte por servicio (Internet, luego agua, etc.) — muy gradual, convivencia larga.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.7 etapas E0–E4, plan de corte.
- **Estado:** Respondida (DEC-068): opción A (corte comercial M01–M09 primero; contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo).

### PA-MIG-05 — Forma del saldo de apertura de deuda
- **Pregunta:** ¿La deuda se migra documento por documento o como saldo único por cuenta?
- **Contexto:** El saldo único es más simple, pero impide imputar cobros a comprobantes, calcular intereses por vencimiento y emitir notas de crédito sobre facturas viejas.
- **Opciones:**
  - A) Documento por documento (facturas/obligaciones pendientes) **(Recomendada)** — intereses, imputación y NC exactas.
  - B) Saldo único por cuenta y servicio — rápido, pierde trazabilidad.
  - C) Mixto: documentos del período tipado y saldo para lo anterior — compromiso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargadores M07/M08, conciliación de deuda.

### PA-MIG-06 — Intereses devengados al corte
- **Pregunta:** ¿Se migran los intereses calculados por ProCoop o se recalculan?
- **Contexto:** RN-04 describe el cálculo de mora de ProCoop; diferencias de redondeo o tasa generan reclamos.
- **Opciones:**
  - A) Recalcular con las tablas de tasas migradas y conciliar contra ProCoop; diferencias explicadas **(Recomendada)** — un único motor de intereses.
  - B) Congelar el interés de ProCoop como concepto — sin diferencias, dos lógicas.
  - C) Condonar intereses al corte — simple, pérdida económica.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M08, ESC de mora.

### PA-MIG-07 — Contraseñas y activación de usuarios
- **Pregunta:** ¿Cómo acceden los usuarios internos y del portal tras la migración?
- **Contexto:** Las contraseñas de ProCoop son reversibles y no deben copiarse (RN-MIG-013).
- **Opciones:**
  - A) No migrar contraseñas; enviar invitación de activación por mail/SMS **(Recomendada)** — seguro.
  - B) Migrar con hash nuevo — imposible sin leer contraseñas en claro.
  - C) Contraseña temporal común — inseguro.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T02, M19.

### PA-MIG-08 — Numeración de comprobantes después del corte
- **Pregunta:** ¿Se conservan los puntos de venta de ARCA?
- **Contexto:** Cambiar puntos de venta implica trámite en ARCA; continuar la numeración requiere sincronizar el último número autorizado.
- **Opciones:**
  - A) Mismos puntos de venta; continuar con el último número consultado a ARCA al corte **(Recomendada)** — sin trámites, continuidad.
  - B) Puntos de venta nuevos — separación clara, trámite previo.
  - C) Mixto por tipo de comprobante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M05/M06, corte F12.

### PA-MIG-09 — Profundidad contable
- **Pregunta:** ¿Qué se migra de contabilidad?
- **Contexto:** Los libros oficiales del ejercicio cerrado ya están rubricados en ProCoop.
- **Opciones:**
  - A) Saldos de apertura + asientos del ejercicio en curso **(Recomendada)** — continuidad del ejercicio.
  - B) Solo saldos de apertura al inicio del ejercicio siguiente — corte limpio, espera al cierre.
  - C) Todos los ejercicios — costo alto, valor bajo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M15, O5/O8.

### PA-MIG-10 — Deduplicación de personas
- **Pregunta:** ¿Cómo se unifican personas duplicadas (mismo documento con varios códigos)?
- **Contexto:** Duplicados frecuentes en socios, proveedores y empleados; fusionar mal mezcla datos personales.
- **Opciones:**
  - A) Asistida: el sistema propone candidatos y una persona aprueba **(Recomendada)** — calidad con control.
  - B) Automática por documento — rápida, errores en documentos mal cargados.
  - C) Sin deduplicación — replica la deuda de datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M01, F4.

### PA-MIG-11 — CUIT/DNI inválidos
- **Pregunta:** ¿Qué se hace con personas cuyo documento no valida?
- **Contexto:** Dígito verificador incorrecto o documentos ficticios cargados en ProCoop. **Alcance (10-11-2026, DEC-099):** esta pregunta trata solo los documentos **presentes pero inválidos**. La persona que llega **sin ningún documento** ya está decidida por DEC-099 y no depende de esta respuesta: se carga con `identificationStatus = documentPending`, entra en el informe de migración y genera una tarea de regularización (RN-MIG-058, M01 RN-PER-136). Un documento de relleno (por ejemplo `0`) se trata aquí como inválido, salvo lo previsto en RN-MIG-058.
- **Opciones:**
  - A) Cargar marcadas como "documento a revisar" y bloquear factura A hasta corregir **(Recomendada)** — no frena la migración.
  - B) Rechazar hasta corregir en origen — bloquea cuentas activas.
  - C) Cargar sin marca — riesgo fiscal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M01, M06.

### PA-MIG-12 — Normalización de domicilios y geocodificación
- **Pregunta:** ¿Se normalizan y geocodifican los domicilios en la migración?
- **Contexto:** Calles duplicadas (`CALLES`/`RNQCALL`) y domicilios libres; el GIS y las rutas dependen de coordenadas.
- **Opciones:**
  - A) Normalizar contra el maestro de calles y sugerir geocodificación para aprobación **(Recomendada)** — mejora sin bloquear.
  - B) Migrar tal cual — rápido, GIS pobre.
  - C) Geocodificación obligatoria — bloquea cuentas sin coordenadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T04 geografía, M04 rutas, M10 GIS.

### PA-MIG-13 — Modelo GIS duplicado (`NIV_*` vs `REDES_*`)
- **Pregunta:** ¿Qué modelo de red prevalece?
- **Contexto:** ProCoop tiene dos modelos de red superpuestos.
- **Opciones:**
  - A) Prevalece `REDES_*`; `NIV_*` se consolida como atributos **(Recomendada)** — modelo más completo.
  - B) Prevalece `NIV_*` — modelo más simple, pierde atributos.
  - C) Migrar ambos — duplicación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M10 red.

### PA-MIG-14 — Uso de `TICKETS` (mesa de ayuda)
- **Pregunta:** ¿Los tickets son atención a socios o soporte interno del proveedor?
- **Contexto:** Campos como horas bonificadas sugieren uso del proveedor de software.
- **Opciones:**
  - A) Migrar abiertos + 12 meses de cerrados como atención; descartar horas bonificadas **(Recomendada)** — continuidad de atención.
  - B) No migrar — si es uso del proveedor.
  - C) Migrar todo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M09 tickets.

### PA-MIG-15 — Método de anonimización para ambientes de prueba
- **Pregunta:** ¿Cómo se anonimizan las copias para ensayo y capacitación?
- **Contexto:** Ley 25.326; los ensayos requieren datos realistas y montos conciliables.
- **Opciones:**
  - A) Seudonimización determinística irreversible, conservando importes, fechas y relaciones **(Recomendada)** — ensayos conciliables.
  - B) Datos sintéticos — sin riesgo, no conciliable con ProCoop.
  - C) Copia real con acceso restringido — riesgo legal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.10, ensayos F5–F9.

### PA-MIG-16 — Vigencia de alias de códigos ProCoop
- **Pregunta:** ¿Hasta cuándo se aceptan cobros con códigos y barras de ProCoop?
- **Contexto:** Facturas emitidas por ProCoop siguen circulando y se cobran en entes.
- **Opciones:**
  - A) Último vencimiento emitido por ProCoop + 180 días **(Recomendada)** — cubre segundos vencimientos y atrasos.
  - B) Permanente — deuda técnica.
  - C) 30 días — cobros rechazados.
- **Impacto si no se responde:** se asume A (PRM de alias).
- **Bloquea:** `legacyKeyAliases`, M07/M12.
- **Estado:** Abierta solo en el margen de días: el criterio (resolución por clave ProCoop hasta vencer las facturas migradas, identificador nuevo autocontenido) está respondido por DEC-050.

### PA-MIG-17 — Orden de cooperativas y piloto de migración
- **Pregunta:** ¿Qué cooperativa se migra primero y cómo se valida la herramienta?
- **Contexto:** DEC-005 fija Internet como piloto comercial; la cooperativa piloto de migración es LAG (DEC-088; antes "no está definida", DEC-081), que opera electricidad, gas y prepago (CTR-MIG-07).
- **Opciones:**
  - A) Herramienta validada con datos sintéticos de Internet; primera migración real de la cooperativa piloto tras O7 si opera servicios medidos, o desde O6 si es solo Internet **(Recomendada)** — respeta DEC-005 y DEC-081. Con DEC-088 (piloto LAG, servicios medidos) aplica la rama "tras O7".
  - B) Cooperativa piloto con servicios medidos sin esperar O7 — servicios medidos incompletos.
  - C) Otra cooperativa Internet como primera real — requiere identificarla.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** plan de proyectos de migración, O7–O11.

### PA-MIG-18 — Contabilidad durante el paralelo
- **Pregunta:** ¿Dónde se llevan los libros oficiales mientras hay paralelo?
- **Contexto:** Doble contabilidad oficial no es admisible.
- **Opciones:**
  - A) Libros oficiales en ProCoop; CoopApps simula asientos y exporta para comparar **(Recomendada)** — un solo libro oficial.
  - B) Libros oficiales en CoopApps desde el paralelo — riesgo si se revierte.
  - C) Sin contabilidad en el paralelo — no valida asientos automáticos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M15, §9.6.
- **Estado:** Respondida (DEC-069): opción A; CoopApps usa un plan no oficial, concilia contra ProCoop y se oficializa en el corte administrativo.

### PA-MIG-19 — Datos de salud
- **Pregunta:** ¿Cómo se tratan los datos de salud (ambulancias, licencias médicas)?
- **Contexto:** Datos sensibles (Ley 25.326 art. 7–8).
- **Opciones:**
  - A) Cifrado a nivel de campo y acceso restringido por capacidad **(Recomendada)** — cumplimiento.
  - B) Solo histórico en archivo cifrado — menos uso operativo.
  - C) No migrar — pérdida de historia clínica operativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-MIG-038, M18, M16.

### PA-MIG-20 — Dónde se guarda el acta de aceptación de la migración
- **Pregunta:** ¿El acta de aceptación firmada (RF-MIG-087, PAN-MIG-23) es un documento de T11 o una colección propia de T07?
- **Contexto:** `migrationProjects.acceptanceActId` apuntaba a un documento de T11 sin colección definida.
- **Opciones:**
  - A) `documents` de T11 con tipo documental `acta`: firma, versiones y retención las da T11 **(Recomendada)**.
  - B) Colección propia de T07.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MIG-087; PAN-MIG-23; API-MIG-03 (transición a `live`).
- **Estado:** Asumida (DEC-072): opción A.

### PA-MIG-21 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** las máquinas de §8.1 a §8.6 estaban en texto sin estado de alta explícito; `migrationProjects` y `migrationRuns` no listaban valores en §7; 5 referencias no tenían destino en la definición del campo; 9 colecciones no tenían tabla de campos; API-MIG-34 y 36 citaban reglas de acceso en lugar de capabilities; `setId` y `ruleId` no usaban el nombre canónico de T05.
- **Opciones:**
  - A) Agregar §8.8 con una fila por transición y estado inicial; listar valores en §7; declarar destinos (`goodappsBatchId` → `billingRuns` de M05, `acceptanceActId` → `documents`, snapshots → `legacySnapshots`, `baseSetId` → `migrationMappingSets`); renombrar a `mappingSetId` y `ruleCode` (con "antes"); agregar §7.14 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `mig.clavesHeredadas.resolver` y `mig.miHistorial.ver` (registradas en T02 §4.4.2). **(Recomendada)**.
  - B) Dejar las máquinas solo en texto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos y ER de T07.
- **Estado:** Asumida (DEC-072): opción A.

## 22. Trazabilidad de fuentes

| Fuente | Contenido | Dónde quedó en este anexo |
|---|---|---|
| BASE §31 / CU-31 | Migración de datos desde el sistema anterior | §5 RF-MIG, §16 CU-31 y CU-MIG-01..14 |
| BASE §97.8–97.12 | Plan de implementación, paralelo, convivencia, corte | §9.2, §9.6, §9.7, §9.9, CTR-MIG-04 |
| BASE §98 | Protección de datos personales | §9.10, RN-MIG-013, RN-MIG-038, PA-MIG-15, PA-MIG-19 |
| BASE §103 FAC-005..011 | Grupos, emisión y numeración de facturación | §9.6, PA-MIG-08, matriz §19.4 |
| BASE §103 FAC-012 | Facturación comparada en paralelo | §9.6, §17, PA-MIG-02, CTR-MIG-04 |
| AGR-018 / AGR-019 / TIT-003 | Unicidad de persona, no fusión de contratos | RN-MIG de personas, PA-MIG-10, CTR-MIG-11 |
| DFA §33 (propuesta de etapas; antes citada como "DFA §30") | Estrategia de implementación por etapas | §9.1, §9.7, CTR-MIG-01, CTR-MIG-02 |
| DFA §33 (nota) y FIC 21 (antes citadas como "DFA §31") | Migración de datos | §9.2–§9.5 |
| DFA §33 (nota) y FIC 21 (antes citadas como "DFA §32") | Convivencia con ProCoop | §9.7, PA-MIG-03, PA-MIG-04 |
| DFA §33 (criterio de aceptación del paralelo) | Paralelo de facturación | §9.6, PA-MIG-02 |
| DFA §34 punto 4 (pendientes: validar qué módulos se usan) | Relevamiento de uso | §9.2 F1, matriz §19 (No migrar) |
| DFA §30 (Módulo 29, integraciones externas), §31 (procesos transversales) y §32 (modelo de datos de referencia) | Numeración vigente de la DFA (corrección de citas de la matriz 04 §4.3) | §13 (integraciones); RF-MIG-033 a RF-MIG-035 y RN-MIG-009 a RN-MIG-011 citan §32 como modelo de datos de referencia (anulaciones, históricos y extras) |
| DFA "667 tablas" | Conteo de tablas | CTR-MIG-03 |
| FIC 14.1 / 14.2 / 14.3 | Exportaciones/importaciones de interfaz | Matriz §19.28 (`MODEINT`, `FORMAINT`, `EXPORTADOR*`), §13 |
| FIC 18.2 | Parámetros del sistema (`VARIABLE`) | §14 PRM-MIG, matriz §19.28 |
| FIC 21 | Corridas de migración/by-pass | §9.3, §9.7, CTR-MIG-05 |
| FIC 22 | Sincronización con portal web | CTR-MIG-12, matriz §19.26 |
| RN-11 §3 | Identificadores de cliente/servicio | `legacyIdMap`, `legacyKeyAliases`, CTR-MIG-13 |
| RN-11 §5 (5.4, 5.5, 5.8) | Rangos de `COD_SUM`, `FACTURAS.USUARIO`, códigos SIRO | §9.2 F2, PA-MIG-16 |
| RN-11 Implicancias / Dudas | Riesgos de migración | §9.5, PA-MIG-05, PA-MIG-16 |
| RN-11 `clsClientesProcoop` | Listado de clientes del proveedor | Descartado: contiene datos de terceros (CUIT) que no se transcriben; solo se usa para planificar PA-MIG-17 |
| RN-04 | Cálculo de mora e intereses | PA-MIG-06, matriz §19.8 |
| README relevamiento | Índice de fuentes | §22 (esta tabla) |
| CAT §1–§31 | 659 tablas | Matriz §19.1–§19.31 (una fila por tabla), resumen §19.32 |
| CNX (conexiones/credenciales) | Cadenas de conexión y secretos | Descartado: secretos; reemplazado por bóveda (CTR-MIG-08, RN-MIG-013) |
| DEC-002 / 003 / 005 / 006 / 009 | Decisiones rectoras | §9.1, CTR-MIG-01, 02, 06, 07, 12, 14 |
| Guía §3.5 | Deudas técnicas a reemplazar | CTR-MIG-05, 08, 12 |
| DEC-096 (entidad jurídica en datos sin empresa de ProCoop) | Membresías de `SOCIOS` a la entidad por defecto salvo indicación de la cooperativa; centros de costo de la entidad por defecto compartidos con todas | RN-MIG-002; matriz §19 (`SOCIOS`, `CTSECCION`, `SECCION`); CTR-MIG-17 |
| DEC-097 (persona única en los maestros de rol; aporte A5) | Proveedores, vendedores, choferes y médicos vinculan o crean la persona con las reglas del padrón | RN-MIG-014; matriz §19 (`PERSONAS`, `CHOFERES`, `VENDEDOR`, `PROVEED`, `MEDICOS`); CTR-MIG-16 |
| DEC-098 (origen de las sucursales; aporte A6) | Sucursales desde `PTOVENTA.SUC_COM` con confirmación previa de la cooperativa | RN-MIG-057; §9.2 F1 y F3; matriz §19 (`PTOVENTA`, `CAJASJP`, `EMPRESAS`); `migrationIssues` `ORG-BRANCH-UNCONFIRMED`; CTR-MIG-15 |
| DEC-099 (personas sin documento; aporte A7) | `documentPending`, informe de migración y tarea de regularización; distinto del documento inválido | RN-MIG-058; §9.5; PA-MIG-11 (alcance); matriz §19 (`PERSONAS`, `CHOFERES`, `VENDEDOR`, `MEDICOS`); `migrationIssues` `PER-DOC-PENDING` |
| DEC-102 (uso del suministro en la alícuota de IVA) | `USOINM` → `premiseUsages` de M01 con `usageClass` propuesta en F1 y confirmada en F3 | Matriz §19 (`USOINM`, `PROPIEDA`); `migrationIssues` `PER-USAGE-CLASS-UNCONFIRMED`; CTR-MIG-17 |
| DEC-103 (supresión de secretos y escaneo previo; aporte A11; amplía DEC-091 y DEC-092) | Clave web de `SOCIOS`, clave de IA (var 3048), credenciales de proveedores, profesionales y empleados; escaneo de números de tarjeta (Luhn) y columnas con apariencia de credencial, incluido `CUPONTAR`, que bloquea la migración | RN-MIG-013; RF-MIG-010; §7.2 (`secretScan`, estados `scanning`/`blocked`); §7.7 y COL-MIG-11 (`snapshotId`, códigos `SEC-*`); §8.7; §9.2 F1 y F5; §9.4; EVT-MIG-10; JOB-MIG-01; PRM-MIG-064; matriz §19 (`SOCIOS`, `VARIABLE`, `CUPONTAR`); CTR-MIG-08 |
| DEC-104 (inconsistencias internas del contraste, sección 6) | `USERS_AREA` → `crmAreas` (M09); `PROD_SER` 90 columnas; `TIPO_FAC` 57; `RELACION_ENTIDADES` sin `recordLinks`; IVR → `ivr_export` (T09) y FI-INT-66 (T06) | Matriz §19 (cinco filas); §19.32 (ajuste DEC-104). `RESPONSA` no se modificó: su destino ya es `fieldResources` (técnicos de campo) |
