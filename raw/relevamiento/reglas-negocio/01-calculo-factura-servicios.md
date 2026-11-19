# 01 — Cálculo de la factura de un servicio

Reglas de negocio del armado de ítems y del cálculo de importes de la factura de un servicio en Procoop 10.4.6.722, extraídas del código descompilado. El texto describe el comportamiento en prosa y pseudocódigo breve; no reproduce el código fuente.

**Convenciones de citas.** Salvo indicación, los archivos están en `binarios/decompilado/ReglasNegocio/ReglasNegocio.Facturacion/`. Las referencias tienen la forma `Archivo.cs:línea` o `Archivo.cs:desde-hasta`, con la numeración de líneas del archivo descompilado. Otros orígenes:

- `Impuestos.cs` y `clsTasaIVACollection.cs` están en `ReglasNegocio/ReglasNegocio/`.
- `clsServicio.cs` está en `ReglasNegocio/ReglasNegocio.Servicios/`.
- `clsConsumos.cs` está en `ReglasNegocio/ReglasNegocio.Consumos/`.
- Las enumeraciones `Facturacion_*` y el catálogo de parámetros `clsVariables.cs` están en `ReglasNegocio/CapaNucleo/`.
- Segunda pasada: `clsCuadros.cs`, `clsInformes_Consumos.cs` y `clsConsumosTramasCategorias.cs` están en `ReglasNegocio/ReglasNegocio.Consumos/`. `clsFormulas.cs` y `clsEditorFormulas_Extensions.cs` están en `ReglasNegocio/ReglasNegocio.Varios/`. `clsServicios.cs` está en `ReglasNegocio/ReglasNegocio.Titulares/`. `abm_Cuadros.cs` y `abm_CargosAdicionales.cs` están en `Configuracion/Configuracion.Forms.Abms/`.

**Glosario mínimo de tablas** (ver `binarios/CapaDatos-tablas.md`):

| Tabla | Qué es |
|---|---|
| `SERVICIO` | Definición del servicio (tipo de cálculo, alícuota, prorrateo, proporcionales). |
| `CATE_SER` | Categoría tarifaria de un servicio (cargo fijo, consumo mínimo, grandes consumos, coseno fi, días proporcionales). |
| `CATTARIF` | Filas de tarifa de una categoría: tramos, escalones, precio unitario, concepto, tipo de energía. |
| `SERSOC` | Servicio contratado por una cuenta (categoría, condición, última facturación, demanda contratada, bonificaciones). |
| `CUADROS` + `HIS_SERVICIO`, `HIS_CATE_SER`, `HIS_CATTARIF`, `HIS_TAR_ADHE`, `HIS_CARGOS_ADICIONALES` | Cuadros tarifarios históricos (versiones de tarifa). |
| `CONS_SER` | Consumos (lecturas) por servicio, tipo de energía y concepto. |
| `MEDSOC` | Medidores del servicio, con la demanda contratada por tipo de energía. |
| `TIPO_FAC` | Tipo de factura (A, B, etc.), con la configuración de redondeo y franqueo. |
| `ALI_IVA_CF`, `SITIVA`, `ALI_IBR`, `ALI_IBR_CF`, `SITIBR` | Alícuotas de IVA e Ingresos Brutos por situación fiscal. |

---

## 1. Flujo general

### 1.1 Orquestación (facturación masiva)

La facturación de un período recorre las cuentas y, para cada servicio seleccionado de la cuenta, pide los ítems a `clsFacturacionServicio`. Luego agrupa por cuenta y grupo de factura, evalúa los cargos adicionales y arma los comprobantes (`clsFacturacionMasiva.cs:996-1052` y `clsFacturacionMasiva.cs:1128-1340`).

```
para cada cuenta:
  para cada servicio seleccionado (los marcados "facturar con otros" se ordenan al final):
     ítems = GetItemsServicio(sersoc, período, secuencia, consumoDesde, consumoHasta)
  evaluar cargos adicionales NO finales por servicio  -> agrega ítems al servicio
                                                        o a una factura aparte (grupo)
  agrupar por (cuenta, grupo de factura) -> GetFactura(...)  (franqueo, redondeo de ítems)
evaluar cargos adicionales FINALES por factura         -> agrega ítems a la factura
si total < 0 y hubo energía inyectada -> crédito por inyectada (param. 3094)
AgregaAnticipoyRedondeo(factura)                       -> anticipos y redondeo
si total < 0 -> se convierte en nota de crédito (comprobante de anulación)
```

Un servicio cuyo cálculo falla no aborta el lote: la excepción se registra como error del servicio y esa cuenta no se factura (`clsFacturacionMasiva.cs:1038-1049`, `clsFacturacionMasiva.cs:1168`).

### 1.2 `GetItemsServicio`: armado de ítems de un servicio

`clsFacturacionServicio.GetItemsServicio` (`clsFacturacionServicio.cs:1245-1375`) es el punto de entrada por servicio:

1. Obtiene el `SERSOC`, el `SERVICIO` y los consumos pendientes del rango de fechas (`GetConsumoServicioMedido`, `:1103-1118`). Si se pasa un consumo simulado, no lee consumos.
2. Valida la categoría. Si el servicio no tiene `COD_CATSER`, lanza *"El servicio X de la cuenta Y no tiene una categoría asignada..."*. Si la categoría no existe en el cuadro vigente, lanza *"Categoría inválida..."* (`:1266-1274`).
3. Elige el algoritmo según `SERVICIO.TIP_CAL` (ver la sección 2).
4. **Facturación única por período (servicios no medidos).** Los servicios fijos, con adherentes y de cuotas de obra solo facturan si `SERSOC.ULT_FAC < período`, o si `ULT_FAC = período` y hay secuencia distinta de 0 o `SEC_PER < secuencia` (`:1314`, `:1324`, `:1330`). Los medidos se rigen por la existencia de consumos pendientes; el cargo fijo tiene su propio control (sección 3).
5. Si generó ítems y no es simulación: incrementa `SERSOC.CNT_FAC` y actualiza `ULT_FAC` y `SEC_PER` (`:1336-1352`).
6. Agrega los **cargos extraordinarios precargados** (`PRCAGAS`) del servicio para ese período o sin período (`AddCargosAdicionales`, `:1779-1791`; subtipo 1, Conceptos extraordinarios).
7. Si el parámetro 3134 tiene un concepto, agrega el **cargo por atraso en la devolución de productos prestados** (ortopedia): días de atraso × `PROD_SER.PRE_ATRASO` (`AddCargosAtrasoProductos`, `:1377-1417`).
8. Marca todos los ítems con `ItemRel = COD_SER` y devuelve, además de los ítems, las fechas y lecturas anterior y actual y el consumo bonificado. Las fórmulas de cargos adicionales usan esos datos.

### 1.3 `GetFactura`: armado del comprobante

`clsFacturacionServicio.GetFactura` (`clsFacturacionServicio.cs:1426-1498`):

- Toma la situación de IVA (`COD_SIT`) y la de Ingresos Brutos (`COD_SIB`) de la cuenta (`SUMSOC`).
- **Tipo de factura forzado por categoría.** Si algún ítem pertenece a una categoría con `CATE_SER.COD_TPFC`, ese tipo de factura reemplaza al del lote (`:1444-1453`).
- **Franqueo** (sección 13), salvo que `TIPO_FAC.NOFACTURAR_FRANQUEO` esté activo.
- Agrega los ítems y, si `TIPO_FAC.REDONDEO_ITEMS > 0`, fuerza esa cantidad de decimales en cada ítem y en los totales (sección 15).
- Si no hay cargos finales pendientes, aplica anticipos y redondeo en el mismo paso. Si los hay, los difiere hasta después de evaluarlos.

---

## 2. Tipos de servicio (`SERVICIO.TIP_CAL`)

Enumeración `clsServicio.TipoCalculo` (`clsServicio.cs:32-53`):

| Valor | Nombre | Algoritmo en `GetItemsServicio` |
|---|---|---|
| 1 | Servicio medido | Medido con tarifa por bloque (sección 4.1) |
| 2 | Servicio medido por tramas | Tramos y escalones progresivos (sección 4.2) |
| 3 | Gas natural | Corrección por factor calórico y luego tramas (sección 4.4) |
| 4 | Medido con registración de importe fijo | Como el 1, pero factura cantidad 1 al precio del escalón |
| 5 | Telefonía | Suma de importes de llamadas tarifadas (sección 10) |
| 6 | De importe fijo | Precio fijo de la categoría, con proporcional de alta y baja (sección 5) |
| 7 | Por cantidad | `SERSOC.CANTIDAD` como "consumo", tarifa por bloque |
| 8 | Por cantidad por tramas | `SERSOC.CANTIDAD` con tramas |
| 9 | Con adherentes según cantidad | La categoría se elige por cantidad de adherentes (sección 9) |
| 10 | Con adherentes según cantidad y edad | Categoría por cantidad más tarifa por adherente según edad |
| 11 | Con adherentes según tarifas | Tarifa asignada a cada adherente |
| 12 | Con adherentes según múltiples tarifas | Todas las tarifas que apliquen al adherente |
| 13 | Con adherentes según tarifas automáticas | La tarifa más específica que aplique |
| 14 | Telefonía móvil | Como importe fijo |
| 15 | Servicio de agua según inmueble | Fórmula sobre datos catastrales (sección 8) |
| 16 | Pack SMS | Como importe fijo |
| 17 | Cuotas de obras | Pavimento, cloaca, alumbrado o vivienda (sección 7) |

**Medidos sin consumo.** En los tipos 1 a 4, si no hay consumos pero `SERVICIO.FAC_SIN_CONSUMO` está activo y el servicio está conectado o pendiente de desconexión (`CONDICION` 2 o 3), factura como si el consumo fuera 0, de modo que igual cobra el cargo fijo (`clsFacturacionServicio.cs:1281-1285`). Sin consumos y sin esa marca, el servicio medido no genera ítems.

**Categoría del consumo.** Si la lectura (`CONS_SER.COD_CAT`) tiene otra categoría del mismo servicio que la del `SERSOC`, prevalece la de la lectura. Si esa categoría no existe, lanza *"No se pudo encontrar la categoría del consumo"* (`:1292-1299`).

**Consumo de otro servicio.** Si el servicio tiene `REL_SER` y `USA_COT`, toma las lecturas del servicio relacionado en la misma cuenta; por ejemplo, cloaca calculada sobre el consumo de agua (`:1106-1116`). Los parámetros 2701 y 3143 restringen esas lecturas a las no facturadas.

**División de consumos.** Con `SERVICIO_EXTRAS.DIVISION_CONSUMO`, el valor 1 toma las lecturas del grupo dividido solo si corresponden al período general, y el valor 2 solo si coinciden período y secuencia (`:690-711`).

**Condición del servicio** (`CondicionServicio`): 1 pendiente de conexión, 2 conectado, 3 pendiente de desconexión, 4 baja, 5 no vigente.

---

## 3. Cargo fijo

`GetCargoFijo`, `AgregarItemCargoFijo` y `GetImporteCF` (`clsFacturacionServicio.cs:1803-2008`).

### 3.1 Cuándo se cobra

Se cobra si se cumplen todas estas condiciones (`:1810`, `:1872`):

- Condición del servicio 2 o 3, o condición 1 o 4 con `CATE_SER.COBRAR_CF_BAJA`.
- `SERSOC.ABO1BON` (bonificar el primer abono) no está activo. Si lo está, se omite el cargo fijo una sola vez y la marca se apaga (`:1836-1840`).
- La categoría tiene `CAN_CF ≠ 0`, `IMP_CF ≠ 0` y un concepto de cargo fijo (`CATE_SER.COD_CF` o, en su defecto, `SERVICIO.COD_CF`).
- **Una vez por período.** `ULT_FAC < período`, o el mismo período con secuencia posterior. La propiedad `CobrarCargoFijo` del proceso fuerza el cobro igual.

El ítem es de tipo Producto, subtipo 10 (`Cargo_Fijo_Servicio_Medido`): cantidad `CAN_CF × fracción de prorrateo × múltiplo`, precio `importe × cotización`. Si `SERVICIO.COD_MON` está informado, el precio se convierte con la cotización de venta de esa moneda (`:1871`).

### 3.2 Importe del cargo fijo (`GetImporteCF`)

```
importe = CATE_SER.IMP_CF
si param 2821 (cargo fijo por trama desde tarifas):
    proporción = DIAS_PROP de la categoría si AP_TR_DIAS = 1 (anulada por el param 2864
                 si los días de consumo son menos que DIAS_PROP)
    si TIP_CAL = 2: consumoTrama = consumo total
        (o el del medidor testigo si TRAMA_DEC = 4; o el consumo sin restar la
         inyectada si el param 3103 está activo)
        buscar la fila de CATTARIF cuyo tramo [CON_TMIN, CON_TMAX] × proporción
        contiene consumoTrama; si tiene IMP_CF, usarlo
    si TIP_CAL = 1: fila cuyo escalón [CON_MIN, CON_MAX) × proporción contiene el
        consumo; si tiene IMP_CF, usarlo
si SERVICIO.PPERIODO y hay consumo y días:
    importe = importe × CAN_CF × días / SERVICIO.PERIODO (30 si no está definido)
si no, si SERVICIO.PROPORCION:  proporcional de alta y baja (sección 5.1)
```

### 3.3 Medidores compartidos (multicategoría)

Si la categoría figura en el parámetro 2750, se cobra un cargo fijo por cada categoría declarada en las propiedades personalizadas del servicio (`:1812-1831`). Las propiedades van de a pares: "Código Categoría N" y, en el código de propiedad siguiente, la cantidad. Cada cargo usa la cantidad como múltiplo.

### 3.4 Prorrateo del cargo fijo

Con `SERVICIO.PRORRATEO_CF`, si hay prorrateo entre cuadros (sección 6) se emite un ítem por cuadro. Cada ítem usa `IMP_CF` y `CAN_CF` de `HIS_CATE_SER` del cuadro correspondiente, con cantidad × fracción. Si la categoría no existe en el cuadro anterior, todo se cobra al cuadro actual (`:1876-1924`).

---

## 4. Servicios medidos: tramos, escalones y factores

### 4.1 Tarifa por bloque (tipos 1, 4 y 7)

`FacturarConsumos_Medido` (`clsFacturacionServicio.cs:2822-2906`):

- Si hay días proporcionales, el consumo se multiplica por `factorProporcional` (sección 4.3).
- Busca **una sola** fila de `CATTARIF` con `CON_MIN ≤ consumo < CON_MAX`. Todo el consumo se cobra al `PRE_UNI` de esa fila: no hay escalonamiento progresivo.
- Tipo 4: cantidad 1 al precio del escalón, es decir, un importe fijo por rango de consumo.
- Tipo 7: el ítem pasa además por el proporcional de alta y baja.
- Si no encuentra fila, lanza *"No existe tarifa para el consumo realizado..."*.
- El ítem es de tipo Servicio, subtipo 1. Guarda `CodigoTarifa = COD_CTT` y la alícuota de la fila (`CATTARIF.COD_ALI`) si existe.

### 4.2 Tramos y escalones progresivos (tipos 2, 3 y 8, y grandes consumos)

`FacturarConsumos_MedidoPorTramas` y `FacturarTramas` (`clsFacturacionServicio.cs:2962-3115`). `CATTARIF` combina dos niveles:

- **Tramo** (`CON_TMIN`, `CON_TMAX`): define qué tabla de escalones aplica según el consumo total. Todas las filas de un mismo par `[CON_TMIN, CON_TMAX]` forman un grupo.
- **Escalón** (`CON_MIN`, `CON_MAX`): dentro del grupo elegido, cada fila es un bloque progresivo con su `PRE_UNI`.

```
proporción = factorProporcional(días)                         (4.3)
consumoTramo = consumo (o el consumo del medidor testigo si TRAMA_DEC = 4)
grupo = primer grupo (orden CON_TMIN) con CON_TMIN×proporción ≤ consumoTramo ≤ CON_TMAX×proporción
si consumo < 0: usar solo escalones con CON_MIN < 0     (energía inyectada neta, 4.6)
si no:          usar escalones con CON_MAX ≥ 0
si param 2827: proporción = 1 para los anchos; si consumo > CON_TMAX del grupo,
               marcar los ítems con la observación "Beneficio por Días"
restante = consumo
para cada escalón ordenado por |CON_MAX|:
    ancho = |red2(CON_MAX × proporción × FactorTrama)| − |red2(CON_MIN × proporción × FactorTrama)|
    tomado = min(|restante|, ancho)   (con el signo del consumo)
    restante -= tomado
    si tomado ≠ 0 o consumo = 0: ítem (cantidad = tomado × fracciónProrrateo,
                                       precio = PRE_UNI × factorPrecio)
    si restante = 0: fin
si restante ≠ 0: error "Faltan tramas en la Categoría indicada"
```

`red2` es el redondeo a 2 decimales.

- El ancho de cada escalón se escala por la proporción de días y por `FactorTrama`. En grandes consumos con tramas según potencia, `FactorTrama` son los kW (sección 11.2).
- Si ningún grupo contiene el consumo, el código no tiene un mensaje propio: falla con una excepción genérica de secuencia vacía, porque toma el primer grupo sin verificar que exista (`:2974-2980`).

### 4.3 Factor proporcional por días

`GetFactorProporcional` (`clsFacturacionServicio.cs:1150-1170`). La configuración se arma en `:2715-2723`:

- `CATE_SER.AP_TR_DIAS = 1` y `DIAS_PROP > 0`: factor = días de consumo / `DIAS_PROP`. El parámetro 2864 lo anula si los días de consumo son menos que `DIAS_PROP`.
- `AP_TR_DIAS = 2`: el valor especial −1 hace que el factor sea `SERSOC.CANTIDAD`, o 1 si la cantidad es 0. Sirve para multiplicar los tramos por una cantidad de unidades, por ejemplo departamentos en un medidor colectivo.
- Sin configuración: factor 1.
- Los días de consumo salen de `fecha actual − fecha anterior` de las lecturas del grupo de categoría (`clsConsumosAFacturar.cs:366`). Con `SERVICIO.PRORRATEO_DIASCONSUMO` y lecturas divididas, se usa el rango completo de las lecturas originales (`clsFacturacionServicio.cs:2754-2770`).
- Uso del factor según el tipo:
  - En tramas (sección 4.2) escala los **límites** de tramos y escalones.
  - En tarifa por bloque (sección 4.1) multiplica el **consumo** facturado. Ver Dudas abiertas.

### 4.4 Gas natural (tipo 3)

Antes de tarificar, cada lectura activa se corrige (`clsConsumosAFacturar.cs:36-47`; `clsConsumos.cs:1315-1349`):

```
volumen  = NETO (o CONSUMO si todavía no tiene NETO)
si FACTOR_CAL tiene PRESION y TEMPERATURA: volumen = red4(volumen × presión × temperatura)
CONSUMO  = volumen × FACTOR_CAL.FACTOR × SERSOC.COEF_CORRECTOR (1 si ≤ 0) / FactorCalóricoÓptimo (param 14)
CONSUMO  = redondeo según param 119
```

- El redondeo del parámetro 119 admite truncar al entero, redondear a 0 decimales, o solo dividir sin redondear.
- `FACTOR_CAL` se busca por mes y año del período, primero por categoría y si no el general (`clsFacturacionServicio.cs:1079-1101`). Si no hay factor, lanza *"No existe Factor para el periodo indicado..."*.
- Después se aplica el algoritmo de tramas (sección 4.2).

### 4.5 Consumo mínimo

En `GetItemsServicioMedido` (`clsFacturacionServicio.cs:2377-2419`):

- Aplica si la categoría tiene `COD_CM`, `IMP_MINM > 0` (consumo mínimo en unidades) e `IMP_CMINM > 0` (precio por unidad faltante), y hubo lecturas reales.
- Se activa si el consumo sin la energía inyectada es menor que `IMP_MINM`.
- Ítem subtipo 11 (`Consumo_Minimo_Servicio_Medido`): cantidad = `IMP_MINM − consumo`, precio `IMP_CMINM`.
- Solo si la condición del servicio está entre las "conectadas", o si el parámetro 2465 está apagado, o si `CATE_SER.COBRAR_CM_BAJA` está activo.
- Con `SERVICIO.PRORRATEO_CM` y prorrateo, se emite un ítem por cuadro con los valores de `HIS_CATE_SER`. Con el método 3 se prorratea el precio; con los otros, la cantidad.

### 4.6 Energía inyectada (prosumidores)

- **Inyectada.** Una lectura activa es inyectada si `CONSUMO < 0` y su medidor (`MEDSOC`) está marcado `INDICADO`, o si la lectura avanzó (`EST_ACT > EST_ANT`) (`clsConsumosAFacturar.cs:289-305`).
- **Consumo neto.** El consumo activo total es la suma algebraica de las lecturas activas, incluidas las negativas. También se calcula el consumo "sin inyectada", que suma solo las lecturas positivas (`clsConsumosAFacturar.cs:360-361`).
- **Neto negativo.** Si el neto da negativo, las tramas usan los escalones con `CON_MIN < 0` y generan ítems con cantidad negativa, es decir, un crédito valorizado (sección 4.2).
- **Usos del consumo bruto.**
  - Consumo mínimo: compara contra el consumo sin inyectada.
  - Cargo fijo por trama: con el parámetro 3103, el tramo se elige ignorando la inyectada.
  - Coseno fi: con el parámetro 2737, la base activa incluye la inyectada; sin él, usa solo el consumo positivo.
- **Factura negativa.** En la facturación masiva, si la factura queda con total negativo y tiene lecturas inyectadas, se agrega el concepto del parámetro 3094 por el importe opuesto. Es un ítem de anticipo con facturación futura que deja la factura en 0 y el saldo a favor de la cuenta (`clsFacturacionMasiva.cs:1288-1297`).

### 4.7 Consumo en cero y bonificación de consumo (`SERSOC.CONS_BONIF`)

**Bonificación** (`clsConsumosAFacturar.cs:244-255`, `:394-410`):

- Se descuentan `CONS_BONIF` unidades del consumo. Si el consumo es menor, se bonifica todo.
- Con varias categorías, la bonificación se consume en orden.
- Se emite un ítem informativo a precio 0 con la observación *"Bonificación de N Unidades"*.
- **En gas (tipo 3)**, las unidades bonificadas no son gratis: se facturan como *"Cargo M3 Bloque"* al `PRE_CSI` del escalón. `PRE_CSI` es el precio de costo. Si hay prorrateo, se pondera por cuadro (`clsFacturacionServicio.cs:2678-2713`, `:2336-2363`).

**Consumo cero.** Si el consumo resultante es 0 y no es grandes consumos ni tipo 4, se emite un ítem de servicio con precio 0, la cantidad bonificada y el código de tarifa del escalón que contiene el 0. Queda trazabilidad aunque no haya importe (`:2293-2367`). Con el parámetro 2876 y prorrateo, se agregan ítems extra solo para registrar el cuadro tarifario aplicado.

### 4.8 Categorías prepagas (`CATE_SER.PREPAGA`)

`clsFacturacionServicio.cs:2734-2745` y `CorrijeItemsPrepaga` (`:2794-2820`):

- El escalón se determina con el consumo actual más lo ya facturado en el mes, sin contar las entregas de energía (`GetConsumoFacturadoEnelMes`, `:2782-2792`).
- Luego se quitan de los primeros ítems las unidades ya facturadas.
- Si el cambio de escalón genera diferencia de importe, se agrega el concepto del parámetro 2283 ("recargo en cambio de trama").
- Las categorías prepagas no se prorratean entre cuadros.

---

## 5. Servicios fijos, por cantidad y proporcionales

`GetItemsServicioFijo` (`clsFacturacionServicio.cs:2142-2203`):

- Agrega el cargo fijo, salvo en multicategoría. En multicategoría se factura una vez por cada par categoría y cantidad (sección 3.3).
- Tipos 6, 14 y 16: toma la primera fila de `CATTARIF` de la categoría. Si `PRE_UNI ≠ 0`, emite el ítem pasando por el proporcional de alta y baja (`AgregarProporcional`).
- Tipo 7: tarifa por bloque sobre `SERSOC.CANTIDAD`.
- Tipo 8: tramas sobre `SERSOC.CANTIDAD`.
- **Categoría histórica.** Con el parámetro 3111, en un servicio de importe fijo facturado por mes vencido se usa la categoría anterior si una orden técnica de cambio de categoría (operación del parámetro 2330) se confirmó después del período facturado (`:2205-2260`).

### 5.1 Proporcional de alta y baja

Aplica si `SERVICIO.PROPORCION` está activo (`AgregarProporcional`, `clsFacturacionServicio.cs:3247-3310`; la misma lógica para el cargo fijo en `:1983-2006`).

- **Mes vencido** (`SERVICIO.VENCIDO`):
  - Alta en el mes facturado: precio × (1 − díaAlta / díasMes). Con el parámetro 2787 ("tomar día de reconexión"), precio × (díasMes − díaAlta + 1) / díasMes.
  - Baja en el mes facturado: precio × díaBaja / díasMes.
- **Mes adelantado** (sin `VENCIDO`):
  - Si el alta fue en el mes anterior y ese mes no se facturó, se agrega un ítem extra por el período anterior a precio × (1 − díaAlta / díasMes), además del mes completo.
- El factor aplicado se guarda en `ProporcionalFactor`. La fórmula `GetProporcionalAltaBaja` lo expone a los cargos adicionales.

---

## 6. Prorrateo entre cuadros tarifarios

Se usa cuando cambia la tarifa en medio del período de consumo. Clase interna `DetalleProrrateo` (`clsFacturacionServicio.cs:32-147`) y su uso en `FacturarConsumos_Medido`, `FacturarTramas` y `FacturarTrama_Prorrateo_Anterior` (`:2822-2906`, `:2984-3245`).

### 6.1 Configuración (en `SERVICIO`, y por cuadro en `HIS_SERVICIO`)

- `PRORRATEO_METODO` (`clsServicio.Metodos_Prorrateo`, `clsServicio.cs:55-65`):
  - 0: sin prorrateo.
  - 1: proporcionalidad en consumo.
  - 2: proporcionalidad en consumo continuando la trama.
  - 3: proporcionalidad en precio unitario.
- `PRORRATEO_VIGENCIA`: fecha desde la que rige la tarifa actual.
- `PRORRATEO_CUADRO`: cuadro histórico con la tarifa anterior.
- `PRORRATEO_DIASCONSUMO`: con lecturas divididas, usa el rango de fechas completo de las lecturas originales.
- `PRORRATEO_CF` y `PRORRATEO_CM`: prorratean también el cargo fijo y el consumo mínimo.

### 6.2 Cálculo de las fracciones

Hay prorrateo si la categoría no es prepaga, el método no es 0, hay vigencia y cuadro, y la vigencia es posterior a la fecha de la lectura anterior (`TieneProrrateo`, `:134-146`).

```
días = fechaActual − fechaAnterior
Prorrateo_2 (cuadro anterior) = red6((vigencia − fechaAnterior) / días)
Prorrateo_1 (cuadro actual)   = 1 − Prorrateo_2
   (si fechaActual > vigencia: Prorrateo_1 = red6((fechaActual − vigencia) / días),
    Prorrateo_2 = 1 − Prorrateo_1)
si alguna fracción < 0 o la suma > 1: todo a un solo cuadro (el actual si la vigencia ≤ fechaAnterior)
```

- **Tercer cuadro.** Si el `HIS_SERVICIO` del cuadro anterior tiene a su vez prorrateo vigente dentro del período, el cálculo se repite sobre la porción del cuadro anterior. Resulta `Prorrateo_3` sobre `Cuadro_3`, así que se soportan hasta 3 cuadros en un mismo período (`:54-72`).
- **Trazabilidad.** Cada ítem guarda las tres fracciones (`ProrrateoCuadroActual`, `ProrrateoCuadroAnterior`, `ProrrateoCuadroAnterior_2`) (`:2421-2427`). Los ítems de cuadros anteriores llevan el cuadro en `ITEMSFAC_EXTRAS.COD_CUA` (`AgregarCuadroTarifario`, `:2908-2922`). Las fórmulas `GetProrrateoActual`, `GetProrrateoAnterior` y `GetProrrateoAnterior_3er_Cuadro` exponen las fracciones (`clsFormulas_CargosAdicionales.cs:3684-3717`).

### 6.3 Métodos

- **Método 1, proporcionalidad en consumo.** Cada cuadro tarifa el consumo **completo** con sus propios escalones, y la cantidad de cada ítem se multiplica por la fracción del cuadro. Resultan ítems separados por cuadro.
- **Método 2, consumo continuando la trama.** El cuadro anterior tarifa `consumo × Prorrateo_2` recorriendo sus escalones desde el principio. El cuadro actual tarifa el consumo total, pero descuenta de sus primeros escalones las unidades ya cobradas por el anterior. Así, el consumo del período nuevo continúa en el escalón donde quedó el anterior (`:3066-3077`, `:3168-3212`).
- **Método 3, precio unitario.** Un único juego de ítems con precio = Σ (`PRE_UNI` del cuadro × fracción). Exige que los escalones de todos los cuadros sean idénticos. Si no, lanza *"Las cantidades de tarifas actuales y del cuadro tarifario no son coincidentes"* o *"Los valores de las tramas no coinciden..."* (`:3149-3166`).
- **Errores.** Si falta la tarifa en un cuadro: *"No existen tarifas en el cuadro tarifario a prorratear. Categoria: X"* o *"No existe tarifa en el cuadro N (tercer prorrateo) para el consumo realizado..."*.

### 6.4 Cuadros tarifarios: alta, históricos y actualización de precios (segunda pasada)

Un cuadro tarifario **no es una tarifa futura**: es la **foto cerrada** de la tarifa que estuvo vigente hasta su creación. Las tablas vivas (`SERVICIO`, `CATE_SER`, `CATTARIF`, etc.) siempre contienen la tarifa actual.

- **Alta** (`clsCuadros.CargarCuadroNuevo`, `ReglasNegocio/ReglasNegocio.Consumos/clsCuadros.cs:11-30`):
  - Si no hay ninguna factura sin cuadro asignado (`FACTURAS.COD_CUA` vacío), pregunta *"No existen facturas con el Cuadro Tarifario actual. ¿Desea realizar el Backup?"*. Si el usuario responde que no, se cancela el alta.
  - `FEC_DESDE` es el mayor `FEC_HASTA` de los cuadros existentes. Si es el primer cuadro, es hoy menos 5 años. `FEC_HASTA` es el momento de creación.
  - Copia las tablas vivas `SERVICIO`, `CATE_SER`, `CATTARIF`, `CARGOS_ADICIONALES`, `PROD_SER`, `IMPUESTO`, `TAR_ADHE` y `CATE_SER_EXTRAS` a sus espejos `HIS_*` con el nuevo `COD_CUA`.
  - `HIS_SERVICIO_EXTRAS` se llena desde `SERSOC_EXTRAS` y no desde `SERVICIO_EXTRAS` (`:28`). **[VERIFICAR]**: parece un error.
- **Asociación con las facturas** (`GuardarCodCuaFacturas`, `clsCuadros.cs:32-36`). Al terminar el alta, todas las facturas con `COD_CUA` vacío quedan marcadas con el cuadro nuevo. Así, `FACTURAS.COD_CUA` identifica la versión de tarifa con la que se emitió cada factura. Las facturas emitidas después del último cuadro siguen con `COD_CUA` vacío, que significa "tarifa viva".
- **ABM** (`Configuracion/Configuracion.Forms.Abms/abm_Cuadros.cs`):
  - Al guardar uno nuevo, ejecuta el alta y luego la asociación (`:41-49`, `:71-76`). Registra el usuario que lo creó.
  - Al modificar un cuadro, el servicio histórico solo se puede consultar (`:51-64`).
  - Los cargos adicionales históricos sí se pueden editar (`:78-90`; ver 12.8).
  - No hay cálculo de negocio adicional en el formulario.
- **Circuito implícito de actualización de precios** (inferido; **[VERIFICAR]** con LAG):
  1. Crear un cuadro, que guarda la tarifa anterior.
  2. Modificar las tablas vivas.
  3. Si corresponde prorratear, cargar en `SERVICIO` `PRORRATEO_VIGENCIA` con la fecha del cambio y `PRORRATEO_CUADRO` con el cuadro recién creado (6.1).
- **Uso de un cuadro forzado en el cálculo.** Si `clsFacturacionServicio.CuadroTarifario` tiene valor, se limpian los cachés (`clsFacturacionServicio.cs:290-305`). Desde ese momento, servicio, categorías (solo activas), tarifas (solo activas), tarifas de adherentes y cargos se leen de `HIS_*` de ese cuadro (`:732-803`, `:912-1003`, `:1029-1067`). Es la base de `TotalSimulacionCuadro` y del prorrateo.
- **Herramientas de copia de tarifas** (`ReglasNegocio/ReglasNegocio.Titulares/clsServicios.cs`). Trabajan sobre las tablas vivas o sobre `HIS_*` si se indica un cuadro:
  - `Clonar_Categoria` (`:86-119`). Crea una categoría con `COD_CAT = máximo + 1` y el prefijo "(Copia) " (el nombre se trunca a 40 caracteres), y clona sus filas de tarifa.
  - `ActualizarTarifaConOtra` (`:675-735`).
    - Copia, fila por fila según la posición (ordenadas por `CON_TMAX` y `CON_MAX`), los precios que el usuario elige entre `PRE_UNI`, `COSTO_MEM`, `COSTO_TNE`, `COSTO_EPEC`, `COSTO_SUBSIDIO` y `PRE_CSI`.
    - Opcionalmente, también copia los precios y conceptos de demanda de la categoría.
    - Si las cantidades de filas no coinciden, lanza *"Se ha producido una inconsistencia al Actualizar las Tarifas"*.
  - `EliminarYClonarTarifas` (`:737-783`). Reemplaza todas las filas por una copia de las de otra categoría.
  - `ActualizarTarifasCoincidentesConOtra` (`:785-855`). Copia filas completas por posición hasta la menor cantidad, conservando los identificadores. Si no hay filas, lanza *"No se encontraron tarifas para realizar la actualización."*.

---

## 7. Cuotas de obras (tipo 17)

`GetItemsCuota` (`clsFacturacionServicio.cs:2435-2471`). Antes del cálculo:

- Cobra el cargo fijo si corresponde.
- Exige `SERVICIO.TIP_OBRA`; si falta, lanza *"Debe indicar el tipo de obra..."*.
- Los tipos de obra son pavimento, agua, cloacas, alumbrado y vivienda (`clsServicio.TipoCuotasObras`). **Agua no tiene algoritmo**: solo cobra el cargo fijo.

El plan de pagos vive en `SERSOC_EXTRAS`:

| Campo | Significado |
|---|---|
| `CNT_CUOTAS` | Cantidad de cuotas del plan |
| `CNT_CUOTAS_PAGAS` | Cuotas ya facturadas |
| `CNT_UNIDADES` | Unidades por cuota (metros o importe) |
| `CNT_UNIDADES_TOTALES` | Total de unidades del plan |
| `CNT_UNIDADES_FACTURADAS` | Unidades ya facturadas |

- **Pavimento** (`:2511-2553`):
  - Si faltan las unidades totales, se calculan del inmueble asociado (`PROPIEDA`, unido al servicio por la nomenclatura catastral). Sin inmueble: *"El servicio no tiene un inmueble relacionado..."*.
  - Precio por unidad = coeficiente vigente de `CATE_SER_COEFICIENTES`, con `FEC_COEF` ≤ fin del período.
  - La última cuota ajusta el saldo de unidades. La descripción lleva *"Cuota n/N"*.
  - Agotado el plan, no factura.
- **Alumbrado** (`:2555-2616`):
  - Igual que pavimento, pero exige las unidades totales (*"El servicio no tiene un total de metros asignado..."*).
  - **Ajuste por inflación** si `CATE_SER_EXTRAS.COD_TAB` está informado: coeficiente × índice de `INFLACIO` del período − 2 / índice del mes anterior al alta. Si falta algún índice, lanza un error descriptivo.
  - Sin plan: *"El servicio no tiene un plan de pagos asignado..."*.
- **Cloaca** (`:2618-2644`): la cuota es un **importe**: cantidad 1, precio = `CNT_UNIDADES`. La última cuota cobra el saldo.
- **Vivienda** (`:2473-2509`):
  - Porcentaje por cuota = `PLANESVIV.MINIMO_DA` si la vivienda está adjudicada, o `MINIMO_AA` si no. En su defecto, los parámetros 635 y 634.
  - Tope = `PORC_AFACTURAR − PORC_FACTURADO`.
  - Ítem subtipo 27: cantidad = porcentaje / 100, precio = `PRECIOSVIV.IMPORTE` vigente a la fecha.
- **Factura manual de cuota de obra de agua** (`GetFactura_ServicioCuotaAgua`, `:1172-1243`): genera y guarda una factura con un ítem por cantidad × (importe / cantidad) y suma la cantidad a `CNT_UNIDADES_FACTURADAS`. Si no hay `SERSOC_EXTRAS`: *"El Servicio seleccionado no tiene datos Extra creados"*.

---

## 8. Agua según inmueble (tipo 15)

`FacturacionSegunInmueble` (`clsFacturacionServicio.cs:2646-2666`). Se factura una vez por período:

```
coefActualización = SERVICIO.COE_ACTU1 si COE_ZONAL ≤ 0,8, si no COE_ACTU2
cuotaMínima       = CATE_SER.CUO_MIN1 si COE_ZONAL ≤ 0,8, si no CUO_MIN2
importe           = red2(PROPIEDA.TBM × COE_ZONAL × coefActualización + cuotaMínima × 0,7)
```

Errores: *"El servicio no tiene un inmueble relacionado..."*, *"...Tasa Básica Mensual Inválida..."* (TBM ≤ 0) y *"...Coeficiente Zonal Inválido..."* (COE_ZONAL ≤ 0). Si no hay consumo, termina ahí. El consumo mínimo puede agregarse igual.

---

## 9. Servicios con adherentes (tipos 9 a 13)

`GetItemsServicioConAdherentes`, `GetTarifasAdherente` y `ActualizarCategorias` (`clsFacturacionServicio.cs:2010-2140`).

**Adherentes que cuentan** (`:630-652`): los que no tienen baja, excluyendo según marcas del servicio:

- `MENORES`: excluye a quienes nacieron en el último año (a fin del mes siguiente).
- `JUBILAD`: excluye a jubilados (ocupación de tipo 2).
- `DISCAPA`: excluye a personas con discapacidad.

**Por tipo de cálculo:**

- **Tipos 9 y 10.** La categoría se elige automáticamente: la fila de `CATTARIF` cuyo `CAN_ADH` coincide con la cantidad de adherentes. Esa categoría se graba en el `SERSOC`. Ítem: `PRE_UNI × (XUNID ? 1 : cantidad)`. Si no hay fila: *"No se encontró una Categoría para N Adherentes"*.
- **Tipos 10 a 13.** Además, se cobra cada adherente según `TAR_ADHE`:
  - Filtros: servicio, vínculo (`COD_VIN`), ocupación (`COD_OCU`), categoría (`COD_CAT`, 0 = cualquiera) y edad entre `EDA_INI` y `EDA_FIN`. La edad se calcula al último día del período.
  - 11: la tarifa asignada al adherente (`ADHSOC.COD_TAD`).
  - 12: todas las que apliquen.
  - 10 y 13: la más específica, la que tiene más filtros informados.
  - `COBRAEXCEDENTE = N`: los primeros N adherentes de esa tarifa no se cobran.
- **Otros tipos.** Ítem base `PRE_UNI × (XUNID ? 1 : cantidad)` de la categoría del servicio.
- **`SERVICIO.CAT_AUTO`.** Recategoriza según la edad del titular (adherente de vínculo tipo 1), con la fila de `TAR_ADHE` de precio 0 y categoría informada.
- **Cargo fijo.** Se cobra con la categoría final.

---

## 10. Telefonía (tipo 5)

`FacturarConsumos_Telefonia` (`clsFacturacionServicio.cs:2938-2960`):

- Un ítem de servicio con la suma de `NETO` de las llamadas tarifadas, excluida la clave 100. Si no hay llamadas y el parámetro 2514 está activo, el ítem va en 0.
- Las llamadas con clave 100 (Calling Party Pays, CPP) van al concepto del parámetro 19 (subtipo 14).
- Las llamadas internacionales no facturadas hasta la fecha (`INTERNAC`) van al concepto del parámetro 24 (subtipo 2).

---

## 11. Grandes consumos (`CATE_SER.GC`)

`FacturarGrandesConsumos` (`clsFacturacionServicio.cs:3312-3350`). La categoría de grandes consumos factura energía por concepto y banda, demanda y factor de potencia. Los tipos de energía de `CONS_SER.TIP_ENE` y `CATTARIF.TIP_ENE` son:

| Código | Significado |
|---|---|
| `A` o vacío | Energía activa |
| `R` | Energía reactiva |
| `DP` | Demanda en punta |
| `DFP` | Demanda fuera de punta |
| `DV` | Demanda en valle |

El concepto (`COD_CON`) distingue bandas horarias y franjas.

### 11.1 Energía activa

Para cada concepto presente en las lecturas activas, se tarifa el consumo de ese concepto con las filas de `CATTARIF` del mismo `TIP_ENE` y `COD_CON`. La modalidad está en `CATE_SER.TRAMA_DEC`, reutilizado como `TipoCalculo_GrandesClientes` (`clsServicio.cs:76-88`; `GC_FacturarConsumo`, `clsFacturacionServicio.cs:3352-3401`):

| Valor | Modalidad |
|---|---|
| 0 | Precio por cantidad: un ítem al `PRE_UNI` de la fila cuyo escalón contiene el consumo |
| 1 | Tramas según la energía activa consumida del concepto |
| 2 | Tramas según potencia: `FactorTrama` = máx(demanda en punta medida, demanda en punta contratada); los anchos de escalón se expresan en kWh por kW |
| 3 | Tramas según el total consumido: el tramo se elige con el consumo activo total de todos los conceptos |
| 4 | Tramas según el consumo del medidor testigo (sección 16) |

Los subtipos de ítem son 2 (servicio grandes consumos), 6 (demanda en punta) y 7 (demanda fuera de punta).

### 11.2 Demanda

**Demanda contratada** (`clsConsumosAFacturar.cs:142-171`). Se busca en este orden:

1. `SERSOC_DEMANDASXPERIODO` para el mes del período y tipo de medición, si `SERSOC_EXTRAS.DEMANDAXPERIODO` está activo.
2. Si no hay registro, `SERSOC.DEC_CON` para el contratado general.
3. Si no, `MEDSOC.CONTRATADO` del tipo de energía.

**Modalidad de facturación** según `CATE_SER.GC_FACDEM` (`Facturacion_Facturar_Demanda`; `GC_FacturarDemanda`, `:3479-3678`). "Máx" es la demanda máxima registrada en el período. El precio base es `IMP_DEC` (concepto `COD_DEC`) y el de exceso o segunda demanda es `IMP_EDD` (concepto `COD_EDD`):

| Valor | Modalidad |
|---|---|
| 0 | Utilizada: tarifa máx DP y máx DFP con las filas de demanda de `CATTARIF` |
| 2 | Mayor entre utilizada y contratada, por DP y DFP, tarifado igual que 0 |
| 3 | Corregida: máx(DP, DFP, DV) hasta el contratado general a `IMP_DEC`; el excedente como exceso a `IMP_EDD` |
| 4 | Adquirida = media de máx DP y máx DFP |
| 5 | Adquirida = máx DP |
| 6 | Adquirida = máx DFP |
| 7 | Contratada (`IMP_DEC`) = máx(máx DP, máx DFP, máx DV, contratado general); demanda en punta (`IMP_EDD`) = máx(máx DP, contratada DP) |
| 8 | máx(máx DP, media DP y DFP) al precio DP de la tarifa; si la contratada DP es mayor, la diferencia como exceso |
| 9 | Contratada DFP a `IMP_DEC`; además tarifa máx DFP; si máx DFP supera la contratada, la diferencia a `IMP_EDD` |
| 10 | Utilizada y excedentes: tarifa máx DP y DFP y cobra la contratada no usada (contratada − máx, mínimo 0) como demanda corregida |
| 11 | Como 3, pero sin exceso siempre cobra el contratado |
| 12 | Fuera de punta = máx(máx DFP, máx DV, contratada DFP / 2); punta = máx(máx DP, contratada DP / 2) |
| 13 | Contratadas: DP a `IMP_DEC` y DFP a `IMP_EDD` |
| 14, 15 | Punta = máx(máx DP, contratada DP); fuera de punta = máx de DFP, DV y sus contratadas. En 14, los conceptos salen de las filas de tarifa DP y DFP/DV y es obligatorio que existan |
| 16 | Según tramas: cada fila de demanda (DP, DFP, DV) se tarifa por tramas con su concepto |
| 17 | Como 7, pero la punta solo toma la medida si supera la contratada en más de `PORC_ACTDEM`%; la adquirida cae al contratado general si no lo supera en ese porcentaje |

- **Prorrateo de demandas.** Con el parámetro 2928, se usa `GC_FacturarDemanda2` (`:3680-3926`). Cada demanda se divide por cuadro con los precios `IMP_DEC` e `IMP_EDD` de `HIS_CATE_SER`. Con el método 1 se prorratea la cantidad; con el método 3, el precio.
- **Actualización de la contratada** (`CATE_SER.ACT_DEM`, `:3331-3347`):
  - Si la demanda máxima del período supera `DEC_CON × (1 + PORC_ACTDEM / 100)`, se actualiza `SERSOC.DEC_CON`, se graba `FEC_DECCON` y, la primera vez, `PRIMER_TRANSGRESION`.
  - Con `ACT_DEM_UNI`, también se actualiza `MEDSOC.CONTRATADO` de DP y DFP. El valor original se conserva en `CON_ORIGINAL` y `FEC_ACTUALIZA_ORIGINAL` (`clsConsumosAFacturar.cs:173-195`).

### 11.3 Factor de potencia (coseno fi)

`GC_FacturarFactorPotencia` (`clsFacturacionServicio.cs:3928-4066`). La configuración está en `CATE_SER`: `METODO_FI`, `TOPE_COSFI`, `RCOS_FI` (concepto de recargo), `BCOS_FI` (concepto de bonificación), `NCOS_FI` (no bonificar), `CFIJ_COS` (incluir el cargo fijo en la base) y `BASE_COSFI`.

```
tgφ  = reactiva total / activa total    (activa con o sin inyectada según el param 2737)
base = Σ neto de los ítems de energía y demanda (cantidad ≥ 0)
       (BASE_COSFI = 1: solo energía; el conjunto de subtipos varía según GC_FACDEM)
       + cargo fijo si CFIJ_COS
```

| `METODO_FI` | Regla |
|---|---|
| 1, coseno | cosφ = cos(atan(tgφ)), con piso en el parámetro 2659. Si cosφ < tope: recargo = base × tope / cosφ − base. Si cosφ > tope y no `NCOS_FI`: bonificación = −(base − base × tope / cosφ) |
| 2, tangente | Si tgφ > tope: recargo = red2(tgφ − tope) × K × base, con K = parámetro 2375 (1,5 si es 0) |
| 3, tangente por franja | Por franja horaria: tg = red2(R / A) de la franja. Si supera el tope: (tg − tope) × 1,5 × neto de la energía activa de esa franja. Concepto `CATTARIF.COD_PRO_REC` de la fila reactiva, o `RCOS_FI` |
| 4, tangente con VAD | Si tgφ > tope: (base + VAD) × 1,5 × ⌊20 × (tgφ − tope)⌋ / 100. El VAD es la suma de los cargos adicionales con productos de tipo 20 (valor agregado de distribución), evaluados por fórmula (`GetTotalVAD`, `:4068-4131`) |
| 5, coseno 2 | Si cosφ < tope: base × (tope − cosφ) × K, con K = parámetro 2407 |

- El ítem es subtipo 5 de servicio. En `ITEMSFAC_EXTRAS` se guardan el método, el tope, la marca de no bonificar y el coseno calculado. Si no hubo recargo, esos datos se adjuntan al primer ítem de energía.
- No se calcula si no hay lecturas reactivas o si la activa es 0.
- La fórmula `Factura_Coseno` expone el coseno calculado a los cargos adicionales.

---

## 12. Cargos adicionales y fórmulas

### 12.1 Definición (`CARGOS_ADICIONALES`, histórico por cuadro en `HIS_CARGOS_ADICIONALES`)

| Campo | Significado |
|---|---|
| `DESDE`, `HASTA` | Vigencia del cargo; fuera de ella la fórmula de importe vale 0 |
| `ORDEN` | Orden de evaluación |
| `COD_SER` | Servicio al que aplica |
| `COD_TPFC` | Tipo de factura (vacío = todos) |
| `FINAL` | 0: se evalúa por servicio antes de armar la factura; 1: sobre la factura armada |
| `TIPO` | 0 cargo, 1 recargo, 2 impuesto, 3 recargo proporcional en ítems |
| `SUMA` | Si es falso, el importe se resta (bonificación) |
| `COD_PROD`, `COD_IMP` | Concepto del ítem resultante |
| `SUBTIPO_CARGO` | 1 cargo adicional, 2 se registra como cargo fijo, 3 parte de la tarifa |
| `AFECTACION`, `COD_SER_AFECTA` | A qué ítems afecta un recargo |
| `GRUPO_FACTURA`, `GRUPO_CERO` | Emitir el cargo en una factura aparte |
| `APLICA_UNA_VEZ` | Una sola vez por cuenta en el lote (solo se controla en cargos finales; ver 12.6) |
| `FORMULA_FIL`, `FORMULA_IMP`, `FORMULA_CAN`, `FORMULA_BI` | Fórmulas de filtro, importe unitario, cantidad y base imponible |

### 12.2 Evaluación

`GetCargosFormula` (`clsCargosAdicionales.cs:992-1139`) arma, por cargo y en orden, estas variables:

- `Valor_CargoUnitario.<nombre>` = si (servicio = `COD_SER` y `FORMULA_FIL`) entonces `FORMULA_IMP`, si no 0.
- `Cantidad_Cargo.<nombre>` = `FORMULA_CAN`, y `Valor_Cargo.<nombre>` = unitario × cantidad.
- `BaseImp_Cargo.<nombre>` = `FORMULA_BI`.
- `TotalAnterior.<nombre>` = suma de los unitarios de los cargos anteriores.

Cada fórmula puede referenciar los valores de los cargos previos. Las fórmulas son expresiones del motor de criterios de DevExpress con funciones propias (sección 12.4).

### 12.3 Aplicación del resultado

`clsCargosAdicionales.GetItems`; por servicio en `:560-680` y por factura en `:682-829`:

- **Cargo (0).** Ítem Producto con cantidad y precio. El subtipo es 15, o 10 si se registra como cargo fijo, o 16 si es parte de la tarifa. Lleva base imponible y categoría.
- **Recargo (1).** No crea ítem: multiplica `PrecioUnitarioSIVA` de los ítems afectados por `1 + valor / neto afectado`. Los afectados son los ítems del producto `COD_PROD` o los ítems de servicio de `COD_SER_AFECTA`. Con valor negativo es un descuento porcentual implícito.
- **Impuesto (2).** Ítem de tipo Impuesto con el importe en "otros impuestos" y su base imponible. No lleva IVA.
- **Recargo proporcional en ítems (3, solo cargos finales).** Distribuye un importe sobre todos los ítems no cuota, incluidos los impuestos y el IIBB:
  - Escala los productos de tipo impuesto (tipos 8 a 10) y los ítems de impuesto.
  - Para el resto, emite un ítem del concepto por cada alícuota de IVA con la diferencia.
  - Bonifica proporcionalmente el IIBB (`Bonificacion_IIBB`).
  - Ajusta centavos para que el total cierre con el objetivo.
- **Factura aparte.** Los cargos con `GRUPO_FACTURA` o `GRUPO_CERO` se acumulan para emitirse en una factura separada.

### 12.4 Datos y funciones disponibles en las fórmulas

**Campos del contexto por servicio** (`DatosFormula`, `clsCargosAdicionales.cs:77-400`):

- Cuenta: situación de IVA y de IIBB, domicilio, conjunto.
- Servicio: código, categoría, zona, localidad, actividad, clase con sus valores, fechas de alta y baja, antigüedad, cantidad de facturas, lecturas y fechas anterior y actual.
- Factura: consumo total (cantidad de ítems de subtipo 1 y 2), cargo fijo (neto de subtipo 10), días de consumo, período, cuadro, coseno.
- Categoría: factura mínima (`FMINIMA`) y `Categoria_ConsumoMinimo`. Corrección de segunda pasada: este campo devuelve `CATE_SER.IMP_CMINM`, es decir el precio por unidad faltante del consumo mínimo, no las unidades mínimas `IMP_MINM` (`clsCargosAdicionales.cs:162-164`).
- `Consumo_Proporcional`.

**Funciones propias** registradas en `RegistrarFormulas` (`clsCargosAdicionales.cs:877-991`; implementación en `clsFormulas_CargosAdicionales.cs`):

- Sumas de cantidad e importe por servicio, producto o impuesto, por cuenta y por trama: `Suma_Importe_Servicios`, `Suma_Cantidad_Productos_Cta`, etc.
- Mínimos y máximos.
- Total facturado anteriormente y total de la factura anterior.
- Deuda y cantidad de comprobantes adeudados.
- Consumos históricos: `CargarConsumos`, `BuscarConsumo`, `DiasConsumo`.
- Simulación del servicio con otro cuadro: `TotalSimulacionCuadro` y su variante para grandes consumos.
- Campos de cuenta, socio, servicio, medidor, tarifa y categoría.
- Cotización de moneda.
- `TieneServicioActivo` y `CantidadServicios`.
- Datos de los ítems: `GetPrecioCosto`, `GetPrecioPIST`, `GetPrecioCF_Subsidio`, `GetPrecioSubsidio`, `GetPrecioCostoTotal`, `GetPrecioUniformeGas`, prorrateos y `GetProporcionalAltaBaja` (`clsFormulas_CargosAdicionales.cs:3484-3758`).
- Funciones definidas por la cooperativa como procedimientos almacenados con prefijo `FORMULA_CARGO` (`clsCargosAdicionales.cs:962-990`).

### 12.5 Motor de evaluación de las fórmulas (segunda pasada)

Las fórmulas no se interpretan con un motor propio. Se cargan como **columnas calculadas (unbound) de una grilla DevExpress en memoria**, que nunca se muestra, y el valor de cada cargo es el valor de la celda (`ReglasNegocio/ReglasNegocio.Varios/clsEditorFormulas_Extensions.cs:85-195` y `:283-349`).

- **Filas.** Hay una fila por cada dato en proceso:
  - Fase servicio: un `DatosFormula` por cada servicio facturado que tenga ítems y no tenga error (`ResolucionFormulas`, `clsFacturacionMasiva.cs:115-145`). La columna clave es `Servicio_IdSerSoc` y la descripción, `Nombre` (`clsFacturacionMasiva.cs:1128-1145`).
  - Fase factura: un `clsComprobanteFactura` por comprobante armado. La columna clave es `Index` y la descripción, `Cod_Sum` (`clsFacturacionMasiva.cs:1268`).
- **Columnas de datos.** Cada propiedad pública simple de la fila (texto, numérica, lógica o fecha) se convierte en una columna `[Factura.<Propiedad>]`. Por ejemplo, `[Factura.Servicio_Codigo]` o `[Factura.Total]`. Los valores se copian al cargar la grilla, así que son una **foto previa a la aplicación de cargos** (`clsEditorFormulas_Extensions.cs:132-174`). En la fase factura no se expanden los subobjetos del comprobante (`NoCargarSubtiposGenericos`).
- **Columnas de variables.** Cada cargo agrega las variables de 12.2. Se referencian por nombre entre corchetes, por ejemplo `[Valor_CargoUnitario.Tasa municipal]`. El nombre del cargo (`DES_CAR`) es parte del identificador. Por eso no admite los caracteres `[ ] { } + * ^ > < = ! & ; : # | " \`. El ABM rechaza esos caracteres con *"Los nombres de los Cargos Adicionales no pueden contener ninguno de los siguientes caracteres..."* (`ReglasNegocio/ReglasNegocio.Varios/clsFormulas.cs:171-174`; `Configuracion/Configuracion.Forms.Abms/abm_CargosAdicionales.cs:405-411`).
- **Funciones.** Están disponibles las funciones estándar del lenguaje de criterios de DevExpress (aritmética, comparaciones, `iif`, `IsNull`, redondeo, fechas y texto) y las funciones propias de 12.7. Las funciones propias **no leen la foto**. Leen los objetos vivos de la lista estática `clsFormulas.lstDatosEnProceso` (`clsFormulas.cs:169`; se asigna en `clsEditorFormulas_Extensions.cs:175`).
- **Registro.** `RegistrarFormulas` primero desregistra **todas** las funciones personalizadas del registro global de DevExpress y después registra el juego de la fase (`clsCargosAdicionales.cs:877-991`). Al ser un registro estático de proceso, no se pueden correr en paralelo una fase servicio y una fase factura en el mismo proceso.
- **Errores.** Cada celda que resulta en `#Err` se acumula con el nombre de su columna. Si hay al menos una, la facturación del lote se aborta con el mensaje *"Se ha producido una inconsistencia al generar la Factura de la cuenta X. Error en ..."* (`clsEditorFormulas_Extensions.cs:321-347`; `clsFacturacionMasiva.cs:1175-1179`, `:1273-1277`).

**Selección de cargos** (`GetCargosFormula`, `clsCargosAdicionales.cs:993-1022`; llamado desde `clsFacturacionMasiva.cs:310-313`):

- Fuente: `CARGOS_ADICIONALES`, o `HIS_CARGOS_ADICIONALES` del cuadro si se fuerza un cuadro (`ForzarCuadro`, usado en simulaciones con cuadro).
- `ORDEN` menor que el orden pedido. En la facturación masiva el orden pedido es el máximo entero, así que entran todos. En el editor, solo entran los cargos anteriores al que se edita.
- `FINAL` igual a la fase. `COD_TPFC` igual al tipo de comprobante del lote o vacío.
- En la fase servicio, además, `COD_SER` debe estar entre los servicios que se facturan.
- Opcionalmente, solo los cargos cuyo producto es de un tipo dado (se usa para el VAD, tipo de producto 20).
- Orden de armado: por `COD_SER` y luego por `ORDEN`. `TotalAnterior.<n>` suma los `Valor_CargoUnitario` de **todos los cargos armados antes**, aunque sean de otro servicio (`:1023-1100`).

**Armado de cada variable** (`:1028-1101`):

- Importe unitario: `iif(([Factura.Servicio_Codigo] == COD_SER) && (FORMULA_FIL), FORMULA_IMP, 0)`. Si el cargo está fuera de vigencia, la fórmula es directamente `0`.
- `BaseImp_Cargo` solo existe si `FORMULA_BI` no está vacía. `Cantidad_Cargo` y `Valor_Cargo` solo existen si `FORMULA_CAN` no está vacía.
- La condición de servicio se agrega también a los cargos finales. Pero la fila de la fase factura (`clsComprobanteFactura`) no tiene la propiedad `Servicio_Codigo`, así que un cargo final con `COD_SER` cargado daría `#Err`. **[VERIFICAR]** que en las bases piloto los cargos finales tengan `COD_SER` vacío.

**Doble control de vigencia:**

1. Al armar la fórmula (12.5) se exige `DESDE ≤ FechaVigencia ≤ HASTA`. `FechaVigencia` es `FechaVigenciaCuadro` del lote o, si no hay, la fecha del día (`clsFacturacionMasiva.cs:312`).
2. Al aplicar (12.3) se exige que el rango `DESDE`–`HASTA` se superponga con el **mes calendario de la fecha del sistema**. No se usa el período facturado (`clsCargosAdicionales.cs:582`, `:693`; mes pasado desde `clsFacturacionMasiva.cs:1191`, `:1281`).

Si el cargo no tiene marca de vigencia, el ABM le asigna 1900-01-01 a 2200-01-01. Si se marca vigencia, propone el mes actual (`abm_CargosAdicionales.cs:380-394`). **[VERIFICAR]** el efecto al refacturar o facturar un período atrasado con cargos de vigencia mensual.

**Momento de evaluación.** En la fase servicio, la masiva pide los resultados de cada servicio al procesarlo (`GetResultados(..., servicio)`, `clsFacturacionMasiva.cs:1175`). Antes de eso aplica los cargos de los servicios anteriores. Consecuencias:

- Todas las variables de un mismo servicio se evalúan **antes** de aplicar cualquiera de sus cargos. Un recargo de orden 1 no modifica la base que ve el cargo de orden 2. Los cargos solo se encadenan mediante referencias explícitas a las variables de otros cargos o mediante `TotalAnterior`.
- Las funciones que leen ítems vivos, como `Suma_*_Cta`, sí ven los cargos que ya se aplicaron a servicios anteriores de la misma cuenta. **[VERIFICAR]**: esto depende de que DevExpress calcule la celda al pedirla y no la guarde de antes.
- El editor avisa que, si un cargo usa `TotalSimulacionCuadro`, conviene ponerlo al final del orden (`abm_CargosAdicionales.cs:453-456`).

### 12.6 Aplicación: detalles verificados (segunda pasada)

Estos detalles completan 12.3 (`clsCargosAdicionales.cs:560-829`):

- **Importe y cantidad del ítem.** El precio del ítem es el primer valor de la variable cuyo nombre empieza con `Valor_Cargo`. Como `Valor_CargoUnitario` se agrega primero, el precio es el unitario. La cantidad es `Cantidad_Cargo` (1 si no hay fórmula de cantidad) y la base imponible es `BaseImp_Cargo` (0 si no hay fórmula). Si el unitario da 0, no se genera nada. Con `SUMA` falso se cambia el signo del unitario (`:563-600`).
- **Cantidad 0.** Si la fórmula de cantidad da 0 y el unitario es distinto de 0, el código igual crea el ítem, con cantidad 0. **[VERIFICAR]** si el comprobante lo rechaza después en la validación de ítems.
- **Impuesto.** Usa solo el unitario como importe ("otros impuestos"). Ignora la fórmula de cantidad.
- **Datos del ítem de cargo en la fase servicio.** Lleva `IdSersoc`, la categoría del servicio y `ItemRel` = `COD_SER`. El subtipo depende de `SUBTIPO_CARGO`: 2 da cargo fijo de servicio medido, 3 da parte de la tarifa y cualquier otro valor da cargo adicional. En la fase factura el ítem no lleva servicio ni categoría.
- **Recargo con `AFECTACION = 0`.** Afecta los ítems Producto de `COD_PROD`.
  - En la fase servicio, si no encuentra ítems Producto, toma cualquier ítem con ese código de producto. Por ejemplo, los ítems de servicio cuyo concepto es ese producto.
  - En la fase factura no hay ese respaldo.
  - Con `AFECTACION ≠ 0` afecta los ítems de servicio de `COD_SER_AFECTA`, o de `COD_SER` si `COD_SER_AFECTA` está vacío.
- **Tipo 3 en la fase servicio.** No tiene rama de aplicación: se ignora sin error.
- **`APLICA_UNA_VEZ`.** Solo se controla en la fase factura. Si el cargo ya se aplicó a la cuenta en el lote, el código **corta el recorrido** (`break`), así que también se omiten los cargos de mayor orden de esa factura (`:702-706`). Ver duda 17.
- **Cuenta sin datos.** Si un servicio no tiene `DatosFormula`, lanza *"Se ha producido una inconsistencia al obtener la cuenta..."*.
- **Recargo proporcional (tipo 3, fase factura):**
  - Base = Σ (neto con IVA + IIBB + otros impuestos) de los ítems que no son Otros ni cuota (`IdCuota = 0`).
  - Objetivo = red2(base + valor).
  - Factor = 1 + valor / base. Se aplica a los productos de tipo 8 a 10 y a los ítems de impuesto de subtipo 0. La bonificación de IIBB se redondea a 4 decimales.
  - La diferencia del resto se acumula por `Cod_Ali` y genera un ítem por alícuota. Si la alícuota es 0, se redondea a `DecimalesRedondeo`.
  - Ajuste de centavos: si |total − objetivo| está entre 0,004 y 0,02 y `DecimalesRedondeo ≠ 0`, se corrige un ítem del concepto con IVA 0. El ítem queda marcado en `COD_FAC` con "1" si se ajustó o "2" si no fue posible (`:760-827`).

### 12.7 Catálogo de funciones propias (segunda pasada)

**Alcance por fase** (`RegistrarFormulas`, `clsCargosAdicionales.cs:877-961`):

- **Ambas fases:** `Suma_*`, `Minimo_Concepto`/`Maximo_Concepto`, `GetDeuda`, `GetDeuda_Cantidad`, `GetCampoCuenta`, `GetCampoSocio`, `Facturado_*`, `ToDatetime`, `Diferecia_Periodos`, `GetCotizacion_Moneda`, `GetCampoCategoria`, `GetCampoTarifa`, `GetCampoSersoc`, `GetCampoSersoc_Cuenta`, `GetCampoMedSoc`, `TotalSimulacionCuadro` (y sus variantes `_Cta`, `_GC`, `_GC_Cta`), `TieneServicioActivo` y las constantes del lote `Secuencia`, `ConsumoDesde` y `ConsumoHasta` (`clsFormulas.cs:90-132`).
- **Solo fase servicio:** `TotalNetoConsumo`, `TotalNetoConsumo_TLL`, `TotalNetoConsumo_Tope`, `CargarConsumos` (por servicio), `BuscarConsumo`, `DiasConsumo`, `CantidadServicios`, `GetCantidad_Adherentes`, la familia de datos de ítems (`GetPrecio*`, `GetProrrateo*`, `GetProporcionalAltaBaja`) y `BuscarVariableInt(código)`. Esta última devuelve el parámetro `Busca_V2_int` de ese número (`clsFormulas.cs:134-167`).
- **Solo fase factura:** `TotalFacturaAnterior`, `CargarConsumos` (por cuenta) y `Get_Categoria_Servicio`.

**Convenciones comunes:**

- El primer argumento identifica la fila en proceso: `Id_Sersoc` en la fase servicio, `Cod_Sum` en las variantes `_Cta`, o `Index` del comprobante en la fase factura. Las funciones buscan esa fila en `lstDatosEnProceso`.
- Los argumentos variables finales son listas de códigos de concepto, producto, servicio o categoría.
- Las funciones `GetCampo*` devuelven texto: la fórmula debe convertirlo para operar.
- Los métodos `IsValidOperandCount`, `IsValidOperandType` y `ResultType` de cada clase solo declaran aridad y tipos para DevExpress. Los desajustes encontrados se listan en las dudas.

Firmas y semántica (archivo `clsFormulas_CargosAdicionales.cs`):

- **`Suma_{Cantidad|Importe}_{Servicios|Productos|Impuestos}[_Cta](id, códigos...)`** (`Total_CanImp_SerProd`, `:16-335`):
  - Servicios: ítems de tipo Servicio de esos códigos de servicio.
  - Productos: ítems de cualquier tipo con esos códigos de producto.
  - Impuestos: ítems de tipo Impuesto con esos códigos de impuesto.
  - El importe es el neto sin IVA, salvo en impuestos, donde es el importe de otros impuestos.
  - `_Cta` suma sobre todas las filas en proceso de la cuenta, es decir, todos sus servicios del lote.
- **`Suma_Importe_Servicios_XTrama[_Cta](id, servicio, tramaDesde, tramaHasta, cuadro, precioTotal)`** (`:179-256`). Para cada ítem del servicio con tarifa, busca la fila de `CATTARIF` (o de `HIS_CATTARIF` del cuadro, si cuadro > 0) del mismo código de tarifa con `CON_MIN ≤ tramaDesde` y `CON_MAX ≥ tramaHasta`. Devuelve `PRE_UNI` si `precioTotal` es 0, o `PRE_UNI × cantidad` si es 1. La aridad declarada es "más de 1", pero la función lee 6 operandos.
- **`Suma_Cantidad_Productos_PorCategoria(id, categoría, productos...)`** (`:337-395`): cantidad de esos productos en los ítems de esa categoría.
- **`Maximo_Concepto` / `Minimo_Concepto[_Cta](id, concepto, tipoImporte, códigos...)`** (`:397-707`):
  - `concepto`: 1 producto, 2 servicio, 3 impuesto.
  - `tipoImporte`: 1 importe, 2 cantidad.
  - Calcula el máximo o mínimo por código y devuelve la **suma** de esos máximos o mínimos.
- **`CargarConsumos(id, servicio, tipoEnergía, desde, hasta, [estado], [obtener])`** (`:709-903`):
  - Toma `CONS_SER` del servicio con `FEC_ACT` en el rango. Con el tipo de energía "A" incluye también el tipo vacío.
  - Agrupa por suministro, servicio, tipo de energía y concepto.
  - `estado`: 0 todos, 1 sin facturar (sin `FACTURADO` y sin `ID_FAC`), 2 facturados.
  - `obtener`: 0 suma, 1 promedio, 2 menor, 3 mayor, 4 cantidad. Se calcula sobre los grupos, no sobre las lecturas.
  - En la fase servicio el primer argumento es `Id_Sersoc`; en la fase factura, la cuenta.
  - Ver duda 18 sobre la lectura de `estado`.
- **`BuscarConsumo(id, valorDesde, valorHasta, tipoEnergía, desde, hasta, soloConsecutivos)`** (`:905-1114`): cuenta las lecturas del rango de fechas con consumo entre `valorDesde` y `valorHasta`. Con `soloConsecutivos`, devuelve la racha consecutiva más larga.
- **`DiasConsumo(id, fechaDesde, fechaHasta, díasActual, [forzar])`** (`:1116-1251`):
  - Si `díasActual < 30` o se fuerza, busca lecturas divididas (`GRUPO ≠ 0`) sin facturar del rango y suma los días de todas las lecturas del mismo grupo. Los días van con signo negativo si el consumo es negativo.
  - Si no encuentra lecturas divididas, devuelve `díasActual`.
  - Si `díasActual ≥ 30` y no se fuerza, devuelve **60** fijo. Ver duda 19.
- **`Facturado_{Cantidad|Importe}_{Servicios|Productos|Impuesto}_Cta(cuenta, desde, hasta, tipoFactura, códigos...)`** y la variante **`..._Cta_XPeriodo_(cuenta, período, tipoFactura, códigos...)`** (`:1253-1552`):
  - Suma `ITEMSFAC.PRE_CAN` (importe) o `CAN_ITE` (cantidad) de las facturas de la cuenta con `FACTURAS.FECHA` en el rango, o del período indicado, y `TIPO = tipoFactura`.
  - Las notas de crédito (`DEB_CRE = 2`) restan.
  - **No excluye anuladas.** **[VERIFICAR]**
  - Con más de 10 servicios en proceso, precarga todas las cuentas del lote.
- **`TotalFacturaAnterior(id_sersoc, períodoActual, mesesAntes, servicio, cuadroSimular)`** (solo fase factura, `:1554-1724`):
  - Toma las facturas del período `períodoActual − mesesAntes` que tienen ítems del servicio para ese `ID_SERSOC` y no están anuladas.
  - Total de cada factura = `TOTAL1` + anticipo − ítems de cuota o financiación con su IVA. Las notas de crédito restan.
  - Si no hay facturas y el cuadro existe, simula la factura con ese cuadro (`SimularFacturasConCuadros`).
  - Se toma el total de la **factura completa**, no solo la parte del servicio. **[VERIFICAR]** en cuentas con varios servicios por factura.
- **`TotalSimulacionCuadro[_Cta](id|cuenta, servicio, consumo|fechaConsumos, cuadro, tipoFactura, sumarServicio, sumarIVA, productos...)`** (`:1726-1946`):
  - Factura el servicio con otro cuadro, sin grabar: usa un `clsFacturacionServicio` nuevo con `CuadroTarifario = cuadro`, cobra siempre el cargo fijo y factura el período 01/2200 para eludir el control de `ULT_FAC`. El consumo puede ser un número simulado o, si es una fecha, se usa como fecha de prepaga.
  - Devuelve la suma de los ítems del servicio (si `sumarServicio`) y de los productos listados, netos o con IVA (si `sumarIVA`). No incluye cargos adicionales.
  - Devuelve 0 si el cuadro no existe.
  - `_Cta` elige el primer servicio de la cuenta para ese código con `CONDICION ≠ 1`, ordenado por condición.
- **`TotalSimulacionCuadro_GC[_Cta](..., fConsumoDesde, fConsumoHasta, ...)`** (`:1948-2108`): igual que la anterior, pero toma los consumos reales del rango de fechas (`SimularConConsumosFacturados`). Pensada para grandes consumos.
- **`GetDeuda(cuenta, fechaHasta, tipoFecha, tipoFactura, incluirCréditos)`** (`:2110-2273`):
  - Suma `FACTURAS.SALDO` de los comprobantes con saldo distinto de 0, no anulados, con `FECHA ≤ fechaHasta` y con el vencimiento elegido `≤ fechaHasta`.
  - `tipoFecha`: 1 a 3 son `VTO1` a `VTO3`. Cualquier otro valor (incluido 0) usa `VTO4`.
  - `tipoFactura` 0 significa todos los tipos.
  - Si no se incluyen créditos, solo suma débitos. Si se incluyen, los créditos restan.
- **`GetDeuda_Cantidad(cuenta, fechaDesde|nulo, fechaHasta, tipoFecha, tipoFactura)`** (`:2275-2435`): cantidad de comprobantes con saldo, con los mismos filtros, sin distinguir débito o crédito. El caché por cuenta no incluye `tipoFecha` en la clave.
- **`TotalNetoConsumo(id_sersoc, clave)`** y **`TotalNetoConsumo_TLL(id_sersoc, tipoLlamada)`** (`:2437-2552`): suman el neto de las lecturas telefónicas del ítem por clave o por tipo de llamada (0 local, 1 urbana, 2 interurbana, 3 internacional, 4 operadora, 5 gratuita, 6 especial, 7 CPP).
- **`TotalNetoConsumo_Tope(id_sersoc, topeSegundos, claves...)`** (`:2554-2655`):
  - Si los segundos totales superan el tope, recalcula el neto desde `LLAMADAS` en orden cronológico hasta completar el tope y prorratea la última llamada.
  - El tope se convierte a entero, así que se truncan los decimales.
- **`Get_Categoria_Servicio(index, servicio)`** (solo fase factura, `:2657-2698`): mayor código de categoría de los ítems de ese servicio en el comprobante. La clase `GetCampoServicio` (`:2700-2741`) declara el mismo nombre pero no se registra: es código muerto.
- **`CantidadServicios(id_sersoc, servicio, buscarEnSocio, [soloActivos = verdadero])`** (`:2743-2806`): cantidad de servicios de ese código en la cuenta, o en todas las cuentas del socio. "Activos" significa `CONDICION` 2 o 3.
- **`TieneServicioActivo(cuenta, servicio, categorías...)`** (`:3929-4020`): indica si la cuenta tiene el servicio en condición 2 o 3 con alguna de las categorías indicadas. Devuelve un lógico aunque declara resultado entero.
- **`GetCampoCuenta(cuenta, campo)`** (`:2808-2860`) y **`GetCampoSocio(cuenta, campo)`** (`:2862-2928`): valor de una columna de `SUMSOC` o de `SOCIOS`, como texto.
- **`GetCampoSersoc(...)`** (`:2930-3041`): columna de `SERSOC`. En la fase servicio recibe `(id_sersoc, campo)`; en la fase factura, `(index, servicio, campo)`.
- **`GetCampoSersoc_Cuenta(cuenta, servicio, campo, [buscarEnBase], [soloActivos = 1])`** (misma clase, `:3042-3143`): columna del servicio de esa cuenta. Con `soloActivos` filtra `CONDICION` 1 o 2. Ver duda 20.
- **`GetCampoMedSoc(id|index, concepto, [servicio], campo)`** (`:3145-3258`): columna del medidor (`MEDSOC`) del servicio para ese concepto (`COD_CON`).
- **`GetCantidad_Adherentes(id, tipo)`** (`:3260-3305`): cantidad de adherentes (tipo 0) o beneficiarios (tipo 1) sin fecha de baja. Usa `Get_Servicio_CantidadAdherentes` y `Get_Servicio_CantidadBeneficiario` (`clsCargosAdicionales.cs:387-399`). Ver duda 21.
- **`GetCampoTarifa(catser, trama, campo, [concepto], [cuadro])`** (`:3307-3381`): columna de la primera fila de `CATTARIF` (o de `HIS_CATTARIF` del cuadro) con `CON_TMIN ≤ trama ≤ CON_TMAX`. Selecciona el tramo, no el escalón.
- **`GetCampoCategoria(servicio, categoría, campo, [cuadro])`** (`:3383-3482`): columna de `CATE_SER` o de `HIS_CATE_SER`.
- **Datos de ítems** (`:3484-3758`):
  - `GetPrecioCosto`, `GetPrecioPIST`, `GetPrecioCF_Subsidio` y `GetPrecioUniformeGas` reciben `(id_sersoc, [cuadro])`. Devuelven `PRE_CSI`, `COSTO_EPEC`, `IMP_CF_CON_SUBSIDIO` o `PRECIO_UNIFORME_GAS` de la tarifa del **primer** ítem con tarifa: del cuadro indicado, o sin cuadro.
  - `GetPrecioSubsidio` y `GetPrecioCostoTotal` reciben `(id_sersoc, [usarProporcionales])`. Devuelven Σ cantidad × `COSTO_SUBSIDIO` o × `PRE_CSI` de todos los ítems del servicio. Con 1, cada ítem de cuadro anterior usa `HIS_CATTARIF` de su cuadro.
  - `GetProrrateoActual` devuelve la primera fracción distinta de 0. Si no hay, devuelve 1, salvo que la suma de las fracciones anteriores supere 0,99, en cuyo caso devuelve 0.
  - `GetProporcionalAltaBaja` devuelve el factor proporcional del ítem, o 1 si no tiene.
- **Utilitarias** (`:3760-3927`):
  - `ToDatetime(texto)`.
  - `Diferecia_Periodos(p1, p2)`: meses de `p2 − p1`.
  - `GetCotizacion_Moneda(moneda, [fecha])`: usa `clsTipMon.GetCotizacion`.
- **Procedimientos almacenados** (`FuncionFromStoredProcedure`, `:4022-4160`):
  - Cada procedimiento de la base llamado `FORMULA_CARGO_<TIPO>_<Nombre>` (fase servicio) o `FORMULA_CARGOFINAL_<TIPO>_<Nombre>` (fase factura) se registra como función `<Nombre>`.
  - `<TIPO>` define el resultado: `INT`, `STR`, `DAT` (que se devuelve como texto), `DEC` o `BIT`.
  - Los parámetros son los del procedimiento; se exigen al menos esa cantidad de operandos. El resultado es la primera columna de la primera fila.
  - **[VERIFICAR]** el inventario de estos procedimientos en la base de LAG.

### 12.8 Mantenimiento de cargos adicionales (segunda pasada)

- **Nombre único.** `ExisteNombre` compara `DES_CAR` sin espacios y en mayúsculas, excluido el propio cargo. Para un cargo histórico compara solo contra los `HIS_CARGOS_ADICIONALES` del mismo cuadro (`clsCargosAdicionales.cs:428-436`). Si se repite, el ABM rechaza con *"Se ha detectado otro Cargo Adicional con el mismo nombre..."* (`abm_CargosAdicionales.cs:400-404`).
- **Referencias a cargos inactivos.** `ObtenerCargosAdicionalesInactivos` lista los cargos con `HASTA` anterior a hoy (`clsCargosAdicionales.cs:517-529`). El ABM impide guardar un cargo cuyas fórmulas de filtro, cantidad, importe o base referencian a un cargo inactivo (`abm_CargosAdicionales.cs:427-451`).
- **Otras validaciones del ABM** (`abm_CargosAdicionales.cs:412-426`):
  - Exige el producto o impuesto a imputar o afectar.
  - Exige el servicio cuando el campo está habilitado.
  - No permite marcar "grupo 0" e indicar un grupo a la vez.
- **Orden:**
  - Un cargo nuevo recibe `ORDEN = máximo + 1` (`abm_CargosAdicionales.cs:478-482`).
  - `ActualizarOrden` sube o baja un cargo intercambiando el orden con el vecino más cercano en esa dirección (`clsCargosAdicionales.cs:404-426`). El vecino se busca entre **todos** los cargos, sin filtrar por servicio ni por fase.
- **Clonado.** `Clonar_Cargo` crea el cargo con `COD_CAR = máximo + 1`, agrega "-(copia)" al nombre y le asigna `ORDEN = máximo + 1` (`:471-493`).
- **Renombre.** El nombre es parte de las variables, así que al renombrar un cargo `ActualizarNombreCargo` reemplaza `[<Prefijo>.<viejo>]` por `[<Prefijo>.<nuevo>]` en las cuatro fórmulas de todos los cargos vivos (`:495-515`). Contempla los prefijos `Valor_Cargo`, `Cantidad_Cargo`, `Valor_CargoUnitario`, `Totales_Anteriores` y `BaseImp_Cargo`. Ver duda 16. No actualiza `HIS_CARGOS_ADICIONALES`.
- **Búsqueda por referencia.** `ObtenerCargoPorReferencia` busca un cargo en este orden: código numérico, nombre exacto, nombre que contiene el texto y nombre en mayúsculas (`:443-469`).
- **Históricos.** Un cargo de un cuadro se edita como cargo vivo mediante `ConvertirHistorico`, y `GuardarCargoHistorico` copia los campos de vuelta a la fila `HIS_CARGOS_ADICIONALES` por `COD_HISCAR` (`:1141-1185`; `abm_CargosAdicionales.cs:484-490`). Así se pueden corregir las fórmulas de un cuadro ya cerrado. Eso afecta las simulaciones y prorrateos que usan ese cuadro.
- **Datos de prueba del editor:**
  - `GetDatosEjemplo` arma `DatosFormula` reales de los servicios elegidos: factura el período actual con los consumos de los últimos 5 meses, sin grabar (`:831-849`).
  - `GetDatosEjemplo_Factura` usa `SimularFacturas` (`:851-862`).
  - `GetFactura` simula una prepaga con el tipo de comprobante del parámetro 2243 ("Tipo de Comprobante para Facturar Prepaga") (`:864-875`).
- **Tablas de ayuda del editor.** `GetTablasFormula` (`:531-545`) ofrece estas tablas para elegir códigos: `SERVICIO`, `CATE_SER` del servicio, `OCUPACIO`, `PROD_SER` sin stock, `LOCALIDA`, `REFEREN`, `ACTAFIP`, `CLASESER`, `SITIVA` y `PROPIESER`.

### 12.9 Variables de contexto completas de la fase servicio (segunda pasada)

Se usan como `[Factura.<campo>]` (`DatosFormula`, `clsCargosAdicionales.cs:77-400`).

- **Cuenta y socio:** `Cuenta_Socio`, `Nombre`, `Persona_Ocupacion`, `Socio_Activo`, `Cuenta_Codigo`, `Cuenta_Conjunto`, `Cuenta_SituacionIVA`, `Cuenta_SituacionIIBB`, `Cuenta_Calle`, `Cuenta_Dom_Numero`, `Cuenta_Dom_Piso` y `Cuenta_Dom_Dpto`.
- **Categoría:** `Categoria_FacturaMinima` y `Categoria_ConsumoMinimo` (ver la corrección de 12.4).
- **Servicio:** `Servicio_IdSerSoc`, `Servicio_Codigo`, `Servicio_Codigo_Categoria` y `Servicio_Cod_CATSER`. Con el parámetro 3111 ("Usar categoría histórica de servicios fijos por mes vencido"), estos dos últimos toman la categoría del ítem facturado (`:170-191`). También:
  - Domicilio del servicio, `Servicio_Zona` (zona de lectura), localidad, referencia, actividad y clase con `Clase_Valor1/2` (`CLASESER`).
  - Propiedad y cantidad de facturas.
  - Fechas de alta, alta administrativa, baja y vencimiento.
  - `Servicio_Meses_Antiguedad_Alta`: días entre el alta y **la fecha del sistema**, dividido 30 (`:256-266`).
  - Fechas y estados de lectura actual y anterior. Por defecto, 1900-01-01 y 0.
  - `Servicio_FechaCuadro` (`SERVICIO.PRORRATEO_VIGENCIA`).
- **Factura:**
  - `Factura_Mensual`: siempre verdadero (`:316`).
  - `Factura_ConsumoTotal` y `Factura_ConsumoSimulado`.
  - `Factura_CargoFijo`.
  - `Factura_DiasConsumo`: suma de los días de las lecturas distintas del ítem.
  - `Factura_Periodo`, `Factura_Cuadro`, `Consumo_Proporcional` y `Factura_Coseno`.

**Variables de la fase factura.** Son las propiedades simples de `clsComprobanteFactura`. Entre ellas: `Index`, `Cod_Sum`, `Cod_Soc`, `TipoFactura`, `GrupoFactura`, `Fecha`, `FechaVto1` a `FechaVto4`, `Neto`, `IVA`, `OtrosImpuestos`, `Percepcion`, `Total` y `Total2` a `Total4`. También `Id_SerSoc` y `CodigoCategoria` (los máximos de los ítems), `ImporteAnticipo`, `ImporteItemsCuotas`, `Cod_CUA`, `Secuencia`, `Deb_Cre` y `Cotizacion`.

---

## 13. Franqueo

`AddFranqueo` (`clsFacturacionServicio.cs:1745-1777`). Se cobra el concepto `POSTALES.PRO_EPO` por `POSTALES.IMP_EPO` (subtipo 17) cuando se cumplen todas estas condiciones:

- La cuenta tiene un servicio de entrega (`SUMSOC.COD_EPO`) y no tiene `COB_EPO` activo.
- El concepto y el importe no son 0.
- No se cobró ya en el mismo período y secuencia (`PER_EPO`, `SEC_EPO`, que se actualizan al cobrar).
- El tipo de factura no tiene `NOFACTURAR_FRANQUEO`.
- Con el parámetro 2663: la cuenta no está adherida a factura electrónica (`FACTURAE = 1`) con algún correo cargado (`EMAIL`, `OTROS_MAILS` o `SUMSOC_EXTRAS.CORREO_WEB`).

Si el proceso indica "no facturar envío", se pasa un registro postal vacío y no se cobra.

---

## 14. Anticipos

`AgregarAnticipos` (`clsFacturacionServicio.cs:1523-1612`). Se aplican si el total de la factura es mayor que 0 y el proceso no indica "no aplicar anticipos" (`:1500-1513`).

- **Candidatos.** Anticipos de la cuenta con saldo (`ANTICIPOS.SDO_ANT > 0`) cuyo `TIP_ANT` está vacío o coincide con el tipo de factura. Los específicos del tipo se aplican primero.
- **Importe.** min(total, saldo). Si `PORC_APLIC` es distinto de 0 y de 100, se aplica ese porcentaje del total, siempre que difiera en más de $0,02 del mínimo.
- **Ítem.** Negativo, de tipo Otros, subtipo Anticipo, con el concepto del anticipo o el del parámetro 29. Se registra `ANTIFACTU` y se descuenta el saldo.
- **Anticipos de productos** (`TIPO = 1`). Solo con el parámetro 3038, y solo contra los ítems de la factura vinculados a los mismos presupuestos (`PRESUPU_COMPROBANTES`). El neto se calcula descontando el IVA de la alícuota del producto.

---

## 15. Redondeo

**Redondeo de ítems.** `TIPO_FAC.REDONDEO_ITEMS` fija los decimales de cada ítem (`DecimalesRedondeo`). Con esa configuración, el IVA se redondea por alícuota y los totales se recalculan (`ItemsComprobanteCollection.cs:39-86`).

**Redondeo del total** (`AgregarRedondeo`, `clsFacturacionServicio.cs:1614-1715`). Se ejecuta después de los anticipos si el total es mayor que 0. La configuración se toma del tipo de factura o de los parámetros globales según `TIPO_FAC.REDONDEAR`:

- 1: no redondear.
- 2: usar `REDONDEO_TIPO`, `REDONDEO_DECIMALES` y los conceptos `COD_PRO_REDANT` y `COD_PRO_REDACT` del tipo de factura.
- 0: usar los parámetros 742 (tipo de redondeo), 2097 (decimales), 2096 (concepto de redondeo anterior) y 2095 (concepto de redondeo).

Las cuentas con `SUMSOC_EXTRAS.EXCLUIR_REDONDEO` no se redondean, salvo cuando el redondeo es de prepaga.

Tipos de redondeo (`Facturacion_Tipos_De_Redondeo`):

| Tipo | Regla |
|---|---|
| 1, redondear decimales | Redondea los totales de los 4 vencimientos a N decimales, sin ítem |
| 2, cuenta corriente de redondeo | Ver detalle abajo |
| 3, decimales pares | Si los centavos son impares, ítem de −$0,01 sin cuenta corriente |

Detalle del tipo 2, cuenta corriente de redondeo. No aplica si la fecha de la factura coincide con el primer vencimiento, salvo en prepaga.

```
si hay saldo de redondeo previo (DEUDARED, o DEUDARED_TIPO si TIPO_FAC.COD_TPFC_REDONDEO):
    ítem +saldo con el concepto "redondeo anterior"; saldo = 0
objetivo = si decimales < 0: truncar al múltiplo de |decimales| (5, 10, 20, 50 o 100)
           si no: redondear a 2 decimales y luego hacia abajo a N decimales
           (en prepaga: el importe forzado, si la diferencia ≤ param 2342)
diferencia = total − objetivo
si diferencia ≠ 0: ítem −diferencia con el concepto de redondeo; guardar la diferencia como saldo
```

El total siempre se redondea hacia abajo y el resto se cobra en la factura siguiente. Los valores de decimales están en `Facturacion_Decimales_Redondeo`: −100, −50, −20, −10 y −5 son múltiplos; 0, 1 y 2 son decimales.

---

## 16. Medidor testigo

`SERSOC_EXTRAS.COD_TES` → `MED_TESTIGO`. Las lecturas del testigo están en `CONS_SER_TESTIGO` (`ObtenerConsumoMedidorTestigo`, `clsFacturacionServicio.cs:3403-3427`).

- Se suman las lecturas con `FEC_ACT` en el intervalo (desde, hasta], el mismo tipo de energía (activa y vacío son equivalentes) y el mismo concepto.
- El consumo del testigo **solo se usa para elegir el tramo**: la cantidad facturada sigue siendo la del medidor propio.
- Se usa en estos casos:
  - Tipo 2 con `TRAMA_DEC = 4` (`:2966-2973`).
  - Grandes consumos con modalidad 4 (sección 11.1).
  - Prorrateo con el cuadro anterior (`:3130-3137`).
  - Cargo fijo por trama (`:1941-1947`).
- Si el testigo no tiene lecturas, se usa el consumo propio.

---

## 17. IVA, percepciones e Ingresos Brutos

### 17.1 Alícuota de cada ítem

- **Ítems de servicio** (`ItemsComprobante.cs:514-537`):
  - Alícuota de IVA: la de la fila de tarifa (`CATTARIF.COD_ALI`) si existe; si no, `CATE_SER.COD_ALI`; si no, `SERVICIO.COD_ALI`.
  - Alícuota de IIBB: `CATE_SER.COD_ALB`, o en su defecto `SERVICIO.COD_ALB`.
- **Ítems de producto**: `PROD_SER.COD_ALI` y `COD_ALB`, más el porcentaje de percepción propio del producto (`PRE_PER`).

### 17.2 Cálculo

Lo dispara `RefrescarTotales` en cada alta de ítem (`clsComprobanteBase.cs:197-220`; `ItemsComprobanteCollection.RecalularIVA`, `ItemsComprobanteCollection.cs:98-198`; `clsTasaIVACollection.cs:64-112`). La situación de IVA de la cuenta (`SITIVA`) se cruza con la alícuota en `ALI_IVA_CF`, que define `POR_IVA`, `POR_IVA2` (segunda tasa) y `PER_IVA` (percepción).

```
IVA1 = neto × POR_IVA
IVA2 = neto × POR_IVA2                        (si > 0)
percepción IVA = (neto + IVA1) × PER_IVA       (o neto × PER_IVA si SITIVA.PERCEPCION_SOBRE_NETO)
   - si ALI_IVA_CF.PER_IVA = 0, se usa la percepción del producto, solo para responsables inscriptos
   - nunca se aplica a cuentas con SUMSOC.NO_COBRAR_PERCEPCION
   - la percepción de la factura se aplica solo si la suma ≥ SITIVA.MIN_PERCEPCION
     (Impuestos.cs:244-256)
```

- Los ítems con IVA fijo (`PrecioIVA_Fijo`) conservan ese IVA. Son, por ejemplo, las cuotas de financiación con su IVA original.
- **Percepción de IIBB** (`Impuestos.Calcular_IBR`, `Impuestos.cs:398-437`; `GetIIBB`, `:480-496`):
  - Aplica si la alícuota `ALI_IBR` es de "rendir en facturación" y la situación de IIBB de la cuenta (`SITIBR`) no es exenta.
  - Porcentaje: el de `ALI_IBR_CF` para el par (situación de IIBB, alícuota).
  - Se cobra solo si la suma de netos alcanzados de la factura llega a la base mínima `SITIBR.BASE` (`BaseIIBBAlcanzada`).
  - Variante con padrón por cuenta (`IIBB_LUA`) para el régimen RN 01/2017.
  - Con `ALI_IBR_COMP` (cálculo 2) para el comprobante, el IIBB también se calcula sobre el IVA.
- **Otros impuestos** (tasas municipales, fondos provinciales, etc.) no tienen un algoritmo propio en el cálculo de la factura. Se modelan como cargos adicionales de tipo Impuesto con fórmula y base imponible, normalmente condicionados por categoría o situación de IVA en `FORMULA_FIL` (sección 12). La tabla `IMPUESTOS_X_CAT` solo se mantiene desde `clsFacturacionVarios.cs:546-605`; no se encontró su uso en este cálculo.
- **Total de la factura** = Σ neto + IVA1 + IVA2 + percepción de IVA + otros impuestos + IIBB.

---

## 18. Bonificaciones, subsidios y tarifa social

No hay en el cálculo un concepto explícito de "tarifa social". Se resuelve combinando estas piezas:

- **Categorías específicas** (`CATE_SER`) con sus propias tarifas.
- **Consumo bonificado por servicio** (`SERSOC.CONS_BONIF`, sección 4.7).
- **Primer abono bonificado** (`SERSOC.ABO1BON`, sección 3.1).
- **Cargos adicionales con `SUMA = falso`**: bonificaciones con fórmula.
- **Columnas de subsidio en la tarifa.** `CATTARIF.COSTO_SUBSIDIO`, `IMP_CF_CON_SUBSIDIO`, `PRE_CSI` (costo) y `COSTO_EPEC` (PIST) no intervienen en el cálculo base. Las leen las fórmulas `GetPrecioSubsidio`, `GetPrecioCF_Subsidio`, `GetPrecioCosto` y `GetPrecioPIST`, con las que la cooperativa arma los ítems de subsidio o bonificación y la apertura de la tarifa (`clsFormulas_CargosAdicionales.cs:3647-3742`).
- **Bonificación o recargo del coseno fi** (sección 11.3).

---

## 19. Validaciones y errores

Mensajes que lanza el cálculo. Todos abortan el servicio o la cuenta.

**Categoría**

- *"El servicio X de la cuenta Y no tiene una categoría asignada..."* (`clsFacturacionServicio.cs:1268`).
- *"Categoría inválida..."* (`:1273`).
- *"No se pudo encontrar la categoría del consumo"* (`:1297`).

**Tarifas y tramas**

- *"No existe tarifa para el consumo realizado..."*, con variantes que indican cuadro, consumo, tipo de energía y concepto (`:2845`, `:2871`, `:2883`, `:3371`, `:3400`, `:3476`).
- *"No existe tarifa en el cuadro N (tercer prorrateo)..."* (`:2857`).
- *"Faltan tramas en la Categoría indicada"* (`:3113`).
- *"No existen tarifas en el cuadro tarifario a prorratear..."* (`:3127`).
- Errores de prorrateo por escalones no coincidentes (`:3153-3158`).

**Gas**

- *"No existe Factor para el periodo indicado..."* (`:1093`, `:1098`).

**Adherentes**

- *"No se encontró una Categoría para N Adherentes"* (`:2035`).

**Cuotas de obra e inmueble**

- *"Debe indicar el tipo de obra..."* (`:2448`).
- *"El servicio no tiene un inmueble relacionado..."* (`:2523`, `:2665`).
- *"El servicio no tiene un total de metros asignado..."* (`:2562`).
- *"El servicio no tiene un plan de pagos asignado..."* (`:2615`, `:2643`).
- Faltan índices de inflación (`:2597`, `:2601`).
- TBM o coeficiente zonal inválidos (`:2653`, `:2657`).

**Grandes consumos**

- *"No hay un concepto configurado para la tarifa de Demanda..."* (`:3618-3619`).
- *"No hay tarifa de Demanda en punta en la categoría X"* (`:3630`, `:3837`).
- *"Error al Calcular el VAD"* (`:4129`).

**Fórmulas** (facturación masiva)

- *"Se ha producido una inconsistencia al generar la Factura de la cuenta X. Error en ..."* (`clsFacturacionMasiva.cs:1178`, `:1276`).

**Comprobante** (`clsComprobanteBase.Validar`, `clsComprobanteBase.cs:222-226`)

- Cuenta, punto de venta, número o tipo inválidos.
- Sin detalles.
- Ítems con cantidad 0.
- Total negativo. En la facturación masiva, una factura negativa se convierte en nota de crédito antes de validar (`clsFacturacionMasiva.cs:1300-1317`).

**Errores sin mensaje propio**

- Si no existe el tramo, falla con una excepción genérica de secuencia vacía.
- Si falta la fila de tarifa de costo en gas bonificado, falla con una referencia nula.

---

## 20. Parámetros de configuración que condicionan el cálculo

Las descripciones son las del catálogo `clsVariables.cs` (`ReglasNegocio/CapaNucleo/`). L = lógico, N = numérico, C = carácter.

| Parámetro | Tipo | Descripción oficial | Efecto en el cálculo |
|---|---|---|---|
| 14 | N | Factor calórico óptimo | Divisor de la corrección de gas (4.4) |
| 19 | N | Concepto para facturar CPP | Concepto de las llamadas con clave 100 (10) |
| 24 | N | Concepto para facturar llamadas internacionales | Concepto de `INTERNAC` (10) |
| 29 | N | Concepto para anticipo | Concepto por defecto del ítem de anticipo (14) |
| 119 | Valores | Redondear consumo corregido en gas | Truncar, redondear a 0 decimales o solo dividir (4.4) |
| 527 | N | Situación de IVA de la empresa | Situación por defecto para buscar alícuotas |
| 543 | N | Código de impuesto para IVA | Distingue el IVA de otros impuestos al releer ítems |
| 544 | N | Situación de IVA para no categorizados | Siempre se aplica percepción; percepción sobre cuotas |
| 634 / 635 | N | Mínimo a pagar en factura eventual / luego de adjudicar vivienda | Porcentaje por cuota de vivienda si el plan no lo define (7) |
| 742 | Valores | Tipo de redondeo en facturas | Tipo de redondeo global (15) |
| 2095 / 2096 / 2097 | N | Redondeo: concepto, concepto anterior y decimales | Conceptos y precisión del redondeo global (15) |
| 2283 | N | Concepto para recargo en cambio de trama | Ajuste de prepaga (4.8) |
| 2330 | N | Operación técnica por cambio de categoría | Detecta la categoría histórica (5, con el 3111) |
| 2342 | N | Importe máximo de redondeo automático | Tope del redondeo de prepaga (15) |
| 2375 | N | Constante para el recargo por tangente | K del método 2 de coseno fi (por defecto 1,5) |
| 2407 | N | Constante para el recargo por coseno | K del método 5 de coseno fi |
| 2465 | L | Permite usar la marca "cobrar consumo mínimo en baja" | Restringe el consumo mínimo a conectados salvo `COBRAR_CM_BAJA` (4.5) |
| 2514 | L | Facturar consumo en 0 cuando no registre consumos de telefonía | Ítem en 0 en telefonía (10) |
| 2526 | L | Generar factura en 0 al facturar consumos | Emite la factura aunque el neto sea 0 si hubo lecturas (masiva) |
| 2659 | N | Tope mínimo para facturación de coseno fi | Piso del coseno calculado (11.3) |
| 2663 | L | No facturar franqueo si adhirió a factura electrónica | Ver 13 |
| 2701 | L | Tomar consumos pendientes de facturar al tomar consumo de otro servicio | Filtro con `REL_SER` (2) |
| 2737 | L | Incluir energía inyectada en el cálculo de coseno fi | Base activa del coseno fi (4.6, 11.3) |
| 2750 | C | Categorías para medidores compartidos (ids separados por coma) | Activa la multicategoría (3.3) |
| 2787 | L | Tomar día de reconexión para cálculo de proporcional | Fórmula del proporcional de alta (5.1) |
| 2821 | L | Permitir establecer cargos fijos por trama desde tarifas | `CATTARIF.IMP_CF` por tramo o escalón (3.2) |
| 2827 | L | Solo usar tramas proporcionales para determinar la trama grande | Escalones sin proporción y marca "Beneficio por Días" (4.2) |
| 2864 | L | No aplicar días proporcionales en consumos de menos días | Anula el factor por días (4.3) |
| 2876 | L | Generar ítem extra para guardar cuadro tarifario | Con consumo 0 y prorrateo (4.7) |
| 2928 | L | Permitir prorratear demandas en grandes consumos | Usa `GC_FacturarDemanda2` (11.2) |
| 3038 | L | Permitir usar anticipos de productos en facturación masiva | Anticipos de tipo 1 (14) |
| 3094 | N | Concepto para anticipo por energía inyectada | Deja en 0 la factura negativa del prosumidor (4.6) |
| 3103 | L | No usar energía inyectada para cargos fijos por tramas | Requiere el 2821 (3.2) |
| 3109 | L | Permitir venta de prepaga por 0 pesos | Simulación de prepaga con consumo 0 |
| 3111 | L | Usar categoría histórica de servicios fijos por mes vencido | Ver 5; también en las fórmulas |
| 3134 | N | Concepto para cobro por atraso en devolución de ortopedia | Cargo por días de atraso (1.2) |
| 3143 | L | Solo tomar consumos sin facturar al tomar consumos de otro servicio | Filtro con `REL_SER` (2) |
| 77 | L | Mover Stock al Registrar Venta | Validación de stock del ítem (23.3) |
| 208 | L | No permitir ventas con Stock 0 o Negativo | Stock insuficiente: error en lugar de confirmación (23.3) |
| 354 | L | No permitir ventas con Stock 0 o Negativo por depósito | Igual que el 208, por depósito (23.3) |
| 2068 | L | No permitir Ventas si el Stock Disponible se encuentra Pendiente de entrega | Bloquea si el stock está reservado (23.3) |
| 307 / 311 / 607 | N | Concepto para interés por Mora / interés Anterior / interés por financiación | Conceptos de los ítems de una cuota (23.3) |
| 2089 | N | Concepto para interés de comprobante de venta | Interés de cuotas de ventas no financiadas (23.3) |
| 2289 / 2512 | N | Producto para Diferencia de Cotización en Venta de Productos / Grupo de facturación para esos ítems | Ítem de diferencia de cotización de cuotas (23.4) |
| 2607 / 2624 | N | Concepto para bonificación de intereses en adelanto de cuotas (financiación / ventas) | Bonificación del interés al adelantar cuotas; sin configurar, no se bonifica (23.4) |

**Otros parámetros de la orquestación.** 2243 (tipo de comprobante de prepaga; también lo usa el editor de fórmulas para simular, 12.8), 2315 (cuentas por lote), 2413 (recargo o bonificación de prepaga en otra factura), 2443 (no facturar cuotas sin servicios) y 2549 (punto de venta 0).

**Banderas por entidad que también condicionan el cálculo:**

- **`SERVICIO`:** `TIP_CAL`, `COD_ALI`/`COD_ALB`, `COD_CF`, `COD_MON`, `PPERIODO`/`PERIODO`, `PROPORCION`, `VENCIDO`, `FAC_SIN_CONSUMO`, `REL_SER`/`USA_COT`, `PRORRATEO_*`, `TIP_OBRA`, `CAT_AUTO`, `MENORES`/`JUBILAD`/`DISCAPA`, `COE_ACTU1/2`.
- **`CATE_SER`:**
  - Cargo fijo: `CAN_CF`, `IMP_CF`, `COD_CF`, `COBRAR_CF_BAJA`.
  - Consumo mínimo: `COD_CM`, `IMP_MINM`, `IMP_CMINM`, `COBRAR_CM_BAJA`.
  - Proporcionales y tramas: `AP_TR_DIAS`, `DIAS_PROP`, `TRAMA_DEC`.
  - Prepaga y tipo de factura: `PREPAGA`, `COD_TPFC`.
  - Grandes consumos: `GC`, `GC_FACDEM`, `IMP_DEC`/`COD_DEC`, `IMP_EDD`/`COD_EDD`, `ACT_DEM`, `ACT_DEM_UNI`, `PORC_ACTDEM`.
  - Coseno fi: `METODO_FI`, `TOPE_COSFI`, `RCOS_FI`, `BCOS_FI`, `NCOS_FI`, `CFIJ_COS`, `BASE_COSFI`, `COD_CON_FRANJA`.
  - Agua según inmueble: `CUO_MIN1/2`.
  - Otros: `FMINIMA` (solo para fórmulas), `COD_ALI`/`COD_ALB`.
- **`CATTARIF`:** `CON_TMIN/CON_TMAX`, `CON_MIN/CON_MAX`, `PRE_UNI`, `PRE_CSI`, `IMP_CF`, `TIP_ENE`, `COD_CON`, `FRANJA`, `COD_PRO_REC`, `CAN_ADH`, `XUNID`, `COD_ALI`, columnas de subsidio.
- **`SERSOC`:** `COD_CATSER`, `CONDICION`, `ULT_FAC`/`SEC_PER`, `CANTIDAD`, `CONS_BONIF`, `ABO1BON`, `COEF_CORRECTOR`, `DEC_CON`, `FEC_ALTA`/`FEC_BAJA`, `FCT_OTR`.
- **`SUMSOC`:** `COD_SIT`, `COD_SIB`, `COD_EPO`/`COB_EPO`, `FACTURAE`, `NO_COBRAR_PERCEPCION`.
- **`SUMSOC_EXTRAS`:** `EXCLUIR_REDONDEO`.
- **`TIPO_FAC`:** `REDONDEAR`, `REDONDEO_TIPO`, `REDONDEO_DECIMALES`, `REDONDEO_ITEMS`, `COD_TPFC_REDONDEO`, `NOFACTURAR_FRANQUEO`.

---

## 21. Implicancias para GoodApps

Qué debe soportar el motor tarifario nuevo para no perder funcionalidad respecto de Procoop.

1. **Modelo tarifario versionado.** Cuadros tarifarios con vigencia que versionan servicio, categoría, tarifa, tarifa de adherentes y cargos adicionales. Hoy esto se logra copiando las tablas a `HIS_*` por cuadro. En GoodApps conviene una entidad "versión de tarifa" con fecha de vigencia y relaciones normales, en lugar de tablas espejo.
2. **Tarifa de dos niveles.** Selección del tramo por consumo total (`CON_TMIN/CON_TMAX`) y escalones progresivos dentro del tramo (`CON_MIN/CON_MAX`). También tarifa por bloque completo (tipo 1) e importe fijo por rango (tipo 4). Escalones negativos para la energía inyectada neta.
3. **Escalado por días y por factores.** Límites de tramos escalados por días/`DIAS_PROP`, por cantidad de unidades (`AP_TR_DIAS = 2`) y por potencia en kW (`FactorTrama`). El tramo puede elegirse con un consumo distinto del facturado (medidor testigo, consumo total de todos los conceptos).
4. **Prorrateo por cambio de tarifa** con hasta 3 versiones en un período, los 3 métodos (consumo, consumo continuando la trama, precio unitario) y opciones para prorratear también el cargo fijo, el consumo mínimo y las demandas. La fracción de cada versión debe quedar registrada en el ítem para auditoría y para las fórmulas.
5. **Componentes estándar del cargo**, cada uno con su propio concepto facturable y regla de cobro:
   - Cargo fijo: una vez por período, con condición del servicio, proporcional de alta y baja, mes vencido o adelantado, por días o por tramo de consumo.
   - Consumo mínimo.
   - Bonificación de unidades.
   - Primer abono bonificado.
6. **Grandes usuarios.** Energía por banda horaria (concepto o franja), demanda en punta, fuera de punta y valle, demanda contratada por medidor o por período, con actualización automática de la contratada por exceso. Hay 16 modalidades de demanda: conviene modelarlas como estrategias configurables, no como un `switch`. Factor de potencia con 5 métodos, topes y constantes parametrizables.
7. **Gas.** Corrección de volumen por factor calórico mensual por categoría, presión y temperatura, coeficiente corrector por suministro y política de redondeo.
8. **Prosumidores.** Detección de energía inyectada, neteo, crédito valorizado por escalón negativo, opción de excluir la inyectada de la elección del tramo, del coseno fi y del consumo mínimo, y conversión del saldo negativo en crédito a favor.
9. **Servicios no medidos.** Importe fijo, por cantidad, adherentes (por cantidad, edad, vínculo y ocupación, con franquicia de N adherentes y recategorización automática), planes de cuotas de obra con avance de cuotas y unidades, coeficiente vigente e indexación por inflación, y agua por datos catastrales.
10. **Motor de cargos adicionales con fórmulas.** Es el mecanismo central de personalización de Procoop: impuestos municipales y provinciales, tasas, subsidios, tarifa social, apertura PIST/VAD, recargos y bonificaciones. Requisitos:
    - Lenguaje de expresiones seguro (no SQL libre) con orden de evaluación y referencia a cargos previos.
    - Fases "por servicio" y "sobre la factura".
    - Tipos cargo, recargo porcentual sobre ítems, impuesto con base imponible y prorrateo sobre ítems por alícuota.
    - Vigencia, filtro por tipo de factura, emisión en factura aparte y "una vez por cuenta".
    - Biblioteca de funciones equivalente: históricos de consumo y facturación, deuda, campos de entidades, simulación con otra versión tarifaria.
    - Versionado junto con el cuadro tarifario.
11. **Impuestos.** IVA por par (alícuota, situación fiscal) con doble tasa. Percepción de IVA con mínimo por factura, cálculo sobre neto o sobre neto más IVA, y exclusión por cuenta. IIBB por (alícuota, situación de IIBB) con base mínima, padrón por contribuyente y opción sobre IVA. Alícuota resoluble en cascada: tarifa, categoría, servicio.
12. **Post-proceso de la factura.** Franqueo (una vez por período, exención por factura electrónica), anticipos (por tipo de factura, porcentaje de aplicación, anticipos de productos), redondeo (por tipo de factura o global, a múltiplos, con cuenta corriente de redondeo que traslada la diferencia) y conversión de facturas negativas en notas de crédito.
13. **Trazabilidad.** Cada ítem debe conservar servicio, categoría, fila de tarifa aplicada, versión o cuadro, fracción de prorrateo, consumos asociados, factor proporcional y datos del coseno fi. Las fórmulas y la reliquidación dependen de esa información.
14. **Errores tipados y no bloqueantes.** El cálculo por servicio debe devolver errores de negocio identificables (falta categoría, falta tarifa, faltan tramas, falta factor de gas, falta índice) que no aborten el lote. Hoy algunos casos terminan en excepciones genéricas.
15. **Configuración explícita.** Los ~40 parámetros globales `Busca_V2_*` y las banderas por entidad deberían agruparse en configuración tipada por servicio o por tenant, con valores por defecto documentados. Varios campos están sobrecargados, por ejemplo `TRAMA_DEC` que significa una cosa en grandes consumos y otra en tipo 2; habría que separarlos.
16. **Simulación.** Facturar sin persistir (consumo simulado, simulación con otro cuadro, prepaga). El motor debe ser puro: no debe mutar `ULT_FAC`, `DEC_CON`, `CNT_CUOTAS_PAGAS`, saldos de redondeo ni anticipos hasta confirmar. Hoy esas mutaciones ocurren durante el cálculo y dependen de no grabar la conexión.

---

## 22. Dudas abiertas

1. **Factor proporcional en tarifa por bloque (tipos 1, 4 y 7).** En `FacturarConsumos_Medido` el factor días/`DIAS_PROP` multiplica el consumo **facturado**, no los límites (`clsFacturacionServicio.cs:2824-2829`). En tramas, en cambio, escala los límites. ¿Es intencional o es un error? Hay que validarlo con una cooperativa que use `AP_TR_DIAS = 1` con tipo 1.
2. **Prorrateo en 3 cuadros, métodos 1 y 2, tarifa por bloque.** El ítem del tercer cuadro usa el precio del segundo cuadro en lugar del tercero (`:2889-2892`). Parece un error.
3. **Método 2 en demandas prorrateadas.** `ItemsFacturar.AplicarProrrateo` solo contempla los métodos 1 y 3 (`:163-178`). Con el método 2, cada cuadro factura la demanda completa, con lo que se duplicaría. Hay que confirmar el comportamiento real.
4. **Precio de exceso en demandas prorrateadas.** En las modalidades 3, 11 y 13 con 3 cuadros, el exceso del tercer cuadro usa `IMP_EDD` del segundo (`:3728`, `:3738`).
5. **Demanda contratada por período.** `ConsumoPorCategoria.GetTotalContratado` busca `SERSOC_DEMANDASXPERIODO` por número de mes (`clsConsumosAFacturar.cs:148`). `clsConsumosAFacturar.GetTotalContratado` lo busca por período completo "MM/AAAA" (`:313`). ¿Qué formato se graba?
6. **Parámetro 119.** La enumeración admite redondeo a 2 y a 6 decimales, pero `clsFacturacionServicio` solo traduce los valores 2 y 3 (`:319-340`). Los valores 4 y 5 terminan en "solo dividir".
7. **Fórmula `Consumo_Proporcional` en baja.** Devuelve díasMes × díaBaja en lugar de una fracción (`clsCargosAdicionales.cs:343-346`). Si alguna cooperativa la usa, su cálculo sería incorrecto.
8. **Base del coseno fi.** Filtra ítems por número de `SubTipo` sin distinguir si el ítem es Servicio o Producto. Las numeraciones se solapan: el 3 es Demanda adquirida en servicios y Capital en productos; el 4, Demanda corregida y Percepciones; el 8, Exceso y Anticipo (`:3947-3960`). ¿Puede contaminarse la base en facturas mixtas?
9. **Cuotas de obra de agua** (`TipoCuotasObras.Agua`). No tienen algoritmo en `GetItemsCuota`: solo cobran el cargo fijo. ¿Se facturan exclusivamente por `GetFactura_ServicioCuotaAgua`?
10. **`IMPUESTOS_X_CAT`.** *Resuelta en la segunda pasada:* no interviene en el cálculo. Solo guarda qué productos y servicios se eligen para el informe "Impuestos facturados por categoría" (`clsInformes_Facturacion.cs:5216-5232`, `:6100-6122`). El detalle está en el documento 03, sección 12.
11. **Factura mínima.** `CATE_SER.FMINIMA` y el subtipo 12 (Factura mínima gas) existen, pero en el cálculo base solo se exponen a las fórmulas. ¿Todas las cooperativas la implementan como cargo adicional?
12. **Redondeo con cuenta corriente.** No se aplica cuando la fecha de la factura coincide con el primer vencimiento (`:1647-1650`). ¿Cuál es la razón de negocio? ¿Facturas de contado o de mostrador?
13. **Mutación de estado durante el cálculo.** `ULT_FAC`, `CNT_FAC`, `DEC_CON`, `MEDSOC.CONTRATADO`, planes de cuotas, saldos de anticipos y redondeo, y `PER_EPO` se modifican en memoria al calcular. Hay que confirmar que las simulaciones nunca persisten esos cambios y cómo se revierten si una factura del lote falla.
14. **Fórmulas por procedimiento almacenado** (prefijo `FORMULA_CARGO`). Son lógica de negocio fuera del binario. Hay que inventariarlas en las bases de las cooperativas antes de migrar.
15. **Tarifa social.** Confirmar con las cooperativas piloto si la resuelven por categoría, por cargos adicionales con `GetPrecioSubsidio` o con otro mecanismo externo, por ejemplo un padrón importado como propiedad del servicio.

**Dudas agregadas en la segunda pasada:**

16. **Renombre de cargos y `TotalAnterior`.** `ActualizarNombreCargo` reemplaza el prefijo `Totales_Anteriores` (`clsCargosAdicionales.cs:495-515`). Pero la variable que genera `GetCargosFormula` se llama `TotalAnterior`. Al renombrar un cargo, las referencias `[TotalAnterior.<viejo>]` quedan rotas y el lote termina en `#Err`. Tampoco se actualizan las fórmulas de los cuadros históricos.
17. **`APLICA_UNA_VEZ` con `break`.** En la fase factura, cuando un cargo de "una vez por cuenta" ya se aplicó, se cortan también todos los cargos finales posteriores de esa factura (`clsCargosAdicionales.cs:702-706`). Lo esperable sería saltear solo ese cargo.
18. **Operandos opcionales de `CargarConsumos`.** `estado` solo se lee si hay exactamente 6 operandos y `obtener` solo si hay 7 (`clsFormulas_CargosAdicionales.cs:872-873`). Por lo tanto, no se puede pedir a la vez "solo facturados" y "promedio": con 7 operandos `estado` vale siempre 0. Lo mismo ocurre en `GetCampoSersoc_Cuenta`: `buscarEnBase` solo se lee con exactamente 4 operandos (`:3056`).
19. **`DiasConsumo` devuelve 60.** Si los días actuales son 30 o más y no se fuerza, la función devuelve 60 fijo en lugar de los días reales (`clsFormulas_CargosAdicionales.cs:1116-1251`). ¿Supone facturación bimestral? **[VERIFICAR]** si LAG la usa.
20. **`GetCampoSersoc_Cuenta` con las fases invertidas.** En la rama de la fase factura, convierte los datos en proceso a `DatosFormula`; en la otra rama, a comprobantes (`clsFormulas_CargosAdicionales.cs:3060-3066`). Parece invertido. Si la conversión falla, la función no encuentra la fila en proceso.
21. **`GetCantidad_Adherentes` filtra por cuenta.** Es una función de la fase servicio, pero busca la fila en proceso comparando el primer argumento con `Cuenta_Codigo` (`clsFormulas_CargosAdicionales.cs:3288-3292`). Si se le pasa el `ID_SERSOC`, devuelve datos de otra cuenta o falla. Si se le pasa la cuenta y la cuenta tiene varios servicios, toma el primero.
22. **`Facturado_*` incluye anuladas.** No filtra `FACTURAS.ESTADO` (`clsFormulas_CargosAdicionales.cs:1253-1552`), a diferencia de `TotalFacturaAnterior` y `GetDeuda`. **[VERIFICAR]**
23. **Declaraciones de tipos inconsistentes.**
    - `GetDeuda_Cantidad` exige un entero en el operando de `fechaHasta`.
    - `GetCotizacion_Moneda` valida siempre el tipo del primer operando.
    - `TieneServicioActivo` declara un resultado entero pero devuelve un lógico.

    En la evaluación masiva no parece afectar, pero el editor puede marcar como inválidas fórmulas correctas.
24. **Vigencia de cargos contra la fecha del sistema.** La aplicación exige que la vigencia se superponga con el mes de hoy, no con el período facturado (12.5). Refacturar un período anterior podría omitir cargos de vigencia mensual.
25. **`HIS_SERVICIO_EXTRAS` desde `SERSOC_EXTRAS`.** Al crear un cuadro se copian los extras de los servicios contratados en lugar de los extras del servicio (`clsCuadros.cs:28`).
26. **Bonificación de consumo en la simulación.** En el constructor de simulación de `clsConsumosAFacturar` (`clsConsumosAFacturar.cs:259-282`) se resta la bonificación al consumo. Si el consumo es menor que la bonificación, `TotalConsumo_Bonificado` queda **negativo**. En el constructor real, el consumo no se reduce y la bonificación es la total o el consumo (`:244-255`). Las simulaciones (prepaga, `TotalSimulacionCuadro`) podrían diferir de la facturación real.
27. **Redondeo de "otros impuestos" a entero.** `ItemsComprobanteCollection.TotalOtrosImpuestos` con redondeo usa un redondeo sin decimales (`ItemsComprobanteCollection.cs:60`), a diferencia del resto de los totales.
28. **Base imponible de IVA en `AgregarItemIVA`.** El IVA de alícuota 1 toma como base el neto sin descuento y el de alícuota 2, el neto con descuento. Con descuento, el IVA 1 se recalcula como neto sin descuento × porcentaje × cantidad, y el neto sin descuento ya incluye la cantidad (`clsComprobanteFactura.cs:1988-2021`). **[VERIFICAR]** con un ítem de cantidad distinta de 1 y descuento.
29. **Asimetría en `clsEvolucionConceptos`.** La cantidad del segundo período excluye las filas con tipo de comprobante; la del primero no (`clsEvolucionConceptos.cs:161`, `:185`). La comparación de cantidades puede estar sesgada.

---

## 23. Reglas adicionales (segunda pasada)

Reglas de las clases auxiliares del cálculo que no estaban cubiertas en las secciones anteriores, agrupadas por clase. Los cargos adicionales y las fórmulas están en 12.5 a 12.9, y los cuadros tarifarios, en 6.4.

### 23.1 `clsConsumosAFacturar` (consumos que entran a la factura)

- **Constructor real** (`clsConsumosAFacturar.cs:222-257`):
  - Las fechas anterior y actual son la mínima y la máxima de las lecturas.
  - Los estados anterior y actual son los de la primera y la última lectura activa (tipo de energía "A" o vacío).
  - Marca la lectura como **dividida** si alguna tiene `GRUPO ≠ 0` y es una división automática, ya sea por la observación "DivisiónAutomática de consumos" o por `TIPO_GEN = 1`.
  - Bonificación (`SERSOC.CONS_BONIF`, 4.7): si el consumo activo es menor que la bonificación, todo el consumo queda bonificado y el consumo facturable es 0. Si no, la bonificación es la configurada.
- **Constructor de simulación** (`:259-282`): recibe el consumo como número, sin lecturas. Resta la bonificación de otra forma que el constructor real (duda 26).
- **Totales por tipo de energía** (`GetTotalConsumo`, `GetTotalConsumoInyectada`; `:284-305`). El tipo "A" incluye las lecturas sin tipo. La energía inyectada se totaliza aparte.
- **Demanda contratada** (`GetTotalContratado`, `:307-335`, y la versión por categoría `:142-171`):
  - Primero busca la demanda del período en `SERSOC_DEMANDASXPERIODO`.
  - Si no la encuentra: para el tipo "GENERAL" usa `SERSOC.DEC_CON`; para otro tipo, `MEDSOC.CONTRATADO` del tipo de energía.
  - Si tampoco hay datos, devuelve 0.
- **Actualización automática de la contratada** (`ConsumoPorCategoria.ActualizarContratado`, `:173-195`):
  - Si la demanda máxima registrada supera la contratada × (1 + porcentaje / 100), la contratada pasa a ser esa demanda máxima.
  - La primera vez guarda la fecha original y el valor original (`FEC_ACTUALIZA_ORIGINAL`, `CON_ORIGINAL`) y siempre registra la fecha de actualización.
  - Complementa 11.2.
- **Consumo por categoría** (`ConsumoPorCategoria`):
  - `AplicarFactorGas` recalcula el consumo activo total, descontada la bonificación, y el consumo sin inyectada después de corregir el gas (`:36-47`).
  - `GetTotalConsumo(tipo, franja, concepto)` usa el concepto −1 para todos (`:49-61`).
  - `GetMaximoConsumo` devuelve la lectura máxima (`:63-80`).
  - `GetConsumosXFranja` devuelve las lecturas cuyo concepto tiene esa franja horaria en la tarifa de la categoría (`:82-87`).
  - `GetConceptoConsumo` devuelve el primer concepto del tipo de energía, o nulo si no hay (`:89-102`).
  - `GetFranjas` devuelve las franjas no vacías de las tarifas que coinciden en concepto y tipo de energía (`:116-127`).
- **Reparto de lecturas por categoría** (`GetConsumosPorCategoria`, `:337-430`):
  - Asocia cada lectura con la categoría que tenía registrada.
  - Las lecturas tomadas de un servicio relacionado usan la categoría del `SERSOC` propio.
  - Con `ForzarCategoria`, todas van a la categoría forzada.
  - Las lecturas cuya categoría no está en la lista de categorías del servicio **se descartan sin aviso**. **[VERIFICAR]**
  - La bonificación de consumo se consume en orden, categoría por categoría.

### 23.2 `clsFacturacionServicio`: métodos no cubiertos antes

- **`AgregarRedondeoPrepaga`** (`clsFacturacionServicio.cs:1515-1521`). Solo agrega el redondeo de prepaga si el total es mayor que 0. Lo hace forzando el importe calculado (`RedondeoPrepaga` con importe forzado, ver 15).
- **`AgregaAnticipoyRedondeo`** (`:1500-1513`). Aplica anticipos y redondeo y, al final, recalcula los vencimientos.
- **Precios de vivienda** (`GetPreciosVivienda`, `:1005-1017`). Toma, por categoría, el último `PRECIOSVIV` con fecha menor o igual a hoy (8).
- **Valor de propiedad extra** (`GetValorPropiedadExtra`, `:1844-1867`). Lee el valor asignado en `PROPIEITEMS_ASIGNACIONES` y normaliza el separador decimal (el punto pasa a coma).

### 23.3 `ItemsComprobante` (ítem del comprobante)

**Importes:**

- Neto sin IVA = (precio − descuento unitario) × cantidad. Se redondea a `DecimalesRedondeo` si es distinto de 0. El neto sin descuento es precio × cantidad (`ItemsComprobante.cs:153-175`).
- El IIBB del ítem solo cuenta si la base de IIBB del comprobante está alcanzada.
- La percepción de IVA (`IVA3`) solo cuenta si la base de percepción está alcanzada (17.2).

**Constructores con regla** (`:300-738`):

- Desde un ítem de presupuesto: calcula el IVA con las tasas vigentes (`:300-322`).
- Desde `ITEMSFAC`: un ítem de impuesto cuyo `COD_IMP` es el parámetro 543 ("Código de IMPUESTO para IVA") se toma como IVA fijo; cualquier otro impuesto, como "otros impuestos" (`:346-394`).
- De producto (`:396-450`): toma las alícuotas del producto, salvo que se indique otra, y convierte el precio con la cotización si la moneda no es pesos.
- De producto con "importe incluye IVA": desglosa el neto desde el total (`:412-419`).
- De servicio por categoría: precio = `CATE_SER.PRE_UNI` y cantidad 1 (`:492-507`).
- De vivienda (subtipo 27): cantidad = porcentaje / 100 y precio = total / cantidad (`:472-490`).
- De cuota de financiación o de venta (`:601-738`):
  - Separa capital, interés de financiación, interés anterior e interés por mora.
  - Concepto del interés: el parámetro 607 cuando la cuota tiene componentes de financiación; si no, el 2089. El interés anterior usa el 311 y la mora, el 307.
  - Reparte el IVA en proporción.
  - Invierte el signo si el débito o crédito de la cuota difiere del comprobante.
  - Aplica percepción si la situación de IVA de la cuenta es la del parámetro 544.

**Validación** (`ValidarItem`, `:761-794`):

- Exige el producto (*"Debe ingresar un producto..."*) y una cantidad mayor que 0 (*"La cantidad ingresada no es Valida..."*).
- Si el producto mueve stock y hay cantidad pendiente, valida el stock (`ValidarStock`, `:813-879`):
  - Con el parámetro 77, el stock insuficiente es error si está activo el 208 o si el producto tiene trazabilidad o es bien de uso. Si no, se pide confirmación.
  - El parámetro 354 aplica lo mismo por depósito.
  - Con el parámetro 2068, bloquea si el stock disponible está reservado por entregas pendientes.
- Un producto marcado como combo **no se valida**. En los demás, se valida el producto y también los componentes que tenga cargados (`:778-791`). **[VERIFICAR]** si es intencional que la venta de un combo no controle el stock de sus componentes.

`CargarPropiedades` (`:796-811`) toma del producto si registra stock (`LLE_STO`) y si requiere trazabilidad (`ID_REQUE`).

### 23.4 `ItemsComprobanteCollection` (colección de ítems)

- **Totales** (`ItemsComprobanteCollection.cs:15-86`):
  - El IVA se totaliza por alícuota, con redondeo por alícuota.
  - "Otros impuestos" incluye el IIBB y, con redondeo, se redondea a entero (duda 27).
  - `ForzarDecimalesRedondeo` propaga los decimales a todos los ítems (`:88-96`).
- **Recálculo de IVA** (`RecalularIVA`, `:98-198`):
  - Solo se recalculan los ítems nuevos (sin identificador). Los de IVA fijo conservan su IVA.
  - La percepción de las cuotas sale de la propia cuota, salvo en los subtipos 21 a 23. El resto usa el cálculo general de IIBB.
  - La percepción de IVA se aplica si la suma de las percepciones potenciales supera el mínimo (`AplicarPercepcionIVA`).
  - La base de IIBB queda alcanzada si Σ neto ≥ la mayor base mínima de los ítems.
  - Con descuento automático por tasa, la descripción del ítem agrega "(Sobre Productos al X%)".
- **Descuento porcentual** (`SetDescuento`, `:200-208`): descuento unitario = precio × % / 100 − recargo/descuento automático ya aplicado.
- **IVA por pago parcial** (`GetIVAVTA`, `:210-234`):
  - Agrupa el IVA por alícuota y tasa.
  - Si hay un importe de proporción, divide por un factor = total / importe de proporción. El total es con IVA y sin percepción, o sin IVA, según `ProporcionIncluyeIVA`.
- **Carga de una cuota** (`AddRange` con cuota, `:260-411`):
  - Omite las cuotas anuladas, ya facturadas o con estado "F".
  - Las cuotas de contado (cuota 0 de 0), o si se pide el detalle, se cargan con los ítems del comprobante de venta original. Si no, se carga el capital por alícuota. Sin IVA de venta registrado, usa la alícuota 4 por defecto. **[VERIFICAR]**
  - Al adelantar cuotas, el interés se bonifica con el concepto del parámetro 2607 (financiación) o del 2624 (ventas).
  - Si la cuota tiene moneda extranjera, agrega la diferencia de cotización con el producto del parámetro 2289 y el grupo de facturación del 2512.
  - Si el plan tiene índice de inflación, ajusta (capital + interés + IVA) × (índice de hace 2 meses / índice del mes anterior a la emisión − 1). Si falta un índice, lanza *"La cuota a facturar de la cuenta X tiene un ajuste por inflación asignado, pero no posee un índice para el período de emisión del plan (m/a)."* o su variante "para el período Actual".

### 23.5 `ItemIVA` y `clsComprobanteFactura.AgregarItemIVA`

`ItemIVA` es un registro con tipo, porcentaje, total y base imponible (`ItemIVA.cs`). `AgregarItemIVA` acumula por (tipo, porcentaje) (`clsComprobanteFactura.cs:1974-1986`). Desde un ítem que no sea impuesto, genera las filas de alícuota 1, alícuota 2 (si su porcentaje es mayor que 0) y percepción (si su porcentaje es mayor que 0) (`:1988-2021`). La base de la percepción es el neto con IVA menos la propia percepción. Ver la duda 28 sobre las bases y el recálculo con descuento.

### 23.6 `clsDetalleComprobante` (detalle de comprobantes de compra)

- **Recotización** (`clsDetalleComprobante.cs:322-392`):
  - Hay detalles recotizables si vienen de un pedido en moneda extranjera (`NPEDIDO.PES_DOL > 1`).
  - Al recotizar, costo nuevo = costo / cotización del pedido × cotización nueva.
- **Detalle simple** (`SetDetalleSimple`, `:394-424`):
  - Un precio negativo se registra como cantidad negativa con precio positivo.
  - La descripción sale del producto o del concepto de compra.
- **Clasificación del importe** (`CalcularPrecioUnitario`, `:444-494`):
  - Un producto o concepto va a gravado si tiene IVA o porcentaje distinto de 0; si no, a no gravado.
  - Una retención o percepción se clasifica como tal si el concepto es de IVA; si no, como impuesto.
  - Los impuestos y los otros créditos van a su propio rubro.
  - `Iva_No_Tomado` (`:274-291`) separa el IVA que no se computa como crédito fiscal.

### 23.7 `clsDetallesPendientes` (pendientes de pedidos de compra)

- El tipo de detalle sale de `CON_COM.TIPO`: 1 retención, 2 percepción, 3 impuesto, 5 otros créditos y cualquier otro valor, concepto (`clsDetallesPendientes.cs:104-162`).
- Faltante = solicitado − recibido (`:32-46`).
- **Cancelar ítems** (`:164-171`): pasa el saldo pendiente de cada ítem del pedido a "cantidad cancelada" y deja el saldo en 0.

### 23.8 `clsEvolucionConceptos` (informe de evolución entre dos períodos)

- **Variación porcentual** (`PorcentajeFacturado`, `clsEvolucionConceptos.cs:34-52`):
  - Si ambos períodos son 0, la variación es 0.
  - Si el primero es 0, es 100.
  - Si el segundo es 0, es −100.
  - En los demás casos, (nuevo − base) / base × 100.
- **Fuente de datos** (`:79-103`): movimientos de conceptos agrupados. Según la clase pedida, excluye las financiaciones o toma solo financiaciones. El tipo de fecha 2 se traduce a 3.
- **Agrupación** (`AgregarItemsMov`, `:134-193`): por cuenta o por concepto, con el titular. Ver la duda 29.

### 23.9 Informes relacionados con tarifas

- **`clsInformes_Consumos.Get_Informe_ConsumosTramasCuadro`** (`ReglasNegocio/ReglasNegocio.Consumos/clsInformes_Consumos.cs:6260-6287`):
  - Para un servicio y un período, reconstruye por consulta SQL el consumo y el neto de cada escalón. Excluye las energías R, DP y DFP.
  - Divide el consumo por el factor de demanda cuando corresponde y contempla los escalones de energía inyectada.
  - Usa la **tarifa viva** (`CATE_SER`/`CATTARIF`), no la del cuadro con que se emitió cada factura. **[VERIFICAR]** para períodos anteriores a un cambio de tarifa.
- **`clsConsumosTramasCategorias.Get_Informe_AgregadoTarifarioConceptosFilas`** (`ReglasNegocio/ReglasNegocio.Consumos/clsConsumosTramasCategorias.cs:426`): agrupa por fila de tarifa y cuadro, y cuenta usuarios, cuentas y facturas. No tiene regla de cálculo propia.

### 23.10 Métodos sin regla de negocio

Son accesores, cachés, armado de consultas para la interfaz o informes sin cálculo, o declaraciones de tipos para DevExpress:

- **Métodos varios:** `clsCargosAdicionales.DatosFormula.GetItems`, `GetCuenta` y `GetSersoc`; `clsCargosAdicionales.Get_Max_Orden`, `GetTablasFormula` y `AgregarItems` (solo recorre y delega en `GetItems`); `GetDatosEjemplo_Factura`; `ConsumoPorCategoria.GetConceptosEnConsumo` y `GetTotalContratado_old` (reemplazada por `GetTotalContratado`); `ItemsComprobante.GetProdser`; `clsDetalleComprobante.ContieneRemito` y `GetRemito`; `clsEvolucionConceptos.Cargar_Datos`; `clsConsumos.Get_DescripcionTarifas` (`ReglasNegocio/ReglasNegocio.Consumos/clsConsumos.cs:3135-3147`).
- **Informes:** `clsInformes_Consumos.Get_ConsumosCuadroTarifario` (`clsInformes_Consumos.cs:2285-2297`) arma una consulta que no ejecuta ni devuelve: es código muerto. `clsFacturacionServiciosTerceros.GetInforme_ConceptosObservaciones` y `GetInforme_DetallesObservaciones` (`clsFacturacionServiciosTerceros.cs:431-458`) son informes filtrados.
- **Declaraciones para DevExpress:** `IsValidOperandCount`, `IsValidOperandType`, `ResultType`, `Name`, `Description` y `Category` de las 30 clases de funciones de `clsFormulas_CargosAdicionales.cs`. Su contenido útil (aridad y tipos) está volcado en las firmas de 12.7 y en la duda 23.
