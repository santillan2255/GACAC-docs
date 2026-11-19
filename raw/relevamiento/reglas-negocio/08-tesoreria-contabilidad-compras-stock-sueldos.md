# 08 — Tesorería, contabilidad, compras, stock, fabricación y sueldos

Reglas de negocio del back-office administrativo de Procoop, extraídas del código descompilado. Todas las rutas se citan relativas a `binarios/decompilado/ReglasNegocio/` con la forma `Carpeta/Archivo.cs:línea`. Los parámetros se nombran por su número (`P2037` = `Nucleo.Busca_V2_*(2037)`); se guardan en la tabla `VARIABLE` (campos `NUMERICA`, `CARACTER`, etc.) y se consultan con `Busca_V2_Logica`, `Busca_V2_int`, `Busca_V2_Decimal`, `Busca_V2_Caracter` y `Busca_V2_Fecha`.

El código es de terceros: acá solo se describen reglas en prosa y pseudocódigo breve.

## Índice

1. [Visión general y mecanismos transversales](#1-visión-general-y-mecanismos-transversales)
2. [Tesorería](#2-tesorería)
3. [Retenciones a proveedores (Ganancias, IIBB, IVA, SUSS)](#3-retenciones-a-proveedores-ganancias-iibb-iva-suss)
4. [Órdenes de pago a proveedores](#4-órdenes-de-pago-a-proveedores)
5. [Contabilidad](#5-contabilidad)
6. [Asientos automáticos (“Cierre automático”)](#6-asientos-automáticos-cierre-automático)
7. [Compras: circuito SA → cotización → OC → remito → factura](#7-compras-circuito-sa--cotización--oc--remito--factura)
8. [Stock](#8-stock)
9. [Bienes de uso](#9-bienes-de-uso)
10. [Fabricación](#10-fabricación)
11. [Sueldos](#11-sueldos)
12. [Parámetros relacionados](#12-parámetros-relacionados)
13. [Implicancias para GoodApps](#13-implicancias-para-goodapps)
14. [Dudas abiertas](#14-dudas-abiertas)
15. [Reglas adicionales (segunda pasada)](#15-reglas-adicionales-segunda-pasada)

---

## 1. Visión general y mecanismos transversales

### 1.1 Cierre de módulos por fecha

Cada módulo tiene una “fecha de cierre” guardada en un parámetro de texto. Cualquier operación con fecha menor o igual a esa fecha se rechaza con un mensaje del tipo “La fecha de la operación es anterior a la fecha de cierre de …”. La lógica está en `Nucleo.ModuloCerrado` (`CapaNucleo/Nucleo.cs:5375-5432`) y las fechas se leen en `Nucleo.GetFechaCierre` (`CapaNucleo/Nucleo.cs:5327-5373`):

| Submódulo | Parámetro con la fecha de cierre |
|---|---|
| Compras | P500 |
| Facturación | P501 |
| Bancos | P502 |
| Financiaciones | P504 |
| Viviendas | P505 |
| Tesorería | P506 |
| Comprobantes de venta | P67 |
| Stock | P432 |
| Sueldos | P2376 |
| Titulares | P2785 |
| Bienes de uso | P2778 |

El submódulo **Contable** no usa una fecha: exige que exista un ejercicio (`CTEJER`) abierto (`ABIERTO = true`, sin `FEC_CIE`) que contenga la fecha (`Nucleo.EjercicioAbiertoALaFecha`, `CapaNucleo/Nucleo.cs:5434-5437`). Además existe P2528, una fecha de cierre contable adicional que valida `clsAsiento.Validar` (`ReglasNegocio.Contabilidad/clsAsiento.cs:767-780`).

Quién lo controla: anulación de OP (Compras y Tesorería, `ReglasNegocio.Compras/clsPagoFacturas.cs:724-733`), cierre de caja (`ReglasNegocio.Tesoreria/clsCajas.cs:425`), alta de comprobantes de compra (Contable, Compras y Stock, `ReglasNegocio.Facturacion/frmComprobantes_Handler.cs:1208, 1244, 1260`), asientos (`clsAsiento.cs:762`).

### 1.2 Contabilidad desacoplada

Ningún módulo operativo (compras, tesorería, stock, sueldos) escribe asientos en línea. Los asientos se generan después, en lote, con el proceso **Cierre automático** (`clsCierreDiario`, ver sección 6), que lee los movimientos de un rango de fechas y arma asientos resumidos o por operación. La única excepción son los asientos manuales e importados (`clsAsiento`).

### 1.3 Identificadores compuestos

Los comprobantes se identifican con claves de texto concatenadas, no con IDs surrogados:

- Orden de pago: `ID_PPAGO = proveedor(5) + tipoComprobante(4) + puntoVenta(4) + número(8)` (`clsPagoFacturas.cs:262`).
- Solicitud de aprovisionamiento: `ID_SAP = tipoComprobante(4) + puntoVenta(4) + número(8)` (`ReglasNegocio.Facturacion/clsSAprov.cs:121`).
- Factura de compra (`ID_IVACOM`), remito (`ID_COMPC`), OC (`ID_NPEDIDO`), cotización (`ID_SCOTIZ`): mismo patrón con proveedor adelante (`clsPagoFacturas.cs:386`, `clsSCotiz.cs:752`).

Los IDs numéricos internos (`COD_MOV`, `COD_ITA`, `ID_FPITEMS`, etc.) se obtienen con `GetMaxValue(tabla, campo) + 1`, sin secuencias de base de datos (p. ej. `clsPagoFacturas.cs:279`, `clsAsiento.cs:371`). Solo `MOV_PRO` usa una variante con bloqueo (`GetMaxValue_Boqueo`, `ReglasNegocio.Stock/clsMov_pro.cs:1226`).

### 1.4 Permisos por “controles”

Las acciones sensibles se validan con `Nucleo.Usuario.Valida_Controles("<código>")`. Códigos encontrados en estos módulos: `Anula_OP`, `Firma_OP`, `Entrega_OP` (OP), `autoriz_sa`, `elimina_sa`, `anula_sa`, `autoriza_sa` (solicitudes de aprovisionamiento; notar que conviven `autoriz_sa` y `autoriza_sa`), `Admin_FA_PerPago` (permitir pago de facturas), `frm_Su_Sueldo` (ver proveedores-empleado en informes).

---

## 2. Tesorería

### 2.1 Modelo: dos libros

Tesorería registra cada movimiento en uno de dos libros:

- **`TESORE`** (“libro de tesorería”): efectivo, cheques de terceros, cupones de tarjeta y retenciones que están en poder de la cooperativa. Se escribe con `clsTesoreria.RegistrarEnTesoreria` (`ReglasNegocio.Tesoreria/clsTesoreria.cs:584, 648`). Agrupa los movimientos de una misma operación con un número `COD_INT` (`NuevoNroTesoreria`, `clsTesoreria.cs:1068`).
- **`RESBAN`** (“resumen bancario”): movimientos en cuentas bancarias (depósitos, transferencias, cheques propios, débitos y créditos). Se escribe con `clsTesoreria.RegistrarResBan` (`clsTesoreria.cs:408, 513`). Es la tabla que se concilia.

Cada movimiento lleva un **tipo** (`Tipos_Movimientos_Tesoreria`, `CapaNucleo/Tipos_Movimientos_Tesoreria.cs:3-37`) y una **categoría** (`CAT_BANC`), que determina la cuenta contable. Tipos relevantes: depósito de valores/efectivo (1, 2), cierre de caja (3, 4), transferencias desde caja (5-9), quebranto de caja (50, 51), ingreso/egreso excepcional (55, 56), cambio de valores (57, 58), rechazo y recupero de valores (59-61), cupones (62, 63), presentación de retenciones (64), pagos a proveedores con valores de terceros / efectivo / transferencia / cheque propio / VEP (65, 66, 67, 68, 73), transferencia entre bancos (70), rechazo de valores entregados (72).

Los medios de pago son un enum fijo: Efectivo, Cheque propio, Cheque de terceros, Transferencia, Retención y Cupón de tarjeta (`clsTesoreria.MediosDePago`, `clsTesoreria.cs:19-33`). Una transferencia puede ser “Banco”, “Tarjeta” o “QR” (`clsTesoreria.cs:35-43`). La moneda por defecto de un medio de pago es P186 (`clsTesoreria.cs:189`); cada medio guarda importe en moneda elegida, cotización e importe en pesos.

### 2.2 Cajas de cobranza y cierre de caja

`clsCajas` gestiona la caja diaria de cobranza (apertura `AbrirCaja`, `clsCajas.cs:215`; datos de cierre `GetDatosCierre`, `clsCajas.cs:243`). El cierre (`CerrarCaja`, `clsCajas.cs:421-627`) transfiere los fondos de la caja a tesorería, generando movimientos `TESORE` bajo un único `COD_INT`:

1. Efectivo teórico → movimiento “Cierre caja efectivo” (tipo 3) y marca las operaciones de efectivo (`EFEC_OP`) con el número de tesorería (`clsCajas.cs:443-454`).
2. Diferencia entre efectivo contado y teórico → quebranto de caja de ingreso o egreso (50/51) y se guarda en `TOT_DIF` (`clsCajas.cs:455-466`).
3. Valores (cheques) → tipo 4; cada cheque pasa de estado “Recibido” (1) a “En cartera” (2) con su historial (`clsCajas.cs:467-484`).
4. Cupones de tarjeta → tipo 6; los cupones de tarjetas que no requieren presentación (débito) se marcan presentados automáticamente con un movimiento de “Presentación de cupones” (`clsCajas.cs:486-517`).
5. Retenciones sufridas → tipo 7; si P2952 está activo, se presentan automáticamente en el mismo cierre (`clsCajas.cs:518-551`).
6. Si P2543 (“no validar capital pagado”) está desactivado, al final se registran los pagos de capital social de esas fechas (`clsCajas.cs:608-615`).
7. Transferencias recibidas → tipo 9 (ingreso y egreso en `TESORE`) y un `RESBAN` por cada transferencia en el banco destino (`clsCajas.cs:552-580`).
8. Si la caja no tuvo nada, se registra un movimiento “Caja en cero” (`clsCajas.cs:581-585`).

Con P2688 se puede cerrar en una sola operación el efectivo de varios días. La anulación del cierre (`AnularCierreCajas`, `clsCajas.cs:628`) pone en cero los totales y, en ese modo, también reabre las cajas de las otras fechas incluidas (`clsCajas.cs:662`).

### 2.3 Caja de pagos

Existe una caja separada para pagar a proveedores en efectivo (`CAJAPAGO`, `clsCajaPago`). Si P134 está activo se abre automáticamente cada día (o se reabre si estaba cerrada) con un tope de efectivo P135 y con los medios habilitados P2000 (cheques), P2001 (valores), P2002 (efectivo) y P2004 (transferencias) (`ReglasNegocio.Tesoreria/clsCajaPago.cs:27-60`). El saldo disponible es el tope menos los pagos en efectivo del día (`GetSaldo_CajaPagos`, `clsCajaPago.cs:63-81`).

### 2.4 Cheques de terceros (cartera)

Los cheques recibidos viven en `VALORES`, con un estado (`clsValores.Estados`, `ReglasNegocio.Tesoreria/clsValores.cs:30-42`): Recibido (1), En cartera (2), Entregado a proveedor (3), Depositado (4), Acreditado (5), Rechazado (6), Recuperado (7), Devuelto (8), Anulado (9), Egreso manual (10). Cada cambio se registra con `RegistrarCambioDeEstado` (`clsValores.cs:294`).

Reglas:
- Un cheque solo puede entregarse a un proveedor si está **en cartera y marcado como apto para pagos** (`PERPAGPRO`); el filtro “Disponible para pagos” es `ID_ESTA = 2 AND PERPAGPRO` (`clsValores.cs:49-51`). La marca se pone con `MarcarPerPagPro` (`clsValores.cs:110`).
- Alta controlada: `ValidarNuevoCheque` impide duplicar banco + sucursal + cuenta + número (`clsValores.cs:159`).
- Transiciones explícitas: `CambiarEstadoCheque` (`clsValores.cs:181`), `IngresarChequeACartera` (`clsValores.cs:225`), `RechazarCheque` (`clsValores.cs:237`), `RechazarChequeEntregado` (`clsValores.cs:256`), `RecuperarCheque` (`clsValores.cs:275`).
- Rechazo de un cheque ya entregado a un proveedor (`clsTesoreria.RechazoDeValoresEntregados`, `clsTesoreria.cs:1543`): genera un comprobante al proveedor por el importe (concepto exento P2384; si no está configurado, error explícito, `clsTesoreria.cs:1545-1548`) y opcionalmente un gasto con el concepto P2517 (`clsTesoreria.cs:1566`).

### 2.5 Cheques propios (chequeras) y e-cheq

`CHEQUERAS` contiene cada cheque físico pre-numerado o cada e-cheq disponible, con estado `Disponible (0) / Entregado (1) / Anulado (2) / Rechazado (3)` (`ReglasNegocio.Tesoreria/clsChequeras.cs:17-23`).

- Usar un cheque en un pago (`SetEgreso`, `clsChequeras.cs:258-306`) exige estado Disponible. Para **e-cheq** toma el primer registro libre de la chequera (número 0) y le asigna el número informado; antes valida que ese número no se haya usado ya en esa cuenta y chequera (`ValidarChequeParaPago`, `clsChequeras.cs:327-345`). Guarda fecha de pago y las marcas al portador, cruzado y no a la orden, y vincula el cheque con el `RESBAN` y la OP.
- Anulación (`SetAnulado`, `clsChequeras.cs:308`), reemplazo de un cheque dentro de una OP (`ReemplazarChequeEnOp`, `clsChequeras.cs:94`) y recupero (`RecuperaCheque`, `clsChequeras.cs:160`).
- Impresión de cheques por rango con el reporte P370 (`ImprimirValores`, `clsChequeras.cs:386-430`) y marca de impresos (`MarcarChequeImpreso`, `clsChequeras.cs:124`).
- Contablemente, un banco puede tener una cuenta “pendiente de débito” (`BANKOS.CTA_PENDEB`) donde se imputan los cheques propios emitidos hasta que se debitan (`clsCuentas_Asignadas.GetCuentaBanco`, `ReglasNegocio.Contabilidad/clsCuentas_Asignadas.cs:172-191`).

### 2.6 Tarjetas y cupones

Los cupones (`CUPONTAR`) siguen el ciclo cobrado en caja → presentado (`PresentarCupones`, `clsTesoreria.cs:1339`) → cobrado (`CobrarCupones`, `clsTesoreria.cs:1608`). El cobro registra el neto en banco y genera un comprobante de gastos al procesador con comisiones (concepto P2046), comisiones con IVA diferencial (P813), importe exento (P490), impuestos (P498), y las retenciones sufridas (IVA, Ganancias, IIBB, Seg. Social) con su número de certificado (`clsTesoreria.cs:1639-1651`). Un cupón rechazado puede convertirse en anticipo/deuda del socio (`CrearAnticipoRechazoCupones`, `clsTesoreria.cs:1399-1505`, con P1008, P2409, P3177 y P3178).

### 2.7 Retenciones sufridas (cobranza)

Las retenciones que los clientes practican a la cooperativa se guardan en `RETENCIO` con tipo IIBB (1), IVA (2), Ganancias (3), Seg. Social (4) (`ReglasNegocio.Tesoreria/clsRetencio.cs:11-17, 42-72`). Quedan pendientes hasta que se “presentan” (`PresentarRetenciones`, `clsTesoreria.cs:1218`, tipo 64) o se da salida (`PresentarSalidaRetenciones`, `clsTesoreria.cs:1277`). Pendientes = `!PRESENTADO && FEC_SALIDA == null` (`clsRetencio.cs:74-77`).

### 2.8 Movimientos extraordinarios y entre bancos

`GenerarMov_Extraordinario` (`clsTesoreria.cs:1862`) registra cualquier combinación de ingresos y egresos (efectivo, valores, bancos) con concepto libre: depósitos, extracciones, transferencias entre bancos, ingresos/egresos excepcionales y cambio de valores. Anular un movimiento revierte `TESORE`/`RESBAN` y, si corresponde, el cheque propio (`clsTesoreria.Anular`, `clsTesoreria.cs:886, 979, 2156`).

### 2.9 Conciliación bancaria

Manual (`clsConciliacion`, `ReglasNegocio.Tesoreria/clsConciliacion.cs`):
- Lista los `RESBAN` de un banco por fecha de movimiento, con filtro conciliados / no conciliados, o por fecha de conciliación (`GetMovimientos`, `clsConciliacion.cs:74-106`).
- Guardar marca `CONCILIAC = 'S'`, `FEC_CONC` y `USU_CONC` para los tildados y limpia los destildados (`Guardar`, `clsConciliacion.cs:108-150`). No hay cabecera de “conciliación” ni saldo de extracto: es una marca por movimiento.

Automatizada con **Interbanking** (`clsInterbanking`, `ReglasNegocio.Tesoreria/clsInterbanking.cs`): obtiene cuentas, saldos y movimientos vía API (`getCuentasInterbanking`, `:132`; `getSaldosCuentasInterbanking`, `:172`, que compara el saldo del banco con el saldo de `RESBAN`; `getMovimientosCuentaInterbanking`, `:245`), los guarda en `MOV_INTERBANKING` y permite emparejarlos con `RESBAN` (`GuardarConciliacion`, `:479`; tabla de vínculo `RESBAN_MOVINT`, `:454`). El código de movimiento de Interbanking se traduce a un concepto de compra (`CON_COM.COD_CON`) con `getCodConCom` (`:626`); `getCodConcInter` (`:591`) y `getCodConcResban` (`:599`) no mapean conceptos sino que devuelven el número de grupo de conciliación (`COD_CONC`) de un movimiento (corrección de segunda pasada; ver 15.1). Las credenciales OAuth (`CLIENT_ID`, `CLIENT_SECRET`, `ACCESS_TOKEN`) se guardan en la tabla `INTERBANKING` y el token se renueva cada 7200 s (`clsInterbanking.cs:138-151`).

---

## 3. Retenciones a proveedores (Ganancias, IIBB, IVA, SUSS)

Motor genérico en `ReglasNegocio/Retenciones.cs` (fuera de las carpetas pedidas pero invocado por la OP). Cada tipo de retención (`RETE_TIPO`) es configurable y tiene una tabla de escalas (`CAT_RETG`).

### 3.1 Habilitación

Se calcula solo si el régimen está habilitado globalmente: P2037 (IIBB), P2039 (IVA), P2041 (Ganancias), P2043 (SUSS / Seguridad social) (`Retenciones.cs:85-89`). Para cada proveedor se toman los tipos de retención asignados en `PROVEED_RET` cuyo `TIP_RET` (`IB`, `IV`, `GN`, `SS`) esté habilitado (`Retenciones.cs:92-101`).

### 3.2 Base imponible (`CalcularBaseImponible`, `Retenciones.cs:216-484`)

Por cada factura a pagar del proveedor:

1. Si P410 está activo, solo cuentan los comprobantes con operación 13 que informan impuestos; los demás se saltean (`Retenciones.cs:221-224, 244`).
2. Si el tipo tiene `TOT_PRO = 1`, solo se consideran facturas que se pagan por el total (`Retenciones.cs:244`). Si no, se prorratea por `Restante / Total` (pago parcial) (`Retenciones.cs:256-259`).
3. Con `CALCULAXITEM`, la base sale solo de los ítems cuyos productos/conceptos están vinculados al tipo (`PROD_SER_RET`, `CON_COM_RET`), separando gravado, no gravado, exento, IVA y percepciones (`Retenciones.cs:265-271`). Sin esa marca, se usan los totales de cabecera de la factura (`Retenciones.cs:272-279`).
4. Si P410 está desactivado y el comprobante **no** discrimina impuestos (p. ej. factura C), se toma el total y se le quita un IVA presunto: `neto = total / (1 + P2310/100)` (`Retenciones.cs:285-293`). Lo mismo para anticipos sin factura (`Retenciones.cs:295-303`).
5. La base se arma con banderas del tipo: sumar (`S_NETGRA`, `S_IMPUES`, `S_EXENTO`, `S_IVA`, `S_PERCEPCION`) y restar (`R_*`) cada componente, y luego se multiplica por `M_FACTOR` (`Retenciones.cs:310-351`).

**Acumulación:** si `ACUM_MES > 0`, se suma lo pagado al proveedor en la ventana (`ACUM_CALE` = meses calendario, con 12 = año calendario; si no, meses móviles hacia atrás) desde `PPAGOS`/`PPITEMS`, y se obtiene lo ya retenido en esa ventana desde `RET_COM` (`Retenciones.cs:355-472`).

### 3.3 Cálculo del importe (`ObtenerRetencion`, `Retenciones.cs:107-214`)

```
mínimo = RETE_TIPO.MIN_IMP
si DESC_ANUAL y ya hubo retención de este tipo en el año → mínimo = 0
base = baseFacturas + pagadoEnVentana − mínimo
si base > 0:
    escala = tramo de CAT_RETG con IMP_MIN ≤ base ≤ IMP_MAX
    ret = RET_PES + (base − EXCEDENTE) × RET_POR / 100     (si base > EXCEDENTE)
    si ret > MIN_RET: ret = ret − retenidoEnVentana → genera RET_COM
si base < 0 y hubo pagos y retenciones en la ventana → RET_COM negativa (devolución)
```

- Si no hay tramo y el tipo tiene valores fijos (`RET_PES`, `RET_POR`, `RET_EXE`), **crea y persiste** una escala única 0–999.999.999 en ese momento (`ObtenerTrama`, `Retenciones.cs:486-508`). Si no hay nada, muestra “No se encontró una trama válida” (`Retenciones.cs:171`).
- El punto de venta del certificado de IIBB puede fijarse con P2012; los demás usan el del usuario (`Retenciones.cs:129-132`).
- Fecha de información (`FEC_INF`): si el día actual es mayor que P2045, la retención se informa en el mes siguiente (`Retenciones.cs:159-166`).

### 3.4 Numeración y anulación

Al guardar la OP, cada retención recibe número de comprobante y, si el tipo tiene `NUMERO = 1`, un número de emisión (`NROEMI`) propio por tipo y punto de venta que **reinicia cada año** (`clsPagoFacturas.ProcesarRetenciones`, `clsPagoFacturas.cs:519-571`). Al anular la OP las retenciones quedan con `ESTADO = 'A'` e importes en cero, no se borran (`clsPagoFacturas.cs:907-918`).

### 3.5 Exportaciones

SIRE (SUSS) en formatos F2004 y F2005 (`ReglasNegocio.Compras/clsSIRE.cs:44-62, 74, 124`), usando el código SIRE de la condición de IVA del proveedor. SIRCAR / percepciones de IIBB se exportan desde `clsContabilidad` (`ReglasNegocio.Contabilidad/clsContabilidad.cs:654-1148`).

---

## 4. Órdenes de pago a proveedores

### 4.1 Facturas pendientes y “permitir pago”

Las facturas de compra (`IVACOM`) tienen `SALDO` y una marca `PER_PAGO` (habilitada para pago). Según P2201: 1 = todas habilitadas; 3 = habilitadas solo si el total ≤ P2457; otro valor = requieren habilitación manual, salvo usuarios con `Admin_FA_PerPago` (`ReglasNegocio.Facturacion/clsIvaCom.cs:148-157`, `ActualizarPermitirPago`, `clsIvaCom.cs:343`). Existe además un portal web donde proveedores suben comprobantes (`IVACOM_WEB`, `clsPagoFacturas.cs:1216-1555`; `clsIvaCom.ActualizarPermitirPagoWeb`, `clsIvaCom.cs:353`).

### 4.2 Alta de la OP (`GuardarOrdenDePago`, `clsPagoFacturas.cs:175-216`)

1. **Cabecera** (`GenerarCabeceraOP`, `:218-275`): toma el comprobante con operación ORDEN_DE_PAGO y el próximo número; si el número ya existe, renumera al máximo + 1. Guarda totales de facturas, pagos, descuento, bases de retención; `FIRMA = false`, `ENTREGA = false`.
2. **Detalle** (`ProcesarDetallesOP`, `:277-343`): por cada factura descuenta el importe aplicado del `SALDO`; si el saldo no alcanza, error. Saldo < 0,01 se redondea a 0 y la factura pasa a `ESTADO = 'P'` (pagada). También pisa `VENCE1` con la fecha de hoy (`:309`).
3. **Anticipos** sin factura (`GenerarCmpAnticipo`, `:345-403`): crea un comprobante “anticipo a proveedor” (concepto P2035, debe existir un comprobante que sume y otro que reste con la operación ANTICIPO_A_PROVEEDOR, `clsIvaCom.cs:175-189`) y su contraparte en N cuotas. Si el proveedor es un empleado y el concepto es P2034 (adelanto de sueldo), en lugar de cuotas genera una novedad de sueldos que se descontará en el recibo (`:360-364`).
4. **Medios de pago** (`ProcesarMediosDePago`, `:405-517`):
   - Efectivo: `TESORE` tipo 66. Si P144 = 1 y el importe ≤ P2025 (o P2025 = 0), el efectivo queda como **salida pendiente** (`SALIDA_PEN`) para que lo entregue la caja más tarde (`:429-434`).
   - Cheques de terceros: `TESORE` tipo 65 y el cheque pasa a “Entregado a proveedor” (`:450-479`).
   - Transferencia, cheque propio, VEP: `RESBAN` con tipos 67, 68 o 73 y categoría P146 (P2066 para valores de terceros) (`:573-609`). Una transferencia con CBU queda marcada para generar el archivo bancario (`GEN_ARCHIVO`, `:603-607`). P3044 permite que la transferencia tenga una fecha posterior a la OP; P2433 usa la fecha del movimiento como fecha de emisión (`:504-514`).
5. **Retenciones**: ver 3.4.

Todo se guarda en un único `SubmitChanges`; el número de OP generado queda en `IdOpGenerada`.

### 4.3 Firma y entrega

- **Firmar** (`FirmarOP`, `:967-999`): requiere permiso `Firma_OP`, OP no anulada y no firmada; guarda fecha y usuario.
- **Entregar** (`EntregarOP`, `:1008-1044`): requiere `Entrega_OP` y que la OP esté **firmada**.
- **Masivo** (`Firmar_Entragar_MasivaOP`, `:1046-1090`): marca muchas OP; la validación previa solo verifica que no estén ya firmadas/entregadas (`ValidarOperacion_Masiva`, `:1118-1177`). En este camino no se verifican permisos ni se guarda el usuario.
- Hay además un esquema de **firmas electrónicas por documento** (`FIRMASELECTRONICAS`, `FIRMASELECTRONICAS_DOCUMENTOS`, `:1179-1214`) y una tabla `PPAGOS_FIRMANTES` en el modelo de datos. Los firmantes impresos en la OP vienen de P2372 (tres nombres separados por coma) (`ReglasNegocio.Facturacion/clsInformes_Compras.cs:3353`).

### 4.4 Anulación (`Anular`, `:704-958`)

Requiere `Anula_OP` y que la OP no haya registrado la salida de efectivo desde una caja de cobranza (en ese caso hay que anular primero la operación de caja, `:680-702`). Verifica cierre de Compras y Tesorería. Repone el saldo de las facturas, anula los comprobantes de anticipo (si la contraparte del anticipo ya se pagó en otra OP, no permite anular, `:830-835`), revierte novedades de sueldo de adelantos, anula `RESBAN`/`TESORE` (opcionalmente los cheques propios), desvincula cheques y pone las retenciones en estado anulado. Si la OP pagaba recibos de sueldo, anula el pago en sueldos y borra las facturas de sueldo asociadas (`:736-743, 885-897`).

---

## 5. Contabilidad

### 5.1 Plan de cuentas y ejercicios

- Plan de cuentas `CTPLAN`, con cuentas numéricas de 11 dígitos donde la jerarquía surge de los prefijos (`GetCuentaPadre`, `clsContabilidad.cs:1216`; `GetPrefijoCuenta` quita ceros a la derecha, `clsCierreDiario.cs:7891-7899`). Hay validación de imputable (`validarImputable`, `clsContabilidad.cs:2047`) y renumeración de cuentas que actualiza por SQL todas las tablas con cuentas (`Renumerar_Cuenta`, `ObtenerTablasConCuentas`, `clsContabilidad.cs:2417-2486`). La actualización de los parámetros-cuenta en `VARIABLE` (`actualizarCuentasEnVariables`, `:2465-2479`) modifica los registros en memoria pero **no los persiste** (no llama a `SubmitChanges`), por lo que los parámetros 2101–2164 quedarían apuntando a la cuenta borrada **[VERIFICAR]** (corrección de segunda pasada; ver 15.2).
- Rangos de cuentas por parámetro: Activo P514, Pasivo P508, Patrimonio neto P509, Ganancias P510, Pérdidas P511, Cuentas de orden P512 (prefijos de texto, `clsCierreDiario.cs:7864-7866, 7904-7909, 7965-7978`).
- Ejercicios `CTEJER` con fechas de inicio/fin, marca de abierto y referencias a los asientos de cierre y apertura (`ReglasNegocio.Contabilidad/clsCtEjer.cs:9-60`).

### 5.2 Asientos (`clsAsiento`)

- Cabecera `CTASIEN`, renglones `CTITASIE` (debe/haber por cuenta) y distribución por centro de costo `CTITASIE_SECCIONES`.
- Dos numeraciones: `COD_ASI` (interno, global) y `COD_AS` (número visible, **reinicia por ejercicio**: máximo del ejercicio + 1) (`clsAsiento.cs:369-381`). Si se cambia la fecha a otro ejercicio, se renumera (`clsAsiento.cs:393-397`).
- Validación (`Validar`, `clsAsiento.cs:710-787`): al menos un renglón, descripción obligatoria, ejercicio abierto y fecha posterior a P2528. Debe = Haber obligatorio en asientos manuales. En asientos automáticos, una diferencia menor al 0,001 % se ajusta contra la cuenta “Conceptos desconocidos” (P2111) (`clsAsiento.cs:728-751`). Un renglón con cuenta 0 deja el asiento “no válido” y bloquea el guardado del lote.
- `Comprimir` agrupa renglones de la misma cuenta (decimales de secciones P2978) (`clsAsiento.cs:789`).
- Auditoría en altas, modificaciones y bajas (`RegistrarAuditodia`, `clsAsiento.cs:478-484, 665`).
- Eliminación (`Eliminar`, `clsAsiento.cs:507-681`): si el asiento es de amortización de bienes de uso, revierte la amortización acumulada en cada bien; si es de cierre/apertura, puede eliminar en cascada los tres asientos ligados y reabrir el ejercicio.
- Importación desde archivo, con y sin secciones (`clsAsiento.cs:1005-1300`), eliminación masiva (`:926`), renumeración por rango (`clsContabilidad.RenumerarAsientos`, `:2052`).

### 5.3 Centros de costo (“secciones”)

Los centros de costo se llaman **secciones** (`CTSECCION`). Se activan con P2547 (general) y P2714 (sueldos) (`clsCierreDiario.cs:290-292`). La asignación por defecto vive en `CTSECCION_ASIGNA` con `TIPO_OPERACION` (2 = compras, 4 = asiento) y `TIPO_ELEMENTO` (producto, concepto, impuesto, cuenta) y un porcentaje (`clsContabilidad.Get_Secciones`, `:483`; `GuardarProcesarSecciones`, `:2153`; modelos de distribución, `:2323-2363`).

- En compras, cada ítem de factura puede llevar su distribución (`FPITEMS_CTSEC`), cargada al guardar la factura si secciones está activo (`frmComprobantes_Handler.cs:2363-2384`, `AddFPItem_CTSEC`, `:2197`).
- El IVA de compras se distribuye según la asignación del impuesto P543 o, si no existe, proporcional a los ítems (`clsCierreDiario.cs:2328-2358`).
- Al final del cierre automático, cualquier renglón sin sección toma la distribución por defecto de su cuenta (`CargarSeccionesDefault`, `clsCierreDiario.cs:8287-8333`).
- Bienes de uso y empleados también tienen distribución propia (`clsBienesUso.Get_Secciones_Bienes`, `ReglasNegocio.Compras/clsBienesUso.cs:167`; `clsEmpleados.Get_Secciones_Emp`, `ReglasNegocio.Sueldos/clsEmpleados.cs:1720`).

### 5.4 Cierre de ejercicio

Se ejecuta dentro del Cierre automático indicando el ejercicio (`clsCierreDiario.cs:483-486`):

1. `ValidarCierre` (`:7854-7878`): el ejercicio no debe tener asientos de cierre previos ni cuentas de orden (P512) con saldo.
2. **Asiento de resultados** (`CierreResultados`, `:7901-7960`): salda las cuentas de ganancias (P510) y pérdidas (P511) contra la cuenta de resultados que corresponda según la tabla `RESULTA` (la de prefijo más largo que coincida); si no hay, contra “Asignación de resultados” (P513).
3. **Asiento patrimonial** (`CierreCtasPatrimoniales`, `:7962-8021`): salda activo, pasivo y patrimonio neto, incluyendo los resultados del paso anterior.
4. **Asiento de apertura** (`AperturaEjercicio`, `:8023-8048`): invierte el patrimonial al día siguiente.
5. Se guardan los IDs de los tres asientos en `CTEJER` con fecha y usuario de cierre (`:611-620`).

### 5.5 Informes y balances

Listados en `clsInformes_Contabilidad` (`ReglasNegocio.Contabilidad/clsInformes_Contabilidad.cs`, enum `Listados`): Libro diario, Libro diario rubricado, Libro mayor, Sumas y saldos (y por período), Transacciones por cuenta, Balance diario, Balance general (y por período), Saldos de cuentas, Distribución por secciones y rubros, Cuadro de bienes de uso, Gastos/ingresos por sección, exportación a DGR, a OCEBA y SilarPib. Los cálculos base: `GetMayor` (`clsContabilidad.cs:1253`), `GetMayores` (`:1492`), `GetSumasYSaldos` (`:1696`), por secciones y por meses (`:1813-2027`). Hay un ajuste por inflación contable (`clsCierreDiario.cs:6747-7065`, cuenta P2139).

---

## 6. Asientos automáticos (“Cierre automático”)

### 6.1 Mecánica general (`clsCierreDiario`)

- Se elige un rango de fechas y los módulos a contabilizar; cada módulo tiene opción de detalle diario y de composición (`clsCierreDiario.cs:308-372`). Corre en un hilo aparte y en este orden: ventas, pagos de otros períodos, cobranzas, tesorería, bancos, financiaciones, compras, stock, capital, sueldos, fabricación, bienes de uso, cierre de ejercicio y ajuste por inflación (`Iniciar_Thread`, `:418-546`).
- Cada sub-proceso puede correrse por todo el rango o día por día (`EjecutarProcesoEntreFechas`, `:8226-8251`), y generar **un asiento resumen** (“CIERRE DE COMPRAS dd/mm – dd/mm”) o **uno por operación** (`DetalleXOperacion`, p. ej. `:2265-2273`).
- Los asientos se arman en memoria; el usuario los revisa y luego `GuardarAsientos` (`:548-634`) los persiste. Si mientras tanto se cargaron asientos, renumera (`:559-567`). Si algún renglón usa una cuenta inexistente, informa qué **variables** están mal configuradas y no guarda (`:573-584`).
- **Resolución de cuentas** (`clsCuentas_Asignadas`): primero la cuenta de la entidad (proveedor, banco, rubro, alícuota, tipo de factura, categoría de banco, grupo contable, concepto de sueldo, etc.) y, si falta, la cuenta genérica del parámetro. Los parámetros 2101–2164, 513 y 3141 son literalmente **números de cuenta contable** (`ReglasNegocio.Contabilidad/TipoCuenta.cs:3-62`; lectura en `GetCuenta`, `clsCuentas_Asignadas.cs:67-95`). Cada faltante se acumula en una lista “cuentas sin asignar” con el menú exacto donde configurarla.
- **No hay marca de “contabilizado”** en los comprobantes: el proceso vuelve a leer por fecha. Solo se ofrece `existeAsiento`, que busca si ya hay un asiento con la misma descripción (`:636-641`).

### 6.2 Compras (`GenerarAsientoCompras`, `:2096-2114`)

**Facturas** (`GererarAsiento_Compras_Facturacion`, `:2135-2427`), por fecha contable (`FEC_CON`):

| Debe | Haber |
|---|---|
| Cuenta de compras del **rubro** del producto/concepto (`COD_CTAC`), por el neto + descuento, distribuido por sección | Cuenta del **proveedor** (o P2112 “Compras” si no tiene) por neto + IVA |
| IVA crédito fiscal: P2113 o la cuenta de compras de la **alícuota** | Descuentos (P2159) |
| Ítems recibidos como “pendientes” (sin stock) → P2162 “Compras productos pendientes” | |

- Notas de crédito invierten el signo (`DEB_CRE = 2`).
- P2890: el IVA no tomado (factura con `POR_IVA < 100` o ítems con `IVA_NO_TOMADO`) se registra como gasto en vez de crédito fiscal; P2902 permite cargar ese porcentaje de IVA por ítem en compras con secciones (`:2147-2149, 2250`).
- Ítems sin rubro se imputan a cuenta 0 y se informan como faltantes (`:2278-2293`).
- Cualquier diferencia final va a “Conceptos desconocidos” (P2111) (`:2396-2400`).

**Remitos** (solo si existe la cuenta P2162; con P2982 se incluyen todos los remitos): asiento de entrega de materiales para productos con stock, contra la cuenta de pendientes (`:2429-2669`). **Obras** (ítems con `COD_OBR`, `:2671-2819`). **Retenciones**: debe proveedor / haber cuenta del tipo de retención de pago (`:2930-3011`).

**Pagos** (`Compras_Pagos`, `:3013-3326`): debe proveedor (pago + descuento); haber descuentos obtenidos (P2141), caja de pagos (P2155) por el efectivo, valores en cartera (P2122) o cuenta puente de pago con valores (P2149) por los cheques de terceros, y la cuenta de cada banco (o su cuenta pendiente de débito para cheques propios) por transferencias, cheques y VEP (tipos 67/68/73). Si existen las cuentas puente P2148/P2149 se genera además un asiento de **devengamiento** que las cancela contra caja (P2101) o valores en cartera (`:3043, 3070-3100`).

### 6.3 Tesorería y bancos

`GenerarAsientoTesoreria` (`:643`) y `GenerarAsientoBancos` (`:1696`) producen asientos por tipo de movimiento: cambio de valores, transferencias entre bancos, ingresos/egresos excepcionales (contra la cuenta de la categoría del movimiento), rechazo y recupero de valores, quebrantos (P2137 “Diferencias en cajas”), presentación y cobro de tarjetas (P2121, P2127, comisiones P2128), presentación de retenciones (P2136 y cuentas por tipo de retención de cobro), créditos y débitos bancarios (P2118/P2119 si la categoría no tiene cuenta), depósitos, extracciones, rechazos y débito de cheques propios (`:660-2094`).

### 6.4 Ventas y cobranzas (referencia)

Ventas se agrupan por grupo contable, tipo de comprobante, zona y rubro; la cuenta sale de `CTCUENTA_ASIGNA` eligiendo la regla con más coincidencias (`clsCuentas_Asignadas.GetCuentaAsig`, `:228-259`). P2191 desactiva grupos contables (`clsCierreDiario.cs:4601`). P2190 (“tipo de liquidación a deudores por servicios”) define la modalidad (1 = por tipo de factura, 3/5/6 = por concepto; 5 separa IVA) (`:4612, 6243-6253`). Cobranza: debe caja/valores/tarjetas por grupo contable, retenciones (P2136) y bancos de las transferencias; haber deudores por tipo de factura o deudores por refinanciación (P2619) (`GenerarAsiento_Cobranza`, `:6135-6393`). Capital social: se suscribe al facturar (P73) o en la afiliación (P2636), y se integra en el pago (P2916) (`:6576-6745`). Detalle en los documentos 02 y 05.

### 6.5 Stock

`GenerarAsientoStock` (`:3328-3369`): materiales en órdenes de trabajo y de mantenimiento, incluyendo las horas de los participantes valuadas con P2722/P2723 (hora normal/extra) contra las cuentas P2166/P2167 (`:3377-3378, 3546-3547`); conciliaciones de stock; vales (retiro de materiales de viviendas P755 y obra por defecto P2670, `:3916-3917`); costo de mercadería vendida y, con P2734, entregas y retiros de comodato. P2548 hace que OT y OM usen la cuenta de compras del rubro (`:3432`). La valorización puede tomarse “según valuación” (`_SegunValuacion`).

### 6.6 Sueldos

Según P2207: 1 = asiento de recibos + asiento de contribuciones; 2 = asiento por sindicato; 3 = asiento personalizado definido por el usuario en `SU_ASIENTOS` (`clsCierreDiario.cs:4355-4373`; `ReglasNegocio.Sueldos/clsAsientoSueldo.cs:55`). Cuentas por concepto, empresa y sindicato (`clsCuentas_Asignadas.cs:513-596`).

### 6.7 Fabricación

Ver 10.4.

---

## 7. Compras: circuito SA → cotización → OC → remito → factura

### 7.1 Estructura común

Los cinco documentos son `Comprobantes_Compras` 1 a 5 (`CapaNucleo/Comprobantes_Compras.cs:3-10`). Cada ítem puede “importar” ítems pendientes de documentos anteriores; el vínculo y la cantidad tomada se guardan en **`COMPRAS_RELACION`** (`TIPO_ORI`, `ID_ORI`, `TIPO_DES`, `ID_DES`, `CANTIDAD`) y el origen descuenta su pendiente (`clsSAprov.Procesar`, `clsSAprov.cs:653-674`; `clsSCotiz.Procesar`, `clsSCotiz.cs:1848`; `clsNPedido.Procesar`, `clsNPedido.cs:327`; `clsComp_Com.Procesar`, `clsComp_Com.cs:68`; `clsIvaCom.Procesar`, `clsIvaCom.cs:629`). El despacho central es `frmComprobantes_Handler.ProcesarComprobantes` (`frmComprobantes_Handler.cs:1804-1834`) y su inverso `LiberarComprobantes` (`:1836`). El circuito no es obligatorio: se puede facturar sin OC ni remito.

### 7.2 Solicitud de aprovisionamiento (SA)

- Alta (`clsSAprov.Alta`, `clsSAprov.cs:112-189`): ítems de producto, concepto o texto libre, con cantidad, costo estimado, solicitante, destinatario, criticidad (normal/alta/urgente) y modalidad de contratación.
- **Autorización**: queda autorizada al crearla si el usuario tiene `autoriz_sa` y P2640 está **desactivado** (`:133, 143-150`). Con **doble autorización** (`DOBLE_AUTO`) hacen falta dos usuarios distintos: el primero carga `USU_AUTO2`, el segundo completa `USU_AUTO` y `AUTORIZADO` (`Autorizar`, `:386-442`). Hay autorización masiva (`AutorizarSolicitudes`, `:896`).
- Visibilidad: quien no puede autorizar solo ve SA autorizadas; P2036 limita los días de vigencia mostrados (`GetSA_Pendientes`, `:278-325`).
- Estados derivados (`GetEstadoSolicitud`, `:744-759`; informe, `:609`): Pendiente, En proceso (`FEC_COMPRAS` cargada por compras, `CambiarA_EnProceso`, `:761`), Procesada (algún ítem recibido), Anulada/Rechazada (`ESTADO = 'A'`, `AnularSolicitud`, `:475`, permiso `anula_sa`). Eliminar exige `elimina_sa` y que ningún ítem esté procesado (`:444-473`). “Descartar” la da por procesada; “Marcar pendiente” la reabre (`:516-597`).
- **Atención:** procesar un ítem de una SA no autorizada la **autoriza automáticamente** con el usuario actual (`clsSAprov.Procesar`, `:669-673`).

### 7.3 Solicitud de cotización

- Alta (`clsSCotiz.Alta`, `clsSCotiz.cs:725-839`): se genera **una cotización por proveedor**, todas agrupadas por `GRUPO`; vencimiento a 15 días; moneda y cotización. Soporta modalidades de contratación con número correlativo de **concurso de precios, concurso o licitación** (tipos 1–4, `:756-759, 778-779`). Al guardar, procesa los ítems de SA importados (`:814-823`).
- Carga de precios del proveedor (`GuardarCotizacion`, `:1773`), envío (`MarcarComoEnviada`, `:696`), rechazo con motivo (`RechazarCotizacion`, `:841`).
- **Evaluación/adjudicación** (`EvaluarCotizaciones`, `:1693-1722`): cada ítem queda contratado (`ESTADO_IT = 2`) o no (1), con posibilidad de ajustar la cantidad. Documentos de soporte: carátula de expediente (`:1141`), acta de apertura (`:1229`), planilla de adjudicación (`:1242`).

### 7.4 Orden de compra (OC)

- Alta (`frmComprobantes_Handler.GuardarOrdenDeCompra`, `:1392-1555`): cabecera con forma de pago, plazos y lugar de entrega, solicitante, firmante, departamento, moneda, fecha estimada de pago.
- **Bloqueo por monto**: si P2377 = 2 y el total ≥ P2382, la OC queda `BLOQUEADA` hasta su autorización (`:1462`). La autorización (`clsNPedido.AutorizarOrdenesCompras`, `clsNPedido.cs:139-167`) desbloquea y guarda quién autorizó; no se encontró validación de permiso en ese método.
- Las OC bloqueadas de proveedores con `PERPAGOTROS` se listan junto con las de todos los proveedores (`GetPendientesAutorizar`, `clsNPedido.cs:179-205`).

### 7.5 Remito de proveedor

`GuardarRemito` (`frmComprobantes_Handler.cs:1589-1802`): numeración propia salvo que el comprobante “informe impuestos” (`INF_IMPOS`), en cuyo caso se usa el número del proveedor (`:1601-1604`). **El remito mueve stock** (entrada por producto con `LLE_STO`) (`:1723-1742`). Mantiene `SAL_CANPRO` (saldo a facturar); no se puede eliminar un ítem ya facturado (`:1665-1669`). Si P2162 ≠ 0, los ítems sin precio toman el costo de la factura vinculada (`:1695-1698`).

### 7.6 Factura de proveedor

Validaciones (`Validar`, `:1168-1283`):
- Proveedor, punto de venta, número y tipo obligatorios; no vencida; año entre 1997 y 2050.
- Contable abierto, sin precios en 0 y tipo de comprobante permitido para la condición de IVA del proveedor (`SITIVA.COM_COMPRA`, `EmiteComprobante`, `:1286-1302`); con P2365 el usuario puede forzarlo.
- Rubro de vivienda P2502 exige productos del rubro P2503 (`:1231-1242`).
- Compras y Stock abiertos; no duplicada (`NoExiste`, `:1304-1332`).
- La diferencia entre el total y la suma de componentes no puede superar $0,50 (`:1253-1257`).
- Si se importa una OC con cantidad mayor a la pendiente, pide confirmación (`:1265-1281`).

Guardado (`GuardarComp`, `:2266-2458`): si P583 está **desactivado**, la factura mueve stock para productos que no vinieron de remito (`:2270`; `AddFPItem`, `:2063-2195`). Si el ítem viene de remito, en vez de mover stock **recalcula el precio del movimiento del remito** como promedio ponderado de las facturas que lo cubren (`ModificaPrecioStock_Remito`, `:2706`; `GetPromedioPreFPItem`, `:2743-2761`). Un ítem puede marcarse “pendiente” (recibido sin ingreso a stock). El descuento global se registra como un ítem negativo del producto P2403 (obligatorio configurarlo, `:2163-2190`). La anulación borra la factura y libera bienes de uso, combustibles y comprobantes web vinculados (`:2407-2436`).

Extras: carga de combustibles por factura (`IVACOM_COMBUSTIBLES`), lectura de facturas con IA (`clsLeerComprobante.Leercomprobante`, `ReglasNegocio.Compras/clsLeerComprobante.cs:132-170`, usa CUIT P519 y nombre P518 de la cooperativa para no confundirlos con el proveedor), facturas en cuotas (`GuardarComp` con periodicidad, `:2461`).

### 7.7 Presupuestos (ventas de obras)

`clsPresupuesto` es un presupuesto a clientes con estados Generado → Enviado → Aprobado/Rechazado → Terminado (`clsPresupuesto.cs:1042-1273`). Con P2914, aprobar sin obra pide confirmación (`:1131`). Calcula prorrateo de flete (producto P2953) y molde (P3032) entre conjuntos (`:576-577, 1583`).

---

## 8. Stock

### 8.1 Movimientos

Todo movimiento es una fila de `MOV_PRO` con entrada o salida, depósito (`COD_DPS`), ubicación opcional, precio (`PRE_MOV`) y una **operación** (`Mov_Pro_Operaciones`, `ReglasNegocio.Stock/clsMov_pro.cs:18-31`): Ventas (1), Proveedores (2), Órdenes de trabajo (3), Conciliación de stock (4), Vales E/S (5), Mantenimiento (6), Fabricación (7), Consignación (8), Remito entre depósitos (10), No registra (11), Facturación (12), Vivienda (13).

Alta (`Nuevo_MovPro`, `clsMov_pro.cs:1212-1286`):
- Los **combos** se explotan en sus componentes (`:1215-1221`).
- Solo se registran productos con `LLE_STO` (lleva stock).
- Cantidades negativas se convierten en el movimiento inverso (`:1256-1260`).
- Si hay ubicaciones, se genera un movimiento por ubicación (`:1234-1242`).
- Productos trazables (`ID_REQUE`) registran números de serie en `PROD_TRH`/`MOV_TRH` (`RegistrarTrazabilidad`, `:1327`); los bienes de uso se vinculan al movimiento (`RegistrarBienDeUso`, `:1385`).

El stock se calcula sumando movimientos (`Obtener_Stock_Prod`, `:1548`; por ubicación, `:1510-1546`); no hay tabla de saldos. Existen reconstrucción por producto/depósito (`Reconstruccion`, `:1802`), agrupación de movimientos históricos (`AgruparMovimientos`, `:1697`) y pedido sugerido por stock mínimo/máximo (`Pedir_segun_SM`, `:1619`).

### 8.2 Documentos de stock

- **Vales** de entrada/salida, opcionalmente asociados a obra (`frmVales_Handler.Guardar`, `ReglasNegocio.Stock/frmVales_Handler.cs:54`; P2899 en `:127`).
- **Intercambio entre depósitos** como remito interno (operación 10) (`frmIntercambio_Deposito_Handler.Guardar`, `:44`).
- **Materiales utilizados** en órdenes de trabajo o mantenimiento (`frmMaterialesUtilizados_Handler.Guardar`, `:191`).
- **Entrega de productos** vendidos pendientes de entregar (`frmEntregaProductos_Handler.Guardar`, `:67`).
- **RMA** (devoluciones con mail por estado, `clsRMA.cs:16-96`).

### 8.3 Depósitos y ubicaciones

Cada usuario tiene depósitos por defecto por tipo (stock, producción, componentes) (`Nucleo.Usuario.GetDeposito`, usado en `frmComprobantes_Handler.cs:787` y `clsOrdeFab.cs:620, 668`). Las ubicaciones son jerárquicas (padre/hijo) dentro de un depósito (`ReglasNegocio.Stock/clsUbicaciones.cs:78-219`); un producto puede tener ubicaciones por defecto (`GetUbicacionesPorDefectoStock`, `:221`; `clsProdSer.GuardarUbicacionesProducto`, `ReglasNegocio.Facturacion/clsProdSer.cs:643`) y solo usa ubicaciones si tiene `USA_UBICACION`.

### 8.4 Valorización

La valorización es **un cálculo a demanda, no un costo perpetuo** (`clsMov_pro.clsValorizarStock`, `clsMov_pro.cs:58-870`):
- Métodos: PEPS, UEPS, PPP (precio promedio ponderado), precio de venta, precio de costo (`:60-67`; método por defecto P2341, `ReglasNegocio.Stock/clsInformes_Stock.cs:3077`).
- Ingresos sin precio (`PRE_MOV = 0`) se completan con el precio de la factura del proveedor (directa o vía remito) o, si no hay, con el costo del producto `PRE_CSI` (`GetIngresosAValorizar`, `:226-274`). El resultado **se escribe** en `MOV_PRO.PRE_MOV` (`ActualizarPrecios`, `:171-211`).
- Trazables se valorizan por número de serie; la fecha de cierre de stock P432 delimita el recálculo (`ValorizarMovimientosTrazables`, `:872-878`).
- **Revaluación** (`clsRevaluacion`, `ReglasNegocio.Stock/clsRevaluacion.cs:272-740`): automática a costo o manual; genera vales de ingreso/egreso por la diferencia (`GenerarVale`, `:351`).

---

## 9. Bienes de uso

- Un bien de uso nace de un ingreso de stock (compra o remito) de un producto marcado como bien de uso (`RegistrarBienDeUso`, `clsMov_pro.cs:1385`; `clsProdSer.GetBienesUso`, `clsProdSer.cs:550`) y se vincula a la factura (`IVACOM.BIENES_USO1`).
- Datos clave: fecha de alta y de afectación, vida útil (años), porcentaje a amortizar, importe de origen, amortización acumulada, fecha de baja, marca de mejora, distribución por secciones e historial (`clsBienesUso.cs:62-338`). Registro de **mejoras** y **disminuciones** (`Procesar_Deduccion`, `:72`).
- **Amortización** (`clsCierreDiario.BienesDeUso_Amortizacion`, `clsCierreDiario.cs:7381-7570`): bienes afectados, no dados de baja y no totalmente amortizados. Método lineal: tasa anual = `PORC_AMORT / VIDA_UTIL`, mensual = anual / 12; meses entre inicio (afectación o inicio del período) y fin (fin del período, baja o fin de vida útil), con prorrateo por días para el mes parcial inicial y final. Mejoras y productos en asientos separados. Con P3076 usa campos de amortización histórica (`AMOR_EJER_HIST`, `VAL_ORIG_HIST`).
- Asientos de disminución, baja (`:7572-7704`) y **ajuste por inflación** de bienes (`:7705-7852`, P2936 separa cuentas de revalúo). Al guardar los asientos se actualizan los acumulados del bien (`:589-610`); al borrar el asiento se revierten (`clsAsiento.cs:533-593`).
- Cuentas por rubro: valor de origen, amortización acumulada, amortización del ejercicio, costo de venta, costo de baja, disminución, revalúo (`clsCuentas_Asignadas.cs:304-345`).

---

## 10. Fabricación

### 10.1 Estructura de producto

Cada producto fabricable tiene una lista de componentes `PRODFAB` (receta/BOM) con divisiones y coeficientes (`ReglasNegocio.Fabricacion/clsOrdeFab.cs:370, 967-1100`). Se puede clonar y guardar una versión histórica (`ClonarEstructura`, `:1256`; `GuardarEstruturaHistorica`, `:1320`) y calcular el costo y precio de venta según componentes (`:957-965, 1927`).

### 10.2 Orden de fabricación (`ORDEFAB`)

- Etapas: guardada → **lanzada** (`COD_ETA = 1`, `Lanzar`, `:588-609`) → **finalizada** (`COD_ETA = 2`, `Finalizar`, `:611-719`); también cancelación (`:763`) y anulación (`:784`).
- Al finalizar: ingresa los productos fabricados al **depósito de producción** a costo `PRE_CSI` y egresa los componentes del **depósito de componentes**, neteando cuando un producto es a la vez componente (`:636, 673`). Trazables piden números de serie mediante un evento a la UI.
- Productos dañados: cambio de producto, destrucción total o reasignación (`TipoDaño`, `:48-56`; `ProcesarProductosDañados`, `:1683`).
- Aprovisionamiento: `frmOrdenAprovisionamiento_Handler` calcula requerimientos de componentes de las órdenes de un período, con lo ya en proceso y últimas compras, y genera pedidos (`:89-316`). Es un MRP simple.

### 10.3 Partes de producción (`OF_PARTE_PRODUCCION`)

Estados Pendiente → En producción → Finalizado (`ReglasNegocio.Varios.Fabricacion/clsOfParteProduccion.cs:19-27`).
- **Lanzar** (`:670-727`): si P3003 está activo, consume los componentes en ese momento (`:678, 689-717`).
- **Finalizar** (`:559-668`): ingresa los productos; si los componentes aún no se consumieron, los consume (`:619`); marca los productos de la orden como fabricados.

### 10.4 Asientos de fabricación

`Fabricacion_EnProduccion` (`clsCierreDiario.cs:7075-7127`): partes en producción → debe “Productos en proceso” (P3141), haber cuenta de compras del rubro de cada componente, costeando cada componente por **PEPS** (`Fabricacion_GetCostoFIFO_Consumo`, `:7205-7236`) o, si no hay valorización, `cantidad × PRE_CSI`. `Fabricacion_Finalizado` (`:7129-7203`): reparte el costo total de componentes entre los productos terminados por proporción de cantidades → debe cuenta del rubro del producto, haber productos en proceso.

---

## 11. Sueldos

### 11.1 Modelo

Empleados (`SU_EMPLEADOS`, cada uno también proveedor para poder pagarle), empresas (`SU_EMPRESAS`), sindicatos/convenios (`SU_SINDICATO`), categorías con escala de antigüedad y días de vacaciones (`clsCategorias.Get_DiasVacacionesPorCategoria`, `ReglasNegocio.Sueldos/clsCategorias.cs:58`), extras (adicionales por empleado o grupo), novedades por período (`SU_EMP_NOVEDADES`), tipos de recibo (`SU_TIPO_RECIBOS`, cada uno con un comprobante y marca de SAC) y conceptos (`SU_CONCEPTOS`).

Aumentos por convenio: porcentaje aplicado sobre los básicos de un sindicato o de un grupo de extras (`AplicarAumentoSueldo_Sindicato`, `clsCategorias.cs:130`; `AplicarAumentoSueldo_Extras`, `:144`).

### 11.2 Conceptos

- Tipos (`clsConceptos.Tipos`, `ReglasNegocio.Sueldos/clsConceptos.cs:14-22`): Remunerativos (1), No remunerativos (10), Deducciones (30), Retenciones (40), Contribuciones (60), Redondeo (70).
- Cada concepto tiene vigencia (desde/hasta), fórmula de cantidad, fórmula de importe y fórmula de base, orden de cálculo, a qué tipos de liquidación aplica (`SU_CONCEPTO_TIPO`, con opción “no mostrar”), si se liquida siempre aunque dé cero, y clasificaciones impositivas:
  - Ganancias (`Tipo_Ganancia`: no afecta, siempre, solo si se cobra en el 75 % de los recibos, 50 %, según porcentaje; `:24-36`).
  - **SICOSS / F.931** (`ClasificacionSicoss`, `:44-110`: sueldo, adicionales, SAC, horas extra, premio, vacaciones, aportes y contribuciones por subsistema, LRT, zona desfavorable, cuota sindical, Ley 27.430, maternidad, etc.).
  - F.1357 (`:112-126`) y subsistemas AFIP como banderas (SIPA, INSSJyP, OS, FSR, RENATEA, AAFF, FNE, LRT, regímenes diferenciales/especiales; `Sistema_Afip`, `:139-171`).

### 11.3 Liquidación

1. Se arman las fórmulas de cada empleado con sus datos (antigüedad, novedades, extras, familia) (`clsEmpleados.GetFormulaEmpleado`, `ReglasNegocio.Sueldos/clsEmpleados.cs:441`; `clsDatosEmpleado`, `ReglasNegocio.Sueldos/clsDatosEmpleado.cs:371-430`).
2. Un evaluador de expresiones (`clsFormulas`, `ReglasNegocio.Varios/clsFormulas.cs:10`) resuelve conceptos y variables en orden. Las fórmulas pueden llamar a funciones de dominio registradas como funciones personalizadas de DevExpress (`clsFormulas_Sueldo`, `ReglasNegocio.Sueldos/clsFormulas_Sueldo.cs:11-1461`): retención de Ganancias (mensual y liquidación final), deducciones especiales, cónyuge, ganancia no imponible, impuesto cedular, promedio de Ganancias, **SAC**, total de conceptos, recibos ya liquidados, importe imputado a un concepto.
3. `GetItems` (`clsSueldos.cs:1014-1118`) convierte los resultados en renglones de recibo: descarta conceptos fuera de vigencia o no habilitados para el tipo de liquidación, conceptos en cero (salvo “liquidar siempre” con cantidad), suma haberes y resta deducciones/retenciones (las contribuciones no afectan el neto). Los conceptos ocultos que afectan Ganancias se guardan aparte para el cálculo del impuesto. El concepto de **redondeo** lleva el neto al entero superior; con P3016 el redondeo se clasifica como no remunerativo (`:1095-1109`).
4. `GenerarRecibo` (`:1263-1331`) graba todos los recibos en una transacción. Con P2611 ≠ 0, si el empleado tiene una novedad de tipo 27 (retención de Ganancias informada) en el período, pisa el importe del concepto de retención (`:1281-1311`). Hay simulación sin grabar (`SimulacionRecibo`, `:1213`).

Ganancias (`clsGanancias`, `ReglasNegocio.Sueldos/clsGanancias.cs`): deducciones anuales por tipo (`:425-478`), escalas por período (`GetTramas`, `:685`; `clsTramas`, `ReglasNegocio.Sueldos/clsTramas.cs:12-56`), cálculo completo (`GetCalculoGanancias`, `:1962`), deducción por hijos (`:2578`), diferencias mes a mes exportables a Excel (`:1677-1960`), importación del SIRADIG (P2763 corre a noviembre las novedades de diciembre, `clsNovedades.cs:1196`). P2611 (“año calendario para liquidar Ganancias”) cambia cómo se prorratean las deducciones mensuales (`clsDatosEmpleado.cs:344`).

### 11.4 Novedades, licencias y firma de recibos

Novedades por cantidad o importe, con cuotas y topes anuales (`clsNovedades.GuardarNovedades`, `ReglasNegocio.Sueldos/clsNovedades.cs:887`; `ValidarTopeAnual_TipoNovedad`, `:1533`), fichadas de reloj (`:937-1022`), importación desde Excel y de anticipos (`:1115-1520, 2507-2760`). Hay un circuito de **licencias** con solicitud, autorización por encargado, días hábiles disponibles y adjuntos (`:1578-2470`). Los recibos se firman digitalmente (estado de firma por recibo, `clsSueldos.cs:34, 850-1012`); P2886 permite traer recibos no firmados al portal (`:822`).

### 11.5 Pago de sueldos

`GenerarPago` (`clsSueldos.cs:635-744`): por cada recibo crea una “factura” de compra al empleado-proveedor por el neto, con el concepto de la empresa o del empleado; suma los adelantos pendientes (facturas de adelanto, `GetAdelantos`, `:809`) y genera una **orden de pago** estándar con `clsPagoFacturas` (`:711`). P2288 permite modificar la fecha de la transferencia del pago (`:710`). Los archivos de acreditación bancaria usan parámetros por banco (CBU de origen y códigos: P2262, P2406, P2449, P2671, P2672, P2944; P2468 hace que Banco Nación use la cuenta asignada al empleado; P3129 permite varias cuentas por empleado; `ReglasNegocio.Sueldos/clsInformes_Sueldo.cs:1638-3141`).

### 11.6 F.931 (SICOSS), Libro de Sueldos Digital y F.1359

- **SICOSS / F.931**: `ExportarArchivoSicoss` (`clsInformes_Sueldo.cs:747-821`) genera el TXT posicional ASCII por CUIL que se importa en SICOSS para obtener el F.931. Toma los importes por clasificación SICOSS de cada concepto, situaciones de revista del período, obra social, adherentes, zona, condición, actividad, siniestrado, tipo de empresa, etc. La remuneración imponible se **topea** con P2437 (meses de SAC: junio y diciembre) o P2438 (resto) (`:779-780, 803`). No hay cálculo propio del F.931 (aportes, contribuciones, saldo a pagar): se delega en el aplicativo.
- Importación de tablas SICOSS (`Importar_Sicoss`, `clsSueldos.cs:1507`).
- **Libro de Sueldos Digital** (`LibroSueldoDigital.ExportarLibro`, `ReglasNegocio.Sueldos/LibroSueldoDigital.cs:241-660`): registros tipo 1 a 5; P3065 topea las vacaciones proporcionales (`:325`).
- **F.1359** (liquidación anual de Ganancias) desde 2024, con CUIT de la cooperativa P519 (`clsInformes_Sueldo.cs:823-842`).

---

## 12. Parámetros relacionados

La descripción oficial de cada parámetro está en el catálogo `CapaNucleo/clsVariables.cs` (llamadas `ChequearVariable*(número, "descripción", tipo, módulo, …)`); las tablas combinan esa descripción con el uso observado en el código. Tipo: L lógico, N entero, D decimal, C texto, F fecha.

### 12.1 Tesorería y pagos

| Parámetro | Tipo | Uso | Referencia |
|---|---|---|---|
| 134 | L | Abrir automáticamente la caja de pagos del día | `clsCajaPago.cs:29` |
| 135 | D | Tope de efectivo de la caja de pagos | `clsCajaPago.cs:45` |
| 2000 / 2001 / 2002 / 2004 | L | Caja de pagos admite cheques / valores / efectivo / transferencias | `clsCajaPago.cs:46-49` |
| 144 | N | “Pago a proveedores desde caja”: 1 = el efectivo de la OP queda como salida pendiente para la caja | `clsPagoFacturas.cs:429` |
| 2025 | D | Importe máximo para pagos a proveedores por caja (0 = sin tope) | `clsPagoFacturas.cs:429` |
| 146 | N | Categoría para pago con transferencias | `clsPagoFacturas.cs:588, 593` |
| 2066 | N | Categoría de depósito de valores en OP (salida) | `clsPagoFacturas.cs:598` |
| 2065 / 2079 | N | Categoría de tesorería para pagos con valores de terceros (“extracción de efectivo”) / con efectivo | `clsPagoFacturas.cs:613` |
| 3044 | L | Permite cargar fechas posteriores en pagos con transferencia | `clsPagoFacturas.cs:506` |
| 2433 | L | Usa la fecha del movimiento como fecha de emisión en pagos con transferencia | `clsPagoFacturas.cs:510` |
| 2034 | N | Concepto de adelanto de sueldo | `clsPagoFacturas.cs:361, 777` |
| 2538 | N | Tipo de novedad para adelantos de sueldo | `clsPagoFacturas.cs:776`, `clsIvaCom.cs:160` |
| 2035 | N | Concepto de anticipos a proveedores | `clsIvaCom.cs:182` |
| 2017 | L | Permite anticipos a proveedores sin rubro | `clsIvaCom.cs:193` |
| 2201 | N | Modo “permitir pago” de facturas (1 todas, 3 hasta monto) | `clsIvaCom.cs:148` |
| 2457 | D | Monto máximo de habilitación automática de pago | `clsIvaCom.cs:155` |
| 186 | N | Moneda por defecto en la caja | `clsTesoreria.cs:189` |
| 2067 | N | Cuenta de movimientos (`BANKOS` con `BIC = 2`) para cheques rechazados | `clsTesoreria.cs:849, 2339` |
| 2076 | N | Cuenta (categoría) de movimiento para cambio de valores | `clsCierreDiario.cs:691, 758` |
| 2952 | L | Presentar retenciones automáticamente (en el cierre de caja) | `clsCajas.cs:524` |
| 2543 | L | No validar capital pagado en cierre de cajas (si está desactivado, se registran los pagos de capital) | `clsCajas.cs:608` |
| 2688 | L | Habilita cierre de caja de varios días (solo efectivo) | `clsCajas.cs:662` |
| 2384 | N | Concepto exento para cheques rechazados entregados | `clsTesoreria.cs:1545` |
| 2517 | N | Concepto de gasto por rechazo | `clsTesoreria.cs:1566` |
| 2046 / 813 / 490 / 498 | N | Conceptos de comisiones, comisiones con IVA diferencial, importe exento e impuestos en la liquidación de tarjetas | `clsTesoreria.cs:1639-1651` |
| 1008 / 2409 / 3177 / 3178 | N/N/N/L | Rechazo de cupones: vendedor por defecto, tipo de cuota del anticipo, concepto del rechazo, generar comprobante formal | `clsTesoreria.cs:1405-1408` |
| 2378 | L | Permite cobros de cupones sin comisiones | `clsTesoreria.cs:1778` |
| 370 | C | Informe para imprimir valores (cheques) | `clsChequeras.cs:408` |
| 2372 | C | Firmantes de OP del archivo exportado para el banco (separados por coma) | `clsInformes_Compras.cs:3353` |
| 2573 | C | CBU para transferencias de pago a proveedores (Interbanking) | `clsInformes_Compras.cs:3453` |

### 12.2 Retenciones a proveedores

| Parámetro | Tipo | Uso | Referencia |
|---|---|---|---|
| 2037 / 2039 / 2041 / 2043 | L | Habilita retenciones de IIBB / IVA / Ganancias / SUSS | `Retenciones.cs:85-88` |
| 410 | L | No retener en comprobantes no formales | `Retenciones.cs:221` |
| 2310 | D | % de IVA a considerar para retenciones en adelantos (también se usa para comprobantes sin IVA discriminado) | `Retenciones.cs:287, 297` |
| 2012 | C | Punto de venta para retenciones de IIBB | `Retenciones.cs:129` |
| 2045 | N | Día límite de presentación de retenciones (después, se informa el mes siguiente) | `Retenciones.cs:159, 203` |

### 12.3 Contabilidad y cierre automático

| Parámetro | Tipo | Uso | Referencia |
|---|---|---|---|
| 2101–2164, 513, 3141 | D | Cuentas contables por defecto (ver `TipoCuenta`) | `TipoCuenta.cs:3-62` |
| 508 / 509 / 514 | C | Prefijo de Pasivo / Patrimonio neto / Activo | `clsCierreDiario.cs:7965-7967` |
| 510 / 511 | C | Prefijo de Ganancias / Pérdidas | `clsCierreDiario.cs:7904-7905` |
| 512 | C | Prefijo de cuentas de orden | `clsCierreDiario.cs:7864` |
| 2528 | C | Fecha de cierre contable | `clsAsiento.cs:767` |
| 2978 | N | Decimales de distribución por secciones | `clsAsiento.cs:793` |
| 2547 / 2714 | L | Usa secciones (general / sueldos) | `clsCierreDiario.cs:290-292` |
| 543 | N | Código de impuesto IVA (para secciones del IVA compras) | `clsCierreDiario.cs:2328` |
| 2890 | L | Registrar como gasto el IVA no tomado | `clsCierreDiario.cs:2137` |
| 2902 | L | Permite cargar y mostrar % de IVA en compras por secciones | `clsCierreDiario.cs:2138` |
| 2162 | D | Cuenta para productos pendientes de entrega (≠ 0 activa el asiento de remitos) | `clsCierreDiario.cs:434` |
| 2982 | L | Generar asiento con todos los remitos | `clsCierreDiario.cs:2450` |
| 2734 | L | Mostrar asiento de productos en comodato | `clsCierreDiario.cs:3330` |
| 2166 / 2167 | D | Técnica: cuenta para horas normales y extra / cuenta para horas valuadas de los participantes de OT | `clsCierreDiario.cs:3377-3378` |
| 2722 / 2723 | D | Importe de hora normal / extra | `clsCierreDiario.cs:3546-3547` |
| 2548 | L | Usar la cuenta de compras del rubro en asientos de OT y OM | `clsCierreDiario.cs:3432` |
| 755 / 2670 | N | Comprobante de retiro de materiales de viviendas / obra por defecto para vales de vivienda | `clsCierreDiario.cs:3916-3917` |
| 2207 | N | Formato de asiento de sueldos (1, 2, 3) | `clsCierreDiario.cs:4360` |
| 2191 | L | No usar grupos contables en los asientos | `clsCierreDiario.cs:4601` |
| 2190 | N | Tipo de liquidación a deudores por servicios | `clsCierreDiario.cs:4612, 6243` |
| 2619 | N | Deudores por refinanciación | `clsCierreDiario.cs:6213` |
| 73 / 2636 / 2916 | L | Capital: se suscribe al facturar / se suscribe en la afiliación / se integra en el pago | `clsCierreDiario.cs:6579, 6597-6598` |
| 2139 | D | Cuenta contable para ajuste por inflación | `clsCierreDiario.cs:6784` |
| 3076 | L | Usar valores históricos de bienes de uso para amortización e inflación | `clsCierreDiario.cs:296` |
| 2936 | L | Separar cuentas de revalúo | `clsCierreDiario.cs:294` |
| 500, 501, 502, 504, 505, 506, 67, 432, 2376, 2785, 2778 | C/F | Fechas de cierre por módulo | `Nucleo.cs:5327-5373` |

### 12.4 Compras y stock

| Parámetro | Tipo | Uso | Referencia |
|---|---|---|---|
| 2640 | L | Generar SA sin autorizar automáticamente (si está desactivado, se autoautoriza según permisos) | `clsSAprov.cs:133` |
| 2036 | N | Días de vigencia de la SA | `clsSAprov.cs:284` |
| 2377 | N | Valor por defecto al cargar OC (2 = pendiente de autorizar si supera el monto) | `frmComprobantes_Handler.cs:1462` |
| 2382 | D | Importe mínimo de OC para guardarla pendiente de autorizar | `frmComprobantes_Handler.cs:1462` |
| 2365 | L | Solo advertir (en vez de bloquear) comprobantes no autorizados para la situación de IVA | `frmComprobantes_Handler.cs:1220` |
| 2502 / 2503 | N | Rubro de vivienda de la factura / rubro exigido a los productos | `frmComprobantes_Handler.cs:1231-1233` |
| 2403 | N | Concepto a facturar por descuento en comprobantes de compra | `frmComprobantes_Handler.cs:1095, 2163` |
| 583 | L | Factura de compra independiente de los remitos de depósito (la factura **no** mueve stock) | `frmComprobantes_Handler.cs:2270` |
| 264 | L | No actualizar el precio de compra al registrar facturas | `frmComprobantes_Handler.cs:785, 1071` |
| 2647 | L | Copiar el motivo de compra a observaciones al importar OC | `frmComprobantes_Handler.cs:921` |
| 2690 / 2791 | L | Al importar ítems, tomar el % de IVA del documento origen / no tomar el IVA del producto | `clsComp_Com.cs:45`, `clsNPedido.cs:257`, `clsIvaCom.cs:599` |
| 527 | N | Situación de IVA de la cooperativa | `clsSCotiz.cs:1750` |
| 2112 | D | Cuenta “Compras” (por defecto de proveedores) | `clsCuentas_Asignadas.cs:102` |
| 2653 / 2709 | L | No mostrar facturas y recibos de empleados en compras / no incluir datos de empleados | `clsInformes_Compras.cs:403, 890` |
| 432 | F | Fecha de cierre de stock | `clsMov_pro.cs:874` |
| 2341 | C | Método de cálculo de valorización por defecto | `clsInformes_Stock.cs:3077` |
| 2416 | L | Usar los precios de los productos trazables para la valuación | `clsInformes_Stock.cs:1273` |
| 460 / 3015 | N | Concepto de horas hombre en OT / producto para costo de mano de obra | `clsInformes_Stock.cs:1339, 1634` |
| 2899 | L | Permitir importar productos de presupuestos en vales | `frmVales_Handler.cs:127` |
| 2914 | L | Validar si el presupuesto tiene obra asignada | `clsPresupuesto.cs:1131` |
| 2953 / 3032 | N | Producto flete / molde en presupuestos | `clsPresupuesto.cs:576-577` |
| 3049 | L | Validar que no se repita la matrícula del producto | `clsProdSer.cs:1037` |
| 3003 | L | Mover stock al lanzar el parte de producción | `clsOfParteProduccion.cs:678` |
| 518 / 519 | C | Nombre / CUIT de la cooperativa | `clsLeerComprobante.cs:141`, `clsInformes_Sueldo.cs:840` |

### 12.5 Sueldos

| Parámetro | Tipo | Uso | Referencia |
|---|---|---|---|
| 2611 | N | Año calendario para liquidar Ganancias (condiciona deducciones mensuales y la novedad tipo 27) | `clsDatosEmpleado.cs:344`, `clsSueldos.cs:1281` |
| 2538 | N | Tipo de novedad para adelantos de sueldo desde compras | `clsPagoFacturas.cs:776` |
| 2763 | L | SIRADIG: cargar en noviembre las novedades de diciembre (tramas corridas) | `clsNovedades.cs:1196` |
| 3016 | L | Clasificar el redondeo como no remunerativo | `clsSueldos.cs:1100` |
| 2288 | L | Permitir modificar la fecha de transferencia en el pago de sueldos | `clsSueldos.cs:710` |
| 2886 | L | Usar recibos sin firma digital en el portal | `clsSueldos.cs:822` |
| 2437 / 2438 | D | Tope de remuneración imponible SICOSS (meses SAC / resto) | `clsInformes_Sueldo.cs:779-780` |
| 3065 | L | Topear vacaciones proporcionales en LSD | `LibroSueldoDigital.cs:325` |
| 2262, 2406, 2449, 2671, 2672, 2944, 326 | C/N | Datos para archivos de acreditación bancaria | `clsInformes_Sueldo.cs:2007-3141` |
| 2468 | L | Banco Nación: usar la cuenta bancaria asignada al empleado | `clsInformes_Sueldo.cs:2511` |
| 3129 | L | Varias cuentas bancarias por empleado | `clsInformes_Sueldo.cs:1638` |
| 2376 | C | Fecha de cierre de sueldos | `Nucleo.cs:5359` |

---

## 13. Implicancias para GoodApps

1. **Contabilidad en línea, no en lote.** Procoop reconstruye los asientos por rango de fechas sin marcar los comprobantes como contabilizados, y solo detecta duplicados por descripción. GoodApps debería generar el asiento en el mismo evento de negocio (factura, OP, cierre de caja, movimiento de stock), con un vínculo explícito documento → asiento y reversión automática al anular. Conviene conservar la opción de asiento resumen diario para módulos masivos (facturación y cobranza de servicios), pero como agregación de asientos ya generados.
2. **Motor de cuentas configurable.** El patrón “cuenta de la entidad → cuenta por regla con más coincidencias → cuenta por defecto” y la lista de “cuentas sin asignar” son valiosos y conviene replicarlos, pero como tablas de configuración tipadas (no números de cuenta guardados en parámetros 2101–2164). Validar la configuración antes de operar, no al contabilizar.
3. **Cierre de períodos unificado.** Reemplazar las 11 fechas de cierre sueltas por una entidad de períodos por módulo (abierto/cerrado/bloqueado) y ejercicios contables, con auditoría de quién cerró y reabrió.
4. **Retenciones como motor declarativo.** El esquema de `RETE_TIPO` (bases sumar/restar, mínimos, escalas con excedente, acumulación mensual o anual, devoluciones, numeración anual de certificados) cubre Ganancias, IIBB, IVA y SUSS. Replicarlo con escalas versionadas por vigencia (Procoop crea escalas “al vuelo” y las persiste), padrones de alícuotas por proveedor y exportaciones SIRE/SICORE/ARBA/SIRCAR como plugins.
5. **Compras con trazabilidad real.** Mantener la relación genérica ítem-origen → ítem-destino (`COMPRAS_RELACION`) con cantidades, pero agregar: estados formales por documento, aprobaciones por monto y por nivel configurables (hoy hay doble autorización solo en SA y bloqueo por monto solo en OC, con autorización sin control de permiso), y eliminar la autorización implícita que ocurre al procesar una SA.
6. **Tesorería con dos libros.** La separación “cartera/caja” (`TESORE`) y “bancos” (`RESBAN`) es razonable. Para GoodApps: cheques de terceros y propios como entidades con máquina de estados explícita, e-cheq nativo, conciliación con extractos importados (Interbanking o archivos bancarios) y saldo de extracto, y credenciales de integraciones en un almacén de secretos, no en tablas.
7. **Firma y entrega de OP con segregación de funciones.** Mantener el flujo firmar → entregar, pero exigir permisos también en las operaciones masivas, registrar usuario y fecha siempre, y permitir N firmantes configurables por monto.
8. **Stock con costo perpetuo.** Procoop valoriza a demanda y reescribe precios históricos de movimientos. GoodApps debería costear en línea (PPP o PEPS por depósito), con capas de costo, revaluaciones como movimientos propios y un cierre de stock que congele la valorización del período.
9. **Bienes de uso y fabricación como módulos opcionales.** La amortización lineal con prorrateo diario, mejoras, bajas y ajuste por inflación es necesaria para el balance de cooperativas; la fabricación (BOM, órdenes, partes, MRP simple) parece de uso puntual y podría quedar fuera del MVP.
10. **Sueldos: decidir construir o integrar.** El módulo es grande (fórmulas por concepto con funciones de Ganancias, SAC, LSD, SICOSS, F.1359, licencias, firma digital). Si se construye, el diseño de conceptos con clasificaciones SICOSS/F.1357 y fórmulas es reutilizable; el F.931 propiamente dicho no se calcula (se genera el TXT para SICOSS). Evaluar integrar con un liquidador externo y recibir el asiento y la OP de pago.
11. **Migración.** Las claves compuestas de texto (`ID_PPAGO`, `ID_IVACOM`, etc.) y los IDs por `MAX + 1` requieren tablas de mapeo. Los parámetros 2101–2164 deben migrarse como configuración contable, y las fechas de cierre como estado de períodos.

---

## 14. Dudas abiertas

1. **Uso real del Cierre automático:** ¿las cooperativas lo corren diario, mensual o solo antes del balance? ¿Usan asiento resumen o por operación? ¿Cómo evitan hoy los asientos duplicados si se corre dos veces el mismo rango?
2. **Retenciones:** ¿qué regímenes se usan efectivamente (Ganancias RG 830, IIBB por provincia, SUSS, IVA)? ¿Se cargan padrones de alícuotas por proveedor o se configuran a mano en `PROVEED_RET`? ¿Cómo se presentan (SICORE, SIRE, ARBA, SIRCAR)?
3. **P410 y P2310:** confirmar el significado exacto (solo comprobantes que informan impuestos / alícuota presunta) con una cooperativa que los tenga activos.
4. **Circuito de compras:** ¿qué tan usado es el circuito completo SA → cotización → OC → remito → factura frente a cargar la factura directa? ¿Se usan licitaciones y concursos de precios?
5. **Autorización de OC:** `AutorizarOrdenesCompras` no valida permisos en la capa de negocio; ¿lo controla la pantalla?
6. **Firmas de OP:** relación entre `PPAGOS.FIRMA`, `PPAGOS_FIRMANTES` y `FIRMASELECTRONICAS`; ¿cuál se usa hoy y con cuántos firmantes?
7. **P583 y P2162:** ¿cuántas cooperativas ingresan stock con la factura y cuántas con el remito? Define el diseño de la recepción en GoodApps.
8. **Valorización de stock:** ¿qué método usan (PEPS/PPP)? ¿Con qué frecuencia corren la valorización y la revaluación?
9. **Fabricación:** ¿qué cooperativas usan órdenes y partes de producción (parece orientado a fábricas de medidores/postes)? ¿Entra en el alcance?
10. **Sueldos:** ¿las cooperativas liquidan en Procoop o en un sistema externo? ¿Cuántos convenios (Luz y Fuerza, FATLyF, telefónicos, comercio) y qué volumen de empleados?
11. **F.931:** confirmar que solo se exporta el TXT para SICOSS y no se emite ni controla el F.931 dentro de Procoop.
12. **Interbanking:** ¿cuántas cooperativas lo tienen contratado? ¿La conciliación automática reemplaza a la manual?
13. **Parámetros:** las descripciones del catálogo `clsVariables.cs` a veces difieren del uso real (p. ej. P2310 dice “adelantos” pero también se aplica a comprobantes sin IVA discriminado; P2190 y P2619 tienen valores numéricos sin documentar). Conviene relevar los valores efectivos en dos o tres cooperativas.
14. **Ajuste por inflación:** ¿se usa el ajuste contable automático y el de bienes de uso, o lo hace el estudio contable por fuera?

---

## 15. Reglas adicionales (segunda pasada)

Complementa las secciones 2 a 11 con métodos que no estaban documentados, agrupados por clase. Las rutas siguen la convención del documento (`Carpeta/Archivo.cs:línea`, relativas a `binarios/decompilado/ReglasNegocio/`). Los defectos de Procoop detectados se señalan como **Defecto** para que GoodApps no los replique.

### 15.1 Tesorería

#### `clsCajaPago` (caja de pagos)

- **Caja del día y apertura automática** (`GetCajaPagoDelDia`, `ReglasNegocio.Tesoreria/clsCajaPago.cs:11-25`; `ValidarAperturadeCajaAutomatica`, `:27-61`): se busca la `CAJAPAGO` de hoy con `CIERRE` vacío. Si no existe o está cerrada y P134 está activo, se reabre la existente o se crea una nueva con tope de efectivo `MAXEFEC` = P135 y medios habilitados `PAGACHEQ`/`PAGAVALO`/`PAGAEFEC`/`PAGATRANSF` tomados de P2000/P2001/P2002/P2004. Sin P134 el pago se rechaza con “No se encontró una caja habilitada” **[VERIFICAR]** (valores de P134/P135/P2000–P2004 en LAG).
- **Efectivo disponible para pagos** (`GetCajaCobranza_CajaPagos`, `:83-98`): efectivo cobrado en la caja (`PLAN_CAJ.ENT_EFE`) menos el neto de movimientos `TESORE` de esa caja y fecha.
- **Consulta de cajas** (`ConsultarCajas`, `:110-135`): con mes 0 se pretende traer los últimos 12 meses. **Defecto:** el `AddYears(-1)` de la fecha desde descarta su resultado (`:124`), así que el rango real no retrocede un año.
- Métodos sin regla de negocio: `GetCajaPago` (`:100`).

#### `clsCajas` (cajas de cobranza)

- **Cajas abiertas** (`CajaAbierta`, `ReglasNegocio.Tesoreria/clsCajas.cs:119`; `Get_CAJAS_Abiertas` por fecha o rango, `:128-151`; versión web, `:153`; por usuario y fecha, `:185`; anteriores abiertas, `:190`): una caja está abierta mientras `CIERRE` es nulo.
- **Número de caja libre** (`Get_CAJAS_NoDisponible`, `:169-183`; `Get_NumeroCaja`, `:205`): un número está ocupado si se usó ese día, si es el número de caja de un banco (`BANKOS.CAJA > 0`) o si está asignado a un usuario (`USERS.COD_CAJ`, `Get_Caja_Asignada`, `:163`). Se asigna el primer número libre.
- **Apertura web** (`AbrirCajaWeb`, `:234`): rechaza el número de caja 0.
- Métodos sin regla de negocio: `Get_CAJAS` (`:195`).

#### `clsChequeras` (cheques propios)

- Estados del cheque propio: 0 Disponible, 2 Anulado, 3 Rechazado (además de los estados de uso). **Anular** (`AnularCheque`, `ReglasNegocio.Tesoreria/clsChequeras.cs:55`) solo procede desde Disponible; **desmarcar** (`DesmarcarCheque`, `:75`) solo vuelve de Anulado a Disponible; **rechazar** (`SetRechazado`, `:454`) pasa a 3 salvo que ya esté rechazado.
- **Modificar un cheque emitido** (`ActualizarCheque`, `:40`): cambia fecha y observación y replica la fecha en el `RESBAN` del cheque.
- **Alta y baja de chequeras** (`GuardarChequeras`, `:194-251`): al crear, genera un cheque por número desde “Desde” hasta completar la cantidad; para **e-cheq** genera la cantidad indicada de registros con número 0 (el número se asigna al usar). Al eliminar una chequera completa se borra; si se elimina parcialmente, los cheques disponibles pasan a anulados.
- **Impresión** (`GetChequesAImprimir`, `:362`; `ValidarChequesImprimir`, `:432-452`): el beneficiario es el nombre de pago de la OP (`PPAGOS.NOM_PAG`), si no el “a la orden” del proveedor (`PROVEED.OPAGO`) y si no su razón social; el importe se imprime en letras. Desde/hasta son obligatorios, desde ≤ hasta, y la cantidad debe coincidir con los cheques del rango ya usados en OP (deben ser correlativos). El reporte es el de la chequera (`BANKOS.INF_CHEQUE`) o P370 (por defecto “Tesoreria_Cheques”), con variante “_1” para un solo cheque **[VERIFICAR]** (formato del banco de LAG). Al marcar impresos se advierte si alguno ya lo estaba.
- Métodos sin regla de negocio: `GetCheques` (`:28, 347, 357`), `GetCheque` (`:35`).

#### `clsConciliacion`, `clsRetencio`, `clsTarjetas`

- **Retenciones sufridas** (`GetRetencio`, `ReglasNegocio.Tesoreria/clsRetencio.cs:41-72`): cada retención se arma con ID incremental, `PRESENTADO = false` y régimen nulo si es 0. Pendientes = no presentadas (`GetRetencionesPendientes`, `:74`).
- **Cupones de tarjeta** (`GetCuponesTarjeta`, `ReglasNegocio.Tesoreria/clsTarjetas.cs:41`): “pendiente de presentación” = no presentado y con fecha de tesorería; “pendiente de pago” = presentado y no pagado. El código de tarjeta es único (`ExisteTarjeta`, `:36`). Los **recargos por cuotas** se guardan por tarjeta (cuotas, tipo y valor de recargo) en `TARJETAS_RECARGO` (`Presave`, `:95-133`). Se puede corregir tarjeta, número de cupón y autorización (`Actualizar_CuponTar`, `:136`). El **rechazo de cupón** genera un anticipo al cliente y marca `RECHAZADO` y `FEC_RECHAZO` (`Crear_Anticipo`, `:160-192`).
- Métodos sin regla de negocio: `clsConciliacion.GetMovtDesdeResban` (`ReglasNegocio.Tesoreria/clsConciliacion.cs:152`), `GetDetallesCupontar` (`:168`), `clsRetencio.ObtenerProv_Retencion` (`clsRetencio.cs:24`), `clsTarjetas.CargarTarjeta` (`clsTarjetas.cs:31`), `GetCupon` (`:60`).

#### `clsTesoreria`

- **Registro en bancos** (`RegistrarResBan`, `ReglasNegocio.Tesoreria/clsTesoreria.cs:408-474`): controla el cierre de Tesorería; si la fecha del ítem es anterior a 1950 usa la del movimiento; trunca concepto a 50 y observación a 150 caracteres; importe negativo va a `DEBE` y positivo a `HABER` (en `RESBAN` el `HABER` es ingreso); la fecha probable de acreditación `FEPROACRE` solo se completa en depósitos de valores; la cotización es 1 sin moneda, `COT_PES` en moneda extranjera y nula en moneda local. **Defecto:** la segunda sobrecarga (`:513-564`) carga `DEBE_HIS`/`HABER_HIS` invertidos respecto de la primera **[VERIFICAR]** (impacto en informes en moneda histórica).
- **Edición de un pago de retención** (`GuardarPagoModificado`, `:476-511`): solo para retenciones; permite cambiar número y tipo de retención y el concepto/observación del `TESORE`.
- **Numeración** (`GetProximo_ResBan`, `:566`; `GetProximo_IdTesore`, `:575`; `NuevoNroTesoreria`, `:1068-1073`): IDs por máximo + 1. El número de operación es el mayor entre `TESORE.COD_INT` y `RESBAN.NUM_MOVT` más 1, sobre la numeración del comprobante “Operación de tesorería”.
- **Medios de pago de una operación** (`GetMediosPago`, `:694-835`): en `TESORE`, `COD_TIPO` 3 = cheques (de `VALORES1` o `VALORES` según el sentido) y `COD_MOV` 55 con tipo 5 = retenciones; en `RESBAN`, para cheques propios se indica si la chequera es electrónica o física, y los movimientos 59/60 se toman del propio `RESBAN`. Los cheques vinculados a un movimiento bancario (`GetChequesEnResBan`, `:873-884`) se buscan por `NUMDEPRECH` (tipos 59/60/72) o `NUMDEPRECU` (tipo 61). Los valores entregados rechazados se buscan en la cuenta P2067 (`getValoresEntregadosRechazados`, `:837`).
- **Enrutamiento de un movimiento** (`Registrar_Movimiento`, `:2283-2386`): transferencias y cheques propios van a `RESBAN` (un cheque propio negativo egresa el cheque; con “rechazo de valores entregados” lo marca rechazado; si no, lo anula). Un cheque de terceros **depositado** (estado 4) o **entregado** (3) que vuelve se registra en la cuenta de movimientos P2067 como tipo 60 (o 72 si estaba entregado, con fechas de hoy) y, si estaba depositado, además se registra un tipo 59 por el importe negativo en el banco del depósito. Un cheque en estado 6 genera un tipo 61 (recupero). Cualquier otro valor u otro medio va a `TESORE` y fija `NUM_TES` del valor **[VERIFICAR]** (cuenta P2067 configurada).
- **Consultas base** (`Get_Iquerable_Tesore`, `:1075-1108`; `Get_Iquerable_Resban`, `:1115-1163`; `Get_Iquerable_Resban_Conciliacion`, `:1165-1216`): excluyen anulados (`ENTRADA + SALIDA = 0`). En bancos, el tipo de fecha del informe es 1 = emisión (`FEC_EMI`), 2 = `FECHA`, 3 = registro, 4 = conciliación (con Interbanking, `FEC_CONC_INT`).
- **Presentación de retenciones** (`PresentarRetenciones`, `:1218-1275`): genera un único movimiento por la suma negativa y marca las retenciones con un `UPDATE` condicionado a `PRESENTADO = 0`; si la cantidad de filas actualizadas difiere de la seleccionada, hace rollback con “ya fue presentada” (control de concurrencia). La **anulación** (`AnularPresentarRetenciones`, `:1303-1337`) controla el cierre de Tesorería y que la suma de retenciones con ese número de presentación coincida con la salida del `TESORE`; anula y resetea. Igual criterio para **anular la presentación de cupones** (`AnularPresentarCupones`, `:1507-1541`, `COD_MOV` 62): solo cupones no pagados y la suma debe coincidir.
- **Anular una operación** (`Anular`, `:2156-2208`): anula todos los `TESORE` y `RESBAN` del mismo número interno, **sin** anular los cheques propios.
- **Comprobante de operación** (`GetDatosReporte`, `:2210-2248`): marca `IMPRESO`; para los tipos 1 y 2 vacía los ingresos del reporte.
- **CBU de proveedores** (`GetCta_bancaria`, `:2250`; `ReemplazarCuit_cta`, `:2265`): la cuenta bancaria se busca por CUIT; el reemplazo de CUIT se hace con SQL armado por concatenación (riesgo de inyección; en GoodApps usar parámetros).
- Métodos sin regla de negocio: `Actualizar_MedioPago` (`:389`, solo cupones), `Get_Iquerable_PlanCaj` (`:1110`), `PresentarSalidaRetenciones` (`:1277`), `GetTesore`/`GetResBan` (`:2135, 2140`), `EsPagoAProveedor` (`:2145`, `TESORE` con `ID_PPAGOS`), `GetPlanCaj_Pago` (`:2150`), `ExisteSucursal` (`:2260`), `Modificar_CuponTarjeta` (`:2271`, vacío).

#### `clsValores` (cheques de terceros)

- Estados de filtro especiales (`Estados_De_Filtro`, `ReglasNegocio.Tesoreria/clsValores.cs`): 100 = disponibles para pagos, 101 = rechazados no recuperados, 102 = transferidos desde caja. Recibidos = estado 1 (`ChequesRecibidos`, `:99`).
- **Alta de cheque** (`ValidarNuevoCheque`, `:160-179`): si la cuenta del librador está marcada `CTASUCE.RECIBIR`, se bloquea recibir sus cheques; se impide duplicar un cheque **solo si está en cartera** (estado 2), por lo que un mismo cheque depositado o entregado podría volver a cargarse **[VERIFICAR]**. Hay aviso si la cuenta tiene cheques rechazados sin recuperar (estado 6, `ValidarChequesRechazados`, `:354`).
- **Habilitar para pago a proveedores** (`MarcarPerPagPro`, `:111`): registra fecha y usuario (`FECPERPAG`, `USUPERPAG`).
- **Modificar** (`ModificarValor`, `:311`): en cheques de terceros también cambia banco, sucursal, cuenta y observación. `CambiarEstadoCheque` (`:181`) solo para egresos.
- Métodos sin regla de negocio: `GetCheques` (`:44-88`), `Get_CTASUCE` (`:149, 154`), `GetListadoValores` (`:348`), `GetChequesRechazados_Dt` (`:359`).

#### `clsInformes_Tesoreria`

- **Planilla diaria** (`GetPlanillaDiaria`, `ReglasNegocio.Tesoreria/clsInformes_Tesoreria.cs:214-275`): agrupa por tipo de movimiento con el neto y el saldo anterior.
- **Composición de cartera** (`GetComposicionCartera`, `:324-367`): por `COD_TIPO` 6 cupones, 3 valores, 1 efectivo, 5 retenciones, más los cupones presentados y no cobrados a la fecha.
- **Disponibilidades** (`GetDisponibilidades`, `:369-427`): filas de tesorería más los bancos marcados `INF_DISPO`, con saldo contable y operativo; la moneda extranjera se convierte con la última `COT_DOL` ≤ fecha; las cuentas con `BIC = 3` se informan como “Tesorería”.
- **Saldos de bancos** (`GetSaldosBancos`, `:1054`; `GetSaldosaFuturo`, `:1035`): saldo **operativo** por `FECHA` y **contable** por `FEC_EMI`; a futuro, lo vencido se agrupa en hoy.
- **Libro de bancos** (`GetLibroBancos`, `:1072`): saldo inicial, excluye `ESTADO = 'A'`, vincula la OP de caja para los tipos 71/9 y detalla las notas de débito/crédito de la OP cuando el banco es también proveedor.
- **Cheques no debitados** (`GetChequesNoDebitados`, `:981-1033`): cheques propios (`TIP_MOV` 2) y transferencias de OP no conciliados (o sin vínculo `RESBAN_MOVINT` cuando hay Interbanking), agrupados por semana.
- **Previsiones** (`GetPrevisiones_Agrupado`, `:1655`; `_Detallado`, `:1744`): compras pendientes con el saldo reconstruido a la fecha, cheques propios a pagar (`DEBE`, fecha futura, `TIP_MOV` 2) y valores en cartera no depositados. Es un flujo de fondos proyectado.
- **Cupones por estado** (`Imprimir_CuponesPorEstado`, `:181`): 0 en tesorería, 1 presentados, 2 pendientes de cobro, 3 cobrados. **Cobranza de tarjetas** (`GetCobranzaTarjetas`, `:870`): la retención de Seguridad Social se calcula por diferencia.
- Otros filtros: valores depositados = estados 4 a 7 (`GetValores`, `:566`); listado de valores con seis tipos de fecha, donde los recuperos incluyen transferencias, efectivo y valores del recupero (`GetListadoValores`, `:428`); movimientos de cuentas con estado 1 conciliados, 2 no conciliados, 3 por fecha de conciliación (`GetMovimientosCuentas`, `:932`); deuda prescripta por `PLAN_CAJ.PRESCRIPCION` (`GetDeudaPrescripta`, `:1637`); depósitos a acreditar por `FEPROACRE` con tipo 1 (`GetDepositos_ACreditaciones`, `:1824`).
- Métodos sin regla de negocio: `GetMovimientos` (`:277`), `GetValoresRecibidos` (`:603`), `GetTarjetas` (`:827`), `GetRetenciones` (`:899`), `GetCajasAbiertasCerradas` (`:1625`), `GetListados` (`:1849`).

#### `clsInterbanking` (conciliación)

- **Movimientos IB** (`GetMovimientosInterbank`, `ReglasNegocio.Tesoreria/clsInterbanking.cs:355-412`): la cuenta interna se identifica por el CBU guardado en el JSON `BANKOS.CTA_INTERBANKING`; filtro por estado (1 conciliados, 2 no conciliados, 3 por fecha de conciliación) y sentido débito/crédito.
- **Conciliar** (`GuardarConciliacion`, `:479-508`): crea un grupo `COD_CONC` = máximo + 1 con una fila por cada `RESBAN` (con `COD_MOVINT` 0) y otra por cada movimiento IB (con `COD_RESBAN` 0); admite N a M. **Defecto:** no valida que los importes de ambos lados cuadren. **Desconciliar** (`EliminarConciliacion`, `:510`) borra solo las filas del movimiento elegido y deja el resto del grupo.
- Los conciliados se leen en bloques de 2000 (`getMovimientosConciliados`, `:454`).
- Métodos sin regla de negocio: `GetMovimientosResban` (`:414`), `getCodigos` (`:607`, códigos IB distintos), `getDtComboBox`, `getJsonCta`, `getNroCuentaJson`, `getNombreBancosJson`.

### 15.2 Contabilidad

#### `clsAsiento`

- **Asientos de apertura/cierre** (`EsAsientoCierre`, `ReglasNegocio.Contabilidad/clsAsiento.cs:496`; `MarcarAsientoApertura_Cierre`, `:962`): un asiento es de apertura o cierre si está referenciado en `CTEJER` (apertura, cierre1, cierre2). Marcar asigna 1 = apertura o 2 = cierre y no remarca un asiento ya marcado.
- **Grabación de secciones** (`AgregarAConexion`, `:683-706`): asigna IDs y agrupa la distribución por sección, descartando importes 0.
- **Listado** (`GetAsientos`, `:851-881`): por fecha de asiento o de registro; un asiento es “Automático” si no tiene usuario de alta ni de modificación.
- **Eliminación masiva** (`ValidarEliminacionMasiva`, `:883-924`; `EliminacionMasiva`, `:926-944`): requiere el permiso `CTAsientoElimMas`, rechaza apertura/cierre, valida la fecha de cierre contable P2528 (`Validar_CierreContable`, `:946-960`) y el ejercicio abierto. **Defectos:** la validación falla si queda algún asiento sin seleccionar en la grilla (lógica invertida o, al menos, confusa), y la eliminación masiva borra secciones, renglones y cabeceras **sin revertir las amortizaciones** de bienes de uso, a diferencia de la eliminación individual **[VERIFICAR]**.
- **Importación desde Excel** (`ImportarAsientos`, `:1005-1094`; `ImportarAsientosConSeccion`, `:1096`; `ImportarAsientoUnico`, `:1198-1301`; `ValidarImportacion`, `:1303-1344`): columnas Código_Asiento, Descripción, Fecha, Cuenta, Debe, Haber; se agrupa por código + descripción + fecha. Con secciones, la cuenta es el `COD_PLAN` y se traduce a `COD_CTA`, con una sección por renglón. En el asiento único se agrupa por cuenta + centro de costo + lado; las cuentas de 11 dígitos se toman tal cual y las demás se buscan por `COD_PLAN`. La validación exige que las cuentas existan y que cada asiento balancee. **Defectos:** el número `COD_AS` se toma del máximo **global** + 1 (no por ejercicio, como en el alta manual) y la importación no valida ejercicio abierto ni P2528.
- Métodos sin regla de negocio: `GetDetalleToAdd` (`:74`), `EliminarDetalle` (`:337`).

#### `clsAsignarCuentasYRubros` (reasignación masiva)

- **Reasignación** (`Reasignacion`, `ReglasNegocio.Contabilidad/clsAsignarCuentasYRubros.cs:176-216`): cambia en bloque el rubro de productos, servicios, impuestos y conceptos de compra (`ObtenerElementosCambioRubro`, `:75`) o la cuenta contable de bancos, parámetros 2100–2189, proveedores y tipos de factura (`ObtenerElementosCambioCuenta`, `:118`). En proveedores, la cuenta 0 se guarda como nula. Se audita como “Reasignar Cuentas y Rubros”. Cambiar un rubro (`ActualizarRubro`, `:55`) lo clona como alta nueva con auditoría.

#### `clsCtEjer` (ejercicios)

- **Validación de ejercicio** (`ValidarEjercicio`, `ReglasNegocio.Contabilidad/clsCtEjer.cs:36-64`): desde < hasta, número único y ninguna de las dos fechas puede caer dentro de otro ejercicio. **Defectos:** el mensaje de error de fechas está invertido y no detecta un ejercicio nuevo que contenga por completo a otro.
- Métodos sin regla de negocio: `GetUltimoNroEjercicio` (`:9`), `GetEjercicioActual` (`:18`), `GetEjercicioALaFecha` (`:23`).

#### `clsCuentas_Asignadas` (resolución de cuentas)

Complementa 6.1. La lista de cuentas se cachea estáticamente. Cuando un parámetro-cuenta falta, `GetCuenta(TipoCuenta)` (`ReglasNegocio.Contabilidad/clsCuentas_Asignadas.cs:67`) lo agrega a la lista de “cuentas sin asignar” con la ruta del menú donde se configura. Cascadas por tipo:

| Método | Cascada de resolución |
|---|---|
| `GetCuentaProveedor` (`:97`) | `PROVEED.CTA_CONTA` → P2112 |
| `GetCuentaAlicuota` IVA (`:118-153`) | P2113 (compras) o P2104 (ventas) → cuenta de la alícuota (`CTA_COMPRAS`/`CTA_VENTAS`) → rubro |
| `GetCuentaAlicuota` percepción (`:118-153`) | P2106 (compras) o P2107 (ventas) → `CTA_VENTAS_PER` de la alícuota → P2160 → rubro |
| `GetCuentaBanco` (`:172`) | `CTA_PENDEB` (pendiente de débito) → `CTA_CONTA` |
| `GetCuentaTipoFac` (`:193`) | `COD_CTA` → `CTA_REF` |
| `GetCuentaGrupoContable` (`:449-511`) | grupo 0 → P2102/2103/2101/2122/2121/2133; grupo ≠ 0 → `GRU_CON.CTA_COBF/COBR/CAJ/VAL/TAR/CAPI` |
| `GetCuentaRubroVenta_Personalizada` (`:261-302`) | regla `CTCUENTA_ASIGNA` con `RUBRO_AFECTADO`; −1 si no hay regla |
| `GetCuentaRubro_ProdYSer` (`:304-362`) | campo del rubro según uso: compras, ventas, otros, costo de venta, costo de baja, amortización anual y acumulada, origen, disminución, revalúo |
| Retenciones | cobro: `RETS_TIPO.CTA_CONT` (`:393`); pago: `RETE_TIPO.CTA_PROV` (`:410`) |
| Sueldos | concepto `SU_CONCEPTOS.COD_CTA` (`:513`); empresa `CTA_CONTRI` para contribuciones o `COD_CTA` (`:530`); personalizado `SU_ASIENTOS.CTA_DEBE/CTA_HABER` (`:547`); sindicato `CTA_GRAL` (`:564`) y `CTA_CARGAS` (`:581`) |
| Obras | `GRPOBRA.COD_CTA` (`GetCuenta` privado, `:598-671`) |

Métodos sin regla de negocio: `GetNombreCuenta` (`:43`), `GetConCuenta` (`:53`), `GetCuentaAlicuota` por código (`:155`), `GetCuentaCategoriaBanco` (`:211`), `GetCuentaAsig` (`:228`, ya en 6.4), `GetCuentaRubCapi` (`:364`), `GetGridViewAsientoPersonalizado` (`:427`).

El enum `TipoCuenta` (`ReglasNegocio.Contabilidad/TipoCuenta.cs`) da el significado de cada parámetro-cuenta; los principales son: 513 asignación de resultados, 2101 cierre de caja, 2102 facturación, 2103 refinanciaciones, 2104/2105 IVA inscripto/no inscripto, 2106/2107 percepciones, 2108 energía, 2109 intereses, 2110 descuentos en remitos, 2111 desconocidos, 2112 compras, 2113 IVA crédito fiscal, 2114 impuestos varios, 2118/2119 créditos/débitos bancarios, 2120 retención IVA de cobro, 2121 tarjetas, 2122 valores en cartera, 2123/2124 retenciones de cobro, 2148/2149 pago a proveedores en efectivo/valores, 2150–2156 stock y pagos, 2158 prescripción de deuda, 3141 productos en proceso.

#### `clsContabilidad`

- **Porcentaje de sección** (`CalcularPorcentaje`, `ReglasNegocio.Contabilidad/clsContabilidad.cs:414`): |importe redondeado × 100 / importe del ítem|.
- **Saldo de cuentas** (`GetCuentas`, `:455`): Σ debe − haber de todo el histórico (sin corte por ejercicio).
- **Secciones aplicables** (`Get_Secciones`, `:483-593`): si no hay asignación específica para el elemento, devuelve todas las secciones con 0 %. Tipos de operación/elemento relevantes: ajuste por inflación (op 3/elem 8), asiento manual (op 4/elem 9), costo de mercadería vendida (elem 10), sección por defecto (op 4/elem 11).
- **Plan de cuentas** (`GetCuentaPadre`, `:1216-1245`): la cuenta de 11 dígitos se descompone en niveles 6 + 5 y luego prefijos de 5, 3 y 1 dígitos. Un rubro solo puede pertenecer a un rubro de capitalización (`Exist_Rubro_Rubcapi`, `:2042`); imputable = “S” (`validarImputable`, `:2047`).
- **Renumerar asientos** (`RenumerarAsientos`, `:2052`): número = prefijo de 4 dígitos + correlativo de 4 dígitos, ordenado por fecha, con apertura primero, cierre al final y luego por registro; puede continuar desde el último.
- **Renumerar cuenta** (`Renumerar_Cuenta`, `:2417-2463`): clona la cuenta origen con el número destino si no existe, actualiza por SQL todas las columnas de cuentas (`ObtenerTablasConCuentas`, `:2481`) y borra el origen. **Defecto:** ver la corrección en 5.1 sobre `VARIABLE`.
- **Sumas y saldos por sección** (`GetSeccionesSumasYSaldos`, `:1813-1857`; mensual, `:1859-2027`): ingresos = cuentas que empiezan con “4” y egresos = cuentas que empiezan con “5” (fijo en el código **[VERIFICAR]** contra el plan de LAG); máximo 12 meses; padres en niveles de 6, 4, 2 y 1 dígitos; columnas de mapeo FEDECOBA/SUBCUENTA con porcentaje.
- **SIRCAR** (`ExportarArchivos`, `:654`; `Get_InformeSIRCAR`, `:714`): si P2264 (“sigla del nombre del cliente”) es “AZUL”, cambia el formato de percepciones de Buenos Aires (personalización para otra cooperativa; no aplica a LAG).
- **Modelos de distribución** (`CargarModelos`, `:2323`; `Get_Modelo_Grilla`, `:2336`; `Get_Modelos_DataTable`, `:2355`): plantillas de reparto por secciones. Los grupos contables agregan “SIN ASIGNAR” (`GetGruposContable`, `:2300`).
- Métodos sin regla de negocio: `Get_Secciones_Asientos` (`:595`), `Get_Codigo_CuentaContable` (`:1206`), `GetDetalleSecciones` (`:1316`), `GetSecciones` (`:2029`), `contieneAsientos` (`:2488`), `existeCuenta` (`:2493`), `Get_ComboOrdenarInformeSIRCAR` (`:2498`).

#### `clsCierreDiario` (complementos)

- **Pagos de capital/servicios a contabilizar** (`GetPagos`, `ReglasNegocio.Contabilidad/clsCierreDiario.cs:5800-5824`): pagos `PAG_SOC` no anulados, filtrados por prescripción, titulares activos/no activos y grupo contable salvo P2191. **Defecto:** filtra por el grupo contable “actual” del objeto en lugar del parámetro recibido.
- **Aviso de cajas abiertas** (`GetCajasAbiertas`, `:6394`): lista las fechas del rango con cajas abiertas antes de generar asientos.
- **Cierre de ejercicio** (`ValidarCierre`, `:7854`; `GenerarCierreEjercicio`, `:7880`): resultados → patrimoniales → apertura, ya descrito en 5.4. `SetParametrosAsientoBienes` (`:397`) prepara la amortización anual y las bajas.

#### `clsInformes_Contabilidad`

- **Libro diario** (`GetLibroDiario`, `ReglasNegocio.Contabilidad/clsInformes_Contabilidad.cs:279-408`): renumeración opcional desde N **solo para la impresión** (no persiste) y detalle por sección con porcentaje. El rubricado pone la apertura primero (`GetLibroDiarioRubricado`, `:410`).
- **Control previo a balances** (`CuentasNoImputables_ConSaldo`, `:498`): avisa (hasta 20) cuentas no imputables con movimientos.
- **Balances** (`GetBalanceDiario`, `:534`, prefijos de 4, 2 y 1 dígitos; `GetBalanceEntrePeriodos`, `:553`, dos subperíodos con padres acumulados; `GetSaldosCuentas`, `:1093`, por nivel de ceros).
- **Archivo DGR de percepciones** (`Exportar_ArchivoDGR`, `:585`): usa P2008 (nombre del agente de retención), P2010 (número de agente), P2445 (concepto de percepción IIBB), P2446 (alícuota), P2935 (código de impuesto de la base imponible) y P2353 **[VERIFICAR]** (su descripción en el catálogo es “localidad por defecto para el alta de persona”, uso dudoso en este archivo).
- **OCEBA** (`ExportarArchivo_OCEBA`, `:864-1091`): planilla para el regulador eléctrico de Buenos Aires (no aplica a LAG, que está en Córdoba **[VERIFICAR]** si el ERSeP pide algo equivalente). Usa el mapeo FEDECOBA/SUBCUENTA, el saldo según `SDO_CTA`, P519 (CUIT), P2823 (código de distribuidora OCEBA), P511 y la cuenta de resultados P513 calculada como activo − (pasivo + patrimonio neto).
- **Bienes de uso** (`Get_Cuadro_BienUso`, `:1688`: origen + mejoras − disminuciones; `Get_Cuadro_Amortizacion`, `:1793`: apertura, ejercicio y cierre).
- **Indicadores de gestión**: servicios conectados (`SERSOC` condición 2/3, prepagos, por tipo y categoría; `Get_ServiciosConectados`, `:1903`), servicio tomado vs facturado (ítems tipo 2 por categoría, kW e importe; `:1973`), evolución de cobranza caja vs banco (`:2019`), cobranza contra facturado por primer vencimiento (`:2063`), composición de deuda por servicio prorrateando saldo/total (`:2095`), productividad de cajas por franja horaria (cobranzas operación 1, sin banco; `ProductividadCaja`, `:2854`), anticipos a fecha con deuda reconstruida y prorrateada por ítem (`Get_InformeAnticiposAFecha`, `:4322`).
- **Gastos e ingresos por sección** (`Get_Datos_GastosIngreso`, `:2219`; `Get_Ingresos_Egresos_Secciones_Grupos`, `:2613`; `Get_GastoIngreso_Seccion`, `:2653`; `Get_Secciones_Grupos`, `:2579`): ingresos = ítems facturados × % de asignación (`CTSECCION_ASIGNA` tipo 1); egresos = cuentas “5”; grupos de secciones por `CTSECCION.ID_GRUPO` y `CTSECCION_GP_ASIGNA`.
- Métodos sin regla de negocio: `GetSumasYSaldos` (`:457`), `GetIngresosEgresosXSecciones` (`:1316, 1330`) y `_Mensual` (`:1441`) (salida Excel por Interop), `AsignarValor`, `Get_ExcelGastoIngreso`.

### 15.3 Compras

#### Tipos de documento en `COMPRAS_RELACION`

`TIPO_ORI`/`TIPO_DES`: 1 = solicitud de aprovisionamiento, 2 = solicitud de cotización, 3 = orden de compra, 4 = remito, 5 = factura (`clsSAprov.Procesar`, `ReglasNegocio.Facturacion/clsSAprov.cs:653-674`; `clsSCotiz.Procesar`, `clsSCotiz.cs:1848-1862`; `clsNPedido.Procesar`, `clsNPedido.cs:327-341`). La relación también va **de factura a remito** (5 → 4) cuando primero se factura y después llega el remito: el remito consume el pendiente del ítem de factura y queda con saldo 0 y estado “F” (`clsIvaCom.Procesar`, `clsIvaCom.cs:629-646`). Deshacer (`DeshacerProceso` en cada clase) devuelve la cantidad al pendiente y borra la relación.

#### Reglas comunes al importar pendientes

Al importar ítems de un documento anterior (`GetRem_Pendientes`, `clsComp_Com.cs:35-66`; `GetNP_Pendientes`, `clsNPedido.cs:246-286`; `GetFPITEM_Pendientes`, `clsIvaCom.cs:589-627`; `GetSC_Pendientes`, `clsSCotiz.cs:1794-1846`):
- Solicitado y recibido se firman según `DEB_CRE` (1 suma, 2 resta).
- El **costo neto** se toma del precio unitario si el ítem tenía IVA discriminado; si no, se desgrava: `costo = precio / (1 + %IVA/100)` redondeado a 6 decimales.
- El % de IVA es el del documento origen si P2690 o P2791 están activos; si no, el del producto **[VERIFICAR]**.
- OC importables: no anuladas (`A`), no cerradas (`C`) y no bloqueadas; cotizaciones importables: no rechazadas (`R`).

#### `clsSAprov` (solicitud de aprovisionamiento)

- **Modificación** (`Modificacion`, `ReglasNegocio.Facturacion/clsSAprov.cs:191-249`): borra los ítems quitados, actualiza los existentes (cantidad, solicitante, rechazo, destinatario) y agrega los nuevos con pendiente = cantidad.
- **Búsqueda de pedido abierto de un producto** (`Get_SolicitudAprov`, `:251-270`): primero busca una SA con el producto sin recibir; si no, una OC con saldo. **Defecto:** para conceptos, la búsqueda en OC usa saldo = 0 (condición invertida).
- **Permisos inconsistentes:** `Autorizar` valida `autoriz_sa`, pero `Descartar` y `MarcarPendiente` validan `autoriza_sa` (con “a”) (`:524, 566`) **[VERIFICAR]** si ambos permisos existen.
- **Vigencia P2036** (`GetSA_Pendientes`, `:284`; `GetSAEnProceso_SinAutorizar`, `:790`): **Defecto:** compara `FECHA − hoy ≤ vigencia`, que siempre se cumple para fechas pasadas, así que el filtro de vigencia no tiene efecto.
- **Circuito de autorización por informe** (`GetDatosInformeParaAutorizar`, `:792-848`; `MarcarComoExportada`, `:850`): las SA “en proceso” sin autorizar y no exportadas se imprimen para la firma del autorizante y quedan marcadas `EXPORTADA` con el usuario; la reimpresión exige que la SA esté en proceso y sin autorizar. El monto estimado es costo del producto × cantidad y se informa el precio de la última compra.
- **Autorización masiva** (`GetSolAprovFiltradas`, `:871`; `GetSolAprov_NoAutorizadas`, `:880`): filtra por fecha y modalidad de contratación (0 sin asignar, 1 caja chica, 2 compulsa/mail, 3 concurso, otro licitación). `AutorizarSolicitudes` no valida permisos.
- **Informe** (`Informe_por_fecha`, `:600-651`): estado 1 todas, 2 pendientes, 3 en proceso, 4 con algún ítem procesado, 5 ítems procesados, 6 anuladas; autorización 1 todas, 2 autorizadas, 3 sin autorizar.
- **Disponibilidad comprometida** (`Get_Stock_ItemsOC`, `:916`: saldo de OC no anuladas, o la cantidad cancelada si existe; `Get_Stock_FpItems`, `:923`: pendientes de facturas; `Get_Stock_Comprometido_Presup`, `:930`: pendiente de presupuestos aprobados con obra).
- Métodos sin regla de negocio: `GetRelaciones` (`:272`), `GetDetalles` (`:327`, incluye datos de la última compra), `GetDetallesRelacionados` (`:695`), `TieneItemsRechazados` (`:738`).

#### `clsSCotiz` (solicitud de cotización)

- **Trazabilidad entre documentos** (`clsRelaciones.CargarRelaciones`, `ReglasNegocio.Facturacion/clsSCotiz.cs:445-558`; `CargarRelacionYNro_Destino`, `:561-622`): para cada ítem muestra origen y destino con precio de origen y de destino y proveedor. **Defecto:** para SA, cotización, OC y remito el filtro por ítem se acumula dentro del bucle, por lo que solo el primer ítem muestra sus relaciones (la factura usa un filtro correcto) **[VERIFICAR]**. En la OC el precio de origen solo se informa si estaba bloqueada.
- **Estados** (`Rechazada`, `:683`; `Cotizada`, `:690`: todos los ítems tienen costo ≠ 0; `SolicitudEvaluada`, `:1000`: ningún ítem sin evaluar; `SolicitudProcesada`, `:1014`: algún ítem con pendiente 0).
- **Comparativo de cotizaciones** (`getCotizadasCompletas`, `:957-998`): toma todas las cotizaciones hermanas de la misma SA con precio cargado y sin evaluar (o también las ya contratadas si se reevalúa). Si la SA no se compartió entre varias cotizaciones, informa que no hay con qué comparar.
- **Cotizaciones disponibles para un producto** (`GetCotizacionesCotizadas`, `:1663-1691`): con precio, sin evaluar y que todavía no generaron OC.
- **Evaluación** (`EvaluarCotizacion`, `:1724-1745`): si se cambia la cantidad, se ajusta cantidad y pendiente; queda 2 contratada o 1 descartada.
- **Carga de precios** (`GetDetallesACotizar`, `:1747-1771`): calcula el IVA con la situación de IVA de la cooperativa P527 **[VERIFICAR]** y muestra el costo anterior del producto.
- Métodos sin regla de negocio: `GetIdComprobante` (`:623`), `Get_Descripcion` (`:869`), `GetSolAprov_Relacionada` (`:892`), `GetSolicitudesCotiz_Relacionadas` (`:914`), `Modificacion` (`:1027`), `GetParametros_CaratulaExpendiente` (`:1140`), `GetDetalleCotizacion` (`:1204`), `GetDetallesActaApertura` (`:1228`), `GetDetalles_PlanillAdjudicacion` (`:1241`), `Informe_por_fecha` (`:1298`), `GetRelaciones` (`:1582`), `GetDetalles` (`:1588`), `GetUltimasCotizaciones` (`:1645`, últimas 20), `GetDetallesRelacionados` (`:1882`), `GetMoneda` (`:1923`).

#### `clsNPedido` (orden de compra)

- **OC autorizadas para la web** (`GetOrdenesAutorizadas`, `ReglasNegocio.Facturacion/clsNPedido.cs:207-232`): no anuladas ni cerradas, no bloqueadas y **sin ningún ítem recibido**.
- La autorización (`AutorizarOrdenesCompras`, `:139-167`) ya está descrita en 7.4.
- Métodos sin regla de negocio: listas de valores usados (`GetSolicitantes`, `GetFirmantes`, `GetDepartamentos`, `GetTipPre`, `GetFormaPago`, `GetPlaEntrega`, `GetLugEntrega`, `:76-137`), `Cargar` (`:234`), `GetRelaciones` (`:240`), `GetNpPedidos` (`:288`), `GetDetallesRelacionados` (`:362`), `GetUltimasOrdenes` (`:396`, últimas 20).

#### `clsComp_Com` (remito de proveedor) y `clsIvaCom` (factura)

- **Remito ↔ factura** (`clsComp_Com.Procesar`, `ReglasNegocio.Facturacion/clsComp_Com.cs:68-90`): la factura descuenta el saldo a facturar del ítem de remito (`SAL_CANPRO`), lo cierra con estado “F” al llegar a 0 y guarda en el ítem de factura la referencia al remito. Al deshacer (`:92-113`), el saldo vuelve y el estado se limpia.
- **Restaurar pendientes de factura** (`clsIvaCom.RestaurarPendientes`, `clsIvaCom.cs:648-654`). **Defecto:** convierte la cantidad a entero antes de devolverla, perdiendo decimales.
- **Pendientes de pago** (`GetPendientesDePago`, `clsIvaCom.cs:380-398`): facturas con saldo ≠ 0 y estado vacío; si el proveedor tiene `PERPAGOTROS`, se listan las de todos los proveedores. **Anticipos pendientes** (`TieneAnticiposPendientes`, `:514`): comprobantes de operación “anticipo a proveedor” con saldo.
- **Autorización de pago** (`ActualizarPermitirPago`, `:343`; versión web, `:353`): cambia `PER_PAGO` sin validar permisos en la capa de negocio.
- **Unicidad** (`ComprobanteExiste`, `:528`): proveedor + tipo + punto de venta + número.
- Métodos sin regla de negocio: `GetRelaciones` (`clsComp_Com.cs:29`; `clsIvaCom.cs:374`), `GetDetallesRelacionados` (`clsComp_Com.cs:115`), `ExisteRemito` (`:155`), `GuardarReplicas`, `GetComprobantesIvaCom_web` (`:400`), `GetComprobantesIvaCom_Web_Items` (`:463`), `GetAdjuntosComprobante_Web` (`:488`), `ExistenItems` (`:533`), `ExisteUnidad_EnFpItems` (`:538`), `Get_Movimientos_Remito` (`:543`), `GetItemUltimaCompra` (`:656`), `GetRubrosFactura` (`:665`).

#### `frmComprobantes_Handler` (complementos a 7.6)

- **Totales** (`ActualizarTotal`, `ReglasNegocio.Facturacion/frmComprobantes_Handler.cs:1108-1118`): total = gravado + no gravado + retenciones + percepciones + impuestos + otros créditos + IVA. Las alícuotas de IVA se reagrupan por porcentaje (`RecalcularAlicuotas`, `:1152-1166`).
- **Control del neto** (`ValidarNeto`, `:1334-1347`): recalcula el total aplicando el % de descuento global a gravado, no gravado e IVA (excluyendo el producto descuento P2403) y devuelve la diferencia con el total informado.
- **Cambio de estado “pendiente” de un ítem** (`ValidarItemAnterior`, `:1349-1371`): si un ítem cargado como pendiente pasa a recibido, se avisa que se actualizará el stock; si un ítem recibido pasa a pendiente, se avisa que el stock deberá ajustarse **a mano**.
- **Actualización de precios desde la factura** (`GetLstProductos_Actualizar`, `:1120-1127`): por cada producto marcado, toma el mayor precio unitario del comprobante como nuevo costo.
- Métodos sin regla de negocio: `CargarRemito` (`:444`), `CargarCMP` (`:567`), `GetListaPendientes` (`:806`), `CargarDetalle_SolCotizacion` (`:836`), `EliminarDetalle` (`:1078`), `Guardar_DatosGenerales_OrdenCompra` (`:1555`), `ActualizarFecha` (`:1861`), `GenerarComprobanteSimple` (`:2539, 2546`), `VerificarMueveStock` (`:2762, 2767`).

#### `clsPagoFacturas` (complementos a 4)

- **Pago en efectivo o con valores de terceros desde caja** (`ReglasNegocio.Compras/clsPagoFacturas.cs:610-614`): se registra en `TESORE` como “pago a proveedor con valores de terceros” (categoría P2065) o “pago en efectivo” (P2079), con concepto “PAGO PROV.VAL-” o “PAGO EF. -” + proveedor.
- **Medios de pago de la OP** (`GetMediosDePago`, `:626-673`): reúne los `RESBAN` y `TESORE` de la OP; si quedó **salida pendiente** de efectivo (`SALIDA_PEN`), agrega una línea de efectivo por la diferencia entre el pago y lo ya registrado. Opcionalmente marca todo como impreso.
- **Firma y entrega masiva** (`Get_Op_Firma_Entrega`, `:1092-1116`; `ValidarOperacion_Masiva`, `:1118-1177`): para firmar se listan OP sin firma ni entrega; para entregar, firmadas y no entregadas. No se puede firmar una OP ya firmada o entregada, ni entregar una ya entregada; se informan hasta 20 comprobantes rechazados.
- **Portal web de proveedores** (`GuardarProveedorYAdjunto`, `:1216-1274`; `ConsultaComprobantes`, `:1357`; `Get_Comprobantes`, `:1391`; `GuardarMotivoRechazo`, `:1451`; `ObtenerEstadoComprobante`, `:1522-1543`): el proveedor carga su factura en `IVACOM_WEB` (rechazada si ya existe la misma combinación CUIT + tipo + punto de venta + número) con un adjunto. Compras ve las pendientes (sin factura vinculada ni rechazo), las registra o las rechaza con motivo. Estado informado al proveedor: Rechazado; Pago autorizado si la factura vinculada tiene `ESTADO = 'A'` **[VERIFICAR]** (en el resto del sistema “A” es anulado); Pago generado si el saldo difiere del importe; Registrada; Pendiente.
- Métodos sin regla de negocio: `GetOP` (`:616`), `GetComprobantes` (`:621`), `GetRetCom` (`:675`), `ObtenerDocumentos` (`:1179`), `ObtenerFirmasRealizadas` (`:1197`), `BuscarProveedor` (`:1276`), `ProveedorExistente` (`:1317`), `ExisteProveedor` (`:1416`), `EliminarComprobante` (`:1430`), `ObtenerDatosProveedorDesdeIvacomWeb` (`:1477`), `ObtenerDatosComprobante` (`:1498`), `ObtenerOpcionesCondicionFiscal` (`:1544`), `ObtenerOpcionesComprobante` (`:1555`).

#### `clsBienesUso` y `clsLeerComprobante`

- **Eliminar un bien de uso** (`Eliminar_BienesyAsignaciones`, `ReglasNegocio.Compras/clsBienesUso.cs:263-291`): si tiene amortizaciones registradas, pide confirmación advirtiendo que los asientos de ajuste por baja/amortización deberán registrarse **manualmente**; borra amortizaciones, secciones y el bien con auditoría.
- **Secciones del bien** (`Get_Secciones_Bienes`, `:167-222`): las asignadas primero y el resto de las secciones con 0 %. La modificación (`Modificar_Asignaciones`, `:293-319`) borra las quitadas, actualiza porcentajes y agrega nuevas.
- **Lectura de PDF para IA** (`clsLeerComprobante.GetImgFromPDF`, `ReglasNegocio.Compras/clsLeerComprobante.cs:106-130`): extrae el texto de la primera página y la renderiza como imagen A4 a 300 ppp para enviarla al modelo.
- Métodos sin regla de negocio: `EsMejora` (`clsBienesUso.cs:103`), `Get_Disminucion` (`:111`), `EstaDadoDeBaja` (`:124`), `Get_Datos_MejoraDism` (`:132`), `GuardarHistorial` (`:326`).

#### `clsProdSer` (productos, en lo que afecta a compras y precios)

- **Actualización de precios** (`ActualizarPrecios`, `ReglasNegocio.Facturacion/clsProdSer.cs:429-454`): guarda el costo anterior en `PRE_COM2`, actualiza costo y venta, la fecha de precio (salvo actualización por dólar) y audita los importes.
- **Actualización masiva** (`Get_DatosGrilla_ActualizarPrecios`, `:863-952`): filtros por rango de código, departamento, rubro, tipo, servicio, proveedor y plan/etapa de vivienda. Modos: 0 = porcentaje, 1 = coeficiente, 2 = **por cotización del dólar** (precio × cotización nueva / cotización vigente a la fecha del último precio; solo productos con fecha de precio), 3 = monto fijo. En el modo dólar, si hay productos con margen de rentabilidad (`MGEN_SUP`), ofrece recalcular la venta como costo × (1 + margen).
- **Recargos y descuentos por producto** (`Get_RecargoDescuento`, `:793-861`; `ValidarDescuento`, `:953-977`; `ValidarCantidadMaxima`, `:979-992`): una regla aplica si la cuenta tiene la propiedad y el valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de los comprobantes excluidos (o ninguna deuda vencida hace más de N días) y no superó la cantidad límite del producto en el mes en curso **[VERIFICAR]** (reglas cargadas en LAG). Puede bonificar con otro producto (`COD_PRO_DES`).
- **Costo fijo de fabricación** (`Get_CostoFijo`, `:994-1016`): cantidad del componente P3015 (o el peso del producto si P3015 = 0) × coeficiente de mano de obra de la clasificación del producto.
- **Clonar** (`clonarProdSer`, `:1029-1053`): copia con sufijo “- (copia)” en la descripción y, con P3049, también en la matrícula (que debe ser única, `matriculaRepetida`, `:1019`).
- **Combos** (`GuardarComposicion`, `:1055-1106`): agrega/actualiza/borra componentes; no confirma cambios por sí mismo (depende de la conexión del llamador) **[VERIFICAR]**.
- Métodos sin regla de negocio: `Get_DatosGenerales` (`:292`), `GetProducto` (`:317`), `Get_Rubro` (`:335`), `GetDecimales` (`:349`), `GetCostoSinIva` (`:365`), `GetUnidadesMedida`, `GetMarcas`, `GetModelos` (`:373-395`), `GetUltimaCompra` (`:397`), `Ultima_ActPrecio` (`:406`), `IndiceSegunMes` (`:412`), `ObtenerMargen` (`:420`), `GetUltimaCotizacionDolar` (`:455`), `GetGridDataSource` (`:463, 544`), `GetRubrosGridDataSource` (`:562`), `GuardarPropiedades` (`:588`), `GetProductosEnCombo_ConUbicacion` (`:609`), `GetListProductoUbicacion` (`:628`), `Get_RecargoDescuentoAsignados` (`:688`), `Guardar_RecargoDescuentos` (`:739`), `VerificaUsaUbicacion` (`:1107`), `VerificaMueveStock` (`:1126`).

#### `clsPresupuesto` (complementos a 7.7)

Estados de `PRESUPU.ESTADO`: vacío = Generado, `E` = Enviado (vencido si `FEC_VAL` < fecha), `O` = Aprobado, `R` = Rechazado, `P` = Para facturar, `F` = Facturado, `A` = Anulado (`GetDatosInformePresupuesto`, `ReglasNegocio.Facturacion/clsPresupuesto.cs:1602-1636`).

| Acción | Permitida desde | Efecto | Referencia |
|---|---|---|---|
| Enviar | Generado (si ya fue aprobado o enviado, solo reenvía el mail) | `E` + fecha de envío | `:1042-1079` |
| Aprobar | Generado o Enviado | `O` + fecha de aprobación; ofrece crear un ticket | `:1107-1152` |
| Volver a generado | Aprobado | vacío, borra fecha de aprobación | `:1081-1105` |
| Rechazar | Generado o Enviado | `R` + fecha; desvincula el ticket | `:1179-1216` |
| Marcar para facturar | cualquiera salvo A/F/R/P | `P` | `:1241-1273` |
| Anular | cualquiera salvo A/F (pide confirmación si está O/E/P) | `A`; desvincula el ticket | `:839-872, 1286-1301` |

- **Defecto:** `AprobarPresupuesto(codCve)` (`:1154-1177`) aprueba sin validar el estado previo.
- **Alta** (`Guardar`, `:353-385`; `CrearPRESUPU`, `:934-999`): si se envía a PMovil, todos los productos deben tener módulo PMovil 0 o 2 (`ValidarItemsPresupu`, `:697-710`) y con P2383 se usa el punto de venta configurado para PMovil. Descripción truncada a 60; pendiente = cantidad.
- **Un presupuesto vigente por producto y cuenta** (`ValidarPresupuPorPer`, `:308-324`): no se permite otro presupuesto sin facturar, vigente y no anulado de la misma cuenta con alguno de los mismos productos.
- **Modificación** (`ActualizarPRESUPU`, `:1001-1040`): vuelve un presupuesto enviado a generado; solo con P3010 se puede cambiar cuenta y persona.
- **Precio de conjuntos** (`ActualizarPrecios`, `:1667-1691`): si el producto tiene estructura (`PRODFAB`), costo = costo de componentes + costo fijo y venta = costo × (1 + margen); si no, los precios del producto.
- **Prorrateo** (`CalcularProrrateo`, `:1583-1600`; `GetPrecioProductoProrrateado`, `:1425-1443`): flete + molde + ítems marcados “prorratear” se reparten entre los demás ítems por **peso**.
- **Ticket desde presupuesto** (`GenerarTicket`, `:1693-1763`): crea un ticket con gravedad 50, estado 5 y asunto = referencia o número del presupuesto.
- **Órdenes para PMovil** (`Get_Presupuestos_Orden`, `:1330-1388`): presupuestos no anulados/facturados/rechazados marcados para PMovil, con datos de contacto, domicilio y medidor del servicio.
- **Validaciones de servicio** (`ValidarServiciosCuenta`, `:281`: la cuenta tiene servicios en condición 2; `ValidarConexionServicios`, `:287-301`: el servicio no está en un estado de desconexión; `ValidarPropiedad`, `:303`: la cuenta tiene la propiedad con valor “SI”).
- Métodos sin regla de negocio: `EsProductoRepetido`, `AgregarDetalle`, `EliminarConjuntoDetalle`, `EliminarDetalle` (`:326-351`), `GuardarConConjuntos` (`:387`), `ClonarConjunto` (`:457`), `GetPresupu` (`:712`), `tieneAnticipo` (`:721`), `GetPresuitConjuntos` (`:729`), `GetPresuit` (`:781`), `Get_PRESUPU_Persona` (`:822`), `PresuPorConjuntos` (`:830`), `CrearPRESUIT`, `CrearPRESUIT_CONJUNTOS` (`:874-932`), `Rechazar_Anular_Presupu` (`:1218`), `ExisteEnPresupuesto` (`:1275`), `TieneMateriales` (`:1303`), `ObtenerObras` (`:1310`), `GetProductos` (`:1390`), `GetProductosDePresu` (`:1408`), `tieneAlgunProductoPendiente` (`:1445`), `Generar_PresupuComprob` (`:1465`), `ActualizarCantidades` (`:1490`), `GetNomConjuntos` (`:1495`), `GetPresupuestos` (`:1504`), `GetMovTrh_RelacionadosProducto` (`:1534`), `GetDatosInformePresupuestoNotas` (`:1638`), `GetTipoTickets`, `GetSubTipoTickets` (`:1765-1774`).

#### `clsInformes_Compras` (informes con regla propia)

- **Control de diferencias de comprobantes** (`Get_Diferencias`, `ReglasNegocio.Facturacion/clsInformes_Compras.cs:1877-1941`): marca la factura de proveedor si falla alguno de cuatro controles: total de cabecera contra la suma de sus componentes (neto + IVA + percepciones + otros), total contra la suma de los ítems, IVA de cabecera contra el IVA de los ítems e IVA de cada ítem recalculado con su alícuota. Sirve como auditoría previa al libro IVA compras.
- **Previsiones de pagos** (`GetPrevisionesCompras`, `:3615-3696`; `AgregarPrev`/`ValidarFechas`, `:3739-3845`): arma el flujo de fondos a pagar sumando tres orígenes: (1) previsiones fijas `PREV_COM`, expandidas según la periodicidad (1 mensual, 2 bimestral, 3 trimestral, 4 semanal, 5 quincenal) dentro del rango pedido; (2) facturas `IVACOM` con saldo, por fecha de vencimiento; (3) cheques propios `CHEQUERAS` en estado 1 (emitidos, no debitados) por el importe `RESBAN.DEBE`. Con P2653 activo se ocultan los proveedores que son empleados (sueldos) salvo que el usuario tenga el permiso `frm_Su_Sueldo` **[VERIFICAR]**.
- **Facturas sin orden de compra** (`GetComprobanteSinOrdenes`, `:3698-3737`): ítems de facturas de proveedor que no tienen relación `COMPRAS_RELACION` con una OC (control del circuito 7).
- **Costo de reposición** (`CostoReposicion`, `:2826-2841`): cantidad a reponer = `CAN_REP` − stock actual; si el producto se compra en bultos, se multiplica por `BULTOS`.
- **Proveedores y Decreto 1945/18** (`Proveedores`, `:2843-2941`): el listado puede filtrar proveedores alcanzados por el régimen del Decreto 1945/18 (proveedores con propiedad/marca LUA) **[VERIFICAR]** (si LAG usa esa marca).
- **Pagos pendientes de salida** (`PagosEnEfectivoPendientes`, `:1210`; `PagosPendientes`, `:1226`): una orden de pago está pendiente de salida (`SALIDA_PEN`) cuando su importe menos lo ya movido en `TESORE` (neto) y en `RESBAN` (neto) es distinto de cero; el informe se abre por medio (efectivo, transferencia, cheque propio) con una fila TOTAL.
- **Pagos diferidos** (`PagosDiferidos`, `:1281-1319`): movimientos `TESORE` de tipo 1 cuya fecha difiere de la fecha de pago de la OP (`FEC_PAG`); se clasifican en T (tesorería) y P (pago).
- Métodos sin regla de negocio: el resto de los listados de `clsInformes_Compras` que figuran en la lista de pendientes (consultas filtradas por fecha, proveedor, producto o comprobante y agrupaciones para reportes).

### 15.4 Stock

#### `clsMov_pro` (movimientos de stock; complementos a 8)

- **Movimiento unitario** (`Nuevo_MovProUnitario`, `ReglasNegocio.Stock/clsMov_pro.cs:1287-1325`): una cantidad negativa invierte el sentido (entrada ↔ salida) y se guarda en positivo; si el identificador de comprobante mide 16 caracteres se deja vacío.
- **Trazabilidad** (`RegistrarTrazabilidad`, `:1327`): toda entrada de un producto trazable, salvo el remito entre depósitos, actualiza el precio del trazable (`PROD_TRH.PRE_TRH`).
- **Bienes de uso desde stock** (`RegistrarBienDeUso`, `:1385-1424`): una entrada registra `FEC_ALTA` y la factura de compra (`IVACOM_IN`); una salida registra `FEC_BAJA`, la baja contable y el comprobante de salida (`IVACOM_OUT`). Vincula el circuito de stock con la sección 9.
- **Eliminación de movimientos** (`EliminarMovimiento`, `:1870-1919`): no se puede borrar si el trazable tiene movimientos posteriores o sigue en existencia; si el bien de uso ya fue dado de baja no se puede borrar su entrada; borrar una salida restaura la fecha de baja anterior.
- **Ingresos a valorizar** (`GetIngresosAValorizar`, `:226-274`; `HayIngresosSinValorizar`, `:212`): ingresos sin precio, excluida la operación 10 **[VERIFICAR]** (qué operación es la 10 en `OPERACIONES` de LAG).
- **Valorización de stock** (`GetValorizacionStock`, `:760-810`): solo productos que llevan stock (`LLE_STO`) y no son combos; se procesa en lotes de 100 productos y se informan aparte los productos con stock negativo, que no se valúan.
- **Uso del producto por módulo** (`GetGridViewProductos`, `:1921`): `PROD_SERV` define dónde aparece el producto.

| `PROD_SERV` | Disponible en |
|---|---|
| 1 | todos los módulos |
| 2 | ventas, stock y compras |
| 3 | solo ventas |
| 4 | compras y stock |
| 5 | cuotas |
| 6 | no disponible |
| otro | ventas y cuotas |

- **Facturado no entregado** (`GetStockFacturadoNoEntregado`, `:1984`): suma de `IT_COMPV.CAN_PEN` (cantidad pendiente de entrega de las facturas de venta).
- **Salidas en consignación** (`GetSalidaPorConsignacion`, `:2052`): trazables con saldo 0 cuyo último movimiento es la operación 8 (consignación).
- **Vales de materiales** (`GetMovimientosVale`, `:1579`): retiros `RETI_MAT` asociados a órdenes de trabajo o de mantenimiento.

#### `clsRevaluacion`

- **Tres modos** (`ReglasNegocio.Stock/clsRevaluacion.cs`): automático por índice (cada rubro tiene un `INDICE_REVALUACION`), automático al costo (toma `PRE_CSI` del producto) y manual.
- **Factor de revaluación** (`RevaluarAutomaticamente`, `:408-470`): factor = índice (`IND_TAB`) del mes hasta ÷ índice del mes del movimiento (o del mes de la fecha desde si el movimiento es anterior). En enero toma el índice de diciembre del año anterior **[VERIFICAR]** (criterio contable de LAG). Si falta algún índice del período se aborta con error.
- **Validación previa** (`:633-639`): productos sin rubro o con rubro sin índice impiden revaluar.

#### `clsTrazabilidad`

- **Ingreso de números de serie** (`Validar_Ingreso`, `ReglasNegocio.Stock/clsTrazabilidad.cs:22-84`): el número de serie debe ser único dentro del lote cargado; es error si ya está en stock o, al ingresar nuevos, si está asignado a un suministro (medidor instalado); si existe pero no está en stock pide confirmación. Las propiedades extendidas (`DATOSEXT`) marcadas `UNICO` no pueden repetirse.

- Métodos sin regla de negocio (Stock): `clsUbicaciones`, `clsInformes_Stock`, RMA y handlers de formularios de stock que figuran en la lista de pendientes (ABM, consultas y armado de grillas); no se revisaron uno por uno.

### 15.5 Fabricación

#### `clsOrdeFab` (órdenes de fabricación; complementos a 10)

| `COD_ETA` | Etapa |
|---|---|
| 0 | generada |
| 1 | lanzada |
| 2 | finalizada |
| 3 | anulada |
| 4 | cancelada |

- **Marcar fabricados** (`MarcarFabricados`, `ReglasNegocio.Fabricacion/clsOrdeFab.cs:721-761`): un renglón de la orden (`ORPRFAB`) pasa a estado 1 cuando lo producido iguala lo pedido y todos los demás partes que lo incluyen están finalizados; cuando todos los renglones están completos y en estado 1, se registra la fecha de fin real de la orden (`FEC_FINR`). No cambia `COD_ETA`.
- **Cancelar** (`Cancelar`, `:763-782`): `COD_ETA` = 4.
- **Anular** (`Anular`, `:784-855`): solo si la orden está generada (0), o lanzada sin partes de producción, o con todo lo producido reasignado; pasa a 3 y desvincula el ítem del comprobante de venta (`ID_ITEM`/`COD_CVE`). La rama que borraría la orden es inalcanzable. **Defecto:** `Cancelar` y `Anular` devuelven éxito aunque falle el guardado.
- **Comprometidos y pendientes de producción** (`Eliminar_ItemsComprometidos`, `:857`; `ActualizarProducto_CantidadPProd`/`ActualizarComponente_CantidadPProd`, `:898-920`; `GetProdPendientes`, `:922`): al anular o modificar se liberan los componentes comprometidos y se recalcula la cantidad “pendiente de producción” del producto y de sus componentes.
- **Precio según componentes** (`GetPrecioProducto_SegunComponentes`, `:957`; versión venta, `:962`): suma de `CAN_COM` × costo (`PRE_CSI` del renglón de `PRODFAB` o, si no tiene, del producto); la versión venta usa `PRE_VSI`.
- **Costo recursivo** (`CostoProducto`, `:1926-1951`): recorre la estructura en profundidad; por defecto usa el precio de venta sin IVA y solo usa costo si se pide explícitamente **[VERIFICAR]** (qué criterio quiere LAG para costear).
- **Orden disponible** (`OrdenDisponible`, `:1671-1681`): una orden admite un parte para un producto si lo incluye y la cantidad pedida menos lo ya cargado en partes cubre la cantidad necesaria. No mira la etapa.

#### `frmOrdenAprovisionamiento_Handler` (aprovisionamiento de fabricación)

- **Requerimientos** (`ProcesarRequerimientos`, `ReglasNegocio.Fabricacion/frmOrdenAprovisionamiento_Handler.cs:89-143`): toma las órdenes lanzadas en el rango y no finalizadas; cada componente se necesita en la fecha de lanzamiento + `DIAS` del componente; “en proceso” = órdenes con fecha de lanzamiento real (`FEC_LANR`).
- **Datos de compra** (`AgregarComponente`, `:145`; `CargaUltimasCompras`, `:242`): por componente muestra el proveedor habitual y las últimas 3 compras de los últimos 180 días.
- **Generar pedidos** (`GenerarPedido`, `:262-314`): una OC por proveedor, con el comprobante de la operación “orden de compra”, numeración consecutiva, IVA al 100 %, moneda 1; pasa por la validación y el guardado normales de compras (sección 7).
- **Excluir previstos** (`EliminarPrevistos`, `:316`): quita los componentes cuyo stock menos lo requerido sigue siendo ≥ stock mínimo (`STO_MIN`).
- Métodos sin regla de negocio: `ObtenerComponentesPProduccion` (`:201`).

#### `clsOfParteProduccion` (partes de producción)

- **Existencia de componentes** (`VerificarExistenciaComponente`, `ReglasNegocio.Varios.Fabricacion/clsOfParteProduccion.cs:105-119`): disponible = stock − comprometido en partes abiertos. **Defecto:** convierte a entero y pierde decimales.
- **Fin de producción** (`MarcarProdsComoFabricados`, `:121`): estado 2 y `FECHA_FIN`.
- **Número de serie** (`GetLista_NrosSerie_Item`, `:149-195`): 30 caracteres = parte (7) + orden de fabricación (6) + conjunto (2) + matrícula (11) + correlativo (4).
- **Parte original** (`GetNumParteOriginal`, `:198-233`): rastrea el parte de origen siguiendo el componente trazable.
- **Cambio de producto** (`GuardaryProcesar_CambioProducto`, `:235`): crea un parte ya finalizado y lanza la orden si todavía no estaba lanzada.
- **Componentes compuestos** (`DeconstruirComponentes_Compuestos`, `:745-765`): explota recursivamente los componentes que a su vez tienen estructura.
- **Etiquetas** (`GetEtiquetaProductos`, `:777-872`): solo para partes en estado 1 o 2.
- **Reasignados y modificados** (`Producto_ReasignadoCambiado`, `:874-890`; `SeModificoProducto`, `:928-939`): detectan si el producto del parte fue reasignado a otra orden o cambiado, para bloquear la anulación de la orden (ver `Anular`).
- Métodos sin regla de negocio: `GetItemHasta` (`:729`).

### 15.6 Sueldos

#### Funciones del lenguaje de fórmulas (`clsFormulas_Sueldo`)

Cada función es una clase registrada como función personalizada del editor de fórmulas de conceptos (`ReglasNegocio.Sueldos/clsFormulas_Sueldo.cs`). En todas, `IsValidOperandCount`, `IsValidOperandType`, `ResultType`, `Name`, `Description` y `Category` son **métodos sin regla de negocio** (validan cantidad y tipo de argumentos). Varias guardan el resultado en memoria por empleado durante la liquidación, así que un cambio de datos a mitad de la liquidación no se refleja.

| Función | Regla | Referencia |
|---|---|---|
| `Impuesto_Cedular(IngresoNeto, Empleado, Fecha)` | Resta al ingreso las novedades marcadas `IMP_CEDULAR` del año (las de tipo 10 restan); si supera 15 salarios mínimos (`SU_SALARIO_MINIMO`) × mes, aplica a lo excedente una escala fija de 5 tramos (27 % a 35 %, con cortes en 1, 3, 5 y 7 salarios mínimos × mes) **[VERIFICAR]** (vigencia normativa; la escala está fija en código) | `:32-138` |
| `Ganancias_ImporteRetencion`, `..._LiqFinal` | Retención de Ganancias por tabla de tramos (`SU_TRAMAS`) sobre la ganancia neta, delegando en `clsGanancias` | `:140-311` |
| `Ganancias_DeduccionesEspeciales`, `Ganancias_Conyuge`, `Ganancias_GananciaNoImponible` | Deducciones personales del período según `SU_DEDUCCIONES` del tipo de deducción del empleado, prorrateadas | `:313-451, 1192-1368` |
| `Ganancias_TotalConcepto` | Total acumulado de un concepto a efectos de Ganancias según su configuración (`GANANCIAS`: 3 = 50 %, 4 = `PORC_GANANCIAS`, otro = 100 %), con opciones para excluir SAC y prorratear | `:453-634` |
| `CorrespondeCobrarGanancias` | Ver `clsGanancias.CorrespondeAplicarGanancias` abajo | `:636-678` |
| `CorrespondeCobrarGanancias2`, `PromedioGanancias` | Comparan el promedio de remuneraciones (mensual o semestral) contra `IMP_BRUTO_MINIMO`; la segunda devuelve el promedio | `:680-772` |
| `FechaDesde_DedEsp` | Inicio del acumulado de deducciones especiales (ver abajo) | `:774-814` |
| `Recibos_Liquidados` | Cantidad de períodos con recibo entre dos fechas, opcionalmente de un tipo de recibo | `:816-912` |
| `Campo_Calculadora_Ganancias` | Devuelve un campo de la calculadora de Ganancias del empleado | `:914-974` |
| `Deduccion_Especial_Incrementada` | Si el sueldo promedio es menor que el mínimo de `SU_DEDUCCIONES_ESPECIAL` del año, 0; si no, el importe mensual del primer tramo cuyo sueldo promedio lo cubre | `:976-1044` |
| `Deduccion_Especial_DEIA1` | Si el sueldo promedio es menor que `IMP_BRUTO_MINIMO` del mes, deduce toda la remuneración sujeta (mínimo 0); si no, 0 | `:1046-1106` |
| `OtrasDeducciones_Importe` | Deducciones guardadas en el último recibo (0 todas, 1 varias, 2 doceava SAC, 3 doceava BAE, 4 especial) | `:1108-1190` |
| `SAC(Empleado, Hasta, Tipo)` | 50 % del mejor mes del semestre (enero-junio o julio-diciembre) hasta la fecha, sumando solo conceptos marcados `AGUINALDO`; las deducciones (tipo 30/40) restan; Tipo 1 solo remunerativo, 2 solo no remunerativo | `:1370-1459` |
| `Concepto_TotalImputado`, `Conceptos_TotalImputado`, `Conceptos_TotalCantidades`, `Concepto_MaximoImputado`, `TotalImputado` | Totales, cantidades o máximo liquidado de uno o varios conceptos (o hasta un concepto según orden) entre fechas, con inclusión/exclusión de tipos de recibo | `:1461-1488, 1676-1750, 1850-2111` |
| Función por tipo de concepto (`Imputado_Por_TipoConcepto`, nombre configurable) | Total imputado por tipo de concepto | `:1589-1675` |
| `Adelantos(Empleado, Hasta)` | Saldo absoluto de adelantos registrados como comprobantes de compras pendientes de pago (`clsSueldos.TotalAdelantos`) | `:1752-1790` |
| `Total_NovedadesPeriodo`, `TotalTipoNovedad` | Suma de novedades de un código o de ciertos tipos; `TotalTipoNovedad` acumula desde el inicio del año fiscal según P2611 (1 = desde febrero, 2 = desde diciembre del año anterior, otro = enero) | `:1792-1848, 2148-2228` |
| `Basico_Categoria(Categoria)` | Sueldo básico de la categoría (`SU_CATE.IMPORTE`) | `:2113-2146` |
| `ImporteFacturasAdeudadas(Empleado, Desde, Hasta)` | Saldo de facturas de servicios impagas de las cuentas vinculadas al empleado (`SU_EMPLEADOS_SUMSOC`), para descontarlas del sueldo **[VERIFICAR]** (si LAG descuenta deuda de servicios por recibo) | `:2230-2282` |

#### `clsGanancias`

- **Tablas anuales de deducciones** (`ValidDeduccion`, `ReglasNegocio.Sueldos/clsGanancias.cs:435`; `ValidDeduccionAnual`, `:445`; `CrearDeduccionAnual`, `:450-476`): no puede haber dos tramos solapados del mismo tipo, año y mes. La carga anual borra los tramos solapados y genera los meses 1 a 11 con importes acumulados (importe anual / 12 × mes).
- **¿Corresponde retener?** (`CorrespondeAplicarGanancias`, `:478-510`): la base es la suma de conceptos remunerativos con efecto en Ganancias del recibo de **agosto del año anterior**; con esa base se busca el tramo de `SU_DEDUCCIONES` y, si el bruto sin SAC del mes es menor que `IMP_BRUTO_MINIMO`, no se retiene **[VERIFICAR]** (la referencia fija a agosto responde a una norma puntual).
- **Inicio del acumulado** (`FechaDesde_DedEsp`, `:512-541`): 1 de enero, o diciembre del año anterior con P2611 = 2; si la tabla tiene `MES_DESDE_BRUTO` > 1 se usa ese mes.
- **Promedios** (`CorrespondeAplicarGanancias2`, `:543-569`; `ValoresPromedioGanancias`, `:571-625`): promedio = remuneraciones con efecto en Ganancias desde el inicio del período (más remuneraciones de otros empleos, novedad tipo 10) ÷ cantidad de meses con recibo; los recibos de tipo “prorratear” (`PRORRATEAR` = 2) se distribuyen por doceavas hasta fin de año. Para el promedio semestral desde julio de 2023 se cuenta desde julio. No se retiene si el menor entre el promedio y el mes actual es inferior a `IMP_BRUTO_MINIMO`.
- Métodos sin regla de negocio (detalle no revisado): `Get_Iqueryable_Deducciones`, `Get_dt_TiposDeducciones`, `GetImpuestoCedular`/`GetCalculoImpuestoCedular` (misma escala que la función `Impuesto_Cedular`), `GetListaCalculadora`, `AsignarValor_CeldaExcel`, `ExportarDiferencialesAExcel`, `GetCalculosMensualesDiferenciales`, `GetDeduccionesPorHijos`, `GetNovedadesGanancias`, `Importar_Ded_Esp`.

#### `clsEmpleados`

- **Acceso del empleado al portal** (`VerificarEmpleado`, `ReglasNegocio.Sueldos/clsEmpleados.cs:731-749`): si el acceso es por usuario del sistema se compara con su clave; si es por empleado y no tiene clave propia, la clave es su **número de documento**. **Defecto** de seguridad que GoodApps no debe replicar.
- **Legajo único por empresa** (`ExisteEmpleado`, `:835`).
- **Cambio de categoría por antigüedad** (`GetEmpleados_RequiereCambioCategoria`, `:848-856`; `Empleados_RequiereCambioCategoria`, `:858`): avisa cuando pasaron más de `MES_CAT` meses (de 30 días) desde `FEC_CAT`, según el sindicato del empleado.
- **Desvinculación** (`Desvincular_Empleado`, `:892-907`; `Presave_SU_DESVICULACION`, `:687-713`): registra motivo y fecha de baja y copia al empleado los conceptos extra del modelo de desvinculación (indemnizaciones, etc.). **Reincorporación** (`Vincular_Empleado`, `:879-890`): borra la baja y, si se pide eliminar la liquidación, borra **todos** los extras del empleado, no solo los de la desvinculación **[VERIFICAR]**.
- **Formulario 572 / familiares** (`ActualizarPorcDeduccion_Familiar`, `:2616-2668`): si el período es el año en curso marca el familiar como declarado en F.572 y toma el porcentaje a deducir informado; mantiene un registro por año en `SU_EMP_FAMILIARES_EXTRAS`.
- **Ganancias liquidadas por otros empleadores** (`Verificar_Ganancias_Liquidadas`, `:2670-2706`; `Cargar_Ganancias`, `:2708-2730`): las remuneraciones importadas se cargan como novedad tipo 10 (otros empleos), salvo las de la Caja de Jubilaciones de Córdoba, que van como novedad tipo 11; se omiten las que ya existen para esa fecha. El nombre de la caja está fijo en código.
- **Documentación del empleado** (`ObtenerSolicitudesPendientesDocumentacion`, `:2139-2173`; `AutorizarDocumentoEmpleado`, `:2175-2235`; `RechazarDocumentoEmpleado`, `:2237-2253`; permiso `AutorizarDocumentos`, `:2130`): al autorizar se crea o actualiza el trámite `PTRAMITES` con el vencimiento y los adjuntos pasan del tipo 25 al 26; al rechazar se borran los adjuntos. **Defecto:** confirma la transacción antes de guardar los cambios (`:2223`).
- Métodos sin regla de negocio: `Get_SU_DESVICULACION_Categorias` (`:680`), `Get_Empleado_Id` (`:715`), `GetEmpleadoId` (`:720`), `Get_IdsEmpleados`, `Get_LegajosEmpleados`, `Get_SU_EMPLEADOS` (`:777-833`, filtros), `ActualizarImporteExtra` (`:840`), `EstaDesvinculado` (`:863`), `Get_GridViewHorasTrabajadas` (`:909`), `Get_SU_EMPRESAS` (`:2732`) y el resto de ABM y consultas de `clsEmpleados` de la lista de pendientes.

#### `clsCategorias`, `clsTramas` y `clsVariables`

- **Días de vacaciones** (`Get_DiasVacacionesPorCategoria`, `ReglasNegocio.Sueldos/clsCategorias.cs:58-88`): con 6 meses de antigüedad o menos al 31/12, 1 día cada 20 trabajados; si no, los días de la tabla `SU_ANTIGUE` según años de antigüedad, primero por categoría y luego por sindicato. **Defecto:** si el empleado no tiene categoría se toma la primera fila de la tabla sin filtrar por antigüedad.
- **Aumentos masivos** (`SueldosActualizados.GetImporteAumento`, `:38-41`; `Get_SueldosActualizados_Sindicato`/`_Extras`, `:91-120`): el aumento se calcula sobre el básico “puro” (sueldo actual × 100 / porcentaje actual) por el porcentaje de aumento, con redondeo a 2 decimales.
- **Tramas** (`Validar_Importe`/`GetTramaPeriodo`, `ReglasNegocio.Sueldos/clsTramas.cs:12-30`): no puede haber dos tramos de `SU_TRAMAS` solapados en el mismo mes, año y tipo.
- **Variables de fórmula** (`ReglasNegocio.Sueldos/clsVariables.cs:11-49`): se exponen como `Variables.<nombre>`; el nombre es único y al renombrar se reemplaza `[Variables.<anterior>]` en todas las variables y en las fórmulas de cantidad, filtro e importe de los conceptos (el mismo mecanismo se usa al renombrar conceptos).
- Métodos sin regla de negocio: `ExisteAlgunTipoTrama`, `Get_GridView`, `GetDtTiposTramas` (`clsTramas.cs:31-60`), `Get_GridView_SU_ANTIGUE` (`clsCategorias.cs:44`).

#### `clsNovedades` (licencias y novedades)

- **Solicitud de licencia** (`SolicitarLicencia`, `ReglasNegocio.Sueldos/clsNovedades.cs:1862-1927`): rechaza si ya hay una licencia del mismo tipo pendiente o autorizada que se superpone; guarda los adjuntos y avisa por SMS a los encargados del empleado (`SU_EMP_OPER`), usando el teléfono o, si no hay, el campo fax.
- **Autorización** (`AceptarLicencia`, `:1993-2096`): rechaza si se superpone con otra autorizada o si los días pedidos superan los disponibles; genera **una novedad por mes calendario** con los días corridos de ese mes, con el tipo de novedad de la causa; si es vacaciones registra el período (31/12 del año de la licencia); mueve los adjuntos al tipo 20 y avisa por SMS al empleado. **Rechazo** (`RechazarLicencia`, `:2098-2122`): guarda la causa y avisa.
- **Días disponibles** (`CalcularDiasDisponibles`, `:2166-2234`): para vacaciones, días según categoría y antigüedad (ver `clsCategorias`) menos solicitudes pendientes y vacaciones ya tomadas del período; los días hábiles solo excluyen sábados y domingos, **no feriados** **[VERIFICAR]**. Para otras causas, `DIAS_PERIOD` menos lo pedido no rechazado; `DIAS_PERIOD` = 0 significa sin límite.
- Métodos sin regla de negocio (no revisados en detalle): el resto de `clsNovedades` de la lista (carga e importación de novedades desde Excel, horarios y lector de fichadas, calendario, cumpleaños, adjuntos, anticipos y horas no trabajadas).

#### `clsSueldos` (recibos)

- **Borrado masivo de recibos** (`EliminacionMasiva_Recibos`, `ReglasNegocio.Sueldos/clsSueldos.cs:426-447`): borra ítems, detalle de Ganancias y cabecera en una transacción. **Defecto:** no controla si el recibo está pagado o firmado.
- **Recibo único** (`ExisteRecibo_byLegajoEmpleado`/`_byCodigoEmpleado`, `:450-460`): un recibo por empleado, período, tipo de recibo y empresa.
- **Novedad de Ganancias del mes siguiente** (`GenerarNovedad`, `:1332-1347`; `ExisteNovedad_periodo`, `:462-474`): la retención calculada se deja como novedad del mes siguiente (tipo de novedad cuyo nombre contiene “GANANCIAS”) y antes de reliquidar hay que borrar la novedad tipo 27. **Defecto:** en diciembre la novedad queda en enero del mismo año y el control busca el mes 13 (no detecta nada).
- **Anulación de pago** (`AnularPago`, `:761-797`): por recibo o por identificador de pago, borra fecha e identificador de pago; no revierte movimientos de tesorería.
- **Firma digital** (`ExcluirRecibosFirmados`, `:985-998`; `VerificarRecibosEnLote`, `:1000-1012`): no se reenvían a firmar recibos con estado de firma distinto de 0/1, ni los que ya están en un lote de firma.
- **Adelantos** (`TotalAdelantos`, `:798-801`): valor absoluto del saldo de los comprobantes de adelanto en compras.
- Métodos sin regla de negocio: el resto de `clsSueldos` de la lista (grillas, guardado, impresión, notificaciones, importación de empresa).

#### Exportaciones (`clsInformes_Sueldo`)

- **Archivo regional de Luz y Fuerza** (`ExportarArchivoRegionalLuzYFuerza`, `ReglasNegocio.Sueldos/clsInformes_Sueldo.cs:1699-1800`): exige CUIL de 11 dígitos a todos los empleados; por empleado informa remunerativo, no remunerativo (sin anticipos), SAC, horas extra (conceptos ARCA 130001/130002) y si aporta al sindicato (propiedad del empleado o afiliación); el aporte sindical = (remunerativo − conceptos 170000 − SAC) × porcentaje promedio de los conceptos SICOSS 25. Con sigla P2264 = “DEAN” se excluye el tipo de recibo 15 **[VERIFICAR]** (formato vigente del sindicato de LAG).
- Otras exportaciones (SICORE con P2437/P2438, F.1357, F.1359, bancos con P3129 y P2262/P2406/P2449/P2671/P2672/P519, Libro de Sueldos Digital): quedan documentadas solo por sus parámetros; el formato de archivo es un layout externo y no regla de negocio.

### 15.7 Parámetros incorporados en esta pasada

| Parámetro | Uso verificado | Referencia |
|---|---|---|
| P2264 | Sigla de la cooperativa; activa comportamientos por cliente (ej. “DEAN” en Luz y Fuerza) | `ReglasNegocio.Sueldos/clsInformes_Sueldo.cs:1703` |
| P2611 | Inicio del año fiscal de Ganancias: 1 = febrero, 2 = diciembre del año anterior, otro = enero **[VERIFICAR]** | `ReglasNegocio.Sueldos/clsGanancias.cs:515, 580` |
| P2653 | Oculta proveedores empleados en previsiones de pago | `ReglasNegocio.Facturacion/clsInformes_Compras.cs:3615-3696` |
| P3129 | Exportación bancaria por CBU múltiple del empleado (`SU_EMP_CBU`) en vez del banco único | `ReglasNegocio.Sueldos/clsInformes_Sueldo.cs:1638` |
