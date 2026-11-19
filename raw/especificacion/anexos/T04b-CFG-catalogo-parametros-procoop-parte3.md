# T04b CFG — Catálogo de parámetros ProCoop, parte 3: COBRANZA, GESTION_DE_MORA, FINANCIACIONES y CONSUMOS

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Cobranza / Pasarelas / ERP |
| Olas | O1 (modelo de parámetros), O5 (cobranza, pasarelas, débitos), O6 (mora, financiación, reconexión), O7 (consumos, prepago), O8 (tesorería), O10 (terminal de autogestión con agente local, vivienda) |
| Dueño de datos | T04 CFG es dueño del registro de parámetros (`tenantParameters`, alias de `parameterValues` según CTR-CFG-14 y CTR-DAT-49; versionado); cada anexo destino es dueño de la semántica de sus claves |
| Fuentes consolidadas | RN-09 §2, §6.1, §6.2 y §6.4 (módulos COBRANZA, GESTION_DE_MORA, FINANCIACIONES, CONSUMOS); RN-05 §10; RN-04 §11; V2 #63 a #3199 de esos módulos |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Propósito

Convertir **cada uno** de los 313 parámetros `Busca_V2_*` de ProCoop asignados (columna `COD_MOD`) a los módulos COBRANZA (265), GESTION_DE_MORA (23), FINANCIACIONES (21) y CONSUMOS (4) en su destino en CoopApps: un parámetro tipado del tenant, una configuración de servicio, de ente recaudador o de conector, una clave de diccionario, un valor de plataforma, una referencia a la bóveda de credenciales, un mecanismo nuevo que lo reemplaza o un descarte motivado. Ningún parámetro queda sin destino (regla de oro de la guía).

Esta parte complementa a `T04b-CFG-catalogo-parametros-procoop.md` (partes 1 y 2: SISTEMA, CONFIGURACION, TITULARES, VENTAS_Y_FACTURACION y demás módulos).

## 2. Fuente

- Catálogo: `procoop-relevamiento/reglas-negocio/09-parametros-y-configuracion.md` §6.4 (tablas por módulo, líneas 975–1307), con descripción oficial `NOM_VAR`, tipo `TIP_VAR`/`TIP_CTRL` y ubicación de cada lectura en el código descompilado.
- Uso funcional: RN-05 §10 (cobranzas, cajas y entes) y RN-04 §11 (mora, intereses y corte).
- **No se transcriben valores de credenciales** (claves, tokens, client secrets, usuarios de API). Solo se registra que existen y su destino en la bóveda (T06).

## 3. Criterio de decisión

| Decisión | Cuándo se aplica | Dónde queda |
|---|---|---|
| **Migrar** | Comportamiento de negocio parametrizable por la cooperativa. Se crea un parámetro tipado (Zod) del tenant, versionado con `validFrom`, con auditoría de cambios. El valor ProCoop se migra (T07). | `tenantParameters` (alias de `parameterValues`, T04; CTR-DAT-49) con semántica en el anexo destino |
| **Migrar-servicio** | El valor puede variar por servicio, categoría, plan o cuadro tarifario (ej. Internet vs. electricidad). | Configuración del servicio/categoría en M02, M04 o M08 (default de tenant + override) |
| **Migrar-ente** | Configuración propia de un ente recaudador, pasarela, red o conector (Pagos360, SIRO, Red Link, Pago Fácil, Naranja X, etc.). | Documento `collectionEntities` / `connectorConfigs` (M07 / T06), uno por ente y tenant |
| **Diccionario** | Texto visible configurable. | Clave `dict:` (T03 UXD) |
| **Marca** | Logos, colores, nombre visible. | Branding del tenant (T03 UXD) |
| **Plataforma** | Dato de infraestructura o común a todos los tenants. | Configuración de plataforma (T01 PLA), no editable por el tenant |
| **Bóveda** | Credencial o secreto (clave, token, client secret, usuario de API). | Bóveda de credenciales por tenant (T06 INT). El parámetro solo guarda una referencia `secretRef`; **valor no transcripto** y nunca visible en pantalla ni en logs |
| **Reemplazado** | El comportamiento existe pero lo resuelve un mecanismo nuevo (capability, preferencia de usuario, columna configurable de DataTable, URL calculada por la plataforma, worker, log de integración). | El mecanismo indicado en "Clave nueva" |
| **Descartar** | Detalle de la tecnología WinForms, dato puramente legacy o sin función en el modelo nuevo. Se indica el motivo. | — |

Reglas aplicadas en forma uniforme:

1. **URLs de retorno, de notificación y webhooks** de pasarelas (éxito, pendiente, rechazo, salir, volver, notificación) → `Reemplazado`: las calcula la plataforma a partir del dominio del tenant y de las rutas `/api/public/<tenantSlug>/pagos/...` y `/api/public/<tenantSlug>/webhooks/<endpointKey>`; no se configuran a mano.
2. **Credenciales** → `Bóveda`, incluso los identificadores de cliente (`client_id`, usuario, CUIT de acceso a API) porque se rotan junto con el secreto.
3. **Opciones de pantalla WinForms** (foco, minimizar, íconos) → `Descartar`; **columnas visibles y vistas previas** → `Reemplazado` por DataTable configurable o preferencia de usuario (T03).
4. **"No permitir X a usuarios"** → `Reemplazado` por capability (T02 IAM), nunca por parámetro global.
5. **Conceptos facturables** (FK `PROD_SER`) → referencia a `products` del catálogo (M02); son obligatorios cuando la función que los usa está activa (validación al publicar la configuración, equivalente a `ValidarCobranza`).
6. Los parámetros cuyo `COD_MOD` está mal asignado en ProCoop (ej. #2508 vivienda, #2593 presupuestos móviles) se envían a su anexo funcional real.

## 4. Leyenda

- **V2 #**: `COD_VAR` de ProCoop. **Tabla/canal**: `VAR` = `VARIABLE`; `VAR_PMOVIL/CoopOnline` = `VARIABLE_PMOVIL` con `MOD_VAR = 1`.
- **Tipo**: L lógico, N numérico, E entero, C texto, F fecha (texto), M mixto (varias columnas), Lista (opciones cerradas), FK (clave a tabla).
- **Uso en código**: resumen de la lectura en el código descompilado; "s/lectura" = sin lectura directa en RN/Cfg/PN (lo usa CoopOnline, PMovil, el Agente, un enum o está obsoleto).
- **PRM-ID**: `PRM-<COD anexo destino>-P3-NNN`; numeración propia de esta parte. Varias filas con el mismo PRM-ID = parámetros ProCoop consolidados en una única clave. `—` = sin parámetro (Reemplazado, Descartar, Diccionario).
- **Tipo nuevo**: `boolean`, `int`, `decimal(%)` (tasa con `Decimal128`), `money` (`Decimal128`, ARS), `enum{...}`, `ref:<colección>`, `ref:<colección>[]`, `string`, `string[]`, `email[]`, `url`, `time` (HH:mm en zona del tenant), `date`, `secretRef`.
- **Ámbito**: plataforma / tenant / sucursal / caja / usuario / servicio / categoría / plan / ente / terminal. "tenant (override X)" = default de tenant con valor específico opcional en X.
- **[VERIFICAR]**: el significado exacto debe confirmarse en la migración (parámetro sin lectura directa o con nombre ambiguo); se adopta la interpretación indicada.

## 5. Módulo COBRANZA (265 parámetros)

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Caja y consulta de deuda (31)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 129 | VAR | L | Número de caja automático | s/lectura | Reemplazado | — | → numeración automática de sesiones de caja (`cashSessions.number`, secuencia por caja) | — | — | — | M07 COB |
| 186 | VAR | E FK `TIP_MON` | Moneda por defecto en la caja (obs: Pesos) | Medio de pago CoopOnline; prescripción de deuda; egreso de efectivo en pago a proveedor | Migrar | PRM-COB-P3-001 | `cob.caja.monedaDefault` | ref:currencies | tenant (override caja) | ARS | M07 COB |
| 187 | VAR | L | Controlar deuda vencida del titular en caja | Validación y advertencias de caja (`Validar_CobranzaLocal_CobrarFacturasTitular`) | Migrar | PRM-COB-P3-002 | `cob.caja.avisarDeudaVencidaAnterior` | boolean | tenant | true | M07 COB |
| 302 | VAR | L | Mostrar aviso en caja si un titular está notificado | Advertencia de caja e importador de entes (`Validar_TitularNotificado`) | Migrar | PRM-COB-P3-003 | `cob.caja.avisarTitularNotificado` | boolean | tenant | true | M07 COB |
| 323 | VAR | E Lista | Elemento por defecto al ingresar a la cobranza: comprobante, número de comprobante, código de barras, cuenta, id titular, nombre titular, archivo (obs: Cuenta) | s/lectura (pantalla) | Migrar | PRM-COB-P3-004 | `cob.caja.criterioBusquedaDefault` | enum{comprobante, numeroComprobante, codigoBarras, cuenta, idTitular, nombreTitular, archivo} | tenant (override usuario) | cuenta | M07 COB |
| 650 | VAR | E Lista | Medio de pago por defecto en caja: efectivo, valores, retenciones, tarjeta, transferencia (obs: Efectivo) | s/lectura (pantalla) | Migrar | PRM-COB-P3-005 | `cob.caja.medioPagoDefault` | enum{efectivo, valores, retenciones, tarjeta, transferencia} | tenant (override caja) | efectivo | M07 COB |
| 1001 | VAR | L | Vuelto proporcional en caja | s/lectura | Migrar [VERIFICAR] | PRM-COB-P3-006 | `cob.caja.vuelto.proporcional` | boolean | tenant | false | M07 COB |
| 1012 | VAR | L | Vuelto a partir del último ingreso | s/lectura | Migrar | PRM-COB-P3-007 | `cob.caja.vuelto.desdeUltimoIngreso` | boolean | tenant | false | M07 COB |
| 1015 | VAR | L | No da vuelto en caja | s/lectura | Migrar (lógica invertida) | PRM-COB-P3-008 | `cob.caja.vuelto.permitido` | boolean | tenant (override caja) | true | M07 COB |
| 2248 | VAR | E Lista | Cuándo mostrar el formulario de donación en caja: nunca, siempre, solo si existe vuelto (obs: Nunca) | Carga de propiedades de caja | Migrar | PRM-COB-P3-009 | `cob.caja.donacion.modo` | enum{nunca, siempre, soloConVuelto} | tenant | nunca | M07 COB |
| 2338 | VAR | L | Mostrar ícono de validación al seleccionar comprobantes a pagar | s/lectura | Descartar | — | — | — | — | — | — (motivo: detalle visual WinForms; el design system muestra siempre el estado de validación) |
| 2349 | VAR | L | Mostrar observación del domicilio del servicio en búsqueda por cuenta | Selector de titulares | Reemplazado | — | → columna configurable "Observación domicilio servicio" del resultado de búsqueda (DataTable, vistas guardadas) | — | usuario | — | T03 UXD |
| 2385 | VAR | E | Días a partir del vencimiento 2 que deben transcurrir para excluir comprobantes de la caja y de la consulta de deuda | Filtros de consulta (`InfoFiltros`) | Migrar | PRM-COB-P3-010 | `cob.consultaDeuda.diasExclusionDesdeVto2` | int (0 = no excluye) | tenant | 0 | M07 COB |
| 2411 | VAR | L | Advertencia en caja al pagar un comprobante de un servicio desconectado | Validación de caja | Migrar | PRM-COB-P3-011 | `cob.caja.avisarServicioDesconectado` | boolean | tenant | true | M07 COB |
| 2436 | VAR | L | Mostrar observación del domicilio de la cuenta en búsqueda por cuenta | Selector de titulares | Reemplazado | — | → columna configurable "Observación domicilio cuenta" del resultado de búsqueda | — | usuario | — | T03 UXD |
| 2441 | VAR | L | Imprimir automáticamente en consulta de deuda al marcar comprobantes | s/lectura | Reemplazado | — | → preferencia de usuario "Imprimir al marcar" de la pantalla de consulta de deuda | — | usuario | — | T03 UXD |
| 2451 | VAR | L | Mostrar fecha de vencimiento de las facturas con entregas | s/lectura | Reemplazado | — | → columna configurable "Vencimiento" en la grilla de comprobantes con entregas | — | usuario | — | T03 UXD |
| 2453 | VAR | L | Mostrar aviso en consulta de deuda si un titular está notificado | Validación de titular notificado | Migrar | PRM-COB-P3-012 | `cob.consultaDeuda.avisarTitularNotificado` | boolean | tenant | true | M07 COB |
| 2473 | VAR | L | Mostrar notas de cuenta en caja al buscar por número de cuenta | s/lectura | Migrar | PRM-COB-P3-013 | `cob.caja.mostrarNotasCuenta` | boolean | tenant | true | M07 COB |
| 2510 | VAR | L | Permitir minimizar formulario de cobranza local | s/lectura | Descartar | — | — | — | — | — | — (motivo: comportamiento de ventana WinForms) |
| 2523 | VAR | E Lista | Selección por defecto en selección de vencimiento de comprobantes en caja: todos los marcados, solo el seleccionado | s/lectura (pantalla) | Migrar | PRM-COB-P3-014 | `cob.caja.seleccionVencimiento.alcanceDefault` | enum{todosMarcados, soloSeleccionado} | tenant (override usuario) | todosMarcados | M07 COB |
| 2524 | VAR | L | Mantener control enfocado luego de una búsqueda de comprobantes en caja | s/lectura | Descartar | — | — | — | — | — | — (motivo: manejo de foco lo define el design system: el foco vuelve siempre al buscador) |
| 2562 | VAR | L | Mostrar interés entre vencimientos en columna separada en caja | s/lectura | Reemplazado | — | → columna "Interés entre vencimientos" disponible siempre que PRM-MOR-P3-015 esté activo | — | usuario | — | T03 UXD |
| 2566 | VAR | L | Mostrar interés completo en consulta de deuda | s/lectura | Migrar [VERIFICAR] | PRM-COB-P3-015 | `cob.consultaDeuda.mostrarInteresCompleto` | boolean | tenant | false | M07 COB |
| 2586 | VAR | L | Permitir cobrar facturas bloqueadas en caja | Importador: validación de comprobante bloqueado | Migrar | PRM-COB-P3-016 | `cob.caja.permitirCobrarFacturasBloqueadas` | boolean | tenant | false | M07 COB |
| 2596 | VAR | L | Permitir cobrar talones de facturas bloqueadas en caja | Importador: validación de comprobante bloqueado | Migrar | PRM-COB-P3-017 | `cob.caja.permitirCobrarTalonesDeFacturasBloqueadas` | boolean | tenant | false | M07 COB |
| 2739 | VAR | L | Permitir apertura de caja automática en venta de productos | s/lectura | Migrar | PRM-COB-P3-018 | `cob.caja.aperturaAutomaticaEnVenta` | boolean | tenant (override caja) | false | M07 COB |
| 2909 | VAR | L | Alerta de saldo a favor al leer códigos de barra | s/lectura | Migrar | PRM-COB-P3-019 | `cob.caja.alertarSaldoAFavorAlLeerCodigo` | boolean | tenant | true | M07 COB |
| 2910 | VAR | L | Habilitar check "Excluir financiaciones" en consulta de deuda | s/lectura | Reemplazado | — | → filtro estándar "Excluir financiaciones" de la consulta de deuda, siempre disponible | — | — | — | M07 COB |
| 2932 | VAR | L | Controlar deuda vencida por cuenta al ingresar código de barras | s/lectura | Migrar | PRM-COB-P3-020 | `cob.caja.controlarDeudaVencidaPorCuentaConCodigoBarras` | boolean | tenant | true | M07 COB |
| 3169 | VAR | L | Validar que no haya comprobantes repetidos en cobranza local | Registración del pago (`RegistrarPago`) | Reemplazado | — | → control obligatorio de comprobante repetido + `Idempotency-Key` en toda registración (no configurable) | — | — | — | M07 COB |

### 5.2 Caja: medios de pago, valores y redondeo (13)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 486 | VAR | N | Interés diario para valores recibidos en caja | s/lectura (se combina con #487) | Migrar | PRM-COB-P3-021 | `cob.valores.interesDiarioValoresAFecha` | decimal(%) versionado | tenant | 0 | M07 COB |
| 487 | VAR | N FK `PROD_SER` | Concepto para interés diario por pago con valores a fecha | Validación de cobranza; recargos por medio de pago | Migrar | PRM-COB-P3-022 | `cob.valores.conceptoInteresValoresAFecha` | ref:products | tenant | — (obligatorio si #486 > 0) | M07 COB |
| 708 | VAR | L | Diferir comisiones de medios de pago utilizados en cobranza | s/lectura | Migrar | PRM-COB-P3-023 | `cob.mediosPago.diferirComisiones` | boolean | tenant | false | M07 COB |
| 2069 | VAR | N FK `PROD_SER` | Concepto para recargo con tarjeta de crédito | Validación de cobranza; recargos por medio de pago | Migrar | PRM-COB-P3-024 | `cob.mediosPago.conceptoRecargoTarjetaCredito` | ref:products | tenant | — (obligatorio si hay recargo por tarjeta) | M07 COB |
| 2070 | VAR | N FK `PROD_SER` | Concepto para recargo por transferencia | Validación de cobranza; recargos por medio de pago | Migrar | PRM-COB-P3-025 | `cob.mediosPago.conceptoRecargoTransferencia` | ref:products | tenant | — (obligatorio si hay recargo por transferencia) | M07 COB |
| 2725 | VAR | L | No se permite registro de cheques con el mismo número | s/lectura | Migrar | PRM-TES-P3-001 | `tes.valores.cheque.numeroUnico` | boolean (unicidad banco + sucursal + número) | tenant | true | M14 TES |
| 3054 | VAR | N FK `PROD_SER` | Concepto a facturar por redondeo en cobranza en efectivo | Creación de anticipo por redondeo | Migrar | PRM-COB-P3-026 | `cob.redondeoEfectivo.concepto` | ref:products | tenant | — (obligatorio si #3055 > 0) | M07 COB |
| 3055 | VAR | N | Monto máximo para redondeo en cobranza en efectivo | s/lectura (lo usa la pantalla de caja) | Migrar | PRM-COB-P3-027 | `cob.redondeoEfectivo.montoMaximo` | money (0 = sin redondeo) | tenant | 0 | M07 COB |
| 3056 | VAR | E FK `TIPO_FAC` | Tipo de comprobante para anticipos por redondeo en efectivo | Creación de anticipo por redondeo | Migrar | PRM-COB-P3-028 | `cob.redondeoEfectivo.tipoCuotaAnticipo` | ref:invoiceTypes | tenant | — | M07 COB |
| 3069 | VAR | E FK `VENDEDOR` | Vendedor por defecto para redondeo en cobranza en efectivo | Creación de anticipo por redondeo | Migrar | PRM-COB-P3-029 | `cob.redondeoEfectivo.vendedorDefault` | ref:salesAgents | tenant | — | M07 COB |
| 3070 | VAR | L | Generar comprobantes formales en redondeo en efectivo | Creación de anticipo por redondeo | Migrar | PRM-COB-P3-030 | `cob.redondeoEfectivo.emitirComprobanteFormal` | boolean | tenant | false | M07 COB |
| 3177 | VAR | E FK `PROD_SER` | Concepto al rechazar cupones de tarjeta | Tesorería: anticipo por rechazo de cupones | Migrar | PRM-TES-P3-002 | `tes.cupones.conceptoRechazo` | ref:products | tenant | — | M14 TES |
| 3188 | VAR | L | Diferir comisiones al cobrar con cheque | s/lectura | Migrar | PRM-COB-P3-031 | `cob.mediosPago.diferirComisionesCheque` | boolean | tenant | false | M07 COB |

### 5.3 Recibos y comprobantes de caja (13)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 228 | VAR | L | Imprime automáticamente el cupón de pago en cobranza | s/lectura | Migrar | PRM-COB-P3-032 | `cob.recibo.imprimirCuponAutomatico` | boolean | tenant (override caja) | false | M07 COB |
| 598 | VAR | E FK `COMPROB` | Comprobante por defecto para cobranza | s/lectura | Migrar | PRM-COB-P3-033 | `cob.recibo.tipoComprobanteDefault` | ref:documentTypes | tenant (override sucursal) | Recibo X | M07 COB |
| 599 | VAR | N | Sucursal por defecto para cobranza | s/lectura | Reemplazado | — | → la sucursal y el punto de venta salen de la caja abierta (`cashRegisters.branchId`, `pointOfSaleId`) | — | caja | — | M07 COB |
| 649 | VAR | L | Imprimir nota de débito en cajas | s/lectura | Migrar | PRM-COB-P3-034 | `cob.recibo.imprimirNotaDebitoIntereses` | boolean | tenant | true | M07 COB |
| 2249 | VAR | E FK `TIPO_FAC` | Tipo de cuota para comprobantes generados desde caja (obs: si se indica, todo comprobante generado en caja es de ese tipo, sin importar qué se cobre) | Registración de intereses | Migrar | PRM-COB-P3-035 | `cob.caja.tipoCuotaComprobantesGenerados` | ref:invoiceTypes (nullable) | tenant | null (hereda el tipo del comprobante cobrado) | M07 COB |
| 2270 | VAR | L | Imprimir operación de caja en vez de recibo | s/lectura | Migrar | PRM-COB-P3-036 | `cob.recibo.formatoImpresion` | enum{recibo, operacionCaja} | tenant | recibo | M07 COB |
| 2364 | VAR | L | No mostrar vista previa en recibo / operación de caja | s/lectura | Reemplazado | — | → preferencia de usuario "Vista previa antes de imprimir" | — | usuario | — | T03 UXD |
| 2452 | VAR | L | Generar siempre recibo oficial en operaciones de caja | CoopOnline (venta y cobranza); guardado de comprobante de venta | Migrar | PRM-COB-P3-037 | `cob.recibo.emitirSiempreReciboOficial` | boolean | tenant | true | M07 COB |
| 2684 | VAR | E FK `PLANTILLA` | Plantilla de mail para recibo de pago | s/lectura | Migrar | PRM-COB-P3-038 | `cob.recibo.plantillaEmail` | ref:messageTemplates | tenant | plantilla estándar "Recibo de pago" | M07 COB |
| 2698 | VAR | L | Enviar notas de débito por correo junto al recibo de pago | s/lectura | Migrar | PRM-COB-P3-039 | `cob.recibo.adjuntarNotasDebitoEnEmail` | boolean | tenant | true | M07 COB |
| 2719 | VAR | L | Enviar un recibo por cada cuenta cobrada en una misma operación de caja | s/lectura | Migrar | PRM-COB-P3-040 | `cob.recibo.unoPorCuentaEnEmail` | boolean | tenant | false | M07 COB |
| 2929 | VAR | L | Preguntar si se cobra la reimpresión del comprobante según permiso | s/lectura | Migrar | PRM-COB-P3-041 | `cob.recibo.reimpresion.preguntarCobro` | boolean (+ capability `cob.recibos.reimprimirSinCargo`) | tenant | false | M07 COB |
| 3083 | VAR | C largo | Cambiar texto de "cód. de autorización" para cupones de tarjetas | s/lectura | Diccionario | — | `dict:cob.cupon.codigoAutorizacion` | — | tenant | "Código de autorización" | T03 UXD |

### 5.4 Imputación, talones y anticipos (10)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 321 | VAR | L | Bloquear comprobantes notificados para cobrar en grupo (obliga a cobrar completa la deuda notificada) | Validación de caja (`Validar_CobranzaLocal_ComprobantesNotificados`) | Migrar | PRM-COB-P3-042 | `cob.imputacion.exigirDeudaNotificadaCompleta` | boolean | tenant | false | M07 COB |
| 324 | VAR | L | Al confirmar, exigir cobrar facturas más antiguas | Validación de caja (`CobrarFacturasAntiguas`) | Migrar | PRM-COB-P3-043 | `cob.imputacion.exigirMasAntiguasPrimero` | boolean | tenant | false | M07 COB |
| 375 | VAR | L | Al confirmar, exigir cobrar facturas más antiguas del mismo servicio (o tipo de factura) | Validación de caja (`CobrarFacturasAntiguasServicio`) | Migrar | PRM-COB-P3-044 | `cob.imputacion.exigirMasAntiguasPorServicio` | boolean | tenant | false | M07 COB |
| 462 | VAR | L | Tomar último vencimiento para exigir cobranza de comprobantes viejos (compara por VTO4 en lugar de VTO1) | Validación de caja | Migrar | PRM-COB-P3-045 | `cob.imputacion.antiguedadPorUltimoVencimiento` | boolean (false = primer vencimiento) | tenant | false | M07 COB |
| 2337 | VAR | L | Anular talón sumado automáticamente al registrar cobranza si no se paga completo | Registración: anulación de talones sumados | Migrar | PRM-COB-P3-046 | `cob.imputacion.anularTalonSumadoSiPagoParcial` | boolean | tenant | false | M07 COB |
| 2355 | VAR | L | Exigir pago de talón sumado completo en caja | Validación de talones | Migrar | PRM-COB-P3-047 | `cob.imputacion.exigirTalonSumadoCompleto` | boolean | tenant | true | M07 COB |
| 2585 | VAR | E | Días por defecto para el vencimiento de los talones generados en caja y CoopOnline | CoopOnline: creación de cobranza | Migrar | PRM-COB-P3-048 | `cob.talon.diasVencimientoDefault` | int | tenant | 10 | M07 COB |
| 2639 | VAR | L | Generar anticipos automáticos según el tipo de la factura cobrada | s/lectura | Migrar | PRM-COB-P3-049 | `cob.anticipos.generarAutomaticoSegunTipoFactura` | boolean | tenant | false | M07 COB |
| 2651 | VAR | L | Descontar anticipo en próxima factura en la importación de archivo de ente recaudador | Creación de anticipo en importación (`EntidadDigital.CrearAnticipo`) | Migrar | PRM-COB-P3-050 | `cob.anticipos.descontarEnProximaFacturaDesdeEnte` | boolean | tenant | true | M07 COB |
| 2687 | VAR | L | Permitir quitar el orden automático al cargar comprobantes en la cobranza | s/lectura | Migrar | PRM-COB-P3-051 | `cob.imputacion.permitirAlterarOrdenAutomatico` | boolean (+ capability `cob.caja.alterarOrdenImputacion`) | tenant | false | M07 COB |

### 5.5 Intereses y recargos calculados en caja (20)

El cálculo de intereses es propiedad de M08 (motor de mora e intereses); la caja, la consulta de deuda y las pasarelas lo invocan como servicio.

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 299 | VAR | L | Cobrar recargo en vencimiento 2 a jubilados | Variables de consulta (`clsCobranzas.VariablesConsulta`) | Migrar | PRM-MOR-P3-001 | `mor.recargo.jubilados.cobrarDesdeVto2` | boolean | tenant (override categoría) | false | M08 MOR |
| 372 | VAR | N | Importe a sumar en concepto de gastos administrativos | Variables de consulta | Migrar | PRM-MOR-P3-002 | `mor.recargo.gastosAdministrativosImporte` | money versionado | tenant (override servicio) | 0 | M08 MOR |
| 600 | VAR | N | Recargo diario en caja (% diario fijo de mora) | Variables de consulta; coeficiente de interés en informes; deuda a analizar en prepaga | Migrar | PRM-MOR-P3-003 | `mor.interes.tasaDiariaMora` | decimal(%) versionado (`validFrom`) | tenant (override servicio) | valor migrado | M08 MOR |
| 606 | VAR | N FK `PROD_SER` | Concepto para interés por mora | Variables de consulta; informes de composición de deuda (+7 usos) | Migrar | PRM-MOR-P3-004 | `mor.interes.conceptoMora` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 608 | VAR | L | Redondear intereses (a 1 decimal) | Variables de consulta | Migrar | PRM-MOR-P3-005 | `mor.interes.redondeo` | enum{sinRedondeo, unDecimal, entero} | tenant | sinRedondeo | M08 MOR |
| 609 | VAR | N | Interés mínimo a cobrar en cajas (por debajo, el recargo es 0) | Variables de consulta | Migrar | PRM-MOR-P3-006 | `mor.interes.minimoACobrar` | money | tenant | 0 | M08 MOR |
| 621 | VAR | L | Recargo desde tercer vencimiento (contar el interés desde el último vencimiento) | Variables de consulta | Migrar | PRM-MOR-P3-007 | `mor.interes.contarDesdeUltimoVencimiento` | boolean | tenant (override servicio) | false | M08 MOR |
| 625 | VAR | L | Calcular intereses en créditos | Variables de consulta; creación de cobro Pagos360 | Migrar | PRM-MOR-P3-008 | `mor.interes.calcularSobreCreditos` | boolean | tenant | false | M08 MOR |
| 1002 | VAR | L | Sin recargo a jubilados | Variables de consulta | Migrar | PRM-MOR-P3-009 | `mor.recargo.jubilados.exentos` | boolean | tenant (override categoría) | false | M08 MOR |
| 1011 | VAR | E Lista | Forma en la que se difieren los intereses de facturas: no diferir, diferir intereses de mora, diferir todos (obs: No Diferir) | Variables de consulta | Migrar | PRM-MOR-P3-010 | `mor.interes.modoDiferir` | enum{noDiferir, diferirMora, diferirTodos} | tenant | noDiferir | M08 MOR |
| 1056 | VAR | L | Emitir facturas por intereses agrupadas por tipo | Registración de intereses; validación de impuestos CoopOnline/Integra | Migrar | PRM-MOR-P3-011 | `mor.interes.facturarAgrupadoPorTipo` | boolean | tenant | false | M08 MOR |
| 2078 | VAR | M | Forma de cobro de interés entre vencimientos | s/lectura (relacionado con V2 #74 de facturación) | Migrar [VERIFICAR] | PRM-MOR-P3-012 | `mor.interes.entreVencimientos.formaCobro` | enum{enProximaFactura, enCaja, ambos} | tenant (override servicio) | enCaja | M08 MOR |
| 2080 | VAR | N FK `PROD_SER` | Concepto para interés entre vencimientos | Cálculo IIBB/percepción entre vencimientos; registración de intereses | Migrar | PRM-MOR-P3-013 | `mor.interes.conceptoEntreVencimientos` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 2300 | VAR | C | Códigos de impuesto a excluir en cálculo de recargo por mora (lista separada por coma) | Datos de factura para recargo | Migrar | PRM-MOR-P3-014 | `mor.interes.impuestosExcluidosBase` | ref:taxes[] | tenant | [] | M08 MOR |
| 2356 | VAR | L | Discriminar interés entre vencimientos e interés por mora en el recargo de caja | Variables de consulta; diferencia de pago de entes digitales; importador Mercado Pago (+1) | Migrar | PRM-MOR-P3-015 | `mor.interes.discriminarEntreVtoYMora` | boolean | tenant | false | M08 MOR |
| 2363 | VAR | L | Aplicar proporcionalidad en cálculo de recargo entre vencimientos en caja (proporcional al saldo) | Variables de consulta; cálculo de recargo | Migrar | PRM-MOR-P3-016 | `mor.interes.entreVencimientos.proporcionalSaldo` | boolean | tenant | false | M08 MOR |
| 2487 | VAR | F | Fecha de cálculo de intereses (fija) a utilizar en cobranza local | s/lectura | Migrar | PRM-MOR-P3-017 | `mor.interes.fechaCalculoFija` | date (nullable; cambio auditado y con capability `mor.interes.fijarFecha`) | tenant | null | M08 MOR |
| 2826 | VAR | L | Discriminar IIBB en interés entre vencimientos en el recargo de caja | Aplicación de IIBB; recargo; validación de impuestos (+10 usos) | Migrar | PRM-MOR-P3-018 | `mor.interes.entreVencimientos.discriminarIIBB` | boolean | tenant | false | M08 MOR (con M06 FIS) |
| 2828 | VAR | L | Relacionar servicio a la cuota generada por intereses diferidos | Registración de intereses | Migrar | PRM-MOR-P3-019 | `mor.interes.diferido.relacionarServicio` | boolean | tenant | true | M08 MOR |
| 3167 | VAR | L | Calcular recargo por mora a partir de conceptos configurados (`CONCEPTOS_INT`) | Recargo; datos de factura | Migrar | PRM-MOR-P3-020 | `mor.interes.baseSegunConceptosConfigurados` | boolean (base = colección `moraInterestBaseConcepts`) | tenant | false | M08 MOR |

### 5.6 Reconexión y mora al cobrar (9)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2420 | VAR | L | Generar OT de alta de servicio luego de cobrar un servicio desconectado | s/lectura (duplicado de #3106, que es la que lee el código) | Reemplazado | PRM-MOR-P3-021 | → valor `generarOT` de `mor.reconexion.alCobrar.modo` | — | — | — | M08 MOR |
| 2713 | VAR | L | Generar y confirmar OT de alta de servicio luego de cobrar un servicio desconectado | Registración del pago; generar/confirmar OT; reconexión de servicio del socio (+1) | Migrar-servicio (consolidado) | PRM-MOR-P3-021 | `mor.reconexion.alCobrar.modo` (valor `generarYConfirmarOT`) | enum{ninguno, generarOT, generarYConfirmarOT} | servicio (default tenant) | ver #3106 | M08 MOR |
| 2917 | VAR | L | Validar si tiene pendiente una desconexión por mora y cancelarla al realizar una cobranza | s/lectura | Migrar | PRM-MOR-P3-022 | `mor.corte.cancelarDesconexionPendienteAlCobrar` | boolean | tenant (override servicio) | true | M08 MOR |
| 2926 | VAR | L | Tener en cuenta servicios que no requieren técnica y reconectar directamente | Servicios a reconectar en caja | Migrar-servicio | PRM-MOR-P3-023 | `mor.reconexion.directaSiServicioSinTecnica` | boolean | servicio (default tenant) | true | M08 MOR |
| 3033 | VAR | L | Sacar marca de moroso al no reconectar servicio en el pago | s/lectura | Migrar | PRM-MOR-P3-024 | `mor.corte.quitarMarcaMorosoSinReconexion` | boolean | tenant | false | M08 MOR |
| 3106 | VAR | L | Generar OT de alta de servicio luego de cobrar un servicio desconectado | Registración del pago; generar OT | Migrar-servicio (consolidado) | PRM-MOR-P3-021 | `mor.reconexion.alCobrar.modo` (valor `generarOT`) | enum{ninguno, generarOT, generarYConfirmarOT} | servicio (default tenant) | generarOT — A validar (PA-CFG-P3-04) | M08 MOR |
| 3147 | VAR | E Lista | Deuda a considerar para reconectar servicios: toda la deuda, solo facturas pasadas del primer vencimiento, solo pasadas del último vencimiento (obs: toda la deuda) | Cambio de estado del servicio en caja; servicios desconectados sin deuda | Migrar-servicio | PRM-MOR-P3-025 | `mor.reconexion.criterioDeuda` | enum{todaLaDeuda, vencidasPrimerVto, vencidasUltimoVto} | servicio (default tenant) | vencidasUltimoVto (ProCoop: todaLaDeuda) — A validar (PA-CFG-P3-04) | M08 MOR |
| 3153 | VAR | L | Tener en cuenta acciones a realizar al realizar cobranza del servicio | s/lectura | Migrar [VERIFICAR] | PRM-COB-P3-052 | `cob.cobro.ejecutarAccionesDelServicio` | boolean (acciones post-cobro definidas en el servicio M02) | tenant | false | M07 COB |
| 3163 | VAR | L | Validar deuda notificada al generar reconexión | Servicios desconectados sin deuda | Migrar | PRM-MOR-P3-026 | `mor.reconexion.validarDeudaNotificada` | boolean | tenant | true | M08 MOR |

### 5.7 Entes recaudadores, links de pago y archivos (21)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 360 | VAR | E FK `PROD_SER` | Concepto a cobrar por comisiones de entidades | Validación de cobranza; registración de cobranza de entidad | Migrar-ente | PRM-COB-P3-053 | `cob.ente.conceptoComision` | ref:products | ente (default tenant) | — (obligatorio si el ente cobra comisión) | M07 COB |
| 2055 | VAR | E Lista | Código de barra por defecto en cobranza | Generación e interpretación de código de barras | Migrar | PRM-COB-P3-054 | `cob.codigoBarras.formatoDefault` | ref:barcodeFormats | tenant | formato del ente principal | M07 COB (M05 FAC lo imprime) |
| 2056 | VAR | E FK `CAT_BANC` | Categoría para depósito de cobranza por entidades (categoría del movimiento bancario) | Anulación de cobranza; validación; alta de movimiento bancario por caja (+3) | Migrar-ente | PRM-COB-P3-055 | `cob.ente.categoriaMovimientoBancario` | ref:bankMovementCategories | ente (default tenant) | — (obligatorio) | M07 COB (con M14 TES) |
| 2255 | VAR | C | Código de convenio de entidad recaudadora por defecto | Generación de código de barras | Migrar-ente | PRM-COB-P3-056 | `cob.ente.codigoConvenio` | string | ente (ente default del tenant) | — | M07 COB |
| 2267 | VAR | E Lista | Origen de comprobantes para exportación de archivos de cobranza por defecto: facturas, talón sumado, cuotas de gas (obs: Facturas) | s/lectura (pantalla de exportación) | Migrar-ente | PRM-COB-P3-057 | `cob.ente.exportacion.origenComprobantes` | enum{facturas, talonSumado, cuotasGas} | ente | facturas | M07 COB |
| 2620 | VAR | L | Permitir generar links de pago con entidades fuera de línea | Sincronización de parámetros web | Migrar | PRM-COB-P3-058 | `cob.linkPago.permitirEntesFueraDeLinea` | boolean | tenant | false | M07 COB |
| 2645 | VAR | E Lista | Solo generar links de pago con entidades fuera de línea en CoopOnline: no; sí, solo pago offline; sí, pago offline, online y en caja | CoopOnline: validar configuración y caja; subir PDF de pago en efectivo (+1) | Migrar | PRM-COB-P3-059 | `cob.portal.linkPago.modoEntesFueraDeLinea` | enum{no, soloOffline, offlineOnlineYCaja} | tenant | no | M07 COB (M19 POR consume) |
| 2646 | VAR | L | Validar con la fecha de rendición en cobranzas de entidades recaudadoras | s/lectura | Migrar-ente | PRM-COB-P3-060 | `cob.ente.rendicion.validarFechaRendicion` | boolean | ente | false | M07 COB |
| 2686 | VAR | L | Utilizar el tipo de la primera factura al usar concepto de LINK | Exportador: talones; Red Link continuo | Migrar-ente | PRM-COB-P3-061 | `cob.ente.redLink.tipoPrimeraFacturaEnConcepto` | boolean | ente (Red Link) | false | M07 COB |
| 2746 | VAR | E | Pago Fácil: cantidad de días posteriores a la fecha de vencimiento | Exportación Pago Fácil | Migrar-ente | PRM-COB-P3-062 | `cob.ente.pagoFacil.diasPosterioresVto` | int | ente (Pago Fácil) | 0 | M07 COB |
| 2774 | VAR | E Lista | Entidad por defecto a utilizar en cobranza web | CoopOnline: generar solicitud; medio de pago | Migrar | PRM-COB-P3-063 | `cob.pagoOnline.enteDefault` | ref:collectionEntities | tenant | — | M07 COB |
| 2784 | VAR | F | Fecha límite para particularidades en importadores y exportadores (reglas de transición por cliente) | Importadores y exportadores de bancos y Red Link (+10) | Reemplazado | — | → versión de formato de archivo por ente con vigencia (`fileFormatVersions.validFrom/validTo`) | — | ente | — | T06 INT |
| 2789 | VAR | L | Procesar cobranzas de código de barras y QR en facturas/talones a través del Integra | CoopOnline: autorizar pagos; Integra: actualizar estado de pago | Reemplazado | — | → worker único de conciliación de pagos (`cob:conciliar-pagos`), sin Integra | — | — | — | M07 COB |
| 2994 | VAR | L | Procesar archivos de rendición de entidades a través del agente | Agente: tareas dinámicas | Migrar-ente | PRM-COB-P3-064 | `cob.ente.rendicion.importacionAutomatica` | boolean (job `cob:importar-rendiciones`) | ente | false | M07 COB |
| 2995 | VAR | E | Agente: hora en la que procesa archivo de rendición | Agente: tareas dinámicas | Migrar-ente | PRM-COB-P3-065 | `cob.ente.rendicion.horaImportacion` | time | ente | 06:00 | M07 COB |
| 3005 | VAR | L | Modificar nombre del archivo del ente luego de ser procesado | s/lectura | Reemplazado | — | → archivo guardado en almacenamiento privado con estado (`recibido/procesado/error`) e idempotencia por hash | — | — | — | M07 COB |
| 3023 | VAR | L | Importador 203: tomar como fecha de rendición la fecha de importación del archivo | Importador Banelco | Migrar-ente | PRM-COB-P3-066 | `cob.ente.banelco.fechaRendicionEsFechaImportacion` | boolean | ente (Banelco) | false | M07 COB |
| 3025 | VAR | C | Agente: mail a donde se envían errores de la importación de archivos de rendición | Agente: procesar archivo de rendición | Reemplazado | — | → alertas de job a suscriptores con capability `cob.entes.importar` (T11/T09); los correos ProCoop se migran como suscriptores | — | — | — | T11 WFL |
| 3092 | VAR | L | Permitir generar archivos para entidades con comprobantes pagados | s/lectura | Migrar-ente | PRM-COB-P3-067 | `cob.ente.exportacion.incluirComprobantesPagados` | boolean | ente | false | M07 COB |
| 3158 | VAR | C | Correos para enviar archivos de cobranzas — Tarjeta FECESCOR | s/lectura | Migrar-ente | PRM-COB-P3-068 | `cob.ente.fecescor.destinatariosArchivo` | email[] | ente (FECESCOR) | [] | M07 COB |
| 3176 | VAR | L | Mostrar en el log del resultado de importación si se generaron anticipos | s/lectura | Reemplazado | — | → el resultado de importación siempre lista los anticipos generados | — | — | — | M07 COB |

### 5.8 Débitos automáticos (4)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 63 | VAR_PMOVIL/CoopOnline | E Lista | Habilitar pagar facturas con adhesión al débito automático: no permitir; permitir siempre; permitir solo facturas con recargo de mora | s/lectura (CoopOnline) | Migrar | PRM-COB-P3-069 | `cob.debito.pagoOnlineFacturasAdheridas` | enum{noPermitir, siempre, soloConRecargoMora} | tenant | soloConRecargoMora | M07 COB (M19 POR consume) |
| 2779 | VAR | E | Débito automático Pagos360: día de vencimiento a partir del cual el débito pasa al mes siguiente (por defecto 19) | Registrar solicitudes de débito Pagos360 | Migrar-ente | PRM-COB-P3-070 | `cob.ente.pagos360.debito.diaCorteMesSiguiente` | int (1–28) | ente (Pagos360) | 19 | M07 COB |
| 2908 | VAR | C FK `TIPO_FAC` | Débitos automáticos: tipo de cuota para anticipos generados desde importación de débitos | s/lectura | Migrar | PRM-COB-P3-071 | `cob.debito.tipoCuotaAnticipos` | ref:invoiceTypes | tenant | — | M07 COB |
| 3047 | VAR | L | SIRO: permitir pago voluntario de débitos automáticos | Exportación SIRO | Migrar-ente | PRM-COB-P3-072 | `cob.ente.siro.permitirPagoVoluntarioDebitos` | boolean | ente (SIRO) | false | M07 COB |

### 5.9 Pagos360 (23)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 901 | VAR | M C | Clave de acceso al servicio de Pagos360 | Configuración Pagos360; CoopOnline (PDF de pago, solicitud) | Bóveda | PRM-INT-P3-001 | `int.pagos360.apiKey` | secretRef | ente | — (valor no transcripto) | T06 INT |
| 902 | VAR | M C | URL a redireccionar al realizar un pago exitoso en Pagos360 | Configuración; registrar solicitudes | Reemplazado | — | → URL calculada por la plataforma (`/api/public/<tenantSlug>/pagos/resultado?estado=aprobado`) | — | — | — | T06 INT |
| 903 | VAR | M C | URL a redireccionar al quedar un pago pendiente en Pagos360 | Configuración; registrar solicitudes | Reemplazado | — | → URL calculada por la plataforma (`estado=pendiente`) | — | — | — | T06 INT |
| 904 | VAR | M L/N | Acepta pago online | Configuración; CoopOnline (crear cobranza, solicitud) | Migrar-ente | PRM-COB-P3-073 | `cob.ente.pagos360.pagoOnlineHabilitado` | boolean | ente (Pagos360) | false | M07 COB |
| 905 | VAR | M L | Se puede pagar luego del vencimiento 3 | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-074 | `cob.ente.pagos360.permitirPagoPosteriorUltimoVto` | boolean | ente (Pagos360) | false — A validar (PA-CFG-P3-03) | M07 COB |
| 906 | VAR | M E | Monto mínimo para pagar online | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-075 | `cob.ente.pagos360.montoMinimo` | money | ente (Pagos360) | 0 | M07 COB |
| 907 | VAR | M C | URL a redireccionar al quedar un pago rechazado en Pagos360 | Configuración; registrar solicitudes | Reemplazado | — | → URL calculada por la plataforma (`estado=rechazado`) | — | — | — | T06 INT |
| 908 | VAR | M L | Usar primer importe luego del tercer vencimiento | Configuración; importador Pagos360 | Migrar-ente | PRM-COB-P3-076 | `cob.ente.pagos360.usarPrimerImporteTrasUltimoVto` | boolean | ente (Pagos360) | false | M07 COB |
| 909 | VAR | M C | Métodos de pago excluidos (obs: non_banking, link_pagos, banelco_pmc) | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-077 | `cob.ente.pagos360.metodosExcluidos` | string[] | ente (Pagos360) | [non_banking, link_pagos, banelco_pmc] | M07 COB |
| 914 | VAR | M E/L | Cantidad de días máximo desde el último vencimiento para pagar en web | Configuración Pagos360; generación de clave web del socio | Migrar-ente | PRM-COB-P3-078 | `cob.ente.pagos360.diasMaxDesdeUltimoVto` | int | ente (Pagos360) | 30 — A validar (PA-CFG-P3-03) | M07 COB |
| 2389 | VAR | M E | Métodos de pago disponibles en cobranza local de Pagos360 | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-079 | `cob.ente.pagos360.metodosCobranzaLocal` | string[] | ente (Pagos360) | [] (todos) | M07 COB |
| 2390 | VAR | M E | Métodos de pago disponibles en cobranza en entidad de Pagos360 | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-080 | `cob.ente.pagos360.metodosCobranzaEntidad` | string[] | ente (Pagos360) | [] (todos) | M07 COB |
| 2677 | VAR | M E | Métodos de pago disponibles en venta de prepaga | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-081 | `cob.ente.pagos360.metodosVentaPrepago` | string[] | ente (Pagos360) | [] (todos) | M07 COB |
| 2720 | VAR | M C | Cuotas excluidas de Pagos360 | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-082 | `cob.ente.pagos360.tiposCuotaExcluidos` | ref:invoiceTypes[] | ente (Pagos360) | [] | M07 COB |
| 2743 | VAR | M C | Tarjetas de crédito excluidas | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-083 | `cob.ente.pagos360.tarjetasExcluidas` | string[] | ente (Pagos360) | [] | M07 COB |
| 2747 | VAR | L | Mostrar columna Teléfono en administrador de Pagos360 | s/lectura | Reemplazado | — | → columna configurable "Teléfono" del administrador de solicitudes de pago (DataTable) | — | usuario | — | T03 UXD |
| 2981 | VAR | M L | Pagos360: obtener cobranzas vía API | Configuración Pagos360 | Migrar-ente | PRM-INT-P3-002 | `int.pagos360.obtenerCobranzasPorApi` | boolean (false = archivo de rendición) | ente (Pagos360) | true | T06 INT |
| 2999 | VAR | M E | Pagos360: concepto al generar reversión | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-084 | `cob.ente.pagos360.reversion.concepto` | ref:products | ente (Pagos360) | — (obligatorio si hay reversiones) | M07 COB |
| 3000 | VAR | M L | Pagos360: generar comprobante formal en reversión | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-085 | `cob.ente.pagos360.reversion.emitirComprobanteFormal` | boolean | ente (Pagos360) | true | M07 COB |
| 3001 | VAR | M L | Pagos360: generar una reversión por cuenta | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-086 | `cob.ente.pagos360.reversion.unaPorCuenta` | boolean | ente (Pagos360) | false | M07 COB |
| 3002 | VAR | M L | Pagos360: bloquear pago online al generar reversión | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-087 | `cob.ente.pagos360.reversion.bloquearPagoOnline` | boolean | ente (Pagos360) | true | M07 COB |
| 3059 | VAR | L | Pagos360: cobrar comisión por reversión | Cobro de comisión por reversión | Migrar-ente | PRM-COB-P3-088 | `cob.ente.pagos360.reversion.cobrarComision` | boolean | ente (Pagos360) | false | M07 COB |
| 3073 | VAR | E FK `PROD_SER` | Pagos360: concepto a cobrar por comisión de reversión | Cobro de comisión por reversión | Migrar-ente | PRM-COB-P3-089 | `cob.ente.pagos360.reversion.conceptoComision` | ref:products | ente (Pagos360) | — (obligatorio si #3059) | M07 COB |

### 5.10 SIRO (16)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2296 | VAR | C | CUIT de administrador de cobranza de Banco Roela (identifica el convenio y el nombre de archivo SIRO) | Exportación Banelco Roela, SIRO y SIRO extendido | Migrar-ente | PRM-COB-P3-090 | `cob.ente.siro.cuitAdministrador` | string (CUIT validado) | ente (SIRO / Roela) | — | M07 COB |
| 2492 | VAR | M C | Usuario de acceso al servicio de SIRO | Configuración SIRO; CoopOnline; configuración web | Bóveda | PRM-INT-P3-003 | `int.siro.botonPago.usuario` | secretRef | ente (SIRO) | — (valor no transcripto) | T06 INT |
| 2493 | VAR | M C | Clave de acceso al servicio de SIRO | Configuración SIRO; configuración web | Bóveda | PRM-INT-P3-004 | `int.siro.botonPago.clave` | secretRef | ente (SIRO) | — (valor no transcripto) | T06 INT |
| 2494 | VAR | M C | URL a redireccionar al realizar un pago exitoso en SIRO | Configuración SIRO; configuración web | Reemplazado | — | → URL calculada por la plataforma (`estado=aprobado`) | — | — | — | T06 INT |
| 2495 | VAR | M C | URL a redireccionar al quedar un pago rechazado en SIRO | Configuración SIRO; configuración web | Reemplazado | — | → URL calculada por la plataforma (`estado=rechazado`) | — | — | — | T06 INT |
| 2500 | VAR | M L | Acepta pago online SIRO | Configuración SIRO; CoopOnline (solicitud, medio de pago) (+2) | Migrar-ente | PRM-COB-P3-091 | `cob.ente.siro.pagoOnlineHabilitado` | boolean | ente (SIRO) | false | M07 COB |
| 2775 | VAR | M L | SIRO: verificar primer dígito de ID en archivo de cobranza | Configuración SIRO; obtención de pagos por API (+1) | Migrar-ente | PRM-COB-P3-092 | `cob.ente.siro.verificarPrimerDigitoId` | boolean | ente (SIRO) | false | M07 COB |
| 2776 | VAR | M E | SIRO: tiempo de retardo entre solicitudes | Configuración SIRO; obtención de pagos por API (+1) | Migrar-ente | PRM-INT-P3-005 | `int.siro.retardoEntreSolicitudesMs` | int (ms; límite de tasa del conector) | ente (SIRO) | 1000 | T06 INT |
| 2804 | VAR | M C | CUIT de acceso al servicio de SIRO — API Gestión | Configuración SIRO; obtención de pagos (+2) | Bóveda | PRM-INT-P3-006 | `int.siro.apiGestion.cuitAcceso` | secretRef | ente (SIRO) | — (valor no transcripto) | T06 INT |
| 2805 | VAR | M C | Clave de acceso al servicio de SIRO — API Gestión | Configuración SIRO; verificación de configuración (+1) | Bóveda | PRM-INT-P3-007 | `int.siro.apiGestion.clave` | secretRef | ente (SIRO) | — (valor no transcripto) | T06 INT |
| 2806 | VAR | F | Fecha de última consulta de SIRO — API Gestión | s/lectura | Reemplazado | — | → cursor de sincronización del conector (`connectorSyncState.lastCursor`), estado y no parámetro | — | — | — | T06 INT |
| 2807 | VAR | L | Utiliza el servicio de SIRO — API Gestión (base de deuda y pagos sin archivo) | Verificación de configuración; importador; exportación SIRO (+5) | Migrar-ente | PRM-INT-P3-008 | `int.siro.modoIntegracion` | enum{archivo, apiGestion} | ente (SIRO) | archivo | T06 INT |
| 2818 | VAR | L | Excluir período al generar archivo de facturación de SIRO (excluir lo ya informado) | Exportación SIRO y SIRO extendido | Migrar-ente | PRM-COB-P3-093 | `cob.ente.siro.exportacion.excluirPeriodo` | boolean | ente (SIRO) | false | M07 COB |
| 2869 | VAR | E | Código de barras SIRO: cantidad de días máximo desde el último vencimiento para pagar | Código de barras Banco Roela, Roela extendido, SIRO 0448 | Migrar-ente | PRM-COB-P3-094 | `cob.ente.siro.codigoBarras.diasMaxDesdeUltimoVto` | int | ente (SIRO) | 30 — A validar (PA-CFG-P3-03) | M07 COB |
| 3006 | VAR | E | Código de pago electrónico SIRO: cantidad de días máximo desde el último vencimiento para pagar | Exportación SIRO y SIRO extendido | Migrar-ente | PRM-COB-P3-095 | `cob.ente.siro.pagoElectronico.diasMaxDesdeUltimoVto` | int | ente (SIRO) | 30 — A validar (PA-CFG-P3-03) | M07 COB |
| 3179 | VAR | L | SIRO: registrar log de consultas realizadas a la API | Registro de log SIRO | Reemplazado | — | → log de integración de T06 (request/response sin secretos, `requestId`), siempre activo con retención configurable de plataforma | — | — | — | T06 INT |

### 5.11 Otras pasarelas: Mercado Pago, Naranja X, Macro, PayFun, Pago TIC, SiPago, Pronto Pago, Helipagos, Provincia Net (40)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2501 | VAR | C | URL endpoint de pago online | Sincronización de parámetros web | Reemplazado | — | → endpoint público de la plataforma (`/api/public/<tenantSlug>/pagos`) | — | plataforma | — | T06 INT |
| 2553 | VAR | M | Access token del servicio de Mercado Pago | Carga y guardado de configuración Mercado Pago | Bóveda | PRM-INT-P3-009 | `int.mercadoPago.accessToken` | secretRef | ente (Mercado Pago) | — (valor no transcripto) | T06 INT |
| 2554 | VAR | M | URL a redireccionar al realizar un pago exitoso en Mercado Pago | Configuración Mercado Pago | Reemplazado | — | → URL calculada por la plataforma (`estado=aprobado`) | — | — | — | T06 INT |
| 2555 | VAR | M | URL a redireccionar al quedar un pago rechazado en Mercado Pago | Configuración Mercado Pago | Reemplazado | — | → URL calculada por la plataforma (`estado=rechazado`) | — | — | — | T06 INT |
| 2579 | VAR | M | Fecha de inicio de Mercado Pago en Procoop 10 | Configuración Mercado Pago | Descartar | — | — | — | — | — | T07 MIG (motivo: marca de corte legacy; solo se usa como fecha desde la cual importar pagos históricos en la migración) |
| 3139 | VAR | M | URL para notificación de pagos de Mercado Libre / Mercado Pago | Configuración Mercado Pago | Reemplazado | — | → webhook de plataforma (`/api/public/<tenantSlug>/webhooks/<endpointKey>`) | — | — | — | T06 INT |
| 2756 | VAR | M | Client ID Naranja X | Configuración Naranja X | Bóveda | PRM-INT-P3-010 | `int.naranjaX.clientId` | secretRef | ente (Naranja X) | — (valor no transcripto) | T06 INT |
| 2757 | VAR | M | Client Secret Naranja X | Configuración Naranja X | Bóveda | PRM-INT-P3-011 | `int.naranjaX.clientSecret` | secretRef | ente (Naranja X) | — (valor no transcripto) | T06 INT |
| 2758 | VAR | M | Audience Naranja X | Configuración Naranja X | Migrar-ente | PRM-INT-P3-012 | `int.naranjaX.audience` | string | ente (Naranja X) | — | T06 INT |
| 2762 | VAR | M C | Pos_ID Naranja X (punto de venta) | Configuración; creación de solicitud (+1) | Migrar-ente | PRM-COB-P3-096 | `cob.ente.naranjaX.posId` | string | ente (Naranja X; override caja) | — | M07 COB |
| 2765 | VAR | M | Guid Macro | Configuración Macro | Bóveda | PRM-INT-P3-013 | `int.macro.guid` | secretRef | ente (Macro) | — (valor no transcripto) | T06 INT |
| 2766 | VAR | M | Frase Macro | Configuración Macro | Bóveda | PRM-INT-P3-014 | `int.macro.frase` | secretRef | ente (Macro) | — (valor no transcripto) | T06 INT |
| 2767 | VAR | M | Secret Key Macro | Configuración Macro | Bóveda | PRM-INT-P3-015 | `int.macro.secretKey` | secretRef | ente (Macro) | — (valor no transcripto) | T06 INT |
| 2768 | VAR | M | Access Token Macro | Configuración Macro | Bóveda | PRM-INT-P3-016 | `int.macro.accessToken` | secretRef | ente (Macro) | — (valor no transcripto) | T06 INT |
| 2793 | VAR | M | Api Key PayFun | Configuración PayFun | Bóveda | PRM-INT-P3-017 | `int.payFun.apiKey` | secretRef | ente (PayFun) | — (valor no transcripto) | T06 INT |
| 2794 | VAR | M | Access Token PayFun | Configuración PayFun | Bóveda | PRM-INT-P3-018 | `int.payFun.accessToken` | secretRef | ente (PayFun) | — (valor no transcripto) | T06 INT |
| 2795 | VAR | M C | URL a redireccionar al salir de la página de PayFun | Configuración; generar solicitud | Reemplazado | — | → URL calculada por la plataforma (`estado=cancelado`) | — | — | — | T06 INT |
| 2796 | VAR | M C | URL de notificación de pagos (PayFun) | Configuración; generar solicitud | Reemplazado | — | → webhook de plataforma (`/api/public/<tenantSlug>/webhooks/<endpointKey>`) | — | — | — | T06 INT |
| 2816 | VAR | M | Medios de pago PayFun | Configuración PayFun | Migrar-ente | PRM-COB-P3-097 | `cob.ente.payFun.mediosPago` | string[] | ente (PayFun) | [] (todos) | M07 COB |
| 2820 | VAR | M | Informar deuda total PayFun | Configuración PayFun | Migrar-ente | PRM-COB-P3-098 | `cob.ente.payFun.informarDeudaTotal` | boolean | ente (PayFun) | false | M07 COB |
| 2822 | VAR | M | Importe mínimo aceptado por PayFun con Pago Fácil como medio de pago | Configuración PayFun | Migrar-ente | PRM-COB-P3-099 | `cob.ente.payFun.importeMinimoPagoFacil` | money | ente (PayFun) | 0 | M07 COB |
| 2877 | VAR | M | username Pago TIC | Configuración Pago TIC | Bóveda | PRM-INT-P3-019 | `int.pagoTic.username` | secretRef | ente (Pago TIC) | — (valor no transcripto) | T06 INT |
| 2878 | VAR | M | password Pago TIC | Configuración Pago TIC | Bóveda | PRM-INT-P3-020 | `int.pagoTic.password` | secretRef | ente (Pago TIC) | — (valor no transcripto) | T06 INT |
| 2879 | VAR | M | client id Pago TIC | Configuración Pago TIC | Bóveda | PRM-INT-P3-021 | `int.pagoTic.clientId` | secretRef | ente (Pago TIC) | — (valor no transcripto) | T06 INT |
| 2880 | VAR | M | client_secret Pago TIC | Configuración Pago TIC | Bóveda | PRM-INT-P3-022 | `int.pagoTic.clientSecret` | secretRef | ente (Pago TIC) | — (valor no transcripto) | T06 INT |
| 2881 | VAR | M C | URL a redireccionar al salir de la página de Pago TIC | Configuración; crear solicitud | Reemplazado | — | → URL calculada por la plataforma (`estado=cancelado`) | — | — | — | T06 INT |
| 2882 | VAR | M C | URL de notificación de pagos de Pago TIC | Configuración; crear solicitud | Reemplazado | — | → webhook de plataforma (`/api/public/<tenantSlug>/webhooks/<endpointKey>`) | — | — | — | T06 INT |
| 2883 | VAR | M C | URL al volver de la página de Pago TIC | Crear solicitud | Reemplazado | — | → URL calculada por la plataforma (`estado=retorno`) | — | — | — | T06 INT |
| 2956 | VAR | M C | client_id SiPago | Configuración SiPago | Bóveda | PRM-INT-P3-023 | `int.siPago.clientId` | secretRef | ente (SiPago) | — (valor no transcripto) | T06 INT |
| 2957 | VAR | M C | client_secret SiPago | Configuración SiPago | Bóveda | PRM-INT-P3-024 | `int.siPago.clientSecret` | secretRef | ente (SiPago) | — (valor no transcripto) | T06 INT |
| 2958 | VAR | M C | URL a redireccionar al realizar un pago exitoso en SiPago | Configuración SiPago | Reemplazado | — | → URL calculada por la plataforma (`estado=aprobado`) | — | — | — | T06 INT |
| 2959 | VAR | M C | URL a redireccionar al quedar un pago rechazado en SiPago | Configuración SiPago | Reemplazado | — | → URL calculada por la plataforma (`estado=rechazado`) | — | — | — | T06 INT |
| 2960 | VAR | M C | URL de webhook SiPago | Configuración SiPago | Reemplazado | — | → webhook de plataforma (`/api/public/<tenantSlug>/webhooks/<endpointKey>`) | — | — | — | T06 INT |
| 2969 | VAR | M C | Pronto Pago: public key | Configuración Pronto Pago | Bóveda | PRM-INT-P3-025 | `int.prontoPago.publicKey` | secretRef | ente (Pronto Pago) | — (valor no transcripto) | T06 INT |
| 2970 | VAR | M C | Pronto Pago: private key | Configuración Pronto Pago | Bóveda | PRM-INT-P3-026 | `int.prontoPago.privateKey` | secretRef | ente (Pronto Pago) | — (valor no transcripto) | T06 INT |
| 2971 | VAR | M C | Pronto Pago: servicio | Configuración Pronto Pago | Migrar-ente | PRM-COB-P3-100 | `cob.ente.prontoPago.servicio` | string | ente (Pronto Pago) | — | M07 COB |
| 3077 | VAR | M C | Helipagos: API key | Configuración Helipagos | Bóveda | PRM-INT-P3-027 | `int.helipagos.apiKey` | secretRef | ente (Helipagos) | — (valor no transcripto) | T06 INT |
| 3078 | VAR | M C | Helipagos: URL éxito | Configuración; registrar solicitudes | Reemplazado | — | → URL calculada por la plataforma (`estado=aprobado`) | — | — | — | T06 INT |
| 3079 | VAR | M C | Helipagos: URL notificación | Configuración; registrar solicitudes | Reemplazado | — | → webhook de plataforma (`/api/public/<tenantSlug>/webhooks/<endpointKey>`) | — | — | — | T06 INT |
| 3046 | VAR | M C | Provincia Net: API key | Configuración Provincia Net | Bóveda | PRM-INT-P3-028 | `int.provinciaNet.apiKey` | secretRef | ente (Provincia Net) | — (valor no transcripto) | T06 INT |

### 5.12 Cobro con QR (20)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2726 | VAR | M L | Generar QR de Pagos360 | Configuración; verificación de configuración (+3) | Migrar-ente | PRM-COB-P3-101 | `cob.ente.pagos360.qr.habilitado` | boolean | ente (Pagos360) | false | M07 COB |
| 2727 | VAR | M C | Id QR Pagos360 | Configuración; verificación de configuración (+2) | Migrar-ente | PRM-COB-P3-102 | `cob.ente.pagos360.qr.id` | string | ente (Pagos360) | — | M07 COB |
| 2759 | VAR | C | QR Pagos360: nombre de la cooperativa | QR de pago online; código de barras QR Pagos360 | Migrar-ente | PRM-COB-P3-103 | `cob.ente.pagos360.qr.nombreComercio` | string (máx. 25, EMVCo) | ente (Pagos360) | nombre de fantasía del tenant | M07 COB |
| 2760 | VAR | C | QR Pagos360: código postal | QR estático; QR de pago online; registrar solicitudes (+2) | Migrar-ente | PRM-COB-P3-104 | `cob.ente.pagos360.qr.codigoPostal` | string | ente (Pagos360) | CP del domicilio fiscal del tenant | M07 COB |
| 2761 | VAR | C | QR Pagos360: localidad | QR estático; QR de pago online; datos QR (+1) | Migrar-ente | PRM-COB-P3-105 | `cob.ente.pagos360.qr.localidad` | string | ente (Pagos360) | localidad del domicilio fiscal del tenant | M07 COB |
| 2772 | VAR | L | Permitir pago con QR en cobranza local | s/lectura | Migrar | PRM-COB-P3-106 | `cob.caja.permitirPagoQr` | boolean | tenant (override caja) | false | M07 COB |
| 2773 | VAR | C | QR Pagos360: MCC (código de categoría de comercio) | QR de pago online; código de barras QR Pagos360 | Migrar-ente | PRM-COB-P3-107 | `cob.ente.pagos360.qr.mcc` | string (4 dígitos) | ente (Pagos360) | 4900 (servicios públicos) | M07 COB |
| 2798 | VAR | C | QR SIRO: CUIT del titular de la cuenta | Datos QR SIRO | Migrar-ente | PRM-COB-P3-108 | `cob.ente.siro.qr.cuitTitularCuenta` | string (CUIT validado) | ente (SIRO) | CUIT del tenant | M07 COB |
| 2799 | VAR | C | QR SIRO: CBU del convenio | Datos QR SIRO | Migrar-ente | PRM-COB-P3-109 | `cob.ente.siro.qr.cbuConvenio` | string (22 dígitos, validado; enmascarado en pantalla) | ente (SIRO) | — | M07 COB |
| 2800 | VAR | C | QR SIRO: nombre de convenio | Datos QR SIRO | Migrar-ente | PRM-COB-P3-110 | `cob.ente.siro.qr.nombreConvenio` | string | ente (SIRO) | — | M07 COB |
| 2801 | VAR | C | QR SIRO: provincia del ente asociado al convenio | Datos QR SIRO | Migrar-ente | PRM-COB-P3-111 | `cob.ente.siro.qr.provincia` | ref:provinces | ente (SIRO) | provincia del tenant | M07 COB |
| 2802 | VAR | C | QR SIRO: código postal del ente asociado al convenio | Datos QR SIRO | Migrar-ente | PRM-COB-P3-112 | `cob.ente.siro.qr.codigoPostal` | string | ente (SIRO) | CP del tenant | M07 COB |
| 2885 | VAR | L | Utilizar QR de Naranja X en facturas | s/lectura | Migrar-ente | PRM-COB-P3-113 | `cob.ente.naranjaX.qrEnFacturas` | boolean | ente (Naranja X) | false | M07 COB (M05 FAC imprime) |
| 2920 | VAR | M L | Pagos360: utiliza QR estático | Propiedades de caja (QR estático); configuración (+1) | Migrar-ente | PRM-COB-P3-114 | `cob.ente.pagos360.qr.estatico` | boolean | ente (Pagos360; override caja) | false | M07 COB |
| 2921 | VAR | M C | Pagos360: URL del QR estático | Configuración Pagos360 | Migrar-ente | PRM-COB-P3-115 | `cob.ente.pagos360.qr.estaticoUrl` | url (provista por Pagos360) | ente (Pagos360; override caja) | — | M07 COB |
| 2922 | VAR | M C | Pagos360: API key del QR estático | Configuración Pagos360 | Bóveda | PRM-INT-P3-029 | `int.pagos360.qrEstatico.apiKey` | secretRef | ente (Pagos360) | — (valor no transcripto) | T06 INT |
| 2939 | VAR | M L | SIRO: utiliza QR estático | Propiedades de caja (QR estático); configuración SIRO (+1) | Migrar-ente | PRM-COB-P3-116 | `cob.ente.siro.qr.estatico` | boolean | ente (SIRO; override caja) | false | M07 COB |
| 2975 | VAR | C | QR SIRO: MCC | Datos QR SIRO | Migrar-ente | PRM-COB-P3-117 | `cob.ente.siro.qr.mcc` | string (4 dígitos) | ente (SIRO) | 4900 | M07 COB |
| 3144 | VAR | E | QR SIRO: cantidad de días máximo desde el último vencimiento para pagar | Generación del string QR SIRO | Migrar-ente | PRM-COB-P3-118 | `cob.ente.siro.qr.diasMaxDesdeUltimoVto` | int | ente (SIRO) | 30 — A validar (PA-CFG-P3-03) | M07 COB |
| 3199 | VAR | E | Provincia Net QR: cantidad de días máximo desde el último vencimiento para pagar | Generación de lote QR Provincia Net | Migrar-ente | PRM-COB-P3-119 | `cob.ente.provinciaNet.qr.diasMaxDesdeUltimoVto` | int | ente (Provincia Net) | 30 — A validar (PA-CFG-P3-03) | M07 COB |

### 5.13 Retenciones (0)

El módulo COBRANZA de ProCoop no declara parámetros de retenciones sufridas en caja. Las variables relacionadas (#2952 "presentar retenciones al cerrar la caja", citada en RN-05 §10) pertenecen a otros módulos y se tratan en las partes 1 y 2 del catálogo. El medio de pago "retenciones" queda cubierto por el enum de PRM-COB-P3-005.

### 5.14 Reportes (1)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2951 | VAR | L | Excluir registros en 0 en el informe Planilla de caja | Filtro del informe Planilla de caja | Reemplazado | — | → filtro "Excluir importes en cero" del reporte Planilla de caja, con valor por defecto guardable en vista | — | usuario | — | T10 BIA |

### 5.15 Terminal de autogestión, venta de prepago y cobranza remota (30)

La "Autogestión" de ProCoop es la terminal física (ATM/kiosco con lector de billetes e impresora) operada por el agente de hardware local (O10); su configuración queda en M19 POR con ámbito terminal. La venta de prepago (energía/agua prepaga) es de M03 MED.

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 714 | VAR | L | Activar opciones de cobranza remota | s/lectura | Migrar | PRM-COB-P3-120 | `cob.remota.habilitada` | boolean | tenant | false | M07 COB |
| 715 | VAR | C | Cajas utilizadas para cobranza remota | s/lectura | Reemplazado | — | → atributo de la caja `cashRegisters.kind = remota` | — | caja | — | M07 COB |
| 716 | VAR | N | Importe máximo a cobrar por factura en cobranza remota | s/lectura | Migrar | PRM-COB-P3-121 | `cob.remota.importeMaximoPorFactura` | money (0 = sin tope) | tenant (override caja) | 0 | M07 COB |
| 717 | VAR | L | Solo permitir cobranza en efectivo en cobranza remota | s/lectura | Migrar | PRM-COB-P3-122 | `cob.remota.soloEfectivo` | boolean | tenant (override caja) | true | M07 COB |
| 718 | VAR | N | Importe de recargo a cobrar por cobranza remota (comisión) | Variables de consulta | Migrar | PRM-COB-P3-123 | `cob.remota.recargoImporte` | money versionado | tenant | 0 | M07 COB |
| 719 | VAR | E FK `PROD_SER` | Concepto a adicionar por cobranza remota | Variables de consulta; validación; registración de intereses | Migrar | PRM-COB-P3-124 | `cob.remota.conceptoRecargo` | ref:products | tenant | — (obligatorio si #718 > 0) | M07 COB |
| 2357 | VAR | E | Tiempo de espera por billete en Autogestión | Lector de billetes: obtener billetes | Migrar | PRM-POR-P3-001 | `por.terminal.lectorBilletes.esperaSegundos` | int | terminal | 30 | M19 POR |
| 2361 | VAR | L | Imprimir automáticamente factura de prepaga | s/lectura | Migrar | PRM-MED-P3-001 | `med.prepago.imprimirFacturaAutomatica` | boolean | tenant (override terminal) | true | M03 MED |
| 2371 | VAR | L | No permitir venta de prepaga al no poseer un medidor prepago configurado | Integra: info de cobranza prepaga; consulta de titulares | Migrar-servicio | PRM-MED-P3-002 | `med.prepago.exigirMedidorPrepagoConfigurado` | boolean | servicio (default tenant) | true | M03 MED |
| 2391 | VAR | L | Permitir venta de prepaga en Autogestión | s/lectura | Migrar | PRM-POR-P3-002 | `por.terminal.ventaPrepagoHabilitada` | boolean | tenant (override terminal) | false | M19 POR |
| 2392 | VAR | L | Permitir cobranza de facturas en Autogestión | s/lectura | Migrar | PRM-POR-P3-003 | `por.terminal.cobranzaFacturasHabilitada` | boolean | tenant (override terminal) | true | M19 POR |
| 2412 | VAR | E FK `TIPO_FAC` | Autogestión: tipo de cuota para anticipos generados desde cobranza | s/lectura | Migrar | PRM-POR-P3-004 | `por.terminal.tipoCuotaAnticipos` | ref:invoiceTypes | tenant | — | M19 POR |
| 2489 | VAR | E FK `USERS` | Usuario para registración de venta de prepaga y cobranza CoopOnline (obs: debe tener caja asignada) | CoopOnline: validar configuración; informe de facturas | Reemplazado | — | → usuario técnico del canal + caja virtual del canal (`cashRegisters.kind = virtual`, una por canal: portal, app, terminal) | — | — | — | M07 COB |
| 2499 | VAR | C | Mail copia para la notificación de venta de prepaga (CoopOnline) | CoopOnline: autorizar prepaga y cobranza | Migrar | PRM-MED-P3-003 | `med.prepago.notificacion.emailsCopia` | email[] | tenant | [] | M03 MED |
| 2567 | VAR | L | Autogestión: preguntar si permite venta en efectivo al iniciar | s/lectura | Migrar | PRM-POR-P3-005 | `por.terminal.preguntarVentaEfectivoAlIniciar` | boolean | terminal | false | M19 POR |
| 2574 | VAR | L | Autogestión: permitir buscar cuenta y titular por código QR | s/lectura | Migrar | PRM-POR-P3-006 | `por.terminal.buscarPorQr` | boolean | tenant (override terminal) | true | M19 POR |
| 2577 | VAR | L | Autogestión: permitir utilizar créditos pendientes | s/lectura | Migrar | PRM-POR-P3-007 | `por.terminal.usarCreditosPendientes` | boolean | tenant | false | M19 POR |
| 2594 | VAR | L | Validar medidores de DISCAR antes de hacer ventas en app y Autogestión | Telemedición Discar: validar preventa | Migrar-ente | PRM-MED-P3-004 | `med.prepago.discar.validarMedidorAntesDeVenta` | boolean | conector (Discar) | true | M03 MED (con T06 INT) |
| 2613 | VAR | L | Autogestión: no habilitar preview de facturas | s/lectura | Migrar (lógica invertida) | PRM-POR-P3-008 | `por.terminal.previewFacturas` | boolean | terminal | true | M19 POR |
| 2614 | VAR | L | Autogestión: habilitar impresión de facturas | Vista previa de impresión | Migrar | PRM-POR-P3-009 | `por.terminal.impresionFacturas` | boolean | terminal | false | M19 POR |
| 2615 | VAR | C | Autogestión: impresora para impresión de facturas | Botón imprimir de vista previa | Migrar | PRM-POR-P3-010 | `por.terminal.impresora` | string (nombre lógico expuesto por el agente local) | terminal | — | M19 POR |
| 2703 | VAR | M C/E/L | Utilizar cuadro en venta de prepaga | Datos de facturación: configuración prepaga | Migrar-servicio | PRM-MED-P3-005 | `med.prepago.cuadroTarifario` | ref:tariffSchedules | servicio | — | M03 MED (con M04 TAR) |
| 2752 | VAR | L | No registrar ventas de prepaga con Procoop Integra (obs: si está activa, se marcan como pagos y las registra el agente) | CoopOnline: autorizar prepaga | Reemplazado | — | → registración única por worker (`med:registrar-venta-prepago`), sin Integra ni agente | — | — | — | M03 MED |
| 2865 | VAR | L | Autogestión: no tomar créditos de anticipos automáticamente | s/lectura | Migrar | PRM-POR-P3-011 | `por.terminal.noAplicarAnticiposAutomaticamente` | boolean | tenant | false | M19 POR |
| 2911 | VAR | L | ATM: botón consulta/impresión de facturas | s/lectura | Migrar | PRM-POR-P3-012 | `por.terminal.botonConsultaImpresionFacturas` | boolean | terminal | true | M19 POR |
| 2912 | VAR | L | Mostrar calculadora ampliada para DNI y código de seguridad en cobranza Autogestión | s/lectura | Migrar | PRM-POR-P3-013 | `por.terminal.tecladoAmpliadoDniCodigo` | boolean (accesibilidad) | terminal | false | M19 POR |
| 2940 | VAR | L | Ocultar deuda vencida en venta de prepaga | s/lectura | Migrar | PRM-MED-P3-006 | `med.prepago.ocultarDeudaVencidaEnVenta` | boolean | tenant | false | M03 MED |
| 2980 | VAR | L | Ocultar botones informativos en Autogestión | s/lectura | Migrar | PRM-POR-P3-014 | `por.terminal.ocultarBotonesInformativos` | boolean | terminal | false | M19 POR |
| 3102 | VAR | L | Autogestión: no mostrar comprobantes bloqueados | s/lectura | Migrar | PRM-POR-P3-015 | `por.terminal.ocultarComprobantesBloqueados` | boolean | tenant | true | M19 POR |
| 3109 | VAR | L | Permitir venta de prepaga por 0 pesos | Validar comprobante prepaga; facturación masiva; ítems de servicio medido | Migrar | PRM-MED-P3-007 | `med.prepago.permitirVentaImporteCero` | boolean | tenant (override servicio) | false | M03 MED |

### 5.16 Pago a proveedores desde la caja (4)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 207 | VAR | L | NO controlar disponibilidad de efectivo en pagos a proveedores | s/lectura | Migrar (lógica invertida) | PRM-TES-P3-003 | `tes.caja.pagoProveedor.controlarEfectivoDisponible` | boolean | tenant | true | M14 TES |
| 2362 | VAR | L | Firmar y marcar como entregadas automáticamente las órdenes de pago pagadas por caja | Registrar pago a proveedor | Migrar | PRM-TES-P3-004 | `tes.caja.pagoProveedor.firmarYEntregarOPAutomatico` | boolean | tenant | false | M14 TES |
| 2513 | VAR | E Lista | Modo de selección de pago a proveedores en caja: seleccionar proveedor, seleccionar comprobante (obs: Seleccionar Proveedor) | s/lectura (pantalla) | Reemplazado | — | → la pantalla ofrece ambos modos (pestañas "Por proveedor" / "Por orden de pago"), con preferencia de usuario | — | usuario | — | M14 TES |
| 2988 | VAR | L | Filtrar órdenes de pago firmadas en caja en efectivo (solo las que tienen todas las firmas obligatorias) | Pagos a proveedores en caja | Migrar | PRM-TES-P3-005 | `tes.caja.pagoProveedor.soloOPConFirmasCompletas` | boolean | tenant | true | M14 TES |

### 5.17 Otros (10)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2394 | VAR | L | No permitir anular operaciones de cobranza generadas por otro usuario | s/lectura | Reemplazado | — | → capability `cob.operaciones.anularAjenas` (separada de `cob.operaciones.anular`) | — | — | — | T02 IAM |
| 2508 | VAR | E Lista | Metodología de planes de vivienda: estándar, Las Varillas (obs: Estándar) — `COD_MOD` mal asignado a COBRANZA | Info del plan de vivienda | Migrar-servicio | PRM-SOC-P3-001 | `soc.vivienda.metodologia` | enum{estandar, lasVarillas} | servicio (vivienda) | estandar | M18 SOC |
| 2593 | VAR | E | Días por defecto para el vencimiento de las facturas con presupuestos en PMovil — `COD_MOD` mal asignado | PMovil: guardar comprobante de venta | Migrar | PRM-VEN-P3-001 | `ven.presupuesto.diasVencimientoFacturaMovil` | int | tenant | 10 | M11 VEN |
| 2597 | VAR | E | Cantidad de decimales en cantidad y precio del producto (aplica al agregar/modificar ítems de factura o remito) | s/lectura | Reemplazado | — | → precisión por concepto (AGR-011): `products.quantityScale` / `priceScale` (hasta 6 decimales en precio unitario) | — | concepto | — | M04 TAR |
| 2662 | VAR | L | Abrir el formulario de ND/NC bancaria al aceptar la cobranza por terceros | s/lectura | Reemplazado | — | → la conciliación de rendiciones propone automáticamente la ND/NC bancaria por comisiones y diferencias (M14) | — | — | — | M14 TES |
| 2664 | VAR | L | Enviar notificación de cobranzas en venta de prepaga | Registración del pago | Migrar | PRM-COB-P3-125 | `cob.notificacionPago.ventaPrepago` | boolean | tenant | false | M07 COB (envía T09 COM) |
| 2665 | VAR | L | Enviar notificación al realizar cobranzas de facturas | Registración del pago | Migrar | PRM-COB-P3-126 | `cob.notificacionPago.facturas` | boolean | tenant | false | M07 COB (envía T09 COM) |
| 2666 | VAR | C | URL del WebService configurado en la red interna | Integra: envío de notificación | Plataforma | PRM-PLA-P3-001 | `pla.mensajeria.endpointInterno` | url (gestionada por plataforma, no editable por tenant) | plataforma | — | T01 PLA |
| 2674 | VAR | E Lista | Tipo de envío de notificación en cobranzas (enum `TipoEnvioNotificacion_Cobranza`, default Ninguna) | Datos de empresa; registración del pago; ticket de pago Integra (+1) | Migrar | PRM-COM-P3-001 | `com.notificacionPago.canal` | enum{ninguna, email, sms, whatsapp, push} (respeta preferencias del socio) | tenant | ninguna | T09 COM |
| 3052 | VAR | N | Reversiones: porcentaje de interés diario a cobrar entre la fecha de pago y la fecha de reversión | s/lectura | Migrar | PRM-COB-P3-127 | `cob.reversion.interesDiario` | decimal(%) versionado | tenant | 0 | M07 COB |

## 6. Módulo GESTION_DE_MORA (23 parámetros)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 39 | VAR | L | Ignorar notificaciones previas al incluir una cuenta al proceso de gestión de mora | Filtros de circulares | Migrar | PRM-MOR-P3-027 | `mor.candidatos.ignorarNotificacionesPrevias` | boolean | tenant | false | M08 MOR |
| 53 | VAR | L | Avisar si cambió la composición de la deuda notificada | Validar notificaciones | Migrar | PRM-MOR-P3-028 | `mor.notificacion.avisarCambioComposicionDeuda` | boolean | tenant | true | M08 MOR |
| 104 | VAR | E | Meses para prescripción de deuda | Filtro del informe de prescripción | Migrar | PRM-MOR-P3-029 | `mor.prescripcion.meses` | int | tenant (override servicio) | 24 para facturas periódicas de servicios; 60 para el resto (DEC-052; se materializa en `prescriptionRules` de M08) | M08 MOR |
| 295 | VAR | E FK `PROD_SER` | Concepto por cobranza de envío de notificación | Guardar notificaciones; guardar comprobante | Migrar | PRM-MOR-P3-030 | `mor.notificacion.conceptoCostoEnvio` | ref:products | tenant | — (obligatorio si #296 > 0) | M08 MOR |
| 296 | VAR | N | Costo de envío de notificación | Guardar notificaciones; guardar comprobante | Migrar | PRM-MOR-P3-031 | `mor.notificacion.costoEnvio` | money versionado | tenant (override tipo de notificación) | 0 | M08 MOR |
| 384 | VAR | L | Ignorar si ya está en lista de candidatos | Filtros de circulares | Migrar | PRM-MOR-P3-032 | `mor.candidatos.ignorarSiYaEsCandidato` | boolean | tenant | false | M08 MOR |
| 2202 | VAR | E FK `INSTANCI` | Instancia inicial por defecto de los candidatos | Notificaciones; informes de notificaciones pendientes (+3) | Migrar-servicio | PRM-MOR-P3-033 | `mor.instancias.inicialCandidatos` | ref:moraInstances | servicio (default tenant) | primera instancia del circuito | M08 MOR |
| 2203 | VAR | E FK `INSTANCI` | Instancia inicial por defecto de la gestión de mora (sensible) | Exportación Excel ERSeP DNU 311/2020 | Migrar-servicio | PRM-MOR-P3-034 | `mor.instancias.inicialGestion` | ref:moraInstances | servicio (default tenant) | — | M08 MOR |
| 2204 | VAR | E FK `INSTANCI` | Instancia final por defecto de la gestión de mora (corte) | Exportación Excel ERSeP DNU 311/2020 | Migrar-servicio | PRM-MOR-P3-035 | `mor.instancias.finalCorte` | ref:moraInstances | servicio (default tenant) | — | M08 MOR |
| 2205 | VAR | E | Días para el vencimiento de notificaciones entregadas (desde la entrega) | Registrar entrega | Migrar-servicio | PRM-MOR-P3-036 | `mor.notificacion.diasVencimientoDesdeEntrega` | int | servicio (default tenant) | 10 (no menor que el plazo regulatorio del servicio) | M08 MOR |
| 2279 | VAR | L | Generar todas las notificaciones como entregadas | s/lectura | Migrar | PRM-MOR-P3-037 | `mor.notificacion.generarComoEntregadas` | boolean | tenant (override tipo de notificación) | false | M08 MOR |
| 2304 | VAR | L | Generar comprobante de deuda por notificación por defecto | s/lectura | Migrar | PRM-MOR-P3-038 | `mor.notificacion.generarComprobanteDeuda` | boolean | tenant | false | M08 MOR |
| 2305 | VAR | E FK `TIPO_FAC` | Tipo de cuota por defecto para comprobante de deuda notificada | s/lectura | Migrar | PRM-MOR-P3-039 | `mor.notificacion.tipoCuotaComprobanteDeuda` | ref:invoiceTypes | tenant | — (obligatorio si #2304) | M08 MOR |
| 2306 | VAR | L | Incluir titulares dados de baja en el informe de circulares por defecto | s/lectura | Reemplazado | — | → filtro "Incluir bajas" del informe de circulares con default en vista guardada | — | usuario | — | T10 BIA |
| 2322 | VAR | L | Incluir resumen de las notificaciones | s/lectura | Migrar | PRM-MOR-P3-040 | `mor.notificacion.incluirResumen` | boolean | tenant | true | M08 MOR |
| 2327 | VAR | L | Descartar cuentas sin email al generar circulares por correo electrónico | s/lectura | Migrar (mejorado) | PRM-MOR-P3-041 | `mor.notificacion.email.siCuentaSinEmail` | enum{descartar, fallbackPapel} | tenant | fallbackPapel | M08 MOR (con T09 COM) |
| 2328 | VAR | L | Imprimir informe de excepción por mora al confirmar alta | s/lectura | Reemplazado | — | → constancia de excepción generada en PDF y adjunta al expediente de la cuenta (T11) | — | — | — | T11 WFL |
| 2359 | VAR | L | Ignorar valores nulos en la variable de plantilla Info. Servicio | Plantillas: info de servicio formateada | Reemplazado | — | → motor de plantillas con manejo explícito de nulos (las líneas vacías se omiten siempre) | — | — | — | T09 COM |
| 2379 | VAR | L | Asignar estado "En Técnica" a las notificaciones procesadas en tratamiento de morosos | s/lectura | Reemplazado | — | → transición automática a `enTecnica` del workflow de corte al emitir la OT | — | — | — | M08 MOR |
| 2458 | VAR | L | Bloquear caja al momento de realizar OT de cambio de estado | s/lectura | Migrar [VERIFICAR] | PRM-MOR-P3-042 | `mor.corte.bloquearCobroConOTCambioEstadoEnCurso` | boolean | tenant | false | M08 MOR |
| 2467 | VAR | L | Solo verificar instancia inicial al chequear candidatos ya notificados | Morosos existentes | Migrar | PRM-MOR-P3-043 | `mor.candidatos.soloVerificarInstanciaInicial` | boolean | tenant | false | M08 MOR |
| 2919 | VAR | L | Permitir introducir fecha de vencimiento de notificación anterior al día de hoy | s/lectura | Reemplazado | — | → capability `mor.notificaciones.fechaVencimientoRetroactiva` (auditada) | — | — | — | T02 IAM |
| 3050 | VAR | L | Excluir si ya está en lista de candidatos con el mismo tipo de notificación | Filtros de circulares | Migrar | PRM-MOR-P3-044 | `mor.candidatos.excluirMismoTipoNotificacion` | boolean | tenant | true | M08 MOR |

## 7. Módulo FINANCIACIONES (21 parámetros)
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 214 | VAR | E FK `PLANTILLA` | Texto para convenio con garante | Recibo/convenio (`GetRecCon`) | Migrar | PRM-MOR-P3-045 | `mor.convenio.plantillaConGarante` | ref:documentTemplates | tenant (override plan) | plantilla estándar "Convenio con garante" | M08 MOR |
| 306 | VAR | E Lista | Forma de registración de cuotas de financiación: pago con chequera, pago en factura mensual | s/lectura (pantallas) | Migrar | PRM-MOR-P3-046 | `mor.financiacion.formaRegistroCuotas` | enum{chequera, facturaMensual} | tenant (override plan) | facturaMensual | M08 MOR |
| 307 | VAR | E FK `PROD_SER` | Concepto para interés por mora (de cuotas de financiación) | Variables de consulta; comprobante y factura de cuota (+4) | Migrar | PRM-MOR-P3-047 | `mor.financiacion.conceptoInteresMora` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 308 | VAR | E FK `PROD_SER` | Concepto para cuota en factura mensual (con alícuota 4 la cuota se factura exenta) | Distribuir interés e IVA en cuotas; informe de cuotas adeudadas (+4) | Migrar | PRM-MOR-P3-048 | `mor.financiacion.conceptoCuotaFacturaMensual` | ref:products | tenant | — (obligatorio si #306 = facturaMensual) | M08 MOR |
| 310 | VAR | E FK `PROD_SER` | Concepto para deuda de financiación (capital) | Comprobante; factura de cuota; cierre diario contable (+1) | Migrar | PRM-MOR-P3-049 | `mor.financiacion.conceptoCapital` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 311 | VAR | E FK `PROD_SER` | Concepto para interés anterior | Comprobante; factura de cuota; cuotas con situación de IVA distinta (+2) | Migrar | PRM-MOR-P3-050 | `mor.financiacion.conceptoInteresAnterior` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 507 | VAR | E FK `PLANTILLA` | Texto para convenio sin garante | Recibo/convenio (`GetRecCon`) | Migrar | PRM-MOR-P3-051 | `mor.convenio.plantillaSinGarante` | ref:documentTemplates | tenant (override plan) | plantilla estándar "Convenio sin garante" | M08 MOR |
| 607 | VAR | E FK `PROD_SER` | Concepto para interés por financiación | Caída de cuotas; factura de cuota; cuotas con IVA distinto (+1) | Migrar | PRM-MOR-P3-052 | `mor.financiacion.conceptoInteresFinanciacion` | ref:products | tenant | — (obligatorio) | M08 MOR |
| 671 | VAR | E | Máxima cantidad de convenios en un período | s/lectura (pantallas) | Migrar | PRM-MOR-P3-053 | `mor.convenio.maxPorPeriodo` | int (0 = sin límite) | tenant (override plan) | 0 | M08 MOR |
| 672 | VAR | E | Mínima cantidad de comprobantes a financiar | s/lectura (pantallas) | Migrar | PRM-MOR-P3-054 | `mor.financiacion.minComprobantes` | int | tenant (override plan) | 1 | M08 MOR |
| 673 | VAR | N | Importe mínimo de cada cuota financiada | s/lectura (pantallas) | Migrar | PRM-MOR-P3-055 | `mor.financiacion.importeMinimoCuota` | money | tenant (override plan) | 0 | M08 MOR |
| 674 | VAR | F | Período de control de convenios (desde) | Convenios en período | Reemplazado | PRM-MOR-P3-056 | → `mor.convenio.ventanaControlMeses` (ventana móvil que reemplaza las fechas fijas #674/#675) | int | tenant (override plan) | 12 — A validar (PA-CFG-P3-02) | M08 MOR |
| 675 | VAR | F | Período de control de convenios (hasta) | Convenios en período | Reemplazado | PRM-MOR-P3-056 | → `mor.convenio.ventanaControlMeses` (consolidado con #674) | int | tenant (override plan) | 12 — A validar (PA-CFG-P3-02) | M08 MOR |
| 676 | VAR | E FK `PROD_SER` | Concepto para sellado de convenio | Agregar sellado; factura de cuota; guardado de comprobante de venta | Migrar | PRM-MOR-P3-057 | `mor.convenio.conceptoSellado` | ref:products (impuesto de sellos, M06) | tenant | — (obligatorio si la jurisdicción grava convenios) | M08 MOR (con M06 FIS) |
| 735 | VAR | L | No permitir que una cuenta tenga más de una financiación activa del mismo tipo | s/lectura | Migrar | PRM-MOR-P3-058 | `mor.financiacion.unaActivaPorTipo` | boolean | tenant | true | M08 MOR |
| 1030 | VAR | L | Permite al operador cambiar el interés (manual) en financiación de deuda desde caja | Propiedades de caja: financiación de deuda | Reemplazado | — | → capability `mor.financiacion.modificarInteres` con tope configurable en el plan de financiación | — | — | — | T02 IAM |
| 2208 | VAR | E | Máxima cantidad de comprobantes a financiar | s/lectura (pantallas) | Migrar | PRM-MOR-P3-059 | `mor.financiacion.maxComprobantes` | int (0 = sin límite) | tenant (override plan) | 0 | M08 MOR |
| 2252 | VAR | L | Imprimir automáticamente el convenio al generar la financiación | s/lectura (pantallas) | Migrar | PRM-MOR-P3-060 | `mor.convenio.imprimirAlGenerar` | boolean (el PDF se genera y adjunta siempre) | tenant (override usuario) | false | M08 MOR |
| 2299 | VAR | L | Permitir modificar la forma de registración de cuotas de financiación | s/lectura (pantallas) | Reemplazado | — | → capability `mor.financiacion.cambiarFormaRegistro` | — | — | — | T02 IAM |
| 2471 | VAR | E FK `TIPO_FAC` | Tipo de cuota por defecto para emitir financiación | Cuota por defecto | Migrar | PRM-MOR-P3-061 | `mor.financiacion.tipoCuotaDefault` | ref:invoiceTypes | tenant (override plan) | — | M08 MOR |
| 2634 | VAR | L | Permitir imputar financiaciones a cuentas diferentes a la de origen | s/lectura | Migrar | PRM-MOR-P3-062 | `mor.financiacion.permitirImputarOtraCuenta` | boolean (+ capability `mor.financiacion.imputarOtraCuenta`) | tenant | false | M08 MOR |

## 8. Módulo CONSUMOS (4 parámetros)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 55 | VAR_PMOVIL/CoopOnline | L | Habilitar botón "Mi Medidor" de Mr. Dims en consumos | s/lectura (CoopOnline) | Migrar-servicio | PRM-MED-P3-008 | `med.portal.miMedidor.habilitado` | boolean (requiere conector de telemedición Mr. Dims, T06) | servicio | false | M03 MED (M19 POR muestra) |
| 2568 | VAR | L | Habilitar botón de impresión de informes de grandes consumos en formulario de consumos, tramas y categorías | s/lectura | Reemplazado | — | → reporte "Grandes consumos" con capability `med.reportes.grandesConsumos` | — | — | — | T10 BIA |
| 2618 | VAR | L | Validar la distribución de consumos por las fechas de lectura | Consumo a distribuir | Migrar-servicio | PRM-MED-P3-009 | `med.consumo.distribucion.validarFechasLectura` | boolean | servicio | true | M03 MED |
| 2658 | VAR | L | Permitir eliminar último consumo cargado por cambio de medidor | s/lectura | Reemplazado | — | → anulación con reversión del último consumo por cambio de medidor (capability `med.consumos.anular`); nunca se borra | — | — | — | M03 MED |

## 9. Resumen

### 9.1 Filas por módulo ProCoop (verificado por conteo contra RN-09 §6.4)

| Módulo ProCoop | Declarados en ProCoop | Filas en este catálogo |
|---|---:|---:|
| COBRANZA | 265 | 265 |
| GESTION_DE_MORA | 23 | 23 |
| FINANCIACIONES | 21 | 21 |
| CONSUMOS | 4 | 4 |
| **Total** | **313** | **313** |

Distribución de COBRANZA por subtema: caja y consulta de deuda 31; medios de pago, valores y redondeo 13; recibos 13; imputación 10; intereses y recargos 20; reconexión al cobrar 9; entes, links y archivos 21; débitos 4; Pagos360 23; SIRO 16; otras pasarelas 40; QR 20; retenciones 0; reportes 1; terminal de autogestión, prepago y cobranza remota 30; pago a proveedores 4; otros 10.

### 9.2 Conteo por decisión

| Decisión | Filas | Observación |
|---|---:|---|
| Migrar | 147 | Incluye 3 con lógica invertida (#1015, #2613, #207), 1 mejorado (#2327) y 5 marcados [VERIFICAR] (#1001, #2078, #2566, #3153, #2458) |
| Migrar-ente | 65 | Configuración de entes, pasarelas y conectores |
| Reemplazado | 57 | 19 URLs/webhooks de pasarelas calculados por la plataforma; el resto por capability, preferencia de usuario, columna configurable, worker o estado del conector |
| Bóveda | 25 | Credenciales de Pagos360, SIRO, Mercado Pago, Naranja X, Macro, PayFun, Pago TIC, SiPago, Pronto Pago, Helipagos y Provincia Net; valores no transcriptos |
| Migrar-servicio | 13 | Reconexión, instancias de mora, prepago, consumos y vivienda |
| Descartar | 4 | #2338, #2510, #2524 (detalle WinForms) y #2579 (marca de corte legacy, solo útil para T07) |
| Plataforma | 1 | #2666 |
| Diccionario | 1 | #3083 |
| Marca | 0 | — |
| **Total** | **313** | |

PRM-ID distintos generados: 251 (PRM-COB 127, PRM-MOR 62, PRM-INT 29, PRM-POR 15, PRM-MED 9, PRM-TES 5, PRM-SOC 1, PRM-VEN 1, PRM-PLA 1, PRM-COM 1). Consolidaciones: PRM-MOR-P3-021 reúne #2420, #2713 y #3106; PRM-MOR-P3-056 reúne #674 y #675.

### 9.3 Conteo por anexo destino

| Anexo destino | Filas |
|---|---:|
| M07 COB | 136 |
| M08 MOR | 66 |
| T06 INT | 51 |
| M19 POR | 15 |
| M03 MED | 11 |
| T03 UXD | 8 |
| M14 TES | 7 |
| T02 IAM | 4 |
| T10 BIA | 3 |
| T09 COM | 2 |
| T11 WFL | 2 |
| T01 PLA | 1 |
| T07 MIG | 1 |
| M04 TAR | 1 |
| M18 SOC | 1 |
| M11 VEN | 1 |
| Sin anexo (Descartar WinForms) | 3 |
| **Total** | **313** |

## 10. Parámetros que revelan reglas de negocio no obvias

Para que M07, M08, M03 (y los anexos indicados) las incorporen como RN explícitas:

- **#462**: la "factura más antigua" puede medirse por el último vencimiento (VTO4) y no por el primero; cambia qué comprobante se obliga a cobrar primero (M07).
- **#321**: la deuda notificada se cobra completa o no se cobra; no hay pago parcial de un paquete notificado (M07/M08).
- **#375**: la obligación de cobrar lo más antiguo puede aplicarse por servicio o tipo de factura y no sobre toda la cuenta (M07).
- **#2337 / #2355**: un talón sumado (deuda agrupada) se exige completo o, si se paga parcial, se anula automáticamente y la deuda vuelve a sus comprobantes originales (M07).
- **#2249**: si está configurado, todo comprobante generado desde la caja (intereses, recargos) toma un tipo de cuota fijo, sin importar qué se cobra (M07/M05).
- **#2385**: los comprobantes con el VTO2 vencido hace más de N días desaparecen de la caja y de la consulta de deuda (se gestionan por mora/judicial) (M07/M08).
- **#2586 / #2596**: las facturas bloqueadas, y por separado sus talones, pueden o no cobrarse en caja; el bloqueo no impide siempre el cobro (M07).
- **#2651 / #2639**: un pago de ente que excede la deuda genera un anticipo que se descuenta en la próxima factura; los anticipos pueden generarse automáticamente según el tipo de la factura cobrada (M07/M05).
- **#608**: el redondeo del interés es a 1 decimal (no a centavos) (M08).
- **#609**: si el interés calculado es menor al mínimo, el recargo es 0 (umbral, no piso) (M08).
- **#621**: el interés puede contarse desde el último vencimiento en lugar del primero (M08).
- **#625**: los créditos (saldos a favor / notas de crédito) también pueden devengar interés, y eso afecta el importe enviado a Pagos360 (M08/M07).
- **#2363**: el interés entre vencimientos puede ser proporcional al saldo impago y no al total de la factura (M08).
- **#2826**: el interés entre vencimientos puede llevar IIBB discriminado (es base imponible) (M08/M06).
- **#2300 / #3167**: la base del recargo por mora puede excluir impuestos por código o calcularse solo sobre conceptos marcados (`CONCEPTOS_INT`) (M08).
- **#1011 / #2828**: los intereses pueden diferirse a una cuota futura (solo mora o todos), y esa cuota puede quedar atada al servicio de origen (afecta corte por servicio) (M08).
- **#299 / #1002**: los jubilados pueden estar exentos de todo recargo o solo del recargo desde el VTO2 (M08/M01).
- **#2487**: existe una fecha fija de cálculo de intereses para toda la cobranza local (contingencia, ej. feriado bancario o caída de sistemas) (M08).
- **#908**: pasado el último vencimiento, Pagos360 puede informar el primer importe (sin recargo) en lugar del importe con recargo (M07).
- **#2779**: en débito automático Pagos360, si el vencimiento es posterior al día 19 el débito pasa al mes siguiente (M07).
- **#3001 / #3002 / #3052 / #3059**: una reversión (contracargo) puede agruparse por cuenta, bloquea el pago online de la cuenta, devenga interés diario entre el pago y la reversión, y puede cobrar comisión (M07).
- **#63**: las facturas adheridas a débito automático pueden no pagarse online, salvo que tengan recargo por mora (evita doble cobro) (M07/M19).
- **#3047**: con SIRO, las facturas en débito automático pueden ofrecerse igualmente para pago voluntario (M07).
- **#2818**: al exportar a SIRO se puede excluir el período ya informado (evita duplicar la base de deuda) (M07).
- **#2775**: SIRO valida el primer dígito del identificador de pago (dígito de servicio/convenio) en el archivo de cobranza (M07).
- **#2646 / #3023**: la fecha contable del cobro por ente puede ser la de rendición, validada, o la de importación del archivo (M07/M15).
- **#717 / #716 / #718**: la cobranza remota (cobrador o boca externa) puede limitarse a efectivo, con tope por factura y recargo propio (M07).
- **#3054 / #3055**: el redondeo del efectivo a favor de la cooperativa se registra como anticipo con concepto, vendedor y tipo propios, hasta un monto máximo (M07).
- **#2420 vs. #3106**: en ProCoop existen dos variables con la misma descripción y solo la #3106 se lee; la migración debe tomar el valor de la #3106 (M08/T07).
- **#2917 / #3033**: al cobrar se cancela la desconexión por mora pendiente; si no hay reconexión, la marca de moroso puede quitarse igual (M08).
- **#3147 / #3163**: la reconexión automática evalúa la deuda según un criterio configurable (toda, vencida al primer o al último vencimiento) y puede exigir que no quede deuda notificada (M08).
- **#2926**: los servicios que no requieren técnica (ej. servicios no físicos) se reconectan directamente, sin OT (M08/M10).
- **#2458**: mientras exista una OT de cambio de estado en curso, la caja puede bloquear el cobro de esa cuenta [VERIFICAR] (M08/M07).
- **#2205**: el vencimiento de la notificación de mora corre desde la entrega, no desde la emisión (M08).
- **#2467 / #3050 / #384 / #39**: la selección de candidatos a mora puede ignorar notificaciones previas, excluir a quien ya es candidato y comparar solo la instancia inicial o el mismo tipo de notificación (M08).
- **#53**: si la composición de la deuda notificada cambió (pagos o nuevos cargos), el sistema debe avisar antes de seguir con la instancia siguiente (M08).
- **#308**: la cuota de financiación facturada en la factura mensual con alícuota 4 se factura exenta de IVA (M08/M06).
- **#735 / #671 / #2634**: una cuenta no puede tener dos financiaciones activas del mismo tipo, hay tope de convenios por período y la financiación puede imputarse a otra cuenta (M08).
- **#2371 / #3109 / #2940**: la venta de prepago exige medidor prepago configurado, puede permitirse por $0 y puede ocultar la deuda vencida al socio (M03).
- **#2618**: la distribución de un consumo entre períodos se valida contra las fechas reales de lectura (M03).
- **#2784**: los formatos de archivo de entes cambian por cliente a partir de una fecha (reglas de transición); el nuevo modelo necesita versión de formato con vigencia (T06).
- **#2508 / #2593**: hay parámetros con `COD_MOD` mal asignado (vivienda y presupuestos móviles en COBRANZA); la migración debe usar este catálogo y no el módulo ProCoop (T07).

## 11. Preguntas abiertas

### PA-CFG-P3-01 — Plazo de prescripción de deuda por defecto
- **Pregunta:** ¿Qué plazo por defecto se usa para marcar deuda como prescripta (#104) cuando el tenant no migra un valor?
- **Contexto:** ProCoop guarda "meses para prescripción" sin valor por defecto. El Código Civil y Comercial fija 2 años para prestaciones periódicas (art. 2562 inc. c) y 5 años como plazo genérico (art. 2560); la elección afecta el informe de prescripción, los incobrables y la gestión judicial.
- **Opciones:**
  - A) 24 meses por defecto, editable por tenant y por servicio **(Recomendada)** — alineado con el plazo de prestaciones periódicas; cada cooperativa lo ajusta con su asesor legal.
  - B) 60 meses por defecto — más conservador; puede mantener como cobrable deuda ya prescripta.
  - C) Sin valor por defecto, obligatorio al configurar el tenant — obliga a decidir en el alta; frena la puesta en marcha.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-029; reportes de prescripción e incobrables de M08 (O6).

### PA-CFG-P3-02 — Período de control de convenios: fechas fijas o ventana móvil
- **Pregunta:** ¿El tope de convenios por cuenta (#671) se controla dentro de un período de fechas fijas (#674/#675, como ProCoop) o en una ventana móvil de N meses?
- **Contexto:** Con fechas fijas, la cooperativa debe actualizar las fechas a mano cada período; si las olvida, el control queda desactivado o mal aplicado.
- **Opciones:**
  - A) Ventana móvil de N meses (default 12) **(Recomendada)** — no requiere mantenimiento; se migra calculando N desde las fechas ProCoop.
  - B) Mantener fechas fijas desde/hasta — réplica exacta de ProCoop; requiere mantenimiento periódico.
  - C) Ofrecer ambos modos — más flexible; más complejidad de configuración y pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-053, PRM-MOR-P3-056 (O6).

### PA-CFG-P3-03 — Política de pago online tras el vencimiento: general o por pasarela
- **Pregunta:** ¿Los límites de pago online después del vencimiento (permitir pagar tras el último vencimiento, días máximos, importe informado) se definen una vez por tenant con excepción por ente, o por separado en cada pasarela como en ProCoop?
- **Contexto:** ProCoop repite la misma política en cada pasarela con valores independientes (#905, #908, #914 en Pagos360; #2869, #3006, #3144 en SIRO; #3199 en Provincia Net). Esto produce reglas distintas para el mismo socio según el medio de pago.
- **Opciones:**
  - A) Política única del tenant (`cob.pagoOnline.*`) con override opcional por ente **(Recomendada)** — misma regla en todos los canales; se migra el valor más usado y los distintos quedan como override.
  - B) Una política independiente por pasarela — réplica de ProCoop; riesgo de inconsistencias.
  - C) Política única sin override — más simple; puede chocar con límites técnicos de una pasarela (ej. códigos de barras con fecha máxima).
- **Impacto si no se responde:** se asume A; los PRM de pasarela se tratan como override.
- **Bloquea:** PRM-COB-P3-074, -076, -078, -094, -095, -118, -119 (O5).

### PA-CFG-P3-04 — Reconexión automática al cobrar: comportamiento por defecto
- **Pregunta:** Cuando un socio con servicio cortado paga, ¿qué hace el sistema por defecto?
- **Contexto:** ProCoop permite no hacer nada, generar la OT de reconexión o generarla y confirmarla (#2713, #3106), reconectar sin técnica (#2926) y elegir qué deuda considerar (#3147). En el piloto Internet la reconexión puede ser solo de aprovisionamiento (sin visita).
- **Opciones:**
  - A) Generar OT automáticamente cuando no quede deuda vencida al último vencimiento; reconexión directa (aprovisionamiento) para servicios sin técnica **(Recomendada)** — reconecta rápido sin exigir pago de deuda aún no vencida.
  - B) Generar OT solo si se pagó toda la deuda (default ProCoop `todaLaDeuda`) — más estricto; demora reconexiones.
  - C) Sin acción automática; un operador decide — máximo control; más trabajo manual y reclamos.
- **Impacto si no se responde:** se asume A (`generarOT` + `vencidasUltimoVto` + reconexión directa sin técnica), configurable por servicio.
- **Bloquea:** PRM-MOR-P3-021, -023, -025 (O6, cierre del piloto Internet).

### PA-CFG-P3-05 — Prioridad de pasarelas secundarias
- **Pregunta:** ¿En qué ola se implementan los conectores de Naranja X, Macro, PayFun, Pago TIC, SiPago, Pronto Pago, Helipagos y Provincia Net?
- **Contexto:** DEC-007 los incluye en el alcance; O5 ya prevé Pagos360, Mercado Pago, SIRO y Red Link. Sus parámetros (40 filas de §5.11 y parte de §5.12) quedan definidos, pero cada conector requiere homologación con el proveedor.
- **Opciones:**
  - A) O5 para Pagos360, Mercado Pago, SIRO y Red Link; los demás como `Extensión` en O11, activados a pedido de cada tenant **(Recomendada)** — concentra el esfuerzo en lo que usa la mayoría de las cooperativas.
  - B) Todos en O5 — más alcance temprano; alarga O5 y retrasa el cierre del piloto.
  - C) Solo los que use cada tenant migrado, en la ola de su migración — prioriza por demanda real; requiere relevar uso por tenant.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-INT-P3-010 a -028, PRM-COB-P3-096 a -100, -113, -119 (O5/O11).

### PA-CFG-P3-06 — Beneficio de recargo para jubilados
- **Pregunta:** ¿Se mantiene la exención o reducción de recargo por mora para jubilados (#299, #1002) y cómo se identifica al jubilado?
- **Contexto:** ProCoop lo aplica como bandera global y depende de una marca del titular. En CoopApps puede modelarse como segmento o beneficio de la persona (M01) con regla de recargo por segmento (M08).
- **Opciones:**
  - A) Mantenerlo como beneficio de segmento ("jubilado/pensionado") con vigencia y comprobante, y regla de recargo por segmento **(Recomendada)** — reutilizable para otros segmentos (tarifa social, electrodependientes).
  - B) Mantener las dos banderas globales de ProCoop — réplica exacta; no escala a otros segmentos.
  - C) No replicarlo — simplifica; puede contradecir políticas sociales vigentes de las cooperativas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-001, PRM-MOR-P3-009; segmentos de M01 (O2) y motor de intereses de M08 (O6).

## 12. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-CFG-P3-01 | RN-09 §6.4 (#2420 y #3106) | Dos variables con la misma descripción; solo #3106 se lee | Se consolida en PRM-MOR-P3-021; la migración toma #3106 | Jerarquía 5 (código como evidencia) |
| CTR-CFG-P3-02 | RN-09 §6.4 (`COD_MOD`) vs. uso funcional (RN-05 §10, RN-04 §11) | #2508 (vivienda) y #2593 (presupuestos PMovil) figuran en COBRANZA | Se asignan a M18 SOC y M11 VEN | Jerarquía 5 + regla de oro (no se pierde, se reubica) |
| CTR-CFG-P3-03 | RN-09 §6.4 (URLs y credenciales por variable) vs. DEC-001/DEC-002 (bóveda por tenant, tenant desde token) y guía §2 (no transcribir secretos) | ProCoop guarda secretos y URLs de retorno en texto en la base | Secretos → bóveda (`secretRef`); URLs → calculadas por la plataforma | Jerarquía 1 (DEC) y 5 (deuda de seguridad → `Reemplazado`) |
| CTR-CFG-P3-04 | RN-09 §6.4 (#2394, #1030, #2299, #2919) vs. CNX §2.4 (permisos por capability) | ProCoop usa parámetros globales para restringir acciones de usuarios | Se reemplazan por capabilities (T02) | Jerarquía 4 (CNX) |

## 13. Trazabilidad de fuentes

| Fuente | Destino en este documento |
|---|---|
| RN-09 §2.1–§2.4 (almacenamiento, lectura, alta y edición de `VARIABLE`) | §3 (criterio) y §4 (leyenda); el modelo de parámetros versionados es de T04 |
| RN-09 §6.2 (totales COBRANZA 265, GESTION_DE_MORA 23, FINANCIACIONES 21, CONSUMOS 4) | §9.1 (conteo verificado: 313 filas, sin faltantes ni duplicados de V2 #) |
| RN-09 §6.4 COBRANZA (265 filas) | §5.1 a §5.17 |
| RN-09 §6.4 GESTION_DE_MORA (23 filas) | §6 |
| RN-09 §6.4 FINANCIACIONES (21 filas) | §7 |
| RN-09 §6.4 CONSUMOS (4 filas) | §8 |
| RN-05 §10 (uso de parámetros en cobranzas) | Columna "Uso en código" y §10 |
| RN-04 §11 (uso de parámetros en mora e intereses) | Columna "Uso en código" y §10 |
| Variables citadas en RN-05 §10 / RN-04 §11 que pertenecen a otros módulos (#29, #74, #144, #242, #273, #393, #443, #578, #700–704, #713, #727, #739, #757, #1008, #1023, #1024, #2086, #2089, #2206, #2210–2239, #2243–2245, #2263, #2264, #2289, #2292, #2313, #2342, #2360, #2409, #2410, #2414, #2415, #2440, #2483, #2485, #2512, #2531, #2543, #2549, #2607, #2624, #2661, #2688, #2693, #2764, #2770, #2771, #2803, #2907, #2952, #2966, #2984, #3105, #3112, #3113, #3135, #3138, #3142, #3162, #3200) | Partes 1 y 2 de T04b (fuera del alcance de esta parte) |
