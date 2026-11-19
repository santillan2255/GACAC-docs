# 13 — Pasarelas de pago e Interbanking

Este documento describe, a partir del código descompilado, cómo Procoop se comunica con las **pasarelas de pago online** (links de pago, QR, botones, débito automático por API) y con **Interbanking** (saldos, extractos y conciliación bancaria, más los archivos de pago a proveedores y sueldos).

Complementa, sin repetir, a:

- [05 — Cobranzas, cajas y entes recaudadores](05-cobranzas-cajas-y-entes-recaudadores.md): modelo de tablas `PAGOS360*`, clase base `EntidadDigital`, importadores de rendición por archivo, registración de la cobranza (`clsRegistracionCobranza.RegistrarPago`), débito automático por archivo.
- [10 — Integraciones externas](10-integraciones-externas.md): portal CoopOnline / Firebase, app, mail, SMS, WhatsApp, entes reguladores.
- [09 — Parámetros y configuración](09-parametros-y-configuracion.md): los nombres de parámetros (`Busca_V2_*`) que se citan acá por número.

**Convenciones de rutas.** Todas las rutas son relativas a `procoop-relevamiento/binarios/decompilado/`. Abreviaturas: `PMW/` = `ProMod_WebService/WebService.`; `RN.Cob/` = `ReglasNegocio/ReglasNegocio.Cobranzas/`; `RN.Tes/` = `ReglasNegocio/ReglasNegocio.Tesoreria/`; `Agente/` = `ReglasNegocio/Agente.Clases/`. Ejemplo: `PMW/Pagos360/Service.cs:19` = `ProMod_WebService/WebService.Pagos360/Service.cs`, línea 19.

**Política de secretos.** No se transcribe ningún valor de credencial. En `ProMod_WebService` **no se encontraron credenciales hardcodeadas**: todas salen de parámetros, de la tabla `INTERBANKING` o de tablas de configuración. Los hallazgos de seguridad (secretos que terminan en logs, en la base o en el portal) están en la [sección 17](#17-hallazgos-de-seguridad).

---

## 1. Panorama

`ProMod_WebService.dll` (.NET Framework 4.6.1, referencia `Newtonsoft.Json`, `System.Net.Http` y el SDK oficial `MercadoPago.dll` 2.3.8; `ProMod_WebService/ProMod_WebService.csproj`) es **solo la capa de transporte HTTP**: un namespace por proveedor con una clase `Service` (arma y envía el request) y una clase estática `Functions` (un método por endpoint, con las credenciales en propiedades estáticas) más los DTO de request/response. **Toda la lógica de negocio** (qué se cobra, cómo se concilia, cuándo se marca pagado) está en `ReglasNegocio`, en subclases de `EntidadDigital` (ver doc 05 §7).

El código de API de cada solicitud se guarda en `PAGOS360.API` (enum `EntidadDigital.API`):

| API | Pasarela | Tipo de integración | Base URL (producción) | Autenticación | Clase de negocio |
|---|---|---|---|---|---|
| 0 | **Pagos360** | Link de pago, QR dinámico y estático, débito tarjeta/CBU, reportes | `api.pagos360.com`, `qr.pagos360.com` | Bearer API key (param 901 / 2922) | `RN.Cob/clsPagos360.cs` |
| 1 | **SIRO** (Banco Roela) | Botón de pago, base de deuda, listados, QR estático | `siropagos.bancoroela.com.ar`, `apisiro.bancoroela.com.ar`, `apisesion.bancoroela.com.ar` | Usuario/clave → token de sesión (2492/2493, 2804/2805) | `RN.Cob/clsSIRO.cs` |
| 2 | **MercadoPago** | Preferencia de Checkout Pro (link) | `api.mercadopago.com` (SDK) | Access token (2553) | `RN.Cob/clsMercadoPago.cs` |
| 3 | OffLine | Sin API: cupón para pagar en ente presencial | — | — | ver doc 05 |
| 4 | **NaranjaX** (Ranty) | QR dinámico en caja | `api.ranty.io` + `services.apinaranja.com` | OAuth2 client_credentials (2756-2758) | `RN.Cob/clsNaranjaX.cs` |
| 5 | **Macro – Click de Pago** (PlusPagos / ASJ Servicios) | Botón de pago (formulario en el portal) | `botonpp.asjservicios.com.ar:8082/v1` | GUID + frase → token (2765-2768) | `RN.Cob/clsMacro.cs` |
| 6 | **PayFun** | Checkout (tarjeta, DEBIN, Pago Fácil) | `checkouts.payfun.com.ar/v2` | Headers `x-api-key` + `x-access-token` (2793/2794) | `RN.Cob/clsPayFun.cs` |
| 7 | **Pagos TIC** (PayPerTIC) | Checkout | `api.paypertic.com` + `a.paypertic.com` | OAuth2 password grant (2877-2883) | `RN.Cob/clsPagostic.cs` |
| 8 | **SiPago** (Geopagos) | Checkout por órdenes | `api.sipago.coop` + `auth.prd.geopagos.io` | OAuth2 client_credentials (2956-2960) | `RN.Cob/clsSiPago.cs` |
| 9 | **ProntoPago** | QR impreso en factura (por lotes) | `qrfacturas.prontopago.com.ar` | Clave pública/privada → token (2969-2971) | `RN.Cob/clsProntoPago.cs` |
| 10 | **ProvinciaNet** (Bapro) | QR en factura (por lotes) | `netqr-bff-tenant.provincianet.com.ar` | Header `x-api-key` (3046) | `RN.Cob/clsProvinciaNet.cs` |
| 11 | **Helipagos** | Checkout + código de barras + QR | `api.helipagos.com` | Bearer API key (3077) | `RN.Cob/clsHelipagos.cs` |
| — | **Interbanking** | Cuentas, saldos y movimientos (solo lectura) | `api-gw.interbanking.com.ar`, `auth.interbanking.com.ar` | OAuth2 client_credentials (tabla `INTERBANKING`) | `RN.Tes/clsInterbanking.cs` |
| — | BancoSangre (CoopOnline) | Consulta de resumen de tarjeta de terceros | `www.bancodesangre.cooponlineweb.com.ar` | Ninguna | `RN.Cob/clsTerceros.cs` |

**No existen en el código** integraciones por API con: Red Link (solo archivos, doc 05), Pago Fácil / Rapipago online como tales (solo se llega a ellos a través de los códigos de barras que devuelven Pagos360, Helipagos o PayFun), MODO u otras billeteras como API propia (los QR son interoperables y los emite la pasarela), Prisma/Decidir/Payway, ni transferencias o pagos por API de Interbanking. Se buscaron URLs y nombres de estos proveedores en todo el descompilado sin resultados.

---

## 2. Arquitectura común de `ProMod_WebService`

### 2.1 Patrón de transporte

Cada `Service.Invoke<TRequest,TResponse>(método, funcion, request)`:

1. Arma la URL `base + funcion` (algunos servicios eligen entre dos o tres bases según el nombre de la función, p. ej. SIRO `PMW/SIRO/Service.cs:29`, SiPago `PMW/SiPago/Service.cs:27`, Pagos360 `Get_Url` `PMW/Pagos360/Service.cs:147-163`).
2. Crea un `HttpWebRequest`, setea `Content-Type: application/json`, el header de autenticación y, en Pagos360/Interbanking, fuerza TLS 1.2.
3. Serializa el request con Newtonsoft (`NullValueHandling.Ignore` en general) y lo escribe en el cuerpo.
4. Lee la respuesta; si es `"[]"` devuelve el error "No se encontraron resultados"; si no, deserializa con `CoreUtils.Deserializar<T>` (`ProMod_WebService/WebService.Util/CoreUtils.cs:45-59`).
5. Ante `WebException` traduce el código HTTP a un **string de error** (p. ej. 400/409 → objeto `BadRequest` del proveedor; 401 → `error_description`; 500 → "No fue posible establecer comunicación… reintente"), que vuelve por parámetro `out`.

Consecuencias del patrón:

- **No hay reintentos automáticos** en ningún servicio propio, ni timeouts configurados (se usan los defaults de `HttpWebRequest`). El único con reintentos es MercadoPago, porque el SDK oficial trae `DefaultRetryStrategy` (2 reintentos, backoff exponencial 0,5–5 s, solo para métodos idempotentes o POST con `X-Idempotency-Key`, en 409 y 5xx; `MercadoPago/MercadoPago.Config/MercadoPagoConfig.cs:141`, `MercadoPago/MercadoPago.Http/DefaultRetryStrategy.cs:20-69`).
- El "reintento" real es de negocio: el Agente vuelve a consultar en cada ciclo, y la caja reconsulta con un timer (§2.4).
- **Credenciales en propiedades estáticas** de `Functions`: un proceso = una cooperativa. En MercadoPago el setter solo asigna el token si todavía no había uno (`PMW/MercadoPagos/Functions.cs:21-35`), así que cambiar el token exige reiniciar el proceso.
- **No hay ambiente de homologación**: todas las URLs son de producción y están hardcodeadas (Interbanking incluso lleva `/api/prod/` en la ruta). En Pagos360 la clave se usa como `key.Replace("TEST", "")` (`PMW/Pagos360/Service.cs:35`), lo que sugiere que las claves de prueba se distinguían por prefijo; en base DEMO la clave se deja vacía (`RN.Cob/clsPagos360.cs:354-365`).
- `CoreUtils.Deserializar` escribe la excepción en `LogProcoop.txt`; además `CoreUtils.cs:65` tiene hardcodeados dos nombres de equipo de desarrollo (no son secretos).

### 2.2 Ciclo de vida común de una solicitud

El ciclo es el mismo para todas las pasarelas; cambia el "conector". Estados de `PAGOS360.ESTADO`: 0 Pendiente, 1 Registrado, 2 Pagado, 3 Imputado, 4 Anulado, 5 Revertido, 6 Rechazado.

```text
1. Crear solicitud (EntidadDigital.Generar_Solicitud / Crear_PAGOS360)
   → fila PAGOS360 (ESTADO 0) + PAGOS360_ITEMS (facturas)        [doc 05 §7]
   → si hay un link idéntico de los últimos 10 min, se reutiliza  [doc 05 §7]
2. Registrar_Solicitudes: llamar a la pasarela, guardar ID externo,
   link/QR/código de barras → ESTADO 1
3. El socio paga (portal, app, caja con QR, cupón con barras)
4. Confirmación (tres caminos, ver 2.3)
   → Obtener_Pago: re-consulta la pasarela, inserta PAGOS360_PAGOS
     (deduplicando por id de pago externo) → ESTADO 2
5. Registración: clsRegistracionCobranza.RegistrarPago (planilla de
   caja, recibo; prefijos 41/42/43) → ESTADO 3 (Imputado)       [doc 05]
6. Excepciones: anulación (ESTADO 4), contracargo/reversión (5),
   rechazo (6)
```

Los métodos abstractos que cada conector implementa están en `RN.Cob/EntidadDigital.cs:240-299` (`Registrar_Solicitudes`, `Obtener_Pago`, `Importar_Pagos`, `Importar_PagosAPI`, `InicializarTimer`, `GenerarQrCaja`, etc.). Varios conectores dejan alguno en `NotImplementedException` (se indica en cada sección).

### 2.3 Cómo se entera Procoop de un pago: webhook, polling o archivo

1. **Webhook vía CoopOnline (no vía Procoop).** Las URLs de notificación que se le pasan a la pasarela tienen la forma `{url}?TipCobrador={pasarela}&CodPag={COD_PAG}` y apuntan al backend de CoopOnline del proveedor (parámetros 3139 MP, 2796 PayFun, 2959 SiPago, 3079 Helipagos; NaranjaX está hardcodeado). Procoop **no expone endpoints HTTP**. CoopOnline escribe el evento en Firebase y el Agente lo escucha (`OnAsync("Cobranza_"+cliente)`, `Agente/clsWeb_CoopOnline.cs:947` y `:974`). Luego `clsWeb_CoopOnline.ConsultarPago<T>` (`:2032-2113`) despacha a `Obtener_Pago` de la pasarela correspondiente, que **vuelve a consultar la API**: el webhook es solo un disparador y la verdad se obtiene consultando. No hay validación de firma de webhooks en ningún lado (tampoco haría falta en Procoop, porque la consulta posterior es autenticada). Excepciones: ProvinciaNet confía en el importe que llega desde el portal (§12) y SIRO, para pagos sin solicitud previa, crea la fila `PAGOS360` a partir de la consulta (§4).
2. **Polling por lote en el Agente.** `clsServicio_Procoop.Procesar_Archivo_Rendicion` (`ReglasNegocio/RN.Varios.Generales/clsServicio_Procoop.cs:753-860`) toma la entidad por defecto (param 2996, exige mail de errores 3025), consulta **los últimos 4 días** vía `Importar_PagosAPI` (Pagos360 día por día; SIRO por rango), marca los pagos encontrados como `ESTADO = 2` / procesados y después corre el importador de rendición PR estándar (`Importador_Base.Get_Importador(...).Importar("")`), que registra la cobranza igual que una rendición por archivo (doc 05). Los procesos 9 y 10 de línea de comandos de Procoop también disparan procesos de Pagos360 ([doc 09](09-parametros-y-configuracion.md), modos de línea de comandos).
3. **Polling en la caja (QR).** Al mostrar un QR en caja, `InicializarTimer` consulta el estado cada pocos segundos durante **hasta 10 minutos** (Pagos360 `RN.Cob/clsPagos360.cs:893-908`; SIRO `RN.Cob/clsSIRO.cs:1009-1024`; NaranjaX `RN.Cob/clsNaranjaX.cs:304-325`).

En el camino por webhook la registración la hace `clsWeb_CoopOnline.AutorizarCobranza` (`Agente/clsWeb_CoopOnline.cs:1679-1760`): valida que la suma de `PAGOS360_PAGOS` coincida con lo que se calcula **hoy** para las facturas (si no, registra "Los importes de la cobranza no coinciden" y no imputa) y llama a `RegistrarCobranza` (`:2170-2187`) → `clsRegistracionCobranza.RegistrarPago` con el medio de pago que corresponde a la entidad (`GetMedioPago`) y el parámetro 2452 (generar siempre recibo oficial).

### 2.4 Elección de la pasarela

`clsWeb_CoopOnline.GenerarSolicitud` (`Agente/clsWeb_CoopOnline.cs:1971-2030`) elige la entidad según el canal de pago del portal (`CANALES_PAGOS.API`) o, en su defecto, el parámetro 2774 (entidad por defecto en cobranza web). Si no hay, cae en SIRO (si 2500 "acepta SIRO" y hay usuario 2492), luego Pagos360 (si hay clave 901 y 904) y, si 2645 = "solo pago offline", en OffLine.

---

## 3. Pagos360

La integración más completa: links de pago con dos vencimientos, QR dinámico y estático, débito automático con tarjeta y CBU, reportes de cobranza y de contracargos.

### 3.1 Ambiente, autenticación y transporte

- Bases (`PMW/Pagos360/Service.cs:19`, `Get_Url` `:147-163`): `https://api.pagos360.com/` para todo; `https://qr.pagos360.com/` para `save-qr-data`; QR estático en la URL del parámetro 2921 o, si está vacío, en el host de QR.
- Header `authorization: Bearer {key}`; TLS 1.2 forzado.
- Clave: parámetro 901 (vacía en base DEMO); para el QR estático por caja, clave 2922 (`RN.Cob/clsPagos360.cs:354-365`, `Get_Config` `:384-417`). Los endpoints de checkout QR de caja se invocan **sin** clave.
- Log de depuración: si existe el archivo `c:\procoop\Log360.txt`, se le agrega la URL, el header de autorización completo y el cuerpo de cada request (`PMW/Pagos360/Service.cs:39-76`). Ver §17.
- Errores: 400/409 → `BadRequest.Get_Error` (lista de errores de validación); 401 → `error_description`; 403/404 → `message`; 405 → texto crudo; otros → `GeneralError`.

### 3.2 Endpoints (`PMW/Pagos360/Functions.cs`)

| Uso | Método y ruta | Línea |
|---|---|---|
| Crear solicitud de pago | `POST payment-request` | :44 |
| Consultar solicitud | `GET payment-request/{id}` | :49 |
| Reporte de cobranza del día | `GET report/collection/{dd-MM-yyyy}` | :54 |
| Datos de QR dinámico | `POST save-qr-data` (host QR) | :59 |
| Crear QR estático (devuelve imagen base64) | `POST create-qr` | :64 |
| Estado de QR | `GET status/{id}` | :69 |
| Nueva transacción en QR estático | `PUT new-transaction?data=` | :74 |
| Pagos por referencia/fechas (QR estático) | `GET payments?external_reference&paid_at_gte&paid_at_lte` | :79 |
| Checkout QR (caja) | `POST checkout/qr/pay`; `GET payment-request/qr/{uuid}` | :84, :89 |
| Saldos de la cuenta | `GET account/balances` | :94 |
| Adhesión tarjeta | `POST/GET card-adhesion`, `PUT card-adhesion/{id}/cancel` | :99-110 |
| Débito con tarjeta | `POST/GET card-debit-request`, `PUT …/cancel` | :114-125 |
| Adhesión CBU | `POST/GET adhesion`, `PUT adhesion/{id}/cancel` | :129-140 |
| Débito por CBU | `POST/GET debit-request`; cancelar con **`GET`** `debit-request/{id}/cancel` | :144-155 |
| Reporte de contracargos | `GET report/chargeback/{fecha}` | :159 |

La cancelación de débito CBU usa `GET` mientras el resto de las cancelaciones usa `PUT`: probable error (duda abierta).

**Request de solicitud** (`PaymentRequest`): `description`, `external_reference` (= `COD_PAG`), `first_due_date` / `first_total`, `second_due_date` / `second_total`, `payer_name`, `payer_email`, `back_url_success/pending/rejected`, `metadata`, `excluded_channels`, `excluded_card_brands`, `excluded_installments`.

**Respuesta**: `id`, `state`, `checkout_url`, `barcode`, `barcode_url`, `pdf_url`, `rapipago_barcode`, `pago_facil_first_due_date_barcode` / `…second…`, y `request_result[]` con `id`, `type`, `channel`, `paid_at`, `available_at`, `amount`, `gross_fee`, `net_fee`, `fee_iva`, `net_amount`. El reporte de cobranza devuelve `total_collected` y `data[]` (`request_id`, `external_reference`, `payment_date`, `channel`, `amount_paid`, `net_fee`, `iva_fee`, `net_amount`).

Así, Pagos360 es también la vía por la que una factura queda **pagable en Rapipago y Pago Fácil online** (códigos de barras devueltos por la API) sin un convenio directo con esos entes.

### 3.3 Flujo de link de pago

`clsPagos360.Registrar_Solicitudes` (`RN.Cob/clsPagos360.cs:2287-2428`):

- Medios habilitados por las banderas de `MEDIOS`; los no habilitados se mandan en `excluded_channels` (`Get_MedioPago` `:3036-3050`: `QR`, `wire_transfer`, `DEBIN`, `banelco_pmc`, `link_pagos`, `non_banking`, `debit_card`, `credit_card`). Marcas de tarjeta excluidas según parámetro 2743 (códigos en `:3068`); cuotas excluidas según 2720.
- Vencimientos e importes: primer y segundo vencimiento de la factura (con recargo calculado por las reglas de doc 05).
- URLs de retorno: parámetros 902 / 903 / 907 o, si no, `URL_PWEB` + "1/2/3".
- QR unitario si el parámetro 2726 lo indica y el código postal (2760) tiene 8 caracteres.
- Guarda `ID_ENTIDAD`, URLs y códigos de barra actualizando `PAGOS360` con **SQL armado por concatenación** (`:2417`).
- QR masivos para imprimir en facturas: `GenerarQr360` en lotes de hasta 10.000 (`:2430-2497`).

**Confirmación** — `Obtener_Pago` (`:742-866`):

```text
si es débito → Get_CardDebitRequest / Get_DebitRequest
si no       → Get_PaymentRequest(id); exige state == "paid"
para cada request_result que no sea rejected_*:
    si ya existe PAGOS360_PAGOS con ese ID_360 → saltear
    importe negativo si type == chargeback_payment_request_result
    FECHA_REN = available_at; CHANNEL = channel; comisiones e IVA de comisión
```

**Conciliación por reporte** — `Importar_PagosAPI` (`:2819-2895`): por cada día pide `report/collection`, descarta las filas "REVERSIÓN"/"REINTEGRO" y las del QR estático de caja, mapea el ID en pagos por QR y llama a `Obtener_Pago`. Si llega un `request_id` que no existe en `PAGOS360` (pago generado desde la app de Pagos360 u otro origen), `Importar_Pagos_Inexistentes` (`:2985-3034`) crea la fila ("Pago App"). El parámetro 2981 habilita obtener las cobranzas vía API en lugar de archivo.

### 3.4 QR en caja

- **Dinámico** (`GenerarQrCaja` `:2499-2527`): checkout QR de un uso + polling de 10 min (§2.3).
- **Estático por caja** (tabla `CAJAS_QR`, parámetros 2920-2922): un QR fijo por puesto; al cobrar se hace `PUT new-transaction` con el importe y luego se busca el pago con `GET payments`, emparejando **por fecha e importe** (`Get_Pago_QrEstatico` `:910-939`). Si dos socios pagan el mismo importe el mismo día en la misma caja, la asignación es ambigua.

### 3.5 Débito automático (tarjeta y CBU)

- Adhesión: `card-adhesion` (tarjeta) o `adhesion` (CBU). Estados que devuelve: `pending_to_sign`, `signed`, `canceled`; `Actualizar_EstadosDebitos` los sincroniza (`:1369-1450`).
- Débitos: `Registrar_Solicitudes_Debito` (`:2559-2635`). Tarjeta: se informa mes/año; **si el día del primer vencimiento es mayor o igual al parámetro 2779 (por defecto 19), el débito pasa al mes siguiente**. CBU: `debit-request` con primer y segundo vencimiento.
- Baja: `Cancelar_Debito` (`:1261-1329`) cancela en Pagos360 y deja `SUMSOC.DEB_TARJ = false` y la fecha de baja.
- El débito por archivo con bancos y tarjetas (no por API) está en doc 05 §6.

### 3.6 Contracargos, reversiones y anulaciones

- `Get_PagosRechazados` (`:1452-1506`) usa `report/chargeback/{fecha}`. Una reversión pasa la solicitud a `ESTADO = 5` (`CambiarEstadoReversion` `:3152`) y genera un anticipo/nota que vuelve a dejar la deuda (`EntidadDigital.Crear_Anticipo_Rever`, `RN.Cob/EntidadDigital.cs:301-444`, parámetros 2999-3002, 3059, 3073, 1008 vendedor, 2409 tipo de cuota). También se pueden levantar reversiones desde archivo (`Buscar_SolicitudesRevertidas` `:3163`).
- `AnularCobranza` (`:3118-3135`) desvincula la planilla (`ID_PLA`) y devuelve la solicitud a `ESTADO = 2` para reimputarla.
- **No hay devoluciones (refunds) por API** en Pagos360 ni en ninguna otra pasarela.

### 3.7 Tótem de autogestión

`GetHTMLRequest` (`:367-382`) carga un HTML embebido (`Pagos360.html` del ensamblado de AutoGestión) e inyecta **número de tarjeta, vencimiento y código de seguridad** para enviarlos al formulario de Pagos360. Los datos de tarjeta pasan por memoria de Procoop (ver §17).

---

## 4. SIRO (Banco Roela)

SIRO es a la vez ente recaudador por archivo (doc 05 §5.2, incluida la rama propia de LAG) y API. Acá solo la parte API.

### 4.1 Ambiente y autenticación

- Bases (`PMW/SIRO/Service.cs:19-29`): `https://siropagos.bancoroela.com.ar/` para las funciones que empiezan con `Api/` (botón de pago); `https://apisiro.bancoroela.com.ar/` para la API de gestión (`siro/…`); sesión en `https://apisesion.bancoroela.com.ar/`.
- `Login` (`PMW/SIRO/Functions.cs:62-119`): con usuario/clave → `POST Api/Sesion` (botón); con CUIT + clave de gestión → `POST Auth/Sesion` en el host de sesión. El token se **reutiliza durante 10 minutos**.
- Credenciales: 2492 usuario, 2493 clave (botón); 2804 CUIT y 2805 clave (API de gestión), 2807 activa la API de gestión. Otros: 2494/2495 URLs OK/ERROR, 2500 acepta SIRO, 2775 verificar primer dígito 7, 2776 retardo entre consultas, 2939 QR estático, 2798-2802 datos del QR de caja, 3179 log de consultas; del módulo móvil, 43 convenio y 42 concepto.

### 4.2 Endpoints (`PMW/SIRO/Functions.cs:22-60`)

| Uso | Método y ruta |
|---|---|
| Crear pago (botón) | `POST Api/Pago` → `Url`, `Hash` |
| Consultar pagos | `POST Api/Pago/Consulta` (`FechaDesde/Hasta`, `idReferenciaOperacion`, `estado`, `nro_terminal`) |
| Resultado de un pago | `GET Api/Pago/{hash}/{id_resultado}` → `PagoExitoso`, `Estado`, `IdOperacion`, `FechaOperacion`, `MensajeResultado` |
| Informar base de deuda | `POST siro/Pagos` (`base_pagos`, `confirmar_automaticamente`) → `nro_transaccion` |
| Estado de la base | `GET siro/Pagos/{nro}?obtener_informacion_base=true` (registros correctos/erróneos, totales) |
| Listado de rendición | `POST siro/Listados/Proceso` (`fecha_desde/hasta`, `cuit_administrador`, `nro_empresa`) |
| QR estático | `POST Api/Pago/StringQREstatico`, `POST Api/Pago/QREstatico` |

Request del botón: `nro_cliente_empresa`, `nro_comprobante`, `Concepto`, `Importe`, `URL_OK`, `URL_ERROR`, `IdReferenciaOperacion`, `Detalle[]` (`descripcion`, `importe`).

### 4.3 Flujo

- `Registrar_Solicitudes` (`RN.Cob/clsSIRO.cs:1459-1534`): `nro_comprobante` = `COD_PAG` con ceros a 20; `nro_cliente_empresa` = `COD_PAG` a 9 dígitos + convenio; el detalle se ajusta para que sume exacto el total. Los errores se escriben en un archivo `errorSiro`.
- `Obtener_Pago` (`:1201-1403`): **espera con `Thread.Sleep` el retardo del parámetro 2776 (por defecto 25 s) antes de cada consulta** (`:1224`, también `:765`), consulta en una ventana de ±30 días alrededor de `FEC_REG`; si el resultado es `RECHAZADA` o `ERROR`, pasa a `ESTADO = 6` y llama a `clsWEB.MarcarPagoPendiente` para que el portal vuelva a mostrar la deuda. Si llega un pago sin solicitud (`COD_PAG = 0`) crea la fila `PAGOS360` (tipo 6) interpretando el detalle "cod-suc-num" y bloqueando el contador con `GetMaxValue_Boqueo`.
- Conciliación: `Importar_PagosAPI` (`:420-480`) vía `Listados/Proceso`; publicación de deuda: `InformarBase` (`:482`) y `Consultar_Base` (`:512`).
- QR de caja: `GenerarQRCaja` (`:342-361`) **arma localmente** un string EMVCo interoperable (identificador de Banco Roela, CUIT, CBU, MCC 8699, CRC); QR estático por terminal "QrCaja{n}" (`:958-1080`).

---

## 5. MercadoPago

- Transporte: SDK oficial `MercadoPago.dll` 2.3.8 (`api.mercadopago.com`, `MercadoPagoConfig.cs:15`), envuelto en `PMW/MercadoPagos/Functions.cs`.
- Credencial: access token en parámetro 2553 (`RN.Cob/clsMercadoPago.cs:46-62`); 2554 URL de éxito, 2555 de rechazo, 3139 URL de notificación, 2579 fecha desde la que se consultan pagos.
- **Crear**: `Send_PaymentRequest` crea una **preferencia** de Checkout Pro (`PMW/MercadoPagos/Functions.cs:37-80`): pagador, `back_urls`, `Expires = true`, `ExpirationDateTo`, `ExternalReference = COD_PAG`, `NotificationUrl`, ítems en ARS; exige HTTP 201 y devuelve el `InitPoint` (link). `Registrar_Solicitudes` (`RN.Cob/clsMercadoPago.cs:237-306`) manda un ítem por factura más un ítem "Recargo"; vence al final del día del primer vencimiento; la notificación es `{3139}?TipCobrador=MercadoPago&CodPag=…` (`:274`); `ID_ENTIDAD` = id de preferencia.
- **Consultar**: búsqueda de pagos `approved` por rango de `date_approved` paginando de a 500 (`Functions.cs:82-124`) o por `external_reference` (`:126-156`).
- **Registrar**: `Registrar_Pago` (`RN.Cob/clsMercadoPago.cs:349-407`) deduplica por `ID_MERCADO_PAGO`, `FECHA_REN = MoneyReleaseDate`, `CHANNEL = PaymentMethodId`, **comisiones en 0** (no se toman de la API).
- No implementa devoluciones, contracargos ni QR.

---

## 6. Macro – Click de Pago (PlusPagos)

Botón de pago de Banco Macro operado por Soluciones Andinas / ASJ Servicios ("PlusPagos").

- Base: `https://botonpp.asjservicios.com.ar:8082/v1` (`PMW/Macro/Service.cs:37`). Endpoints (`PMW/Macro/Functions.cs:16-24`): `POST sesion` (GUID de comercio + frase → `data` = token y `secretKey`), `GET transaction/{cod_pag}` con Bearer.
- Parámetros (`RN.Cob/clsMacro.cs:278-292`): 2765 GUID, 2766 frase, 2767 clave secreta, 2768 token.
- **Crear**: no hay endpoint de creación. `Create_Request` (`:209-236`) arma un string separado por `;` con importe y cuenta cifrados con `AESEncrypter` del kit PlusPagos y lo guarda en `PAGOS360.URL_SUCCESS` (`Guardar_Request` `:238-258`, SQL concatenado); el portal CoopOnline lo recibe como `DatosMacro` (`Agente/clsWeb_CoopOnline.cs:1365-1368`) y arma el formulario `POST` al botón. El string **incluye la clave secreta en claro** (§17). Vencimiento: mañana.
- **Confirmar**: `Obtener_Pago` (`:138-192`) consulta `transaction/{cod_pag}`; exige estado `REALIZADA`, `montoBruto / 100` igual a `IMPORTE1` o `IMPORTE2` y fecha de pago posterior al registro.
- Archivo de rendición (`Importar_Pagos` `:318-361`): posiciones fijas (`COD_PAG` en 279 largo 21, fecha en 224, importe en 77 largo 11).

**`PlusPagosSecurityKitNetFramework`** (v2.3.1, Soluciones Andinas 2018, "Generador de hash… AES-256-CBC"): `AESEncrypter.EncryptString` (clave = frase rellenada/cortada a 32 bytes, IV aleatorio antepuesto, Base64) y `SHA256Hash.Generate(ip, secretKey, comercio, sucursal, monto)` = SHA-256 de los campos unidos por `*`. **Sí se usa** (el AES, desde `clsMacro`), lo que corrige lo dicho en doc 10; el `SHA256Hash` no tiene usos en `ReglasNegocio` (el hash del formulario lo calcularía el portal; ver dudas).

---

## 7. NaranjaX (Ranty)

- Token: `POST https://services.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms` (`client_credentials` con `client_id`, `client_secret`, `audience`); API `https://api.ranty.io` (`PMW/NaranjaX/Service.cs:19-21`). El token se cachea **sin controlar vencimiento** (`PMW/NaranjaX/Functions.cs:40-62`).
- Endpoints: `POST api/payment_request/dynamic_qr` → `id`, `qr_data`; `GET api/payment_request/{id}/payments` (estado `APPROVED`).
- Parámetros 2756-2758 (credenciales) y 2762 (`pos_id`).
- Solo QR dinámico en caja: `Create_Request` (`RN.Cob/clsNaranjaX.cs:222-260`) usa `external_payment_id = COD_PAG + "-" + código de cliente Procoop`, `callback_url` **hardcodeada** a un endpoint de CoopOnline con identificadores fijos en la ruta (`:251`) y `duration_time` calculado como hoy menos el vencimiento, que da **negativo** (`:255`, probable bug). El id externo se guarda en `URL_SUCCESS`. `Registrar_Solicitudes` (links) no está implementado (`:396-400`). Confirmación en `Obtener_Pago` (`:332-390`) + polling de caja.

---

## 8. PayFun

- `https://checkouts.payfun.com.ar/v2`, headers `x-api-key` y `x-access-token`, User-Agent "PROCOOP" (`PMW/PayFun/Service.cs:18-29`). `POST checkout` → `form_url`, `form_qr_url`; `GET payments/details/{cod_pag}` (`PMW/PayFun/Functions.cs:12-22`).
- Parámetros: 2793 API key, 2794 token, 2795 URL de retorno, 2796 notificación, 2816 medios, 2820 deuda total, 2822 importe mínimo para Pago Fácil.
- `Generar_Solicitud` (`RN.Cob/clsPayFun.cs:298-345`): `payment_methods` entre `pagofacil`, `debin`, `tarjeta`; origen "CoopOnline"; vence al día siguiente. Pagado si el estado es `CAPTURED` o `AUTHORISED` (`Obtener_Pago` `:202-251`).

## 9. Pagos TIC (PayPerTIC)

- Sesión `https://a.paypertic.com/auth/realms/entidades/protocol/openid-connect/token` (OAuth2 **password grant**: usuario, clave, `client_id`, `client_secret`; token reutilizado 5 min); API `https://api.paypertic.com` (`PMW/Pagostic/Service.cs:14-16`, `Functions.cs:23-75`).
- `POST pagos` → `id`, `form_url`; `GET pagos/{id}` (estado `approved`, `RN.Cob/clsPagostic.cs:198-237`). Parámetros 2877-2883.

## 10. SiPago (Geopagos)

- Token `https://auth.prd.geopagos.io/oauth/token` (`client_credentials`, scope `*`); API `https://api.sipago.coop` (`PMW/SiPago/Service.cs:18-27`).
- `POST/GET api/v2/orders`: importe **en centavos**, moneda "032", `webhookUrl`, redirecciones de éxito/fallo → `uuid`, `links.checkout`; estados `PENDING` / `SUCCESS` (`RN.Cob/clsSiPago.cs:52-116`, `:231-300`). Parámetros 2956-2960.
- Registra `FECHA_PAG = FEC_REG` (fecha de la solicitud, no la del pago real).

## 11. Helipagos

- `https://api.helipagos.com`, Bearer con API key (3077). `POST api/solicitud_pago/v1/checkout/solicitud_pago` (importe en centavos con ceros a 10, `fecha_vto`, `fecha_2do_vto`, `recargo`, `referencia_externa`, `url_redirect` 3078, `webhook` 3079, `qr = true`) → `id_sp`, `codigo_barra`, `checkout_url`, `qr_data`. Consulta `POST get_solicitud_pago?referencia_externa=` (estados `PROCESADA`/`ACREDITADA`, `importe_pagado`, `fecha_acreditacion`) (`PMW/Helipagos/Functions.cs:11-19`; `RN.Cob/clsHelipagos.cs:128-184`, `:323-393`).

## 12. ProvinciaNet (Banco Provincia, QR)

- `https://netqr-bff-tenant.provincianet.com.ar`, header `x-api-key` (3046) (`PMW/ProvinciaNet/Service.cs:24-32`).
- Endpoints (`PMW/ProvinciaNet/Functions.cs:13-36`): `GET api/v1/public/healthcheck`; `POST api/v1/qrs/generate_qrs` (lote de `tx_id`, `amount_1..3`, `date_1..3`) → `batch_uuid`; `GET qrs/batches/{id}/status_api`; `GET get_qrs_text?batch_uuid=…` (la URL lleva un segundo `?` en lugar de `&`, `:30`, bug).
- `GenerarLoteQr` (`RN.Cob/clsProvinciaNet.cs:257-347`): envía el lote, **espera 10 s fijos** (`:311`) y consulta; parámetro 3199 (días). Guarda el JSON del lote en log.
- **`Obtener_Pago` no consulta la API**: toma como pagado el importe `pagado` que llega desde el portal (`:95-143`). Es el único conector donde la confirmación depende enteramente de un dato externo no verificado.

## 13. ProntoPago (QR en facturas)

- `https://qrfacturas.prontopago.com.ar`: `POST api/v1/authorization` (clave pública/privada → token de 1 h), `POST api/v1/qr` (`servicio`, `clientes[]`) → `qrs` (`PMW/ProntoPago/Functions.cs:17-50`). Parámetros 2969-2971.
- `InformarQrs` (`RN.Cob/clsProntoPago.cs:220-265`) en lotes de 100; descarta importes ≤ $10. `Obtener_Pago` no está implementado (`:332-335`): los pagos entran por el archivo de rendición "ProntoPago_QR" (doc 05).

## 14. OffLine y resumen de tarjeta de terceros

- **OffLine** (API 3): no hay pasarela; el portal genera un cupón (PDF) para pagar en un ente presencial y el pago entra por la rendición por archivo (doc 05; parámetro 2645).
- **BancoSangre**: `POST https://www.bancodesangre.cooponlineweb.com.ar/api/ResumenTarjeta/GetResumen` (sucursal, DNI, CUIT → resumen de tarjeta, importe total y mínimo, vencimiento), **sin autenticación** (`PMW/BancoSangre/Service.cs:13`, `Functions.cs:9-13`). Lo usa `clsTerceros.GetResumen` (`RN.Cob/clsTerceros.cs:206`) para cobrar en caja/portal resúmenes de tarjeta de una entidad de terceros (parámetro 3114; `clsWeb_CoopOnline.CrearCobranzaResumenTarjeta`, `Agente/clsWeb_CoopOnline.cs:1324-1370`). El nombre del servicio no tiene relación con un banco de sangre real: es un servicio del proveedor alojado en el dominio CoopOnline.

## 15. Cobertura por tipo de medio

| Necesidad | Cómo se resuelve hoy |
|---|---|
| Link / botón de pago | Pagos360, SIRO, MercadoPago, Macro, PayFun, Pagos TIC, SiPago, Helipagos |
| QR dinámico en caja | Pagos360, SIRO (EMVCo local), NaranjaX |
| QR estático por caja | Pagos360 (`CAJAS_QR`), SIRO |
| QR impreso en factura | Pagos360 (`GenerarQr360`), ProvinciaNet, ProntoPago |
| Pago Fácil / Rapipago "online" | Códigos de barras de Pagos360 / Helipagos, PayFun; si no, archivo (doc 05) |
| Débito automático tarjeta / CBU por API | Solo Pagos360; el resto por archivo (doc 05 §6) |
| DEBIN | Como canal dentro de Pagos360 o PayFun |
| Red Link / Banelco | Como canal de Pagos360 (`link_pagos`, `banelco_pmc`); si no, archivo |
| Devoluciones | No implementadas en ninguna pasarela |
| Contracargos | Solo Pagos360 (reporte + anticipo de reversión) |

---

## 16. Interbanking

Interbanking aparece de dos formas independientes: una **API de información financiera** (solo lectura, para saldos y conciliación) y **archivos de pago** para subir a la banca electrónica. No hay transferencias por API.

### 16.1 API (`PMW/Interbanking/`)

- Token: `POST https://auth.interbanking.com.ar/cas/oidc/accessToken` con `grant_type=client_credentials` en formulario y `scope=info-financiera` (`PMW/Interbanking/Service.cs:21`, `Functions.cs:9-11`, `Login` `:48-70`).
- API: `https://api-gw.interbanking.com.ar/api/prod/v1/` y `/v2/` (`Service.cs:23-25`). Headers: `Authorization: Bearer`, `client_id` y un header `service` con una URL fija del proveedor de Procoop (`:79`), que parece identificar la aplicación registrada ante Interbanking.
- Endpoints (`Functions.cs:21-34`): `GET accounts?customer-id=` (cuentas), `GET accounts/balances?customer-id=` (saldos), `GET v2 accounts/{nro}/movements/anteriores?bank-number&customer-id&date-since&page&account-type` (movimientos de días anteriores, paginados). No se usan movimientos del día.
- Credenciales: tabla **`INTERBANKING`** (`CLIENT_ID`, `CLIENT_SECRET`, `ACCESS_TOKEN`, `EXP_TOKEN`, `CUSTOMER_ID`). El token se persiste en la tabla con vencimiento de 7200 s y se reutiliza.

### 16.2 Saldos y movimientos (`RN.Tes/clsInterbanking.cs`)

- Vinculación de cuentas: `BANKOS.CTA_INTERBANKING` guarda en JSON la cuenta de Interbanking asociada a cada banco propio (`Configuracion/abm_bankos.cs:229-261`); `getCuentasInterbanking` (`:133-170`) lista las cuentas disponibles.
- `getSaldosCuentasInterbanking` (`:172-243`): compara el saldo bancario informado con el saldo contable de `RESBAN` por `COD_BAN`. Pantalla `frmSaldosCuentasInterbanking`.
- `getMovimientosCuentaInterbanking` (`:245-353`): pagina, **deduplica** por cuenta + importe + correlativo + fechas y guarda en `MOV_INTERBANKING`; el código de operación de Interbanking se traduce a un concepto de Procoop por `CON_COM.COD_IB` (`getCodConCom` `:626-632`).

### 16.3 Conciliación bancaria

- Pantalla `frmConciliacionInterbanking` (menú en `clsDefault.cs:459-460`, `clsChequeosMenu.cs:858-859`). Muestra a la izquierda los movimientos bancarios (`GetMovimientosInterbank` `:355-412`) y a la derecha los de libro (`GetMovimientosResban` `:414-452`), con filtro de estado 1 conciliado, 2 no conciliado, 3 por fecha de conciliación.
- `GuardarConciliacion` (`:479-508`): el usuario selecciona N movimientos de banco y M de libro y se graba un grupo `COD_CONC` en `RESBAN_MOVINT` (conciliación **manual, muchos a muchos**). `EliminarConciliacion` (`:510-520`) deshace el grupo. La fecha de conciliación queda en `RESBAN.FEC_CONC_INT` (`RN.Tes/clsTesoreria.cs:1165-1205`).
- No hay conciliación automática por reglas (importe/fecha/referencia).

### 16.4 Archivos de pago (proveedores y sueldos)

- **Pago a proveedores** — `GenerarArchivosInterbanking` (`ReglasNegocio/ReglasNegocio.Facturacion/clsInformes_Compras.cs:3447-3495`): cabecera `*U*` + CBU de origen (22) + "D" + fecha…; detalle `*M*` + CBU del proveedor + importe en centavos (17) + concepto (60) + tipo, sucursal y número de comprobante + retención. CBU de origen de la entidad o parámetro 2573. Hay variante Credicoop en planilla (`:3497`).
- **Transferencias desde tesorería** — `clsProveedor.ExportarArchivo_Interbanking` (`ReglasNegocio/clsProveedor.cs:163-204`): usa el parámetro **2262 (CBU de sueldos)** como origen y marca `RESBAN.GEN_ARCHIVO`. Que use el CBU de sueldos y no el 2573 parece una inconsistencia (duda abierta).
- **Sueldos** — `clsInformes_Sueldo.ExportarArchivoInterbanking` (`ReglasNegocio/RN.Sueldos/clsInformes_Sueldo.cs:2245-2315`): CBU de origen 2262, CBU del empleado; con 3129 reparte entre varias cuentas del empleado. Pantalla `frmExportadorInterBanking` (`clsChequeosMenu.cs:411`).

---

## 17. Hallazgos de seguridad

Sin transcribir valores; solo tipo y ubicación.

| Hallazgo | Tipo de secreto / dato | Ubicación |
|---|---|---|
| El log de Pagos360 escribe el header de autorización completo y el cuerpo si existe `c:\procoop\Log360.txt` | API key Bearer en texto plano en disco | `PMW/Pagos360/Service.cs:39-76` |
| El string del botón Macro incluye la clave secreta en claro; se guarda en `PAGOS360.URL_SUCCESS` y viaja al portal | Clave secreta de comercio (firma) | `RN.Cob/clsMacro.cs:209-258`; `Agente/clsWeb_CoopOnline.cs:1365-1368` |
| Credenciales de pasarelas en parámetros `V2_*` sin cifrar | Tokens, claves, client_secret | parámetros listados en cada sección (doc 09) |
| Credenciales y token de Interbanking en tabla sin cifrar | client_secret, access_token | tabla `INTERBANKING`; `RN.Tes/clsInterbanking.cs` |
| Datos de tarjeta (número, vencimiento, código de seguridad) inyectados en un HTML local en el tótem | Datos PCI | `RN.Cob/clsPagos360.cs:367-382` |
| ProvinciaNet acepta como pagado el importe que informa el portal, sin consultar al banco | Integridad del cobro | `RN.Cob/clsProvinciaNet.cs:95-143` |
| SQL armado por concatenación al guardar datos de solicitudes | Inyección SQL (datos de la pasarela) | `RN.Cob/clsPagos360.cs:2417`; `RN.Cob/clsMacro.cs:238-258` |
| Servicio BancoSangre sin autenticación devuelve resúmenes de tarjeta por DNI/CUIT | Datos personales | `PMW/BancoSangre/Service.cs:13` |

No se encontraron credenciales hardcodeadas en `ProMod_WebService`, `MercadoPago` ni `PlusPagosSecurityKitNetFramework`.

---

## 18. Resto de `ProMod_WebService`

Además de las pasarelas e Interbanking, el ensamblado solo contiene `WebService.BancoSangre` (§14) y `WebService.Util/CoreUtils` (deserialización y log). **No contiene** los clientes de CoopOnline, la app, SMS, WhatsApp, mail ni Firebase: esos están en `ReglasNegocio` (`Agente.Clases`, `RN.Titulares/clsWEB`, etc.) y se describen en [doc 10](10-integraciones-externas.md).

---

## 19. Implicancias para GoodApps

### 19.1 Prioridades

1. **Para el piloto LAG** alcanza con **SIRO**: el botón de pago para CoopOnline, sobre todo para recargas de energía prepaga, y el envío y la rendición por archivo. La base de LAG no tiene ninguna otra pasarela configurada ([doc 12 §3](12-configuracion-real-laguna-larga.md)).
2. **Pagos360** primero entre las de link: cubre link, QR, Rapipago/Pago Fácil por código de barras, débito tarjeta/CBU y contracargos con una sola integración.
3. **Interbanking**: saldos + movimientos + conciliación es valor alto y API simple (3 endpoints de lectura). Los archivos de pago a proveedores/sueldos son exportadores de formato fijo.
4. El resto (NaranjaX, PayFun, Pagos TIC, SiPago, Helipagos, ProvinciaNet, ProntoPago, Macro) solo si alguna cooperativa los usa: migrar bajo demanda.

### 19.2 Diseño genérico propuesto

- **Un modelo único de "intención de pago"** (equivalente a `PAGOS360` + ítems + pagos) con estados explícitos y una máquina de estados validada: `pendiente → emitida → pagada → imputada`, más `anulada`, `vencida`, `rechazada`, `revertida`, `devuelta`.
- **Interfaz de conector** con operaciones `crear`, `consultar`, `listarCobranzas(rango)`, `cancelar`, `devolver` y, opcionalmente, `adherirDebito` / `emitirDebito` / `contracargos`; capacidades declaradas por conector (no `NotImplementedException`).
- **Credenciales por cooperativa** en un almacén de secretos (no en parámetros ni tablas), con ambiente sandbox/producción configurable por conector y URLs base configurables.
- **Idempotencia**: clave externa = id de la intención; deduplicación de pagos por id de pago externo (como hace Procoop), y reutilización de links vigentes.
- **Importes recalculados con las reglas de doc 05** al emitir; al confirmar, aceptar el importe pagado aunque hoy el cálculo dé distinto (evitar el bloqueo de "importes no coinciden" y mandarlo a una cola de revisión).

### 19.3 Webhooks vs. polling

- **Webhooks recibidos por GoodApps** (endpoint propio por conector, sin pasar por Firebase), tratados como disparadores: siempre re-consultar la API antes de marcar pagado, igual que hace Procoop, y validar firma cuando el proveedor la ofrezca.
- **Polling de conciliación diario** (reporte de cobranza / listado) como red de seguridad, con ventana configurable (Procoop usa 4 días) y alta de pagos sin intención previa ("pago app").
- **Polling corto solo para caja con QR**, preferentemente reemplazado por webhook + notificación en tiempo real a la caja.
- Reintentos con backoff y timeouts explícitos, cola de mensajes para los webhooks y registro de auditoría sin secretos (corregir el caso del log de Pagos360).
- Evitar esperas fijas (25 s de SIRO, 10 s de ProvinciaNet): usar consulta asíncrona.

### 19.4 No replicar

Credenciales estáticas por proceso, secretos en logs/campos de la base o enviados al portal, SQL concatenado, confirmación sin consultar a la pasarela (ProvinciaNet), emparejamiento por fecha+importe del QR estático (asignar una referencia por transacción), manejo de datos de tarjeta en el tótem (usar formularios alojados por la pasarela).

---

## 20. Dudas abiertas

1. ~~¿Qué pasarelas usa hoy LAG y con qué volumen? ¿Usa Interbanking?~~ **Respondida** en la base demo ([doc 12 §3](12-configuracion-real-laguna-larga.md)). Usa solo el botón SIRO: 128.776 solicitudes entre 2023 y 2026, cerca del 70 % de energía prepaga. Las demás pasarelas no tienen credenciales y la tabla `INTERBANKING` está vacía.
2. El backend CoopOnline que recibe los webhooks (`TipCobrador`/`CodPag`) no está en el descompilado: ¿valida algo antes de escribir en Firebase? ¿GoodApps reemplaza también ese componente?
3. ¿Las claves de Pagos360 con prefijo "TEST" eran claves de sandbox usadas contra producción? ¿Existió alguna vez un ambiente de homologación configurable?
4. Cancelación de débito CBU en Pagos360 con `GET` en lugar de `PUT`: ¿funciona o es un bug latente?
5. Macro: ¿quién calcula el hash del formulario (el portal)? ¿Por qué se guarda y envía la clave secreta junto con los datos cifrados?
6. ProvinciaNet: ¿de dónde sale el importe `pagado` que llega al Agente y quién lo garantiza?
7. NaranjaX: el `duration_time` negativo y el `callback_url` fijo, ¿funcionaban en producción?
8. Interbanking: ¿la aplicación registrada (header `service` y `client_id`) es del proveedor de Procoop o de cada cooperativa? ¿Hay que tramitar credenciales propias para GoodApps?
9. `clsProveedor.ExportarArchivo_Interbanking` usa el CBU de sueldos (2262) como origen de pagos a proveedores: ¿intencional?
10. Devoluciones: ¿cómo se resuelven hoy (manual en el panel de la pasarela + nota de crédito)? ¿GoodApps debe integrarlas por API?
11. ¿Se usan efectivamente PayFun, Pagos TIC, SiPago, Helipagos y ProntoPago en alguna cooperativa del parque, o son integraciones hechas para un único cliente?
