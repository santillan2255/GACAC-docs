# 10 — Integraciones externas de Procoop 10

> Relevamiento sobre los fuentes descompilados (`binarios/decompilado/ReglasNegocio`, `Configuracion`, `ProcoopNet`). Las rutas `archivo:línea` son relativas a `binarios/decompilado/`; `RN.` abrevia `ReglasNegocio/ReglasNegocio.`.
> Por pedido expreso, **no se transcriben credenciales**: donde hay claves, contraseñas o tokens en el código solo se indica que existen y dónde (ver §13).
> Las fichas funcionales de cada integración (qué pide la cooperativa) están en [`../integraciones-fichas.md`](../integraciones-fichas.md). AFIP se detalla en [03](03-afip-facturacion-electronica-e-iva.md) y los archivos de entes recaudadores en [05](05-cobranzas-cajas-y-entes-recaudadores.md). Los parámetros citados por número están en el catálogo de [09](09-parametros-y-configuracion.md).

---

## 1. Panorama

| # | Integración | Dirección | Formato / transporte | Clases principales |
|---|---|---|---|---|
| 2 | Correo (SMTP propio, Amazon SES) | Salida | SMTP, API SES | `Mails/Manager`, `clsAmazon` |
| 3 | CoopOnline (portal y app de socios) | Bidireccional | MySQL remoto, REST, Firebase, FTP/S3 | `RN.Titulares/clsWEB`, `Agente.Clases/clsWeb_CoopOnline` |
| 4 | PMovil / Captor (app de campo) | Bidireccional | MySQL remoto | `RN.Varios.PMovil/clsPMovil_*` |
| 5 | SMS y WhatsApp | Salida | REST vía API del proveedor; API de WhatsApp | `clsServicio_Procoop.EnviarSMS`, `clsWhatsApp` |
| 6 | Pasarelas de pago y QR | Bidireccional | REST (en `ProMod_WebService.dll`) | `RN.Cobranzas/EntidadDigital`, `clsPagos360`, `clsSIRO`, etc. |
| 7 | Entes recaudadores y bancos por archivo | Bidireccional | Archivos de texto de ancho fijo / CSV | `Cobranzas.Entidades/Importador_Base`, `Exportador_Base` |
| 7 | Interbanking | Entrada | Web service | `RN.Tesoreria/clsInterbanking` |
| 8 | AFIP | Bidireccional | SOAP (WSAA, WSFEv1, padrón) | ver doc 03 |
| 8 | Reguladores y fiscos provinciales | Salida | Archivos | `clsEnargas`, `clsTarifaSocial`, `Facturacion.Archivos` |
| 9 | Telemedición, prepago e ISP | Bidireccional | REST, TCP, SSH, SQL, archivos | `RN.Varios.Telemed.Telemedicion/*` |
| 10 | Mapas y GIS | Salida / entrada | KML, Google Static Maps, OleDb | `clsMapa`, `RN.Varios.GoogleEarth`, `GIS` |
| 11 | Firma digital | Salida | REST + base central | `clsFirmaDigital` |
| 11 | IA (OpenAI) | Salida | REST | `clsChatGPT`, `frmAsistenteFormulas` |
| 11 | Otros (SITSA, Office, hardware, soporte) | Varios | Varios | ver §11 |
| 12 | Integra (API local) y Agente | Entrada / interna | REST en IIS; servicio de Windows | `clsProcoop_Integra*`, `clsServicio_Procoop` |
| 12 | Infraestructura del proveedor (S3, actualizaciones) | Entrada | HTTPS S3 | `clsVersion`, `clsAmazon` |

Observación general: la mayor parte de las integraciones "modernas" pasan por **servicios del propio proveedor de Procoop** (dominios `procoop.ar` y `cooponlineweb.com.ar`, buckets S3 del proveedor, una cuenta de Amazon SES compartida y una base central). Para GoodApps esto significa que esas integraciones no son reemplazables simplemente apuntando a otro endpoint: hay que reconstruir el servicio intermedio.

---

## 2. Correo electrónico

- **Propósito**: envío de facturas, avisos de mora, circulares, órdenes de compra y pago a proveedores, notificaciones de tickets, errores del sistema y reportes programados.
- **Dirección**: salida. No hay lectura de casillas (IMAP/POP); los "mails internos" de `Inicio_ProCoop` son mensajes entre usuarios guardados en la base.
- **Clases**:
  - `Mails/Manager` (en ReglasNegocio): elige la configuración SMTP. Por defecto usa la del archivo `.pro` (`Smtp`, usuario, clave, SSL, puerto); si el módulo tiene una casilla propia en `CORREOS_INTERNOS` (enum `Modulos_Correo`: compras, pagos a proveedores, notificaciones a titulares, atención, tickets) usa esa (`Manager.cs:98–147`).
  - Si el dominio del remitente es `cooponlineweb.com.ar` (`UsaNewAmazonSES`, `Manager.cs:585`), el constructor reemplaza el cliente SMTP por el de **Amazon SES por SMTP** (región sa-east-1) con una credencial del proveedor (`Manager.cs:133-146`) y los envíos van por `clsAmazon` (SES nuevo). Si el dominio es `cooponline.com.ar` (`UsaAmazonSES`, `Manager.cs:581`), se usa la **API de SES** (región us-west-2) en `Manager.cs:374`, `:440` y `:687`. *(Corregido en la segunda pasada: la versión anterior atribuía el SMTP de sa-east-1 a `UsaAmazonSES`.)*
  - `Manager.EnviarMailsPendientes` (`:473`) despacha la cola de mails pendientes en lotes (variables 404 y 461); `Manager.EnvioMail` registra cada envío en `AUDIT_MAIL` (`:591`). La variable 3160 desactiva la validación del certificado del servidor SMTP.
  - Plantillas: `clsPlantillas` (`CombinarCorrespondencia`, `Obtener_Plantilla`), `RN.Configuraciones.Plantillas/Correspondencia` (fuentes de datos por tipo de envío: titular, cuenta, cobranza, servicio, factura, factura electrónica, órdenes de pago), variables de combinación en `VARIABLEPLANT`. El modo de línea de comandos 2 envía mails desde un XML (`Mails/General.enviar_mails_xml`). Pantalla de envío manual: `Configuracion/Mails/frmEnvioMail`.
- **Formato**: MIME con adjuntos (PDF de factura generados por los reportes).
- **Configuración / credenciales**: SMTP en el `.pro` y en `CORREOS_INTERNOS`; credenciales de SES hardcodeadas (ver §13).

### 2.1 Reglas de envío y cola de correo (segunda pasada)

**Elección del canal de salida** (`Mails/Manager.cs`):

- Constructor por defecto (`:99-147`): si hay casilla de módulo (`CORREOS_INTERNOS`) usa su SMTP, puerto, SSL, usuario y clave; si no, usa la casilla del `.pro` (servidor `MailSmtp` o, si está vacío, el host del mail de la empresa). La validación previa (`ValidarConfiguracion`, `:1019-1027`) falla con "No se dispone de una cuenta de mail configurada" si no hay mail de empresa. El puerto del `.pro` vale 25 por defecto (`Mails/General.cs:202-213`). Con SES por SMTP solo se aceptan los puertos 25, 587 y 2587; cualquier otro se fuerza a 587 (`Manager.cs:137-141`). **[VERIFICAR]** si el mail de empresa de LAG está en un dominio propio o en `cooponlineweb.com.ar` (en ese caso todo el correo sale por la cuenta SES del proveedor).
- `EnviarMailSinRegistrar` (`:346-411`) envía sin dejar auditoría. Orden de prioridad: SES nuevo (`clsAmazon`); si no, la API de SES vieja; si no, SMTP. Antes verifica que existan los adjuntos (`VerificarAdjuntos`, `:993-1017`: "No se encontro el archivo adjunto"). En base DEMO el SMTP no envía ("No se pueden enviar mails en base DEMO").
- `EnviarMailMessage` (`:654-703`): con SES nuevo, los destinatarios `yahoo.com` / `yahoo.com.ar` se mandan por el cliente SMTP y, si falla, se reintenta forzando SES. Es el único reintento automático del módulo.
- `EnvioMail` (`:591-652`) registra cada envío en `AUDIT_MAIL` con el número tomado con bloqueo de la tabla (`GetMaxValue_Boqueo`). Si no consigue el bloqueo devuelve falso **sin enviar ni informar el motivo**. La lista de adjuntos guardada se trunca a 400 caracteres.

**Cola diferida** (`AUDIT_MAIL.PENDIENTE`):

- Alta: `CrearAuditoria` (`:280-317`) arma el registro con `PENDIENTE = 1`, contenido HTML y RTF, remitente, copias, casilla del módulo (`COD_COI`), plantilla (`COD_PLA`) y **solo el nombre** de cada adjunto (no la ruta). `GuardarAuditorias` (`:319-344`) numera el lote con la tabla bloqueada y lo inserta en bloque (todo o nada). `GuardarAuditoria` (`:287-290`) es el caso de un solo mail.
- Despacho: `EnviarMailsPendientes` (`:473-579`), invocado por el Agente (`clsServicio_Procoop.EnviarMails`, `RN.Varios.Generales/clsServicio_Procoop.cs:502-523`). Estados: 1 pendiente → 4 en proceso (marca antes de enviar, para que otro hilo no lo tome) → 2 enviado con `FEC_ENVIO`, o 3 error con el motivo en `OBSERVA`. Si el mail tiene `COD_COI` usa la casilla de ese módulo. Cada N mails (variable 404) espera M segundos (variable 461; mínimo 1 s). Si detecta que otro hilo ya tomó un mail, cancela todo el lote.
- Como solo se guarda el nombre del adjunto, al despachar se lo busca en este orden: la ruta tal cual, la carpeta temporal del servidor, `WEB_Path\Subidos` y `WEB_Path` (`CreateMailMessage`, `:818-886`). Si no está en ninguna, el mail pasa a error ("No se encontró el archivo adjunto").
- **Posible bug**: el Agente guarda en su bandera `EnviandoMails` el valor que devuelve `EnviarMailsPendientes`, y ese valor solo es verdadero cuando se detectó otro hilo. En ese caso la bandera queda en verdadero y el Agente no vuelve a despachar la cola hasta que se reinicia (`clsServicio_Procoop.cs:507-514`). **[VERIFICAR]** con los logs del Agente si la cola de LAG se traba.
- Plantillas HTML: `CreateMailMessage` (`:705-765`) toma el archivo de `MailTemplates` junto al ejecutable y reemplaza los marcadores; si no existe: "El mail no existe en la ruta especificada". La variante de `.NET Core` (`:767-816`) embebe como recurso vinculado cada `.png` de la carpeta cuyo nombre aparezca como `id` en el HTML.

**Envío desde XML** (modo de línea de comandos 2; `Mails/General.cs`):

- `enviar_mails` (`:265-350`) recorre las filas del XML (`VFPData/facturas_ele_xml`, cargado por `enviar_mails_xml` `:224-263`) y envía cada una con `EnviarMailSinRegistrar`. **Ignora** el host, usuario y clave que trae el XML y usa la configuración del `.pro`. Si no usa SES, respeta 16 segundos entre envíos. Ante `ServiceNotAvailable` reintenta una vez. Graba en el mismo XML el resultado por fila: `id_error` 0 (enviado), 111 (falló el envío), 112 (excepción) o el código SMTP.
- `enviar_mails_old` (`:352-409`) es la versión anterior: SMTP directo con las credenciales del XML; en DEMO devuelve `id_error = 50`. `enviar_mail` (`:411-445`) envía un único mail por SMTP sin SSL.
- El XML trae la clave de la casilla en texto plano (`pass_mail`), aunque la versión vigente no la use.

Métodos sin regla de negocio: `General.GetCorreosModulos`, `Manager.ConvertMailMessageToMemoryStream`, `Manager.Get_CorreoInterno`, `RichEditMailMessageExporter.Export`, `CreateCssUri`, `CreateImageUri` (el exportador convierte el contenido del editor a HTML y embebe las imágenes como `cid:`).

---

## 3. CoopOnline (portal web y app de socios)

- **Propósito**: autogestión del socio — ver cuentas y facturas, descargar PDF, pagar en línea, consumos, trámites, reclamos, adhesión a factura digital.
- **Dirección**: bidireccional.
  - **Salida (Procoop → web)**: `RN.Titulares/clsWEB` sincroniza titulares, cuentas, órdenes, facturas, PDF, pagos, consumos y parámetros hacia una **base MySQL alojada por el proveedor** (`Conexion_MySql`). Credenciales y servidor en las variables 808–811; activación y opciones en 801, 802, 805, 2261, 2396, 2397, 2448, 2460, 2689, 2817 y en `VARIABLE_PMOVIL` (canal CoopOnline: textos del portal, CIDI, etc.). Los PDF se publican por FTP o S3 (`clsServicio_Procoop.TransferirFTP`, `RN.Varios.Generales/clsServicio_Procoop.cs:1297`; datos `WEB_*` del `.pro`).
  - `clsWEB.EnviarPagosEntidad` (`clsWEB.cs:368`) hace un POST REST a la API de CoopOnline (`RegistrarCobranzasEntidad/{codSum}/{clave}`), con una clave de ruta derivada de la fecha y un encabezado APIKEY fijo.
  - **Entrada (web → Procoop)**: `Agente.Clases/clsWeb_CoopOnline` escucha **en tiempo real una base Firebase** (librería FireSharp) donde el portal deja ventas y cobranzas web; el Agente las registra en Procoop, autoriza pagos o cargas prepagas y elige el conector de pago correspondiente (SiPago, Helipagos, ProvinciaNet; `clsWeb_CoopOnline.cs:2095–2109`). Las credenciales de Firebase están hardcodeadas (`:408–409`).
  - Trámites y declaraciones juradas de artefactos: `RN.Varios.CoopOnline/clsTramitesWEB`.
  - Ingreso directo al portal desde el escritorio: `Nucleo.cs:1116` arma una URL con una clave generada por `GetEncryptedKey`.
- **Formato**: filas MySQL, JSON (REST y Firebase), PDF.
- **Notas**: la "app" PWeb (canal 3 de `VARIABLE_PMOVIL`) es otra variante del portal.

### 3.1 Identificación de la cooperativa y canales de entrada (segunda pasada)

- La cooperativa se identifica ante los servicios del proveedor por su **número de cliente del proveedor** (`clsClientesProcoop.GetCliente(CUIT 519, razón social 518).Cod_Sum`). Con ese número se arman los nodos de Firebase `Venta_{n}` (prepagas) y `Cobranza_{n}` (pagos de facturas) y las rutas REST. En los trámites, si el CUIT es el genérico `99-99999999-9` se usa el cliente 999 (`RN.Varios.CoopOnline/clsTramitesWEB.cs:322-323`).
- El portal deja cada operación por dos caminos que terminan en el mismo código: **Firebase**, que escucha el Agente (`IniciarEscuchaPrepaga` `Agente.Clases/clsWeb_CoopOnline.cs:940`, `IniciarEscuchaCobranza` `:967`; requieren el parámetro 11 de `VARIABLE_PMOVIL`, "registra pagos CoopOnline"), o una **llamada directa a Integra**, que entrega el objeto ya deserializado.
- `CheckearVenta` (`:994`) y `CheckearCobranza` (`:1390`): si la operación llega desde Integra, la procesan y devuelven el resultado en JSON. Si llega desde Firebase, solo la procesan cuando el evento trae datos reales (contenido de más de 100 caracteres y ruta de menos de 50) y vuelven a escribir el nodo con el resultado. Cualquier otro evento (por ejemplo, el borrado del nodo) se ignora.
- `ReiniciaEscuchas` (`:895-938`) es el manejador de un temporizador del Agente: libera las escuchas y el cliente de Firebase y vuelve a suscribirse. El intervalo se fija en el ejecutable del Agente, que no está en los fuentes relevados.

### 3.2 Datos que publica Procoop hacia el portal

| Dato | Método | Regla |
|---|---|---|
| Detalle de servicios de una cuenta | `GetDetalleServicios` (`:687-719`) | Por cada `SERSOC`: servicio, categoría, medidor, domicilio, alta y baja, y estado según `CONDICION` (1 a 4), con la lista de adherentes. |
| Validación de un adherente nuevo | `GetInfoAdherente` (`:721-772`) | El servicio debe ser de un tipo de registro que admita adherentes (`TIP_REG` 6, 7 u 8). La persona debe existir. Si el parámetro 2400 está apagado, la persona no puede ser adherente del mismo servicio en otra cuenta. **[VERIFICAR]** el valor de 2400 en LAG. |
| Enlace "Mi Medidor" | `GetURLMiMedidorDiscar` (`:774-804`) | Pide a Discar la información del suministro y devuelve su `UrlMiMedidor`; vacío si el servicio no está en Discar. |
| Estado de prepagas y cobranzas web | `GetLinksPrepaga` (`:655-684`) | Devuelve las solicitudes `PAGOS360` de tipo 7 (prepaga), 9 (cobranza CoopOnline) y 11 (resumen de tarjeta FECESCOR), o las ya pagadas y procesadas. Con "solo pendientes" excluye las rechazadas (`ESTADO` 6) y las ya enviadas (`ESTADO_VENTA` 3) y amplía la ventana 10 días hacia atrás. Reutiliza la conexión y la renueva cada 20 consultas. |
| Cuenta de una solicitud | `Get_Cuenta` (`:223-270`) | Lee la `METADATA` de `PAGOS360_EXTRAS`. En una prepaga, toma la cuenta del `SERSOC` vendido. En una cobranza, decodifica la lista de comprobantes (código de comprobante + sucursal de 4 dígitos + número de 8) y devuelve la cuenta de la **última** factura de la lista. |

`ESTADO_VENTA` (avance que ve el socio): 0 generado, 1 pagado, 2 registrado, 3 enviado (comprobante mandado por mail). `ActualizaEstado` (`:1937-1969`) **solo deja avanzar** este estado, agrega como ítems las facturas nuevas generadas por la registración y asigna la planilla de caja (`ID_PLA`).

### 3.3 Operaciones que acepta el portal y sus validaciones

**Requisitos previos** (`ValidarConfiguracion`, `:806-859`; `ValidarCaja`, `:861-892`):

- Debe estar habilitada la prepaga CoopOnline en la configuración o el parámetro 11 de `VARIABLE_PMOVIL`.
- Salvo que el parámetro 2645 valga 1 ("solo pago offline"), el usuario CoopOnline (parámetro 2489) debe existir y tener caja. La caja puede venir de `BANCOS.NUM_CAJ` de la entidad por defecto. Si la caja del día está cerrada la operación falla. Si no existe, el Agente **la abre solo** con la observación "Apertura automatica Cooponline". Con 2645 = 1 no se abre caja. **[VERIFICAR]** los valores de 2489, 2645 y 2774 en LAG.

**Venta de prepaga** (`crearVenta`, `:1051-1179`):

- La solicitud debe estar en estado 0 y su identificador (marca de tiempo) debe tener menos de 600 segundos. Si no, se descarta.
- El servicio debe tener una categoría marcada como prepaga (`CATE_SER.PREPAGA`) y un sistema de telemedición (`SIS_TEL`). Se rechaza si la cuenta tiene `NOF_SUM` o `BLOQUEAR_FAC_WEB`.
- El importe se valida contra el mínimo de venta (`clsPrepaga.ValidarImporteMinimoVenta`). El capital a acreditar es importe − recargo + bonificación (0 si el importe no cubre el recargo), y se informa la energía equivalente (`CalculaConsumo_Autogestion`). Si hay retención por deuda o bonificación, se devuelve el texto correspondiente al socio.
- La pasarela sale del canal elegido (`CANALES_PAGOS.COD_CAN`) y la solicitud se genera con tipo 7 (`GenerarSolicitud`, `:1971`; elección de pasarela en [doc 11 §2.4](13-pasarelas-de-pago-e-interbanking.md#24-elección-de-la-pasarela)). Para Macro se agregan los `DatosMacro`. Al final la venta queda en estado 2 y se borran de Firebase los nodos con más de 5 minutos. **[VERIFICAR]** si LAG vende energía prepaga (categorías con `PREPAGA` y telemedición).

**Pago de facturas** (`crearCobranza`, `:1181-1322`):

- Se recalcula la deuda (`GetInfoCobranza`). El total a pagar no puede ser 0 y se redondea. La cuenta no puede tener `BLOQUEAR_FAC_WEB`.
- Con el parámetro 13 de `VARIABLE_PMOVIL` ("todas las facturas del talón"), si el importe pedido difiere del recalculado, se rehace la lista de facturas.
- El total debe ser **mayor o igual** al valor numérico del parámetro 904. El catálogo lo describe como "Acepta pago online" (tipo mixto), pero acá funciona como importe mínimo. **[VERIFICAR]** su valor en LAG.
- Ninguna factura puede estar bloqueada (`Id_blo > 0`). El vencimiento del talón es hoy + parámetro 2585 si ese valor es mayor que 1. **[VERIFICAR]** 2585.
- La metadata guarda "comprobante & recargo & saldo" por factura. Con el parámetro 12 de `VARIABLE_PMOVIL` (diferir intereses), el recargo va en 0 y se paga el total. **[VERIFICAR]** los parámetros 12, 13 y 21 de `VARIABLE_PMOVIL`.
- Con el parámetro 21 de `VARIABLE_PMOVIL` y sin entidad por defecto, no se crea un link: `SubirPDFPagoEfectivo` (`:1434-1543`) genera el talón en PDF (lanzando `ProcoopNet.exe` en modo 12 o con el evento de exportación) y lo sube al S3 del proveedor para que el socio pague en efectivo.
- Se borran los nodos de Firebase con más de 2 minutos.

**Resumen de tarjeta de terceros** (`CrearCobranzaResumenTarjeta`, `:1324-1370`): usa la entidad de terceros del parámetro 3114 (FECESCOR), concepto "Pago {tercero} - documento" y tipo 11. **[VERIFICAR]** si LAG cobra resúmenes de terceros.

### 3.4 Autorización y registración del pago

Hay tres disparadores. La lista de pendientes se procesa con `AutorizarPendientes(ref lista)` (`:605-628`), que excluye las solicitudes ya imputadas (`ESTADO` 3) y espera al menos 1 segundo entre ítems.

1. **Ciclo del Agente** (`AutorizarPendientes`, `:460-497`). Solo corre con el parámetro 2496 ("autorizar prepaga automáticamente") y en un hilo aparte. Revisa los últimos 40 minutos. En los primeros 5 minutos de las 4, 11, 16 y 23 horas revisa desde el día anterior. Antes valida la configuración y la caja. **[VERIFICAR]** 2496 en LAG. Bug menor: la propiedad `RegistrarFacturasAuto` lee 2496 pero escribe 726 (autorizar facturas ARCA automáticamente) (`:426-440`).
2. **Webhook vía Integra** (`AutorizarPendientesINTEGRA` `:553`, que llama a `AutorizarPagos_Async` `:573` y este a `AutorizarPagos` `:578-603`). Lo invoca el endpoint de Integra que recibe el aviso de la pasarela (`RN.Varios.Generales/clsProcoop_Integra.cs:6503`). Las solicitudes de tipo 7 van a `AutorizarPrepaga` y las de tipo 9 u 11 a `AutorizarCobranza`. Si el parámetro 2789 está activo, también procesa facturas y talones (tipos 1 y 2) pagados con código de barras o QR: `Get_SolicitudOriginal` (`:630-653`) traduce la `external_reference` de Pagos360 al `COD_PAG` original y le asigna el `ID_360`. **[VERIFICAR]** 2789. Posible referencia nula en `:599` cuando la solicitud original no existe.
3. **Rendición del Agente** (`clsServicio_Procoop.cs:901-1017`): después de importar pagos por API o archivo, autoriza las solicitudes de tipo 7, 9 u 11 que tengan `ESTADO` menor que 3. Los errores se mandan por mail a la casilla del parámetro 3025.

**Prepaga** (`AutorizarPrepaga`, `:1545-1657`):

- Consulta el pago en la pasarela (`ConsultarPago`, `:2032`). Si el cliente usa Integra técnica y la consulta no viene de Integra, se aplica un antirrebote de 10 segundos (`FEC_CONSULTA`).
- Con el pago confirmado marca la venta como pagada. Si la consulta viene de Integra y el parámetro 2752 está activo, no registra: solo la marca y la registra el Agente. **[VERIFICAR]** 2752.
- `RegistrarVenta` (`:2115-2168`): exige caja abierta, genera la factura de autogestión, exige que su total coincida con lo cobrado, valida el comprobante, agrega recargo o bonificación y registra el pago (`clsRegistracionCobranza.RegistrarPago` con el parámetro 2452).
- `ActualizarEstadoPago` (`:1659-1677`) reintenta hasta 6 veces dejar la solicitud en `ESTADO` 3 y la venta en "registrado".
- Por último arma el PDF de la factura y lo manda con la plantilla `FacturaCooponline.html` (con copia al parámetro 2499). La venta pasa a "enviado" y se informa la factura al portal (`clsWEB.RegistrarFactura`). **[VERIFICAR]** 2499.

**Cobranza** (`AutorizarCobranza`, `:1679-1862`):

- Si no hay metadata, la cobranza se rearma desde los ítems. El tipo 11 se registra como factura de terceros (`GenerarFacturaTerceros`, `:1864-1885`, con `clsTerceros.CargarCobranza`).
- Exige `PAGOS360_PAGOS`, salvo en el modo "sin entidad" de Integra (`clsProcoop_Integra.cs:8206`).
- La suma pagada debe ser igual al total recalculado hoy, o a `IMPORTE1` en el modo "sin entidad". Si no, devuelve "Los importes de la cobranza no coinciden" ([doc 11 §2.3](13-pasarelas-de-pago-e-interbanking.md#23-cómo-se-entera-procoop-de-un-pago-webhook-polling-o-archivo)).
- `RegistrarCobranza` (`:2170-2187`) deja la solicitud en `ESTADO` 3 y la venta en "registrado" con las facturas generadas y la planilla, e informa al portal (`clsWEB.RegistrarPagosFacturasWeb`).
- Después se envía el recibo en PDF con las facturas de intereses generadas (`GetFacturasIntereses` / `AdjuntarFacturaIntereses`) usando la plantilla `ReciboCooponline.html`, y la venta pasa a "enviado".
- Con `ESTADO` 6 se devuelve "El pago fue rechazado por la entidad".

**Medio de pago e impuestos**:

- `GetMedioPago` (`:2236-2297`): sin identificador de pago externo registra **efectivo**. Con identificador registra **transferencia** en la moneda del parámetro 186 y la cuenta bancaria `BANCOS.COD_BANT` de la entidad (1 por defecto).
- `ValidarImpuestos` (`:2386`) calcula la percepción de IVA e IIBB sobre los recargos con el mínimo imponible 758, la agrupación 1056 y la discriminación 2826 (reglas de doc 05).

Métodos sin regla de negocio: `Get_DatosCobranza` (`:499-551`, arma el texto de resumen con cuenta, titular, facturas y link a partir de la metadata).

### 3.5 Trámites web y declaración jurada de artefactos (`RN.Varios.CoopOnline/clsTramitesWEB.cs`)

Los trámites se definen en Procoop (`REQUISITOS` + `REQUISITOS_ITEMS`) y el socio los completa en el portal. Las respuestas quedan en la API de CoopOnline, de donde Procoop las lee. Tipos de trámite: PDF, trámite web y DDJJ de artefactos. Dato requerido: socio, cuenta o servicio. Estados (`Requisitos_Usuarios.Tipo_Estado_Req`): cargado, aceptado, rechazado y cancelado.

- **Lectura**: `GetValoresTramite` (`:316-347`) trae los valores cargados por el socio (`api/Tramites/{cliente}/Valores/…`). `ConsultarTramites` (`:576-608`) filtra por estado, fechas, usuario, trámite y dato requerido. `ConsultarTramite_Usuario_PorId` (`:610-618`) busca un trámite del último año.
- **Conversión de valores** (`ValidarValor`, privado, `:425-574`), según `TIPO_DATO`:
  - 0 texto; 1 número (entero o decimal con cultura invariante); 2 fecha.
  - 3 combo: la máscara trae "descripciones | códigos" y se devuelve la descripción del código elegido.
  - 4 consulta genérica: la máscara indica tabla, columna de código, columna de descripción y filtro, y se arma un `SELECT` con esos datos; la primera opción es "NO REGISTRAR".
  - 7 archivo (bytes); 9 adherentes (JSON con tipo de documento y vínculo resueltos).
  - Un tipo desconocido descarta el campo.
- **Armado del formulario para el operador**: `ConsultarValoresTramite` (`:70-149`) agrupa los campos en "Datos del Formulario" (lo que cargó el socio) y "Datos que registra el Usuario" (campos con `REGISTRA_USER`, que completa el operador). Agrega el dato requerido (socio, cuenta o servicio según `DATO_REQUIERE` 1, 2 o 3) y ordena por `ORDEN`. Los archivos se nombran "{id}_{campo}.pdf/.png" según la máscara. `ConsultarValoresDDJJ` (`:151-314`) abre cada fila de la DDJJ: código, cantidad, marca, modelo, serie, año de compra, protección y observación. Para el artefacto "Otros" (`ARTEFACTO.ES_OBSERVA`) muestra solo la descripción libre.
- **Validación de identidad** (`ValidarNroDocumento`, `:350-423`): si el requisito tiene `COMPARAR_DOCUMENTO`, consulta el usuario del portal y compara el DNI o CUIL registrado en CiDi con el DNI del titular del socio, de la cuenta o del servicio. Si no coincide: "El número de documento del socio … no coincide con lo registrado en CiDi".
- **Ejecución** (`EjecutarTramite`, `:671-735`):
  - Se ejecuta un **procedimiento almacenado cuyo nombre es la descripción del requisito** (con espacios y "/" cambiados por "_"). Recibe como parámetros los valores, salvo los marcados `NOENVIAR_PROC`. En los archivos se pasa el nombre del archivo.
  - El procedimiento devuelve mensaje, resultado y, opcionalmente, el `ID_SERSOC` creado. Si no devuelve filas: "Error al ejecutar el procedimiento...".
  - Si el resultado es verdadero, el trámite pasa a aceptado con fecha de proceso (`ActualizarTramite`, `:620-669`, que hace un PUT a la API), los archivos se guardan en la carpeta de adjuntos y los adherentes se dan de alta.
  - **[VERIFICAR]** qué procedimientos de trámite existen en la base de LAG: la lógica real de cada trámite está en ellos, no en el código.
- **Alta de adherentes** (`GuardarAdherentes`, `:737-833`), en una transacción:
  - Crea un `ADHSOC` por adherente con el vínculo y la fecha de alta de hoy.
  - Si la persona es nueva y no existe por DNI, la crea con el domicilio del titular. Si no es nueva y no existe: "Error al obtener la persona del adherente cargado".
  - Las fotos del documento (frente y dorso) se guardan como adjuntos del servicio.
  - Cualquier fallo revierte todo.
- **DDJJ de artefactos**: `CrearDDJJ_Artefactos` (`:835-1050`) genera el formulario a partir del maestro `ARTEFACTO`:
  - Primero limpia comillas de las descripciones con un `UPDATE` masivo.
  - Por cada artefacto crea campos de cantidad, marca, modelo, serie y observación, con el HTML de cada control en `QUERY`. Para "Otros" crea un área de texto y una aclaración.
  - `ActualizarTramiteDDJJ_Artefactos` (`:1052-1063`) borra los ítems y los regenera.
- **Registro de la DDJJ** (`RegistrarArtefacto`, `:1066-1178`):
  - Solo para servicios de energía (`COD_SER = 1`); si no: "El servicio seleccionado no es un servicio de energía".
  - Pasa los artefactos vigentes del servicio a `HIS_ARTEFSUMS` y los borra.
  - Inserta los nuevos en `ARTEFSUMS` con estado 1. Conserva la fecha de registro original y omite las filas con cantidad 0 sin observación.
  - Si falla la actualización del trámite en la API, revierte todo.

### 3.6 Notificaciones al portal

`clsNoti_Coop.GuardarNoti` (`RN.Varios.CoopOnline/clsNoti_Coop.cs:10-40`) inserta en `NOTI_COOP` una notificación por cuenta con estado no leído, vigencia de un mes desde hoy, asunto, detalle y usuario. Informa el resultado en singular o plural.

---

## 4. PMovil / Captor (app de campo)

- **Propósito**: toma de lecturas en campo, órdenes de trabajo técnicas, presupuestos y ventas móviles, SMS, y lectura de telemedidores.
- **Dirección**: bidireccional mediante sincronización por tablas.
- **Clases**: `RN.Varios.PMovil/clsPMovil_Base` (`Sincroniza_Tablas`, `GetVersionCode`) sobre una **base MySQL remota** (`Conexion_PCaptor`), donde cada cooperativa se identifica por CUIT en la tabla `CUENTAS`; especializaciones `clsPMovil_Tecnica` (órdenes), `clsPMovil_Venta`, `clsPMovil_Sms` y `clsPMovil_Telemed` (lecturas). La variable 1 de `VARIABLE_PMOVIL` guarda la fecha de la última sincronización.
- El Integra expone además endpoints técnicos para la app; `clsProcoop_Integra_Tecnica.cs:2475` tiene una API_KEY hardcodeada.
- **Configuración**: no se ve la cadena de conexión de `Conexion_PCaptor` (está en `CapaDatos`, no descompilada).

---

## 5. SMS y WhatsApp

- **SMS**: `clsServicio_Procoop.EnviarSMS` (`RN.Varios.Generales/clsServicio_Procoop.cs:525`) envía en lotes de 50 por POST a la API del proveedor (`api/Coops/SendSMS/{codSum}`; base URL en la variable 2696 o la del proveedor por defecto) con un encabezado APIKEY fijo. Mensajes en `RN.Telefonia/clsMensaje`; pantalla `ProMod_SMS/frmEnviar_SMS`; variable 2693. El costo y el agregador SMS real están detrás de la API del proveedor (no visibles).
- **WhatsApp**: `clsWhatsApp` con token (2870), host (2873), canal (2874), demoras entre mensajes (2872) y uso de la API oficial (3105). `RegistrarWSP_WS` deriva el envío a la API del proveedor (`api/Coops/SendWSP`). Plantillas en `PLANTILLA_WSP`. `frmEnvioWhatsApp` también permite abrir `api.whatsapp.com` para envío manual. El número de destino se elige con la variable 2824 y las reglas 3051/3121 (agrupar facturas por socio, usar el móvil de la cuenta).
- **Formato**: JSON.

---

## 6. Pasarelas de pago, botones y QR

- **Propósito**: cobro en línea de facturas (botón de pago, link, QR, débito), y conciliación automática de los pagos.
- **Dirección**: salida (alta de deuda / intención de pago) y entrada (notificaciones, consultas de estado, rendiciones).
- **Clases**: el enum `EntidadDigital.API` (`RN.Cobranzas/EntidadDigital.cs`) enumera Pagos360, SIRO, MercadoPago, OffLine, NaranjaX, Macro, PayFun, Pagotic, SiPago, ProntoPago, ProvinciaNet y HeliPagos. Para cada una hay una clase de negocio: `clsPagos360`, `clsSIRO`, `clsMercadoPago`, `clsMacro`, `clsNaranjaX`, `clsPayFun`, `clsProntoPago`, PagoTic. `EntidadDigital.Get_Entidad_Qr` (`:798`) y `Get_Entidad_Qr_ATM` (`:823`) eligen el ente para QR (variables 2803 y 3142).
- **Transporte**: los clientes HTTP reales están en `ProMod_WebService.dll` (espacios `WebService.Pagos360`, `.SIRO`, `.MercadoPagos`, `.Macro`, `.NaranjaX`, `.PayFun`, `.Pagostic`, `.SiPago`, `.Pronto_Pago`, `.ProvinciaNet`, `.Helipagos`, `.Interbanking`, `.BancoSangre`). Endpoints, autenticación, flujos y el uso de `PlusPagosSecurityKitNetFramework` (cifrado AES del botón Macro) se documentan en [13 — Pasarelas de pago e Interbanking](13-pasarelas-de-pago-e-interbanking.md).
- **Configuración por pasarela** (variables): Pagos360 901–914, 2389, 2390, 2677, 2720, 2726, 2727, 2743, 2759–2773, 2920–2922, 2981, 2999–3002, 3059, 3073 (además modos de línea de comandos 9 y 10); SIRO 2492–2495, 2500, 2775, 2776, 2798–2805, 2807, 2939, 3179; NaranjaX 2762; PayFun 2795–2796; ProntoPago 2969–2971; PagoTic 2877–2879. Las credenciales de las pasarelas se guardan en estas variables (texto plano en la base).
- Los pagos del portal CoopOnline entran por Firebase (§3) y se acreditan con el conector que corresponda.

### 6.1 Operaciones invocadas y mapeo del resultado a la cobranza (segunda pasada)

El detalle de endpoints, autenticación y hallazgos de seguridad está en [doc 13](13-pasarelas-de-pago-e-interbanking.md). Esta tabla agrega, para cada clase de servicio de `ProMod_WebService` (`PMW/` = `ProMod_WebService/WebService.`), **quién invoca cada operación y cómo su resultado se convierte en cobro** en `PAGOS360` / `PAGOS360_PAGOS`. El ciclo común es: crear la solicitud (`ESTADO` 0), registrarla en la pasarela (1), confirmar el pago (2) e imputarlo en caja (3).

| Pasarela | Operaciones (`Functions`) | Flujo | Condición de "pagado" y mapeo |
|---|---|---|---|
| Pagos360 | `Send_PaymentRequest` `:41`, `Get_PaymentRequest` `:46`, `Get_Cobranzas` `:51`, `Send_QrRequest` `:56`, `Create_Static_Qr` `:61`, `Get_Status_Static_Qr` `:66`, `Update_Static_Qr` `:71`, `Get_PaymentStaticQr` `:76`, `Send_QrRequestCaja` `:81`, `Get_QrCaja` `:86`, `Get_account_id` `:91`, adhesión y débito con tarjeta `:96-121`, adhesión y débito por CBU `:126-151`, `Get_Chargeback` `:156` | Se crea la solicitud en `Registrar_Solicitudes` (`RN.Cobranzas/clsPagos360.cs:2287`) y se confirma por webhook (`Obtener_Pago` `:742`), por el reporte diario (`Importar_PagosAPI` `:2819`) o por el timer de caja. Débitos: `Registrar_DebitoTarjeta` / `Registrar_DebitoCbu` (`:1867` / `:1915`), estados en `Actualizar_EstadosDebitos` (`:1396`, `:1424`). Cuenta de la caja: `Get_Id_Cuenta` (`:2277`). | Exige `state = paid`. Por cada resultado no rechazado crea un pago con `ID_360`, importe (negativo si es contracargo), comisión neta, IVA de la comisión y neto, `FECHA_PAG` = `paid_at` (o `created_at`), `FECHA_REN` = `available_at` y canal. `ESTADO` 0/1 → 2. QR estático: misma fecha e `IMPORTE1` igual a lo pagado (`:910`). |
| SIRO | `Send_PaymentRequest` `:21`, `Get_Payment` `:26`, `Get_PaymentV2` `:31`, `Send_Base` `:36`, `Get_BaseInfo` `:41`, `Get_Pagos` `:46`, `GetStaticQr` `:51`, `CreateStaticQrRequest` `:56` | Botón: `Registrar_Solicitudes` (`RN.Cobranzas/clsSIRO.cs:1459`), que guarda el `Hash` en `ID_ENTIDAD` y el link. Confirmación: `Obtener_Pago` (`:1201`) usa `Get_PaymentV2` si hay segundo identificador de entidad y si no `Get_Payment`. Base de deuda: `InformarBase` / `Consultar_Base` (`:482` / `:512`). Rendición: `Importar_PagosAPI` (`:420`). | Devuelve "pagado" si la solicitud ya está en `ESTADO` 3, o en 2 con pagos. Con `PagoExitoso` e `IMPORTE1` igual crea el pago con `ID_SIRO` = `IdOperacion` y fecha de operación. En la rendición empareja por `ID_SIRO` + `IMPORTE1`; si no encuentra solicitud, la crea (`Importar_Pagos_Inexistentes` `:1427`). El error "Parametro no válido: bin" no se considera rechazo. |
| Macro | `Get_Sesion` `:15`, `Get_PaymentRequest` `:20` | No hay alta en la API: el portal envía el formulario con los datos cifrados. `Obtener_Pago` (`RN.Cobranzas/clsMacro.cs:138`) **pide sesión en cada consulta**. | Estado `REALIZADA`, `montoBruto / 100` igual a `IMPORTE1` o `IMPORTE2` y fecha de pago igual o posterior a `FEC_REG`. `EstaConfigurado` siempre devuelve verdadero. Posible bug: `Save_Config` persiste la configuración anterior. |
| NaranjaX | `Send_PaymentRequest` `:17`, `Get_PaymentRequest` `:22` | Solo QR de caja: `RegistrarPagosNaranjaX` (`RN.Cobranzas/clsNaranjaX.cs:79`) guarda `QR_ID` = `qr_data` y el id de la solicitud en `URL_SUCCESS`. La consulta **no renueva el token** (usa el que está en memoria). | Con `APPROVED` → `ESTADO` 2 y crea el pago. "Payment not found" se trata como "todavía no pagó". |
| PayFun | `Send_PaymentRequest` `:11`, `Get_PaymentStatus` `:17` | `Generar_Solicitud` (`RN.Cobranzas/clsPayFun.cs:298`): Pago Fácil solo si `IMPORTE1` alcanza el mínimo 2822; con 2820 se informa la deuda total. | `CAPTURED` o `AUTHORISED` → pago **sin comparar el importe** con la solicitud. **[VERIFICAR]** 2816, 2820 y 2822 si LAG usara PayFun. |
| Pagos TIC | `Registrar_Solicitud` `:64`, `Get_EstadoPago` `:70` | `Crear_solicitud` (`RN.Cobranzas/clsPagostic.cs:286`): notificación con `TipCobrador=PagoTic`, vencimientos con zona horaria −03 y pagador con DNI o CUIT según la persona de la factura. | `approved` → pago con fecha de pago y de acreditación, **sin comparar el importe**. El doc 11 §9 dice que el token se reutiliza 5 minutos, pero la hora del token nunca se asigna (`PMW/Pagostic/Functions.cs:21-50`), así que **se hace login en cada llamada**. |
| SiPago | `Send_PaymentRequest` `:16`, `Get_PaymentStatus` `:21` | `Registrar_Solicitudes` (`RN.Cobranzas/clsSiPago.cs:52`): un solo ítem cuyo nombre es la lista de comprobantes "cód-suc-núm". Guarda el `uuid` y el link. | `PENDING` → "no registra pagos"; cualquier estado que no sea `SUCCESS` es error. Con `SUCCESS` pasa a `ESTADO` 2, pero **solo crea el pago si el importe es igual a `IMPORTE1`**: si difiere, la solicitud queda pagada sin pago y no se imputa (`:231-300`, posible bug). Si `COD_PAG` = 0 crea una solicitud de tipo 6. |
| Helipagos | `CreatePayment` `:10`, `GetPayment` `:15` | `Registrar_Solicitudes` (`RN.Cobranzas/clsHelipagos.cs:323`): recargo = `IMPORTE2` − `IMPORTE1` en centavos; guarda `id_sp`, código de barras, link y QR. `Crear_PAGOS360` masivo (`:194`) para talones/cuotas (tipos 2/3) y facturas (tipo 1). Usa `IMPORTE2` solo si el segundo total supera al primero y coincide con el tercero. | `PROCESADA` o `ACREDITADA` con importe igual a `IMPORTE1` o `IMPORTE2` (si no, error). `FECHA_REN` = fecha de acreditación o de pago. `EstaConfigurado` no está implementado. |
| ProntoPago | `Send_Qrs` `:16` | `Crear_PAGOS360` (`RN.Cobranzas/clsProntoPago.cs:54`), `Validar_Insert` (`:158`: descarta duplicados del lote y facturas ya informadas con débito automático), `InformarQrs` (`:220`), `RegistrarQrs` (`:267`: guarda `QR_ID` por código de cliente). | El pago entra solo por el archivo de rendición (importadores ProntoPago / ProntoPago_QR, doc 05). |
| ProvinciaNet | `Healthcheck` `:12`, `InformarLote` `:17`, `ConsultarLote` `:22`, `Get_QrString` `:27`, `Get_QrsLote` `:32` | `GenerarLoteQr` (`RN.Cobranzas/clsProvinciaNet.cs:257`): `amount_2` / `date_2` solo si `IMPORTE2` > `IMPORTE1`, y las fechas se extienden los días del parámetro 3199. `GenerarQr360` (`:150`) reintenta la obtención por lote. La clase de ente `E_ProvinciaNet_QR` usa `Healthcheck` para comprobar la conexión. | `Obtener_Pago` (`:95`) valida el `pagado` recibido contra `IMPORTE1` o `IMPORTE2` y usa la fecha actual (ver doc 11 §12). **[VERIFICAR]** 3199. |
| Interbanking | `Get_AccountRequest` `:20`, `Get_BalanceRequest` `:25`, `Get_MovimientosRequest` `:30` | `RN.Tesoreria/clsInterbanking.cs:132`, `:172` y `:245` (doc 11 §16). `Login` no actualiza el vencimiento: lo persiste `clsInterbanking` como `EXP_TOKEN` = ahora + 7200 s. | No genera cobranza: alimenta `MOV_INTERBANKING` para la conciliación. |
| BancoSangre | `Get_ResumenTarjeta` `:9` | `clsTerceros.GetResumen` (`RN.Cobranzas/clsTerceros.cs:206`; error si no hay resultados) y `GetDatosPagosResumen` (`:248`, `FACTURAS_TERCEROS` del mes). | Se cobra como factura de terceros de tipo 11 (§3.4). |
| MercadoPago | `Send_PaymentRequest` `:36`, `Get_Payment` `:81` (por rango) y `:125` (por referencia) | Doc 11 §5 (SDK; no se detalla). | Doc 11 §5. |

Patrón común de errores en las clases `Service`: si la respuesta es vacía ("[]") se devuelve "No se encontraron resultados", y un error 500 se traduce en un mensaje genérico de reintento. ProvinciaNet además interpreta el detalle del error como texto, lista u objeto con errores.

Métodos sin regla de negocio: `CoreUtils.GetCarpetaSistema`, `GetPathServer_Temporal`, `GetCarpeta` (`PMW/Util/CoreUtils.cs:10-24`; crean la carpeta `Temporales`).

---

## 7. Entes recaudadores, débitos y bancos

- **Archivos**: `RN.Cobranzas.Entidades/Importador_Base` declara **295 importadores** y `Exportador_Base` **209 exportadores** (atributos `[Importer]`/`[Exporter]`), con 88 siglas distintas. Cubren Red Link, Banelco/PMC, Rapipago, Pago Fácil, Cobro Express, Pronto Pago, Mercado Pago, débitos automáticos en tarjetas (Visa, Mastercard, Cabal, Naranja, Maestro, Favacard) y en bancos (Credicoop, Nación, Provincia/Bapro, Bancor, Macro, Santander, Supervielle, Patagonia, Francés, Bersa, Santa Fe, Pampa, etc.), mutuales y municipalidades. Muchos son variantes por cooperativa. Formato: texto de ancho fijo o CSV según la especificación de cada ente. Detalle de reglas en [05](05-cobranzas-cajas-y-entes-recaudadores.md).
- **Interbanking**: `RN.Tesoreria/clsInterbanking` consulta saldos y movimientos bancarios para conciliación vía `WebService.Interbanking` (detalle en [doc 11 §16](13-pasarelas-de-pago-e-interbanking.md#16-interbanking)).

---

## 8. AFIP, reguladores y fiscos

- **AFIP**: WSAA (autenticación con certificado), WSFEv1 (factura electrónica, CAE/CAEA), padrón A13 y padrón nivel 3 por SOAP (`SoapHttpClientProtocol`). Aviso de vencimiento del certificado con la variable 2925. Ver [03](03-afip-facturacion-electronica-e-iva.md).
- **ENARGAS**: `RN.Facturacion/clsEnargas` genera los archivos SARI y FDU/DET/CMD (variables 2256–2260, 2603, 2728). Salida por archivo.
- **Tarifa social y segmentación de subsidios** (ERSeP, EPRE, OCEBA; Decreto 49/2019 y esquema de segmentación 2025): `RN.Titulares/clsTarifaSocial` importa padrones y aplica categorías (variables 737, 2408, 2748, 2823 y siguientes). `abm_deptos` guarda el código OCEBA de cada departamento.
- **ENACOM**: solo hay una pantalla de configuración de conceptos para el informe (`clsChequeosMenu.cs:1088`, `ProMod_Facturacion.Forms.frmEnacom`); la generación está en el módulo de UI.
- **EPEC**: aparece solo en pantallas de tarifas (actualización de cuadros tarifarios tomando otro como referencia).
- **FECESCOR** (federación): variables 68, 3096 y 3114.
- **Fiscos**: `RN.Facturacion.Archivos` genera archivos de retenciones y percepciones e información a AFIP y provincias (RG 3685 / libro IVA digital, SICORE, SIRCAR, etc.).

---

## 9. Telemedición, prepago y aprovisionamiento de internet

- **Propósito**: alta y baja de medidores inteligentes, corte y reconexión remotos, carga de crédito prepago, lectura de estados; en cooperativas que dan internet, suspensión y habilitación de abonados en los equipos de red.
- **Clases**: base abstracta `RN.Varios.Telemed.Telemedicion/SistemaTelemedicion`; el sistema por cooperativa/servicio se elige con el enum `RN.Titulares/Sistemas_Telemedicion` y la configuración (URL, usuario, clave) se guarda en la tabla de telemedición del servicio.

| Sistema | Rubro | Transporte |
|---|---|---|
| Discar | Medidores eléctricos y prepago; también AVL (modo 5) | REST: alta, cambio de categoría, asignación y retiro de medidor, toma de estado, corte, carga de crédito, historial (`Discar.cs:53–1081`; variables 2336, 2504, 2594, 3116) |
| CashPower, CashPower_MWS, C_Token | Prepago eléctrico (tokens) | Web service |
| Hexing, Kaptor, QUO, Rainbow, Partner, AION, BATCOM, Boiero, Boiero_TSM | Medición inteligente / AMI | REST, archivos o SQL según proveedor |
| NEXO, NEXO_SQL, NEXO_TCP2, NEXO_PLUS | Medición | TCP propio o SQL |
| Sensa | Medición | REST (servicios del proveedor) |
| MikroTik | ISP | SSH a routers |
| Radius, Radius_Gretix | ISP | REST con token Bearer / sin archivo |
| SmartOlt, Wispro, Sopnet, Silexis, Ispfull | ISP (OLT, gestión de abonados) | REST con token |
| Central telefónica | Telefonía | XML de llamadas (modo 1) |

- Lectura de colectores portátiles por USB/MTP: `clsWindowsDevice` (Windows Portable Devices).
- Botón "Mi Medidor" del portal (Mr. Dims): variable 55.
- Detalle funcional en [07](07-tecnica-reclamos-gis-y-telefonia.md) y [06](06-titulares-servicios-medidores-y-consumos.md).

---

## 10. Mapas y GIS

- **KML / Google Earth**: `RN.Varios.GoogleEarth` (SharpKml) y exportaciones desde `clsRed`, `clsCirculares`, `clsInformes_Tecnica` y `clsDetalleRuta`. Salida por archivo.
- **Google Static Maps**: `RN.Varios/clsMapa.GetImageFromWeb` (`clsMapa.cs:244–249`) arma la URL de imagen con marcadores; la clave se toma de la variable 2251 y, si está vacía, **usa una clave de Google hardcodeada** (`clsMapa.cs:247`). Parámetros 2027–2029. Controles `ctrlMapaBing` y `ctrlMapa` en la UI.
- **GIS de red**: `RN.Varios.Generales/GIS` lee capas por OleDb (variable 2425); importadores específicos por cooperativa en `RN.Varios.GIS`.

---

## 11. Otras integraciones

- **Firma digital de documentos**: `RN.Varios.Configuraciones/clsFirmaDigital` usa la API de firmas de Encustody (entorno productivo o de prueba según la variable 2831; certificados en la ruta 2931) y se conecta a una **base SQL central del proveedor** con credenciales hardcodeadas (`clsFirmaDigital.cs:179–187`).
- **OpenAI**: `clsChatGPT` (clave en la variable 3048) y el asistente de fórmulas `frmAsistenteFormulas` (clave hardcodeada en `frmAsistenteFormulas.cs:124`).
- **SITSA** (gestión técnica externa): `RN.Tecnica/clsSitsa`, URL en 3034 y APIKEY en 3035.
- **Autogestión / tótem**: lector de billetes y de tarjetas por TCP (variables 2351, 2352, 2357); clase de escucha genérica `Nucleo.ComunicacionTCP` (`Nucleo.cs:2594`).
- **Impresión**: impresora de tickets Masung D347; condiciones de IVA para controladores fiscales Hasar/Epson en `abm_sit_iva` (no hay driver fiscal en el código relevado).
- **Office**: interop con Excel (`Nucleo.Excel_Class`, informes, sueldos), Word (combinación de correspondencia) y Access/DAO en ≈16 archivos; `clsIVR` exporta contactos para IVR.
- **Escáner**: WIA para digitalizar documentos adjuntos.
- **FTP genérico**: `Nucleo.FtpFile`. **REST genérico**: `RN/ReglasNegocio/WebService_REST`.
- **Soporte y comunicación del proveedor**: TeamViewer, webchat de soporte, encuestas y RSS de novedades (`Inicio_ProCoop.cs:1142`, `:1968–1973`).
- **Procoop 6 (heredado)**: comando P6 desde el Agente y rutas DBF en el `.pro`, para cooperativas que conviven con la versión anterior.

---

## 12. Integra (API local) y Agente

- **Integra**: API REST que se instala en el IIS de la cooperativa (variables 2990 y 2993). Su lógica está en `clsProcoop_Integra` y parciales (`clsProcoop_Integra.cs`, ≈11.000 líneas) y expone endpoints para órdenes técnicas, cobranzas, turnos, SMS y notificaciones. La consumen el portal, las apps y sistemas de terceros. Se actualiza solo desde el S3 del proveedor (`clsVersion.cs:138`). El modo 4 de línea de comandos (`Integracion.RealizarOperacion`) permite integraciones por proceso.
- **Agente** (`clsServicio_Procoop`): ejecuta las sincronizaciones de CoopOnline, FTP, envío de SMS/mails, rendiciones de entes, factura electrónica pendiente y backups (ver doc 09 §5.8).
- **Infraestructura del proveedor**: `clsAmazon` (S3 región sa-east-1: `SubirAS3`, `Descargar`, `Listar`, `TraerArchivosCliente`, `TraerImgCliente_Telemed`) y `clsVersion` (descarga de versiones). Con credenciales de AWS hardcodeadas (§13).

### 12.1 Tareas del Agente vinculadas a integraciones (segunda pasada)

El catálogo general de tareas programadas está en doc 09 §5.8. En `Agente.Clases` y en el módulo de correo, las que tocan integraciones son:

| Tarea | Disparo | Qué hace | Cita |
|---|---|---|---|
| Escucha de ventas y cobranzas web | Permanente; un temporizador del Agente la reinicia | Suscripción a `Venta_{n}` y `Cobranza_{n}` en Firebase; procesa cada alta (§3.1 y §3.3) | `Agente.Clases/clsWeb_CoopOnline.cs:895-992` |
| Autorización de pendientes | Ciclo del Agente, con el parámetro 2496 | Ventana de 40 minutos, ampliada al día anterior en los primeros 5 minutos de las 4, 11, 16 y 23 h; consulta la pasarela y registra (§3.4) | `:460-497`, `:605-628` |
| Rendición de entidades y autorización | Tarea de rendición | Importa pagos de los últimos 4 días (doc 11 §2.3) y autoriza las prepagas y cobranzas web con `ESTADO` < 3; avisa los errores al mail del parámetro 3025 | `RN.Varios.Generales/clsServicio_Procoop.cs:753-1017` |
| Despacho de la cola de mails | Tarea de envío de mails | `AUDIT_MAIL` con `PENDIENTE` = 1, en lotes según 404 y 461 (§2.1) | `clsServicio_Procoop.cs:502-523`; `Mails/Manager.cs:473` |

El webhook de Integra (`clsProcoop_Integra.cs:6503`) no es una tarea programada: dispara la misma autorización en el momento.

Las novedades, encuestas y respuestas del proveedor (§16.8) no las corre el Agente: se ejecutan al iniciar la aplicación de escritorio (`ProcoopNet/Procoop/Inicio_ProCoop.cs:1058-1059`).

---

## 13. Secretos hardcodeados (solo ubicación)

Se encontraron credenciales, claves o contraseñas escritas en el código. **No se transcriben.** Todas deberían considerarse comprometidas.

| Ubicación | Tipo |
|---|---|
| `Mails/Manager.cs:144` | Credencial SMTP de Amazon SES |
| `Mails/Manager.cs:374`, `:440`, `:687` | Claves de la API de Amazon SES |
| `RN.Varios.Generales/clsAmazon.cs:32`, `:398`, `:536` | Claves de AWS (S3 y SES) |
| `Agente.Clases/clsWeb_CoopOnline.cs:408–409` | URL y secreto de Firebase |
| `RN.Varios.Configuraciones/clsFirmaDigital.cs:184` | Usuario y contraseña de la base SQL central |
| `clsProcoop_Integra_Tecnica.cs:2475` | API_KEY |
| `frmAsistenteFormulas.cs:124` | Clave de OpenAI |
| `RN.Varios/clsMapa.cs:247` | Clave de Google Maps (por defecto) |
| `RN.Titulares/clsWEB.cs:416`; `clsServicio_Procoop.cs:558`, `:1061`, `:1098` | APIKEY fija de las APIs del proveedor |
| `CapaNucleo/Nucleo.cs:1202`, `1241`, `1260`, `1479–1510` | Contraseñas maestras y de administrador |
| `Configuracion/abm_Users.cs:176`, `:204` | Contraseña por defecto al resetear usuarios |
| `CapaNucleo/Nucleo.cs:2044`; `clsServicio_Procoop.cs:947`, `:1563`; `clsMigracion.cs:288`; `clsTickets.cs:2520`, `:2536`, `:2654` | Direcciones de correo personales como destinatarios fijos |
| `RN.Varios.CoopOnline/clsTramitesWEB.cs:332`, `:369`, `:591`, `:635`; `RN.Varios/clsRss.cs:169`, `:409`, `:446` *(segunda pasada)* | APIKEY fija de la API de CoopOnline (trámites, novedades, encuestas) |
| `RN.Varios.CoopOnline/clsTramitesWEB.cs:371` *(segunda pasada)* | Contraseña fija en el encabezado `Password` de la consulta de usuarios del portal (datos de CiDi) |
| `RN.Varios.CoopOnline/clsTramitesWEB.cs:584-585`, `:628-629`; `RN.Varios/clsRss.cs:439-440` *(segunda pasada)* | Clave de ruta o encabezado derivada de la fecha del día con un patrón fijo (se puede reproducir conociendo el código) |
| `RN.Cobranzas/clsMacro.cs:209-258`; `ProMod_WebService/WebService.Pagos360/Service.cs:39-76` *(segunda pasada; detalle en doc 11 §17)* | Clave secreta de Macro guardada en `PAGOS360.URL_SUCCESS`; clave Bearer de Pagos360 escrita en `c:\procoop\Log360.txt` si el archivo existe |

Además, todas las credenciales que la cooperativa carga (SMTP, pasarelas, CoopOnline, WhatsApp, telemedición) se guardan en texto plano en `VARIABLE` o en el `.pro` con ofuscación reversible. El XML del envío de mails por línea de comandos trae la clave de la casilla en texto plano (campo `pass_mail`, `Mails/General.cs:243-244`), y las casillas por módulo guardan usuario y clave en `CORREOS_INTERNOS`.

---

## 14. Implicancias para GoodApps

1. **Capa de integraciones propia con conectores**: cada pasarela, ente o sistema de telemedición como un conector con interfaz común (crear deuda / consultar / conciliar; alta / corte / reconexión / lectura), configuración por tenant y registro de cada llamada (petición, respuesta, estado, reintentos).
2. **Priorizar por uso real**: con la cooperativa piloto, relevar qué entes, pasarelas y sistemas de telemedición están activos (los 504 importadores/exportadores incluyen muchas variantes por cliente). Empezar por AFIP, correo, archivos de los entes que usa el piloto, un botón de pago y el portal del socio.
3. **El portal del socio es parte del producto**, no una base aparte que se sincroniza: en GoodApps el portal debe leer los mismos datos (API), lo que elimina `clsWEB`, la base MySQL, Firebase y el FTP de PDF. Mantener compatibilidad de URLs solo si la cooperativa ya difundió enlaces.
4. **Mensajería con proveedores propios** (SMTP transaccional, SMS, WhatsApp Business API) contratados por GoodApps o por la cooperativa, con plantillas aprobadas, cola, límites de envío y auditoría equivalente a `AUDIT_MAIL`.
5. **Gestión de secretos**: bóveda de secretos por tenant, cifrado en reposo, rotación, y nunca secretos en código ni en tablas de parámetros en texto plano.
6. **Archivos de entes**: modelar la especificación de cada formato como datos (layout declarativo) en lugar de 500 clases; validar contra archivos reales de la cooperativa.
7. **Webhooks en lugar de sondeo**: pasarelas y portal deben notificar pagos por webhook firmado; conciliación diaria contra el archivo de rendición como control.
8. **Reguladores**: ENARGAS, tarifa social/segmentación y archivos fiscales se resuelven como reportes/exportaciones parametrizables; definir cuáles aplican al piloto según el servicio (electricidad, gas, agua, internet).
9. **Office e interop local**: reemplazar por exportación a XLSX/CSV/PDF en el servidor; el hardware local (impresora de tickets, lector de billetes, colectores) requiere un agente liviano en el puesto o equipos con API de red.

## 15. Dudas abiertas

1. ~~`ProMod_WebService.dll` no descompilada~~: resuelto en [doc 13](13-pasarelas-de-pago-e-interbanking.md) ("BancoSangre" es un servicio del dominio CoopOnline para resúmenes de tarjeta de terceros); las dudas que quedan sobre pasarelas están en doc 11 §20.
2. ¿Qué integraciones están activas en la cooperativa piloto? (Pasarelas, entes, telemedición, CoopOnline, PMovil, WhatsApp oficial o no.)
3. ¿La cooperativa tiene contratos propios con las pasarelas y con WhatsApp/SMS, o todo pasa por cuentas del proveedor de Procoop? Si son del proveedor, la migración requiere nuevos contratos.
4. ¿Quién es dueño de los datos de la base MySQL de CoopOnline y de Firebase? ¿Se puede obtener un volcado para migrar usuarios del portal (altas, adhesiones a factura digital, medios de pago guardados)?
5. Integra: ¿qué terceros lo consumen hoy (además del portal y las apps)? Cualquier consumidor externo necesitará una API equivalente o un período de convivencia.
6. Telemedición: ¿qué marcas de medidores y qué equipos de red (OLT, routers) tiene el piloto, y existen APIs públicas o solo acuerdos con el proveedor de Procoop?
7. Firma digital con Encustody: ¿qué documentos se firman y bajo qué contrato?
8. ¿Se usan los controladores fiscales (Hasar/Epson) o toda la facturación es electrónica?
9. *(Segunda pasada)* ¿Qué trámites web tiene publicados LAG y qué procedimientos almacenados los ejecutan? La lógica de cada trámite (§3.5) está en esos procedimientos, que no forman parte del descompilado.
10. *(Segunda pasada)* ¿La cola de mails del Agente de LAG se traba después de detectar "un mail enviado desde otro hilo"? (posible bug descripto en §2.1).
11. *(Segunda pasada)* ¿Cuál es el intervalo real del temporizador que reinicia las escuchas de Firebase y del ciclo de autorización de pendientes? Está en el ejecutable del Agente, no en los fuentes relevados.
12. *(Segunda pasada)* ¿LAG usa el turnero (§16.1), los traslados de ambulancia (§16.5) o la DDJJ de artefactos (§3.5)? Definen si esos módulos entran en el alcance del piloto.

---

## 16. Reglas adicionales (segunda pasada): clases raíz de `ReglasNegocio.Varios`

Clases transversales de `ReglasNegocio/ReglasNegocio.Varios/` (en adelante `RN.Varios/`), agrupadas por clase. Las que ya están documentadas en otro lugar solo se remiten.

### 16.1 Turnero de atención al público (`clsTurnero`)

- **Configuración** (constructor, `RN.Varios/clsTurnero.cs:118-131`): puerto TCP 2006 y lista de pantallas 2007 (separadas por `|`). `EscucharPuerto` (`:132-143`) exige que esté implementado el evento "llamar siguiente" y, si la escucha falla, la recrea. `EnviarMensaje` (`:145-162`) informa "No se encontro la Pantalla de turnos..." ante un error de socket. `RefrescarTurnero` (`:164-170`) avisa a todas las pantallas. **[VERIFICAR]** los parámetros 2005, 2006, 2007, 2014, 2209 y 3064 si LAG usa turnero.
- **Boxes**: un box no puede estar abierto dos veces; si ya lo está: "El box Indicado fue abierto por el usuario …" (`AbrirBox`, `:189-210`). El usuario puede ser el de CoopOnline (alta desde Integra). `CerrarBox` (`:211-227`) es idempotente. `CargarBox` (`:228-243`) toma el último box abierto del usuario. `GetBoxesAbiertos` (`:172-187`) excluye el box de generación automática (2014).
- **Alta de turno** (`CrearTurno`, `:245-291`): el número es correlativo **por día y área de origen**. El código visible es:
  - el nombre de la persona, si 2005 = 1;
  - la letra del área + los últimos 3 dígitos del DNI, si 3064 está activo y hay DNI;
  - si no, la letra del área + el número con 3 dígitos.
  
  Se registran en el historial las acciones "recepción" y "en espera".
- **Estados y acciones**: estados 1 en espera, 2 llamando, 3 en atención, 4 retirado. Acciones 1 recepción, 2 en espera, 3 llamado, 4 atendido, 5 derivado, 6 a 8 retirado (solucionado, sin solución, sin atención) (`:18-37`). Cada cambio guarda la hora del servidor, el box, el área y el usuario (`ActualizarTurno`, `:301-325`). Al derivar, cambia el área del turno.
- **Llamado** (`LlamarSiguiente`, `:327-342`): bloquea la tabla `TURNOS` en una transacción y toma el próximo turno en espera de las áreas que atiende el usuario, **primero los prioritarios y después por hora de ingreso** (`GetProximoTurno`, `:490-496`). Luego lo pasa a "llamando" y refresca las pantallas. `TurnoEnBox` (`:498-501`) devuelve el turno en atención cuyo último movimiento es del box actual.
- **Áreas del usuario** (`GetAreasUsuario`, `:731-744`): si el usuario tiene áreas asignadas (`TUR_AREAS_USERS`) atiende solo esas. Si no, se lo considera "recepción" y ve todas las áreas habilitadas. `GetLetraArea` (`:722-729`) recarga el caché de áreas si no encuentra la pedida.
- **Tiempo estimado** (`GetTiempoEstimadoTurno`, `:791-845`): reparte los turnos pendientes (por prioridad y hora) entre los usuarios con box abierto hoy en las áreas del turno (`GetLstUsersArea`, `:774-789`). Suma el tiempo estimado del área (`TUR_AREAS.TIEMPO_EST`, en segundos) de los turnos asignados al mismo usuario antes que el consultado y devuelve minutos.
- **Estadísticas** (`GetEstadisticas`, `:354-488`): agrupan por día de la semana y hora, por mes, día y hora, o además por turno. Cuentan ingresados (acción 1), atendidos (4), abandonos (8) y prioritarios. Los tiempos de atención y de espera se calculan hasta el movimiento siguiente. "Excluir errores de carga" descarta los movimientos cuyo siguiente llega 5 horas o más después.
- **Últimos llamados** (`GetLamadas`, `:509-554`): los 5 últimos llamados del día, agrupados por box si 2209 = 2 o por turno en otro caso. `GetHistorial` (`:746-772`) agrega la acción en curso como fila "actual".

Métodos sin regla de negocio: `Get_Observacion`, `GetTurno` (dos sobrecargas), `Get_CodPer`, `GetGridDataSource_TUR_BOX`, `Get_Skin` (y los tres diseños de pantalla), `GetAreas`.

### 16.2 Adjuntos (`clsAdjuntos`)

- **Relación**: `ADJUNTOS.TIPO` toma el valor del enum `Adjuntos_TipoRelacion` (1 cuenta, 2 titular, 3 OT administrativa, 4 OT de mantenimiento, 5 factura de compra, 7 consumo tomado (foto de lectura), 12 servicio, 15 consumo, 24 licencias, 25 documentación, 26 trámites, 30 trazabilidad de gas, entre otros; `RN.Varios/clsAdjuntos.cs:15-47`), y `COD_TIP` guarda el identificador relacionado.
- **Nombre del archivo físico** (`CrearAdjunto`, `:194-253`): por defecto el archivo se copia como `{COD_ADJ}.{extensión}` en la carpeta de adjuntos y se actualiza `NOM_ARC`. En fotos de consumo (tipo 7) con el parámetro 2332, el nombre es `{cuenta}_{medidor}_{concepto}_{ddMMyyyyHHmm}`, sin los caracteres inválidos de `clsFormulas.Get_InvalidCharacters` (`RN.Varios/clsFormulas.cs:170-173`). Los tipos 7 (método nuevo), 24 y 25 conservan el nombre original. **[VERIFICAR]** 2332 en LAG.
- **Resolución al leer** (`GetAdjuntos` `:75-109`, `GetAdjuntosCaptor` `:111-165`, `NombreArchivo` `:385-395`): se prueba `{COD_ADJ}.ext` y, si no existe, `NOM_ARC` (en Captor, también las variantes con cuenta y medidor). Si no se encuentra ninguno se muestra "No ENCONTRADO..." (`GetFileInfo`, `:167-187`; con 2895 no se cargan íconos). Bug: en `GetAdjuntos` la opción "solo la última" filtra la consulta, pero el recorrido se hace sobre la consulta completa, así que devuelve todos.
- **Borrado**: `BulkEliminar` (`:320-351`) borra por bloques los registros y los archivos. Si falla un bloque, se detiene con "Error al eliminar los registros de adjuntos seleccionados". `EliminarEnCarpeta` (`:486-517`) borra el registro con `COD_ADJ = 0` o, si no existe, el archivo suelto.
- **Archivos huérfanos** (`GetFilesFromFolder`, `:437-484`): lista los archivos de la carpeta modificados en el rango que no tienen registro, o cuyo registro es del tipo 15 (consumo). Revisa de a 100.
- **Carga desde el escritorio remoto** (`PROCOOPAR_ADJUNTOS`): `IniciarAdjunto` (`:519-535`) avisa "Ya existe un adjunto pendiente." si hay uno sin terminar, pero igual crea otro. `FinalizarAdjunto` (`:537-546`) cierra solo los abiertos.

Métodos sin regla de negocio: `IconoFromFile`, `GetAdjuntosPorTipo`, `GetFilesAdjuntos`, `GetAdjuntoPendiente`, `GetAdjuntoFinalizado`.

### 16.3 Calendario, agenda y correo interno

- **Calendario** (`RN.Varios/clsCalendario.cs`):
  - `GetCalendario` (`:74-163`) carga los eventos personales del usuario (sin tipo) entre 3 meses antes y 3 después. En el modo "solo del día" toma los que tienen recordatorio en ±7 días y suma los eventos padre de las recurrencias.
  - Las excepciones de una serie se guardan como filas con `COD_PARENT` e índice de recurrencia.
  - En los eventos de todo el día se guarda como fin el día anterior al que indica el control (`AddAppoiment`, `:165-208`; `ModAppoiment`, `:210-251`).
  - Al modificar o borrar, el evento se busca por código **o por asunto** (`:222`, `:266`): con dos eventos de igual asunto puede tocarse el equivocado.
  - `AgregarCita` (`:283-306`) crea un evento de todo el día con etiqueta 2 y estado 1.
  - Versión web (`GetCalendarioWeb`, `:308-332`): los eventos con tipo (`CALENDARIO_TIPO`) son compartidos y los que no tienen tipo son del usuario.
  - Para borrar hace falta el permiso "EliminarEventosCalendario" (`ValidarPermisosEliminar`, `:366-373`).
- **Agenda** (`RN.Varios/clsAgenda.cs:52-130`): la búsqueda completa une los contactos de `TELEFON`, los proveedores y las personas, rotulando como "Socio Nº … / cuentas" o "Persona Nº …".
- **Correo interno** (`PROMAIL`, `RN.Varios/clsCorreo.cs`): son mensajes entre usuarios, no correo SMTP.
  - Recibidos: el destinatario contiene el nombre del usuario. Enviados: el remitente es el usuario (`GetCorreos`, `:70-77`).
  - Al abrir un mensaje se marca la fecha de lectura si el lector no es el remitente, o si es a la vez destinatario (`GetMail`, `:17-28`).
  - "Sin leer" son los que no tienen fecha de lectura, tienen código mayor que el último informado y no son notificaciones (`TIPO_NOTIFICACION` 0 o vacío, `:79-84`). Las notificaciones son las de tipo 1 o mayor (`:103-110`).

Métodos sin regla de negocio: `clsCalendario.HaycitasDelDia`, `GetTiposCalendarioWeb`, `InsertarTipoCalendario`, `InsertarCalendarioWeb`, `GetEventoPorCodigo`, `ActualizarCalendarioWeb`, `EliminarCalendarioWeb`; `clsAgenda.GetAgenda`; `clsCorreo.GetUsuarios`, `CantidadCorreosSinLeer`, `MaxCorreosSinLeer`, `MarcarNotificacionLeida`, `MarcarTodasLasNotificacionesLeidas`.

### 16.4 Navegador genérico de entidades (`clsEntidades`)

Las grillas de búsqueda se definen como datos: `ENTIDADES` (SELECT, WHERE, tablas y orden), `ENTIDACOL` (columnas e íconos), `ENTIDACRIT` (criterios), `ENTIDACON` (condiciones predefinidas) y `ENTIDACOU` (filtros guardados por usuario) (`RN.Varios/clsEntidades.cs:235-275`).

- `Guardar_Condicion` (`:591-648`): si el filtro no se guarda, recibe un código negativo temporal; si se guarda, recibe un código nuevo de la tabla. Un filtro sin descripción se rechaza con "El filtro cargado no es Válido...". Modificar un filtro inexistente da "No se encontro el objeto a modificar...".
- `Borrar_Condicion` (`:650-664`) solo borra en la base los filtros persistidos (código positivo).
- `Arma_where` (`:666-688`) une con AND los filtros activos del usuario, separando los que aplican sobre columnas calculadas, y arma el texto legible con "y".

Métodos sin regla de negocio: `obtener_entidades`.

### 16.5 Informes

- **Marco común** (`RN.Varios/clsInformes.cs`): cada módulo (compras, contabilidad, stock, sueldos, tesorería, titulares, traslados, telemedición, facturación, mesa de entradas, consumos, cobranza, financiaciones, mora, tickets, telefonía) implementa su listado de informes, filtros e impresión (constructor, `:531-608`). `GetFiltro` (`:441-452`) busca el filtro por el texto del rótulo (primero "texto:" y después el prefijo) y lanza "Error en nombre de Filtro" si no existe. `GetValorFiltroFecha` (`:393-405`) acepta solo años entre 1753 y 9999 (rango de SQL Server).
- **Informes personalizados** (`RN.Varios/clsInformesPersonalizados.cs`): la lista sale de los procedimientos almacenados cuyo nombre empieza con el prefijo configurado y "_", o de todas las tablas de usuario en el modo tablas (`GetListados`, `:69-85`). Los parámetros se leen del procedimiento con valores por defecto por tipo: 0, hoy, verdadero y "csv" para `TIPO_DESTINO` (`GetParametros`, `:87-130`). En el modo tablas, `ExecuteQuery` (`:146-172`) ejecuta "Select * from" + el nombre elegido.
- **Traslados** (`RN.Varios/clsInformes_Traslados.cs`): `GetTraslado_General` (`:22-182`) filtra los viajes de ambulancia (`AMBULANC`) por socio o no socio, persona, documento, sexo (1 sin asignar, 2 masculino, otro femenino), localidades, nosocomio, empresa, chofer, médico, móvil, característica, edad a la fecha del viaje y kilómetros. Arma el subtítulo con los filtros aplicados. `GetViaje` (`:183-247`) identifica el viaje por `COD_AMB_ORIG` si existe (viajes de varios tramos) o por `COD_AMB`.

Métodos sin regla de negocio: `clsInformes.SetBoton`, `SetTitular_Cuenta_Servicio`, `SetCombo`, `SetRadio`, `GetListados` (dos), `GetBoton`, `GetCuentaContable`, `GetBoton_Titular_Cuenta_Servicio`, `GetCombo`, `GetRadio`, `GetValorFiltro`, `GetValoresBoton`, `GetValoresBoton_String`, `GetValorFiltroEntero`, `GetValorFiltroDecimal`, `GetIndexComboFiltro`, `GetListaNumerica`, `_ShowMessage`, `_ShowQuestion`, `_EjecutarFuncion`, `_EjecutarFormulario`; `clsInformes_Traslados.NuevoTraslado`, `GetListados`; `clsTraslados.GetCaracteristicas`, `GetNosocomios`, `GetViaje`.

### 16.6 Importación de archivos y procesos SQL (`clsImportacionArchivos`)

- El padrón de condición tributaria (`ImportarArchivoEmpresas`, `ImportarArchivoEmpresasSQL`, `ImportarArchivoEmpresasList`) ya está en [doc 03](03-afip-facturacion-electronica-e-iva.md).
- `EjecutarSPTemporal` (`RN.Varios/clsImportacionArchivos.cs:131-148`) crea un procedimiento con el texto SQL recibido, lo ejecuta sin límite de tiempo y lo borra. Es una vía de ejecución de SQL arbitrario.
- `ImportarSicossDb` (`:155-194`) importa desde la base Access de SICOSS (AFIP) las tablas de obras sociales (con aporte y retención fijos de 3 %), siniestrados, condición, modalidad de contratación, actividades, tipo de empleador y situación de revista. Excluye "RESERVADA" y "NINGUNA" y toma solo las vigentes.
  - El filtro de vigencia compara con el año y el mes concatenados **sin completar el mes con cero** (por ejemplo "20263" para marzo de 2026), lo que puede incluir o excluir filas por error. **[VERIFICAR]** contra el archivo de SICOSS.
  - Mensajes: "El archivo no contiene las tablas correspondientes", "El archivo ya ha sido importado con anterioridad".

Métodos sin regla de negocio: `ChequearArchivoFormatoEmpresas`.

### 16.7 Fórmulas, mapas y escáner

- `clsFormulas` (`RN.Varios/clsFormulas.cs`) define las funciones personalizadas del evaluador de expresiones. Por ejemplo, `BuscarVariableInt(n)` (`:134-167`) expone el parámetro `Busca_V2_int(n)` dentro de las fórmulas. El motor y su uso están en docs 01, 02 y 08.
- `clsMapa` guarda imágenes de mapa por módulo en la carpeta `Mapas/{módulo}` del servidor (`RN.Varios/clsMapa.cs:202-206`). Static Maps en §10.

Métodos sin regla de negocio: `clsEditorFormulas_Extensions.ResolverFormulas`, `SetGenericDataSource`; `clsFormulas.ResultType` (dos), `IsValidOperandCount` (dos), `IsValidOperandType` (dos), `Get_InvalidCharacters`; `clsMapa.CrearMapa`, `GuardarImagen`, `GetUrlArchivo`, `DeleteImage`, `GetImagenFromServer`; `clsEscaner.SeleccionarDispositivo`, `Show`, `SaveImage` (WIA).

### 16.8 Novedades y encuestas del proveedor (`clsRss`)

Es un canal entre el **proveedor de Procoop y la cooperativa** (no con los socios), a través de la API de CoopOnline.

- **Novedades** (`TraerFeedNuevo`, `RN.Varios/clsRss.cs:142-191`): una vez por día (si la última publicación no es de hoy y hay internet) pide las novedades posteriores a la última recibida. `CargarNovedades` (`:85-140`) da de alta las nuevas y actualiza las existentes si la fecha recibida es igual o posterior. `getNoticias` (`:193-206`) muestra las de clasificación 1 solo el día de publicación, las de clasificación 2 durante 20 días y las de clasificación 3 durante 5 días.
- **Encuestas** (`CargarEncuestas`, `:332-396`, con `TraerEncuestas` `:398-430`): trae las encuestas nuevas para el número de cliente de la cooperativa. Guarda las generales y las dirigidas a ese cliente, con su vigencia, obligatoriedad, repetición y probabilidad de aparición.
- **Respuestas** (`GuardarRespuestas`, `:432-488`): envía por PUT las respuestas no enviadas (`RESPUESTAS.COD_ESTADO = false`) y marca como enviadas las que el servidor confirma. Si falla: "Fallo al comunicarse con el web service".

Métodos sin regla de negocio: `CheckRss` (lee un CSV de recursos sin efecto).
