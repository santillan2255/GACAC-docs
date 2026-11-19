# T04b CFG — Catálogo de parámetros ProCoop, parte 2: VENTAS_Y_FACTURACION

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP / Impuestos / Landing-autogestión / Plataforma |
| Olas | O1 (motor de parámetros, T04) · O4 (facturación, tarifas, ARCA) · O5 (cobranza, anticipos) · O6 (mora) · O7 (medidos, gas, cos φ, reguladores) · O8 (libros IVA, regímenes) · O10 (institucional, telefonía, salud) |
| Dueño de datos | T04 CFG es dueño del registro de parámetros (`tenantParameters`, alias de `parameterValues` según CTR-CFG-14 y CTR-DAT-49; versionado y publicado). Cada anexo destino es dueño de la **semántica** y de las validaciones de sus claves. |
| Fuentes consolidadas | RN-09 §2 (líneas 1–212: almacenamiento y lectura de `VARIABLE`/`VARIABLE_PMOVIL`) y RN-09 §6, módulo VENTAS_Y_FACTURACION (313 parámetros, 199 con lectura directa); RN-01 §20; RN-02 §14; `_GUIA-REDACCION-ANEXOS.md` |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Propósito

Convertir **cada uno** de los 313 parámetros `Busca_V2_*` que ProCoop declara en el módulo `VENTAS_Y_FACTURACION` (columna `COD_MOD`) en su destino dentro de CoopApps: un parámetro tipado del tenant, un atributo de configuración de servicio/categoría/producto/cuadro, una clave de diccionario, un elemento de marca, un parámetro de plataforma, un secreto de bóveda, un mecanismo nuevo que lo reemplaza o un descarte con motivo. Este documento es la parte 2 del catálogo `T04b-CFG-catalogo-parametros-procoop.md`; usa el prefijo `P2-` en los PRM-ID para no chocar con la parte 1.

Los anexos destino (M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M17, M18, M19, T01, T03, T06, T09) **deben incorporar** en su sección 14 los PRM de este catálogo que les corresponden, con el mismo ID, clave, tipo, ámbito y default, y citar `V2 #n` en la columna Origen.

## 2. Fuente y forma de almacenamiento en ProCoop (resumen de RN-09 §2)

- Tabla clave/valor `VARIABLE` (una base = una cooperativa) con `COD_VAR` numérico, descripción `NOM_VAR` y **tres columnas de valor en paralelo** (`CARACTER`, `NUMERICA`, `LOGICA`); `TIP_VAR` indica cuál se usa (`C`, `N`, `L`, `E`, `F`, `P` = "personalizada", que usa varias columnas a la vez: son las filas "Mixto" de este catálogo).
- `VARIABLE_PMOVIL` agrega `MOD_VAR` (1 CoopOnline, 2 PMovil/Captor, 3 PWeb): parámetros que leen las aplicaciones externas.
- Editor según `TIP_CTRL`/`CONF_CTRL`: 1 = FK a una tabla, 2 = lista cerrada (enum), 5 = ruta, 6 = cuenta contable.
- Lectura con caché por proceso (`Nucleo.BuscaVariable`); **si el número no existe se inserta "Sin Utilizar"**; sin validación de rangos ni dependencias; auditoría genérica al escribir (`Actu_V2`); migraciones puntuales de valores en `FinalizarChequeos` (por ejemplo, 21 y 383 → 742).
- 114 de los 313 parámetros no tienen lectura directa en los fuentes descompilados (los usan CoopOnline/PMovil/PWeb, el Agente, procedimientos almacenados, enums o están obsoletos). Se catalogan igual; ver PA-CFG-P2-01.

**Mejoras obligatorias en CoopApps (T04):** clave semántica en lugar de número; un solo campo `value` validado por esquema Zod por clave (tipo, rango, enum, referencia existente); default declarado en código; dependencias entre claves declaradas (ej. `tar.redondeo.conceptoId` obligatorio si `tar.redondeo.tipo ≠ sinRedondeo`); versionado con `validFrom` y publicación (O1); historial de valores con usuario y fecha; lectura de una clave inexistente = error de programación, nunca inserción silenciosa.

## 3. Criterio de decisión

| Decisión | Significado | Destino |
|---|---|---|
| **Migrar** | Parámetro funcional del tenant. Se crea un PRM con clave semántica tipada; el valor de ProCoop se traslada en la migración (T07), traduciendo códigos FK a `ObjectId`. | Sección 14 del anexo destino |
| **Migrar-servicio** | Deja de ser global: pasa a ser atributo de la configuración del **servicio, categoría, producto o cuadro tarifario** (M02/M04). El valor global de ProCoop se usa como default al migrar cada servicio/categoría. | M02 / M04 (modelo de servicio y categoría) |
| **Diccionario** | Es un texto visible: pasa a clave `dict:` con override por tenant. | T03 |
| **Marca** | Es un elemento de identidad visual del tenant. | T03 (branding) |
| **Plataforma** | Lo administra el operador SaaS (infraestructura, límites técnicos, endpoints, umbrales normativos nacionales). Cuando corresponde lleva PRM de ámbito `plataforma`. | T01 / T06 / T09 |
| **Bóveda** | Secreto (certificado, contraseña). Va a la bóveda de credenciales por tenant. **No se transcriben valores.** | T06 |
| **Reemplazado** | El comportamiento se conserva con otro mecanismo de CoopApps (capability, estado, plantilla, job, atributo siempre disponible, valor de un enum unificado). Se indica el mecanismo. | El indicado |
| **Descartar** | No se replica; se indica el motivo (deuda técnica, preferencia de pantalla, sincronización con bases externas). | — |

## 4. Leyenda de columnas

- **V2 #**: `COD_VAR`. El 24 aparece dos veces (uno en `VARIABLE` y otro en `VARIABLE_PMOVIL`), por eso se distinguen como `24` y `24-PM`.
- **Tabla/canal**: `VAR` = `VARIABLE`; `PM/PMovil`, `PM/CoopOnline` = `VARIABLE_PMOVIL` con su canal.
- **Tipo**: tipo ProCoop (Lógico, Numérico, Entero, Texto, Lista, FK `TABLA`, Mixto).
- **Uso en código**: clase.método principal (RN-09); "sin lectura" = sin lectura directa en RN/Cfg/PN.
- **PRM-ID**: `PRM-<COD anexo destino>-P2-NNN`; solo para Migrar, Migrar-servicio y Plataforma parametrizable. "—" en el resto.
- **Tipo nuevo**: `boolean`, `integer`, `decimal` (Decimal128, no importe), `money` (Decimal128 en ARS, `decimal.js`), `string`, `time`, `enum[...]`, `ref:<colección>`, `list<...>`; "(nullable)" = el valor nulo significa "función desactivada".
- **Ámbito**: `plataforma`, `tenant`, `servicio`, `categoría`, `producto`, `tipoComprobante`. "tenant (override servicio)" = el servicio puede sobrescribirlo.
- **Colecciones referenciadas**: `products` (ex `PROD_SER`), `services` (ex `SERVICIO`), `serviceCategories` (ex `CATE_SER`), `invoiceTypes` (ex `TIPO_FAC`, tipo interno de comprobante/cuota), `documentTypes` (ex `COMPROB`, tipo fiscal), `pointsOfSale` (ex `PTOVENTA`), `persons` (ex `SOCIOS`), `accounts` (cuentas/suministros), `sellers` (ex `VENDEDOR`), `taxes` (ex `IMPUESTO`), `ivaConditions` (ex `SITIVA`), `messageTemplates` (ex `PLANTILLA`), `documentTemplates` (plantillas de impresión), `bankAccounts`, `billingGroups`, `customAttributes`.
- **[VERIFICAR]**: valor u opción que debe confirmarse contra una base real de ProCoop durante la migración (T07).

## 5. Catálogo por subtema

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Cálculo de la factura de servicios (motor tarifario, gas, cos φ, telefonía, redondeo)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 14 | VAR | Numérico | Factor calórico óptimo | `clsFacturacionServicio.ConsumosDivididos`: divisor de la corrección del consumo de gas por poder calorífico (RN-01 §4.4) | Migrar-servicio | PRM-TAR-P2-001 | tar.gas.poderCalorificoReferencia | decimal (kcal/m³) | servicio (gas) | 9300 [VERIFICAR] | M04 |
| 19 | VAR | FK `PROD_SER` | Concepto para facturar CPP | `clsCVLP.ProcesarCPP`; `FacturarConsumos_Telefonia` (llamadas clave 100); informe de llamadas CPP | Migrar-servicio | PRM-TAR-P2-002 | tar.telefonia.conceptoCppId | ref:products | servicio (telefonía) | — (obligatorio si se tasan llamadas CPP) | M04 (con M10) |
| 21 | VAR | Lógico | NO redondear total de factura | Constructor `clsComprobanteFactura`; `FinalizarChequeos` lo traslada a la 742 | Reemplazado | — | Valor `sinRedondeo` de tar.redondeo.tipo (PRM-TAR-P2-007) | — | — | — | M04 |
| 24 | VAR | FK `PROD_SER` | Concepto para facturar llamadas internacionales | `FacturarConsumos_Telefonia` (`INTERNAC`); informe de llamadas internacionales | Migrar-servicio | PRM-TAR-P2-003 | tar.telefonia.conceptoInternacionalId | ref:products | servicio (telefonía) | — | M04 (con M10) |
| 119 | VAR | Lista | Redondear consumo corregido en gas | `clsEnargas.Get_File_FDU`; `RedondeoGas`; `Get_Recategorizacion_Gas` (2 truncar, 3 redondear, o solo dividir) | Migrar-servicio | PRM-TAR-P2-004 | tar.gas.redondeoConsumoCorregido | enum[truncar, redondearEntero, sinRedondeo] | servicio (gas) | redondearEntero [VERIFICAR] | M04 |
| 149 | VAR | Lógico | Utilizar consumo real de gas natural | sin lectura | Migrar-servicio | PRM-TAR-P2-005 | tar.gas.usarConsumoSinCorregir | boolean | servicio (gas) | false | M04 |
| 243 | VAR | Lógico | Valor por default: no bonificar coseno | `abm_Servicio_Categorias.ConfigurarForm` (valor inicial al crear categoría) | Migrar-servicio | PRM-TAR-P2-006 | tar.cosFi.plantillaCategoria.noBonificar | boolean | servicio (default de nuevas categorías) | false | M04 |
| 742 | VAR | Lista | Tipo de redondeo en facturas (revisar 2095, 2096, 2097) | `FinalizarChequeos` (absorbe 21 y 383); `clsFacturacionServicio.AgregarRedondeo` (RN-01 §15) | Migrar | PRM-TAR-P2-007 | tar.redondeo.tipo | enum[sinRedondeo, conItemRedondeo, conArrastreAnterior] [VERIFICAR opciones] | tenant (override tipoComprobante) | sinRedondeo | M04 |
| 2091 | VAR | FK `PROD_SER` | Valor por default: concepto para recargo por factor de potencia | `abm_Servicio_Categorias.ConfigurarForm` | Migrar-servicio | PRM-TAR-P2-008 | tar.cosFi.plantillaCategoria.conceptoRecargoId | ref:products | servicio (electricidad) | — | M04 |
| 2092 | VAR | FK `PROD_SER` | Valor por default: concepto para bonificación por factor de potencia | `abm_Servicio_Categorias.ConfigurarForm` | Migrar-servicio | PRM-TAR-P2-009 | tar.cosFi.plantillaCategoria.conceptoBonificacionId | ref:products | servicio (electricidad) | — | M04 |
| 2093 | VAR | Numérico | Valor por default: tope de coseno de φ | `abm_Servicio_Categorias.ConfigurarForm` | Migrar-servicio | PRM-TAR-P2-010 | tar.cosFi.plantillaCategoria.tope | decimal (0–1) | servicio (electricidad) | 0,95 [VERIFICAR] | M04 |
| 2095 | VAR | FK `PROD_SER` | Redondeo: concepto para redondeo | `AgregarRedondeo` | Migrar | PRM-TAR-P2-011 | tar.redondeo.conceptoId | ref:products | tenant | — (obligatorio si tipo ≠ sinRedondeo) | M04 |
| 2096 | VAR | FK `PROD_SER` | Redondeo: concepto para redondeo anterior | `AgregarRedondeo` (arrastre del período previo) | Migrar | PRM-TAR-P2-012 | tar.redondeo.conceptoAnteriorId | ref:products | tenant | — (obligatorio si tipo = conArrastreAnterior) | M04 |
| 2097 | VAR | Lista | Redondeo: cantidad de decimales a redondear | `AgregarRedondeo` | Migrar | PRM-TAR-P2-013 | tar.redondeo.decimales | integer (0–2) | tenant (override tipoComprobante) | 0 | M04 |
| 2253 | VAR | FK `SERVICIO` | Servicio de pack SMS | `clsTelefoniaMovil.Importar_AsignarConceptos_1/_2` (asigna conceptos al importar consumos móviles) | Migrar-servicio | PRM-TAR-P2-014 | tar.telefoniaMovil.servicioPackSmsId | ref:services | tenant | — | M04 (con M10) |
| 2283 | VAR | Mixto, FK `PROD_SER` | Concepto para recargo en cambio de trama | `clsFacturacionServicio.CorrijeItemsPrepaga` (ajuste de prepaga, RN-01 §4.8) | Migrar-servicio | PRM-TAR-P2-015 | tar.prepaga.conceptoRecargoCambioTramoId | ref:products | servicio | — | M04 (con M03) |
| 2342 | VAR | Mixto, Numérico | Importe máximo de redondeo automático | `clsPrepaga.CalcularConsumo`, `CalculaConsumo_Autogestion`; `clsFacturacionMasiva.ObtenerFacturas` | Migrar | PRM-TAR-P2-016 | tar.redondeo.importeMaximo | money (nullable) | tenant | 1,00 [VERIFICAR] | M04 |
| 2375 | VAR | Numérico | Valor constante para el cálculo de recargo por tan(φ) | `GC_FacturarFactorPotencia` (método 2); `abm_Servicio_Categorias.cboMetodo_Fi` | Migrar-servicio | PRM-TAR-P2-017 | tar.cosFi.constanteTangente | decimal | categoría | 1,5 | M04 |
| 2404 | VAR | Lógico | Permitir facturar a todos los servicios con un cuadro anterior | sin lectura | Migrar | PRM-TAR-P2-018 | tar.cuadros.permitirFacturarConCuadroAnterior | boolean | tenant | false | M04 |
| 2407 | VAR | Numérico | Valor constante para el cálculo de recargo por cos(φ) | `GC_FacturarFactorPotencia` (método 5); `abm_Servicio_Categorias` | Migrar-servicio | PRM-TAR-P2-019 | tar.cosFi.constanteCoseno | decimal | categoría | — [VERIFICAR] | M04 |
| 2417 | VAR | Lógico | Especificar período al dividir consumos (al facturar filtra por período los consumos a tomar) | sin lectura | Migrar | PRM-MED-P2-001 | med.consumos.divisionPorPeriodo | boolean | tenant | false | M03 |
| 2442 | VAR | Entero | Cantidad de períodos máximos en la estimación de consumos | `DetalleGrilla.EstimarConsumo`; `ConsumosARecalcular`, `ConsumosARecalcularTestigo` | Migrar | PRM-MED-P2-002 | med.estimacion.periodosMaximos | integer (≥ 1) | tenant (override servicio) | 3 [VERIFICAR] | M03 |
| 2465 | VAR | Lógico | Permite utilizar la marca "Cobrar consumo mínimo en baja" | `GetItemsServicioMedido`; `abm_Servicio_Categorias.ConfigurarForm/Guardar` (RN-01 §4.5) | Migrar-servicio | PRM-TAR-P2-020 | tar.categoria.cobrarConsumoMinimoEnBaja | boolean | categoría | false | M04 |
| 2498 | VAR | Lógico | Utilizar numeración 1–6 en períodos bimestrales de gas al recategorizar | `clsRecategorizacion.Get_Recategorizacion_Gas` | Migrar-servicio | PRM-TAR-P2-021 | tar.gas.recategorizacion.numeracionBimestral | boolean | servicio (gas) | false | M04 |
| 2514 | VAR | Lógico | Facturar consumo en 0 cuando no registre consumos de telefonía | `FacturarConsumos_Telefonia` | Migrar-servicio | PRM-TAR-P2-022 | tar.telefonia.facturarConsumoCero | boolean | servicio (telefonía) | false | M04 |
| 2520 | VAR | Lógico | Ordenar tarifas por código de concepto en configuración de servicio | `clsConsumos.GetConsumosPorCuenta`; `abm_Servicio_Categorias` | Descartar | — | — (preferencia de orden de grilla: el DataTable tiene orden configurable y vistas guardadas) | — | — | — | — |
| 2530 | VAR | Lógico | Utilizar fecha de lectura en recategorización de gas | `Get_Recategorizacion_Gas` (por fecha de lectura en vez de período) | Migrar-servicio | PRM-TAR-P2-023 | tar.gas.recategorizacion.usarFechaLectura | boolean | servicio (gas) | false | M04 |
| 2643 | VAR | Lógico | Pedir "Fecha desde" para las lecturas de gas en la recategorización | sin lectura | Migrar-servicio | PRM-TAR-P2-024 | tar.gas.recategorizacion.solicitarFechaDesde | boolean | servicio (gas) | false | M04 |
| 2659 | VAR | Numérico | Tope mínimo para facturación de coseno de φ | `GC_FacturarFactorPotencia` (piso del coseno calculado, RN-01 §11.3) | Migrar-servicio | PRM-TAR-P2-025 | tar.cosFi.pisoCosenoCalculado | decimal (0–1) (nullable) | categoría | null | M04 |
| 2663 | VAR | Lógico | No facturar franqueo si el usuario se adhirió a factura electrónica (valida que tenga mail de envío) | `clsFacturacionServicio.AddFranqueo` | Migrar | PRM-TAR-P2-026 | tar.franqueo.omitirSiAdheridoDigital | boolean | tenant (override tipoComprobante) | true | M04 |
| 2701 | VAR | Lógico | Tomar consumos pendientes de facturar al tomar consumo de otro servicio | `GetConsumoServicioMedido` (filtro con `REL_SER`) | Migrar-servicio | PRM-TAR-P2-027 | tar.consumoRelacionado.incluirPendientes | boolean | servicio | false | M04 |
| 2737 | VAR | Lógico | Incluir energía inyectada en cálculo de coseno de φ | `GC_FacturarFactorPotencia` (base activa, RN-01 §4.6) | Migrar-servicio | PRM-TAR-P2-028 | tar.cosFi.incluirEnergiaInyectada | boolean | servicio (electricidad) | false | M04 |
| 2750 | VAR | Texto | Categorías para medidores compartidos (ids separados por coma; requiere propiedades personalizadas) | `clsFacturacionServicio.lstMultiCategorias` (multicategoría, RN-01 §3.3) | Migrar-servicio | PRM-TAR-P2-029 | tar.categoria.medidorCompartido | boolean (la lista de ids se convierte en marca por categoría) | categoría | false | M04 (con M03) |
| 2787 | VAR | Lógico | Tomar día de reconexión para cálculo de proporcional | `GetImporteCF`; `AgregarProporcional` (RN-01 §5.1) | Migrar-servicio | PRM-TAR-P2-030 | tar.proporcional.desdeDiaReconexion | boolean | servicio | false | M04 |
| 2827 | VAR | Lógico | Solo utilizar tramas proporcionales para determinar trama grande | `FacturarTramas`; `FacturarTrama_Prorrateo_Anterior` (RN-01 §4.2) | Migrar-servicio | PRM-TAR-P2-031 | tar.tramos.soloProporcionalesParaTramoMayor | boolean | servicio | false | M04 |
| 2864 | VAR | Lógico | No aplicar días proporcionales en consumos de menos días de los definidos | `GetImporteCF`; `FacturarConsumos` (anula el factor por días, RN-01 §4.3) | Migrar-servicio | PRM-TAR-P2-032 | tar.proporcional.omitirEnPeriodosCortos | boolean | servicio | false | M04 |
| 2876 | VAR | Lógico | Generar ítem extra para guardar cuadro tarifario (consumo 0 con prorrateo entre 2 cuadros) | `GetItemsServicioMedido` (RN-01 §4.7) | Reemplazado | — | Cada línea de factura guarda `tariffVersionId` y el desglose del prorrateo en el snapshot de cálculo (M04), haya o no consumo | — | — | — | M04 |
| 2928 | VAR | Lógico | Permitir prorratear demandas en grandes consumos | `FacturarGrandesConsumos` (`GC_FacturarDemanda2`, RN-01 §11.2) | Migrar-servicio | PRM-TAR-P2-033 | tar.grandesConsumos.prorratearDemanda | boolean | categoría | false | M04 |
| 3094 | VAR | FK `PROD_SER` | Concepto para anticipo por energía inyectada (si la factura del prosumidor da negativa, agrega concepto exento para dejarla en 0 y el saldo a favor) | `clsFacturacionMasiva.Dispose` (RN-01 §4.6) | Migrar-servicio | PRM-TAR-P2-034 | tar.generacionDistribuida.conceptoSaldoAFavorId | ref:products (nullable) | servicio (electricidad) | null | M04 (con M07) |
| 3111 | VAR | Lógico | Usar categoría histórica de servicios fijos por mes vencido (cambio de categoría técnica) | `DatosFormula.Servicio_Codigo_Categoria`; `GetItemsServicioFijo` (RN-01 §5) | Migrar-servicio | PRM-TAR-P2-035 | tar.categoria.usarHistoricaMesVencido | boolean | servicio | false | M04 |
| 3134 | VAR | FK `PROD_SER` | Concepto para cobro por atraso en devolución de ortopedia | `clsFacturacionServicio.GetItemsServicio` (cargo por días de atraso, RN-01 §1.2) | Migrar-servicio | PRM-SOC-P2-001 | soc.ortopedia.conceptoAtrasoDevolucionId | ref:products (nullable) | servicio (ortopedia) | null | M18 (con M04) |
| 3143 | VAR | Lógico | Solo tomar consumos sin facturar al tomar consumos de otro servicio | `clsFacturacionServicio.lstConsumos` (filtro `REL_SER`) | Migrar-servicio | PRM-TAR-P2-036 | tar.consumoRelacionado.soloSinFacturar | boolean | servicio | false | M04 |
| 3191 | VAR | Lógico | Permitir indicar qué servicios se facturan solos y cuáles no | sin lectura | Reemplazado | — | Atributo `billingMode` del servicio (independiente / agrupable en factura multiservicio, BASE §103), siempre disponible en M02 y aplicado por M05 | — | — | — | M02 / M05 |
| 3192 | VAR | Lógico | Permitir estimación de consumos de medidores testigos | sin lectura | Migrar | PRM-MED-P2-003 | med.estimacion.permitirEnMedidorTestigo | boolean | tenant | false | M03 |

### 5.2 Emisión masiva y comprobantes manuales

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 421 | VAR | Lógico | Bloquear facturación masiva | sin lectura | Reemplazado | — | Estado `bloqueado` del ciclo de facturación y capability `fac.ciclos.bloquear` (M05); el bloqueo queda auditado con motivo | — | — | — | M05 |
| 2315 | VAR | Entero | Cantidad de cuentas a tomar por grupo de facturación (masiva) | `clsFacturacionMasiva.Dispose` (tamaño de lote, por defecto 100) | Plataforma | PRM-PLA-P2-001 | fac.masiva.tamanoLoteJob | integer (10–1000) | plataforma | 100 | T01 (con M05, job `fac:emitir-lote`) |
| 2443 | VAR | Lógico | No facturar cuotas sin servicios | `clsFacturacionMasiva.GetItemsFactura` (no emite si la cuenta solo tiene cuotas) | Migrar | PRM-FAC-P2-001 | fac.masiva.noFacturarCuotasSinServicios | boolean | tenant | true | M05 |
| 2526 | VAR | Lógico | Generar factura en 0 al facturar consumos | `clsFacturacionMasiva.ObtenerFacturas` (emite aunque el neto sea 0 si hubo lecturas) | Migrar | PRM-FAC-P2-002 | fac.masiva.emitirFacturaEnCero | boolean | tenant (override servicio) | false | M05 |
| 2769 | VAR | Lógico | Bloquear comprobantes de cuentas con otros comprobantes bloqueados en facturación masiva | `clsFacturacionElectronica.GetIdBloqueo`; `clsFacturacionMasiva.GenerarFacturacion` | Migrar | PRM-FAC-P2-003 | fac.masiva.propagarBloqueoCobro | boolean | tenant | false | M05 (con M07) |
| 3038 | VAR | Lógico | Permitir utilizar anticipos de productos en facturación masiva | `clsFacturacionServicio.lstAnticipos`, `AgregarAnticipos` (anticipos tipo 1, RN-01 §14) | Migrar | PRM-FAC-P2-004 | fac.masiva.aplicarAnticiposProductos | boolean | tenant | false | M05 (con M07) |
| 2271 | VAR | Entero | Cantidad de días máximos para vencimiento de factura manual | `clsComprobanteFactura.Validar` (máximo entre hoy y el 1.er vencimiento) | Migrar | PRM-FAC-P2-005 | fac.manual.diasMaximosPrimerVencimiento | integer (1–365) | tenant | 60 | M05 |
| 2450 | VAR | Lista | Relacionar créditos al cargar un comprobante manualmente: Sugerir / Obligar / Ignorar | sin lectura | Migrar | PRM-FAC-P2-006 | fac.manual.relacionarCreditos | enum[sugerir, obligar, ignorar] | tenant | sugerir (ProCoop: ignorar) | M05 (con M07) |
| 2472 | VAR | Lógico | Imprimir automáticamente factura manual generada | sin lectura | Migrar | PRM-FAC-P2-007 | fac.manual.imprimirAlEmitir | boolean | tenant | false | M05 |
| 2754 | VAR | Lógico | Permitir replicar comprobantes a todos los ítems | sin lectura | Migrar | PRM-FAC-P2-008 | fac.manual.permitirReplicarComprobanteEnItems | boolean | tenant | false [VERIFICAR semántica] | M05 |
| 3080 | VAR | Numérico | Importe máximo sugerido en facturas manuales | `clsComprobanteFactura.Validar` (pide confirmación si se supera) | Migrar | PRM-FAC-P2-009 | fac.manual.importeMaximoSugerido | money (nullable) | tenant | null | M05 |
| 2783 | VAR | Numérico | Importe máximo al generar créditos | sin lectura | Migrar | PRM-FAC-P2-010 | fac.creditos.importeMaximoSinAutorizacion | money (nullable) | tenant | null [VERIFICAR] | M05 (con T11 autorizaciones) |
| 2564 | VAR | FK `PROD_SER` | Concepto para descuentos en facturas | `clsComprobanteFactura.Validar`, `Get_Factura`; `clsComprobanteVenta.GetCompVen` | Migrar | PRM-FAC-P2-011 | fac.conceptos.descuentoId | ref:products | tenant | — (obligatorio si se habilitan descuentos) | M05 |
| 2695 | VAR | Lógico | Permitir modificar el período de facturas | sin lectura | Reemplazado | — | Capability `fac.comprobantes.editarPeriodo`, solo sobre comprobantes en borrador; emitido = inmutable (se anula y reemite) | — | — | — | M05 / T02 |
| 3133 | VAR | Lógico | Permitir utilizar otras monedas en la registración manual de facturas y venta de productos | sin lectura | Migrar | PRM-FAC-P2-012 | fac.monedas.permitirMonedaExtranjera | boolean | tenant | false | M05 (con M11) |
| 2476 | VAR | Lista | Tipo de fecha a mostrar (No especificado / Emisión / Vencimiento) en "Movimiento de conceptos", "Cuentas por cobrar" y "Libro IVA ventas" | sin lectura | Migrar | PRM-FAC-P2-013 | fac.informes.fechaReferencia | enum[noEspecificado, emision, vencimiento] | tenant | emision | M05 (con T10) |

### 5.3 Numeración, puntos de venta y tipos de comprobante

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 376 | VAR | Lógico | Permitir numeración manual de comprobantes | sin lectura | Migrar | PRM-FAC-P2-014 | fac.numeracion.permitirNumeracionManual | boolean (solo puntos de venta no electrónicos: talonario manual/contingencia) | tenant (override puntoVenta) | false | M05 |
| 2278 | VAR | Lógico | Permite redondear ítems de factura según tipos de factura (solo habilita la opción en la carga de tipos de factura; puede generar inconsistencias en reportes) | sin lectura | Reemplazado | — | Configuración de redondeo siempre disponible en el tipo de comprobante (`invoiceTypes.rounding`), con override de PRM-TAR-P2-007/013; los reportes usan el total redondeado registrado | — | — | — | M04 / M05 |
| 2383 | VAR | FK `PTOVENTA` | Punto de venta fijo para presupuesto PMovil | `clsPresupuesto.CrearPRESUPU`, `ActualizarPRESUPU`; `clsPMovil_Venta.SincronizaPresupuestos` | Migrar | PRM-VEN-P2-001 | ven.presupuestos.puntoVentaMovilId | ref:pointsOfSale | tenant | — | M11 |
| 2592 | VAR | FK `TIPO_FAC` | Tipo de factura para ventas con presupuesto en PMovil | `clsPMovil_Venta.Sincronizar` | Migrar | PRM-VEN-P2-002 | ven.pwa.tipoComprobanteConPresupuestoId | ref:invoiceTypes | tenant | — | M11 |
| 2641 | VAR | FK `TIPO_FAC` | Tipo de factura para ventas sin presupuesto en PMovil | `clsPMovil_Venta.Sincronizar` | Migrar | PRM-VEN-P2-003 | ven.pwa.tipoComprobanteSinPresupuestoId | ref:invoiceTypes | tenant | — | M11 |

### 5.4 Vencimientos, recargos, intereses y desbloqueo

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 58 | VAR | FK `TIPO_FAC` | Tipo de cuota para agregar deuda de cuotas | sin lectura | Migrar | PRM-MOR-P2-001 | mor.financiacion.tipoComprobanteDeudaCuotasId | ref:invoiceTypes | tenant | — | M08 |
| 59 | VAR | FK `PROD_SER` | Concepto a facturar para agregar deuda de cuotas | sin lectura | Migrar | PRM-MOR-P2-002 | mor.financiacion.conceptoDeudaCuotasId | ref:products | tenant | — | M08 |
| 273 | VAR | Lógico | Emitir facturas por intereses, NO nota de débito | `clsRegistracionCobranza.NuevaFactura` (interés por pago fuera de término al cobrar) | Migrar | PRM-MOR-P2-003 | mor.intereses.comprobanteInteresesAlCobrar | enum[notaDebito, factura] | tenant | notaDebito | M08 (con M07) |
| 339 | VAR | FK `COMPROB` | Comprobante para intereses adelantados en facturas | sin lectura | Migrar | PRM-MOR-P2-004 | mor.intereses.tipoComprobanteInteresesAdelantadosId | ref:documentTypes | tenant | — [VERIFICAR] | M08 |
| 578 | VAR | Numérico | Porcentaje/importe de recargo entre vencimientos de facturas | `CalcularTotalFactura_VariablePorcentaje`, `_FijoPorcentaje`, `_FijoPesos` (método según V2 #74, parte 1) | Migrar | PRM-FAC-P2-015 | fac.vencimientos.recargoEntreVencimientos | decimal (porcentaje o importe según el método del PRM de V2 #74) | tenant (override servicio) | 0 | M05 |
| 2292 | VAR | Lista | Tipo de interés para facturas impagas: Estándar / Conceptos personalizados (CAU) / Estándar con recargo en cheques / Estándar con fecha de pago según cheques (AL) | `clsFacturarIntereses.Get_Comprobantes` | Migrar | PRM-MOR-P2-005 | mor.intereses.metodoFacturasImpagas | enum[estandar, porConcepto, estandarRecargoCheques, estandarFechaPagoCheque] | tenant | estandar | M08 |
| 2607 | VAR | FK `PROD_SER` | Concepto para bonificación de intereses por financiación en adelanto de cuotas (financiación); sin configurar no bonifica | `ItemsComprobanteCollection.AddRange` (RN-01 §23.4) | Migrar | PRM-MOR-P2-006 | mor.financiacion.conceptoBonificacionAdelantoCuotasId | ref:products (nullable) | tenant | null | M08 |
| 2770 | VAR | Numérico | Porcentaje de interés a cobrar al desbloquear comprobantes | sin lectura | Migrar | PRM-MOR-P2-007 | mor.desbloqueo.interesPorcentaje | decimal | tenant | 0 | M08 |
| 2771 | VAR | FK `PROD_SER` | Concepto para intereses cobrados al desbloquear comprobantes | sin lectura | Migrar | PRM-MOR-P2-008 | mor.desbloqueo.conceptoInteresId | ref:products | tenant | — (obligatorio si PRM-MOR-P2-007 > 0) | M08 |
| 2984 | VAR | FK `TIPO_FAC` | Tipo de comprobante para intereses por desbloqueo de cuentas | sin lectura | Migrar | PRM-MOR-P2-009 | mor.desbloqueo.tipoComprobanteId | ref:invoiceTypes | tenant | — | M08 |
| 3138 | VAR | Lógico | Intereses punitorios sobre energía | sin lectura | Migrar | PRM-MOR-P2-010 | mor.intereses.punitoriosSobreEnergia | boolean | tenant (override servicio) | false [VERIFICAR] | M08 |

### 5.5 Impresión, PDF, código de barras y distribución (mail, WhatsApp)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 34 | VAR | Texto | Reporte para factura con talón sumado | `clsGenerarPDF.GenerarPDF_Facturas`; `frmPrintPreview.AddFactura` | Reemplazado | — | Plantilla de documento versionada con `purpose = invoiceSummedStub` en `documentTemplates` (M05) | — | — | — | M05 |
| 42 | VAR | Mixto | Mostrar vista previa de facturas | sin lectura | Reemplazado | — | Vista previa PDF siempre disponible en modal antes de imprimir/enviar (patrón CNX) | — | — | — | M05 / T03 |
| 130 | VAR | Texto | Informe para remitos | sin lectura | Reemplazado | — | Plantilla `purpose = deliveryNote` en `documentTemplates` | — | — | — | M11 |
| 156 | VAR | Mixto, Texto | Informe para factura de venta de prepaga | `DatosImpresion_Factura.NombreReporte` | Reemplazado | — | Plantilla `purpose = prepaidSaleInvoice` en `documentTemplates` | — | — | — | M05 |
| 210 | VAR | Texto | Informe para presupuesto | `clsTickets.GetInformePresupuesto` | Reemplazado | — | Plantilla `purpose = quote` en `documentTemplates` | — | — | — | M11 |
| 242 | VAR | Lista | Tipo de emisión de resumen por socio: No emitir / Por socio sin financiaciones / Por socio con financiaciones / Por suministro sin financiaciones / Por suministro con financiaciones | `clsComprobanteFactura.Get_Facturas`; `GetResumenPorSocio`; `PR_BancoCordoba50_FacturaResumen.Get_CodigoBarras` (el código de barras identifica socio o cuenta) | Migrar | PRM-FAC-P2-016 | fac.resumen.modoEmision | enum[noEmitir, porTitularSinFinanciaciones, porTitularConFinanciaciones, porCuentaSinFinanciaciones, porCuentaConFinanciaciones] | tenant | noEmitir | M05 (con M07) |
| 291 | VAR | Lógico | Imprimir factura con talón sumado | sin lectura | Migrar | PRM-FAC-P2-017 | fac.impresion.talonSumado.habilitado | boolean | tenant | false | M05 |
| 312 | VAR | Texto | Informe para liquidación de crédito | `clsComprobanteVenta.GetLiquidacionCredito` | Reemplazado | — | Plantilla `purpose = creditSettlement` en `documentTemplates` | — | — | — | M11 |
| 404 | VAR | Entero | Envío de mails: enviar en grupos de | `Manager.EnviarMailsPendientes`; `frm_VisorMensajes.EnviarMail` | Plataforma | PRM-COM-P2-001 | com.email.tamanoGrupoEnvio | integer | plataforma (límite por proveedor de envío) | 50 | T09 |
| 461 | VAR | Entero | Envío de mails: tiempo de espera para envío (segundos) | `Manager.EnviarMailsPendientes`; `frm_VisorMensajes.EnviarMail` | Plataforma | PRM-COM-P2-002 | com.email.esperaEntreGruposSeg | integer | plataforma (rate limiting del worker) | 5 | T09 |
| 484 | VAR | Lógico | Usar número de cuenta en lectura de código de barra en vez de ruta SR | sin lectura | Migrar | PRM-FAC-P2-018 | fac.codigoBarras.identificadorCliente | enum[cuenta, rutaSecuencia] | tenant | cuenta | M05 (con M07) |
| 539 | VAR | Lógico | Facturación electrónica: adjuntar archivo en mail | sin lectura | Migrar | PRM-FAC-P2-019 | fac.distribucion.email.adjuntarPdf | boolean (false = solo enlace firmado) | tenant | true | M05 (con T09) |
| 540 | VAR | FK `PLANTILLA` | Facturación electrónica: plantilla para envío | sin lectura | Migrar | PRM-FAC-P2-020 | fac.distribucion.email.plantillaId | ref:messageTemplates | tenant | plantilla de sistema `fac.factura.emitida` | M05 (con T09) |
| 565 | VAR | Texto | Informe para facturas | `DatosImpresion_Factura.NombreReporte` (reporte por defecto) | Reemplazado | — | Plantilla `purpose = invoice` en `documentTemplates`, con override por tipo de comprobante y servicio | — | — | — | M05 |
| 2157 | VAR | Lógico | Incluir detalle de llamadas en la impresión individual de las facturas | sin lectura | Migrar-servicio | PRM-FAC-P2-021 | fac.impresion.telefonia.incluirDetalleLlamadas | boolean | servicio (telefonía) | false | M05 (con M10) |
| 2274 | VAR | Entero | Lote por defecto para impresión de facturas (100) | sin lectura | Plataforma | PRM-PLA-P2-002 | fac.impresion.tamanoLoteRender | integer | plataforma | 100 | T01 (con M05) |
| 2319 | VAR | Lógico | Permite impresión por duplicado en facturación masiva | sin lectura | Migrar | PRM-FAC-P2-022 | fac.impresion.masiva.permitirDuplicado | boolean | tenant | false | M05 |
| 2367 | VAR | Lógico | Separar facturas por titular según cantidad | `frmAdjuntarPdfs` | Migrar | PRM-FAC-P2-023 | fac.distribucion.separarPdfPorTitular | boolean | tenant | false | M05 |
| 2368 | VAR | Texto | Fuente a utilizar en la generación de PDF | `clsGenerarPDF.GenerarPDF`, `GenerarPDF_Factura`, `GenerarPDF_Facturas` | Marca | — | Tipografía de documentos del tema del tenant (`branding.documentFont`) | — | — | — | T03 |
| 2369 | VAR | Lista | Calidad de imagen en la generación de PDF: Muy alta / Alta / Normal / Baja / Muy baja | `clsGenerarPDF.*` | Plataforma | PRM-PLA-P2-003 | fac.pdf.calidadImagen | enum[muyAlta, alta, normal, baja, muyBaja] | plataforma | normal | T01 (con M05) |
| 2402 | VAR | Texto | Contraseña para los PDF generados en la impresión masiva | `frmPrintPreview.ExportReport` | Bóveda | — | Secreto `fac.pdf.passwordMasiva` en la bóveda del tenant (valor no transcripto); ver PA-CFG-P2-03 | — | — | — | T06 |
| 2423 | VAR | Lógico | Agrupar el envío de mails de facturación por cuenta | sin lectura | Migrar | PRM-FAC-P2-024 | fac.distribucion.email.agrupacion | enum[ninguna, porCuenta, porTitular] | tenant | ninguna | M05 (con T09) |
| 2426 | VAR | Lógico | Usar servicio de ProCoop para el envío automático de mails | `frm_VisorMensajes` | Reemplazado | — | Job `com:enviar-mensajes` (BullMQ) con reintentos; siempre asincrónico | — | — | — | T09 |
| 2511 | VAR | Lógico | Permitir forzar reportes en impresión masiva | sin lectura | Reemplazado | — | Capability `fac.impresion.forzarPlantilla` (elegir otra plantilla en la corrida) | — | — | — | M05 / T02 |
| 2612 | VAR | FK `PROD_SER` | Concepto a cobrar por reimpresión de comprobantes | sin lectura | Migrar | PRM-FAC-P2-025 | fac.impresion.conceptoReimpresionId | ref:products (nullable) | tenant | null | M05 |
| 2621 | VAR | Lógico | Generar automáticamente link de pago en impresión de facturas | sin lectura | Migrar | PRM-FAC-P2-026 | fac.impresion.linkPago.generarAutomatico | boolean | tenant | false | M05 (con M07) |
| 2626 | VAR | Entero | Cantidad de mails enviados por lote en la impresión masiva de facturación | `frm_VisorMensajes.ok_Cancel1_ClickAceptar` | Plataforma | PRM-COM-P2-003 | com.email.tamanoLoteMasivo | integer | plataforma | 500 | T09 |
| 2635 | VAR | Lógico | Agrupar el envío de mails de facturación por socio | sin lectura | Reemplazado | — | Valor `porTitular` de fac.distribucion.email.agrupacion (PRM-FAC-P2-024); 2423 y 2635 se unifican en un enum excluyente | — | — | — | M05 |
| 2697 | VAR | Lógico | Convertir imágenes a JPEG al generar PDF | `clsGenerarPDF.*` | Plataforma | PRM-PLA-P2-004 | fac.pdf.convertirImagenesJpeg | boolean | plataforma | true | T01 |
| 2741 | VAR | Lógico | Asignar orden en impresión masiva de facturas | sin lectura | Migrar | PRM-FAC-P2-027 | fac.impresion.masiva.asignarOrdenReparto | boolean | tenant | false | M05 |
| 2815 | VAR | Lógico | Excluir servicios dados de baja al ordenar por ZSR del servicio en impresión masiva | `clsFacturasImpresion.GetFacturas`, `GetDatosReporteZSR` | Migrar | PRM-FAC-P2-028 | fac.impresion.masiva.excluirBajasEnOrdenZonaRuta | boolean | tenant | true | M05 |
| 2829 | VAR | Lógico | Obtener consumos de teléfono para subreportes de gráfico e historial en facturas de telefonía | `DatosImpresion_Factura.GetConsumos` | Migrar-servicio | PRM-FAC-P2-029 | fac.impresion.telefonia.incluirHistorialConsumos | boolean | servicio (telefonía) | true | M05 |
| 2947 | VAR | Lógico | Imprime factura simple si el talón está constituido por una sola factura | `clsWEB.GetPDF`; `frmPrintPreview.AddFactura` | Migrar | PRM-FAC-P2-030 | fac.impresion.talonSumado.simpleSiUnaFactura | boolean | tenant | true | M05 |
| 2954 | VAR | Lógico | Agrupar el envío de WhatsApp de facturación por socio | sin lectura | Migrar | PRM-FAC-P2-031 | fac.distribucion.whatsapp.agrupacion | enum[ninguna, porCuenta, porTitular, porTitularYTelefono] | tenant | ninguna | M05 (con T09) |
| 2955 | VAR | Lógico | Agrupar el envío de WhatsApp de facturación por cuenta | sin lectura | Reemplazado | — | Valor `porCuenta` de PRM-FAC-P2-031 | — | — | — | M05 |
| 3036 | VAR | Lógico | Mostrar siempre vista de descargas masivas en variable de plantilla | `Facturacion_Electronica.GetArchivoFactura` (variable de correspondencia) | Migrar | PRM-FAC-P2-032 | fac.distribucion.enlaceDescargaMasiva | boolean | tenant | false | M05 (con T09) |
| 3051 | VAR | Lógico | Agrupar el envío de WhatsApp de facturación por socio y número de teléfono | `GetDestino_NumeroDestinoSMS`; `clsPlantillasWhatsApp.GetNumeroDestino`; `clsSocios.GetNumeroDestino` | Reemplazado | — | Valor `porTitularYTelefono` de PRM-FAC-P2-031 | — | — | — | M05 |

### 5.6 Facturación electrónica y ARCA

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 726 | VAR | Lógico | Autorizar facturas con cliente ARCA automáticamente | `clsWeb_CoopOnline.RegistrarFacturasAuto` (Agente); `clsFacturacionElectronica.RegistrarFacturasAuto` | Migrar | PRM-FIS-P2-001 | fis.arca.autorizacionAutomatica | boolean | tenant | true | M06 (job `fis:autorizar-pendientes`) |
| 727 | VAR | Lógico | Aguardar a que se registre en ARCA la factura | `clsRegistracionCobranza.RegistrarPago`; `clsComprobanteVenta.Guardar` | Migrar | PRM-FIS-P2-002 | fis.arca.esperarCaeAntesDeEntregar | boolean | tenant | true | M06 (con M07, M11) |
| 2071 | VAR | Texto | Path de certificado ARCA | `GetTicketFirmante`; `CargarTicket` | Bóveda | — | Certificado y clave privada WSAA en la bóveda del tenant (`int.arca.certificado`); no se migra ruta ni archivo por base, se recarga | — | — | — | T06 |
| 2072 | VAR | Texto | URL ARCA para obtención de ticket de autenticación (WSAA) | `CargarTicket` | Plataforma | PRM-INT-P2-001 | int.arca.wsaa.url | string (por ambiente homologación/producción) | plataforma | URL oficial vigente de producción | T06 |
| 2073 | VAR | Texto | URL ARCA para registración de facturas electrónicas (WSFEv1) | `RegistrarFacturasAuto`; `CargarTicket` | Plataforma | PRM-INT-P2-002 | int.arca.wsfe.url | string (por ambiente) | plataforma | URL oficial vigente de producción | T06 |
| 2082 | VAR | Texto | Path carpeta entrada | sin lectura (intercambio de CSV de factura electrónica por carpeta) | Reemplazado | — | API `/api/v1/ext/...` con token e `Idempotency-Key`, o `ExcelImportWizard` | — | — | — | T06 |
| 2083 | VAR | Texto | Path carpeta salida | sin lectura | Reemplazado | — | Exportación descargable y webhooks/eventos `fis.invoice.authorized` | — | — | — | T06 |
| 2427 | VAR | Numérico | Importe máximo para autorizar los comprobantes de facturas electrónicas | sin lectura | Migrar | PRM-FIS-P2-003 | fis.arca.importeMaximoAutorizacionAutomatica | money (nullable) | tenant | null | M06 |
| 2431 | VAR | Texto | Facturación electrónica MiPyMEs: CBU | `clsFacturacionElectronica.GetDetRequest` (opcional FCE) | Migrar | PRM-FIS-P2-004 | fis.fce.cuentaBancariaId | ref:bankAccounts (CBU y alias salen de la cuenta) | tenant | — | M06 (con M14) |
| 2432 | VAR | Texto | Facturación electrónica MiPyMEs: alias CBU | `GetDetRequest` | Reemplazado | — | Atributo `alias` de la cuenta bancaria referenciada por PRM-FIS-P2-004 | — | — | — | M06 / M14 |
| 2497 | VAR | Texto | Separador de columnas de los archivos .CSV | `ChequearCarpetaIN`, `ChequearCarpetaOUT` | Reemplazado | — | Sin intercambio por carpetas (ver 2082/2083); las exportaciones CSV usan el separador del `DataTable` | — | — | — | T06 |
| 2515 | VAR | Numérico | Importe para emitir facturas MiPyME | `clsComprobante.GetComprobanteOperacion` (umbral FCE) | Plataforma | PRM-FIS-P2-005 | fis.fce.montoMinimoObligatorio | money, con vigencia (`validFrom`) | plataforma (valor normativo nacional; el tenant no lo edita) | valor vigente publicado por ARCA [VERIFICAR] | M06 |
| 2561 | VAR | Lógico | No utilizar Agente simple para autorizar cobranzas (requiere agente en otra PC con parámetro "AutCooponline") | sin lectura | Reemplazado | — | Workers BullMQ (`fis:autorizar-pendientes`) escalables; no hay agentes por PC | — | — | — | T01 / M06 |
| 2699 | VAR | Lógico | Validar vencimiento de archivo LUA | `Inicio_ProCoop_Load` (aviso junto con CESP) | Reemplazado | — | Job `fis:vigilar-vencimientos` con alertas de autorizaciones fiscales y certificados [VERIFICAR qué es el archivo LUA] | — | — | — | M06 |
| 2712 | VAR | Numérico | Importe máximo para enviar facturas electrónicas por lote | `clsFacturacionElectronica.AutorizaFacturas` | Migrar | PRM-FIS-P2-006 | fis.arca.lote.importeMaximoComprobante | money (nullable) | tenant | null | M06 |
| 2780 | VAR | Lógico | No utilizar CUIT genérico para registrar facturas | `GetDetRequest` | Migrar | PRM-FIS-P2-007 | fis.arca.noUsarDocumentoGenerico | boolean | tenant | false | M06 |
| 2925 | VAR | Texto | Vencimiento certificado ARCA (obtenido del certificado) | `LoginTicket.ObtenerLoginTicketResponse`; aviso en `Inicio_ProCoop_Load` | Reemplazado | — | Fecha derivada del certificado en bóveda (metadato `notAfter`) + alerta del job `fis:vigilar-vencimientos` | — | — | — | T06 / M06 |

### 5.7 Impuestos, libros IVA, regímenes informativos y reguladores (ENARGAS)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 543 | VAR | Numérico | Código de IMPUESTO para IVA | Informes de composición de deuda; `GererarAsiento_Compras_Facturacion`; `clsComprobanteFactura` (ítem "Alícuota X%") | Reemplazado | — | Campo tipado `taxes.kind = 'IVA'` del catálogo de impuestos (M06); no se identifica el IVA por código | — | — | — | M06 |
| 544 | VAR | FK `SITIVA` | Situación de IVA para no categorizados | `Impuestos.AplicaPercepcionIVA` (siempre percibe, también sobre cuotas); `clsLibroIVA` | Migrar | PRM-FIS-P2-008 | fis.iva.condicionNoCategorizadoId | ref:ivaConditions | tenant | condición "No categorizado" de sistema | M06 |
| 739 | VAR | Lógico | No permite registrar conceptos gravados en comprobantes internos | `clsCobranzas.Crear_Anticipo_Redondeo`; `clsComprobanteFactura.Validar` | Migrar | PRM-FIS-P2-009 | fis.comprobantesInternos.prohibirConceptosGravados | boolean | tenant | true | M06 (con M05) |
| 2254 | VAR | Entero | Subdistribuidor de gas natural (ENARGAS) | sin lectura | Migrar | PRM-FIS-P2-010 | fis.enargas.codigoSubdistribuidor | string | tenant | — | M06 |
| 2256 | VAR | Entero | Código de concepto de percepción (ENARGAS) | `clsEnargas.Get_File_DET`; `clsEnargas2.Get_File_FaD` | Migrar | PRM-FIS-P2-011 | fis.enargas.codigoConceptoPercepcion | string | tenant | — | M06 |
| 2257 | VAR | Texto | Código de entidad (ENARGAS) | `Get_File_CMD`; `Get_File_CoC` | Migrar | PRM-FIS-P2-012 | fis.enargas.codigoEntidad | string | tenant | — | M06 |
| 2258 | VAR | Texto | Código de contrato de entidad (ENARGAS) | `Get_File_CMD`; `Get_File_CoC`; `Get_File_FaV` | Migrar | PRM-FIS-P2-013 | fis.enargas.codigoContrato | string | tenant | — | M06 |
| 2259 | VAR | Texto | Modalidad emisión comisión (ENARGAS) | `Get_File_CMD`; `Get_File_CoC` | Migrar | PRM-FIS-P2-014 | fis.enargas.modalidadComision | string (código del protocolo) [VERIFICAR valores] | tenant | — | M06 |
| 2260 | VAR | Numérico | Porcentaje/importe comisión (ENARGAS) | `Get_File_CMD`; `Get_File_CoC` | Migrar | PRM-FIS-P2-015 | fis.enargas.comisionValor | decimal | tenant | 0 | M06 |
| 2603 | VAR | Lista | Modelo de archivo de tablas maestras SARI: Protocolo original / Protocolo FCU-DS | `clsEnargas.Get_ArchivoTablasMaestro`, `Get_Conceptos`, `Get_Tabla` | Migrar | PRM-FIS-P2-016 | fis.enargas.protocoloSari | enum[original, fcuDs] | tenant | original | M06 |
| 2728 | VAR | Entero | Código para diferenciar consumos excedentes de gas | `Get_File_DET`; `Get_File_FaD` | Migrar | PRM-FIS-P2-017 | fis.enargas.codigoConsumoExcedente | integer | tenant | — | M06 |
| 3174 | VAR | Lógico | Tomar matrícula de servicio de gas en campo Id Usuario(1) de archivos de ENARGAS | `clsEnargas2.InfoCobranzaFactura` | Migrar | PRM-FIS-P2-018 | fis.enargas.idUsuarioDesdeMatricula | boolean | tenant | false | M06 |
| 2325 | VAR | Lógico | Imprimir carátula del libro de IVA ventas por separado | sin lectura | Migrar | PRM-FIS-P2-019 | fis.libroIvaVentas.caratulaSeparada | boolean | tenant | false | M06 |
| 2358 | VAR | Lógico | Incluir conceptos asociados al servicio en exportador de consumos relevantes (RG 3349) | `RG3349.Get_Detalle_Exportar` | Migrar | PRM-FIS-P2-020 | fis.rg3349.incluirConceptosServicio | boolean | tenant | false | M06 |
| 2445 | VAR | FK `IMPUESTO` | Concepto para percepción de Ingresos Brutos de archivo DGR | `Exportar_ArchivoDGR`; `Exportar_Silarpib_Alem` | Migrar | PRM-FIS-P2-021 | fis.dgr.impuestoPercepcionIibbId | ref:taxes | tenant | — | M06 |
| 2446 | VAR | Numérico | Alícuota aplicada en generación de archivo DGR | `Exportar_ArchivoDGR` | Reemplazado | — | La alícuota sale del régimen de percepción y del padrón vigente por sujeto (M06); el archivo informa la alícuota efectivamente aplicada en cada comprobante | — | — | — | M06 |
| 2605 | VAR | Lista | Facturación en el libro IVA ventas: Todos / Solo facturación mensual / Solo facturación diaria | sin lectura | Reemplazado | — | Filtro del reporte; el libro IVA legal y el Libro IVA Digital incluyen siempre todos los comprobantes fiscales (ver PA-CFG-P2-04) | — | — | — | M06 / T10 |
| 2692 | VAR | Lógico | Exportar IVA ventas digital según fecha de filtro | `RG3685.Exportar_Venta`; `RG3685_ITEMS.Exportar_Venta` | Migrar | PRM-FIS-P2-022 | fis.libroIvaDigital.criterioFecha | enum[fechaComprobante, fechaFiltro] | tenant | fechaComprobante | M06 |
| 2972 | VAR | Lógico | Separar ítems financiados en libro de IVA ventas | `clsLibroIVA.GetDetalle_Facturado_Items`, `GetDetalle_Percibido`, `GetDetalle_Percibido_Items` | Migrar | PRM-FIS-P2-023 | fis.libroIvaVentas.separarItemsFinanciados | boolean | tenant | false | M06 |
| 2991 | VAR | Lógico | Exportar SI.CO.RE con coma y no con punto | `PercepcionSICORE.Get_RetencionesVenta` | Reemplazado | — | El exportador SICORE respeta el diseño de registro oficial vigente (separador decimal fijo por especificación) | — | — | — | M06 |
| 3062 | VAR | Lógico | Archivo ARBA: informar números telefónicos | `GetDatosInforme.Get_Informe_Arba` | Migrar | PRM-FIS-P2-024 | fis.arba.informarTelefonos | boolean | tenant | false | M06 |
| 3110 | VAR | Lógico | En libro IVA ventas según lo percibido se informa el total del IVA del comprobante | `clsLibroIVA.GetDetalle_Percibido` | Migrar | PRM-FIS-P2-025 | fis.libroIvaVentas.percibido.informarIvaTotal | boolean | tenant | false | M06 |

### 5.8 Terceros (CVLP, cobro por cuenta y orden, facturas de terceros)

CVLP = Cuenta de Venta y Líquido Producto: liquidación al tercero (por ejemplo, operador móvil por llamadas CPP) de lo facturado o cobrado por su cuenta, descontando comisión.

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 70 | VAR | FK `PROD_SER` | Concepto para comisiones CPP | `clsCVLP.GenerarCVLP` | Migrar | PRM-FAC-P2-033 | fac.terceros.cvlp.conceptoComisionId | ref:products | tenant (override convenio de tercero) | — | M05 (con M06) |
| 71 | VAR | Numérico | Comisión por defecto en generación de CVLP | sin lectura | Migrar | PRM-FAC-P2-034 | fac.terceros.cvlp.comisionPorcentajePorDefecto | decimal (0–100) | tenant (override convenio) | 0 | M05 |
| 76 | VAR | Lógico | Rendición de CVLP según cobranzas | sin lectura | Migrar | PRM-FAC-P2-035 | fac.terceros.cvlp.baseRendicion | enum[facturado, cobrado] | tenant (override convenio) | facturado | M05 (con M07) |
| 78 | VAR | Lógico | Generar nota de débito en CVLP | sin lectura | Migrar | PRM-FAC-P2-036 | fac.terceros.cvlp.generarNotaDebito | boolean | tenant | false | M05 |
| 141 | VAR | Lógico | NO incluir percepciones en CVLP | sin lectura | Migrar | PRM-FAC-P2-037 | fac.terceros.cvlp.excluirPercepciones | boolean | tenant | false | M05 (con M06) |
| 297 | VAR | Lista | Filtro a utilizar en generación de CVLP: Período / Fecha (desde/hasta) / N.º de lote | sin lectura | Migrar | PRM-FAC-P2-038 | fac.terceros.cvlp.criterioSeleccion | enum[periodo, rangoFechas, lote] | tenant | lote | M05 |
| 353 | VAR | FK `PROD_SER` | Concepto para comisiones 2 CPP | `clsCVLP.GenerarCVLP` (segunda comisión) | Migrar | PRM-FAC-P2-039 | fac.terceros.cvlp.conceptoComision2Id | ref:products (nullable) | tenant | null | M05 |
| 2081 | VAR | Lista | Modelo de impresión de facturas de terceros | `DatosImpresion_Factura.DatosExtra`; `clsFacturas_DatosExtras.CargarFacturasTerceros` (datos de terceros, ej. OSSE); `frmImportacionArchivos` | Migrar | PRM-FAC-P2-040 | fac.terceros.modeloImpresionDatosTerceros | enum [VERIFICAR opciones] | tenant (override convenio) | ninguno | M05 (con M06) |
| 2284 | VAR | FK `PROD_SER` | Concepto para cuotas de P/CTA y orden de A.M.A. | `clsFacturacionCuotasTerceros.Importar_CT1` (importación CT1) | Reemplazado | — | Concepto definido en cada convenio de cobro por cuenta y orden de terceros (`thirdPartyAgreements.conceptId`, M06); deja de ser una variable con nombre de un tercero puntual | — | — | — | M06 |
| 3007 | VAR | Texto | Definir formato de fecha (yy/MM/dd; vacío = ddMMyy) | `TORN_ALP.Exportar` (exportación de movimiento de conceptos a tercero) | Migrar | PRM-FAC-P2-041 | fac.terceros.exportacionTorn.formatoFecha | string (patrón de fecha) | tenant | ddMMyy | M05 (con T06) |
| 3039 | VAR | Entero | N.º de lote para el archivo FECESCOR (se incrementa con `Actu_V2`) | `GenerarArchivosRendicion_FECESCOR` | Reemplazado | — | Contador de secuencia transaccional por integración (`sequences`, T04) con unicidad por tenant; no es un parámetro editable | — | — | — | T04 / T06 |
| 3095 | VAR | Lógico | Incluir productos de subtipo comisión CVLP en movimiento de conceptos | sin lectura | Reemplazado | — | Filtro "subtipo de concepto" del reporte Movimiento de conceptos (T10), con vista guardada | — | — | — | T10 |

### 5.9 Prepaga (venta de crédito prepago con retención o bonificación según deuda)

En ProCoop la venta de prepaga (`clsPrepaga`) puede **retener** parte del importe vendido para cancelar deuda vencida, o **bonificar** a quien no tiene deuda, según umbrales de facturas, financiaciones y deuda total. Cada umbral es un trío "analiza / días desde el vencimiento / deuda mayor a" con un "ignorar valores anteriores".

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 393 | VAR | Mixto, Entero | Bloqueo de venta según deuda | `clsPrepaga.ValidarComprobante` | Migrar | PRM-FAC-P2-042 | fac.prepaga.bloqueoVentaPorDeuda.criterio | enum[sinBloqueo, bloquearConDeudaVencida] [VERIFICAR valores] | tenant (override servicio) | sinBloqueo | M05 (con M03) |
| 700 | VAR | Mixto, Lógico | Retención según deuda del titular (no de la cuenta) | `clsPrepaga.Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-043 | fac.prepaga.retencion.ambitoDeuda | enum[cuenta, titular] | tenant | cuenta | M05 |
| 701 | VAR | Mixto, Lógico | Retención según tipo de comprobante e importe de la deuda | `clsPrepaga.CalcularRecargo` | Migrar | PRM-FAC-P2-044 | fac.prepaga.retencion.segunTipoComprobanteEImporte | boolean | tenant | false | M05 |
| 702 | VAR | Mixto, Entero/Lógico | Comprobante a emitir para crédito por importe retenido | `clsPrepaga.GetCreditoPorRecargo` | Migrar | PRM-FAC-P2-045 | fac.prepaga.retencion.tipoComprobanteCreditoId | ref:invoiceTypes | tenant | — | M05 |
| 704 | VAR | Mixto, Lógico | Incluir créditos internos o nota de crédito al calcular retenciones | `clsPrepaga.Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-046 | fac.prepaga.retencion.netearCreditos | boolean | tenant | true | M05 |
| 705 | VAR | Mixto | Imprimir comprobante por retención | sin lectura | Migrar | PRM-FAC-P2-047 | fac.prepaga.retencion.imprimirComprobante | boolean | tenant | false | M05 |
| 711 | VAR | Mixto, Lógico | Procesar crédito contra deuda una vez que se ha generado | `clsRegistracionCobranza.RegistrarRetencionPrepaga` | Migrar | PRM-FAC-P2-048 | fac.prepaga.retencion.imputarCreditoAutomaticamente | boolean | tenant | true | M05 (con M07) |
| 712 | VAR | Mixto, Texto | Tipo de factura para procesar crédito cuando se genera | `RegistrarRetencionPrepaga` | Migrar | PRM-FAC-P2-049 | fac.prepaga.retencion.tiposFacturaImputables | list&lt;ref:invoiceTypes&gt; | tenant | [] (todas) | M05 (con M07) |
| 713 | VAR | Mixto, Lógico | Calcular y retener importe por intereses | `CalcularRecargo`; `CorrespondeRetener` | Migrar | PRM-FAC-P2-050 | fac.prepaga.retencion.incluirIntereses | boolean | tenant | false | M05 (con M08) |
| 1023 | VAR | Mixto, Lógico | Bonificación prepaga personalizada | `clsPrepaga.CorrespondeCalcularBonificacion` (lógica propia por cooperativa) | Reemplazado | — | Regla opcional por fórmula del motor de fórmulas (M04) asociada a la política de prepaga; sin código por cooperativa | — | — | — | M04 / M05 |
| 1024 | VAR | Mixto, Lógico | Retención prepaga personalizada | `clsPrepaga.CorrespondeCalcularRecargo` | Reemplazado | — | Ídem 1023, para la retención | — | — | — | M04 / M05 |
| 2210 | VAR | Mixto, Lógico | Indica si se debe practicar la retención a cuenta de deuda | `CalcularRecargo_Bonificacion`; `CorrespondeCalcularRecargo` | Migrar | PRM-FAC-P2-051 | fac.prepaga.retencion.habilitada | boolean | tenant (override servicio) | false | M05 |
| 2211 | VAR | Mixto, Lógico | Retención: analiza facturas | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-052 | fac.prepaga.retencion.facturas.analizar | boolean | tenant | true | M05 |
| 2212 | VAR | Mixto, Entero | Retención: días desde el vencimiento (facturas) | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-053 | fac.prepaga.retencion.facturas.diasDesdeVencimiento | integer (≥ 0) | tenant | 0 | M05 |
| 2213 | VAR | Mixto, Numérico | Retención: deuda por facturas vencidas mayor a | `CorrespondeRetener` | Migrar | PRM-FAC-P2-054 | fac.prepaga.retencion.facturas.umbralDeuda | money | tenant | 0 | M05 |
| 2214 | VAR | Mixto, Lógico | Retención: ignorar valores anteriores (facturas) | `CorrespondeRetener` | Migrar | PRM-FAC-P2-055 | fac.prepaga.retencion.facturas.ignorarUmbral | boolean | tenant | false | M05 |
| 2215 | VAR | Mixto, Lógico | Retención: analiza financiaciones | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-056 | fac.prepaga.retencion.financiaciones.analizar | boolean | tenant | false | M05 |
| 2216 | VAR | Mixto, Entero | Retención: días desde el vencimiento (financiaciones) | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-057 | fac.prepaga.retencion.financiaciones.diasDesdeVencimiento | integer (≥ 0) | tenant | 0 | M05 |
| 2217 | VAR | Mixto, Numérico | Retención: deuda por financiaciones vencidas mayor a | `CorrespondeRetener` | Migrar | PRM-FAC-P2-058 | fac.prepaga.retencion.financiaciones.umbralDeuda | money | tenant | 0 | M05 |
| 2218 | VAR | Mixto, Lógico | Retención: ignorar valores anteriores (financiaciones) | `CorrespondeRetener` | Migrar | PRM-FAC-P2-059 | fac.prepaga.retencion.financiaciones.ignorarUmbral | boolean | tenant | false | M05 |
| 2219 | VAR | Mixto, Numérico | Retención: deuda total mayor a | `CorrespondeRetener` | Migrar | PRM-FAC-P2-060 | fac.prepaga.retencion.umbralDeudaTotal | money | tenant | 0 | M05 |
| 2220 | VAR | Mixto, Lógico | Retención: ignorar deuda total | `CorrespondeRetener` | Migrar | PRM-FAC-P2-061 | fac.prepaga.retencion.ignorarDeudaTotal | boolean | tenant | false | M05 |
| 2221 | VAR | Mixto, Numérico | Retener un importe fijo | `CalcularRecargo` | Migrar | PRM-FAC-P2-062 | fac.prepaga.retencion.importeFijo | money | tenant | 0 | M05 |
| 2222 | VAR | Mixto, Numérico | Retener un porcentaje de la venta | `CalcularRecargo` | Migrar | PRM-FAC-P2-063 | fac.prepaga.retencion.porcentajeVenta | decimal (0–100) | tenant | 0 | M05 |
| 2223 | VAR | Mixto, Entero | Retención: concepto en la factura generada | `AgregarRecargo_Bonificacion` | Migrar | PRM-FAC-P2-064 | fac.prepaga.retencion.conceptoFacturaId | ref:products | tenant | — (obligatorio si retención habilitada) | M05 |
| 2224 | VAR | Mixto, Entero | Retención: concepto en la nota de crédito | `GetCreditoPorRecargo`; `GetDebitoPorRecargo` | Migrar | PRM-FAC-P2-065 | fac.prepaga.retencion.conceptoNotaCreditoId | ref:products | tenant | — | M05 |
| 2225 | VAR | Mixto, Lógico | Indica si se debe bonificar a titulares sin deuda | `CalcularRecargo_Bonificacion`; `CorrespondeCalcularBonificacion` | Migrar | PRM-FAC-P2-066 | fac.prepaga.bonificacion.habilitada | boolean | tenant (override servicio) | false | M05 |
| 2226 | VAR | Mixto, Lógico | Bonificación: analiza facturas | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-067 | fac.prepaga.bonificacion.facturas.analizar | boolean | tenant | true | M05 |
| 2227 | VAR | Mixto, Entero | Bonificación: días desde el vencimiento (facturas) | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-068 | fac.prepaga.bonificacion.facturas.diasDesdeVencimiento | integer (≥ 0) | tenant | 0 | M05 |
| 2228 | VAR | Mixto, Numérico | Bonificación: deuda por facturas vencidas mayor a | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-069 | fac.prepaga.bonificacion.facturas.umbralDeuda | money | tenant | 0 | M05 |
| 2229 | VAR | Mixto, Lógico | Bonificación: ignorar valores anteriores (facturas) | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-070 | fac.prepaga.bonificacion.facturas.ignorarUmbral | boolean | tenant | false | M05 |
| 2230 | VAR | Mixto, Lógico | Bonificación: analiza financiaciones | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-071 | fac.prepaga.bonificacion.financiaciones.analizar | boolean | tenant | false | M05 |
| 2231 | VAR | Mixto, Entero | Bonificación: días desde el vencimiento (financiaciones) | `Get_DeudaAnalizar` | Migrar | PRM-FAC-P2-072 | fac.prepaga.bonificacion.financiaciones.diasDesdeVencimiento | integer (≥ 0) | tenant | 0 | M05 |
| 2232 | VAR | Mixto, Numérico | Bonificación: deuda por financiaciones vencidas mayor a | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-073 | fac.prepaga.bonificacion.financiaciones.umbralDeuda | money | tenant | 0 | M05 |
| 2233 | VAR | Mixto, Lógico | Bonificación: ignorar valores anteriores (financiaciones) | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-074 | fac.prepaga.bonificacion.financiaciones.ignorarUmbral | boolean | tenant | false | M05 |
| 2234 | VAR | Mixto, Numérico | Bonificación: deuda total mayor a | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-075 | fac.prepaga.bonificacion.umbralDeudaTotal | money | tenant | 0 | M05 |
| 2235 | VAR | Mixto, Lógico | Bonificación: ignorar deuda total | `CorrespondeBonificar` | Migrar | PRM-FAC-P2-076 | fac.prepaga.bonificacion.ignorarDeudaTotal | boolean | tenant | false | M05 |
| 2236 | VAR | Mixto, Numérico | Bonificar un importe fijo | `CalcularBonificaciones` | Migrar | PRM-FAC-P2-077 | fac.prepaga.bonificacion.importeFijo | money | tenant | 0 | M05 |
| 2237 | VAR | Mixto, Numérico | Bonificar un porcentaje de la venta | `CalcularBonificaciones` | Migrar | PRM-FAC-P2-078 | fac.prepaga.bonificacion.porcentajeVenta | decimal (0–100) | tenant | 0 | M05 |
| 2238 | VAR | Mixto, Entero | Id del producto a utilizar para la bonificación que se incluye en la factura | `AgregarRecargo_Bonificacion`; `GetDebitoPorRecargo` | Migrar | PRM-FAC-P2-079 | fac.prepaga.bonificacion.conceptoId | ref:products | tenant | — (obligatorio si bonificación habilitada) | M05 |
| 2239 | VAR | Mixto, Lógico | Bonifica cuando no retiene | `CalcularBonificaciones`; `CorrespondeCalcularBonificacion` | Migrar | PRM-FAC-P2-080 | fac.prepaga.bonificacion.soloSiNoRetiene | boolean | tenant | true | M05 |
| 2243 | VAR | Mixto, FK `TIPO_FAC` | Tipo de comprobante para facturar prepaga | `clsCobranzaCaja.Get_TicketPago`; `clsPrepaga.GetFactura`, `Get_CreditosPendientes`; simulador de fórmulas | Migrar | PRM-FAC-P2-081 | fac.prepaga.tipoComprobanteId | ref:invoiceTypes | tenant (override servicio) | — (obligatorio si hay servicio prepago) | M05 (con M03) |
| 2244 | VAR | Mixto, Lógico/Numérico | Importe mínimo de venta | `ValidarComprobante`; `ValidarImporteMinimoVenta` | Migrar | PRM-FAC-P2-082 | fac.prepaga.importeMinimoVenta | money (nullable) | tenant (override servicio) | null | M05 |
| 2245 | VAR | Mixto, Lógico/Numérico | Importe mínimo en caso de NO retención | `ValidarComprobante` | Migrar | PRM-FAC-P2-083 | fac.prepaga.importeMinimoSinRetencion | money (nullable) | tenant | null | M05 |
| 2313 | VAR | Mixto, Entero | Tipo de deuda a considerar para no vender (0 = deuda de la cuenta, 1 = del titular) | `clsPrepaga.ValidarComprobante` | Migrar | PRM-FAC-P2-084 | fac.prepaga.bloqueoVentaPorDeuda.ambitoDeuda | enum[cuenta, titular] | tenant | cuenta | M05 |
| 2413 | VAR | Mixto, Lógico | Generar retención/bonificación en otra factura | `RegistraVentaPrepaga`; `clsFacturacionMasiva.ObtenerFacturas` (recargo en ND separada) | Migrar | PRM-FAC-P2-085 | fac.prepaga.recargoBonificacionEnComprobanteSeparado | boolean | tenant | false | M05 |
| 2414 | VAR | Mixto, FK `TIPO_FAC` | Tipo de comprobante para facturas de retenciones | `GetCreditoPorRecargo`; `GetDebitoPorRecargo` | Migrar | PRM-FAC-P2-086 | fac.prepaga.retencion.tipoComprobanteFacturaId | ref:invoiceTypes | tenant | — | M05 |
| 2415 | VAR | Mixto, FK `TIPO_FAC` | Comprobante a emitir para débito por importe retenido | `GetDebitoPorRecargo` | Migrar | PRM-FAC-P2-087 | fac.prepaga.retencion.tipoComprobanteDebitoId | ref:invoiceTypes | tenant | — | M05 |
| 2496 | VAR | Lógico | Autorizar ventas de prepaga automáticamente | `clsWeb_CoopOnline.RegistrarFacturasAuto`, `AutorizarPendientes` (Agente) | Migrar | PRM-FAC-P2-088 | fac.prepaga.autorizarVentasOnlineAutomaticamente | boolean | tenant | true | M05 (con M19, M06) |
| 2518 | VAR | Lógico | No permitir modificar categoría en venta de prepaga | sin lectura | Reemplazado | — | Capability `fac.prepaga.cambiarCategoria` (por defecto no asignada a cajeros) | — | — | — | M05 / T02 |
| 2656 | VAR | Lógico | Volver a abrir formulario al realizar una venta de prepaga en efectivo | sin lectura | Descartar | — | — (comportamiento de ventana WinForms; la PWA/admin vuelve al formulario vacío por diseño) | — | — | — | — |

### 5.10 Ventas de productos, cuotas, stock, presupuestos y app móvil (PMovil → PWA)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 22 | PM/PMovil | Lógico | Imprimir comprobante al realizar una venta | sin lectura (app PMovil) | Migrar | PRM-VEN-P2-004 | ven.pwa.imprimirComprobanteAlVender | boolean | tenant | true | M11 |
| 23 | PM/PMovil | Texto | Texto a mostrar en el comprobante impreso de venta | sin lectura (app PMovil) | Diccionario | — | `dict:ven.pwa.comprobante.leyendaPie` con override por tenant | — | — | — | T03 |
| 24-PM | PM/PMovil | FK `SOCIOS` | Configurar titular para realizar ventas rápidas | sin lectura (app PMovil) | Migrar | PRM-VEN-P2-005 | ven.ventaRapida.titularPorDefectoId | ref:persons (titular "consumidor final" del tenant) | tenant | — | M11 |
| 25 | PM/PMovil | Lógico | Los presupuestos de PMovil son a granel | sin lectura | Migrar | PRM-VEN-P2-006 | ven.presupuestos.granel.habilitado | boolean | tenant | false | M11 |
| 26 | PM/PMovil | Numérico | Coeficiente multiplicador para los presupuestos a granel | sin lectura | Migrar | PRM-VEN-P2-007 | ven.presupuestos.granel.coeficiente | decimal (> 0) | tenant | 1 | M11 |
| 52 | PM/PMovil | Lógico | Subir factura a CoopOnline Web al registrar ventas | `clsPMovil_Venta.Sincronizar_Venta` | Reemplazado | — | Base única (DEC-002): el portal ve el comprobante al emitirse; evento `fac.invoice.issued` | — | — | — | M19 |
| 65 | VAR | FK `TIPO_FAC` | Tipo de cuota por defecto en venta | `clsRegistracionCobranza.NuevaFactura`; `clsTecnica.Validar_ConceptosCobrar_Confirmacion`; `clsProcoop_Integra_Tecnica` | Migrar | PRM-VEN-P2-008 | ven.ventas.tipoComprobantePorDefectoId | ref:invoiceTypes | tenant | — | M11 (con M07, M10) |
| 66 | PM/PMovil | Lógico | Imprimir comprobante duplicado al realizar una venta | sin lectura | Migrar | PRM-VEN-P2-009 | ven.pwa.imprimirDuplicado | boolean | tenant | false | M11 |
| 77 | VAR | Lógico | Mover stock al registrar venta | `clsComprobanteVenta.GetCompVen`; `ItemsComprobante.ValidarStock` (RN-01 §23.3) | Migrar | PRM-VEN-P2-010 | ven.stock.moverAlRegistrarVenta | boolean | tenant | true | M11 (con M13) |
| 154 | VAR | Mixto | No imprimir recibo de la venta | sin lectura | Migrar | PRM-VEN-P2-011 | ven.ventas.imprimirReciboAlRegistrar | boolean (semántica invertida respecto de ProCoop) | tenant | true | M11 |
| 155 | VAR | Mixto | No imprimir factura de la venta | sin lectura | Migrar | PRM-VEN-P2-012 | ven.ventas.imprimirFacturaAlRegistrar | boolean (invertida) | tenant | true | M11 |
| 208 | VAR | Lógico | No permitir ventas con stock 0 o negativo | `ItemsComprobante.ValidarStock` (error en lugar de confirmación) | Migrar | PRM-VEN-P2-013 | ven.stock.impedirSinStock | boolean | tenant | false | M11 (con M13) |
| 322 | VAR | Lista | Tipo de pago preferido | sin lectura | Migrar | PRM-VEN-P2-014 | ven.ventas.formaPagoPreferida | enum[contado, cuentaCorriente, cuotas] [VERIFICAR opciones] | tenant | contado | M11 |
| 354 | VAR | Lógico | No permitir ventas con stock 0 o negativo por depósito | `ItemsComprobante.ValidarStock` | Migrar | PRM-VEN-P2-015 | ven.stock.validarPorDeposito | boolean | tenant | false | M11 (con M13) |
| 389 | VAR | Lógico | Permitir ventas de contado con vencimiento diferido | sin lectura | Migrar | PRM-VEN-P2-016 | ven.ventas.contadoConVencimientoDiferido | boolean | tenant | false | M11 |
| 403 | VAR | FK `PROD_SER` | Concepto para factura en cuotas (crédito automático; ventas con ese concepto se marcan exentas o se excluyen del detalle de ventas) | `CargarCreditoPago`; `GetCompVenFacturaCuotas`; `Get_Detalle_Ventas` | Migrar | PRM-VEN-P2-017 | ven.cuotas.conceptoFacturaEnCuotasId | ref:products | tenant | — (respaldo: PRM-COB-P2-001) | M11 |
| 411 | VAR | Lógico | No permitir modificar precio de venta | sin lectura | Reemplazado | — | Capability `ven.ventas.modificarPrecio`; cambio de precio auditado | — | — | — | M11 / T02 |
| 731 | VAR | Numérico | Porcentaje a aplicar en cálculo de riesgo crediticio | sin lectura | Migrar | PRM-VEN-P2-018 | ven.riesgoCrediticio.porcentaje | decimal (0–100) | tenant | 0 | M11 |
| 732 | VAR | Lista | Acción si no cumple los requisitos de riesgo crediticio en venta de productos: Ignorar / Alertar / Impedir / Solicitar autorización | sin lectura | Migrar | PRM-VEN-P2-019 | ven.riesgoCrediticio.accion | enum[ignorar, alertar, impedir, solicitarAutorizacion] | tenant | ignorar | M11 (con T11) |
| 733 | VAR | FK `TIPO_FAC` | Tipo de comprobante para factura en cuotas con intereses | `clsComprobanteVenta.Guardar` | Migrar | PRM-VEN-P2-020 | ven.cuotas.tipoComprobanteConInteresId | ref:invoiceTypes | tenant | — | M11 |
| 738 | VAR | Numérico | Porcentaje de descuento en venta de productos cuando la forma de pago es contado | sin lectura | Migrar | PRM-VEN-P2-021 | ven.ventas.descuentoContadoPorcentaje | decimal (0–100) | tenant | 0 | M11 |
| 1007 | VAR | Entero | Cuenta por defecto en venta rápida de productos | sin lectura | Migrar | PRM-VEN-P2-022 | ven.ventaRapida.cuentaPorDefectoId | ref:accounts | tenant | — | M11 |
| 1008 | VAR | FK `VENDEDOR` | Vendedor por defecto en CVEN rápida | `CrearAnticipo`; `clsGestionMora.Guardar_Notificaciones`, `Guardar_Comprobante`; `clsComprobanteFactura` (+8 lecturas) | Migrar | PRM-VEN-P2-023 | ven.vendedores.vendedorPorDefectoId | ref:sellers | tenant (override puntoVenta/usuario) | — | M11 (con M07, M08) |
| 1010 | VAR | Lógico | Registra precio con IVA en ventas | sin lectura | Migrar | PRM-VEN-P2-024 | ven.ventas.preciosIncluyenIva | boolean | tenant | false | M11 |
| 2068 | VAR | Lógico | No permitir ventas si el stock disponible se encuentra pendiente de entrega | `ItemsComprobante.ValidarStock` (stock reservado) | Migrar | PRM-VEN-P2-025 | ven.stock.excluirStockReservado | boolean | tenant | false | M11 (con M13) |
| 2089 | VAR | FK `PROD_SER` | Concepto para interés de comprobante de venta | `clsCaidaCuotas`; `clsComprobanteVenta.Guardar`; `clsModificacionCuotas.RegistrarCambios`; obligatorio en `clsFacturacionMasiva` | Migrar | PRM-VEN-P2-026 | ven.cuotas.conceptoInteresId | ref:products | tenant | — (obligatorio para facturar) | M11 (con M05) |
| 2246 | VAR | Lógico | Mostrar importe de los ítems en reporte de comprobante de venta | `clsComprobanteVenta.CargarComprobante` | Migrar | PRM-VEN-P2-027 | ven.impresion.mostrarImportesItems | boolean | tenant | true | M11 |
| 2247 | VAR | FK `PROD_SER` | Concepto para descuento en comprobante de venta en facturas contado o en 1 cuota | `clsComprobanteVenta.Validar`; obligatorio en `clsFacturacionMasiva` | Migrar | PRM-VEN-P2-028 | ven.ventas.conceptoDescuentoContadoId | ref:products | tenant | — (obligatorio para facturar) | M11 |
| 2272 | VAR | Lógico | Imprimir liquidación de crédito desde comprobante de venta | sin lectura | Migrar | PRM-VEN-P2-029 | ven.impresion.liquidacionCreditoAlGuardar | boolean | tenant | false | M11 |
| 2273 | VAR | Lógico | Imprimir factura desde comprobante de venta | sin lectura | Migrar | PRM-VEN-P2-030 | ven.impresion.facturaAlGuardar | boolean | tenant | true | M11 |
| 2289 | VAR | FK `PROD_SER` | Producto para diferencia de cotización en venta de productos | `GetCompVen`; `GetCompVenRapido`; `ItemsComprobanteCollection.AddRange` (RN-01 §23.4) | Migrar | PRM-VEN-P2-031 | ven.cuotas.conceptoDiferenciaCotizacionId | ref:products (nullable) | tenant | null | M11 |
| 2311 | VAR | Lógico | Permitir indicar fecha de vencimiento en ventas a próxima facturación | sin lectura | Migrar | PRM-VEN-P2-032 | ven.ventas.permitirVencimientoEnProximaFacturacion | boolean | tenant | false | M11 (con M05) |
| 2348 | VAR | Lista | Método de facturación de presupuestos de factibilidad: Factura manual / Venta de materiales | sin lectura | Migrar | PRM-VEN-P2-033 | ven.presupuestos.factibilidad.metodoFacturacion | enum[facturaManual, ventaMateriales] | tenant | facturaManual | M11 (con M10) |
| 2380 | VAR | Lógico | Enviar presupuesto a la aplicación de PMovil | `clsPMovil_Venta.SincronizaPresupuestos` | Reemplazado | — | La PWA de empleado consulta los presupuestos en línea y los cachea offline (cola IndexedDB); no hay envío | — | — | — | M11 |
| 2381 | VAR | Lógico | Validar deuda y vencimiento en presupuestos | sin lectura | Migrar | PRM-VEN-P2-034 | ven.presupuestos.validarDeudaYVencimiento | boolean | tenant | false | M11 |
| 2386 | VAR | Lógico | Sincronizar ventas y presupuestos de PMovil automáticamente | `clsPMovil_Venta.SincronizarPmovilVentas` | Reemplazado | — | Sincronización automática de la cola offline con `clientMutationId` (idempotente) | — | — | — | M11 |
| 2395 | VAR | Lógico | Validar servicios activos al realizar presupuesto | sin lectura | Migrar | PRM-VEN-P2-035 | ven.presupuestos.validarServiciosActivos | boolean | tenant | false | M11 |
| 2512 | VAR | Entero | Grupo de facturación para ítems por diferencia de cotización (masiva; requiere 2289) | `ItemsComprobanteCollection.AddRange` | Migrar | PRM-VEN-P2-036 | ven.cuotas.grupoFacturacionDiferenciaCotizacionId | ref:billingGroups (obligatorio si PRM-VEN-P2-031 no es null) | tenant | — | M11 (con M05) |
| 2519 | VAR | Lógico | No validar grupos de facturación en venta de productos | sin lectura | Migrar | PRM-VEN-P2-037 | ven.ventas.validarGruposFacturacion | boolean (invertida) | tenant | true | M11 |
| 2537 | VAR | Lógico | Imprimir copias según configuración del comprobante en remitos | sin lectura | Migrar | PRM-VEN-P2-038 | ven.remitos.copiasSegunTipoComprobante | boolean | tenant | false | M11 |
| 2589 | VAR | Texto | Ruta para guardar PDF de facturas contado de PMovil | `clsPMovil_Venta.Sincronizar_Venta` | Reemplazado | — | Almacenamiento de objetos privado con URL firmadas (DEC-001) | — | — | — | T01 / M05 |
| 2600 | VAR | Lista | Vencimiento a considerar para validar presupuestos: Vto1 / Vto2 / Vto3 / Vto4 | sin lectura | Migrar | PRM-VEN-P2-039 | ven.presupuestos.vencimientoReferencia | enum[vto1, vto2, vto3, vto4] | tenant | vto1 | M11 |
| 2601 | VAR | Lógico | Imprimir automáticamente las facturas generadas en venta por carga rápida | sin lectura | Migrar | PRM-VEN-P2-040 | ven.ventaRapida.imprimirAlEmitir | boolean | tenant | false | M11 |
| 2624 | VAR | FK `PROD_SER` | Concepto para bonificación de intereses por financiación en adelanto de cuotas (ventas); sin configurar no bonifica | `ItemsComprobanteCollection.AddRange` | Migrar | PRM-VEN-P2-041 | ven.cuotas.conceptoBonificacionAdelantoCuotasId | ref:products (nullable) | tenant | null | M11 |
| 2644 | VAR | Lógico | Permitir que el precio unitario del producto sea 0 | sin lectura | Migrar | PRM-VEN-P2-042 | ven.ventas.permitirPrecioUnitarioCero | boolean | tenant | false | M11 |
| 2678 | VAR | Lógico | Impedir modificar el tipo de cuota en venta rápida | sin lectura | Reemplazado | — | Capability `ven.ventaRapida.cambiarTipoComprobante` | — | — | — | M11 / T02 |
| 2679 | VAR | Lógico | No permitir ventas en cuenta corriente (solo contado) a cuentas sin servicios conectados que no estén marcadas como clientes de productos | sin lectura | Migrar | PRM-VEN-P2-043 | ven.ventas.cuentaCorrienteSoloConServicioConectado | boolean | tenant | false | M11 (con M01) |
| 2680 | VAR | Lógico | No permitir ventas rápidas a cuentas con deuda vencida | sin lectura | Migrar | PRM-VEN-P2-044 | ven.ventaRapida.bloquearConDeudaVencida | boolean | tenant | false | M11 |
| 2681 | VAR | Lógico | No tomar el tipo de cuota por defecto en ventas que no sean rápidas | sin lectura | Migrar | PRM-VEN-P2-045 | ven.ventas.tipoPorDefectoSoloEnVentaRapida | boolean | tenant | false | M11 |
| 2708 | VAR | FK `PROD_SER` | Producto relacionado con servicio de telefonía prepaga (al venderlo se genera una orden de trabajo) | sin lectura | Migrar-servicio | PRM-CAT-P2-001 | cat.producto.generaOrdenTrabajo | boolean (+ `workOrderTypeId`) | producto | false | M02 (con M10) |
| 2788 | VAR | Entero | Días que será válido el presupuesto | sin lectura | Migrar | PRM-VEN-P2-046 | ven.presupuestos.diasValidez | integer (≥ 1) | tenant | 30 | M11 |
| 2871 | VAR | Lógico | Permitir ventas rápidas de contado a titulares con deuda vencida | sin lectura | Migrar | PRM-VEN-P2-047 | ven.ventaRapida.permitirContadoConDeudaVencida | boolean | tenant | true | M11 |
| 2901 | VAR | Entero | Código de propiedad personalizada para no cargar presupuestos | sin lectura | Migrar | PRM-VEN-P2-048 | ven.presupuestos.atributoBloqueoId | ref:customAttributes (nullable) | tenant | null | M11 (con M01) |
| 2914 | VAR | Lógico | Validar si el presupuesto tiene obra asignada | `clsPresupuesto.Aprobar` | Migrar | PRM-VEN-P2-049 | ven.presupuestos.exigirObraAlAprobar | boolean | tenant | false | M11 (con M10) |
| 2915 | VAR | Lógico | Registra precio con IVA en presupuesto | sin lectura | Migrar | PRM-VEN-P2-050 | ven.presupuestos.preciosIncluyenIva | boolean | tenant | false | M11 |
| 2930 | VAR | Lógico | Generar crédito fiscal en factura en cuotas | `clsComprobanteVenta.CargarCreditoPago` | Migrar | PRM-VEN-P2-051 | ven.cuotas.generarCreditoFiscal | boolean | tenant | false [VERIFICAR] | M11 (con M06) |
| 2949 | VAR | Lógico | Emitir presupuestos por conjuntos | sin lectura | Migrar | PRM-VEN-P2-052 | ven.presupuestos.porConjuntos | boolean | tenant | false | M11 |
| 2953 | VAR | FK `PROD_SER` | Producto correspondiente al flete de presupuestos | `clsComprobanteRendicion.GetDatosInformeRendicion`; `clsPresupuesto.Modificar`, `GetDatosInformePresupuesto` | Migrar | PRM-VEN-P2-053 | ven.presupuestos.conceptoFleteId | ref:products (nullable) | tenant | null | M11 |
| 2973 | VAR | Lógico | Permite seleccionar servicios inactivos al relacionar servicio con cuotas | sin lectura | Migrar | PRM-VEN-P2-054 | ven.cuotas.permitirServiciosInactivos | boolean | tenant | false | M11 |
| 3004 | VAR | Lógico | Autocompletar nombre al cargar nuevo conjunto de un presupuesto | sin lectura | Descartar | — | — (ayuda de tipeo de pantalla; el formulario nuevo propone el nombre siempre) | — | — | — | — |
| 3010 | VAR | Lógico | Permitir cambiar el cliente en un presupuesto antes de aprobarlo | `clsPresupuesto.ActualizarPRESUPU` | Migrar | PRM-VEN-P2-055 | ven.presupuestos.permitirCambiarClienteAntesDeAprobar | boolean | tenant | false | M11 |
| 3026 | VAR | Lógico | Permitir ingresar datos del transporte en venta de productos | sin lectura | Migrar | PRM-VEN-P2-056 | ven.ventas.datosTransporte.habilitado | boolean | tenant | false | M11 |
| 3032 | VAR | FK `PROD_SER` | Producto correspondiente al molde de presupuestos | `clsPresupuesto.Modificar` | Migrar | PRM-VEN-P2-057 | ven.presupuestos.conceptoMoldeId | ref:products (nullable) | tenant | null | M11 |
| 3037 | VAR | Lógico | Imprime presupuesto simple por defecto al registrar un nuevo presupuesto | sin lectura | Migrar | PRM-VEN-P2-058 | ven.presupuestos.formatoImpresionPorDefecto | enum[simple, detallado] | tenant | detallado | M11 |
| 3049 | VAR | Lógico | Validar que no se repita la matrícula del producto | `clsProdSer.clonarProdSer`; `abm_prod_ser` | Migrar | PRM-CAT-P2-002 | cat.productos.matriculaUnica | boolean (índice único parcial por tenant) | tenant | true | M02 |
| 3053 | VAR | Lógico | Saltar validación de vendedor por defecto en CVEN rápida | sin lectura | Migrar | PRM-VEN-P2-059 | ven.ventaRapida.exigirVendedor | boolean (invertida) | tenant | true | M11 |
| 3060 | VAR | Lógico | Imprimir remito al generarlo | sin lectura | Migrar | PRM-VEN-P2-060 | ven.remitos.imprimirAlGenerar | boolean | tenant | false | M11 |

### 5.11 Anticipos, caja y medios de pago

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 29 | VAR | FK `PROD_SER` | Concepto para anticipo (respaldo de la 403) | `clsEntidadesRecaudadoras.CrearAnticipo`; `GenerarCreditoPorAnticipo`; `clsComprobanteVenta.CargarCreditoPago` (+2) | Migrar | PRM-COB-P2-001 | cob.anticipos.conceptoPorDefectoId | ref:products | tenant | — (obligatorio) | M07 |
| 185 | VAR | Lógico | Descontar anticipo en próxima factura | sin lectura | Migrar | PRM-COB-P2-002 | cob.anticipos.descontarEnProximaFactura | boolean | tenant | true | M07 (con M05) |
| 325 | VAR | Lógico | Permite modificar concepto para anticipo | sin lectura | Reemplazado | — | Capability `cob.anticipos.cambiarConcepto` | — | — | — | M07 / T02 |
| 400 | VAR | Lógico | Obligar a seleccionar concepto para anticipos manualmente | sin lectura | Migrar | PRM-COB-P2-003 | cob.anticipos.exigirSeleccionManualConcepto | boolean | tenant | false | M07 |
| 2263 | VAR | Lógico | Permite generar facturas en cuotas (desde caja) | `PropiedadesCaja.Cargar_CobranzaLocal`; `Validar_CobranzaLocal_CuotasPendientes`; `InfoCobranza.Cargar` | Migrar | PRM-COB-P2-004 | cob.caja.permitirFacturaEnCuotas | boolean | tenant (override caja) | false | M07 (con M11) |
| 2360 | VAR | Lógico | Permitir eliminar talones sumados | `PropiedadesCaja.Cargar_CobranzaLocal` | Reemplazado | — | Capability `cob.talonesSumados.anular` (se anula, no se elimina; queda auditado) | — | — | — | M07 / T02 |
| 2409 | VAR | FK `TIPO_FAC` | Tipo de cuota para anticipo de productos | `EntidadDigital.Crear_Anticipo_Rever`, `CrearAnticipo`; `clsTesoreria.CrearAnticipoRechazoCupones` | Migrar | PRM-COB-P2-005 | cob.anticipos.productos.tipoComprobanteId | ref:invoiceTypes | tenant | — | M07 (con M14) |
| 2410 | VAR | FK `PROD_SER` | Concepto a facturar por anticipo de productos | `EntidadDigital.CrearAnticipo` | Migrar | PRM-COB-P2-006 | cob.anticipos.productos.conceptoId | ref:products | tenant | — | M07 |
| 2704 | VAR | Lista | Medio de pago utilizado para generar links de pago en impresión masiva de facturas: Pagos360 / MercadoPago | sin lectura | Migrar | PRM-COB-P2-007 | cob.linkPago.pasarelaPorDefecto | enum[pagos360, mercadoPago] (extensible a pasarelas habilitadas del tenant) | tenant | pagos360 | M07 |
| 2764 | VAR | Texto | Mail por defecto para generar QR de Pagos360 | `clsPagos360.Crear_PAGOS360`, `Get_QR_Data`, `Get_QR_Caja` | Migrar | PRM-COB-P2-008 | cob.pagos360.emailPorDefectoQr | string (email; dato operativo, no secreto) | tenant | email de cobranzas del tenant | M07 (con T06) |
| 3008 | VAR | Lógico | Permitir indicar si los anticipos por productos se descuentan de facturación futura | sin lectura | Migrar | PRM-COB-P2-009 | cob.anticipos.productos.permitirElegirDescuentoFuturo | boolean | tenant | false | M07 (con M05) |

### 5.12 Portal del socio y consulta web (CoopOnline → M19)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 37 | PM/CoopOnline | Lógico | Controlar deuda vencida de la cuenta en la web | sin lectura (CoopOnline) | Migrar | PRM-POR-P2-001 | por.deuda.controlarDeudaVencida | boolean | tenant | false | M19 |
| 39 | PM/CoopOnline | Lógico | Solo subir facturación diaria (no masiva), posterior a la fecha de la variable 20 | `clsWEB.AgregarFiltrosFacturas` | Reemplazado | — | No hay subida a una base web: el portal lee los comprobantes de la base única; visibilidad por origen en PRM-POR-P2-005 | — | — | — | M19 |
| 45 | PM/CoopOnline | Lógico | Habilitar carro de facturas en la web | sin lectura | Migrar | PRM-POR-P2-002 | por.pagos.carritoFacturas | boolean | tenant | true | M19 (con M07) |
| 60 | PM/CoopOnline | Lógico | Mostrar todos los comprobantes en la página de facturas sin login | sin lectura | Migrar | PRM-POR-P2-003 | por.consultaPublica.mostrarTodosLosComprobantes | boolean (false = solo impagos) | tenant | false | M19 |
| 61 | PM/CoopOnline | Lógico | Habilitar el ingreso a la página de facturas sin login desde la web | sin lectura | Migrar | PRM-POR-P2-004 | por.consultaPublica.habilitada | boolean | tenant | true | M19 (BASE §53) |
| 2261 | VAR | Mixto, Lógico | WEB: solo facturación mensual | `Parametros.Parametros` (clsWEB) | Migrar | PRM-POR-P2-005 | por.facturas.origenesVisibles | list&lt;enum[masiva, diaria]&gt; | tenant | [masiva, diaria] | M19 |
| 2265 | VAR | Mixto, Entero | WEB: delay | `clsWEB.GenerarPDF` | Descartar | — | — (espera técnica de la generación de PDF para la base web externa) | — | — | — | — |
| 2405 | VAR | Mixto | WEB: borrar datos hasta una fecha específica | sin lectura | Descartar | — | — (purga de la base web externa; la retención de datos se rige por T08) | — | — | — | — |
| 2448 | VAR | Mixto, Lógico | WEB: incluir cuotas de financiación | `Parametros.Parametros` (clsWEB) | Migrar | PRM-POR-P2-006 | por.deuda.incluirCuotasFinanciacion | boolean | tenant | true | M19 (con M08) |

### 5.13 Otros (técnica, atención, institucional, agente, textos)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 317 | VAR | Lógico | Exigir catastro en factibilidad técnica | sin lectura | Migrar | PRM-TEC-P2-001 | tec.factibilidad.exigirCatastro | boolean | tenant (override servicio) | false | M10 |
| 2287 | VAR | Texto | Backup: path carpeta comprimidos | `clsServicio_Procoop.ChequearBackup` | Plataforma | — | — (backups gestionados por la plataforma, T01; no es configurable por tenant) | — | — | — | T01 |
| 2318 | VAR | Texto | Texto a mostrar por "Conceptos desconocidos" (por defecto "CONCEPTO DESCONOCIDO") | `clsMovimientoConceptos.InfoFactura` | Diccionario | — | `dict:fac.concepto.desconocido` | — | — | — | T03 |
| 2398 | VAR | Lógico | Alertar en atención a usuarios el presupuesto pendiente | sin lectura | Migrar | PRM-CRM-P2-001 | crm.atencion.alertarPresupuestoPendiente | boolean | tenant | true | M09 (con M11) |
| 2648 | VAR | Texto | Nombre de servidor que puede abrir el agente | `Program.Main` (modo 11) | Reemplazado | — | Workers BullMQ en contenedores con supervisión de la plataforma (T01) | — | — | — | T01 |
| 2650 | VAR | Lógico | Hacer visible el check de excluir financiaciones en movimiento de conceptos | sin lectura | Descartar | — | — (visibilidad de control; el filtro está siempre disponible en el reporte, T10) | — | — | — | — |
| 2736 | VAR | Lógico | Realizar registro de capital de forma manual | `clsFacturacionMasiva.GenerarFacturacion` (desactiva capitalización automática al cerrar la masiva) | Migrar | PRM-INS-P2-001 | ins.capital.registroManual | boolean | tenant | false | M17 (con M05) |
| 2856 | VAR | Entero | Registrar capital: hora en la cual registrarlo | `clsServicio_Procoop.AgregarTareasDinamicas` | Migrar | PRM-INS-P2-002 | ins.capital.horaRegistroAutomatico | time (zona horaria del tenant) | tenant | 03:00 | M17 (job `ins:registrar-capital`) |
| 2916 | VAR | Lógico | Integrar capital en el pago | `clsCierreDiario.GenerarAsientoCapital` | Migrar | PRM-INS-P2-003 | ins.capital.integrarAlCobrar | boolean | tenant | false | M17 (con M07, M15) |
| 3009 | VAR | Lógico | Validar conexión de servicio y cerrar si tiene deuda | sin lectura | Migrar | PRM-TEC-P2-002 | tec.conexion.validarDeudaAntesDeCerrar | boolean | tenant | false [VERIFICAR] | M10 (con M08) |
| 3087 | VAR | Lógico | Notificar a responsables al enviar OT al captor | sin lectura | Migrar | PRM-TEC-P2-003 | tec.ot.notificarResponsablesAlDespachar | boolean | tenant | false | M10 (con T09) |

## 6. Resumen

### 6.1 Conteo por decisión

| Decisión | Filas |
|---|---:|
| Migrar | 213 |
| Migrar-servicio | 33 |
| Reemplazado | 45 |
| Plataforma | 11 |
| Descartar | 6 |
| Diccionario | 2 |
| Bóveda | 2 |
| Marca | 1 |
| **Total** | **313** |

Se crean **256 PRM** (213 Migrar + 33 Migrar-servicio + 10 Plataforma parametrizables; el 2287 es Plataforma sin parámetro).

### 6.2 Conteo por anexo destino principal (primer anexo de la columna)

| Anexo | Filas | PRM creados (prefijo) |
|---|---:|---|
| M05 FAC | 99 | 88 (`PRM-FAC-P2-001…088`) |
| M11 VEN | 67 | 60 (`PRM-VEN-P2-001…060`) |
| M04 TAR | 41 | 36 (`PRM-TAR-P2-001…036`) |
| M06 FIS | 32 | 25 (`PRM-FIS-P2-001…025`) |
| M07 COB | 11 | 9 (`PRM-COB-P2-001…009`) |
| M08 MOR | 10 | 10 (`PRM-MOR-P2-001…010`) |
| M19 POR | 8 | 6 (`PRM-POR-P2-001…006`) |
| T01 PLA | 8 | 4 (`PRM-PLA-P2-001…004`) |
| T06 INT | 8 | 2 (`PRM-INT-P2-001…002`) |
| T09 COM | 4 | 3 (`PRM-COM-P2-001…003`) |
| M02 CAT | 3 | 2 (`PRM-CAT-P2-001…002`) |
| M03 MED | 3 | 3 (`PRM-MED-P2-001…003`) |
| M10 TEC | 3 | 3 (`PRM-TEC-P2-001…003`) |
| M17 INS | 3 | 3 (`PRM-INS-P2-001…003`) |
| T03 UXD | 3 | 0 |
| M09 CRM | 1 | 1 (`PRM-CRM-P2-001`) |
| M18 SOC | 1 | 1 (`PRM-SOC-P2-001`) |
| T04 CFG | 1 | 0 |
| T10 BIA | 1 | 0 |
| Sin destino (Descartar) | 6 | 0 |
| **Total** | **313** | **256** |

### 6.3 Parámetros que revelan reglas de negocio no obvias (a incorporar en M04/M05/M06 y demás)

- **742 / 21 / 2095–2097 / 2342 (M04):** el redondeo del total es un ítem de factura con concepto propio y puede arrastrar la diferencia del período anterior a la factura siguiente (concepto "redondeo anterior"); tiene tope de importe y precisión configurable, sobrescribible por tipo de comprobante.
- **14 / 119 / 149 (M04):** el consumo de gas facturable es el volumen corregido por poder calorífico (consumo × PCS ÷ factor de referencia), con regla de redondeo propia; una opción permite facturar el consumo real sin corregir.
- **2498 / 2530 / 2643 (M04):** la recategorización de gas puede contar bimestres numerados 1–6 y tomar la fecha de lectura en vez del período.
- **2375 / 2407 / 2659 / 2737 / 2091–2093 / 243 (M04):** el recargo o la bonificación por factor de potencia usa una constante K según el método (tangente o coseno), un piso del coseno calculado, y puede o no incluir la energía inyectada en la base activa.
- **3094 (M04/M07):** si la factura de un prosumidor da negativa por energía inyectada, se agrega un concepto exento que la deja en 0 y genera saldo a favor; nunca se emite una factura negativa.
- **2876 (M04):** con consumo 0 y prorrateo entre dos cuadros, ProCoop necesitaba una línea extra para que quedara registrado qué cuadro se usó. CoopApps lo resuelve guardando el cuadro tarifario usado en cada línea.
- **2787 / 2864 (M04):** el proporcional de cargo fijo puede contarse desde el día de reconexión, y puede no aplicarse en períodos más cortos que los días definidos.
- **2701 / 3143 (M04):** un servicio puede facturarse con el consumo de otro servicio relacionado (`REL_SER`), y se decide si se toman los consumos pendientes o solo los no facturados.
- **2465 (M04):** el consumo mínimo solo se cobra a servicios conectados, salvo que la categoría tenga la marca "cobrar consumo mínimo en baja".
- **2663 (M04):** no se cobra franqueo a quien adhirió a factura digital, siempre que tenga un mail de envío válido.
- **2526 / 2443 (M05):** la factura masiva puede emitirse en 0 si hubo lecturas, y no se emite factura solo por cuotas si la cuenta no tiene ítems de servicio.
- **2769 (M05/M07):** si una cuenta tiene comprobantes bloqueados para el cobro, las facturas nuevas de la masiva nacen bloqueadas. Desbloquearlas puede generar un interés con concepto y tipo de comprobante propios (2770, 2771, 2984, M08).
- **3038 / 185 / 3008 (M05/M07):** los anticipos de productos pueden descontarse en la facturación masiva siguiente, y el vendedor puede elegir en cada venta si se descuentan.
- **242 / 484 (M05/M07):** el resumen por socio cambia el identificador del código de barras (socio o cuenta) y puede incluir o no las financiaciones.
- **2271 / 3080 / 2450 (M05):** la factura manual tiene un máximo de días hasta el 1.er vencimiento, un importe máximo que pide confirmación y una política para vincular créditos (sugerir, obligar o ignorar).
- **739 (M06):** los comprobantes internos (no fiscales) no pueden llevar conceptos gravados; esto evita esquivar el IVA y la autorización ARCA.
- **544 (M06):** a los sujetos "no categorizados" siempre se les aplica percepción de IVA, también sobre las cuotas.
- **727 / 726 / 2427 / 2712 (M06):** en mostrador se puede exigir el CAE antes de entregar el comprobante; la autorización automática tiene topes de importe por comprobante y por lote, y lo que los supera queda para revisión manual.
- **2515 (M06):** por encima del monto mínimo vigente se emite Factura de Crédito Electrónica MiPyME, que informa el CBU y el alias de la cuenta bancaria (2431, 2432).
- **2780 (M06):** se puede prohibir el CUIT genérico de consumidor final al autorizar en ARCA.
- **2605 (M06):** ProCoop permite sacar del libro IVA la facturación diaria o la mensual; CoopApps no lo replica (ver PA-CFG-P2-04).
- **Prepaga 393, 700–713, 2210–2245, 2313, 2413–2415 (M05/M03):** al vender crédito prepago se puede retener un importe fijo o un porcentaje para cancelar deuda vencida, según umbrales de facturas, financiaciones y deuda total (de la cuenta o del titular). Sobre lo retenido se emite una nota de crédito/débito y se imputa automáticamente. A quien no tiene deuda se le puede bonificar, solo si no hubo retención. También hay importes mínimos de venta.
- **273 / 2292 (M08):** el interés por pago fuera de término se cobra en caja con factura o nota de débito, y el método de cálculo puede tomar la fecha de pago o un recargo de los cheques.
- **2607 / 2624 (M08/M11):** al adelantar cuotas se bonifican los intereses no devengados solo si el concepto está configurado.
- **403 / 2089 / 2247 / 2289 / 2512 / 2930 (M11):** la venta en cuotas genera un crédito automático con concepto propio. Necesita conceptos obligatorios de interés y de descuento contado, y la diferencia de cotización de cuotas en moneda extranjera va con concepto y grupo de facturación propios. Puede generar crédito fiscal.
- **2679 / 2680 / 2871 / 732 (M11):** la venta en cuenta corriente puede restringirse a cuentas con servicio conectado o marcadas como clientes de productos. La venta rápida con deuda vencida puede bloquearse o permitirse solo al contado. El riesgo crediticio puede ignorarse, alertar, impedir o pedir autorización.
- **2736 / 2916 / 2856 (M17):** el capital cooperativo facturado se registra automáticamente al cerrar la masiva, salvo que se configure registro manual. Puede integrarse al cobrar y tiene una hora de proceso diaria.
- **2708 (M02/M10):** vender ciertos productos (por ejemplo, la recarga de telefonía prepaga) genera automáticamente una orden de trabajo.

## 7. Preguntas abiertas
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### PA-CFG-P2-01 — Alcance de los 114 parámetros sin lectura directa en el código
- **Pregunta:** ¿Se implementan todos los parámetros catalogados que ProCoop no lee en sus fuentes descompilados, o solo los que alguna cooperativa tiene configurados con un valor distinto del default?
- **Contexto:** RN-09 §1: 114 de los 313 parámetros de este módulo no tienen lectura directa (pueden usarlos CoopOnline, PMovil, el Agente o procedimientos almacenados, o estar obsoletos). DEC-007 incluye en el alcance todo lo que hace ProCoop, pero un parámetro que nadie usa no es funcionalidad.
- **Opciones:**
  - A) Catalogarlos todos con PRM (como en este documento), pero **implementar el comportamiento** solo si en la migración (T07) se encuentra al menos una cooperativa con un valor distinto del default; el resto queda en estado `Extensión` y oculto **(Recomendada)**. Así se cumple DEC-007 sin construir comportamiento muerto.
  - B) Implementarlos todos en sus olas. Se gana cobertura total, con mayor costo y riesgo de replicar comportamiento obsoleto.
  - C) Descartar los que no tienen lectura directa. Es lo más barato, pero puede perder funciones que solo usan las apps externas.
- **Impacto si no se responde:** se asume A; los PRM sin lectura quedan `A validar (PA-CFG-P2-01)`.
- **Bloquea:** PRM sin lectura directa de M05, M11, M06, M08 y M19 (olas O4–O8).

### PA-CFG-P2-02 — Conversión de banderas "permitir/impedir" en permisos
- **Pregunta:** ¿Se confirma que las banderas globales que habilitan o impiden una acción del usuario (411, 2678, 2518, 2695, 325, 2360, 2511) pasan a ser capabilities por rol en lugar de parámetros del tenant?
- **Contexto:** en ProCoop la bandera rige para todos los usuarios. Con capabilities, la cooperativa puede, por ejemplo, permitir que un supervisor cambie precios y prohibírselo a un cajero.
- **Opciones:**
  - A) Capabilities por rol con auditoría de cada uso **(Recomendada)**. Da control fino, y en la migración el rol "operador" queda sin la capability cuando la bandera prohibía la acción.
  - B) Mantener además la bandera global como interruptor maestro. Suma una capa de configuración redundante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T02 (catálogo de capabilities), M05, M07, M11.

### PA-CFG-P2-03 — Protección de los PDF de la impresión masiva (V2 #2402)
- **Pregunta:** ¿Cómo se protegen los PDF de facturas distribuidos masivamente?
- **Contexto:** ProCoop usa una única contraseña para todos los PDF generados, lo que no protege datos personales (T08) y obliga a comunicar la contraseña a todos los socios.
- **Opciones:**
  - A) Sin contraseña en el PDF: se distribuye un enlace firmado con vencimiento y descarga autenticada en el portal; si el tenant lo pide, el adjunto se envía sin contraseña **(Recomendada)**. Más simple y seguro.
  - B) Contraseña por destinatario derivada de un dato del socio (por ejemplo, su documento). Protege el adjunto, pero suma fricción y soporte.
  - C) Mantener una contraseña común guardada en la bóveda. Replica ProCoop con baja seguridad real.
- **Impacto si no se responde:** se asume A; el secreto 2402 no se migra.
- **Bloquea:** M05 (distribución), T06, T08.

### PA-CFG-P2-04 — Libro IVA ventas parcial (V2 #2605)
- **Pregunta:** ¿Se permite que el libro IVA ventas excluya la facturación diaria o la mensual?
- **Contexto:** ProCoop lo permite. El libro IVA legal y el Libro IVA Digital deben incluir todos los comprobantes fiscales emitidos.
- **Opciones:**
  - A) No: el libro legal y el digital siempre están completos, y la separación entre facturación diaria y mensual es solo un filtro de los reportes de gestión **(Recomendada)**. Así se evitan inconsistencias con ARCA.
  - B) Sí, como opción del tenant con advertencia. Replica ProCoop con riesgo fiscal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M06 (libros IVA, O8), T10.

### PA-CFG-P2-05 — Parámetros con nombre de una cooperativa o un tercero puntual
- **Pregunta:** ¿Las variantes creadas para una cooperativa o un tercero puntual (2292 "CAU"/"AL", 2284 "A.M.A.", 3007 TORN, 3039 FECESCOR, 3134 ortopedia, 1023/1024 "personalizadas") se generalizan o se implementan como extensiones de ese tenant?
- **Contexto:** ProCoop resuelve estos casos con código condicionado por la sigla de la cooperativa (RN-02 §14, variable 2264). En un SaaS multitenant ese patrón no escala.
- **Opciones:**
  - A) Generalizar: convenios de terceros configurables (concepto, formato de exportación, secuencia), reglas por fórmula del motor M04 y métodos de interés nombrados por comportamiento, sin siglas **(Recomendada)**. Un solo código para todos los tenants.
  - B) Extensiones por tenant activables por la plataforma. Es más rápido para cada caso, pero acumula deuda.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P2-005, PRM-FAC-P2-041, PRM-SOC-P2-001, M06 (convenios de terceros), M04 (fórmulas).

### PA-CFG-P2-06 — Política de CAE en ventas de mostrador (V2 #727, #726, #2427)
- **Pregunta:** Cuando ARCA no responde en una venta de mostrador o en una caja, ¿qué hace el sistema?
- **Contexto:** con 727 activo, ProCoop espera el registro en ARCA antes de seguir. Sin él, entrega el comprobante y lo autoriza después con el Agente, con riesgo de entregar un comprobante sin CAE.
- **Opciones:**
  - A) Esperar el CAE con un tiempo máximo. Si se vence, pasar a CAEA o contingencia cuando el tenant lo tenga habilitado (M06); si no, dejar el comprobante en "pendiente de autorización" sin entregarlo como fiscal y reintentar con el job **(Recomendada)**.
  - B) Entregar siempre y autorizar en diferido, como ProCoop sin 727. Es más ágil, pero entrega comprobantes sin CAE.
  - C) Bloquear la venta hasta que ARCA responda. Es lo más seguro, pero corta la atención.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-FIS-P2-001, PRM-FIS-P2-002, PRM-FIS-P2-003; M06, M07 (caja), M11 (O4–O5).

## 8. Trazabilidad

- Fuente RN-09 §6, módulo VENTAS_Y_FACTURACION: **313/313 filas** presentes en la sección 5. Se verificó por comparación automática de los `COD_VAR` de la fuente con los de este documento: no falta ninguno, no sobra ninguno y no hay PRM ni claves duplicados.
- RN-01 §20: todos sus parámetros de este módulo (14, 19, 24, 29, 77, 119, 208, 354, 543, 544, 742, 2068, 2089, 2095–2097, 2283, 2289, 2342, 2375, 2407, 2465, 2512, 2514, 2526, 2607, 2624, 2659, 2663, 2701, 2737, 2750, 2787, 2827, 2864, 2876, 2928, 3038, 3094, 3111, 3134, 3143, 2243, 2315, 2413, 2443) están en las secciones 5.1, 5.2, 5.6, 5.7, 5.9, 5.10 y 5.11. Los parámetros que RN-01 cita de otros módulos (527, 634/635, 2330, 2821, 3103, 3109, 307/311/607, 2549) corresponden a la parte 1 del catálogo.
- RN-02 §14: todos sus parámetros de este módulo están cubiertos; 67, 74, 519, 606, 639, 2055, 2242, 2255, 2264, 2528, 2539, 2549, 2703, 2721, 2759–2761, 2773, 2798, 2855, 3109, 3144, 3184, 308 y 310 pertenecen a otros módulos (parte 1).

