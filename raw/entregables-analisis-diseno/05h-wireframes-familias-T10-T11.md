# Wireframes por familia de pantallas: T10 a T11

**Artefacto 4.2 (Wireframes). Parte 05h.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: T10 BIA, T11 WFL (12 familias).

## T10 BIA: Reportes, BI y APIs

Anexo `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md`, §10. 5 familias, 25 PAN. Catálogo: [17-28-T10-BIA.md](17-catalogo-pantallas/17-28-T10-BIA.md).

### FAM-BIA-01 Reportes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-BIA-05 Programaciones (T10:1759) |
| Portales | admin |
| Rutas | `/admin/reportes`, `/admin/reportes/:code`, `/admin/reportes/corridas`, `/admin/reportes/exportaciones` y 2 más |
| Capabilities | `bia.reportes.ver`, `bia.reportes.ejecutar`, `bia.exportaciones.ver`, `bia.reportes.programar` |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > BIA > Programaciones        [Pausar] [Reanudar] [Ejecutar ahora*] |
| Programaciones                                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Módulo dueño ▼] [Cluster ▼] [Sensibilidad ▼]          |
| [Salida disponible ▼] [Más filtros]                                        |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Reporte   Preset    Recurrenc Formatos  Destinata Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   [Activo]   ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   [Pendient  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Pausar] [Reanudar] [Ver entreg… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T10:1718, T10:1730, T10:1741, T10:1750, T10:1759, T10:1768): Filtros: Módulo dueño, Cluster, Sensibilidad, Salida disponible, Origen, Ola habilitada; Columnas: Reporte, Preset, Recurrencia en lenguaje natural, Formatos, Destinatarios, Estado, Próxima corrida, Última corrida; Pestañas: Todos, Favoritos, Recientes, Programados, Regulatorios, Personalizados; Campos: Cabecera, Columna izquierda, Zona central en tarjetas, Panel de parámetros plegable arriba, Debajo, DataTable, Pestañas opcionales Gráfico y Mapa; Zonas: Cabecera, Columna izquierda, Zona central en tarjetas, Panel de parámetros plegable arriba, Debajo, DataTable, Pestañas opcionales Gráfico y Mapa; Pasos: Seleccionar filas; Modales: Progreso asíncrono, Detalle de un total, Confirmación de desenmascarado; Acciones: Pausar, Reanudar, Ejecutar ahora, Ver entregas, Duplicar, Deshabilitar, Abrir, Marcar favorito, Ver ficha, Programar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-BIA-01 | Catálogo de reportes | PT-05 | `/admin/reportes` | Usa PT-05 Tablero, reporte o mapa. Filtros: módulo dueño, cluster, sensibilidad, salida disponible, origen, ola habilitada; Columnas: código REP, nombre… |
| PAN-BIA-02 | Ejecución de reporte | PT-05 | `/admin/reportes/:code` | Usa PT-05 Tablero, reporte o mapa. Zonas: panel de parámetros plegable arriba, debajo, DataTable, pestañas opcionales Gráfico y Mapa; Pasos: Seleccionar… |
| PAN-BIA-03 | Mis corridas | PT-04 | `/admin/reportes/corridas` | Usa PT-04 Asistente por pasos o proceso masivo. Filtros: estado, reporte, disparador, rango de fechas, usuario; Columnas: fecha, reporte, versión, disparador… |
| PAN-BIA-04 | Mis exportaciones | PT-01 | `/admin/reportes/exportaciones` | Columnas: fecha, origen, formato, filas, tamaño, SHA-256, contiene datos personales, enmascarado, estado, vence |
| PAN-BIA-05 | Programaciones | PT-01 | `/admin/reportes/programaciones` | Columnas: reporte, preset, recurrencia en lenguaje natural, formatos, destinatarios, estado, próxima corrida, última… |
| PAN-BIA-06 | Presets y vistas guardadas | PT-01 | `/admin/reportes/presets` | Columnas: nombre, tipo, reporte o pantalla, dueño, compartido con, por defecto, última modificación |

### FAM-BIA-02 Configuración, layouts, generador y regulatorio

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-BIA-22 Catálogo regulatorio (T10:1885) |
| Portales | admin |
| Rutas | `/admin/reportes/configuracion`, `/admin/reportes/layouts`, `/admin/reportes/disenador`, `/admin/reportes/regulatorios` |
| Capabilities | `bia.reportes.configurar`, `bia.disenador.usar`, `bia.reportes.ver` |
| Olas | O1 a O11 |

```text
+----------------------------------------------------------------------------+
| Catálogo regulatorio                                             (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]      [Abrir el reporte regu…*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Configuración del… | | Calendario y tabla por … [______________]     | |
| | > Layouts de archivo | | Tabla de reportes [______________]            | |
| | > Generador de repo… | | Panel lateral [______________]                | |
| |                      | | Cabecera del layout [______________]          | |
| |                      | | Grilla editable de colu… [______________]     | |
| |                      | | Asistente en 5 pasos [______________]         | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T10:1775, T10:1782, T10:1790, T10:1885): Pestañas: Configuración del catálogo del tenant, Layouts de archivo, Generador de reportes del tenant; Campos: Calendario y tabla por organismo y servicio, Tabla de reportes, Panel lateral, Cabecera del layout, Grilla editable de columnas, Asistente en 5 pasos, (2) campos y medidas, (3) filtros y parámetros expuestos; Zonas: Calendario y tabla por organismo y servicio, Tabla de reportes, Panel lateral, Cabecera del layout, Grilla editable de columnas, Asistente en 5 pasos, (2) campos y medidas, (3) filtros y parámetros expuestos; Acciones: Abrir el reporte regulatorio, Ir a la presentación en el módulo dueño, Vista previa con 20 filas reales, Validar, Activar, Archivar, Duplicar, Importar desde Excel, Guardar borrador, Vista previa.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-BIA-07 | Configuración del catálogo del tenant | PT-09 | `/admin/reportes/configuracion` | Zonas: tabla de reportes, panel lateral |
| PAN-BIA-08 | Layouts de archivo | PT-01 | `/admin/reportes/layouts` | Usa PT-01 Listado con filtros. Zonas: cabecera del layout, grilla editable de columnas |
| PAN-BIA-09 | Generador de reportes del tenant | PT-05 | `/admin/reportes/disenador` | Usa PT-05 Tablero, reporte o mapa. Zonas: asistente en 5 pasos, (2) campos y medidas, los sensibles marcados), (3) filtros y parámetros expuestos, (4)… |
| PAN-BIA-22 | Catálogo regulatorio | PT-09 | `/admin/reportes/regulatorios` | Zonas: calendario y tabla por organismo y servicio |

### FAM-BIA-03 Tableros e indicadores

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-BIA-13 Catálogo de indicadores (T10:1822) |
| Portales | admin, empleado |
| Rutas | `/admin/tableros/:code`, `/admin/tableros/disenar`, `/admin/bi/:room`, `/admin/indicadores` y 2 más |
| Capabilities | `bia.tableros.ver`, `bia.tableros.disenar`, `bia.bi.ver`, `bia.indicadores.ver` y 1 más |
| Olas | O0 a O11 |

```text
+----------------------------------------------------------------------------+
| Catálogo de indicadores     Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Estado ▼]                                                                 |
+----------------------------------------------------------------------------+
| +-BiFilterBar---+ +-Series--------+ +-Rankings------+ +-Tortas ≤ 6 p…-+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Código KPI Nombre     Módulo     Unidad     Sentido    Refresco   [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T10:1799, T10:1807, T10:1814, T10:1822, T10:1830, T10:1903): Filtros: Estado; Columnas: Código KPI, Nombre, Módulo, Unidad, Sentido, Refresco, Estado, Versión; Campos: Definición completa, Historial de versiones, Últimas reconciliaciones, Serie de snapshots; Zonas: BiFilterBar, Series, Rankings, Tortas ≤ 6 porciones, Mapas de calor, Embudos, Lista de alertas abiertas, Lienzo de 12 columnas; Pasos: IA deshabilitada en el tenant, Zona C oculta; Acciones: Editar objetivos del tenant, Proponer versión, Certificar, Deprecar, Cambiar período/filtros, Fijar/ocultar/reordenar widgets, Exportar el tablero a PDF, Programar envío del tablero, Guardar borrador, Publicar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-BIA-10 | Tablero por rol | PT-05 | `/admin/tableros/:code` | Zonas: BiFilterBar, series, rankings, tortas ≤ 6 porciones, mapas de calor, embudos, lista de alertas abiertas; Pasos… |
| PAN-BIA-11 | Diseñador de tableros | PT-05 | `/admin/tableros/disenar` | Zonas: lienzo de 12 columnas, panel de propiedades, audiencia por roles, vista previa "como el rol X" |
| PAN-BIA-12 | Sala BI | PT-05 | `/admin/bi/:room` | Pasos: IA deshabilitada en el tenant, zona C oculta |
| PAN-BIA-13 | Catálogo de indicadores | PT-05 | `/admin/indicadores` | Columnas: código KPI, nombre, módulo, unidad, sentido, refresco, estado, versión, óptimo/umbral/objetivo del tenant… |
| PAN-BIA-14 | Alertas de indicadores | PT-05 | `/admin/indicadores/alertas` | Admin · /admin/indicadores/alertas · bia.alertas.configurar (reglas) y bia.alertas.gestionar (bandeja). pestaña… |
| PAN-BIA-25 | Tablero móvil (PWA empleado) | PT-07 | `/app/tablero` | Usa PT-07 Portal del socio y del empleado (PWA). Zonas: cards KPI, tocar una card abre el detalle en modo lectura, sin exportación ni edición |

### FAM-BIA-04 API, webhooks, datasets y monitoreo

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-BIA-15 Clientes de API (T10:1837) |
| Portales | admin, plataforma |
| Rutas | `/admin/api/clientes`, `/admin/api/uso`, `/admin/api/webhooks`, `/admin/bi/datasets` y 2 más |
| Capabilities | `bia.api.clientes.ver`, `bia.api.uso.ver`, `bia.api.webhooks.configurar`, `bia.datasets.ver` y 1 más |
| Olas | O1 a O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > BIA > Clientes de API [Suspender] [Reactivar] [Aprobar/rechazar*] |
| Clientes de API                                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Cliente ▼] [Endpoint ▼] [Estado HTTP ▼] [Rango ▼]     |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Tipo de s Responsab Finalidad Scopes    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Suspender] [Reactivar] [Revoca… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T10:1837, T10:1845, T10:1852, T10:1859, T10:1892, T10:1898): Filtros: Cliente, Endpoint, Estado HTTP, Rango; Columnas: Código, Nombre, Tipo de sistema, Responsable, Finalidad, Scopes, Restricciones, Estado; Campos: Diccionario de campos, Medidas con aditividad, Dimensiones e historización, Scope de API, Tabla de problemas RFC 9457, Límites, Política de versiones, Deprecación, Sandbox; Zonas: KPIs, Serie por hora, Tabla por cliente/endpoint/estado, Tabla de últimos errores, Pestañas Uso de API; Pasos: Datos y finalidad; Acciones: Aprobar/rechazar, Suspender, Reactivar, Revocar, Emitir/rotar/revocar credencial, Ver uso, Ver webhooks, Descargar OpenAPI del cliente.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-BIA-15 | Clientes de API | PT-01 | `/admin/api/clientes` | Columnas: código, nombre, tipo de sistema, responsable, finalidad, scopes, restricciones, estado, credenciales… |
| PAN-BIA-16 | Uso y cuotas de API | PT-05 | `/admin/api/uso` | Usa PT-05 Tablero, reporte o mapa. Filtros: cliente, endpoint, estado HTTP, rango; Zonas: KPIs, serie por hora, tabla por cliente/endpoint/estado, tabla… |
| PAN-BIA-17 | Webhooks salientes y entregas | PT-01 | `/admin/api/webhooks` | Admin · /admin/api/webhooks · bia.api.webhooks.configurar. pestaña suscripciones: cliente, URL (https), tipos de… |
| PAN-BIA-18 | Datasets semánticos | PT-01 | `/admin/bi/datasets` | Columnas: código DS, nombre, módulo, granularidad, medidas, frescura, estado, expuesto a; Campos: diccionario de… |
| PAN-BIA-23 | Monitoreo de BI y API (plataforma) | PT-05 | `/admin/plataforma/bia` | Usa PT-05 Tablero, reporte o mapa. Zonas: pestañas Uso de API |
| PAN-BIA-24 | Portal para desarrolladores | PT-01 | `/developers` | Campos: inicio rápido con `curl, tabla de problemas RFC 9457, límites, política de versiones, deprecación, sandbox |

### FAM-BIA-05 Auditoría, benchmark y datos abiertos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-BIA-20 Benchmark entre cooperativas (T10:1873) |
| Portales | admin |
| Rutas | `/admin/reportes/auditoria`, `/admin/bi/benchmark`, `/admin/bi/datos-abiertos` |
| Capabilities | `bia.auditoria.ver`, `bia.benchmark.ver`, `bia.datosAbiertos.publicar` |
| Olas | O1 a O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > BIA > Benchmark entre … [Retirarse] [Cambiar segmento] [Adherir*] |
| Benchmark entre cooperativas                                     (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Usuario ▼] [Reporte ▼] [Acción ▼] [Rango ▼]           |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Fecha     Usuario o Acción    Reporte   Filas     Contiene  [...]      |
| ---------------------------------------------------------------------      |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Retirarse] [Cambiar segmento]   25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T10:1866, T10:1873, T10:1879): Filtros: Usuario, Reporte, Acción, Rango; Columnas: Fecha, Usuario o cliente API, Acción, Reporte, Filas, Contiene datos personales, IP; Campos: Estado de adhesión y segmento declarado, Tabla de indicadores benchmarkables, Celdas suprimidas, Publicaciones, Editor; Zonas: Estado de adhesión y segmento declarado, Tabla de indicadores benchmarkables, Celdas suprimidas, Publicaciones, Editor; Acciones: Adherir, Retirarse, Cambiar segmento, Aprobar, Publicar, Retirar, Ver en landing.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-BIA-19 | Auditoría de accesos a reportes | PT-05 | `/admin/reportes/auditoria` | Usa PT-05 Tablero, reporte o mapa. Filtros: usuario, reporte, acción, rango; Columnas: fecha, usuario o cliente API, acción, reporte, filas, contiene… |
| PAN-BIA-20 | Benchmark entre cooperativas | PT-01 | `/admin/bi/benchmark` | Zonas: estado de adhesión y segmento declarado, tabla de indicadores benchmarkables, celdas suprimidas |
| PAN-BIA-21 | Datos abiertos | PT-01 | `/admin/bi/datos-abiertos` | Zonas: publicaciones, editor |

## T11 WFL: Workflow, eventos y documentos

Anexo `docs/especificacion/anexos/T11-WFL-workflow-eventos-documentos.md`, §10. 7 familias, 30 PAN. Catálogo: [17-29-T11-WFL.md](17-catalogo-pantallas/17-29-T11-WFL.md).

### FAM-WFL-01 Bandejas y agenda

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-22 Bandeja operativa de eventos (T11:2032) |
| Portales | admin |
| Rutas | `/admin/inicio/bandeja`, `/admin/inicio/bandeja/equipo`, `/admin/inicio/tareas/:id`, `/admin/inicio/agenda` y 2 más |
| Capabilities | `wfl.tareas.ver`, `wfl.bandeja.supervisar`, `wfl.agenda.ver`, `wfl.aprobaciones.delegar` y 1 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Bandeja operativa de eventos            [Registrar resolución …*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]                           |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Bandej… · Ítems …… | | Bandeja operativa: ········           | |
| | [SLA 2 h] Bandej… · Ítems …… | | Ítems con título func…: ········      | |
| | [SLA 2 h] Bandej… · Ítems …… | | Severidad: ········                   | |
| | ...                          | | Responsable: ········                 | |
| |                              | | Sujeto: ········                      | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Reprocesar] [Descartar con mot…] [A… | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2011, T11:2012, T11:2013, T11:2014, T11:2021, T11:2032): Columnas: Bandeja operativa, Ítems con título funcional, Severidad, Responsable, Sujeto, Acción sugerida; Campos: Bandeja operativa, Ítems con título funcional, Severidad, Responsable, Sujeto, Acción sugerida; Acciones: Reprocesar, Registrar resolución con evidencia, Descartar con motivo, Abrir el origen, Completar, Bloquear, Reasignar, Comentar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-01 | Mi bandeja de tareas | PT-06 | `/admin/inicio/bandeja` | Bandeja unificada. Zona de filtros (tipo, módulo, prioridad, área, sujeto). Grupos Vencidos, Hoy, Mañana, Próximos 7… |
| PAN-WFL-02 | Supervisión de bandejas | PT-06 | `/admin/inicio/bandeja/equipo` | Supervisión: carga por persona, vencidos por área, gráfico de antigüedad, reasignación masiva (modal lg) |
| PAN-WFL-03 | Detalle de tarea | PT-02 | `/admin/inicio/tareas/:id` | Usa PT-02 Ficha o detalle con pestañas. Detalle de tarea: datos, sujeto vinculado, checklist, formulario, adjuntos, comentarios con menciones, historial, SLA… |
| PAN-WFL-04 | Agenda unificada con vistas día, semana, mes y lista | PT-06 | `/admin/inicio/agenda` | Agenda unificada con vistas día, semana, mes y lista; capas por fuente con colores; equipo según alcance; crear cita… |
| PAN-WFL-11 | Mis delegaciones | PT-01 | `/admin/inicio/delegaciones` | Usa PT-01 Listado con filtros. Mis delegaciones (dadas y recibidas); nueva delegación (modal md: delegado, desde/hasta, alcance, límite, motivo)… |
| PAN-WFL-22 | Bandeja operativa de eventos | PT-06 | `/admin/inicio/bandeja-operativa` | Bandeja operativa: ítems con título funcional, severidad, responsable, sujeto y acción sugerida. Acciones: reprocesar… |

### FAM-WFL-02 Workflows, formularios y aprobaciones

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-05 Catálogo de máquinas de estado por módulo (T11:2015) |
| Portales | admin |
| Rutas | `/admin/configuracion/estados`, `/admin/configuracion/workflows`, `/admin/configuracion/formularios`, `/admin/configuracion/aprobaciones` y 1 más |
| Capabilities | `wfl.flujos.ver`, `wfl.flujos.configurar`, `wfl.formularios.configurar`, `wfl.aprobaciones.decidir` |
| Olas | O0 a O2 |

```text
+----------------------------------------------------------------------------+
| Catálogo de máquinas de estado por módulo                        (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                    [Publicar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Lista de definici… | | Transiciones [______________]                 | |
| | > Diseñador de form… | | Guardas [______________]                      | |
| | > Políticas de apro… | | Operación requerida [______________]          | |
| | > Detalle de aproba… | | Diseñador [______________]                    | |
| |                      | | Lienzo de nodos [______________]              | |
| |                      | | Aristas [______________]                      | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2015, T11:2016, T11:2017, T11:2019, T11:2020): Pestañas: Lista de definiciones, Diseñador de formularios, Políticas de aprobación, Detalle de aprobación; Campos: Transiciones, Guardas, Operación requerida, Diseñador, Lienzo de nodos, Aristas, Validación estructural, Simulación. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-05 | Catálogo de máquinas de estado por módulo | PT-09 | `/admin/configuracion/estados` | Catálogo de máquinas de estado por módulo, con diagrama de solo lectura, transiciones, capability, guardas y operación… |
| PAN-WFL-06 | Lista de definiciones | PT-01 | `/admin/configuracion/workflows` | Usa PT-01 Listado con filtros. Lista de definiciones (código, módulo, canal, versión vigente, borrador, instancias abiertas). Diseñador (xl): lienzo… |
| PAN-WFL-07 | Diseñador de formularios | PT-03 | `/admin/configuracion/formularios` | Usa PT-03 Formulario o editor. Diseñador de formularios: paleta de tipos de campo, propiedades (validaciones, visibilidad, editable por, fuente de… |
| PAN-WFL-09 | Políticas de aprobación | PT-09 | `/admin/configuracion/aprobaciones` | Políticas de aprobación: lista y editor de reglas (tramos de importe, atributos de riesgo, modo, pasos y quórum, SoD… |
| PAN-WFL-10 | Detalle de aprobación | PT-02 | `/admin/inicio/aprobaciones/:id` | Usa PT-02 Ficha o detalle con pestañas. Detalle de aprobación: resumen funcional, comparación antes/después cuando aplica, pasos con estado, decisiones… |

### FAM-WFL-03 Trámites, operaciones y expedientes

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-14 Expediente por sujeto (T11:2024) |
| Portales | admin |
| Rutas | `/admin/tramites/instancias`, `/admin/configuracion/operaciones`, `/admin/operaciones`, `/admin/expedientes/:subjectType/:id` y 1 más |
| Capabilities | `wfl.tareas.ver`, `wfl.flujos.configurar`, `wfl.operaciones.ver`, `wfl.expedientes.ver` y 1 más |
| Olas | O0 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > WFL > Expediente por sujeto                             (?) Ayuda |
| Expediente por sujeto  [Activo]       [Adjuntar] [Anular] [Nueva versión*] |
+----------------------------------------------------------------------------+
| Cabecera del sujeto: ········  Pestañas Documentos: ········  Línea de ti… |
| Trámites: ········       Número: ········         Definición: ········     |
+----------------------------------------------------------------------------+
| Instancias de trá… | Tipos de operació… | Operaciones | Expedientes forma… |
| ==================                                                         |
| Cabecera d Pestañas D Línea de t Trámites   Número     Definición [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2018, T11:2022, T11:2023, T11:2024, T11:2025): Columnas: Cabecera del sujeto, Pestañas Documentos, Línea de tiempo, Trámites, Número, Definición; Pestañas: Instancias de trámites, Tipos de operación del tenant, Operaciones, Expedientes formales; Campos: Cabecera del sujeto, Pestañas Documentos, Línea de tiempo, Trámites, Número, Definición, Sujeto, Solicitante; Acciones: Adjuntar, Nueva versión, Anular, Compartir, Legal hold, Exportar, Reintentar, Registrar resultado verificado, Cancelar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-08 | Instancias de trámites | PT-03 | `/admin/tramites/instancias` | Usa PT-03 Formulario o editor. Instancias de trámites: número, definición, sujeto, solicitante, estado, nodo actual, responsable, vencimiento… |
| PAN-WFL-12 | Tipos de operación del tenant | PT-09 | `/admin/configuracion/operaciones` | Usa PT-09 Configuración versionada. Tipos de operación del tenant: política asignada, plazos, evidencia, MFA |
| PAN-WFL-13 | Operaciones | PT-04 | `/admin/operaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Operaciones: número, tipo, sujeto, importe, solicitante, estado (Pendiente, Confirmado, Fallido, Incierto), fechas… |
| PAN-WFL-14 | Expediente por sujeto | PT-02 | `/admin/expedientes/:subjectType/:id` | Expediente por sujeto: cabecera del sujeto, pestañas Documentos (por tipo, con versión vigente y aceptadas), Línea de… |
| PAN-WFL-15 | Expedientes formales | PT-02 | `/admin/expedientes/formales` | Expedientes formales: número, tipo, carátula, estado, responsable, folios. Detalle con índice foliado, pases y acuses |

### FAM-WFL-04 Documentos, plantillas, numeración, firmas, eventos y jobs

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-16 Tipos documentales (T11:2026) |
| Portales | admin |
| Rutas | `/admin/configuracion/documentos/tipos`, `/admin/configuracion/plantillas`, `/admin/configuracion/numeracion`, `/admin/configuracion/firmas` y 2 más |
| Capabilities | `wfl.flujos.configurar`, `wfl.plantillas.ver`, `wfl.numeracion.configurar`, `wfl.firmas.configurar` y 2 más |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > WFL > Tipos documentales              [Abrir] [Exportar] [Nuevo*] |
| Tipos documentales                                               (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Sensibili Retención Extension Visibilid Metadatos Código    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2026, T11:2027, T11:2028, T11:2029, T11:2030, T11:2031): Columnas: Sensibilidad, Retención, Extensiones, Visibilidad para el socio, Metadatos, Código; Campos: Sensibilidad, Retención, Extensiones, Visibilidad para el socio, Metadatos, Código, Tipo documental, Módulo. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-16 | Tipos documentales | PT-01 | `/admin/configuracion/documentos/tipos` | Tipos documentales: sensibilidad, retención, extensiones, visibilidad para el socio, metadatos, vencimientos… |
| PAN-WFL-17 | Plantillas | PT-09 | `/admin/configuracion/plantillas` | Usa PT-09 Configuración versionada. Plantillas: código, tipo documental, módulo, versión vigente, borrador, requiere aprobación. Editor (xl) con HTML y… |
| PAN-WFL-18 | Secuencias | PT-01 | `/admin/configuracion/numeracion` | Secuencias: código, alcance, máscara, próximo, política de huecos, umbral. Libro de asignaciones con anulados. Ajuste… |
| PAN-WFL-19 | Perfiles de firma y firmantes habilitados | PT-02 | `/admin/configuracion/firmas` | Usa PT-02 Ficha o detalle con pestañas. Perfiles de firma (nivel, proveedor T06, OTP, evidencias, texto legal, apariencia) y firmantes habilitados. Ubicación… |
| PAN-WFL-20 | Catálogo de eventos del tenant | PT-09 | `/admin/configuracion/eventos` | Usa PT-09 Configuración versionada. Catálogo de eventos del tenant: tipo, productor, consumidores activos, versión, sensibilidad, visibilidad pública… |
| PAN-WFL-21 | Jobs del tenant | PT-02 | `/admin/configuracion/procesos` | Usa PT-02 Ficha o detalle con pestañas. Jobs del tenant: pestañas Programaciones (cron en hora local, ventana, próxima ejecución, último resultado; editar… |

### FAM-WFL-05 Bandeja en la PWA del empleado

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-23 Bandeja en tarjetas (T11:2033) |
| Portales | empleado |
| Rutas | `/app/bandeja`, `/app/agenda` |
| Capabilities | `wfl.tareas.ver`, `wfl.agenda.ver` |
| Olas | O1 a O2 |

```text
+------------------------------------------------------------+
| < Bandeja en tarjetas                                  (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | FAB "+": ········                                      | |
| | Push: ········                                         | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | FAB "+": ········                                      | |
| | Push: ········                                         | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Recibos | (+) | Solicitudes | Perfil              |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2033, T11:2034): Campos: FAB "+", Push. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-23 | Bandeja en tarjetas | PT-07 | `/app/bandeja` | Bandeja en tarjetas con grupos por vencimiento, FAB "+" (nueva tarea), aprobación con step-up en PWA, push |
| PAN-WFL-24 | Agenda del día y de la semana en tarjetas | PT-07 | `/app/agenda` | Agenda del día y de la semana en tarjetas |

### FAM-WFL-06 Trámites del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-25 Trámites (T11:2035) |
| Portales | empleado, socio |
| Rutas | `/app/tramites`, `/app/documentos`, `/app/firmar/:id` |
| Capabilities | `por.tramites.iniciar`, `por.comprobantes.descargar`, `wfl.documentos.firmar` |
| Olas | O2 a O4 |

```text
+------------------------------------------------------------+
| < Trámites                                             (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | "Mis trámites": ········                               | |
| | Iniciar: ········                                      | |
| | Seguir el estado público: ········                     | |
| | Responder observaciones: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | "Mis trámites": ········                               | |
| | Iniciar: ········                                      | |
| | Seguir el estado público: ········                     | |
| | Responder observaciones: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2035, T11:2036, T11:2037): Campos: "Mis trámites", Iniciar, Seguir el estado público, Responder observaciones, Adjuntar, Descargar la constancia. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-25 | Trámites | PT-07 | `/app/tramites` | "Mis trámites": iniciar (FAB "+", modal con formulario dinámico por pasos), seguir el estado público, responder… |
| PAN-WFL-26 | "Mis documentos" por cuenta y tipo | PT-07 | `/app/documentos` | "Mis documentos" por cuenta y tipo; descarga con URL firmada; firmar pendientes (conformidad, recibo) |
| PAN-WFL-27 | Lectura del documento, texto legal, OTP y firma | PT-07 | `/app/firmar/:id` | Lectura del documento, texto legal, OTP y firma; constancia |

### FAM-WFL-07 Trámites en campo y publicos

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-WFL-29 Verificación de documento por código o QR (T11:2039) |
| Portales | campo, landing |
| Rutas | `/app/campo/work-orders/:id/conformidad`, `/verificar`, `/d/:token` |
| Capabilities | `tec.ordenes.ejecutar`, `Público` |
| Olas | O1 a O3 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Verificación de documento por código o QR                            |
| [Ingresar*]   [Ver más]                                                    |
+----------------------------------------------------------------------------+
| [ Tipo ]  [ Fecha ]  [ Emisor ]  [ Hash ]  [ Sin datos personales ]        |
| [ Previsualización ]                                                       |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T11:2038, T11:2039, T11:2040): Campos: Tipo, Fecha, Emisor, Hash, Sin datos personales, Previsualización, Firma manuscrita, Datos declarados. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-WFL-28 | Acta de conformidad | PT-08 | `/app/campo/work-orders/:id/conformidad` | Usa PT-08 App de campo móvil (offline). Acta de conformidad: previsualización, firma manuscrita, datos declarados, foto opcional, offline |
| PAN-WFL-29 | Verificación de documento por código o QR | PT-10 | `/verificar` | Verificación de documento por código o QR: tipo, fecha, emisor y hash, sin datos personales |
| PAN-WFL-30 | Descarga por enlace compartido | PT-10 | `/d/:token` | Descarga por enlace compartido (contraseña si corresponde, vencimiento visible) |
