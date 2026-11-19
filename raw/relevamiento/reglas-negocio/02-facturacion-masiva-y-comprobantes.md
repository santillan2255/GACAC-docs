# 02 — Facturación masiva y comprobantes

Reglas extraídas del código descompilado de Procoop (`binarios/decompilado/ReglasNegocio/`). Las citas usan el formato `Archivo.cs:línea` relativo a la carpeta del namespace indicado. Todo lo que sigue es descripción en prosa y pseudocódigo propio; no es copia del código.

Fuera de alcance de este documento (se documentan en otros):

- Cálculo de los ítems de cada servicio (cargo fijo, tramos, prorrateo, cargos adicionales, fórmulas, anticipos y redondeo): ver [01 — Cálculo de la factura de servicios](01-calculo-factura-servicios.md). Acá solo se indica *dónde* el proceso masivo llama a `clsFacturacionServicio`.
- CAE/CAEA, WSFE, CESP, libro IVA y regímenes AFIP/ARCA: ver [03 — AFIP, facturación electrónica e IVA](03-afip-facturacion-electronica-e-iva.md). Acá solo se describe cómo la numeración marca los comprobantes como "bloqueados a la espera de CAE".
- Intereses por mora y notificaciones: ver [04](04-mora-intereses-y-corte.md). Lectura de códigos de barra en caja y entes recaudadores: ver [05](05-cobranzas-cajas-y-entes-recaudadores.md). Catálogo completo de parámetros: ver [09](09-parametros-y-configuracion.md).

Namespace principal: `ReglasNegocio.Facturacion`. Tablas principales: `FACTURAS`, `ITEMSFAC`, `FACTMES` (+ `FACTMES_COMP`, `FACTMES_CTAS`, `SFACTME`), `COMPROB`, `COMPPOS`, `PTOVENTA`, `TIPO_FAC` (+ `PARSERFA`), `GRUPOS_FACTURA`, `SITIVA`, `HISBLOQ`, `CAUBLOQ`, `ANUFAC`/`ANUITEMSFAC`, `RELACION_COMP`, `TALONFAC`, `PAGOS360*`, `PRCAGAS`, `DEUDAVTA`.

---

## 1. Conceptos y vocabulario

| Término Procoop | Qué es | Tabla |
|---|---|---|
| Cuenta / suministro | Unidad facturable de un titular (`COD_SUM`) | `SUMSOC` |
| Servicio de la cuenta | Instancia de un servicio en una cuenta (`ID_SERSOC`), con medidor, categoría, `ULT_FAC` (último período facturado), `SEC_PER` (secuencia), `CNT_FAC` | `SERSOC` |
| Comprobante | Tipo legal/interno (factura A/B/C, ND, NC, LSP, interno…), con `DEB_CRE` (1 débito, 2 crédito), `RELACION` (comparte numeración con otro), `COD_COM_ANU` (comprobante que lo revierte), `NUM_MANUAL`, `INTERNO`, `TIPO_SIT`, `COPIAS` | `COMPROB` |
| Punto de venta / sucursal | `SUC_COM` | `PTOVENTA` |
| Numerador | Último número por (comprobante, punto de venta), con flags `CAE`, `CAEA`, `CAI` | `COMPPOS` |
| "Tipo de factura" / "tipo de cuota" | Clasificación comercial (`COD_TIP`, p. ej. "EN", "FN", "SG"), que además guarda **la configuración de la facturación masiva** (servicios, filtros, vencimientos, orden) | `TIPO_FAC` |
| Grupo de factura | Permite partir la factura de una cuenta en varias (por servicio/cuota), forzar tipo de factura o forzar Nota de Débito | `GRUPOS_FACTURA` |
| Log de facturación | Una corrida masiva, con sus servicios, cuentas y rangos de numeración emitidos | `FACTMES`, `SFACTME`, `FACTMES_CTAS`, `FACTMES_COMP` |
| Factura bloqueada | `FACTURAS.ID_BLO` no nulo. Valor `-1` = pendiente de CAE. Otro valor = causa de bloqueo de cobro (`CAUBLOQ`) | `FACTURAS`, `HISBLOQ` |

Una factura tiene hasta **4 vencimientos** (`VTO1..VTO4`) con sus importes (`TOTAL1..TOTAL4`) más un **próximo vencimiento** (`PROX_VTO`, fecha estimada de la siguiente factura, que se imprime). `SALDO` arranca igual a `TOTAL1`.

---

## 2. Facturación masiva mensual

Clases: `clsFacturacionMasiva` (motor) y `clsDatosFacturacion` (parámetros de la corrida). La UI (no relevada acá) arma un `clsDatosFacturacion`, lo valida y dispara el proceso.

### 2.1 Configuración: el "tipo de factura" como plantilla

La configuración de una corrida se persiste **en el registro `TIPO_FAC`** elegido, no en una tabla aparte:

- `CargarConfiguracion(CodTpfc)` (`clsDatosFacturacion.cs:450-493`) lee de `TIPO_FAC`: servicios a facturar (`PARSERFA`), fechas de toma de estado desde/hasta (`FECD_ESTADO`, `FECH_ESTADO`), filtros de cuentas (`FILTRACUENTAS`, `FEC_ALTAS`, `ZONA`, `SECTOR`, `CONJUNTO`, `ZONAS_POSTALES`, `EMP_POSTAL`, `LOC_POSTAL`, `COD_CATSER`), `NOCOBRAENVIO`, si factura cuotas (`FACTURACUOTAS`, `TIPOCUOTA`, `FECDCUOTAS`, `FECHCUOTAS`, `INTDIFERIDOS`), si toma período por tipo (`PERIODOSXTIPO`), los 4 vencimientos y el próximo (`VTO1..VTO4`, `PROXVTO`), el tipo de factura a emitir (`TIPOFACTURA`, por defecto el propio `COD_TIP`) y el orden (`ORDEN`, por defecto alfabético).
- Las fechas se guardan **como texto** (`strFechaVto1`, `strAltasAnterioresA`…) y se resuelven con `Nucleo.GetFechaDinamica` (expresiones relativas tipo "fin de mes + 10"); ver `CargarConfiguracionPrepaga` (`clsDatosFacturacion.cs:509-514`).
- `GuardarConfiguracion` (`clsDatosFacturacion.cs:538-585`) escribe de vuelta todo eso en `TIPO_FAC` y sincroniza `PARSERFA` (borra servicios deseleccionados, agrega los nuevos).
- `Cargar()` (`clsDatosFacturacion.cs:587-613`) arma la lista de servicios con `EsMedido = TIP_REG <= 3` y `FacturarConOtros = FAC_OTR == 1`.

Parámetros de una corrida (`clsDatosFacturacion.cs:129-271`), resumidos:

- **A quién**: `FacturarA` ∈ {Todas las cuentas, Una cuenta, Varias cuentas, Cuentas de control} (`clsDatosFacturacion.cs:12-18`). "Varias cuentas" se puede cargar desde Excel con una columna `Cod_Sum` (`clsFacturacionMasiva.ImportarCuentas`, `clsFacturacionMasiva.cs:253-273`).
- **Qué**: lista de servicios con período por servicio (`ServiciosFacturar.Periodo`) y, para medidos, rango de fechas de lectura a tomar (`ConsumoDesde/Hasta`); opcionalmente cuotas de ventas (`FacturarCuotas`) por rango de vencimiento o por lista explícita (`lstCuotas`).
- **Período general** (`PeriodoGeneral`, mes/año) y **secuencia** (`Secuencia`, para facturar más de una vez el mismo período, p. ej. bimestral partido).
- **Tipo de comprobante** (`TipoComprobante` = `COD_TPFC`) y **tipo de factura** (`TipoFactura` = `COD_TIP`).
- **Vencimientos** `FechaVto1..4` y `ProximoVto`.
- **Orden de emisión**: por cuenta, alfabético, o por zona/sector/recorrido postal (`OrdenarCuentas`, `clsFacturacionMasiva.cs:1914-1924`). El orden importa porque define el orden de numeración.
- **Opcionales**: `ForzarCuadro` (cuadro tarifario histórico, con `FechaVigenciaCuadro`), `NoAplicarAnticipos`, `NoFacturaEnvio` (no cobra franqueo), `Forzar_CodCom/SucCom/NumCom` (numeración manual, solo para un comprobante), `Simulacion`, `NoGenerarLog`.

### 2.2 Validaciones previas

**De configuración** — `clsDatosFacturacion.ValidarConfiguracion` (`clsDatosFacturacion.cs:278-403`):

1. "Una cuenta" exige cuenta; "Varias cuentas" exige al menos una.
2. Período general no anterior a 5 años; `PeriodoDesde <= PeriodoHasta`.
3. Debe haber servicios seleccionados o cuotas; cada servicio seleccionado necesita período; cada servicio medido necesita rango de lecturas.
4. Si factura cuotas sin lista explícita, exige rango de fechas de cuotas.
5. Exige tipo de factura.
6. Ningún vencimiento anterior a hoy; `Vto1 <= Vto2 <= Vto3 <= Vto4`; `ProximoVto > Vto4`.
7. Los 4 vencimientos y el próximo deben ser **día hábil** (`Nucleo.EsDomingo_O_Feriado`).
8. Si `Vto4 − Vto1 > 60` días, ningún intervalo entre vencimientos consecutivos puede superar 60 días (`clsDatosFacturacion.cs:372-389`). Nota: si el total es ≤ 60 no se valida nada.
9. El submódulo Facturación no debe estar cerrado a la fecha mínima entre hoy y los vencimientos (`Nucleo.ModuloCerrado`, `clsDatosFacturacion.cs:390-401`).

**De datos** — `clsFacturacionMasiva.ValidarDatos` (`clsFacturacionMasiva.cs:503-532`):

1. Valida que estén configuradas las variables 607, 2089, 311, 307, 2247 y 543 (`Nucleo.Valida_V2`). Por el uso en otras clases, 2089 es el concepto de interés y 607/311/307/2247/543 son conceptos o cuentas necesarias para la factura (ver doc 09 para el detalle).
2. Para **cada situación de IVA** (`SITIVA`) debe poder resolverse un comprobante de débito y uno de crédito para los servicios elegidos (`GetComprobanteOperacion` con importe +1 y −1); si no, "Verifique el tipo de comprobante a generar para la Situación Fiscal X".
3. Si se forzó numeración, el número no debe existir ya en `FACTURAS`.

**Fiscales y de estado** (las llama la UI antes de iniciar):

- `ValidarCESP` (`clsFacturacionMasiva.cs:275-288`): si algún servicio a facturar liquida como servicio público ante AFIP (`SERVICIO.LIQ_AFIP == 1`), debe existir un CESP vigente hoy en `CESPAFIP`. El usuario `SysAdmin` saltea la validación.
- `ValidarLUA` (`clsFacturacionMasiva.cs:290-298`): debe existir un registro vigente en `IIBB_LUA` (padrón de Ingresos Brutos). SysAdmin la saltea.
- `ValidarElectronicas` (`clsFacturacionMasiva.cs:300-308`): devuelve *true* (hay problema) si existen facturas con `ID_BLO = -1` (pendientes de CAE) emitidas hace 3 días o más. Es una advertencia para no apilar facturas sin autorizar.
- `IniciarProceso_Th` (`clsFacturacionMasiva.cs:320-357`) rechaza el arranque si hay una registración de capital social en curso (`clsSocios_Capital.registracionCapitalEnProceso`).
- `GenerarLog` (`clsDatosFacturacion.cs:615-684`) **bloquea la tabla `FACTMES`**; si no puede, "Verifique si otro usuario está corriendo el proceso". Es el semáforo que impide dos corridas reales simultáneas.

### 2.3 Selección de cuentas

`GetIQSumsoc` (`clsFacturacionMasiva.cs:1854-1907`) arma la consulta base:

1. Excluye cuentas cuyo último registro en `SUMNOFAC` ("no facturar") está activo.
2. Según `FacturarA`:
   - Todas: si `FiltraCuentas`, aplica conjunto (`COD_CNJ`), zonas postales (`ZON_FAC`), empresa postal (`COD_EPO`), localidad postal, zona/sector de lectura del servicio y lista de categorías (solo servicios conectados, `CONDICION` 2 o 3).
   - Una / Varias / Control: filtra por las cuentas indicadas.
3. Se queda con cuentas que tengan **algún servicio seleccionado, no marcado `NOFACTURAR` y no dado de baja (`CONDICION 4`) hace más de 6 meses respecto del período**, o que tengan **cuotas pendientes** de facturar.

Luego, por lote, `CargarServicios` (`clsFacturacionMasiva.cs:1751-1812`) decide qué servicios de esas cuentas entran:

```
para cada SERSOC de la cuenta, de un servicio seleccionado y no NOFACTURAR:
    entra si: está conectado (CONDICION 2 o 3)
           o tiene consumos sin facturar (salvo servicios cotizados relacionados)
           o tiene cargos adicionales PRCAGAS pendientes del período (o sin período)
           o es baja con cobro proporcional de cargo fijo (COBRAR_CF_BAJA) dentro del período
    si es venta de prepaga: solo categorías prepagas en servicios medidos
    si FiltraCuentas y AltasAnterioresA: solo altas anteriores a esa fecha
    finalmente entra solo si:
        ULT_FAC < período del servicio
        o (ULT_FAC == período y Secuencia != 0 ...)       -- refacturación por secuencia
        o tiene consumos pendientes o PRCAGAS pendientes
```

Es decir, **la marca anti-doble-facturación es `SERSOC.ULT_FAC` + `SEC_PER`**: un servicio ya facturado en el período solo se vuelve a tomar con otra secuencia o si tiene consumos/cargos nuevos (`clsFacturacionMasiva.cs:1801-1805`). La anulación revierte esa marca (sección 7.3).

**Cuotas a facturar** — `GetDeudaFacturar` (`clsFacturacionMasiva.cs:1814-1852`): cuotas de `DEUDAVTA` sin factura (`ID_FAC` nulo) ni estado A/F, y además:

- con lista explícita (`lstCuotas`): esas cuotas;
- si no: cuotas normales (`TPCUOTA = 0`) con vencimiento hasta `FechaCuotasHasta` y no anteriores a `FechaCuotasDesde − 10 meses`, más intereses diferidos (`TPCUOTA = 1`) si se pidió; filtradas por los tipos de cuota configurados.

**Muestra para control** — `GetCuentasMuestra` (`clsFacturacionMasiva.cs:1680-1739`): elige al azar una cuenta por categoría, una por situación fiscal y una de "grandes" y otra de "pequeños consumos" (`CATE_SER.GC`), para simular antes de la corrida real ("Cuentas de control").

### 2.4 Simulación

La simulación usa el mismo motor (`GenerarFacturacion`) con `Simulacion = true`: no abre log, no numera, no ejecuta SQL; devuelve `lstFacturas` en memoria.

- `SimularFacturas(IdsSersoc, IdTipoFac)` (`clsFacturacionMasiva.cs:413-456`): simula para servicios puntuales con configuración genérica (`CargarConfiguracionGenerica`: todo vence hoy, lecturas de los últimos 2 meses).
- `SimularFacturasConCuadros` (`clsFacturacionMasiva.cs:458-491`): simula una cuenta con un cuadro tarifario forzado (para comparar cuadros).
- `GenerarFacturaPrepaga` (`clsFacturacionMasiva.cs:359-411`): venta de energía prepaga. En modo real registra un consumo "Venta de Prepaga", genera la factura y **exige que el total coincida con el simulado** (`clsFacturacionMasiva.cs:1367-1371`); si falla, elimina el consumo registrado.

### 2.5 Generación: algoritmo principal

`GenerarFacturacion` (`clsFacturacionMasiva.cs:543-745`):

```
CargaInicial():
    si no es simulación ni NoGenerarLog: abre conexión de log y crea FACTMES (bloquea tabla)
    obtiene TODAS las cuentas ordenadas; cachea nombres, socios, personas, SITIVA,
    PTOVENTA, SERVICIO, CARGOS_ADICIONALES, CONCEPTOS_INT, GRUPOS_FACTURA
    crea clsFacturacionServicio (motor de ítems, doc 01) y, si corresponde, clsFacturacionCuotas
capitaliza = existen rubros de capital (RUBCAPI) y no V2(2736)
lote = V2_Decimal(2315) o 100
mientras queden cuentas:
    toma las próximas <lote> cuentas
    CargarServicios(lote)                                  -- sección 2.3
    para cada cuenta:
        items = GetItemsFactura(cuenta)                    -- servicios + cuotas
        si algún servicio dio error -> a la lista de errores (la cuenta no se factura)
    facturas = ObtenerFacturas(items)                      -- arma comprobantes y numera
    si facturas == null -> registra error y CORTA el proceso
    si no es simulación:
        EjecutarQuery()                                    -- persiste el lote
        si falla -> CORTA el proceso
al final:
    si no se generó ninguna factura -> rollback del log
    si real y V2(2769): asigna bloqueos de cobro automáticos (sección 6)
    si capitaliza y no V2(2855): registra capital social por factura
    cierra FACTMES (FIN = ahora) y commitea el log
    dispara evento _Finish con: correcta/no, mensaje, cuentas con error, cantidad bloqueadas
```

`GetItemsFactura` (`clsFacturacionMasiva.cs:977-994`) llama a `FacturarServicios` y luego a `FacturarCuotas`. Si la variable **2443** está activa y la cuenta no tiene ítems de servicio, no agrega cuotas (no emite factura solo de cuotas).

`FacturarServicios` (`clsFacturacionMasiva.cs:996-1052`): recorre los servicios seleccionados ordenando primero los que **no** se facturan "con otros". Un servicio marcado "facturar con otros" (`SERSOC.FCT_OTR`, o por defecto `SERVICIO.FAC_OTR`) **solo se factura si la cuenta ya tiene ítems de otro servicio** (no genera factura por sí solo). Para cada `SERSOC` pide ítems a `clsFacturacionServicio.GetItemsServicio(...)` con período, secuencia y rango de lecturas (doc 01). En venta de prepaga simulada usa `GetItemsServicioMedido` con el consumo comprado. Cualquier excepción queda como error de ese servicio.

`FacturarCuotas` (`clsFacturacionMasiva.cs:1054-1127`): agrega las cuotas de la cuenta (`clsFacturacionCuotas.AgregarItemsCuotas`, `clsFacturacionCuotas.cs:376-404`) y las agrupa: las cuotas asociadas a un servicio van con ese servicio (y su grupo de factura); las de un tipo de cuota con `TIPO_FAC.GRUPOFAC` van al grupo indicado; el resto al grupo por defecto.

### 2.6 Armado de comprobantes (`ObtenerFacturas`)

`ObtenerFacturas` (`clsFacturacionMasiva.cs:1129-1517`), paso a paso:

1. **Fórmulas de cargos adicionales no finales**: resuelve en bloque las fórmulas de `CARGOS_ADICIONALES` para todos los servicios del lote (`clsEditorFormulas_Extensions.CargarFormulas`). El detalle está en el doc 01.
2. **Agrupa por (cuenta, grupo de factura)** (`clsFacturacionMasiva.cs:1155-1157`). Cada grupo es una factura candidata. Los cargos que una fórmula manda a "otro grupo" se acumulan en `objOtro` y se agregan al cambiar de cuenta (`AgregarFactura`, `clsFacturacionMasiva.cs:1519-1579`): si ya existe una factura de esa cuenta para ese grupo o tipo se suman ahí; si no, se crea otra.
3. **Criterio de emisión** (`clsFacturacionMasiva.cs:1230`): se emite la factura si algún ítem tiene importe ≠ 0, **o**, con la variable **2526**, si tiene consumos aunque el importe sea 0 (factura en cero por consumo), **o** (con **3109** y solo en simulación) si tiene importes.
4. `AgregaFactura` (`clsFacturacionMasiva.cs:1603-1678`) crea la factura:
   - Grupo 0 → toma el grupo cuyo `COD_TPFC` es el tipo de la corrida. Si el grupo tiene `FORZAR_ND`, el comprobante será Nota de Débito en vez de Factura.
   - Si el grupo tiene tipo de factura propio (`GRUPOS_FACTURA.COD_TPFC`), la factura toma ese tipo (salvo prepaga).
   - Período: el general, o el del tipo de factura si `TomarPeriodoXTipoDeFactura`.
   - Cabecera, ítems, impuestos y vencimientos los arma `clsFacturacionServicio.GetFactura(...)` (doc 01), recibiendo los 4 vencimientos y si se cobra envío.
   - **Comprobante** por `clsComprobante.GetComprobanteOperacion` (sección 3.2) con el total.
   - **Total negativo**: invierte signos de todos los ítems y cambia `Deb_Cre` (pasa a ser crédito) (`clsFacturacionMasiva.cs:1647-1651`).
   - **Punto de venta**: el de prepaga del usuario si es venta de prepaga; si no, `GetPuntoVenta` (sección 4.2).
5. **Cargos finales**: si existen cargos adicionales marcados `FINAL` para el tipo (o en el cuadro histórico forzado), se resuelven fórmulas *sobre la factura ya armada* y se agregan ítems (`clsFacturacionMasiva.cs:1260-1322`).
6. **Generación distribuida / energía inyectada** (`clsFacturacionMasiva.cs:1289-1297` y `1581-1601`): si la variable **3094** define un concepto, la factura da negativa y el servicio 1 tiene consumos de tipo de energía "A" donde lo inyectado supera lo consumido, en vez de emitir una nota de crédito se agrega un ítem "Crédito por energía inyectada" como **anticipo a futuro** (`FacturacionFutura`) que neutraliza el total.
7. **Anticipos y redondeo**: `clsFacturacionServicio.AgregaAnticipoyRedondeo` (doc 01), salvo `NoAplicarAnticipos`.
8. **Total negativo después de cargos finales**: busca el comprobante "de anulación" del actual (`COMPROB.COD_COM_ANU`, o el inverso), cambia el comprobante, invierte importes y `Deb_Cre` (`clsFacturacionMasiva.cs:1300-1317`).
9. **Prepaga** (`clsFacturacionMasiva.cs:1340-1381`): redondeo especial (variable **2342**), recargo/bonificación por forma de pago; con **2413** el recargo neto va en una ND separada; si no, dentro de la factura. Valida total contra el simulado.
10. **Numeración y SQL** (solo modo real, sección 4.3).

### 2.7 Persistencia, lotes y transacciones

No se usa el ORM para insertar facturas: cada factura se convierte en **texto SQL** (`clsComprobanteFactura.Get_Factura(..., GeneraQuery_Masiva: true)`), con `@IdFactura = @@IDENTITY` para encadenar ítems, observaciones, anticipos y actualizaciones de `CONS_SER`, `DEUDAVTA`, `PRCAGAS`, `INTERNAC` (`clsComprobanteFactura.cs:1156-1163`, `1208-1222`, `1321-1372`).

- Las queries se agrupan de a **300 facturas** por bloque (`clsFacturacionMasiva.cs:1486-1496`).
- Cada bloque va envuelto en `BEGIN TRAN / TRY / COMMIT / CATCH ROLLBACK` y, ante error, ejecuta el SP `GrabarError` y `RAISERROR` (`InicioQuery`/`FinalQuery`, `clsFacturacionMasiva.cs:1741-1749`).
- `EjecutarQuery` (`clsFacturacionMasiva.cs:882-975`) ejecuta primero inserts/updates pendientes del contexto (en bloques de 1000 updates), después los bloques de facturas, todo dentro de una transacción por lote; al commitear, hace `SubmitChanges` de la **conexión de numeración** (que mantuvo bloqueados los registros de `COMPPOS`).
- Hay **tres conexiones**: la de lectura/armado, la de numeración (`objConexionNumeracion`) y la del log (`objConexion_Log`, transacción abierta durante toda la corrida, que mantiene el bloqueo de `FACTMES`).

Consecuencias importantes:

- **El commit es por lote**: si falla el lote N, los lotes 1..N−1 quedan grabados y el proceso se detiene (`clsFacturacionMasiva.cs:623-637`). La corrida puede quedar parcial; el log igual se cierra si se generó al menos una factura.
- El commit de facturas y el de numeración son dos commits distintos: si el segundo fallara, quedarían facturas grabadas con `COMPPOS` sin actualizar (`clsFacturacionMasiva.cs:957-973`).

### 2.8 Hilos y avance

- La corrida real corre en **un único hilo de fondo** (`IniciarProceso_Th`, `clsFacturacionMasiva.cs:320-357`); no hay paralelismo entre lotes. El hilo replica el skin de DevExpress y activa/desactiva un timer en la ventana principal.
- El avance se informa con eventos de `ClaseBase_WithProgressEvents`: mensajes por lote ("Analizando Grupo n de m", "Se generaron X facturas – Total general Y") y un máximo de pasos = cuentas × 2 + 50 % para la grabación (`clsFacturacionMasiva.cs:571-595`).
- `GetCantidadGrupos` (`clsFacturacionMasiva.cs:493-501`) estima la cantidad de lotes para la UI (usa redondeo bancario, mientras que el bucle usa techo: puede diferir en uno).
- El evento `_Finish` devuelve una tabla de errores por servicio (servicio, cuenta, nombre, domicilio, medidor, error) (`clsFacturacionMasiva.cs:147-197`).

### 2.9 Log de la corrida y cierre

`FACTMES` guarda: período, secuencia, usuario, tipo, a quién se facturó, todos los filtros, cuotas, vencimientos, tipo de factura, orden, inicio y fin (`clsDatosFacturacion.cs:615-684`). Hijos:

- `SFACTME`: servicio, período y rango de lecturas usados.
- `FACTMES_CTAS`: cuentas, cuando fue "una" o "varias".
- `FACTMES_COMP`: **rango de numeración emitido por comprobante y punto de venta** (desde/hasta), más si requiere CAE. Se consulta con `GetComprobantesGenerados` (`clsDatosFacturacion.cs:702-715`).

`CargarCuentas`/`CargarServicios(FACTMES)` permiten re-cargar una corrida anterior (`clsDatosFacturacion.cs:717-743`). `GetFechaProximaFacturacion` propone la próxima fecha: último día del mes + 10, o un mes después de `TIPO_FAC.FECH_ULTFAC` si fue hace menos de 60 días (`clsDatosFacturacion.cs:686-700`).

Al cierre, si la variable **2769** está activa, se re-aplican bloqueos de cobro: para cada cuenta que tenga alguna factura bloqueada (causa ≠ −1), las facturas de hoy sin bloqueo reciben la causa mínima de esa cuenta (`clsFacturacionMasiva.cs:675-704`). Si hay rubros de capital y no está **2855**, se registra capital social sobre lo facturado (`clsFacturacionMasiva.cs:705-719`).

---

## 3. Tipos de comprobante y letras

### 3.1 Modelo

- `COMPROB` define cada comprobante; la letra (A/B/C/M) no es un campo lógico separado sino parte de cada código de comprobante (los códigos AFIP 1/2/3 = A, 6/7/8 = B, etc.), y `SITIVA` dice qué comprobante corresponde a cada situación de IVA.
- `TipoComprobante` (`TipoComprobante.cs`) **no** es la letra: es el tipo de documento identificado por un código de barras (Ninguno, Factura, Notificación, Talón, Entidad digital/Pagos360).
- `Comprobantes_Venta` (enum de núcleo): Factura, Nota de Débito, Nota de Crédito, Ticket fiscal.

### 3.2 Resolución del comprobante — `GetComprobanteOperacion`

`clsComprobante.cs:192-265`, con el importe redondeado a 2 decimales:

```
si algún servicio de la factura liquida como servicio público AFIP (LIQ_AFIP = 1):
    importe < 0 -> SITIVA.CSP_DEF  (crédito servicio público / LSP)
    si no       -> SITIVA.SPU_DEF  (factura servicio público)
si algún servicio tiene comprobante propio (SERVICIO.COM_FAC si importe > 0, COM_CRE si < 0)
   y todos coinciden en uno solo -> ese
si no:
    ajusta tipo: importe < 0 y era Factura/ND -> Nota de Crédito; importe > 0 y era NC -> Factura
    esMiPyME = cuenta MIPYME y |importe| > |V2(2515)|  (umbral FCE MiPyME)
    Factura: TIPO_FAC.COD_COM si está; si no, MiPyME -> COM_FAC_MIPYME; si no COM_DEF; si no 1
    NC:      MiPyME -> COM_CRE_MIPYME; si no CRE_DEF; si no 5
    ND:      MiPyME -> COM_DEB_MIPYME; si no DEB_DEF; si no 3
    Ticket:  SITIVA.COD_COM; si no 90
devuelve 0 si no pudo resolver (y ValidarDatos aborta)
```

Otras funciones: `GetComprobanteDefault(Operaciones_default)` (comprobante por defecto de una operación, `COMPROB.OPE_DEFAULT`) y `GetComprobanteOperacion(Operaciones)` vía `OPE_COM` (`clsComprobante.cs:160-185`). `ValidarComprobanteSitIva` verifica que el comprobante elegido sea alguno de los configurados en la situación de IVA (`clsComprobanteFactura.cs:735-750`).

### 3.3 Validaciones de un comprobante individual

`clsComprobanteBase.Validar` (`clsComprobanteBase.cs:222-226`): cuenta obligatoria, punto de venta ≠ 0 (salvo **2549**), número ≠ 0 si no es autonumérico, comprobante ≠ 0, año entre 1997 y 2050, al menos un ítem, ninguna cantidad 0, total no negativo.

`clsComprobanteFactura.Validar` (`clsComprobanteFactura.cs:690-733`) agrega, en orden:

1. Número manual no repetido.
2. Tipo de factura obligatorio.
3. `Vto1` no anterior a hoy ni posterior a hoy + **V2(2271)** días.
4. Con **739**: un comprobante `INTERNO` no puede llevar conceptos gravados.
5. `COMPROB.TIPO_SIT = 1` → solo para Responsables Inscriptos y Monotributistas; `TIPO_SIT = 2` → no válido para RI.
6. Un ítem de anticipo (producto subtipo 8) va solo, con el comprobante por defecto de "débito anticipos de titulares" y con producto exento.
7. Ninguna alícuota con base imponible negativa.
8. Módulo de facturación no cerrado a la fecha.
9. Comprobantes de crédito requieren el permiso `Generar_Creditos`.
10. Descuento exige concepto de descuento (**2564**).
11. Si el total supera **V2(3080)**, pregunta al usuario (es un `MessageBox` dentro de la capa de negocio).

---

## 4. Numeración y puntos de venta

### 4.1 Numerador `COMPPOS`

- La clave es (comprobante, punto de venta). Si un comprobante tiene `COMPROB.RELACION`, **usa la numeración del comprobante relacionado** (por ejemplo FA y ND A comparten talonario) (`clsComprobante.cs:615-645`, `694-705`).
- `NuevoNumero` (`clsComprobante.cs:694-749`): abre transacción en la conexión de numeración, **bloquea el registro de `COMPPOS`** (hasta 5 reintentos; luego "Demasiados intentos de bloqueo… Se cerrará el sistema"), incrementa `ULT_NUM` o lo fija al número forzado. Si no existe el numerador, bloquea la tabla y lo crea (y crea el `PTOVENTA` "Automático" si falta) (`clsComprobante.cs:473-488`, `562-587`).
- `GenerarComppos(SucCom)` crea en bloque los numeradores faltantes para un punto de venta (`clsComprobante.cs:589-608`).
- `ValidarNumcomEnFacturas` (`clsComprobante.cs:767-783`): si el número ya existe en `FACTURAS` (también para el comprobante relacionado), devuelve máximo + 1. Se usa para "auto-reparar" numeradores desfasados.

### 4.2 Punto de venta — `GetPuntoVenta`

`clsComprobante.cs:443-471`:

```
si V2(2549) y el comprobante tiene PTOVTA0 -> 0
si algún servicio de la factura tiene punto de venta propio (SERVICIO.COD_POS):
    si todos coinciden -> ese; si hay dos distintos -> error "2 o más servicios con puntos de venta diferentes"
si el usuario tiene punto asignado -> ese
si el equipo (PC) tiene punto -> ese
si no -> punto de venta de la empresa
```

### 4.3 Numeración en la masiva

`clsFacturacionMasiva.cs:1382-1515`. Para ser eficiente, no bloquea `COMPPOS` por cada factura:

```
para cada factura del lote (en el orden de emisión):
    si hay numeración forzada: solo se permite si el lote generó 1 comprobante
    si no:
        clave = (comprobante de numeración = RELACION o el propio, punto de venta)
        si ya hay un rango abierto para la clave en FACTMES_COMP:
            número = hasta + 1   (en memoria)
            copia del rango los datos de CAE / CAI / tipo de autorización
        si no:
            número = NuevoNumero() (bloquea COMPPOS), verifica contra FACTURAS
            abre un rango FACTMES_COMP con desde = hasta = número
    si autorización CAE (tipo 2) y alguna alícuota tiene base negativa -> aborta el lote
    genera el SQL de la factura; si queda con ID_BLO = -1 cuenta como "bloqueada"
al terminar el lote: fija COMPPOS.ULT_NUM = hasta de cada rango y guarda los rangos en el log
```

La numeración es **estrictamente secuencial dentro del lote, en el orden de cuentas elegido**. Si el lote falla, la conexión de numeración hace rollback y los números no se consumen.

### 4.4 Tipo de autorización resultante

Al pedir número (`clsComprobante.cs:796-861`), según el numerador:

- `COMPPOS.CAEA`: busca un CAEA vigente en `CESPAFIP` para la fecha; si hay, lo asigna (tipo CAEA). Si no hay y el numerador también es CAE, queda bloqueada.
  - *Corrección (segunda pasada)*: el filtro real del CAEA es `CAEA y FEC_INI <= Fecha <= FEC_FIN y VTO_CESP <= Hoy`, es decir, exige que el vencimiento del CAEA **ya haya pasado o sea hoy**. Es la condición inversa a la de la rama CESP, que pide `VTO_CESP >= Hoy` (`clsComprobante.cs:822-837` contra `:850-860`). Puede ser un bug o una convención de carga de `CESPAFIP` **[VERIFICAR]**. Además, cuando no se encuentra CAEA y el numerador es CAE, la factura queda `Bloqueado` pero con `TipoAutorizacion` nulo (no se marca como CAE) (`clsComprobante.cs:833-836`).
- `COMPPOS.CAE`: la factura nace **bloqueada (`ID_BLO = -1`) esperando CAE** (tipo CAE). La autorización posterior la documenta el doc 03.
- `COMPPOS.CAI`: asigna el CAI actual y su vencimiento (comprobante preimpreso/autoimpresor).
- Comprobante de servicio público con CESP vigente: asigna el CESP (tipo CESP).

En la masiva, si quedaron facturas bloqueadas por CAE se desactiva el envío automático `clsFacturacionElectronica.RegistrarFacturasAuto` para ese lote (`clsFacturacionMasiva.cs:884-887`).

---

## 5. Vencimientos

### 5.1 Fechas

Las 4 fechas y el próximo vencimiento vienen de la configuración de la corrida (sección 2.2). En comprobantes sueltos (`RegistrarCabecera`, `clsComprobanteFactura.cs:2093-2133`) las cuatro fechas son hoy. `Guardar(cantidad)` permite emitir N comprobantes consecutivos sumando un mes a `Vto1` en cada uno (`clsComprobanteFactura.cs:757-778`).

### 5.2 Importes del 2º, 3º y 4º vencimiento

`CalcularVencimientos` (`clsComprobanteFactura.cs:618-623`): si un vencimiento no es posterior al anterior, repite el importe anterior; si no, llama a `Get_ImporteFactura` según el **tipo de interés de la variable 74** (`clsComprobanteFactura.cs:1771-1793`). La tasa o monto sale de la variable **578**; al recargo se le suma el IVA del concepto de interés **606** según la situación de IVA del titular (`CalcularIVA_Interes`, `clsComprobanteFactura.cs:1918-1927`).

| Modo (V2 74) | Regla (T = total, r = V2 578) | Cita |
|---|---|---|
| Fijo en pesos | Vto2 = T + r; Vto3 = T + 2r; Vto4 = T + 3r (sin IVA) | `:1826-1837` |
| Fijo porcentaje | Vto2 = T·(1+r%) + IVA; Vto3 y Vto4 se capitalizan sobre el anterior | `:1803-1824` |
| Variable porcentaje | T + T·r%·(días entre Vto1 y el vto) + IVA | `:1795-1801` |
| Tramas por importe | Busca en `TRAMASREC` la trama cuyo rango de importe contiene T (por tipo de factura o genérica); recargo = T·valor%·días (o 1 si `TIPOVALOR = 1`) + IVA | `:1839-1869` |
| Trama por vencimiento | En `TRAMASREC`, la fila con rango 1–1 es para Vto2, 2–2 Vto3, 3–3 Vto4 (o la primera genérica); recargo = T·valor%·días + IVA | `:1871-1916` |

Regla de consistencia: al refrescar totales, si `Total2 < Total` se igualan los tres totales posteriores al total (`clsComprobanteFactura.cs:2164-2173`).

Redondeo: si **V2(21)** está desactivada (`RedondearTotal = true`), la fecha de emisión ≠ Vto1 y no es CAE, los 4 totales se redondean a 2 decimales (`clsComprobanteFactura.cs:610-613`, `797-804`).

En la masiva, los vencimientos y sus importes los calcula `clsFacturacionServicio.GetFactura` usando estas mismas reglas (doc 01).

---

## 6. Bloqueo de facturas

Hay dos usos de `FACTURAS.ID_BLO`:

1. **`-1` = pendiente de autorización electrónica**. Lo asigna la numeración (sección 4.4). Ninguna operación manual de bloqueo lo pisa: los UPDATE filtran `isnull(ID_BLO,0) <> -1` (`clsComprobanteFactura.cs:2565`) y la consulta de facturas bloqueables excluye las −1 (`:2480`).
2. **Causa de bloqueo de cobro** (`CAUBLOQ`): una factura bloqueada no se cobra en caja (la regla de caja está en doc 05).

Operaciones:

- `Get_FacturasBloqueo(filtros)` (`clsComprobanteFactura.cs:2477-2530`): impagas (`PAGA = ''`), filtrables por cuenta, titular, tipo, emisión y vencimiento. DTO `FacturasBloqueadas` (`FacturasBloqueadas.cs`) y filtros `FiltrosFacturasBloquear` (`FiltrosFacturasBloquear.cs`).
- `Asignar_Bloqueo(ids, causa)` (`clsComprobanteFactura.cs:2538-2590`): UPDATE en bloques de 500 + **historial `HISBLOQ`** (fecha, causa, usuario) por factura. Causa nula = desbloquear.
- `Asignar_Bloqueo_ConIntereses` (`clsComprobanteFactura.cs:2592-2635`): bloquea y, en la misma transacción, emite una factura de intereses (`clsRegistracionCobranza.Generar_Factura_X_Intereses`).
- `BloquearDesbloquearComprobantes` (`clsComprobanteFactura.cs:2135-2162`): alterna (si no tenía bloqueo, lo pone; si tenía, lo quita) desde la pantalla de cobranzas.
- Propagación automática al cerrar la masiva con **2769** (sección 2.9).

---

## 7. Anulación, notas de crédito y reversión

Clase: `clsAnulacionFacturas`.

### 7.1 Validaciones (`ValidarAnulacion`, `clsAnulacionFacturas.cs:386-515`)

Para **una** factura:

- No anular algo ya anulado (`ESTADO = 'A'`), salvo que se pida eliminar.
- Eliminar no se permite si tiene pagos (`IT_PAGSO`) ni financiaciones (`IT_RECCO`).
- **Autorizada en ARCA** (`CAE` no vacío y `TP_CODIGO = 2`): no se puede eliminar; si se pide anular, avisa que **se generará otro comprobante para revertirla** y pide confirmación.
- Incluida en una solicitud de cobro externa Pagos360: si el estado de la solicitud no es 0, 1 o 4, no se puede eliminar; si lo es, pide confirmación.

Para **varias**:

- Las que tienen pagos se excluyen (con confirmación) y se listan en "comprobantes excluidos".
- Si alguna está autorizada en ARCA: error (no se anulan electrónicas en masa).
- Pagos360 igual que arriba.

Para todas:

- Las de fecha ≤ **cierre del módulo Facturación** se excluyen (una sola: error con la fecha de cierre).
- Si hay facturas con `ID_BLO = -1` (esperando CAE): doble confirmación ("esta operación no puede revertirse").
- Las de venta de prepaga se excluyen en masa.
- `AnularFacturas` además filtra nuevamente sin pagos, posteriores al cierre y no prepaga (`clsAnulacionFacturas.cs:93-99`).

Validaciones auxiliares: `ValidarCapitalizacionEnFacturas` (si tocan rubros de capital, `:366-384`), `ValidarCreditosGenerados` (una factura no puede revertirse dos veces: si en `RELACION_COMP` ya hay un comprobante de signo opuesto y mismo total, error, `:996-1061`), `ValidarCespLQSP` (para revertir servicios públicos debe haber CESP vigente, `:1063-1075`), `VerificarAnticipos` (un anticipo ya utilizado no se anula, `:685-693`).

### 7.2 Anular vs. revertir

`FinalizarAnulacion` (`clsAnulacionFacturas.cs:695-768`) decide:

```
siempre: libera lo que la factura consumió
    CONS_SER -> sin factura, FACTURADO = ''   (los consumos de prepaga se borran)
    INTERNAC, LLA_CEL, PRCAGAS -> sin factura
    DEUDAVTA -> sin factura, estado ''        (las cuotas vuelven a quedar pendientes)
    PRESUPU -> estado 'P'
    ANTICIPOS -> devuelve el saldo aplicado (ANTIFACTU)
    borra MOV_PRO de facturación, CAPITAL, FACTURAS_TERCEROS, TALONFAC, COMPNOTI,
          OB_FACT, ANTIFACTU, ANTICIPOS, FAC_EXTRAS
si PAGADO = 0 y (sin CAE o el punto de venta no es CAE o es prepaga):
    copia cabecera e ítems a ANUFAC / ANUITEMSFAC (auditoría, con usuario y fecha)
    borra ITEMSFAC
    si "eliminar": borra RELACION_COMP, PAGOS360_ITEMS y la FACTURA
    si no: FACTURAS.ESTADO = 'A' y todos los totales, saldo y anticipo en 0
si no (electrónica autorizada o con pagos):
    REVERTIR: emite un comprobante inverso (sección 7.4)
```

Todo se arma como SQL por factura con su propio `BEGIN TRAN/TRY/CATCH` y se ejecuta en bloques de 500 (`clsAnulacionFacturas.cs:107-154`, `517-537`).

### 7.3 Efectos sobre el servicio facturado

- `AnularSersoc` (`clsAnulacionFacturas.cs:565-648`): por cada `SERSOC` facturado, `CNT_FAC − 1`; si queda en 0, limpia `ULT_FAC` y `SEC_PER`; si la factura era la última (mismo período y secuencia), **retrocede la marca**: con secuencia 2 → 1; con 1 → 2 y período − 1. Para obras (`TIP_CAL = 17`) descuenta cuotas pagas y unidades facturadas; para viviendas descuenta el porcentaje facturado según el precio vigente de `PRECIOSVIV`.
- `DevolverFranqueo` (`clsAnulacionFacturas.cs:539-563`): si la factura cobró franqueo (producto subtipo 17) y era el último envío registrado en la cuenta, retrocede `SUMSOC.SEC_EPO`/`PER_EPO`.
- `AnularRedondeo` (`clsAnulacionFacturas.cs:650-683`): devuelve al acumulador de redondeo de la cuenta (`DEUDARED`, o `DEUDARED_TIPO` por tipo de factura) lo que la factura había aplicado.

### 7.4 Comprobante de reversión (NC/ND)

`CargarQueryRevertirFactura` (`clsAnulacionFacturas.cs:770-993`) elige el comprobante:

```
si es CVLP con número indicado -> comprobante por defecto "CVLP Débito"
si se fuerza LSP              -> SITIVA.CSP_DEF de la cuenta
si se fuerza electrónica      -> SITIVA.CRE_DEF
si el comprobante tiene COD_COM_ANU -> ese
si no, por la situación de IVA de la cuenta:
    era NC por defecto   -> ND por defecto
    era crédito SP (CSP) -> factura SP (SPU), y viceversa
    era factura o ND     -> NC por defecto
si no resuelve -> error
```

El comprobante nuevo es un **clon de la factura** con fecha hoy, vencimientos hoy (o los indicados), los 4 totales = `TOTAL1`, saldo pleno, impago, automático, número nuevo (o el CVLP indicado) e ítems copiados. Se vincula en `RELACION_COMP` (origen = factura anulada, generado = nueva). Las opciones (`OpcionesCreditosXComprobantes`, `clsAnulacionFacturas.cs:15-61`) permiten:

- **Revertir consumos**: inserta un `CONS_SER` espejo con consumo negativo y estados invertidos (fechas de lectura opcionales). Con "permitir volver a facturar" inserta además una copia del consumo original **sin facturar**, para que la próxima masiva lo vuelva a tomar; si no, retrocede el estado de lectura del `SERSOC` (`clsAnulacionFacturas.cs:866-922`).
- **Liberar créditos/débitos**: devuelve anticipos y libera cuotas, cargos, internacionales y llamadas.
- **Revertir stock** de productos que llevan stock (entrada, salvo comprobantes 5, 6, 83 y 92).
- "Permitir volver a facturar" también aplica `AnularSersoc` y `DevolverFranqueo`.

`CreditosporComprobantes` (`clsAnulacionFacturas.cs:231-318`) aplica esto en masa (bloques de 100) desde la pantalla "créditos por comprobantes". Las fechas de vencimiento de la NC no pueden ser anteriores a hoy ni desordenadas (`Validar`, `:56-60`).

### 7.5 Relación manual entre comprobantes

`Get_Comprobantes(ID_FAC, días)` lista los comprobantes de la misma cuenta, no internos ni anulados, de los últimos N días, marcando los ya relacionados; `Guardar_RelacionComprobantes` graba o borra vínculos en `RELACION_COMP` con las marcas `ANULACION` e `INFORMAR_CUIT` (necesarias para informar comprobantes asociados a ARCA) (`clsComprobanteFactura.cs:2637-2764`).

---

## 8. Recategorización

Clase: `clsRecategorizacion`. Cambia la categoría de servicios según consumo. Tres modos (`clsRecategorizacion.cs:17-54`):

1. **Energía por porcentaje de ahorro** (`Get_Recategorizacion_Energia`, `:214-272`): compara consumo del período actual contra un período de comparación (opcionalmente en consumo diario). `Ahorro = 100 − actual/anterior·100`. Si el ahorro es ≥ 0, la nueva categoría es la del mismo grupo (`COD_GRC`) cuyo rango `MIN_GRC..MAX_GRC` contiene el ahorro. Si es negativo (consumió más), se desplaza desde el mínimo de la categoría actual; si queda igual, no cambia.
2. **Energía por consumo total** (`:274-307`): la categoría del mismo `GRUPO_CONSUMO` cuyo rango `MIN_GRUPO..MAX_GRUPO` contiene el consumo actual.
3. **Gas**:
   - **Últimos 6 / 12 períodos** (`Get_Recategorizacion_Gas`, `:309-446`): suma los consumos de los últimos 12 períodos (o bimestres con **2498**, o por fecha de lectura con **2530**); en modo "corregido" aplica el factor calórico, presión y temperatura del período (`FACTOR_CAL`) vía `clsConsumos.CorregirConsumoGAS`; con "proporcional 365" lleva el consumo a un año. Elige la categoría del grupo con rango que lo contenga (con **3184**, ignora inactivas y ordena por `CATE_SER_EXTRAS.ORDEN`). Redondeo del consumo corregido según **119** (2 = truncar, 3 = redondear).
   - **Cambio de cuadro (beneficio por ahorro)** (`Get_Recategorizacion_GasCuadros`, `:448-611`): exige que cada categoría ENARGAS tenga cuadros A, B, S y H. Compara contra el mismo período del año anterior (o, salvo variable **2242** = "TEMP", contra el año anterior a ese si no hay datos). Regla: cuadro E se mantiene en E; beneficiarios con estado 67/70 → H si ahorró ≥ 20 %, si no S; resto → B si ahorró ≥ 20 %, si no A.

Filtros comunes: servicio, cuenta, grupo, zonas, categorías, solo prepagas y "recategorización previa" (nunca recategorizados / con menos de 6 períodos) (`:56-95`).

`Confirmar_Recategorizacion` (`:641-712`): guarda la categoría anterior (`CAT_ANT`), la nueva (`COD_CAT`, `COD_CATSER`), la fecha; en gas además períodos, consumo, método (`CAL_CAT`) y **estado de beneficio** (`ESTBEN`: A→96, B→71, H→70, S→67 en la cooperativa "ARR" (V2 2264) o 98 en el resto, T→97, Z→95; para E solo actualiza `ESTBEN` a 68/69 según la categoría ENARGAS). Actualiza la categoría de los **consumos aún no facturados** y deja una **nota en la cuenta** (`NOTA_SUM`) con el motivo. Todo en un único SQL.

`CorregirConsumos` (`:714-748`) re-corrige consumos de gas sin facturar con un factor base, excluyendo los consumos divididos automáticamente.

---

## 9. Retroactivos

Clase: `clsRetroactivos`. Genera **cargos adicionales pendientes** (`PRCAGAS`) para cobrar o devolver diferencias en la próxima facturación. Dos procesos (`TipoProceso`):

- **0 – sobre consumos facturados** (`GetItemsModificar`, `clsRetroactivos.cs:336-434`): toma `CONS_SER` facturados del servicio en el período (y opcionalmente el anterior), con filtros de conceptos de consumo, cuenta, zona, bajas y categorías (actual de la lectura, actual del servicio, o cambio desde categorías anteriores). Agrupa por servicio y calcula:
  - cantidad = consumo, o el tramo `TramaDesde..TramaHasta` del consumo, por una proporción;
  - precio unitario = importe fijo, o porcentaje de lo facturado del servicio, o **proporcional por días** entre la fecha de lectura y una fecha de corte (`ImporteProporcional / días de lectura × días afectados`).
- **1 – sobre conceptos facturados** (`:436-506`): toma ítems de facturas del rango de fechas con un concepto o impuesto base, y aplica importe fijo o porcentaje de lo facturado.

Interés opcional: `Total × días entre emisión y la próxima facturación × tasa / −100` (`:429-432`, `:501-504`). El signo negativo hace que el interés reste (ver "Dudas abiertas").

Validaciones (`ValidarPropiedades`, `:144-234`): concepto a facturar obligatorio; importe o porcentaje (o proporcional); proporción ≠ 0 si no hay importe; rangos de consumo y de trama coherentes; servicio obligatorio; concepto base en proceso 1; si hay interés, próxima facturación, tasa y concepto; filtro de categorías obligatorio.

`ValidarRetroactivosyaCreados` (`:509-520`) impide duplicar: si ya existe un `PRCAGAS` pendiente con el mismo período base, tramas, concepto y rangos para alguna de las cuentas, falla. `RealizarCambios` (`:522-583`) inserta los `PRCAGAS` (con el comprobante de origen, período base `PERIODOB`, tramas y tipo de factura) y, si corresponde, uno extra por el interés. La masiva los levanta como cargos pendientes (sección 2.3).

---

## 10. Modificación masiva

### 10.1 Facturas emitidas (`clsModificacionFacturas`)

Modificaciones posibles (`clsModificacionFacturas.cs:15-31`): todos los vencimientos, uno de ellos, fecha de emisión, próximo vencimiento, o importes de los vencimientos 2–4.

- Fecha nueva = fecha fija, o fecha original + N días, opcionalmente desplazada al siguiente día hábil (`Resultados.GetFecha`, `:229-244`). No se puede indicar fecha fija y días a la vez (`:95-101`).
- Importes 2–4 = `TOTAL1 + valor` (modo 1) o `TOTAL1 × valor` (otro modo) (`:227`).
- Filtros: cuentas, titulares, zona/sector de lectura, zona postal, referencia, comprobante, punto de venta, período, emisión, solo mensuales (`FECHA <> VTO1`), rango de números, tipo, servicio/categoría, clase, solo débito automático, conjunto, ocupación, solo impagas (`:247-357`).
- **Siempre** excluye facturas anteriores al cierre de Facturación; además excluye las de emisión ≤ máximo entre **V2(67)** (cierre de ventas) y **V2(2528)** (`validarFacturas`, `:386-427`). La fecha de emisión nueva tampoco puede ser ≤ cierre de ventas (`:102-106`).
- Si hay **facturas electrónicas**, pregunta si incluirlas advirtiendo problemas con ARCA; si no, las excluye (`:351-356`).
- `RegistrarCambios` (`:538-607`) registra **auditoría** por factura y hace un UPDATE masivo solo de `TOTAL2..4`, `VTO1..4`, `PROX_VTO` y `FECHA`.

### 10.2 Cuotas de ventas (`clsModificacionCuotas`)

Sobre cuotas pendientes de `DEUDAVTA` (sin factura, no anuladas ni facturadas) (`clsModificacionCuotas.cs:387-450`):

- **Importe de un producto** por porcentaje: reparte el ajuste proporcional a capital entre las cuotas, actualiza el ítem de la venta (`IT_COMPV`), los totales del comprobante de venta y el IVA de cada cuota (`IVAVTA`).
- **Costo del producto**: igual, pero el porcentaje es la diferencia entre el precio actual del producto y el último precio usado (`ULT_PRE_VSI`), y actualiza ese último precio.
- **Desplazar vencimientos** N meses.
- **Cambio de tasa de IVA** general y/o sobretasa, recalculando el IVA de la cuota y opcionalmente el del interés (concepto **2089**).
- **Tipo de cuota**; también sobre facturas de financiación ya emitidas (`CLASE = 1`), incluyendo pagos registrados.
- Filtro por prepagas (todas / excluir / solo).

`RegistrarCambios` (`:597-957`) deja una `NOTA_SUM` por comprobante y, si cambió el capital, inserta un movimiento `CAPITAL` de ajuste. Todo en una transacción.

---

## 11. Facturación de cuotas y de terceros

### 11.1 Cuotas de ventas dentro de la masiva

Ver secciones 2.3 y 2.5. `clsFacturacionCuotas` precarga en un solo paso cuotas, IVA e ítems de venta agrupados por cuenta, descuento y plan (`clsFacturacionCuotas.cs:126-172`). El ítem de cuota lleva el IVA y la percepción calculados por `clsComprobanteFactura.GetPercepcionCuota` (IIBB solo si la base supera el mínimo, `:69-94`). Al emitir, la cuota queda `ESTADO = 'F'` con `ID_FAC` (`clsComprobanteFactura.cs:1208-1222`, `1256-1273`).

`GetComprobantes_Generados` + `ImprimirComprobantes` (`clsFacturacionCuotas.cs:174-374`) calculan **gastos de franqueo**: cuentan las "hojas" que recibirá cada cuenta (facturas del rango, más servicios con consumos pendientes, más no medidos no facturados, considerando talones agrupados) y asignan un importe según una tabla de cantidad de hojas × zona.

### 11.2 Importaciones de terceros (`clsFacturacionCuotasTerceros`)

Formatos según `ARCHIVOS.REF_ARC` (`clsFacturacionCuotasTerceros.cs:348-379`):

| Código | Fuente | Clave de cuenta |
|---|---|---|
| EMA | Excel: cuenta, concepto, cantidad, precio, descripción | `COD_SUM` |
| SAM | EMA + archivo de ancho fijo (cuenta, titular, importe) con un concepto fijo; variante "Tasa Verde" con observación | `COD_SUM` |
| EME | DBF (emergencias médicas) → CSV; agrupa por cuenta y adherente | `COD_SUM` |
| CT1 | Texto ancho fijo: socio, período, factura, importe; concepto de **V2(2284)**; error si el socio no tiene o tiene varios servicios | socio → servicio |
| FAR | Facturas de farmacia (medicamentos/perfumería) | — |
| IAL | Alumbrado público: número de suministro, importe, descripción | `NUM_SUM` |
| CEL | Celulares: número de línea → servicio conectado (o dado de baja) | `NUM_MED` |

`Fill_Comprobantes` (`:883-939`) completa titular y situación de IVA, marca errores ("CUENTA INEXISTENTE", "CONCEPTO INEXISTENTE") y calcula el IVA por concepto y situación (`ALI_IVA_CF`). Luego se graba de dos maneras:

- `Guardar_Comprobantes` (`:941-1052`): como **comprobantes de venta con cuotas** (`COMP_VEN`/`DEUDAVTA`) que la masiva facturará después; numeración propia bloqueando `COMP_VEN`.
- `Guardar_Facturas` (`:1054-1163`): como **facturas directas**, en bloques de 300 SQL, con número consecutivo.
- Facturas de gas importadas (`ImportarFacturasGAS`/`Guardar_Facturas_GAS`, `:668-817`): Excel con cuenta, tipo, punto de venta, número, emisión, vencimiento, importe y usuario; rechaza números repetidos en el archivo.

### 11.3 Servicios de terceros (`clsFacturacionServiciosTerceros`)

Formato "PR1" (telefonía móvil revendida, `clsFacturacionServiciosTerceros.cs:86-300`): CSV con línea, nota de venta, cliente, concepto (SERVICIO, SERVICIO_PROPORCIONAL, CARGO, ABONO, ABONO REINTEGRO, ABONO PROPORCIONAL, CONSUMO, CONSUMO_CPP), detalle e importe. Busca el servicio por número de línea; el ABONO toma el cargo fijo de la categoría; CONSUMO/CONSUMO_CPP generan `CONS_SER` con clave de llamada u operador. Reporta líneas no encontradas, duplicadas y servicios activos no importados. `Save` (`:333-379`) graba `PRCAGAS` del período y los consumos.

### 11.4 Datos extra de terceros en la factura (`clsFacturas_DatosExtras`)

Con **V2(2081)** = OSSE, importa un DBF de la empresa de agua y lo asocia a las facturas por zona/sector/recorrido de lectura (`FAC_EXTRAS`), para imprimir datos de otro prestador en la misma factura (`clsFacturas_DatosExtras.cs:17-160`).

---

## 12. Impresión, talones y código de barras

### 12.1 Selección del reporte

`DatosImpresion_Factura.NombreReporte` (`clsFacturasImpresion.cs:385-451`):

```
base = V2(565)
si se forzó un reporte y existe -> ese
si es CVLP -> "Facturacion_Factura_CVLP"
si no: TIPO_FAC.REPORTE, o el REPORTE del primer servicio de la factura que lo tenga,
       o "Facturacion_Factura"; si es prepaga y existe V2(156) -> ese
prefijos opcionales si existe el archivo: "e_" (modelo electrónico), "2_" (alternativo), "t_" (talón sumado)
sufijos opcionales si existe el archivo: "_<COD_COM>" y luego "_<COD_SIT con 3 dígitos>"
```

Es decir, **la variación por cooperativa se resuelve con archivos de reporte con nombre convencional** (DevExpress), no con código. Otros datos que expone el modelo de impresión: código LINK = cuenta con 9 dígitos (`:653-663`), domicilio histórico de la cuenta a la fecha de emisión (`:665-693`), CAE, vencimientos, código de barras AFIP (`:1047`), transacción de prepaga, constancia de percepción IIBB vigente (`Get_CVP`, `:2818-2834`). Orden de impresión: calle y número, cuenta, zona/sector/recorrido postal, comprobante, alfabético, titular, zona/sector/recorrido de lectura, código postal y cuenta (`:21-31`). Salida: todas, solo electrónicas por mail o WhatsApp, no electrónicas, todas por mail, PDF, SMS/WhatsApp (`:33-49`).

### 12.2 Talones (agrupación de facturas para pagar juntas)

`GenerarTalones` (`clsFacturasImpresion.cs:3477-3591`):

- Si las facturas ya tenían talón, los pasa a `TALONFAC_HST` y los borra.
- Recorre las facturas ordenadas por cuenta, `TIPO_FAC.GRUPOTALON` y `ORDEN_TALON`. Todas las facturas de **la misma cuenta y el mismo grupo de talón** comparten un número de talón.
- El talón suma los 4 importes (los créditos restan) y toma los vencimientos de la primera factura del grupo (`AgregarTalones`, `:3607-3631`).
- Los números se buscan llenando **huecos** de la secuencia existente (`GetNumero`, `:3593-3605`); valida que el rango a usar no esté ocupado; inserción masiva (`BulkInsert`).

`GenerarCuotasDeFacturas` (`:3633-3707`) parte cada factura en N talones-cuota con sus propios vencimientos; la última cuota absorbe el redondeo.

`AgregarNroPieza` (`:3709-3785`) numera las piezas postales por zona/sector/recorrido; `AsignarOrden` (`:3787-3815`) asigna orden y sub-orden "i/n" por titular y recorrido (para ensobrar varias facturas juntas).

### 12.3 Código de barras: arquitectura

`Codigo_Base` (`ReglasNegocio.Facturacion.CodigoBarra/Codigo_Base.cs`) es una clase abstracta con una **estrategia por formato**:

- Cada formato implementa: generar el código para una factura, una notificación de deuda y un talón (y opcionalmente una solicitud Pagos360); **leerlo** (devuelve una consulta de facturas) y su ancho (`:240-253`).
- El formato por defecto de la cooperativa es **V2(2055)** y el convenio/código de empresa **V2(2255)**; si falta alguno, no se imprime código (`:305-358`). Los formatos disponibles para lectura en caja son los de `BANCOS.ID_CODBAR` más el por defecto (`:734-746`).
- `Get_Instance` (`:366-477`) es una fábrica con unos **100 formatos** (enum `TipoCodigo`, `:15-228`). Varios códigos de enum apuntan a la misma clase.
- La lectura rechaza caracteres no numéricos, salvo en la cooperativa "EMPR" (V2 2264) (`:279-283`).
- Prefijos de documento usados dentro del código: **40** notificación, **41** factura (por `ID_FAC`), **42** talón, **43** solicitud Pagos360 (`:230-238`). La decodificación genérica está en `clsComprobanteFactura.Get_Facturas` (`clsComprobanteFactura.cs:2202-2422`): 41 → `ID_FAC`; 42 → número de talón; 40 → notificación (o lote + cuenta); 43 → `PAGOS360_ITEMS.COD_PAG`; 21–23 → socio/cuenta + agrupador + vencimiento; 99 → cuenta + terminaciones de número; 14 dígitos → comprobante + punto de venta + número; 16 dígitos → comprobante de 4 dígitos. Hay casos especiales por cooperativa (CL, RUF, TIO, FOT).

Dígitos verificadores implementados (`Codigo_Base.cs:502-675`):

| Método | Algoritmo |
|---|---|
| DV1 | Ponderadores 1,3,5,7,9 (ciclando 3-5-7-9), suma/2, módulo 10 (estándar Pago Fácil/Rapipago; se aplica dos veces) |
| DV2 | Ponderadores 9,7,1,3, complemento a 10 (Bancor) |
| DV3 | Módulo 10 con peso 3 en posiciones pares (estilo EAN/AFIP) |
| DV4 | Módulo 11 con pesos decrecientes |
| DV5 | Peso 3 en impares, módulo 10 sin complemento |
| DV6 | Ponderadores 1,3,5,7,9 con complemento a 10 |
| DV7, DV8, DV9 | Variantes propietarias (suma ponderada por posición; alfanumérico módulo 43; pesos 3..9 cíclicos) |
| CRC16-CCITT | Para QR EMVCo (`calculateCRC`, `:479-500`) |

Utilidades: importes en centavos con ceros a la izquierda (`Get_TextoImporte`, `:684-689`), fecha juliana AADDD (`GetJulianDate`, `:748-754`).

### 12.4 Formatos genéricos (estructura)

Se describen los campos, no el código.

- **Pago Fácil 42** (`Genericos/Codigo_PagoFacil42.cs:39-57`): empresa (4) + importe 1º vto (8, centavos) + año de emisión (2) + día juliano del 1º vto (3) + comprobante (2) + punto de venta (4) + número (8) + "0" + recargo 2º vto (6) + días entre 1º y 2º vto (2) + DV1 + DV1. Para notificaciones y talones se reemplaza comprobante/número por "40"/"42" + "0000" + número de 8 y el recargo por ceros. Si el largo no da 42, imprime ceros. La lectura valida ambos DV y reconstruye comprobante+punto de venta+número.
- **Banco de Córdoba 50** (`Genericos/Codigo_BancoCordoba50.cs:34-48`): empresa (4) + "03" + identificador de 14 (comprobante 2 + pto. venta 4 + número 8; en la cooperativa "AO", el `ID_FAC` con 14 dígitos) + 1º vto AAMMDD + importe 1º (9) + días al 2º (2) + recargo 2º (5) + días al 3º (2) + recargo 3º (5) + DV2.
- **Procoop 14** (`Clientes/PR_General_14.cs:17-30`): comprobante (2) + punto de venta (4) + número (8); notificación "40" + 12 dígitos; talón "42" + 12 dígitos. Sin DV.
- **AFIP** (`Genericos/Codigo_Varios_AFIP.cs:15-28`): CUIT de la empresa + comprobante (2) + punto de venta (4) + CAE + vencimiento CAE AAAAMMDD + DV3; debe dar 40 caracteres. Solo generación.
- **Credicoop** (`Genericos/Codigo_BancoCredicoop.cs`): solo lectura (47): cuenta de 6, dos terminaciones de número de 4, año de 2, días desde fin del año anterior.
- Otros genéricos: Pago Fácil 46/50 (con variantes de 11 dígitos de importe), Banco de Córdoba 43/48/56, Banco Nación 38, Mutual Independiente. Su detalle está en 12.4.1.

*Segunda pasada*: se confirmaron contra el código las estructuras de Pago Fácil 42 y Banco de Córdoba 50 descritas arriba.

#### 12.4.1 Resto de los formatos genéricos (segunda pasada)

Convenciones que comparten todos los formatos:

- "Importe N" es `Get_TextoImporte`: valor absoluto en centavos con ceros a la izquierda (`Codigo_Base.cs:684-689`). **Los créditos pierden el signo** y un importe más ancho que el campo **no se trunca**, lo que alarga el código **[VERIFICAR]** si hay facturas grandes.
- Las fechas usan `Get_FechaTexto` (`Codigo_Base.cs:691-723`), un formato propio en el que "mm" es el **mes** y "MM" son los minutos, al revés que en .NET.
- "Juliano" es el día del año con 3 dígitos. "Días2" es la cantidad de días entre el 1º y el 2º vencimiento, con 2 dígitos.
- "Recargo" es `TOTAL2 − TOTAL1` salvo que se diga otra cosa.
- Si falta la factura, el código queda en ceros del ancho del formato (`Codigo_Base.cs:305-358`).

| Formato (largo) | Factura: campos en orden | DV | Notificación / talón | Lectura |
|---|---|---|---|---|
| **Pago Fácil 46** (46) (`Genericos/Codigo_PagoFacil46.cs:47-80`) | convenio 3 + importe 1º vto 8 + año del VTO1 2 + juliano VTO1 3 + "41" + `ID_FAC` 13 + "0" + importe 2º vto 8 + año VTO2 2 + juliano VTO2 3 | DV1 una vez | Notificación: convenio + deuda 8 + año y juliano de `VTO_CIR` (o fecha + 30) + "0" + "40" + "0000" + `CNT_NOT` 8 + relleno de ceros. Talón: importe en ceros + "042" + "0000" + número 8 | `:9-46`: salta 3, importe 8, fecha 5, identificador 15. Si empieza con "4100…" o "4200…" va al decodificador genérico. Si no, cae en el modo heredado: número = primeros 6, sucursal = caracteres 7-8, VTO1 comparado contra dos bases julianas y desempate por `SALDO`. Una notificación ("0400…") **cae en el modo heredado** **[VERIFICAR]** |
| **Pago Fácil 46_2** (46) (`Genericos/Codigo_PagoFacil46_2.cs:36-80`) | convenio 4 + importe 11 + año 2 + juliano VTO1 3 + "41" + `ID_FAC` 12 + recargo 8 + días VTO2−VTO1 2 | DV1 + DV1 | Talón: "42" + número 12 con el mismo esquema. Notificación: **no implementada** (lanza excepción). Si el largo no da 46, devuelve ceros | `:9-35`: valida ambos DV y pasa al decodificador genérico con la fecha |
| **Pago Fácil 50** (50) (`Genericos/Codigo_PagoFacil50.cs:37-70`) | convenio 6 + "00" + "41" + `ID_FAC` 12 + VTO1 AAMMDD + importe 9 + 12 ceros | DV2 | Notificación y talón con el mismo layout ("40"/"42"); el talón usa `SALDO` como importe | `:9-36`: valida DV2, luego decodificador genérico. Modo heredado: cuenta + número 8 + vencimiento |
| **Pago Fácil 50_2** (50) (`Genericos/Codigo_PagoFacil50_2.cs:39-75`) | convenio 4 + importe 8 + año 2 + juliano 3 + "41" + `ID_FAC` 12 + "0" + recargo 2º 6 + días2 2 + recargo 3º (`TOTAL3 − TOTAL1`) 6 + días VTO3−VTO1 2 | DV1 + DV1 | Talón con "42". Notificación no implementada | `:9-38`: valida DV y usa el decodificador genérico |
| **Banco de Córdoba 43** (43) (`Genericos/Codigo_BancoCordoba43.cs:39-72`) | convenio 4 + `ID_FAC` 8 + "41" + período MM + AAAA + VTO1 AAAAMMDD + días2 2 + importe 1º 6 + importe 2º 6 | DV3 | Notificación: `CNT_NOT` 8 + "40" + mes + año + fecha + "00" + deuda 6 + 6 ceros. Talón: número 8 + "42" + `FEC_ALTA` AAAAMM + AAAAMMDD + 14 ceros (sin importe) | `:9-38`: salta 4 y reordena 10 caracteres como "41" + id. Modo heredado: `RUTA_SR` "nnnnnnn/nnn". **El importe de 6 dígitos limita a $ 9.999,99** **[VERIFICAR]** |
| **Banco de Córdoba 48** (48) (`Genericos/Codigo_BancoCordoba48.cs:32-52`) | convenio 4 + "300" + `COD_COM` 4 + `SUC_COM` 4 + `NUM_COM` 8 + importe 8 + VTO1 AAAAMMDD + recargo 6 + días2 2 | DV1 | Solo facturas | `:9-31`: pasa 16 dígitos (comprobante de 4) al decodificador genérico |
| **Banco de Córdoba 50_2** (50) (`Genericos/Codigo_BancoCordoba50_2.cs:33-70`) | convenio 4 + "03" + `COD_COM` 4 + `SUC_COM` 4 + `NUM_COM` 8 + VTO1 AAMMDD + importe 9 + días2 2 + recargo 2º como **% de TOTAL1** (4, con 2 decimales) + días VTO3−VTO2 2 + recargo 3º % 4 | DV2 | Talón: "42" + número 14. Pagos360: "03" + "43" + 000000 + `COD_PAG` 8, pero el tercer tramo **repite VTO2−VTO2 = 0 y el recargo 2º** (bug). Con `TOTAL1 = 0` hay **división por cero** | `:9-32`: decodificador genérico |
| **Banco de Córdoba 56** (56) (`Genericos/Codigo_BancoCordoba56.cs:44-76`) | convenio 6 + "41" + `ID_FAC` 14 + VTO1 AAMMDD + importe 1º 9 + días2 2 + `TOTAL2` 7 + días3 (desde VTO1) 2 + `TOTAL3` 7 | DV2 | Notificación / talón: convenio 4 + "00" + "40"/"42" + número 14 + fecha + ceros | `:9-43`: salta 4, grupo 2, tipo 2, id 14. Si el tipo no es 40/41/42, modo heredado por `FACTURAS.USUARIO = grupo + id` **[VERIFICAR]** |
| **Banco Nación 38** (38) (`Genericos/Codigo_BancoNacion_38.cs:34-49`) | convenio 4 + "000000" + "41" + `ID_FAC` 12 + VTO1 DDMMAA + importe 8 | Sin DV | Análogos con "40"/"42" | `:9-33`: decodificador genérico; modo heredado cuenta + número 8 + DDMMAA |
| **Mutual Independiente** (50) (`Genericos/Codigo_Mutual_Independiente.cs:33-53`) | convenio 4 + "00" + `COD_COM` 2 + `SUC_COM` 4 + `NUM_COM` 8 + VTO1 AAMMDD + importe 9 + días2 2 + recargo 2º 5 + días VTO3−VTO2 2 + recargo `TOTAL3 − TOTAL2` 5 | DV2 | Solo facturas | `:9-32`: decodificador genérico |
| **Credicoop** (47) (`Genericos/Codigo_BancoCredicoop.cs:9-49`) | No genera | — | — | Salta 4, cuenta 6, terminaciones de número 4 + 4, 8 ignorados, año 2, días desde fin del año anterior 3, y luego 6 + 2 + 6 + 2. Bug del año de 2 dígitos ya listado en §16 |
| **AFIP** (40) (`Genericos/Codigo_Varios_AFIP.cs:15-40`) | CUIT + `COD_COM` 2 + `SUC_COM` 4 + CAE + vto CAE AAAAMMDD | DV3 | No aplica | No lee. Si el largo no es 40 devuelve vacío; `Get_AnchoCodigo` lanza excepción |

Métodos de `Codigo_Base` revisados:

- `Get_TipoCodigosTable` (`Codigo_Base.cs:254`): combina `BANCOS.ID_CODBAR` con V2 2055.
- `Get_Facturas` (`:279-283`): rechaza entradas no numéricas salvo con la sigla EMPR.
- Los `Get_CodigoBarras` por defecto usan V2 2055 y V2 2255.

Métodos sin regla de negocio: `Get_AnchoCodigo` (en todas las clases genéricas; solo devuelve el largo).

### 12.5 Cómo varía por cooperativa

La carpeta `CodigoBarra.Clientes` tiene ~90 clases con prefijo de la sigla de la cooperativa (ARR, ALM, BAT, CAU, MONT, TREL, etc.) o del recaudador (PR_ = Procoop genérico). Patrones:

- Mismo layout bancario con otro identificador (ID_FAC en vez de comprobante; cuenta en vez de número).
- Distinta cantidad de vencimientos codificados y distinto cálculo de "días al 2º/3º vto". Ejemplo **Arroyito 54** (`Clientes/ARR_General_54.cs:19-28`): "1" si el tipo de factura es "EN" (energía) o "2" en otro caso + "0" + "41" + `ID_FAC` (14) + 1º vto AAAAMMDD + 3 pares (días, importe); para tipos "FN"/"SG" y talones con cuota, los días se calculan hasta el último día hábil del mes.
- QR de billeteras (EMVCo): Pagos360, SIRO, NaranjaX, Pronto Pago, ProvinciaNet, Helipagos.
- Recaudadores: Rapipago, Pago Fácil, Cobro Express, Bapro, Banco Roela/SIRO, Bersa, Santa Fe, Provincia Net, Pampa Pagos.

*Patrón común (segunda pasada)*: cada clase de `Clientes` hereda de `Codigo_Base` y reutiliza los mismos bloques que los genéricos:

- convenio (V2 2255);
- prefijo 40/41/42/43 más el identificador (`ID_FAC`, talón o `CNT_NOT`);
- uno a cuatro pares (vencimiento, importe o recargo) en fecha juliana, AAMMDD o AAAAMMDD;
- uno de los DV de 12.3.

La lectura casi siempre delega en el decodificador genérico de `clsComprobanteFactura.Get_Facturas` y agrega un modo heredado propio (número + sucursal, cuenta o `RUTA_SR`). Lo que cambia entre cooperativas es el orden, el ancho y el criterio de días entre vencimientos, no la semántica. El caso de Laguna Larga se documenta en el doc 11.

### 12.6 Pagos360

- Una solicitud de cobro (`PAGOS360`, con ítems `PAGOS360_ITEMS` por factura o talón) guarda hasta tres códigos de barra (`CODIGO_BARRA`, `CODIGO_BARRA2`, `CODIGO_BARRA3` "1M") y un `QR_ID`. La impresión toma la primera solicitud no en estado 4 (`clsFacturasImpresion.cs:2730-2793`).
- QR Pagos360 (`Clientes/PR_Pagos360_QR.cs:15-51`): solo si la solicitud tiene `QR_ID`, no es débito automático (`DEBITO_ID` nulo) y el 2º vencimiento no pasó. Arma un string EMVCo: formato "01", QR dinámico "12", identificador `com.pagos360`, CUIT de la empresa (**V2 519**), MCC (**V2 2773**), moneda 032, país AR, nombre (**V2 2759**, ≤ 25), ciudad (**V2 2761**, ≤ 15), código postal (**V2 2760**), dato adicional con el `QR_ID`, y CRC16 final.
- El prefijo 43 en un código leído en caja identifica la solicitud (`clsComprobanteFactura.cs:2320-2327`).
- La anulación consulta el estado de la solicitud (estados 0, 1 y 4 = no cobrada) antes de permitir eliminar (sección 7.1). La creación de solicitudes y su conciliación están en el doc 05.
- SIRO QR (`Clientes/PR_SIRO_QR.cs`) usa el CUIT de **V2 2798**, genera UUID deterministas y puede crear la solicitud al imprimir; el 3º vencimiento del QR puede forzarse con **V2 3144**.

---

## 13. Interfaces con entes reguladores

### 13.1 ENARGAS (gas)

- `clsEnargas` (`clsEnargas.cs`): genera los archivos del protocolo SARI. Archivos FDU, DET, CMD, USR, RAU, FDC, FDD, RZF-DS y, solo para la cooperativa "BOL", SUP (`:111-123`, `:442-467`). Nombre: `<distribuidor 5 dígitos>_<número>_<archivo>_<AAAA-MM>_<fecha>.TXT`, tabulado (SUP con coma), en `ENARGAS\` junto al ejecutable (`:779-849`). También exporta Excel de morosidad y de facturas (`:469-777`). Las tablas maestras (categorías, documentos, subzonas, localidades) vienen de `SARI_Protocolo_Tablas(2).xlsx`, según **V2 2603** (`:136-143`). *Corrección (segunda pasada)*: el archivo se llama `SARI_Protocolo_Tablas2.xlsx` si V2 2603 ≠ 0 y `SARI_Protocolo_Tablas.xlsx` si no. Se busca en la carpeta `Recursos` del directorio del ejecutable (`AppDomain BaseDirectory`), no del servidor (`clsEnargas.cs:136-147`). Mapea categorías por `CATE_SER.COD_ENGAS`, grupo, cuadro (P/S/H/Z/T se informan como "a") y segmentación de subsidio (`CATE_SER_EXTRAS.GRUPO_SUBSIDIO`) (`:851-866`).
- `clsEnargas2` (`clsEnargas2.cs`): protocolo nuevo "FCU-DS" con archivos FaC, Sub, FaD, CoC, Usr, FaV y SICC (`:19-29`, `:178-224`); con **V2 3174** usa la matrícula como identificador.
- **Bloques de consumo subsidiado** (segmentación N2/N3/CS): `GetTempModifBonif` calcula para cada servicio con consumos pendientes el nuevo bloque bonificado (`SERSOC.CANTIDAD`) como suma, por cada mes cubierto por la lectura, de `días del mes leídos × cantidad mensual de ENGAS_CANTMESES / días del mes`, dividido 2 (`:2837-3014`). `RegistrarModifSegmentacion` lo graba (con tabla temporal `TEMPMODIFBONIF`) y `LimpiarBloquesServicios` lo pone en 0.

### 13.2 ENACOM (telecomunicaciones)

- `clsEnacom` (`clsEnacom.cs`) es solo la configuración: para telefonía fija, móvil, internet y TV, qué servicios principales, servicios, productos e impuestos componen cada uno. Se guarda serializada en `Recursos\ENACOM_Config.txt` del servidor (`ConfiguracionEnacom.cs:23-58`).
- `Exportar_Excel_ENACOM_DNU_RES_367_2020` (`ConfiguracionEnacom.cs:61-189`): CSV puntual del DNU 311/2020 (Res. 367/2020): por cuenta con el servicio conectado (altas hasta el 25/03/2020 si se indica fecha de deuda), documento, domicilio, prestador (CUIT), tipo de servicio, plan (categoría), montos facturados de enero a abril 2020 y deuda acumulada (ítems de los servicios/productos/impuestos configurados, créditos restan). Es un informe histórico.

### 13.3 Otros archivos (`ReglasNegocio.Facturacion.Archivos`)

Exportadores de texto con `ExportBase` (codificación Windows-1252, campos de ancho fijo) (`ExportBase.cs`). Se listan para ubicar su lugar; el contenido fiscal es del doc 03:

- RG 1361 duplicados electrónicos, RG 3685 / RG 3685_ITEMS (Régimen de Información de Compras y Ventas; con **V2 2692** usa vencimiento en vez de emisión), RG 3349 consumos relevantes, RG 3571 Rendición de Comprobantes de Servicios Públicos (y RG 46/2019 con generadores), SICORE, SIRCAR, retenciones municipales e Ingresos Brutos de varias provincias, FEDECOBA y la Circular 70/2021 del ERSeP (`TipoArchivos.cs`).
- `clsMovimientoConceptos` (`clsMovimientoConceptos.cs:17-49`) es el informe de "movimiento de conceptos" (facturado/cobrado por concepto, categoría, rubro, rendición, IIBB, intereses, impuestos, ranking), con exportadores por cooperativa (`clsMovimientoConceptos_Exportacion`: CAU_IIBB, ARR_AMA, TORN_ALP).

#### 13.3.1 Detalle de `Archivos` (segunda pasada)

**`ExportBase`** (`Archivos/ExportBase.cs`):

- `Exportar` escribe en Windows-1252.
- `ExportarCSV` (`:49`) separa con ";". Cada fila termina en ";", pero la cabecera no, y usa la codificación por defecto (no 1252).
- `Get_TextoNumero` rellena con ceros; si el valor es negativo, reserva un lugar para el signo (ancho − 1).
- `Get_Texto` rellena o trunca al ancho.
- `Get_ComboInfoArchivo` (`:163`) ofrece RG 3571 (código 8) y RG 3685 (código 16).
- `Get_TipoAnalisisArchivo` (`:173`): RG 3571 admite análisis por número de línea y por correlatividad; RG 3685 solo por línea.
- `Get_InfoLinea` y `Get_InfoCorrelatividad` (`:190`, `:195`) son virtuales y lanzan excepción si la subclase no los implementa.

**RG 3571** (`Archivos/RG3571.cs`):

- `Get_InfoLinea` (`:1343`) decodifica una línea del archivo ya generado por posiciones fijas. En los importes, el signo "0" significa positivo.
- `Get_InfoCorrelatividad` (`:1381`) ordena por código AFIP, punto de venta y número. Ante un salto informa solo `número − 1`, no el rango faltante completo.
- El punto de venta se lee como `substring(2,5)` en la correlatividad y como `substring(3,4)` en `Get_InfoLinea` **[VERIFICAR]**.

**RG 3685** y **RG 3685_ITEMS**:

- `Get_ComprobatesBC` (`RG3685.cs:899`) lista los códigos AFIP de comprobantes B y C; la lista de `RG3685_ITEMS` no incluye el "109".
- `Get_InfoLinea` (`RG3685.cs:910`, `RG3685_ITEMS.cs:740`) solo acepta líneas de 266 caracteres.

**FEDECOBA** (`Archivos/FEDECOBA.cs:15`):

- Exporta los saldos contables de `CTITASIE` agrupados por la cuenta FEDECOBA del plan (`CTPLAN.FEDECOBA`), partidos en N archivos.
- Tiene un CUIT fijo en el código; no se transcribe.
- El contador de registros no se reinicia entre archivos (bug).

**Archivos fiscales de compras y retenciones**: pertenecen al doc 03 y aquí solo se ubican.

- `PercepcionSICORE`:
  - Métodos `Exportar_Sueldos` (`:79`), `Venta` y `Proveedores` (`:133`).
  - V2 2991 hace que Venta use coma decimal; V2 2539 aplica el formato internacional en Proveedores.
  - Sin CUIT se usa 23333333333.
  - Proveedores usa impuesto 0217 con régimen 078, o 0767 con 214 para Buenos Aires.
  - Sueldos toma `TIP_CON` 40 (Ganancias).
- `RetencionesMunicipales`:
  - Registros C/D/P separados por ";", con el CUIT de V2 519 y la razón social de V2 518.
  - IIBB usa el artículo 020 para RUF y 001 para el resto. Santa Fe tiene el mismo layout con campos más anchos.
  - La Pampa exige que todo sea del mismo mes y tiene un CUIT fijo en la cabecera.
  - Nombres de archivo: ARBA `AR-<cuit>-AAAAMM<quincena>-6-LOTE1`; A122R `ER-…-LOTE00001`.
  - SeguridadSocial usa códigos fijos y arma una consulta de `TALONFAC` que nunca se utiliza.
- `SIRCAR` (`:135`, `:167`, `:200`):
  - Retenciones de Córdoba y Río Negro, y percepciones; la jurisdicción 904 agrega el campo de constancia.
  - Buenos Aires valida los CUIT y aborta con la lista de los erróneos.
  - El nombre del archivo depende de la versión (v12 o anterior).

---

## 14. Parámetros `Busca_V2_*` que condicionan el proceso

Solo los vistos en estas clases. "L" = lógico, "N" = número, "C" = texto.

| Variable | Tipo | Efecto | Cita |
|---|---|---|---|
| 21 | L | Si está activa, **no** redondea totales a 2 decimales | `clsComprobanteFactura.cs:612` |
| 67 | C | Fecha de cierre de ventas: tope para modificar emisión | `clsModificacionFacturas.cs:102`, `:392` |
| 74 | N | Tipo de cálculo de importes 2º–4º vencimiento | `clsComprobanteFactura.cs:1774` |
| 119 | N | Redondeo de consumo de gas corregido (2 truncar, 3 redondear) | `clsRecategorizacion.cs:323` |
| 156 | C | Reporte especial para facturas de prepaga | `clsFacturasImpresion.cs:424` |
| 242 | N | Si el código de barras 22 identifica socio (1,2) o cuenta (3,4) | `clsComprobanteFactura.cs:2273` |
| 307, 311, 543, 607, 2089, 2247 | — | Deben estar configuradas para facturar | `clsFacturacionMasiva.cs:505` |
| 519 | C | CUIT de la empresa (QR) | `PR_Pagos360_QR.cs:23` |
| 565 | C | Reporte de factura por defecto | `clsFacturasImpresion.cs:389` |
| 578 | N | Tasa/monto de recargo por vencimiento | `clsComprobanteFactura.cs:1797` |
| 606 | N | Concepto de interés (para IVA del recargo) | `clsComprobanteFactura.cs:1920` |
| 639 | N | Tipo de factura de viviendas | `clsComprobanteFactura.cs:629` |
| 739 | L | Prohíbe conceptos gravados en comprobantes internos | `clsComprobanteFactura.cs:697` |
| 1008 | N | Vendedor por defecto | `clsComprobanteFactura.cs:611` |
| 2055 | N | Formato de código de barras por defecto | `Codigo_Base.cs:309` |
| 2081 | N | Tipo de impresión con datos de terceros (OSSE) | `clsFacturas_DatosExtras.cs:22` |
| 2242 | C | "TEMP": recategorización de gas sin fallback al año anterior | `clsRecategorizacion.cs:489` |
| 2255 | C | Convenio / código de empresa para códigos de barra | `Codigo_Base.cs:313` |
| 2264 | C | **Sigla de la cooperativa**: activa variantes (ARR, AO, CL, RUF, TIO, FOT, EMPR, BOL, FLOR, AZUL, FEL…) | varias |
| 2271 | N | Máximo de días entre hoy y el 1º vencimiento en facturas manuales | `clsComprobanteFactura.cs:696` |
| 2284 | N | Concepto para la importación CT1 | `clsFacturacionCuotasTerceros.cs:823` |
| 2315 | N | Tamaño de lote de cuentas (por defecto 100) | `clsFacturacionMasiva.cs:205` |
| 2342 | N | Redondeo de prepaga | `clsFacturacionMasiva.cs:1348` |
| 2413 | L | Recargo de prepaga en ND separada | `clsFacturacionMasiva.cs:1355` |
| 2443 | L | No facturar cuotas si la cuenta no tiene ítems de servicio | `clsFacturacionMasiva.cs:984` |
| 2498 | L | Recategorización de gas por bimestres | `clsRecategorizacion.cs:324` |
| 2515 | N | Umbral de importe para comprobantes MiPyME (FCE) | `clsComprobante.cs:218` |
| 2526 | L | Emitir factura aunque dé 0 si tiene consumos | `clsFacturacionMasiva.cs:1154` |
| 2528 | C | Otra fecha de cierre para modificación masiva | `clsModificacionFacturas.cs:396` |
| 2530 | L | Recategorización de gas por fecha de lectura en vez de período | `clsRecategorizacion.cs:325` |
| 2549 | L | Permite punto de venta 0 (comprobantes con `PTOVTA0`) | `clsComprobante.cs:445`, `clsComprobanteBase.cs:224` |
| 2564 | N | Concepto para ítem de descuento | `clsComprobanteFactura.cs:721`, `:1379` |
| 2603 | N | Versión del protocolo ENARGAS | `clsEnargas.cs:138` |
| 2692 | L | RG 3685 por vencimiento | `RG3685.cs:273` |
| 2703 | N/C | Cuadro tarifario forzado y fecha de vigencia (prepaga) | `clsDatosFacturacion.cs:515` |
| 2736 | L | Desactiva capitalización automática | `clsFacturacionMasiva.cs:552` |
| 2759, 2760, 2761, 2773 | C | Nombre, CP, ciudad y MCC del comercio para QR | `PR_Pagos360_QR.cs:25-34` |
| 2769 | L | Propagar bloqueos de cobro a las facturas nuevas | `clsFacturacionMasiva.cs:675` |
| 2798 | C | CUIT para SIRO QR | `PR_SIRO_QR.cs:52` |
| 2815 | L | Excluir bajas en impresión | `clsFacturasImpresion.cs:2907` |
| 2855 | L | No registrar capital al cerrar la masiva | `clsFacturacionMasiva.cs:705` |
| 3080 | N | Importe máximo sugerido de una factura (pregunta) | `clsComprobanteFactura.cs:701` |
| 3094 | N | Concepto "crédito por energía inyectada" | `clsFacturacionMasiva.cs:203` |
| 3109 | L | Criterio de emisión adicional en simulación | `clsFacturacionMasiva.cs:1230` |
| 3144 | N | Días del 3º vencimiento en SIRO QR | `PR_SIRO_QR.cs:109` |
| 3174 | L | ENARGAS usa matrícula | `clsEnargas2.cs:155` |
| 3184 | L | Recategorización ignora categorías inactivas y usa orden | `clsRecategorizacion.cs:424` |

Variables adicionales encontradas en la segunda pasada (los valores dependen de cada base, **[VERIFICAR]**):

| Variable | Tipo | Efecto | Cita |
|---|---|---|---|
| 29 | N | Concepto para anticipo; se usa como respaldo de la 403 | `clsComprobanteVenta.cs:771-810` |
| 307 / 311 / 607 | N | Conceptos de interés por mora, interés anterior e interés por financiación (obligatorios) | `clsFacturacionMasiva.cs:505` |
| 308 | N | Concepto "cuota en factura mensual" (capital); sus ítems no se abren por producto en Movimiento de conceptos | `clsMovimientoConceptos.cs:617` |
| 310 | N | Concepto "deuda de financiación" | `clsMovimientoConceptos.cs:1094` |
| 403 | N | Concepto de factura en cuotas: crédito automático en ventas en cuotas; las ventas con ese concepto se marcan "Exento" o se excluyen del detalle de ventas | `clsComprobanteVenta.cs:771-810`, `clsInformes_Facturacion.cs:3034`, `:3060` |
| 518–522 | C | Razón social, CUIT, calle, número y barrio de la empresa (datos de transporte propio, retenciones) | `clsComprobanteVenta.cs:1383-1493`, `clsComprobanteRendicion.cs:57-106` |
| 543 | N | Código de `IMPUESTO` para IVA (ítem "Alícuota X%") | `clsComprobanteFactura.cs:1696-1718` |
| 2089 / 2247 | N | Concepto de interés y concepto de descuento del comprobante de venta (contado o 1 cuota) | `clsFacturacionMasiva.cs:505` |
| 2246 | L | Mostrar importes en el comprobante de venta | `clsComprobanteVenta.cs:1383` |
| 2257–2260 | C/N | ENARGAS: código de entidad, contrato, modalidad y porcentaje o importe de comisión | `clsEnargas.cs` |
| 2318 | C | Texto de los conceptos desconocidos (por defecto "CONCEPTO DESCONOCIDO") | `clsMovimientoConceptos.cs:414` |
| 2539 | L | SICORE de proveedores con formato internacional | `Archivos/PercepcionSICORE.cs:133` |
| 2721 | N | Titular para consumidor final en facturas de farmacia | `clsFacturacionCuotasTerceros.cs:1321` |
| 2930 | L | Crédito fiscal en la factura en cuotas | `clsComprobanteVenta.cs:771-810` |
| 2953 | N | Producto "flete" de los presupuestos | `clsComprobanteRendicion.cs:57-106` |
| 2972 | L | Separar los ítems financiados en el libro IVA ventas | `clsMovimientoConceptos.cs:688`, `:760` |
| 2991 | L | SICORE de ventas con coma decimal | `Archivos/PercepcionSICORE.cs` |
| 3007 | C | Formato de fecha del exportador TORN (por defecto ddMMyy) | `clsMovimientoConceptos_Exportacion.cs` |
| 3039 | N | Número de lote FECESCOR; se incrementa con `Actu_V2` | `clsInformes_Facturacion.cs:1266` |

---

## 15. Implicancias para GoodApps

1. **Separar "plantilla de corrida" de "tipo de factura".** Procoop mezcla en `TIPO_FAC` la clasificación comercial y la configuración del proceso, con fechas como expresiones de texto. En GoodApps conviene una entidad `PlantillaFacturacion` versionada (servicios, filtros, reglas de vencimiento expresadas como "día hábil N del mes" o "+N días"), y una `CorridaFacturacion` inmutable con los valores ya resueltos.
2. **Corrida como máquina de estados**: borrador → simulada → aprobada → emitiendo → emitida / emitida parcial / fallida → (autorizando CAE) → cerrada. Procoop no tiene "aprobada" ni "parcial"; el lote que falla deja la corrida a medias sin estado explícito. Persistir el avance por lote y permitir **reanudar** desde el último lote confirmado.
3. **Idempotencia**: la marca `ULT_FAC + SEC_PER` por servicio es frágil (se "deshace" restando períodos al anular). Mejor una tabla de "período facturado por servicio" con referencia al comprobante, o una restricción única (servicio, período, secuencia) sobre comprobantes vigentes.
4. **Concurrencia**: reemplazar el bloqueo de tabla `FACTMES` por un lock por (cooperativa/tenant, tipo de factura, período), y la numeración por **secuencias por (comprobante, punto de venta)** asignadas recién al confirmar el lote, con transacción única facturas + numerador (Procoop hace dos commits).
5. **Ejecución**: trabajo en cola (worker) con lotes de tamaño configurable, paralelizable por lote en el *cálculo* pero con numeración secuencial al persistir para respetar el orden de reparto (zona/sector/recorrido). Exponer progreso y una tabla de errores por servicio, como hoy.
6. **Simulación de primera clase**: mismo motor, sin efectos, con muestras automáticas (una cuenta por categoría, por condición fiscal, grandes/chicos) y comparación de totales contra el período anterior antes de aprobar.
7. **Resolución de comprobante y punto de venta** como servicio puro y testeable: (situación IVA, servicios, signo del total, MiPyME, grupo con forzar ND) → comprobante; (servicios, usuario, equipo, empresa) → punto de venta. Validar la matriz completa antes de correr, como hace `ValidarDatos`.
8. **Totales negativos**: modelar explícitamente "si el neto del período da negativo, emitir NC" vs. "acumular como saldo a favor" (caso generación distribuida). Hacerlo configurable por servicio.
9. **Electrónica**: nunca persistir facturas "bloqueadas −1" mezcladas con bloqueos de cobro. Separar `estado_autorizacion` (pendiente/autorizada/rechazada) de `bloqueo_cobro` (causa, historial). Bloquear el arranque de una nueva corrida si hay comprobantes pendientes de CAE de más de N días.
10. **Anulación**: con ARCA, la anulación de una autorizada es siempre una NC asociada (`RELACION_COMP` con "informar CUIT"). La eliminación física solo para no autorizadas y sin pagos; conservar copia de auditoría (equivalente a `ANUFAC`). Reproducir las opciones de reversión: revertir consumo, dejarlo pendiente para refacturar, liberar cuotas/cargos, revertir stock.
11. **Vencimientos**: soportar 1 a 4 vencimientos con estrategias de recargo enchufables (fijo $, fijo % compuesto, % diario, tramas por importe, trama por vencimiento) e IVA sobre el recargo según el concepto de interés. Validar días hábiles con calendario de feriados por provincia.
12. **Código de barras**: estrategia por formato (como Procoop), pero definida **declarativamente** (campos, longitudes, padding, DV) para no programar una clase por cooperativa. Incluir la biblioteca de DV (módulo 10 ponderado 1-3-5-7-9, 9-7-1-3, EAN, módulo 11) y QR EMVCo con CRC16. Mantener los prefijos 40/41/42/43 para compatibilidad con lo que ya tienen impreso los socios en la migración.
13. **Plantillas de impresión**: la convención de nombres de reporte (`e_`, `2_`, `t_`, `_<comprobante>`, `_<situación IVA>`) indica cuántas variantes existen; en GoodApps resolverlo con plantillas por tenant y reglas de selección explícitas.
14. **Talones**: agrupar facturas de una cuenta por "grupo de talón" para un único código de pago es una funcionalidad que las cooperativas usan (energía + agua + sepelio en un solo pago); modelarla como "documento de pago" independiente de los comprobantes fiscales.
15. **Recategorización y retroactivos**: son procesos batch con vista previa, confirmación y nota de auditoría en la cuenta. Los retroactivos no generan comprobantes: generan cargos pendientes para la próxima corrida; mantener esa separación y la protección contra duplicados.
16. **Modificación masiva**: limitarla a comprobantes no autorizados electrónicamente o, si lo están, solo a datos no fiscales (vencimientos 2–4 e importes con recargo). Auditar siempre.
17. **Importaciones de terceros**: definir un formato canónico (cuenta/identificador, concepto, cantidad, precio, descripción) con *mappers* por origen (Excel, DBF, ancho fijo, CSV), validación previa con reporte de errores y destino elegible (cargo pendiente, cuota, factura directa).
18. **Reguladores**: ENARGAS (SARI y FCU-DS, bloques subsidiados N2/N3) es imprescindible para las cooperativas de gas; ENACOM en Procoop es solo un informe puntual de 2020 y puede quedar fuera del MVP.
19. **Parámetros**: los ~50 `Busca_V2_*` de este dominio deben convertirse en configuración tipada por tenant, con valores por defecto documentados; la variable 2264 (sigla) dispara comportamientos por cooperativa que deben volverse opciones explícitas.

---

## 16. Dudas abiertas

1. **Comportamientos posiblemente erróneos en Procoop** (confirmar con usuarios antes de replicarlos o "corregirlos"):
   - Recategorización de gas: el filtro "nunca recategorizados" no se aplica (el resultado del filtro se descarta) (`clsRecategorizacion.cs:315`).
   - En la masiva, las relaciones de comprobantes (`RELACION_COMP`) se generan con la plantilla de inserción de `ANTIFACTU` (`clsComprobanteFactura.cs:1501`). ¿Se usa en la práctica?
   - Importaciones de terceros a facturas o ventas: se pide un número nuevo y se usa el siguiente, lo que **deja un número sin usar** por cada importación (`clsFacturacionCuotasTerceros.cs:957/997`, `1065/1079`).
   - Lectura de Credicoop: compara el año del vencimiento con un año de 2 dígitos (`Codigo_BancoCredicoop.cs:28`).
   - Modificación de IVA de cuotas: para la sobretasa usa la tasa general nueva (`clsModificacionCuotas.cs:744`).
   - Retroactivos: el interés se calcula con signo negativo (`clsRetroactivos.cs:431`). ¿Los retroactivos son siempre devoluciones?
   - Tramas por importe: el cálculo de los vencimientos 3 y 4 parte del total original y no del anterior (`clsComprobanteFactura.cs:1856-1863`).
   - La "demora" informada al final de la masiva sale negativa (`clsFacturacionMasiva.cs:669`).
   - *Segunda pasada*, posibles bugs adicionales, todos **[VERIFICAR]**:
     - **Numeración y autorización**:
       - Búsqueda de CAEA con `VTO_CESP <= Hoy` (ver §4.4) (`clsComprobante.cs:825`).
       - Firmas electrónicas: `VerificarSiUsuarioFirmo` no filtra por tipo de documento (`clsComprobante.cs:277-441`).
     - **Comprobantes y ventas**:
       - `AgregarDetalle` une líneas de stock por producto y precio, pero después busca la línea solo por producto (`clsComprobanteBase.cs:165-190`).
       - `GetItCompV`: con descuento, el IVA se calcula sobre el neto sin descuento (`clsComprobanteVenta.cs:1361`).
       - `GetPAGOS360_1M`: la condición `CODIGO_BARRA3 != "" || != null` siempre es verdadera; la versión para talones ignora el estado (`clsFacturasImpresion.cs:2775-2793`).
     - **Rendición de fletes** (`clsComprobanteRendicion.cs:57-106`):
       - Los valores `TipoTransporte.SinAsignar` y `Propio` del enum valen ambos 0.
       - El "precio por km del viaje" es en realidad precio / viajes.
     - **Exportadores e importaciones**:
       - ENARGAS FDU: el mensaje "categoría no encontrada" usa el marcador {4} con solo 4 argumentos y lanza `FormatException` (`clsEnargas.cs:851-`).
       - ENARGAS SICC: las filas "F" no excluyen anuladas ni internas, y las filas "C" informan el total de la factura, no lo cobrado (`clsEnargas2.cs:1731-1810`).
       - Importación EME: con cantidad 0 divide por cero, y calcula un cruce por DNI que no usa (`clsFacturacionCuotasTerceros.cs:423-490`).
       - FEDECOBA: el contador de registros no se reinicia entre archivos.
     - **Orden de ítems**: `clsItemsOrd.ActualizarOrden` asigna orden + ajuste en vez del orden del vecino, lo que puede generar huecos o duplicados (`clsItemsOrd.cs:8`).
     - **Informes de facturación** (`clsInformes_Facturacion.cs`):
       - `Get_Cuotas_Facturadas_Pendientes` (`:1416-1575`):
         - compara el `TIPO` de la factura con el número de `TipoFecha`;
         - `SinActivos` repite `CONDICION == 2 || == 2`;
         - `ConActivos` se aplica a la consulta equivocada;
         - `SoloBaja` mira solo el primer servicio.
       - `Get_ComprobantesNoFacturados`: el IVA del interés usa el factor del neto y la cuenta es con `float` (`:170-296`).
       - `Get_VentasProductos` (`:3080`, `:3108`):
         - el filtro de sucursal compara contra `COD_COM`;
         - en créditos el IVA queda `−IVA1 + IVA2 + IVA3` (solo IVA1 cambia de signo).
       - `Get_ConceptosXFactura`: con "filtrar por domicilio del servicio" referencia `SERSOC.ZON_LEC` fuera del `outer apply`, lo que hace fallar el SQL. Además arma las fechas con `ToShortDateString`, que depende de la configuración regional (`:2033-2036`, `:2020`).
       - SQL concatenado con valores de filtro, con riesgo de inyección: `GetZonas` (`clsMovimientoConceptos.cs:2499`) y `InformeEPRE`, aunque este solo usa nombres fijos.
       - `getComprobantes_Bloqueados`: **desbloquea como efecto lateral** las facturas pagas al listar (`:1326`).
     - **Movimiento de conceptos**: la apertura de cuotas por producto prorratea la cantidad sobre `NETO` y el importe sobre `SUBNETO`, con aritmética `float` (`clsMovimientoConceptos.cs:673-676`).
     - **Facturas de farmacia**: asume que los códigos de producto de medicamentos y perfumería son consecutivos (base, +1, +2) (`clsFacturacionCuotasTerceros.cs:1321-`).
     - **Banco de Córdoba 43**: el importe de 6 dígitos tope; ver 12.4.1.
2. **Corridas parciales**: si un lote falla, ¿cómo se recupera hoy? ¿Se vuelve a correr la masiva completa confiando en `ULT_FAC` para no duplicar?
3. **Fechas dinámicas**: la sintaxis de `Nucleo.GetFechaDinamica` (expresiones guardadas en `TIPO_FAC.VTO1..4`) no está en estas clases; relevarla en `CapaNucleo`.
4. **Variables obligatorias** 307, 311, 543, 607, 2247: confirmar su significado en el catálogo (doc 09).
   - *Respuesta (segunda pasada)*: según los textos de validación y su uso:
     - 307: concepto de interés por mora.
     - 311: concepto de interés anterior.
     - 543: código de `IMPUESTO` para el IVA.
     - 607: concepto de interés por financiación.
     - 2089: concepto de interés del comprobante de venta.
     - 2247: concepto de descuento en venta contado o 1 cuota.
   - Sus valores dependen de cada base **[VERIFICAR]**.
5. **Secuencia**: la condición de refacturación por secuencia (`clsFacturacionMasiva.cs:1801`) permite volver a facturar el mismo período con cualquier secuencia ≠ 0; ¿qué uso real tiene (bimestral, refacturaciones, servicios quincenales)?
6. **Grupos de factura**: ¿cuántas cooperativas usan más de un grupo (facturas separadas por servicio) y `FORZAR_ND`?
7. **Formatos de código de barras en uso**: hay ~100; relevar cuáles usan las cooperativas objetivo de GoodApps para priorizar.
8. **ENARGAS**: qué protocolo (SARI vs. FCU-DS) está vigente hoy y para qué distribuidoras.
9. **Cuentas de control**: el tipo "Cuentas_Control" se trata igual que "Varias cuentas" en la selección; ¿la diferencia es solo de UI o de permisos?
10. **Pagos360**: el significado exacto de los estados de solicitud (0, 1, 4 y el resto) debe confirmarse con el doc 05.
