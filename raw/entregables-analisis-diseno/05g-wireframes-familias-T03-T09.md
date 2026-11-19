# Wireframes por familia de pantallas: T03 a T09

**Artefacto 4.2 (Wireframes). Parte 05g.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: T03 UXD, T04 CFG, T06 INT, T07 MIG, T08 NFR, T09 COM (35 familias).

## T03 UXD: Experiencia, marca y diccionario

Anexo `docs/especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md`, §10. 6 familias, 17 PAN. Catálogo: [17-22-T03-UXD.md](17-catalogo-pantallas/17-22-T03-UXD.md).

### FAM-UXD-01 Marca, diccionario y ayudas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-03 Historial de releases (T03:1288) |
| Portales | admin |
| Rutas | `/admin/configuracion/experiencia/marca`, `/admin/configuracion/experiencia/diccionario`, `/admin/configuracion/experiencia/diccionario/publicaciones`, `/admin/configuracion/experiencia/ayudas` |
| Capabilities | `uxd.marca.ver`, `uxd.diccionario.ver`, `uxd.ayuda.editar` |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > UXD > Historial de releases         [Revertir] [Ver diferencias*] |
| Historial de releases                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Texto ▼] [Módulo ▼] [Tipo ▼] [Canal ▼] [Más filtros]  |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Release   Fecha     Autor     Cambios   Nota      Revertida [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Revertir]                       25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1286, T03:1287, T03:1288, T03:1291): Filtros: Texto, Módulo, Tipo, Canal, Pantalla, "solo personalizadas"; Columnas: Release, Fecha, Autor, Cambios, Nota, Revertida de, Clave, Texto base; Pestañas: Identidad, Colores, Recursos por canal, Sucursales, Login, Splash, Tema; Acciones: Ver diferencias, Revertir, Guardar borrador, Descartar, Publicar, Exportar XLSX/JSON, Importar, Aplicar plantilla, Mostrar claves.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-01 | Editar y publicar la marca | PT-09 | `/admin/configuracion/experiencia/marca` | Usa PT-09 Configuración versionada. Pestañas: Identidad, Colores, Recursos por canal, Sucursales, Login, splash, Tema, Previsualización, Versiones |
| PAN-UXD-02 | Editar y publicar el diccionario | PT-09 | `/admin/configuracion/experiencia/diccionario` | Usa PT-09 Configuración versionada. Filtros: texto, módulo, tipo, canal, pantalla, "solo personalizadas", "con advertencias", "protegidas"; Columnas… |
| PAN-UXD-03 | Historial de releases | PT-01 | `/admin/configuracion/experiencia/diccionario/publicaciones` | Columnas: release, fecha, autor, cambios, nota, revertida de |
| PAN-UXD-06 | Sobrescribir ayudas contextuales | PT-01 | `/admin/configuracion/experiencia/ayudas` | Sobrescribir ayudas contextuales. DataTable + modal lg Por screenId: 6 preguntas + caso de uso; diferencias con base |

### FAM-UXD-02 Navegación, flags y preferencias

| Dato | Valor |
|---|---|
| Patrón base | PT-11 Modal, pestaña o componente embebido ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-04 Mapa del sitio (T03:1289) |
| Portales | admin, socio |
| Rutas | `/admin/configuracion/experiencia/navegacion`, `/admin/configuracion/experiencia/flags`, `/app/perfil/apariencia` |
| Capabilities | `autenticado`, `uxd.navegacion.configurar`, `uxd.flags.configurar` |
| Olas | O0 |
| Wireframe detallado del piloto | W-02 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Pantalla anfitriona: ficha o tablero del módulo                            |
+----------------------------------------------------------------------------+
| +-- Mapa del sitio (componente)                                            |
| |  SiteMapModal xl Buscador: ········                                      |
| |  Clusters/grupos/ítems: ········                                         |
| |  Fijar: ········                                                         |
| |  "No contratado": ········                                               |
| |  FAB por defecto: ········                                               |
| |  [Abrir] [Cerrar]                                                        |
| +--------------------------------------------------                        |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1289, T03:1290, T03:1292, T03:1293): Campos: SiteMapModal xl Buscador, Clusters/grupos/ítems, Fijar, "No contratado", FAB por defecto, Accesos rápidos de Inicio, Ítems ocultos, Fijados sugeridos del admin. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-04 | Mapa del sitio | PT-11 | modal global | Mapa del sitio. SiteMapModal xl Buscador, clusters/grupos/ítems, fijar, "No contratado" (admin) |
| PAN-UXD-05 | Navegación de la PWA por rol y accesos sugeridos del admin por rol | PT-02 | `/admin/configuracion/experiencia/navegacion` | Usa PT-02 Ficha o detalle con pestañas. Navegación de la PWA por rol y accesos sugeridos del admin por rol. Página con pestañas por rol Slots de tabbar, FAB… |
| PAN-UXD-07 | Flags de UI del tenant | PT-09 | `/admin/configuracion/experiencia/flags` | Usa PT-09 Configuración versionada. Flags de UI del tenant. DataTable Flag, descripción, estado, motivo, historial |
| PAN-UXD-08 | Preferencias del usuario | PT-07 | `/app/perfil/apariencia` | Usa PT-07 Portal del socio y del empleado (PWA). Preferencias del usuario. Modal md (admin) / vista (PWA) Tema, densidad, tamaño de texto, reducir movimiento, modo de… |

### FAM-UXD-03 Experiencia de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-09 Catálogo de claves del producto (T03:1294) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/experiencia/diccionario-base`, `/admin/plataforma/experiencia/design-system`, `/admin/plataforma/experiencia/flags` |
| Capabilities | `uxd.plataforma.diccionarioBase.ver`, `uxd.plataforma.tokens.ver`, `uxd.plataforma.flags.configurar` |
| Olas | O0 |

```text
+----------------------------------------------------------------------------+
| Catálogo de claves del producto                                  (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                    [Publicar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Catálogo vivo de … | | Plantillas de diccionar… [______________]     | |
| | > Flags globales     | | DataTable Claves [______________]             | |
| |                      | | Descripciones [______________]                | |
| |                      | | Protegidas [______________]                   | |
| |                      | | Deprecadas [______________]                   | |
| |                      | | Plantillas [______________]                   | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1294, T03:1295, T03:1296): Pestañas: Catálogo vivo de componentes y tokens, Flags globales; Campos: Plantillas de diccionario, DataTable Claves, Descripciones, Protegidas, Deprecadas, Plantillas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-09 | Catálogo de claves del producto | PT-09 | `/admin/plataforma/experiencia/diccionario-base` | Catálogo de claves del producto, plantillas de diccionario y claves faltantes de todos los tenants. DataTable Claves… |
| PAN-UXD-10 | Catálogo vivo de componentes y tokens | PT-09 | `/admin/plataforma/experiencia/design-system` | Catálogo vivo de componentes y tokens. Página Componentes con estados, tokens, prueba de contraste con colores… |
| PAN-UXD-11 | Flags globales | PT-09 | `/admin/plataforma/experiencia/flags` | Flags globales. DataTable Ídem PAN-UXD-07 a nivel plataforma |

### FAM-UXD-04 Login, sin acceso e instalacion

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-13 Login (T03:1298) |
| Portales | landing, socio, transversal |
| Rutas | `/sin-acceso`, `/login`, `/instalar` |
| Capabilities | `público` |
| Olas | O0 |
| Wireframe detallado del piloto | W-01 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Login                                                                |
| [Ingresar*]   [Ver más]                                                    |
+----------------------------------------------------------------------------+
| [ NoAccessView dict ]  [ SinPermiso ]  [ Titulo ]  [ Volver ]              |
| [ Vista Pasos por pla… ]                                                   |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1297, T03:1298, T03:1299): Campos: NoAccessView dict, SinPermiso, Titulo, Volver, Vista Pasos por plataforma. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-12 | Sin permiso | PT-10 | `/sin-acceso` | Sin permiso. NoAccessView dict:ui.sinPermiso.titulo, volver |
| PAN-UXD-13 | Login | PT-10 | `/login` | Login. Login oscuro con marca 10.4 |
| PAN-UXD-14 | Guía de instalación | PT-10 | `/instalar` | Guía de instalación. Vista Pasos por plataforma (Android, iOS, escritorio) |

### FAM-UXD-05 Asistente y directorio de la PWA

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-15 Asistente IA de la PWA. RF-UXD-064 (T03:1300) |
| Portales | empleado, socio |
| Rutas | `/app/asistente`, `/app/empleado/directorio` |
| Capabilities | `por.asistente.ver`, `iam.directorio.ver` |
| Olas | O2 a O11 |

```text
+------------------------------------------------------------+
| < Asistente IA de la PWA. RF-UX…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Habilitable en O11: ········                           | |
| | Vista de conversación en: ········                     | |
| | Pwa-mod Pregunta libre: ········                       | |
| | Sugerencias por contexto: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Habilitable en O11: ········                           | |
| | Vista de conversación en: ········                     | |
| | Pwa-mod Pregunta libre: ········                       | |
| | Sugerencias por contexto: ········                     | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1300, T03:1301): Campos: Habilitable en O11, Vista de conversación en, Pwa-mod Pregunta libre, Sugerencias por contexto, Nunca ejecuta acciones, Motor. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-15 | Asistente IA de la PWA. RF-UXD-064 | PT-07 | `/app/asistente` | Asistente IA de la PWA (ítems SM-PWS-041 y SM-PWE-017). RF-UXD-064 (asistente IA opcional del AppShell); ola O0… |
| PAN-UXD-16 | Directorio interno | PT-07 | `/app/empleado/directorio` | Directorio interno (ítem SM-PWE-015). RF-UXD-063 (espacio del empleado de la PWA); ola O0 (PRO-O0-15) con la vista… |

### FAM-UXD-06 Alertas activas del admin

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-UXD-17 Alertas activas (T03:1302) |
| Portales | admin |
| Rutas | `/admin/inicio/alertas` |
| Capabilities | `bia.tableros.ver` |
| Olas | O0 |

```text
+----------------------------------------------------------------------------+
| Inicio > UXD > Alertas activas                 [Abrir] [Exportar] [Nuevo*] |
| Alertas activas                                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Origen          Antigüedad      Ir al origen    Marcar como vis [...]  |
| -------------------------------------------------------------------------  |
| [ ] ··········      ··········      ··········      ··········       ...   |
| [ ] ··········      ··········      ··········      ··········       ...   |
| [ ] ··········      ··········      ··········      ··········       ...   |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T03:1302): Columnas: Origen, Antigüedad, Ir al origen, Marcar como vista; Campos: Origen, Antigüedad, Ir al origen, Marcar como vista. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-UXD-17 | Alertas activas | PT-01 | `/admin/inicio/alertas` | Alertas activas (ítem SM-ADM-003). RF-UXD-055 (centro de alertas); ola O0 (PRO-O0-15); las alertas de cada módulo… |

## T04 CFG: Configuración y parámetros

Anexo `docs/especificacion/anexos/T04-CFG-configuracion-parametros-maestros.md`, §10. 6 familias, 35 PAN. Catálogo: [17-23-T04-CFG.md](17-catalogo-pantallas/17-23-T04-CFG.md).

### FAM-CFG-01 Centro de configuración, parámetros y versiones

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-03 Ficha de parámetro (T04:1488) |
| Portales | admin |
| Rutas | `/admin/cfg`, `/admin/cfg/parametros`, `/admin/cfg/parametros/:key`, `/admin/cfg/versiones` y 4 más |
| Capabilities | `cfg.parametros.ver`, `cfg.versiones.ver`, `cfg.historia.ver`, `cfg.tecnica.ver` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Ficha de parámetro                                               (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]      [Agregar valor por ámb…*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Definición         | | Alertas de integridad [______________]        | |
| | > Valores por ámbito | | Adopciones pendientes d… [______________]     | |
| | > Cadena de resoluc… | | Secretos faltantes [______________]           | |
| | > Historia           | | Perfiles de servicio in… [______________]     | |
| | > Usado por          | | Accesos a cada módulo [______________]        | |
| | > Cambios            | |                                               | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1486, T04:1487, T04:1488, T04:1489, T04:1490, T04:1491): Filtros: Módulo, Clase, "con valor propio", "deprecados", "sensibles", "V2 #"; Columnas: Etiqueta, Clave, Tipo, Valor efectivo, Ámbitos con valor, Clase, Última modificación, Estado; Pestañas: Definición, Valores por ámbito, Cadena de resolución para un contexto, Historia, Usado por, Cambios, Dependencias; Campos: Alertas de integridad, Adopciones pendientes de plataforma, Secretos faltantes, Perfiles de servicio incompletos, Accesos a cada módulo; Pasos: Árbol módulo, Grupo a la izquierda; Acciones: Agregar valor por ámbito al borrador, Cerrar vigencia, Nueva versión, Editar, Ver ficha, Exportar, Nueva, Clonar, Cancelar, Revertir.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-01 | Centro de configuración | PT-09 | `/admin/cfg` | Campos: versiones en borrador/en revisión/programadas, alertas de integridad, adopciones pendientes de plataforma… |
| PAN-CFG-02 | Explorador de parámetros por módulo y grupo | PT-05 | `/admin/cfg/parametros` | Usa PT-05 Tablero, reporte o mapa. Filtros: módulo, clase, "con valor propio", "deprecados", "sensibles", "V2 #"; Columnas: etiqueta, clave, tipo, valor… |
| PAN-CFG-03 | Ficha de parámetro | PT-09 | `/admin/cfg/parametros/:key` | Pestañas: Definición, Valores por ámbito, Cadena de resolución para un contexto, Historia, Usado por |
| PAN-CFG-04 | Listado de versiones | PT-01 | `/admin/cfg/versiones` | Usa PT-01 Listado con filtros. Filtros: estado, origen, módulo, rango de fechas; Columnas: número, título, origen, clases, estado, fecha efectiva… |
| PAN-CFG-05 | Detalle de versión | PT-02 | `/admin/cfg/versiones/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Cambios, Dependencias, Validación, Simulación, Contratos afectados, política, Revisión, Auditoría |
| PAN-CFG-06 | Consulta "como era" | PT-01 | `/admin/cfg/historia` | Usa PT-01 Listado con filtros. Admin /admin/cfg/historia. Consulta "como era": valor de claves y registros a una fecha efectiva y a una fecha de… |
| PAN-CFG-28 | Estado de configuración técnica del tenant | PT-09 | `/admin/cfg/tecnica` | Columnas: integración, secreto, estado, última verificación |
| PAN-CFG-29 | Perfil de configuración por servicio y ficha por dominio | PT-09 | `/admin/cfg/perfiles-servicio` | Admin /admin/cfg/perfiles-servicio. Perfil de configuración por servicio (BASE §84) y ficha por dominio (BASE §93)… |

### FAM-CFG-02 Tablas, importaciones, calendarios, índices y monedas

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-19 Tablas fiscales de referencia (T04:1504) |
| Portales | admin |
| Rutas | `/admin/cfg/tablas`, `/admin/cfg/tablas/:code`, `/admin/cfg/importaciones`, `/admin/cfg/padrones` y 5 más |
| Capabilities | `cfg.maestros.ver`, `cfg.maestros.importar`, `cfg.fiscal.ver`, `cfg.calendarios.ver` y 3 más |
| Olas | O1 a O4 |

```text
+----------------------------------------------------------------------------+
| Tablas fiscales de referencia                                    (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]      [Agregar atributos del…*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Condiciones IVA    | | Tabla [______________]                        | |
| | > Alícuotas IVA      | | Módulo [______________]                       | |
| | > Condiciones IIBB   | | Ámbito [______________]                       | |
| | > Alícuotas IIBB po… | | Registros [______________]                    | |
| | > Tipos de documento | | Última actualización [______________]         | |
| | > Tablas de regulad… | | Fuente [______________]                       | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1492, T04:1493, T04:1494, T04:1495, T04:1501, T04:1502): Columnas: Tabla, Módulo, Ámbito, Registros, Última actualización, Fuente, Jurisdicción, Régimen; Pestañas: Condiciones IVA, Alícuotas IVA, Condiciones IIBB, Alícuotas IIBB por jurisdicción, Tipos de documento, Tablas de reguladores; Pasos: Archivo, Mapeo (guardable como perfil), Vista previa con errores por fila, Confirmar, CUIT + fecha, Entradas vigentes; Acciones: Adoptar release, Ver diferencias de release, Agregar atributos del tenant, Abrir editor, Nuevo/editar, Inactivar, Cerrar vigencia, Unificar, Importar, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-07 | Catálogo de tablas maestras por módulo/dominio | PT-09 | `/admin/cfg/tablas` | Columnas: tabla, módulo, ámbito, registros, última actualización, fuente |
| PAN-CFG-08 | Editor uniforme de tabla maestra | PT-03 | `/admin/cfg/tablas/:code` | Usa PT-03 Formulario o editor. Admin /admin/cfg/tablas/:code. Editor uniforme de tabla maestra. DataTable con columnas del esquema, búsqueda, filtros… |
| PAN-CFG-09 | Asistente e historial de importaciones de maestros y padrones | PT-04 | `/admin/cfg/importaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: `ExcelImportWizard`: tabla destino y …, archivo, mapeo (guardable como perfil), vista previa con errores por… |
| PAN-CFG-10 | Padrones fiscales disponibles y su estado | PT-01 | `/admin/cfg/padrones` | Usa PT-01 Listado con filtros. Columnas: jurisdicción, régimen, fuente, mantenido por, último período, filas; Pasos: CUIT + fecha, entradas vigentes |
| PAN-CFG-16 | Calendarios aplicables y feriados | PT-09 | `/admin/cfg/calendarios` | Columnas: fecha, nombre, tipo, calendario, fuente |
| PAN-CFG-17 | Series de índices y sus valores | PT-05 | `/admin/cfg/indices` | Usa PT-05 Tablero, reporte o mapa. Admin /admin/cfg/indices. Series de índices y sus valores; adopción de series de plataforma por propósito. Grilla de… |
| PAN-CFG-18 | Monedas y cotizaciones | PT-01 | `/admin/cfg/monedas` | Usa PT-01 Listado con filtros. Columnas: moneda, ISO, código ARCA, símbolo, permitida para cobro, redondeo, cotizaciones por fecha/hora |
| PAN-CFG-19 | Tablas fiscales de referencia | PT-09 | `/admin/cfg/fiscal` | Pestañas: condiciones IVA, alícuotas IVA, condiciones IIBB, alícuotas IIBB por jurisdicción, tipos de documento… |
| PAN-CFG-20 | Enumeraciones | PT-09 | `/admin/cfg/enumeraciones` | Admin /admin/cfg/enumeraciones. Enumeraciones configurables. Grilla de enumeraciones (tipo… |
| PAN-CFG-30 | En uso por (componente de tablas maestras) | PT-09 | `/admin/cfg/tablas/:code` | Admin, modal sin ruta propia: se abre desde el contador "en uso por" de PAN-CFG-08 (/admin/cfg/tablas/:code) y de la… |

### FAM-CFG-03 Territorio

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-12 Calles (T04:1497) |
| Portales | admin, campo, socio |
| Rutas | `/admin/cfg/geografia`, `/admin/cfg/calles`, `/admin/cfg/territorio`, `/admin/cfg/mapa` y 3 más |
| Capabilities | `cfg.geo.ver`, `cfg.maestros.editar`, `cfg.geo.confirmarPunto` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > CFG > Calles    [Alias] [Proponer a plataf…] [Crear calle local*] |
| Calles                                                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Provincia ▼] [Localidad ▼] [Origen ▼] [Estado ▼]      |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Nombre    Tipo      Localidad Alturas   Origen    Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   [Activo]   ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   [Pendient  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Alias] [Proponer a plataf…] [U… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1496, T04:1497, T04:1498, T04:1499, T04:1500, T04:1516): Filtros: Provincia, Localidad, Origen, Estado; Columnas: Nombre, Tipo, Localidad, Alturas, Origen, Estado, En uso, Entidad; Pasos: País, Provincia, Departamento, Localidad, con códigos externos y CP, Cascada provincia, Localidad, Calle (homónimos con contexto); Acciones: Crear calle local, Alias, Proponer a plataforma, Unificar, Ver en mapa, Agregar localidad propia, Editar atributos propios, Ver fuente, ABM, Unificar barrios.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-11 | Unidades territoriales | PT-04 | `/admin/cfg/geografia` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: país, provincia, departamento, localidad, con códigos externos y CP |
| PAN-CFG-12 | Calles | PT-01 | `/admin/cfg/calles` | Filtros: provincia, localidad, origen, estado; Columnas: nombre, tipo, localidad, alturas, origen, estado, en uso |
| PAN-CFG-13 | Barrios, zonas y distritos/secciones catastrales del tenant | PT-02 | `/admin/cfg/territorio` | Usa PT-02 Ficha o detalle con pestañas. Admin /admin/cfg/territorio. Barrios, zonas y distritos/secciones catastrales del tenant. Pestañas por tabla; polígono… |
| PAN-CFG-14 | Selector de dirección y punto en Google Maps y visor de mapa | PT-05 | `/admin/cfg/mapa` | Usa PT-05 Tablero, reporte o mapa. Pasos: Cascada provincia, departamento, localidad, calle (homónimos con contexto)… |
| PAN-CFG-15 | Revisión de georreferencias | PT-01 | `/admin/cfg/georreferencias/revision` | Columnas: entidad, dirección original, estado, precisión, intentos, zona, antigüedad |
| PAN-CFG-31 | Selector de dirección simplificado para el socio | PT-07 | `/app/tramites/nuevo/:formCode` | Usa PT-07 Portal del socio y del empleado (PWA). Pwa-socio y landing, componente sin ruta propia que se monta en las rutas de los flujos anfitriones… |
| PAN-CFG-32 | Confirmación/corrección del punto en terreno por el técnico | PT-08 | `/app/campo/work-orders/:id` | Usa PT-08 App de campo móvil (offline). Pwa-campo, componente sin ruta propia: botón "Confirmar ubicación" de la ficha de OT PAN-TEC-51… |

### FAM-CFG-04 Campos extra, formularios y vistas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-21 Definición de campos extra por entidad (T04:1506) |
| Portales | admin |
| Rutas | `/admin/cfg/campos-extra`, `/admin/cfg/formularios`, `/admin/cfg/vistas` |
| Capabilities | `cfg.camposExtra.configurar`, `cfg.formularios.configurar`, `cfg.vistas.crear` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > CFG > Definición de cam… [Activar por versi…] [Deprecar] [Nuevo*] |
| Definición de campos extra por entidad                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Estado ▼] [Más filtros]                      |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Clave     Etiqueta  Tipo      Obligator Único     Sección   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Activar por versi…] [Deprecar]… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1506, T04:1507, T04:1508): Filtros: Tipo, Estado; Columnas: Clave, Etiqueta, Tipo, Obligatorio, Único, Sección, Visibilidad, Estado; Acciones: Nuevo, Activar por versión, Deprecar, Valores de lista, Agregar a versión, Restablecer, Guardar, Guardar como, Compartir con rol/tenant, Marcar por defecto.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-21 | Definición de campos extra por entidad | PT-01 | `/admin/cfg/campos-extra` | Columnas: clave, etiqueta, tipo, obligatorio, único, sección, visibilidad, estado |
| PAN-CFG-22 | Personalización de formularios del registro de formularios | PT-03 | `/admin/cfg/formularios` | Usa PT-03 Formulario o editor. Admin /admin/cfg/formularios. Personalización de formularios del registro de formularios personalizables. Lista de… |
| PAN-CFG-23 | Gestión de vistas guardadas | PT-01 | `/admin/cfg/vistas` | Admin (panel en cada DataTable) + /admin/cfg/vistas. Gestión de vistas guardadas. Panel: columnas, filtros, orden… |

### FAM-CFG-05 Configuración de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-24 Paquetes semilla y su aplicación (T04:1509) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/cfg/semillas`, `/admin/plataforma/cfg/registro`, `/admin/plataforma/cfg/tablas`, `/admin/plataforma/cfg/equivalencias` |
| Capabilities | `pla.cfg.semillas.administrar`, `pla.cfg.registro.ver`, `pla.cfg.tablasPlataforma.editar`, `pla.cfg.equivalencias.editar` |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > CFG > Paquetes semilla y su aplic… [Retirar en bloque] [Aplicar*] |
| Paquetes semilla y su aplicación                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado de ingestas ▼] [Más filtros]                   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Releases  Estado de Tenants c Tabla     MOD_VAR   COD_VAR   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   [Activo]  ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   [Pendient ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   [Activo]  ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Retirar en bloque]              25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1509, T04:1510, T04:1511, T04:1512): Filtros: Estado de ingestas; Columnas: Releases, Estado de ingestas, Tenants con adopción pendiente, Tabla, MOD_VAR, COD_VAR, Nombre legacy, Uso directo; Pasos: Equivalencias V2, Clave (T04b) para migración; Acciones: Aplicar, Retirar en bloque, Editar default de plataforma, Ver tenants con valor inválido, Preparar release, Publicar, Lanzar ingesta, Aprobar propuestas de calles, Editar, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-24 | Paquetes semilla y su aplicación | PT-01 | `/admin/plataforma/cfg/semillas` | Plataforma /platform/cfg/semillas y admin demo /admin/cfg/semillas. Paquetes semilla y su aplicación. Paquetes… |
| PAN-CFG-25 | Registro de definiciones y defaults de plataforma | PT-03 | `/admin/plataforma/cfg/registro` | Usa PT-03 Formulario o editor. Plataforma /platform/cfg/registro. Registro de definiciones (solo lectura desde código) y defaults de plataforma… |
| PAN-CFG-26 | Tablas de plataforma y releases | PT-09 | `/admin/plataforma/cfg/tablas` | Usa PT-09 Configuración versionada. Columnas: releases, estado de ingestas, tenants con adopción pendiente |
| PAN-CFG-27 | Equivalencias V2 → clave para migración | PT-04 | `/admin/plataforma/cfg/equivalencias` | Usa PT-04 Asistente por pasos o proceso masivo. Columnas: tabla, MOD_VAR, COD_VAR, nombre legacy, uso directo, destino, claves, transformación, PRM-ID; Pasos… |

### FAM-CFG-06 Organización

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CFG-34 Sucursales (T04:1519) |
| Portales | admin |
| Rutas | `/admin/cfg/entidades-juridicas`, `/admin/cfg/sucursales`, `/admin/cfg/puestos` |
| Capabilities | `cfg.entidadesJuridicas.ver`, `cfg.sucursales.ver`, `cfg.puestos.editar` |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > CFG > Sucursales [Cambiar entidad c…] [Inactivar] [Nueva/editar*] |
| Sucursales                                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Entidad ▼] [Localidad ▼] [Uso ▼] [Más filtros]        |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Entidad j Localidad Usos      Casa cent [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Cambiar entidad c…] [Inactivar] 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T04:1518, T04:1519, T04:1520): Filtros: Entidad, Localidad, Uso; Columnas: Código, Nombre, Entidad jurídica, Localidad, Usos, Casa central, Estado, Razón social; Acciones: Nueva/editar, Cambiar entidad con fecha efectiva, Inactivar, Marcar por defecto, Nuevo/editar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CFG-33 | Entidades jurídicas del tenant | PT-01 | `/admin/cfg/entidades-juridicas` | Columnas: código, razón social, CUIT, condición IVA, régimen IIBB, por defecto, sucursales, estado |
| PAN-CFG-34 | Sucursales | PT-01 | `/admin/cfg/sucursales` | Filtros: entidad, localidad, uso; Columnas: código, nombre, entidad jurídica, localidad, usos, casa central, estado |
| PAN-CFG-35 | Puestos por sucursal | PT-01 | `/admin/cfg/puestos` | Columnas: código, nombre, sucursal, tipo, agente local, dispositivos, estado |

## T06 INT: Integraciones

Anexo `docs/especificacion/anexos/T06-INT-integraciones.md`, §10. 4 familias, 20 PAN. Catálogo: [17-24-T06-INT.md](17-catalogo-pantallas/17-24-T06-INT.md).

### FAM-INT-01 Catálogo, conexiones y credenciales

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INT-06 Vista consolidada de la bóveda (T06:1037) |
| Portales | admin, plataforma |
| Rutas | `/admin/plataforma/integraciones/proveedores`, `/admin/integraciones/catalogo`, `/admin/integraciones/conexiones`, `/admin/integraciones/credenciales` y 3 más |
| Capabilities | `int.proveedores.configurar`, `int.conexiones.ver`, `int.credenciales.gestionar`, `int.certificados.gestionar` y 1 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > INT > Vista consolidada de la bóveda      [Cargar/rotar/revocar*] |
| Vista consolidada de la bóveda                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Estado ▼] [Cargada por/fecha ▼]              |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Conexión  Credencia Tipo      Versión   Estado    Cargada p [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar]                       25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T06:1032, T06:1033, T06:1034, T06:1037, T06:1038, T06:1044): Filtros: Tipo, Estado, Cargada por/fecha; Columnas: Conexión, Credencial, Tipo, Versión, Estado, Cargada por/fecha, Vencimiento, Próxima rotación; Pestañas: General, Configuración, Credenciales, Certificados, Alcance, Calendario, Webhook; Acciones: Cargar/rotar/revocar, Probar conexión, Activar, Pausar, Suspender, Cambiar modo, Copiar a otro tenant.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INT-01 | Catálogo de proveedores y versiones de adaptadores | PT-09 | `/admin/plataforma/integraciones/proveedores` | Usa PT-09 Configuración versionada. Columnas: código, tipo, versión, estado, capacidades, ambientes, licencia, modal `xl` de edición |
| PAN-INT-02 | Ver integraciones disponibles para la licencia del tenant y su ficha | PT-02 | `/admin/integraciones/catalogo` | Usa PT-02 Ficha o detalle con pestañas. Ver integraciones disponibles para la licencia del tenant y su ficha. Tarjetas por tipo (Fiscal, Cobranza, Pasarelas… |
| PAN-INT-03 | Alta y gestión de conexiones | PT-03 | `/admin/integraciones/conexiones` | Usa PT-03 Formulario o editor. Pestañas: General, Configuración, Credenciales, Certificados, Alcance, Calendario, Webhook, Salud, Historial |
| PAN-INT-06 | Vista consolidada de la bóveda | PT-01 | `/admin/integraciones/credenciales` | Columnas: conexión, credencial, tipo, versión, estado, cargada por/fecha, vencimiento, próxima rotación, último uso |
| PAN-INT-07 | Certificados y asistente ARCA | PT-04 | `/admin/integraciones/certificados` | Usa PT-04 Asistente por pasos o proceso masivo. Certificados y asistente ARCA. Listado con vencimiento y estado; asistente en 4 pasos: (1) datos (CUIT, alias… |
| PAN-INT-13 | Layouts | PT-03 | `/admin/integraciones/layouts` | Usa PT-03 Formulario o editor. Layouts. Visor de registros y campos; editor (plataforma o variante del tenant); prueba con archivo de muestra: genera… |
| PAN-INT-17 | Agentes locales | PT-01 | `/admin/integraciones/agentes` | Agentes locales. Alta (código de emparejamiento de un uso), dispositivos, estado/latido, versión, comandos recientes… |

### FAM-INT-02 Tableros y consumo de integraciones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INT-18 Consumo y cuotas (T06:1049) |
| Portales | admin, plataforma |
| Rutas | `/admin/integraciones/tablero`, `/admin/plataforma/integraciones/tablero`, `/admin/integraciones/consumo`, `/admin/integraciones/ia` |
| Capabilities | `int.monitoreo.ver` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > INT > Consumo y cuotas                [Abrir] [Exportar] [Nuevo*] |
| Consumo y cuotas                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Consumo   Cuotas    Por conex Mes       Mensajes  Consultas [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T06:1035, T06:1036, T06:1049, T06:1051): Columnas: Consumo, Cuotas, Por conexión, Mes, Mensajes, Consultas de mapas; Campos: Consumo, Cuotas, Por conexión, Mes, Mensajes, Consultas de mapas; Indicadores: Conexiones OK/degradadas/caídas, Operaciones del día por estado, Inciertas, Bandeja abierta, Webhooks rechazados, Archivos esperados no recibidos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INT-04 | Tablero del tenant | PT-05 | `/admin/integraciones/tablero` | Usa PT-05 Tablero, reporte o mapa. Indicadores: conexiones OK/degradadas/caídas, operaciones del día por estado, inciertas, bandeja abierta, webhooks… |
| PAN-INT-05 | Tablero global | PT-05 | `/admin/plataforma/integraciones/tablero` | Usa PT-05 Tablero, reporte o mapa. Tablero global. Mismo contenido agregado por tenant y por proveedor; ranking de tenants con incidencias; estado de… |
| PAN-INT-18 | Consumo y cuotas | PT-01 | `/admin/integraciones/consumo` | Consumo y cuotas. Por conexión y mes: mensajes, consultas de mapas, tokens IA, consultas ARCA, archivos; cuota y % usado |
| PAN-INT-20 | Uso de IA | PT-01 | `/admin/integraciones/ia` | Uso de IA. Por función: consultas, tokens, costo, % propuestas aceptadas; política de datos personales del tenant |

### FAM-INT-03 Operaciones y bandejas de integración

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INT-08 Seguimiento de operaciones (T06:1039) |
| Portales | admin, plataforma |
| Rutas | `/admin/integraciones/operaciones`, `/admin/integraciones/bandeja`, `/admin/integraciones/bitacora`, `/admin/integraciones/webhooks` y 2 más |
| Capabilities | `int.operaciones.ver`, `int.operaciones.reintentar`, `int.bitacora.ver`, `int.webhooks.configurar` y 2 más |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > INT > Seguimiento de operaciones                    [Reintentar*] |
| Seguimiento de operaciones                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Conexión ▼] [Tipo ▼] [Estado ▼]                       |
| [Entidad de negocio ▼] [Más filtros]                                       |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Fecha     Conexión  Dirección Canal     Acción    Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   [Activo]   ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   [Pendient  ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   ·······   [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar]                       25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T06:1039, T06:1040, T06:1041, T06:1042, T06:1046, T06:1047): Filtros: Conexión, Tipo, Estado, Entidad de negocio, Lote, Fecha; Columnas: Fecha, Conexión, Dirección, Canal, Acción, Estado, Duración, Correlación; Acciones: Reintentar, Cancelar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INT-08 | Seguimiento de operaciones | PT-01 | `/admin/integraciones/operaciones` | Filtros: conexión, tipo, estado, entidad de negocio, lote, fecha, correlación |
| PAN-INT-09 | Bandeja de operaciones detenidas | PT-06 | `/admin/integraciones/bandeja` | Usa PT-06 Bandeja de trabajo. Bandeja de operaciones detenidas. Agrupado por causa (credencial, validación, incierta, permanente, circuito); acción… |
| PAN-INT-10 | Bitácora de mensajes | PT-01 | `/admin/integraciones/bitacora` | Columnas: fecha, conexión, dirección, canal, acción, estado, duración, correlación |
| PAN-INT-11 | Bandeja de webhooks | PT-06 | `/admin/integraciones/webhooks` | Usa PT-06 Bandeja de trabajo. Bandeja de webhooks. Recibidos, verificados, rechazados, duplicados, fallidos; detalle saneado; reprocesar |
| PAN-INT-15 | Alertas | PT-01 | `/admin/integraciones/alertas` | Alertas. Lista con severidad, tipo, conexión, contador, estado; reconocer, resolver, silenciar por período con motivo |
| PAN-INT-16 | Contingencias | PT-01 | `/admin/integraciones/contingencias` | Contingencias. Declarar (modal con modo alternativo según ficha), seguimiento, cierre con conciliación |

### FAM-INT-04 Archivos, conciliaciones e identificadores

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INT-19 Búsqueda de identificadores externos (T06:1050) |
| Portales | admin |
| Rutas | `/admin/integraciones/archivos`, `/admin/integraciones/conciliaciones`, `/admin/integraciones/identificadores` |
| Capabilities | `int.archivos.ver`, `int.conciliaciones.ver`, `int.operaciones.ver` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > INT > Búsqueda de identificador… [Aprobar] [Descargar] [Generar*] |
| Búsqueda de identificadores externos                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Buscar po Navegar a Pestañas  Entrantes Archivo   Layout    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aprobar] [Descargar] [Reenviar… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T06:1043, T06:1045, T06:1050): Columnas: Buscar por id externo, Navegar a la entidad, Pestañas Salientes, Entrantes, Archivo, Layout; Campos: Buscar por id externo, Navegar a la entidad, Pestañas Salientes, Entrantes, Archivo, Layout, Conexión; Pasos: Subir, Preview con errores por línea, Confirmar; Acciones: Generar, Aprobar, Descargar, Reenviar SFTP, Descargar archivo de errores.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INT-12 | Intercambio de archivos | PT-02 | `/admin/integraciones/archivos` | Usa PT-02 Ficha o detalle con pestañas. Pasos: subir, preview con errores por línea, confirmar |
| PAN-INT-14 | Conciliaciones por conector | PT-06 | `/admin/integraciones/conciliaciones` | Usa PT-06 Bandeja de trabajo. Conciliaciones por conector. Lista por período y conexión; detalle externo vs. interno (bruto, comisión, IVA comisión… |
| PAN-INT-19 | Búsqueda de identificadores externos | PT-01 | `/admin/integraciones/identificadores` | Búsqueda de identificadores externos. Buscar por id externo (pago, QR, adhesión, medidor) y navegar a la entidad |

## T07 MIG: Migración desde ProCoop

Anexo `docs/especificacion/anexos/T07-MIG-migracion-procoop.md`, §10. 5 familias, 23 PAN. Catálogo: [17-25-T07-MIG.md](17-catalogo-pantallas/17-25-T07-MIG.md).

### FAM-MIG-01 Proyectos de migración

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MIG-01 Listado de proyectos por cooperativa (T07:932) |
| Portales | admin, plataforma |
| Rutas | `/admin/plataforma/migrations`, `/admin/plataforma/migrations/:id`, `/admin/plataforma/migrations/:id/sources`, `/admin/plataforma/migrations/:id/inventory` y 2 más |
| Capabilities | `mig.proyectos.ver`, `mig.proyectos.configurar`, `mig.snapshots.crear`, `mig.anonimizacion.ejecutar` |
| Olas | O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > M… [Descargar manifie…] [Anonimizar a nuev…] [Extraer full/delta… |
| Listado de proyectos por cooperativa                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Tenant    Sigla     Versión P Estado    Dominio a [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Descargar manifie…] [Anonimiza… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T07:932, T07:933, T07:934, T07:935, T07:936, T07:953): Filtros: Estado; Columnas: Código, Tenant, Sigla, Versión ProCoop, Estado, Dominio actual, Último snapshot, Próximo hito; Acciones: Extraer full/delta/final, Descargar manifiesto, Anonimizar a nuevo snapshot.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MIG-01 | Listado de proyectos por cooperativa | PT-01 | `/admin/plataforma/migrations` | Columnas: código, tenant, sigla, versión ProCoop, estado, dominio actual, último snapshot, próximo hito |
| PAN-MIG-02 | Tablero del proyecto | PT-05 | `/admin/plataforma/migrations/:id` | Usa PT-05 Tablero, reporte o mapa. Tablero del proyecto. Línea de fases F1–F13; tarjetas por dominio con estado de convivencia; conciliaciones… |
| PAN-MIG-03 | Fuentes y accesos | PT-01 | `/admin/plataforma/migrations/:id/sources` | Fuentes y accesos. Fuentes con tipo, modo readonly, referencia de credencial (bóveda), prueba de conexión |
| PAN-MIG-04 | Inventario de 659 tablas | PT-09 | `/admin/plataforma/migrations/:id/inventory` | Usa PT-09 Configuración versionada. Columnas: sección CAT, tabla, filas, estrategia, destino, anexo, ola, override, motivo, filtros por… |
| PAN-MIG-05 | Snapshots | PT-01 | `/admin/plataforma/migrations/:id/snapshots` | Snapshots. Listado (tipo, asOf, tablas, filas, hash, anonimizado, retención); acciones: extraer full/delta/final… |
| PAN-MIG-22 | Perfiles de anonimización | PT-02 | `/admin/plataforma/migrations/anonymization` | Usa PT-02 Ficha o detalle con pestañas. Perfiles de anonimización. Reglas por tabla/columna, prueba sobre muestra, verificación de fuga |

### FAM-MIG-02 Mapeo y corridas

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MIG-08 Mapas de valores (T07:939) |
| Portales | admin, plataforma |
| Rutas | `/admin/plataforma/migrations/mapping-sets`, `/admin/migration/value-maps`, `/admin/plataforma/migrations/:id/runs` |
| Capabilities | `mig.reglas.editar`, `mig.valores.editar`, `mig.corridas.ejecutar` |
| Olas | O1 a O11 |

```text
+----------------------------------------------------------------------------+
| Mapas de valores            Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Sucursal ▼] [Servicio ▼]                                                  |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Valor orig Valor dest Aprobado p Conjuntos  Reglas de  Árbol tabl [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T07:938, T07:939, T07:940): Columnas: Valor origen, Valor destino, Aprobado por, Conjuntos, Reglas de mapeo, Árbol tabla → reglas; Campos: Valor origen, Valor destino, Aprobado por, Conjuntos, Reglas de mapeo, Árbol tabla → reglas, Publicar con changelog, Diff entre versiones; Pasos: Árbol tabla, Reglas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MIG-07 | Conjuntos y reglas de mapeo | PT-09 | `/admin/plataforma/migrations/mapping-sets` | Usa PT-09 Configuración versionada. Pasos: Árbol tabla, reglas |
| PAN-MIG-08 | Mapas de valores | PT-05 | `/admin/migration/value-maps` | Mapas de valores. Valor origen (con descripción ProCoop), valor destino (select del catálogo GoodApps), aprobado por… |
| PAN-MIG-09 | Corridas de migración | PT-04 | `/admin/plataforma/migrations/:id/runs` | Usa PT-04 Asistente por pasos o proceso masivo. Corridas. Listado con tipo, alcance, estado, estadísticas; lanzar corrida (modal lg: tipo, snapshot, conjunto… |

### FAM-MIG-03 Calidad de datos migrados

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MIG-10 Rechazos y advertencias (T07:941) |
| Portales | admin |
| Rutas | `/admin/migration/profiling`, `/admin/migration/issues`, `/admin/migration/quality/persons`, `/admin/migration/quality/addresses` y 1 más |
| Capabilities | `mig.perfilado.ver`, `mig.rechazos.ver`, `mig.calidad.sanear`, `mig.proyectos.ver` |
| Olas | O0 a O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > MIG > Rechazos y adver… [Excluir] [Aceptar advertenc…] [Asignar*] |
| Rechazos y advertencias                                          (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Corrida   Tabla     Clave Pro Código    Severidad Campo     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Excluir] [Aceptar advertenc…] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T07:937, T07:941, T07:942, T07:943, T07:950): Columnas: Corrida, Tabla, Clave ProCoop, Código, Severidad, Campo, Valor, Acción sugerida; Acciones: Asignar, Excluir, Aceptar advertencia, Corregir en staging, Reprocesar selección.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MIG-06 | Perfilado de calidad | PT-02 | `/admin/migration/profiling` | Usa PT-02 Ficha o detalle con pestañas. Perfilado de calidad. Por tabla/columna: nulos, distintos, min/max, formatos, huérfanos; comparación con snapshot… |
| PAN-MIG-10 | Rechazos y advertencias | PT-01 | `/admin/migration/issues` | Columnas: corrida, tabla, clave ProCoop, código, severidad, campo, valor, acción sugerida, dónde corregir, asignado |
| PAN-MIG-11 | Saneamiento de personas y duplicados | PT-01 | `/admin/migration/quality/persons` | Saneamiento de personas y duplicados. Pares/grupos candidatos con puntaje, comparación lado a lado, fusionar/no… |
| PAN-MIG-12 | Normalización de domicilios y calles | PT-01 | `/admin/migration/quality/addresses` | Normalización de domicilios y calles. Calles origen vs callejero, sugerencias por similitud, consolidación… |
| PAN-MIG-19 | Alias de claves heredadas | PT-01 | `/admin/migration/key-aliases` | Alias de claves heredadas. Búsqueda por valor (código de barras, identificador ente, código anterior), destino… |

### FAM-MIG-04 Conciliación y operación en paralelo

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MIG-15 Comparación de una factura (T07:946) |
| Portales | admin |
| Rutas | `/admin/migration/reconciliations`, `/admin/migration/parallel`, `/admin/migration/parallel/:runId/compare/:id` |
| Capabilities | `mig.conciliacion.ver`, `mig.paralelo.ver`, `mig.paralelo.justificar` |
| Olas | O1 a O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > MIG > Comparación de una factura                        (?) Ayuda |
| Comparación de una factura  [A… [Ver historial] [Cambiar estado] [Editar*] |
+----------------------------------------------------------------------------+
| Dos columnas  con r…: ········  Cantidades: ········     Conceptos: ·····… |
| Impuestos: ········      Vencimientos: ········   Detalle por titular…: ·… |
+----------------------------------------------------------------------------+
| Conciliaciones po… | Tablero de corrid…                                    |
| ==================                                                         |
| Dos column Cantidades Conceptos  Impuestos  Vencimient Detalle po [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   dd-mm-yyyy ········    ...     |
| ········   ········   ········   ········   dd-mm-yyyy ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T07:944, T07:945, T07:946): Columnas: Dos columnas con renglones, Cantidades, Conceptos, Impuestos, Vencimientos, Detalle por titular-servicio; Pestañas: Conciliaciones por dominio, Tablero de corrida paralela; Campos: Dos columnas con renglones, Cantidades, Conceptos, Impuestos, Vencimientos, Detalle por titular-servicio, Depósito, Cuenta contable. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MIG-13 | Conciliaciones por dominio | PT-06 | `/admin/migration/reconciliations` | Usa PT-06 Bandeja de trabajo. Conciliaciones por dominio. Checks con origen/destino/diferencia/tolerancia/estado; detalle por titular-servicio… |
| PAN-MIG-14 | Tablero de corrida paralela | PT-05 | `/admin/migration/parallel` | Usa PT-05 Tablero, reporte o mapa. Tablero de corrida paralela. Por servicio y período: comparados, iguales, tolerancia, explicados, pendientes, no… |
| PAN-MIG-15 | Comparación de una factura | PT-02 | `/admin/migration/parallel/:runId/compare/:id` | Comparación de una factura. Dos columnas (ProCoop / GoodApps) con renglones, cantidades, conceptos, impuestos… |

### FAM-MIG-05 Corte, aceptación e histórico

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MIG-16 Convivencia y by-pass (T07:947) |
| Portales | admin, socio |
| Rutas | `/admin/migration/coexistence`, `/admin/migration/cutover`, `/admin/migration/rollback`, `/app/history` y 1 más |
| Capabilities | `mig.bypass.configurar`, `mig.corte.planificar`, `mig.rollback.ejecutar`, `mig.archivo.ver` y 1 más |
| Olas | O0 a O11 |

```text
+----------------------------------------------------------------------------+
| Inicio > MIG > Convivencia y by-pass           [Abrir] [Exportar] [Nuevo*] |
| Convivencia y by-pass                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Convivenc By-pass   Criterios Runbook c Responsab Prerrequi [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T07:947, T07:948, T07:949, T07:951, T07:952, T07:954): Columnas: Convivencia, By-pass, Criterios de salida, Runbook con pasos, Responsables, Prerrequisitos; Campos: Convivencia, By-pass, Criterios de salida, Runbook con pasos, Responsables, Prerrequisitos, Criterios go/no-go en semáforo, Decisión go. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MIG-16 | Convivencia y by-pass | PT-01 | `/admin/migration/coexistence` | Convivencia y by-pass. Matriz dominio × sistema de registro; sincronizaciones con último resultado; criterios de… |
| PAN-MIG-17 | Plan de corte | PT-04 | `/admin/migration/cutover` | Usa PT-04 Asistente por pasos o proceso masivo. Plan de corte. Runbook con pasos, responsables, prerrequisitos, criterios go/no-go en semáforo; decisión go (doble… |
| PAN-MIG-18 | Rollback | PT-01 | `/admin/migration/rollback` | Rollback. Diario post-corte por tipo; exportar a formatos ProCoop; ejecutar con doble aprobación |
| PAN-MIG-20 | Consultar histórico | PT-11 | pestaña "Histórico ProCoop" en fichas de persona, cuenta, contrato, proveedor, empleado | Usa PT-11 Modal, pestaña o componente embebido. Consultar histórico. Listado de legacyRecords y documentos readOnly vinculados, con filtros por tabla y fecha; vista… |
| PAN-MIG-21 | Ver comprobantes y pagos históricos | PT-07 | `/app/history` | Usa PT-07 Portal del socio y del empleado (PWA). Ver comprobantes y pagos históricos. Cards con marca "Sistema anterior", descarga de PDF original |
| PAN-MIG-23 | Acta de aceptación | PT-01 | `/admin/migration/acceptance` | Acta de aceptación. Resumen de conciliaciones, paralelo y pendientes aceptados; firma electrónica (T11) |

## T08 NFR: No funcionales y seguridad

Anexo `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`, §10. 4 familias, 18 PAN. Catálogo: [17-26-T08-NFR.md](17-catalogo-pantallas/17-26-T08-NFR.md).

### FAM-NFR-01 Privacidad y derechos del titular

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-NFR-02 Inventario de datos por módulo/colección/campo (T08:1128) |
| Portales | admin, empleado, landing, socio |
| Rutas | `/admin/privacidad/tratamientos`, `/admin/privacidad/inventario`, `/admin/privacidad/avisos`, `/admin/privacidad/consentimientos` y 4 más |
| Capabilities | `nfr.tratamientos.ver`, `nfr.inventarioDatos.ver`, `nfr.avisos.ver`, `nfr.consentimientos.ver` y 4 más |
| Olas | O1 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > NFR > Inventario de datos por módulo… [Abrir] [Exportar] [Nuevo*] |
| Inventario de datos por módulo/colección/campo                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Exposició Solo lect Plazo     DataTable Exportar  ScreenHel [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T08:1127, T08:1128, T08:1129, T08:1130, T08:1131, T08:1132): Columnas: Exposición, Solo lectura salvo finalidad, Plazo, DataTable, Exportar XLSX/PDF, ScreenHelp; Campos: Exposición, Solo lectura salvo finalidad, Plazo, DataTable, Exportar XLSX/PDF, ScreenHelp, Estado vacío, "Cargar plantilla". El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-NFR-01 | Registro de tratamientos | PT-03 | `/admin/privacidad/tratamientos` | Usa PT-03 Formulario o editor. Registro de tratamientos: DataTable (código, finalidad, base legal, categorías, subencargados, plazo, estado); modal… |
| PAN-NFR-02 | Inventario de datos por módulo/colección/campo | PT-01 | `/admin/privacidad/inventario` | Inventario de datos por módulo/colección/campo con filtros por sensibilidad y exposición; solo lectura salvo finalidad… |
| PAN-NFR-03 | Avisos por canal y versión | PT-01 | `/admin/privacidad/avisos` | Avisos por canal y versión, vista previa "celular", publicar (ConfirmDialog), diferencias entre versiones. DataTable +… |
| PAN-NFR-04 | Consentimientos | PT-01 | `/admin/privacidad/consentimientos` | Consulta por persona o finalidad, historial, evidencia, exportación auditada. DataTable |
| PAN-NFR-05 | Solicitudes de derechos | PT-03 | `/admin/privacidad/solicitudes` | Usa PT-03 Formulario o editor. Bandeja con semáforo de plazo, filtros por tipo/estado/canal, ficha con hallazgos por colección, decisiones por… |
| PAN-NFR-06 | Políticas de conservación | PT-09 | `/admin/privacidad/conservacion` | Usa PT-09 Configuración versionada. Políticas (tabla 10.3) con mínimos/máximos de plataforma, vista previa de impacto, ejecuciones y aprobación; pestaña… |
| PAN-NFR-09 | Mis datos y privacidad | PT-07 | `/app/mis-datos` | Usa PT-07 Portal del socio y del empleado (PWA). Mis datos y privacidad: datos visibles, descargar informe, pedir rectificación o supresión, preferencias y… |
| PAN-NFR-10 | Aviso de privacidad vigente | PT-10 | `/privacidad` | Usa PT-10 Página pública (landing). Aviso de privacidad vigente, formulario público de solicitud (con antiautomatización), datos de contacto del… |

### FAM-NFR-02 Salud del tenant

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-NFR-08 Incidentes de plataforma (T08:1134) |
| Portales | admin |
| Rutas | `/admin/salud`, `/admin/salud/incidentes` |
| Capabilities | `nfr.salud.ver`, `nfr.incidentes.ver` |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > NFR > Incidentes de plataforma        [Abrir] [Exportar] [Nuevo*] |
| Incidentes de plataforma                                         (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Notificac DataTable Procesos  Emisión f Cobranzas Conectore [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T08:1133, T08:1134): Columnas: Notificaciones, DataTable, Procesos, Emisión fiscal, Cobranzas inciertas, Conectores; Campos: Notificaciones, DataTable, Procesos, Emisión fiscal, Cobranzas inciertas, Conectores, Credenciales por vencer, Cuotas. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-NFR-07 | Tablero de salud del tenant | PT-05 | `/admin/salud` | Usa PT-05 Tablero, reporte o mapa. Tablero de salud del tenant (RF-NFR-017): procesos, emisión fiscal, cobranzas inciertas, conectores y credenciales por… |
| PAN-NFR-08 | Incidentes de plataforma | PT-01 | `/admin/salud/incidentes` | Incidentes de plataforma que afectan al tenant con su cronología y notificaciones; solicitud de restauración selectiva… |

### FAM-NFR-03 Operación de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-NFR-12 Gestión de incidentes de plataforma (T08:1138) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/salud`, `/admin/plataforma/incidentes`, `/admin/plataforma/continuidad`, `/admin/plataforma/alertas` y 1 más |
| Capabilities | `nfr.saludPlataforma.ver`, `nfr.incidentes.ver`, `nfr.restauracion.ejecutar`, `nfr.alertas.configurar` y 1 más |
| Olas | O0 a O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > NFR > Gestión de incidentes de plata… [Abrir] [Exportar] [Nuevo*] |
| Gestión de incidentes de plataforma                              (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Gestión d Notificac Post-mort DataTable Tablero   Inventari [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T08:1137, T08:1138, T08:1139, T08:1141, T08:1144): Columnas: Gestión de incidentes, Notificación por tenant, Post-mortem, DataTable + ficha, Tablero, Inventario de backups; Campos: Gestión de incidentes, Notificación por tenant, Post-mortem, DataTable + ficha, Tablero, Inventario de backups, Simulacros, Runbooks. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-NFR-11 | Tablero de salud global | PT-05 | `/admin/plataforma/salud` | Usa PT-05 Tablero, reporte o mapa. Tablero de salud global (RF-NFR-016, RNF-NFR-135). Tablero |
| PAN-NFR-12 | Gestión de incidentes de plataforma | PT-01 | `/admin/plataforma/incidentes` | Gestión de incidentes, notificación por tenant, post-mortem. DataTable + ficha |
| PAN-NFR-13 | Continuidad: backups, simulacros y runbooks | PT-01 | `/admin/plataforma/continuidad` | Inventario de backups, simulacros (plan, ejecución, mediciones, actas), runbooks y su última prueba. DataTable |
| PAN-NFR-15 | Reglas de alerta y SLO | PT-09 | `/admin/plataforma/alertas` | Usa PT-09 Configuración versionada. Reglas de alerta y SLO, eventos activos, reconocimiento y silenciamiento. DataTable |
| PAN-NFR-18 | Página de estado | PT-01 | `/estado` | Página de estado: servicios, incidentes y mantenimientos programados (RF-NFR-019). Landing |

### FAM-NFR-04 Seguridad de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-NFR-14 Gestión de claves (T08:1140) |
| Portales | plataforma |
| Rutas | `/admin/plataforma/claves`, `/admin/plataforma/evidencias`, `/admin/plataforma/subencargados` |
| Capabilities | `nfr.claves.ver`, `nfr.evidencias.ver`, `nfr.subencargados.editar` |
| Olas | O1 |

```text
+----------------------------------------------------------------------------+
| Inicio > NFR > Gestión de claves               [Abrir] [Exportar] [Nuevo*] |
| Gestión de claves                                                (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Claves    Próxima r Rotación  DataTable Matriz AS Vulnerabi [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T08:1140, T08:1142, T08:1143): Columnas: Claves, Próxima rotación, Rotación con doble aprobación, DataTable, Matriz ASVS, Vulnerabilidades abiertas; Campos: Claves, Próxima rotación, Rotación con doble aprobación, DataTable, Matriz ASVS, Vulnerabilidades abiertas, Aprobación de promoción. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-NFR-14 | Gestión de claves | PT-01 | `/admin/plataforma/claves` | Claves (metadatos), próxima rotación, rotación con doble aprobación. DataTable |
| PAN-NFR-16 | Evidencias por versión | PT-01 | `/admin/plataforma/evidencias` | Evidencias por versión, matriz ASVS, vulnerabilidades abiertas, aprobación de promoción. DataTable |
| PAN-NFR-17 | Registro de subencargados y avisos a tenants | PT-03 | `/admin/plataforma/subencargados` | Usa PT-03 Formulario o editor. Registro de subencargados y avisos a tenants. DataTable |

## T09 COM: Comunidad y comunicaciones

Anexo `docs/especificacion/anexos/T09-COM-comunidad-comunicaciones.md`, §10. 10 familias, 48 PAN. Catálogo: [17-27-T09-COM.md](17-catalogo-pantallas/17-27-T09-COM.md).

### FAM-COM-01 Publicaciones, categorías y boletines

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-01 Publicaciones (T09:2276) |
| Portales | admin |
| Rutas | `/admin/com/publicaciones`, `/admin/com/publicaciones/:id`, `/admin/com/categorias`, `/admin/com/boletines` y 1 más |
| Capabilities | `com.posts.ver`, `com.posts.crear`, `com.posts.configurar`, `com.newsletters.ver` y 1 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Publicaciones                [Duplicar] [Archivar] [Nueva*] |
| Publicaciones                                                    (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Tipo ▼] [Canal ▼] [Categoría ▼]            |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Título    Tipo      Canales   Estado    Autor     Programad [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Duplicar] [Archivar] [Republic… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2276, T09:2277, T09:2278, T09:2283, T09:2284): Filtros: Estado, Tipo, Canal, Categoría, Autor, Rango de fechas; Columnas: Título, Tipo, Canales, Estado, Autor, Programada/publicada, Fijada hasta, Audiencia; Pestañas: Categorías, Plantillas de publicación, Catálogo de reacciones, Saludos automáticos; Acciones: Nueva, Duplicar, Archivar, Republicar, Fijar/desfijar, Exportar métricas, Conflicto de programación, Guardar borrador, Enviar a aprobación, Programar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-01 | Publicaciones | PT-01 | `/admin/com/publicaciones` | Filtros: estado, tipo, canal, categoría, autor, rango de fechas, texto; Columnas: título, tipo, canales, estado… |
| PAN-COM-02 | Editor de publicación | PT-03 | `/admin/com/publicaciones/:id` | Usa PT-03 Formulario o editor. Editor: título, cuerpo enriquecido, tipo, categoría, sección, medios (portada, galería, video, audio), layout… |
| PAN-COM-03 | Categorías, plantillas y reacciones | PT-09 | `/admin/com/categorias` | Usa PT-09 Configuración versionada. Pestañas: Categorías, Plantillas de publicación, Catálogo de reacciones, Saludos automáticos |
| PAN-COM-08 | Boletines | PT-01 | `/admin/com/boletines` | Listado con estado, regla, asunto, variantes, destinatarios, métricas. Detalle de revisión: asunto, nota de tapa (IA)… |
| PAN-COM-09 | Reglas de boletines | PT-09 | `/admin/com/boletines/reglas` | Usa PT-09 Configuración versionada. ABM de reglas (cadencia, formato, selección, audiencia, revisión) con preview de la próxima edición. Activar/pausar… |

### FAM-COM-02 Moderación

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-06 Sanciones (T09:2281) |
| Portales | admin |
| Rutas | `/admin/com/moderacion`, `/admin/com/moderacion/configuracion`, `/admin/com/sanciones`, `/admin/com/moderacion/tablero` |
| Capabilities | `com.moderation.ver`, `com.moderation.configurar`, `com.sanctions.aplicar` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Sanciones         [Aplicar] [Revocar] [Resolver apelación*] |
| Sanciones                                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Riesgo ▼] [Categoría ▼] [Origen ▼] [Publicación ▼]    |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Usuario   Tipo      Motivo    Vigencia  Estado    Apelación [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aplicar] [Revocar] [Ver histor… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2279, T09:2280, T09:2281, T09:2282): Filtros: Riesgo, Categoría, Origen, Publicación, Estado, Asignado a mí; Columnas: Usuario, Tipo, Motivo, Vigencia, Estado, Apelación, Aplicada por; Pestañas: Política, Reglas automáticas, Reglas de comunidad; Acciones: Aplicar, Revocar, Resolver apelación, Ver historial del usuario, Tomar/asignar, Aprobar, Ocultar, Ocultar y responder, Derivar a CRM, Aceptar/ignorar sugerencia IA.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-04 | Cola de moderación | PT-06 | `/admin/com/moderacion` | Usa PT-06 Bandeja de trabajo. Filtros: riesgo, categoría, origen, publicación, estado, asignado a mí |
| PAN-COM-05 | Configuración de moderación | PT-09 | `/admin/com/moderacion/configuracion` | Usa PT-09 Configuración versionada. Pestañas: Política, Reglas automáticas, Reglas de comunidad |
| PAN-COM-06 | Sanciones | PT-01 | `/admin/com/sanciones` | Columnas: usuario, tipo, motivo, vigencia, estado, apelación, aplicada por |
| PAN-COM-07 | Tablero de moderación | PT-05 | `/admin/com/moderacion/tablero` | Usa PT-05 Tablero, reporte o mapa. Tablero (§15): volumen, primera decisión, % ocultos, coincidencia IA vs humano, reportes abiertos, sanciones vigentes… |

### FAM-COM-03 Encuestas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-10 Encuestas (T09:2285) |
| Portales | admin |
| Rutas | `/admin/com/encuestas`, `/admin/com/encuestas/:id/editar`, `/admin/com/encuestas/:id/resultados`, `/admin/com/encuestas/plantillas` |
| Capabilities | `com.surveys.ver`, `com.surveys.crear`, `com.surveys.resultados` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Encuestas                      [Duplicar] [Pausar] [Nueva*] |
| Encuestas                                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Estado ▼] [Más filtros]                      |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Nombre    Tipo      Finalidad Estado    Vigencia  Invitados [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  dd-mm-yyy ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Duplicar] [Pausar] [Cerrar]     25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2285, T09:2286, T09:2287, T09:2288): Filtros: Tipo, Estado; Columnas: Nombre, Tipo, Finalidad, Estado, Vigencia, Invitados, Respuestas, Participación %; Acciones: Nueva, Duplicar, Pausar, Cerrar, Archivar, Link externo + QR, Exportar, Guardar, Publicar, Guardar como plantilla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-10 | Encuestas | PT-01 | `/admin/com/encuestas` | Columnas: nombre, tipo, finalidad, estado, vigencia, invitados, respuestas, participación %, NPS/score, disparador |
| PAN-COM-11 | Constructor de encuestas | PT-03 | `/admin/com/encuestas/:id/editar` | Usa PT-03 Formulario o editor. Constructor: panel de preguntas (31 tipos con QuestionTypePicker), páginas, lógica condicional (editor visual AND/OR)… |
| PAN-COM-12 | Resultados de encuesta | PT-01 | `/admin/com/encuestas/:id/resultados` | Resultados por pregunta y grupo, participación, cruce de dos preguntas, tendencia; sala de inteligencia… |
| PAN-COM-13 | Plantillas de encuestas | PT-09 | `/admin/com/encuestas/plantillas` | Usa PT-09 Configuración versionada. Plantillas del tenant y heredadas de plataforma (post-instalación, post-reclamo, calidad, censo). ABM, usar |

### FAM-COM-04 Eventos y beneficios

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-14 Eventos e inscripciones (T09:2289) |
| Portales | admin |
| Rutas | `/admin/com/eventos`, `/admin/com/beneficios`, `/admin/com/beneficios/validar` |
| Capabilities | `com.events.ver`, `com.benefits.ver`, `com.benefits.validarCanje` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Eventos e inscrip… [Publicar] [Exportar inscript…] [Nuevo*] |
| Eventos e inscripciones                                          (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Espera    Check-in  Nuevo     Publicar  Cancelar  Exportar  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Publicar] [Exportar inscript…]… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2289, T09:2290, T09:2291): Columnas: Espera, Check-in, Nuevo, Publicar, Cancelar, Exportar inscriptos; Campos: Espera, Check-in, Nuevo, Publicar, Cancelar, Exportar inscriptos; Acciones: Nuevo, Publicar, Cancelar, Exportar inscriptos, Check-in manual, Aprobar inscripciones, Pausar, ABM de comercios, Anular canje, Confirmar canje.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-14 | Eventos e inscripciones | PT-01 | `/admin/com/eventos` | DataTable de eventos e inscripciones; detalle con lista de inscriptos, espera, check-in. Nuevo (modal lg), publicar… |
| PAN-COM-15 | Beneficios y comercios adheridos | PT-01 | `/admin/com/beneficios` | Beneficios (estado, vigencia, cupo, canjes) y comercios adheridos; detalle con canjes. Nuevo, publicar, pausar… |
| PAN-COM-16 | Validación de canje | PT-01 | `/admin/com/beneficios/validar` | Validación de canje: lector QR o ingreso de código; muestra beneficio, persona (nombre parcial), estado. Confirmar… |

### FAM-COM-05 Audiencias, plantillas y variables

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-19 Plantillas de comunicación (T09:2294) |
| Portales | admin |
| Rutas | `/admin/com/segmentos`, `/admin/com/catalogo`, `/admin/com/plantillas`, `/admin/com/variables` |
| Capabilities | `com.audiences.usar`, `com.catalog.configurar`, `com.templates.ver`, `com.templates.editar` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Plantillas de comunicación                                       (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]            [Guardar borrador*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Segmentos guardad… | | Editor por canal [______________]             | |
| | > Catálogo de tipos… | | Email [______________]                        | |
| | > Registro de varia… | | SMS [______________]                          | |
| |                      | | WhatsApp [______________]                     | |
| |                      | | Push/in-app [______________]                  | |
| |                      | | Guardar borrador [______________]             | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2292, T09:2293, T09:2294, T09:2295): Pestañas: Segmentos guardados y listas importadas, Catálogo de tipos de comunicación, Registro de variables; Campos: Editor por canal, Email, SMS, WhatsApp, Push/in-app, Guardar borrador; Acciones: Guardar borrador, Probar render, Enviar prueba, Publicar versión, Retirar, Enviar a aprobación del proveedor, Copiar de plataforma, Nuevo segmento, Importar lista, Recalcular.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-17 | Segmentos guardados y listas importadas | PT-01 | `/admin/com/segmentos` | Usa PT-01 Listado con filtros. Segmentos guardados (dueño, visibilidad, evaluación, último conteo) y listas importadas (filas cruzadas, no cruzadas… |
| PAN-COM-18 | Catálogo de tipos de comunicación | PT-09 | `/admin/com/catalogo` | Catálogo de tipos de comunicación (§9.6): código, módulo, disparador, finalidad, canales y orden, opt-out, hito… |
| PAN-COM-19 | Plantillas de comunicación | PT-09 | `/admin/com/plantillas` | Pasos: email (bloques, tema T03, variables …, variables, estado de aprobación) … |
| PAN-COM-20 | Registro de variables | PT-03 | `/admin/com/variables` | Usa PT-03 Formulario o editor. Registro de variables: ruta, etiqueta, tipo, formato, módulo, ejemplo, política de nulos, sensible, tipos donde… |

### FAM-COM-06 Campañas y canales

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-21 Campañas (T09:2296) |
| Portales | admin |
| Rutas | `/admin/com/campanas`, `/admin/com/campanas/:id`, `/admin/com/canales` |
| Capabilities | `com.campaigns.ver`, `com.campaigns.crear`, `com.channels.configurar` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Campañas              [Duplicar] [Pausar/reanudar] [Nueva*] |
| Campañas                                                         (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Nombre    Finalidad Canales   Estado    Programac Audiencia [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Duplicar] [Pausar/reanudar] [A… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2296, T09:2297, T09:2301): Filtros: Estado; Columnas: Nombre, Finalidad, Canales, Estado, Programación, Audiencia, Enviados, Entregados; Acciones: Nueva, Duplicar, Pausar/reanudar, Cancelar, Aprobar, Enviar prueba, Solicitar aprobación, Programar, Enviar ahora, Exportar métricas.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-21 | Campañas | PT-01 | `/admin/com/campanas` | Columnas: nombre, finalidad, canales, estado, programación, audiencia, enviados, entregados, abiertos, clics |
| PAN-COM-22 | Composer de campaña | PT-03 | `/admin/com/campanas/:id` | Usa PT-03 Formulario o editor. Composer por pasos: 1) finalidad y nombre, 2) audiencia + vista previa de alcance y costo, 3) canales y contenido… |
| PAN-COM-26 | Canales de comunicación | PT-01 | `/admin/com/canales` | Por canal: habilitado, conector T06 y proveedor (email SES/SMTP; SMS API — sin módem, PA-CFG-P4-01; WhatsApp Meta… |

### FAM-COM-07 Avisos de interrupción, historial y preferencias

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-24 Historial de comunicaciones (T09:2299) |
| Portales | admin |
| Rutas | `/admin/com/mensajes-factura`, `/admin/com/historial`, `/admin/com/preferencias`, `/admin/com/avisos-corte` |
| Capabilities | `com.invoiceMessages.ver`, `com.communications.ver`, `com.consents.ver`, `com.outages.ver` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Histor… [Cancelar en cola] [Descargar constan…] [Reenviar*] |
| Historial de comunicaciones                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Persona ▼] [Cuenta ▼] [Tipo ▼] [Canal ▼]              |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Fecha     Tipo      Canal     Destinata Estado    Texto     [...]      |
| ---------------------------------------------------------------------      |
| [ ] dd-mm-yyy ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Cancelar en cola] [Descargar c… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2298, T09:2299, T09:2300, T09:2302): Filtros: Persona, Cuenta, Tipo, Canal, Estado, Origen; Columnas: Fecha, Tipo, Canal, Destinatario, Estado, Texto; Campos: Fecha, Tipo, Canal, Destinatario, Estado, Texto, Área, Prioridad; Acciones: Reenviar, Cancelar en cola, Descargar constancia PDF, Adjuntar al expediente, Exportar XLSX, Nuevo, Aprobar, Cancelar, Simular, Editar preferencia en nombre del socio.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-23 | Mensajes impresos en factura | PT-01 | `/admin/com/mensajes-factura` | Mensajes impresos en factura: texto, área, prioridad, audiencia, servicios, período, QR, estado; simulador “qué… |
| PAN-COM-24 | Historial de comunicaciones | PT-01 | `/admin/com/historial` | Filtros: persona, cuenta, tipo, canal, estado, origen, rango |
| PAN-COM-25 | Preferencias de comunicación por persona | PT-01 | `/admin/com/preferencias` | Por persona: matriz finalidad × canal, canal preferido, no molestar, adhesión a factura digital, historial de… |
| PAN-COM-27 | Avisos de interrupción | PT-03 | `/admin/com/avisos-corte` | Usa PT-03 Formulario o editor. Avisos de interrupción: tipo, servicios, área (mapa), ventana, estado, afectados, origen. Editor con mapa (zonas… |

### FAM-COM-08 Mensajería y avisos de plataforma

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-30 Envío individual (T09:2305) |
| Portales | admin, plataforma |
| Rutas | `/admin/com/consumo`, `/admin/com/notificaciones-internas`, `/admin/com/envio-manual`, `/admin/com/exportaciones` y 3 más |
| Capabilities | `com.channels.configurar`, `com.catalog.configurar`, `com.communications.enviarManual`, `com.audiences.exportar` y 3 más |
| Olas | O0 a O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > COM > Envío individual              [Abrir en WhatsApp] [Enviar*] |
| Envío individual                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo/plantilla o … ▼] [Por período ▼] [Más filtros]   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Destinata Canal     Tipo/plan Adjuntos  Preview   Por perío [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir en WhatsApp]              25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2303, T09:2304, T09:2305, T09:2306, T09:2307, T09:2308): Filtros: Tipo/plantilla o texto libre, Por período; Columnas: Destinatario, Canal, Tipo/plantilla o texto libre, Adjuntos del objeto, Preview, Por período; Campos: Destinatario, Canal, Tipo/plantilla o texto libre, Adjuntos del objeto, Preview, Por período, Finalidad, Módulo; Acciones: Enviar, Abrir en WhatsApp, Exportar, ABM, Probar regla, Generar archivo, Abrir objeto, Marcar leído, Descartar con deshacer, Publicar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-28 | Consumo de mensajería | PT-05 | `/admin/com/consumo` | Usa PT-05 Tablero, reporte o mapa. Consumo de mensajería: por período, canal, finalidad, módulo y tipo; costo; tendencia; alertas de cupo. Exportar |
| PAN-COM-29 | Reglas de notificación a responsables | PT-09 | `/admin/com/notificaciones-internas` | Usa PT-09 Configuración versionada. Reglas de notificación a responsables: tipo, filtros (servicio, tipo de orden, operación, sucursal, zona), momento… |
| PAN-COM-30 | Envío individual | PT-01 | `/admin/com/envio-manual` | Envío individual: destinatario (contactos verificados del objeto), canal, tipo/plantilla o texto libre (solo email/SMS… |
| PAN-COM-31 | Exportación de audiencia | PT-01 | `/admin/com/exportaciones` | Exportación de audiencia: modelos IVR (IVR Logística, TeleAnnouncer Lite, texto fila/columna, texto+audio, Minerva… |
| PAN-COM-32 | Bandeja del empleado | PT-06 | `/admin/avisos` | Usa PT-06 Bandeja de trabajo. Bandeja del empleado: avisos con notifKinds, no leídos, marcar todo, filtros por módulo. Abrir objeto, marcar leído… |
| PAN-COM-33 | Avisos de plataforma a tenants | PT-01 | `/admin/plataforma/avisos` | Avisos de plataforma a tenants: tipo, destino (todos/plan/lista), roles, permanencia, vigencia, encuesta de producto… |
| PAN-COM-34 | Consumo global por tenant, canal y proveedor | PT-01 | `/admin/plataforma/mensajeria` | Consumo global por tenant, canal y proveedor; salud de conectores de plataforma; colas BullMQ (pendientes, fallidos)… |

### FAM-COM-09 Comunidad en la PWA

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-40 Muro de la comunidad (PWA) (T09:2315) |
| Portales | empleado, landing, socio |
| Rutas | `/app/muro`, `/app/muro/:id`, `/app/avisos`, `/app/encuestas(/:id)` y 7 más |
| Capabilities | `com.wall.ver`, `com.inbox.ver`, `com.surveys.responder`, `com.events.ver` y 4 más |
| Olas | O2 |

```text
+------------------------------------------------------------+
| < Muro de la comunidad (PWA)                           (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Feed carrusel o lista: ········                        | |
| | Tiras: ········                                        | |
| | Filtros: ········                                      | |
| | Card con medios: ········                              | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Feed carrusel o lista: ········                        | |
| | Tiras: ········                                        | |
| | Filtros: ········                                      | |
| | Card con medios: ········                              | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                       Guardar                       * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2315, T09:2316, T09:2317, T09:2318, T09:2319, T09:2320): Campos: Feed carrusel o lista, Tiras, Filtros, Card con medios, Reacciones, Contador de comentarios; Acciones: Reaccionar, Guardar, “no me interesa”, Compartir, Abrir detalle, Comentar, Responder, Editar/borrar propio, Reportar, Responder votación embebida.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-40 | Muro de la comunidad (PWA) | PT-07 | `/app/muro` | Feed carrusel o lista (de a 10), tiras (última factura, cortes en tu zona, encuestas pendientes, próximos eventos… |
| PAN-COM-41 | Detalle de publicación (PWA) | PT-07 | `/app/muro/:id` | Detalle con comentarios (1 nivel), respuesta institucional destacada, menciones, foto/GIF, deep-link a comentario… |
| PAN-COM-42 | Bandeja de avisos (PWA) | PT-07 | `/app/avisos` | Bandeja Todas / No leídas / Leídas / Enviados (supervisor) con notifKinds, badge global (useNotifBadge). Abrir objeto… |
| PAN-COM-43 | Mis encuestas (PWA) | PT-07 | `/app/encuestas(/:id)` | Pendientes / Iniciadas / Finalizadas; respuesta con un campo por tipo, progreso, autoguardado, cola offline, repaso… |
| PAN-COM-44 | Boletines recibidos (PWA) | PT-07 | `/app/novedades(/:id)` | Boletines recibidos; detalle tipo revista con “Abrir en el muro”. Leer |
| PAN-COM-45 | Agenda del socio (PWA) | PT-07 | `/app/agenda` | Agenda: eventos de la cooperativa + citas del socio (visitas M10, turnos M09). Inscribirse (modal desde FAB)… |
| PAN-COM-46 | Beneficios (PWA) | PT-07 | `/app/beneficios(/:id)` | Beneficios elegibles con condiciones, vigencia, cupo; “Mis códigos”. Obtener código/QR, cancelar. “No hay beneficios… |
| PAN-COM-47 | Preferencias de comunicación (PWA) | PT-07 | `/app/perfil/comunicaciones` | Matriz finalidad × canal (las no desactivables explicadas y bloqueadas), canal preferido, no molestar, frecuencia de… |
| PAN-COM-48 | Avisos de corte (PWA y landing) | PT-07 | `/app/avisos-de-corte` | Cortes que afectan mis domicilios / cortes vigentes públicos por localidad y servicio. Filtrar. “Sin cortes… |
| PAN-COM-51 | Reglas de comunidad vigentes | PT-07 | `/app/comunidad/reglas` | Reglas de comunidad vigentes; estado de mis sanciones; apelar. Aceptar reglas, apelar |
| PAN-COM-52 | Composer de supervisor | PT-07 | `/app/empleado/muro` | Composer de supervisor (AvisoComposerSheet, SurveyComposerSheet): aviso, publicación o encuesta rápida a su equipo… |

### FAM-COM-10 Comunidad pública

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COM-50 Gestión de suscripción sin login (T09:2325) |
| Portales | landing |
| Rutas | `/e/:token`, `/comunicaciones/:token`, `/noticias(/:slug)` |
| Capabilities | `Pública` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Gestión de suscripción sin login                                     |
| [Guardar*]   [Darme de baja]                                               |
+----------------------------------------------------------------------------+
| [ Matriz simplificada ]  [ Darme de baja ]  [ Guardar ]  [ Responder ]     |
| [ Token vencido ]  [ “Esta encuesta ya c… ]                                |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (T09:2324, T09:2325, T09:2328): Campos: Matriz simplificada, Darme de baja, Guardar, Responder, Token vencido, “Esta encuesta ya cerró; Acciones: Darme de baja, Guardar, Responder, Compartir.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COM-49 | Encuesta externa sin login | PT-10 | `/e/:token` | Encuesta externa sin login (también QR en factura). Responder. Token vencido: “Esta encuesta ya cerró.” |
| PAN-COM-50 | Gestión de suscripción sin login | PT-10 | `/comunicaciones/:token` | Gestión de suscripción sin login: baja de un clic de la finalidad del mensaje y matriz simplificada. Darme de baja… |
| PAN-COM-53 | Noticias públicas | PT-10 | `/noticias(/:slug)` | Noticias channel=landing, SEO (título, descripción, imagen OG). Compartir. El bloque no se muestra si no hay noticias |
