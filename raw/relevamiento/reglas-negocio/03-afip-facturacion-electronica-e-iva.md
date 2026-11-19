# 03 — AFIP/ARCA: facturación electrónica, padrón e IVA

Reglas extraídas del código descompilado de Procoop 10.4.6.722. Todas las referencias `archivo:línea` son relativas a `binarios/decompilado/ReglasNegocio/` salvo que se indique otra carpeta (`ProcoopNet/`, `Configuracion/`). El código es de terceros: acá solo se describe el comportamiento, con pseudocódigo breve cuando ayuda.

En el código conviven los nombres "AFIP" (clases, tablas, URLs) y "ARCA" (mensajes al usuario y descripciones de parámetros, actualizados después del cambio de nombre del organismo en 2024). En este documento se usa "AFIP" para referirse a lo que está en el código y "ARCA" para lo que aplica hoy.

## Fuentes revisadas

| Fuente | Qué contiene |
|---|---|
| `ReglasNegocio.Facturacion/clsFacturacionElectronica.cs` (2892 líneas) | Ticket WSAA, autorización CAE/CAEA, consultas, inconsistencias, carpetas IN/OUT, padrón |
| `ReglasNegocio.WSAA/LoginCMSService.cs` | Proxy SOAP de WSAA (`loginCms`) |
| `ReglasNegocio.WSFEV1/*.cs` (114 archivos) | Proxy SOAP de WSFEv1 (`Service.cs` y DTOs) |
| `ReglasNegocio.WSPA13/*.cs` | Proxy del padrón A13 (`getIdPersonaListByDocumento`, `getPersona`) |
| `ReglasNegocio.WSPN3/*.cs` | Proxy del padrón PUC "Contribuyente Nivel 3" (`get`) |
| `ReglasNegocio.Facturacion/clsLibroIVA.cs` (2524) | Libro IVA ventas, criterios facturado/percibido, carátula, exportaciones |
| `ReglasNegocio.Facturacion/clsLibroIVAdigital.cs` (616) | Comparación del libro contra lo registrado en AFIP ("Mis Comprobantes") |
| `ReglasNegocio.Facturacion.Archivos/RG3685.cs`, `RG3571.cs`, `TipoArchivos.cs` | Formatos de exportación (CITI / Libro IVA digital, RCSP, etc.) |
| `ReglasNegocio.Facturacion/clsFacturacionVarios.cs` (847) | Comprobantes de administración pública |
| `ReglasNegocio.Facturacion/clsComprobante.cs`, `clsFacturacionMasiva.cs`, `clsAnulacionFacturas.cs` | Asignación de CAE/CAEA/CAI/CESP al emitir y validaciones de CESP |
| `ReglasNegocio.Varios.Generales/clsServicio_Procoop.cs` | Agente que autoriza en segundo plano |
| `ReglasNegocio.Varios/clsImportacionArchivos.cs` | Importación del padrón de condición tributaria (tabla `EMPAFIP`) |
| `CapaNucleo/clsVariables.cs` | Descripción de los parámetros `Busca_V2_*` |

Tablas involucradas (ver `binarios/CapaDatos-tablas.md`): `FACTURAS`, `ITEMSFAC`, `COMPROB` (campo `COD_AFIP`, `TIPO_SIT`, `DEB_CRE`, `INTERNO`), `COMPPOS` (comprobante × punto de venta, flags `CAE`, `CAEA`, `CAI`), `PTOVENTA` (flag `PAUSAR`), `SITIVA` (campos `AFIP_SIT`, `COD_AFIP`, `COD_EMPAFIP`, `IVARI`, `PERCIBIDO`, `CSP_DEF`, `SPU_DEF`), `DOCUMENT` (`COD_AFIP` del tipo de documento), `RELACION_COMP`, `CESPAFIP`, `EMPAFIP`, `ACTAFIP`, `ELECTRONICA_FC` / `ELECTRONICA_IVA` / `ELECTRONICA_TRIB` / `ELECTRONICA_RELCOMP`, `COMPROBANTES_ADM`, `IVACOM` / `FPALIC_IVA` (compras).

---

## 1. Dos modos de operación

Procoop puede funcionar de dos maneras frente a AFIP (`clsFacturacionElectronica.ModoSistema`, `clsFacturacionElectronica.cs:195-199`):

- **Completo**: los comprobantes nacen en Procoop (`FACTURAS`). Un comprobante que requiere CAE se graba "bloqueado" (`FACTURAS.ID_BLO = -1`, `clsComprobante.cs:789`, `clsComprobanteFactura.cs:1128`) y queda pendiente hasta que se autoriza.
- **Solo factura electrónica** (`Nucleo.objConfig.SoloElectronica`): Procoop actúa como pasarela de autorización para comprobantes generados por otro sistema. Los comprobantes entran por archivos CSV a una carpeta de entrada, se guardan en `ELECTRONICA_FC` y el resultado (CAE o error) se devuelve en archivos a una carpeta de salida (sección 6). En este modo se crean solo las tablas `ELECTRONICA*` más algunas de soporte (`clsChequeos_Estructura.cs:979-986`) y se piden solo los parámetros 519, 2082, 2083 y de backup (`clsVariables.cs:100-108`).

## 2. Autenticación WSAA

### 2.1 Configuración

| Parámetro | Descripción (de `clsVariables.cs`) | Uso |
|---|---|---|
| 2071 | Path de Certificado ARCA | Archivo del certificado con clave privada (`clsFacturacionElectronica.cs:809`) |
| 2072 | URL ARCA para obtención de Ticket de Autenticación | Endpoint WSAA (`:808`) |
| 2073 | URL ARCA para Registración de Facturas electrónicas | Endpoint WSFEv1 (`:495`) |
| 2925 | Vencimiento Certificado ARCA (obtenido de Certificado) | Se actualiza solo, con el `NotAfter` del certificado (`:335-338`) |

Los valores por defecto del proxy apuntan a **homologación** (`wsaahomo.afip.gov.ar`, `wswhomo.afip.gov.ar`, `ReglasNegocio.Properties/Settings.cs:19-25`); producción se configura por los parámetros 2072/2073. En cambio, las URLs de padrón están fijas en código y son de producción (`clsFacturacionElectronica.cs:501-514`).

`CargarTicket(WS = "wsfe")` (`clsFacturacionElectronica.cs:801-849`) valida antes de pedir nada:

1. Si la base es DEMO, no permite facturación electrónica.
2. El archivo del certificado (2071) debe existir; las URLs 2072 y 2073 no pueden estar vacías (la 2073 se exige incluso cuando el ticket es para padrón).
3. Si ya hay un ticket en memoria para el mismo servicio y no expiró, lo reutiliza.
4. Si no, crea un `LoginTicket` y llama a `GetTicket`.

### 2.2 Ticket de acceso y caché

`LoginTicket.GetTicket` (`clsFacturacionElectronica.cs:293-302`) usa un **caché en archivo**: `<carpeta "Electronica" del servidor>\TA<servicio>.xml` (por ejemplo `TAwsfe.xml`). Si el archivo existe y el ticket guardado sigue vigente, lo usa; si no, pide uno nuevo. Hay entonces dos niveles de caché: memoria (por instancia de la clase) y archivo (compartido por todas las terminales que ven la carpeta del servidor).

Obtención de un ticket nuevo (`ObtenerLoginTicketResponse`, `:304-375`):

```text
armar loginTicketRequest:
  uniqueId       = contador estático del proceso (arranca en 0 en cada ejecución)
  generationTime = ahora − 10 minutos
  expirationTime = ahora + 10 minutos
  service        = "wsfe" | "ws_sr_padron_a13" | "WSPN3"
firmar el XML como CMS/PKCS#7 con el certificado (incluye solo el certificado final)
actualizar parámetro 2925 con la fecha de vencimiento del certificado
llamar loginCms(CMS en base64)
  si la excepción contiene "expirado" → mensaje "certificado vencido, ARCA no autorizará más comprobantes"
guardar la respuesta en TA<servicio>.xml y cargarla
```

- El certificado se lee con `X509Certificate2.Import(bytes del archivo)` sin contraseña (`:438-450`): el archivo tiene que ser un PFX/P12 con la clave privada y **sin clave**.
- La firma está en `CertificadosX509Lib.FirmaBytesMensaje` (`:421-436`).

Lectura del ticket (`CargarTicket(PathArchivo)`, `:377-416`): toma `uniqueId`, `generationTime`, `expirationTime`, `sign` y `token`; decodifica el token (base64 → XML `sso`) para sacar el **CUIT representado** de `/sso/operation/login/relations/relation`. Si hay una sola relación usa esa; si hay más de una, usa **la segunda** (`:394-401`), lo que supone un orden fijo en la respuesta. El ticket es válido mientras `expirationTime > ahora`.

`GetTicketFirmante` (`:745-757`) devuelve el CUIT del ticket o, si no se puede obtener, lo extrae del *subject* del certificado (texto que sigue a `"=CUIT "`).

El constructor fuerza TLS 1.2 y el destructor restaura el protocolo anterior (`:551-560`). El cliente WSFEv1 usa un timeout de 90 s (`:492-499`).

### 2.3 Avisos de vencimiento

Al iniciar Procoop (`ProcoopNet/Procoop/Inicio_ProCoop.cs:1381-1385` y `:1255-1275`), si el certificado vence en 14 días o menos se muestra un aviso (asterisco hasta 7 días, exclamación de 7 a 3, error en los últimos 3 días o si ya venció). Solo lo ven los usuarios con el permiso `ControlTitularesProcoopWeb`.

## 3. Autorización con CAE (FECAESolicitar)

### 3.1 Cola de pendientes y disparadores

`GetPendientes` (`clsFacturacionElectronica.cs:588-743`):

- **Modo completo**: `FACTURAS` cuyo comprobante y punto de venta tienen `COMPPOS.CAE = true` y cuyo punto de venta no está pausado (`PTOVENTA.PAUSAR = false`). Se considera pendiente si `ID_BLO = -1`. El código AFIP sale de `COMPROB.COD_AFIP`; el importe total es `TOTAL1 + IMP_ANTI`; se marca `Comp_RI` si `COMPROB.TIPO_SIT = 1`. Para cada par comprobante/punto de venta calcula el último número autorizado localmente (máximo `NUM_COM` con `VTOCAE` cargado).
- **Modo solo electrónica**: `ELECTRONICA_FC` sin `VTOCAE`. Ahí `COD_COM` ya es el código AFIP y `Comp_RI` se deduce de `CLIENTE_TIPDNI = 80`.

El estado visible es *Procesando*, *Autorizado* (tiene `VTOCAE`) o *Pendiente* (`:233-247`).

Quién dispara la autorización:

- **Agente / servicio** (`clsServicio_Procoop.RegistrarFacturasElectronicas`, `clsServicio_Procoop.cs:470-483`): agrupa los pendientes por tipo y punto de venta, los ordena por número y los manda en **tandas de 100** (`:1940-1964`). Corta en el primer error y lo registra en el log.
- El parámetro **726** "Autorizar Facturas con cliente ARCA automáticamente" (propiedad `RegistrarFacturasAuto`, `clsFacturacionElectronica.cs:478-491`) se prende y apaga desde el ícono de notificación (`ProcoopNet/Procoop.Forms/IconoNotificacion.cs:241-243`). La facturación masiva lo pone en `false` cuando quedan facturas bloqueadas (`clsFacturacionMasiva.cs:883-887`).
- **Espera sincrónica**: si el parámetro **727** "Aguardar a que se registre en ARCA la factura" está activo, al registrar una venta o una cobranza que genera factura se consulta la base 15 veces con 1 s de pausa, esperando que el agente desbloquee la factura (`ChequearRegistracion`, `clsFacturacionElectronica.cs:937-966`; usos en `clsComprobanteVenta.cs:631-683` y `clsRegistracionCobranza.cs:198-207`). Si no llega, la operación queda registrada con el aviso "no se pudo autorizar en ARCA".
- **Aviso al iniciar**: si hay facturas con `ID_BLO = -1` y fecha de hace más de 3 días (`clsFacturacionMasiva.ValidarElectronicas`, `:300-308`), se muestra un aviso y la lista de pendientes (`Inicio_ProCoop.cs:1356-1363`).

### 3.2 Bloqueo y validaciones previas

`RegistrarFacturas(lista, modo, consulta)` (`clsFacturacionElectronica.cs:851-924`):

- **Completo**: bloquea las filas con `BloquearRegistro("FACTURAS", "ID_FAC in (...) and VtoCAE is null", transacción, 15)`. Si autoriza hace *commit*; si falla, *rollback*. Si no logra el bloqueo devuelve `true` sin hacer nada (otro proceso está trabajando).
- **Solo electrónica**: marca `PROCESANDO = 1` con un `UPDATE ... WHERE PROCESANDO = 0`. Si la cantidad de filas actualizadas no coincide, aborta; al final siempre vuelve `PROCESANDO = 0`.

Validaciones del método privado (`:968-1010`):

1. Todas las facturas deben estar bloqueadas (`ID_BLO = -1`).
2. **No puede haber una factura anterior pendiente** del mismo comprobante y punto de venta (número menor con `ID_BLO = -1`) → "No es posible autorizar la factura en ARCA ya que hay una factura anterior pendiente de autorización".
3. Ticket válido.
4. En modo "solo consulta" no autoriza: recupera el CAE con `FECompConsultar` (sección 3.7).

En `AutorizaFacturas` (`:1981-2186`):

5. `COMPROB.COD_AFIP` tiene que ser numérico; si no → "Debe configurar el código ARCA del Comprobante …".
6. **Numeración correlativa**: si el rango tiene huecos, informa el primer número faltante y no envía nada (`:1997-2006`).

### 3.3 Agrupación en lotes

Para los códigos AFIP **6, 7, 8, 9, 10, 11, 12, 13, 15, 35, 40, 49, 61, 64** (facturas, notas de débito y crédito B y C, y similares) se agrupan comprobantes consecutivos en un único detalle `CbteDesde..CbteHasta` (`:1992-1996`, `:2010-2026`). La regla para abrir un detalle nuevo es:

```text
nuevo detalle si:
  no es agrupable, o
  el número no es el siguiente al último del lote, o
  TOTAL1 del comprobante > máximo (parámetro 2712, por defecto 5000), o
  el lote actual tiene un solo comprobante y su total supera el máximo
```

En un lote el receptor se envía como `DocTipo = 99`, `DocNro = 0`; los importes se suman y las alícuotas y tributos se fusionan por código. En modo solo electrónica el máximo está fijo en 5000 en lugar de usar el parámetro (`:2228`). Existe además el parámetro 2427 "Importe Máximo para autorizar los comprobantes de Facturas Electrónicas", pero no se encontró dónde se usa.

### 3.4 Armado del detalle (`GetDetRequest` para `FACTURAS`, `:2349-2627`)

**Receptor**

- `DocTipo` = 80 (CUIT) si `COMPROB.TIPO_SIT = 1` (comprobante para responsable inscripto); si no, el `COD_AFIP` del tipo de documento de la persona (`DOCUMENT.COD_AFIP`).
- `DocNro` = `SOCIOS.CUIT` si es 80, o `PERSONAS.NUM_DNI`, sin guiones. Si no se puede convertir a número y el parámetro **2780** "No utilizar CUIT genérico" está apagado, usa el **CUIT genérico 23333333333**.
- Si es CUIT pero el número tiene 8 dígitos (un DNI), **genera el CUIT** a partir del DNI y el sexo (`Impuestos.GenerarCuit`, `:2365-2368`).
- Si `DocTipo = 99`, `DocNro = 0`.
- `CondicionIVAReceptorId` = `SITIVA.AFIP_SIT` de la situación IVA de la factura, si no es 0 (`:2424-2429`).

**Concepto y fechas de servicio**

- Concepto 1 (productos) si hay ítems de tipo 1; 2 (servicios) si solo hay tipo 2; 3 si hay de ambos; 1 si la factura no tiene ítems (`:2369-2377`). En un lote, si se mezclan, pasa a 3.
- Si el concepto no es 1, `FchServDesde` / `FchServHasta` son el primer y el último día del **período facturado** (`FACTURAS.PERIODO`); si el período no se puede convertir, del mes de la fecha de emisión (`:2398-2411`).
- `FchVtoPago` = primer vencimiento (`VTO1`) cuando el concepto es mayor a 1.
- `CbteFch` = fecha de emisión; moneda siempre `PES` con cotización 1.

**Importes** (`:2470-2481`; se excluyen ítems de tipo 1 subtipo 5)

| Campo AFIP | Cómo se calcula |
|---|---|
| `ImpNeto` | Σ precio sin IVA × cantidad de ítems sin impuesto asociado y con alícuota ≠ 0 |
| `ImpOpEx` | Ídem con alícuota 0 (excluye ítems de tipo 5) |
| `ImpTotConc` | Ítems de impuesto con `IMPUESTO.ORIGEN = 0` y subtipo 0 |
| `ImpTotal` | `TOTAL1 + IMP_ANTI` |
| `ImpIVA` | Σ de las alícuotas informadas |
| `ImpTrib` | Σ de los tributos informados |

Para las facturas y notas de crédito C (códigos 11 y 13) el exento se suma al neto y `ImpOpEx` queda en 0.

**Alícuotas de IVA** (`:2482-2515`): se toman los ítems de impuesto (tipo 4) que no son subtipo 0 ni 4, se agrupan por porcentaje y se cruzan con la tabla fija `GetAlicuotasAfip` (`:2856-2891`):

| Id AFIP | 3 | 4 | 5 | 6 | 8 | 9 |
|---|---|---|---|---|---|---|
| % | 0 | 10,5 | 21 | 27 | 5 | 2,5 |

Base = Σ `IMP_BI`, importe = Σ `PRE_VSI`. Se descartan las alícuotas con base e importe menores a 0,01; las que quedan en cero van al Id 3. Se redondea a 3 decimales al agrupar y luego a 2 antes de enviar.

**Tributos** (`:2516-2550`): ítems con impuesto de `ORIGEN ≠ 0` y subtipo 0 o 4. El Id del tributo es directamente `IMPUESTO.ORIGEN`; los ítems de subtipo 4 (percepciones) se envían con Id 3. Se agrupan por Id con alícuota, base, descripción e importe. La correspondencia está verificada en la segunda pasada y es incorrecta para municipales, nacionales y percepciones (ver §12.2).

**Ajustes finales antes de enviar** (`:2028-2069`)

- Todos los importes se redondean a 2 decimales.
- Si `ImpTotal ≤ 0,03` se manda todo como exento, sin IVA.
- Si `ImpTotal − (conceptos sumados)` da una diferencia positiva menor a 0,03, se suma al exento para que cierre.

**Factura de Crédito Electrónica MiPyME** (códigos 201 a 213, `:2436-2464`)

- `FchVtoPago` = primer vencimiento; se anula para las notas de crédito y para el 202.
- Opcional **2101** = CBU (parámetro 2431) y **2102** = alias (parámetro 2432), salvo en notas de débito y crédito (202, 203, 207, 208, 212, 213).
- Opcional **27** = `SCA` (transferencia por el sistema de circulación abierta) para 201, 206 y 211.
- Opcional **22** = `S`/`N` (anulación) en las notas de crédito 203, 208 y 213, según `RELACION_COMP.ANULACION`.

**Comprobantes asociados** (códigos 2, 3, 7, 8, 11, 12, 13, 202, 203, 207, 208, 212, 213, `:2551-2621`)

- Se informan como `CbtesAsoc` los comprobantes relacionados (`RELACION_COMP`) que tienen código AFIP, no son internos, son de clase 0, fueron autorizados con CAE (`TP_CODIGO = 2`) y no están marcados como `NOMOSTRAR`. El CUIT asociado es el de la empresa si la relación pide informar el CUIT del emisor; si no, el del receptor cuando tiene 11 dígitos.
- Si las relaciones existen pero ninguna fue autorizada con CAE, se envía `PeriodoAsoc`: desde el período mínimo de los relacionados (nunca antes del 02/01/2006) hasta fin de ese mes, recortado a la fecha de emisión.
- Para notas de débito y crédito A y B (2, 3, 7, 8) sin asociados, se envía siempre `PeriodoAsoc` con el período de la propia nota.

`ConsultaPreviaAutorizar(id_fac)` (`:1812-1825`) arma el mismo detalle sin enviarlo, para previsualizarlo.

### 3.5 Respuesta, errores y reintentos

Después de `FECAESolicitar` (`:2077-2137`):

- Por cada factura busca el detalle cuyo rango contiene su número. Con resultado `A`: graba `CAE`, `VTOCAE` (de `CAEFchVto`, formato `yyyyMMdd`) y `ID_BLO = GetIdBloqueo(...)`. Las observaciones se guardan en `ErrorCAE`, pero se toman del **primer** detalle de la respuesta, no del que corresponde a la factura.
- `GetIdBloqueo` (`:2188-2198`): si el parámetro **2769** está activo, la factura no se desbloquea del todo: hereda el menor `ID_BLO` de otras facturas bloqueadas de la misma cuenta con saldo; si no, queda en `null`.

| Código AFIP | Tratamiento |
|---|---|
| **10016** (número o fecha no es el próximo a autorizar) | Consulta con `FECompConsultar` si ese número ya está autorizado (caso típico: respuesta perdida). Si coincide el importe, lo toma como autorizado; si no, informa el último número autorizado según `FECompUltimoAutorizado`. |
| **10040** (problema con los comprobantes asociados) | Marca las relaciones como `NOMOSTRAR = 1` para que el próximo intento no las envíe. En modo solo electrónica borra las filas de `ELECTRONICA_RELCOMP`. También se aplica si 10040 llega como observación. |
| **10242 / 10243** (condición IVA del receptor) | Reintenta ese comprobante solo, sin agrupar y con `CondicionIVAReceptorId = 5` (consumidor final). |
| Otros | Concatena `Msg + "Cod:" + Code` en `ErrorCAE`. |

- Si el resultado de cabecera **no es `R`**, el método devuelve éxito (un resultado parcial `P` cuenta como OK).
- Si fue rechazado, el envío era agrupado y había más de un comprobante, **reintenta sin agrupar** los que siguen sin `VTOCAE` (`:2174-2177`).
- `ConsultarNumCom` (`:1062-1082`) arma el mensaje "El último comprobante fue el N".

### 3.6 Consultas auxiliares

- `ConsultarPuntosVenta` (`:1084-1114`): `FEParamGetPtosVenta`, filtrando los no bloqueados y sin fecha de baja.
- `ObtenerTabla` (`:1901-1943`): descarga las tablas paramétricas (comprobantes, monedas, IVA, conceptos, tributos, documentos, opcionales, países, condiciones IVA del receptor).
- `lstComprobantes` (`:516-549`): `FEParamGetTiposCbte` guardado en memoria; se usa para describir los comprobantes y validar los asociados en modo solo electrónica.
- Hay métodos del proxy que no se usan: `FEDummy`, `FECompTotXRequest`, `FEParamGetCotizacion`, `FEParamGetActividades`, `FECAEASinMovimientoConsultar/Informar` (`ReglasNegocio.WSFEV1/Service.cs`). El DTO de detalle ya tiene `Compradores` y `Actividades` (`FEDetRequest.cs:377-401`), pero nunca se completan.

### 3.7 Inconsistencias (conciliación contra AFIP)

`ConsultarInconsistencias(lista, modo)` (`:1602-1722`) procesa los IDs de a 2000 y, por cada comprobante, llama a `FECompConsultar`:

- Si AFIP devuelve error, lo guarda en `ErrorCAE`.
- Compara el CAE local con el de AFIP ("El número de CAE no coincide") y el total local (`TOTAL1 + IMP_ANTI`, sumando todo el rango si fue un lote) con `ImpTotal`, con tolerancia de 0,02.
- **Repara**: a todos los comprobantes del rango cuyo CAE difiere les copia el CAE y el vencimiento de AFIP, limpia el error y desbloquea (`:1740-1790`).
- Devuelve un texto con los comprobantes con error, distinguiendo individuales de lotes.

`ConsultarCAE` privado (`:1836-1899`): con resultado `A` y total coincidente (solo se controla en comprobantes individuales), toma el CAE; si era CAEA marca `COD_FAC = "P"` (informado). En la variante de `ELECTRONICA_FC` el mensaje de diferencia contiene un `{dif}` que nunca se reemplaza (`:1855`).

`EliminarFcElectronica` (`:562-575`) borra un comprobante de `ELECTRONICA_FC` solo si no tiene `VTOCAE`.

## 4. CAEA, CAI y CESP

### 4.1 Qué autorización recibe cada comprobante al emitirse

Al numerar un comprobante (`clsComprobante.cs:800-861`) se decide según `COMPPOS`:

```text
si COMPPOS.CAEA:
   buscar en CESPAFIP una fila con CAEA=1 y FEC_INI <= fecha <= FEC_FIN (y VTO_CESP <= hoy)
   si existe → CAE = CESPAFIP.CESP (el código CAEA), VtoCae = VTO_CESP, tipo = CAEA
   si no y COMPPOS.CAE → queda bloqueado para pedir CAE
si no, si COMPPOS.CAE → bloqueado (ID_BLO = -1), tipo = CAE
si no, si COMPPOS.CAI → CAE = COMPPOS.CAI_ACTUAL, VtoCae = VTO_CAI, tipo = CAI
si no, si el comprobante es de servicios públicos (SITIVA.CSP_DEF / SPU_DEF):
   buscar en CESPAFIP una fila con CAEA=0, FEC_INI <= fecha <= FEC_FIN y VTO_CESP >= hoy
   si existe → CAE = CESP, VtoCae = VTO_CESP, tipo = CESP
```

Los tipos de autorización son `CAI = 1, CAE = 2, CESP = 3, CAEA = 4` (`CapaNucleo/Tipo_Autorizacion.cs`) y quedan en `FACTURAS.TP_CODIGO`. El QR de la factura usa `tipoCodAut = "A"` cuando es CAEA y `"E"` en los demás casos (`clsFacturasImpresion.cs:948-980`).

La tabla **`CESPAFIP`** guarda entonces dos cosas distintas, diferenciadas por el flag `CAEA`: los **CESP** para liquidaciones de servicios públicos y los **CAEA** quincenales. Columnas usadas: `ID_CESP`, `CESP`, `FEC_INI`, `FEC_FIN`, `VTO_CESP`, `CAEA`.

### 4.2 CESP

En Procoop, el CESP es un código de autorización que AFIP otorga por un período para emitir las **liquidaciones de servicios públicos** (LQSP: los comprobantes definidos por situación IVA en `SITIVA.CSP_DEF` y `SPU_DEF`, ver `Nucleo.GetComprobantes_SP`, `CapaNucleo/Nucleo.cs:4947-4956`). Los comprobantes que lo usan no pasan por WSFE: se imprimen con el CESP vigente.

Validaciones:

- **Superposición de rangos** al cargar o editar un CESP: `ExisteCESPconFechas` (`clsFacturacionElectronica.cs:759-771`) y `ExisteCESPconFechasEXPT` (excluye el propio ID, `:773-785`). La condición detecta superposición solo si el inicio o el fin de un CESP existente cae dentro del rango nuevo; **no detecta** un CESP existente que contiene por completo al nuevo. Tampoco distingue CESP de CAEA. `CESPfechas` (`:787-799`) verifica si un ID tiene exactamente esas fechas.
- **Facturación masiva**: si algún servicio a facturar tiene `SERVICIO.LIQ_AFIP = 1`, tiene que existir un CESP con `FEC_INI ≤ hoy ≤ FEC_FIN` (`clsFacturacionMasiva.ValidarCESP`, `:275-288`). El usuario `SysAdmin` lo saltea.
- **Anulaciones**: misma regla para las facturas que se anulan (`clsAnulacionFacturas.ValidarCespLQSP`, `:1063-1077`).
- **Al iniciar**: aviso "No se han encontrado CESP activos para la liquidación de servicios públicos" (`Inicio_ProCoop.cs:1348-1351`).

Observación: la asignación en `clsComprobante` exige `VTO_CESP ≥ hoy`, pero las validaciones de masiva y anulación miran solo `FEC_INI`/`FEC_FIN`.

### 4.3 CAEA

- **Solicitud / consulta** (`ConsultarCAEA(periodo, orden)`, `clsFacturacionElectronica.cs:1116-1135`): período `yyyyMM` y orden (1 = primera quincena, 2 = segunda). Primero intenta `FECAEAConsultar`; si no hay CAEA, llama a `FECAEASolicitar`. El alta en `CESPAFIP` la hace la pantalla, que no está en el código descompilado.
- **Informe** (`InformarCAEA(periodo, orden, CAEA)`, `:1188-1224`): toma las facturas con `CAE = <CAEA>` y `COD_FAC ≠ "P"`, las agrupa por comprobante y punto de venta, las ordena y las informa en tandas de 100 con `AutorizaFacturas(agrupar, CAEA)`. Ese método convierte el request de CAE en `FECAEARequest` (agrega el CAEA a cada detalle) y llama a `FECAEARegInformativo` (`AutorizaFacturasCAEA`, `:1945-1979`). Lo informado queda con `COD_FAC = "P"`. Al final muestra la cantidad y el importe informado.
- **No implementado**: informar un CAEA sin movimiento (`FECAEASinMovimientoInformar` está en el proxy pero no se usa).

### 4.4 CAI

Los comprobantes con CAI (talonarios preimpresos) toman `COMPPOS.CAI_ACTUAL` y `VTO_CAI`; no hay interacción con web services.

## 5. Padrón de contribuyentes

| Servicio | Método | Uso encontrado |
|---|---|---|
| **Padrón A13** (`ws_sr_padron_a13`, URL fija `aws.afip.gov.ar/sr-padron/webservices/personaServiceA13`) | `GetCuilPersona(DNI)` → `getIdPersonaListByDocumento` (`clsFacturacionElectronica.cs:1137-1152`); `GetDatosPersona(cuil)` → `getPersona` (`:1154-1169`) | No se encontraron llamadas en el código descompilado. La respuesta trae apellido, nombre, razón social, domicilios, actividad principal, forma jurídica, estado de la clave, etc. (`ReglasNegocio.WSPA13/persona.cs`) |
| **Padrón PUC nivel 3** (`WSPN3`, URL fija `aws.afip.gov.ar/padron-puc-ws/...`) | `GetDatosContribuyente(cuit)` → `get(cuit, token, sign)`, devuelve un string (`:1171-1186`) | Validación del CUIT en el ABM de personas: si vuelve vacío muestra el error (`Configuracion/Configuracion.Forms/abm_Personas.cs:654-657`) |
| **Padrón A5 / constancia de inscripción** | — | **No existe** en Procoop |

Además del web service, Procoop tiene un **padrón offline** en la tabla `EMPAFIP`, que se carga desde el archivo de condición tributaria que publica AFIP (`clsImportacionArchivos.cs:24-115`). Es un archivo de ancho fijo: CUIT (11), razón social (30), condición de IVA en las posiciones 44-45 y monotributo en las 46-47. La conversión es:

```text
si monotributo <> "NI" → "MT"
si no, según IVA: "XN" → "EX", "AN" → "NA", vacío → "", otro → se copia (AC, NI, …)
COD_SIT = SITIVA cuyo COD_EMPAFIP coincide
```

Se usa para cruzar la condición IVA de proveedores (`clsInformes_Compras.cs:4177-4230`, con opción de actualizarla) y de titulares (`clsInformes_Titulares.cs:1087`, `:1117`), y para buscar un CUIT (`Impuestos.busca_cuit_afip`, `Impuestos.cs:156-158`; control de proveedores con el parámetro 218).

`ACTAFIP` es el catálogo de actividades AFIP. Se asigna al servicio del titular (`SERSOC.COD_ACT`, `clsInformes_Tecnica.cs:1906`) y se usa como filtro en cargos adicionales (`clsCargosAdicionales.cs:541`), pero **no se informa a WSFE**.

## 6. Carpetas IN/OUT (modo solo factura electrónica)

**Entrada** — `ChequearCarpetaIN(path)` (`clsFacturacionElectronica.cs:1226-1317`); carpeta en el parámetro 2082:

- Lee todos los `*.csv` sin cabecera, con el separador del parámetro **2497** (por defecto `;`).
- Cada fila tiene 46 columnas posicionales: tipo AFIP, punto de venta, número, fecha, importe, tipo y número de documento, concepto, servicio desde/hasta, moneda, cotización, no gravado, neto, exento, IVA, tributos, vencimiento de pago, nombre; hasta 3 alícuotas (base, importe, Id); hasta 3 tributos (base, alícuota, Id, descripción, importe); y opcionalmente marca de anulado, comprobante relacionado y fecha del relacionado (`:1237-1283`).
- El comprobante relacionado son 16 caracteres: 4 de tipo, 4 de punto de venta y 8 de número. El CUIT del relacionado es el de la empresa (parámetro 519) para los códigos 203 y 208, y el del cliente en los demás casos (`:1411-1429`).
- Si el comprobante ya existe pendiente y no se está procesando, lo reemplaza; si ya está autorizado, solo actualiza el archivo de origen (`:1430-1448`).
- Si todo se graba bien, **borra los archivos** de la carpeta (`:1296-1304`).

**Salida** — `ChequearCarpetaOUT(path)` (`:1532-1600`); carpeta en el parámetro 2083:

- Por cada archivo de origen con novedades, escribe `<nombre>_CAE.<ext>` con 8 columnas: tipo, punto de venta, número, fecha, importe, CAE, vencimiento del CAE y error.
- Marca el origen con el prefijo `EXP_` (exportado con CAE) o `ERR_` (exportado con error). Un `ERR_` se vuelve a exportar cuando se autoriza.

Armado del request para estos comprobantes (`GetDetRequest(ELECTRONICA_FC)`, `:2629-2854`): toma del archivo los importes, la moneda y cotización, el concepto y las fechas. Si el documento no es numérico usa el CUIT genérico con `DocTipo = 80`. Para FCE aplica las mismas reglas de opcionales; en la 202 el CUIT asociado es el de la empresa ("anulación MiPyME"). Si no hay asociados que AFIP reconozca, informa `PeriodoAsoc`.

No se encontró en el código descompilado quién llama a `ChequearCarpetaIN`/`OUT` (probablemente un formulario que no está entre los binarios relevados).

## 7. Mapeos a códigos AFIP

| Dato Procoop | Campo AFIP | Fuente |
|---|---|---|
| `COMPROB.COD_AFIP` (texto, se convierte a entero) | `CbteTipo` | Configurado a mano por comprobante; obligatorio para autorizar |
| `COMPROB.TIPO_SIT = 1` | `DocTipo = 80` (CUIT) | Comprobantes "A" |
| `DOCUMENT.COD_AFIP` | `DocTipo` | Tipo de documento de la persona |
| `SITIVA.AFIP_SIT` | `CondicionIVAReceptorId` | 0 = no se informa; 5 = consumidor final (forzado en reintentos); 6 = monotributo (`clsLibroIVA.Existe_SitIvaMonotributista`, `:2520-2523`) |
| `SITIVA.AFIP_SIT` (formateado a 2 dígitos) | Código de condición en la exportación RG 3685 (`"05"` consumidor final, `"07"` no categorizado) | `RG3685.cs:466`, `:500`, `:572-583` (corregido en segunda pasada: no es `SITIVA.COD_AFIP`) |
| `SITIVA.COD_AFIP` (texto) | Solo se usa en la carátula del libro IVA agrupada por tipo, en RG 3349 y en compras | `clsLibroIVA.cs:868`, `RG3349.cs:496`, `clsInformes_Compras.cs:1818` |
| `SITIVA.COD_EMPAFIP` | Código del padrón offline (`AC`, `EX`, `MT`, `NA`, …) | `EMPAFIP` |
| `ALI_IVA1` (%) | `AlicIva.Id` | Tabla fija `GetAlicuotasAfip` |
| `IMPUESTO.ORIGEN` | `Tributo.Id` | Mapeo directo (ver dudas) |
| Tipo de ítem 1/2 | `Concepto` 1/2/3 | Productos / servicios / ambos |

El código de barras del comprobante sigue el formato AFIP: CUIT + tipo (2) + punto de venta (4) + CAE + vencimiento (`Codigo_Varios_AFIP.cs:17`). El QR sigue el formato vigente (JSON en base64 sobre `https://www.afip.gob.ar/fe/qr/`, `clsFacturasImpresion.cs:948-980`).

## 8. Libro IVA Ventas

### 8.1 Criterios y tipos de informe

`clsLibroIVA` (`clsLibroIVA.cs:437-490`):

- **Criterio** (`CriterioEmisionLibroIVA`):
  - *Facturado*.
  - *Percibido*: para situaciones IVA con `SITIVA.PERCIBIDO`, se toma lo cobrado (`IT_PAGSO`) y lo refinanciado (`IT_RECCO`) en el período; las demás situaciones van por lo facturado (`:1124-1135`, `:1677-1730`). Es el criterio de devengamiento por cobro de los servicios públicos a no inscriptos.
  - *Facturado y percibido*: lo no cobrado va por facturado, lo cobrado parcialmente se prorratea por `SALDO/TOTAL1`, y se suman los cobros del período de facturas del período y del mes siguiente (`:1053-1119`).
  - *Cuotas facturadas vencidas*: prorratea cada factura por las cuotas de `TALONFAC` que vencen en el período (`:1270-1321`).
- **Fecha**: de emisión o de vencimiento.
- **Tipo de informe** (`TipoInforme`): tradicional (con variante para libro rubricado), IVA por alícuota, neto por alícuota, neto e IVA por alícuota, agrupado por tipo de factura (usa `TIPO_FAC.COD_TPFC_GRUPO_IVA` para reagrupar, `:505-529`), por actividad, percepciones y consumos relevantes (RG 3349).

### 8.2 Reglas de armado

`GetDetalle` (`:901-1051`):

- Solo comprobantes de clase 0. Se excluyen los comprobantes por defecto de "crédito/débito por prescripción de deuda" y los cobros en planillas de caja de prescripción (`:906-919`).
- Filtros por tipo de factura, comprobante, situación IVA, servicio, sucursal, interno o fiscal, solo créditos, localidad, grupo contable y titular activo. Facturación *mensual* = `FECHA ≠ VTO1`; *diaria* = `FECHA = VTO1` (`:971-982`).
- Signo: positivo si `COMPROB.DEB_CRE = 1`, negativo en los créditos.
- Por ítem de impuesto (tipo 4): subtipo 0 = no gravado / otros impuestos (por origen municipal, provincial, nacional, internos u otros); subtipo 1 = IVA alícuota 1 (con base `IMP_BI`); subtipo 2 = IVA alícuota 2; subtipo 4 = IVA 3 / percepción (`:1187-1268`).
- Se agrega una fila de cabecera por comprobante con `ESTADO = "A"` (sin importes).
- Parámetros: **544** (situación IVA "no categorizado"), **2972** "Separar ítems financiados en libro de IVA ventas", **3110** "Según lo percibido se informa el total del IVA del comprobante", **2325** (carátula por separado).

**Carátula** (`:768-855`): totales de débito y crédito, gravado e IVA por situación IVA y alícuota (`ALI_IVA_CF`). El crédito de las liquidaciones de servicios públicos se muestra aparte (columnas `_LQSP`). Se omiten las alícuotas en 0 y las filas sin gravado.

### 8.3 Exportaciones (`ExportarArchivos`, `:2463-2518`; `TipoArchivos.cs`)

| Flag | Régimen | Archivo / clase |
|---|---|---|
| `Regimen_1361` | RG 1361 – duplicados electrónicos | `RG1361.cs` |
| `Regimen_2177` | RG 2177 | Lanza `NotImplementedException` |
| `Regimen_3349` | RG 3349 – consumos relevantes | `RG3349.cs` |
| `Regimen_3571` / `Regimen_49_2019` | RG 3571 – rendición de comprobantes de servicios públicos (RCSP); la variante 49/2019 (RN 46/2019) incluye generadores | `rg_3571_ddMMyyyy_hhmmss.txt` / `rg_46_2019_ddMMyyyy.txt` (`RG3571.cs:556-562`) |
| `Regimen_3685` | RG 3685 – régimen de información de compras y ventas (mismo diseño que importa el Libro IVA Digital) | `REGINFO_CV_VENTAS_CBTE[_NO_INCLUIDOS]_yyyyMM.TXT` y `REGINFO_CV_VENTAS_ALICUOTAS…`; compras: `REGINFO_CV_COMPRAS_CBTE/ALICUOTAS…` (`RG3685.cs:268-361`) |
| `PercepcionSICORE` | Percepciones SICORE | `PercepcionSICORE.cs` |
| `Circular_70_2021` | ERSeP (Córdoba) | `CIR7021.cs` |

Reglas del archivo de ventas RG 3685 (`RG3685.cs:252-757`):

- Tipo con 3 dígitos; punto de venta con 5 (`00000` para los tipos 33, 99, 331 y 332); número con 20.
- Comprador: código 80 con el CUIT del titular si tiene 11 dígitos y la condición no es `05` ni `07`; si no, el documento de la persona. Con código 99 y total de hasta $1000, número 0. El nombre se trunca a 20 caracteres y se completa a 30.
- Moneda `PES`, tipo de cambio `0001000000`.
- La fecha es la de vencimiento si el parámetro **2692** está activo y el comprobante se filtró por vencimiento.
- Fecha de vencimiento de pago en ceros para los códigos 60, 61, 81, 82, 83, 201, 203, 206 y 208.
- Importes negativos para los créditos de los códigos 17, 18, 60, 61 y 99.
- Las percepciones de no categorizados se pasan a "percepción de impuestos nacionales" en el tipo 001.
- Código de operación: `N` (no gravado), `E` (exento) o espacio.
- Archivo de alícuotas: Id AFIP con 4 dígitos. Si hay alícuota pero el IVA es 0 y la base menor a $3, se informa `0003`.

## 9. Libro IVA Compras y Libro IVA Digital

- La exportación del libro de compras (`RG3685.Exportar_Compra`, `:336-361`) parte de `IVACOM`. En compras se usa punto de venta `00000` para los tipos 033, 331 y 332, y el CUIT del proveedor como identificación del vendedor (`:775-781`).
- **Comparación con AFIP** (`clsLibroIVAdigital.cs`): se importa el Excel de "Mis Comprobantes" (emitidos o recibidos) desde la tercera fila (`Importar_ComprobantesAfip`, `:395-462`). Columnas: fecha, tipo (`"<código> - <descripción>"`), punto de venta, número desde, número hasta, tipo y número de documento, denominación, tipo de cambio (formato `en-US`), moneda, neto gravado, no gravado, exento, IVA y total. Si el tipo contiene "Crédito", los importes se niegan.
- Se cruza contra el libro de ventas (`Comparar_LibroVenta`, `:301-314`, con datos de `FACTURAS`) o de compras (`Comparar_LibroCompras`, `:526-539`, con `IVACOM` y `FPALIC_IVA`), por código AFIP + punto de venta y número dentro del rango (`Comparar_Comprobantes`, `:464-524`).
- Resultado en tres informes:
  1. Comprobante inexistente en Procoop.
  2. Comprobante inexistente en AFIP.
  3. Diferencia de importe mayor a **$1** en neto, no gravado, exento, IVA o total.
- Si el total de Procoop es menor o igual a 0,03, todo se considera exento antes de comparar (`:492-498`).

## 10. Comprobantes de administración pública

`clsFacturacionVarios.cs:607-846` no tiene reglas impositivas ni llamadas a AFIP. Es un circuito de **agrupación y cobro** de las facturas de cuentas de organismos públicos (u otras cuentas que se liquidan en bloque):

- `Get_ComprobantesAdmPublica` (`:692-803`) lista las facturas impagas (`PAGA = ""`) de un período o fecha de emisión a partir de los consumos (`CONS_SER`, tipo de energía vacío o `A`). Filtros: empresa postal, cuenta, titular, tipo de factura, servicio y rango de vencimiento. Agrupa por factura y servicio, con consumo total, medidor y domicilio del suministro.
- `Guardar_ComprobantesAdministracionPublica` (`:646-690`) reemplaza la selección del período o de la fecha de emisión en la tabla `COMPROBANTES_ADM` (`ID_FAC`, `COD_SER`, `PERIODO`, `FECHA`, `USU_REG`). Lo hace con SQL armado por concatenación.
- `Get_ComprobantesAdmPublica_Guardado` (`:805-846`) da la vista para cobrar en caja: facturas impagas guardadas (o todas), filtrables por período, grupo contable y "recibos de empleados" (cuentas asociadas a legajos en `SU_EMPLEADOS_SUMSOC`, para descuento por recibo de sueldo).
- `Existe_PeriodoAdministracionPublica` / `Existe_FechaEmisionAdministracionPublica` (`:614-622`) avisan si ya hay una selección guardada.

## 11. Resumen de parámetros `Busca_V2_*`

| N° | Tipo | Descripción | Dónde se usa |
|---|---|---|---|
| 519 | Carácter | CUIT de la empresa | CUIT asociado en FCE, modo solo electrónica |
| 544 | Entero | Situación IVA "no categorizado" | Libro IVA |
| 726 | Lógica | Autorizar facturas en ARCA automáticamente | Agente |
| 727 | Lógica | Aguardar a que se registre en ARCA la factura | Venta, cobranza |
| 2071 | Carácter | Path del certificado ARCA | WSAA |
| 2072 | Carácter | URL WSAA | WSAA |
| 2073 | Carácter | URL WSFEv1 | WSFE |
| 2082 / 2083 | Carácter | Carpetas de entrada / salida | Modo solo electrónica |
| 2427 | Numérica | Importe máximo para autorizar comprobantes electrónicos | Uso no encontrado |
| 2431 / 2432 | Carácter | CBU / alias para FCE MiPyME | Opcionales 2101/2102 |
| 2497 | Carácter | Separador de los CSV (por defecto `;`) | Carpetas IN/OUT |
| 2692 | Lógica | Exportar IVA ventas digital según fecha del filtro | RG 3685 |
| 2712 | Numérica | Importe máximo para enviar facturas por lote (por defecto 5000) | Agrupación |
| 2769 | Lógica | Bloquear comprobantes de cuentas con otros comprobantes bloqueados | Desbloqueo después del CAE |
| 2780 | Lógica | No utilizar CUIT genérico para registrar facturas | Receptor |
| 2925 | Carácter / fecha | Vencimiento del certificado ARCA (se completa solo) | Aviso al iniciar |
| 2972 | Lógica | Separar ítems financiados en libro IVA ventas | Libro IVA |
| 3110 | Lógica | Percibido: informar el total del IVA del comprobante | Libro IVA |
| 217 / 218 | Lógica | Compras: página de ARCA si el certificado del proveedor venció / controlar proveedores con la base de ARCA | Compras |
| 2977 | Lógica | Compras: consultar el ingreso de CAE/CAI al cargar una factura | Compras |

## 12. Reglas adicionales (segunda pasada)

Revisión método por método de los proxies `ReglasNegocio.WSAA`, `WSFEV1`, `WSPA13`, `WSPN3` y de `clsFacturacionElectronica`, `clsLibroIVA`, `clsLibroIVAdigital` y `clsFacturacionVarios`. Solo se agrega lo que no estaba en las secciones 1 a 11.

### 12.1 Mapeo a códigos ARCA tal como lo implementa el código

**Cadena situación IVA → comprobante → `CbteTipo`.** El código ARCA del comprobante **no está fijo en el código**: sale de `COMPROB.COD_AFIP`, que se configura a mano por comprobante (no hay datos semilla de `COD_AFIP` para `COMPROB` en `CapaNucleo/clsDefault.cs`). El comprobante interno lo elige `clsComprobante.GetComprobanteOperacion` (`clsComprobante.cs:192-264`, detallado en el documento 02, §3.2): servicios con `LIQ_AFIP = 1` → `SITIVA.SPU_DEF` / `CSP_DEF`; comprobante del servicio (`COM_FAC` / `COM_CRE`); comprobante del tipo de factura; FCE MiPyME (`SITIVA.COM_*_MIPYME` si la cuenta es MiPyME y el importe supera el parámetro 2515); y por último `SITIVA.COM_DEF` / `CRE_DEF` / `DEB_DEF`. Lo que sí está fijo en el código es el **comportamiento según el código ARCA** ya configurado:

| Código(s) ARCA (`CbteTipo`) | Comportamiento fijo en Procoop | Cita |
|---|---|---|
| 6, 7, 8, 9, 10, 11, 12, 13, 15, 35, 40, 49, 61, 64 | Agrupables en lote (`CbteDesde..CbteHasta`, receptor 99/0), en ambos modos | `clsFacturacionElectronica.cs:1992-1996`, `:2208-2212` |
| 11, 13 (C) | El exento se suma al neto y `ImpOpEx = 0` (solo modo completo) | `:2477-2481` |
| 2, 3, 7, 8, 11, 12, 13, 202, 203, 207, 208, 212, 213 | Informa `CbtesAsoc` o `PeriodoAsoc` (modo completo) | `:2551-2621` |
| 2, 3, 7, 8, 202, 203, 207, 208, 212, 213 | Ídem en modo solo electrónica (no incluye 11, 12, 13) | `:2812-2847` |
| 2, 3, 7, 8 | `PeriodoAsoc` obligatorio con el período de la nota si no hay asociados | `:2602-2620` |
| 201, 202, 203, 206, 207, 208, 211, 212, 213 (FCE) | `FchVtoPago = VTO1`, anulado en créditos (`DEB_CRE = 2`) y en 202 | `:2436-2442` |
| 201, 206, 211 (FCE sin ND/NC) | Opcionales 2101 (CBU, parámetro 2431) y 2102 (alias, 2432). En modo completo se envían aunque estén vacíos; en modo solo electrónica solo si tienen valor | `:2443-2455`, `:2692-2710` |
| 201, 206, 211 | Opcional 27 = `SCA` | `:2456-2463` |
| 203, 208, 213 | Opcional 22 (anulación `S`/`N`) | `:2561-2569` |
| 202, 203, 208, 213 (solo electrónica) | Opcional 22 desde la columna "anulado" del CSV; `FchVtoPago` nulo; en 202 o anulación `S`, el CUIT asociado es el de la empresa | `:2797-2811` |
| 33, 99, 331, 332 / 60, 61, 81, 82, 83, 201, 203, 206, 208 / 17, 18, 60, 61, 99 | Solo en la exportación RG 3685: punto de venta `00000` / vencimiento de pago en ceros / importes negativos en créditos | §8.3 |

**Receptor (`DocTipo`, `CondicionIVAReceptorId`)**

| Dato Procoop | Código ARCA enviado | Observación |
|---|---|---|
| `COMPROB.TIPO_SIT = 1` | `DocTipo 80`, `DocNro = SOCIOS.CUIT` | Con DNI de 8 dígitos genera el CUIT (§3.4) |
| `DOCUMENT.COD_AFIP` | `DocTipo` | Semilla: Desconocido 99, DNI 96, LE 89, LC 90, Pasaporte 94, Cédula 91, CUIL 86, Interno 99, CUIT 80 (`clsDefault.cs:885`). Coinciden con la tabla de ARCA |
| `SITIVA.AFIP_SIT ≠ 0` | `CondicionIVAReceptorId` | Se copia tal cual (`clsFacturacionElectronica.cs:2424-2429`); 0 no se informa |
| Reintento por 10242/10243 | `CondicionIVAReceptorId = 5` | Fuerza consumidor final (`:2028-2032`) |

Valores semilla de `SITIVA.AFIP_SIT` en una base nueva (`clsDefault.cs:885`): responsable inscripto 1, responsable no inscripto 2, no responsable 3, **consumidor final 4**, **exento 5**, monotributo 6, no categorizado 7. En la tabla vigente de `FEParamGetCondicionIvaReceptor`, 4 es **sujeto exento** y 5 es **consumidor final**, y 2 y 3 ya no existen. O sea, con los valores semilla Procoop informa a los consumidores finales como exentos y a los exentos como consumidores finales. La propia exportación RG 3685 supone la convención de ARCA (trata `AFIP_SIT = 05` como consumidor final, `RG3685.cs:572`, `:583`), así que el semilla y el código no son coherentes entre sí. **[VERIFICAR]** los `AFIP_SIT` cargados en la base de Laguna Larga: si se corrigieron a mano, no hay problema.

**Alícuotas de IVA (`AlicIva.Id`)**

| % del ítem (`ITEMSFAC.POR_IMP`) | Modo completo | Modo solo electrónica | Libro IVA (columna) |
|---|---|---|---|
| 0 | No se informa (la tabla se cruza sin el 0 %) | Id 3, salvo que `ORIGEN` (archivo de origen) sea nulo | Exento / no gravado |
| 2,5 | 9 | Lo trae el CSV | "Otros" |
| 5 | 8 | Lo trae el CSV | "Otros" |
| 10,5 | 4 | Lo trae el CSV | 10,5 |
| 21 | 5 | Lo trae el CSV | 21 |
| 27 | 6 | Lo trae el CSV | 27 |
| Cualquier otro | **Se descarta en silencio** | Se descarta si no está en la tabla | "Otros" |

Fuentes: `clsFacturacionElectronica.cs:2482-2515`, `:2737-2767`, `:2856-2891`; `clsLibroIVA.cs:586-595`. Consecuencia: un ítem con un porcentaje que no esté en la tabla fija suma al total de la factura pero no a `ImpIVA`, el detalle no cierra y ARCA lo rechaza. La regla "las que quedan en cero van al Id 3" (§3.4) prácticamente no se da, porque antes se descartan las que tienen base e importe menores a 0,01 y el 0 % ni siquiera entra al cruce. **[VERIFICAR]** que todos los `POR_IMP` de IVA configurados en la cooperativa estén en la tabla. En modo solo electrónica las alícuotas solo se informan si `ImpNeto ≠ 0`, y se descartan las de importe 0 que no sean Id 3 (`:2737`, `:2765`).

### 12.2 Tributos: conclusión sobre el mapeo de Id

Se verificó la duda abierta 1:

- El enum que da significado a `IMPUESTO.ORIGEN` es `clsLibroIVA.OrigenImpuesto` (`clsLibroIVA.cs:475-482`): 0 otros, 1 municipal, 2 provincial, 3 nacional, 4 internos. Se usa igual en el libro IVA (`:1263-1267`, `:1501-1505`), en RG 1361 (`RG1361.cs:270-272`), en RG 3685 por ítems (`RG3685_ITEMS.cs:429-433`) y en RG 3685 (`RG3685.cs:613-617`; ahí las percepciones de no categorizados se pasan a `OrigenImpuesto.Nacional`). No hay ninguna pantalla ni dato semilla que use otra convención.
- `GetDetRequest` envía `Tributo.Id = ORIGEN` (subtipo 0) o 3 fijo (subtipo 4 = `Percepcion_IVA` según `CapaNucleo/Facturacion_SubTipos_ImpuestoIVA.cs`) (`clsFacturacionElectronica.cs:2516-2534`).

| `ORIGEN` en Procoop | Subtipo | Qué envía | Significado en ARCA (`FEParamGetTiposTributos`) | ¿Correcto? |
|---|---|---|---|---|
| 0 otros | 0 | Va a `ImpTotConc` (no gravado), no como tributo | — | Discutible: un impuesto "otro" se informa como concepto no gravado |
| 0 otros | 4 | Nada: ni IVA, ni tributo, ni no gravado | — | No: el importe solo cierra si la diferencia es menor a 0,03 |
| 1 municipal | 0 | Id 1 | Impuestos nacionales | **No** (debería ser 3) |
| 2 provincial | 0 | Id 2 | Impuestos provinciales | Sí |
| 3 nacional | 0 | Id 3 | Impuestos municipales | **No** (debería ser 1) |
| 4 internos | 0 | Id 4 | Impuestos internos | Sí |
| 1 a 4 | 4 (percepción IVA) | Id 3 | Impuestos municipales | **No** (debería ser 6, percepción de IVA, o 13 si el receptor es no categorizado) |

Nunca se envían los Id 5 (ingresos brutos), 7 (percepción de IIBB), 8 (percepciones municipales), 9 (otras percepciones) ni 99 (otros). Además, la segunda agrupación es solo por Id (`:2539-2548`): una percepción y un impuesto nacional terminan fusionados en un único tributo Id 3, con la alícuota y la descripción del primero.

**Conclusión**: es un defecto del código, no una convención distinta de los datos. Si una base tuviera los orígenes "invertidos" para que el WSFE informe bien, el libro IVA y las exportaciones RG 1361 / RG 3685 mostrarían mal los impuestos municipales y nacionales. ARCA no rechaza estos comprobantes porque solo valida que el Id exista y que la suma coincida con `ImpTrib`; el error es de clasificación informativa y se ve en "Mis Comprobantes" y en el Libro IVA Digital del receptor. En el modo solo electrónica el Id lo trae el CSV (`TIPO_TRIB`), así que ahí el mapeo es responsabilidad del sistema de origen (`:2768-2795`). **[VERIFICAR]** los `IMPUESTO.ORIGEN` y subtipos de los impuestos que factura Laguna Larga: si solo tiene provinciales e internos sin percepciones de IVA, el impacto es nulo. Para GoodApps vale la recomendación 7.

### 12.3 `clsFacturacionElectronica`: métodos y detalles no documentados

- **`Get_ComprobantesRelacionados(id_factura)`** (`:1464-1530`), solo modo solo electrónica: devuelve los comprobantes relacionados de una fila de `ELECTRONICA_FC`. Junta las filas propias de `ELECTRONICA_RELCOMP` y, si el campo `COMPROB_RELACION` (16 caracteres: tipo, punto de venta y número) tiene valor, también las filas de `ELECTRONICA_RELCOMP` de **cualquier** comprobante que apunten a ese mismo relacionado (mismo tipo, punto de venta y número), sin repetir. Describe cada uno con el texto de `FEParamGetTiposCbte`. Usa el ticket en memoria **sin llamar a `CargarTicket`**: si todavía no se cargó, la excepción se registra y devuelve la lista vacía.
- **`ObtieneCertificadoDesdeArchivo`** (`:438-450`): ante cualquier error al importar el certificado lanza una excepción con la ruta del archivo y la traza, que se muestra como "Error FIRMANDO el LoginTicketRequest". `FirmaBytesMensaje` (`:421-436`) antepone "***Error al firmar".
- **`ImportarElectronicaFC`** (privado, `:1318-1462`): graba hasta 3 alícuotas y 3 tributos por comprobante, y solo si el tipo (`TIPOIVA*`, `TIPO_TRIB*`) es distinto de 0. El campo "anulado" se guarda recortado y en mayúsculas. Todo el lote se graba en un único `SubmitChanges`; si falla, no se borra ningún CSV.
- **`AutorizaElectronicas`** (privado, `:2201-2347`): a diferencia del modo completo, **no maneja** los errores 10242/10243 (no reintenta con consumidor final) y ante el 10040 borra las relaciones del comprobante y no le escribe ningún error. Las observaciones de un comprobante aprobado también se toman del primer detalle de la respuesta.
- **Respuesta de `ConsultarInconsistencias`** (privados, `:1724-1800`): si difieren el CAE y el importe, el mensaje del importe **reemplaza** al del CAE en lugar de sumarse (`:1738`, `:1771`). El texto rotula el total local como "Total en PWIF".
- **`ConsultaPreviaAutorizar`** (`:1812-1825`) arma el detalle con código ARCA 0: la vista previa no aplica las reglas que dependen del código (C, FCE, asociados).
- **`ConsultarCAE(tipo, punto de venta, número)`** público (`:1802-1810`) también usa el ticket en memoria sin cargarlo.
- **Factura C con total muy bajo**: el ajuste "total ≤ 0,03 → todo exento" y el de cierre "diferencia < 0,03 al exento" (`:2057-2068`) se aplican **después** de pasar el exento al neto en los códigos 11 y 13, así que pueden dejar `ImpOpEx ≠ 0` en una factura C, cosa que ARCA no acepta para la clase C. Tampoco anulan `ImpTrib` ni `ImpTotConc` cuando fuerzan todo a exento. **[VERIFICAR]** solo si la cooperativa emite comprobantes C.
- **CAEA**: `AutorizaFacturasCAEA` (`:1945-1979`) copia el detalle de CAE al de CAEA por reflexión, así que **nunca informa `CbteFchHsGen`** (fecha y hora de generación, campo exclusivo de `FECAEADetRequest.cs:32`).

### 12.4 Proxies SOAP: qué se usa realmente

Todos los proxies son clases generadas por `wsdl.exe` (`SoapHttpClientProtocol`). Procoop llama siempre a las variantes **sincrónicas**; ninguna variante `*Async`, `CancelAsync` ni evento `*Completed` se usa.

**WSAA** (`ReglasNegocio.WSAA/LoginCMSService.cs`): solo `loginCms(CMS en base64)` (`:71-74`), con la URL del parámetro 2072 (`clsFacturacionElectronica.cs:352-355`). El constructor apunta por defecto a homologación (`:55-67`).

**WSFEv1** (`ReglasNegocio.WSFEV1/Service.cs`):

| Operación | Desde | Campos de entrada usados | Campos de respuesta usados |
|---|---|---|---|
| `FECAESolicitar` (`:158`) | `AutorizaFacturas`, `AutorizaElectronicas` | Cabecera: `CantReg`, `CbteTipo`, `PtoVta`. Detalle: `Concepto`, `DocTipo`, `DocNro`, `CbteDesde`, `CbteHasta`, `CbteFch`, `ImpTotal`, `ImpTotConc`, `ImpNeto`, `ImpOpEx`, `ImpIVA`, `ImpTrib`, `FchServDesde`, `FchServHasta`, `FchVtoPago`, `MonId`, `MonCotiz`, `CondicionIVAReceptorId`, `Iva[]` (`Id`, `BaseImp`, `Importe`), `Tributos[]` (`Id`, `Desc`, `BaseImp`, `Alic`, `Importe`), `CbtesAsoc[]` (`Tipo`, `PtoVta`, `Nro`, `Cuit`, `CbteFch`), `PeriodoAsoc`, `Opcionales[]` (`Id`, `Valor`) | `FeCabResp.Resultado`; `FeDetResp[]`: `CbteDesde`, `CbteHasta`, `Resultado`, `CAE`, `CAEFchVto`, `Observaciones[]` (`Code`, `Msg`); `Errors[]` (`Code`, `Msg`) |
| `FECAEARegInformativo` (`:303`) | `AutorizaFacturasCAEA` | Ídem más `CAEA` | Ídem, con `CAEA` en lugar de `CAE` |
| `FECompConsultar` (`:274`) | Consultas, inconsistencias, error 10016 | `CbteTipo`, `PtoVta`, `CbteNro` | `ResultGet`: `Resultado`, `CodAutorizacion`, `FchVto`, `ImpTotal`, `CbteDesde`, `CbteHasta`; `Errors` |
| `FECompUltimoAutorizado` (`:245`) | `ConsultarNumCom` | `PtoVta`, `CbteTipo` | `CbteNro`, `Errors` |
| `FECAEAConsultar` / `FECAEASolicitar` (`:419`, `:332`) | `ConsultarCAEA` | Período `yyyyMM`, orden | `ResultGet` completo (lo usa la pantalla) |
| `FEParamGetPtosVenta` (`:622`) | `ConsultarPuntosVenta` | — | `Nro`, `Bloqueado = "N"`, `FchBaja = "NULL"` |
| `FEParamGetTiposCbte`, `TiposMonedas`, `TiposIva`, `TiposConcepto`, `TiposTributos`, `TiposDoc`, `TiposOpcional`, `TiposPaises`, `CondicionIvaReceptor` | `ObtenerTabla`, `lstComprobantes`, `Get_ComprobantesRelacionados` | `FEParamGetCondicionIvaReceptor` se llama con clase de comprobante nula (todas) | `Id`, `Desc` (y vigencia en opcionales) |

Campos del contrato que **nunca se completan**: `CanMisMonExt` (`FEDetRequest.cs:292`), `Compradores`, `Actividades` y `CbteFchHsGen`. `CanMisMonExt` solo importa con moneda extranjera, que únicamente puede llegar por el CSV del modo solo electrónica (**[VERIFICAR]** si la cooperativa usa ese modo con moneda distinta de `PES`). Operaciones generadas pero sin uso: `FEDummy`, `FECompTotXRequest`, `FEParamGetCotizacion`, `FEParamGetActividades`, `FECAEASinMovimientoConsultar` y `FECAEASinMovimientoInformar`.

**Padrón A13** (`ReglasNegocio.WSPA13/PersonaServiceA13.cs`): `getIdPersonaListByDocumento(token, sign, cuitRepresentada, documento)` (`:110`) y `getPersona(token, sign, cuitRepresentada, idPersona)` (`:140`); el CUIT representado es el que se leyó del ticket. `dummy` no se usa.

**Padrón PUC nivel 3** (`ReglasNegocio.WSPN3/ContribuyenteNivel3SelectServiceImplService.cs`): solo `get(cuit, token, sign)` (`:74`), que devuelve un texto sin tipar; no se informa el CUIT representado. Es el único cliente sin timeout explícito (`clsFacturacionElectronica.cs:509-514`). `dummy` no se usa.

Métodos sin regla de negocio (proxies, revisados): `LoginCMSService.loginCmsAsync` (2), `LoginCMSService.CancelAsync`; en `Service`, todas las variantes `*Async` de `FECAESolicitar`, `FECompTotXRequest`, `FEDummy`, `FECompUltimoAutorizado`, `FECompConsultar`, `FECAEARegInformativo`, `FECAEASolicitar`, `FECAEASinMovimientoConsultar`, `FECAEASinMovimientoInformar`, `FECAEAConsultar`, `FEParamGetCotizacion`, `FEParamGetTiposTributos`, `FEParamGetTiposMonedas`, `FEParamGetTiposIva`, `FEParamGetTiposOpcional`, `FEParamGetTiposConcepto`, `FEParamGetPtosVenta`, `FEParamGetTiposCbte`, `FEParamGetCondicionIvaReceptor`, `FEParamGetTiposDoc`, `FEParamGetTiposPaises`, `FEParamGetActividades`, más `Service.CancelAsync` y las sincrónicas `FEParamGetTiposMonedas`, `FEParamGetTiposIva`, `FEParamGetTiposOpcional`, `FEParamGetTiposConcepto`, `FEParamGetTiposDoc` y `FEParamGetTiposPaises` (solo descargan tablas); `PersonaServiceA13.dummy`, `dummyAsync` (2), `getIdPersonaListByDocumentoAsync` (2), `getPersonaAsync` (2), `CancelAsync`; `ContribuyenteNivel3SelectServiceImplService.getAsync` (2), `dummy`, `dummyAsync` (2), `CancelAsync`.

### 12.5 `clsLibroIVA`: armado de informes

- **`Get_Reporte(filtros)`** (`:491-503`): elige el diseño de reporte según el tipo de informe (el tradicional tiene variante "rubricado") y la carátula (`Facturacion_LibroIVA_Caratula_Tipo` solo para el agrupado por tipo de factura). En el agrupado por tipo, antes reasigna el tipo de factura según `TIPO_FAC.COD_TPFC_GRUPO_IVA` (`ActualizarTiposSegunGrupo`, `:505-529`).
- **`Get_ReporteDatasource(detalle, filtros, extra)`** (`:531-756`): primero arma la lista de comprobantes (con los IDs de ítems financiados y de pagos) que después usan las exportaciones. Luego agrupa según el tipo de informe:
  - *Tradicional*: por comprobante, con no gravado, exento, gravado, IVA 1/2/3 y total, más la condición fiscal (`RES_SIT`).
  - *Por alícuota* (IVA, neto o ambos) y *agrupado por tipo*: separa IVA y gravado en columnas **10,5 %, 21 %, 27 % y "otros"** (cualquier otro porcentaje, incluidos 2,5 % y 5 %), y marca intereses por vencimiento y facturación diaria.
  - *Por actividad*: agrupa por actividad del rubro del producto o servicio ("OTROS" si no tiene) y situación IVA, con las mismas columnas por alícuota.
  - *Percepciones*: por cuenta, CUIT, nombre, domicilio y comprobante; el importe de percepción es **solo el IVA 3** (subtipo 4). Las percepciones de ingresos brutos u otros tributos no aparecen.
  - *Consumos relevantes*: delega en `RG3349.Get_Detalle_Exportar`. Hay un segundo bloque idéntico inalcanzable (`:732-754`).
- **`Get_ReporteCaratula(detalle, tipo)`** (`:757-766`): sin carátula para consumos relevantes; para el agrupado por tipo, totales por situación IVA, tipo de factura, débito/crédito, comprobante y `SITIVA.COD_AFIP` (`:857-899`); en los demás, la carátula general de §8.2. En la general, la descripción de la alícuota sale de `ALI_IVA_CF` cruzando la situación IVA con `POR_IVA` (IVA 1), `POR_IVA2` (IVA 2) o `PER_IVA` (percepción).
- **`Info_Archivo.GetComprobantesFiltroVto`** (`:417-426`): devuelve los comprobantes marcados con `FiltradoXVto`, que alimentan la regla del parámetro 2692 en RG 3685 (`RG3685.cs:674`). En todo el código descompilado **nadie asigna `FiltradoXVto = true`**, así que la lista siempre está vacía y el parámetro 2692 no tiene efecto. **[VERIFICAR]** si 2692 está activo en la base (si lo está, el usuario espera un comportamiento que no ocurre).

Métodos sin regla de negocio: `Get_ComboOrden` (no ordenar; tipo y número; fecha, tipo y número; fecha y número), `Get_ComboFacturacion` (todos / solo mensual / solo diaria, cuyo criterio está en §8.2).

### 12.6 `clsLibroIVAdigital`: informes y detalles de la comparación

- **Informes** (`Get_Informe_ComprobantesNoAfip`, `Get_Informe_ComprobantesNoProcoop`, `Get_Informe_ComprobantesDiferencia`, `:188-299`), cada uno con una variante para el libro de ventas y otra para el de compras:
  - *No registrados en ARCA* (`TipoError.ComprobanteInexistenteAFIP`): comprobantes de Procoop con fecha, vencimiento, CUIT, cuenta, CAE, denominación e importes de Procoop, incluida la percepción.
  - *No registrados en Procoop*: filas del archivo de ARCA con sus importes.
  - *Con diferencias*: importes de ambos lados.
  - Parámetros del reporte: tipo de fecha y rango. En compras el tipo de fecha se fija en "Emisión".
- **Total de Procoop en ventas** (`Get_ComprobantesVenta`, `:316-393`): no se toma `TOTAL1`; se recalcula como exento + gravado + no gravado + **IVA 1** + IVA 3 (percepción). El **IVA 2** (subtipo 2) no se suma ni se compara, así que un comprobante con dos alícuotas aparece con diferencia de IVA y de total. **[VERIFICAR]** si la cooperativa factura ítems con alícuota 2. Se excluyen los comprobantes internos. Si algún `COMPROB.COD_AFIP` no es numérico, falla todo el lote y devuelve "Ha ocurrido una inconsistencia al consultar los comprobantes".
- **Compras** (`Get_ComprobantesCompra`, `:541-615`): gravado, no gravado y exento de `IVACOM`; IVA = suma de `FPALIC_IVA.IMP_IVA` **sin aplicar el signo** de la nota de crédito, mientras que el total sí se niega para créditos. Las notas de crédito de compras pueden mostrar diferencia de IVA.
- **Comparación** (`Comparar_Comprobantes`, `:464-524`): el IVA de ARCA se compara solo contra el IVA 1 de Procoop; la percepción no se compara.

### 12.7 `clsFacturacionVarios`: talones sumados, configuración de impuestos y otros

Esta clase no tiene relación con ARCA; se documenta acá porque es su archivo.

- **`Get_ConceptosIntereses`** (`:252-262`): lista `CONCEPTOS_INT` (base del interés por mora, documento 04) indicando si el concepto es producto, impuesto o servicio y el tipo de interés: `TIPO` nulo o 0 = entre vencimientos, 1 = mora, otro = ambos (enum `Tipo_ConceptoIntereses`, `:242-250`).
- **`Get_TalonesSumados(filtros)`** (`:264-494`): consulta los **talones sumados** (filas de `TALONFAC` con `CUOTA = 0`, un talón de pago que agrupa varias facturas) en tres modos: por talón (número y rango por fecha de alta o vencimientos 1 a 3), por factura (comprobante y fecha de la factura, y devuelve los talones completos que la contienen) y eliminados (`TALONFAC_HST`). El talón figura como pagado solo si **todas** sus facturas tienen `PAGA = "P"`. Defectos: el filtro "hasta" se aplica cuando hay fecha "desde" y falla si falta la fecha "hasta" (`:295-298`, `:323-326`), y el valor por defecto de la fecha toma el `VTO4` del talón incluso en el modo por factura.
- **`Eliminar_Talon(numero)` / `Eliminar_Talon(lista)`** (`:496-528`): no borra de forma definitiva: copia cada fila a `TALONFAC_HST` con usuario y fecha del servidor (`USU_MOD`, `FEC_MOD`) y luego la borra de `TALONFAC`. La variante de lista lo hace en una sola transacción y revierte todo si falla uno. El parámetro 2360 "Permitir eliminar talones sumados" lo controla la pantalla de caja (documento 05).
- **`Guardar_Impuestos_x_Categoria` / `Cargar_Configuracion`** (`:547-605`): `IMPUESTOS_X_CAT` guarda, por servicio e impuesto, la **selección de productos y servicios del informe "Impuestos facturados por categoría"** (`clsInformes_Facturacion.cs:5216-5232`, `:6100-6122`), como listas de códigos separadas por coma. No es una regla de cálculo de la factura; esto responde la duda del documento 01 sobre esa tabla. La llamada que guarda pasa las listas en orden inverso al de la consulta del informe (`:6101` contra `:6121`) **[VERIFICAR]** en pantalla si productos y servicios se recuperan cruzados.
- **`Eliminar_ComprobantesAdministracionPublica(lista)`** (`:624-644`): borra de `COMPROBANTES_ADM` las facturas elegidas (por `ID_FAC`) dentro de una transacción.
- **Defecto en `Guardar_ComprobantesAdministracionPublica(…, fechaEmision)`** (`:669-690`): el borrado previo arma la fecha con `ToShortDateString()` **sin comillas** en el SQL, así que el servidor la evalúa como una división y no borra la selección anterior de esa fecha; los nuevos registros se insertan igual y pueden quedar duplicados.

Métodos sin regla de negocio: `Get_InfoPago` (pagos de las facturas de un talón: comprobante de caja, número y usuario de caja, recibo, fechas, entrega y banco), `Get_ComprobantesAdministracionPublica(periodo)` (IDs guardados del período).

---

## Implicancias para GoodApps

**Contexto normativo.** Desde fines de 2024 AFIP se llama **ARCA** (Agencia de Recaudación y Control Aduanero, Decreto 953/2024). Los web services no cambiaron de protocolo y siguen publicados bajo los dominios `*.afip.gov.ar` / `afip.gob.ar`. Para GoodApps son relevantes:

- **WSAA** (`LoginCms`): obligatorio para todos los servicios. El ticket dura alrededor de 12 h; ARCA rechaza pedir otro mientras el vigente no venza ("el CEE ya posee un TA válido"), así que el caché es obligatorio.
- **WSFEv1**: vigente y suficiente para facturas, notas de débito y crédito A/B/C/M, FCE MiPyME y CAEA. Ya incluye `CondicionIVAReceptorId` (RG 5616) y los arrays `Actividades` y `Compradores`.
- **WSMTXCA** (con detalle de ítems) y **WSFEXv1** (exportación): no los usa Procoop. Para cooperativas de servicios no son necesarios salvo casos puntuales.
- **Padrón**: `ws_sr_padron_a13` sigue disponible. La consulta de condición fiscal recomendada hoy es `ws_sr_constancia_inscripcion` (reemplazo del A5). El padrón PUC "nivel 3" (`WSPN3`) que usa Procoop es un servicio heredado: confirmar si sigue vivo antes de replicarlo; lo más probable es que haya que reemplazarlo.
- **Libro IVA Digital** (RG 4597) reemplazó al régimen CITI (RG 3685), pero conserva el diseño de importación de comprobantes y alícuotas: la lógica de exportación de Procoop sigue sirviendo como referencia.

**Recomendaciones de diseño**

1. **Certificados por tenant**: guardar PFX y clave en un almacén seguro (KMS / secret manager), no en una carpeta compartida. Registrar el vencimiento (como el parámetro 2925) con alertas a 30, 14, 7 y 3 días. Soportar homologación y producción por tenant con URLs configurables, en lugar de dejar el padrón fijo en producción como Procoop.
2. **Caché del ticket** por (CUIT, servicio, ambiente), con renovación anticipada y bloqueo distribuido para que dos workers no pidan ticket a la vez. El `uniqueId` tiene que ser único de verdad (por ejemplo, basado en la hora), no un contador que vuelve a 0 en cada proceso.
3. **Cola de autorización** en lugar de `ID_BLO = -1` + *polling*: estados explícitos (pendiente → enviando → autorizado / rechazado / a conciliar), un worker por (CUIT, tipo de comprobante, punto de venta) que serialice la numeración, y tandas de hasta el máximo de `CantReg` que permita ARCA. Conservar las reglas de Procoop que funcionan:
   - no autorizar si hay un número anterior pendiente;
   - exigir numeración correlativa;
   - ante el error 10016 o un timeout, consultar con `FECompConsultar` antes de reintentar;
   - comparar el total con tolerancia de 0,02.
4. **Lotes B/C**: ARCA permite agrupar comprobantes B a consumidor final por debajo de un monto. Hacerlo configurable y verificar el tope vigente (en Procoop, 5000 por defecto, desactualizado por la inflación).
5. **Condición IVA del receptor**: es obligatoria según la RG 5616. Mapear la situación IVA de GoodApps al catálogo de `FEParamGetCondicionIvaReceptor` y no depender del reintento forzando "consumidor final", que puede informar mal a un receptor exento o monotributista.
6. **Importes**: trabajar en decimal, no en `double` como el proxy de Procoop. Reproducir los ajustes de cierre (diferencias menores a 0,03 al exento) y el tratamiento de las facturas C (sin IVA, el exento va al neto).
7. **Tributos**: armar una tabla de mapeo explícita entre el impuesto de GoodApps y el Id de `FEParamGetTiposTributos` (1 nacionales, 2 provinciales, 3 municipales, 4 internos, 99 otros, más los códigos específicos de percepciones). No copiar el mapeo directo de Procoop por `ORIGEN`.
8. **CAEA**: implementar solicitud por quincena, asignación offline, informe en tandas y también el **informe sin movimiento**, que Procoop no tiene. Verificar las restricciones vigentes de ARCA sobre el uso del CAEA (hay normativa que lo limita a contingencia).
9. **CESP / LQSP**: si las cooperativas siguen emitiendo liquidaciones de servicios públicos con CESP, modelarlo como "autorización por rango de fechas" separada del CAEA, con validación de superposición correcta (que contemple el caso de contención) y el mismo criterio de vigencia en la emisión, la facturación masiva y la anulación.
10. **Padrón**: ofrecer autocompletado de razón social, domicilio y condición IVA al dar de alta titulares y proveedores con A13 / constancia de inscripción. Mantener opcional un padrón offline masivo (equivalente a `EMPAFIP`) para el control periódico de proveedores y titulares.
11. **Libro IVA**: soportar los cuatro criterios (facturado, percibido, mixto, cuotas vencidas); el percibido es clave para servicios públicos a no inscriptos. Generar el TXT del Libro IVA Digital (ventas y compras con alícuotas) y la conciliación contra "Mis Comprobantes", idealmente consumiendo la descarga actual en CSV de ARCA en lugar del Excel posicional.
12. **Modo pasarela**: el modo "solo factura electrónica" de Procoop (CSV de entrada y salida) muestra que hay cooperativas que autorizan comprobantes de otros sistemas. En GoodApps conviene exponerlo como API o importación, no como carpetas compartidas.
13. **QR y código de barras**: mantener el QR (RG 4892) y el código de barras según el diseño vigente, con `tipoCodAut` = `A` para CAEA y `E` para CAE.

## Dudas abiertas

1. **Mapeo de tributos** (resuelta en la segunda pasada, ver §12.2): el código usa la misma convención de `IMPUESTO.ORIGEN` (1 municipal, 2 provincial, 3 nacional, 4 internos) en todo Procoop y envía ese número como `Tributo.Id`, así que los municipales y nacionales viajan cruzados y las percepciones de IVA se informan como "impuestos municipales". Es un defecto del código, no otra convención de datos. Solo queda **[VERIFICAR]** qué orígenes tienen los impuestos cargados en la base de Laguna Larga para medir el impacto.
2. **CESP**: confirmar con una cooperativa qué norma y procedimiento siguen hoy para las liquidaciones de servicios públicos (tipos 17/18 y RG 3571/RCSP), si el CESP sigue vigente con ARCA y quién lo solicita y carga en `CESPAFIP` (la pantalla no está en el código relevado).
3. **CAEA al emitir**: `clsComprobante.cs:824-826` exige `VTO_CESP <= hoy` para usar un CAEA, al revés que para el CESP (`>= hoy`). ¿Es un error del código o `VTO_CESP` tiene otro significado para los CAEA (por ejemplo, la fecha tope de informe)?
4. **Parámetro 2427** (importe máximo para autorizar): no se encontró su uso. ¿Lo usa una pantalla que no está decompilada?
5. **Padrón A13**: `GetCuilPersona` y `GetDatosPersona` no tienen llamadas visibles. ¿Se usan desde formularios no relevados o es código muerto?
6. **Llamadas a `ChequearCarpetaIN/OUT`**: no se encontraron. ¿Qué proceso las ejecuta en el modo solo electrónica (el agente o un formulario) y con qué frecuencia?
7. **Fila de cabecera con `ESTADO = "A"`** en el libro IVA (`clsLibroIVA.cs:1155-1185`): ¿"A" significa anulado? Confirmar cómo se presentan los anulados en el libro.
8. **Errores 10040 / 10242 / 10243**: el tratamiento está claro, pero conviene validar el texto actual de esos códigos en la tabla de errores de WSFEv1, porque ARCA los fue redefiniendo con la RG 5616.
9. **Posibles defectos a no replicar** (confirmar si afectan en producción):
   - `RegistrarRel_Comp` convierte punto de venta y número a `Int16` (`clsFacturacionElectronica.cs:581-582`): falla con números mayores a 32767.
   - En la importación CSV, la verificación de duplicados de comprobantes relacionados compara `SUC_COM != suc_com` (`:1419`) en lugar de `==`.
   - `GetDetRequest(ELECTRONICA_FC)` evalúa `CbtesAsoc.Any()` aunque `CbtesAsoc` pueda ser nulo (`:2827`).
   - En la comparación con "Mis Comprobantes", `Enumerable.Range(desde, hasta)` usa el número "hasta" como cantidad (`clsLibroIVAdigital.cs:169`).
   - Cuando el ticket trae varias relaciones, se toma la segunda como CUIT representado (`clsFacturacionElectronica.cs:398-401`).
10. **Topes y fechas de ARCA**: confirmar al momento de implementar el tope vigente para agrupar comprobantes B, el monto desde el cual es obligatorio identificar al consumidor final, la obligatoriedad efectiva de `CondicionIVAReceptorId` y las restricciones al CAEA. Todos estos valores cambiaron en los últimos años.
