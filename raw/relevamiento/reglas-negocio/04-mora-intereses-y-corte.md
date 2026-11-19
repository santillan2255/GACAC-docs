# 04 — Mora, intereses y corte

Reglas de Procoop sobre intereses por pago fuera de término, gestión de mora (instancias y notificaciones), corte y reconexión de servicios, planes de pago y prescripción de deuda. Salen del código descompilado de Procoop 10.4.6.722.

Las citas usan el formato `Clase.Método` y `archivo:línea`. Las rutas son relativas a `binarios/decompilado/ReglasNegocio/`. Los parámetros se identifican por número (`Nucleo.Busca_V2_*(N)`); sus descripciones están en `CapaNucleo/clsVariables.cs`. El código es de terceros: se describe en prosa y con pseudocódigo breve, sin copiar fuentes.

## 1. Mapa general

Procoop cobra intereses en tres momentos distintos, y cada uno tiene su propio motor de cálculo:

| Momento | Qué se calcula | Dónde |
|---|---|---|
| Al **emitir** la factura | Importes de los vencimientos 2, 3 y 4 (`TOTAL2..TOTAL4`): "recargo entre vencimientos" | `clsComprobanteFactura.Get_ImporteFactura` (`ReglasNegocio.Facturacion/clsComprobanteFactura.cs:1771`) |
| Al **cobrar** o consultar deuda (caja, entes, portal) | Recargo por mora pasado el último vencimiento, más el recargo entre vencimientos ya devengado | `clsCobranzas.Get_Recargo` (`ReglasNegocio.Cobranzas/clsCobranzas.cs:1814`) |
| En un **proceso masivo** | "Intereses a facturar por deuda vencida impaga" (o ya paga fuera de término), que se cargan a la próxima factura | `clsFacturarIntereses` (`ReglasNegocio.Facturacion/clsFacturarIntereses.cs`) |

La gestión de mora funciona aparte del cálculo de intereses. Es un circuito de **notificaciones por instancias** (tablas `NOTIFICA` y `COMPNOTI`):

1. Se seleccionan candidatos desde "Circulares" (`clsCirculares`).
2. Cada notificación avanza de instancia en instancia (`clsGestionMora`).
3. La última etapa es el "tratamiento de morosos": órdenes de trabajo (OT) de desconexión, cambio de estado o cambio de categoría.
4. Si la deuda se paga, la reconexión puede ser automática (`clsRegistracionCobranza`).

## 2. Modelo de datos involucrado

Tablas según `binarios/CapaDatos-tablas.md` y su uso en el código:

| Tabla | Rol |
|---|---|
| `FACTURAS` | Tiene `VTO1..VTO4` y `TOTAL1..TOTAL4` (importe a pagar en cada vencimiento), `SALDO`, `FECHASALDO` (fecha del último pago), `PAGA` (`"P"` = paga), `NOINTERES` (no calcular interés), `ID_BLO` (causa de bloqueo), `CLASE` (1 = cuota de financiación), `NRO_REF` (convenio), `COD_FAC` (se usa como marca `'Punitorio'`). |
| `MORATAS` (+ `MORATAS_CATSER`) | Tabla de tasas de mora por rango de fechas: `FEDESDE`, `FEHASTA`, `TASA_CASO` (% diario), `TIPO` (tipo de factura; vacío = todos), servicio y, opcionalmente, categorías de servicio. |
| `TABMORA` → `INDICESMORA` | Tabla de índices (fecha → valor) para calcular la mora "por índices". `TABMORA.TIPO_FAC` restringe los tipos de factura alcanzados. |
| `TRAMASREC` | Tramas de recargo para los vencimientos 2 a 4, por tipo de factura y rango de importe (`IMP_DES`, `IMP_HAS`, `VAL_TRAMA`, `TIPOVALOR`). |
| `CONCEPTOS_INT` | Conceptos e impuestos que forman la base del interés (por servicio). `TIPO` distingue el uso (ver §3.2 y §4.2). |
| `DESCUENTO_CAJA` | Descuento por pronto pago (tasa negativa) por tipo de factura y rango de días desde la emisión. |
| `EXC_MORA` | Excepciones de mora por cuenta: `VIGENCIA` (`'SI'`), `RECLAMAR`, `RETENER`, `FECHA` (hasta cuándo rige), `FEC_DEUDA` (deuda anterior a esa fecha), `FEC_VIG` (fecha de cancelación), `MOTIVO`, `USU_REG`, `USU_VIG`, `FEC_REG`. |
| `INSTANCI` | Catálogo de instancias de mora (CANDIDATOS, 1er aviso, 2do aviso, corte, etc.). La instancia de candidatos es el parámetro 2202. |
| `NOTIFICA` | Una notificación por cuenta, lote e instancia: `COD_INS`, `LOTE`, `FECHA`, `VTO_CIR` (vencimiento de la circular), `RECIBIO`/`FEC_REC`, `PROMESA`, `RESUELTA`, `FEC_RES`/`USU_RES`, `COD_CAU` (causa de baja), `CALIFICA`, `DEUDA`, `DEUDA_AC`, `COD_PLA` (plantilla), `OBSERVA2` (bitácora). |
| `COMPNOTI` | Comprobantes incluidos en cada notificación, con el saldo al momento de notificar. |
| `CAUBLOQ` / `HISBLOQ` | Causas de bloqueo de comprobantes e historial de bloqueos. |
| `CONEXION` | Conceptos a cobrar por evento. `TIPO_CON = 4` es "Reconexión de servicio" (enum `TipoConceptoCobrar`, `ReglasNegocio.Titulares/TipoConceptoCobrar.cs`). |
| `PLAN_CUO`, `TIP_FIN`, `REC_CON`, `IT_RECCO` | Planes de pago, tipos de financiación, cabecera del convenio y comprobantes refinanciados. |
| `DEUDAVTA` | Cuotas pendientes de facturar de un comprobante de venta (`COMP_VEN`). `TPCUOTA = 1` son intereses diferidos. |
| `INFLACIO` (vía `TABINFL`) | Índices de ajuste de cuotas de planes. |

## 3. Recargo entre vencimientos al emitir la factura

### 3.1 Cálculo de `TOTAL2..TOTAL4`

`clsComprobanteFactura.Get_ImporteFactura` (`clsComprobanteFactura.cs:1771-1793`) calcula el importe de cada vencimiento posterior al primero. La variante sale del parámetro **74** (enum `Facturacion_TipoInteresFactura`); el valor de recargo suele ser el parámetro **578**.

| Valor del 74 | Regla | Archivo:línea |
|---|---|---|
| Ninguno | `TOTALk = TOTAL1` | — |
| Variable_Porcentaje | `TOTALk = TOTAL1 + TOTAL1 × 578% × días(VTOk − VTO1)`, más IVA del interés | `:1795` |
| Fijo_Porcentaje | Porcentaje fijo **en cascada**: VTO2 = TOTAL1 × (1+p); VTO3 se calcula sobre VTO2, y así sucesivamente | `:1803` |
| Fijo_Pesos | Suma `578 × 1`, `× 2` o `× 3` pesos según el vencimiento, **sin IVA** | `:1826` |
| Tramas_Importe | Busca en `TRAMASREC` la fila del tipo de factura (o con `TIPO` vacío, con menor prioridad) cuyo rango `IMP_DES..IMP_HAS` contiene el importe y aplica `VAL_TRAMA % × días(VTOk − VTO1)`. Si `TIPOVALOR = 1`, días = 1 (valor fijo). Para VTO3 y VTO4 el cálculo es **en cascada**: primero arma un importe intermedio con interés e IVA y vuelve a aplicar la trama sobre ese importe (ver §3.3). | `:1839-1868` |
| Trama_Vencimiento | `TRAMASREC` con `IMP_DES = IMP_HAS = 1, 2 o 3` identifica la fila de cada vencimiento. Si no existe, usa la primera trama del tipo (o general). Sin cascada. | `:1871-1916` |

`CalcularIVA_Interes` (`:1918-1927`) aplica al interés la alícuota del concepto de interés (parámetro **606**), según la situación de IVA del titular, más la percepción si corresponde.

Otros parámetros de emisión: **2109** (intereses en los vencimientos 2 y 3), **2283** (recargo por cambio de trama) y **733** (factura en cuotas con interés).

### 3.2 Qué pasa con ese recargo al cobrar

Cuando se cobra antes del VTO4, el recargo es la diferencia entre el `TOTALk` del vencimiento vigente y `TOTAL1` (ver §4.3). Ese importe ya está "embebido" en la factura con IVA incluido, y se lo trata así: se usa `Calcular_TasasIVA_Total`, que separa el IVA del total, en lugar de sumarlo.

### 3.3 Detalle de cada variante (segunda pasada)

Revisión método por método de `clsComprobanteFactura.cs:1771-1927`:

- **`CalcularTotalFactura_VariablePorcentaje`** (`:1795-1801`): días = `(VTOk − VTO1)` en días enteros; interés = `importe × 578 / 100 × días`; se le suma el IVA del interés. Interés simple sobre el `TOTAL1`.
- **`CalcularTotalFactura_FijoPorcentaje`** (`:1803-1824`): VTO2 = `importe + IVA(importe × 578%)`; VTO3 aplica el mismo porcentaje sobre el total del VTO2 y VTO4 sobre el del VTO3. Es interés **compuesto por escalón**, y cada escalón incluye el IVA del escalón anterior en la base.
- **`CalcularTotalFactura_FijoPesos`** (`:1826-1837`): suma `578 × 0/1/2/3` pesos para VTO1/2/3/4 (cualquier otro vencimiento cae en ×3). No pasa por `CalcularIVA_Interes`: el recargo en pesos no lleva IVA.
- **`CalcularTotalFactura_TramaImporte`** (`:1839-1868`): la fila de `TRAMASREC` se elige por tipo de factura (`TIPO` exacto antes que `TIPO = ''`, luego `COD_TRM`) y por el rango de importe del `TOTAL1`. Para VTO3 y VTO4 el código arma primero un importe intermedio `importe + IVA(importe × trama × días)` y aplica de nuevo la trama sobre él; en VTO4 vuelve a partir de `importe` pero con el intermedio como base. Los días usados son siempre `VTOk − VTO1`, de modo que en VTO3/VTO4 se cobra interés sobre interés y con días acumulados. **[VERIFICAR]** con facturas reales si este doble cómputo es intencional: podría ser un error del código original.
- **`CalcularTotalFactura_TramaVencimiento`** (`:1871-1916`): la fila con `IMP_DES = IMP_HAS = 1/2/3` corresponde a VTO2/VTO3/VTO4. Si falta, toma la primera trama del tipo. Interés = `importe × trama × días / 100` (o `× 1` si `TIPOVALOR = 1`) más IVA, sin cascada.
- **`CalcularIVA_Interes`** (`:1918-1927`): toma el concepto del parámetro **606** ("Concepto para interés por mora"). Si el concepto existe y la factura tiene situación de IVA, devuelve `importe + ImporteIva` (`Impuestos.Calcular_TasasIVA` con la percepción del producto, `Pre_Per`). Si el concepto no está configurado, el recargo queda **sin IVA** sin avisar.
- **`ExisteMoratas(cod_tip, out des_mot)`** (`:492-508`): devuelve `true` si existe alguna fila de `MORATAS` con `TIPO` igual al tipo de factura (sin distinguir mayúsculas) y `DES_MOT` no vacío, y devuelve esa descripción. No mira la vigencia (`FEDESDE`/`FEHASTA`) ni las tasas generales (`TIPO` vacío), así que solo informa si hay tasas **específicas** del tipo.

## 4. Recargo por mora al cobrar (motor principal)

### 4.1 Variables de cálculo

`clsCobranzas.VariablesConsulta` (`clsCobranzas.cs:399-524`) carga una sola vez:

| Parámetro / fuente | Uso |
|---|---|
| Tabla `MORATAS` | Tasas por rango de fechas |
| Tabla `DESCUENTO_CAJA` | Descuentos por pronto pago |
| `Nucleo.CalculoRecargoMoraPorIndices()` | Vale `true` si `INDICESMORA` tiene filas (`CapaNucleo/Nucleo.cs:3028-3043, 4406`) |
| `GetTipoFacturaRecargoMoraIndices()` | `TABMORA.TIPO_FAC` (`Nucleo.cs:3045-3064, 4411`) |
| 600 | Recargo diario fijo (% diario). También puede llegar como argumento desde el ente recaudador. |
| 606 / 307 / `TIPO_FAC.COD_CON` | Concepto de interés por mora: general / en modo "Financiación de deuda" / por tipo de factura |
| `TIPO_FAC.COD_CON2` / 2080 | Concepto de interés entre vencimientos |
| 621 | "Recargo desde tercer vencimiento": el interés corre desde el último vencimiento y no desde el VTO1 |
| 608 | Redondear el recargo total a 1 decimal |
| 609 | Importe mínimo del recargo por mora |
| 372 | Gastos administrativos fijos por factura en mora |
| 625 | Calcular intereses sobre créditos (notas de crédito) |
| 299 / 1002 | Jubilados: quitar el recargo del VTO2 / no cobrarles recargo |
| 1011 | Modo de diferimiento: 1 NoDiferir, 2 DiferirInteresMora, 3 DiferirTodo (0 se toma como 1) |
| 2356 | Discriminar el interés entre vencimientos del interés por mora |
| 2363 | Recargo entre vencimientos proporcional al saldo |
| 2826 | IIBB sobre el interés entre vencimientos |
| 2300 | Códigos de impuesto (separados por coma) que se excluyen de la base |
| 3135 | Respetar `SUMSOC.SIN_RECARGO` (cuenta sin recargo) |
| 3167 | La base del interés es la suma de ítems de conceptos configurados en `CONCEPTOS_INT` (`TIPO > 0`) |
| 2086 | Situación de IVA por defecto |
| Ente recaudador | `RECARGO3VTO`, `DIFERIR`, `COBVTO1` sobrescriben el comportamiento para cobros por entes |
| 719 / 718 | Comisión de cobranza remota (concepto e importe) |

Además, el parámetro **2385** excluye de caja y consulta los comprobantes con VTO2 anterior a hoy menos N días, salvo que el usuario tenga el permiso `ExcluirComprobVto2` (`clsCobranzas.InfoFiltros`, `:71-86`).

### 4.2 Habilitación del interés por factura

`Get_Recargo(Datos_Factura…)` (`clsCobranzas.cs:1701-1761`) define `CalcularInteres = false` en estos casos:

- el titular es jubilado (`Tipo_Ocupacion = 2`) y el parámetro 1002 dice no cobrarle;
- la factura tiene `NOINTERES`;
- la cuenta tiene `SIN_RECARGO` y el parámetro 3135 está activo.

`Get_Datos_Factura` (`:2971-3183`) arma la base. Calcula el importe de los impuestos excluidos (2300) y el importe de recargo por conceptos (3167). En las cuotas de financiación separa los ítems por `SUBTIPO`: 24 capital, 21 interés actual, 22 interés anterior y 23 interés por mora. En pagos online (Pagos360) toma la fecha de cobro y un posible `InteresFijo`.

Hay una versión equivalente para cuotas de talón (`:1763-1812`).

### 4.3 Algoritmo `Get_Recargo(InfoInteres, variables)` (`clsCobranzas.cs:1814-2102`)

Pseudocódigo resumido:

```text
si !CalcularInteres o (esCrédito y !param625) o saldo == 0 → recargo 0

si FechaConsulta < VTO1 y hay DESCUENTO_CAJA para el tipo (solo socios):
    tasa negativa según días desde la emisión (DIA_DESDE..DIA_HASTA)

si FechaConsulta <= VTO4:                        // todavía en vencimientos
    entreVto = TOTAL_k(vencimiento vigente) − TOTAL1 − lo ya absorbido por pagos (según FECHASALDO)
    si jubilado y param299: restar (TOTAL2 − TOTAL1)
    si param2363: entreVto × SALDO / TOTAL1
sino:                                            // mora
    fechaBase = sin pagos → VTO1 (o VTO4 si 621); con pagos parciales → vencimiento que corresponde a FECHASALDO
    base      = sin pagos → TOTAL1 (o TOTAL4 si 621) − impuestos excluidos (2300); con pagos → SALDO
                si 3167 → base = importe de conceptos de CONCEPTOS_INT
    días      = FechaConsulta − fechaBase
    tasa por prioridad:
      a) param600 (o recargo diario recibido) ≠ 0 → base × tasa × días / 100
      b) INDICESMORA con datos y tipo de factura alcanzado:
           factor = índice(≤ FechaConsulta) / índice(≥ fechaBase) − 1 ;  interés = base × factor
      c) MORATAS: por cada tramo FEDESDE..FEHASTA que se solapa con [fechaBase, FechaConsulta],
           filtrando por TIPO de factura (o vacío) y categoría de servicio (MORATAS_CATSER tiene prioridad),
           interés += base × TASA_CASO × díasSolapados / 100
    IVA y percepción con la alícuota del concepto de interés; IIBB con Calcular_IBR
    si 2356 o 621: separar entreVto = (TOTAL4 − TOTAL1 − absorbido) × SALDO / TOTAL1;
                   si !621 descontarlo del recargo por mora
si recargoMora < mínimo(609) → recargoMora = 0
si pasó VTO4 → sumar gastos administrativos (372)
Recargo_Total = mora + entreVto + gastos ; si 608 → redondear a 1 decimal
```

Detalles:

- **Índices**: `CalcularRecargoMoraPorIndice` (`:2104-2138`) y `GetIndiceMora` (`:2154-2167`). Para la fecha de consulta busca el índice "anterior o igual"; para la fecha base, el "siguiente o igual". Convierte el resultado en una tasa diaria equivalente para mostrarla en el detalle.
- **MORATAS por tramos**: `:1975-2042`. Si una categoría de servicio coincide, se usan solo las tasas de esa categoría; si no, las tasas sin categoría. Para cada tramo se calculan los días dentro de él.
- **Separación de componentes**: `InfoRecargo` (`:89-174`) separa `RecargoMora`, `RecargoEntreVencimiento` y `GastosAdministrativos`, cada uno con Neto, IVA1, IVA2, Percepción e IBR (`InfoImporte`, `:176-320`).

Conclusión: el interés es siempre **simple y diario** sobre la base. No se capitaliza; la única excepción es el método de índices, donde el cociente de índices ya trae la composición del índice.

### 4.4 Diferimiento del interés

`InfoCobranza` (`clsCobranzas.cs:671` en adelante) calcula tres importes: `Total` (`:615-630`, `:955`), `ImporteaFacturar` (`:842-860`) e `ImporteNetoaDiferir` (`:862-872`). Enum `DiferirInteres` en `:2510-2518`.

| Modo (1011 o ente) | Qué paga el titular en caja | Qué queda diferido |
|---|---|---|
| NoDiferir | Factura + mora + entre vencimientos | Nada |
| DiferirInteresMora | Factura + entre vencimientos | El interés por mora |
| DiferirTodo | Solo la factura | Todo el interés |

Registro (`clsRegistracionCobranza.RegistrarIntereses`, `ReglasNegocio.Cobranzas/clsRegistracionCobranza.cs:655-955`):

- **Lo que se cobra en el acto** se factura en el momento con un comprobante nuevo por cuenta, situación de IVA, situación de IIBB y, si el parámetro **1056** está activo, por tipo de factura.
  - Ítems: "Intereses - {comprobante}" (concepto 606 o `COD_CON` del tipo de factura) y "Intereses en Vto - {comprobante}" (concepto 2080 o `COD_CON2`), ambos con subtipo `Intereses_cobrados_en_caja`.
  - Si aplica descuento de caja, ítem "Descuento x %".
  - El tipo de comprobante lo decide el parámetro **273**: factura o **nota de débito** (`NuevaFactura`, `:1305-1333`). Si el total da negativo, se invierte a crédito.
  - Ese comprobante queda relacionado con las facturas pagadas.
  - Las cuotas de financiación (`CLASE = 1`) copian sus ítems de interés (subtipos 21, 22 y 23) y se relacionan con el convenio.
- **Lo diferido** genera un comprobante de venta (`COMP_VEN`) con la operación `Intereses_Diferidos_Debito` (o `_Credito` si el neto es negativo) y una cuota `TPCUOTA = 1` en `DEUDAVTA` (`:834-955`).
  - La facturación masiva levanta esas cuotas en la **próxima factura** cuando se procesa con la opción `InteresesDiferidos` (`ReglasNegocio.Facturacion/clsFacturacionMasiva.cs:1814-1826`).
  - El parámetro **2828** asocia la cuota al servicio de la factura original.
- **Recargos por medio de pago** (cheque de terceros, transferencia, tarjeta) usan los conceptos **487**, **2070** y **2069** (`:1215-1303`). El parámetro **486** es la tasa diaria por valores a fecha.

### 4.5 Validaciones de carga de tasas y descuentos (segunda pasada)

Las pantallas de alta de `MORATAS` y `DESCUENTO_CAJA` no están en los ensamblados descompilados (ver §14). Sí están los métodos de `clsCobranzas` que esas pantallas usan para validar:

- **`Hay_Moratas(tipo, desde, hasta, cod_mot, servicio, categorías)`** (`ReglasNegocio.Cobranzas/clsCobranzas.cs:2785-2799`): busca otras tasas (`COD_MOT` distinto) del mismo `TIPO` de factura y servicio cuyo rango de fechas se superponga con `[desde, hasta]`. Solo informa conflicto si alguna de las categorías nuevas ya está asignada (`MORATAS_CATSER`) a una de esas tasas superpuestas. Consecuencia: **dos tasas generales (sin categorías) superpuestas para el mismo tipo y servicio no se detectan como conflicto**. En el cálculo (§4.3), las dos sumarían interés en el tramo común. **[VERIFICAR]** si la pantalla tiene otra validación adicional.
- **`GuardarCategoriasMorata`** (`:2801-2822`): reemplaza todas las categorías de una tasa (borra y vuelve a insertar). `TieneCategoriasAsignadas` (`:2824`) informa si la tasa es específica por categoría.
- **`Exist_Descuento(tipo, díaDesde, díaHasta, ignorar)`** (`:4448-4452`): no se permiten dos tramos de `DESCUENTO_CAJA` del mismo tipo de factura con rangos de días superpuestos.
- **`Get_MaxDescuentoCaja(tipo, ignorar)`** (`:4454-4459`): el porcentaje máximo que se puede cargar en un tramo es `100 − suma de los demás tramos del tipo`. Es decir, la suma de los descuentos de todos los tramos de un tipo no puede superar el 100 %. Es una regla de carga y no tiene sentido financiero, porque los tramos no se acumulan al cobrar.
- `Get_DescuentosCajaDataSource` (`:4431`): lista de tramos ordenada por `DIA_DESDE`, sin regla.

## 5. Proceso masivo "Intereses a facturar" (`clsFacturarIntereses`)

### 5.1 Filtros y variantes

`Filtros` (`clsFacturarIntereses.cs:17-53`): tipo de factura, rango de fechas, cuenta, titular, grupo (incluir o excluir), `InteresDiario` (% diario), solo servicios conectados, procesar pagos entre fechas, `NoCalcularInteresAnterior`, concepto de interés, servicio, `FacturasImpagas` y `CalcularInteresesSoloSobreCargos`.

`Get_Comprobantes` (`:230-243`) elige el algoritmo según el parámetro **2292** ("Tipo de interés para facturas impagas"):

| 2292 | Variante | Método |
|---|---|---|
| 1 | Estándar | `Get_ComprobanteIteres` sin cheques diferidos → `Get_InteresEstandar` |
| 2 | **CAU** | `Get_ComprobanteIteresCAU` (`:245-432`) |
| 3 | Cheques | `Get_ComprobanteIteresCheques` (`:434-631`) |
| 4 u otro | **AL** | `Get_ComprobanteIteres` con cheques diferidos → `Get_InteresEstandarAL` (`:997-1214`) |

### 5.2 Selección de facturas

`Get_Facturas` (`:1216-1258`) toma facturas de débito no anuladas (`ESTADO = ""`) y sin `NOINTERES`. Si no se pide `FacturasImpagas`, exige además saldo distinto de cero o una factura pagada con `FECHASALDO ≥ FechaDesde`, de modo que también se cobra interés por **pagos fuera de término**. Filtra por tipo, cuenta, titular, grupo (`AGR_SOC`) y servicios conectados (`clsSocios.Get_CondicionesConectadas`). El rango se aplica sobre VTO1 o sobre las fechas de pago.

### 5.3 Variante estándar (`Get_InteresEstandar`, `:846-995`)

`Get_ComprobanteIteres` (`:633-844`) arma la historia de pagos de cada factura: la emisión cuenta como primer "pago" y los pagos se agrupan por día. Después calcula el interés de cada tramo entre pagos sucesivos con el saldo vigente en ese tramo:

- **Entre VTO1 y VTO4**: suma los escalones `TOTAL2−TOTAL1`, `TOTAL3−TOTAL2` y `TOTAL4−TOTAL3` cuyos vencimientos caen dentro del tramo. Los trata con IVA incluido.
- **Después de VTO4**: `SALDO × días × InteresDiario / 100`, con IVA agregado.
- **Cheques diferidos**: la parte pagada con cheques posteriores al VTO4 genera interés hasta la fecha promedio de esos cheques (`:853-870`, `:916-952`).
- **`NoCalcularInteresAnterior`**: descuenta de la base la proporción `INTERES / TOTAL1`, donde `INTERES` es lo ya facturado con el concepto de interés en `ITEMSFAC`. Evita cobrar interés sobre interés.

La variante **AL** es igual, con ajustes por pagos y cheques anteriores al rango y topes de proporción entre 0 y 100 %.

La variante **Cheques** calcula, por cada cheque (`VALORES.FEC_CHEQ`), interés desde `FechaDesde` hasta la fecha del cheque (tipo "Cheque") y recalcula el saldo en cada tramo entre pagos.

### 5.4 Variante CAU (`:245-432`)

- Con `FacturasImpagas`: **punitorio** = `SALDO × InteresDiario / 100`, **una sola vez y sin multiplicar por días**. Tipo "Punitorio".
- Sin esa opción:
  - **Tramo VTO1 → VTO2**: base = suma de ítems cuyos conceptos o impuestos están en `CONCEPTOS_INT` (`TIPO ≠ 1`), × parámetro 578 %.
  - **Tramo desde VTO2**: `(TOTAL2 si no hubo pagos, o SALDO si los hubo) × días × InteresDiario / 100`.
- `CalcularInteresesSoloSobreCargos` (`:248-249`, `:393-394`) limita el cálculo a comprobantes con `COD_COM` 96 o 97 que no estén marcados como "Punitorio". En ese caso aplica un **3 % fijo en el código** sobre los cargos, proporcional al saldo.
- El IVA se calcula con `Impuestos.Calcular_TasasIVA` según la alícuota de cada producto.

### 5.5 Generación de los comprobantes de interés

`Guardar_Comprobantes` (`:1303-1411`):

- Agrupa por situación de IVA, cuenta y titular, y genera **un comprobante de venta por cuenta**. Tiene un ítem por factura ("Intereses - {nro}", subtipo `Intereses_cobrados_en_caja`); el vendedor sale del parámetro **1008**.
- Forma de pago `FormasDePago.Proxima_Facturacion`: el interés **no se factura en un comprobante fiscal aparte**, sino que entra como cuota en la próxima factura del servicio.
- Procesa en lotes de 100.
- Según opciones, marca `FACTURAS.NOINTERES = 1` para no volver a calcular, o `COD_FAC = 'Punitorio'`.

El informe previo es "Facturacion_InteresAFacturar" (`:1260-1301`).

### 5.6 Precisiones (segunda pasada)

- **Rango de fechas según la opción** (`Get_Facturas`, `clsFacturarIntereses.cs:1216-1258`). La base son facturas de débito (`DEB_CRE = 1`), no anuladas y sin `NOINTERES`. Sobre esa base:
  - con `CalcularInteresesSoloSobreCargos`: VTO1 dentro de `[FechaDesde, FechaHasta]`;
  - con `ProcesarPagosEntreFechas`: VTO1 anterior a `FechaHasta`. En la variante AL también entran las facturas saldadas dentro del rango con pagos que incluyen valores (cheques, `PLAN_CAJ.VALORES`);
  - con `FacturasImpagas`: saldo > 0 y VTO1 dentro del rango;
  - sin opciones: saldo > 0, o `FECHASALDO ≥ FechaHasta`.
- **`Get_Reporte`** (`:1260-1301`): el informe muestra solo los tramos de interés que quedaron **seleccionados** (`Interes_DetalleSeleccionado`). El operador puede destildar tramos o comprobantes antes de generar, y lo que destilda no se factura. Los totales por comprobante (`Dias`, `Interes_Neto`, `Interes_IVA`) suman solo los tramos seleccionados.
- **`Guardar_Comprobantes`** (`:1303-1411`):
  - el número de comprobante se toma una sola vez al inicio y se incrementa en memoria;
  - el bloqueo de `COMP_VEN` se libera (rollback) antes de generar;
  - todo se ejecuta al final como un único lote SQL que también actualiza `COMPPOS.ULT_NUM`.

  Si otro usuario emite el mismo comprobante en paralelo, puede haber numeración duplicada. **[VERIFICAR]** si en la práctica el proceso se corre en exclusividad.
- El ítem de cada comprobante de interés usa el **neto** del interés (`Interes_Neto`). El IVA se recalcula al facturar la cuota, con la alícuota del concepto elegido en el proceso.


## 6. Otros puntos de interés y bloqueo

- **`ExisteMoratas(cod_tip, out des_mot)`** (`clsComprobanteFactura.cs:492-508`): informa si hay tasas `MORATAS` para el tipo de factura. Se usa para validar y avisar. Solo considera las tasas específicas del tipo con descripción no vacía (ver §3.3).
- **`Asignar_Bloqueo`** (`clsComprobanteFactura.cs:2532-2590`): asigna `ID_BLO = causa` (o `null` para desbloquear) por SQL directo, en lotes de 500. **Nunca toca facturas con `ID_BLO = -1`**, que funciona como bloqueo permanente o de sistema. Por cada factura registra `HISBLOQ` con la causa, la fecha y el **nombre** del usuario (no el alias). **[VERIFICAR]** qué proceso asigna `-1`.
- **`Asignar_Bloqueo_ConIntereses`** (`clsComprobanteFactura.cs:2592-2635`): bloquea facturas (`ID_BLO`) y genera de inmediato una **factura de intereses** (`clsRegistracionCobranza.Generar_Factura_X_Intereses`, `:1335-1345`). Esa factura siempre es factura, aunque el 273 diga nota de débito, y lleva un ítem de producto con IVA incluido. Parámetros relacionados: **2770** (% de interés al desbloquear), **2771** (concepto) y **2984** (tipo de comprobante).
- **Caja**: con el parámetro **321** no se permite pagar en forma parcial la deuda notificada; hay que incluir todos los comprobantes de la notificación abierta (`clsCobranzaCaja.cs:1660-1669`). Con el **324** (más el **462**, que valida contra el VTO4) se obliga a cobrar primero las facturas más antiguas (`:1674-1690`). **302** y **2453** avisan si el titular está notificado.
- **Prepaga**: `clsPrepaga.EsExcepcion` (`ReglasNegocio.Cobranzas/clsPrepaga.cs:1023-1025`) no retiene intereses (parámetro **713**) si la cuenta tiene una `EXC_MORA` con `RETENER` vigente.
- **Otros parámetros**: **3138** (intereses punitorios sobre energía), **3162** (autorización para no cobrar recargo), **2487** (fecha fija de cálculo), **2078** (forma de cobro del interés entre vencimientos), **2562** y **2566** (mostrar interés), **3052** (% diario en reversiones), **339** (comprobante de intereses adelantados). La mayoría no aparece en `ReglasNegocio`; probablemente se usan en formularios no descompilados.

## 7. Gestión de mora

### 7.1 Estados y enums (`ReglasNegocio.Cobranzas/clsGestionMora.cs`)

- `NOTIFICA.RESUELTA` (`EstadoResolucion`): 0 Inicial (abierta), 1 Pagado, 2 Procesado (pasó a otra instancia), 3 Excluido (baja con causa), 4 En Técnica. El parámetro **2379** define cuándo se usa el estado "En Técnica".
- `Calificacion`: Sin calificar, Buena, Regular, Mala.
- `TipoNotificacion`: documento impreso, correo, SMS, aviso telefónico o talón de pago.
- `TipoOperacion`: Generar (desde candidatos) o Procesar (instancias siguientes).

### 7.2 Selección de candidatos (`ReglasNegocio.Titulares/clsCirculares.cs`)

1. **Filtros de cuenta, servicio y deuda** (`FiltrosCirculares`, `:97-294`): datos geográficos, servicio, estado y categoría, clase de deuda (financiación o no), tipos de factura, fecha de deuda por emisión o VTO1 con rango, montos y tipo de comprobante (`COD_TPFC`).
2. **`FiltrarDeudas`** (`:1864-1889`): comprobantes no anulados con saldo. Opcionalmente excluye créditos y créditos bloqueados (`COD_COM 83`) y aplica clase, tipo y rango. La opción `SinDeuda` invierte el criterio.
3. **`FiltrarExcepcionesMora`** (`:2312-2351`): toma las `EXC_MORA` con `VIGENCIA = 'SI'`, `RECLAMAR`, sin cancelación vigente (`FEC_VIG` nula o pasada) y con `FECHA` futura o nula.
   - Si `FEC_DEUDA` es nula, **excluye la cuenta entera**.
   - Si no, la excluye cuando tiene deuda con vencimiento anterior a `FEC_DEUDA`.
4. **Ya notificados** (`GetMorososExistentes`, `:2273-2310`): las cuentas con una notificación abierta se informan en `MOROSO_TEMPORAL` y no se vuelven a cargar. Lo controlan los parámetros **39** (ignorar notificación previa), **384** (ignorar candidato previo), **2467** (considerar solo la instancia inicial) y **3050** (excluir por el mismo tipo de notificación).
5. **`Guarda_Candidatos`** (`:2380-2485`): crea un `NOTIFICA` en la instancia **2202** con lote = máximo + 1. Por cada factura guarda una fila en `COMPNOTI` con el saldo, y en la notificación `DEUDA` (suma de saldos) y `DEUDA_AC` (deuda con intereses en modo NoDiferir). Solo inserta la notificación si `DEUDA > 0`.

### 7.3 Avance de instancias

`clsGestionMora.Get_Notificaciones(Filtros)` (`:526-604`):

- En modo Generar toma las notificaciones de la instancia de candidatos; en modo Procesar, las de las demás instancias.
- En ambos casos solo considera las notificaciones abiertas.
- Filtros: vencidas al (`VTO_CIR`), fecha, lote, cuenta, servicio, tipo de factura, barrio, localidad, empresa postal, deuda anterior a una fecha (máximo VTO4), deuda mayor a, cantidad mínima de comprobantes, clase, entregadas y con o sin promesa.
- `ValidarNotificaciones` (`:2374-2383`, parámetro **53**) avisa si la deuda cambió.

`Get_Notificaciones_Mora` (`:487-524`) es otra vista para el tratamiento de morosos. Toma notificaciones abiertas con `VTO_CIR` vencido y sin promesa vigente, y permite filtrar por pagos parciales y cantidad de pagados.

`Guardar_Notificaciones(DatosNotificacion)` (`:975-1247`) pasa las notificaciones a la instancia destino:

1. **Costo de envío** (opcional): comprobante de venta con el concepto **295**. El importe sale de la plantilla o del parámetro **296**, y el comprobante por defecto de la operación `Gestion_de_Mora`.
2. **Nueva notificación** con nuevo lote, `COD_INS` destino, `VTO_CIR`, plantilla (`COD_PLA`) y `RECIBIO` automático según configuración (**2206**; **2279** marca todas como entregadas).
3. **Comprobantes** (`COMPNOTI`): los impagos de la notificación anterior o, con `IncluirDeudaVencida`, toda la deuda vencida a la fecha. `DEUDA_AC` se recalcula con intereses.
4. **Nota en la cuenta** (`NOTA_SUM`): "Notificación de Mora".
5. **Notificación anterior**: queda en 2 (Procesado) si todavía hay deuda, o en 1 (Pagado) si no.
6. **Bloqueo** (opcional): pone `ID_BLO = causa` en las facturas y registra `HISBLOQ`. El comprobante de deuda puede ser por titular o por cuenta (`Guardar_Comprobante`, `:1249-1435`; parámetros **2304** y **2305**).

Acciones sobre las notificaciones:

- `Set_Entrega` (`:867-884`): con la entrega, `VTO_CIR = hoy + parámetro 2205 días`. El plazo corre desde la entrega. Solo **extiende** el vencimiento: si `VTO_CIR` ya era posterior, lo deja. Desmarcar la entrega no revierte el vencimiento.
- `Set_PromesaPago` (`:886-893`), `Set_Baja` (`:895-904`, `RESUELTA = 3` con causa) y `Set_Calificacion` (`:906-913`).
- La bitácora queda en `OBSERVA2` con el formato `fecha¦¦usuario¦¦proceso¦¦obs«»` (`:2364-2372`). El informe de promesas la parsea.
- `Cerrar_Notificaciones` (`:1502-1540`): nota "Notificación Cerrada", con bloqueo de caja opcional.
- `Anular_Grupo` (`:952-973`): deshace un lote y reabre el anterior. `Eliminar_Notificaciones` (`:1542-1569`).
- `Restablecer_Notificaciones` (`:2063-2081`): **borra todo** `NOTIFICA` y `COMPNOTI`.
- **Pago**: `clsRegistracionCobranza.RegistrarPagoNotificacion` (`:1141-1170`). Si se pagaron todos los comprobantes de una notificación abierta o "En Técnica", la marca `RESUELTA = 1` con fecha y usuario.

Los parámetros **2203** y **2204** identifican la instancia "sensible" (riesgo de corte) y la instancia de **corte**. En el catálogo `clsVariables` figuran como "Instancia inicial por defecto de la gestión de mora" y "Instancia final por defecto". El uso como sensible y corte es el que les da la exportación ERSeP. Se usan, por ejemplo, en la exportación para ERSeP (DNU 311/2020), que informa la condición "R/C" o "A" por cuenta (`clsCirculares.Exportar_Excel_ERSeP_DNUN_311_2020`, `:2523`, `:2607-2636`).

### 7.4 Tratamiento de morosos: corte

- **`Get_ServiciosTratamientoMorosos`** (`clsGestionMora.cs:1571-1723`): lista los servicios conectados (`CONDICION = 2`) de las cuentas notificadas. Da error si ya hay una OT pendiente (`COD_EST` 1 o 2) de la misma transacción.
- **`Guardar_OT`** (`:1853-1891`) despacha según la transacción:
  - **3 Desconexión** (`Guardar_OT_Desconexion`, `:1943-1998`):
    - Si el servicio requiere técnica: marca `BAJA_ADM` y crea una OT de desconexión con origen `GestionMora`, `MOROSO = true`, `GEST_MORA = true` y el vínculo a la notificación (`CNT_NOT`).
    - Si no requiere técnica: desconecta directamente el servicio, sus adherentes y beneficiarios.
    - Parámetros **2440** y **2531**: retiro de medidor en la desconexión.
  - **7 Cambio de estado** (`:2000-2061`): por ejemplo, suspensión o restricción, sin corte físico. El parámetro **2458** bloquea la caja.
  - **Cambio de categoría** (`:1917-1941`) o reclamo.
  - El parámetro **2694** permite generar OT de morosos sin observación.
- **`Baja_Servicio`** (`:1437-1500`): `CONDICION = 3`, `BAJA_ADM`, y OT de desconexión o desconexión directa.
- **`Operacion_NoFacturar`** (`:2083`): `SERSOC.NOFACTURAR = 1`.
- El parámetro **2917** cancela la desconexión pendiente si se cobra, y el **3033** quita la marca de moroso.

### 7.5 Reconexión

**Automática por cobranza** (`clsRegistracionCobranza.cs:270-277`). Se activa con los parámetros **3112** (reconectar servicios sin técnica), **3106** (generar OT de reconexión) y **2713** (generar y confirmar la OT).

1. `GetServiciosDesconectadosSinDeuda` (`:338-370`) busca servicios con `CONDICION = 4` (desconectado) cuya baja fue **por mora**:
   - con técnica: OT de desconexión `MOROSO` desde 15 días antes de `FEC_BAJA` y sin OT de reconexión pendiente;
   - sin técnica: `MOROSO` y baja en los últimos 15 días.
2. La deuda que impide reconectar depende de:
   - **3147**: 0 = toda la deuda; 1 = la vencida al VTO2; 2 = la vencida al VTO4;
   - **3113**: solo la deuda del mismo tipo de factura;
   - **3163**: en su lugar, que no queden notificaciones abiertas con deuda del servicio.
3. `ReconectarServicioSinTecnica` (`:303-336`) pone `MOROSO = false`, `CONDICION = 2` y `FEC_ALTA = hoy`.
4. `GenerarConfirmarOrdenTrabajo` (`:372-470`) crea una OT de reconexión ("Reconexión generada automáticamente por cobranza"). Genera el **cargo de reconexión** como comprobante de venta con el concepto de `CONEXION` (`TIPO_CON = 4`) del servicio, y con el 2713 confirma la OT.

**Manual y por OT**:

- `clsSocios.Get_CONEXION` / `GetQuery_CONEXION` (`ReglasNegocio.Titulares/clsSocios.cs:471-569`) eligen el cargo de reconexión de `CONEXION` filtrando por servicio, socio activo o no, **moroso o no**, prepago, zona, localidad, categoría, clase, estado y propiedad. Cada concepto puede cobrarse una sola vez (`UNA_VEZ`), antes (`TIPO_CON 6`) o después (`TIPO_CON 5`) de ejecutar la OT.
- **Descuento por días sin servicio** (`clsTecnica.Generar_DescuentoReconexion`, `ReglasNegocio.Tecnica/clsTecnica.cs:1599-1700`, parámetros **2483** y **2485**): al reconectar servicios de cargo proporcional, acredita los días desconectados del mes o, con el **2661**, debita los días restantes.
- Otros puntos: `clsPagosDesconectados.GenerarReconexion` (`:100-156`), `clsCobranzaCaja.Get_SersocReconexion` (`:1872`) y `clsTecnica.Validar_OrdenTrabajo_Reconexion` (`:2963`). Parámetros **2707**, **2787**, **3116**, **2301**, **388** y **2907** (este último pregunta antes de generar el descuento).

### 7.6 Consultas, canales y órdenes de trabajo (segunda pasada, `clsGestionMora`)

**Consultas de notificaciones**

- **`GetAll_Notificaciones(cuenta)`** (`clsGestionMora.cs:606-613`): historial completo de notificaciones de la cuenta, en cualquier estado. Aplica `ValidarNotificaciones` (parámetro **53**).
- **`Get_Notificaciones_Especial(instancia, lote, estado)`** (`:615-633`): notificaciones de cualquier estado, filtradas por instancia, lote y estado. Alimenta la pantalla "Operaciones Especiales" (Configuración → Tablas de Gestión de Mora), desde donde se eliminan los lotes que impiden anular una financiación (§8.10).
- **`Get_Notificaciones(cuenta)`** (`:635-638`): solo las notificaciones de la cuenta con calificación asignada (`CALIFICA ≠ 0`). Es el historial de comportamiento de pago.
- **Proyección común** (`Get_Notificaciones(query, …)`, privado, `:2247-2362`):
  - `DeudaActual` es la suma de los saldos actuales de los comprobantes notificados;
  - con "deuda actualizada", `DeudaActualizada` recalcula **toda** la deuda de la cuenta, con intereses en modo NoDiferir y sin créditos;
  - adjunta los servicios conectados o en alta (`CONDICION` 1 o 2) de la cuenta.
- **`ValidarNotificaciones`** (`:2374-2383`): con el parámetro 53 activo marca "abonada" si la deuda actual es 0, o "la composición cambió" si difiere de la notificada. Solo avisa, no cambia el estado.
- **`Get_DetalleComprobantes(notificación, actualizada)`** (`:663-698`):
  - sin "actualizada": recalcula cada comprobante de `COMPNOTI` con NoDiferir. Avisa "abonado" si el total a pagar es 0, o "saldo cambió" si el saldo difiere del notificado;
  - con "actualizada": trae toda la deuda actual de la cuenta y distingue los comprobantes **notificados** de los **nuevos** (deuda posterior a la notificación).

**Impresión agrupada y canales**

- **`Get_NotificacionesAgrupadasTitular(ids, orden)`** (`:705-865`): agrupa las notificaciones por **titular** para imprimir una sola carta.
  - El domicilio, la zona, el sector, el recorrido y la empresa postal del grupo salen de la **cuenta principal** (`SUMSOC.PRINCIPAL`) o, si no hay, de la de menor número.
  - La fecha y el lote del grupo son los mínimos, y la deuda es la suma.
  - Orden de impresión: 0 cuenta, 1 titular, 2 deuda, 3 lote, 4 fecha, 5 calle y número, 6 zona/sector/recorrido, 7 empresa postal y luego zona/sector/recorrido.
- **`GetDatosCuentaSinMail(cuentas, soloEmailCuenta)`** (`:915-932`): antes de notificar por correo, lista las cuentas sin dirección. Por defecto exige que falten **ambos**, `SUMSOC.EMAIL` y `SUMSOC_EXTRAS.CORREO_WEB` (el mail del portal); con `soloEmailCuenta` mira solo `EMAIL`.
- **`GetDatosPersonasSinNumero(cuentas)`** (`:934-951`): para SMS, lista las cuentas sin `PERSONAS.FAX` y sin `SUMSOC.MOVIL`. El campo `FAX` de la persona se usa como celular alternativo. **[VERIFICAR]** que las cooperativas cargan el celular ahí.

**Órdenes de trabajo del tratamiento de morosos**

- **`Get_InfoOT(servicios, conexión)`** (`:1725-1851`): arma los datos de la OT a partir del `SERSOC`: medidor, domicilio del servicio, catastro, GPS, categoría y certificado. Si ningún ítem trae servicio (tratamiento a nivel cuenta), usa el domicilio de la cuenta sin medidor ni categoría. En los dos casos vincula cada OT con su notificación (`ID_Notifica` → `TECNICA.CNT_NOT`).
- **Despacho en `Guardar_OT`** (`:1853-1891`), con un único bloqueo de la tabla `TECNICA` para numerar `COD_SOL`:
  - si se indica una categoría nueva → cambio de categoría;
  - transacción 3 → desconexión;
  - transacción 7 → cambio de estado;
  - transacción 6 (Incidente/Reclamo) o cualquier código que no pertenezca al enum `Transaccion` (transacciones propias de la cooperativa) → **reclamo**;
  - las transacciones 1, 2, 4, 5 y 8 (alta, traslado, cambio de medidor, reconexión, retiro de medidor) **no generan nada**, sin error.
- **`Guardar_OT_Reclamo`** (`:1894-1915`): OT con origen `GestionMora` y moroso. Comprobante por defecto de la operación `Orden_de_Trabajo` con su punto de venta y número. La descripción usa la **observación** técnica y no la descripción recibida (posible error del código). No marca `GEST_MORA`.
- **`Guardar_OT_CambioCategoria`** (`:1917-1941`): igual que el reclamo, con `N_COD_CAT` = categoría destino, `GEST_MORA` y `MOROSO` en verdadero. El cambio efectivo de categoría ocurre al cumplir la OT en Técnica.
- **`Guardar_OT_CambioEstado`** (`:2000-2061`): solo toma servicios en `CONDICION` 1 o 2.
  - Si el servicio requiere técnica: OT de transacción 7 con `COD_ESTASER` = estado destino. Origen **Titulares** (no `GestionMora`), con `GEST_MORA` y `MOROSO`, vinculada a la notificación de la cuenta.
  - Si no requiere técnica: cambia `SERSOC.COD_ESTADO` en el acto, sin OT ni historial en este método.

## 8. Financiación y planes de pago

### 8.1 Planes (`PLAN_CUO`, `DatosPlanCuotas.cs`)

Atributos del plan:

- tipo de pago: entrega y cuotas, o cuotas sin entrega;
- período, cantidad, mínimo y máximo de cuotas;
- tasas `INT_TEM`, `INT_TNA` y `TASA`;
- mínimos y máximos de deuda, entrega mínima (opcionalmente sobre el total con IVA);
- tasa de sellado y si la tasa incluye IVA (`TASACONIVA`);
- **quitas** del interés de financiación (`QUITA_INTR`) y del interés por mora (`QUITA_INTM`);
- mora particular de las cuotas (`MORA_PARTI` / `REC_DIAMF`);
- ajuste por índice (`COD_MON_AJUSTE`, `COD_TAB` → `INFLACIO`);
- no capitalizar el interés por mora (`NOCAP_INTMORA`).

Métodos de cálculo (`DatosPlan_MetodoCalculo`, `clsCaidaCuotas.GetCaida`, `ReglasNegocio.Cobranzas/clsCaidaCuotas.cs:76-239`):

| Método | Cuota |
|---|---|
| Sin interés | Capital / n |
| Interés directo | Capital / n + (capital financiable × tasa fija por cuota) |
| Francés | `C × i / (1 − (1+i)^−n)` |
| Alemán | Amortización constante + interés sobre el saldo |
| Americano | Solo interés; el capital se paga al final |
| Cuotas con saldo | Capital fijo, el saldo se arrastra |

Los vencimientos son el primer vencimiento + período × (k−1) meses. El IVA del interés usa el concepto **607** (financiación) o **2089** (venta); con `TASACONIVA` el IVA se separa del interés. También calcula IIBB.

### 8.2 Armado de cuotas (`clsFormasDePago`, `:337-613`)

- La cuota 0 es la entrega.
- `Distribuir_IntAnterior` y `Distribuir_IntMora` prorratean en las cuotas el interés anterior (de financiaciones previas) y el interés por mora a la fecha. Aplican las quitas (`Porc_Devolucion`) y el IVA.
- Con `NOCAP_INTMORA`, el interés por mora no genera interés de financiación.

### 8.3 Registro del convenio (`ReglasNegocio.Cobranzas/clsFinanciacion.cs`)

- **`RegistrarFinanciacion`** (`:55-113`): bloquea los comprobantes refinanciados, cierra las notificaciones (`RegistrarPagoNotificacion`), graba `REC_CON` + `IT_RECCO`, el capital social y la actualización de los comprobantes.
- **`GetRecCon`** (`:115-164`): capital (`CAP_A_REF`), interés anterior (`INT_A_REF`), interés por mora a la fecha (`INT_A_FEC`), deuda total, primera cuota, cantidad de cuotas, entrega, sellado y tasas. El texto del convenio sale del parámetro **507** (sin garante) o **214** (con garante).
- **`GetItRecco`** (`:166-194`): por factura, el capital, el interés entre vencimientos (`INT_23`) y el de mora (`INT_FT`).
- **`RegistrarComprobantes`** (`:197-245`), según el tipo de financiación:
  - **cuota en factura mensual**: comprobante de venta y cuotas en `DEUDAVTA`, que la facturación mensual incorpora;
  - **chequera**: una `FACTURA` por cuota (`CLASE = 1`, `NRO_REF`), más la cuota 0 de entrega o sellado.
- **Ítems de las cuotas** (`GetComprobante` `:247-319`, `GetFacturaCuota` `:329-424`): capital **310**, interés por mora **307**, interés anterior **311**, interés de financiación **607** y sellado **676**.
- `AjustarIVA_Cuotas` (`:534-656`) recalcula el IVA si cambia la situación de IVA.
- **Anulación** (`AnularFinanciacion` / `ValidarAnular`, `:870-1023`): no se puede anular si hay cuotas pagas o facturadas, o notificaciones asociadas.
- **Otros parámetros**: **671–675**, **735**, **1030**, **2208**, **2252** y **2634** (límites y opciones); **306** y **2299** (forma de registrar las cuotas); **2607** y **2624** (bonificación por adelanto de cuotas).
- **Informes** (`clsInformes_Financiacion.cs:322-370`): financiaciones del período, por plan, comprobantes y conceptos financiados, cuotas de un convenio (todas o a pagar), estado general de cuotas, cuotas facturadas y cuotas adeudadas a una fecha.

### 8.4 Datos del plan (`DatosPlanCuotas.CargarDatosPlan`, segunda pasada)

`DatosPlanCuotas.cs:64-110` lee `PLAN_CUO` por código:

| Campo | Significado | Regla |
|---|---|---|
| `TIP_PAG` | `DatosPlan_TipoPago`: 1 entrega y cuotas, 2 cuotas sin entrega | — |
| `PER_CUO` | Meses entre cuotas | Vencimiento de la cuota k = primer vencimiento + `PER_CUO × (k−1)` meses |
| `CAN_CUO` / `MIN_CUO` / `MAX_CUO` | Cuotas sugeridas, mínimas y máximas | `MAX_CUO = 0` se interpreta como 999 en `GetCantidadCuotas` |
| `TASA` | **Tasa por período entre cuotas**, la única que usan las fórmulas | — |
| `INT_TEM` / `INT_TNA` | Tasa efectiva mensual y nominal anual | Solo informativas: se copian a `REC_CON` y no intervienen en el cálculo |
| `COD_CAL` | `DatosPlan_MetodoCalculo` (1 a 6, ver §8.5) | — |
| `MIN_VTA` / `MAX_VTA` / `MOD_VTA` | Importe mínimo y máximo financiable; mínimo para modificar la venta | Se validan en pantallas no descompiladas |
| `MIN_ENT` | % de entrega mínima | Se trunca a 100 |
| `ENTMIN_IVATOTAL` | La entrega mínima se mide sobre el total con IVA | — |
| `TASASELLADO` | Sellado por mil | Se copia a `REC_CON.SELLXMIL` |
| `TASACONIVA` | La tasa ya incluye IVA | El IVA del interés se separa en lugar de sumarse |
| `QUITA_INTR` / `QUITA_INTM` | % de quita del interés anterior y del interés por mora | — |
| `MORA_PARTI` + `REC_DIAMF` | Recargo diario propio para cuotas impagas del plan | Se toma solo si `MORA_PARTI` está activo |
| `COD_MON_AJUSTE`, `COD_TAB`, `COD_PRO_INFLACION` | Moneda de ajuste, tabla de índices (`INFLACIO`) y concepto del ajuste | Ver §8.8 |
| `NOCAP_INTMORA` | No capitalizar el interés por mora | — |
| `NRO_CONRE` / `NRO_CN2` | Plantilla del convenio sin y con garante | Tienen prioridad sobre los parámetros 507 y 214 |

`TieneIndiceAl(fecha)` (`:112-127`) informa si `INFLACIO` tiene el índice de la tabla del plan para el mes y año de la fecha. Sirve para validar que se pueda ajustar.

**[VERIFICAR]** la unidad de `TASA` en las bases reales. El código la usa como fracción por período (`(1 + TASA)^n`). Si una cooperativa la carga como porcentaje, el francés daría cuotas absurdas, así que probablemente la pantalla la convierte.

### 8.5 Fórmulas de cada sistema de amortización (`clsCaidaCuotas`, segunda pasada)

Notación:

- `C`: capital a financiar (`_CapitalFinanciar`);
- `C'`: capital sin el interés por mora (`_CapitalSinIntMora = C − InteresMora`);
- `n`: cantidad de cuotas;
- `i`: `PLAN_CUO.TASA`.

Todos los importes se redondean a **5 decimales**, y ningún método ajusta la última cuota por redondeo, salvo "cuotas con saldo" (`clsCaidaCuotas.cs:140-239`).

| Método (`COD_CAL`) | Capital de la cuota k | Interés de la cuota k | Archivo:línea |
|---|---|---|---|
| 1 Sin interés | `C / n` | 0 | `:140-158` |
| 2 Interés directo | `C / n` | Fijo: `(C − ImporteSinInteres) × i`. Con `NOCAP_INTMORA` se usa `C'` en lugar de `C` | `:159-162` |
| 3 Francés | `cuota − interés_k` (+ `(C − C')/n` si no capitaliza) | `saldo_k × i`, con `cuota = base / ((1 − (1+i)^−n) / i)`, donde base es `C` o `C'` | `:164-187` |
| 4 Alemán | `base / n` (+ `(C − C')/n` si no capitaliza) | `saldo_k × i`; el saldo baja `base/n` por cuota | `:189-207` |
| 5 Americano | 0 en las cuotas 1..n−1; `C` completo en la cuota n | `base × i` constante | `:209-219` |
| 6 Cuotas con saldo | `ImporteMáximo − IVA embebido` en las cuotas 1..n−1; la cuota n absorbe el resto (`C − Σ anteriores`) | 0 | `:221-239` |

Detalles:

- **No capitalizar el interés por mora** (`NOCAP_INTMORA`, parámetro `noCapIntMora`): el interés de financiación se calcula solo sobre `C'`. La mora se reparte **en partes iguales** como capital de cada cuota en francés y alemán. En el americano, la cuota final devuelve `C` completo.
- **`ImporteSinInteres`**: en el interés directo se resta de la base. `clsFormasDePago.GetCuotas` lo pasa como `−ImporteTotalQuita` (`clsFormasDePago.cs:395`), así que en el directo el interés se calcula sobre el capital **antes** de la quita, mientras que los demás métodos usan el capital ya neto de quita. **[VERIFICAR]** el signo con que la pantalla carga `ImporteTotalQuita` y si esta asimetría es intencional.
- **Cuotas con saldo**: el usuario fija el importe máximo de cuota con IVA. `CalcularImporteIva(true, C, IVA, máx)` (`:241-251`) le quita la parte proporcional de IVA (`máx × IVA/(C+IVA)`) y el resultado es el capital fijo de cada cuota. Si `n × capital > C`, la última cuota queda negativa: el código no lo controla y depende de que la pantalla calcule `n` bien.
- **IVA e IIBB del interés** (`GetCaida`, `:76-138`): se calculan por cuota, salvo que ya venga calculado.
  - El concepto es el **607** (financiación) o el **2089** (interés de comprobante de venta).
  - Con `TASACONIVA`, el interés calculado se toma como importe con IVA y se separa (`Calcular_TasasIVA_Total`); si no, el IVA se suma.
  - La percepción de IVA se incluye solo si `IncluirPercepcionIVA` (factura en cuotas con intereses).
  - Si la cuenta es conocida (`CodSum ≠ 0`), calcula IIBB (`Calcular_IBR`, tipo Facturación) y lo guarda en `OtrosImpuestos_Interes`.
- `ValorCuota = capital + interés + IVA del interés + otros impuestos`. El IVA del **capital** no está en `clsCaidaCuotas`: lo agrega `clsFormasDePago` (§8.6).

### 8.6 Armado de cuotas: entrega, quitas, IVA y sellado (`clsFormasDePago.GetCuotas`, segunda pasada)

`clsFormasDePago.cs:316-446`:

1. **Contado o próxima facturación**: una sola cuota (`DEUDAVTA`) con vencimiento `FechaPago`, capital = neto, IVA = suma de IVA1 + IVA2 de los ítems y detalle de IVA por alícuota (`IVAVTA`).
2. **Plan de pago o factura en cuotas**:
   - **Cuota 0 (entrega)**, solo si `Entrega + (sellado si IncluirSelladoCuota0) ≠ 0`. Vence **hoy**.
     - En plan de pago, el capital es la entrega y su IVA es proporcional: `entrega × (Total − Percepción)/Neto − entrega`. El `IVAVTA` se prorratea con las alícuotas del comprobante original.
     - En factura en cuotas, la entrega se carga con IVA incluido y como alícuota 4.
   - **Capital a financiar**: `C = Neto − Entrega − ImporteTotalQuita`. En factura en cuotas con intereses (`FACTURA_CT`) se parte del total con IVA: `Total − Entrega − Quita − quita de mora proporcional a la entrega − IVA de la entrega`.
   - **Cuotas 1..n**: salen de `clsCaidaCuotas.GetCaida` (§8.5).
     - En plan de pago: `IVA_TOT = IVA del interés + IVA proporcional del capital`, con el detalle `IVAVTA` prorrateado sobre `capital − quita por cuota`.
     - En factura en cuotas sin intereses: el capital se guarda con IVA incluido.
   - **Quita de mora sobre la entrega**: si hay entrega y quita de mora (`QUITA_INTM`), la parte de mora contenida en la entrega se calcula con la proporción `(InteresMora + Quita)/Neto` y se le aplica el % de quita.
   - **Quita del 100 %** con entrega 0: la quita total se reparte en partes iguales (`|Quita| / n`) al calcular el IVA, y la cuota 0 no recibe distribución de intereses.
3. **`DistribuirInteresEnCuotas`** (`:448-498`): el capital de cada cuota (`CAP_FIN`) se descompone proporcionalmente en capital puro, interés anterior y mora.
   - **Interés anterior** (`Distribuir_IntAnterior`, `:500-531`): proporción `InteresAnterior / (Neto − Quita)` sobre el `CAP_FIN` de la cuota. A esa porción se le aplica la quita `QUITA_INTR` (`Quita_IntFinanciado`, con su IVA), se le separa el IVA con el concepto **311**, y el neto queda en `IAN_FIN`.
   - **Interés por mora** (`Distribuir_IntMora`, `:580-613`): la reclasificación usa la proporción `InteresMora / (Neto − Quita)`, que incluye la mora arrastrada de financiaciones previas. La **quita** `QUITA_INTM` se calcula en cambio sobre la proporción de `InteresMoraActual`, que es solo el recargo calculado hoy. Así, **la quita de mora no alcanza la mora que ya venía refinanciada**. El IVA se separa con el concepto **307** y el neto queda en `IAF_FIN`.
   - El IVA se separa con `Calcular_TasasIVA_Total`, porque el interés ya estaba dentro del capital con IVA. En modo financiación se descuenta del capital el IVA sin percepción; en ventas, el IVA con percepción.
   - `DistribuirIVA` (`:533-578`) descuenta del detalle `IVAVTA` del capital lo reclasificado como interés (con tolerancias de 1 a 3 centavos) y agrega filas de IVA marcadas con `TIPO_INT` (interés anterior o mora).
   - **Concepto 308 exento**: si el concepto de "cuota en factura mensual" (parámetro **308**) tiene alícuota 4 y es un plan de pago de financiación, el IVA del detalle se pasa a neto exento, y la cuota se factura como exenta con el IVA dentro del neto. **[VERIFICAR]** qué alícuota representa `COD_ALI = 4` en cada base.
4. **Saldo por cuota**: cada cuota guarda el saldo restante del plan (`Saldo`), redondeado a 2 decimales.

**Sellado**:

- en chequera, la cuota 0 (o una factura propia si no hay entrega) lleva el ítem del concepto **676** (`clsFinanciacion.GetFacturaCuota`, `:404-407`), y el id se guarda en `REC_CON.ID_FAC_SELL`;
- en cuota en factura mensual, la entrega y el sellado se emiten como **factura inmediata** al guardar el comprobante de venta (`clsComprobanteVenta.Guardar`, `ReglasNegocio.Facturacion/clsComprobanteVenta.cs:569-600`), y el id vuelve como `Id_Factura_Cuota0`;
- `AgregarSellado` (`clsFinanciacion.cs:321-327`) agrega el ítem solo si el parámetro 676 valida sin error.

El importe del sellado lo calcula la pantalla (tasa por mil del plan sobre el total), no esta capa. **[VERIFICAR]** la base del sellado en la pantalla de financiación.

**Cantidad de cuotas para un importe de cuota objetivo** (`GetCantidadCuotas`, `:257-290`):

1. Punto de partida: `n₀ = piso((Neto − Entrega) / importe)`.
   - Si `n₀` supera el máximo del plan: aviso "El importe es muy bajo…" y se usa el máximo.
   - Si está debajo del mínimo: se usa el mínimo.
2. Desde `n₀` hasta el máximo, busca el primer `n` en el que la cuota más alta, más el IVA de su capital, no supere el importe pedido.
3. Si ninguno cumple: aviso "No se pudo determinar la cantidad de Cuotas" y se usa el máximo.

**Otros métodos de `clsFormasDePago`**:

- `CargarPago` (`:99-137`): reconstruye la forma de pago de un comprobante de venta desde `DEUDAVTA`. La entrega es la cuota 0 y la fecha de pago es el vencimiento de la cuota 1.
- `RegistrarPago` (lista original, `:159-182`): regenera cuotas en las que capital, interés, IVA y otros impuestos quedan en `CAP_CUO`. Si se agregan otros impuestos, los prorratea según el capital de cada cuota (sin la cuota 0).
- `RegistrarPagoRapido` (`:196-206`): igual que `RegistrarPago`, con numeración `COD_CVC` precalculada para procesos masivos.
- `CalcularImporteIva` (`:139-152`): IVA proporcional del comprobante sobre un importe. Nunca devuelve un valor negativo.

### 8.7 Refinanciación (segunda pasada)

Un convenio puede incluir cuotas impagas de otro convenio (`FACTURAS.CLASE = 1`). En ese caso `GetRecCon` y `GetComprobante` (`clsFinanciacion.cs:115-164`, `:247-319`) **no tratan la cuota como capital puro**, sino que la descomponen:

- **Capital**: el capital de la cuota (subtipo 24), que va al concepto **310**.
- **Interés anterior**: el interés de financiación actual (21) más el anterior (22) de la cuota, que van al concepto **311**. Se arrastran como "interés anterior" y vuelven a generar interés de financiación en el plan nuevo, salvo la quita `QUITA_INTR`.
- **Mora anterior**: el interés por mora contenido en la cuota (23) se suma a la mora nueva (recargo de hoy) en el concepto **307**. El ítem 307 se emite solo si el neto de mora, quita incluida, supera 0,01.
- Las notas de crédito incluidas restan (signo −1).
- En `IT_RECCO`, cada comprobante guarda:
  - capital (`CAP_A_REF`: el saldo, o el capital si es cuota);
  - recargo (`INT_A_REF`) y total (`TOT_COM`);
  - para cuotas: capital, interés actual e interés anterior;
  - el **interés entre vencimientos** (`INT_23`) y el **de mora** (`INT_FT`) por separado, solo si se cobraron intereses;
  - el saldo y la `FECHASALDO` original, que se usan para revertir al anular.
- El comprobante de venta usa la operación `Plan_Financiacion` y no calcula percepción. Si se financia a otra cuenta (`CodSumDestino`, parámetro **2634**), toma la situación de IVA e IIBB y el titular de la cuenta destino.

### 8.8 Ajustes de cuota al facturarla: índice, cotización y adelanto (segunda pasada)

Cuando la facturación mensual incorpora una cuota de `DEUDAVTA`, `ItemsComprobanteCollection.AddRange` (`ReglasNegocio.Facturacion/ItemsComprobanteCollection.cs:260-399`) agrega ajustes:

- **Ajuste por índice** (`:370-399`). Se aplica si el plan tiene tabla de índices (`COD_TAB`) y concepto de ajuste (`COD_PRO_INFLACION`).
  - Factor = índice de **hace 2 meses** / índice del **mes anterior a la fecha del comprobante de venta**.
  - Si el factor es distinto de 1, agrega un ítem del concepto de ajuste por `(capital + interés + IVA de la cuota) × (factor − 1)`, que puede ser negativo si el índice baja.
  - Si falta alguno de los dos índices, **no ajusta y no avisa**.
  - El rezago de 2 meses está fijo en el código. **[VERIFICAR]** con qué índice se usa (IPC, CAC, etc.).
- **Diferencia de cotización** (`:350-369`, parámetros **2289** y **2512**). Se aplica si la venta se hizo en otra moneda y tiene concepto de cotización.
  - Agrega `(capital + interés) × (cotización de venta actual / cotización original − 1)`, con el grupo de facturación del parámetro 2512.
- **Bonificación por adelanto de cuotas** (`:314-341`, parámetros **2607** y **2624**). Si la cuota se factura **por adelantado** (`clsFacturacionCuotas.AgregarItemsCuotas`, `ReglasNegocio.Facturacion/clsFacturacionCuotas.cs:376-391`):
  - se agrega un ítem negativo igual al **interés de financiación completo** de la cuota, con el mismo IVA;
  - el concepto es el 2607 si la cuota viene de una financiación (tiene capital, mora o interés anterior), o el 2624 si es una venta en cuotas;
  - si el parámetro correspondiente es 0, no se bonifica.

### 8.9 Validaciones y parámetros de financiación (segunda pasada)

- **`RegistrarFinanciacion`** (`clsFinanciacion.cs:55-113`):
  - rechaza la operación si el submódulo de **Facturación está cerrado** para hoy;
  - rechaza la operación si el capital total es negativo: "No es posible realizar financiaciones con capital menor a 0". En ese caso devuelve `false` **sin rollback explícito** de la transacción abierta;
  - todo lo demás (lock de comprobantes, cierre de notificaciones, `REC_CON`, cuotas, capital social, saldado de facturas con `NRO_REF`) ocurre en una sola transacción.
- **Límites por convenio**:
  - `GetConveniosEnPeriodo` (`clsFormasDePago.cs:292-303`): cuenta los convenios no anulados de la cuenta, dentro del período de control **674–675** si ambas fechas son válidas, o en total si no. La pantalla lo compara contra **671** (máximo de convenios por período).
  - `GetConveniosActivosPorTipo` (`:305-309`): cuotas de chequera vigentes del tipo de cuota, más cuotas mensuales aún no facturadas. Respalda el **735** (no más de una financiación activa del mismo tipo).
  - `GetConveniosInactivosImpagosPorTipo` (`:311-314`): cuotas mensuales ya facturadas, vencidas e impagas del tipo.
  
  Estos tres métodos solo se llaman desde pantallas no descompiladas. **[VERIFICAR]** los mensajes y si bloquean o solo advierten.
- **Parámetros que solo leen las pantallas** (no aparecen en `ReglasNegocio`):
  - **672** y **2208**: mínimo y máximo de comprobantes a financiar;
  - **673**: importe mínimo de cada cuota;
  - **2252**: imprimir el convenio automáticamente;
  - **306**: forma de registrar las cuotas (0 chequera, 1 factura mensual);
  - **2299**: permitir cambiar esa forma.
- **1030** ("Permite cambiar interés al operador"): en la caja, en modo financiación, hace visible la operación "Cambiar recargo diario" (`clsCobranzaCaja.cs:574-577`).
- **2471**: tipo de cuota por defecto (`GetCuota_X_Defecto`, `clsFinanciacion.cs:659-668`).
- **Vencimientos de las cuotas en chequera** (`GetFacturaCuota`, `:329-424`):
  - cada cuota es una `FACTURA` con operación `Cuota_Financiacion` y `VTO1 = VTO2 = VTO3 = VTO4 = FEC_VTO` de la cuota. Por eso **no tiene recargo entre vencimientos**: la mora corre desde el único vencimiento;
  - la cuota 0 (entrega o sellado) usa el comprobante que corresponde a la situación de IVA y al tipo de cuota, vence hoy y no lleva `Financiacion = true`;
  - no mueve stock, y registra capital social (`registrarCapital: true`).

### 8.10 Anulación de convenios (detalle, segunda pasada)

`AnularFinanciacion` / `ValidarAnular` (`clsFinanciacion.cs:870-1023`):

- Requiere el permiso `FinanciacionANULAR` y una confirmación del usuario ("no puede revertirse").
- Validaciones:
  - el convenio debe existir;
  - el submódulo **Financiaciones** no debe estar cerrado a la fecha del convenio;
  - en **chequera**, ninguna cuota puede tener `SALDO ≠ TOTAL1` (pagos parciales o totales): "Debe anular primero los pagos". Si hay una factura de entrega (`CLASE = 0`, `NRO_CUO = 0`) no anulada, pide confirmación;
  - en **factura mensual**, ninguna cuota puede estar ya facturada (`DEUDAVTA.ID_FAC`): "Anule primero las facturas";
  - si la factura de sellado tiene pagos: "Debe anular el Recibo de pago de Sellado";
  - si alguna cuota figura en `COMPNOTI`, se rechaza la anulación y el mensaje enumera los lotes que hay que eliminar en "Operaciones Especiales".
- Efectos:
  1. Cada comprobante refinanciado recupera `PAGA = ''`, `SALDO` y `FECHASALDO` originales, y `PAGADO` se reduce con el signo del comprobante.
  2. En chequera, las cuotas `CLASE = 1` se copian a `ANUFAC`, `ANUITEMSFAC` y `ANUITEMSFAC_EXTRAS`, y se **borran** de `FACTURAS`. La factura de entrega (`CLASE = 0`) no se borra en este paso. **[VERIFICAR]** si queda viva cuando el usuario confirma.
  3. En factura mensual, se anula y elimina el comprobante de venta.
  4. La factura de sellado se anula con `clsAnulacionFacturas` (sin eliminarla).
  5. Se **borran físicamente** `IT_RECCO`, `CAPITAL` y `REC_CON`. Por eso el filtro `REC_CON.ESTADO ≠ 'A'` que usan algunos informes parece heredado de una versión anterior.

### 8.11 Recalcular cuotas por cambio de situación fiscal (segunda pasada)

- **`GetCuotas_SitIvaDistinto(desde, hasta, titular)`** (`clsFinanciacion.cs:426-532`) busca cuotas de chequera (`CLASE = 1`, con `NRO_REF`) emitidas en el rango y **sin ningún pago** que cumplan alguna de estas condiciones:
  - la situación de IVA de la cuota difiere de la actual de la cuenta, y una de las dos es la **7** (**[VERIFICAR]** qué situación es la 7 en `SITIVA`);
  - con el parámetro **757** (IIBB RN 01/2017 Córdoba) y algún concepto de interés (307, 311, 607) con alícuota de IIBB: la alícuota de percepción de IIBB de la cuota difiere de la del padrón `IIBB_LUA` (régimen `P`) de la cuenta.
  
  Devuelve una fila por cuenta con el convenio y la cantidad de cuotas.
- **`AjustarIVA_Cuotas(lista, modo)`** (`:534-656`): por cada cuota impaga de esos convenios toma la situación de IVA actual, borra los ítems de impuestos (`TIPO = 4`) y los regenera.
  - **Recálculo de cuota**: mantiene los netos y recalcula IVA y percepción con la alícuota nueva. `TOTAL1..TOTAL4` y `SALDO` suben o bajan por la diferencia.
  - **Recálculo de interés**: mantiene el **total** de la cuota. Reajusta el neto de cada ítem con el factor `(100 + IVA ant. + perc. ant. + IIBB ant.) / (100 + IVA nuevo + perc. nueva + IIBB nuevo)`, aplicando el IIBB solo a conceptos con alícuota de IIBB. No modifica los totales.

### 8.12 Consultas e informes de financiación (segunda pasada)

- **`GetDatosCuotas(nroRef, ref facturas, idFac)`** (`clsFinanciacion.cs:697-752`):
  - en chequera, lista las cuotas (sin la 0) con el desglose por subtipo de ítem: 24 capital, 22 interés anterior, 23 mora, 21 financiación, y la suma de su IVA;
  - en factura mensual, lista las cuotas de `DEUDAVTA` con total = capital + interés + IVA.
- **`GetReporteCuotas`** (`:806-846`): si el convenio es de factura mensual, devuelve la **liquidación de crédito** del comprobante de venta. Si es chequera, devuelve el talonario de cuotas ("Financiacion_Cuotas", o "_CUOTAS" para una sola cuota). Acepta un id de factura y deduce el convenio.
- **`GetDatosDeudaCuotas`** (`:754-781`): para "factura en cuotas" (no convenio), identifica las cuotas hermanas por la misma cuenta, fecha de emisión, `TOTAL1` y `DE_CUO`. Es heurístico: dos facturas en cuotas iguales del mismo día se mezclarían.
- **`ModificarGarante`** (`:670-684`): cambia `REC_CON.COD_GAR` sin validar nada. No vuelve a elegir la plantilla del convenio (507 o 214), que se fijó al crearlo.
- **`clsInformes_Financiacion.GetDatosInforme`** (`clsInformes_Financiacion.cs:31-312`):
  - `GetFinanciaciones` (`:33-53`): convenios por fecha, titular, cuenta y plan. "No incluir cancelados" excluye los convenios mensuales sin cuotas pendientes de facturar. En chequera solo excluye los que no tienen ninguna factura, de modo que **un convenio de chequera totalmente pago sigue apareciendo**. **[VERIFICAR]** si es el comportamiento esperado.
  - `GetCuotasFinanciacionFacturadas` (`:97-118`): cuotas mensuales facturadas en el rango, con capital, mora, interés de financiación e interés anterior. La columna rotulada `InteresPorM` contiene en realidad `IAN_FIN` (interés anterior).
  - `GetCuotasFinanciacionAdeudadaAFecha` (`:120-179`): deuda de cuotas a una fecha.
    - En chequera: cuotas emitidas hasta la fecha y no saldadas a esa fecha. Adeudado = `TOTAL1 −` (pagos `IT_PAGSO` con interés de financiación más importe imputado hasta esa fecha). No filtra cuotas anuladas.
    - En factura mensual: cuotas todavía no facturadas a esa fecha, por su importe completo.
    - Informa aparte las cuotas anuladas (ítems del concepto 308 cuya cuota ya no existe) y los créditos sobre capital (subtipo 24) emitidos después de la factura de la cuota.
  - `GetComprobantes_Financiados` (`:180-211`): detalle por comprobante refinanciado, con signo según débito o crédito y filtro por tipo de cuota.
  - `GetDatosCuotasPagar` (`:213-234`): cuotas de chequera por convenio, cuenta y rango de número de cuota. La impresión exige convenio o cuenta, y valida que existan ("número de contrato / cuenta no válido", `:700-729`).
  - `GetDatosCuotas` (`:236-293`): incluye la cuota 0 y marca pagada o no, con la fecha de pago.
  - `GetEstadoCuotas` (`:295-311`): por convenio, **cantidad e importe de cuotas vencidas impagas** (VTO1 < hoy, saldo ≠ 0, no anuladas).
- **`clsMovimientoConceptos.GetFinanciacion`** (`ReglasNegocio.Facturacion/clsMovimientoConceptos.cs:2399` en adelante): base del informe "Conceptos financiados". Toma los `IT_RECCO` de convenios no anulados y los filtra por:
  - cuenta, titular y estado del titular;
  - domicilio de la cuenta o del servicio (zona, localidad, referencia, departamento y sector);
  - fecha del convenio y punto de venta;
  - tipo de facturación (diaria: VTO1 = fecha);
  - tipo de cuota.
- **`clsCobranzaCaja.Get_Financiacion(nroRef)`** (`ReglasNegocio.Cobranzas/clsCobranzaCaja.cs:1213-1267`): el mismo informe de comprobantes financiados, para un solo convenio. La caja lo imprime al registrar la financiación.

### 8.13 Caída o caducidad del plan

En el código descompilado **no hay ningún proceso de caducidad**: ninguna regla da por vencido el plan, reactiva la deuda original ni recalcula el saldo cuando se acumulan cuotas impagas. Las cuotas impagas siguen estos caminos:

- generan mora por sí mismas como cualquier factura, con la tasa general o con `MORA_PARTI`/`REC_DIAMF` del plan;
- pueden entrar en la gestión de mora (filtro de clase "financiación" en Circulares);
- se pueden **refinanciar** en un convenio nuevo (§8.7);
- aparecen en el informe "Estado de cuotas" (cantidad de cuotas atrasadas).

**[VERIFICAR]** con las cooperativas si aplican una caducidad manual (por ejemplo, anular el convenio y refinanciar) y con cuántas cuotas impagas.

## 9. Prescripción de deuda

- **Informe "Deuda a Prescribir"** (`clsInformes_Mora.cs:100`, cálculo en `:178`): el parámetro **104** fija los meses. Lista las facturas con saldo y VTO1 anterior a hoy menos esos meses, agrupadas por cuenta.
- **`clsPrescripcionDeuda.Registrar_PrescripcionDeuda`** (`ReglasNegocio.Cobranzas/clsPrescripcionDeuda.cs:227`): por cada comprobante marcado emite un comprobante de signo contrario (crédito para débitos y viceversa) con el concepto elegido, y lo imputa con recibo. La fecha de corte puede ser la emisión o el VTO1. El parámetro **2158** es la cuenta contable de prescripción.

## 10. Informes de mora (`ReglasNegocio.Cobranzas/clsInformes_Mora.cs`)

Grupo "1- Gestión de Mora":

- Deuda a Prescribir.
- Notificaciones Pendientes (excluye candidatos).
- Titulares Notificados: deuda notificada, actualizada o detalle.
- Excepciones por Mora: `EXC_MORA` con motivo, vigencia y usuarios.
- Servicios del lote notificado.
- Promesas de Pago (parsea `OBSERVA2`).

También:

- `Get_InformeDeuda` (`:1097-1156`) y `Get_TotalesServicio` (`:1158-1181`).
- **"Informe de Servicios a Cortar"** (`Get_CortarServicio`, `:1183-1229`): lote, cuenta, medidor, `MesesDeuda = (hoy − VTO1 más antiguo) / 30` y deuda.
- En `clsGestionMora`:
  - `Get_InformeExepcionMora` (`:2102-2169`), calculado con DiferirTodo;
  - resumen de notificaciones (`:2171-2203`);
  - **`ExportarDopler`** (`:2205-2245`): archivo para Doppler (mail marketing) con cuenta, cantidad de comprobantes, deuda, deuda actualizada y mail.

## 11. Tabla de parámetros

| N.º | Tema | Uso |
|---|---|---|
| 53 | Mora | Validar notificaciones (deuda cambiada) |
| 74 | Emisión | Tipo de interés entre vencimientos (`Facturacion_TipoInteresFactura`) |
| 104 | Prescripción | Meses para prescribir |
| 273 | Facturación del interés | Factura (sí) o nota de débito (no) |
| 295 / 296 | Mora | Concepto e importe del costo de notificación |
| 299 / 1002 | Jubilados | Sin recargo del VTO2 / sin recargo |
| 302 / 2453 | Caja | Aviso de titular notificado |
| 307 / 310 / 311 / 607 / 676 | Financiación | Conceptos de mora, capital, interés anterior, interés de financiación y sellado |
| 321 | Caja | No permitir pago parcial de deuda notificada |
| 324 / 462 | Caja | Cobrar primero las facturas antiguas (por VTO1 o VTO4) |
| 372 | Mora | Gastos administrativos |
| 39 / 384 / 2467 / 3050 | Candidatos | Control de notificaciones y candidatos previos |
| 486 / 487 | Caja | Tasa diaria y concepto por valores a fecha |
| 578 | Interés | % entre vencimientos (emisión y CAU) |
| 600 | Interés | % diario fijo de mora |
| 606 / 2080 | Interés | Concepto de interés por mora / entre vencimientos |
| 608 | Interés | Redondear el recargo a 1 decimal |
| 609 | Interés | Mínimo (por debajo, el recargo es 0) |
| 621 | Interés | Contar el interés desde el último vencimiento |
| 625 | Interés | Interés sobre créditos |
| 713 | Prepaga | Retener intereses |
| 1008 | Proceso masivo | Vendedor de los comprobantes de interés |
| 1011 | Caja | Modo de diferir |
| 1056 | Caja | Agrupar facturas de interés por tipo |
| 2202 / 2203 / 2204 | Mora | Instancias de candidatos, sensible y corte |
| 2205 | Mora | Días de vencimiento de la notificación desde la entrega |
| 2206 / 2279 | Mora | Recepción automática / todas entregadas |
| 2292 | Proceso masivo | Variante (1 estándar, 2 CAU, 3 cheques, 4 AL) |
| 2300 | Interés | Impuestos excluidos de la base |
| 2304 / 2305 | Mora | Comprobante de deuda por notificación |
| 2356 / 2363 | Interés | Discriminar el entre vencimientos / proporcional al saldo |
| 2379 | Mora | Estado "En Técnica" |
| 2385 | Caja | Ocultar comprobantes con VTO2 viejo |
| 2440 / 2531 | Corte | Retiro de medidor |
| 2458 | Corte | Bloquear caja en OT de cambio de estado |
| 2483 / 2485 / 2661 / 2907 | Reconexión | Descuento por días desconectado |
| 2770 / 2771 / 2984 | Bloqueo | Interés al desbloquear |
| 2826 | Interés | IIBB sobre el entre vencimientos |
| 2828 | Diferido | Relacionar la cuota con el servicio |
| 2917 / 3033 | Corte | Cancelar desconexión al cobrar / quitar marca de moroso |
| 3106 / 3112 / 2713 | Reconexión | Automática: OT / sin técnica / confirmar OT |
| 3113 / 3147 / 3163 | Reconexión | Criterio de deuda para reconectar |
| 3135 | Interés | Respetar `SIN_RECARGO` de la cuenta |
| 3138 | Interés | Punitorios sobre energía |
| 3162 | Caja | Autorización para no cobrar recargo |
| 3167 | Interés | Base = conceptos de `CONCEPTOS_INT` |
| 214 / 507 | Financiación | Plantilla del convenio con y sin garante (el plan puede sobrescribirla con `NRO_CN2` / `NRO_CONRE`) |
| 306 / 2299 | Financiación | Forma de registrar las cuotas (0 chequera, 1 factura mensual) / permitir cambiarla (solo pantallas) |
| 308 | Financiación | Concepto de cuota en factura mensual; con alícuota 4 la cuota se factura exenta (§8.6) |
| 671 / 674 / 675 | Financiación | Máximo de convenios por período y fechas del período de control |
| 672 / 2208 / 673 | Financiación | Mínimo y máximo de comprobantes a financiar; importe mínimo de cuota (solo pantallas) |
| 735 | Financiación | No más de una financiación activa del mismo tipo por cuenta |
| 757 | Financiación / IIBB | Percepción de IIBB RN 01/2017 (Córdoba): habilita el ajuste de cuotas por cambio de alícuota |
| 1030 | Caja | Permitir al operador cambiar el recargo diario en modo financiación |
| 2089 | Ventas | Concepto de interés de comprobante de venta (cuotas de venta) |
| 2252 | Financiación | Imprimir el convenio al generarlo (solo pantallas) |
| 2289 / 2512 | Ventas | Concepto y grupo de facturación para la diferencia de cotización de cuotas |
| 2471 | Financiación | Tipo de cuota por defecto |
| 2607 / 2624 | Financiación / Ventas | Concepto de bonificación del interés por adelanto de cuotas (0 = no bonifica) |
| 2634 | Financiación | Permitir imputar la financiación a otra cuenta |

## 12. Implicancias para GoodApps

1. **Separar tres motores**: recargo entre vencimientos al emitir, interés por mora al cobrar o consultar, y proceso masivo de interés a facturar. En GoodApps conviene un **único servicio de cálculo de interés** que reciba la factura, la fecha de corte y la política, y que lo usen caja, portal, entes y el proceso masivo. Procoop duplica la lógica (`clsCobranzas` frente a `clsFacturarIntereses`), con criterios que no siempre coinciden.
2. **Política de tasas configurable con prioridad explícita**: tasa diaria fija, tabla de tasas por vigencia (equivalente a `MORATAS`, con filtros de tipo de factura y categoría) o índice (equivalente a `INDICESMORA`). Mantener el interés simple diario como regla por defecto y evitar el interés sobre interés (equivalente a `NoCalcularInteresAnterior`).
3. **Modelar el diferimiento como opción de primer nivel**: cobrar en el acto (factura o nota de débito), diferir a la próxima factura (cuota pendiente) o diferir solo la mora. Es lo que más diferencia a las cooperativas y debe poder sobrescribirse por ente recaudador.
4. **Base imponible y fiscalidad del interés**: concepto de interés por tipo de factura, alícuota de IVA según la situación del titular, percepciones, IIBB opcional, impuestos excluidos de la base y tratamiento "IVA incluido" del entre vencimientos. Debe quedar trazable en el comprobante: un ítem por factura de origen y la relación entre comprobantes.
5. **Gestión de mora como máquina de estados**: lotes por instancia, con candidato → avisos → instancia sensible → corte. Cada transición registra plantilla, canal, costo de envío, vencimiento desde la entrega, promesas, calificación y bitácora estructurada (no un string como `OBSERVA2`). El cierre automático por pago debe ser transaccional con la cobranza.
6. **Excepciones de mora con vigencia y alcance** (cuenta entera o deuda anterior a una fecha), separando "no reclamar" de "no retener o cobrar interés".
7. **Corte y reconexión integrados con Técnica**: OT con origen "gestión de mora", desconexión directa para servicios sin técnica, cargo de reconexión por reglas (servicio, moroso, categoría, zona) y reconexión automática al saldar la deuda, con un criterio de deuda configurable. Contemplar también restricciones regulatorias de corte (ERSeP, DNU 311/2020, electrodependientes).
8. **Planes de pago**: los métodos francés, alemán, americano, directo y sin interés, más quitas de mora e interés, sellado, entrega, ajuste por índice, modalidad cuota en factura o chequera, y convenio imprimible. La refinanciación debe cerrar las notificaciones y bloquear los comprobantes de origen.
9. **No replicar rarezas**: el 3 % fijo en el código de CAU, el mínimo que anula el recargo en lugar de aplicar un piso, el punitorio CAU sin días, `Fijo_Pesos` sin IVA, y el "restablecer" que borra todas las notificaciones. Hay que definir con cada cooperativa el comportamiento deseado.
10. **Migración**: traer `MORATAS`, `MORATAS_CATSER`, `INDICESMORA`, `TRAMASREC`, `CONCEPTOS_INT`, `DESCUENTO_CAJA`, `EXC_MORA`, `INSTANCI`, las notificaciones abiertas con sus comprobantes, los convenios vigentes (`REC_CON`, `IT_RECCO`, cuotas) y las cuotas de intereses diferidos pendientes (`DEUDAVTA` con `TPCUOTA = 1`), para no perder intereses devengados ni el estado de la gestión.

## 13. Dudas abiertas

1. Las pantallas de gestión de mora, MORATAS, instancias y excepciones están en ensamblados de formularios (Cobranzas, Titulares) que no se descompilaron. No se verificó cómo se eligen la instancia destino, la plantilla ni el costo, ni qué parámetros leen solo esas pantallas (3138, 2770, 2917, 3033, 2487, etc.).
2. **`Get_Recargo`, impuestos excluidos**: la línea que descuenta los impuestos excluidos cuando hubo pagos parciales divide por `Total1 × Saldo`. Parece un error; lo esperable sería prorratear `× Saldo / Total1`. Conviene validarlo con datos reales.
3. **Mínimo 609**: hay que confirmar con usuarios que la intención es "no cobrar si es menor" y no "cobrar al menos".
4. **Índices**: se usa el índice "siguiente o igual" para la fecha base y el "anterior o igual" para la fecha de consulta. ¿Qué índice usan las cooperativas (BCRA, tasa activa BNA)? ¿Cómo se cargan?
5. **MORATAS**: la tasa es "% diario" (`TASA_CASO`). Falta confirmar si alguna cooperativa la carga como mensual o anual y la convierte manualmente.
6. **CAU**: ¿es la Cooperativa de Agua y Urbanización? ¿Sigue vigente el 3 % fijo sobre los cargos 96/97? ¿Qué son esos comprobantes?
7. **AL**: identificar la cooperativa y por qué necesita los ajustes por pagos y cheques anteriores.
8. **Proceso masivo frente a caja**: si una cooperativa usa el proceso masivo y además cobra mora en caja, ¿cómo evita el doble cobro? Se sospecha que mediante `NOINTERES` y `COD_FAC = 'Punitorio'`, pero no se verificó en caja.
9. **Reconexión automática**: la ventana de 15 días alrededor de `FEC_BAJA` para identificar bajas por mora está fija en el código. Confirmar si es intencional.
10. **Cargo de reconexión automática**: la forma de pago del comprobante de venta toma la fecha de hoy. ¿Se factura en la próxima factura o queda como deuda inmediata?
11. **Estados de mora**: ¿cuántas instancias usan en la práctica las cooperativas objetivo? ¿Se usa el canal SMS o mail desde la gestión de mora o solo la impresión?
12. **Prescripción**: ¿qué plazo legal aplican (parámetro 104)? ¿Interviene contabilidad con la cuenta 2158 en todas las cooperativas?
13. **Tramas en cascada**: en `Tramas_Importe`, VTO3 y VTO4 aplican la trama dos o tres veces con días acumulados (§3.3). ¿Es lo que las cooperativas esperan ver impreso?
14. **Tasas `MORATAS` superpuestas**: la validación de carga no detecta superposición entre tasas generales sin categorías (§4.5). Hay que revisar en las bases si hay tramos duplicados que hoy suman interés dos veces.
15. **Unidad de `PLAN_CUO.TASA`**: el código la usa como fracción por período entre cuotas, y `INT_TEM`/`INT_TNA` son solo informativas (§8.4). Confirmar cómo se cargan.
16. **Quita en el interés directo**: el interés directo se calcula sobre el capital previo a la quita, a diferencia de los otros métodos (§8.5).
17. **Caducidad de planes**: no existe en el código (§8.13). ¿Cómo la manejan operativamente?
18. **Anulación en chequera**: la factura de entrega (cuota 0) no se borra con el convenio (§8.10). ¿Queda como deuda?

## 14. Revisión de métodos (segunda pasada)

**Métodos sin regla de negocio** (revisados; consultas, wrappers o armado de informes):

- `clsCobranzaCaja.Get_PLAN_CAJ`;
- `clsFinanciacion.ObtenerGarante`, `GetDatosCuotas(nroRef)` (wrapper), `GetFacturasFinanciadas`, `GetReporteDeudaCuotas`;
- `clsFormasDePago.GetDatosPlan`;
- `clsGestionMora.Get_ExcepcionesMoraDatasource`, `Get_ResumenNotificaciones` (dos sobrecargas), `Get_Notificaciones(lista de ids)` (lectura en lotes de 2000);
- `clsInformes_Financiacion.GetFinanciacionesPeriodo`, `GetListados`, `GetFiltros`;
- `clsInformes_Mora.GetListados` (los seis informes de §10), `GetFiltros`, `Imprimir` y los `LoadFiltro_*`/`Imprimir_*` (solo armado de filtros y títulos; el filtro de prescripción toma su fecha por defecto de hoy menos el parámetro 104).

**Fuera de alcance**: `clsSCotiz.GetDetalles_PlanillAdjudicacion` (`ReglasNegocio.Facturacion/clsSCotiz.cs:1242`) es parte de **Compras**, no de mora: adjudica por producto la cotización de menor costo e incluye a todos los proveedores empatados. Corresponde documentarlo en el documento de compras.

**Formularios de Configuración**: se buscaron en `binarios/decompilado/Configuracion/` (Configuracion, Configuracion.Forms, .Abms, .Funcionalidades, .Herramientas) pantallas que usen `MORATAS`, `MORATAS_CATSER`, `INSTANCI`, `EXC_MORA`, `PLAN_CUO`, `TIP_FIN`, `INDICESMORA`, `TABMORA`, `TRAMASREC`, `DESCUENTO_CAJA` o `CONCEPTOS_INT`, o los parámetros de mora y financiación. **No hay ninguna**. Los ABM de tasas de mora, instancias, excepciones y planes están en ensamblados no descompilados, igual que las pantallas de gestión de mora (§13, punto 1). Lo único relacionado es:

- `abm_Servicio_Categorias` (`Configuracion.Forms/abm_Servicio_Categorias.cs:541-586, 859, 966`): asocia una tabla de ajuste (`TABINFL`, `CATE_SER_EXTRAS.COD_TAB`) a la categoría de servicio. Es ajuste tarifario, no mora.
- `abm_conceptos_tasas` (`Configuracion/abm_conceptos_tasas.cs:31-36`): es de Compras (`CON_TASAS`), no tiene relación con tasas de interés.

Las validaciones de negocio disponibles para la carga de tasas y descuentos de caja son las de §4.5.
