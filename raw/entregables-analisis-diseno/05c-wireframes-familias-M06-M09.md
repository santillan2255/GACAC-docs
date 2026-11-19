# Wireframes por familia de pantallas: M06 a M09

**Artefacto 4.2 (Wireframes). Parte 05c.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: M06 FIS, M07 COB, M08 MOR, M09 CRM (31 familias).

## M06 FIS: Fiscal e impuestos

Anexo `docs/especificacion/anexos/M06-FIS-fiscal-impuestos.md`, §10. 7 familias, 41 PAN. Catálogo: [17-06-M06-FIS.md](17-catalogo-pantallas/17-06-M06-FIS.md).

### FAM-FIS-01 Normativas fiscales

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-01 Catálogo de tablas normativas (M06:1780) |
| Portales | admin, plataforma |
| Rutas | `/admin/plataforma/fis/normative-tables`, `/admin/plataforma/fis/arca-params`, `/admin/fis/normative-adoptions` |
| Capabilities | `fis.tablasNormativas.ver`, `fis.arcaParametros.sincronizar`, `fis.tablasNormativas.adoptar` |
| Olas | O1 a O4 |

```text
+----------------------------------------------------------------------------+
| Catálogo de tablas normativas                                    (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]               [Nueva versión*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Pendientes         | | Tabla [______________]                        | |
| | > Adoptadas          | | Ámbito [______________]                       | |
| | > Historial          | | Jurisdicción [______________]                 | |
| |                      | | Versión vigente [______________]              | |
| |                      | | Estado [______________]                       | |
| |                      | | Próxima vigencia [______________]             | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1780, M06:1781, M06:1782): Columnas: Tabla, Ámbito, Jurisdicción, Versión vigente, Estado, Próxima vigencia; Pestañas: Pendientes, Adoptadas, Historial; Acciones: Nueva versión, Importar filas, Enviar a revisión, Publicar, Retirar, Simular, Adoptar con fecha efectiva, Rechazar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-01 | Catálogo de tablas normativas | PT-09 | `/admin/plataforma/fis/normative-tables` | Columnas: tabla, ámbito, jurisdicción, versión vigente, estado, próxima vigencia |
| PAN-FIS-02 | Sincronización de tablas ARCA | PT-09 | `/admin/plataforma/fis/arca-params` | Sincronización de tablas ARCA. Por ambiente: tabla, última sincronización, diferencias. Acción: sincronizar ahora… |
| PAN-FIS-03 | Adopción de versiones por el tenant | PT-01 | `/admin/fis/normative-adoptions` | Usa PT-01 Listado con filtros. Pestañas: pendientes, adoptadas, historial |

### FAM-FIS-02 Perfil fiscal y agente

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-05 Relevamiento fiscal (M06:1784) |
| Portales | admin |
| Rutas | `/admin/fis/profile`, `/admin/fis/survey`, `/admin/fis/agent-registrations` |
| Capabilities | `fis.perfil.ver`, `fis.perfil.editar`, `fis.retenciones.configurar` |
| Olas | O4 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > FIS > Relevamiento fiscal             [Abrir] [Exportar] [Nuevo*] |
| Relevamiento fiscal                                              (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Organismo Impuesto  Régimen   Rol       Número    Vigencia  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1783, M06:1784, M06:1785): Columnas: Organismo, Impuesto, Régimen, Rol, Número, Vigencia, Sistema; Campos: Identidad, IVA, IIBB/CM con jurisdicciones, Actividades, MiPyME, Mapa regulatorio por servicio. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-04 | Perfil fiscal del tenant | PT-02 | `/admin/fis/profile` | Usa PT-02 Ficha o detalle con pestañas. Campos: identidad, IVA, IIBB/CM con jurisdicciones, actividades, MiPyME, mapa regulatorio por servicio |
| PAN-FIS-05 | Relevamiento fiscal | PT-01 | `/admin/fis/survey` | Relevamiento fiscal (BASE §52.4). Checklist por tema con evidencia y responsable; enviar a aprobación. Ayuda: bloquea… |
| PAN-FIS-06 | Condiciones de agente | PT-09 | `/admin/fis/agent-registrations` | Usa PT-09 Configuración versionada. Columnas: organismo, impuesto, régimen, rol, número, vigencia, sistema |

### FAM-FIS-03 Conector ARCA, autorización, CAEA, CESP y CVP

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-14 CAEA por quincena (M06:1793) |
| Portales | admin |
| Rutas | `/admin/fis/arca/credentials`, `/admin/fis/points-of-sale`, `/admin/fis/authorizations`, `/admin/fis/authorizations/exceptions` y 7 más |
| Capabilities | `fis.arca.configurar`, `fis.puntosVenta.configurar`, `fis.autorizaciones.ver`, `fis.bandeja.ver` y 7 más |
| Olas | O0 a O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FIS > CAE… [Informar] [Informar sin movi…] [Solicitar/consultar*] |
| CAEA por quincena                                                (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Punto ▼] [Tipo ▼] [Fecha ▼] [Más filtros]  |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Período   Orden     CAEA      Vigencia  Plazo de  Comproban [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   dd-mm-yyy ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Informar] [Informar sin movi…]… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1786, M06:1787, M06:1788, M06:1789, M06:1790, M06:1791): Filtros: Estado, Punto, Tipo, Fecha, Módulo origen; Columnas: Período, Orden, CAEA, Vigencia, Plazo de informe, Comprobantes, Informados, Puntos sin movimiento; Pestañas: Último autorizado, Comprobante, CAEA, Puntos de venta; Acciones: Solicitar/consultar, Informar, Informar sin movimiento, Activar contingencia, Generar CSR, Subir certificado, Probar, Activar producción, Revocar, Sincronizar con ARCA.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-07 | Certificados y conector ARCA | PT-01 | `/admin/fis/arca/credentials` | Certificados y conector ARCA. Cards por ambiente: estado, vence en, servicios, último health check. Acciones: generar… |
| PAN-FIS-08 | Puntos de venta y modalidades | PT-01 | `/admin/fis/points-of-sale` | Columnas: entidad jurídica, número, descripción, sistema, sucursal, estado ARCA, autoautorizar |
| PAN-FIS-09 | Tablero de la cola de autorización | PT-05 | `/admin/fis/authorizations` | Usa PT-05 Tablero, reporte o mapa. Filtros: estado, punto, tipo, fecha, módulo origen; Columnas: fecha, punto, tipo, número, receptor, total, estado… |
| PAN-FIS-10 | Bandeja de excepciones fiscales | PT-06 | `/admin/fis/authorizations/exceptions` | Usa PT-06 Bandeja de trabajo. Bandeja de excepciones fiscales. Casos detained, rejected, toReconcile: problema, estado, responsable, siguiente… |
| PAN-FIS-11 | Vista previa del request | PT-01 | `/admin/fis/authorizations/preview` | Vista previa del request. Modal xl con el request campo a campo y validaciones |
| PAN-FIS-12 | Consultas a ARCA | PT-01 | `/admin/fis/arca/query` | Pestañas: último autorizado, comprobante, CAEA, puntos de venta |
| PAN-FIS-13 | Inconsistencias con ARCA | PT-01 | `/admin/fis/reconciliation/arca` | Inconsistencias con ARCA. Rango/período/punto; resultado: CAE distinto, importe distinto, inexistente; propuesta de… |
| PAN-FIS-14 | CAEA por quincena | PT-01 | `/admin/fis/caea` | Columnas: período, orden, CAEA, vigencia, plazo de informe, comprobantes, informados, puntos sin movimiento, estado |
| PAN-FIS-15 | CESP de LQSP | PT-01 | `/admin/fis/cesp` | Columnas: descripción, CESP, desde, hasta, vencimiento, punto, estado |
| PAN-FIS-16 | Código de Validación Provincial | PT-01 | `/admin/fis/cvp` | Columnas: jurisdicción, punto, comprobante, desde, hasta, código, leyenda |
| PAN-FIS-39 | Estado del conector fiscal | PT-01 | `/admin/fis/connector` | Estado del conector fiscal. Por servicio ARCA y organismo: último éxito/error, TA vigente, cola, health check… |

### FAM-FIS-04 IVA, tributos, IIBB y padrones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-20 Ingresos Brutos (M06:1799) |
| Portales | admin |
| Rutas | `/admin/fis/vat/conditions`, `/admin/fis/vat/rates`, `/admin/fis/taxes`, `/admin/fis/gross-income` y 3 más |
| Capabilities | `fis.impuestos.configurar`, `fis.padrones.importar`, `fis.padron.consultar` |
| Olas | O4 |

```text
+----------------------------------------------------------------------------+
| Inicio > FIS > Ingresos Brutos                 [Abrir] [Exportar] [Nuevo*] |
| Ingresos Brutos                                                  (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código AR Descripci Percibido Mínimo pe Sobre net No catego [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1796, M06:1797, M06:1798, M06:1799, M06:1800, M06:1801): Columnas: Código ARCA, Descripción, Percibido, Mínimo percepción, Sobre neto, No categorizado, Código padrón, SIRE; Pestañas: Situaciones, Alícuotas, Matriz, Por comprobante, Mínimos, No incluidos; Pasos: Preview con errores. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-17 | Condiciones frente al IVA | PT-09 | `/admin/fis/vat/conditions` | Usa PT-09 Configuración versionada. Columnas: código ARCA, descripción, percibido, mínimo percepción, sobre neto, no categorizado, código padrón, SIRE… |
| PAN-FIS-18 | Alícuotas y matriz IVA | PT-01 | `/admin/fis/vat/rates` | Pestañas: alícuotas |
| PAN-FIS-19 | Catálogo de tributos y percepciones | PT-09 | `/admin/fis/taxes` | Usa PT-09 Configuración versionada. Columnas: código, nivel, naturaleza, Id ARCA, jurisdicción, trasladable, servicios, vigencia |
| PAN-FIS-20 | Ingresos Brutos | PT-01 | `/admin/fis/gross-income` | Pestañas: situaciones, alícuotas, matriz, por comprobante, mínimos, no incluidos |
| PAN-FIS-21 | Padrones fiscales | PT-04 | `/admin/fis/registries` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: ExcelImportWizard (subir, preview con errores, confirmar) |
| PAN-FIS-22 | Alícuotas determinadas y exclusiones | PT-01 | `/admin/fis/determined-rates` | Alícuotas determinadas y exclusiones. DataTable por cuenta/persona: régimen, alícuota o exclusión, vigencia, respaldo |
| PAN-FIS-23 | Consulta de padrón ARCA | PT-01 | `/admin/fis/padron/lookup` | Consulta de padrón ARCA. Ingreso de CUIT o DNI; resultado con datos y botón "usar estos datos". Mensaje si ARCA no… |

### FAM-FIS-05 Retenciones y percepciones

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-24 Tipos de retención y escalas (M06:1803) |
| Portales | admin |
| Rutas | `/admin/fis/withholding/types`, `/admin/fis/withholding/assignments`, `/admin/fis/withholding/applied`, `/admin/fis/withholding/suffered-types` |
| Capabilities | `fis.retenciones.configurar`, `fis.retenciones.ver` |
| Olas | O4 a O8 |

```text
+----------------------------------------------------------------------------+
| Tipos de retención y escalas                                     (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]       [Cargar código oficial*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Asignaciones a pr… | | Fecha [______________]                        | |
| | > Retenciones pract… | | Proveedor [______________]                    | |
| | > Tipos de retencio… | | CUIT [______________]                         | |
| |                      | | Tipo [______________]                         | |
| |                      | | Base [______________]                         | |
| |                      | | Importe [______________]                      | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1803, M06:1804, M06:1805, M06:1806): Columnas: Fecha, Proveedor, CUIT, Tipo, Base, Importe, Certificado, Período; Pestañas: Asignaciones a proveedores/productos/conceptos, Retenciones practicadas y certificados, Tipos de retenciones sufridas; Acciones: Ver/emitir certificado, Cargar código oficial.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-24 | Tipos de retención y escalas | PT-09 | `/admin/fis/withholding/types` | Tipos de retención y escalas. DataTable de tipos; detalle xl con banderas, mínimos, acumulación y escalas por tramo |
| PAN-FIS-25 | Asignaciones a proveedores/productos/conceptos | PT-09 | `/admin/fis/withholding/assignments` | Asignaciones a proveedores/productos/conceptos. DataTable con filtros por tipo y sujeto; carga masiva |
| PAN-FIS-26 | Retenciones practicadas y certificados | PT-01 | `/admin/fis/withholding/applied` | Usa PT-01 Listado con filtros. Columnas: fecha, proveedor, CUIT, tipo, base, importe, certificado, período, estado |
| PAN-FIS-27 | Tipos de retenciones sufridas | PT-09 | `/admin/fis/withholding/suffered-types` | Tipos de retenciones sufridas. DataTable con cuenta contable |

### FAM-FIS-06 Obligaciones, libros y declaraciones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-31 Declaraciones y regímenes informativos (M06:1810) |
| Portales | admin |
| Rutas | `/admin/fis/obligations`, `/admin/fis/vat-ledger`, `/admin/fis/mis-comprobantes`, `/admin/fis/filings` y 1 más |
| Capabilities | `fis.obligaciones.ver`, `fis.libroIva.ver`, `fis.libroIva.generar`, `fis.regimenes.generar` y 1 más |
| Olas | O4 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > FIS > Declaraciones y regímenes i… [Validar] [Aprobar] [Generar*] |
| Declaraciones y regímenes informativos                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Período ▼] [Estado ▼] [Más filtros]                   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Régimen   Período   Versión   Rectifica Estado    Vencimien [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Validar] [Aprobar] [Cargar acu… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1807, M06:1808, M06:1809, M06:1810, M06:1811): Filtros: Período, Estado; Columnas: Régimen, Período, Versión, Rectificativa, Estado, Vencimiento, Acuse, Importe; Acciones: Generar, Validar, Aprobar, Cargar acuse, Rectificar, Descargar, Cerrar, Reabrir, Exportar PDF/XLSX, Generar LID.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-28 | Obligaciones fiscales y calendario | PT-09 | `/admin/fis/obligations` | Usa PT-09 Configuración versionada. Columnas: régimen, período, vencimiento, importe, estado, OP/movimiento |
| PAN-FIS-29 | Libro IVA ventas y compras | PT-05 | `/admin/fis/vat-ledger` | Usa PT-05 Tablero, reporte o mapa. Libro IVA ventas y compras. Filtros (RF-FIS-114), criterio, fecha, tipo de informe; resultado con carátula; acciones… |
| PAN-FIS-30 | Conciliación con Mis Comprobantes | PT-06 | `/admin/fis/mis-comprobantes` | Usa PT-06 Bandeja de trabajo. Conciliación con Mis Comprobantes. Importar archivo; tres pestañas de resultados; marcar revisado |
| PAN-FIS-31 | Declaraciones y regímenes informativos | PT-01 | `/admin/fis/filings` | Columnas: régimen, período, versión, rectificativa, estado, vencimiento, acuse |
| PAN-FIS-32 | Validador de archivos | PT-01 | `/admin/fis/filings/validate` | Validador de archivos. Subir o elegir archivo; análisis por línea y correlatividad |

### FAM-FIS-07 Terceros, reguladores, administración pública y reportes

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-FIS-34 Rendiciones a terceros (M06:1813) |
| Portales | admin, socio |
| Rutas | `/admin/fis/third-parties/agreements`, `/admin/fis/third-parties/remittances`, `/admin/fis/regulatory`, `/admin/fis/regulatory/concept-maps` y 3 más |
| Capabilities | `fis.terceros.configurar`, `fis.rendiciones.generar`, `fis.reguladores.ver`, `fis.reguladores.configurar` y 4 más |
| Olas | O4 a O7 |

```text
+----------------------------------------------------------------------------+
| Inicio > FIS > Rendiciones a terceros  [Calcular] [Enviar a OP] [Aprobar*] |
| Rendiciones a terceros                                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Período ▼] [Estado ▼] [Más filtros]                   |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Convenio  Período   Facturado Cobrado   Comisión  Neto      [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Calcular] [Enviar a OP] [Conci… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M06:1812, M06:1813, M06:1814, M06:1815, M06:1816, M06:1817): Filtros: Período, Estado; Columnas: Convenio, Período, Facturado, Cobrado, Comisión, Neto, Estado, Beneficiario; Acciones: Calcular, Aprobar, Enviar a OP, Conciliar, Generar, Validar, Presentar, Acuse, Cargar, Guardar selección.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-FIS-33 | Convenios por cuenta de terceros | PT-01 | `/admin/fis/third-parties/agreements` | Columnas: beneficiario, CUIT, conceptos, vigencia, estado |
| PAN-FIS-34 | Rendiciones a terceros | PT-01 | `/admin/fis/third-parties/remittances` | Columnas: convenio, período, facturado, cobrado, comisión, neto, estado |
| PAN-FIS-35 | Informes a reguladores | PT-05 | `/admin/fis/regulatory` | Usa PT-05 Tablero, reporte o mapa. Informes a reguladores. DataTable por organismo/informe/período/estado; acciones: generar, validar, presentar, acuse |
| PAN-FIS-36 | Configuración de conceptos regulatorios | PT-09 | `/admin/fis/regulatory/concept-maps` | Usa PT-09 Configuración versionada. Configuración de conceptos regulatorios. Por informe y tipo de servicio: servicios, productos, impuestos, categorías y… |
| PAN-FIS-37 | Comprobantes de administración pública | PT-01 | `/admin/fis/public-admin` | Comprobantes de administración pública. Filtros (RF-FIS-151); grilla agrupada por factura y servicio con totales… |
| PAN-FIS-38 | Modo pasarela | PT-01 | `/admin/fis/gateway` | Modo pasarela. Importar CSV, listado de comprobantes externos con estado y CAE, descarga de resultados, clientes API… |
| PAN-FIS-40 | Reportes fiscales | PT-05 | `/admin/fis/reports` | Usa PT-05 Tablero, reporte o mapa. Reportes fiscales. Lista de reportes de la sección 15 con filtros y exportación |
| PAN-FIS-41 | Datos fiscales del comprobante (componente en M19) | PT-07 | (componente en M19) | Usa PT-07 Portal del socio y del empleado (PWA). Datos fiscales del comprobante. CAE, vencimiento de CAE, QR, leyendas fiscales y transparencia fiscal |

## M07 COB: Cuenta corriente y cobranza

Anexo `docs/especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md`, §10. 8 familias, 36 PAN. Catálogo: [17-07-M07-COB.md](17-catalogo-pantallas/17-07-M07-COB.md).

### FAM-COB-01 Cuenta corriente

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-03 Saldos a favor y anticipos (M07:2280) |
| Portales | admin |
| Rutas | `/admin/cob/cuentas/:currentAccountId`, `/admin/cob/imputaciones`, `/admin/cob/creditos`, `/admin/cob/cancelacion-automatica` y 2 más |
| Capabilities | `cob.cuentas.ver`, `cob.imputaciones.crear`, `cob.creditos.crear`, `cob.autoOffset.ejecutar` y 2 más |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > COB > Saldos … [Aplicar] [Marcar no automát…] [Alta de anticipo*] |
| Saldos a favor y anticipos                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicio ▼] [Estado de saldo ▼] [Período ▼]           |
| [Rango de vencimie… ▼] [Más filtros]                                       |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Titular   Cuenta    Origen    Fecha     Importe   Disponibl [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   dd-mm-yyy $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy $ 0.000,0 ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy $ 0.000,0 ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aplicar] [Marcar no automát…] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2260, M07:2271, M07:2280, M07:2294, M07:2299, M07:2305): Filtros: Servicio, Estado de saldo, Período, Rango de vencimiento, Comprobante, Solo vencidas; Columnas: Titular, Cuenta, Origen, Fecha, Importe, Disponible, Aplicación automática, Aplicar en próxima factura; Campos: Modalidad por defecto, Excepciones, Agrupación unificada, Mínimo de pago, Políticas de imputación versionadas, Catálogo de causas de ajuste, Umbrales; Zonas: Cabecera, Pestañas Obligaciones, Movimientos, Pagos/recibos, Saldos a favor, Intenciones de pago, Adhesiones, Resúmenes; Modales: Detalle de obligación, Historial de imputaciones de una obligación, Aprobación; Acciones: Alta de anticipo, Aplicar, Marcar no automático, Solicitar devolución, Anular origen, Cobrar en caja, Generar link de pago, Generar cupón único, Emitir resumen, Aplicar saldo a favor.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-01 | Cuenta corriente del titular | PT-02 | `/admin/cob/cuentas/:currentAccountId` | Usa PT-02 Ficha o detalle con pestañas. Filtros: servicio, estado de saldo, período, rango de vencimiento, comprobante, solo vencidas; Columnas: comprobante… |
| PAN-COB-02 | Imputaciones y reasignación | PT-01 | `/admin/cob/imputaciones` | Zonas: buscador de cuenta, dos paneles, simulación del motor en el pie; Modales: historial de imputaciones de una… |
| PAN-COB-03 | Saldos a favor y anticipos | PT-01 | `/admin/cob/creditos` | Columnas: titular, cuenta, origen, fecha, importe, disponible, aplicación automática, aplicar en próxima factura, estado |
| PAN-COB-05 | Cancelación automática de créditos | PT-01 | `/admin/cob/cancelacion-automatica` | Zonas: filtros |
| PAN-COB-06 | Resúmenes de cuenta y cupón único | PT-01 | `/admin/cob/resumenes` | Columnas: número, cuenta, fecha de corte, total, mínimo, cupón, canales, estado |
| PAN-COB-07 | Configuración de cuenta corriente e imputación | PT-09 | `/admin/cob/config/cuenta-corriente` | Usa PT-09 Configuración versionada. Campos: modalidad por defecto, excepciones, agrupación unificada, mínimo de pago, políticas de imputación versionadas… |

### FAM-COB-02 Caja y cobranza presencial

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-13 Rendición a tesorería (M07:2344) |
| Portales | admin |
| Rutas | `/admin/cob/config/cajas`, `/admin/cob/caja/apertura`, `/admin/cob/caja/cobro`, `/admin/cob/caja/anulaciones` y 5 más |
| Capabilities | `cob.caja.configurar`, `cob.caja.abrir`, `cob.caja.cobrar`, `cob.caja.anular` y 4 más |
| Olas | O5 |
| Wireframe detallado del piloto | W-07 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Inicio > COB > Rendición a… [Entregar] [Recibir] [Imprimir informe de p…*] |
| Rendición a tesorería                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha ▼] [Caja ▼] [Cajero ▼] [Canal ▼] [Más filtros]  |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Sesión    Cajero    Fecha     Efectivo  Cheques   Cupones   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Entregar] [Recibir] [Rechazar … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2311, M07:2317, M07:2323, M07:2332, M07:2338, M07:2344): Filtros: Fecha, Caja, Cajero, Canal, Cuenta, Estado; Columnas: Sesión, Cajero, Fecha, Efectivo, Cheques, Cupones, Retenciones, Estado; Pestañas: Medios, Tarjetas, Planes de cuotas con recargo; Campos: Caja, Fecha de negocio, Fondo inicial por moneda; Zonas: Barra superior, Buscador universal, Panel de avisos, Grilla de obligaciones, Panel lateral de resumen, Panel de medios de pago, Pie, Búsqueda por recibo; Modales: Entrega parcial, Selección de vencimiento, Carga de medio, QR del puesto, Validaciones, Confirmación de pago, Resumen de pagos e impresión, Información de recargo; Acciones: Imprimir informe de presentación del cajero, Entregar, Recibir, Rechazar con observación, Alta/edición, Asociar QR del conector, Desactivar, Anular con motivo, Cerrar, Solicitar aprobación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-08 | Cajas y QR estático | PT-01 | `/admin/cob/config/cajas` | Columnas: número, nombre, sucursal, tipo, usuario fijo, medios, QR, estado |
| PAN-COB-09 | Apertura de caja | PT-04 | `/admin/cob/caja/apertura` | Usa PT-04 Asistente por pasos o proceso masivo. Campos: caja, fecha de negocio, fondo inicial por moneda |
| PAN-COB-10 | Cobro en ventanilla | PT-12 | `/admin/cob/caja/cobro` | Usa PT-12 Pantalla completa de operación (POS, tótem, turnero). Zonas: barra superior, buscador universal, panel de avisos, grilla de obligaciones, panel lateral de… |
| PAN-COB-11 | Anulación de cobranza | PT-01 | `/admin/cob/caja/anulaciones` | Zonas: búsqueda por recibo, detalle de la operación, panel de impedimentos |
| PAN-COB-12 | Cierre y arqueo | PT-04 | `/admin/cob/caja/cierre` | Usa PT-04 Asistente por pasos o proceso masivo. Zonas: verificación de integridad, tabla teórico vs. declarado por medio y moneda, desglose de billetes opcional… |
| PAN-COB-13 | Rendición a tesorería | PT-01 | `/admin/cob/caja/rendiciones` | Columnas: sesión, cajero, fecha, efectivo, cheques, cupones, retenciones, estado |
| PAN-COB-14 | Recibos | PT-01 | `/admin/cob/recibos` | Filtros: fecha, caja, cajero, canal, cuenta, estado |
| PAN-COB-15 | Medios de pago, tarjetas y recargos | PT-03 | `/admin/cob/config/medios` | Usa PT-03 Formulario o editor. Pestañas: medios, tarjetas, planes de cuotas con recargo |
| PAN-COB-16 | Descuentos en caja | PT-01 | `/admin/cob/config/descuentos` | Columnas: tipo de facturación/servicio, día desde, día hasta, producto de bonificación, solo socios, vigencia |

### FAM-COB-03 Entes recaudadores y débito automático

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-21 Adhesiones a débito automático (M07:2390) |
| Portales | admin |
| Rutas | `/admin/cob/config/entes`, `/admin/cob/entes/exportaciones`, `/admin/cob/entes/rendiciones`, `/admin/cob/entes/novedades` y 2 más |
| Capabilities | `cob.entes.configurar`, `cob.entes.exportar`, `cob.entes.importar`, `cob.debitos.importar` y 2 más |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > COB > Adhesiones a débito automá… [Suspender] [Reactivar] [Alta*] |
| Adhesiones a débito automático                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Servicios ▼] [Estado ▼] [Más filtros]                 |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Cuenta    Titular   Medio     Ente/cone Servicios Desde     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Suspender] [Reactivar] [Exclus… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2367, M07:2373, M07:2379, M07:2385, M07:2390, M07:2396): Filtros: Servicios, Estado; Columnas: Cuenta, Titular, Medio, Ente/conector, Servicios, Desde, Estado, Rechazos consecutivos; Campos: Identificación, Convenio, Caja virtual, Cuenta bancaria, Layouts, Forma de identificar, Reglas de vencimiento, Entregas, Recargos, Comisión; Zonas: Definición por campos, Asistente, Historial de exportaciones, Base de deuda SIRO, Carga, Cabecera validada, Tabla de líneas, Totales leídos vs. pie; Pasos: Selección y filtros, Generar; Acciones: Alta, Suspender, Reactivar, Cancelar, Exclusiones por tipo de facturación, Ver detalle con historial, Confirmar seleccionadas, Ver archivo original, Enviar línea a no identificados, Ignorar con motivo.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-17 | Entes recaudadores y layouts | PT-01 | `/admin/cob/config/entes` | Campos: identificación, convenio, caja virtual, cuenta bancaria, layouts, forma de identificar, reglas de vencimiento… |
| PAN-COB-18 | Archivo de deuda a entes | PT-04 | `/admin/cob/entes/exportaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Columnas: ente, fecha, operación, registros, totales por vencimiento, canal, estado; Zonas: asistente, historial de… |
| PAN-COB-19 | Importación de rendiciones | PT-04 | `/admin/cob/entes/rendiciones` | Usa PT-04 Asistente por pasos o proceso masivo. Zonas: carga, cabecera validada, tabla de líneas, totales leídos vs. pie |
| PAN-COB-20 | Morosidad y novedades de entes | PT-01 | `/admin/cob/entes/novedades` | Admin · /cob/entes/novedades · cob.debitos.importar. acciones: importar archivo de novedades (altas, bajas… |
| PAN-COB-21 | Adhesiones a débito automático | PT-01 | `/admin/cob/debitos/adhesiones` | Columnas: cuenta, titular, medio, ente/conector, servicios, desde, estado, rechazos consecutivos |
| PAN-COB-22 | Presentaciones y rechazos de débito | PT-01 | `/admin/cob/debitos/lotes` | Zonas: lotes por ente y fecha, detalle por ítem, importación de resultados |

### FAM-COB-04 Pasarelas de pago

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-24 Intenciones de pago (M07:2407) |
| Portales | admin |
| Rutas | `/admin/cob/config/pasarelas`, `/admin/cob/pasarelas/intenciones`, `/admin/cob/pasarelas/links` |
| Capabilities | `cob.pasarelas.configurar`, `cob.intenciones.ver`, `cob.links.crear` |
| Olas | O5 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Intenciones de pago                           [x] |
+----------------------------------------------------------------------+
| Ambiente * [________________________]                                |
| Referencia de credencial * [________________________]                |
| Capacidades   [________________________]                             |
| Canales   [________________________]                                 |
| Medios   [____________________ ▼]                                    |
| Exclusiones   [________________________]                             |
| Monto mínimo   [$ __________]                                        |
| Datos del comercio para QR   [________________________]              |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
| [Consultar est…] [Reprocesar im…]         [Cancelar] [Crear manual*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2401, M07:2407, M07:2414): Filtros: Conector, Tipo, Estado, Fecha, Cuenta, Id externo; Columnas: Número, Conector, Tipo, Cuenta, Importe, Vencimiento, Estado, Id externo; Campos: Ambiente, Referencia de credencial, Capacidades, Canales, Medios, Exclusiones, Monto mínimo, Datos del comercio para QR, Caja virtual, Ventana de reutilización; Zonas: Tarjetas por conector, Formulario por conector, Canales visibles en portal; Acciones: Crear manual, Consultar estado en el proveedor, Reprocesar imputación, Cancelar, Buscar por id externo, Generación masiva con barra de progreso, Probar conexión, Activar/desactivar, Rotar token de webhook.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-23 | Conectores de pasarelas y canales | PT-05 | `/admin/cob/config/pasarelas` | Usa PT-05 Tablero, reporte o mapa. Campos: ambiente, referencia de credencial, capacidades, canales, medios, exclusiones, monto mínimo, datos del… |
| PAN-COB-24 | Intenciones de pago | PT-03 | `/admin/cob/pasarelas/intenciones` | Filtros: conector, tipo, estado, fecha, cuenta, id externo; Columnas: número, conector, tipo, cuenta, importe… |
| PAN-COB-25 | Link de pago | PT-03 | `/admin/cob/pasarelas/links` | Campos: obligaciones o cupón, conector, vencimiento del link, canal de envío, destinatario |

### FAM-COB-05 Control de cobranza

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-04 Bandeja de cobros no identificados (M07:2286) |
| Portales | admin |
| Rutas | `/admin/cob/no-identificados`, `/admin/cob/devoluciones`, `/admin/cob/conciliacion`, `/admin/cob/excepciones` |
| Capabilities | `cob.noIdentificados.ver`, `cob.devoluciones.solicitar`, `cob.conciliacion.ver`, `cob.excepciones.resolver` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Bandeja de cobros no identificados        [Solicitar devolución*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Canal ▼] [Estado ▼]    |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Fecha … · Canal ·… | | Expedientes: ········                 | |
| | [SLA 2 h] Fecha … · Canal ·… | | Contracargos: ········                | |
| | [SLA 2 h] Fecha … · Canal ·… | | Tablero por día y can…: ········      | |
| | ...                          | | Detalle por ítem: ········            | |
| |                              | | Excepciones vinculadas: ········      | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Asignar] [Identificar] [Aplicar]     | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2286, M07:2419, M07:2424, M07:2460): Filtros: Canal, Estado, Antigüedad, Importe, Asignado a, Tipo; Columnas: Fecha de cobro, Canal, Importe, Datos del pagador, Candidatos sugeridos, Días, Estado, Asignado; Campos: Expedientes, Contracargos, Tablero por día y canal, Detalle por ítem, Excepciones vinculadas; Zonas: Expedientes, Contracargos, Tablero por día y canal, Detalle por ítem, Excepciones vinculadas; Acciones: Asignar, Identificar, Aplicar, Pasar a saldo a favor, Solicitar devolución, Anular con autorización, Emparejar manualmente, Comentar, Cerrar el día, Abrir el origen.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-04 | Bandeja de cobros no identificados | PT-06 | `/admin/cob/no-identificados` | Filtros: canal, estado, antigüedad, importe, asignado a; Columnas: fecha de cobro, canal, importe, datos del pagador… |
| PAN-COB-26 | Devoluciones y contracargos | PT-01 | `/admin/cob/devoluciones` | Usa PT-01 Listado con filtros. Zonas: expedientes, contracargos |
| PAN-COB-27 | Conciliación de cobranzas | PT-06 | `/admin/cob/conciliacion` | Zonas: tablero por día y canal, detalle por ítem, excepciones vinculadas |
| PAN-COB-34 | Bandeja de excepciones de cobranza | PT-06 | `/admin/cob/excepciones` | Filtros: tipo, severidad, estado, asignado, antigüedad |

### FAM-COB-06 Cobradores y cobranza en campo

| Dato | Valor |
|---|---|
| Patrón base | PT-08 App de campo móvil (offline) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-29 PWA del cobrador (M07:2435) |
| Portales | admin, campo |
| Rutas | `/admin/cob/cobradores`, `/app/campo/cobrador` |
| Capabilities | `cob.cobradores.gestionar`, `cob.cobranzaCampo.ver` |
| Olas | O5 |

```text
+------------------------------------------------------------+
| Sin conexión · N cambios pendientes [Sincronizar]          |
+------------------------------------------------------------+
| PWA del cobrador                                    Sincr. |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Lista del día en cards: ········                       | |
| | FAB "Cobrar": ········                                 | |
| | Recibo provisorio compartible: ········                | |
| | Indicador de sincronización y cola pendiente: ········ | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Lista del día en cards: ········                       | |
| | FAB "Cobrar": ········                                 | |
| | Recibo provisorio compartible: ········                | |
| | Indicador de sincronización y cola pendiente: ········ | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [Cámara] [Firma] [Escanear]                                |
|                                                      ( + ) |
| [                       Iniciar                       * ]  |
+------------------------------------------------------------+
| Hoy | Órdenes | (+) | Stock en vehículo | Sincronización   |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2430, M07:2435): Pestañas: Cobradores, Listas de cobro, Rendiciones de cobradores, Liquidación de comisiones; Campos: Lista del día en cards, FAB "Cobrar", Recibo provisorio compartible, Indicador de sincronización y cola pendiente, Cobros en cola; Zonas: Lista del día en cards, FAB "Cobrar", Recibo provisorio compartible, Indicador de sincronización y cola pendiente, Cobros en cola. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-28 | Cobradores y listas de cobro | PT-03 | `/admin/cob/cobradores` | Usa PT-03 Formulario o editor. Pestañas: cobradores, listas de cobro, rendiciones de cobradores, liquidación de comisiones |
| PAN-COB-29 | PWA del cobrador | PT-08 | `/app/campo/cobrador` | Zonas: lista del día en cards, FAB "Cobrar", recibo provisorio compartible, indicador de sincronización y cola… |

### FAM-COB-07 Cobro de terceros, bloqueos, importaciones y valores

| Dato | Valor |
|---|---|
| Patrón base | PT-03 Formulario o editor ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-31 Bloqueos de cobro (M07:2445) |
| Portales | admin |
| Rutas | `/admin/cob/config/terceros`, `/admin/cob/bloqueos`, `/admin/cob/importaciones`, `/admin/cob/valores` |
| Capabilities | `cob.terceros.configurar`, `cob.bloqueos.gestionar`, `cob.imputaciones.crear`, `cob.caja.ver` |
| Olas | O4 a O5 |

```text
+----------------------------------------------------------------------+
| Modal md (720 px): Bloqueos de cobro                             [x] |
+----------------------------------------------------------------------+
| ExcelImportWizard * [________________________]                       |
| Consulta de lo importado * [________________________]                |
|                                                                      |
| FormErrorSummary: errores con enlace a cada campo                    |
+----------------------------------------------------------------------+
|                                 [Cancelar] [Motivo y vencimiento …*] |
+----------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2441, M07:2445, M07:2450, M07:2455): Columnas: Banco, Número, Fecha, Librador, Importe, Recibo, Caja, Estado; Campos: ExcelImportWizard, Consulta de lo importado; Zonas: ExcelImportWizard, Consulta de lo importado; Pasos: Vista previa con errores; Acciones: Motivo y vencimiento del bloqueo.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-30 | Cobro por cuenta de terceros | PT-03 | `/admin/cob/config/terceros` | Admin · /cob/config/terceros (ABM) y acción en PAN-COB-10 · cob.terceros.configurar, cob.caja.cobrar |
| PAN-COB-31 | Bloqueos de cobro | PT-03 | `/admin/cob/bloqueos` | Admin · /cob/bloqueos · cob.bloqueos.gestionar. acciones: bloqueo/desbloqueo individual o masivo por filtro (servicio… |
| PAN-COB-32 | Importación de obligaciones externas | PT-04 | `/admin/cob/importaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Zonas: ExcelImportWizard, consulta de lo importado; Pasos: `ExcelImportWizard` (subir, vista previa con errores… |
| PAN-COB-33 | Cheques recibidos | PT-01 | `/admin/cob/valores` | Usa PT-01 Listado con filtros. Columnas: banco, número, fecha, librador, importe, recibo, caja, estado |

### FAM-COB-08 Reportes y cuenta del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-10 Página pública (landing) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-COB-35 Mi cuenta y pagar (socio) (M07:2466) |
| Portales | admin, landing |
| Rutas | `/mi-cuenta`, `/admin/cob/reportes` |
| Capabilities | `cob.miCuenta.ver`, `cob.reportes.ver` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| (logo cooperativa)  Servicios  Noticias  Trámites  Ayuda       [Ingresar*] |
+----------------------------------------------------------------------------+
| HERO: Mi cuenta y pagar (socio)                                            |
| [Ingresar*]   [Ver más]                                                    |
+----------------------------------------------------------------------------+
| [ Esquemas de informe ]                                                    |
+----------------------------------------------------------------------------+
| Pie: legales · accesibilidad · contacto · redes · (marca de la cooperativ… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M07:2466, M07:2472): Campos: Esquemas de informe; Zonas: Card de saldo total y próximo vencimiento, Lista de obligaciones por servicio, Selección y "Pagar", Estado del pago, Recibos descargables, Adhesión a débito, Informar transferencia, Nunca datos personales completos. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-COB-35 | Mi cuenta y pagar (socio) | PT-10 | `/mi-cuenta` | Zonas: card de saldo total y próximo vencimiento, lista de obligaciones por servicio, selección y "Pagar", estado del… |
| PAN-COB-36 | Reportes de cobranza | PT-05 | `/admin/cob/reportes` | Usa PT-05 Tablero, reporte o mapa. Campos: catálogo de la sección 15 con filtros comunes, esquemas de informe |

## M08 MOR: Mora y financiación

Anexo `docs/especificacion/anexos/M08-MOR-mora-financiacion.md`, §10. 8 familias, 42 PAN. Catálogo: [17-08-M08-MOR.md](17-catalogo-pantallas/17-08-M08-MOR.md).

### FAM-MOR-01 Tablero e informes de mora

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-01 Tablero de mora (M08:2025) |
| Portales | admin |
| Rutas | `/admin/mor/tablero`, `/admin/mor/informes` |
| Capabilities | `mor.deuda.ver`, `mor.informes.ver` |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Tablero de mora             Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Casos por estado ▼]                                                       |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Deuda venc Cuentas po Promesas   Casos por  Convenios  Recupero   [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   [Activo]   ········   ········    ...     |
| ········   ········   ········   [Pendiente ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2025, M08:2061): Filtros: Casos por estado; Columnas: Deuda vencida por tramo, Cuentas por instancia, Promesas, Casos por estado, Convenios vigentes/caídos, Recupero; Campos: Deuda vencida por tramo, Cuentas por instancia, Promesas, Casos por estado, Convenios vigentes/caídos, Recupero, Filtros servicio, Sucursal, Zona, Fecha de corte; Acciones: Ir a cada bandeja, Exportar, Exportar XLSX/CSV/PDF, Programar envío.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-01 | Tablero de mora | PT-05 | `/admin/mor/tablero` | Campos: deuda vencida por tramo, cuentas por instancia, promesas, casos por estado, convenios vigentes/caídos… |
| PAN-MOR-37 | Informes de mora y financiación | PT-05 | `/admin/mor/informes` | Informes de mora y financiación. Catálogo con los informes de §15; filtros por informe (con fecha de corte); vista… |

### FAM-MOR-02 Intereses y recargos

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-02 Políticas de interés (M08:2026) |
| Portales | admin |
| Rutas | `/admin/mor/politicas-interes`, `/admin/mor/tasas`, `/admin/mor/indices`, `/admin/mor/recargo-vencimientos` y 4 más |
| Capabilities | `mor.politicasInteres.ver`, `mor.tasas.ver`, `mor.indices.ver`, `mor.tramasRecargo.configurar` y 4 más |
| Olas | O4 a O6 |

```text
+----------------------------------------------------------------------------+
| Políticas de interés                                             (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]               [Nueva versión*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Tablas de tasas p… | | Código [______________]                       | |
| | > Tablas de índices  | | Alcance [______________]                      | |
| | > Esquemas de recar… | | Método [______________]                       | |
| | > Descuentos por pr… | | Vigencia [______________]                     | |
| | > Cotizar recargo    | | Estado [______________]                       | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2026, M08:2027, M08:2028, M08:2029, M08:2030, M08:2031): Columnas: Código, Alcance, Método, Vigencia, Estado; Pestañas: Tablas de tasas por vigencia, Tablas de índices, Esquemas de recargo entre vencimientos, Descuentos por pronto pago, Cotizar recargo; Pasos: Simulador TOTAL1, TOTAL2; Acciones: Nueva versión, Publicar, Retirar, Duplicar, Agregar tramo, Asignar categorías, Importar Excel, ExcelImportWizard, Alta manual, Validar huecos.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-02 | Políticas de interés | PT-09 | `/admin/mor/politicas-interes` | Columnas: código, alcance, método, vigencia, estado |
| PAN-MOR-03 | Tablas de tasas por vigencia | PT-09 | `/admin/mor/tasas` | Tablas de tasas por vigencia. DataTable de tablas; detalle con tramos (desde, hasta, % diario, categorías, fuente)… |
| PAN-MOR-04 | Tablas de índices | PT-09 | `/admin/mor/indices` | Tablas de índices. DataTable de tablas (código, nombre, propósito, tipos); detalle con serie (fecha, valor) y gráfico… |
| PAN-MOR-05 | Esquemas de recargo entre vencimientos | PT-03 | `/admin/mor/recargo-vencimientos` | Usa PT-03 Formulario o editor. Pasos: simulador TOTAL1, TOTAL2 |
| PAN-MOR-06 | Descuentos por pronto pago | PT-03 | `/admin/mor/pronto-pago` | Usa PT-03 Formulario o editor. Descuentos por pronto pago. DataTable por tipo de documento: días desde/hasta, %, solo socios. Alta/edición md… |
| PAN-MOR-07 | Cotizar recargo | PT-01 | `/admin/mor/calculadora` | Usa PT-01 Listado con filtros. Cotizar recargo. Buscador de cuenta/documentos; fecha de cálculo; resultado por documento con componentes y tramos… |
| PAN-MOR-08 | Corridas de intereses a facturar | PT-04 | `/admin/mor/intereses-facturar` | Usa PT-04 Asistente por pasos o proceso masivo. Corridas de intereses a facturar. Lista de corridas; asistente: 1 filtros (RF-MOR-049), 2 preliminar (DataTable por… |
| PAN-MOR-09 | Bloqueos de documentos | PT-01 | `/admin/mor/bloqueos` | Usa PT-01 Listado con filtros. Bloqueos de documentos. DataTable de documentos con bloqueo activo e historial; filtros causa, origen, cuenta… |

### FAM-MOR-03 Políticas e instancias de gestión

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-11 Instancias de mora (M08:2035) |
| Portales | admin |
| Rutas | `/admin/mor/politicas-mora`, `/admin/mor/instancias`, `/admin/mor/modelos-aviso`, `/admin/mor/excepciones` y 1 más |
| Capabilities | `mor.politicasMora.ver`, `mor.instancias.configurar`, `mor.modelosAviso.configurar`, `mor.excepciones.ver` y 1 más |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Inicio > MOR > Instancias de mora                      [Alta/edición `sm*] |
| Instancias de mora                                               (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Más filtros]                                 |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Orden     Días      Tipo      Marcas    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar]                       25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2034, M08:2035, M08:2036, M08:2047, M08:2050): Filtros: Tipo; Columnas: Código, Nombre, Orden, Días, Tipo, Marcas, Cuenta, Motivo; Pestañas: Alcance, Modo de cuenta, Saldo elegible, Candidatos, Pago mínimo, Instancias, Acción final; Acciones: Publicar con diff, Simular sobre cuenta de prueba, Versionar, Previsualizar con cuenta de prueba, Autorizar, Desautorizar, Nota en cuenta, Imprimir.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-10 | Políticas de mora por servicio y categoría | PT-09 | `/admin/mor/politicas-mora` | Usa PT-09 Configuración versionada. Pestañas: alcance, modo de cuenta, saldo elegible, candidatos, pago mínimo, instancias, acción final, afectación… |
| PAN-MOR-11 | Instancias de mora | PT-01 | `/admin/mor/instancias` | Columnas: código, nombre, orden, días, tipo, marcas |
| PAN-MOR-12 | Modelos de aviso | PT-03 | `/admin/mor/modelos-aviso` | Usa PT-03 Formulario o editor. Modelos de aviso. DataTable; editor con texto y variables, versión SMS/WhatsApp, plantilla T09, firmas, detalle por… |
| PAN-MOR-23 | Excepciones de mora | PT-06 | `/admin/mor/excepciones` | Usa PT-06 Bandeja de trabajo. Columnas: cuenta, motivo, no reclamar, no cobrar interés, vigencia, deuda anterior a, estado de autorización, usuarios |
| PAN-MOR-26 | Causas de baja | PT-01 | `/admin/mor/causas` | Causas. DataTable por tipo. Alta/edición sm |

### FAM-MOR-04 Notificaciones de deuda

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-14 Gestión de notificaciones (M08:2038) |
| Portales | admin |
| Rutas | `/admin/mor/candidatos`, `/admin/mor/notificaciones`, `/admin/mor/notificaciones/consulta` |
| Capabilities | `mor.candidatos.generar`, `mor.notificaciones.ver`, `mor.notificaciones.procesar`, `mor.notificaciones.marcarEntrega` y 2 más |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Inicio > MOR > Gestión de notific… [Marcar entrega] [Promesa] [Notificar*] |
| Gestión de notificaciones                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha ▼] [Más filtros]                                |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Lote      Cuenta    Titular   Fecha     Vencimien Deuda     [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   dd-mm-yyy dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy dd-mm-yyy ·······    ...       |
| [ ] ·······   ·······   ·······   dd-mm-yyy dd-mm-yyy ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Marcar entrega] [Promesa] [Dar… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2037, M08:2038, M08:2039, M08:2040, M08:2041, M08:2042): Filtros: Fecha; Columnas: Lote, Cuenta, Titular, Fecha, Vencimiento, Deuda, Deuda actualizada, Entrega; Acciones: Notificar, Marcar entrega, Promesa, Dar de baja, Cerrar, Anular lote, Reprocesar lote, Ver antecedentes, Generar lote, Exportar excluidas.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-13 | Generar notificaciones | PT-04 | `/admin/mor/candidatos` | Usa PT-04 Asistente por pasos o proceso masivo. Generar candidatos. Formulario de filtros (RF-MOR-077); resultado previo con incluidas y excluidas (motivo). Generar… |
| PAN-MOR-14 | Gestión de notificaciones | PT-01 | `/admin/mor/notificaciones` | Columnas: lote, cuenta, titular, fecha, vencimiento, deuda, deuda actualizada, entrega, promesa, calificación |
| PAN-MOR-15 | Notificar/avanzar instancia | PT-01 | — | Notificar/avanzar instancia. Instancia destino, canal, modelo, vencimiento, incluir deuda vencida, generar comprobante… |
| PAN-MOR-16 | Marcar entrega y constancias | PT-09 | — | Usa PT-09 Configuración versionada. Marcar entrega y constancias. Operación (entregar/desmarcar), fecha, tipo de evidencia, adjunto. Confirmar |
| PAN-MOR-17 | Antecedentes y calificación | PT-01 | — | Antecedentes y calificación. Historial de notificaciones calificadas, servicios, accesos a cuenta corriente, deuda y… |
| PAN-MOR-18 | Deuda notificada / actualizada | PT-01 | — | Deuda notificada / actualizada. Documentos notificados vs nuevos, saldo notificado vs actual, avisos. Imprimir |
| PAN-MOR-21 | Consulta de notificaciones por cuenta | PT-01 | `/admin/mor/notificaciones/consulta` | Consulta de notificaciones por cuenta. Buscador de cuenta; historial completo en cualquier estado con bitácora. Ver… |

### FAM-MOR-05 Tratamiento, restricciones e interrupción del servicio

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-27 Casos de interrupción (M08:2051) |
| Portales | admin, plataforma |
| Rutas | `/admin/mor/tratamiento`, `/admin/mor/operaciones-especiales`, `/admin/mor/protecciones`, `/admin/mor/restricciones` y 2 más |
| Capabilities | `mor.tratamiento.ver`, `mor.tratamiento.ejecutar`, `mor.operacionesEspeciales.ejecutar`, `mor.protecciones.ver` y 3 más |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Inicio > MOR > Casos de int… [Ver ficha] [Reprogramar] [Aprobar/rechazar*] |
| Casos de interrupción                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Servicio ▼] [Estado ▼] [Más filtros]         |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Tipo      Servicio  Cuenta    Estado    Decisión  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Pendient ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   [Activo]  ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Ver ficha] [Reprogramar] [Rein… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2043, M08:2044, M08:2046, M08:2048, M08:2049, M08:2051): Filtros: Tipo, Servicio, Estado; Columnas: Número, Tipo, Servicio, Cuenta, Estado, Decisión, Ventana, Orden; Acciones: Ver ficha, Aprobar/rechazar, Reprogramar, Cancelar, Reintentar ejecución, Suspender/desconectar, Cambiar estado, Cambiar categoría, Incidente técnico, Baja de servicios.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-19 | Tratamiento de morosos | PT-01 | `/admin/mor/tratamiento` | Tratamiento de morosos. Filtros (instancia, servicio, pagos parciales, cantidad de pagados, deuda actualizada); grilla… |
| PAN-MOR-20 | Orden de interrupción | PT-01 | — | Orden de interrupción. Datos del servicio, vía de ingreso, observación técnica (obligatoria salvo política), ventana… |
| PAN-MOR-22 | Operaciones especiales | PT-01 | `/admin/mor/operaciones-especiales` | Operaciones especiales. Consulta por instancia, lote y estado; resultados con efectos asociados. Resolver, eliminar… |
| PAN-MOR-24 | Protecciones normativas | PT-01 | `/admin/mor/protecciones` | Columnas: tipo, persona/suministro, efecto, vigencia, verificación, norma |
| PAN-MOR-25 | Matriz de restricciones | PT-01 | `/admin/mor/restricciones` | Matriz de restricciones. DataTable por jurisdicción y servicio; filas normative en solo lectura para el tenant… |
| PAN-MOR-27 | Casos de interrupción | PT-01 | `/admin/mor/interrupciones` | Columnas: número, tipo, servicio, cuenta, estado, decisión, ventana, orden, confirmación, filtros |
| PAN-MOR-28 | Reglas de cargos de suspensión/reconexión | PT-09 | `/admin/mor/cargos-interrupcion` | Usa PT-09 Configuración versionada. Reglas de cargos de suspensión/reconexión. DataTable; editor con filtros (RN-MOR-095), concepto, antes/después, una… |

### FAM-MOR-06 Planes de pago y convenios

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-31 Planes de financiación (M08:2055) |
| Portales | admin |
| Rutas | `/admin/mor/planes-pago`, `/admin/mor/convenios/nuevo`, `/admin/mor/convenios`, `/admin/mor/entidades-financieras` y 1 más |
| Capabilities | `mor.planesPago.configurar`, `mor.simulador.usar`, `mor.convenios.ver`, `mor.entidadesFinancieras.configurar` y 1 más |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Inicio > MOR > Planes de financiación                            (?) Ayuda |
| Planes de fi… [Cancelar anticipa…] [Refinanciar] [Imprimir convenio y t…*] |
+----------------------------------------------------------------------------+
| Resumen | Obligaciones incl… | Cuotas | Pagos | Firmantes | Firmas         |
| =======                                                                    |
| Número     Cuenta     Fecha      Plan       Deuda      Cuotas pag [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   dd-mm-yyyy ········   ········   ········    ...     |
| ········   ········   dd-mm-yyyy ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2053, M08:2054, M08:2055, M08:2056, M08:2057): Columnas: Número, Cuenta, Fecha, Plan, Deuda, Cuotas pagas/vencidas, Estado, Obligaciones incluidas; Pestañas: Resumen, Obligaciones incluidas, Cuotas, Pagos, Firmantes, Firmas, Garantías; Acciones: Imprimir convenio y talonario/liquidación, Cancelar anticipadamente, Refinanciar, Declarar caducidad, Rehabilitar, Anular, Cambiar garante, Recalcular cuotas fiscales, Publicar, Duplicar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-29 | Planes de pago | PT-03 | `/admin/mor/planes-pago` | Usa PT-03 Formulario o editor. Columnas: código, finalidad, método, cuotas, tasa, vigencia, editor `xl` con simulador lateral |
| PAN-MOR-30 | Simulador y alta de convenio | PT-04 | `/admin/mor/convenios/nuevo` | Usa PT-04 Asistente por pasos o proceso masivo. Simulador y alta de convenio. Asistente: 1 cuenta y obligaciones (con marca de excluidas y motivo), 2 plan y… |
| PAN-MOR-31 | Planes de financiación | PT-02 | `/admin/mor/convenios` | Columnas: número, cuenta, fecha, plan, deuda, cuotas pagas/vencidas, estado, ficha `xl` con pestañas: resumen… |
| PAN-MOR-32 | Entidades financieras | PT-03 | `/admin/mor/entidades-financieras` | Usa PT-03 Formulario o editor. Entidades financieras. DataTable; editor con planes (cuotas, coeficiente, CFT, comisión, acreditación) |
| PAN-MOR-33 | Garantías y garantes | PT-02 | `/admin/mor/garantias` | Garantías y garantes. DataTable; ficha con documentos y liquidación; reglas de exigencia. Alta, ejecutar, aplicar… |

### FAM-MOR-07 Recupero, gestión externa e incobrables

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-35 Incobrables (M08:2059) |
| Portales | admin |
| Rutas | `/admin/mor/gestion-externa`, `/admin/mor/incobrables`, `/admin/mor/prescripcion`, `/admin/mor/seguimiento` y 1 más |
| Capabilities | `mor.gestionExterna.ver`, `mor.incobrables.ver`, `mor.prescripcion.configurar`, `mor.deuda.ver` y 1 más |
| Olas | O6 |

```text
+----------------------------------------------------------------------------+
| Inicio > MOR > Incobrables       [Proponer] [Revertir] [Aprobar/rechazar*] |
| Incobrables                                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Propuesta Documento Aprobados Recuperos Proponer  Gestión e [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Proponer] [Revertir]            25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2058, M08:2059, M08:2060, M08:2062, M08:2066): Columnas: Propuestas con criterio, Documentos, Aprobados, Recuperos, Proponer, Gestión externa; Campos: Propuestas con criterio, Documentos, Aprobados, Recuperos, Proponer, Gestión externa, Judicial, DataTable de expedientes; Acciones: Proponer, Aprobar/rechazar, Revertir, Derivar deuda, Registrar evento/costo, Cerrar, Aprobar, Ejecutar, Registrar contacto, Programar paso.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-34 | Gestión externa y judicial | PT-02 | `/admin/mor/gestion-externa` | Usa PT-02 Ficha o detalle con pestañas. Gestión externa y judicial. DataTable de expedientes; ficha con documentos, eventos, costos, recuperos; ABM de… |
| PAN-MOR-35 | Incobrables | PT-01 | `/admin/mor/incobrables` | Incobrables. Propuestas con criterio y documentos; aprobados; recuperos. Proponer, aprobar/rechazar, revertir |
| PAN-MOR-36 | Prescripción | PT-01 | `/admin/mor/prescripcion` | Prescripción. Reglas por tipo de obligación; corrida con fecha de corte, ítems elegibles e interrumpidos. Proponer… |
| PAN-MOR-38 | Expedientes de seguimiento de deuda | PT-02 | `/admin/mor/seguimiento` | Usa PT-02 Ficha o detalle con pestañas. Expedientes de seguimiento de deuda. Bandeja por segmento y responsable; contactos, compromisos y próximos pasos… |
| PAN-MOR-42 | Portal de estudios | PT-01 | `/admin/api/v1/ext/mor/...` | Portal de estudios. Expedientes asignados, deuda actualizada, registro de avances. Registrar avance/costo |

### FAM-MOR-08 Deuda y planes del socio

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-MOR-39 Mi deuda y avisos (M08:2063) |
| Portales | socio |
| Rutas | `/app/deuda`, `/app/convenios`, `/app/servicios/:contractId/:accion` |
| Capabilities | `mor.miDeuda.ver`, `mor.simulador.usar`, `mor.interrupciones.solicitar` |
| Olas | O2 a O6 |

```text
+------------------------------------------------------------+
| < Mi deuda y avisos                                    (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Mi deuda: ········                                     | |
| | Avisos: ········                                       | |
| | Detalle del recargo: ········                          | |
| | Banner de instancia: ········                          | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Mi deuda: ········                                     | |
| | Avisos: ········                                       | |
| | Detalle del recargo: ········                          | |
| | Banner de instancia: ········                          | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                        Pagar                        * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M08:2063, M08:2064, M08:2065): Campos: Mi deuda, Avisos, Detalle del recargo, Banner de instancia, Riesgo de suspensión, Promesa; Pasos: FAB "+", Simular plan / promesa; Acciones: Pagar, Ver detalle, Descargar aviso, Simular, Aceptar, Firmar, Pagar anticipo, Cancelar anticipadamente, Solicitar, Aceptar condiciones.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-MOR-39 | Mi deuda y avisos | PT-07 | `/app/deuda` | Pasos: FAB "+", simular plan / promesa |
| PAN-MOR-40 | Simular, aceptar y firmar convenio | PT-07 | `/app/convenios` | Simular, aceptar y firmar convenio. Simulador con planes habilitados para portal; cronograma y CFT; aceptación con… |
| PAN-MOR-41 | Suspensión voluntaria y reactivación | PT-07 | `/app/servicios/:contractId/:accion` | Suspensión voluntaria y reactivación. Opciones habilitadas del servicio, condiciones, costo (ARS 0 o habilitado)… |

## M09 CRM: Atención (CRM)

Anexo `docs/especificacion/anexos/M09-CRM-atencion.md`, §10. 8 familias, 36 PAN. Catálogo: [17-09-M09-CRM.md](17-catalogo-pantallas/17-09-M09-CRM.md).

### FAM-CRM-01 Bandejas y expediente del caso

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-02 Bandeja de mi área y mis casos (M09:1798) |
| Portales | admin |
| Rutas | `/admin/crm/supervision`, `/admin/crm/bandeja`, `/admin/crm/casos/:id`, `/admin/crm/carga-rapida` y 2 más |
| Capabilities | `crm.bandejaSupervision.ver`, `crm.casos.ver`, `crm.casos.crear`, `crm.tramites.configurar` |
| Olas | O2 |
| Wireframe detallado del piloto | W-08 en [05](05-wireframes-pantallas-piloto.md) |

```text
+----------------------------------------------------------------------------+
| Bandeja: Bandeja de mi área y mis casos                           [Tomar*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Servicio ▼] [Tipo ▼]   |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Número · Priori… … | | Número: ········                      | |
| | [SLA 2 h] Número · Priori… … | | Prioridad: ········                   | |
| | [SLA 2 h] Número · Priori… … | | Asunto: ········                      | |
| | ...                          | | Socio: ········                       | |
| |                              | | Cuenta: ········                      | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Pausar] [Soltar] [Espera del socio]  | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1797, M09:1798, M09:1799, M09:1800, M09:1802, M09:1817): Filtros: Servicio, Tipo, Subtipo, Estado, Área, Prioridad; Columnas: Número, Prioridad, Asunto, Socio, Cuenta, Servicio, Canal, Estado; Pestañas: Mis casos, Mi área, Tomado, En espera del socio, Vencidos, Tipos, Presentados/No presentados/Vencidos; Modales: Resolver; Acciones: Tomar, Pausar, Soltar, Espera del socio, Avanzar estado, Responder, Derivar, Asignar, Reclasificar, Vincular a incidente.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-01 | Bandeja de supervisión | PT-06 | `/admin/crm/supervision` | Filtros: servicio, tipo, subtipo, estado, área, prioridad, antigüedad, responsable, canal, SLA; Columnas: número… |
| PAN-CRM-02 | Bandeja de mi área y mis casos | PT-06 | `/admin/crm/bandeja` | Pestañas: Mis casos, Mi área, Tomado, En espera del socio, Vencidos |
| PAN-CRM-03 | Expediente del caso | PT-02 | `/admin/crm/casos/:id` | Usa PT-02 Ficha o detalle con pestañas. Modales: resolver |
| PAN-CRM-04 | Alta y carga rápida de reclamo | PT-03 | `/admin/crm/carga-rapida` | Usa PT-03 Formulario o editor. Alta y carga rápida de reclamo. Modal lg: buscar persona/cuenta (documento, cuenta, teléfono), servicio (solo… |
| PAN-CRM-06 | Búsqueda global | PT-01 | `/admin/crm/buscar` | Usa PT-01 Listado con filtros. Búsqueda global. Caja única (número de caso, expediente, documento, cuenta, teléfono, email); resultados agrupados |
| PAN-CRM-21 | Trámites con vencimiento | PT-02 | `/admin/crm/tramites` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Tipos, Presentados/No presentados/Vencidos, carga de trámite |

### FAM-CRM-02 Vista 360 y conversaciones

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-05 Vista 360 del socio (M09:1801) |
| Portales | admin |
| Rutas | `/admin/crm/personas/:personId/360`, `/admin/crm/conversaciones` |
| Capabilities | `crm.casos.ver`, `crm.conversaciones.atender` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Inicio > CRM > Vista 360 del socio                               (?) Ayuda |
| Vista 360 del socio  [Activo]   [Ver historial] [Cambiar estado] [Editar*] |
+----------------------------------------------------------------------------+
| Timeline unificado: ········  Botones "Nuevo caso": ········  "Abrir conv… |
| "Registrar llamada": ········  Bandeja omnicanal: ········  Consola de ag… |
+----------------------------------------------------------------------------+
| Bandeja omnicanal…                                                         |
| ==================                                                         |
| Timeline u Botones "N "Abrir con "Registrar Bandeja om Consola de [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1801, M09:1806): Columnas: Timeline unificado, Botones "Nuevo caso", "Abrir conversación WhatsApp", "Registrar llamada", Bandeja omnicanal, Consola de agente; Pestañas: Bandeja omnicanal y consola de agente; Campos: Timeline unificado, Botones "Nuevo caso", "Abrir conversación WhatsApp", "Registrar llamada", Bandeja omnicanal, Consola de agente, Centro, Conversación con editor. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-05 | Vista 360 del socio | PT-02 | `/admin/crm/personas/:personId/360` | Vista 360 del socio. Timeline unificado (interacciones, casos, turnos, comunicaciones, encuestas, notas de cuenta de… |
| PAN-CRM-10 | Bandeja omnicanal y consola de agente | PT-06 | `/admin/crm/conversaciones` | Usa PT-06 Bandeja de trabajo. Bandeja omnicanal y consola de agente. Lista izquierda por canal/estado/espera; centro: conversación con editor… |

### FAM-CRM-03 Incidentes, mesa de entradas y tableros

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-09 Libro de mesa de entradas (M09:1805) |
| Portales | admin |
| Rutas | `/admin/crm/incidentes`, `/admin/crm/incidentes/:id`, `/admin/crm/mesa-entradas`, `/admin/crm/tablero` y 1 más |
| Capabilities | `crm.incidentes.ver`, `crm.mesaEntradas.ver`, `crm.bandejaSupervision.ver`, `crm.reportes.ver` |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Libro de mesa de entradas   Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Fecha ▼] [Tipo documental ▼]                                              |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Número     Fecha      Hora de re Tipo docum Remitente  Asunto     [...]    |
| -----------------------------------------------------------------------    |
| ········   dd-mm-yyyy ········   ········   ········   ········    ...     |
| ········   dd-mm-yyyy ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1803, M09:1804, M09:1805, M09:1829, M09:1830): Filtros: Fecha, Tipo documental; Columnas: Número, Fecha, Hora de recepción, Tipo documental, Remitente, Asunto, Área actual, Plazo; Acciones: Registrar entrada, Pase, Acuse, Registrar salida, Imprimir libro, Confirmar, Descartar, Crear, Vincular casos, Enviar aviso.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-07 | Listado y mapa de incidentes | PT-05 | `/admin/crm/incidentes` | Listado y mapa de incidentes. Vista lista + mapa (M10 GIS) con zonas afectadas; filtros servicio, estado, clase… |
| PAN-CRM-08 | Detalle de incidente | PT-02 | `/admin/crm/incidentes/:id` | Usa PT-02 Ficha o detalle con pestañas. Detalle de incidente. Alcance (mapa), afectados (paginado), casos vinculados, OT de M10, participantes, comunicaciones… |
| PAN-CRM-09 | Libro de mesa de entradas | PT-05 | `/admin/crm/mesa-entradas` | Columnas: número, fecha, hora de recepción, tipo documental, remitente, asunto, área actual, plazo, estado |
| PAN-CRM-33 | Informes de atención | PT-05 | `/admin/crm/tablero` | Tablero operativo. KPIs en tiempo real: abiertos por estado, SLA en riesgo y vencidos, carga por área/responsable… |
| PAN-CRM-34 | Sala BI de atención y reclamos | PT-05 | `/admin/bi/salas/reclamos` | Sala BI de atención y reclamos. Patrón CNX §4.5: KPIs certificados (§15), contexto y IA sobre los datos |

### FAM-CRM-04 Configuración de atención

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-11 Tipos y subtipos de gestión (M09:1807) |
| Portales | admin |
| Rutas | `/admin/crm/config/tipos`, `/admin/crm/config/estados`, `/admin/crm/config/areas`, `/admin/crm/config/sla` y 1 más |
| Capabilities | `crm.config.tipos.configurar`, `crm.config.estados.configurar`, `crm.config.areas.configurar`, `crm.config.sla.configurar` y 1 más |
| Olas | O2 |

```text
+----------------------------------------------------------------------------+
| Tipos y subtipos de gestión                                      (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                    [Publicar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Conjuntos de esta… | | Tipos [______________]                        | |
| | > Áreas, miembros, … | | Subtipos de gestión [______________]          | |
| | > Políticas SLA      | | Árbol tipo → subtipo [______________]         | |
| | > Reglas de derivac… | | Formulario por tipo [______________]          | |
| |                      | | Subtipo [______________]                      | |
| |                      | | Conjuntos de estados [______________]         | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1807, M09:1808, M09:1809, M09:1810, M09:1811): Pestañas: Conjuntos de estados y transiciones, Áreas, miembros, guardias, Políticas SLA, Reglas de derivación y notificación; Campos: Tipos, Subtipos de gestión, Árbol tipo → subtipo, Formulario por tipo, Subtipo, Conjuntos de estados, Transiciones, Lista de conjuntos; Pasos: Árbol tipo, Subtipo. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-11 | Tipos y subtipos de gestión | PT-09 | `/admin/crm/config/tipos` | Pasos: Árbol tipo, subtipo |
| PAN-CRM-12 | Conjuntos de estados y transiciones | PT-03 | `/admin/crm/config/estados` | Usa PT-03 Formulario o editor. Conjuntos de estados y transiciones. Lista de conjuntos; editor de estados (orden por arrastre, estado base, banderas… |
| PAN-CRM-13 | Áreas, miembros, guardias | PT-01 | `/admin/crm/config/areas` | Usa PT-01 Listado con filtros. Áreas, miembros, guardias. Roles del área (casos, turnero, actividades, mesa de entradas), miembros con rol… |
| PAN-CRM-14 | Políticas SLA | PT-09 | `/admin/crm/config/sla` | Políticas SLA. Alcance, objetivos, modo hábil/corrido, pausas, umbral, escalamiento; simulador ("si entra hoy 18:00… |
| PAN-CRM-15 | Reglas de derivación y notificación | PT-09 | `/admin/crm/config/reglas` | Reglas de derivación y notificación. Lista ordenada; condiciones (servicio, tipo, operación, zona, canal, días… |

### FAM-CRM-05 Canales, bot e IA

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-16 Canales (M09:1812) |
| Portales | admin |
| Rutas | `/admin/crm/config/canales`, `/admin/crm/config/bot`, `/admin/crm/config/ia`, `/admin/crm/auditoria-ia` y 1 más |
| Capabilities | `crm.canales.configurar`, `crm.bot.configurar`, `crm.ia.configurar`, `crm.ia.auditar` y 1 más |
| Olas | O2 a O11 |

```text
+----------------------------------------------------------------------------+
| Canales                     Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Estado ▼]                                                                 |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Tarjetas p Horario    Validación Bot asigna Estado     Intencione [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   [Activo]   ········    ...     |
| ········   ········   ········   ········   [Pendiente ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1812, M09:1813, M09:1814, M09:1815, M09:1816): Filtros: Estado; Columnas: Tarjetas por canal, Horario, Validación de celular/email, Bot asignado, Estado, Intenciones; Campos: Tarjetas por canal, Horario, Validación de celular/email, Bot asignado, Estado, Intenciones, Textos por diccionario, FAQ. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-16 | Canales | PT-05 | `/admin/crm/config/canales` | Canales. Tarjetas por canal (WhatsApp, email, SMS, teléfono/CTI, IVR, chat web, Facebook, Instagram, presencial, mesa… |
| PAN-CRM-17 | Bot de autogestión | PT-01 | `/admin/crm/config/bot` | Usa PT-01 Listado con filtros. Bot de autogestión. Intenciones (habilitar, verificación, ejemplos), textos por diccionario, FAQ, traspaso, versión… |
| PAN-CRM-18 | IA supervisada | PT-05 | `/admin/crm/config/ia` | IA supervisada. Funciones habilitadas, umbrales de confianza, tipos sensibles excluidos, proveedor (conexión T06)… |
| PAN-CRM-19 | Auditoría de IA | PT-05 | `/admin/crm/auditoria-ia` | Auditoría de IA. Lista de sugerencias con función, caso, modelo, versión, confianza, decisión, usuario, diferencias… |
| PAN-CRM-20 | Respuestas rápidas | PT-01 | `/admin/crm/config/respuestas-rapidas` | Usa PT-01 Listado con filtros. Respuestas rápidas. ABM con variables, canales, tipos; vista previa |

### FAM-CRM-06 Turnero

| Dato | Valor |
|---|---|
| Patrón base | PT-12 Pantalla completa de operación (POS, tótem, turnero) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-24 Consola de box (M09:1820) |
| Portales | admin, empleado, landing |
| Rutas | `/admin/crm/turnero/recepcion`, `/admin/crm/turnero/box`, `/pantalla/:displayId`, `/totem/:branchId` y 2 más |
| Capabilities | `crm.turnero.emitir`, `crm.turnero.llamar`, `crm.turnero.pantalla.ver`, `crm.turnero.configurar` y 1 más |
| Olas | O5 a O10 |

```text
+----------------------------------------------------------------------------+
| Consola de box  (pantalla completa)               dd-mm-yyyy hh:mm [Salir] |
+----------------------------------------------------------------------------+
| +--------------------+  +--------------------+  +--------------------+     |
| |RECEPCIÓN Y EMISIÓN…|  |   CONSOLA DE BOX   |  |PANTALLA PÚBLICA DE…|     |
| +--------------------+  +--------------------+  +--------------------+     |
| +--------------------+  +--------------------+  +--------------------+     |
| |TÓTEM DE AUTOSERVIC…|  |ADMINISTRACIÓN DEL …|  |ESTADÍSTICAS DEL TU…|     |
| +--------------------+  +--------------------+  +--------------------+     |
+----------------------------------------------------------------------------+
| Número / total: ######                             [Cancelar] [Confirmar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1819, M09:1820, M09:1821, M09:1822, M09:1823, M09:1824): Campos: Abrir/cerrar box, Áreas atendidas, Botón "Llamar siguiente", Rellamar, Ausente, Recepción, Emisión de turnos, Buscar persona. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-23 | Recepción y emisión de turnos | PT-03 | `/admin/crm/turnero/recepcion` | Usa PT-03 Formulario o editor. Recepción y emisión de turnos. Buscar persona (opcional), área (botones grandes con imagen), prioridad y motivo… |
| PAN-CRM-24 | Consola de box | PT-12 | `/admin/crm/turnero/box` | Consola de box. Abrir/cerrar box, áreas atendidas, botón "Llamar siguiente", rellamar, ausente, atender, derivar… |
| PAN-CRM-25 | Pantalla pública de turnos | PT-10 | `/pantalla/:displayId` | Usa PT-10 Página pública (landing). Pantalla pública de turnos. Pantalla completa con últimos 5 llamados (por turno o por box), modo de destacado, voz… |
| PAN-CRM-26 | Tótem de autoservicio | PT-12 | `/totem/:branchId` | Tótem de autoservicio. Elegir área, documento opcional, prioridad declarada, emitir e imprimir vía agente o mostrar QR |
| PAN-CRM-27 | Administración del turnero | PT-01 | `/admin/crm/turnero/config` | Usa PT-01 Listado con filtros. Administración del turnero. Boxes y tipos, pantallas (modo, agrupación, voz, nombre visible), tótems, agente local… |
| PAN-CRM-28 | Estadísticas del turnero | PT-05 | `/admin/crm/turnero/estadisticas` | Usa PT-05 Tablero, reporte o mapa. Estadísticas del turnero. Filtros sucursal, área, período; agrupación (día de semana y hora; mes, día y hora; turno)… |

### FAM-CRM-07 Actividades y agenda comercial

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-22 Proyectos, horas y bolsas (M09:1818) |
| Portales | admin, empleado |
| Rutas | `/admin/crm/proyectos`, `/admin/crm/actividades`, `/admin/crm/config/actividades`, `/admin/crm/calendario` y 1 más |
| Capabilities | `crm.horas.ver`, `crm.actividades.ver`, `crm.actividades.configurar`, `crm.circulares.ver` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > CRM > Proyectos, horas y bolsas       [Abrir] [Exportar] [Nuevo*] |
| Proyectos, horas y bolsas                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Proyectos Horas     Bolsas    Proyectos Casos     Responsab [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1818, M09:1825, M09:1826, M09:1827, M09:1828): Columnas: Proyectos, Horas, Bolsas, Proyectos con componentes, Casos, Responsables por cuenta; Pestañas: Áreas, Tipos, Frecuencias, Rubros, Actividades; Campos: Proyectos, Horas, Bolsas, Proyectos con componentes, Casos, Responsables por cuenta. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-22 | Proyectos, horas y bolsas | PT-01 | `/admin/crm/proyectos` | Proyectos, horas y bolsas. Proyectos con componentes y casos; registro de tiempo por caso/usuario; bolsas de horas por… |
| PAN-CRM-29 | Seguimiento de actividades | PT-01 | `/admin/crm/actividades` | Seguimiento de actividades. Vista agenda/lista con estados (pendiente, próxima a vencer, vencida, cerradas en… |
| PAN-CRM-30 | Configuración de actividades | PT-09 | `/admin/crm/config/actividades` | Usa PT-09 Configuración versionada. Pestañas: Áreas, Tipos, Frecuencias, Rubros, Actividades |
| PAN-CRM-31 | Calendario interno | PT-09 | `/admin/crm/calendario` | Usa PT-09 Configuración versionada. Calendario interno. Vistas día/semana/mes; eventos por tipo con color; recurrencias; recordatorios; ocurrencias de… |
| PAN-CRM-32 | Circulares | PT-01 | `/admin/crm/circulares` | Circulares. Modelos (ABM con preview), corridas (universo con motor de audiencia T09, conteo, aprobación, generación… |

### FAM-CRM-08 Atención desde la PWA del empleado

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CRM-35 Casos asignados (M09:1831) |
| Portales | empleado |
| Rutas | `/app/casos`, `/app/actividades` |
| Capabilities | `crm.casos.ver`, `crm.actividades.ver` |
| Olas | O2 |

```text
+------------------------------------------------------------+
| < Casos asignados                                      (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Mis casos: ········                                    | |
| | Cards con número: ········                             | |
| | Prioridad: ········                                    | |
| | Socio: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Mis casos: ········                                    | |
| | Cards con número: ········                             | |
| | Prioridad: ········                                    | |
| | Socio: ········                                        | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                     Ver detalle                     * ]  |
+------------------------------------------------------------+
| Inicio | Recibos | (+) | Solicitudes | Perfil              |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M09:1831, M09:1832): Campos: Mis casos, Cards con número, Prioridad, Socio, Servicio, Vencimiento. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CRM-35 | Casos asignados | PT-07 | `/app/casos` | Mis casos (móvil). Cards con número, prioridad, socio, servicio, vencimiento; detalle con timeline y respuesta… |
| PAN-CRM-36 | Mis actividades | PT-07 | `/app/actividades` | Mis actividades (móvil). Cards por ocurrencia con estado; cerrar con foto de evidencia |
