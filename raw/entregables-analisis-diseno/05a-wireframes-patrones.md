# Wireframes por patrón de UI

**Artefacto 4.2 (Wireframes). Parte 05a.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Catálogo de pantallas: [17-catalogo-pantallas/17-catalogo-pantallas.md](17-catalogo-pantallas/17-catalogo-pantallas.md).

Este documento define los 12 patrones base de UI con los que se construyen todas las pantallas (PAN) de la especificación. Los layouts, componentes y reglas salen de T03 §10.1 (MainLayouts), §10.2 (catálogo de componentes) y §10.3 (reglas UX, incluida la anatomía de `ListCard` y las reglas transversales de §10.3.2). Cada wireframe de familia (partes 05b en adelante) instancia uno de estos patrones con los campos y las acciones reales de la familia. Los símbolos son los de la sección 2.1 de `05`. Wireframes de baja fidelidad: no fijan diseño visual.

## Resumen de patrones

| Patrón | Nombre | Para qué | PAN | Familias con ese patrón base |
|---|---|---|---|---|
| PT-01 | Listado con filtros | Encontrar, filtrar y operar sobre muchos registros del mismo tipo. | 344 | 101 |
| PT-02 | Ficha o detalle con pestañas | Ver y operar un registro con todos sus datos relacionados. | 71 | 11 |
| PT-03 | Formulario o editor | Crear o editar un registro acotado. | 78 | 6 |
| PT-04 | Asistente por pasos o proceso masivo | Guiar un proceso de varios pasos o ejecutar un proceso masivo con seguimiento. | 85 | 9 |
| PT-05 | Tablero, reporte o mapa | Mostrar indicadores, reportes, gráficos o mapas para decidir. | 83 | 9 |
| PT-06 | Bandeja de trabajo | Trabajar una cola de pendientes asignados a una persona o equipo. | 66 | 9 |
| PT-07 | Portal del socio y del empleado (PWA) | Autogestión del socio o del empleado desde el teléfono (PWA). | 127 | 24 |
| PT-08 | App de campo móvil (offline) | Trabajo de campo con o sin conexión. | 20 | 4 |
| PT-09 | Configuración versionada | Mantener parámetros, reglas o tablas con versiones y vigencia. | 111 | 18 |
| PT-10 | Página pública (landing) | Informar y captar en el sitio público de la cooperativa, sin sesión. | 40 | 8 |
| PT-11 | Modal, pestaña o componente embebido | Mostrar un bloque reutilizable dentro de otra pantalla (pestaña, modal o tarjeta). | 16 | 2 |
| PT-12 | Pantalla completa de operación (POS, tótem, turnero) | Operar en pantalla completa en un puesto dedicado (POS, tótem, turnero, llamador). | 10 | 3 |

Criterio de asignación del patrón a cada PAN (script `pan_catalogo.py`): primero el portal (dispositivo y puestos de operación, PT-12; campo, PT-08; landing, PT-10; socio y empleado, PT-07); luego el tipo declarado en el anexo (M01 lo declara) y palabras clave del nombre y del contenido (por ejemplo "bandeja", "tablero", "asistente", "configuración", "ficha", "alta", "modal"); por defecto, PT-01. El patrón base de una familia es el más frecuente entre sus PAN.

## PT-01 Listado con filtros

**Propósito.** Encontrar, filtrar y operar sobre muchos registros del mismo tipo.

```text
+----------------------------------------------------------------------------+
| Inicio > Módulo > Título de la p… [Acción 2] [Acción 3] [Acción primaria*] |
| Título de la pantalla                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Sucursal ▼] [Período ▼] [Más filtros]      |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código       Nombre       Estado       Fecha        Importe      [...] |
| -------------------------------------------------------------------------- |
| [ ] ··········   ··········   [Activo]     dd-mm-yyyy   $ 0.000,00    ...  |
| [ ] ··········   ··········   [Pendiente]  dd-mm-yyyy   $ 0.000,00    ...  |
| [ ] ··········   ··········   [Activo]     dd-mm-yyyy   $ 0.000,00    ...  |
+----------------------------------------------------------------------------+
| N seleccionadas: [Acción masiva]                  25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Encabezado fijo (`AdminStickyHeader`) con migas, título, ayuda (`ScreenHelp`) y una sola acción primaria.
- Barra de filtros (`FilterBar`) arriba: búsqueda libre y hasta 4 filtros visibles; el resto en "Más filtros"; filtros activos como chips.
- Vistas guardadas (`SavedViewsMenu`) y exportación (`ExportMenu`) en la misma fila.
- Tabla (`DataTable`, RF-UXD-082): orden por columna, columnas configurables, paginación 25/50/100, fila completa clickeable que abre la ficha.
- La selección múltiple muestra `BulkActionBar` con las acciones masivas; las destructivas piden `ConfirmDialog`.
- El alta se abre en modal (T03 §10.3.2) salvo que requiera asistente.
- Carga: `SkeletonTable` de 8 filas. Vacío: `EmptyState` con la acción de alta. Fechas `dd-mm-yyyy` (RF-UXD-101).

**Componentes (T03 §10.2).** AdminShell, AdminStickyHeader, ScreenHelp, FilterBar, SavedViewsMenu, ExportMenu, DataTable, BulkActionBar, StatusBadge, ConfirmDialog, SkeletonTable, EmptyState.

**Uso.** 344 PAN; 101 familias lo tienen como patrón base. Ejemplos: PAN-PER-01 Búsqueda de titulares y cuentas, PAN-PER-03 Personas, PAN-PER-07 Inmuebles, PAN-PER-08 Puntos de prestación, PAN-PER-09 Relaciones y representaciones, PAN-PER-10 Adherentes y beneficiarios.

## PT-02 Ficha o detalle con pestañas

**Propósito.** Ver y operar un registro con todos sus datos relacionados.

```text
+----------------------------------------------------------------------------+
| Inicio > Módulo > Título de la pantalla                          (?) Ayuda |
| Título de la pantalla  [Activo]   [Acción 2] [Acción 3] [Acción primaria*] |
+----------------------------------------------------------------------------+
| Campo 1: ········        Campo 2: ········        Tipo: ········           |
| Fecha desde: ········    Importe: ········        Observaciones: ········  |
+----------------------------------------------------------------------------+
| Resumen | Detalle | Documentos | Historial                                 |
| =======                                                                    |
| Código       Nombre       Estado       Fecha        Importe      [...]     |
| ----------------------------------------------------------------------     |
| ··········   ··········   [Activo]     dd-mm-yyyy   $ 0.000,00    ...      |
| ··········   ··········   [Pendiente]  dd-mm-yyyy   $ 0.000,00    ...      |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Encabezado con identificación, insignia de estado (`StatusBadge`, siempre ícono más texto, RF-UXD-091) y acciones del registro.
- Bloque de datos clave (`KeyValueGrid`) en 2 o 3 columnas, sin edición en línea salvo campos simples.
- Pestañas de texto con línea inferior (`TabsLine`, RF-UXD-105); cada pestaña es una vista con ruta `?tab=`.
- Las tablas internas siguen PT-01 en versión compacta; las altas internas se abren en modal (PT-03).
- Línea de tiempo (`Timeline`) con eventos y auditoría al pie o en una pestaña "Historial".
- Layout `EntityDetailLayout`; en pantallas angostas las pestañas se convierten en desplegable.

**Componentes (T03 §10.2).** EntityDetailLayout, AdminStickyHeader, StatusBadge, KeyValueGrid, TabsLine, DataTable, Timeline, Modal, ConfirmDialog.

**Uso.** 71 PAN; 11 familias lo tienen como patrón base. Ejemplos: PAN-PER-02 Ficha 360 del titular, PAN-PER-05 Cuenta, PAN-CAT-14 Ficha del contrato por bloques, PAN-MED-12 Consumos del servicio, PAN-TAR-12 Regímenes, padrones e inscripciones, PAN-TAR-17 Explicación técnica de un cálculo.

## PT-03 Formulario o editor

**Propósito.** Crear o editar un registro acotado.

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Título de la pantalla                         [x] |
+----------------------------------------------------------------------+
| Campo 1 * [________________________]                                 |
| Campo 2 * [________________________]                                 |
| Tipo   [____________________ ▼]                                      |
| Fecha desde   [dd-mm-yyyy]                                           |
| Importe   [$ __________]                                             |
| Observaciones   [________________________]                           |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
| [Acción 2] [Acción 3]                  [Cancelar] [Acción primaria*] |
+----------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Por defecto en modal (`Modal` sm 480, md 720, lg 960 o xl 1180 px) según la cantidad de campos; página completa solo si supera dos secciones largas.
- Campos con `FormField`: rótulo arriba, obligatorio con asterisco, ayuda breve y error debajo; máscaras con `MaskedInput`, importes con `MoneyInput`, fechas con `DateRange`.
- Selección de entidades con `EntityPicker` y domicilios con `AddressPicker`.
- Al confirmar con errores, `FormErrorSummary` arriba con enlaces a cada campo.
- Pie con "Cancelar" y una sola acción primaria a la derecha; el modal no se cierra al hacer clic afuera si hay cambios.

**Componentes (T03 §10.2).** Modal, FormField, FormErrorSummary, MaskedInput, MoneyInput, DateRange, EntityPicker, AddressPicker, ConfirmDialog.

**Uso.** 78 PAN; 6 familias lo tienen como patrón base. Ejemplos: PAN-PER-04 Alta y edición de persona, PAN-PER-06 Editor de domicilio con mapa, PAN-PER-16 Registrar fallecimiento, PAN-PER-17 Baja y reactivación de titular, PAN-PER-21 Operaciones especiales, PAN-PER-22 Configuración del módulo.

## PT-04 Asistente por pasos o proceso masivo

**Propósito.** Guiar un proceso de varios pasos o ejecutar un proceso masivo con seguimiento.

```text
+----------------------------------------------------------------------------+
| Título de la pantalla                                           [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Datos ── (2) Validación ── (3) Previsualización ── (4) Confirmación    |
|                                                                            |
| Paso 2 de 4: Validación                                                    |
|   Campo 1                         [______________________]                 |
|   Campo 2                         [______________________]                 |
|   Tipo                            [______________________]                 |
|   Fecha desde                     [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                           [Guardar borrador] [Acción primaria*] |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- `Stepper` horizontal con los pasos nombrados; se puede volver a pasos anteriores sin perder datos.
- Cada paso valida antes de avanzar; el último paso muestra un resumen y la confirmación.
- Los procesos largos se ejecutan en segundo plano con `JobProgress` (porcentaje, procesados, errores) y aviso al terminar.
- Importaciones con `ExcelImportWizard`: archivo, mapeo de columnas, validación, previsualización y aplicación.
- Resultado descargable con los errores por fila; los procesos que afectan saldos o comprobantes piden aprobación (`ApprovalBar`).

**Componentes (T03 §10.2).** Stepper, JobProgress, ExcelImportWizard, FormField, ApprovalBar, ConfirmDialog, IntegrationStatus.

**Uso.** 85 PAN; 9 familias lo tienen como patrón base. Ejemplos: PAN-PER-14 Asistente de transferencia, PAN-PER-24 Importación, PAN-CAT-15 Asistente de alta, PAN-CAT-18 Asistente de copia, PAN-MED-04 Asistente de instalación, retiro y cambio de medidor, PAN-MED-07 Lotes de lectura.

## PT-05 Tablero, reporte o mapa

**Propósito.** Mostrar indicadores, reportes, gráficos o mapas para decidir.

```text
+----------------------------------------------------------------------------+
| Título de la pantalla       Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Estado ▼] [Sucursal ▼] [Período ▼]                                        |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Código       Nombre       Estado       Fecha        Importe      [...]     |
| ----------------------------------------------------------------------     |
| ··········   ··········   [Activo]     dd-mm-yyyy   $ 0.000,00    ...      |
| ··········   ··········   [Pendiente]  dd-mm-yyyy   $ 0.000,00    ...      |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Barra de filtros analíticos (`BiFilterBar`) con período (`DateRange`) y dimensiones; los filtros se comparten por URL.
- Fila de indicadores (`BiKpiGrid` y `KpiCard`) con valor, variación y enlace al detalle.
- Gráficos y mapas en grilla de 2 columnas; cada gráfico tiene tabla alternativa accesible.
- Tabla de detalle al pie (PT-01 compacta) y exportación (`ExportMenu`) en XLSX, CSV o PDF.
- Los reportes pesados se ejecutan en segundo plano (`JobProgress`) y se notifican.

**Componentes (T03 §10.2).** BiFilterBar, BiKpiGrid, KpiCard, gráficos, DataTable, ExportMenu, DateRange, JobProgress.

**Uso.** 83 PAN; 9 familias lo tienen como patrón base. Ejemplos: PAN-PER-28 Mapa de domicilios y puntos, PAN-CAT-24 Tablero de servicios, PAN-MED-22 Informes y controles de consumo, PAN-MED-26 Contratos GD y balances, PAN-MED-27 Tablero de lecturas y consumos, PAN-FAC-01 Tablero de facturación.

## PT-06 Bandeja de trabajo

**Propósito.** Trabajar una cola de pendientes asignados a una persona o equipo.

```text
+----------------------------------------------------------------------------+
| Bandeja: Título de la pantalla                          [Acción primaria*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Estado ▼] [Sucursal ▼] |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Código · Nombre ·… | | Campo 1: ········                     | |
| | [SLA 2 h] Código · Nombre ·… | | Campo 2: ········                     | |
| | [SLA 2 h] Código · Nombre ·… | | Tipo: ········                        | |
| | ...                          | | Fecha desde: ········                 | |
| |                              | | Importe: ········                     | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Acción 2] [Acción 3]                 | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Contadores por vista arriba (mías, equipo, vencidas, sin asignar) y filtros rápidos.
- Dos paneles: lista a la izquierda con SLA y prioridad; detalle a la derecha con datos, línea de tiempo y acciones.
- Acciones de flujo (tomar, asignar, derivar, resolver, aprobar o rechazar) con motivo obligatorio cuando corresponde.
- La lista se actualiza sin recargar; el ítem resuelto sale de la vista con opción de deshacer durante 6 s.
- Selección múltiple para asignar o derivar en lote (`BulkActionBar`).

**Componentes (T03 §10.2).** FilterBar, DataTable o lista, StatusBadge, Timeline, ApprovalBar, BulkActionBar, ConfirmDialog.

**Uso.** 66 PAN; 9 familias lo tienen como patrón base. Ejemplos: PAN-PER-18 Duplicados y fusión, PAN-PER-23 Privacidad y derechos, PAN-CAT-19 Equipos en comodato, PAN-MED-06 Cronograma de lectura, PAN-MED-11 Bandeja de excepciones de consumo, PAN-MED-25 Prepago: cuentas, recargas y conciliación.

## PT-07 Portal del socio y del empleado (PWA)

**Propósito.** Autogestión del socio o del empleado desde el teléfono (PWA).

```text
+------------------------------------------------------------+
| < Título de la pantalla                                (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| Resumen | Detalle | Documentos | Historial                 |
| =======                                                    |
| +--------------------------------------------------------+ |
| | Campo 1: ········                                      | |
| | Campo 2: ········                                      | |
| | Tipo: ········                                         | |
| | Fecha desde: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Campo 1: ········                                      | |
| | Campo 2: ········                                      | |
| | Tipo: ········                                         | |
| | Fecha desde: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                   Acción primaria                   * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- `AppShell` con barra superior (marca, cuenta activa, notificaciones), banners de estado y barra inferior (tabbar) de 5 posiciones con FAB `( + )` central (T03 RF-UXD-066; M19 §10.1).
- Tabbar por espacio: socio, Inicio · Cuentas y servicios · `( + )` · Gestiones · Comunidad, con Perfil desde el avatar de la topbar y FAB = Pagar por defecto (PA-POR-20, RF-POR-180; Comunidad abre PAN-POR-105 `/app/comunidad`); empleado, Inicio · Recibos · `( + )` · Solicitudes · Perfil; registrado sin cuenta, Inicio · Contratar · `( + )` · Gestiones · Perfil. La acción del FAB cambia por pantalla (`useCreateAction`).
- Ancho de referencia 430 px (`PhoneShell`); en escritorio se centra la columna.
- Contenido en tarjetas (`ListCard`): título, 2 a 4 datos, insignia de estado y chevron hacia el detalle.
- Una sola acción primaria por pantalla, de ancho completo y al pie (T03 §10.3.2).
- Diálogos como hoja inferior (`PwaModal`); estados vacíos con acción; sin tablas anchas.

**Componentes (T03 §10.2).** AppShell, PhoneShell, ListCard, PwaModal, StatusBadge, OfflineBanner, EmptyState.

**Uso.** 127 PAN; 24 familias lo tienen como patrón base. Ejemplos: PAN-PER-25 PWA "Mis datos", PAN-PER-26 PWA "Vincular cuenta", PAN-PER-27 PWA "Autorizados y representantes", PAN-CAT-21 Oferta del tenant (componente embebido en PAN-POR-31), PAN-CAT-22 Mis servicios (componente embebido en PAN-POR-29 y PAN-POR-30), PAN-MED-31 Mis consumos.

## PT-08 App de campo móvil (offline)

**Propósito.** Trabajo de campo con o sin conexión.

```text
+------------------------------------------------------------+
| Sin conexión · N cambios pendientes [Sincronizar]          |
+------------------------------------------------------------+
| Título de la pantalla                               Sincr. |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Campo 1: ········                                      | |
| | Campo 2: ········                                      | |
| | Tipo: ········                                         | |
| | Fecha desde: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Campo 1: ········                                      | |
| | Campo 2: ········                                      | |
| | Tipo: ········                                         | |
| | Fecha desde: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [Cámara] [Firma] [Escanear]                                |
|                                                      ( + ) |
| [                   Acción primaria                   * ]  |
+------------------------------------------------------------+
| Hoy | Órdenes | (+) | Stock en vehículo | Sincronización   |
+------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- `AppShell` de campo con `OfflineBanner` fijo que muestra cambios pendientes y botón de sincronizar.
- Lista del día en tarjetas grandes, ordenadas por franja; acción de navegar con la app de mapas del dispositivo.
- Captura de evidencia con `CameraCapture`, firma con `SignaturePad` y lectura de códigos.
- Botón flotante (FAB) central para la acción principal; tabbar Hoy · Órdenes, Rutas o Cobranza según el rol · `( + )` · Stock en vehículo · Sincronización (T03 RF-UXD-066, maestro §9.3).
- Toda acción se guarda local y se sincroniza con resolución de conflictos; nada se pierde sin conexión.

**Componentes (T03 §10.2).** AppShell, OfflineBanner, ListCard, CameraCapture, SignaturePad, PwaModal, StatusBadge.

**Uso.** 20 PAN; 4 familias lo tienen como patrón base. Ejemplos: PAN-MED-28 Mis rutas de lectura, PAN-MED-29 Captura de lectura, PAN-MED-30 Cola de sincronización de lecturas (absorbida por PAN-TEC-53), PAN-COB-29 PWA del cobrador, PAN-TEC-60 Shell de campo, PAN-TEC-50 Mi día.

## PT-09 Configuración versionada

**Propósito.** Mantener parámetros, reglas o tablas con versiones y vigencia.

```text
+----------------------------------------------------------------------------+
| Título de la pantalla                                            (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]             [Acción primaria*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Resumen            | | Campo 1 [______________]                      | |
| | > Detalle            | | Campo 2 [______________]                      | |
| | > Documentos         | | Tipo [______________]                         | |
| | > Historial          | | Fecha desde [______________]                  | |
| |                      | | Importe [______________]                      | |
| |                      | | Observaciones [______________]                | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Selector de versión con estado (borrador, vigente, histórica) y fecha de vigencia.
- Panel izquierdo de secciones y panel derecho de edición; los cambios se hacen siempre sobre un borrador.
- Comparación de versiones, historial y duplicado de la vigente.
- Publicar es la acción primaria y requiere aprobación cuando el parámetro es sensible (`ApprovalBar`, doble control).
- Las tablas de parámetros siguen PT-01 compacta con alta en modal.

**Componentes (T03 §10.2).** AdminStickyHeader, TabsLine, FormField, DataTable, ApprovalBar, Timeline, ConfirmDialog.

**Uso.** 111 PAN; 18 familias lo tienen como patrón base. Ejemplos: PAN-CAT-01 Catálogo global de capacidades, PAN-CAT-04 Ficha de configuración del servicio en pestañas, PAN-CAT-06 Productos/subservicios y conceptos facturables por servicio, PAN-CAT-11 Reglas de altas automáticas, PAN-CAT-12 Conceptos por evento y bonificaciones de conexión, PAN-MED-01 Catálogos de medición.

## PT-10 Página pública (landing)

**Propósito.** Informar y captar en el sitio público de la cooperativa, sin sesión.

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Título de la pantalla                                                |
| [Acción primaria*]   [Acción 2]                                            |
+----------------------------------------------------------------------------+
| [ Campo 1 ]  [ Campo 2 ]  [ Tipo ]  [ Fecha desde ]  [ Importe ]           |
| [ Observaciones ]                                                          |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- `LandingLayout` con encabezado de marca de la cooperativa, navegación principal y botón "Ingresar".
- Bloque principal (hero) con mensaje y acción; secciones en tarjetas; pie con legales y accesibilidad.
- Rutas sin prefijo de tenant (AL-06): la cooperativa se resuelve por dominio.
- Formularios públicos cortos con verificación anti-abuso y confirmación por correo o SMS.
- Contenido editable desde la administración del portal; textos del diccionario.

**Componentes (T03 §10.2).** LandingLayout, FormField, ListCard, EmptyState.

**Uso.** 40 PAN; 8 familias lo tienen como patrón base. Ejemplos: PAN-CAT-23 Catálogo público de servicios (componente embebido en PAN-POR-02 y PAN-POR-03), PAN-TAR-24 Cuadros tarifarios públicos, PAN-FAC-45 Consulta de factura sin login, PAN-COB-35 Mi cuenta y pagar (socio), PAN-CRM-25 Pantalla pública de turnos, PAN-VEN-05 Aceptación online del presupuesto.

## PT-11 Modal, pestaña o componente embebido

**Propósito.** Mostrar un bloque reutilizable dentro de otra pantalla (pestaña, modal o tarjeta).

```text
+----------------------------------------------------------------------------+
| Pantalla anfitriona: PAN anfitriona                                        |
+----------------------------------------------------------------------------+
| +-- Título de la pantalla (componente)                                     |
| |  Campo 1: ········                                                       |
| |  Campo 2: ········                                                       |
| |  Tipo: ········                                                          |
| |  Fecha desde: ········                                                   |
| |  Importe: ········                                                       |
| |  [Acción primaria] [Acción 2] [Acción 3]                                 |
| +--------------------------------------------------                        |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- No tiene ítem propio en el mapa del sitio (AL-07): se abre desde la pantalla anfitriona.
- Respeta el ancho del contenedor; en modal usa los tamaños estándar.
- Las acciones del componente no cambian de pantalla: cierran el modal o refrescan la pestaña.
- Cuando el componente se usa en varias apps, mantiene datos y acciones y adapta la presentación (tabla en admin, tarjeta en PWA).

**Componentes (T03 §10.2).** Modal, TabsLine, KeyValueGrid, DataTable, ListCard.

**Uso.** 16 PAN; 2 familias lo tienen como patrón base. Ejemplos: PAN-PER-11 Notas, PAN-PER-12 Bloqueos, PAN-PER-19 Historial, PAN-CAT-16 Transiciones, PAN-CAT-25 Declaración jurada de artefactos por servicio, PAN-FAC-12 Replicar comprobante.

## PT-12 Pantalla completa de operación (POS, tótem, turnero)

**Propósito.** Operar en pantalla completa en un puesto dedicado (POS, tótem, turnero, llamador).

```text
+----------------------------------------------------------------------------+
| Título de la pantalla  (pantalla completa)        dd-mm-yyyy hh:mm [Salir] |
+----------------------------------------------------------------------------+
| +--------------------+  +--------------------+  +--------------------+     |
| |     SECCIÓN 1      |  |     SECCIÓN 2      |  |     SECCIÓN 3      |     |
| +--------------------+  +--------------------+  +--------------------+     |
+----------------------------------------------------------------------------+
| Número / total: ######                       [Cancelar] [Acción primaria*] |
+----------------------------------------------------------------------------+
```

**Reglas de layout (T03 §10.1 y §10.3).**

- Sin menú lateral; encabezado mínimo con hora, puesto y salida.
- Botones grandes y tipografía amplia para uso táctil o a distancia; el tamaño exacto lo fija el design system.
- Flujo corto; en el tótem, vuelta al inicio por inactividad (M19).
- Impresión o emisión de comprobante o número al final del flujo.

**Componentes (T03 §10.2).** shell de pantalla completa (sin AdminShell), botones grandes, Modal, ConfirmDialog, StatusBadge.

**Uso.** 10 PAN; 3 familias lo tienen como patrón base. Ejemplos: PAN-COB-10 Cobro en ventanilla, PAN-CRM-24 Consola de box, PAN-CRM-26 Tótem de autoservicio, PAN-VEN-10 Venta rápida / POS, PAN-POR-78 Tótem: inicio, PAN-POR-79 Tótem: identificación.

## Relación con los wireframes detallados del piloto

Los 17 wireframes de `05` (W-01 a W-17) son instancias detalladas de estos patrones para el flujo de Internet de la piloto:

| Wireframe | Pantalla | PAN principal | Patrón | Familia |
|---|---|---|---|---|
| W-01 | Login y selección de espacio | PAN-UXD-13 | PT-10 | FAM-UXD-04 |
| W-02 | Layout general del admin | PAN-UXD-04 | PT-11 | FAM-UXD-02 |
| W-03 | Ficha 360 del titular | PAN-PER-02 | PT-02 | FAM-PER-01 |
| W-04 | Alta de contrato de servicio | PAN-CAT-15 | PT-04 | FAM-CAT-04 |
| W-05 | Listado de comprobantes | PAN-FAC-09 | PT-01 | FAM-FAC-03 |
| W-06 | Revisión previa del lote | PAN-FAC-07 | PT-04 | FAM-FAC-02 |
| W-07 | Cobro en ventanilla | PAN-COB-10 | PT-12 | FAM-COB-02 |
| W-08 | Bandeja de reclamos y casos | PAN-CRM-02 | PT-06 | FAM-CRM-01 |
| W-09 | Ficha de orden de trabajo | PAN-TEC-05 | PT-02 | FAM-TEC-02 |
| W-10 | Configuración del servicio | PAN-CAT-04 | PT-09 | FAM-CAT-02 |
| W-11 | Inicio con saldo | PAN-POR-25 | PT-07 | FAM-POR-05 |
| W-12 | Detalle de factura | PAN-POR-39 | PT-07 | FAM-POR-07 |
| W-13 | Pagar y resultado del pago | PAN-POR-40 | PT-07 | FAM-POR-07 |
| W-14 | Nueva gestión o reclamo | PAN-POR-51 | PT-07 | FAM-POR-06 |
| W-15 | Vincular cuenta con código | PAN-POR-27 | PT-07 | FAM-POR-05 |
| W-16 | Mi día: agenda de OT | PAN-TEC-50 | PT-08 | FAM-TEC-09 |
| W-17 | Ejecución y cierre de OT | PAN-TEC-51 | PT-08 | FAM-TEC-09 |

## Inconsistencias detectadas en la especificación

No se corrigieron en `docs/especificacion/` (regla 1); el detalle por PAN está en la sección 5 del índice del catálogo y al final de cada parte del catálogo.

- Numeración de comunidad: resuelta en T03 (AL-11). T03 §10.8 y §10.9 usan los IDs de T09 (PAN-COM-40 a 53 en la PWA); las citas anteriores a PAN-COM-30 a 39 quedan solo en T03 §10.9.13 y no se cuentan como pantallas de ningún ítem.
- Rangos de PAN del plan de olas frente a los definidos: coinciden en todos los módulos (el plan se corrigió el 05-11-2026).
- El rótulo "Cuentas y servicios" de la tabbar del socio (M19 §10.1, T03 RF-UXD-066) tiene 19 caracteres, y T03 RN-UXD-006 y RF-UXD-145 limitan la variante corta de tabbar a 12; la especificación no fija la variante corta de `dict:nav.pws.servicios`. Los wireframes muestran el rótulo completo.
- T03 §10.6 indica para PAN-UXD-16 la capability `iam.directorio.ver` "pendiente de alta en T02", pero T02 §4.4.2 ya la registra.
- El plan de olas (`03-plan-de-olas-y-prompts.md`, cierre de rangos) mantiene en un párrafo "PAN-POR-01..104", mientras que la fila de M19 en O2 ya dice PAN-POR-01..105 (PAN-POR-105 Comunidad).
- PAN-POR-105 se define en una tabla de M19 §10 sin columna de nombre; el catálogo la nombra "Comunidad" (destino de la tabbar, RF-POR-180). En M19 §10 la tabla de integración por PAN (PAN-POR-69 a 74, que incrustan PAN-SUE-41 a 46) aparece antes que la tabla principal; el catálogo toma la fila de la tabla principal, que declara la capability.
- PAN sin ruta ni forma de apertura: ninguna. PAN sin capability ni regla de acceso: ninguna.
- 385 PAN no detallan campos ni acciones en el anexo (solo propósito): sus wireframes de familia usan los elementos genéricos del patrón y lo indican.
