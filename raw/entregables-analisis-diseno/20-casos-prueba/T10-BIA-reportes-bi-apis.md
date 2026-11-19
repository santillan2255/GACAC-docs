# Casos de prueba de aceptación — T10 BIA — Reportes, BI, tableros, exportaciones y APIs para terceros

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T10-BIA-reportes-bi-apis.md`](../../especificacion/anexos/T10-BIA-reportes-bi-apis.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 103 CP de requisitos funcionales, 38 CP de escenarios ESC y 16 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T10 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Requisitos funcionales (T10 §5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-BIA-0001 | RF-BIA-001; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Catálogo único de reportes (`reportDefinitions`) con código REP, nombre por clave de diccionario, módulo dueño, propósito, granularidad, parámetros, columnas, capabilities, sensibilidad, salidas y versión. | El catálogo lista sólo reportes ejecutables por el usuario; cada uno muestra su ficha. |
| CP-BIA-0002 | RF-BIA-002; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed` | Cada módulo registra sus reportes mediante un provider con esquema Zod de parámetros y contrato de columnas; BIA no lee colecciones de otros módulos. | Un test de arquitectura falla si `bia` importa modelos de otro módulo. |
| CP-BIA-0003 | RF-BIA-003; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Ejecución con validación de parámetros, defaults (incl. relativos: hoy, mes anterior, ciclo actual) y mensajes de error por campo. | Parámetro inválido → 422 RFC 9457 con `errors[]` por campo. |
| CP-BIA-0004 | RF-BIA-004; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Presets: "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`) | Aplicación automática del alcance del usuario (sucursales, zonas, servicios, cuadrillas, propios) en el provider; totales calculados sólo sobre filas visibles. | Usuario con alcance zona Norte no ve filas ni totales de zona Sur. |
| CP-BIA-0005 | RF-BIA-005; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Modo síncrono cuando la estimación de costo ≤ `PRM-BIA-003` filas y `PRM-BIA-004` segundos; en otro caso, ejecución asíncrona en job `bia:ejecutar-reporte` con progreso. | Un reporte de 300.000 filas no bloquea el request; el usuario ve progreso y recibe aviso. |
| CP-BIA-0006 | RF-BIA-006; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Resultado paginado en `DataTable` con orden, filtros de columna, columnas configurables y totales/subtotales por agrupación. | Totales coinciden con la suma exacta Decimal de las filas del universo. |
| CP-BIA-0007 | RF-BIA-007; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Encabezado obligatorio de toda salida: tenant, reporte y versión, parámetros, universo, fecha de corte, tipo de fecha usado, granularidad, fuente (operativa/analítica) y frescura, usuario y fecha de generación. | XLSX/CSV/PDF incluyen hoja o bloque "Metadatos". |
| CP-BIA-0008 | RF-BIA-008; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura | Llegada al detalle (drill-down) desde cada total o indicador a los registros que lo componen y al documento de origen. | CU-30: desde el saldo ARS 0 se llega a la factura y a sus dos imputaciones. |
| CP-BIA-0009 | RF-BIA-009; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. | Cancelar deja `reportRuns.status=cancelled` y libera el worker. |
| CP-BIA-0010 | RF-BIA-010; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Presets: "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`) | Presets con nombre (personales o compartidos a roles) por reporte. | Un preset compartido no amplía el alcance del que lo usa. |
| CP-BIA-0011 | RF-BIA-011; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Favoritos, recientes y búsqueda por texto en el catálogo; agrupación por cluster del mapa del sitio. | Búsqueda "deuda" devuelve REP-COB-002, REP-MOR-001 y demás reportes con "deuda" en nombre o ayuda. |
| CP-BIA-0012 | RF-BIA-012; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Ayuda contextual por reporte (`ScreenHelp`) con definición, fórmula y ejemplo. | Cada reporte del catálogo tiene ayuda no vacía. |
| CP-BIA-0013 | RF-BIA-013; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Títulos, columnas y valores enumerados por clave de diccionario del tenant; los nombres técnicos de columnas exportadas a CSV/API no cambian. | TEN-001 "Socio" y TEN-002 "Asociado" generan encabezados distintos y mismo `fieldKey`. |
| CP-BIA-0014 | RF-BIA-014; T10 §5; PRO-O1-17 | O1 | Núcleo | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Enmascarado de datos personales (documento, CUIT de personas humanas, teléfono, email, CBU, domicilio exacto) salvo `bia.datosSensibles.ver`. | Sin la capability, DNI se ve `**.***.123`. |
| CP-BIA-0015 | RF-BIA-015; T10 §5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Identificación explícita de datos simulados (escenarios, planes alternativos) con marca visible y columna `scenarioId`; prohibido mezclarlos con reales sin marca. | Un reporte de un escenario lleva marca de agua "SIMULACIÓN". |
| CP-BIA-0016 | RF-BIA-016; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Versionado de definiciones: cambios en columnas/fórmula crean versión nueva; ejecuciones guardan la versión usada. | Re-ejecutar una corrida vieja indica versión original y vigente. |
| CP-BIA-0017 | RF-BIA-017; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Plantillas PDF por reporte con override por tenant (logo, encabezado, pie, orden de columnas) sin alterar datos. | Override de TEN-001 no afecta a TEN-002. |
| CP-BIA-0018 | RF-BIA-018; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. | Reporte oculto no aparece en catálogo ni API. |
| CP-BIA-0019 | RF-BIA-019; T10 §5; PRO-O2-18 | O2 | Estándar | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Selección para acción: un reporte puede entregar al módulo dueño un `selectionToken` con IDs seleccionados para que el usuario inicie allí una acción (notificar, generar OT). | BIA nunca ejecuta la acción; el módulo exige su propia capability. |
| CP-BIA-0020 | RF-BIA-020; T10 §5; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Mapa: reportes con geolocalización ofrecen vista mapa y exportación KML/GeoJSON. | REP-TEC-001 exporta KML con estilos por estado. |
| CP-BIA-0021 | RF-BIA-021; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Exportación de cualquier `DataTable` del sistema a XLSX, CSV y PDF e impresión, con columnas visibles o todas. | Toda grilla admin muestra botón Exportar si el usuario tiene `<mod>.<recurso>.exportar`. |
| CP-BIA-0022 | RF-BIA-022; T10 §5; PRO-O1-17 | O1 | Núcleo | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Exportación asíncrona en worker BullMQ (`bia:generar-exportacion`) cuando supera `PRM-BIA-005` filas; archivo en almacenamiento privado; descarga por URL firmada de `PRM-BIA-007` minutos tras revalidar permiso. | La URL vencida devuelve 403; un usuario sin permiso no puede descargar aunque tenga el enlace. |
| CP-BIA-0023 | RF-BIA-023; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Notificación de exportación lista (in-app y email con enlace, nunca adjunto con datos personales). | El email no contiene filas. |
| CP-BIA-0024 | RF-BIA-024; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Regla de alerta: KPI-MOR-02 > 12 % durante 2 días, `warning` | Expiración y purga automática de archivos (`PRM-BIA-008`); el registro de la exportación se conserva. | A los 7 días el archivo deja de existir y la fila indica `expired`. |
| CP-BIA-0025 | RF-BIA-025; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Límites por formato: XLSX ≤ 1.048.575 filas por hoja (divide en hojas o sugiere CSV), PDF ≤ `PRM-BIA-006` filas, CSV sin límite práctico (comprimido ZIP sobre `PRM-BIA-009` MB). | Un export de 2 M filas a XLSX produce 2 hojas o propone CSV. |
| CP-BIA-0026 | RF-BIA-026; T10 §5; PRO-O1-17 | O1 | Núcleo | migración | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | CSV UTF-8 (BOM opcional), separador configurable (`;` por defecto, como ProCoop), decimales con punto en CSV técnico o coma en CSV "regional", fechas `dd-mm-yyyy` en regional e ISO 8601 en técnico. | El usuario elige "Regional (Excel AR)" o "Técnico". |
| CP-BIA-0027 | RF-BIA-027; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Importes exportados sin pérdida (Decimal como número con escala fija en XLSX, texto decimal en CSV técnico). | ARS 1234567,89 conserva centavos. |
| CP-BIA-0028 | RF-BIA-028; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Protección contra inyección de fórmulas en CSV/XLSX (celdas que empiezan con `=`, `+`, `-`, `@`, tab o CR se prefijan con `'`). | Un nombre "=HYPERLINK(...)" se exporta como texto. |
| CP-BIA-0029 | RF-BIA-029; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | PDF con pie de página "Generado por <usuario> el <fecha>" y marca de agua cuando contiene datos personales. | Todo PDF exportado muestra en el pie usuario y fecha de generación; si incluye un campo marcado `pii` lleva marca de agua. |
| CP-BIA-0030 | RF-BIA-030; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Layout: LAY-CONT-01 de 120 posiciones sobre REP-CON-001 | Layouts de archivo plano configurables por tenant (columnas, orden, tipo, largo, precisión, formato, relleno izquierdo, obligatorio, valor fijo, valor para vacío, separador o ancho fijo, encabezado/pie, nombre de archivo con variables). | Un layout de 120 posiciones produce líneas de exactamente 120 caracteres. |
| CP-BIA-0031 | RF-BIA-031; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Compresión ZIP de exportaciones múltiples (varios archivos de una misma corrida). | Una corrida con más de un archivo exportado se descarga como un único ZIP que contiene todos los archivos. |
| CP-BIA-0032 | RF-BIA-032; T10 §5; PRO-O1-17 | O1 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Checksum SHA-256 y tamaño de cada archivo exportado. | Cada exportación registra tamaño y SHA-256; recalcular el hash del archivo descargado da el mismo valor. |
| CP-BIA-0033 | RF-BIA-033; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Cuotas de ejecución y exportación concurrente por usuario (`PRM-BIA-010`) y por tenant (`PRM-BIA-011`) con cola justa entre tenants. | Un tenant con 50 exportaciones encoladas no demora las de otro. |
| CP-BIA-0034 | RF-BIA-034; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Auditoría de ejecución, exportación y descarga de reportes con datos personales (`reportAccessLogs`). | REP-BIA-002 muestra quién exportó el padrón y cuándo. |
| CP-BIA-0035 | RF-BIA-035; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo | Programación de reportes: frecuencia diaria, semanal (días), mensual (día n o último/n-ésimo hábil), por cron avanzado, o por evento (cierre de lote, cierre de caja, cierre de período). | Un programado "mensual día hábil 1" corre el 2/12/2026 si el 1 es feriado del calendario del tenant. |
| CP-BIA-0036 | RF-BIA-036; T10 §5; PRO-O2-18 | O2 | Estándar | seguridad | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Destinatarios: usuarios del tenant (verifica permisos de cada uno) y emails externos (PA-BIA-04). | Un destinatario sin permiso no recibe el enlace. |
| CP-BIA-0037 | RF-BIA-037; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo | Parámetros relativos en programados (`today`, `yesterday`, `previousMonth`, `currentCycle`, `lastClosedPeriod`). | Un programado con `previousMonth` ejecutado el 05-03 usa el período 02 sin editar la programación. |
| CP-BIA-0038 | RF-BIA-038; T10 §5; PRO-O2-18 | O2 | Núcleo | funcional | TEN-001 con Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo | La programación corre con los permisos **actuales** del propietario; si los perdió o fue desactivado se suspende y se avisa al administrador. | Revocar rol suspende sus programaciones en la siguiente corrida. |
| CP-BIA-0039 | RF-BIA-039; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo | Suspensión automática tras `PRM-BIA-013` fallos consecutivos e historial de entregas. | Tras `PRM-BIA-013` fallos consecutivos la programación pasa a suspendida, se avisa al propietario y el historial muestra cada entrega fallida. |
| CP-BIA-0040 | RF-BIA-040; T10 §5; PRO-O1-17 | O1 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. | Una vista compartida no muestra columnas sensibles a quien no las puede ver. |
| CP-BIA-0041 | RF-BIA-041; T10 §5; PRO-O11-02 | O11 | Estándar | funcional | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Generador de reportes del tenant sobre datasets semánticos: elegir dataset, campos, filtros, agrupaciones, métricas, orden, formato condicional, totales y gráfico. | Un analista arma "Deuda por barrio" sin intervención del proveedor. |
| CP-BIA-0042 | RF-BIA-042; T10 §5; PRO-O11-02 | O11 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Prohibido SQL libre, procedimientos almacenados o selección de tablas internas en reportes personalizados. | No existe endpoint que reciba consultas textuales. |
| CP-BIA-0043 | RF-BIA-043; T10 §5; PRO-O11-02 | O11 | Estándar | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de `bia.disenador.publicar` y auditoría. | Un reporte personalizado no se publica sin aprobación de un usuario con `bia.disenador.publicar` distinto del autor; cada cambio de estado queda auditado. |
| CP-BIA-0044 | RF-BIA-044; T10 §5; PRO-O11-02 | O11 | Estándar | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). | Copiar una plantilla de la galería crea un reporte en borrador del tenant sin datos de otro tenant. |
| CP-BIA-0045 | RF-BIA-045; T10 §5; PRO-O11-02 | O11 | Núcleo | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Límite de costo de consulta del generador (`PRM-BIA-020` documentos escaneados) y ejecución siempre sobre el almacén analítico. | Una consulta del generador que supera `PRM-BIA-020` documentos escaneados se rechaza antes de ejecutar; ninguna consulta del generador corre sobre la base operativa. |
| CP-BIA-0046 | RF-BIA-046; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Catálogo de indicadores con definición exacta: fórmula, numerador/denominador, nivel, universo y estados incluidos, tipo de fecha y corte, frecuencia de refresco, dimensiones, unidad, decimales, sentido (mayor es mejor), permiso de… | Cada indicador de §15.6 está cargado con todos los atributos. |
| CP-BIA-0047 | RF-BIA-047; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Certificación y versionado de indicadores; los snapshots guardan la versión. | Un snapshot de indicador guarda la versión vigente; cambiar la fórmula crea una versión nueva sin alterar los snapshots anteriores. |
| CP-BIA-0048 | RF-BIA-048; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Tablero de plataforma (GOB-001): tenants y estados, errores de procesos e integraciones, trabajos pendientes, disponibilidad, configuraciones incompletas, uso de API; sólo agregados. | El operador no ve nombres de socios. |
| CP-BIA-0049 | RF-BIA-049; T10 §5; PRO-O2-18 | O2 | Núcleo | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Tablero del tenant (GOB-002) y tableros por rol (§15.7), que crecen con cada ola. | Al habilitar M05 aparecen indicadores de facturación. |
| CP-BIA-0050 | RF-BIA-050; T10 §5; PRO-O2-18 | O2 | Núcleo | regla | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Tablero de responsables de área: casos sin asignar, turnos fallidos, tareas vencidas, conciliaciones pendientes, reglas sin aprobar. | El tablero de un responsable muestra solo los pendientes de su área y alcance, con enlace al registro en su módulo. |
| CP-BIA-0051 | RF-BIA-051; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Widgets: KPI con variación y semáforo, serie temporal, barras/ranking, torta (máx 6 porciones), tabla, mapa de calor por zona, embudo; gráficos SVG/CSS propios. | Cada tipo de widget renderiza con datos ficticios; una torta con más de 6 categorías agrupa el resto en "Otros". |
| CP-BIA-0052 | RF-BIA-052; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | "Vacío honesto": sin datos se muestra "sin datos para el universo elegido" y no cero. | Un universo sin datos muestra el mensaje de vacío y no el valor 0. |
| CP-BIA-0053 | RF-BIA-053; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Comparación contra período anterior, mismo período del año anterior, objetivo, óptimo y umbral, con estado (ok/advertencia/crítico). | Un KPI con objetivo y umbral muestra la variación contra el período comparado y el estado ok, advertencia o crítico según el umbral. |
| CP-BIA-0054 | RF-BIA-054; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Tendencias con snapshots diarios y de cierre mensual. | La tendencia de un indicador muestra un punto por día desde los snapshots diarios y el valor de cierre de cada mes. |
| CP-BIA-0055 | RF-BIA-055; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Filtros globales del tablero (período, servicio, sucursal, zona, categoría) respetando alcance. | Un filtro global de sucursal cambia todos los widgets del tablero y nunca muestra datos fuera del alcance del usuario. |
| CP-BIA-0056 | RF-BIA-056; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Personalización por usuario (fijar, ocultar, reordenar widgets) sin alterar definiciones. | Ocultar o reordenar widgets se conserva para el usuario y no cambia el tablero de otro usuario ni su definición. |
| CP-BIA-0057 | RF-BIA-057; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Tablero móvil en PWA empleado (cards KPI). | La PWA del empleado muestra los KPI del tablero de su rol como cards con los mismos valores que el admin. |
| CP-BIA-0058 | RF-BIA-058; T10 §5; PRO-O1-17 | O1 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Frescura visible (hora del dato) en cada widget. | Cada widget muestra la fecha y hora del dato; si supera la frescura objetivo se marca como desactualizado. |
| CP-BIA-0059 | RF-BIA-059; T10 §5; PRO-O2-18 | O2 | Núcleo | regla | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Reglas de alerta sobre indicadores: condición, severidad, destinatarios (usuarios/roles), canales, deduplicación, estado (abierta/reconocida/resuelta/silenciada), escalamiento, vínculo al objeto. | Una alerta repetida no genera dos notificaciones dentro de la ventana de deduplicación. |
| CP-BIA-0060 | RF-BIA-060; T10 §5; PRO-O11-01 | O11 | Estándar | integración | TEN-001 con Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed` | Almacén analítico aislado por tenant, alimentado por eventos outbox y change streams, con proyecciones `bi_*` (hechos y dimensiones). | Una consulta pesada de BI no aumenta la latencia de facturación (prueba de carga). |
| CP-BIA-0061 | RF-BIA-061; T10 §5; PRO-O11-01 | O11 | Estándar | regla | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Refresco incremental (objetivo ≤ `PRM-BIA-030` minutos) y snapshots diarios y de cierre. | Un cambio en la fuente aparece en la proyección en ≤ `PRM-BIA-030` minutos y los snapshots diarios y de cierre se generan sin intervención. |
| CP-BIA-0062 | RF-BIA-062; T10 §5; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Reconstrucción completa de una proyección por tenant desde la fuente (job `bia:reconstruir-proyeccion`). | Reconstruir la proyección de un tenant reproduce los mismos totales que la fuente y no afecta a otros tenants. |
| CP-BIA-0063 | RF-BIA-063; T10 §5; PRO-O11-01 | O11 | Núcleo | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. | REP-BIA-007 muestra 0 diferencias en CU-BIA-08. |
| CP-BIA-0064 | RF-BIA-064; T10 §5; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". | Un reporte "como era" a una fecha pasada usa la categoría vigente en esa fecha; "como es" usa la actual. |
| CP-BIA-0065 | RF-BIA-065; T10 §5; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Salas BI con contrato `summary`, `items`, `export.xlsx`, `analyze-auto`, `ask`, `schedule` para Facturación, Cobranza, Mora, Consumos, Reclamos, Técnica, Compras, Tesorería, Contabilidad, Personal, Institucional y Comunidad. | Cada sala responde los seis puntos del contrato con datos ficticios del tenant y respeta el alcance del usuario. |
| CP-BIA-0066 | RF-BIA-066; T10 §5; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | IA analítica: preguntas en lenguaje natural (de catálogo o libres) traducidas a consulta semántica; respuesta con cifras, KPI/dataset citado, universo y corte. | Toda cifra de la respuesta coincide con la consulta registrada. |
| CP-BIA-0067 | RF-BIA-067; T10 §5; PRO-O11-01 | O11 | Núcleo | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | La IA aplica permisos y alcance del usuario antes de consultar; nunca envía datos personales al proveedor; si no puede responder lo dice. | Pregunta sobre otra zona fuera de alcance → "no tenés acceso a ese universo". |
| CP-BIA-0068 | RF-BIA-068; T10 §5; PRO-O11-01 | O11 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Análisis automático cacheado por sala (recalcula cada `PRM-BIA-034` horas o al cambiar el universo); capa A funciona sin IA. | El análisis automático se recalcula solo al vencer `PRM-BIA-034` horas o al cambiar el universo; con IA apagada la capa A sigue disponible. |
| CP-BIA-0069 | RF-BIA-069; T10 §5; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. | Con 4 participantes en un segmento no se muestra el valor. |
| CP-BIA-0070 | RF-BIA-070; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. | CU-API-01. |
| CP-BIA-0071 | RF-BIA-071; T10 §5; PRO-O11-03 | O11 | Núcleo | seguridad | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Autenticación OAuth 2.0 client credentials (token de acceso de `PRM-BIA-040` minutos) y API key para herramientas de BI de sólo lectura. | Un cliente obtiene un token con client credentials que vence a los `PRM-BIA-040` minutos; una API key de BI no puede invocar endpoints de escritura. |
| CP-BIA-0072 | RF-BIA-072; T10 §5; PRO-O11-03 | O11 | Núcleo | regla | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Secretos mostrados una sola vez, guardados con hash, con prefijo visible; rotación con solapamiento; expiración; revocación efectiva ≤ `PRM-BIA-043` segundos. | Una credencial revocada falla en ≤ 60 s. |
| CP-BIA-0073 | RF-BIA-073; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Scopes por recurso y acción; restricción por campo (minimización); scope `pii:read` separado. | Sin `pii:read`, `/persons` devuelve documento enmascarado. |
| CP-BIA-0074 | RF-BIA-074; T10 §5; PRO-O11-03 | O11 | Núcleo | seguridad | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Rate limit por cliente y por tenant (token bucket), cabeceras `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, 429 con `Retry-After`; cuotas diarias por plan. | Superar el límite devuelve 429 con `Retry-After` y las cabeceras `RateLimit-*`; agotar la cuota diaria del plan bloquea hasta el día siguiente. |
| CP-BIA-0075 | RF-BIA-075; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed` | Pool de ejecución separado para la API ext y BI (workers/réplica de lectura) para no afectar facturación ni atención. | Prueba de carga ext a 200 rps no degrada p95 de `/api/admin`. |
| CP-BIA-0076 | RF-BIA-076; T10 §5; PRO-O11-03 | O11 | Núcleo | regla | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Versionado por URI (`/api/v1/ext`), cambios aditivos compatibles, deprecación con cabeceras `Deprecation` y `Sunset` y aviso ≥ `PRM-BIA-045` meses. | Un recurso deprecado responde con `Deprecation` y `Sunset`; un cambio incompatible no se publica en `v1`. |
| CP-BIA-0077 | RF-BIA-077; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | OpenAPI 3.1 generado desde los esquemas Zod, publicado por tenant (sólo los recursos licenciados) y portal de documentación con ejemplos ficticios. | `GET /api/v1/ext/openapi.json` valida con un linter OpenAPI. |
| CP-BIA-0078 | RF-BIA-078; T10 §5; PRO-O11-03 | O11 | Núcleo | integración | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Paginación `?page=&size=` → `{ items, total, page, size }` y modo incremental por cursor (`?updatedSince=&cursor=`) con bajas como tombstones. | Una sincronización incremental reproduce exactamente el estado final. |
| CP-BIA-0079 | RF-BIA-079; T10 §5; PRO-O11-03 | O11 | Núcleo | integración | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Errores RFC 9457 con `requestId`, sin revelar secretos ni detalles internos. | Todo error de la API externa es RFC 9457 con `requestId` y no incluye trazas, secretos ni nombres de colecciones. |
| CP-BIA-0080 | RF-BIA-080; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Cada respuesta informa `asOf` (fecha de corte/frescura) y `source` (`operational`/`analytical`). | Toda respuesta incluye `asOf` y `source` con el origen real del dato. |
| CP-BIA-0081 | RF-BIA-081; T10 §5; PRO-O11-03 | O11 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Metadatos de etiquetas del diccionario (`/meta/labels`) sin renombrar campos técnicos. | `/meta/labels` devuelve la etiqueta del diccionario del tenant y los nombres técnicos de los campos no cambian al personalizar etiquetas. |
| CP-BIA-0082 | RF-BIA-082; T10 §5; PRO-O11-03 | O11 | Estándar | regla | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Exportaciones masivas autorizadas (`/exports`) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). | Una exportación masiva pasa por sus estados, vence según su política y se descarga solo con URL firmada vigente. |
| CP-BIA-0083 | RF-BIA-083; T10 §5; PRO-O11-03 | O11 | Estándar | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. | Firma inválida detectable por el tercero con el ejemplo publicado. |
| CP-BIA-0084 | RF-BIA-084; T10 §5; PRO-O11-03 | O11 | Núcleo | seguridad | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Registro de uso por llamada (cliente, scope, endpoint, estado, latencia, filas, bytes) sin token ni secreto; agregados diarios. | Cada llamada genera un registro de uso sin token ni secreto y el agregado diario coincide con la suma de los registros. |
| CP-BIA-0085 | RF-BIA-085; T10 §5; PRO-O11-03 | O11 | Estándar | funcional | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Sandbox con tenant de demostración y datos ficticios para probar integraciones. | Un cliente de sandbox consume la API con datos ficticios del tenant de demostración y no accede a ningún tenant productivo. |
| CP-BIA-0086 | RF-BIA-086; T10 §5; PRO-O11-03 | O11 | Núcleo | seguridad | TEN-001 con Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real**… | Suspensión del tenant o del cliente corta la API (403 `tenant-suspended`/`client-suspended`); cierre del tenant habilita sólo exportación de salida (MER-020). | Con el tenant o el cliente suspendido la API responde 403 con el código correspondiente; con el tenant cerrado solo responde la exportación de salida. |
| CP-BIA-0087 | RF-BIA-087; T10 §5; PRO-O11-03 | O11 | Núcleo | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. | La página de cada recurso documenta todos sus campos. |
| CP-BIA-0088 | RF-BIA-088; T10 §5; PRO-O11-03 | O11 | Estándar | integración | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Escrituras limitadas vía API como **solicitudes** que procesa el módulo dueño (alta de persona/cuenta, reclamo), con `Idempotency-Key`. | Una solicitud repetida con la misma clave devuelve el mismo resultado. |
| CP-BIA-0089 | RF-BIA-089; T10 §5; PRO-O11-02 | O11 | Estándar | regla | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. | Dataset abierto no contiene ninguna celda con n < `PRM-BIA-050`. |
| CP-BIA-0090 | RF-BIA-090; T10 §5; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Catálogo de informes regulatorios por organismo y servicio con período y vencimiento, referenciando el formato y la presentación del módulo dueño. | Cada informe regulatorio por servicio tiene código REP-BIA propio (REP-BIA-015 a REP-BIA-024, §15.5.1; HUE-SRV-08). |
| CP-BIA-0091 | RF-BIA-091; T10 §5; PRO-O11-02 | O11 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Exportación completa de datos del tenant para salida (portabilidad) con formatos documentados, usando el motor de exportación masiva. | El paquete incluye diccionario de datos y checksums. |
| CP-BIA-0092 | RF-BIA-092; T10 §5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 con Presets: "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`) | Reportes de control y conciliación entre cuentas corrientes, facturación, cobranza, tesorería y contabilidad. | REP-CON-015 cuadra créditos por servicios = saldo del auxiliar. |
| CP-BIA-0093 | RF-BIA-093; T10 §5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 con Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura | Reporte de universo de comprobante: emitido, cancelado, saldo, pagos en proceso separados. | CU-30. |
| CP-BIA-0094 | RF-BIA-094; T10 §5; PRO-O1-17 | O1 | Núcleo | regla | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Tipos de fecha seleccionables por reporte (emisión, vencimiento 1/2/3, período facturado, lectura, registración, pago, recibo, acreditación, contable). | El encabezado indica qué fecha se usó. |
| CP-BIA-0095 | RF-BIA-095; T10 §5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 con Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura | Reportes "a una fecha" (as-of) para saldos, deuda, cartera, stock y anticipos con fecha efectiva y, opcionalmente, "según lo registrado hasta" (bitemporal). | Deuda al 31/10 no cambia por un pago registrado el 2/11 con fecha efectiva 2/11. |
| CP-BIA-0096 | RF-BIA-096; T10 §5; PRO-O4-15 | O4 | Estándar | migración | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Rankings con N parametrizable (ProCoop fijo top 20). | Un ranking con N = 50 devuelve 50 filas; el valor por defecto es el del parámetro. |
| CP-BIA-0097 | RF-BIA-097; T10 §5; PRO-O2-18 | O2 | Estándar | regla | TEN-001 con Indicadores: KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) | Reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores duplicados, servicios duplicados). | Cada reporte de calidad lista los registros que no cumplen la regla con enlace a su ficha; con datos ficticios controlados devuelve exactamente los casos sembrados. |
| CP-BIA-0098 | RF-BIA-098; T10 §5; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Matrices configurables de filas y columnas por tenant (filas por categoría/tarifa/tramo, columnas por concepto/impuesto) para informes de consumos y regulatorios. | Aviso de categorías faltantes y tramos inconsistentes antes de ejecutar. |
| CP-BIA-0099 | RF-BIA-099; T10 §5; PRO-O4-15 | O4 | Núcleo | integración | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Tablero de pendientes técnicos de integración y procesos (autorizaciones ARCA pendientes, lotes, conectores) para responsables. | El tablero muestra CAE pendientes, lotes y conectores con error del tenant y cada ítem abre su origen. |
| CP-BIA-0100 | RF-BIA-100; T10 §5; PRO-O1-17 | O1 | Núcleo | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Cada reporte, indicador y endpoint externo se prueba con un test de aislamiento multitenant en CI. | Test con códigos internos iguales en dos tenants. |
| CP-BIA-0101 | RF-BIA-101; T10 §5; PRO-O8-14 | O8 | Estándar | funcional | TEN-001 con Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300… | Exportación a sistema contable externo y a GIS mediante layouts/datasets (no como integración ad hoc). | La exportación contable o GIS se configura con un layout o dataset existente, sin código específico, y valida el formato antes de generar. |
| CP-BIA-0102 | RF-BIA-102; T10 §5; PRO-O11-02 | O11 | Estándar | integración | TEN-001 con Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 | Conector para herramientas BI (Power BI, Excel, Looker Studio) usando API key de sólo lectura sobre `/datasets` y feeds CSV paginados. | Power BI Desktop lee el dataset "Facturación" con la API key. |
| CP-BIA-0103 | RF-BIA-103; T10 §5; PRO-O2-18 | O2 | Estándar | funcional | TEN-001 con Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos | Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. | El reporte de uso muestra por reporte cantidad de corridas, tiempo medio y fallos del período. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-BIA-5001 — ESC-BIA-01. Usuario de TEN-001 ejecuta, exporta o descarga datos de TEN-002 (BASE §34 n.º 16)**

- Cubre: ESC-BIA-01; RF-BIA-100; RN-BIA-002; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario de TEN-001 ejecuta, exporta o descarga datos de TEN-002 (BASE §34 n.º 16)
- Entonces Denegado; sin filas ni conteos de TEN-002.

**CP-BIA-5002 — ESC-BIA-02. Dos tenants con códigos internos iguales (cuenta 1001) ejecutan REP-COB-001 (n.º 19, 29)**

- Cubre: ESC-BIA-02; RF-BIA-004, RF-BIA-100; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos tenants con códigos internos iguales (cuenta 1001) ejecutan REP-COB-001 (n.º 19, 29)
- Entonces Cada uno ve solo su cuenta.

**CP-BIA-5003 — ESC-BIA-03. Usuario con alcance zona Norte ejecuta REP-MOR-001**

- Cubre: ESC-BIA-03; RN-BIA-003; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Presets: "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario con alcance zona Norte ejecuta REP-MOR-001
- Entonces Filas y totales solo de zona Norte; no se informa cuántas filas se ocultaron.

**CP-BIA-5004 — ESC-BIA-04. Revocar el rol del propietario de una programación (n.º 20)**

- Cubre: ESC-BIA-04; RF-BIA-038; T10 §17
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Revocar el rol del propietario de una programación (n.º 20)
- Entonces La siguiente corrida la suspende y avisa.

**CP-BIA-5005 — ESC-BIA-05. Resumen de cuenta y facturas en el mismo reporte (n.º 27)**

- Cubre: ESC-BIA-05; RN-BIA-008; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Resumen de cuenta y facturas en el mismo reporte (n.º 27)
- Entonces El total no duplica.

**CP-BIA-5006 — ESC-BIA-06. Reporte de simulación tarifaria (n.º 39) y plan alternativo (n.º 40)**

- Cubre: ESC-BIA-06; RF-BIA-015; RN-BIA-020; T10 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte de simulación tarifaria (n.º 39) y plan alternativo (n.º 40)
- Entonces Marca SIMULACIÓN; ningún indicador real cambia.

**CP-BIA-5007 — ESC-BIA-07. Tablero de TEN-001 vs TEN-002; tablero de plataforma (n.º 43)**

- Cubre: ESC-BIA-07; RF-BIA-048; RN-BIA-026; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tablero de TEN-001 vs TEN-002; tablero de plataforma (n.º 43)
- Entonces Sin cruce; plataforma solo agregados.

**CP-BIA-5008 — ESC-BIA-08. Token de BI de TEN-001 consulta TEN-002 o intenta escribir (n.º 45)**

- Cubre: ESC-BIA-08; RN-BIA-029, RN-BIA-031; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Token de BI de TEN-001 consulta TEN-002 o intenta escribir (n.º 45)
- Entonces 404 y 403 `insufficient-scope`.

**CP-BIA-5009 — ESC-BIA-09. Revocar o vencer una credencial (n.º 46)**

- Cubre: ESC-BIA-09; RN-BIA-036; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real** (prefijo `gac_demo0001`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Revocar o vencer una credencial (n.º 46)
- Entonces Falla en ≤ `PRM-BIA-043` s.

**CP-BIA-5010 — ESC-BIA-10. Renombrar "Socio" a "Asociado" en el diccionario (n.º 54)**

- Cubre: ESC-BIA-10; RF-BIA-013; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Renombrar "Socio" a "Asociado" en el diccionario (n.º 54)
- Entonces Cambian encabezados de UI/PDF; no cambian `fieldKey`, campos de API ni CSV técnico.

**CP-BIA-5011 — ESC-BIA-11. CU-30 CU-30**

- Cubre: ESC-BIA-11; RF-BIA-093; relacionados: CU-30; T10 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CU-30
- Entonces Emitido 13.000, cancelado 13.000, saldo 0; en proceso separado.

**CP-BIA-5012 — ESC-BIA-12. Exportación de 2 M filas a XLSX**

- Cubre: ESC-BIA-12; RF-BIA-025, RF-BIA-032; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Exportación de 2 M filas a XLSX
- Entonces 2 hojas o propuesta de CSV; SHA-256 correcto.

**CP-BIA-5013 — ESC-BIA-13. Celda con `=HYPERLINK(...)`**

- Cubre: ESC-BIA-13; RF-BIA-028; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Celda con `=HYPERLINK(...)`
- Entonces Exportada como texto.

**CP-BIA-5014 — ESC-BIA-14. URL firmada vencida o usada por otro usuario**

- Cubre: ESC-BIA-14; RF-BIA-022; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando URL firmada vencida o usada por otro usuario
- Entonces 403.

**CP-BIA-5015 — ESC-BIA-15. Email de programación con reporte personal**

- Cubre: ESC-BIA-15; RN-BIA-019; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Email de programación con reporte personal
- Entonces Solo enlace, sin filas.

**CP-BIA-5016 — ESC-BIA-16. Reporte de 300.000 filas**

- Cubre: ESC-BIA-16; RF-BIA-005, RF-BIA-009; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte de 300.000 filas
- Entonces Pasa a async sin bloquear; cancelable.

**CP-BIA-5017 — ESC-BIA-17. 50 exportaciones encoladas en TEN-001**

- Cubre: ESC-BIA-17; RF-BIA-033; T10 §17
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando 50 exportaciones encoladas en TEN-001
- Entonces La de TEN-002 no espera más que el objetivo de la cola justa.

**CP-BIA-5018 — ESC-BIA-18. Indicador sin datos o denominador 0**

- Cubre: ESC-BIA-18; RN-BIA-022; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Indicador sin datos o denominador 0
- Entonces Muestra "sin datos", nunca 0.

**CP-BIA-5019 — ESC-BIA-19. Cambio de fórmula de un KPI certificado**

- Cubre: ESC-BIA-19; RN-BIA-021; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de fórmula de un KPI certificado
- Entonces Versión nueva; snapshots viejos conservan versión.

**CP-BIA-5020 — ESC-BIA-20. Deuda al 31-10 con un pago del 2-11 de fecha efectiva 2-11**

- Cubre: ESC-BIA-20; RF-BIA-095; T10 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Deuda al 31-10 con un pago del 2-11 de fecha efectiva 2-11
- Entonces Saldo al 31-10 no cambia.

**CP-BIA-5021 — ESC-BIA-21. Reconciliación operativo vs analítico (CU-BIA-08)**

- Cubre: ESC-BIA-21; RF-BIA-063; relacionados: CU-BIA-08; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Regla de alerta: KPI-MOR-02 > 12 % durante 2 días, `warning`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reconciliación operativo vs analítico (CU-BIA-08)
- Entonces 0 diferencias en estado normal; alerta ante evento faltante.

**CP-BIA-5022 — ESC-BIA-22. IA: cifra no presente en la consulta**

- Cubre: ESC-BIA-22; RN-BIA-028; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando IA: cifra no presente en la consulta
- Entonces El backend rechaza y devuelve respuesta determinística.

**CP-BIA-5023 — ESC-BIA-23. IA: pregunta fuera de alcance o por un socio individual**

- Cubre: ESC-BIA-23; RF-BIA-067; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando IA: pregunta fuera de alcance o por un socio individual
- Entonces Rechazo con motivo; no envía datos personales al proveedor.

**CP-BIA-5024 — ESC-BIA-24. Exceso de rate limit**

- Cubre: ESC-BIA-24; RF-BIA-074; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Exceso de rate limit
- Entonces 429 con `Retry-After` y cabeceras `RateLimit-*`.

**CP-BIA-5025 — ESC-BIA-25. Incremental con transacción en curso**

- Cubre: ESC-BIA-25; RN-BIA-033; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Incremental con transacción en curso
- Entonces Ningún registro se pierde entre dos páginas (marca de agua).

**CP-BIA-5026 — ESC-BIA-26. Webhook con firma alterada o timestamp > tolerancia**

- Cubre: ESC-BIA-26; RN-BIA-034; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Webhook con firma alterada o timestamp > tolerancia
- Entonces El ejemplo de verificación lo rechaza.

**CP-BIA-5027 — ESC-BIA-27. Suscripción a URL privada (`http://10.0.0.5`)**

- Cubre: ESC-BIA-27; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Suscripción a URL privada (`http://10.0.0.5`)
- Entonces Rechazada (anti SSRF).

**CP-BIA-5028 — ESC-BIA-28. Prueba de carga ext a 200 rps**

- Cubre: ESC-BIA-28; RF-BIA-075; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Prueba de carga ext a 200 rps
- Entonces P95 de `/api/admin` no se degrada más de 10 %.

**CP-BIA-5029 — ESC-BIA-29. `openapi.json`**

- Cubre: ESC-BIA-29; RF-BIA-077; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real** (prefijo `gac_demo0001`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando `openapi.json`
- Entonces Valida con linter y refleja solo recursos licenciados y scopes del cliente.

**CP-BIA-5030 — ESC-BIA-30. Dataset abierto con celda n = 4**

- Cubre: ESC-BIA-30; RN-BIA-041; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dataset abierto con celda n = 4
- Entonces Suprimida o agregada en "Otros".

**CP-BIA-5031 — ESC-BIA-31. Benchmark con 4 participantes**

- Cubre: ESC-BIA-31; RN-BIA-027; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Benchmark: 6 tenants ficticios del segmento Internet / 2.000–10.000 / Córdoba
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Benchmark con 4 participantes
- Entonces "Muestra insuficiente".

**CP-BIA-5032 — ESC-BIA-32. Preset compartido usado por usuario con menor alcance**

- Cubre: ESC-BIA-32; RN-BIA-042; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Preset compartido usado por usuario con menor alcance
- Entonces Se intersecan permisos; columnas sensibles ocultas.

**CP-BIA-5033 — ESC-BIA-33. Reporte "Recursos asignados a obras" con valor hora tipeado**

- Cubre: ESC-BIA-33; RN-BIA-001; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte "Recursos asignados a obras" con valor hora tipeado
- Entonces Configuración (T04) no cambia.

**CP-BIA-5034 — ESC-BIA-34. Matriz regulatoria con categoría faltante o tramos superpuestos**

- Cubre: ESC-BIA-34; RN-BIA-047; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Matriz regulatoria con categoría faltante o tramos superpuestos
- Entonces Aviso antes de ejecutar.

**CP-BIA-5035 — ESC-BIA-35. Variación con base 0**

- Cubre: ESC-BIA-35; RN-BIA-010; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Variación con base 0
- Entonces Nulo con marca "nuevo" (modo GoodApps) o 100 (modo ProCoop).

**CP-BIA-5036 — ESC-BIA-36. Reintento de corrida programada tras caída del worker**

- Cubre: ESC-BIA-36; T10 §17
- Ola: O11 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento de corrida programada tras caída del worker
- Entonces No duplica envío (`scheduleId+plannedAt`).

**CP-BIA-5037 — ESC-BIA-37. Suspensión del tenant**

- Cubre: ESC-BIA-37; RF-BIA-086; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Suspensión del tenant
- Entonces API ext 403 `tenant-suspended`; programaciones pausadas.

**CP-BIA-5038 — ESC-BIA-38. Permisos negativos: usuario sin `bia.datosSensibles.ver`**

- Cubre: ESC-BIA-38; RF-BIA-014, RF-BIA-073; T10 §17
- Ola: O11 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real** (prefijo `gac_demo0001`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permisos negativos: usuario sin `bia.datosSensibles.ver`
- Entonces DNI enmascarado en pantalla, export y API sin `pii:read`.

## 3. Casos por caso de uso (CU)

**CP-BIA-8001 — CU-30. Universo de un comprobante (BASE §30)**

- Cubre: CU-30; RN-BIA-009; T10 §16
- Ola: O11 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Comprobante CU-30: FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura
- Dado actor: Gerente. - Situación inicial: escenario demo con la factura FAC-DEMO-001 de ARS 13.000 y pagos confirmados de ARS 5.000 y ARS 8.000. - Desarrollo: 1) Abre REP-COB-024 con universo FAC-DEMO-001 y fecha de corte 31-10-2026. 2) Consulta importe emitido, cancelado y saldo. 3) Abre el detalle (drill-down) y compara con documentos e imputaciones. - Resultado, autenticado en TEN-001 con las capabilities de su rol
- Cuando -
- Entonces Emitido ARS 13.000, cancelado ARS 13.000, saldo ARS 0; la acreditación bancaria neta aparece como otro indicador (KPI-COB-10). - Excepción: si hay pagos en proceso, se muestran en columna "En proceso" separada de los confirmados (RN-BIA-009).

**CP-BIA-8002 — CU-GOB-01. Configuración pendiente en el tablero del tenant (BASE §54; dueño T11)**

- Cubre: CU-GOB-01; RF-WFL-110; T10 §16
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Configuración pendiente en el tablero del tenant (BASE §54; dueño T11)
- Entonces El caso de uso lo define T11 §16.1 ("Cambio de configuración aprobado": RF-WFL-110, EVT-CFG-02, EVT-WFL-016); T10 aporta solo la vista del tablero (corrección del 05-11-2026; antes este anexo lo definía como propio). Un usuario autorizado modifica en TEN-001 la regla BON-VAR-30 del 30 % al 20 % con vigencia futura (T04). El cambio queda pendiente de aprobación. DSH-GER y DSH-AREA muestran el widget "Configuraciones pendientes" (fuente REP-CFG-001) y un usuario con permiso abre la evidencia (versión anterior, propuesta, actor, fecha). Al aprobarse, el widget se vacía y la aprobación queda como evento propio.

**CP-BIA-8003 — CU-ERP-01. Comparación de planes de cuentas (BASE §55)**

- Cubre: CU-ERP-01; RF-BIA-015; RN-BIA-020; T10 §16
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Plan contable CU-ERP-01: PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comparación de planes de cuentas (BASE §55)
- Entonces El caso es de M15 (dueño de CU-ERP-01, M15 §16); T10 cubre solo la salida del reporte. El contador de TEN-001 ejecuta REP-CON-004 sobre el plan operativo PC-OPER-01 (Ingresos por servicios ARS 38.000) y sobre el alternativo PC-ALT-01 (Ingresos Agua ARS 13.000 e Ingresos Internet ARS 25.000; total ARS 38.000): los totales de los dos planes coinciden. La simulación SIM-ERP-001 de M15 aplica tarifa +10 % y da Agua ARS 14.300, Internet ARS 27.500 y total ARS 41.800, mientras los libros oficiales siguen en ARS 38.000 (prevalece M15; antes T10 asignaba a SIM-ERP-001 el total ARS 38.000). El reporte de la simulación lleva marca "SIMULACIÓN", columna `scenarioId` y no se mezcla con el oficial…

**CP-BIA-8004 — CU-API-01. Cliente de BI de la cooperativa (BASE §59)**

- Cubre: CU-API-01; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T10 §18.
- Datos de prueba: Cliente de API: CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real** (prefijo `gac_demo0001`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando 1. El administrador de TEN-001 crea en PAN-BIA-15 el cliente CLI-BI-A (responsable USR-ADM-A, finalidad "Tablero propio de gerencia", scopes `billing:read` y `collections:read`, equivalentes a las propuestas `facturacion:leer` y `cobranza:leer` de BASE). 2. Otro usuario con `bia.api.clientes.aprobar` lo aprueba y emite la credencial (secreto visible una vez). 3. La herramienta obtiene un token (API-IAM-48) y consulta `GET /api/v1/ext/invoices?updatedSince=…` y `GET /payments`, paginado, con `asOf`. 4. Intentar…
- Entonces 404; intentar `POST` sobre facturas → 405/403 `insufficient-scope`. 5. Al revocar la credencial, en ≤ 60 s las llamadas devuelven 401 `invalid-token`.

**CP-BIA-8005 — CU-BIA-01. Ejecutar y exportar un reporte operativo**

- Cubre: CU-BIA-01; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Presets: "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ejecutar y exportar un reporte operativo
- Entonces El responsable de cobranzas abre REP-COB-002 (aging) con corte 31-10-2026 y servicio Internet, ve totales por tramo, abre el tramo 31–60 (drill-down), exporta a XLSX y descarga desde PAN-BIA-04. El archivo trae hoja "Metadatos" con universo, corte y versión.

**CP-BIA-8006 — CU-BIA-02. Reporte asíncrono con cancelación**

- Cubre: CU-BIA-02; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte asíncrono con cancelación
- Entonces Un analista ejecuta REP-PER-001 para 300.000 cuentas; el sistema pasa a modo asíncrono, muestra progreso, el usuario cancela a mitad y la corrida queda `cancelled` liberando el worker; reintenta más tarde y la corrida nueva termina con aviso in-app.

**CP-BIA-8007 — CU-BIA-03. Programación mensual por email**

- Cubre: CU-BIA-03; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T10 §18.
- Datos de prueba: Programación: REP-FAC-001 primer día hábil 07:00 al rol Consejo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Programación mensual por email
- Entonces La gerente programa REP-FAC-001 "primer día hábil de cada mes 07:00" con parámetro relativo `previousMonth`, formato XLSX y destinatarios: rol Consejo. El 2-11-2026 (si el 1 no es hábil, según calendario T04) corre, cada destinatario con permiso recibe un enlace; uno sin permiso queda `skippedNoPermission`.

**CP-BIA-8008 — CU-BIA-04. Alerta de indicador**

- Cubre: CU-BIA-04; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Regla de alerta: KPI-MOR-02 > 12 % durante 2 días, `warning`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Regla: KPI-MOR-02 > 12 % durante 2 días
- Entonces severidad `warning` al rol Responsable de mora por in-app y email. Se dispara, el responsable reconoce, la condición deja de cumplirse 2 snapshots seguidos y la alerta se resuelve sola.

**CP-BIA-8009 — CU-BIA-05. Layout de archivo plano**

- Cubre: CU-BIA-05; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Layout: LAY-CONT-01 de 120 posiciones sobre REP-CON-001
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Layout de archivo plano
- Entonces El tenant define un layout de 120 posiciones para un sistema contable externo sobre REP-CON-001; la vista previa muestra 20 líneas de exactamente 120 caracteres; se activa y se exporta el diario de octubre.

**CP-BIA-8010 — CU-BIA-06. Reporte personalizado**

- Cubre: CU-BIA-06; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte personalizado
- Entonces Un analista arma "Deuda por barrio" sobre el dataset DS-SALDOS (dimensión barrio, medida saldo vencido), lo envía a revisión, otro usuario lo aprueba y queda publicado al rol Gerencia como REP-TEN-0001.

**CP-BIA-8011 — CU-BIA-07. Pregunta a la IA analítica**

- Cubre: CU-BIA-07; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pregunta a la IA analítica
- Entonces En la sala Cobranza, la gerente pregunta "¿Cuánto cobramos en octubre por Mercado Pago comparado con septiembre?". La IA genera la consulta semántica (dataset DS-COBROS, medida Cobrado, dimensión canal, períodos 2026-10 y 2026-09), el backend la ejecuta y la respuesta cita KPI-COB-01, universo y corte; cada cifra coincide con la consulta registrada. Si pregunta "¿cuánto debe Juan Pérez?", la IA se niega y ofrece abrir la ficha del socio.

**CP-BIA-8012 — CU-BIA-08. Reconciliación del almacén analítico**

- Cubre: CU-BIA-08; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reconciliación del almacén analítico
- Entonces JOB-BIA-11 compara KPI-FAC-01 y KPI-COB-01 del día anterior entre fuente operativa y almacén; REP-BIA-007 muestra 0 diferencias. Se inyecta en ambiente de prueba un evento perdido: la diferencia supera la tolerancia, se emite EVT-BIA-14 y el dataset queda "en revisión" hasta reconstruir (JOB-BIA-12).

**CP-BIA-8013 — CU-BIA-09. Webhook firmado**

- Cubre: CU-BIA-09; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Webhook: Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Webhook firmado
- Entonces Un sistema municipal se suscribe a `payment.confirmed`; al confirmarse un pago recibe POST con `GoodApps-Signature: t=…,v1=…`, verifica la firma con el ejemplo publicado, responde 200. Si responde 500, recibe reintentos 1 min, 5 min, 30 min…; tras `PRM-BIA-048` horas la entrega pasa a `dead` y el contacto técnico es avisado.

**CP-BIA-8014 — CU-BIA-10. Exportación masiva y extracción incremental**

- Cubre: CU-BIA-10; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Exportación masiva y extracción incremental
- Entonces CLI-BI-A crea `POST /exports` del recurso `invoices` con `asOf`; descarga las partes NDJSON con checksum; luego consulta cada hora `GET /invoices?updatedSince=<asOf>` y recibe solo cambios (incluidas anulaciones como cambio de `status`).

**CP-BIA-8015 — CU-BIA-11. Salida del tenant (MER-020)**

- Cubre: CU-BIA-11; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Dataset abierto: "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Salida del tenant (MER-020)
- Entonces T01 inicia el cierre de TEN-002; JOB-BIA-21 genera un paquete por dataset canónico con diccionario y checksums; la API ext queda limitada a exportación; EVT-BIA-18 informa la entrega.

**CP-BIA-8016 — CU-BIA-12. Benchmark anónimo**

- Cubre: CU-BIA-12; T10 §16
- Ola: O11 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de T10 §18.
- Datos de prueba: Benchmark: 6 tenants ficticios del segmento Internet / 2.000–10.000 / Córdoba
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Benchmark anónimo
- Entonces TEN-001 adhiere en PAN-BIA-20 (segmento Internet, banda 2.000–10.000, Córdoba). En noviembre, con 6 participantes, ve que su KPI-MOR-02 está en el percentil 40 del segmento; un segmento con 4 participantes muestra "muestra insuficiente".
