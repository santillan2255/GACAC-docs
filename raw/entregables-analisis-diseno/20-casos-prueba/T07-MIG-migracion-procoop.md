# Casos de prueba de aceptación — T07 MIG — Migración desde ProCoop, convivencia, corrida paralela y by-pass

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T07-MIG-migracion-procoop.md`](../../especificacion/anexos/T07-MIG-migracion-procoop.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 78 CP de requisitos funcionales, 11 CP de escenarios ESC y 15 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T07 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Proyecto, inventario y estrategia (T07 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0001 | RF-MIG-001; T07 §5.1; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. | Un proyecto no puede apuntar a dos tenants; la sigla queda registrada y visible en todos los informes. |
| CP-MIG-0002 | RF-MIG-002; T07 §5.1; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Inventariar fuentes: base SQL Server, MySQL del portal/app, carpetas de adjuntos y PDF (servidor/S3), archivos DBF/Access/Excel. | El inventario lista cada fuente con responsable, medio de acceso de solo lectura y volumen estimado. |
| CP-MIG-0003 | RF-MIG-003; T07 §5.1; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Precargar el inventario de las 659 tablas de CAT con su estrategia, destino, anexo dueño y ola por defecto (matriz §19), editable por proyecto con justificación. | El proyecto muestra 659 filas; cambiar la estrategia de una tabla exige motivo y queda auditado. |
| CP-MIG-0004 | RF-MIG-004; T07 §5.1; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Detectar tablas con datos y tablas vacías en la base de la cooperativa (conteo por tabla) y marcar módulos no usados. | Tabla vacía → estrategia sugerida "No migrar (sin datos)"; informe de uso por módulo. |
| CP-MIG-0005 | RF-MIG-005; T07 §5.1; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Definir la estrategia de la cooperativa: orden de dominios por ola, dominios que siguen en ProCoop durante la convivencia, fecha-hito (condición, no fecha fija) de paralelo y de corte. | El plan muestra para cada dominio su estado: no iniciado, ensayado, en paralelo, en by-pass, cortado. |
| CP-MIG-0006 | RF-MIG-006; T07 §5.1; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Registrar el congelamiento de cambios por alcance (qué módulos de ProCoop quedan solo lectura desde qué momento). | Un corte no puede ejecutarse sin congelamiento confirmado por la cooperativa. |
| CP-MIG-0007 | RF-MIG-007; T07 §5.1; PRO-O4-15 | O4 | Estándar | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Detectar migraciones anteriores dentro de ProCoop (`FACTURAS.USUARIO = 'MIGRA_SP'` o igual a `COD_SUM`) y tratarlas como origen de alias. | El perfilado informa cuántas facturas tienen marca de migración previa y su último uso. |
### 1.2 Extracción y snapshots (T07 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0010 | RF-MIG-010; T07 §5.2; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Extraer desde SQL Server con un usuario de solo lectura, sin bloqueos (lectura con instantánea o desde un backup restaurado), tabla por tabla. | La extracción no produce escrituras en el origen (verificable por auditoría de SQL Server). |
| CP-MIG-0011 | RF-MIG-011; T07 §5.2; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Guardar cada extracción como snapshot inmutable (formato JSON Lines o Parquet por tabla) cifrado en almacenamiento de objetos privado, con manifiesto (tablas, filas, columnas, hash SHA-256, versión de ProCoop, fecha de corte de datos). | Re-extraer la misma base da el mismo hash por tabla; el manifiesto es descargable. |
| CP-MIG-0012 | RF-MIG-012; T07 §5.2; PRO-O2-18 | O2 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Extraer la base MySQL de CoopOnline/PMovil (usuarios web, cuentas vinculadas, adhesiones a factura digital, trámites). | Los usuarios web quedan en staging vinculados a sus cuentas. |
| CP-MIG-0013 | RF-MIG-013; T07 §5.2; PRO-O1-19 | O1 | Estándar | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Extraer adjuntos y PDF (facturas, actas, documentos de empleados, firmas) desde carpetas o S3, con hash y vínculo a su registro origen (`ADJUNTOS`, `ACTAS.CONTENIDO_PDF`, `FIRMADIGITAL_ITEMS`). | Cada archivo queda en el almacenamiento privado; los huérfanos se informan. |
| CP-MIG-0014 | RF-MIG-014; T07 §5.2; PRO-O1-19 | O1 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Leer archivos heredados DBF, Access y Excel mediante perfiles de importación reutilizando `ExcelImportWizard`. | Un DBF se previsualiza con errores por fila antes de cargar. |
| CP-MIG-0015 | RF-MIG-015; T07 §5.2; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" | Extracción incremental (delta) por tabla mediante columnas de fecha de registro/modificación (`FEC_REG`, `FECHA`, `FEC_ACT`) o comparación de hash por fila cuando no existan. | Un delta trae solo filas nuevas o modificadas; las borradas en origen se detectan por ausencia de clave. |
| CP-MIG-0016 | RF-MIG-016; T07 §5.2; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Registrar la fecha de corte de datos ("as of") de cada snapshot y la zona horaria del origen. | Todas las fechas sin zona se interpretan en la zona del tenant y se guardan en UTC. |
### 1.3 Perfilado, calidad y limpieza (T07 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0020 | RF-MIG-020; T07 §5.3; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Perfilado automático por tabla y columna: nulos, cardinalidad, mínimos/máximos, formatos, huérfanos de claves foráneas, duplicados de clave natural. | El informe de perfilado se genera para cada snapshot y se compara con el anterior. |
| CP-MIG-0021 | RF-MIG-021; T07 §5.3; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con CUIT inválido: 20-00000001-0 (DV incorrecto) | Validar CUIT/CUIL con dígito verificador módulo 11 y DNI por rango y formato; clasificar en válido, corregible (formato) o inválido. | Un CUIT con DV incorrecto se marca inválido y no bloquea la carga de la persona (PA-MIG-11). |
| CP-MIG-0022 | RF-MIG-022; T07 §5.3; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con CUIT inválido: 20-00000001-0 (DV incorrecto) | Detectar personas duplicadas por documento normalizado, CUIT, nombre normalizado + fecha de nacimiento, y proponer fusiones con puntaje. | Ninguna fusión automática entre documentos distintos; las fusiones propuestas requieren aprobación. |
| CP-MIG-0023 | RF-MIG-023; T07 §5.3; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con Persona duplicada: DNI 20.000.001 "Pérez, Ana" ×2 + "Pérez, Ana M." (fusión propuesta 0,95) | Prohibir fusionar contratos o cuentas por coincidencia de persona o domicilio. | Dos cuentas con igual domicilio siguen siendo dos cuentas. |
| CP-MIG-0024 | RF-MIG-024; T07 §5.3; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Normalizar domicilios contra el callejero del tenant (`CALLES`/`RNQCALL` → `streets`), barrios y localidades; marcar no normalizables. | % de domicilios normalizados visible por localidad; los no normalizados quedan con texto original. |
| CP-MIG-0025 | RF-MIG-025; T07 §5.3; PRO-O1-19 | O1 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Consolidar catálogos duplicados (`CALLES` vs `RNQCALL`, `DEPARTA` vs `DEPTO`, `CENTRALT` vs `TEL_CENTRAL`, `SECCION` vs `CTSECCION`, `NIV_*` vs `REDES_*`). | Cada par queda con una regla de consolidación documentada. |
| CP-MIG-0026 | RF-MIG-026; T07 §5.3; PRO-O2-18 | O2 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Validar correos y celulares (formato E.164 Argentina) sin bloquear la carga. | Contactos inválidos se cargan marcados `unverified`. |
| CP-MIG-0027 | RF-MIG-027; T07 §5.3; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Cola de saneamiento por tipo de problema con asignación a usuarios de la cooperativa, corrección en staging y reproceso. | Corregir una fila en staging y reprocesar no duplica lo ya cargado. |
| CP-MIG-0028 | RF-MIG-028; T07 §5.3; PRO-O1-19 | O1 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Limpieza en origen opcional: la cooperativa puede corregir en ProCoop y la próxima extracción lo trae. La herramienta indica qué corregir dónde. | El informe de calidad indica para cada problema si se corrige en origen o en staging. |
### 1.4 Mapeo y transformación (T07 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0030 | RF-MIG-030; T07 §5.4; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. | Cada corrida referencia un conjunto publicado; un conjunto publicado es inmutable. |
| CP-MIG-0031 | RF-MIG-031; T07 §5.4; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Reglas base de plataforma (comunes a toda cooperativa ProCoop) y reglas de tenant (overrides) con precedencia explícita. | Un override del tenant A no afecta al tenant B. |
| CP-MIG-0032 | RF-MIG-032; T07 §5.4; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Mapas de valores para códigos maestros (situaciones IVA, tipos de documento, estados de servicio, causas, transacciones técnicas, tipos de comprobante, medios de pago). | Un código origen sin mapeo es rechazo bloqueante del registro que lo usa. |
| CP-MIG-0033 | RF-MIG-033; T07 §5.4; PRO-O4-15 | O4 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Transformar tablas espejo de anulación (`ANUFAC`, `ANUITEMSFAC`, `ANUPAG_SOC`, `ANUIT_PAGSO`, `ANUPLAN_CAJ`) en el mismo documento con estado anulado y vínculo de reversión. | Un comprobante anulado aparece una sola vez, con estado `voided`. |
| CP-MIG-0034 | RF-MIG-034; T07 §5.4; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Transformar históricos `HIS_*` y `*_HST` en versiones con `validFrom`/`validTo` del documento destino. | La versión vigente a una fecha se reconstruye igual que en ProCoop. |
| CP-MIG-0035 | RF-MIG-035; T07 §5.4; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Transformar tablas `*_EXTRAS` en campos del documento principal o atributos configurables tipados. | Ningún `*_EXTRAS` queda como colección suelta. |
| CP-MIG-0036 | RF-MIG-036; T07 §5.4; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Convertir importes a `Decimal128` con la escala de origen sin redondeo; registrar diferencias de redondeo explícitas. | La suma de importes migrados por tabla coincide al centavo con el origen. |
| CP-MIG-0037 | RF-MIG-037; T07 §5.4; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Convertir fechas a UTC según zona del tenant; fechas nulas o `1900-01-01` tratadas como ausentes. | Ningún vencimiento cambia de día por zona horaria. |
| CP-MIG-0038 | RF-MIG-038; T07 §5.4; PRO-O4-15 | O4 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Mapear `GRUPOS_FACTURA` a grupos de facturación equivalentes, con validación fiscal previa de cada combinación de servicios. | Cada grupo ProCoop tiene su grupo GoodApps o un rechazo con motivo fiscal. |
| CP-MIG-0039 | RF-MIG-039; T07 §5.4; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Mapear `SERSOC` (servicio de la cuenta) a contrato + categoría + equipo/instalación y estado del catálogo de BASE §39.5. | Cada servicio activo en ProCoop es un contrato activo con su estado mapeado. |
| CP-MIG-0099 | RF-MIG-099; T07 §5.4; PRO-O10-04 | O10 | Estándar | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Plantillas de `ExcelImportWizard` definidas por T07 para los dominios que ProCoop no registra en tablas propias o que registra de forma incompleta (cementerio parque, banco ortopédico, dispenser de agua), con columnas, validaciones por… | La plantilla de unidades de cementerio rechaza una fila con código de unidad repetido en el establecimiento y la conciliación por unidad lista las unidades con niveles ocupados mayores que su capacidad. |
### 1.5 Carga, mapa de IDs e idempotencia (T07 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0040 | RF-MIG-040; T07 §5.5; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Cargar por dominio invocando el servicio del módulo dueño en modo `migration` (validaciones de dominio activas, sin emitir eventos de negocio que disparen efectos externos). | Una carga no envía mails, SMS, ni publica deuda a entes. |
| CP-MIG-0041 | RF-MIG-041; T07 §5.5; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Mantener `legacyIdMap` (tenant, tabla origen, clave origen serializada → colección, `_id` destino, corrida, hash del registro). | Para cualquier `legacyId` se obtiene el documento nuevo y viceversa. |
| CP-MIG-0042 | RF-MIG-042; T07 §5.5; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Guardar en cada documento destino `legacy: { system: 'procoop', table, key, runId, hash }`. | Búsqueda por número ProCoop (N° de cuenta, N° de socio, NIP, N° de comprobante) desde la UI. |
| CP-MIG-0043 | RF-MIG-043; T07 §5.5; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" | Reprocesos idempotentes: misma clave origen + mismo hash → sin cambio; mismo origen con hash distinto → actualización versionada (solo si el documento destino no tuvo cambios operativos posteriores); si los tuvo → conflicto. | Ejecutar dos veces el mismo lote no duplica (BASE CU-31 "Excepción"). |
| CP-MIG-0044 | RF-MIG-044; T07 §5.5; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" | Cargas por lotes con tamaño configurable, transacciones por lote, reanudables desde el último lote confirmado. | Un corte de energía a mitad de carga se retoma sin duplicar. |
| CP-MIG-0045 | RF-MIG-045; T07 §5.5; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Orden topológico de carga según dependencias (maestros → personas → cuentas → contratos → medidores → tarifas → documentos → pagos → saldos). | Ningún documento referencia un `_id` inexistente. |
| CP-MIG-0046 | RF-MIG-046; T07 §5.5; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. | Tras borrar la corrida, el tenant de ensayo queda sin documentos con ese `runId`. |
| CP-MIG-0047 | RF-MIG-047; T07 §5.5; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Tabla de alias de claves externas (`legacyKeyAliases`): códigos de barra ProCoop, identificador Red Link/SIRO, `FACTURAS.USUARIO`, cuentas "cuenta × 100 + servicio", `CNT_NOT`, `TALONFAC.NUMERO`. | Un pago que llega con la clave vieja se resuelve a cuenta + servicio + comprobante GoodApps. |
### 1.6 Validación, rechazos y conciliación (T07 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0050 | RF-MIG-050; T07 §5.6; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" | Validación previa por fila con errores bloqueantes y advertencias, mostrada antes de confirmar (patrón ExcelImportWizard). | En MIG-DEMO-001 se ven 3 filas, 2 válidas, 1 error "Suministro sin titular asociado". |
| CP-MIG-0051 | RF-MIG-051; T07 §5.6; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Informe de rechazos por corrida: tabla, clave, regla, campo, valor, severidad, acción sugerida; exportable XLSX/CSV. | El informe permite filtrar por dominio y exportar. |
| CP-MIG-0052 | RF-MIG-052; T07 §5.6; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Exclusión explícita de una fila (con motivo y aprobación) para poder aprobar una carga. | La fila excluida figura en la conciliación como diferencia explicada. |
| CP-MIG-0053 | RF-MIG-053; T07 §5.6; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. | Sin aprobación el dominio no puede pasar a "cortado". |
| CP-MIG-0054 | RF-MIG-054; T07 §5.6; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Conciliación de deuda por titular y por servicio, con total general igual al saldo de deudores por servicios de la contabilidad. | Ejemplo AGR-018: saldo inicial ARS 8.000 conserva titular, contrato, documento/período y origen y coincide con el total contable. |
| CP-MIG-0055 | RF-MIG-055; T07 §5.6; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Conciliación de fondos: cajas abiertas, valores en cartera, cuentas bancarias, saldos a favor y pagos no identificados. | Suma de fondos migrados = saldo contable de las cuentas de disponibilidades. |
| CP-MIG-0056 | RF-MIG-056; T07 §5.6; PRO-O3-13 | O3 | Núcleo | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Conciliación de stock por depósito, producto y número de serie; equipos instalados en comodato por cuenta. | Cada equipo serializado está en un depósito o en una cuenta, nunca en ambos. |
| CP-MIG-0057 | RF-MIG-057; T07 §5.6; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Conciliación contable: balance de sumas y saldos a la fecha de corte igual en ambos sistemas. | Diferencia 0 por cuenta contable a la fecha de corte. |
| CP-MIG-0058 | RF-MIG-058; T07 §5.6; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Conservar el informe de conciliación firmado como evidencia en el expediente documental (T11). | El informe es inmutable y descargable con hash. |
### 1.7 Histórico, archivo y consulta (T07 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0060 | RF-MIG-060; T07 §5.7; PRO-O11-06 | O11 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Cargar históricos tipados de solo lectura en la colección del módulo dueño con `legacy.readOnly = true` (comprobantes, recibos, lecturas, asientos, recibos de sueldo) según la profundidad definida. | Un histórico no puede editarse, anularse ni reimprimirse como original; se exhibe con marca "Migrado de ProCoop". |
| CP-MIG-0061 | RF-MIG-061; T07 §5.7; PRO-O11-06 | O11 | Estándar | migración | TEN-001 con Persona duplicada: DNI 20.000.001 "Pérez, Ana" ×2 + "Pérez, Ana M." (fusión propuesta 0,95) | Archivo histórico genérico `legacyRecords` para tablas Histórico sin modelo tipado: payload JSON del registro origen, tabla, clave, fechas, búsqueda por cuenta/persona. | Desde la ficha de la cuenta se abre "Histórico ProCoop" con los registros vinculados. |
| CP-MIG-0062 | RF-MIG-062; T07 §5.7; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Archivar el snapshot completo (las 659 tablas) durante el plazo de conservación, con acceso restringido y auditado. | Una consulta al archivo frío requiere permiso `mig.archivo.ver` y queda auditada. |
| CP-MIG-0063 | RF-MIG-063; T07 §5.7; PRO-O11-06 | O11 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Exhibir al socio en el portal sus comprobantes y pagos históricos migrados (con PDF original si existe). | El socio ve facturas ProCoop de los últimos 24 meses con su PDF. |
| CP-MIG-0064 | RF-MIG-064; T07 §5.7; PRO-O11-06 | O11 | Estándar | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Reimpresión de duplicados de comprobantes históricos con leyenda "Duplicado – emitido por el sistema anterior", usando el PDF original o una representación reconstruida. | Nunca se reimprime con nuevo CAE. |
### 1.8 Corrida paralela y facturación comparada (T07 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0070 | RF-MIG-070; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado" | Ejecutar ciclos de facturación en paralelo sobre el mismo padrón y período que ProCoop, en modo simulación (sin CAE, sin publicar deuda, sin notificar). | El lote paralelo no genera ningún efecto externo. |
| CP-MIG-0071 | RF-MIG-071; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía | Importar los comprobantes reales emitidos por ProCoop del período (delta) y emparejarlos con los simulados por cuenta + servicio + período (+ grupo de facturación). | % de emparejamiento visible; los no emparejados se listan por motivo. |
| CP-MIG-0072 | RF-MIG-072; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Comparar factura por factura: cantidades (consumos, días, unidades), importes por concepto, impuestos/percepciones/tasas, totales, cuatro vencimientos con sus importes, grupo de facturación y apertura por servicio. | Para el mismo período y padrón, cada diferencia queda clasificada y explicada. |
| CP-MIG-0073 | RF-MIG-073; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Clasificar diferencias (configuración, dato migrado, redondeo, regla corregida a propósito, error GoodApps, error ProCoop conocido) y asignarles responsable y justificación. | No se aprueba un ciclo con diferencias sin clasificar. |
| CP-MIG-0074 | RF-MIG-074; T07 §5.8; PRO-O7-11 | O7 | Estándar | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Comparar también mora (intereses y recargos de cobros del período), cobranzas imputadas y asientos generados (modo simulación). | Los intereses de cada cobro coinciden o la diferencia está explicada. |
| CP-MIG-0075 | RF-MIG-075; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Tablero de paralelo: comprobantes comparados, iguales, distintos dentro de tolerancia, distintos fuera de tolerancia, explicados, pendientes; por servicio, categoría, ruta y concepto. | El tablero se exporta como evidencia del acta. |
| CP-MIG-0076 | RF-MIG-076; T07 §5.8; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Aprobación del paralelo por ciclo y por servicio cuando se cumplen los criterios del §17. | Requiere los ciclos consecutivos definidos con 100 % explicado. |
### 1.9 By-pass, convivencia, corte y rollback (T07 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0080 | RF-MIG-080; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Plan de by-pass por módulo con estado: ProCoop maestro → GoodApps en paralelo → GoodApps maestro (ProCoop solo consulta) → ProCoop apagado. | En cada momento cada dominio tiene un único sistema de registro. |
| CP-MIG-0081 | RF-MIG-081; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados | Sincronización ProCoop → GoodApps por deltas programados mientras ProCoop es maestro (para paralelo y ensayos). | Delta diario configurable; la duración y el resultado de cada delta quedan registrados. |
| CP-MIG-0082 | RF-MIG-082; T07 §5.9; PRO-O7-12 | O7 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Exportaciones GoodApps → ProCoop para módulos que siguen en ProCoop (asientos contables con formato `ImportarAsientos`/`ImportarAsientosConSeccion`, novedades de sueldos, altas de cuentas para módulos dependientes). | El asiento exportado se importa en ProCoop sin edición manual. |
| CP-MIG-0083 | RF-MIG-083; T07 §5.9; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Resolutor de claves heredadas durante la transición (Red Link, SIRO, códigos de barra ProCoop en caja, `FACTURAS.USUARIO`) que solo imputa a comprobantes impagos y no imputa ante ambigüedad. | Dos candidatos → pago a cuenta con aviso; nunca a una factura paga. |
| CP-MIG-0084 | RF-MIG-084; T07 §5.9; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Lectura en caja de los formatos de código de barra ProCoop vigentes (incluido SIRO-Roela 56 dígitos `0447`, `0448`, `0449`) hasta que venzan los comprobantes ProCoop. | Un comprobante ProCoop impago se cobra en caja GoodApps leyendo su código. |
| CP-MIG-0085 | RF-MIG-085; T07 §5.9; PRO-O5-07 | O5 | Estándar | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Publicar a los entes, desde el corte, un identificador de comprobante autocontenido y convivir con el padrón anterior hasta el vencimiento de lo emitido por ProCoop. | Coordinado con Red Link/SIRO; doble padrón durante la transición. |
| CP-MIG-0086 | RF-MIG-086; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Rollback: Ventana hasta la primera emisión fiscal real | Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. | El corte no se habilita si algún criterio go está en rojo. |
| CP-MIG-0087 | RF-MIG-087; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Delta final post-congelamiento, conciliación final y acta de aceptación firmada. | El acta firmada habilita el tenant en producción para el alcance cortado. |
| CP-MIG-0088 | RF-MIG-088; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Rollback: Ventana hasta la primera emisión fiscal real | Rollback: plan de retorno con diario (`rollbackJournal`) de todo hecho registrado en GoodApps después del corte (cobros, comprobantes, lecturas, altas) y exportación para cargarlo en ProCoop. | "Los cambios realizados después del corte no desaparecen si se debe volver al sistema anterior" (AGR-018). |
| CP-MIG-0089 | RF-MIG-089; T07 §5.9; PRO-O7-12 | O7 | Núcleo | migración | TEN-001 con Rollback: Ventana hasta la primera emisión fiscal real | Ventana de rollback acotada: después de la primera emisión fiscal real o del primer cobro por entes en GoodApps, el rollback solo puede ser "hacia adelante" (reexportación), nunca restauración. | La UI bloquea el rollback por restauración pasado ese hito. |
| CP-MIG-0090 | RF-MIG-090; T07 §5.9; PRO-O2-18 | O2 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Migrar usuarios del portal (correos, cuentas vinculadas, adhesiones a factura digital) para que los socios no se registren de nuevo, sin contraseñas. | El socio recibe invitación de activación y ve sus cuentas ya vinculadas. |
### 1.10 Anonimización y ambientes (T07 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MIG-0095 | RF-MIG-095; T07 §5.10; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con CUIT inválido: 20-00000001-0 (DV incorrecto) | Perfiles de anonimización por tabla/campo: seudonimización determinística (mismo valor → mismo seudónimo, para conservar duplicados), generalización (fechas de nacimiento a año), supresión (credenciales, observaciones libres), CUIT/DNI… | Ningún dato personal real llega a desarrollo/pruebas; los CUIT generados validan DV. |
| CP-MIG-0096 | RF-MIG-096; T07 §5.10; PRO-O1-19 | O1 | Núcleo | migración | TEN-001 con Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio) | Prohibir cargar snapshots no anonimizados en ambientes distintos de producción y del tenant de ensayo de la propia cooperativa. | El job rechaza el destino si el snapshot no tiene marca `anonymized`. |
| CP-MIG-0097 | RF-MIG-097; T07 §5.10; PRO-O1-19 | O1 | Estándar | migración | TEN-001 con Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada | Anonimizar también adjuntos (PDF de facturas, actas, documentos) reemplazándolos por PDF genéricos. | Ningún PDF real en ambientes de prueba. |
| CP-MIG-0098 | RF-MIG-098; T07 §5.10; PRO-O0-20 | O0 | Núcleo | migración | TEN-001 con Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722` | Las capturas, informes y ejemplos de esta documentación usan datos ficticios. | Revisión de documentación sin datos personales. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-MIG-5001 — ESC-MIG-01. Repetir el lote MIG-DEMO-001**

- Cubre: ESC-MIG-01; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Repetir el lote MIG-DEMO-001
- Entonces 0 duplicados; corrida `unchanged`.

**CP-MIG-5002 — ESC-MIG-02. Snapshot con una factura agrupada que mezcla titulares**

- Cubre: ESC-MIG-02; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Snapshot con una factura agrupada que mezcla titulares
- Entonces Rechazo fiscal `FAC-GROUP-FISCAL`.

**CP-MIG-5003 — ESC-MIG-03. Pago parcial histórico sin servicio**

- Cubre: ESC-MIG-03; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago parcial histórico sin servicio
- Entonces Reparto por PRM-MIG-011 con advertencia; saldo por servicio cuadra con total.

**CP-MIG-5004 — ESC-MIG-04. Cuenta con `COD_SUM` de 10 dígitos**

- Cubre: ESC-MIG-04; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cuenta con `COD_SUM` de 10 dígitos
- Entonces Identificador como texto, sin desborde.

**CP-MIG-5005 — ESC-MIG-05. Factura ProCoop ≥ ARS 100.000 cobrada con código SIRO extendido `0448`**

- Cubre: ESC-MIG-05; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura ProCoop ≥ ARS 100.000 cobrada con código SIRO extendido `0448`
- Entonces Leída y resuelta.

**CP-MIG-5006 — ESC-MIG-06. Dos comprobantes impagos de igual importe en rendición vieja**

- Cubre: ESC-MIG-06; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos comprobantes impagos de igual importe en rendición vieja
- Entonces Pago a cuenta con aviso.

**CP-MIG-5007 — ESC-MIG-07. Reproceso tras cambio operativo en GoodApps**

- Cubre: ESC-MIG-07; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reproceso tras cambio operativo en GoodApps
- Entonces Conflicto, sin sobrescritura.

**CP-MIG-5008 — ESC-MIG-08. Intento de cargar snapshot real en `test`**

- Cubre: ESC-MIG-08; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Intento de cargar snapshot real en `test`
- Entonces Rechazado `/problems/mig-snapshot-not-anonymized`.

**CP-MIG-5009 — ESC-MIG-09. Rollback después de la primera emisión fiscal**

- Cubre: ESC-MIG-09; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Rollback: Ventana hasta la primera emisión fiscal real
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rollback después de la primera emisión fiscal
- Entonces Bloqueado; solo rollback hacia adelante.

**CP-MIG-5010 — ESC-MIG-10. Usuario del portal con correo duplicado en dos cuentas**

- Cubre: ESC-MIG-10; T07 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario del portal con correo duplicado en dos cuentas
- Entonces Un usuario con dos cuentas vinculadas.

**CP-MIG-5011 — ESC-01. ESC-05 (cambio de condiciones en período parcialmente procesado) aplicado a un período abierto al corte**

- Cubre: ESC-01; relacionados: ESC-05; T07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando ESC-05 (cambio de condiciones en período parcialmente procesado) aplicado a un período abierto al corte
- Entonces Las versiones tarifarias migradas permiten refacturar sin reescribir documentos.

## 3. Casos por caso de uso (CU)

**CP-MIG-8001 — CU-31. Importación con validación previa**

- Cubre: CU-31; RF-MIG-043, RF-MIG-050, RF-MIG-052, RF-MIG-053; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Lote CU-31: `MIG-DEMO-001`: 3 filas, 2 válidas, 1 error "Suministro sin titular asociado"
- Dado lote `MIG-DEMO-001`, 3 filas, 2 válidas, error "Suministro sin titular asociado".; actor: implementador y responsable del área. Situación inicial: archivo de demostración con tres suministros, uno inconsistente. Desarrollo: (1) validación previa con errores por fila; (2) corregir la fila observada o excluirla explícitamente y aprobar la carga; (3) importar, comparar cantidades y saldos y conservar el reporte de…
- Cuando Importación con validación previa
- Entonces Datos aceptados con identificador de ejecución y evidencia del control realizado. Excepción: si se repite el mismo lote, reconocerlo y evitar duplicados; una corrección debe tener una ejecución identificada. Cubierto por RF-MIG-043, RF-MIG-050, RF-MIG-052, RF-MIG-053.

**CP-MIG-8002 — CU-MIG-01. Inventariar y perfilar una cooperativa**

- Cubre: CU-MIG-01; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Inventariar y perfilar una cooperativa
- Entonces Implementador registra fuentes, extrae snapshot full, el sistema perfila y precarga la matriz de 659 tablas con conteos; el analista revisa módulos sin uso y ajusta estrategias con motivo.

**CP-MIG-8003 — CU-MIG-02. Ensayo completo en tenant de ensayo**

- Cubre: CU-MIG-02; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ensayo completo en tenant de ensayo
- Entonces Líder lanza `dryRun` de todos los dominios; revisa rechazos; analista corrige en origen o staging; reproceso; conciliaciones; purga del ensayo y repetición con nuevo snapshot hasta 0 rechazos bloqueantes.

**CP-MIG-8004 — CU-MIG-03. Saneamiento de personas duplicadas**

- Cubre: CU-MIG-03; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Saneamiento de personas duplicadas
- Entonces Analista revisa grupo de tres registros con mismo DNI ficticio `20.000.001`; fusiona dos (mismo nombre) y deja el tercero (nombre distinto) para corregir en origen; las cuentas de ambos titulares siguen separadas.

**CP-MIG-8005 — CU-MIG-04. Conciliar deuda por titular y servicio**

- Cubre: CU-MIG-04; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Deuda migrada: ARS 1.245.300,00 en 3.120 documentos abiertos; diferencia ARS 8.000 explicada
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliar deuda por titular y servicio
- Entonces Contador revisa que la deuda migrada (ARS 1.245.300,00 ficticio) coincide con ProCoop y con la cuenta de deudores por servicios; una diferencia de ARS 8.000 corresponde a una rendición Red Link no importada; se importa, se reconcilia y se aprueba (ejemplo AGR-018).

**CP-MIG-8006 — CU-MIG-05. Corrida paralela de energía y gas**

- Cubre: CU-MIG-05; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Paralelo: 12.500 comprobantes; 12.430 iguales; 50 redondeo; 20 explicados
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corrida paralela de energía y gas
- Entonces Facturación simula el ciclo del período, importa lo emitido por ProCoop, compara 12.500 comprobantes (volumen BASE §97.8); 12.430 iguales, 50 por redondeo dentro de tolerancia, 20 explicados (configuración de un cargo adicional corregida y re-simulada); aprueba el ciclo.

**CP-MIG-8007 — CU-MIG-06. Comparar un comprobante agrupado (FAC-012)**

- Cubre: CU-MIG-06; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comparar un comprobante agrupado (FAC-012)
- Entonces Un grupo ProCoop con energía, internet y una tasa de terceros se compara renglón por renglón y por subtotal de servicio; internet difiere por prorrateo de alta a mitad de período; se clasifica `intendedFix` (regla AGR-017 documentada).

**CP-MIG-8008 — CU-MIG-07. By-pass comercial**

- Cubre: CU-MIG-07; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando By-pass comercial
- Entonces Responsable aprueba el by-pass de los dominios comerciales; ProCoop queda solo lectura para ellos; se activa la exportación diaria de asientos a ProCoop porque la contabilidad oficial sigue allí (DEC-069).

**CP-MIG-8009 — CU-MIG-08. Cobro con código de barras ProCoop después del corte**

- Cubre: CU-MIG-08; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobro con código de barras ProCoop después del corte
- Entonces Un socio paga en caja GoodApps una factura emitida por ProCoop; el lector reconoce formato SIRO 56 dígitos; el resolutor encuentra el comprobante impago por alias y lo imputa.

**CP-MIG-8010 — CU-MIG-09. Rendición Red Link con identificador viejo ambiguo**

- Cubre: CU-MIG-09; RN-MIG-033; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Alias: Código anterior `A-000123` → cuenta 1001 servicio Energía
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición Red Link con identificador viejo ambiguo
- Entonces Llega un pago con cuenta + servicio + importe que coincide con dos comprobantes impagos; el resolutor no imputa: genera pago a cuenta con aviso a cobranzas (RN-MIG-033).

**CP-MIG-8011 — CU-MIG-10. Corte definitivo**

- Cubre: CU-MIG-10; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Rollback: Ventana hasta la primera emisión fiscal real
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corte definitivo
- Entonces Runbook §9.9 completo, go con doble aprobación, emisión real habilitada, invitaciones al portal enviadas, acta firmada.

**CP-MIG-8012 — CU-MIG-11. Rollback dentro de la ventana**

- Cubre: CU-MIG-11; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Rollback: Ventana hasta la primera emisión fiscal real
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rollback dentro de la ventana
- Entonces Al día siguiente del corte, falla crítica antes de la primera emisión fiscal: se exporta el diario (cobros en caja y altas), se reabre ProCoop, se cargan los hechos y GoodApps vuelve a `procoopMaster`.

**CP-MIG-8013 — CU-MIG-12. Ambiente de prueba anonimizado**

- Cubre: CU-MIG-12; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Snapshot: `asOf` 01-03-2026, 659 tablas, 412 con datos (ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ambiente de prueba anonimizado
- Entonces Implementador genera snapshot anonimizado desde el real; la verificación de fuga da 0 coincidencias; se carga en `test` para pruebas de una ola.

**CP-MIG-8014 — CU-MIG-13. Socio consulta su historial**

- Cubre: CU-MIG-13; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Socio consulta su historial
- Entonces El socio entra al portal y ve sus facturas ProCoop de los últimos 24 meses con el PDF original.

**CP-MIG-8015 — CU-MIG-14. Reproceso con conflicto**

- Cubre: CU-MIG-14; T07 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T07 §18.
- Datos de prueba: Proyecto: `MIG-DEMO-01`, tenant `TEN-DEMO`, sigla `DEM`, ProCoop `10.4.6.722`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reproceso con conflicto
- Entonces Tras el corte de un dominio, un delta trae un cambio de domicilio de ProCoop sobre una cuenta ya modificada en GoodApps; el sistema registra conflicto y no sobrescribe.
