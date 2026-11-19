# 09 — Parámetros (`Busca_V2_*`), configuración, seguridad y arquitectura de ProcoopNet

> Relevamiento sobre los fuentes descompilados de Procoop 10 (`binarios/decompilado/ReglasNegocio`, `Configuracion`, `ProcoopNet`) y el modelo de datos `binarios/CapaDatos-tablas.md`.
> Las referencias `archivo:línea` son relativas a `binarios/decompilado/`. Abreviaturas usadas en el catálogo: `RN.` = `ReglasNegocio/ReglasNegocio.`, `Cfg` = `Configuracion/`, `PN` = `ProcoopNet/`.
> Por pedido expreso, **no se transcriben contraseñas ni claves**; solo se indica que existen y dónde.

Documentos relacionados: [00 — Índice](00-indice.md) · [03 — AFIP / facturación electrónica](03-afip-facturacion-electronica-e-iva.md) · [05 — Cobranzas y entes](05-cobranzas-cajas-y-entes-recaudadores.md) · [10 — Integraciones externas](10-integraciones-externas.md) · [`../integraciones-fichas.md`](../integraciones-fichas.md).

---

## 1. Resumen ejecutivo

- Procoop no tiene un "archivo de configuración de negocio": **casi todo el comportamiento parametrizable vive en una tabla clave/valor (`VARIABLE`) con códigos numéricos**, leída desde cualquier capa con `Nucleo.Busca_V2_<Tipo>(n)`.
- Relevamos **1.536 parámetros**: 1.527 declarados en el catálogo maestro (`CapaNucleo/clsVariables.cs`, `GetChequeoVariables`) más 9 que el código lee pero que el catálogo no declara (8 en `VARIABLE` y 1 en `VARIABLE_PMOVIL`). De ellos, **914 tienen lectura directa en el código descompilado** (2.610 llamadas con número literal y 39 con número calculado). Los 622 restantes no aparecen leídos por número literal en estos fuentes: los usan CoopOnline/PMovil/PWeb (aplicaciones externas que leen la misma tabla), el Agente, procedimientos almacenados, enums que se castean a código de variable, o están obsoletos.
- Los números no siguen ningún orden por módulo: el módulo se asigna con la columna `COD_MOD`. Los números más altos (≈3.180) indican el crecimiento acumulado; cada versión agrega variables nuevas mediante el chequeo de estructura.
- La configuración "técnica" (servidor SQL, credenciales, punto de venta del puesto, rutas, correo, FTP/S3, licencia) está en un archivo local `Configuracion*.pro` con ofuscación trivial, no en la base.
- La seguridad es débil para estándares actuales: contraseñas "encriptadas" con un desplazamiento de bytes reversible, contraseñas maestras en el código, autenticación SQL con un usuario compartido por todos los puestos, y licenciamiento verificado en el cliente.

---

## 2. Cómo se guardan los parámetros

### 2.1 Tablas

| Tabla | Rol |
|---|---|
| `VARIABLE` | Parámetro global de la cooperativa (una base de datos = una cooperativa). |
| `VARIABLE_PMOVIL` | Parámetros que consumen las apps externas; agrega `MOD_VAR` (1 = CoopOnline, 2 = PMovil/Captor, 3 = PWeb). |
| `MODULOS` | Módulo al que pertenece cada variable (`VARIABLE.COD_MOD`); es la misma tabla que arma el menú. |
| `VARIABLEPLANT` | Variables de combinación de plantillas de correspondencia (no son parámetros, son "campos de merge"). |

Columnas relevantes de `VARIABLE`: `COD_VAR` (número), `NOM_VAR` (descripción visible), `DES_VAR`, y **tres columnas de valor en paralelo**: `CARACTER` (texto), `NUMERICA` (decimal) y `LOGICA` (bit). `TIP_VAR` indica cuál se usa: `C` carácter, `N` numérico, `L` lógico, `E` entero, `F` fecha (guardada como texto), `P` "personalizada" (usa las tres columnas a la vez; por ejemplo, la variable −1 usa `LOGICA` para activar el envío de errores y `CARACTER` para el destinatario). `OBS_VAR` guarda una observación.

`TIP_CTRL` y `CONF_CTRL` definen el editor que se muestra al usuario:

- `TIP_CTRL = 1`: clave foránea a una tabla. `CONF_CTRL = "Tabla|CampoID|CampoDescripción|Where"`.
- `TIP_CTRL = 2`: lista cerrada de opciones. `CONF_CTRL = "descripción?valor|descripción?valor|..."` (equivale a un enum).
- `TIP_CTRL = 5`: ruta de archivo o carpeta.
- `TIP_CTRL = 6`: cuenta contable del plan de cuentas.

### 2.2 Lectura y escritura

- `Nucleo.BuscaVariable` (`ReglasNegocio/CapaNucleo/Nucleo.cs:4207`) mantiene una caché en memoria (`lstVariables`) por proceso. **Si la variable no existe, la inserta automáticamente** con `NOM_VAR = "Sin Utilizar"` y valores vacíos: un número mal tipeado crea basura en la tabla en lugar de fallar.
- Funciones tipadas: `Busca_V2_Caracter`, `Busca_V2_Fecha`, `Busca_V2_Decimal`, `Busca_V2_int`, `Busca_V2_Logica` (`Nucleo.cs:4092–4119`) y sus variantes `_PMovil` sobre `VARIABLE_PMOVIL` (`Nucleo.cs:4122–4145`). El enum `TipoDato_Busca_V2` (Caracter = 1 … Texto = 7) se usa para escribir.
- `Nucleo.Actu_V2` (`Nucleo.cs:4295` y sobrecarga en `4369`) actualiza el valor y **audita** con `RegistrarAuditodia(alias, "Modificar", "VARIABLE", cod)`.
- `Nucleo.Valida_V2` (`Nucleo.cs:4147`) verifica que una variable de tipo FK o lista esté configurada antes de usarla (muestra un aviso al usuario si falta).
- `Nucleo.GetSetBooleanProperty` (`Nucleo.cs:4391`) envuelve lectura/escritura de variables lógicas que se exponen como propiedades de UI (checks "recordar opción").
- Algunas variables se leen con LINQ directo (`Factory.VARIABLE.Where(x => x.COD_VAR == n)`), por ejemplo en `clsChequeos.FinalizarChequeos` (`CapaNucleo/clsChequeos.cs:51`).
- Hay códigos de variable "implícitos" en enums: `Usuario.TipoDeposito` (Stock = 161, Ventas = 164, Producción = 165, Componentes = 166) se pasa como número de variable en `Nucleo.GetDeposito` (`Nucleo.cs:867`) para obtener el depósito por defecto. Esto explica parte de las variables catalogadas "sin uso directo".

### 2.3 Alta y migración del catálogo

- El catálogo maestro es `CapaNucleo/clsVariables.cs`, método `GetChequeoVariables`. Cada parámetro se declara con un helper (`ChequearVariableGenerica`, `ChequearVariableConValores`, `ChequearVariableDeTabla`, `ChequearVariableDeCuenta`, `ChequearVariableDePath`; definidos en `clsVariables.cs:1725–1779`), que produce una sentencia `exec [ChequearVariable] ...` o `exec [ChequearVariablePMOVIL] ...` mediante `clsGeneradorQuerys.GetChequeoVariable` (`CapaNucleo/clsGeneradorQuerys.cs:217`).
- Esos procedimientos almacenados los crea `clsChequeos_Estructura` (`CapaNucleo/clsChequeos_Estructura.cs:1240` y `1252`): insertan la variable si no existe y actualizan descripción, módulo, tipo y control, **sin pisar el valor** que configuró la cooperativa.
- Todo se ejecuta dentro del procedimiento `RealizarChequeos` (`CapaNucleo/clsChequeos.cs:16–46`) durante la actualización de versión. `FinalizarChequeos` contiene migraciones puntuales de valores (por ejemplo, si las variables 21 y 383 existen, traslada su significado a la 742; también resetea la 144).

### 2.4 Edición por el usuario

- Pantalla `Configuracion/Configuracion/frmVariables.cs`: grilla filtrada por módulo (`Nucleo.GetVariablesGridView`, `Nucleo.cs:4037`), con el editor que corresponda según `TIP_CTRL`/`CONF_CTRL`; guarda con `Actu_V2` (`frmVariables.cs:356–375`).
- Pantalla equivalente para las apps: `Configuracion/Forms.Funcionalidades/frmVariables_PMovil.cs`.
- No hay validación de rangos ni dependencias entre variables (más allá de `Valida_V2`), ni historial de valores salvo la fila de auditoría genérica.

---

## 3. Multiempresa, sucursal y puesto

- **Una base de datos por cooperativa.** No existe un identificador de "empresa" en las tablas transaccionales; la razón social, CUIT, domicilio, IIBB, inicio de actividades y logo salen de variables (518–527 y 709) en `Nucleo.Empresa.CrearEmpresa` (`Nucleo.cs:333`).
- Un mismo puesto puede apuntar a varias bases: en la carpeta del ejecutable puede haber varios `Configuracion*.pro` y, si hay más de uno, se elige en `frmSelectConfiguracion` (`Nucleo.GetNombreArchivoConfiguracion`, `Nucleo.cs:3441`). Es multiempresa "por instalación", no "multi-tenant".
- `Nucleo.cs:361–370` contiene un caso especial hardcodeado para los servidores de prueba de Procoop (nombres de servidor fijos), que altera los datos de empresa.
- **Sucursal / punto de venta**: la tabla `PTOVENTA` (con `SUC_COM`) es la "sucursal". El punto de venta vigente se resuelve por capas: el del archivo de configuración del puesto (`objConfig.sPto_Vta`), el del usuario (`USERS.PTO_VTA → PTOVENTA.SUC_COM`, en `Usuario.CargarUsuario`, `Nucleo.cs:1271`) y el del equipo registrado (`EQUIPOS.PTO_VTA`, `Nucleo.RegistrarEquipos`, `Nucleo.cs:3109`). Muchas variables de facturación y cobranza deciden si se respeta el punto de venta del usuario o uno fijo (por ejemplo la 473 en cobranzas).
- **Depósitos**: el usuario tiene depósitos habilitados en `USERS_DEPOSITO`; el depósito por defecto por tipo de operación sale de las variables 161/164/165/166.
- **Sueldos**: `SU_EMPRESAS` permite liquidar para más de un empleador dentro de la misma base (único caso real de multiempresa dentro de una base).

---

## 4. Usuarios, permisos, seguridad y auditoría

### 4.1 Usuarios y login

- Tabla `USERS` (alias, nombre, contraseña, perfil, punto de venta, nivel). `iNivel == -1` identifica al SysAdmin, que saltea los controles de permisos.
- Flujo: `frmLogin.cmdAceptar_Click` (`ProcoopNet/Procoop/frmLogin.cs:88`) → `ValidarContraseña` (`:138`) → `ValidarUsoSistema` (`:160`, controla horario del perfil y licencia) → `Usuario.CargarDatosUsuario` (`Nucleo.cs:1199`) o `CargarDatosUsuarioDirecto` (`Nucleo.cs:1232`, usado por la línea de comandos y el Agente).
- `Usuario.ControlClave` (`Nucleo.cs:1496`) compara la contraseña ingresada, pasada por `Nucleo.Encriptar` (`Nucleo.cs:4455`), con la almacenada, y valida un dígito verificador (`Digito_Verficador`, `Nucleo.cs:4430`). **`Encriptar`/`Desencriptar` (`4455`/`4488`) es una transformación reversible por desplazamiento de bytes**, no un hash: quien tenga la base o el `.pro` puede recuperar contraseñas.
- Si el usuario tiene la contraseña por defecto y la variable 2588 está activa, se fuerza el cambio. `abm_Users.cs:176` y `:204` (Configuracion) restablecen contraseñas a un valor por defecto fijo en el código.
- **Contraseñas maestras / puertas traseras**: existen valores hardcodeados que permiten ingresar sin conocer la contraseña del usuario en `Nucleo.cs:1202`, `1241`, `1260`, `1500`, `1505` y `1510`, y una contraseña de administrador derivada de la fecha del día (`Password_admin_coop`, `Nucleo.cs:1479`). `frmLogin.cs:67` precarga credenciales cuando hay un depurador adjunto, y `clsImportador.cs:171` se autentica con una contraseña fija. No se transcriben los valores.

### 4.2 Perfiles y permisos

- `PERFILES`: perfil con franja horaria permitida (`HORA_DESDE`/`HORA_HASTA`) y bandera `ACCESO` para la web. `PERFILES_TABLAS` vincula perfiles con tablas/vistas publicadas a Power BI (`abm_Perfiles.cs`).
- `MENUSYS`: todas las opciones de menú (772 opciones declaradas en `CapaNucleo/clsChequeosMenu.cs` con `Verifica_Opcion_Menu`, `:132`). `MENUVAL`: qué perfil puede ver/usar cada opción y control.
- Controles: `Nucleo.Valida_Menu`, `CargarMenuVal` y `Valida_Controles(string)` (`Nucleo.cs:1556`) a nivel de botón/control; `FormBase.ValidarPermiso` (`Configuracion/FormBase.cs:332`) que, si el usuario no tiene permiso, puede pedir **autorización en el momento a un supervisor** (abre `ShowLogin` para que otro usuario se autentique).
- Solicitudes de autorización diferidas: tabla `AUTORIZACIONES` (`Nucleo.cs:4532–4601`) y pantalla `frmAutorizaciones` (por ejemplo, para anulaciones o descuentos fuera de rango).
- No hay permisos por registro (por sucursal, por zona, por cliente); el permiso es por opción de menú/control.

### 4.3 Auditoría

| Tabla | Qué registra | Dónde |
|---|---|---|
| `AUDITO` | Login y logout: equipo, IP, usuario de Windows, usuario Procoop. | `Usuario.registrar_mvto` (`Nucleo.cs:1324`); consulta en `frmAuditoriaLogin`. |
| `AUDITORIA` | Acción sobre una tabla: `TABLA`, `PK_TABLA`, `SENTENCIA`, usuario y fecha. | `Conexion.RegistrarAuditodia`, ≈51 llamadas; las altas/modificaciones genéricas de ABM pasan por `abm_Base_Handler.cs:251/321`. Consulta en `clsAuditoria.cs`. |
| `INFO_SYS` / `INFO_AUD` | Impresión de reportes. | `Nucleo.cs:1401`. |
| `AUDIT_MAIL` | Cada mail enviado (destinatario, asunto, resultado). | `Mails/Manager.EnvioMail` (`:591`). |
| `BLOQUEO_FILAS` | Bloqueo optimista/pesimista de registros en edición. | ABM base. |

La auditoría es selectiva (no hay triggers ni captura de valores anteriores/nuevos de forma sistemática). Los errores no controlados se escriben en `LogProcoop.txt` (`Excepcion.GrabarExcepcion`, `Nucleo.cs:1882`) y, si la variable −1 está activa, se envían por mail; en `Nucleo.cs:2044` hay además una dirección de correo personal de un desarrollador hardcodeada como destino. En login/logout puede dispararse un backup automático (`GenerarBackupAutomatico`).

---

## 5. Arquitectura de ProcoopNet

### 5.1 Capas y ensamblados

- `Procoop.exe` (ProcoopNet/Procoop): shell WinForms con DevExpress (ribbon, formulario principal `Inicio_ProCoop`, login).
- `Configuracion.dll`: base de UI (`FormBase`, `abm_Base`, `abm_Base_Simple`, `frmTransicion`, controles comunes, pantallas de configuración).
- `ReglasNegocio.dll`: reglas de negocio y `CapaNucleo` (Nucleo, chequeos de estructura, variables, menú).
- `CapaDatos.dll`: Entity Framework (Database First) sobre SQL Server (`Conexion`, `Factory`); no está descompilada en este relevamiento (ver `binarios/CapaDatos-tablas.md`).
- Módulos de UI por área: `ProMod_Facturacion`, `ProMod_Compras`, `ProMod_Titulares`, `ProMod_Cobranzas`, `ProMod_Telefonia`, `ProMod_Tecnica`, `ProMod_Sueldos`, `ProMod_Tesoreria`, `ProMod_Stock`, `ProMod_Fabricacion`, `ProMod_Contabilidad`, `ProMod_Consumos`, `ProMod_GestionMora`, `ProMod_Traslados`, `ProMod_Actividades`, `ProMod_TeleMed`, `ProMod_Tickets` (referenciados por nombre en los comandos de menú), más `ProMod_SMS` y `ProMod_WebService` (clientes HTTP de pasarelas; este último no está descompilado).

### 5.2 Arranque

1. `Program.Main` (`ProcoopNet/Procoop/Program.cs`) registra `AppDomain.AssemblyResolve` para cargar DLLs desde la subcarpeta `Librerias\`.
2. `Init`: fuerza TLS 1.2, fija la cultura `es-ES`, lee el archivo de configuración y llama a `Nucleo.ValidarVersion`.
3. Si se pasa un **modo por línea de comandos** (`args[0]`), Procoop se ejecuta como proceso "batch" sin interfaz: 1 = procesar XML de llamadas (central telefónica), 2 = enviar mails desde XML, 3 = abrir configuración, 4 = `Integracion.RealizarOperacion`, 5 = AVL Discar, 6 = abrir un formulario por nombre, 7 = módulos visibles con usuario y contraseña, 8 = servicio (discontinuado), 9 y 10 = procesos de Pagos360, 11 = vigilar/reiniciar `Agente Procoop.exe` y avisar por mail (variables 2730, 2648, 2731), 12 = imprimir desde un JSON invocando funciones por reflexión (`clsFuncion.EjecutarFuncion`).
4. Sin modo: `CargarProcoop` controla el desfase de reloj contra el servidor SQL (bloquea si supera 60 minutos), luego `LoginUsuario` → `Nucleo.Iniciar` → `Inicio_ProCoop.ChequearEstructura` → `LevantarLogin`.

### 5.3 Conexión a la base

- `Nucleo.clsConfiguraciones` (`Nucleo.cs:132`) es el contenido del `.pro`: servidor, base, usuario y contraseña SQL, puerto, punto de venta del puesto, rutas (DBF heredado, backup, servidor de archivos), datos SMTP, licencia, módulos habilitados, datos de publicación web (`WEB_*`: FTP o S3, usuario, clave, ruta, horarios, comando P6) y prepaga CoopOnline.
- El archivo se guarda con `Encriptar` (mismo desplazamiento de bytes que las contraseñas), o sea que **la contraseña SQL está recuperable** por cualquiera con acceso al puesto.
- `Nucleo.CargarCadenaConexion` (`Nucleo.cs:3489`) arma la cadena de Entity Framework con **autenticación SQL Server** (no integrada) y `Application Name = "Procoop 10"`. Todos los puestos usan el mismo usuario SQL; la identidad del usuario final no llega a la base.

### 5.4 Licenciamiento

- `Licencia` del `.pro` debe coincidir con una transformación de `SQLServer + SQLBase` (`Nucleo.cs:3473`).
- `Nucleo.ValidarVersion` (`Nucleo.cs:3682`) busca el CUIT de la cooperativa (variable 519) en una lista de clientes compilada dentro del ejecutable (`clsClientesProcoop.CargarClientes`); si no está, habilita 30 días de demo. Los módulos habilitados se controlan con el campo `Modulos` del `.pro`.

### 5.5 Menú y carga de módulos por reflexión

- El menú se arma desde la base (`MenuSistema.ModulosProCoop / PadsProCoop / PopUpsProCoop` sobre `MODULOS` y `MENUSYS`), filtrado por `MENUVAL`.
- Cada opción tiene un comando de texto interpretado por `Inicio_ProCoop.Comando` (`ProcoopNet/Procoop/Inicio_ProCoop.cs:823`):
  - `1-Ensamblado.Namespace.Formulario,param1,param2` → abre un formulario por reflexión (lo genera `clsChequeosMenu.GetComandoFormulario`, `:224`).
  - `2-...` → ABM genérico `abm_Base_Simple` sobre una tabla.
  - `3-...` → `frmTransicion`: grilla genérica definida por metadatos en las tablas `ENTIDADES` (entidad, grupo, vistas).
  - `Tab_<n>` → menú de tablas auxiliares del módulo n; informes con `1-Procoop.frmInformes,<grupo>`.
- `Funciones.GetForm / GetControl / ShowFormulario / EjecutarFuncion` (`Configuracion/Funciones.cs:16–117`) toman el prefijo del nombre completo como nombre de ensamblado, hacen `Assembly.Load` + `GetType` + `Activator.CreateInstance`. No hay contrato de plugin: cualquier tipo público puede invocarse por nombre.

### 5.6 Tareas al abrir el formulario principal

`Inicio_ProCoop_Load` (`Inicio_ProCoop.cs:1310`) arranca timers de cierre forzado, hilos de mails internos, notificaciones y calendario (variable 2275), valida CESP/LUA y facturas electrónicas pendientes, avisa de backups vencidos (2786/2051), de vencimiento del certificado AFIP (2925) y de diferencia de versión con el servidor (2085). Además ofrece TeamViewer, un webchat de soporte, encuestas y un RSS de novedades del proveedor.

### 5.7 Actualizaciones

- **Esquema**: `clsChequeos_Estructura.RequiereChequearEstructura` (`CapaNucleo/clsChequeos_Estructura.cs:946`) compara la variable 2085 (versión de la capa de datos) con la versión del ejecutable; si difieren, el primer usuario que entra ejecuta los chequeos (`RealizarChequeos`: tablas, columnas, SP, vistas, variables y menú) y actualiza la 2085.
- **Binarios**: `clsVersion` (`ReglasNegocio/ReglasNegocio.Varios.Generales/clsVersion.cs`) consulta y descarga `Version.gzip` desde un bucket S3 del proveedor (`HayVersion:33`, `ActualizarVersion:97`) y reemplaza archivos en uso renombrándolos con prefijo `_old_`. El Integra (API local) se actualiza desde otro prefijo del mismo S3, verificando `api/version` y reiniciando IIS (`clsVersion.cs:138`).

### 5.8 Agente (tareas programadas)

`clsServicio_Procoop` (`ReglasNegocio.Varios.Generales/clsServicio_Procoop.cs`) define tareas programadas con acciones y desencadenadores (`:140–250`): backup SQL y de carpetas, facturación electrónica pendiente, comando P6 (Procoop 6 heredado), sincronización web, FTP, actividades, cálculo de variables, CoopOnline, trámites, consultas, capitalización, rendiciones de entes, purga de `AUDIT_MAIL` y aviso de adherentes que cumplen la mayoría de edad. Corre como `Agente Procoop.exe` y lo vigila el modo 11.

---

## 6. Catálogo de parámetros

### 6.1 Cómo leer el catálogo

- **N°**: `COD_VAR`. **Tabla**: `VAR` = `VARIABLE`; `VAR_PMOVIL` = `VARIABLE_PMOVIL` (con el canal: CoopOnline, PMovil o PWeb).
- **Tipo**: según `TIP_VAR`/helper de declaración. "Lista" indica valores cerrados (`TIP_CTRL = 2`); "FK" indica que el valor es un código de otra tabla; "Cuenta" es una cuenta contable; "Ruta" es un path.
- **Descripción oficial / comportamiento**: el texto de `NOM_VAR` declarado en `clsVariables.cs`, más las opciones de la lista cuando las hay y observaciones.
- **Dónde se usa**: clase.método — archivo:línea de cada lectura directa (máximo las primeras ubicaciones). "— (sin lectura directa en RN/Cfg/PN …)" significa que el número no aparece leído literalmente en el código descompilado (ver §1).
- Los módulos son los de la columna `COD_MOD` (enum `Modulos`). Al final hay un apartado con las variables que el código lee pero el catálogo no declara.

### 6.2 Totales por módulo

| Módulo | Declarados | Con uso directo |
|---|---:|---:|
| SISTEMA | 8 | 8 |
| CONFIGURACION | 107 | 65 |
| TITULARES | 312 | 193 |
| VENTAS_Y_FACTURACION | 313 | 199 |
| COBRANZA | 265 | 186 |
| GESTION_DE_MORA | 23 | 13 |
| FINANCIACIONES | 21 | 12 |
| CONSUMOS | 4 | 1 |
| TECNICA | 95 | 36 |
| TELEMED | 45 | 31 |
| TELEFONIA | 16 | 13 |
| SMS | 11 | 7 |
| COMPRAS | 109 | 46 |
| STOCK | 14 | 5 |
| FABRICACION | 4 | 1 |
| CONTABILIDAD | 87 | 37 |
| TESORERIA | 33 | 16 |
| SUELDOS | 28 | 18 |
| VIVIENDA | 14 | 9 |
| TURNERO | 11 | 7 |
| TICKETS | 3 | 1 |
| MESA_DE_ENTRADAS | 3 | 0 |
| ACTIVIDADES | 1 | 1 |
| No catalogados (leídos por el código) | 9 | 9 |
| **Total** | **1.536** | **914** |

### 6.3 Parámetros más influyentes (lectura rápida)

Antes del listado completo, los parámetros que más cambian el comportamiento global (verificados en el código):

- **Identidad de la empresa**: 518–527 y 709 (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) — `Nucleo.Empresa.CrearEmpresa`.
- **Versión y estructura**: 2085 (versión de capa de datos; dispara la migración), −1 (envío de errores por mail), 2617 (ruta de adjuntos).
- **Seguridad**: 2588 (forzar cambio de contraseña por defecto), 3160 (desactivar validación de certificados SMTP).
- **Facturación**: 74 (tipo de interés por pago fuera de término), 273 (registrar factura o nota de débito en cobranzas), 70 (concepto de comisión), 2925 (aviso de vencimiento de certificado AFIP).
- **Cobranzas / pasarelas**: 901–914 (Pagos360), 2492–2500 y 2798–2807 (SIRO), 2803/3142 (entidad para QR y QR ATM), 2996 (entidad por defecto en rendiciones).
- **Web y apps**: 801–811 (CoopOnline: activación y credenciales de la base web), 2696 (URL de la API de mensajería), 2870–2874 y 3105 (WhatsApp).
- **Agente**: 2648, 2730, 2731 (supervisión del Agente), 404 y 461 (envío de mails pendientes).

### 6.4 Listado completo por módulo

#### SISTEMA (8 parámetros, 8 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| -1 | VAR | Mixto: Texto/Lógico/Numérico | Enviar errores por mail — _obs: 01/01/1901 00:00:00_ | Excepcion.GrabarExcepcion — CapaNucleo/Nucleo.cs:1887; Excepcion.EnviarMailError — CapaNucleo/Nucleo.cs:2038 |
| 1 | VAR | Lógico | Utilizar Venta de Prepaga en otro dominio | clsPMovil_Base.Sincroniza_Tablas — RN.Varios.PMovil/clsPMovil_Base.cs:184 |
| 2 | VAR | Lógico | CheckForIllegalCrossThreadCalls | frmRecuperaConfiguracion.CargarServers — Cfg.Forms.Herramientas/frmRecuperaConfiguracion.cs:224; Inicio_ProCoop.Inicio_ProCoop — PN/Procoop/Inicio_ProCoop.cs:294 |
| 2085 | VAR | Mixto: Texto | Versión de la Capa de Datos. | clsChequeos_Estructura.RequiereChequearEstructura — CapaNucleo/clsChequeos_Estructura.cs:950; clsPMovil_Base.GetVersionCode — RN.Varios.PMovil/clsPMovil_Base.cs:478; Inicio_ProCoop.Inicio_ProCoop_Load — PN/Procoop/Inicio_ProCoop.cs:1390 |
| 2459 | VAR | Lógico | Cerrar Formulario de Reporte al imprimir | frmPrintPreview.Cerrar_PrintPreview — Cfg/Configuracion/frmPrintPreview.cs:866 |
| 2617 | VAR | Texto | Ruta para archivos adjuntos | Nucleo.GetPathAdjuntos — CapaNucleo/Nucleo.cs:3602 |
| 2895 | VAR | Lógico | No mostrar iconos al cargar archivos adjuntos | clsAdjuntos.GetFileInfo — RN.Varios/clsAdjuntos.cs:180 |
| 2931 | VAR | Texto | Ruta para certificados de firma digital | clsFirmaDigital.ProcesarLote_FirmaInterna — RN.Varios.Configuraciones/clsFirmaDigital.cs:262; clsCertificados.GetCertificateAlias — RN.Varios.Generales/clsCertificados.cs:51 |

#### CONFIGURACION (107 parámetros, 65 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 5 | VAR_PMOVIL | Texto | Personalizar texto del boton agregar cuentas — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 6 | VAR_PMOVIL | Texto | Personalizar titulo de la vista agregar cuenta — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 7 | VAR_PMOVIL | Texto | Personalizar texto del input código socio — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 8 | VAR_PMOVIL | Texto | Personalizar texto del input clave/suministro — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 9 | VAR_PMOVIL | Texto | Personalizar texto de la observación en agregar cuenta — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 34 | VAR_PMOVIL | Texto | Link de referencia en el Login Web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 35 | VAR_PMOVIL | Texto | Personalizar texto de la obesrvación en facturas — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 40 | VAR_PMOVIL | Lógico | Habilitar CIDI en la Web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 41 | VAR_PMOVIL | Entero | Perfil para Empleados NO usuarios del sistema — canal: PWeb | clsProcoop_Integra.GetUserCoopDirecto — RN.Varios.Generales/clsProcoop_Integra.cs:6965; clsProcoop_Integra.GetUserCoop — RN.Varios.Generales/clsProcoop_Integra.cs:7028 |
| 42 | VAR_PMOVIL | Texto | Personalizar descripción del concepto al generar solicitud de Prepaga en SIRO — canal: CoopOnline | clsHelipagos.Crear_PAGOS360 — RN.Cobranzas/clsHelipagos.cs:46; clsSiPago.Crear_PAGOS360 — RN.Cobranzas/clsSiPago.cs:139; clsSIRO.Crear_PAGOS360 — RN.Cobranzas/clsSIRO.cs:1111 |
| 43 | VAR_PMOVIL | Texto | Id de convenio para generar solicitudes de SIRO — canal: CoopOnline | clsSIRO.Registrar_Solicitudes — RN.Cobranzas/clsSIRO.cs:1476 |
| 44 | VAR_PMOVIL | Entero | Validar requerir datos en DDJJ de artefactos — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 49 | VAR_PMOVIL | Texto | Mail para recibir los avisos de registros de trámites de la web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 56 | VAR_PMOVIL | Texto | Correo electrónico para enviar mail de datos — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 65 | VAR_PMOVIL | Texto largo | Texto para mostrar en la cabecera de la página — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 68 | VAR_PMOVIL | Numérico | Número de sucursal de Fecescor — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 103 | VAR | Entero (FK a tabla) | Contrato de Fianza Titular — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 205 | VAR | Entero (FK a tabla) | Contrato de Fianza Cuenta — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 206 | VAR | Entero (FK a tabla) | Contrato de Fianza Servicio — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 224 | VAR | Lógico | Tomar hora desde el servidor (Requiere Privilegios) | Nucleo.ChequeoGenerales — CapaNucleo/Nucleo.cs:3101 |
| 225 | VAR | Texto | Nombre para el servidor de horas. | Nucleo.ChequeoGenerales — CapaNucleo/Nucleo.cs:3101 |
| 335 | VAR | Entero (FK a tabla) | Contrato Asociado a Solicitud de ingreso de Titular — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 501 | VAR | Fecha (texto) | Fecha de Cierre de Facturacion | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5333 |
| 518 | VAR | Texto | Datos Empresa - Razón Social | clsWeb_CoopOnline.ValidarConfiguracion — Agente.Clases/clsWeb_CoopOnline.cs:849; clsWeb_CoopOnline.SubirPDFPagoEfectivo — Agente.Clases/clsWeb_CoopOnline.cs:1515; clsWeb_CoopOnline.AutorizarPrepaga — Agente.Clases/clsWeb_CoopOnline.cs:1556; (+44 más) |
| 519 | VAR | Texto | Datos Empresa - CUIT | clsWeb_CoopOnline.ValidarConfiguracion — Agente.Clases/clsWeb_CoopOnline.cs:849; clsWeb_CoopOnline.SubirPDFPagoEfectivo — Agente.Clases/clsWeb_CoopOnline.cs:1515; clsWeb_CoopOnline.AutorizarPrepaga — Agente.Clases/clsWeb_CoopOnline.cs:1556; (+65 más) |
| 520 | VAR | Texto | Datos Empresa - Calle | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:339; clsComprobanteVenta.CargarComprobante — RN.Facturacion/clsComprobanteVenta.cs:1441 |
| 521 | VAR | Texto | Datos Empresa - Numero | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:340; clsComprobanteVenta.CargarComprobante — RN.Facturacion/clsComprobanteVenta.cs:1442 |
| 522 | VAR | Texto | Datos Empresa - Barrio | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:341; clsComprobanteVenta.CargarComprobante — RN.Facturacion/clsComprobanteVenta.cs:1443 |
| 523 | VAR | Texto | Datos Empresa - Localidad | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:342; clsInformes_Caja.Guardar_Archivo — RN.Cobranzas/clsInformes_Caja.cs:4889 |
| 524 | VAR | Texto | Datos Empresa - Codigo Postal | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:343; abm_Personas.abm_Personas_Load — Cfg.Forms/abm_Personas.cs:375 |
| 525 | VAR | Texto | Datos Empresa - Telefono | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:344 |
| 526 | VAR | Texto | Datos Empresa - Ingresos Brutos | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:345 |
| 527 | VAR | Entero (FK a tabla) | Datos Empresa - Situación IVA — FK `SITIVA.COD_SIT` | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:346; Impuestos.GetAlicuota — ReglasNegocio/Impuestos.cs:372; Impuestos.GetAlicuota_Percepcion — ReglasNegocio/Impuestos.cs:381; (+3 más) |
| 706 | VAR | Entero (FK a tabla) | Datos Empresa - Condición de Ingresos Brutos — FK `SITIBR.COD_SIT` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 707 | VAR | Texto | Datos Empresa - Código de Validación Provincial | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 709 | VAR | Texto | Datos Empresa - Razón Social para Email | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:348 |
| 2008 | VAR | Texto | Datos Empresa - Nombre Agente de Retención | clsProveedor.GetProveedores_Transporte — ReglasNegocio/clsProveedor.cs:886; GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:589; GetDatosInforme.Exportar_Silarpib_Alem — RN.Contabilidad/clsInformes_Contabilidad.cs:763 |
| 2009 | VAR | Texto | Datos Empresa - Domicilio Agente de Retención | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2010 | VAR | Texto | Datos Empresa - Número Agente de Retención | GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:590; GetDatosInforme.Exportar_Silarpib_Alem — RN.Contabilidad/clsInformes_Contabilidad.cs:764 |
| 2011 | VAR | Texto | Datos Empresa - Localidad Agente de Retención | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2012 | VAR | Texto | Datos Empresa - Punto de Venta para Ret. IIBB | Retenciones.ObtenerRetencion — ReglasNegocio/Retenciones.cs:129; SIRCAR.Get_RetencionesCompra — RN.Facturacion.Archivos/SIRCAR.cs:274; SIRCAR.Get_RetencionesIIBB_RioNegro — RN.Facturacion.Archivos/SIRCAR.cs:338 |
| 2013 | VAR | Lógico | Marcar Automaticamente Valores Para pago a proveedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2027 | VAR | Texto | Coordenadas de inicio del mapa — _obs: -33.2042515037773; -62.6004814714416_ | AtributosMapa.AtributosMapa — RN.Varios/clsMapa.cs:141 |
| 2028 | VAR | Entero | Zoom de inicio del mapa | AtributosMapa.AtributosMapa — RN.Varios/clsMapa.cs:142 |
| 2029 | VAR | Entero (lista de opciones) | Tipo de mapa — opciones: RoadMap; Satellite; Hybrid; Terrain — _obs: RoadMap_ | AtributosMapa.AtributosMapa — RN.Varios/clsMapa.cs:143 |
| 2051 | VAR | Entero (lista de opciones) | Backup - Configuración — opciones: No chequear; Al Ingresar al Sistema; Al Salir del sistema; Utilizar Servicio Procoop — _obs: No chequear_ | Nucleo.GenerarBackupAutomatico — CapaNucleo/Nucleo.cs:6225; clsServicio_Procoop.ChequearBackup — RN.Varios.Generales/clsServicio_Procoop.cs:1129; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1971; (+3 más) |
| 2052 | VAR | Mixto: Entero | Backup - Hora desde la cual generarlo | Nucleo.GenerarBackupAutomatico — CapaNucleo/Nucleo.cs:6226; clsServicio_Procoop.ChequearBackup — RN.Varios.Generales/clsServicio_Procoop.cs:1127; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1970; (+2 más) |
| 2053 | VAR | Mixto: Texto | Backup - Ruta de Destino en Servidor | Nucleo.GenerarBackupAutomatico — CapaNucleo/Nucleo.cs:6227; Nucleo.GenerarBackup — CapaNucleo/Nucleo.cs:6245; Nucleo.ActualizarBaseDemo — CapaNucleo/Nucleo.cs:6259; (+5 más) |
| 2086 | VAR | Entero (FK a tabla) | Situación IVA por defecto de la Persona — FK `SITIVA.COD_SIT` | InfoCobranza.Get_Recargo — RN.Cobranzas/clsCobranzas.cs:1736; clsCobranzas.Get_ConceptosCobrar — RN.Cobranzas/clsCobranzas.cs:3358; abm_Personas.abm_Personas__NuevoRegistro_CargarControles — Cfg.Forms/abm_Personas.cs:437 |
| 2090 | VAR | Entero (lista de opciones) | Proveedor de Mapa — opciones: Google; Bing | Nucleo.abrirMapa_Navegador — CapaNucleo/Nucleo.cs:5811; frmVisorMapa.frmVisorMapa — Cfg.Forms/frmVisorMapa.cs:47 |
| 2242 | VAR | Texto | Clave de Mapa Bing | clsRecategorizacion.Get_Recategorizacion_GasCuadros — RN.Facturacion/clsRecategorizacion.cs:489; ctrlMapaBing.InicializarControl — Cfg.ControlesProcoopNet/ctrlMapaBing.cs:192 |
| 2251 | VAR | Texto | Clave de Mapa Google | clsMapa.GetImageFromWeb — RN.Varios/clsMapa.cs:244; ctrlMapaBase.InicializarMapa — Cfg.ControlesProcoopNet/ctrlMapaBase.cs:133 |
| 2264 | VAR | Texto | Sigla del nombre del cliente | InfoCobranza.Cargar — RN.Cobranzas/clsCobranzas.cs:1492; clsEntidadesRecaudadoras.Archivo_Morosidad_TarjetaNaranja — RN.Cobranzas/clsEntidadesRecaudadoras.cs:192; clsEntidadesRecaudadoras.Archivo_Novedades_TarjetaNaranja — RN.Cobranzas/clsEntidadesRecaudadoras.cs:405; (+129 más) |
| 2275 | VAR | Lógico | No iniciar Calendario ni correo al iniciar — _obs: Para un mejor rendimiento, se puede deshabilitar esta variable, para que no inicie el calendario ni el correo interno al iniciar el sistema_ | Inicio_ProCoop.Inicio_ProCoop_Load — PN/Procoop/Inicio_ProCoop.cs:1338; Inicio_ProCoop.timerNoticias_Tick — PN/Procoop/Inicio_ProCoop.cs:1825 |
| 2280 | VAR | Numérico | Tiempo (Minutos) de inactividad que debe transcurrir para bloqueo de sesión | Inicio_ProCoop.Inicio_ProCoop — PN/Procoop/Inicio_ProCoop.cs:295 |
| 2294 | VAR | Entero (lista de opciones) | Tipo de Exportacion de Excel — opciones: Excel DevExpress; Excel Metodo anterior; CSV — _obs: Excel DevExpress_ | Excel_Class.Exportar_DStoXLSX — CapaNucleo/Nucleo.cs:2273; Excel_Class.Exportar_DTtoXLS — CapaNucleo/Nucleo.cs:2327 |
| 2326 | VAR | Lógico | Mostrar advertencia al vincular ZSR ya asignadas a una cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2333 | VAR | Mixto: Texto/Lógico | Bloquear backup demo | frmOpcionesEspeciales.frmOpcionesEspeciales_Load — Cfg.Forms.Funcionalidades/frmOpcionesEspeciales.cs:95; frmOpcionesEspeciales.ok_Cancel1_ClickAceptar — Cfg.Forms.Funcionalidades/frmOpcionesEspeciales.cs:136 |
| 2347 | VAR | Entero | Clave de Cierre De Módulo de Autogestión | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2351 | VAR | Texto | Dirección IP para el Lector de Billetes — _obs: 127.0.0.1_ | clsLectorBilletes.clsLectorBilletes — RN.Varios.Generales/clsLectorBilletes.cs:80 |
| 2352 | VAR | Entero | Puerto para el Lector de Billetes | clsLectorBilletes.clsLectorBilletes — RN.Varios.Generales/clsLectorBilletes.cs:81 |
| 2353 | VAR | Entero | Localidad por defecto para el alta de Persona | GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:591; GetDatosInforme.Exportar_Silarpib_Alem — RN.Contabilidad/clsInformes_Contabilidad.cs:765; abm_Personas.abm_Personas_Load — Cfg.Forms/abm_Personas.cs:372 |
| 2549 | VAR | Lógico | Permite utilizar punto de Venta 0 en comprobantes — _obs: Requiere marcar cada comprobante para que utilice el punto de venta 0_ | clsPrepaga.GetCreditoPorRecargo — RN.Cobranzas/clsPrepaga.cs:746; clsPrepaga.GetDebitoPorRecargo — RN.Cobranzas/clsPrepaga.cs:781; clsComprobante.GetPuntoVenta — RN.Facturacion/clsComprobante.cs:445; (+1 más) |
| 2551 | VAR | Entero (FK a tabla) | Plantila de mail para comprobantes para pago de pagos360 — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2622 | VAR | Lógico | Activar Pagos Online | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2683 | VAR | Lógico | Activar Botón de Chat Online con Soporte | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2706 | VAR | Lógico | Generar remito por reimpresión con el mismo tipo del comprobante seleccionado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2721 | VAR | Entero (FK a tabla) | Configurar Titular para registrar facturas de farmacia de consumidor final — FK `SOCIOS.COD_SOC` | clsFacturacionCuotasTerceros.Importar_FacturaFarmacia — RN.Facturacion/clsFacturacionCuotasTerceros.cs:1325 |
| 2729 | VAR | Mixto: Lógico | Guardar nuevos correos internos | abm_CorreoInterno.abm_CorreoInterno__ValidFields — Cfg.Forms.Abms/abm_CorreoInterno.cs:134 |
| 2730 | VAR | Lógico | No levantar Agente si se encuentra cerrado(parametro 11 del sistema) | Program.Main — PN/Procoop/Program.cs:358 |
| 2731 | VAR | Texto | Lista de mails a enviar para la autorecuperación del agente(parametro 11 del sistema) — _obs: Separar por ; cada dirección de mail_ | Program.Main — PN/Procoop/Program.cs:392 |
| 2733 | VAR | Lógico | Permitir cargar Novedades Web | frmRequisitos.Novedades_ItemClick — Cfg.Forms.Abms/frmRequisitos.cs:125 |
| 2742 | VAR | Entero (FK a tabla) | Plantilla para Trámite de declaración jurada de artefactos — FK `PLANTILLA.COD_PLA` | frmRequisitos.GetPlantillaDDJJ — Cfg.Forms.Abms/frmRequisitos.cs:301 |
| 2786 | VAR | Mixto: Fecha (texto) | Backup - Ultima Fecha que se realizo | Nucleo.GenerarBackup — CapaNucleo/Nucleo.cs:6251; frmOpcionesEspeciales.comboBoxEdit_DataSource1_SelectedIndexChanged — Cfg.Forms.Funcionalidades/frmOpcionesEspeciales.cs:240; Inicio_ProCoop.Inicio_ProCoop_Load — PN/Procoop/Inicio_ProCoop.cs:1365 |
| 2790 | VAR | Entero (lista de opciones) | Autogestión - Permitir elegir la opción de búsqueda de cuenta por defecto en cobranzas/prepaga — opciones: Asociado; Cuenta; Documento; Código QR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2812 | VAR | Texto | Datos Empresa - Razón Social Corta (SMS) | clsProcoop_Integra.EnvioNotificacionSms — RN.Varios.Generales/clsProcoop_Integra.cs:3146; clsProcoop_Integra.EnvioOrdenTrabajoSms — RN.Varios.Generales/clsProcoop_Integra.cs:3311; clsProcoop_Integra.cargaRapidaReclamosSMS — RN.Varios.Generales/clsProcoop_Integra.cs:3358 |
| 2831 | VAR | Lógico | Usar entorno de pruebas para el proceso de firma digital | clsFirmaDigital.clsFirmaDigital — RN.Varios.Configuraciones/clsFirmaDigital.cs:186 |
| 2857 | VAR | Lógico | Imprimir alta/baja del debito automatico al guardar los cambios | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2860 | VAR | Mixto | Linea 1 Hojas para rubricar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2861 | VAR | Mixto | Linea 2 Hojas para rubricar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2862 | VAR | Mixto | Linea 3 Hojas para rubricar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2863 | VAR | Mixto | Linea 4 Hojas para rubricar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2866 | VAR | Lógico | Código de barras SIRO - Informar empresa de servicio 044 | TIR_Roela.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/TIR_Roela.cs:134 |
| 2903 | VAR | Numérico | Margen por defecto para actualizar precio en presupuestos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2966 | VAR | Entero | Valor por defecto para comenzar el index de los registros a exportar | Exportador_Base.Indexar_Registro — RN.Cobranzas.Entidades/Exportador_Base.cs:1441 |
| 2987 | VAR | Texto | Dato fijo que Rapipago informa a cada cooperativa | E_RapiPago.Exportar — RN.Cobranzas.Entidades.PR/E_RapiPago.cs:45; E_Rapipago_SinFactura.Exportar — RN.Cobranzas.Entidades.PR/E_Rapipago_SinFactura.cs:75 |
| 2990 | VAR | Texto | Ruta del Integra | clsVersion.HayVersionIntegra — RN.Varios.Generales/clsVersion.cs:48; clsVersion.ActualizarVersionIntegra — RN.Varios.Generales/clsVersion.cs:146 |
| 2993 | VAR | Texto | URL del Integra Local | clsFirmaDigital.ProcesarLote_FirmaInterna — RN.Varios.Configuraciones/clsFirmaDigital.cs:256; clsProcoop_Integra.PreRegistrarUsuario — RN.Varios.Generales/clsProcoop_Integra.cs:11250; clsVersion.HayVersionIntegra — RN.Varios.Generales/clsVersion.cs:54; (+1 más) |
| 3024 | VAR | Lógico | Mostrar los datos del producto en una página extra a la hora de imprimir el presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3029 | VAR | Lógico | Mostrar grilla con imagenes en el turnero | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3048 | VAR | Texto largo | Api Key de OPEN AI | clsChatGPT.EnviarComandoConMultiplesImagenes — RN.Varios.Generales/clsChatGPT.cs:626; clsChatGPT.ObtenerApiKey — RN.Varios.Generales/clsChatGPT.cs:766 |
| 3093 | VAR | Lógico | Permitir guardar una copia del adjunto en la carpeta seleccionada. | frmAdjuntos.frmAdjuntos_Load — Cfg.Forms/frmAdjuntos.cs:121 |
| 3097 | VAR | Lógico | No se realiza eliminación de registros de AUDIT_MAIL y se los guarda en tabla de históricos a través del agente | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2015 |
| 3098 | VAR | Entero | Agente - Hora en la que se realiza la eliminación de registros de AUDIT_MAIL — _obs: Este horario depende de que este desactivada la variable 3097_ | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2017 |
| 3104 | VAR | Texto | URL externa para Boton Herramientas en Procoop.ar | clsProcoop_Integra.ValidacionVariable — RN.Varios.Generales/clsProcoop_Integra.cs:8125 |
| 3114 | VAR | Entero (FK a tabla) | FECESCOR - Entidad de terceros — FK `TERCEROS.COD_TER` | clsWeb_CoopOnline.CrearCobranzaResumenTarjeta — Agente.Clases/clsWeb_CoopOnline.cs:1335; clsWeb_CoopOnline.GenerarFacturaTerceros — Agente.Clases/clsWeb_CoopOnline.cs:1868; clsWEB.SincronizarParametros — RN.Titulares/clsWEB.cs:1324 |
| 3115 | VAR | Lógico | Realizar el control de backup automatico y enviar mail a desarrollo en caso de no estar haciendolo — _obs: Esta variable depende de que este desactivada la variable 3097_ | clsServicio_Procoop.EliminarAuditMail — RN.Varios.Generales/clsServicio_Procoop.cs:1394 |
| 3116 | VAR | Lógico | Impactar operaciones de cambio de estado (desconexion y reconexion) en Discar | Discar.ConfirmarOT — RN.Varios.Telemed.Telemedicion/Discar.cs:2004 |
| 3122 | VAR | Lógico | No permitir descarga de recibos de sueldo antes de firmar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3125 | VAR | Texto largo | Ruta de backup diario para avisar por mail cuando este atrasado — _obs: Esta variable depende de que este activada la variable 3115_ | clsServicio_Procoop.ControlUltimoBackup — RN.Varios.Generales/clsServicio_Procoop.cs:1414 |
| 3131 | VAR | Entero (lista de opciones) | Forzar cambio de contraseña cuando el usuario utiliza la clave por defecto — opciones: No chequear; Solicitar cambio; Obligar cambio — _obs: No chequear_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3132 | VAR | Entero (lista de opciones) | Nivel de complejidad requerido para las contraseñas de usuarios — opciones: Sin Complejidad; Complejidad Baja; Complejidad Media; Complejidad Alta — _obs: Sin Complejidad_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3157 | VAR | Texto | Permitir modificar el nombre del formulario de transicion y abm de incidentes | clsDefault.AgregarChequeoEntidades — CapaNucleo/clsDefault.cs:712 |
| 3160 | VAR | Lógico | No validar certificado en la configuración del correo electrónico | Manager.Manager — Mails/Manager.cs:105 |
| 3166 | VAR | Lógico | No permitir acceso al recibo de sueldo del mes actual si no se firmo el recibo del mes anterior | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3168 | VAR | Fecha (texto) | Fecha de facturas de Procoop | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3170 | VAR | Lógico | Permitir realizar una desconexion desde el integra, sin confirmar la orden de trabajo. | clsProcoop_Integra_Tecnica.Desconectar — RN.Varios.Generales/clsProcoop_Integra_Tecnica.cs:1540 |

#### TITULARES (312 parámetros, 193 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 3 | VAR_PMOVIL | Lógico | Sincronizar detalle pagos de comprobantes — canal: CoopOnline | clsWEB.SincronizarPagos — RN.Titulares/clsWEB.cs:2073 |
| 4 | VAR_PMOVIL | Lógico | Sincronizar detalle de refinanciación — canal: CoopOnline | clsWEB.SincronizarPagos — RN.Titulares/clsWEB.cs:2077 |
| 12 | VAR_PMOVIL | Lógico | Diferir intereses al realizar cobranzas — canal: CoopOnline | clsWeb_CoopOnline.crearCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1282; clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:2010; clsWeb_CoopOnline.GetInfoCobranza — Agente.Clases/clsWeb_CoopOnline.cs:2377 |
| 13 | VAR_PMOVIL | Lógico | Obtener Todas las facturas de un talón al realizar cobranzas — canal: CoopOnline | clsWeb_CoopOnline.crearCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1218; clsWeb_CoopOnline.GetInfoCobranza — Agente.Clases/clsWeb_CoopOnline.cs:2350 |
| 14 | VAR_PMOVIL | Texto | Texto a mostrar en Vista previa de facturas seleccionadas — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 15 | VAR_PMOVIL | Lógico | Exigir Teléfono en Titular — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 17 | VAR_PMOVIL | Lógico | No subir PDF de los comprobantes bloqueados — canal: CoopOnline | clsWEB.GetlstFacturas — RN.Titulares/clsWEB.cs:1863 |
| 18 | VAR_PMOVIL | Lógico | Exigir Mail de Titular — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 19 | VAR_PMOVIL | Lógico | Confirmar teléfono/e-mail SIEMPRE al ingresar — _obs: En caso que soliciten teléfono o E-mail (variables 15 y 18), se solicitará confirmacion al volver a ingresar_ — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 20 | VAR_PMOVIL | Fecha (texto) | No subir facturas posterior a la fecha específica — canal: CoopOnline | clsWEB.AgregarFiltrosFacturas — RN.Titulares/clsWEB.cs:1825 |
| 21 | VAR_PMOVIL | Lógico | Permitir descargar pdf para Pago en efectivo — canal: CoopOnline | clsWeb_CoopOnline.crearCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1295 |
| 27 | VAR | Numérico (FK a tabla) | Crédito para Anticipo — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 27 | VAR_PMOVIL | Texto | Configurar URL para adhesión débito automático — canal: CoopOnline | clsWEB.SincronizarCuentas — RN.Titulares/clsWEB.cs:1542 |
| 28 | VAR | Numérico (FK a tabla) | Débito para Anticipo — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 31 | VAR_PMOVIL | Lógico | Deshabilitar Pestaña de Consumos — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 32 | VAR | Lógico | Diferenciar Socios y Clientes por Código | clsSocios.GetIdSocio — RN.Titulares/clsSocios.cs:706 |
| 32 | VAR_PMOVIL | Entero (lista de opciones) | Habilitar Adhesión a Facturación Electrónica — opciones: No permitir; Permitir, solo mail; Permitir, mail y whatsapp — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 36 | VAR_PMOVIL | Entero | Cantidad límite de meses de antiguedad de los PDF para borrar — canal: CoopOnline | clsServicio_Procoop.BorrarPDF_Antiguos — RN.Varios.Generales/clsServicio_Procoop.cs:2065 |
| 46 | VAR_PMOVIL | Lógico | No subir cuentas sin servicios y sin deuda — canal: CoopOnline | clsWEB.SincronizarCuentas — RN.Titulares/clsWEB.cs:1494 |
| 50 | VAR | Texto | Parámetros para padrón de Titulares | clsPadronTitular.GuardarFiltros — RN.Titulares/clsPadronTitular.cs:550 |
| 54 | VAR | Lógico | Requerir Garantia al Ingresar Titulares | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 59 | VAR_PMOVIL | Lógico | Mostrar advertencia de no presentación de DDJJ en las cuentas — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 71 | VAR_PMOVIL | Lógico | Agrupar y ordenar las facturas en la web por vencimiento — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 73 | VAR | Lógico | El capital se suscribe Al facturar | clsCierreDiario.Capital — RN.Contabilidad/clsCierreDiario.cs:6597; clsCierreDiario.CapitalReserva — RN.Contabilidad/clsCierreDiario.cs:6707 |
| 73 | VAR_PMOVIL | Lógico | Ocultar observaciones en las ordenes de la web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 74 | VAR_PMOVIL | Fecha (texto) | Permitir descargar los PDF con el Integra apartir de una fecha específica — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 75 | VAR_PMOVIL | Lógico | Habilitar la carga de vehículos eléctricos — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 109 | VAR | Lógico | No exigir adherente titular | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 213 | VAR | Lógico | Exigir zona en alta de Suministro | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 240 | VAR | Numérico | Capital procesado por fecha de vencimiento. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 319 | VAR | Lógico | Controlar catastro en alta de servicios que informan a técnica. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 337 | VAR | Lógico | No Permitir Titulares dados de baja con Capital | clsSocios.PermiteDardeBaja — RN.Titulares/clsSocios.cs:956 |
| 340 | VAR | Lógico | Permitir Titulares dados de baja con Servicios | clsSocios.PermiteDardeBaja — RN.Titulares/clsSocios.cs:952; clsPMovil_Base.Sincroniza_Tablas — RN.Varios.PMovil/clsPMovil_Base.cs:187 |
| 343 | VAR | Lógico | Exigir referencia en alta de servicios. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 413 | VAR | Numérico (FK a tabla) | Concepto para Comision por baja de plan - Parámetros de Viviendas — FK `PROD_SER.COD_PRO` | clsViviendas.Validar_Configuracion — RN.Titulares/clsViviendas.cs:288; clsViviendas.Baja_Plan — RN.Titulares/clsViviendas.cs:1046 |
| 414 | VAR | Numérico | Porcentaje para comision por baja de Plan - Parámetros de Viviendas | clsViviendas.Validar_Configuracion — RN.Titulares/clsViviendas.cs:287; clsViviendas.Get_InfoPlan — RN.Titulares/clsViviendas.cs:543 |
| 415 | VAR | Numérico (FK a tabla) | Comprobante a Generar - Parámetros de Viviendas. — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 417 | VAR | Numérico (FK a tabla) | Texto para Transferencias de viviendas - Parámetros de Planes de viviendas — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 418 | VAR | Numérico (FK a tabla) | Texto para Bajas de viviendas - Parámetros de Planes de viviendas — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 419 | VAR | Numérico (FK a tabla) | Texto para cambios de planes - Parámetros de Planes de viviendas — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 422 | VAR | Mixto | Al transferir elimina servicio en cuenta de origen | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 427 | VAR | Lógico | No Permitir transferir cuenta con deuda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 573 | VAR | Entero (FK a tabla) | Servicio Principal — FK `SERVICIO.COD_SER` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 591 | VAR | Numérico | Tipo de Documento Para Personas Jurídicas | abm_Personas.abm_Personas — Cfg.Forms/abm_Personas.cs:321 |
| 592 | VAR | Numérico | Tipo de Documento Para Personas Físicas | abm_Personas.abm_Personas — Cfg.Forms/abm_Personas.cs:322 |
| 703 | VAR | Lógico | Exigir Conjunto en alta de Cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 734 | VAR | Lógico | NO permitir servicios en titulares NO activos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 737 | VAR | Texto | Código de Empresa en ERSEP | clsInformes_Consumos.Exportar_Archivo_ERSep — RN.Consumos/clsInformes_Consumos.cs:1708; clsInformes_Consumos.Get_InformeSecretariaEnergia — RN.Consumos/clsInformes_Consumos.cs:6302; CIR7021.Exportar_Venta — RN.Facturacion.Archivos/CIR7021.cs:28; (+10 más) |
| 741 | VAR | Lógico | No permitir Facturar a Titulares dados de baja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 744 | VAR | Entero (lista de opciones) | Controlar Teléfono en Administración de Cuentas y Administración de Personas — opciones: No Controlar, Ni Exigir; Controlar; Exigir — _obs: No Controlar, Ni Exigir_ | clsSocios.ValidarDatosCuenta — RN.Titulares/clsSocios.cs:1468; abm_Personas.ValidarControles — Cfg.Forms/abm_Personas.cs:953 |
| 745 | VAR | Entero (lista de opciones) | Controlar E-mail en Administración de Cuentas y Administración de Personas — opciones: No Controlar, Ni Exigir; Controlar; Exigir — _obs: No Controlar, Ni Exigir_ | clsSocios.ValidarDatosCuenta — RN.Titulares/clsSocios.cs:1469; abm_Personas.ValidarControles — Cfg.Forms/abm_Personas.cs:954 |
| 753 | VAR | Numérico (FK a tabla) | Concepto Asociado a Reserva de Capital — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 754 | VAR | Numérico (FK a tabla) | Comprobante para Reserva de Capital — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 757 | VAR | Lógico | Liquidar Percepciones de IIBB según RN 01/2017 (CBA) | Nucleo.lstVariables — CapaNucleo/Nucleo.cs:3017; clsFinanciacion.GetCuotas_SitIvaDistinto — RN.Cobranzas/clsFinanciacion.cs:435; frmLiquidacionPercepciones.Validar — Cfg.Forms.Herramientas/frmLiquidacionPercepciones.cs:84; (+1 más) |
| 758 | VAR | Numérico | Minimo Imponible IIBB | clsWeb_CoopOnline.ValidarImpuestos — Agente.Clases/clsWeb_CoopOnline.cs:2426; Nucleo.lstVariables — CapaNucleo/Nucleo.cs:3018; clsProcoop_Integra.ValidarImpuestos — RN.Varios.Generales/clsProcoop_Integra.cs:4306 |
| 759 | VAR | Numérico | Alícuota para No incluidos en el Archivo de Servicios Públicos | clsCuentas.ImportarIIBB_RN_012017 — RN.Servicios/clsCuentas.cs:788; clsCuentas.ImportarIIBB_BsAs — RN.Servicios/clsCuentas.cs:895; frmAlicuotaDeterminada.oCuenta_Change_IdSeleccionado — Cfg.Forms.Herramientas/frmAlicuotaDeterminada.cs:108; (+2 más) |
| 760 | VAR | Numérico | Alícuota para No incluidos en el Archivo de Otros Servicios | clsCuentas.ImportarIIBB_RN_012017 — RN.Servicios/clsCuentas.cs:789; frmAlicuotaDeterminada.oCuenta_Change_IdSeleccionado — Cfg.Forms.Herramientas/frmAlicuotaDeterminada.cs:109 |
| 800 | VAR | Mixto: Entero | WEB - Tipo Clave | GetDatosInforme.Get_Usuario_CoopOnline — RN.Titulares/clsInformes_Titulares.cs:3950; clsClientes_Externos.RegistrarTitular — RN.Varios.Generales/clsClientes_Externos.cs:253 |
| 801 | VAR | Mixto: Lógico | WEB - Enviar Ordenes de trabajo | Parametros.Parametros — RN.Titulares/clsWEB.cs:112 |
| 802 | VAR | Mixto: Lógico | WEB - Enviar Deuda | Parametros.Parametros — RN.Titulares/clsWEB.cs:111 |
| 803 | VAR | Mixto | WEB - Fecha Último Envío | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 804 | VAR | Mixto | WEB - Mail para Reclamos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 805 | VAR | Mixto: Texto/Entero | WEB - Hora y dias de envío | clsWEB.ValidarWebComputos — RN.Titulares/clsWEB.cs:2764; clsServicio_Procoop.SincronizarPWeb — RN.Varios.Generales/clsServicio_Procoop.cs:1208; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1984 |
| 808 | VAR | Mixto: Texto | WEB - Server | Parametros.Parametros — RN.Titulares/clsWEB.cs:79; clsServicio_Procoop.SincronizarPWeb — RN.Varios.Generales/clsServicio_Procoop.cs:1204; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1984 |
| 809 | VAR | Mixto: Texto | WEB - Usuario | Parametros.Parametros — RN.Titulares/clsWEB.cs:81; clsServicio_Procoop.SincronizarPWeb — RN.Varios.Generales/clsServicio_Procoop.cs:1204; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1984 |
| 810 | VAR | Mixto: Texto | WEB - Clave | Parametros.Parametros — RN.Titulares/clsWEB.cs:83; clsServicio_Procoop.SincronizarPWeb — RN.Varios.Generales/clsServicio_Procoop.cs:1204; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:1984 |
| 811 | VAR | Mixto: Texto | WEB - Base de datos | Parametros.Parametros — RN.Titulares/clsWEB.cs:85 |
| 812 | VAR | Mixto | WEB - Mail para Contactos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 829 | VAR | Lógico | Permite seleccionar los comprobantes para exportar a la Web | clsWEB.AgregarFiltrosFacturas — RN.Titulares/clsWEB.cs:1821; abm_comprob.ValidarExportarWebComprob — Cfg/Configuracion/abm_comprob.cs:503 |
| 912 | VAR_PMOVIL | Texto | Texto para mostrar en la Web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 913 | VAR_PMOVIL | Lógico | Mostrar solo comprobantes adeudados — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2030 | VAR | Entero | Distrito | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2031 | VAR | Entero | Zona de Facturacion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2032 | VAR | Entero | Sector de Facturacion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2033 | VAR | Entero | Recorrido de Facturacion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2050 | VAR | Lógico | Servicio valida Factibilidad existente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2077 | VAR | Lógico | Permite Duplicar Documento en Personas. | clsSocios.Existe_TitularDocumento — RN.Titulares/clsSocios.cs:876; clsSocios.PermiteDNIDuplicado — RN.Titulares/clsSocios.cs:891; abm_Personas.txtCuit_Leave — Cfg.Forms/abm_Personas.cs:676 |
| 2250 | VAR | Lógico | Permitir servicios con Matricula duplicada | clsSocios.ValidarServicio — RN.Titulares/clsSocios.cs:2608; clsSocios.Existe_MatriculaEnSersoc — RN.Titulares/clsSocios.cs:2755 |
| 2269 | VAR | Lógico | Permitir Cargar servicios medidos iguales en una misma cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2281 | VAR | Texto | Permite indicar las descripciones a mostrar para la nomenclatura catastral — _obs: El valor por defecto es Cod\|Sec\|Man\|Par\|PH\|Lote_ | clsInformes_Titulares.DatosCatastrales — RN.Titulares/clsInformes_Titulares.cs:6138; BuscadorInfoSocio.ConsultaTitular_Load — Cfg.ControlesProcoopNet/BuscadorInfoSocio.cs:260; abm_Propieda.abm_Propieda — Cfg.Forms/abm_Propieda.cs:305; (+3 más) |
| 2285 | VAR | Lógico | Exigir Distrito y Sección en cuenta Principal | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2286 | VAR | Lógico | No utilizar Guardado rápido | clsSocios.Guardar_SUMSOC — RN.Titulares/clsSocios.cs:1169; clsSocios.Guardar_SERSOC — RN.Titulares/clsSocios.cs:2911 |
| 2290 | VAR | Lógico | Permitir Asignar bonificación de consumo por suministro | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2291 | VAR | Entero (lista de opciones) | Modo de transferencia de adherentes y beneficiarios al transferir servicio — opciones: Dar de baja al Transferir; Mantener estado al transferir; Eliminar al transferir — _obs: Dar de baja al Transferir_ | clsSocios.Transferir_Adherentes — RN.Titulares/clsSocios.cs:3470; clsSocios.Transferir_Beneficiarios — RN.Titulares/clsSocios.cs:3496 |
| 2301 | VAR | Lógico | Permitir reconexión de servicios a titulares fallecidos. | clsTecnica.Validar_OrdenTrabajo_Reconexion — RN.Tecnica/clsTecnica.cs:2969 |
| 2303 | VAR | Lógico | Permitir marcar servicios para No Facturar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2309 | VAR | Lógico | Validar Permiso de Carga de Calle | txtCalles.txtCalles_Leave — Cfg.ControlesProcoopNet/txtCalles.cs:73 |
| 2312 | VAR | Entero (FK a tabla) | Situación de Ingresos Brutos por defecto en cuentas — FK `SITIBR.COD_SIT` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2314 | VAR | Texto | Permite indicar las descripciones para mostrar en los movimientos de Capital — _obs: El valor por defecto es Vendido\|Facturado\|Pagado_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2316 | VAR | Lógico | Permite dar de baja servicios con cuotas relacionadas... | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2320 | VAR | Lógico | Utilizar nomenclatura catastral numerica | abm_Propieda.abm_Propieda — Cfg.Forms/abm_Propieda.cs:315; frmSeleccionarInmueble.frmSeleccionarInmueble — Cfg.Forms/frmSeleccionarInmueble.cs:132 |
| 2321 | VAR | Lógico | Mostrar por defecto solo servicios activos en Adm. de titulares | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2324 | VAR | Lógico | Impedir cargar socios sin cuentas asociadas | clsSocios.TransferirCuenta — RN.Titulares/clsSocios.cs:1295 |
| 2329 | VAR | Lógico | Permite ingresar la Via de Ingreso en ALTAS y RETIRO DE MEDIDOR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2330 | VAR | Entero (FK a tabla) | Operación Técnica por cambio de Categoria en servicio — FK `TRANSAC.COD_TRAN` | clsFacturacionServicio.CargarCacheOtsCambioCategoria — RN.Facturacion/clsFacturacionServicio.cs:2217; clsSitsa.ConfirmarOT — RN.Tecnica/clsSitsa.cs:181; clsTecnica.PreSave_TECNICA — RN.Tecnica/clsTecnica.cs:992; (+13 más) |
| 2343 | VAR | Entero (lista de opciones) | Validar número de certificado en la carga de un nuevo servicio — opciones: No exigir, ni Preguntar; Advertir; Exigir — _obs: No exigir, ni Preguntar_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2373 | VAR | Lógico | Autocompletar Distrito al ingresar seccion en el administrador de cuentas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2374 | VAR | Lógico | Exigir que los titulares tengan cuenta principal | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2396 | VAR | Mixto: Texto | WEB - Zona para subir | clsCirculares.GetDatosCuentasSinDatos — RN.Titulares/clsCirculares.cs:2261; clsWEB.SincronizarTitulares — RN.Titulares/clsWEB.cs:1445; clsWEB.SincronizarCuentas — RN.Titulares/clsWEB.cs:1488; (+8 más) |
| 2397 | VAR | Mixto: Texto | WEB - Email aviso sincronización | clsWEB.IniciarProceso — RN.Titulares/clsWEB.cs:271 |
| 2400 | VAR | Lógico | Permite dar de alta adherente que ya existe en un mismo servicio | clsWeb_CoopOnline.GetInfoAdherente — Agente.Clases/clsWeb_CoopOnline.cs:736 |
| 2401 | VAR | Lógico | Consultar el alta de los adherentes al reconectar un servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2408 | VAR | Entero | Codigo de Partido para exportador de Tarifa Social OCEBA | clsInformes_Titulares.ExportarOCEBA_Facturacion — RN.Titulares/clsInformes_Titulares.cs:8700; clsTarifaSocial.Export_OCEBA265 — RN.Titulares/clsTarifaSocial.cs:628; clsTarifaSocial.Export_OCEBA_NIS — RN.Titulares/clsTarifaSocial.cs:687 |
| 2428 | VAR | Texto | Fecha Limite de Alta de Titular para asistencia a la Asamblea | GetDatosInforme.Imprimir_AsistenciaAsamblea — RN.Titulares/clsInformes_Titulares.cs:4045; clsPadronTitular.Get_Padron2 — RN.Titulares/clsPadronTitular.cs:952; clsPadronTitular.Get_Padron — RN.Titulares/clsPadronTitular.cs:1511 |
| 2429 | VAR | Texto | Fecha de la Próxima Asamblea — _obs: Esta variable permite emitir el Padrón teniendo en cuenta la fecha de la Próxima Asamblea en el listado de Deuda de Capital_ | GetDatosInforme.Imprimir_AsistenciaAsamblea — RN.Titulares/clsInformes_Titulares.cs:4046; clsPadronTitular.Get_Padron2 — RN.Titulares/clsPadronTitular.cs:958; clsPadronTitular.Get_Padron — RN.Titulares/clsPadronTitular.cs:1517; (+2 más) |
| 2430 | VAR | Lógico | Permitir solo Titulares para la asistencia a la Asamblea | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2434 | VAR | Lógico | No Mostrar Vista Previa de Comprobantes generados en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2435 | VAR | Lógico | Seleccionar Automáticamente el Estado Principal del Servicio al dar de alta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2455 | VAR | Lógico | Realizar Cambio de Categoría desde Administración de Titulares | clsSocios.AltasAutomaticas — RN.Titulares/clsSocios.cs:1952 |
| 2460 | VAR | Mixto: Lógico | WEB - Mantener Teléfono y Correo Web | clsWEB.SincronizarCuentas — RN.Titulares/clsWEB.cs:1510 |
| 2461 | VAR | Lógico | Actualizar Domicilio de los servicios al Modificar el Domicilio de la Cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2462 | VAR | Lógico | Solicitar siempre Propiedades en el alta — _obs: Solicitar Propiedad al dar de alta un servicio, y no permitir modificarlo en la orden de trabajo_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2463 | VAR | Mixto: Lógico | WEB - Ruta accesible desde el servidor | frm_VisorMensajes.EnviarMail — Cfg.Forms/frm_VisorMensajes.cs:558 |
| 2464 | VAR | Entero | Zona de lectura — _obs: Agrega una Zona de lectura por defecto en el momento del Alta de servicios medidos_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2469 | VAR | Lógico | Validar Garantía al Ingresar Socios | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2477 | VAR | Entero (lista de opciones) | Descripción de lectura para Administración de Servicio — opciones: HP; kVA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2482 | VAR | Lógico | Validar Deuda del Domicilio y Propiedad Catastral | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2490 | VAR | Entero (lista de opciones) | Exigir teléfono y Mail, en Administración de Cuentas y Persona — opciones: No Exigir; En Alta; Siempre — _obs: No Exigir_ | clsSocios.ValidarDatosCuenta — RN.Titulares/clsSocios.cs:1463; abm_Personas.ValidarControles — Cfg.Forms/abm_Personas.cs:937 |
| 2506 | VAR | Entero (lista de opciones) | Control de Empresa Postal en Administración de Cuentas — opciones: No Preguntar, Ni Exigir; Preguntar; Exigir — _obs: No Preguntar, Ni Exigir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2507 | VAR | Lógico | Exigir Vía de ingreso al generar ordenes de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2509 | VAR | Lógico | Asignar Acción a ejecutar en tramites | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2020; frmPTramites.frm_PTramites_Load — Cfg.Forms.Funcionalidades/frmPTramites.cs:208 |
| 2521 | VAR | Lógico | Permitir dar de baja Adherentes Repetidos — _obs: Esta variable permite que, si se carga un adherente que ya se encuentra vinculado a un Titular, el sistema consulte si desea dar de baja dicho adherente de dich_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2522 | VAR | Lógico | Controlar impresión del formulario en la Desconexión de un Servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2527 | VAR | Texto | Edades mínimas y máximas para un donante — _obs: Las edades mínimas y máximas deben estár separadas por \";\". Solo se permiten dos valores, en caso de ser más valores ó separados por otro caracter, se tomará _ | abm_Personas.abm_Personas2__ValidFields — Cfg.Forms/abm_Personas.cs:341 |
| 2529 | VAR | Lógico | No exigir profesional y fecha de certificado en alta de servicios — _obs: Solo se valida cuando se ingresa un número de certificado_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2532 | VAR | Lógico | Consultar si desea imprimir contrato de alta de servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2534 | VAR_PMOVIL | Lógico | Sincronizar facturas adeudadas subidas al MySql — canal: CoopOnline | clsWEB.SincronizarPagos — RN.Titulares/clsWEB.cs:2081 |
| 2535 | VAR | Lógico | Consultar si desea imprimir informe de baja de servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2540 | VAR | Entero | Valor por defecto en Digitos de Medidor al dar de alta un servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2541 | VAR | Lógico | Marcar al servicio histórico como “No Vigente” al realizar la transferencia | clsSocios.TransferirServicio — RN.Titulares/clsSocios.cs:3351 |
| 2544 | VAR | Entero (lista de opciones) | Control de Garante en Administración de Cuenta — opciones: No Controlar, Ni Exigir; Controlar; Exigir — _obs: No Controlar, Ni Exigir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2545 | VAR | Lógico | Controlar Deuda Adherentes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2550 | VAR | Entero (lista de opciones) | Administrar Consumos de Servicios dados de baja — opciones: No Permitir; Controlar; Permitir — _obs: No Permitir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2552 | VAR | Lógico | Permitir realizar transferencias de Cuenta a Socios Dados de Baja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2556 | VAR | Lógico | Mostrar número de comprobante en consulta de consumo con formato simple | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2557 | VAR | Lógico | Mostrar observación del servicio en Administración de Titulares — _obs: Si esta variable está configurada, se mostrará la observación del servicio junto a la descripción del mismo, en la grilla donde se muestran los servicios contra_ | DetalleServicio.ClaseBase — RN.Servicios/clsCuentas.cs:241; clsConsultaInfoSocio.GetDatosSersoc — RN.Titulares/clsConsultaInfoSocio.cs:207 |
| 2558 | VAR | Entero (lista de opciones) | Control de la fecha en Movimientos de Tesorería y Bancos, con la fecha del servidor — opciones: No Controlar, Ni Exigir; Controlar; Exigir — _obs: No Controlar, Ni Exigir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2563 | VAR | Entero (lista de opciones) | Mostar Localidad en el formulario de Busqueda de Recorrido — opciones: No; Si; Solo Recorrido de Factura; Solo Recorrido de Lectura | frmBusquedaRecorridos.LoadGrid — Cfg.Forms/frmBusquedaRecorridos.cs:177 |
| 2571 | VAR | Lógico | Informar Si el Titular sin Servicios es Adherente,Beneficiario o Garante — _obs: Cuando se desconecte un servicio se controlará, si el socio ya no tiene servicios contratados, si está como adherente,garante o beneficiario_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2575 | VAR | Numérico (FK a tabla) | Concepto Asociado a Rescate de Acciones — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2576 | VAR | Numérico (FK a tabla) | Comprobante para Rescate de Acciones — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2580 | VAR | Entero (FK a tabla) | Contrato Asociado a Solicitud de baja de Titular — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2581 | VAR | Entero (FK a tabla) | Servicio correspondiente a Dispenser — FK `SERVICIO.COD_SER` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2582 | VAR | Numérico | Limite diario para retirar agua del dispenser — _obs: Cantidad de Litros_ | clsDispenser.Get_Sersoc — RN.Varios.Generales/clsDispenser.cs:194 |
| 2583 | VAR | Entero | Días para calculo de Deuda | clsDispenser.Get_Sersoc — RN.Varios.Generales/clsDispenser.cs:186 |
| 2584 | VAR | Numérico | Cantidad de litros por Atención | clsDispenser.Get_Sersoc — RN.Varios.Generales/clsDispenser.cs:195; clsDispenser.Exedente_ConsumoMensual — RN.Varios.Generales/clsDispenser.cs:230 |
| 2588 | VAR | Lógico | Solicitar cambio de contraseña cuando inicie sesión un usuario con clave genérica | frmLogin.cmdAceptar_Click — PN/Procoop/frmLogin.cs:121 |
| 2591 | VAR | Lógico | Cargar nuevo socios como NO ACTIVOS por defecto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2599 | VAR | Lógico | Permitir transferir servicios dados de baja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2602 | VAR | Entero | Codigo de Localidad para exportador de Facturacion OCEBA | clsInformes_Titulares.ExportarOCEBA_Facturacion — RN.Titulares/clsInformes_Titulares.cs:8701 |
| 2606 | VAR | Numérico | Valor a partir del cual se considera que posee Deuda de Capital | clsPadronTitular.Get_Padron2 — RN.Titulares/clsPadronTitular.cs:658; clsPadronTitular.Get_Padron — RN.Titulares/clsPadronTitular.cs:1267; clsSocios_Capital.TieneDeudaCapital — RN.Titulares/clsSocios_Capital.cs:416 |
| 2608 | VAR | Lógico | Obtener el padrón de Titulares con la versión anterior | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2610 | VAR | Lógico | Cargar Vista simple en formulario de titulares | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2616 | VAR | Texto | Fecha de la Próxima Asamblea para el Titulo del Padrón — _obs: Esta variable se debe configurar si se desea mostrar la Fecha de la Asamblea en el título del Padrón_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2623 | VAR | Lógico | Permitir cargar débito automático sin exigir los demás datos del débito | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2633 | VAR | Lógico | Permitir dar de baja a socios sin cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2636 | VAR | Lógico | El capital se suscribe en la afiliacion | clsCierreDiario.GenerarAsientoCapital — RN.Contabilidad/clsCierreDiario.cs:6579; clsCierreDiario.Capital — RN.Contabilidad/clsCierreDiario.cs:6598; clsCierreDiario.CapitalReserva — RN.Contabilidad/clsCierreDiario.cs:6708 |
| 2642 | VAR | Lógico | Permitir marcar “Enviar Factura Electrónica” automáticamente en las cuentas | abm_Servicio.ConfigurarForm — Cfg.Forms/abm_Servicio.cs:674 |
| 2660 | VAR | Lógico | Permitir indicar número de Titular manualmente para Titulares Activos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2668 | VAR | Lógico | Validar Deuda del Domicilio y Propiedad Catastral (Pregunta) | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2669 | VAR | Lógico | Validar Deuda Vencida del Domicilio y Propiedad Catastral | clsSocios_Capital.Validar_DeudaDomicilio — RN.Titulares/clsSocios_Capital.cs:229 |
| 2673 | VAR | Lógico | Tener en cuenta campo ACTIVOBAJA para la alta de socios | clsSocios.GetIdSocio — RN.Titulares/clsSocios.cs:708 |
| 2675 | VAR | Lógico | WEB - No sincronizar PDF de Guía Telefónica | clsWEB.SincronizarPdfGuiaTelefonica — RN.Titulares/clsWEB.cs:1620 |
| 2676 | VAR | Texto | Separador de datos en el lector de DNI | frmEscanerCodigoDNI.txtCodigoBarra_EditValueChanged — Cfg.Forms.Herramientas/frmEscanerCodigoDNI.cs:122 |
| 2689 | VAR | Fecha (texto) | Utilizar sincronización por webservice — _obs: Debe indicar la fecha desde la cual quiere sincronizar..._ | clsWEB.IniciarProceso — RN.Titulares/clsWEB.cs:242; clsWEB.SincronizarFacturas — RN.Titulares/clsWEB.cs:1676 |
| 2693 | VAR | Lógico | Enviar SMS con el Sistema de P10 SMS | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:251; clsTecnica.SendSMS — RN.Tecnica/clsTecnica.cs:3470; clsMensaje.GuardarSms — RN.Telefonia/clsMensaje.cs:229; (+8 más) |
| 2696 | VAR | Texto | Url del WebService para envio de SMS | clsServicio_Procoop.EnviarSMS — RN.Varios.Generales/clsServicio_Procoop.cs:543; clsServicio_Procoop.RegistrarWSP_WS — RN.Varios.Generales/clsServicio_Procoop.cs:1050 |
| 2707 | VAR | Lógico | Actualizar la Fecha de Alta al reconectar un Servicio No Medido en el mismo mes de la desconexión | clsSocios.Reconectar_SERSOC — RN.Titulares/clsSocios.cs:2498 |
| 2710 | VAR | Lógico | Validar Mismo Domicilio para el servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2711 | VAR | Entero | Identificador de Empresa Eléctrica | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2845; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3130 |
| 2715 | VAR | Lógico | Permitir Cargar servicios no medidos iguales en una misma cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2716 | VAR | Lógico | Permitir reservar capital mayor al importe pagado(integrado) | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2717 | VAR | Entero | Columna de Categoria en archivo de segmentacion de Energia | clsSegmentacion.Importar_Energia — RN.Titulares/clsSegmentacion.cs:399; clsSegmentacion.Importar_Energia_RASE — RN.Titulares/clsSegmentacion.cs:597; clsSegmentacion.ImportarEnergia_BSAS — RN.Titulares/clsSegmentacion.cs:800 |
| 2718 | VAR | Entero (lista de opciones) | Formato de exportación de archivo de usuarios de Energia — opciones: General; Córdoba; EPRE; BS AS - NIS — _obs: General_ | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2844; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3129 |
| 2724 | VAR | Entero | Columna de Categoria en archivo de segmentacion de Gas | clsSegmentacion.Importar_Gas — RN.Titulares/clsSegmentacion.cs:1331 |
| 2738 | VAR | Lógico | Exigir grupo contable en alta de cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2740 | VAR | Lógico | No permitir dos conexiones en un asociado con categorias sociales de un mismo servicio | clsSegmentacion.Recategorizar — RN.Titulares/clsSegmentacion.cs:1622; clsSocios.ValidarServicio — RN.Titulares/clsSocios.cs:2674 |
| 2744 | VAR | Lógico | Mostrar Observaciones de cuenta en la busqueda de titulares | clsSocios.GetGridView_Consulta — RN.Titulares/clsSocios.cs:5155; frmSeleccionar_InfoSocios.frmSeleccionar_InfoSocios_Load — Cfg.Forms/frmSeleccionar_InfoSocios.cs:251 |
| 2745 | VAR | Lógico | Máximo de caracteres Permitidos para enviós de Sms | frmPlantillaEditor.richEditControl1_ContentChanged — Cfg.Forms/frmPlantillaEditor.cs:806 |
| 2748 | VAR | Entero (lista de opciones) | Formato de exportación de archivo EPRE — opciones: EPRE; EPRE (06 y 07 MEyM) | clsTarifaSocial.Export_EPRE — RN.Titulares/clsTarifaSocial.cs:521 |
| 2749 | VAR | Lógico | Permitir columnas repitidas en informe de consumos agrupados por tramas y categorías | clsInformes_Consumos.Validar_Informe — RN.Consumos/clsInformes_Consumos.cs:3102 |
| 2753 | VAR | Lógico | Asignar estado no vigente al eliminar OT de alta | clsTecnica.PreDelete_TECNICA — RN.Tecnica/clsTecnica.cs:517 |
| 2755 | VAR | Numérico | Día límite de facturación para cobrar proporcional por cambio de categoría | clsTecnica.PreSave_TECNICA — RN.Tecnica/clsTecnica.cs:1427 |
| 2781 | VAR | Lógico | Permitir seleccionar contratos para imprimir | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2782 | VAR | Lógico | Conceptos a cobrar por transferencia de servicio a cuenta destino | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2785 | VAR | Fecha (texto) | Fecha de Cierre de Capital | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5362; frmOpcionesEspeciales.frmOpcionesEspeciales_Load — Cfg.Forms.Funcionalidades/frmOpcionesEspeciales.cs:97 |
| 2792 | VAR | Entero (FK a tabla) | Tipo de Factura para el Rescate de Acciones — FK `TIPO_FAC.COD_TPFC` | clsSocios_Capital.Rescate_Acciones — RN.Titulares/clsSocios_Capital.cs:661 |
| 2797 | VAR | Numérico | Consumo medio para recategorización | clsSegmentacion.Importar_Energia — RN.Titulares/clsSegmentacion.cs:492 |
| 2817 | VAR | Entero | WEB - Eliminar archivos antiguos en carpeta subidos | clsWEB.EliminarSubidasAnteriores — RN.Titulares/clsWEB.cs:1119 |
| 2821 | VAR | Lógico | Permitir establecer cargos fijos por trama desde tarifas | clsFacturacionServicio.GetImporteCF — RN.Facturacion/clsFacturacionServicio.cs:1930; abm_Servicio_Cattarif.abm_Servicio_Cattarif_Load — Cfg.Forms/abm_Servicio_Cattarif.cs:237; abm_Servicio_Cattarif.chkCargoFijo_CheckedChanged — Cfg.Forms/abm_Servicio_Cattarif.cs:342 |
| 2823 | VAR | Texto | Código de distribuidora OCEBA | clsInformes_Consumos.EditarExcelPlanillaDDJJ_Oceba — RN.Consumos/clsInformes_Consumos.cs:4998; GetDatosInforme.ExportarCSV_OCEBA — RN.Contabilidad/clsInformes_Contabilidad.cs:980; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3133; (+5 más) |
| 2824 | VAR | Entero (lista de opciones) | Número destino de SMS/WhatsApp — opciones: Registrados desde Cooponline; Registrados en el titular; Enviar a ambos teléfonos móviles — _obs: Registrados desde Cooponline_ | Correspondencia.GetDestino_NumeroDestinoSMS — RN.Configuraciones.Plantillas/Correspondencia.cs:129; Cobranza.GetDestino_NumeroDestinoSMS — RN.Configuraciones.Plantillas/Correspondencia.cs:200; Servicio.GetDestino_NumeroDestinoSMS — RN.Configuraciones.Plantillas/Correspondencia.cs:273; (+6 más) |
| 2825 | VAR | Lógico | Incluir servicios desconectados en la importación de archivos de segmentación | clsSegmentacion.Importar — RN.Titulares/clsSegmentacion.cs:270; clsSegmentacion.Importar_Energia — RN.Titulares/clsSegmentacion.cs:475; clsSegmentacion.Importar_Energia_RASE_NIS — RN.Titulares/clsSegmentacion.cs:782; (+4 más) |
| 2830 | VAR | Lógico | Informar COD_SOC en archivo de segmentación | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2877; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3199 |
| 2832 | VAR | Entero (FK a tabla) | Producto cargo fijo - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3941; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4198 |
| 2833 | VAR | Entero (FK a tabla) | Producto subsidio - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3946; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4199 |
| 2834 | VAR | Texto | Productos impuestos - OCEBA — _obs: Valores separados por coma (Ej:1,2,3)_ | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3951; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4180 |
| 2835 | VAR | Texto | Código OCEBA distribuidora, declaración jurada mensual | clsInformes_Consumos.Editar_ExcelOCEBA — RN.Consumos/clsInformes_Consumos.cs:4971 |
| 2837 | VAR | Entero (FK a tabla) | Producto potencia pico - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3956; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4200; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4281 |
| 2838 | VAR | Entero (FK a tabla) | Producto potencia fuera de pico - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3961; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4201; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4282 |
| 2839 | VAR | Entero (FK a tabla) | Producto demanda pico - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3966; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4202; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4283 |
| 2840 | VAR | Entero (FK a tabla) | Producto demanda resto - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3971; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4203; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4284 |
| 2841 | VAR | Texto | Productos energia valle - OCEBA — _obs: Valores separados por coma (Ej:1,2,3)_ | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3976; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4183; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4287 |
| 2842 | VAR | Entero (FK a tabla) | Producto demanda fuera de pico - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3981; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4204 |
| 2843 | VAR | Entero (lista de opciones) | Campo a buscar en archivo de segmetanción (la búsqueda se realizará solamente por este campo) — opciones: Ninguno; COD_SUM; ID_SERSOC — _obs: Ninguno_ | clsSegmentacion.Importar_Energia — RN.Titulares/clsSegmentacion.cs:443 |
| 2844 | VAR | Entero (FK a tabla) | Producto pérdida por transformador - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3986; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4205 |
| 2845 | VAR | Entero (FK a tabla) | Producto coseno de fi - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3991; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4206 |
| 2846 | VAR | Texto | Productos bonificación - OCEBA — _obs: Valores separados por coma (Ej:1,2,3)_ | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:3996; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4181 |
| 2847 | VAR | Entero (FK a tabla) | Producto exceso potencia fuera de pico- OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4001; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4207 |
| 2848 | VAR | Entero (FK a tabla) | Producto exceso potencia pico - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4006; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4208 |
| 2849 | VAR | Entero (FK a tabla) | Producto exceso energia reactiva - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4011; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4209 |
| 2850 | VAR | Numérico | Porcentaje a destinar al cargo fijo - OCEBA | clsInformes_Consumos.EditarExcelPlanillaDDJJ_Oceba — RN.Consumos/clsInformes_Consumos.cs:5029 |
| 2851 | VAR | Numérico (FK a tabla) | Categoria de servicio para generar archivo de cuadro tarifario - RASE — FK `CATE_SER.COD_CATSER` | clsCirculares.Get_CuadroTarifario_Rase — RN.Titulares/clsCirculares.cs:3435 |
| 2852 | VAR | Lógico | Generar archivo de cuadro tarifario - RASE | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2842; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3127 |
| 2853 | VAR | Entero | Cantidad de lineas en archivo de CT - RASE | clsCirculares.GenerarCuadroTarifario — RN.Titulares/clsCirculares.cs:3401; clsCirculares.Get_CuadroTarifario_Rase — RN.Titulares/clsCirculares.cs:3436 |
| 2855 | VAR | Lógico | Registrar capital a través del agente | clsFacturacionMasiva.GenerarFacturacion — RN.Facturacion/clsFacturacionMasiva.cs:705; clsSocios_Capital.Guardar_CAPITAL — RN.Titulares/clsSocios_Capital.cs:54; clsSocios_Capital.Guardar_CAPITAL_CompVen — RN.Titulares/clsSocios_Capital.cs:89; (+5 más) |
| 2858 | VAR | Lógico | Búsqueda por COD_SUM y DNI en importación de tarifa social | clsTarifaSocial.Importar_Energia_LIA — RN.Titulares/clsTarifaSocial.cs:1422 |
| 2859 | VAR | Lógico | Generar archivos de Secretaría de Energía en formato .xlsx | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2868 | VAR | Entero (FK a tabla) | Producto energía inyectada - OCEBA — FK `PROD_SER.COD_PRO` | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4016; clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4285 |
| 2875 | VAR | Lógico | Informe de consumos agrupados por tramas y categorías - coincidir total con detalle | clsConsumosTramasCategorias.Get_Informe_DetallesFilas — RN.Consumos/clsConsumosTramasCategorias.cs:214; clsConsumosTramasCategorias.ExportarExcel_DetalleConceptos — RN.Consumos/clsConsumosTramasCategorias.cs:646 |
| 2884 | VAR | Lógico | Permitir editar contenido de plantillas en envios unitarios | frm_VisorMensajes.frm_VisorMensajes_Load — Cfg.Forms/frm_VisorMensajes.cs:214 |
| 2887 | VAR | Lógico | Archivo Subsidio VAD Oceba - Informar periodo distinto al de facturación | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2889 | VAR | Lógico | Archivo Subsidio VAD Oceba - Informar mes de fecha emision como periodo | clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular — RN.Titulares/clsCirculares.cs:3911 |
| 2892 | VAR | Lógico | Permitir la posibilidad de calcular/actualizar precio de producto en el presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2894 | VAR | Entero | Persona por defecto al crear un nuevo presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2898 | VAR | Texto | Productos bonificación electrodependiente - OCEBA — _obs: Valores separados por coma (Ej:1,2,3)_ | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4021; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4182 |
| 2900 | VAR | Lógico | Selecciona Grupo de Obra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2904 | VAR | Texto | Mail por defecto para copia oculta en envios masivos | frm_VisorMensajes.frm_VisorMensajes_Load — Cfg.Forms/frm_VisorMensajes.cs:212 |
| 2918 | VAR | Lógico | Visualizar dirección postal y domicilio completo en ABM de titulares | clsCuentas.GetDescripcion — RN.Servicios/clsCuentas.cs:726 |
| 2923 | VAR | Lógico | Utilizar importador ARBA para Percepciones y Retenciones de ATER (RN 208/24 y 234/24) | clsCuentas.ImportarIIBB_BsAs — RN.Servicios/clsCuentas.cs:870; frmLiquidacionPercepciones_BsAs.? — Cfg.Forms.Herramientas/frmLiquidacionPercepciones_BsAs.cs:18 |
| 2927 | VAR | Lógico | Utilizar N° NIS como identificar en archivos de tarifa social y segmentación | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2934 | VAR | Lógico | Formato solo números para los teléfonos en Titulares | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2937 | VAR | Texto | Razón social de distribuidora para archivo Res SE Nº431/24 | clsInformes_Consumos.EditarPlanillaRes_431_24 — RN.Consumos/clsInformes_Consumos.cs:5564; clsInformes_Consumos.EditarPlanillaRes_65_25 — RN.Consumos/clsInformes_Consumos.cs:5609; clsCirculares.GenerarXlsxCompensacion — RN.Titulares/clsCirculares.cs:3662; (+1 más) |
| 2938 | VAR | Lógico | Generar archivo de consumos - RASE | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2843; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3128 |
| 2941 | VAR | Lógico | Exigir fecha de nacimiento o fecha de alta en ABM de personas | abm_Personas.ValidarControles — Cfg.Forms/abm_Personas.cs:934 |
| 2945 | VAR | Lógico | OCEBA - Utilizar NIS como identificador de suministros | clsCirculares.GenerarArchivoClientesOceba — RN.Titulares/clsCirculares.cs:3800; clsCirculares.GenerarArchivoFacturacionOCEBA — RN.Titulares/clsCirculares.cs:3855; clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular — RN.Titulares/clsCirculares.cs:3912 |
| 2946 | VAR | Lógico | Búsqueda por Número de medidor y DNI en importación de tarifa social | clsTarifaSocial.Importar_Energia_LIA — RN.Titulares/clsTarifaSocial.cs:1422 |
| 2948 | VAR | Lógico | 544 OCEBA - (NO DESARROLLADO) Informar consumos bimestrales | clsInformes_Consumos.CompletarPlanillaDDJJ — RN.Consumos/clsInformes_Consumos.cs:3841 |
| 2950 | VAR | Lógico | MIS PAGOS - No exportar archivo de alta de cbu | E_Credicoop.Exportar — RN.Cobranzas.Entidades.ANI/E_Credicoop.cs:40 |
| 2961 | VAR | Numérico | Tarifa Social - Columna NIS en modelo de importación OCEBA(NIS) | clsTarifaSocial.Importar_Energia_OCEBA_NIS — RN.Titulares/clsTarifaSocial.cs:1542 |
| 2962 | VAR | Numérico | OCEBA - Porcentaje coseno de fi T2 | clsInformes_Consumos.GetConceptosFacturadosYCalculados — RN.Consumos/clsInformes_Consumos.cs:3889; clsInformes_Consumos.EditarExcelPlanillaDDJJ_Oceba — RN.Consumos/clsInformes_Consumos.cs:5030 |
| 2963 | VAR | Numérico | OCEBA - Porcentaje coseno de fi T3 | clsInformes_Consumos.GetConceptosFacturadosYCalculados — RN.Consumos/clsInformes_Consumos.cs:3894; clsInformes_Consumos.EditarExcelPlanillaDDJJ_Oceba — RN.Consumos/clsInformes_Consumos.cs:5031 |
| 2964 | VAR | Lógico | Tarifa Social - Busqueda por número de NIS en modelo de importación Energia OCEBA Segmentado | clsTarifaSocial.Importar_Energia_OCEBA_Segmentado — RN.Titulares/clsTarifaSocial.cs:1598 |
| 2965 | VAR | Entero | Tarifa Social - Columna número de NIS en modelo de importación Energia OCEBA Segmentado | clsTarifaSocial.Importar_Energia_OCEBA_Segmentado — RN.Titulares/clsTarifaSocial.cs:1600 |
| 2968 | VAR | Lógico | Agrupar por TIP_ENE en informe de consumos agrupados por tramas y categorías | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2974 | VAR | Lógico | Informar consumos mensuales en archivo Res SE N°431/24 | clsInformes_Consumos.EditarPlanillaRes_431_24 — RN.Consumos/clsInformes_Consumos.cs:5567 |
| 2976 | VAR | Entero | Columna de numero de medidor en archivo de segmentacion de Energia BS.AS | clsSegmentacion.ImportarEnergia_BSAS — RN.Titulares/clsSegmentacion.cs:801 |
| 2979 | VAR | Lógico | Alertar si el  CUIT de la persona no es correcto al confirmar ABM de titulares | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2986 | VAR | Texto | Archivo de consumos RASE - Productos para el calculo del subsidio — _obs: Valores separados por coma (Ej:1,2,3)_ | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2984; clsCirculares.EscribirLineaConsumo — RN.Titulares/clsCirculares.cs:3329 |
| 3011 | VAR | Numérico (FK a tabla) | OCEBA Control 544 - Concepto de Ley 5.5% — FK `IMPUESTO.COD_IMP` | clsInformes_Consumos.ChequeosPrevios544 — RN.Consumos/clsInformes_Consumos.cs:3872; clsInformes_Consumos.GetConceptosFacturadosYCalculados — RN.Consumos/clsInformes_Consumos.cs:3888 |
| 3012 | VAR | Numérico (FK a tabla) | OCEBA Control 544 - Concepto de Ley 3.5 — FK `IMPUESTO.COD_IMP` | clsInformes_Consumos.ChequeosPrevios544 — RN.Consumos/clsInformes_Consumos.cs:3872; clsInformes_Consumos.GetConceptosFacturadosYCalculados — RN.Consumos/clsInformes_Consumos.cs:3893 |
| 3013 | VAR | Texto | Archivo de usuarios y suministros électricos - Productos a informar en columna sin impuestos — _obs: Valores separados por coma (Ej:1,2,3)_ | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx — RN.Titulares/clsCirculares.cs:2857; clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales — RN.Titulares/clsCirculares.cs:3183 |
| 3014 | VAR | Entero | Archivo clientes y facturación oceba: Cantidad de caracteres en columna de identificador | clsCirculares.GenerarArchivoClientesOceba — RN.Titulares/clsCirculares.cs:3801; clsCirculares.GenerarArchivoFacturacionOCEBA — RN.Titulares/clsCirculares.cs:3856 |
| 3017 | VAR | Texto | OCEBA 544 - Códigos de impuestos de leyes a facturar — _obs: Valores separados por coma (Ej:1,2,3)_ | clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4184 |
| 3022 | VAR | Lógico | Consumos agrupados por tramas y categorias - Agrupar consumos por periodo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3027 | VAR | Lógico | Informar capital anterior en registro de asociados | clsPadronTitular.Get_Informe_RegistroAsociados — RN.Titulares/clsPadronTitular.cs:1833; frmSelectFechaCapital.checkPeriodo_CheckedChanged — Cfg.Forms/frmSelectFechaCapital.cs:157; frmSelectFechaCapital.frmSelectFechaCapital_Load_1 — Cfg.Forms/frmSelectFechaCapital.cs:184 |
| 3045 | VAR | Entero | OCEBA Archivo FDU - Longitud de campo identificador | clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular — RN.Titulares/clsCirculares.cs:3913 |
| 3058 | VAR | Lógico | Filtrar quitando adherentes dados de baja por fallecimiento en la ficha | clsServicio.GetDatosFicha — RN.Servicios/clsServicio.cs:502 |
| 3066 | VAR | Lógico | Incluir columna TOTAL FACTURADO en excel con detalle de cuentas | clsConsumosTramasCategorias.ExportarExcel_DetalleCuentasExcel — RN.Consumos/clsConsumosTramasCategorias.cs:786 |
| 3074 | VAR | Entero (lista de opciones) | Identificador de lecturas para medidores Rainbow — opciones: ID Telemedición; N° Medidor — _obs: ID Telemedición_ | clsDetalleRuta.ImportarLecturas — RN.Varios.Telemed/clsDetalleRuta.cs:916 |
| 3075 | VAR | Entero | Columna de consumo convencional en archivo de lecturas Rainbow | clsDetalleRuta.ImportarLecturas — RN.Varios.Telemed/clsDetalleRuta.cs:917 |
| 3088 | VAR | Entero (lista de opciones) | Notificar a responsables al enviar/generar OT vía — opciones: WhatsApp; Email; SMS — _obs: WhatsApp_ | clsTecnica.EnviarMensajes — RN.Tecnica/clsTecnica.cs:3630 |
| 3090 | VAR | Texto | OCEBA - Productos a excluir en archivo de facturacion columna 22 | clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4286 |
| 3091 | VAR | Entero | INAES - Cantidad de registros por lote | GetDatosInforme.ExportarAltasYBajas_INAES — RN.Titulares/clsInformes_Titulares.cs:761 |
| 3096 | VAR | Lógico | Permitir pago de resúmen de tarjeta Fecescor en Cooponline | clsWEB.SincronizarParametros — RN.Titulares/clsWEB.cs:1322 |
| 3099 | VAR | Lógico | Aplicar tope de consumo en importación de tarifa social | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3103 | VAR | Lógico | No utilizar Energia inyectada para cargos fijos por tramas desde tarifas — _obs: Requiere variable 2821 activada_ | clsFacturacionServicio.GetImporteCF — RN.Facturacion/clsFacturacionServicio.cs:1948 |
| 3105 | VAR | Lógico | Utiliza API WhatsApp Oficial | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:253; clsTecnica.GenerarMensajes — RN.Tecnica/clsTecnica.cs:3416; clsTecnica.SendSMS — RN.Tecnica/clsTecnica.cs:3458; (+4 más) |
| 3108 | VAR | Lógico | Busqueda en titulares por matricula de servicio no tiene que ser exacta | clsBuscaInfoSocio.GetIQSocios — RN.Titulares/clsBuscaInfoSocio.cs:340 |
| 3112 | VAR | Lógico | Permitir reconexión automática de servicios que no requieren técnica al realizar el pago de deuda | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:270; clsRegistracionCobranza.ReconectarServicioSinTecnica — RN.Cobranzas/clsRegistracionCobranza.cs:305 |
| 3113 | VAR | Lógico | Tomar deuda por tipo de servicio para reconexiones automaticas | clsCobranzaCaja.Get_SersocCambioEstado — RN.Cobranzas/clsCobranzaCaja.cs:1936; clsRegistracionCobranza.GetServiciosDesconectadosSinDeuda — RN.Cobranzas/clsRegistracionCobranza.cs:356 |
| 3117 | VAR | Entero (lista de opciones) | OCEBA Archivo FDU - Separador de columnas — opciones: Punto y coma (;); Tabulacion; Espacio en blanco — _obs: Punto y coma (;)_ | clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular — RN.Titulares/clsCirculares.cs:4033 |
| 3118 | VAR | Lógico | Ordenar comprobantes por período en formulario de cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3121 | VAR | Lógico | Utilizar Movil de la cuenta al enviar Facturas por WP y solo electronicas | Facturacion_Electronica.GetDestino_NumeroDestinoSMS — RN.Configuraciones.Plantillas/Correspondencia.cs:559; clsPlantillasWhatsApp.GetNumeroDestino — RN.Telefonia/clsPlantillasWhatsApp.cs:140 |
| 3123 | VAR | Entero | Columna de Identificador en archivo de segmentacion SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25 — RN.Titulares/clsSegmentacion.cs:1162; clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1228 |
| 3124 | VAR | Entero | Columna de Categoría en archivo de segmentacion SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25 — RN.Titulares/clsSegmentacion.cs:1163; clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1229 |
| 3126 | VAR | Lógico | No buscar por numero de medidor en archivos de segmentacion y TS SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25 — RN.Titulares/clsSegmentacion.cs:1165; clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1233 |
| 3127 | VAR | Entero (lista de opciones) | Archivo de Tarifa Social SEF y Decreto 493/25 - Separador de columnas — opciones: Punto y coma (;); Tabulacion; Espacio en blanco — _obs: Punto y coma (;)_ | clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1237 |
| 3128 | VAR | Lógico | Segmentacion Decreto 493/25 - Realizar búsqueda por número de NIS | clsSegmentacion.GetEnergia_493_25 — RN.Titulares/clsSegmentacion.cs:1164; clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1230 |
| 3130 | VAR | Texto | OCEBA 544 - Conceptos de categorías de múltiples mediciones — _obs: Valores separados por coma (Ej:1,2,3)\r\nSe incluyen los conceptos de las categorias que poseen múltiples mediciones y que no se esten teniendo en cuenta para l_ | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4026; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4185 |
| 3135 | VAR | Lógico | Permitir no cobrar recargo a una cuenta | clsCobranzas.Get_Datos_Factura — RN.Cobranzas/clsCobranzas.cs:2974 |
| 3136 | VAR | Lógico | Incluir cuentas con tarifa social vigente en la importación de tarifa social | clsTarifaSocial.ImportarEnergia_493_25 — RN.Titulares/clsTarifaSocial.cs:1341 |
| 3145 | VAR | Entero (lista de opciones) | TRII - Versión a utilizar para el envio de WhatasApp | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3146 | VAR | Texto | TRII - Channel ID | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3148 | VAR | Lógico | Permitir asignar estado del medidor | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3149 | VAR | Texto | OCEBA 544 - Conceptos de energia generada pico para usuarios generadores | clsInformes_Consumos.Get_Datos_FacturacionOceba — RN.Consumos/clsInformes_Consumos.cs:4153; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4186; clsInformes_Consumos.CompletarInfoUsuariosGeneradores544 — RN.Consumos/clsInformes_Consumos.cs:5437 |
| 3150 | VAR | Texto | OCEBA 544 - Conceptos de energia generada resto para usuarios generadores | clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4187 |
| 3151 | VAR | Texto | OCEBA 544 - Conceptos de energia generada valle para usuarios generadores | clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4188 |
| 3152 | VAR | Lógico | Permitir desagrupar servicios en consulta de cuenta | frmSeleccionar_InfoSocios.frmSeleccionar_InfoSocios_Load — Cfg.Forms/frmSeleccionar_InfoSocios.cs:250 |
| 3154 | VAR | Lógico | Mostrar cuota del periodo en consulta de deuda y caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3155 | VAR | Lógico | Volver a categoría base al reestablecer categorias (segmentacion) | clsSegmentacion.GetQueryRestablecerSEFyDecreto — RN.Titulares/clsSegmentacion.cs:252 |
| 3156 | VAR | Lógico | Archivo FDU - Informar periodo de la factura | clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular — RN.Titulares/clsCirculares.cs:3939 |
| 3159 | VAR | Lógico | Archivos FDU y DET - Excluir NC y facturas originales de refacturación | clsCirculares.GetDatosOceba_Facturacion — RN.Titulares/clsCirculares.cs:4352 |
| 3161 | VAR | Lógico | Forzar descarga de SDK de Pagos360 para el pago con tarjeta en los ATM | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3162 | VAR | Lógico | Solicitar autorización para no cobrar recargo en caja local | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3164 | VAR | Lógico | No exigir cuenta principal al agregar titular durante una transferencia de cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3172 | VAR | Lógico | Exportar a XLSX el informe de consumos agrupados por tramas y categorías | clsConsumosTramasCategorias.ExportarExcel_DetalleCuentasExcel — RN.Consumos/clsConsumosTramasCategorias.cs:858 |
| 3180 | VAR | Texto | OCEBA 544 - Conceptos de energia activa para usuarios generadores | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4031; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4189 |
| 3181 | VAR | Texto | OCEBA 544 - Conceptos extras cargo fijo | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4036; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4190 |
| 3182 | VAR | Texto | OCEBA 544 - Conceptos extras exceso energia reactiva | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4041; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4191 |
| 3183 | VAR | Texto | OCEBA 544 - Conceptos extras coseno de fi | clsInformes_Consumos.GetProductosConfigurados544 — RN.Consumos/clsInformes_Consumos.cs:4046; clsInformes_Consumos.Get_Filtros544 — RN.Consumos/clsInformes_Consumos.cs:4192 |
| 3184 | VAR | Lógico | Utilizar columna ORDEN en recategorización de gas | clsRecategorizacion.Get_Recategorizacion_Gas — RN.Facturacion/clsRecategorizacion.cs:424; clsTarifaSocial.Importar_Gas_M3 — RN.Titulares/clsTarifaSocial.cs:1999 |
| 3185 | VAR | Mixto: Lógico | Permitir definición de ubicaciones de Productos | abm_prod_ser.? — Cfg/Configuracion/abm_prod_ser.cs:45; FormBase.ValidarUbicaciones — Cfg/Configuracion/FormBase.cs:508; frmUbicacionesStock.frmUbicacionesStock — Cfg/Configuracion/frmUbicacionesStock.cs:213 |
| 3186 | VAR | Lógico | Enviar mail cuando un adherente cumple mayoria de edad | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2024 |
| 3187 | VAR | Texto | Mail para aviso de adherentes que cumplen mayoria de edad | clsServicio_Procoop.EnviarMailAdherenteMayorEdad — RN.Varios.Generales/clsServicio_Procoop.cs:1598; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2024 |
| 3190 | VAR | Numérico | Código de propiedad Cobranza tarjeta FECESCOR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3193 | VAR | Lógico | No exigir cuenta principal, distrito y sección a socio no activo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3194 | VAR | Texto | Operaciónes Técnicas por cambio de estado en servicio | clsProcoop_Integra_Tecnica.ValidarTransaccionReclamo — RN.Varios.Generales/clsProcoop_Integra_Tecnica.cs:2001 |
| 3195 | VAR | Lógico | Permitir cambiar suministro a principal al transferirlo a un socio nuevo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3196 | VAR | Lógico | Permitir DNI duplicado solo cuando el socio relacionado esta dado de baja o inactivo | clsSocios.PermiteDNIDuplicado — RN.Titulares/clsSocios.cs:895 |
| 3198 | VAR | Lógico | Segmentacion Gas - Importador SEF - Realizar búsqueda por número de matrícula | clsSegmentacion.ImportarGas_SEF — RN.Titulares/clsSegmentacion.cs:913 |
| 3200 | VAR | Lógico | Agrupar advertencia de comprobante X veces en archivo al importar archivo de rendición | Importador_Base.Validar_Duplicados — RN.Cobranzas.Entidades/Importador_Base.cs:1230 |

#### VENTAS_Y_FACTURACION (313 parámetros, 199 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 14 | VAR | Numérico | Factor Calórico Óptimo | clsFacturacionServicio.ConsumosDivididos — RN.Facturacion/clsFacturacionServicio.cs:232 |
| 19 | VAR | Numérico (FK a tabla) | Concepto para facturar CPP — FK `PROD_SER.COD_PRO` | clsCVLP.ProcesarCPP — RN.Facturacion/clsCVLP.cs:451; clsFacturacionServicio.FacturarConsumos_Telefonia — RN.Facturacion/clsFacturacionServicio.cs:2950; clsInformes_Llamadas.Get_Llamadas_Cpp — RN.Telefonia/clsInformes_Llamadas.cs:963 |
| 21 | VAR | Lógico | NO Redondear total de Factura | clsChequeos.FinalizarChequeos — CapaNucleo/clsChequeos.cs:51; clsComprobanteFactura.clsComprobanteFactura — RN.Facturacion/clsComprobanteFactura.cs:612 |
| 22 | VAR_PMOVIL | Lógico | Imprimir comprobante al realizar una Venta — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 23 | VAR_PMOVIL | Texto | Texto a mostrar en el comprobante impreso de Venta — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 24 | VAR | Numérico (FK a tabla) | Concepto para facturar Llamadas Internacionales — FK `PROD_SER.COD_PRO` | clsFacturacionServicio.FacturarConsumos_Telefonia — RN.Facturacion/clsFacturacionServicio.cs:2956; clsInformes_Llamadas.Get_Llamadas_Internacionales — RN.Telefonia/clsInformes_Llamadas.cs:828 |
| 24 | VAR_PMOVIL | Entero (FK a tabla) | Configurar Titular para realizar Ventas Rapidas — FK `SOCIOS.COD_SOC` — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 25 | VAR_PMOVIL | Lógico | Los Presupuestos de PMovil son a Granel — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 26 | VAR_PMOVIL | Numérico | Coeficiente multiplicador para los presupuestos a Granel — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 29 | VAR | Entero (FK a tabla) | Concepto para anticipo — FK `PROD_SER.COD_PRO` | clsEntidadesRecaudadoras.CrearAnticipo — RN.Cobranzas/clsEntidadesRecaudadoras.cs:750; clsComprobanteFactura.GenerarCreditoPorAnticipo — RN.Facturacion/clsComprobanteFactura.cs:930; clsComprobanteVenta.CargarCreditoPago — RN.Facturacion/clsComprobanteVenta.cs:779; (+2 más) |
| 34 | VAR | Texto | Reporte para factura con Talón Sumado | clsGenerarPDF.GenerarPDF_Facturas — RN.Varios.Generales/clsGenerarPDF.cs:353; frmPrintPreview.AddFactura — Cfg/Configuracion/frmPrintPreview.cs:2087 |
| 37 | VAR_PMOVIL | Lógico | Controlar deuda vencida de la cuenta en la Web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 39 | VAR_PMOVIL | Lógico | Solo subir facturacion diaria (No Masiva) — _obs: Solo sube facturacion diaria posterior a la fecha configurada en la variable 20_ — canal: CoopOnline | clsWEB.AgregarFiltrosFacturas — RN.Titulares/clsWEB.cs:1826 |
| 42 | VAR | Mixto | Mostrar Vista previa de Facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 45 | VAR_PMOVIL | Lógico | Habilitar Carro de facturas en la web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 52 | VAR_PMOVIL | Lógico | Subir Factura a CooponlineWeb al registrar ventas — canal: PMovil | clsPMovil_Venta.Sincronizar_Venta — RN.Varios.PMovil/clsPMovil_Venta.cs:243 |
| 58 | VAR | Entero (FK a tabla) | Tipo de cuota para agregar deuda de cuotas — FK `TIPO_FAC.COD_TPFC` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 59 | VAR | Numérico (FK a tabla) | Concepto a facturar para agregar deuda de cuotas — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 60 | VAR_PMOVIL | Lógico | Mostrar todos los comprobantes en la página de facturas sin login — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 61 | VAR_PMOVIL | Lógico | Habilitar el ingreso a la página de facturas sin login desde la web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 65 | VAR | Entero (FK a tabla) | Tipo de cuota por defecto en venta — FK `TIPO_FAC.COD_TPFC` | clsRegistracionCobranza.NuevaFactura — RN.Cobranzas/clsRegistracionCobranza.cs:1324; clsTecnica.Validar_ConceptosCobrar_Confirmacion — RN.Tecnica/clsTecnica.cs:2861; clsProcoop_Integra_Tecnica.Validar_ConceptosCobrar — RN.Varios.Generales/clsProcoop_Integra_Tecnica.cs:1831; (+1 más) |
| 66 | VAR_PMOVIL | Lógico | Imprimir comprobante duplicado al realizar una Venta — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 70 | VAR | Entero (FK a tabla) | Concepto para Comisiones CPP — FK `PROD_SER.COD_PRO` | clsCVLP.GenerarCVLP — RN.Facturacion/clsCVLP.cs:282 |
| 71 | VAR | Numérico | Comision por defecto en generación de CVLP | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 76 | VAR | Lógico | Rendición de CVLP segun cobranzas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 77 | VAR | Lógico | Mover Stock al Registrar Venta | clsComprobanteVenta.GetCompVen — RN.Facturacion/clsComprobanteVenta.cs:1201; ItemsComprobante.ValidarStock — RN.Facturacion/ItemsComprobante.cs:817 |
| 78 | VAR | Lógico | Generar Nota de Debito en CVLP | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 119 | VAR | Entero (lista de opciones) | Redondear Consumo Corregido en Gas | clsEnargas.Get_File_FDU — RN.Facturacion/clsEnargas.cs:1086; clsFacturacionServicio.RedondeoGas — RN.Facturacion/clsFacturacionServicio.cs:325; clsRecategorizacion.Get_Recategorizacion_Gas — RN.Facturacion/clsRecategorizacion.cs:323; (+1 más) |
| 130 | VAR | Texto | Informe para Remitos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 141 | VAR | Lógico | NO incluir percepciones en CVLP | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 149 | VAR | Lógico | Utilizar consumo real de Gas Natural | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 154 | VAR | Mixto | No Imprimir Recibo de la venta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 155 | VAR | Mixto | No imprimir factura de la venta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 156 | VAR | Mixto: Texto | Informe para Factura de Venta de Prepaga | DatosImpresion_Factura.NombreReporte — RN.Facturacion/clsFacturasImpresion.cs:424 |
| 185 | VAR | Lógico | Descontar anticipo en proxima factura | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 208 | VAR | Lógico | No permitir ventas con Stock 0 o Negativo | ItemsComprobante.ValidarStock — RN.Facturacion/ItemsComprobante.cs:819 |
| 210 | VAR | Texto | Informe para presupuesto | clsTickets.GetInformePresupuesto — RN.Varios.Tickets/clsTickets.cs:2797 |
| 242 | VAR | Entero (lista de opciones) | Tipo de emisión de resumen por socio — opciones: No Emitir Resumenes; Por Socio SIN FINANCIACIONES; Por Socio CON FINANCIACIONES; Por Suministro SIN FINANCIACIONES; Por Suministro CON FINANCIACIONES — _obs: No Emitir Resumenes_ | clsComprobanteFactura.Get_Facturas — RN.Facturacion/clsComprobanteFactura.cs:2273; clsFacturasImpresion.GetResumenPorSocio — RN.Facturacion/clsFacturasImpresion.cs:3197; PR_BancoCordoba50_FacturaResumen.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_BancoCordoba50_FacturaResumen.cs:41; (+1 más) |
| 243 | VAR | Lógico | Valor por default - No Bonificar Coseno | abm_Servicio_Categorias.ConfigurarForm — Cfg.Forms/abm_Servicio_Categorias.cs:654 |
| 273 | VAR | Lógico | Emitir facturas por intereses NO nota de débito | clsRegistracionCobranza.NuevaFactura — RN.Cobranzas/clsRegistracionCobranza.cs:1310 |
| 291 | VAR | Lógico | Imprimir Factura con Talón Sumado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 297 | VAR | Entero (lista de opciones) | Filtro a Utilizar en generación de CVLP — opciones: Período; Fecha (Desde/Hasta); Nro de Lote — _obs: Nro de Lote_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 312 | VAR | Texto | Informe para Liquidación de Crédito | clsComprobanteVenta.GetLiquidacionCredito — RN.Facturacion/clsComprobanteVenta.cs:975 |
| 317 | VAR | Lógico | Exigir catastro en Factibilidad Tecnica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 322 | VAR | Entero (lista de opciones) | Tipo de pago preferido | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 325 | VAR | Lógico | Permite modificar concepto para anticipo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 339 | VAR | Entero (FK a tabla) | Comprobante para intereses adelantados en facturas — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 353 | VAR | Entero (FK a tabla) | Concepto para Comisiones 2 CPP — FK `PROD_SER.COD_PRO` | clsCVLP.GenerarCVLP — RN.Facturacion/clsCVLP.cs:320 |
| 354 | VAR | Lógico | No permitir ventas con Stock 0 o Negativo por depósito | ItemsComprobante.ValidarStock — RN.Facturacion/ItemsComprobante.cs:828 |
| 376 | VAR | Lógico | Permitir Numeración Manual de Comprobantes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 389 | VAR | Lógico | Permitir ventas de contado con vencimiento diferido | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 393 | VAR | Mixto: Entero | Bloqueo de Venta segun Deuda | clsPrepaga.ValidarComprobante — RN.Cobranzas/clsPrepaga.cs:841 |
| 400 | VAR | Lógico | Obligar a seleccionar concepto para anticipos manualmente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 403 | VAR | Entero (FK a tabla) | Concepto para Factura en cuotas — FK `PROD_SER.COD_PRO` | clsComprobanteVenta.CargarCreditoPago — RN.Facturacion/clsComprobanteVenta.cs:776; clsComprobanteVenta.GetCompVenFacturaCuotas — RN.Facturacion/clsComprobanteVenta.cs:1082; GetDatosInforme.Get_Detalle_Ventas — RN.Facturacion/clsInformes_Facturacion.cs:3034; (+1 más) |
| 404 | VAR | Entero | Envio de Mails - Enviar en Grupos de: | Manager.EnviarMailsPendientes — Mails/Manager.cs:482; frm_VisorMensajes.EnviarMail — Cfg.Forms/frm_VisorMensajes.cs:506 |
| 411 | VAR | Lógico | No permitir Modificar precio de venta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 421 | VAR | Lógico | Bloquear Facturación Masiva | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 461 | VAR | Entero | Envio de Mails - Tiempo de Espera para envio (Segundos) | Manager.EnviarMailsPendientes — Mails/Manager.cs:481; frm_VisorMensajes.EnviarMail — Cfg.Forms/frm_VisorMensajes.cs:505 |
| 484 | VAR | Lógico | Usar número de Cuenta en lectura de Código de Barra en vez de Ruta SR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 539 | VAR | Lógico | Facturación electrónica - Adjuntar Archivo en mail | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 540 | VAR | Entero (FK a tabla) | Facturación electrónica - Plantilla para envio — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 543 | VAR | Numérico | Código de IMPUESTO para IVA | clsInformes_Cobranzas.GetDatosInformeComposicionDeuda — RN.Cobranzas/clsInformes_Cobranzas.cs:996; clsInformes_Cobranzas.GetDatosInformeComposicionDeudaPorSocio — RN.Cobranzas/clsInformes_Cobranzas.cs:1322; clsCierreDiario.GererarAsiento_Compras_Facturacion — RN.Contabilidad/clsCierreDiario.cs:2328; (+5 más) |
| 544 | VAR | Entero (FK a tabla) | Situación de IVA para No Categorizados — FK `SITIVA.COD_SIT` | Impuestos.AplicaPercepcionIVA — ReglasNegocio/Impuestos.cs:219; clsLibroIVA.GetDetalle_Facturado — RN.Facturacion/clsLibroIVA.cs:1123; clsLibroIVA.GetDetalle_Facturado_Items — RN.Facturacion/clsLibroIVA.cs:1327; (+3 más) |
| 565 | VAR | Texto | Informe para Facturas | DatosImpresion_Factura.NombreReporte — RN.Facturacion/clsFacturasImpresion.cs:389 |
| 578 | VAR | Numérico | Porcentaje/Importe de recargo entre vtos. de Facturas | clsComprobanteFactura.CalcularTotalFactura_VariablePorcentaje — RN.Facturacion/clsComprobanteFactura.cs:1797; clsComprobanteFactura.CalcularTotalFactura_FijoPorcentaje — RN.Facturacion/clsComprobanteFactura.cs:1805; clsComprobanteFactura.CalcularTotalFactura_FijoPesos — RN.Facturacion/clsComprobanteFactura.cs:1828; (+1 más) |
| 700 | VAR | Mixto: Lógico | Retención según deuda de Titular (no de la cuenta) | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1096 |
| 701 | VAR | Mixto: Lógico | Retención Segun Tipo de Comprobante e Importe de la Deuda | clsPrepaga.CalcularRecargo — RN.Cobranzas/clsPrepaga.cs:945 |
| 702 | VAR | Mixto: Entero/Lógico | Comprobante a Emitir para Credito por Importe Retenido | clsPrepaga.GetCreditoPorRecargo — RN.Cobranzas/clsPrepaga.cs:731 |
| 704 | VAR | Mixto: Lógico | Incluir Créditos internos o Nota de Credito al calcular retenciones | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1101 |
| 705 | VAR | Mixto | Imprimir comprobante por Retención | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 711 | VAR | Mixto: Lógico | Procesar crédito contra deuda una vez que se ha generado | clsRegistracionCobranza.RegistrarRetencionPrepaga — RN.Cobranzas/clsRegistracionCobranza.cs:1067 |
| 712 | VAR | Mixto: Texto | Tipo de Factura para procesar Crédito cuando se | clsRegistracionCobranza.RegistrarRetencionPrepaga — RN.Cobranzas/clsRegistracionCobranza.cs:1094 |
| 713 | VAR | Mixto: Lógico | Calcular y retener importe por Intereses | clsPrepaga.CalcularRecargo — RN.Cobranzas/clsPrepaga.cs:969; clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1055 |
| 726 | VAR | Lógico | Autorizar Facturas Con cliente ARCA Automaticamente | clsWeb_CoopOnline.RegistrarFacturasAuto — Agente.Clases/clsWeb_CoopOnline.cs:437; clsFacturacionElectronica.RegistrarFacturasAuto — RN.Facturacion/clsFacturacionElectronica.cs:484 |
| 727 | VAR | Lógico | Aguardar a que se registre en ARCA la factura | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:198; clsComprobanteVenta.Guardar — RN.Facturacion/clsComprobanteVenta.cs:665 |
| 731 | VAR | Numérico | Porcentaje a aplicar en cálculo de riego crediticio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 732 | VAR | Entero (lista de opciones) | Acción a tomar si no cumple con los requisitos de riesgo crediticio en venta de productos — opciones: Ignorar; Alertar; Impedir; Solicitar autorización — _obs: Ignorar_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 733 | VAR | Entero (FK a tabla) | Tipo de Comprobante para Factura en Cuotas Con intereses — FK `TIPO_FAC.COD_TPFC` | clsComprobanteVenta.Guardar — RN.Facturacion/clsComprobanteVenta.cs:529 |
| 738 | VAR | Numérico | Porcentaje de descuento a aplicar en venta de productos cuando la forma de pago es contado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 739 | VAR | Lógico | No permite registrar conceptos gravados en comprobantes internos | clsCobranzas.Crear_Anticipo_Redondeo — RN.Cobranzas/clsCobranzas.cs:3273; clsComprobanteFactura.Validar — RN.Facturacion/clsComprobanteFactura.cs:697 |
| 742 | VAR | Entero (lista de opciones) | Tipo de Redondeo en Facturas — _obs: Recuerde verificar las variables 2095, 2096 y 2097_ | clsChequeos.FinalizarChequeos — CapaNucleo/clsChequeos.cs:56; clsFacturacionServicio.AgregarRedondeo — RN.Facturacion/clsFacturacionServicio.cs:1631 |
| 1007 | VAR | Entero | Cuenta por defecto en venta rápida de productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1008 | VAR | Entero (FK a tabla) | Vendedor defecto en CVEN Rápida — FK `VENDEDOR.COD_VEN` | clsEntidadesRecaudadoras.CrearAnticipo — RN.Cobranzas/clsEntidadesRecaudadoras.cs:750; clsGestionMora.Guardar_Notificaciones — RN.Cobranzas/clsGestionMora.cs:992; clsGestionMora.Guardar_Comprobante — RN.Cobranzas/clsGestionMora.cs:1260; (+8 más) |
| 1010 | VAR | Lógico | Registra Precio con IVA en Ventas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1023 | VAR | Mixto: Lógico | Bonificación Prepaga personalizada | clsPrepaga.CorrespondeCalcularBonificacion — RN.Cobranzas/clsPrepaga.cs:1038 |
| 1024 | VAR | Mixto: Lógico | Retención Prepaga personalizada | clsPrepaga.CorrespondeCalcularRecargo — RN.Cobranzas/clsPrepaga.cs:1010 |
| 2068 | VAR | Lógico | No permitir Ventas si el Stock Disponible se encuentra Pendiente de entrega | ItemsComprobante.ValidarStock — RN.Facturacion/ItemsComprobante.cs:865 |
| 2071 | VAR | Texto | Path de Certificado ARCA | clsFacturacionElectronica.GetTicketFirmante — RN.Facturacion/clsFacturacionElectronica.cs:749; clsFacturacionElectronica.CargarTicket — RN.Facturacion/clsFacturacionElectronica.cs:809 |
| 2072 | VAR | Texto | URL ARCA para Obtencion de Ticket de Autenticación | clsFacturacionElectronica.CargarTicket — RN.Facturacion/clsFacturacionElectronica.cs:808 |
| 2073 | VAR | Texto | URL ARCA para Registracion De Facturas electrónicas | clsFacturacionElectronica.RegistrarFacturasAuto — RN.Facturacion/clsFacturacionElectronica.cs:495; clsFacturacionElectronica.CargarTicket — RN.Facturacion/clsFacturacionElectronica.cs:820 |
| 2081 | VAR | Entero (lista de opciones) | Modelo de Impresión de Facturas de Terceros | DatosImpresion_Factura.DatosExtra — RN.Facturacion/clsFacturasImpresion.cs:1495; clsFacturas_DatosExtras.CargarFacturasTerceros — RN.Facturacion/clsFacturas_DatosExtras.cs:22; frmImportacionArchivos.frmImportacionArchivos — Cfg.Forms/frmImportacionArchivos.cs:186 |
| 2082 | VAR | Texto | Path Carpeta Entrada | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2083 | VAR | Texto | Path Carpeta Salida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2089 | VAR | Entero (FK a tabla) | Concepto para interés de comprobante de venta — FK `PROD_SER.COD_PRO` | clsCaidaCuotas.clsCaidaCuotas — RN.Cobranzas/clsCaidaCuotas.cs:68; clsComprobanteVenta.Guardar — RN.Facturacion/clsComprobanteVenta.cs:400; clsModificacionCuotas.RegistrarCambios — RN.Facturacion/clsModificacionCuotas.cs:623 |
| 2091 | VAR | Entero (FK a tabla) | Valor por default - Concepto para Recargo por Factor de Potencia — FK `PROD_SER.COD_PRO` | abm_Servicio_Categorias.ConfigurarForm — Cfg.Forms/abm_Servicio_Categorias.cs:652 |
| 2092 | VAR | Entero (FK a tabla) | Valor por default - Concepto para Bonificación por Factor de Potencia — FK `PROD_SER.COD_PRO` | abm_Servicio_Categorias.ConfigurarForm — Cfg.Forms/abm_Servicio_Categorias.cs:651 |
| 2093 | VAR | Numérico | Valor por default - Tope de Coseno de FI | abm_Servicio_Categorias.ConfigurarForm — Cfg.Forms/abm_Servicio_Categorias.cs:653 |
| 2095 | VAR | Entero (FK a tabla) | Redondeo - Concepto para Redondeo — FK `PROD_SER.COD_PRO` | clsFacturacionServicio.AgregarRedondeo — RN.Facturacion/clsFacturacionServicio.cs:1633 |
| 2096 | VAR | Entero (FK a tabla) | Redondeo - Concepto para Redondeo Anterior — FK `PROD_SER.COD_PRO` | clsFacturacionServicio.AgregarRedondeo — RN.Facturacion/clsFacturacionServicio.cs:1632 |
| 2097 | VAR | Entero (lista de opciones) | Redondeo - Cantidad de Decimales a Redondear | clsFacturacionServicio.AgregarRedondeo — RN.Facturacion/clsFacturacionServicio.cs:1630 |
| 2157 | VAR | Lógico | Incluir detalle de llamadas en la impresión individual de la facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2210 | VAR | Mixto: Lógico | Indica si se debe Practicar la Retención a Cuenta de Deuda | clsPrepaga.CalcularRecargo_Bonificacion — RN.Cobranzas/clsPrepaga.cs:501; clsPrepaga.CorrespondeCalcularRecargo — RN.Cobranzas/clsPrepaga.cs:1006 |
| 2211 | VAR | Mixto: Lógico | Analiza Facturas | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1097 |
| 2212 | VAR | Mixto: Entero | Dias desde el Vto. | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1098 |
| 2213 | VAR | Mixto: Numérico | Deuda por Facturas Vencidas Mayor a... | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1049 |
| 2214 | VAR | Mixto: Lógico | Ignorar Valores Anteriores | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1050 |
| 2215 | VAR | Mixto: Lógico | Analiza Financiaciones | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1099 |
| 2216 | VAR | Mixto: Entero | Dias desde el Vto. | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1100 |
| 2217 | VAR | Mixto: Numérico | Deuda por Financiaciones Vencidas Mayor a... | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1051 |
| 2218 | VAR | Mixto: Lógico | Ignorar Valores Anteriores | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1052 |
| 2219 | VAR | Mixto: Numérico | Deuda Total Mayor a... | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1053 |
| 2220 | VAR | Mixto: Lógico | Ignorar Deuda Total | clsPrepaga.CorrespondeRetener — RN.Cobranzas/clsPrepaga.cs:1054 |
| 2221 | VAR | Mixto: Numérico | Retener un Importe Fijo | clsPrepaga.CalcularRecargo — RN.Cobranzas/clsPrepaga.cs:943 |
| 2222 | VAR | Mixto: Numérico | Retener un Porcentaje de la venta | clsPrepaga.CalcularRecargo — RN.Cobranzas/clsPrepaga.cs:944 |
| 2223 | VAR | Mixto: Entero | Concepto en la Factura Generada | clsPrepaga.AgregarRecargo_Bonificacion — RN.Cobranzas/clsPrepaga.cs:473 |
| 2224 | VAR | Mixto: Entero | Concepto en la Nota de Credito | clsPrepaga.GetCreditoPorRecargo — RN.Cobranzas/clsPrepaga.cs:751; clsPrepaga.GetDebitoPorRecargo — RN.Cobranzas/clsPrepaga.cs:786 |
| 2225 | VAR | Mixto: Lógico | Indica si se debe bonificar a titulares sin deuda. | clsPrepaga.CalcularRecargo_Bonificacion — RN.Cobranzas/clsPrepaga.cs:501; clsPrepaga.CorrespondeCalcularBonificacion — RN.Cobranzas/clsPrepaga.cs:1030 |
| 2226 | VAR | Mixto: Lógico | Analiza Facturas | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1097 |
| 2227 | VAR | Mixto: Entero | Dias desde el Vto. | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1098 |
| 2228 | VAR | Mixto: Numérico | Deuda por Facturas Vencidas Mayor a... | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1073 |
| 2229 | VAR | Mixto: Lógico | Ignorar Valores Anteriores | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1074 |
| 2230 | VAR | Mixto: Lógico | Analiza Financiaciones | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1099 |
| 2231 | VAR | Mixto: Entero | Dias desde el Vto. | clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1100 |
| 2232 | VAR | Mixto: Numérico | Deuda por Financiaciones Vencidas Mayor a... | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1075 |
| 2233 | VAR | Mixto: Lógico | Ignorar Valores Anteriores | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1076 |
| 2234 | VAR | Mixto: Numérico | Deuda Total Mayor a... | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1077 |
| 2235 | VAR | Mixto: Lógico | Ignorar Deuda Total | clsPrepaga.CorrespondeBonificar — RN.Cobranzas/clsPrepaga.cs:1078 |
| 2236 | VAR | Mixto: Numérico | Bonificar un Importe Fijo | clsPrepaga.CalcularBonificaciones — RN.Cobranzas/clsPrepaga.cs:922 |
| 2237 | VAR | Mixto: Numérico | Bonificar un Porcentaje de la venta | clsPrepaga.CalcularBonificaciones — RN.Cobranzas/clsPrepaga.cs:923 |
| 2238 | VAR | Mixto: Entero | Id del Producto a utilizar para la Bonificación que se incluye en la Factura | clsPrepaga.AgregarRecargo_Bonificacion — RN.Cobranzas/clsPrepaga.cs:477; clsPrepaga.GetDebitoPorRecargo — RN.Cobranzas/clsPrepaga.cs:787 |
| 2239 | VAR | Mixto: Lógico | Bonifica Cuando No retiene, | clsPrepaga.CalcularBonificaciones — RN.Cobranzas/clsPrepaga.cs:929; clsPrepaga.CorrespondeCalcularBonificacion — RN.Cobranzas/clsPrepaga.cs:1034 |
| 2243 | VAR | Mixto (FK a tabla): Entero | Tipo de Comprobante para Facturar Prepaga — FK `TIPO_FAC.COD_TPFC` | clsCobranzaCaja.Get_TicketPago — RN.Cobranzas/clsCobranzaCaja.cs:1396; clsPrepaga.GetFactura — RN.Cobranzas/clsPrepaga.cs:531; clsPrepaga.Get_CreditosPendientes — RN.Cobranzas/clsPrepaga.cs:629; (+2 más) |
| 2244 | VAR | Mixto: Lógico/Numérico | Importe Mínimo de Venta | clsPrepaga.ValidarComprobante — RN.Cobranzas/clsPrepaga.cs:823; clsPrepaga.ValidarImporteMinimoVenta — RN.Cobranzas/clsPrepaga.cs:908 |
| 2245 | VAR | Mixto: Lógico/Numérico | Importe Mínimo de en caso de NO Retención | clsPrepaga.ValidarComprobante — RN.Cobranzas/clsPrepaga.cs:815 |
| 2246 | VAR | Lógico | Mostrar Importe de los items en reporte de comprobante de Venta | clsComprobanteVenta.CargarComprobante — RN.Facturacion/clsComprobanteVenta.cs:1385 |
| 2247 | VAR | Entero (FK a tabla) | Concepto para Descuento en comprobante de venta en facturas contado o en 1 cuota — FK `PROD_SER.COD_PRO` | clsComprobanteVenta.Validar — RN.Facturacion/clsComprobanteVenta.cs:350 |
| 2253 | VAR | Entero (FK a tabla) | Servicio de Pack SMS — FK `SERVICIO.COD_SER` | clsTelefoniaMovil.Importar_AsignarConceptos_1 — RN.Telefonia/clsTelefoniaMovil.cs:961; clsTelefoniaMovil.Importar_AsignarConceptos_2 — RN.Telefonia/clsTelefoniaMovil.cs:1077 |
| 2254 | VAR | Entero | Subdistribuidor de Gas Natural (ENARGAS) | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2256 | VAR | Entero | Código de concepto de Percepcion (ENARGAS) | clsEnargas.Get_File_DET — RN.Facturacion/clsEnargas.cs:1595; clsEnargas2.Get_File_FaD — RN.Facturacion/clsEnargas2.cs:823 |
| 2257 | VAR | Texto | Código de Entidad (ENARGAS) | clsEnargas.Get_File_CMD — RN.Facturacion/clsEnargas.cs:1714; clsEnargas2.Get_File_CoC — RN.Facturacion/clsEnargas2.cs:229 |
| 2258 | VAR | Texto | Código de contrato de Entidad (ENARGAS) | clsEnargas.Get_File_CMD — RN.Facturacion/clsEnargas.cs:1715; clsEnargas2.Get_File_CoC — RN.Facturacion/clsEnargas2.cs:230; clsEnargas2.Get_File_FaV — RN.Facturacion/clsEnargas2.cs:943 |
| 2259 | VAR | Texto | Modalidad Emision Comisión (ENARGAS) | clsEnargas.Get_File_CMD — RN.Facturacion/clsEnargas.cs:1716; clsEnargas2.Get_File_CoC — RN.Facturacion/clsEnargas2.cs:231 |
| 2260 | VAR | Numérico | Porcentaje/Importe Comisión (ENARGAS) | clsEnargas.Get_File_CMD — RN.Facturacion/clsEnargas.cs:1717; clsEnargas2.Get_File_CoC — RN.Facturacion/clsEnargas2.cs:232 |
| 2261 | VAR | Mixto: Lógico | WEB - Solo Facturación Mensual | Parametros.Parametros — RN.Titulares/clsWEB.cs:113 |
| 2263 | VAR | Lógico | Permite generar Facturas en cuotas | PropiedadesCaja.Cargar_CobranzaLocal — RN.Cobranzas/clsCobranzaCaja.cs:354; clsCobranzaCaja.Validar_CobranzaLocal_CuotasPendientes — RN.Cobranzas/clsCobranzaCaja.cs:1824; InfoCobranza.Cargar — RN.Cobranzas/clsCobranzas.cs:1417 |
| 2265 | VAR | Mixto: Entero | WEB - Delay | clsWEB.GenerarPDF — RN.Titulares/clsWEB.cs:2445 |
| 2271 | VAR | Entero | Cantidad de dia maximos para vencimiento de factura manual | clsComprobanteFactura.Validar — RN.Facturacion/clsComprobanteFactura.cs:696 |
| 2272 | VAR | Lógico | Imprimir Liq. de Crédito desde comprobante de venta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2273 | VAR | Lógico | Imprimir Factura desde comprobante de venta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2274 | VAR | Entero | Lote por defecto para impresión de facturas — _obs: 100_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2278 | VAR | Lógico | Permite Redondear items de factura segun Tipos de Factura — _obs: ATENCIÓN: Esta variable solo habilita la opcion en la Carga de Tipos de Factura. Puede generar inconsistencia en algunos reportes_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2283 | VAR | Mixto (FK a tabla): Entero | Concepto para recargo en cambio de trama — FK `PROD_SER.COD_PRO` | clsFacturacionServicio.CorrijeItemsPrepaga — RN.Facturacion/clsFacturacionServicio.cs:2815 |
| 2284 | VAR | Entero (FK a tabla) | Concepto para Cuotas de P/CTA Y ORDEN DE A.M.A. — FK `PROD_SER.COD_PRO` | clsFacturacionCuotasTerceros.Importar_CT1 — RN.Facturacion/clsFacturacionCuotasTerceros.cs:823 |
| 2287 | VAR | Texto | Backup - Path Carpeta Comprimidos | clsServicio_Procoop.ChequearBackup — RN.Varios.Generales/clsServicio_Procoop.cs:1139 |
| 2289 | VAR | Entero (FK a tabla) | Producto para Diferencia de Cotización en Venta de Productos — FK `PROD_SER.COD_PRO` | clsComprobanteVenta.GetCompVen — RN.Facturacion/clsComprobanteVenta.cs:1165; clsComprobanteVenta.GetCompVenRapido — RN.Facturacion/clsComprobanteVenta.cs:1338; ItemsComprobanteCollection.AddRange — RN.Facturacion/ItemsComprobanteCollection.cs:350 |
| 2292 | VAR | Entero (lista de opciones) | Tipo de Interés para facturas impagas — opciones: Estándar; Para Conceptos personalizados (CAU); Estándar con recargo en cheques; Estándar Con Fecha de pago según cheques (AL) — _obs: Estándar_ | clsFacturarIntereses.Get_Comprobantes — RN.Facturacion/clsFacturarIntereses.cs:234 |
| 2311 | VAR | Lógico | Permitir indicar Fecha de vencimiento en ventas a próxima facturación | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2313 | VAR | Mixto: Entero | Tipo De deuda a considerar para No vender (en 0 toma deuda de la Cuenta en 1 del Titular) | clsPrepaga.ValidarComprobante — RN.Cobranzas/clsPrepaga.cs:829 |
| 2315 | VAR | Entero | Cantidad de cuentas a tomar por grupo de facturación - Facturación Masiva | clsFacturacionMasiva.Dispose — RN.Facturacion/clsFacturacionMasiva.cs:205 |
| 2318 | VAR | Texto | Texto a Mostrar por -Conceptos Desconocidos- | clsMovimientoConceptos.InfoFactura — RN.Facturacion/clsMovimientoConceptos.cs:415 |
| 2319 | VAR | Lógico | Permite Impresión por duplicado en Facturación Masiva | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2325 | VAR | Lógico | Imprimir carátula del Libro de Iva VENTAS por separado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2342 | VAR | Mixto: Numérico | Importe Maximo de Redondeo automatico | clsPrepaga.CalcularConsumo — RN.Cobranzas/clsPrepaga.cs:281; clsPrepaga.CalculaConsumo_Autogestion — RN.Cobranzas/clsPrepaga.cs:665; clsFacturacionMasiva.ObtenerFacturas — RN.Facturacion/clsFacturacionMasiva.cs:1348; (+3 más) |
| 2348 | VAR | Entero (lista de opciones) | Método de Facturación de Presupuestos de Factibilidad — opciones: Factura Manual; Venta de Materiales — _obs: Factura Manual_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2358 | VAR | Lógico | Incluir conceptos asociado al servicio en exportador de consumos relevantes | RG3349.Get_Detalle_Exportar — RN.Facturacion.Archivos/RG3349.cs:640 |
| 2360 | VAR | Lógico | Permitir eliminar talones sumados. | PropiedadesCaja.Cargar_CobranzaLocal — RN.Cobranzas/clsCobranzaCaja.cs:355 |
| 2367 | VAR | Lógico | Separar facturas por titular según cantidad | frmAdjuntarPdfs.frmAdjuntarPdfs — Cfg.Forms.Herramientas/frmAdjuntarPdfs.cs:39 |
| 2368 | VAR | Texto | Fuente a utilizar al utilizar la generación de PDF | clsGenerarPDF.GenerarPDF — RN.Varios.Generales/clsGenerarPDF.cs:181; clsGenerarPDF.GenerarPDF_Factura — RN.Varios.Generales/clsGenerarPDF.cs:271; clsGenerarPDF.GenerarPDF_Facturas — RN.Varios.Generales/clsGenerarPDF.cs:388; (+2 más) |
| 2369 | VAR | Entero (lista de opciones) | Calidad de imagen al utilizar la generación de PDF — opciones: Muy Alta; Alta; Normal; Baja; Muy Baja — _obs: Normal_ | clsGenerarPDF.GenerarPDF — RN.Varios.Generales/clsGenerarPDF.cs:179; clsGenerarPDF.GenerarPDF_Factura — RN.Varios.Generales/clsGenerarPDF.cs:269; clsGenerarPDF.GenerarPDF_Facturas — RN.Varios.Generales/clsGenerarPDF.cs:386; (+2 más) |
| 2375 | VAR | Numérico | Valor Constante para el Calculo de Recargo por Tan(§) | clsFacturacionServicio.GC_FacturarFactorPotencia — RN.Facturacion/clsFacturacionServicio.cs:3983; abm_Servicio_Categorias.cboMetodo_Fi_SelectedIndexChanged — Cfg.Forms/abm_Servicio_Categorias.cs:1340 |
| 2380 | VAR | Lógico | Enviar presupuesto a la aplicación de PMOVIL | clsPMovil_Venta.SincronizaPresupuestos — RN.Varios.PMovil/clsPMovil_Venta.cs:590 |
| 2381 | VAR | Lógico | Validar deuda y vencimiento en presupuestos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2383 | VAR | Entero (FK a tabla) | Punto de Venta fija para presupuesto PMovil — FK `PTOVENTA.COD_POS` | clsPresupuesto.CrearPRESUPU — RN.Facturacion/clsPresupuesto.cs:937; clsPresupuesto.ActualizarPRESUPU — RN.Facturacion/clsPresupuesto.cs:1005; clsPMovil_Venta.SincronizaPresupuestos — RN.Varios.PMovil/clsPMovil_Venta.cs:590 |
| 2386 | VAR | Lógico | Sincronizar Ventas y presupuestos de Pmovil automáticamente | clsPMovil_Venta.SincronizarPmovilVentas — RN.Varios.PMovil/clsPMovil_Venta.cs:193 |
| 2395 | VAR | Lógico | Validar servicios activos al realizar presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2398 | VAR | Lógico | Alertar en atención a Usuarios el presupuesto Pendiente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2402 | VAR | Texto | Contraseña para los PDF generados en la Impresión Masiva | frmPrintPreview.ExportReport — Cfg/Configuracion/frmPrintPreview.cs:633 |
| 2404 | VAR | Lógico | Permitir Facturar a Todos los servicios con un Cuadro Anterior | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2405 | VAR | Mixto | WEB - Borrar Datos hasta una fecha específica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2407 | VAR | Numérico | Valor Constante para el Calculo de Recargo por Cos(§) | clsFacturacionServicio.GC_FacturarFactorPotencia — RN.Facturacion/clsFacturacionServicio.cs:4008; abm_Servicio_Categorias.cboMetodo_Fi_SelectedIndexChanged — Cfg.Forms/abm_Servicio_Categorias.cs:1345 |
| 2409 | VAR | Entero (FK a tabla) | Tipo de cuota para anticipo de productos — FK `TIPO_FAC.COD_TPFC` | EntidadDigital.Crear_Anticipo_Rever — RN.Cobranzas/EntidadDigital.cs:337; EntidadDigital.CrearAnticipo — RN.Cobranzas/EntidadDigital.cs:464; clsTesoreria.CrearAnticipoRechazoCupones — RN.Tesoreria/clsTesoreria.cs:1406 |
| 2410 | VAR | Numérico (FK a tabla) | Concepto a Facturar por anticipo de productos — FK `PROD_SER.COD_PRO` | EntidadDigital.CrearAnticipo — RN.Cobranzas/EntidadDigital.cs:465 |
| 2413 | VAR | Mixto: Lógico | Generar Retención/Bonificacion en otra factura | clsRegistracionCobranza.RegistraVentaPrepaga — RN.Cobranzas/clsRegistracionCobranza.cs:1013; clsFacturacionMasiva.ObtenerFacturas — RN.Facturacion/clsFacturacionMasiva.cs:1355 |
| 2414 | VAR | Mixto (FK a tabla): Texto/Entero | Tipo de Comprobante para Facturas de Retenciones — FK `TIPO_FAC.COD_TPFC` | clsPrepaga.GetCreditoPorRecargo — RN.Cobranzas/clsPrepaga.cs:726; clsPrepaga.GetDebitoPorRecargo — RN.Cobranzas/clsPrepaga.cs:761 |
| 2415 | VAR | Mixto (FK a tabla): Entero | Comprobante a Emitir para Debito por Importe Retenido — FK `TIPO_FAC.COD_TPFC` | clsPrepaga.GetDebitoPorRecargo — RN.Cobranzas/clsPrepaga.cs:766 |
| 2417 | VAR | Lógico | Especificar Período al dividir consumos — _obs: Al dividir consumos solicita los periodos para cada división, y al facturar, filtra por periodo los consumos a tomar_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2423 | VAR | Lógico | Agrupar el envío de mails de Facturación por Cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2426 | VAR | Lógico | Usar servicio de Procoop para el envío automático de mails | frm_VisorMensajes.frm_VisorMensajes — Cfg.Forms/frm_VisorMensajes.cs:159 |
| 2427 | VAR | Numérico | Importe Máximo para autorizar los comprobantes De Facturas Electronicas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2431 | VAR | Texto | Facturación electrónica MiPymes- CBU | clsFacturacionElectronica.GetDetRequest — RN.Facturacion/clsFacturacionElectronica.cs:2448 |
| 2432 | VAR | Texto | Facturación electrónica MiPymes- Alias CBU | clsFacturacionElectronica.GetDetRequest — RN.Facturacion/clsFacturacionElectronica.cs:2453 |
| 2442 | VAR | Entero | Cantidad de Periodos máximos en la estimación de Consumos | DetalleGrilla.EstimarConsumo — RN.Consumos/clsInformes_Consumos.cs:293; clsInformes_Consumos.ConsumosARecalcular — RN.Consumos/clsInformes_Consumos.cs:1816; clsInformes_Consumos.ConsumosARecalcularTestigo — RN.Consumos/clsInformes_Consumos.cs:1917 |
| 2443 | VAR | Lógico | No Facturar Cuotas sin servicios | clsFacturacionMasiva.GetItemsFactura — RN.Facturacion/clsFacturacionMasiva.cs:984 |
| 2445 | VAR | Entero (FK a tabla) | Concepto para Percepción de Ingresos Brutos de Archivo DGR — FK `IMPUESTO.COD_IMP` | GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:592; GetDatosInforme.Exportar_Silarpib_Alem — RN.Contabilidad/clsInformes_Contabilidad.cs:766 |
| 2446 | VAR | Numérico | Alícuota aplicada en generación de Archivo DGR | GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:593 |
| 2448 | VAR | Mixto: Lógico | WEB - Incluir Cuotas de Financiación | Parametros.Parametros — RN.Titulares/clsWEB.cs:117 |
| 2450 | VAR | Entero (lista de opciones) | Relacionar Créditos, al cargar un comprobante manualmente — opciones: Sugerir; Obligar; Ignorar — _obs: Ignorar_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2465 | VAR | Lógico | Permite utilizar la marca de \"Cobrar consumo minimo en baja\" | clsFacturacionServicio.GetItemsServicioMedido — RN.Facturacion/clsFacturacionServicio.cs:2381; abm_Servicio_Categorias.ConfigurarForm — Cfg.Forms/abm_Servicio_Categorias.cs:709; abm_Servicio_Categorias.Guardar — Cfg.Forms/abm_Servicio_Categorias.cs:872; (+2 más) |
| 2472 | VAR | Lógico | Imprimir Automáticamente Factura Manual generada | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2476 | VAR | Entero (lista de opciones) | Tipo de Fecha a Mostrar — opciones: No Especificado; Emisión; Vencimiento — _obs: Tipo de Fecha a mostrar en \"Movimiento de Concepto\", \"Cuentas por cobrar\" y \"Libro de IVA Ventas\"_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2496 | VAR | Lógico | Autorizar ventas de Prepaga Automaticamente | clsWeb_CoopOnline.RegistrarFacturasAuto — Agente.Clases/clsWeb_CoopOnline.cs:432; clsWeb_CoopOnline.AutorizarPendientes — Agente.Clases/clsWeb_CoopOnline.cs:462 |
| 2497 | VAR | Texto | Separador de columnas de los archivos .CSV | clsFacturacionElectronica.ChequearCarpetaIN — RN.Facturacion/clsFacturacionElectronica.cs:1284; clsFacturacionElectronica.ChequearCarpetaOUT — RN.Facturacion/clsFacturacionElectronica.cs:1563 |
| 2498 | VAR | Lógico | Utilizar numeración 1 - 6 en periodos bimensuales de gas al recategorizar | clsRecategorizacion.Get_Recategorizacion_Gas — RN.Facturacion/clsRecategorizacion.cs:324 |
| 2511 | VAR | Lógico | Permitir forzar reportes en impresión masiva | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2512 | VAR | Entero | Grupo de facturación para ítems de por diferencia de cotización- Facturación Masiva — _obs: Requiere configurar variable 2289_ | ItemsComprobanteCollection.AddRange — RN.Facturacion/ItemsComprobanteCollection.cs:363 |
| 2514 | VAR | Lógico | Facturar Consumo en 0 cuando no registre consumos de telefonía | clsFacturacionServicio.FacturarConsumos_Telefonia — RN.Facturacion/clsFacturacionServicio.cs:2944 |
| 2515 | VAR | Numérico | Importe para emitir facturas MiPyme | clsComprobante.GetComprobanteOperacion — RN.Facturacion/clsComprobante.cs:218 |
| 2518 | VAR | Lógico | No Permitir modificar Categoría en venta de prepaga | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2519 | VAR | Lógico | No Validar grupos de facturación en venta de productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2520 | VAR | Lógico | Ordenar tarifas por código de concepto en configuración de servicio | clsConsumos.GetConsumosPorCuenta — RN.Consumos/clsConsumos.cs:1727; abm_Servicio_Categorias.? — Cfg.Forms/abm_Servicio_Categorias.cs:48 |
| 2526 | VAR | Lógico | Generar Factura en 0 al facturar consumos | clsFacturacionMasiva.ObtenerFacturas — RN.Facturacion/clsFacturacionMasiva.cs:1154 |
| 2530 | VAR | Lógico | Utilizar fecha de lectura en recategorización de GAS | clsRecategorizacion.Get_Recategorizacion_Gas — RN.Facturacion/clsRecategorizacion.cs:325 |
| 2537 | VAR | Lógico | Imprimir Copias según configuración del comprobante en Remitos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2561 | VAR | Lógico | No utilizar Agente Simple para autorizar cobranzas — _obs: Al utilizar esta variable en SI, se debe configurar el agente en otra pc, con el parametro \"AutCooponline\"_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2564 | VAR | Numérico (FK a tabla) | Concepto para Descuentos en Facturas — FK `PROD_SER.COD_PRO` | clsComprobanteFactura.Validar — RN.Facturacion/clsComprobanteFactura.cs:721; clsComprobanteFactura.Get_Factura — RN.Facturacion/clsComprobanteFactura.cs:1379; clsComprobanteVenta.GetCompVen — RN.Facturacion/clsComprobanteVenta.cs:1255 |
| 2589 | VAR | Texto | Ruta para guardar PDF de facturas contado de PMOVIL | clsPMovil_Venta.Sincronizar_Venta — RN.Varios.PMovil/clsPMovil_Venta.cs:224 |
| 2592 | VAR | Entero (FK a tabla) | Tipo de Factura para ventas con Presupuesto en PMOVIL — FK `TIPO_FAC.COD_TPFC` | clsPMovil_Venta.Sincronizar — RN.Varios.PMovil/clsPMovil_Venta.cs:474 |
| 2600 | VAR | Entero (lista de opciones) | Vencimiento a considerar para validar presupuestos — opciones: Vto1; Vto2; Vto3; Vto4 — _obs: Vto1_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2601 | VAR | Lógico | Imprimir automáticamente las facturas generadas en venta por carga rápida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2603 | VAR | Entero (lista de opciones) | Modelo de archivo de Tablas maestras SARI — opciones: Protocolo Original; Protocolo FCU-DS — _obs: Protocolo Original_ | clsEnargas.Get_ArchivoTablasMaestro — RN.Facturacion/clsEnargas.cs:138; clsEnargas.Get_Conceptos — RN.Facturacion/clsEnargas.cs:148; clsEnargas.Get_Tabla — RN.Facturacion/clsEnargas.cs:211 |
| 2605 | VAR | Entero (lista de opciones) | Facturación en el Libro IVA Ventas — opciones: Todos; Solo en Facutración Mensual; Solo en Facturación DIARIA — _obs: Todos_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2607 | VAR | Numérico (FK a tabla) | Concepto para bonificación de intereses por financiacion en Adelanto de cuotas - Financiación — FK `PROD_SER.COD_PRO` — _obs: Si la variable no se configura, no se hace la bonificación_ | ItemsComprobanteCollection.AddRange — RN.Facturacion/ItemsComprobanteCollection.cs:320 |
| 2612 | VAR | Numérico (FK a tabla) | Concepto a Cobrar por Reimpresión de Comprobantes — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2621 | VAR | Lógico | Generar automáticamente link de pago en impresion de Facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2624 | VAR | Numérico (FK a tabla) | Concepto para bonificación de intereses por financiacion en Adelanto de cuotas - Ventas — FK `PROD_SER.COD_PRO` — _obs: Si la variable no se configura, no se hace la bonificación_ | ItemsComprobanteCollection.AddRange — RN.Facturacion/ItemsComprobanteCollection.cs:323 |
| 2626 | VAR | Entero | Cantidad de mails enviados por lote en la impresión masiva de facturación | frm_VisorMensajes.ok_Cancel1_ClickAceptar — Cfg.Forms/frm_VisorMensajes.cs:243 |
| 2635 | VAR | Lógico | Agrupar el envío de mails de Facturación por Socio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2641 | VAR | Entero (FK a tabla) | Tipo de Factura para ventas sin Presupuesto en PMOVIL — FK `TIPO_FAC.COD_TPFC` | clsPMovil_Venta.Sincronizar — RN.Varios.PMovil/clsPMovil_Venta.cs:478 |
| 2643 | VAR | Lógico | Pedir \"Fecha Desde\" para las lecturas de gas en la recategorización | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2644 | VAR | Lógico | Permitir que el precio unitario del producto sea 0 | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2648 | VAR | Texto | Nombre de Servidor que puede abrir el agente | Program.Main — PN/Procoop/Program.cs:378 |
| 2650 | VAR | Lógico | Hacer visible el check de Excluir Financiaciones en Movimiento de Conceptos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2656 | VAR | Lógico | Volver a abrir formulario al realizar una venta de prepaga en efectivo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2659 | VAR | Numérico | Tope minimo para facturacion de Coseno de Fi | clsFacturacionServicio.GC_FacturarFactorPotencia — RN.Facturacion/clsFacturacionServicio.cs:3930 |
| 2663 | VAR | Lógico | No facturar Franqueo, si el usuario se adhirió a factura electrónica — _obs: Se valida también que posean algún mail de envió_ | clsFacturacionServicio.AddFranqueo — RN.Facturacion/clsFacturacionServicio.cs:1757 |
| 2678 | VAR | Lógico | Impedir modificar el tipo de cuota en venta rapida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2679 | VAR | Lógico | No permitir ventas en cuenta corriente (solo permite CONTADO) a CUENTAS que no tengan servicios conectados y que no se encuentren marcados como los clientes de productos. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2680 | VAR | Lógico | No permitir ventas rapidas a cuentas con deuda vencida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2681 | VAR | Lógico | No tomar el tipo de cuota por defecto en ventas que no sean rapidas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2692 | VAR | Lógico | Exportar IVA VENTAS DIGITAL Segun fecha de Filtro | RG3685.Exportar_Venta — RN.Facturacion.Archivos/RG3685.cs:273; RG3685_ITEMS.Exportar_Venta — RN.Facturacion.Archivos/RG3685_ITEMS.cs:255 |
| 2695 | VAR | Lógico | Permitir modificar el período de facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2697 | VAR | Lógico | Convertir Imagenes a Jpeg al generar PDFs | clsGenerarPDF.GenerarPDF — RN.Varios.Generales/clsGenerarPDF.cs:182; clsGenerarPDF.GenerarPDF_Factura — RN.Varios.Generales/clsGenerarPDF.cs:272; clsGenerarPDF.GenerarPDF_Facturas — RN.Varios.Generales/clsGenerarPDF.cs:389; (+2 más) |
| 2699 | VAR | Lógico | Validar vencimiento de archivo LUA | Inicio_ProCoop.Inicio_ProCoop_Load — PN/Procoop/Inicio_ProCoop.cs:1352 |
| 2701 | VAR | Lógico | Tomar consumos pendientes de facturar al tomar consumo de otro servicio | clsFacturacionServicio.GetConsumoServicioMedido — RN.Facturacion/clsFacturacionServicio.cs:1109 |
| 2704 | VAR | Entero (lista de opciones) | Medio de pago utilizado para generar links de pago en impresion masiva de facturas — opciones: Pagos360; MercadoPago — _obs: Pagos360_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2708 | VAR | Entero (FK a tabla) | Producto relacionado con servicio telefonia prepaga — FK `PROD_SER.COD_PRO` — _obs: Al realizar una venta de productos del producto configurado se generará una orden de trabajo_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2712 | VAR | Numérico | Importe máximo para enviar facturas electrónicas por lote | clsFacturacionElectronica.AutorizaFacturas — RN.Facturacion/clsFacturacionElectronica.cs:1983 |
| 2728 | VAR | Entero | Codigo para diferenciar consumos excedentes de gas | clsEnargas.Get_File_DET — RN.Facturacion/clsEnargas.cs:1665; clsEnargas2.Get_File_FaD — RN.Facturacion/clsEnargas2.cs:888 |
| 2736 | VAR | Lógico | Realizar registro de capital de forma manual | clsFacturacionMasiva.GenerarFacturacion — RN.Facturacion/clsFacturacionMasiva.cs:552 |
| 2737 | VAR | Lógico | Incluir Energía Inyectada en calculo de Coseno de Fi | clsFacturacionServicio.GC_FacturarFactorPotencia — RN.Facturacion/clsFacturacionServicio.cs:3933 |
| 2741 | VAR | Lógico | Asignar orden en impresión masiva de facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2750 | VAR | Texto | Categorías para Medidores Compartidos (Ids separados por coma) — _obs: Habilita la funcionalidad de medidores compartidos. Se deben configurar propiedades personalizadas_ | clsFacturacionServicio.lstMultiCategorias — RN.Facturacion/clsFacturacionServicio.cs:832 |
| 2754 | VAR | Lógico | Permitir replicar comprobantes a todos los Items | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2764 | VAR | Texto | Mail por defecto para generar QR de Pagos360 | clsPagos360.Crear_PAGOS360 — RN.Cobranzas/clsPagos360.cs:610; clsPagos360.Get_QR_Data — RN.Cobranzas/clsPagos360.cs:2093; clsPagos360.Get_QR_Caja — RN.Cobranzas/clsPagos360.cs:2132 |
| 2769 | VAR | Lógico | Bloquear comprobantes de cuentas con otros comprobantes bloqueados en facturación masiva | clsFacturacionElectronica.GetIdBloqueo — RN.Facturacion/clsFacturacionElectronica.cs:2190; clsFacturacionMasiva.GenerarFacturacion — RN.Facturacion/clsFacturacionMasiva.cs:675 |
| 2770 | VAR | Numérico | Porcentaje de Interes a cobrar al desbloquear comprobantes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2771 | VAR | Entero (FK a tabla) | Concepto para Intereses cobrados al desbloquear comprobantes — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2780 | VAR | Lógico | No utilizar cuit generico para registrar facturas | clsFacturacionElectronica.GetDetRequest — RN.Facturacion/clsFacturacionElectronica.cs:2361 |
| 2783 | VAR | Numérico | Importe maximo al generar creditos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2787 | VAR | Lógico | Tomar dia de reconexion para calculo de proporcional | clsFacturacionServicio.GetImporteCF — RN.Facturacion/clsFacturacionServicio.cs:1987; clsFacturacionServicio.AgregarProporcional — RN.Facturacion/clsFacturacionServicio.cs:3258 |
| 2788 | VAR | Entero | Dias que será valido el presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2815 | VAR | Lógico | Excluir servicios dados de baja al Ordenar por ZSR del servicio en impresión masiva | clsFacturasImpresion.GetFacturas — RN.Facturacion/clsFacturasImpresion.cs:2907; clsFacturasImpresion.GetDatosReporteZSR — RN.Facturacion/clsFacturasImpresion.cs:3436 |
| 2827 | VAR | Lógico | Solo utilizar tramas proporcionales para determinar trama grande | clsFacturacionServicio.FacturarTramas — RN.Facturacion/clsFacturacionServicio.cs:3040; clsFacturacionServicio.FacturarTrama_Prorrateo_Anterior — RN.Facturacion/clsFacturacionServicio.cs:3174 |
| 2829 | VAR | Lógico | Obtener consumos de telefono para subreportes de gráfico e historial para facturas de telefonia | DatosImpresion_Factura.GetConsumos — RN.Facturacion/clsFacturasImpresion.cs:1542 |
| 2856 | VAR | Entero | Registrar capital - Hora en la cual registrarlo | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2003 |
| 2864 | VAR | Lógico | No Aplicar Dias proporcionales en consumos de menos dias de los definidos | clsFacturacionServicio.GetImporteCF — RN.Facturacion/clsFacturacionServicio.cs:1933; clsFacturacionServicio.FacturarConsumos — RN.Facturacion/clsFacturacionServicio.cs:2716 |
| 2871 | VAR | Lógico | Permitir ventas rápidas de contado a titulares con deuda vencida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2876 | VAR | Lógico | Generar item extra para guardar cuadro tarifario — _obs: cuando el consumo es 0 y hay prorrateo entre 2 cuadros_ | clsFacturacionServicio.GetItemsServicioMedido — RN.Facturacion/clsFacturacionServicio.cs:2305 |
| 2901 | VAR | Entero | Código de propiedad personalizada para no cargar presupuestos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2914 | VAR | Lógico | Validar si el presupuesto tiene obra asignada | clsPresupuesto.Aprobar — RN.Facturacion/clsPresupuesto.cs:1131 |
| 2915 | VAR | Lógico | Registra Precio con IVA en Presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2916 | VAR | Lógico | Integrar capital en el pago | clsCierreDiario.GenerarAsientoCapital — RN.Contabilidad/clsCierreDiario.cs:6579 |
| 2925 | VAR | Texto | Vencimiento Certificado ARCA (obtenido de Certificado) | LoginTicket.ObtenerLoginTicketResponse — RN.Facturacion/clsFacturacionElectronica.cs:335; Inicio_ProCoop.Inicio_ProCoop_Load — PN/Procoop/Inicio_ProCoop.cs:1381 |
| 2928 | VAR | Lógico | Permitir Prorratear Demandas en grandes consumos | clsFacturacionServicio.FacturarGrandesConsumos — RN.Facturacion/clsFacturacionServicio.cs:3323 |
| 2930 | VAR | Lógico | Generar Credito Fiscal en Factura en cuotas | clsComprobanteVenta.CargarCreditoPago — RN.Facturacion/clsComprobanteVenta.cs:787 |
| 2947 | VAR | Lógico | Imprime factura simple si el talon esta constituido por una sola factura | clsWEB.GetPDF — RN.Titulares/clsWEB.cs:2605; frmPrintPreview.AddFactura — Cfg/Configuracion/frmPrintPreview.cs:2079 |
| 2949 | VAR | Lógico | Emitir presupuestos por conjuntos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2953 | VAR | Entero (FK a tabla) | Producto correspondiente al Flete de presupuestos — FK `PROD_SER.COD_PRO` | clsComprobanteRendicion.GetDatosInformeRendicion — RN.Facturacion/clsComprobanteRendicion.cs:76; clsPresupuesto.Modificar — RN.Facturacion/clsPresupuesto.cs:576; clsPresupuesto.GetDatosInformePresupuesto — RN.Facturacion/clsPresupuesto.cs:1604 |
| 2954 | VAR | Lógico | Agrupar el envío de WhatsApp de Facturación por Socio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2955 | VAR | Lógico | Agrupar el envío de WhatsApp de Facturación por Cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2972 | VAR | Lógico | Separar Items Financiados En libro de IVA VENTAS | clsLibroIVA.GetDetalle_Facturado_Items — RN.Facturacion/clsLibroIVA.cs:1333; clsLibroIVA.GetDetalle_Percibido — RN.Facturacion/clsLibroIVA.cs:1676; clsLibroIVA.GetDetalle_Percibido_Items — RN.Facturacion/clsLibroIVA.cs:2039; (+2 más) |
| 2973 | VAR | Lógico | Permite seleccionar servicios inactivos al relacionar servicio con cuotas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2984 | VAR | Texto (FK a tabla) | Tipo de comprobante para Intereses por desbloqueo de cuentas — FK `TIPO_FAC.COD_TPFC` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2991 | VAR | Lógico | Exportar SI.CO.RE con coma y no con punto | PercepcionSICORE.Get_RetencionesVenta — RN.Facturacion.Archivos/PercepcionSICORE.cs:213 |
| 3004 | VAR | Lógico | Autocompletar nombre al cargar nuevo conjunto de un presupuesto. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3007 | VAR | Texto | Definir Formato de Fecha — _obs: El formato de la fecha debe ingresarse de la siguiente manera (yy/MM/dd). Si esta variable se encuentra vacía, el formato será ddMMyy_ | TORN_ALP.Exportar — RN.Facturacion/clsMovimientoConceptos_Exportacion.cs:459 |
| 3008 | VAR | Lógico | Permitir indicar si los anticipos por productos se descuentan de facturación futura | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3009 | VAR | Lógico | Validar Conexion de Servicio y cerrar si tiene deuda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3010 | VAR | Lógico | Permitir cambiar el cliente en un presupuesto antes de aprobarlo | clsPresupuesto.ActualizarPRESUPU — RN.Facturacion/clsPresupuesto.cs:1031 |
| 3026 | VAR | Lógico | Permitir ingresar datos del transporte en venta de productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3032 | VAR | Entero (FK a tabla) | Producto correspondiente al Molde de presupuestos — FK `PROD_SER.COD_PRO` | clsPresupuesto.Modificar — RN.Facturacion/clsPresupuesto.cs:577 |
| 3036 | VAR | Lógico | Mostrar siempre vista de descargas masivas en variable de plantilla | Facturacion_Electronica.GetArchivoFactura — RN.Configuraciones.Plantillas/Correspondencia.cs:612 |
| 3037 | VAR | Lógico | Imprime presupuesto simple por defecto al registrar un nuevo presupuesto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3038 | VAR | Lógico | Permitir utilizar Anticipos de productos en Facturación masiva | clsFacturacionServicio.lstAnticipos — RN.Facturacion/clsFacturacionServicio.cs:375; clsFacturacionServicio.AgregarAnticipos — RN.Facturacion/clsFacturacionServicio.cs:1553 |
| 3039 | VAR | Entero | N° de lote para el archivo FECESCOR | GetDatosInforme.GenerarArchivosRendicion_FECESCOR — RN.Facturacion/clsInformes_Facturacion.cs:1271 |
| 3049 | VAR | Lógico | Validar que no se repita la matricula del producto | clsProdSer.clonarProdSer — RN.Facturacion/clsProdSer.cs:1037; abm_prod_ser.? — Cfg/Configuracion/abm_prod_ser.cs:43 |
| 3051 | VAR | Lógico | Agrupar el envío de WhatsApp de Facturación por Socio y Nro de Teléfono | Facturacion_Electronica.GetDestino_NumeroDestinoSMS — RN.Configuraciones.Plantillas/Correspondencia.cs:542; clsPlantillasWhatsApp.GetNumeroDestino — RN.Telefonia/clsPlantillasWhatsApp.cs:133; clsSocios.GetNumeroDestino — RN.Titulares/clsSocios.cs:5924 |
| 3053 | VAR | Lógico | Saltar validacion de Vendedor defecto en CVEN Rápida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3060 | VAR | Lógico | Imprimir Remito al generarlo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3062 | VAR | Lógico | Archivo ARBA - Informar números telefónicos | GetDatosInforme.Get_Informe_Arba — RN.Facturacion/clsInformes_Facturacion.cs:3394 |
| 3080 | VAR | Numérico | Importe máximo sugerido en facturas manuales | clsComprobanteFactura.Validar — RN.Facturacion/clsComprobanteFactura.cs:701 |
| 3087 | VAR | Lógico | Notificar a responsables al enviar OT al captor | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3094 | VAR | Entero (FK a tabla) | Concepto para anticipo por energia inyectada — FK `PROD_SER.COD_PRO` — _obs: Si se configura, una factura de energía tiene un consumo inyectado, y da negativa, se agrega este concepto exento para que la factura de 0 y quede el saldo a fa_ | clsFacturacionMasiva.Dispose — RN.Facturacion/clsFacturacionMasiva.cs:203 |
| 3095 | VAR | Lógico | Incluir productos de subtipo Comision CVLP en Movimiento de Conceptos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3110 | VAR | Lógico | En Libro IVA Ventas segun lo percibido se informa el total del IVA del comprobante | clsLibroIVA.GetDetalle_Percibido — RN.Facturacion/clsLibroIVA.cs:1675 |
| 3111 | VAR | Lógico | Usar categoría histórica de servicios fijos por mes vencido (cambio de categoría técnica) — _obs: Si está en verdadero, para servicios fijos que facturan por mes vencido, se tomará la categoría anterior si hubo una OT de cambio de categoría confirmada luego _ | DatosFormula.Servicio_Codigo_Categoria — RN.Facturacion/clsCargosAdicionales.cs:174; DatosFormula.Servicio_Cod_CATSER — RN.Facturacion/clsCargosAdicionales.cs:186; clsFacturacionServicio.GetItemsServicioFijo — RN.Facturacion/clsFacturacionServicio.cs:2144; (+1 más) |
| 3133 | VAR | Lógico | Permitir utilizar otras monedas en la registración manual de facturas y venta de productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3134 | VAR | Entero (FK a tabla) | Concepto para cobro por atraso devolucion ortopedia — FK `PROD_SER.COD_PRO` | clsFacturacionServicio.GetItemsServicio — RN.Facturacion/clsFacturacionServicio.cs:1354 |
| 3138 | VAR | Lógico | Intereses punitorios sobre energía | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3143 | VAR | Lógico | Solo tomar consumos sin facturar al tomar consumos de otro servicio | clsFacturacionServicio.lstConsumos — RN.Facturacion/clsFacturacionServicio.cs:679 |
| 3174 | VAR | Lógico | Tomar matricula de servicio de gas en campo Id Usuario(1) de archivos de Enargas | clsEnargas2.InfoCobranzaFactura — RN.Facturacion/clsEnargas2.cs:155 |
| 3191 | VAR | Lógico | Permitir indicar que servicios se facturan solos y cuales no | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3192 | VAR | Lógico | Permitir estimacion de consumos de medidores testigos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### COBRANZA (265 parámetros, 186 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 63 | VAR_PMOVIL | Entero (lista de opciones) | Habilitar pagar facturas con adhesión al débito automático — opciones: No permitir; Permitir siempre; Permitir solo facturas con recargo de mora — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 129 | VAR | Lógico | Número de Caja Automatico | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 186 | VAR | Entero (FK a tabla) | Moneda por defecto a utilizar en la caja — FK `TIP_MON.TIP_MON1` — _obs: Pesos_ | clsWeb_CoopOnline.GetMedioPago — Agente.Clases/clsWeb_CoopOnline.cs:2256; clsPrescripcionDeuda.Registrar_Facturas — RN.Cobranzas/clsPrescripcionDeuda.cs:328; clsRegistracionCobranza.Registrar_PagoProveedor — RN.Cobranzas/clsRegistracionCobranza.cs:551; (+1 más) |
| 187 | VAR | Lógico | Controlar deuda vencida del titular en caja | clsCobranzaCaja.Validar_CobranzaLocal_CobrarFacturasTitular — RN.Cobranzas/clsCobranzaCaja.cs:1741; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2034 |
| 207 | VAR | Lógico | NO controlar disponibilidad de efectivo en pagos a proveedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 228 | VAR | Lógico | Imprime automaticamente el cupon de pago en cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 299 | VAR | Lógico | Cobrar recargo en vencimiento 2 a jubilados | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:461 |
| 302 | VAR | Lógico | Mostrar Aviso en caja si un titular esta notificado | clsCobranzaCaja.Validar_CobranzaLocal_TitularNotificado — RN.Cobranzas/clsCobranzaCaja.cs:1777; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2030; Importador_Base.Validar_TitularNotificado — RN.Cobranzas.Entidades/Importador_Base.cs:2125 |
| 321 | VAR | Lógico | Bloquear comprobantes notificados para cobrar en grupo | clsCobranzaCaja.Validar_CobranzaLocal_ComprobantesNotificados — RN.Cobranzas/clsCobranzaCaja.cs:1660; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2031 |
| 323 | VAR | Entero (lista de opciones) | Elemento por defecto al ingresar a la cobranza — opciones: Comprobante; Número de Comprobante; Código de Barras; Cuenta; Id Titular; Nombre Titular; Archivo — _obs: Cuenta_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 324 | VAR | Lógico | Al confirmar exigir cobrar facturas más antiguas | clsCobranzaCaja.Validar_CobranzaLocal_CobrarFacturasAntiguas — RN.Cobranzas/clsCobranzaCaja.cs:1675; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2032 |
| 360 | VAR | Entero (FK a tabla) | Concepto a cobrar por comisiones de entidades — FK `PROD_SER.COD_PRO` | clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarCobranzaEntidad — RN.Cobranzas/clsRegistracionCobranza.cs:1384 |
| 372 | VAR | Numérico | Importe a sumar en concepto de gastos administrativos | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:469 |
| 375 | VAR | Lógico | Al confirmar exigir cobrar facturas más antiguas del mismo servicio | clsCobranzaCaja.Validar_CobranzaLocal_CobrarFacturasAntiguasServicio — RN.Cobranzas/clsCobranzaCaja.cs:1707; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2033 |
| 462 | VAR | Lógico | Tomar ultimo vencimiento para exigir cobranza de comprobantes viejos | clsCobranzaCaja.Validar_CobranzaLocal_CobrarFacturasAntiguas — RN.Cobranzas/clsCobranzaCaja.cs:1678; clsCobranzaCaja.Validar_AdvertenciasCaja — RN.Cobranzas/clsCobranzaCaja.cs:2035 |
| 486 | VAR | Numérico | Interes diario para valores recibidos en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 487 | VAR | Numérico (FK a tabla) | Concepto para Interes diario por pago con valores a fecha. — FK `PROD_SER.COD_PRO` | clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarRecargosPorMedioPago — RN.Cobranzas/clsRegistracionCobranza.cs:1226 |
| 598 | VAR | Entero (FK a tabla) | Comprobante por defecto para cobranza — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 599 | VAR | Numérico | Sucursal por defecto para cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 600 | VAR | Numérico | Recargo diario en caja | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:505; clsInformes_Caja.Get_Datasource_CoeficienteInteres — RN.Cobranzas/clsInformes_Caja.cs:3628; clsPrepaga.Get_DeudaAnalizar — RN.Cobranzas/clsPrepaga.cs:1107 |
| 606 | VAR | Numérico (FK a tabla) | Concepto para interés por mora — FK `PROD_SER.COD_PRO` | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:477; clsInformes_Cobranzas.GetDatosInformeComposicionDeuda — RN.Cobranzas/clsInformes_Cobranzas.cs:994; clsInformes_Cobranzas.GetDatosInformeComposicionDeudaPorSocio — RN.Cobranzas/clsInformes_Cobranzas.cs:1320; (+7 más) |
| 608 | VAR | Lógico | Redondear intereses | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:459 |
| 609 | VAR | Numérico | Interes minimo a cobrar en cajas | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:470 |
| 621 | VAR | Lógico | Recargo desde Tercer Vto | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:458 |
| 625 | VAR | Lógico | Calcular intereses en créditos | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:460; clsPagos360.Crear_PAGOS360 — RN.Cobranzas/clsPagos360.cs:625 |
| 649 | VAR | Lógico | Imprimir nota de debito en Cajas. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 650 | VAR | Entero (lista de opciones) | Medio de pago por defecto en caja — opciones: Efectivo; Valores; Retenciones; Tarjeta; Transferencia — _obs: Efectivo_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 708 | VAR | Lógico | Diferir comisiones de medios de pagos utilizados en cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 714 | VAR | Lógico | Activar opciones de cobranza remota | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 715 | VAR | Texto | Cajas utilizadas para cobranza remota | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 716 | VAR | Numérico | Importe máximo a cobrar por factura en cobranza remota | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 717 | VAR | Lógico | Solo permitir cobranza en efectivo en cobranza remota | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 718 | VAR | Numérico | Importe de recargo a cobrar por cobranza remota | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:522 |
| 719 | VAR | Entero (FK a tabla) | Concepto a adicionar por cobranza remota — FK `PROD_SER.COD_PRO` | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:521; clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarIntereses — RN.Cobranzas/clsRegistracionCobranza.cs:746 |
| 901 | VAR | Mixto: Texto | Clave de acceso al servicio de Pagos 360 | clsWeb_CoopOnline.SubirPDFPagoEfectivo — Agente.Clases/clsWeb_CoopOnline.cs:1451; clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:1999; clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:390; (+1 más) |
| 902 | VAR | Mixto: Texto | Url a redireccionar al realizar un pago exitoso en pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:391; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:422; clsPagos360.Registrar_Solicitudes — RN.Cobranzas/clsPagos360.cs:2293 |
| 903 | VAR | Mixto: Texto | Url a redireccionar al quedar un pago pendiente en pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:392; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:423; clsPagos360.Registrar_Solicitudes — RN.Cobranzas/clsPagos360.cs:2294 |
| 904 | VAR | Mixto: Lógico/Numérico | Acepta pago online | clsWeb_CoopOnline.crearCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1231; clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:1999; clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:393; (+1 más) |
| 905 | VAR | Mixto: Lógico | Se puede pagar luego del vencimiento 3 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:394; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:425 |
| 906 | VAR | Mixto: Entero | Monto mínimo para pagar online | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:395; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:426 |
| 907 | VAR | Mixto: Texto | Url a redireccionar al quedar un pago rechazado en pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:396; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:427; clsPagos360.Registrar_Solicitudes — RN.Cobranzas/clsPagos360.cs:2295 |
| 908 | VAR | Mixto: Lógico | Usar primer importe luego del tercer vencimiento | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:397; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:428; Pagos360.Importar — RN.Cobranzas.Entidades.PR/Pagos360.cs:56 |
| 909 | VAR | Mixto: Texto | Métodos de pago excluídos — _obs: non_banking,link_pagos,banelco_pmc_ | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:401; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:432 |
| 914 | VAR | Mixto: Entero/Lógico | Cantidad de dias máximo desde el último vencimiento para pagar en web | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:402; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:433; clsSocios.GenerarClaveWeb — RN.Titulares/clsSocios.cs:5129 |
| 1001 | VAR | Lógico | Vuelto proporcional en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1002 | VAR | Lógico | Sin Recargo a Jubilados | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:462 |
| 1011 | VAR | Entero (lista de opciones) | Forma en la que se difieren los intereses de facturas — opciones: No Diferir; Diferir Intereses de Mora; Diferir Todos los Intereses — _obs: No Diferir_ | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:463 |
| 1012 | VAR | Lógico | Vuelto a partir del último ingreso | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1015 | VAR | Lógico | No Da vuelto en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1056 | VAR | Lógico | Emitir facturas por intereses Agrupadas por TIPO | clsWeb_CoopOnline.ValidarImpuestos — Agente.Clases/clsWeb_CoopOnline.cs:2427; clsRegistracionCobranza.RegistrarIntereses — RN.Cobranzas/clsRegistracionCobranza.cs:666; clsProcoop_Integra.ValidarImpuestos — RN.Varios.Generales/clsProcoop_Integra.cs:4307 |
| 2055 | VAR | Entero (lista de opciones) | Código de Barra por defecto en cobranza | Codigo_Base.Get_CodigoBarras — RN.Facturacion.CodigoBarra/Codigo_Base.cs:309; Codigo_Base.Get_TipoCodigos — RN.Facturacion.CodigoBarra/Codigo_Base.cs:739 |
| 2056 | VAR | Entero (FK a tabla) | Categoría para deposito de cobranza por entidades — FK `CAT_BANC.CAT_COMP` | clsAnulacionCobranza.Anular — RN.Cobranzas/clsAnulacionCobranza.cs:133; clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.Add_RESBAN_byCaja — RN.Cobranzas/clsRegistracionCobranza.cs:1787; (+3 más) |
| 2069 | VAR | Numérico (FK a tabla) | Concepto para Recargo con Tarjeta de Credito. — FK `PROD_SER.COD_PRO` | clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarRecargosPorMedioPago — RN.Cobranzas/clsRegistracionCobranza.cs:1256 |
| 2070 | VAR | Numérico (FK a tabla) | Concepto para Recargo por Transferencia. — FK `PROD_SER.COD_PRO` | clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarRecargosPorMedioPago — RN.Cobranzas/clsRegistracionCobranza.cs:1241 |
| 2078 | VAR | Mixto | Forma de Cobro de interes entre Vencimientos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2080 | VAR | Numérico (FK a tabla) | Concepto para interés Entre Vencimiento — FK `PROD_SER.COD_PRO` | InfoImporte.CalcularIIBB_PERC_EntreVto — RN.Cobranzas/clsCobranzas.cs:278; clsRegistracionCobranza.ValidarCobranza — RN.Cobranzas/clsRegistracionCobranza.cs:574; clsRegistracionCobranza.RegistrarIntereses — RN.Cobranzas/clsRegistracionCobranza.cs:722 |
| 2248 | VAR | Entero (lista de opciones) | Indica cuando debe mostrar el formulario de Donación en la Caja — opciones: Nunca; Siempre; Solo si existe vuelto — _obs: Nunca_ | PropiedadesCaja.Cargar_CobranzaLocal — RN.Cobranzas/clsCobranzaCaja.cs:356 |
| 2249 | VAR | Entero (FK a tabla) | Tipo de cuota para comprobantes Generados desde caja — FK `TIPO_FAC.COD_TPFC` — _obs: En caso de indicar un tipo, todos los comprobantes que se generen desde la caja seran de este tipo, sin importar que tipo de comprobante se este cobrando_ | clsRegistracionCobranza.RegistrarIntereses — RN.Cobranzas/clsRegistracionCobranza.cs:774 |
| 2255 | VAR | Texto | Codigo de convenio de entidad recaudadora por defecto | Codigo_Base.Get_CodigoBarras — RN.Facturacion.CodigoBarra/Codigo_Base.cs:313 |
| 2267 | VAR | Entero (lista de opciones) | Origen de comprobantes para Exportacion de archivos de cobranza por defecto — opciones: Facturas; Talon Sumado; Cuotas de Gas — _obs: Facturas_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2270 | VAR | Lógico | Imprimir Operación de Caja en vez de recibo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2296 | VAR | Texto | CUIT de Administrador de Cobranza de Banco Roela | E_Banelco_Roela.Exportar — RN.Cobranzas.Entidades.BAT/E_Banelco_Roela.cs:54; E_SIRO.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO.cs:161; E_SIRO_Ext.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO_Ext.cs:161 |
| 2300 | VAR | Texto | Codigos de impuesto a excluir en calculo de recargo por mora — _obs: Valores separados por coma (Ej:1,2,3)_ | clsCobranzas.Get_Datos_Factura — RN.Cobranzas/clsCobranzas.cs:2973 |
| 2337 | VAR | Lógico | Anular talón sumado automaticamente al registrar cobranza si no se paga completo | clsRegistracionCobranza.Anular_TalonesSumados — RN.Cobranzas/clsRegistracionCobranza.cs:1458 |
| 2338 | VAR | Lógico | Mostrar icono de validacion al seleccionar comprobantes a pagar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2349 | VAR | Lógico | Mostrar observación del domicilio del servicio en busqueda por cuenta | frmSeleccionar_InfoSocios.consultaTitular1_ResultadoBusqueda — Cfg.Forms/frmSeleccionar_InfoSocios.cs:204; frmSeleccionar_InfoSocios_Min.consultaTitular1_ResultadoBusqueda — Cfg.Forms/frmSeleccionar_InfoSocios_Min.cs:156 |
| 2355 | VAR | Lógico | Exigir pago de talón sumado completo en caja | clsCobranzaCaja.Validar_CobranzaLocal_Talones — RN.Cobranzas/clsCobranzaCaja.cs:1986 |
| 2356 | VAR | Lógico | Discriminar interés entre vencimiento e interés por mora en calculo de recargo en caja | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:471; EntidadDigital.Get_DiferenciaPago — RN.Cobranzas/EntidadDigital.cs:989; Mercado_Pago.Importar — RN.Cobranzas.Entidades.PR/Mercado_Pago.cs:89; (+1 más) |
| 2357 | VAR | Entero | Tiempo de espera por billete en Autogestión | clsLectorBilletes.ObtenerBilletes — RN.Varios.Generales/clsLectorBilletes.cs:212 |
| 2361 | VAR | Lógico | Imprimir Automáticamente factura de Prepaga | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2362 | VAR | Lógico | Firmar y marcar como entregado automáticamente las ordenes de pago por caja | clsRegistracionCobranza.Registrar_PagoProveedor — RN.Cobranzas/clsRegistracionCobranza.cs:530 |
| 2363 | VAR | Lógico | Aplicar proporcionalidad en cálculo de recargo entre vto. en caja | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:472; InfoCobranza.Recargo — RN.Cobranzas/clsCobranzas.cs:919 |
| 2364 | VAR | Lógico | No mostrar Vista Previa en Recibo / Operación de Caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2371 | VAR | Lógico | No permitir venta de prepaga al no poseer un medidor prepago configurado | clsProcoop_Integra.GenerarInfoCobranzaPrepaga — RN.Varios.Generales/clsProcoop_Integra.cs:4642; clsProcoop_Integra.GetConsultaTitulares — RN.Varios.Generales/clsProcoop_Integra.cs:7545 |
| 2385 | VAR | Entero | Cantidad de días a partir del vencimiento 2 que deben transcurrir para que se excluyan los comprobantes en la caja y consulta de deuda | InfoFiltros.InfoFiltros — RN.Cobranzas/clsCobranzas.cs:80 |
| 2389 | VAR | Mixto: Entero | Metodos de pago disponibles en cobranza local de Pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:398; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:429 |
| 2390 | VAR | Mixto: Entero | Metodos de pago disponibles en cobranza en entidad de Pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:400; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:431 |
| 2391 | VAR | Lógico | Permitir Venta de Prepaga en AutoGestion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2392 | VAR | Lógico | Permitir Cobranza de Facturas en AutoGestion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2394 | VAR | Lógico | No permitir Anular operaciones de Cobranza generadas por otro usuario | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2411 | VAR | Lógico | Mostrar advertencia en caja al pagar un comprobante asociado a un servicio desconectado | clsCobranzaCaja.Validar_CobranzaLocal_ServicioDesconectado — RN.Cobranzas/clsCobranzaCaja.cs:1842 |
| 2412 | VAR | Entero (FK a tabla) | Autogestión - Tipo de cuota para Anticipos Generados desde Cobranza — FK `TIPO_FAC.COD_TPFC` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2420 | VAR | Lógico | Generar OT de alta de servicio luego de realizar una cobranza de un servicio desconectado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2436 | VAR | Lógico | Mostrar observación del domicilio de la cuenta en busqueda por cuenta | frmSeleccionar_InfoSocios.consultaTitular1_ResultadoBusqueda — Cfg.Forms/frmSeleccionar_InfoSocios.cs:205; frmSeleccionar_InfoSocios_Min.consultaTitular1_ResultadoBusqueda — Cfg.Forms/frmSeleccionar_InfoSocios_Min.cs:157 |
| 2441 | VAR | Lógico | Imprimir Automáticamente en Consulta de Deuda al Marcar Comprobantes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2451 | VAR | Lógico | Mostrar Fecha de Vencimiento de la Facturas con entregas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2452 | VAR | Lógico | Generar Siempre recibo oficial en operaciones de caja | clsWeb_CoopOnline.RegistrarVenta — Agente.Clases/clsWeb_CoopOnline.cs:2144; clsWeb_CoopOnline.RegistrarCobranza — Agente.Clases/clsWeb_CoopOnline.cs:2187; clsComprobanteVenta.Guardar — RN.Facturacion/clsComprobanteVenta.cs:646; (+1 más) |
| 2453 | VAR | Lógico | Mostrar Aviso en consulta de deuda si un titular esta notificado | clsCobranzaCaja.Validar_CobranzaLocal_TitularNotificado — RN.Cobranzas/clsCobranzaCaja.cs:1777 |
| 2473 | VAR | Lógico | Mostrar notas de cuenta en caja al buscar por número de cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2487 | VAR | Fecha (texto) | Fecha de cálculo de intereses (fija) a utilizar en cobranza local | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2489 | VAR | Entero (FK a tabla) | Usuario para registración de Venta de Prepaga y Cobranza - COOPONLINE — FK `USERS.COD_USER` — _obs: El Usuario debe tener una CAJA asignada_ | clsWeb_CoopOnline.ValidarConfiguracion — Agente.Clases/clsWeb_CoopOnline.cs:817; clsInformes_Cobranzas.GetFacturas — RN.Cobranzas/clsInformes_Cobranzas.cs:3028 |
| 2492 | VAR | Mixto: Texto | Usuario de acceso al servicio de SIRO | clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:1995; clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:144; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:160; (+1 más) |
| 2493 | VAR | Mixto: Texto | Clave de acceso al servicio de SIRO | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:145; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:161; clsWEB.ConfigurarSIRO — RN.Titulares/clsWEB.cs:1416 |
| 2494 | VAR | Mixto: Texto | Url a redireccionar al realizar un pago exitoso en SIRO | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:146; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:162; clsWEB.ConfigurarSIRO — RN.Titulares/clsWEB.cs:1418 |
| 2495 | VAR | Mixto: Texto | Url a redireccionar al quedar un pago rechazado en SIRO | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:147; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:163; clsWEB.ConfigurarSIRO — RN.Titulares/clsWEB.cs:1419 |
| 2499 | VAR | Texto | Mail copia para la notificación de Venta de Prepaga - COOPONLINE | clsWeb_CoopOnline.AutorizarPrepaga — Agente.Clases/clsWeb_CoopOnline.cs:1642; clsWeb_CoopOnline.AutorizarCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1814 |
| 2500 | VAR | Mixto: Lógico | Acepta pago online SIRO | clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:1995; clsWeb_CoopOnline.GetMedioPago — Agente.Clases/clsWeb_CoopOnline.cs:2276; clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:148; (+2 más) |
| 2501 | VAR | Texto | URL endpoint pago online | clsWEB.SincronizarParametros — RN.Titulares/clsWEB.cs:1269 |
| 2508 | VAR | Entero (lista de opciones) | Metodologia de planes de vivienda — opciones: Estandar; Las Varillas — _obs: Estandar_ | clsViviendas.Get_InfoPlan — RN.Titulares/clsViviendas.cs:545 |
| 2510 | VAR | Lógico | Permitir minimizar formulario de cobranza local | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2513 | VAR | Entero (lista de opciones) | Modo de selección de pago a proveedores, en caja — opciones: Seleccionar Proveedor; Seleccionar Comprobante — _obs: Seleccionar Proveedor_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2523 | VAR | Entero (lista de opciones) | Selección por defecto en selección de vencimiento de comprobantes en caja — opciones: Todos los comprobantes marcados; Solo el comprobante seleccionado — _obs: Todos los comprobantes marcados_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2524 | VAR | Lógico | Mantener control enfocado luego de realizar una búsqueda de comprobantes en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2553 | VAR | Mixto | Access_Tokken del servicio de Mercado Pago | clsMercadoPago.Load_Config — RN.Cobranzas/clsMercadoPago.cs:56; clsMercadoPago.Save_Config — RN.Cobranzas/clsMercadoPago.cs:73 |
| 2554 | VAR | Mixto | Url a redireccionar al realizar un pago exitoso en Mercado Pago | clsMercadoPago.Load_Config — RN.Cobranzas/clsMercadoPago.cs:57; clsMercadoPago.Save_Config — RN.Cobranzas/clsMercadoPago.cs:74 |
| 2555 | VAR | Mixto | Url a redireccionar al quedar un pago rechazado en Mercado Pago | clsMercadoPago.Load_Config — RN.Cobranzas/clsMercadoPago.cs:58; clsMercadoPago.Save_Config — RN.Cobranzas/clsMercadoPago.cs:75 |
| 2562 | VAR | Lógico | Mostrar interes entre vto en columna separada en caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2566 | VAR | Lógico | Mostrar interés completo en consulta de deuda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2567 | VAR | Lógico | Autogestión - Preguntar Si permite Venta en Efectivo al iniciar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2574 | VAR | Lógico | Autogestión - Permitir buscar cuenta y titular por código QR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2577 | VAR | Lógico | Autogestión - Permitir utilizar créditos pendientes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2579 | VAR | Mixto | Fecha de inicio de Mercado Pago en procoop 10 | clsMercadoPago.Load_Config — RN.Cobranzas/clsMercadoPago.cs:53; clsMercadoPago.Save_Config — RN.Cobranzas/clsMercadoPago.cs:77 |
| 2585 | VAR | Entero | Días por defecto, para vencimiento de los talones generados en caja y Cooponline | clsWeb_CoopOnline.crearCobranza — Agente.Clases/clsWeb_CoopOnline.cs:1251 |
| 2586 | VAR | Lógico | Permitir cobrar facturas bloqueadas en caja | Importador_Base.Validar_ComprobanteBloqueado — RN.Cobranzas.Entidades/Importador_Base.cs:2158 |
| 2593 | VAR | Entero | Días por defecto, para vencimiento de las facturas con presupuestos en PMOVIL | clsPMovil_Venta.Guardar_ComprobanteVta — RN.Varios.PMovil/clsPMovil_Venta.cs:294 |
| 2594 | VAR | Lógico | Validar medidores de DISCAR antes de hacer ventas en APP y Autogestión | Discar.ValidarPreVenta — RN.Varios.Telemed.Telemedicion/Discar.cs:1477 |
| 2596 | VAR | Lógico | Permitir cobrar talones de facturas bloqueadas en caja | Importador_Base.Validar_ComprobanteBloqueado — RN.Cobranzas.Entidades/Importador_Base.cs:2162 |
| 2597 | VAR | Entero | Cantidad de decimales en cantidad y precio del producto — _obs: La modificación de la cantidad de decimales se aplicará al momento de querer agregar/modificar un ítem de factura o en remito. Si este parámetro es 0 o mayor a _ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2613 | VAR | Lógico | Autogestión - No habilitar preview de facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2614 | VAR | Lógico | Autogestión - Habilitar impresión de facturas | frmPrintPreview.frmPrintPreview_Load — Cfg/Configuracion/frmPrintPreview.cs:547 |
| 2615 | VAR | Texto | Autogestión - Impresora para impresión de facturas | frmPrintPreview.btnImprimir_ItemClick — Cfg/Configuracion/frmPrintPreview.cs:2303 |
| 2620 | VAR | Lógico | Permitir Generar Links de Pagos con Entidades Fuera de linea | clsWEB.SincronizarParametros — RN.Titulares/clsWEB.cs:1314 |
| 2639 | VAR | Lógico | Generar anticipos automaticos según el tipo de la factura cobrada | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2645 | VAR | Entero (lista de opciones) | Solo Generar Links de Pagos con Entidades Fuera de linea en CoopOnline — opciones: No; Si, solo pago Offline; Si, pago Offline, Online y en caja | clsWeb_CoopOnline.ValidarConfiguracion — Agente.Clases/clsWeb_CoopOnline.cs:815; clsWeb_CoopOnline.ValidarCaja — Agente.Clases/clsWeb_CoopOnline.cs:863; clsWeb_CoopOnline.SubirPDFPagoEfectivo — Agente.Clases/clsWeb_CoopOnline.cs:1446; (+1 más) |
| 2646 | VAR | Lógico | Validar con la fecha de Rendición en cobranzas de entidades recaudadoras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2651 | VAR | Lógico | Descontar anticipo en próxima factura en la importación de archivo por entidad recaudadora | EntidadDigital.CrearAnticipo — RN.Cobranzas/EntidadDigital.cs:466 |
| 2662 | VAR | Lógico | Abrir el formulario de ND/NC Bancaria al aceptar la Cobranza por Terceros | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2664 | VAR | Lógico | Enviar notificacion de cobranzas en venta de prepaga | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:211 |
| 2665 | VAR | Lógico | Enviar notificacion al realizar cobranzas de facturas | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:211 |
| 2666 | VAR | Texto | Url del WebService configurado en la red interna | clsProcoop_Integra.RealizarEnvioNotificacion — RN.Varios.Generales/clsProcoop_Integra.cs:3103 |
| 2674 | VAR | Entero (lista de opciones) | Tipo de envio de notificación en Cobranzas — _obs: " + TipoEnvioNotificacion_Cobranza.Ninguna.ToString() + "_ | Empresa.CrearEmpresa — CapaNucleo/Nucleo.cs:363; clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:211; clsProcoop_Integra.ObtenerDatosTicketPago — RN.Varios.Generales/clsProcoop_Integra.cs:4106; (+1 más) |
| 2677 | VAR | Mixto: Entero | Metodos de pago disponibles en Venta de prepaga | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:399; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:430 |
| 2684 | VAR | Entero (FK a tabla) | Plantilla de Mail para Recibo de Pago — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2686 | VAR | Lógico | Utilizar Tipo el tipo de primer factura al usar concepto de LINK | Exportador_Base.Get_Comprobantes_Talon — RN.Cobranzas.Entidades/Exportador_Base.cs:1123; E_RedLink_Continuo.Exportar — RN.Cobranzas.Entidades.PR/E_RedLink_Continuo.cs:16 |
| 2687 | VAR | Lógico | Permitir quitar el orden automático al cargar comprobantes en la cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2698 | VAR | Lógico | Enviar notas de débito por correo junto al recibo de pago | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2703 | VAR | Mixto: Texto/Entero/Lógico | Utilizar Cuadro en Venta de prepaga | clsDatosFacturacion.CargarConfiguracionPrepaga — RN.Facturacion/clsDatosFacturacion.cs:515 |
| 2713 | VAR | Lógico | Generar y Confirmar OT de alta de servicio luego de realizar una cobranza de un servicio desconectado | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:270; clsRegistracionCobranza.GenerarConfirmarOrdenTrabajo — RN.Cobranzas/clsRegistracionCobranza.cs:374; clsSocios.Reconectar_SERSOC — RN.Titulares/clsSocios.cs:2508; (+1 más) |
| 2719 | VAR | Lógico | Enviar un recibo por cada una de las cuentas que se cobran en una misma operación de caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2720 | VAR | Mixto: Texto | Cuotas Excluidas de Pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:405; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:436 |
| 2725 | VAR | Lógico | No se permite registro de Cheques con el mismo número | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2726 | VAR | Mixto: Lógico | Generar QR de Pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:403; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:434; clsPagos360.EstaConfigurado — RN.Cobranzas/clsPagos360.cs:943; (+3 más) |
| 2727 | VAR | Mixto: Texto | Id QR Pagos 360 | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:404; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:435; clsPagos360.EstaConfigurado — RN.Cobranzas/clsPagos360.cs:945; (+2 más) |
| 2739 | VAR | Lógico | Permitir apertura de Caja Automatica en Venta de Productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2743 | VAR | Mixto: Texto | Tarjetas de crédito excluídas | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:406; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:437 |
| 2746 | VAR | Entero | Pago Facil - Cantidad de días posteriores a la fecha de vto | E_PagoFacil.Exportar — RN.Cobranzas.Entidades.COR/E_PagoFacil.cs:17 |
| 2747 | VAR | Lógico | Mostrar columna Teléfono en administrador de Pagos360 | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2752 | VAR | Lógico | No Registrar Ventas de prepaga con Procoop INTEGRA — _obs: En caso de estar habilitada, los registros se marcan como pagos pero los registra el agente_ | clsWeb_CoopOnline.AutorizarPrepaga — Agente.Clases/clsWeb_CoopOnline.cs:1569 |
| 2756 | VAR | Mixto | Client ID Naranja X | clsNaranjaX.Get_Config — RN.Cobranzas/clsNaranjaX.cs:52; clsNaranjaX.Save_Config — RN.Cobranzas/clsNaranjaX.cs:70 |
| 2757 | VAR | Mixto | Client Secret Naranja X | clsNaranjaX.Get_Config — RN.Cobranzas/clsNaranjaX.cs:55; clsNaranjaX.Save_Config — RN.Cobranzas/clsNaranjaX.cs:71 |
| 2758 | VAR | Mixto | Audience Naranja X | clsNaranjaX.Get_Config — RN.Cobranzas/clsNaranjaX.cs:58; clsNaranjaX.Save_Config — RN.Cobranzas/clsNaranjaX.cs:72 |
| 2759 | VAR | Texto | QR Pagos 360 - Nombre Cooperativa | clsPagos360.Get_QR_PagoOnLine — RN.Cobranzas/clsPagos360.cs:1607; PR_Pagos360_QR.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_Pagos360_QR.cs:25 |
| 2760 | VAR | Texto | QR Pagos 360 - Codigo Postal | clsPagos360.Get_Qr_Estatico — RN.Cobranzas/clsPagos360.cs:1563; clsPagos360.Get_QR_PagoOnLine — RN.Cobranzas/clsPagos360.cs:1613; clsPagos360.Registrar_Solicitudes — RN.Cobranzas/clsPagos360.cs:2297; (+2 más) |
| 2761 | VAR | Texto | QR Pagos 360 - Localidad | clsPagos360.Get_Qr_Estatico — RN.Cobranzas/clsPagos360.cs:1561; clsPagos360.Get_QR_PagoOnLine — RN.Cobranzas/clsPagos360.cs:1610; clsPagos360.Get_QR_Data — RN.Cobranzas/clsPagos360.cs:2065; (+1 más) |
| 2762 | VAR | Mixto: Texto | Pos_ID Naranja X | clsNaranjaX.Get_Config — RN.Cobranzas/clsNaranjaX.cs:61; clsNaranjaX.Save_Config — RN.Cobranzas/clsNaranjaX.cs:73; clsNaranjaX.Create_Request — RN.Cobranzas/clsNaranjaX.cs:232; (+1 más) |
| 2765 | VAR | Mixto | Guid Macro | clsMacro.Save_Config — RN.Cobranzas/clsMacro.cs:269; clsMacro.Load_Config — RN.Cobranzas/clsMacro.cs:287 |
| 2766 | VAR | Mixto | Frase Macro | clsMacro.Save_Config — RN.Cobranzas/clsMacro.cs:270; clsMacro.Load_Config — RN.Cobranzas/clsMacro.cs:288 |
| 2767 | VAR | Mixto | Secret Key Macro | clsMacro.Save_Config — RN.Cobranzas/clsMacro.cs:271; clsMacro.Load_Config — RN.Cobranzas/clsMacro.cs:289 |
| 2768 | VAR | Mixto | Access Token Macro | clsMacro.Save_Config — RN.Cobranzas/clsMacro.cs:272; clsMacro.Load_Config — RN.Cobranzas/clsMacro.cs:290 |
| 2772 | VAR | Lógico | Permitir pago con QR en cobranza local | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2773 | VAR | Texto | QR Pagos 360 - MCC | clsPagos360.Get_QR_PagoOnLine — RN.Cobranzas/clsPagos360.cs:1616; PR_Pagos360_QR.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_Pagos360_QR.cs:34 |
| 2774 | VAR | Entero (lista de opciones) | Entidad por defecto a utilizar en cobranza web | clsWeb_CoopOnline.GenerarSolicitud — Agente.Clases/clsWeb_CoopOnline.cs:1985; clsWeb_CoopOnline.GetMedioPago — Agente.Clases/clsWeb_CoopOnline.cs:2270 |
| 2775 | VAR | Mixto: Lógico | SIRO - Verificar primer digito de ID en archivo de cobranza | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:149; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:165; clsSIRO.ObtenerPagos_APISIRO — RN.Cobranzas/clsSIRO.cs:709; (+1 más) |
| 2776 | VAR | Mixto: Entero | SIRO - Tiempo de retardo entre solicitudes | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:150; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:166; clsSIRO.ObtenerPagos_APISIRO — RN.Cobranzas/clsSIRO.cs:765; (+1 más) |
| 2779 | VAR | Entero | Débito automático Pagos360 - Día de vto a partir del cual se pasa el débito al mes siguiente (por defecto es 19) | clsPagos360.Registrar_Solicitudes_Debito — RN.Cobranzas/clsPagos360.cs:2562 |
| 2784 | VAR | Fecha (texto) | Fecha limite para particularidades en importadores y exportadores | BancoSantaFe.Importar — RN.Cobranzas.Entidades.CEN/BancoSantaFe.cs:47; NvoBcoSantaFe.Importar — RN.Cobranzas.Entidades.HA/NvoBcoSantaFe.cs:96; E_DebitoDirecto.Exportar — RN.Cobranzas.Entidades.JOSE/E_DebitoDirecto.cs:17; (+10 más) |
| 2789 | VAR | Lógico | Procesar cobranzas de CB Y QR en facturas/talones a través del Integra | clsWeb_CoopOnline.AutorizarPagos — Agente.Clases/clsWeb_CoopOnline.cs:592; clsProcoop_Integra.GetActualizarEstadoPago — RN.Varios.Generales/clsProcoop_Integra.cs:6510 |
| 2793 | VAR | Mixto | Api Key PayFun | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:82; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:96 |
| 2794 | VAR | Mixto | Access Token PayFun | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:83; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:97 |
| 2795 | VAR | Mixto: Texto | Url a redireccionar al salir de la pagina de PayFun | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:84; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:98; clsPayFun.Generar_Solicitud — RN.Cobranzas/clsPayFun.cs:301 |
| 2796 | VAR | Mixto: Texto | Url de notificación de pagos | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:85; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:99; clsPayFun.Generar_Solicitud — RN.Cobranzas/clsPayFun.cs:302 |
| 2798 | VAR | Texto | QR Siro - Cuit del titular de la cuenta | clsSIRO.Get_DatosQR — RN.Cobranzas/clsSIRO.cs:1543; PR_SIRO_QR.DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:52 |
| 2799 | VAR | Texto | QR Siro - CBU del convenio | clsSIRO.Get_DatosQR — RN.Cobranzas/clsSIRO.cs:1544; PR_SIRO_QR.Get_DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:154 |
| 2800 | VAR | Texto | QR Siro - Nombre de convenio | clsSIRO.Get_DatosQR — RN.Cobranzas/clsSIRO.cs:1545; PR_SIRO_QR.Get_DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:155 |
| 2801 | VAR | Texto | QR Siro - Provincia del ente asociado al Convenio | clsSIRO.Get_DatosQR — RN.Cobranzas/clsSIRO.cs:1546; PR_SIRO_QR.Get_DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:156 |
| 2802 | VAR | Texto | QR Siro - Codigo postal del ente asociado al convenio | clsSIRO.Get_DatosQR — RN.Cobranzas/clsSIRO.cs:1547; PR_SIRO_QR.Get_DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:157 |
| 2804 | VAR | Mixto: Texto | CUIT de acceso al servicio de SIRO - API Gestion | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:151; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:167; clsSIRO.Get_Pagos — RN.Cobranzas/clsSIRO.cs:498; (+2 más) |
| 2805 | VAR | Mixto: Texto | Clave de acceso al servicio de SIRO - API Gestion | clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:152; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:168; clsSIRO.EstaConfigurado — RN.Cobranzas/clsSIRO.cs:1194; (+1 más) |
| 2806 | VAR | Fecha (texto) | Fecha de última consulta de SIRO - API Gestion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2807 | VAR | Lógico | Utiliza el servicio de SIRO - API Gestion | clsSIRO.EstaConfigurado — RN.Cobranzas/clsSIRO.cs:1190; Importador_Base.Archivo_ObtenerFiltroBusqueda — RN.Cobranzas.Entidades/Importador_Base.cs:1102; E_SIRO.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO.cs:164; (+5 más) |
| 2816 | VAR | Mixto | Medios de pago PayFun | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:87; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:101 |
| 2818 | VAR | Lógico | Excluir período al generar archivo de facturación de SIRO | E_SIRO.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO.cs:46; E_SIRO_Ext.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO_Ext.cs:46 |
| 2820 | VAR | Mixto | Informar deuda total PayFun | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:86; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:100 |
| 2822 | VAR | Mixto | Importe minimo aceptado por PayFun con pagofacil como medio de pago | clsPayFun.Load_Config — RN.Cobranzas/clsPayFun.cs:88; clsPayFun.Save_Config — RN.Cobranzas/clsPayFun.cs:102 |
| 2826 | VAR | Lógico | Discriminar IIBB en interés entre vencimiento en calculo de recargo en caja | clsWeb_CoopOnline.ValidarImpuestos — Agente.Clases/clsWeb_CoopOnline.cs:2486; InfoImporte.AplicarIIBB — RN.Cobranzas/clsCobranzas.cs:189; InfoCobranza.Get_Recargo — RN.Cobranzas/clsCobranzas.cs:2064; (+10 más) |
| 2828 | VAR | Lógico | Relacionar servicio a la cuota generada por intereses diferidos | clsRegistracionCobranza.RegistrarIntereses — RN.Cobranzas/clsRegistracionCobranza.cs:834 |
| 2865 | VAR | Lógico | Autogestión - No tomar créditos de anticipos automáticamente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2869 | VAR | Entero | Código de barras SIRO - Cantidad de dias máximo desde el último vencimiento para pagar | PR_BancoRoela.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_BancoRoela.cs:134; PR_BancoRoela_Ext.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_BancoRoela_Ext.cs:111; PR_SIRO_0448.Get_CodigoBarras — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_0448.cs:28 |
| 2877 | VAR | Mixto | username PagoTic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:70; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:84 |
| 2878 | VAR | Mixto | password PagoTic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:71; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:85 |
| 2879 | VAR | Mixto | client id PagoTic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:73; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:86 |
| 2880 | VAR | Mixto | client_secret PagoTic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:74; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:87 |
| 2881 | VAR | Mixto: Texto | Url a redireccionar al salir de la pagina de Pago Tic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:75; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:88; clsPagostic.Crear_solicitud — RN.Cobranzas/clsPagostic.cs:291 |
| 2882 | VAR | Mixto: Texto | Url de notificación de pagos de Pago Tic | clsPagostic.Load_Config — RN.Cobranzas/clsPagostic.cs:76; clsPagostic.Save_Config — RN.Cobranzas/clsPagostic.cs:89; clsPagostic.Crear_solicitud — RN.Cobranzas/clsPagostic.cs:292 |
| 2883 | VAR | Mixto: Texto | Url al volver de la pagina de Pago Tic | clsPagostic.Crear_solicitud — RN.Cobranzas/clsPagostic.cs:293 |
| 2885 | VAR | Lógico | Utiliar QR de Naranja X en facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2908 | VAR | Texto (FK a tabla) | Débitos Automáticos - Tipo de cuota para Anticipos Generados desde importación de débitos automáticos — FK `TIPO_FAC.COD_TPFC` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2909 | VAR | Lógico | Alerta de saldo a favor al leer códigos de barra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2910 | VAR | Lógico | Habilitar check Excluir financiaciones en consulta de deuda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2911 | VAR | Lógico | ATM - Botón Consulta/Impresion de facturas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2912 | VAR | Lógico | Mostrar calculadora ampliada para DNI y codigo de seguridad en cobranza AutoGestion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2917 | VAR | Lógico | Validar si tiene pendiente una desconexion por mora y cancelarla, al realizar una cobranza | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2920 | VAR | Mixto: Lógico | Pagos360 - Utiliza QR Estático | PropiedadesCaja.usaQrEstatico — RN.Cobranzas/clsCobranzaCaja.cs:162; clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:407; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:438; (+1 más) |
| 2921 | VAR | Mixto: Texto | Pagos360 - Url QR estático | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:408; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:439 |
| 2922 | VAR | Mixto: Texto | Pagos360 - ApiKey QR Estático | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:409; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:440 |
| 2926 | VAR | Lógico | Tener en cuenta servicios que no requieren tecnica y reconectar directamente | clsCobranzaCaja.Get_SersocReconexion — RN.Cobranzas/clsCobranzaCaja.cs:1885 |
| 2929 | VAR | Lógico | Preguntar si se cobra la reimpresión del comprobante segun permiso | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2932 | VAR | Lógico | Controlar deuda vencida por cuenta al ingresar codigo de barras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2939 | VAR | Mixto: Lógico | SIRO - Utiliza QR Estático | PropiedadesCaja.usaQrEstatico — RN.Cobranzas/clsCobranzaCaja.cs:162; clsSIRO.Get_Config — RN.Cobranzas/clsSIRO.cs:153; clsSIRO.Save_Config — RN.Cobranzas/clsSIRO.cs:169; (+1 más) |
| 2940 | VAR | Lógico | Ocultar Deuda Vencida en venta de prepaga | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2951 | VAR | Lógico | Excluir registros en 0, Informe planilla caja | clsInformes_Caja.LoadFiltro_PlanillaCaja — RN.Cobranzas/clsInformes_Caja.cs:889 |
| 2956 | VAR | Mixto: Texto | client_id SiPago | clsSiPago.Get_Config — RN.Cobranzas/clsSiPago.cs:43; clsSiPago.Save_Config — RN.Cobranzas/clsSiPago.cs:120 |
| 2957 | VAR | Mixto: Texto | client_secret SiPago | clsSiPago.Get_Config — RN.Cobranzas/clsSiPago.cs:44; clsSiPago.Save_Config — RN.Cobranzas/clsSiPago.cs:121 |
| 2958 | VAR | Mixto: Texto | Url a redireccionar al realizar un pago exitoso en SiPago | clsSiPago.Get_Config — RN.Cobranzas/clsSiPago.cs:45; clsSiPago.Save_Config — RN.Cobranzas/clsSiPago.cs:122 |
| 2959 | VAR | Mixto: Texto | Url a redireccionar al quedar un pago rechazado en SiPago | clsSiPago.Get_Config — RN.Cobranzas/clsSiPago.cs:46; clsSiPago.Save_Config — RN.Cobranzas/clsSiPago.cs:123 |
| 2960 | VAR | Mixto: Texto | Url de webhook SiPago | clsSiPago.Get_Config — RN.Cobranzas/clsSiPago.cs:47; clsSiPago.Save_Config — RN.Cobranzas/clsSiPago.cs:124 |
| 2969 | VAR | Mixto: Texto | Pronto Pago - Public key | clsProntoPago.Get_Config — RN.Cobranzas/clsProntoPago.cs:40; clsProntoPago.Save_Config — RN.Cobranzas/clsProntoPago.cs:49 |
| 2970 | VAR | Mixto: Texto | Pronto Pago - Private key | clsProntoPago.Get_Config — RN.Cobranzas/clsProntoPago.cs:41; clsProntoPago.Save_Config — RN.Cobranzas/clsProntoPago.cs:50 |
| 2971 | VAR | Mixto: Texto | Pronto Pago - Servicio | clsProntoPago.Get_Config — RN.Cobranzas/clsProntoPago.cs:42; clsProntoPago.Save_Config — RN.Cobranzas/clsProntoPago.cs:51 |
| 2975 | VAR | Texto | QR Siro - MCC | PR_SIRO_QR.Get_DatosQR — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:158 |
| 2980 | VAR | Lógico | Ocultar Botones Informativos en Autogestion | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2981 | VAR | Mixto: Lógico | Pagos360 - Obtener cobranzas via API | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:410; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:441 |
| 2988 | VAR | Lógico | Filtrar Ordenes de Pago Firmadas en caja en efectivo | clsCobranzas.Get_PagoProveedores — RN.Cobranzas/clsCobranzas.cs:2835 |
| 2994 | VAR | Lógico | Procesar archivos de rendición de entidades a través del agente | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2010 |
| 2995 | VAR | Entero | Agente - Hora en la que procesa archivo de rendición | clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2012 |
| 2999 | VAR | Mixto: Entero | Pagos360 - Concepto al generar reversión | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:411; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:442 |
| 3000 | VAR | Mixto: Lógico | Pagos360 - Generar comprobante formal en reversión | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:412; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:443 |
| 3001 | VAR | Mixto: Lógico | Pagos360 - Generar 1 reversión por cuenta | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:413; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:444 |
| 3002 | VAR | Mixto: Lógico | Pagos360 - Bloquear pago online al generar reversión | clsPagos360.Get_Config — RN.Cobranzas/clsPagos360.cs:414; clsPagos360.Save_Config — RN.Cobranzas/clsPagos360.cs:445 |
| 3005 | VAR | Lógico | Modificar nombre del archivo del ente luego de ser procesado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3006 | VAR | Entero | Código de de pago electrónico SIRO - Cantidad de dias máximo desde el último vencimiento para pagar | E_SIRO.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO.cs:19; E_SIRO_Ext.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO_Ext.cs:19 |
| 3023 | VAR | Lógico | Importador 203 - Tomar como fecha de rendición la fecha de importación del archivo | Banelco.Importar — RN.Cobranzas.Entidades.PR/Banelco.cs:29 |
| 3025 | VAR | Texto | Agente - Mail a donde se enviaran errores de la importación de archivos de renición a través del agente | clsServicio_Procoop.Procesar_Archivo_Rendicion — RN.Varios.Generales/clsServicio_Procoop.cs:775 |
| 3033 | VAR | Lógico | Sacar marca de moroso al no reconectar servicio en el pago | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3046 | VAR | Mixto: Texto | Provincia Net - Api Key | clsProvinciaNet.Get_Config — RN.Cobranzas/clsProvinciaNet.cs:465; clsProvinciaNet.Save_Config — RN.Cobranzas/clsProvinciaNet.cs:471 |
| 3047 | VAR | Lógico | SIRO - Permitir pago voluntario de débitos automáticos | E_SIRO.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO.cs:92; E_SIRO_Ext.Exportar — RN.Cobranzas.Entidades.PR/E_SIRO_Ext.cs:92 |
| 3052 | VAR | Numérico | Reversiones – Porcentaje de interés diario a cobrar entre la fecha de pago y la fecha de reversión | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3054 | VAR | Numérico (FK a tabla) | Concepto a facturar por redondeo en cobranza en efectivo — FK `PROD_SER.COD_PRO` | clsCobranzas.Crear_Anticipo_Redondeo — RN.Cobranzas/clsCobranzas.cs:3234 |
| 3055 | VAR | Numérico | Monto máximo para redondeo en cobranza en efectivo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3056 | VAR | Entero (FK a tabla) | Tipo de comprobante para anticipos por redondeo en cobranzas en efectivo — FK `TIPO_FAC.COD_TPFC` | clsCobranzas.Crear_Anticipo_Redondeo — RN.Cobranzas/clsCobranzas.cs:3236 |
| 3059 | VAR | Lógico | Pagos360 - Cobrar comisión por reversión | clsPagos360.CobrarComisionReversion — RN.Cobranzas/clsPagos360.cs:1763 |
| 3069 | VAR | Entero (FK a tabla) | Vendedor por defecto para redondeo en cobranza en efectivo — FK `VENDEDOR.COD_VEN` | clsCobranzas.Crear_Anticipo_Redondeo — RN.Cobranzas/clsCobranzas.cs:3235 |
| 3070 | VAR | Lógico | Generar comprobantes formales en redondeo en cobranza en efectivo | clsCobranzas.Crear_Anticipo_Redondeo — RN.Cobranzas/clsCobranzas.cs:3255 |
| 3073 | VAR | Entero (FK a tabla) | Pagos360 - Concepto a cobrar por comisión de reversión — FK `PROD_SER.COD_PRO` | clsPagos360.CobrarComisionReversion — RN.Cobranzas/clsPagos360.cs:1765 |
| 3077 | VAR | Mixto: Texto | Helipagos - Api Key | clsHelipagos.GetConfig — RN.Cobranzas/clsHelipagos.cs:310; clsHelipagos.SaveConfig — RN.Cobranzas/clsHelipagos.cs:318 |
| 3078 | VAR | Mixto: Texto | Helipagos - Url Exito | clsHelipagos.GetConfig — RN.Cobranzas/clsHelipagos.cs:311; clsHelipagos.SaveConfig — RN.Cobranzas/clsHelipagos.cs:319; clsHelipagos.Registrar_Solicitudes — RN.Cobranzas/clsHelipagos.cs:328 |
| 3079 | VAR | Mixto: Texto | Helipagos - Url Notificacion | clsHelipagos.GetConfig — RN.Cobranzas/clsHelipagos.cs:312; clsHelipagos.SaveConfig — RN.Cobranzas/clsHelipagos.cs:320; clsHelipagos.Registrar_Solicitudes — RN.Cobranzas/clsHelipagos.cs:329 |
| 3083 | VAR | Texto largo | Cambiar texto de cod. de autorización para cupones de tarjetas. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3092 | VAR | Lógico | Permitir Generar archivos para entidades con comprobantes pagados | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3102 | VAR | Lógico | Autogestión - No mostrar comprobantes bloqueados | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3106 | VAR | Lógico | Generar OT de alta de servicio luego de realizar una cobranza de un servicio desconectado | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:270; clsRegistracionCobranza.GenerarConfirmarOrdenTrabajo — RN.Cobranzas/clsRegistracionCobranza.cs:375 |
| 3109 | VAR | Lógico | Permitir venta de prepaga por 0 pesos | clsPrepaga.ValidarComprobante — RN.Cobranzas/clsPrepaga.cs:804; clsFacturacionMasiva.ObtenerFacturas — RN.Facturacion/clsFacturacionMasiva.cs:1230; clsFacturacionServicio.GetItemsServicioMedido — RN.Facturacion/clsFacturacionServicio.cs:2292 |
| 3139 | VAR | Mixto | Url para notificacion de pagos de mercadolibre | clsMercadoPago.Load_Config — RN.Cobranzas/clsMercadoPago.cs:59; clsMercadoPago.Save_Config — RN.Cobranzas/clsMercadoPago.cs:76 |
| 3144 | VAR | Entero | QR SIRO - Cantidad de dias máximo desde el último vencimiento para pagar | PR_SIRO_QR.GenerarQrString — RN.Facturacion.CodigoBarra.Clientes/PR_SIRO_QR.cs:109 |
| 3147 | VAR | Entero (lista de opciones) | Deuda a considerar para reconectar servicios — opciones: Considerar toda la deuda; Solo facturas pasadas del primer vencimiento; Solo facturas pasadas del ultimo vencimiento — _obs: Considerar toda la deuda_ | clsCobranzaCaja.Get_SersocCambioEstado — RN.Cobranzas/clsCobranzaCaja.cs:1934; clsRegistracionCobranza.GetServiciosDesconectadosSinDeuda — RN.Cobranzas/clsRegistracionCobranza.cs:353 |
| 3153 | VAR | Lógico | Tener en cuenta acciones a realizar al realizar cobranza del servicio | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3158 | VAR | Texto | Correos electrónicos para enviar archivos de cobranzas - Tarjeta FECESCOR | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3163 | VAR | Lógico | Validar deuda notificada al generar reconexion | clsRegistracionCobranza.GetServiciosDesconectadosSinDeuda — RN.Cobranzas/clsRegistracionCobranza.cs:355 |
| 3167 | VAR | Lógico | Calcular recargo por mora a partir de conceptos configurados | InfoCobranza.Get_Recargo — RN.Cobranzas/clsCobranzas.cs:1816; clsCobranzas.Get_Datos_Factura — RN.Cobranzas/clsCobranzas.cs:2975 |
| 3169 | VAR | Lógico | Validar que no haya comprobantes repetidos en cobranza local | clsRegistracionCobranza.RegistrarPago — RN.Cobranzas/clsRegistracionCobranza.cs:182 |
| 3176 | VAR | Lógico | Mostrar si hay anticipos generados en el Log en el resultado de importación si incluyese alguno | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3177 | VAR | Entero (FK a tabla) | Concepto al rechazar cupones de tarjeta — FK `PROD_SER.COD_PRO` | clsTesoreria.CrearAnticipoRechazoCupones — RN.Tesoreria/clsTesoreria.cs:1407 |
| 3179 | VAR | Lógico | SIRO - Registrar log de consultas realizadas a la API | clsSIRO.RegistrarLog — RN.Cobranzas/clsSIRO.cs:1409 |
| 3188 | VAR | Lógico | Diferir comisiones al cobrar con cheque | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3199 | VAR | Entero | Provincia Net QR - Cantidad de dias máximo desde el último vencimiento para pagar | clsProvinciaNet.GenerarLoteQr — RN.Cobranzas/clsProvinciaNet.cs:268 |

#### GESTION_DE_MORA (23 parámetros, 13 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 39 | VAR | Lógico | Ignorar Notificaciones previas al incluir una cuenta al proceso de gestión de mora | FiltrosCirculares.FiltrosCirculares — RN.Titulares/clsCirculares.cs:289 |
| 53 | VAR | Lógico | Avisar si cambio la composición de la deuda notificada | clsGestionMora.ValidarNotificaciones — RN.Cobranzas/clsGestionMora.cs:2376 |
| 104 | VAR | Entero | Meses para prescripción de deuda | clsInformes_Mora.LoadFiltro_PrescripcionDeuda — RN.Cobranzas/clsInformes_Mora.cs:178 |
| 295 | VAR | Entero (FK a tabla) | Concepto por cobranza de envio de notificacion — FK `PROD_SER.COD_PRO` | clsGestionMora.Guardar_Notificaciones — RN.Cobranzas/clsGestionMora.cs:990; clsGestionMora.Guardar_Comprobante — RN.Cobranzas/clsGestionMora.cs:1258 |
| 296 | VAR | Numérico | Costo de envio de notificacion | clsGestionMora.Guardar_Notificaciones — RN.Cobranzas/clsGestionMora.cs:996; clsGestionMora.Guardar_Comprobante — RN.Cobranzas/clsGestionMora.cs:1264 |
| 384 | VAR | Lógico | Ignorar si ya está en lista de candidatos | FiltrosCirculares.FiltrosCirculares — RN.Titulares/clsCirculares.cs:290 |
| 2202 | VAR | Entero (FK a tabla) | Instancia inicial por defecto de los Candidatos — FK `INSTANCI.COD_INS` | clsGestionMora.Get_Notificaciones — RN.Cobranzas/clsGestionMora.cs:528; clsInformes_Mora.LoadFiltro_NotificacionesPendientes — RN.Cobranzas/clsInformes_Mora.cs:223; clsInformes_Mora.Get_Datasource_NotificacionesPendientes — RN.Cobranzas/clsInformes_Mora.cs:702; (+3 más) |
| 2203 | VAR | Entero (FK a tabla) | Instancia inicial por defecto de la gestion de mora — FK `INSTANCI.COD_INS` | clsCirculares.Exportar_Excel_ERSeP_DNUN_311_2020 — RN.Titulares/clsCirculares.cs:2607 |
| 2204 | VAR | Entero (FK a tabla) | Instancia final por defecto de la gestion de mora — FK `INSTANCI.COD_INS` | clsCirculares.Exportar_Excel_ERSeP_DNUN_311_2020 — RN.Titulares/clsCirculares.cs:2608 |
| 2205 | VAR | Entero | Días para el vencimiento de Notificaciones entregadas | clsGestionMora.Set_Entrega — RN.Cobranzas/clsGestionMora.cs:869 |
| 2279 | VAR | Lógico | Generar todas las notificaciones como entregadas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2304 | VAR | Lógico | Generar Comprobante de Deuda por Notificación por Defecto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2305 | VAR | Entero (FK a tabla) | Tipo de Cuota por defecto para Comprobante de Deuda notificada — FK `TIPO_FAC.COD_TPFC` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2306 | VAR | Lógico | Incluir Titulares dados de baja en el informe de Circulares por defecto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2322 | VAR | Lógico | Incluir Resumen de las Notificaciones | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2327 | VAR | Lógico | Descartar Cuentas sin Email al generar circulares por Correo Electrónico | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2328 | VAR | Lógico | Imprimir Informe de Excepcion por mora al confirmar alta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2359 | VAR | Lógico | Ignorar valores nulos en la variable de Plantilla Info. Servicio () | Notificaciones.Get_InfoServicioFormateado — RN.Configuraciones.Plantillas/Correspondencia.cs:1455 |
| 2379 | VAR | Lógico | Asignar estado \"En Tecnica\" a la Notificaciones Procesadas en Tratamiento de morosos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2458 | VAR | Lógico | Bloquear Caja al momento de realizar O.T. de cambio de estado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2467 | VAR | Lógico | Solo Verificar instancia inicial al chequear candidatos ya notificados | clsCirculares.GetMorososExistentes — RN.Titulares/clsCirculares.cs:2278 |
| 2919 | VAR | Lógico | Permitir introducir fecha de vencimiento de notificacion anterior al dia de hoy | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3050 | VAR | Lógico | Excluir si ya está en lista de candidatos con el mismo Tipo de Notificación | FiltrosCirculares.FiltrosCirculares — RN.Titulares/clsCirculares.cs:293 |

#### FINANCIACIONES (21 parámetros, 12 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 214 | VAR | Entero (FK a tabla) | Texto para convenio Con Garante — FK `PLANTILLA.COD_PLA` | clsFinanciacion.GetRecCon — RN.Cobranzas/clsFinanciacion.cs:155 |
| 306 | VAR | Entero (lista de opciones) | Forma de registración de Cuotas de Financiación — opciones: Pago con chequera; Pago en Factura Mensual — _obs: Por Nombre_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 307 | VAR | Entero (FK a tabla) | Concepto para interés por Mora — FK `PROD_SER.COD_PRO` | VariablesConsulta.VariablesConsulta — RN.Cobranzas/clsCobranzas.cs:480; clsFinanciacion.GetComprobante — RN.Cobranzas/clsFinanciacion.cs:294; clsFinanciacion.GetFacturaCuota — RN.Cobranzas/clsFinanciacion.cs:393; (+4 más) |
| 308 | VAR | Entero (FK a tabla) | Concepto para cuota en Factura mensual — FK `PROD_SER.COD_PRO` | clsFormasDePago.DistribuirInteresEnCuotas — RN.Cobranzas/clsFormasDePago.cs:452; clsFormasDePago.DistribuirIVA — RN.Cobranzas/clsFormasDePago.cs:554; GetDatosInforme.GetCuotasFinanciacionAdeudadaAFecha — RN.Cobranzas/clsInformes_Financiacion.cs:164; (+4 más) |
| 310 | VAR | Entero (FK a tabla) | Concepto para Deuda de financiación — FK `PROD_SER.COD_PRO` | clsFinanciacion.GetComprobante — RN.Cobranzas/clsFinanciacion.cs:301; clsFinanciacion.GetFacturaCuota — RN.Cobranzas/clsFinanciacion.cs:389; clsCierreDiario.GetItems_Agrupados — RN.Contabilidad/clsCierreDiario.cs:4627; (+1 más) |
| 311 | VAR | Entero (FK a tabla) | Concepto para interés Anterior — FK `PROD_SER.COD_PRO` | clsFinanciacion.GetComprobante — RN.Cobranzas/clsFinanciacion.cs:313; clsFinanciacion.GetFacturaCuota — RN.Cobranzas/clsFinanciacion.cs:397; clsFinanciacion.GetCuotas_SitIvaDistinto — RN.Cobranzas/clsFinanciacion.cs:447; (+2 más) |
| 507 | VAR | Entero (FK a tabla) | Texto para convenio sin Garante — FK `PLANTILLA.COD_PLA` | clsFinanciacion.GetRecCon — RN.Cobranzas/clsFinanciacion.cs:155 |
| 607 | VAR | Entero (FK a tabla) | Concepto para interés por financiación — FK `PROD_SER.COD_PRO` | clsCaidaCuotas.clsCaidaCuotas — RN.Cobranzas/clsCaidaCuotas.cs:68; clsFinanciacion.GetFacturaCuota — RN.Cobranzas/clsFinanciacion.cs:401; clsFinanciacion.GetCuotas_SitIvaDistinto — RN.Cobranzas/clsFinanciacion.cs:448; (+1 más) |
| 671 | VAR | Entero | Maxima Cantidad de Convenios en un Período | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 672 | VAR | Entero | Mínima cantidad de Comprobantes a Financiar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 673 | VAR | Numérico | Importe mínimo de cada cuota financiada | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 674 | VAR | Fecha (texto) | Período de control (Desde) | clsFormasDePago.GetConveniosEnPeriodo — RN.Cobranzas/clsFormasDePago.cs:294 |
| 675 | VAR | Fecha (texto) | Período de control (Hasta) | clsFormasDePago.GetConveniosEnPeriodo — RN.Cobranzas/clsFormasDePago.cs:295 |
| 676 | VAR | Entero (FK a tabla) | Concepto para Sellado de Convenio — FK `PROD_SER.COD_PRO` | clsFinanciacion.AgregarSellado — RN.Cobranzas/clsFinanciacion.cs:323; clsFinanciacion.GetFacturaCuota — RN.Cobranzas/clsFinanciacion.cs:406; clsComprobanteVenta.Guardar — RN.Facturacion/clsComprobanteVenta.cs:584 |
| 735 | VAR | Lógico | No Permitir que una cuenta tenga más de una Financiación Activa del mismo Tipo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1030 | VAR | Lógico | Permite cambiar interes al operador (manual) | PropiedadesCaja.Cargar_FinanciacionDeuda — RN.Cobranzas/clsCobranzaCaja.cs:574 |
| 2208 | VAR | Entero | Máxima cantidad de comprobantes a Financiar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2252 | VAR | Lógico | Imprimir automaticamente el convenio al generar la financiación | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2299 | VAR | Lógico | Permitir modificar Forma de registración de Cuotas de Financiación | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2471 | VAR | Entero (FK a tabla) | Tipo de cuota por defecto para emitir financiación — FK `TIPO_FAC.COD_TPFC` | clsFinanciacion.GetCuota_X_Defecto — RN.Cobranzas/clsFinanciacion.cs:661 |
| 2634 | VAR | Lógico | Permitir imputar Financiaciones a cuentas diferentes a la de origen | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### CONSUMOS (4 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 55 | VAR_PMOVIL | Lógico | Habilitar botón de Mi Medidor de Mr. Dims en consumos — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2568 | VAR | Lógico | Habilitar botón de impresión de informes de grandes consumos en formulario de consumos, tramas y categorías. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2618 | VAR | Lógico | Validar la distribución de consumos por las fechas de lectura | clsConsumos.Get_ConsumoDistribuir — RN.Consumos/clsConsumos.cs:2418 |
| 2658 | VAR | Lógico | Permitir eliminar último consumo cargado por cambio de medidor | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### TECNICA (95 parámetros, 36 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 2 | VAR_PMOVIL | Lógico | Permite agregar ordenes de trabajo desde el captor — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 10 | VAR_PMOVIL | Lógico | Permite la sincronización de las lecturas automaticamente — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 11 | VAR_PMOVIL | Lógico | Permite registrar pagos a través de CoopOnline — _obs: Los pagos generados en la web y la app, se registran directamente a través del Agente de p10_ — canal: CoopOnline | clsWeb_CoopOnline.ValidarConfiguracion — Agente.Clases/clsWeb_CoopOnline.cs:813; clsWeb_CoopOnline.IniciarEscuchaCobranza — Agente.Clases/clsWeb_CoopOnline.cs:969; Siro_Alternativo.Importar — RN.Cobranzas.Entidades.PR/Siro_Alternativo.cs:75; (+1 más) |
| 16 | VAR_PMOVIL | Lógico | Forzar tomar foto del medidor al registrar la lectura — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 33 | VAR_PMOVIL | Texto | Url del WebService para generar OT PMovil — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 48 | VAR_PMOVIL | Lógico | Permitir Cerrar Ordenes de Trabajo desde PMovil — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 50 | VAR_PMOVIL | Lógico | Solicitar una firma digital al confirmar la orden — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 51 | VAR_PMOVIL | Lógico | Solicitar encuesta de conformidad al cerrar la orden — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 53 | VAR_PMOVIL | Entero (lista de opciones) | Enviar Mensaje Automático al registrar Ventas — opciones: No Enviar; Enviar por SMS; Enviar por WhatsAPP — canal: CoopOnline | clsPMovil_Venta.Sincronizar_Venta — RN.Varios.PMovil/clsPMovil_Venta.cs:243 |
| 54 | VAR_PMOVIL | Lógico | Cerrar operaciones seleccionadas desde PMovil — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 57 | VAR_PMOVIL | Lógico | No sincronizar las ordenes modificadas — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 58 | VAR_PMOVIL | Lógico | Generar Orden de Trabajo de Reclamos en la Web — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 62 | VAR_PMOVIL | Lógico | Mostrar mensaje de confirmación al cancelar orden — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 64 | VAR_PMOVIL | Lógico | Mostrar número de medidor en pantalla de seleccion de ordenes — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 70 | VAR_PMOVIL | Lógico | Permitir generar ordenes de cambio de medidor de servicio no medido desde PMovil — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 174 | VAR | Lógico | Exigir observaciones administrativas en ordenes de Trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 180 | VAR | Texto | Informe por defecto para orden de Trabajo | clsInformes_Tecnica.Get_Reporte_DetalleOrden_Nombre — RN.Tecnica/clsInformes_Tecnica.cs:2324 |
| 254 | VAR | Lógico | Pregunta si debe agregar el consumo calculado al confirmar orden de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 333 | VAR | Entero | Via de ingreso por defecto para Ordenes de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 341 | VAR | Entero | Usuario para ProCoop AVL | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 342 | VAR | Lógico | Exigir Responsable al confirmar ordenes de trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 344 | VAR | Entero (lista de opciones) | Utilizar Numeración unica de ordenes de trabajo por servicio y año — opciones: No utilizar; Numerar por reclamos o no reclamos; Numerar por tipo de tarea; Numerar por tipo de tarea y reclamo — _obs: No utilizar_ | clsTecnica.Get_New_CODSLS — RN.Tecnica/clsTecnica.cs:2443 |
| 358 | VAR | Lógico | Impresion de Ordenes de trabajo con mapa | clsInformes_Tecnica.Get_Reporte_DetalleOrden_ParametrosOT — RN.Tecnica/clsInformes_Tecnica.cs:1800; clsInformes_Tecnica.Get_Reporte_DetalleOrden_ParametrosOM — RN.Tecnica/clsInformes_Tecnica.cs:2184 |
| 388 | VAR | Lógico | Exigir Factibilidad en altas y Reconexiones de servicios que informan a Técnica. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 401 | VAR | Lógico | Exigir Punto de Conexión a Red Física en órdenes de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 430 | VAR | Entero | Activar integracion con AVL Plus | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 441 | VAR | Lógico | Permitir confirmar órdenes con fecha anterior al alta. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 443 | VAR | Lógico | No permitir Modificar precio de materiales a facturar en O. de Trabajo | clsCobranzas.Get_ConceptosCobrar — RN.Cobranzas/clsCobranzas.cs:3388; clsCobranzas.AgregarConceptoBonificacion — RN.Cobranzas/clsCobranzas.cs:3429 |
| 448 | VAR | Lógico | No permitir Modificar precio de materiales a facturar en Ordenes de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 460 | VAR | Lógico | Concepto para horas hombre en ordenes de trabajo. | GetDatosInforme.GetCosto_OT — RN.Stock/clsInformes_Stock.cs:1339; GetDatosInforme.GetCosto_OM — RN.Stock/clsInformes_Stock.cs:1524 |
| 465 | VAR | Lógico | Permitir modelo de orden de trabajo según operación. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 474 | VAR | Lógico | Exigir categorias al confirmar ordenes de trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 497 | VAR | Lógico | Exigir resolución al confirmar ordenes de trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 752 | VAR | Lógico | Permitir confirmar órdenes con fecha posterior | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 911 | VAR_PMOVIL | Entero (lista de opciones) | Habilitar Adhesión a factura web — opciones: No permitir; Permitir, solicitando mail; Permitir, solicitando mail y teléfono — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2084 | VAR | Lógico | Exigir cantidad de personas al confirmar ordenes de trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2268 | VAR | Lógico | Permitir cambiar fecha de ingreso de Orden de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2339 | VAR | Lógico | Precargar la observación administrativa de la orden de trabajo desde el servicio. | clsTecnica.Crear_OT — RN.Tecnica/clsTecnica.cs:2080 |
| 2354 | VAR | Lógico | Exigir ingreso de horas de los participantes en Ordenes de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2370 | VAR | Numérico | Segundos de espera para código nexo SQL | NEXO_SQL.ObtenerRespuesta — RN.Varios.Telemed.Telemedicion/NEXO_SQL.cs:269 |
| 2393 | VAR | Texto | Perfil de MikroTik para servicios desconectado | MikroTik.CorteServicio — RN.Varios.Telemed.Telemedicion/MikroTik.cs:78 |
| 2399 | VAR | Lógico | Borrar datos del Medidor al marcar \"Retirado\", al confirmar una O.T | clsTecnica.PreSave_TECNICA — RN.Tecnica/clsTecnica.cs:1367; clsSocios.Actualizar_Medidor_SERSOC — RN.Titulares/clsSocios.cs:2226 |
| 2421 | VAR | Entero (lista de opciones) | Validar número de certificado en la confirmación de Ordenes de trabajo — opciones: No exigir, ni Preguntar; Advertir; Exigir — _obs: Advertir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2422 | VAR | Lógico | Utilizar Datos Técnicos de Partner en servicio de Internet | DatosInternet.DatosInternet — Cfg.ControlesProcoopNet/DatosInternet.cs:186 |
| 2425 | VAR | Texto | Códigos de Servicios a utilizar en mapas GIS (separado por coma) | GIS.Update_SincronizarParcela — RN.Varios.Generales/GIS.cs:412; frmImportacionArchivos.Importar_GIS — Cfg.Forms/frmImportacionArchivos.cs:1355 |
| 2439 | VAR | Lógico | Permitir cambiar fecha de solicitud de Orden de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2440 | VAR | Lógico | Marcar medidor como retirado por defecto al confirmar OT de desconexión | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2470 | VAR | Lógico | Exigir Número de dispositivo al confirmar las Ordenes de trabajo, si puede requerir o requiere dispositivo en alta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2474 | VAR | Lógico | Permitir cambiar categoría de servicio al realizar cambio de medidor en orden de trabajo. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2480 | VAR | Lógico | Permitir actualizar teléfono de la cuenta y mails en las Ordenes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2483 | VAR | Lógico | Generar crédito por días de servicio desconectado al reconectar el servicio | clsTecnica.Generar_DescuentoReconexion — RN.Tecnica/clsTecnica.cs:1605 |
| 2485 | VAR | Numérico (FK a tabla) | Concepto a facturar por días de servicio desconectado — FK `PROD_SER.COD_PRO` | clsTecnica.Generar_DescuentoReconexion — RN.Tecnica/clsTecnica.cs:1613 |
| 2491 | VAR | Lógico | Iniciar Login en cada venta de prepaga en NEXO | NEXO_TCP2.EnviarComando — RN.Varios.Telemed.Telemedicion/NEXO_TCP2.cs:146 |
| 2505 | VAR | Entero (lista de opciones) | Control de Movil en Administración de Ordenes — opciones: No Preguntar, Ni Exigir; Preguntar; Exigir — _obs: No Preguntar, Ni Exigir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2531 | VAR | Lógico | Preguntar al usuario si desea o no retirar medidor al confirmar una OT de desconexión. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2570 | VAR | Numérico (FK a tabla) | Concepto a Facturar por proporcional en cambio de categoría — FK `PROD_SER.COD_PRO` | clsTecnica.Generar_ProporcionalCambioCategoria — RN.Tecnica/clsTecnica.cs:1529 |
| 2587 | VAR | Lógico | Aplicar proporcional por cambio de categoría solo para importes positivos | clsTecnica.Generar_ProporcionalCambioCategoria — RN.Tecnica/clsTecnica.cs:1586 |
| 2625 | VAR | Lógico | Cobrar en el momento el proporcional por cambio de categoría. | clsTecnica.AplicarProporcional — RN.Tecnica/clsTecnica.cs:1711 |
| 2627 | VAR | Lógico | Permitir registrar materiales utilizados en productos que no llevan stock | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2629 | VAR | Lógico | Solicitar la Vía de Ingreso en las Ordenes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2637 | VAR | Lógico | Al confirmar ordenes de cambio de domicilio debe aletar si no se cambio el recorrido. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2638 | VAR | Lógico | Al confirmar ordenes de cambio de domicilio preguntar si se desea modificar el domicilio postal de la cuenta y el recorrido postal. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2652 | VAR | Lógico | Exigir  Modelo de Medidor en Servicio que Requieren Dispositivos en Alta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2654 | VAR | Lógico | Permitir modificar ordenes de factibilidad tecnica cerradas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2655 | VAR | Lógico | Permitir Crear Órdenes de Trabajo de Servicios Pendientes de Conexión | clsTecnica.Validar_OrdenTrabajo_General — RN.Tecnica/clsTecnica.cs:2929 |
| 2657 | VAR | Lógico | Mostrar Detalle de Materiales en Formulario de Registro de Materiales de OT | frmSeleccionarProducto.frmSeleccionarProducto_Load — Cfg.Forms/frmSeleccionarProducto.cs:190 |
| 2661 | VAR | Lógico | Generar débito al reconectar servicio no facturado en el periodo actual | clsTecnica.Generar_DescuentoReconexion — RN.Tecnica/clsTecnica.cs:1650 |
| 2667 | VAR | Lógico | No Permitir agregar, editar o eliminar materiales utilizados en ordenes de trabajo cerradas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2694 | VAR | Lógico | Permitir generar orden de trabajo por tratamientos de morosos sin completar la observacion tecnica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2722 | VAR | Numérico | Importe Horas Normales | clsCierreDiario.Stock_OT — RN.Contabilidad/clsCierreDiario.cs:3546; clsCierreDiario.Stock_OM — RN.Contabilidad/clsCierreDiario.cs:3723; GetDatosInforme.GetCosto_OT — RN.Stock/clsInformes_Stock.cs:1367; (+4 más) |
| 2723 | VAR | Numérico | Importe Horas Extras | clsCierreDiario.Stock_OT — RN.Contabilidad/clsCierreDiario.cs:3547; clsCierreDiario.Stock_OM — RN.Contabilidad/clsCierreDiario.cs:3724; GetDatosInforme.GetCosto_OT — RN.Stock/clsInformes_Stock.cs:1368; (+4 más) |
| 2808 | VAR | Lógico | No modificar estado de la orden al imprimirla | clsInformes_Tecnica.Get_Reporte_DetalleOrden — RN.Tecnica/clsInformes_Tecnica.cs:710 |
| 2811 | VAR | Lógico | Permitir bloquear para envio desde Tecnica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2819 | VAR | Lógico | Mostrar en el reporte los Vales utilizados en la Orden de OT/OM | clsInformes_Tecnica.Get_Reporte_DetalleOrden — RN.Tecnica/clsInformes_Tecnica.cs:656 |
| 2891 | VAR | Lógico | No verificar pagos pendientes al confirmar ordenes de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2897 | VAR | Lógico | Mikrotik - Eliminar usuario al dar de baja | MikroTik.CorteServicio — RN.Varios.Telemed.Telemedicion/MikroTik.cs:85; MikroTik.Reconexion — RN.Varios.Telemed.Telemedicion/MikroTik.cs:251 |
| 2899 | VAR | Lógico | Permitir importar productos de presupuestos en Vales | frmVales_Handler.Guardar — RN.Stock/frmVales_Handler.cs:127 |
| 2907 | VAR | Lógico | Permitir cerrar ordenes sin generar comprobantes por reconexión | clsTecnica.Generar_DescuentoReconexion — RN.Tecnica/clsTecnica.cs:1675 |
| 2913 | VAR | Lógico | Enviar automaticamente las ordenes creadas a la base MySQL | clsTecnica.EnviarOrdenAutomaticamente — RN.Tecnica/clsTecnica.cs:2734 |
| 2933 | VAR | Entero (lista de opciones) | Seleccion de exportador GIS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2997 | VAR | Lógico | Utilizar gestión de depósitos y autorización de materiales en Ordenes de Mantenimiento | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2998 | VAR | Lógico | Utilizar Numeración unica de reclamos continua | clsTecnica.Get_New_CODSLS — RN.Tecnica/clsTecnica.cs:2437 |
| 3031 | VAR | Lógico | Utilizar numeración por servicio al emitir informe de reclamos | clsInformes_Tecnica.Get_Reporte_Reclamo — RN.Tecnica/clsInformes_Tecnica.cs:767 |
| 3034 | VAR | Texto | URL de webservice para impactar cambios en tecnica/socios | Service.Invoke — RN.Tecnica/clsSitsa.cs:27; clsSitsa.EstadoServicio — RN.Tecnica/clsSitsa.cs:152; clsSocios.AltaBajaModificacionCliente_Sitsa — RN.Titulares/clsSocios.cs:1216; (+1 más) |
| 3035 | VAR | Texto | APIKEY de webservice para impactar cambios en tecnica/socios | clsSitsa.EstadoServicio — RN.Tecnica/clsSitsa.cs:155 |
| 3082 | VAR | Lógico | Permitir cargar adjunto a orden de factibilidad tecnica cerrada | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3084 | VAR | Lógico | Mostrar Responsables por Servicio y por Operación | clsProcoop_Integra_Tecnica.GetResponsables — RN.Varios.Generales/clsProcoop_Integra_Tecnica.cs:1120 |
| 3085 | VAR | Numérico | Valor de hora por defecto para participantes en ordenes de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3086 | VAR | Lógico | Exigir Responsable y Marca de Enviar a Captor desde Procoop.ar | clsProcoop_Integra_Tecnica.GetVariableResPmovil — RN.Varios.Generales/clsProcoop_Integra_Tecnica.cs:1239 |
| 3120 | VAR | Lógico | Mostrar pestaña de reclamos OCEBA en el formulario de Técnica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3165 | VAR | Texto | WISPRO - API KEY | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3173 | VAR | Lógico | Mostrar el informe de incidentes a la hora de imprimir una Orden de Trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3175 | VAR | Lógico | Mostrar boton Conectar Servicio de Discar en formulario de técnica | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3189 | VAR | Lógico | Radius - Utiliza solo API de consultas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3201 | VAR | Lógico | Mostrar advertencia al cargar una orden de trabajo sin materiales | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### TELEMED (45 parámetros, 31 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 28 | VAR_PMOVIL | Lógico | Enviar nomenclatura catastral en PMovil — canal: PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:591 |
| 29 | VAR_PMOVIL | Lógico | Estimar consumos a lecturas con observaciones — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 30 | VAR_PMOVIL | Lógico | Permite crear Ordenes de Trabajo desde PMovil — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 38 | VAR_PMOVIL | Lógico | No obligar a realizar la sincronización en el modulo de Telemed — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 47 | VAR_PMOVIL | Lógico | Mostrar Zona,Sector,Recorrido de la lectura y observación postal en la Ruta — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 69 | VAR_PMOVIL | Lógico | Mostrar descripción de la ruta en los detalles del servicio — canal: PMovil | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 72 | VAR_PMOVIL | Lógico | Utilizar el servidor de S3 para las imagenes de lectura — canal: PMovil | clsPMovil_Telemed.SincronizarDatosImpWorkMySql — RN.Varios.PMovil/clsPMovil_Telemed.cs:189; clsPMovil_Telemed.EliminarImagenesS3 — RN.Varios.PMovil/clsPMovil_Telemed.cs:398 |
| 439 | VAR | Numérico | Porcentaje a considerar lectura Erronea | clsTelemed.GenerarRutas — RN.Varios.Telemed/clsTelemed.cs:348; clsTelemed.Archivo_Importar — RN.Varios.Telemed/clsTelemed.cs:1204 |
| 451 | VAR | Lógico | Permitir importar desde aplicaciones de Terceros a Connector - ProCoop Connector | clsTelemed.GuardarRutas — RN.Varios.Telemed/clsTelemed.cs:408 |
| 452 | VAR | Entero (lista de opciones) | Modelo de intercambio de aplicaciones de Terceros a Connector - ProCoop Connector | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 453 | VAR | Texto | Ruta de datos por defecto para importar datos desde aplicaciones de terceros - ProCoop Connector — _obs: C:\\_ | frmAdjuntarPdfs.txtPath_ButtonClick — Cfg.Forms.Herramientas/frmAdjuntarPdfs.cs:44; frmBaseDatos.ExportarAuditoriaExcel — Cfg.Forms.Herramientas/frmBaseDatos.cs:316; frmBaseDatos.ExportarAuditoriaMailExcel — Cfg.Forms.Herramientas/frmBaseDatos.cs:339 |
| 454 | VAR | Texto | Ruta de datos por defecto para exportar datos hacia aplicaciones de terceros - ProCoop Connector — _obs: C:\\_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 455 | VAR | Texto | Nombre del servicio por defecto para archivos importados desde app de terceros - ProCoop Connector — _obs: SERVICIO_ | clsImportacion_AC.Importar — RN.Varios.Telemed/clsImportacion_AC.cs:32; clsTelemed.GetRutas — RN.Varios.Telemed/clsTelemed.cs:202; clsTelemed.GetMapeosImportador_ONC — RN.Varios.Telemed/clsTelemed.cs:1367; (+2 más) |
| 458 | VAR | Lógico | Agregar Observacion postal en calle | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:584 |
| 468 | VAR | Lógico | Visualizar Lectura anterior en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:585 |
| 469 | VAR | Lógico | Visualizar Consumo anterior en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:586 |
| 720 | VAR | Lógico | Filtrar según fecha de alta servicios a enviar el renerar Rutas en Telemed | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 748 | VAR | Lógico | Visualizar en Pmovil manzana y lote. | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:592 |
| 2054 | VAR | Entero | Codigo del servicio por defecto para archivos importados desde app de terceros - ProCoop Connector | clsImportacion_AC.Importar — RN.Varios.Telemed/clsImportacion_AC.cs:31 |
| 2087 | VAR | Lógico | Permitir decimales en exportacion | clsTelemed.GetMapeosImportador_ORD — RN.Varios.Telemed/clsTelemed.cs:1285; clsTelemed.GetMapeosImportador_ONC — RN.Varios.Telemed/clsTelemed.cs:1340; clsTelemed.GetMapeosImportador_BRI — RN.Varios.Telemed/clsTelemed.cs:1401; (+3 más) |
| 2088 | VAR | Lógico | Validar Cantidad de Digitos Medidor | clsTelemed.CheckearLectura — RN.Varios.Telemed/clsTelemed.cs:2163 |
| 2098 | VAR | Lógico | Enviar ruta ordenada segun orden de lecturista | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:748 |
| 2241 | VAR | Texto | Ruta por defecto para busqueda de base de datos en telefono | clsTelemed.ObtenerBase — RN.Varios.Telemed/clsTelemed.cs:2084 |
| 2293 | VAR | Lógico | Visualizar Zona, sector y Recorrido de lectura en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:587 |
| 2297 | VAR | Lógico | Enviar Categoria en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:588 |
| 2298 | VAR | Lógico | Enviar Estado en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:589 |
| 2307 | VAR | Entero (lista de opciones) | Modelo de Importación de Lecturas tomadas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2331 | VAR | Lógico | Enviar Matricula de Servicio | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:590 |
| 2332 | VAR | Lógico | Importación de fotos de Telemed con Cuenta/Medidor/UF/Archivo | clsAdjuntos.GetAdjuntosCaptor — RN.Varios/clsAdjuntos.cs:136; clsAdjuntos.CrearAdjunto — RN.Varios/clsAdjuntos.cs:226 |
| 2334 | VAR | Lógico | Exporta Rutas en Excel por separado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2336 | VAR | Lógico | Enviar Campo ''Id Cliente'' como número de contrato de DISCAR | Discar.GetNroContrato — RN.Varios.Telemed.Telemedicion/Discar.cs:1331 |
| 2340 | VAR | Lógico | Confirma masivamente Rutas al exportarlas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2345 | VAR | Lógico | Permite eliminar/limpiar masivamente Rutas sin alertas individuales | clsPMovil.ValidarLimpiarBase — RN.Varios.Telemed/clsPMovil.cs:319 |
| 2466 | VAR | Lógico | No usar decimales al estimar consumos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2475 | VAR | Lógico | Usar PMovil en toma de Lectura | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2504 | VAR | Lógico | Enviar Campo ''Cuenta'' como número de contrato de DISCAR | Discar.GetNroContrato — RN.Varios.Telemed.Telemedicion/Discar.cs:1327 |
| 2559 | VAR | Lógico | Consultar última lectura estimada | clsTelemed.GuardarRutas — RN.Varios.Telemed/clsTelemed.cs:497 |
| 2590 | VAR | Lógico | Ordenar Grandes consumos segun orden de impresión — _obs: En Si ordena segun orden de impresion 2, en NO ordena por codigo de producto_ | clsRutas.GetRutasSersoc — RN.Varios.Telemed/clsRutas.cs:197 |
| 2595 | VAR | Lógico | Relacionar imagenes de lecturas con Consumos automaticamente | clsConsumos.Procesar_Consumos — RN.Consumos/clsConsumos.cs:3040; clsWEB.ValidarParametros — RN.Titulares/clsWEB.cs:629; clsWEB.SincronizarConsumos — RN.Titulares/clsWEB.cs:2343; (+2 más) |
| 2682 | VAR | Lógico | Tomar Categoría actual de los servicios al confirmar las lecturas | clsTelemed.ConfirmarRuta — RN.Varios.Telemed/clsTelemed.cs:699 |
| 2809 | VAR | Lógico | Usar Observaciones Postales de la Cuenta y no del Servicio al generar el recorrido de las Rutas | clsTelemed.GenerarRutas — RN.Varios.Telemed/clsTelemed.cs:374 |
| 2992 | VAR | Lógico | Mostrar filtro Servicios en Administración de Rutas | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3063 | VAR | Lógico | Corregir fecha y cabecera para importación de archivo txt | clsTelemed.GuardarRutas — RN.Varios.Telemed/clsTelemed.cs:422; clsTelemed.Archivo_Importar — RN.Varios.Telemed/clsTelemed.cs:1190 |
| 3140 | VAR | Lógico | Hacer que la columna observacion postal no sea obligatorio al importar archivo de terceros | clsTelemed.GetMapeosImportador — RN.Varios.Telemed/clsTelemed.cs:1619 |
| 3197 | VAR | Lógico | Visualizar Propiedad del Servicio en PMovil | clsPMovil.AddRutas — RN.Varios.Telemed/clsPMovil.cs:593 |

#### TELEFONIA (16 parámetros, 13 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 13 | VAR | Entero (FK a tabla) | Tarifa de Celulares — FK `TARTEL.COD_TAR` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 18 | VAR | Entero (FK a tabla) | Servicio detalle de Llamadas — FK `SERVICIO.COD_SER` | Filtros.Filtros — RN.Telefonia/clsInformes_Llamadas.cs:168; clsInformes_Llamadas.Get_FacturasDetalle — RN.Telefonia/clsInformes_Llamadas.cs:1377 |
| 62 | VAR | Lógico | Tasar Automáticame llamadas Internacionales | clsTelefonia.Get_DatosTasacion — RN.Telefonia/clsTelefonia.cs:1763 |
| 64 | VAR | Numérico | Importe minimo de llamadas no gratuitas | clsTelefonia.Get_DatosTasacion — RN.Telefonia/clsTelefonia.cs:1766 |
| 82 | VAR | Entero (FK a tabla) | Servicio para Central Virtual — FK `SERVICIO.COD_SER` | clsTelefonia.Tasacion_Get_CentralTelefonica — RN.Telefonia/clsTelefonia.cs:1702 |
| 236 | VAR | Lógico | Habilitar Telefonos Prepagos | clsTelefonia.Get_DatosTasacion — RN.Telefonia/clsTelefonia.cs:1764; clsTelefonia.Importar_CPP — RN.Telefonia/clsTelefonia.cs:2317 |
| 238 | VAR | Numérico (FK a tabla) | Orden de trabajo para compra de minutos — FK `TRANSAC.COD_TRAN` | clsTelefonia.Generar_OT_RecargaPrepaga — RN.Telefonia/clsTelefonia.cs:991 |
| 301 | VAR | Mixto | Configuración datos de Personal | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 332 | VAR | Entero (FK a tabla) | Servicio para Telefonia Prepaga — FK `SERVICIO.COD_SER` | clsTelefonia.Get_DatosTasacion — RN.Telefonia/clsTelefonia.cs:1762; clsTelefonia.Importar_CPP — RN.Telefonia/clsTelefonia.cs:2316; clsSocios.Guardar_TelefoniaPrepaga — RN.Titulares/clsSocios.cs:3045 |
| 471 | VAR | Lógico | No aplicar consumo minimo en claves 0 y 1 | clsTelefonia.Get_DatosTasacion — RN.Telefonia/clsTelefonia.cs:1765 |
| 2099 | VAR | Entero (FK a tabla) | Concepto para credito de telefonía prepaga — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2295 | VAR | Entero (FK a tabla) | Operador para importador CPP de Nextel — FK `OPERADOR.COD_OPE` | clsImportacion.Importar_CPP2_Nextel — RN.Telefonia/clsImportacion.cs:3638 |
| 2302 | VAR | Lógico | Validar llamadas existentes al importar archivo de llamadas | clsImportacion.Validar_Duplicadas — RN.Telefonia/clsImportacion.cs:125 |
| 2344 | VAR | Entero (FK a tabla) | Tarifa de Telefonía por Defecto — FK `TARTEL.COD_TAR` | abm_AltasEau.oServicioAlta_SeleccionarId — Cfg.Forms/abm_AltasEau.cs:263 |
| 2346 | VAR | Lógico | Asignar Importe 0 a las llamadas \"Telco IP\" importadas con clave 99 | clsImportacion.Importar_LLAMADAS_TelcoIP — RN.Telefonia/clsImportacion.cs:1372 |
| 2444 | VAR | Texto | Números telefonicos a excluir en importador de llamadas Lucent | clsImportacion.Importar_Lucent_Salientes — RN.Telefonia/clsImportacion.cs:1186 |

#### SMS (11 parámetros, 7 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 2047 | VAR | Numérico | Cantidad de errores para desactivar Modem | frmParam_SMS.cmdAceptar_Click — Cfg/Configuracion/frmParam_SMS.cs:47 |
| 2048 | VAR | Numérico | Cantidad de errores para desactivar mensaje | frmParam_SMS.cmdAceptar_Click — Cfg/Configuracion/frmParam_SMS.cs:48 |
| 2049 | VAR | Numérico | Días de validez de un SMS | frmParam_SMS.cmdAceptar_Click — Cfg/Configuracion/frmParam_SMS.cs:49 |
| 2870 | VAR | Texto | Token para envio de mensajes a través de WhatsApp | clsPlantillasWhatsApp.? — RN.Telefonia/clsPlantillasWhatsApp.cs:12; clsWhatsApp.clsWhatsApp — RN.Telefonia/clsWhatsApp.cs:82; clsServicio_Procoop.AgregarTareasDinamicas — RN.Varios.Generales/clsServicio_Procoop.cs:2006; (+3 más) |
| 2872 | VAR | Numérico | Demora entre envíos de mensajes de WhatsApp (En segundos) | clsServicio_Procoop.EnviarWS — RN.Varios.Generales/clsServicio_Procoop.cs:615 |
| 2873 | VAR | Texto | Host en URL para envío de mensajes a través de WhatsApp | clsWhatsApp.Invoke — RN.Telefonia/clsWhatsApp.cs:231 |
| 2874 | VAR | Texto | ID canal para envío de mensajes a través de WhatsApp | clsPlantillasWhatsApp.? — RN.Telefonia/clsPlantillasWhatsApp.cs:14; clsWhatsApp.Get_MensajesPendientes — RN.Telefonia/clsWhatsApp.cs:122 |
| 3018 | VAR | Lógico | Realizar envio de sms a través de Amazon SNS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3019 | VAR | Texto | AWS Acces Key | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3020 | VAR | Texto | AWS Secret Key | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3021 | VAR | Texto | AWS Region | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### COMPRAS (109 parámetros, 46 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 110 | VAR | Lógico | Permite pago de facturas con fecha contable posterior al pago. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 134 | VAR | Lógico | Apertura Automática de la Caja de Pago | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:29 |
| 135 | VAR | Numérico | Importe para Pago en efectivo en Apertura Automática | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:45 |
| 144 | VAR | Entero (lista de opciones) | Pago a Proveedores desde caja — opciones: No permitir Pago desde Caja; Solo para pagos menores a: (Variable 2025); Definido por el usuario; Definido por el usuario (Mostrando mensaje de advertencia) — _obs: No permitir Pago desde Caja_ | clsChequeos.FinalizarChequeos — CapaNucleo/clsChequeos.cs:68; PropiedadesCaja.Cargar_CobranzaLocal — RN.Cobranzas/clsCobranzaCaja.cs:353; clsPagoFacturas.ProcesarMediosDePago — RN.Compras/clsPagoFacturas.cs:429 |
| 146 | VAR | Entero (FK a tabla) | Categoría para pago con transferencias — FK `CAT_BANC.CAT_COMP` | clsPagoFacturas.RegistrarResBan — RN.Compras/clsPagoFacturas.cs:588 |
| 217 | VAR | Lógico | Ingresar a página de ARCA si el certificado del proveedor se encuentra fuera de fecha. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 218 | VAR | Lógico | Controlar proveedores con base de datos de ARCA. | ctrCuit.Validar — Cfg.ControlesProcoopNet/ctrCuit.cs:162 |
| 264 | VAR | Lógico | No actualizar el precio de compra al registrar facturas | frmComprobantes_Handler.ImportarDetalles — RN.Facturacion/frmComprobantes_Handler.cs:785; frmComprobantes_Handler.AgregarDetalle — RN.Facturacion/frmComprobantes_Handler.cs:1071 |
| 382 | VAR | Texto | Informe para libro IVA compras personalizado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 402 | VAR | Entero | Controlar Fecha de Cheques o Transferencias en Ordenes de Pago — _obs: Si se desea controlar la fecha en los medios de pagos de cheques o transferencias. Esta variable debe ser configurada con los valores:\n1 - exigir que la fecha _ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 406 | VAR | Texto | Informe particularizado de retenciones ( en iva compras) | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 409 | VAR | Lógico | No permitir anticipos en Retenciones | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 410 | VAR | Lógico | No retener en comprobantes no formales | Retenciones.CalcularBaseImponible — ReglasNegocio/Retenciones.cs:221 |
| 426 | VAR | Lógico | Preguntar Antes de Actualizar Precio de Compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 580 | VAR | Fecha (texto) | Fecha Imputacion Contable | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 583 | VAR | Lógico | Carga de factura de compra independiente a remitos de deposito. | frmComprobantes_Handler.GuardarComp — RN.Facturacion/frmComprobantes_Handler.cs:2270; FormBase.ValidarUbicaciones — Cfg/Configuracion/FormBase.cs:510 |
| 832 | VAR | Mixto | Valor por defecto para Separar comprobantes en libro de IVA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 1029 | VAR | Lógico | Permite particularizar nombre proveedor en Orden de Pago | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2000 | VAR | Lógico | Permite a Compras Habilitar el Pago con Cheques | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:46 |
| 2001 | VAR | Lógico | Permite a Compras Habilitar el Pago con Valores | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:47 |
| 2002 | VAR | Lógico | Permite a Compras Habilitar el Pago con Efectivo | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:48 |
| 2003 | VAR | Lógico | Permite Definir el Importe de Efectivo Disponible para Compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2004 | VAR | Lógico | Permite a Compras Habilitar el Pago con Transferencia | clsCajaPago.ValidarAperturadeCajaAutomatica — RN.Tesoreria/clsCajaPago.cs:49 |
| 2015 | VAR | Lógico | Permitir pago diferido a las cuentas que no lo sean | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2016 | VAR | Lógico | Desactiva pagos diferidos. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2017 | VAR | Lógico | Permite NO asignar Rubro proveedor a facturas de compra. | clsProveedor.CrearProveedor — ReglasNegocio/clsProveedor.cs:152; IvaCom_Pendientes.IvaCom_Pendientes — RN.Facturacion/clsIvaCom.cs:193; abm_Proveed.abmProveedor__ValidFields — Cfg/Configuracion/abm_Proveed.cs:579 |
| 2018 | VAR | Lógico | Imprimir Orden de pago en la emisión | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2019 | VAR | Lógico | Habilita al sistema a marcar proveedores para pagar a otros proveedores | abm_Proveed.ConfigurarFormulario — Cfg/Configuracion/abm_Proveed.cs:523 |
| 2020 | VAR | Texto | Datos Empresa - Jefe Administrativo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2021 | VAR | Texto | Datos Empresa - Secretario | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2022 | VAR | Texto | Datos Empresa - Jefe de Compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2023 | VAR | Texto | Datos Empresa - Presidente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2024 | VAR | Texto | Datos Empresa - Tesorero | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2025 | VAR | Numérico | Importe maximo para pagos a proveedores por Caja (La Variable 144 debe estar habilitada) | clsPagoFacturas.ProcesarMediosDePago — RN.Compras/clsPagoFacturas.cs:429 |
| 2026 | VAR | Fecha (texto) | Vencimiento de facturas por defecto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2034 | VAR | Entero (FK a tabla) | Concepto para anticipos de sueldos — FK `CON_COM.COD_CON` | clsPagoFacturas.GenerarCmpAnticipo — RN.Compras/clsPagoFacturas.cs:361; clsPagoFacturas.Anular — RN.Compras/clsPagoFacturas.cs:777; clsSueldos.GetAdelantos — RN.Sueldos/clsSueldos.cs:815 |
| 2035 | VAR | Entero (FK a tabla) | Concepto para anticipos a proveedores — FK `CON_COM.COD_CON` | IvaCom_Pendientes.IvaCom_Pendientes — RN.Facturacion/clsIvaCom.cs:182 |
| 2036 | VAR | Entero | Dias de Vigencia para Solicitud de Aprov. | clsSAprov.GetSA_Pendientes — RN.Facturacion/clsSAprov.cs:284; clsSAprov.GetSAEnProceso_SinAutorizar — RN.Facturacion/clsSAprov.cs:789 |
| 2037 | VAR | Lógico | Aplica retención de Ing. Brutos. | Retenciones.CalcularRetenciones — ReglasNegocio/Retenciones.cs:85 |
| 2038 | VAR | Lógico | Imprimir Ret. IIBB Automáticamente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2039 | VAR | Lógico | Aplica retención de IVA | Retenciones.CalcularRetenciones — ReglasNegocio/Retenciones.cs:86 |
| 2040 | VAR | Lógico | Imprimir Ret. de IVA Automáticamente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2041 | VAR | Lógico | Aplica retención de Ganancias | Retenciones.CalcularRetenciones — ReglasNegocio/Retenciones.cs:87 |
| 2042 | VAR | Lógico | Imprimir Ret. de Ganancias Automáticamente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2043 | VAR | Lógico | Aplica retención de Seguridad Social | Retenciones.CalcularRetenciones — ReglasNegocio/Retenciones.cs:88 |
| 2044 | VAR | Lógico | Imprimir Ret. de Seg. Social Automáticamente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2045 | VAR | Entero | Día límite de presentación de Retenciones | Retenciones.ObtenerRetencion — ReglasNegocio/Retenciones.cs:159 |
| 2057 | VAR | Numérico | Máxima diferencia entre total de items y totales en compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2065 | VAR | Entero (FK a tabla) | Categoría de Comp. Extraccion de Efectivo — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2079 | VAR | Entero (FK a tabla) | Categ. De Comp. Depósito de efectivo en Orden de Pago. — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2201 | VAR | Entero (lista de opciones) | Valor por defecto en carga de facturas de compra — opciones: Pago Autorizado; Pago No Autorizado; Autorizar mayores a variable 2457 — _obs: Si la variable está configurado con el valor: 3-Autorizar mayores a variable 2457, debe configurar el valor de la variable 2457 (Importe máximo de comprobantes _ | IvaCom_Pendientes.IvaCom_Pendientes — RN.Facturacion/clsIvaCom.cs:148; frmComprobantes_Handler.GetIVACom — RN.Facturacion/frmComprobantes_Handler.cs:1959; frmComprobantes_Handler.GetIVAComReplica — RN.Facturacion/frmComprobantes_Handler.cs:2048 |
| 2277 | VAR | Lógico | Permitir seleccionar un Servicio de un cliente en comprobante de Compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2308 | VAR | Lógico | Mostrar Asiento Contable en Orden de Pago | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2310 | VAR | Numérico | Porcentaje de IVA a considerar Para retenciones en Adelantos — _obs: Si el comprobante de adelanto es de 121$ se considera como base Imponible 100$_ | Retenciones.CalcularBaseImponible — ReglasNegocio/Retenciones.cs:287 |
| 2323 | VAR | Lógico | Permite Modificar tipo de Moneda en órdenes de compra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2335 | VAR | Lógico | Exigir registracion completa de Ordenes de compra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2365 | VAR | Lógico | Advertir al cargar comprobantes no autorizados segun situacion de IVA | frmComprobantes_Handler.Validar — RN.Facturacion/frmComprobantes_Handler.cs:1220 |
| 2366 | VAR | Lógico | Integrar Modulo de Compras/Sueldos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2372 | VAR | Texto | Firmantes de Ordenes de Pago del archivo exportado para el Banco | GetDatosInforme.GenerarArchivosMacro — RN.Facturacion/clsInformes_Compras.cs:3353 |
| 2377 | VAR | Entero (lista de opciones) | Valor por defecto en carga de ordenes de Compras — opciones: Orden Autorizada; Orden No Autorizada — _obs: Orden Autorizada_ | frmComprobantes_Handler.GuardarOrdenDeCompra — RN.Facturacion/frmComprobantes_Handler.cs:1462 |
| 2382 | VAR | Numérico | Importe mínimo de Orden de Compra para guardar como pendiente de autorizar | frmComprobantes_Handler.GuardarOrdenDeCompra — RN.Facturacion/frmComprobantes_Handler.cs:1462 |
| 2388 | VAR | Lógico | Autocompletar fecha contable y fecha vencimiento al cargar comprobante de compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2403 | VAR | Numérico (FK a tabla) | Concepto a Facturar por Descuento en Comprobantes de Compras — FK `PROD_SER.COD_PRO` | frmComprobantes_Handler.ActualizarTotales — RN.Facturacion/frmComprobantes_Handler.cs:1095; frmComprobantes_Handler.ValidarNeto — RN.Facturacion/frmComprobantes_Handler.cs:1338; frmComprobantes_Handler.AddFPItem — RN.Facturacion/frmComprobantes_Handler.cs:2163 |
| 2418 | VAR | Entero (FK a tabla) | Plantilla para envio masivo de Ordenes de Pago — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2424 | VAR | Lógico | Consultar si se desea imprimir al momento de registrar Comprobantes De Proveedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2433 | VAR | Lógico | Utilizar Fecha de Movimiento como Fecha de Emisión en Pagos a Proveedores con Transferencias | clsPagoFacturas.ProcesarMediosDePago — RN.Compras/clsPagoFacturas.cs:510 |
| 2447 | VAR | Lógico | Seleccionar usuario en solicitó, Ordenes de Compra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2457 | VAR | Numérico | Importe mínimo de comprobantes autorizado — _obs: Solo funcionará si la variable 2201 (Valor por defecto en carga de facturas de compra) está configurado con el valor: 3-Autorizar mayores a variable 2457_ | IvaCom_Pendientes.IvaCom_Pendientes — RN.Facturacion/clsIvaCom.cs:155; frmComprobantes_Handler.GetIVACom — RN.Facturacion/frmComprobantes_Handler.cs:1966; frmComprobantes_Handler.GetIVAComReplica — RN.Facturacion/frmComprobantes_Handler.cs:2055 |
| 2533 | VAR | Lógico | Registar observación al modificar un concepto en comprobante de proveedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2539 | VAR | Lógico | Utilizar formato internacional en la generación del archivo de Retenciones de Ganancias | PercepcionSICORE.Get_RetencionesProveedores — RN.Facturacion.Archivos/PercepcionSICORE.cs:462 |
| 2542 | VAR | Numérico | Importe Base Imponible de las Retenciones a Proveedores | clsProveedor.ImportarRetenciones_Proveedores — ReglasNegocio/clsProveedor.cs:460; clsProveedor.ImportarRetenciones_ProveedoresCSV — ReglasNegocio/clsProveedor.cs:593; frmImportacionArchivos.Importar_RetencionesProveedores — Cfg.Forms/frmImportacionArchivos.cs:662 |
| 2560 | VAR | Lógico | No solicitar depósito, si el producto no lleva stock | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2572 | VAR | Lógico | Permitir modificar fecha de Comprobante de Pago a Provedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2573 | VAR | Texto | CBU para transferencia de Pago a Provedores - Interbanking | GetDatosInforme.GenerarArchivosInterbanking — RN.Facturacion/clsInformes_Compras.cs:3453 |
| 2640 | VAR | Lógico | Generar Solicitudes de Aprovisionamiento sin autorizar automáticamente(según permisos del usuario logueado) | clsSAprov.Alta — RN.Facturacion/clsSAprov.cs:133 |
| 2647 | VAR | Lógico | Cargar el Motivo de Compra en el campo Observaciones de los Comprobantes al importar Órdenes de Compra | frmComprobantes_Handler.AgregarDetalle — RN.Facturacion/frmComprobantes_Handler.cs:921 |
| 2649 | VAR | Lógico | Mostrar sólo Ordenes de Compras al importar items al cargar Remitos de Proveedores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2653 | VAR | Lógico | No permitir ver facturas y recibos de empleados en compras | GetDatosInforme.Comprobantes — RN.Facturacion/clsInformes_Compras.cs:403; GetDatosInforme.Pagos — RN.Facturacion/clsInformes_Compras.cs:486; GetDatosInforme.CtacteProveedor — RN.Facturacion/clsInformes_Compras.cs:890; (+11 más) |
| 2690 | VAR | Lógico | Permite modificar importe en Remitos | clsComp_Com.GetRem_Pendientes — RN.Facturacion/clsComp_Com.cs:45; clsIvaCom.GetFPITEM_Pendientes — RN.Facturacion/clsIvaCom.cs:599; clsNPedido.GetNP_Pendientes — RN.Facturacion/clsNPedido.cs:257; (+1 más) |
| 2691 | VAR | Lógico | Permitir ingresar 4 decimales en cantidad de productos con stock al cargar compras. — _obs: La activacion de esta variable genera inconsistencias en el Stock_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2705 | VAR | Lógico | Obligar seleccionar destinatario a solicitud de aprovisionamiento | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2709 | VAR | Lógico | No incluir datos de empleados | GetDatosInforme.CtacteProveedor — RN.Facturacion/clsInformes_Compras.cs:890 |
| 2735 | VAR | Lógico | Fecha de entrega O.C obligatoria. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2777 | VAR | Lógico | En pagos informar anticipos pendiente de proveedor | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2791 | VAR | Lógico | No tomar iva de productos al importar items en compras — _obs: Requiere que el remito y el remito de devolución discriminen iva_ | clsComp_Com.GetRem_Pendientes — RN.Facturacion/clsComp_Com.cs:45; clsIvaCom.GetFPITEM_Pendientes — RN.Facturacion/clsIvaCom.cs:599; clsNPedido.GetNP_Pendientes — RN.Facturacion/clsNPedido.cs:257; (+1 más) |
| 2810 | VAR | Lógico | Fecha Estimada de Pago O.C obligatoria | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2813 | VAR | Lógico | Codigo de Regimen obligatorio en Retenciones y Percepciones | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2836 | VAR | Lógico | Permitir modificar manualmente las retenciones | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2867 | VAR | Lógico | Permitir doble autorización en solicitudes de aprovisionamiento | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2888 | VAR | Entero (FK a tabla) | Mail para solicitar cotización de materiales de una solicitud — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2890 | VAR | Lógico | Registrar contablemente como gasto el IVA no tomado | clsCierreDiario.GererarAsiento_Compras_Facturacion — RN.Contabilidad/clsCierreDiario.cs:2137 |
| 2893 | VAR | Entero (FK a tabla) | Plantilla a utilizar en el envio de una invitacion de concurso o licitación — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2896 | VAR | Lógico | Utilizar Grupo de Secciones en compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2902 | VAR | Lógico | Permitir cargar y mostrar procentaje de iva en compras de secciones para plan de cuentas | clsCierreDiario.GererarAsiento_Compras_Facturacion — RN.Contabilidad/clsCierreDiario.cs:2138; GetDatosInforme.LibroIvaCompras — RN.Facturacion/clsInformes_Compras.cs:1742; GetDatosInforme.Get_DetallePorActividad — RN.Facturacion/clsInformes_Compras.cs:1800; (+2 más) |
| 2905 | VAR | Entero (FK a tabla) | Plantilla a utilizar en el envio por mail de una orden de compra — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2906 | VAR | Lógico | Mostrar Panel de Unidad de Gasto al cargar productos desde un Vale | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2967 | VAR | Lógico | Utilizar partes de producción | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2977 | VAR | Lógico | Consultar el ingreso de CAE/CAI al cargar una factura. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2989 | VAR | Lógico | Mostrar aviso de que el producto no controla stock al agregarlo en un remito. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3030 | VAR | Lógico | Cargar item como pendiente activado si controla stock. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3043 | VAR | Lógico | No permitir generar partes de producción sin ordenes de fabricación. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3044 | VAR | Lógico | Permitir cargar días posteriores en pagos a proveedores con transferencias. | clsPagoFacturas.ProcesarMediosDePago — RN.Compras/clsPagoFacturas.cs:506 |
| 3057 | VAR | Entero (FK a tabla) | Responsable por defecto para generar parte de produccion — FK `RESPONSA.COD_RES` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3067 | VAR | Lógico | No permitir exceder el mes actual en la fecha de comprobantes de compra | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3068 | VAR | Lógico | Exigir cuenta contable al cargar o modificar un proveedor | abm_Proveed.abmProveedor__ValidFields — Cfg/Configuracion/abm_Proveed.cs:601 |
| 3071 | VAR | Lógico | Preguntar si desea imprimir las etiquetas al cargar comprobantes que muevan stock | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3101 | VAR | Lógico | Permitir cargar Obras en items de Compras | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3119 | VAR | Lógico | Mostrar importes en pesos en la planilla comparativa de precios | clsInformes_Compras.GetExcel_ComparativaPrecios — RN.Facturacion/clsInformes_Compras.cs:6359 |
| 3171 | VAR | Lógico | No permitir finalizar ordenes de fabricación manualmente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### STOCK (14 parámetros, 5 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 161 | VAR | Entero (FK a tabla) | Depósito por Defecto (Stock) — FK `DEPOSITO.COD_DPS` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 164 | VAR | Entero (FK a tabla) | Depósito por Defecto (Ventas) — FK `DEPOSITO.COD_DPS` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 221 | VAR | Lógico | Exigir carga de remitos al registrar dispositivos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 373 | VAR | Lógico | No Permitir Stock Negativo en Movimientos entre Depositos. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2341 | VAR | Entero (lista de opciones) | Método de Calculo — opciones: FIFO; LIFO; PPP; Precio Venta; Precio Costo — _obs: FIFO_ | clsInformes_Stock.GetFiltros — RN.Stock/clsInformes_Stock.cs:3077; clsInformes_Stock.Imprimir — RN.Stock/clsInformes_Stock.cs:3999; clsRevaluacion.InicializarFormulario — RN.Stock/clsRevaluacion.cs:324 |
| 2416 | VAR | Lógico | Utilizar los precios de los productos trazables para la valuación | GetDatosInforme.GetCosto_OT — RN.Stock/clsInformes_Stock.cs:1273; GetDatosInforme.GetCosto_OM — RN.Stock/clsInformes_Stock.cs:1461; GetDatosInforme.GetCosto_Vales — RN.Stock/clsInformes_Stock.cs:1852; (+2 más) |
| 2419 | VAR | Lógico | Exigir ingresar obras en los vales | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2525 | VAR | Lógico | No Permitir stock negativo en movimientos de Vales | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2565 | VAR | Lógico | Avisar si la operación a realizar va a provocar que el stock del producto quede por debajo del minimo configurado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2609 | VAR | Entero (FK a tabla) | Obra para Vales generados desde Procoop INTEGRA — FK `CON_COM.COD_CON` | clsProcoop_Integra.Post_Stock — RN.Varios.Generales/clsProcoop_Integra.cs:2787 |
| 3003 | VAR | Lógico | Permitir Movimiento de stock al lanzar Parte de Producción. | clsOfParteProduccion.Lanzar — RN.Varios.Fabricacion/clsOfParteProduccion.cs:678 |
| 3015 | VAR | Entero (FK a tabla) | Producto utilizado para determinar costo de mano de obra. — FK `PROD_SER.COD_PRO` | clsOrdeFab.Guardar — RN.Fabricacion/clsOrdeFab.cs:500; clsProdSer.Get_CostoFijo — RN.Facturacion/clsProdSer.cs:999; clsProdSer.GetProductosValorizados — RN.Facturacion/clsProdSer.cs:1144; (+3 más) |
| 3041 | VAR | Numérico (FK a tabla) | Obra por Defecto para Revaluar Automáticamente al Precio de costo — FK `OBRAS.COD_OBR` — _obs: Al actualizar precios de costo de compras de productos se revalua al costo el stock. Requiere tambien var.3042_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3042 | VAR | Numérico (FK a tabla) | Responsable por Defecto para Revaluar Automáticamente al Precio de costo — FK `RESPONSA.COD_RES` — _obs: Al actualizar precios de costo de compras de productos se revalua al costo el stock. Requiere tambien var.3041_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### FABRICACION (4 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 165 | VAR | Entero (FK a tabla) | Depósito por Defecto (Producción) — FK `DEPOSITO.COD_DPS` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 166 | VAR | Entero (FK a tabla) | Depósito por Defecto (Componentes) — FK `DEPOSITO.COD_DPS` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 168 | VAR | Fecha (texto) | Ultima Fecha de Requerimiento | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3040 | VAR | Texto | Id de la Orden de Fabricación genérica utilizada en el proceso de productos dañados | clsOrdeFab.ProcesarProductosDañados — RN.Fabricacion/clsOrdeFab.cs:1704 |

#### CONTABILIDAD (87 parámetros, 37 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 67 | VAR | Fecha (texto) | Fecha de Cierre de Comprobantes de Venta | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5353; Filtros.ValidarFiltros — RN.Facturacion/clsModificacionFacturas.cs:102; clsModificacionFacturas.validarFacturas — RN.Facturacion/clsModificacionFacturas.cs:392 |
| 432 | VAR | Fecha (texto) | Fecha de Cierre de Stock | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5356; clsValorizarStock.ValorizarMovimientosTrazables — RN.Stock/clsMov_pro.cs:874 |
| 500 | VAR | Fecha (texto) | Fecha de Cierre de Compras | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5336 |
| 502 | VAR | Fecha (texto) | Fecha de Cierre de Bancos | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5339 |
| 504 | VAR | Fecha (texto) | Fecha de Cierre de Financiaciones | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5345 |
| 505 | VAR | Fecha (texto) | Fecha de Cierre de Viviendas | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5342 |
| 506 | VAR | Fecha (texto) | Fecha de Cierre de Tesoreria | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5350 |
| 508 | VAR | Texto | Prefijo para cuentas de Pasivo.\t2 | clsCierreDiario.CierreCtasPatrimoniales — RN.Contabilidad/clsCierreDiario.cs:7966 |
| 509 | VAR | Texto | Prefijo para cuentas de patrimonio neto.    3 | clsCierreDiario.CierreCtasPatrimoniales — RN.Contabilidad/clsCierreDiario.cs:7967 |
| 510 | VAR | Texto | Prefijo para cuentas de ganancias.  4 | clsCierreDiario.CierreResultados — RN.Contabilidad/clsCierreDiario.cs:7904 |
| 511 | VAR | Texto | Prefijo para cuentas de pérdidas.   5 | clsCierreDiario.CierreResultados — RN.Contabilidad/clsCierreDiario.cs:7905; GetDatosInforme.ExportarCSV_OCEBA — RN.Contabilidad/clsInformes_Contabilidad.cs:981 |
| 512 | VAR | Texto | Prefijo para cuentas de órden.  6 | clsCierreDiario.ValidarCierre — RN.Contabilidad/clsCierreDiario.cs:7864 |
| 513 | VAR | Numérico (cuenta contable) | Cuenta para asignación de resultados | GetDatosInforme.ExportarExcel_OCEBA — RN.Contabilidad/clsInformes_Contabilidad.cs:928; GetDatosInforme.ExportarCSV_OCEBA — RN.Contabilidad/clsInformes_Contabilidad.cs:1048 |
| 514 | VAR | Texto | Prefijo para cuentas de Activo.  1 | clsCierreDiario.CierreCtasPatrimoniales — RN.Contabilidad/clsCierreDiario.cs:7965 |
| 2101 | VAR | Numérico (cuenta contable) | CIERRE DE CAJA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2102 | VAR | Numérico (cuenta contable) | FACTURACION | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2103 | VAR | Numérico (cuenta contable) | REFINANCIACIONES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2104 | VAR | Numérico (cuenta contable) | IVA INCRIPTO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2105 | VAR | Numérico (cuenta contable) | IVA NO INSCRIPTO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2106 | VAR | Numérico (cuenta contable) | PERCEPCIONES EN PRODUCTOS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2107 | VAR | Numérico (cuenta contable) | PERCEPCIONES NO CATEGORIZADOS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2108 | VAR | Numérico (cuenta contable) | ENERGIA ELECTRICA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2109 | VAR | Numérico (cuenta contable) | INTERESES EN VENCIMIENTOS DOS Y TRES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2110 | VAR | Numérico (cuenta contable) | DESCUENTOS EN REMITOS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2111 | VAR | Numérico (cuenta contable) | CONCEPTOS DESCONOCIDOS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2112 | VAR | Numérico (cuenta contable) | COMPRAS / PROVEEDORES | GetDatosInforme.DeudaProveedor — RN.Facturacion/clsInformes_Compras.cs:582; GetDatosInforme.DeudaProveedorPagoAutorizado — RN.Facturacion/clsInformes_Compras.cs:627; GetDatosInforme.DeudaProveedor_Detalles — RN.Facturacion/clsInformes_Compras.cs:665; (+1 más) |
| 2113 | VAR | Numérico (cuenta contable) | IVA CREDITO FISCAL | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2114 | VAR | Numérico (cuenta contable) | IMPUESTOS VARIOS EN COMPRAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2118 | VAR | Numérico (cuenta contable) | CREDITOS BANCARIOS SIN SUBCATEGORIAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2119 | VAR | Numérico (cuenta contable) | DEBITOS BANCARIOS SIN SUBCATEGORIAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2121 | VAR | Numérico (cuenta contable) | TARJETAS DE CREDITO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2122 | VAR | Numérico (cuenta contable) | VALORES EN CARTERA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2125 | VAR | Numérico (cuenta contable) | DEVENGAMIENTO DE IVA EN REFINANCIACIONES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2126 | VAR | Numérico (cuenta contable) | PREVISION PARA DEUDORES INCOBRABLES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2127 | VAR | Numérico (cuenta contable) | TARJETAS DE CREDITO PRESENTADAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2128 | VAR | Numérico (cuenta contable) | COMISIONES DE TARJETAS DE CREDITO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2129 | VAR | Numérico (cuenta contable) | MOVIMIENTOS DE CAPITAL | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2130 | VAR | Numérico (cuenta contable) | CAPITAL A DEVOLVER | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2131 | VAR | Numérico (cuenta contable) | CAPITAL RESCATADO POR SOCIOS INCOBRABLES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2133 | VAR | Numérico (cuenta contable) | CAPITAL INTEGRADO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2134 | VAR | Numérico (cuenta contable) | VALORES RECHAZADOS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2135 | VAR | Numérico (cuenta contable) | INTERESES A FUTURO POR FINANCIACIONES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2136 | VAR | Numérico (cuenta contable) | RETENCIONES EN TESORERIA | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2137 | VAR | Numérico (cuenta contable) | DIFERENCIAS EN CAJAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2138 | VAR | Numérico (cuenta contable) | INTERESES POR VENTA EN CUOTAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2139 | VAR | Numérico (cuenta contable) | CUENTA CONTABLE PARA AJUSTE POR INFLACION | clsCierreDiario.GenerarAsientoAjustesPorInflacion — RN.Contabilidad/clsCierreDiario.cs:6784; clsCierreDiario.BienesDeUso_AjusteInf — RN.Contabilidad/clsCierreDiario.cs:7715; clsContabilidad.GetSumasYSaldos — RN.Contabilidad/clsContabilidad.cs:1704 |
| 2141 | VAR | Numérico (cuenta contable) | DESCUENTOS EN PAGOS A PROVEEDORES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2148 | VAR | Numérico (cuenta contable) | PAGO A PROVEEDORES EN EFECTIVO | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2149 | VAR | Numérico (cuenta contable) | PAGO A PROVEEDORES CON VALORES | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2150 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a Ordenes de trabajo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2151 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a ordenes de Mantenimiento | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2152 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a Conciliaciones | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2153 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a Vales | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2154 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a Altas en Orden | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2155 | VAR | Numérico (cuenta contable) | Compras - Pagos en Efectivo desde Caja | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2156 | VAR | Numérico (cuenta contable) | Compras - Pagos Con transferencia Diferida | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2158 | VAR | Numérico (cuenta contable) | Facturación - Cuenta para Prescripción de deuda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2159 | VAR | Numérico (cuenta contable) | Compras - Cuentas Asociadas a Descuento de Productos/Conceptos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2160 | VAR | Numérico (cuenta contable) | Ventas - Cuentas Asociadas a Percepción de Productos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2161 | VAR | Numérico (cuenta contable) | Stock - Cuenta asociada a productos en comodato | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2162 | VAR | Numérico (cuenta contable) | Compras - Cuenta para productos pendiente de entrega. | clsCierreDiario.Iniciar_Thread — RN.Contabilidad/clsCierreDiario.cs:434; frmComprobantes_Handler.GuardarRemito — RN.Facturacion/frmComprobantes_Handler.cs:1696 |
| 2163 | VAR | Numérico (cuenta contable) | Redondeo para Cierre de Facturacion Mensual | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2164 | VAR | Numérico (cuenta contable) | Redondeo para Cierre de Caja Diario. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2165 | VAR | Numérico (cuenta contable) | Cobranza - Cuenta para acreditaciones pendientes a bancos. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2166 | VAR | Numérico (cuenta contable) | Tecnica - Cuenta para horas normales y extra de los participantes. | clsCierreDiario.Stock_OT — RN.Contabilidad/clsCierreDiario.cs:3377; clsCierreDiario.Stock_OM — RN.Contabilidad/clsCierreDiario.cs:3597 |
| 2167 | VAR | Numérico (cuenta contable) | Tecnica - Cuenta para horas valuadas de los participantes. | clsCierreDiario.Stock_OT — RN.Contabilidad/clsCierreDiario.cs:3378; clsCierreDiario.Stock_OM — RN.Contabilidad/clsCierreDiario.cs:3598 |
| 2190 | VAR | Entero (lista de opciones) | Tipo Liquidacion a Deudores por servicios | clsCierreDiario.GetItems_Agrupados — RN.Contabilidad/clsCierreDiario.cs:4612; clsCierreDiario.GenerarAsientoVentas — RN.Contabilidad/clsCierreDiario.cs:4679; clsCierreDiario.GenerarAsiento_Financiaciones — RN.Contabilidad/clsCierreDiario.cs:5626; (+3 más) |
| 2191 | VAR | Lógico | No utilizar grupos contables al realizar asientos | clsCierreDiario.GetGruposContableAsignados — RN.Contabilidad/clsCierreDiario.cs:4601; clsCierreDiario.GetFiltros — RN.Contabilidad/clsCierreDiario.cs:5443; clsCierreDiario.Financiaciones — RN.Contabilidad/clsCierreDiario.cs:5542; (+2 más) |
| 2376 | VAR | Fecha (texto) | Fecha de Cierre de Sueldos | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5359 |
| 2528 | VAR | Fecha (texto) | Fecha de Cierre de Contabilidad | clsAsiento.Validar — RN.Contabilidad/clsAsiento.cs:767; clsAsiento.Validar_CierreContable — RN.Contabilidad/clsAsiento.cs:948; clsModificacionFacturas.validarFacturas — RN.Facturacion/clsModificacionFacturas.cs:396 |
| 2547 | VAR | Lógico | Utilizar Gastos e Ingresos Por Sección | clsCierreDiario.TotalSeccionesRubroRemitos — RN.Contabilidad/clsCierreDiario.cs:290; clsInformes_Contabilidad.GetFiltros — RN.Contabilidad/clsInformes_Contabilidad.cs:3108; clsInformes_Contabilidad.Imprimir — RN.Contabilidad/clsInformes_Contabilidad.cs:3701; (+4 más) |
| 2548 | VAR | Lógico | Utilizar cuenta de compras en Asientos de OT y OM | clsCierreDiario.Stock_OT — RN.Contabilidad/clsCierreDiario.cs:3432; clsCierreDiario.Stock_OM — RN.Contabilidad/clsCierreDiario.cs:3646 |
| 2619 | VAR | Entero (lista de opciones) | Deudores por Refinanciación — opciones: No separar por tipo de deudor; Separar por tipo de deudor — _obs: No separar deudores refinanciación por tipo_ | clsCierreDiario.GenerarAsientoVentas — RN.Contabilidad/clsCierreDiario.cs:4778; clsCierreDiario.GenerarAsiento_Financiaciones — RN.Contabilidad/clsCierreDiario.cs:5604; clsCierreDiario.InteresesFinanciaciones — RN.Contabilidad/clsCierreDiario.cs:5920; (+1 más) |
| 2714 | VAR | Lógico | Utilizar Gastos e Ingresos Por Sección Solo en Sueldos | clsCierreDiario.TotalSeccionesRubroRemitos — RN.Contabilidad/clsCierreDiario.cs:292; clsInformes_Contabilidad.GetFiltros — RN.Contabilidad/clsInformes_Contabilidad.cs:3108; clsInformes_Contabilidad.Imprimir — RN.Contabilidad/clsInformes_Contabilidad.cs:3702; (+2 más) |
| 2734 | VAR | Lógico | Mostrar Asiento Contable de Productos en Comodato | clsCierreDiario.GenerarAsientoStock — RN.Contabilidad/clsCierreDiario.cs:3330 |
| 2778 | VAR | Fecha (texto) | Fecha de Cierre Bienes de Uso | Nucleo.GetFechaCierre — CapaNucleo/Nucleo.cs:5365; abm_Bienes_Uso.Validar — Cfg.Forms/abm_Bienes_Uso.cs:587 |
| 2814 | VAR | Lógico | Mostrar columna Sub-Cuenta en administración de cuentas contables | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2924 | VAR | Texto | Códigos de impuesto a informar en archivo de Percepciones de IIBB - BS AS (separados por coma) | clsContabilidad.Get_Percepciones_BsAs — RN.Contabilidad/clsContabilidad.cs:941; clsContabilidad.GetCantImportar — RN.Contabilidad/clsContabilidad.cs:1165 |
| 2935 | VAR | Entero | Código de Impuesto para Base Imponible en Archivo para DGR (Percepciones) | GetDatosInforme.Exportar_ArchivoDGR — RN.Contabilidad/clsInformes_Contabilidad.cs:594 |
| 2936 | VAR | Lógico | Separa cuentas de revaluo | clsCierreDiario.TotalSeccionesRubroRemitos — RN.Contabilidad/clsCierreDiario.cs:294; abm_rps.CargarControles — Cfg/Configuracion/abm_rps.cs:146 |
| 2978 | VAR | Entero | Cantidad de decimales en porcentaje de secciones de asientos contables | clsAsiento.AgregarDetalle — RN.Contabilidad/clsAsiento.cs:306; clsAsiento.Comprimir — RN.Contabilidad/clsAsiento.cs:793; clsContabilidad.Get_CantidadDecimalesSeccioens — RN.Contabilidad/clsContabilidad.cs:480 |
| 2982 | VAR | Lógico | Generar asiento con todos los remitos | clsCierreDiario.GererarAsiento_Compras_Remitos — RN.Contabilidad/clsCierreDiario.cs:2450; frmComprobantes_Handler.AgregarDetalle — RN.Facturacion/frmComprobantes_Handler.cs:1064; frmComprobantes_Handler.GuardarComp — RN.Facturacion/frmComprobantes_Handler.cs:2365 |
| 3028 | VAR | Lógico | Validar asientos ya generados | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3061 | VAR | Lógico | Tomar rubro del producto de financiacion. Variable 308 | clsCierreDiario.GenerarAsientoVentas — RN.Contabilidad/clsCierreDiario.cs:4772; clsCierreDiario.GenerarAsiento_Cobranza — RN.Contabilidad/clsCierreDiario.cs:6274 |
| 3076 | VAR | Lógico | Usar valores historicos de bienes de uso para amortizacion e inflacion | clsAsiento.Eliminar — RN.Contabilidad/clsAsiento.cs:535; clsCierreDiario.TotalSeccionesRubroRemitos — RN.Contabilidad/clsCierreDiario.cs:296; abm_Bienes_Uso.? — Cfg.Forms/abm_Bienes_Uso.cs:41 |
| 3100 | VAR | Lógico | Valida que las cajas esten cerradas en asiento de Cobranzas | clsCierreDiario.Cobranza — RN.Contabilidad/clsCierreDiario.cs:6109 |
| 3141 | VAR | Numérico (cuenta contable) | Fabricación - Cuenta para productos en produccion. | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### TESORERIA (33 parámetros, 16 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 370 | VAR | Texto | Informe para imprimir Valores | clsChequeras.ImprimirValores — RN.Tesoreria/clsChequeras.cs:408 |
| 490 | VAR | Entero (FK a tabla) | Concepto Para Importe Exento en Liq. De Tarjeta. — FK `CON_COM.COD_CON` | clsTesoreria.CobrarCupones — RN.Tesoreria/clsTesoreria.cs:1647 |
| 498 | VAR | Entero (FK a tabla) | Concepto Para Impuestos en Liq. De Tarjeta. (solo Impuestos) — FK `CON_COM.COD_CON` | clsTesoreria.CobrarCupones — RN.Tesoreria/clsTesoreria.cs:1651 |
| 813 | VAR | Entero (FK a tabla) | Concepto para Comisiones IVA diferencial en pago de tarjetas. — FK `CON_COM.COD_CON` | clsTesoreria.CobrarCupones — RN.Tesoreria/clsTesoreria.cs:1643 |
| 2046 | VAR | Entero (FK a tabla) | Concepto Para las Comisiones en Liq. De Tarjeta. — FK `CON_COM.COD_CON` | clsTesoreria.CobrarCupones — RN.Tesoreria/clsTesoreria.cs:1639 |
| 2058 | VAR | Lógico | Permitir salida de Efectivo en Cambio de Valores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2059 | VAR | Lógico | Permitir salida de Valores en Cambio de Valores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2060 | VAR | Lógico | Permitir salida de Cheques Propios y Transferencias en Cambio de Valores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2061 | VAR | Lógico | Permitir entrada de Efectivo en Cambio de Valores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2062 | VAR | Lógico | Permitir entrada de Valores en Cambio de Valores | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2063 | VAR | Entero (FK a tabla) | Categoría de Comp. depósito de Efectivo - Tesorería — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2064 | VAR | Entero (FK a tabla) | Categoría de Comp. depósito de Valores - Tesorería — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2066 | VAR | Entero (FK a tabla) | Categoría de Comp. depósito de valores-OP-Salida — FK `CAT_BANC.CAT_COMP` | clsPagoFacturas.RegistrarResBan — RN.Compras/clsPagoFacturas.cs:598 |
| 2067 | VAR | Entero (FK a tabla) | Cuenta de Mvto para Cheques Rechazados — FK `BANKOS.COD_BAN` | clsTesoreria.getValoresEntregadosRechazados — RN.Tesoreria/clsTesoreria.cs:849; clsTesoreria.Registrar_Movimiento — RN.Tesoreria/clsTesoreria.cs:2339 |
| 2074 | VAR | Entero (FK a tabla) | Categoría de Comp. Cambio de Valores - Egreso en Tesore — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2075 | VAR | Entero (FK a tabla) | Categoría de Comp. Cambio de Valores - Ingreso en Tesore — FK `CAT_BANC.CAT_COMP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2076 | VAR | Entero (FK a tabla) | Cuenta de Mvto para Cambio de Valores — FK `BANKOS.COD_BAN` | clsCierreDiario.Tesoreria_CambioDeValores — RN.Contabilidad/clsCierreDiario.cs:691; clsCierreDiario.Tesoreria_CambioDeValoresGenerarAsiento — RN.Contabilidad/clsCierreDiario.cs:758 |
| 2288 | VAR | Lógico | Permitir Modificar Fecha de transferencia — _obs: ATENCIÓN: Esto puede generar diferencias contables_ | clsSueldos.GenerarPago — RN.Sueldos/clsSueldos.cs:710 |
| 2378 | VAR | Lógico | Permitir Cobros de Cupones sin comisiones | clsTesoreria.AnularCobrarCupones — RN.Tesoreria/clsTesoreria.cs:1778 |
| 2384 | VAR | Entero (FK a tabla) | Concepto Para Importe Exento en Cheques Rechazados — FK `CON_COM.COD_CON` | clsCierreDiario.Tesoreria_Ing_EG_Excepcional — RN.Contabilidad/clsCierreDiario.cs:987; clsCierreDiario.Tesoreria_Ing_EG_ExcepcionalGenerarAsientos — RN.Contabilidad/clsCierreDiario.cs:1107; clsTesoreria.RechazoDeValoresEntregados — RN.Tesoreria/clsTesoreria.cs:1545 |
| 2454 | VAR | Lógico | Permitir al Cobrar Cupones, seleccionar cupones de otros Bancos | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2456 | VAR | Entero (lista de opciones) | Validar feriados al cargar un cheque propio ó valores de terceros — opciones: Ni preguntar, ni exigir; Preguntar; Exigir — _obs: Ni preguntar, ni exigir_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2486 | VAR | Entero (FK a tabla) | Tipo de Valor por defecto al cargar nuevos Valores de Tercero — FK `TIP_VAL.COD_TIP` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2516 | VAR | Lógico | Permitir Seleccionar Comprobante de Compra en Rechazo de Valores Entregados | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2517 | VAR | Entero (FK a tabla) | Concepto Para Gastos en Cheques Rechazados — FK `CON_COM.COD_CON` | clsTesoreria.RechazoDeValoresEntregados — RN.Tesoreria/clsTesoreria.cs:1566 |
| 2536 | VAR | Entero | Maxima cantidad de dias para determinar cheques vencidos — _obs: Por defecto el sistema controla 30 dias_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2543 | VAR | Lógico | No validar capital pagado en cierre de cajas | clsCajas.CerrarCaja — RN.Tesoreria/clsCajas.cs:608 |
| 2578 | VAR | Entero | Mínima cantidad de meses para la fecha de Conciliación de Cuentas Bancarias | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2604 | VAR | Lógico | No validar en días no hábiles al cargar un cheque propio o transferencia | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2688 | VAR | Lógico | Habilitar cierre de caja de varios días (Solo Efectivo) | clsCajas.AnularCierreCajas — RN.Tesoreria/clsCajas.cs:662 |
| 2732 | VAR | Lógico | Mostrar check adicional en cobro de cupones de tarjeta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2952 | VAR | Lógico | Realizar Presentacion de Retenciones automaticamente al agregar retenciones | clsCajas.CerrarCaja — RN.Tesoreria/clsCajas.cs:524; clsTesoreria.GenerarMov_Extraordinario — RN.Tesoreria/clsTesoreria.cs:1953 |
| 3178 | VAR | Lógico | Generar comprobante formal en rechazo de cupones de tarjeta | clsTesoreria.CrearAnticipoRechazoCupones — RN.Tesoreria/clsTesoreria.cs:1408 |

#### SUELDOS (28 parámetros, 18 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 326 | VAR | Entero | Código de convenio para Banco de la Provincia de Cordoba. | GetDatosInforme.ExportarArchivoBancoCordoba — RN.Sueldos/clsInformes_Sueldo.cs:2007; GetDatosInforme.ExportarArchivoBancoCordoba_Bancon — RN.Sueldos/clsInformes_Sueldo.cs:2091; GetDatosInforme.ExportarArchivoBancoCordoba_Excel — RN.Sueldos/clsInformes_Sueldo.cs:2168 |
| 2207 | VAR | Entero (lista de opciones) | Formato de Asiento | clsCierreDiario.GenerarAsientosSueldos — RN.Contabilidad/clsCierreDiario.cs:4360 |
| 2262 | VAR | Texto | CBU para pago de sueldos con Interbanking | clsProveedor.ExportarArchivo_Interbanking — ReglasNegocio/clsProveedor.cs:167; GetDatosInforme.ExportarArchivoInterbanking — RN.Sueldos/clsInformes_Sueldo.cs:2249; GetDatosInforme.ExportarArchivoChubut — RN.Sueldos/clsInformes_Sueldo.cs:3029 |
| 2406 | VAR | Texto | CBU para pago de sueldos con Banco Macro | GetDatosInforme.ExportarArchivoMacro — RN.Sueldos/clsInformes_Sueldo.cs:2324 |
| 2437 | VAR | Numérico | Importe tope de aportes para los meses de junio y diciembre | GetDatosInforme.ExportarArchivoSicoss — RN.Sueldos/clsInformes_Sueldo.cs:779; LibroSueldoDigital.Get_Registros_Tipo4 — RN.Sueldos/LibroSueldoDigital.cs:432 |
| 2438 | VAR | Numérico | Importe tope de aportes para los meses normales | GetDatosInforme.ExportarArchivoSicoss — RN.Sueldos/clsInformes_Sueldo.cs:780; LibroSueldoDigital.Get_Registros_Tipo4 — RN.Sueldos/LibroSueldoDigital.cs:433 |
| 2449 | VAR | Texto | Exportar Archivo Banco nacion - Identificador de empresa Asignado por el Banco | GetDatosInforme.ExportarArchivoBancoNacion — RN.Sueldos/clsInformes_Sueldo.cs:2491; GetDatosInforme.ExportarArchivoBancoNacion_3 — RN.Sueldos/clsInformes_Sueldo.cs:2635; GetDatosInforme.ExportarArchivoBancoNacion_2 — RN.Sueldos/clsInformes_Sueldo.cs:2832; (+1 más) |
| 2468 | VAR | Lógico | Exportar Archivo Banco nacion- Utilizar Cuenta Bancaria Asignada al empleado al exportar Banco Nación | GetDatosInforme.ExportarArchivoBancoNacion — RN.Sueldos/clsInformes_Sueldo.cs:2511 |
| 2481 | VAR | Lógico | Mostrar Solo Conceptos Activos por Defecto | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2484 | VAR | Lógico | Solicitar Fecha de Pago en caso de que no existiese | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2538 | VAR | Numérico (FK a tabla) | Tipo de Novedad para agregar por adelanto de sueldo desde Compras — FK `SU_TIPO_NOVEDADES.COD_TIPO` | clsPagoFacturas.Anular — RN.Compras/clsPagoFacturas.cs:776; IvaCom_Pendientes.IvaCom_Pendientes — RN.Facturacion/clsIvaCom.cs:160 |
| 2598 | VAR | Entero | Año de Control para días de Vacaciones pendientes | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2611 | VAR | Entero (lista de opciones) | Año Calendario para Liquidar Impuesto a las Ganancias — opciones: Enero a Diciembre; Febrero a Enero; Diciembre a Noviembre; Enero a Diciembre Según Fecha de Pago — _obs: Enero a Diciembre_ | clsDatosEmpleado.lstFamiliares — RN.Sueldos/clsDatosEmpleado.cs:344; Ganancias_ImporteRetencion_LiqFinal.Evaluate — RN.Sueldos/clsFormulas_Sueldo.cs:255; Ganancias_DeduccionesEspeciales.Evaluate — RN.Sueldos/clsFormulas_Sueldo.cs:358; (+15 más) |
| 2671 | VAR | Texto | CBU para pago de sueldos con Banco Nación | GetDatosInforme.ExportarArchivoBancoNacion_3 — RN.Sueldos/clsInformes_Sueldo.cs:2636; GetDatosInforme.ExportarArchivoBancoNacion_2 — RN.Sueldos/clsInformes_Sueldo.cs:2833 |
| 2672 | VAR | Texto | Código de convenio para Banco Nación | GetDatosInforme.ExportarArchivoBancoNacion_3 — RN.Sueldos/clsInformes_Sueldo.cs:2637; GetDatosInforme.ExportarArchivoBancoNacion_2 — RN.Sueldos/clsInformes_Sueldo.cs:2834 |
| 2685 | VAR | Lógico | Mostrar Fila de Filtrado en Recibos de Sueldo | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2751 | VAR | Lógico | Tomar configuración de recibo de sueldos segun comprobante | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2763 | VAR | Lógico | Al importar SIRADIG se cargan novedades con fecha noviembre al ser novedades de diciembre y tener tramas corridas | clsNovedades.Cargar_Novedades — RN.Sueldos/clsNovedades.cs:1196 |
| 2886 | VAR | Lógico | Utilizar recibos sin firma digital en procoop.ar | clsSueldos.GetRecibosFirmados — RN.Sueldos/clsSueldos.cs:822 |
| 2942 | VAR | Texto | CBU para pago de sueldos con Banco Chubut | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2943 | VAR | Texto | Exportar Archivo Banco Chubut - Identificador de empresa Asignado por el Banco | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2944 | VAR | Texto | Exportar Archivo Banco Santander - Identificador de empresa Asignado por el Banco | GetDatosInforme.ExportarArchivoSantander — RN.Sueldos/clsInformes_Sueldo.cs:3141 |
| 2985 | VAR | Lógico | Utilizar el formato CUIL_AÑO_MES en el nombre de archivo al exportar los recibos en PDF | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3016 | VAR | Lógico | Clasificar el concepto Redondeo como tipo No Remunerativo | clsSueldos.GetItems — RN.Sueldos/clsSueldos.cs:1100 |
| 3065 | VAR | Lógico | Topear vacaciones proporcional | LibroSueldoDigital.Get_Registros_Tipo2 — RN.Sueldos/LibroSueldoDigital.cs:325; LibroSueldoDigital.Get_Registros_Tipo4 — RN.Sueldos/LibroSueldoDigital.cs:435 |
| 3081 | VAR | Lógico | Mostrar abm de EMPLEADOS integrandole el abm de PERSONAS | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3107 | VAR | Entero | Permitir enviar notificar recibo de sueldo pendiente de firmar | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3129 | VAR | Lógico | Permitir multiples entidades bancarias en el empleado | GetDatosInforme.GetIqueryableSueldosBanco — RN.Sueldos/clsInformes_Sueldo.cs:1638; GetDatosInforme.ExportarArchivoBancoCredicoop — RN.Sueldos/clsInformes_Sueldo.cs:1959; GetDatosInforme.ExportarArchivoBancoCordoba — RN.Sueldos/clsInformes_Sueldo.cs:2041; (+10 más) |

#### VIVIENDA (14 parámetros, 9 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 634 | VAR | Numérico | Mínimo a pagar en factura eventual | clsFacturacionServicio.FacturacionVivienda — RN.Facturacion/clsFacturacionServicio.cs:2493; clsViviendas.Validar_Configuracion — RN.Titulares/clsViviendas.cs:285; clsViviendas.Get_InfoPlan — RN.Titulares/clsViviendas.cs:490; (+1 más) |
| 635 | VAR | Numérico | Mínimo a pagar luego de adjudicar vivienda | clsFacturacionServicio.FacturacionVivienda — RN.Facturacion/clsFacturacionServicio.cs:2493; clsViviendas.Validar_Configuracion — RN.Titulares/clsViviendas.cs:285; clsViviendas.Get_InfoPlan — RN.Titulares/clsViviendas.cs:490; (+1 más) |
| 636 | VAR | Numérico | Máximo a adelantar anualmente por Plan Vivienda | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 637 | VAR | Numérico | Cant. meses adeudados en facturas por F.Fiduciario | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 638 | VAR | Numérico | Concepto para Facturacion eventual | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 639 | VAR | Numérico (FK a tabla) | Tipo de Comprobante para Cuotas Plan de Viviendas — FK `TIPO_FAC.COD_TPFC` | clsAnulacionFacturas.AnularSersoc — RN.Facturacion/clsAnulacionFacturas.cs:617; clsComprobanteFactura.clsComprobanteFactura — RN.Facturacion/clsComprobanteFactura.cs:629; clsInformes_Vivienda.Get_InformeCambioPlan — RN.Titulares/clsInformes_Vivienda.cs:507; (+5 más) |
| 755 | VAR | Numérico (FK a tabla) | Comprobante para retiro de Materiales de Viviendas - Parámetros de Viviendas — FK `COMPROB.COD_COM` | clsCierreDiario.Stock_Vales — RN.Contabilidad/clsCierreDiario.cs:3916; GetDatosInforme.GetCosto_Vales — RN.Stock/clsInformes_Stock.cs:1804; clsViviendas.LiberarProductosViviendaRetirados — RN.Titulares/clsViviendas.cs:1467 |
| 2276 | VAR | Numérico (FK a tabla) | Concepto para liquidación por construcción de plan de vivienda — FK `PROD_SER.COD_PRO` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2502 | VAR | Numérico (FK a tabla) | Rubro para el Proveedor de viviendas — FK `RUBPROV.COD_RUB` | frmComprobantes_Handler.LeyendaObsVivienda — RN.Facturacion/frmComprobantes_Handler.cs:249; frmComprobantes_Handler.Validar — RN.Facturacion/frmComprobantes_Handler.cs:1231 |
| 2503 | VAR | Numérico (FK a tabla) | Rubro para productos para construir viviendas — FK `RUB_PYS.COD_RUB` | frmComprobantes_Handler.Validar — RN.Facturacion/frmComprobantes_Handler.cs:1233; clsInformes_Stock.Imprimir — RN.Stock/clsInformes_Stock.cs:4708; clsViviendas.Get_MaterialesLiberados — RN.Titulares/clsViviendas.cs:668 |
| 2569 | VAR | Lógico | Permitir realizar aporte de vivienda superior al % máximo de aporte indicado | clsViviendas.Validar_Guardar — RN.Titulares/clsViviendas.cs:306 |
| 2628 | VAR | Numérico (FK a tabla) | Comprobante a generar en entregas de planes de vivienda — FK `COMPROB.COD_COM` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2670 | VAR | Numérico (FK a tabla) | Obra por Defecto para Registracion contable de vales de vivienda — FK `OBRAS.COD_OBR` | clsCierreDiario.Stock_Vales — RN.Contabilidad/clsCierreDiario.cs:3917; GetDatosInforme.GetCosto_Vales — RN.Stock/clsInformes_Stock.cs:1805 |
| 3137 | VAR | Numérico (FK a tabla) | Concepto por diferencia en rescisión de plan de vivienda — FK `PROD_SER.COD_PRO` | clsDefault.AgregarChequeoEntidades — CapaNucleo/clsDefault.cs:724; clsViviendas.Baja_Plan — RN.Titulares/clsViviendas.cs:1011 |

#### TURNERO (11 parámetros, 7 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 67 | VAR_PMOVIL | Lógico | Habilitar registrar turno desde la web, es necesario tener habilitada la variable 3064 — canal: CoopOnline | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2005 | VAR | Entero (lista de opciones) | Forma en la que muestra el turnero a la proxima Persona — opciones: Por Nombre; Por Numero — _obs: Por Nombre_ | clsTurnero.CrearTurno — RN.Varios/clsTurnero.cs:260 |
| 2006 | VAR | Entero | Puerto a Utilizar para comunicarse con el Turnero | clsTurnero.clsTurnero — RN.Varios/clsTurnero.cs:120 |
| 2007 | VAR | Texto | Pantallas del Turnero (separados por \|) | clsTurnero.clsTurnero — RN.Varios/clsTurnero.cs:121 |
| 2014 | VAR | Entero (FK a tabla) | Box para generación automática de turnos — FK `TUR_BOX.COD_BOX` | clsTurnero.GetBoxesAbiertos — RN.Varios/clsTurnero.cs:176; clsProcoop_Integra.CrearTurno — RN.Varios.Generales/clsProcoop_Integra.cs:9384 |
| 2209 | VAR | Entero (lista de opciones) | Forma en la que muestra el turnero los últimos turnos — opciones: Últimos llamados; Agrupado por Box — _obs: Últimos llamados_ | clsTurnero.GetLamadas — RN.Varios/clsTurnero.cs:514 |
| 2240 | VAR | Entero (lista de opciones) | Modo en el que se visualiza el Turnero — opciones: Modelo 1 - Destacar Ultimo; Modelo 2 - Todos Iguales; Modelo 3 - Destacar Ultimo (Grande) — _obs: Modelo 1 - Destacar Ultimo_ | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2700 | VAR | Texto | Configuración de voz para lectura de Turnero | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3064 | VAR | Lógico | Usar ultimos 3 numeros del DNI para el turno y no imprimirlo | clsTurnero.CrearTurno — RN.Varios/clsTurnero.cs:264; clsProcoop_Integra.getTiempoEstimado — RN.Varios.Generales/clsProcoop_Integra.cs:9355 |
| 3072 | VAR | Lógico | Grilla de areas del turnero se despega del borde | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 3089 | VAR | Entero (FK a tabla) | Usuario para registración de Turnos en CoopOnline — FK `USERS.COD_USER` | clsProcoop_Integra.CrearTurno — RN.Varios.Generales/clsProcoop_Integra.cs:9385 |

#### TICKETS (3 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 2478 | VAR | Entero (FK a tabla) | Mail para el cierre de un ticket — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2479 | VAR | Entero (FK a tabla) | Mail para el registro de un Nuevo Ticket — FK `PLANTILLA.COD_PLA` | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2488 | VAR | Numérico | Importe por hora a bonificar | clsTickets.GenerarDeudaVta — RN.Varios.Tickets/clsTickets.cs:3145 |

#### MESA_DE_ENTRADAS (3 parámetros, 0 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 2630 | VAR | Lógico | Envío de correo a la cuenta configurada del incidente | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2631 | VAR | Lógico | Envío de correo a la cuenta configurada en cada interviniente registrado | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |
| 2632 | VAR | Lógico | Envío de correo al titular de la cuenta | — (sin lectura directa en RN/Cfg/PN; posiblemente lo usa CoopOnline/PMovil/Agente o vía enum) |

#### ACTIVIDADES (1 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 681 | VAR | Fecha (texto) | Fecha de Ultimo envio de Mails | clsSeguimiento.EnviarMails — RN.Actividades/clsSeguimiento.cs:37 |

#### (no catalogada) CapaNucleo (1 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 383 | VAR | ? | **(no declarada en catálogo)** Variable heredada; si existe junto con la 21, `FinalizarChequeos` traslada su valor a la 742 (migración). | clsChequeos.FinalizarChequeos — CapaNucleo/clsChequeos.cs:51 |

#### (no catalogada) RN.Cobranzas (4 parámetros, 4 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 473 | VAR | Lógico | **(no declarada en catálogo)** Registrar la factura generada en cobranzas con el punto de venta de la caja/usuario (si es falso, el punto de venta por defecto). | clsRegistracionCobranza.NuevaFactura — RN.Cobranzas/clsRegistracionCobranza.cs:1310 |
| 2206 | VAR | Lógico | **(no declarada en catálogo)** Emitir recibo/comprobante automático al registrar notificaciones de mora; también filtra circulares. | clsGestionMora.Guardar_Notificaciones — RN.Cobranzas/clsGestionMora.cs:989; clsGestionMora.Guardar_Comprobante — RN.Cobranzas/clsGestionMora.cs:1257; FiltrosCirculares.FiltrosCirculares — RN.Titulares/clsCirculares.cs:292 |
| 2803 | VAR | Entero | **(no declarada en catálogo)** Entidad de cobro (código de ente) que se usa para generar el QR de pago. | EntidadDigital.Get_Entidad_Qr — RN.Cobranzas/EntidadDigital.cs:798 |
| 3142 | VAR | Entero | **(no declarada en catálogo)** Entidad de cobro que se usa para el QR de pago en cajeros automáticos (QR ATM). | EntidadDigital.Get_Entidad_Qr_ATM — RN.Cobranzas/EntidadDigital.cs:823 |

#### (no catalogada) RN.Facturacion (2 parámetros, 2 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 74 | VAR | Entero | **(no declarada en catálogo)** Tipo de interés por pago fuera de término en la factura (enum `Facturacion_TipoInteresFactura`: fijo en pesos, porcentaje fijo, etc.). | clsComprobanteFactura.Get_ImporteFactura — RN.Facturacion/clsComprobanteFactura.cs:1774 |
| 79 | VAR | Lógico | **(no declarada en catálogo)** En CVLP, registrar la comisión como nota de débito en lugar de factura. | clsCVLP.GenerarCVLP — RN.Facturacion/clsCVLP.cs:277 |

#### (no catalogada) RN.Varios.Generales (1 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 2996 | VAR | Entero | **(no declarada en catálogo)** Entidad de cobro por defecto al procesar archivos de rendición en el Agente. | clsServicio_Procoop.Procesar_Archivo_Rendicion — RN.Varios.Generales/clsServicio_Procoop.cs:770 |

#### (no catalogada) RN.Varios.PMovil (1 parámetros, 1 con uso directo en código)

| N° | Tabla | Tipo | Descripción oficial / comportamiento | Dónde se usa (clase.método — archivo:línea) |
|---:|---|---|---|---|
| 1 | VAR_PMOVIL | Fecha (texto) | Fecha de última actualización — canal: PMovil | clsPMovil_Base.Sincroniza_Tablas — RN.Varios.PMovil/clsPMovil_Base.cs:337 |

---

## 7. Implicancias para GoodApps

1. **Reemplazar los números mágicos por claves con nombre y esquema tipado.** Proponemos un registro de parámetros declarativo (clave textual del tipo `facturacion.interes_mora.tipo`, tipo, valor por defecto, módulo, validación, ámbito), versionado en código. Conservar una tabla de equivalencias `COD_VAR → clave` para la migración desde Procoop, porque los valores de cada cooperativa deben importarse.
2. **Definir ámbitos explícitos**: global de la cooperativa, sucursal/punto de venta, usuario y puesto. En Procoop esa jerarquía está implícita y repartida entre `VARIABLE`, `USERS`, `EQUIPOS` y el `.pro`; en GoodApps debe resolverse con una única función de lectura con prioridad documentada.
3. **No reproducir el autoalta silenciosa** de `BuscaVariable`: una clave inexistente debe ser un error de desarrollo, no una fila "Sin Utilizar".
4. **Migrar solo lo usado.** De los 1.536 parámetros, 914 tienen uso comprobable en el escritorio. Los 622 restantes hay que clasificarlos con la cooperativa piloto (portal/app, obsoletos, o usados vía SP) antes de diseñarlos; muchos de los de `VARIABLE_PMOVIL` son textos de personalización del portal y pasan a ser configuración del front.
5. **Multi-tenant real**: GoodApps es SaaS, así que la cooperativa debe ser un `tenant_id` (o esquema/base por tenant con catálogo central), no un archivo local que apunta a un servidor. Los datos de empresa (518–527, 709) pasan a una entidad `Empresa`/`Cooperativa` con sus sucursales, puntos de venta AFIP y depósitos.
6. **Seguridad**: hash moderno de contraseñas (Argon2/bcrypt), sin contraseñas maestras ni contraseñas por defecto fijas, MFA opcional, identidad del usuario propagada hasta la auditoría, secretos en un gestor (no en archivos ni en código) y conexión a la base con identidades de servicio.
7. **Permisos**: mantener el concepto de perfil con permisos por acción (no solo por pantalla), restricción horaria y la "autorización de supervisor en el momento", que los usuarios de cooperativas usan mucho. Agregar ámbito por sucursal.
8. **Auditoría**: capturar valores antes/después de forma sistemática (por ejemplo, tabla de eventos o CDC), incluidos los cambios de parámetros, y no solo la sentencia.
9. **Actualizaciones**: las migraciones de esquema deben ser parte del despliegue (no ejecutarlas el primer usuario que entra), y el catálogo de parámetros debe migrarse con scripts idempotentes como hace `ChequearVariable`, pero desde el pipeline.
10. **Tareas programadas**: el Agente se traduce en un planificador de trabajos del servidor (colas y cron) con monitoreo, en lugar de un ejecutable vigilado por otro proceso.

## 8. Dudas abiertas

1. ¿Qué parámetros de los 622 "sin uso directo" lee realmente CoopOnline/PMovil/PWeb? Hace falta el código o la base de esas aplicaciones (MySQL web) para cerrarlo.
2. ¿Qué procedimientos almacenados de la base leen `VARIABLE`? La capa de datos y los SP no están descompilados ni exportados; puede haber reglas de negocio enteras parametrizadas desde SQL.
3. Las 9 variables no declaradas (74, 79, 383, 473, 2206, 2803, 2996, 3142 y la 1 de `VARIABLE_PMOVIL`): ¿existen con valor en las bases productivas o el código cae siempre al valor vacío? Conviene consultar una base real.
4. ¿Qué cooperativas usan más de una base por instalación (varios `Configuracion*.pro`) y cómo comparten clientes entre ellas, si es que lo hacen?
5. ¿Se usa la restricción horaria de perfiles y el flujo de `AUTORIZACIONES` en producción? Define si se migran como funcionalidad de primera línea.
6. ¿Qué valores reales tiene la variable −1 (envío de errores a terceros) en los clientes? Si está activa, Procoop envía datos de excepciones a una casilla externa; confirmarlo es relevante para privacidad.
7. Comportamiento exacto de `FinalizarChequeos` sobre 21/383/742/144: se ve la migración pero no la intención de negocio.
8. ¿Qué módulo reemplaza a Mesa de Entradas (3 parámetros sin ningún uso en el escritorio)? Posiblemente sea una funcionalidad web.
