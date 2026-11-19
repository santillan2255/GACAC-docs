# Relevamiento funcional de Procoop (base DEMO)

Relevamiento hecho navegando Procoop **en modo solo lectura** por Escritorio Remoto de Chrome (PC `demo_pc`), el 3/11/2026.

- **Versión:** Procoop 10.4.6.722, fecha de versión 03/08/2026.
- **Instalación:** "Cooperativa eléctrica Laguna Larga Ltda." sobre la base DEMO.
- **Sesión:** usuario `COOPERATIVA`, alias `COOPONLINE`, punto de venta 0097.

No se grabó, autorizó ni procesó nada: todas las ventanas se cerraron con Cancelar o Salir.

> **Atención con datos personales:** la base DEMO contiene nombres, CUIT, domicilios y deudas que parecen reales. Las capturas en `capturas/` **no deben subirse al repositorio ni compartirse fuera del equipo** sin anonimizarlas primero (ver la regla de los docs: los entornos de test nunca usan datos personales reales).

## 1. Estructura general de la aplicación

La aplicación es WinForms (DevExpress) con una cinta (ribbon) de 9 pestañas, una por módulo. Cada pestaña agrupa sus funciones en grupos.

Al iniciar sesión aparece una alerta, "Hay facturas electrónicas pendientes de autorizar!". Desde ahí se abre la grilla "Comprobantes Pendientes de Autorizar", con las columnas NumeroCompleto, Fecha, Cliente, Documento y Procesando, y los botones Exportar, Imprimir y Salir. Captura: [00](capturas/00-comprobantes-pendientes-autorizar.png).

| Pestaña | Grupos y funciones | Captura |
|---|---|---|
| Servicios a Titulares | **Titulares:** Administración de Titulares, Administración de Personas, Consultas e Informes. **Consumos:** Registro de Lectura, Telemed, Opciones de consumos, Opciones de Telefonía, Informes de Consumos. **Ventas y Facturación:** Presupuestos, Venta de Productos, Facturación, Informes de Ventas y Facturación, Libro IVA Ventas, Movimiento de Conceptos. **Cobranza:** Apertura de Caja, Cobranza Local, Opciones de Cobranza, Informes de Cobranzas. **Configuración.** | [01](capturas/01-menu-servicios-titulares.png) |
| Crédito y Gestión de Mora | **Financiaciones:** Emitir Plan de Financiación, Informes. **Gestión de Mora:** Generar Notificaciones (1ª instancia), Tratamiento de Notificaciones Generadas, Tratamiento de Morosos, Notificaciones, Causas de Baja, Instancias de Mora, Excepciones de Mora, Informes. | [02](capturas/02-menu-credito-mora.png) |
| Operaciones | **Técnica:** Factibilidades, Órdenes, Carga Rápida de Reclamos, Informes. **Telemed:** Administración, Informes, Configuración. **Planes de Vivienda:** Materiales, Construcción, Informes. | [03](capturas/03-menu-operaciones.png) |
| Compras y Stock | **Gestión de Compras:** Solicitudes de Aprovisionamiento, Solicitudes de Cotización, Órdenes de Compra, Remitos, Comprobantes de Proveedores, Pago a Proveedores, Retenciones. **Stock:** Movimientos, Trazabilidad, Operaciones Especiales, Bienes de Uso, Fabricación. **RMA.** **Informes:** Compras, Stock, Libro IVA Compras, Correspondencia. | [04](capturas/04-menu-compras-stock.png) |
| Tesorería | **Bancos:** Movimientos Bancarios, Cuentas Propias. **Tesorería:** Movimientos, Valores de Terceros, Cheques Propios, Cupones de Tarjetas, Retenciones Recibidas, Cajas para Pagos a Proveedores, Cierre de Cajas. **Informes.** | [05](capturas/05-menu-tesoreria.png) |
| Sueldos | **Administración:** Empleados, Empresas, Recibos. **Procesos:** Liquidación Masiva, Simulador, Impuesto a las Ganancias. **Configuración:** Variables, Conceptos, Aplicar Aumentos. **Informes:** Informes de Sueldos, Libro sueldo digital (deshabilitado). | [06](capturas/06-menu-sueldos.png) |
| Contabilidad | **Movimientos:** Asientos, Consultar Mayor, Balance General / Sumas y Saldos. **Otras operaciones:** Asientos Automáticos, Herramientas. **Informes:** Contables, de Gestión. | [07](capturas/07-menu-contabilidad.png) |
| Herramientas | Actividades (Seguimiento, Informe), SMS, Tablero de Control, Traslados (Viajes, Informes), Turnero (Box, Turnero, Selección de Turnos, Estadísticas), Mesa de Entradas (Administración, Incidentes, Informes). | [08](capturas/08-menu-herramientas.png) |
| Configuración | **General:** Usuarios, Perfiles, Auditoría de Logueo, Copia de Seguridad, Base de Datos (deshabilitado), Actualizar. **Tablas y Parámetros:** Tablas del sistema, Parámetros del Sistema, Parámetros Externos, Autorización de Operaciones. **Procoop WEB:** Requisitos y Trámites, Archivos en la Web, Operaciones. **Reportes:** Editor de Reportes, Informes Personalizados, Procesos Personalizados. | [09](capturas/09-menu-configuracion.png) |

## 2. Titulares, cuentas y servicios (modelo de datos visible)

### Administración de Titulares

Captura: [10](capturas/10-administracion-titulares.png) y [11](capturas/11-titulares-listado.png).

- **Filtros de búsqueda:** Persona, Calle, Documento, Titular, rango Entre/y, Cuenta, "Consultar Domicilio de Servicios" y "Solo cuentas con servicios activos". Para buscar hay que ingresar al menos un valor.
- **Acciones:** Agregar, Modificar, Baja, Consultar, Imprimir y Operación.
- **Columnas de la grilla:** Titular Nº, Nombre, Documento, NIP, Activo.

### Ficha del titular

Captura: [12](capturas/12-titular-ficha.png) y [13](capturas/13-titular-cuenta-servicios.png). Se abre en modo "Sólo LECTURA" y tiene tres pestañas:

- **Datos Persona:** datos de la persona física o jurídica.
- **Titular:** datos del titular.
- **Cuentas y Servicios:** la jerarquía de cuentas y servicios del titular.

La jerarquía que se ve en la pestaña Cuentas y Servicios es:

```
Persona ──► Titular (N° titular, NIP)
              └── Cuenta (N°, domicilio, condición IVA: CONSUMIDOR FINAL / EXENTO…)
                    └── Grupo Factura (G.F.)
                          └── Servicio (tipo + id medidor + estado + categoría)
                                ej. ENERGIA ELECTRICA – 5884320 – conectado – ALUMBRADO PUBLICO
                                ej. GAS NATURAL – 9583371 – baja – SGP 1
```

El panel derecho muestra los Trámites de la Cuenta, las Observaciones (Fecha, Título y Bloqueo) y las observaciones propias del servicio. Desde la ficha se puede acceder a Adjuntos, WhatsApp y email.

**Implicancia para GoodApps:** una cooperativa es **multiservicio**: energía, gas, telefonía, agua y tasas pueden convivir en la misma cuenta. El "Grupo Factura" define qué servicios salen juntos en un mismo comprobante. Las observaciones tienen un flag de **bloqueo**, que probablemente impide operar sobre la cuenta.

### Administración de Servicios (servicio de energía)

Captura: [14](capturas/14-cuenta-servicio-energia.png) y [15](capturas/15-servicio-energia-detalle.png).

| Bloque | Campos |
|---|---|
| Cabecera | ID Servicio, Servicio (1 ENERGÍA ELÉCTRICA), Clase (ej. 4 TASA HOSPITAL MUNICIPAL) |
| Ubicación | Domicilio, Referencia, Catastro (Cod/Sec/Man/Par/PH/Lote), DD JJ, Contrato, Inmueble, GIS |
| Servicio | Categoría tarifaria (ej. 19 ALUMBRADO PÚBLICO), Actividad, Observaciones, Garante, Grupo Factura, fechas de Alta/Baja |
| Generalidades | Estado (CONECTADO) y fecha del último estado |
| Medidor | Modelo (Galileo), Id medidor, Obs., Unidades bonificadas, Dígitos, Factor de multiplicación, HP, Testigo, Tipo (MONOFÁSICO) |
| Flags | Lectura con factor de multiplicación, No aplica recategorización, Alta desde CoopOnline, No Facturar, Provisorio / Cobrar provisorio |
| Otros | Profesional (instalador), Certificado Nro/Vto, Id Cliente, Fecha Vto |
| Demanda | Demanda Pico / Fuera de Pico (para tarifas con potencia contratada) |
| Lectura | Zona, Sector, Recorrido (definen la ruta del lecturista) |
| Varios | Última facturación (período), Id Factibilidad, Matrícula, Latitud/Longitud |

## 3. Consumos: Registro manual de Lecturas

Captura: [19](capturas/19-registro-lectura.png).

- **Encabezado:** Fecha, Período (mes + año), Servicio, Titular, Cuenta, Observación, check "Consumo Estimado" y botón "Consulta de consumos".
- **Grilla de carga:** Servicio, Fecha Anterior, Lectura Anterior, Consumo Anterior, Lectura Actual, Consumo Actual, Tipo de Energía, Concepto. El botón **"Correcto"** confirma la lectura.
- **Datos adicionales del servicio:** Categoría, Característica, Nº Medidor, Dígitos, Domicilio, Factor Multiplicación, Cos. Fi (factor de potencia) e Indicado.
- **Grilla de consumos anteriores:** Categoría, Medidor, Fecha y Lectura anterior, Fecha y Lectura actual, Días, Consumo, Período, Factura.

La carga masiva de lecturas entra por **Telemed**: medición remota o lectores portátiles.

## 4. Facturación: Administración de Comprobantes

### Listado

Captura: [16](capturas/16-facturacion.png) y [17](capturas/17-comprobantes-listado.png).

- **Navegación:** el panel izquierdo agrupa los comprobantes por **rangos semanales de Fecha de Emisión**. El criterio de agrupación se puede cambiar.
- **Búsqueda:** caja de texto libre con los botones Buscar y Vaciar.
- **Grilla:** Fecha, Comprobante (tipo + punto de venta + número, ej. `Spb 0022-00128032`), Cuenta, Titular, Nombre, Total y Anulada, más una fila de totales.
- **Acciones:** Agregar, Consultar, Elemento, Operaciones, Imprimir, Vista y Filtros.
- **Volumen observado:** en la semana 06/08–11/08/2026 hay **12.499 comprobantes** por **$629.206.692,60**, que corresponden a una facturación masiva mensual. Se ven al menos los puntos de venta 0022 y 0028, y los prefijos `Spa` y `Spb`.

### Detalle de un comprobante ("Registro de Facturas Manuales")

Captura: [18](capturas/18-comprobante-detalle.png).

- **Cabecera:** Comprobante (ej. "97 - LIQ. DE SERV. B", PV 0022, Nº 00128032, letra DB), Fecha, Cuenta + domicilio, Titular, Vendedor, Cuota (ej. PR = PREPAGO), Depósito, Período (8 – Agosto 2026), **Deuda Vencida** del titular (en rojo) y check "Registrar Pago".
- **Renglones:** Descripción, Cantidad, Precio Unitario, Impuestos, IVA y Neto. Por ejemplo:
  - ENERGÍA ELÉCTRICA: 18,30 kWh × $270,33.
  - Tasas de terceros: Tasa Alumbrado Público, Tasa R. Decreto 2298/00 0,40 %, Tasa RG 27/2015, entre otras.
- **Totales:** Sub Neto, Descuento %, Neto, Percepciones, IVA, Otros Impuestos y TOTAL. En el ejemplo: Neto $5.441,68, IVA $1.038,88, otros impuestos $519,44 y total $7.000,00.
- **Importes y vencimientos:** hasta **4 vencimientos**, cada uno con su fecha y su total con recargo (ej. $7.000,00 y luego $7.001,51 en los siguientes).
- **Opción adicional:** "Replicar Comprobante".

**Implicancias para GoodApps:**

- La factura combina el **cargo propio** (energía) con **tasas e impuestos de terceros**: municipales, provinciales y fondos. Cada uno tiene su propia base y alícuota.
- Existe la modalidad **prepaga** de energía.
- El esquema de 4 vencimientos con recargo por interés es parte del modelo del comprobante.

## 5. Tablas del sistema (parametrización)

Captura: [20](capturas/20-tablas-sistema-menu.png).

En Configuración, "Tablas del sistema" se organiza en submenús por dominio: Generales, Titulares, Cobranzas, Técnica, Facturación, Gestión de Mora, Telefonía, Viviendas, Sueldos, Tesorería, Contabilidad, Compras, SMS, Actividades y Herramientas.

### Tablas relacionadas a Facturación

Captura: [21](capturas/21-tablas-facturacion.png). Es el núcleo del motor de facturación:

- **Comerciales:** Vendedores, Condiciones de Venta para Presupuestos, Tramas de vencimientos de Facturas, Órdenes de impresión en Facturas.
- **Fiscales y tarifarias:** Impuestos, Conjuntos de Facturación, Clases de Servicios, Actividades ARCA, Conceptos para Cálculo de Intereses, Grupos de Categorías.
- **Catálogo:** Servicios para Facturar, Productos.
- **Operativas:** Altas y Bajas Automáticas de Servicios, Conceptos por Cobrar en Operaciones con Titulares, Tipos de Comprobantes, Planes de Cuotas, Cargos Adicionales, **Administración de Cuadros Tarifarios**, Causas de Bloqueo de Comprobantes.
- **Fiscal electrónico:** Códigos de Autorización ARCA (CAEA, CESP), Código de Validación Provincial (CVP).
- **Especiales:** Configuración de Prepaga, Configurar Facturación Masiva, Opciones de Gas, Grupos de Facturación, Grupos de impresión de gráfico en facturas, Configuración de Conceptos para informe ENACOM, Rendiciones de Viajes, Conceptos a incluir en Facturación a titulares.

### Cuadros Tarifarios

Captura: [22](capturas/22-cuadros-tarifarios.png) y [23](capturas/23-cuadro-tarifario-datos.png).

- **Listado:** Descripción, Código, Usuario, Vigencia Desde y Hasta. Acciones: Imprimir, Nuevo, Modificar y Salir.
- **Versionado:** los cuadros se versionan **por vigencia** y se nombran por mes o por norma. Ejemplos: "ABRIL 2026", "196/2023 GAS", "ANTES CAMBIO FODEP 10%", "ANTES DE RG 129 MARZO", "ANTES DEL NUEVO DECRETO…". Es decir, cada resolución del ente regulador genera un cuadro nuevo y el anterior queda cerrado por fecha.
- **Detalle:** la pestaña "Datos" con los precios por categoría solo se habilita en modo "Modificar". **No se abrió**, para no arriesgar cambios. Ese detalle conviene obtenerlo de la base `PR_LAG_DEMO` o de las DLL decompiladas.

## 6. Cobranzas y Gestión de Mora (parametrización)

### Tablas relacionadas a Cobranzas

Captura: [24](capturas/24-tablas-cobranzas.png).

- **Entes y terceros:** Administración de Entes Recaudadores, Administración de Empresas Tercerizadas.
- **Mora:** Administración de Tasas de Mora, Tablas de Índices para Recargo por Mora.
- **Intercambio de archivos:** Generar Archivo para Entidad Recaudadora, Importar Archivo de Débitos Automáticos, Exportar archivos de débitos automáticos, Importar Archivo de Morosidad, Importar Archivo de Novedades.
- **Caja:** Administración de Descuentos en Caja.

En la base DEMO hay tres **entes recaudadores** configurados (captura [25](capturas/25-entes-recaudadores.png)): DOCUMENTOS A COBRAR, **RED LINK** y **SIRO**.

**Implicancia para GoodApps:** la cobranza externa funciona por **intercambio de archivos batch** con cada ente: se genera un archivo de deuda y después se importa la rendición. Lo mismo vale para débitos automáticos y novedades. Son integraciones críticas para el paralelo.

### Tablas relacionadas a Gestión de Mora

Captura: [26](capturas/26-tablas-mora.png).

- **Tablas:** Causas de Baja, Instancias de Mora, Excepciones de Mora.
- **Procesos:** Generar Notificaciones, Tratamiento de Notificaciones, Tratamiento de Morosos, Operaciones Especiales.

Las **instancias** configuradas (captura [27](capturas/27-instancias-mora.png)) son tres: 1 CANDIDATOS, 2 PRIMER INSTANCIA DE MORA y 3 SEGUNDA INSTANCIA DE MORA. El flujo sería: un titular es candidato, recibe la notificación de 1ª instancia, luego la de 2ª y finalmente se trata como moroso (corte o baja, con su causa). Las excepciones de mora excluyen cuentas del proceso.

## 7. Binarios

Los binarios de producción están en la PC demo, en `C:\Procoop\Sistema\SISTEMA_PRD\`. Todas las DLL propias tienen fecha 3/8/2026 15:23, igual que la versión 10.4.6.722. Algunas de las que se vieron:

| DLL | Tamaño |
|---|---|
| `CapaDatos.dll` | 3,69 MB |
| `Configuracion.dll` | 3,75 MB |
| `AVL.dll` | 41 KB |
| `AxInterop.WMPLib.dll` | 52 KB |
| `Interop.WMPLib.dll` | 323 KB |
| `netstandard.dll` | 96 KB |
| `Recursos\Tareas.dll` | 354 bytes |

También hay subcarpetas como `Reportes`, `Reportes_Empresa`, `Segmentacion`, `Sincronizaciones`, `tarifasocial`, `ENARGAS`, `Debitos`, `MailTemplates` y `CefSharp`.

Se descargó **`CapaDatos.dll`** a [`binarios/CapaDatos.dll`](binarios/CapaDatos.dll) y se generó su inventario de metadatos en [`binarios/CapaDatos-inventario.md`](binarios/CapaDatos-inventario.md).

Lo que muestra `CapaDatos.dll`:

- **Es el modelo de datos LINQ-to-SQL** de Procoop: 856 tipos, 32.143 métodos y 13.683 campos. Cada clase del namespace `CapaDatos` es una tabla de la base, con sus relaciones (`attach_*` / `detach_*`). Es un mapa casi completo del esquema de `PR_LAG_DEMO`.
- **Tablas clave encontradas:**
  - Comprobantes: `FACTURAS` (relacionada con `ITEMSFAC`, `DEUDAVTA`, `IT_RECCO`, `IT_PAGSO`, `FACTURAS_TERCEROS`, `TALONFAC`, `PAGOS360_ITEMS`…).
  - Servicios: `SERVICIO` (con `CATE_SER`, `MORATAS`, `CARGOS_ADICIONALES`, `IMPUESTOS_X_CAT`, `FACTOR_CAL`, `RECLAMOS`, `FACTIBIL`…).
  - Tarifas versionadas: `CUADROS`, con históricos por cuadro (`HIS_CATTARIF`, `HIS_IMPUESTO`, `HIS_CARGOS_ADICIONALES`, `HIS_SERVICIO`, `HIS_PROD_SER`, `HIS_TAR_ADHE`).
  - Mora: `TABMORA` / `INDICESMORA`, `EXC_MORA`.
  - Fiscal: `ACTAFIP`, `CESPAFIP`, `EMPAFIP`.
  - Agrupación de servicios: `GRUPOS_FACTURA`.
- **Otros namespaces:** `CapaDatos.PMovil` (app móvil), `CapaDatos.PWeb` (portal web / CoopOnline) y `CapaDatos.Telemed`.
- **Motores de datos referenciados:** SQL Server (LINQ to SQL y Entity Framework), MySQL, SQLite y DBF (`NDbfReader`).

### 7.1 Binarios propios descargados

En la PC remota se comprimieron los 70 binarios propios de `SISTEMA_PRD` (sin DevExpress, System.*, Microsoft.*, CefSharp, etc.) y se bajaron por Escritorio Remoto a `binarios/SISTEMA_PRD/` (zip de 29,4 MB). Los inventarios de metadatos están en [`binarios/inventarios/`](binarios/inventarios/).

| Binario | Tipos | Métodos | SQL embebido | Rol |
|---|---|---|---|---|
| `ProcoopNet.exe` | 57 | 644 | 3 | Ejecutable principal (shell WinForms) |
| `ReglasNegocio.dll` | 13.108 | 89.737 | 597 | **Lógica de negocio** de todos los módulos |
| `Configuracion.dll` | 643 | 6.654 | 23 | Parametrización y configuración |
| `ProMod_Titulares.dll` | 307 | 2.918 | 0 | UI de titulares, cuentas y servicios |
| `ProMod_Facturacion.dll` | 276 | 2.542 | 0 | UI de facturación |
| `ProMod_Cobranzas.dll` | 261 | 2.643 | 0 | UI de cobranzas |
| `ProMod_Tecnica.dll` | 142 | 1.429 | 0 | UI de técnica y reclamos |
| `ProMod_Consumos.dll` | 102 | 848 | 0 | UI de lecturas y consumos |
| `ProMod_Tesoreria.dll` | 65 | 691 | 0 | UI de tesorería |
| `ProMod_GestionMora.dll` | 41 | 474 | 0 | UI de gestión de mora |
| `ProMod_Contabilidad.dll` | 37 | 306 | 0 | UI de contabilidad |
| `AutoGestion.exe` | 71 | 597 | 0 | Autogestión |

Los `ProMod_*` son solo pantallas; la lógica está en **`ReglasNegocio.dll`**. Namespaces y clases relevantes para GoodApps:

- `ReglasNegocio.Facturacion`:
  - `clsFacturacionMasiva`: proceso mensual (`GenerarFacturacion`, `SimularFacturasConCuadros`, `ValidarCESP`).
  - `clsFacturacionServicio`: cálculo de la factura por servicio (`FacturarConsumos_MedidoPorTramas`, `AgregarCuadroTarifario`, `AgregarItemCargoFijo`, `AgregarItemFactorPotencia`, `GC_FacturarDemanda`, `AddCargosAdicionales`, `AgregarRedondeo`, `FacturacionAlumbrado`/`Cloaca`/`Pavimento`).
  - `clsFacturacionElectronica`: AFIP (`AutorizaFacturas`, `AutorizaFacturasCAEA`, `ConsultarCAE`).
  - Otras: `clsAnulacionFacturas`, `clsFacturarIntereses`, `clsRecategorizacion`, `clsRetroactivos`, `clsFacturasImpresion` (código de barras, Pagos360) y `clsEnargas` (archivos para ENARGAS).
- `ReglasNegocio.Facturacion.CodigoBarra.Clientes`: 91 formatos de código de barras, uno por cooperativa.
- `ReglasNegocio.Cobranzas.Entidades.*`: un namespace por cooperativa cliente (`LAG` es Laguna Larga), con las interfaces de cobranza propias de cada una.
- `ReglasNegocio.WSAA`, `WSFEV1`, `WSPA13`, `WSPN3`: clientes de los web services de AFIP.
- También: `Titulares`, `Tecnica`, `Telefonia`, `Tesoreria`, `Contabilidad`, `Sueldos`, `Stock`, `Varios.Telemed`, `Varios.GIS` y `Varios.CoopOnline`.

Hay copias `_old_20260804_071937_*` de la versión anterior de varios binarios, que sirven para comparar entre versiones.

### 7.2 Código descompilado

Con el .NET SDK 8 e `ilspycmd` 8.2 se descompilaron a proyectos C# en `binarios/decompilado/`:

| Proyecto | Archivos `.cs` |
|---|---|
| `ReglasNegocio` | 1.339 |
| `Configuracion` | 312 |
| `ProcoopNet` | 17 |

Puntos de entrada recomendados para entender la lógica:

- `ReglasNegocio.Facturacion/clsFacturacionServicio.cs` (4.151 líneas). Ejemplo: `FacturarTramas` reparte el consumo entre los tramos (`CATTARIF.CON_MIN`/`CON_MAX`) ajustados por días proporcionales y prorrateo entre cuadros tarifarios.
- `ReglasNegocio.Facturacion/clsFacturacionMasiva.cs`: el proceso mensual.
- `ReglasNegocio.Facturacion/clsFacturacionElectronica.cs`: AFIP.
- `ReglasNegocio.Facturacion/clsFacturarIntereses.cs`: intereses por mora.
- `ReglasNegocio.Cobranzas/clsGestionMora.cs` e `clsInformes_Mora.cs`.

Para volver a ejecutarlo: `$env:DOTNET_ROLL_FORWARD="Major"; ilspycmd -p -o <salida> -r binarios/SISTEMA_PRD <dll>`. `DOTNET_ROLL_FORWARD` hace falta porque esa versión de `ilspycmd` pide .NET 6 y solo está instalado el 8.

Los binarios y el código descompilado son de terceros. Sirven solo para el análisis y están excluidos de git por `.gitignore`.

### 7.3 Reglas de negocio extraídas del código

Las reglas que salen del código descompilado están documentadas por dominio en [`reglas-negocio/`](reglas-negocio/00-indice.md). Son 10 documentos, cerca de 7.300 líneas en total, y cada regla cita el archivo:línea de origen.

## 8. Pendiente de relevar

- **Cobranza en operación:** Apertura de Caja y Cobranza Local. No se abrieron porque abrir una caja graba datos.
- **Detalle de tablas:** el contenido de Cuadros Tarifarios, Impuestos y Conjuntos de Facturación, idealmente vía SQL de solo lectura o las DLL.
- **Configurar Facturación Masiva y Telemed:** cómo se dispara el proceso mensual, sin ejecutarlo.
- **Contabilidad:** Asientos Automáticos, es decir, cómo impacta la facturación en la contabilidad.
- **Procoop WEB y CoopOnline:** la autogestión del socio.
