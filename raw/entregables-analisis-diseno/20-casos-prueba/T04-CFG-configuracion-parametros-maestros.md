# Casos de prueba de aceptación — T04 CFG — Configuración versionada, parámetros, tablas maestras y geografía

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T04-CFG-configuracion-parametros-maestros.md`](../../especificacion/anexos/T04-CFG-configuracion-parametros-maestros.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 143 CP de requisitos funcionales, 35 CP de escenarios ESC y 15 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T04 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Registro y modelo de parámetros (T04 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0001 | RF-CFG-001; T04 §5.1; PRO-O0-13 | O0 | Núcleo | funcional | TEN-001 con SOC: Servicios sociales SOC-FAM — Familiar Grupo/mes Cobertura familiar ficticia ARS 8.000/mes Beneficiarios registrados y cobertura aprobada | Cada parámetro se declara en código (paquete del módulo dueño) con: clave semántica, módulo, grupo, tipo, validación, ámbitos permitidos, default, clase de cambio, modo de vigencia, dependencias, visibilidad, sensibilidad, canal consumidor… | Un test de CI falla si una clave usada en código no está declarada o si una declaración no tiene tipo, default o clase de cambio. |
| CP-CFG-0002 | RF-CFG-002; T04 §5.1; PRO-O0-13 | O0 | Núcleo | integración | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | En cada despliegue un job idempotente sincroniza el registro de código con `parameterDefinitions` (alta, actualización de metadatos, deprecación) **sin pisar valores** del tenant. | Correr dos veces la sincronización no genera cambios; un valor configurado sobrevive a un cambio de descripción. |
| CP-CFG-0003 | RF-CFG-003; T04 §5.1; PRO-O0-13 | O0 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Una clave inexistente es un error de desarrollo: la lectura lanza excepción y registra alerta; nunca crea un registro "Sin Utilizar". | `config.get('x.y.inexistente')` lanza `ConfigKeyNotDeclared`; no aparece fila nueva. |
| CP-CFG-0004 | RF-CFG-004; T04 §5.1; PRO-O0-13 | O0 | Núcleo | regla | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Tipos soportados: `boolean`, `integer`, `decimal`, `money`, `percentage`, `string`, `text`, `date`, `time`, `dateTime`, `duration`, `enum`, `multiEnum`, `reference` (FK a colección con filtro), `accountRef` (cuenta contable)… | Cada tipo tiene validador, editor en PAN-CFG-03 y serialización probada. |
| CP-CFG-0005 | RF-CFG-005; T04 §5.1; PRO-O0-13 | O0 | Núcleo | regla | TEN-001 con TEL: Telefonía TEL-BAS — Básico Contrato/mes y minutos Abono con uso adicional ARS 6.000/mes + ARS 20/minuto adicional Línea activa; reglas de uso a… | Validaciones declarables: requerido, mínimo, máximo, paso, decimales, largo máximo, expresión regular, valores permitidos, referencia existente y activa, validador cruzado (función del módulo). | Guardar un valor fuera de rango devuelve 422 con el detalle por campo. |
| CP-CFG-0006 | RF-CFG-006; T04 §5.1; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Dependencias declarables entre parámetros: `requires` (A habilitado exige B con valor válido), `excludes`, `enables` (B solo visible si A), `derivedDefault`. Se evalúan al validar una versión. | Publicar `crm.turnero.webHabilitado = true` sin `crm.turnero.habilitado = true` falla en validación con mensaje que nombra la dependencia. |
| CP-CFG-0007 | RF-CFG-007; T04 §5.1; PRO-O0-13 | O0 | Núcleo | migración | TEN-001 con EFE: Efectivo Saldo pendiente del documento Cuando el cajero registra y confirma la recepción Caja abierta y recibo | El tipo mixto `P` de ProCoop (tres columnas a la vez) se descompone en parámetros tipados separados con una clave por significado. | Ninguna definición tiene más de un tipo; T04b registra la descomposición. |
| CP-CFG-0008 | RF-CFG-008; T04 §5.1; PRO-O0-13 | O0 | Núcleo | funcional | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Las fechas no se guardan como texto; `date` y `dateTime` se validan y se guardan en UTC con interpretación en la zona horaria del tenant. | Un valor `31-02-2026` se rechaza. |
| CP-CFG-0009 | RF-CFG-009; T04 §5.1; PRO-O0-13 | O0 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Las claves siguen la convención de §14.2 y son únicas en la plataforma; una clave publicada nunca se reutiliza con otro significado (se depreca y se crea otra). | Linter de registro valida patrón y unicidad. |
| CP-CFG-0010 | RF-CFG-010; T04 §5.1; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Cada definición declara su clase de cambio: `commercial`, `fiscal`, `operational`, `presentation`, `security`, `technical`. | La clase aparece en ficha y determina revisión/simulación. |
| CP-CFG-0011 | RF-CFG-011; T04 §5.1; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Facturación: Simulación, revisión y emisión Período abierto y tarifa vigente No reemite sin controlar el estado previo | Cada definición declara modo de vigencia: `immediate` (rige al publicar), `effectiveDate` (con fecha efectiva elegida), `periodBoundary` (solo desde el inicio de un período del módulo, por ejemplo ciclo de facturación). | Un cambio `periodBoundary` con fecha a mitad de ciclo se rechaza o se corre al inicio del próximo ciclo con aviso. |
| CP-CFG-0012 | RF-CFG-012; T04 §5.1; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Contabilidad: Asientos e informes Ejercicio y período habilitados Bloqueo de períodos cerrados | Los parámetros de un módulo no licenciado o no activado no se muestran ni se leen como habilitados (se devuelve el default "apagado"). | Tenant sin `tec` licenciado no ve claves `tec.*`. |
| CP-CFG-0013 | RF-CFG-013; T04 §5.1; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Versiones: V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). | Una definición puede declararse `sensitive` (cambio exige revisión con independencia de la clase) y `visibility` (`platformOnly`, `tenantAdmin`, `moduleConfigurator`). | Un parámetro sensible no puede publicarse por quien lo editó (PA-CFG-01). |
| CP-CFG-0014 | RF-CFG-014; T04 §5.1; PRO-O1-10 | O1 | Núcleo | seguridad | TEN-001 con QR: Pago QR Saldo pendiente Confirmación verificable del proveedor Identificador único y prevención de duplicados | Prohibido guardar secretos en parámetros: el tipo `secretRef` almacena solo el identificador del secreto de la bóveda (T06) y su estado (configurado / faltante / vencido). | Un escáner de CI y un validador de runtime rechazan valores con patrón de contraseña/token en parámetros `string`. |
| CP-CFG-0015 | RF-CFG-015; T04 §5.1; PRO-O1-10 | O1 | Estándar | migración | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Deprecación controlada: una definición `deprecated` sigue leyéndose, muestra aviso y su reemplazo (`replacedBy`); `removed` deja de leerse tras migrar valores. | Migración de valor de clave deprecada a reemplazo registrada en auditoría. |
| CP-CFG-0016 | RF-CFG-016; T04 §5.1; PRO-O1-10 | O1 | Núcleo | migración | TEN-001 con CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad… | Cada definición registra equivalencias legacy (`VARIABLE`/`VARIABLE_PMOVIL`, `COD_VAR`, `MOD_VAR`, `TIP_VAR`, `TIP_CTRL`, `CONF_CTRL`) y la regla de transformación del valor (incluida inversión de booleanos negativos). | La migración de una base ProCoop produce el valor equivalente para cada clave con equivalencia. |
| CP-CFG-0017 | RF-CFG-017; T04 §5.1; PRO-O2-02 | O2 | Estándar | migración | TEN-001 con Atención: Personas, solicitudes y consultas Canal Presencial; sucursal del operador No modifica importes emitidos | Los textos de personalización del portal que ProCoop guardaba como parámetros (`VARIABLE_PMOVIL` canal CoopOnline) pasan a claves del diccionario por tenant (T03) o a parámetros `presentation` de M19, según sean etiqueta o comportamiento. | Ningún texto visible del portal se lee desde un parámetro `string` sin pasar por diccionario. |
### 1.2 Ámbitos y lectura (T04 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0018 | RF-CFG-018; T04 §5.2; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Ámbitos soportados: `platform`, `tenant`, `branch` (sucursal), `service`, `category` (categoría tarifaria del servicio), `user`. Cada definición declara cuáles admite. | Guardar un valor en un ámbito no admitido devuelve 422. |
| CP-CFG-0019 | RF-CFG-019; T04 §5.2; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Precedencia de resolución, de más específico a más general: `user` → `category` → `service` → `branch` → `tenant` → `platform` (default de plataforma configurable) → default de la definición. | Test de matriz de precedencia con todos los ámbitos. |
| CP-CFG-0020 | RF-CFG-020; T04 §5.2; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Lectura única `config.get(clave, { tenantId, branchId, serviceId, categoryId, userId, at, knownAt })`: `at` = fecha efectiva a interpretar (default: ahora en zona del tenant); `knownAt` = fecha de registro para reconstrucción histórica… | `config.get` con `at` pasado devuelve el valor vigente entonces; con `knownAt` pasado devuelve lo que se sabía entonces. |
| CP-CFG-0021 | RF-CFG-021; T04 §5.2; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | La respuesta de lectura incluye `value`, `scopeResolved`, `valueId`, `configVersionId`, `validFrom`, `validTo`, para que cada documento registre qué configuración usó. | Un documento emitido guarda la lista de `valueId`/`configVersionId` relevantes (huella de configuración). |
| CP-CFG-0022 | RF-CFG-022; T04 §5.2; PRO-O1-10 | O1 | Núcleo | seguridad | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Caché en memoria por proceso con invalidación por evento `cfg.configVersion.published` y por vencimiento de vigencia; nunca sirve un valor de otro tenant. | Tras publicar, todos los procesos leen el valor nuevo en < 5 s (RNF-CFG-002). |
| CP-CFG-0023 | RF-CFG-023; T04 §5.2; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Lectura masiva por módulo/grupo para pantallas y apps (`/api/admin/cfg/effective?module=`) y lectura pública acotada para PWA/landing solo de claves con `channel` público. | La landing no puede leer claves no marcadas `public`. |
| CP-CFG-0024 | RF-CFG-024; T04 §5.2; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Los parámetros de ámbito `user` son solo preferencias sin efecto económico; ninguna clave `commercial`, `fiscal` o `security` admite ámbito `user`. | El linter de registro rechaza la combinación. |
| CP-CFG-0025 | RF-CFG-025; T04 §5.2; PRO-O1-10 | O1 | Estándar | funcional | TEN-001 con INS-INT: Instalación de internet ARS 30.000 por única vez Cargo aprobado Cuándo se devenga y si puede financiarse | El usuario puede ver el **valor efectivo** de cualquier clave para un contexto (sucursal/servicio/categoría) y de qué ámbito proviene. | PAN-CFG-03 muestra la cadena de resolución. |
### 1.3 Versiones de configuración, publicación e historia (T04 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0026 | RF-CFG-026; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Todo cambio de configuración (parámetros, registros maestros del tenant, enumeraciones, campos extra, personalizaciones de formularios y configuraciones de módulo que se registren en el motor) se hace dentro de una `configVersion` en… | No hay endpoint que modifique un `parameterValue` publicado. |
| CP-CFG-0027 | RF-CFG-027; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Un borrador puede contener cambios de varios módulos y clases; muestra el **diff** contra la configuración vigente a la fecha efectiva elegida (antes/después por ítem). | PAN-CFG-05 lista cada ítem con valor anterior, nuevo y ámbito. |
| CP-CFG-0028 | RF-CFG-028; T04 §5.3; PRO-O1-10 | O1 | Núcleo | seguridad | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | **Validación** de la versión: tipos y rangos, dependencias, referencias existentes y vigentes en el tenant, validadores cruzados de los módulos, completitud de los perfiles de servicio afectados, y ausencia de referencias a otro tenant. | Una versión con un plan visible sin precio vigente o con referencia a un impuesto/cuenta de otro tenant no pasa validación. |
| CP-CFG-0029 | RF-CFG-029; T04 §5.3; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | **Simulación**: el motor invoca los simuladores registrados por los módulos afectados (ej.: M05 primera factura de un plan; M08 interés de una deuda de ejemplo; M04 tarifa de una categoría) sin generar efectos; guarda el reporte en la… | La simulación no crea documentos ni eventos de negocio; su reporte queda adjunto y es reproducible. |
| CP-CFG-0030 | RF-CFG-030; T04 §5.3; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con Facturación: Simulación, revisión y emisión Período abierto y tarifa vigente No reemite sin controlar el estado previo | Separación por clase de cambio: una versión solo de `presentation` no dispara simulación tarifaria ni revisión comercial. | Cambiar una etiqueta publica sin pasos comerciales. |
| CP-CFG-0031 | RF-CFG-031; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Versiones: V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). | **Revisión**: según política del tenant (PRM-CFG-001..003) una versión requiere aprobación por un usuario distinto del autor, mediante workflow de T11. | El autor no puede aprobar su propia versión sensible. |
| CP-CFG-0032 | RF-CFG-032; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | **Fecha efectiva** por versión (y opcionalmente por ítem cuando el modo de vigencia lo permite); la publicación puede programarse para una fecha/hora futura. | Una versión programada para 01-06-2026 00:00 (zona del tenant) rige desde entonces y no antes. |
| CP-CFG-0033 | RF-CFG-033; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad… | **Publicación íntegra y atómica**: todos los ítems de la versión se vuelven vigentes en una sola transacción; si un ítem falla, no se publica ninguno. | Fallo inyectado en un ítem deja la configuración vigente intacta. |
| CP-CFG-0034 | RF-CFG-034; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con Atención: Personas, solicitudes y consultas Canal Presencial; sucursal del operador No modifica importes emitidos | Una publicación no reescribe contratos ni documentos vigentes ni emitidos; si un cambio afecta contratos vigentes, la versión declara la política (aplicar a nuevos / aplicar desde fecha a todos / requerir acción) y la publicación emite… | Publicar un nuevo precio no modifica facturas emitidas. |
| CP-CFG-0035 | RF-CFG-035; T04 §5.3; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | **Retroactividad**: una versión con fecha efectiva pasada solo se admite según PRM-CFG-005/006, requiere aprobación, y su efecto sobre operaciones ya emitidas/cerradas se resuelve con ajustes del módulo dueño, nunca reescribiendo el… | Tarifa cargada el 15 con vigencia desde el 1: queda registrada con `validFrom = 01` y `recordedAt = 15`; las facturas emitidas entre el 1 y el 15 no cambian y M05 recibe evento para ajustes. |
| CP-CFG-0036 | RF-CFG-036; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | **Historia bitemporal** de cada valor: `validFrom`/`validTo` (efectiva) y `recordedAt`/`supersededAt` (registro), origen (`manual`, `import`, `copy`, `seed`, `migration`, `platform`), versión y actor. | PAN-CFG-06 responde "qué valor regía el 10-03 según lo conocido el 12-03". |
| CP-CFG-0037 | RF-CFG-037; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con AB-INT: Abono de internet ARS 25.000/mes Plan y tarifa Prorrateo y fecha de inicio a definir | Las consultas históricas declaran qué fecha interpretan (efectiva o de registro) en la pantalla y en la exportación. | Cabecera de exportación indica `at` y `knownAt`. |
| CP-CFG-0038 | RF-CFG-038; T04 §5.3; PRO-O1-10 | O1 | Estándar | regla | TEN-001 con GAS: Gas GAS-RES — Residencial m³ Medido; fórmula simplificada ARS 3.500 fijos + ARS 200/m³ Aprobación técnica y medición | **Reversión**: una versión publicada puede revertirse creando una versión nueva que restituye los valores anteriores (con su propia fecha efectiva y aprobación); nunca se borra la versión revertida. | Revertir genera `configVersion` con `origin = rollback` y referencia a la original. |
| CP-CFG-0039 | RF-CFG-039; T04 §5.3; PRO-O1-10 | O1 | Estándar | funcional | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | Cancelación de una versión programada antes de su fecha efectiva, con motivo. | Versión `scheduled` pasa a `cancelled`; no deja valores. |
| CP-CFG-0040 | RF-CFG-040; T04 §5.3; PRO-O1-10 | O1 | Estándar | regla | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Conflictos: dos borradores que tocan el mismo ítem se detectan; al publicar el segundo se exige rebase (recalcular diff contra lo vigente). | No se publica una versión cuyo "antes" ya no coincide con lo vigente. |
| CP-CFG-0041 | RF-CFG-041; T04 §5.3; PRO-O2-02 | O2 | Núcleo | migración | TEN-001 con Versiones: V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). | Origen de versiones: manual, importación, copia entre tenants (M02, BASE §81), semilla, migración, plataforma (actualización de tablas adoptadas), reversión. La copia llega siempre como **borrador del destino** con dependencias pendientes. | Una copia nunca se publica sin validación y aprobación en el destino. |
| CP-CFG-0042 | RF-CFG-042; T04 §5.3; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | Auditoría completa de cada transición de versión y de cada ítem (antes/después), con usuario, IP, sesión de soporte si aplica, y motivo. | Auditoría exportable con valores antes/después. |
| CP-CFG-0043 | RF-CFG-043; T04 §5.3; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con Versiones: V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). | Una versión puede incluir configuración propia de un módulo (tarifas, planes, formularios, tipos de gestión) a través de la interfaz `ConfigContributor` que cada módulo implementa (validar, aplicar, simular, diff). | M02/M04 registran su contributor y sus ítems aparecen en el diff de la versión. |
| CP-CFG-0044 | RF-CFG-044; T04 §5.3; PRO-O1-10 | O1 | Núcleo | regla | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Registro de cada configuración regulada con fuente (norma/resolución), jurisdicción y vigencia. | Un ítem `fiscal` o de tarifa regulada sin `sourceRef` no pasa validación. |
### 1.4 Tablas maestras (editor uniforme) (T04 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0045 | RF-CFG-045; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Registro de tablas maestras (`masterTableDefinitions`) con código, módulo dueño, ámbito (`platform`, `tenant`, `platformAdoptable`), esquema de campos, clave natural, si es vigenciada, si es importable, si admite unificación y si sus… | Agregar una tabla nueva no requiere pantalla nueva. |
| CP-CFG-0046 | RF-CFG-046; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Editor uniforme (PAN-CFG-08) con `DataTable`: búsqueda por texto y por campos, filtros, orden, columnas configurables, vistas guardadas, exportar XLSX/CSV/PDF, alta/edición en modal, baja lógica, historial por registro. | Las tablas de §7 se administran con el mismo componente. |
| CP-CFG-0047 | RF-CFG-047; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad… | Vigencias por registro (`validFrom`/`validTo`); la grilla muestra por defecto los vigentes a hoy y permite consultar a una fecha. | Consultar a fecha pasada muestra la versión vigente entonces. |
| CP-CFG-0048 | RF-CFG-048; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | "En uso por": antes de inactivar o unificar un registro, el sistema muestra cuántas referencias tiene por colección/módulo; un registro referenciado no se borra, se inactiva. | Intentar borrar una localidad con domicilios muestra conteo y ofrece inactivar. |
| CP-CFG-0049 | RF-CFG-049; T04 §5.4; PRO-O1-11 | O1 | Estándar | integración | TEN-001 con Enumeraciones: Estado civil (soltero/a, casado/a, divorciado/a, viudo/a, unión convivencial); sexo registral (F, M, X); ocupaciones de ejemplo (empleado/a… | Unificación de duplicados (barrios, calles locales, localidades del tenant, enumeraciones): elige registro sobreviviente, redirige referencias por job idempotente, conserva el duplicado como `merged` con puntero. | Tras unificar, ninguna referencia apunta al duplicado; auditoría con conteos. |
| CP-CFG-0050 | RF-CFG-050; T04 §5.4; PRO-O1-11 | O1 | Núcleo | integración | TEN-001 con Monedas: ARS (`PES`), USD (`DOL`) [VERIFICAR códigos ARCA]. | Códigos externos por registro (ARCA, INAES, ENARGAS, OCEBA, ERSeP, ENACOM, SENASA/`COD_SEN`, Georef, INDEC) en un mapa `externalCodes`. | Exportar a ENARGAS usa `externalCodes.enargas` de la localidad. |
| CP-CFG-0051 | RF-CFG-051; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Las tablas de plataforma se ven en el tenant en solo lectura; el tenant puede agregar **registros propios** (overlay) solo en las tablas que lo admiten (ej.: feriados municipales, localidades rurales no listadas) y **atributos propios**… | Un tenant no puede editar el nombre de una provincia; sí agregar su atributo `km`. |
| CP-CFG-0052 | RF-CFG-052; T04 §5.4; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Selectores (lookups) uniformes para todos los módulos: búsqueda incremental, filtro por padre (provincia → localidad → calle), solo vigentes, paginados. | Un selector de calles filtra por localidad y responde < 300 ms p95. |
| CP-CFG-0053 | RF-CFG-053; T04 §5.4; PRO-O1-11 | O1 | Estándar | funcional | TEN-001 con REC-PEND: Recargo por mora Deshabilitado en la demostración Política autorizada Base, tasa, períodos y excepciones a definir | Los cambios a tablas maestras del tenant marcadas `versioned` pasan por `configVersion`; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. | La política por tabla está en su definición. |
### 1.5 Importación de padrones y maestros (T04 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0054 | RF-CFG-054; T04 §5.5; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | Importación por archivo (XLSX/CSV/TXT de ancho fijo) de cualquier tabla maestra importable con `ExcelImportWizard`: subir → mapear columnas → vista previa con errores por fila → confirmar → job → resultado descargable. | Importar 50.000 calles con 30 errores muestra los 30 sin importar parcialmente sin confirmación. |
| CP-CFG-0055 | RF-CFG-055; T04 §5.5; PRO-O1-11 | O1 | Núcleo | integración | TEN-001 con CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad | Modos de importación: alta solamente, alta y actualización por clave natural, reemplazo de vigencia (cierra vigentes y abre nuevos). | Reimportar el mismo archivo es idempotente. |
| CP-CFG-0056 | RF-CFG-056; T04 §5.5; PRO-O4-01 | O4 | Núcleo | integración | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Ingesta de padrones fiscales (ARCA, IIBB provinciales) por archivo o por integración, con jurisdicción, régimen, fecha de publicación, vigencia desde/hasta, alícuota y grupo; consulta por CUIT a fecha. | Consultar CUIT ficticio 30-00000000-0 al 15-05-2026 devuelve la alícuota del padrón vigente. |
| CP-CFG-0057 | RF-CFG-057; T04 §5.5; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con TAR: Tarjeta por proveedor integrado Saldo pendiente Estado autorizado/confirmado definido para la integración Rechazos, devoluciones y contracargos | Las importaciones grandes corren como job (`cfg:importar-maestro`) reanudable, con progreso, cancelación y archivo de errores; quedan asociadas a la `configVersion` o a la `platformTableRelease` que generan. | Cancelar a mitad deja el estado anterior intacto. |
| CP-CFG-0058 | RF-CFG-058; T04 §5.5; PRO-O1-11 | O1 | Estándar | funcional | TEN-001 con Reclamo: Abierto; Asignado; En tratamiento; Resuelto; Cerrado; Reabierto Registrar motivo, responsable y cambios | Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). | El archivo exportado se reimporta sin cambios. |
### 1.6 Precarga de catálogos de ejemplo (T04 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0059 | RF-CFG-059; T04 §5.6; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Paquetes semilla versionados por plataforma; el paquete `demo-base-s39` contiene **toda** la BASE §39 (servicios/planes, conceptos de liquidación, medios de cobro, estados seleccionables y roles con valores sugeridos) más geografía y… | Aplicar el paquete a un tenant demo deja recorribles los flujos de §39 sin inventar datos. |
| CP-CFG-0060 | RF-CFG-060; T04 §5.6; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con REC-PEND: Recargo por mora Deshabilitado en la demostración Política autorizada Base, tasa, períodos y excepciones a definir | Los datos de demostración se identifican (`demoData: true` y `seedApplicationId`) y se mantienen separados de los operativos; pueden retirarse en bloque. | Retirar la semilla borra solo registros marcados y no toca datos creados por usuarios. |
| CP-CFG-0061 | RF-CFG-061; T04 §5.6; PRO-O2-02 | O2 | Núcleo | regla | TEN-001 con Versiones: V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). | Un valor sugerido nunca se acepta silenciosamente para configuración sensible: la semilla genera una `configVersion` en borrador que requiere aprobación. | La semilla no publica por sí misma tarifas ni recargos. |
| CP-CFG-0062 | RF-CFG-062; T04 §5.6; PRO-O2-02 | O2 | Núcleo | regla | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Un dato desconocido queda vacío o pendiente: la semilla no completa con cero, fechas inventadas ni autorizaciones supuestas (ej.: tributos `TRIB-PEND` y recargo `REC-PEND` quedan sin valor/deshabilitados). | `TRIB-PEND` queda en estado pendiente de validación fiscal. |
| CP-CFG-0063 | RF-CFG-063; T04 §5.6; PRO-O2-02 | O2 | Estándar | regla | TEN-001 con Comprobante: Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado Separar estado documental de saldo | Los valores sugeridos al operar (servicio → unidad/periodicidad/requisitos; contrato → titular/inmueble/tarifa vigente; comprobante a cobrar → saldo pendiente con pago parcial si tiene permiso) se configuran como defaults declarados en los… | M07 propone el saldo pendiente y permite parcial solo con permiso. |
| CP-CFG-0064 | RF-CFG-064; T04 §5.6; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | Solo se aplican semillas en tenants marcados demo/sandbox, salvo plantillas sin importes. | Un tenant productivo no ofrece "aplicar semilla demo". |
### 1.7 Geografía, calles y mapas (T04 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0065 | RF-CFG-065; T04 §5.7; PRO-O1-12 | O1 | Núcleo | integración | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Catálogo de plataforma de países, provincias (24 jurisdicciones), departamentos/partidos, municipios/gobiernos locales y localidades/asentamientos de Argentina, con códigos INDEC/Georef y códigos externos (ARCA, INAES, ENARGAS, OCEBA). | Las 24 provincias y sus departamentos están cargados con código INDEC. |
| CP-CFG-0066 | RF-CFG-066; T04 §5.7; PRO-O1-12 | O1 | Estándar | funcional | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Códigos postales: CP numérico de 4 dígitos por localidad y CPA (alfanumérico de 8) cuando la fuente lo provea, con relación muchos-a-muchos localidad ↔ CP. | Buscar por CP 5000 devuelve las localidades asociadas. |
| CP-CFG-0067 | RF-CFG-067; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | **GEO-001** Catálogo nacional de calles: calles de Argentina por localidad/departamento con nombre, tipo, alturas inicio/fin por lado cuando existan, identificador y fuente; búsqueda por nombre y contexto territorial; homónimos… | Buscar "San Martín" en Córdoba devuelve candidatos por localidad, nunca uno solo sin contexto. |
| CP-CFG-0068 | RF-CFG-068; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | El catálogo nacional se ingesta en plataforma desde la fuente oficial elegida con frecuencia configurable, conservando identificador de fuente, fecha de ingesta, atribución y licencia. | Cada calle muestra fuente y fecha de actualización. |
| CP-CFG-0069 | RF-CFG-069; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Calles locales del tenant: si la calle no aparece (loteo nuevo, rural), el operador la carga localmente con estado `pendingValidation`; puede proponerse a plataforma (`streetProposals`). | La calle local solo la ve su tenant hasta aprobarse. |
| CP-CFG-0070 | RF-CFG-070; T04 §5.7; PRO-O1-12 | O1 | Estándar | migración | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Alias de calles por tenant (nombre histórico/popular → calle del catálogo) para búsqueda y migración. | Buscar el nombre viejo devuelve la calle actual. |
| CP-CFG-0071 | RF-CFG-071; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Barrios por localidad (tenant, con posibilidad de plataforma si la fuente los publica), zonas del tenant (organización territorial para lectura y operación, con polígono opcional), distritos y secciones catastrales del tenant. | Un barrio pertenece a una localidad; una zona puede abarcar varias localidades. |
| CP-CFG-0072 | RF-CFG-072; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Esquema compartido `geoReference` (embebido en direcciones de M01 y en otras entidades): texto original, dirección normalizada, componentes (provincia, departamento, localidad, calle, altura, piso, unidad, entrecalles, barrio, referencias… | No existe un punto sin fuente ni estado. |
| CP-CFG-0073 | RF-CFG-073; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Comprobante: Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado Separar estado documental de saldo | **GEO-002** Normalización y geocodificación: a partir de la dirección, el servicio devuelve candidatos con precisión declarada; nunca presenta precisión no disponible. Georef normaliza y geocodifica; Google Maps se usa para el mapa y el… | Si solo hay coincidencia a nivel localidad, el estado es `approximate` con precisión `locality`. |
| CP-CFG-0074 | RF-CFG-074; T04 §5.7; PRO-O1-12 | O1 | Núcleo | regla | TEN-001 con AJU-COM: Ajuste comercial Importe sujeto a aprobación Expediente autorizado Motivo y documentación correctiva | **GEO-003** Componente de mapa (Google Maps) para mostrar y confirmar/corregir el punto de prestación por usuario autorizado (arrastrar marcador, coordenadas), registrando fuente, momento y motivo. | Mover el marcador cambia estado a `confirmed` con `source = manual-assisted` y motivo obligatorio. |
| CP-CFG-0075 | RF-CFG-075; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Ubicación por coordenadas o referencias cuando no hay coincidencia calle/altura, con revisión (cola PAN-CFG-15). | Un punto manual sin calle queda `inReview`. |
| CP-CFG-0076 | RF-CFG-076; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con ELE: Electricidad ELE-RES — Residencial kWh Medido ARS 4.000 fijos + ARS 100/kWh Factibilidad y medidor instalado | Uso de la ubicación del dispositivo solo con permiso explícito y siempre con alternativa manual; la posición del dispositivo no se toma como domicilio contratado. | Denegar permiso de ubicación no impide completar el formulario. |
| CP-CFG-0077 | RF-CFG-077; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Solicitud: Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada Aprobar una solicitud no implica servicio instalado | Tolerancia a caídas o límites de las fuentes: el formulario se guarda con estado `pending` y un job reintenta el enriquecimiento (`cfg:geocodificar-pendientes`). | Con Google caído, la solicitud se guarda y luego se geocodifica. |
| CP-CFG-0078 | RF-CFG-078; T04 §5.7; PRO-O1-12 | O1 | Núcleo | seguridad | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Separación del catálogo geográfico compartido (plataforma) de los domicilios y datos privados del tenant; las geocodificaciones de un tenant no son visibles para otro. | Test de aislamiento sobre `geocodeRequests`. |
| CP-CFG-0079 | RF-CFG-079; T04 §5.7; PRO-O1-12 | O1 | Núcleo | seguridad | TEN-001 con BON-PROM: Bonificación promocional 10 % sobre abono de internet Promoción autorizada Base, duración y compatibilidad | Control de acceso al mapa, exportaciones y API de domicilios por tenant, capability y relación autorizada. | Un operador sin alcance sobre la zona no ve los puntos de esa zona. |
| CP-CFG-0080 | RF-CFG-080; T04 §5.7; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Contrato: Solicitado; Pendiente de instalación; Activo; Suspendido; Cerrado Fechas efectivas y condiciones de cada cambio | Persistencia de resultados de proveedores según sus condiciones de uso; no se usa Google como descarga indiscriminada de calles. | No existe job que descargue calles desde Google. |
| CP-CFG-0081 | RF-CFG-081; T04 §5.7; PRO-O1-12 | O1 | Estándar | funcional | TEN-001 con CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad… | Configuración de mapa por tenant y por módulo (centro, zoom, capa base, marcadores) en reemplazo de la tabla `MAPA`. | PRM-CFG-019/020 por módulo. |
| CP-CFG-0082 | RF-CFG-082; T04 §5.7; PRO-O1-12 | O1 | Núcleo | seguridad | TEN-001 con CV-AG: Consumo de agua 20 m³ × ARS 500 Consumo aprobado y tarifa No usar lectura capturada sin validar | Cuota y clave de Google Maps: uso con clave de plataforma con cuota por tenant o clave propia en bóveda; métricas de consumo por tenant. | Al superar la cuota el componente degrada a búsqueda sin mapa y avisa. |
| CP-CFG-0083 | RF-CFG-083; T04 §5.7; PRO-O1-12 | O1 | Estándar | funcional | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Historia de cambios de la georreferencia y relación con inmueble, contrato, ticket y orden técnica (la relación la mantiene el dueño; CFG provee el historial del subdocumento). | Ver historia del punto desde la ficha del inmueble. |
### 1.8 Calendarios, feriados y días hábiles (T04 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0084 | RF-CFG-084; T04 §5.8; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Calendarios jerárquicos: nacional (plataforma), provincial (plataforma), municipal (tenant), del tenant (días no laborables propios, asuetos) y opcionalmente por servicio. Un tenant/sucursal/servicio declara qué calendarios aplica. | Un servicio en una localidad con feriado municipal suma ese día como no hábil. |
| CP-CFG-0085 | RF-CFG-085; T04 §5.8; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Feriados con fecha, tipo (inamovible, trasladable, puente/no laborable, local, asueto), descripción, fuente/norma, año; recurrentes por día/mes cuando corresponda. | Cargar un feriado sin año lo marca recurrente. |
| CP-CFG-0086 | RF-CFG-086; T04 §5.8; PRO-O1-12 | O1 | Núcleo | regla | TEN-001 con Solicitud: Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada Aprobar una solicitud no implica servicio instalado | Servicio de días hábiles: `isBusinessDay`, `nextBusinessDay`, `addBusinessDays`, `businessDaysBetween`, con zona horaria del tenant y fines de semana configurables. | Vencimiento que cae domingo con regla "siguiente hábil" pasa a lunes, o a martes si el lunes es feriado. |
| CP-CFG-0087 | RF-CFG-087; T04 §5.8; PRO-O1-12 | O1 | Núcleo | regla | TEN-001 con Liquidación: Borrador; Con observaciones; Aprobada; Emitida Evitar modificar el cálculo que respalda un documento definitivo | Diferenciación de calendarios de lectura, liquidación, emisión y vencimiento: CFG provee días hábiles; los cronogramas los define M05/M03 usando este servicio. | M05 no implementa cálculo de feriados propio. |
| CP-CFG-0088 | RF-CFG-088; T04 §5.8; PRO-O1-12 | O1 | Núcleo | funcional | TEN-001 con Contrato: Solicitado; Pendiente de instalación; Activo; Suspendido; Cerrado Fechas efectivas y condiciones de cada cambio | Fronteras temporales reproducibles: zona horaria del tenant, inclusión de días, meses cortos y años bisiestos; los resultados no dependen del horario del servidor. | Suite de pruebas con 29-02-2028, 31-01 + 1 mes, cambio a las 23:59 en la zona del tenant. |
| CP-CFG-0089 | RF-CFG-089; T04 §5.8; PRO-O1-12 | O1 | Estándar | regla | TEN-001 con Atención: Personas, solicitudes y consultas Canal Presencial; sucursal del operador No modifica importes emitidos | Publicar o corregir un feriado emite `cfg.holiday.changed` para que los módulos recalculen vencimientos **no emitidos**; los emitidos no cambian. | Un feriado agregado tarde no modifica facturas ya emitidas. |
### 1.9 Índices económicos y monedas (T04 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0090 | RF-CFG-090; T04 §5.9; PRO-O5-01 | O5 | Núcleo | funcional | TEN-001 con Índices: Serie propia ficticia "MORA-DEMO" mensual 3,0 %; serie "USD-DEMO" vendedor ARS 1.000,00 al 02-11-2026 (ficticia); "IPC-DEMO" base 100 en 01-2026 con… | Series de índices (`economicIndexSeries`): inflación (IPC nacional/regional INDEC, índices propios), cotizaciones de moneda (comprador/vendedor, por fecha y hora), tasas e índices para mora (diarios/mensuales), y otras (CER, UVA, ICL) con… | Cada serie muestra fuente y última publicación. |
| CP-CFG-0091 | RF-CFG-091; T04 §5.9; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Series de plataforma adoptables: el tenant elige qué serie oficial usa para cada propósito (PRM-CFG-024/025) o crea series propias (ej.: tabla de recargo propia de la cooperativa). | M08 lee la serie por propósito, no un código fijo. |
| CP-CFG-0092 | RF-CFG-092; T04 §5.9; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Facturación: Simulación, revisión y emisión Período abierto y tarifa vigente No reemite sin controlar el estado previo | Valores con `Decimal128`, período o fecha, `publishedAt`, `recordedAt`, estado (`provisional`, `definitive`), revisión de un valor anterior sin borrarlo. | Revisar el IPC de un mes deja el valor anterior consultable con `knownAt`. |
| CP-CFG-0093 | RF-CFG-093; T04 §5.9; PRO-O5-01 | O5 | Estándar | integración | TEN-001 con TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar | Ingesta automática de series oficiales (cotizaciones diarias, tasas, IPC mensual) por job con reintentos y alerta si falta un valor esperado. | Si a las 18:00 no hay cotización del día, se alerta al curador. |
| CP-CFG-0094 | RF-CFG-094; T04 §5.9; PRO-O5-01 | O5 | Núcleo | funcional | TEN-001 con AB-INT: Abono de internet ARS 25.000/mes Plan y tarifa Prorrateo y fecha de inicio a definir | Carga manual e importación de valores de series propias del tenant con auditoría. | Cargar cotización manual exige fecha, hora y fuente. |
| CP-CFG-0095 | RF-CFG-095; T04 §5.9; PRO-O4-01 | O4 | Núcleo | integración | TEN-001 con Monedas: ARS (`PES`), USD (`DOL`) [VERIFICAR códigos ARCA]. | Catálogo de monedas (plataforma: ISO 4217 + código ARCA) con atributos del tenant: símbolo, divisible, redondeo, porcentaje de percepción, vuelto, permitido para cobro. | ARS (`PES`) y USD (`DOL`) precargadas. |
| CP-CFG-0096 | RF-CFG-096; T04 §5.9; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con AB-INT: Abono de internet ARS 25.000/mes Plan y tarifa Prorrateo y fecha de inicio a definir | Consulta de valor de una serie a una fecha con regla de ausencia declarada (último publicado anterior / exacto o error). | Pedir cotización de un sábado con regla "último anterior" devuelve la del viernes. |
### 1.10 Tablas fiscales comunes y padrones (T04 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0097 | RF-CFG-097; T04 §5.10; PRO-O2-02 | O2 | Núcleo | integración | TEN-001 con Comprobante: Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado Separar estado documental de saldo | Tabla de plataforma de condiciones frente al IVA con código ARCA de condición del receptor, comprobante por defecto (A/B/C) como atributo sugerido, y vigencia. | M01 asigna condición IVA a una persona desde esta tabla. |
| CP-CFG-0098 | RF-CFG-098; T04 §5.10; PRO-O4-01 | O4 | Núcleo | integración | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Tabla de plataforma de alícuotas de IVA con código ARCA, porcentaje y vigencia; las cuentas contables por alícuota son atributo del tenant (M15) y los porcentajes por condición son reglas de M06. | 21 % (código 5) y 10,5 % (código 4) vigentes. |
| CP-CFG-0099 | RF-CFG-099; T04 §5.10; PRO-O4-01 | O4 | Núcleo | regla | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Tabla de plataforma de situaciones frente a IIBB (local, Convenio Multilateral, exento, no inscripto, régimen simplificado) y de alícuotas de IIBB por jurisdicción y actividad con vigencia y norma. | Alícuota de una actividad en Córdoba consultable a fecha. |
| CP-CFG-0100 | RF-CFG-100; T04 §5.10; PRO-O1-11 | O1 | Núcleo | integración | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Tipos de documento de identidad (plataforma) con códigos ARCA, INAES, ENARGAS y `COD_SEN`. | DNI = 96, CUIT = 80 en ARCA [VERIFICAR contra tabla ARCA vigente]. |
| CP-CFG-0101 | RF-CFG-101; T04 §5.10; PRO-O4-01 | O4 | Núcleo | regla | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | Toda tabla fiscal de plataforma se publica por `platformTableRelease` con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. | Una alícuota nueva no impacta cálculos del tenant antes de su vigencia. |
| CP-CFG-0102 | RF-CFG-102; T04 §5.10; PRO-O4-01 | O4 | Núcleo | integración | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | Padrones por CUIT (ARCA y fiscos provinciales) con régimen, alícuota, grupo, vigencia y fecha de publicación; consulta por CUIT y fecha; mantenimiento por plataforma o por tenant según la fuente. | Un CUIT con dos vigencias devuelve la correcta para cada fecha. |
| CP-CFG-0103 | RF-CFG-103; T04 §5.10; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Enumeraciones: Estado civil (soltero/a, casado/a, divorciado/a, viudo/a, unión convivencial); sexo registral (F, M, X); ocupaciones de ejemplo (empleado/a… | Tablas de códigos de entes reguladores (ENARGAS, OCEBA, ERSeP, ENACOM) como enumeraciones de plataforma con códigos externos, consumidas por reportes regulatorios. | Las tablas ENARGAS se ven en PAN-CFG-20 como enumeraciones de plataforma. |
### 1.11 Enumeraciones configurables (T04 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0104 | RF-CFG-104; T04 §5.11; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Toda lista cerrada se modela como enumeración con código estable (inmutable), etiqueta por diccionario, orden, color/ícono opcional, activo, vigencia, padre opcional, atributos tipados y códigos externos. | Cambiar la etiqueta no cambia el código guardado en documentos. |
| CP-CFG-0105 | RF-CFG-105; T04 §5.11; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Tipos de enumeración: `system` (valores fijos del código, el tenant solo cambia etiqueta/orden/activo), `extensible` (el tenant agrega valores), `tenant` (totalmente del tenant), `platform` (mantenida por plataforma). | Un valor `system` no puede eliminarse. |
| CP-CFG-0106 | RF-CFG-106; T04 §5.11; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Enumeraciones: Estado civil (soltero/a, casado/a, divorciado/a, viudo/a, unión convivencial); sexo registral (F, M, X); ocupaciones de ejemplo (empleado/a… | Enumeraciones comunes precargadas: estado civil, ocupación/profesión, sexo/género registral (F, M, X), tipos de documento, canales de contacto, vías de ingreso de gestiones, motivos genéricos de baja/inactivación. | Disponibles en el tenant demo. |
| CP-CFG-0107 | RF-CFG-107; T04 §5.11; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Comprobante: Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado Separar estado documental de saldo | Los estados de negocio con transiciones no son enumeraciones de CFG: los define T11 WFL / el módulo dueño; CFG solo provee etiquetas y orden de presentación. | Ningún estado de comprobante se edita desde PAN-CFG-20. |
### 1.12 Campos extra tipados (T04 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0108 | RF-CFG-108; T04 §5.12; PRO-O2-02 | O2 | Núcleo | seguridad | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | El tenant define campos extra por entidad habilitada (persona, cuenta, contrato de servicio, inmueble, categoría, orden de trabajo, ticket/solicitud, producto, proveedor, empleado, bien de uso): clave, etiqueta, tipo, obligatoriedad… | Crear "Número de medidor anterior" (texto, único) en contrato lo muestra en ficha y lo valida. |
| CP-CFG-0109 | RF-CFG-109; T04 §5.12; PRO-O2-02 | O2 | Núcleo | regla | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Tipos de campo extra: texto, texto largo, entero, decimal, importe, porcentaje, fecha, fecha-hora, booleano, enumeración, multi-enumeración, referencia a entidad, archivo (T11), punto geográfico, email, teléfono, URL, CUIT. | Un decimal respeta los decimales declarados. |
| CP-CFG-0110 | RF-CFG-110; T04 §5.12; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Los valores se guardan en el documento dueño (`customFields.<clave>`) y los valida el servicio de CFG invocado por el módulo; los campos con historia guardan vigencias. | Un valor inválido rechaza el guardado del documento dueño. |
| CP-CFG-0111 | RF-CFG-111; T04 §5.12; PRO-O2-02 | O2 | Núcleo | migración | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Las columnas fijas de las tablas `*_EXTRAS` de ProCoop **no** se convierten en campos extra: pasan a campos de primera clase del modelo del módulo dueño (§19.4). Solo `DATOSEXT`/`PROPIEITEMS` (definidos por la cooperativa) migran a campos… | `SUMSOC_EXTRAS.CORREO_WEB` es campo real de cuenta en M01, no campo extra. |
| CP-CFG-0112 | RF-CFG-112; T04 §5.12; PRO-O2-02 | O2 | Estándar | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Límite de cantidad de campos extra por entidad (PRM-CFG-027) e índices de búsqueda solo sobre campos marcados `searchable`. | Superar el límite muestra mensaje claro. |
| CP-CFG-0113 | RF-CFG-113; T04 §5.12; PRO-O2-02 | O2 | Estándar | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Los campos extra aparecen en `DataTable` (columnas opcionales), exportaciones, importaciones, API admin y, si la visibilidad lo permite, en PWA/landing. | Columna seleccionable en la grilla de cuentas. |
### 1.13 Reemplazo del motor de pantallas configurable (T04 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0114 | RF-CFG-114; T04 §5.13; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. | Las grillas/consultas dinámicas definidas por metadatos SQL (`ENTIDADES`, `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ENTIDACON`, `ENTIDACRIT`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN`; `frmTransicion`) se reemplazan por pantallas declaradas en código… | No existe colección con fragmentos de consulta ejecutables. |
| CP-CFG-0115 | RF-CFG-115; T04 §5.13; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. | Compartir una vista por rol la ofrece a todos los usuarios del rol. |
| CP-CFG-0116 | RF-CFG-116; T04 §5.13; PRO-O1-11 | O1 | Estándar | funcional | TEN-001 con Vistas: "Mora > 60 días" (cuentas) compartida con rol Gestor de mora. | Árbol de navegación por estados/grupos (`ENTIDAEST`, `ENTIDAGRUP`) se reemplaza por filtros rápidos con contadores definidos en código por cada pantalla y vistas guardadas. | La pantalla de reclamos muestra chips por estado con conteo. |
| CP-CFG-0117 | RF-CFG-117; T04 §5.13; PRO-O1-11 | O1 | Núcleo | seguridad | TEN-001 con TRA: Transferencia Saldo pendiente Cuando se verifica la operación según el circuito acordado Una imagen de comprobante no confirma por sí sola | Acciones por entidad (`ENTIDAMEN`) pasan al menú declarativo y a las acciones del `AdminStickyHeader` con capability (T03/T02). | Ninguna acción de entidad se define en una tabla `ENTIDAMEN`; cada acción del `AdminStickyHeader` declara capability y se oculta sin ella (se verifica con los criterios de T03). |
| CP-CFG-0118 | RF-CFG-118; T04 §5.13; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original | Personalización acotada de formularios por el tenant sobre un registro de formularios personalizables: ocultar campo opcional, volver obligatorio un campo opcional, solo lectura, default, etiqueta alternativa (clave de diccionario), orden… | Un campo obligatorio por ley/negocio no puede ocultarse ni volverse opcional. |
| CP-CFG-0119 | RF-CFG-119; T04 §5.13; PRO-O2-02 | O2 | Núcleo | regla | TEN-001 con EFE: Efectivo Saldo pendiente del documento Cuando el cajero registra y confirma la recepción Caja abierta y recibo | La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). | Un request por API que omite un campo vuelto obligatorio devuelve 422. |
### 1.14 Configuración técnica, bóveda y entorno (T04 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0120 | RF-CFG-120; T04 §5.14; PRO-O1-10 | O1 | Núcleo | migración | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | La configuración técnica de ProCoop (`Configuracion*.pro`) se clasifica campo por campo (§19.3): infraestructura → variables de entorno del despliegue; credenciales → bóveda por tenant (T06); comportamiento → parámetros; obsoleto →… | Ningún archivo local ni documento de tenant contiene credenciales. |
| CP-CFG-0121 | RF-CFG-121; T04 §5.14; PRO-O1-10 | O1 | Núcleo | seguridad | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Vista de configuración técnica del tenant (PAN-CFG-28): lista los `secretRef` requeridos por los módulos activos con estado (configurado, faltante, por vencer), sin mostrar valores; enlace a la bóveda (T06). | Un secreto faltante bloquea la validación de la versión que habilita la integración. |
| CP-CFG-0122 | RF-CFG-122; T04 §5.14; PRO-O0-01 | O0 | Núcleo | seguridad | TEN-001 con AG: Agua AG-RES — Residencial m³ Medido ARS 3.000 fijos + ARS 500/m³ Conexión y medidor instalado | No existen contraseñas maestras, credenciales por defecto ni conexión compartida a base: la identidad del usuario llega a la auditoría. | Revisión de seguridad sin hallazgos de credenciales fijas. |
| CP-CFG-0123 | RF-CFG-123; T04 §5.14; PRO-O0-01 | O0 | Núcleo | migración | TEN-001 con Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur"… | Las migraciones de esquema y del catálogo de parámetros se ejecutan en el pipeline de despliegue, nunca al iniciar sesión el primer usuario. | El login no dispara migraciones. |
### 1.15 Perfil de configuración por servicio y reglas transversales (T04 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0124 | RF-CFG-124; T04 §5.15; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con BON-PROM: Bonificación promocional 10 % sobre abono de internet Promoción autorizada Base, duración y compatibilidad | Configuración propia e independiente por tenant y servicio (COP-001): cada valor de ámbito `service`/`category` pertenece a un tenant; editar el origen no afecta copias. | Cambiar la promoción de Internet en TEN-001 no cambia TEN-002. |
| CP-CFG-0125 | RF-CFG-125; T04 §5.15; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con Pago externo: Iniciado; Pendiente; Confirmado; Rechazado; Devuelto; Con contracargo Transiciones permitidas según proveedor | Perfil de configuración por servicio con las 15 dimensiones de BASE §84 (prestador y jurisdicción, titularidad, unidad de prestación, oferta, cantidad, excepciones, facturación, cuenta y pago, ciclo comercial, operación, cambios y salida… | PAN-CFG-29 muestra porcentaje de completitud por dimensión. |
| CP-CFG-0126 | RF-CFG-126; T04 §5.15; PRO-O2-02 | O2 | Núcleo | funcional | TEN-001 con CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad… | Donde un concepto no corresponde a un servicio se marca **No aplica** explícitamente en lugar de forzar un cargo o proceso ficticio. | Dimensión "Cantidad" de Cementerio parque puede quedar "No aplica" con motivo. |
| CP-CFG-0127 | RF-CFG-127; T04 §5.15; PRO-O2-02 | O2 | Núcleo | regla | TEN-001 con Solicitud: Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada Aprobar una solicitud no implica servicio instalado | Las fichas por servicio (Internet, Electricidad, Agua, Gas, Cementerio parque, Banco de sangre) se completan con lista de precios y versión, bonificaciones, descuentos, recargos e intereses habilitados, facturación y auxiliares, flujo de… | Publicar un servicio exige su ficha sin dimensiones vacías no justificadas. |
| CP-CFG-0128 | RF-CFG-128; T04 §5.15; PRO-O1-10 | O1 | Núcleo | funcional | TEN-001 con GAS: Gas GAS-RES — Residencial m³ Medido; fórmula simplificada ARS 3.500 fijos + ARS 200/m³ Aprobación técnica y medición | Diferencias entre servicios se representan con configuraciones y componentes de dominio explícitos; no se convierte toda particularidad en texto libre ni se fuerza una fórmula universal. | Linter: ningún parámetro `text` con clase `commercial` sin esquema. |
| CP-CFG-0129 | RF-CFG-129; T04 §5.15; PRO-O2-02 | O2 | Estándar | funcional | TEN-001 con ELE: Electricidad ELE-RES — Residencial kWh Medido ARS 4.000 fijos + ARS 100/kWh Factibilidad y medidor instalado | Prestaciones complementarias se habilitan como extensiones explícitas, no indiscriminadamente (ESP-006). | Una extensión no habilitada no expone parámetros. |
### 1.16 Migración y equivalencias (T04 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0130 | RF-CFG-130; T04 §5.16; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con ELE: Electricidad ELE-RES — Residencial kWh Medido ARS 4.000 fijos + ARS 100/kWh Factibilidad y medidor instalado | Tabla de equivalencias `legacyParameterMappings`: (`VARIABLE` o `VARIABLE_PMOVIL` + `MOD_VAR`) + `COD_VAR` → clave(s) + transformación + destino (`parameter`, `dictionary`, `tenantProfile`, `secret`, `env`, `discarded`, `replacedBy`)… | Cada uno de los 1.536 tiene exactamente un destino. |
| CP-CFG-0131 | RF-CFG-131; T04 §5.16; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con Orden técnica: Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada Ejecución y revisión son hitos distintos | Los números de `VARIABLE` y `VARIABLE_PMOVIL` se tratan como espacios distintos (hay números repetidos entre ambas, ej. 1 y 2). | La clave natural de la equivalencia incluye la tabla. |
| CP-CFG-0132 | RF-CFG-132; T04 §5.16; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con AJU-COM: Ajuste comercial Importe sujeto a aprobación Expediente autorizado Motivo y documentación correctiva | La migración de valores de un tenant genera una `configVersion` `origin = migration` en borrador con reporte de valores no migrables (sin equivalencia, fuera de rango, referencias faltantes). | El reporte lista cada valor descartado con motivo. |
| CP-CFG-0133 | RF-CFG-133; T04 §5.16; PRO-O1-11 | O1 | Núcleo | funcional | TEN-001 con CV-AG: Consumo de agua 20 m³ × ARS 500 Consumo aprobado y tarifa No usar lectura capturada sin validar | Clasificación de los 622 parámetros sin uso directo comprobado: quedan en T04b con estado `A validar (PA-CFG-07)` y destino propuesto. | Ninguno se descarta sin registro. |
### 1.17 Entidades jurídicas, sucursales y puestos (DEC-064) (T04 §5.18)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CFG-0134 | RF-CFG-134; T04 §5.18; PRO-O0-13 | O0 | Núcleo | seguridad | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Entidades jurídicas del tenant** (`legalEntities`, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… | Un segundo alta con el mismo CUIT en el tenant se rechaza; el mismo CUIT en otro tenant se acepta. |
| CP-CFG-0135 | RF-CFG-135; T04 §5.18; PRO-O0-13 | O0 | Núcleo | integración | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | **Entidad por defecto**: al consumir `pla.tenant.created` se crea en la misma unidad idempotente la entidad jurídica por defecto (`isDefault = true`) con los datos fiscales de `tenants` (razón social, CUIT, forma jurídica, matrícula INAES… | TEN-001 tiene su entidad por defecto apenas se crea y no ve la de TEN-002; reprocesar el evento no crea una segunda. |
| CP-CFG-0136 | RF-CFG-136; T04 §5.18; PRO-O0-13 | O0 | Núcleo | seguridad | TEN-001 con REC: Entidad recaudadora externa Según documento o rendición Rendición validada según el contrato operativo Conciliación de bruto, cargos y neto | **`legalEntityId` obligatorio** en el esquema base de los documentos económicos (paquete compartido de esquemas Zod, `packages/shared`) desde O0: `pointsOfSale`, `numberSequences`, `fiscalProfiles`, `arcaCredentials`, `invoices`… | Un documento económico sin `legalEntityId` no valida; uno con la entidad de otro tenant devuelve 422; un plan de cuentas de LE-01 compartido con LE-02 valida, y uno compartido con una entidad de otro tenant devuelve 422. |
| CP-CFG-0137 | RF-CFG-137; T04 §5.18; PRO-O0-13 | O0 | Núcleo | regla | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Resolución de la entidad** de un documento nuevo (servicio interno `legalEntities.resolve({ branchId, serviceId, at })`, API-CFG-58): 1) la indicada explícitamente por el usuario con permiso; 2) la emisora del servicio (PRM-CFG-040… | Un servicio de la mutual configurado con su entidad emite con ella aunque la sucursal sea de la cooperativa. |
| CP-CFG-0138 | RF-CFG-138; T04 §5.18; PRO-O0-13 | O0 | Núcleo | integración | TEN-001 con Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No… | **Datos fiscales por entidad**: T04 guarda solo los datos legales básicos de REQ-DEC-064. El perfil fiscal completo (agente de percepción o retención, puntos de venta ARCA, credenciales, CAEA) es de M06 por `legalEntityId` y se construye… | Cambiar el domicilio legal no altera las facturas ya emitidas. |
| CP-CFG-0139 | RF-CFG-139; T04 §5.18; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Subdocumento `employer`** de `legalEntities` para sueldos (tipo de empleador, actividad principal, zona, régimen de contribuciones, ART, seguro de vida, agente de retención de Ganancias, recibos y firma, convenios bancarios, LSD), que… | Dos entidades del tenant generan LSD, SICOSS y asientos de sueldos por separado. |
| CP-CFG-0140 | RF-CFG-140; T04 §5.18; PRO-O0-13 | O0 | Núcleo | funcional | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Sucursales** (`branches`, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea la… | Una sucursal no puede apuntar a una entidad inactiva; inactivar una sucursal con cajas abiertas se rechaza. |
| CP-CFG-0141 | RF-CFG-141; T04 §5.18; PRO-O1-11 | O1 | Estándar | funcional | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Puestos** (`workstations`, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con `cfg.puestos.editar`. | Un puesto pertenece a una sola sucursal y su código es único en el tenant. |
| CP-CFG-0142 | RF-CFG-142; T04 §5.18; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes… | **Migración**: `EMPRESAS` → `legalEntities` (la empresa principal queda `isDefault`); `SU_EMPRESAS` → subdocumento `employer` de la entidad con el mismo CUIT, o entidad nueva si no existe; sucursales de `EMPRESAS`/`CAJASJP` → `branches`… | Cada fila de `EMPRESAS` y `SU_EMPRESAS` tiene destino; ningún CUIT queda duplicado. |
| CP-CFG-0143 | RF-CFG-143; T04 §5.18; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia… | **Tablas legales de sueldos de plataforma** (§7.17): códigos oficiales, alícuotas de aportes y contribuciones, bases mínima y máxima, SMVM, deducciones y escalas de Ganancias, reglas de Ganancias, escala cedular, escala de embargabilidad y… | Un cambio de SMVM con vigencia futura no afecta liquidaciones de períodos anteriores. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-CFG-5001 — ESC-CFG-01. Publicación atómica con fallo inyectado en el ítem 7 de 10**

- Cubre: ESC-CFG-01; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Publicación atómica con fallo inyectado en el ítem 7 de 10
- Entonces Ningún ítem vigente; versión `failed`; alerta.

**CP-CFG-5002 — ESC-CFG-02. Precedencia: valor en tenant 2, servicio 3, categoría 4; consulta con categoría**

- Cubre: ESC-CFG-02; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Precedencia: valor en tenant 2, servicio 3, categoría 4; consulta con categoría
- Entonces 4; sin categoría → 3; otro servicio → 2.

**CP-CFG-5003 — ESC-CFG-03. Bitemporal: valor A desde 01-03 registrado 01-03; corrección B desde 01-03 registrada 12-03**

- Cubre: ESC-CFG-03; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Bitemporal: valor A desde 01-03 registrado 01-03; corrección B desde 01-03 registrada 12-03
- Entonces `at=10-03,knownAt=11-03` → A; `knownAt=13-03` → B.

**CP-CFG-5004 — ESC-CFG-04. Autor intenta aprobar su versión `commercial`**

- Cubre: ESC-CFG-04; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T04 §18.
- Datos de prueba: CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Autor intenta aprobar su versión `commercial`
- Entonces 403 (permiso negativo).

**CP-CFG-5005 — ESC-CFG-05. Usuario sin `fac.configuracion.configurar` edita `fac.*`**

- Cubre: ESC-CFG-05; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario sin `fac.configuracion.configurar` edita `fac.*`
- Entonces 403.

**CP-CFG-5006 — ESC-CFG-06. Aislamiento: usuario de TEN-002 consulta `parameterValues`, `geocodeRequests`, `savedViews` y calles locales de TEN-001**

- Cubre: ESC-CFG-06; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aislamiento: usuario de TEN-002 consulta `parameterValues`, `geocodeRequests`, `savedViews` y calles locales de TEN-001
- Entonces Sin resultados; test automatizado en cada endpoint.

**CP-CFG-5007 — ESC-CFG-07. Clave no declarada leída en código**

- Cubre: ESC-CFG-07; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Lectura: Capturada; Observada; Validada; Reemplazada por corrección trazable Conservar el registro original
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Clave no declarada leída en código
- Entonces Excepción; no se crea registro.

**CP-CFG-5008 — ESC-CFG-08. Versión programada y luego otra versión publicada sobre la misma clave**

- Cubre: ESC-CFG-08; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: CF-AG: Cargo fijo de agua ARS 3.000 Versión de tarifa Vigencia y aplicabilidad
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Versión programada y luego otra versión publicada sobre la misma clave
- Entonces Al llegar la hora, revalidación detecta conflicto; `failed` con pedido de rebase.

**CP-CFG-5009 — ESC-CFG-09. Reintento de `publish` con la misma `Idempotency-Key`**

- Cubre: ESC-CFG-09; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: INS-INT: Instalación de internet ARS 30.000 por única vez Cargo aprobado Cuándo se devenga y si puede financiarse
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento de `publish` con la misma `Idempotency-Key`
- Entonces Una única publicación.

**CP-CFG-5010 — ESC-CFG-10. Retroactivo de 40 días con PRM-CFG-006 = 31**

- Cubre: ESC-CFG-10; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Retroactivo de 40 días con PRM-CFG-006 = 31
- Entonces Validación rechaza.

**CP-CFG-5011 — ESC-CFG-11. Vencimiento domingo 06-09-2026 con lunes feriado ficticio**

- Cubre: ESC-CFG-11; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia, 02-04 Día del Veterano y de los Caídos en la Guerra de Malvinas, 01-05…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vencimiento domingo 06-09-2026 con lunes feriado ficticio
- Entonces `nextBusinessDay` = martes 08-09-2026.

**CP-CFG-5012 — ESC-CFG-12. Año bisiesto: sumar 1 mes a 31-01-2028 y 1 año a 29-02-2028**

- Cubre: ESC-CFG-12; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: DEB: Débito automático Obligaciones elegibles Resultado confirmado de la presentación Rechazos y reintentos controlados
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Año bisiesto: sumar 1 mes a 31-01-2028 y 1 año a 29-02-2028
- Entonces Resultado según regla documentada del módulo, idéntico en servidores con distinta TZ.

**CP-CFG-5013 — ESC-CFG-13. Google caído al guardar una solicitud**

- Cubre: ESC-CFG-13; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Solicitud: Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada Aprobar una solicitud no implica servicio instalado
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Google caído al guardar una solicitud
- Entonces Solicitud guardada `pending`; JOB-CFG-09 la geocodifica luego.

**CP-CFG-5014 — ESC-CFG-14. Calle homónima en dos localidades**

- Cubre: ESC-CFG-14; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Calle homónima en dos localidades
- Entonces El selector exige localidad; nunca autocompleta otra.

**CP-CFG-5015 — ESC-CFG-15. Cuota de geocodificación agotada**

- Cubre: ESC-CFG-15; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: CUO-VEN: Cuota de venta adicional ARS 30.000; cuota 1 de 3 Venta financiada No duplicar con otra obligación
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cuota de geocodificación agotada
- Entonces Componente sin mapa con búsqueda de catálogo y aviso; no falla el formulario.

**CP-CFG-5016 — ESC-CFG-16. Importación de 50.000 filas con 30 errores; cancelación a mitad de proceso**

- Cubre: ESC-CFG-16; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Facturación: Simulación, revisión y emisión Período abierto y tarifa vigente No reemite sin controlar el estado previo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación de 50.000 filas con 30 errores; cancelación a mitad de proceso
- Entonces Vista previa con 30 errores; tras cancelar, estado previo intacto.

**CP-CFG-5017 — ESC-CFG-17. Reimportar el mismo archivo en modo `upsert`**

- Cubre: ESC-CFG-17; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Reclamo: Abierto; Asignado; En tratamiento; Resuelto; Cerrado; Reabierto Registrar motivo, responsable y cambios
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reimportar el mismo archivo en modo `upsert`
- Entonces Cero cambios.

**CP-CFG-5018 — ESC-CFG-18. Unificar barrio con 120 referencias; reiniciar worker a mitad**

- Cubre: ESC-CFG-18; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Unificar barrio con 120 referencias; reiniciar worker a mitad
- Entonces Job reanuda; 0 referencias al duplicado al terminar.

**CP-CFG-5019 — ESC-CFG-19. Release fiscal de plataforma con vigencia futura, tenant `fijar`**

- Cubre: ESC-CFG-19; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Release fiscal de plataforma con vigencia futura, tenant `fijar`
- Entonces Sin impacto hasta que el tenant adopte; aviso pendiente.

**CP-CFG-5020 — ESC-CFG-20. Revisión de un valor de IPC**

- Cubre: ESC-CFG-20; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Revisión de un valor de IPC
- Entonces Valor anterior consultable con `knownAt`; documentos emitidos sin cambios.

**CP-CFG-5021 — ESC-CFG-21. Personalización intenta ocultar un campo obligatorio de negocio**

- Cubre: ESC-CFG-21; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: AJU-COM: Ajuste comercial Importe sujeto a aprobación Expediente autorizado Motivo y documentación correctiva
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Personalización intenta ocultar un campo obligatorio de negocio
- Entonces Rechazo con motivo.

**CP-CFG-5022 — ESC-CFG-22. API omite un campo vuelto obligatorio por personalización**

- Cubre: ESC-CFG-22; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando API omite un campo vuelto obligatorio por personalización
- Entonces 422.

**CP-CFG-5023 — ESC-CFG-23. Parámetro `string` con valor con forma de token**

- Cubre: ESC-CFG-23; RF-CFG-014; T04 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Parámetro `string` con valor con forma de token
- Entonces Rechazo (RF-CFG-014).

**CP-CFG-5024 — ESC-CFG-24. Migración de `VARIABLE`: suma de destinos**

- Cubre: ESC-CFG-24; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Migración de `VARIABLE`: suma de destinos
- Entonces Igual al total de filas del volcado.

**CP-CFG-5025 — ESC-CFG-25. Semilla en tenant productivo**

- Cubre: ESC-CFG-25; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T04 §18.
- Datos de prueba: CEM: Cementerio parque CEM-PAR — Parcela Derecho/unidad y mantenimiento Derecho adquirido más mantenimiento periódico Sin importe precargado Unidad disponible, instrumento firmado y reglamento vigente (BASE §90)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Semilla en tenant productivo
- Entonces Acción no disponible (403).

**CP-CFG-5026 — ESC-CFG-26. Retirar semilla con datos creados por usuarios en el demo**

- Cubre: ESC-CFG-26; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes reales); sucursales `SUC-01` "Casa central" (COOP) y `SUC-02`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Retirar semilla con datos creados por usuarios en el demo
- Entonces Solo se retiran registros de la semilla.

**CP-CFG-5027 — ESC-CFG-27. Módulo no licenciado**

- Cubre: ESC-CFG-27; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Módulo no licenciado
- Entonces Sus claves no se listan y `config.get` devuelve "apagado".

**CP-CFG-5028 — ESC-CFG-28. Copia entre tenants sin mapeo de cuenta contable**

- Cubre: ESC-CFG-28; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Copia entre tenants sin mapeo de cuenta contable
- Entonces Validación del destino bloquea publicación (AGR-009 ejemplo).

**CP-CFG-5029 — ESC-CFG-29. Propagación de publicación en 3 réplicas**

- Cubre: ESC-CFG-29; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Propagación de publicación en 3 réplicas
- Entonces Todas leen el valor nuevo en < 5 s.

**CP-CFG-5030 — ESC-CFG-30. Vista compartida usada por usuario sin alcance**

- Cubre: ESC-CFG-30; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vista compartida usada por usuario sin alcance
- Entonces No amplía datos visibles.

**CP-CFG-5031 — ESC-CFG-31. Alta de TEN-001 (`pla.tenant.created`) y reproceso del mismo evento**

- Cubre: ESC-CFG-31; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes reales); sucursales `SUC-01` "Casa central" (COOP) y `SUC-02`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Alta de TEN-001 (`pla.tenant.created`) y reproceso del mismo evento
- Entonces Una sola entidad `isDefault` y una sola casa central.

**CP-CFG-5032 — ESC-CFG-32. Factura sin `legalEntityId` o con la entidad de TEN-002**

- Cubre: ESC-CFG-32; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: REC: Entidad recaudadora externa Según documento o rendición Rendición validada según el contrato operativo Conciliación de bruto, cargos y neto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura sin `legalEntityId` o con la entidad de TEN-002
- Entonces No valida (422); nada se persiste.

**CP-CFG-5033 — ESC-CFG-33. Usuario de TEN-001 lista entidades jurídicas**

- Cubre: ESC-CFG-33; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes reales); sucursales `SUC-01` "Casa central" (COOP) y `SUC-02`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario de TEN-001 lista entidades jurídicas
- Entonces Solo ve las de TEN-001.

**CP-CFG-5034 — ESC-CFG-34. Segunda entidad con el CUIT de la primera; inactivar la entidad por defecto**

- Cubre: ESC-CFG-34; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Segunda entidad con el CUIT de la primera; inactivar la entidad por defecto
- Entonces Ambas operaciones se rechazan con motivo.

**CP-CFG-5035 — ESC-CFG-35. Servicio SOC con PRM-CFG-040 = entidad "MUTUAL" en sucursal de "COOP"**

- Cubre: ESC-CFG-35; T04 §17
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Entidades y sucursales: `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes reales); sucursales `SUC-01` "Casa central" (COOP) y `SUC-02`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Servicio SOC con PRM-CFG-040 = entidad "MUTUAL" en sucursal de "COOP"
- Entonces El documento resuelve "MUTUAL".

## 3. Casos por caso de uso (CU)

**CP-CFG-8001 — CU-GEO-01. Dirección de prestación georreferenciada (BASE §77, original)**

- Cubre: CU-GEO-01; RF-CFG-065; T04 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado DIR-DEMO-001; INM-001; provincia Córdoba; Calle Ejemplo 100 (ficticio); estado Pendiente de georreferenciación; sin coordenadas reales para un domicilio inventado. Implementación: §9.9, PAN-CFG-14/31, RF-CFG-065..083.
- Cuando Ana solicita un servicio para un nuevo domicilio. Selecciona Córdoba y su localidad, busca la calle y completa la altura y unidad. El sistema muestra la dirección normalizada y un punto candidato en Google Maps. Ana o un operador autorizado confirma el acceso correcto al inmueble. El contrato y la visita utilizan esa dirección, mientras el domicilio fiscal permanece separado. Si no aparece la calle de un loteo nuevo, se conserva el texto y las referencias y se permite indicar el punto para revisión; no se completa…
- Entonces Se completa «Dirección de prestación georreferenciada (BASE §77, original)» sin errores, con los efectos que exigen RF-CFG-065, y quedan auditoría y evento del cambio

**CP-CFG-8002 — CU-COP-01. Copia de Internet entre tenants (BASE §81, original; dueño M02)**

- Cubre: CU-COP-01; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado origen TEN-001/INT/versión 1; destino TEN-002/INT/versión 1; COP-DEMO-001; estado inicial Borrador con dependencias pendientes.
- Cuando CFG aporta los pasos 3, 5 y 6: el destino recibe una `configVersion` en borrador con dependencias pendientes; se simula contratación y primera factura sin deuda real; se publica por el circuito del destino.
- Entonces Se completa «Copia de Internet entre tenants (BASE §81, original; dueño M02)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CFG-8003 — CU-CFG-01. Publicar un cambio de vencimientos con fecha efectiva**

- Cubre: CU-CFG-01; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Facturación: Simulación, revisión y emisión Período abierto y tarifa vigente No reemite sin controlar el estado previo
- Dado actor: configurador de facturación de TEN-001; revisor: jefe de administración. 1) Crea borrador "Vencimientos junio". 2) Cambia `fac.vencimientos.cantidadMaxima` de 2 a 3 en el servicio Agua. 3) Fecha efectiva 01-06-2026 (modo `periodBoundary`: coincide con inicio de ciclo). 4) Valida (sin errores), simula (M05 muestra una factura ficticia con tres vencimientos). 5) Envía a revisión; el revisor aprueba. 6) Queda…
- Cuando Publicar un cambio de vencimientos con fecha efectiva
- Entonces Facturas de mayo no cambian; las del ciclo de junio usan 3 vencimientos y guardan la huella de configuración.

**CP-CFG-8004 — CU-CFG-02. Rechazo por dependencia y plan sin precio**

- Cubre: CU-CFG-02; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: AB-INT: Abono de internet ARS 25.000/mes Plan y tarifa Prorrateo y fecha de inicio a definir
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rechazo por dependencia y plan sin precio
- Entonces El configurador publica un plan de Internet visible en la landing sin tarifa vigente para TEN-002 y habilita `crm.turnero.webHabilitado` sin `crm.turnero.habilitado`. La validación falla con dos errores enlazados; la versión vuelve a borrador. Nada se publica parcialmente.

**CP-CFG-8005 — CU-CFG-03. Editar una tabla maestra con "en uso por"**

- Cubre: CU-CFG-03; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Editar una tabla maestra con "en uso por"
- Entonces El operador intenta eliminar el barrio "Barrio Demo Norte"; el sistema informa 120 domicilios y 3 zonas que lo referencian y ofrece inactivar o unificar.

**CP-CFG-8006 — CU-CFG-04. Importar el padrón de IIBB del período**

- Cubre: CU-CFG-04; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importar el padrón de IIBB del período
- Entonces El responsable fiscal sube el archivo del período 05-2026 de la jurisdicción (ficticio). Vista previa: 250.000 filas, 12 con CUIT inválido. Confirma; el job carga 249.988 entradas con vigencia 01-05-2026 a 31-05-2026 y cierra las anteriores. Consulta CUIT 30-00000000-0 al 15-05-2026: alícuota 2,5 % (ficticia).

**CP-CFG-8007 — CU-CFG-05. Unificar calles duplicadas migradas**

- Cubre: CU-CFG-05; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Geografía: Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Unificar calles duplicadas migradas
- Entonces Tras migrar ProCoop hay "Bv. San Juan" y "Boulevard San Juan" en la misma localidad. El operador unifica en la calle nacional; el job redirige 3.400 domicilios; la local queda `merged` y "Bv. San Juan" pasa a alias.

**CP-CFG-8008 — CU-CFG-06. Adoptar una actualización fiscal de plataforma**

- Cubre: CU-CFG-06; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Fiscal: Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Adoptar una actualización fiscal de plataforma
- Entonces Plataforma publica un release de alícuotas de IIBB con vigencia futura y fuente normativa. TEN-001 (modo `seguirConAviso`) recibe aviso y borrador `origin = platform`; el responsable fiscal revisa simulación (M06) y aprueba; rige desde la fecha de vigencia.

**CP-CFG-8009 — CU-CFG-07. Cargar un feriado municipal tardío**

- Cubre: CU-CFG-07; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Calendario: Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia, 02-04 Día del Veterano y de los Caídos en la Guerra de Malvinas, 01-05…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cargar un feriado municipal tardío
- Entonces El 05-08-2026 la municipalidad declara asueto el 07-08-2026. El operador lo agrega al calendario municipal; `cfg.holiday.changed` hace que M05 recalcule vencimientos de documentos no emitidos; las facturas ya emitidas conservan su vencimiento.

**CP-CFG-8010 — CU-CFG-08. Corregir retroactivamente una tasa de mora propia**

- Cubre: CU-CFG-08; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: REC-PEND: Recargo por mora Deshabilitado en la demostración Política autorizada Base, tasa, períodos y excepciones a definir
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corregir retroactivamente una tasa de mora propia
- Entonces La cooperativa detecta el 15-07 que su tasa de recargo de julio debía ser 3,5 % y no 4 % desde el 01-07. Crea versión retroactiva (dentro de 31 días), con aprobación; `config.get` con `knownAt` 10-07 sigue devolviendo 4 %; M08 recibe evento y genera los ajustes de los recargos ya liquidados por su circuito.

**CP-CFG-8011 — CU-CFG-09. Definir un campo extra de cuenta**

- Cubre: CU-CFG-09; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Campos extra: Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Definir un campo extra de cuenta
- Entonces El administrador define en "cuenta" el campo `nroFichaPapel` (texto, único, sección "Legado", visible solo en admin). Se publica; aparece en la ficha, la grilla de cuentas (columna opcional), la importación y la exportación.

**CP-CFG-8012 — CU-CFG-10. Vista guardada compartida**

- Cubre: CU-CFG-10; RN-CFG-042; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Vistas: "Mora > 60 días" (cuentas) compartida con rol Gestor de mora.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vista guardada compartida
- Entonces Una supervisora de cobranza arma en la grilla de cuentas una vista "Mora > 60 días — Zona Norte", con columnas y formato condicional rojo para saldo > ARS 100.000, y la comparte con el rol "Gestor de mora". Un gestor sin alcance sobre la zona Norte la abre y ve cero registros (RN-CFG-042).

**CP-CFG-8013 — CU-CFG-11. Migrar la configuración de una cooperativa desde ProCoop**

- Cubre: CU-CFG-11; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: SAN: Banco de sangre SAN-CONV — Cobertura por convenio Grupo/beneficiario Cobertura administrativa por convenio ARS 0 al socio en la modalidad financiada por la cooperativa Convenio vigente y beneficiarios registrados (BASE…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Migrar la configuración de una cooperativa desde ProCoop
- Entonces T07 entrega el volcado de `VARIABLE` (1.240 filas) y `VARIABLE_PMOVIL` (180). JOB-CFG-10 genera borrador con 1.010 ítems, 95 textos a diccionario, 40 solicitudes de carga de secretos (sin migrar valores en claro), 275 filas en reporte (descartadas, a validar o sin equivalencia). La suma de destinos coincide con 1.420.

**CP-CFG-8014 — CU-CFG-12. Aplicar la semilla demo**

- Cubre: CU-CFG-12; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: TRIB-PEND: Tributos aplicables Sin valor precargado Configuración específica Relevamiento y validación fiscal antes de operar
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aplicar la semilla demo
- Entonces Plataforma crea TEN-DEMO y aplica `demo-base-s39`. Se crean servicios, conceptos, medios de cobro, estados y roles de §18; tarifas y recargos quedan en un borrador pendiente de aprobación; `TRIB-PEND` queda pendiente de validación fiscal; `REC-PEND` deshabilitado.

**CP-CFG-8015 — CU-CFG-13. Confirmar el punto en campo**

- Cubre: CU-CFG-13; T04 §16
- Ola: O1 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T04 §18.
- Datos de prueba: Técnico: Órdenes asignadas Cuadrilla y trabajos asignados No activa condiciones comerciales excepcionales
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Confirmar el punto en campo
- Entonces El técnico llega a una dirección `approximate`; en la PWA de campo, sin señal, marca el acceso real y escribe "entrada por calle lateral". Al recuperar conexión la mutación se sincroniza; el punto queda `confirmed` con fuente `field-survey`.
