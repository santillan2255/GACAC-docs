# 05 — Cobranzas, cajas y entes recaudadores

Reglas de negocio de la cobranza de Procoop 10.4.6.722 extraídas del código descompilado. Cubre la caja de ventanilla, la registración del recibo y la imputación a la deuda, la anulación, los entes recaudadores (archivos de envío de deuda y de rendición de pagos), el débito automático y los pagos online. Al final hay una tabla por cooperativa, el detalle de Laguna Larga (LAG), los parámetros relacionados, las implicancias para GoodApps y las dudas abiertas.

Fuera de alcance (lo documenta [04 — Mora, intereses y corte](04-mora-intereses-y-corte.md)): el cálculo del interés y del recargo (`clsGestionMora`, `clsInformes_Mora`) y la financiación de deuda. Aquí solo se describe **cómo la cobranza usa** el recargo ya calculado (cobrarlo en el acto o diferirlo).

Convenciones:

- Las rutas son relativas a `binarios/decompilado/ReglasNegocio/`. `Cobranzas/` es `ReglasNegocio.Cobranzas/`, `Entidades/` es `ReglasNegocio.Cobranzas.Entidades/` y `Entidades.XXX/` es la subcarpeta de la cooperativa XXX.
- Las posiciones de los layouts son las del código: **base 0** (C# `Substring`), longitud en caracteres. "(n,2)" quiere decir n caracteres con 2 decimales implícitos (el importe viene en centavos).
- "Sigla" es el código de la cooperativa que devuelve el parámetro `Nucleo.Busca_V2_Caracter(2264)`. Hay muchas ramas `if (sigla == "XXX")` en el código.
- El código es de terceros: se describe en prosa y pseudocódigo breve, sin copiar bloques.

---

## 1. Panorama

La cobranza tiene tres canales que terminan en el mismo método de registración (`clsRegistracionCobranza.RegistrarPago`, `Cobranzas/clsRegistracionCobranza.cs:68-301`):

| Canal | Quién arma la lista de comprobantes | Caja | Medio de pago |
|---|---|---|---|
| Ventanilla (cobranza local) | El cajero, desde la consulta de deuda (`clsCobranzas`) | Caja abierta del usuario (`CAJAS`) | Efectivo, cheques, transferencia, retenciones, cupón de tarjeta, QR |
| Entes recaudadores (archivo o API) | Un importador (`Importador_Base` y una clase por formato) | La caja fija del ente (`BANCOS.CAJA`) | Una transferencia por el total a la cuenta bancaria del ente (`BANCOS.COD_BANT`) |
| Pagos digitales (Pagos360, SIRO, MercadoPago, etc.) | Solicitudes de pago (`PAGOS360` + `PAGOS360_ITEMS`) que después se "importan" como un ente | Ídem entes | Ídem entes |

Tablas principales:

- `CAJAS`: caja por día, número y usuario, con apertura y cierre.
- `PLAN_CAJ`: cada operación de caja, con los totales que entran y salen por medio de pago (`ENT_EFE`, `ENT_CHE`, `ENT_RET`, `ENT_TAR`, `ENT_TRA`, `SAL_*`, `PAG_EFE`, `VUE_EFE`). Su `COD_BAN` indica si la operación vino de un ente.
- `PAG_SOC`: recibo, uno por cuenta (`COD_SUM`).
- `IT_PAGSO`: ítems del recibo. Indican qué comprobante cancela cada pago, el saldo previo y el importe aplicado.
- Medios de pago: `EFEC_OP`, `TRAN_OP`, `VALORES` (cheques), `RETENCIO`, `CUPONTAR`.
- Tesorería: `TESORE` y `RESBAN` (libro banco).

---

## 2. Caja: apertura, operación y cierre

Clase `ReglasNegocio.Tesoreria/clsCajas.cs`.

- **Modelo.** Una caja es un registro `CAJAS(FECHA, NUM_CAJ, USUARIO, APERTURA, CIERRE)`. Está **abierta** si en esa fecha tiene `CIERRE` nulo. Un usuario puede tener cajas abiertas y la cobranza exige al menos una (`clsAnulacionCobranza.ValidarAnular`, `Cobranzas/clsAnulacionCobranza.cs:402`).
- **Número de caja.** `Get_NumeroCaja` toma el primer número libre. Excluye los números reservados a entes (`BANCOS.CAJA`) y a usuarios con caja fija (`USERS.COD_CAJ`). Cada ente recaudador tiene **su propia caja virtual**.
- **Apertura.** `AbrirCaja` (`clsCajas.cs:215`) inserta el registro con la fecha y hora de apertura.
- **Datos de cierre.** `GetDatosCierre` (`clsCajas.cs:243`) bloquea el registro y calcula el **teórico por medio de pago** sumando las operaciones de `PLAN_CAJ` de la caja: `VALORES`, `EFEC_OP` (por moneda), `CUPONTAR`, `RETENCIO` y `TRAN_OP`, más los movimientos de `TESORE` de la caja. Informa las diferencias mayores a 0,05.
- **Cierre.** `CerrarCaja` (`clsCajas.cs:421`) hace lo siguiente:
  - Genera los movimientos de tesorería (`TESORE`) del efectivo.
  - Si el efectivo real difiere del teórico, genera un movimiento de **quebranto** de ingreso o de egreso.
  - Pasa los cheques (`VALORES`) a estado 2, es decir, fuera de la caja.
  - Presenta automáticamente los cupones de tarjeta de débito.
  - Presenta las retenciones si está activo el parámetro 2952.
  - Lleva las transferencias al libro banco (`RESBAN`).
  - Registra el capital social, salvo que esté activo el parámetro 2543.
- **Anulación del cierre.** `AnularCierreCajas` (`clsCajas.cs:628`) reabre la caja que generó los movimientos de tesorería: pone `CIERRE` en nulo, los totales en cero y desvincula de tesorería el efectivo, los cupones, las retenciones, las transferencias y los valores. Rechaza si el módulo Tesorería está cerrado para esa fecha. *(Corregido en la segunda pasada: la anulación no depende del parámetro 2688. Ese parámetro, "Habilitar cierre de caja de varios días (solo efectivo)", hace que además se reabran todas las cajas del período que se cerró en conjunto, `:662-685`. Ver la sección 13.1.)*
- **QR por caja.** Hay QR estáticos por caja (`CAJAS_QR`, `QrEstatico`, `GeneradorQrFactory.Crear`). Si la entidad digital usa QR estático para esa caja, se actualiza el monto del QR con el total a cobrar y se consulta el pago. Si no, se genera un QR dinámico por operación (`QrDinamico`).

---

## 3. Cobro en ventanilla

### 3.1 Consulta de deuda y orden de los comprobantes

`clsCobranzas` (`Cobranzas/clsCobranzas.cs`, 4497 líneas) arma una lista de `InfoCobranza` (desde la línea 671). Cada elemento es un comprobante con estos datos: saldo, recargo según el vencimiento, modo de diferir, cuotas, talón, total a pagar y marcado.

- `Get_InfoCobranza_Deuda` (`clsCobranzas.cs:3685`) junta tres cosas:
  - Facturas impagas (`FACTURAS` con saldo).
  - Cuotas de financiación (`DEUDAVTA`).
  - Anticipos con saldo (`ANTICIPOS.SDO_ANT > 0`), que entran con signo negativo, es decir, como crédito a favor. *(Precisión de la segunda pasada: los anticipos solo se agregan en el modo ConsultaDeuda y cuando el filtro incluye la deuda de financiación y no excluye financiaciones, `clsCobranzas.cs:3695-3698`.)*
- La lista se ordena **por fecha ascendente**: lo más viejo primero.
- Modos (`ModoCobranza`, en los enums de `clsCobranzas.cs:2444-2777`): ConsultaDeuda, CobranzaLocal, CobranzaEntidades, FinanciacionDeuda, BloqueoDesbloqueo y VentaPrepaga.
- `VariablesConsulta` (`clsCobranzas.cs:399`) carga los parámetros que gobiernan la consulta (ver la sección 10).

### 3.2 Orden de aplicación obligatorio (validaciones de caja)

No hay un algoritmo que reparta un monto automáticamente entre comprobantes. El cajero **marca** los comprobantes y el sistema valida que la selección respete el orden. Lo hace `clsCobranzaCaja.Validar_CobranzaLocal` (`Cobranzas/clsCobranzaCaja.cs:1524-1591`), que junta todos los mensajes separados por `#`:

| Regla | Parámetro | Detalle (archivo:línea) |
|---|---|---|
| No se puede cobrar en forma parcial la deuda notificada (aviso de corte): hay que incluir todos los comprobantes notificados vencidos. | 321 | `Validar_CobranzaLocal_ComprobantesNotificados`, `clsCobranzaCaja.cs:1635-1671` |
| Hay que cobrar primero las facturas más antiguas de la cuenta. Compara contra el VTO1 o, con el parámetro 462, contra el VTO4 de lo seleccionado. Excluye créditos. | 324 (+462) | `…_CobrarFacturasAntiguas`, `:1673-1703` |
| Ídem, pero por tipo de factura o servicio (energía, agua, etc.). | 375 | `…_CobrarFacturasAntiguasServicio`, `:1705-1737` |
| Advertencia si el titular (socio) tiene facturas anteriores vencidas en otras cuentas. | 187 | `…_CobrarFacturasTitular`, `:1739-1768` |
| Cuenta con nota de bloqueo de caja (`NOTA_SUM.BLO_CAJ`): no se cobra. Con `MSG_CAJ` solo se muestra la nota, que se puede desmarcar con el permiso `DesmarcarNotaCaja`. | — | `…_BloqueoCaja`, `:1593-1633` |
| Aviso de "titular notificado" (notificación no resuelta). | 302 (caja) / 2453 (consulta) | `…_TitularNotificado`, `:1770-1795` |
| Las cuotas de un plan se pagan en orden: no se puede saltear una cuota anterior impaga. | 2263 | `…_CuotasPendientes`, `:1822-1838` |
| Aviso si el servicio está desconectado (`SERSOC.CONDICION = 4`). | 2411 | `…_ServicioDesconectado`, `:1840+` |
| Aviso si hay una orden de desconexión pendiente (técnica `COD_TRAN = 3`, en estado 1 o 2). | — | `Validar_Cobranza_OTDesconexionPendiente`, `:1797-1820` |

### 3.3 Pago parcial, entrega y anticipos

- **Pago parcial de un comprobante.** `clsCobranzas.Get_TotalPagar` (`clsCobranzas.cs:3754-3821`) agrupa por cuenta. Si el `TotalAPagar` que ingresó el cajero es menor que saldo + recargo + financiación, **primero se cubren el recargo y los intereses de financiación y el resto va a capital** (en pseudocódigo: `capital = TotalAPagar − (recargo + financiación)`).
- **Recargo y modo de diferir** (`DiferirInteres`):
  - `DiferirTodo`: no se cobra recargo en el acto.
  - `DiferirInteresMora`: se cobra solo el recargo entre vencimientos y se difiere la mora.
  - `NoDiferir`: se cobra todo.
  - Lo diferido se factura después como nota de débito de "Intereses Diferidos" (`INT_DIFE` → `DEUDAVTA`). Ver el documento 04.
- **Anticipos y pagos a cuenta.** Son la tabla `ANTICIPOS` (`IMP_ANT`, `SDO_ANT`). Aparecen en la deuda como saldo negativo y se aplican cuando se los marca.
  - Se generan automáticamente en dos casos: un pago **duplicado** de un ente o un pago digital sobre un comprobante ya cancelado (ver la sección 5.4), y el **redondeo** (`clsCobranzas.Crear_Anticipo_Redondeo`, `clsCobranzas.cs:3225`, parámetros 3054, 3069, 3056, 3070 y 739).
  - Hay además una "cancelación automática" que cruza los créditos contra la deuda (`Get_InfoCobranza_AutoCancelar`, `clsCobranzas.cs:3890`).
- **Entrega mínima en entes.** Ver la sección 5.4: si el ente no permite entregas, el pago menor es un error. Si las permite, el mínimo es el recargo entre vencimientos.

### 3.4 Registración del pago (`RegistrarPago`)

`clsRegistracionCobranza.RegistrarPago` (`Cobranzas/clsRegistracionCobranza.cs:68-301`) sigue este orden:

1. **`ValidarCobranza`** (`:571`). Exige que estén configurados los parámetros 606, 2080, 607, 487, 360, 719, 2056, 2069 y 2070 (productos de recargo, categorías bancarias, etc.). También exige comprobantes por defecto para: Cobranza Local, Cobranza en Entidad, Recibo Interno, Recibo Oficial, Pago a Titular, Pago Banco, Intereses Diferidos y Comisiones.
2. Abre la transacción y **bloquea los comprobantes**.
3. Registra el pago a proveedor, si lo hay (operación "pago a proveedor" desde la caja, parámetro 144), y anula los talones sumados (parámetro 2337).
4. **`GetPlanCaj`** (`:620`) crea el `PLAN_CAJ`:
   - `TP_PLA` vale 1 para caja y 2 para ente.
   - `NUM_CAJ` es la caja del usuario o `BANCOS.CAJA`.
   - Carga los totales por medio de pago, el pago en efectivo y el vuelto.
5. Registra, según corresponda:
   - La venta prepaga.
   - Los **intereses** (`RegistrarIntereses`, `:655`).
   - Las facturas de terceros (cobranza por cuenta de terceros, `clsTerceros`).
   - La **comisión del ente** (`RegistrarCobranzaEntidad`, `:1347`).
   - El pago de la notificación.
6. **`GetPagSocs`** (`:1496`) arma un recibo `PAG_SOC` **por cuenta**.
   - Tipo de recibo:
     - "Pago a Titular" si el vuelto supera el pago.
     - "Pago Banco" si viene de un ente.
     - Si no, "Oficial" o "Interno".
   - Por cada comprobante crea un `IT_PAGSO` con: `SAL_ACT` (saldo antes del pago), `ENTREGA` (importe aplicado), `IMP_FAC`, intereses separados (`INT_234`, `INT_MOR`, `INT_FIN`), `FACTOR` ±1 (débito o crédito) y `FEC_ACRED`.
   - Si el pago fue por talón, crea además `TALONFAC_PAGO`.
7. Registra las cuotas y los **medios de pago** (`RegistrarMediosDePago`, `:1660`). Valores del enum `clsTesoreria.MediosDePago` (`Tesoreria/clsTesoreria.cs:19-33`):
   - Efectivo → `EFEC_OP`, con moneda y cotización.
   - Transferencia y cheque propio → `TRAN_OP`, más un asiento en `RESBAN` según `TipoRegistracionLibro` (`:1781-1950`). Las opciones son: PorDefecto, PorComprobante (un movimiento por recibo), PorFecha (uno por fecha de acreditación), PorCaja y PorPago.
   - Cheque de terceros → `VALORES`.
   - Retención → `RETENCIO`.
   - Cupón de tarjeta → `CUPONTAR`.
   - El subtipo de transferencia puede ser Banco, Tarjeta o QR.
8. **`ActualizarComprobantes`** (`:1402`) aplica bloqueo optimista: verifica que el `SALDO` y la `FECHASALDO` no cambiaron desde la consulta. Después descuenta: `SALDO −= pago`. Si el saldo queda en 0, marca `PAGA = "P"`. Si queda negativo, da error.
9. Registra los movimientos de entidades y el detalle de intereses.
10. **`ValidarIntegridad`** (`:1393`): la suma de los ítems tiene que coincidir con la de los medios de pago, con una tolerancia de 0,06.
11. Controla los pagos duplicados (parámetro 3169), hace el commit y actualiza el estado de la solicitud Pagos360.
12. Pasos posteriores:
    - Factura electrónica ARCA del recibo o del interés (parámetro 727).
    - Notificaciones de pago por SMS o WhatsApp (parámetros 2674, 2664, 2665, 2693 y 3105).
    - **Reconexión automática** del servicio cortado (parámetros 3112, 2713 y 3106).
    - Capital social.

### 3.5 Anulación de una cobranza

`clsAnulacionCobranza.Anular` (`Cobranzas/clsAnulacionCobranza.cs:103-252`).

**Validaciones previas** (`ValidarAnular`, `:385-449`). No se puede anular si:

- El usuario no tiene el permiso `AnulaCobranza`.
- La operación ya está anulada.
- El usuario no tiene una caja abierta.
- En operaciones de ventanilla, la caja original ya está cerrada.
- Los cheques ya salieron de la caja.
- Hay intereses diferidos ya facturados.
- Hay facturas de terceros ya rendidas.
- Es una venta prepaga cuya retención ya se aplicó.

**Pasos:**

- Guarda un histórico y anula el talón o la cuota.
- Si vino de un ente, busca el movimiento de `RESBAN` asociado y lo anula. Lo busca primero por `ID_PLA`; si no lo encuentra, por cuenta del ente, fecha, movimiento 70/71, categoría del parámetro 2056 e importe.
- Borra `IT_PAGSO`, `CAPITAL`, `VALORES`, `EFEC_OP`, `TRAN_OP`, `RETENCIO` y `CUPONTAR`.
- Pone en cero los totales del `PLAN_CAJ` y lo marca `ESTADO = "A"`.
- `AnularPagos` (`:451`) marca los recibos como anulados y repone el saldo. Si `SAL_ACT ≠ SALDO` actual, rechaza la anulación: hay pagos posteriores y se exige anular en orden inverso.

---

## 4. Entes recaudadores: arquitectura común

### 4.1 Configuración del ente (`BANCOS`)

Cada ente recaudador (banco, Red Link, SIRO, Pago Fácil, tarjeta, etc.) es un registro de `BANCOS`. Campos usados por la cobranza:

| Campo | Uso |
|---|---|
| `DES_BAN`, `CONVENIO`, `ID_CON` | Nombre, código de convenio o ente (se valida contra la cabecera del archivo) y concepto Red Link |
| `COD_ARC` | Modelo de **importador** (archivo de rendición): un valor de `Importador_Base.Modelos` |
| `COD_ARC2` | Modelo de **exportador** (archivo de envío de deuda o débitos): un valor de `Exportador_Base.Modelos` |
| `ARC_CONFIG` | Forma de identificar el comprobante (`FormaImportacion`, `Importador_Base.cs:83-95`): PorDefecto, Comprobante_IDFAC_00, Comprobante_IDFAC, Comprobante_USUARIO, Comprobante_348 |
| `CAJA` | Número de la caja virtual del ente |
| `COD_BANT` | Cuenta bancaria propia (`BANKOS`) donde se acredita: genera `TRAN_OP` y `RESBAN` |
| `DIFERIR` | 0 = difiere todo el recargo; 1 = difiere solo la mora (cobra el recargo entre vencimientos) |
| `PORC_INTERES` | Si es 0, el interés diario se fuerza en cero |
| `COBVTO1`, `RECARGO3VTO` | Cobrar al primer vencimiento; cobrar la mora pasado el último vencimiento |
| `PERFUETER`, `FUETERBAN` | Último vencimiento que acepta el ente (0/1 = Vto1 … 4 = Vto4; si no se configura, Vto4) |
| `PERMITE_ENTREGA` | Acepta pagos parciales |
| `TRASLADAR`, `FORMA_CAL`, `IMPO_CAL`, `IMPO_MIN`, `IMPO_MAX` | Comisión del ente: 1 = importe fijo por comprobante; 2 = porcentaje acotado por mínimo y máximo. `TRASLADAR` = se la factura al usuario |
| `CONCILIACION_AUTO` | El movimiento bancario nace conciliado |
| `TIPO_REG` | `TipoRegistracionLibro`: cómo se asienta en el libro banco |

### 4.2 Selección del formato por reflexión

- **Importadores.** `Importador_Base.Modelos` (`Entidades/Importador_Base.cs:97-690`) es un enum de unos 295 valores. Cada uno lleva un atributo `[Importer(Sigla, Nombre, Formats, Importer = typeof(clase), MostrarAdvertenciaDiferencias, Observaciones, API_SIRO)]` (definido en `:802-817`). `Get_Importador` (`:950-972`) lee `BANCOS.COD_ARC`, toma la clase del atributo y la instancia con `Activator.CreateInstance`.
- **Exportadores.** `Exportador_Base.Modelos` (`Entidades/Exportador_Base.cs:101-522`, unos 209 valores) funciona igual. Su atributo es `[Exporter(Sigla, Nombre, Format, Exporter, PersonalizarUltimoVto, ValidarSaldo, Observacion)]` (`:524-539`) y `Get_Exportador` está en `:1174/1198`.
- **Sigla.** "PR10" marca un formato genérico de Procoop: 62 importadores y 69 exportadores. Las demás siglas son formatos de una cooperativa, aunque muchas reutilizan las clases genéricas de `Entidades.PR`.
- **Layout para la pantalla.** `Get_Estructura()` describe el layout (`Estructura`, `Importador_Base.cs:819-915`), y la pantalla lo muestra con `GetEstructurasImportadores` (`:974`).

### 4.3 Identificador de comprobante (prefijo de 2 dígitos)

Todos los envíos y rendiciones convergen en un **"comprobante"** cuyo prefijo indica qué es. Lo resuelve `clsComprobanteFactura.Get_Facturas` (`ReglasNegocio.Facturacion/clsComprobanteFactura.cs:2202-2360`):

| Prefijo | Significado | Búsqueda |
|---|---|---|
| `40` | Notificación de deuda (aviso de corte) | `NOTIFICA.CNT_NOT` → `COMPNOTI` → facturas. Alternativa: lote (4 dígitos) + cuenta (8). Difiere todo el recargo |
| `41` | Factura | `FACTURAS.ID_FAC` |
| `42` | Talón | `TALONFAC.NUMERO`. Cuota 0 = talón sumado (varias facturas); cuota > 0 = cuota de gas o de plan |
| `43` | Solicitud de pago digital | `PAGOS360_ITEMS.COD_PAG` |
| `99` | Talón de entidad (variante) | `LoadComprobantes_Talones99` |
| `21`–`23` | Código de barras agrupado por socio o suministro + `AGR_SUM` | Según el parámetro 242 |
| otros (14 dígitos) | `COD_COM`(2)+`SUC_COM`(4)+`NUM_COM`(8) | Por número de comprobante |

Al exportar, `InfoComprobante.Id_Origen` vale 41 (factura) o 42 (talón), y el identificador que se envía es `Id_Origen + ID` con relleno de ceros (D10 o D12, según el formato). `ARC_CONFIG` permite otras convenciones:

- `Comprobante_IDFAC_00`: el número es directamente el `ID_FAC` si no empieza con 41, 42 ni 43.
- `Comprobante_IDFAC`: el `ID_FAC` cuando empieza con "00".
- `Comprobante_USUARIO`: se busca por `FACTURAS.USUARIO`, el código del sistema anterior con relleno a 10.
- `Comprobante_348`: 3 + 4 + 8 dígitos.

### 4.4 Exportación (envío de deuda) — `Exportador_Base`

- **Selección.** `Get_Comprobantes_Factura` (`Exportador_Base.cs:829-955`) toma la deuda con `SALDO > 0`, excluye los créditos (`DEB_CRE ≠ 2`) y aplica los filtros de `:559-596`:
  - período, emisión, vencimiento, tipos de factura y empresas postales;
  - excluir débitos automáticos, incluir pagados, excluir usuarios con deuda;
  - importe máximo y comprobantes bloqueados.
- **Débito automático.** Con la operación "Generar débitos automáticos", filtra `SUMSOC.DEB_TARJ = true`, `SUMSOC.COD_BAN` = el ente y descarta los tipos de facturación listados en `DEBITO_EXCLUSION`.
- **ValidarSaldo.** Si el atributo `ValidarSaldo` está activo y `SALDO ≠ TOTAL1` (factura con pago parcial), los cuatro totales pasan a ser el saldo.
- **Talones.** `Get_Comprobantes_Talon` (`:1024`, parámetro 2686) agrega los talones sumados y las cuotas.
- **Importes.** `Get_TextoImporte` (`:1255`) escribe el importe en centavos con relleno de ceros.
- **Ruta.** El archivo se escribe en `PathServer\Debitos` (`RutaExportacionDebitos`).
- **Índice Red Link.** `Indexar_Registro` (`:1397-1476`) asigna un **índice único** por (período, concepto, identificador) y lo guarda en la tabla `RED_LINK` (`ENTIDAD` 1 = Red Link, 2 = SIRO; `MODELO` = convenio). El índice inicial sale del parámetro 2966. `checkearComprobantesInformados` (`:1478`) evita reinformar un comprobante.

### 4.5 Importación (rendición) — `Importador_Base`

Flujo típico de un `Importar(ruta)`:

1. Lee el archivo de ancho fijo con cabecera y pie (`clsImportacion.Importador_Text_LargoFijo`).
2. Valida `cabecera.convenio == BANCOS.CONVENIO` y que la fecha de presentación no sea futura.
3. Mapea cada fila a un `FilaArchivo` (`Importador_Base.cs:725-783`) con: Importe, Cod_Sum, Comprobante, FechaVto, FechaCobro, FechaAcreditacion, IdConcepto y Otros (normalmente el código de barras completo).
4. Resuelve el comprobante:
   - Con `LoadComprobantes_ByComprobante` (`:1154-1222` y `:1272-1386`): si encuentra una sola factura, normaliza el comprobante a "41"+ID_FAC. Si encuentra varias, usa el talón ("42"+número) o da el error "Se encontró mas de un comprobante".
   - Después, `LoadComprobantes` (`:1388-1445`) deriva según el prefijo: talón sumado, `99`, `40` (difiere todo), `43` (pago digital), cuotas de gas o comprobante simple.
5. Valida el pie: cantidad de registros (en general la cantidad del pie menos 2 por la cabecera y el pie) y el importe total (`Validar_CantidadImportada` `:2177` y `Validar_ImporteImportado` `:2193`).

### 4.6 Validaciones por comprobante (`LoadComprobantes_Simple`, `Importador_Base.cs:1884-2022`)

1. **Modo de diferir** desde `BANCOS.DIFERIR`. Si la factura ya tenía un pago parcial (`SALDO ≠ TOTAL1`), se difiere todo.
2. **Importe esperado** = saldo, más el recargo entre vencimientos si corresponde. Si la fila trae el recargo explícito (`RECARGO_MORA` o `RECARGO_VTO` en pagos digitales), se usa ese recargo y se recalcula su IVA con el producto del parámetro 606.
3. **Ya pagado** (`PAGA = "P"`).
   - Si el pago anterior vino del mismo ente (`PLAN_CAJ.COD_BAN` igual), el mensaje es "importado el día …" y no se informa como error.
   - Si no, el mensaje es "cancelado el día …" y se marca para generar un **anticipo** por el pago duplicado.
   - `GetAnticipo` (`:2090`) detecta si el anticipo ya se generó (`COD_FAC` = "PD: cc-ssss-nnnnnnnn").
4. **Pasado el último vencimiento aceptado** (`PERFUETER`/`FUETERBAN`; si no se configuró, Vto4): "La entidad recaudadora no permite pagos pasados el día …".
5. **Importe superior al esperado.** Es error, salvo que el atributo tenga `MostrarAdvertenciaDiferencias` y la diferencia sea ≤ `_minimoDiferencia` (≈ $1): en ese caso es solo una advertencia.
6. **Importe inferior al esperado.**
   - Sin `PERMITE_ENTREGA`, es error (con la misma tolerancia).
   - Con `PERMITE_ENTREGA`, es error solo si no llega a cubrir el recargo entre vencimientos ("inferior a la entrega mínima").
7. **Otras validaciones:**
   - Comprobante anulado: `ValidarComprobanteAnulado` (`:2063`), contra `ANUFAC`.
   - Duplicados dentro del archivo: `Validar_Duplicados` (`:1224`), parámetro 3200.
   - Titular notificado: `Validar_TitularNotificado` (`:2123`), parámetro 302.
   - Comprobante bloqueado: `Validar_ComprobanteBloqueado` (`:2156`), parámetros 2586 y 2596.

### 4.7 Registración de la rendición y conciliación

`clsCobranzaCaja.RegistrarPago_Entidades` (`Cobranzas/clsCobranzaCaja.cs:982-1003`) registra la rendición así:

```text
medio = Transferencia(total rendido, cuenta = BANCOS.COD_BANT,
                      concepto = "Cobranza {DES_BAN} (Com x)", fecha = fecha de rendición,
                      diferencia = Importe_DiferenciaEntidad,
                      conciliado = BANCOS.CONCILIACION_AUTO)
RegistrarPago(comprobantes OK, medio, caja = null → usa BANCOS.CAJA, TP_PLA = 2)
```

- Los comprobantes con error se muestran en el log (`LogCobranzaEntidades`, `clsCobranzaCaja.cs:887-934`) y no se registran.
- La comisión (`RegistrarCobranzaEntidad`) se calcula con `FORMA_CAL`/`IMPO_CAL` y, si `TRASLADAR`, se le factura al usuario con el comprobante por defecto "Comisiones".
- El asiento en `RESBAN` depende de `BANCOS.TIPO_REG`: por comprobante, por fecha de acreditación, por caja o por pago. Si el ente no lo define, en los pagos digitales se usa PorFecha.
- La conciliación bancaria posterior es manual o semiautomática (`ReglasNegocio.Tesoreria/clsConciliacion.cs`, sobre `RESBAN`). La "conciliación" propia de la importación se limita a los controles del pie (cantidad e importe) y al log de diferencias.

---

## 5. Entes y formatos genéricos importantes

### 5.1 Red Link (pago por home banking o cajero de la red Link)

Es la familia más grande: unos 22 exportadores y unos 10 importadores genéricos en `Entidades.PR`. El nombre `E_RedLink_19_7` significa "identificador de 7 dígitos dentro de un campo de 19". "Continuo" indica la variante de envío continuo.

**Envío de deuda (`PR/E_RedLink_19_7.cs`, modelo `PR_LINK_04 = 155`; la variante continua es `PR_LINK_05 = 156`).** Es de ancho fijo y tiene tres partes:

- **Cabecera:** `"HRFACTURACION"` + convenio (3) + fecha `yyMMdd` + `"00001"` + 104 espacios.
- **Detalle:**

  | Campo | Largo | Formato |
  |---|---|---|
  | Índice | 5 | De `RED_LINK` |
  | Período | 4 | `MMyy` |
  | Concepto | 3 | `TIPO_FAC.LINK` o `BANCOS.ID_CON` |
  | Identificador de usuario | 19 | Cuenta `D7` + 12 espacios |
  | Vto1 | 6 | `yyMMdd` |
  | Importe1 | 12 | En centavos |
  | Vto2 + Importe2 | 6 + 12 | Ídem |
  | Vto3 + Importe3 | 6 + 12 | Ídem |
  | Identificador de comprobante | 12 | `"41"`/`"42"` + `D10` |
  | Relleno | 38 | Espacios |

- **Pie:** `"TRFACTURACION"` + cantidad `D8` (registros + 2) + tres totales `D18` + 56 espacios.

Además se genera un archivo de control "C…" con las líneas `HRPASCTRL`, `LOTES00001` y `FINAL`, rellenas a 75. El nombre del archivo es `P` + convenio + n + mes en hexadecimal + día. Tiene ramas por sigla: ADM, AZUL, DIAZ y RICO.

**Rendición genérica (`PR/RedLink_19.cs`, modelo `PR_RedLink = 202`).**

- **Cabecera:** convenio (1,3) y fecha `yyyyMMdd` (4,8).
- **Detalle de 98 caracteres:**

  | Campo | Posición | Largo |
  |---|---|---|
  | Período | 2 | 4 |
  | IdConcepto | 6 | 3 |
  | Otros (identificador de usuario) | 9 | 19 |
  | Importe | 28 | 12,2 |
  | FechaCobro (`yyyyMMdd`) | 40 | 8 |
  | Comprobante | 48 | 50 |

- **Pie:** cantidad (1,6) − 2 y total (7,16,2).
- Tiene ramas por sigla: DERO, DORM, CON, SMO, MOR, DIAZ, ABAS/FERN, DGLP, BLAS (fecha tope del parámetro 2784 y tolerancia de ±0,10), TREL, CC y TICI.

**Variantes:** `RedLink` (58 caracteres; comprobante en 48,10), `RedLink_1` (cuenta en 9,7; comprobante en 48,14), `_3`, `_4`, `_7`, `_8` y `_9`. Más adelante se describe el importador propio de LAG, que identifica por cuenta e importe y no por comprobante.

### 5.2 SIRO (Banco Roela) — archivo y API

**Envío de base de deuda (`PR/E_SIRO.cs`, modelo `PR_SIRO = 140`; `E_SIRO_Ext` es la variante extendida).**

- **Cabecera:** `"04000000"` + `yyyyMMdd` + 264 ceros.
- **Detalle:** `"5"` + cuenta `D9` + convenio (10) + `Id_Origen`+ID `D13` + índice y período + `"0"` + tres pares (vto `yyyyMMdd`, importe 11) + 19 ceros + identificador de usuario repetido + mensaje de ticket (40) + mensaje de pantalla (15) + **código de barras** (60) + 29 ceros.
- **Pie:** `"94000000"` + fecha + cantidad `D7` + total + 239 ceros.

Reglas:

- Máximo 10 comprobantes por cuenta y período.
- El parámetro 3006 agrega días extra al último vencimiento y exige `DIFERIR = 1`.
- El parámetro 2818 excluye el período o los comprobantes ya informados.
- El parámetro 2296 define el nombre del archivo.
- **Rama LAG:** el convenio se antepone con "0" para armar el código de barras (`E_SIRO.cs:134`).
- **Rama FAL:** excluye los comprobantes bloqueados `ID_BLO = 1` (`:27-30`).
- Con el parámetro 2807, la base se informa **por API** (`clsSIRO.InformarBase`, `Consultar_Base`) y el resultado se guarda en `SIRO_BASEDEUDA` (registros correctos, erróneos, totales).

**Rendición (`PR/SIRO.cs`, modelo `PR_SIRO = 188`, con `API_SIRO = true`).** Filas de 96 caracteres o más:

| Campo | Posición | Largo |
|---|---|---|
| FechaCobro | 0 | 8 |
| FechaAcreditacion | 8 | 8 |
| Importe | 24 | 7,2 |
| Otros (código de barras) | 40 | 56 |
| FechaVto (`yymmdd`) | 53 | 6 |
| Importe2 | 68 | 7,2 |
| CodigoConvenio | 84 | 10 |
| Comprobante | 96 | 15 |

Reglas:

- Para FAL y AO se agrega la cuenta en (44,9).
- Con el parámetro 2807, los pagos se obtienen **por API** (`clsSIRO.Get_Pagos`) y la pantalla oculta el selector de archivo (`Importador_Base.Archivo_ObtenerFiltroBusqueda`, `:1099`).
- El dígito `Otros[4]` indica el tipo de comprobante: 5 = notificación (prefijo 40) y 9 = talón.
- Los comprobantes que empiezan con 7 son pagos web, vinculados por `PAGOS360.ID_SIRO`. Los que empiezan con 8 se descartan.
- Valida el convenio y las fechas de acreditación.
- Resuelve con el decodificador de código de barras `PR_BancoRoela`. Para FAL, CON y TIR hay búsquedas particulares (`Busqueda_Particularizada_Fal`, `:340`, con NUM_COM y cuenta).
- Toma `Fecha_Rendicion` y `TipoRegLibro` de `BANCOS.TIPO_REG`.
- Otras variantes: `SIRO_Extendido` (238), `Siro_Alternativo` (266), `Siro_Integrado` (271) y `Siro_Unificado` (288).

**`clsSIRO` (`Cobranzas/clsSIRO.cs`)** también funciona como entidad digital: botón de pago, QR y API de gestión.

- Parámetros de configuración:
  - 2492/2493: usuario y clave.
  - 2494/2495: URL de éxito y de rechazo.
  - 2500: pago online.
  - 2775/2776: verificación del ID y demora (25 s).
  - 2804/2805: CUIT y clave de la API de gestión.
  - 2939: QR estático.
  - 2798–2802: datos del QR (CUIT, CBU, nombre, provincia, código postal).
- Conceptos de canal online aceptados: BPD, BPC, TQR, DB, PCO y LKO. Excluidos: BPR, PCV, LKV, MCR, VSR, PCA, LKA y QRE.
- El código de barras usa el modelo "0448" → `PR_SIRO_0448` y, en los demás casos, `PR_BancoRoela_Ext`.

### 5.3 Banelco (PagoMisCuentas), Pago Fácil, Rapipago y Cobro Express

Todos usan el mismo "registro tipo 5" en el envío, con cuenta (19) + comprobante (20) + vencimientos e importes + mensajes de ticket y pantalla.

| Formato | Envío (exportador genérico) | Rendición (importador genérico) |
|---|---|---|
| Banelco | `PR/E_Banelco_19_7_11` y unas 20 variantes. Cabecera `"0400"` + convenio (4) + fecha (8) + 264 ceros. Detalle `"5"` + cuenta (19) + comprobante (20) + moneda `"0"` + 3 × (vto 8, total 11,2) + 19 ceros + cuenta (19) + ticket (40) + pantalla (15) + código de barras (50) + 10 espacios + 29 ceros. Pie `"9400"` + convenio + fecha + cantidad (7) + 7 ceros + total (11,2) + 239 ceros | `PR/Banelco` (modelo 203). Cabecera: convenio (4,4) y fecha (8,8). Detalle de 68: cuenta (1,19), comprobante (20,20) o (20,14), vto (40,8), fecha de cobro (49,8), importe (57,11,2). Pie: cantidad (16,7) y total (30,11,2) |
| Pago Fácil | `PR/E_PagoFacil`: `"5"` + cuenta (19) + comprobante (20) + moneda + 2 × (vto, total 11,2) + 14 espacios + cuenta (19) + ticket (21) + pantalla (75) + 29 ceros | `PR/PagoFacil_Simple` (modelo 205). Detalle de 131: comprobante (83,21), importe (107,10,2), fecha de cobro (123,8), vto (40/45,6). Pie: cantidad (28,7) y total (35,12,2). Variantes: 2, 3, _4 y PagoFacil_Rapipago |
| Rapipago | `PR/E_RapiPago` (cabecera `"0"` + código Rapipago `"814"` …) | `PR/RapiPago` (modelo 222). Detalle de 51: fecha de cobro (0,8), importe (8,15,2), código de barras (23,50), comprobante (29,14), vto (43,8). Varias sub-variantes por largo de línea. Pie: cantidad (8,8) y total (16,18,2) |
| Cobro Express | `PR/E_CobroExpress` (igual a Pago Fácil) | `PR/CobroExpress`. Cabecera: convenio (7,3) y fecha (10,8). Detalle de 68: vto (5,8), importe (13,10,2), comprobante (39,10) |

En estos entes el cliente se identifica por la **cuenta** y el comprobante por el **código de barras** de la factura (ver el documento 02, código de barras por cooperativa) o por "41/42"+ID.

### 5.4 Pagos duplicados y anticipos en entes

Si la rendición trae un pago sobre un comprobante ya cancelado por otra vía, Procoop puede crear un **anticipo**:

- Para pagos digitales, con `EntidadDigital.CrearAnticipo` (`Cobranzas/EntidadDigital.cs:446-534`).
- Para entes, con `clsEntidadesRecaudadoras.CrearAnticipo` (`Cobranzas/clsEntidadesRecaudadoras.cs:747`).

El anticipo es un comprobante de concepto exento, con tipo de comprobante y concepto según los parámetros 2409/2410 (o 29), vendedor según el parámetro 1008, y las marcas `ImputacionNoAutomatica` y `CreditoPorAnticipo`. El dinero queda como crédito de la cuenta para aplicar después. Las reversiones (contracargos) generan `Crear_Anticipo_Rever` (`EntidadDigital.cs:301`).

---

## 6. Débito automático (tarjetas y CBU)

### 6.1 Adhesión (datos en la cuenta)

- **Datos de la adhesión** en `SUMSOC`:
  - `DEB_TARJ` (adherido sí o no);
  - `COD_BAN` (el ente o tarjeta que debita);
  - `NUM_TARJ` (número de tarjeta o CBU de 22 dígitos);
  - `ID_TARJ`;
  - `PER_TARJ` (período desde el que rige);
  - `FEC_TARJ` (fecha de alta).
- **Exclusiones** por tipo de facturación: `DEBITO_EXCLUSION(COD_SUM, COD_TPFC)`.
- **Novedades de adhesión por archivo.** `clsEntidadesRecaudadoras` procesa los archivos de novedades de Tarjeta Naranja, Visa Crédito, Visa Débito, PampaPagos y Comafi, cada uno con su layout (`:342-703`). `Procesar_Novedades` (`:705`) aplica:
  - **alta** → `DEB_TARJ = true` y carga `COD_BAN`, `PER_TARJ`, `NUM_TARJ` y `FEC_TARJ`;
  - **baja** → `DEB_TARJ = false` y además `FEC_TARJ` en nulo (segunda pasada);
  - las novedades solo se aplican a cuentas cuyo `COD_BAN` es el mismo ente o está vacío; las demás se devuelven como error (segunda pasada, `:705-745`);
  - **modificación** → actualiza `NUM_TARJ`.
- **Adhesión por Pagos360** (sin archivo). `clsPagos360.Registrar_DebitoTarjeta` / `Registrar_DebitoCbu` (`Cobranzas/clsPagos360.cs:1867-1963`) envía una solicitud de adhesión con `external_reference` = cuenta + fecha y hora, titular, mail, número de tarjeta o CBU y CUIT del titular del CBU.
  - El estado que responde la API se traduce así: `pending_to_sign` → Pendiente_Confirmacion; `signed` → Activo; `canceled` → Error. *(Precisión de la segunda pasada: en la actualización periódica `Actualizar_EstadosDebitos`, `clsPagos360.cs:1369`, `canceled` pasa a **Cancelada**, no a Error; `pending_to_sign` solo se registra en el log.)*
  - El resultado se guarda en `SUMSOC_EXTRAS.DEBITO_360_ID` y `DEBITO_360_ESTADO`.
  - Otros métodos: `Tipo_Debito` (Tarjeta = 1, Cbu = 2), `Get_DebitosAutomaticos`, `Cancelar_Debito` y `Actualizar_EstadosDebitos`.

### 6.2 Presentación y rendición de débitos

La presentación es un **exportador** con `TipoOperacion.Generar_Debitos_Automaticos`, que selecciona solo las cuentas adheridas a ese ente. Formatos genéricos:

- **Visa y Mastercard** (`PR/E_Visa_Credito`, `E_Visa_Debito`, `E_Mastercad`, `E_MasterCard_Debito`, `E_Fiserv`). Layout DEBLIQC / DEBLIQD / DEBLIMC:
  - **Cabecera:** `"0"` + nombre del archivo + convenio (10) + `"900000    "` + fecha `AAAAMMDD` + hora `HHMM` + tipo `"0"` + … + `"*"`.
  - **Detalle:** `"1"` + tarjeta (16) + 2 espacios + referencia (8) + fecha de vto + código de transacción `"0005"` + importe (15,2) + identificador del débito (15) + `"E"` + … + `"*"`.
  - **Pie:** `"9"` + nombre + convenio + fecha + hora + cantidad (7) + total (15,2) + `"*"`.
- **Rendición Visa** (`PR/VisaCredito`). Líneas de 224 caracteres o más: importe (62,15,2), comprobante (94,15), código de error (132,29), tarjeta nueva (208,16) y fecha de cobro (224,6). Los débitos rechazados no se registran.
- **Mastercard** (`PR/MasterCard_Debitos`). Líneas de 83 caracteres: cuenta (28,10), importe (40,11,2), error (58,2), período (60,5), fecha de cobro (65,6) y comprobante (71,14).
- **Tarjeta Naranja / NaranjaX** (`PR/E_TarjetaNaranja`, `E_NaranjaX`; rendición `TarjetaNaranja`, `NaranjaX`).
  - **Envío:** registros C / D / P. El detalle `D` lleva tarjeta (16), importe (12,2), fecha de alta, cuenta (30), vto, `"99"`/`"00"` + comprobante.
  - **Rendición:** tarjeta (1,16), importe (17,12,2), fecha (29,8) y resultado (112,3). Códigos de resultado: 0 aceptado, 8 inexistente, 35 rechazada, 81 baja, 102 importe 0 y 145 error de referencia (`clsEntidadesRecaudadoras.cs:282-340`).
  - **Morosidad de Naranja:** proceso aparte en `:150-244`.
- **Débito directo por CBU** (`PR/E_DebitoDirecto`, `E_DebitoDirecto2`; rendición `PR/DebitoDirecto`; también Macro, Patagonia, Santander y Credicoop por cooperativa).
  - **Envío:** cabecera `"10"` + fecha + cantidad + total. Detalle `"11SERVICIOS"` + cuenta (8) + **CBU de 22 dígitos** (bloque 1 y bloque 2) + vto (8) + importe (16,2) + comprobante (15). La variante 2 agrega el CUIT de la empresa, la referencia y el código de rechazo.
  - **Rendición:** cuenta (12,8), importe (64,16,2), comprobante (80,15) y **código de rechazo** (95,3). Los códigos son los estándar de interbancaria (R08 orden de no pagar, R09 día no laborable, R10 falta de fondos, …; `PR/DebitoDirecto.cs:~120`).
- **Débito con tarjeta o CBU vía Pagos360:**
  - El exportador `E_Pagos360` crea las solicitudes `PAGOS360` con `DEBITO_ID` y `DEBITO_TIPO`: 2 si el número tiene 22 dígitos (CBU) y 1 si es tarjeta.
  - En la rendición se cobra al primer vencimiento si es un débito sin rechazos previos (`Importador_Base.cs:1903-1906`, `PR/Pagos360.cs:129`).

---

## 7. Pagos online y entidades digitales

### 7.1 Modelo común `EntidadDigital`

`Cobranzas/EntidadDigital.cs` define la clase abstracta de todas las pasarelas. Las subclases son: `clsPagos360`, `clsSIRO`, `clsMercadoPago`, `clsMacro`, `clsPayFun`, `clsPagostic`, `clsSiPago`, `clsHelipagos`, `clsNaranjaX`, `clsProvinciaNet`, `clsProntoPago` y `EntidadDigital_OffLine`.

**Enums** (`:18-123`):

- `API`: Pagos360 = 0, SIRO, MercadoPago = 2, OffLine = 3, NaranjaX, Macro, PayFun, Pagotic, SiPago, ProntoPago, ProvinciaNet y HeliPagos.
- `Estados`: Pendiente, Registrado, Pagado, Imputado, Anulado, Revertido y Rechazado.
- `Tipo` de solicitud: Factura = 1, Talon_Sumado, Cuota_Factura, Talon_Caja, Prepaga, Web, Prepaga_Cooponline, Manual, Cobranza_Cooponline, Archivo_Rendición y TarjetaFecescor.
- `MediosPago` (banderas): TC 1, TD 2, Efectivo 4, LinkPagos 8, BanelcoPagos 16, Debin 32, Transferencia 64 y QR 128.

**Tablas (compartidas por todas las pasarelas, no solo por Pagos360):**

- `PAGOS360`: la solicitud. Campos: `COD_PAG`, `ID_360` (id externo), `API`, `TIPO`, `ESTADO`, `IMPORTE1/2`, `VTO1/2`, `URL_PAGO`, `CODIGO_BARRA`, `MEDIOS`, `DEBITO_ID`, `ID_SIRO`.
- `PAGOS360_ITEMS`: comprobantes incluidos, con `TALON`, `CUOTA`, `RECARGO_MORA` y `RECARGO_VTO`.
- `PAGOS360_PAGOS`: pagos acreditados, con `IMPORTE`, `NET_FEE`, `NET_AMOUNT`, `FECHA_PAG`, `FECHA_REN`, `CHANNEL` e `ID_PLA` cuando se imputa.

**Métodos y parámetros:**

- `Get_EntidadDefault` (`:845`) elige la pasarela por defecto según un parámetro: 0 Pagos360, 1 SIRO, 2 MercadoPago, 3 OffLine, 5 Macro, 6 PayFun, 7 Pagotic, 8 SiPago y 11 Helipagos.
- La entidad del QR la define el parámetro 2803 (`Get_Entidad_Qr`, `:795`) y la de la terminal de autogestión, el parámetro 3142 (`Get_Entidad_Qr_ATM`, `:820`).
- `Generar_Solicitud` (`:894`): si existe una solicitud idéntica de los últimos 10 minutos, **reutiliza el link**. *(Precisión de la segunda pasada: solo aplica a solicitudes de tipo 9, Cobranza_Cooponline, y nunca a SIRO ni Macro. "Idéntica" quiere decir mismo importe, mail, nombre, API, medios de pago y mismos comprobantes. El mensaje al usuario dice "30 minutos", pero el código compara 10. Ver la sección 13.6.)*

### 7.2 Pagos360

`Cobranzas/clsPagos360.cs` tiene 3341 líneas.

- **Configuración** (`Get_Config`, `:384-414`):
  - 901: API key. 902/903/907: URLs. 906: monto mínimo.
  - 2389/2677/2390: medios de pago permitidos para caja, prepaga y entidad.
  - 2726/2727 y 2920–2922: QR dinámico y estático.
  - 2999–3002: reversiones. 3059/3073: comisión por reversión.
  - 2764: mail por defecto. 908: usar el primer importe pasado el Vto4.
- **Creación de solicitudes desde la deuda** (`Crear_PAGOS360(List<InfoComprobante>)`, `:456-566`):
  - Crea una solicitud por comprobante exportado.
  - El tipo es 1 si es factura, 2 si es talón sumado y 3 si es cuota.
  - Concepto: "Comprobante: …", "Talon: …" o "Cuota: …".
  - **Descarta las solicitudes de $10 o menos.**
- **Desde la caja o la web** (`:568`, `:632`) crea una solicitud por el total elegido, con o sin recargo.
- **Pago, QR y reversión:**
  - `Obtener_Pago` (`:742`) y `ConsultarPago` (`:2637`) consultan la API.
  - `Importar_Pagos` / `Importar_PagosAPI` (`:2745`, `:2819`) traen los pagos por rango de fechas.
  - `Get_PagosRechazados` (`:1452`) trae los rechazados y `Buscar_SolicitudesRevertidas` (`:3163`) los revertidos.
  - Hay QR estático por caja: `Get_Qr_Estatico`, `Actualizar_Qr_Estatico` y `Get_QR_PagoOnLine`, con CRC propio (`:1635`).
- **Rendición** (`PR/Pagos360.cs`, modelo `PR_PAGOS360 = 166`). No usa archivo: lee `PAGOS360` con `ESTADO = 2` (pagado) y `API` 0 o nulo, excluyendo los tipos 4 y 7, salvo QR. Por cada solicitud:
  1. Exige **exactamente un pago** sin imputar. En débitos, uno con comisión (`NET_FEE > 0`).
  2. Importe esperado = `IMPORTE1` si se pagó antes de VTO1 (o si es un débito sin rechazos); si no, `IMPORTE2`. Si no coincide, da error.
  3. Distribuye el pago en los ítems. Para cada uno elige `TOTAL1..4` según la fecha de pago y `BANCOS.DIFERIR`; si el ítem tenía saldo parcial, prorratea. Si el ítem trae `RECARGO_MORA` o `RECARGO_VTO`, usa saldo + recargos.
  4. Si la suma de los ítems ≠ el pago, da error ("diferencia entre el importe cobrado y el importe de los comprobantes").
  5. Arma filas "41"+ID_FAC (D12) o "42"+talón y sigue el flujo estándar. `FechaAcreditacion` = `FECHA_REN`.
  6. `ChequearPagosDuplicados` evita la imputación parcial de una solicitud.
- Después de registrar, `Actualizar_EstadoSolicitudesPagadas` (`Importador_Base.cs:2024`) pasa las solicitudes de estado 0/1 a 2.

### 7.3 MercadoPago

- **`Cobranzas/clsMercadoPago.cs`** (408 líneas):
  - `Crear_PAGOS360` (`:115`) arma la solicitud con `API = 2`.
  - `Registrar_Solicitudes` (`:237`) crea la preferencia o link.
  - `Obtener_Pagos(desde, hasta)` (`:308`) consulta los pagos y `Registrar_Pago` (`:349`) los vuelca en `PAGOS360_PAGOS`.
  - `Get_EntidadRecaudadora` (`:88`) busca el `BANCOS` según la sigla.
- **Rendición `PR/Mercado_Pago.cs`** (modelo `PR_MercadoPago = 206`). Es la misma lógica que Pagos360 sobre `PAGOS360.API = 2`: un pago por solicitud, importe1 o importe2 según VTO1, distribución por ítem y control de la suma.
- **Por archivo:**
  - `PR/E_MercadoPago` (exportador `PR_MercadoPago = 231`, csv) genera `MP_ddMMyyyy.csv` con: `Id_Origen`+ID, DNI, cuenta, vto1 `yyyyMMdd`, total1, vto2, total2, nombre sin caracteres especiales, concepto ("ENERGIA" si es talón, si no el tipo de factura) y período.
  - `MercadoPago2` (312) es la rendición por archivo. SARM tiene sus propias versiones.

### 7.4 Otras pasarelas

Todas siguen el patrón `EntidadDigital` + importador PR que lee `PAGOS360` con su número de `API`:

| Pasarela | Clase | Importador | Exportador |
|---|---|---|---|
| Macro (botón de pago o Click) | `clsMacro` | `BotonPagoMacro` | `E_Macro` |
| PayFun | `clsPayFun` | `PayFun` (274) | `E_PayFun` |
| Pagos TIC | `clsPagostic` | `Pago_Tic` | — |
| SiPago | `clsSiPago` | `SiPago` | — |
| Helipagos | `clsHelipagos` | `Helipagos` (320) | `E_Helipagos_QR` |
| ProvinciaNet (Bapro) | `clsProvinciaNet` | `ProvinciaNet` | `E_ProvinciaNet`, `_QR` |
| ProntoPago | `clsProntoPago` | `ProntoPago`, `ProntoPago_QR` | `E_ProntoPago`, `E_ProntoPagoQr` |
| NaranjaX | `clsNaranjaX` | `NaranjaX` (272) | `E_NaranjaX` |
| OffLine | `EntidadDigital_OffLine` | — | — |

`EntidadDigital_OffLine` crea la solicitud con `API = 3`, `IMPORTE1 = IMPORTE2 = total` y vencimiento a mañana. Sirve para pagos que se confirman manualmente o por archivo.

---

## 8. Tabla por cooperativa

Hay 79 carpetas `Entidades.XXX` de cooperativas, más `PR` (genéricos) y la base. Las columnas son:

- **Rendición:** importadores propios.
- **Envío:** exportadores propios (prefijo `E_`).

Las siglas reutilizan además los formatos PR10 según la configuración de `BANCOS`. Al final de la tabla se listan las siglas sin carpeta que solo reutilizan clases PR.

| Sigla | Rendición (importadores propios) | Envío (exportadores propios) | Observación |
|---|---|---|---|
| ABAS | Bapro, RapiPago | — | Banco Provincia y Rapipago; usa RedLink_19 PR |
| ACE | BancoCordoba, Importador_ACE, RedLink | — | Bancor y Red Link |
| ACHI | PagoFacil | — | |
| AG | ProntoPago | — | |
| AL | IPLYC | — | Lotería/IPLyC; Red Link vía PR (`E_RedLink_19_7_Continuo`) |
| ALM | Banelco, Credicoop, Frances, Platino, RedLink | E_Credicoop, E_Frances, E_Platino, E_RedLink_19_11 | Débitos Credicoop y BBVA Francés |
| ALP | BancoCordoba, CobroExpress, Importador_ALP, RedLink_1, RedLink_2 | E_Banelco | |
| ANI | Bancor, Credicoop, Delfin, PagoFacil, TarjetaNaranja | E_Banelco, E_Credicoop, E_Credicoop_AdhesionDebitos, E_TarjetaNaranja | Adhesión a débitos Credicoop por archivo |
| ARR | AMA, BancoNacion, Banelco, Extra, Importador_ARR, RedLink | E_Banelco, E_RedLink | |
| AUSO | RedLink_19 | — | |
| AZUL | Credicoop, Favacard, PagoFacil_SinFac, VisaCredito, VisaDebito | E_Favacard, E_TarjetaNaranja | Tarjeta Favacard |
| BAT | — | E_Banelco_Roela | Banelco por Banco Roela |
| BEL_ | PagoFacil, Rapipago | — | |
| BERN | American, BancoNacion, BancoProvinciaMostrador, Banelco, Mastercard, PagoFacil, ProvinciaNet, RapiPago, RedLink, VisaCredito | — | La más diversa en rendiciones (12 modelos) |
| BLAS | Bapro, DebitoAutomatico | E_BancoPatagonia, E_RedLink_19_14 | Débito Banco Patagonia |
| BOL | BancoNacion, BancoPatagonia, Banelco, PagoFacil, RapiPago, RedLink, TarjetaNaranja, VisaCredito, VisaDebito | E_BancoNacion, E_BancoPatagonia, E_Banelco, E_RedLink | |
| CAU | BancoSanJuan, Data2000, Importador_CAU, PagoFacil, RedLink, TarjetaNevada | E_Data2000 | Tarjeta Nevada |
| CEN | BancoSantaFe, Mutual | — | |
| CLER | MiPago | E_DebitoDirecto | Débito directo CBU |
| CM | RedLink | — | |
| COR | — | E_PagoFacil | |
| DEAN | PagoFacil | — | |
| DEH | BancoCordoba, BancoMacro, BancoNacion, Banelco, CobroExpress, DebitoMacro, RedLink | E_Banelco, E_DebitoMacro | Débito Macro |
| DERO | — | E_RedLink_19_7 | Rendición con RedLink_19 PR (rama DERO) |
| DGRA | BancoChubut, Maestro, RapiPago | E_BancoChubut_Maestro | Débito Maestro |
| DIAZ | ProntoPago | E_ProntoPago | |
| DOL | BancoChubut | — | |
| DORM | — | E_RedLink_19_8 | |
| EA | Provicanje | — | Red Link vía PR |
| EJE | BancoCordoba, BancoNacion, Importador_EJE, TarjetaNaranja_1, TarjetaNaranja_2 | — | |
| EMPR | Corralense, Municipalidad | E_Corralense_DebitoAutomatico, E_Municipalidad, E_Municipalidad_2 | Cobro por cuenta de la municipalidad |
| EPU | RedLink | — | |
| FEL | CobroExpress, RapiPago, Secundario | E_Banelco_19_0_11, E_Rapipago | |
| FERN | PagoFacil, Ripsa | — | |
| FLOR | CobroExpress, LigaComercio, RedLink, Ripsa, Santander_DebitoAutomatico | E_RedLink | Débito Santander |
| GE | Banelco, DebitoAutomatico_Santander, Mutual, RapiPago, RedLink | E_DebitoAutomatico_Santander, E_RedLink_Continuo | |
| GMM | — | E_Bancor | |
| HA | NvoBcoSantaFe | — | |
| HER | Generica | E_DebitoDirecto | |
| HOL | BancoCordoba, CobroExpress, RapiPago, RedLink_19 | — | Envío PR `E_RedLink_19_7` |
| JAME | RedLink_19 | — | |
| JOSE | Banelco, DebitoDirecto, RedLink | E_DebitoDirecto, E_RedLink_19_14 | |
| JU | Siad | E_Siad | |
| **LAG** | **Red_Link** | — | **Laguna Larga**: ver la sección 9 |
| LIA | Credicoop, RedLink | — | |
| LP | — | E_Banelco_Roela | Red Link vía PR continuo |
| LUQ | — | E_Banelco_19_18_11_2, E_RedLink_19_18 | |
| LV | BancoCordoba, RedLink_8 | E_Banelco_19_7_Pie_16, E_RedLink_8_Continuo | |
| MA | BancoChubut | — | |
| MIR | PagoFacil, SIRO | — | SIRO propio |
| MONT | DebitoAutomatico | E_Banelco | |
| MOR | — | E_Banelco, E_RedLink | Rendición RedLink_19 PR (rama MOR) |
| MT | Banelco, BotonPagoMacro, MutualTF, RedLink | E_Banelco, E_MutualTF | |
| NON | Bancor, Pago_Facil | — | |
| NUE | — | E_RedLink_5_21_Continuo | |
| OLI | Banelco, RedLink | E_Banelco | |
| PIGU | Bapro, MacroClick, PagoFacil_ProntoPago | E_Cabal, E_Macro, E_MacroClick, E_RedLink_14 | |
| POR | — | E_Banelco_19_12_Pie_16 | |
| PUAN | Credicoop | E_Credicoop | |
| PUN | TarjetaNaranja | E_TarjetaNaranja | |
| RAW | BancoChubut, BancoMacro, BancoNacion, BancoPatagonia, Bapro, Maestro, MasterCard_Debito, PagoFacil, Patagonia365, RapiPago, RedLink, VisaCredito | E_BancoChubut_Maestro, E_Banelco_19_12_Pie_16, E_Visa_Credito | 13 rendiciones |
| RC | Cabal, Credicoop, PagoFacil, RedLink, TarjetaNaranja, Visa | E_Cabal, E_RedLink, E_TarjetaNaranja, E_Visa | |
| RP | — | E_Banelco | |
| RUF | Banelco, ComprobantesTalones | E_Banelco | Prefijos 01–03 = ID_FAC (rama RUF en `Get_Facturas`) |
| RUM | Cobro_Express, RapiPago | — | Marca solo talones en entes |
| SA | Bersa, Bersa_Debito | E_Bersa | Banco Entre Ríos |
| SAM | BancoNacion, Importador_SAM, RedLink | — | |
| SARM | BancoChubut, BancoNacion, Banelco, DatosPerosna, DebitoDirecto, DebitoPatagonia, Mastercard, MercadoPago2, PagoFacil, RedLink | E_Banelco_19_12_16, E_DebitoDirecto, E_DebitoPatagonia, E_Fiserv_Mastercard, E_MercadoPago, E_RedLink_12_Continuo | MercadoPago por archivo |
| SCM | BancoNacion, Banelco, Otros, PagoFacil, RedLink | E_RedLink_19_7 | |
| SR | BancoCordoba, Bancor_Provicanje | — | |
| TICI | — | E_Banelco_19_7_16_CB, E_RedLink_19_15_Continuo | |
| TREL | BancoChubut, Banelco, Credicoop | E_Banelco_19_7_16, E_Credicoop, E_PagoFacil, E_RedLink_TREL | |
| TRG | BancoCordoba, BancoNacion, Importador_TRG, PagoFacil, RedLink | E_RedLink | |
| UNQ | BancoNacion, Banelco, PagoFacil, TarjetaNaranja | E_Banelco, E_TarjetaNaranja | |
| VAL | BancoMacro, Bancor, Banelco, RapiPago, Red_Link, TarjetaNaranja | E_Banelco, E_TarjetaNaranja | Envío PR continuo con `PersonalizarUltimoVto` |
| VIR | Banelco, RedLink | E_Banelco, E_RedLink | |
| VM | BancoCordoba | — | |
| VRT | RapiPago | — | |
| WANDA | CobroExpress | — | |
| BAL, IV | (PR `RedLink_19`) | (PR `E_RedLink_19_7_Continuo`) | Sin carpeta propia |
| BRI | (PR `RedLink_19`, `Banelco`) | (PR `E_RedLink_19_10`, `E_Banelco_19_7_16`) | Sin carpeta |
| DGLP | (PR `RedLink_19`, DGRA `BancoChubut`) | (PR `E_RedLink_19_7_Continuo`) | Sin carpeta |
| IVG, ORD | (PR `RedLink_19`) | (PR `E_RedLink_19_7`, `E_RedLink_19_10_Continuo`) | Sin carpeta |
| SRC | (PR `Banelco`) | (PR `E_Banelco_Old`) | Sin carpeta |
| TP | (PR `SIRO`) | (PR `E_SIRO`) | Sin carpeta |
| BIAL, HOY | — | (PR `E_TarjetaNaranja`; BLAS `E_BancoPatagonia`) | Sin carpeta |

Lectura de la tabla:

- **Red Link** es el ente más extendido: está en más de 40 cooperativas.
- Le siguen **Banelco** y **Pago Fácil/Rapipago**.
- Los débitos son muy locales: Credicoop, Patagonia, Macro, Santander, Chubut/Maestro, Naranja y Visa.
- Solo MIR y TP usan SIRO por sigla, pero **SIRO es genérico** (PR10): cualquier cooperativa puede configurarlo, y la DEMO (y LAG, según `E_SIRO`) lo hace.

---

## 9. Detalle especial: Laguna Larga (LAG)

### 9.1 Qué hay en el código

- Carpeta `Entidades.LAG/` con **un solo archivo**: `Red_Link.cs` (142 líneas), un importador de rendición Red Link.
- Registrado como `Importador_Base.Modelos.FAL_RedLink = 264` con `Sigla = "LAG"`, nombre "Red Link" y formatos `*` (`Importador_Base.cs:550`). El nombre del enum ("FAL_") sugiere que se clonó del importador de otra cooperativa (FAL). Ver las dudas.
- **No hay exportador con sigla LAG.** El envío de deuda a Red Link tiene que usar un exportador genérico PR10, cuál depende de `BANCOS.COD_ARC2` en la base de LAG.
- `PR/E_SIRO.cs:134` (y `E_SIRO_Ext.cs:134`): **solo para LAG**, al armar el código de barras del registro SIRO, el convenio se antepone con "0". Esto indica que LAG **informa su deuda a SIRO** con el exportador genérico.
- `ReglasNegocio.Facturacion/clsEnargas2.cs:1402` tiene `esLAG`: LAG tiene **servicio de gas** (informes ENARGAS). Coincide con el código de servicio "GS" del importador.

### 9.2 Rendición Red Link de LAG (`Entidades.LAG/Red_Link.cs`)

`Get_Estructura` no está implementado, así que la pantalla muestra "formato no definido".

**Cabecera:**

- Convenio en (1,3), fecha `yyyyMMdd` en (4,8).
- Error si el convenio ≠ `BANCOS.CONVENIO` o si la fecha es futura (`:26-33`).

**Detalle** (`:35-43`):

| Campo | Posición | Largo | Nota |
|---|---|---|---|
| IdConcepto | 1 | 3 | Concepto Red Link |
| Cod_Sum (identificador de usuario) | 4 | 10 | Cuenta + 2 dígitos de servicio |
| Importe | 23 | 12,2 | |
| FechaCobro | 35 | 8 | `yyyymmdd` |

**Pie:** cantidad = (1,6) − 2; importe = (7,16)/100 (`:129-133`).

**Identificación del cliente y del comprobante** (`:49-127`). Es el punto clave: **LAG no identifica por número de comprobante sino por cuenta + servicio + importe**.

```text
servicio = dígitos [8..9] del identificador de 10   // 01=EN energía, 02=GS gas, 04=AG agua, 05=SV servicios
si (servicio≠0 y la cuenta de 10 dígitos no existe en SUMSOC) o (existe y servicio=2 y concepto=2):
    tipo = EN/GS/AG/SV
    cuenta = primeros 7 dígitos si es gas, si no primeros 8
factura = la más reciente de FACTURAS con COD_SUM=cuenta [y TIPO=tipo]
          y algún TOTAL1..4 = importe pagado y FECHA ≤ fecha de cobro
si no hay: igual pero por FACTURAS.USUARIO = cuenta (código del sistema anterior)
si es gas y no hay: reintenta con el identificador original de 10 dígitos (COD_SUM y USUARIO)
comprobante = "41"+ID_FAC   o   "00000000000000" (→ "Comprobante no encontrado")
```

Después sigue el flujo estándar (`LoadComprobantes_ByComprobante` y las validaciones de la sección 4.6): ya pagado, último vencimiento aceptado, diferencias de importe, entregas, notificados y bloqueados.

**Consecuencias:**

- Si dos facturas de la misma cuenta y servicio tienen el mismo importe en alguno de sus 4 vencimientos, se elige **la de fecha más reciente** (aunque esté paga). El pago de la vieja termina como "cancelado" o duplicado, y eventualmente como anticipo.
- Que el importe pagado coincida con TOTAL1..4 es lo que determina qué vencimiento se pagó. No se usa el período.
- La búsqueda por `USUARIO` muestra que el identificador publicado en Red Link puede ser el **código de usuario del sistema anterior**.

> **Confirmado en la base `PR_LAG_DEMO`.** La sigla es `LAG`. RED LINK rinde con el modelo 264 y envía con el 159 (`E_RedLink_19_10`). SIRO rinde con el 271 (integrado por API) y envía con el 140 (`E_SIRO`). DOCUMENTOS A COBRAR no tiene interfaz. El detalle está en [12-configuracion-real-laguna-larga.md](12-configuracion-real-laguna-larga.md).

### 9.3 Lo que la DEMO y el código sugieren para la configuración de LAG

- Hay tres entes visibles en la DEMO:
  - **RED LINK**: envío con un `E_RedLink_*` genérico; rendición modelo 264 (LAG) o un RedLink PR.
  - **SIRO**: envío `E_SIRO` con la rama LAG; rendición `PR/SIRO` por archivo o API, según el parámetro 2807.
  - **DOCUMENTOS A COBRAR**: no aparece en el código. Probablemente es un `BANCOS` sin modelo, usado como cartera o cuenta puente para cheques o documentos.
- En `PR/RedLink_1.cs:38-97` hay una rama para la sigla **"LAGU"**, que busca por cuenta + **período** + importe (facturas y talones). En `CapaNucleo/clsClientesProcoop.cs:262,311` figuran dos clientes con nombre "LAGU". No está claro si alguno es Laguna Larga. Ver las dudas.

---

## 10. Parámetros `Nucleo.Busca_V2_*(N)` relacionados

Los tipos de `Busca_V2` son L = lógico, I = entero, C = carácter y F = fecha.

| N | Tipo | Uso | Dónde |
|---|---|---|---|
| 2264 | C | Sigla de la cooperativa (ramas por cliente) | Todo el módulo |
| 29, 1008, 2409, 2410, 2651 | I | Anticipo por pago duplicado: concepto, vendedor y tipo de comprobante | `EntidadDigital.CrearAnticipo`, `clsEntidadesRecaudadoras.CrearAnticipo` |
| 144 | I | Habilita el pago a proveedor desde la caja | `clsCobranzaCaja.cs:353` |
| 187 | L | Avisar si el titular tiene facturas vencidas anteriores | `clsCobranzaCaja.cs:1741` |
| 242 | I | Interpretación del código de barras agrupado (socio o suministro) | `clsComprobanteFactura.cs:2273` |
| 302 / 2453 | L | Aviso de titular notificado en caja / en consulta | `clsCobranzaCaja.cs:1777`, `Importador_Base.cs:2123` |
| 321 | L | Obliga a cobrar completa la deuda notificada | `clsCobranzaCaja.cs:1660` |
| 324, 462 | L | Obliga a cobrar primero las más antiguas (462 = comparar por Vto4) | `clsCobranzaCaja.cs:1675-1678` |
| 375 | L | Ídem por tipo de factura o servicio | `clsCobranzaCaja.cs:1707` |
| 600, 606, 607, 608, 609, 621, 625, 299, 307, 372, 1002, 1011, 2356, 2363, 718, 719 | varios | Variables de consulta: recargo diario, productos de recargo e interés, discriminar el interés por vencimiento (2356), comisión de cobranza remota (718/719) | `clsCobranzas.VariablesConsulta` (`clsCobranzas.cs:399`) |
| 606, 2080, 607, 487, 360, 719, 2056, 2069, 2070 | I | Configuración obligatoria para registrar (productos y categorías bancarias; 2056 = categoría del movimiento bancario de cobranza) | `clsRegistracionCobranza.ValidarCobranza` (`:571`) |
| 727 | L | Factura electrónica posterior a la cobranza | `RegistrarPago` |
| 1030 | L | Opción de la caja | `clsCobranzaCaja.cs:574` |
| 2243 | I | Tipo de factura que se muestra como comprobante y no como período | `clsCobranzaCaja.cs:1396` |
| 2248 | I | Habilita la donación en la caja | `clsCobranzaCaja.cs:356` |
| 2263 | L | Cuotas en orden y anulación de cuotas | `clsCobranzaCaja.cs:354,1824` |
| 2296 | C | Nombre del archivo SIRO | `E_SIRO` |
| 2337 | L | Anulación de talones sumados al cobrar | `RegistrarPago` |
| 2360 | L | Anular talón sumado desde la caja | `clsCobranzaCaja.cs:355` |
| 2411 | L | Aviso de servicio desconectado | `clsCobranzaCaja.cs:1842` |
| 2543 | L | No registrar capital social al cerrar la caja | `clsCajas.CerrarCaja` |
| 2586, 2596 | L | Validar comprobantes bloqueados en la importación | `Importador_Base.cs:2156` |
| 2664, 2665, 2674, 2693, 3105 | varios | Notificación de pago por SMS o WhatsApp | `RegistrarPago` |
| 2686 | L | Incluir talones en la exportación | `Exportador_Base.Get_Comprobantes_Talon` |
| 2688 | L | Cierre de caja de varios días (solo efectivo); al anular el cierre, reabre todas las cajas del período (corregido en la segunda pasada) | `clsCajas.AnularCierreCajas` (`:662`) |
| 2713, 3106, 3112 | varios | Reconexión automática al pagar | `RegistrarPago` |
| 2784 | F | Fecha tope de las reglas de transición (BLAS, RICO) en Red Link | `PR/RedLink_19`, `RedLink_1` |
| 2803 / 3142 | I | Entidad para el QR de caja / de la terminal de autogestión | `EntidadDigital.cs:795,820` |
| 2807 | L | SIRO por API (base de deuda y pagos sin archivo) | `E_SIRO`, `PR/SIRO`, `Importador_Base.cs:1099` |
| 2818, 3006, 3047 | varios | SIRO: excluir lo ya informado, días extra de vencimiento, otros | `E_SIRO` |
| 2920–2922, 2939 | L/C | QR estático (Pagos360 / SIRO) | `clsCobranzaCaja.cs:162`, `clsPagos360`, `clsSIRO` |
| 2926, 3113, 3147, 2355 | varios | Otras validaciones de caja (`clsCobranzaCaja.cs:1885-1986`) | `clsCobranzaCaja` |
| 2952 | L | Presentar las retenciones al cerrar la caja | `clsCajas.CerrarCaja` |
| 2966 | I | Índice inicial de Red Link | `Exportador_Base.Indexar_Registro` |
| 3054, 3056, 3069, 3070, 739 | varios | Anticipo por redondeo | `clsCobranzas.cs:3225` |
| 3169 | L | Control de pagos duplicados al registrar | `RegistrarPago` |
| 3200 | L | Duplicados dentro del archivo del ente | `Importador_Base.cs:1224` |
| 901–909, 914, 2389, 2390, 2677, 2720, 2726, 2727, 2743, 2764, 2981, 2999–3002, 3059, 3073 | varios | Configuración de Pagos360 (key, URLs, mínimo, medios de pago, QR, reversiones, comisión de reversión) | `clsPagos360.Get_Config` (`:384-414`) |
| 2492–2495, 2500, 2775, 2776, 2798–2802, 2804, 2805, 3179 | varios | Configuración de SIRO (credenciales, URLs, QR, API de gestión) | `clsSIRO` |
| 186 | I | Moneda por defecto de la caja (se usa en el egreso de efectivo por pago a proveedor) | `clsRegistracionCobranza.cs:551` |
| 2362 | L | Firmar y marcar como entregadas automáticamente las órdenes de pago pagadas por caja | `clsRegistracionCobranza.cs:530` |
| 2988 | L | En la caja, solo ofrecer órdenes de pago con las firmas electrónicas obligatorias completas | `clsCobranzas.Get_PagoProveedores` |
| 1030 | L | Permite al operador cambiar el interés (recargo diario) en la caja | `clsCobranzaCaja.Cargar_Propiedades` |
| 2300, 3135, 3167 | varios | Recargo en caja: impuestos excluidos del recargo, permitir no cobrar recargo a una cuenta, recargo calculado por conceptos (`CONCEPTOS_INT`) | `clsCobranzas.Get_Datos_Factura` |
| 443, 2086 | varios | Cobro de conceptos de conexión: bloquear la modificación del importe; situación de IVA por defecto | `clsCobranzas.Get_ConceptosCobrar` |
| 674, 675 | varios | Período de control de convenios de pago | `clsFormasDePago.GetConveniosEnPeriodo` |
| 307, 308, 311 | I | Productos de mora, cuota e interés anterior al distribuir el interés de un convenio | `clsFormasDePago.DistribuirInteresEnCuotas` |
| 393, 2313, 2243, 2244, 2245, 2342, 3109 | varios | Venta prepaga: bloqueo por deuda, deuda de cuenta o titular, tipo de comprobante, importes mínimos, tolerancia de redondeo, venta por $0 | `clsPrepaga` (sección 13.8) |
| 700–704, 713, 1023, 1024, 2210–2239, 2414, 2415, 2549 | varios | Venta prepaga: retención a cuenta de deuda y bonificación a titulares sin deuda | `clsPrepaga` (sección 13.8) |
| 2759–2761, 2773, 519 | varios | Datos del QR EMVCo de Pagos360 (nombre, localidad, código postal, MCC, CUIT) | `clsPagos360.Get_QR_PagoOnLine` |
| 2762 | C | Punto de venta (POS) de NaranjaX | `clsNaranjaX` |

El catálogo completo de parámetros está en [09 — Parámetros y configuración](09-parametros-y-configuracion.md).

---

## 11. Implicancias para GoodApps

1. **Un solo motor de imputación y varios canales.** Conviene replicar la idea de Procoop: ventanilla, archivos de entes y pasarelas producen una lista normalizada de pagos y todos usan el mismo servicio de registración. Ese servicio valida, crea el recibo por cuenta y los ítems por comprobante, aplica los medios de pago, descuenta el saldo con bloqueo optimista y controla la integridad. Hay que evitar la duplicación por canal.
2. **El identificador de comprobante es un contrato.** GoodApps tiene que definir un identificador estable y autocontenido para publicar en los entes (equivalente a "41"+ID o "42"+talón) y **no depender de cuenta + importe** como hace LAG hoy. La migración de LAG tiene que mantener, durante la transición, la resolución por cuenta + servicio + importe y por el **código de usuario anterior** (`FACTURAS.USUARIO`), porque los pagos rendidos después del corte pueden traer identificadores publicados por Procoop.
3. **Formatos como plugins configurables.** Los unos 500 modelos de Procoop son en su mayoría variaciones de 6 o 7 familias (Red Link, Banelco/PMC, Pago Fácil/Rapipago/Cobro Express, SIRO, tarjetas DEBLI*, débito directo CBU, pasarelas API). Para el piloto alcanza con **Red Link (envío y rendición) y SIRO (archivo y API)**. Conviene un motor de layout declarativo (posición, largo, decimales, cabecera y pie) en lugar de una clase por cooperativa.
4. **Configuración del ente como datos** (modelo propio de `BANCOS`): convenio, concepto, caja virtual, cuenta bancaria de acreditación, último vencimiento aceptado, si permite entregas, cómo trata el recargo (diferir todo o solo la mora), comisión (fija o porcentual, con mínimo y máximo, trasladable al usuario), forma de asiento en banco y conciliación automática.
5. **Validaciones de rendición que hay que mantener:** convenio y fecha, cantidad e importe del pie, comprobante inexistente o anulado, ya pagado (distinguir "ya importado por este ente" de "pagado por otra vía", que genera un anticipo), pago fuera de término, importe mayor o menor con tolerancia, entrega mínima, duplicados en el archivo, titular notificado y comprobante bloqueado. El resultado tiene que ser un **log revisable** antes de confirmar, como hoy.
6. **Orden de aplicación en caja configurable:** obligar a cobrar las más antiguas (global o por servicio), la deuda notificada completa, las cuotas en orden y las notas de bloqueo. En un pago parcial, primero recargos e intereses y después capital. El recargo diferido genera una nota de débito posterior (coordinar con el documento 04).
7. **Caja con cierre teórico versus real** por medio de pago y moneda, quebranto automático, cajas virtuales por ente, y anulación solo con la caja abierta, en orden inverso y sin valores egresados.
8. **Pagos digitales sobre una sola tabla de solicitudes** (equivalente a `PAGOS360`, con `API`, ítems y pagos). Reutilizar los links de los últimos 10 minutos, descartar los importes mínimos, manejar reversiones como anticipos o contracargos, y registrar los débitos por tarjeta o CBU con un estado de adhesión. Para el piloto conviene priorizar SIRO (botón, QR, API) si LAG lo usa. Pagos360 y MercadoPago vendrían después.
9. **Débito automático** como atributo de la cuenta (ente, número de tarjeta o CBU, vigencia, exclusiones por tipo de factura), con procesos de novedades (alta, baja, modificación) y la rendición con códigos de rechazo.

---

## 12. Dudas abiertas

1. **Configuración real de LAG en `BANCOS`.** Hay que confirmar en la base de LAG: `COD_ARC` (¿264?) y `COD_ARC2` (¿qué `E_RedLink_*`?) del ente RED LINK; `COD_ARC`/`COD_ARC2` del ente SIRO; y si se usa el parámetro 2807 (SIRO por API). También `CONVENIO`, `ID_CON`, `DIFERIR`, `PERMITE_ENTREGA`, `FUETERBAN`, la comisión y `TIPO_REG`.
2. **Valor de la sigla (parámetro 2264) en LAG.** ¿Es "LAG", "LAGU" o "FAL"? El enum del importador LAG se llama `FAL_RedLink`. Hay ramas para "FAL" en SIRO, `E_SIRO` y `E_Macro`, y para "LAGU" en `PR/RedLink_1`. En `clsClientesProcoop` hay dos "LAGU" y un "FALD", sin nombres completos.
3. **"DOCUMENTOS A COBRAR".** No aparece en el código. ¿Es un ente sin modelo de archivo (cartera de cheques o pagarés) o una cuenta puente? ¿Se usa en LAG?
4. **Identificador publicado en Red Link por LAG.** El importador espera 8 dígitos de cuenta (7 si es gas) + 2 de servicio. Hay que confirmar con archivos reales y ver qué exportador lo genera: el genérico `E_RedLink_19_7` publica la cuenta en D7 sin servicio.
5. **Riesgo de imputación por importe.** ¿Hubo en LAG casos de pagos aplicados a la factura equivocada por importes repetidos? ¿Cómo los corrigen hoy (anulación y reimputación, anticipos)?
6. **Distribución automática de un monto en la caja.** En `ReglasNegocio` solo existe la validación del orden y el reparto recargo → capital dentro de un comprobante. Falta verificar si la interfaz (`ProcoopUI`) reparte un monto global entre comprobantes.
7. **Pasarelas activas en LAG.** ¿Usa Pagos360, MercadoPago, el botón o QR de SIRO? ¿Tiene débitos automáticos por tarjeta o CBU, y con qué ente?
8. **Comisiones y conciliación.** ¿LAG traslada las comisiones al usuario? ¿Concilia automáticamente? ¿Qué `TipoRegistracionLibro` usa?
9. **Cooperativas que aparecen solo en el enum.** Siglas como BAL, BRI, IV, IVG, ORD, SRC, TP, BIAL y HOY aparecen en los enums sin carpeta propia, y algunas carpetas tienen un sufijo raro (`BEL_`). Hay que confirmar si siguen siendo clientes, aunque no afecta al piloto.

---

## 13. Reglas adicionales (segunda pasada)

Revisión método por método de `ReglasNegocio.Cobranzas` (sin `clsGestionMora`, `clsInformes_Mora`, `clsFinanciacion`, `clsInformes_Financiacion` ni `DatosPlan*`, que van en el documento 04) y de las clases base de `ReglasNegocio.Cobranzas.Entidades`. Se agrupa por tema y, dentro de cada tema, por clase. Lo que ya estaba en las secciones 1 a 12 no se repite. Las marcas **[VERIFICAR]** indican reglas que dependen de valores de parámetros o datos que solo se pueden confirmar en la base de la cooperativa.

### 13.1 Caja: apertura, cierre, arqueo y diferencias

**`ReglasNegocio.Tesoreria/clsCajas.cs`** (complementa la sección 2):

- **Apertura** (`AbrirCaja`, `:215`). Crea `CAJAS` con la fecha (sin hora), número, usuario, observación, apertura = ahora y cierre nulo. No valida que el número esté libre: eso lo resuelve antes `Get_NumeroCaja`.
- **Datos de cierre y arqueo** (`GetDatosCierre`, `:243-410`). Toma la última `CAJAS` del número y la fecha, o de un rango de fechas si se cierra un período.
  - Errores: "La caja indicada no ha sido abierta", "La caja ya se encuentra cerrada", "Alguna de las cajas en el período indicado ya se encuentra cerrada" y "No es posible bloquear la caja" (bloqueo del registro con 4 reintentos).
  - **Teórico por medio**, a partir de las tablas de detalle de las operaciones de la caja: valores = suma de cheques de terceros; efectivo = entradas − salidas de `EFEC_OP`; cupones; retenciones; transferencias (`TRAN_OP` sin cheque) y cheques propios (`TRAN_OP` con `ID_CHEQUE`). Al efectivo y a los valores se les suman los movimientos manuales de tesorería de la caja (`TESORE.COD_BAN` = número de caja; efectivo si `COD_TIPO = 1`).
  - **Detalle por moneda**: el efectivo se agrupa por `TIP_MON`; los movimientos de tesorería se suman a la moneda 1 (pesos).
  - **Arqueo**: el efectivo real lo informa el cajero. Si no informa nada o coincide con el teórico, se toma el teórico. Los demás medios se toman siempre iguales al teórico (no hay arqueo de cheques, cupones ni retenciones en el cierre).
  - **Control de integridad**: compara el teórico de cada medio (detalle) con los totales de cabecera de `PLAN_CAJ` (`ENT_* − SAL_*`; cheques propios = −`SAL_CHP`). Si la diferencia supera 0,05, agrega el aviso "Diferencia Teórica en …". Es un aviso, no impide cerrar.
  - **Cierre de varios días**: solo se permite si en el período hay únicamente efectivo. Si hay cualquier otro medio, el error es "Solo es posible cerrar cobranzas en Efectivo" (`:403-406`). Esto corresponde al parámetro 2688.
- **Cierre** (`CerrarCaja`, `:421-625`). Rechaza si el módulo Tesorería está cerrado para la fecha. Usa un solo número de operación de tesorería para todo el cierre.
  - Efectivo teórico → movimiento de tesorería y `CAJAS.TOT_EFE`; marca los `EFEC_OP` con ese número y fecha.
  - **Diferencia de arqueo** (real − teórico) → `CAJAS.TOT_DIF` y un movimiento de tesorería por la diferencia (quebranto de ingreso o de egreso, según el signo).
  - Valores → `TOT_CHE`. Cupones de **débito** → se presentan solos (`PRESENTADO`, `NUM_PRE`, `FEC_PRE`) y generan un movimiento "Presentación de cupones" por el total negativo. Los de crédito quedan para presentar en tesorería.
  - Retenciones → `TOT_RET`; si el parámetro 2952 ("Realizar presentación de retenciones automáticamente") está activo, se presentan en el mismo acto. **[VERIFICAR]** el valor en LAG.
  - Cada transferencia (sin cheque) genera un `RESBAN` (número de depósito o de transferencia como comprobante). Si falla alguno, se revierte todo el cierre.
  - Si la caja no tuvo ningún movimiento, igual se registra un movimiento de efectivo en tesorería.
  - `CAJAS.TOTAL` solo se carga en la caja de la última fecha del período; las demás quedan en 0.
  - Tras grabar, salvo el parámetro 2543 ("No validar capital pagado en cierre de cajas"), registra el capital social pagado de cada fecha cerrada.
- **Anulación del cierre** (`AnularCierreCajas`, `:628-735`): ver la corrección en la sección 2.

**`Cobranzas/clsInformes_Caja.cs`** (informes que sirven de arqueo y rendición del cajero):

- **Informe de integridad** (`:3120`). Controla cuatro niveles: total de la operación contra la suma de sus recibos; cada recibo contra la suma de sus ítems (tolerancia 0,02); la operación contra la suma de sus medios de pago; y cada medio contra lo registrado en su tabla (`EFEC_OP`, `VALORES`, `TRAN_OP`, `RETENCIO`, `CUPONTAR`). Lista solo las operaciones con diferencias.
- **Cierre de caja teórico** (`:3174`): el mismo teórico por tabla contra los totales de `PLAN_CAJ`, en formato de reporte.
- **Fecha de cobro distinta** (`:4000`): recibos cuya fecha de pago difiere de la fecha usada para calcular el interés. Sirve para auditar cobros con fecha retroactiva.
- **Presentación de caja a tesorería** (`Get_InformePresentacion`, `:5447`). Arma el paquete que el cajero entrega al cerrar: carátula, recibos, operaciones, comprobantes cobrados, integridad, cierre teórico, efectivo, valores, cupones, retenciones y transferencias. `Set_TipoFecha` (`:5621`) permite filtrar por fecha de registración, de pago o ambas.
- **DDJJ de retenciones y percepciones cobradas (Decreto 75/2025)** (`:4826`). Genera un archivo con registros de cabecera, detalle y pie por impuesto con las retenciones (`RETENCIO`) y percepciones cobradas en el período. **[VERIFICAR]** si LAG está alcanzada.
- `GetListados` (`:408`) es el catálogo de informes de caja; `Get_InformeQR` (`:2996`) y `Get_ResumenPago` (`:5436`) son reportes del ticket QR y del resumen del pago.

### 13.2 Botonera y validaciones de la caja (`Cobranzas/clsCobranzaCaja.cs`)

- **Qué ve el cajero** (`PropiedadesCaja.Cargar_Propiedades`, `:172`). Los botones dependen del modo de cobranza y de permisos y parámetros:
  - Pago a proveedor: permiso `CobranzaPagoProveedor` y parámetro 144 distinto de 0.
  - Anular cuotas: parámetro 2263. Anular talón sumado: parámetro 2360. Donación: parámetro 2248 mayor a 0.
  - Venta prepaga: solo si existe el servicio Energía. Cuota de vivienda: permiso `CobranzaCuotaVivienda` y servicio Plan de Vivienda. Cuota de obra: servicio Cuotas de Obras. Link de pago: permiso `CobranzaLinkPagos360`.
  - En financiación, el parámetro 1030 ("Permite cambiar interés al operador") habilita modificar el recargo diario.
  - **[VERIFICAR]** los permisos y parámetros activos en LAG, porque definen qué operaciones se migran a GoodApps.
- **QR estático en la caja** (`usaQrEstatico`, `:160`): solo si el parámetro 2920 (Pagos360) o 2939 (SIRO) está activo y la caja tiene un registro en `CAJAS_QR`.
- **Advertencias al seleccionar la cuenta** (`Validar_AdvertenciasCaja`, `:2024`). Devuelve una lista de advertencias, cada una de tipo error (impide cobrar) o aviso:
  - error: comprobante bloqueado y nota de cuenta con `BLO_CAJ`;
  - aviso: nota con `MSG_CAJ`, pago parcial de deuda notificada (321), titular notificado (302), deuda antigua (324 + 462), deuda antigua por tipo (375) y titular con deuda vencida en otras cuentas (187; solo débitos).
- **Talón sumado completo** (`Validar_CobranzaLocal_Talones`, `:1983`): con el parámetro 2355 ("Exigir pago de talón sumado completo en caja") es error que falte cualquier comprobante del talón en la selección.
- **Reconexión y cambio de estado después de cobrar:**
  - `Get_SersocReconexion` (`:1872`): servicios desconectados (`CONDICION = 4`) por morosidad. Sin el parámetro 2926 ("Tener en cuenta servicios que no requieren técnica y reconectar directamente") solo se consideran los servicios con técnica que no tengan ya una orden de reconexión (`COD_TRAN = 5`) en estado 1 o 2.
  - `Get_SersocCambioEstado` (`:1905`): el parámetro 3147 define qué deuda impide el cambio (0 = toda, 1 = vencida al Vto1, 2 = vencida al último vencimiento) y el 3113 si la deuda se mira por tipo de servicio. Devuelve los servicios que quedan sin deuda una vez descontado lo cobrado. **[VERIFICAR]** valores en LAG.
  - `Get_SersocPendientesDesconexion` (`:1954`): servicios en `CONDICION = 3` con técnica y orden de desconexión por morosidad (`COD_TRAN = 3`, estado 1 o 2) de socios no dados de baja. Alimenta el aviso de orden pendiente.
- **Consultas de recibos y operaciones:**
  - `Get_NotaDebitoIntereses` (`:1024`): la nota de débito de intereses de un recibo es el primer ítem cuyo comprobante es de tipo 3 o 4.
  - `Get_InformeRecibos` (`:1040`): filtra por cuenta, fechas u operación; si el tipo es 1 parte de una factura, si es 2 de un recibo y si no, de la operación de caja. Pregunta si imprimir cuando hay más de un ticket.
  - `Get_InformeOperacionPago` (`:1140`): si la factura tiene ítems de recibo (`IT_PAGSO`) muestra la operación de caja; si tiene ítems de financiación (`IT_RECCO`), el informe de la financiación.
  - `Get_OperacionPago` (`:1162`): lista los pagos de caja y las financiaciones de un comprobante; las financiaciones se rotulan "FIN-" + número de 8 dígitos.

Métodos sin regla de negocio: `Get_PAG_SOC`, `Get_FACTURAS`, `Get_OperacionCaja` (envoltorios de consulta y reporte).

### 13.3 Pago a proveedor y otras operaciones dentro del cobro (`Cobranzas/clsRegistracionCobranza.cs`)

- **Pago a proveedor desde la caja** (privado `Registrar_PagoProveedor`, `:514-568`). Los comprobantes marcados como pago a proveedor se sacan de la lista de cobro.
  - Por cada orden de pago se registra un movimiento de tesorería "pago a proveedor en efectivo" vinculado a la orden (`TESORE.ID_PPAGOS`). La orden queda sin salida pendiente (`PPAGOS.SALIDA_PEN = false`).
  - Con el parámetro 2362 ("Firmar y marcar como entregado automáticamente las órdenes de pago por caja"), si la orden no estaba entregada se la firma (si faltaba) y se la marca entregada, con usuario y fecha.
  - Se registra una transferencia de caja de efectivo por el total negativo, con el concepto del proveedor (o "Varios Proveedores"). El egreso se agrega como un medio de pago efectivo negativo en la moneda del parámetro 186.
  - Las órdenes que se ofrecen en la caja salen de `clsCobranzas.Get_PagoProveedores` (`:2830`): órdenes no anuladas con salida pendiente; con el parámetro 2988 solo las que tienen completas las firmas electrónicas obligatorias.
- **Bloqueo de numeración** (`BloquearComprobantes`, `:473`). Antes de registrar bloquea los comprobantes de las operaciones por defecto 9 a 16 (recibos, pagos banco, intereses diferidos, comisiones, etc.) con 5 intentos de 30 s. Si no lo logra: "Otro usuario se encuentra accediendo a la información requerida". Así se serializa la numeración de recibos entre cajas.
- **Rollback de prepaga** (privado `Error`, `:492`): si falla la registración, además del rollback elimina el consumo generado y revierte la carga en el medidor de telemedición (salvo que esté indicado no anular).
- `GetFacturasAImprimir` (`:59`): de las facturas generadas en la cobranza, solo se imprimen las que no están bloqueadas con `ID_BLO = −1`.

### 13.4 Anulación de cobros y sus efectos (`Cobranzas/clsAnulacionCobranza.cs`)

Complementa la sección 3.5.

- **Búsqueda de la operación a anular** (`GetOperaciones`, `:66`). Se busca por número de operación, por comprobante o por rango de números. Por rango solo entran las operaciones sin vuelto (pago en efectivo − salida de efectivo = 0). Si no hay operación, se busca por recibo. Devuelve los totales netos por medio de pago (los cheques propios en negativo).
- **Validación de valores** (`:385-449`, precisión): "los cheques ya salieron" significa cualquier `VALORES` de la operación con estado distinto de 1 (en caja). La caja original cerrada solo se controla en operaciones de ventanilla; las de ente no lo exigen. La venta prepaga se rechaza si el crédito de retención generado ya tiene aplicaciones (saldo ≠ total).
- **Histórico** (`Guardar_Historico`, `:254`): copia la operación, los recibos y sus ítems en `ANUPLAN_CAJ`, `ANUPAG_SOC` y `ANUIT_PAGSO`, con usuario y fecha de anulación. Es la auditoría de lo anulado.
- **Talones** (`AnularTalonCuota`, `:293`; `AnularTalones`, `:285`): se borran los vínculos `TALONFAC_PAGO`. En un talón sumado (cuota 0) el saldo del talón se recalcula como la suma de los saldos de sus facturas más la entrega revertida; en una cuota (> 0), el saldo vuelve al importe original. `AnularTalones` borra los talones de una factura que no tengan pagos.
- **Banco.** Si la operación vino de un ente, el movimiento de `RESBAN` se busca por número de operación, o por cuenta del ente + fecha + movimiento 70/71 + categoría del parámetro 2056 + importe de la transferencia. Si la operación tiene una sola transferencia con número, se busca por ese número. Si no aparece: "No se encontró el movimiento bancario relacionado". El movimiento se anula por tesorería, anulando también el cheque si corresponde.
- **Cheques propios** usados como medio: al borrar la transferencia, la chequera vuelve a estado 0 (el cheque queda disponible).
- **Efectos sobre los comprobantes** (`AnularPagos`, `:451`):
  - El recibo queda en estado "A".
  - Si el recibo generó intereses diferidos, la cuota de `DEUDAVTA` y su comprobante de venta (`COMP_VEN`) se anulan.
  - Se borra el detalle de intereses del recibo (`IT_PAGSO_INTERES` y tramos).
  - Cobranza por cuenta de terceros: si la factura del tercero ya se rindió es error; si no, se borra el registro de `FACTURAS_TERCEROS`.
  - Venta prepaga: se revierte la carga en el medidor (consumo negativo), se anula el crédito de retención o se juntan los débitos y créditos como "revertidos", y los créditos por comprobantes quedan habilitados para volver a facturarse. La factura vuelve a impaga (saldo = total, pagado = 0).
  - Si el comprobante se **generó en la caja** (marca `GEN_CAJ` del ítem), la factura se anula entera, salvo que tenga CAE en un punto de venta electrónico. En ese caso, igual que en los demás: pagado −= importe aplicado + interés de financiación; saldo += lo mismo, con tope en el total y pagado nunca negativo; se restaura la fecha de saldo anterior.
  - Al final, el pago digital vinculado se desimputa (`clsPagos360.AnularCobranza`, `clsPagos360.cs:3118`): `PAGOS360_PAGOS.ID_PLA` queda nulo y la solicitud vuelve al estado 2 (pagada), lista para reimputarse.
- **Prepaga con reversión de facturas**: si la anulación revirtió facturas de prepaga, se registra automáticamente un pago nuevo (privado `RegistrarPago`, `:340`) en la caja abierta del usuario para hoy, sin intereses y sin medios de pago, para dejar cancelados los comprobantes revertidos. **[VERIFICAR]** con un caso real de LAG si tiene prepaga.
- **Pago a proveedor**: si la operación incluía un pago a proveedor, también se anula por tesorería.

### 13.5 Imputación automática, anticipos y créditos (`Cobranzas/clsCobranzas.cs`)

- **Consulta de deuda: variantes** (`Get_InfoCobranza`, `:3523`, `:3557`, `:3600`, `:3628`). Se puede pedir por cuenta y fecha (con el modo de diferir y, opcionalmente, solo los comprobantes bloqueados, `ID_BLO ≠ −1`), por tipo (deuda, comprobantes anteriores pagos, recibos, movimientos o anticipos), por lista de identificadores o por una consulta armada. En el tipo "anticipos" solo entran las notas de crédito y los créditos internos. La deuda se ordena por fecha ascendente y los comprobantes pagos, por fecha descendente.
- **Cancelación automática de créditos contra débitos** (`Get_InfoCobranza_AutoCancelar`, `:3890`; casos en `:4040` y `:4094`). Toma las cuentas con créditos y débitos abiertos (`Get_CuentasCancelacionAutomatica`, `:3823`) y aplica:
  - Si los débitos son mayores o iguales que los créditos, se aplican los créditos a los débitos por orden de VTO1. El último débito puede quedar parcial, pero solo si lo aplicado cubre el recargo y los intereses (o si se difiere todo). El sobrante se descuenta del último crédito.
  - Si los créditos son mayores, el caso es simétrico: se cancelan todos los débitos y se consumen créditos hasta ese importe.
  - Los créditos registrados en `CREDITOS_NOAUTOMATICOS` (por ejemplo, anticipos marcados con `ImputacionNoAutomatica`) quedan excluidos.
- **Créditos de anticipo** (`Get_InfoCobranza_CredAnticipo`, `:3964`): lista los créditos generados como anticipo para aplicarlos manualmente.
- **Anulación automática de pares débito/crédito internos** (`Get_InfoCobranza_AutoAnularDebCre`, `:3996`): busca un crédito interno y un débito interno sin pagos, de la misma cuenta, misma fecha, mismo total, mismo saldo, mismo VTO1 y mismo tipo, y los propone para anular juntos. Sirve para limpiar ajustes que se compensan.
- **Comprobantes con importe cero** (`Get_InfoCobranza_ImporteCero`, `:3851`): comprobantes con saldo 0 que no están marcados como pagos, para regularizarlos.
- **Anticipo por redondeo** (`Crear_Anticipo_Redondeo`, `:3225`, precisión de la sección 3.3). No se genera si la cuenta tiene débitos de redondeo previos adeudados (observación de factura "Redondeo por cobranza en efectivo"). Concepto 3054, tipo de comprobante 3056, vendedor 3069, comprobantes formales 3070, y el 739 para los no gravados en comprobantes internos. Los vencimientos son el día de hoy y el anticipo queda con imputación no automática. **[VERIFICAR]** si LAG redondea en efectivo.
- **Cobro de conceptos de conexión en caja** (`Get_ConceptosCobrar`, `:3356` y `:3375`):
  - Los conceptos salen de `CONEXION`. El precio es el segundo importe si está vigente según su fecha; si no, el importe fijo o el precio del producto con su cotización.
  - El parámetro 443 bloquea la modificación del importe; el 2086 da la situación de IVA por defecto.
  - **Bonificación por cantidad**: si la conexión tiene bonificación con cantidad máxima, se agrega un ítem negativo mientras la cantidad ya bonificada a la cuenta (`CONE_BONIF.CANT_BONIFICADAS`) sea menor que el máximo. `RegistrarBonificacion` (`:3440`) crea el contador en 1, `ActualizaBonificacion` (`:3460`) lo incrementa y `GetConexionBonificacion` (`:3454`) lo lee.
  - `GenerarComprobanteVenta` (`:3868`): si el servicio tiene una conexión de tipo 4, se emite un comprobante de venta. **[VERIFICAR]** qué significa el tipo 4 en la tabla de LAG.
- **Recargo en la consulta** (`Get_Datos_Factura`, `:2958`): el parámetro 2300 lista impuestos que no generan recargo; el 3135 permite marcar cuentas a las que no se les cobra recargo; el 3167 calcula el recargo solo sobre los conceptos de `CONCEPTOS_INT`. Los ítems de interés se clasifican por subtipo: 21 interés actual, 22 interés anterior, 23 mora, 24 capital. El cálculo en sí está en el documento 04.
- **Desglose impositivo del importe** (`InfoImporte.CalcularImportes`, `:249`; `Resetear`, `:262`): separa neto, IVA 1, IVA 2, percepción e ingresos brutos. No aplica la percepción si queda por debajo del mínimo imponible.
- **Cuotas dentro de un comprobante** (`AttachCuotasMarcadas`, `:2169`; `ActualizarTotalaPagar`, `:2184`): el total a pagar es la suma de las cuotas marcadas más su recargo; si no hay cuotas marcadas, se desmarca el comprobante.
- **Descuentos por pronto pago en caja** (`DESCUENTO_CAJA`; `Exist_Descuento`, `:4448`; `Get_MaxDescuentoCaja`, `:4454`): por tipo de factura se definen rangos de días con un porcentaje; los rangos no se pueden superponer y el máximo disponible es 100 menos la suma ya cargada. **[VERIFICAR]** si LAG tiene descuentos cargados.
- **Tasas de mora por categoría** (`Hay_Moratas`, `:2785`; `GuardarCategoriasMorata`, `:2801`): no se permiten dos tasas del mismo tipo y servicio con vigencias superpuestas que compartan categorías; al guardar se reemplazan las categorías de `MORATAS_CATSER`.
- **Comisión de caja remota** (`AplicarComisionRemota`, `:4492`): agrega al cobro la comisión de cobranza remota más el IVA del concepto.
- **Eliminación de comprobantes desde la caja** (`Eliminar_Comprobantes`, `:4394`): delega en la anulación de facturas (`clsAnulacionFacturas.AnularFacturas`), documento 02.
- **Datos extra de la cuenta** (`Get_InfoExtra`, `:4248`): débito automático, servicio desconectado o pendiente de desconexión, teléfono, medidor y domicilio, para mostrar en la caja.
- `Get_Cod_Com_Adeudados` (`:3185`): los tipos de comprobante que la cuenta tiene impagos y vencidos a una fecha. `Get_TotalPorTipo` (`:4230`): deuda vencida y no vencida. `Get_DeudaSocio` / `Get_DeudaCuenta` (`:3496`, `:3507`): suma de saldos, opcionalmente solo vencidos. `Get_FACTURAS2` (`:2889`): excluye anulados. `Get_Entidades` (`:4243`): terceros habilitados para donaciones.

Métodos sin regla de negocio: `Get_MORATAS`, `TieneCategoriasAsignadas`, `Get_Talon`, `Get_ListFacturas`, `TieneBloqueoCaja`, `Get_DomicilioServicio`, `Get_DetalleCobranza`, `Get_DescuentosCajaDataSource`, `Get_Reporte`.

### 13.6 Convenios de pago desde la caja y cuotas (`clsFormasDePago`, `clsCaidaCuotas`, `clsDeudaCuotas`)

- **Formas de pago** (`clsFormasDePago.GetCuotas`, `:316`): contado y "próxima facturación" generan una sola cuota. "Plan de pago en cuotas" y "factura en cuotas" generan la cuota 0 (entrega más sellado) y las cuotas restantes con `clsCaidaCuotas`, con quita de mora según el porcentaje de devolución y el saldo por cuota.
- **Cantidad de cuotas** (`GetCantidadCuotas`, `:257`): parte de (neto − entrega) / importe de cuota, acotado entre el mínimo y el máximo del plan (máximo 0 = 999), y busca la primera cantidad cuya cuota mayor no supere el importe pedido. Si no hay ninguna, el mensaje es "importe muy bajo".
- **Interés en cuotas** (`DistribuirInteresEnCuotas`, `:448`): usa los productos de interés anterior (311), mora (307) y cuota (308). Si el concepto de la cuota es exento (alícuota 4), el IVA es 0. `CalcularImporteIva` (`:139` y `clsCaidaCuotas.cs:241`) prorratea el IVA con o sin IVA incluido y nunca lo deja negativo.
- **Registro** (`CargarPago`, `:99`; `RegistrarPagoRapido`, `:196`): reconstruye las cuotas desde `COMP_VEN`/`DEUDAVTA` sumando capital, interés e IVA y prorrateando otros impuestos; asigna el comprobante de venta. Si es financiación, la cuota de `DEUDAVTA` es de clase 1.
- **Convenios por tipo** (`GetConveniosActivosPorTipo`, `:305`; `GetConveniosInactivosImpagosPorTipo`, `:311`; `GetConveniosEnPeriodo`, `:292`): consultan convenios activos o caídos con deuda; el período de control lo dan los parámetros 674 y 675.
- **Deuda en cuotas** (`clsDeudaCuotas.GuardarDeudaCuota`, `:17`): por cada cuota emite un comprobante con su vencimiento, importe y "cuota n de m". El mensaje de error habla de "Anular la Operación", un texto heredado que no corresponde.

### 13.7 Entidades digitales: reglas adicionales (`EntidadDigital` y subclases)

**`Cobranzas/EntidadDigital.cs`:**

- **Alta de la solicitud** (`Save`, `:651`): bloquea la tabla, asigna el número correlativo y, en SIRO, arma el identificador externo con un "8" adelante del número. El "8" coincide con el prefijo que la rendición SIRO descarta (sección 5.2).
- **Cambio de estado** (`Cambiar_Estado`, `:594`): queda en la auditoría.
- **Comprobante ya en proceso** (`Get_ComprobantePago`, `:967`): error si la factura ya está en una solicitud pagada o imputada (estado 2 o 3).
- **Diferencia de pago** (`Get_DiferenciaPago`, `:982`): para la solicitud con un único pago sin imputar, diferencia = pagado − esperado. El ente se ubica por los modelos de importación de cada API (Pagos360 166/143/153; SIRO 188, 238, 152, 144, 168, 159, 182, 177, 176, 266, 271; MercadoPago 206; Macro 115, 218, 237, 101, 200, 273; PayFun 274; Pagotic 280; SiPago 296; ProntoPago 302). **[VERIFICAR]** qué modelos tiene LAG en `BANCOS.COD_ARC`.
- **Reversión (contracargo)** (`Crear_Anticipo_Rever`, `:301`, precisión de la sección 5.4):
  - Por cada factura revertida emite un débito con tipo del parámetro 2409, vendedor 1008 y concepto exento (si el concepto está gravado, da error).
  - El importe es el total 1 o el total 2, según si la fecha de saldo era anterior o posterior al VTO1.
  - Se suma un interés diario por reversión (`CalcularInteresDiarioReversiones`, `:1103`): importe × % diario × días desde la fecha de pago o el VTO1 (la menor) hasta hoy.
  - En Pagos360 se suma la comisión de la reversión (`:1760`; parámetros 3059 y concepto 3073; importe = comisión bruta informada).
  - Puede hacerse por cuenta en lugar de por factura, y devuelve las cuentas a bloquear.
  - `GuardarCredReversion` (`:631`) vincula la solicitud con el último crédito emitido de tipo de comprobante 83, que está fijo en el código. **[VERIFICAR]** que el 83 corresponda al crédito de reversión en LAG.
- `Get_PAGOS360` (`:705`): busca por id externo según la API (`ID_360`; `ID_ENTIDAD` para PayFun, SiPago y Helipagos; `ID_SIRO` para SIRO).

**`Cobranzas/clsPagos360.cs`:**

- **Validación de lote** (`Validar_Insert`, `:1099`): error si un comprobante y cuota se repite dentro del lote. Para débitos automáticos, error si la factura ya figura en otra solicitud no cancelada; las solicitudes de tipo 7 y 9 (Cooponline) solo cuentan si su segundo vencimiento no pasó. Lista hasta 10 casos. `clsProntoPago.Validar_Insert` (`:158`) aplica la misma regla.
- **Cuentas con bloqueo** (`GetCuentasConBloqueo`, `:1058`): cuentas cuya última nota tiene bloqueo de caja; se excluyen de la generación.
- **Pagos sin solicitud** (`Importar_Pagos_Inexistentes`, `:2985`; `Crear_PAGOS360` desde la API, `:950`): si la API informa un pago que no está en la base, se crea una solicitud de tipo 6 (web) en estado 1 con los ítems tomados de la metadata o de la referencia externa del pago.
- **QR estático por caja** (`Get_Pago_QrEstatico`, `:910`): un pago al QR fijo se asocia a la solicitud de la caja solo si la fecha de pago es la de la solicitud, el importe es igual al importe 1 y el id del pago no se usó antes. `Get_Qr_Estatico` (`:1556`) crea el QR de monto cerrado de la caja (parámetros 2727, 2760, 2761).
- **QR EMVCo de pago online** (`Get_QR_PagoOnLine`, `:1599`): arma la cadena estándar con CUIT (519), nombre (2759), localidad (2761), código postal (2760) y rubro MCC (2773), con el CRC16 (`:1635`). Las credenciales y claves están en los parámetros 901 y siguientes; no se transcriben.
- **QR masivo para facturas** (`GenerarQr360`, `:2430`): requiere el parámetro 2726 y solicitudes ya registradas; procesa en lotes de 10.000 y excluye importes de 100.000.000 o más. `Registrar_QRs` (`:2150`) guarda los errores por solicitud en `QR_ERROR` y reintenta. `GenerarQrCaja` (`:2499`) completa el DNI.
- **Polling** (`InicializarTimer`, `:893`): la caja consulta el pago QR durante hasta 10 minutos. Igual en SIRO (`:1009`) y NaranjaX (`:304`).
- **Pagos desde caja y web** (`registrarPagos`, `:1658` y `:1700`; `registrarPagosWeb`, `:1721`): la solicitud web es de tipo Cobranza_Cooponline, vence mañana y el mail sale de la cuenta, de la web o de la persona, en ese orden.
- **Cancelación** (`CancelarSolicitud`, `:1801`): solo para débitos; la solicitud pasa a estado 4. `Eliminar_SolicitudesPendientes` (`:1331`) borra solicitudes pendientes con sus ítems y extras. `CambiarEstadoReversion` (`:3152`) pasa a estado 5.
- **Mapeos de medios y tarjetas** (`Get_MedioPago`, `Get_MedioPagoExcluidosOnline`, `Get_Tarjetas`, `Get_TarjetasExcluidas`, `:3036-3115`): traducen las banderas de medios de pago al formato de la API.

**`Cobranzas/clsSIRO.cs`** (complementa la sección 5.2):

- `Get_Config` (`:138`): en la base DEMO usuario y clave quedan vacíos.
- Modelos SIRO (`Get_ModelosSIRO`, `:173`; `Get_ModelosSIRO_Importacion`, `:187`): exportadores PR_SIRO y variantes por cooperativa (MT, ANI, RC, TP, LP, BAT); importadores PR_SIRO, Extendido, Alternativo e Integrado.
- **Pagos** (`Importar_Pagos`, `:368`): un pago se asocia a la solicitud por identificador SIRO e importe 1; si no existe, se crea como inexistente.
- **Base de deuda por API** (`Get_Basedeuda`, `:528`; `ActualizarBaseDeuda`, `:614`): consulta por transacción o por pendientes desde una fecha y actualiza `SIRO_BASEDEUDA`.
- **Búsqueda** (`Buscar_Solicitudes`, `:633`): por API o por archivo; un id mayor a 700.000.000 se trata como identificador SIRO y si no, como número de solicitud. `ActualizarFilas` (`:903`) convierte cada pago de la API en una fila "43" + número de solicitud de 12 dígitos para el flujo estándar.
- **QR** (`GenerarQRCaja`, `:342`): QR EMVCo de Banco Roela con CUIT, CBU y rubro 8699. QR estático (`usaQrEstatico`, parámetro 2939; `Actualizar_Qr_Estatico`, `:958`): crea la solicitud con bloqueo de tabla, terminal "QrCaja" + número; para "dejar en cero" envía importe 1. `Obtener_PagoQr` (`:1026`) deja la solicitud en estado 3. `Get_InfoSolicitud` (`:929`) busca en ±30 días.

**Otras pasarelas:**

- `clsNaranjaX` (`RegistrarPagosNaranjaX`, `:79`): solicitud API 4, tipo 1, estado 1, vence mañana, con ítems por saldo; el QR viene en la respuesta. El pago aprobado pasa la solicitud a estado 2 y crea el `PAGOS360_PAGOS` (`Obtener_PagoQr`, `:327`). El ente se ubica por el modelo importador NaranjaX de la sigla o el genérico (`Get_EntidadRecaudadora`, `:277`).
- `clsMacro.Importar_Pagos` (`:318`): rendición por archivo con número de solicitud (279,21), fecha `yyMMdd` (224,6) e importe (77,11,2). `GenerarToken` (`:294`) obtiene el token de sesión; el token persistido está en el parámetro 2768 (no se transcribe).
- `clsMercadoPago.ObtenerPagoAsync` (`:175`): busca pagos aprobados entre la fecha de la solicitud y el día siguiente al VTO1.
- `clsProntoPago.InformarQrs` (`:220`): informa solicitudes en lotes de 100 y guarda el QR devuelto. Descarta solicitudes de $10 o menos (`:155`).
- `clsProvinciaNet.GenerarQr360` (`:150`) y `ConsultarLote` (`:211`): los QR se piden por lote; los errores quedan por solicitud y por lote.
- **QR en la caja** (`GeneradorQrFactory`, `GeneradorQrBase`, `QrDinamico`, `QrEstatico`): la fábrica usa la entidad del parámetro 3142 y devuelve QR estático solo si la entidad lo soporta y la caja tiene uno; si no, dinámico. `GenerarSolicitud` reutiliza la solicitud en curso si el importe no cambió. Sin comprobantes crea una solicitud de prepaga; con comprobantes, una de talón de caja con medio QR. En el estático, `SetImporteQr` carga en el QR el total a pagar de los comprobantes y `LimpiarQr` lo deja en cero.
- `GetInforme_ComprobantePagarRecargos` (comprobante para pagar con link): implementado en Pagos360 y MercadoPago (mismo reporte con saldos, totales por vencimiento y recargos, con signo según débito o crédito) y en OffLine; en Helipagos, Pagotic, PayFun, SiPago, ProntoPago, ProvinciaNet, SIRO y NaranjaX no está implementado.

Métodos sin regla de negocio (envoltorios, virtuales vacíos o consultas): en `EntidadDigital`, `Obtener_PagoQr`, `InicializarTimer`, `registrarPagos` (×2), `registrarPagosWeb`, `GenerarQrDinamico`, `Get_Pago_QrEstatico`, `Get_StringQrEstatico`, `Buscar_Solicitudes`, `GetInforme_Detalle`, `Get_InfoSolicitud`, `CancelarSolicitud`, `GenerarQr360`, `Get_PAGOS360_PendientesEntidad`, `CambiarEstadoReversion`, `Eliminar_SolicitudesPendientes`, `Procesar_Pago`, `GetInforme_ComprobantePagarRecargos`; en `clsPagos360`, `GetHTMLRequest`, `Get_PAGOS360_PendientesEntidad`, `Obtener_PagoQr`, `Get_DetallePago`, `Get_StringQrEstatico`, `Get_InfoSolicitud`, `Registrar_Debitos` (×2), `Get_CardAdhesion_Info`, `Get_CbuAdhesion_Info`, `RegistrarQRCaja`, `GetQrCaja`, `Get_Id_Cuenta`, `GenerarQrDinamico`, `Buscar_Solicitudes`, `Buscar_SolicitudesAPI`, `Get_ExternalReferenceSolicitud`, `GetInforme_Detalle`; en `clsSIRO`, `GetConceptosPagosEnLinea`, `GetConceptosAExcluir`, `GenerarQrDinamico`, `Get_Pago_QrEstatico`, `Get_StringQrEstatico`; en `clsNaranjaX`, `Get_QRString`, `Get_Informe`; los métodos de interfaz de `GeneradorQrBase`, `QrDinamico` y `QrEstatico`.

### 13.8 Venta de energía prepaga en la caja (`Cobranzas/clsPrepaga.cs`)

- **Servicios vendibles** (`GetServiciosPrepaga`, `:570`): solo servicios de categoría prepaga en condición conectada, para un único socio identificado. Errores: "No se encontraron conexiones de Energía Prepaga" o "No se pudo identificar al socio".
- **Del importe al consumo** (`CalcularConsumo`, `:227-463`). El cajero ingresa pesos y el sistema busca los kWh cuya factura simulada (`GenerarFacturaPrepaga` en modo simulación, tipo de factura del parámetro 2243) da ese importe.
  - Parte de importe / precio unitario de la tarifa (si la categoría no tiene tarifa: error), separa los cargos fijos comparando dos simulaciones e itera ajustando por proporción, promedios y bisección, hasta 100 intentos.
  - Acepta cuando la diferencia es de medio centavo o menos. Los decimales del consumo y el máximo vendible salen del tipo de medidor (`CantidadDecimales`, `:211`; `UnidadesMaxima`, `:219`).
  - Si no hay coincidencia exacta, propone dos opciones (por debajo y por encima). Con el parámetro 2342 ("Importe máximo de redondeo automático"), si la opción superior excede en no más de ese importe, se vende directamente. `SeleccionConsumo` (`:48`) muestra las opciones. **[VERIFICAR]** valor en LAG.
- **Validaciones** (`ValidarComprobante`, `:796`): cuenta obligatoria; importe mayor a 0 salvo el parámetro 3109 ("Permitir venta de prepaga por 0 pesos"); no puede haber consumos sin facturar; importe mínimo 2245 si no hay retención, o 2244 en general (`ValidarImporteMinimoVenta`, `:906`).
  - **Bloqueo por deuda** (parámetro 393): 2 = cualquier comprobante emitido, 3/4/5/6 = vencido al Vto1/2/3/4. Con el parámetro 2313 en 1 se mira la deuda del titular, si no la de la cuenta. **[VERIFICAR]**.
- **Retención a cuenta de deuda** (`CalcularRecargo`, `:941`; `CorrespondeCalcularRecargo`, `:1004`; `CorrespondeRetener`, `:1047`). Con el parámetro 2210, parte de la venta se retiene para cancelar deuda:
  - un importe fijo (2221), un porcentaje (2222), o con el parámetro 701 un porcentaje por tipo de comprobante (`TIPO_FAC.RET_PRE`, que se carga con `GuardarTasasPrepaga`, `:891`);
  - corresponde retener si la deuda vencida de facturas supera 2213, la de financiaciones supera 2217 o la total supera 2219 (cada umbral se ignora con 2214, 2218 o 2220);
  - la deuda a analizar se arma con los días desde el vencimiento (2212 facturas, 2216 financiaciones), del titular si 700, incluyendo créditos si 704, con intereses si 713 (`Get_DeudaAnalizar`, `:1094`);
  - si se retiene el 100 % de un comprobante, la venta tiene que superar ese importe;
  - no se retiene a cuentas con excepción de mora vigente marcada para retener (`EsExcepcion`, `:1023`);
  - con el parámetro 1024 la retención es personalizada.
- **Bonificación a titulares sin deuda** (`CalcularBonificaciones`, `:920`; `CorrespondeBonificar`, `:1071`). Con el parámetro 2225 se bonifica un importe fijo (2236) o un porcentaje (2237) si la deuda no supera los umbrales 2228/2232/2234 (que se ignoran con 2229/2233/2235). Con el parámetro 2239 solo se bonifica cuando no se retiene. El parámetro 1023 la personaliza.
- **Comprobantes de la retención** (`GetCreditoPorRecargo`, `:720`; `GetDebitoPorRecargo`, `:755`; `AgregarRecargo_Bonificacion`, `:467`): la retención se documenta con un crédito (concepto 2224) y un débito (comprobante 2415) del tipo de factura 2414. Con el parámetro 702 se emite crédito interno y no nota de crédito; el parámetro 2549 permite el punto de venta 0. En la factura de venta, el recargo usa el concepto 2223 y la bonificación el producto 2238.
- `RegistraLog` (`:165`): cada operación de prepaga se registra en `COBRANZA_LOG` (auditoría, caja, cuenta, valor y descripción de hasta 200 caracteres).
- `GetFactura_Autogestion` (`:645`) y `CalculaConsumo_Autogestion` (`:651`): la misma lógica para la terminal de autogestión, con mensajes de importes alternativos redondeados a múltiplos de $5.

### 13.9 Cobranza por cuenta de terceros (`Cobranzas/clsTerceros.cs`)

- **Validaciones** (`ValidarCobranza`, `:67`; `ValidarMultiples`, `:267`): según la configuración del tercero (`TERCEROS`), no permite dos pagos del mismo comprobante si no acepta múltiples, ni importes negativos sin devolución habilitada, ni comprobantes vencidos si no acepta vencidos, ni importes menores al mínimo. La cuenta es obligatoria.
- **Registro** (`CargarCobranza`, `:99`): exige código de barras e importe. Si no se indica la cuenta, usa la cuenta asociada al tercero.
  - Crea una factura propia con los cuatro totales y los cuatro vencimientos iguales al importe y al vencimiento del comprobante, del tipo de factura del tercero. Si el tercero no tiene comprobante, se usa el de la operación según la situación de IVA de la cuenta.
  - El vínculo es `FACTURAS_TERCEROS` con la comisión: importe fijo o porcentaje según la forma de cálculo, nunca menor al mínimo.
  - La sobrecarga por código de barras (`:45`) identifica al tercero por el tipo de código de barras.
- **Resumen de tarjeta** (`GetResumen`, `:206`; `GetDatosPagosResumen`, `:248`): consulta el resumen por web service y totaliza los pagos del mes registrados con ese número de resumen.
- `LeerCodigoOSSE` (`:277`): código de barras de 40 dígitos de un tercero (OSSE). Corresponde al patrón de "otras cooperativas" y no se detalla.
- Métodos sin regla de negocio: `GetCodigoTercero`, `Get_Tercero`.

### 13.10 Entes recaudadores: reglas adicionales

**`Cobranzas/clsEntidadesRecaudadoras.cs`:**

- **Morosidad de Tarjeta Naranja** (`Archivo_Morosidad`, `:150`): solo para modelos de exportación Naranja. Valida que el comercio (1,9) sea el convenio del ente. Layout: tarjeta (1,16), importe (47,12,2), vencimiento (59,8), presentación (67,8) y cuenta (17,30) o número de cliente (23,6). `Get_InformeMorosidad` (`:246`) es su reporte.
- **Rendición de débitos Naranja** (`Importar_ArchivoDebitos`, `:265`): solo modelos con "NARANJA"; la cuenta se identifica por el número de tarjeta de la cuenta (`SUMSOC.NUM_TARJ`).
- **Novedades** (`Archivo_Novedades`, `:342`): elige el lector por el nombre del modelo (Naranja, Visa crédito, Visa débito, Pampa, Comafi). El alta toma como período el código de persona del socio. **[VERIFICAR]** que eso sea intencional.
- **Anticipo** (`CrearAnticipo`, `:747`): vendedor 1008 y concepto 29.

**`Cobranzas/clsImportacionFacturas.cs`** (alta de facturas de otro sistema para cobrarlas): `Importar_Facturas` (`:20`) falla si el archivo está vacío. Hay tres formatos: General (planilla con tipo, sucursal, número, cuenta y total), Administración Pública (sigla RAW: la columna 2 trae "RES-SUC-NUM" y el total va en la columna 6) y Comprobante Procoop (texto 2 + 4 + 8; variante EMPR por posiciones). El total lleva signo. `Get_Modelos` (`:257`) filtra por la sigla del parámetro 2264.

**`Cobranzas/clsPagosDesconectados.cs`** (`GetPagosDesconectados`, `:40`): lista los servicios desconectados (`CONDICION = 4`, con técnica y sin orden de reconexión pendiente) cuyas cuentas pagaron en el rango de fechas comprobantes de los tipos elegidos. Opciones: excluir socios dados de baja; solo bajas por mora (orden de desconexión por morosidad hasta 15 días antes de la baja); tomar el servicio desde los ítems de la factura pagada; solo cuentas sin deuda. Alimenta la generación masiva de reconexiones (`GenerarReconexion`).

**Patrón común de importador y exportador** (`Entidades/`, complementa la sección 4.2):

- **Exportador** (`Exportador_Base`):
  - El modelo del ente (`COD_ARC2`) define, por su atributo, la clase, el formato y si valida saldo.
  - Si el exportador es Pagos360 y la operación es de débitos, solo se exportan comprobantes de cuentas con débito Pagos360; en cualquier otra operación se limpia esa marca (`Get_Comprobantes`, `:800-826`).
  - Importe en texto (`Get_TextoImporte`, `:1255`): en centavos, relleno de ceros, y si es negativo el signo ocupa una posición del largo.
  - Si el archivo ya existe, se agrega un índice al nombre (`Get_ValidFileName`, `:1297`).
  - Hay dos reportes: débitos generados o archivo de facturación (`Get_InformeDebitos`, `:767`) y envío al ente (`Get_Informe`, `:786`).
- **Importador** (`Importador_Base`):
  - `ConversorFechaJuliana` (`:1109`): fecha juliana AAJJJ, siempre del siglo 2000.
  - `GetPagosComprobantes` (`:1118`): desde el log de una rendición busca el comprobante por factura o talón, primero en la deuda y, si no está, en los comprobantes ya pagos.
  - Con el parámetro 2807, los modelos SIRO por API no muestran el selector de archivo (`:1099`).
- **Descripción del layout para la pantalla**: las clases `Estructura` (`setLinea`, `setCampoFijo`, `setCabecera`, `setFilas`, `setPie`, `GetFormato`) y `FormatearEstructura` en las dos bases arman el texto con posición, largo y decimales, separado en cabecera, filas y pie. Si el modelo no lo implementa, se muestra "El formato del modelo no fue definido". Es documentación embebida y no regla de negocio, pero sirve de fuente para el motor declarativo de layouts propuesto en la sección 11.

Métodos sin regla de negocio: `Exportador_Base.Get_Entidad`, `Get_Modelos`, `Get_FiltroBusqueda`, `GetEstructurasExportadores`, `FormatearEstructura`; `Importador_Base.setCampoFijo` (×3), `setTitulo`, `setLinea` (×6), `setSalto`, `setCabecera`, `setPie`, `setFilas` (×2), `GetFormato`, `FormatearEstructura`, `Get_Modelos`.

**Formatos genéricos de `Entidades.PR`:** en esta pasada se revisaron contra el código los de Red Link, Banelco, Pago Fácil/Rapipago, SIRO, débito CBU y tarjetas, ya documentados en las secciones 5 y 6.2. No se encontraron errores. La carpeta tiene 133 clases (71 exportadores `E_*`). Las específicas de otras cooperativas siguen el mismo patrón y no se detallan.

**Laguna Larga:** el importador `Entidades.LAG/Red_Link.cs` y la configuración real de LAG se tratan en la sección 9 y en el documento 11; acá no se amplía.

### 13.11 Informes de cobranzas (`Cobranzas/clsInformes_Cobranzas.cs`)

- **Deuda a una fecha** (`Get_DeudaAlaFecha`, `:2083`): deuda = débitos − créditos.
- **Deuda retroactiva** (`Get_DetalleDeuda`, `:2303`; `Get_DetalleDeuda_Actualizada`, `:2147`): deuda a una fecha pasada = saldo actual + pagos posteriores a esa fecha. Qué fecha de pago se usa lo define el tipo: 0 fecha de pago del recibo, 1 fecha del recibo, 2 fecha de registración de la operación. Opciones: mostrar el titular vigente y filtrar por concepto (`Get_DetalleDeudaConceptos`, `:2518`).
- **Cuentas sin servicio** (`GetDatosInformeDeudaTitularesCuentaSinServicio`, `:1964`): cuentas sin servicios o con todos dados de baja (condición 4 o 5) que tienen deuda.
- **Composición contable de la deuda** (`GetDatosInformeComposicionDeudaPorCuenta`, `:2109`): agrupa la deuda por la cuenta contable del rubro (`RUB_PYS.CTA_DSSV`).
- `GetAnticipos` (`:3035`): anticipos con saldo.

Métodos sin regla de negocio (consultas de informes con filtros): `Get_ZonasServ`, `GetInformesCuentasPorCobrar`, `CargarCuentasDeudores`, `CargarRubrosDeudores`, `GetDatosServiciosPeriodo`, `GetDatosInformeEstadoServicioAsociado`, `GetDatosInformeServicioAsociado`, `GetDatosInformePorTitulares` (×2), `GetDatosInforme_AgrupadoPorCategorias`, `GetDatosInformePorCuentas` (×2), `GetDatosInformeDetalleDeuda` (×2), `GetDatosInformeCuotasPendientes`, `GetDatosInformePorPeríodo` (×2), `GetDatosInformePorPeriodoFactura` (×2), `GetDatosInformeTipoComprobante` (×2), `GetDatosInforme_ConsultaDeuda_PagoEntidad`, las seis variantes `*_Actualizada`, `GetDatosReporte`, `GetCompVent`, `GetServicios`.

### 13.12 Cheques en la cobranza (resumen transversal)

- **Cheques de terceros** (`VALORES`): ingresan como medio de pago con estado 1 (en caja). Al cerrar la caja pasan a estado 2 (fuera de la caja) y se totalizan en `CAJAS.TOT_CHE`. Una vez fuera de estado 1, la cobranza ya no se puede anular (sección 13.4).
- **Cheques propios** (`TRAN_OP` con `ID_CHEQUE`): son salidas de la operación (`PLAN_CAJ.SAL_CHP`). Al cierre se controlan aparte ("Cheques Propios") y no generan `RESBAN` en el cierre. Al anular, la chequera vuelve a estado 0.
- **Rechazos y depósito**: no están en `ReglasNegocio.Cobranzas`; los gestiona Tesorería.

### 13.13 Implicancias adicionales para GoodApps

1. **Arqueo real de todos los medios.** Procoop solo arquea el efectivo y toma el resto igual al teórico. GoodApps debería permitir declarar cheques, cupones y retenciones en el cierre y registrar la diferencia de cada uno.
2. **Anulación con efectos completos.** Una anulación tiene que revertir el banco, los talones, los intereses diferidos, el pago digital (que vuelve a "pagado sin imputar"), la cobranza de terceros y la prepaga, y guardar un histórico. También tiene que impedir la anulación si hay pagos posteriores sobre el mismo comprobante o si los valores ya salieron de la caja.
3. **Imputación automática configurable.** La compensación de créditos contra débitos por vencimiento, con la exclusión de créditos marcados como de imputación no automática, es la base para aplicar anticipos y notas de crédito sin intervención manual.
4. **Numeración de recibos serializada** entre cajas, con reintentos acotados, en lugar del bloqueo de tabla de Procoop.
