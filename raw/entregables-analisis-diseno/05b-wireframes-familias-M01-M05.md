# Wireframes por familia de pantallas: M01 a M05

**Artefacto 4.2 (Wireframes). Parte 05b.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: M01 PER, M02 CAT, M03 MED, M04 TAR, M05 FAC (32 familias).

## M01 PER: Personas, titulares y cuentas

Anexo `docs/especificacion/anexos/M01-PER-personas-titulares-cuentas.md`, §10. 5 familias, 28 PAN. Catálogo: [17-01-M01-PER.md](17-catalogo-pantallas/17-01-M01-PER.md).

### FAM-PER-01 Búsqueda y ficha 360 del titular

| Dato | Valor |
|---|---|
| Patrón base | PT-11 Modal, pestaña o componente embebido ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PER-11 Notas (M01:1387) |
| Portales | admin |
| Rutas | `/admin/per/titulares`, `/admin/per/titulares/:holderId`, `/admin/per/cuentas/:accountId` |
| Capabilities | `per.titulares.ver`, `per.cuentas.ver`, `per.notas.ver`, `per.bloqueos.ver` y 3 más |
| Olas | O2 |
| Wireframe detallado del piloto | W-03 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Pantalla anfitriona: ficha o tablero del módulo                            |
+----------------------------------------------------------------------------+
| +-- Notas (componente)                                                     |
| |  Nombre: ········                                                        |
| |  Número de titular: ········                                             |
| |  Documento y CUIT con estado de verifica…: ········                      |
| |  Condición de asociado: ········                                         |
| |  Estado: ········                                                        |
| |  [Alta de titular] [Abrir ficha] [Exportar]                              |
| +--------------------------------------------------                        |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M01:1377, M01:1378, M01:1381, M01:1387, M01:1388, M01:1392): Filtros: Texto libre, Estado, Condición de asociado, Localidad, Barrio, Zona/sector/recorrido; Columnas: Número de titular, Nombre, Documento principal, Cuenta principal, Domicilio postal, Estado, Asociado, Contratos activos; Pestañas: Resumen, Cuentas y contratos, Inmuebles y puntos, Relaciones, Adherentes, Cuenta corriente, Facturas; Campos: Nombre, Número de titular, Documento y CUIT con estado de verificación, Condición de asociado, Estado, Chips de alertas, Número de cuenta, Titular, Principal, Alertas; Acciones: Alta de titular, Abrir ficha, Exportar, Vista simple/completa, Editar, Nueva cuenta, Nueva nota, Aplicar bloqueo, Transferir, Registrar fallecimiento.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PER-01 | Búsqueda de titulares y cuentas | PT-01 | `/admin/per/titulares` | Usa PT-01 Listado con filtros. Filtros: texto libre, estado, condición de asociado, localidad, barrio, zona/sector/recorrido, distrito/sección… |
| PAN-PER-02 | Ficha 360 del titular | PT-02 | `/admin/per/titulares/:holderId` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Resumen, Cuentas y contratos, Inmuebles y puntos, Relaciones, Adherentes, Cuenta corriente, Facturas… |
| PAN-PER-05 | Cuenta | PT-02 | `/admin/per/cuentas/:accountId` | Usa PT-02 Ficha o detalle con pestañas. Campos: número de cuenta, titular, principal, estado, alertas |
| PAN-PER-11 | Notas | PT-11 | Pestaña + modal md | Notas |
| PAN-PER-12 | Bloqueos | PT-11 | Pestaña + modal md | Bloqueos |
| PAN-PER-16 | Registrar fallecimiento | PT-03 | Modal md | Usa PT-03 Formulario o editor. Registrar fallecimiento |
| PAN-PER-17 | Baja y reactivación de titular | PT-03 | Modal md | Usa PT-03 Formulario o editor. Baja y reactivación de titular |
| PAN-PER-19 | Historial | PT-11 | Pestaña "Historia" + modal xl comparador | Historial |

### FAM-PER-02 Personas, domicilios, inmuebles y puntos de suministro

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PER-07 Inmuebles (M01:1383) |
| Portales | admin |
| Rutas | `/admin/per/personas`, `/admin/per/inmuebles`, `/admin/per/puntos`, `/admin/per/mapa` |
| Capabilities | `per.personas.ver`, `per.personas.crear`, `per.personas.editar`, `per.inmuebles.ver` y 1 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > PER > Inmuebles                       [Abrir] [Exportar] [Nuevo*] |
| Inmuebles                                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Domicilio Domicilio Catastro  Construcc Superfici Frentes   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M01:1379, M01:1380, M01:1382, M01:1383, M01:1384, M01:1404): Columnas: Domicilio, Domicilio postal del propietario, Catastro, Construcción, Superficies, Frentes; Campos: Domicilio, Domicilio postal del propietario, Catastro, Construcción, Superficies, Frentes, Bocacalle, Coeficientes, Metros de alumbrado, Cloaca. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PER-03 | Personas | PT-01 | `/admin/per/personas` | Personas |
| PAN-PER-04 | Alta y edición de persona | PT-03 | Modal lg | Usa PT-03 Formulario o editor. Campos: tipo de persona, identificación, datos personales o de organización, contactos, domicilios por rol, datos… |
| PAN-PER-06 | Editor de domicilio con mapa | PT-03 | Componente + modal lg | Usa PT-03 Formulario o editor. Campos: país, provincia, departamento, localidad, calle con autocompletado, número o "sin número", piso, departamento… |
| PAN-PER-07 | Inmuebles | PT-01 | `/admin/per/inmuebles` | Campos: domicilio, domicilio postal del propietario, catastro, construcción, superficies, frentes, bocacalle… |
| PAN-PER-08 | Puntos de prestación | PT-01 | `/admin/per/puntos` | Puntos de prestación |
| PAN-PER-28 | Mapa de domicilios y puntos | PT-05 | `/admin/per/mapa` | Usa PT-05 Tablero, reporte o mapa. Mapa de domicilios y puntos |

### FAM-PER-03 Relaciones, documentación y transferencias

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PER-09 Relaciones y representaciones (M01:1385) |
| Portales | admin |
| Rutas | `/admin/per/titulares/:holderId?tab=relaciones`, `/admin/per/titulares/:holderId?tab=adherentes`, `/admin/per/documentacion`, `/admin/per/transferencias/nueva` y 1 más |
| Capabilities | `per.relaciones.ver`, `soc.adherentes.ver`, `per.documentacion.ver`, `per.transferencias.crear` y 1 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > PER > Relaciones y representaciones   [Abrir] [Exportar] [Nuevo*] |
| Relaciones y representaciones                                    (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Fecha ▼] [Más filtros]                     |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Identificaci Descripción  Estado       Fecha        Responsable  [...] |
| -------------------------------------------------------------------------- |
| [ ] ··········   ··········   [Activo]     dd-mm-yyyy   ··········    ...  |
| [ ] ··········   ··········   [Pendiente]  dd-mm-yyyy   ··········    ...  |
| [ ] ··········   ··········   [Activo]     dd-mm-yyyy   ··········    ...  |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M01:1385, M01:1386, M01:1389, M01:1390, M01:1391, M01:1454): Pasos: Tipo, Origen y elementos, Destino, Opciones, Simulación, Confirmación. El anexo no detalla columnas y campos ni acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PER-09 | Relaciones y representaciones | PT-01 | `/admin/per/titulares/:holderId?tab=relaciones` | Relaciones y representaciones |
| PAN-PER-10 | Adherentes y beneficiarios | PT-01 | `/admin/per/titulares/:holderId?tab=adherentes` | Adherentes y beneficiarios |
| PAN-PER-13 | Documentación y requisitos | PT-01 | `/admin/per/documentacion` | Documentación y requisitos |
| PAN-PER-14 | Asistente de transferencia | PT-04 | `/admin/per/transferencias/nueva` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: Tipo, Origen y elementos, Destino, Opciones, Simulación, Confirmación |
| PAN-PER-15 | Transferencias | PT-01 | `/admin/per/transferencias` | Transferencias |

### FAM-PER-04 Calidad de datos, padrón, privacidad y configuración

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PER-18 Duplicados y fusión (M01:1394) |
| Portales | admin |
| Rutas | `/admin/per/duplicados`, `/admin/per/padron`, `/admin/per/operaciones-especiales`, `/admin/per/configuracion` y 2 más |
| Capabilities | `per.duplicados.ver`, `per.padron.ver`, `per.operacionesEspeciales.ejecutar`, `per.configuracion.configurar` y 2 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Duplicados y fusión                                   [Resolver*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Estado ▼] [Fecha ▼]    |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Identi… · Descri…… | | Identificación: ········              | |
| | [SLA 2 h] Identi… · Descri…… | | Descripción: ········                 | |
| | [SLA 2 h] Identi… · Descri…… | | Tipo: ········                        | |
| | ...                          | | Fecha desde: ········                 | |
| |                              | | Observaciones: ········               | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Tomar] [Asignar] [Derivar]           | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M01:1394, M01:1396, M01:1397, M01:1398, M01:1399, M01:1400): sin detalle. El anexo no detalla columnas y campos ni acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PER-18 | Duplicados y fusión | PT-06 | `/admin/per/duplicados` | Duplicados y fusión |
| PAN-PER-20 | Padrón de titulares | PT-01 | `/admin/per/padron` | Usa PT-01 Listado con filtros. Padrón de titulares |
| PAN-PER-21 | Operaciones especiales | PT-03 | `/admin/per/operaciones-especiales` | Usa PT-03 Formulario o editor. Operaciones especiales |
| PAN-PER-22 | Configuración del módulo | PT-03 | `/admin/per/configuracion` | Usa PT-03 Formulario o editor. Configuración del módulo |
| PAN-PER-23 | Privacidad y derechos | PT-06 | `/admin/per/privacidad` | Privacidad y derechos |
| PAN-PER-24 | Importación | PT-04 | `/admin/per/importar` | Usa PT-04 Asistente por pasos o proceso masivo. Importación |

### FAM-PER-05 Autogestión del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-PER-25 PWA "Mis datos" (M01:1401) |
| Portales | socio |
| Rutas | `/app/mis-datos`, `/app/vincular`, `/app/autorizados` |
| Capabilities | `per.me.ver`, `per.me.vincular`, `per.me.autorizados.gestionar` |
| Olas | O2 |

```text
+------------------------------------------------------------+
| < PWA "Mis datos"                                      (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Tarjetas con anatomía fija : identidad: ········       | |
| | Contactos: ········                                    | |
| | Domicilio postal: ········                             | |
| | Preferencias de comunicación: ········                 | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Tarjetas con anatomía fija : identidad: ········       | |
| | Contactos: ········                                    | |
| | Domicilio postal: ········                             | |
| | Preferencias de comunicación: ········                 | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M01:1401, M01:1402, M01:1403, M01:1462): Campos: Tarjetas con anatomía fija : identidad, Contactos, Domicilio postal, Preferencias de comunicación, Consentimientos, "Descargar mis datos". El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-PER-25 | PWA "Mis datos" | PT-07 | `/app/mis-datos` | Campos: tarjetas con anatomía fija : identidad, contactos, domicilio postal, preferencias de comunicación… |
| PAN-PER-26 | PWA "Vincular cuenta" | PT-07 | `/app/vincular` | PWA "Vincular cuenta" |
| PAN-PER-27 | PWA "Autorizados y representantes" | PT-07 | `/app/autorizados` | PWA "Autorizados y representantes" |

## M02 CAT: Catálogo de servicios

Anexo `docs/especificacion/anexos/M02-CAT-catalogo-servicios.md`, §10. 6 familias, 27 PAN. Catálogo: [17-02-M02-CAT.md](17-catalogo-pantallas/17-02-M02-CAT.md).

### FAM-CAT-01 Capacidades de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-02 Habilitación de capacidades por tenant (M02:1429) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/cat/capabilities`, `/admin/plataforma/cat/enablement` |
| Capabilities | `cat.capacidades.ver`, `cat.habilitacion.ver` |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > CAT > Habilitación de capacidades por…  [Habilitar/deshabilitar*] |
| Habilitación de capacidades por tenant                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Tipos de cálculo ▼] [Más filtros]          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Dominio   Estado    Madurez   Perfiles  Tipos de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   [Activo]  ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   [Pendient ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   [Activo]  ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar]                       25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1428, M02:1429): Filtros: Estado, Tipos de cálculo; Columnas: Código, Dominio, Estado, Madurez, Perfiles, Tipos de cálculo, Tenants que la usan; Acciones: Habilitar/deshabilitar, Crear, Deprecar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-01 | Catálogo global de capacidades | PT-09 | `/admin/plataforma/cat/capabilities` | Usa PT-09 Configuración versionada. Columnas: código, dominio, estado, madurez, perfiles, tipos de cálculo, tenants que la usan |
| PAN-CAT-02 | Habilitación de capacidades por tenant | PT-01 | `/admin/plataforma/cat/enablement` | Matriz tenants × capacidades (CU-CAT-01) con estado, fechas, licencia. Acciones: habilitar/deshabilitar (modal md con… |

### FAM-CAT-02 Servicios, versiones y tablero del catálogo

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-03 Servicios del tenant (M02:1430) |
| Portales | admin |
| Rutas | `/admin/cat/services`, `/admin/cat/services/:id`, `/admin/cat/services/:id/versions`, `/admin/cat/statuses` y 2 más |
| Capabilities | `cat.servicios.ver`, `cat.servicios.configurar`, `cat.versiones.crear`, `cat.estados.configurar` |
| Olas | O2 |
| Wireframe detallado del piloto | W-10 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Inicio > CAT > Servicios del tenant            [Abrir] [Publicar] [Nuevo*] |
| Servicios del tenant                                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Dominio   Oferta    Operación Versión v [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Publicar] [Cerrar ofer… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1430, M02:1431, M02:1432, M02:1437, M02:1451, M02:1453): Columnas: Código, Nombre, Dominio, Oferta, Operación, Versión vigente, Versión borrador, Contratos activos; Pestañas: General, Prestador, Jurisdicción, Titularidad, Unidad, Cantidad, Registración; Acciones: Nuevo, Abrir, Publicar, Cerrar oferta, Retirar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-03 | Servicios del tenant | PT-01 | `/admin/cat/services` | Columnas: código, nombre, dominio, oferta, operación, versión vigente, versión borrador, contratos activos, principal |
| PAN-CAT-04 | Ficha de configuración del servicio en pestañas | PT-09 | `/admin/cat/services/:id` | Usa PT-09 Configuración versionada. Pestañas: General, Prestador, jurisdicción, Titularidad, Unidad, cantidad, Registración, cálculo, Requisitos de alta… |
| PAN-CAT-05 | Versiones del servicio | PT-01 | `/admin/cat/services/:id/versions` | Versiones: lista con estado y fecha efectiva; detalle con diff lado a lado, validaciones (bloqueantes/advertencias)… |
| PAN-CAT-10 | Estados operativos por servicio | PT-01 | `/admin/cat/statuses` | Estados operativos por servicio: código, nombre, canónico, implica desconexión, principal, visible al socio. Diagrama… |
| PAN-CAT-24 | Tablero de servicios | PT-05 | `/admin/cat/dashboard` | Usa PT-05 Tablero, reporte o mapa. Tablero: indicadores de sección 15 con filtros por servicio y período |
| PAN-CAT-26 | Concesiones y fuentes normativas por servicio | PT-01 | `/admin/cat/concessions` | Concesiones y fuentes normativas por servicio con vigencia y verificación |

### FAM-CAT-03 Productos, planes, categorías, reglas y conceptos por evento

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-08 Categorías y grupos por servicio (M02:1435) |
| Portales | admin |
| Rutas | `/admin/cat/products`, `/admin/cat/plans`, `/admin/cat/categories`, `/admin/cat/classes-properties` y 3 más |
| Capabilities | `cat.productos.ver`, `cat.planes.ver`, `cat.categorias.ver`, `cat.clases.ver` y 3 más |
| Olas | O2 a O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > CAT > Categorías y grupos p… [Clonar categoría] [Editar] [Crear*] |
| Categorías y grupos por servicio                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Más filtros]                                 |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Tipo      Disparado Unidad    Clase fis [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Clonar categoría] [Editar] [Ve… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1433, M02:1434, M02:1435, M02:1436, M02:1438, M02:1439): Filtros: Tipo; Columnas: Código, Nombre, Tipo, Disparador, Unidad, Clase fiscal, Rubro, Interno sí/no; Acciones: Crear, Clonar categoría, Editar, Ver contratos, Publicar, Discontinuar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-06 | Productos/subservicios y conceptos facturables por servicio | PT-09 | `/admin/cat/products` | Usa PT-09 Configuración versionada. Columnas: código, nombre, tipo, disparador, unidad, clase fiscal, rubro, interno sí/no, estado |
| PAN-CAT-07 | Planes y versiones | PT-03 | `/admin/cat/plans` | Usa PT-03 Formulario o editor. Planes y versiones: código, producto, estado, versión vigente, contratos por versión. Editor de versión (xl)… |
| PAN-CAT-08 | Categorías y grupos por servicio | PT-01 | `/admin/cat/categories` | Categorías y grupos por servicio: código, nombre, grupo, social, prepaga, generador, códigos regulatorios, perfil de… |
| PAN-CAT-09 | Clases de servicio y propiedades del servicio y personalizadas | PT-01 | `/admin/cat/classes-properties` | Clases de servicio (valores 1 y 2) y propiedades del servicio y personalizadas (tipo, lista de valores) |
| PAN-CAT-11 | Reglas de altas automáticas | PT-09 | `/admin/cat/auto-rules` | Usa PT-09 Configuración versionada. Reglas de altas automáticas: evento, servicio origen/destino, categoría destino, filtros, modo propose/create… |
| PAN-CAT-12 | Conceptos por evento y bonificaciones de conexión | PT-09 | `/admin/cat/event-charges` | Usa PT-09 Configuración versionada. Conceptos por evento y bonificaciones de conexión: tipo de evento, concepto, filtros, una vez, requiere política MOR… |
| PAN-CAT-27 | Paquetes de prestaciones | PT-01 | `/admin/cat/bundles` | Paquetes de prestaciones: planes incluidos, reglas de baja parcial, vigencia |

### FAM-CAT-04 Contratos de servicio

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-13 Servicios contratados (M02:1440) |
| Portales | admin |
| Rutas | `/admin/cat/contracts`, `/admin/cat/contracts/:id`, `/admin/cat/contracts/new`, `/admin/cat/contracts/:id/members` |
| Capabilities | `cat.contratos.ver`, `cat.contratos.crear`, `cat.contratos.suspender`, `cat.adherentes.ver` y 1 más |
| Olas | O2 |
| Wireframe detallado del piloto | W-04 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Inicio > CAT > Servicios co… [Dar de baja] [Imprimir ficha/cr…] [Agregar*] |
| Servicios contratados                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Estado ▼] [Plan ▼] [Categoría ▼]         |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Internet  Telefonía Gas DDJJ  Medidor   Lecturas  Deuda     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Dar de baja] [Imprimir ficha/c… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1440, M02:1441, M02:1442, M02:1443, M02:1447, M02:1452): Filtros: Servicio, Estado, Plan, Categoría, Zona/ruta, Sucursal; Columnas: Internet perfil técnico sin secretos, Telefonía líneas, Gas DDJJ — PAN-CAT-25, Medidor, Lecturas, Deuda; Campos: Internet perfil técnico sin secretos, Telefonía líneas, Gas DDJJ — PAN-CAT-25, Medidor, Lecturas, Deuda, Facturas, Casos CRM y OT vinculados, Documentos, Historia; Pasos: Selección masiva, PAN-CAT-17; Acciones: Agregar, Dar de baja, Imprimir ficha/credencial, Bandeja de fuera de rango y mayoría de edad.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-13 | Servicios contratados | PT-01 | `/admin/cat/contracts` | Filtros: servicio, estado, plan, categoría, zona/ruta, sucursal, flags, fechas; Pasos: Selección masiva, PAN-CAT-17 |
| PAN-CAT-14 | Ficha del contrato por bloques | PT-02 | `/admin/cat/contracts/:id` | Usa PT-02 Ficha o detalle con pestañas. Campos: Internet perfil técnico sin secretos, Telefonía líneas, Gas DDJJ — PAN-CAT-25, ELE GD/GU), Medidor, lecturas… |
| PAN-CAT-15 | Asistente de alta | PT-04 | `/admin/cat/contracts/new` | Usa PT-04 Asistente por pasos o proceso masivo. Asistente de alta (modal xl, pasos): 1 titular y cuenta (búsqueda PER), 2 servicio y plan (solo ofertas abiertas), 3… |
| PAN-CAT-16 | Transiciones | PT-11 | modales en PAN-CAT-14 | Usa PT-11 Modal, pestaña o componente embebido. Transiciones: Aprobar, Activar (no técnico), Suspender (motivo, modo, fechas), Reactivar, Solicitar baja (fecha… |
| PAN-CAT-20 | Miembros del contrato (reemplazado por PAN-SOC-01 y PAN-SOC-02) | PT-01 | `/admin/cat/contracts/:id/members` | Reemplazado por PAN-SOC-01 y PAN-SOC-02 (M18, DEC-071, HUECO-TRV-01); la pestaña Miembros de PAN-CAT-14 enlaza a… |
| PAN-CAT-25 | Declaración jurada de artefactos por servicio | PT-11 | pestaña en PAN-CAT-14 (GAS, ELE; HUE-GAS-01) | Usa PT-11 Modal, pestaña o componente embebido. Declaración jurada de artefactos por servicio según la plantilla PRM-CAT-110 (GAS: artefactos con potencia en kcal/h… |

### FAM-CAT-05 Trámites masivos, copias y comodatos

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-19 Equipos en comodato (M02:1446) |
| Portales | admin, plataforma |
| Rutas | `/admin/cat/bulk-operations`, `/admin/cat/copies`, `/admin/cat/equipment-loans` |
| Capabilities | `cat.masivos.ejecutar`, `cat.copias.ejecutar`, `cat.comodatos.ver` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Equipos en comodato                       [Registrar devolución*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]                           |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Por co… · Accion…… | | Por contrato: ········                | |
| | [SLA 2 h] Por co… · Accion…… | | Acciones: ········                    | |
| | [SLA 2 h] Por co… · Accion…… | | Asignar: ········                     | |
| | ...                          | | Registrar devolución: ········        | |
| |                              | | Marcar perdido: ········              | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Asignar] [Marcar perdido] [Reemplaz… | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1444, M02:1445, M02:1446): Columnas: Por contrato, Acciones, Asignar, Registrar devolución, Marcar perdido, Trámites masivos; Campos: Por contrato, Acciones, Asignar, Registrar devolución, Marcar perdido, Trámites masivos, Elegir operación, Criterio o lista; Acciones: Asignar, Registrar devolución, Marcar perdido, Reemplazar, Constancias.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-17 | Altas, bajas y cambios | PT-03 | `/admin/cat/bulk-operations` | Usa PT-03 Formulario o editor. Trámites masivos: elegir operación, criterio o lista (importación Excel), simular, aprobar, seguir progreso, ver… |
| PAN-CAT-18 | Asistente de copia | PT-04 | `/admin/cat/copies` | Usa PT-04 Asistente por pasos o proceso masivo. Asistente de copia: origen (tenant/servicio/versión autorizados), destino, componentes, dependencias con mapeo… |
| PAN-CAT-19 | Equipos en comodato | PT-06 | `/admin/cat/equipment-loans` | Equipos en comodato: por contrato y bandeja global de devoluciones pendientes/vencidas (serie, producto, titular… |

### FAM-CAT-06 Componentes del catálogo en portal y landing

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CAT-21 Oferta del tenant (componente embebido en PAN-POR-31) (M02:1448) |
| Portales | landing, socio |
| Rutas | `/app/servicios/disponibles`, `/app/servicios/mios`, `/servicios` |
| Capabilities | `cat.oferta.ver`, `cat.misServicios.ver`, `por.ofertas.ver` |
| Olas | O2 |

```text
+------------------------------------------------------------+
| < Oferta del tenant (componente…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Oferta del tenant: ········                            | |
| | Detalle del plan: ········                             | |
| | 3 skeleton cards: ········                             | |
| | Mis servicios: ········                                | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Oferta del tenant: ········                            | |
| | Detalle del plan: ········                             | |
| | 3 skeleton cards: ········                             | |
| | Mis servicios: ········                                | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M02:1448, M02:1449, M02:1450): Campos: Oferta del tenant, Detalle del plan, 3 skeleton cards, Mis servicios, Plan, Promociones, Fecha de fin, Equipos en comodato. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CAT-21 | Oferta del tenant (componente embebido en PAN-POR-31) | PT-07 | `/app/servicios/disponibles` | Componente embebido en PAN-POR-31 (M19 es dueño de la y de la composición; datos por API-CAT-49; HUE-SRV-04… |
| PAN-CAT-22 | Mis servicios (componente embebido en PAN-POR-29 y PAN-POR-30) | PT-07 | `/app/servicios/mios` | Componente embebido en PAN-POR-29 y PAN-POR-30 (M19 es dueño de las rutas /app/servicios y /app/servicios/:contractId… |
| PAN-CAT-23 | Catálogo público de servicios (componente embebido en PAN-POR-02 y PAN-POR-03) | PT-10 | `/servicios` | Usa PT-10 Página pública (landing). Componente embebido en PAN-POR-02 y PAN-POR-03 (M19 es dueño de las rutas /servicios y /servicios/:serviceCode de la… |

## M03 MED: Medición y consumos

Anexo `docs/especificacion/anexos/M03-MED-medicion-consumos.md`, §10. 7 familias, 35 PAN. Catálogo: [17-03-M03-MED.md](17-catalogo-pantallas/17-03-M03-MED.md).

### FAM-MED-01 Equipos de medición

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-02 Medidores (M03:1442) |
| Portales | admin |
| Rutas | `/admin/med/config/catalogos`, `/admin/med/medidores`, `/admin/med/puntos`, `/admin/med/testigos` |
| Capabilities | `med.catalogos.ver`, `med.medidores.ver`, `med.puntos.ver`, `med.instalaciones.crear` y 1 más |
| Olas | O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > MED > Medidores                       [Abrir] [Exportar] [Nuevo*] |
| Medidores                                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipos/modelos ▼] [Más filtros]                        |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Listado   Ensayos   Precintos Adjuntos  Marcas    Tipos/mod [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1441, M03:1442, M03:1443, M03:1444, M03:1458): Filtros: Tipos/modelos; Columnas: Listado, Ensayos, Precintos, Adjuntos, Marcas, Tipos/modelos; Campos: Listado, Ensayos, Precintos, Adjuntos, Marcas, Tipos/modelos, Observaciones de lectura, De medidor. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-01 | Catálogos de medición | PT-09 | `/admin/med/config/catalogos` | Usa PT-09 Configuración versionada. Marcas, tipos/modelos, observaciones de lectura y de medidor, resultados, condiciones |
| PAN-MED-02 | Medidores | PT-01 | `/admin/med/medidores` | Listado y ficha del medidor con trayectoria, ensayos, precintos, adjuntos |
| PAN-MED-03 | Punto de medición | PT-03 | `/admin/med/puntos` | Usa PT-03 Formulario o editor. Punto de medición: canales, medidor vigente, instalaciones, ruta, testigo, GD, prepago, telemetría |
| PAN-MED-04 | Asistente de instalación, retiro y cambio de medidor | PT-04 | desde PAN-MED-02/03 | Usa PT-04 Asistente por pasos o proceso masivo. Asistente de instalación, retiro y cambio de medidor |
| PAN-MED-18 | Medidores testigo y sus consumos | PT-01 | `/admin/med/testigos` | Medidores testigo y sus consumos |

### FAM-MED-02 Rutas, cronograma y lotes de lectura

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-07 Lotes de lectura (M03:1447) |
| Portales | admin |
| Rutas | `/admin/med/rutas`, `/admin/med/cronograma`, `/admin/med/lotes`, `/admin/med/lotes/:id` y 2 más |
| Capabilities | `med.rutas.ver`, `med.cronograma.ver`, `med.lotes.ver`, `med.lecturas.crear` y 1 más |
| Olas | O7 |

```text
+----------------------------------------------------------------------------+
| Lotes de lectura                                                [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Lotes ── (2) Generar ── (3) Asignar ── (4) Exportar                    |
|                                                                            |
| Paso 2 de 4: Generar                                                       |
|   Lotes                           [______________________]                 |
|   Generar                         [______________________]                 |
|   Asignar                         [______________________]                 |
|   Exportar                        [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                 [Guardar borrador] [Confirmar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1445, M03:1446, M03:1447, M03:1448, M03:1449, M03:1450): Campos: Lotes, Generar, Asignar, Exportar, Mapa, Ventanas de autolectura. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-05 | Rutas de lectura | PT-01 | `/admin/med/rutas` | Usa PT-01 Listado con filtros. ABM de rutas con vista previa en mapa |
| PAN-MED-06 | Cronograma de lectura | PT-06 | `/admin/med/cronograma` | Usa PT-06 Bandeja de trabajo. Calendario de lectura por servicio/ciclo/ruta y ventanas de autolectura |
| PAN-MED-07 | Lotes de lectura | PT-04 | `/admin/med/lotes` | Lotes: generar, asignar, exportar, seguimiento de avance en lista y mapa |
| PAN-MED-08 | Detalle y revisión del lote de lectura | PT-04 | `/admin/med/lotes/:id` | Detalle y revisión del lote con filtros, confirmación, cierre |
| PAN-MED-09 | Registro manual de lecturas | PT-01 | `/admin/med/lecturas/registro` | Usa PT-01 Listado con filtros. Registro manual de lecturas |
| PAN-MED-10 | Importación de archivos y perfiles de mapeo | PT-04 | `/admin/med/lecturas/importar` | Importación de archivos y perfiles de mapeo |

### FAM-MED-03 Consumos, excepciones y procesos masivos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-13 Corrección de lectura/consumo con versión (M03:1453) |
| Portales | admin |
| Rutas | `/admin/med/excepciones`, `/admin/med/consumos/servicio/:contractId`, `/admin/med/consumos/estimacion`, `/admin/med/consumos/regularizacion` y 4 más |
| Capabilities | `med.excepciones.ver`, `med.consumos.ver`, `med.lecturas.corregir`, `med.consumos.estimar` y 5 más |
| Olas | O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > MED > Corrección de lectura/consumo … [Abrir] [Exportar] [Nuevo*] |
| Corrección de lectura/consumo con versión                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Historial            Gráfico              Acciones             [...]   |
| ------------------------------------------------------------------------   |
| [ ] ··········           ··········           ··········            ...    |
| [ ] ··········           ··········           ··········            ...    |
| [ ] ··········           ··········           ··········            ...    |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1451, M03:1452, M03:1453, M03:1454, M03:1455, M03:1456): Columnas: Historial, Gráfico, Acciones; Campos: Historial, Gráfico, Acciones. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-11 | Bandeja de excepciones de consumo | PT-06 | `/admin/med/excepciones` | Usa PT-06 Bandeja de trabajo. Bandeja de excepciones de consumo |
| PAN-MED-12 | Consumos del servicio | PT-02 | `/admin/med/consumos/servicio/:contractId` | Usa PT-02 Ficha o detalle con pestañas. Consumos del servicio: historial, gráfico, acciones |
| PAN-MED-13 | Corrección de lectura/consumo con versión | PT-01 | desde PAN-MED-12 | Corrección de lectura/consumo con versión |
| PAN-MED-14 | Estimación masiva de consumos | PT-04 | `/admin/med/consumos/estimacion` | Usa PT-04 Asistente por pasos o proceso masivo. Estimación masiva con recálculo, inversión de selección y "sumar mes" |
| PAN-MED-15 | Regularización de estimados | PT-01 | `/admin/med/consumos/regularizacion` | Regularización de estimados |
| PAN-MED-16 | División y prorrateo | PT-01 | `/admin/med/consumos/division` | División/agrupación/prorrateo masivo |
| PAN-MED-17 | ABM y ejecución de distribuciones | PT-04 | `/admin/med/consumos/distribuciones` | Usa PT-04 Asistente por pasos o proceso masivo. ABM y ejecución de distribuciones |
| PAN-MED-34 | Conflictos de sincronización offline | PT-01 | `/admin/med/conflictos` | Conflictos de sincronización offline |
| PAN-MED-35 | Propuestas de cambio de clase por consumo | PT-01 | `/admin/med/consumos/cambio-clase` | Propuestas de cambio de clase por consumo |

### FAM-MED-04 Demanda, factores, generación distribuida e informes

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-22 Informes y controles de consumo (M03:1462) |
| Portales | admin |
| Rutas | `/admin/med/demanda`, `/admin/med/config/factores-gas`, `/admin/med/medicion-propia`, `/admin/med/informes` y 2 más |
| Capabilities | `med.demanda.ver`, `med.gas.configurar`, `med.medicionPropia.ver`, `med.informes.ver` y 1 más |
| Olas | O7 |

```text
+----------------------------------------------------------------------------+
| Informes y controles de co… Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Sucursal ▼] [Servicio ▼]                                                  |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Reemplazado por…                                                     [...] |
| -------------------------------------------------------------------------- |
| ··········                                                            ...  |
| ··········                                                            ...  |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1459, M03:1460, M03:1461, M03:1462, M03:1466, M03:1467): Columnas: Reemplazado por PAN-TAR-09; Campos: Reemplazado por PAN-TAR-09. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-19 | Demanda contratada por período y transgresiones | PT-01 | `/admin/med/demanda` | Usa PT-01 Listado con filtros. Demanda contratada por período y transgresiones |
| PAN-MED-20 | Factores de corrección de gas por período/categoría (reemplazado) | PT-01 | `/admin/med/config/factores-gas` | Usa PT-01 Listado con filtros. Factores de corrección de gas por período/categoría. Reemplazado por PAN-TAR-09 (HUE-GAS-03): la carga se hace en M04… |
| PAN-MED-21 | Medición propia y pérdidas | PT-03 | `/admin/med/medicion-propia` | Usa PT-03 Formulario o editor. Medición propia y pérdidas |
| PAN-MED-22 | Informes y controles de consumo | PT-05 | `/admin/med/informes` | Informes y controles de consumo |
| PAN-MED-26 | Contratos GD y balances | PT-05 | `/admin/med/generacion-distribuida` | Contratos GD y balances |
| PAN-MED-27 | Tablero de lecturas y consumos | PT-05 | `/admin/med/tablero` | Tablero de lecturas y consumos |

### FAM-MED-05 Telemedición y prepago

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-23 Sistemas de telemedición/prepago y mapeo de registros (M03:1463) |
| Portales | admin |
| Rutas | `/admin/med/config/telemedicion`, `/admin/med/telemedicion/operaciones`, `/admin/med/prepago` |
| Capabilities | `med.telemedicion.configurar`, `med.telemedicion.ver`, `med.prepago.ver` |
| Olas | O7 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Sistemas de telemedición/prepago y mapeo de … [x] |
+----------------------------------------------------------------------+
| Operaciones * [________________________]                             |
| Comandos remotos * [________________________]                        |
| Toma de estado puntual   [____________________ ▼]                    |
| Auditoría   [________________________]                               |
| Cuentas prepagas   [________________________]                        |
| Recargas   [________________________]                                |
| Tokens   [________________________]                                  |
| Fallidas   [________________________]                                |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
|                                                [Cancelar] [Guardar*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1463, M03:1464, M03:1465): Campos: Operaciones, Comandos remotos, Toma de estado puntual, Auditoría, Cuentas prepagas, Recargas, Tokens, Fallidas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-23 | Sistemas de telemedición/prepago y mapeo de registros | PT-03 | `/admin/med/config/telemedicion` | Sistemas de telemedición/prepago y mapeo de registros |
| PAN-MED-24 | Operaciones remotas de telemedición | PT-03 | `/admin/med/telemedicion/operaciones` | Operaciones y comandos remotos, toma de estado puntual, auditoría |
| PAN-MED-25 | Prepago: cuentas, recargas y conciliación | PT-06 | `/admin/med/prepago` | Usa PT-06 Bandeja de trabajo. Cuentas prepagas, recargas, tokens, fallidas, conciliación |

### FAM-MED-06 Lectura en campo

| Dato | Valor |
|---|---|
| Patrón base | PT-08 App de campo móvil (offline) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-28 Mis rutas de lectura (M03:1468) |
| Portales | campo |
| Rutas | `/app/campo/lecturas`, `/app/campo/lecturas/:batchId/:taskId`, `/app/campo/sincronizacion` |
| Capabilities | `med.campo.leer`, `med.campo.sincronizar` |
| Olas | O3 a O7 |

```text
+------------------------------------------------------------+
| Sin conexión · N cambios pendientes [Sincronizar]          |
+------------------------------------------------------------+
| Mis rutas de lectura                                Sincr. |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Mis rutas/lotes asignados: ········                    | |
| | Descarga: ········                                     | |
| | Avance: ········                                       | |
| | Estado de la cola: ········                            | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Mis rutas/lotes asignados: ········                    | |
| | Descarga: ········                                     | |
| | Avance: ········                                       | |
| | Estado de la cola: ········                            | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [Cámara] [Firma] [Escanear]                                |
|                                                      ( + ) |
| [                       Iniciar                       * ]  |
+------------------------------------------------------------+
| Hoy | Órdenes | (+) | Stock en vehículo | Sincronización   |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1468, M03:1469, M03:1470): Campos: Mis rutas/lotes asignados, Descarga, Avance, Estado de la cola, Reintentos, Ítems en conflicto. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-28 | Mis rutas de lectura | PT-08 | `/app/campo/lecturas` | Mis rutas/lotes asignados, descarga, avance |
| PAN-MED-29 | Captura de lectura | PT-08 | `/app/campo/lecturas/:batchId/:taskId` | Captura de lectura |
| PAN-MED-30 | Cola de sincronización de lecturas (absorbida por PAN-TEC-53) | PT-08 | `/app/campo/sincronizacion` | Estado de la cola, reintentos, ítems en conflicto |

### FAM-MED-07 Consumos y autolectura del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MED-31 Mis consumos (M03:1471) |
| Portales | socio |
| Rutas | `/app/mis-servicios/:id/consumos`, `/app/mis-servicios/:id/autolectura`, `/app/mis-servicios/:id/prepago` |
| Capabilities | `med.misConsumos.ver`, `med.autolectura.crear`, `med.miPrepago.ver` |
| Olas | O7 |

```text
+------------------------------------------------------------+
| < Mis consumos                                         (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | La ruta: ········                                      | |
| | De M19: ········                                       | |
| | M03 conserva sus APIs: ········                        | |
| | Reglas: ········                                       | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | La ruta: ········                                      | |
| | De M19: ········                                       | |
| | M03 conserva sus APIs: ········                        | |
| | Reglas: ········                                       | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M03:1471, M03:1472, M03:1473): Campos: La ruta, De M19, M03 conserva sus APIs, Reglas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MED-31 | Mis consumos (componente embebido) | PT-07 | `/app/mis-servicios/:id/consumos` | Mis consumos. Componente embebido en PAN-POR-47 (HUE-SRV-04): la ruta y el permiso de pantalla son de M19… |
| PAN-MED-32 | Autolectura (componente embebido) | PT-07 | `/app/mis-servicios/:id/autolectura` | Autolectura. Componente embebido en PAN-POR-48 (HUE-SRV-04): de M19; M03 conserva sus APIs y reglas |
| PAN-MED-33 | Mi prepago (componente embebido) | PT-07 | `/app/mis-servicios/:id/prepago` | Mi prepago. Componente embebido en PAN-POR-49 (HUE-SRV-04): de M19; M03 conserva sus APIs |

## M04 TAR: Tarifas y motor de cálculo

Anexo `docs/especificacion/anexos/M04-TAR-tarifas-motor-calculo.md`, §10. 6 familias, 29 PAN. Catálogo: [17-04-M04-TAR.md](17-catalogo-pantallas/17-04-M04-TAR.md).

### FAM-TAR-01 Cuadros tarifarios

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-01 Listado de versiones de cuadros (M04:1770) |
| Portales | admin |
| Rutas | `/admin/tarifas/cuadros`, `/admin/tarifas/cuadros/:id`, `/admin/tarifas/cuadros/:id/categorias/:cat`, `/admin/tarifas/cuadros/actualizacion-masiva` y 2 más |
| Capabilities | `tar.cuadros.ver`, `tar.cuadros.editar`, `tar.precios.actualizarMasivo`, `tar.precios.importar` |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > TAR > Listado de versiones… [Copiar] [Actualizar masivo] [Nueva*] |
| Listado de versiones de cuadros                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Estado ▼] [Vigente a fecha ▼] [Norma ▼]  |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Servicio  Versión   Estado    Vigencia  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Copiar] [Actualizar masivo] [I… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1770, M04:1771, M04:1772, M04:1773, M04:1774, M04:1798): Filtros: Servicio, Estado, Vigente a fecha, Norma, Autor; Columnas: Código, Nombre, Servicio, Versión, Estado, Vigencia desde/hasta, Normas, Simulación; Pestañas: Categorías, Filas, Adherentes, Productos/precios, Reglas incluidas, Normas, Simulación; Acciones: Nueva, Copiar, Actualizar masivo, Importar, Ver diff, Enviar, Exportar, Guardar, Validar, Enviar a aprobación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-01 | Listado de versiones de cuadros | PT-01 | `/admin/tarifas/cuadros` | Filtros: servicio, estado, vigente a fecha, norma, autor; Columnas: código, nombre, servicio, versión, estado… |
| PAN-TAR-02 | Editor de versión | PT-03 | `/admin/tarifas/cuadros/:id` | Usa PT-03 Formulario o editor. Pestañas: Categorías, Filas, Adherentes, Productos/precios, Reglas incluidas, Normas, Simulación, Diff, Historial… |
| PAN-TAR-03 | Editor de categoría y escalones | PT-03 | `/admin/tarifas/cuadros/:id/categorias/:cat` | Usa PT-03 Formulario o editor. Editor de categoría y escalones. Datos de la categoría (cargo fijo, mínimo, bonificación, demanda, factor de potencia… |
| PAN-TAR-04 | Actualización masiva de precios | PT-04 | `/admin/tarifas/cuadros/actualizacion-masiva` | Usa PT-04 Asistente por pasos o proceso masivo. Actualización masiva de precios. Asistente: origen (versión), alcance (servicios/categorías/conceptos/campos)… |
| PAN-TAR-05 | Importar tarifas desde planilla | PT-04 | `/admin/tarifas/cuadros/importar` | Usa PT-04 Asistente por pasos o proceso masivo. Importar tarifas desde planilla. ExcelImportWizard con mapeo por clave natural, validación por fila, vista previa de… |
| PAN-TAR-29 | Precios de vivienda por categoría y fecha (reemplazado) | PT-01 | `/admin/tarifas/precios-vivienda` | Precios de vivienda por categoría y fecha. Reemplazado por PAN-SOC-17 (HUECO-VIV-02): los precios se cargan en M18… |

### FAM-TAR-02 Reglas y fórmulas de cálculo

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-06 Listado de reglas (M04:1775) |
| Portales | admin |
| Rutas | `/admin/tarifas/reglas`, `/admin/tarifas/reglas/:id`, `/admin/tarifas/funciones`, `/admin/tarifas/redondeo` y 1 más |
| Capabilities | `tar.reglas.ver`, `tar.reglas.editar`, `tar.funciones.ver`, `tar.redondeo.configurar` y 1 más |
| Olas | O4 a O7 |

```text
+----------------------------------------------------------------------------+
| Listado de reglas                                                (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                       [Nueva*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Editor de regla y… | | Identidad [______________]                    | |
| | > Catálogo de funci… | | Ámbito [______________]                       | |
| | > Políticas de redo… | | Condiciones [______________]                  | |
| | > Parámetros del mó… | | Base [______________]                         | |
| |                      | | Acción [______________]                       | |
| |                      | | Fórmulas GFL con editor… [______________]     | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1775, M04:1776, M04:1777, M04:1794, M04:1796): Filtros: Fase, Tipo, Servicio, Estado, Vigente a fecha, Financiamiento; Columnas: Orden, Código, Nombre, Fase, Tipo, Servicio, Concepto/tributo, Vigencia; Pestañas: Editor de regla y fórmulas, Catálogo de funciones y variables GFL, Políticas de redondeo, Parámetros del módulo; Campos: Identidad, Ámbito, Condiciones, Base, Acción, Fórmulas GFL con editor con resaltado, Autocompletado de variables/funciones/reglas, Validación en línea, Panel de dependencias, Compatibilidad; Acciones: Nueva, Clonar, Subir/bajar orden, Enviar, Ver dependencias, Probar con contratos reales en ambas fases, Guardar caso de prueba, Ver fórmula legacy original, Proponer función a medida, Versionar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-06 | Listado de reglas | PT-09 | `/admin/tarifas/reglas` | Filtros: fase, tipo, servicio, estado, vigente a fecha, financiamiento, estado de traducción; Columnas: orden, código… |
| PAN-TAR-07 | Editor de regla y fórmulas | PT-03 | `/admin/tarifas/reglas/:id` | Usa PT-03 Formulario o editor. Campos: identidad, ámbito, condiciones, base, acción, fórmulas GFL con editor con resaltado, autocompletado de… |
| PAN-TAR-08 | Catálogo de funciones y variables GFL | PT-09 | `/admin/tarifas/funciones` | Catálogo de funciones y variables GFL. Lista con firma, fase, descripción, ejemplos y alias legacy; funciones a medida… |
| PAN-TAR-25 | Políticas de redondeo | PT-09 | `/admin/tarifas/redondeo` | Políticas de redondeo. Global y por tipo de comprobante: decimales de renglón, tipo, decimales/múltiplo, conceptos… |
| PAN-TAR-27 | Parámetros del módulo | PT-09 | `/admin/tarifas/configuracion` | Parámetros del módulo (PRM-TAR). Formulario agrupado por tema con valor, ámbito, origen V2 y ayuda. Guardar versión… |

### FAM-TAR-03 Factores, beneficios, subsidios y cargos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-14 Promociones y asignaciones (M04:1783) |
| Portales | admin |
| Rutas | `/admin/tarifas/gas/factores`, `/admin/tarifas/coeficientes`, `/admin/tarifas/grupos`, `/admin/tarifas/subsidios` y 5 más |
| Capabilities | `tar.cuadros.editar`, `tar.grupos.ver`, `tar.subsidios.ver`, `tar.padrones.exportar` y 3 más |
| Olas | O4 a O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > TAR > Promociones y asig… [Aprobar] [Asignar manualmen…] [Nueva*] |
| Promociones y asignaciones                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Promocion Asignacio Lista de  Detalle c Nueva     Aprobar   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aprobar] [Asignar manualmen…] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1778, M04:1779, M04:1780, M04:1781, M04:1782, M04:1783): Columnas: Promociones, Asignaciones, Lista de promociones, Detalle con asignaciones, Nueva, Aprobar; Pestañas: Regímenes, Padrones, Inscripciones; Campos: Promociones, Asignaciones, Lista de promociones, Detalle con asignaciones, Nueva, Aprobar; Acciones: Nueva, Aprobar, Asignar manualmente, Cancelar asignación, Importar, Copiar período anterior, Alta, Alta/baja de miembro con fecha efectiva, Importar miembros, Importar padrón.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-09 | Factores de gas por período/zona/categoría | PT-01 | `/admin/tarifas/gas/factores` | Factores de gas por período/zona/categoría. Pantalla única de factores (reemplaza a PAN-MED-20; HUE-GAS-03). DataTable… |
| PAN-TAR-10 | Coeficientes por categoría y fecha | PT-01 | `/admin/tarifas/coeficientes` | Coeficientes por categoría y fecha. DataTable por versión/categoría. Alta, importar |
| PAN-TAR-11 | Grupos de beneficio | PT-01 | `/admin/tarifas/grupos` | Grupos de beneficio. Lista de grupos; detalle con miembros (vigencias, origen, evidencia) y criterio. Alta/baja de… |
| PAN-TAR-12 | Regímenes, padrones e inscripciones | PT-02 | `/admin/tarifas/subsidios` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Regímenes, Padrones, Inscripciones |
| PAN-TAR-13 | Exportación al organismo | PT-01 | `/admin/tarifas/subsidios/exportar` | Exportación al organismo. Filtros por régimen/período; vista previa; formato del régimen. Generar archivo (job) y… |
| PAN-TAR-14 | Promociones y asignaciones | PT-01 | `/admin/tarifas/promociones` | Promociones y asignaciones. Lista de promociones (efecto, base, ciclos, ventana, estado); detalle con asignaciones… |
| PAN-TAR-18 | Catálogo de cargos por evento y bonificaciones | PT-09 | `/admin/tarifas/cargos-evento` | Usa PT-09 Configuración versionada. Catálogo de cargos por evento y bonificaciones. Incluye los disparadores equipment_not_returned (deshabilitado por… |
| PAN-TAR-26 | Recálculo masivo de bonificaciones de unidades | PT-04 | `/admin/tarifas/bonificaciones/recalculo` | Usa PT-04 Asistente por pasos o proceso masivo. Recálculo masivo de bonificaciones de unidades. Filtros; grilla de trabajo (contrato, categoría anterior/actual… |
| PAN-TAR-28 | Cargos extraordinarios precargados (reemplazado) | PT-03 | `/admin/tarifas/precargados` | Usa PT-03 Formulario o editor. Cargos extraordinarios precargados. DataTable por contrato/período/estado/origen. Alta manual (con aprobación sobre… |

### FAM-TAR-04 Simulación, aprobaciones y retroactivos

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-16 Simulador masivo comparativo (M04:1785) |
| Portales | admin |
| Rutas | `/admin/tarifas/simulador`, `/admin/tarifas/simulador/masivo`, `/admin/tarifas/calculos/:id`, `/admin/tarifas/aprobaciones` y 1 más |
| Capabilities | `tar.simulador.ejecutar`, `tar.simulador.masivo`, `tar.calculo.explicar`, `tar.cuadros.aprobar` y 1 más |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Simulador masivo comparativo                                    [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Formulario ── (2) Tablero de result… ── (3) Detalle por cuenta ──      |
| (4) Lanzar                                                                 |
|                                                                            |
| Paso 2 de 4: Tablero de resultados                                         |
|   Formulario                      [______________________]                 |
|   Tablero de resultados           [______________________]                 |
|   Detalle por cuenta              [______________________]                 |
|   Lanzar                          [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                    [Guardar borrador] [Lanzar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1784, M04:1785, M04:1786, M04:1790, M04:1791): Campos: Formulario, Tablero de resultados, Detalle por cuenta, Lanzar, Cancelar, Simulador individual, Candidata, Exportar PDF de simulación; Acciones: Lanzar, Cancelar, Exportar, Vincular a versión, Exportar PDF de simulación, Compartir con atención, Reproducir cálculo, Descargar JSON de traza, Aprobar/rechazar con comentario, Ver detalle.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-15 | Simulador de cálculo | PT-04 | `/admin/tarifas/simulador` | Simulador individual. Selección de cuenta/contrato o cliente hipotético (servicio, categoría, cantidad, días, fecha)… |
| PAN-TAR-16 | Simulador masivo comparativo | PT-04 | `/admin/tarifas/simulador/masivo` | Simulador masivo comparativo. Formulario (baseline, candidato, universo, período, fuente de cantidades); listado de… |
| PAN-TAR-17 | Explicación técnica de un cálculo | PT-02 | `/admin/tarifas/calculos/:id` | Usa PT-02 Ficha o detalle con pestañas. Explicación técnica de un cálculo. Cabecera (cuenta, período, versiones, hashes, estado); renglones con traza… |
| PAN-TAR-21 | Bandeja de aprobaciones | PT-06 | `/admin/tarifas/aprobaciones` | Usa PT-06 Bandeja de trabajo. Bandeja de aprobaciones. Lista de envíos pendientes (cuadros, reglas, promociones, regímenes, retroactivos) con… |
| PAN-TAR-22 | Diferencias retroactivas | PT-01 | `/admin/tarifas/retroactivos` | Usa PT-01 Listado con filtros. Diferencias retroactivas. Lista de corridas; detalle por comprobante (original, recalculado, diferencia). Calcular… |

### FAM-TAR-05 Tarifas de telefonía

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-19 Configuración de tasación (M04:1788) |
| Portales | admin |
| Rutas | `/admin/tarifas/telefonia`, `/admin/tarifas/telefonia/tasacion` |
| Capabilities | `tar.telefonia.ver`, `tar.telefonia.tasar` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Configuración de tasación                                        (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                [Alta/versión*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Planes             | | Pestañas [______________]                     | |
| | > Bandas horarias    | | Planes [______________]                       | |
| | > Asignación de ban… | | Bandas horarias [______________]              | |
| | > Tarifas por desti… | | Asignación de bandas [______________]         | |
| | > Planes de descuen… | | Tarifas por destino/tip… [______________]     | |
| | > Números gratuitos  | | Simulador de tasación [______________]        | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1788, M04:1789): Pestañas: Planes, Bandas horarias, Asignación de bandas, Tarifas por destino/tipo/banda, Planes de descuento, Números gratuitos; Campos: Pestañas, Planes, Bandas horarias, Asignación de bandas, Tarifas por destino/tipo/banda, Simulador de tasación, Retasación, Filtros con vista previa; Acciones: Alta/versión, Importar tarifas, Tasar pendientes, Retasar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-19 | Configuración de tasación | PT-09 | `/admin/tarifas/telefonia` | Pestañas: Planes, Bandas horarias, Asignación de bandas, Tarifas por destino/tipo/banda, Planes de descuento, Números… |
| PAN-TAR-20 | Simulador de tasación y retasación | PT-04 | `/admin/tarifas/telefonia/tasacion` | Usa PT-04 Asistente por pasos o proceso masivo. Simulador de tasación y retasación. Ingreso de llamada hipotética (origen, destino, inicio, duración) con resultado… |

### FAM-TAR-06 Tarifas para el socio y el público

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TAR-23 Explicación de la factura al socio (M04:1792) |
| Portales | landing, socio |
| Rutas | `/app/facturas/:id/detalle`, `/tarifas` |
| Capabilities | `tar.explicacion.ver` |
| Olas | O4 |

```text
+------------------------------------------------------------+
| < Explicación de la factura al …                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Cargo fijo: ········                                   | |
| | Consumo por tramo: ········                            | |
| | Beneficios con su origen: ········                     | |
| | Promociones: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Cargo fijo: ········                                   | |
| | Consumo por tramo: ········                            | |
| | Beneficios con su origen: ········                     | |
| | Promociones: ········                                  | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                    Descargar PDF                    * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M04:1792, M04:1793): Campos: Cargo fijo, Consumo por tramo, Beneficios con su origen, Promociones, Tributos, Redondeo, Enlace a la norma pública, Al cuadro vigente; Acciones: Descargar PDF, Consultar, Descargar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TAR-23 | Explicación de la factura al socio | PT-07 | `/app/facturas/:id/detalle` | Campos: cargo fijo, consumo por tramo, beneficios con su origen, promociones, tributos, redondeo, enlace a la norma… |
| PAN-TAR-24 | Cuadros tarifarios públicos | PT-10 | `/tarifas` | Usa PT-10 Página pública (landing). Cuadros tarifarios públicos. Por servicio: versión vigente y próximas, categorías y precios publicables, norma con… |

## M05 FAC: Facturación

Anexo `docs/especificacion/anexos/M05-FAC-facturacion.md`, §10. 8 familias, 47 PAN. Catálogo: [17-05-M05-FAC.md](17-catalogo-pantallas/17-05-M05-FAC.md).

### FAM-FAC-01 Tablero, ciclos, universos y plantillas

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-03 Universos y conjuntos (M05:1696) |
| Portales | admin |
| Rutas | `/admin/fac`, `/admin/fac/ciclos`, `/admin/fac/universos`, `/admin/fac/plantillas` |
| Capabilities | `fac.lotes.ver`, `fac.ciclos.ver`, `fac.universos.ver`, `fac.plantillas.ver` |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Universos y conjuntos                                           [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Lotes activos por… ── (2) Excepciones abier… ── (3) Antigüedad ──      |
| (4) Pendientes de aut…                                                     |
|                                                                            |
| Paso 2 de 4: Excepciones abiertas por responsable                          |
|   Lotes activos por estado        [______________________]                 |
|   Excepciones abiertas por resp…  [______________________]                 |
|   Antigüedad                      [______________________]                 |
|   Pendientes de autorización      [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                 [Guardar borrador] [Confirmar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1694, M05:1695, M05:1696, M05:1697): Columnas: Código, Servicio, Universo, Periodicidad, Próxima ejecución, Estado; Campos: Lotes activos por estado, Excepciones abiertas por responsable, Antigüedad, Pendientes de autorización, Entregas fallidas, Próximos ciclos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-01 | Tablero de facturación | PT-05 | `/admin/fac` | Usa PT-05 Tablero, reporte o mapa. Campos: lotes activos por estado, excepciones abiertas por responsable, antigüedad, pendientes de autorización… |
| PAN-FAC-02 | Ciclos de facturación | PT-03 | `/admin/fac/ciclos` | Usa PT-03 Formulario o editor. Columnas: código, servicio, universo, periodicidad, próxima ejecución, estado |
| PAN-FAC-03 | Universos y conjuntos | PT-04 | `/admin/fac/universos` | Universos y conjuntos. Tabla y modal xl con criterios, lista explícita (importación con ExcelImportWizard) y conteo en… |
| PAN-FAC-04 | Plantillas de corrida | PT-04 | `/admin/fac/plantillas` | Plantillas de corrida. Tabla con versiones; modal xl: servicios y períodos, cuotas, vencimientos, orden, opciones… |

### FAM-FAC-02 Lotes, excepciones y revisión previa

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-07 Detalle de lote (M05:1700) |
| Portales | admin |
| Rutas | `/admin/fac/lotes`, `/admin/fac/lotes/nuevo`, `/admin/fac/lotes/:id`, `/admin/fac/excepciones` y 2 más |
| Capabilities | `fac.lotes.ver`, `fac.lotes.crear`, `fac.excepciones.ver`, `fac.excepcionesMotivos.configurar` y 1 más |
| Olas | O4 a O7 |
| Wireframe detallado del piloto | W-06 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Detalle de lote                                                 [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Datos ── (2) Validación ── (3) Confirmación                            |
|                                                                            |
| Paso 2 de 3: Validación                                                    |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                   [Guardar borrador] [Asignar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1698, M05:1699, M05:1700, M05:1701, M05:1735, M05:1740): Filtros: Ciclo, Período, Estado, Fase fiscal, Fase de distribución, Lote; Columnas: Código, Ciclo, Período/secuencia, Seleccionados, Emitidos, Pendientes, Total, Estado; Pestañas: Resumen, Casos, Excepciones, Universo, Numeración, Autorización, Distribución; Acciones: Asignar, Ir a corregir, Marcar resuelta, Excluir con causa, Reprocesar seleccionadas.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-05 | Lotes | PT-04 | `/admin/fac/lotes` | Filtros: ciclo, período, estado, fase fiscal, fase de distribución; Columnas: código, ciclo, período/secuencia… |
| PAN-FAC-06 | Nuevo lote (asistente) | PT-04 | `/admin/fac/lotes/nuevo` | Nuevo lote (asistente). Pasos: (1) ciclo o plantilla, período, secuencia; (2) fechas y vencimientos con validación en… |
| PAN-FAC-07 | Detalle de lote | PT-04 | `/admin/fac/lotes/:id` | Pestañas: Resumen, Casos, Excepciones, Universo, Numeración, Autorización, Distribución, Auditoría |
| PAN-FAC-08 | Bandeja de excepciones | PT-06 | `/admin/fac/excepciones` | Usa PT-06 Bandeja de trabajo. Filtros: lote, motivo, categoría, etapa, responsable, estado, antigüedad |
| PAN-FAC-42 | Motivos de excepción | PT-09 | `/admin/fac/config/motivos-excepcion` | Usa PT-09 Configuración versionada. Motivos de excepción. Motivo, categoría, severidad, responsable por defecto, SLA, sistémico |
| PAN-FAC-47 | Cola de revisión previa | PT-06 | `/admin/fac/revision-previa` | Usa PT-06 Bandeja de trabajo. Cola de revisión previa. Casos reviewPending por lote, categoría y condición especial (grandes usuarios, MER-003)… |

### FAM-FAC-03 Comprobantes

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-10 Detalle de comprobante (M05:1703) |
| Portales | admin |
| Rutas | `/admin/fac/comprobantes`, `/admin/fac/comprobantes/:id`, `/admin/fac/comprobantes/nuevo` |
| Capabilities | `fac.comprobantes.ver`, `fac.comprobantes.crear`, `fac.comprobantes.replicar`, `fac.relaciones.editar` |
| Olas | O4 |
| Wireframe detallado del piloto | W-05 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Inicio > FAC > Detalle de comprobante                            (?) Ayuda |
| Detalle de comprobante  [Activo]             [Duplicado] [Reenviar] [PDF*] |
+----------------------------------------------------------------------------+
| Comprobantes | Factura manual | Replicar comproba… | Relaciones del co…    |
| ============                                                               |
| Tipo       Letra      Número     Fecha      Cuenta     Titular    [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   dd-mm-yyyy ········   ········    ...     |
| ········   ········   ········   dd-mm-yyyy ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1702, M05:1703, M05:1704, M05:1705, M05:1708): Columnas: Tipo, Letra, Número, Fecha, Cuenta, Titular, Total, Vto1; Pestañas: Comprobantes, Factura manual, Replicar comprobante, Relaciones del comprobante; Acciones: PDF, Duplicado, Reenviar, Replicar, Anular/NC/ND, Bloquear, Observaciones, Reimprimir, Anular/NC.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-09 | Comprobantes | PT-01 | `/admin/fac/comprobantes` | Usa PT-01 Listado con filtros. Columnas: tipo, letra, número, fecha, cuenta, titular, total, Vto1, estado fiscal, estado comercial |
| PAN-FAC-10 | Detalle de comprobante | PT-02 | `/admin/fac/comprobantes/:id` | Detalle de comprobante. Cabecera fiscal y comercial, bloques por servicio con lecturas, renglones, tributos… |
| PAN-FAC-11 | Factura manual | PT-02 | `/admin/fac/comprobantes/nuevo` | Factura manual. Cabecera (cuenta, tipo resuelto, PV, fecha, vencimientos, vendedor, depósito, moneda) y grilla de… |
| PAN-FAC-12 | Replicar comprobante | PT-11 | Modal sm en PAN-FAC-10 | Usa PT-11 Modal, pestaña o componente embebido. Replicar comprobante. Opciones: fechas nuevas, todos los ítems o solo servicios. Abre PAN-FAC-11 con el borrador |
| PAN-FAC-15 | Relaciones del comprobante | PT-11 | Modal lg en PAN-FAC-10/11 | Usa PT-11 Modal, pestaña o componente embebido. Relaciones del comprobante. Comprobantes candidatos de la cuenta en N días, marcas de anulación e informar CUIT |

### FAM-FAC-04 Correcciones y notas de crédito

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-14 Anulación y reversión (M05:1707) |
| Portales | admin |
| Rutas | `/admin/fac/refacturacion`, `/admin/fac/anulaciones`, `/admin/fac/bloqueos`, `/admin/fac/config/causas-bloqueo` |
| Capabilities | `fac.comprobantes.refacturar`, `fac.comprobantes.anular`, `fac.bloqueos.bloquear`, `mor.causas.configurar` |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FAC > Anulación y reversión           [Abrir] [Exportar] [Nuevo*] |
| Anulación y reversión                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Período o archivo ▼] [Más filtros]       |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Anulación Reversión Selección Rango     Servicio  Período o [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1706, M05:1707, M05:1709, M05:1710): Filtros: Servicio, Período o archivo; Columnas: Anulación, Reversión, Selección por número, Rango, Servicio, Período o archivo; Campos: Anulación, Reversión, Selección por número, Rango, Servicio, Período o archivo. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-13 | Refacturación puntual | PT-04 | `/admin/fac/refacturacion` | Usa PT-04 Asistente por pasos o proceso masivo. Refacturación puntual. Asistente: comprobante, motivo, reversión requerida, nuevo cálculo con comparación lado a lado… |
| PAN-FAC-14 | Anulación y reversión | PT-01 | `/admin/fac/anulaciones` | Anulación y reversión. Selección por número, rango, servicio, período o archivo; modo y opciones; resultado previo con… |
| PAN-FAC-16 | Bloqueo de comprobantes | PT-01 | `/admin/fac/bloqueos` | Bloqueo de comprobantes. Selección por cuenta o comprobantes, causa, nota; desbloqueo; historial |
| PAN-FAC-17 | Causas de bloqueo | PT-01 | `/admin/fac/config/causas-bloqueo` | Causas de bloqueo. ABM simple sobre holdReasons de M08 por API-MOR-25 |

### FAM-FAC-05 Procesos masivos y cargos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-19 Recategorización (M05:1712) |
| Portales | admin |
| Rutas | `/admin/fac/modificacion-masiva`, `/admin/fac/recategorizacion`, `/admin/fac/retroactivos`, `/admin/fac/cargos` y 2 más |
| Capabilities | `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear`, `fac.cargos.crear` y 2 más |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FAC > Recategorización                [Abrir] [Exportar] [Nuevo*] |
| Recategorización                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Período ▼] [Más filtros]                 |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Método    Servicio  Período   Parámetro Confirmac Filtros   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1711, M05:1712, M05:1713, M05:1714, M05:1715, M05:1732): Filtros: Servicio, Período; Columnas: Método, Servicio, Período, Parámetros, Confirmación aprobada, Filtros; Campos: Método, Servicio, Período, Parámetros, Confirmación aprobada, Filtros, Campos a cambiar, Vista previa antes/después. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-18 | Modificación masiva | PT-04 | `/admin/fac/modificacion-masiva` | Usa PT-04 Asistente por pasos o proceso masivo. Modificación masiva. Filtros, campos a cambiar (vencimientos, clasificación comercial, observaciones, mensajes), vista… |
| PAN-FAC-19 | Recategorización | PT-01 | `/admin/fac/recategorizacion` | Recategorización. Método, servicio, período, parámetros; simulación con tabla categoría actual/propuesta/consumo… |
| PAN-FAC-20 | Retroactivos | PT-01 | `/admin/fac/retroactivos` | Retroactivos. Servicio, períodos base, cuadro nuevo, interés; simulación por contrato; aprobación |
| PAN-FAC-21 | Cargos pendientes | PT-06 | `/admin/fac/cargos` | Usa PT-06 Bandeja de trabajo. Cargos pendientes. Ítems facturables por cuenta, origen, estado; alta, edición y anulación de los no facturados |
| PAN-FAC-22 | Importaciones de terceros | PT-04 | `/admin/fac/importaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Importaciones de terceros. ExcelImportWizard con formato, mapeo, validación por fila, confirmación |
| PAN-FAC-39 | Marcas no facturar | PT-09 | `/admin/fac/no-facturar` | Usa PT-09 Configuración versionada. Marcas no facturar. Tabla por cuenta/contrato con vigencia y responsable; alta y liberación |

### FAM-FAC-06 Configuración, diseño, numeración y grupos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-25 Grupos de facturación (M05:1718) |
| Portales | admin |
| Rutas | `/admin/fac/config/tipos-comprobante`, `/admin/fac/config/puntos-venta`, `/admin/fac/grupos`, `/admin/fac/config/modalidad` y 6 más |
| Capabilities | `fac.tiposComprobante.configurar`, `fac.puntosVenta.configurar`, `fac.grupos.ver`, `fac.modalidad.configurar` y 5 más |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FAC > Grupos de facturación           [Abrir] [Exportar] [Nuevo*] |
| Grupos de facturación                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipos de comproba… ▼] [Más filtros]                   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Tabla por Modal xl  Domicilio PV/talona Periodici Tipos de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1716, M05:1717, M05:1718, M05:1719, M05:1720, M05:1721): Filtros: Tipos de comprobante; Columnas: Tabla por titular, Modal xl con miembros, Domicilios, PV/talonario, Periodicidad, Tipos de comprobante; Campos: Tabla por titular, Modal xl con miembros, Domicilios, PV/talonario, Periodicidad, Tipos de comprobante, Matriz, Tabla de tipos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-23 | Tipos de comprobante y matriz | PT-09 | `/admin/fac/config/tipos-comprobante` | Usa PT-09 Configuración versionada. Tipos de comprobante y matriz. Tabla de tipos; pestaña Matriz por condición fiscal (versionada) con validación de… |
| PAN-FAC-24 | Puntos de venta y numeradores (reemplazado) | PT-01 | `/admin/fac/config/puntos-venta` | Puntos de venta y numeradores. PV con tipo, canales, servicios; numeradores con último número y última sincronización… |
| PAN-FAC-25 | Grupos de facturación | PT-01 | `/admin/fac/grupos` | Grupos de facturación. Tabla por titular; modal xl con miembros, domicilios, PV/talonario, periodicidad, canales… |
| PAN-FAC-26 | Modalidad de facturación | PT-01 | `/admin/fac/config/modalidad` | Modalidad de facturación. Modalidad por defecto, excepciones por servicio/cuenta/titular, reglas de periodicidad… |
| PAN-FAC-27 | Tramas de recargo | PT-01 | `/admin/fac/config/tramas` | Tramas de recargo. Tabla y modal lg con filas por rango de importe y vencimiento, simulador de importes |
| PAN-FAC-28 | Diseño de comprobantes | PT-01 | `/admin/fac/config/diseno` | Diseño de comprobantes. Plantillas con versiones, reglas de selección, vista previa con datos ficticios y comprobante… |
| PAN-FAC-29 | Gráficos y orden de renglones | PT-05 | `/admin/fac/config/graficos` | Usa PT-05 Tablero, reporte o mapa. Gráficos y orden de renglones. ABM de grupos de gráfico y de orden de renglones |
| PAN-FAC-30 | Formatos de código de barras | PT-03 | `/admin/fac/config/codigos` | Usa PT-03 Formulario o editor. Formatos de código de barras. Editor de segmentos con vista de posiciones, DV, decodificadores, vectores de prueba… |
| PAN-FAC-32 | Talones y documentos de pago | PT-03 | `/admin/fac/talones` | Usa PT-03 Formulario o editor. Talones y documentos de pago. Generar talón sumado o de cuotas; consulta con pagos; eliminar no pagados |
| PAN-FAC-41 | Parámetros de facturación | PT-09 | `/admin/fac/config/parametros` | Usa PT-09 Configuración versionada. Parámetros de facturación. Parámetros de §14 agrupados, con ayuda, valor heredado y origen |

### FAM-FAC-07 Distribución, reparto, cierre, reportes y casos especiales

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-31 Distribución (M05:1724) |
| Portales | admin, empleado |
| Rutas | `/admin/fac/distribucion`, `/admin/fac/config/reparto`, `/admin/fac/franqueo`, `/admin/fac/cierres` y 4 más |
| Capabilities | `fac.distribucion.ver`, `fac.reparto.configurar`, `fac.distribucion.ejecutar`, `fac.cierre.proponer` y 5 más |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FAC > Distribución                    [Abrir] [Exportar] [Nuevo*] |
| Distribución                                                     (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Canales   Agrupació Orden     Tandas    Opciones  Correos   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1724, M05:1726, M05:1727, M05:1728, M05:1729, M05:1730): Columnas: Canales, Agrupación, Orden, Tandas, Opciones de impresión, Correos; Campos: Canales, Agrupación, Orden, Tandas, Opciones de impresión, Correos, Repartidores, Secuencia de paradas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-31 | Distribución | PT-01 | `/admin/fac/distribucion` | Distribución. Corridas por lote o selección; canales, agrupación, orden, tandas; opciones de impresión; seguimiento… |
| PAN-FAC-33 | Rutas de reparto y correos | PT-01 | `/admin/fac/config/reparto` | Rutas de reparto y correos. Rutas, repartidores, secuencia de paradas; correos y tabla de franqueo |
| PAN-FAC-34 | Franqueo según facturas | PT-01 | `/admin/fac/franqueo` | Franqueo según facturas. Selección, importes por correo, generación de cargos |
| PAN-FAC-35 | Cierre de ciclo | PT-04 | `/admin/fac/cierres` | Usa PT-04 Asistente por pasos o proceso masivo. Cierre de ciclo. Cuadre (seleccionados = emitidos + pendientes + excluidos + trasladados), totales, autorización… |
| PAN-FAC-36 | Reportes de facturación | PT-05 | `/admin/fac/reportes` | Usa PT-05 Tablero, reporte o mapa. Reportes de facturación. Reportes de §15 con filtros y exportación |
| PAN-FAC-37 | CVLP | PT-01 | `/admin/fac/cvlp` | CVLP. Proceso por período, comisiones (hasta 3), totales, finalización |
| PAN-FAC-38 | Comprobantes de administración pública | PT-01 | `/admin/fac/administracion-publica` | Comprobantes de administración pública. Selección por período y organismo, carga, quita, impresión. [VERIFICAR] |
| PAN-FAC-40 | Preferencias de entrega | PT-11 | Pestaña en la ficha del titular (M01) | Usa PT-11 Modal, pestaña o componente embebido. Preferencias de entrega. Canales, emails, teléfonos, adhesión, historial |
| PAN-FAC-46 | Reparto | PT-07 | `/app/reparto` | Usa PT-07 Portal del socio y del empleado (PWA). Reparto. Ruta del día, paradas en orden, marcar entregado/devuelto con motivo y foto opcional; offline con… |

### FAM-FAC-08 Facturas del socio y del público

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FAC-43 Mis facturas (M05:1736) |
| Portales | landing, socio |
| Rutas | `/app/facturas`, `/app/facturas/:id`, `/factura` |
| Capabilities | `por.comprobantes.ver`, `por.facturas.consultar` |
| Olas | O4 a O5 |

```text
+------------------------------------------------------------+
| < Mis facturas                                         (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Vencimiento: ········                                  | |
| | Descarga: ········                                     | |
| | Filtros por período: ········                          | |
| | Servicio: ········                                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Vencimiento: ········                                  | |
| | Descarga: ········                                     | |
| | Filtros por período: ········                          | |
| | Servicio: ········                                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M05:1736, M05:1737, M05:1738): Campos: Vencimiento, Descarga, Filtros por período, Servicio, Offline, Bloques por servicio, Gráfico de consumo, Vencimientos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FAC-43 | Mis facturas (componente embebido) | PT-07 | `/app/facturas` | Mis facturas. Lista por cuenta con estado de pago (M07), vencimiento, descarga; filtros por período y servicio… |
| PAN-FAC-44 | Detalle de factura (componente embebido) | PT-07 | `/app/facturas/:id` | Detalle de factura. Bloques por servicio, gráfico de consumo, vencimientos, QR de pago, descarga PDF, botón pagar… |
| PAN-FAC-45 | Consulta de factura sin login (componente embebido) | PT-10 | `/factura` | Usa PT-10 Página pública (landing). Consulta de factura sin login. Número de cuenta + dato de validación + captcha; muestra vencimientos y PDF. Solo si… |
