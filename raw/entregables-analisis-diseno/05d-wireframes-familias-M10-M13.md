# Wireframes por familia de pantallas: M10 a M13

**Artefacto 4.2 (Wireframes). Parte 05d.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: M10 TEC, M11 VEN, M12 CMP, M13 STK (32 familias).

## M10 TEC: Técnica, campo y redes

Anexo `docs/especificacion/anexos/M10-TEC-tecnica-campo-redes.md`, §10. 10 familias, 64 PAN. Catálogo: [17-10-M10-TEC.md](17-catalogo-pantallas/17-10-M10-TEC.md).

### FAM-TEC-01 Factibilidad técnica

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-02 Ficha de factibilidad (M10:2629) |
| Portales | admin |
| Rutas | `/admin/tec/feasibility`, `/admin/tec/feasibility/:id`, `/admin/tec/estimates/:id` |
| Capabilities | `tec.factibilidad.ver`, `tec.factibilidad.evaluar`, `tec.estimaciones.gestionar` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Inicio > TEC > Ficha de factibilidad                             (?) Ayuda |
| Ficha de factibilidad  [Activo] [Ver historial] [Cambiar estado] [Editar*] |
+----------------------------------------------------------------------------+
| Datos: ········          Punto en mapa: ········  Recurso propuesto: ····… |
| Notas: ········          Historial de cambios: ········  DataTable por es… |
+----------------------------------------------------------------------------+
| Bandeja de factib… | Estimación técnica                                    |
| ==================                                                         |
| Datos      Punto en m Recurso pr Notas      Historial  DataTable  [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2628, M10:2629, M10:2630): Columnas: Datos, Punto en mapa, Recurso propuesto, Notas, Historial de cambios, DataTable por estado; Pestañas: Bandeja de factibilidades, Estimación técnica; Campos: Datos, Punto en mapa, Recurso propuesto, Notas, Historial de cambios, DataTable por estado, Servicio, Zona. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-01 | Bandeja de factibilidades | PT-06 | `/admin/tec/feasibility` | Usa PT-06 Bandeja de trabajo. Bandeja de factibilidades. DataTable por estado, servicio, zona, vigencia; buscador por persona/domicilio/número… |
| PAN-TEC-02 | Ficha de factibilidad | PT-02 | `/admin/tec/feasibility/:id` | Ficha de factibilidad. Datos, punto en mapa, recurso propuesto, dictamen, notas, historial de cambios, vínculo a… |
| PAN-TEC-03 | Estimación técnica | PT-02 | `/admin/tec/estimates/:id` | Estimación técnica. Ítems de mano de obra/material/obra desde plantilla, totales, envío a M11 para presupuesto |

### FAM-TEC-02 Órdenes de trabajo

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-06 Asistentes de operación (M10:2633) |
| Portales | admin |
| Rutas | `/admin/tec/work-orders`, `/admin/tec/work-orders/:id`, `/admin/tec/work-orders/bulk-create`, `/admin/tec/work-orders/bulk-close` |
| Capabilities | `tec.ordenes.ver`, `tec.ordenes.ver/editar/cerrar`, `tec.ordenes.crear`, `tec.ordenes.crearMasivo` y 2 más |
| Olas | O3 |
| Wireframe detallado del piloto | W-09 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Asistentes de operación                                         [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Asistente por efe… ── (2) Desconexión ── (3) Reconexión ──             |
| (4) Traslado                                                               |
|                                                                            |
| Paso 2 de 4: Desconexión                                                   |
|   Asistente por efecto            [______________________]                 |
|   Desconexión                     [______________________]                 |
|   Reconexión                      [______________________]                 |
|   Traslado                        [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                 [Guardar borrador] [Confirmar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2631, M10:2632, M10:2633, M10:2634, M10:2635, M10:2676): Pestañas: Datos, Tareas, Materiales, Visitas, Evidencias, Conformidad, Notas; Campos: Asistente por efecto, Desconexión, Reconexión, Traslado, Cambio de medidor, DataTable con filtros, Vistas guardadas, KPI en encabezado. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-04 | Tablero de OT | PT-05 | `/admin/tec/work-orders` | Usa PT-05 Tablero, reporte o mapa. Tablero de OT. DataTable con filtros (estado, operación, tipo de trabajo, zona, cuadrilla, fechas, vencimiento… |
| PAN-TEC-05 | Ficha de OT | PT-02 | `/admin/tec/work-orders/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: datos, tareas, materiales, visitas, evidencias, conformidad, notas, datos extra, efectos, auditoría |
| PAN-TEC-06 | Asistentes de operación | PT-04 | modal xl desde cuenta/contrato | Asistentes de operación. Asistente por efecto: desconexión, reconexión, traslado (domicilio nuevo + factibilidad)… |
| PAN-TEC-07 | Generación masiva | PT-04 | `/admin/tec/work-orders/bulk-create` | Generación masiva. Filtros de contratos, operación, previsualización de cantidad, ejecución como job con progreso |
| PAN-TEC-08 | Cierre masivo | PT-04 | `/admin/tec/work-orders/bulk-close` | Cierre masivo. Selección, datos comunes de cierre, resultado por ítem, informe |
| PAN-TEC-49 | Carga rápida de reclamo (reemplazado) | PT-03 | Sin ruta en M10: se abre la carga de caso de M09 | Usa PT-03 Formulario o editor. Carga rápida de reclamo. Reemplazada por PAN-CRM-04 (M09: modal global "Nuevo caso" y /crm/carga-rapida) + derivación… |

### FAM-TEC-03 Despacho, agenda, recursos, materiales e instalaciones

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-10 Despacho (M10:2637) |
| Portales | admin |
| Rutas | `/admin/tec/materials`, `/admin/tec/dispatch`, `/admin/tec/schedule`, `/admin/tec/schedule/config` y 6 más |
| Capabilities | `tec.materiales.autorizar`, `tec.despacho.gestionar`, `tec.agenda.gestionar`, `tec.agenda.configurar` y 5 más |
| Olas | O3 a O7 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Despacho                                              [Resolver*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]                           |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Tabler… · Arrast…… | | Tablero por recurso/d…: ········      | |
| | [SLA 2 h] Tabler… · Arrast…… | | Arrastrar OT a recurso: ········      | |
| | [SLA 2 h] Tabler… · Arrast…… | | Capacidad: ········                   | |
| | ...                          | | Mapa lateral: ········                | |
| |                              | | Recuperación: ········                | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Tomar] [Asignar] [Derivar]           | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2636, M10:2637, M10:2638, M10:2639, M10:2640, M10:2641): Columnas: Tablero por recurso/día, Arrastrar OT a recurso, Capacidad, Mapa lateral, Recuperación, Solicitudes por OT; Campos: Tablero por recurso/día, Arrastrar OT a recurso, Capacidad, Mapa lateral, Recuperación, Solicitudes por OT, Autorización, Estado de reserva/vale. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-09 | Necesidades de materiales | PT-01 | `/admin/tec/materials` | Usa PT-01 Listado con filtros. Necesidades de materiales. Solicitudes por OT, autorización, estado de reserva/vale (consulta a M13) |
| PAN-TEC-10 | Despacho | PT-06 | `/admin/tec/dispatch` | Despacho. Tablero por recurso/día (carriles), arrastrar OT a recurso, capacidad, mapa lateral, estado de envío al… |
| PAN-TEC-11 | Agenda | PT-06 | `/admin/tec/schedule` | Agenda. Calendario por zona/tipo de visita, cupos, reservas, reprogramación, bloqueos |
| PAN-TEC-12 | Configuración de agenda | PT-06 | `/admin/tec/schedule/config` | Configuración de agenda. Tipos de visita, zonas, franjas, calendarios de recursos, feriados, sobrecupo |
| PAN-TEC-13 | Cuadrillas | PT-01 | `/admin/tec/crews` | Usa PT-01 Listado con filtros. Cuadrillas. ABM, integrantes con vigencia, zonas, tipos de trabajo, depósito/custodia asociada |
| PAN-TEC-14 | Recursos de campo | PT-01 | `/admin/tec/resources` | Usa PT-01 Listado con filtros. Recursos de campo. Técnicos/contratistas, habilidades, vehículo, dispositivo asignado |
| PAN-TEC-16 | Profesionales certificados | PT-01 | `/admin/tec/installers` | Usa PT-01 Listado con filtros. Profesionales certificados. Electricistas/instaladores habilitados, matrícula, vigencia |
| PAN-TEC-24 | Conflictos de sincronización | PT-06 | `/admin/tec/sync-conflicts` | Conflictos de sincronización. Bandeja, comparación lado a lado (servidor vs campo con evidencias), resolución |
| PAN-TEC-25 | Bandeja de instalaciones | PT-06 | `/admin/tec/installations` | Bandeja de instalaciones. Vista por etapa (8.5), bloqueos, pendientes de aprovisionamiento/revisión |
| PAN-TEC-61 | Guardias | PT-06 | `/admin/tec/on-call` | Guardias. Calendario de turnos por servicio y zona (titular, suplente, jefe), "de guardia ahora", huecos de cobertura… |

### FAM-TEC-04 Catálogos técnicos

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-23 Reglas de OT encadenadas (M10:2650) |
| Portales | admin |
| Rutas | `/admin/tec/notification-rules`, `/admin/tec/catalog/operations`, `/admin/tec/catalog/work-types`, `/admin/tec/catalog/incident-categories` y 5 más |
| Capabilities | `tec.config.gestionar`, `tec.formulariosCampo.gestionar` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Reglas de OT encadenadas                                         (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                    [Publicar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Responsables a no… | | Origen → destino [______________]             | |
| | > Tipos de operación | | Condición [______________]                    | |
| | > Tipos de trabajo   | | Demora [______________]                       | |
| | > Categorías de inc… | | ABM con efecto [______________]               | |
| | > Resoluciones       | | Requisitos de cierre [______________]         | |
| |                      | | Cargos antes/después [______________]         | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2642, M10:2644, M10:2645, M10:2646, M10:2647, M10:2648): Pestañas: Responsables a notificar, Tipos de operación, Tipos de trabajo, Categorías de incidencia, Resoluciones; Campos: Origen → destino, Condición, Demora, ABM con efecto, Requisitos de cierre, Cargos antes/después, Numeración, Reglas; Pasos: Origen, Destino, condición, demora. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-15 | Responsables a notificar | PT-01 | `/admin/tec/notification-rules` | Usa PT-01 Listado con filtros. Responsables a notificar. Reglas por operación/tipo/zona/evento |
| PAN-TEC-17 | Tipos de operación | PT-09 | `/admin/tec/catalog/operations` | Tipos de operación. ABM con efecto, requisitos de cierre, cargos antes/después, numeración, reglas |
| PAN-TEC-18 | Tipos de trabajo | PT-09 | `/admin/tec/catalog/work-types` | Tipos de trabajo. ABM, SLA, vencimiento |
| PAN-TEC-19 | Categorías de incidencia | PT-01 | `/admin/tec/catalog/incident-categories` | Usa PT-01 Listado con filtros. Categorías de incidencia. ABM jerárquico |
| PAN-TEC-20 | Resoluciones | PT-01 | `/admin/tec/catalog/resolutions` | Usa PT-01 Listado con filtros. Resoluciones. Códigos de resolución y estados resultantes |
| PAN-TEC-21 | Tareas y grupos | PT-06 | `/admin/tec/catalog/tasks` | Usa PT-06 Bandeja de trabajo. Tareas y grupos. Catálogo de tareas, duración estándar, grupos |
| PAN-TEC-22 | Plantillas de impresión | PT-09 | `/admin/tec/catalog/print-templates` | Plantillas de impresión. Diseño de comprobante de OT por operación (variables) |
| PAN-TEC-23 | Reglas de OT encadenadas | PT-09 | `/admin/tec/catalog/chained-rules` | Pasos: Origen, destino, condición, demora |
| PAN-TEC-26 | Formularios de campo | PT-03 | `/admin/tec/field-forms` | Usa PT-03 Formulario o editor. Formularios de campo. Diseñador versionado (CNX §7.8): campos, validaciones, obligatoriedad por operación |

### FAM-TEC-05 Redes, activos, GIS y obras

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-27 Activos y mantenimiento (M10:2654) |
| Portales | admin |
| Rutas | `/admin/tec/maintenance`, `/admin/tec/networks/structure`, `/admin/tec/networks/elements`, `/admin/tec/networks/connections` y 5 más |
| Capabilities | `tec.mantenimiento.gestionar`, `tec.redes.configurar`, `tec.redes.gestionar`, `tec.redes.exportar` y 4 más |
| Olas | O3 a O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > TEC > Activos y mantenimiento         [Abrir] [Exportar] [Nuevo*] |
| Activos y mantenimiento                                          (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Activos   Mantenimi Planes pr Historial OT genera Redes     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2654, M10:2657, M10:2658, M10:2659, M10:2660, M10:2661): Columnas: Activos, Mantenimiento, Planes preventivos, Historial por activo, OT generadas, Redes; Campos: Activos, Mantenimiento, Planes preventivos, Historial por activo, OT generadas, Redes, Capas, Tipos de componente. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-27 | Activos y mantenimiento | PT-01 | `/admin/tec/maintenance` | Activos y mantenimiento. Planes preventivos, historial por activo, OT generadas |
| PAN-TEC-30 | Estructura de redes | PT-01 | `/admin/tec/networks/structure` | Estructura de redes. Redes, capas, tipos de componente, atributos, relaciones permitidas |
| PAN-TEC-31 | Red instalada | PT-01 | `/admin/tec/networks/elements` | Red instalada. Árbol + mapa, alta individual/múltiple, edición de atributos, estado |
| PAN-TEC-32 | Conexiones servicio–red | PT-01 | `/admin/tec/networks/connections` | Conexiones servicio–red. Conexión vigente e historial por contrato/elemento, nueva conexión |
| PAN-TEC-33 | Red v1 (absorbida) | PT-01 | Sin ruta: no se publica (absorbida en PAN-TEC-30/31) | Red v1 (absorbida). No existe como pantalla; se migra a PAN-TEC-30/31 |
| PAN-TEC-34 | Exportación GIS | PT-01 | `/admin/tec/networks/exports` | Exportación GIS. Plantillas, ejecución, descargas |
| PAN-TEC-35 | Equipos de red | PT-01 | `/admin/tec/network-devices` | Equipos de red. Inventario lógico (routers, OLT, NAS, centrales), estado de monitoreo, credenciales en bóveda (solo… |
| PAN-TEC-39 | Obras y loteos | PT-04 | `/admin/tec/works` | Usa PT-04 Asistente por pasos o proceso masivo. Obras y loteos. ABM de obras, grupos, presupuesto, avance, OT asociadas |
| PAN-TEC-40 | Contribución por mejoras | PT-01 | `/admin/tec/works/:id/levy` | Contribución por mejoras. Padrón (importación), criterio, simulación, aprobación, envío a facturación |
| PAN-TEC-48 | Revisión de geolocalización | PT-01 | `/admin/tec/geo-review` | Revisión de geolocalización. Puntos dudosos/sin ubicar, corrección en mapa, confianza |

### FAM-TEC-06 Interrupciones, mapa, inspecciones e informes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-28 Interrupciones e impacto (M10:2655) |
| Portales | admin |
| Rutas | `/admin/tec/outages`, `/admin/tec/map`, `/admin/tec/inspections`, `/admin/tec/reports` y 2 más |
| Capabilities | `tec.cortes.gestionar`, `tec.mapa.ver`, `tec.inspecciones.gestionar`, `tec.reportes.ver` y 2 más |
| Olas | O3 a O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > TEC > Interrupciones e impacto        [Abrir] [Exportar] [Nuevo*] |
| Interrupciones e impacto                                         (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Selección Impacto   Críticos  Aviso     Seguimien Capas     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2655, M10:2656, M10:2668, M10:2674, M10:2678, M10:2680): Columnas: Selección en mapa/árbol, Impacto, Críticos, Aviso, Seguimiento, Capas; Campos: Selección en mapa/árbol, Impacto, Críticos, Aviso, Seguimiento, Capas, OT por estado, Recursos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-28 | Interrupciones e impacto | PT-01 | `/admin/tec/outages` | Interrupciones e impacto. Selección en mapa/árbol, impacto, críticos, aviso, seguimiento |
| PAN-TEC-29 | Mapa operativo | PT-05 | `/admin/tec/map` | Usa PT-05 Tablero, reporte o mapa. Mapa operativo. Capas: OT por estado, recursos (última posición informada), red, contratos, reclamos derivados… |
| PAN-TEC-41 | Inspecciones y fraude | PT-01 | `/admin/tec/inspections` | Inspecciones y fraude. Casos, acta, precintos, descargos, recupero |
| PAN-TEC-47 | Informes técnicos | PT-05 | `/admin/tec/reports` | Usa PT-05 Tablero, reporte o mapa. Informes técnicos. Catálogo de informes (§15), parámetros, exportación |
| PAN-TEC-62 | Protocolos de emergencia | PT-04 | `/admin/tec/emergency-protocols` | Usa PT-04 Asistente por pasos o proceso masivo. Protocolos de emergencia. ABM versionado por tipo de emergencia y servicio: pasos obligatorios, corte preventivo… |
| PAN-TEC-64 | Calidad del agua | PT-01 | `/admin/tec/water-quality` | Calidad del agua. Puntos de muestreo en mapa, plan de muestreo, muestras por estado, resultados por parámetro con… |

### FAM-TEC-07 Aprovisionamiento TIC

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-36 Sistemas de aprovisionamiento (M10:2663) |
| Portales | admin |
| Rutas | `/admin/tec/provisioning/systems`, `/admin/tec/provisioning/commands` |
| Capabilities | `tec.aprovisionamiento.configurar`, `tec.servicioTecnico.ver/editar`, `tec.aprovisionamiento.operar` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Inicio > TEC > Sistemas de aprovisionamiento   [Abrir] [Exportar] [Nuevo*] |
| Sistemas de aprovisionamiento                                    (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Bandeja por estado ▼] [Más filtros]                   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Alta de s Prueba de Sincroniz Historial Bandeja p Reintenta [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2663, M10:2664, M10:2665): Filtros: Bandeja por estado; Columnas: Alta de sistema, Prueba de conexión, Sincronización de catálogos, Historial, Bandeja por estado, Reintentar; Campos: Alta de sistema, Prueba de conexión, Sincronización de catálogos, Historial, Bandeja por estado, Reintentar, Marcar manual. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-36 | Sistemas de aprovisionamiento | PT-01 | `/admin/tec/provisioning/systems` | Sistemas de aprovisionamiento. Alta de sistema (tipo, endpoint, credencial en bóveda, perfiles), prueba de conexión… |
| PAN-TEC-37 | Datos técnicos del servicio | PT-11 | pestaña en contrato | Usa PT-11 Modal, pestaña o componente embebido. Datos técnicos del servicio. IP/PPPoE/ONT/VLAN/plan técnico/casillas, historial |
| PAN-TEC-38 | Consola de comandos | PT-06 | `/admin/tec/provisioning/commands` | Usa PT-06 Bandeja de trabajo. Consola de comandos. Bandeja por estado (8.9), reintentar, marcar manual, ver solicitud/respuesta (sanitizada) |

### FAM-TEC-08 Telefonía

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-42 Red telefónica física (M10:2669) |
| Portales | admin |
| Rutas | `/admin/tec/phone/plant`, `/admin/tec/phone/numbering`, `/admin/tec/phone/lines`, `/admin/tec/phone/cdr` y 2 más |
| Capabilities | `tec.telefonia.redFisica.ver`, `tec.telefonia.numeracion.ver`, `tec.telefonia.lineas.ver`, `tec.cdr.importar` y 1 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > TEC > Red telefónica física           [Abrir] [Exportar] [Nuevo*] |
| Red telefónica física                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Centrales Puertos   Repartido Grupos    Regletas/ Prefijos  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2669, M10:2670, M10:2671, M10:2672, M10:2673, M10:2679): Columnas: Centrales, Puertos, Repartidores, Grupos, Regletas/posiciones, Prefijos; Campos: Centrales, Puertos, Repartidores, Grupos, Regletas/posiciones, Prefijos, Plan de numeración, Números. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-42 | Red telefónica física | PT-01 | `/admin/tec/phone/plant` | Red telefónica física. Centrales, puertos, repartidores, grupos, regletas/posiciones, cajas, DSLAM |
| PAN-TEC-43 | Numeración | PT-09 | `/admin/tec/phone/numbering` | Usa PT-09 Configuración versionada. Numeración. Prefijos, plan de numeración, números y estados |
| PAN-TEC-44 | Líneas | PT-01 | `/admin/tec/phone/lines` | Líneas. Línea por contrato, puerto/posición/número, historial |
| PAN-TEC-45 | Importación de CDR | PT-04 | `/admin/tec/phone/cdr` | Usa PT-04 Asistente por pasos o proceso masivo. Importación de CDR. Importaciones, errores, no atribuidas, reversión |
| PAN-TEC-46 | Telefonía móvil | PT-01 | `/admin/tec/phone/mobile` | Telefonía móvil. Importación de consumos Claro/Personal, conciliación por línea |
| PAN-TEC-63 | Portabilidad numérica | PT-01 | `/admin/tec/phone/portings` | Portabilidad numérica. Solicitudes entrantes y salientes por estado, ventana, constancias. Visible solo si PRM-TEC-156… |

### FAM-TEC-09 Trabajo en campo

| Dato | Valor |
|---|---|
| Patrón base | PT-08 App de campo móvil (offline) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-50 Mi día (M10:2687) |
| Portales | campo |
| Rutas | `/app/campo/today`, `/app/campo/work-orders/:id`, `/app/campo/stock`, `/app/campo/sync` y 4 más |
| Capabilities | `tec.campo.ver`, `tec.campo.ejecutar`, `stk.custodia.ver`, `tec.inspecciones.editar` y 1 más |
| Olas | O3 a O7 |
| Wireframe detallado del piloto | W-16, W-17 en [05](05-wireframes-pantallas-piloto.md) |

```text
+------------------------------------------------------------+
| Sin conexión · N cambios pendientes [Sincronizar]          |
+------------------------------------------------------------+
| Mi día                                              Sincr. |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Dirección: ········                                    | |
| | Botón navegar: ········                                | |
| | Estado: ········                                       | |
| | Pasos: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Dirección: ········                                    | |
| | Botón navegar: ········                                | |
| | Estado: ········                                       | |
| | Pasos: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [Cámara] [Firma] [Escanear]                                |
|                                                      ( + ) |
| [                       Iniciar                       * ]  |
+------------------------------------------------------------+
| Hoy | Órdenes | (+) | Stock en vehículo | Sincronización   |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2686, M10:2687, M10:2688, M10:2689, M10:2690, M10:2691): Campos: Dirección, Botón navegar, Estado, Pasos, Funciona sin red, Mi stock, Custodia del técnico, Devolución; Pasos: En camino, Llegué, Checklist/formulario, Escaneo de equipo, Materiales, Fotos, Prueba. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-50 | Mi día | PT-08 | `/app/campo/today` | Mi día. Lista ordenada de visitas/OT con franja, dirección, botón navegar (app de mapas del dispositivo), estado |
| PAN-TEC-51 | Ejecución de OT | PT-08 | `/app/campo/work-orders/:id` | Pasos: En camino, Llegué, checklist/formulario, escaneo de equipo, materiales, fotos, prueba, conformidad/firma |
| PAN-TEC-52 | Mi stock (absorbida por PAN-STK-37) | PT-08 | `/app/campo/stock` | Mi stock. Custodia del técnico (consulta de M13 en caché), devolución, diferencias |
| PAN-TEC-53 | Cola de sincronización | PT-08 | `/app/campo/sync` | Cola de sincronización. Mutaciones pendientes, resultado por ítem, conflictos, reintentar; nunca permite descartar… |
| PAN-TEC-54 | Inspección | PT-08 | `/app/campo/inspections/:id` | Inspección. Acta guiada, precintos, fotos, firma o negativa a firmar |
| PAN-TEC-55 | Crear OT en campo | PT-08 | `/app/campo/work-orders/new` | Crear OT en campo. Alta desde campo por tipos permitidos (PRM-TEC-112) |
| PAN-TEC-56 | Mapa del técnico | PT-08 | `/app/campo/map` | Mapa del técnico. OT del día, red cercana (capas cacheadas), ubicación propia (no se transmite en continuo) |
| PAN-TEC-60 | Shell de campo | PT-08 | `/app/campo` | Shell de campo. Landing por rol, banner único de sincronización, estado de red, cambio de perfil si tiene varios… |

### FAM-TEC-10 Servicio técnico para el socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TEC-57 Reservar visita (componente embebido en PAN-POR-34) (M10:2701) |
| Portales | socio |
| Rutas | `/app/visitas/coordinar/:caseId`, `/app/visitas/:visitId`, `/app/portal/feasibility/:id` |
| Capabilities | `por.visitas.reservar`, `por.visitas.ver` |
| Olas | O3 |

```text
+------------------------------------------------------------+
| < Reservar visita (componente e…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Elegir franja disponible: ········                     | |
| | Confirmación: ········                                 | |
| | Constancia: ········                                   | |
| | M10 aporta el componente: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Elegir franja disponible: ········                     | |
| | Confirmación: ········                                 | |
| | Constancia: ········                                   | |
| | M10 aporta el componente: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M10:2701, M10:2702, M10:2703): Campos: Elegir franja disponible, Confirmación, Constancia, M10 aporta el componente, La API, Estado, Detalle de instalación, Conformidad. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TEC-57 | Reservar visita (componente embebido en PAN-POR-34) | PT-07 | `/app/visitas/coordinar/:caseId` | Reservar visita — componente embebido en PAN-POR-34 (HUE-SRV-04). Elegir franja disponible, reserva temporal con… |
| PAN-TEC-58 | Seguimiento de visita (componente embebido en PAN-POR-35) | PT-07 | `/app/visitas/:visitId` | Seguimiento de visita — componente embebido en PAN-POR-35 (HUE-SRV-04). Estado (confirmada, asignada, en camino, en… |
| PAN-TEC-59 | Estado de factibilidad (componente embebido en PAN-POR-34 y PAN-POR-33) | PT-07 | `/app/portal/feasibility/:id` | Estado de factibilidad — componente embebido en PAN-POR-34/35 y en la línea de tiempo de la gestión PAN-POR-33… |

## M11 VEN: Ventas y presupuestos

Anexo `docs/especificacion/anexos/M11-VEN-ventas-presupuestos.md`, §10. 6 familias, 24 PAN. Catálogo: [17-11-M11-VEN.md](17-catalogo-pantallas/17-11-M11-VEN.md).

### FAM-VEN-01 Cargos y cuotas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-14 Cuotas de venta (M11:907) |
| Portales | admin |
| Rutas | `/admin/ven/cargos`, `/admin/ven/cuotas`, `/admin/ven/cuotas/modificacion-masiva` |
| Capabilities | `ven.cargos.ver`, `ven.cuotas.ver`, `ven.cuotas.modificarMasivo` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > VEN… [Cancelación antic…] [Ver factura] [Editar cuota sin fact…*] |
| Cuotas de venta                                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Cuenta ▼] [Origen ▼] [Estado ▼] [Vencimiento ▼]       |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Cuenta    Titular   Servicio  Concepto  Fecha del [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Cancelación antic…] [Ver factu… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:816, M11:907, M11:914): Filtros: Cuenta, Origen, Estado, Vencimiento, Tipo de cuota, Servicio; Columnas: Número, Cuenta, Titular, Servicio, Concepto, Fecha del hito, Importe, Modalidad; Pasos: Vista previa con totales, Confirmación con motivo, Seguimiento del job; Modales: Bonificación, Anulación, Simulación de cuotas; Acciones: Editar cuota sin facturar, Cancelación anticipada, Ver factura, Ver detalle, Crear manual, Bonificar, Anular, Cambiar modalidad antes de facturar, Navegar al origen.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-01 | Cargos por operación (bandeja) | PT-06 | `/admin/ven/cargos` | Usa PT-06 Bandeja de trabajo. Filtros: estado, tipo de cargo, servicio, modalidad, fecha del hito, cuenta, origen; Columnas: número, cuenta… |
| PAN-VEN-14 | Cuotas de venta | PT-01 | `/admin/ven/cuotas` | Filtros: cuenta, origen, estado, vencimiento, tipo de cuota, servicio, inclusión en factura del servicio |
| PAN-VEN-15 | Modificación masiva de cuotas | PT-04 | `/admin/ven/cuotas/modificacion-masiva` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: filtro (producto, tipo de cuota …, tipo de modificación (porcentaje …, vista previa con totales, confirmación… |

### FAM-VEN-02 Presupuestos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-02 Presupuestos (listado) (M11:827) |
| Portales | admin |
| Rutas | `/admin/ven/presupuestos`, `/admin/ven/presupuestos/:id`, `/admin/ven/tablero` |
| Capabilities | `ven.presupuestos.ver`, `ven.presupuestos.editar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > VEN > Presupuestos (listado)   [Abrir] [Enviar/reenviar] [Nuevo*] |
| Presupuestos (listado)                                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Vendedor ▼] [Sucursal ▼]                   |
| [Punto de venta ▼] [Más filtros]                                           |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Fecha     Cliente   Referenci Vendedor  Total     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   $ 0.000,0  ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   $ 0.000,0  ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   $ 0.000,0  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Enviar/reenviar] [Marc… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:827, M11:836, M11:946): Filtros: Estado, Vendedor, Sucursal, Punto de venta, Cuenta/persona/prospecto, Fecha; Columnas: Número, Fecha, Cliente, Referencia, Vendedor, Total, Validez, Versión; Campos: Con tarjetas que muestran OT, Materiales, Diferencias, Solo permite arrastres válidos; Zonas: Cabecera, Pestañas Ítems; Pasos: Kanban Borrador, Enviado, Aceptado, En ejecución, Para facturar; Modales: Confirmar aprobación sin obra, Advertencias de validación de cuenta, Selección parcial a facturar. vacío de ítems; Acciones: Nuevo, Abrir, Enviar/reenviar, Marcar para facturar, Anular, Cambio manual de estado, Impresión masiva, Exportar, Agregar producto/concepto/texto, Crear/clonar/eliminar conjunto.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-02 | Presupuestos (listado) | PT-01 | `/admin/ven/presupuestos` | Filtros: estado, vendedor, sucursal, punto de venta, cuenta/persona/prospecto, fecha, validez, servicio, con obra/OT… |
| PAN-VEN-03 | Editor de presupuesto | PT-03 | `/admin/ven/presupuestos/:id` | Usa PT-03 Formulario o editor. Zonas: cabecera, pestañas Ítems; Modales: confirmar aprobación sin obra, advertencias de validación de cuenta… |
| PAN-VEN-21 | Flujo continuo (tablero) | PT-05 | `/admin/ven/tablero` | Usa PT-05 Tablero, reporte o mapa. Campos: con tarjetas que muestran OT, materiales, diferencias, solo permite arrastres válidos; Pasos: kanban Borrador… |

### FAM-VEN-03 Ventas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-08 Ventas (listado) (M11:870) |
| Portales | admin |
| Rutas | `/admin/ven/ventas`, `/admin/ven/ventas/:id`, `/admin/ven/entregas`, `/admin/ven/devoluciones` y 1 más |
| Capabilities | `ven.ventas.ver`, `ven.ventas.editar`, `ven.entregas.registrar`, `ven.ventas.devolver` y 1 más |
| Olas | O4 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > VEN > Ventas (listado)                  [Abrir] [Anular] [Nueva*] |
| Ventas (listado)                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Tipo ▼] [Vendedor ▼] [Sucursal ▼]          |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Fecha     Cliente   Vendedor  Total     Forma de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   dd-mm-yyy ·······   ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   $ 0.000,0 ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Anular] [Devolver]      25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:870, M11:878, M11:897, M11:902, M11:951): Filtros: Estado, Tipo, Vendedor, Sucursal, Punto de venta, Cuenta; Columnas: Número, Fecha, Cliente, Vendedor, Total, Forma de pago, Comprobante fiscal, Entrega; Campos: Selección de venta e ítems, Estado del producto, Tipo, Punto de venta, Desde/hasta, Vista previa con las que no pueden anularse, Motivo; Zonas: Cabecera, Grilla de ítems, Panel de riesgo crediticio, Pestaña Transporte y observaciones, Pestaña Cuotas, Pestañas Entregas; Modales: Forma de pago y plan, Override de riesgo, Selección de serie, Aprobación de descuento; Acciones: Nueva, Abrir, Anular, Devolver, Exportar, Imprimir remito de entrega.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-08 | Ventas (listado) | PT-01 | `/admin/ven/ventas` | Filtros: estado, tipo, vendedor, sucursal, punto de venta, cuenta, fecha, entrega, forma de pago, con OT/presupuesto… |
| PAN-VEN-09 | Editor de venta | PT-03 | `/admin/ven/ventas/:id` | Usa PT-03 Formulario o editor. Zonas: cabecera, grilla de ítems, panel de riesgo crediticio, pestaña Transporte y observaciones, pestaña Cuotas… |
| PAN-VEN-12 | Entregas pendientes | PT-06 | `/admin/ven/entregas` | Usa PT-06 Bandeja de trabajo. Columnas: venta, cliente, producto, vendido, entregado, pendiente, depósito, antigüedad |
| PAN-VEN-13 | Devoluciones | PT-01 | `/admin/ven/devoluciones` | Campos: selección de venta e ítems, estado del producto, vista de efecto en cuotas y NC antes de aprobar |
| PAN-VEN-22 | Anulación de ventas por rango | PT-04 | `/admin/ven/ventas/anular-rango` | Usa PT-04 Asistente por pasos o proceso masivo. Campos: tipo, punto de venta, desde/hasta, vista previa con las que no pueden anularse, motivo |

### FAM-VEN-04 Punto de venta

| Dato | Valor |
|---|---|
| Patrón base | PT-12 Pantalla completa de operación (POS, tótem, turnero) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-10 Venta rápida / POS (M11:885) |
| Portales | admin |
| Rutas | `/admin/ven/pos/:terminalId`, `/admin/ven/pos/sesiones` |
| Capabilities | `ven.pos.operar`, `ven.pos.abrir` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Venta rápida / POS  (pantalla completa)           dd-mm-yyyy hh:mm [Salir] |
+----------------------------------------------------------------------------+
| +--------------------+  +--------------------+                             |
| |PANTALLA COMPLETA T…|  | ATAJOS DE TECLADO  |                             |
| +--------------------+  +--------------------+                             |
+----------------------------------------------------------------------------+
| Número / total: ######                             [Cancelar] [Confirmar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:885, M11:892): Campos: Apertura con fondo, Cierre con arqueo por medio, Diferencias, Configuración de terminal; Zonas: Pantalla completa táctil, Atajos de teclado; Pasos: Sin sesión abierta, Botón abrir. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-10 | Venta rápida / POS | PT-12 | `/admin/ven/pos/:terminalId` | Zonas: pantalla completa táctil, atajos de teclado; Pasos: sin sesión abierta, botón abrir |
| PAN-VEN-11 | Sesiones de POS y terminales | PT-01 | `/admin/ven/pos/sesiones` | Usa PT-01 Listado con filtros. Campos: apertura con fondo, cierre con arqueo por medio, diferencias, configuración de terminal |

### FAM-VEN-05 Precios, condiciones, vendedores, rendiciones y reportes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-16 Vendedores (M11:920) |
| Portales | admin |
| Rutas | `/admin/ven/config/condiciones`, `/admin/ven/config/vendedores`, `/admin/ven/precios`, `/admin/ven/config/descuentos` y 4 más |
| Capabilities | `ven.condiciones.configurar`, `ven.vendedores.ver`, `ven.precios.ver`, `ven.descuentos.configurar` y 4 más |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > VEN > Vendedores           [Edición] [Activar/desactivar] [Alta*] |
| Vendedores                                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Sucursal ▼] [Tipo ▼] [Más filtros]                    |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Sucursal  Email     Celular   Usuario v [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Edición] [Activar/desactivar]   25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:845, M11:920, M11:925, M11:930, M11:935, M11:940): Filtros: Sucursal, Tipo; Columnas: Código, Nombre, Sucursal, Email, Celular, Usuario vinculado, Activo, Tipo; Campos: Listas por vigencia, Canal, Actualizador con filtros, Modos, Grilla de vista previa, Confirmación, Regla por producto con condiciones, Simulador "¿aplica a esta cuenta?", ABM de planes, Simulador de cuotas con TEA y CFT; Acciones: Alta, Edición, Activar/desactivar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-04 | Condiciones de venta | PT-09 | `/admin/ven/config/condiciones` | Usa PT-09 Configuración versionada. Columnas: código, nombre, tipo, activo |
| PAN-VEN-16 | Vendedores | PT-01 | `/admin/ven/config/vendedores` | Columnas: código, nombre, sucursal, email, celular, usuario vinculado, activo |
| PAN-VEN-17 | Listas de precios y actualización masiva | PT-04 | `/admin/ven/precios` | Usa PT-04 Asistente por pasos o proceso masivo. Campos: listas por vigencia, canal, actualizador con filtros, modos, grilla de vista previa, confirmación |
| PAN-VEN-18 | Reglas de recargo y descuento | PT-09 | `/admin/ven/config/descuentos` | Usa PT-09 Configuración versionada. Campos: regla por producto con condiciones, simulador "¿aplica a esta cuenta?" |
| PAN-VEN-19 | Planes de financiación comercial | PT-01 | `/admin/ven/config/planes` | Campos: ABM de planes, simulador de cuotas con TEA y CFT, vigencia, ámbito |
| PAN-VEN-20 | Rendiciones de viajes | PT-01 | `/admin/ven/rendiciones` | Campos: rendición por venta/entrega con km, flete, peajes, viáticos e ítems de combustible, informe de rendición |
| PAN-VEN-23 | Reportes de ventas | PT-05 | `/admin/ven/reportes` | Usa PT-05 Tablero, reporte o mapa. Campos: fecha de corte, exportación |
| PAN-VEN-24 | Configuración de ventas | PT-09 | `/admin/ven/config` | Usa PT-09 Configuración versionada. Campos: parámetros de la sección 14 agrupados, con ayuda, origen |

### FAM-VEN-06 Ventas desde el portal y el campo

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-VEN-06 Mis presupuestos y mis cuotas (M11:858) |
| Portales | campo, landing, socio |
| Rutas | `/presupuesto/:token`, `/app/presupuestos`, `/app/campo/work-orders/:id/presupuesto` |
| Capabilities | `ven.misPresupuestos.aceptar`, `ven.misPresupuestos.ver`, `ven.presupuestos.crear` |
| Olas | O3 a O8 |

```text
+------------------------------------------------------------+
| < Mis presupuestos y mis cuotas                        (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Presupuestos por estado: ········                      | |
| | Cargos por operación: ········                         | |
| | Cuotas con capital: ········                           | |
| | Interés: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Presupuestos por estado: ········                      | |
| | Cargos por operación: ········                         | |
| | Cuotas con capital: ········                           | |
| | Interés: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M11:851, M11:858, M11:864): Campos: Presupuestos por estado, Cargos por operación, Cuotas con capital, Interés, Vencimiento, Estado, Factura, Botón pagar, Productos habilitados para campo, Granel con coeficiente; Zonas: Resumen del presupuesto. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-VEN-05 | Aceptación online del presupuesto | PT-10 | `/presupuesto/:token` | Usa PT-10 Página pública (landing). Zonas: resumen del presupuesto |
| PAN-VEN-06 | Mis presupuestos y mis cuotas | PT-07 | `/app/presupuestos` | Campos: presupuestos por estado, cargos por operación, cuotas con capital, interés, vencimiento, estado, factura… |
| PAN-VEN-07 | Presupuesto y venta en campo | PT-08 | `/app/campo/work-orders/:id/presupuesto` | Usa PT-08 App de campo móvil (offline). Campos: productos habilitados para campo, granel con coeficiente, firma del cliente, facturación en campo, envío por… |

## M12 CMP: Compras y proveedores

Anexo `docs/especificacion/anexos/M12-CMP-compras-proveedores.md`, §10. 6 familias, 26 PAN. Catálogo: [17-12-M12-CMP.md](17-catalogo-pantallas/17-12-M12-CMP.md).

### FAM-CMP-01 Proveedores, catalogos y portal de proveedores

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-01 Proveedores (listado) (M12:1048) |
| Portales | admin, landing |
| Rutas | `/admin/cmp/proveedores`, `/admin/cmp/proveedores/:id`, `/admin/cmp/config/catalogos`, `/admin/cmp/comunicaciones` y 1 más |
| Capabilities | `cmp.proveedores.ver`, `cmp.proveedores.editar`, `cmp.catalogos.configurar`, `cmp.portal.verOrdenes` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CMP > Proveedores (listado)   [Abrir] [Bloquear/activar] [Nuevo*] |
| Proveedores (listado)                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Rubro ▼] [Tipo de producto ▼]              |
| [Condición IVA ▼] [Más filtros]                                            |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Razón soc CUIT      Condición Rubros    Saldo     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   $ 0.000,0  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   $ 0.000,0  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   $ 0.000,0  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Bloquear/activar] [Env… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1048, M12:1057, M12:1064, M12:1158, M12:1178): Filtros: Estado, Rubro, Tipo de producto, Condición IVA, Con CBU pendiente, Con documentos vencidos; Columnas: Código, Razón social, CUIT, Condición IVA, Rubros, Saldo, Vencido, Puntaje; Pestañas: Datos, Cuentas bancarias, Retenciones, Tipos de producto, Rubros, Autorizados, Valoraciones; Campos: Pestañas de conceptos de compra, Rubros de proveedores, Destinatarios, Unidades de gasto, Combustibles, Modalidades de contratación, Departamentos, Lugares de entrega, Circulares por rubro/tipo de producto, Plantillas; Modales: Alta/edición de CBU, Valoración, Envío de email/SMS/WhatsApp, Invitación al portal; Acciones: Nuevo, Abrir, Bloquear/activar, Enviar comunicación, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-01 | Proveedores (listado) | PT-01 | `/admin/cmp/proveedores` | Filtros: estado, rubro, tipo de producto, condición IVA, con CBU pendiente, con documentos vencidos, valoración, paga… |
| PAN-CMP-02 | Ficha del proveedor | PT-02 | `/admin/cmp/proveedores/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Datos, Cuentas bancarias, Retenciones, Tipos de producto, rubros, Autorizados, Valoraciones, Documentos… |
| PAN-CMP-03 | Catálogos de compras | PT-09 | `/admin/cmp/config/catalogos` | Usa PT-09 Configuración versionada. Campos: pestañas de conceptos de compra, rubros de proveedores, destinatarios, unidades de gasto, combustibles… |
| PAN-CMP-19 | Comunicaciones y circulares | PT-01 | `/admin/cmp/comunicaciones` | Campos: circulares por rubro/tipo de producto, plantillas, historial de envíos, entregas |
| PAN-CMP-23 | Portal de proveedores | PT-10 | `/proveedores` | Usa PT-10 Página pública (landing). Campos: cotizar invitaciones, concursos, confirmar OC, subir factura con PDF, ver estados, descargar certificados de… |

### FAM-CMP-02 Solicitudes, cotizaciones y concursos

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-04 Solicitudes de aprovisionamiento (M12:1070) |
| Portales | admin |
| Rutas | `/admin/cmp/solicitudes`, `/admin/cmp/solicitudes/:id`, `/admin/cmp/cotizaciones`, `/admin/cmp/concursos/:id` |
| Capabilities | `cmp.solicitudes.ver`, `cmp.solicitudes.crear`, `cmp.cotizaciones.ver`, `cmp.concursos.ver` |
| Olas | O8 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Solicitudes de aprovisionamiento              [x] |
+----------------------------------------------------------------------+
| Listado por grupo * [________________________]                       |
| Proveedor * [________________________]                               |
| Carga de precios   [$ __________]                                    |
| Envío por mail/portal   [________________________]                   |
| Cuadro comparativo   [________________________]                      |
| Adjudicación por ítem con…   [________________________]              |
| Justificación   [________________________]                           |
| Generar OC   [________________________]                              |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
| [Aprobar/recha…] [Aprobación ma…]                [Cancelar] [Nueva*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1070, M12:1078, M12:1083, M12:1088): Filtros: Estado, Aprobación, Solicitante, Destinatario, Criticidad, Modalidad; Columnas: Número, Fecha, Solicitante, Destinatario, Criticidad, Monto estimado, Estado, % procesado; Campos: Listado por grupo, Proveedor, Carga de precios, Envío por mail/portal, Cuadro comparativo, Adjudicación por ítem con cantidad, Justificación, Generar OC, Datos, Pliego; Zonas: Cabecera, Grilla de ítems, Historial de aprobación; Acciones: Nueva, Aprobar/rechazar, Aprobación masiva, Tomar, Descartar, Marcar pendiente, Anular, Generar cotización u OC.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-04 | Solicitudes de aprovisionamiento | PT-03 | `/admin/cmp/solicitudes` | Filtros: estado, aprobación, solicitante, destinatario, criticidad, modalidad, servicio, centro de costo, fecha… |
| PAN-CMP-05 | Editor de solicitud | PT-03 | `/admin/cmp/solicitudes/:id` | Zonas: cabecera, grilla de ítems, historial de aprobación |
| PAN-CMP-06 | Cotizaciones y comparativo | PT-01 | `/admin/cmp/cotizaciones` | Usa PT-01 Listado con filtros. Campos: listado por grupo, proveedor, carga de precios, envío por mail/portal, cuadro comparativo, adjudicación por… |
| PAN-CMP-07 | Concursos y licitaciones | PT-02 | `/admin/cmp/concursos/:id` | Usa PT-02 Ficha o detalle con pestañas. Campos: datos, pliego, invitados, plazo de ofertas, apertura con acta, planilla de adjudicación, carátula de… |

### FAM-CMP-03 Órdenes de compra y recepciones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-08 Órdenes de compra (listado) (M12:1093) |
| Portales | admin |
| Rutas | `/admin/cmp/ordenes`, `/admin/cmp/ordenes/:id`, `/admin/cmp/recepciones`, `/admin/cmp/ingreso-rapido` |
| Capabilities | `cmp.ordenes.ver`, `cmp.ordenes.editar`, `cmp.recepciones.registrar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CMP > Órdenes de compra (listado)       [Abrir] [Enviar] [Nueva*] |
| Órdenes de compra (listado)                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Proveedor ▼] [Tipo ▼] [Fecha de entrega ▼] |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Proveedor Fecha     Entrega   Total     Recibido  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   dd-mm-yyy ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   $ 0.000,0 ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Enviar] [Cerrar]        25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1093, M12:1100, M12:1106, M12:1184): Filtros: Estado, Proveedor, Tipo, Fecha de entrega, Atrasadas, Servicio; Columnas: Número, Proveedor, Fecha, Entrega, Total, Recibido %, Facturado %, Estado; Campos: Búsqueda de OC pendientes del proveedor, Cantidades recibidas por línea, Excesos, Series/lotes, Depósito, Ítem pendiente de ingreso, Conformidad de servicio, Devolución al proveedor, Estado de stock informado por M13, Impresión de etiquetas; Zonas: Cabecera, Ítems, Pestañas Recepciones; Pasos: Cotización, OC, Recepción; Acciones: Nueva, Abrir, Enviar, Cerrar, Cancelar, Bandeja de aprobación, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-08 | Órdenes de compra (listado) | PT-01 | `/admin/cmp/ordenes` | Filtros: estado, proveedor, tipo, fecha de entrega, atrasadas, servicio, centro de costo, solicitante; Columnas… |
| PAN-CMP-09 | Editor de orden de compra | PT-03 | `/admin/cmp/ordenes/:id` | Usa PT-03 Formulario o editor. Zonas: cabecera, ítems, pestañas Recepciones; Pasos: pestañas Recepciones, Facturas …, cotización, OC, recepción… |
| PAN-CMP-10 | Recepciones | PT-01 | `/admin/cmp/recepciones` | Campos: búsqueda de OC pendientes del proveedor, cantidades recibidas por línea, excesos, series/lotes, depósito, ítem… |
| PAN-CMP-24 | Registro simplificado de ingreso (piloto) | PT-01 | `/admin/cmp/ingreso-rapido` | Campos: proveedor del padrón mínimo, productos serializados, series, comprobante opcional |

### FAM-CMP-04 Comprobantes de proveedor y conciliación

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-13 Conciliación de 3 vías (M12:1124) |
| Portales | admin |
| Rutas | `/admin/cmp/comprobantes`, `/admin/cmp/comprobantes/:id`, `/admin/cmp/conciliacion`, `/admin/cmp/recibidos` |
| Capabilities | `cmp.comprobantes.ver`, `cmp.comprobantes.registrar`, `cmp.conciliacion.ver`, `cmp.portal.revisar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Conciliación de 3 vías                                   [Nuevo*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Estado ▼] [Proveedor … |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Provee… · Tipo-p…… | | Tablero de facturas c…: ········      | |
| | [SLA 2 h] Provee… · Tipo-p…… | | Con excepción: ········               | |
| | [SLA 2 h] Provee… · Tipo-p…… | | Retenidas: ········                   | |
| | ...                          | | Habilitadas: ········                 | |
| |                              | | Recepciones sin factu…: ········      | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Abrir] [Habilitar pago] [Anular]     | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1111, M12:1118, M12:1124, M12:1147): Filtros: Estado, Proveedor, Tipo, Fecha contable, Vencimiento, Origen; Columnas: Proveedor, Tipo-punto-número, Fecha, Total, Saldo, Vencimiento, Conciliación, Habilitación; Campos: Tablero de facturas conciliadas, Con excepción, Retenidas, Habilitadas, Recepciones sin factura, Facturas sin recepción o sin OC, Decisión, Workflow, Pestañas Portal, Mis Comprobantes; Zonas: Visor del PDF a la izquierda, A la derecha cabecera, Pestaña Conciliación 3 vías; Modales: Confirmar actualización de precio, Tipo no permitido para la condición IVA; Acciones: Nuevo, Abrir, Habilitar pago, Anular, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-11 | Comprobantes de proveedor (listado) | PT-01 | `/admin/cmp/comprobantes` | Usa PT-01 Listado con filtros. Filtros: estado, proveedor, tipo, fecha contable, vencimiento, origen, conciliación, habilitación de pago; Columnas… |
| PAN-CMP-12 | Editor de comprobante de proveedor | PT-03 | `/admin/cmp/comprobantes/:id` | Usa PT-03 Formulario o editor. Zonas: visor del PDF a la izquierda, a la derecha cabecera, pestaña Conciliación 3 vías; Modales: confirmar… |
| PAN-CMP-13 | Conciliación de 3 vías | PT-06 | `/admin/cmp/conciliacion` | Campos: tablero de facturas conciliadas, con excepción, retenidas, habilitadas, recepciones sin factura, facturas sin… |
| PAN-CMP-17 | Bandeja de comprobantes recibidos (portal, ARCA, IA) | PT-06 | `/admin/cmp/recibidos` | Campos: pestañas Portal, Mis Comprobantes, Lectura IA |

### FAM-CMP-05 Órdenes de pago, cuenta corriente y previsiones

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-14 Órdenes de pago (listado) (M12:1129) |
| Portales | admin |
| Rutas | `/admin/cmp/ordenes-pago`, `/admin/cmp/ordenes-pago/:id`, `/admin/cmp/cuenta-corriente`, `/admin/cmp/previsiones` |
| Capabilities | `cmp.ordenesPago.ver`, `cmp.ordenesPago.crear`, `cmp.comprobantes.ver` |
| Olas | O8 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Órdenes de pago (listado)                     [x] |
+----------------------------------------------------------------------+
| Movimientos por proveedor… * [________________________]              |
| Vencidos por tramos * [________________________]                     |
| A vencer   [________________________]                                |
| Fecha de corte   [dd-mm-yyyy]                                        |
| ABM de previsiones periód…   [________________________]              |
| Vista del flujo proyectado   [________________________]              |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
| [Aprobar] [Enviar compro…]                       [Cancelar] [Nueva*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1129, M12:1136, M12:1142, M12:1153): Filtros: Estado, Proveedor, Fecha de pago, Estado de ejecución; Columnas: Número, Proveedor, Fecha, Bruto, Retenciones, Neto, Aprobación, Ejecución; Campos: Movimientos por proveedor con saldo, Vencidos por tramos, A vencer, Fecha de corte, ABM de previsiones periódicas, Vista del flujo proyectado; Zonas: Selección de comprobantes habilitados, Anticipos nuevos, Descuento, Panel de retenciones de M06, Totales bruto/retenciones/neto, CBU aprobado, Asiento propuesto, Historial y estado de ejecución; Acciones: Nueva, Aprobar, Cancelar, Enviar comprobantes masivamente, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-14 | Órdenes de pago (listado) | PT-03 | `/admin/cmp/ordenes-pago` | Filtros: estado, proveedor, fecha de pago, estado de ejecución; Columnas: número, proveedor, fecha, bruto… |
| PAN-CMP-15 | Editor de orden de pago | PT-03 | `/admin/cmp/ordenes-pago/:id` | Zonas: selección de comprobantes habilitados, anticipos nuevos, descuento, panel de retenciones de M06, totales… |
| PAN-CMP-16 | Cuenta corriente y antigüedad de proveedores | PT-01 | `/admin/cmp/cuenta-corriente` | Usa PT-01 Listado con filtros. Campos: movimientos por proveedor con saldo, vencidos por tramos, a vencer, fecha de corte |
| PAN-CMP-18 | Previsiones de pagos | PT-03 | `/admin/cmp/previsiones` | Campos: ABM de previsiones periódicas, vista del flujo proyectado |

### FAM-CMP-06 Políticas, configuración, reportes y abastecimiento

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CMP-25 Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04) (M12:1189) |
| Portales | admin |
| Rutas | `/admin/cmp/config/politicas`, `/admin/cmp/config`, `/admin/cmp/reportes`, `/admin/cmp/abastecimiento` y 1 más |
| Capabilities | `cmp.politicas.configurar`, `cmp.config.configurar`, `cmp.comprobantes.ver` |
| Olas | O8 a O10 |

```text
+----------------------------------------------------------------------------+
| Abastecimiento mayorista y… Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Balance del per… ▼]                                                       |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Por factur Renglones  Medida     Diferencia Excepcione Balance de [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M12:1163, M12:1168, M12:1173, M12:1189, M12:1195): Filtros: Balance del período por servicio; Columnas: Por factura, Renglones por punto con cantidad facturada, Medida, Diferencia, Excepciones a decidir, Balance del período por servicio; Campos: Por factura, Renglones por punto con cantidad facturada, Medida, Diferencia, Excepciones a decidir, Balance del período por servicio, Zona, Bandas por monto/categoría/área para SA, OC, Excepciones. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CMP-20 | Políticas de aprobación y tolerancias | PT-09 | `/admin/cmp/config/politicas` | Usa PT-09 Configuración versionada. Campos: bandas por monto/categoría/área para SA, OC, excepciones, habilitación de pago y OP, tolerancias de cantidad… |
| PAN-CMP-21 | Configuración de compras | PT-09 | `/admin/cmp/config` | Usa PT-09 Configuración versionada. Campos: parámetros de la sección 14 agrupados con ayuda, origen V2 |
| PAN-CMP-22 | Reportes de compras | PT-05 | `/admin/cmp/reportes` | Campos: catálogo de la sección 15 con parámetros, fecha de corte |
| PAN-CMP-25 | Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04) | PT-05 | `/admin/cmp/abastecimiento` | Campos: por factura, renglones por punto con cantidad facturada, medida, diferencia, excepciones a decidir, balance… |
| PAN-CMP-26 | Derechos de señales (HUE-TV-01) | PT-01 | `/admin/cmp/derechos-senales` | Usa PT-01 Listado con filtros. Campos: contratos por programadora, precio, mínimo garantizado, total, descarga de la declaración, conciliación con la… |

## M13 STK: Stock, activos y fabricación

Anexo `docs/especificacion/anexos/M13-STK-stock-activos-fabricacion.md`, §10. 10 familias, 41 PAN. Catálogo: [17-13-M13-STK.md](17-catalogo-pantallas/17-13-M13-STK.md).

### FAM-STK-01 Artículos

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-02 Ficha de artículo (M13:1667) |
| Portales | admin |
| Rutas | `/admin/stk/articulos`, `/admin/stk/articulos/:id`, `/admin/stk/articulos/actualizar-costos`, `/admin/stk/maestros` |
| Capabilities | `stk.articulos.ver`, `stk.costos.editar`, `stk.config.configurar` |
| Olas | O3 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Ficha de artículo                                 (?) Ayuda |
| Ficha de artículo  [Activo]                     [Editar] [Clonar] [Nuevo*] |
+----------------------------------------------------------------------------+
| Datos | Stock | Series | Reposición | Costos | Ubicaciones por d…          |
| =====                                                                      |
| Código     Nombre     Tipo       Rubro      Unidad     Disponible [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1666, M13:1667, M13:1668, M13:1669): Filtros: Tipo, Clasificación, Rubro, Departamento, Servicio, Banderas; Columnas: Código, Nombre, Tipo, Rubro, Unidad, Disponible, Reservado, En custodia; Pestañas: Datos, Stock, Series, Reposición, Costos, Ubicaciones por defecto, Kit; Acciones: Nuevo, Editar, Clonar, Importar, Actualizar costos, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-01 | Lista de artículos | PT-01 | `/admin/stk/articulos` | Usa PT-01 Listado con filtros. Filtros: tipo, clasificación, rubro, departamento, servicio, banderas, estado, bajo mínimo; Columnas: código, nombre… |
| PAN-STK-02 | Ficha de artículo | PT-02 | `/admin/stk/articulos/:id` | Pestañas: Datos, Stock, Series, Reposición, Costos, Ubicaciones por defecto, Kit, Estructura, Adjuntos, Auditoría |
| PAN-STK-03 | Asistente de actualización masiva de costos de reposición | PT-05 | `/admin/stk/articulos/actualizar-costos` | Usa PT-05 Tablero, reporte o mapa. Asistente de actualización masiva de costos de reposición: filtros (rango de códigos, departamento, rubro, tipo… |
| PAN-STK-04 | Maestros de stock | PT-02 | `/admin/stk/maestros` | Pestañas: Tipos, Clasificaciones, Rubros, Departamentos, Tipos de lote, Unidades de gasto, Estados de RMA, Estados de… |

### FAM-STK-02 Depósitos y existencias

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-05 Lista de depósitos y custodios por tipo (M13:1670) |
| Portales | admin |
| Rutas | `/admin/stk/depositos`, `/admin/stk/depositos/:id/ubicaciones`, `/admin/stk/existencias`, `/admin/stk/kardex` y 1 más |
| Capabilities | `stk.depositos.ver`, `stk.depositos.editar`, `stk.saldos.ver`, `stk.movimientos.ver` y 1 más |
| Olas | O3 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Lista de depósitos y custodios… [Abrir] [Exportar] [Nuevo*] |
| Lista de depósitos y custodios por tipo                          (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Sucursal ▼] [Más filtros]                    |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Tipo      Sucursal  Custodio  Unidades  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1670, M13:1671, M13:1672, M13:1673, M13:1678): Filtros: Tipo, Sucursal; Columnas: Código, Nombre, Tipo, Sucursal, Custodio, Unidades, Valor. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-05 | Lista de depósitos y custodios por tipo | PT-01 | `/admin/stk/depositos` | Columnas: código, nombre, tipo, sucursal, custodio, unidades, valor |
| PAN-STK-06 | Ubicaciones del depósito | PT-01 | `/admin/stk/depositos/:id/ubicaciones` | Árbol de ubicaciones con arrastrar; modal de elemento con alta masiva y enumeración; marca asignable/por defecto… |
| PAN-STK-07 | Consulta de disponibilidad | PT-01 | `/admin/stk/existencias` | Consulta de disponibilidad: por artículo, servicio, depósito, ubicación, lote, cuadrilla y estado; columnas físico… |
| PAN-STK-08 | Kárdex por artículo | PT-01 | `/admin/stk/kardex` | Kárdex por artículo (y depósito) con saldo, costo unitario e importe; filtro por fechas, operación, destino, servicio |
| PAN-STK-13 | Reservas de stock | PT-01 | `/admin/stk/reservas` | Reservas por destino con estado y vencimiento; acciones liberar (motivo), cambiar serie, extender |

### FAM-STK-03 Documentos de stock y series

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-11 Búsqueda de unidades serializadas (M13:1676) |
| Portales | admin |
| Rutas | `/admin/stk/documentos`, `/admin/stk/documentos/nuevo/:tipo`, `/admin/stk/series`, `/admin/stk/series/:id` |
| Capabilities | `stk.movimientos.ver`, `stk.movimientos.crear`, `stk.series.ver` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Inicio > S… [Transferencia] [Entrega a cuadril…] [Nuevo vale de entrada…*] |
| Búsqueda de unidades serializadas                                (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] MAC       GPON SN   Matrícula Filtros p Estado    Custodio  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Transferencia] [Entrega a cuad… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1674, M13:1675, M13:1676, M13:1677): Filtros: Estado; Columnas: MAC, GPON SN, Matrícula, Filtros por artículo, Estado, Custodio; Campos: MAC, GPON SN, Matrícula, Filtros por artículo, Estado, Custodio; Acciones: Nuevo vale de entrada/salida, Transferencia, Entrega a cuadrilla, Devolución, Ajuste, Ver, Anular, Imprimir remito interno, Enviar a revisión, Abrir RMA.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-09 | Bandeja de documentos de stock | PT-06 | `/admin/stk/documentos` | Usa PT-06 Bandeja de trabajo. Bandeja de documentos de stock por tipo y estado (borrador, pendiente de aprobación, contabilizado, en tránsito, en… |
| PAN-STK-10 | Editor de documento | PT-03 | `/admin/stk/documentos/nuevo/:tipo` | Usa PT-03 Formulario o editor. Editor de documento: cabecera (tipo, fecha efectiva, origen, destino con selector polimórfico OT/obra/contrato/unidad… |
| PAN-STK-11 | Búsqueda de unidades serializadas | PT-01 | `/admin/stk/series` | Búsqueda global de unidades por serie, MAC, GPON SN, matrícula; filtros por artículo, estado, custodio, contrato… |
| PAN-STK-12 | Ficha de la unidad | PT-02 | `/admin/stk/series/:id` | Usa PT-02 Ficha o detalle con pestañas. Ficha de la unidad: identificadores, estado, propiedad, custodia actual, contrato, accesorios, precintos, garantías… |

### FAM-STK-04 Custodias

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-15 Rendición de custodia (M13:1680) |
| Portales | admin |
| Rutas | `/admin/stk/cuadrillas`, `/admin/stk/rendiciones/:id`, `/admin/stk/conflictos` |
| Capabilities | `stk.custodias.ver`, `stk.rendiciones.ver`, `stk.consumos.validar` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Rendición de custodia                             (?) Ayuda |
| Rendición de custodi… [Entregar] [Recibir devolución] [Iniciar rendición*] |
+----------------------------------------------------------------------------+
| Rendición: ········      Diferencias con tipo: ········  Evidencia: ·····… |
| Ajustes: ········        Aprobación: ········     Cierre: ········         |
+----------------------------------------------------------------------------+
| Tablero de custod… | Conflictos de cam…                                    |
| ==================                                                         |
| Rendición  Diferencia Evidencia  Ajustes    Aprobación Cierre     [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1679, M13:1680, M13:1681): Columnas: Rendición, Diferencias con tipo, Evidencia, Ajustes, Aprobación, Cierre; Pestañas: Tablero de custodias, Conflictos de campo y sustituciones; Campos: Rendición, Diferencias con tipo, Evidencia, Ajustes, Aprobación, Cierre; Acciones: Entregar, Recibir devolución, Iniciar rendición.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-14 | Tablero de custodias | PT-05 | `/admin/stk/cuadrillas` | Usa PT-05 Tablero, reporte o mapa. Tablero de custodias: por cuadrilla/técnico, saldo por artículo y series, entregas pendientes de aceptación, última… |
| PAN-STK-15 | Rendición de custodia | PT-02 | `/admin/stk/rendiciones/:id` | Rendición: tabla inicial + entregado − consumido − aplicado − devuelto = esperado vs contado, diferencias con tipo… |
| PAN-STK-16 | Conflictos de campo y sustituciones | PT-06 | `/admin/stk/conflictos` | Usa PT-06 Bandeja de trabajo. Bandeja de conflictos de campo y sustituciones pendientes: OT, técnico, mutación recibida, motivo, evidencias… |

### FAM-STK-05 Equipos de clientes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-17 Equipos en domicilios (M13:1682) |
| Portales | admin, socio |
| Rutas | `/admin/stk/equipos-clientes`, `/admin/stk/devoluciones/mostrador`, `/admin/stk/revision`, `/app/servicios/:contractId` |
| Capabilities | `stk.asignaciones.ver`, `stk.devoluciones.crear`, `stk.series.editar`, `stk.misEquipos.ver` |
| Olas | O3 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Equipos en domicilios           [Abrir] [Exportar] [Nuevo*] |
| Equipos en domicilios                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha ▼] [Más filtros]                                |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Serie     Modalidad Fecha     Constanci Cómo devo Aviso de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1682, M13:1683, M13:1684, M13:1705): Filtros: Fecha; Columnas: Serie, Modalidad, Fecha, Constancia descargable, Cómo devolver, Aviso de devolución pendiente tras una baja; Campos: Serie, Modalidad, Fecha, Constancia descargable, Cómo devolver, Aviso de devolución pendiente tras una baja. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-17 | Equipos en domicilios | PT-01 | `/admin/stk/equipos-clientes` | Equipos en domicilios: por contrato/cuenta/servicio/modelo/modalidad/estado de asignación; pestaña "Pendientes de… |
| PAN-STK-18 | Recepción de equipos en mostrador | PT-01 | `/admin/stk/devoluciones/mostrador` | Recepción de equipos en mostrador: buscar contrato o escanear serie, condición, accesorios, emitir constancia… |
| PAN-STK-19 | Revisión de equipos retirados | PT-06 | `/admin/stk/revision` | Usa PT-06 Bandeja de trabajo. Bandeja de equipos retirados pendientes de revisión; decisión apto/reacondicionado/reparar/RMA/cuarentena/descarte con… |
| PAN-STK-40 | Equipos del servicio (componente embebido en PAN-POR-30) | PT-07 | `/app/servicios/:contractId` | Usa PT-07 Portal del socio y del empleado (PWA). Campos: serie, modalidad, fecha, constancia descargable, cómo devolver, aviso de devolución pendiente tras una baja |

### FAM-STK-06 Inventario, reposicion, valorización, cierre e informes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-20 Inventarios físicos (M13:1685) |
| Portales | admin |
| Rutas | `/admin/stk/inventarios`, `/admin/stk/reposicion`, `/admin/stk/valorizacion`, `/admin/stk/revaluaciones` y 3 más |
| Capabilities | `stk.inventarios.ver`, `stk.sugerencias.ver`, `stk.valorizacion.ver`, `stk.revaluaciones.crear` y 3 más |
| Olas | O3 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Inventarios físicos             [Abrir] [Exportar] [Nuevo*] |
| Inventarios físicos                                              (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Planifica Tomar ins Asignar c Avance    Diferenci Artículo  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1685, M13:1686, M13:1687, M13:1688, M13:1689, M13:1700): Columnas: Planificar, Tomar instantánea, Asignar contadores, Avance, Diferencias, Artículo; Campos: Planificar, Tomar instantánea, Asignar contadores, Avance, Diferencias, Artículo, Depósito, Servicio. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-20 | Inventarios físicos | PT-01 | `/admin/stk/inventarios` | Inventarios físicos: planificar (alcance, tipo, ciego), tomar instantánea, asignar contadores, avance, diferencias… |
| PAN-STK-21 | Sugerencias de compra | PT-01 | `/admin/stk/reposicion` | Sugerencias de compra: artículo, depósito, servicio, disponible, en tránsito, OC pendientes, reservado, mín/máx… |
| PAN-STK-22 | Valorización de stock | PT-01 | `/admin/stk/valorizacion` | Valorización a fecha por método (perpetuo y alternativos), por depósito/custodia/rubro/servicio; lista aparte de… |
| PAN-STK-23 | Revaluaciones | PT-01 | `/admin/stk/revaluaciones` | Revaluaciones: nueva (índice/costo/manual), vista previa de factores, faltantes de índice, aprobación, contabilización |
| PAN-STK-24 | Cierre de stock | PT-04 | `/admin/stk/cierres` | Usa PT-04 Asistente por pasos o proceso masivo. Cierre de stock: checklist previo (verificación de saldos, costos provisorios, conflictos, documentos en tránsito)… |
| PAN-STK-35 | Catálogo de informes | PT-05 | `/admin/stk/informes` | Usa PT-05 Tablero, reporte o mapa. Catálogo de informes (sección 15) con parámetros, vista previa, exportación y programación |
| PAN-STK-36 | Parámetros del módulo agrupados | PT-09 | `/admin/stk/configuracion` | Usa PT-09 Configuración versionada. Parámetros del módulo (sección 14) agrupados: depósitos por defecto, políticas de negativo, reservas, campo, comodato… |

### FAM-STK-07 Bienes de uso

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-25 Lista de bienes de uso (M13:1690) |
| Portales | admin |
| Rutas | `/admin/stk/bienes-uso`, `/admin/stk/bienes-uso/:id`, `/admin/stk/amortizaciones` |
| Capabilities | `stk.bienesUso.ver`, `stk.amortizaciones.ejecutar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Lista de bienes de uso          [Abrir] [Exportar] [Nuevo*] |
| Lista de bienes de uso                                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Datos     Importes  Afectació Mejora/bi Distribuc Mejoras   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   $ 0.000,0 ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   $ 0.000,0 ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   $ 0.000,0 ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1690, M13:1691, M13:1692): Columnas: Datos, Importes, Afectación, Mejora/bien principal, Distribución por centros, Mejoras; Campos: Datos, Importes, Afectación, Mejora/bien principal, Distribución por centros, Mejoras, Disminuciones, Amortizaciones, Historial de versiones, Serie vinculada. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-25 | Lista de bienes de uso | PT-01 | `/admin/stk/bienes-uso` | Lista de bienes de uso: número, descripción, rubro, afectación, origen, acumulada, residual, estado; filtros… |
| PAN-STK-26 | Ficha del bien | PT-02 | `/admin/stk/bienes-uso/:id` | Usa PT-02 Ficha o detalle con pestañas. Campos: datos, importes, afectación, mejora/bien principal, distribución por centros, mejoras, disminuciones… |
| PAN-STK-27 | Corridas de amortización | PT-04 | `/admin/stk/amortizaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Corridas: nueva (período, tipo, simulación), resultado por bien/rubro/centro, contabilizar, revertir; cuadro de bienes… |

### FAM-STK-08 Devoluciones y reparaciones (RMA)

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-30 Recepciones técnicas de equipos de clientes (M13:1695) |
| Portales | admin |
| Rutas | `/admin/stk/rma`, `/admin/stk/rma/:id`, `/admin/stk/servicio-tecnico` |
| Capabilities | `stk.rma.ver`, `stk.rma.editar`, `stk.recepciones.ver` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Recepciones técnicas de equipo… [Abrir] [Exportar] [Nuevo*] |
| Recepciones técnicas de equipos de clientes                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Alta      Presupues Entrega a Garantía  Proveedor Antigüeda [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1693, M13:1694, M13:1695): Columnas: Alta, Presupuesto, Entrega al cliente, Garantía, Proveedor, Antigüedad; Campos: Alta, Presupuesto, Entrega al cliente, Garantía, Proveedor, Antigüedad, Nuevo RMA desde serie. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-28 | Bandeja de RMA | PT-06 | `/admin/stk/rma` | Usa PT-06 Bandeja de trabajo. Bandeja de RMA por estado (kanban y tabla), garantía, proveedor, antigüedad; nuevo RMA desde serie |
| PAN-STK-29 | Caso RMA | PT-02 | `/admin/stk/rma/:id` | Usa PT-02 Ficha o detalle con pestañas. Caso RMA: datos de recepción y contacto, equipo, problema, diagnóstico, garantía, envío/retorno, repuestos y costos… |
| PAN-STK-30 | Recepciones técnicas de equipos de clientes | PT-01 | `/admin/stk/servicio-tecnico` | Recepciones técnicas de equipos de clientes: alta, ítems con estado por ítem (íconos/niveles), presupuesto, entrega al… |

### FAM-STK-09 Fabricación

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-31 Estructuras (M13:1696) |
| Portales | admin |
| Rutas | `/admin/stk/fabricacion/estructuras`, `/admin/stk/fabricacion/ordenes`, `/admin/stk/fabricacion/partes`, `/admin/stk/fabricacion/aprovisionamiento` |
| Capabilities | `stk.fabricacion.estructuras.ver`, `stk.fabricacion.ordenes.ver`, `stk.fabricacion.partes.ver`, `stk.fabricacion.aprovisionamiento.ejecutar` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > STK > Estructuras                     [Abrir] [Exportar] [Nuevo*] |
| Estructuras                                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Etapas    Divisione Clonar    Costo cal Precio su Lista por [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   $ 0.000,0 ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1696, M13:1697, M13:1698, M13:1699): Columnas: Etapas, Divisiones, Clonar, Costo calculado, Precio sugerido, Lista por etapa; Campos: Etapas, Divisiones, Clonar, Costo calculado, Precio sugerido, Lista por etapa, Ficha con productos, Componentes. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-31 | Estructuras | PT-01 | `/admin/stk/fabricacion/estructuras` | Estructuras (árbol multinivel), etapas, divisiones, versiones e historia, clonar, costo calculado y precio sugerido |
| PAN-STK-32 | Órdenes de fabricación | PT-02 | `/admin/stk/fabricacion/ordenes` | Usa PT-02 Ficha o detalle con pestañas. Órdenes de fabricación: lista por etapa; ficha con productos, componentes (requerido, retirado, en partes), avance por… |
| PAN-STK-33 | Partes de producción | PT-01 | `/admin/stk/fabricacion/partes` | Partes de producción: alta desde orden, ítems, componentes con serie, lanzar, finalizar, dañados… |
| PAN-STK-34 | MRP | PT-01 | `/admin/stk/fabricacion/aprovisionamiento` | MRP: rango, requerimientos por componente con fecha, en proceso, stock, mínimo, proveedor y últimas compras; excluir… |

### FAM-STK-10 Stock móvil

| Dato | Valor |
|---|---|
| Patrón base | PT-08 App de campo móvil (offline) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-STK-37 Stock en vehículo (M13:1702) |
| Portales | campo, empleado |
| Rutas | `/app/campo/mi-stock`, `/app/campo/ot/:id/materiales`, `/app/campo/conteo/:id`, `/app/deposito/entregas` |
| Capabilities | `stk.miStock.ver`, `stk.consumos.registrar`, `stk.inventarios.contar`, `stk.entregas.crear` |
| Olas | O3 |

```text
+------------------------------------------------------------+
| Sin conexión · N cambios pendientes [Sincronizar]          |
+------------------------------------------------------------+
| Stock en vehículo                                   Sincr. |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | "Mi stock": ········                                   | |
| | Cards por artículo: ········                           | |
| | Por serie: ········                                    | |
| | Entregas pendientes de aceptar: ········               | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | "Mi stock": ········                                   | |
| | Cards por artículo: ········                           | |
| | Por serie: ········                                    | |
| | Entregas pendientes de aceptar: ········               | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [Cámara] [Firma] [Escanear]                                |
|                                                      ( + ) |
| [                       Iniciar                       * ]  |
+------------------------------------------------------------+
| Hoy | Órdenes | (+) | Stock en vehículo | Sincronización   |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M13:1702, M13:1703, M13:1704, M13:1706): Campos: "Mi stock", Cards por artículo, Por serie, Entregas pendientes de aceptar, Solicitar devolución, Sección Equipos y Materiales, Validación local de saldo, Errores inline. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-STK-37 | Stock en vehículo | PT-08 | `/app/campo/mi-stock` | "Mi stock": cards por artículo (cantidad) y por serie (modelo, serie, MAC), entregas pendientes de aceptar (aceptar… |
| PAN-STK-38 | Materiales en la ejecución de la OT | PT-08 | `/app/campo/ot/:id/materiales` | En la ejecución de la OT (M10): sección Equipos (escanear serie a instalar o retirar, condición y accesorios) y… |
| PAN-STK-39 | Conteo de inventario o rendición | PT-08 | `/app/campo/conteo/:id` | Conteo de inventario o rendición: escaneo continuo, cantidades por artículo, lista de series esperadas/contadas, envío |
| PAN-STK-41 | Entregas rápidas de depósito | PT-07 | `/app/deposito/entregas` | Usa PT-07 Portal del socio y del empleado (PWA). Entrega rápida desde el depósito con celular/lector: elegir técnico, escanear series y artículos, firma del técnico |
