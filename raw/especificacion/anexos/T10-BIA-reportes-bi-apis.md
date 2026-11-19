# T10 BIA — Reportes, BI, tableros, exportaciones y APIs para terceros

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma (motor de reportes, exportación, tableros, alertas de indicadores) / ERP (reportes operativos y de gestión de cada módulo) / APIs (sistema de APIs para terceros, BI, webhooks salientes, datos abiertos) — solución 8 "Sistema de APIs" de BASE §105 |
| Olas | **O1**: motor de reportes, catálogo, ejecución síncrona/asíncrona, exportación XLSX/CSV/PDF con BullMQ y descarga firmada, vistas guardadas de `DataTable`, tablero de plataforma (GOB-001), auditoría de acceso a reportes. **O2**: reportes programados por email, presets compartidos, tablero del tenant (GOB-002) con indicadores que crecen con cada módulo, alertas sobre indicadores (GOB-003). **Ola de cada módulo**: cada reporte del catálogo (§15) entra en la ola de su módulo dueño (PER/CAT/POR/COM O2, TEC/STK-equipos O3, FAC/TAR/FIS-básico O4, COB/CON-núcleo O5, MOR O6, MED/TAR-medido/FIS-reguladores eléctricos O7, CMP/STK/TES/CON/FIS-regímenes O8, SUE O9, INS/SOC/CRM-turnero/TEC-telefonía O10). **O11**: almacén analítico, salas BI, cubos certificados, IA analítica, generador de reportes del tenant (MER-013), API pública `/api/v1/ext`, webhooks salientes firmados, benchmarking anónimo, datos abiertos. |
| Dueño de datos | `reportDefinitions` (catálogo y versiones), `reportPresets`, `savedViews`, `reportRuns`, `reportExports`, `reportSchedules`, `reportDeliveries`, `reportTemplates` (plantillas/overrides PDF por tenant), `exportLayouts` (layouts de archivo plano configurables), `reportAccessLogs`, `indicatorDefinitions`, `indicatorSnapshots`, `dashboards`, `dashboardUserPrefs`, `kpiAlertRules`, `kpiAlerts`, `analyticsDatasets` (capa semántica), colecciones del almacén analítico `bi_*` (hechos y dimensiones, solo proyecciones), `customReports`, `aiQuestions`, campos de perfil de datos de `apiClients` (la colección y `apiCredentials` son de T02, CTR-BIA-01 y CTR-DAT-03 de T05), `reportRunResults`, `apiUsageLogs`, `apiUsageDaily`, `extWebhookSubscriptions`, `extWebhookDeliveries`, `extBulkExports`, `openDataPublications`, `benchmarkParticipations`, `benchmarkAggregates`. **No** es dueño de ningún dato de negocio: todo lo que muestra pertenece al módulo dueño (ARQ-01) y lo obtiene por su servicio de consulta o por proyección de sus eventos. |
| Fuentes consolidadas | BASE §30 (reportes y tableros, CU-30 y precarga), §31 (APIs documentadas y tokenizadas, exportaciones controladas, reporte de conciliación), §33 (entidad Cliente de API), §34 (escenarios de validación n.º 16, 19, 27, 29, 39, 40, 43, 45, 46, 54), §54 (GOB-001 a GOB-004, CU-GOB-01, precarga), §55 (comparación de planes y simulaciones, CU-ERP-01), §57 (pendientes de indicadores y alertas), §58 (ARQ-001: APIs de cooperativas, datos analíticos), §59 (API-001 a API-003, alcance, datos candidatos, CU-API-01, precarga), §65 (diccionario: claves de API estables), §75 (reportes contables, seguimiento de cuentas), §97.8 (aislamiento de carga de la API de BI), §99.3 (matriz: BI, generador de reportes, informes a reguladores), §100 MER-002, MER-013, MER-014, MER-020; §102 (correspondencia AGR-022 ↔ MER-013), §104 SUE-014, §105 (solución 8), §107 (mensaje original 2: "API o varias APIs tokenizadas… sus asociados y su info son de ellos"; mensaje sobre debilidades de ProCoop "No tiene API"); AGR-015 (acta de cierre), AGR-021 (operación de APIs), AGR-022 (contrato semántico de BI), AGR-028 (presupuesto vs comprometido vs devengado vs pagado), AGR-010 y AGR-011 (fecha efectiva y única fuente del saldo); CNX §2.3, §2.4, §2.6, §4.2, §4.3, §4.5 (BI "cubo certificado primero, IA después"), §4.6, §7.5 (sala de inteligencia), §10 (V-07 rate limiting); DFA Módulo 28 completo y menciones de informes de los módulos 3, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 29 (Power BI); REL `README.md` (menú: funciones de Informes por pestaña y Configuración > Reportes); CAT §25 (Informes y tablero: `ESTATAB`, `GRAFTAB`, `GRUPTAB`, `GRUTAB`, `INFOCTD`, `INFOCTG`, `INFOCTN`, `INFO_SYS`, `TABLAS_POWERBI`, `TABLERO`, `TENDTAB`, `TIPO_TAB`), §26 (Web/APIs: `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS`, `WEB_LOG`, `REQUISITOS`, `REQUISITOS_ITEMS`, `RSSFEED`, `WEB_NOVEDADES`), tablas `REPORTES`, `EXPORTADOR`, `EXPORTADOR_COLUMNAS`, `FORMULARIOS_PERSONALIZACIONES`, `INFO_AUD`, `ESQUEMAS_INFORMES_COBRANZAS`, `OT_REPORTE`, `ENGAS_CANTMESES`; RN-10 §12 (Integra API local y Agente), §13 (secretos hardcodeados, solo ubicación), §14 (implicancias), §16.4 (navegador genérico de entidades y filtros guardados), §16.5 (marco común de informes e informes personalizados); RN-04 §8.12, §9, §10; RN-05 §13.11; RN-06 §23.7; RN-07 §1.10, §1.11; RN-08 §5.5, §15.1 `clsInformes_Tesoreria`, §15.2 `clsInformes_Contabilidad`; RN-01 §23.8, §23.9; RN-11 §4; FIC 8 (reguladores, referencia), 14.3 (API para terceros), 18.1 (Power BI), 18.2 (contable externo); INV `ReglasNegocio` (enumeraciones de listados: `Listados_Cobranzas`, `Informes_Cobranza`, `Informes_Mora`, `Listados_Financiacion`, `Listados_Tickets`, `Listados_Sueldos`, `Listados_Stock`, `Listados_Traslados`, `Listados_Telemed`, `Tipo_Informe` vivienda y consumos, `Listados_Titulares`, `Listados_Tesoreria`, `Listados_Contablidad`, `TipoInforme` de movimiento de conceptos, libro IVA, técnica y redes, `Listados_Facturacion`, `Listados_Compras`, `Informes_Telefonia`, `Listados_Consumos`, y clases `clsTablero`, `clsInformes*`, `clsPadronTitular`, `clsCirculares`, `clsInformesPersonalizados`, `clsExportacion`, `Exportador_Base`), INV `Configuracion` (`frmEditorReportes`, `frmListadosPersonalizados`, `frmListadosPersonalizados_Parametros`, `abm_Reportes`, `frmInformeSimple`, `frmConsultaGenerica`, `frmExportacionArchivos`, `frmResultadoExportacion`, `TiposArchivosExportacion`, `Grilla_OT_Reporte`), INV `ProMod_*` (formularios de informes de cada módulo, ver §22), INV `ProcoopNet` (`frmInformes`). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Dar a cada cooperativa (tenant), a la plataforma y a terceros autorizados una **capa única, gobernada y reproducible de consulta y explotación de datos**, que reemplace y mejore todo lo que ProCoop ofrece en "Informes", "Reportes", "Tablero de Control", "Editor de Reportes", "Informes Personalizados", "Exportador", "Tablas Power BI" e "Integra":

1. Un **motor de reportes** con catálogo, parámetros tipados, filtros, permisos por capability y alcance de datos, ejecución síncrona o asíncrona, salida en pantalla y exportación XLSX/CSV/PDF/archivo plano generada en workers BullMQ y descargada por URL firmada.
2. Un **catálogo completo de reportes** (REP-<MOD>-NNN) que cubre cada listado/informe de ProCoop y cada reporte exigido por la BASE, con su módulo dueño, propósito, parámetros y columnas principales.
3. **Reportes programados** por email, **presets** y **vistas guardadas**, y un **generador de reportes del tenant** (MER-013) que trabaja sólo sobre datos semánticos certificados, sin SQL libre.
4. **Tableros por rol** (plataforma, gerencia, facturación, cobranzas, mora, técnica, atención, compras, tesorería, contabilidad, RRHH, institucional) construidos sobre un **catálogo de indicadores** con definición exacta (fórmula, universo, estado incluido, fecha de corte, granularidad, frescura y permiso de detalle, AGR-022), con alertas y llegada al detalle.
5. Un **almacén analítico** aislado por tenant (proyecciones de lectura alimentadas por eventos), **salas BI** con patrón CNX "cubo certificado primero, IA después", **IA analítica** en lenguaje natural que respeta permisos y nunca inventa números, y **benchmarking anónimo** opcional entre cooperativas.
6. La **API pública `/api/v1/ext`** para terceros (BI propio, municipios, bots, federaciones, sistemas de la cooperativa): clientes por tenant, OAuth 2.0 client credentials y API key, scopes, rate limit, versionado, OpenAPI, extracción incremental, exportaciones masivas, webhooks salientes firmados y catálogo explícito de recursos (BASE §59: "el tenant debe disponer de sus datos").
7. **Datos abiertos y regulatorios**: publicación opcional de conjuntos agregados en la landing y referencia del catálogo de informes oficiales cuyo formato es propiedad de M06/M15/M16/M17 (MER-014).

Regla rectora: **un indicador o reporte vale lo mismo en el tablero, en la exportación, en BI y en la API** para el mismo universo y fecha de corte (AGR-022, criterio de aceptación).

## 2. Límite y responsabilidades

### 2.1 Qué hace

- Registra y gobierna el catálogo de reportes (`reportDefinitions`) que cada módulo dueño declara; ejecuta, pagina, totaliza, exporta, programa, entrega y audita.
- Provee la exportación genérica de cualquier `DataTable` del sistema (DFA M28: "todos los listados del sistema tienen Exportar e Imprimir").
- Administra presets ("esquemas de informes", ex `ESQUEMAS_INFORMES_COBRANZAS`), vistas guardadas (ex `ENTIDACOU`), plantillas y overrides PDF por tenant (ex `REPORTES` y carpetas `Reportes_Empresa`) y layouts de archivo plano (ex `EXPORTADOR`/`EXPORTADOR_COLUMNAS`).
- Mantiene el catálogo de indicadores (ex `TABLERO`, `TIPO_TAB`), sus snapshots históricos (ex `TENDTAB`), umbrales y estados (ex `VAL_OPT`, `VAL_UMB`, `ESTATAB`), agrupaciones (ex `GRUPTAB`, `GRUTAB`) y gráficos (ex `GRAFTAB`).
- Compone los tableros por rol y el tablero de plataforma; evalúa alertas sobre indicadores.
- Construye y mantiene el almacén analítico (`bi_*`) y la capa semántica (`analyticsDatasets`), con reconciliación diaria contra la fuente operativa.
- Opera la IA analítica (traducción de pregunta a consulta semántica, respuesta con citas).
- Expone y opera `/api/v1/ext`: clientes, credenciales, scopes, cuotas, registro de uso, OpenAPI, exportaciones masivas, webhooks salientes.
- Publica datos abiertos agregados y agregados anónimos de benchmarking.

### 2.2 Qué NO hace

- **No corrige ni modifica operaciones** desde un reporte o tablero (BASE §30: "no corrige operaciones mediante edición de un tablero"). Las acciones masivas que hoy salen de un informe ProCoop (por ejemplo "marcar registros" en `frmInformes_Preview`, "actualizar importes" en Recursos de obras, notificar desde Circulares) se ejecutan en el módulo dueño con su propio caso de uso; BIA sólo entrega la selección como lista de IDs (`selectionToken`).
- **No define el formato oficial** de libros, regímenes informativos, declaraciones juradas ni archivos a reguladores (ARCA, ARBA, DGR, ERSeP, OCEBA, ENARGAS, ENACOM, Secretaría de Energía, EPRE, RASE, SINTYS, INAES, SICOSS/F.931/LSD, SICORE): son de **M06 FIS**, **M15 CON**, **M16 SUE**, **M17 INS** y **M03 MED**; aquí sólo se referencian en el catálogo y se ejecutan con el motor común.
- No es dueño de documentos individuales imprimibles (factura, recibo, contrato, credencial, orden de trabajo, convenio, ficha de adherentes): son plantillas documentales de **T11 WFL** usadas por cada módulo.
- No recibe webhooks entrantes de pasarelas/entes ni define conectores (es **T06 INT**). No envía comunicaciones masivas a socios (es **T09 COM**); sólo envía reportes a usuarios.
- No administra identidad, roles ni el registro de auditoría de cambios (es **T02 IAM**); usa sus capabilities y escribe en `auditLogs` vía su servicio.
- No ejecuta escrituras de negocio desde la API ext salvo las expresamente habilitadas como solicitudes que el módulo dueño procesa (PA-BIA-03).
- No ofrece acceso a tablas internas ni consultas arbitrarias (BASE §59: "no prometer acceso ilimitado a cualquier tabla interna").

### 2.3 Qué delega y a quién

| Tema | Delegado a | Contrato |
|---|---|---|
| Datos de cada reporte operativo | Módulo dueño (M01–M19, T01, T02, T06, T07, T09, T11) | Cada módulo implementa un **report provider** (consulta de lectura sobre sus colecciones o read-model propio) registrado en BIA con esquema de parámetros Zod, columnas, granularidad y capabilities. |
| Formatos oficiales | M06, M15, M16, M17, M03 | Proveen el generador de archivo oficial como "formato de salida" del reporte; BIA ejecuta, guarda y entrega. |
| Plantillas PDF documentales | T11 | Motor HTML→PDF compartido. BIA usa el mismo motor para reportes tabulares. |
| Componente `DataTable`, `KpiGrid`, `ScreenHelp` | T03 | BIA aporta el backend de exportación y de vistas guardadas. |
| Envío de email | T09 (canal email transaccional) | Plantilla `bia.report.delivery`; BIA decide destinatarios y contenido. |
| Almacenamiento privado y URL firmadas | O0 core (T01/T08) | Prefijo `tenants/<tenantId>/bia/exports/...`. |
| Credenciales de proveedor IA, bóveda | T06 | BIA solicita secretos por referencia. |
| Licencias, cuotas por plan comercial | T01 | Capability `bia.api` y cuotas `apiQuota.*` por plan. |
| Migración de definiciones y presets ProCoop | T07 | Mapeo §19. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Reporte | Consulta definida y versionada, con parámetros, columnas, permisos y salidas. | `dict:bia.report` | Informe, Listado (`INFO_SYS`, enums `Listados_*`) |
| Definición de reporte | Metadatos del reporte en el catálogo (código, módulo dueño, versión). | `dict:bia.reportDefinition` | `INFO_SYS` (COD_INF, NOM_INFO, ORIGEN) |
| Provider | Función de consulta del módulo dueño que produce las filas del reporte. | `dict:bia.provider` | `clsInformes_<Módulo>.GetDatos*` |
| Parámetro | Entrada tipada del reporte (fecha, rango, servicio, zona, estado…). | `dict:bia.parameter` | Filtro (`clsInformes.GetFiltro`) |
| Preset | Juego de parámetros guardado con nombre, personal o compartido. | `dict:bia.preset` | Esquema de informe (`ESQUEMAS_INFORMES_COBRANZAS`) |
| Vista guardada | Columnas, filtros y orden guardados de una grilla. | `dict:bia.savedView` | Filtro guardado (`ENTIDACOU`) |
| Ejecución | Corrida concreta de un reporte con parámetros, actor y resultado. | `dict:bia.reportRun` | Impresión/Vista previa |
| Exportación | Archivo generado a partir de una ejecución o de una grilla. | `dict:bia.export` | Exportar a Excel / `frmResultadoExportacion` |
| Layout de archivo | Definición de columnas, formato, largo, relleno y valores fijos de un archivo plano. | `dict:bia.exportLayout` | `EXPORTADOR`, `EXPORTADOR_COLUMNAS` |
| Plantilla de reporte | Diseño visual PDF del reporte; puede tener override por tenant. | `dict:bia.reportTemplate` | Archivo `.repx` en `Reportes`/`Reportes_Empresa`, `REPORTES` (reemplazo por equipo) |
| Programación | Ejecución periódica o por evento con entrega a destinatarios. | `dict:bia.schedule` | — (no existe; tareas del Agente sólo para procesos) |
| Fecha de corte | Instante al que se calculan saldos o estados (fecha efectiva). | `dict:bia.cutoffDate` | "a una fecha" / "Deuda a la fecha" |
| Universo | Conjunto de registros incluidos (tenant, filtros, estados). | `dict:bia.universe` | Filtros del informe |
| Granularidad | Nivel de cada fila: persona, cuenta, contrato, factura, línea, pago, imputación, movimiento, período. | `dict:bia.grain` | — |
| Indicador (KPI) | Métrica con definición certificada. | `dict:bia.indicator` | Variable del tablero (`TABLERO.COD_VAR`) |
| Snapshot de indicador | Valor calculado y congelado para un período/fecha. | `dict:bia.indicatorSnapshot` | `TENDTAB` |
| Umbral / óptimo / objetivo | Valores de referencia del semáforo. | `dict:bia.threshold` | `VAL_UMB`, `VAL_OPT`, `OBJETIVO` |
| Tablero | Composición de widgets de indicadores para un rol. | `dict:bia.dashboard` | Tablero de Control (`GRUPTAB`, `GRUTAB`) |
| Alerta de indicador | Condición sobre un indicador que notifica a responsables. | `dict:bia.kpiAlert` | Estado del tablero (`ESTATAB`) |
| Sala BI | Pantalla analítica por dominio con zona A KPIs, zona B contexto, zona C IA (CNX §4.5). | `dict:bia.room` | — |
| Dataset semántico | Conjunto certificado de hechos y dimensiones con significado documentado. | `dict:bia.dataset` | `TABLAS_POWERBI` |
| Almacén analítico | Réplica de lectura con proyecciones `bi_*` aisladas por tenant. | `dict:bia.analyticStore` | Base SQL leída por Power BI |
| Reporte personalizado | Reporte armado por el tenant con el generador. | `dict:bia.customReport` | Informes/Procesos Personalizados (`clsInformesPersonalizados`) |
| Cliente de API | Aplicación autorizada por un tenant, con responsable, finalidad, scopes y credenciales (BASE §33). | `dict:bia.apiClient` | `WS_KEYS` |
| Credencial | Client secret o API key de un cliente; se guarda sólo su hash. | `dict:bia.apiCredential` | `WS_KEYS.API_KEY` (texto plano) |
| Scope | Alcance de lectura/escritura sobre un recurso de la API. | `dict:bia.scope` | — |
| Webhook saliente | Notificación firmada a una URL del tercero ante un evento público. | `dict:bia.webhook` | Webhook de Integra (entrante) |
| Benchmark | Comparación anónima de ratios con cooperativas similares. | `dict:bia.benchmark` | — |
| Datos abiertos | Conjuntos agregados publicados sin login con licencia. | `dict:bia.openData` | — |
| Facturado / Cobrado / Acreditado / Saldo | Términos semánticos con definición única (§15.1). | `dict:bia.sem.billed` / `.collected` / `.credited` / `.balance` | Facturado, Cobrado, Depositado, Deuda |

## 4. Actores, permisos y alcance

### 4.1 Capabilities del módulo

| Capability | Descripción |
|---|---|
| `bia.reportes.ver` | Ver el catálogo filtrado por lo que el usuario puede ejecutar. |
| `bia.reportes.ejecutar` | Ejecutar reportes (además de la capability propia del reporte). |
| `bia.reportes.exportar` | Exportar a XLSX/CSV/PDF/archivo (además de `<mod>.<recurso>.exportar` del reporte). |
| `bia.reportes.programar` | Crear y administrar sus programaciones. |
| `bia.reportes.programarExternos` | Agregar destinatarios externos al tenant (PA-BIA-04). Antes `bia.reportes.programar_externos`. |
| `bia.reportes.configurar` | Overrides de plantilla, layouts, presets compartidos, habilitar/ocultar reportes del catálogo en el tenant. |
| `bia.presets.compartir` | Publicar presets y vistas guardadas a roles. |
| `bia.exportaciones.ver` | Ver sus exportaciones. |
| `bia.exportaciones.administrar` | Ver/cancelar exportaciones y programaciones de todo el tenant (sin abrir el contenido si no tiene la capability del reporte). |
| `bia.disenador.usar` | Usar el generador de reportes personalizados (borradores propios). |
| `bia.disenador.publicar` | Aprobar y publicar reportes personalizados a otros roles. |
| `bia.tableros.ver` | Ver tableros asignados a sus roles. |
| `bia.tableros.disenar` | Crear/editar tableros del tenant. |
| `bia.indicadores.ver` | Ver el catálogo de indicadores y sus definiciones. |
| `bia.cubos.certificar` (antes `bia.indicadores.certificar`) | Certificar o versionar indicadores del tenant. |
| `bia.alertas.configurar` | Crear reglas de alerta. |
| `bia.alertas.gestionar` | Reconocer y resolver alertas dirigidas a él o a su área. |
| `bia.bi.ver` | Acceder a salas BI (O11). |
| `bia.ia.consultar` (antes `bia.ia.preguntar`) | Usar la IA analítica. |
| `bia.ia.configurar` | Habilitar IA, preguntas de catálogo, límites. |
| `bia.datasets.ver` | Ver datasets semánticos y su diccionario. |
| `bia.datasets.configurar` | Habilitar datasets para builder/API/BI. |
| `bia.datosSensibles.ver` | Ver datos personales sin enmascarar en reportes y exportaciones. Antes `bia.datos_sensibles.ver`. |
| `bia.auditoria.ver` | Ver registros de acceso y exportación de reportes. |
| `bia.api.clientes.ver` | Ver clientes de API del tenant. |
| `bia.api.clientes.crear` | Registrar clientes (quedan pendientes). |
| `bia.api.clientes.aprobar` | Aprobar, suspender o reactivar clientes. |
| `bia.api.credenciales.rotar` | Emitir, rotar y revocar credenciales. |
| `bia.api.uso.ver` | Ver consumo, errores y cuotas. |
| `bia.api.webhooks.configurar` | Administrar suscripciones de webhooks desde admin. |
| `bia.datosAbiertos.publicar` | Publicar/retirar datasets abiertos. Antes `bia.datos_abiertos.publicar`. |
| `bia.benchmark.ver` | Ver la posición del tenant en el benchmark. |
| `bia.benchmark.configurar` | Adherir o retirar al tenant del benchmark. |
| `pla.bia.tablero.ver` | Tablero global de plataforma (tenant `PLATFORM`). |
| `pla.bia.catalogo.administrar` | Publicar versiones de reportes de sistema y plantillas compartidas. |
| `pla.bia.api.monitorear` | Uso de API y webhooks de todos los tenants (sólo métricas). |
| `pla.bia.benchmark.administrar` | Parámetros del benchmark y segmentos. |

Cada reporte declara además **sus** capabilities del módulo dueño (p. ej. `cob.deuda.ver` para REP-COB-001 y `cob.deuda.exportar` para exportarlo). Permiso efectivo de ejecución = `bia.reportes.ejecutar` ∧ capabilities del reporte ∧ licencia/activación del módulo ∧ perfil de pantallas; el **alcance** filtra filas.

### 4.2 Roles y alcance

| Rol | Capabilities BIA típicas | Alcance de datos |
|---|---|---|
| Operador de plataforma | `pla.bia.*` | Agregados de todos los tenants; sin detalle de un tenant salvo acceso de soporte temporal (AGR-034). |
| Administrador del tenant | Todas las `bia.*` salvo `pla.*` | Tenant completo. |
| Gerente / Consejo | `bia.reportes.ver/ejecutar/exportar/programar`, `bia.tableros.ver`, `bia.bi.ver`, `bia.ia.consultar` (antes `bia.ia.preguntar`), `bia.benchmark.ver` | Tenant (lectura); datos sensibles enmascarados salvo habilitación. |
| Analista / Responsable de datos | Gerente + `bia.disenador.*`, `bia.tableros.disenar`, `bia.cubos.certificar` (antes `bia.indicadores.certificar`), `bia.datasets.*`, `bia.api.*` | Tenant. |
| Responsable de área (facturación, cobranzas, mora, técnica, atención, compras, tesorería, contabilidad, RRHH, institucional) | `bia.reportes.*` (sin externos), `bia.tableros.ver`, `bia.alertas.*`, `bia.bi.ver` | Su módulo y su alcance (sucursales/zonas/servicios/cuadrillas). |
| Operador (cajero, técnico, atención) | `bia.reportes.ver/ejecutar`, `bia.exportaciones.ver` | Propios o su caja/cuadrilla/cola. |
| Síndico / Auditor | `bia.reportes.ver/ejecutar/exportar`, `bia.auditoria.ver`, `bia.tableros.ver` | Tenant, sólo lectura. |
| Contador | Reportes CON/FIS/TES, `bia.datosSensibles.ver` para fiscales | Tenant. |
| Socio (PWA) | Ninguna BIA; sus consultas son de M19 | Sus cuentas. |
| Cliente de API (sistema) | Scopes `/api/v1/ext` | Tenant del cliente ∩ scopes ∩ restricción opcional de sucursales/servicios del cliente. |

### 4.3 Scopes de la API externa

| Scope | Recursos | Notas | Capability mapeada (T02 §4.4.3) |
|---|---|---|---|
| `persons:read` | personas, titulares, asociados (datos mínimos) | Sin documento/teléfono/email completos salvo `pii:read`. | `per.personas.ver` |
| `accounts:read` | cuentas, inmuebles, domicilios de servicio | | `per.cuentas.ver` |
| `contracts:read` | servicios contratados/conexiones, catálogo de servicios, planes, categorías | | `cat.contratos.ver` |
| `consumption:read` | medidores (ficha pública), lecturas validadas, consumos aprobados | | `med.consumos.ver` |
| `billing:read` | comprobantes, líneas, PDF firmado | | `fac.comprobantes.ver` |
| `collections:read` | pagos confirmados, imputaciones, canales de pago, deuda por cuenta | | `cob.cuentaCorriente.ver` |
| `ledger:read` | movimientos de cuenta corriente, saldos, aging | | `cob.cuentaCorriente.ver` (T02 §4.4.3; antes `con.asientos.ver` según T02 [VERIFICAR con T02]) |
| `arrears:read` | casos de mora, convenios, cortes/reconexiones | | `mor.deudas.ver` |
| `crm:read` | solicitudes, reclamos, tickets (sin notas internas ni adjuntos) | BASE §59. | `crm.casos.ver` |
| `field:read` | órdenes de trabajo, visitas, turnos | | `tec.ordenes.ver` |
| `erp.catalog:read` | productos, stock por depósito, proveedores (datos públicos) | | `stk.articulos.ver` (API-BIA-107 además `cmp.proveedores.ver`; T02 §4.4.3; antes "— (T02 no lo lista)") |
| `erp.finance:read` | tesorería y bancos agregados, compras | Requiere aprobación reforzada. | `tes.posicion.ver` (API-BIA-109 además `cmp.ordenes.ver`; T02 §4.4.3; antes "— (T02 no lo lista)") |
| `accounting:read` | plan de cuentas, asientos, sumas y saldos | | `con.asientos.ver` |
| `institutional:read` | asociados, capital, asambleas (sin votos individuales) | | `ins.asociados.ver` |
| `payroll:read` | agregados de personal (nunca recibos individuales) | `A validar (PA-BIA-14)`. | `sue.costos.ver` |
| `metrics:read` | catálogo de indicadores y valores | | `bia.indicadores.ver` |
| `datasets:read` | datasets semánticos y sus filas | | `bia.datasets.ver` |
| `exports:write` | crear exportaciones masivas | | `bia.exportaciones.crear` |
| `webhooks:manage` | administrar suscripciones propias | | `int.webhooks.gestionar` |
| `pii:read` | habilita campos personales completos en los recursos ya permitidos | Requiere finalidad registrada y aprobación (PA-BIA-14). | — (modificador de campos, no capability) |
| `requests:write` | crear solicitudes (alta de persona/cuenta, reclamo) que procesa CRM | `A validar (PA-BIA-03)`. | `crm.casos.crear` |

## 5. Requisitos funcionales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-BIA-001 | Catálogo único de reportes (`reportDefinitions`) con código REP, nombre por clave de diccionario, módulo dueño, propósito, granularidad, parámetros, columnas, capabilities, sensibilidad, salidas y versión. | DFA M28; CAT `INFO_SYS`; BASE §30 | Núcleo | O1 | Adoptado | El catálogo lista sólo reportes ejecutables por el usuario; cada uno muestra su ficha. |
| RF-BIA-002 | Cada módulo registra sus reportes mediante un provider con esquema Zod de parámetros y contrato de columnas; BIA no lee colecciones de otros módulos. | DEC-003; ARQ-01 | Núcleo | O1 | Adoptado | Un test de arquitectura falla si `bia` importa modelos de otro módulo. |
| RF-BIA-003 | Ejecución con validación de parámetros, defaults (incl. relativos: hoy, mes anterior, ciclo actual) y mensajes de error por campo. | RN-10 §16.5 | Núcleo | O1 | Adoptado | Parámetro inválido → 422 RFC 9457 con `errors[]` por campo. |
| RF-BIA-004 | Aplicación automática del alcance del usuario (entidades jurídicas, sucursales, zonas, servicios, cuadrillas, propios) en el provider; totales calculados sólo sobre filas visibles. La dimensión **entidad jurídica** (`scope.legalEntities[]` de T02 RF-IAM-065; DEC-096) se aplica a las filas que llevan `legalEntityId` (documentos económicos, membresías y capital de M17, centros de costo de M15, liquidaciones de M16, registros de auditoría); las filas de recursos compartidos del tenant sin entidad (personas y cuentas de M01) no se filtran por ella. *Reemplazado (10-11-2026, DEC-096): "(sucursales, zonas, servicios, cuadrillas, propios)".* | CNX §2.4; BASE §34 n.º 19; DEC-096 | Núcleo | O1 | Adoptado | Usuario con alcance zona Norte no ve filas ni totales de zona Sur. Un usuario con alcance `[MUTUAL]` no ve filas ni totales de membresías, asientos ni auditoría de COOP. |
| RF-BIA-005 | Modo síncrono cuando la estimación de costo ≤ `PRM-BIA-003` filas y `PRM-BIA-004` segundos; en otro caso, ejecución asíncrona en job `bia:ejecutar-reporte` con progreso. | ARQ-03; RN-07 §1.11 (timeout 120 s) | Núcleo | O1 | Adoptado | Un reporte de 300.000 filas no bloquea el request; el usuario ve progreso y recibe aviso. |
| RF-BIA-006 | Resultado paginado en `DataTable` con orden, filtros de columna, columnas configurables y totales/subtotales por agrupación. | DFA M28; CNX §4.6 | Núcleo | O1 | Adoptado | Totales coinciden con la suma exacta Decimal de las filas del universo. |
| RF-BIA-007 | Encabezado obligatorio de toda salida: tenant, reporte y versión, parámetros, universo, fecha de corte, tipo de fecha usado, granularidad, fuente (operativa/analítica) y frescura, usuario y fecha de generación. | AGR-022; BASE §30 | Núcleo | O1 | Adoptado | XLSX/CSV/PDF incluyen hoja o bloque "Metadatos". |
| RF-BIA-008 | Llegada al detalle (drill-down) desde cada total o indicador a los registros que lo componen y al documento de origen. | BASE §30, §75 | Núcleo | O1 | Adoptado | CU-30: desde el saldo ARS 0 se llega a la factura y a sus dos imputaciones. |
| RF-BIA-009 | Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. | INV `frmInformes_Preview` | Estándar | O1 | Adoptado | Cancelar deja `reportRuns.status=cancelled` y libera el worker. |
| RF-BIA-010 | Presets con nombre (personales o compartidos a roles) por reporte. | CAT `ESQUEMAS_INFORMES_COBRANZAS`; INV `clsInformes_Caja.GuardarEsquema` | Estándar | O2 | Adoptado | Un preset compartido no amplía el alcance del que lo usa. |
| RF-BIA-011 | Favoritos, recientes y búsqueda por texto en el catálogo; agrupación por cluster del mapa del sitio. | CNX §4.2 | Estándar | O1 | Adoptado | Búsqueda "deuda" devuelve REP-COB-002, REP-MOR-001 y demás reportes con "deuda" en nombre o ayuda. |
| RF-BIA-012 | Ayuda contextual por reporte (`ScreenHelp`) con definición, fórmula y ejemplo. | CNX §4.2; AGR-022 | Estándar | O1 | Adoptado | Cada reporte del catálogo tiene ayuda no vacía. |
| RF-BIA-013 | Títulos, columnas y valores enumerados por clave de diccionario del tenant; los nombres técnicos de columnas exportadas a CSV/API no cambian. | BASE §65, §34 n.º 54 | Núcleo | O1 | Adoptado | TEN-001 "Socio" y TEN-002 "Asociado" generan encabezados distintos y mismo `fieldKey`. |
| RF-BIA-014 | Enmascarado de datos personales (documento, CUIT de personas humanas, teléfono, email, CBU, domicilio exacto) salvo `bia.datosSensibles.ver`. | BASE §97.1, §59 | Núcleo | O1 | Adoptado | Sin la capability, DNI se ve `**.***.123`. |
| RF-BIA-015 | Identificación explícita de datos simulados (escenarios, planes alternativos) con marca visible y columna `scenarioId`; prohibido mezclarlos con reales sin marca. | BASE §55, AGR-022 | Núcleo | O5 | Adoptado | Un reporte de un escenario lleva marca de agua "SIMULACIÓN". |
| RF-BIA-016 | Versionado de definiciones: cambios en columnas/fórmula crean versión nueva; ejecuciones guardan la versión usada. | AGR-001 | Estándar | O1 | Adoptado | Re-ejecutar una corrida vieja indica versión original y vigente. |
| RF-BIA-017 | Plantillas PDF por reporte con override por tenant (logo, encabezado, pie, orden de columnas) sin alterar datos. | CAT `REPORTES`; DFA M28 carpetas `Reportes_Empresa` | Estándar | O2 | Adoptado | Override de TEN-001 no afecta a TEN-002. |
| RF-BIA-018 | Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. | DFA M28 | Estándar | O2 | Adoptado | Reporte oculto no aparece en catálogo ni API. |
| RF-BIA-019 | Selección para acción: un reporte puede entregar al módulo dueño un `selectionToken` con IDs seleccionados para que el usuario inicie allí una acción (notificar, generar OT). | INV `frmInformes_Preview.MarcarRegistros`; BASE §30 | Estándar | O2 | Adoptado | BIA nunca ejecuta la acción; el módulo exige su propia capability. |
| RF-BIA-020 | Mapa: reportes con geolocalización ofrecen vista mapa y exportación KML/GeoJSON. | INV `clsInformes_Tecnica.GetGoogle_Earth`, `clsCirculares.Get_KmlMap`; FIC 16 | Estándar | O3 | Adoptado | REP-TEC-001 exporta KML con estilos por estado. |
| RF-BIA-021 | Exportación de cualquier `DataTable` del sistema a XLSX, CSV y PDF e impresión, con columnas visibles o todas. | DFA M28 [P] | Núcleo | O1 | Adoptado | Toda grilla admin muestra botón Exportar si el usuario tiene `<mod>.<recurso>.exportar`. |
| RF-BIA-022 | Exportación asíncrona en worker BullMQ (`bia:generar-exportacion`) cuando supera `PRM-BIA-005` filas; archivo en almacenamiento privado; descarga por URL firmada de `PRM-BIA-007` minutos tras revalidar permiso. | DEC-001; CNX §2.6, §10 V-01 | Núcleo | O1 | Adoptado | La URL vencida devuelve 403; un usuario sin permiso no puede descargar aunque tenga el enlace. |
| RF-BIA-023 | Notificación de exportación lista (in-app y email con enlace, nunca adjunto con datos personales). | CNX §2.7 | Núcleo | O1 | Adoptado | El email no contiene filas. |
| RF-BIA-024 | Expiración y purga automática de archivos (`PRM-BIA-008`); el registro de la exportación se conserva. | BASE §97.8 Conservación | Núcleo | O1 | A validar (PA-BIA-09) | A los 7 días el archivo deja de existir y la fila indica `expired`. |
| RF-BIA-025 | Límites por formato: XLSX ≤ 1.048.575 filas por hoja (divide en hojas o sugiere CSV), PDF ≤ `PRM-BIA-006` filas, CSV sin límite práctico (comprimido ZIP sobre `PRM-BIA-009` MB). | — | Núcleo | O1 | Adoptado | Un export de 2 M filas a XLSX produce 2 hojas o propone CSV. |
| RF-BIA-026 | CSV UTF-8 (BOM opcional), separador configurable (`;` por defecto, como ProCoop), decimales con punto en CSV técnico o coma en CSV "regional", fechas `dd-mm-yyyy` en regional e ISO 8601 en técnico. | RN-07 §1.11 (CSV `;`) | Núcleo | O1 | Adoptado | El usuario elige "Regional (Excel AR)" o "Técnico". |
| RF-BIA-027 | Importes exportados sin pérdida (Decimal como número con escala fija en XLSX, texto decimal en CSV técnico). | DEC convenciones dinero | Núcleo | O1 | Adoptado | ARS 1234567,89 conserva centavos. |
| RF-BIA-028 | Protección contra inyección de fórmulas en CSV/XLSX (celdas que empiezan con `=`, `+`, `-`, `@`, tab o CR se prefijan con `'`). | T08 | Núcleo | O1 | Adoptado | Un nombre "=HYPERLINK(...)" se exporta como texto. |
| RF-BIA-029 | PDF con pie de página "Generado por <usuario> el <fecha>" y marca de agua cuando contiene datos personales. | BASE §97.1 | Estándar | O1 | Adoptado | Todo PDF exportado muestra en el pie usuario y fecha de generación; si incluye un campo marcado `pii` lleva marca de agua. |
| RF-BIA-030 | Layouts de archivo plano configurables por tenant (columnas, orden, tipo, largo, precisión, formato, relleno izquierdo, obligatorio, valor fijo, valor para vacío, separador o ancho fijo, encabezado/pie, nombre de archivo con variables). | CAT `EXPORTADOR`, `EXPORTADOR_COLUMNAS`; INV `frmExportacionArchivos`, `TiposArchivosExportacion` | Estándar | O2 | Adoptado | Un layout de 120 posiciones produce líneas de exactamente 120 caracteres. |
| RF-BIA-031 | Compresión ZIP de exportaciones múltiples (varios archivos de una misma corrida). | INV `clsCirculares.GenerarExcelyComprimido`, `clsExportacion.ComprimirArchivo` | Estándar | O2 | Adoptado | Una corrida con más de un archivo exportado se descarga como un único ZIP que contiene todos los archivos. |
| RF-BIA-032 | Checksum SHA-256 y tamaño de cada archivo exportado. | AGR-023 | Estándar | O1 | Adoptado | Cada exportación registra tamaño y SHA-256; recalcular el hash del archivo descargado da el mismo valor. |
| RF-BIA-033 | Cuotas de ejecución y exportación concurrente por usuario (`PRM-BIA-010`) y por tenant (`PRM-BIA-011`) con cola justa entre tenants. | BASE §97.8 | Núcleo | O1 | Adoptado | Un tenant con 50 exportaciones encoladas no demora las de otro. |
| RF-BIA-034 | Auditoría de ejecución, exportación y descarga de reportes con datos personales (`reportAccessLogs`). Cada registro guarda la entidad jurídica del reporte ejecutado (`legalEntityId`, la del filtro de entidad o vacía si abarca varias o recursos compartidos, con las entidades en `filterSummary`; mismo criterio que `auditReads` de T02; DEC-096) y la consulta se filtra por entidad (RF-BIA-104). | CAT `INFO_AUD`; BASE §54; DEC-096 | Estándar | O1 | A validar (PA-BIA-12) | REP-BIA-002 muestra quién exportó el padrón y cuándo. La exportación del padrón de MUTUAL queda con `legalEntityId = MUTUAL` y no aparece al filtrar COOP. |
| RF-BIA-104 | **Filtro por entidad jurídica** (DEC-096; completa DEC-064) con la etiqueta `dict:org.entidadJuridica`, visible solo si el tenant tiene más de una entidad (PRM-CFG-039 = `true`) y limitado a las entidades del alcance del usuario (RF-BIA-004): (1) **informes de auditoría**: PAN-BIA-19, REP-BIA-002 y los reportes REP-IAM-001 a REP-IAM-016 que lee T10 de T02 (`auditLogs.legalEntityId`, `auditReads.legalEntityId`, RF-IAM-130), con la opción "sin entidad (recursos compartidos)"; (2) **vistas que listan asociados**: REP-PER-001 (condición de asociado por entidad), REP-INS-001 a REP-INS-020, KPI-INS-01, KPI-INS-02, KPI-INS-07, `bi_fact_member` y API-BIA-113 `/members` (parámetro `legalEntityCode`), sobre `associateMemberships.legalEntityId` (M17 §7.1); una persona socia de dos entidades aparece una vez por membresía; (3) **vistas que listan centros de costo**: `bi_dim_costCenter`, `bi_fact_journalLine`, `bi_fact_payroll` y los REP-CON que agrupan por centro, que muestran los centros cuya entidad dueña o lista compartida incluye la entidad filtrada (`costCenters.legalEntityId` y `sharedWithLegalEntityIds`, M15 RN-CON-127) y acumulan solo lo imputado en esa entidad. El filtro forma parte de los parámetros de la ejecución, del encabezado de la salida (RF-BIA-007), de los presets (RF-BIA-010) y de los filtros globales del tablero (RF-BIA-055). | DEC-096; T02 RF-IAM-065, RF-IAM-130; M15 RF-CON-081, RN-CON-127; M17 RF-INS-001 | Núcleo | O1 (auditoría) / O5 (centros de costo) / O10 (asociados) | Adoptado | REP-INS-003 filtrado por MUTUAL lista solo afiliados de la mutual aunque la persona también sea socia de COOP; el centro compartido CC-ADM aparece al filtrar COOP y al filtrar MUTUAL con los importes de cada entidad; PAN-BIA-19 filtrado por COOP no muestra exportaciones de MUTUAL; con una sola entidad el filtro no se muestra. |
| RF-BIA-035 | Programación de reportes: frecuencia diaria, semanal (días), mensual (día n o último/n-ésimo hábil), por cron avanzado, o por evento (cierre de lote, cierre de caja, cierre de período). | MER-013; BASE §30 | Estándar | O2 | Adoptado | Un programado "mensual día hábil 1" corre el 2/12/2026 si el 1 es feriado del calendario del tenant. |
| RF-BIA-036 | Destinatarios: usuarios del tenant (verifica permisos de cada uno) y emails externos (PA-BIA-04). | MER-013 | Estándar | O2 | A validar (PA-BIA-04) | Un destinatario sin permiso no recibe el enlace. |
| RF-BIA-037 | Parámetros relativos en programados (`today`, `yesterday`, `previousMonth`, `currentCycle`, `lastClosedPeriod`). | — | Estándar | O2 | Adoptado | Un programado con `previousMonth` ejecutado el 05-03 usa el período 02 sin editar la programación. |
| RF-BIA-038 | La programación corre con los permisos **actuales** del propietario; si los perdió o fue desactivado se suspende y se avisa al administrador. | BASE §34 n.º 20 | Núcleo | O2 | Adoptado | Revocar rol suspende sus programaciones en la siguiente corrida. |
| RF-BIA-039 | Suspensión automática tras `PRM-BIA-013` fallos consecutivos e historial de entregas. | AGR-021 | Estándar | O2 | Adoptado | Tras `PRM-BIA-013` fallos consecutivos la programación pasa a suspendida, se avisa al propietario y el historial muestra cada entrega fallida. |
| RF-BIA-040 | Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. | RN-10 §16.4 (`ENTIDACOU`) | Estándar | O1 | Adoptado | Una vista compartida no muestra columnas sensibles a quien no las puede ver. |
| RF-BIA-041 | Generador de reportes del tenant sobre datasets semánticos: elegir dataset, campos, filtros, agrupaciones, métricas, orden, formato condicional, totales y gráfico. | MER-013; DFA M28 "Editor de Reportes" | Estándar | O11 | Adoptado | Un analista arma "Deuda por barrio" sin intervención del proveedor. |
| RF-BIA-042 | Prohibido SQL libre, procedimientos almacenados o selección de tablas internas en reportes personalizados. | RN-10 §16.5, §16.6; BASE §59 | Núcleo | O11 | Adoptado | No existe endpoint que reciba consultas textuales. |
| RF-BIA-043 | Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de `bia.disenador.publicar` y auditoría. | MER-012 | Estándar | O11 | A validar (PA-BIA-13) | Un reporte personalizado no se publica sin aprobación de un usuario con `bia.disenador.publicar` distinto del autor; cada cambio de estado queda auditado. |
| RF-BIA-044 | Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). | BASE §66 (copia entre tenants) | Extensión | O11 | Adoptado | Copiar una plantilla de la galería crea un reporte en borrador del tenant sin datos de otro tenant. |
| RF-BIA-045 | Límite de costo de consulta del generador (`PRM-BIA-020` documentos escaneados) y ejecución siempre sobre el almacén analítico. | BASE §97.8 | Núcleo | O11 | Adoptado | Una consulta del generador que supera `PRM-BIA-020` documentos escaneados se rechaza antes de ejecutar; ninguna consulta del generador corre sobre la base operativa. |
| RF-BIA-046 | Catálogo de indicadores con definición exacta: fórmula, numerador/denominador, nivel, universo y estados incluidos, tipo de fecha y corte, frecuencia de refresco, dimensiones, unidad, decimales, sentido (mayor es mejor), permiso de detalle, dueño. | AGR-022; BASE §30, §54 | Núcleo | O1 | Adoptado | Cada indicador de §15.6 está cargado con todos los atributos. |
| RF-BIA-047 | Certificación y versionado de indicadores; los snapshots guardan la versión. | CNX §4.5 | Núcleo | O1 | Adoptado | Un snapshot de indicador guarda la versión vigente; cambiar la fórmula crea una versión nueva sin alterar los snapshots anteriores. |
| RF-BIA-048 | Tablero de plataforma (GOB-001): tenants y estados, errores de procesos e integraciones, trabajos pendientes, disponibilidad, configuraciones incompletas, uso de API; sólo agregados. | BASE §54 | Núcleo | O1 | Informado | El operador no ve nombres de socios. |
| RF-BIA-049 | Tablero del tenant (GOB-002) y tableros por rol (§15.7), que crecen con cada ola. | BASE §54; DFA M28 | Núcleo | O2 | Informado | Al habilitar M05 aparecen indicadores de facturación. |
| RF-BIA-050 | Tablero de responsables de área: casos sin asignar, turnos fallidos, tareas vencidas, conciliaciones pendientes, reglas sin aprobar. | BASE §54 | Núcleo | O2 | Informado | El tablero de un responsable muestra solo los pendientes de su área y alcance, con enlace al registro en su módulo. |
| RF-BIA-051 | Widgets: KPI con variación y semáforo, serie temporal, barras/ranking, torta (máx 6 porciones), tabla, mapa de calor por zona, embudo; gráficos SVG/CSS propios. | CNX §4.5; CAT `GRAFTAB`, `TIP_GRA` | Estándar | O2 | Adoptado | Cada tipo de widget renderiza con datos ficticios; una torta con más de 6 categorías agrupa el resto en "Otros". |
| RF-BIA-052 | "Vacío honesto": sin datos se muestra "sin datos para el universo elegido" y no cero. | CNX §4.5 | Núcleo | O1 | Adoptado | Un universo sin datos muestra el mensaje de vacío y no el valor 0. |
| RF-BIA-053 | Comparación contra período anterior, mismo período del año anterior, objetivo, óptimo y umbral, con estado (ok/advertencia/crítico). | CAT `TABLERO` (`VAL_OPT`, `VAL_UMB`, `OBJETIVO`), `ESTATAB` | Estándar | O2 | Adoptado | Un KPI con objetivo y umbral muestra la variación contra el período comparado y el estado ok, advertencia o crítico según el umbral. |
| RF-BIA-054 | Tendencias con snapshots diarios y de cierre mensual. | CAT `TENDTAB`; INV `clsTablero.Get_Tend_*` | Estándar | O2 | Adoptado | La tendencia de un indicador muestra un punto por día desde los snapshots diarios y el valor de cierre de cada mes. |
| RF-BIA-055 | Filtros globales del tablero (período, entidad jurídica (DEC-096, RF-BIA-104; solo con más de una entidad), servicio, sucursal, zona, categoría) respetando alcance. *Reemplazado (10-11-2026, DEC-096): "(período, servicio, sucursal, zona, categoría)".* | CNX §4.5 `BiFilterBar` | Estándar | O2 | Adoptado | Un filtro global de sucursal cambia todos los widgets del tablero y nunca muestra datos fuera del alcance del usuario. |
| RF-BIA-056 | Personalización por usuario (fijar, ocultar, reordenar widgets) sin alterar definiciones. | CNX §4.2 | Extensión | O2 | Adoptado | Ocultar o reordenar widgets se conserva para el usuario y no cambia el tablero de otro usuario ni su definición. |
| RF-BIA-057 | Tablero móvil en PWA empleado (cards KPI). | Maestra §8 | Estándar | O2 | Adoptado | La PWA del empleado muestra los KPI del tablero de su rol como cards con los mismos valores que el admin. |
| RF-BIA-058 | Frescura visible (hora del dato) en cada widget. | AGR-022 | Núcleo | O1 | Adoptado | Cada widget muestra la fecha y hora del dato; si supera la frescura objetivo se marca como desactualizado. |
| RF-BIA-059 | Reglas de alerta sobre indicadores: condición, severidad, destinatarios (usuarios/roles), canales, deduplicación, estado (abierta/reconocida/resuelta/silenciada), escalamiento, vínculo al objeto. | BASE §54 GOB-003 | Núcleo | O2 | Informado | Una alerta repetida no genera dos notificaciones dentro de la ventana de deduplicación. |
| RF-BIA-060 | Almacén analítico aislado por tenant, alimentado por eventos outbox y change streams, con proyecciones `bi_*` (hechos y dimensiones). | BASE §58 "datos analíticos"; FIC 18.1 | Estándar | O11 | A validar (PA-BIA-01) | Una consulta pesada de BI no aumenta la latencia de facturación (prueba de carga). |
| RF-BIA-061 | Refresco incremental (objetivo ≤ `PRM-BIA-030` minutos) y snapshots diarios y de cierre. | AGR-022 | Estándar | O11 | Adoptado | Un cambio en la fuente aparece en la proyección en ≤ `PRM-BIA-030` minutos y los snapshots diarios y de cierre se generan sin intervención. |
| RF-BIA-062 | Reconstrucción completa de una proyección por tenant desde la fuente (job `bia:reconstruir-proyeccion`). | AGR-019 | Estándar | O11 | Adoptado | Reconstruir la proyección de un tenant reproduce los mismos totales que la fuente y no afecta a otros tenants. |
| RF-BIA-063 | Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. | AGR-022 criterio | Núcleo | O11 | Adoptado | REP-BIA-007 muestra 0 diferencias en CU-BIA-08. |
| RF-BIA-064 | Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". | AGR-010 | Estándar | O11 | Adoptado | Un reporte "como era" a una fecha pasada usa la categoría vigente en esa fecha; "como es" usa la actual. |
| RF-BIA-065 | Salas BI con contrato `summary`, `items`, `export.xlsx`, `analyze-auto`, `ask`, `schedule` para Facturación, Cobranza, Mora, Consumos, Reclamos, Técnica, Compras, Tesorería, Contabilidad, Personal, Institucional y Comunidad. | CNX §4.5, §7.5 | Estándar | O11 | Adoptado | Cada sala responde los seis puntos del contrato con datos ficticios del tenant y respeta el alcance del usuario. |
| RF-BIA-066 | IA analítica: preguntas en lenguaje natural (de catálogo o libres) traducidas a consulta semántica; respuesta con cifras, KPI/dataset citado, universo y corte. | CNX §4.5 zona C | Estándar | O11 | A validar (PA-BIA-06) | Toda cifra de la respuesta coincide con la consulta registrada. |
| RF-BIA-067 | La IA aplica permisos y alcance del usuario antes de consultar; nunca envía datos personales al proveedor; si no puede responder lo dice. | ARQ-08; CNX §4.5 | Núcleo | O11 | Adoptado | Pregunta sobre otra zona fuera de alcance → "no tenés acceso a ese universo". |
| RF-BIA-068 | Análisis automático cacheado por sala (recalcula cada `PRM-BIA-034` horas o al cambiar el universo); capa A funciona sin IA. | CNX §7.5 | Extensión | O11 | Adoptado | El análisis automático se recalcula solo al vencer `PRM-BIA-034` horas o al cambiar el universo; con IA apagada la capa A sigue disponible. |
| RF-BIA-069 | Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. | — (propuesta) | Extensión | O11 | A validar (PA-BIA-05) | Con 4 participantes en un segmento no se muestra el valor. |
| RF-BIA-070 | Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. | BASE §59; §31 | Núcleo | O11 | Informado | CU-API-01. |
| RF-BIA-071 | Autenticación OAuth 2.0 client credentials (token de acceso de `PRM-BIA-040` minutos) y API key para herramientas de BI de sólo lectura. | BASE §59; FIC 14.3 | Núcleo | O11 | A validar (PA-BIA-02) | Un cliente obtiene un token con client credentials que vence a los `PRM-BIA-040` minutos; una API key de BI no puede invocar endpoints de escritura. |
| RF-BIA-072 | Secretos mostrados una sola vez, guardados con hash, con prefijo visible; rotación con solapamiento; expiración; revocación efectiva ≤ `PRM-BIA-043` segundos. | BASE §59, §34 n.º 46 | Núcleo | O11 | Informado | Una credencial revocada falla en ≤ 60 s. |
| RF-BIA-073 | Scopes por recurso y acción; restricción por campo (minimización); scope `pii:read` separado. | BASE §59 | Núcleo | O11 | A validar (PA-BIA-14) | Sin `pii:read`, `/persons` devuelve documento enmascarado. |
| RF-BIA-074 | Rate limit por cliente y por tenant (token bucket), cabeceras `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, 429 con `Retry-After`; cuotas diarias por plan. | BASE §59; CNX §10 V-07 | Núcleo | O11 | A validar (PA-BIA-08) | Superar el límite devuelve 429 con `Retry-After` y las cabeceras `RateLimit-*`; agotar la cuota diaria del plan bloquea hasta el día siguiente. |
| RF-BIA-075 | Pool de ejecución separado para la API ext y BI (workers/réplica de lectura) para no afectar facturación ni atención. | BASE §59, §97.8 | Núcleo | O11 | Informado | Prueba de carga ext a 200 rps no degrada p95 de `/api/admin`. |
| RF-BIA-076 | Versionado por URI (`/api/v1/ext`), cambios aditivos compatibles, deprecación con cabeceras `Deprecation` y `Sunset` y aviso ≥ `PRM-BIA-045` meses. | AGR-021 | Núcleo | O11 | Adoptado | Un recurso deprecado responde con `Deprecation` y `Sunset`; un cambio incompatible no se publica en `v1`. |
| RF-BIA-077 | OpenAPI 3.1 generado desde los esquemas Zod, publicado por tenant (sólo los recursos licenciados) y portal de documentación con ejemplos ficticios. | FIC 14.3; BASE §59 | Núcleo | O11 | Adoptado | `GET /api/v1/ext/openapi.json` valida con un linter OpenAPI. |
| RF-BIA-078 | Paginación `?page=&size=` → `{ items, total, page, size }` y modo incremental por cursor (`?updatedSince=&cursor=`) con bajas como tombstones. | Guía §5; BASE §59 | Núcleo | O11 | Adoptado | Una sincronización incremental reproduce exactamente el estado final. |
| RF-BIA-079 | Errores RFC 9457 con `requestId`, sin revelar secretos ni detalles internos. | AGR-021; Guía §5 | Núcleo | O11 | Adoptado | Todo error de la API externa es RFC 9457 con `requestId` y no incluye trazas, secretos ni nombres de colecciones. |
| RF-BIA-080 | Cada respuesta informa `asOf` (fecha de corte/frescura) y `source` (`operational`/`analytical`). | BASE §59 | Núcleo | O11 | Informado | Toda respuesta incluye `asOf` y `source` con el origen real del dato. |
| RF-BIA-081 | Metadatos de etiquetas del diccionario (`/meta/labels`) sin renombrar campos técnicos. | BASE §59, §65 | Estándar | O11 | Informado | `/meta/labels` devuelve la etiqueta del diccionario del tenant y los nombres técnicos de los campos no cambian al personalizar etiquetas. |
| RF-BIA-082 | Exportaciones masivas autorizadas (`/exports`) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). | BASE §59 | Estándar | O11 | Informado | Una exportación masiva pasa por sus estados, vence según su política y se descarga solo con URL firmada vigente. |
| RF-BIA-083 | Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. | AGR-021; FIC 14.3 | Estándar | O11 | A validar (PA-BIA-15) | Firma inválida detectable por el tercero con el ejemplo publicado. |
| RF-BIA-084 | Registro de uso por llamada (cliente, scope, endpoint, estado, latencia, filas, bytes) sin token ni secreto; agregados diarios. | BASE §59 | Núcleo | O11 | Informado | Cada llamada genera un registro de uso sin token ni secreto y el agregado diario coincide con la suma de los registros. |
| RF-BIA-085 | Sandbox con tenant de demostración y datos ficticios para probar integraciones. | BASE §97.9 | Estándar | O11 | Adoptado | Un cliente de sandbox consume la API con datos ficticios del tenant de demostración y no accede a ningún tenant productivo. |
| RF-BIA-086 | Suspensión del tenant o del cliente corta la API (403 `tenant-suspended`/`client-suspended`); cierre del tenant habilita sólo exportación de salida (MER-020). | AGR-004; MER-020 | Núcleo | O11 | Adoptado | Con el tenant o el cliente suspendido la API responde 403 con el código correspondiente; con el tenant cerrado solo responde la exportación de salida. |
| RF-BIA-087 | Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. | BASE §59 | Núcleo | O11 | Informado | La página de cada recurso documenta todos sus campos. |
| RF-BIA-088 | Escrituras limitadas vía API como **solicitudes** que procesa el módulo dueño (alta de persona/cuenta, reclamo), con `Idempotency-Key`. | FIC 14.3 (`RegistrarCuenta`, `RegistrarPersona`, `PutCategoria`); BASE §59 | Extensión | O11 | A validar (PA-BIA-03) | Una solicitud repetida con la misma clave devuelve el mismo resultado. |
| RF-BIA-089 | Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. | MER-014; BASE §43 | Extensión | O11 | A validar (PA-BIA-10) | Dataset abierto no contiene ninguna celda con n < `PRM-BIA-050`. |
| RF-BIA-090 | Catálogo de informes regulatorios por organismo y servicio con período y vencimiento, referenciando el formato y la presentación del módulo dueño. | MER-014; MER-002; BASE §61 | Estándar | O4/O7/O8 | Adoptado | Cada informe regulatorio por servicio tiene código REP-BIA propio (REP-BIA-015 a REP-BIA-024, §15.5.1; HUE-SRV-08). |
| RF-BIA-091 | Exportación completa de datos del tenant para salida (portabilidad) con formatos documentados, usando el motor de exportación masiva. | MER-020; AGR-033 | Estándar | O11 | Adoptado | El paquete incluye diccionario de datos y checksums. |
| RF-BIA-092 | Reportes de control y conciliación entre cuentas corrientes, facturación, cobranza, tesorería y contabilidad. | BASE §75, pendiente l. 4188 | Núcleo | O5/O8 | Adoptado | REP-CON-015 cuadra créditos por servicios = saldo del auxiliar. |
| RF-BIA-093 | Reporte de universo de comprobante: emitido, cancelado, saldo, pagos en proceso separados. | BASE §30 CU-30 | Núcleo | O5 | Informado | CU-30. |
| RF-BIA-094 | Tipos de fecha seleccionables por reporte (emisión, vencimiento 1/2/3, período facturado, lectura, registración, pago, recibo, acreditación, contable). | RN-05 §13.11; INV `cbTipoFecha` | Núcleo | O1 | Adoptado | El encabezado indica qué fecha se usó. |
| RF-BIA-095 | Reportes "a una fecha" (as-of) para saldos, deuda, cartera, stock y anticipos con fecha efectiva y, opcionalmente, "según lo registrado hasta" (bitemporal). | RN-05 §13.11; AGR-010 | Núcleo | O5 | Adoptado | Deuda al 31/10 no cambia por un pago registrado el 2/11 con fecha efectiva 2/11. |
| RF-BIA-096 | Rankings con N parametrizable (ProCoop fijo top 20). | INV `TipoInforme.Ranking_de_Clientes` | Estándar | O4 | Adoptado | Un ranking con N = 50 devuelve 50 filas; el valor por defecto es el del parámetro. |
| RF-BIA-097 | Reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores duplicados, servicios duplicados). | INV `Datos_Controlados`, `GetDatosCuentasSinDatos` | Estándar | O2 | Adoptado | Cada reporte de calidad lista los registros que no cumplen la regla con enlace a su ficha; con datos ficticios controlados devuelve exactamente los casos sembrados. |
| RF-BIA-098 | Matrices configurables de filas y columnas por tenant (filas por categoría/tarifa/tramo, columnas por concepto/impuesto) para informes de consumos y regulatorios. | CAT `INFOCTD`, `INFOCTG`, `INFOCTN`; RN-06 §23.7 | Estándar | O7 | Adoptado | Aviso de categorías faltantes y tramos inconsistentes antes de ejecutar. |
| RF-BIA-099 | Tablero de pendientes técnicos de integración y procesos (autorizaciones ARCA pendientes, lotes, conectores) para responsables. | DFA M8 mejora; AGR-021 | Núcleo | O4 | Adoptado | El tablero muestra CAE pendientes, lotes y conectores con error del tenant y cada ítem abre su origen. |
| RF-BIA-100 | Cada reporte, indicador y endpoint externo se prueba con un test de aislamiento multitenant en CI. | Maestra §5.1 (pruebas); BASE §34 n.º 16, 19, 43, 45 | Núcleo | O1 | Adoptado | Test con códigos internos iguales en dos tenants. |
| RF-BIA-101 | Exportación a sistema contable externo y a GIS mediante layouts/datasets (no como integración ad hoc). | FIC 18.2, 16 | Extensión | O8/O10 | Adoptado | La exportación contable o GIS se configura con un layout o dataset existente, sin código específico, y valida el formato antes de generar. |
| RF-BIA-102 | Conector para herramientas BI (Power BI, Excel, Looker Studio) usando API key de sólo lectura sobre `/datasets` y feeds CSV paginados. | DFA M28 `TABLAS_POWERBI`; FIC 18.1 | Estándar | O11 | A validar (PA-BIA-07) | Power BI Desktop lee el dataset "Facturación" con la API key. |
| RF-BIA-103 | Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. | — | Extensión | O2 | Adoptado | El reporte de uso muestra por reporte cantidad de corridas, tiempo medio y fallos del período. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-BIA-001 | Un reporte es de sólo lectura: nunca modifica datos ni parámetros. | "Recursos asignados a obras" sobrescribe los parámetros 2722/2723 (valor hora normal/extra) con lo tipeado (RN-07 §1.11). | **Reemplazar**: el valor hora es parámetro del reporte en la corrida; el cambio de configuración se hace en T04 con su circuito. | — | — |
| RN-BIA-002 | Aislamiento por tenant en consulta, caché, archivos, jobs, programaciones, IA, API y almacén analítico; el `tenantId` sale del token. | Una base por cooperativa (deuda técnica). | **Reemplazar** (DEC-002, ARQ-04). | — | — |
| RN-BIA-003 | Permiso efectivo = capability del reporte ∩ alcance; los totales se calculan sólo sobre lo visible; no se informa cuántas filas se ocultaron. | Perfiles por pantalla, sin alcance por filas. | **Mejorar**. | — | — |
| RN-BIA-004 | Todo reporte declara universo, período, tipo de fecha, fecha de corte, fórmula de sus totales y granularidad (BASE §30). | Implícito en cada informe. | **Mejorar**. | — | — |
| RN-BIA-005 | Los reportes históricos usan la versión de tarifa, categoría, alícuota y configuración vigente a la fecha del documento, no la actual. | `Get_Informe_ConsumosTramasCuadro` usa la tarifa viva (RN-01 §23.9). | **Reemplazar** (AGR-010). | — | Validar con M04 los informes de tramos de períodos anteriores a cambios de tarifa. |
| RN-BIA-006 | Saldos "a una fecha" = Σ movimientos del auxiliar con fecha efectiva ≤ corte (y, si se pide, `recordedAt` ≤ fecha de registro). | Deuda retroactiva = saldo actual + pagos posteriores, con tres criterios de fecha de pago: 0 fecha de pago, 1 fecha de recibo, 2 fecha de registración (RN-05 §13.11). | **Mejorar**: cálculo directo desde el auxiliar (AGR-011); se conserva el parámetro `paymentDateBasis` = `paymentDate` / `receiptDate` / `recordedAt`. | `PRM-BIA-021` | — |
| RN-BIA-007 | Semántica única: Facturado, Cobrado, Acreditado, Saldo, En proceso (§15.1). | Cada informe con su criterio. | **Mejorar** (AGR-022). | — | — |
| RN-BIA-008 | No duplicar: un resumen de cuenta no suma con sus facturas; filas por concepto no suman con el total de factura; cada dataset declara su granularidad y medidas aditivas. | — | **Adoptar** (AGR-022 ejemplo; BASE §34 n.º 27). | — | — |
| RN-BIA-009 | Pagos en proceso o no confirmados se informan separados de los confirmados. | Pagos web con `ESTADO` < 3 pendientes de autorizar (RN-10 §12.1). | **Adoptar** (CU-30). | — | — |
| RN-BIA-010 | Variación porcentual = (actual − base) / \|base\| × 100. Si ambos son 0 → 0 %. Si base = 0 y actual ≠ 0 → valor nulo con marca "nuevo" (o "sin base"). | `PorcentajeFacturado`: ambos 0 → 0; base 0 → 100; actual 0 → −100; resto (nuevo − base)/base × 100 (RN-01 §23.8). | **Mejorar** con modo de compatibilidad ProCoop opcional por reporte. | `PRM-BIA-022` | A validar (PA-BIA-11). |
| RN-BIA-011 | Redondeo: los importes de documentos se suman con el valor almacenado; los ratios se calculan con Decimal exacto y se redondean al mostrar (half-even, 2 decimales en %, 1 decimal en días). | — | **Adoptar** (AGR-011 convenciones). | `PRM-BIA-023` | — |
| RN-BIA-012 | Parámetros de fecha obligatorios donde el reporte lo requiera; rango máximo síncrono `PRM-BIA-002` meses. | "Parte diario" sin fechas usa 01/01/1900 y no devuelve nada (RN-07 §1.11); filtro de fecha acepta años 1753–9999 (RN-10 §16.5). | **Reemplazar** por validación Zod con mensaje. | `PRM-BIA-002` | — |
| RN-BIA-013 | Límite síncrono de `PRM-BIA-004` segundos; pasado ese tiempo la corrida pasa a asíncrona sin perder el trabajo. | Timeout fijo 120 s del query técnico (RN-07 §1.11). | **Mejorar**. | `PRM-BIA-004` | — |
| RN-BIA-014 | No existe consulta textual ni ejecución de procedimientos; los reportes personalizados sólo combinan campos de datasets certificados. | Informes personalizados ejecutan SP con prefijo o `Select * from` + tabla; `EjecutarSPTemporal` ejecuta SQL arbitrario (RN-10 §16.5, §16.6). | **Reemplazar** (seguridad). | — | — |
| RN-BIA-015 | Nunca se listan contraseñas, claves web, tokens ni secretos en reportes, exportaciones o API. | Informe "Claves Web" (`Listados_Titulares.ClavesWeb`); `WS_KEYS.API_KEY` en texto plano. | **Descartar** el contenido de claves; REP-POR-001 lista usuarios sin credenciales. | — | — |
| RN-BIA-016 | Datos personales enmascarados por defecto; desenmascarar requiere `bia.datosSensibles.ver` y queda en `reportAccessLogs`. | Sin enmascarado. | **Mejorar** (BASE §97.1). | `PRM-BIA-024` | — |
| RN-BIA-017 | Archivos exportados vencen a los `PRM-BIA-008` días; la URL firmada dura `PRM-BIA-007` minutos; cada descarga revalida permiso. | Archivos en disco local o carpeta del usuario. | **Reemplazar** (CNX V-01). | `PRM-BIA-007`, `PRM-BIA-008` | — |
| RN-BIA-018 | Programación: corre con los permisos vigentes del propietario y de cada destinatario; destinatario sin permiso se omite y se registra. | — | **Adoptar**. | — | — |
| RN-BIA-019 | Envío por email: sólo enlace a la app (requiere login) para reportes con datos personales; adjunto permitido únicamente para reportes marcados `sensitivity=none` y ≤ `PRM-BIA-012` MB. | — | **Adoptar**. | `PRM-BIA-012` | A validar (PA-BIA-04). |
| RN-BIA-020 | Simulaciones y escenarios siempre identificados; un indicador real nunca incluye datos de escenarios. | — | **Adoptar** (BASE §55, §34 n.º 39–40). | — | — |
| RN-BIA-021 | Un indicador certificado es inmutable; cualquier cambio de fórmula crea versión; los snapshots conservan la versión con que se calcularon y no se recalculan salvo "recalcular histórico" auditado. | `TABLERO` editable sin versión. | **Mejorar**. | — | — |
| RN-BIA-022 | Sin datos → nulo ("sin datos"), nunca cero; denominador 0 → nulo. | — | **Adoptar** (CNX "vacío honesto"). | — | — |
| RN-BIA-023 | No existen indicadores de demostración con valores aleatorios en producción. | `clsTablero`: si `TIPO_TAB.COD_TIPO = 0` el valor es un número aleatorio entre óptimo y umbral. | **Descartar** (no replicable). | — | — |
| RN-BIA-024 | Semáforo: con sentido "mayor es mejor", ok si valor ≥ óptimo, advertencia si umbral ≤ valor < óptimo, crítico si < umbral; inverso con "menor es mejor". | `VAL_OPT`, `VAL_UMB` en `TABLERO`; estados `ESTATAB`. | **Replicar** con sentido explícito. | — | — |
| RN-BIA-025 | Períodos de tendencia: día, semana ISO, mes calendario del tenant, ciclo de facturación, ejercicio contable. | `PER_TIEMPO` con casos 1, 2, 3 (`clsTablero`). | **Mejorar** (más períodos). | — | Confirmar significado exacto de 1/2/3 en migración. |
| RN-BIA-026 | Indicadores globales de plataforma: sólo agregados por tenant sin datos personales; el detalle requiere acceso de soporte temporal. | — | **Adoptar** (BASE §54). | — | — |
| RN-BIA-027 | Benchmark: sólo ratios (no montos absolutos), por segmento con ≥ `PRM-BIA-051` tenants participantes y ninguno aportando > 40 % del denominador; cada tenant ve su percentil, mediana y cuartiles. | — | **Adoptar** si PA-BIA-05 = A. | `PRM-BIA-051` | — |
| RN-BIA-028 | IA: sólo responde con números provenientes de una consulta semántica ejecutada y registrada; cita KPI/dataset, universo y corte; no envía datos personales al proveedor; toda sugerencia de acción es propuesta (ARQ-08). | `clsChatGPT` con clave hardcodeada (RN-10 §13). | **Reemplazar**. | `PRM-BIA-033` | — |
| RN-BIA-029 | API: el tenant sale de la credencial; un ID de otro tenant responde 404 (no 403) para no revelar existencia. | Integra en IIS de cada cooperativa. | **Reemplazar**. | — | — |
| RN-BIA-030 | API: secretos con hash Argon2id; se muestra una vez; prefijo `gak_` (API key) o `gac_` (client id) visible para soporte; rotación con solapamiento `PRM-BIA-042` horas. | `WS_KEYS.API_KEY` en texto plano; APIKEY fija en código (RN-10 §13). | **Reemplazar**. | `PRM-BIA-041`, `PRM-BIA-042` | — |
| RN-BIA-031 | API: mínimo privilegio; los scopes de escritura y `pii:read` requieren aprobación de `bia.api.clientes.aprobar` y finalidad. | — | **Adoptar**. | — | — |
| RN-BIA-032 | API: nombres de campos estables en inglés camelCase; importes como string decimal + `currency`; fechas ISO 8601 UTC con `timeZone` del tenant; enums documentados. | — | **Adoptar** (BASE §59, §65). | — | — |
| RN-BIA-033 | API incremental: `updatedSince` + `cursor` opaco con marca de agua de `PRM-BIA-046` segundos de retraso para no perder transacciones en curso; bajas lógicas y anulaciones se entregan como eventos de estado, nunca desaparecen. | — | **Adoptar**. | `PRM-BIA-046` | — |
| RN-BIA-034 | Webhooks: firma `HMAC-SHA256(secret, "<timestamp>.<body>")` en cabecera `CoopApps-Signature: t=<unix>,v1=<hex>`; tolerancia `PRM-BIA-047` s; entrega al menos una vez; deduplicar por `eventId`; orden no garantizado; reintentos exponenciales hasta `PRM-BIA-048` horas; suscripción deshabilitada tras ese plazo. | — | **Adoptar** (AGR-021). | `PRM-BIA-047`, `PRM-BIA-048` | — |
| RN-BIA-035 | Payload de webhook "delgado": `eventId`, `type`, `occurredAt`, `resource` (tipo + id + URL) y campos no personales; el tercero obtiene el detalle por la API con sus scopes. | — | **Adoptar**. | — | — |
| RN-BIA-036 | Revocación de credencial o suspensión de cliente efectiva en ≤ `PRM-BIA-043` s (caché de introspección acotada). | — | **Adoptar** (BASE §34 n.º 46). | `PRM-BIA-043` | — |
| RN-BIA-037 | Logs de API sin token, secreto ni cuerpo de respuesta; se guarda el prefijo de la credencial. | — | **Adoptar** (BASE §59). | — | — |
| RN-BIA-038 | Datos del almacén analítico son eventualmente consistentes: toda salida analítica muestra frescura; si la frescura supera `PRM-BIA-031` minutos se avisa en pantalla y se alerta a plataforma. | Power BI sobre tablas. | **Mejorar**. | `PRM-BIA-030`, `PRM-BIA-031` | — |
| RN-BIA-039 | Proyecciones idempotentes por `eventId` y `version` del agregado; un evento repetido no duplica hechos. | — | **Adoptar**. | — | — |
| RN-BIA-040 | Reportes regulatorios y fiscales: BIA no altera el layout oficial; el módulo dueño valida antes de generar y registra presentación y acuse. | Exportadores con personalizaciones por cliente (p. ej. SIRCAR cambia si sigla = "AZUL", RN-08 §15.2). | **Reemplazar** por configuración tipada del módulo dueño. | — | — |
| RN-BIA-041 | Datos abiertos: sólo agregados con n ≥ `PRM-BIA-050` por celda, sin datos personales, con licencia, aprobados y versionados. | — | **Adoptar**. | `PRM-BIA-050` | — |
| RN-BIA-042 | Presets y vistas guardadas nunca amplían permisos: al aplicarlos se interseca con el alcance del usuario y se ocultan columnas no permitidas. | `ENTIDACOU` por usuario. | **Mejorar**. | — | — |
| RN-BIA-043 | Personalizar un tablero no cambia definiciones ni lo que ven otros. | — | **Adoptar**. | — | — |
| RN-BIA-044 | Zona horaria: períodos, "hoy" y cortes se calculan en la zona del tenant (`America/Argentina/Cordoba` por defecto). | Fechas locales del servidor. | **Mejorar** (AGR-017). | — | — |
| RN-BIA-045 | Una selección enviada al módulo dueño (`selectionToken`) vence en `PRM-BIA-014` minutos y el módulo revalida cada ID y su estado antes de actuar. | `MarcarRegistros` en la vista previa y acción directa. | **Mejorar**. | `PRM-BIA-014` | — |
| RN-BIA-046 | Ranking: N parametrizable 5–500; empates por mismo valor se ordenan por identificador. | Top 20 fijo. | **Mejorar**. | — | — |
| RN-BIA-047 | Informes con matriz configurable (`INFOCTD/G/N`) validan antes de ejecutar: categorías del servicio sin fila configurada y filas con tramos superpuestos o con huecos. | `GetCategoriasFaltantes`, `GetErroresTramas` (RN-06 §23.7). | **Replicar**. | — | — |
| RN-BIA-048 | Cada reporte declara si su fuente es operativa (consulta en vivo al módulo, lectura de secundario) o analítica (almacén); los reportes de control y conciliación son siempre operativos. | — | **Adoptar**. | — | — |
| RN-BIA-049 | Las exportaciones y API de domicilios y mapas respetan el permiso de domicilios por tenant y relación autorizada. | — | **Adoptar** (BASE §83 l. 4107). | — | — |
| RN-BIA-050 | Las consultas de reportes a la base operativa usan `readPreference=secondaryPreferred` con `maxStalenessSeconds` `PRM-BIA-032`, salvo reportes de control que exigen primario. | Consulta sobre la base productiva única. | **Mejorar**. | `PRM-BIA-032` | — |
| RN-BIA-051 | Un reporte con tipo de fecha "pago" separa la fecha de cobro de la de registración; el reporte "cobros con fecha distinta" lista los casos en que difieren más de `PRM-BIA-025` días. | `Fecha_Cobro_Distintas` (`clsInformes_Caja`). | **Replicar**. | `PRM-BIA-025` | — |
| RN-BIA-052 | Convenios de chequera totalmente pagos se excluyen con "no incluir cancelados" (criterio homogéneo con convenios mensuales). | Un convenio de chequera pago sigue apareciendo (RN-04 §8.12). | **Mejorar**. | — | Confirmar con cooperativa piloto (M08). |
| RN-BIA-053 | Reincidencias: grupos con más de una orden por cuenta, cuenta+servicio o cuenta+servicio+operación dentro del rango; ventana configurable. | `clsInformes_Tecnica` Reincidencias (RN-07 §1.11). | **Replicar**. | `PRM-BIA-026` | — |
| RN-BIA-054 | Pérdidas: compra activa = pico + resto + valle; cos φ = cos(atan(reactiva/activa)); pérdida = compra − facturado del período; % = pérdida × 100 / compra. | `Get_Informe_Perdidas` (RN-06 §23.7). | **Replicar** (KPI-MED-05). | — | — |
| RN-BIA-055 | Estadísticas de OT: demora en días desde fecha de la orden y desde fecha de ingreso hasta confirmación o "ahora", piso 0; "período anterior" = mismo filtro con fecha hasta = desde − 1 s sin fecha desde. | `Get_Reporte_Estadisticas` (RN-07 §1.11). | **Replicar** como KPI-TEC-03 y REP-TEC-025; se agrega "período anterior de igual duración" como opción por defecto. | — | — |
| RN-BIA-056 | Deuda a prescribir = comprobantes con saldo y 1º vencimiento < hoy − `meses de prescripción`, agrupados por cuenta. | Parámetro 104 (RN-04 §9). | **Replicar** (parámetro en M08). | — | — |
| RN-BIA-057 | Servicios a cortar: meses de deuda = (hoy − 1º vencimiento más antiguo impago) / 30. | `Get_CortarServicio` (RN-04 §10). | **Mejorar**: días exactos y meses calendario; se muestra ambos. | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Todas las colecciones llevan `TenantId` (uniqueidentifier, obligatorio; `PLATFORM` para definiciones de sistema), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`. Todos los índices compuestos empiezan por `TenantId`. Ninguna colección BIA guarda importes de negocio "originales": las proyecciones `bi_*` son copias derivadas reconstruibles.

### 7.1 `reportDefinitions`

Propósito: catálogo de reportes (sistema y personalizados). Reemplaza `INFO_SYS` y las enumeraciones `Listados_*`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | `REP-<MOD>-NNN` (sistema) o `REP-TEN-NNNN` (personalizado). Único por tenant (sistema único global). |
| `origin` | Enum `system`/`custom`/`regulatory` | Sí | `regulatory` = formato oficial de otro módulo. |
| `ownerModule` | Enum de códigos de módulo | Sí | PER, CAT, MED… BIA. |
| `nameKey`, `descriptionKey`, `helpKey` | String | Sí | Claves `dict:`. |
| `cluster` | String | Sí | Cluster del mapa del sitio. |
| `grain` | Enum `person`/`account`/`contract`/`meter`/`reading`/`consumption`/`invoice`/`invoiceLine`/`payment`/`allocation`/`ledgerEntry`/`workOrder`/`ticket`/`product`/`stockMovement`/`supplierDocument`/`cashMovement`/`bankMovement`/`journalLine`/`employee`/`payrollLine`/`member`/`aggregate` | Sí | Granularidad (AGR-022). |
| `source` | Enum `operational`/`analytical`/`both` | Sí | RN-BIA-048. |
| `providerKey` | String | Sí (system) | Identificador del provider del módulo dueño. |
| `datasetId` | uniqueidentifier | Sí (custom) | Dataset semántico base. |
| `parameters[]` | `{ key, type: date/dateRange/period/cutoff/enum/multiEnum/entityRef/number/text/boolean, labelKey, required, default, relativeDefaults[], enumSource, entityType, min, max, dependsOn }` | Sí | Esquema; se genera Zod. |
| `dateTypes[]` | Enum `issueDate`/`dueDate1`/`dueDate2`/`dueDate3`/`billingPeriod`/`readingDate`/`recordedAt`/`paymentDate`/`receiptDate`/`creditDate`/`accountingDate`/`effectiveDate` | No | Tipos de fecha admitidos (RF-BIA-094). |
| `columns[]` | `{ fieldKey, labelKey, type: string/money/decimal/integer/date/datetime/enum/boolean/ref, currencyField, decimals, aggregations[]: sum/count/avg/min/max, sensitive: none/personal/financial, defaultVisible, drillTo }` | Sí | Contrato de columnas estable. |
| `groupings[]`, `sortOptions[]` | Array | No | Agrupaciones y órdenes permitidos. |
| `outputs[]` | Enum `screen`/`xlsx`/`csv`/`pdf`/`layout:<code>`/`kml`/`geojson`/`zip` | Sí | Formatos. |
| `requiredCapabilities[]`, `exportCapabilities[]` | String[] | Sí | — |
| `sensitivity` | Enum `none`/`personal`/`financial`/`fiscal` | Sí | Dispara auditoría y enmascarado. |
| `scopeDimensions[]` | Enum `branch`/`zone`/`service`/`crew`/`own`/`cashbox` | No | Dimensiones de alcance aplicables. |
| `maxSyncRows`, `estimatedCostFn` | Number/String | No | Para decidir sync/async. |
| `templateId` | uniqueidentifier | No | Plantilla PDF por defecto. |
| `legacy` | Object (T05 §19.1) | No | Fila migrada de origen cuando la definición viene de la base del tenant (`table` = `INFO_SYS`, `key` = código). Reemplaza `legacyRefs[]` (CTR-DAT-32 de T05). |
| `procoopEquivalents[]` | String[] | No | Clases o pantallas de ProCoop equivalentes, solo como referencia funcional (ej. `INV clsInformes_Caja.PlanillaCaja`); no identifican filas migradas. |
| `wave` | String | Sí | Ola. |
| `status` | Enum `draft`/`inReview`/`published`/`deprecated`/`archived` | Sí | §8.1. |
| `definitionVersion` | Integer | Sí | Versión funcional. |
| `tenantOverrides` | `{ hidden, nameKeyOverride, templateId, defaultPresetId }` | No | Sólo en copia por tenant (`tenantReportSettings` embebido). |

Índices: `{tenantId, code}` único; `{tenantId, ownerModule, status}`; `{tenantId, cluster}`; texto sobre claves resueltas (índice de búsqueda por idioma del tenant).

### 7.2 `reportPresets`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `reportCode` | String | Sí | — |
| `name` | String | Sí | — |
| `ownerUserId` | uniqueidentifier | Sí | — |
| `sharedWithRoleIds[]` | uniqueidentifier[] | No | Requiere `bia.presets.compartir`. |
| `parameters` | Object | Sí | Valores (validados contra la versión vigente). |
| `columns[]`, `sort[]`, `groupBy[]` | Array | No | — |
| `isDefault` | Boolean | No | — |
| `legacy` | Object (T05 §19.1) | No | `table` = `ESQUEMAS_INFORMES_COBRANZAS`, `key` = `ID_ESQUEMA` (con `LST_PRODUCTOS`, `LST_SERVICIO`, `LST_IMPUESTO`, `INFORME` convertidos a parámetros). Antes `legacyRef` (CTR-DAT-32). |

Índices: `{tenantId, reportCode, ownerUserId}`; `{tenantId, sharedWithRoleIds}`.

### 7.3 `savedViews`

Vistas guardadas de `DataTable` (pantallas operativas y reportes). Campos: `screenKey` (String, Sí), `name`, `ownerUserId`, `sharedWithRoleIds[]`, `filters` (Object con operadores `eq/in/between/contains/gte/lte`), `columns[]` (`fieldKey`, `width`, `visible`), `sort[]`, `groupBy[]`, `pageSize`, `isDefault`, `legacy` (T05 §19.1; `table` = `ENTIDACOU`; antes `legacyRef`, CTR-DAT-32). Índices `{tenantId, screenKey, ownerUserId}`.

### 7.4 `reportRuns`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `reportCode`, `definitionVersion` | String/Integer | Sí | — |
| `requestedBy` | uniqueidentifier | Sí | Usuario o `scheduleId`/`apiClientId`. |
| `trigger` | Enum `interactive`/`schedule`/`event`/`api`/`ai` | Sí | — |
| `parameters` | Object | Sí | Ya resueltos (relativos → absolutos). |
| `effectiveScope` | Object | Sí | Alcance aplicado (snapshot). |
| `mode` | Enum `sync`/`async` | Sí | — |
| `status` | Enum `queued`/`running`/`succeeded`/`failed`/`cancelled`/`expired` | Sí | §8.2. |
| `progress` | `{ pct, rowsProcessed, stage }` | No | — |
| `resultRef` | `{ storage: inline/collection/object, key, rowCount, totals }` | No | Resultado paginable (filas en la colección única `reportRunResults` con `TenantId` y TTL, o objeto NDJSON). Reemplaza la colección por tenant `bia_runResults_<tenant>` (DEC-002; CTR-DAT-50 de T05). |
| `metadata` | `{ universeText, cutoffDate, dateType, grain, source, freshnessAt }` | Sí | RF-BIA-007. |
| `error` | `{ code, messageKey, retriable }` | No | — |
| `startedAt`, `finishedAt`, `durationMs` | Date/Number | No | — |
| `jobId` | String | No | Azure Queue Storage. |
| `idempotencyKey` | String | No | Evita duplicar corridas programadas. |
| `expiresAt` | Date | Sí | TTL del resultado (`PRM-BIA-015`). |

Índices: `{tenantId, requestedBy, createdAt:-1}`; `{tenantId, reportCode, createdAt:-1}`; `{tenantId, status}`; TTL sobre `expiresAt` para resultados (la fila de corrida se conserva `PRM-BIA-016` días).

**`reportRunResults`** (COL-BIA-30 de T05): una sola colección para todos los tenants (DEC-002), con `TenantId`, `reportRunId`, `rowNo` (Integer), `row` (Object con las columnas de la definición) y `expiresAt` (copiado de `reportRuns.expiresAt`, `PRM-BIA-015`). Índices `{tenantId, reportRunId, rowNo}` único y TTL sobre `expiresAt`. Se lee solo a través de la corrida (`resultRef.storage = collection`, `key = reportRunId`) y con el filtro forzado por tenant; nunca se crea una colección por tenant.

### 7.5 `reportExports`

Campos: `runId` (o `screenKey` + `filters` para exportación de grilla), `format` (`xlsx`/`csv`/`pdf`/`layout`/`kml`/`geojson`/`zip`), `csvDialect` (`regional`/`technical`), `layoutId`, `status` (`queued`/`generating`/`ready`/`failed`/`expired`/`cancelled`), `storedFileId` (→ `storedFiles` de T01, objeto con prefijo `tenants/<tenantId>/bia/exports/<yyyy>/<mm>/<id>`; antes `storageKey`, T05 §7.2 y COL-BIA-05), `fileName`, `sizeBytes`, `sha256`, `rowCount`, `containsPersonalData` (Boolean), `masked` (Boolean), `requestedBy`, `expiresAt`, `downloads[]` (`{ at, userId, ip }`), `error`. Índices `{tenantId, requestedBy, createdAt:-1}`, `{tenantId, status}`, `{expiresAt}`.

### 7.6 `reportSchedules` y `reportDeliveries`

`reportSchedules`: `reportCode`, `presetId` o `parameters` (con relativos), `ownerUserId`, `recurrence` (`{ type: daily/weekly/monthly/businessDay/cron/event, daysOfWeek[], dayOfMonth, nthBusinessDay, cron, eventType, timeOfDay }`), `timeZone`, `formats[]`, `recipients[]` (`{ type: user/role/email, ref, verifiedAt }`), `deliveryMode` (`link`/`attachment`), `subjectKey`, `messageText`, `status` (`active`/`paused`/`suspended`/`disabled`), `consecutiveFailures`, `nextRunAt`, `lastRunAt`, `lastRunId`, `validFrom`, `validTo`. Índices `{tenantId, status, nextRunAt}`, `{tenantId, ownerUserId}`.

`reportDeliveries`: `scheduleId`, `runId`, `exportIds[]`, `recipient`, `channel` (`email`/`inApp`), `status` (`pending`/`sent`/`skippedNoPermission`/`failed`/`bounced`), `providerMessageId`, `sentAt`, `error`. Índice `{tenantId, scheduleId, createdAt:-1}`.

### 7.7 `reportTemplates`

Plantillas PDF/HTML de reportes: `reportCode`, `scope` (`system`/`tenant`), `engine` (`html-pdf`), `paper` (`A4`/`Legal`/`Letter`), `orientation`, `header` (logo, título, subtítulo con filtros aplicados — como el subtítulo que arma `GetTraslado_General`), `footer`, `columnOrder[]`, `assets[]` (storage keys), `status` (`draft`/`active`/`archived`; §8.11; antes sin valores), `legacy` (T05 §19.1; `table` = `REPORTES` u `OT_REPORTE`, `key` = clave de la fila; el archivo `ORIGINAL/NUEVO` de `Reportes_Empresa` se convierte a plantilla; antes `legacyRef`, CTR-DAT-32). Índice `{tenantId, reportCode, status}`.

### 7.8 `exportLayouts`

Reemplaza `EXPORTADOR` y `EXPORTADOR_COLUMNAS`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | — |
| `sourceType` | Enum `report`/`dataset` | Sí | Ex `TIPO_ORIGEN`. |
| `sourceRef` | String | Sí | `reportCode` o `datasetId`. Ex `ORIGEN`. |
| `targetType` | Enum `fixedWidth`/`delimited`/`xlsx`/`json` | Sí | Ex `TIPO_DESTINO`. |
| `fileNamePattern` | String | Sí | Variables `{tenantCode}`, `{yyyy}`, `{mm}`, `{dd}`, `{period}`, `{seq}`. Ex `NOMBRE_ARCHIVO`. |
| `delimiter`, `quote`, `lineEnding`, `encoding` | String | No | `;`, `"`, `CRLF`, `UTF-8`/`ISO-8859-1`. |
| `header`, `trailer` | `{ enabled, template }` | No | Registros cabecera/pie con totales. |
| `columns[]` | `{ index, name, fieldKey, length, precision, format, padLeft, padChar, required, fixedValue, emptyValue, transform: upper/lower/digitsOnly/date:<fmt> }` | Sí | Ex `INDICE_COLUMNA`, `NOMBRE_COLUMNA`, `NOMBRE_PROPIEDAD`, `LONGITUD`, `PRECISION`, `FORMATO`, `RELLENO_IZQ`, `CAMPO_OBLIGATORIO`, `VALOR_FIJO`, `CAMPO_VACIO`. |
| `status` | Enum `draft`/`active`/`archived` | Sí | — |

### 7.9 `reportAccessLogs`

Reemplaza `INFO_AUD` (`COD_AUD`, `COD_INF`, `FEC_REG`, `TIP_VIS`). Campos: `reportCode`, `runId`, `exportId`, `action` (`view`/`export`/`download`/`unmask`/`apiRead`), `userId` o `apiClientId`, `ip`, `userAgent`, `rowCount`, `containsPersonalData`, `legalEntityId` (uniqueidentifier → `legalEntities` de T04, no obligatorio: entidad del filtro de la ejecución; vacío si abarca varias entidades o recursos compartidos; DEC-096, RF-BIA-034), `filterSummary` (entidades y demás filtros aplicados), `at`. Sólo inserción; índices `{tenantId, at:-1}`, `{tenantId, reportCode, at:-1}`, `{tenantId, legalEntityId, at:-1}` (DEC-096); retención `PRM-BIA-017`.

### 7.10 `indicatorDefinitions`

Reemplaza `TABLERO` y `TIPO_TAB`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | `KPI-<MOD>-NN`. |
| `ownerModule` | Enum | Sí | — |
| `nameKey`, `definitionKey` | String | Sí | — |
| `formula` | `{ type: ratio/sum/count/countDistinct/avg/median/p90/difference/custom, numerator, denominator, measure, filters, expressionText }` | Sí | Expresión sobre dataset semántico (no SQL). |
| `datasetId` | uniqueidentifier | Sí | — |
| `grain` | Enum (como §7.1) | Sí | Nivel. |
| `universe` | `{ includedStates[], excludedStates[], filters }` | Sí | — |
| `dateBasis`, `periodType` | Enum | Sí | Fecha de imputación y período (`day`/`isoWeek`/`month`/`billingCycle`/`fiscalYear`/`asOf`). |
| `unit` | Enum `ARS`/`pct`/`count`/`days`/`hours`/`kWh`/`m3`/`ratio`/`score` | Sí | — |
| `decimals` | Integer | Sí | — |
| `direction` | Enum `higherIsBetter`/`lowerIsBetter`/`neutral` | Sí | — |
| `targets` | `{ optimum, threshold, objective }` por defecto y por tenant | No | Ex `VAL_OPT`, `VAL_UMB`, `OBJETIVO`. |
| `dimensions[]` | String[] | No | Servicio, categoría, zona, sucursal, canal, cuadrilla… |
| `refresh` | Enum `realtime`/`15m`/`hourly`/`daily`/`monthlyClose` | Sí | — |
| `detailCapability` | String | Sí | Para drill-down. |
| `drillReportCode` | String | No | Reporte de detalle. |
| `status` | Enum `draft`/`certified`/`deprecated` | Sí | — |
| `definitionVersion` | Integer | Sí | — |
| `legacy` | Object (T05 §19.1) | No | `table` = `TABLERO`, `key` = `COD_VAR`. Antes `legacyRef` (CTR-DAT-32). |

### 7.11 `indicatorSnapshots`

Reemplaza `TENDTAB`. Campos: `indicatorId` (→ `indicatorDefinitions`, referencia), `indicatorCode` (copia desnormalizada del código del indicador; antes único campo de vínculo), `definitionVersion`, `periodType`, `periodKey` (`2026-10`, `2026-W44`, `2026-11-03`, `cycle:2026-10`), `dimensionKey` (hash de dimensiones, ex `REF_1..REF_4`), `dimensions` (Object), `value` (DECIMAL(18,4) o null), `numerator`, `denominator`, `count`, `computedAt`, `sourceWatermark`, `isClosed` (Boolean, cierre mensual congelado), `scenarioId` (null en reales; → `simulationScenarios` de M15). Índices `{tenantId, indicatorCode, periodType, periodKey, dimensionKey}` único; `{tenantId, indicatorCode, computedAt:-1}`.

### 7.12 `dashboards` y `dashboardUserPrefs`

`dashboards`: `code` (`DSH-<ROL>`), `nameKey`, `audienceRoleIds[]`, `audienceType` (`platform`/`tenant`/`area`), `widgets[]` (`{ widgetId, type: kpi/series/bars/ranking/pie/table/heatmap/funnel/map/alertList/pendingList, indicatorCodes[], reportCode, dimensions[], period, size: s/m/l, position }`), `globalFilters[]`, `status` (`draft`/`published`/`archived`), `origin` (`system`/`tenant`), `legacy` (T05 §19.1; `table` = `GRUPTAB` o `GRUTAB`; antes `legacyRef`, CTR-DAT-32). Ex `GRAFTAB.TIP_GRA` → `widgets.type`.

`dashboardUserPrefs`: `userId`, `dashboardCode`, `pinned[]`, `hidden[]`, `order[]`, `filters`. Único `{tenantId, userId, dashboardCode}`.

### 7.13 `kpiAlertRules` y `kpiAlerts`

`kpiAlertRules`: `indicatorId` (→ `indicatorDefinitions`, referencia), `indicatorCode` (copia desnormalizada del código; antes único campo de vínculo), `condition` (`{ op: lt/lte/gt/gte/outOfRange/changePctGt, value, value2, forPeriods }`), `dimensionsFilter`, `severity` (`info`/`warning`/`critical`), `recipients[]` (usuarios/roles), `channels[]` (`inApp`/`email`/`push`), `dedupWindowMinutes`, `escalation[]` (`{ afterMinutes, toRoleId }`), `status` (`active`/`paused`).

`kpiAlerts`: `kpiAlertRuleId` (→ `kpiAlertRules`; antes `ruleId`), `indicatorCode` (copia), `dimensionKey`, `value`, `severity`, `status` (`open`/`acknowledged`/`resolved`/`muted`), `openedAt`, `acknowledgedBy/At`, `resolvedBy/At`, `resolutionNote`, `objectRef` (vínculo al objeto de origen), `notifications[]`. Índices `{tenantId, status, severity}`, `{tenantId, kpiAlertRuleId, dimensionKey, status}` (antes `ruleId`).

### 7.14 `analyticsDatasets` (capa semántica)

Campos: `code` (`DS-<DOMINIO>`), `nameKey`, `descriptionKey`, `ownerModule`, `grain`, `factCollection` (`bi_fact_*`), `dimensions[]` (`{ key, labelKey, collection, joinKey, scd: type1/type2 }`), `measures[]` (`{ key, labelKey, type, aggregation, additive: full/semi/none, currencyField }`), `fields[]` (`{ key, type, sensitive, pii, enumKey }`), `exposedTo` (`{ builder, api, bi, ai, openData }`), `requiredCapabilities[]`, `apiScope`, `freshnessTargetMinutes`, `status` (`draft`/`certified`/`deprecated`), `version`.

### 7.15 Almacén analítico `bi_*`

Base lógica separada (`<db>_analytics`) en el mismo cluster o miembro de réplica con etiqueta `analytics` (PA-BIA-01). Toda colección con `TenantId` primero en índices y `sourceVersion`, `sourceEventId`, `projectedAt`.

| Colección | Grano | Campos principales | Fuente (eventos) |
|---|---|---|---|
| `bi_dim_date` | día | fecha, semana ISO, mes, trimestre, año, día hábil del tenant, feriado | calendario T04 |
| `bi_dim_person` | persona (SCD2) | personId, tipo, condición IVA, localidad, estado, validFrom/To (sin documento completo) | `per.person.*` |
| `bi_dim_account` | cuenta (SCD2) | accountId, titular, sucursal, zona, sector, ruta, localidad, barrio, estado | `per.account.*` |
| `bi_dim_contract` | contrato/conexión (SCD2) | contractId, servicio, plan, categoría, estado, fecha alta/baja, prepago, medido | `cat.contract.*` (EVT-CAT-09 a EVT-CAT-23) |
| `bi_dim_service`, `bi_dim_category`, `bi_dim_plan`, `bi_dim_product`, `bi_dim_concept`, `bi_dim_channel`, `bi_dim_cashbox`, `bi_dim_crew`, `bi_dim_supplier`, `bi_dim_glAccount`, `bi_dim_costCenter`, `bi_dim_employee` (sin datos sensibles), `bi_dim_branch`, `bi_dim_zone` | catálogo | código, nombre, jerarquía, vigencia | eventos de catálogo de cada módulo |
| `bi_fact_invoice` | comprobante | invoiceId, tipo, letra, PV, número, fechas (emisión, vtos, período), contrato, cuenta, servicio, neto, impuestos, total, estado, autorizado, anulado, modalidad (separada/agrupada) | `fac.invoice.issued` (EVT-FAC-07) / `fis.invoice.authorized` (EVT-FIS-01) / `fac.invoice.annulled` (EVT-FAC-08) (antes `fac.invoice.issued/authorized/voided`) |
| `bi_fact_invoiceLine` | línea | invoiceId, concepto, cantidad, precio, importe, impuesto, tramo, categoría | `fac.invoice.issued` |
| `bi_fact_payment` | pago | paymentId, canal, ente, fechas (pago, confirmación, acreditación), importe, comisión, estado | `cob.payment.confirmed` (EVT-COB-04) / `cob.receipt.voided` (EVT-COB-05) (antes `cob.payment.*`) |
| `bi_fact_allocation` | imputación | paymentId, invoiceId, importe, fecha efectiva | `cob.payment.confirmed` (EVT-COB-04, `allocations[]`) / `cob.allocation.reversed` (EVT-COB-06) (antes `cob.allocation.*`) |
| `bi_fact_ledgerEntry` | movimiento auxiliar | accountId, contractId, servicio, tipo, débito/crédito, fecha efectiva, recordedAt, documento | `cob.obligation.registered` / `cob.payment.confirmed` / `cob.receipt.voided` / `cob.allocation.reversed` (EVT-COB-01/04/05/06) |
| `bi_snap_balance` | cuenta × servicio × día de corte | saldo, vencido, aging buckets, deuda en convenio | job `bia:snapshot-saldos` |
| `bi_fact_consumption` | consumo aprobado | contrato, medidor, período, canal, cantidad, estimado, origen | `med.consumption.approved` |
| `bi_fact_reading` | lectura | ruta, lecturista, resultado, observación, fecha | `med.reading.*` |
| `bi_fact_arrears` | evento de mora | instancia, notificación, promesa, corte, reconexión | `mor.*` |
| `bi_fact_agreement` | convenio/cuota | plan, cuotas, capital, interés, estado | `mor.agreement.*` |
| `bi_fact_ticket` | caso CRM | tipo, canal, área, prioridad, SLA, tiempos (primera respuesta, resolución), estado, satisfacción | `crm.*` |
| `bi_fact_workOrder` | OT | tipo, operación, cuadrilla, fechas (orden, ingreso, programada, confirmación), resultado, reclamo, reincidencia, costos | `tec.workOrder.*` |
| `bi_fact_turn` | turno | área, box, espera, atención, resultado | `crm.turn.*` |
| `bi_fact_stockMovement` | movimiento de stock | producto, depósito, ubicación, serie, tipo, cantidad, costo | `stk.movement.*` |
| `bi_fact_purchase` | documento de compra | tipo (SA/SC/OC/remito/factura), proveedor, rubro, importes, fechas, estado | `cmp.*` |
| `bi_fact_treasury` | movimiento de tesorería/banco | cuenta, tipo, fecha, fecha contable, importe, conciliado | `tes.*` |
| `bi_fact_journalLine` | renglón contable | asiento, cuenta, centro, debe, haber, ejercicio, plan, escenario | `con.entry.posted` (EVT-CON-01) |
| `bi_fact_payroll` | concepto liquidado (agregado por empleado-centro) | liquidación, concepto, centro, importe, horas | `sue.payrollRun.closed` (EVT-SUE-13) |
| `bi_fact_member` | evento institucional | alta/baja asociado, capital suscripto/integrado, entidad jurídica de la membresía (`legalEntityId`, DEC-096) | `ins.*` |
| `bi_fact_communication` | envío | canal, campaña, entregado, abierto | `com.*` |
| `bi_fact_apiUsage` | llamada agregada por hora | cliente, endpoint, estado, latencia | interno BIA |

Índices tipo: `{tenantId, <fecha>, <dimensión principal>}`; `{tenantId, sourceId}` único.

### 7.16 `customReports`

Campos: `code` (`REP-TEN-NNNN`), `datasetId`, `fields[]`, `filters[]`, `groupBy[]`, `measures[]`, `sort[]`, `chart` (`{ type, x, y }`), `conditionalFormats[]`, `status` (`draft`/`inReview`/`published`/`deprecated`), `ownerUserId`, `publishedToRoleIds[]`, `approvedBy/At`, `templateOriginId` (galería; → `customReports`), `version`. Al publicar genera/actualiza la `reportDefinitions` con `origin=custom`.

### 7.17 `aiQuestions`

Campos: `userId`, `room`, `questionText` (sin datos personales: se filtran entidades), `catalogQuestionCode` (antes `catalogQuestionId`; código del catálogo de preguntas de la sala, configuración y no colección), `semanticQuery` (JSON: dataset, medidas, dimensiones, filtros, período), `resultSummary` (valores devueltos), `citations[]` (`{ indicatorCode | datasetCode, cutoff, universeText }`), `answerText`, `status` (`answered`/`refused`/`failed`), `refusalReason` (`outOfScope`/`noData`/`unsupported`/`pii`), `provider`, `model`, `tokensIn`, `tokensOut`, `feedback` (`up`/`down`, comentario), `at`. Retención `PRM-BIA-035`.

### 7.18 `apiClients`

Colección de **T02** (dueño físico: alta, hash de secretos, endpoint de token y rotación; CTR-BIA-01 y CTR-DAT-03 de T05). T10 define y valida los campos de perfil de datos que se agregan al mismo documento (`purpose`, `systemType`, `scopes[]`, `fieldRestrictions`, `dataScope`, `rateLimit`, `validTo`) y lee el resto para uso y métricas. La tabla lista el documento completo como referencia.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `clientCode` | String | Sí | `CLI-<slug>`; `client_id` público `gac_<random>`. |
| `name`, `description`, `purpose` | String | Sí | Finalidad (BASE §59). |
| `systemType` | Enum `bi`/`municipality`/`federation`/`bot`/`prepaidVendor`/`gis`/`accounting`/`other` | Sí | — |
| `responsibleUserId` | uniqueidentifier | Sí | Responsable del tenant. |
| `technicalContact` | `{ name, email, phone }` | Sí | — |
| `authMethods[]` | Enum `clientCredentials`/`apiKey` | Sí | — |
| `scopes[]` | String[] | Sí | §4.3. |
| `fieldRestrictions` | `{ <recurso>: [campos excluidos] }` | No | Minimización. |
| `dataScope` | `{ branchIds[], serviceIds[], zoneIds[], legalEntityIds[] }` | No | Restricción adicional. `legalEntityIds[]` limita los datos económicos a las personas jurídicas indicadas del tenant (DEC-064). |
| `ipAllowlist[]` | CIDR[] | No | — |
| `rateLimit` | `{ perMinute, burst, dailyQuota }` | Sí | Defaults por plan. |
| `status` | Enum `pending`/`active`/`suspended`/`revoked` | Sí | §8.6. |
| `approvedBy/At`, `suspendedReason`, `revokedAt` | — | No | — |
| `validTo` | Date | No | Vigencia del cliente. |
| `legacy` | Object (T05 §19.1) | No | `table` = `WS_KEYS`, `key` = `COD_API` (`DES_API` → `name`; `DEPOSITO_INSUMO`, `DEPOSITO_PRODUCTO` → `dataScope.warehouseIds`). Antes `legacyRef` (CTR-DAT-32). |

Índices `{tenantId, clientCode}` único; `{clientId}` único global (resuelve tenant).

### 7.19 `apiCredentials`

Colección de **T02** (CTR-BIA-01; CTR-DAT-03 de T05): T10 no escribe credenciales; las emite y rota T02 (API-IAM-47/48) y T10 solo lee `prefix`, `status`, `lastUsedAt` y `lastUsedIp` para uso y auditoría.

Campos: `apiClientId`, `type` (`clientSecret`/`apiKey`), `prefix` (8 primeros caracteres visibles), `secretHash` (Argon2id), `status` (`active`/`rotating`/`revoked`/`expired`), `createdBy`, `expiresAt` (`PRM-BIA-041`), `lastUsedAt`, `lastUsedIp`, `replacedById`, `revokedAt`, `revokedBy`, `reason`. Índices `{tenantId, apiClientId, status}`, `{prefix}`.

### 7.20 `apiUsageLogs` y `apiUsageDaily`

`apiUsageLogs` (TTL `PRM-BIA-044` días): `apiClientId`, `credentialPrefix`, `requestId`, `method`, `route` (plantilla, no URL con datos), `scopeUsed`, `status` (código HTTP, `200` a `599`; no es estado), `problemType`, `latencyMs`, `rows`, `bytes`, `ip`, `at`. `apiUsageDaily`: agregados por cliente/día/endpoint/estado (conservados `PRM-BIA-017`).

**`apiUsageDaily`** — campos (corrección del 05-11-2026; antes solo descripción):

| Campo | Tipo | Obligatorio | Descripción | Referencia |
|---|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | Tenant. | `tenants` (T01) |
| `apiClientId` | uniqueidentifier | Sí | Cliente API. | `apiClients` (T02) |
| `date` | Date (día en zona del tenant) | Sí | Día agregado (antes `day`; nombre canónico de T05). | — |
| `route` | String | Sí | Plantilla de ruta (sin datos). | — |
| `status` | Int | Sí | Código HTTP agregado (`200` a `599`); no es un estado de ciclo de vida. | — |
| `calls` | Int | Sí | Cantidad de llamadas. | — |
| `rows`, `bytes` | Int | Sí | Totales devueltos. | — |
| `latencyP95Ms` | Int | No | Latencia p95 del día [VERIFICAR]. | — |

Índice único `{ tenantId, apiClientId, date, route, status }` (antes con `day`).

### 7.21 `extWebhookSubscriptions` y `extWebhookDeliveries`

`extWebhookSubscriptions`: `apiClientId`, `url` (https obligatorio, sin IP privadas — anti SSRF), `eventTypes[]`, `secretHash` + `secretPrefix` (el secreto se muestra una vez), `status` (`active`/`paused`/`disabled`), `failingSince`, `description`.

`extWebhookDeliveries`: `subscriptionId`, `eventId`, `eventType`, `payloadRef`, `attempt`, `status` (`pending`/`delivered`/`failed`/`retrying`/`dead`), `responseStatus`, `responseMs`, `nextAttemptAt`, `deliveredAt`. Índices `{tenantId, subscriptionId, createdAt:-1}`, `{status, nextAttemptAt}`; TTL `PRM-BIA-049` días.

### 7.22 `extBulkExports`

Campos: `apiClientId` o `userId`, `datasetCode`/`resource`, `filters`, `format` (`ndjson`/`csv`/`parquet`), `status` (`queued`/`running`/`ready`/`failed`/`expired`), `parts[]` (`{ storageKey, rows, sha256 }`), `asOf`, `expiresAt`, `purpose` (`bi`/`exit` MER-020).

### 7.23 `openDataPublications`

Campos: `datasetCode`, `slug`, `titleKey`, `descriptionKey`, `license` (`CC-BY-4.0` por defecto), `aggregation` (dimensiones permitidas), `minCellSize`, `refresh` (`monthly`/`quarterly`), `formats[]`, `status` (`draft`/`approved`/`published`/`withdrawn`), `approvedBy/At`, `lastPublishedAt`, `versions[]` (`{ version, storageKey, rows, publishedAt }`).

### 7.24 `benchmarkParticipations` y `benchmarkAggregates`

`benchmarkParticipations` (tenant): `status` (`optedIn`/`optedOut`), `segmentAttributes` (`{ services[], sizeBand, province }`), `consentBy/At`, `withdrawnAt`.
`benchmarkAggregates` (tenant `PLATFORM`): `indicatorCode`, `periodKey`, `segmentKey`, `n`, `p25`, `median`, `p75`, `mean`, `computedAt`; nunca guarda valores individuales identificables. Cada tenant participante recibe su percentil en `indicatorSnapshots` con `dimensions.benchmark=true`.

### 7.25 Mapeo ProCoop → colecciones

| Tabla ProCoop | Colección destino | Notas |
|---|---|---|
| `INFO_SYS` (COD_INF, NOM_INFO, ORIGEN, CUENTA) | `reportDefinitions` | ORIGEN → `ownerModule`; CUENTA [VERIFICAR] (posible cuenta contable asociada). |
| `INFO_AUD` | `reportAccessLogs` | TIP_VIS → `action`. |
| `REPORTES` (ORIGINAL, NUEVO, COD_EQP) | `reportTemplates` (override por tenant) | El reemplazo "por equipo" se descarta: el override es por tenant. |
| `ESQUEMAS_INFORMES_COBRANZAS` | `reportPresets` | Listas de productos/servicios/impuestos → `parameters`. |
| `EXPORTADOR`, `EXPORTADOR_COLUMNAS` | `exportLayouts` | Mapeo 1:1 de columnas. |
| `TABLAS_POWERBI` (NOMBRE, URL), `PERFILES_TABLAS` | `analyticsDatasets.exposedTo.bi` + permisos | URL de Power BI se registra como enlace externo opcional del dataset. |
| `TABLERO`, `TIPO_TAB` | `indicatorDefinitions` | VAL_OPT/VAL_UMB/OBJETIVO/PER_TIEMPO/TIP_GRA/DEC_VAL mapeados; REF_1..REF_4 → dimensiones. |
| `TENDTAB` | `indicatorSnapshots` | Se migra el histórico como snapshots `isClosed=true` con `definitionVersion=0 (legacy)`. |
| `GRUPTAB`, `GRUTAB` | `dashboards` (grupos/orden) | DISTANCIA/ORD_GRP → `position`. |
| `ESTATAB`, `GRAFTAB` | estados del semáforo y `widgets.type` | Imágenes de gráficos no se migran. |
| `INFOCTD`, `INFOCTG`, `INFOCTN` | configuración de matrices del reporte (propiedad del módulo dueño MED/FIS) | BIA ejecuta. |
| `ENTIDADES`, `ENTIDACOL`, `ENTIDACRIT`, `ENTIDACON`, `ENTIDACOU` | `savedViews` (sólo `ENTIDACOU`); el resto se reemplaza por `DataTable` declarativo (T03) | — |
| `FORMULARIOS_PERSONALIZACIONES` | T03 (personalización de UI) | No es BIA. |
| `WS_KEYS` | `apiClients` + `apiCredentials` | Las claves **no** se migran: se emiten nuevas. |
| `WS_USERS`, `WS_USERS_ACCOUNTS` | M19 | — |
| `WEB_LOG` | M19/T02 | REP-POR-002 lo consulta. |
| `OT_REPORTE` | `reportTemplates` (de TEC) | Reporte de impresión por tipo de OT. |

### 7.26 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-BIA-17 (Asumida, DEC-072).

**`reportExports`** — Archivos exportados (COL-BIA-05; definición en texto en §7.5)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `reportRunId` | uniqueidentifier | Sí | `reportRuns` (T10) | o `screenKey` + `filters` para exportación de grilla; antes `runId` en el texto del §7 (nombre canónico de T05); destino → `reportRuns` |
| `format` | enum | No | — | `xlsx`/`csv`/`pdf`/`layout`/`kml`/`geojson`/`zip` |
| `csvDialect` | enum | No | — | `regional`/`technical` |
| `layoutId` | uniqueidentifier | No | `exportLayouts` (T10) | destino → `exportLayouts` |
| `status` | enum | Sí | — | `queued`/`generating`/`ready`/`failed`/`expired`/`cancelled` |
| `storedFileId` | uniqueidentifier | No | `storedFiles` (T01) | → `storedFiles` de T01, objeto con prefijo `tenants/<tenantId>/bia/exports/<yyyy>/<mm>/<id>`; antes `storageKey`, T05 §7.2 y COL-BIA-05 |
| `fileName` | string | No | — | Según la definición en texto del §7 |
| `sizeBytes` | int | No | — | Según la definición en texto del §7 |
| `sha256` | string | No | — | Según la definición en texto del §7 |
| `rowCount` | int | No | — | Según la definición en texto del §7 |
| `containsPersonalData` | bool | No | — | Boolean |
| `masked` | bool | No | — | Boolean |
| `requestedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `downloads` | array de object | No | — | `{ at, userId, ip }` |
| `error` | string | No | — | Según la definición en texto del §7 |

**`reportSchedules`** — Programaciones (COL-BIA-06; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `reportCode` | string | No | — | Según la definición en texto del §7 |
| `presetId` | uniqueidentifier | No | `reportPresets` (T10) | destino → `reportPresets` |
| `parameters` | array | No | — | con relativos |
| `ownerUserId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `recurrence` | array de object | No | — | `{ type: daily/weekly/monthly/businessDay/cron/event, daysOfWeek[], dayOfMonth, nthBusinessDay, cron, eventType, timeOfDay }` |
| `timeZone` | string | No | — | Según la definición en texto del §7 |
| `formats` | array | No | — | Según la definición en texto del §7 |
| `recipients` | array de object | No | — | `{ type: user/role/email, ref, verifiedAt }` |
| `deliveryMode` | enum | No | — | `link`/`attachment` |
| `subjectKey` | string | No | — | Según la definición en texto del §7 |
| `messageText` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `active`/`paused`/`suspended`/`disabled` |
| `consecutiveFailures` | int | No | — | Según la definición en texto del §7 |
| `nextRunAt` | Date | No | — | Según la definición en texto del §7 |
| `lastRunAt` | Date | No | — | Según la definición en texto del §7 |
| `lastRunId` | uniqueidentifier | No | `reportRuns` (T10) | destino → `reportRuns` |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `reportDefinitionId` | uniqueidentifier | Sí | `reportDefinitions` (T10) | destino → `reportDefinitions` |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`reportDeliveries`** — Entregas programadas (COL-BIA-07; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `scheduleId` | uniqueidentifier | No | `reportSchedules` (T10) | destino → `reportSchedules` |
| `runId` | uniqueidentifier | No | `reportRuns` (T10) | destino → `reportRuns` |
| `exportIds` | array de uniqueidentifier | No | `reportExports` (T10) | destino → `reportExports` |
| `recipient` | string | No | — | Según la definición en texto del §7 |
| `channel` | enum | No | — | `email`/`inApp` |
| `status` | enum | Sí | — | `pending`/`sent`/`skippedNoPermission`/`failed`/`bounced` |
| `providerMessageId` | string | No | — | Según la definición en texto del §7 |
| `sentAt` | Date | No | — | Según la definición en texto del §7 |
| `error` | string | No | — | Según la definición en texto del §7 |

**`reportTemplates`** — Plantillas de reporte (COL-BIA-08; definición en texto en §7.7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `reportCode` | string | No | — | Según la definición en texto del §7 |
| `scope` | enum | No | — | `system`/`tenant` |
| `engine` | string | No | — | `html-pdf` |
| `paper` | enum | No | — | `A4`/`Legal`/`Letter` |
| `orientation` | string | No | — | Según la definición en texto del §7 |
| `header` | string | No | — | logo, título, subtítulo con filtros aplicados — como el subtítulo que arma `GetTraslado_General` |
| `footer` | string | No | — | Según la definición en texto del §7 |
| `columnOrder` | array de string | No | — | Según la definición en texto del §7 |
| `assets` | array | No | — | storage keys |
| `status` | enum | Sí | — | `draft`/`active`/`archived`; §8.11; antes sin valores |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`reportAccessLogs`** — Accesos a reportes (COL-BIA-10; definición en texto en §7.9)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `reportCode` | string | No | — | Según la definición en texto del §7 |
| `runId` | uniqueidentifier | No | `reportRuns` (T10) | destino → `reportRuns` |
| `exportId` | uniqueidentifier | No | `reportExports` (T10) | destino → `reportExports` |
| `action` | enum | No | — | `view`/`export`/`download`/`unmask`/`apiRead` |
| `userId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `apiClientId` | uniqueidentifier | No | `apiClients` (T02) | destino → `apiClients` |
| `ip` | string | No | — | Según la definición en texto del §7 |
| `userAgent` | string | No | — | Según la definición en texto del §7 |
| `rowCount` | int | No | — | Según la definición en texto del §7 |
| `containsPersonalData` | string | No | — | Según la definición en texto del §7 |
| `at` | string | No | — | Según la definición en texto del §7 |
| `reportDefinitionId` | uniqueidentifier | Sí | `reportDefinitions` (T10) | destino → `reportDefinitions` |

**`indicatorSnapshots`** — Valores calculados (COL-BIA-12; definición en texto en §7.11)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `indicatorCode` | string | No | — | Según la definición en texto del §7 |
| `definitionVersion` | string | No | — | Según la definición en texto del §7 |
| `periodType` | string | No | — | Según la definición en texto del §7 |
| `periodKey` | enum | No | — | `2026-10`, `2026-W44`, `2026-11-03`, `cycle:2026-10` |
| `dimensionKey` | string | No | — | hash de dimensiones, ex `REF_1..REF_4` |
| `dimensions` | object | No | — | Object |
| `value` | DECIMAL(18,4) | No | — | DECIMAL(18,4) o null |
| `numerator` | string | No | — | Según la definición en texto del §7 |
| `denominator` | string | No | — | Según la definición en texto del §7 |
| `count` | int | No | — | Según la definición en texto del §7 |
| `computedAt` | Date | No | — | Según la definición en texto del §7 |
| `sourceWatermark` | string | No | — | Según la definición en texto del §7 |
| `isClosed` | bool | No | — | Boolean, cierre mensual congelado |
| `scenarioId` | uniqueidentifier | No | `simulationScenarios` (M15) | null en reales; destino → `simulationScenarios` |
| `indicatorId` | uniqueidentifier | Sí | `indicatorDefinitions` (T10) | destino → `indicatorDefinitions` |
| `date` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |
| `scopeKey` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`dashboards`** — Tableros (COL-BIA-13; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | `DSH-<ROL>` |
| `nameKey` | string | No | — | Según la definición en texto del §7 |
| `audienceRoleIds` | array de uniqueidentifier | No | `roles` (T02) | destino → `roles` |
| `audienceType` | enum | No | — | `platform`/`tenant`/`area` |
| `widgets` | array de object | No | — | `{ widgetId, type: kpi/series/bars/ranking/pie/table/heatmap/funnel/map/alertList/pendingList, indicatorCodes[], reportCode, dimensions[], period, size: s/m/l, position }` |
| `globalFilters` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `draft`/`published`/`archived` |
| `origin` | enum | No | — | `system`/`tenant` |

**`dashboardUserPrefs`** — Preferencias de tablero (COL-BIA-14; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `membershipId` | uniqueidentifier | Sí | `memberships` (T02) | antes `userId` en el texto del §7 (nombre canónico de T05); destino → `memberships` |
| `dashboardCode` | string | No | — | Según la definición en texto del §7 |
| `pinned` | array de string | No | — | Según la definición en texto del §7 |
| `hidden` | array de string | No | — | Según la definición en texto del §7 |
| `order` | array de string | No | — | Según la definición en texto del §7 |
| `filters` | array | No | — | Según la definición en texto del §7 |
| `dashboardId` | uniqueidentifier | Sí | `dashboards` (T10) | destino → `dashboards` |

**`kpiAlertRules`** — Alertas sobre indicadores (COL-BIA-15; definición en texto en §7.13)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `indicatorCode` | string | No | — | Según la definición en texto del §7 |
| `condition` | object | No | — | `{ op: lt/lte/gt/gte/outOfRange/changePctGt, value, value2, forPeriods }` |
| `dimensionsFilter` | string | No | — | Según la definición en texto del §7 |
| `severity` | enum | No | — | `info`/`warning`/`critical` |
| `recipients` | array | No | — | usuarios/roles |
| `channels` | enum | No | — | `inApp`/`email`/`push` |
| `dedupWindowMinutes` | int | No | — | Según la definición en texto del §7 |
| `escalation` | array de object | No | — | `{ afterMinutes, toRoleId }` |
| `status` | enum | Sí | — | `active`/`paused` |
| `indicatorId` | uniqueidentifier | Sí | `indicatorDefinitions` (T10) | destino → `indicatorDefinitions` |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`kpiAlerts`** — Alertas disparadas (COL-BIA-16; definición en texto en §7.13)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `kpiAlertRuleId` | uniqueidentifier | Sí | `kpiAlertRules` (T10) | antes `ruleId` en el texto del §7 (nombre canónico de T05); destino → `kpiAlertRules` |
| `indicatorCode` | string | No | — | Según la definición en texto del §7 |
| `dimensionKey` | string | No | — | Según la definición en texto del §7 |
| `value` | string | No | — | Según la definición en texto del §7 |
| `severity` | enum | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `open`/`acknowledged`/`resolved`/`muted` |
| `openedAt` | Date | No | — | Según la definición en texto del §7 |
| `acknowledgedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `acknowledgedAt` | Date | No | — | Según la definición en texto del §7 |
| `resolvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `resolvedAt` | Date | No | — | Según la definición en texto del §7 |
| `resolutionNote` | string | No | — | Según la definición en texto del §7 |
| `objectRef` | string | No | — | vínculo al objeto de origen |
| `notifications` | array | No | — | Según la definición en texto del §7 |

**`analyticsDatasets`** — Datasets certificados (COL-BIA-17; definición en texto en §7.14)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | `DS-<DOMINIO>` |
| `nameKey` | string | No | — | Según la definición en texto del §7 |
| `descriptionKey` | string | No | — | Según la definición en texto del §7 |
| `ownerModule` | string | No | — | Según la definición en texto del §7 |
| `grain` | string | No | — | Según la definición en texto del §7 |
| `factCollection` | string | No | — | `bi_fact_*` |
| `dimensions` | array de object | No | — | `{ key, labelKey, collection, joinKey, scd: type1/type2 }` |
| `measures` | array de object | No | — | `{ key, labelKey, type, aggregation, additive: full/semi/none, currencyField }` |
| `fields` | array de object | No | — | `{ key, type, sensitive, pii, enumKey }` |
| `exposedTo` | object | No | — | `{ builder, api, bi, ai, openData }` |
| `requiredCapabilities` | array | No | — | Según la definición en texto del §7 |
| `apiScope` | string | No | — | Según la definición en texto del §7 |
| `freshnessTargetMinutes` | int | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `draft`/`certified`/`deprecated` |

**`customReports`** — Generador de reportes del tenant (MER-013) (COL-BIA-18; definición en texto en §7.16)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | `REP-TEN-NNNN` |
| `datasetId` | uniqueidentifier | No | `analyticsDatasets` (T10) | destino → `analyticsDatasets` |
| `fields` | array | No | — | Según la definición en texto del §7 |
| `filters` | array | No | — | Según la definición en texto del §7 |
| `groupBy` | array de uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `measures` | array | No | — | Según la definición en texto del §7 |
| `sort` | array de string | No | — | Según la definición en texto del §7 |
| `chart` | object | No | — | `{ type, x, y }` |
| `conditionalFormats` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `draft`/`inReview`/`published`/`deprecated` |
| `ownerUserId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `publishedToRoleIds` | array de uniqueidentifier | No | `roles` (T02) | destino → `roles` |
| `approvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `approvedAt` | Date | No | — | Según la definición en texto del §7 |
| `templateOriginId` | uniqueidentifier | No | `customReports` (T10) | galería; destino → `customReports` |

**`aiQuestions`** — Preguntas analíticas a IA (COL-BIA-19; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `userId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `room` | string | No | — | Según la definición en texto del §7 |
| `questionText` | string | No | — | sin datos personales: se filtran entidades |
| `catalogQuestionCode` | string | No | — | Código de la pregunta del catálogo de la sala (configuración, no colección); antes `catalogQuestionId` |
| `semanticQuery` | object | No | — | JSON: dataset, medidas, dimensiones, filtros, período |
| `resultSummary` | string | No | — | valores devueltos |
| `citations` | array de object | No | — | `{ indicatorCode / datasetCode, cutoff, universeText }` |
| `answerText` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `answered`/`refused`/`failed` |
| `refusalReason` | enum | No | — | `outOfScope`/`noData`/`unsupported`/`pii` |
| `provider` | string | No | — | Según la definición en texto del §7 |
| `model` | string | No | — | Según la definición en texto del §7 |
| `tokensIn` | int | No | — | Según la definición en texto del §7 |
| `tokensOut` | int | No | — | Según la definición en texto del §7 |
| `feedback` | string | No | — | `up`/`down`, comentario |
| `at` | string | No | — | Según la definición en texto del §7 |
| `aiUsageLogId` | uniqueidentifier | Sí | `aiUsageLogs` (T06) | destino → `aiUsageLogs` |

**`extWebhookSubscriptions`** — Suscripciones de webhooks salientes (COL-BIA-24; definición en texto en §7.21)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `apiClientId` | uniqueidentifier | No | `apiClients` (T02) | destino → `apiClients` |
| `url` | string | No | — | https obligatorio, sin IP privadas — anti SSRF |
| `eventTypes` | array | No | — | Según la definición en texto del §7 |
| `secretHash` | string | No | — | Según la definición en texto del §7 |
| `secretPrefix` | string | No | — | el secreto se muestra una vez |
| `status` | enum | Sí | — | `active`/`paused`/`disabled` |
| `failingSince` | string | No | — | Según la definición en texto del §7 |
| `description` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`extWebhookDeliveries`** — Entregas de webhooks; TTL (COL-BIA-25; definición en texto en §7.21)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `subscriptionId` | uniqueidentifier | Sí | `extWebhookSubscriptions` (T10) | destino → `extWebhookSubscriptions` |
| `eventId` | string | Sí | — | Según la definición en texto del §7 |
| `eventType` | string | No | — | Según la definición en texto del §7 |
| `payloadRef` | string | No | — | Según la definición en texto del §7 |
| `attempt` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `pending`/`delivered`/`failed`/`retrying`/`dead` |
| `responseStatus` | string | No | — | Según la definición en texto del §7 |
| `responseMs` | int | No | — | Según la definición en texto del §7 |
| `nextAttemptAt` | Date | No | — | Según la definición en texto del §7 |
| `deliveredAt` | Date | No | — | Según la definición en texto del §7 |

**`extBulkExports`** — Exportaciones masivas por API (COL-BIA-26; definición en texto en §7.22)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `apiClientId` | uniqueidentifier | No | `apiClients` (T02) | destino → `apiClients` |
| `userId` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `datasetCode` | string | No | — | Según la definición en texto del §7 |
| `resource` | string | No | — | Según la definición en texto del §7 |
| `filters` | array | No | — | Según la definición en texto del §7 |
| `format` | enum | No | — | `ndjson`/`csv`/`parquet` |
| `status` | enum | Sí | — | `queued`/`running`/`ready`/`failed`/`expired` |
| `parts` | array de object | No | — | `{ storageKey, rows, sha256 }` |
| `asOf` | string | No | — | Según la definición en texto del §7 |
| `expiresAt` | Date | No | — | Según la definición en texto del §7 |
| `purpose` | string | No | — | `bi`/`exit` MER-020 |

**`openDataPublications`** — Publicaciones de datos abiertos (COL-BIA-27; definición en texto en §7.23)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `datasetCode` | string | No | — | Según la definición en texto del §7 |
| `slug` | string | No | — | Según la definición en texto del §7 |
| `titleKey` | string | No | — | Según la definición en texto del §7 |
| `descriptionKey` | string | No | — | Según la definición en texto del §7 |
| `license` | string | No | — | `CC-BY-4.0` por defecto |
| `aggregation` | string | No | — | dimensiones permitidas |
| `minCellSize` | int | No | — | Según la definición en texto del §7 |
| `refresh` | enum | No | — | `monthly`/`quarterly` |
| `formats` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `draft`/`approved`/`published`/`withdrawn` |
| `approvedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `approvedAt` | Date | No | — | Según la definición en texto del §7 |
| `lastPublishedAt` | Date | No | — | Según la definición en texto del §7 |
| `versions` | array de object | No | — | `{ version, storageKey, rows, publishedAt }` |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`benchmarkParticipations`** — Adhesión al benchmarking anónimo (COL-BIA-28; definición en texto en §7.24)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `status` | enum | Sí | — | `optedIn`/`optedOut` |
| `segmentAttributes` | array de object | No | — | `{ services[], sizeBand, province }` |
| `consentBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `consentAt` | Date | No | — | Según la definición en texto del §7 |
| `withdrawnAt` | Date | No | — | Según la definición en texto del §7 |
| `period` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`benchmarkAggregates`** — Agregados anónimos entre tenants (COL-BIA-29; definición en texto en §7.24)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `indicatorCode` | string | No | — | Según la definición en texto del §7 |
| `periodKey` | string | No | — | Según la definición en texto del §7 |
| `segmentKey` | string | No | — | Según la definición en texto del §7 |
| `n` | string | No | — | Según la definición en texto del §7 |
| `p25` | string | No | — | Según la definición en texto del §7 |
| `median` | string | No | — | Según la definición en texto del §7 |
| `p75` | string | No | — | Según la definición en texto del §7 |
| `mean` | string | No | — | Según la definición en texto del §7 |
| `computedAt` | Date | No | — | Según la definición en texto del §7 |
| `period` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `metric` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`reportRunResults`** — Resultados temporales de ejecución (reemplaza bia_runResults_<tenant>); TTL (COL-BIA-30; definición en texto en §7.4)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `reportRunId` | uniqueidentifier | Sí | `reportRuns` (T10) | destino → `reportRuns` |
| `rowNo` | int | Sí | — | Integer |
| `row` | object | No | — | Object con las columnas de la definición |
| `expiresAt` | Date | No | — | copiado de `reportRuns.expiresAt`, `PRM-BIA-015` |

**`bi_dim_date`** — Dimensión fecha (COL-BIA-31; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `fecha` | string | No | — | Según la definición en texto del §7 |
| `semana_ISO` | string | No | — | semana ISO |
| `mes` | string | No | — | Según la definición en texto del §7 |
| `trimestre` | string | No | — | Según la definición en texto del §7 |
| `ano` | string | No | — | año |
| `dia_habil_del_tenant` | string | No | — | día hábil del tenant |
| `feriado` | string | No | — | Según la definición en texto del §7 |
| `dateKey` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_dim_person`** — Dimensión persona (seudonimizada) (COL-BIA-32; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `personId` | uniqueidentifier | Sí | `persons` (M01) | destino → `persons` |
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `condicion_IVA` | string | No | — | condición IVA |
| `localidad` | string | No | — | Según la definición en texto del §7 |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `validFrom` | Date | No | — | sin documento completo |
| `validTo` | Date | No | — | sin documento completo |

**`bi_dim_account`** — Dimensión cuenta (COL-BIA-33; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | Sí | `accounts` (M01) | destino → `accounts` |
| `titular` | string | No | — | Según la definición en texto del §7 |
| `sucursal` | string | No | — | Según la definición en texto del §7 |
| `zona` | string | No | — | Según la definición en texto del §7 |
| `sector` | string | No | — | Según la definición en texto del §7 |
| `ruta` | string | No | — | Según la definición en texto del §7 |
| `localidad` | string | No | — | Según la definición en texto del §7 |
| `barrio` | string | No | — | Según la definición en texto del §7 |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `validFrom` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_dim_contract`** — Dimensión contrato (COL-BIA-34; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | `serviceContracts` (M02) | destino → `serviceContracts` |
| `servicio` | string | No | — | Según la definición en texto del §7 |
| `plan` | string | No | — | Según la definición en texto del §7 |
| `categoria` | string | No | — | categoría |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `fecha_alta_baja` | string | No | — | fecha alta/baja |
| `prepago` | string | No | — | Según la definición en texto del §7 |
| `medido` | string | No | — | Según la definición en texto del §7 |
| `validFrom` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_dim_service`** — Dimensión servicio (COL-BIA-35; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `serviceId` | uniqueidentifier | Sí | `tenantServices` (M02) | destino → `tenantServices` |

**`bi_dim_category`** — Dimensión categoría (COL-BIA-36; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `categoryId` | uniqueidentifier | Sí | `serviceCategories` (M02) | destino → `serviceCategories` |

**`bi_dim_plan`** — Dimensión plan (COL-BIA-37; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `planVersionId` | uniqueidentifier | Sí | `servicePlanVersions` (M02) | destino → `servicePlanVersions` |

**`bi_dim_product`** — Dimensión producto (COL-BIA-38; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `serviceProductId` | uniqueidentifier | Sí | `serviceProducts` (M02) | destino → `serviceProducts` |

**`bi_dim_concept`** — Dimensión concepto (COL-BIA-39; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `conceptId` | uniqueidentifier | Sí | `billableConcepts` (M02) | destino → `billableConcepts` |

**`bi_dim_channel`** — Dimensión canal (COL-BIA-40; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_dim_cashbox`** — Dimensión caja (COL-BIA-41; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `cashRegisterId` | uniqueidentifier | Sí | `cashRegisters` (M07) | destino → `cashRegisters` |

**`bi_dim_crew`** — Dimensión cuadrilla (COL-BIA-42; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `crewId` | uniqueidentifier | Sí | `crews` (M10) | destino → `crews` |

**`bi_dim_supplier`** — Dimensión proveedor (COL-BIA-43; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `supplierId` | uniqueidentifier | Sí | `suppliers` (M12) | destino → `suppliers` |

**`bi_dim_glAccount`** — Dimensión cuenta contable (COL-BIA-44; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `ledgerAccountId` | uniqueidentifier | Sí | `ledgerAccounts` (M15) | destino → `ledgerAccounts` |

**`bi_dim_costCenter`** — Dimensión centro de costo (COL-BIA-45; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `costCenterId` | uniqueidentifier | Sí | `costCenters` (M15) | destino → `costCenters` |
| `legalEntityId` | uniqueidentifier | Sí | `legalEntities` (T04) | Entidad dueña del centro (`costCenters.legalEntityId` de M15; DEC-096, RF-BIA-104) |
| `sharedWithLegalEntityIds` | array uniqueidentifier | No | `legalEntities` (T04) | Entidades con las que se comparte el centro (M15 RN-CON-127); el filtro por entidad incluye el centro si la entidad es la dueña o está en esta lista |

**`bi_dim_employee`** — Dimensión empleado (seudonimizada) (COL-BIA-46; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `employeeId` | uniqueidentifier | Sí | `employees` (M16) | destino → `employees` |

**`bi_dim_branch`** — Dimensión sucursal (COL-BIA-47; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `branchId` | uniqueidentifier | Sí | `branches` (T04) | destino → `branches` |

**`bi_dim_zone`** — Dimensión zona (COL-BIA-48; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `codigo` | string | No | — | código |
| `nombre` | string | No | — | Según la definición en texto del §7 |
| `jerarquia` | string | No | — | jerarquía |
| `vigencia` | string | No | — | Según la definición en texto del §7 |
| `zoneId` | uniqueidentifier | Sí | `zones` (T04) | destino → `zones` |

**`bi_fact_invoice`** — Hecho factura (COL-BIA-49; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | Sí | `invoices` (M05) | destino → `invoices` |
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `letra` | string | No | — | Según la definición en texto del §7 |
| `PV` | string | No | — | Según la definición en texto del §7 |
| `numero` | string | No | — | número |
| `fechas` | string | No | — | emisión, vtos, período |
| `contrato` | string | No | — | Según la definición en texto del §7 |
| `cuenta` | string | No | — | Según la definición en texto del §7 |
| `servicio` | string | No | — | Según la definición en texto del §7 |
| `neto` | string | No | — | Según la definición en texto del §7 |
| `impuestos` | string | No | — | Según la definición en texto del §7 |
| `total` | string | No | — | Según la definición en texto del §7 |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `autorizado` | string | No | — | Según la definición en texto del §7 |
| `anulado` | string | No | — | Según la definición en texto del §7 |
| `modalidad` | string | No | — | separada/agrupada |

**`bi_fact_invoiceLine`** — Hecho renglón de factura (COL-BIA-50; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | Sí | `invoices` (M05) | destino → `invoices` |
| `concepto` | string | No | — | Según la definición en texto del §7 |
| `cantidad` | string | No | — | Según la definición en texto del §7 |
| `precio` | string | No | — | Según la definición en texto del §7 |
| `importe` | string | No | — | Según la definición en texto del §7 |
| `impuesto` | string | No | — | Según la definición en texto del §7 |
| `tramo` | string | No | — | Según la definición en texto del §7 |
| `categoria` | string | No | — | categoría |
| `lineId` | uniqueidentifier | Sí | `billableItems` (M05) | destino → `billableItems` |

**`bi_fact_payment`** — Hecho cobro (COL-BIA-51; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `paymentId` | uniqueidentifier | No | `cashOperations` (M07) | destino → `cashOperations` |
| `canal` | string | No | — | Según la definición en texto del §7 |
| `ente` | string | No | — | Según la definición en texto del §7 |
| `fechas` | string | No | — | pago, confirmación, acreditación |
| `importe` | string | No | — | Según la definición en texto del §7 |
| `comision` | string | No | — | comisión |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `receiptId` | uniqueidentifier | Sí | `receipts` (M07) | destino → `receipts` |

**`bi_fact_allocation`** — Hecho imputación (COL-BIA-52; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `paymentId` | uniqueidentifier | No | `cashOperations` (M07) | destino → `cashOperations` |
| `invoiceId` | uniqueidentifier | No | `invoices` (M05) | destino → `invoices` |
| `importe` | string | No | — | Según la definición en texto del §7 |
| `fecha_efectiva` | string | No | — | fecha efectiva |
| `allocationId` | uniqueidentifier | Sí | `allocations` (M07) | destino → `allocations` |

**`bi_fact_ledgerEntry`** — Hecho movimiento de cuenta corriente (COL-BIA-53; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | No | `accounts` (M01) | destino → `accounts` |
| `contractId` | uniqueidentifier | No | `serviceContracts` (M02) | destino → `serviceContracts` |
| `servicio` | string | No | — | Según la definición en texto del §7 |
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `debito_credito` | string | No | — | débito/crédito |
| `fecha_efectiva` | string | No | — | fecha efectiva |
| `recordedAt` | Date | No | — | Según la definición en texto del §7 |
| `documento` | string | No | — | Según la definición en texto del §7 |
| `ledgerEntryId` | uniqueidentifier | Sí | `ledgerEntries` (M07) | destino → `ledgerEntries` |

**`bi_fact_consumption`** — Hecho consumo (COL-BIA-54; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `contrato` | string | No | — | Según la definición en texto del §7 |
| `medidor` | string | No | — | Según la definición en texto del §7 |
| `periodo` | string | No | — | período |
| `canal` | string | No | — | Según la definición en texto del §7 |
| `cantidad` | string | No | — | Según la definición en texto del §7 |
| `estimado` | string | No | — | Según la definición en texto del §7 |
| `origen` | string | No | — | Según la definición en texto del §7 |
| `consumptionId` | uniqueidentifier | Sí | `consumptions` (M03) | destino → `consumptions` |

**`bi_fact_reading`** — Hecho lectura (COL-BIA-55; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `ruta` | string | No | — | Según la definición en texto del §7 |
| `lecturista` | string | No | — | Según la definición en texto del §7 |
| `resultado` | string | No | — | Según la definición en texto del §7 |
| `observacion` | string | No | — | observación |
| `fecha` | string | No | — | Según la definición en texto del §7 |
| `meterReadingId` | uniqueidentifier | Sí | `meterReadings` (M03) | destino → `meterReadings` |

**`bi_fact_arrears`** — Hecho deuda vencida por corte (COL-BIA-56; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `instancia` | string | No | — | Según la definición en texto del §7 |
| `notificacion` | string | No | — | notificación |
| `promesa` | string | No | — | Según la definición en texto del §7 |
| `corte` | string | No | — | Según la definición en texto del §7 |
| `reconexion` | string | No | — | reconexión |
| `accountId` | uniqueidentifier | Sí | `accounts` (M01) | destino → `accounts` |
| `cutoffDate` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_fact_agreement`** — Hecho convenio (COL-BIA-57; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `plan` | string | No | — | Según la definición en texto del §7 |
| `cuotas` | string | No | — | Según la definición en texto del §7 |
| `capital` | string | No | — | Según la definición en texto del §7 |
| `interes` | string | No | — | interés |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `agreementId` | uniqueidentifier | Sí | `agreements` (M08) | destino → `agreements` |

**`bi_fact_ticket`** — Hecho caso de atención (COL-BIA-58; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `canal` | string | No | — | Según la definición en texto del §7 |
| `area` | string | No | — | área |
| `prioridad` | string | No | — | Según la definición en texto del §7 |
| `SLA` | string | No | — | Según la definición en texto del §7 |
| `tiempos` | string | No | — | primera respuesta, resolución |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `satisfaccion` | string | No | — | satisfacción |
| `crmCaseId` | uniqueidentifier | Sí | `crmCases` (M09) | destino → `crmCases` |

**`bi_fact_workOrder`** — Hecho orden de trabajo (COL-BIA-59; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `operacion` | string | No | — | operación |
| `cuadrilla` | string | No | — | Según la definición en texto del §7 |
| `fechas` | string | No | — | orden, ingreso, programada, confirmación |
| `resultado` | string | No | — | Según la definición en texto del §7 |
| `reclamo` | string | No | — | Según la definición en texto del §7 |
| `reincidencia` | string | No | — | Según la definición en texto del §7 |
| `costos` | string | No | — | Según la definición en texto del §7 |
| `workOrderId` | uniqueidentifier | Sí | `workOrders` (M10) | destino → `workOrders` |

**`bi_fact_turn`** — Hecho turno de turnero (COL-BIA-60; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `area` | string | No | — | área |
| `box` | string | No | — | Según la definición en texto del §7 |
| `espera` | string | No | — | Según la definición en texto del §7 |
| `atencion` | string | No | — | atención |
| `resultado` | string | No | — | Según la definición en texto del §7 |
| `crmQueueTicketId` | uniqueidentifier | Sí | `crmQueueTickets` (M09) | destino → `crmQueueTickets` |

**`bi_fact_stockMovement`** — Hecho movimiento de stock (COL-BIA-61; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `producto` | string | No | — | Según la definición en texto del §7 |
| `deposito` | string | No | — | depósito |
| `ubicacion` | string | No | — | ubicación |
| `serie` | string | No | — | Según la definición en texto del §7 |
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `cantidad` | string | No | — | Según la definición en texto del §7 |
| `costo` | string | No | — | Según la definición en texto del §7 |
| `stockMovementId` | uniqueidentifier | Sí | `stockMovements` (M13) | destino → `stockMovements` |

**`bi_fact_purchase`** — Hecho compra (COL-BIA-62; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tipo` | string | No | — | SA/SC/OC/remito/factura |
| `proveedor` | string | No | — | Según la definición en texto del §7 |
| `rubro` | string | No | — | Según la definición en texto del §7 |
| `importes` | string | No | — | Según la definición en texto del §7 |
| `fechas` | string | No | — | Según la definición en texto del §7 |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `supplierInvoiceId` | uniqueidentifier | Sí | `supplierInvoices` (M12) | destino → `supplierInvoices` |

**`bi_fact_treasury`** — Hecho movimiento de tesorería (COL-BIA-63; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `cuenta` | string | No | — | Según la definición en texto del §7 |
| `tipo` | string | No | — | Según la definición en texto del §7 |
| `fecha` | string | No | — | Según la definición en texto del §7 |
| `fecha_contable` | string | No | — | fecha contable |
| `importe` | string | No | — | Según la definición en texto del §7 |
| `conciliado` | string | No | — | Según la definición en texto del §7 |
| `treasuryMovementId` | uniqueidentifier | Sí | `treasuryMovements` (M14) | destino → `treasuryMovements` |

**`bi_fact_journalLine`** — Hecho línea de asiento (COL-BIA-64; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `asiento` | string | No | — | Según la definición en texto del §7 |
| `cuenta` | string | No | — | Según la definición en texto del §7 |
| `centro` | string | No | — | Según la definición en texto del §7 |
| `debe` | string | No | — | Según la definición en texto del §7 |
| `haber` | string | No | — | Según la definición en texto del §7 |
| `ejercicio` | string | No | — | Según la definición en texto del §7 |
| `plan` | string | No | — | Según la definición en texto del §7 |
| `escenario` | string | No | — | Según la definición en texto del §7 |
| `journalLineId` | uniqueidentifier | Sí | `journalLines` (M15) | destino → `journalLines` |

**`bi_fact_payroll`** — Hecho liquidación por empleado y concepto (COL-BIA-65; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `liquidacion` | string | No | — | liquidación |
| `concepto` | string | No | — | Según la definición en texto del §7 |
| `centro` | string | No | — | Según la definición en texto del §7 |
| `importe` | string | No | — | Según la definición en texto del §7 |
| `horas` | string | No | — | Según la definición en texto del §7 |
| `payslipId` | uniqueidentifier | Sí | `payslips` (M16) | destino → `payslips` |
| `conceptCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_fact_member`** — Hecho asociado (COL-BIA-66; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `alta` | string | No | — | Según la definición en texto del §7 |
| `baja asociado` | string | No | — | Según la definición en texto del §7 |
| `capital_suscripto_integrado` | string | No | — | capital suscripto/integrado |
| `associateMembershipId` | uniqueidentifier | Sí | `associateMemberships` (M17) | destino → `associateMemberships` |
| `legalEntityId` | uniqueidentifier | Sí | `legalEntities` (T04) | Entidad jurídica de la membresía (`associateMemberships.legalEntityId` de M17, payload de los eventos `ins.*`; DEC-096, RF-BIA-104) |
| `date` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_fact_communication`** — Hecho comunicación (COL-BIA-67; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `canal` | string | No | — | Según la definición en texto del §7 |
| `campana` | string | No | — | campaña |
| `entregado` | string | No | — | Según la definición en texto del §7 |
| `abierto` | string | No | — | Según la definición en texto del §7 |
| `communicationId` | uniqueidentifier | Sí | `communications` (T09) | destino → `communications` |

**`bi_fact_apiUsage`** — Hecho uso de API (COL-BIA-68; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `cliente` | string | No | — | Según la definición en texto del §7 |
| `endpoint` | string | No | — | Según la definición en texto del §7 |
| `estado` | string | No | — | Según la definición en texto del §7 |
| `latencia` | string | No | — | Según la definición en texto del §7 |
| `apiClientId` | uniqueidentifier | Sí | `apiClients` (T02) | destino → `apiClients` |
| `date` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |

**`bi_snap_balance`** — Foto de saldos por corte (COL-BIA-69; definición en texto en §7.15)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `saldo` | string | No | — | Según la definición en texto del §7 |
| `vencido` | string | No | — | Según la definición en texto del §7 |
| `aging_buckets` | string | No | — | aging buckets |
| `deuda_en_convenio` | string | No | — | deuda en convenio |
| `currentAccountId` | uniqueidentifier | Sí | `currentAccounts` (M07) | destino → `currentAccounts` |
| `cutoffDate` | Date | Sí | — | Campo citado por T05 (referencias o clave única) |


## 8. Estados y transiciones

### 8.1 `reportDefinitions` / `customReports`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Plataforma (sistema) o usuario `bia.disenador.usar` | — | Visible sólo al autor | Borrar borrador |
| `draft` | `inReview` | Autor | Validación de esquema OK | Tarea en bandeja T11 para `bia.disenador.publicar` | Volver a `draft` |
| `inReview` | `published` | Aprobador (distinto del autor si `PRM-BIA-027`=true) | Pruebas de permiso y costo OK | Aparece en catálogo; evento `bia.report.published` | `deprecated` |
| `published` | `deprecated` | Dueño | — | Oculto para nuevas programaciones; programaciones existentes avisan | `published` |
| `deprecated` | `archived` | Dueño | Sin programaciones activas | No ejecutable; corridas históricas conservan referencia | — |

### 8.2 `reportRuns`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `queued` | Usuario/programación/API/IA | Permiso y parámetros válidos | Job encolado | `cancelled` |
| `queued` | `running` | Worker | Cuota disponible | Progreso | `cancelled` |
| `running` | `succeeded` | Worker | Provider terminó | Resultado + metadatos; evento `bia.reportRun.completed` | — |
| `running` | `failed` | Worker | Error | `error.retriable`; evento `bia.reportRun.failed` | Reintentar crea nueva corrida |
| `queued`/`running` | `cancelled` | Solicitante/admin | — | Libera worker | — |
| `succeeded` | `expired` | Job purga | `expiresAt` vencido | Borra resultado, conserva fila | Re-ejecutar |

### 8.3 `reportExports`

`queued` → `generating` → `ready` → `expired`; `generating` → `failed`; `queued/generating` → `cancelled`. Al pasar a `ready` emite `bia.export.ready` y notifica; cada descarga registra en `downloads[]` y `reportAccessLogs`.

### 8.4 `reportSchedules`

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `active` | Usuario `bia.reportes.programar` | Destinatarios válidos | Calcula `nextRunAt` |
| `active` | `paused` | Propietario/admin | — | No corre |
| `paused` | `active` | Propietario/admin | Permisos vigentes | Recalcula `nextRunAt` |
| `active` | `suspended` | Sistema | `consecutiveFailures` ≥ `PRM-BIA-013` o propietario sin permisos/desactivado | Aviso a propietario y admin |
| `suspended` | `active` | Admin/propietario | Causa corregida | Reinicia contador |
| cualquiera | `disabled` | Admin | — | Definitivo |

### 8.5 `indicatorDefinitions`

`draft` → `certified` (`bia.cubos.certificar` (antes `bia.indicadores.certificar`); pruebas de reconciliación OK) → `deprecated` (al publicar versión nueva). La versión nueva arranca en `draft`.

### 8.6 `apiClients`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `pending` | `bia.api.clientes.crear` | Finalidad y responsable cargados | Tarea de aprobación | Eliminar |
| `pending` | `active` | `bia.api.clientes.aprobar` (≠ creador si scopes sensibles) | Scopes revisados | Permite emitir credenciales; `bia.apiClient.activated` | `suspended` |
| `active` | `suspended` | Aprobador o sistema (abuso, tenant suspendido) | — | Todas las llamadas 403 `client-suspended`; webhooks pausados | `active` |
| `active`/`suspended` | `revoked` | Aprobador | — | Revoca credenciales y suscripciones; definitivo | — |

### 8.7 `apiCredentials`

`active` → `rotating` (se emitió reemplazo; ambas válidas `PRM-BIA-042` horas) → `revoked`; `active` → `expired` (job); `active` → `revoked` (manual o por compromiso).

### 8.8 `extWebhookSubscriptions` y entregas

Suscripción: `active` ↔ `paused` (cliente/admin); `active` → `disabled` (fallas continuas ≥ `PRM-BIA-048` horas; aviso al contacto técnico); `disabled` → `active` (manual tras prueba OK).
Entrega: `pending` → `delivered` (2xx); `pending`/`retrying` → `failed` (intento sin 2xx o timeout `PRM-BIA-052` s; registra `responseStatus`); `failed` → `retrying` (quedan intentos; se reintenta en `nextAttemptAt`); `retrying` → `delivered` (2xx); `failed` → `dead` (agotó reintentos); `dead` → `pending` (reenvío manual, API-BIA-50). Antes: "`pending/retrying` → `retrying` (no 2xx, timeout `PRM-BIA-052` s); `retrying` → `dead`"; el valor `failed` de §7.21 no tenía transición.

### 8.9 `kpiAlerts`

`open` → `acknowledged` (responsable) → `resolved` (manual o automático cuando la condición deja de cumplirse `forPeriods` veces); `open/acknowledged` → `muted` (con vencimiento); reabre si vuelve a cumplirse fuera de la ventana de deduplicación.

### 8.10 `openDataPublications`

`draft` → `approved` (`bia.datosAbiertos.publicar`, control de celdas mínimas) → `published` → `withdrawn`; cada refresco publica una versión nueva sin borrar las anteriores.

### 8.11 Colecciones con estado sin máquina propia

Corrección del 05-11-2026: §7 declaraba estos estados sin transiciones (y `reportTemplates.status` sin valores). Estado inicial: el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `reportTemplates` | — | `draft` | Alta u override por `bia.reportes.configurar` (API-BIA-22) | — | — |
| `reportTemplates` | `draft` | `active` | Activación tras vista previa con datos ficticios | — | — |
| `reportTemplates` | `active` | `archived` | Otra plantilla activa para el mismo reporte o baja | — | — |
| `reportDeliveries` | — | `pending` | La corrida programada termina (JOB de programación) | — | — |
| `reportDeliveries` | `pending` | `sent` | El canal acepta el envío | — | — |
| `reportDeliveries` | `pending` | `skippedNoPermission` | El destinatario ya no tiene la capability del reporte | Revalidación al enviar | — |
| `reportDeliveries` | `pending` | `failed` | Error del canal | — | Suma al contador de fallos de la programación (§8.4) |
| `reportDeliveries` | `sent` | `bounced` | Rebote informado por T09 | — | — |
| `kpiAlertRules` | — | `active` | Alta por `bia.alertas.configurar` | — | — |
| `kpiAlertRules` | `active` | `paused` | Pausa por `bia.alertas.configurar` | — | — |
| `kpiAlertRules` | `paused` | `active` | Reanudación | — | — |
| `analyticsDatasets` | — | `draft` | Alta del dataset por `bia.datasets.configurar` | — | — |
| `analyticsDatasets` | `draft` | `certified` | Certificación por `bia.datasets.configurar` | Conciliación con la fuente dentro de tolerancia | — |
| `analyticsDatasets` | `certified` | `deprecated` | Reemplazo por una versión nueva | Aviso a consumidores de API (RF-BIA-076) | — |
| `extBulkExports` | — | `queued` | Solicitud del cliente o de la exportación de salida | Cuota disponible | — |
| `extBulkExports` | `queued` | `running` | Worker toma la exportación | — | — |
| `extBulkExports` | `running` | `ready` | Partes generadas con SHA-256 | — | EVT-BIA-16 `bia.bulkExport.ready` |
| `extBulkExports` | `running` | `failed` | Error | — | — |
| `extBulkExports` | `ready` | `expired` | Pasa `expiresAt` | — | — |
| `benchmarkParticipations` | — | `optedIn` | Adhesión del tenant (`consentBy/At`) por `bia.benchmark.configurar` | — | — |
| `benchmarkParticipations` | `optedIn` | `optedOut` | Retiro (`withdrawnAt`) | — | — |
| `benchmarkParticipations` | `optedOut` | `optedIn` | Nueva adhesión con consentimiento nuevo | — | — |

`aiQuestions.status` (`answered`, `refused`, `failed`) es el resultado final de cada pregunta y no cambia; `apiUsageLogs.status` y `apiUsageDaily.status` son el código HTTP (`200` a `599`), no un estado de ciclo de vida (antes solo `apiUsageLogs`).

### 8.12 Tabla normalizada de las máquinas de §8.3, §8.5 y §8.7 a §8.10

Corrección del cierre de residuales (05-11-2026; PA-BIA-17): una fila por transición de las máquinas descritas en texto, con el estado de alta explícito (`—`). Prevalece el texto de cada subsección si hay diferencia. `aiQuestions` nace en su estado final. `apiClients` y `apiCredentials` son de T02 (§8.11 de T02), que prevalece. `apiUsageLogs.status` y `apiUsageDaily.status` son códigos HTTP (`200` a `599`) y no tienen máquina.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `reportExports` | — | `queued` | Solicitud de exportación | — | — |
| `reportExports` | `queued` | `generating` | Worker toma la exportación | — | — |
| `reportExports` | `generating` | `ready` | Archivo generado | — | `bia.export.ready` |
| `reportExports` | `generating` | `failed` | Error | — | — |
| `reportExports` | `queued`, `generating` | `cancelled` | Cancelación | — | — |
| `reportExports` | `ready` | `expired` | Pasa `expiresAt` | — | — |
| `indicatorDefinitions` | — | `draft` | Alta o versión nueva | — | — |
| `indicatorDefinitions` | `draft` | `certified` | Certificación por `bia.cubos.certificar` | Pruebas de reconciliación OK | — |
| `indicatorDefinitions` | `certified` | `deprecated` | Se publica una versión nueva | — | — |
| `apiCredentials` | — | `active` | Emisión de la credencial | — | — |
| `apiCredentials` | `active` | `rotating` | Se emite el reemplazo (ambas válidas `PRM-BIA-042` horas) | — | — |
| `apiCredentials` | `rotating` | `revoked` | Fin de la gracia | — | — |
| `apiCredentials` | `active` | `expired` | Job de vencimiento | — | — |
| `apiCredentials` | `active` | `revoked` | Revocación manual o por compromiso | — | — |
| `extWebhookSubscriptions` | — | `active` | Alta de la suscripción | — | — |
| `extWebhookSubscriptions` | `active` | `paused` | Pausa por cliente o admin | — | — |
| `extWebhookSubscriptions` | `paused` | `active` | Reanudación | — | — |
| `extWebhookSubscriptions` | `active` | `disabled` | Fallas continuas ≥ `PRM-BIA-048` horas | — | — |
| `extWebhookSubscriptions` | `disabled` | `active` | Reactivación manual tras prueba OK | — | — |
| `extWebhookDeliveries` | — | `pending` | Evento público emitido para la suscripción | — | — |
| `extWebhookDeliveries` | `pending` | `delivered` | Respuesta 2xx | — | — |
| `extWebhookDeliveries` | `pending`, `retrying` | `failed` | Intento sin 2xx o timeout `PRM-BIA-052` s | — | — |
| `extWebhookDeliveries` | `failed` | `retrying` | Quedan intentos (`nextAttemptAt`) | — | — |
| `extWebhookDeliveries` | `retrying` | `delivered` | Respuesta 2xx | — | — |
| `extWebhookDeliveries` | `failed` | `dead` | Agotó los reintentos | — | — |
| `extWebhookDeliveries` | `dead` | `pending` | Reenvío manual (API-BIA-50) | — | — |
| `kpiAlerts` | — | `open` | Se cumple la condición de la regla | — | — |
| `kpiAlerts` | `open` | `acknowledged` | Reconocimiento del responsable | — | — |
| `kpiAlerts` | `open`, `acknowledged` | `resolved` | Manual o automático (la condición deja de cumplirse `forPeriods` veces) | — | — |
| `kpiAlerts` | `open`, `acknowledged` | `muted` | Silencio con vencimiento | — | — |
| `kpiAlerts` | `resolved`, `muted` | `open` | Vuelve a cumplirse fuera de la ventana de deduplicación | — | — |
| `openDataPublications` | — | `draft` | Alta o refresco (versión nueva) | — | — |
| `openDataPublications` | `draft` | `approved` | Aprobación por `bia.datosAbiertos.publicar` | Control de celdas mínimas | — |
| `openDataPublications` | `approved` | `published` | Publicación | — | — |
| `openDataPublications` | `published` | `withdrawn` | Retiro | — | — |
| `aiQuestions` | — | `answered` | Respuesta con citas | — | — |
| `aiQuestions` | — | `refused` | Pregunta fuera de alcance o con datos personales | — | — |
| `aiQuestions` | — | `failed` | Error del proveedor o de la consulta | — | — |

Referencias de §7 sin destino explícito: `reportSchedules.lastRunId`, `reportDeliveries.runId` → `reportRuns` (T10); `indicatorSnapshots.scenarioId` → `simulationScenarios` (M15; antes "escenario de simulación del módulo dueño del indicador [VERIFICAR]"); `kpiAlertRules.indicatorId` (antes `kpiAlertRules.indicatorCode`, que queda como copia) y `kpiAlerts.kpiAlertRuleId` (antes `kpiAlerts.ruleId`) → `indicatorDefinitions` y `kpiAlertRules` (T10; ver §7.26 y T05 COL-BIA-15/16); `customReports.templateOriginId` → plantilla de la galería de plataforma en `customReports` (T10); `aiQuestions.catalogQuestionCode` (antes `catalogQuestionId`) → código del catálogo de preguntas de la sala (configuración del anexo, no colección; antes "[VERIFICAR colección]"); `apiUsageLogs.requestId` → identificador de la solicitud HTTP (no colección); `bi_fact_payment.paymentId` y `bi_fact_allocation.paymentId` → pagos de M07 [VERIFICAR nombre canónico de la colección en T05].

## 9. Procesos y flujos

### 9.1 Ejecución de un reporte (interactivo)

1. El usuario abre el reporte desde el catálogo (PAN-BIA-01) o desde la pantalla del módulo (botón "Reportes" contextual).
2. El frontend arma el formulario de parámetros desde `parameters[]` (mismo esquema Zod en backend).
3. `POST /api/admin/bia/reports/:code/runs`: el backend valida capability, licencia, parámetros; resuelve relativos en la zona del tenant; congela `effectiveScope`.
4. Estima costo (`estimatedCostFn` del provider: cantidad de documentos del universo). Si ≤ umbrales → `mode=sync`: llama al provider con `readPreference` según RN-BIA-050 y devuelve la primera página + totales. Si no → `mode=async`: crea `reportRuns` `queued`, encola `bia:ejecutar-reporte` y devuelve 202 con `runId`.
5. El worker ejecuta el provider en streaming por lotes de `PRM-BIA-018` filas, guarda el resultado en la colección temporal del run y actualiza progreso.
6. Aplica enmascarado según `sensitive` de columnas y capability del solicitante; registra `reportAccessLogs` si `sensitivity ≠ none`.
7. Al terminar: `succeeded`, notificación in-app ("tu reporte está listo"). Fallo: `failed` con `error.retriable`; reintentos automáticos del job: 3 con backoff 30 s/2 min/10 min sólo si `retriable`.
8. Cancelación: `POST /runs/:id/cancel` marca bandera; el worker la verifica entre lotes.

### 9.2 Exportación

1. Desde un run (`POST /runs/:id/exports {format, csvDialect, layoutId, columns}`) o desde una grilla (`POST /table-exports {screenKey, filters, columns, format}` — el backend vuelve a ejecutar la consulta del provider de la grilla, nunca confía en filas enviadas por el cliente).
2. Si filas ≤ `PRM-BIA-005` y formato ≠ PDF grande → genera en línea y responde con URL firmada. Si no → `bia:generar-exportacion`.
3. El worker escribe en streaming (XLSX por streaming writer; CSV; PDF por motor HTML→PDF por páginas de `PRM-BIA-006` filas; layouts fijos), agrega hoja/bloque de metadatos, protege fórmulas, calcula SHA-256, sube a `tenants/<tenantId>/bia/exports/...` con cifrado del lado servidor.
4. `ready` → notificación con enlace a PAN-BIA-04 (no URL directa). La descarga (`GET /exports/:id/download`) revalida permiso y emite URL firmada de `PRM-BIA-007` minutos (redirect 302).
5. Job diario `bia:purgar-exportaciones` borra objetos vencidos y marca `expired`.

### 9.3 Programación y entrega

1. Scheduler `bia:programador` (cada minuto) toma `reportSchedules` `active` con `nextRunAt` ≤ ahora (lock por documento, idempotencia `scheduleId+fechaPrevista`).
2. Revalida permisos del propietario (RN-BIA-018); si fallan → `suspended`.
3. Crea run `trigger=schedule`, espera resultado, genera exportaciones de `formats[]`.
4. Por cada destinatario: verifica permiso (usuarios) o política externa (PA-BIA-04); envía email vía T09 con plantilla `bia.report.delivery` (enlace o adjunto según RN-BIA-019); registra `reportDeliveries`.
5. Programaciones por evento: consumidor de `fac.billingRun.closed` (EVT-FAC-06), `cob.cashSession.closed` (EVT-COB-12), `con.period.closed` (EVT-CON-07), `mor.batch.generated` (EVT-MOR-07) dispara las programaciones suscriptas.
6. Calcula siguiente `nextRunAt` con calendario de días hábiles del tenant (T04).

### 9.4 Indicadores, snapshots y alertas

1. Indicadores `realtime`/`15m`: se calculan bajo demanda sobre el almacén analítico (O11) o, antes de O11, sobre el provider operativo del módulo con caché `PRM-BIA-019` minutos por tenant+indicador+dimensiones.
2. `bia:snapshot-indicadores` diario 02:00 hora del tenant: calcula todos los indicadores certificados con `refresh` ≥ `daily` para el día anterior y guarda `indicatorSnapshots`.
3. `bia:cierre-mensual-indicadores`: el día hábil `PRM-BIA-028` del mes congela (`isClosed=true`) los snapshots del mes anterior; correcciones posteriores generan un snapshot "ajustado" con referencia, sin modificar el cerrado.
4. `bia:evaluar-alertas` tras cada snapshot y cada 15 minutos para indicadores realtime: evalúa reglas, deduplica por `kpiAlertRuleId+dimensionKey` (antes `ruleId+dimensionKey`) en la ventana, abre/actualiza `kpiAlerts`, notifica, escala según `escalation[]`.

### 9.5 Almacén analítico (O11)

1. Proyectores `bia:proyectar-<dominio>` consumen el outbox (y, como red de seguridad, change streams con resume token persistido por tenant/colección).
2. Cada evento se aplica de forma idempotente (`sourceEventId`, `sourceVersion` creciente; versión menor se ignora).
3. Dimensiones SCD2: cambio de atributo histórico cierra la fila (`validTo`) y abre otra.
4. `bia:snapshot-saldos` diario: saldo, vencido y aging por cuenta×servicio al cierre del día (fuente: servicio de saldos de M07, no recalculado por BIA).
5. `bia:reconciliar-bi` diario: para cada indicador certificado y tenant, compara valor operativo vs analítico del día anterior; diferencia > `PRM-BIA-029` → alerta técnica a plataforma y marca el dataset "en revisión".
6. `bia:reconstruir-proyeccion` (manual, por tenant y dominio): reconstruye en colección sombra y conmuta atómicamente.
7. Aislamiento de carga: lecturas analíticas en miembro `analytics` (oculto, prioridad 0) o base analítica separada; cuotas por tenant en el pool de workers `bi`.

### 9.6 IA analítica (O11)

1. Usuario pregunta en una sala (PAN-BIA-12) o en el cajón IA.
2. Pre-procesamiento: se eliminan datos personales detectados (números de documento, emails, nombres de socios reconocidos) y se reemplazan por marcadores.
3. El modelo recibe: catálogo de datasets/indicadores **permitidos al usuario** (sin datos), la pregunta y el contexto de sala; devuelve una **consulta semántica** JSON (no SQL).
4. Backend valida la consulta (Zod), aplica alcance, ejecuta sobre la capa semántica, obtiene resultados agregados.
5. Segundo paso: el modelo redacta la respuesta usando sólo los valores devueltos; el backend verifica que cada número del texto exista en el resultado (si no, rechaza y devuelve respuesta determinística con tabla).
6. Respuesta con citas (KPI/dataset, universo, corte) y botón "ver detalle" (drill al reporte). Registro en `aiQuestions`.
7. Rechazos: fuera de alcance, sin datos, pide datos personales individuales ("¿cuánto debe Juan Pérez?") → se deriva a la ficha del socio con permisos normales, la IA no responde el dato.

### 9.7 API externa: alta de cliente y llamada

1. Administrador crea cliente (PAN-BIA-15): finalidad, responsable, scopes, restricciones → `pending`.
2. Aprobador revisa y activa → emite credenciales (client secret o API key) mostradas una vez; descarga de archivo `.json` con `client_id` y secreto, opcional.
3. Tercero solicita token: `POST /api/v1/ext/oauth/token` (`grant_type=client_credentials`, `client_id`, `client_secret`, `scope` opcional ⊆ scopes del cliente). Respuesta `access_token` (JWT firmado con clave rotada del entorno, claims `tid`, `cid`, `scp`, `exp` 15 min, `jti`) o token opaco (PA-BIA-02). API key: cabecera `Authorization: ApiKey <key>`.
4. Cada llamada: middleware ext → resuelve tenant de la credencial; verifica estado tenant/cliente/credencial (caché ≤ 60 s); IP allowlist; scopes; rate limit (Redis token bucket por cliente y tenant); aplica `dataScope` y `fieldRestrictions`; ejecuta en pool `ext`; registra `apiUsageLogs`.
5. Respuestas con `asOf`, `source`, paginación o cursor; errores RFC 9457 (`type` URIs documentadas: `invalid-token`, `insufficient-scope`, `rate-limited`, `tenant-suspended`, `client-suspended`, `not-found`, `validation-error`, `conflict`, `deprecated`).

### 9.8 Extracción incremental

1. Primera carga: `/exports` masivo del dataset o paginación completa con `asOf`.
2. Luego `GET /<recurso>?updatedSince=<asOf>&cursor=` devuelve cambios ordenados por (`updatedAt`, `_id`) hasta `ahora − PRM-BIA-046` s; incluye `nextCursor` y `asOf` nuevo.
3. Las anulaciones/bajas aparecen como cambios de `status`; los borrados lógicos como `{ id, deleted: true, deletedAt }`.

### 9.9 Webhooks salientes (O11)

1. Consumidor `bia:despachar-eventos-publicos` traduce eventos internos permitidos a eventos públicos (tabla §12.3) y crea `extWebhookDeliveries` por suscripción.
2. `bia:entregar-webhook`: POST JSON con cabeceras `CoopApps-Event-Id`, `CoopApps-Event-Type`, `CoopApps-Signature`, `CoopApps-Timestamp`; timeout `PRM-BIA-052` s; reintentos 1 min, 5 min, 30 min, 2 h, 6 h, 12 h, luego cada 12 h hasta `PRM-BIA-048` h → `dead`.
3. Bandeja de entregas fallidas por cliente con reenvío manual (PAN-BIA-17) y endpoint `POST /webhooks/:id/test`.

### 9.10 Benchmark (O11, si PA-BIA-05 = A)

1. El tenant adhiere (PAN-BIA-20) y declara segmento (servicios, banda de tamaño por cantidad de contratos: < 2.000 / 2.000–10.000 / 10.000–50.000 / > 50.000, provincia).
2. `bia:benchmark-agregar` mensual (día 10): toma snapshots cerrados de indicadores marcados `benchmarkable` (ratios), por segmento; descarta celdas con n < `PRM-BIA-051` o dominancia > 40 %; calcula p25/mediana/p75/media.
3. Publica en `benchmarkAggregates` y calcula el percentil de cada participante; los no participantes no ven el benchmark.

### 9.11 Datos abiertos (O11)

1. El tenant elige dataset y dimensiones permitidas (PAN-BIA-21); el sistema previsualiza y marca celdas con n < mínimo (se suprimen o agregan en "Otros").
2. Aprobación → `bia:publicar-datos-abiertos` genera CSV/JSON versionado en almacenamiento público del tenant (sólo este prefijo es público) y lo lista en la landing (`/api/public/<slug>/open-data`).

### 9.12 Salida del tenant (MER-020)

T01 inicia el cierre; BIA ejecuta `bia:exportacion-salida`: un `extBulkExports` por dataset canónico (todas las colecciones de negocio vía providers de exportación de cada módulo), NDJSON + CSV + diccionario de datos + checksums, con vencimiento acordado y registro de entrega.

### 9.13 Jobs

| Job | Frecuencia | Descripción | Idempotencia / reanudación |
|---|---|---|---|
| JOB-BIA-01 `bia:ejecutar-reporte` | Por demanda | Ejecuta provider en lotes | `runId`; reanuda desde último lote confirmado |
| JOB-BIA-02 `bia:generar-exportacion` | Por demanda | Genera archivo | `exportId`; regenera desde cero |
| JOB-BIA-03 `bia:programador` | Cada minuto | Dispara programaciones | `scheduleId+plannedAt` |
| JOB-BIA-04 `bia:entregar-reporte` | Por demanda | Envía emails | `deliveryId` |
| JOB-BIA-05 `bia:purgar-exportaciones` | Diario 03:00 | Borra vencidos y resultados temporales | Repetible |
| JOB-BIA-06 `bia:snapshot-indicadores` | Diario 02:00 (tz tenant) | Snapshots diarios | Clave única de snapshot |
| JOB-BIA-07 `bia:cierre-mensual-indicadores` | Mensual día hábil `PRM-BIA-028` | Congela mes | Repetible |
| JOB-BIA-08 `bia:evaluar-alertas` | 15 min y post-snapshot | Alertas | Dedupe |
| JOB-BIA-09 `bia:proyectar-<dominio>` | Continuo | Proyección analítica | `sourceEventId` |
| JOB-BIA-10 `bia:snapshot-saldos` | Diario 01:30 | Saldos y aging | `tenant+fecha` |
| JOB-BIA-11 `bia:reconciliar-bi` | Diario 05:00 | Interno vs BI | Repetible |
| JOB-BIA-12 `bia:reconstruir-proyeccion` | Manual | Rebuild | Colección sombra |
| JOB-BIA-13 `bia:analisis-ia-auto` | Cada `PRM-BIA-034` h por sala con cambios | Análisis automático | Caché por universo |
| JOB-BIA-14 `bia:despachar-eventos-publicos` | Continuo | Crea entregas webhook | `eventId+subscriptionId` |
| JOB-BIA-15 `bia:entregar-webhook` | Por entrega | POST firmado | `deliveryId+attempt` |
| JOB-BIA-16 `bia:expirar-credenciales` | Horario | Expira y avisa 15/7/1 días antes | Repetible |
| JOB-BIA-17 `bia:agregar-uso-api` | Horario y diario | `apiUsageDaily` | Clave por hora |
| JOB-BIA-18 `bia:benchmark-agregar` | Mensual día 10 | Agregados anónimos | `periodKey` |
| JOB-BIA-19 `bia:publicar-datos-abiertos` | Según publicación | Genera versión | `publicationId+version` |
| JOB-BIA-20 `bia:exportacion-masiva` | Por demanda | `extBulkExports` | Por parte |
| JOB-BIA-21 `bia:exportacion-salida` | Por demanda (T01) | Portabilidad | Por dataset |
| JOB-BIA-22 `bia:verificar-frescura` | Cada 5 min | Frescura de datasets → alerta | Repetible |

## 10. Pantallas

Patrón común (guía §8): toda pantalla admin usa `AdminShell` + `AdminStickyHeader` + `ScreenHelp` + `DataTable`; los textos se resuelven por `dict:`; las cifras e importes en IBM Plex Mono; "vacío honesto" (RN-BIA-022) con el texto `dict:bia.empty.universe` ("Sin datos para el universo elegido"); errores RFC 9457 mostrados inline por campo. El menú declarativo `siteMapGroups` agrega el cluster **Reportes y BI** (grupos: Catálogo, Mis reportes, Tableros, BI, API y datos, Configuración) y cada módulo agrega en su propio cluster un ítem "Reportes" que abre PAN-BIA-01 filtrado por `ownerModule`.

### PAN-BIA-01 — Catálogo de reportes

- **App / ruta / capability:** admin · `/admin/reportes` (y `/admin/<modulo>/reportes` filtrado) · `bia.reportes.ver`.
- **Propósito:** encontrar y abrir cualquier reporte que el usuario puede ejecutar (RF-BIA-001, RF-BIA-011).
- **Layout:** cabecera con buscador; columna izquierda con clusters del mapa del sitio y contadores; zona central en tarjetas (vista por defecto) o tabla. Pestañas: Todos · Favoritos · Recientes · Programados · Regulatorios · Personalizados.
- **Filtros:** módulo dueño, cluster, sensibilidad, salida disponible (XLSX/CSV/PDF/archivo/KML), origen (`system`/`custom`/`regulatory`), ola habilitada.
- **Columnas / tarjeta:** código REP, nombre, módulo, granularidad, fuente (operativa/analítica), última ejecución propia, estrella de favorito.
- **Acciones:** abrir (PAN-BIA-02), marcar favorito, ver ficha (modal `md` con propósito, parámetros, columnas, fórmulas, ejemplo, capabilities requeridas), programar (PAN-BIA-05).
- **Estado vacío:** "No tenés reportes habilitados en este módulo. Pedí acceso a tu administrador." con enlace al detalle de capabilities faltantes.
- **Ayuda contextual:** qué es un reporte, diferencia entre reporte, tablero y sala BI; caso de uso CU-BIA-01.
- **Equivalencia ProCoop:** menú "Informes" de cada pestaña (REL `README.md`), `INFO_SYS`, `frmInformes` (ProcoopNet), botones "Informes" de cada formulario `frmInformes*` de los ProMod.

### PAN-BIA-02 — Ejecución de reporte

- **App / ruta / capability:** admin · `/admin/reportes/:code` · `bia.reportes.ejecutar` + capabilities del reporte.
- **Propósito:** cargar parámetros, ejecutar, ver resultado, totales y llegar al detalle (RF-BIA-003 a RF-BIA-009, RF-BIA-094, RF-BIA-095).
- **Layout:** panel de parámetros plegable arriba (formulario generado desde `parameters[]`, con selector de preset y de tipo de fecha); debajo, franja de **metadatos** (universo en texto, fecha de corte, tipo de fecha, granularidad, fuente y frescura); `DataTable` con agrupación, subtotales y fila de totales fija; pestañas opcionales Gráfico y Mapa (si el reporte declara geolocalización, RF-BIA-020).
- **Acciones:** Ejecutar; Guardar como preset; Exportar (menú XLSX/CSV regional/CSV técnico/PDF/layout/KML/GeoJSON/ZIP); Programar; Cancelar (si corre); Reintentar (si falló); Seleccionar filas → "Enviar a…" (acción del módulo dueño por `selectionToken`, RF-BIA-019); Copiar enlace (abre con los mismos parámetros, nunca con resultados).
- **Modales:** `md` progreso asíncrono (barra, filas procesadas, etapa; "seguir en segundo plano"); `lg` detalle de un total (drill-down a filas componentes y al documento de origen en su módulo); `sm` confirmación de desenmascarado (requiere `bia.datosSensibles.ver`, registra `unmask`).
- **Estados:** sin ejecutar (texto guía), ejecutando (3 filas skeleton), vacío honesto, error con `requestId`, resultado expirado ("re-ejecutar").
- **Ayuda contextual:** fórmula de cada total, universo y tipo de fecha (de la ficha del reporte); advertencia de simulación con marca "SIMULACIÓN" (RF-BIA-015).
- **Equivalencia ProCoop:** `frmInformes_Preview` (vista previa y `MarcarRegistros`), `frmInformeSimple`, `frmConsultaGenerica`, cada `frmInformes<Módulo>` y `frmListados*` de los ProMod.

### PAN-BIA-03 — Mis corridas

- **App / ruta / capability:** admin · `/admin/reportes/corridas` · `bia.reportes.ver` (propias); `bia.exportaciones.administrar` (todas del tenant, sin abrir resultados sin la capability del reporte).
- **Columnas:** fecha, reporte y versión, disparador (interactivo/programado/evento/API/IA), parámetros resumidos, estado, duración, filas, vence.
- **Filtros:** estado, reporte, disparador, rango de fechas, usuario (solo administrador).
- **Acciones:** abrir resultado, re-ejecutar con mismos parámetros, cancelar, exportar.
- **Estado vacío:** "Todavía no ejecutaste reportes".
- **Equivalencia ProCoop:** — (no existe historial).

### PAN-BIA-04 — Mis exportaciones

- **App / ruta / capability:** admin · `/admin/reportes/exportaciones` · `bia.exportaciones.ver`; administración global con `bia.exportaciones.administrar`.
- **Columnas:** fecha, origen (reporte o pantalla), formato, filas, tamaño, SHA-256 (copiable), contiene datos personales, enmascarado, estado, vence, descargas.
- **Acciones:** Descargar (revalida permiso y genera URL firmada de `PRM-BIA-007` minutos, RF-BIA-022), cancelar, regenerar si venció (re-ejecuta la corrida con los mismos parámetros).
- **Estados:** `queued`/`generating` con progreso; `failed` con motivo; `expired` con botón "regenerar".
- **Ayuda contextual:** por qué los archivos vencen (RN-BIA-017) y por qué el email trae un enlace y no el archivo.
- **Equivalencia ProCoop:** `frmResultadoExportacion`.

### PAN-BIA-05 — Programaciones

- **App / ruta / capability:** admin · `/admin/reportes/programaciones` · `bia.reportes.programar`; destinatarios externos con `bia.reportes.programarExternos`.
- **Columnas:** reporte, preset, recurrencia en lenguaje natural ("el primer día hábil de cada mes a las 07:00"), formatos, destinatarios, estado, próxima corrida, última corrida y resultado, fallos consecutivos.
- **Modal `lg` de alta/edición:** reporte y preset (o parámetros con relativos), recurrencia (diaria, semanal con días, mensual día N/último/n-ésimo hábil, cron avanzado, por evento con lista cerrada de eventos), hora y zona del tenant, formatos, destinatarios (usuarios, roles, emails externos si PA-BIA-04), modo enlace/adjunto (RN-BIA-019), asunto y mensaje, vigencia.
- **Acciones:** pausar, reanudar, ejecutar ahora, ver entregas (`reportDeliveries`), duplicar, deshabilitar.
- **Estado vacío:** "Programá un reporte desde su pantalla con el botón Programar".
- **Equivalencia ProCoop:** — (no existe; las tareas del Agente solo ejecutaban procesos).

### PAN-BIA-06 — Presets y vistas guardadas

- **App / ruta / capability:** admin · `/admin/reportes/presets` (gestión) + selector embebido en PAN-BIA-02 y en todo `DataTable` · `bia.reportes.ver`; compartir con `bia.presets.compartir`.
- **Columnas:** nombre, tipo (preset de reporte / vista de pantalla), reporte o pantalla, dueño, compartido con, por defecto, última modificación.
- **Acciones:** renombrar, compartir a roles, marcar por defecto, eliminar, validar contra la versión vigente (marca "parámetros obsoletos").
- **Equivalencia ProCoop:** `ESQUEMAS_INFORMES_COBRANZAS` (`clsInformes_Caja.GuardarEsquema`), `ENTIDACOU`, `clsPadronTitular.GuardarFiltros` (V2 #50), filtros por defecto V2 #2321, #2951, #2306, #3095.

### PAN-BIA-07 — Configuración del catálogo del tenant

- **App / ruta / capability:** admin · `/admin/reportes/configuracion` · `bia.reportes.configurar`.
- **Propósito:** ocultar/mostrar reportes de sistema, renombrarlos vía diccionario, asignar plantilla PDF override y preset por defecto (RF-BIA-017, RF-BIA-018).
- **Layout:** tabla de reportes con interruptor "visible", nombre efectivo, plantilla, preset por defecto; panel lateral con editor de plantilla (logo, encabezado, pie, orden de columnas, papel, orientación) y vista previa PDF con datos ficticios.
- **Equivalencia ProCoop:** `abm_Reportes`, tabla `REPORTES` (ORIGINAL/NUEVO), carpetas `Reportes_Empresa`, `Grilla_OT_Reporte`/`OT_REPORTE`.

### PAN-BIA-08 — Layouts de archivo

- **App / ruta / capability:** admin · `/admin/reportes/layouts` · `bia.reportes.configurar`.
- **Propósito:** definir archivos planos de ancho fijo o delimitados sobre un reporte o dataset (RF-BIA-030).
- **Layout:** cabecera del layout (código, nombre, origen, tipo de destino, patrón de nombre, separador, codificación, fin de línea, registro cabecera/pie); grilla editable de columnas (índice, nombre, campo, largo, precisión, formato, relleno, carácter de relleno, obligatorio, valor fijo, valor si vacío, transformación) con arrastrar para reordenar.
- **Acciones:** vista previa con 20 filas reales (respetando alcance y enmascarado), validar (largo total de línea, campos inexistentes), activar, archivar, duplicar, importar desde Excel (`ExcelImportWizard`).
- **Equivalencia ProCoop:** `frmExportacionArchivos`, `TiposArchivosExportacion`, `EXPORTADOR`, `EXPORTADOR_COLUMNAS`, `clsExportacion`, `Exportador_Base`.

### PAN-BIA-09 — Generador de reportes del tenant

- **App / ruta / capability:** admin · `/admin/reportes/disenador` · `bia.disenador.usar`; publicar con `bia.disenador.publicar` (O11).
- **Propósito:** armar reportes personalizados sobre datasets certificados, sin SQL (RF-BIA-041 a RF-BIA-045).
- **Layout:** asistente en 5 pasos: (1) dataset (tarjetas con descripción, granularidad y frescura); (2) campos y medidas (lista con búsqueda; los sensibles marcados); (3) filtros y parámetros expuestos; (4) agrupación, orden, totales, formato condicional y gráfico; (5) vista previa con estimación de costo y envío a revisión.
- **Acciones:** guardar borrador, vista previa (máximo `PRM-BIA-020` documentos), enviar a revisión, aprobar/rechazar con comentario (bandeja T11), publicar a roles, deprecar, copiar desde galería (RF-BIA-044).
- **Estado vacío:** galería de plantillas sugeridas por dominio.
- **Equivalencia ProCoop:** `frmEditorReportes`, `frmListadosPersonalizados`, `frmListadosPersonalizados_Parametros`, `clsInformesPersonalizados` (procesos personalizados con SP: `Descartado` por RN-BIA-014).

### PAN-BIA-10 — Tablero por rol

- **App / ruta / capability:** admin · `/admin/tableros/:code` (la home de cada rol abre su tablero por defecto) · `bia.tableros.ver` + `detailCapability` de cada indicador para el drill-down.
- **Layout:** `BiFilterBar` (período, servicio, sucursal, zona, categoría) → grilla de widgets (`KpiGrid` con valor, variación, semáforo y frescura; series; rankings; tortas ≤ 6 porciones; mapas de calor; embudos; lista de alertas abiertas; lista de pendientes). Cada widget abre el reporte de detalle (`drillReportCode`).
- **Acciones:** cambiar período/filtros, fijar/ocultar/reordenar widgets (preferencias personales, RN-BIA-043), exportar el tablero a PDF, programar envío del tablero.
- **Estados:** widget sin datos = vacío honesto; dato desactualizado (frescura > `PRM-BIA-031`) = insignia ámbar "dato de hh:mm".
- **Equivalencia ProCoop:** Tablero de Control (`clsTablero`, `TABLERO`, `GRUPTAB`, `GRUTAB`, `GRAFTAB`, `ESTATAB`, `TENDTAB`).

### PAN-BIA-11 — Diseñador de tableros

- **App / ruta / capability:** admin · `/admin/tableros/disenar` · `bia.tableros.disenar`.
- **Layout:** lienzo de 12 columnas con paleta de widgets; panel de propiedades (indicadores, dimensiones, período, tamaño s/m/l); audiencia por roles; vista previa "como el rol X" (aplica alcance del rol de ejemplo).
- **Acciones:** guardar borrador, publicar, archivar, duplicar tablero de sistema como tablero del tenant.
- **Equivalencia ProCoop:** configuración de `GRUPTAB`/`GRUTAB`/`TABLERO`.

### PAN-BIA-12 — Sala BI

- **App / ruta / capability:** admin · `/admin/bi/:room` (rooms: `facturacion`, `cobranza`, `mora`, `consumos`, `reclamos`, `tecnica`, `compras`, `tesoreria`, `contabilidad`, `personal`, `institucional`, `comunidad`) · `bia.bi.ver`; zona C con `bia.ia.consultar` (antes `bia.ia.preguntar`) (O11).
- **Layout (CNX §4.5, §7.5):** zona A KPIs certificados del dominio; zona B contexto (series, rankings, tabla `items` paginada con drill-down); zona C cajón IA con preguntas de catálogo, caja de pregunta libre (si PA-BIA-06 = A), respuesta con cifras citadas (KPI/dataset, universo, corte), botón "ver detalle" y valoración positiva/negativa con comentario.
- **Acciones:** exportar `items` a XLSX, análisis automático (cacheado), programar envío de la sala, copiar consulta semántica (para soporte).
- **Estados:** la zona A funciona sin IA; IA deshabilitada en el tenant → zona C oculta; rechazo de IA con motivo (`outOfScope`, `noData`, `unsupported`, `pii`).
- **Equivalencia ProCoop:** Power BI sobre `TABLAS_POWERBI` (DFA M28); `clsChatGPT` (Reemplazado).

### PAN-BIA-13 — Catálogo de indicadores

- **App / ruta / capability:** admin · `/admin/indicadores` · `bia.indicadores.ver`; certificar con `bia.cubos.certificar` (antes `bia.indicadores.certificar`).
- **Columnas:** código KPI, nombre, módulo, unidad, sentido, refresco, estado (`draft`/`certified`/`deprecated`), versión, óptimo/umbral/objetivo del tenant, último valor y frescura.
- **Ficha (modal `xl`):** definición completa (fórmula, numerador, denominador, universo, estados incluidos/excluidos, tipo de fecha, corte, granularidad, dimensiones, permiso de detalle, reporte de detalle), historial de versiones, últimas reconciliaciones (RF-BIA-063), serie de snapshots.
- **Acciones:** editar objetivos del tenant (no la fórmula), proponer versión, certificar, deprecar.
- **Equivalencia ProCoop:** `TABLERO`, `TIPO_TAB`.

### PAN-BIA-14 — Alertas de indicadores

- **App / ruta / capability:** admin · `/admin/indicadores/alertas` · `bia.alertas.configurar` (reglas) y `bia.alertas.gestionar` (bandeja).
- **Pestaña Bandeja:** alertas por severidad y estado, con valor, umbral, dimensión, objeto vinculado, tiempo abierta; acciones reconocer, resolver con nota, silenciar con vencimiento, abrir objeto.
- **Pestaña Reglas:** indicador, condición, dimensiones, severidad, destinatarios, canales, deduplicación, escalamiento, estado; alta en modal `lg` con simulación sobre los últimos 30 snapshots ("se habría disparado N veces").
- **Equivalencia ProCoop:** `ESTATAB` (estados del tablero); no había notificación.

### PAN-BIA-15 — Clientes de API

- **App / ruta / capability:** admin · `/admin/api/clientes` · `bia.api.clientes.ver`; crear `bia.api.clientes.crear`; aprobar `bia.api.clientes.aprobar`; credenciales `bia.api.credenciales.rotar` (delega en T02 PAN-IAM-24 / API-IAM-47, CTR-BIA-01).
- **Columnas:** código, nombre, tipo de sistema, responsable, finalidad, scopes, restricciones (IP, sucursales, servicios), estado, credenciales activas (prefijo y vencimiento), último uso, consumo del día vs cuota.
- **Asistente de alta (modal `xl`):** datos y finalidad → scopes (con descripción y advertencia en `pii:read`, `requests:write`, `erp.finance:read`, `payroll:read`) → restricciones de datos y campos → límites (plan por defecto) → resumen y envío a aprobación.
- **Acciones:** aprobar/rechazar (≠ creador para scopes sensibles), suspender, reactivar, revocar, emitir/rotar/revocar credencial (secreto visible una sola vez con botón copiar y descarga `.json`), ver uso (PAN-BIA-16), ver webhooks (PAN-BIA-17), descargar OpenAPI del cliente.
- **Equivalencia ProCoop:** `WS_KEYS` (API key en texto plano, `Reemplazado`), configuración de Integra (RN-10 §12).

### PAN-BIA-16 — Uso y cuotas de API

- **App / ruta / capability:** admin · `/admin/api/uso` · `bia.api.uso.ver`.
- **Layout:** KPIs (llamadas hoy, tasa de error, p95 de latencia, 429 del día, cuota usada); serie por hora; tabla por cliente/endpoint/estado; tabla de últimos errores (`problemType`, `requestId`, prefijo de credencial) sin cuerpos ni tokens (RN-BIA-037).
- **Filtros:** cliente, endpoint (plantilla de ruta), estado HTTP, rango.
- **Equivalencia ProCoop:** — (Integra sin registro de uso).

### PAN-BIA-17 — Webhooks salientes y entregas

- **App / ruta / capability:** admin · `/admin/api/webhooks` · `bia.api.webhooks.configurar`.
- **Pestaña Suscripciones:** cliente, URL (https), tipos de evento, estado, fallando desde; acciones crear, pausar, reanudar, rotar secreto, enviar evento de prueba.
- **Pestaña Entregas:** evento, tipo, suscripción, intento, estado, código de respuesta, latencia, próximo intento; acciones reenviar (individual o masivo para `dead`), ver payload (delgado, RN-BIA-035).
- **Equivalencia ProCoop:** — (Integra solo recibía webhooks).

### PAN-BIA-18 — Datasets semánticos

- **App / ruta / capability:** admin · `/admin/bi/datasets` · `bia.datasets.ver`; habilitar exposición con `bia.datasets.configurar`.
- **Columnas:** código DS, nombre, módulo, granularidad, medidas, frescura, estado, expuesto a (builder/API/BI/IA/datos abiertos).
- **Ficha:** diccionario de campos (clave técnica, etiqueta, tipo, sensible, enum), medidas con aditividad, dimensiones e historización, scope de API, ejemplo de consulta `/api/v1/ext/datasets/:code/rows`.
- **Equivalencia ProCoop:** `TABLAS_POWERBI` + `PERFILES_TABLAS`.

### PAN-BIA-19 — Auditoría de accesos a reportes

- **App / ruta / capability:** admin · `/admin/reportes/auditoria` · `bia.auditoria.ver`.
- **Columnas:** fecha, usuario o cliente API, acción (`view`/`export`/`download`/`unmask`/`apiRead`), reporte, filas, contiene datos personales, IP.
- **Filtros:** usuario, reporte, acción, rango, entidad jurídica (`dict:org.entidadJuridica`, con la opción "sin entidad"; solo con más de una entidad y dentro del alcance; DEC-096, RF-BIA-104). Exportable (y esa exportación también se audita).
- **Equivalencia ProCoop:** `INFO_AUD`.

### PAN-BIA-20 — Benchmark entre cooperativas

- **App / ruta / capability:** admin · `/admin/bi/benchmark` · `bia.benchmark.ver`; adhesión con `bia.benchmark.configurar` (O11, si PA-BIA-05 = A).
- **Layout:** estado de adhesión y segmento declarado; tabla de indicadores benchmarkables con valor propio, percentil, p25, mediana, p75 y n del segmento; celdas suprimidas con "muestra insuficiente".
- **Acciones:** adherir (consentimiento explícito), retirarse, cambiar segmento.

### PAN-BIA-21 — Datos abiertos

- **App / ruta / capability:** admin · `/admin/bi/datos-abiertos` · `bia.datosAbiertos.publicar` (O11, si PA-BIA-10 = A).
- **Layout:** publicaciones (dataset, slug, licencia, refresco, estado, última versión); editor con dimensiones permitidas, mínimo de celda y vista previa con celdas suprimidas resaltadas.
- **Acciones:** aprobar, publicar, retirar, ver en landing.

### PAN-BIA-22 — Catálogo regulatorio

- **App / ruta / capability:** admin · `/admin/reportes/regulatorios` · `bia.reportes.ver` + capability del reporte regulatorio.
- **Layout:** calendario y tabla por organismo y servicio: informe, período, vencimiento, estado de presentación (dato del módulo dueño), último archivo generado, acuse.
- **Acciones:** abrir el reporte regulatorio (PAN-BIA-02 con salida `layout`), ir a la presentación en el módulo dueño.
- **Equivalencia ProCoop:** exportadores regulatorios de `clsInformes_*` y ProMod (ver §15.5).

### PAN-BIA-23 — Monitoreo de BI y API (plataforma)

- **App / ruta / capability:** plataforma · `/admin/platform/bia` (`meta.platformOnly`) · `pla.bia.api.monitorear`, `pla.bia.catalogo.administrar`, `pla.bia.benchmark.administrar`.
- **Layout:** pestañas Uso de API (agregados por tenant, sin datos de negocio), Frescura y reconciliación del almacén analítico por tenant/dataset, Reconstrucciones en curso, Catálogo de sistema (versiones publicadas de reportes, indicadores y plantillas compartidas), Segmentos de benchmark.
- **Nota:** el tablero de plataforma GOB-001 es PAN-PLA-01 (T01) y usa el motor de indicadores de BIA (CTR-BIA-03).

### PAN-BIA-24 — Portal para desarrolladores

- **App / ruta / capability:** landing de plataforma · `/developers` (público: guía, autenticación, paginación, errores, webhooks, changelog y OpenAPI genérico con ejemplos ficticios) y `/developers/:tenantSlug` (OpenAPI del tenant, requiere token del cliente) · sin login para la parte pública.
- **Contenido:** inicio rápido con `curl`, verificación de firma de webhooks en Node.js/Python/C#, tabla de problemas RFC 9457, límites, política de versiones y deprecación, sandbox (RF-BIA-085).

### PAN-BIA-25 — Tablero móvil (PWA empleado)

- **App / ruta / capability:** pwa-empleado · `/app/tablero` · `bia.tableros.ver`.
- **Layout:** cards KPI con anatomía fija (título, valor en Plex Mono, variación, semáforo, frescura), lista de alertas propias; tocar una card abre el detalle en modo lectura; sin exportación ni edición (RF-BIA-057).

### 10.1 Cobertura de formularios ProCoop

| Formulario / clase ProCoop (INV) | Pantalla CoopApps |
|---|---|
| `Configuracion/frmEditorReportes` | PAN-BIA-09 |
| `Configuracion/frmListadosPersonalizados`, `frmListadosPersonalizados_Parametros` | PAN-BIA-09 (sin SP ni SQL) |
| `Configuracion/abm_Reportes` | PAN-BIA-07 |
| `Configuracion/frmInformeSimple`, `frmConsultaGenerica` | PAN-BIA-02 |
| `Configuracion/frmExportacionArchivos`, `TiposArchivosExportacion` | PAN-BIA-08 |
| `Configuracion/frmResultadoExportacion` | PAN-BIA-04 |
| `Configuracion/Grilla_OT_Reporte` | PAN-BIA-07 (plantilla de REP-TEC-023) |
| `ProcoopNet/frmInformes` | PAN-BIA-01 + PAN-BIA-02 |
| `frmInformes_Preview` (vista previa, marcar registros) | PAN-BIA-02 |
| Tablero de Control (`clsTablero`) | PAN-BIA-10, PAN-BIA-11, PAN-BIA-13 |
| Formularios de informes de cada ProMod (`frmInformesTecnica`, `frmInformesConsumos`, `frmInformesFactibilidad`, `frmInformes_Redes`, `frmMovimientoConcepto`, `frmDiferenciaConceptos`, `frmDiferenciasCuentas`, `frmPadronTitulares`, `frmCirculares`, `frmInformeAnticiposAUnaFecha`, `frmMayor`, `frmSumasySaldos`, `frmImpresiones`, `frmImprimirHojasRubricar`, `frmConsultar_Vales` y demás listados) | PAN-BIA-02 con el REP correspondiente del §15.4 |
| Editor de Reportes de DevExpress (`.repx` en `Reportes`/`Reportes_Empresa`) | PAN-BIA-07 (plantillas HTML→PDF) |
| Configuración Power BI (`TABLAS_POWERBI`) | PAN-BIA-18 |
| Integra (`WS_KEYS`, API local) | PAN-BIA-15, PAN-BIA-16, PAN-BIA-17, PAN-BIA-24 |

## 11. API

Convenciones (guía §5): paginación `?page=&size=` → `{ items, total, page, size }`; errores RFC 9457 con `requestId`; validación Zod compartida con el frontend; `Idempotency-Key` en toda operación que crea corridas, exportaciones, credenciales o solicitudes. Todas las rutas admin exigen además la capability del reporte o recurso involucrado y aplican alcance.

### 11.1 API interna (admin, PWA, plataforma, pública)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-BIA-01 | GET | `/api/admin/bia/reports` | `bia.reportes.ver` | Catálogo filtrado por permisos; `?q=&module=&cluster=&origin=&favorite=` | Sí (lectura) |
| API-BIA-02 | GET | `/api/admin/bia/reports/:code` | `bia.reportes.ver` | Ficha: parámetros (esquema JSON derivado de Zod), columnas, salidas, ayuda, versión | Sí |
| API-BIA-03 | POST | `/api/admin/bia/reports/:code/runs` | `bia.reportes.ejecutar` + del reporte | Ejecuta; 200 con primera página (sync) o 202 con `runId` (async) | Sí (`Idempotency-Key`) |
| API-BIA-04 | GET | `/api/admin/bia/runs` | `bia.reportes.ver` | Mis corridas (todas con `bia.exportaciones.administrar`) | Sí |
| API-BIA-05 | GET | `/api/admin/bia/runs/:id` | `bia.reportes.ver` (corridas propias; las de otros usuarios con `bia.exportaciones.administrar`) (antes "ídem") | Estado, progreso, metadatos, totales | Sí |
| API-BIA-06 | GET | `/api/admin/bia/runs/:id/rows` | `bia.reportes.ver` (además `requiredCapabilities[]` del reporte de la corrida; antes "`requiredCapabilities[]` del reporte de la corrida") | Página del resultado `?page=&size=&sort=&groupBy=` | Sí |
| API-BIA-07 | GET | `/api/admin/bia/runs/:id/drill` | `bia.reportes.ver` (además `detailCapability` del indicador o reporte, del módulo dueño del detalle; antes "`detailCapability` del indicador o reporte") | Filas componentes de un total/celda `?cell=` | Sí |
| API-BIA-08 | POST | `/api/admin/bia/runs/:id/cancel` | `bia.reportes.ejecutar` (solo el solicitante) o `bia.exportaciones.administrar` (antes "solicitante o administrador") | Cancela | Sí |
| API-BIA-09 | POST | `/api/admin/bia/runs/:id/retry` | `bia.reportes.ejecutar` (solo el solicitante) o `bia.exportaciones.administrar` (antes "ídem") | Crea corrida nueva con mismos parámetros | Sí (`Idempotency-Key`) |
| API-BIA-10 | POST | `/api/admin/bia/runs/:id/selection` | `bia.reportes.ver` (además `requiredCapabilities[]` del reporte de la corrida; antes "`requiredCapabilities[]` del reporte de la corrida") | Genera `selectionToken` con IDs seleccionados para el módulo dueño | Sí |
| API-BIA-11 | POST | `/api/admin/bia/runs/:id/exports` | `bia.reportes.exportar` + `exportCapabilities` | Exporta `{format, csvDialect, layoutId, columns}` | Sí (`Idempotency-Key`) |
| API-BIA-12 | POST | `/api/admin/bia/table-exports` | `bia.exportaciones.crear` (además `<mod>.<recurso>.exportar` de la grilla; antes "`<mod>.<recurso>.exportar`") | Exporta una grilla `{screenKey, filters, columns, format}` re-ejecutando su consulta | Sí (`Idempotency-Key`) |
| API-BIA-13 | GET | `/api/admin/bia/exports` | `bia.exportaciones.ver` | Mis exportaciones | Sí |
| API-BIA-14 | GET | `/api/admin/bia/exports/:id/download` | `bia.exportaciones.ver` (solo el solicitante) + revalida `exportCapabilities[]` del origen al descargar (antes "revalida") | 302 a URL firmada de `PRM-BIA-007` min; registra descarga | Sí |
| API-BIA-15 | POST | `/api/admin/bia/exports/:id/cancel` | `bia.exportaciones.ver` (solo el solicitante) o `bia.exportaciones.administrar` (antes "solicitante o administrador") | Cancela | Sí |
| API-BIA-16 | GET/POST/PATCH/DELETE | `/api/admin/bia/presets[/:id]` | `bia.reportes.ver`; compartir `bia.presets.compartir` | Presets | POST sí (`Idempotency-Key`) |
| API-BIA-17 | GET/POST/PATCH/DELETE | `/api/admin/bia/saved-views[/:id]` | `bia.reportes.ver` (o permiso de la pantalla) | Vistas guardadas de `DataTable` `?screenKey=` | POST sí |
| API-BIA-18 | GET/POST/PATCH | `/api/admin/bia/schedules[/:id]` | `bia.reportes.programar` | Programaciones | POST sí |
| API-BIA-19 | POST | `/api/admin/bia/schedules/:id/{pause,resume,run-now,disable}` | `bia.reportes.programar` (solo el propietario) o `bia.exportaciones.administrar` (antes "propietario o administrador") | Transiciones §8.4 | Sí |
| API-BIA-20 | GET | `/api/admin/bia/schedules/:id/deliveries` | `bia.reportes.programar` (solo el propietario) o `bia.exportaciones.administrar` (antes "propietario o administrador") | Historial de entregas | Sí |
| API-BIA-21 | GET/PATCH | `/api/admin/bia/report-settings/:code` | `bia.reportes.configurar` | Ocultar, renombrar, plantilla y preset por defecto | Sí |
| API-BIA-22 | GET/POST/PATCH | `/api/admin/bia/templates[/:id]` | `bia.reportes.configurar` | Plantillas PDF; `POST /:id/preview` con datos ficticios | Sí |
| API-BIA-23 | GET/POST/PATCH | `/api/admin/bia/export-layouts[/:id]` | `bia.reportes.configurar` | Layouts de archivo | POST sí |
| API-BIA-24 | POST | `/api/admin/bia/export-layouts/:id/{preview,validate,activate,archive}` | `bia.reportes.configurar` (antes "ídem") | Vista previa (20 filas), validación y estados | Sí |
| API-BIA-25 | GET/POST/PATCH | `/api/admin/bia/custom-reports[/:id]` | `bia.disenador.usar` | Reportes personalizados (O11) | POST sí |
| API-BIA-26 | POST | `/api/admin/bia/custom-reports/:id/{preview,submit,approve,reject,deprecate}` | `bia.disenador.usar` / `bia.disenador.publicar` | Ciclo §8.1 | Sí |
| API-BIA-27 | GET | `/api/admin/bia/indicators[/:code]` | `bia.indicadores.ver` | Catálogo y ficha de indicadores | Sí |
| API-BIA-28 | GET | `/api/admin/bia/indicators/:code/values` | `bia.tableros.ver` | Valor actual y serie `?period=&from=&to=&dims=` | Sí |
| API-BIA-29 | PATCH | `/api/admin/bia/indicators/:code/targets` | `bia.cubos.certificar` (antes `bia.indicadores.certificar`) | Óptimo, umbral, objetivo del tenant | Sí |
| API-BIA-30 | POST | `/api/admin/bia/indicators/:code/{propose-version,certify,deprecate}` | `bia.cubos.certificar` (antes `bia.indicadores.certificar`) | Versionado §8.5 | Sí |
| API-BIA-31 | GET/POST/PATCH | `/api/admin/bia/dashboards[/:code]` | ver `bia.tableros.ver`; editar `bia.tableros.disenar` | Tableros; GET con valores ya calculados | POST sí |
| API-BIA-32 | PUT | `/api/admin/bia/dashboards/:code/prefs` | `bia.tableros.ver` | Preferencias personales | Sí |
| API-BIA-33 | GET/POST/PATCH | `/api/admin/bia/alert-rules[/:id]` | `bia.alertas.configurar` | Reglas; `POST /:id/simulate` | POST sí |
| API-BIA-34 | GET | `/api/admin/bia/alerts` | `bia.alertas.gestionar` | Bandeja | Sí |
| API-BIA-35 | POST | `/api/admin/bia/alerts/:id/{acknowledge,resolve,mute}` | `bia.alertas.gestionar` | Transiciones §8.9 | Sí |
| API-BIA-36 | GET/PATCH | `/api/admin/bia/datasets[/:code]` | `bia.datasets.ver` / `bia.datasets.configurar` | Datasets semánticos y exposición | Sí |
| API-BIA-37 | GET | `/api/admin/bia/rooms/:room/summary` | `bia.bi.ver` | Zona A de la sala | Sí |
| API-BIA-38 | GET | `/api/admin/bia/rooms/:room/items` | `bia.bi.ver` | Zona B paginada | Sí |
| API-BIA-39 | POST | `/api/admin/bia/rooms/:room/export` | `bia.bi.ver` + `bia.reportes.exportar` | `export.xlsx` de la sala | Sí (`Idempotency-Key`) |
| API-BIA-40 | POST | `/api/admin/bia/rooms/:room/analyze-auto` | `bia.ia.consultar` (antes `bia.ia.preguntar`) | Análisis automático (cacheado) | Sí |
| API-BIA-41 | POST | `/api/admin/bia/rooms/:room/ask` | `bia.ia.consultar` (antes `bia.ia.preguntar`) | Pregunta en lenguaje natural → respuesta con citas | No (cada pregunta se registra) |
| API-BIA-42 | POST | `/api/admin/bia/ai-questions/:id/feedback` | `bia.ia.consultar` (antes `bia.ia.preguntar`) (solo el autor de la pregunta) (antes "autor") | Valoración | Sí |
| API-BIA-43 | POST | `/api/admin/bia/rooms/:room/schedule` | `bia.reportes.programar` | Programar envío de la sala | Sí |
| API-BIA-44 | GET/POST/PATCH | `/api/admin/bia/api-clients[/:id]` | `bia.api.clientes.ver` / `bia.api.clientes.crear` | Perfil de datos del cliente (finalidad, scopes, restricciones, límites) | POST sí |
| API-BIA-45 | POST | `/api/admin/bia/api-clients/:id/{approve,reject,suspend,reactivate,revoke}` | `bia.api.clientes.aprobar` + step-up | Transiciones §8.6 | Sí |
| API-BIA-46 | POST | `/api/admin/bia/api-clients/:id/credentials[/:credId/{rotate,revoke}]` | `bia.api.credenciales.rotar` + step-up | Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez | Sí (`Idempotency-Key`) |
| API-BIA-47 | GET | `/api/admin/bia/api-usage` | `bia.api.uso.ver` | Uso agregado y errores | Sí |
| API-BIA-48 | GET/POST/PATCH/DELETE | `/api/admin/bia/webhook-subscriptions[/:id]` | `bia.api.webhooks.configurar` | Suscripciones (alta en nombre de un cliente) | POST sí |
| API-BIA-49 | GET | `/api/admin/bia/webhook-deliveries` | `bia.api.webhooks.configurar` | Entregas | Sí |
| API-BIA-50 | POST | `/api/admin/bia/webhook-deliveries/{:id/redeliver,redeliver-bulk}` | `bia.api.webhooks.configurar` | Reenvío | Sí (por `deliveryId+attempt`) |
| API-BIA-51 | GET | `/api/admin/bia/access-logs` | `bia.auditoria.ver` | Auditoría de accesos a reportes | Sí |
| API-BIA-52 | GET/POST/PATCH | `/api/admin/bia/open-data[/:id]` | `bia.datosAbiertos.publicar` | Publicaciones | POST sí |
| API-BIA-53 | POST | `/api/admin/bia/open-data/:id/{preview,approve,publish,withdraw}` | `bia.datosAbiertos.publicar` | Ciclo §8.10 | Sí |
| API-BIA-54 | GET/PUT | `/api/admin/bia/benchmark/participation` | `bia.benchmark.configurar` | Adhesión y segmento | Sí |
| API-BIA-55 | GET | `/api/admin/bia/benchmark/results` | `bia.benchmark.ver` | Percentiles del tenant | Sí |
| API-BIA-56 | GET | `/api/admin/bia/regulatory-catalog` | `bia.reportes.ver` | Catálogo regulatorio con vencimientos y estado | Sí |
| API-BIA-57 | GET | `/api/bia/my-dashboard` | `bia.tableros.ver` | Tablero móvil (PWA empleado) | Sí |
| API-BIA-58 | GET | `/api/platform/bia/dashboard` | `pla.bia.tablero.ver` | Indicadores globales GOB-001 (consumido por PAN-PLA-01) | Sí |
| API-BIA-59 | GET | `/api/platform/bia/api-usage` | `pla.bia.api.monitorear` | Uso de API por tenant (agregado) | Sí |
| API-BIA-60 | GET | `/api/platform/bia/analytics-health` | `pla.bia.api.monitorear` | Frescura, reconciliación, proyecciones | Sí |
| API-BIA-61 | POST | `/api/platform/bia/projections/:domain/rebuild` | `pla.bia.catalogo.administrar` + step-up | Reconstrucción por tenant (JOB-BIA-12) | Sí (`Idempotency-Key`) |
| API-BIA-62 | POST | `/api/platform/bia/system-catalog/{reports,indicators,templates}/:code/publish` | `pla.bia.catalogo.administrar` | Publicar versión de sistema | Sí |
| API-BIA-63 | GET/PATCH | `/api/platform/bia/benchmark/segments` | `pla.bia.benchmark.administrar` | Segmentos y mínimos | Sí |
| API-BIA-64 | GET | `/api/public/:tenantSlug/open-data` | `public: true` (antes "público") | Lista de datasets abiertos publicados | Sí |
| API-BIA-65 | GET | `/api/public/:tenantSlug/open-data/:slug[/:version].{csv,json}` | `public: true` (antes "público") | Descarga de una versión | Sí |

### 11.2 API pública para terceros `/api/v1/ext`

#### 11.2.1 Autenticación

| Mecanismo | Uso | Detalle |
|---|---|---|
| OAuth 2.0 client credentials (RFC 6749 §4.4) | Integraciones servidor a servidor (opción por defecto) | `POST /api/v1/ext/oauth/token` (endpoint **API-IAM-48** de T02) con `client_id` (`gac_…`) y `client_secret` por `Authorization: Basic` o cuerpo; `scope` opcional ⊆ scopes del cliente. Respuesta `{ access_token, token_type: "Bearer", expires_in: PRM-BIA-040 × 60, scope }`. Token JWT firmado (ES256, `kid` rotado; claims `iss`, `aud=goodapps-ext`, `tid`, `cid`, `scp`, `exp`, `iat`, `jti`) o token opaco con introspección según PA-BIA-02. Sin refresh token. |
| API key | Herramientas de BI de solo lectura (Power BI, Excel, Looker Studio) que no soportan OAuth | `Authorization: ApiKey gak_<prefijo>_<secreto>`; solo scopes `*:read`, `metrics:read`, `datasets:read`; nunca `pii:read`, `requests:write`, `webhooks:manage`, `exports:write` (RN-BIA-031). |
| Acceso delegado por usuario (authorization code + PKCE) | Apps de terceros que actúan en nombre de un usuario del tenant | `A validar (PA-BIA-16)`: no se habilita en la primera versión; los tokens se diseñan con claim `sub` opcional para habilitarlo sin romper compatibilidad (BASE §59 "diferenciar"; RF-IAM-114). |

Reglas: tenant resuelto **solo** desde la credencial (RN-BIA-029); HTTPS TLS 1.2+ obligatorio; IP allowlist opcional por cliente; revocación efectiva ≤ `PRM-BIA-043` s; credenciales con vencimiento `PRM-BIA-041` días y aviso 15/7/1 días antes (JOB-BIA-16).

#### 11.2.2 Rate limit y cuotas

- Token bucket en Redis por **cliente** (`PRM-BIA-053`: por minuto y ráfaga) y por **tenant** (suma de clientes, `PRM-BIA-055`), más cuota **diaria** por cliente (`PRM-BIA-054`); los valores por defecto dependen del plan comercial (T01, `apiQuota.*`) y el tenant solo puede bajarlos.
- Cabeceras en toda respuesta: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (draft IETF RateLimit headers) y `X-Daily-Quota-Remaining`.
- Exceso: `429` `application/problem+json` tipo `rate-limited` con `Retry-After` (segundos).
- Peso por endpoint: listados = 1, `datasets/:code/rows` = 2, PDF de comprobante = 5, `POST /exports` = 20.
- Exportaciones masivas concurrentes por cliente: 2; por tenant: 5.
- Pool de ejecución separado `ext` (workers y lectura en secundario/miembro `analytics`) para no afectar facturación ni atención (RF-BIA-075).

#### 11.2.3 Versionado y ciclo de vida

- Versión mayor en la URI (`/api/v1/ext`). Dentro de `v1` solo cambios aditivos: campos nuevos opcionales, nuevos recursos, nuevos valores de enum **documentados como extensibles** (el cliente debe tolerar valores desconocidos).
- Cambios incompatibles → `v2` en paralelo; `v1` se mantiene al menos `PRM-BIA-045` meses tras el anuncio, con cabeceras `Deprecation: @<unix>` y `Sunset: <fecha HTTP>` (RFC 8594/RFC 9745) y `Link: <…/changelog>; rel="deprecation"`.
- Cada respuesta incluye `CoopApps-Api-Version: 1.<minor>` (minor = versión del contrato OpenAPI) y el changelog público lista cada minor.
- Recursos en vista previa se publican bajo `/api/v1/ext/preview/...` sin garantía de compatibilidad.

#### 11.2.4 OpenAPI y documentación

- OpenAPI 3.1 generado en build desde los esquemas Zod (`zod-to-openapi`) con ejemplos ficticios (TEN-001, CLI-BI-A); validado en CI con linter (Spectral) y con prueba de contrato (cada respuesta real valida contra el esquema).
- `GET /api/v1/ext/openapi.json` (API-BIA-71) devuelve la especificación **filtrada** a los recursos licenciados del tenant y a los scopes del cliente; versión genérica pública en el portal (PAN-BIA-24).
- Cada campo documenta: tipo, nulabilidad, unidad, moneda, zona horaria, significado de negocio (contrato semántico §15.1), si es sensible y qué scope lo habilita.
- Problemas (`type`) documentados con URI estable `https://developers.goodapps.coop/problems/<tipo>`: `invalid-token`, `expired-token`, `insufficient-scope`, `ip-not-allowed`, `rate-limited`, `quota-exceeded`, `tenant-suspended`, `client-suspended`, `not-found`, `validation-error`, `conflict`, `idempotency-conflict`, `deprecated`, `gone`, `export-expired`, `internal-error`.

#### 11.2.5 Convenciones de datos

- Campos en inglés camelCase estables (RN-BIA-032); importes como **string decimal** con `currency` (`"amount": "13000.00", "currency": "ARS"`); fechas-hora ISO 8601 UTC (`2026-11-03T15:00:00Z`) y fechas de negocio `YYYY-MM-DD` interpretadas en `timeZone` del tenant (incluida en `GET /me`).
- Listados: `?page=&size=` (`size` ≤ `PRM-BIA-056`) → `{ items, total, page, size, asOf, source }`; incremental: `?updatedSince=&cursor=` → `{ items, nextCursor, asOf, source }` sin `total` (RN-BIA-033).
- Filtros comunes: `status`, `serviceCode`, `branchCode`, `from`/`to` con `dateField` declarado por recurso; `fields=` para proyección (minimización); `expand=` solo para relaciones documentadas.
- Identificadores: `id` opaco (ObjectId) + código de negocio (`accountNumber`, `invoiceNumber` con PV y letra); nunca IDs de ProCoop salvo `legacy.displayKey` (clave visible del subdocumento `legacy` de T05 §19.1) cuando el tenant lo habilita (PRM-BIA-070).
- Bajas y anulaciones visibles como cambios de `status`; borrados lógicos como `{ id, deleted: true, deletedAt }`.
- Campos sensibles (documento, CUIT de persona humana, teléfono, email, CBU, domicilio exacto) enmascarados salvo `pii:read`; `fieldRestrictions` del cliente se aplica después del scope.

#### 11.2.6 Catálogo de recursos y endpoints externos

Todos `GET` salvo indicación; todos aplican `dataScope` del cliente y responden 404 ante IDs de otro tenant. "Inc." = admite modo incremental. "Prov." = módulo que provee el read-model.

| API-ID | Método | Ruta (`/api/v1/ext` +) | Scope | Prov. | Contenido principal | Inc. | Ola | Idempotente |
|---|---|---|---|---|---|---|---|---|
| API-BIA-70 | GET | `/me` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | BIA | Cliente, tenant (`slug`, `timeZone`, `currency`), scopes efectivos, cuotas restantes | — | O11 | Sí |
| API-BIA-71 | GET | `/openapi.json` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | BIA | OpenAPI filtrado | — | O11 | Sí |
| API-BIA-72 | GET | `/meta/labels` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | T03 | Etiquetas del diccionario del tenant por `fieldKey` y enum (sin renombrar campos) | — | O11 | Sí |
| API-BIA-73 | GET | `/meta/enums` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | BIA | Enums con valores y significado | — | O11 | Sí |
| API-BIA-74 | GET | `/meta/resources` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | BIA | Inventario de recursos y campos disponibles para el cliente (RF-BIA-087) | — | O11 | Sí |
| API-BIA-75 | GET | `/persons` | `persons:read` | PER | Personas/titulares: id, tipo, nombre (o razón social), condición IVA, estado, documento enmascarado | Sí | O11 | Sí |
| API-BIA-76 | GET | `/persons/:id` | `persons:read` | PER | Detalle con relaciones (titular de cuentas, asociado) | — | O11 | Sí |
| API-BIA-77 | GET | `/accounts` | `accounts:read` | PER | Cuentas: número, titular, sucursal, zona, estado, grupo de facturación | Sí | O11 | Sí |
| API-BIA-78 | GET | `/accounts/:id` | `accounts:read` | PER | Detalle con domicilios de servicio y contratos | — | O11 | Sí |
| API-BIA-79 | GET | `/accounts/:id/balance` | `ledger:read` | COB | Saldo total, vencido, a vencer, saldo a favor, en proceso, por servicio, `asOf` (RF-BIA-095) | — | O11 | Sí |
| API-BIA-80 | GET | `/accounts/:id/ledger-entries` | `ledger:read` | COB | Movimientos del auxiliar con fecha efectiva y de registro | Sí | O11 | Sí |
| API-BIA-81 | GET | `/premises` | `accounts:read` | PER | Inmuebles y puntos de prestación (localidad, barrio, coordenadas redondeadas salvo `pii:read`) | Sí | O11 | Sí |
| API-BIA-82 | GET | `/contracts` | `contracts:read` | CAT | Servicios contratados/conexiones: servicio, plan, categoría, estado canónico, alta/baja, medido, prepago | Sí | O11 | Sí |
| API-BIA-83 | GET | `/contracts/:id` | `contracts:read` | CAT | Detalle con historial de estados y equipos en comodato (sin series si no `erp.catalog:read`) | — | O11 | Sí |
| API-BIA-84 | GET | `/catalog/services` | `contracts:read` | CAT | Servicios habilitados del tenant | Sí | O11 | Sí |
| API-BIA-85 | GET | `/catalog/plans` | `contracts:read` | CAT | Planes y versiones vigentes | Sí | O11 | Sí |
| API-BIA-86 | GET | `/catalog/categories` | `contracts:read` | CAT | Categorías tarifarias | Sí | O11 | Sí |
| API-BIA-87 | GET | `/catalog/tariffs` | `contracts:read` | TAR | Cuadros tarifarios vigentes a fecha `?at=` (datos públicos de REP-TAR-001) | Sí | O11 | Sí |
| API-BIA-88 | GET | `/meters` | `consumption:read` | MED | Medidores: número, tipo, estado, punto, telemedido | Sí | O11 | Sí |
| API-BIA-89 | GET | `/readings` | `consumption:read` | MED | Lecturas validadas por período | Sí | O11 | Sí |
| API-BIA-90 | GET | `/consumptions` | `consumption:read` | MED | Consumos aprobados: período, cantidad, unidad, estimado, canal | Sí | O11 | Sí |
| API-BIA-91 | GET | `/invoices` | `billing:read` | FAC | Comprobantes: tipo, letra, PV, número, fechas, cuenta, totales, estado, CAE | Sí | O11 | Sí |
| API-BIA-92 | GET | `/invoices/:id` | `billing:read` | FAC | Detalle con líneas, impuestos, vencimientos, imputaciones resumidas | — | O11 | Sí |
| API-BIA-93 | GET | `/invoices/:id/pdf` | `billing:read` | FAC | 302 a URL firmada del PDF (peso 5) | — | O11 | Sí |
| API-BIA-94 | GET | `/payments` | `collections:read` | COB | Pagos confirmados: canal, ente, fechas de pago/confirmación/acreditación, importe, estado | Sí | O11 | Sí |
| API-BIA-95 | GET | `/allocations` | `collections:read` | COB | Imputaciones pago ↔ obligación | Sí | O11 | Sí |
| API-BIA-96 | GET | `/payment-channels` | `collections:read` | COB | Canales y entes habilitados | — | O11 | Sí |
| API-BIA-97 | GET | `/aging` | `ledger:read` | COB | Antigüedad de saldos por cuenta y servicio a `?asOf=` (tramos de REP-COB-002) | — | O11 | Sí |
| API-BIA-98 | GET | `/arrears-cases` | `arrears:read` | MOR | Notificaciones e instancias de mora por cuenta | Sí | O11 | Sí |
| API-BIA-99 | GET | `/agreements` | `arrears:read` | MOR | Convenios y cuotas | Sí | O11 | Sí |
| API-BIA-100 | GET | `/interruptions` | `arrears:read` | MOR | Casos de suspensión/corte/reconexión (estado, fechas) | Sí | O11 | Sí |
| API-BIA-101 | GET | `/tickets` | `crm:read` | CRM | Solicitudes, reclamos y tickets: tipo, canal, área, prioridad, estado, SLA, tiempos (sin notas internas ni adjuntos) | Sí | O11 | Sí |
| API-BIA-102 | GET | `/tickets/:id` | `crm:read` | CRM | Detalle con historial de estados públicos | — | O11 | Sí |
| API-BIA-103 | GET | `/work-orders` | `field:read` | TEC | Órdenes de trabajo y visitas: tipo, operación, cuadrilla, fechas, resultado | Sí | O11 | Sí |
| API-BIA-104 | GET | `/appointments` | `field:read` | TEC/CRM | Turnos de agenda técnica y del turnero | Sí | O11 | Sí |
| API-BIA-105 | GET | `/products` | `erp.catalog:read` | STK | Productos/artículos y precios públicos | Sí | O11 | Sí |
| API-BIA-106 | GET | `/stock` | `erp.catalog:read` | STK | Existencias por depósito (reemplaza `WS_KEYS.DEPOSITO_INSUMO/PRODUCTO` → `dataScope.warehouseIds`) | Sí | O11 | Sí |
| API-BIA-107 | GET | `/suppliers` | `erp.catalog:read` | CMP | Proveedores (datos públicos: razón social, CUIT, rubro) | Sí | O11 | Sí |
| API-BIA-108 | GET | `/purchases` | `erp.finance:read` | CMP | Documentos de compra (OC, recepciones, facturas) agregados | Sí | O11 | Sí |
| API-BIA-109 | GET | `/treasury/summary` | `erp.finance:read` | TES | Disponibilidades, cartera y flujo agregados a `?asOf=` | — | O11 | Sí |
| API-BIA-110 | GET | `/gl-accounts` | `accounting:read` | CON | Plan de cuentas (operativo y alternativos) | Sí | O11 | Sí |
| API-BIA-111 | GET | `/journal-entries` | `accounting:read` | CON | Asientos `posted` con renglones | Sí | O11 | Sí |
| API-BIA-112 | GET | `/trial-balance` | `accounting:read` | CON | Sumas y saldos por ejercicio/rango/plan (REP-CON-004) | — | O11 | Sí |
| API-BIA-113 | GET | `/members` | `institutional:read` | INS | Asociados: entidad jurídica (`legalEntityCode`; filtro `?legalEntityCode=`, DEC-096, RF-BIA-104), número (único dentro de la entidad), estado, ingreso/egreso, categoría; una fila por membresía | Sí | O11 | Sí |
| API-BIA-114 | GET | `/capital-summary` | `institutional:read` | INS | Resumen de capital social a `?asOf=` (REP-INS-005) | — | O11 | Sí |
| API-BIA-115 | GET | `/assemblies` | `institutional:read` | INS | Asambleas, quórum y resultados agregados (sin votos individuales) | Sí | O11 | Sí |
| API-BIA-116 | GET | `/payroll/summary` | `payroll:read` | SUE | Costo laboral y dotación agregados por centro y período (nunca individuales) | — | O11 | Sí — `A validar (PA-BIA-14)` |
| API-BIA-117 | GET | `/metrics` | `metrics:read` | BIA | Catálogo de indicadores certificados con definición | — | O11 | Sí |
| API-BIA-118 | GET | `/metrics/:code/values` | `metrics:read` | BIA | Valores/snapshots `?period=&from=&to=&dims=` | Sí | O11 | Sí |
| API-BIA-119 | GET | `/datasets` | `datasets:read` | BIA | Datasets expuestos a API con diccionario | — | O11 | Sí |
| API-BIA-120 | GET | `/datasets/:code/rows` | `datasets:read` (+ scope de dominio del dataset) | BIA | Filas del dataset (feed para Power BI/Excel, peso 2); `?format=json|csv` | Sí | O11 | Sí |
| API-BIA-121 | POST | `/exports` | `exports:write` + scope del recurso | BIA | Crea exportación masiva `{ resource|datasetCode, filters, format: ndjson|csv|parquet, asOf }` → 202 | — | O11 | Sí (`Idempotency-Key` obligatorio) |
| API-BIA-122 | GET | `/exports/:id` | `exports:write` | BIA | Estado, partes, checksums, vencimiento | — | O11 | Sí |
| API-BIA-123 | GET | `/exports/:id/parts/:n` | `exports:write` | BIA | 302 a URL firmada de la parte | — | O11 | Sí |
| API-BIA-124 | GET/POST | `/webhooks/subscriptions` | `webhooks:manage` | BIA | Listar/crear suscripciones propias (secreto devuelto una vez) | — | O11 | POST sí (`Idempotency-Key`) |
| API-BIA-125 | PATCH/DELETE | `/webhooks/subscriptions/:id` | `webhooks:manage` | BIA | Pausar, reanudar, cambiar eventos/URL, rotar secreto, eliminar | — | O11 | Sí |
| API-BIA-126 | POST | `/webhooks/subscriptions/:id/test` | `webhooks:manage` | BIA | Envía evento `ping` firmado | — | O11 | Sí |
| API-BIA-127 | GET | `/webhooks/deliveries` | `webhooks:manage` | BIA | Entregas propias y estado | — | O11 | Sí |
| API-BIA-128 | POST | `/webhooks/deliveries/:id/redeliver` | `webhooks:manage` | BIA | Reenvío de una entrega `dead` o fallida | — | O11 | Sí |
| API-BIA-129 | GET | `/webhooks/event-types` | `bia.apis.consumir` (cualquier scope; antes "(cualquiera)") | BIA | Catálogo de eventos públicos (§12.3) con esquema | — | O11 | Sí |
| API-BIA-130 | POST | `/requests/persons` | `requests:write` | CRM→PER | Solicitud de alta/modificación de persona (la procesa CRM con su circuito) → 202 con `requestId` | — | O11 | Sí (`Idempotency-Key` obligatorio) — `A validar (PA-BIA-03)` |
| API-BIA-131 | POST | `/requests/accounts` | `requests:write` | CRM→PER/CAT | Solicitud de alta de cuenta/servicio (ex `RegistrarCuenta`, `PutCategoria`) | — | O11 | Ídem |
| API-BIA-132 | POST | `/requests/tickets` | `requests:write` | CRM | Alta de reclamo o consulta (canal `api`) | — | O11 | Ídem |
| API-BIA-133 | GET | `/requests/:id` | `requests:write` | CRM | Estado de la solicitud (`received`, `inReview`, `accepted`, `rejected`, `processed`) con resultado | — | O11 | Sí |

Fuera de este catálogo: el canal del agente local (`/api/v1/ext/agents/*`, API-INT-47/48) es de **T06** y usa identidad de dispositivo, no clientes de API; el token (`/oauth/token`) es **API-IAM-48** de T02.

## 12. Eventos y jobs

### 12.1 Eventos emitidos

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-BIA-01 | `bia.report.published` | Publicación de versión de un reporte de sistema o personalizado | Programaciones (avisan cambio de versión), T02 (catálogo de pantallas) |
| EVT-BIA-02 | `bia.report.deprecated` | Reporte deprecado | Propietarios de programaciones |
| EVT-BIA-03 | `bia.reportRun.completed` | Corrida `succeeded` | Notificación in-app (T09), programador |
| EVT-BIA-04 | `bia.reportRun.failed` | Corrida `failed` | Notificación, bandeja técnica T01 si `retriable=false` repetido |
| EVT-BIA-05 | `bia.export.ready` | Exportación `ready` | T09 (in-app/email con enlace) |
| EVT-BIA-06 | `bia.export.downloaded` | Descarga con datos personales | T02 (`auditReads.category=export`) |
| EVT-BIA-07 | `bia.schedule.suspended` | Programación suspendida por fallos o permisos | Propietario y administrador (T09) |
| EVT-BIA-08 | `bia.indicator.certified` | Versión certificada | Tableros (refrescan definición) |
| EVT-BIA-09 | `bia.kpiAlert.opened` | Alerta abierta o reabierta | T09 (canales de la regla), webhooks públicos `metric.alert.opened` |
| EVT-BIA-10 | `bia.kpiAlert.resolved` | Alerta resuelta | T09 |
| EVT-BIA-11 | `bia.apiClient.activated` / `.suspended` / `.revoked` | Transición §8.6 | T02 (invalida caché de credenciales), contacto técnico (email) |
| EVT-BIA-12 | `bia.webhookSubscription.disabled` | Suscripción deshabilitada por fallas | Contacto técnico, PAN-BIA-17 |
| EVT-BIA-13 | `bia.dataset.freshnessBreached` | Frescura > `PRM-BIA-031` | T01 (bandeja técnica), PAN-BIA-23 |
| EVT-BIA-14 | `bia.reconciliation.mismatch` | Diferencia operativo vs analítico > `PRM-BIA-029` | T01, dueño del indicador |
| EVT-BIA-15 | `bia.customReport.submitted` / `.published` | Ciclo del generador | Bandeja de aprobaciones T11 |
| EVT-BIA-16 | `bia.bulkExport.ready` | Exportación masiva lista | Webhook público `export.ready`, T01 (salida del tenant) |
| EVT-BIA-17 | `bia.openData.published` / `.withdrawn` | Publicación de datos abiertos | M19 (landing) |
| EVT-BIA-18 | `bia.exitExport.delivered` | Paquete de salida del tenant entregado | T01 (cierre del tenant, MER-020) |

### 12.2 Eventos consumidos

| Evento (módulo) | Uso en BIA |
|---|---|
| Todos los eventos de negocio de outbox (`per.*`, `cat.*`, `med.*`, `tar.*`, `fac.*`, `fis.*`, `cob.*`, `mor.*`, `crm.*`, `tec.*`, `ven.*`, `cmp.*`, `stk.*`, `tes.*`, `con.*`, `sue.*`, `ins.*`, `soc.*`, `por.*`, `com.*`) | Proyecciones `bi_*` (JOB-BIA-09) y traducción a eventos públicos (JOB-BIA-14) |
| `fac.billingRun.closed` (EVT-FAC-06), `cob.cashSession.closed` (EVT-COB-12), `con.period.closed` (EVT-CON-07), `mor.batch.generated` (EVT-MOR-07), `sue.payrollRun.closed` (EVT-SUE-13), `med.readingBatch.closed` (EVT-MED-07) | Disparo de programaciones por evento (§9.3) y snapshots de cierre |
| `iam.membership.suspended` / `.revoked` (EVT-IAM-03), `iam.role.unassigned` / `iam.role.assigned` (EVT-IAM-04), `iam.role.changed` / `iam.profile.changed` (EVT-IAM-05; suscripción directa al canónico, antes solo `iam.role.changed` y el alias `iam.roleAssignment.changed`, CNC-WFL-089) | Revalidación de programaciones y presets compartidos (RF-BIA-038) |
| `cob.payment.confirmed` (EVT-COB-04), `cob.receipt.voided` (EVT-COB-05), `cob.allocation.reversed` (EVT-COB-06) | Proyecciones `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_ledgerEntry` (suscripción directa a los canónicos; antes el alias `cob.ledgerEntry.posted`, CNC-WFL-083) |
| `iam.apiClient.created` / `credentialRotated` / `revoked` (EVT-IAM-12) | Sincroniza estado del perfil de cliente y caché de revocación |
| `pla.tenant.suspended`, `pla.tenant.reactivated`, `pla.tenant.closing` (T01) | Corta/rehabilita API ext y programaciones; dispara JOB-BIA-21 en cierre |
| `pla.license.updated` (EVT-PLA-08, T01) | Recalcula catálogo visible, scopes válidos y OpenAPI filtrado |
| `cfg.configVersion.published` (EVT-CFG-05, T04) | Invalida cachés de diccionario, calendario de días hábiles y parámetros PRM-BIA |

### 12.3 Eventos públicos para webhooks salientes

Payload delgado (RN-BIA-035): `{ "eventId", "type", "occurredAt", "tenant": { "slug" }, "resource": { "type", "id", "href" }, "data": { …campos no personales… } }`. Cada suscripción solo recibe tipos cuyo scope tenga el cliente.

| Tipo público | Evento interno de origen | Scope requerido | `data` |
|---|---|---|---|
| `ping` | — (prueba) | `webhooks:manage` | `{}` |
| `account.created` / `account.updated` / `account.closed` | `per.account.*` | `accounts:read` | `accountNumber`, `status`, `branchCode` |
| `contract.activated` / `contract.suspended` / `contract.reactivated` / `contract.terminated` | `cat.contract.activated` / `.suspended` / `.reactivated` / `.terminated` (EVT-CAT-09/10/12/15) | `contracts:read` | `serviceCode`, `planCode`, `status`, `effectiveAt` |
| `consumption.approved` | `med.consumption.approved` | `consumption:read` | `period`, `quantity`, `unit`, `estimated` |
| `invoice.issued` / `invoice.authorized` / `invoice.voided` | `fac.invoice.issued` (EVT-FAC-07), `fis.invoice.authorized` (EVT-FIS-01), `fac.invoice.annulled` (EVT-FAC-08) | `billing:read` | `invoiceNumber`, `type`, `total`, `currency`, `dueDate1` |
| `payment.confirmed` / `payment.reversed` | `cob.payment.confirmed` (EVT-COB-04), `cob.receipt.voided` (EVT-COB-05) | `collections:read` | `amount`, `currency`, `channel`, `paidAt` |
| `arrears.interruption.executed` / `arrears.reconnection.executed` | `mor.interruption.executed` (EVT-MOR-13; tipo suspensión o reconexión) | `arrears:read` | `contractId`, `mode`, `executedAt` |
| `agreement.created` / `agreement.defaulted` | `mor.agreement.created`, `mor.agreement.defaulted` | `arrears:read` | `installments`, `status` |
| `ticket.created` / `ticket.statusChanged` / `ticket.resolved` | `crm.case.*` | `crm:read` | `caseType`, `area`, `status`, `priority` |
| `workOrder.scheduled` / `workOrder.closed` | `tec.workOrder.*` | `field:read` | `operation`, `status`, `scheduledStart`, `closedAt` |
| `stock.belowMinimum` | `stk.item.belowMinimum` | `erp.catalog:read` | `productCode`, `warehouseCode`, `available` |
| `metric.alert.opened` / `metric.alert.resolved` | EVT-BIA-09/10 | `metrics:read` | `indicatorCode`, `value`, `severity` |
| `export.ready` | EVT-BIA-16 | `exports:write` | `exportId`, `parts`, `expiresAt` |
| `request.processed` | `crm.case.statusChanged` (EVT-CRM-05) | `requests:write` | `requestId`, `result`, `resourceRef` |

### 12.4 Jobs

Ver la tabla JOB-BIA-01 a JOB-BIA-22 de §9.13 (frecuencia, idempotencia y reanudación). Todas las colas de BIA usan prioridad justa por tenant (RF-BIA-033) y la cola `ext`/`bi` tiene workers dedicados (RF-BIA-075).

## 13. Integraciones

| Integración | Ficha / dueño | Particularidad en BIA |
|---|---|---|
| API para terceros (ex Integra) | FIC 14.3; ficha de T06 con "Módulo dueño: T10" | La API se especifica aquí (§11.2); T06 aporta bóveda, bitácora y el canal del agente. Integra exponía `RegistrarCuenta`, `RegistrarPersona`, `PutCategoria` y consultas con API key fija: se reemplaza por scopes y solicitudes (API-BIA-130 a 133). |
| Power BI / herramientas BI | FIC 18.1; DFA M28 `TABLAS_POWERBI` | Conector por API key de solo lectura sobre `/datasets/:code/rows` y feeds CSV paginados (RF-BIA-102, PA-BIA-07). Sin acceso directo a la base. |
| Sistema contable externo | FIC 18.2 | Layouts y datasets de M15 (libro diario, sumas y saldos) exportados con el motor de BIA (RF-BIA-101). |
| GIS | FIC 16 | Exportación KML/GeoJSON desde reportes geolocalizados y plantillas `gisExportTemplates` de M10 (REP-TEC-024). |
| Reguladores (ERSeP, OCEBA, ENARGAS, ENACOM, Secretaría de Energía, EPRE, INAES) | FIC 8 | Formato y presentación de M06/M15/M17/M03; BIA solo ejecuta y entrega (§15.5). |
| Proveedor de IA | T06 (bóveda de credenciales por tenant o de plataforma) | Solo recibe catálogo semántico y preguntas sin datos personales; consultas y respuestas registradas en `aiQuestions` y en `auditAi` de T02. |
| Email transaccional | T09 | Plantillas `bia.report.delivery`, `bia.export.ready`, `bia.kpiAlert`, `bia.api.credentialExpiring`, `bia.webhook.disabled`. |
| Almacenamiento de objetos | O0 core | Prefijo privado `tenants/<tenantId>/bia/...`; prefijo público solo para datos abiertos `public/<tenantSlug>/open-data/...`. |

## 14. Parámetros de configuración

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-BIA-001 | `bia.reports.defaultCutoff` | enum `now`/`endOfPreviousDay` | tenant | `endOfPreviousDay` | Fecha de corte por defecto de reportes "a fecha" sin parámetro explícito | — |
| PRM-BIA-002 | `bia.reports.maxSyncRangeMonths` | integer | plataforma/tenant | 12 | Rango máximo de fechas para ejecución síncrona | — |
| PRM-BIA-003 | `bia.reports.maxSyncRows` | integer | plataforma | 50000 | Filas estimadas máximas para modo síncrono | — |
| PRM-BIA-004 | `bia.reports.maxSyncSeconds` | integer | plataforma | 20 | Segundos máximos en síncrono antes de pasar a asíncrono | — (ProCoop 120 s fijo) |
| PRM-BIA-005 | `bia.exports.maxInlineRows` | integer | plataforma | 10000 | Filas máximas para exportación en línea | — |
| PRM-BIA-006 | `bia.exports.maxPdfRows` | integer | plataforma/tenant | 20000 | Filas máximas de un PDF (sobre eso se ofrece XLSX/CSV) | — |
| PRM-BIA-007 | `bia.exports.signedUrlMinutes` | integer | plataforma | 5 | Vigencia de la URL firmada de descarga | — |
| PRM-BIA-008 | `bia.exports.retentionDays` | integer | tenant | 7 | Días hasta purgar el archivo (`A validar PA-BIA-09`) | — |
| PRM-BIA-009 | `bia.exports.zipThresholdMb` | integer | plataforma | 50 | Tamaño desde el que el CSV se entrega comprimido | — |
| PRM-BIA-010 | `bia.quota.concurrentPerUser` | integer | plataforma/tenant | 3 | Corridas/exportaciones simultáneas por usuario | — |
| PRM-BIA-011 | `bia.quota.concurrentPerTenant` | integer | plataforma (por plan) | 10 | Simultáneas por tenant | — |
| PRM-BIA-012 | `bia.delivery.maxAttachmentMb` | integer | tenant | 5 | Tamaño máximo de adjunto en email (solo `sensitivity=none`) | — |
| PRM-BIA-013 | `bia.schedules.maxConsecutiveFailures` | integer | tenant | 3 | Fallos que suspenden una programación | — |
| PRM-BIA-014 | `bia.selection.tokenMinutes` | integer | plataforma | 30 | Vigencia del `selectionToken` | — |
| PRM-BIA-015 | `bia.runs.resultTtlHours` | integer | plataforma | 24 | Vida del resultado paginable de una corrida | — |
| PRM-BIA-016 | `bia.runs.historyDays` | integer | plataforma | 400 | Conservación de la fila de corrida | — |
| PRM-BIA-017 | `bia.audit.retentionDays` | integer | plataforma (mínimo T08) | 1825 | Retención de `reportAccessLogs` y `apiUsageDaily` | — |
| PRM-BIA-018 | `bia.worker.batchRows` | integer | plataforma | 5000 | Tamaño de lote de lectura del worker | — |
| PRM-BIA-019 | `bia.indicators.operationalCacheMinutes` | integer | plataforma | 15 | Caché de indicadores calculados sobre la fuente operativa | — |
| PRM-BIA-020 | `bia.builder.maxScannedDocs` | integer | plataforma (por plan) | 5000000 | Costo máximo de consulta del generador | — |
| PRM-BIA-021 | `bia.reports.paymentDateBasis` | enum `paymentDate`/`receiptDate`/`recordedAt` | tenant | `paymentDate` | Criterio de fecha de pago en saldos retroactivos (RN-BIA-006) | RN-05 §13.11 (criterios 0/1/2) |
| PRM-BIA-022 | `bia.reports.variationMode` | enum `goodapps`/`procoop` | tenant | `goodapps` | Fórmula de variación porcentual (RN-BIA-010, `A validar PA-BIA-11`) | — |
| PRM-BIA-023 | `bia.display.rounding` | `{ mode: halfEven, pctDecimals: 2, daysDecimals: 1 }` | plataforma | ver | Redondeo de presentación (RN-BIA-011) | — |
| PRM-BIA-024 | `bia.masking.patterns` | object por tipo de dato | plataforma | DNI `**.***.NNN`; CUIT `NN-****NNNN-N`; email `a***@dominio`; teléfono últimos 3; CBU últimos 4 | Patrones de enmascarado (RN-BIA-016) | — |
| PRM-BIA-025 | `bia.reports.paymentDateDiffDays` | integer | tenant | 0 | Diferencia en días para "cobros con fecha distinta" (RN-BIA-051) | — |
| PRM-BIA-026 | `bia.reports.recurrenceWindowDays` | integer | tenant | 30 | Ventana por defecto de reincidencias (RN-BIA-053) | — |
| PRM-BIA-027 | `bia.builder.fourEyes` | boolean | tenant | true | Aprobador distinto del autor (`A validar PA-BIA-13`) | — |
| PRM-BIA-028 | `bia.indicators.monthCloseBusinessDay` | integer | tenant | 5 | Día hábil en que se congelan los snapshots del mes anterior | — |
| PRM-BIA-029 | `bia.reconciliation.tolerance` | `{ count: 0, amount: "0.01", pct: "0.01" }` | plataforma | ver | Tolerancia operativo vs analítico | — |
| PRM-BIA-030 | `bia.analytics.freshnessTargetMinutes` | integer | plataforma | 15 | Objetivo de frescura del almacén | — |
| PRM-BIA-031 | `bia.analytics.freshnessAlertMinutes` | integer | plataforma | 60 | Frescura que dispara aviso y alerta | — |
| PRM-BIA-032 | `bia.reads.maxStalenessSeconds` | integer (≥ 90, mínimo de MongoDB) | plataforma | 90 | `maxStalenessSeconds` de lecturas en secundario (RN-BIA-050) | — |
| PRM-BIA-033 | `bia.ai.provider` | `{ providerRef, model, maxTokens }` | plataforma/tenant | `null` (sin IA) | Proveedor y modelo de IA analítica (credencial por referencia a T06) | — |
| PRM-BIA-034 | `bia.ai.autoAnalysisHours` | integer | tenant | 6 | Recálculo del análisis automático por sala | — |
| PRM-BIA-035 | `bia.ai.questionsRetentionDays` | integer | tenant | 365 | Retención de `aiQuestions` | — |
| PRM-BIA-036 | `bia.ai.enabled` | boolean | tenant | false | Habilita la zona C de las salas | — |
| PRM-BIA-037 | `bia.ai.freeQuestionsEnabled` | boolean | tenant | true | Permite preguntas libres además de las de catálogo (`A validar PA-BIA-06`) | — |
| PRM-BIA-038 | `bia.ai.limits` | `{ perUserDaily: 50, tenantMonthlyBudgetArs: "50000.00" }` | tenant | ver | Límites de uso y costo de IA | — |
| PRM-BIA-039 | `bia.dashboards.defaultPeriod` | enum `day`/`isoWeek`/`month`/`billingCycle` | tenant | `month` | Período inicial de los tableros | — |
| PRM-BIA-040 | `bia.api.accessTokenMinutes` | integer | plataforma | 15 | Vida del access token (coincide con P-IAM-20) | — |
| PRM-BIA-041 | `bia.api.credentialMaxDays` | integer | tenant (≤ plataforma) | 365 | Vencimiento máximo de credenciales | — |
| PRM-BIA-042 | `bia.api.rotationOverlapHours` | integer | tenant | 24 | Solapamiento en rotación; **alias de `PRM-IAM-074`** (un solo valor, dueño T02, CTR-BIA-01) | — |
| PRM-BIA-043 | `bia.api.revocationSeconds` | integer | plataforma | 60 | Plazo máximo de revocación efectiva (BASE §34 n.º 46) | — |
| PRM-BIA-044 | `bia.api.usageLogTtlDays` | integer | plataforma | 90 | TTL de `apiUsageLogs` | — |
| PRM-BIA-045 | `bia.api.deprecationNoticeMonths` | integer | plataforma | 6 | Aviso mínimo antes de retirar una versión | — |
| PRM-BIA-046 | `bia.api.incrementalWatermarkSeconds` | integer | plataforma | 120 | Retraso de la marca de agua incremental | — |
| PRM-BIA-047 | `bia.webhooks.signatureToleranceSeconds` | integer | plataforma | 300 | Tolerancia de timestamp de la firma | — |
| PRM-BIA-048 | `bia.webhooks.retryHorizonHours` | integer | plataforma | 72 | Horizonte de reintentos antes de `dead` y deshabilitación | — |
| PRM-BIA-049 | `bia.webhooks.deliveryTtlDays` | integer | plataforma | 30 | TTL de `extWebhookDeliveries` | — |
| PRM-BIA-050 | `bia.openData.minCellSize` | integer | tenant (≥ plataforma) | 10 | n mínimo por celda publicada | — |
| PRM-BIA-051 | `bia.benchmark.minTenantsPerSegment` | integer | plataforma | 5 | Participantes mínimos por segmento | — |
| PRM-BIA-052 | `bia.webhooks.timeoutSeconds` | integer | plataforma | 10 | Timeout de cada POST de webhook | — |
| PRM-BIA-053 | `bia.api.rateLimit.client` | `{ perMinute: 600, burst: 100 }` | plataforma (por plan) / tenant (solo bajar) | ver | Rate limit por cliente (`A validar PA-BIA-08`) | — |
| PRM-BIA-054 | `bia.api.dailyQuota.client` | integer | plataforma (por plan) / tenant | 100000 | Unidades de peso diarias por cliente | — |
| PRM-BIA-055 | `bia.api.rateLimit.tenant` | `{ perMinute: 1200 }` | plataforma (por plan) | ver | Tope agregado por tenant | — |
| PRM-BIA-056 | `bia.api.maxPageSize` | integer | plataforma | 500 (default de página 100) | Tamaño máximo de página | — |
| PRM-BIA-057 | `bia.schedules.externalRecipientsEnabled` | boolean | tenant | false | Permite emails externos (`A validar PA-BIA-04`) | — |
| PRM-BIA-058 | `bia.schedules.externalDomainsAllowlist` | string[] | tenant | `[]` | Dominios admitidos para destinatarios externos | — |
| PRM-BIA-059 | `bia.audit.viewMode` | enum `sensitiveOnly`/`all` | tenant | `sensitiveOnly` | Qué ejecuciones se auditan además de exportaciones y descargas (`A validar PA-BIA-12`) | — |
| PRM-BIA-060 | `bia.api.bulkExportRetentionDays` | integer | plataforma | 3 | Vigencia de exportaciones masivas de API | — |
| PRM-BIA-061 | `bia.api.bulkExportFormats` | string[] | plataforma | `["ndjson","csv"]` (Parquet opcional) | Formatos de exportación masiva | — |
| PRM-BIA-062 | `bia.api.bulkExportPartRows` | integer | plataforma | 1000000 | Filas por parte | — |
| PRM-BIA-063 | `bia.webhooks.enabled` | boolean | tenant | true | Habilita webhooks salientes (`A validar PA-BIA-15`) | — |
| PRM-BIA-064 | `bia.webhooks.maxSubscriptionsPerClient` | integer | plataforma | 10 | Suscripciones por cliente | — |
| PRM-BIA-065 | `bia.openData.enabled` | boolean | tenant | false | Habilita datos abiertos (`A validar PA-BIA-10`) | — |
| PRM-BIA-066 | `bia.benchmark.enabled` | boolean | plataforma | false | Habilita el benchmark (`A validar PA-BIA-05`) | — |
| PRM-BIA-067 | `bia.reports.rankingDefaultN` | integer (5–500) | tenant | 20 | N por defecto de rankings (RN-BIA-046) | INV `TipoInforme.Ranking_de_Clientes` (top 20) |
| PRM-BIA-068 | `bia.exports.csvDefaults` | `{ dialect: regional, delimiter: ";", bom: true }` | tenant / usuario | ver | Formato CSV por defecto (RF-BIA-026) | V2 #2294 (tipo de exportación Excel, Reemplazado) |
| PRM-BIA-069 | `bia.dataTable.defaultPageSize` | integer | tenant / usuario | 50 | Tamaño de página de grillas | — |
| PRM-BIA-070 | `bia.api.legacyKeyExposed` (antes `bia.api.legacyRefsExposed`) | boolean | tenant | false | Expone `legacy.displayKey` (clave visible de ProCoop) en la API ext; nunca `legacy.key` ni `legacy.hash` | — |
| PRM-BIA-P1-001 | `bia.informes.consumosTramosCategorias.permitirColumnasRepetidas` | boolean | tenant | false | Permite columnas repetidas en la matriz de REP-MED-008 | V2 #2749 |
| PRM-BIA-P1-002 | `bia.informes.consumosTramosCategorias.totalIgualDetalle` | boolean | tenant | true | Exige que el total coincida con el detalle por filas | V2 #2875 |
| PRM-BIA-P1-003 | `bia.informes.consumosTramosCategorias.agruparPorTipoEnergia` | boolean | tenant | false | Agrupa por tipo de energía (`TIP_ENE`) | V2 #2968 |
| PRM-BIA-P1-004 | `bia.informes.consumosTramosCategorias.agruparPorPeriodo` | boolean | tenant | false | Agrupa por período | V2 #3022 |
| PRM-BIA-P1-005 | `bia.informes.consumosTramosCategorias.incluirTotalFacturado` | boolean | tenant | true | Incluye columna "Total facturado" en el detalle de cuentas | V2 #3066 |

Parámetros ProCoop reemplazados por funciones estándar de BIA (sin PRM propio): V2 #2294 (tipo de exportación Excel → PRM-BIA-068 y exportación XLSX/CSV/PDF), #3172 (exportar XLSX del informe de tramos → exportación estándar), #2951 (excluir registros en 0 en Planilla de caja → filtro de REP-COB-005 con vista guardada), #2306 (incluir bajas en circulares → filtro de REP-MOR-009/REP-PER-014), #2568 (botón de grandes consumos → REP-MED-007 con capability `med.reportes.grandesConsumos`), #3095 (subtipo comisión CVLP en movimiento de conceptos → filtro de REP-FAC-002), #2650 (visibilidad del check de excluir financiaciones → `Descartado`, filtro siempre disponible), #50, #2321, #2557, #2563, #2744 (filtros y columnas por defecto → vistas guardadas de `DataTable`, T03/BIA).

## 15. Reportes, indicadores y exportaciones

### 15.1 Contrato semántico común (AGR-022)

Estos términos tienen **una sola definición** en todo el sistema; los reportes, indicadores, datasets y la API los usan con este significado y lo declaran en su ficha. Ningún módulo puede redefinirlos; puede agregar términos propios con nombre distinto.

| Término (`dict:`) | Definición | Granularidad | Fecha que lo imputa | Incluye | Excluye |
|---|---|---|---|---|---|
| **Facturado** (`bia.sem.billed`) | Σ total de comprobantes de débito autorizados (o emitidos, en no fiscales) − Σ notas de crédito autorizadas | comprobante / línea | Emisión (por defecto) o período facturado | Facturas, ND, cargos de financiación facturados | Anulados, pendientes de CAE, inciertos, rechazados, simulaciones |
| **Facturado fiscal** (`bia.sem.billedFiscal`) | Igual a Facturado, solo comprobantes con CAE/CAEA | comprobante | Emisión | — | Detenidos e inciertos (M06 §15) |
| **Cobrado** (`bia.sem.collected`) | Σ pagos `confirmed` imputados o pendientes de imputar, netos de reversiones del mismo período | pago | Fecha de cobro efectiva (o `paymentDateBasis`) | Caja, entes, pasarelas, débitos, cobradores | Pagos en proceso, intenciones no pagadas, contracargos (restan cuando se confirman) |
| **En proceso** (`bia.sem.inProcess`) | Σ pagos informados o en estado no final (pendiente de confirmación, incierto) | pago | Fecha de informe | — | Siempre informado aparte (RN-BIA-009) |
| **Acreditado** (`bia.sem.credited`) | Σ importes netos efectivamente acreditados en bancos y conciliados | movimiento bancario | Fecha de acreditación | — | Comisiones y retenciones (se informan como diferencia) |
| **Saldo** (`bia.sem.balance`) | Σ débitos − Σ créditos del auxiliar de cuenta corriente con fecha efectiva ≤ corte (AGR-011) | cuenta × servicio | Corte | Saldos a favor como negativo | Simulaciones; nunca se calcula desde `openAmount` |
| **Vencido** (`bia.sem.overdue`) | Parte del saldo de obligaciones cuyo 1.er vencimiento < corte | obligación | Corte | — | Cuotas de convenio no vencidas |
| **Deuda actualizada** (`bia.sem.updatedDebt`) | Vencido + recargo cotizado al corte (no registrado) | obligación | Corte | — | — |
| **Contrato activo** (`bia.sem.activeContract`) | Contrato con estado canónico `active` al corte | contrato | Corte | — | `suspended` (se informa aparte), `requested`, `pendingInstallation`, `terminated` |
| **Servicio conectado** (`bia.sem.connected`) | `active` + `suspended` al corte (equivale a condición 2/3 de `SERSOC`) | contrato | Corte | — | — |
| **Consumo** (`bia.sem.consumption`) | Cantidad aprobada del período de consumo asignado (RN-MED-038) | consumo | Período de consumo | Reales y estimados (marcados) | No aprobados, anulados |
| **Comprometido / Devengado / Pagado** (`bia.sem.committed` / `.accrued` / `.paid`) | OC aprobadas pendientes / comprobantes registrados / órdenes de pago pagadas (AGR-028) | documento | Aprobación / fecha contable / fecha de pago | — | **Nunca se suman entre sí** |
| **Caso abierto** (`bia.sem.openCase`) | Caso CRM con `baseStatus` no final | caso | Corte | Pausados (marcados) | Cerrados, cancelados |

### 15.2 Convenciones del catálogo

- **Código**: `REP-<MOD>-NNN` (tres dígitos). Cuando el anexo dueño ya asignó `REP-<MOD>-NN`, el código consolidado es el mismo número con cero a la izquierda (REP-COB-02 ≡ REP-COB-002) y **ambos refieren al mismo reporte**; cuando el anexo dueño no asignó códigos, el número lo fija este catálogo en el orden de su §15. Los reportes marcados **(T10)** fueron agregados aquí para cubrir listados ProCoop o requisitos BASE que no estaban en el anexo dueño; el anexo dueño debe incorporarlos en su próxima versión.
- **Fórmula, universo y fecha de corte** completos están en el §15 del anexo dueño (columna "Ref."); aquí se resume el contenido y se fija el corte por defecto.
- **Corte por defecto**: `asOf` = a una fecha (fecha efectiva), `Rango` = período con tipo de fecha declarado, `Snap` = instantánea al momento de la consulta, `Corrida` = una ejecución/lote/documento.
- **Fuente**: todos los reportes del catálogo son `operational` hasta O11; desde O11 los marcados en su ficha como `analytical` o `both` pueden servirse desde el almacén. Los reportes de control y conciliación son siempre `operational` (RN-BIA-048).
- **Salidas**: todos admiten pantalla, XLSX, CSV y PDF salvo indicación; `KML`/`GeoJSON` y `layout` se indican en la ficha.

### 15.3 Reportes propios de BIA

| REP-ID | Reporte | Contenido / fórmula | Corte | Ola |
|---|---|---|---|---|
| REP-BIA-001 | Uso de la plataforma de reportes | Reportes más ejecutados, usuarios, duración media y p95, tasa de fallo = fallidas / corridas, exportaciones por formato (RF-BIA-103) | Rango | O2 |
| REP-BIA-002 | Accesos a reportes con datos personales | `reportAccessLogs` por usuario, reporte y acción (`view`/`export`/`download`/`unmask`); filas expuestas (RF-BIA-034) | Rango | O1 |
| REP-BIA-003 | Exportaciones del tenant | Exportaciones por estado, formato, tamaño, contiene datos personales, vencidas sin descargar | Rango | O1 |
| REP-BIA-004 | Programaciones y entregas | Programaciones por estado; entregas enviadas, omitidas sin permiso, fallidas, rebotadas | Rango | O2 |
| REP-BIA-005 | Uso de API por cliente | Llamadas, unidades de cuota, 4xx/5xx por `problemType`, p95, filas y bytes por cliente y endpoint | Rango | O11 |
| REP-BIA-006 | Entregas de webhooks | Entregas por suscripción y estado, tasa de éxito al primer intento = entregadas en intento 1 / entregas, `dead` abiertas | Rango | O11 |
| REP-BIA-007 | Reconciliación operativo vs analítico | Por indicador certificado y día: valor operativo, valor analítico, diferencia, dentro de tolerancia (RF-BIA-063) | Día | O11 |
| REP-BIA-008 | Frescura de datasets | Por dataset: último evento proyectado, retraso en minutos, incumplimientos del objetivo | Snap | O11 |
| REP-BIA-009 | IA analítica | Preguntas por sala, respondidas/rechazadas por motivo, valoración positiva = positivas / valoradas, costo | Rango | O11 |
| REP-BIA-010 | Alertas de indicadores | Alertas por regla, severidad y estado; tiempo medio de reconocimiento y de resolución | Rango | O2 |
| REP-BIA-011 | Catálogo de indicadores y versiones | Indicadores por estado, versión, fecha de certificación, objetivos del tenant | Snap | O1 |
| REP-BIA-012 | Reportes personalizados | Por estado (borrador, en revisión, publicado, obsoleto), autor, aprobador, uso | Snap | O11 |
| REP-BIA-013 | Benchmark del tenant | Por indicador benchmarkable: valor propio, percentil, cuartiles y n del segmento | Mes cerrado | O11 |
| REP-BIA-014 | Datos abiertos publicados | Publicaciones, versiones, celdas suprimidas, descargas públicas | Rango | O11 |
| REP-BIA-015 a REP-BIA-024 | Informes regulatorios por organismo y servicio | Un código por informe regulatorio y servicio; ficha en §15.5.1 (HUE-SRV-08) | Según informe | O7 |

### 15.4 Catálogo consolidado de reportes por módulo

#### 15.4.1 Plataforma, identidad, configuración y migración (T01, T02, T04, T07)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-PLA-001 | Listado de tenants | Tenants por estado, plan, ambiente, habilitación | Snap | O1 | T01 §15.3 |
| REP-PLA-002 | Contratos SaaS | Contratos, vigencias, por vencer | Snap | O1 | T01 §15.3 |
| REP-PLA-003 | Uso vs cupo | Consumo por dimensión y % del cupo por tenant | Día | O1 | T01 §15.3 |
| REP-PLA-004 | Prefactura SaaS | Importe por tenant y concepto del período | Rango | O1 | T01 §15.3 |
| REP-PLA-005 | Informe de restauración | Resultado de la restauración (PDF) | Corrida | O1 | T01 §15.3 |
| REP-PLA-006 | Informe de ensayo de restauración | Resultado del ensayo (PDF) | Corrida | O1 | T01 §15.3 |
| REP-PLA-007 | Certificado de purga | Constancia de purga del tenant (PDF) | Corrida | O1 | T01 §15.3 |
| REP-PLA-008 | Inventario técnico | Inventario JSON del tenant | Snap | O1 | T01 §15.3 |
| REP-IAM-001 | Usuarios por estado y rol | Pertenencias staff por `status` y rol activo | Snap | O1 | T02 §15 |
| REP-IAM-002 | Usuarios sin MFA con capabilities S | Pertenencias activas con asignación S sin MFA | Snap | O1 | T02 §15 |
| REP-IAM-003 | Conflictos SoD y excepciones | Pares RN-IAM-040; excepciones vigentes/vencidas | Snap | O1 | T02 §15 |
| REP-IAM-004 | Asignaciones próximas a vencer | `validTo` en 30 días | Snap | O1 | T02 §15 |
| REP-IAM-005 | Recertificación | Revisadas / totales de asignaciones S | Rango | O1 | T02 §15 |
| REP-IAM-006 | Intentos de login fallidos | Por día, IP, identificador (hash) | Rango | O1 | T02 §15 |
| REP-IAM-007 | Bloqueos y desbloqueos | Conteo por día | Rango | O1 | T02 §15 |
| REP-IAM-008 | Autorizaciones | Por capability, solicitante, aprobador, resultado, tiempo medio de decisión | Rango | O1 | T02 §15 |
| REP-IAM-009 | Acciones bajo autorización por usuario | `consumed` por solicitante | Rango | O1 | T02 §15 |
| REP-IAM-010 | Exportaciones de datos | `auditReads.category=export` por usuario y filas | Rango | O1 | T02 §15 |
| REP-IAM-011 | Accesos de soporte | Grants por tenant, duración, modo, acciones | Rango | O1 | T02 §15 |
| REP-IAM-012 | Uso de API (vista IAM) | Requests por cliente, scope, error, latencia (misma fuente que REP-BIA-005) | Rango | O11 | T02 §15 |
| REP-IAM-013 | IA: aceptación | Aceptadas / (aceptadas + editadas + rechazadas) por función y modelo | Rango | O1 | T02 §15 |
| REP-IAM-014 | IA: costo | Σ costo por función | Mes | O1 | T02 §15 |
| REP-IAM-015 | Integridad de auditoría | Particiones verificadas OK / total | Último sellado | O1 | T02 §15 |
| REP-IAM-016 | Mensajes por estado | `auditMessages` por canal y estado | Rango | O1 | T02 §15 |
| REP-CFG-001 | Registro de cambios de configuración | Ítems publicados con antes/después, versión, autor, revisor | Rango (`recordedAt`) | O1 | T04 §15 |
| REP-CFG-002 | Configuración vigente a fecha | Valor efectivo por clave y ámbito (`at`, `knownAt`) | asOf | O1 | T04 §15 |
| REP-CFG-003 | Tiempo de ciclo de versiones | Promedio publicación − creación y aprobación − envío | Rango | O1 | T04 §15 |
| REP-CFG-004 | Versiones rechazadas/fallidas | Conteo y motivos | Rango | O1 | T04 §15 |
| REP-CFG-005 | Integridad de configuración | Valores inválidos, referencias rotas, secretos faltantes/por vencer | Corrida (JOB-CFG-13) | O1 | T04 §15 |
| REP-CFG-006 | Completitud de perfiles de servicio | Dimensiones completas / obligatorias × 100 | Snap | O2 | T04 §15 |
| REP-CFG-007 | Calidad de georreferenciación | % por estado de geocodificación | Snap + tendencia mensual | O2 | T04 §15 |
| REP-CFG-008 | Consumo de geocodificación | Llamadas por mes vs cuota | Mes | O2 | T04 §15 |
| REP-CFG-009 | Calles locales y propuestas | Locales activas, propuestas por estado | Snap | O1 | T04 §15 |
| REP-CFG-010 | Cobertura de padrones | CUIT con entrada vigente / CUIT totales × 100 | asOf | O4 | T04 §15 |
| REP-CFG-011 | Valores de índices | Serie con valores, revisiones y fuente | Rango | O1 | T04 §15 |
| REP-CFG-012 | Adopciones pendientes | Releases de plataforma sin reconocer y antigüedad | Snap | O1 | T04 §15 |
| REP-CFG-013 | Importaciones | Archivos, filas, errores, duración | Rango | O1 | T04 §15 |
| REP-CFG-014 | Uso de campos extra | Registros con valor / registros de la entidad | Snap | O1 | T04 §15 |
| REP-CFG-015 | Migración de `VARIABLE` | Filas por destino (suman el total) | Volcado | O11 | T04 §15 |
| REP-MIG-001 | Inventario de tablas | Filas por tabla y estrategia; % con datos por módulo (659 tablas) | asOf | O11 | T07 §15 |
| REP-MIG-002 | Perfilado de calidad | % nulos, inválidos, huérfanos, duplicados | asOf | O11 | T07 §15 |
| REP-MIG-003 | Índice de calidad por dominio | 1 − registros con issue / registros | asOf | O11 | T07 §15 |
| REP-MIG-004 | Rechazos y advertencias | Por código, severidad, tabla, estado | Corrida | O11 | T07 §15 |
| REP-MIG-005 | Avance de saneamiento | Resueltos / totales por tipo y responsable | Día | O11 | T07 §15 |
| REP-MIG-006 | Conciliación por dominio | Checks origen vs destino | asOf | O11 | T07 §15 |
| REP-MIG-007 | Deuda por titular y servicio | Σ saldo abierto origen vs destino | asOf | O11 | T07 §15 |
| REP-MIG-008 | Antigüedad de deuda migrada | Tramos 0–30, 31–60, 61–90, > 90 | asOf | O11 | T07 §15 |
| REP-MIG-009 | Paralelo factura por factura | Comparados, iguales, en tolerancia, explicados, sin explicar | Ciclo | O11 | T07 §15 |
| REP-MIG-010 | Tendencia de paralelo | % iguales por ciclo | Por ciclo | O11 | T07 §15 |
| REP-MIG-011 | Uso de alias | Pagos resueltos por alias, ambiguos, no resueltos | Día | O11 | T07 §15 |
| REP-MIG-012 | Diario de rollback | Hechos post-corte por tipo | Día | O11 | T07 §15 |
| REP-MIG-013 | Acta de aceptación | Resumen ejecutivo | Corte | O11 | T07 §15 |

#### 15.4.2 Personas, catálogo, medición y tarifas (M01–M04)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-PER-001 | Padrón de titulares | Una fila por titular o cuenta, columnas elegidas; filtros estado, asociado, servicio, localidad, zona, distrito | asOf | O2 | M01 REP-PER-01 |
| REP-PER-002 | Altas y bajas de titulares | Por mes, causa y sucursal; neto = altas − bajas | Rango | O2 | M01 REP-PER-02 |
| REP-PER-003 | Cuentas por estado y estructura | Activas, cerradas, sin contratos, varios grupos, sin principal (= 0) | asOf | O2 | M01 REP-PER-03 |
| REP-PER-004 | Calidad de datos | % identificación verificada, contacto verificado, domicilio confirmado, sin nacimiento; discrepancias ARCA | Snap | O2 | M01 REP-PER-04 |
| REP-PER-005 | Diferencias con ARCA | Condición IVA de cuenta vs constancia | Rango | O4 | M01 REP-PER-05 |
| REP-PER-006 | Documentación presentada, no presentada y vencida | Por requisito: presentados, pendientes, por vencer, vencidos | Snap | O2 | M01 REP-PER-06 |
| REP-PER-007 | Bloqueos vigentes | Por efecto, causa, antigüedad; sin vencimiento > 180 días | Snap | O2 | M01 REP-PER-07 |
| REP-PER-008 | Transferencias | Por tipo y estado; revertidas; tiempo borrador → ejecución | Rango | O2 | M01 REP-PER-08 |
| REP-PER-009 | Relaciones por vencer y vencidas | Por tipo y días restantes | Snap | O2 | M01 REP-PER-09 |
| REP-PER-010 | Adherentes | Activos, altas, bajas, fuera de condición, mayoría de edad | Rango | O2 | M01 REP-PER-10 |
| REP-PER-011 | Duplicados | Abiertos, descartados, fusionados, revertidos; tiempo de resolución | Rango | O2 | M01 REP-PER-11 |
| REP-PER-012 | Geocodificación | % por estado de domicilios en uso | Snap | O2 | M01 REP-PER-12 |
| REP-PER-013 | Inmuebles | Por uso, estado, localidad; sin contratos; varias unidades | Snap | O2 | M01 REP-PER-13 |
| REP-PER-014 | Etiquetas y circulares | Domicilio postal vigente con formato del tenant; filtro "incluir bajas" (V2 #2306) | Snap | O2 | M01 REP-PER-14 |
| REP-PER-015 | Solicitudes de derechos | Por tipo, en plazo y fuera de plazo | Rango | O2 | M01 REP-PER-15 |
| REP-PER-016 | Inventario de datos personales | Campo, categoría, finalidad, base, plazo | Versión | O2 | M01 REP-PER-16 |
| REP-CAT-001 | Contratos por estado | Conteo por estado canónico y operativo | asOf | O2 | M02 REP-CAT-01 |
| REP-CAT-002 | Altas netas | Activaciones − bajas efectivas del período | Rango | O2 | M02 REP-CAT-02 |
| REP-CAT-003 | Tasa de baja (churn) | Bajas efectivas / activos al inicio | Rango | O2 | M02 REP-CAT-03 |
| REP-CAT-004 | Tiempo de solicitud a activación | Mediana y p90 de `effectiveStart − requestedAt` | Rango | O3 | M02 REP-CAT-04 |
| REP-CAT-005 | Embudo de alta | Solicitado → factibilidad → instalación → activo, conversión y anulación por etapa | Rango | O3 | M02 REP-CAT-05 |
| REP-CAT-006 | Suspendidos | Por motivo, modo, antigüedad | asOf | O6 | M02 REP-CAT-06 |
| REP-CAT-007 | Equipos en comodato | Entregados, pendientes de devolución, vencidos, perdidos | asOf | O3 | M02 REP-CAT-07 |
| REP-CAT-008 | Contratos por plan y versión | Activos por `planVersionId` (detecta versiones discontinuadas) | asOf | O2 | M02 REP-CAT-08 |
| REP-CAT-009 | Promociones por finalizar | Contratos con promoción que termina en N ciclos | asOf | O4 | M02 REP-CAT-09 |
| REP-CAT-010 | Adherentes y beneficiarios | Total, altas, bajas, fuera de rango de edad | Rango | O2 | M02 REP-CAT-10 |
| REP-CAT-011 | Marcas de excepción | No facturar / Provisorio / lectura con factor, vencidos y por vencer | Snap | O4 | M02 REP-CAT-11 |
| REP-CAT-012 | Altas automáticas | Propuestas, aceptadas, rechazadas, creadas por regla | Rango | O2 | M02 REP-CAT-12 |
| REP-CAT-013 | Socios con varios servicios | Distribución de cantidad de servicios por titular | asOf | O2 | M02 REP-CAT-13 |
| REP-CAT-014 | Auditoría de configuración del catálogo | Versiones publicadas, cambios, aprobaciones | Rango | O2 | M02 REP-CAT-14 |
| REP-CAT-015 | Padrón regulatorio por categoría | Activos por código regulatorio y jurisdicción | asOf | O7 | M02 REP-CAT-15 |
| REP-MED-001 | Porcentaje de lectura del período | Puntos con lectura real validada / puntos en rutas × 100 | Cierre del cronograma | O7 | M03 §15 |
| REP-MED-002 | Porcentaje estimado | Consumos estimados aprobados / aprobados × 100 | Aprobación | O7 | M03 §15 |
| REP-MED-003 | Medidores sin leer | Conectados sin lectura del período (listados con 0 y marca) | Snap | O7 | M03 §15 |
| REP-MED-004 | Variación porcentual de consumos | (actual / anterior − 1) × 100; anterior 0 → 1; excluye ambos 0 | Período vs anterior | O7 | M03 §15 |
| REP-MED-005 | Desvío de días | \|días − esperados\| / esperados × 100 > límite | Período | O7 | M03 §15 |
| REP-MED-006 | Consumos por categoría | Σ cantidad aprobada por categoría y canal; servicios; tipo de fecha lectura/emisión/vencimiento | Rango | O7 | M03 §15 |
| REP-MED-007 | Grandes consumos | Puntos GC con todos sus canales (V2 #2568, #2590) | Período | O7 | M03 §15 |
| REP-MED-008 | Consumos agrupados por tramos y categorías | Σ cantidad por tramo (M04) y matriz `INFOCTD/G/N`; PRM-BIA-P1-001 a 005 | Período | O7 | M03 §15 |
| REP-MED-009 | Con/sin consumo, estimados, indicados, períodos mayores | Filtros de `frmInformesConsumos` | Período | O7 | M03 §15 |
| REP-MED-010 | Pérdidas | Pérdida = compra − facturado; % = pérdida × 100 / compra; cos φ; anual 13 períodos; por zona (RN-BIA-054) | Período | O7 | M03 §15 |
| REP-MED-011 | Excepciones de consumo abiertas | Por regla y severidad; antigüedad media | Snap | O7 | M03 §15 |
| REP-MED-012 | Productividad de lecturistas | Tareas / horas; % con foto; % fuera de rango; conflictos | Rango | O7 | M03 §15 |
| REP-MED-013 | Éxito de telemedición | `readNow` exitosas / enviadas × 100 por sistema | Rango | O7 | M03 §15 |
| REP-MED-014 | Comandos remotos | Por tipo y resultado; tiempo medio de confirmación | Rango | O7 | M03 §15 |
| REP-MED-015 | Recargas prepagas | Cantidad, unidades, importe, fallidas, conciliación | Día / mes | O7 | M03 §15 |
| REP-MED-016 | Balance de generación distribuida | Σ demandada, inyectada, neto por clase | Período | O7 | M03 §15 |
| REP-MED-017 | Transgresiones de demanda | Cantidad, % promedio, primeras del período | Período | O7 | M03 §15 |
| REP-MED-018 | Regularizaciones | Unidades compensadas o refacturadas | Período | O7 | M03 §15 |
| REP-MED-019 | Datasets regulatorios de consumo | Consumos aprobados/facturados por categoría, tramo, período y tipo de fecha (para M06) | Rango | O7 | M03 §15 |
| REP-TAR-001 | Cuadro tarifario vigente | Categorías, filas, cargos, mínimos, reglas visibles, normas | asOf ("vigente al") | O4 | M04 REP-TAR-01 |
| REP-TAR-002 | Comparativo entre versiones | Diff campo a campo; variación % (M04 15.2) | Versiones | O4 | M04 REP-TAR-02 |
| REP-TAR-003 | Resultado de simulación masiva | Totales y variaciones por servicio/categoría/tramo; percentiles; top N (marca SIMULACIÓN) | Corrida | O4 | M04 REP-TAR-03 |
| REP-TAR-004 | Consumos y netos por tramo y versión | Por escalón: cantidad, neto, cuentas con la versión liquidada | Período | O7 | M04 REP-TAR-04 |
| REP-TAR-005 | Agregado tarifario por fila | Usuarios, cuentas, comprobantes por fila y versión | Período | O4 | M04 REP-TAR-05 |
| REP-TAR-006 | Evolución de conceptos entre dos períodos | Por cuenta o concepto; variación % | Dos períodos | O4 | M04 REP-TAR-06 |
| REP-TAR-007 | Beneficios y subsidios otorgados | Importe por régimen/regla; suministros; financiamiento | Período | O4 | M04 REP-TAR-07 |
| REP-TAR-008 | Padrón vs facturación | Inscriptos sin beneficio y beneficiados sin inscripción | Período | O7 | M04 REP-TAR-08 |
| REP-TAR-009 | Promociones | Activas, por agotarse, finalizadas; costo | asOf | O4 | M04 REP-TAR-09 |
| REP-TAR-010 | Excluidos del cálculo | Por código de error, servicio, categoría; tendencia por lote | Lote | O4 | M04 REP-TAR-10 |
| REP-TAR-011 | Diferencias retroactivas | Por comprobante y total; estado de ajustes | Corrida | O4 | M04 REP-TAR-11 |
| REP-TAR-012 | Tributos de regla por categoría | Importe por tributo y categoría (ex `IMPUESTOS_X_CAT`) | Período | O4 | M04 REP-TAR-12 |
| REP-TAR-013 | Tasación telefónica | Minutos, llamadas, importe por plan/clave/tipo/banda; no tasadas | Rango | O10 | M04 REP-TAR-13 |
| REP-TAR-014 | Factor de potencia | Coseno, tgφ, recargos y bonificaciones | Período | O7 | M04 REP-TAR-14 |
| REP-TAR-015 | Redondeo y arrastre | Total redondeado, saldo de arrastre (conciliado con M07) | asOf | O4 | M04 REP-TAR-15 |
| REP-TAR-016 | Auditoría de versiones tarifarias | Autor, firmas, normas, simulación, hash | Rango | O4 | M04 REP-TAR-16 |
| REP-TAR-017 | Usuarios-generadores | Demanda, inyección, créditos (MER-001) | Período | O7 | M04 REP-TAR-17 |

#### 15.4.3 Facturación y fiscal (M05, M06)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-FAC-001 | Facturación por período | Por servicio, concepto, categoría, condición fiscal: neto, IVA, otros tributos, total, cantidad | Rango (`PRM-FAC-152`) | O4 | M05 §15 |
| REP-FAC-002 | Movimiento por concepto | Por concepto: cantidad, importe; filtro subtipo (V2 #3095) | Rango (emisión) | O4 | M05 §15 |
| REP-FAC-003 | Diferencias entre conceptos | Δ importe y cantidad por concepto entre dos períodos/lotes | Dos períodos | O4 | M05 §15 |
| REP-FAC-004 | Diferencias entre cuentas | Δ total por cuenta, con o sin financiaciones | Dos períodos | O4 | M05 §15 |
| REP-FAC-005 | Cuadre del lote/ciclo | Seleccionados = emitidos + pendientes + excluidos + trasladados | Corrida | O4 | M05 §15 |
| REP-FAC-006 | Excepciones por motivo y antigüedad | Por motivo, responsable, tramo 0–2/3–7/> 7 días, vencidas por SLA | Snap | O4 | M05 §15 |
| REP-FAC-007 | Pendientes de autorización | `pending/queued/uncertain/rejected` por PV y antigüedad | Snap | O4 | M05 §15 |
| REP-FAC-008 | Numeración utilizada | Rangos por tipo y PV; huecos (= 0 en electrónicos) | Rango | O4 | M05 §15 |
| REP-FAC-009 | Comprobantes bloqueados | Por causa, antigüedad, saldo | Snap | O4 | M05 §15 |
| REP-FAC-010 | NC, ND y anulaciones | Por motivo, usuario, aprobador, importe, original | Rango | O4 | M05 §15 |
| REP-FAC-011 | Entregas de comprobantes | Por canal y estado; rebote; devoluciones de papel por ruta | Rango | O4 | M05 §15 |
| REP-FAC-012 | Comparación con período anterior | Variación % e importe del lote; casos sobre umbral | Prefacturación | O4 | M05 §15 |
| REP-FAC-013 | Ranking de cuentas por facturación **(T10)** | Top N (PRM-BIA-067) por facturado del período, empates por identificador (RN-BIA-046) | Rango | O4 | INV `TipoInforme.Ranking_de_Clientes` |
| REP-FIS-001 | Libro IVA Ventas | Por comprobante: no gravado, exento, gravado e IVA por alícuota, percepciones, total | Período fiscal | O4 | M06 §15 |
| REP-FIS-002 | Carátula del libro IVA | Σ por condición y alícuota; LQSP aparte | Período fiscal | O4 | M06 §15 |
| REP-FIS-003 | Libro IVA Compras | Gravado, no gravado, exento, IVA por alícuota, percepciones sufridas | Período (fecha contable) | O8 | M06 §15 |
| REP-FIS-004 | Posición mensual de IVA | IVA débito − crédito − percepciones/retenciones sufridas | Fin de período | O8 | M06 §15 |
| REP-FIS-005 | Percepciones practicadas | Por régimen, jurisdicción, cuenta, CUIT y comprobante | Período | O4 | M06 §15 |
| REP-FIS-006 | Retenciones practicadas | Por tipo, régimen, proveedor | Período de información | O8 | M06 §15 |
| REP-FIS-007 | Retenciones sufridas | Por tipo y agente | Rango (fecha de cobro) | O5 | M06 §15 |
| REP-FIS-008 | Bases por jurisdicción (Convenio Multilateral) | Σ bases y percepciones por jurisdicción | Período | O8 | M06 §15 |
| REP-FIS-009 | Tablero de autorizaciones | Por estado, punto y tipo; tiempo medio; % rechazo; inciertos | Snap / día | O4 | M06 §15 |
| REP-FIS-010 | Conciliación ARCA | Comprobantes con CAE/importe distinto o inexistente | Corrida | O4 | M06 §15 |
| REP-FIS-011 | Conciliación Mis Comprobantes | Inexistentes en CoopApps, en ARCA, diferencias | Período | O8 | M06 §15 |
| REP-FIS-012 | Rendición por convenio de terceros | Facturado, cobrado, comisión, neto a rendir, pendiente | Período | O4 | M06 §15 |
| REP-FIS-013 | Impuestos facturados por categoría | Σ por servicio, categoría e impuesto (selección guardada) | Período | O4 | M06 §15 |
| REP-FIS-014 | Calendario y cumplimiento | Declaraciones a tiempo, vencidas, rechazadas, rectificadas | Vencimiento | O8 | M06 §15 |
| REP-FIS-015 | Vencimientos de credenciales y autorizaciones | Certificados, CAI, CESP, CAEA, padrones por días a vencer | Día | O4 | M06 §15 |
| REP-FIS-016 | Informe de padrón | Diferencias de condición IVA/monotributo/IIBB | Fecha del padrón | O4 | M06 §15 |

#### 15.4.4 Cuenta corriente, cobranza y mora (M07, M08)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-COB-001 | Estado de cuenta del titular | Movimientos y saldo acumulado; obligaciones abiertas por servicio | asOf | O5 | M07 REP-COB-01 |
| REP-COB-002 | Antigüedad de saldos (aging) | Saldo abierto 0–30, 31–60, 61–90, 91–180, > 180 días desde 1.er vto | asOf | O5 | M07 REP-COB-02 |
| REP-COB-003 | Cartera por servicio y período | Σ importe, Σ imputado, saldo | asOf | O5 | M07 REP-COB-03 |
| REP-COB-004 | Cobranza diaria por canal | Σ recibos por canal, medio, servicio; recargos e intereses aparte | Rango (cobro) | O5 | M07 REP-COB-04 |
| REP-COB-005 | Planilla de caja / presentación del cajero | Operaciones de la sesión, totales por medio, diferencias; filtro "excluir importes en cero" (V2 #2951) | Sesión | O5 | M07 REP-COB-05 |
| REP-COB-006 | Arqueos y diferencias | Teórico, declarado, diferencia, aprobador | Rango | O5 | M07 REP-COB-06 |
| REP-COB-007 | Recibos anulados | Motivo, usuario, autorizante | Rango | O5 | M07 REP-COB-07 |
| REP-COB-008 | Cambios de recargo y notas desmarcadas | Auditoría de acciones sensibles de caja | Rango | O5 | M07 REP-COB-08 |
| REP-COB-009 | Rendiciones de entes | Leídos, aplicados, advertencias, errores, comisión, neto esperado | Fecha de presentación | O5 | M07 REP-COB-09 |
| REP-COB-010 | Conciliación de cobranzas | Bruto − comisión − IVA − retenciones = neto esperado vs acreditado | Día y canal | O5 | M07 REP-COB-10 |
| REP-COB-011 | Débito automático | Presentado, aceptado, rechazado por código; rechazados / presentados | Lote / rango | O5 | M07 REP-COB-11 |
| REP-COB-012 | Adhesiones | Altas, bajas, suspensiones, activas por ente | asOf | O5 | M07 REP-COB-12 |
| REP-COB-013 | Intenciones de pago | Por estado y conector; pagadas / emitidas | Rango | O5 | M07 REP-COB-13 |
| REP-COB-014 | Comisiones de canales | Σ comisiones y su IVA | Rango (acreditación) | O5 | M07 REP-COB-14 |
| REP-COB-015 | Saldos a favor | Abiertos por origen y antigüedad | asOf | O5 | M07 REP-COB-15 |
| REP-COB-016 | No identificados | Pendientes por canal y antigüedad | asOf | O5 | M07 REP-COB-16 |
| REP-COB-017 | Devoluciones y contracargos | Expedientes por estado e importe | Rango | O5 | M07 REP-COB-17 |
| REP-COB-018 | Cobradores | Cobrado, rendido, diferencias, comisión | Rango | O5 | M07 REP-COB-18 |
| REP-COB-019 | Terceros | Cobrado por tercero, comisión, rendido | Rango | O5 | M07 REP-COB-19 |
| REP-COB-020 | Cobranza por esquema | Agrupación por productos/impuestos según `collectionReportSchemes` (ex `ESQUEMAS_INFORMES_COBRANZAS`) | Rango (cobro) | O5 | M07 REP-COB-20 |
| REP-COB-021 | Integridad del auxiliar | Resultado de JOB-COB-14; diferencias abiertas | Corrida | O5 | M07 REP-COB-21 |
| REP-COB-022 | Cumplimiento del mínimo de pago | Cuentas con mínimo, pagado, cumplido | Fecha de evaluación | O5 | M07 REP-COB-22 |
| REP-COB-023 | Excepciones de cobranza | Abiertas por tipo, severidad y antigüedad | asOf | O5 | M07 REP-COB-23 |
| REP-COB-024 | Universo de comprobante **(T10)** | Por comprobante: emitido, cancelado (Σ imputaciones confirmadas), saldo, pagos en proceso aparte, acreditación neta como dato separado (CU-30, RF-BIA-093) | asOf | O5 | BASE §30 CU-30 |
| REP-COB-025 | Cobros con fecha de cobro distinta de la registración **(T10)** | Pagos con \|fecha de cobro − `recordedAt`\| > `PRM-BIA-025` días (RN-BIA-051) | Rango | O5 | INV `clsInformes_Caja.Fecha_Cobro_Distintas` |
| REP-MOR-001 | Deuda vencida por antigüedad | Tramos 0–30 … > 365 desde VTO1; deuda actualizada al corte | asOf | O6 | M08 REP-MOR-01 |
| REP-MOR-002 | Titulares notificados | Deuda notificada, actualizada y detalle | asOf | O6 | M08 REP-MOR-02 |
| REP-MOR-003 | Notificaciones pendientes | Por instancia, lote y estado de entrega | asOf | O6 | M08 REP-MOR-03 |
| REP-MOR-004 | Servicios a cortar | Meses de deuda = ⌊(corte − VTO1 más antiguo)/30⌋ y días exactos (RN-BIA-057); bloqueados aparte | Fecha del informe | O6 | M08 REP-MOR-04 |
| REP-MOR-005 | Totales por servicio del lote | Cuentas, documentos e importe por servicio | Lote | O6 | M08 REP-MOR-05 |
| REP-MOR-006 | Excepciones por mora | Cuenta, tipo, alcance, vigencia, autorizante | asOf | O6 | M08 REP-MOR-06 |
| REP-MOR-007 | Promesas de pago | Cumplidas / vencidas | Rango | O6 | M08 REP-MOR-07 |
| REP-MOR-008 | Resumen de notificaciones | Generadas, entregadas con/sin evidencia, pagadas, bajas, cerradas | Rango | O6 | M08 REP-MOR-08 |
| REP-MOR-009 | Circulares | Lista para impresión/envío; bajas solo con PRM-MOR-101 (V2 #2306) | Fecha de impresión | O6 | M08 REP-MOR-09 |
| REP-MOR-010 | Deuda a prescribir | Documentos con prescripción en N días (RN-BIA-056) | asOf | O6 | M08 REP-MOR-10 |
| REP-MOR-011 | Casos de interrupción | Por tipo y estado; tiempo solicitud → ejecución | Rango | O6 | M08 REP-MOR-11 |
| REP-MOR-012 | Tiempo de reconexión | Mediana y p90 de ejecución − pago habilitante | Rango | O6 | M08 REP-MOR-12 |
| REP-MOR-013 | Bloqueos por protección | Por causa (electrodependiente, entidad pública, reclamo, pago informado, evidencia, ventana) | Rango | O6 | M08 REP-MOR-13 |
| REP-MOR-014 | Recupero por instancia | Cobrado hasta 30 días post vencimiento / deuda notificada | Rango | O6 | M08 REP-MOR-14 |
| REP-MOR-015 | Intereses cobrados y facturados | Neto, IVA, percepciones por tipo; dispensas aparte | Rango | O6 | M08 REP-MOR-15 |
| REP-MOR-016 | Intereses diferidos pendientes | Cuenta, servicio, neto, antigüedad | asOf | O6 | M08 REP-MOR-16 |
| REP-MOR-017 | Financiaciones del período | Por plan: cantidad, deuda, quitas, anticipo, capital, interés, CFT ponderado | Rango | O6 | M08 REP-MOR-17 |
| REP-MOR-018 | Comprobantes y conceptos financiados | Documento de origen, concepto, importe, convenio | Rango | O6 | M08 REP-MOR-18 |
| REP-MOR-019 | Cuotas de convenios | Por cuota: vencimiento, capital, interés, IVA, pagado, saldo, estado | asOf | O6 | M08 REP-MOR-19 |
| REP-MOR-020 | Cuotas adeudadas a fecha | Vencidas impagas; anuladas en sección aparte | asOf | O6 | M08 REP-MOR-20 |
| REP-MOR-021 | Cartera de convenios | Vigentes, en atraso, caídos, rehabilitados; tasa de caída; "no incluir cancelados" también para chequera (RN-BIA-052) | asOf | O6 | M08 REP-MOR-21 |
| REP-MOR-022 | Garantías | Vigentes, ejecutadas, devueltas; depósitos actualizados | asOf | O6 | M08 REP-MOR-22 |
| REP-MOR-023 | Gestión externa y judicial | Por estudio: asignados, recuperado, costos, honorarios | Rango | O6 | M08 REP-MOR-23 |
| REP-MOR-024 | Incobrables | Previsionado, castigado, recuperado, revertido | Rango | O6 | M08 REP-MOR-24 |
| REP-MOR-025 | Exportación regulatoria de condición de mora | Código "R/C" o "A" por cuenta (DNU 311/2020) | Fecha del regulador | O6 | M08 REP-MOR-25 |
| REP-MOR-026 | Exportación a envío masivo | Cuenta, comprobantes, deuda, correo; excluye sin consentimiento (ex Doppler) | Fecha de exportación | O6 | M08 REP-MOR-26 |
| REP-MOR-027 | Tablero de mora | Deuda vencida, instancias, recupero, promesas, casos, convenios (enlaza a informes fuente) | Día | O6 | M08 REP-MOR-27 |
| REP-MOR-028 | Conciliación del módulo de mora | Interés liquidado = cargos M05 origen M08; sustituciones; casos ejecutados | Día | O6 | M08 REP-MOR-28 |
| REP-MOR-029 | Paralelo de recargo ProCoop vs CoopApps | Diferencia por documento y causa | Fecha del paralelo | O11 | M08 REP-MOR-29 |

#### 15.4.5 Atención y técnica (M09, M10)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-CRM-001 | Casos abiertos por estado, área, servicio, prioridad | Conteo de no finales | Snap / fin de día | O2 | M09 REP-CRM-01 |
| REP-CRM-002 | Tiempo de primera respuesta | Mediana y p90 sin pausas | Rango | O2 | M09 REP-CRM-02 |
| REP-CRM-003 | Tiempo de resolución | Mediana, promedio, p90 | Rango | O2 | M09 REP-CRM-03 |
| REP-CRM-004 | Cumplimiento SLA | Resueltos sin incumplimiento / resueltos con SLA × 100 | Rango | O2 | M09 REP-CRM-04 |
| REP-CRM-005 | Backlog y antigüedad | Tramos 0–2, 3–7, 8–15, 16–30, > 30 | Snap | O2 | M09 REP-CRM-05 |
| REP-CRM-006 | Reincidencias de casos | > 1 caso por cuenta / cuenta+servicio / +tipo (RN-BIA-053) | Rango | O2 | M09 REP-CRM-06 |
| REP-CRM-007 | Tasa de reapertura | `reopenCount > 0` / cerrados | Rango | O2 | M09 REP-CRM-07 |
| REP-CRM-008 | Estadísticas de demora (heredado) | Pendientes, resueltos dentro/después, no resueltos; demora piso 0; período anterior | Rango | O2 | M09 REP-CRM-08 |
| REP-CRM-009 | Satisfacción CSAT / NPS | CSAT = 4–5 / respuestas; NPS = %prom − %detr | Rango | O2 | M09 REP-CRM-09 |
| REP-CRM-010 | Resolución en primer contacto | Una interacción y sin derivación / cerrados | Rango | O2 | M09 REP-CRM-10 |
| REP-CRM-011 | Volumen por canal, servicio, tipo y motivo | Conteo | Rango | O2 | M09 REP-CRM-11 |
| REP-CRM-012 | Incidentes | Cantidad, afectados, duración, casos por incidente | Rango | O2 | M09 REP-CRM-12 |
| REP-CRM-013 | Bajas recibidas y constancias en plazo | % constancias ≤ 24 h | Rango | O2 | M09 REP-CRM-13 |
| REP-CRM-014 | Solicitudes comerciales | Tiempo a fecha efectiva; aprobación; desistimientos | Rango | O2 | M09 REP-CRM-14 |
| REP-CRM-015 | Bot | Contención = autoservidas / sesiones; traspasos; abandonos | Rango | O2 | M09 REP-CRM-15 |
| REP-CRM-016 | IA de atención | Aceptación, corrección, descarte por función | Rango | O2 | M09 REP-CRM-16 |
| REP-CRM-017 | Turnero | Ingresados, atendidos, abandonos, prioritarios, espera y atención por día/hora | Rango | O10 | M09 REP-CRM-17 |
| REP-CRM-018 | Actividades internas | % cerradas en término; atraso promedio | Rango | O10 | M09 REP-CRM-18 |
| REP-CRM-019 | Mesa de entradas | Entradas, pendientes, vencidas, tiempo de respuesta | Rango | O2 | M09 REP-CRM-19 |
| REP-CRM-020 | Desvío de fecha compromiso | Cierre − compromiso | Rango | O2 | M09 REP-CRM-20 |
| REP-CRM-021 | Pendientes por usuario | Sin intervención 7 días y 8+ días | Snap | O2 | M09 REP-CRM-21 |
| REP-CRM-022 | Horas por proyecto/cuenta | Reales, a facturar, cubiertos por bolsa, facturados | Rango | O10 | M09 REP-CRM-22 |
| REP-CRM-023 | Trámites presentados/no presentados/vencidos | Conteos por tipo | Snap | O2 | M09 REP-CRM-23 |
| REP-CRM-024 | Comunicación de circulares | Destinatarios, entregados, fallidos, impresos | Corrida | O2 | M09 REP-CRM-24 |
| REP-CRM-025 | Operaciones por usuario | Creados, mensajes, asignaciones, cerrados, cancelados | Rango | O2 | M09 REP-CRM-25 |
| REP-CRM-026 | Reclamos del socio sobre casos en curso | Mensajes marcados como reclamo | Snap | O2 | M09 REP-CRM-26 |
| REP-CRM-027 | Desvío de estimación de tiempo | (reales − estimados) / estimados | Rango | O10 | M09 REP-CRM-27 |
| REP-CRM-028 | Calidad de atención regulatoria | Tiempos por tipo regulatorio | Período del informe | O7 | M09 REP-CRM-28 |
| REP-TEC-001 | OT por estado | Conteo por estado; vista mapa y KML/GeoJSON por estado (RF-BIA-020) | Snap | O3 | M10 REP-TEC-01 |
| REP-TEC-002 | Backlog y antigüedad de OT | 0–2, 3–7, 8–15, > 15 días | Snap | O3 | M10 REP-TEC-02 |
| REP-TEC-003 | Cumplimiento de SLA de OT | Cerradas en término / cerradas | Rango | O3 | M10 REP-TEC-03 |
| REP-TEC-004 | Tiempo medio de resolución de OT | Promedio de cierre − solicitud | Rango | O3 | M10 REP-TEC-04 |
| REP-TEC-005 | Primera visita exitosa | Activadas con una visita / activadas | Rango | O3 | M10 REP-TEC-05 |
| REP-TEC-006 | Visitas fallidas por motivo | Conteo por `failureReason` | Rango | O3 | M10 REP-TEC-06 |
| REP-TEC-007 | Puntualidad | Llegadas en franja / visitas completadas | Rango | O3 | M10 REP-TEC-07 |
| REP-TEC-008 | Ocupación de agenda | Reservas / capacidad por zona y día | Rango | O3 | M10 REP-TEC-08 |
| REP-TEC-009 | Productividad por recurso | OT, horas y OT por jornada por técnico/cuadrilla | Rango | O3 | M10 REP-TEC-09 |
| REP-TEC-010 | Costo de OT | Materiales × costo + horas × tarifa vigente a la fecha (valor hora como parámetro, RN-BIA-001) | Rango | O3 | M10 REP-TEC-10 |
| REP-TEC-011 | Consumo de materiales | Usado y devuelto por ítem, servicio, cuadrilla | Rango | O3 | M10 REP-TEC-11 |
| REP-TEC-012 | Factibilidades | Por resultado; factibles / dictaminadas; tiempo de dictamen | Rango | O3 | M10 REP-TEC-12 |
| REP-TEC-013 | Satisfacción post instalación | Promedio y % ≤ umbral | Rango | O3 | M10 REP-TEC-13 |
| REP-TEC-014 | Sincronización y conflictos | Mutaciones por resultado; conflictos abiertos | Rango | O3 | M10 REP-TEC-14 |
| REP-TEC-015 | Aprovisionamiento | Comandos por estado y sistema; éxito al primer intento | Rango | O3 | M10 REP-TEC-15 |
| REP-TEC-016 | Cortes y reconexiones ejecutados | Por modo; tiempo orden → ejecución | Rango | O6 | M10 REP-TEC-16 |
| REP-TEC-017 | Interrupciones del servicio | Cantidad, duración, contratos afectados, críticos | Rango | O7 | M10 REP-TEC-17 |
| REP-TEC-018 | Red instalada | Elementos por tipo/estado/capa; ocupación | Snap | O7 | M10 REP-TEC-18 |
| REP-TEC-019 | Mantenimiento preventivo | Ejecutados en término / programados | Rango | O7 | M10 REP-TEC-19 |
| REP-TEC-020 | Obras y contribución | Avance; cobrado / emitido por obra | asOf | O7 | M10 REP-TEC-20 |
| REP-TEC-021 | Inspecciones | Por estado; irregularidades / inspeccionadas; recupero | Rango | O7 | M10 REP-TEC-21 |
| REP-TEC-022 | Importación de CDR | Importadas, duplicadas, no atribuidas por central | Rango | O10 | M10 REP-TEC-22 |
| REP-TEC-023 | Comprobante de OT | Documento por plantilla (mapa, vales, incidentes) | Corrida | O3 | M10 REP-TEC-23 |
| REP-TEC-024 | Exportaciones GIS/regulatorias | Según `gisExportTemplates` | Período | O7 | M10 REP-TEC-24 |
| REP-TEC-025 | Estadísticas de demora de OT (heredado) **(T10)** | Demora en días desde fecha de la orden y desde ingreso hasta confirmación o "ahora", piso 0; período anterior de igual duración (RN-BIA-055) | Rango | O3 | RN-07 §1.11 `Get_Reporte_Estadisticas` |
| REP-TEC-026 | Reincidencias de OT **(T10)** | Grupos con > 1 OT por cuenta / cuenta+servicio / +operación en la ventana `PRM-BIA-026` (RN-BIA-053) | Rango | O3 | RN-07 §1.11 |
| REP-TEC-027 | Recursos asignados a obras **(T10)** | Horas normales y extra × valor hora ingresado como parámetro de la corrida (nunca sobrescribe configuración, RN-BIA-001) | Rango | O7 | RN-07 §1.11 |
| REP-TEC-028 | Parte diario de técnica **(T10)** | OT y visitas del día por cuadrilla; fechas obligatorias (RN-BIA-012) | Día | O3 | RN-07 §1.11 |
| REP-TEC-029 | Controles de calidad del agua | Muestras por punto y parámetro; resultados fuera de límite / muestras analizadas; acciones correctivas (solo si PRM-TEC-157 está activo; PA-TEC-20, HUE-AG-01) | Rango | O7 | M10 REP-TEC-29 |
| REP-TEC-030 | Guardias y emergencias | Por tipo de emergencia: tiempo de aceptación, arribo y zona segura (mediana y p90); escalamientos por nivel; huecos de cobertura de guardia (HUE-GAS-05) | Rango | O7 | M10 REP-TEC-30 |

#### 15.4.6 ERP: ventas, compras, stock, tesorería, contabilidad y sueldos (M11–M16)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-VEN-001 | Cargos por operación | Σ importe − descuento por estado, tipo, servicio | Rango (`effectiveDate`) | O3 | M11 REP-VEN-01 |
| REP-VEN-002 | Presupuestos por estado y vendedor | Cantidad e importe de la versión vigente | Rango | O8 | M11 REP-VEN-02 |
| REP-VEN-003 | Conversión de presupuestos | Aceptados / enviados; tiempo envío → aceptación | Rango | O8 | M11 REP-VEN-03 |
| REP-VEN-004 | Presupuesto (documento) y notas | Ítems, conjuntos, prorrateos, condiciones | Corrida | O8 | M11 REP-VEN-04 |
| REP-VEN-005 | Ventas de productos | Neto, IVA, total por producto, rubro, servicio, sucursal, vendedor, forma de pago | Rango | O8 | M11 REP-VEN-05 |
| REP-VEN-006 | Detalle de ventas | Cuotas informadas como exento/excluido (P403) | Rango | O8 | M11 REP-VEN-06 |
| REP-VEN-007 | Facturado no entregado (ventas) | Σ pendiente de entrega por producto y depósito | Snap | O8 | M11 REP-VEN-07 |
| REP-VEN-008 | Cuotas facturadas y pendientes | Capital, interés, IVA por estado y vencimiento | Rango | O8 | M11 REP-VEN-08 |
| REP-VEN-009 | Comprobantes no facturados | Ventas/presupuestos para facturar sin comprobante | Snap | O8 | M11 REP-VEN-09 |
| REP-VEN-010 | Devoluciones de ventas | Cantidad e importe por motivo | Rango | O8 | M11 REP-VEN-10 |
| REP-VEN-011 | Liquidación de crédito | Capital, interés, TEA, CFT, cronograma | Corrida | O8 | M11 REP-VEN-11 |
| REP-VEN-012 | Rendición de viajes | Km, flete, precio por km, peajes, viáticos, combustible | Rango | O8 | M11 REP-VEN-12 |
| REP-VEN-013 | Arqueo de POS | Ventas y cobros por medio vs contado | Rango | O8 | M11 REP-VEN-13 |
| REP-VEN-014 | Ventas y presupuestos por vendedor | Cantidad, importe, conversión, devoluciones | Rango | O8 | M11 REP-VEN-14 |
| REP-VEN-015 | Cartera de cuotas comerciales | Capital pendiente por antigüedad (separado de convenios M08) | asOf | O8 | M11 REP-VEN-15 |
| REP-CMP-001 | Solicitudes por estado y aprobación | Cantidad y monto estimado | Rango | O8 | M12 REP-CMP-01 |
| REP-CMP-002 | Comparativo de cotizaciones | Precio por ítem y proveedor; diferencia vs menor | Corrida | O8 | M12 REP-CMP-02 |
| REP-CMP-003 | OC pendientes de recepción y atrasadas | Σ pendiente valorizado; días de atraso | Snap | O8 | M12 REP-CMP-03 |
| REP-CMP-004 | Recepciones pendientes de facturar | Σ pendiente valorizado | Snap | O8 | M12 REP-CMP-04 |
| REP-CMP-005 | Facturas sin OC | Ítems sin vínculo con OC | Rango | O8 | M12 REP-CMP-05 |
| REP-CMP-006 | Diferencias de comprobantes | 4 controles de totales e IVA | Rango | O8 | M12 REP-CMP-06 |
| REP-CMP-007 | Excepciones de 3 vías | Por tipo, importe en disputa, antigüedad | Rango | O8 | M12 REP-CMP-07 |
| REP-CMP-008 | Cuenta corriente y antigüedad de proveedores | Saldo y tramos por vencimiento | asOf | O8 | M12 REP-CMP-08 |
| REP-CMP-009 | Compras por servicio, centro, rubro, proveedor, producto | Σ neto distribuido sin duplicar | Rango | O8 | M12 REP-CMP-09 |
| REP-CMP-010 | Comprometido, devengado y pagado (compras) | Tres columnas no sumadas (AGR-028) | asOf | O8 | M12 REP-CMP-10 |
| REP-CMP-011 | Previsiones de pagos | Previsiones + facturas por vencer + cheques no debitados | Rango futuro | O8 | M12 REP-CMP-11 |
| REP-CMP-012 | Pagos pendientes de salida y diferidos (compras) | OP − movido en M14 | Snap | O8 | M12 REP-CMP-12 |
| REP-CMP-013 | Desempeño de proveedores | % a término, diferencias, devoluciones, puntaje | Rango | O8 | M12 REP-CMP-13 |
| REP-CMP-014 | Costo de reposición (compras) | (reposición − stock) × costo | Snap | O8 | M12 REP-CMP-14 |
| REP-CMP-015 | Retenciones practicadas por OP | Detalle desde M06 | Rango | O8 | M12 REP-CMP-15 |
| REP-CMP-016 | Proveedores alcanzados por regímenes especiales | Filtro por marca/padrón [VERIFICAR] | Snap | O8 | M12 REP-CMP-16 |
| REP-CMP-017 | Recibidos vs registrados (Mis Comprobantes) | Faltantes, sobrantes, diferencias | Período | O8 | M12 REP-CMP-17 |
| REP-CMP-018 | Consumo de combustible | Σ litros y km | Rango | O8 | M12 REP-CMP-18 |
| REP-STK-001 | Existencias | Σ por estado y custodia; disponible − reservado | asOf (hora) | O3 | M13 `stock-on-hand` |
| REP-STK-002 | Existencias por custodia | Cantidad y valor por tipo de custodia | asOf | O3 | M13 `stock-by-custody` |
| REP-STK-003 | Kárdex | Saldo inicial + entradas − salidas = final, con costo | Rango | O3 | M13 `kardex` |
| REP-STK-004 | Trayectoria de series | Eventos de la unidad | Rango | O3 | M13 `serial-trajectory` |
| REP-STK-005 | Equipos en domicilios | Por servicio, modelo, modalidad, zona; antigüedad | asOf | O3 | M13 `customer-equipment` |
| REP-STK-006 | Equipos pendientes de devolución | Días vencidos; valor de reposición | asOf | O3 | M13 `pending-returns` |
| REP-STK-007 | Saldo por cuadrilla | Por artículo/serie con antigüedad | asOf | O3 | M13 `crew-custody` |
| REP-STK-008 | Materiales por OT/OM | Reservado, entregado, consumido, devuelto; costo | Rango | O3 | M13 `wo-materials` |
| REP-STK-009 | Costo de OT/OM | Materiales + horas | Rango | O8 | M13 `wo-cost` |
| REP-STK-010 | Consumos por destino | Por OT, obra, servicio, centro, unidad de gasto | Rango | O8 | M13 `consumption-by-destination` |
| REP-STK-011 | Stock y consumo por servicio | Σ servicios = total | asOf / Rango | O8 | M13 `stock-by-service` |
| REP-STK-012 | Valorización | Perpetuo y alternativos; negativos aparte | asOf | O8 | M13 `valuation` |
| REP-STK-013 | Conciliación stock–contabilidad | Valor por custodia vs saldos contables | Cierre | O8 | M13 `valuation-reconciliation` |
| REP-STK-014 | Bajo mínimo y sugerencias | RN-STK-043 | Snap | O8 | M13 `below-minimum` |
| REP-STK-015 | Costo de reposición (stock) | (`CAN_REP` − stock) × costo × bultos | Snap | O8 | M13 `replacement-cost` |
| REP-STK-016 | Ajustes y diferencias | Por motivo, depósito, responsable | Rango | O8 | M13 `adjustments` |
| REP-STK-017 | Resultado de inventario | Esperado, contado, diferencias, series faltantes | Cierre | O8 | M13 `physical-count` |
| REP-STK-018 | Facturado no entregado (stock) | Σ pendientes | Snap | O8 | M13 `pending-delivery` |
| REP-STK-019 | Consignaciones | Unidades fuera sin facturar | asOf | O8 | M13 `consignment` |
| REP-STK-020 | Lotes por vencer | Días a vencimiento | asOf | O8 | M13 `lots-expiry` |
| REP-STK-021 | Revaluaciones | Factores y diferencias | Rango | O8 | M13 `revaluations` |
| REP-STK-022 | Cuadro de bienes de uso | Origen + mejoras − disminuciones | Ejercicio | O8 | M13 `fixed-assets-schedule` |
| REP-STK-023 | Cuadro de amortizaciones | Apertura, ejercicio, cierre; histórico/ajustado | Ejercicio | O8 | M13 `depreciation-schedule` |
| REP-STK-024 | Bienes y amortización por centro | Distribución por centro | Rango | O8 | M13 `fixed-assets-by-cost-center` |
| REP-STK-025 | RMA por estado y proveedor | Tiempos, en garantía, resolución | asOf | O8 | M13 `rma-status` |
| REP-STK-026 | Tasa de falla por modelo | RMA y cambios / unidades instaladas | Rango | O8 | M13 `equipment-failure-rate` |
| REP-STK-027 | Recepciones técnicas | Por estado | Rango | O8 | M13 `service-receptions` |
| REP-STK-028 | Insumos pendientes de utilizar | Requerido − consumido | Snap | O10 | M13 `mfg-pending-supplies` |
| REP-STK-029 | Matrículas generadas | Series de fabricados | Rango | O10 | M13 `mfg-registrations` |
| REP-STK-030 | Órdenes de fabricación | Estado, avance, plazos | Rango | O10 | M13 `mfg-orders` |
| REP-STK-031 | Productos dañados | Por tipo de daño | Rango | O10 | M13 `mfg-damaged` |
| REP-STK-032 | Componentes agrupados | Σ componentes por artículo | Rango | O10 | M13 `mfg-components-grouped` |
| REP-TES-001 | Planilla diaria de tesorería | Saldo anterior + ingresos − egresos = saldo final | Día (fecha valor) | O8 | M14 RF-TES-166 |
| REP-TES-002 | Composición de cartera | Efectivo + valores + cupones + retenciones + presentados | Snap | O8 | M14 RF-TES-167 |
| REP-TES-003 | Disponibilidades | Saldo operativo y contable; ME × cotización | Snap | O8 | M14 RF-TES-168 |
| REP-TES-004 | Saldos de bancos y a futuro | Operativo y contable; a futuro | asOf / Rango | O8 | M14 RF-TES-169 |
| REP-TES-005 | Libro de bancos | Saldo inicial + movimientos no anulados | Rango | O8 | M14 RF-TES-170 |
| REP-TES-006 | Cheques y transferencias no debitados | Por semana de fecha de pago | Snap | O8 | M14 RF-TES-171 |
| REP-TES-007 | Previsiones / flujo de fondos | Proyección M14 §9.12 | Fecha base + horizonte | O8 | M14 RF-TES-172 |
| REP-TES-008 | Cupones y cobranza de tarjetas | Por estado; retención SUSS calculada | Rango | O8 | M14 RF-TES-173 |
| REP-TES-009 | Listados de valores | Por estado y tipo de fecha | Rango | O8 | M14 RF-TES-174 |
| REP-TES-010 | Movimientos conciliados / no conciliados | Por fecha de conciliación | Rango | O8 | M14 RF-TES-175 |
| REP-TES-011 | Depósitos a acreditar | Fecha probable ≤ corte | asOf | O8 | M14 RF-TES-176 |
| REP-TES-012 | Retenciones recibidas | Por tipo, agente, estado, cómputo | Rango | O8 | M14 RF-TES-177 |
| REP-TES-013 | Cajas abiertas y cerradas | Cobranza, pagos y tesorería | Rango | O8 | M14 RF-TES-178 |
| REP-TES-014 | Gastos financieros | Σ por clase y cuenta | Rango | O8 | M14 RF-TES-179 |
| REP-TES-015 | Reporte de conciliación bancaria | Fórmula RF-TES-036 con partidas y antigüedad | asOf | O8 | M14 RF-TES-180 |
| REP-TES-016 | Pagos pendientes de salida y diferidos (tesorería) | RN-TES-055, RN-TES-056 | Snap | O8 | M14 RF-TES-121 |
| REP-TES-017 | Comprometido / devengado / pagado (tesorería) | Por servicio/centro, sin sumar estados | Rango | O8 | M14 RF-TES-158 |
| REP-CON-001 | Libro diario | Asientos con renglones; debe = haber | Rango | O5 | M15 §15 |
| REP-CON-002 | Libro diario rubricado | Folio, rúbrica, transporte | Rango | O8 | M15 §15 |
| REP-CON-003 | Mayor | Saldo anterior + debe − haber por movimiento | Rango | O5 | M15 §15 |
| REP-CON-004 | Sumas y saldos | Saldo inicial, debe, haber, final; Σ debe = Σ haber | Rango | O5 | M15 §15 |
| REP-CON-005 | Balance de saldos por rubro | Saldos por rubro y subrubro | asOf | O8 | M15 §15 |
| REP-CON-006 | Transacciones por cuenta / documento | Renglones con documento de origen y evento | Rango | O5 | M15 §15 |
| REP-CON-007 | Estado de situación patrimonial | Activo = pasivo + PN; corriente/no corriente | Ejercicio | O8 | M15 §15 |
| REP-CON-008 | Estado de resultados | Ingresos − costos − gastos ± financieros y RECPAM | Ejercicio | O8 | M15 §15 |
| REP-CON-009 | Evolución del patrimonio neto | Saldo inicial + movimientos = final | Ejercicio | O8 | M15 §15 |
| REP-CON-010 | Flujo de efectivo | Método indirecto | Ejercicio | O8 | M15 §15 |
| REP-CON-011 | Anexo de bienes de uso | Origen y amortización inicial/altas/bajas/final | Ejercicio | O8 | M15 §15 |
| REP-CON-012 | Anexo de gastos | Por naturaleza y función | Ejercicio | O8 | M15 §15 |
| REP-CON-013 | Resultado por servicio / sección | Directos − costos directos − comunes distribuidos | Rango | O8 | M15 §15 |
| REP-CON-014 | Ejecución presupuestaria | Presupuestado, comprometido, devengado, pagado, disponible; % | Rango | O8 | M15 §15 |
| REP-CON-015 | Conciliación de auxiliares | Auxiliar − cuenta de control por clave (créditos por servicios = saldo del auxiliar M07) | asOf | O5 | M15 §15 |
| REP-CON-016 | Anticipos y saldos a favor a una fecha | Σ por socio y servicio reconstruido | asOf | O5 | M15 §15 |
| REP-CON-017 | Control previo al cierre | Bloqueantes del checklist | Período | O8 | M15 §15 |
| REP-CON-018 | Cuadro de distribución de excedentes | Excedente repartible, reservas, interés, retornos | Ejercicio | O10 | M15 §15 |
| REP-CON-019 | Exportaciones OCEBA y FEDECOBA | Mapeo `regulatoryMapping` | Ejercicio | O8 | M15 §15 |
| REP-CON-020 | Servicios conectados | Contratos `active` + `suspended` al corte (condición 2/3 de SERSOC) | asOf | O5 | M15 §15 (indicadores `clsInformes_Contabilidad`) |
| REP-CON-021 | Servicio tomado vs facturado | Contratos activos − contratos con factura en el período | Rango | O5 | ídem |
| REP-CON-022 | Cobranza por caja vs banco | Σ cobros por canal / Σ cobros | Rango | O5 | ídem |
| REP-CON-023 | Cobranza vs facturado al 1.er vencimiento | Σ cobrado hasta 1.er vto / Σ facturado del período | Rango | O5 | ídem |
| REP-CON-024 | Composición de deuda por servicio y antigüedad | Saldo por servicio y tramo (fuente M07) | asOf | O5 | ídem |
| REP-CON-025 | Productividad de cajas por franja horaria | Cobros por caja y hora | Rango | O5 | ídem |
| REP-SUE-001 | Costo laboral por servicio y centro | Remunerativos + no remunerativos + contribuciones + ART + seguro + provisiones | Período devengado | O9 | M16 §15 |
| REP-SUE-002 | Ausentismo | Días de ausencia / laborables × 100 | Período | O9 | M16 §15 |
| REP-SUE-003 | Horas extra y guardias | Σ 50 %, 100 %, guardias; importe; tope | Período | O9 | M16 §15 |
| REP-SUE-004 | Proyección presupuestaria de personal | Costo proyectado 12 meses | 12 meses | O9 | M16 §15 |
| REP-SUE-005 | Nómina de empleados | Legajo, CUIL, empresa, categoría, área, antigüedad | asOf | O9 | M16 §15 |
| REP-SUE-006 | Conceptos liquidados | Por concepto, empleado y período | Período | O9 | M16 §15 |
| REP-SUE-007 | Cuenta corriente del empleado | Adelantos, préstamos, embargos, saldo | asOf | O9 | M16 §15 |
| REP-SUE-008 | Cambios de categoría | Historial | Rango | O9 | M16 §15 |
| REP-SUE-009 | Familiares | Por empleado | Año | O9 | M16 §15 |
| REP-SUE-010 | Horarios y fichadas | Turnos y horas trabajadas | Rango | O9 | M16 §15 |
| REP-SUE-011 | Licencias solicitadas y autorizadas | Por causa, estado, área | Rango | O9 | M16 §15 |
| REP-SUE-012 | Novedades de personal | Por tipo, origen y estado | Período | O9 | M16 §15 |
| REP-SUE-013 | Trámites y documentación del personal | Pendientes, vencidos | asOf | O9 | M16 §15 |
| REP-SUE-014 | Remuneraciones por banco | Netos por banco y cuenta | Período | O9 | M16 §15 |
| REP-SUE-015 | Libro de sueldos (art. 52) | Recibos con conceptos | Período | O9 | M16 §15 |
| REP-SUE-016 | Totales SICOSS | Bases y aportes vs liquidación | Período | O9 | M16 §15 |
| REP-SUE-017 | Actividades / tareas extra | Por ejecutor | Período | O9 | M16 §15 |
| REP-SUE-018 | Liquidación anual de Ganancias | F.649/F.1357/F.1359 | Año fiscal | O9 | M16 §15 |
| REP-SUE-019 | Diferencias de Ganancias mes a mes | Por empleado | Año | O9 | M16 §15 |
| REP-SUE-020 | Gráficos por grupos de conceptos | Evolución mensual (`SU_GRUPO_GRAFICO`) | 12 meses | O9 | M16 §15 |
| REP-SUE-021 | Rotación de personal | Egresos / dotación promedio × 100 | Período | O9 | M16 §15 |
| REP-SUE-022 | Antigüedad y dotación | Por área, convenio y tramo | asOf | O9 | M16 §15 |
| REP-SUE-023 | Provisiones de SAC y vacaciones | Devengadas no pagadas | asOf | O9 | M16 §15 |
| REP-SUE-024 | Embargos (sensible) | Planes activos, descontado, saldo | asOf | O9 | M16 §15 |
| REP-SUE-025 | Firma de recibos | Pendientes, firmados, disconformes | Período | O9 | M16 §15 |
| REP-SUE-026 | Comparativo de liquidaciones | Período vs anterior por empleado y concepto | Dos períodos | O9 | M16 §15 |

#### 15.4.7 Institucional, servicios sociales, portal y comunidad (M17, M18, M19, T09)

| REP-ID | Reporte | Contenido resumido | Corte | Ola | Ref. dueño |
|---|---|---|---|---|---|
| REP-INS-001 | Libro de Registro de Asociados | Número, nombre, documento, domicilio, ingreso, egreso, cuotas, transferencias, reembolsos | asOf (`periodTo`) | O10 | M17 REP-INS-01 |
| REP-INS-002 | Altas y bajas del período (INAES) | Conteo y detalle por causa | Rango | O10 | M17 REP-INS-02 |
| REP-INS-003 | Padrón de asociados | Habilitados por distrito; excluidos con motivo | `cutoffDate` del padrón | O10 | M17 REP-INS-03 |
| REP-INS-004 | Estado de cuenta de capital | Pendiente = suscripto − integrado − reembolsado + ajustes; vencido | asOf | O10 | M17 REP-INS-04 |
| REP-INS-005 | Resumen de capital social | Suscripto, facturado, integrado, reservado, reembolsado | asOf | O10 | M17 REP-INS-05 |
| REP-INS-006 | Conciliación capital vs contabilidad | Saldo M17 − saldo M15 por rubro | asOf | O10 | M17 REP-INS-06 |
| REP-INS-007 | Deuda de capital | Vencido no integrado > umbral | asOf | O10 | M17 REP-INS-07 |
| REP-INS-008 | Rescates y cola | Límite anual usado | Ejercicio | O10 | M17 REP-INS-08 |
| REP-INS-009 | Distribución de excedentes (por asociado) | Retorno = base / Σ bases × importe | Ejercicio | O10 | M17 REP-INS-09 |
| REP-INS-010 | Nómina de autoridades | Órgano, cargo, vigencia | asOf | O10 | M17 REP-INS-10 |
| REP-INS-011 | Vencimientos de mandatos | Próximos N días | asOf | O10 | M17 REP-INS-11 |
| REP-INS-012 | Asistencia a asamblea | Presentes, poderes, quórum y hora | Fecha de la asamblea | O10 | M17 REP-INS-12 |
| REP-INS-013 | Representados (poderes) | Mandatario y representados | Fecha de la asamblea | O10 | M17 REP-INS-13 |
| REP-INS-014 | Delegados | Electos por distrito | asOf | O10 | M17 REP-INS-14 |
| REP-INS-015 | Resultado de votación | Votos por opción; resultado | Cierre de votación | O10 | M17 REP-INS-15 |
| REP-INS-016 | Resoluciones abiertas | Por responsable y vencimiento | asOf | O10 | M17 REP-INS-16 |
| REP-INS-017 | Honorarios liquidados | Bruto, retención, neto, pago | Período | O10 | M17 REP-INS-17 |
| REP-INS-018 | Asociados por categoría INAES y antigüedad | Conteos | asOf | O10 | M17 REP-INS-18 |
| REP-INS-019 | Asociados sin servicios / clientes no asociados | Conteos y listados | asOf | O10 | M17 REP-INS-19 |
| REP-INS-020 | Certificados de cuotas sociales emitidos | Número, asociado, cuotas, estado | asOf | O10 | M17 REP-INS-20 |
| REP-SOC-001 | Adherentes por servicio | Por servicio, plan, vínculo, edad, estado | asOf | O10 | M18 REP-SOC-01 |
| REP-SOC-002 | Mayoría de edad y bajas por condición | Fecha de cumplimiento/incumplimiento | asOf | O10 | M18 REP-SOC-02 |
| REP-SOC-003 | Cantidades para facturación (adherentes) | Facturables = vigentes al último día − exentos | Período | O10 | M18 REP-SOC-03 |
| REP-SOC-004 | Solicitudes y tiempos (sociales) | Mediana y p90 de gestión | Período | O10 | M18 REP-SOC-04 |
| REP-SOC-005 | Prestaciones utilizadas vs topes | Usadas / tope | Período | O10 | M18 REP-SOC-05 |
| REP-SOC-006 | Costos de convenios y prestadores | Costo por beneficiario | Período | O10 | M18 REP-SOC-06 |
| REP-SOC-007 | Disponibilidad del cementerio | Disponibles, reservadas, asignadas, ocupación | asOf | O10 | M18 REP-SOC-07 |
| REP-SOC-008 | Registro de inhumaciones | Cronológico con unidad y permiso | Período | O10 | M18 REP-SOC-08 |
| REP-SOC-009 | Registro de titulares de cementerio | Titular, unidad, modalidad, vigencia | asOf | O10 | M18 REP-SOC-09 |
| REP-SOC-010 | Deuda de cementerio | Saldo por derecho (M07) | asOf | O10 | M18 REP-SOC-10 |
| REP-SOC-011 | Informe general de traslados | Filtros RF-SOC-079; km e importes; multitramo consolidado | Período | O10 | M18 REP-SOC-11 |
| REP-SOC-012 | Aporte teórico vs facturado (vivienda) | Desvío = teórico − facturado | asOf | O10 | M18 REP-SOC-12 |
| REP-SOC-013 | Estado de aportes y del plan | % facturado, % pagado, deuda | asOf | O10 | M18 REP-SOC-13 |
| REP-SOC-014 | Composición de tipología | Materiales por actividad y costo | asOf | O10 | M18 REP-SOC-14 |
| REP-SOC-015 | Resumen de construcción y desviación | % real ponderado vs esperado | asOf | O10 | M18 REP-SOC-15 |
| REP-SOC-016 | Materiales asignados, retirados y utilizados | Por producto; vales por obra | Período | O10 | M18 REP-SOC-16 |
| REP-SOC-017 | Cambio de plan (vivienda) | Aporte facturado, nuevo, diferencia | asOf | O10 | M18 REP-SOC-17 |
| REP-SOC-018 | Costos de flota | Combustible + mantenimiento + seguros + amortización; costo/km | Período | O10 | M18 REP-SOC-18 |
| REP-SOC-019 | Rendimiento de combustible | km / litros vs esperado | Período | O10 | M18 REP-SOC-19 |
| REP-SOC-020 | Vencimientos de flota | Documentos y licencias | asOf | O10 | M18 REP-SOC-20 |
| REP-SOC-021 | Rendiciones de flota | Por tipo; km estimados/reales/GPS | Período | O10 | M18 REP-SOC-21 |
| REP-SOC-022 | Préstamos ortopédicos | Activos, vencidos, perdidos | asOf | O10 | M18 REP-SOC-22 |
| REP-SOC-023 | Retiros de dispenser | Excedente mensual | Período | O10 | M18 REP-SOC-23 |
| REP-POR-001 | Usuarios del portal | Usuarios por estado, verificación, cuentas vinculadas, último acceso; **nunca** contraseñas ni claves (reemplaza "Claves Web", RN-BIA-015) | Snap | O2 | M19 §15 (exportaciones) |
| REP-POR-002 | Accesos de una cuenta | Accesos por usuario, canal, resultado (PAN-POR-90); histórico migrado de `WEB_LOG` | Rango | O2 | M19 §15 |
| REP-POR-003 | Recepciones públicas con plazos | Bajas y trámites públicos con código y constancia en plazo (PAN-POR-91) | Rango | O2 | M19 §15 |
| REP-POR-004 | Presentaciones por formulario | Envíos por formulario y estado (PAN-POR-97) | Rango | O2 | M19 §15 |
| REP-POR-005 | Conciliación de migración de usuarios | Importados, activados, rechazados (PAN-POR-92) | Lote | O11 | M19 §15 |
| REP-COM-001 | Engagement por publicación | Vistas únicas, reacciones, comentarios, ranking (RF-COM-016, RF-COM-026) | Rango | O2 | T09 (propuesto por T10; §15 de T09 pendiente) |
| REP-COM-002 | Tablero de moderación | Volumen, tiempo de primera decisión, % ocultos, concordancia IA vs humano, reportes abiertos, sanciones (RF-COM-054) | Rango | O2 | ídem |
| REP-COM-003 | Métricas de campaña por canal | Snapshot, excluidos, enviados, entregados, abiertos, clics, rebotes, quejas, bajas, fallidos, costo (RF-COM-193) | Corrida | O2 | ídem |
| REP-COM-004 | Destinatarios excluidos por falta de contacto | Por canal y motivo (RF-COM-197, V2 #2327) | Corrida | O2 | ídem |
| REP-COM-005 | Encuestas y votaciones | Participación = respondentes / audiencia; resultados por opción | Cierre | O2 | ídem |
| REP-COM-006 | Consentimientos y bajas de comunicaciones | Altas, retiros y supresiones por canal | Rango | O2 | ídem |
| REP-COM-007 | Avisos de interrupción por zona | Avisados / contratos afectados | Rango | O7 | ídem |

**Conteo del catálogo:** BIA 14 · PLA 8 · IAM 16 · CFG 15 · MIG 13 · PER 16 · CAT 15 · MED 19 · TAR 17 · FAC 13 · FIS 16 · COB 25 · MOR 29 · CRM 28 · TEC 28 · VEN 15 · CMP 18 · STK 32 · TES 17 · CON 25 · SUE 26 · INS 20 · SOC 23 · POR 5 · COM 7 = **460 reportes**. Con los informes regulatorios REP-BIA-015 a REP-BIA-024 (§15.5.1, HUE-SRV-08) el control de calidad del agua REP-TEC-029 (M10, HUE-AG-01) y guardias y emergencias REP-TEC-030 (M10, HUE-GAS-05) el catálogo suma **472 reportes** (BIA 24, TEC 30).

**Verificación de cobertura (HUECO-TRV-05):** §15.4.6 y §15.4.7 consolidan todos los REP-ID definidos por los anexos M11 a M19, verificados contra su §15: REP-VEN-01 a REP-VEN-15 (M11), REP-CMP-01 a REP-CMP-18 (M12), REP-INS-01 a REP-INS-20 (M17) y REP-SOC-01 a REP-SOC-23 (M18), con el mismo número y nombre que en el anexo dueño. M13, M14, M15, M16 y M19 no asignan REP-ID en su anexo (usan claves de reporte o referencias a RF); sus reportes reciben aquí el código consolidado (REP-STK, REP-TES, REP-CON, REP-SUE, REP-POR) según la convención de §15.2, y la columna "Ref. dueño" indica la clave o el RF de origen.

### 15.5 Catálogo de informes regulatorios (referencia, MER-014)

BIA solo lista, ejecuta y entrega; el layout, la validación, la presentación y el acuse son del módulo dueño (RN-BIA-040). Se muestran en PAN-BIA-22 con su calendario.

| Organismo / destino | Informe | Servicio | Dueño del formato | Reporte base |
|---|---|---|---|---|
| ARCA | Libro IVA Digital ventas y compras; CITI/RG 3685 | Todos | M06 | REP-FIS-001, REP-FIS-003 |
| ARCA | SICORE (retenciones/percepciones), SIRCAR/SIRCREB (IIBB) | Todos | M06 | REP-FIS-005, REP-FIS-006 |
| ARCA | SICOSS / F.931, Libro de Sueldos Digital, F.1357 | Personal | M16 | REP-SUE-015, REP-SUE-016, REP-SUE-018 |
| ARBA / DGR provinciales | Percepciones y retenciones de IIBB; Convenio Multilateral | Todos | M06 | REP-FIS-005, REP-FIS-008 |
| ERSeP / OCEBA / EPRE | Informes de usuarios, consumos y facturación por categoría y tramo (matriz `INFOCTD/G/N`); calidad de servicio e interrupciones; balance de cuentas OCEBA/FEDECOBA | Electricidad, agua | M06 (con M03, M10, M15) | REP-MED-008, REP-MED-019, REP-TEC-017, REP-CRM-028, REP-CON-019 |
| ENARGAS | Usuarios y volúmenes por categoría | Gas | M06 (con M03) | REP-MED-006, REP-MED-019 |
| ENACOM | Accesos, servicios TIC y telefonía | Internet, TV, telefonía | M06 (con M02, M10) | REP-CAT-015, REP-TEC-022 |
| Secretaría de Energía / RASE / segmentación | Padrón de subsidios y beneficios; condición de mora (DNU 311/2020) | Electricidad, gas | M04 / M08 | REP-TAR-007, REP-TAR-008, REP-MOR-025 |
| SINTYS | Cruces de padrón | Todos | M01 / M06 | REP-PER-001 |
| INAES | Libro de Registro de Asociados, altas y bajas, estados contables, asambleas | Institucional | M17 / M15 | REP-INS-001, REP-INS-002, REP-CON-007 a REP-CON-012 |
| Municipios / terceros de convenio | Rendición de tasas y cobranzas de terceros | Según convenio | M06 / M07 | REP-FIS-012, REP-COB-019 |

#### 15.5.1 Informes regulatorios por servicio (HUE-SRV-08)

Cada informe regulatorio concreto tiene un código REP-BIA propio para que las fichas verticales (T12) y PAN-BIA-22 lo citen sin ambigüedad. El código identifica la **entrada del catálogo regulatorio** (RF-BIA-090): organismo, servicio, período, vencimiento y reportes base. El layout, la validación, la presentación y el acuse siguen siendo del módulo dueño (RN-BIA-040; M06 RF-FIS-143 y RF-FIS-149). Un tenant solo ve las entradas de los servicios que tiene habilitados y del regulador que le asigna el mapa de responsabilidad regulatoria (M06 RF-FIS-150).

| REP-ID | Informe | Organismo / destino | Servicio | Contenido resumido | Requisito del dueño | Reportes base | Corte | Ola |
|---|---|---|---|---|---|---|---|---|
| REP-BIA-015 | Informe ENACOM de Internet | ENACOM | INT | Accesos y abonados por localidad, tecnología y velocidad; reclamos TIC por motivo y plazo de respuesta (plantilla `slaPolicies` ENACOM de M09) | M06 RF-FIS-146, RF-FIS-148; M09 RF-CRM-114, RF-CRM-258 | REP-CAT-015, REP-CRM-028 | Período del informe | O7 |
| REP-BIA-016 | Informe ENACOM de telefonía | ENACOM | TEL | Líneas por localidad y modalidad; llamadas y categorías CNC; números en central; reclamos TIC por motivo | M06 RF-FIS-146, RF-FIS-148; M10 RF-TEC-213 | REP-CAT-015, REP-TEC-022, REP-CRM-028 | Período del informe | O10 |
| REP-BIA-017 | Informe ENACOM de televisión | ENACOM | TV | Abonados por localidad y paquete (perfil técnico de TV de M10 RF-TEC-183); reclamos TIC por motivo | M06 RF-FIS-146, RF-FIS-148 | REP-CAT-015, REP-CRM-028 | Período del informe | O10 |
| REP-BIA-018 | Informes ERSeP de energía eléctrica | ERSeP (Córdoba) u organismo provincial equivalente (FI-INT-29) | ELE | Régimen de ventas (Circular 70/2021), archivo de consumos, pérdidas por servicio, servicios (titulares), riesgo de corte (DNU 311/2020), tarifa social; calidad de servicio e interrupciones | M06 RF-FIS-144, RF-FIS-148 | REP-MED-008, REP-MED-019, REP-TEC-017, REP-CRM-028, REP-MOR-025 | Período del informe | O7 |
| REP-BIA-019 | Informe a la Secretaría de Energía | Secretaría de Energía | ELE | Energía comprada y vendida; usuarios-generadores y energía inyectada | M06 RF-FIS-147 | REP-MED-019 | Mes | O7 |
| REP-BIA-020 | Informes ERSeP de agua potable | ERSeP (Córdoba) u organismo provincial equivalente | AG | Usuarios y consumos por categoría y tramo, servicios (titulares), tarifa social; calidad de servicio y de atención; calidad del agua si M10 la registra (PA-TEC-20) | M06 RF-FIS-144, RF-FIS-148; M10 RF-TEC-236 | REP-MED-008, REP-MED-019, REP-TEC-017, REP-CRM-028, REP-TEC-029 | Período del informe | O7 |
| REP-BIA-021 | Informe de la concesión de saneamiento | Concedente (municipio u organismo provincial) | CLO | Usuarios conectados a la red colectora; reclamos de desborde y obstrucción por motivo, plazo y derivación (M09 RF-CRM-259); OT de desobstrucción; interrupciones | M06 RF-FIS-144 (cuando el regulador es ERSeP), RF-FIS-148, RF-FIS-150 | REP-CAT-015, REP-CRM-028, REP-TEC-017 | Período de la concesión | O7 |
| REP-BIA-022 | Informes ENARGAS / ENReGE de gas | ENARGAS / ENReGE | GAS | Protocolos SARI y FCU-DS: usuarios, volúmenes y facturación por categoría, morosidad; reclamos de seguridad (fuga) con plazos de M09 RF-CRM-260 | M06 RF-FIS-145, RF-FIS-148 | REP-MED-006, REP-MED-019, REP-CRM-028 | Período del informe | O7 |
| REP-BIA-023 | Rendición de alumbrado público al municipio | Municipio (convenio de terceros) | ALU | Tasa de alumbrado facturada, cobrada, comisión y neto a rendir por período; reclamos de luminaria apagada derivados o atendidos según convenio (M09 RF-CRM-259) | M06 RF-FIS-139 (reporte para el organismo) | REP-FIS-012, REP-COB-019 | Período de rendición | O5 |
| REP-BIA-024 | Informe de calidad del agua al regulador | ERSeP u organismo de control de la concesión | AG | Muestras por punto de muestreo, parámetros analizados, resultados fuera de límite y acciones; laboratorio y protocolo adjunto (T11). Solo si el tenant habilita los controles de calidad (PA-TEC-20, PRM-TEC-157) | M10 RF-TEC-236; M06 RF-FIS-148 | REP-TEC-029 | Período del informe | O7 |

Si el regulador exige un informe que no figura en esta tabla, el tenant lo agrega como entrada del catálogo regulatorio (RF-BIA-090) con código REP-BIA nuevo asignado por la plataforma; no se reutilizan códigos.

### 15.6 Indicadores (KPI) por módulo y rol

Cada indicador se carga en `indicatorDefinitions` con todos los atributos de RF-BIA-046 y se certifica antes de aparecer en un tablero. Convenciones de la tabla: **Corte** = fecha de corte o tipo de fecha que imputa; **Refr.** = refresco (`RT` tiempo real, `15m`, `H` horario, `D` diario, `MC` cierre mensual); **Sentido**: ↑ mayor es mejor, ↓ menor es mejor, = neutro; **Detalle** = reporte de drill-down. Las fórmulas usan los términos del §15.1. Denominador 0 → nulo (RN-BIA-022).

#### 15.6.1 Plataforma (tenant `PLATFORM`; definición en T01 §15.1, motor BIA)

| KPI | Indicador | Fórmula | Universo | Corte | Refr. | Unidad · sentido | Detalle |
|---|---|---|---|---|---|---|---|
| KPI-PLA-01 | Tenants por estado | count(`tenants`) por `status` | kind `cooperative` del ambiente | Snap | RT | count · = | REP-PLA-001 |
| KPI-PLA-02 | Checklists incompletos | count(`overallStatus = incomplete`) por capacidad | Tenants no purgados | Snap | RT | count · ↓ | PAN-PLA |
| KPI-PLA-03 | Habilitaciones vencidas | Tenants con fecha objetivo < hoy y estado < `operational` | Tenants en alta | Día | D | count · ↓ | REP-PLA-001 |
| KPI-PLA-04 | Jobs fallidos 24 h | count(`jobRuns` `failed` últimas 24 h) por cola y tenant | Todos | Ventana 24 h | 1 min | count · ↓ | T01 |
| KPI-PLA-05 | Jobs estancados | count(`stalled`) | Todas las colas | Snap | 1 min | count · ↓ | T01 |
| KPI-PLA-06 | Lag de outbox | now − min(`occurredAt`) de `pending` | Global | Snap | 1 min | segundos · ↓ | T01 |
| KPI-PLA-07 | Bandeja técnica abierta | count(`deadLetters` `open`), destacado `businessImpact` | Global | Snap | RT | count · ↓ | T01 |
| KPI-PLA-08 | Disponibilidad | Minutos con chequeo sintético OK / minutos del mes × 100 | Por tenant y global | Mes | `PRM-PLA-043` | % · ↑ | T01 |
| KPI-PLA-09 | Latencia p95 y tasa de error | p95 de duración; 5xx / total × 100 | Por tenant y ruta | Ventana 5 min | 5 min | ms / % · ↓ | T01 |
| KPI-PLA-10 | Último backup por tenant | max(`backupRuns.finishedAt` `completed`) | Tenants operativos | Día | D | fecha · ↑ | REP-PLA-005 |
| KPI-PLA-11 | Ensayos de restauración vencidos | Tenants sin `restoreTests` `passed` en `PRM-PLA-014` días | Tenants operativos | Día | D | count · ↓ | REP-PLA-006 |
| KPI-PLA-12 | Certificados a vencer | count(`expiresAt` ≤ 30 d) | Tenants con `fac` en producción | Día | D | count · ↓ | REP-FIS-015 |
| KPI-PLA-13 | Accesos de soporte activos | count(`supportAccessGrants` `active`) (break-glass destacado) | Global | Snap | RT | count · = | REP-IAM-011 |
| KPI-PLA-14 | Casos de soporte por prioridad y SLA | count no cerrados; % con SLA vencido | Global | Snap | RT | count / % · ↓ | T01 |
| KPI-PLA-15 | SUP-TTR | mediana(`resolvedAt − createdAt`) por prioridad | Resueltos del mes | Mes | MC | horas · ↓ | T01 |
| KPI-PLA-16 | Satisfacción de soporte | promedio(`satisfaction.score`) | Casos con encuesta | Mes | MC | score · ↑ | T01 |
| KPI-PLA-17 | Uso vs cupo | máx `usageSnapshots.pct` por tenant | Tenants con contrato | Día | D | % · = | REP-PLA-003 |
| KPI-PLA-18 | Versión por ambiente/anillo | `releases.deployments` vigentes | Ambientes | Por despliegue | RT | texto · = | T01 |
| KPI-PLA-19 | Contratos por vencer | count(`validTo` ≤ 30 d) | Contratos activos | Día | D | count · ↓ | REP-PLA-002 |
| KPI-PLA-20 | Uso de API global | Σ llamadas y % 4xx/5xx por tenant (sin datos de negocio) | Tenants con API | Hora | H | count / % · = | REP-BIA-005 |
| KPI-PLA-21 | Frescura del almacén analítico | máx retraso de proyección por tenant y dataset | Tenants O11 | Snap | 5 min | minutos · ↓ | REP-BIA-008 |

#### 15.6.2 Comercial, uso, liquidación y fiscal (CAT, MED, TAR, FAC, FIS, POR, VEN)

| KPI | Indicador | Fórmula | Universo | Corte | Refr. | Unidad · sentido | Detalle |
|---|---|---|---|---|---|---|---|
| KPI-CAT-01 | Contratos activos | count(contratos `active`) | Contratos del tenant | asOf fin de día | D | count · ↑ | REP-CAT-001 |
| KPI-CAT-02 | Altas netas | activaciones(período) − bajas efectivas(período) | Eventos de activación y baja | Período (fecha efectiva) | D | count · ↑ | REP-CAT-002 |
| KPI-CAT-03 | Tasa de baja (churn) | bajas efectivas(período) / activos al inicio × 100 | Activos al inicio del período | Mes | D/MC | % · ↓ | REP-CAT-003 |
| KPI-CAT-04 | Tiempo solicitud → activación | mediana(`effectiveStart − requestedAt`) en días | Activados en el período | Fecha de activación | D | días · ↓ | REP-CAT-004 |
| KPI-CAT-05 | Contratos suspendidos | count(`suspended`) por motivo | Contratos | asOf | D | count · ↓ | REP-CAT-006 |
| KPI-CAT-06 | Equipos en comodato vencidos | count(asignaciones `pendingReturn` con plazo vencido) | Asignaciones del tenant | asOf | D | count · ↓ | REP-CAT-007 |
| KPI-MED-01 | Lectura real | puntos con lectura real validada / puntos en rutas × 100 | Puntos medidos activos (sin prepagos/telemedidos si se consulta campo) | Cierre del cronograma | D | % · ↑ | REP-MED-001 |
| KPI-MED-02 | Consumos estimados | estimados aprobados / aprobados × 100 | Consumos aprobados del período | Aprobación | D | % · ↓ | REP-MED-002 |
| KPI-MED-03 | Excepciones de consumo abiertas | count(`consumptionExceptions` `open`) | Período en curso | Snap | 15m | count · ↓ | REP-MED-011 |
| KPI-MED-04 | Éxito de telemedición | `readNow` `succeeded` / enviadas × 100 | Operaciones del período | Período | H | % · ↑ | REP-MED-013 |
| KPI-MED-05 | Pérdidas | (compra − facturado) × 100 / compra; compra activa = pico + resto + valle (RN-BIA-054) | Medición propia y consumos facturados del servicio | Período de consumo | MC | % · ↓ | REP-MED-010 |
| KPI-MED-06 | Productividad de lecturistas | tareas cerradas / horas de jornada | Sesiones de lectura del período | Período | D | tareas/h · ↑ | REP-MED-012 |
| KPI-FAC-01 | Facturado del período | Facturado (§15.1) | Comprobantes autorizados del tenant | Emisión, mes | D | ARS · = | REP-FAC-001 |
| KPI-FAC-02 | Variación del facturado | (actual − base) / \|base\| × 100; base = mismo período del año anterior (RN-BIA-010) | Ídem | Emisión | D/MC | % · = | REP-FAC-012 |
| KPI-FAC-03 | Casos excluidos del lote | excluidos / seleccionados × 100 | Lotes cerrados del período | Cierre del lote | D | % · ↓ | REP-FAC-005 |
| KPI-FAC-04 | Pendientes de autorización | count(`pending/queued/uncertain/rejected`) e importe | Comprobantes no autorizados | Snap | 15m | count · ↓ | REP-FAC-007 |
| KPI-FAC-05 | Excepciones de facturación vencidas | count(excepciones abiertas con SLA vencido) | Excepciones abiertas | Snap | 15m | count · ↓ | REP-FAC-006 |
| KPI-FAC-06 | Rebote de entrega digital | entregas rebotadas / entregas digitales × 100 | `invoiceDeliveries` del período | Distribución | D | % · ↓ | REP-FAC-011 |
| KPI-TAR-01 | Variación media ponderada de factura tras versión | Σ(variación × facturado) / Σ facturado por servicio | Cálculos de la primera liquidación con la versión nueva | Período | MC | % · = | REP-TAR-003 |
| KPI-TAR-02 | Costo de promociones | Σ efecto de promociones | Renglones de promoción | Mes | MC | ARS · ↓ | REP-TAR-009 |
| KPI-TAR-03 | Cuentas con beneficio público vs comercial | count por `funding` | Renglones de beneficio | Período | MC | count · = | REP-TAR-007 |
| KPI-FIS-01 | Rechazo de autorización fiscal | rechazados / solicitados × 100 | `fiscalAuthorizations` del período | Día | H | % · ↓ | REP-FIS-009 |
| KPI-FIS-02 | Tiempo medio de autorización | promedio(`authorizedAt − requestedAt`) | Autorizados del período | Día | H | segundos · ↓ | REP-FIS-009 |
| KPI-FIS-03 | Declaraciones vencidas sin presentar | count(`regimeFilings` vencidas no presentadas) | Calendario fiscal | Snap | D | count · ↓ | REP-FIS-014 |
| KPI-FIS-04 | Credenciales fiscales por vencer | count(certificados/CAI/CAEA ≤ 30 d) | Tenant | Día | D | count · ↓ | REP-FIS-015 |
| KPI-POR-01 | Usuarios registrados | count(pertenencias con perfil portal) | Pertenencias activas | Fin de día anterior | D | count · ↑ | REP-POR-001 |
| KPI-POR-02 | Tasa de vinculación | cuentas con ≥ 1 acceso `titular` activo / cuentas con contratos activos × 100 | Cuentas activas M01 | Fin de día anterior | D | % · ↑ | REP-POR-001 |
| KPI-POR-03 | Adopción de factura digital | cuentas adheridas / cuentas activas × 100 | Cuentas activas | Fin de día anterior | D | % · ↑ | REP-FAC-011 |
| KPI-POR-04 | Participación del pago online | cobrado por portal (tótem aparte) / Cobrado total × 100 | Pagos imputados del período | Fin de período | D | % · ↑ | REP-COB-004 |
| KPI-POR-05 | Autoservicio de gestiones | casos abiertos por portal / casos totales × 100 | Casos M09 del período | Fin de período | D | % · ↑ | REP-CRM-011 |
| KPI-POR-06 | Bajas públicas en plazo | bajas con código ≤ 24 h y constancia ≤ 72 h / bajas públicas × 100 | Recepciones públicas | Fin de período | D | % · ↑ | REP-POR-003 |
| KPI-POR-07 | Abandono de formularios | borradores vencidos sin envío / borradores iniciados × 100 | Borradores del período | Fin de período | D | % · ↓ | REP-POR-004 |
| KPI-VEN-01 | Conversión de presupuestos | aceptados / enviados × 100 | Enviados en el período | `sentAt` | D | % · ↑ | REP-VEN-003 |
| KPI-VEN-02 | Ventas de productos | Σ neto de ventas confirmadas no anuladas | Ventas del período | `operationDate` | D | ARS · ↑ | REP-VEN-005 |
| KPI-VEN-03 | Facturado no entregado | Σ `pendingDeliveryQty` valorizado | Ventas `invoiced` con pendientes | Snap | D | ARS · ↓ | REP-VEN-007 |

#### 15.6.3 Recaudación, deuda y finanzas (COB, MOR, TES, CON, CMP, STK)

| KPI | Indicador | Fórmula | Universo | Corte | Refr. | Unidad · sentido | Detalle |
|---|---|---|---|---|---|---|---|
| KPI-COB-01 | Cobrado del período | Cobrado (§15.1) | Pagos `confirmed` | Fecha de cobro | 15m | ARS · ↑ | REP-COB-004 |
| KPI-COB-02 | Eficacia de cobranza al 1.er vencimiento | Σ cobrado imputado a comprobantes del período hasta su 1.er vto / Σ facturado del período × 100 | Comprobantes emitidos en el período | 1.er vencimiento | D | % · ↑ | REP-CON-023 |
| KPI-COB-03 | Cobranza digital | Cobrado por canales digitales (portal, pasarelas, débito, transferencia) / Cobrado × 100 | Pagos confirmados | Fecha de cobro | D | % · ↑ | REP-COB-004 |
| KPI-COB-04 | Días promedio de cobro (DSO) | Saldo de cartera al corte / facturado de los últimos 90 días × 90 | Cartera del tenant | asOf | D | días · ↓ | REP-COB-002 |
| KPI-COB-05 | Cobranza del día vs promedio | Cobrado hoy / promedio de los últimos 20 días hábiles × 100 | Pagos confirmados | Día | 15m | % · ↑ | REP-COB-004 |
| KPI-COB-06 | No identificados > 15 días | count e importe de no identificados con antigüedad > 15 días | Pagos no identificados | asOf | D | ARS · ↓ | REP-COB-016 |
| KPI-COB-07 | Pagos inciertos abiertos | count de pagos/checkout `uncertain` > 24 h | Pagos del período | Snap | H | count · ↓ | REP-COB-013 |
| KPI-COB-08 | Rechazo de débito automático | rechazados / presentados × 100 | Lotes del período | Lote | D | % · ↓ | REP-COB-011 |
| KPI-COB-09 | Diferencias de arqueo | Σ \|declarado − teórico\| | Arqueos del período | Rango | D | ARS · ↓ | REP-COB-006 |
| KPI-COB-10 | Bruto cobrado vs neto acreditado | Σ cobros por pasarela − Σ acreditaciones conciliadas − comisiones − retenciones = diferencia sin explicar | Cobros por pasarelas del período | Rango | D | ARS · ↓ | REP-COB-010 |
| KPI-MOR-01 | Deuda vencida | Σ Vencido (§15.1) | Obligaciones con saldo | asOf fin de día anterior | D | ARS · ↓ | REP-MOR-001 |
| KPI-MOR-02 | Índice de morosidad | saldo vencido > 30 días / Saldo total de cartera × 100 | Cartera del tenant | asOf | D | % · ↓ | REP-MOR-001 |
| KPI-MOR-03 | Cuentas en instancia de corte | count(cuentas con notificación abierta en instancia de corte) | Notificaciones abiertas | asOf | D | count · ↓ | REP-MOR-004 |
| KPI-MOR-04 | Recupero por instancia | cobrado sobre ítems hasta 30 días post vencimiento / deuda notificada × 100 | Notificaciones procesadas | Rango | D | % · ↑ | REP-MOR-014 |
| KPI-MOR-05 | Cumplimiento de promesas | cumplidas / vencidas × 100 | Promesas con fecha en el período | Rango | D | % · ↑ | REP-MOR-007 |
| KPI-MOR-06 | Caída de convenios | caídos en el período / activados 12 meses antes × 100 | Convenios | Rango | MC | % · ↓ | REP-MOR-021 |
| KPI-MOR-07 | Tiempo de reconexión p90 | p90(ejecución confirmada − pago habilitante) en horas | Reconexiones ejecutadas | Rango | D | horas · ↓ | REP-MOR-012 |
| KPI-MOR-08 | Cortes bloqueados por protección | count(evaluaciones `blocked`) por causa | Evaluaciones del período | Rango | D | count · = | REP-MOR-013 |
| KPI-TES-01 | Días de caja | Disponible / promedio de egresos diarios de los últimos 90 días | Cuentas `includeInAvailability` | asOf | D | días · ↑ | REP-TES-003 |
| KPI-TES-02 | Disponibilidades | Σ saldo operativo (ME × cotización) | Cuentas `includeInAvailability` | Snap | H | ARS · = | REP-TES-003 |
| KPI-TES-03 | Antigüedad de partidas sin conciliar | promedio y máx de días | Partidas pendientes por cuenta | asOf | D | días · ↓ | REP-TES-015 |
| KPI-TES-04 | Tiempo de rendición de cajas | promedio de horas entre cierre de caja (M07) y aceptación | Cajas del período | Rango | D | horas · ↓ | REP-TES-013 |
| KPI-TES-05 | Desvío del flujo | (real − proyectado) / proyectado × 100 por semana | Snapshot de proyección vs real | Semana | D | % · ↓ | REP-TES-007 |
| KPI-TES-06 | Cheques no debitados | Σ cheques propios emitidos sin debitar | Cheques propios | Snap | D | ARS · = | REP-TES-006 |
| KPI-CON-01 | Resultado del período | Ingresos − costos − gastos ± financieros | Asientos `posted` del plan operativo | Fecha contable, mes | MC | ARS · ↑ | REP-CON-008 |
| KPI-CON-02 | Resultado por servicio | Directos − costos directos − comunes distribuidos | Corrida de distribución | Mes | MC | ARS · ↑ | REP-CON-013 |
| KPI-CON-03 | Ejecución presupuestaria | devengado / presupuestado × 100 | Presupuesto vigente | Rango | D | % · = | REP-CON-014 |
| KPI-CON-04 | Diferencias de auxiliares | Σ \|auxiliar − cuenta de control\| | Auxiliares conciliables | asOf | D | ARS · ↓ | REP-CON-015 |
| KPI-CON-05 | Períodos con bloqueantes de cierre | count(períodos abiertos con bloqueantes) | Ejercicio en curso | Snap | D | count · ↓ | REP-CON-017 |
| KPI-CON-06 | Servicios conectados | Servicio conectado (§15.1) | Contratos | asOf | D | count · = | REP-CON-020 |
| KPI-CON-07 | Servicio tomado no facturado | contratos activos − contratos con factura en el período | Contratos activos | Período | MC | count · ↓ | REP-CON-021 |
| KPI-CMP-01 | OC atrasadas | count e importe de OC con `deliveryDate` < hoy y pendiente > 0 | OC aprobadas no cerradas | Snap | D | ARS · ↓ | REP-CMP-003 |
| KPI-CMP-02 | Facturas sin OC | ítems sin OC / ítems registrados × 100 | Comprobantes del período | Fecha contable | D | % · ↓ | REP-CMP-005 |
| KPI-CMP-03 | Excepciones de 3 vías abiertas | count e importe en disputa | Excepciones abiertas | Snap | D | ARS · ↓ | REP-CMP-007 |
| KPI-CMP-04 | Entregas a término | entregas a término / entregas × 100 | Recepciones del período | Rango | D | % · ↑ | REP-CMP-013 |
| KPI-CMP-05 | Comprometido / devengado / pagado | Tres valores separados (AGR-028), nunca sumados | Período y servicio | asOf | D | ARS · = | REP-CMP-010 |
| KPI-STK-01 | Existencias valorizadas | Σ cantidad × costo por custodia | Artículos con stock propio | asOf | D | ARS · = | REP-STK-012 |
| KPI-STK-02 | Equipos en comodato activos | count(asignaciones activas) por servicio | Asignaciones | asOf | D | count · = | REP-STK-005 |
| KPI-STK-03 | Equipos pendientes de devolución | count y valor de reposición | Asignaciones `pendingReturn`/`chargeProposed` | asOf | D | ARS · ↓ | REP-STK-006 |
| KPI-STK-04 | Rotación de inventario | consumo del período / existencia promedio | Artículos | Mes | MC | veces · ↑ | REP-STK-003 |
| KPI-STK-05 | Días de cobertura | disponible / consumo diario promedio | Artículos con consumo | asOf | D | días · = | REP-STK-014 |
| KPI-STK-06 | Exactitud de inventario | (1 − Σ \|diferencias\| / Σ contado) × 100 | Inventarios cerrados | Cierre | MC | % · ↑ | REP-STK-017 |
| KPI-STK-07 | Tasa de falla por modelo | (RMA + cambios) / unidades instaladas × 100 | Unidades aplicadas | Rango | MC | % · ↓ | REP-STK-026 |
| KPI-STK-08 | Diferencias de rendición por cuadrilla | Σ \|diferencias\| valorizadas | Rendiciones de cuadrilla | Rango | D | ARS · ↓ | REP-STK-007 |
| KPI-STK-09 | Tiempo promedio de RMA | promedio(resolución − apertura) | RMA cerrados | Rango | MC | días · ↓ | REP-STK-025 |
| KPI-STK-10 | Artículos bajo mínimo | count(disponible < mínimo) | Artículos con niveles | Snap | D | count · ↓ | REP-STK-014 |

#### 15.6.4 Operación, atención, personas e institucional (TEC, CRM, SUE, INS, SOC, COM, IAM, BIA, MIG)

| KPI | Indicador | Fórmula | Universo | Corte | Refr. | Unidad · sentido | Detalle |
|---|---|---|---|---|---|---|---|
| KPI-TEC-01 | OT pendientes | count(OT no `closed`/`cancelled`) | OT del tenant según alcance | Snap | 15m | count · ↓ | REP-TEC-002 |
| KPI-TEC-02 | Cumplimiento SLA de OT | cerradas con `closedAt ≤ dueAt` / cerradas × 100 | OT cerradas con SLA | `closedAt` | D | % · ↑ | REP-TEC-003 |
| KPI-TEC-03 | Demora promedio de OT | promedio(max(0, confirmación o ahora − fecha de la orden)) en días (RN-BIA-055) | OT del filtro | Rango | D | días · ↓ | REP-TEC-025 |
| KPI-TEC-04 | Primera visita exitosa | instalaciones activadas con una visita / activadas × 100 | Activadas en el período | Fecha de activación | D | % · ↑ | REP-TEC-005 |
| KPI-TEC-05 | Visitas fallidas | fallidas / programadas × 100 | Visitas del período | `scheduledStart` | D | % · ↓ | REP-TEC-006 |
| KPI-TEC-06 | Puntualidad | llegadas en franja / completadas × 100 | Visitas completadas | `scheduledStart` | D | % · ↑ | REP-TEC-007 |
| KPI-TEC-07 | Ocupación de agenda | reservas confirmadas / capacidad × 100 | Franjas del período | Día de la franja | H | % · = | REP-TEC-008 |
| KPI-TEC-08 | Aprovisionamiento al primer intento | comandos exitosos en intento 1 / comandos × 100 | `provisioningCommands` | `createdAt` | H | % · ↑ | REP-TEC-015 |
| KPI-TEC-09 | Satisfacción post instalación | promedio de encuesta | Encuestas respondidas | Fecha de respuesta | D | score · ↑ | REP-TEC-013 |
| KPI-TEC-10 | Conflictos de sincronización abiertos | count(`syncConflicts` abiertos) | App de campo | Snap | 15m | count · ↓ | REP-TEC-014 |
| KPI-TEC-11 | Minutos de interrupción por contrato | Σ(duración × contratos afectados) / contratos activos | Interrupciones completadas | `actualEnd`, mes | MC | min · ↓ | REP-TEC-017 |
| KPI-TEC-12 | Cumplimiento preventivo | ejecutados en término / programados × 100 | Planes activos | Período | MC | % · ↑ | REP-TEC-019 |
| KPI-CRM-01 | Casos abiertos | Caso abierto (§15.1) | Casos según alcance | Snap | 15m | count · ↓ | REP-CRM-001 |
| KPI-CRM-02 | Tiempo de primera respuesta | mediana(`firstRespondedAt − createdAt − pausas`) | Con primera respuesta en el período | Fecha de primera respuesta | H | horas · ↓ | REP-CRM-002 |
| KPI-CRM-03 | Tiempo de resolución | mediana(`resolvedAt − createdAt − pausedMs`) | Resueltos en el período | Fecha de resolución | H | horas · ↓ | REP-CRM-003 |
| KPI-CRM-04 | Cumplimiento SLA de casos | resueltos sin incumplimiento / resueltos con SLA × 100 | Resueltos con SLA | Fecha de resolución | H | % · ↑ | REP-CRM-004 |
| KPI-CRM-05 | Backlog mayor a 15 días | count(abiertos con antigüedad > 15 días) | Abiertos | Snap | D | count · ↓ | REP-CRM-005 |
| KPI-CRM-06 | Reincidencia | cuentas con > 1 caso del mismo tipo en 30 días / cuentas con casos × 100 | Casos creados | Fecha de creación | D | % · ↓ | REP-CRM-006 |
| KPI-CRM-07 | CSAT | respuestas 4–5 / respuestas × 100 | Encuestas post-cierre | Fecha de respuesta | D | % · ↑ | REP-CRM-009 |
| KPI-CRM-08 | NPS | % promotores − % detractores | Encuestas NPS | Fecha de respuesta | MC | puntos · ↑ | REP-CRM-009 |
| KPI-CRM-09 | Resolución en primer contacto | una interacción entrante y sin derivación / cerrados × 100 | Cerrados | Fecha de cierre | D | % · ↑ | REP-CRM-010 |
| KPI-CRM-10 | Contención del bot | sesiones `selfServed` / sesiones × 100 | Sesiones del bot | Fecha de inicio | D | % · ↑ | REP-CRM-015 |
| KPI-CRM-11 | Espera promedio en turnero | promedio(llamado − ingreso) (excluye errores ≥ 5 h si se elige) | Turnos del período | Fecha del turno | 15m | minutos · ↓ | REP-CRM-017 |
| KPI-CRM-12 | Casos sin asignar | count(abiertos sin responsable) | Abiertos | Snap | 15m | count · ↓ | REP-CRM-021 |
| KPI-SUE-01 | Costo laboral | Σ costo laboral del período (REP-SUE-001) | Empleados del alcance | Período devengado | MC | ARS · = | REP-SUE-001 |
| KPI-SUE-02 | Ausentismo | días de ausencia / días laborables × 100 | Empleados activos | Período | MC | % · ↓ | REP-SUE-002 |
| KPI-SUE-03 | Horas extra | Σ horas 50 % + 100 % + guardias | Empleados activos | Período | MC | horas · ↓ | REP-SUE-003 |
| KPI-SUE-04 | Rotación de personal | egresos / dotación promedio × 100 | Empleados | Período | MC | % · ↓ | REP-SUE-021 |
| KPI-SUE-05 | Dotación | count(empleados activos) | Empresas del alcance | asOf | MC | count · = | REP-SUE-022 |
| KPI-SUE-06 | Recibos pendientes de firma | pendientes / emitidos × 100 | Recibos del período | Período | D | % · ↓ | REP-SUE-025 |
| KPI-INS-01 | Asociados activos | count(membresías activas) | Membresías | asOf | D | count · ↑ | REP-INS-018 |
| KPI-INS-02 | Altas netas de asociados | altas − bajas del período | Eventos de membresía | Rango | MC | count · ↑ | REP-INS-002 |
| KPI-INS-03 | Capital integrado | Σ integrado | Membresías | asOf | MC | ARS · ↑ | REP-INS-005 |
| KPI-INS-04 | Capital vencido no integrado | Σ facturado con vencimiento < corte no integrado | Membresías activas | asOf | D | ARS · ↓ | REP-INS-007 |
| KPI-INS-05 | Resoluciones vencidas | count(resoluciones abiertas con vencimiento < hoy) | Resoluciones `open`/`inProgress` | Snap | D | count · ↓ | REP-INS-016 |
| KPI-INS-06 | Mandatos por vencer | count(`endDate` ≤ 90 días) | Mandatos activos | asOf | D | count · = | REP-INS-011 |
| KPI-INS-07 | Clientes no asociados | personas con contratos activos sin membresía / titulares con contratos × 100 | Titulares | asOf | MC | % · = | REP-INS-019 |
| KPI-SOC-01 | Adherentes vigentes | count por servicio | Adherentes | asOf | D | count · = | REP-SOC-001 |
| KPI-SOC-02 | Costo por beneficiario | costo del convenio / beneficiarios vigentes | Convenios | Período | MC | ARS · ↓ | REP-SOC-006 |
| KPI-SOC-03 | Ocupación del cementerio | niveles ocupados / capacidad × 100 | Unidades | asOf | MC | % · = | REP-SOC-007 |
| KPI-SOC-04 | Costo por km de flota | costo total / km recorridos | Vehículos | Período | MC | ARS/km · ↓ | REP-SOC-018 |
| KPI-SOC-05 | Desvío de construcción (vivienda) | % real ponderado − % esperado | Viviendas en obra | asOf | MC | p.p. · ↑ | REP-SOC-015 |
| KPI-COM-01 | Tasa de entrega | entregados / enviados × 100 | Comunicaciones del período | Fecha de envío | H | % · ↑ | REP-COM-003 |
| KPI-COM-02 | Tasa de apertura | abiertos únicos / entregados × 100 (email, push, WhatsApp, in-app) | Ídem | Fecha de envío (ventana 30 días) | H | % · ↑ | REP-COM-003 |
| KPI-COM-03 | Tiempo de primera decisión de moderación | mediana(decisión − ingreso a cola) | Casos de moderación | Fecha de decisión | H | minutos · ↓ | REP-COM-002 |
| KPI-COM-04 | Concordancia IA vs humano | decisiones iguales a la sugerencia IA / decisiones con sugerencia × 100 | Casos decididos | Fecha de decisión | D | % · ↑ | REP-COM-002 |
| KPI-COM-05 | Participación en encuestas | respondentes / audiencia × 100 | Encuestas cerradas | Cierre | D | % · ↑ | REP-COM-005 |
| KPI-IAM-01 | Usuarios sin MFA con capabilities S | count | Pertenencias activas | Snap | D | count · ↓ | REP-IAM-002 |
| KPI-IAM-02 | Conflictos SoD vigentes | count sin excepción vigente | Pertenencias | Snap | D | count · ↓ | REP-IAM-003 |
| KPI-IAM-03 | Recertificación | asignaciones S revisadas / totales × 100 | Período de recertificación | Fin del período | D | % · ↑ | REP-IAM-005 |
| KPI-BIA-01 | Error de API | (4xx no 404 + 5xx) / llamadas × 100 | Llamadas del tenant | Hora | H | % · ↓ | REP-BIA-005 |
| KPI-BIA-02 | Frescura del almacén | máx retraso por dataset | Datasets certificados | Snap | 5 min | minutos · ↓ | REP-BIA-008 |
| KPI-BIA-03 | Diferencias de reconciliación | count(indicadores fuera de tolerancia) | Indicadores certificados | Día | D | count · ↓ | REP-BIA-007 |
| KPI-BIA-04 | Exportaciones con datos personales | count | Exportaciones del período | Rango | D | count · = | REP-BIA-002 |
| KPI-BIA-05 | Programaciones suspendidas | count(`suspended`) | Programaciones | Snap | D | count · ↓ | REP-BIA-004 |
| KPI-BIA-06 | Webhooks no entregados | count(entregas `dead`) | Suscripciones activas | Snap | H | count · ↓ | REP-BIA-006 |
| KPI-MIG-01 | Paralelo: comprobantes iguales | (iguales + en tolerancia) / comparados × 100 | Ciclo y servicio | Fecha de emisión ProCoop | Por ciclo | % · ↑ | REP-MIG-009 |
| KPI-MIG-02 | Índice de calidad por dominio | 1 − registros con issue / registros | Dominio | asOf | D | índice · ↑ | REP-MIG-003 |

**Conteo de KPIs:** PLA 21 · CAT 6 · MED 6 · FAC 6 · TAR 3 · FIS 4 · POR 7 · VEN 3 · COB 10 · MOR 8 · TES 6 · CON 7 · CMP 5 · STK 10 · TEC 12 · CRM 12 · SUE 6 · INS 7 · SOC 5 · COM 5 · IAM 3 · BIA 6 · MIG 2 = **160 indicadores**.

### 15.7 Tableros por rol

Tableros de sistema (`origin=system`, editables solo por copia). Cada widget muestra el KPI con su frescura y abre su reporte de detalle con la capability `detailCapability`; el alcance del usuario filtra el universo (un responsable de zona ve su zona). Los widgets de módulos no habilitados no aparecen (RF-BIA-049).

| Tablero | Audiencia (rol) | Widgets (KPI / reporte) | Filtros globales | Ola inicial |
|---|---|---|---|---|
| DSH-PLA | Operador de plataforma (`pla.bia.tablero.ver`) | KPI-PLA-01 a KPI-PLA-21; lista de bandeja técnica; ranking de tenants por errores | Ambiente, tenant (agregado) | O1 |
| DSH-GER | Gerente, consejo, administrador del tenant (GOB-002) | KPI-CAT-01/02/03, KPI-FAC-01/02, KPI-COB-01/02/04, KPI-MOR-01/02, KPI-MED-05, KPI-CRM-01/04/07, KPI-TEC-01/02, KPI-TES-01, KPI-CON-01/02, KPI-INS-01; lista de configuraciones pendientes de aprobación (CU-GOB-01); alertas críticas | Período, servicio, sucursal | O2 (crece por ola) |
| DSH-COM | Comercial / atención comercial | KPI-CAT-01 a 06, KPI-POR-01 a 07, KPI-VEN-01/02, embudo REP-CAT-005 | Período, servicio, canal | O2 |
| DSH-FAC | Responsable de facturación | KPI-FAC-01 a 06, KPI-TAR-01/02, KPI-FIS-01/02/04, KPI-MED-01/02/03 (si hay medidos), lista de lotes abiertos (REP-FAC-005) | Período, ciclo, servicio | O4 |
| DSH-COB | Responsable de cobranzas | KPI-COB-01 a 10, serie de cobranza diaria por canal, ranking de canales por comisión (REP-COB-014) | Período, canal, caja, sucursal | O5 |
| DSH-CAJ | Cajero (PWA y admin) | Cobrado de mi caja hoy, operaciones de la sesión, diferencias abiertas (REP-COB-005) | Caja propia | O5 |
| DSH-MOR | Responsable de mora | KPI-MOR-01 a 08, aging REP-COB-002, tablero REP-MOR-027, KPI-COB-07 | Período, servicio, zona, categoría | O6 |
| DSH-TEC | Responsable técnico / jefe de cuadrilla | KPI-TEC-01 a 12, mapa de OT por estado (REP-TEC-001), KPI-STK-03/08, KPI-MOR-07 | Período, zona, cuadrilla, servicio | O3 |
| DSH-MED | Responsable de medición | KPI-MED-01 a 06, avance de rutas, excepciones por regla | Período de consumo, ruta, servicio | O7 |
| DSH-ATE | Responsable de atención | KPI-CRM-01 a 12, KPI-COM-03, backlog por área, turnos fallidos | Período, área, canal, servicio | O2 |
| DSH-CMP | Responsable de compras | KPI-CMP-01 a 05, KPI-STK-10, KPI-STK-01 | Período, centro, rubro | O8 |
| DSH-STK | Responsable de depósito | KPI-STK-01 a 10 | Depósito, custodia | O3/O8 |
| DSH-TES | Tesorero | KPI-TES-01 a 06, KPI-COB-10, previsiones semanales (REP-TES-007) | Período, cuenta | O8 |
| DSH-CON | Contador | KPI-CON-01 a 07, KPI-FIS-03, KPI-CMP-05, conciliaciones pendientes | Ejercicio, período, plan | O5/O8 |
| DSH-RRHH | Responsable de RRHH | KPI-SUE-01 a 06 (sin datos individuales sensibles, RN-SUE-093) | Período, empresa, área | O9 |
| DSH-INS | Secretaría / consejo | KPI-INS-01 a 07, próximas asambleas, KPI-SOC-01/03 | Período, distrito | O10 |
| DSH-SOC | Responsable de servicios sociales y flota | KPI-SOC-01 a 05 | Período, servicio | O10 |
| DSH-SEG | Responsable de seguridad / auditor | KPI-IAM-01 a 03, KPI-BIA-04, accesos de soporte (KPI-PLA-13 del tenant) | Período | O1 |
| DSH-DAT | Analista / responsable de datos | KPI-BIA-01 a 06, KPI-MIG-01/02 (durante migración) | Período | O11 |
| DSH-AREA | Responsables de área (BASE §54) | Lista de pendientes: casos sin asignar (KPI-CRM-12), turnos fallidos (KPI-TEC-05), tareas vencidas (REP-CRM-018), conciliaciones pendientes (KPI-TES-03, KPI-CON-04), reglas sin aprobar (REP-CFG-001) | Área | O2 |

### 15.8 Exportaciones

- **Toda grilla** del sistema exporta XLSX/CSV/PDF por API-BIA-12 con la capability `<mod>.<recurso>.exportar` (RF-BIA-021), con hoja de metadatos (RF-BIA-007) y protección de fórmulas (RF-BIA-028).
- **Archivos planos** por layout (PAN-BIA-08) para contables externos, GIS, entes y bancos cuando el módulo dueño no tenga un generador oficial.
- **Exportación masiva** por API (API-BIA-121) y **paquete de salida** del tenant (JOB-BIA-21) con diccionario de datos y checksums.
- **Feeds BI** por dataset (API-BIA-120) para Power BI, Excel y Looker Studio.
- **Datos abiertos** (API-BIA-64/65) solo con agregados aprobados.

## 16. Casos de uso

### CU-30 — Universo de un comprobante (BASE §30)

- **Actor:** Gerente.
- **Situación inicial:** escenario demo con la factura FAC-DEMO-001 de ARS 13.000 y pagos confirmados de ARS 5.000 y ARS 8.000.
- **Desarrollo:** 1) Abre REP-COB-024 con universo FAC-DEMO-001 y fecha de corte 31-10-2026. 2) Consulta importe emitido, cancelado y saldo. 3) Abre el detalle (drill-down) y compara con documentos e imputaciones.
- **Resultado esperado:** emitido ARS 13.000, cancelado ARS 13.000, saldo ARS 0; la acreditación bancaria neta aparece como otro indicador (KPI-COB-10).
- **Excepción:** si hay pagos en proceso, se muestran en columna "En proceso" separada de los confirmados (RN-BIA-009).

### CU-GOB-01 — Configuración pendiente en el tablero del tenant (BASE §54; dueño T11)

El caso de uso lo define T11 §16.1 ("Cambio de configuración aprobado": RF-WFL-110, EVT-CFG-02, EVT-WFL-016); T10 aporta solo la vista del tablero (corrección del 05-11-2026; antes este anexo lo definía como propio).

Un usuario autorizado modifica en TEN-001 la regla BON-VAR-30 del 30 % al 20 % con vigencia futura (T04). El cambio queda pendiente de aprobación. DSH-GER y DSH-AREA muestran el widget "Configuraciones pendientes" (fuente REP-CFG-001) y un usuario con permiso abre la evidencia (versión anterior, propuesta, actor, fecha). Al aprobarse, el widget se vacía y la aprobación queda como evento propio.

### CU-ERP-01 — Comparación de planes de cuentas (BASE §55)

El caso es de M15 (dueño de CU-ERP-01, M15 §16); T10 cubre solo la salida del reporte. El contador de TEN-001 ejecuta REP-CON-004 sobre el plan operativo PC-OPER-01 (Ingresos por servicios ARS 38.000) y sobre el alternativo PC-ALT-01 (Ingresos Agua ARS 13.000 e Ingresos Internet ARS 25.000; total ARS 38.000): los totales de los dos planes coinciden. La simulación SIM-ERP-001 de M15 aplica tarifa +10 % y da Agua ARS 14.300, Internet ARS 27.500 y total ARS 41.800, mientras los libros oficiales siguen en ARS 38.000 (prevalece M15; antes T10 asignaba a SIM-ERP-001 el total ARS 38.000). El reporte de la simulación lleva marca "SIMULACIÓN", columna `scenarioId` y no se mezcla con el oficial (RF-BIA-015, RN-BIA-020).

### CU-API-01 — Cliente de BI de la cooperativa (BASE §59)

1. El administrador de TEN-001 crea en PAN-BIA-15 el cliente CLI-BI-A (responsable USR-ADM-A, finalidad "Tablero propio de gerencia", scopes `billing:read` y `collections:read`, equivalentes a las propuestas `facturacion:leer` y `cobranza:leer` de BASE).
2. Otro usuario con `bia.api.clientes.aprobar` lo aprueba y emite la credencial (secreto visible una vez).
3. La herramienta obtiene un token (API-IAM-48) y consulta `GET /api/v1/ext/invoices?updatedSince=…` y `GET /payments`, paginado, con `asOf`.
4. Intentar `GET /invoices/:id` de TEN-002 → 404; intentar `POST` sobre facturas → 405/403 `insufficient-scope`.
5. Al revocar la credencial, en ≤ 60 s las llamadas devuelven 401 `invalid-token`.

### CU-BIA-01 — Ejecutar y exportar un reporte operativo

El responsable de cobranzas abre REP-COB-002 (aging) con corte 31-10-2026 y servicio Internet, ve totales por tramo, abre el tramo 31–60 (drill-down), exporta a XLSX y descarga desde PAN-BIA-04. El archivo trae hoja "Metadatos" con universo, corte y versión.

### CU-BIA-02 — Reporte asíncrono con cancelación

Un analista ejecuta REP-PER-001 para 300.000 cuentas; el sistema pasa a modo asíncrono, muestra progreso, el usuario cancela a mitad y la corrida queda `cancelled` liberando el worker; reintenta más tarde y la corrida nueva termina con aviso in-app.

### CU-BIA-03 — Programación mensual por email

La gerente programa REP-FAC-001 "primer día hábil de cada mes 07:00" con parámetro relativo `previousMonth`, formato XLSX y destinatarios: rol Consejo. El 2-11-2026 (si el 1 no es hábil, según calendario T04) corre, cada destinatario con permiso recibe un enlace; uno sin permiso queda `skippedNoPermission`.

### CU-BIA-04 — Alerta de indicador

Regla: KPI-MOR-02 > 12 % durante 2 días → severidad `warning` al rol Responsable de mora por in-app y email. Se dispara, el responsable reconoce, la condición deja de cumplirse 2 snapshots seguidos y la alerta se resuelve sola.

### CU-BIA-05 — Layout de archivo plano

El tenant define un layout de 120 posiciones para un sistema contable externo sobre REP-CON-001; la vista previa muestra 20 líneas de exactamente 120 caracteres; se activa y se exporta el diario de octubre.

### CU-BIA-06 — Reporte personalizado

Un analista arma "Deuda por barrio" sobre el dataset DS-SALDOS (dimensión barrio, medida saldo vencido), lo envía a revisión, otro usuario lo aprueba y queda publicado al rol Gerencia como REP-TEN-0001.

### CU-BIA-07 — Pregunta a la IA analítica

En la sala Cobranza, la gerente pregunta "¿Cuánto cobramos en octubre por Mercado Pago comparado con septiembre?". La IA genera la consulta semántica (dataset DS-COBROS, medida Cobrado, dimensión canal, períodos 2026-10 y 2026-09), el backend la ejecuta y la respuesta cita KPI-COB-01, universo y corte; cada cifra coincide con la consulta registrada. Si pregunta "¿cuánto debe Juan Pérez?", la IA se niega y ofrece abrir la ficha del socio.

### CU-BIA-08 — Reconciliación del almacén analítico

JOB-BIA-11 compara KPI-FAC-01 y KPI-COB-01 del día anterior entre fuente operativa y almacén; REP-BIA-007 muestra 0 diferencias. Se inyecta en ambiente de prueba un evento perdido: la diferencia supera la tolerancia, se emite EVT-BIA-14 y el dataset queda "en revisión" hasta reconstruir (JOB-BIA-12).

### CU-BIA-09 — Webhook firmado

Un sistema municipal se suscribe a `payment.confirmed`; al confirmarse un pago recibe POST con `CoopApps-Signature: t=…,v1=…`, verifica la firma con el ejemplo publicado, responde 200. Si responde 500, recibe reintentos 1 min, 5 min, 30 min…; tras `PRM-BIA-048` horas la entrega pasa a `dead` y el contacto técnico es avisado.

### CU-BIA-10 — Exportación masiva y extracción incremental

CLI-BI-A crea `POST /exports` del recurso `invoices` con `asOf`; descarga las partes NDJSON con checksum; luego consulta cada hora `GET /invoices?updatedSince=<asOf>` y recibe solo cambios (incluidas anulaciones como cambio de `status`).

### CU-BIA-11 — Salida del tenant (MER-020)

T01 inicia el cierre de TEN-002; JOB-BIA-21 genera un paquete por dataset canónico con diccionario y checksums; la API ext queda limitada a exportación; EVT-BIA-18 informa la entrega.

### CU-BIA-12 — Benchmark anónimo

TEN-001 adhiere en PAN-BIA-20 (segmento Internet, banda 2.000–10.000, Córdoba). En noviembre, con 6 participantes, ve que su KPI-MOR-02 está en el percentil 40 del segmento; un segmento con 4 participantes muestra "muestra insuficiente".

## 17. Criterios de aceptación y escenarios de prueba

| ESC | Escenario | Resultado esperado | Requisitos |
|---|---|---|---|
| ESC-BIA-01 | Usuario de TEN-001 ejecuta, exporta o descarga datos de TEN-002 (BASE §34 n.º 16) | Denegado; sin filas ni conteos de TEN-002 | RN-BIA-002, RF-BIA-100 |
| ESC-BIA-02 | Dos tenants con códigos internos iguales (cuenta 1001) ejecutan REP-COB-001 (n.º 19, 29) | Cada uno ve solo su cuenta | RF-BIA-004, RF-BIA-100 |
| ESC-BIA-03 | Usuario con alcance zona Norte ejecuta REP-MOR-001 | Filas y totales solo de zona Norte; no se informa cuántas filas se ocultaron | RN-BIA-003 |
| ESC-BIA-04 | Revocar el rol del propietario de una programación (n.º 20) | La siguiente corrida la suspende y avisa | RF-BIA-038 |
| ESC-BIA-05 | Resumen de cuenta y facturas en el mismo reporte (n.º 27) | El total no duplica | RN-BIA-008 |
| ESC-BIA-06 | Reporte de simulación tarifaria (n.º 39) y plan alternativo (n.º 40) | Marca SIMULACIÓN; ningún indicador real cambia | RF-BIA-015, RN-BIA-020 |
| ESC-BIA-07 | Tablero de TEN-001 vs TEN-002; tablero de plataforma (n.º 43) | Sin cruce; plataforma solo agregados | RF-BIA-048, RN-BIA-026 |
| ESC-BIA-08 | Token de BI de TEN-001 consulta TEN-002 o intenta escribir (n.º 45) | 404 y 403 `insufficient-scope` | RN-BIA-029, RN-BIA-031 |
| ESC-BIA-09 | Revocar o vencer una credencial (n.º 46) | Falla en ≤ `PRM-BIA-043` s | RN-BIA-036 |
| ESC-BIA-10 | Renombrar "Socio" a "Asociado" en el diccionario (n.º 54) | Cambian encabezados de UI/PDF; no cambian `fieldKey`, campos de API ni CSV técnico | RF-BIA-013 |
| ESC-BIA-11 | CU-30 | Emitido 13.000, cancelado 13.000, saldo 0; en proceso separado | RF-BIA-093 |
| ESC-BIA-12 | Exportación de 2 M filas a XLSX | 2 hojas o propuesta de CSV; SHA-256 correcto | RF-BIA-025, RF-BIA-032 |
| ESC-BIA-13 | Celda con `=HYPERLINK(...)` | Exportada como texto | RF-BIA-028 |
| ESC-BIA-14 | URL firmada vencida o usada por otro usuario | 403 | RF-BIA-022 |
| ESC-BIA-15 | Email de programación con reporte personal | Solo enlace, sin filas | RN-BIA-019 |
| ESC-BIA-16 | Reporte de 300.000 filas | Pasa a async sin bloquear; cancelable | RF-BIA-005, RF-BIA-009 |
| ESC-BIA-17 | 50 exportaciones encoladas en TEN-001 | La de TEN-002 no espera más que el objetivo de la cola justa | RF-BIA-033 |
| ESC-BIA-18 | Indicador sin datos o denominador 0 | Muestra "sin datos", nunca 0 | RN-BIA-022 |
| ESC-BIA-19 | Cambio de fórmula de un KPI certificado | Versión nueva; snapshots viejos conservan versión | RN-BIA-021 |
| ESC-BIA-20 | Deuda al 31-10 con un pago del 2-11 de fecha efectiva 2-11 | Saldo al 31-10 no cambia | RF-BIA-095 |
| ESC-BIA-21 | Reconciliación operativo vs analítico (CU-BIA-08) | 0 diferencias en estado normal; alerta ante evento faltante | RF-BIA-063 |
| ESC-BIA-22 | IA: cifra no presente en la consulta | El backend rechaza y devuelve respuesta determinística | RN-BIA-028 |
| ESC-BIA-23 | IA: pregunta fuera de alcance o por un socio individual | Rechazo con motivo; no envía datos personales al proveedor | RF-BIA-067 |
| ESC-BIA-24 | Exceso de rate limit | 429 con `Retry-After` y cabeceras `RateLimit-*` | RF-BIA-074 |
| ESC-BIA-25 | Incremental con transacción en curso | Ningún registro se pierde entre dos páginas (marca de agua) | RN-BIA-033 |
| ESC-BIA-26 | Webhook con firma alterada o timestamp > tolerancia | El ejemplo de verificación lo rechaza | RN-BIA-034 |
| ESC-BIA-27 | Suscripción a URL privada (`http://10.0.0.5`) | Rechazada (anti SSRF) | §7.21 |
| ESC-BIA-28 | Prueba de carga ext a 200 rps | p95 de `/api/admin` no se degrada más de 10 % | RF-BIA-075 |
| ESC-BIA-29 | `openapi.json` | Valida con linter y refleja solo recursos licenciados y scopes del cliente | RF-BIA-077 |
| ESC-BIA-30 | Dataset abierto con celda n = 4 | Suprimida o agregada en "Otros" | RN-BIA-041 |
| ESC-BIA-31 | Benchmark con 4 participantes | "Muestra insuficiente" | RN-BIA-027 |
| ESC-BIA-32 | Preset compartido usado por usuario con menor alcance | Se intersecan permisos; columnas sensibles ocultas | RN-BIA-042 |
| ESC-BIA-33 | Reporte "Recursos asignados a obras" con valor hora tipeado | Configuración (T04) no cambia | RN-BIA-001 |
| ESC-BIA-34 | Matriz regulatoria con categoría faltante o tramos superpuestos | Aviso antes de ejecutar | RN-BIA-047 |
| ESC-BIA-35 | Variación con base 0 | Nulo con marca "nuevo" (modo CoopApps) o 100 (modo ProCoop) | RN-BIA-010 |
| ESC-BIA-36 | Reintento de corrida programada tras caída del worker | No duplica envío (`scheduleId+plannedAt`) | JOB-BIA-03 |
| ESC-BIA-37 | Suspensión del tenant | API ext 403 `tenant-suspended`; programaciones pausadas | RF-BIA-086 |
| ESC-BIA-38 | Permisos negativos: usuario sin `bia.datosSensibles.ver` | DNI enmascarado en pantalla, export y API sin `pii:read` | RF-BIA-014, RF-BIA-073 |

Escenarios transversales de la maestra (ESC-01 a ESC-05) que tocan BIA: el cierre del piloto Internet (O6) se valida con DSH-GER mostrando KPI-CAT-01, KPI-FAC-01, KPI-COB-01, KPI-MOR-01 y KPI-TEC-04 reconciliados con los documentos del escenario.

## 18. Datos de precarga de demostración (ficticios)

| Dato | Valor |
|---|---|
| Tenants | TEN-001 "Cooperativa Ejemplo A" (Internet, agua, electricidad), TEN-002 "Cooperativa Ejemplo B" (Internet) con cuenta 1001 en ambos |
| Comprobante CU-30 | FAC-DEMO-001 ARS 13.000; pagos ARS 5.000 y ARS 8.000 confirmados; un pago ARS 1.500 "en proceso" en otra factura |
| Plan contable CU-ERP-01 | PC-OPER-01 y PC-ALT-01 (agua ARS 13.000, Internet ARS 25.000; total ARS 38.000); simulación SIM-ERP-001 de M15 con tarifa +10 % (agua ARS 14.300, Internet ARS 27.500; total ARS 41.800; antes agua 13.000 e Internet 25.000 asignados a la simulación) |
| Cliente de API | CLI-BI-A (TEN-001), responsable USR-ADM-A, scopes `billing:read`, `collections:read`, estado activo; credencial de ejemplo **sin secreto real** (prefijo `gac_demo0001`) |
| Webhook | Suscripción de prueba a `https://webhook.example.test/goodapps` con `payment.confirmed` |
| Indicadores | KPI de §15.6 certificados con 13 meses de snapshots ficticios para TEN-001 (p. ej. KPI-MOR-02 entre 8 % y 14 %) |
| Tableros | DSH-GER, DSH-COB, DSH-MOR, DSH-TEC publicados para TEN-001 |
| Presets | "Aging Internet zona Norte" (REP-COB-002), "Facturación mensual" (REP-FAC-001, relativo `previousMonth`) |
| Programación | REP-FAC-001 primer día hábil 07:00 al rol Consejo |
| Regla de alerta | KPI-MOR-02 > 12 % durante 2 días, `warning` |
| Layout | LAY-CONT-01 de 120 posiciones sobre REP-CON-001 |
| Dataset abierto | "Usuarios por servicio y categoría" de TEN-001, licencia CC-BY-4.0, mínimo de celda 10 |
| Benchmark | 6 tenants ficticios del segmento Internet / 2.000–10.000 / Córdoba |

## 19. Migración desde ProCoop

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `INFO_SYS` | `reportDefinitions` (habilitación por tenant) | Cada `COD_INF` se mapea a un REP del §15.4 por tabla de equivalencias; los sin equivalencia se listan para análisis | 100 % de `COD_INF` con destino REP o `Descartado` con motivo |
| `INFO_AUD` | `reportAccessLogs` (`legacy=true`) | `TIP_VIS` → `action` | Conteo origen = destino por año |
| `REPORTES` + archivos `Reportes_Empresa` | `reportTemplates` (override de tenant) | Diseño `.repx` no se convierte automáticamente: se recrea la plantilla HTML con logo/encabezado; el override "por equipo" se descarta | Lista de plantillas recreadas aprobada por el tenant |
| `ESQUEMAS_INFORMES_COBRANZAS` | `reportPresets` de REP-COB-020 / `collectionReportSchemes` (M07) | `LST_PRODUCTOS`, `LST_SERVICIO`, `LST_IMPUESTO` → parámetros con IDs nuevos | Mismo total por esquema en un día de prueba |
| `EXPORTADOR`, `EXPORTADOR_COLUMNAS` | `exportLayouts` | 1:1 de columnas (§7.8) | Archivo generado idéntico byte a byte para una muestra (salvo fechas de generación) |
| `ENTIDACOU` | `savedViews` | Filtros por usuario → vistas personales | Conteo por usuario |
| `TABLERO`, `TIPO_TAB` | `indicatorDefinitions` (`draft`) | Se proponen equivalencias con KPI del §15.6; los indicadores `COD_TIPO = 0` (aleatorios) se descartan (RN-BIA-023) | Revisión y certificación por el tenant |
| `TENDTAB` | `indicatorSnapshots` (`isClosed=true`, `definitionVersion=0`) | `REF_1..REF_4` → dimensiones | Conteo y suma de valores por indicador |
| `GRUPTAB`, `GRUTAB`, `GRAFTAB`, `ESTATAB` | `dashboards` del tenant (borrador) | Agrupaciones y orden → posiciones | Revisión visual |
| `TABLAS_POWERBI`, `PERFILES_TABLAS` | `analyticsDatasets.exposedTo.bi` y capabilities `bia.datasets.<codigo>.ver` | URL de Power BI como enlace externo | Lista revisada |
| `INFOCTD`, `INFOCTG`, `INFOCTN` | Configuración de matrices de M06/M03 usada por REP-MED-008 | Por módulo dueño | Mismo resultado del informe regulatorio en un período de paralelo |
| `WS_KEYS` | `apiClients` (sin credencial) | Se crean clientes equivalentes `pending`; las claves **no** se migran (comprometidas) | Lista de integraciones a reconfigurar entregada al tenant |
| `WEB_LOG` | Histórico consultable por REP-POR-002 (M19) | Solo lectura | Conteo |
| `OT_REPORTE` | `reportTemplates` de REP-TEC-023 | Por tipo de OT | Revisión visual |

El paralelo de reportes (T07) compara para un mes cerrado: REP-FAC-001, REP-COB-004, REP-COB-002, REP-MOR-001, REP-MED-006 y REP-FIS-001 contra los informes ProCoop equivalentes; toda diferencia se explica por causa (corrección de criterio documentada en §6, redondeo, dato corregido) o se corrige.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-BIA-01 | T02 §7.16, §4 (catálogo T10), P-IAM-20, PAN-IAM-24, API-IAM-47/48 vs T10 encabezado, §4.1, §7.18–7.19 | Ambos anexos se declaran dueños de `apiClients`/`apiCredentials` y usan capabilities distintas (`iam.apiClientes.ver` y `iam.apiClientes.gestionar` (antes `iam.apiClientes.*`, comodín; T02 §4.4.3), `bia.reportes.crear`, `bia.cubos.certificar`, `bia.ia.consultar`, `bia.apis.consumir` vs `bia.api.*`, `bia.disenador.usar`, `bia.cubos.certificar` (antes `bia.indicadores.certificar`), `bia.ia.consultar` (antes `bia.ia.preguntar`)) | **T02 es dueño físico** de `apiClients` y `apiCredentials`, del hash de secretos, del endpoint de token (API-IAM-48) y de la rotación (`PRM-IAM-074`, al que `PRM-BIA-042` es alias). **T10 es dueño** del catálogo de scopes y recursos, de los campos de perfil de datos (`purpose`, `systemType`, `fieldRestrictions`, `dataScope`, `rateLimit`, `validTo`) que se agregan al mismo documento, de la aprobación de scopes, del uso, cuotas y webhooks. PAN-BIA-15 es la pantalla de negocio y delega en API-IAM-47 las operaciones de credencial. Capabilities: rige la lista granular de T10 §4.1; equivalencias para el catálogo de T02: `bia.reportes.crear` ≡ `bia.disenador.usar`; `bia.cubos.certificar` ≡ `bia.cubos.certificar` (antes `bia.indicadores.certificar`); `bia.ia.consultar` ≡ `bia.ia.consultar` (antes `bia.ia.preguntar`); `iam.apiClientes.ver` ≡ `bia.api.clientes.ver`; `iam.apiClientes.gestionar` ≡ `bia.api.clientes.crear` + `bia.api.credenciales.rotar`; `bia.apis.consumir` se mantiene como capability técnica del rol S-API. T02 debe alinear su catálogo en su próxima versión. | Coherencia interna: identidad y secretos en T02, contrato de datos en T10 (guía §5 códigos de anexo; T06 §2 "la API de datos se especifica en T10") |
| CTR-BIA-02 | Anexos M01, M02, M07–M11, M17, M18 (`REP-<MOD>-NN`) vs RF-BIA-001 (`REP-<MOD>-NNN`); M03, M05, M06, M13–M16, M19, T01–T07 sin códigos | Formato de código de reporte inconsistente | Código consolidado de tres dígitos; equivalencia uno a uno con el de dos dígitos (§15.2); para anexos sin código, rige la numeración del §15.4. | Guía §5 (IDs estables) |
| CTR-BIA-03 | T01 PAN-PLA-01 y §15.1 vs RF-BIA-048 | Dos pantallas candidatas para el tablero de plataforma GOB-001 | La pantalla es PAN-PLA-01 (T01); los KPI se definen allí y se cargan en el motor de indicadores de BIA (KPI-PLA-01 a 21) servido por API-BIA-58. PAN-BIA-23 solo monitorea BI y API. | Dueño de la pantalla de plataforma = T01 |
| CTR-BIA-04 | RN-01 §23.8 (ProCoop), M04 §15.2, M03 §15, RN-BIA-010 | Tres fórmulas de variación porcentual con base 0: ProCoop/M04 = 100; M03 = anterior 0 → 1; RN-BIA-010 = nulo "nuevo" | Por defecto RN-BIA-010 (`PRM-BIA-022 = goodapps`); los reportes de M04 (REP-TAR-002, 003, 006) se declaran en modo `procoop` por decisión del dueño; REP-MED-004 conserva su regla de M03 documentada en su ficha. Toda salida indica el modo usado. `A validar (PA-BIA-11)`. | AGR-022 (definición declarada) + decisión del módulo dueño |
| CTR-BIA-05 | BASE §59 precarga (`facturacion:leer`, `cobranza:leer`) vs §4.3 (`billing:read`, `collections:read`) | Nombres de scopes | Se usan nombres técnicos en inglés (`<recurso>:<acción>`); BASE declara que los nombres son "propuestas pendientes". Las etiquetas visibles en español salen del diccionario. | Guía §5 (nombres técnicos en inglés) + BASE §59 (propuesta abierta) |
| CTR-BIA-06 | BASE §59 ("tokenizar no obliga a utilizar JWT") vs T02 P-IAM-20 (JWT 15 min) | Formato del token | JWT de vida corta con lista de revocación por cliente como opción por defecto; token opaco con introspección queda como alternativa. `A validar (PA-BIA-02)`. | BASE §59 deja abierto; T02 propone; se asume la recomendada |
| CTR-BIA-07 | DFA M28 e INV `clsInformesPersonalizados`, `EjecutarSPTemporal` vs BASE §59 y T08 | ProCoop permite informes y procesos personalizados con SQL o procedimientos | `Reemplazado por` generador sobre datasets certificados sin SQL (RF-BIA-041, RF-BIA-042, RN-BIA-014). | 2 (BASE) y deuda de seguridad (guía §3.5) sobre 5 (DFA/INV) |
| CTR-BIA-08 | FIC 18.1 / DFA M28 (Power BI sobre la base) vs DEC-002 | Acceso directo de Power BI a tablas | `Reemplazado por` feeds de datasets con API key de solo lectura (RF-BIA-102). | 1 (DEC-002) |
| CTR-BIA-09 | INV `Listados_Titulares.ClavesWeb` vs BASE §60, T08 | Informe que lista claves web de socios | `Descartado` (RN-BIA-015); REP-POR-001 lista usuarios sin credenciales. | 2 y seguridad (guía §3.5) |
| CTR-BIA-10 | INV `clsTablero` (`COD_TIPO = 0` → valor aleatorio) | Indicadores de demostración aleatorios | `Descartado` (RN-BIA-023). | Deuda técnica (guía §3.5) |
| CTR-BIA-11 | M07 §15 ("Indicadores para T09/M18") vs maestra (T10 dueño de indicadores) | Destino de los indicadores de cobranza | Se publican en T10 como KPI-COB-01 a 10; T09 solo recibe las alertas para notificar. | Maestra (T10 BIA dueño de tableros) |
| CTR-BIA-12 | T09 (sin §15 publicado; RF-COM-054 y RF-COM-193 remiten a "§15") vs catálogo consolidado | Faltan definiciones de reportes de comunidad | T10 propone REP-COM-001 a 007 y KPI-COM-01 a 05 con fórmulas tomadas de los RF de T09; T09 debe ratificarlos o ajustarlos en su §15. | Regla de oro (guía §1): no perder información |
| CTR-BIA-13 | M05 §15 (facturado = débitos − créditos no anulados) vs M06 §15 (facturado fiscal excluye detenidos e inciertos) | Dos definiciones de "facturado" | Dos términos distintos en el contrato semántico: Facturado y Facturado fiscal (§15.1). | AGR-022 |
| CTR-BIA-14 | RN-04 §10 y M08 REP-MOR-04 (meses = ⌊días / 30⌋) vs RN-BIA-057 (días exactos y meses calendario) | Cálculo de meses de deuda | REP-MOR-004 muestra la columna de M08 como principal y agrega días exactos y meses calendario; las reglas de corte usan la definición de M08. | Dueño del dato (M08) |
| CTR-BIA-15 | RN-07 §1.11 (período anterior = hasta "desde − 1 s" sin desde) vs RN-BIA-055 | Período anterior en estadísticas de demora | Por defecto "período anterior de igual duración"; la variante ProCoop queda como opción del reporte (REP-TEC-025, REP-CRM-008). | Mejora documentada (AGR-022) |
| CTR-BIA-16 | RN-BIA-001 ("Recursos asignados a obras" sobrescribe parámetros 2722/2723) vs T04 (configuración versionada) | Un reporte que modifica configuración | El valor hora es parámetro de la corrida de REP-TEC-027; el cambio de configuración se hace en T04. | DEC-003 (fronteras) y T04 |
| CTR-BIA-17 | RN-08 §15.2 (SIRCAR cambia si sigla = "AZUL") vs RN-BIA-040 | Personalizaciones por cliente en código | `Reemplazado por` configuración tipada del módulo dueño (M06). | Deuda técnica (guía §3.5) |

## 21. Preguntas abiertas

### PA-BIA-01 — Ubicación del almacén analítico
- **Pregunta:** ¿Dónde vive el almacén analítico `bi_*` de O11?
- **Contexto:** BASE §97.8 exige que BI no afecte facturación ni atención; DEC-001/DEC-004 fijan MongoDB y despliegue agnóstico. Cambia costo y complejidad operativa.
- **Opciones:**
  - A) Base lógica `<db>_analytics` leída desde un miembro oculto del replica set con etiqueta `analytics` (prioridad 0) **(Recomendada)** — aislamiento de carga suficiente, sin nueva tecnología.
  - B) Cluster MongoDB separado dedicado a analítica — más aislamiento, mayor costo y operación.
  - C) Sin almacén: todo BI sobre secundarios operativos — más simple, riesgo de impacto en horas pico y sin historización SCD2.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-060 a RF-BIA-064, JOB-BIA-09 a 12, O11.

### PA-BIA-02 — Formato del token de la API externa
- **Pregunta:** ¿Qué tipo de access token emite `/api/v1/ext/oauth/token`?
- **Contexto:** BASE §59 dice que tokenizar no obliga a JWT; T02 propone JWT de 15 minutos (CTR-BIA-06).
- **Opciones:**
  - A) JWT firmado de 15 minutos con lista de revocación por cliente en Redis **(Recomendada)** — validación rápida, revocación ≤ 60 s.
  - B) Token opaco con introspección en cada llamada (con caché) — revocación inmediata, más latencia.
  - C) Solo API key — más simple para terceros, menos seguro para escritura y scopes sensibles.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-071, §11.2.1, O11.

### PA-BIA-03 — Escrituras de terceros vía API
- **Pregunta:** ¿Se permiten operaciones de escritura desde `/api/v1/ext`?
- **Contexto:** Integra de ProCoop exponía `RegistrarCuenta`, `RegistrarPersona`, `PutCategoria` (FIC 14.3); BASE §59 prioriza la lectura.
- **Opciones:**
  - A) Solo **solicitudes** (persona, cuenta/servicio, reclamo) que el módulo dueño procesa con su circuito, idempotentes **(Recomendada)** — cubre bots y municipios sin saltear controles.
  - B) Solo lectura en `v1` — más simple; los terceros que hoy dan de alta cuentas dejan de poder hacerlo.
  - C) Escrituras directas sobre recursos — máxima flexibilidad, riesgo alto de datos inconsistentes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-088, API-BIA-130 a 133, scope `requests:write`.

### PA-BIA-04 — Destinatarios externos de reportes programados
- **Pregunta:** ¿Se pueden enviar reportes programados a emails que no son usuarios del tenant (auditor externo, municipio)?
- **Contexto:** MER-013 pide reportes programados; los datos personales no deben salir por email (BASE §97.1).
- **Opciones:**
  - A) Sí, solo para reportes `sensitivity=none`, a dominios en lista permitida, como adjunto o enlace de un solo uso con vencimiento **(Recomendada)** — cubre auditores y entes sin exponer datos personales.
  - B) No; solo usuarios del tenant — máxima seguridad, obliga a crear usuarios para externos.
  - C) Sí para cualquier reporte con enlace firmado — práctico, riesgo de fuga de datos personales.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-036, RN-BIA-019, PRM-BIA-057/058.

### PA-BIA-05 — Benchmark anónimo entre cooperativas
- **Pregunta:** ¿Se ofrece comparación anónima de indicadores entre cooperativas?
- **Contexto:** es una propuesta de valor del SaaS, no pedida en BASE; implica consentimiento y riesgo de reidentificación.
- **Opciones:**
  - A) Sí, con adhesión voluntaria, solo ratios, segmentos con ≥ 5 participantes y sin dominancia > 40 %, en O11 **(Recomendada)** — valor diferencial con riesgo controlado.
  - B) No ofrecer — sin riesgo, sin el valor.
  - C) Incluir a todos los tenants por defecto con opción de salida — más muestra, requiere cláusula contractual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-069, RN-BIA-027, PAN-BIA-20, JOB-BIA-18.

### PA-BIA-06 — Alcance de la IA analítica
- **Pregunta:** ¿La IA analítica acepta preguntas libres o solo preguntas de catálogo?
- **Contexto:** CNX §4.5 "cubo certificado primero, IA después"; ARQ-08 (IA solo propone); costo por tenant.
- **Opciones:**
  - A) Preguntas de catálogo + libres traducidas a consulta semántica verificada, habilitable por tenant con tope de costo **(Recomendada)** — útil y auditable.
  - B) Solo preguntas de catálogo — predecible, menos útil.
  - C) Sin IA analítica — sin costo ni riesgo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-066 a RF-BIA-068, PRM-BIA-036/037, O11.

### PA-BIA-07 — Conector para Power BI y herramientas de BI
- **Pregunta:** ¿Cómo se conectan Power BI, Excel o Looker Studio?
- **Contexto:** ProCoop publicaba tablas a Power BI (`TABLAS_POWERBI`); DEC-002 impide acceso directo a la base.
- **Opciones:**
  - A) API key de solo lectura + feeds `/datasets/:code/rows` (JSON/CSV paginado) **(Recomendada)** — funciona con conectores web estándar.
  - B) Además, un conector personalizado de Power BI publicado por CoopApps — mejor experiencia, mantenimiento extra.
  - C) Réplica de lectura directa por tenant — máxima flexibilidad, rompe la base compartida.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-102.

### PA-BIA-08 — Límites de consumo de la API por defecto
- **Pregunta:** ¿Qué límites por defecto tiene un cliente de API?
- **Contexto:** BASE §59 pide límites que no afecten facturación; dependen del plan comercial (T01).
- **Opciones:**
  - A) 600 solicitudes/min con ráfaga 100 y 100.000 unidades/día por cliente; 1.200/min por tenant; ajustables por plan **(Recomendada)** — suficiente para BI incremental.
  - B) 60/min sin cuota diaria — conservador, puede frustrar cargas iniciales.
  - C) Sin límite en planes superiores — riesgo para la plataforma compartida.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-074, PRM-BIA-053 a 055.

### PA-BIA-09 — Retención de archivos exportados
- **Pregunta:** ¿Cuántos días se conserva un archivo exportado antes de purgarse?
- **Contexto:** BASE §97.8 (conservación); los archivos pueden contener datos personales.
- **Opciones:**
  - A) 7 días **(Recomendada)** — equilibrio entre comodidad y exposición.
  - B) 30 días — más cómodo, más exposición y almacenamiento.
  - C) 24 horas — mínima exposición, más regeneraciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-024, PRM-BIA-008.

### PA-BIA-10 — Publicación de datos abiertos
- **Pregunta:** ¿Se ofrece a las cooperativas publicar datos abiertos en su landing?
- **Contexto:** MER-014 y transparencia ante socios y reguladores; requiere control de celdas mínimas.
- **Opciones:**
  - A) Opcional por tenant, solo agregados aprobados con n ≥ 10 por celda, en O11 **(Recomendada)**.
  - B) No ofrecer.
  - C) Publicación obligatoria de tarifas e indicadores de calidad de servicio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-089, PAN-BIA-21, API-BIA-64/65.

### PA-BIA-11 — Fórmula de variación porcentual con base cero
- **Pregunta:** ¿Qué se muestra cuando el valor base de una comparación es 0?
- **Contexto:** ProCoop y M04 muestran 100 %; RN-BIA-010 propone "nuevo" sin número (CTR-BIA-04).
- **Opciones:**
  - A) "Nuevo" (valor nulo) por defecto, con modo ProCoop por reporte cuando el dueño lo pida **(Recomendada)** — evita porcentajes engañosos sin romper paralelos.
  - B) 100 % en todo el sistema, como ProCoop — paralelo directo, matemáticamente engañoso.
  - C) "Nuevo" en todo el sistema sin excepción — consistente, rompe el paralelo de M04.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-BIA-010, PRM-BIA-022, REP-TAR-002/003/006.

### PA-BIA-12 — Auditoría de consultas a reportes
- **Pregunta:** ¿Qué accesos a reportes se registran?
- **Contexto:** BASE §54 deja la auditoría de lecturas "según necesidad"; volumen vs control.
- **Opciones:**
  - A) Exportaciones, descargas, desenmascarado y visualización de reportes con datos personales **(Recomendada)**.
  - B) Toda ejecución de cualquier reporte — máximo control, mucho volumen.
  - C) Solo exportaciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-034, PRM-BIA-059.

### PA-BIA-13 — Aprobación de reportes personalizados
- **Pregunta:** ¿Un reporte personalizado necesita aprobación de otra persona para publicarse?
- **Contexto:** MER-012 (gobierno de cambios); tenants chicos pueden tener un solo analista.
- **Opciones:**
  - A) Sí, aprobador distinto del autor, configurable a "no" solo por el administrador del tenant **(Recomendada)**.
  - B) Sin aprobación.
  - C) Aprobación de plataforma.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-043, PRM-BIA-027.

### PA-BIA-14 — Datos personales y de sueldos en la API
- **Pregunta:** ¿Se habilitan los scopes `pii:read` y `payroll:read`?
- **Contexto:** BASE §59 exige minimización; §97.1 protección de datos; RN-SUE-093 prohíbe datos sensibles de personal en BI general.
- **Opciones:**
  - A) `pii:read` con finalidad registrada, aprobación por persona distinta del creador y vigencia ≤ 1 año; `payroll:read` solo agregados por centro y período **(Recomendada)**.
  - B) No ofrecer ninguno de los dos.
  - C) `pii:read` sin aprobación adicional.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-073, API-BIA-116, §4.3.

### PA-BIA-15 — Webhooks salientes
- **Pregunta:** ¿Se ofrecen webhooks salientes a terceros?
- **Contexto:** AGR-021 y FIC 14.3; alternativa: solo consulta incremental.
- **Opciones:**
  - A) Sí, en O11, firmados HMAC-SHA256 con payload delgado y reintentos hasta 72 h **(Recomendada)**.
  - B) No; solo consulta incremental.
  - C) Sí, con payload completo (incluye datos del recurso).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-083, §12.3, API-BIA-124 a 129.

### PA-BIA-16 — Acceso delegado por usuario
- **Pregunta:** ¿Se habilita en la API el acceso en nombre de un usuario (authorization code + PKCE)?
- **Contexto:** BASE §59 pide "diferenciar integración servidor a servidor y acceso delegado"; RF-IAM-114 lo deja a T10.
- **Opciones:**
  - A) No en la primera versión de la API; tokens diseñados con `sub` opcional para habilitarlo después sin romper compatibilidad **(Recomendada)**.
  - B) Sí en O11 para aplicaciones confidenciales registradas, con scopes ⊆ capabilities del usuario.
  - C) Nunca.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §11.2.1, RF-IAM-114.

### PA-BIA-17 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 7 máquinas de §8 estaban en texto sin estado de alta en tabla; 4 referencias no tenían destino (`scenarioId`, `templateOriginId`, `catalogQuestionId`, `indicatorId`); 59 colecciones no tenían tabla de campos; 14 filas de §11 citaban reglas en lugar de una capability; los scopes `erp.catalog:read` y `erp.finance:read` figuraban sin capability en T02; `apiUsageDaily` usaba `day` en lugar del nombre canónico `date`.
- **Opciones:**
  - A) Agregar §8.12 con una fila por transición y estado inicial; declarar destinos (`scenarioId` → `simulationScenarios` de M15, `templateOriginId` → `customReports`) y renombrar `catalogQuestionCode` (antes `catalogQuestionId`, código de configuración); renombrar `date` (antes `day`); agregar §7.26 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `bia.reportes.ver`, `bia.exportaciones.crear`, `bia.apis.consumir` y `public: true` (con la condición o la capability adicional entre paréntesis); citar el mapeo de los scopes `erp` de T02 §4.4.3. **(Recomendada)**.
  - B) Dejar las máquinas solo en texto y las celdas como reglas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos, ER y matriz de capabilities de T10.
- **Estado:** Asumida (DEC-072): opción A.
- **Residual (5-11-2026), Asumida (DEC-072):** el texto de §7.11 y §7.13 se alinea a §7.26 y a T05 (COL-BIA-12, 15, 16): `indicatorSnapshots` y `kpiAlertRules` llevan `indicatorId` (→ `indicatorDefinitions`) como referencia e `indicatorCode` como copia desnormalizada; `kpiAlerts.kpiAlertRuleId` (antes `ruleId`) también en el índice y en la deduplicación del §9; `apiUsageDaily.date` ya estaba alineado (§7.20).
- **Sincronización (5-11-2026), Asumida (DEC-072):** T10 se suscribe directamente a los canónicos de EVT-COB-04, EVT-COB-05, EVT-COB-06 y EVT-IAM-05 (`iam.role.changed` / `iam.profile.changed`), porque los alias `cob.ledgerEntry.posted` e `iam.roleAssignment.changed` resuelven a un solo canónico (T11 §12.4.1, CNC-WFL-083 y CNC-WFL-089); las fuentes de `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_invoice` citan los canónicos con "antes".

## 22. Trazabilidad de fuentes

| Fuente | Destino en este anexo |
|---|---|
| BASE §30 (objetivo, límite, grupos Comercial/Uso/Liquidación/Recaudación/Deuda/Operación/Materiales/Finanzas/Resultados/Atención, CU-30, precarga) | §1, §2.2, RF-BIA-001, 007, 008, 046, 093; RN-BIA-004; §15.6 (cada grupo tiene KPI); §15.7; CU-30; REP-COB-024; §18 |
| BASE §31 (APIs documentadas, exportaciones controladas, reporte de conciliación) | RF-BIA-070 a 092; §11.2; RF-BIA-092 |
| BASE §33 (entidad Cliente de API) | §7.18; CTR-BIA-01 |
| BASE §34 n.º 16, 19, 20, 27, 29, 39, 40, 43, 45, 46, 54 | §17 ESC-BIA-01 a 10 |
| BASE §54 (GOB-001 a GOB-004, vistas, alertas, CU-GOB-01) | RF-BIA-048 a 059; §15.6.1; §15.7 (DSH-PLA, DSH-GER, DSH-AREA); CU-GOB-01 |
| BASE §55 (planes alternativos, simulaciones, CU-ERP-01) | RF-BIA-015; RN-BIA-020; CU-ERP-01 |
| BASE §57 (pendientes de indicadores y alertas) | RF-BIA-059; §7.13; PA-BIA-12 |
| BASE §58 ARQ-001 (APIs de cooperativas, datos analíticos) | RF-BIA-060; §7.15 |
| BASE §59 (API-001 a 003, alcance, datos candidatos, CU-API-01, precarga) | §4.3; RF-BIA-070 a 088; §11.2; CU-API-01; CTR-BIA-05, 06; PA-BIA-02, 03, 14, 16 |
| BASE §65 (diccionario; claves de API estables) | RF-BIA-013, 081; RN-BIA-032; API-BIA-72; ESC-BIA-10 |
| BASE §75 (reportes contables, seguimiento de cuentas) | RF-BIA-008, 092; REP-CON-001 a 025 |
| BASE §97.1, §97.8, §97.9 | RF-BIA-014, 024, 033, 075, 085; RN-BIA-016; PA-BIA-09 |
| BASE §99.3 (BI, generador, informes a reguladores) | RF-BIA-041, 060, 090; §15.5 |
| BASE §100 MER-002, MER-013, MER-014, MER-020 | RF-BIA-035, 041, 089 a 091; §9.12; §15.5; CU-BIA-11 |
| BASE §102 (AGR-022 ↔ MER-013), §104 SUE-014, §105 solución 8, §107 mensajes 2 y "No tiene API" | §1; REP-SUE-001; encabezado; RF-BIA-070 |
| AGR-001, 010, 011, 015, 019, 021, 022, 028 | RF-BIA-016, 062, 076, 083, 095; RN-BIA-005, 006, 007, 011; §15.1; KPI-CMP-05, REP-CMP-010, REP-TES-017 |
| CNX §2.3, §2.4, §2.6, §4.2, §4.3, §4.5, §4.6, §7.5, §10 V-01/V-07 | §4; RF-BIA-004, 011, 022, 051, 052, 065, 068, 074; §10 (PAN-BIA-10, 12) |
| DFA M28 (Editor de Reportes, Informes y Procesos Personalizados, `REPORTES`, `FORMULARIOS_PERSONALIZACIONES`, carpetas `Reportes`/`Reportes_Empresa`, Exportador, `TABLAS_POWERBI`, Tablero de Control, Exportar e Imprimir en todo listado; mejoras: tableros por rol, reportes estándar padrón/emisión/cobranza por ente/morosidad/libro IVA/consumos por categoría, API para BI) | PAN-BIA-07 a 12; RF-BIA-017, 021, 030, 041, 102; §15.7; REP-PER-001, REP-FAC-001, REP-COB-009, REP-MOR-001, REP-FIS-001, REP-MED-006; CTR-BIA-07, 08 |
| DFA menciones de informes de M3, M6, M7, M8, M10, M11, M12, M14 a M23, M25, M29 | §15.4 (reportes de cada módulo dueño) |
| REL `README.md` (funciones de Informes por pestaña; Configuración > Reportes) | PAN-BIA-01, 07 |
| CAT §25 `ESTATAB`, `GRAFTAB`, `GRUPTAB`, `GRUTAB`, `INFOCTD`, `INFOCTG`, `INFOCTN`, `INFO_SYS`, `TABLAS_POWERBI`, `TABLERO`, `TENDTAB`, `TIPO_TAB` | §7.10 a 7.12, §7.25; RF-BIA-098; RN-BIA-047; §19 |
| CAT §26 `WS_KEYS`, `WEB_LOG` | §7.18, §7.25, §19; REP-POR-002 |
| CAT §26 `WS_USERS`, `WS_USERS_ACCOUNTS`, `REQUISITOS`, `REQUISITOS_ITEMS`, `RSSFEED`, `WEB_NOVEDADES` | Delegado: M19 (usuarios, trámites online) y T09 (novedades, RSS); sin destino en BIA |
| CAT `REPORTES`, `EXPORTADOR`, `EXPORTADOR_COLUMNAS`, `FORMULARIOS_PERSONALIZACIONES`, `INFO_AUD`, `ESQUEMAS_INFORMES_COBRANZAS`, `OT_REPORTE`, `ENGAS_CANTMESES`, `ENTIDADES`/`ENTIDACOL`/`ENTIDACRIT`/`ENTIDACON`/`ENTIDACOU`, `PERFILES_TABLAS` | §7.25; §19; `ENGAS_CANTMESES` → parámetro del informe ENARGAS de M06 (REP-MED-019) |
| RN-10 §12, §13, §14, §16.4, §16.5, §16.6 | RF-BIA-003, 040, 042, 088; RN-BIA-014, 028, 030; §13 |
| RN-04 §8.12, §9, §10 | RN-BIA-052, 056, 057; REP-MOR-004, 010, 017 a 021 |
| RN-05 §13.11 | RF-BIA-094, 095; RN-BIA-006; PRM-BIA-021 |
| RN-06 §23.7 | RF-BIA-098; RN-BIA-047, 054; REP-MED-004 a 010 |
| RN-07 §1.10, §1.11 | RN-BIA-001, 012, 013, 053, 055; REP-TEC-025 a 028 |
| RN-08 §5.5, §15.1 `clsInformes_Tesoreria`, §15.2 `clsInformes_Contabilidad` | RN-BIA-040; REP-TES-001 a 017; REP-CON-020 a 025; CTR-BIA-17 |
| RN-01 §23.8, §23.9 | RN-BIA-005, 010; CTR-BIA-04 |
| RN-11 §4 | Indicadores de personal (KPI-SUE-01 a 06) y regla de no exponer datos sensibles (PA-BIA-14) |
| FIC 8, 14.3, 16, 18.1, 18.2 | §13; RF-BIA-088, 101, 102; §15.5 |
| INV `ReglasNegocio`: `Listados_Cobranzas`, `Informes_Cobranza`, `Informes_Mora`, `Listados_Financiacion`, `Listados_Tickets`, `Listados_Sueldos`, `Listados_Stock`, `Listados_Traslados`, `Listados_Telemed`, `Tipo_Informe` (vivienda y consumos), `Listados_Titulares`, `Listados_Tesoreria`, `Listados_Contablidad`, `TipoInforme` (movimiento de conceptos, libro IVA, técnica y redes, ranking), `Listados_Facturacion`, `Listados_Compras`, `Informes_Telefonia`, `Listados_Consumos` | REP-COB-*, REP-MOR-*, REP-CRM-*, REP-SUE-*, REP-STK-*, REP-SOC-011, REP-MED-013/014, REP-SOC-012 a 017, REP-MED-006, REP-PER-*, REP-TES-*, REP-CON-*, REP-FAC-002, REP-FIS-001, REP-TEC-*, REP-FAC-013, REP-FAC-*, REP-CMP-*, REP-TAR-013 y REP-TEC-022, REP-MED-* (catálogo §15.4); `Listados_Titulares.ClavesWeb` → `Descartado` (CTR-BIA-09) |
| INV clases `clsTablero`, `clsInformes*`, `clsPadronTitular`, `clsCirculares`, `clsInformesPersonalizados`, `clsExportacion`, `Exportador_Base`, `clsChatGPT` | PAN-BIA-10, PAN-BIA-02, REP-PER-001/014, REP-MOR-009, PAN-BIA-09, PAN-BIA-08, RN-BIA-028 |
| INV `Configuracion`: `frmEditorReportes`, `frmListadosPersonalizados`, `frmListadosPersonalizados_Parametros`, `abm_Reportes`, `frmInformeSimple`, `frmConsultaGenerica`, `frmExportacionArchivos`, `frmResultadoExportacion`, `TiposArchivosExportacion`, `Grilla_OT_Reporte` | §10.1 |
| INV `ProcoopNet` `frmInformes`; INV `ProMod_*` formularios de informes | §10.1; §15.4 |
| V2 #2294, #2306, #2568, #2590, #2650, #2749, #2875, #2951, #2968, #3022, #3066, #3095, #3172, #50, #2321, #2557, #2563, #2744, #2327 | §14 (PRM-BIA-068, PRM-BIA-P1-001 a 005 y lista de reemplazados); REP-COM-004 (#2327) |
| Parámetros ProCoop 2722/2723 (valor hora normal/extra) | RN-BIA-001; REP-TEC-027; CTR-BIA-16 |
| Anexos dueños §15: T01, T02, T04, T07, M01 a M19, T09 (pendiente) | §15.4 (catálogo con columna "Ref."), §15.6, CTR-BIA-02, 11, 12 |
| T06 (fichas con "Módulo dueño: T10", API-INT-47/48) | §11.2.6 nota final; §13 |
| DEC-002 (tenancy con `tenantId`); T05 CTR-DAT-50, COL-BIA-30 | §7.4 `reportRunResults` (reemplaza `bia_runResults_<tenant>`) |
| T05 CTR-DAT-03 | Encabezado; §7.18 y §7.19 (`apiClients`/`apiCredentials` de T02; T10 aporta los campos de perfil de datos) |
| DEC-064 (varias personas jurídicas por tenant) | §7.18 `dataScope.legalEntityIds[]` |
| DEC-096 (alcance completo de varias entidades jurídicas; completa DEC-064) | RF-BIA-004 (dimensión entidad del alcance); RF-BIA-034 y §7.9 `reportAccessLogs.legalEntityId`; RF-BIA-055; RF-BIA-104; PAN-BIA-19 (filtro); §7.15 `bi_fact_member.legalEntityId`, `bi_dim_costCenter.legalEntityId` y `sharedWithLegalEntityIds`; API-BIA-113 |
| T05 CTR-DAT-32 (extendida a T10) y §19.1 | Subdocumento `legacy` en `reportDefinitions`, `reportPresets`, `savedViews`, `reportTemplates`, `indicatorDefinitions`, `dashboards` y `apiClients` (antes `legacyRef`/`legacyRefs[]`); `procoopEquivalents[]` para equivalencias funcionales; PRM-BIA-070 expone solo `legacy.displayKey` |
| T05 CTR-DAT-30 (§7.2) | `storedFileId` en `reportExports` (antes `storageKey`). `serviceCode` se mantiene en la API externa (§11.2) como código público estable, no como referencia interna |

**Conteos del anexo:** 460 reportes en el catálogo (§15.4, incluidos 14 propios de BIA), 160 indicadores (§15.6), 20 tableros por rol (§15.7), 25 pantallas, 65 endpoints internos (API-BIA-01 a 65) y 64 endpoints externos `/api/v1/ext` (API-BIA-70 a 133), 18 eventos emitidos, 22 jobs, 75 parámetros, 17 contraposiciones y 16 preguntas abiertas.
