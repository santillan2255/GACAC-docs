# M13 STK — Stock, equipos serializados, bienes de uso, RMA y fabricación

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (solución 1); expone datos a APIs (solución 8) y al portal del socio (solución 3) |
| Olas | **O3** (núcleo de stock: artículos, depósitos incluida cuadrilla y domicilio del socio, movimientos, series, reservas para OT, custodia, consumo desde la OT en la app de campo sin doble descuento, comodato de módem/ONU/router, retiro y devolución, costo de ingreso) · **O8** (stock completo: lotes, ubicaciones, inventario físico, ajustes, stock mínimo y sugerencia de compra, valorización perpetua, revaluación, cierre de stock, bienes de uso con amortización, RMA y servicio técnico, unidades de gasto, stock por servicio completo, informes) · **O10** (fabricación: estructuras, divisiones, etapas, órdenes, partes, aprovisionamiento; materiales de planes de vivienda) · **O11** (migración repetible, BI) |
| Dueño de datos | `itemTypes`, `itemClassifications`, `itemGroups`, `itemDepartments`, `inventoryItems`, `itemKits`, `itemLocationDefaults`, `warehouses`, `warehouseLocations`, `stockDocuments`, `stockMovements`, `stockBalances`, `serialUnits`, `serialUnitEvents`, `lots`, `lotTypes`, `stockReservations`, ~~`equipmentAssignments`~~ (Reemplazada por `contractEquipmentAssignments` de M02, CTR-DAT-28), `crewSettlements`, `physicalCounts`, `itemCostStates`, `costLayers`, `revaluations`, `reorderSuggestions`, `expenseUnits`, `fixedAssets`, `fixedAssetHistory`, `fixedAssetDepreciations`, `fixedAssetValueChanges`, `depreciationRuns`, `rmaCases`, `serviceReceptions`, `receptionStatuses`, `bomStructures`, `bomStructureVersions`, `productDivisions`, `manufacturingStages`, `manufacturingOrders`, `productionReports`, `mrpRuns` |
| Fuentes consolidadas | BASE §7 (equipos: inventario, estados, trayectoria, CU-07), §17 (registro de equipo seriado en instalación), §20 (inventario y materiales, CU-20, precarga), §33 (entidad Custodia de equipo), §34 (escenarios 66, 70, 80, 82, 94), §55 (activos fijos y amortizaciones pendientes), §57, §72 (equipo del producto Internet), §73 (INS-004, tabla "Stock y equipo: evitar doble descuento", controles), §74 (pendiente de equipos), §78 (OPE-002, compras y stock por servicio, CU-OPE-01), §80 (pendientes), §81 (copia de servicio sin stock), §86 (inventario de ONT/módem/router), §90 (cementerio: materiales), §91 (banco de sangre sin stock comercial), §97.12 (operación: stock de equipos), §98, §99 (matriz MER: RMA y bienes de uso), MER-020, §101, §102 (tabla de consolidación AGR-026/MER-020; 102.8 agenda depósito), §105, §106 · AGR-016, AGR-025, AGR-026, AGR-027 · DFA M17 (Módulo 17: funciones y mejoras) · RN-08 §1.1, §1.2, §1.3, §1.4, §6.5, §7.5, §7.6 (en lo que mueve stock), §8, §9, §10, §12.3–12.4 (parámetros de stock, fabricación y bienes de uso), §13 (implicancias 1, 3, 8, 9, 11), §14 (dudas 7, 8, 9, 14), §15.3 (`clsBienesUso`, `clsProdSer`, `Get_Stock_*`, `CostoReposicion`), §15.4, §15.5 · RN-09 §2.2 (depósitos implícitos 161/164/165/166), §3 (depósitos por usuario), §14 STOCK (14 parámetros) y FABRICACION (4 parámetros), parámetros de CONTABILIDAD 432 y de COMPRAS 3057/3171 · CAT §1 `SERSOC_PRODUCTOS`; CAT §14 `UNIDADES_GASTOS`; CAT §15 completa (39 tablas) · INV `ReglasNegocio.Stock` (11 clases), `ReglasNegocio.Fabricacion` (2), `ReglasNegocio.Varios.Fabricacion` (1), `clsBienesUso`, `clsProdSer`; `Configuracion.md` (`abm_prod_ser`, `abm_prod_ser_combos`, `abm_prod_ser_rec_des`, `frmProd_Ser_Trazabilidad`, `frmProdSerUbicacion_Item`, `frmUbicacionesStock`, `frmUbicacionesStock_Elemento`, `abm_Bienes_Uso`, `abm_bienes_uso_deduc`, `frmSelectCombo`); `ProMod_Tecnica.md` (`frmConsultar_Vales`); `ProMod_Titulares.md` (`frmMaterialesViv`) · CNX §3.7 (offline), §2.4 (permisos y alcance), §4 (admin) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Controlar, con una **existencia física única por ubicación, serie y lote**, todo lo que la cooperativa tiene, custodia, entrega, consume, presta, vende, repara, fabrica o amortiza: materiales de red y de obra, equipos serializados de cliente (módem, ONU/ONT, router, decodificador, medidor), herramientas, repuestos y bienes de uso. El módulo debe:

1. Saber en todo momento **dónde está y a cargo de quién** cada unidad: depósito central, sucursal, cuadrilla o técnico, vehículo, proveedor (garantía), reparación, o **domicilio del socio** vinculado a un contrato.
2. Distinguir los hitos **reservado → entregado al instalador → aplicado/instalado → devuelto/retirado** sin **descontar dos veces** (BASE §73, INS-004), también cuando el técnico trabaja **sin conexión** (AGR-025, CNX §3.7).
3. Conservar la **titularidad y modalidad** del equipo (comodato, préstamo, alquiler, venta, propiedad del socio) y su historia completa, aunque haya salido del depósito (AGR-026).
4. Valorizar las existencias con un **método de costeo aprobado** y costo perpetuo, y emitir los eventos económicos para que contabilidad (M15) genere los asientos (DEC-009).
5. Administrar **bienes de uso** con amortización, mejoras, disminuciones, bajas, historia y distribución por centros de costo.
6. Gestionar **RMA** (garantías, devoluciones y reparaciones de equipos con proveedores, vinculadas a la serie; MER-020) y la **recepción técnica** de equipos de clientes.
7. Soportar **fabricación** (estructuras, divisiones, etapas, órdenes, partes de producción y aprovisionamiento) para cooperativas que fabrican (por ejemplo medidores armados, tableros, postes o pilares).
8. Asociar stock, consumos y reposición **a los servicios** de la cooperativa (BASE §78 OPE-002) sin duplicar existencias ni importes.

## 2. Límite y responsabilidades

### 2.1 Qué hace STK

- Mantiene la **faceta de inventario** de los artículos (si lleva stock, si es serializado o por lote, unidades, ubicaciones, mínimos, costo, si es bien de uso, si es fabricable) y los catálogos de tipos, clasificaciones, rubros y departamentos de artículos.
- Mantiene depósitos, ubicaciones y **ubicaciones de custodia** (cuadrilla, técnico, vehículo, domicilio del socio, proveedor, tránsito, reparación, descarte).
- Registra todos los **movimientos físicos** y de **valor** como un libro inmutable; mantiene saldos materializados; anula por contramovimiento.
- Registra series, identificadores secundarios (MAC, GPON SN, IMEI, número de medidor, matrícula), lotes y la **trayectoria** de cada unidad.
- Gestiona reservas para OT, obras, presupuestos y fabricación; entregas, consumos, aplicaciones, devoluciones y rendiciones de cuadrilla.
- Gestiona **asignaciones de equipos a contratos** (comodato, venta, préstamo, alquiler, propiedad del socio), su retiro y devolución.
- Calcula costo perpetuo, valorización, revaluaciones, cierre de stock y sugerencias de compra por stock mínimo.
- Calcula **amortizaciones** de bienes de uso y emite sus eventos; mantiene sus acumulados.
- Gestiona casos RMA, recepciones técnicas y fabricación.

### 2.2 Qué NO hace STK (y a quién lo delega)

| Tema | Responsable | Relación con STK |
|---|---|---|
| Solicitudes de aprovisionamiento, cotizaciones, órdenes de compra, recepción administrativa (remito de proveedor), factura de proveedor, control de 3 vías, devolución contable a proveedor | **M12 CMP** | M12 confirma la recepción y llama a `stk.receiveGoods` (ingreso físico con series/lotes y costo). STK envía **sugerencias de compra** como requisición a M12; nunca crea OC. |
| Órdenes de trabajo, agenda, visitas, cuadrillas, técnicos, conformidad firmada, cierre de OT, aprovisionamiento de red (MikroTik/Radius/OLT), activos de red (postes, cajas NAP, transformadores) | **M10 TEC** | M10 solicita reservas, informa entrega, consumo, aplicación, retiro y visita fallida; STK confirma el efecto físico. Material incorporado a la red queda como consumo con destino "obra/red" o como bien de uso, según configuración. |
| Instalación metrológica del medidor, lecturas de colocación y retiro, constante, ensayos metrológicos vinculados a consumo | **M03 MED** | STK es dueño de la **unidad física** (serie, custodia, ubicación, estado físico); M03 es dueño de la **instalación de medición** y sus lecturas, y referencia `serialUnitId`. |
| Asientos contables, plan de cuentas, centros de costo, períodos contables, ajuste por inflación contable | **M15 CON** | STK emite eventos económicos con importes y dimensiones; M15 resuelve cuentas y genera el asiento. La **amortización** se calcula aquí y se contabiliza en M15. |
| Precio de venta, productos comerciales, planes, conceptos facturables (instalación, cargo por equipo no devuelto) | **M02 CAT** | El artículo de inventario puede vincularse a un producto comercial (`catalogProductId`). |
| Facturación de equipos vendidos o de cargos por equipo no devuelto | **M05 FAC** / **M11 VEN** | STK registra la salida y propone el cargo; FAC/VEN emiten. |
| Contrato, titular, inmueble/domicilio de prestación | **M01 PER** / **M02 CAT** | STK referencia `contractId`, `accountId`, `premiseId`. |
| Ventas de mostrador y presupuestos | **M11 VEN** | VEN reserva/compromete y pide entrega; STK mueve. |
| Planes de vivienda (materiales por tipología) | **M18 SOC** | M18 pide reservas, retiros y devoluciones de reservado (operación 13). |
| Workflow de aprobaciones, expediente documental, adjuntos | **T11 WFL** | Ajustes, bajas y diferencias de rendición usan el motor de aprobaciones; constancias y fotos van al expediente. |
| Parámetros versionados, tablas maestras (unidades de medida base, monedas, índices) | **T04 CFG** | STK declara sus PRM y consume índices (revaluación, ajuste por inflación). |
| Permisos, perfiles, alcance por depósito | **T02 IAM** | STK define capabilities y el alcance `warehouses`/`crews`. |
| Liquidación de cargos al empleado por faltantes | **M16 SUE** | Solo si el tenant lo habilita (PA-STK-04). |
| Reportes avanzados y BI | **T10 BIA** | STK publica indicadores certificados (sección 15). |
| Exportación de datos al salir de la plataforma (MER-020, salida del cliente) | **T01 PLA** | STK incluye sus colecciones en la exportación documentada. |

### 2.3 Principios de diseño

1. **Movimiento ≠ consumo.** Entregar a una cuadrilla es una transferencia de custodia; instalar es aplicar; solo el consumo de material o la aplicación de un equipo vendido o consumible "da de baja" la existencia propia (BASE §20, §73).
2. **Una sola existencia física.** Un artículo puede servir a varios servicios; la asociación con servicios es analítica y no duplica cantidades (BASE §20, §78).
3. **Libro inmutable.** Ningún movimiento se edita ni se borra; se anula con contramovimiento (convención §5 de la guía).
4. **Idempotencia.** Toda operación que proviene de campo, de otro módulo o de integración lleva `clientMutationId` o `Idempotency-Key`; repetirla no repite el efecto (AGR-016, escenario 70).
5. **Costo perpetuo.** El costo se calcula al registrar; no se reescriben precios históricos (RN-08 §13.8).
6. **Eventos en línea.** STK no genera asientos; publica eventos por outbox en la misma transacción (DEC-003, DEC-009).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Artículo | Ítem físico controlado por inventario (material, equipo, repuesto, herramienta, bien de uso, producto fabricado). | `dict:stk.item` | Producto (`PROD_SER` con `LLE_STO`) |
| Tipo de artículo | Clasificación primaria (material, equipo de cliente, herramienta, repuesto, insumo, producto terminado, componente, bien de uso). | `dict:stk.itemType` | `TIP_PROD` |
| Clasificación | Árbol jerárquico de agrupación operativa, con coeficiente de mano de obra para fabricación. | `dict:stk.itemClassification` | `CLASIFICACION_ITEMS` |
| Rubro | Agrupación contable/analítica del artículo con perfil de cuentas, vida útil e índice de revaluación. | `dict:stk.itemGroup` | `RUB_PYS` |
| Departamento | Agrupación comercial/operativa adicional del artículo. | `dict:stk.itemDepartment` | `DEPAPROD` |
| Kit / combo | Artículo compuesto que, al moverse, se explota en sus componentes. | `dict:stk.kit` | `COMBOS` |
| Depósito | Lugar o custodio que contiene existencias propias. | `dict:stk.warehouse` | `DEPOSITO` |
| Depósito de cuadrilla | Depósito móvil a cargo de una cuadrilla o técnico (stock rodante). | `dict:stk.crewWarehouse` | (no existe; ProCoop usa depósitos genéricos) |
| Ubicación | Posición jerárquica dentro de un depósito (estantería, nivel, casillero). | `dict:stk.location` | `UBICACIONES` |
| Ubicación de custodia del socio | Ubicación lógica "domicilio del socio" que representa equipos propios de la cooperativa instalados en un contrato. | `dict:stk.customerPremises` | `SERSOC_PRODUCTOS` (+ `COD_SUM` en `MOV_PRO`) |
| Documento de stock | Cabecera que agrupa movimientos de una operación (vale, transferencia, recepción, consumo, aplicación, retiro, ajuste, revaluación). | `dict:stk.document` | `RETI_MAT`, remito interno, vales |
| Movimiento | Línea inmutable de entrada o salida de cantidad y/o valor. | `dict:stk.movement` | `MOV_PRO` |
| Saldo | Existencia materializada por artículo, depósito, ubicación, lote y estado. | `dict:stk.balance` | (calculado sumando `MOV_PRO`) |
| Unidad serializada | Unidad física identificada por número de serie. | `dict:stk.serialUnit` | `PROD_TRH` |
| Trayectoria | Historia completa de eventos de una unidad serializada. | `dict:stk.trajectory` | `MOV_TRH` |
| Lote | Conjunto de unidades de un artículo con origen común, con fechas de fabricación y vencimiento. | `dict:stk.lot` | `TIPOLOTE` |
| Reserva | Compromiso de cantidad o serie para un destino (OT, obra, presupuesto, fabricación) que reduce el disponible sin mover físicamente. | `dict:stk.reservation` | comprometido (`Get_Stock_Comprometido_Presup`) |
| Custodia | Responsable actual de una unidad o existencia (depósito, cuadrilla, técnico, socio, proveedor). | `dict:stk.custody` | (implícito en `COD_DPS`) |
| Entrega a cuadrilla | Transferencia de custodia de un depósito a una cuadrilla/técnico. | `dict:stk.crewDelivery` | vale de salida / intercambio de depósito |
| Consumo | Salida definitiva de material aplicado a un destino (OT, obra, servicio, unidad de gasto). | `dict:stk.consumption` | Materiales utilizados (`frmMaterialesUtilizados`) |
| Aplicación de equipo | Paso de un equipo serializado de la custodia del técnico al domicilio del socio, vinculado a un contrato. | `dict:stk.equipmentApplication` | `SERSOC_PRODUCTOS.FECHA_ENTREGA` |
| Asignación de equipo | Registro que vincula una unidad con un contrato bajo una modalidad. | `dict:stk.equipmentAssignment` | `SERSOC_PRODUCTOS` |
| Comodato | Préstamo de uso gratuito de un equipo propio de la cooperativa al socio mientras dura el servicio. | `dict:stk.loanForUse` | comodato (P2734) |
| Retiro | Recupero de un equipo del domicilio del socio (baja, cambio, falla). | `dict:stk.equipmentRetrieval` | `FECHA_DEVUELTO` |
| Rendición de cuadrilla | Conciliación entregado − consumido − devuelto − aplicado = saldo en custodia. | `dict:stk.crewSettlement` | (no existe) |
| Inventario físico | Conteo de existencias y registro de diferencias. | `dict:stk.physicalCount` | Conciliación de stock (operación 4) |
| Ajuste | Movimiento aprobado que corrige diferencias con causa y evidencia. | `dict:stk.adjustment` | vale de ajuste |
| Stock mínimo | Nivel por debajo del cual se sugiere reponer. | `dict:stk.minStock` | `STO_MIN` |
| Sugerencia de compra | Propuesta de reposición enviada a compras como requisición. | `dict:stk.reorderSuggestion` | `Pedir_segun_SM` |
| Costo perpetuo | Costo unitario mantenido en línea según el método aprobado. | `dict:stk.perpetualCost` | (valorización a demanda) |
| Capa de costo | Ingreso con cantidad y costo pendiente de consumir (PEPS/UEPS). | `dict:stk.costLayer` | — |
| Revaluación | Ajuste de valor de existencias sin cambio de cantidad. | `dict:stk.revaluation` | `clsRevaluacion` |
| Cierre de stock | Congelamiento de movimientos y valorización hasta una fecha. | `dict:stk.stockClose` | P432 |
| Bien de uso | Activo fijo propio con valor de origen, vida útil y amortización. | `dict:stk.fixedAsset` | `BIENES_USO` |
| Amortización | Depreciación periódica del bien de uso. | `dict:stk.depreciation` | `BIENES_USO_AMORT` |
| Mejora | Incorporación que aumenta el valor de un bien existente. | `dict:stk.improvement` | marca de mejora en `BIENES_USO` |
| Disminución | Reducción de valor parcial de un bien. | `dict:stk.impairment` | `BIENES_USO_DISM` |
| RMA | Autorización de devolución de mercadería: circuito de garantía, reparación o reemplazo de un equipo con el proveedor. | `dict:stk.rma` | `RMA_PRODUCTOS` |
| Recepción técnica | Ingreso de equipos de clientes para servicio técnico. | `dict:stk.serviceReception` | `RECEPCIONES` |
| Estructura (BOM) | Lista de materiales multinivel de un producto fabricable. | `dict:stk.bom` | `PRODFAB` |
| División | Descomposición de un producto en partes con coeficiente. | `dict:stk.productDivision` | `PRODFAB_DIVISIONES` |
| Etapa de fabricación | Paso productivo ordenado con duración. | `dict:stk.manufacturingStage` | `ETAFAB` |
| Orden de fabricación | Pedido de producción de productos con sus componentes. | `dict:stk.manufacturingOrder` | `ORDEFAB` |
| Parte de producción | Registro de ejecución de producción de una orden. | `dict:stk.productionReport` | `OF_PARTE_PRODUCCION` |
| Aprovisionamiento de fabricación | Cálculo de necesidades de componentes (MRP simple). | `dict:stk.mrp` | `frmOrdenAprovisionamiento` |
| Unidad de gasto | Destino interno de consumo de materiales (área o unidad que consume). | `dict:stk.expenseUnit` | `UNIDADES_GASTOS` |

## 4. Actores, permisos y alcance

| Rol (T02) | Capabilities principales | Alcance de datos |
|---|---|---|
| Administrador del tenant | `stk.config.configurar`, todas las `*.ver` | Tenant |
| Encargado de depósito | `stk.articulos.ver/crear/editar`, `stk.depositos.ver/crear/editar`, `stk.movimientos.ver/crear/anular`, `stk.transferencias.crear/recibir`, `stk.series.ver/crear/editar`, `stk.lotes.ver/crear`, `stk.reservas.ver/crear/liberar`, `stk.entregas.crear`, `stk.devoluciones.crear`, `stk.rendiciones.ver/crear`, `stk.inventarios.ver/crear/contar/cerrar`, `stk.ajustes.crear`, `stk.etiquetas.imprimir`, `stk.informes.ver/exportar` | Depósitos asignados (`scope.warehouses`) |
| Auxiliar de depósito | `stk.movimientos.ver/crear`, `stk.transferencias.recibir`, `stk.series.ver/crear`, `stk.inventarios.contar`, `stk.etiquetas.imprimir` | Depósitos asignados |
| Supervisor técnico / jefe de cuadrilla | `stk.reservas.ver/crear`, `stk.entregas.crear`, `stk.rendiciones.ver/crear/aprobar`, `stk.custodias.ver`, `stk.consumos.validar`, `stk.sustituciones.validar` | Cuadrillas a cargo (`scope.crews`) |
| Técnico / instalador (pwa-campo) | `stk.miStock.ver`, `stk.entregas.aceptar`, `stk.consumos.registrar`, `stk.aplicaciones.registrar`, `stk.retiros.registrar`, `stk.devoluciones.solicitar`, `stk.inventarios.contar` (de su custodia) | Propios (`scope.own`: su depósito personal y el de su cuadrilla) |
| Aprobador de ajustes | `stk.ajustes.aprobar`, `stk.bajas.aprobar` | Depósitos asignados, con umbral por importe (T11) |
| Responsable de costos / contador | `stk.valorizacion.ver/exportar`, `stk.revaluaciones.crear/aprobar`, `stk.cierres.crear/reabrir`, `stk.costos.editar` | Tenant |
| Responsable de bienes de uso | `stk.bienesUso.ver/crear/editar/baja`, `stk.amortizaciones.ejecutar/revertir`, `stk.bienesUso.exportar` | Tenant o sucursales |
| Responsable de RMA / servicio técnico | `stk.rma.ver/crear/editar/cerrar`, `stk.recepciones.ver/crear/editar/entregar` | Depósitos de reparación asignados |
| Jefe de planta / fabricación | `stk.fabricacion.estructuras.ver`, `stk.fabricacion.estructuras.editar` (antes `stk.fabricacion.estructuras.*`), `stk.fabricacion.ordenes.ver/crear/lanzar/finalizar/cancelar/anular`, `stk.fabricacion.partes.ver`, `stk.fabricacion.partes.crear`, `stk.fabricacion.partes.lanzar`, `stk.fabricacion.partes.finalizar` (antes `stk.fabricacion.partes.*`), `stk.fabricacion.aprovisionamiento.ejecutar` | Depósitos de producción y componentes |
| Operario de producción | `stk.fabricacion.partes.ver/crear/lanzar/finalizar` | Partes asignados |
| Compras (M12) | `stk.articulos.ver`, `stk.saldos.ver`, `stk.sugerencias.ver/convertir` | Tenant |
| Atención al socio (M09) | `stk.asignaciones.ver`, `stk.retiros.solicitar` | Cuentas en su alcance |
| Socio (pwa-socio) | `stk.misEquipos.ver` | Propios (sus contratos) |
| Auditor | `stk.*.ver`, `stk.auditoria.ver` | Tenant (solo lectura) |
| Integración externa (token) | `stk.ext.vales.crear`, `stk.ext.saldos.ver` | Tenant, por token (T06) |

Reglas de permisos: la capability se valida **en la capa de servicio** (no solo en pantalla), también en operaciones masivas (corrige RN-08 §1.4, §15.3 "sin validar permisos"). El alcance por depósito reemplaza `USERS_DEPOSITO` (RN-09 §3).

## 5. Requisitos funcionales

Prioridad: N = Núcleo, E = Estándar, X = Extensión.

### 5.1 Artículos y clasificación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-001 | Mantener el artículo de inventario con código único por tenant, descripción, descripción corta, tipo, clasificación, rubro, departamento, unidad de stock, marca, modelo, fabricante, código de barras/EAN, características técnicas como propiedades extendidas tipadas (con marca "valor único"), adjuntos (fotos, fichas, certificados) y estado activo/inactivo. | BASE §7, §20; CAT `PROD_SER`/`TIP_PROD`; INV `abm_prod_ser`; RN-08 §15.4 `Validar_Ingreso` (`DATOSEXT UNICO`) | N | O3 | Informado | Alta con propiedades extendidas; una propiedad marcada única rechaza un valor repetido en otra unidad del mismo artículo. |
| RF-STK-002 | Banderas del artículo: lleva stock, serializado, por lote, con vencimiento, usa ubicaciones, bien de uso, fabricable, componente, kit, consumible, equipo de cliente elegible para comodato, vendible (vínculo a M02), comprable, disponible en módulos (todos / ventas-stock-compras / solo ventas / compras-stock / cuotas / ninguno). | RN-08 §8.1 (`LLE_STO`, `ID_REQUE`, `USA_UBICACION`), §15.4 (`PROD_SERV`) | N | O3 | Adoptado | Un artículo sin "lleva stock" no genera movimientos; uno marcado "solo compras-stock" no aparece en ventas. |
| RF-STK-003 | Unidades y equivalencias: unidad de stock, de compra y de consumo con factor de conversión, y cantidad por bulto para reposición. | BASE §20 ("catálogo, unidades y equivalencias"); RN-08 §15.3 `CostoReposicion` (`BULTOS`) | N | O3 | Informado | Recibir 2 cajas × 100 conectores ingresa 200 unidades. |
| RF-STK-004 | ABM de tipos de artículo. | CAT `TIP_PROD`; DFA M17 | E | O3 | Adoptado | No se puede eliminar un tipo con artículos; se inactiva. |
| RF-STK-005 | ABM jerárquico de clasificaciones con coeficiente de mano de obra. | CAT `CLASIFICACION_ITEMS` (DFA M17); RN-08 §15.3 `Get_CostoFijo` | E | O8 | Adoptado | El costo fijo de fabricación usa el coeficiente de la clasificación. |
| RF-STK-006 | ABM jerárquico de rubros con perfil contable (claves: compras, ventas, otros, costo de venta, costo de baja, valor de origen, amortización del ejercicio, amortización acumulada, disminución, revalúo), vida útil por defecto, marca "ajustable por inflación" e índice de revaluación. | CAT `RUB_PYS`; RN-08 §9, §15.2 `GetCuentaRubro_ProdYSer`, §15.4 `clsRevaluacion` | N | O3 (estructura) / O8 (contable) | Adoptado | Un rubro sin índice impide la revaluación por índice de sus artículos. |
| RF-STK-007 | ABM de departamentos de artículos. | CAT `DEPAPROD` | E | O8 | Adoptado | Filtro por departamento en informes y actualización de costos. |
| RF-STK-008 | Kits/combos: composición con cantidades; al moverse se explota en componentes. | CAT `COMBOS`; RN-08 §8.1; INV `abm_prod_ser_combos`, `frmSelectCombo` | E | O8 | Adoptado | Mover 1 kit "instalación FTTH" de 3 componentes genera 3 movimientos. |
| RF-STK-009 | Asociar un artículo a uno o varios servicios del tenant, y a un servicio por defecto, sin duplicar su existencia. | BASE §20, §78 OPE-002 | N | O3 | Informado | Un conector asociado a Internet y Electricidad muestra una única existencia. |
| RF-STK-010 | Clonar un artículo (sufijo "(copia)"), con validación de matrícula única si está habilitada. | RN-08 §15.3 `clonarProdSer`; PRM-STK-021 (V2 #3049) | X | O8 | Adoptado | Clonar no copia series, saldos ni costos. |
| RF-STK-011 | Importación masiva de artículos, series y saldos iniciales con `ExcelImportWizard` (subir → preview con errores → confirmar). | CNX §4; DEC-001 | N | O3 | Adoptado | Un archivo con 1 serie duplicada muestra el error en preview y no importa esa fila. |
| RF-STK-012 | Actualización masiva del **costo de reposición** por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor) y modos porcentaje, coeficiente, cotización del dólar y monto fijo, guardando el costo anterior y auditando. El precio de venta lo gestiona M02. | RN-08 §15.3 `ActualizarPrecios`, `Get_DatosGrilla_ActualizarPrecios` | E | O8 | Adoptado | Un aumento del 10 % actualiza el costo de reposición y deja el anterior en historial. |
| RF-STK-013 | Costo de reposición y costo estándar por artículo (para cargos por equipo no devuelto, presupuestos y valorización "a costo"). | RN-08 §8.4 (`PRE_CSI`) | N | O3 | Adoptado | El cargo propuesto por equipo no devuelto toma el costo de reposición vigente. |
| RF-STK-014 | Historial de cambios de costo y datos del artículo (fecha de último costo, usuario). | RN-08 §15.3 `Ultima_ActPrecio` | E | O8 | Adoptado | La ficha muestra la línea de tiempo de costos. |

### 5.2 Depósitos, ubicaciones y custodia

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-015 | Depósitos tipificados: central, sucursal, cuadrilla, técnico (personal), vehículo, producción, componentes, tránsito, reparación interna, en proveedor (RMA), cuarentena, consignación, descarte; con sucursal, dirección, responsable, servicios asociados y estado activo/inactivo. | CAT `DEPOSITO`; DFA M17 "Medidores y equipos serializados con su ubicación: depósito, cuadrilla o domicilio del socio" | N | O3 | Informado | Se puede crear un depósito de cuadrilla vinculado a la cuadrilla CUA-01 de M10. |
| RF-STK-016 | El depósito de cuadrilla y el de técnico se vinculan con la cuadrilla/empleado de M10/M16, con responsable de custodia; al cambiar el responsable se exige rendición previa (RF-STK-063). | BASE §20 ("entregas a cuadrillas o instaladores identificados, con custodia"), §33 | N | O3 | Informado | No se puede reasignar el responsable de un depósito de cuadrilla con saldo sin rendición cerrada. |
| RF-STK-017 | Ubicación de custodia **domicilio del socio**: ubicación lógica por contrato (`contractId` + `premiseId`), sin crear un depósito por socio; contiene las unidades aplicadas y se incluye en existencias propias valorizadas cuando la modalidad conserva la titularidad. | BASE §33 (Custodia de equipo), §73, §86; AGR-026 | N | O3 | Informado | Consultar "equipos en domicilios" lista MOD-DEMO-001 en el contrato de Ana con modalidad comodato. |
| RF-STK-018 | Ubicaciones jerárquicas (padre/hijo) dentro de un depósito, con marca asignable y por defecto, y alta masiva con enumeración (por ejemplo E01..E20). | CAT `UBICACIONES`; RN-08 §8.3; INV `frmUbicacionesStock`, `frmUbicacionesStock_Elemento` | E | O8 | Adoptado | Solo ubicaciones asignables reciben movimientos. |
| RF-STK-019 | Ubicaciones por defecto y capacidad por artículo. | CAT `PROD_SER_UBICACION`; RN-08 §8.3 `GetUbicacionesPorDefectoStock`; INV `frmProdSerUbicacion_Item` | E | O8 | Adoptado | Un ingreso sin ubicación propone la ubicación por defecto; superar la capacidad advierte. |
| RF-STK-020 | Depósitos por defecto por tipo de operación (stock, ventas, producción, componentes) en tres niveles: tenant, sucursal y usuario. | RN-09 §2.2, §3 (161/164/165/166); RN-08 §8.3 | N | O3 | Adoptado | Un técnico ve su depósito personal como origen por defecto en consumos. |
| RF-STK-021 | Alcance de usuario por depósito (habilitados para ver/mover). | RN-09 §3 (`USERS_DEPOSITO`) | N | O3 | Reemplazado por alcance `scope.warehouses` de T02 | Un usuario sin alcance sobre DEP-02 recibe 403 al mover desde DEP-02. |
| RF-STK-022 | Inactivar un depósito (equivale a `IGNORAR`) solo con saldo cero y sin reservas ni documentos abiertos. | CAT `DEPOSITO.IGNORAR` | E | O3 | Adoptado | Intentar inactivar con saldo muestra el detalle de existencias. |

### 5.3 Movimientos y documentos de stock

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-023 | Libro de movimientos inmutable con operación tipificada (sección 7, enum `operation`), fecha efectiva, fecha de registro, artículo, cantidad con signo de sentido, depósito/ubicación, lote, serie, costo unitario, importe, destino, servicio, documento origen y usuario. | RN-08 §8.1 (`MOV_PRO`, `Mov_Pro_Operaciones`); CAT `MOV_PRO` | N | O3 | Adoptado | No existe endpoint de edición de movimientos. |
| RF-STK-024 | Documentos de stock: vale de entrada, vale de salida, transferencia entre depósitos (remito interno), recepción de compra, devolución a proveedor, entrega a cuadrilla, devolución de cuadrilla, consumo en OT/OM, aplicación de equipo, retiro de equipo, devolución en mostrador, entrega de producto vendido, consignación, ajuste, conciliación de inventario, revaluación, fabricación, vivienda. | RN-08 §8.1, §8.2; CAT `RETI_MAT`, `IT_RETM`; DFA M17 (`TRANSFER`, operaciones especiales) | N | O3 (vales, transferencia, entrega, devolución, consumo, aplicación, retiro) / O8 (resto) / O10 (fabricación, vivienda) | Adoptado | Cada tipo tiene numeración propia por tenant y sucursal. |
| RF-STK-025 | Anulación de documentos por contramovimiento, con motivo y permiso; prohibida si afecta series con movimientos posteriores, bienes de uso dados de baja o períodos cerrados. | RN-08 §15.4 `EliminarMovimiento`; convención guía §5 | N | O3 | Adoptado | Anular un vale genera movimientos inversos; el original queda con estado `cancelled`. |
| RF-STK-026 | Saldos materializados por artículo, depósito, ubicación, lote y estado de existencia, actualizados en la misma transacción del movimiento; proceso de **reconstrucción y verificación** contra el libro. | RN-08 §8.1 (`Reconstruccion`, `Obtener_Stock_Prod`) | N | O3 | Adoptado | El job de verificación no encuentra diferencias entre saldos y suma de movimientos. |
| RF-STK-027 | Estados de existencia distinguibles: disponible, reservado, en tránsito, en custodia de cuadrilla/técnico, aplicado en domicilio del socio, en reparación, en proveedor, en cuarentena, consignado, consumido, devuelto, dado de baja. | BASE §78 ("Distinguir stock disponible, reservado, entregado a instalador, aplicado/consumido y devuelto") | N | O3 | Informado | El tablero de un artículo muestra las cantidades por estado y su suma física. |
| RF-STK-028 | Política de stock negativo por tipo de operación (transferencias, vales, consumos, ventas) y prohibición absoluta para serializados. | RN-09 §6.4 (V2 #373, #2525) | N | O3 | Adoptado | Con la política en "bloquear", una salida que deja −1 se rechaza con `problem+json` `stk/negative-stock`. |
| RF-STK-029 | Aviso al registrar una operación que deja el saldo por debajo del mínimo. | RN-09 §6.4 (V2 #2565) | E | O8 | Adoptado | Se muestra advertencia no bloqueante y se publica `stk.item.belowMinimum` (EVT-STK-12; antes `stk.item.below-minimum`, PA-STK-11). |
| RF-STK-030 | Fecha efectiva y fecha de registro separadas; rechazo de operaciones con fecha en período de stock cerrado. | RN-08 §1.1 (P432); AGR-010 (registro) | N | O3 | Adoptado | Una salida con fecha anterior al cierre se rechaza `stk/period-closed`. |
| RF-STK-031 | Destino obligatorio en consumos y salidas internas: OT, OM, obra, servicio, contrato, centro de costo, unidad de gasto, plan de vivienda, según configuración del tipo de documento. | BASE §20 ("Vincular cada consumo con su destino"), §78 | N | O3 | Informado | Un consumo sin destino se rechaza. |
| RF-STK-032 | Exigir obra en vales (configurable) y obra por defecto para vales generados por integración externa. | RN-09 §6.4 (V2 #2419, #2609) | E | O8 | Adoptado | Con la exigencia activa, un vale sin obra no se guarda. |
| RF-STK-033 | Importar ítems de un presupuesto aprobado de M11 en un vale, validando que el presupuesto tenga obra asignada si así se configura. | RN-08 §8.2 (P2899), §12.4 (P2914) | X | O8 | Adoptado | El vale toma las cantidades pendientes del presupuesto. |
| RF-STK-034 | Impresión de etiquetas (código de barras/QR) por artículo, serie, lote y ubicación, con pregunta opcional al registrar ingresos. | RN-09 §6.4 (V2 #3071); RN-08 §15.5 `GetEtiquetaProductos` | E | O3 | Adoptado | Al recibir 10 ONU se ofrece imprimir 10 etiquetas con su serie. |
| RF-STK-035 | Escaneo de código de barras/QR desde la PWA (cámara) y desde admin (lector) para artículos, series, lotes y ubicaciones. | CNX §3 (PWA de campo) | N | O3 | Adoptado | Escanear una serie en la app la identifica sin tipeo. |
| RF-STK-036 | Productos facturados pendientes de entrega y su entrega posterior (parcial o total). | RN-08 §8.2 `frmEntregaProductos_Handler`, §15.4 `GetStockFacturadoNoEntregado`; INV `clsProductosPendientesEntregar` | E | O8 | Adoptado | Una factura con 5 unidades y 3 entregadas muestra 2 pendientes. |
| RF-STK-037 | Salidas en consignación y su seguimiento hasta devolución o facturación. | RN-08 §8.1 (operación 8), §15.4 `GetSalidaPorConsignacion` | X | O8 | Adoptado | Informe de consignados muestra unidades fuera sin facturar. |
| RF-STK-038 | Registrar quién recibe físicamente (usuario o técnico, fecha y hora de recepción) en entregas y transferencias. | CAT `MOV_PRO_EXTRAS` | N | O3 | Adoptado | La entrega queda "pendiente de aceptación" hasta que el técnico la acepta en la app. |
| RF-STK-039 | Transferencias con tránsito opcional (sale de origen a "en tránsito" y entra al destino al recibir), recepción parcial con diferencias y remito interno imprimible; modificación del remito solo antes de la recepción. | RN-08 §8.2 `frmIntercambio_Deposito_Handler` (`ModificarRemito`, `Anular`) | N | O3 | Adoptado | Recibir 9 de 10 deja 1 en diferencia de tránsito pendiente de resolución. |
| RF-STK-040 | Consulta de disponibilidad por artículo, servicio, depósito, ubicación, lote y cuadrilla, incluyendo comprometido: reservas, órdenes de compra pendientes (M12), facturas de compra pendientes de recibir, presupuestos aprobados con obra (M11). | BASE §20 ("Consultar disponibilidad"); RN-08 §15.3 `Get_Stock_ItemsOC`, `Get_Stock_FpItems`, `Get_Stock_Comprometido_Presup` | N | O3 (físico y reservas) / O8 (compras y presupuestos) | Informado | Disponible = físico disponible − reservado; proyectado = disponible + en tránsito + OC pendientes. |
| RF-STK-041 | Kardex por artículo (con saldo y costo) y por serie (trayectoria). | RN-08 §8.1; DFA M17 Informes de Stock | N | O3 | Adoptado | El kárdex cuadra con el saldo materializado a la fecha. |
| RF-STK-042 | Consulta de vales y retiros de materiales por OT/OM. | INV `frmConsultar_Vales`; RN-08 §15.4 `GetMovimientosVale` | E | O3 | Adoptado | Desde la OT se ve el detalle de materiales entregados, consumidos y devueltos. |
| RF-STK-043 | Integración: recibir vales desde sistemas externos por API con token, idempotentes. | RN-09 §6.4 (V2 #2609, `clsProcoop_Integra.Post_Stock`) | X | O11 | Adoptado | Reenviar el mismo vale con la misma `Idempotency-Key` devuelve el mismo resultado. |

### 5.4 Trazabilidad por número de serie y lote

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-044 | Unidad serializada con número de serie del fabricante e identificadores secundarios tipados (MAC, GPON SN, IMEI, número de medidor, matrícula, código interno), únicos por tenant, artículo y tipo de identificador. | BASE §7 ("identificadores únicos"), §86; CAT `PROD_TRH` | N | O3 | Informado | Dos ONU con la misma MAC en el tenant se rechazan. |
| RF-STK-045 | Ingreso de series por carga manual, escaneo, rango con prefijo y correlativo ("renumerable") e importación Excel, con validaciones: única dentro del lote cargado; error si ya está en stock; error si está asignada a un contrato o instalada; confirmación si existe fuera de stock (reingreso). | RN-08 §15.4 `clsTrazabilidad.Validar_Ingreso`; INV `frmProd_Ser_Trazabilidad` | N | O3 | Adoptado | Reingresar una serie retirada pide confirmación y continúa su trayectoria (no crea otra unidad). |
| RF-STK-046 | Estados de la unidad: disponible, reservada, en tránsito, en custodia de técnico, instalada/aplicada, retirada pendiente de revisión, en reparación, en RMA, en cuarentena, vendida (titularidad transferida), perdida/no recuperada, descartada. | BASE §7 (disponible, instalado, retirado, en reparación, descartado) | N | O3 | Informado | Transiciones según sección 8.2. |
| RF-STK-047 | Trayectoria completa: cada cambio de custodia, ubicación, estado, contrato, OT, RMA, reparación, inspección, ensayo, mantenimiento y adjunto, con fecha efectiva, actor y documento. | BASE §7 ("Consultar la trayectoria completa del equipo"), CU-07; CAT `MOV_TRH` | N | O3 | Informado | La ficha de MOD-DEMO-001 muestra: ingreso → reservado OT-001 → entregado EMP-INS-001 → aplicado contrato INT-100. |
| RF-STK-048 | Registrar inspecciones, ensayos y mantenimiento de la unidad con resultado, certificado y vencimiento del ensayo (los ensayos metrológicos de medidores se registran aquí y M03 los consulta). | BASE §7 | E | O8 | Informado | Un medidor con ensayo vencido no puede reservarse para instalación si la política lo exige. |
| RF-STK-049 | Precintos y accesorios vinculados a la unidad (fuente, patch cord, antena), cada uno opcionalmente serializado. | BASE §7 ("precintos y accesorios") | E | O3 | Informado | El retiro de una ONU verifica que vuelva la fuente asociada o registra faltante. |
| RF-STK-050 | Impedir instalaciones simultáneas o incompatibles: una unidad solo puede estar aplicada en un contrato a la vez; compatibilidad modelo–servicio/tecnología configurable. | BASE §7, CU-07 (excepción) | N | O3 | Informado | Intentar aplicar MED-002 ya instalado en otro suministro se rechaza `stk/serial-already-applied`. |
| RF-STK-138 | Lotes con número, fecha de fabricación, fecha de vencimiento, proveedor y tipo de lote; trazabilidad lote → destinos; sugerencia de consumo por vencimiento más próximo (FEFO) y bloqueo de lotes vencidos configurable. | DFA M17 (`TIPOLOTE`) | E | O8 | Adoptado | Un lote de cloro vencido no se ofrece en consumos si el bloqueo está activo. |
| RF-STK-051 | Costo por serie: los serializados conservan el costo de su ingreso y se valorizan por identificación específica cuando así lo define el método (PA-STK-01). | RN-08 §8.4 ("Trazables se valorizan por número de serie"), §15.4 `RegistrarTrazabilidad`; RN-09 §6.4 (V2 #2416) | N | O3 | A validar (PA-STK-01) | El costo de MOD-DEMO-001 es ARS 20.000 aunque el PPP del modelo sea otro. |
| RF-STK-052 | Equipos de propiedad del socio o de terceros: registro opcional de identificadores (MAC, serie) para aprovisionamiento y soporte, sin existencia ni valorización propia. | BASE §73 (modalidades "u otra modalidad que se defina"), §86 | E | O3 | A validar (PA-STK-08) | Un router propio del socio se registra con MAC y no aparece en el stock valorizado. |
| RF-STK-053 | Búsqueda global por cualquier identificador (serie, MAC, GPON SN, matrícula) desde admin, app de campo y CRM. | BASE §7 | N | O3 | Adoptado | Buscar la MAC devuelve la unidad, su estado y contrato. |

### 5.5 Reservas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-054 | Reservar materiales y equipos para una OT, obra, presupuesto, plan de vivienda u orden de fabricación, por cantidad de artículo o por serie específica; la reserva reduce el disponible sin movimiento físico. | BASE §20 ("Reservar materiales para trabajos"), §73 (Reserva) | N | O3 | Informado | CU-20: reservar 4 conectores deja 16 disponibles y 20 físicos. |
| RF-STK-055 | Liberar reservas al cancelar o reprogramar la OT, por vencimiento configurable o manualmente con motivo. | BASE §73 (visita fallida); AGR-025 (reserva temporal y expiración) | N | O3 | Adoptado | Cancelar OT-001 publica `tec.workOrder.cancelled` y STK libera la reserva. |
| RF-STK-056 | Control de concurrencia: dos reservas simultáneas de la misma serie o del último disponible no pueden confirmarse ambas. | AGR-025 ("No hay doble asignación del mismo equipo por carrera") | N | O3 | Adoptado | Prueba de carrera con 2 solicitudes simultáneas: una confirma y la otra recibe `stk/reservation-conflict`. |
| RF-STK-057 | Reserva por modelo al agendar y asignación de serie al entregar, o reserva de serie específica desde el inicio, según el modo de entrega configurado por servicio. | BASE §73 (pasos 3 y 8) | N | O3 | A validar (PA-STK-03) | Con modo "stock rodante", la OT reserva 1 ONU modelo X y la serie se determina al aplicar. |
| RF-STK-058 | Consumir la reserva al entregar o aplicar, y mostrar en la OT el estado de cada reserva (pendiente, entregada, aplicada, liberada). | BASE §73 | N | O3 | Informado | La reserva aplicada queda cerrada y no vuelve a reducir disponible. |

### 5.6 Entregas a cuadrilla, custodia y consumo desde la OT (app de campo)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-059 | Entregar materiales y equipos a cuadrillas o técnicos identificados como **transferencia de custodia** (sale del depósito y queda a cargo del técnico), con aceptación en la app (firma o confirmación) y constancia. | BASE §20, §73 (Entrega al instalador), INS-004 | N | O3 | Informado | Tras la entrega, DEP-01 baja 4 y la cuadrilla sube 4; el total físico de la cooperativa no cambia. |
| RF-STK-060 | Stock rodante de cuadrilla: el técnico tiene un saldo propio visible en la app ("Mi stock") por artículo, serie y lote, también **sin conexión** (última foto sincronizada + cola local). | DFA M17 (mejora); CNX §3.7 | N | O3 | Adoptado | Sin red, "Mi stock" muestra el saldo y descuenta localmente lo consumido pendiente de sincronizar. |
| RF-STK-061 | Registrar desde la OT en la app de campo el **consumo de materiales** (artículo, cantidad, lote) y la **aplicación de equipos** (serie escaneada) desde la custodia del técnico; al sincronizar se genera un único movimiento por `clientMutationId`, sin volver a descontar el depósito central. | DFA M17 (mejora "Consumo de materiales desde la OT en la app de campo"); BASE §73 (INS-004), escenarios 66 y 70; AGR-016; CNX §3.7 | N | O3 | Informado | Sincronizar dos veces el mismo cierre de OT no genera dos salidas ni dos aplicaciones. |
| RF-STK-062 | Aplicación del equipo al contrato: la unidad pasa de la custodia del técnico a la ubicación "domicilio del socio" del contrato, se crea la asignación con modalidad y se publica `stk.equipment.applied` con identificadores (MAC/GPON SN) para el aprovisionamiento de M10. | BASE §73 (paso 8), §86 | N | O3 | Informado | Tras aplicar, M10 recibe la MAC para dar de alta la ONU en la OLT. |
| RF-STK-063 | Visita fallida: el equipo y los materiales permanecen en custodia del técnico (o se devuelven), la reserva puede mantenerse para la nueva visita y no se registra instalación ni nuevo descuento. | BASE §73 (Visita fallida), controles | N | O3 | Informado | Una OT con resultado "fallida" no genera aplicación. |
| RF-STK-064 | Sustitución: si la serie aplicada difiere de la reservada, se registra la sustitución, se libera la reservada y se valida por el supervisor cuando la serie no estaba en la custodia del técnico. | BASE §73 (controles: "Si el equipo efectivo difiere del reservado, se registra y valida la sustitución") | N | O3 | Informado | Aplicar una serie de otra cuadrilla queda en "sustitución pendiente de validación" sin adjudicar dos equipos. |
| RF-STK-065 | Devolución de sobrantes de cuadrilla al depósito (total o parcial), con recepción en depósito y condición (bueno, dañado). | BASE §20 ("Controlar devoluciones y sobrantes") | N | O3 | Informado | CU-20: devolver 1 conector deja 17 en depósito. |
| RF-STK-066 | Rendición de cuadrilla: conciliar entregado − consumido − aplicado − devuelto = saldo en custodia, por artículo y serie; las diferencias se registran como faltante o sobrante con evidencia y requieren ajuste aprobado. | BASE §20 (CU-20: "sin saldo pendiente en cuadrilla"; excepción con ajuste autorizado y evidencia) | N | O3 | A validar (PA-STK-04) | Una rendición con 1 faltante no se cierra sin ajuste aprobado. |
| RF-STK-067 | Conflictos de sincronización: si la OT fue cancelada o reasignada mientras el técnico trabajaba sin conexión, se reciben las evidencias y el consumo/aplicación queda "en conflicto" con responsable de resolución; no se borra lo realizado ni se activa sin control. | AGR-025 | N | O3 | Adoptado | La bandeja de conflictos muestra la OT cancelada con la aplicación recibida. |
| RF-STK-068 | Registrar materiales utilizados desde admin para OT/OM sin app (carga posterior por el supervisor), con origen en la custodia de la cuadrilla o en un depósito. | RN-08 §8.2 `frmMaterialesUtilizados_Handler` | N | O3 | Adoptado | La carga desde admin y desde app sobre la misma OT no duplican si informan el mismo `clientMutationId`. |
| RF-STK-069 | Validación opcional del consumo declarado por el supervisor antes de su efecto contable. | BASE §20; AGR-016 | E | O3 | A validar (PA-STK-02) | Con validación activa el consumo afecta stock al sincronizar y el evento económico se emite al validar. |
| RF-STK-070 | Costo de la OT: materiales valorizados (y, informado por M10, horas hombre con producto de mano de obra) en el informe de costo de OT/OM. | RN-08 §6.5, §12.4 (P460, P3015), RN-09 §6.4 (V2 #3015) | E | O8 | Adoptado | El informe de OT-001 muestra 3 conectores × costo + horas. |
| RF-STK-071 | Retiro de equipos desde OT de baja, cambio, corte o reconexión: el técnico escanea la unidad retirada, registra condición (funciona, dañado, incompleto) y accesorios; la unidad pasa a su custodia con estado "retirada pendiente de revisión". | BASE §73 (Retiro posterior), §86 (baja: gestionar retiro) | N | O3 | Informado | Retirar la ONU de un contrato en baja cierra la asignación con fecha de devolución. |

### 5.7 Equipos en comodato y otras modalidades

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-072 | Modalidades de entrega por artículo/plan: comodato, préstamo temporal, alquiler, venta, propiedad del socio, incorporación a red propia. La modalidad por defecto la define el producto comercial (M02) y se registra en la asignación: comodato por defecto en Internet y TV, configurable por plan y valorizado en stock (DEC-013). | BASE §20 ("diferenciar venta, consumo, préstamo/comodato u otra modalidad"), §72, §73; DEC-013 | N | O3 | Informado | El plan INT-100 entrega ONU en comodato; la asignación guarda `mode = loanForUse`. |
| RF-STK-073 | Asignación de equipo a contrato con: contrato, cuenta, inmueble, artículo, serie, fecha de entrega, fecha de devolución prevista (préstamo), fecha devuelto, depósito de origen, precio/valor declarado, OT, constancia y observaciones. | CAT §1 `SERSOC_PRODUCTOS` | N | O3 | Informado | La asignación muestra todos los campos de `SERSOC_PRODUCTOS`. |
| RF-STK-074 | Constancia de comodato/entrega vinculada a la conformidad de instalación de M10 y guardada en el expediente (T11), con versión aceptada. | BASE §73 (firma y conformidad), AGR-023 | N | O3 | Adoptado | La constancia firmada no cambia al editar luego la asignación. |
| RF-STK-075 | Cambio de equipo (falla o actualización tecnológica) en una sola OT: retiro de la unidad A y aplicación de la unidad B; la A pasa a revisión/RMA; se conserva la historia de ambas. | BASE §7 ("Gestionar cambios de equipo"), CU-07; AGR-026 ("una sustitución conserva historia") | N | O3 | Informado | El contrato muestra A (devuelta) y B (vigente) sin superposición. |
| RF-STK-076 | Seguimiento de devolución en baja: al confirmarse la baja (M09/M10), la asignación pasa a "pendiente de devolución" con plazo; estados devuelto, devuelto incompleto, no recuperado. | BASE §86 ("no asumir que devolver el router equivale a una baja comercial ya procesada") | N | O3 | Informado | Una baja sin retiro a los N días aparece en la bandeja de equipos pendientes. |
| RF-STK-077 | Devolución en mostrador: el socio trae el equipo a la oficina; se recibe con constancia y queda en el depósito de la sucursal en revisión. | BASE §73 (Retiro posterior según modalidad) | N | O3 | Adoptado | Se entrega comprobante de devolución imprimible/enviable. |
| RF-STK-078 | Equipo no devuelto: vencido el plazo, generar **propuesta de cargo** (costo de reposición o importe configurado) para aprobación y facturación por M05; la unidad pasa a "no recuperada". El importe del cargo puede pedirse a M04 con API-TAR-064 `tar.quote` cuando el tenant tiene un cargo por evento aprobado para el tipo de equipo (RN-TAR-246); si no, se usa el costo de reposición de RF-STK-013. Aprobada la propuesta, M13 crea el ítem facturable con `fac.service.upsertBillableItem` de M05 en `billableItems` (clave de idempotencia = id de la propuesta); no usa `preloadedCharges` de M04. | BASE §74 (pendiente: devolución y valorización de equipos), §78 (el costo no se transforma automáticamente en cargo) | E | O6 | A validar (PA-STK-05) | La propuesta no genera deuda hasta su aprobación. |
| RF-STK-079 | El socio ve en el portal/app sus equipos en comodato (modelo, serie, fecha, modalidad, constancia) y cómo devolverlos. | BASE §25, §73; M19 | E | O3 | Adoptado | El socio solo ve equipos de sus contratos. |
| RF-STK-080 | Venta de equipo: salida por venta vinculada al comprobante de M05/M11, titularidad transferida al socio, garantía de venta registrada. | BASE §73 ("si se vende, el tratamiento es distinto"); AGR-026 | E | O4 | Informado | Un equipo vendido sale de existencias propias y queda con estado `sold`. |
| RF-STK-081 | Asociación de equipos al aprovisionamiento: los identificadores de la unidad aplicada viajan a M10 (MikroTik/Radius/OLT); un cambio de equipo publica el evento para reaprovisionar. | BASE §86; DEC-005 | N | O3 | Adoptado | `stk.equipment.swapped` incluye MAC anterior y nueva. |
| RF-STK-082 | La copia de un servicio entre tenants no copia stock, series ni asignaciones; los depósitos referenciados se mapean a depósitos del destino o quedan pendientes. | BASE §81, escenario 82 | N | O2 | Informado | La copia reporta "depósito por defecto sin mapear". |

### 5.8 Inventario físico y ajustes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-083 | Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. | BASE §20 ("Realizar inventarios físicos"); RN-08 §8.1 (operación 4 Conciliación) | N | O8 | A validar (PA-STK-07) | Un conteo de 18 contra 17 teóricos genera diferencia +1 pendiente de ajuste. |
| RF-STK-084 | Ajustes con motivo tipificado (faltante, sobrante, rotura, vencimiento, robo, error de carga, diferencia de inventario), evidencia adjunta y aprobación por umbral de cantidad/importe (T11). No se modifica existencia sin movimiento. | BASE §20 ("Registrar ajustes aprobados"), CU-20 (excepción) | N | O3 | Informado | Un ajuste por encima del umbral queda en "pendiente de aprobación" sin afectar saldos. |
| RF-STK-085 | Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. | BASE §20; RN-08 §15.4 | N | O8 | Adoptado | El cierre lista series faltantes para ajuste individual. |

### 5.9 Stock mínimo y sugerencia de compra

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-086 | Configurar por artículo y depósito (o global): stock mínimo, máximo, punto de pedido, cantidad de reposición, bulto, días de demora del proveedor. | BASE §20 ("Configurar niveles mínimos"); RN-08 §8.1 (`Pedir_segun_SM`), §15.3 (`CAN_REP`, `BULTOS`) | N | O8 | Informado | El artículo muestra su semáforo de reposición. |
| RF-STK-087 | Sugerencia de compra: necesidad = máximo (o reposición) − (disponible + en tránsito + OC pendientes − reservas), redondeada a bultos; propuesta de proveedor habitual y últimas 3 compras de 180 días; se convierte en **requisición** de M12, nunca en OC directa. | DFA M17 (mejora "Stock mínimo con sugerencia de compra"); RN-08 §15.3 `CostoReposicion`, §15.5 `CargaUltimasCompras`; AGR-027 | N | O8 | Informado | Con mín 10, máx 50, disponible 6, OC pendiente 10, sugiere 34 (o 40 si el bulto es 20). |
| RF-STK-088 | Job diario de reposición que genera sugerencias y notifica a compras; tablero de quiebres. | DFA M17 | E | O8 | Adoptado | Un artículo bajo mínimo aparece en la bandeja de compras al día siguiente. |

### 5.10 Valorización y costeo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-089 | Costeo perpetuo según el método aprobado (PPP móvil por defecto, PEPS opcional, identificación específica para serializados), calculado al registrar cada movimiento. | AGR-026 ("método de valoración aprobado"); RN-08 §8.4, §13.8; RN-09 §6.4 (V2 #2341) | N | O3 | A validar (PA-STK-01) | Ingresos de 10 a ARS 100 y 10 a ARS 120 dan PPP ARS 110; una salida de 5 se valoriza a ARS 550. |
| RF-STK-090 | Costo de ingreso desde la recepción (precio de OC/remito); si llega la factura con precio distinto, M12 informa la diferencia y STK registra un **movimiento de valor** (sobre existencia remanente y, por lo ya consumido, al costo de consumo), sin reescribir movimientos históricos; fallback al costo de reposición si no hay precio. | RN-08 §8.4 (`GetIngresosAValorizar`, `ActualizarPrecios`), §7.6 (`ModificaPrecioStock_Remito`) | N | O8 | Adoptado | Una diferencia de ARS 1.000 sobre 10 unidades con 4 consumidas ajusta 600 en existencia y 400 en costo de consumo. |
| RF-STK-091 | Valorización a una fecha con métodos alternativos para análisis (PEPS, UEPS, PPP, precio de venta, precio de costo), sin alterar el costo contable; productos con saldo negativo se informan aparte y no se valúan. | RN-08 §8.4, §15.4 `GetValorizacionStock`; RN-09 §6.4 (V2 #2341) | E | O8 | Adoptado | El informe muestra el método usado y lista aparte los negativos. |
| RF-STK-092 | Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. | RN-08 §8.4, §15.4 `clsRevaluacion`; RN-09 §6.4 (V2 #3041, #3042) | E | O8 | Adoptado | Falta un índice del período ⇒ la revaluación se aborta con error descriptivo. |
| RF-STK-093 | Cierre de stock por período: congela movimientos y costo hasta la fecha; reapertura con permiso y auditoría. | RN-08 §1.1 (P432), §13.3 | N | O8 | Adoptado | Con cierre al 31/10, un movimiento del 30/10 se rechaza. |
| RF-STK-094 | Eventos económicos a M15 por: ingreso, consumo (con destino y centro de costo), ajuste, entrega y retiro de comodato, venta (costo de mercadería vendida), revaluación, fabricación, baja; con importes y dimensiones (servicio, centro de costo, obra). | RN-08 §6.5 (`GenerarAsientoStock`, P2734), §13.1; DEC-009 | N | O3 (emisión) / O5 (consumo por M15) | Adoptado | Cada evento lleva `sourceDocumentId` y M15 no lo contabiliza dos veces. |
| RF-STK-095 | Valorización de existencias por estado de custodia (depósitos, cuadrillas, domicilios de socios, proveedores) conciliable con contabilidad. | AGR-026 (criterio de aceptación) | N | O8 | Adoptado | El total valorizado = suma por custodia = saldo contable de bienes de cambio + equipos en comodato. |

### 5.11 Bienes de uso

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-096 | Ficha de bien de uso: número, descripción, observaciones, serie, artículo, fecha de alta, usuario de alta, fecha de compra, factura de compra, fecha de afectación, fecha de baja, importe de origen, vida útil (años), porcentaje a amortizar, valor residual, amortización acumulada, marca de mejora y bien principal, rubro, sucursal, ubicación física, responsable. | CAT `BIENES_USO`; RN-08 §9; INV `abm_Bienes_Uso` | N | O8 | Informado | La ficha muestra valor residual contable = origen + mejoras − disminuciones − amortización acumulada. |
| RF-STK-097 | Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. | RN-08 §9, §15.4 `RegistrarBienDeUso`; AGR-026 ("no activar ese alcance por inferencia para todo artículo") | N | O8 | Adoptado | Recibir 1 OLT marcada bien de uso crea un borrador de bien que el responsable confirma. |
| RF-STK-098 | Amortización lineal: tasa anual = porcentaje a amortizar / vida útil; mensual = anual / 12; desde la afectación (o inicio del período) hasta fin del período, baja o fin de vida útil, con prorrateo por días en meses parciales; solo bienes afectados, no dados de baja ni totalmente amortizados. | RN-08 §9 (`BienesDeUso_Amortizacion`) | N | O8 | Adoptado | Bien de ARS 1.200.000, 100 %, 5 años, afectado el 16/03: marzo amortiza 20.000 × 16/31. |
| RF-STK-099 | Mejoras como incorporaciones vinculadas al bien principal con su propia amortización, y disminuciones de valor con fecha e importe. | CAT `BIENES_USO_DISM`; RN-08 §9 (`Procesar_Deduccion`); INV `abm_bienes_uso_deduc` | E | O8 | Adoptado | La mejora se muestra separada en el cuadro y el asiento. |
| RF-STK-100 | Distribución del bien por centros de costo con porcentaje (suma 100 %), aplicada a la amortización. | CAT `BIENES_USO_CTSEC`; RN-08 §15.3 `Get_Secciones_Bienes`, `Modificar_Asignaciones` | E | O8 | Adoptado | No se guarda una distribución que no sume 100 %. |
| RF-STK-101 | Historial de cambios de la ficha (cada versión con todos los campos). | CAT `BIENES_USO_HST`; RN-08 §15.3 `GuardarHistorial` | N | O8 | Adoptado | Cambiar la vida útil deja la versión anterior consultable. |
| RF-STK-102 | Corrida de amortización por período (mensual por defecto; anual opcional), simulable, que emite `stk.depreciation.posted` por bien/rubro/centro y actualiza acumulados; reversión de una corrida revierte acumulados. | RN-08 §9 (al guardar asientos se actualizan acumulados; al borrar se revierten), §15.2 (defecto de eliminación masiva) | N | O8 | Adoptado | Revertir la corrida de octubre deja acumulados como al 30/09. |
| RF-STK-103 | Valores históricos y ajustados por inflación (índice por período), con amortización histórica y ajustada, y separación opcional de la cuenta de revalúo. | CAT `BIENES_USO_AMORT` (`AJUSTE_INFL`, `VAL_ORIG_AJUS`, `AMOR_ACUM_AJUS`, `AMOR_EJER_AJUS`); RN-08 §9 (P3076, P2936) | E | O8 | Adoptado | El cuadro muestra columnas histórica y ajustada. |
| RF-STK-104 | Baja del bien (venta, destrucción, robo, obsolescencia, donación) con fecha, valor de recupero y resultado; si es serializado, la unidad pasa a descartada/vendida; emite evento a M15. | RN-08 §9 (asientos de baja), §15.4 (salida registra `FEC_BAJA`); INV `abm_Bienes_Uso` (`txtImporteRecupero`) | N | O8 | Adoptado | La baja con recupero ARS 100.000 y residual 80.000 informa resultado +20.000. |
| RF-STK-105 | Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) por rubro y ejercicio; exportación. | RN-08 §15.2 (`Get_Cuadro_BienUso`, `Get_Cuadro_Amortizacion`); INV `clsBienesUso.Exportar` | N | O8 | Adoptado | El cuadro cuadra con las cuentas de M15. |
| RF-STK-106 | Bienes de uso serializados (vehículos, OLT, herramientas de medición) vinculados a su unidad para trayectoria y custodia. | BASE §7; MER-020 | E | O8 | Adoptado | La ficha del bien enlaza la trayectoria de su serie. |
| RF-STK-107 | Eliminación de un bien solo si no tiene amortizaciones ni movimientos; si los tiene, se anula con reversión automática (no asientos manuales). | RN-08 §15.3 `Eliminar_BienesyAsignaciones` | N | O8 | Adoptado | Anular un bien con 3 amortizaciones genera la reversión. |

### 5.12 RMA, garantías, reparaciones y recepción técnica

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-108 | Caso RMA vinculado a la serie: fecha, usuario que recibió, contrato de origen, contacto (nombre, teléfono, horario), artículo, modelo, serie, proveedor, observación de recepción, problema informado, diagnóstico, garantía (sí/no y vencimiento), resolución, costo, números de RMA del proveedor, fechas de envío y retorno. | MER-020; CAT `RMA_PRODUCTOS`; DFA M17 | N | O8 | Informado | Un RMA no se crea sin serie para artículos serializados. |
| RF-STK-109 | Estados configurables del RMA con historial (fecha, usuario, observación) y notificación por email/plantilla al cambiar de estado cuando se configura. | CAT `RMA_HISTORIAL`; RN-08 §8.2 (`clsRMA` mail por estado; `PuedeEnviarMail`, `GetMailFormat`) | N | O8 | Adoptado | Pasar a "enviado al proveedor" envía la plantilla configurada. |
| RF-STK-110 | Envío a proveedor: transferencia al depósito "en proveedor"; retorno reparado (misma serie), reemplazado (nueva serie, la anterior queda como baja en proveedor), o rechazado (vuelve como dañado); nota de crédito o reposición gestionada por M12. | MER-020; BASE §99 matriz | N | O8 | Informado | El reemplazo crea la nueva unidad con trayectoria que referencia a la anterior. |
| RF-STK-111 | Reparación interna: consumo de repuestos con destino el caso RMA, horas y costo; resultado apto/no apto. | AGR-026 ("Gestionar reparación") | E | O8 | Adoptado | El costo del RMA suma repuestos consumidos. |
| RF-STK-112 | Garantías por serie: garantía de proveedor (desde la recepción, meses por artículo/proveedor) y garantía de venta al socio; aviso de garantía vigente al abrir RMA. | MER-020; AGR-026 | N | O8 | Informado | Abrir RMA de una ONU con 3 meses de uso y garantía de 12 indica "en garantía". |
| RF-STK-113 | Revisión de equipos retirados: bandeja de unidades "retiradas pendientes de revisión" con decisión: apto para reutilizar (vuelve a disponible, opcionalmente "reacondicionado"), reparar, RMA, descarte. | BASE §73 (Retiro posterior: "Conserva historia y condición"); AGR-026 | N | O3 | Adoptado | Un equipo retirado no vuelve a disponible sin revisión. |
| RF-STK-114 | Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con descripción, notas, ícono y nivel. | CAT `RECEPCIONES`, `ITRE_PRO`, `ITRE_EST`, `ESTADOS_RECEP` | E | O8 | Adoptado | Un equipo de cliente en reparación no suma a existencias propias. |
| RF-STK-115 | Baja técnica y disposición final (descarte, reciclado, destrucción certificada) con constancia. | AGR-026 ("baja técnica y disposición") | E | O8 | Adoptado | La unidad descartada queda con certificado adjunto y sin existencia. |

### 5.13 Fabricación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-116 | Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. | CAT `PRODFAB`, `HIS_PRODFAB`; RN-08 §10.1 (`ClonarEstructura`, `GuardarEstruturaHistorica`) | E | O10 | Adoptado | Modificar la estructura crea una nueva versión; las órdenes guardan la versión usada. |
| RF-STK-117 | Divisiones de producto (descomposición con tipo y origen de operación, cantidad, medida y coeficiente) e historial. | CAT `PRODFAB_DIVISIONES`, `HIS_PRODFAB_DIVISIONES`; INV `clsOrdeFab.GuardarDivisiones`, `EliminarDivision` | X | O10 | Adoptado | Dividir 1 bobina de 1000 m en tramos de 50 m genera 20 unidades con coeficiente. |
| RF-STK-118 | Etapas de fabricación por producto con orden, descripción, duración y observaciones. | CAT `ETAFAB` | E | O10 | Adoptado | La orden muestra el avance por etapa. |
| RF-STK-119 | Orden de fabricación con comprobante, fechas de lanzamiento y fin previstas y reales, responsable, etapa, observaciones, productos a producir (cantidad, vínculo a comprobante de venta, cantidad en partes, reasignada, con cambio de producto), componentes (cantidad, retirada, costo, días de anticipación); extensiones de plazo con motivo. | CAT `ORDEFAB`, `ORPRFAB`, `ORCOFAB`, `ORDAFAB`, `ORDEFAB_EXT`; RN-08 §10.2, §15.5 | E | O10 | Adoptado | Extender el plazo registra el nuevo fin y quién lo pidió. |
| RF-STK-120 | Ciclo de la orden: generada → lanzada → finalizada; cancelada; anulada (solo generada, o lanzada sin partes, o con todo lo producido reasignado), liberando comprometidos y desvinculando el comprobante de venta. | RN-08 §10.2, §15.5 (`Lanzar`, `Finalizar`, `Cancelar`, `Anular`, `Eliminar_ItemsComprometidos`) | E | O10 | Adoptado | Anular una orden con partes no reasignados se rechaza. |
| RF-STK-121 | Al finalizar: ingreso de productos terminados al depósito de producción al costo calculado y egreso de componentes del depósito de componentes, neteando productos que también son componentes; los trazables piden series. | RN-08 §10.2 | E | O10 | Adoptado | Finalizar una orden de 10 medidores armados consume sus componentes una sola vez. |
| RF-STK-122 | Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos fabricados y fecha de fin real de la orden cuando todo está completo. | CAT `OF_PARTE_PRODUCCION`, `OF_PARTE_ITEM`, `OF_PARTE_COMPONENTE`; RN-08 §10.3, §15.5 (`MarcarFabricados`, `VerificarExistenciaComponente`); RN-09 §6.4 (V2 #3003) | E | O10 | Adoptado | Con consumo al lanzar activo, lanzar el parte genera la salida de componentes. |
| RF-STK-123 | Productos dañados: cambio de producto, destrucción total o reasignación a otra orden, usando una orden genérica configurable. | RN-08 §10.2 (`TipoDaño`, `ProcesarProductosDañados`); RN-09 §6.4 (V2 #3040) | X | O10 | Adoptado | Un producto destruido genera baja con motivo y no se cuenta como fabricado. |
| RF-STK-124 | Números de serie de productos fabricados con formato configurable (por defecto parte + orden + conjunto + matrícula + correlativo, 30 caracteres) y rastreo del parte original por componente trazable. | RN-08 §15.5 (`GetLista_NrosSerie_Item`, `GetNumParteOriginal`) | E | O10 | Adoptado | El medidor fabricado muestra en su trayectoria los componentes serializados usados. |
| RF-STK-125 | Costo de fabricación: componentes al costo de consumo del método vigente (PEPS en ProCoop) o costo estándar si no hay valorización, más mano de obra (producto de mano de obra × coeficiente de la clasificación o peso) y costo fijo; precio de venta sugerido = costo × (1 + margen). Costo recursivo multinivel. | RN-08 §10.1, §10.4, §15.3 (`Get_CostoFijo`), §15.5 (`CostoProducto`, `GetPrecioProducto_SegunComponentes`); RN-09 §6.4 (V2 #3015) | E | O10 | Adoptado | El costo del producto terminado = Σ componentes + mano de obra + fijo. |
| RF-STK-126 | Aprovisionamiento de fabricación (MRP simple): para las órdenes lanzadas del rango no finalizadas, calcula necesidades de componentes a la fecha de lanzamiento + días del componente, descuenta lo en proceso y el stock, excluye componentes cuyo stock − requerido ≥ mínimo, muestra proveedor habitual y últimas compras, y genera **requisiciones por proveedor** en M12. | RN-08 §10.2, §15.5 (`frmOrdenAprovisionamiento_Handler`); RN-09 §6.4 (V2 #168) | E | O10 | Adoptado | Genera una requisición por proveedor con los faltantes. |
| RF-STK-127 | Eventos de fabricación: componentes a productos en proceso al lanzar/consumir; productos terminados contra productos en proceso al finalizar, repartiendo el costo por proporción de cantidades. | RN-08 §10.4 | E | O10 | Adoptado | M15 recibe 2 eventos por orden con importes que cuadran. |
| RF-STK-128 | Configuración: responsable por defecto del parte, no permitir finalizar órdenes manualmente (solo por partes), depósitos por defecto de producción y componentes. | RN-09 §6.4 (V2 #3057, #3171, #165, #166) | E | O10 | Adoptado | Con la restricción activa, el botón Finalizar de la orden no aparece. |
| RF-STK-129 | Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. | INV `clsOrdeFab` (`GetDatosInformeInsumosPendientesDeUtilizar`, `GetDatosInformeMatriculasGeneradas`, `GetDatosInformeOrdeFab`, `GetProductosFabricadosEnStock`, `GetOrdenesPendientes_PorProducto`), `clsOfParteProduccion.GetDatosInforme_ProductosDañados` | E | O10 | Adoptado | Cada informe exporta XLSX/CSV/PDF. |

### 5.14 Unidades de gasto, stock por servicio, vivienda y otros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-STK-130 | ABM de unidades de gasto (descripción, observaciones, centro de costo asociado) y uso como destino en vales y retiros de materiales. | CAT `UNIDADES_GASTOS`, `IT_RETM.ID_UNIDADES`; DFA M17 | E | O8 | A validar (PA-STK-06) | Un vale a la unidad "Mantenimiento edificio" imputa al centro asociado. |
| RF-STK-131 | Stock por servicio: cada movimiento lleva servicio (directo o por distribución explícita) y las compras compartidas se asignan sin duplicar cantidades ni importes; informes de existencias, consumos y reposición por servicio. | BASE §78 OPE-002, CU-OPE-01, escenarios 79–80; §80 pendientes | N | O3 (campo) / O8 (informes) | Informado | La suma de consumos por servicio = consumo total. |
| RF-STK-132 | Servicios sin stock comercial: un servicio puede declararse sin inventario comercial (banco de sangre, restos en cementerio parque), aunque use materiales internos con stock. | BASE §90, §91, escenario 94 | N | O2 | Informado | El servicio banco de sangre no ofrece artículos de stock en su catálogo comercial. |
| RF-STK-133 | Materiales para planes de vivienda: reserva por tipología, retiro, devolución de reservado y devolución (operación vivienda). | RN-08 §8.1 (operación 13), §12.3 (P755, P2670); INV `frmMaterialesViv` | X | O10 | Adoptado | Devolver reservado libera la reserva del plan. |
| RF-STK-134 | Órdenes de mantenimiento (OM) como destino de consumo, con su costo. | RN-08 §8.1 (operación 6), §6.5 | E | O8 | Adoptado | Consumo con destino OM aparece en el costo de mantenimiento. |
| RF-STK-135 | Catálogo de informes de stock (sección 15) con filtros, agrupaciones, exportación y programación. | DFA M17 (Informes de Stock); INV `clsInformes_Stock` | N | O3 (básicos) / O8 (completos) | Adoptado | Cada informe declara universo, fecha de corte y fórmula. |
| RF-STK-136 | Migración desde ProCoop de artículos, depósitos, ubicaciones, series con trayectoria, saldos iniciales valorizados, asignaciones en comodato vigentes, bienes de uso con acumulados, RMA abiertos y estructuras de fabricación. | AGR-018; RN-08 §13.11 | N | O3 (equipos y comodatos de la piloto) / O11 | Adoptado | Conciliación de la sección 19 sin diferencias. |
| RF-STK-137 | Auditoría de cada cambio de configuración y de cada operación (antes/después, actor, origen). | BASE §29, §54 | N | O3 | Informado | La auditoría de un ajuste muestra aprobador y evidencia. |
| RF-STK-139 | **Movimientos de stock de la entrega de gas envasado** (DEC-082; RF-TEC-239 de M10): al cerrar una OT de operación `bottledGasDelivery`, M13 consume el bloque `bottledGas` de EVT-TEC-07 `tec.workOrder.closed` (`deliveryId`, `warehouseId?`, `vehicleId?`, `delivered[{ inventoryItemId, serialUnitId?, containerType, quantity }]`, `retrievedEmpties[{ inventoryItemId, serialUnitId?, containerType, quantity, condition }]`, `receiptDocumentId`, `deliveredAt`; M10 §12) y registra en un mismo documento (idempotente por `workOrderId`): (1) egreso de los envases **llenos** entregados desde el depósito o el depósito del vehículo (`warehouseId`) con operación `bottledGasDelivery`, por artículo y tipo de envase; si el envase es serializado, la unidad de `serialUnits` pasa a `applied` con `contractId` (envase en poder del socio); (2) ingreso de los envases **vacíos** retirados con operación `emptyContainerReturn` al depósito de vacíos (`stockState = empty`); si el vacío es serializado, su unidad vuelve a `available` con ese estado de stock. La diferencia entre llenos entregados y vacíos retirados se informa en el documento y en el saldo de envases por contrato; no ajusta stock. El gas lo factura M05 desde la venta; M13 solo valoriza el movimiento al costo. | DEC-082; HUE-GAS-02; RF-TEC-239 | E | O8 | Adoptado | Una OT con 2 garrafas de 10 kg entregadas y 2 vacías retiradas genera un egreso de 2 llenas del vehículo y un ingreso de 2 vacías; reprocesar el mismo cierre no duplica movimientos. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros |
|---|---|---|---|---|
| RN-STK-001 | Solo los artículos con "lleva stock" generan movimientos de cantidad. | Solo productos con `LLE_STO` (RN-08 §8.1) | Replicar | — |
| RN-STK-002 | Un kit se explota en sus componentes al moverse; el kit no tiene saldo propio. | Combos explotados (`Nuevo_MovPro`, RN-08 §8.1); combos excluidos de valorización (§15.4) | Replicar | — |
| RN-STK-003 | Una cantidad negativa en un renglón se convierte en el movimiento de sentido inverso y se guarda en positivo. | `Nuevo_MovPro`, `Nuevo_MovProUnitario` (RN-08 §8.1, §15.4) | Mejorar: la API no acepta cantidades negativas; el sentido es explícito (`direction`). | — |
| RN-STK-004 | Si el artículo usa ubicaciones, un movimiento se desdobla por ubicación. | Un movimiento por ubicación (RN-08 §8.1) | Replicar | — |
| RN-STK-005 | Las existencias se derivan del libro de movimientos; los saldos materializados son una proyección verificable. | Stock calculado sumando `MOV_PRO`, sin tabla de saldos (RN-08 §8.1) | Mejorar: saldos materializados en la misma transacción + job de verificación (JOB-STK-01). | — |
| RN-STK-006 | Los movimientos no se editan ni se eliminan; se anulan con contramovimiento. | `EliminarMovimiento` borra (RN-08 §15.4) | Reemplazar | — |
| RN-STK-007 | No se anula un movimiento de un serializado con movimientos posteriores ni la entrada de un bien de uso ya dado de baja; anular una salida restaura el estado anterior de la unidad. | `EliminarMovimiento` (RN-08 §15.4) | Replicar (sobre anulación) | — |
| RN-STK-008 | Los serializados nunca quedan con saldo negativo ni en dos ubicaciones a la vez. | Validación de trazables (RN-08 §15.4) | Replicar y reforzar con índice único de ubicación vigente | — |
| RN-STK-009 | La política de stock negativo para no serializados se define por tipo de operación (transferencias, vales, consumos, ventas, fabricación) con valores `block` / `warn` / `allow`. | P373 (transferencias), P2525 (vales) (RN-09 §6.4) | Mejorar (unificado por operación) | PRM-STK-005, PRM-STK-006 |
| RN-STK-010 | Si una operación deja el saldo por debajo del mínimo, se advierte (no bloquea). | P2565 (RN-09 §6.4) | Replicar | PRM-STK-008 |
| RN-STK-011 | Ninguna operación con fecha efectiva menor o igual a la fecha de cierre de stock se acepta. | `Nucleo.ModuloCerrado` con P432 (RN-08 §1.1) | Reemplazar por período de módulo `stk` de T04/M15 (abierto/cerrado/bloqueado) | PRM-STK-012 |
| RN-STK-012 | Entregar a una cuadrilla/técnico es transferencia de custodia: sale del depósito de origen y entra al depósito de cuadrilla; no es consumo ni salida de la existencia propia. | No existe distinción: vale de salida (BASE §20, §73 lo exige) | Reemplazar (requisito BASE) | — |
| RN-STK-013 | Una entrega queda "pendiente de aceptación" hasta que el receptor la acepta; durante ese lapso la existencia está "en tránsito" y no disponible para el técnico. | `MOV_PRO_EXTRAS` registra quién recibe (CAT) | Mejorar | PRM-STK-014 |
| RN-STK-014 | El consumo o la aplicación registrados desde la OT descuentan **solo** la custodia del técnico/cuadrilla; si el material no está en su custodia, se toma del depósito indicado y se registra el origen, nunca de ambos. | Materiales utilizados descuentan del depósito elegido (RN-08 §8.2) | Mejorar (BASE §73: "No se descuenta nuevamente del depósito central") | PRM-STK-015 |
| RN-STK-015 | Cada operación de campo lleva `clientMutationId`; el servidor guarda la clave por tenant y devuelve el resultado original ante un reintento. | No existe | Mejorar (AGR-016, CNX §3.7) | — |
| RN-STK-016 | Una visita fallida no genera aplicación ni consumo de equipos; los materiales efectivamente usados en una visita fallida (por ejemplo cable tendido) sí pueden consumirse con justificación. | No existe | Mejorar (BASE §73) | — |
| RN-STK-017 | Si la serie aplicada no coincide con la reservada, se libera la reservada; si la aplicada no está en la custodia del técnico, la aplicación queda "pendiente de validación" y la unidad no se libera de su custodio anterior hasta validar. | No existe | Mejorar (BASE §73 controles) | PRM-STK-016 |
| RN-STK-018 | Una unidad solo puede estar aplicada a un contrato a la vez; una aplicación nueva exige la unidad en estado disponible-en-custodia o reservada para esa OT. | `Validar_Ingreso`: error si está asignada a un suministro (RN-08 §15.4) | Replicar y ampliar a aplicación | — |
| RN-STK-019 | La compatibilidad modelo–tecnología–servicio (por ejemplo ONU GPON solo en red GPON) se valida al reservar y aplicar si está configurada. | No existe | Mejorar (BASE §7 "instalaciones incompatibles") | PRM-STK-017 |
| RN-STK-020 | El número de serie es único dentro del lote cargado, por artículo; los identificadores secundarios son únicos por tenant y tipo. | `Validar_Ingreso` (RN-08 §15.4) | Replicar y ampliar | — |
| RN-STK-021 | Al ingresar una serie que existe fuera de stock (retirada, devuelta), se pide confirmación y se continúa la misma unidad; si ya está en stock o aplicada, es error. | `Validar_Ingreso` (RN-08 §15.4) | Replicar | — |
| RN-STK-022 | Toda entrada de un trazable (salvo transferencia interna) actualiza su costo de unidad. | `RegistrarTrazabilidad` actualiza `PRE_TRH` (RN-08 §15.4) | Replicar para identificación específica | PRM-STK-002 |
| RN-STK-023 | La reserva reduce el disponible pero no el físico; disponible = físico en estado disponible − reservas activas. | Comprometido calculado (RN-08 §15.3) | Replicar con entidad propia | — |
| RN-STK-024 | Una reserva vence a los N días sin ejecución de la OT, salvo que la OT siga agendada; al vencer se notifica al supervisor. | No existe | Mejorar (AGR-025) | PRM-STK-018 |
| RN-STK-025 | La confirmación de una reserva usa control optimista (`version`) sobre el saldo/unidad; ante conflicto, se rechaza la segunda. | No existe (`GetMaxValue + 1`, RN-08 §1.3) | Mejorar | — |
| RN-STK-026 | El destino de un consumo es obligatorio y uno solo por renglón: OT, OM, obra, contrato, servicio, unidad de gasto, plan de vivienda, RMA u orden de fabricación. | Vales con obra opcional; retiros por OT/obra (RN-08 §8.2; CAT `RETI_MAT`) | Mejorar (BASE §20) | PRM-STK-019 |
| RN-STK-027 | El servicio del movimiento se deriva del destino (contrato/OT) o del servicio por defecto del artículo; si una operación abastece varios servicios, se registra una distribución explícita que suma 100 %. | No existe | Mejorar (BASE §78) | — |
| RN-STK-028 | El costo de una salida es el costo vigente al momento según el método; no cambia por ingresos posteriores con fecha efectiva anterior salvo recálculo controlado dentro de un período abierto. | Valorización a demanda reescribiendo `PRE_MOV` (RN-08 §8.4) | Reemplazar (costo perpetuo) | PRM-STK-001 |
| RN-STK-029 | Un ingreso sin precio toma el precio de la recepción/OC; si no hay, el costo de reposición del artículo; se marca "costo provisorio" hasta la factura. | Ingresos sin precio completados con factura o `PRE_CSI` (RN-08 §8.4) | Replicar con marca de provisorio | — |
| RN-STK-030 | Una diferencia entre el costo de recepción y el de factura se registra como movimiento de valor: la parte proporcional a la existencia remanente ajusta el costo; la parte consumida va a costo de consumo/diferencia de precio. | Recalcula el precio del movimiento del remito por promedio de facturas (RN-08 §7.6) | Reemplazar | — |
| RN-STK-031 | Los productos con saldo negativo no se valorizan y se informan aparte. | `GetValorizacionStock` (RN-08 §15.4) | Replicar | — |
| RN-STK-032 | La transferencia entre depósitos no cambia el costo unitario (PPP por tenant) ni genera evento económico, salvo cambio de custodia contable (por ejemplo a domicilio del socio en comodato). | Remito entre depósitos excluido de valorizar (RN-08 §15.4) | Replicar | PRM-STK-001 |
| RN-STK-033 | Revaluación por índice: factor = índice del mes "hasta" / índice del mes del movimiento (o del mes "desde" si el movimiento es anterior); si falta un índice del período, se aborta; artículos sin rubro o rubro sin índice impiden revaluar. | `RevaluarAutomaticamente`, validación previa (RN-08 §15.4); en enero toma diciembre del año anterior [VERIFICAR] | Replicar como movimiento de valor | PRM-STK-022 |
| RN-STK-034 | La revaluación automática al costo se dispara al actualizar costos de reposición si está configurada, con obra y responsable por defecto. | P3041/P3042 (RN-09 §6.4) | Replicar (obra y responsable como dimensiones del evento) | PRM-STK-023, PRM-STK-024 |
| RN-STK-035 | La aplicación de un equipo en **comodato** no es consumo: la unidad sigue siendo existencia propia en custodia del socio y se valoriza; la venta sí es salida con costo de mercadería vendida. | Asiento opcional de comodato (P2734, RN-08 §6.5) | Mejorar (AGR-026) | PRM-STK-025 |
| RN-STK-036 | La asignación conserva la modalidad vigente al momento de la entrega; un cambio de modalidad (por ejemplo comodato → venta) es un evento explícito con su documento. | `SERSOC_PRODUCTOS` sin modalidad explícita (CAT §1) | Mejorar | — |
| RN-STK-037 | La baja comercial no cierra la asignación: solo el retiro o la devolución registrada la cierra; mientras tanto la asignación está "pendiente de devolución". | No existe | Mejorar (BASE §86) | PRM-STK-026 |
| RN-STK-038 | Vencido el plazo de devolución, se genera una propuesta de cargo por equipo no devuelto que requiere aprobación; nunca un cargo automático. | No existe | Mejorar (BASE §78: el costo no se transforma automáticamente en cargo) | PRM-STK-027 |
| RN-STK-039 | Un equipo retirado queda "pendiente de revisión"; no vuelve a disponible sin decisión de revisión. | No existe | Mejorar (AGR-026) | — |
| RN-STK-040 | Un ajuste exige motivo, evidencia cuando el motivo lo requiere y aprobación si supera el umbral de cantidad o importe; sin aprobación no afecta saldos. | No existe aprobación de ajustes | Mejorar (BASE §20) | PRM-STK-028, PRM-STK-029 |
| RN-STK-041 | Una rendición de cuadrilla solo se cierra con diferencia cero o con ajustes aprobados por cada diferencia. | No existe | Mejorar (BASE §20, CU-20) | PRM-STK-030 |
| RN-STK-042 | En un inventario físico, la diferencia = contado − (instantánea + movimientos posteriores a la instantánea en el alcance contado). | Conciliación de stock (operación 4) sin regla explícita | Mejorar | PRM-STK-031 |
| RN-STK-043 | La sugerencia de compra = (máximo o punto de pedido + reposición) − (disponible + en tránsito + OC pendientes − reservas), redondeada hacia arriba a bultos; cantidad a reponer = `CAN_REP` − stock actual × bultos en ProCoop. | `Pedir_segun_SM`, `CostoReposicion` (RN-08 §8.1, §15.3) | Mejorar | PRM-STK-032 |
| RN-STK-044 | La sugerencia de compra se convierte en requisición de M12 (no en OC); la autorización sigue el circuito de compras. | `GenerarPedido` genera OC directamente (RN-08 §15.5) | Reemplazar (AGR-027) | — |
| RN-STK-045 | El ingreso de stock por compras solo ocurre con recepción física confirmada (M12); la factura sin recepción no mueve stock de bienes. | P583: la factura puede mover stock (RN-08 §7.6) | Reemplazar (AGR-027) | — |
| RN-STK-046 | Un ítem recibido "pendiente" (sin ingreso a stock) que pasa a recibido genera el ingreso; uno recibido que pasa a pendiente exige un movimiento inverso explícito (no ajuste manual). | `ValidarItemAnterior` avisa ajustar a mano (RN-08 §15.3) | Mejorar | — |
| RN-STK-047 | El alta de un bien de uso desde stock se propone (borrador) para artículos marcados bien de uso; nunca se activa por inferencia. | `RegistrarBienDeUso` automático (RN-08 §9, §15.4) | Mejorar (AGR-026) | PRM-STK-033 |
| RN-STK-048 | Amortización lineal: anual = % amortizable / vida útil; mensual = anual / 12; prorrateo por días en el primer y último mes; se amortiza desde la afectación hasta fin del período, baja o fin de vida útil. Mejoras y productos se informan por separado. | `BienesDeUso_Amortizacion` (RN-08 §9) | Replicar | PRM-STK-034, PRM-STK-035 |
| RN-STK-049 | Solo se amortizan bienes afectados, no dados de baja y no totalmente amortizados; la amortización acumulada nunca supera origen + mejoras − disminuciones − valor residual. | RN-08 §9 | Replicar | — |
| RN-STK-050 | Con valores históricos habilitados, la amortización usa origen y amortización históricos; el ajuste por inflación usa índices por período y puede separar la cuenta de revalúo. | P3076, P2936 (RN-08 §9) | Replicar | PRM-STK-036, PRM-STK-037 |
| RN-STK-051 | Al contabilizar una corrida se actualizan acumulados; al revertirla se restauran. La reversión masiva también revierte acumulados. | Eliminación individual revierte; masiva no (defecto, RN-08 §15.2) | Mejorar (corrige defecto) | — |
| RN-STK-052 | No se elimina un bien con amortizaciones; se anula con reversión automática. | Pide asientos manuales (RN-08 §15.3) | Reemplazar | — |
| RN-STK-053 | La distribución por centros de costo del bien suma 100 %; sin distribución, se usa el centro por defecto del rubro/sucursal. | `Get_Secciones_Bienes` (asignadas primero, resto 0 %) (RN-08 §15.3) | Replicar con validación de suma | — |
| RN-STK-054 | Un RMA de artículo serializado requiere la serie; abrir un RMA cambia el estado de la unidad a "en RMA" y bloquea su reserva. | `clsRMA.Validar_Ingreso` (INV) | Replicar | — |
| RN-STK-055 | Cada cambio de estado del RMA se registra en el historial y, si el estado está marcado "notifica", se envía la plantilla al contacto/proveedor por el centro de comunicaciones (T09). | `clsRMA` mail por estado (RN-08 §8.2) | Replicar sobre T09 | PRM-STK-038 |
| RN-STK-056 | Un reemplazo del proveedor crea una nueva unidad (nueva serie) enlazada a la original; la original queda "baja en proveedor" con su historia. | No explícito | Mejorar (MER-020) | — |
| RN-STK-057 | Los equipos de clientes en recepción técnica y los de propiedad del socio no forman parte de la existencia propia ni de la valorización. | `RECEPCIONES` separado (CAT) | Replicar | — |
| RN-STK-058 | Etapas de la orden de fabricación: 0 generada, 1 lanzada, 2 finalizada, 3 anulada, 4 cancelada. | `COD_ETA` (RN-08 §15.5) | Replicar como enum textual | — |
| RN-STK-059 | Anular una orden solo si está generada, o lanzada sin partes, o con todo lo producido reasignado; libera comprometidos y desvincula el comprobante de venta. Cancelar y anular informan error si no se guardan. | `Anular` (defecto: devuelve éxito aunque falle) (RN-08 §15.5) | Replicar y corregir defecto | — |
| RN-STK-060 | Un renglón de orden queda fabricado cuando lo producido iguala lo pedido y todos sus partes están finalizados; cuando todos los renglones están completos se registra el fin real. No cambia la etapa automáticamente. | `MarcarFabricados` (RN-08 §15.5) | Replicar | — |
| RN-STK-061 | Disponibilidad de componentes para un parte = stock − comprometido en partes abiertos, en decimal. | `VerificarExistenciaComponente` convierte a entero (defecto, RN-08 §15.5) | Replicar y corregir (decimales) | — |
| RN-STK-062 | Al lanzar el parte se consumen componentes si está configurado; si no, al finalizar; nunca dos veces. | P3003 (RN-08 §10.3) | Replicar | PRM-STK-040 |
| RN-STK-063 | Al finalizar la orden se netean productos que también son componentes y se ingresan terminados al depósito de producción. | RN-08 §10.2 | Replicar | PRM-STK-041, PRM-STK-042 |
| RN-STK-064 | Una orden admite un parte para un producto si lo incluye y la cantidad pedida menos lo ya cargado en partes cubre la necesaria; además, la orden debe estar lanzada. | `OrdenDisponible` no mira la etapa (RN-08 §15.5) | Mejorar (controla etapa) | — |
| RN-STK-065 | Costo de producto fabricado recursivo con costo (no precio de venta) por defecto; precio de venta sugerido = costo × (1 + margen). | `CostoProducto` usa precio de venta por defecto [VERIFICAR] (RN-08 §15.5) | Reemplazar (costo por defecto) | — |
| RN-STK-066 | MRP: necesidad de cada componente a fecha de lanzamiento + días del componente; en proceso = órdenes con lanzamiento real; se excluyen componentes con stock − requerido ≥ mínimo. | `ProcesarRequerimientos`, `EliminarPrevistos` (RN-08 §15.5) | Replicar | PRM-STK-043 |
| RN-STK-067 | El reparto del costo de componentes entre productos terminados de una orden es proporcional a las cantidades. | `Fabricacion_Finalizado` (RN-08 §10.4) | Replicar (con opción de coeficientes por división) | — |
| RN-STK-068 | Un artículo con disponibilidad por módulo "no disponible" no puede usarse en ningún documento nuevo. | `PROD_SERV = 6` (RN-08 §15.4) | Replicar como banderas | — |
| RN-STK-069 | La matrícula del artículo es única si se habilita la validación. | P3049 (RN-08 §12.4) | Replicar | PRM-STK-021 |
| RN-STK-070 | Las propiedades extendidas marcadas únicas no se repiten entre unidades. | `DATOSEXT UNICO` (RN-08 §15.4) | Replicar | — |
| RN-STK-071 | Los IDs y números de documento se asignan con secuencias atómicas por tenant, tipo y sucursal, no con máximo + 1. | `GetMaxValue + 1` (solo `MOV_PRO` con bloqueo) (RN-08 §1.3) | Reemplazar | — |
| RN-STK-072 | Las capabilities se validan en servicio, incluidas operaciones masivas y web. | Permisos solo en pantalla (RN-08 §1.4, §15.3) | Reemplazar | — |
| RN-STK-073 | La copia de un servicio no copia stock, series, asignaciones ni saldos; las referencias a depósitos se mapean. | — | Replicar requisito BASE §81 | — |
| RN-STK-074 | Un servicio marcado "sin stock comercial" no expone artículos de stock como prestación facturable. | — | Requisito BASE §91, escenario 94 | — |
| RN-STK-075 | Una unidad con ensayo/inspección obligatoria vencida no se reserva ni aplica si la política lo exige. | No existe | Mejorar (BASE §7) | PRM-STK-044 |
| RN-STK-076 | Un lote vencido no se ofrece en consumos ni entregas si el bloqueo está activo; se sugiere FEFO. | No existe | Mejorar | PRM-STK-045 |
| RN-STK-077 | Al cambiar el responsable de un depósito de cuadrilla o técnico, o al desvincular al empleado (M16), se exige rendición cerrada y transferencia del saldo. | No existe | Mejorar | — |
| RN-STK-078 | Los eventos económicos llevan `sourceDocumentId` + `eventSeq`; M15 deduplica. Un reintento de un proceso fallido repara el paso faltante sin repetir movimientos ya confirmados. | Cierre automático por rango sin marca de contabilizado (RN-08 §13.1) | Reemplazar (AGR-016) | — |

## 7. Modelo de datos

**Campos comunes a todas las colecciones** (no se repiten abajo): `tenantId` (ObjectId, obligatorio, primer campo de todo índice), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (entero, control optimista). Las colecciones maestras tienen además `status` (`active`/`inactive`) y `deletedAt` (borrado lógico). Los documentos económicos (`stockDocuments`, `stockMovements`, `revaluations`, `fixedAssetDepreciations`, `depreciationRuns`) **nunca** se borran. Importes y costos: `Decimal128` (costos unitarios hasta 6 decimales, importes a 2; AGR-011). Cantidades: `Decimal128` con decimales según unidad (PRM-STK-059). Fechas en UTC; `effectiveDate` se interpreta en la zona horaria del tenant.

Abreviaturas: O = obligatorio, C = condicional, — = opcional.

### 7.1 `itemTypes` — tipos de artículo (origen `TIP_PROD`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | O | Código único por tenant. |
| `name` | string | O | Clave de diccionario o texto del tenant. |
| `kind` | enum | O | `material`, `customerEquipment`, `networkEquipment`, `tool`, `sparePart`, `supply`, `finishedGood`, `component`, `fixedAsset`, `other`. |
| `defaultFlags` | object | — | Banderas propuestas al crear artículos del tipo (ver 7.5). |

Índices: `{tenantId, code}` único.

### 7.2 `itemClassifications` — clasificaciones jerárquicas (origen `CLASIFICACION_ITEMS`)

Dueño único M13 (COL-STK-02 y CTR-DAT-44 de T05): M05 y M06 la citan por `itemClassificationId` y no la definen; T07 migra `CLASIFICACION_ITEMS` aquí.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | O | Único por tenant. |
| `name` | string | O | Nombre. |
| `parentId` | ObjectId | — | Clasificación padre. |
| `path` | [ObjectId] | O | Ancestros (materializado). |
| `laborCoefficient` | Decimal128 | — | Coeficiente de mano de obra para costo fijo de fabricación (RN-08 §15.3 `Get_CostoFijo`). |

Índices: `{tenantId, code}` único; `{tenantId, path}`.

### 7.3 `itemGroups` — rubros (origen `RUB_PYS`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | O | Único por tenant. |
| `name` | string | O | Nombre. |
| `parentId`, `level`, `path` | ObjectId, int, [ObjectId] | — / O / O | Jerarquía (`COD_PAD`, `NIVEL`). |
| `accountingProfileKey` | string | — | Clave del perfil contable en M15 (cuentas compras `COD_CTAC`, ventas `COD_CTAV`, otros `COD_CTAO`, costo de venta, costo de baja, valor de origen, amortización ejercicio, amortización acumulada, disminución, revalúo). STK no guarda números de cuenta (RN-08 §13.2). |
| `isIndirect` | bool | — | `INDIRECTO`. |
| `defaultUsefulLifeYears` | Decimal128 | — | `VIDA_UTIL`. |
| `inflationAdjustable` | bool | — | `AJUSTABLE`. |
| `revaluationIndexKey` | string | — | Índice de revaluación de T04 (`INDICE_REVALUACION`). |
| `classKey` | string | — | `CLA_RUB` (clase de rubro). |

Índices: `{tenantId, code}` único.

### 7.4 `itemDepartments` — departamentos (origen `DEPAPROD`)

`code` (string, O, único), `name` (string, O). Índice `{tenantId, code}` único. El vínculo con el artículo está en `inventoryItems.departmentId` (en ProCoop `DEPAPROD` lleva `COD_PRO`; se normaliza).

### 7.5 `inventoryItems` — artículos de inventario (origen `PROD_SER` en su faceta de stock; `DATOSEXT`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | O | Código único por tenant. |
| `name`, `shortName` | string | O / — | Descripción. |
| `barcodes` | [string] | — | EAN/códigos de barras. |
| `itemTypeId`, `classificationId`, `itemGroupId`, `departmentId` | ObjectId | O / — / O / — | Clasificaciones. |
| `brand`, `model`, `manufacturer` | string | — | Marca, modelo, fabricante (BASE §7). |
| `registrationNumber` | string | — | Matrícula (única si PRM-STK-021). |
| `uom` | string | O | Unidad de stock (catálogo T04). |
| `alternateUoms` | [{uom, factor, use: `purchase`/`consumption`}] | — | Equivalencias. |
| `packSize` | Decimal128 | — | Bulto de reposición (`BULTOS`). |
| `flags` | object | O | `tracksStock`, `serialized`, `lotTracked`, `hasExpiry`, `usesLocations`, `isFixedAsset`, `manufacturable`, `isComponent`, `isKit`, `consumable`, `customerEquipment`, `sellable`, `purchasable`. |
| `moduleAvailability` | [enum] | O | `sales`, `stock`, `purchases`, `installments` (reemplaza `PROD_SERV` 1–6). |
| `catalogProductId` | ObjectId | — | Producto comercial de M02. |
| `serviceIds`, `defaultServiceId` | [ObjectId], ObjectId | — | Stock por servicio (OPE-002). |
| `defaultDeliveryMode` | enum | — | `loanForUse`, `temporaryLoan`, `rental`, `sale`, `customerOwned`, `networkIncorporation`. |
| `secondaryIdTypes` | [enum] | C | Identificadores requeridos si serializado: `mac`, `gponSn`, `imei`, `meterNumber`, `registration`, `internal`. |
| `compatibility` | [{serviceId, technologyKey}] | — | RN-STK-019. |
| `extendedProperties` | [{key, label, type, unique, required}] | — | Esquema de propiedades (`DATOSEXT`). |
| `costing` | object | O | `replacementCost` (Decimal128), `standardCost`, `previousReplacementCost`, `costUpdatedAt`, `currency`. |
| `reorder` | [{warehouseId?, min, max, reorderPoint, reorderQty, leadTimeDays}] | — | Niveles (`STO_MIN`, `CAN_REP`). |
| `warrantyMonthsSupplier`, `warrantyMonthsSale` | int | — | Garantías por defecto. |
| `inspectionPolicy` | {required, periodMonths, blockIfExpired} | — | BASE §7. |
| `attachments` | [storedFileId] (→ `storedFiles` de T01; antes `[fileRef]`) | — | Fotos, fichas, certificados (T11). |

Índices: `{tenantId, code}` único; `{tenantId, registrationNumber}` único parcial; `{tenantId, barcodes}`; `{tenantId, itemGroupId}`; `{tenantId, serviceIds}`; texto en `name`.

### 7.6 `itemKits` — composición de kits (origen `COMBOS`)

`kitItemId` (O), `components` [{`itemId` O, `quantity` Decimal128 O}]. Índice `{tenantId, kitItemId}` único.

### 7.7 `warehouses` — depósitos y custodios (origen `DEPOSITO`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `name` | string | O | Código único. |
| `type` | enum | O | `central`, `branch`, `crew`, `technician`, `vehicle`, `production`, `components`, `transit`, `repair`, `supplier`, `quarantine`, `consignment`, `scrap`, `customerPremisesPool`. |
| `branchId` | ObjectId | — | Sucursal (T04). |
| `address`, `geo` | object | — | Ubicación física. |
| `crewId`, `employeeId`, `vehicleId`, `supplierId` | ObjectId | C | Custodio según tipo. |
| `custodianUserId` | ObjectId | C | Responsable actual de custodia (cuadrilla/técnico). |
| `serviceIds` | [ObjectId] | — | Servicios asociados. |
| `ownStock` | bool | O | `true` salvo depósitos de equipos de clientes. |
| `allowsNegative` | bool | — | Sobrescribe la política (solo no serializados). |
| `usesLocations` | bool | — | Si exige ubicación. |

Índices: `{tenantId, code}` único; `{tenantId, type}`; `{tenantId, crewId}`; `{tenantId, employeeId}`. Existe **un único** depósito lógico `customerPremisesPool` por tenant; la ubicación concreta de cada equipo en un domicilio se identifica por `contractId` en el saldo/unidad (RF-STK-017).

### 7.8 `warehouseLocations` — ubicaciones (origen `UBICACIONES`)

`warehouseId` (O), `code` (O), `name` (O, `NOMBRE`), `parentId` (`ID_PADRE`), `path`, `assignable` (bool, `ASIGNABLE`), `isDefault` (bool, `POR_DEFECTO`), `icon`. Índices: `{tenantId, warehouseId, code}` único.

### 7.9 `itemLocationDefaults` — ubicaciones por defecto del artículo (origen `PROD_SER_UBICACION`)

`itemId` (O), `locationId` (O), `capacity` (Decimal128, `CAPACIDAD`). Índice `{tenantId, itemId, locationId}` único.

### 7.10 `stockDocuments` — documentos de stock (origen `RETI_MAT`, `IT_RETM`, remitos internos, vales, `TRANSFER`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `docType` | enum | O | `inboundVoucher`, `outboundVoucher`, `transfer`, `purchaseReceipt`, `supplierReturn`, `crewDelivery`, `crewReturn`, `workOrderConsumption`, `maintenanceConsumption`, `equipmentApplication`, `equipmentRetrieval`, `counterReturn`, `saleDelivery`, `consignment`, `adjustment`, `physicalCountClose`, `revaluation`, `manufacturing`, `housing`, `rmaShipment`, `rmaReturn`, `openingBalance`. |
| `number` | {pointOfSale, sequence, display} | O | Secuencia por tenant, tipo y sucursal (RN-STK-071). |
| `effectiveDate`, `recordedAt` | Date | O | Fechas efectiva y de registro. |
| `status` | enum | O | Ver 8.1. |
| `sourceWarehouseId`, `targetWarehouseId` | ObjectId | C | Según tipo. |
| `destination` | {type, refId} | C | `workOrder`, `maintenanceOrder`, `project` (obra), `serviceContract`, `service`, `costCenter`, `expenseUnit`, `housingPlan`, `rmaCase`, `manufacturingOrder`. |
| `serviceAllocation` | [{serviceId, percent}] | — | RN-STK-027. |
| `lines` | [{lineId, itemId, quantity, uom, lotId, serialUnitIds[], locationId, unitCost, condition, notes}] | O | Renglones (`IT_RETM`: `CAN_PRO`, `DES_PRO`, `SAL_CANTRO` saldo, `ID_UNIDADES`). |
| `pendingQuantities` | [{lineId, quantity}] | — | Saldo pendiente (entregas parciales, tránsito). |
| `origin` | {module, refType, refId} | — | Documento externo (OT M10, recepción M12, factura M05, presupuesto M11). |
| `clientMutationId`, `idempotencyKey` | string | C | Idempotencia (RN-STK-015). |
| `receivedBy` | {userId, employeeId, at, signatureStoredFileId} | — | `MOV_PRO_EXTRAS` (`USUARIO_RECIBE`, `FECHA_RECIBE`, `COD_TEC_NEC`). |
| `reason` | enum + text | C | Obligatorio en ajustes, anulaciones y bajas. |
| `approval` | {workflowInstanceId, status, approvedBy, approvedAt} | C | T11. |
| `evidence` | [storedFileId] (→ `storedFiles` de T01; antes `[fileRef]`) | C | Fotos, actas. |
| `cancellation` | {cancelledAt, cancelledBy, reason, reversalDocumentId} | — | Anulación. |
| `conflict` | {status, reason, resolvedBy, resolvedAt} | — | Conflicto offline (AGR-025). |

Índices: `{tenantId, docType, number.display}` único; `{tenantId, clientMutationId}` único parcial; `{tenantId, origin.refType, origin.refId}`; `{tenantId, destination.type, destination.refId}`; `{tenantId, status, effectiveDate}`.

### 7.11 `stockMovements` — libro de movimientos (origen `MOV_PRO`, `MOV_TRH`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `stockDocumentId`, `lineId` | ObjectId, string | O | Antes `documentId`. Documento y renglón (nombre de T05; PA-STK-11). |
| `operation` | enum | O | `sales` (1), `suppliers` (2), `workOrders` (3), `stockReconciliation` (4), `vouchers` (5), `maintenance` (6), `manufacturing` (7), `consignment` (8), `interWarehouse` (10), `noRecord` (11, solo migración), `invoicing` (12), `housing` (13); nuevas: `crewCustody`, `equipmentApplication`, `equipmentRetrieval`, `adjustment`, `revaluation`, `rma`, `openingBalance`, `reversal`, `bottledGasDelivery` y `emptyContainerReturn` (RF-STK-139, DEC-082). |
| `kind` | enum | O | `quantity` o `value` (revaluaciones y diferencias de precio). |
| `direction` | enum | O | `in` / `out`. |
| `effectiveDate`, `recordedAt` | Date | O | |
| `inventoryItemId`, `warehouseId` | ObjectId | O | Antes `itemId`. Nombre de T05 (PA-STK-11). |
| `locationId`, `lotId`, `serialUnitId` | ObjectId | C | |
| `contractId` | ObjectId | C | Obligatorio en `customerPremisesPool` (`COD_SUM`). |
| `stockState` | enum | O | `available`, `inTransit`, `custody`, `applied`, `repair`, `supplier`, `quarantine`, `consigned`, `scrap`. |
| `quantity` | Decimal128 | O | Siempre positiva (RN-STK-003). |
| `unitCost`, `amount` | Decimal128 | O | Costo según método; `amount` = cantidad × costo (o valor en `kind = value`). |
| `costProvisional` | bool | — | RN-STK-029. |
| `destination`, `serviceId`, `costCenterId`, `projectId`, `expenseUnitId` | object/ObjectId | C | Dimensiones analíticas. |
| `supplierId`, `accountId` | ObjectId | — | `COD_PROV`, cuenta. |
| `reversalOf` | ObjectId | — | Movimiento revertido. |
| `periodKey` | string | O | `YYYY-MM` para cierre. |

Índices: `{tenantId, inventoryItemId, warehouseId, effectiveDate}`; `{tenantId, serialUnitId, effectiveDate}`; `{tenantId, stockDocumentId}` (antes con `itemId` y `documentId`); `{tenantId, contractId}`; `{tenantId, periodKey, operation}`. Inmutable (sin `updatedAt` de negocio).

### 7.12 `stockBalances` — saldos materializados

`inventoryItemId` (antes `itemId`; nombre de T05, PA-STK-11), `warehouseId` (O), `locationId`, `lotId`, `contractId` (C), `stockState` (O; mismos valores que `stockMovements.stockState`, §7.11: `available`, `inTransit`, `custody`, `applied`, `repair`, `supplier`, `quarantine`, `consigned`, `scrap`; es dimensión del saldo, no máquina de estados), `quantity` (O), `reservedQuantity` (O), `value` (Decimal128), `lastMovementAt`. Índice único `{tenantId, inventoryItemId, warehouseId, locationId, lotId, contractId, stockState}` (antes con `itemId`). Se actualiza con `$inc` dentro de la transacción del movimiento, con `version` (RN-STK-025).

### 7.13 `serialUnits` — unidades serializadas (origen `PROD_TRH`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `inventoryItemId` | ObjectId | O | Antes `itemId`. `COD_PRO`; nombre de T05 (PA-STK-11). |
| `serialNumber` | string | O | `NID_PTH`. |
| `secondaryIds` | [{type, value}] | C | MAC, GPON SN, IMEI, número de medidor. |
| `status` | enum | O | Ver 8.2. |
| `ownership` | enum | O | `own`, `customer`, `thirdParty`, `soldToCustomer`. |
| `currentWarehouseId`, `currentLocationId`, `currentContractId` | ObjectId | C | Antes `currentServiceContractId`. Posición vigente; nombre de T05 (PA-STK-11). |
| `currentCustodian` | {type: `warehouse`/`crew`/`employee`/`customer`/`supplier`, refId} | O | Custodia. |
| `lotId` | ObjectId | — | |
| `unitCost` | Decimal128 | — | `PRE_TRH`. |
| `receivedAt`, `supplierId`, `purchaseReceiptId` | | — | Origen. |
| `warranty` | {supplierUntil, saleUntil} | — | |
| `extendedProperties` | object | — | Valores de `DATOSEXT`. |
| `accessories` | [{itemId, serialUnitId?, quantity}] | — | RF-STK-049. |
| `seals` | [{number, placedAt, removedAt}] | — | Precintos. |
| `inspections` | [{type, date, result, certificateStoredFileId, validUntil}] | — | Ensayos (BASE §7). |
| `condition` | enum | — | `new`, `refurbished`, `used`, `damaged`, `incomplete`. |
| `replacesSerialUnitId`, `replacedBySerialUnitId` | ObjectId | — | Reemplazos RMA. |
| `fixedAssetId` | ObjectId | — | Bien de uso vinculado. |
| `notes` | string | — | `OBS_PTH`. |

Índices: `{tenantId, itemId, serialNumber}` único; `{tenantId, "secondaryIds.type", "secondaryIds.value"}` único (multikey con valor no nulo); `{tenantId, status}`; `{tenantId, currentServiceContractId}`; `{tenantId, "currentCustodian.refId"}`.

### 7.14 `serialUnitEvents` — trayectoria (origen `MOV_TRH`)

`serialUnitId` (O), `eventType` (O: `received`, `reserved`, `reservationReleased`, `transferred`, `deliveredToCustody`, `accepted`, `applied`, `retrieved`, `returned`, `reviewed`, `sentToRepair`, `sentToRma`, `returnedFromRma`, `replaced`, `inspected`, `maintained`, `sold`, `lost`, `scrapped`, `adjusted`, `attachmentAdded`), `effectiveDate`, `recordedAt`, `fromStatus`, `toStatus`, `fromCustodian`, `toCustodian`, `documentId`, `movementId`, `workOrderId`, `contractId`, `rmaCaseId`, `actorId`, `notes` (`OBS_MPT`), `attachments`. Índice `{tenantId, serialUnitId, effectiveDate}`. Inmutable.

### 7.15 `lotTypes` y `lots` (origen `TIPOLOTE`)

Dueño único M13 de `lotTypes` (COL-STK-15 y CTR-DAT-46 de T05; M04 lo atribuía a M05).

`lotTypes`: `code`, `name`, `requiresExpiry` (bool), `blockExpired` (bool). `lots`: `itemId` (O), `lotNumber` (O), `lotTypeId`, `manufacturedAt`, `expiresAt`, `supplierId`, `purchaseReceiptId`, `status` (`available`, `blocked`, `expired`, `depleted`). Índice `{tenantId, itemId, lotNumber}` único; `{tenantId, expiresAt}`.

### 7.16 `stockReservations` — reservas

`itemId` (O), `serialUnitId` (C), `quantity` (O), `warehouseId` (O: depósito o cuadrilla donde se reserva), `target` {type: `workOrder`/`project`/`quote`/`housingPlan`/`manufacturingOrder`, refId} (O), `mode` (`byModel`/`bySerial`), `status` (8.3), `expiresAt`, `consumedQuantity`, `releasedQuantity`, `releaseReason`, `idempotencyKey`. Índices: `{tenantId, target.type, target.refId}`; `{tenantId, serialUnitId, status}` único parcial con `status ∈ {active}`; `{tenantId, status, expiresAt}`.

### 7.17 `equipmentAssignments` — asignaciones de equipos a contratos (origen `SERSOC_PRODUCTOS`)

**Reemplazada por `contractEquipmentAssignments` de M02** (CTR-DAT-28 de T05: el equipo asignado es parte del contrato, dueño M02). M13 no persiste la asignación: es dueño de la unidad (`serialUnits`), de su custodia y de los movimientos (`stockDocuments`/`stockMovements`), los publica (EVT-STK-*) y consulta la asignación en M02 para la valorización del comodato (RN-STK-035), el seguimiento de devolución (RN-STK-037) y la propuesta de cargo (RN-STK-038). La modalidad por defecto es comodato en Internet y TV, configurable por plan y valorizada en stock (DEC-013). La tabla siguiente se conserva como especificación de los campos que M02 debe cubrir:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId`, `accountId`, `premiseId`, `serviceId` | ObjectId | O | `ID_SERSOC`. |
| `itemId`, `serialUnitId` | ObjectId | O / C | `COD_PRO`, `COD_PTH`. |
| `quantity` | Decimal128 | O | 1 para serializados. |
| `mode` | enum | O | Ver 7.5 `defaultDeliveryMode`. |
| `deliveredAt` | Date | O | `FECHA_ENTREGA`. |
| `expectedReturnAt` | Date | — | `FECHA_DEVOLUCION`. |
| `returnedAt` | Date | — | `FECHA_DEVUELTO`. |
| `sourceWarehouseId` | ObjectId | O | `COD_DPS`. |
| `declaredValue` | Decimal128 | — | `PRECIO`. |
| `workOrderId`, `retrievalWorkOrderId` | ObjectId | — | OT de instalación y de retiro. |
| `deliveryReceiptStoredFileId` | ObjectId → `storedFiles` (T01; antes `deliveryReceiptFileRef`) | — | Constancia aceptada (versión). |
| `status` | enum | O | Ver 8.4. |
| `returnCondition` | enum | — | `ok`, `damaged`, `incomplete`, `notRecovered`. |
| `chargeProposalId` | ObjectId → `approvalRequests` (T11) | — | Propuesta de cargo por no devolución: solicitud de aprobación de T11 (RN-STK-038; antes sin destino). |
| `saleDocumentRef` | object | C | Comprobante M05/M11 si `mode = sale`. |
| `notes` | string | — | `OBSERVA`. |

Índices: `{tenantId, contractId, status}`; `{tenantId, serialUnitId, status}` único parcial con `status = active`; `{tenantId, status, expectedReturnAt}`.

### 7.18 `crewSettlements` — rendiciones de cuadrilla

`warehouseId` (O, depósito de cuadrilla/técnico), `periodFrom`, `periodTo` (O), `snapshotAt`, `lines` [{itemId, serialUnitId?, opening, delivered, consumed, applied, returned, retrieved, expected, counted, difference, differenceType (`shortage`/`surplus`), adjustmentDocumentId}], `status` (8.5), `supervisorId`, `evidence`, `closedAt`. Índice `{tenantId, warehouseId, periodTo}`.

### 7.19 `physicalCounts` — inventarios físicos (origen: conciliación de stock, operación 4)

`scope` {warehouseIds, locationIds, itemGroupIds, itemIds}, `type` (`full`/`partial`/`cycle`), `blind` (bool), `snapshotAt`, `mode` (PA-STK-07), `lines` [{itemId, locationId, lotId, expectedQty, countedQty, countedSerials[], missingSerials[], foundSerials[], difference, countedBy, countedAt}], `status` (8.6), `adjustmentDocumentId`. Índice `{tenantId, status}`.

### 7.20 `itemCostStates` y `costLayers` — costeo perpetuo

`itemCostStates`: `itemId` (O), `scopeWarehouseId` (C, si el costeo es por depósito; PA-STK-01), `method` (`weightedAverage`/`fifo`/`specificIdentification`), `quantityOnHand`, `averageCost`, `totalValue`, `lastRecalculatedAt`. Índice único `{tenantId, itemId, scopeWarehouseId}`. `costLayers` (solo PEPS): `itemId`, `inMovementId`, `receivedAt`, `originalQty`, `remainingQty`, `unitCost`. Índice `{tenantId, itemId, receivedAt}`.

### 7.21 `revaluations` — revaluaciones (origen `clsRevaluacion`)

`mode` (`index`/`cost`/`manual`), `dateFrom`, `dateTo`, `indexKey`, `lines` [{itemId, warehouseId, quantity, previousCost, newCost, factor, difference}], `projectId` (obra P3041), `responsibleId` (P3042), `status` (`draft`/`approved`/`posted`/`cancelled`), `documentId`. Índice `{tenantId, status, dateTo}`.

### 7.22 `reorderSuggestions` — sugerencias de compra

`itemId`, `warehouseId`, `serviceId`, `computedAt`, `available`, `inTransit`, `pendingPurchaseOrders`, `reserved`, `min`, `max`, `suggestedQty`, `preferredSupplierId`, `lastPurchases` [{date, supplierId, unitCost, quantity}], `status` (`open`/`converted`/`dismissed`), `requisitionId` (M12). Índice `{tenantId, status, itemId}`.

### 7.23 `expenseUnits` — unidades de gasto (origen `UNIDADES_GASTOS`)

`code`, `name` (`DES_UNIDADES`), `notes` (`OBS_UNIDADES`), `costCenterId` (M15, PA-STK-06), `serviceId`. Índice `{tenantId, code}` único. Colección canónica (COL-STK-25 y CTR-DAT-54 de T05): absorbe el tipo `spendingUnit` de `purchaseLookups` de M12, que ya no lista unidades de gasto.

### 7.24 `fixedAssets` — bienes de uso (origen `BIENES_USO`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `assetNumber` | string | O | `NRO_BIEN`. |
| `description`, `notes` | string | O / — | `DES_BIEN`, `OBS_BIEN`. |
| `itemId`, `serialUnitId`, `serialNumber` | ObjectId, ObjectId, string | — | `COD_PRO`, `NRO_SERIE`. |
| `itemGroupId` | ObjectId | O | Rubro (cuentas y vida útil). |
| `registeredAt`, `registeredBy` | Date, ObjectId | O | `FEC_ALTA`, `USER_ALTA`. |
| `purchasedAt`, `supplierInvoiceRef` | Date, object | — | `FEC_COMPRA`, `IVACOM_IN`. |
| `inServiceAt` | Date | C | `FEC_AFECTA`; sin afectación no amortiza. |
| `disposedAt`, `disposal` | Date, {type, recoveryAmount, documentRef, result} | — | `FEC_BAJA`, `IVACOM_OUT`. |
| `originalValue` | Decimal128 | O | `IMP_ORIGEN`. |
| `historicalOriginalValue` | Decimal128 | — | `VAL_ORIG_HIST`. |
| `usefulLifeYears` | Decimal128 | O | `VIDA_UTIL`. |
| `depreciablePercent` | Decimal128 | O | `PORC_AMORT`. |
| `residualValue` | Decimal128 | — | |
| `accumulatedDepreciation`, `accumulatedDepreciationHistorical`, `accumulatedDepreciationAdjusted` | Decimal128 | O | Acumulados. |
| `isImprovement`, `parentAssetId` | bool, ObjectId | — | Mejora. |
| `costCenterAllocation` | [{costCenterId, percent}] | — | `BIENES_USO_CTSEC` (`COD_SEC`, `POR_ASIGNACION`). |
| `costCenterId` | ObjectId | — | Centro de costo principal (clave de T05; PA-STK-11). |
| `branchId`, `physicalLocation`, `responsibleEmployeeId` | | — | |
| `status` | enum | O | Ver 8.7. |

Índices: `{tenantId, assetNumber}` único; `{tenantId, status}`; `{tenantId, itemGroupId}`; `{tenantId, serialUnitId}`.

### 7.25 `fixedAssetHistory` (origen `BIENES_USO_HST`)

`fixedAssetId`, `versionNumber`, `snapshot` (todos los campos de 7.24), `changedFields`, `changedAt`, `changedBy`, `reason`. Índice `{tenantId, fixedAssetId, versionNumber}` único.

### 7.26 `fixedAssetValueChanges` — mejoras, disminuciones, ajustes (origen `BIENES_USO_DISM`)

`fixedAssetId`, `type` (`impairment`/`improvement`/`inflationAdjustment`/`revaluation`), `date` (`FECHA`), `amount` (`IMPORTE`), `reason`, `status` (`draft`, `posted`, `voided`; §8.13, PA-STK-10), `eventId`. Índice `{tenantId, fixedAssetId, date}`.

### 7.27 `depreciationRuns` y `fixedAssetDepreciations` (origen `BIENES_USO_AMORT`)

`depreciationRuns`: `periodFrom`, `periodTo`, `type` (`monthly`/`annual`/`disposal`/`inflationAdjustment`), `mode` (`simulation`/`posted`), `status` (8.8), `totals`, `reversalOfRunId`. `fixedAssetDepreciations`: `runId`, `fixedAssetId`, `from` (`DESDE`), `to` (`HASTA`), `days`, `amount`, `lastDepreciationAmount` (`ULT_IMP_AMORT`), `lastOriginalValue` (`ULT_IMP_ORIGEN`), `inflationAdjustment` (`AJUSTE_INFL`), `adjustedOriginalValue` (`VAL_ORIG_AJUS`), `accumulated` (`AMOR_ACUM`), `accumulatedAdjusted` (`AMOR_ACUM_AJUS`), `periodAdjusted` (`AMOR_EJER_AJUS`), `costCenterSplit`, `journalRef` (devuelto por M15, reemplaza `COD_ASI`). Índice `{tenantId, fixedAssetId, to}`; `{tenantId, runId}`.

### 7.28 `rmaCases` — RMA (origen `RMA_PRODUCTOS`, `RMA_HISTORIAL`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | O | Secuencia. |
| `openedAt`, `receivedBy` | Date, ObjectId | O | `FECHA`, `USER_RECIBIO`. |
| `contractId` | ObjectId | — | `COD_SUM`. |
| `contact` | {name, phone, preferredHours} | — | `NOM_CONTACTO`, `TEL_CONTACTO`, `HORA_CONTACTO`. |
| `itemId`, `model`, `serialUnitId`, `serialNumber` | | O / — / C / C | `COD_PROD`, `MODELO`, `NRO_SERIE`. |
| `supplierId`, `supplierRmaNumber` | | — | `COD_PROV`. |
| `receptionNotes`, `reportedProblem`, `diagnosis` | string | — | `OBS_RECEPCION`, `OBV_PROBLEMA`. |
| `warranty` | {inWarranty, until, source} | — | |
| `type` | enum | O | `supplierWarranty`, `supplierRepair`, `internalRepair`, `customerReturn`. |
| `resolution` | enum | — | `repaired`, `replaced`, `rejected`, `creditNote`, `scrapped`. |
| `replacementSerialUnitId` | ObjectId | — | |
| `shippedAt`, `returnedAt` | Date | — | |
| `costs` | {parts, labor, freight, total} | — | |
| `statusId` | ObjectId | O | Estado configurable (catálogo `rmaStatuses` embebido en configuración del módulo: código, nombre, notifica, plantilla, final). |
| `history` | [{statusId, at, userId, notes}] | O | `RMA_HISTORIAL` (`ID_ESTADO`, `FECHA`, `COD_USER`, `OBS_HIS`). |
| `documentIds` | [ObjectId] | — | Envío y retorno. |

Índices: `{tenantId, number}` único; `{tenantId, serialUnitId}`; `{tenantId, statusId}`.

### 7.29 `receptionStatuses` y `serviceReceptions` — servicio técnico a clientes (origen `ESTADOS_RECEP`, `RECEPCIONES`, `ITRE_PRO`, `ITRE_EST`)

`receptionStatuses`: `code`, `description` (`DESCRIP`), `notes` (`NOTAS`), `icon` (`ICONO`), `level` (`NIVEL`), `isFinal`. `serviceReceptions`: `number` (`COD_REC`), `date`, `receivedAt` (`FECHA_ING`), `accountIds` (`COD_CLI1`, `COD_CLI2`), `requestedBy` (`QUIENPIDE`), `documentRef` (`COD_COM/SUC_COM/NUM_COM`), `notes` (`OBS`), `registeredBy` (`USERS`, `FECHA_REG`), `items` [{lineId, itemId (`COD_PRO`), quantity (`CAN_PRO`), price (`PRE_VSI`), customerSerial, currentStatusId, statusHistory [{statusId, at, userId}] (`ITRE_EST`)}], `status`. Índice `{tenantId, number}` único.

### 7.30 `bomStructures` y `bomStructureVersions` — estructuras (origen `PRODFAB`, `HIS_PRODFAB`)

`bomStructures`: `itemId` (O, producto fabricable), `currentVersionId`. `bomStructureVersions`: `itemId`, `versionNumber`, `validFrom`, `nodes` [{nodeId (`INT_RED`), parentNodeId (`INT_PADRE`), level (`NIVEL`), componentItemId (`COD_COM`), quantity (`CAN_COM`), unitCost (`PRE_CSI`), stageId (`COD_ETA`), reference (`REFERENCIA`), description (`DESCRIP`), notes1/notes2 (`OB1_COM`, `OB2_COM`)}], `laborCost`, `fixedCost`, `marginPercent`. Índice `{tenantId, itemId, versionNumber}` único.

### 7.31 `productDivisions` (origen `PRODFAB_DIVISIONES`, `HIS_PRODFAB_DIVISIONES`)

`operationType` (`TIPO_OPERACION`), `operationRef` (`ID_OPERACION`), `quantity` (`CANTIDAD`), `measure` (`MEDIDA`), `decompositionCoefficient` (`COEFICIENTE_DESCOMPOSICION`), `history` [{snapshot, at}] (`FEC_REG`). Índice `{tenantId, operationType, operationRef}`.

### 7.32 `manufacturingStages` (origen `ETAFAB`)

`itemId` (`COD_PRO`), `order` (`ORDEN`), `name` (`DES_ETA`), `durationHours` (`DURACION`), `notes` (`OBSERVA`). Índice `{tenantId, itemId, order}` único.

### 7.33 `manufacturingOrders` (origen `ORDEFAB`, `ORPRFAB`, `ORCOFAB`, `ORDAFAB`, `ORDEFAB_EXT`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | object | O | `COD_COM/SUC_COM/NUM_COM`. |
| `date`, `plannedLaunchAt`, `plannedEndAt`, `actualLaunchAt`, `actualEndAt` | Date | O / — | `FECHA`, `FEC_LAN`, `FEC_FIN`, `FEC_LANR`, `FEC_FINR`. |
| `responsibleId` | ObjectId | — | `COD_RES`. |
| `stage` | enum | O | 8.9 (`COD_ETA`, `FEC_ETA`). |
| `isGenericDamagedOrder` | bool | — | P3040. |
| `bomStructureVersionId` | ObjectId | C | Versión de estructura vigente al generar la orden (clave de T05; cada renglón puede fijar la suya en `products[].bomVersionId`; PA-STK-11). |
| `products` | [{lineId (`COD_OPR`), itemId, quantity (`CAN_PRO`), saleDocumentRef (`COD_CVE`, `ID_ITEM`), inReportsQty (`CAN_PPROD`), status (`ESTADO`), reassignedQty (`CAN_REASIGNADO`), productChangedQty (`CAN_CAMBIOPROD`), bomVersionId}] | O | `ORPRFAB`. |
| `components` | [{itemId, quantity (`CAN_PRO`), withdrawnQty (`CAN_RET`), unitCost (`PRE_CSI`), leadDays (`DIAS`), productLineId (`COD_OPR`), inReportsQty (`CAN_PPROD`)}] | O | `ORCOFAB`. |
| `stageProgress` | [{stageId, plannedStart, plannedEnd, actualStart, actualEnd, responsibleId}] | — | `ORDAFAB`. |
| `extensions` | [{newEndAt, description, at, userId}] | — | `ORDEFAB_EXT`. |
| `productionWarehouseId`, `componentsWarehouseId` | ObjectId | O | Depósitos (P165, P166). |
| `notes` | string | — | `OBSERVA`. |

Índices: `{tenantId, number.display}` único; `{tenantId, stage}`; `{tenantId, "products.itemId"}`.

### 7.34 `productionReports` — partes de producción (origen `OF_PARTE_PRODUCCION`, `OF_PARTE_ITEM`, `OF_PARTE_COMPONENTE`)

`number` (`COD_COM/SUC_COM/NUM_COM`), `recordedAt` (`FEC_REG`), `startAt` (`FECHA_INICIO`), `plannedAt` (`FECHA_PREVISTA`), `endAt` (`FECHA_FIN`), `userId` (`COD_USER`), `responsibleId` (`COD_RES`), `status` (8.10, `COD_ESTADO`), `itemUpTo` (`ITEM_HASTA`), `items` [{itemId, quantity, saleDocumentRef (`COD_CVE`), status, orderProductLineId (`COD_OPR`), itemUpTo, manufacturingOrderId, serialNumbers[]}], `components` [{itemId, quantity, orderProductLineId, serialUnitId (`COD_PTH`)}], `componentsConsumed` (bool), `damage` [{type: `productChange`/`destruction`/`reassignment`, itemId, quantity, targetOrderId}], `originalReportId`. Índice `{tenantId, number.display}` único; `{tenantId, status}`.

### 7.35 `mrpRuns` — aprovisionamiento de fabricación

`dateFrom`, `dateTo`, `runAt`, `lines` [{componentItemId, requiredAt, requiredQty, inProcessQty, stockQty, minStock, netQty, preferredSupplierId, lastPurchases[]}], `excludedLines`, `requisitionIds`, `status` (`calculated`, `confirmed`, `discarded`, `failed`; §8.13, PA-STK-10). Reemplaza P168 (última fecha de requerimiento) por el historial de corridas.

### 7.36 Relaciones con colecciones de otros módulos

| Referencia | Dueño | Uso en STK |
|---|---|---|
| `serviceContracts`, `accounts`, `premises` | M01/M02 | Asignaciones y ubicación de custodia del socio. |
| `services`, `products` | M02 | Stock por servicio, modalidad por defecto, producto comercial. |
| `workOrders`, `crews`, `maintenanceOrders`, `projects` (obras) | M10 | Reservas, entregas, consumos, aplicaciones, retiros. |
| `purchaseReceipts`, `requisitions`, `suppliers`, `supplierInvoices` | M12 | Ingresos, sugerencias, RMA con proveedor. |
| `costCenters`, `periods`, `journalEntries` | M15 / T04 | Dimensiones, cierres y asientos. |
| `employees` | M16 | Custodios. |
| `housingPlans` | M18 | Materiales de vivienda. |
| `files`, `workflowInstances` | T11 | Evidencias y aprobaciones. |

### 7.37 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.37.1 `itemClassifications` (COL-STK-02) — referencias declaradas

| Campo | Referencia |
|---|---|
| `path` | [VERIFICAR] destino no deducible (identificador externo o interno) |

#### 7.37.2 `itemGroups` (COL-STK-03) — referencias declaradas

| Campo | Referencia |
|---|---|
| `level` | [VERIFICAR] destino no deducible (identificador externo o interno) |
| `path` | [VERIFICAR] destino no deducible (identificador externo o interno) |

#### 7.37.3 `itemDepartments` (COL-STK-04)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | string, O, único | — |
| `name` | string | [VERIFICAR] | string, O | — |

#### 7.37.4 `inventoryItems` (COL-STK-05) — referencias declaradas

| Campo | Referencia |
|---|---|
| `itemTypeId` | `itemTypes` (M13); antes implícita por el nombre |
| `classificationId` | `itemClassifications` (M13); antes implícita por el nombre |
| `itemGroupId` | `itemGroups` (M13); antes implícita por el nombre |
| `departmentId` | `itemDepartments` (M13); antes implícita por el nombre |
| `catalogProductId` | `serviceProducts` (M02) (producto comercial; T05 COL-CAT-05 guarda el vínculo inverso `inventoryItemId`; antes `[VERIFICAR]`) |

#### 7.37.5 `itemKits` (COL-STK-06)

Lista original: §7.6.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kitItemId` | ObjectId | Sí | — | `inventoryItems` (M13); antes implícita por el nombre |
| `components` | array | [VERIFICAR] | [{`itemId` O, `quantity` Decimal128 O}] | — |
| `inventoryItemId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `inventoryItems` (M13) |
| `componentItemId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `inventoryItems` (M13); antes implícita por el nombre |

#### 7.37.6 `warehouses` (COL-STK-07) — referencias declaradas

| Campo | Referencia |
|---|---|
| `crewId` | `crews` (M10); antes implícita por el nombre |

#### 7.37.7 `warehouseLocations` (COL-STK-08)

Lista original: §7.8.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `warehouseId` | ObjectId | Sí | — | `warehouses` (M13) |
| `code` | string | Sí | — | — |
| `name` | string | Sí | O, `NOMBRE` | — |
| `parentId` | ObjectId | [VERIFICAR] | `ID_PADRE` | `warehouseLocations` (M13) |
| `path` | [VERIFICAR] | [VERIFICAR] | — | — |
| `assignable` | bool | [VERIFICAR] | bool, `ASIGNABLE` | — |
| `isDefault` | bool | [VERIFICAR] | bool, `POR_DEFECTO` | — |
| `icon` | [VERIFICAR] | [VERIFICAR] | — | — |

#### 7.37.8 `itemLocationDefaults` (COL-STK-09)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | Sí | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `warehouseLocationId` | ObjectId | Sí | Nombre de T05; antes `locationId` en este anexo. | `warehouseLocations` (M13); antes implícita por el nombre |
| `capacity` | Decimal128 | [VERIFICAR] | `CAPACIDAD` | — |
| `warehouseId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `warehouses` (M13) |

#### 7.37.9 `stockDocuments` (COL-STK-10) — referencias declaradas

| Campo | Referencia |
|---|---|
| `clientMutationId` | — (identificador de la mutación offline generado por el cliente; no es referencia; antes `[VERIFICAR]`) |

#### 7.37.10 `stockMovements` (COL-STK-11) — referencias declaradas

| Campo | Referencia |
|---|---|
| `stockDocumentId` | `stockDocuments` (M13); antes `documentId` |
| `lineId` | — (renglón embebido `lines[].lineId` del documento de `stockDocuments` (M13), no es colección; antes `[VERIFICAR]`) |
| `inventoryItemId` | `inventoryItems` (M13); antes implícita por el nombre; antes `itemId` |
| `locationId` | `warehouseLocations` (M13); antes implícita por el nombre |
| `lotId` | `lots` (M13); antes implícita por el nombre |
| `destination` | — (objeto embebido de dimensión analítica; no es referencia; antes `[VERIFICAR]`) |
| `projectId` | `works` (M10) (obra; antes `[VERIFICAR]`; PA-STK-11) |
| `expenseUnitId` | `expenseUnits` (M13); antes implícita por el nombre |

#### 7.37.11 `stockBalances` (COL-STK-12)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | [VERIFICAR] | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `warehouseId` | ObjectId | Sí | — | `warehouses` (M13) |
| `locationId` | ObjectId | [VERIFICAR] | — | `warehouseLocations` (M13); antes implícita por el nombre |
| `lotId` | ObjectId | [VERIFICAR] | — | `lots` (M13); antes implícita por el nombre |
| `contractId` | ObjectId | No | — | `serviceContracts` (M02) |
| `stockState` | [VERIFICAR] | Sí | O; mismos valores que `stockMovements.stockState`, §7.11: `available`, `inTransit`, `custody`, `applied`, `repair`, `supplier`, `quarantine`, `consigned`, `scrap`; es… | — |
| `quantity` | Decimal128 | Sí | — | — |
| `reservedQuantity` | Decimal128 | Sí | — | — |
| `value` | Decimal128 | [VERIFICAR] | — | — |
| `lastMovementAt` | Date | [VERIFICAR] | . Índice único `{tenantId, itemId, warehouseId, locationId, lotId, contractId, stockState}`. Se actualiza con `$inc` dentro de la transacción del movimiento | — |

#### 7.37.12 `serialUnits` (COL-STK-13) — referencias declaradas

| Campo | Referencia |
|---|---|
| `inventoryItemId` | `inventoryItems` (M13); antes implícita por el nombre; antes `itemId` |
| `secondaryIds` | — (identificadores del fabricante o de la red: MAC, GPON SN, IMEI, número de medidor; no es referencia; antes `[VERIFICAR]`) |
| `currentContractId` | `serviceContracts` (M02); antes `currentServiceContractId` |
| `currentLocationId` | `warehouseLocations` (M13); antes implícita por el nombre |
| `lotId` | `lots` (M13); antes implícita por el nombre |

#### 7.37.13 `serialUnitEvents` (COL-STK-14)

Lista original: §7.14.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serialUnitId` | ObjectId | Sí | — | `serialUnits` (M13) |
| `eventType` | [VERIFICAR] | [VERIFICAR] | O: `received`, `reserved`, `reservationReleased`, `transferred`, `deliveredToCustody`, `accepted`, `applied`, `retrieved`, `returned`, `reviewed`, `sentToRepair`,… | — |
| `effectiveDate` | Date | [VERIFICAR] | — | — |
| `recordedAt` | Date | [VERIFICAR] | — | — |
| `fromStatus` | enum | [VERIFICAR] | Valores de `serialUnits.status` (§8.2); registra la transición, no tiene máquina propia (antes sin valores, PA-STK-11). | — |
| `toStatus` | enum | [VERIFICAR] | Valores de `serialUnits.status` (§8.2). | — |
| `fromCustodian` | [VERIFICAR] | [VERIFICAR] | — | — |
| `toCustodian` | [VERIFICAR] | [VERIFICAR] | — | — |
| `documentId` | ObjectId | [VERIFICAR] | — | `documents` (T11) |
| `movementId` | ObjectId | [VERIFICAR] | — | `stockMovements` (M13); antes implícita por el nombre |
| `workOrderId` | ObjectId | [VERIFICAR] | — | `workOrders` (M10) |
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `rmaCaseId` | ObjectId | [VERIFICAR] | — | `rmaCases` (M13); antes implícita por el nombre |
| `actorId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `notes` | string | [VERIFICAR] | `OBS_MPT` | — |
| `attachments` | [VERIFICAR] | [VERIFICAR] | — | — |

#### 7.37.14 `lotTypes` (COL-STK-15)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `requiresExpiry` | bool | [VERIFICAR] | — | — |
| `blockExpired` | bool | Sí | bool). `lots`: `itemId` (O | — |
| `lotNumber` | int / string [VERIFICAR] | Sí | — | — |
| `lotTypeId` | ObjectId | [VERIFICAR] | — | `lotTypes` (M13); antes implícita por el nombre |
| `manufacturedAt` | Date | [VERIFICAR] | — | — |
| `expiresAt` | Date | [VERIFICAR] | — | — |
| `supplierId` | ObjectId | [VERIFICAR] | — | `suppliers` (M12); antes implícita por el nombre |
| `purchaseReceiptId` | ObjectId | [VERIFICAR] | Renglón de `lots`. | `supplierReceipts` (M12) (antes `[VERIFICAR]`) |
| — | — | — | Renglón sin campo en `lotTypes` (antes `status` en esta tabla, luego `lots.status`). Reemplazado por `lots.status` (§7.37.15, §8.12): la lista original del §7.15 mezcla `lotTypes` y `lots`; desde `blockExpired` los renglones son de `lots` y `lotTypes` no tiene estado (PA-STK-11). | — |

#### 7.37.15 `lots` (COL-STK-16)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | Sí | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `lotNumber` | int / string [VERIFICAR] | Sí | — | — |
| `lotTypeId` | ObjectId | [VERIFICAR] | — | `lotTypes` (M13); antes implícita por el nombre |
| `manufacturedAt` | Date | [VERIFICAR] | — | — |
| `expiresAt` | Date | [VERIFICAR] | — | — |
| `supplierId` | ObjectId | [VERIFICAR] | — | `suppliers` (M12) |
| `purchaseReceiptId` | ObjectId | [VERIFICAR] | Recepción de compra que originó el lote. | `supplierReceipts` (M12) (antes `receipts` (M07); PA-STK-11) |
| `status` | enum | [VERIFICAR] | `available`, `blocked`, `expired`, `depleted` | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.16 `stockReservations` (COL-STK-17)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | Sí | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `serialUnitId` | ObjectId | No | — | `serialUnits` (M13) |
| `quantity` | Decimal128 | Sí | — | — |
| `warehouseId` | ObjectId | [VERIFICAR] | O: depósito o cuadrilla donde se reserva | `warehouses` (M13) |
| `target` | object | [VERIFICAR] | {type: `workOrder`/`project`/`quote`/`housingPlan`/`manufacturingOrder`, refId} (O) | — |
| `mode` | enum | [VERIFICAR] | `byModel`/`bySerial` | — |
| `status` | [VERIFICAR] | [VERIFICAR] | 8.3 | — |
| `expiresAt` | Date | [VERIFICAR] | — | — |
| `consumedQuantity` | Decimal128 | [VERIFICAR] | — | — |
| `releasedQuantity` | Decimal128 | [VERIFICAR] | — | — |
| `releaseReason` | string | [VERIFICAR] | — | — |
| `idempotencyKey` | string | [VERIFICAR] | — | — |
| `sourceRef` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — (clave polimórfica del documento origen; la colección la indica `target.type`; no es referencia directa) |

#### 7.37.17 `crewSettlements` (COL-STK-19)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `warehouseId` | ObjectId | Sí | O, depósito de cuadrilla/técnico | `warehouses` (M13) |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | Sí | — | — |
| `snapshotAt` | Date | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [{itemId, serialUnitId?, opening, delivered, consumed, applied, returned, retrieved, expected, counted, difference, differenceType (`shortage`/`surplus`), adjustmentDo… | — |
| `status` | [VERIFICAR] | [VERIFICAR] | 8.5 | — |
| `supervisorId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `evidence` | [VERIFICAR] | [VERIFICAR] | — | — |
| `closedAt` | Date | [VERIFICAR] | — | — |
| `crewId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crews` (M10); antes implícita por el nombre |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.18 `physicalCounts` (COL-STK-20)

Lista original: §7.19.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scope` | object | [VERIFICAR] | {warehouseIds, locationIds, itemGroupIds, itemIds} | — |
| `type` | enum | [VERIFICAR] | `full`/`partial`/`cycle` | — |
| `blind` | bool | [VERIFICAR] | — | — |
| `snapshotAt` | Date | [VERIFICAR] | — | — |
| `mode` | [VERIFICAR] | [VERIFICAR] | PA-STK-07 | — |
| `lines` | array | [VERIFICAR] | [{itemId, locationId, lotId, expectedQty, countedQty, countedSerials[], missingSerials[], foundSerials[], difference, countedBy, countedAt}] | — |
| `status` | [VERIFICAR] | [VERIFICAR] | 8.6 | — |
| `adjustmentDocumentId` | ObjectId | [VERIFICAR] | — | `documents` (T11) |
| `warehouseId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `warehouses` (M13) |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.19 `itemCostStates` (COL-STK-21)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | Sí | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `scopeWarehouseId` | ObjectId | [VERIFICAR] | C, si el costeo es por depósito; PA-STK-01 | `warehouses` (M13) |
| `method` | enum | [VERIFICAR] | `weightedAverage`/`fifo`/`specificIdentification` | — |
| `quantityOnHand` | [VERIFICAR] | [VERIFICAR] | — | — |
| `averageCost` | Decimal128 | [VERIFICAR] | — | — |
| `totalValue` | Decimal128 | [VERIFICAR] | — | — |
| `lastRecalculatedAt` | Date | [VERIFICAR] | . Índice único `{tenantId, itemId, scopeWarehouseId}`. `costLayers` (solo PEPS): `itemId` | — |
| `inMovementId` | ObjectId | [VERIFICAR] | — | `stockMovements` (M13); antes implícita por el nombre |
| `receivedAt` | Date | [VERIFICAR] | — | — |
| `originalQty` | Decimal128 | [VERIFICAR] | — | — |
| `remainingQty` | Decimal128 | [VERIFICAR] | — | — |
| `unitCost` | Decimal128 | [VERIFICAR] | — | — |
| `warehouseId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `warehouses` (M13) |

#### 7.37.20 `costLayers` (COL-STK-22)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | [VERIFICAR] | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `inMovementId` | ObjectId | [VERIFICAR] | — | `stockMovements` (M13); antes implícita por el nombre |
| `receivedAt` | Date | [VERIFICAR] | — | — |
| `originalQty` | Decimal128 | [VERIFICAR] | — | — |
| `remainingQty` | Decimal128 | [VERIFICAR] | — | — |
| `unitCost` | Decimal128 | [VERIFICAR] | — | — |
| `stockMovementId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `stockMovements` (M13); antes implícita por el nombre |

#### 7.37.21 `revaluations` (COL-STK-23)

Lista original: §7.21.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `mode` | enum | [VERIFICAR] | `index`/`cost`/`manual` | — |
| `dateFrom` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dateTo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `indexKey` | string | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [{itemId, warehouseId, quantity, previousCost, newCost, factor, difference}] | — |
| `projectId` | ObjectId | [VERIFICAR] | obra P3041 | `works` (M10) (antes `[VERIFICAR]`; PA-STK-11) |
| `responsibleId` | ObjectId | [VERIFICAR] | P3042 | `memberships` (T02) |
| `status` | enum | [VERIFICAR] | `draft`/`approved`/`posted`/`cancelled` | — |
| `documentId` | ObjectId | [VERIFICAR] | — | `documents` (T11) |
| `inventoryItemIds` | ObjectId[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `inventoryItems` (M13) |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.22 `reorderSuggestions` (COL-STK-24)

Lista original: §7.22.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | [VERIFICAR] | Nombre de T05; antes `itemId` en este anexo. | `inventoryItems` (M13) |
| `warehouseId` | ObjectId | [VERIFICAR] | — | `warehouses` (M13) |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `computedAt` | Date | [VERIFICAR] | — | — |
| `available` | [VERIFICAR] | [VERIFICAR] | — | — |
| `inTransit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pendingPurchaseOrders` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reserved` | [VERIFICAR] | [VERIFICAR] | — | — |
| `min` | [VERIFICAR] | [VERIFICAR] | — | — |
| `max` | [VERIFICAR] | [VERIFICAR] | — | — |
| `suggestedQty` | Decimal128 | [VERIFICAR] | — | — |
| `preferredSupplierId` | ObjectId | [VERIFICAR] | — | `suppliers` (M12) |
| `lastPurchases` | array | [VERIFICAR] | [{date, supplierId, unitCost, quantity}] | — |
| `status` | enum | [VERIFICAR] | `open`/`converted`/`dismissed` | — |
| `requisitionId` | ObjectId | [VERIFICAR] | M12 | `supplyRequests` (M12) (antes `[VERIFICAR]`) |
| `supplyRequestId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `supplyRequests` (M12); antes implícita por el nombre |

#### 7.37.23 `expenseUnits` (COL-STK-25)

Lista original: §7.23.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_UNIDADES` | — |
| `notes` | string | [VERIFICAR] | `OBS_UNIDADES` | — |
| `costCenterId` | ObjectId | [VERIFICAR] | M15, PA-STK-06 | `costCenters` (M15) |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |

#### 7.37.24 `fixedAssets` (COL-STK-26) — referencias declaradas

| Campo | Referencia |
|---|---|
| `itemId` | `inventoryItems` (M13); antes implícita por el nombre |
| `itemGroupId` | `itemGroups` (M13); antes implícita por el nombre |
| `supplierInvoiceRef` | `supplierInvoices` (M12); antes implícita por el nombre |
| `isImprovement` | — (booleano, no es referencia; antes `[VERIFICAR]`) |
| `costCenterId` | `costCenters` (M15) (clave de T05; centro principal; el reparto va en `costCenterAllocation[].costCenterId`; PA-STK-11) |
| `parentAssetId` | `fixedAssets` (M13); antes implícita por el nombre |

#### 7.37.25 `fixedAssetHistory` (COL-STK-27)

Lista original: §7.25.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fixedAssetId` | ObjectId | [VERIFICAR] | — | `fixedAssets` (M13); antes implícita por el nombre |
| `versionNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `snapshot` | [VERIFICAR] | [VERIFICAR] | todos los campos de 7.24 | — |
| `changedFields` | [VERIFICAR] | [VERIFICAR] | — | — |
| `changedAt` | Date | [VERIFICAR] | — | — |
| `changedBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `reason` | string | [VERIFICAR] | — | — |

#### 7.37.26 `fixedAssetValueChanges` (COL-STK-28)

Lista original: §7.26.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fixedAssetId` | ObjectId | [VERIFICAR] | — | `fixedAssets` (M13); antes implícita por el nombre |
| `type` | enum | [VERIFICAR] | `impairment`/`improvement`/`inflationAdjustment`/`revaluation` | — |
| `date` | Date | [VERIFICAR] | `FECHA` | — |
| `amount` | Decimal128 | [VERIFICAR] | `IMPORTE` | — |
| `reason` | string | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `posted`, `voided` (§8.13; PA-STK-10; antes sin valores ni máquina). | — |
| `eventId` | ObjectId | [VERIFICAR] | — | `accountingEvents` (M15); antes implícita por el nombre |
| `journalEntryId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `journalEntries` (M15); antes implícita por el nombre |

#### 7.37.27 `depreciationRuns` (COL-STK-29)

Lista original: §7.27.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `type` | enum | [VERIFICAR] | `monthly`/`annual`/`disposal`/`inflationAdjustment` | — |
| `mode` | enum | [VERIFICAR] | `simulation`/`posted` | — |
| `status` | [VERIFICAR] | [VERIFICAR] | 8.8 | — |
| `totals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reversalOfRunId` | ObjectId | [VERIFICAR] | Corrida revertida. | `depreciationRuns` (M13) (antes `[VERIFICAR]`) |
| `fixedAssetId` | ObjectId | [VERIFICAR] | — | `fixedAssets` (M13); antes implícita por el nombre |
| `from` | Date | [VERIFICAR] | `DESDE` | — |
| `to` | Date | [VERIFICAR] | `HASTA` | — |
| `days` | int | [VERIFICAR] | — | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `lastDepreciationAmount` | Decimal128 | [VERIFICAR] | `ULT_IMP_AMORT` | — |
| `lastOriginalValue` | Decimal128 | [VERIFICAR] | `ULT_IMP_ORIGEN` | — |
| `inflationAdjustment` | [VERIFICAR] | [VERIFICAR] | `AJUSTE_INFL` | — |
| `adjustedOriginalValue` | Decimal128 | [VERIFICAR] | `VAL_ORIG_AJUS` | — |
| `accumulated` | [VERIFICAR] | [VERIFICAR] | `AMOR_ACUM` | — |
| `accumulatedAdjusted` | [VERIFICAR] | [VERIFICAR] | `AMOR_ACUM_AJUS` | — |
| `periodAdjusted` | [VERIFICAR] | [VERIFICAR] | `AMOR_EJER_AJUS` | — |
| `costCenterSplit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `journalRef` | string | [VERIFICAR] | devuelto por M15, reemplaza `COD_ASI` | `journalEntries` (M15) (identificador del asiento informado por EVT-CON-01) |
| `fiscalYearId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `fiscalYears` (M15); antes implícita por el nombre |
| `period` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.28 `fixedAssetDepreciations` (COL-STK-30)

Lista original: §7.27.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `runId` | ObjectId | [VERIFICAR] | Reemplazado por `depreciationRunId` (nombre de T05). | `depreciationRuns` (M13) (antes `[VERIFICAR]`) |
| `fixedAssetId` | ObjectId | [VERIFICAR] | — | `fixedAssets` (M13); antes implícita por el nombre |
| `from` | Date | [VERIFICAR] | `DESDE` | — |
| `to` | Date | [VERIFICAR] | `HASTA` | — |
| `days` | int | [VERIFICAR] | — | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `lastDepreciationAmount` | Decimal128 | [VERIFICAR] | `ULT_IMP_AMORT` | — |
| `lastOriginalValue` | Decimal128 | [VERIFICAR] | `ULT_IMP_ORIGEN` | — |
| `inflationAdjustment` | [VERIFICAR] | [VERIFICAR] | `AJUSTE_INFL` | — |
| `adjustedOriginalValue` | Decimal128 | [VERIFICAR] | `VAL_ORIG_AJUS` | — |
| `accumulated` | [VERIFICAR] | [VERIFICAR] | `AMOR_ACUM` | — |
| `accumulatedAdjusted` | [VERIFICAR] | [VERIFICAR] | `AMOR_ACUM_AJUS` | — |
| `periodAdjusted` | [VERIFICAR] | [VERIFICAR] | `AMOR_EJER_AJUS` | — |
| `costCenterSplit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `journalRef` | string | [VERIFICAR] | devuelto por M15, reemplaza `COD_ASI` | `journalEntries` (M15) (identificador del asiento informado por EVT-CON-01) |
| `depreciationRunId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `depreciationRuns` (M13); antes implícita por el nombre |

#### 7.37.29 `rmaCases` (COL-STK-31) — referencias declaradas

| Campo | Referencia |
|---|---|
| `itemId` | `inventoryItems` (M13); antes implícita por el nombre |
| `statusId` | `receptionStatuses` (M13); antes implícita por el nombre |

#### 7.37.30 `receptionStatuses` (COL-STK-32)

Lista original: §7.29.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `description` | string | [VERIFICAR] | `DESCRIP` | — |
| `notes` | string | [VERIFICAR] | `NOTAS` | — |
| `icon` | [VERIFICAR] | [VERIFICAR] | `ICONO` | — |
| `level` | [VERIFICAR] | [VERIFICAR] | `NIVEL` | — |
| `isFinal` | bool | [VERIFICAR] | . `serviceReceptions`: `number` (`COD_REC`) | — |
| `date` | Date | [VERIFICAR] | — | — |
| `receivedAt` | Date | [VERIFICAR] | `FECHA_ING` | — |
| `accountIds` | ObjectId[] | [VERIFICAR] | `COD_CLI1`, `COD_CLI2` | `accounts` (M01); antes implícita por el nombre |
| `requestedBy` | ObjectId | [VERIFICAR] | `QUIENPIDE` | — |
| `documentRef` | string | [VERIFICAR] | `COD_COM/SUC_COM/NUM_COM` | — (número del comprobante de origen como texto; no es referencia) |
| `notes` | string | [VERIFICAR] | `OBS` | — |
| `registeredBy` | ObjectId | [VERIFICAR] | `USERS`, `FECHA_REG` | — |
| `items` | array | [VERIFICAR] | [{lineId, itemId (`COD_PRO`), quantity (`CAN_PRO`), price (`PRE_VSI`), customerSerial, currentStatusId, statusHistory [{statusId, at, userId}] (`ITRE_EST`)}] | — |
| — | — | — | Renglón sin campo en `receptionStatuses` (antes `status` en esta tabla, luego `serviceReceptions.status`). Reemplazado por `serviceReceptions.status` (§7.37.31, §8.14): la lista original del §7.29 mezcla ambas colecciones; desde `date` los renglones son de `serviceReceptions` y `receptionStatuses` es un catálogo sin estado (PA-STK-11). | — |

#### 7.37.31 `serviceReceptions` (COL-STK-33)

Lista original: §7.29.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | `COD_REC` | — |
| `date` | Date | [VERIFICAR] | — | — |
| `receivedAt` | Date | [VERIFICAR] | `FECHA_ING` | — |
| `accountIds` | ObjectId[] | [VERIFICAR] | `COD_CLI1`, `COD_CLI2` | `accounts` (M01) |
| `requestedBy` | ObjectId | [VERIFICAR] | `QUIENPIDE` | `memberships` (T02) |
| `documentRef` | string | [VERIFICAR] | `COD_COM/SUC_COM/NUM_COM` | — (número del comprobante de origen como texto; no es referencia) |
| `notes` | string | [VERIFICAR] | `OBS` | — |
| `registeredBy` | ObjectId | [VERIFICAR] | `USERS`, `FECHA_REG` | `memberships` (T02) |
| `items` | array | [VERIFICAR] | [{lineId, itemId (`COD_PRO`), quantity (`CAN_PRO`), price (`PRE_VSI`), customerSerial, currentStatusId, statusHistory [{statusId, at, userId}] (`ITRE_EST`)}] | — |
| `status` | enum | Sí | `open`, `closed`, `cancelled` (§8.14; antes sin valores, PA-STK-11). El avance de cada renglón lo da `items[].currentStatusId` (`receptionStatuses`). | — |
| `accountId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `accounts` (M01) |
| `serialUnitId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `serialUnits` (M13) |

#### 7.37.32 `bomStructures` (COL-STK-34)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `inventoryItemId` | ObjectId | Sí | Nombre de T05; antes `itemId` en este anexo. O, producto fabricable | `inventoryItems` (M13) |
| `currentVersionId` | ObjectId | [VERIFICAR] | . `bomStructureVersions`: `itemId` | `bomStructureVersions` (M13); antes implícita por el nombre |
| `versionNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `nodes` | array | [VERIFICAR] | [{nodeId (`INT_RED`), parentNodeId (`INT_PADRE`), level (`NIVEL`), componentItemId (`COD_COM`), quantity (`CAN_COM`), unitCost (`PRE_CSI`), stageId (`COD_ETA`), refere… | — |
| `laborCost` | Decimal128 | [VERIFICAR] | — | — |
| `fixedCost` | Decimal128 | [VERIFICAR] | — | — |
| `marginPercent` | Decimal128 | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.33 `bomStructureVersions` (COL-STK-35)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `itemId` | ObjectId | [VERIFICAR] | — | `inventoryItems` (M13); antes implícita por el nombre |
| `versionNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `nodes` | array | [VERIFICAR] | [{nodeId (`INT_RED`), parentNodeId (`INT_PADRE`), level (`NIVEL`), componentItemId (`COD_COM`), quantity (`CAN_COM`), unitCost (`PRE_CSI`), stageId (`COD_ETA`), refere… | — |
| `laborCost` | Decimal128 | [VERIFICAR] | — | — |
| `fixedCost` | Decimal128 | [VERIFICAR] | — | — |
| `marginPercent` | Decimal128 | [VERIFICAR] | — | — |
| `bomStructureId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `bomStructures` (M13); antes implícita por el nombre |

#### 7.37.34 `productDivisions` (COL-STK-36)

Lista original: §7.31.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operationType` | [VERIFICAR] | [VERIFICAR] | `TIPO_OPERACION` | — |
| `operationRef` | string | [VERIFICAR] | `ID_OPERACION` | `operations` (T11); antes implícita por el nombre |
| `quantity` | Decimal128 | [VERIFICAR] | `CANTIDAD` | — |
| `measure` | [VERIFICAR] | [VERIFICAR] | `MEDIDA` | — |
| `decompositionCoefficient` | [VERIFICAR] | [VERIFICAR] | `COEFICIENTE_DESCOMPOSICION` | — |
| `history` | array | [VERIFICAR] | [{snapshot, at}] (`FEC_REG`) | — |
| `bomStructureId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `bomStructures` (M13); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.35 `manufacturingStages` (COL-STK-37)

Lista original: §7.32.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `itemId` | ObjectId | [VERIFICAR] | `COD_PRO` | `inventoryItems` (M13); antes implícita por el nombre |
| `order` | int | [VERIFICAR] | `ORDEN` | — |
| `name` | string | [VERIFICAR] | `DES_ETA` | — |
| `durationHours` | int | [VERIFICAR] | `DURACION` | — |
| `notes` | string | [VERIFICAR] | `OBSERVA` | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.36 `productionReports` (COL-STK-39)

Lista original: §7.34.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | `COD_COM/SUC_COM/NUM_COM` | — |
| `recordedAt` | Date | [VERIFICAR] | `FEC_REG` | — |
| `startAt` | Date | [VERIFICAR] | `FECHA_INICIO` | — |
| `plannedAt` | Date | [VERIFICAR] | `FECHA_PREVISTA` | — |
| `endAt` | Date | [VERIFICAR] | `FECHA_FIN` | — |
| `userId` | ObjectId | [VERIFICAR] | `COD_USER` | `memberships` (T02) |
| `responsibleId` | ObjectId | [VERIFICAR] | `COD_RES` | `memberships` (T02) |
| `status` | [VERIFICAR] | [VERIFICAR] | 8.10, `COD_ESTADO` | — |
| `itemUpTo` | [VERIFICAR] | [VERIFICAR] | `ITEM_HASTA` | — |
| `items` | array | [VERIFICAR] | [{itemId, quantity, saleDocumentRef (`COD_CVE`), status, orderProductLineId (`COD_OPR`), itemUpTo, manufacturingOrderId, serialNumbers[]}] | — |
| `components` | array | [VERIFICAR] | [{itemId, quantity, orderProductLineId, serialUnitId (`COD_PTH`)}] | — |
| `componentsConsumed` | bool | [VERIFICAR] | — | — |
| `damage` | array | [VERIFICAR] | [{type: `productChange`/`destruction`/`reassignment`, itemId, quantity, targetOrderId}] | — |
| `originalReportId` | ObjectId | [VERIFICAR] | — | `productionReports` (M13); antes implícita por el nombre |
| `manufacturingOrderId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `manufacturingOrders` (M13); antes implícita por el nombre |

#### 7.37.37 `mrpRuns` (COL-STK-40)

Lista original: §7.35.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `dateFrom` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dateTo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `runAt` | Date | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [{componentItemId, requiredAt, requiredQty, inProcessQty, stockQty, minStock, netQty, preferredSupplierId, lastPurchases[]}] | — |
| `excludedLines` | [VERIFICAR] | [VERIFICAR] | — | — |
| `requisitionIds` | ObjectId[] | [VERIFICAR] | Solicitudes generadas en M12 (§8.13). | `supplyRequests` (M12) (antes `[VERIFICAR]`) |
| `status` | Enum | Sí | `calculated`, `confirmed`, `discarded`, `failed` (§8.13; PA-STK-10; antes tipo `Date` por error y sin valores). Reemplaza P168 (última fecha de requerimiento) por el historial de corridas | — |
| `manufacturingOrderIds` | ObjectId[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `manufacturingOrders` (M13); antes implícita por el nombre |

## 8. Estados y transiciones

### 8.1 `stockDocuments.status`

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Usuario con `crear` | — | Sin efecto en saldos. | Descartar (borrado lógico permitido solo en borrador). |
| `draft` | `pendingApproval` | Sistema | Tipo con aprobación (ajuste sobre umbral, baja, revaluación) | Instancia de workflow T11. | Rechazo → `rejected`. |
| `draft` / `pendingApproval` | `posted` | Usuario / aprobador | Período abierto, stock suficiente según política, series válidas | Movimientos, saldos, trayectoria, eventos outbox. | Anulación → `cancelled` con documento `reversal`. |
| `posted` (transferencia con tránsito, entrega a cuadrilla) | `inTransit` → `received` / `partiallyReceived` | Receptor | Aceptación en destino | Entrada en destino; diferencias quedan pendientes. | Rechazo de entrega → vuelve al origen (`returnedToOrigin`). |
| `posted` | `cancelled` | Usuario con `anular` | RN-STK-007, período abierto | Contramovimientos. | No reversible (se crea un documento nuevo). |
| cualquiera no final (campo) | `conflict` | Sistema | Sincronización contra OT cancelada/reasignada | Bandeja de conflictos; efectos físicos según resolución. | Resolver → `posted` o `cancelled`. |

### 8.2 `serialUnits.status`

Estado inicial: `available`.

| Origen | Destino | Actor / disparador | Precondición | Efectos |
|---|---|---|---|---|
| — | `available` | Recepción (M12), vale de entrada, migración, retorno de revisión apto | Serie válida (RN-STK-020/021) | Trayectoria `received`. |
| `available` | `reserved` | Reserva por serie | Sin otra reserva activa | Disponible −1. |
| `reserved` | `available` | Liberación de reserva | — | Disponible +1. |
| `available` / `reserved` | `inTransit` | Transferencia o entrega emitida | — | Sin cambio de propiedad. |
| `inTransit` | `inCustody` | Aceptación por cuadrilla/técnico | — | Custodio = técnico. |
| `inTransit` | `available` | Recepción en depósito destino | — | |
| `inCustody` | `applied` | Aplicación en OT (campo o admin) | RN-STK-018/019/075; OT válida o conflicto | Asignación `active`; ubicación domicilio; evento a M10. |
| `inCustody` | `available` | Devolución de cuadrilla | — | |
| `applied` | `retrievedPendingReview` | Retiro en OT o devolución en mostrador | Asignación activa | Asignación `returned`. |
| `applied` | `sold` | Venta / cambio de modalidad a venta | Comprobante M05/M11 | `ownership = soldToCustomer`; sale de existencias. |
| `applied` | `lost` | Vencimiento de devolución (no recuperado) aprobado | RN-STK-038 | Asignación `notRecovered`; baja de existencia con evento. |
| `retrievedPendingReview` | `available` / `inRepair` / `inRma` / `quarantine` / `scrapped` | Revisión | — | Según decisión (RF-STK-113). |
| `inRepair` | `available` / `scrapped` | Reparación interna | — | Costos al RMA. |
| `available` / `inRepair` | `inRma` | Envío a proveedor | RMA abierto | Depósito `supplier`. |
| `inRma` | `available` / `replacedBySupplier` / `scrapped` | Retorno RMA | — | Reemplazo crea nueva unidad. |
| cualquiera propio | `scrapped` | Baja técnica aprobada | Aprobación | Sale de existencias; certificado. |
| `lost` | `retrievedPendingReview` | Recupero posterior | — | Reingreso con confirmación (RN-STK-021). |

### 8.3 `stockReservations.status`

Estado inicial: alta → `active` (PA-STK-11).

`active` → `partiallyConsumed` → `consumed` (entrega/aplicación); `active` → `released` (cancelación de OT, manual con motivo, vencimiento → `expired`); `active` → `substituted` (otra serie aplicada, RN-STK-017). Reversión: una entrega anulada reactiva la reserva si la OT sigue vigente.

### 8.4 `contractEquipmentAssignments.status` (M02; antes `equipmentAssignments.status`)

Los estados se aplican sobre `contractEquipmentAssignments` de M02 (CTR-DAT-28) y usan los valores de `status` de M02 §7.20; las transiciones que nacen de hechos de stock (retiro, devolución, no recuperado) las dispara M13 con sus eventos. Equivalencia con los nombres anteriores de esta tabla (M02 §7.20): `active` = `delivered`, `pendingReturn` = `returnPending`, `returnedIncomplete` = `returned` con `returnCondition = incomplete`, `notRecovered` = `chargedAsLost`, `swapped` = `replaced`.

| Origen | Destino | Disparador | Efectos |
|---|---|---|---|
| — | `assigned` | Reserva o asignación registrada en la OT | Sin movimiento de stock todavía. |
| `assigned` / — | `delivered` (antes `active`) | Aplicación confirmada | Equipo en domicilio; constancia. |
| `delivered` | `returnPending` (antes `pendingReturn`) | Baja confirmada, cambio de plan que no usa el equipo, fin de préstamo | Plazo `expectedReturnAt` = hoy + PRM-STK-026. |
| `delivered` / `returnPending` | `returned` (con `returnCondition` `ok`, `damaged` o `incomplete`; antes `returned` / `returnedIncomplete`) | Retiro o devolución en mostrador | Unidad `retrievedPendingReview`. |
| `delivered` | `replaced` (antes `swapped`) | Cambio de equipo | Se crea nueva asignación `delivered`. |
| `returnPending` | `chargeProposed` | Vence plazo | Propuesta de cargo (PA-STK-05). |
| `returnPending` | `lost` | Equipo declarado perdido sin propuesta de cargo | Unidad `lost`. |
| `chargeProposed` | `chargedAsLost` (antes `notRecovered`) | Aprobación del cargo | M05 factura; unidad `lost`; `returnCondition = notRecovered`. |
| `chargeProposed` | `returnPending` | Rechazo/prórroga | — |
| `chargedAsLost` | `returned` | Recupero tardío | Nota de crédito propuesta a M05 si se cobró. |
| `delivered` | `convertedToSale` | Cambio de modalidad | Unidad `sold`. |

### 8.5 `crewSettlements.status`

Estado inicial: alta → `draft` (PA-STK-11).

`draft` → `counting` (técnico/supervisor cuenta) → `withDifferences` / `balanced` → `pendingApproval` (ajustes) → `closed`. Reapertura solo por `stk.rendiciones.aprobar` con motivo antes de un nuevo cierre posterior.

### 8.6 `physicalCounts.status`

Estado inicial: alta → `planned` (PA-STK-11).

`planned` → `snapshotTaken` → `counting` → `review` (diferencias) → `pendingApproval` → `closed` (ajuste contabilizado) / `cancelled` (sin ajustes).

### 8.7 `fixedAssets.status`

Estado inicial: alta → `draft` (PA-STK-11).

`draft` (propuesto desde stock) → `registered` (sin afectación) → `inService` (afectado; amortiza) → `fullyDepreciated` (automático) → `disposed` (baja). `registered`/`inService` → `cancelled` solo con reversión de amortizaciones (RN-STK-052). Baja revertible solo por anulación del documento de baja en período abierto.

### 8.8 `depreciationRuns.status`

Estado inicial: alta → `simulated` (PA-STK-11).

`simulated` → `posted` (eventos emitidos, acumulados actualizados) → `reversed` (corrida inversa). Una corrida `posted` no se modifica.

### 8.9 `manufacturingOrders.stage`

Estado inicial: `generated`.

| Origen | Destino | Precondición | Efectos |
|---|---|---|---|
| — | `generated` | Estructura vigente | Componentes comprometidos (reserva tipo `manufacturingOrder`). |
| `generated` | `launched` | Componentes disponibles o confirmación con faltantes | `actualLaunchAt`. |
| `launched` | `finished` | Todos los renglones fabricados, o finalización manual permitida (PRM-STK-049) | Ingreso de terminados, egreso de componentes no consumidos por partes (RN-STK-063); `actualEndAt`. |
| `generated` / `launched` | `cancelled` | — | Libera comprometidos pendientes. |
| `generated` / `launched` | `voided` | RN-STK-059 | Libera comprometidos y desvincula venta. |

### 8.10 `productionReports.status`

Estado inicial: alta → `pending` (PA-STK-11).

`pending` → `inProduction` (lanzar; consume componentes si PRM-STK-040) → `finished` (ingresa productos; consume componentes si no se consumieron). `pending`/`inProduction` → `voided` con contramovimientos.

### 8.11 `rmaCases` (estados configurables, catálogo por defecto)

Estado inicial: alta → `received` (PA-STK-11).

`received` → `diagnosing` → (`internalRepair` | `sentToSupplier`) → `supplierReceived` → (`repaired` | `replaced` | `rejected`) → `returnedToStock` / `returnedToCustomer` / `scrapped` → `closed`. Cada transición registra historial y puede notificar (RN-STK-055).

### 8.12 Otras colecciones con estado (`lots.status`, `reorderSuggestions.status`)

Los valores ya estaban en §7; se explicitan las transiciones.

Estado inicial: ver las filas `(nuevo)`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `lots` | (nuevo) | `available` | Ingreso del lote | — | — |
| `lots` | `available` | `blocked` | Bloqueo de calidad | — | — |
| `lots` | `blocked` | `available` | Liberación | — | — |
| `lots` | `available` · `blocked` | `expired` | Job de vencimiento | Fecha de vencimiento cumplida | — |
| `lots` | `available` | `depleted` | Último egreso | Saldo del lote cero | — |
| `reorderSuggestions` | (nuevo) | `open` | Corrida de reposición | Saldo bajo mínimo o punto de pedido | `stk.reorder.suggested` (EVT-STK-13) |
| `reorderSuggestions` | `open` | `converted` | Conversión en solicitud de M12 | — | — |
| `reorderSuggestions` | `open` | `dismissed` | Descarte por el usuario | — | — |

### 8.13 `fixedAssetValueChanges.status` y `mrpRuns.status`

Corrección de cierre 05-11-2026 (PA-STK-10, PA 8 del pendiente de cierre): el §7 declaraba `status` sin valores ni transiciones (en `mrpRuns`, además, con tipo `Date`). Estado inicial: `fixedAssetValueChanges` `draft`; `mrpRuns` `calculated` (o `failed` si el cálculo no termina).

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `fixedAssetValueChanges` | (nuevo) | `draft` | Registro de mejora, disminución, ajuste o revalúo (RF-STK-099) | Bien no `disposed` ni `cancelled` | — |
| `fixedAssetValueChanges` | `draft` | `posted` | Confirmación: actualiza el valor del bien y emite el evento contable (`eventId`, `journalEntryId` de M15) | Período abierto | `stk.fixedAsset.valueChanged` (EVT-STK-17) |
| `fixedAssetValueChanges` | `draft` | `voided` | Descarte del borrador | — | — |
| `fixedAssetValueChanges` | `posted` | `voided` | Anulación con contramovimiento de valor y reversión contable (no se borra; RN-STK-052) | Período abierto; sin amortizaciones posteriores contabilizadas que dependan del cambio | `stk.fixedAsset.valueChanged` (EVT-STK-17, reversión) |
| `mrpRuns` | (nuevo) | `calculated` | Corrida de aprovisionamiento (JOB-STK-08, API-STK-67) | RN-STK-066 | — |
| `mrpRuns` | (nuevo) | `failed` | Error del cálculo (falta estructura vigente o datos de stock) | — | — |
| `mrpRuns` | `calculated` | `confirmed` | Generar requisiciones por proveedor en M12 (`requisitionIds`) | Solo requisiciones, nunca OC directa (RN-STK-044, CTR-STK-09) | — |
| `mrpRuns` | `calculated` | `discarded` | Descarte por el usuario o nueva corrida del mismo rango | — | — |

### 8.14 Estado de stock, revaluaciones y recepciones de servicio técnico (corrección 05-11-2026)

Corrección del 05-11-2026 (PA-STK-11): el §7 enumeraba valores sin transiciones para `stockState`, `revaluations.status` y `serviceReceptions.status` (este último sin valores). `stockState` es una dimensión del saldo: cada paso es un par de movimientos (`out` del estado de origen e `in` al de destino) en la misma transacción; el movimiento es inmutable y su `stockState` no cambia después del alta.

#### 8.14.1 Estado de stock del saldo (`stockBalances.stockState`)

Estado inicial: alta → `available`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `available` | Ingreso por compra, vale de entrada, producción o saldo inicial | RN-STK-003 | — |
| `available` | `inTransit` | Transferencia con tránsito o entrega emitida (§8.1) | — | — |
| `inTransit` | `available` | Recepción en el depósito destino | — | — |
| `inTransit` | `custody` | Aceptación por la cuadrilla o el técnico | — | — |
| `available` | `custody` | Entrega a cuadrilla sin tránsito | — | — |
| `custody` | `available` | Devolución de cuadrilla | — | — |
| `custody` | `applied` | Aplicación en OT | RN-STK-018 | — |
| `applied` | `quarantine` | Retiro pendiente de revisión | — | — |
| `quarantine` | `available` | Revisión apta | — | — |
| `quarantine`, `available` | `repair` | Envío a reparación interna | — | — |
| `repair` | `available` | Reparación terminada | — | — |
| `available`, `repair`, `quarantine` | `supplier` | Envío a proveedor (RMA) | — | — |
| `supplier` | `available` | Retorno del proveedor | — | — |
| `available` | `consigned` | Entrega en consignación | — | — |
| `consigned` | `available` | Devolución de consignación | — | — |
| `available`, `quarantine`, `repair`, `supplier` | `scrap` | Baja técnica aprobada | — | — |

#### 8.14.2 Estado de stock del movimiento (`stockMovements.stockState`)

Mismas transiciones que §8.14.1, registradas como pares de movimientos. Estado inicial: alta → `available`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `available` | Ingreso por compra, vale de entrada, producción o saldo inicial | RN-STK-003 | — |
| `available` | `inTransit` | Transferencia con tránsito o entrega emitida (§8.1) | — | — |
| `inTransit` | `available` | Recepción en el depósito destino | — | — |
| `inTransit` | `custody` | Aceptación por la cuadrilla o el técnico | — | — |
| `available` | `custody` | Entrega a cuadrilla sin tránsito | — | — |
| `custody` | `available` | Devolución de cuadrilla | — | — |
| `custody` | `applied` | Aplicación en OT | RN-STK-018 | — |
| `applied` | `quarantine` | Retiro pendiente de revisión | — | — |
| `quarantine` | `available` | Revisión apta | — | — |
| `quarantine`, `available` | `repair` | Envío a reparación interna | — | — |
| `repair` | `available` | Reparación terminada | — | — |
| `available`, `repair`, `quarantine` | `supplier` | Envío a proveedor (RMA) | — | — |
| `supplier` | `available` | Retorno del proveedor | — | — |
| `available` | `consigned` | Entrega en consignación | — | — |
| `consigned` | `available` | Devolución de consignación | — | — |
| `available`, `quarantine`, `repair`, `supplier` | `scrap` | Baja técnica aprobada | — | — |

#### 8.14.3 Revaluación (`revaluations.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Cálculo de la revaluación (índice, costo o manual) | — | — |
| `draft` | `approved` | Aprobación del responsable (P3042) | — | — |
| `approved` | `posted` | Contabilización: genera el documento `revaluation` y los movimientos `kind = value` | Período abierto | — |
| `draft`, `approved` | `cancelled` | Descarte | — | — |

#### 8.14.4 Recepción de servicio técnico (`serviceReceptions.status`)

Estado inicial: `open`. El avance de cada equipo recibido lo da `items[].currentStatusId` con el catálogo `receptionStatuses`, que no tiene estado propio.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Registro de la recepción | — | — |
| `open` | `closed` | Todos los renglones en un estado con `isFinal` | — | — |
| `open` | `cancelled` | Anulación de la recepción | — | — |

## 9. Procesos y flujos

### 9.1 Ingreso por compra (O8; en O3 por vale de entrada)

1. M12 confirma la recepción física y llama `stk.receiveGoods` con renglones, cantidades, series/lotes y costo de OC/remito (`Idempotency-Key` = id de recepción).
2. STK valida series (RN-STK-020/021) y lotes; crea `stockDocument` `purchaseReceipt` `posted`, movimientos `in` al depósito de recepción con `stockState = available`, actualiza costo perpetuo (RN-STK-028/029) y crea `serialUnits`.
3. Ofrece etiquetas (PRM-STK-020). Si el artículo es bien de uso, crea `fixedAssets` en `draft` (RN-STK-047).
4. Publica `stk.goods.received` (M15 contabiliza ingreso; M12 cierra pendiente).
5. Al llegar la factura con diferencia de precio, M12 publica `cmp.matchException.raised` (EVT-CMP-10, tipo `price`) y STK registra el movimiento de valor (RN-STK-030).

En **O3** (sin M12), el encargado registra un **vale de entrada** con proveedor, costo y series (importación Excel), con el mismo efecto.

### 9.2 Instalación de Internet con equipo en comodato (O3, CU-INS-01, INS-004)

1. M10 crea la OT y publica `tec.workOrder.statusChanged` (EVT-TEC-05, estado agendada); STK crea la reserva por modelo o por serie según PRM-STK-050 (`active`).
2. **Entrega al instalador:** el encargado emite `crewDelivery` (o el técnico ya tiene stock rodante); la unidad pasa a `inTransit`; el técnico acepta en la app (`inCustody`). Depósito central −1; custodia técnico +1; existencia total sin cambio.
3. El técnico informa En camino (M10). Sin conexión, la app conserva "Mi stock" y la OT descargada.
4. En el domicilio escanea la serie y la MAC; registra materiales usados (cable drop, conectores). La app encola en IndexedDB una mutación `applyEquipment` y una `consumeMaterials` con `clientMutationId` propios, vinculadas a la versión de la OT.
5. Al sincronizar (`POST /api/stk/field/sync`), STK por cada mutación: verifica idempotencia; valida custodia (RN-STK-014/017), compatibilidad (RN-STK-019) y estado de la OT; si la OT está cancelada o reasignada, marca `conflict` (RF-STK-067).
6. Si es válida: documento `equipmentApplication` (unidad `inCustody` → `applied`, ubicación `customerPremisesPool` + `contractId`), M02 registra la asignación `active` en `contractEquipmentAssignments` con `mode = loanForUse` (CTR-DAT-28; antes `equipmentAssignments` de M13), consumo de la reserva; documento `workOrderConsumption` por materiales desde la custodia del técnico.
7. Publica `stk.equipment.applied` (M10 aprovisiona OLT/Radius con MAC/GPON SN; M10 vincula a la conformidad) y `stk.materials.consumed` (M15 costo con destino OT, servicio Internet y centro de costo).
8. Resultado por ítem a la app; reintento seguro. Una segunda sincronización del mismo cierre devuelve los resultados originales (escenario 70).
9. Si la visita falla: la app envía `visitFailed`; no hay aplicación; la reserva se mantiene o libera según la reprogramación (RN-STK-016).

### 9.3 Consumo de materiales desde la OT (CU-20)

Reserva 4 → entrega 4 (DEP-01: 16 físico, cuadrilla: 4) → consumo 3 desde custodia → devolución 1 (DEP-01: 17) → rendición: entregado 4 − consumido 3 − devuelto 1 = 0. Si el técnico declara 3 pero en la rendición cuenta 0 sobrante sin devolución, se registra faltante 1 con evidencia y ajuste aprobado (RN-STK-041).

### 9.4 Retiro de equipo en baja (Internet)

1. M09/M02 confirman la baja comercial; M02 publica `cat.contract.terminated` (EVT-CAT-15; antes citado como `cat.serviceContract.terminated`, que no está en el catálogo de T11); STK pasa la asignación a `pendingReturn` y M10 genera la OT de retiro.
2. El técnico escanea la unidad, registra condición y accesorios; sincroniza → `equipmentRetrieval`; unidad `retrievedPendingReview` en custodia del técnico; asignación `returned`/`returnedIncomplete`.
3. El técnico devuelve al depósito; el responsable revisa (RF-STK-113).
4. Si no hay retiro en PRM-STK-026 días: JOB-STK-05 marca `chargeProposed` y crea la propuesta (PA-STK-05).

### 9.5 Cambio de equipo por falla

Una OT de cambio aplica B y retira A en el mismo cierre; STK procesa ambas mutaciones en una transacción; publica `stk.equipment.swapped` con identificadores de A y B; A queda en revisión y típicamente pasa a RMA.

### 9.6 Rendición de cuadrilla (JOB-STK-04 y manual)

1. Se calcula la instantánea de la custodia y los movimientos del período.
2. El técnico o el supervisor cuentan (app con escaneo).
3. Diferencias → ajustes con motivo (faltante imputable/no imputable, sobrante) → aprobación → cierre.

### 9.7 Inventario físico

Planificar alcance → instantánea → conteo (ciego opcional, por zonas/ubicaciones, varios contadores) → recuento de diferencias según PA-STK-07 → revisión → ajuste aprobado → cierre → evento `stk.physicalCount.closed`.

### 9.8 Reposición por stock mínimo (JOB-STK-03, diario)

Para cada artículo con niveles: calcula RN-STK-043, crea/actualiza `reorderSuggestions` `open`, notifica a compras; al convertir, llama a M12 `createRequisition` con renglones y servicio; guarda `requisitionId`.

### 9.9 Valorización, revaluación y cierre de stock

- Cada movimiento actualiza `itemCostStates` (PPP: nuevo promedio = (valor + entrada) / (cantidad + entrada); PEPS: capas).
- JOB-STK-06 (mensual o a demanda) prepara el cierre: verifica saldos (JOB-STK-01), movimientos con costo provisorio, conflictos pendientes; el responsable cierra el período `stk` (T04/M15).
- Revaluación: borrador → cálculo de factores (RN-STK-033) → aprobación → movimientos de valor → evento.

### 9.10 Amortización de bienes de uso (JOB-STK-07)

1. Se elige período y modo (simulación o contabilización).
2. Por cada bien afectado no dado de baja ni totalmente amortizado, calcula días y monto (RN-STK-048/049), separa mejoras, aplica distribución por centros (RN-STK-053), valores históricos/ajustados (RN-STK-050).
3. En `posted`: crea `fixedAssetDepreciations`, actualiza acumulados en transacción, publica `stk.depreciation.posted` (M15 genera el asiento y devuelve `journalRef`).
4. Reversión: corrida inversa que restaura acumulados (RN-STK-051).
5. Idempotente por `{periodFrom, periodTo, type}` contabilizado.

**Ejemplo ficticio:** bien ARS 1.200.000, 100 % amortizable, 5 años, afectado el 16/03/2026. Anual 240.000; mensual 20.000; marzo 20.000 × 16/31 = ARS 10.322,58; abril ARS 20.000.

### 9.11 RMA

Revisión decide RMA → caso `received` → diagnóstico → envío a proveedor (`rmaShipment`, depósito `supplier`) → retorno (`rmaReturn`): reparado (misma serie a `available`), reemplazado (nueva unidad, RN-STK-056; la original `replacedBySupplier`), rechazado (`quarantine`/`scrapped`) → cierre. M12 gestiona nota de crédito o reposición.

### 9.12 Fabricación (O10)

Estructura vigente → orden `generated` (compromete componentes) → MRP (JOB-STK-08) genera requisiciones → `launched` → partes `pending` → `inProduction` (consumo si PRM-STK-040) → `finished` (ingreso de terminados con series formateadas) → `MarcarFabricados` → orden `finished` → eventos de productos en proceso y terminados (RF-STK-127). Dañados: cambio de producto, destrucción o reasignación vía orden genérica (PRM-STK-047).

### 9.13 Recuperación y reintentos (AGR-016)

Todo job registra progreso por lote; un fallo a mitad (por ejemplo evento a M15 no publicado) se repara reprocesando solo los pasos pendientes; la bandeja técnica muestra operaciones no reparables. Ninguna reparación repite movimientos confirmados.

## 10. Pantallas

Patrón común admin (CNX §4): `AdminStickyHeader` con título y acciones, `ScreenHelp` (qué, quién, cuándo, dónde, por qué, cómo + caso de uso), `DataTable` (columnas configurables, filtros, vistas guardadas, exportación XLSX/CSV/PDF, selección masiva), altas y ediciones en modal, `ConfirmDialog` para anulaciones, toasts. Patrón PWA de campo (CNX §3): cards con anatomía fija, FAB "+" para altas en modal, 3 skeleton cards, banner único de offline con "Reintentar", escaneo por cámara. Todas las etiquetas son `dict:stk.*`. Grupo del mapa del sitio: **Operación → Stock y equipos**, **Administración → Bienes de uso**, **Producción → Fabricación**.

| PAN-ID | App | Ruta | Capability | Propósito, layout y contenido | Reemplaza (INV/DFA) | Ola |
|---|---|---|---|---|---|---|
| PAN-STK-01 | admin | `/stk/articulos` | `stk.articulos.ver` | Lista de artículos. Filtros: tipo, clasificación, rubro, departamento, servicio, banderas (serializado, bien de uso, fabricable), estado, bajo mínimo. Columnas: código, nombre, tipo, rubro, unidad, disponible, reservado, en custodia, en domicilios, costo, estado. Acciones: nuevo, editar, clonar, importar (ExcelImportWizard), actualizar costos (PAN-STK-03), exportar. Vacío: "Todavía no cargaste artículos" + botón importar. | `abm_prod_ser` (faceta stock) | O3 |
| PAN-STK-02 | admin | `/stk/articulos/:id` | `stk.articulos.ver` | Ficha con pestañas: Datos (identificación, marca/modelo/fabricante, unidades y equivalencias, banderas, disponibilidad por módulo, servicios, modalidad por defecto, compatibilidad, propiedades extendidas), Stock (saldos por depósito/estado/lote), Series, Reposición (mín/máx por depósito), Costos (perpetuo, reposición, historial), Ubicaciones por defecto, Kit (componentes), Estructura (si fabricable), Adjuntos, Auditoría. Modal "Componentes del kit" (`frmSelectCombo`). | `abm_prod_ser`, `abm_prod_ser_combos`, `frmSelectCombo`, `frmProdSerUbicacion_Item` | O3 |
| PAN-STK-03 | admin | `/stk/articulos/actualizar-costos` | `stk.costos.editar` | Asistente de actualización masiva de costos de reposición: filtros (rango de códigos, departamento, rubro, tipo, servicio, proveedor), modo (%, coeficiente, dólar, monto), vista previa costo anterior/nuevo, opción de revaluar al costo, confirmar. | `Get_DatosGrilla_ActualizarPrecios` | O8 |
| PAN-STK-04 | admin | `/stk/maestros` | `stk.config.configurar` | Maestros en pestañas: Tipos, Clasificaciones (árbol con coeficiente de mano de obra), Rubros (árbol con perfil contable, vida útil, índice), Departamentos, Tipos de lote, Unidades de gasto, Estados de RMA, Estados de recepción técnica (ícono, nivel). | `TIP_PROD`, `CLASIFICACION_ITEMS`, `RUB_PYS` (`abm_CtsRubros` parte stock), `UNIDADES_GASTOS`, `ESTADOS_RECEP` | O3/O8 |
| PAN-STK-05 | admin | `/stk/depositos` | `stk.depositos.ver` | Lista de depósitos y custodios por tipo (central, sucursal, cuadrilla, técnico, vehículo, producción, componentes, tránsito, reparación, proveedor, cuarentena, consignación, descarte). Columnas: código, nombre, tipo, sucursal, custodio, unidades, valor. Modal alta/edición; acción inactivar (valida saldo cero). | `DEPOSITO` | O3 |
| PAN-STK-06 | admin | `/stk/depositos/:id/ubicaciones` | `stk.depositos.editar` | Árbol de ubicaciones con arrastrar; modal de elemento con alta masiva y enumeración; marca asignable/por defecto; "mostrar todas"; ver contenido de cada ubicación. | `frmUbicacionesStock`, `frmUbicacionesStock_Elemento` | O8 |
| PAN-STK-07 | admin | `/stk/existencias` | `stk.saldos.ver` | Consulta de disponibilidad: por artículo, servicio, depósito, ubicación, lote, cuadrilla y estado; columnas físico, disponible, reservado, en tránsito, en custodia, en domicilios, en reparación, en proveedor, comprometido OC/presupuesto, proyectado. | `Obtener_Stock_Prod`, `GetStockProductos_EnUbicacion` | O3 |
| PAN-STK-08 | admin | `/stk/kardex` | `stk.movimientos.ver` | Kárdex por artículo (y depósito) con saldo, costo unitario e importe; filtro por fechas, operación, destino, servicio. | Informes de stock | O3 |
| PAN-STK-09 | admin | `/stk/documentos` | `stk.movimientos.ver` | Bandeja de documentos de stock por tipo y estado (borrador, pendiente de aprobación, contabilizado, en tránsito, en conflicto, anulado). Acciones: nuevo vale de entrada/salida, transferencia, entrega a cuadrilla, devolución, ajuste; ver; anular (ConfirmDialog con motivo); imprimir remito interno. | `frmVales`, `frmIntercambio_Deposito`, `frmConsultar_Vales` | O3 |
| PAN-STK-10 | admin | `/stk/documentos/nuevo/:tipo` | `stk.movimientos.crear` | Editor de documento: cabecera (tipo, fecha efectiva, origen, destino con selector polimórfico OT/obra/contrato/unidad de gasto/servicio, distribución por servicios), renglones con escaneo, lote, series (modal de series con carga por rango/importación), ubicación, costo (solo ingresos); importar desde presupuesto; avisos de mínimo y negativo; adjuntar evidencia. | `frmVales_Handler`, `frmMaterialesUtilizados`, `frmProd_Ser_Trazabilidad` | O3 |
| PAN-STK-11 | admin | `/stk/series` | `stk.series.ver` | Búsqueda global de unidades por serie, MAC, GPON SN, matrícula; filtros por artículo, estado, custodio, contrato, garantía. | `PROD_TRH` | O3 |
| PAN-STK-12 | admin | `/stk/series/:id` | `stk.series.ver` | Ficha de la unidad: identificadores, estado, propiedad, custodia actual, contrato, accesorios, precintos, garantías, costo; línea de tiempo de trayectoria; pestañas Inspecciones/Ensayos, RMA, Adjuntos. Acciones: enviar a revisión, abrir RMA, registrar inspección, dar de baja. | `MOV_TRH`, `clsTrazabilidad` | O3 |
| PAN-STK-13 | admin | `/stk/reservas` | `stk.reservas.ver` | Reservas por destino con estado y vencimiento; acciones liberar (motivo), cambiar serie, extender. | comprometido | O3 |
| PAN-STK-14 | admin | `/stk/cuadrillas` | `stk.custodias.ver` | Tablero de custodias: por cuadrilla/técnico, saldo por artículo y series, entregas pendientes de aceptación, última rendición, antigüedad del saldo. Acciones: entregar, recibir devolución, iniciar rendición. | — | O3 |
| PAN-STK-15 | admin | `/stk/rendiciones/:id` | `stk.rendiciones.ver` | Rendición: tabla inicial + entregado − consumido − aplicado − devuelto = esperado vs contado, diferencias con tipo, evidencia, ajustes, aprobación y cierre. | — | O3 |
| PAN-STK-16 | admin | `/stk/conflictos` | `stk.consumos.validar` | Bandeja de conflictos de campo y sustituciones pendientes: OT, técnico, mutación recibida, motivo, evidencias; acciones aceptar, rechazar (devuelve a custodia), reasignar. | — | O3 |
| PAN-STK-17 | admin | `/stk/equipos-clientes` | `stk.asignaciones.ver` | Equipos en domicilios: por contrato/cuenta/servicio/modelo/modalidad/estado de asignación; pestaña "Pendientes de devolución" con días vencidos y acciones generar OT de retiro (M10), registrar devolución en mostrador, proponer cargo, prorrogar. | `SERSOC_PRODUCTOS` | O3 |
| PAN-STK-18 | admin | `/stk/devoluciones/mostrador` | `stk.devoluciones.crear` | Recepción de equipos en mostrador: buscar contrato o escanear serie, condición, accesorios, emitir constancia (PDF/email). | — | O3 |
| PAN-STK-19 | admin | `/stk/revision` | `stk.series.editar` | Bandeja de equipos retirados pendientes de revisión; decisión apto/reacondicionado/reparar/RMA/cuarentena/descarte con checklist y fotos. | — | O3 |
| PAN-STK-20 | admin | `/stk/inventarios` | `stk.inventarios.ver` | Inventarios físicos: planificar (alcance, tipo, ciego), tomar instantánea, asignar contadores, avance, diferencias, ajuste, cierre. | Conciliación de stock | O8 |
| PAN-STK-21 | admin | `/stk/reposicion` | `stk.sugerencias.ver` | Sugerencias de compra: artículo, depósito, servicio, disponible, en tránsito, OC pendientes, reservado, mín/máx, sugerido, proveedor habitual, últimas compras; acciones convertir en requisición (M12), descartar, editar cantidad. | `Pedir_segun_SM`, `CostoReposicion` | O8 |
| PAN-STK-22 | admin | `/stk/valorizacion` | `stk.valorizacion.ver` | Valorización a fecha por método (perpetuo y alternativos), por depósito/custodia/rubro/servicio; lista aparte de negativos; exportar. | `clsValorizarStock`, `GetValorizacionStock` | O8 |
| PAN-STK-23 | admin | `/stk/revaluaciones` | `stk.revaluaciones.crear` | Revaluaciones: nueva (índice/costo/manual), vista previa de factores, faltantes de índice, aprobación, contabilización. | `clsRevaluacion` | O8 |
| PAN-STK-24 | admin | `/stk/cierres` | `stk.cierres.crear` | Cierre de stock: checklist previo (verificación de saldos, costos provisorios, conflictos, documentos en tránsito), cerrar/reabrir período con auditoría. | P432 | O8 |
| PAN-STK-25 | admin | `/stk/bienes-uso` | `stk.bienesUso.ver` | Lista de bienes de uso: número, descripción, rubro, afectación, origen, acumulada, residual, estado; filtros; borradores propuestos desde stock; exportar. | `abm_Bienes_Uso` | O8 |
| PAN-STK-26 | admin | `/stk/bienes-uso/:id` | `stk.bienesUso.ver` | Ficha del bien: datos, importes (origen, % amortizable, vida útil, valor residual, acumulada histórica/ajustada, recupero), afectación, mejora/bien principal, distribución por centros, mejoras y disminuciones (modal), amortizaciones, historial de versiones, serie vinculada, baja (modal con recupero y resultado). | `abm_Bienes_Uso`, `abm_bienes_uso_deduc` | O8 |
| PAN-STK-27 | admin | `/stk/amortizaciones` | `stk.amortizaciones.ejecutar` | Corridas: nueva (período, tipo, simulación), resultado por bien/rubro/centro, contabilizar, revertir; cuadro de bienes de uso y cuadro de amortizaciones. | `BienesDeUso_Amortizacion`, `Get_Cuadro_*` | O8 |
| PAN-STK-28 | admin | `/stk/rma` | `stk.rma.ver` | Bandeja de RMA por estado (kanban y tabla), garantía, proveedor, antigüedad; nuevo RMA desde serie. | `RMA_PRODUCTOS` | O8 |
| PAN-STK-29 | admin | `/stk/rma/:id` | `stk.rma.editar` | Caso RMA: datos de recepción y contacto, equipo, problema, diagnóstico, garantía, envío/retorno, repuestos y costos, resolución, historial de estados, notificaciones enviadas. | `RMA_HISTORIAL`, `clsRMA` | O8 |
| PAN-STK-30 | admin | `/stk/servicio-tecnico` | `stk.recepciones.ver` | Recepciones técnicas de equipos de clientes: alta, ítems con estado por ítem (íconos/niveles), presupuesto, entrega al cliente. | `RECEPCIONES`, `ITRE_PRO`, `ITRE_EST` | O8 |
| PAN-STK-31 | admin | `/stk/fabricacion/estructuras` | `stk.fabricacion.estructuras.ver` | Estructuras (árbol multinivel), etapas, divisiones, versiones e historia, clonar, costo calculado y precio sugerido. | `PRODFAB`, `HIS_PRODFAB`, `ETAFAB`, `PRODFAB_DIVISIONES` | O10 |
| PAN-STK-32 | admin | `/stk/fabricacion/ordenes` | `stk.fabricacion.ordenes.ver` | Órdenes de fabricación: lista por etapa; ficha con productos, componentes (requerido, retirado, en partes), avance por etapa, extensiones de plazo; acciones lanzar, finalizar, cancelar, anular, extender. | `ORDEFAB`, `ORPRFAB`, `ORCOFAB`, `ORDAFAB`, `ORDEFAB_EXT` | O10 |
| PAN-STK-33 | admin | `/stk/fabricacion/partes` | `stk.fabricacion.partes.ver` | Partes de producción: alta desde orden, ítems, componentes con serie, lanzar, finalizar, dañados (cambio/destrucción/reasignación), etiquetas y series. | `OF_PARTE_*` | O10 |
| PAN-STK-34 | admin | `/stk/fabricacion/aprovisionamiento` | `stk.fabricacion.aprovisionamiento.ejecutar` | MRP: rango, requerimientos por componente con fecha, en proceso, stock, mínimo, proveedor y últimas compras; excluir previstos; generar requisiciones por proveedor. | `frmOrdenAprovisionamiento` | O10 |
| PAN-STK-35 | admin | `/stk/informes` | `stk.informes.ver` | Catálogo de informes (sección 15) con parámetros, vista previa, exportación y programación. | `clsInformes_Stock` | O3/O8 |
| PAN-STK-36 | admin | `/stk/configuracion` | `stk.config.configurar` | Parámetros del módulo (sección 14) agrupados: depósitos por defecto, políticas de negativo, reservas, campo, comodato, ajustes, costeo, cierres, bienes de uso, RMA, fabricación. Publicación versionada (T04). | `frmVariables` (módulos STOCK y FABRICACION) | O3 |
| PAN-STK-37 | pwa-campo | `/campo/mi-stock` | `stk.miStock.ver` | "Mi stock": cards por artículo (cantidad) y por serie (modelo, serie, MAC), entregas pendientes de aceptar (aceptar con firma), solicitar devolución; funciona offline con la última sincronización; badge de pendientes en cola. | — | O3 |
| PAN-STK-38 | pwa-campo | `/campo/ot/:id/materiales` | `stk.consumos.registrar` | En la ejecución de la OT (M10): sección Equipos (escanear serie a instalar o retirar, condición y accesorios) y Materiales (FAB "+" para agregar artículo/cantidad/lote desde Mi stock; sugeridos según la reserva); validación local de saldo; errores inline; estado de sincronización por ítem. | `frmMaterialesUtilizados` (versión campo) | O3 |
| PAN-STK-39 | pwa-campo | `/campo/conteo/:id` | `stk.inventarios.contar` | Conteo de inventario o rendición: escaneo continuo, cantidades por artículo, lista de series esperadas/contadas, envío. | — | O3 |
| PAN-STK-40 | pwa-socio | Componente embebido en PAN-POR-30 (`/app/servicios/:contractId`, bloque "Equipos"); M19 es dueño de la ruta y la composición (HUE-SRV-04). Ruta original `/mis-servicios/:id/equipos` reemplazada. | `stk.misEquipos.ver` | **Componente embebido en PAN-POR-30** (HUE-SRV-04). STK aporta el componente y la API (API-STK-45 `GET /api/stk/my-equipment`, sin cambios). Contenido original: equipos instalados en el servicio del socio: modelo, serie, modalidad, fecha, constancia descargable (URL firmada), cómo devolver; aviso de devolución pendiente tras una baja. | — | O3 |
| PAN-STK-41 | pwa-empleado | `/deposito/entregas` | `stk.entregas.crear` | Entrega rápida desde el depósito con celular/lector: elegir técnico, escanear series y artículos, firma del técnico. | — | O3 |

Estados vacíos y ayuda: cada pantalla define mensaje vacío con acción principal; `ScreenHelp` incluye el caso de uso relacionado (CU de la sección 16).

## 11. API

Base admin `/api/admin/stk/...`; PWA `/api/stk/...`; terceros `/api/v1/ext/stk/...`. Paginación `{ items, total, page, size }`; errores RFC 9457 con tipos `stk/negative-stock`, `stk/period-closed`, `stk/serial-duplicate`, `stk/serial-already-applied`, `stk/serial-not-in-custody`, `stk/reservation-conflict`, `stk/incompatible-equipment`, `stk/approval-required`, `stk/version-conflict`. Validación Zod compartida (`packages/shared/schemas/stk`).

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-STK-01 | GET | `/api/admin/stk/items` | `stk.articulos.ver` | Lista/búsqueda de artículos. | — |
| API-STK-02 | POST | `/api/admin/stk/items` | `stk.articulos.crear` | Alta de artículo. | Sí (`Idempotency-Key`) |
| API-STK-03 | GET | `/api/admin/stk/items/:id` | `stk.articulos.ver` | Ficha. | — |
| API-STK-04 | PATCH | `/api/admin/stk/items/:id` | `stk.articulos.editar` | Edición con `version`. | — |
| API-STK-05 | POST | `/api/admin/stk/items/:id/clone` | `stk.articulos.crear` | Clonar. | Sí |
| API-STK-06 | POST | `/api/admin/stk/items/import` | `stk.articulos.crear` | Importación (preview y confirm con `step`). | Sí |
| API-STK-07 | POST | `/api/admin/stk/items/cost-update` | `stk.costos.editar` | Actualización masiva de costos (preview/confirm). | Sí |
| API-STK-08 | GET/POST/PATCH | `/api/admin/stk/item-types`, `/item-classifications`, `/item-groups`, `/item-departments`, `/lot-types`, `/expense-units`, `/rma-statuses`, `/reception-statuses` | `stk.config.configurar` (escritura), `stk.articulos.ver` (lectura) | Maestros. | Sí en POST |
| API-STK-09 | PUT | `/api/admin/stk/items/:id/kit` | `stk.articulos.editar` | Componentes del kit. | Sí |
| API-STK-10 | GET/POST/PATCH | `/api/admin/stk/warehouses` | `stk.depositos.ver` (GET), `stk.depositos.editar` (POST, PATCH) (antes `stk.depositos.*`) | Depósitos. | Sí en POST |
| API-STK-11 | POST | `/api/admin/stk/warehouses/:id/deactivate` | `stk.depositos.editar` | Inactivar (saldo cero). | Sí |
| API-STK-12 | GET/PUT | `/api/admin/stk/warehouses/:id/locations` | `stk.depositos.editar` | Árbol de ubicaciones; alta masiva. | Sí |
| API-STK-13 | PUT | `/api/admin/stk/items/:id/location-defaults` | `stk.articulos.editar` | Ubicaciones por defecto y capacidad. | Sí |
| API-STK-14 | GET | `/api/admin/stk/balances` | `stk.saldos.ver` | Disponibilidad por dimensiones (incluye comprometido). | — |
| API-STK-15 | GET | `/api/admin/stk/movements` | `stk.movimientos.ver` | Kárdex/movimientos. | — |
| API-STK-16 | GET | `/api/admin/stk/documents` | `stk.movimientos.ver` | Documentos. | — |
| API-STK-17 | POST | `/api/admin/stk/documents` | `stk.movimientos.crear` | Crear documento (borrador o contabilizar). | Sí |
| API-STK-18 | POST | `/api/admin/stk/documents/:id/post` | `stk.movimientos.crear` | Contabilizar borrador. | Sí |
| API-STK-19 | POST | `/api/admin/stk/documents/:id/receive` | `stk.transferencias.recibir` | Recepción en destino (parcial con diferencias). | Sí |
| API-STK-20 | POST | `/api/admin/stk/documents/:id/cancel` | `stk.movimientos.anular` | Anulación con contramovimiento. | Sí |
| API-STK-21 | GET | `/api/admin/stk/documents/:id/print` | `stk.movimientos.ver` | PDF (remito interno, vale, constancia). | — |
| API-STK-22 | GET | `/api/admin/stk/serial-units` | `stk.series.ver` | Búsqueda por cualquier identificador. | — |
| API-STK-23 | GET | `/api/admin/stk/serial-units/:id` | `stk.series.ver` | Ficha y trayectoria. | — |
| API-STK-24 | POST | `/api/admin/stk/serial-units/validate` | `stk.series.crear` | Validar series a ingresar (RN-STK-020/021). | — |
| API-STK-25 | POST | `/api/admin/stk/serial-units/:id/inspections` | `stk.series.editar` | Registrar inspección/ensayo. | Sí |
| API-STK-26 | POST | `/api/admin/stk/serial-units/:id/review` | `stk.series.editar` | Decisión de revisión de equipo retirado. | Sí |
| API-STK-27 | POST | `/api/admin/stk/serial-units/:id/scrap` | `stk.bajas.aprobar` | Baja técnica. | Sí |
| API-STK-28 | GET/POST | `/api/admin/stk/lots` | `stk.lotes.ver` (GET), `stk.lotes.editar` (POST; nueva) (antes `stk.lotes.*`) | Lotes. | Sí en POST |
| API-STK-29 | POST | `/api/admin/stk/reservations` | `stk.reservas.crear` | Crear reserva (servicio interno usado por M10/M11/M18). | Sí |
| API-STK-30 | POST | `/api/admin/stk/reservations/:id/release` | `stk.reservas.liberar` | Liberar con motivo. | Sí |
| API-STK-31 | GET | `/api/admin/stk/reservations` | `stk.reservas.ver` | Consultar por destino. | — |
| API-STK-32 | POST | `/api/admin/stk/crew-deliveries` | `stk.entregas.crear` | Entrega a cuadrilla/técnico. | Sí |
| API-STK-33 | GET | `/api/stk/field/my-stock` | `stk.miStock.ver` | Mi stock (para caché offline, con `asOf`). | — |
| API-STK-34 | POST | `/api/stk/field/deliveries/:id/accept` | `stk.entregas.aceptar` | Aceptar entrega con firma. | Sí (`clientMutationId`) |
| API-STK-35 | POST | `/api/stk/field/sync` | `stk.consumos.registrar` / `stk.aplicaciones.registrar` / `stk.retiros.registrar` | Lote de mutaciones de campo (`consumeMaterials`, `applyEquipment`, `retrieveEquipment`, `visitFailed`, `returnRequest`, `countLine`), resultado por ítem. | Sí (por `clientMutationId`) |
| API-STK-36 | POST | `/api/admin/stk/work-orders/:woId/materials` | `stk.consumos.registrar` | Carga de materiales desde admin. | Sí |
| API-STK-37 | GET | `/api/admin/stk/work-orders/:woId/materials` | `stk.movimientos.ver` | Reservado/entregado/consumido/devuelto de la OT. | — |
| API-STK-38 | GET/POST | `/api/admin/stk/conflicts`, `/conflicts/:id/resolve` | `stk.consumos.validar` | Conflictos y sustituciones. | Sí en POST |
| API-STK-39 | GET/POST | `/api/admin/stk/crew-settlements` | `stk.rendiciones.ver` (GET), `stk.rendiciones.editar` (crear, contar, ajustar; nueva), `stk.rendiciones.aprobar` (cerrar) (antes `stk.rendiciones.*`) | Rendiciones: crear, contar, ajustar, cerrar. | Sí |
| API-STK-40 | GET | `/api/admin/stk/equipment-assignments` | `stk.asignaciones.ver` | Equipos en domicilios. | — |
| API-STK-41 | POST | `/api/admin/stk/equipment-assignments/:id/counter-return` | `stk.devoluciones.crear` | Devolución en mostrador. | Sí |
| API-STK-42 | POST | `/api/admin/stk/equipment-assignments/:id/charge-proposal` | `stk.asignaciones.editar` | Proponer cargo por no devolución. | Sí |
| API-STK-43 | POST | `/api/admin/stk/equipment-assignments/:id/extend` | `stk.asignaciones.editar` | Prorrogar devolución. | Sí |
| API-STK-44 | POST | `/api/admin/stk/equipment-assignments/:id/change-mode` | `stk.asignaciones.editar` | Cambio de modalidad (por ejemplo a venta). | Sí |
| API-STK-45 | GET | `/api/stk/my-equipment` | `stk.misEquipos.ver` | Equipos del socio (solo sus contratos). | — |
| API-STK-46 | GET/POST | `/api/admin/stk/physical-counts` (+ `/:id/snapshot`, `/:id/lines`, `/:id/close`) | `stk.inventarios.ver` (GET), `stk.inventarios.contar` (POST, `/snapshot`, `/lines`), `stk.inventarios.cerrar` (`/close`; nueva) (antes `stk.inventarios.*`) | Inventarios físicos. | Sí |
| API-STK-47 | POST | `/api/admin/stk/adjustments` | `stk.ajustes.crear` | Ajuste (queda pendiente si supera umbral). | Sí |
| API-STK-48 | GET | `/api/admin/stk/reorder-suggestions` | `stk.sugerencias.ver` | Sugerencias. | — |
| API-STK-49 | POST | `/api/admin/stk/reorder-suggestions/convert` | `stk.sugerencias.convertir` | Convertir en requisición M12. | Sí |
| API-STK-50 | GET | `/api/admin/stk/valuation` | `stk.valorizacion.ver` | Valorización a fecha por método. | — |
| API-STK-51 | GET/POST | `/api/admin/stk/revaluations` (+ `/:id/approve`, `/:id/post`) | `stk.revaluaciones.ver` (GET; nueva), `stk.revaluaciones.crear` (POST), `stk.revaluaciones.aprobar` (`/approve`, `/post`; nueva) (antes `stk.revaluaciones.*`) | Revaluaciones. | Sí |
| API-STK-52 | POST | `/api/admin/stk/periods/:periodKey/close` y `/reopen` | `stk.cierres.crear` / `stk.cierres.reabrir` | Cierre de stock. | Sí |
| API-STK-53 | GET/POST/PATCH | `/api/admin/stk/fixed-assets` | `stk.bienesUso.ver` (GET), `stk.bienesUso.editar` (POST, PATCH) (antes `stk.bienesUso.*`) | Bienes de uso (incluye confirmar borrador). | Sí en POST |
| API-STK-54 | POST | `/api/admin/stk/fixed-assets/:id/value-changes` | `stk.bienesUso.editar` | Mejora, disminución, ajuste. | Sí |
| API-STK-55 | POST | `/api/admin/stk/fixed-assets/:id/dispose` | `stk.bienesUso.baja` | Baja con recupero. | Sí |
| API-STK-56 | POST | `/api/admin/stk/fixed-assets/:id/cancel` | `stk.bienesUso.baja` | Anular con reversión. | Sí |
| API-STK-57 | GET | `/api/admin/stk/fixed-assets/:id/history` | `stk.bienesUso.ver` | Historial. | — |
| API-STK-58 | POST | `/api/admin/stk/depreciation-runs` | `stk.amortizaciones.ejecutar` | Simular o contabilizar corrida. | Sí (por período y tipo) |
| API-STK-59 | POST | `/api/admin/stk/depreciation-runs/:id/reverse` | `stk.amortizaciones.revertir` | Revertir. | Sí |
| API-STK-60 | GET | `/api/admin/stk/fixed-assets/reports/:type` | `stk.bienesUso.ver` | Cuadro de bienes y de amortizaciones. | — |
| API-STK-61 | GET/POST/PATCH | `/api/admin/stk/rma-cases` (+ `/:id/status`, `/:id/ship`, `/:id/return`) | `stk.rma.ver` (GET), `stk.rma.crear` (POST), `stk.rma.editar` (PATCH, `/status`, `/ship`, `/return`), `stk.rma.cerrar` (cierre) (antes `stk.rma.*`) | RMA. | Sí |
| API-STK-62 | GET/POST/PATCH | `/api/admin/stk/service-receptions` (+ `/:id/items/:lineId/status`, `/:id/deliver`) | `stk.recepciones.ver` (GET), `stk.recepciones.crear` (POST), `stk.recepciones.editar` (PATCH, `/status`), `stk.recepciones.entregar` (`/deliver`) (antes `stk.recepciones.*`) | Recepción técnica. | Sí |
| API-STK-63 | GET/POST/PUT | `/api/admin/stk/manufacturing/boms` (+ `/:itemId/versions`, `/:itemId/clone`, `/:itemId/cost`) | `stk.fabricacion.estructuras.ver` (GET), `stk.fabricacion.estructuras.editar` (POST, PUT, `/versions`, `/clone`, `/cost`; nueva) (antes `stk.fabricacion.estructuras.*`) | Estructuras. | Sí |
| API-STK-64 | GET/POST | `/api/admin/stk/manufacturing/stages`, `/divisions` | `stk.fabricacion.estructuras.ver` (GET), `stk.fabricacion.estructuras.editar` (POST; nueva) (antes `stk.fabricacion.estructuras.*`) | Etapas y divisiones. | Sí |
| API-STK-65 | GET/POST/PATCH | `/api/admin/stk/manufacturing/orders` (+ `/:id/launch`, `/:id/finish`, `/:id/cancel`, `/:id/void`, `/:id/extend`) | `stk.fabricacion.ordenes.ver` (GET), `stk.fabricacion.ordenes.editar` (POST, PATCH, `/launch`, `/finish`, `/cancel`, `/void`, `/extend`; nueva) (antes `stk.fabricacion.ordenes.*`) | Órdenes. | Sí |
| API-STK-66 | GET/POST | `/api/admin/stk/manufacturing/reports` (+ `/:id/launch`, `/:id/finish`, `/:id/damage`, `/:id/void`, `/:id/labels`) | `stk.fabricacion.partes.ver` (GET), `stk.fabricacion.partes.crear` (POST, `/damage`, `/void`, `/labels`), `stk.fabricacion.partes.lanzar` (`/launch`), `stk.fabricacion.partes.finalizar` (`/finish`) (antes `stk.fabricacion.partes.*`) | Partes de producción. | Sí |
| API-STK-67 | POST | `/api/admin/stk/manufacturing/mrp-runs` (+ `/:id/requisitions`) | `stk.fabricacion.aprovisionamiento.ejecutar` | MRP y requisiciones. | Sí |
| API-STK-68 | GET | `/api/admin/stk/reports/:reportKey` | `stk.informes.ver` / `stk.informes.exportar` | Informes y exportación (`format=xlsx\|csv\|pdf`). | — |
| API-STK-69 | POST | `/api/admin/stk/labels` | `stk.etiquetas.imprimir` | Etiquetas por artículo/serie/lote/ubicación. | — |
| API-STK-70 | POST | `/api/v1/ext/stk/vouchers` | `stk.ext.vales.crear` (token) | Vales desde sistemas externos (reemplaza Procoop INTEGRA). | Sí (obligatorio) |
| API-STK-71 | GET | `/api/v1/ext/stk/balances` | `stk.ext.saldos.ver` (token) | Saldos para terceros/BI. | — |
| API-STK-72 | GET | `/api/admin/stk/audit` | `stk.auditoria.ver` | Auditoría del módulo. | — |

**Servicios internos expuestos a otros módulos** (llamada en proceso, DEC-003): `stk.receiveGoods` (M12), `stk.returnToSupplier` (M12), `stk.reserve` / `stk.release` (M10, M11, M18), `stk.deliverSold` (M05/M11), `stk.getAvailability` (M10, M11, M12), `stk.getContractEquipment` (M09, M10, M19), `stk.registerCustomerOwnedDevice` (M10).

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox, DEC-003)

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-STK-01 | `stk.goods.received` | Ingreso por compra o vale de entrada | M15 (asiento), M12 (cierre de pendiente) |
| EVT-STK-02 | `stk.materials.consumed` | Consumo contabilizado (OT, OM, obra, unidad de gasto) | M15, M10 (costo de OT), T10 |
| EVT-STK-03 | `stk.custody.transferred` | Entrega/devolución de cuadrilla, transferencia | M10 (tablero de cuadrilla), T10 |
| EVT-STK-04 | `stk.equipment.applied` | Aplicación a contrato | M10 (aprovisionamiento, conformidad), M02 (contrato), M19, M15 (si cambia custodia contable comodato) |
| EVT-STK-05 | `stk.equipment.retrieved` | Retiro o devolución | M10 (desaprovisionar), M02, M15 |
| EVT-STK-06 | `stk.equipment.swapped` | Cambio de equipo | M10 (reaprovisionar con MAC nueva) |
| EVT-STK-07 | `stk.equipment.returnOverdue` | Vence plazo de devolución | M09 (contacto), T09 (aviso al socio) |
| EVT-STK-08 | `stk.equipment.chargeProposed` / `stk.equipment.chargeApproved` | Propuesta y aprobación de cargo por no devolución | M05 (concepto facturable), T11 |
| EVT-STK-09 | `stk.equipment.sold` | Venta de equipo | M15 (costo de mercadería vendida) |
| EVT-STK-10 | `stk.reservation.created` / `released` / `expired` | Reservas | M10 |
| EVT-STK-11 | `stk.adjustment.posted` | Ajuste aprobado | M15 |
| EVT-STK-12 | `stk.item.belowMinimum` | Saldo bajo mínimo | M12, T09 |
| EVT-STK-13 | `stk.reorder.suggested` | Nuevas sugerencias | M12 |
| EVT-STK-14 | `stk.valuation.changed` | Revaluación o diferencia de precio | M15 |
| EVT-STK-15 | `stk.period.closed` / `reopened` | Cierre de stock | M15, T04 |
| EVT-STK-16 | `stk.physicalCount.closed` | Cierre de inventario | M15, T10 |
| EVT-STK-17 | `stk.fixedAsset.registered` / `disposed` / `valueChanged` | Alta, baja, mejora, disminución | M15 |
| EVT-STK-18 | `stk.depreciation.posted` / `reversed` | Corrida de amortización | M15 |
| EVT-STK-19 | `stk.rma.statusChanged` | Cambio de estado RMA | T09 (notificación), M12 (nota de crédito/reposición) |
| EVT-STK-20 | `stk.manufacturing.inProcess` / `finished` | Fabricación | M15, M11 (comprobante de venta vinculado) |
| EVT-STK-21 | `stk.fieldConflict.raised` / `resolved` | Conflicto offline | M10, bandeja de supervisión |
| EVT-STK-22 | `stk.crewSettlement.closed` | Cierre de rendición con diferencias | M15, M16 (si PA-STK-04 habilita cargo al empleado) |
| EVT-STK-23 | `stk.reservation.failed` | No se pudo reservar stock para una OT o una venta (payload: `reservationRequestId`, `sourceRef`, `itemId`, `missingQty`) | M10 (bloquea la etapa), M11 (avisa en la orden de venta) |
| EVT-STK-24 | `stk.goods.rejected` | Ingreso de mercadería rechazado en depósito (payload: `receiptId`, `items`, `reason`) | M12 (`stockStatus = rejected` y alerta) |

### 12.2 Eventos consumidos

| Evento | Origen | Efecto en STK |
|---|---|---|
| `tec.workOrder.statusChanged` (EVT-TEC-05; agendada o reprogramada) | M10 | Crear/ajustar reservas. |
| `tec.workOrder.cancelled` | M10 | Liberar reservas; marcar conflictos de mutaciones en curso. |
| `tec.workOrder.closed` (EVT-TEC-07) | M10 | Verificar que consumo/aplicación estén conciliados con el resultado. Si `effect = bottledGasDelivery` (RF-TEC-239), leer el bloque `bottledGas` del payload: `delivered[]` genera el egreso de llenos desde `warehouseId` (o el depósito del vehículo `vehicleId`), `retrievedEmpties[]` el ingreso de vacíos (los de `condition = damaged` o `foreign` van a revisión) y `receiptDocumentId` se guarda como constancia del documento de stock; idempotente por `workOrderId` (RF-STK-139). |
| `tec.visit.failed` | M10 | RN-STK-016. |
| `cat.contract.terminated` (EVT-CAT-15) / `cat.contract.planChanged` (EVT-CAT-18) | M02 | Asignaciones a `pendingReturn`. Antes citados como `cat.serviceContract.terminated` / `planChanged`; se alinean al catálogo de T11. |
| `cat.contract.equipmentAssigned` / `equipmentReturned` / `equipmentLost` (EVT-CAT-22) | M02 | Con `inventoryItemId` y `serialUnitId` del payload: alta de la unidad en custodia del contrato (comodato, DEC-013), recepción a depósito o paso a "no recuperada" con propuesta de cargo (RN-STK-037, RN-STK-038). La asignación vive en `contractEquipmentAssignments` de M02 (§7.17). |
| `cmp.receipt.confirmed` | M12 | Alternativa asíncrona a `stk.receiveGoods`. |
| `cmp.matchException.raised` (EVT-CMP-10; tipo `price`) | M12 | Movimiento de valor. |
| `fac.invoice.issued` (ítems con stock) | M05/M11 | Salida por venta o pendiente de entrega. |
| `con.period.closed` | M15 | Bloqueo coordinado de período. |
| `sue.employee.terminated` | M16 | Exigir rendición del depósito del técnico (RN-STK-077). |
| `cfg.economicIndex.valuePublished` (EVT-CFG-12) | T04 | Habilitar revaluación/ajuste del período. |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-STK-01 | `stk:verificar-saldos` | Diario (madrugada) y antes de cierre | Recalcula saldos desde el libro por lote de artículos y reporta diferencias (no corrige sin aprobación). |
| JOB-STK-02 | `stk:vencer-reservas` | Cada hora | Expira reservas (RN-STK-024) y notifica. |
| JOB-STK-03 | `stk:sugerir-reposicion` | Diario | Sugerencias por mínimo (9.8). |
| JOB-STK-04 | `stk:rendicion-cuadrillas` | Semanal configurable | Abre rendiciones periódicas por cuadrilla (PRM-STK-030). |
| JOB-STK-05 | `stk:devoluciones-vencidas` | Diario | Asignaciones `pendingReturn` vencidas → avisos y propuestas de cargo. |
| JOB-STK-06 | `stk:preparar-cierre` | Mensual / a demanda | Checklist de cierre de stock. |
| JOB-STK-07 | `stk:amortizar-bienes` | Mensual (o anual) | Corrida de amortización (9.10). |
| JOB-STK-08 | `stk:mrp` | A demanda / diario | Aprovisionamiento de fabricación. |
| JOB-STK-09 | `stk:vencimientos` | Diario | Lotes por vencer, ensayos por vencer, garantías por vencer. |
| JOB-STK-10 | `stk:procesar-sync-campo` | Continuo (cola) | Procesa lotes de `/field/sync` grandes de forma asíncrona con resultado por ítem. |
| JOB-STK-11 | `stk:importar` | A demanda | Importaciones Excel grandes (artículos, series, saldos). |
| JOB-STK-12 | `stk:migrar-procoop` | A demanda (O11) | Carga y conciliación de migración (sección 19). |

Todos idempotentes, reanudables por lote y con progreso visible (DEC-003).

## 13. Integraciones

El marco general (conectores, credenciales en bóveda, reintentos, estado observable por conector) está en T06. Particularidades de STK:

| Integración | Tipo | Uso | Ola |
|---|---|---|---|
| App de campo offline (propia) | Interna PWA | Cola única IndexedDB + `clientMutationId` (CNX §3.7 [MEJORAR]); `GET /field/my-stock` con `asOf`; `POST /field/sync` por lotes con resultado por ítem; fotos y firmas en IndexedDB subidas a almacenamiento privado. No se encolan: anulaciones, ajustes, cierres. | O3 |
| Aprovisionamiento ISP (MikroTik, Radius, OLT) | Vía M10/T06 | STK provee MAC/GPON SN del equipo aplicado; no llama al equipo de red directamente. | O3 |
| Lectores de código de barras/QR y etiquetadoras | Hardware local | Lector como teclado en admin; impresión de etiquetas por PDF/ZPL; el agente de hardware local (O10) puede enviar a impresoras térmicas. | O3 / O10 |
| Sistemas externos que generan vales (reemplazo de Procoop INTEGRA) | API con token | API-STK-70 con `Idempotency-Key` obligatoria y obra por defecto (PRM-STK-010). | O11 |
| Proveedores (RMA) | Email/portal | Notificaciones por estado vía T09; sin integración automática con portales de fabricantes en esta versión. | O8 |
| Cotizador de tarifas | Interna (M04) | API-TAR-064 `tar.quote`: importe del cargo por equipo no devuelto cuando hay cargo por evento aprobado (RF-STK-078, RN-TAR-246). | O6 |
| Ítems facturables | Interna (M05) | `fac.service.upsertBillableItem` en `billableItems`: los cargos que origina STK (equipo no devuelto aprobado, venta de envases de gas, RF-STK-078, RF-STK-139) se crean ahí, idempotentes por id de origen; no se usan `preloadedCharges` de M04. | O6 |
| Índices (revaluación, ajuste por inflación) | T04 | Tablas de índices versionadas por período y fuente. | O8 |
| BI | T10 | Conjuntos certificados de existencias, movimientos, equipos en domicilios y bienes de uso. | O11 |

## 14. Parámetros de configuración

Ámbitos: P = plataforma, T = tenant, S = servicio, D = depósito, U = usuario, R = rubro. Versionados y publicados según T04. "V2 #n" = número de parámetro ProCoop (`Busca_V2_*`).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-STK-001 | `stk.costing.method` | enum (`weightedAverage`, `fifo`) + `costScope` (`tenant`/`warehouse`) | T | `weightedAverage` / `tenant` | Método de costeo perpetuo (PA-STK-01). Los métodos UEPS, precio de venta y precio de costo solo existen como vistas de valorización. | V2 #2341 (FIFO; LIFO; PPP; Precio Venta; Precio Costo; default FIFO) |
| PRM-STK-002 | `stk.costing.serializedSpecificCost` | bool | T | `true` | Serializados valorizados por costo de su serie. | V2 #2416 |
| PRM-STK-003 | `stk.defaults.warehouse.stock` | ref `warehouses` | T / sucursal / U | — | Depósito por defecto de stock. | V2 #161 |
| PRM-STK-004 | `stk.defaults.warehouse.sales` | ref `warehouses` | T / sucursal / U | — | Depósito por defecto de ventas. | V2 #164 |
| PRM-STK-005 | `stk.negative.transfer` | enum `block`/`warn`/`allow` | T / D | `block` | Stock negativo en transferencias. | V2 #373 |
| PRM-STK-006 | `stk.negative.byOperation` | map operación → `block`/`warn`/`allow` | T / D | todo `block` | Stock negativo en vales, consumos, ventas, fabricación. | V2 #2525 (vales) |
| PRM-STK-007 | `stk.serials.requireReceiptDocument` | bool | T | `false` | Exigir documento de recepción (remito) al registrar dispositivos/series. | V2 #221 |
| PRM-STK-008 | `stk.minimum.warnOnBreach` | bool | T | `true` | Advertir si la operación deja el saldo bajo mínimo. | V2 #2565 |
| PRM-STK-009 | `stk.vouchers.requireProject` | bool | T | `false` | Exigir obra en vales. | V2 #2419 |
| PRM-STK-010 | `stk.vouchers.externalDefaultProject` | ref obra (M10) | T | — | Obra por defecto para vales de integración. | V2 #2609 |
| PRM-STK-011 | `stk.vouchers.allowImportFromQuote` | bool | T | `false` | Importar productos de presupuestos en vales. | (RN-08 §12.4 P2899) |
| PRM-STK-012 | `stk.period.closedUntil` | fecha (derivada del período `stk` de T04/M15) | T | — | Cierre de stock. | V2 #432 |
| PRM-STK-013 | `stk.vouchers.requireQuoteProject` | bool | T | `false` | Validar que el presupuesto tenga obra asignada. | (RN-08 §12.4 P2914) |
| PRM-STK-014 | `stk.delivery.requireAcceptance` | bool | T / S | `true` | Entregas a cuadrilla requieren aceptación del receptor. | — (nuevo; `MOV_PRO_EXTRAS`) |
| PRM-STK-015 | `stk.field.fallbackSourceWarehouse` | enum `none`/`crewWarehouse`/`branchWarehouse` | T | `none` | Si el material no está en la custodia del técnico, de dónde se toma (siempre registrado). | — |
| PRM-STK-016 | `stk.field.substitutionRequiresValidation` | bool | T / S | `true` | Validación de sustituciones fuera de custodia. | — |
| PRM-STK-017 | `stk.compatibility.enforce` | bool | S | `true` | Validar compatibilidad modelo–tecnología. | — |
| PRM-STK-018 | `stk.reservations.expiryDays` | int | T / S | 15 | Días sin ejecución para vencer una reserva. | — |
| PRM-STK-019 | `stk.documents.allowedDestinations` | map tipo → destinos | T | ver 7.10 | Destinos admitidos por tipo de documento. | — |
| PRM-STK-020 | `stk.labels.askOnReceipt` | bool | T | `false` | Preguntar si imprimir etiquetas al ingresar. | V2 #3071 |
| PRM-STK-021 | `stk.items.uniqueRegistrationNumber` | bool | T | `false` | Matrícula única. | (RN-08 §12.4 P3049) |
| PRM-STK-022 | `stk.revaluation.indexSource` | ref índice T04 | T / R | — | Índice por defecto si el rubro no define uno. | — |
| PRM-STK-023 | `stk.revaluation.autoOnCostUpdate.projectId` | ref obra | T | — | Obra por defecto para revaluar automáticamente al costo (requiere PRM-STK-024). | V2 #3041 |
| PRM-STK-024 | `stk.revaluation.autoOnCostUpdate.responsibleId` | ref responsable | T | — | Responsable por defecto para revaluación automática (requiere PRM-STK-023). | V2 #3042 |
| PRM-STK-025 | `stk.loanForUse.accountingTreatment` | enum `inventoryOnLoan`/`fixedAsset`/`expenseOnApplication` | T / artículo | `inventoryOnLoan` | Tratamiento contable del comodato (PA-STK-09); reemplaza "mostrar asiento de productos en comodato". | V2 #2734 |
| PRM-STK-026 | `stk.returns.daysToReturn` | int | S | 30 | Plazo de devolución tras baja. | — |
| PRM-STK-027 | `stk.returns.chargePolicy` | enum `none`/`proposeReplacementCost`/`proposeFixedAmount` + importe | S / artículo | `proposeReplacementCost` | Propuesta de cargo por no devolución (PA-STK-05). | — |
| PRM-STK-028 | `stk.adjustments.approvalQtyThreshold` | Decimal | T / D | 0 (toda diferencia aprueba) | Umbral de cantidad. | — |
| PRM-STK-029 | `stk.adjustments.approvalAmountThreshold` | Decimal (ARS) | T | 0 | Umbral de importe. | — |
| PRM-STK-030 | `stk.crewSettlement.frequency` + `tolerance` | enum (`weekly`/`biweekly`/`monthly`/`manual`) + Decimal | T / S | `weekly` / 0 | Frecuencia y tolerancia de rendición (PA-STK-04). | — |
| PRM-STK-031 | `stk.physicalCount.mode` | enum `freezeScope`/`cutoffWithMovements` | T | `cutoffWithMovements` | PA-STK-07. | — |
| PRM-STK-032 | `stk.reorder.formula` | enum `toMax`/`reorderQty` + `roundToPack` bool | T | `toMax`, `true` | Fórmula de sugerencia. | — |
| PRM-STK-033 | `stk.fixedAssets.proposeFromReceipt` | bool | T | `true` | Proponer bien de uso desde recepción. | — |
| PRM-STK-034 | `stk.depreciation.frequency` | enum `monthly`/`annual` | T | `monthly` | Frecuencia de corrida. | — |
| PRM-STK-035 | `stk.depreciation.dailyProration` | bool | T | `true` | Prorrateo por días en meses parciales. | — |
| PRM-STK-036 | `stk.fixedAssets.useHistoricalValues` | bool | T | `false` | Usar valores históricos para amortización e inflación. | V2 #3076 |
| PRM-STK-037 | `stk.fixedAssets.separateRevaluationAccounts` | bool | T | `false` | Separar cuentas de revalúo. | V2 #2936 |
| PRM-STK-038 | `stk.rma.notifyOnStatus` | map estado → plantilla T09 | T | — | Notificaciones por estado. | — (`clsRMA`) |
| PRM-STK-039 | `stk.fixedAssets.closedUntil` | fecha (período `stkFixedAssets`) | T | — | Cierre de bienes de uso. | V2 #2778 |
| PRM-STK-040 | `stk.manufacturing.consumeOnLaunch` | bool | T | `false` | Mover stock al lanzar el parte. | V2 #3003 |
| PRM-STK-041 | `stk.defaults.warehouse.production` | ref | T / U | — | Depósito por defecto de producción. | V2 #165 |
| PRM-STK-042 | `stk.defaults.warehouse.components` | ref | T / U | — | Depósito por defecto de componentes. | V2 #166 |
| PRM-STK-043 | `stk.manufacturing.lastRequirementDate` | fecha (solo lectura; derivada de `mrpRuns`) | T | — | Última fecha de requerimiento. | V2 #168 |
| PRM-STK-044 | `stk.inspections.blockIfExpired` | bool | T / artículo | `false` | Bloquear uso con ensayo vencido. | — |
| PRM-STK-045 | `stk.lots.blockExpired` | bool | T / tipo de lote | `true` | Bloquear lotes vencidos. | — |
| PRM-STK-046 | `stk.manufacturing.laborItemId` | ref artículo | T | — | Producto usado para el costo de mano de obra. | V2 #3015 |
| PRM-STK-047 | `stk.manufacturing.genericDamagedOrderId` | ref orden | T | — | Orden genérica para productos dañados. | V2 #3040 |
| PRM-STK-048 | `stk.manufacturing.defaultReportResponsibleId` | ref responsable | T | — | Responsable por defecto del parte. | V2 #3057 |
| PRM-STK-049 | `stk.manufacturing.disallowManualFinish` | bool | T | `false` | No permitir finalizar órdenes manualmente. | V2 #3171 |
| PRM-STK-050 | `stk.field.deliveryMode` | enum `rollingStock`/`perWorkOrderSerial` | S | `rollingStock` | Modo de entrega de equipos (PA-STK-03). | — |
| PRM-STK-051 | `stk.field.consumptionValidation` | enum `none`/`supervisorBeforeCosting` | T / S | `none` | Validación del consumo declarado (PA-STK-02). | — |
| PRM-STK-052 | `stk.workOrders.laborConceptRef` | ref | T | — | Concepto de horas hombre en OT (lo administra M10; STK lo usa en el costo de OT). | (RN-08 §12.4 P460) |
| PRM-STK-053 | `stk.manufacturing.serialFormat` | plantilla | T | `{report:7}{order:6}{set:2}{registration:11}{seq:4}` | Formato de serie de productos fabricados. | — (`GetLista_NrosSerie_Item`) |
| PRM-STK-054 | `stk.warranty.defaultSupplierMonths` | int | T / artículo | 12 | Garantía de proveedor por defecto. | — |
| PRM-STK-055 | `stk.quantities.decimalsByUom` | map | T | unidades enteras 0, metros 2, kg 3 | Decimales de cantidad. | — |
| PRM-STK-056 | `stk.portal.showEquipment` | bool | T / S | `true` | Mostrar equipos al socio. | — |
| PRM-STK-057 | `stk.customerOwnedDevices.register` | bool | S | `true` | Registrar equipos propiedad del socio (PA-STK-08). | — |
| PRM-STK-058 | `stk.services.noCommercialStock` | bool | S | `false` | Servicio sin stock comercial (RF-STK-132). Es un parámetro por servicio, no un servicio interno: lo consultan M02 (catálogo) y M11 al vender (PA-STK-11). | — |
| PRM-STK-059 | `stk.retrieval.requireReview` | bool | T | `true` | Equipos retirados pasan siempre por revisión. | — |
| PRM-STK-060 | `stk.housing.voucherDocTypes` | ref tipos | T | — | Comprobante de retiro de materiales de viviendas / obra por defecto para vales de vivienda (lo usa M18; contabilidad en M15). | (RN-08 §12.3 P755, P2670) |

Parámetros ProCoop relacionados que **no** son de STK y se registran en otro anexo: P2162 y P2982 (cuenta y asiento de remitos pendientes → M15/M12), P583 (factura independiente de remitos → M12, ver CTR-STK-03), P264 (no actualizar precio de compra → M12), P2548, P2166/P2167, P2722/P2723 (asientos de OT/OM y horas → M15/M10), P2150–P2156 y P3141 (cuentas de stock y productos en proceso → M15), P2139 (cuenta de ajuste por inflación → M15), P2953/P3032 (flete/molde en presupuestos → M11), P500 (cierre de compras → M12).

## 15. Reportes, indicadores y exportaciones

Cada informe declara universo, fecha de corte y fórmula (AGR-022); exporta XLSX/CSV/PDF y puede programarse.

| Clave | Informe | Universo | Corte | Fórmula / contenido | Ola |
|---|---|---|---|---|---|
| `stock-on-hand` | Existencias | Artículos con stock propio | Fecha y hora | Σ cantidades por estado y custodia; disponible = disponible − reservado. | O3 |
| `stock-by-custody` | Existencias por custodia | Depósitos, cuadrillas, técnicos, domicilios, proveedores | Fecha | Cantidad y valor por tipo de custodia. | O3 |
| `kardex` | Kárdex | Artículo × depósito | Rango | Saldo inicial + entradas − salidas = saldo final, con costo. | O3 |
| `serial-trajectory` | Trayectoria de series | Unidades | Rango | Eventos de 7.14. | O3 |
| `customer-equipment` | Equipos en domicilios | Asignaciones activas | Fecha | Por servicio, modelo, modalidad, zona; antigüedad. | O3 |
| `pending-returns` | Equipos pendientes de devolución | Asignaciones `pendingReturn`/`chargeProposed` | Fecha | Días vencidos; valor de reposición. | O3 |
| `crew-custody` | Saldo por cuadrilla | Depósitos de cuadrilla/técnico | Fecha | Por artículo/serie con antigüedad. | O3 |
| `wo-materials` | Materiales por OT/OM | OT/OM | Rango | Reservado, entregado, consumido, devuelto; costo. | O3 |
| `wo-cost` | Costo de OT/OM | OT/OM cerradas | Rango | Materiales + horas (M10). | O8 |
| `consumption-by-destination` | Consumos por destino | Movimientos de consumo | Rango | Por OT, obra, servicio, centro, unidad de gasto. | O8 |
| `stock-by-service` | Stock y consumo por servicio | Artículos con servicio | Fecha / rango | Existencia y consumo por servicio; Σ servicios = total (escenarios 79–80). | O8 |
| `valuation` | Valorización | Artículos con stock | Fecha | Método perpetuo y alternativos; negativos aparte. | O8 |
| `valuation-reconciliation` | Conciliación stock–contabilidad | Existencias valorizadas | Cierre | Valor por custodia vs saldos contables (M15). | O8 |
| `below-minimum` | Bajo mínimo y sugerencias | Artículos con niveles | Fecha | RN-STK-043. | O8 |
| `replacement-cost` | Costo de reposición | Artículos | Fecha | (`CAN_REP` − stock) × costo × bultos. | O8 |
| `adjustments` | Ajustes y diferencias | Documentos de ajuste/inventario | Rango | Por motivo, depósito, responsable; importe. | O8 |
| `physical-count` | Resultado de inventario | Inventario | Cierre | Esperado, contado, diferencias, series faltantes. | O8 |
| `pending-delivery` | Facturado no entregado | Ítems de venta con pendiente | Fecha | Σ cantidades pendientes. | O8 |
| `consignment` | Consignaciones | Salidas en consignación | Fecha | Unidades fuera sin facturar. | O8 |
| `lots-expiry` | Lotes por vencer | Lotes con stock | Fecha | Días a vencimiento. | O8 |
| `revaluations` | Revaluaciones | Documentos | Rango | Factores y diferencias. | O8 |
| `fixed-assets-schedule` | Cuadro de bienes de uso | Bienes por rubro | Ejercicio | Origen + mejoras − disminuciones (`Get_Cuadro_BienUso`). | O8 |
| `depreciation-schedule` | Cuadro de amortizaciones | Bienes | Ejercicio | Apertura, ejercicio, cierre; histórico/ajustado (`Get_Cuadro_Amortizacion`). | O8 |
| `fixed-assets-by-cost-center` | Bienes y amortización por centro | Bienes | Período | Distribución CTSEC. | O8 |
| `rma-status` | RMA por estado y proveedor | Casos | Fecha | Tiempos, tasa en garantía, resolución. | O8 |
| `equipment-failure-rate` | Tasa de falla por modelo | Unidades aplicadas | Rango | RMA y cambios / unidades instaladas. | O8 |
| `service-receptions` | Recepciones técnicas | Recepciones | Rango | Por estado. | O8 |
| `mfg-pending-supplies` | Insumos pendientes de utilizar | Órdenes lanzadas | Fecha | Requerido − consumido. | O10 |
| `mfg-registrations` | Matrículas generadas | Partes finalizados | Rango | Series de fabricados. | O10 |
| `mfg-orders` | Órdenes de fabricación | Órdenes | Rango | Estado, avance, plazos. | O10 |
| `mfg-damaged` | Productos dañados | Partes | Rango | Por tipo de daño. | O10 |
| `mfg-components-grouped` | Componentes agrupados | Órdenes/partes | Rango | Σ componentes por artículo. | O10 |

**Indicadores certificados para tableros (T10):** existencias valorizadas totales y por custodia; equipos en comodato activos por servicio; equipos pendientes de devolución y valor; rotación (consumo del período / existencia promedio); días de cobertura (disponible / consumo diario promedio); exactitud de inventario (1 − |diferencias| / contado); tasa de falla por modelo; diferencias de rendición por cuadrilla; tiempo promedio de RMA.

## 16. Casos de uso

| CU-ID | Nombre | Actor | Flujo resumido | Resultado esperado | Excepción / control | Origen |
|---|---|---|---|---|---|---|
| CU-20 | Reserva, entrega, consumo y devolución de conectores | Encargado de depósito, técnico | DEP-01 tiene 20 conectores MAT-CON-01; OT-001 requiere 4: reservar 4 (16 disponibles), entregar 4 a la cuadrilla, registrar 3 consumidos en la OT y 1 devuelto. | 17 en depósito, 3 consumidos en la OT, saldo 0 en cuadrilla. | Faltante físico ⇒ ajuste autorizado con evidencia; no se modifica la existencia sin movimiento. | BASE §20 |
| CU-07 | Reemplazo de medidor | Encargado técnico | Retirar MED-001 con lectura final 1.270 m³ (M03), instalar MED-002 con lectura inicial 0 y fecha efectiva; STK mueve custodia y estados. | Trayectoria de ambos conservada; sin superposición. | MED-002 ya instalado en otro suministro ⇒ bloqueo hasta resolver. | BASE §7. Definición dueña: M03 «CU-07 — Reemplazo de medidor»; aquí solo el tramo de stock (custodia y estados del medidor). |
| CU-INS-01 | Instalación de Internet con módem en comodato | Técnico EMP-INS-001 | MOD-DEMO-001 asignado al instalador; En camino; instala, prueba, registra serie, conformidad de Ana; aplicación vinculada al contrato INT-100 el 10/11/2026. | Equipo en domicilio de Ana, en comodato, custodia actualizada; un único movimiento. | Sincronización repetida no duplica aplicación ni salida; equipo distinto del reservado ⇒ sustitución validada. | BASE §73. Definición dueña: M10 «CU-INS-01 (BASE §73, parte técnica)»; aquí solo el tramo de stock (aplicación y custodia del equipo). |
| CU-OPE-01 | Compra de módems por servicio | Compras, depósito, técnico | OC-DEMO-002: 2 módems a ARS 20.000; se reciben con series; uno se entrega e instala, el otro queda disponible. | Existencia nunca reducida dos veces; compras, stock y consumo analizables por servicio Internet. | El costo del módem no se convierte automáticamente en cargo al socio. | BASE §78. Definición dueña: M12 «CU-OPE-01 — Compra de módems por servicio»; aquí solo el tramo de stock. |
| CU-STK-01 | Entrega de stock rodante a cuadrilla | Encargado de depósito | Entrega 10 ONU y 300 m de cable drop a CUA-01; técnico acepta con firma en la app. | DEP-01 −10/−300; CUA-01 +10/+300; total sin cambio. | Sin aceptación, queda en tránsito y no disponible para el técnico. | BASE §20, §73 |
| CU-STK-02 | Instalación sin conexión y sincronización tardía | Técnico | Sin señal aplica ONU y consume 25 m de drop; al volver la red sincroniza dos veces por un reintento. | Una aplicación y un consumo. | La OT fue cancelada mientras tanto ⇒ conflicto en bandeja, evidencia conservada. | AGR-025, CNX §3.7 |
| CU-STK-03 | Visita fallida | Técnico | Domicilio cerrado; registra resultado fallido. | Sin aplicación; ONU sigue en custodia; reserva mantenida para la reprogramación. | No se inicia abono (M05). | BASE §73 |
| CU-STK-04 | Cambio de ONU por falla | Técnico, revisión, RMA | OT de cambio: retira ONU A (dañada), aplica ONU B; A pasa a revisión y a RMA con el proveedor en garantía. | Contrato con B activa; M10 reaprovisiona con MAC de B; A con historia y RMA. | B no compatible con la red ⇒ rechazo. | BASE §7; MER-020 |
| CU-STK-05 | Baja de Internet y retiro del equipo | Atención, técnico | Baja confirmada; asignación pendiente de devolución 30 días; OT de retiro recupera la ONU sin fuente. | Asignación `returnedIncomplete`; faltante de fuente registrado. | A los 30 días sin retiro ⇒ propuesta de cargo para aprobación. | BASE §86; PA-STK-05 |
| CU-STK-06 | Devolución en mostrador | Cajero/atención | El socio trae el router; se escanea, se registra condición y se emite constancia. | Asignación cerrada; equipo a revisión en la sucursal. | Serie no corresponde al contrato ⇒ se registra como hallazgo para análisis. | BASE §73 |
| CU-STK-07 | Rendición semanal de cuadrilla | Supervisor | Cuenta en la app: esperado 8 ONU, contado 7. | Faltante de 1 serie identificada, ajuste aprobado con evidencia; rendición cerrada. | Sin aprobación no se cierra. | BASE §20 |
| CU-STK-08 | Inventario físico anual | Encargado, contadores | Instantánea, conteo ciego por ubicaciones, diferencias, ajuste. | Exactitud calculada y ajuste contabilizado. | Movimientos durante el conteo considerados según PA-STK-07. | BASE §20 |
| CU-STK-09 | Sugerencia de compra por mínimo | Compras | Conectores: mín 100, máx 500, disponible 80, OC pendiente 100; bulto 100. | Sugerencia 400 convertida en requisición de M12. | No se crea OC directa. | DFA M17; AGR-027 |
| CU-STK-10 | Diferencia de precio de factura | Compras, costos | Recepción 10 a ARS 100; factura a ARS 110; 4 ya consumidas. | Ajuste de valor ARS 60 en existencia y ARS 40 a costo de consumo. | No se reescriben movimientos históricos. | RN-08 §7.6, §8.4 |
| CU-STK-11 | Revaluación por índice | Responsable de costos | Índice octubre 1,10 / julio 1,00 sobre existencia de julio. | Movimiento de valor +10 %. | Falta índice ⇒ abortar con mensaje. | RN-08 §15.4 |
| CU-STK-12 | Alta y amortización de una OLT | Responsable de bienes de uso | Recepción de OLT marcada bien de uso ARS 1.200.000; borrador confirmado; afectación 16/03/2026; vida 5 años. | Marzo ARS 10.322,58; abril ARS 20.000; evento a M15. | Reversión de corrida restaura acumulados. | RN-08 §9 |
| CU-STK-13 | Baja de un vehículo | Responsable de bienes de uso | Venta con recupero ARS 3.000.000; residual ARS 2.500.000. | Resultado +ARS 500.000; bien `disposed`. | Período cerrado ⇒ rechazo. | RN-08 §9 |
| CU-STK-14 | RMA con reemplazo del proveedor | Responsable RMA | ONU en garantía enviada; proveedor entrega otra serie. | Nueva unidad enlazada; original "baja en proveedor". | Fuera de garantía ⇒ reparación con costo o descarte. | MER-020 |
| CU-STK-15 | Recepción técnica de equipo de cliente | Servicio técnico | El socio deja un router propio para configurar. | Recepción con estados por ítem; no suma al stock propio. | — | CAT `RECEPCIONES` |
| CU-STK-16 | Orden de fabricación de pilares de medición | Jefe de planta | BOM de pilar (caño, caja, tablero); orden de 20; MRP genera requisición de faltantes; partes; finaliza. | 20 pilares en depósito de producción con costo; componentes consumidos una vez. | Producto dañado ⇒ destrucción o reasignación. | RN-08 §10 |
| CU-STK-17 | Consumo a unidad de gasto | Encargado de depósito | Vale de salida de 5 lámparas a "Mantenimiento edificio". | Consumo imputado al centro de costo de la unidad de gasto. | Sin destino ⇒ rechazo. | CAT `UNIDADES_GASTOS` |
| CU-STK-18 | Copia de servicio Internet a otro tenant | Administrador de plataforma | Copiar configuración de Internet de TEN-001 a TEN-002. | No se copian stock, series ni asignaciones; depósito por defecto queda a mapear. | — | BASE §81 |
| CU-STK-19 | Socio consulta su equipo | Socio | Abre la app y ve la ONU instalada con su constancia. | Solo ve equipos de sus contratos. | Acceso a contrato ajeno ⇒ 404. | BASE §25 |
| CU-STK-20 | Cierre mensual de stock | Responsable de costos | Checklist sin pendientes; cierra octubre. | Período cerrado; movimientos con fecha ≤ 31/10 rechazados. | Reapertura auditada. | RN-08 §1.1 |

## 17. Criterios de aceptación y escenarios de prueba

Formato: dado / cuando / entonces. Los datos son los de la sección 18.

### 17.1 Existencias y movimientos

| ESC-ID | Escenario | Criterio | Cubre |
|---|---|---|---|
| ESC-STK-01 | Entrega a cuadrilla no es consumo | Dado DEP-01 con 20 MAT-CON-01, cuando se entregan 4 a CUA-01 y se acepta, entonces DEP-01 = 16, CUA-01 = 4, existencia total = 20 y no hay evento `stk.materials.consumed` (EVT-STK-02). | RF de entrega; RN-STK-012, RN-STK-013 |
| ESC-STK-02 | CU-20 completo | Dado el ESC-STK-01, cuando la OT-001 consume 3 y se devuelve 1, entonces DEP-01 = 17, CUA-01 = 0, consumo de OT-001 = 3 valorizado y la reserva de 4 queda cerrada. | CU-20 |
| ESC-STK-03 | Sin doble descuento (BASE §73) | Dado MOD-DEMO-001 en custodia de EMP-INS-001, cuando la OT de instalación registra la aplicación, entonces existe exactamente un movimiento de salida de la custodia del técnico y ninguno sobre DEP-01. | RN-STK-014 |
| ESC-STK-04 | Stock negativo bloqueado | Dado PRM-STK-005 = `block` y DEP-01 con 2 unidades, cuando se transfieren 3, entonces 422 `problem+json` con código `stk.insufficientStock` y ningún movimiento. | RN-STK-009 |
| ESC-STK-05 | Serializado en dos lugares | Cuando se intenta ingresar una serie ya disponible en DEP-01, entonces error; el índice único de ubicación vigente impide la duplicación incluso con dos solicitudes simultáneas. | RN-STK-008, RN-STK-020, RN-STK-021 |
| ESC-STK-06 | Anulación con contramovimiento | Cuando se anula un vale confirmado, entonces se crea el documento inverso enlazado, los saldos vuelven al estado previo y el original queda `voided`, sin borrado. | RN-STK-006, RN-STK-007 |
| ESC-STK-07 | Período cerrado | Dado el período de stock cerrado al 31/10/2026, cuando se registra un movimiento con fecha 30/10/2026, entonces se rechaza; con fecha 01/11/2026, se acepta. | RN-STK-011 |
| ESC-STK-08 | Kit | Cuando se entrega 1 kit "Instalación FTTH" (1 ONU, 1 roseta, 30 m drop), entonces se mueven los componentes y el kit no tiene saldo. | RN-STK-002 |
| ESC-STK-09 | Saldos materializados verificados | Dado un saldo alterado manualmente en la base de pruebas, cuando corre JOB-STK-01, entonces se detecta la diferencia y se crea una alerta sin corregir en silencio. | RN-STK-005 |

### 17.2 Campo offline, reservas y comodato

| ESC-ID | Escenario | Criterio | Cubre |
|---|---|---|---|
| ESC-STK-10 | Reintento idempotente | Cuando el mismo `clientMutationId` se envía dos veces a `/field/sync`, entonces la segunda respuesta devuelve el resultado original y no hay segundo movimiento. | RN-STK-015; AGR-016 |
| ESC-STK-11 | Resultado por ítem | Dado un lote de 5 mutaciones donde la 3.ª referencia una serie inexistente, entonces 4 se aplican, la 3.ª devuelve error y el lote no se revierte. | CNX §3.7 |
| ESC-STK-12 (ESC-03) | Conflicto offline | Dada una OT cancelada en admin mientras el técnico instala sin conexión, cuando sincroniza, entonces la salida de custodia se registra (hecho físico), se abre conflicto en M10 sin efectos contractuales y la resolución `acceptServer` genera la OT de retiro; nunca hay doble salida. | AGR-025; M10 |
| ESC-STK-13 | Sustitución de serie | Dada la reserva de ONU-A, cuando se aplica ONU-B en custodia del técnico, entonces ONU-A se libera y ONU-B queda aplicada; si ONU-B no estaba en su custodia, queda pendiente de validación. | RN-STK-017 |
| ESC-STK-14 | Reserva concurrente | Con 1 unidad disponible y dos reservas simultáneas, entonces una se confirma y la otra recibe 409 `stk.versionConflict`. | RN-STK-025 |
| ESC-STK-15 | Vencimiento de reserva | Dada una reserva sin ejecución por 15 días y OT no agendada, cuando corre JOB-STK-03, entonces se libera y se notifica al supervisor. | RN-STK-024 |
| ESC-STK-16 | Comodato no es consumo | Cuando se aplica MOD-DEMO-001 en comodato al contrato INT-100, entonces sigue en la existencia valorizada con custodia "domicilio del socio" y no se emite costo de mercadería vendida. | RN-STK-035 |
| ESC-STK-17 | Baja sin retiro | Dada la baja de INT-100, cuando pasan 30 días sin retiro, entonces la asignación pasa a `chargeProposed` con importe de reposición y requiere aprobación; no se emite comprobante sin aprobación. | RN-STK-037, RN-STK-038 |
| ESC-STK-18 | Equipo retirado a revisión | Cuando se retira la ONU, entonces queda `pendingReview` y no aparece como disponible hasta la decisión. | RN-STK-039 |
| ESC-STK-19 | Compatibilidad | Dado PRM-STK-017 activo, cuando se reserva un módem ADSL para un contrato FTTH, entonces se rechaza. | RN-STK-019 |

### 17.3 Valorización, ajustes y compras

| ESC-ID | Escenario | Criterio | Cubre |
|---|---|---|---|
| ESC-STK-20 | PPP móvil | Dado 10 u. a ARS 100, cuando ingresan 10 u. a ARS 120, entonces costo promedio ARS 110; una salida de 5 se valoriza en ARS 550. | RN-STK-028 |
| ESC-STK-21 | Diferencia de factura | CU-STK-10: ajuste de valor ARS 60 a existencia y ARS 40 a costo de consumo; ningún movimiento histórico cambia. | RN-STK-030 |
| ESC-STK-22 | Ajuste con umbral | Dado umbral de importe ARS 50.000, un ajuste de ARS 30.000 se aplica sin aprobación; uno de ARS 80.000 queda pendiente y no afecta saldos. | RN-STK-040 |
| ESC-STK-23 | Rendición | CU-STK-07: no se puede cerrar con diferencia pendiente; tras aprobar el ajuste, se cierra. | RN-STK-041 |
| ESC-STK-24 | Sugerencia a requisición | CU-STK-09: la sugerencia de 400 crea una requisición en M12 y ninguna OC. | RN-STK-043, RN-STK-044 |
| ESC-STK-25 | Factura sin recepción | Una factura de bienes sin recepción física no modifica existencias. | RN-STK-045 |
| ESC-STK-26 | Conciliación contable | Al cierre, el informe `valuation-reconciliation` muestra igualdad entre existencia valorizada por custodia y saldos de las cuentas de stock en M15; toda diferencia se lista con el evento que la explica. | RF-STK-135; M15 |
| ESC-STK-27 | Stock por servicio | Dado OC-DEMO-002 por 2 módems para Internet, Σ consumo por servicio = consumo total y el módem disponible sigue asignado a Internet (escenarios 79–80). | RF-STK-131 |

### 17.4 Bienes de uso, RMA y fabricación

| ESC-ID | Escenario | Criterio | Cubre |
|---|---|---|---|
| ESC-STK-28 | Amortización con prorrateo | CU-STK-12: marzo ARS 10.322,58; abril ARS 20.000; acumulado nunca supera el amortizable. | RN-STK-048, RN-STK-049 |
| ESC-STK-29 | Reversión de corrida masiva | Cuando se revierte la corrida de abril, los acumulados vuelven al valor de marzo (corrige defecto ProCoop). | RN-STK-051 |
| ESC-STK-30 | Baja con resultado | CU-STK-13: resultado +ARS 500.000 enviado como evento a M15. | RF de bajas |
| ESC-STK-31 | RMA bloquea la unidad | Cuando se abre RMA de ONU-A, no se puede reservar ni aplicar; el reemplazo crea ONU-C enlazada. | RN-STK-054, RN-STK-056 |
| ESC-STK-32 | Recepción técnica fuera de stock | Un router de cliente en recepción no aparece en existencias ni en valorización. | RN-STK-057 |
| ESC-STK-33 | Fabricación | CU-STK-16: Σ costo de componentes + mano de obra + fijo = costo de los 20 pilares; componentes consumidos una sola vez aunque el parte se haya lanzado con PRM-STK-040 activo. | RF-STK-121, RF-STK-122, RF-STK-125 |
| ESC-STK-34 | Anulación de orden con partes | Anular una orden lanzada con partes no reasignados devuelve error explícito. | RN-STK-059 |

### 17.5 Permisos, aislamiento, reintentos y rendimiento

| ESC-ID | Escenario | Criterio |
|---|---|---|
| ESC-STK-35 | Permiso negativo | Un técnico sin `stk.adjustment.approve` recibe 403 al aprobar un ajuste, aunque llame a la API directamente. |
| ESC-STK-36 | Alcance de depósito | Un encargado con alcance DEP-01 no ve ni mueve existencias de DEP-02 (lista vacía, 404 por ID). |
| ESC-STK-37 | Técnico ve solo su custodia | `GET /field/my-stock` devuelve solo la custodia del técnico autenticado y de su cuadrilla. |
| ESC-STK-38 | Aislamiento de tenant | Un usuario de TEN-002 que consulta una serie de TEN-001 recibe 404; las series se validan como únicas por tenant (la misma MAC puede existir en dos tenants). |
| ESC-STK-39 | Socio | El socio solo ve equipos de sus contratos (CU-STK-19). |
| ESC-STK-40 | Reintento de evento | Si M15 no está disponible, el evento queda en el outbox y se reintenta; al recuperarse se procesa una sola vez (idempotencia por `eventId`). |
| ESC-STK-41 (ESC-04) | Integración incierta | Si la API externa de vales cae tras recibir la solicitud, el reintento con la misma `Idempotency-Key` devuelve el resultado original sin duplicar el vale. |
| ESC-STK-42 | Rendimiento | La consulta de existencias de un depósito con 5.000 artículos responde en menos de 2 s (p95); la sincronización de 200 mutaciones en menos de 10 s (T08). |
| ESC-STK-43 | Auditoría | Cada ajuste, anulación y cambio de parámetro muestra actor, fecha, antes/después y origen. |

ESC-01, ESC-02 y ESC-05 del maestro no dependen de este módulo; ESC-03 y ESC-04 están cubiertos por ESC-STK-12 y ESC-STK-41.

## 18. Datos de precarga de demostración (ficticios)

Tenant `TEN-001` "Cooperativa Demo". Todos los nombres, series y montos son ficticios.

| Entidad | Datos |
|---|---|
| Tipos de artículo | Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). |
| Clasificaciones / rubros | Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo. |
| Depósitos | DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción; COMP-01 componentes; `customerPremisesPool` domicilios de socios. |
| Ubicaciones | DEP-01: pasillos A–C, estantes 1–4 (por ejemplo `A-1-03`). |
| Artículos | MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada, ARS 35.000, comodato, compatible FTTH); MED-AGUA medidor 1/2" (serializado, ARS 48.000); MAT-CLORO-01 hipoclorito con lote y vencimiento; kit "Instalación FTTH". |
| Saldos | DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento 30/04/2027. |
| Compra | OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`. |
| Asignaciones | `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro de agua AG-200 hasta el reemplazo de CU-07. |
| OT | OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla. |
| Rendición | Rendición semanal de CUA-01 del 02/11/2026 (esperado 8 ONU, contado 7) para la demo de CU-STK-07. |
| Unidades de gasto | "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". |
| Bienes de uso | BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %. |
| RMA | RMA-0001: `ONU-DEMO-005` en garantía, proveedor "Redes del Sur SA", estado `sentToSupplier`. |
| Fabricación | BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. |
| Usuarios | Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios). |

## 19. Migración desde ProCoop

Marco general en T07: extracción, staging por tenant, transformación, carga idempotente con `legacyId`, conciliación y corte. STK se migra con **saldos iniciales valorizados a la fecha de corte** más la trayectoria histórica de series; los movimientos históricos de cantidad se cargan solo como consulta (`legacyMovements`, solo lectura), no se re-procesan.

| Origen ProCoop | Colección destino | Transformación | Conciliación |
|---|---|---|---|
| `PROD_SER` (artículos con `LLE_STO`) | `inventoryItems` (+ vínculo `catalogProductId` en M02) | Faceta de inventario separada (CTR-STK-14); unidad, mínimo, máximo, reposición, bultos, trazable, ubicaciones, bien de uso, lote. | Cantidad de artículos con stock = origen. |
| `TIP_PROD`, `RUB_PYS`, `CLASIFICACION_ITEMS` | `itemTypes`, `itemClassifications`, `itemGroups` | Códigos a claves; rubro conserva índice y cuentas como referencias a M15. | Conteo por tipo/rubro. |
| `DEPAPROD` | `itemDepartments` | Directo. | Conteo. |
| `COMBOS` | `itemKits` | Componentes y cantidades. | Σ componentes por kit. |
| `DEPOSITO` | `warehouses` | Tipo inferido (central, sucursal, cuadrilla); los depósitos de cuadrilla se vinculan a M10. Los domicilios no se migran como depósitos: se usan `customerPremisesPool` + contrato. | Conteo por tipo. |
| `UBICACIONES`, `PROD_SER_UBICACION` | `warehouseLocations`, `itemLocationDefaults` | Directo. | Conteo. |
| `USERS_DEPOSITO`, `PRODPUES` | Alcance de IAM (T02) | Alcance por depósito del rol (CTR-STK-17); `PRODPUES` [VERIFICAR] contenido antes de migrar. | Usuarios con alcance = origen. |
| `MOV_PRO`, `MOV_PRO_EXTRAS`, `TRANSFER` | `stockBalances` (saldo inicial) + `legacyMovements` (consulta) | Saldo por artículo × depósito × ubicación a la fecha de corte; un documento de apertura por depósito; receptor de `MOV_PRO_EXTRAS` se conserva en la consulta. | Σ cantidades por artículo × depósito = Σ `MOV_PRO` firmado al corte. |
| Valorización ProCoop al corte | `itemCostStates`, `costLayers` | Costo unitario inicial según PA-STK-01 (PPP del informe de valorización al corte o capas PEPS). | Valor total = informe de valorización ProCoop ± diferencias documentadas; = saldo contable de M15. |
| `PROD_TRH`, `MOV_TRH` | `serialUnits`, `serialUnitEvents` | Una unidad por serie con estado derivado del último movimiento; trayectoria completa migrada como eventos. | Series en stock = trazables con saldo; ninguna serie en dos lugares (bloqueante). |
| `SERSOC_PRODUCTOS` | `contractEquipmentAssignments` de M02 (CTR-DAT-28; antes `equipmentAssignments`); M13 aporta `serialUnits` | Modalidad por defecto comodato salvo factura de venta vinculada (DEC-013); contrato mapeado desde M02. Las filas del banco ortopédico van a `orthopedicLoans` de M18 (T07 §19.1). | Equipos en domicilios por servicio = origen. |
| `TIPOLOTE` | `lotTypes`, `lots` | Lotes con saldo y vencimiento. | Σ por lote. |
| `RETI_MAT`, `IT_RETM` | `stockDocuments` históricos (solo lectura) | Destino OT/obra/unidad de gasto. | Conteo. |
| `UNIDADES_GASTOS` | `expenseUnits` | Centro de costo a mapear (PA-STK-06). | Conteo. |
| `RMA_PRODUCTOS`, `RMA_HISTORIAL` | `rmaCases` | Solo abiertos con historial completo; cerrados como históricos. | Abiertos = origen. |
| `RECEPCIONES`, `ESTADOS_RECEP`, `ITRE_PRO`, `ITRE_EST` | `serviceReceptions`, `receptionStatuses` | Abiertas con estado vigente. | Conteo por estado. |
| `BIENES_USO` | `fixedAssets` | Valor origen, mejoras, disminuciones, afectación, vida, % amortizable, residual. | Σ valor origen por rubro = cuadro de bienes de uso ProCoop. |
| `BIENES_USO_AMORT` | `fixedAssetDepreciations` + acumulados | Acumulados al corte; corridas históricas como consulta. | Amortización acumulada por rubro = cuadro ProCoop = M15. |
| `BIENES_USO_CTSEC` | `fixedAssets.costDistribution` | Validar suma 100 %. | Bienes con distribución inválida = 0. |
| `BIENES_USO_DISM` | `fixedAssetValueChanges` | Tipo disminución. | Σ disminuciones. |
| `BIENES_USO_HST` | `fixedAssetHistory` | Directo. | Conteo. |
| `PRODFAB`, `ORCOFAB`, `ORPRFAB` | `bomStructures`, `bomStructureVersions` | Versión 1 vigente. | Conteo de componentes. |
| `PRODFAB_DIVISIONES`, `HIS_PRODFAB`, `HIS_PRODFAB_DIVISIONES` | `productDivisions`, historial de versiones | Directo. | Conteo. |
| `ETAFAB` | `manufacturingStages` | Directo. | Conteo. |
| `ORDEFAB`, `ORDEFAB_EXT`, `ORDAFAB` | `manufacturingOrders` | Etapa numérica a enum (RN-STK-058). | Órdenes abiertas = origen. |
| `OF_PARTE_PRODUCCION`, `OF_PARTE_ITEM`, `OF_PARTE_COMPONENTE` | `productionReports` | Abiertos completos; finalizados como históricos. | Conteo. |
| Parámetros V2 de la sección 14 | `PRM-STK-*` | Mapeo según columna "Origen V2". | Lista de parámetros sin mapear = 0. |

Orden de carga: maestros → depósitos y ubicaciones → artículos → saldos y costos → series → asignaciones (requiere M01/M02 migrados) → bienes de uso → RMA y recepciones → fabricación. La migración de la piloto (O3) cubre artículos, depósitos, series y comodatos de Internet; el resto, en O11 o con su ola.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-STK-01 | RN-08 §8.4 (valorización a demanda que reescribe `PRE_MOV`) vs AGR-026 | ProCoop recalcula y sobrescribe precios de movimientos al valorizar; AGR-026 exige método aprobado y conciliación. | Costo perpetuo al registrar cada movimiento; los métodos alternativos son solo vistas; los históricos no se reescriben (RN-STK-028, RF-STK-089, RF-STK-091). | AGR prevalece sobre comportamiento ProCoop. |
| CTR-STK-02 | RN-08 §8.1 (stock = suma de `MOV_PRO`) vs T08 (rendimiento) | Sin saldos materializados las consultas de disponibilidad en campo no escalan. | Saldos materializados en la misma transacción + JOB-STK-01 de verificación (RN-STK-005, RF-STK-026). | DEC/T08 prevalecen; el libro sigue siendo la verdad. |
| CTR-STK-03 | RN-08 §7.6 y RN-09 (P583: la factura puede mover stock) vs AGR-027 | Doble vía de ingreso de stock. | Solo la recepción física confirmada mueve stock; la factura genera movimiento de valor (RN-STK-045, RN-STK-030). | AGR prevalece. |
| CTR-STK-04 | RN-08 §13.1 (cierre automático contable por rango) vs DEC-009 | Contabilización en lote sin marca de contabilizado. | Eventos económicos en línea vía outbox, deduplicados por `sourceDocumentId` (RF-STK-094, RN-STK-078). | DEC prevalece. |
| CTR-STK-05 | RN-08 §1.1 (P432 y P2778, fechas de cierre sueltas por módulo) vs T04/M15 | Cierres independientes y no auditados. | Períodos de módulo `stk` y `stkFixedAssets` unificados en T04/M15 con reapertura auditada (RN-STK-011, PRM-STK-012, PRM-STK-039). | Maestro/T04 prevalecen. |
| CTR-STK-06 | BASE §20 (CU-20 habla de "descontar" al entregar) vs BASE §73 ("no se descuenta nuevamente del depósito central") | Ambigüedad sobre si la entrega a cuadrilla es consumo. | La entrega es transferencia de custodia; el consumo ocurre solo desde la OT (RN-STK-012, RN-STK-014). | Dentro de BASE prevalece la regla específica (§73) sobre la redacción del caso. |
| CTR-STK-07 | RN-08 §13.9 (fabricación fuera del MVP) vs DEC-007 | La fuente sugiere excluir fabricación. | Fabricación en alcance, ola O10 (RF-STK-116 a RF-STK-129). | DEC prevalece. |
| CTR-STK-08 | RN-08 §15.4 (`EliminarMovimiento` borra) vs guía §5 (inmutabilidad) | Borrado físico de movimientos y bienes. | Anulación con contramovimiento o reversión (RN-STK-006, RN-STK-052). | Convenciones obligatorias prevalecen. |
| CTR-STK-09 | RN-08 §15.5 (`GenerarPedido` y aprovisionamiento generan OC) vs AGR-027 | El MRP y el stock mínimo saltean la autorización de compras. | Generan requisiciones en M12 (RN-STK-044, RF-STK-087, RF-STK-126). | AGR prevalece. |
| CTR-STK-10 | RN-08 §15.3 (eliminar un bien amortizado exige asientos manuales) vs DEC-009 | Correcciones contables manuales. | Reversión automática por evento (RF-STK-107, RN-STK-052). | DEC prevalece. |
| CTR-STK-11 | RN-08 §8.4 (revaluación por vales de cantidad) vs modelo de costo perpetuo | La revaluación altera cantidades artificialmente. | Movimiento de valor sin cantidad (RF-STK-092, RN-STK-033). | Mejora de diseño; sin conflicto de negocio. |
| CTR-STK-12 | BASE §91 (banco de sangre sin stock) vs BASE §78 (stock por servicio) | Servicios que no tienen inventario comercial. | Marca "sin stock comercial" por servicio; puede usar materiales internos (RF-STK-132, RN-STK-074, PRM-STK-058). | Ambas reglas BASE se cumplen. |
| CTR-STK-13 | BASE §7 (equipos) en M03 vs M13 | Doble dueño del medidor. | STK es dueño de la unidad física, su custodia y trayectoria; M03, de la instalación metrológica y las lecturas (CU-07). | Maestro (dueños de datos) prevalece. |
| CTR-STK-14 | CAT `PROD_SER` (tabla única de productos y servicios) vs M02 | Mezcla de catálogo comercial e inventario. | Faceta de inventario separada `inventoryItems`, vinculada por `catalogProductId` (RF-STK-001, RF-STK-002). | Maestro (dueños de datos) prevalece. |
| CTR-STK-15 | RN-08 §8.4 (PEPS por defecto en V2 #2341) vs AGR-026 / RN-08 §13.8 (PPP o PEPS por depósito) | Método y nivel de costeo no definidos. | Se decide en PA-STK-01; se asume PPP móvil por tenant con identificación específica para serializados. | Decisión del solicitante. |
| CTR-STK-16 | RN-08 §1.4 y §15.3 (permisos solo en pantalla) vs T02 | Seguridad evitable por API. | Capabilities validadas en servicio (RN-STK-072). | T02 prevalece. |
| CTR-STK-17 | RN-09 §3 (`USERS_DEPOSITO`) y CAT `PRODPUES` vs T02 | Alcance de datos por tablas propias del módulo. | Alcance `scope.warehouses` del rol en T02 (RF-STK-021); `PRODPUES` [VERIFICAR]. | T02 prevalece. |

## 21. Preguntas abiertas

### PA-STK-01 — Método de costeo
- **Pregunta:** ¿Qué método de costeo perpetuo y con qué alcance se valúan las existencias?
- **Contexto:** ProCoop usa PEPS por defecto (V2 #2341) y valoriza a demanda; RN-08 §13.8 y §14 duda 8 dejan abierto PPP o PEPS por depósito; AGR-026 exige método aprobado.
- **Opciones:**
  - A) PPP móvil por artículo a nivel tenant e identificación específica para serializados **(Recomendada)** — cálculo simple, transferencias sin efecto de costo, serializados con costo real.
  - B) PPP móvil por artículo y depósito — refleja costos por sucursal; las transferencias mueven costo y complican la conciliación.
  - C) PEPS por capas — continuidad con ProCoop; más cálculo y capas por depósito.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-051, RF-STK-089, PRM-STK-001; O3 (costo de ingreso) y O8 (valorización).

### PA-STK-02 — Validación del consumo de campo por el supervisor
- **Pregunta:** ¿El consumo declarado por el técnico necesita validación del supervisor antes de su efecto?
- **Contexto:** BASE §20 pide control de consumos; AGR-016 exige no bloquear la operación offline.
- **Opciones:**
  - A) Afecta stock al sincronizar y el supervisor revisa por excepción o en la rendición; el evento económico sale al sincronizar **(Recomendada)** — operación fluida y control en la rendición.
  - B) Afecta stock al sincronizar, pero el evento económico espera la validación — más control contable, costos de OT demorados.
  - C) Nada se afecta hasta validar — saldos de cuadrilla desactualizados.
- **Impacto si no se responde:** se asume A (PRM-STK-051 = `none`).
- **Bloquea:** RF-STK-069; O3.

### PA-STK-03 — Modo de entrega de equipos
- **Pregunta:** ¿Los equipos se entregan al técnico como stock rodante o asignados por serie a cada OT?
- **Contexto:** BASE §73 admite reserva de equipo y entrega al instalador sin fijar el modo.
- **Opciones:**
  - A) Ambos configurables por servicio; por defecto stock rodante con reserva por modelo y serie definida al aplicar **(Recomendada)** — menos viajes al depósito, trazabilidad completa al aplicar.
  - B) Siempre serie específica por OT — máximo control, más logística.
  - C) Solo stock rodante — más simple, sin reserva por serie.
- **Impacto si no se responde:** se asume A (PRM-STK-050 = `rollingStock`).
- **Bloquea:** RF-STK-057; O3.

### PA-STK-04 — Diferencias de rendición y responsabilidad
- **Pregunta:** ¿Cómo se tratan los faltantes en la rendición de cuadrilla?
- **Contexto:** CU-20 exige ajuste autorizado con evidencia; no define si se carga al empleado.
- **Opciones:**
  - A) Ajuste aprobado clasificado imputable/no imputable; sin cargo automático; cargo al empleado vía M16 opcional por tenant **(Recomendada)** — control sin conflictos laborales automáticos.
  - B) Cargo automático al empleado por todo faltante — riesgo legal y gremial.
  - C) Solo ajuste, sin clasificación — se pierde análisis de responsabilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-066, PRM-STK-030; O3.

### PA-STK-05 — Equipo no devuelto
- **Pregunta:** ¿Qué pasa cuando el socio no devuelve el equipo tras la baja?
- **Contexto:** BASE §74 lo deja pendiente; BASE §78 prohíbe convertir automáticamente el costo en cargo.
- **Opciones:**
  - A) Plazo configurable (30 días) y propuesta de cargo al costo de reposición, con aprobación y facturación por M05 **(Recomendada)** — recupera valor con control.
  - B) Importe fijo por modelo, también con aprobación — más previsible para el socio.
  - C) No cobrar; solo marcar no recuperado — pérdida de activos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-078, PRM-STK-026, PRM-STK-027; O6.

### PA-STK-06 — Unidades de gasto
- **Pregunta:** ¿Las unidades de gasto se mantienen como catálogo propio?
- **Contexto:** ProCoop tiene `UNIDADES_GASTOS` como destino de vales; M15 tiene centros de costo.
- **Opciones:**
  - A) Destino interno de consumo mapeado a un centro de costo de M15 **(Recomendada)** — conserva la práctica y unifica el análisis contable.
  - B) Fusionar con centros de costo — simplifica, pero pierde granularidad operativa.
  - C) Catálogo independiente sin vínculo contable — análisis paralelo no conciliable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-130; O8.

### PA-STK-07 — Inventario físico
- **Pregunta:** ¿Se bloquean los movimientos durante un inventario físico?
- **Contexto:** ProCoop no define regla; la operación de campo no puede detenerse.
- **Opciones:**
  - A) Corte con instantánea y movimientos permitidos, considerados en la diferencia (RN-STK-042) **(Recomendada)** — no interrumpe la operación.
  - B) Bloquear movimientos del alcance contado — más simple de conciliar, frena el depósito.
- **Impacto si no se responde:** se asume A (PRM-STK-031 = `cutoffWithMovements`).
- **Bloquea:** RF-STK-083; O8.

### PA-STK-08 — Equipos propiedad del socio o de terceros
- **Pregunta:** ¿Se registran los equipos que no son de la cooperativa?
- **Contexto:** BASE §73 menciona "otra modalidad que se defina"; el aprovisionamiento necesita la MAC.
- **Opciones:**
  - A) Registrar identificadores sin existencia ni valorización **(Recomendada)** — soporte y aprovisionamiento sin distorsionar el stock.
  - B) No registrar — el aprovisionamiento carga la MAC aparte, sin trazabilidad.
- **Impacto si no se responde:** se asume A (PRM-STK-057 = `true`).
- **Bloquea:** RF-STK-052; O3.

### PA-STK-09 — Tratamiento contable del comodato
- **Pregunta:** ¿Cómo se reconoce contablemente un equipo entregado en comodato?
- **Contexto:** ProCoop tiene un asiento opcional (V2 #2734); AGR-026 exige que comodato no sea consumo.
- **Opciones:**
  - A) Activo "equipos en comodato" sin amortizar, con opción por artículo de tratarlo como bien de uso **(Recomendada)** — conciliable con existencias por custodia.
  - B) Siempre bien de uso amortizable — refleja desgaste, requiere alta de bien por cada equipo.
  - C) Gasto al instalar — simple, pierde el control del activo en domicilios.
- **Impacto si no se responde:** se asume A (PRM-STK-025 = `inventoryOnLoan`).
- **Bloquea:** RN-STK-035, RF-STK-094, RF-STK-095; O3/O5.

### PA-STK-10 — Estados de `fixedAssetValueChanges` y `mrpRuns` (PA 8 del pendiente de cierre)
- **Pregunta:** ¿Los cambios de valor de bienes de uso y las corridas de aprovisionamiento de fabricación tienen máquina de estados propia?
- **Contexto:** el §7 declaraba `status` sin valores en ambas colecciones (en `mrpRuns` con tipo `Date`) y el §8 no tenía sus transiciones.
- **Opciones:**
  - A) Máquina por colección (§8.13): `fixedAssetValueChanges` `draft` → `posted` → `voided` con reversión contable; `mrpRuns` `calculated` → `confirmed` / `discarded`, o `failed` **(Recomendada)**.
  - B) Sin máquina: el cambio de valor se contabiliza al registrarse y la corrida de MRP no guarda estado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.26, §7.35, §8.13; RF-STK-099, RF-STK-126.
- **Estado:** Asumida la recomendada (DEC-072). T05 (COL-STK-28, COL-STK-40) toma los valores de §8.13.

### PA-STK-11 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y evento bajo mínimo)
- **Pregunta:** ¿Cómo se cierran los residuales de M13 que detectaron los entregables regenerados?
- **Contexto:** el índice de estados marcó máquinas sin estado inicial (§8.3, §8.5 a §8.8, §8.10, §8.11), `stockState`, `lotTypes` y `revaluations` con valores sin transiciones, y `serialUnitEvents`, `receptionStatuses` y `serviceReceptions` sin valores; las tablas del §7.37 dejaban referencias sin destino; T05 nombra `inventoryItemId`, `stockDocumentId`, `currentContractId`, `costCenterId` y `bomStructureVersionId`; RF-STK-029 publicaba `stk.item.below-minimum` con guion.
- **Opciones:**
  - A) Estado inicial explícito; §8.14 con `stockState` como flujo entre estados por pares de movimientos, `revaluations` y `serviceReceptions` (`open`, `closed`, `cancelled`); los renglones de `lots` y `serviceReceptions` mezclados en las tablas de `lotTypes` y `receptionStatuses` quedan marcados como reemplazados; nombres de T05 con "antes"; `projectId` → `works` (M10) por ser la obra de P3041; `requisitionId` y `requisitionIds` → `supplyRequests` (M12); `purchaseReceiptId` → `supplierReceipts` (M12); `catalogProductId` → `serviceProducts` (M02); evento `stk.item.belowMinimum` (EVT-STK-12) **(Recomendada)**.
  - B) Mantener el texto y resolver en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.11 a §7.13, §7.24, §7.33, §7.37, §8.
- **Estado:** Asumida la recomendada (DEC-072). T05 debe resolver el `[VERIFICAR]` de `projectId` (§7.2 lo apuntaba a `crmProjects` con duda) hacia `works` (M10) para M13, y registrar `serviceReceptions.status` y `revaluations.status` con estos valores.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `chargeProposalId` → `approvalRequests` (T11): la propuesta de cargo por no devolución es una solicitud de aprobación (RN-STK-038).
- **Residual (5-11-2026), Asumida (DEC-072):** `lots.purchaseReceiptId` (§7.37.15) → `supplierReceipts` (M12, COL-CMP-11), igual que §7.37.14 y T05 §7.2.1 (antes `receipts` de M07, que son recibos de cobranza y no recepciones de compra).

## 22. Trazabilidad de fuentes

### 22.1 BASE

| Fuente | Destino |
|---|---|
| §7 Equipos (inventario, estados, trayectoria, inspecciones, precintos, cambios, CU-07) | RF-STK-001, RF-STK-044 a RF-STK-050, RF-STK-053, RF-STK-075, RF-STK-106; RN-STK-019, RN-STK-075; CU-07 |
| §17 Registro de equipo seriado en instalación | RF-STK-061, RF-STK-062 |
| §20 Inventario y materiales (CU-20, precarga) | RF-STK-009, RF-STK-016, RF-STK-031, RF-STK-054, RF-STK-059, RF-STK-065, RF-STK-066, RF-STK-083, RF-STK-084, RF-STK-086; RN-STK-012, RN-STK-040, RN-STK-041; CU-20; sección 18 |
| §25 Portal del socio | RF-STK-079; CU-STK-19 |
| §29, §54 Auditoría | RF-STK-137; ESC-STK-43 |
| §33 Entidad Custodia de equipo | RF-STK-016, RF-STK-017 |
| §34 escenario 66 | RF-STK-061 |
| §34 escenario 70 | RF-STK-061; ESC-STK-03 |
| §34 escenario 80 (y 79) | RF-STK-131; ESC-STK-27 |
| §34 escenario 82 | RF-STK-082; RN-STK-073; CU-STK-18 |
| §34 escenario 94 | RF-STK-132; RN-STK-074 |
| §55 Activos fijos y amortizaciones pendientes | RF-STK-096 a RF-STK-107 |
| §57 | RF-STK-094 (eventos a M15) |
| §72 Equipo del producto Internet | RF-STK-072 |
| §73 INS-004, "evitar doble descuento", controles | RF-STK-054, RF-STK-057 a RF-STK-064, RF-STK-071, RF-STK-074, RF-STK-077, RF-STK-080, RF-STK-113; RN-STK-012 a RN-STK-018; CU-INS-01; CTR-STK-06 |
| §74 Pendiente de equipos | RF-STK-078; PA-STK-05 |
| §78 OPE-002, CU-OPE-01 | RF-STK-009, RF-STK-027, RF-STK-031, RF-STK-131; RN-STK-027, RN-STK-038; CU-OPE-01 |
| §80 Pendientes | RF-STK-131 |
| §81 Copia de servicio sin stock | RF-STK-082; RN-STK-073 |
| §86 ONT/módem/router | RF-STK-017, RF-STK-044, RF-STK-052, RF-STK-062, RF-STK-071, RF-STK-076, RF-STK-081; RN-STK-037 |
| §90 Cementerio: materiales | RF-STK-132 |
| §91 Banco de sangre sin stock comercial | RF-STK-132; CTR-STK-12 |
| §97.12 Operación: stock de equipos | RF-STK-060, RF-STK-135 |
| §98, §101 | Secciones 13, 15, 17 (integraciones, informes, pruebas) |
| §99 Matriz MER (RMA y bienes de uso), MER-020 | RF-STK-106, RF-STK-108 a RF-STK-112; RN-STK-056; CU-STK-14 |
| §102 Consolidación AGR-026/MER-020; 102.8 agenda de depósito | RF-STK-108 a RF-STK-115; RF-STK-039 |
| §105 Soluciones | Encabezado |
| §106 Pendientes | PA-STK-01 a PA-STK-09 |

### 22.2 AGR, DFA y CNX

| Fuente | Destino |
|---|---|
| AGR-016 Idempotencia | RF-STK-043, RF-STK-061, RF-STK-068; RN-STK-015, RN-STK-078; ESC-STK-10, ESC-STK-40, ESC-STK-41 |
| AGR-018 Migración | RF-STK-136; sección 19 |
| AGR-022 Informes | Sección 15 |
| AGR-023 Constancias | RF-STK-074 |
| AGR-025 Reservas y conflictos offline | RF-STK-055, RF-STK-056, RF-STK-067; RN-STK-024, RN-STK-025; ESC-STK-12 |
| AGR-026 Valoración, comodato, RMA, bienes de uso | RF-STK-017, RF-STK-089, RF-STK-095, RF-STK-097, RF-STK-111 a RF-STK-115; RN-STK-035, RN-STK-039, RN-STK-047; PA-STK-01, PA-STK-09; CTR-STK-01 |
| AGR-027 Compras | RF-STK-087; RN-STK-044, RN-STK-045; CTR-STK-03, CTR-STK-09 |
| DFA M17 funciones (depósitos, productos, tipos, clasificación, movimientos, transferencias, trazabilidad, lotes, operaciones especiales, bienes de uso, RMA, fabricación, unidades de gasto, informes) | RF-STK-004, RF-STK-005, RF-STK-015, RF-STK-024, RF-STK-041, RF-STK-108, RF-STK-116 a RF-STK-130, RF-STK-135, RF-STK-138 |
| DFA M17 mejora "Consumo desde la OT en la app de campo" | RF-STK-060, RF-STK-061 |
| DFA M17 mejora "Stock mínimo con sugerencia de compra" | RF-STK-087, RF-STK-088 |
| CNX §2.4 Permisos y alcance | Sección 4; RN-STK-072 |
| CNX §3.7 Offline | RF-STK-060, RF-STK-061; sección 13; ESC-STK-11 |
| CNX §4 Admin | RF-STK-011; sección 10 |

### 22.3 RN-08

| Sección | Destino |
|---|---|
| §1.1 Cierre de módulo (P432) | RF-STK-030, RF-STK-093; RN-STK-011; CTR-STK-05 |
| §1.2 Numeración de comprobantes | RF-STK-024; RN-STK-071 |
| §1.3 `GetMaxValue + 1` | RN-STK-025, RN-STK-071 |
| §1.4 Permisos en pantalla | RN-STK-072; CTR-STK-16 |
| §6.5 Asientos de stock, OT/OM y comodato | RF-STK-070, RF-STK-094, RF-STK-134; RN-STK-035 |
| §7.5 Recepción de compras | RN-STK-045, RN-STK-046 |
| §7.6 Precio de remito vs factura (P583) | RF-STK-090; RN-STK-030, RN-STK-045; CTR-STK-03 |
| §8.1 Movimientos y operaciones | RF-STK-002, RF-STK-008, RF-STK-023, RF-STK-024, RF-STK-026, RF-STK-037, RF-STK-083, RF-STK-086, RF-STK-133, RF-STK-134; RN-STK-001 a RN-STK-005 |
| §8.2 Vales, transferencias, entregas, materiales utilizados, RMA | RF-STK-024, RF-STK-033, RF-STK-036, RF-STK-039, RF-STK-068, RF-STK-109; RN-STK-014 |
| §8.3 Ubicaciones y depósitos por defecto | RF-STK-018 a RF-STK-020 |
| §8.4 Valorización y revaluación | RF-STK-013, RF-STK-051, RF-STK-089 a RF-STK-092; RN-STK-028, RN-STK-029; CTR-STK-01, CTR-STK-11 |
| §9 Bienes de uso | RF-STK-096 a RF-STK-104; RN-STK-047 a RN-STK-051 |
| §10.1 a §10.4 Fabricación | RF-STK-116 a RF-STK-127; RN-STK-058 a RN-STK-067 |
| §12.3 P755, P2670 | RF-STK-133; PRM-STK-060 |
| §12.4 P460, P2899, P2914, P3015, P3049 | PRM-STK-052, PRM-STK-011, PRM-STK-013, PRM-STK-046, PRM-STK-021 |
| §13 implicancia 1 (contabilidad en lote) | CTR-STK-04; RN-STK-078 |
| §13 implicancia 3 (cierres) | RF-STK-093; CTR-STK-05 |
| §13 implicancia 8 (costeo) | PA-STK-01; CTR-STK-15 |
| §13 implicancia 9 (fabricación fuera del MVP) | CTR-STK-07 |
| §13 implicancia 11 (migración) | RF-STK-136; sección 19 |
| §14 duda 7 (P583/P2162) | CTR-STK-03; RN-STK-045 |
| §14 duda 8 (método de valorización) | PA-STK-01 |
| §14 duda 9 (fabricación en alcance) | CTR-STK-07 |
| §14 duda 14 (ajuste por inflación de bienes de uso) | RF-STK-103; PRM-STK-036, PRM-STK-037 |
| §15.2 Cuadros y eliminación masiva de amortizaciones | RF-STK-102, RF-STK-105; RN-STK-051 |
| §15.3 `clsBienesUso`, `clsProdSer`, `Get_Stock_*`, `CostoReposicion`, `ActualizarPrecios`, `clonarProdSer` | RF-STK-010, RF-STK-012, RF-STK-014, RF-STK-040, RF-STK-087, RF-STK-100, RF-STK-101, RF-STK-107; RN-STK-043, RN-STK-046, RN-STK-053 |
| §15.4 Trazabilidad, movimientos, valorización, revaluación | RF-STK-025, RF-STK-045, RF-STK-091, RF-STK-092; RN-STK-006 a RN-STK-008, RN-STK-020 a RN-STK-022, RN-STK-031, RN-STK-033, RN-STK-068, RN-STK-070 |
| §15.5 Fabricación, etiquetas, pedidos | RF-STK-034, RF-STK-119 a RF-STK-126; RN-STK-044, RN-STK-059 a RN-STK-066 |

### 22.4 RN-09 (parámetros)

| Parámetro V2 | Destino |
|---|---|
| 161, 164 (depósitos por defecto stock/ventas) | PRM-STK-003, PRM-STK-004; RF-STK-020 |
| 165, 166 (depósitos de producción/componentes) | PRM-STK-041, PRM-STK-042; RF-STK-128 |
| 168 (última fecha de requerimiento) | PRM-STK-043; RF-STK-126 |
| 221 (exigir remitos al registrar dispositivos) | PRM-STK-007 |
| 373 (negativo en transferencias) | PRM-STK-005; RN-STK-009 |
| 432 (cierre de stock) | PRM-STK-012; RN-STK-011 |
| 2341 (método de valorización) | PRM-STK-001; PA-STK-01 |
| 2416 (precios de trazables) | PRM-STK-002; RN-STK-022 |
| 2419 (exigir obra en vales) | PRM-STK-009 |
| 2525 (negativo en vales) | PRM-STK-006 |
| 2565 (aviso bajo mínimo) | PRM-STK-008; RN-STK-010 |
| 2609 (obra para vales de integración) | PRM-STK-010; RF-STK-043 |
| 3003 (mover stock al lanzar parte) | PRM-STK-040; RN-STK-062 |
| 3015 (producto de mano de obra) | PRM-STK-046; RF-STK-125 |
| 3040 (orden genérica para dañados) | PRM-STK-047; RF-STK-123 |
| 3041, 3042 (revaluación automática) | PRM-STK-023, PRM-STK-024; RN-STK-034 |
| 3057 (responsable del parte) | PRM-STK-048 |
| 3071 (etiquetas al ingresar) | PRM-STK-020; RF-STK-034 |
| 3171 (no finalizar órdenes manualmente) | PRM-STK-049 |
| 2734 (asiento de comodato) | PRM-STK-025; PA-STK-09 |
| 2778 (cierre de bienes de uso) | PRM-STK-039 |
| 2936, 3076 (revalúo y valores históricos) | PRM-STK-037, PRM-STK-036 |
| §2.2 depósitos implícitos; §3 depósitos por usuario | RF-STK-020, RF-STK-021; CTR-STK-17 |
| 2162, 2982, 583, 264, 2548, 2166/2167, 2722/2723, 2150–2156, 3141, 2139, 2953/3032, 500 | Descartado de STK: pertenecen a M12, M15, M10 o M11 (sección 14, nota final) |

### 22.5 CAT

| Tabla | Destino |
|---|---|
| `BIENES_USO` | `fixedAssets`; RF-STK-096 |
| `BIENES_USO_AMORT` | `fixedAssetDepreciations`, `depreciationRuns`; RF-STK-102, RF-STK-103 |
| `BIENES_USO_CTSEC` | `fixedAssets.costDistribution`; RF-STK-100 |
| `BIENES_USO_DISM` | `fixedAssetValueChanges`; RF-STK-099 |
| `BIENES_USO_HST` | `fixedAssetHistory`; RF-STK-101 |
| `COMBOS` | `itemKits`; RF-STK-008 |
| `DEPAPROD` | `itemDepartments`; RF-STK-007 |
| `DEPOSITO` | `warehouses`; RF-STK-015, RF-STK-022 |
| `ESTADOS_RECEP` | `receptionStatuses`; RF-STK-114 |
| `ETAFAB` | `manufacturingStages`; RF-STK-118 |
| `HIS_PRODFAB` | `bomStructureVersions`; RF-STK-116 |
| `HIS_PRODFAB_DIVISIONES` | `productDivisions` (historial); RF-STK-117 |
| `ITRE_EST` | `serviceReceptions.items.statusHistory`; RF-STK-114 |
| `ITRE_PRO` | `serviceReceptions.items`; RF-STK-114 |
| `IT_RETM` | `stockDocuments.lines`; RF-STK-024, RF-STK-130 |
| `MOV_PRO` | `stockMovements`; RF-STK-023 |
| `MOV_PRO_EXTRAS` | `stockDocuments.receivedBy`; RF-STK-038 |
| `MOV_TRH` | `serialUnitEvents`; RF-STK-047 |
| `OF_PARTE_COMPONENTE` | `productionReports.components`; RF-STK-122 |
| `OF_PARTE_ITEM` | `productionReports.items`; RF-STK-122 |
| `OF_PARTE_PRODUCCION` | `productionReports`; RF-STK-122 |
| `ORCOFAB` | `manufacturingOrders.components`; RF-STK-119 |
| `ORDAFAB` | `manufacturingOrders` (datos adicionales); RF-STK-119 |
| `ORDEFAB` | `manufacturingOrders`; RF-STK-119 |
| `ORDEFAB_EXT` | `manufacturingOrders.extensions`; RF-STK-119 |
| `ORPRFAB` | `manufacturingOrders.products`; RF-STK-119 |
| `PRODFAB` | `bomStructures`; RF-STK-116 |
| `PRODFAB_DIVISIONES` | `productDivisions`; RF-STK-117 |
| `PRODPUES` | Alcance T02 [VERIFICAR]; CTR-STK-17 |
| `PROD_SER_UBICACION` | `itemLocationDefaults`; RF-STK-019 |
| `PROD_TRH` | `serialUnits`; RF-STK-044 |
| `RECEPCIONES` | `serviceReceptions`; RF-STK-114; RN-STK-057 |
| `RETI_MAT` | `stockDocuments` (retiro de materiales); RF-STK-024 |
| `RMA_HISTORIAL` | `rmaCases.history`; RF-STK-109 |
| `RMA_PRODUCTOS` | `rmaCases`; RF-STK-108 |
| `RUB_PYS` | `itemGroups` (rubros); RF-STK-006 |
| `TIP_PROD` | `itemTypes`; RF-STK-004 |
| `UBICACIONES` | `warehouseLocations`; RF-STK-018 |
| `SERSOC_PRODUCTOS` (§1) | `contractEquipmentAssignments` (M02, CTR-DAT-28); RF-STK-073 |
| `UNIDADES_GASTOS` (§14) | `expenseUnits`; RF-STK-130 |
| `TIPOLOTE` | `lotTypes`, `lots`; RF-STK-138 |
| `CLASIFICACION_ITEMS` | `itemClassifications`; RF-STK-005 |
| `TRANSFER` | `stockDocuments` tipo transferencia; RF-STK-039 |
| `USERS_DEPOSITO` | Alcance T02; RF-STK-021 |
| `PROD_SER` | `inventoryItems` (faceta) + M02; RF-STK-001; CTR-STK-14 |

### 22.6 INV (clases y formularios ProCoop)

| Clase / formulario | Destino |
|---|---|
| `clsInformes_Stock` | RF-STK-135; sección 15 |
| `clsMov_pro` | RF-STK-023 a RF-STK-026; RN-STK-001 a RN-STK-007 |
| `clsProductosPendientesEntregar` | RF-STK-036 |
| `clsRMA` | RF-STK-108, RF-STK-109; RN-STK-054, RN-STK-055 |
| `clsRevaluacion` | RF-STK-092; RN-STK-033 |
| `clsTrazabilidad` | RF-STK-045; RN-STK-020 a RN-STK-022 |
| `clsUbicaciones` | RF-STK-018, RF-STK-019 |
| `frmEntregaProductos_Handler` | RF-STK-036 |
| `frmIntercambio_Deposito_Handler` | RF-STK-039 |
| `frmMaterialesUtilizados_Handler` | RF-STK-068 |
| `frmVales_Handler` | RF-STK-024, RF-STK-032, RF-STK-033 |
| `clsOrdeFab` | RF-STK-116 a RF-STK-121, RF-STK-129 |
| `frmOrdenAprovisionamiento_Handler` | RF-STK-126 |
| `clsOfParteProduccion` | RF-STK-122, RF-STK-123, RF-STK-129 |
| `clsBienesUso` | RF-STK-096 a RF-STK-107 |
| `clsProdSer` | RF-STK-001, RF-STK-010, RF-STK-012, RF-STK-040 |
| `abm_prod_ser` | RF-STK-001, RF-STK-002 |
| `abm_prod_ser_combos`, `frmSelectCombo` | RF-STK-008 |
| `abm_prod_ser_rec_des` | Descartado de STK: recargos y descuentos comerciales del producto pertenecen a M02/M11 |
| `frmProd_Ser_Trazabilidad` | RF-STK-045 |
| `frmProdSerUbicacion_Item` | RF-STK-019 |
| `frmUbicacionesStock`, `frmUbicacionesStock_Elemento` | RF-STK-018 |
| `abm_Bienes_Uso` | RF-STK-096, RF-STK-104 |
| `abm_bienes_uso_deduc` | RF-STK-099 |
| `frmConsultar_Vales` (Técnica) | RF-STK-042 |
| `frmMaterialesViv` (Titulares) | RF-STK-133 |
| `clsProcoop_Integra.Post_Stock` | RF-STK-043 |
