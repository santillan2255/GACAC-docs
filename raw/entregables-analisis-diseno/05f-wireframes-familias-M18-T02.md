# Wireframes por familia de pantallas: M18 a T02

**Artefacto 4.2 (Wireframes). Parte 05f.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: M18 SOC, M19 POR, T01 PLA, T02 IAM (31 familias).

## M18 SOC: Servicios sociales y flota

Anexo `docs/especificacion/anexos/M18-SOC-servicios-sociales-flota.md`, §10. 7 familias, 35 PAN. Catálogo: [17-18-M18-SOC.md](17-catalogo-pantallas/17-18-M18-SOC.md).

### FAM-SOC-01 Coberturas y parámetros de servicios sociales

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-01 Grupo de cobertura de un contrato (M18:1515) |
| Portales | admin |
| Rutas | `/admin/soc/contratos/:id/grupo`, `/admin/soc/adherentes/revision`, `/admin/soc/config/planes`, `/admin/soc/config` |
| Capabilities | `soc.adherentes.ver`, `soc.adherentes.gestionar`, `soc.planes.configurar`, `soc.config.configurar` |
| Olas | O2 a O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > SOC > Grupo de cobertura de un contrato                 (?) Ayuda |
| Grupo de cobertura de un c… [Dar de baja] [Restaurar] [Agregar adherente*] |
+----------------------------------------------------------------------------+
| Titular: ········        Servicio: ········       Plan: ········           |
| Estado: ········                                                           |
+----------------------------------------------------------------------------+
| Adherentes | Beneficiarios | Requisitos | Prestaciones usad… | Historia    |
| ==========                                                                 |
| Persona    Vínculo    Edad       Alta       Baja       Causa      [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1515, M18:1516, M18:1517, M18:1543): Filtros: Servicio, Plan, Condición, Fecha de corte; Columnas: Persona, Vínculo, Edad, Alta, Baja, Causa, Carencia, Estado; Pestañas: Adherentes, Beneficiarios, Requisitos, Prestaciones usadas, Historia; Campos: Titular, Servicio, Plan, Estado; Acciones: Agregar adherente, Dar de baja, Restaurar, Cambiar categoría, Imprimir ficha y notificación, Aplicar lote, Imprimir, Exportar, Crear, Versionar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-01 | Grupo de cobertura de un contrato | PT-02 | `/admin/soc/contratos/:id/grupo` | Columnas: persona, vínculo, edad, alta, baja, causa, carencia, estado; Pestañas: Adherentes, Beneficiarios… |
| PAN-SOC-02 | Bajas por condición, mayoría de edad y recategorización masiva | PT-04 | `/admin/soc/adherentes/revision` | Usa PT-04 Asistente por pasos o proceso masivo. Filtros: servicio, plan, condición, fecha de corte |
| PAN-SOC-03 | Planes de cobertura | PT-03 | `/admin/soc/config/planes` | Usa PT-03 Formulario o editor. Planes de cobertura. Lista por servicio y tipo; editor: prestaciones, elegibilidad por vínculo, carencias, topes… |
| PAN-SOC-29 | Parámetros del módulo | PT-09 | `/admin/soc/config` | Usa PT-09 Configuración versionada. Parámetros del módulo. Formularios por grupo de §14. Guardar con auditoría |

### FAM-SOC-02 Prestadores, solicitudes, autorizaciones, sepelios y subsidios

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-04 Prestadores y convenios (M18:1518) |
| Portales | admin |
| Rutas | `/admin/soc/prestadores`, `/admin/soc/solicitudes`, `/admin/soc/solicitudes/:id`, `/admin/soc/sepelios/:id` y 2 más |
| Capabilities | `soc.prestadores.gestionar`, `soc.solicitudes.ver`, `soc.sepelio.gestionar`, `soc.subsidios.crear` y 1 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > SOC > Prestadores y convenios                           (?) Ayuda |
| Prestadores y convenios  [Activo]         [Edición] [Inactivación] [Alta*] |
+----------------------------------------------------------------------------+
| Prestadores | Convenios | Profesionales | Especialidades | Nosocomios      |
| ===========                                                                |
| Número     Tipo       Beneficiar Fecha del  Resultado  Estado     [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   dd-mm-yyyy ········   [Activo]    ...     |
| ········   ········   ········   dd-mm-yyyy ········   [Pendiente  ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1518, M18:1519, M18:1520, M18:1521, M18:1522, M18:1530): Filtros: Tipo, Estado, Fecha del evento, Prestador, Sucursal; Columnas: Número, Tipo, Beneficiario, Fecha del evento, Resultado de cobertura, Estado, Vencimiento, Fallecido; Pestañas: Prestadores, Convenios, Profesionales, Especialidades, Nosocomios; Acciones: Alta, Edición, Inactivación, Nueva solicitud, Abrir, Aprobar, Rechazar, Derivar excepción, Registrar respuesta del prestador, Cerrar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-04 | Prestadores y convenios | PT-02 | `/admin/soc/prestadores` | Pestañas: Prestadores, Convenios, Profesionales, especialidades, Nosocomios |
| PAN-SOC-05 | Bandeja de solicitudes de prestación | PT-06 | `/admin/soc/solicitudes` | Usa PT-06 Bandeja de trabajo. Filtros: tipo, estado, fecha del evento, prestador, sucursal; Columnas: número, tipo, beneficiario, fecha del evento… |
| PAN-SOC-06 | Detalle de solicitud | PT-03 | `/admin/soc/solicitudes/:id` | Usa PT-03 Formulario o editor. Detalle de solicitud. Verificación de cobertura con motivos, documentación (restringida), prestador y referencia… |
| PAN-SOC-07 | Caso de sepelio | PT-02 | `/admin/soc/sepelios/:id` | Caso de sepelio. Fallecido, plan, prestador, servicios cubiertos y adicionales, traslado y acto de cementerio… |
| PAN-SOC-08 | Subsidios por fallecimiento | PT-01 | `/admin/soc/subsidios` | Usa PT-01 Listado con filtros. Columnas: fallecido, fecha, importe, beneficiarios, plazo, estado |
| PAN-SOC-16 | Autorizaciones de internación y prácticas | PT-06 | `/admin/soc/autorizaciones` | Usa PT-06 Bandeja de trabajo. Columnas: beneficiario, prestador, ingreso, egreso, número, días, costo, estado |

### FAM-SOC-03 Cementerio

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-09 Plano y catálogo de unidades (M18:1523) |
| Portales | admin, empleado |
| Rutas | `/admin/soc/cementerio/:cemeteryId/plano`, `/admin/soc/cementerio/derechos/:id`, `/admin/soc/cementerio/actos`, `/admin/soc/cementerio/config` y 1 más |
| Capabilities | `soc.cementerio.ver`, `soc.derechos.gestionar`, `soc.actos.programar`, `soc.cementerio.configurar` y 1 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Plano y catálogo de unidades                                     (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                    [Reservar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Ficha del derecho… | | Plano [______________]                        | |
| | > Agenda de actos    | | Catálogo de unidades [______________]         | |
| | > Establecimientos,… | | Reservar [______________]                     | |
| | > Registro de actos… | | "Configure sectores [______________]          | |
| |                      | | Unidades" [______________]                    | |
| |                      | | Unidad [______________]                       | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1523, M18:1524, M18:1525, M18:1526, M18:1549): Pestañas: Ficha del derecho de sepultura, Agenda de actos, Establecimientos, reglamentos, sectores y tipos de unidad, Registro de actos en el parque; Campos: Plano, Catálogo de unidades, Reservar, "Configure sectores, Unidades", Unidad, Modalidad, Titulares; Acciones: Reservar, Ver derecho, Ver ocupaciones, Formalizar, Cambiar pagador, Gestionar autorizados, Iniciar cesión/sucesión/extinción, Imprimir título, Solicitar, Validar documentación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-09 | Plano y catálogo de unidades | PT-09 | `/admin/soc/cementerio/:cemeteryId/plano` | Plano y catálogo de unidades. Mapa o grilla jerárquica con estado por unidad (disponible, reservada, asignada… |
| PAN-SOC-10 | Ficha del derecho de sepultura | PT-02 | `/admin/soc/cementerio/derechos/:id` | Usa PT-02 Ficha o detalle con pestañas. Ficha del derecho de sepultura. Unidad, modalidad, titulares, pagador, autorizados, instrumento, obligaciones y… |
| PAN-SOC-11 | Agenda de actos | PT-06 | `/admin/soc/cementerio/actos` | Usa PT-06 Bandeja de trabajo. Agenda de actos. Calendario y lista: tipo, unidad, difunto, autorizante, permiso, estado. Solicitar, validar… |
| PAN-SOC-12 | Establecimientos, reglamentos, sectores y tipos de unidad | PT-09 | `/admin/soc/cementerio/config` | Establecimientos, reglamentos, sectores y tipos de unidad. Formularios jerárquicos con importación de unidades. Alta… |
| PAN-SOC-35 | Registro de actos en el parque | PT-07 | `/app/soc/cementerio/actos` | Usa PT-07 Portal del socio y del empleado (PWA). Registro de actos en el parque. Actos del día con unidad y documentación validada. Registrar realizado con foto de… |

### FAM-SOC-04 Banco de sangre, traslados y otros servicios

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-27 Banco ortopédico (M18:1541) |
| Portales | admin |
| Rutas | `/admin/soc/sangre`, `/admin/soc/traslados`, `/admin/soc/traslados/informes`, `/admin/soc/otros/ortopedia` y 1 más |
| Capabilities | `soc.sangre.ver`, `soc.traslados.ver`, `soc.reportes.ver`, `soc.ortopedia.gestionar` y 1 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > SOC > Banco ortop… [Prestar] [Devolver] [Enviar a mantenimiento*] |
| Banco ortopédico                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha ▼] [Más filtros]                                |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Fecha     Pasajero  Origen    Destino   Nosocomio [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Prestar] [Devolver]             25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1527, M18:1528, M18:1529, M18:1541, M18:1542): Filtros: Fecha; Columnas: Número, Fecha, Pasajero, Origen, Destino, Nosocomio, Móvil, Chofer; Pestañas: Solicitudes, Convenios, Campañas, Turnos, Indicadores; Acciones: Prestar, Devolver, Enviar a mantenimiento, Nueva solicitud, Registrar respuesta, Crear campaña, Nuevo viaje, Agregar tramo, Asignar móvil y chofer, Cerrar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-13 | Banco de sangre | PT-02 | `/admin/soc/sangre` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Solicitudes, Convenios, Campañas, turnos, Indicadores |
| PAN-SOC-14 | Agenda y registro de traslados | PT-06 | `/admin/soc/traslados` | Usa PT-06 Bandeja de trabajo. Columnas: número, fecha, pasajero, origen, destino, nosocomio, móvil, chofer, km, importe |
| PAN-SOC-15 | Informe general de traslados | PT-05 | `/admin/soc/traslados/informes` | Usa PT-05 Tablero, reporte o mapa. Informe general de traslados. Filtros completos y subtítulo con filtros aplicados. Exportar |
| PAN-SOC-27 | Banco ortopédico | PT-01 | `/admin/soc/otros/ortopedia` | Banco ortopédico. Elementos y préstamos (vencidos resaltados). Prestar, devolver, enviar a mantenimiento |
| PAN-SOC-28 | Retiros de dispenser | PT-01 | `/admin/soc/otros/dispenser` | Retiros de dispenser. Búsqueda de contrato; litros disponibles hoy y del mes. Registrar retiro |

### FAM-SOC-05 Vivienda

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-18 Viviendas inscriptas (M18:1532) |
| Portales | admin |
| Rutas | `/admin/soc/vivienda/planes`, `/admin/soc/vivienda/unidades`, `/admin/soc/vivienda/unidades/:id`, `/admin/soc/vivienda/certificados` y 1 más |
| Capabilities | `soc.vivienda.configurar`, `soc.vivienda.ver`, `soc.obra.gestionar`, `soc.reportes.ver` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > SOC > Viviendas inscriptas        [Adjudicar] [Exportar] [Abrir*] |
| Viviendas inscriptas                                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Plan ▼] [Tipología ▼] [Estado ▼] [Distrito ▼]         |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Titular   Cuenta    Tipología Inscripci Adjudicac % factura [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Adjudicar] [Exportar]           25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1531, M18:1532, M18:1533, M18:1534, M18:1535): Filtros: Plan, Tipología, Estado, Distrito, Adjudicada; Columnas: Titular, Cuenta, Tipología, Inscripción, Adjudicación, % facturado, % pagado, % avance; Pestañas: Datos, Aportes, Construcción, Materiales, Certificados, Cambios, Transferencias; Pasos: Árbol plan, Tipología, Etapas, Actividades, Materiales; Acciones: Abrir, Adjudicar, Exportar, Crear, Reordenar, Actualizar precios, Validar configuración, Registrar progreso, Retirar materiales, Devolver.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-17 | Planes, tipologías, precios, etapas y actividades | PT-04 | `/admin/soc/vivienda/planes` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: Árbol plan, tipología, etapas, actividades, materiales |
| PAN-SOC-18 | Viviendas inscriptas | PT-01 | `/admin/soc/vivienda/unidades` | Filtros: plan, tipología, estado, distrito, adjudicada; Columnas: titular, cuenta, tipología, inscripción… |
| PAN-SOC-19 | Ficha de la vivienda | PT-02 | `/admin/soc/vivienda/unidades/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Datos, Aportes, Construcción, Materiales, Certificados, Cambios, transferencias |
| PAN-SOC-20 | Certificados de obra | PT-01 | `/admin/soc/vivienda/certificados` | Columnas: número, vivienda, proveedor, período, tipo, total, estado |
| PAN-SOC-21 | Informes de vivienda | PT-05 | `/admin/soc/vivienda/informes` | Usa PT-05 Tablero, reporte o mapa. Informes de vivienda. Selector de informe (§15) y filtros. Generar, exportar |

### FAM-SOC-06 Flota

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-22 Vehículos (M18:1536) |
| Portales | admin, campo |
| Rutas | `/admin/soc/flota/vehiculos`, `/admin/soc/flota/choferes`, `/admin/soc/flota/combustible`, `/admin/soc/flota/rendiciones` y 2 más |
| Capabilities | `soc.flota.ver`, `soc.flota.gestionar`, `soc.combustible.gestionar`, `soc.rendiciones.gestionar` y 2 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > SOC > Vehículos               [Documento] [Mantenimiento] [Alta*] |
| Vehículos                                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Estado ▼] [Más filtros]                      |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Dominio   Descripci Tipo      Propio    Km actual Rendimien [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Documento] [Mantenimiento] [Ma… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1536, M18:1537, M18:1538, M18:1539, M18:1540, M18:1548): Filtros: Tipo, Estado; Columnas: Dominio, Descripción, Tipo, Propio, Km actual, Rendimiento real/teórico, Documentos por vencer, Estado; Pestañas: Tipos, Cargas; Campos: Documentos, Mantenimiento, Usos, Combustible, GPS; Acciones: Alta, Documento, Mantenimiento, Marcar no apto, Asignar a vehículo, Carga manual, Vincular a factura, Anular, Crear, Calcular km.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-22 | Vehículos | PT-01 | `/admin/soc/flota/vehiculos` | Columnas: dominio, descripción, tipo, propio, km actual, rendimiento real/teórico, documentos por vencer, estado… |
| PAN-SOC-23 | Choferes | PT-01 | `/admin/soc/flota/choferes` | Columnas: código, nombre, empleado, licencia, vencimiento |
| PAN-SOC-24 | Combustibles y cargas | PT-03 | `/admin/soc/flota/combustible` | Usa PT-03 Formulario o editor. Pestañas: Tipos, Cargas |
| PAN-SOC-25 | Rendiciones de viaje | PT-01 | `/admin/soc/flota/rendiciones` | Columnas: número, origen, fecha, km estimados/reales/GPS, flete, peajes, viáticos, total, estado |
| PAN-SOC-26 | Recorridos GPS | PT-01 | `/admin/soc/flota/gps` | Recorridos GPS. Mapa de recorrido por vehículo y día; km GPS vs declarados. Sin vista pública. Filtrar, exportar. "Sin… |
| PAN-SOC-34 | Viajes del chofer | PT-08 | `/app/campo/viajes` | Usa PT-08 App de campo móvil (offline). Viajes del chofer. Viajes asignados del día; checklist del vehículo; km inicial/final; carga de combustible con foto… |

### FAM-SOC-07 Servicios sociales en el portal

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SOC-31 Solicitudes de prestación (componente embebido en PAN-POR-99) (M18:1545) |
| Portales | socio |
| Rutas | `/app/mi-grupo`, `/app/solicitudes-sociales`, `/app/cementerio`, `/app/vivienda` |
| Capabilities | `soc.mi.ver`, `soc.mi.solicitar` |
| Olas | O10 |

```text
+------------------------------------------------------------+
| < Solicitudes de prestación (co…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Formulario por tipo: ········                          | |
| | Seguimiento de estado: ········                        | |
| | Emergencias: ········                                  | |
| | Muestra número del prestador: ········                 | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Formulario por tipo: ········                          | |
| | Seguimiento de estado: ········                        | |
| | Emergencias: ········                                  | |
| | Muestra número del prestador: ········                 | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                   Enviar solicitud                  * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M18:1544, M18:1545, M18:1546, M18:1547): Campos: Formulario por tipo, Seguimiento de estado, Emergencias, Muestra número del prestador, Enviar solicitud, Adjuntar documentos; Acciones: Enviar solicitud, Adjuntar documentos, Solicitar alta/baja de integrante, Solicitar acto, Descargar estado.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SOC-30 | Mi grupo y coberturas (componente embebido en PAN-POR-98) | PT-07 | `/app/mi-grupo` | Mi grupo y coberturas — Componente embebido en PAN-POR-98 de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el… |
| PAN-SOC-31 | Solicitudes de prestación (componente embebido en PAN-POR-99) | PT-07 | `/app/solicitudes-sociales` | Solicitudes de prestación — Componente embebido en PAN-POR-99 de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta… |
| PAN-SOC-32 | Mis derechos de sepultura (componente embebido en PAN-POR-100) | PT-07 | `/app/cementerio` | Mis derechos de sepultura — Componente embebido en PAN-POR-100 de M19 (M19 es dueño de la ruta y la tarjeta; M18… |
| PAN-SOC-33 | Mi plan de vivienda (componente embebido en PAN-POR-101) | PT-07 | `/app/vivienda` | Mi plan de vivienda — Componente embebido en PAN-POR-101 de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el… |

## M19 POR: Portal del socio y landing

Anexo `docs/especificacion/anexos/M19-POR-portal-socio-landing.md`, §10. 14 familias, 105 PAN. Catálogo: [17-19-M19-POR.md](17-catalogo-pantallas/17-19-M19-POR.md).

### FAM-POR-01 Landing: portada, servicios y cobertura

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-03 Detalle de servicio (landing) (M19:1271) |
| Portales | landing |
| Rutas | `/`, `/servicios`, `/servicios/:serviceCode`, `/cobertura` |
| Capabilities | a definir |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Detalle de servicio (landing)                                        |
| ["Contratar"*]   ["Consultar cobert…]                                      |
+----------------------------------------------------------------------------+
| [ Descripción ]  [ Planes con precio f… ]  [ Requisitos ]                  |
| [ Documentación ]  [ Cobertura ]  [ Condiciones ]                          |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1269, M19:1270, M19:1271, M19:1272): Campos: Descripción, Planes con precio final, Requisitos, Documentación, Cobertura, Condiciones; Acciones: "Contratar", "Consultar cobertura", Descargar requisitos, Navegar, "Contratar" por servicio, Filtrar por categoría, Consultar, "Contratar" si hay cobertura.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-01 | Portada de la landing | PT-10 | `/` | Portada por bloques de la versión publicada: hero (título y texto dict:), accesos rápidos (Ingresar, Registrarme… |
| PAN-POR-02 | Servicios (landing) | PT-10 | `/servicios` | Cards de servicios habilitados (ícono, nombre, resumen, desde ARS X). Filtrar por categoría (Energía, Agua… |
| PAN-POR-03 | Detalle de servicio (landing) | PT-10 | `/servicios/:serviceCode` | Pasos: "Contratar" (, registro/ingreso con `returnTo`) … |
| PAN-POR-04 | Consulta de cobertura | PT-10 | `/cobertura` | Calle (autocompletado), altura, localidad; resultado por servicio; mapa opcional. Consultar; "Contratar" si hay… |

### FAM-POR-02 Landing: noticias, avisos, ayuda y legales

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-14 Sucursales (M19:1282) |
| Portales | landing |
| Rutas | `/noticias`, `/noticias/:slug`, `/avisos-de-corte`, `/sucursales` y 2 más |
| Capabilities | a definir |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Sucursales                                                           |
| [Llamar*]   [Abrir mapa]                                                   |
+----------------------------------------------------------------------------+
| [ Horarios ]  [ Teléfonos ]  [ WhatsApp ]  [ Cómo llegar ]  [ Llamar ]     |
| [ Título ]                                                                 |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1273, M19:1274, M19:1275, M19:1282, M19:1283, M19:1284): Campos: Horarios, Teléfonos, WhatsApp, Cómo llegar, Llamar, Título, Fecha, Paginación; Acciones: Llamar, Abrir mapa, Paginación, Compartir, Filtrar por localidad/servicio, Buscar, Descargar PDF.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-05 | Noticias | PT-10 | `/noticias` | Lista de noticias públicas (T09 canal landing) con imagen, título, fecha. Paginación. "Todavía no hay noticias" |
| PAN-POR-06 | Detalle de noticia | PT-10 | `/noticias/:slug` | Noticia completa, imágenes con texto alternativo. Compartir |
| PAN-POR-07 | Avisos de corte públicos | PT-10 | `/avisos-de-corte` | Interrupciones programadas por zona/servicio con fecha y horario. Filtrar por localidad/servicio. "No hay cortes… |
| PAN-POR-14 | Sucursales | PT-10 | `/sucursales` | Sucursales, horarios, teléfonos, WhatsApp, cómo llegar (texto + mapa opcional). Llamar, abrir mapa |
| PAN-POR-15 | Ayuda y preguntas frecuentes (landing) | PT-10 | `/ayuda` | Preguntas frecuentes por tema del tenant. Buscar |
| PAN-POR-16 | Documentos legales | PT-10 | `/legal/:tipo` | Documento legal vigente con versión y fecha. Descargar PDF |

### FAM-POR-03 Trámites publicos, baja y pago sin sesión

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-11 Seguimiento de baja (M19:1279) |
| Portales | landing |
| Rutas | `/tramites`, `/baja`, `/baja/recibida/:code`, `/baja/seguimiento` y 5 más |
| Capabilities | a definir |
| Olas | O2 a O10 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Seguimiento de baja                                                  |
| [Consultar*]   [Ver más]                                                   |
+----------------------------------------------------------------------------+
| [ Fechas ]  [ Consultar ]  [ Requisitos ]  [ PDF descargables ]            |
| [ Descargar PDF ]  [ "Iniciar" ]                                           |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1276, M19:1277, M19:1278, M19:1279, M19:1280, M19:1281): Campos: Fechas, Consultar, Requisitos, PDF descargables, Descargar PDF, "Iniciar"; Pasos: Código + documento, Estado y fechas (sin datos privados), Número de cuenta + verificador, Enviar, Caso M09 consulta, Importe, vencimiento, servicio genérico; Acciones: Consultar, Descargar PDF, "Iniciar", Enviar, Ayuda "¿Qué pasa después?", Copiar código, Descargar comprobante de recepción, Seleccionar y pagar, Descargar cupón, Enviar → caso M09 consulta.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-08 | Trámites públicos | PT-10 | `/tramites` | Formularios publicados (audience público/registrado/conAcceso) con descripción y requisitos; PDF descargables… |
| PAN-POR-09 | Botón de baja | PT-10 | `/baja` | Paso 1 servicio; paso 2 identificación (nombre, documento, cuenta/suministro opcional, domicilio); paso 3 medio de… |
| PAN-POR-10 | Constancia de baja recibida | PT-10 | `/baja/recibida/:code` | Código identificador grande, fecha y hora de recepción, medio por el que se envió, próximos pasos y plazos. Copiar… |
| PAN-POR-11 | Seguimiento de baja | PT-10 | `/baja/seguimiento` | Pasos: Código + documento, estado y fechas (sin datos privados) |
| PAN-POR-12 | Pagar sin ingresar (componente embebido) | PT-10 | `/pagar` | Pasos: Número de cuenta + verificador, comprobantes impagos enmascarados … |
| PAN-POR-13 | Contacto | PT-10 | `/contacto` | Pasos: Enviar, caso M09 consulta |
| PAN-POR-17 | Encuesta por enlace | PT-10 | `/e/:token` | Encuesta T09. Responder. Token vencido/usado: mensaje |
| PAN-POR-22 | Pagar con código | PT-10 | `/pagar/codigo` | Pasos: Código de pago (o lectura de QR/código …, importe, vencimiento, servicio genérico |
| PAN-POR-104 | Buscar difunto | PT-10 | `/cementerio/buscar` | Buscar difunto: apellido y nombre (mínimo 3 caracteres), establecimiento si hay más de uno; resultado con nombre… |

### FAM-POR-04 Registro, ingreso y ruteo

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-20 Activación de usuario migrado (M19:1288) |
| Portales | campo, landing, plataforma, socio |
| Rutas | `/registro`, `/ingresar`, `/activar`, `/cooperativas` y 3 más |
| Capabilities | `por.portal.ver` |
| Olas | O0 a O3 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Activación de usuario migrado                                        |
| [Activar*]   [Ver más]                                                     |
+----------------------------------------------------------------------------+
| [ Usuario migrado ]  [ Activar ]  [ Si no figura ]  [ Correo o celular ]   |
| [ Contraseña ]  [ OTP ]                                                    |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1286, M19:1287, M19:1288, M19:1289, M19:1297, M19:1298): Campos: Usuario migrado, Activar, Si no figura, Correo o celular, Contraseña, OTP, Registrarme; Pasos: Correo/celular, OTP, Nueva contraseña, Bienvenida "Encontramos tus N cuentas"; Acciones: Activar, Registrarme, Ingresar, Recuperar, Ir a la landing, Elegir espacio/ámbito, Aceptar, Descargar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-18 | Registro de socio | PT-10 | `/registro` | Correo o celular, contraseña (o Google/CiDi), aceptación de términos; OTP. Registrarme. Ayuda de formato bajo cada campo |
| PAN-POR-19 | Ingresar | PT-10 | `/ingresar` | Login T02 con marca del tenant; enlace de referencia configurable. Ingresar, recuperar. Errores específicos sin… |
| PAN-POR-20 | Activación de usuario migrado | PT-10 | `/activar` | Pasos: correo/celular, OTP, nueva contraseña, bienvenida "Encontramos tus N cuentas" |
| PAN-POR-21 | Directorio de cooperativas | PT-01 | `/cooperativas` | Usa PT-01 Listado con filtros. Buscador de cooperativas por nombre/localidad. Ir a la landing |
| PAN-POR-23 | Splash y selección de espacio | PT-07 | `/app` | Usa PT-07 Portal del socio y del empleado (PWA). Splash con logo del tenant; si hay varios ámbitos/espacios, selector; oferta de instalar. Elegir espacio/ámbito |
| PAN-POR-24 | Aceptación de términos | PT-07 | `/app/terminos` | Usa PT-07 Portal del socio y del empleado (PWA). Documento nuevo con cambios resaltados. Aceptar (obligatorio para continuar), descargar |
| PAN-POR-77 | Ruteo a la app de campo | PT-08 | `/app/campo` | Usa PT-08 App de campo móvil (offline). Redirección a la landing de campo del rol (Mi día técnico, rutas de lectura, cobranza) |

### FAM-POR-05 Inicio, cuentas y servicios del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-25 Inicio del socio (M19:1299) |
| Portales | socio |
| Rutas | `/app/inicio`, `/app/cuentas`, `/app/cuentas/vincular`, `/app/cuentas/:accountId` y 7 más |
| Capabilities | `por.portal.ver`, `por.cuentas.vincular`, `por.servicios.ver`, `por.servicios.contratar` y 4 más |
| Olas | O2 |
| Wireframe detallado del piloto | W-11, W-15 en [05](05-wireframes-pantallas-piloto.md) |

```text
+------------------------------------------------------------+
| < Inicio del socio                                     (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Código: ········                                       | |
| | Cantidad: ········                                     | |
| | Potencia: ········                                     | |
| | Marca: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Código: ········                                       | |
| | Cantidad: ········                                     | |
| | Potencia: ········                                     | |
| | Marca: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                        Pagar                        * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1299, M19:1300, M19:1301, M19:1302, M19:1303, M19:1304): Columnas: Código, Cantidad, Potencia, Marca, Modelo, Serie, Año de compra, Protección; Pasos: Elegir plan, PAN-POR-32; Acciones: Pagar, Reclamar, Contratar, Coordinar visita, Cambiar cuenta, FAB Vincular, Marcar por defecto, Desvincular, Vincular, "Solicitar vinculación asistida".

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-25 | Inicio del socio | PT-07 | `/app/inicio` | Variante por rol (§10.8): saldo/vencimiento, acciones rápidas, trámites en curso, visitas, avisos, encuestas, muro… |
| PAN-POR-26 | Mis cuentas | PT-07 | `/app/cuentas` | Cards de cuentas: número, titular, rol de acceso, servicios, saldo, badge de estado. FAB Vincular; marcar por defecto… |
| PAN-POR-27 | Vincular cuenta | PT-07 | `/app/cuentas/vincular` | Método (pestañas): Código de socio y clave; Suministro y documento; Datos de factura; Código al contacto del titular… |
| PAN-POR-28 | Detalle de cuenta | PT-07 | `/app/cuentas/:accountId` | Titular, domicilio postal, servicios, saldo, accesos de terceros (si soy titular), adhesiones. Ver movimientos, Pagar… |
| PAN-POR-29 | Mis servicios | PT-07 | `/app/servicios` | Cards por contrato: servicio, plan, domicilio, estado del servicio (rail) y badge de trámite en curso. Filtrar por… |
| PAN-POR-30 | Detalle de servicio | PT-07 | `/app/servicios/:contractId` | Pasos: Cambiar plan, Suspender, Reactivar …, PAN-POR-103) |
| PAN-POR-31 | Contratar un servicio | PT-07 | `/app/contratar` | Pasos: Elegir plan, PAN-POR-32 |
| PAN-POR-37 | Baja, suspensión o reactivación del servicio (componente embebido) | PT-07 | `/app/servicios/:contractId/:accion` | Condiciones: fecha efectiva elegible, costo habilitado (ARS 0 en baja), efectos, equipos a devolver; aceptación… |
| PAN-POR-66 | Declaración jurada de artefactos | PT-07 | `/app/ddjj/:contractId` | Columnas: código, cantidad, potencia, marca, modelo, serie, año de compra, protección, observación, "Otros" con texto… |
| PAN-POR-67 | Adherentes del servicio | PT-07 | `/app/servicios/:contractId/adherentes` | Adherentes con vínculo y fecha de alta (componente PAN-SOC-30 filtrado por contrato, con API-SOC-056/057; dueño M18… |
| PAN-POR-103 | Detalle de llamadas | PT-07 | `/app/servicios/:contractId/llamadas` | Detalle de llamadas por período (selector de período facturado): fecha y hora, destino enmascarado, tipo, duración… |

### FAM-POR-06 Gestiones, visitas y turnos del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-51 Nueva gestión (M19:1325) |
| Portales | socio |
| Rutas | `/app/tramites/nuevo/:formCode`, `/app/gestiones/:caseId`, `/app/visitas/coordinar/:caseId`, `/app/visitas/:visitId` y 6 más |
| Capabilities | `por.gestiones.crear`, `por.visitas.gestionar`, `por.turnos.gestionar`, `por.borradores.gestionar` y 1 más |
| Olas | O2 a O10 |
| Wireframe detallado del piloto | W-14 en [05](05-wireframes-pantallas-piloto.md) |

```text
+------------------------------------------------------------+
| < Nueva gestión                                        (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Tipo: ········                                         | |
| | Servicio/contrato: ········                            | |
| | Motivo: ········                                       | |
| | Descripción con dictado: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Tipo: ········                                         | |
| | Servicio/contrato: ········                            | |
| | Motivo: ········                                       | |
| | Descripción con dictado: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                        Enviar                       * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1306, M19:1307, M19:1308, M19:1309, M19:1310, M19:1324): Campos: Tipo, Servicio/contrato, Motivo, Descripción con dictado, Fotos, Ubicación opcional; Acciones: Enviar, Siguiente/Anterior, Guardar y salir, Responder observación, Enviar mensaje, Adjuntar, Cancelar, Conformidad/rechazo, Reabrir, Encuesta.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-32 | Trámite por pasos | PT-07 | `/app/tramites/nuevo/:formCode` | Asistente por pasos con barra de progreso, campos del formulario, adjuntos, T&C, firma; resumen final… |
| PAN-POR-33 | Detalle y seguimiento de gestión (componente embebido) | PT-07 | `/app/gestiones/:caseId` | Número, tipo, estado, línea de tiempo, plazo, mensajes, adjuntos, observaciones a responder, visita y OT vinculadas… |
| PAN-POR-34 | Coordinar visita | PT-07 | `/app/visitas/coordinar/:caseId` | Días disponibles y franjas (lista accesible; calendario opcional). Componentes embebidos: PAN-TEC-57 (coordinación de… |
| PAN-POR-35 | Seguimiento de visita | PT-07 | `/app/visitas/:visitId` | Fecha/franja, estado, técnico (nombre), ETA, instrucciones de preparación, resultado. Componentes embebidos… |
| PAN-POR-36 | Conformidad de visita | PT-07 | `/app/visitas/:visitId/conformidad` | Resumen de tareas, equipo en comodato con serie, fotos, observaciones públicas. Firmar (trazo + nombre + OTP… |
| PAN-POR-50 | Mis gestiones | PT-07 | `/app/gestiones` | Pestañas Abiertas / Cerradas / Históricas (migradas); cards con tipo, número, estado, fecha, servicio. FAB Nueva… |
| PAN-POR-51 | Nueva gestión | PT-07 | `/app/gestiones/nueva` | Pasos: Tipo (Reclamo, Consulta, Trámite, elige formulario), servicio/contrato … |
| PAN-POR-52 | Mis turnos | PT-07 | `/app/turnos` | Turnos vigentes con número, área, sucursal, tiempo estimado, QR. Pedir turno (modal: sucursal, área, día/hora o turno… |
| PAN-POR-63 | Borradores | PT-07 | `/app/borradores` | Borradores con tipo, paso, vencimiento. Continuar, eliminar. "No tenés borradores" |
| PAN-POR-64 | Constancias y documentos | PT-07 | `/app/constancias` | Constancias emitidas (alta, baja, trámite, libre deuda, conformidad, adhesiones). Descargar, solicitar libre deuda |

### FAM-POR-07 Facturas, pagos y consumos del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-39 Detalle de factura (M19:1313) |
| Portales | socio |
| Rutas | `/app/facturas`, `/app/facturas/:invoiceId`, `/app/pagar`, `/app/pagos/:checkoutId` y 8 más |
| Capabilities | `por.facturas.ver`, `por.pagos.crear`, `por.debito.gestionar`, `por.facturaDigital.gestionar` y 3 más |
| Olas | O4 a O7 |
| Wireframe detallado del piloto | W-12, W-13 en [05](05-wireframes-pantallas-piloto.md) |

```text
+------------------------------------------------------------+
| < Detalle de factura                                   (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Encabezado fiscal: ········                            | |
| | Vencimientos: ········                                 | |
| | Apertura por servicio: ········                        | |
| | Explicación por concepto: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Encabezado fiscal: ········                            | |
| | Vencimientos: ········                                 | |
| | Apertura por servicio: ········                        | |
| | Explicación por concepto: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                        Pagar                        * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1312, M19:1313, M19:1314, M19:1315, M19:1316, M19:1317): Campos: Encabezado fiscal, Vencimientos, Apertura por servicio, Explicación por concepto, Pagos aplicados, Observación configurable; Pasos: Generado, Pendiente, Confirmado, Imputado, Recargar, Checkout; Acciones: Descargar PDF, Pagar, Reclamar por esta factura, Filtrar, Seleccionar, Pagar con pasarela, QR, Cupón efectivo, Quitar facturas, Descargar recibo.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-38 | Mis facturas (componente embebido) | PT-07 | `/app/facturas` | Pestañas Adeudadas / Todas; cards: servicio(s), período, vencimiento, importe, saldo, estado; agrupadas por… |
| PAN-POR-39 | Detalle de factura | PT-07 | `/app/facturas/:invoiceId` | Encabezado fiscal, vencimientos, apertura por servicio (renglones, lecturas, conceptos, tributos, subtotal, pagado… |
| PAN-POR-40 | Pagar | PT-07 | `/app/pagar` | Facturas seleccionadas, recargos al día o diferidos, percepciones, total, regla de imputación, medios disponibles… |
| PAN-POR-41 | Resultado del pago | PT-07 | `/app/pagos/:checkoutId` | Pasos: generado, pendiente, confirmado, imputado, comprobante enviado), importe, medio … |
| PAN-POR-42 | Historial de pagos | PT-07 | `/app/pagos` | Historial de pagos de todos los canales. Filtrar; descargar recibo. "Aún no registramos pagos" |
| PAN-POR-43 | Movimientos de cuenta | PT-07 | `/app/cuentas/:accountId/movimientos` | Movimientos débito/crédito, saldo, saldo a favor; resumen de cuenta si agrupación. Descargar resumen |
| PAN-POR-44 | Débito automático | PT-07 | `/app/debito-automatico` | Estado de adhesión por cuenta/servicio, medio enmascarado. Adherir (componente tokenizado), dar de baja, descargar… |
| PAN-POR-45 | Factura digital | PT-07 | `/app/factura-digital` | Estado por cuenta, canales (correo, WhatsApp), medio verificado. Adherir, cambiar canal, dar de baja. Requiere… |
| PAN-POR-46 | Mis convenios | PT-07 | `/app/convenios` | Convenios con cuotas, estado, próximas cuotas. Componentes embebidos: PAN-MOR-39 (deuda vencida y avisos) y PAN-MOR-40… |
| PAN-POR-47 | Mis consumos (componente embebido) | PT-07 | `/app/consumos(/:contractId)` | Gráfico de barras por período + tabla, comparaciones, promedio diario, tipo de lectura (real, estimada, autolectura)… |
| PAN-POR-48 | Autolectura (componente embebido) | PT-07 | `/app/autolectura/:contractId` | Ventana vigente, instrucciones, cámara con guía, valor propuesto por OCR, último valor. Componente embebido… |
| PAN-POR-49 | Recarga prepaga (componente embebido) | PT-07 | `/app/prepaga` | Pasos: Recargar, checkout |

### FAM-POR-08 Comunidad en el portal

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-105 Comunidad (M19:1331) |
| Portales | socio |
| Rutas | `/app/comunidad`, `/app/avisos`, `/app/encuestas(/:id)`, `/app/muro(/:id)` y 2 más |
| Capabilities | `por.portal.ver`, `com.inbox.ver`, `com.surveys.responder`, `com.wall.ver` |
| Olas | O2 |

```text
+------------------------------------------------------------+
| < Comunidad                                            (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| Muro | Encuestas | Novedades                               |
| ====                                                       |
| +--------------------------------------------------------+ |
| | Publicación: ········                                  | |
| | Fecha: ········                                        | |
| | Autor o área: ········                                 | |
| | Reacciones y comentarios: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Publicación: ········                                  | |
| | Fecha: ········                                        | |
| | Autor o área: ········                                 | |
| | Reacciones y comentarios: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                  Abrir publicación                  * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1327, M19:1328, M19:1329, M19:1330, M19:1331, M19:1343): Pestañas: Muro, Encuestas, Novedades; Campos: Publicación, Fecha, Autor o área, Reacciones y comentarios; Acciones: Cambiar de pestaña, Abrir publicación, Responder encuesta, Leer novedad, Abrir objeto, Marcar todo leído, Responder, Reaccionar, Comentar, Denunciar. El anexo describe la pantalla de referencia en prosa: pestañas, campos y acciones del wireframe revisados a mano a partir de ese texto.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-105 | Comunidad | PT-07 | `/app/comunidad` | Comunidad: destino "Comunidad" de la tabbar (PA-POR-20, RF-POR-180): agregador con pestañas Muro (PAN-POR-55)… |
| PAN-POR-53 | Avisos | PT-07 | `/app/avisos` | Bandeja con tipo (ícono/color de notifKinds), fecha, leído. Abrir objeto, marcar todo leído. "Estás al día" |
| PAN-POR-54 | Encuestas | PT-07 | `/app/encuestas(/:id)` | Pendientes y respondidas. Responder |
| PAN-POR-55 | Muro | PT-07 | `/app/muro(/:id)` | Feed editorial T09 por audiencia; reacciones/comentarios si habilitados. Reaccionar, comentar, denunciar |
| PAN-POR-56 | Novedades y boletines | PT-07 | `/app/novedades(/:id)` | Boletines y novedades. Leer |
| PAN-POR-68 | Avisos de corte en mi zona | PT-07 | `/app/avisos-de-corte` | Interrupciones que afectan las zonas de mis suministros. "Sin cortes programados en tus domicilios" |

### FAM-POR-09 Perfil del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-57 Representaciones y autorizados (M19:1332) |
| Portales | socio |
| Rutas | `/app/representaciones`, `/app/invitacion/:token`, `/app/perfil`, `/app/perfil/comunicaciones` y 3 más |
| Capabilities | `por.representaciones.gestionar`, `por.perfil.editar`, `com.preferences.editar`, `iam.miCuenta.gestionar` y 2 más |
| Olas | O0 a O2 |

```text
+------------------------------------------------------------+
| < Representaciones y autorizados                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | FAB Autorizar: ········                                | |
| | Revocar: ········                                      | |
| | Renunciar: ········                                    | |
| | Modal: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | FAB Autorizar: ········                                | |
| | Revocar: ········                                      | |
| | Renunciar: ········                                    | |
| | Modal: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                    FAB Autorizar                    * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1332, M19:1333, M19:1334, M19:1335, M19:1336, M19:1337): Campos: FAB Autorizar, Revocar, Renunciar, Modal, Contacto, Cuentas/contratos, Acciones, Vigencia; Acciones: FAB Autorizar, Revocar, Renunciar, Enviar invitación, Aceptar, Rechazar, Editar contacto, Iniciar trámite de cambio, Guardar, Cambiar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-57 | Representaciones y autorizados | PT-07 | `/app/representaciones` | Pestañas "Autoricé" (personas, cuentas, acciones, vigencia, estado) y "Me autorizaron". FAB Autorizar; revocar… |
| PAN-POR-58 | Invitación de representación | PT-07 | `/app/invitacion/:token` | Modal: contacto, cuentas/contratos, acciones (casillas), vigencia; aceptación: quién invita, qué podrá hacer. Enviar… |
| PAN-POR-59 | Mi perfil | PT-07 | `/app/perfil` | Nombre, documento (solo lectura), correo y celular (verificables), domicilio postal (trámite), datos fiscales… |
| PAN-POR-60 | Preferencias de comunicación | PT-07 | `/app/perfil/comunicaciones` | Categorías × canales (T09), no molestar, push. Guardar. Constancias no desactivables (explicado) |
| PAN-POR-61 | Seguridad de la cuenta | PT-07 | `/app/perfil/seguridad` | Contraseña, 2FA, dispositivos, sesiones (T02). Cambiar, cerrar sesiones |
| PAN-POR-62 | Apariencia | PT-07 | `/app/perfil/apariencia` | Tema (oscuro, claro, alto contraste, sistema), tamaño de texto, reducir movimiento, vista ancha. Guardar |
| PAN-POR-65 | Ayuda (PWA) | PT-07 | `/app/ayuda` | FAQ, chat/bot (M09), teléfonos, sucursales, declaración de accesibilidad. Iniciar chat, llamar |

### FAM-POR-10 Servicios sociales e institucional en el portal

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-102 Mi asociación (tarjeta que embebe PAN-INS-30) (M19:1348) |
| Portales | socio |
| Rutas | `/app/mi-grupo`, `/app/solicitudes-sociales`, `/app/cementerio`, `/app/vivienda` y 1 más |
| Capabilities | `soc.mi.ver`, `soc.mi.solicitar`, `ins.mi.ver` |
| Olas | O10 |

```text
+------------------------------------------------------------+
| < Mi asociación (tarjeta que em…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Estado: ········                                       | |
| | Número: ········                                       | |
| | Antigüedad: ········                                   | |
| | Capital: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Estado: ········                                       | |
| | Número: ········                                       | |
| | Antigüedad: ········                                   | |
| | Capital: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                   Solicitar egreso                  * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1344, M19:1345, M19:1346, M19:1347, M19:1348): Campos: Estado, Número, Antigüedad, Capital, Credencial digital con QR, Documentos; Acciones: Descargar estado de capital, Mostrar credencial, Solicitar egreso, Solicitar alta/baja de integrante, Enviar solicitud, Adjuntar documentos, Solicitar acto, Descargar estado.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-98 | Mi grupo y coberturas (tarjeta que embebe PAN-SOC-30) (componente embebido) | PT-07 | `/app/mi-grupo` | Tarjeta M19 "Mi grupo y coberturas" que embebe PAN-SOC-30: integrantes por servicio, carencias, prestaciones usadas… |
| PAN-POR-99 | Solicitudes sociales (tarjeta que embebe PAN-SOC-31) (componente embebido) | PT-07 | `/app/solicitudes-sociales` | Tarjeta M19 que embebe PAN-SOC-31: formulario por tipo sin datos clínicos y seguimiento (API-SOC-057); emergencias… |
| PAN-POR-100 | Cementerio (tarjeta que embebe PAN-SOC-32) (componente embebido) | PT-07 | `/app/cementerio` | Tarjeta M19 que embebe PAN-SOC-32: unidad, modalidad, obligaciones, actos programados (API-SOC-058). Solicitar acto… |
| PAN-POR-101 | Vivienda (tarjeta que embebe PAN-SOC-33) (componente embebido) | PT-07 | `/app/vivienda` | Tarjeta M19 que embebe PAN-SOC-33: tipología, % aportado, cuotas, avance de obra (API-SOC-059). Descargar estado. "No… |
| PAN-POR-102 | Mi asociación (tarjeta que embebe PAN-INS-30) (componente embebido) | PT-07 | `/app/mi-asociacion` | Tarjeta M19 que embebe PAN-INS-30: estado, número, antigüedad, capital, credencial digital con QR, documentos… |

### FAM-POR-11 Portal del empleado

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-71 Detalle del recibo (M19:1399) |
| Portales | empleado |
| Rutas | `/app/empleado`, `/app/empleado/recibos`, `/app/empleado/recibos/:id`, `/app/empleado/vacaciones` y 4 más |
| Capabilities | `por.empleado.ver`, `sue.portal.recibos.ver`, `sue.portal.licencias.solicitar`, `sue.portal.datos.ver` y 2 más |
| Olas | O2 a O9 |

```text
+------------------------------------------------------------+
| < Detalle del recibo                                   (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Neto: ········                                         | |
| | Haberes: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Neto: ········                                         | |
| | Haberes: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                  Firmar conformidad                 * ]  |
+------------------------------------------------------------+
| Inicio | Recibos | (+) | Solicitudes | Perfil              |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1397, M19:1398, M19:1399, M19:1400, M19:1401, M19:1402): Campos: Neto, Haberes; Acciones: Firmar conformidad, "Firmar en disconformidad" con motivo, Descargar, Firmar recibo, Solicitar, Abrir, FAB Solicitar, Solicitar actualización, Reaccionar/comentar según reglas.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-69 | Inicio del empleado | PT-07 | `/app/empleado` | Incrusta un resumen de PAN-SUE-41 a PAN-SUE-46 de M16 (dueño del contenido; PA-SUE-16 de M16) — Último recibo… |
| PAN-POR-70 | Mis recibos | PT-07 | `/app/empleado/recibos` | Incrusta PAN-SUE-41 de M16 (dueño; PA-SUE-16) — Recibos por período con estado de firma. Abrir. "Aún no hay recibos… |
| PAN-POR-71 | Detalle del recibo | PT-07 | `/app/empleado/recibos/:id` | Campos: neto, haberes, deducciones) |
| PAN-POR-72 | Vacaciones | PT-07 | `/app/empleado/vacaciones` | Incrusta PAN-SUE-42 de M16 (dueño; PA-SUE-16) — Saldo por período, solicitudes con estado. FAB Solicitar (modal… |
| PAN-POR-73 | Licencias | PT-07 | `/app/empleado/licencias` | Incrusta PAN-SUE-42 de M16 (dueño; PA-SUE-16) — Licencias con tipo, fechas, estado, certificado. FAB Solicitar (modal… |
| PAN-POR-74 | Mi legajo | PT-07 | `/app/empleado/legajo` | Incrusta PAN-SUE-43 de M16 (dueño; PA-SUE-16) — Datos personales, contacto, cuenta sueldo enmascarada, familiares… |
| PAN-POR-75 | Muro interno | PT-07 | `/app/empleado/muro` | Incrusta el componente de muro interno de T09 (dueño) — Muro interno T09. Reaccionar/comentar según reglas |
| PAN-POR-76 | Avisos internos | PT-07 | `/app/empleado/avisos` | Incrusta la bandeja de avisos de T09 (dueño) — Avisos internos |

### FAM-POR-12 Tótem de autoservicio

| Dato | Valor |
|---|---|
| Patrón base | PT-12 Pantalla completa de operación (POS, tótem, turnero) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-80 Tótem: deuda (M19:1408) |
| Portales | admin, dispositivo |
| Rutas | `/totem`, `/totem/identificar`, `/totem/deuda`, `/totem/pago` y 3 más |
| Capabilities | `por.totem.operar`, `por.totems.configurar` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Tótem: deuda  (pantalla completa)                 dd-mm-yyyy hh:mm [Salir] |
+----------------------------------------------------------------------------+
| +--------------------+  +--------------------+  +--------------------+     |
| |   TÓTEM: INICIO    |  |TÓTEM: IDENTIFICACI…|  |    TÓTEM: DEUDA    |     |
| +--------------------+  +--------------------+  +--------------------+     |
| +--------------------+  +--------------------+  +--------------------+     |
| |    TÓTEM: PAGO     |  |TÓTEM: RECARGA PREP…|  |TÓTEM: FIN DE OPERA…|     |
| +--------------------+  +--------------------+  +--------------------+     |
+----------------------------------------------------------------------------+
| Número / total: ######                           [Cancelar] [Seleccionar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1406, M19:1407, M19:1408, M19:1409, M19:1410, M19:1411): Columnas: Sucursal, Caja, Estado, Último heartbeat, Medios; Acciones: Seleccionar, Continuar, Elegir, Buscar, Pagar, Cancelar, Recargar, Imprimir, Enviar por correo, Alta.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-78 | Tótem: inicio | PT-12 | `/totem` | Mosaicos dinámicos (Pagar facturas, Recargar prepaga, Pedir turno) con marca. Elegir. Fuera de servicio: pantalla de… |
| PAN-POR-79 | Tótem: identificación | PT-12 | `/totem/identificar` | Asociado / cuenta / documento / QR con teclado numérico en pantalla. Buscar. No encontrado: mensaje |
| PAN-POR-80 | Tótem: deuda | PT-12 | `/totem/deuda` | Comprobantes y cuotas con casillas, créditos disponibles, total con recargos y percepciones. Seleccionar, continuar… |
| PAN-POR-81 | Tótem: pago | PT-12 | `/totem/pago` | Medios habilitados: tarjeta (lector), QR, efectivo (billetero) con importe ingresado en vivo. Pagar, cancelar. Error… |
| PAN-POR-82 | Tótem: recarga prepaga | PT-12 | `/totem/prepaga` | Servicio prepago, importe, cálculo de capital. Recargar |
| PAN-POR-83 | Tótem: fin de operación | PT-12 | `/totem/fin` | Resultado y comprobante. Imprimir, enviar por correo |
| PAN-POR-96 | Tótems de autoservicio | PT-01 | `/admin/portal/totems` | Usa PT-01 Listado con filtros. Columnas: sucursal, caja, estado, último heartbeat, medios |

### FAM-POR-13 Administración del portal

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-87 Formularios del portal (M19:1433) |
| Portales | admin |
| Rutas | `/admin/portal/configuracion`, `/admin/portal/landing`, `/admin/portal/landing/versiones`, `/admin/portal/formularios` y 2 más |
| Capabilities | `por.parametros.configurar`, `por.landing.editar`, `por.landing.publicar`, `por.formularios.ver` y 2 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Formularios del portal                        [x] |
+----------------------------------------------------------------------+
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
| [Duplicar] [Retirar]                             [Cancelar] [Nuevo*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1430, M19:1431, M19:1432, M19:1433, M19:1434, M19:1439): Columnas: Código, Nombre, Servicio, Tipo, Audiencia, Versión, Estado, Presentaciones del mes; Acciones: Nuevo, Duplicar, Retirar, Importar desde ProCoop, Guardar con vigencia, Ver historial, Agregar/ocultar bloque, Guardar borrador, Enviar a revisión, Aprobar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-84 | Configuración del portal | PT-09 | `/admin/portal/configuracion` | Usa PT-09 Configuración versionada. Parámetros PRM-POR-* agrupados (Acceso, Vinculación, Facturas, Pagos, Consumos, Gestiones, Turnos, Comunidad… |
| PAN-POR-85 | Editor de la landing | PT-03 | `/admin/portal/landing` | Editor por bloques (lista ordenable con alternativa por botones subir/bajar), panel de propiedades, preview… |
| PAN-POR-86 | Versiones de la landing | PT-01 | `/admin/portal/landing/versiones` | Usa PT-01 Listado con filtros. DataTable de versiones (número, estado, autor, fechas). Aprobar, rechazar, programar, publicar, revertir, comparar |
| PAN-POR-87 | Formularios del portal | PT-03 | `/admin/portal/formularios` | Columnas: código, nombre, servicio, tipo, audiencia, versión, estado, presentaciones del mes |
| PAN-POR-88 | Constructor de formularios | PT-03 | `/admin/portal/formularios/:id` | Constructor: datos generales (tipo, sujeto requerido, repetición, comparar documento, T&C, PDF, contacto, comando de… |
| PAN-POR-93 | Banners | PT-01 | `/admin/portal/banners` | Usa PT-01 Listado con filtros. DataTable de banners con audiencia y vigencia; preview por rol. Nuevo, pausar |

### FAM-POR-14 Accesos y métricas del portal

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-POR-91 Recepción pública: bajas y contactos (M19:1437) |
| Portales | admin |
| Rutas | `/admin/portal/vinculaciones`, `/admin/portal/accesos`, `/admin/portal/recepcion-publica`, `/admin/portal/migracion` y 3 más |
| Capabilities | `por.vinculaciones.ver`, `por.accesos.ver`, `por.recepcionPublica.ver`, `por.migracion.ejecutar` y 3 más |
| Olas | O2 a O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > POR > Recepc… [Derivar a CRM] [Reenviar código/c…] [Identificar*] |
| Recepción pública: bajas y contactos                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Estado ▼] [Más filtros]                  |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Bajas     Contactos Código    Servicio  Estado    Plazos    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Derivar a CRM] [Reenviar códig… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M19:1435, M19:1436, M19:1437, M19:1438, M19:1440, M19:1441): Filtros: Servicio, Estado; Columnas: Bajas, Contactos públicos, Código, Servicio, Estado, Plazos; Campos: Bajas, Contactos públicos, Código, Servicio, Estado, Plazos; Pasos: Subir volcado, Validar, Ver errores/conflictos, Importar, Invitar, Informe de conciliación; Acciones: Identificar, Derivar a CRM, Reenviar código/constancia, Aprobar, Rechazar con motivo, Emitir código de invitación, Revocar, Suspender, Importar, Revertir.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-POR-89 | Vinculaciones pendientes | PT-06 | `/admin/portal/vinculaciones` | Usa PT-06 Bandeja de trabajo. Bandeja de accesos pendienteVerificacion/asistidos: usuario, cuenta, método, evidencia, antigüedad. Aprobar, rechazar… |
| PAN-POR-90 | Accesos al portal por cuenta | PT-01 | `/admin/portal/accesos` | Por cuenta: usuarios con acceso, rol, acciones, vigencia, origen, último uso; historial. Revocar… |
| PAN-POR-91 | Recepción pública: bajas y contactos | PT-01 | `/admin/portal/recepcion-publica` | Bajas y contactos públicos: código, servicio, estado, plazos (semáforo 24 h / 72 h), identificación. Identificar… |
| PAN-POR-92 | Migración de usuarios CoopOnline | PT-04 | `/admin/portal/migracion` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: subir volcado, validar, ver errores/conflictos, importar, invitar, informe de conciliación |
| PAN-POR-94 | Métricas del portal | PT-01 | `/admin/portal/metricas` | Indicadores del §15 con filtros de período, servicio, canal. Exportar XLSX/CSV/PDF |
| PAN-POR-95 | Vista como socio | PT-02 | `/admin/portal/vista-socio/:accountId` | Usa PT-02 Ficha o detalle con pestañas. Marco "celular" con la PWA en modo solo lectura de la cuenta; banda superior "Vista de operador — solo lectura"… |
| PAN-POR-97 | Presentaciones de formularios | PT-03 | `/admin/portal/presentaciones` | Usa PT-03 Formulario o editor. Presentaciones por formulario/estado; detalle con "Datos del formulario" y "Datos que registra el usuario" (operador)… |

## T01 PLA: Plataforma SaaS

Anexo `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`, §10. 5 familias, 25 PAN. Catálogo: [17-20-T01-PLA.md](17-catalogo-pantallas/17-20-T01-PLA.md).

### FAM-PLA-01 Tablero y tenants

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PLA-02 Listado de tenants (T01:1846) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/dashboard`, `/admin/plataforma/tenants`, `/admin/plataforma/tenants/:id`, `/admin/plataforma/tenants/alta` |
| Capabilities | `pla.dashboard.ver`, `pla.tenants.ver`, `pla.altaAsistida.usar` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > PLA > Listado de tenants [Exportar] [Cambiar anillo ma…] [Nuevo*] |
| Listado de tenants                                               (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Clase ▼] [Plan ▼] [Anillo ▼] [Más filtros] |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre co CUIT      Estado    Plan      Módulos e [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar] [Cambiar anillo ma…]  25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T01:1845, T01:1846, T01:1847, T01:1848): Filtros: Estado, Clase, Plan, Anillo, Región, Implementador; Columnas: Código, Nombre corto, CUIT, Estado, Plan, Módulos en producción, % checklist, Uso vs cupo; Pestañas: Identidad, Contactos, Estado e historial, Licencias, Activaciones, Checklists, Contrato; Acciones: Nuevo, Exportar, Cambiar anillo masivo, Ir al detalle, Reconocer alerta, Cambiar estado, Activar/desactivar módulo, Editar identidad, Verificar dominio, Crear sandbox.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PLA-01 | Dashboard global | PT-05 | `/admin/plataforma/dashboard` | Usa PT-05 Tablero, reporte o mapa. Dashboard global (GOB-001). Zona A KPIs §15.1 (tenants por estado, checklists incompletos, jobs fallidos, lag outbox… |
| PAN-PLA-02 | Listado de tenants | PT-01 | `/admin/plataforma/tenants` | Filtros: estado, clase, plan, anillo, región, implementador, columnas: código, nombre corto, CUIT, estado; Columnas… |
| PAN-PLA-03 | Ficha del tenant | PT-02 | `/admin/plataforma/tenants/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Identidad, contactos, Estado e historial, Licencias, activaciones, Checklists, Contrato, uso, Dominios… |
| PAN-PLA-04 | Alta asistida de tenant | PT-04 | `/admin/plataforma/tenants/alta` | Usa PT-04 Asistente por pasos o proceso masivo. Alta asistida (§9.1). Asistente de 7 pasos; en Marca: subir logo/URL, botón “Proponer con IA”, paleta con contraste… |

### FAM-PLA-02 Catálogo, planes y contratos SaaS

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PLA-07 Contratos SaaS (T01:1851) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/catalogo`, `/admin/plataforma/planes`, `/admin/plataforma/contratos` |
| Capabilities | `pla.catalogo.ver`, `pla.planes.ver`, `pla.contratos.ver` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > PLA > C… [Enviar a aprobaci…] [Aprobar/rechazar] [Nuevo/versión*] |
| Contratos SaaS                                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Tenant    Plan      Vigencia  Estado    Cupos     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Enviar a aprobaci…] [Aprobar/r… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T01:1849, T01:1850, T01:1851): Filtros: Estado; Columnas: Número, Tenant, Plan, Vigencia, Estado, Cupos, Región, Versión; Acciones: Nuevo/versión, Enviar a aprobación, Aprobar/rechazar, Adjuntar firmado, Prefactura, Nuevo/editar, Deprecar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PLA-05 | Catálogo de módulos vendibles | PT-09 | `/admin/plataforma/catalogo` | Usa PT-09 Configuración versionada. Columnas: código, etiqueta, clase, dependencias, packs, capabilities que cuelgan, checklist, estado |
| PAN-PLA-06 | Licencias y packs | PT-01 | `/admin/plataforma/planes` | Columnas: código, tamaño objetivo, módulos, cupos por defecto, estado |
| PAN-PLA-07 | Contratos SaaS | PT-01 | `/admin/plataforma/contratos` | Columnas: número, tenant, plan, vigencia, estado, cupos, región, versión |

### FAM-PLA-03 Operación y estado de la plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PLA-11 Restauraciones (T01:1855) |
| Portales | admin, landing, plataforma |
| Rutas | `/admin/plataforma/operacion/jobs`, `/admin/plataforma/operacion/backups`, `/admin/plataforma/operacion/restauraciones`, `/admin/plataforma/alertas` y 5 más |
| Capabilities | `pla.jobs.ver`, `pla.backups.ver`, `pla.restauraciones.solicitar`, `pla.alertas.ver` y 4 más |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > PLA > Restauraciones  [Aprobar] [Confirmar ejecuci…] [Solicitar*] |
| Restauraciones                                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Lista RST Conciliac Solicitar Aprobar   Confirmar Salud de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aprobar] [Confirmar ejecuci…] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T01:1853, T01:1854, T01:1855, T01:1856, T01:1857, T01:1858): Columnas: Lista RST-…, Conciliación, Solicitar, Aprobar, Confirmar ejecución, Salud de colas; Pestañas: Colas, Jobs, Outbox, Bandeja técnica; Campos: Lista RST-…, Conciliación, Solicitar, Aprobar, Confirmar ejecución, Salud de colas, Jobs, Outbox; Acciones: Solicitar, Aprobar, Confirmar ejecución, Ver informe, Reintentar, Cancelar, Pausar/reanudar cola, Reprocesar/descartar DLQ, Ejecutar backup lógico a demanda, Verificar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PLA-09 | Salud de colas, jobs, outbox y bandeja técnica | PT-06 | `/admin/plataforma/operacion/jobs` | Usa PT-06 Bandeja de trabajo. Pestañas: Colas, Jobs, Outbox, Bandeja técnica |
| PAN-PLA-10 | Respaldos y restauración | PT-01 | `/admin/plataforma/operacion/backups` | Backups. Políticas; ejecuciones por tenant (tipo, estado, tamaño, checksum, retención, verificado); ensayos. Ejecutar… |
| PAN-PLA-11 | Restauraciones | PT-01 | `/admin/plataforma/operacion/restauraciones` | Restauraciones. Lista RST-…; detalle con diff por colección y conciliación. Solicitar (modal lg), aprobar, confirmar… |
| PAN-PLA-12 | Alertas y reglas | PT-09 | `/admin/plataforma/alertas` | Usa PT-09 Configuración versionada. Alertas y reglas. Alertas (severidad, estado, objeto, conteo, primera/última); reglas (condición, umbral… |
| PAN-PLA-13 | Incidentes de plataforma | PT-01 | `/admin/plataforma/incidentes` | Incidentes de plataforma. Número, severidad, estado, tenants/módulos afectados, inicio/fin, casos vinculados. Nuevo… |
| PAN-PLA-14 | Ambientes | PT-01 | `/admin/plataforma/sandboxes` | Sandboxes. Tenant, ambiente, estado, última sincronización, datos (ficticios/anonimizados). Crear, sincronizar… |
| PAN-PLA-20 | Releases y feature flags | PT-09 | `/admin/plataforma/releases` | Usa PT-09 Configuración versionada. Releases y feature flags. Releases por ambiente/anillo, migraciones, digests; flags con reglas por anillo/tenant y… |
| PAN-PLA-24 | Estado del servicio | PT-10 | `/estado` | Usa PT-10 Página pública (landing). Estado del servicio. Componentes y su estado; incidentes en curso para el tenant. “Todos los sistemas operativos” |
| PAN-PLA-25 | Inventario técnico | PT-01 | `/admin/plataforma/sistema` | Inventario técnico. Módulos registrados (manifiestos), rutas, eventos, jobs, colecciones, versión de esquema; health… |

### FAM-PLA-04 Soporte

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PLA-08 Accesos temporales (T01:1852) |
| Portales | admin, plataforma |
| Rutas | `/admin/plataforma/soporte/accesos`, `/admin/pla/soporte`, `/admin/pla/accesos-soporte`, `/admin/plataforma/soporte/casos` |
| Capabilities | `pla.soporte.accesos.ver`, `pla.soporte.ver` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > PLA > Accesos temporales  [Aprobar] [Iniciar sesión] [Solicitar*] |
| Accesos temporales                                               (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Tenant    Caso      Agente    Modo      PII       Alcance   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aprobar] [Iniciar sesión] [Rev… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T01:1852, T01:1861, T01:1862, T01:1865): Filtros: Estado; Columnas: Tenant, Caso, Agente, Modo, PII, Alcance, Desde/hasta, Estado; Acciones: Solicitar, Aprobar, Iniciar sesión, Revocar, Nuevo caso, Responder, Adjuntar, Reabrir, Cerrar, Encuesta.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PLA-08 | Accesos temporales | PT-01 | `/admin/plataforma/soporte/accesos` | Columnas: tenant, caso, agente, modo, PII, alcance, desde/hasta, estado, acciones |
| PAN-PLA-17 | Casos de soporte de plataforma | PT-01 | `/admin/pla/soporte` | Casos de soporte de plataforma. Número, título, módulo, prioridad, estado, SLA; detalle con conversación. Nuevo caso… |
| PAN-PLA-18 | Accesos de soporte a mi cooperativa | PT-01 | `/admin/pla/accesos-soporte` | Accesos de soporte a mi cooperativa. Pendientes de aprobación, activos, históricos; sesiones; enlace a auditoría… |
| PAN-PLA-21 | Bandeja de soporte de plataforma | PT-06 | `/admin/plataforma/soporte/casos` | Usa PT-06 Bandeja de trabajo. Columnas: número, tenant, título, prioridad, estado, asignado, vence |

### FAM-PLA-05 Cuenta SaaS del tenant

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PLA-23 Exportación completa de datos (T01:1867) |
| Portales | admin, plataforma |
| Rutas | `/admin/pla/suscripcion`, `/admin/pla/habilitacion`, `/admin/pla/novedades`, `/admin/plataforma/uso` y 1 más |
| Capabilities | `pla.miSuscripcion.ver`, `pla.habilitacion.ver`, `pla.novedadesPlataforma.ver`, `pla.uso.ver` y 1 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > PLA > Exportación completa … [Descargar] [Solicitar exportación*] |
| Exportación completa de datos                                    (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Solicitud Estado    Tamaño    Vencimien Descargas Plan      [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   [Activo]  ·······   dd-mm-yyy ·······   ·······    ...       |
| [ ] ·······   [Pendient ·······   dd-mm-yyy ·······   ·······    ...       |
| [ ] ·······   [Activo]  ·······   dd-mm-yyy ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Descargar]                      25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T01:1859, T01:1860, T01:1863, T01:1866, T01:1867): Filtros: Estado; Columnas: Solicitudes, Estado, Tamaño, Vencimiento, Descargas, Plan; Campos: Solicitudes, Estado, Tamaño, Vencimiento, Descargas, Plan, Módulos licenciados, Activos; Acciones: Solicitar exportación, Descargar, Solicitar cambio, Marcar ítem manual con evidencia, Marcar leído, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PLA-15 | Mi suscripción | PT-05 | `/admin/pla/suscripcion` | Usa PT-05 Tablero, reporte o mapa. Mi suscripción. Plan, módulos licenciados y activos, cupos y consumo (gráfico de barras), vigencia, región, objetivos… |
| PAN-PLA-16 | Habilitación de la cooperativa | PT-01 | `/admin/pla/habilitacion` | Habilitación de la cooperativa. Estado del tenant; por capacidad: checklist con ítem, estado, responsable, enlace a la… |
| PAN-PLA-19 | Lo nuevo y avisos | PT-03 | `/admin/pla/novedades` | Usa PT-03 Formulario o editor. Lo nuevo y avisos. Notas de versión por módulo, avisos de mantenimiento, incidentes que afectan al tenant. Marcar leído |
| PAN-PLA-22 | Uso por tenant | PT-05 | `/admin/plataforma/uso` | Usa PT-05 Tablero, reporte o mapa. Uso por tenant. Matriz tenant × dimensión con % de cupo y tendencia. Exportar |
| PAN-PLA-23 | Exportación completa de datos | PT-01 | `/admin/pla/exportaciones` | Exportación completa de datos. Solicitudes, estado, tamaño, vencimiento, descargas. Solicitar exportación… |

## T02 IAM: Identidad, roles y auditoría

Anexo `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`, §10. 5 familias, 32 PAN. Catálogo: [17-21-T02-IAM.md](17-catalogo-pantallas/17-21-T02-IAM.md).

### FAM-IAM-01 Ingreso y mi seguridad

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-IAM-03 Segundo factor de autenticación (T02:4104) |
| Portales | admin, landing, socio |
| Rutas | `/admin/login`, `/app/login`, `/admin/login/mfa`, `/admin/select-scope` y 4 más |
| Capabilities | `pública`, `sesión`, `iam.miCuenta.gestionar`, `por.cuentas.vincular` |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > IAM > Segundo factor de autenticación [Abrir] [Exportar] [Nuevo*] |
| Segundo factor de autenticación                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Elección  Reenvío c "Usar cód Códigos d Usuario o Contraseñ [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T02:4102, T02:4103, T02:4104, T02:4105, T02:4106, T02:4107): Columnas: Elección de factor, Reenvío con contador, "Usar código de recuperación", Códigos de recuperación, Usuario o correo, Contraseña con mostrar/ocultar; Campos: Elección de factor, Reenvío con contador, "Usar código de recuperación", Códigos de recuperación, Usuario o correo, Contraseña con mostrar/ocultar, "Recordarme", "Olvidé mi contraseña"; Pasos: Instrucciones de recuperación asistida. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-IAM-01 | Pre-login + login staff | PT-01 | `/admin/login` | Pre-login + login staff: campo código (si no hay subdominio) que carga marca y botones SSO al salir del campo; usuario… |
| PAN-IAM-02 | Login de socio | PT-07 | `/app/login` | Usa PT-07 Portal del socio y del empleado (PWA). Login de socio: "DNI o CUIT (sin puntos ni guiones)", contraseña, botones Google y CiDi (si habilitados), "Recibir un… |
| PAN-IAM-03 | Segundo factor de autenticación | PT-01 | `/admin/login/mfa` | Pasos: Elección de factor, ingreso de código …, instrucciones de recuperación asistida |
| PAN-IAM-04 | Selección de ámbito | PT-05 | `/admin/select-scope` | Usa PT-05 Tablero, reporte o mapa. Tarjetas de ámbito (logo, nombre visible del tenant, contexto Staff/Portal); selección de sucursal/PV/caja cuando… |
| PAN-IAM-05 | Recuperación de acceso | PT-01 | `/admin/forgot-password` | Pedir recuperación (respuesta genérica); nueva contraseña con medidor, política visible y factor si corresponde |
| PAN-IAM-06 | Aceptar invitación | PT-02 | `/admin/invite/:token` | Usa PT-02 Ficha o detalle con pestañas. Aceptar invitación: si existe identidad, inicia sesión; si no, crea contraseña; enrolamiento MFA si el rol lo exige… |
| PAN-IAM-07 | Mi seguridad | PT-01 | `/admin/perfil/seguridad` | Mi seguridad: cambiar contraseña; factores (alta, predeterminado, baja con step-up); códigos de recuperación… |
| PAN-IAM-08 | Bloqueo por inactividad | PT-11 | overlay | Usa PT-11 Modal, pestaña o componente embebido. Bloqueo por inactividad: nombre del usuario, contraseña o factor, "Cambiar de usuario" (logout) |
| PAN-IAM-32 | Vinculación de cuenta del socio | PT-07 | `/app/vincular-cuenta` | Usa PT-07 Portal del socio y del empleado (PWA). Vinculación de cuenta del socio: DNI/CUIT, número de cuenta/suministro, prueba (dato de factura o código), resultado… |

### FAM-IAM-02 Usuarios y roles

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-IAM-11 Roles (T02:4112) |
| Portales | admin, plataforma |
| Rutas | `/admin/iam/usuarios`, `/admin/iam/usuarios/:id`, `/admin/iam/roles`, `/admin/iam/perfiles` y 1 más |
| Capabilities | `iam.usuarios.ver`, `iam.roles.ver`, `iam.perfiles.ver`, `iam.plataforma.usuarios.gestionar` y 1 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Roles                                                           [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Recurso                                                                |
|                                                                            |
| Paso 2 de 2: Recurso                                                       |
|   Pestañas Datos                  [______________________]                 |
|   Roles                           [______________________]                 |
|   Perfiles                        [______________________]                 |
|   Permisos efectivos              [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                  [Guardar borrador] [Importar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T02:4110, T02:4111, T02:4112, T02:4113, T02:4127, T02:4132): Filtros: Estado, Rol, Perfil, Sucursal, Sin MFA, Inactivos > N días; Columnas: Nombre, Alias, Correo, Estado, Roles, Perfiles, Sucursales, MFA sí/no; Campos: Pestañas Datos, Roles, Perfiles, Permisos efectivos, Sesiones, Dispositivos, Factores, Historial, Accesos; Pasos: Recurso; Acciones: Invitar, Importar, Exportar, Suspender/Reactivar, Revocar, Reenviar invitación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-IAM-09 | Usuarios del staff | PT-01 | `/admin/iam/usuarios` | Usa PT-01 Listado con filtros. Filtros: estado, rol, perfil, sucursal, sin MFA, inactivos > N días; Columnas: nombre, alias, correo, estado, roles… |
| PAN-IAM-10 | Ficha de usuario | PT-02 | `/admin/iam/usuarios/:id` | Usa PT-02 Ficha o detalle con pestañas. Campos: pestañas Datos, Roles, Perfiles, Permisos efectivos, Sesiones, dispositivos, Factores, Historial, Accesos |
| PAN-IAM-11 | Roles | PT-04 | `/admin/iam/roles` | Pasos: editor con árbol de capabilities …, recurso, acciones), buscador (reemplazo de … |
| PAN-IAM-12 | Editor de perfiles | PT-03 | `/admin/iam/perfiles` | Usa PT-03 Formulario o editor. Editor de perfiles: apps habilitadas; árbol de pantallas por app (check en cascada padre/hijos, como… |
| PAN-IAM-26 | Usuarios y roles de plataforma | PT-03 | `/admin/plataforma/iam/usuarios` | Usa PT-03 Formulario o editor. Usuarios y roles de plataforma; editor de roles y perfiles plantilla con versión y publicación a tenants (los tenants… |
| PAN-IAM-31 | ExcelImportWizard de usuarios | PT-04 | modal xl | ExcelImportWizard de usuarios (plantilla descargable, preview con errores por fila, confirmar) |

### FAM-IAM-03 Segregación de funciones y autorizaciones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-IAM-27 Accesos de soporte de plataforma (T02:4128) |
| Portales | admin, plataforma, socio |
| Rutas | `/admin/iam/sod`, `/admin/iam/explicar`, `/admin/autorizaciones`, `/admin/plataforma/soporte/accesos` |
| Capabilities | `iam.sod.configurar`, `iam.permisos.explicar`, `iam.autorizaciones.bandeja`, `contextual` y 1 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > IAM > Accesos de soporte de p… [Rechazar] [Ver objeto] [Aprobar*] |
| Accesos de soporte de plataforma                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Plataform Solicitar Entrar co Finalizar Tenant    Pestañas  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Rechazar] [Ver objeto]          25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T02:4114, T02:4115, T02:4116, T02:4117, T02:4128): Columnas: Plataforma, Solicitar, Entrar como soporte, Finalizar, Tenant, Pestañas; Pestañas: Reglas, Conflictos actuales, Excepciones, Recertificación; Campos: Plataforma, Solicitar, Entrar como soporte, Finalizar, Tenant, Pestañas, Reglas, Conflictos actuales; Pasos: Resultado y traza de 11 pasos; Acciones: Aprobar, Rechazar, Ver objeto.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-IAM-13 | Segregación de funciones | PT-02 | `/admin/iam/sod` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Reglas, Conflictos actuales, Excepciones, Recertificación |
| PAN-IAM-14 | Explicador de permisos | PT-04 | `/admin/iam/explicar` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: elegir usuario + pantalla/capability + …, resultado y traza de 11 pasos |
| PAN-IAM-15 | Autorizaciones pendientes | PT-06 | `/admin/autorizaciones` | Usa PT-06 Bandeja de trabajo. Bandeja: pendientes que puedo decidir (acción, solicitante, importe, motivo, antigüedad, vencimiento), Mis… |
| PAN-IAM-16 | Autorización de supervisor | PT-11 | modal md | Usa PT-11 Modal, pestaña o componente embebido. Autorización de supervisor: resumen de la acción (capability en lenguaje natural, objeto, importe), motivo; pestañas… |
| PAN-IAM-27 | Accesos de soporte de plataforma | PT-01 | `/admin/plataforma/soporte/accesos` | Plataforma: solicitar, ver estado, entrar como soporte, finalizar. Tenant: aprobar/rechazar/acotar/revocar, ver… |

### FAM-IAM-04 Auditoría

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-IAM-17 Auditoría de cambios (T02:4118) |
| Portales | admin, plataforma |
| Rutas | `/admin/auditoria/cambios`, `/admin/auditoria/accesos`, `/admin/auditoria/lecturas`, `/admin/auditoria/mensajes` y 2 más |
| Capabilities | `iam.auditoria.cambios.ver`, `iam.auditoria.accesos.ver`, `iam.auditoria.lecturas.ver`, `iam.auditoria.mensajes.ver` y 2 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Auditoría de cambios        Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Fecha ▼]                                                                  |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Fecha      Actor      Módulo     Objeto     Operación  Resultado  [...]    |
| -----------------------------------------------------------------------    |
| dd-mm-yyyy ········   ········   ········   ········   ········    ...     |
| dd-mm-yyyy ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T02:4118, T02:4119, T02:4120, T02:4121, T02:4122, T02:4129): Filtros: Fecha; Columnas: Fecha, Actor, Módulo, Objeto, Operación, Resultado, Motivo, Autorización. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-IAM-17 | Auditoría de cambios | PT-05 | `/admin/auditoria/cambios` | Columnas: fecha, actor, módulo, objeto, operación, resultado, motivo, autorización, filtros, detalle en modal lg con… |
| PAN-IAM-18 | Auditoría de accesos | PT-05 | `/admin/auditoria/accesos` | Eventos de acceso: fecha, usuario, evento, método, resultado, IP, dispositivo, puesto; filtros por usuario y rango… |
| PAN-IAM-19 | Auditoría de lecturas sensibles y exportaciones | PT-05 | `/admin/auditoria/lecturas` | Lecturas sensibles, informes vistos, exportaciones (filas, archivo, hash, descargas) |
| PAN-IAM-20 | Auditoría de mensajes | PT-05 | `/admin/auditoria/mensajes` | Mensajes por canal, destinatario enmascarado, plantilla, objeto, estado, respuesta del proveedor; enlace al contenido… |
| PAN-IAM-21 | Auditoría de invocaciones de IA | PT-05 | `/admin/auditoria/ia` | Invocaciones de IA: función, modelo, usuario, confianza, señales, decisión humana, costo; detalle con entrada… |
| PAN-IAM-28 | Auditoría de plataforma | PT-05 | `/admin/plataforma/seguridad` | Auditoría de plataforma, alertas de seguridad (reconocer, resolver), integridad de cadenas por tenant, accesos de… |

### FAM-IAM-05 Políticas, SSO, API y accesos del portal

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-IAM-25 Accesos al portal (T02:4126) |
| Portales | admin, socio |
| Rutas | `/admin/iam/politicas`, `/admin/iam/sso`, `/admin/iam/api-clientes`, `/admin/iam/portal-usuarios` y 1 más |
| Capabilities | `iam.politicas.ver`, `iam.idp.configurar`, `iam.apiClientes.ver`, `iam.portal.usuarios.ver` y 2 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > I… [Reenviar verifica…] [Desvincular cuenta] [Bloquear/desbloque… |
| Accesos al portal                                                (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Persona   Documento Estado    Nivel de  Cuentas v MFA por r [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   [Activo]  ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   [Pendient ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   [Activo]  ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Reenviar verifica…] [Desvincul… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T02:4123, T02:4124, T02:4125, T02:4126, T02:4130, T02:4131): Filtros: Estado; Columnas: Persona, Documento enmascarado, Estado, Nivel de verificación, Cuentas vinculadas, MFA por rol; Campos: Persona, Documento enmascarado, Estado, Nivel de verificación, Cuentas vinculadas, MFA por rol, Para socios, Métodos permitidos; Acciones: Bloquear/desbloquear acceso, Reenviar verificación, Desvincular cuenta, Ver relaciones.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-IAM-22 | Políticas del tenant | PT-09 | `/admin/iam/politicas` | Usa PT-09 Configuración versionada. Políticas del tenant: MFA por rol y para socios, métodos permitidos, dispositivo confiable (días), contraseña… |
| PAN-IAM-23 | Proveedores de identidad (SSO) | PT-01 | `/admin/iam/sso` | Proveedores: alta OIDC (discovery URL, clientId, secreto a bóveda, scopes, mapeo, dominios, aceptar MFA del IdP… |
| PAN-IAM-24 | Clientes API | PT-04 | `/admin/iam/api-clientes` | Usa PT-04 Asistente por pasos o proceso masivo. Clientes API: nombre, responsable, scopes, estado, último uso, consumo; crear (wizard), ver secreto una vez, rotar… |
| PAN-IAM-25 | Accesos al portal | PT-01 | `/admin/iam/portal-usuarios` | Accesos al portal: persona, documento enmascarado, estado, nivel de verificación, cuentas vinculadas, último acceso… |
| PAN-IAM-29 | Sesiones activas del tenant | PT-01 | `/admin/iam/sesiones` | Sesiones activas del tenant: usuario, contexto, dispositivo, IP, inicio, último uso; cerrar sesión; cerrar todas de un… |
| PAN-IAM-30 | Indicador "X está editando" y modal de conflicto 409 | PT-11 | componente | Usa PT-11 Modal, pestaña o componente embebido. Indicador "X está editando" y modal de conflicto 409 con diff (mis cambios / actuales) y opciones Recargar / Reaplicar… |
