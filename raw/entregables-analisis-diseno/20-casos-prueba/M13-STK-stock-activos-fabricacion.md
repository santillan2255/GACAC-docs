# Casos de prueba de aceptación — M13 STK — Stock, equipos serializados, bienes de uso, RMA y fabricación

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M13-STK-stock-activos-fabricacion.md`](../../especificacion/anexos/M13-STK-stock-activos-fabricacion.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 139 CP de requisitos funcionales, 43 CP de escenarios ESC y 24 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M13 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Artículos y clasificación (M13 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0001 | RF-STK-001; M13 §5.1; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Mantener el artículo de inventario con código único por tenant, descripción, descripción corta, tipo, clasificación, rubro, departamento, unidad de stock, marca, modelo, fabricante, código de barras/EAN, características técnicas como… | Alta con propiedades extendidas; una propiedad marcada única rechaza un valor repetido en otra unidad del mismo artículo. |
| CP-STK-0002 | RF-STK-002; M13 §5.1; PRO-O3-02 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Banderas del artículo: lleva stock, serializado, por lote, con vencimiento, usa ubicaciones, bien de uso, fabricable, componente, kit, consumible, equipo de cliente elegible para comodato, vendible (vínculo a M02), comprable, disponible en… | Un artículo sin "lleva stock" no genera movimientos; uno marcado "solo compras-stock" no aparece en ventas. |
| CP-STK-0003 | RF-STK-003; M13 §5.1; PRO-O3-02 | O3 | Estándar | integración | TEN-001 con Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`. | Unidades y equivalencias: unidad de stock, de compra y de consumo con factor de conversión, y cantidad por bulto para reposición. | Recibir 2 cajas × 100 conectores ingresa 200 unidades. |
| CP-STK-0004 | RF-STK-004; M13 §5.1; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | ABM de tipos de artículo. | No se puede eliminar un tipo con artículos; se inactiva. |
| CP-STK-0005 | RF-STK-005; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | ABM jerárquico de clasificaciones con coeficiente de mano de obra. | El costo fijo de fabricación usa el coeficiente de la clasificación. |
| CP-STK-0006 | RF-STK-006; M13 §5.1; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Clasificaciones / rubros: Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo. | ABM jerárquico de rubros con perfil contable (claves: compras, ventas, otros, costo de venta, costo de baja, valor de origen, amortización del ejercicio, amortización acumulada, disminución, revalúo), vida útil por defecto, marca… | Un rubro sin índice impide la revaluación por índice de sus artículos. |
| CP-STK-0007 | RF-STK-007; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | ABM de departamentos de artículos. | Filtro por departamento en informes y actualización de costos. |
| CP-STK-0008 | RF-STK-008; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Kits/combos: composición con cantidades; al moverse se explota en componentes. | Mover 1 kit "instalación FTTH" de 3 componentes genera 3 movimientos. |
| CP-STK-0009 | RF-STK-009; M13 §5.1; PRO-O3-02 | O3 | Estándar | integración | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Asociar un artículo a uno o varios servicios del tenant, y a un servicio por defecto, sin duplicar su existencia. | Un conector asociado a Internet y Electricidad muestra una única existencia. |
| CP-STK-0010 | RF-STK-010; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Clonar un artículo (sufijo "(copia)"), con validación de matrícula única si está habilitada. | Clonar no copia series, saldos ni costos. |
| CP-STK-0011 | RF-STK-011; M13 §5.1; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Importación masiva de artículos, series y saldos iniciales con `ExcelImportWizard` (subir → preview con errores → confirmar). | Un archivo con 1 serie duplicada muestra el error en preview y no importa esa fila. |
| CP-STK-0012 | RF-STK-012; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Actualización masiva del **costo de reposición** por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor) y modos porcentaje, coeficiente, cotización del dólar y monto fijo, guardando el costo anterior y auditando. El… | Un aumento del 10 % actualiza el costo de reposición y deja el anterior en historial. |
| CP-STK-0013 | RF-STK-013; M13 §5.1; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Costo de reposición y costo estándar por artículo (para cargos por equipo no devuelto, presupuestos y valorización "a costo"). | El cargo propuesto por equipo no devuelto toma el costo de reposición vigente. |
| CP-STK-0014 | RF-STK-014; M13 §5.1; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Historial de cambios de costo y datos del artículo (fecha de último costo, usuario). | La ficha muestra la línea de tiempo de costos. |
### 1.2 Depósitos, ubicaciones y custodia (M13 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0015 | RF-STK-015; M13 §5.2; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Depósitos tipificados: central, sucursal, cuadrilla, técnico (personal), vehículo, producción, componentes, tránsito, reparación interna, en proveedor (RMA), cuarentena, consignación, descarte; con sucursal, dirección, responsable… | Se puede crear un depósito de cuadrilla vinculado a la cuadrilla CUA-01 de M10. |
| CP-STK-0016 | RF-STK-016; M13 §5.2; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | El depósito de cuadrilla y el de técnico se vinculan con la cuadrilla/empleado de M10/M16, con responsable de custodia; al cambiar el responsable se exige rendición previa (RF-STK-063). | No se puede reasignar el responsable de un depósito de cuadrilla con saldo sin rendición cerrada. |
| CP-STK-0017 | RF-STK-017; M13 §5.2; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro… | Ubicación de custodia **domicilio del socio**: ubicación lógica por contrato (`contractId` + `premiseId`), sin crear un depósito por socio; contiene las unidades aplicadas y se incluye en existencias propias valorizadas cuando la modalidad… | Consultar "equipos en domicilios" lista MOD-DEMO-001 en el contrato de Ana con modalidad comodato. |
| CP-STK-0018 | RF-STK-018; M13 §5.2; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Ubicaciones: DEP-01: pasillos A–C, estantes 1–4 (por ejemplo `A-1-03`). | Ubicaciones jerárquicas (padre/hijo) dentro de un depósito, con marca asignable y por defecto, y alta masiva con enumeración (por ejemplo E01..E20). | Solo ubicaciones asignables reciben movimientos. |
| CP-STK-0019 | RF-STK-019; M13 §5.2; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Ubicaciones por defecto y capacidad por artículo. | Un ingreso sin ubicación propone la ubicación por defecto; superar la capacidad advierte. |
| CP-STK-0020 | RF-STK-020; M13 §5.2; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Depósitos por defecto por tipo de operación (stock, ventas, producción, componentes) en tres niveles: tenant, sucursal y usuario. | Un técnico ve su depósito personal como origen por defecto en consumos. |
| CP-STK-0021 | RF-STK-021; M13 §5.2; PRO-O3-02 | O3 | Estándar | seguridad | TEN-001 con Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios). | Alcance de usuario por depósito (habilitados para ver/mover). | Un usuario sin alcance sobre DEP-02 recibe 403 al mover desde DEP-02. |
| CP-STK-0022 | RF-STK-022; M13 §5.2; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios). | Inactivar un depósito (equivale a `IGNORAR`) solo con saldo cero y sin reservas ni documentos abiertos. | Intentar inactivar con saldo muestra el detalle de existencias. |
### 1.3 Movimientos y documentos de stock (M13 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0023 | RF-STK-023; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Libro de movimientos inmutable con operación tipificada (sección 7, enum `operation`), fecha efectiva, fecha de registro, artículo, cantidad con signo de sentido, depósito/ubicación, lote, serie, costo unitario, importe, destino, servicio… | No existe endpoint de edición de movimientos. |
| CP-STK-0024 | RF-STK-024; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Documentos de stock: vale de entrada, vale de salida, transferencia entre depósitos (remito interno), recepción de compra, devolución a proveedor, entrega a cuadrilla, devolución de cuadrilla, consumo en OT/OM, aplicación de equipo, retiro… | Cada tipo tiene numeración propia por tenant y sucursal. |
| CP-STK-0025 | RF-STK-025; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5… | Anulación de documentos por contramovimiento, con motivo y permiso; prohibida si afecta series con movimientos posteriores, bienes de uso dados de baja o períodos cerrados. | Anular un vale genera movimientos inversos; el original queda con estado `cancelled`. |
| CP-STK-0026 | RF-STK-026; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento… | Saldos materializados por artículo, depósito, ubicación, lote y estado de existencia, actualizados en la misma transacción del movimiento; proceso de **reconstrucción y verificación** contra el libro. | El job de verificación no encuentra diferencias entre saldos y suma de movimientos. |
| CP-STK-0027 | RF-STK-027; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Estados de existencia distinguibles: disponible, reservado, en tránsito, en custodia de cuadrilla/técnico, aplicado en domicilio del socio, en reparación, en proveedor, en cuarentena, consignado, consumido, devuelto, dado de baja. | El tablero de un artículo muestra las cantidades por estado y su suma física. |
| CP-STK-0028 | RF-STK-028; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Política de stock negativo por tipo de operación (transferencias, vales, consumos, ventas) y prohibición absoluta para serializados. | Con la política en "bloquear", una salida que deja −1 se rechaza con `problem+json` `stk/negative-stock`. |
| CP-STK-0029 | RF-STK-029; M13 §5.3; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Aviso al registrar una operación que deja el saldo por debajo del mínimo. | Se muestra advertencia no bloqueante y se publica `stk.item.belowMinimum` (EVT-STK-12; antes `stk.item.below-minimum`, PA-STK-11). |
| CP-STK-0030 | RF-STK-030; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Fecha efectiva y fecha de registro separadas; rechazo de operaciones con fecha en período de stock cerrado. | Una salida con fecha anterior al cierre se rechaza `stk/period-closed`. |
| CP-STK-0031 | RF-STK-031; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Destino obligatorio en consumos y salidas internas: OT, OM, obra, servicio, contrato, centro de costo, unidad de gasto, plan de vivienda, según configuración del tipo de documento. | Un consumo sin destino se rechaza. |
| CP-STK-0032 | RF-STK-032; M13 §5.3; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Exigir obra en vales (configurable) y obra por defecto para vales generados por integración externa. | Con la exigencia activa, un vale sin obra no se guarda. |
| CP-STK-0033 | RF-STK-033; M13 §5.3; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Importar ítems de un presupuesto aprobado de M11 en un vale, validando que el presupuesto tenga obra asignada si así se configura. | El vale toma las cantidades pendientes del presupuesto. |
| CP-STK-0034 | RF-STK-034; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Impresión de etiquetas (código de barras/QR) por artículo, serie, lote y ubicación, con pregunta opcional al registrar ingresos. | Al recibir 10 ONU se ofrece imprimir 10 etiquetas con su serie. |
| CP-STK-0035 | RF-STK-035; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Ubicaciones: DEP-01: pasillos A–C, estantes 1–4 (por ejemplo `A-1-03`). | Escaneo de código de barras/QR desde la PWA (cámara) y desde admin (lector) para artículos, series, lotes y ubicaciones. | Escanear una serie en la app la identifica sin tipeo. |
| CP-STK-0036 | RF-STK-036; M13 §5.3; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Productos facturados pendientes de entrega y su entrega posterior (parcial o total). | Una factura con 5 unidades y 3 entregadas muestra 2 pendientes. |
| CP-STK-0037 | RF-STK-037; M13 §5.3; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Salidas en consignación y su seguimiento hasta devolución o facturación. | Informe de consignados muestra unidades fuera sin facturar. |
| CP-STK-0038 | RF-STK-038; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Registrar quién recibe físicamente (usuario o técnico, fecha y hora de recepción) en entregas y transferencias. | La entrega queda "pendiente de aceptación" hasta que el técnico la acepta en la app. |
| CP-STK-0039 | RF-STK-039; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`. | Transferencias con tránsito opcional (sale de origen a "en tránsito" y entra al destino al recibir), recepción parcial con diferencias y remito interno imprimible; modificación del remito solo antes de la recepción. | Recibir 9 de 10 deja 1 en diferencia de tránsito pendiente de resolución. |
| CP-STK-0040 | RF-STK-040; M13 §5.3; PRO-O3-02 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Consulta de disponibilidad por artículo, servicio, depósito, ubicación, lote y cuadrilla, incluyendo comprometido: reservas, órdenes de compra pendientes (M12), facturas de compra pendientes de recibir, presupuestos aprobados con obra… | Disponible = físico disponible − reservado; proyectado = disponible + en tránsito + OC pendientes. |
| CP-STK-0041 | RF-STK-041; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Kardex por artículo (con saldo y costo) y por serie (trayectoria). | El kárdex cuadra con el saldo materializado a la fecha. |
| CP-STK-0042 | RF-STK-042; M13 §5.3; PRO-O3-02 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Consulta de vales y retiros de materiales por OT/OM. | Desde la OT se ve el detalle de materiales entregados, consumidos y devueltos. |
| CP-STK-0043 | RF-STK-043; M13 §5.3; PRO-O11-03 | O11 | Estándar | seguridad | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Integración: recibir vales desde sistemas externos por API con token, idempotentes. | Reenviar el mismo vale con la misma `Idempotency-Key` devuelve el mismo resultado. |
### 1.4 Trazabilidad por número de serie y lote (M13 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0044 | RF-STK-044; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Unidad serializada con número de serie del fabricante e identificadores secundarios tipados (MAC, GPON SN, IMEI, número de medidor, matrícula, código interno), únicos por tenant, artículo y tipo de identificador. | Dos ONU con la misma MAC en el tenant se rechazan. |
| CP-STK-0045 | RF-STK-045; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Ingreso de series por carga manual, escaneo, rango con prefijo y correlativo ("renumerable") e importación Excel, con validaciones: única dentro del lote cargado; error si ya está en stock; error si está asignada a un contrato o instalada… | Reingresar una serie retirada pide confirmación y continúa su trayectoria (no crea otra unidad). |
| CP-STK-0046 | RF-STK-046; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Estados de la unidad: disponible, reservada, en tránsito, en custodia de técnico, instalada/aplicada, retirada pendiente de revisión, en reparación, en RMA, en cuarentena, vendida (titularidad transferida), perdida/no recuperada… | Transiciones según sección 8.2. |
| CP-STK-0047 | RF-STK-047; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro… | Trayectoria completa: cada cambio de custodia, ubicación, estado, contrato, OT, RMA, reparación, inspección, ensayo, mantenimiento y adjunto, con fecha efectiva, actor y documento. | La ficha de MOD-DEMO-001 muestra: ingreso → reservado OT-001 → entregado EMP-INS-001 → aplicado contrato INT-100. |
| CP-STK-0048 | RF-STK-048; M13 §5.4; PRO-O8-05 | O8 | Estándar | regla | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Registrar inspecciones, ensayos y mantenimiento de la unidad con resultado, certificado y vencimiento del ensayo (los ensayos metrológicos de medidores se registran aquí y M03 los consulta). | Un medidor con ensayo vencido no puede reservarse para instalación si la política lo exige. |
| CP-STK-0049 | RF-STK-049; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Precintos y accesorios vinculados a la unidad (fuente, patch cord, antena), cada uno opcionalmente serializado. | El retiro de una ONU verifica que vuelva la fuente asociada o registra faltante. |
| CP-STK-0050 | RF-STK-050; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro… | Impedir instalaciones simultáneas o incompatibles: una unidad solo puede estar aplicada en un contrato a la vez; compatibilidad modelo–servicio/tecnología configurable. | Intentar aplicar MED-002 ya instalado en otro suministro se rechaza `stk/serial-already-applied`. |
| CP-STK-0138 | RF-STK-138; M13 §5.4; PRO-O8-05 | O8 | Estándar | regla | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Lotes con número, fecha de fabricación, fecha de vencimiento, proveedor y tipo de lote; trazabilidad lote → destinos; sugerencia de consumo por vencimiento más próximo (FEFO) y bloqueo de lotes vencidos configurable. | Un lote de cloro vencido no se ofrece en consumos si el bloqueo está activo. |
| CP-STK-0051 | RF-STK-051; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Clasificaciones / rubros: Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo. | Costo por serie: los serializados conservan el costo de su ingreso y se valorizan por identificación específica cuando así lo define el método (PA-STK-01). | El costo de MOD-DEMO-001 es ARS 20.000 aunque el PPP del modelo sea otro. |
| CP-STK-0052 | RF-STK-052; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Equipos de propiedad del socio o de terceros: registro opcional de identificadores (MAC, serie) para aprovisionamiento y soporte, sin existencia ni valorización propia. | Un router propio del socio se registra con MAC y no aparece en el stock valorizado. |
| CP-STK-0053 | RF-STK-053; M13 §5.4; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Búsqueda global por cualquier identificador (serie, MAC, GPON SN, matrícula) desde admin, app de campo y CRM. | Buscar la MAC devuelve la unidad, su estado y contrato. |
### 1.5 Reservas (M13 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0054 | RF-STK-054; M13 §5.5; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Reservar materiales y equipos para una OT, obra, presupuesto, plan de vivienda u orden de fabricación, por cantidad de artículo o por serie específica; la reserva reduce el disponible sin movimiento físico. | CU-20: reservar 4 conectores deja 16 disponibles y 20 físicos. |
| CP-STK-0055 | RF-STK-055; M13 §5.5; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Liberar reservas al cancelar o reprogramar la OT, por vencimiento configurable o manualmente con motivo. | Cancelar OT-001 publica `tec.workOrder.cancelled` y STK libera la reserva. |
| CP-STK-0056 | RF-STK-056; M13 §5.5; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Control de concurrencia: dos reservas simultáneas de la misma serie o del último disponible no pueden confirmarse ambas. | Prueba de carrera con 2 solicitudes simultáneas: una confirma y la otra recibe `stk/reservation-conflict`. |
| CP-STK-0057 | RF-STK-057; M13 §5.5; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Reserva por modelo al agendar y asignación de serie al entregar, o reserva de serie específica desde el inicio, según el modo de entrega configurado por servicio. | Con modo "stock rodante", la OT reserva 1 ONU modelo X y la serie se determina al aplicar. |
| CP-STK-0058 | RF-STK-058; M13 §5.5; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla. | Consumir la reserva al entregar o aplicar, y mostrar en la OT el estado de cada reserva (pendiente, entregada, aplicada, liberada). | La reserva aplicada queda cerrada y no vuelve a reducir disponible. |
### 1.6 Entregas a cuadrilla, custodia y consumo desde la OT (app de campo) (M13 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0059 | RF-STK-059; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Entregar materiales y equipos a cuadrillas o técnicos identificados como **transferencia de custodia** (sale del depósito y queda a cargo del técnico), con aceptación en la app (firma o confirmación) y constancia. | Tras la entrega, DEP-01 baja 4 y la cuadrilla sube 4; el total físico de la cooperativa no cambia. |
| CP-STK-0060 | RF-STK-060; M13 §5.6; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Stock rodante de cuadrilla: el técnico tiene un saldo propio visible en la app ("Mi stock") por artículo, serie y lote, también **sin conexión** (última foto sincronizada + cola local). | Sin red, "Mi stock" muestra el saldo y descuenta localmente lo consumido pendiente de sincronizar. |
| CP-STK-0061 | RF-STK-061; M13 §5.6; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios). | Registrar desde la OT en la app de campo el **consumo de materiales** (artículo, cantidad, lote) y la **aplicación de equipos** (serie escaneada) desde la custodia del técnico; al sincronizar se genera un único movimiento por… | Sincronizar dos veces el mismo cierre de OT no genera dos salidas ni dos aplicaciones. |
| CP-STK-0062 | RF-STK-062; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Aplicación del equipo al contrato: la unidad pasa de la custodia del técnico a la ubicación "domicilio del socio" del contrato, se crea la asignación con modalidad y se publica `stk.equipment.applied` con identificadores (MAC/GPON SN) para… | Tras aplicar, M10 recibe la MAC para dar de alta la ONU en la OLT. |
| CP-STK-0063 | RF-STK-063; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Visita fallida: el equipo y los materiales permanecen en custodia del técnico (o se devuelven), la reserva puede mantenerse para la nueva visita y no se registra instalación ni nuevo descuento. | Una OT con resultado "fallida" no genera aplicación. |
| CP-STK-0064 | RF-STK-064; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Sustitución: si la serie aplicada difiere de la reservada, se registra la sustitución, se libera la reservada y se valida por el supervisor cuando la serie no estaba en la custodia del técnico. | Aplicar una serie de otra cuadrilla queda en "sustitución pendiente de validación" sin adjudicar dos equipos. |
| CP-STK-0065 | RF-STK-065; M13 §5.6; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Devolución de sobrantes de cuadrilla al depósito (total o parcial), con recepción en depósito y condición (bueno, dañado). | CU-20: devolver 1 conector deja 17 en depósito. |
| CP-STK-0066 | RF-STK-066; M13 §5.6; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Rendición de cuadrilla: conciliar entregado − consumido − aplicado − devuelto = saldo en custodia, por artículo y serie; las diferencias se registran como faltante o sobrante con evidencia y requieren ajuste aprobado. | Una rendición con 1 faltante no se cierra sin ajuste aprobado. |
| CP-STK-0067 | RF-STK-067; M13 §5.6; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Conflictos de sincronización: si la OT fue cancelada o reasignada mientras el técnico trabajaba sin conexión, se reciben las evidencias y el consumo/aplicación queda "en conflicto" con responsable de resolución; no se borra lo realizado ni… | La bandeja de conflictos muestra la OT cancelada con la aplicación recibida. |
| CP-STK-0068 | RF-STK-068; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Registrar materiales utilizados desde admin para OT/OM sin app (carga posterior por el supervisor), con origen en la custodia de la cuadrilla o en un depósito. | La carga desde admin y desde app sobre la misma OT no duplican si informan el mismo `clientMutationId`. |
| CP-STK-0069 | RF-STK-069; M13 §5.6; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Validación opcional del consumo declarado por el supervisor antes de su efecto contable. | Con validación activa el consumo afecta stock al sincronizar y el evento económico se emite al validar. |
| CP-STK-0070 | RF-STK-070; M13 §5.6; PRO-O8-05 | O8 | Estándar | integración | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Costo de la OT: materiales valorizados (y, informado por M10, horas hombre con producto de mano de obra) en el informe de costo de OT/OM. | El informe de OT-001 muestra 3 conectores × costo + horas. |
| CP-STK-0071 | RF-STK-071; M13 §5.6; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Retiro de equipos desde OT de baja, cambio, corte o reconexión: el técnico escanea la unidad retirada, registra condición (funciona, dañado, incompleto) y accesorios; la unidad pasa a su custodia con estado "retirada pendiente de revisión". | Retirar la ONU de un contrato en baja cierra la asignación con fecha de devolución. |
### 1.7 Equipos en comodato y otras modalidades (M13 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0072 | RF-STK-072; M13 §5.7; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Modalidades de entrega por artículo/plan: comodato, préstamo temporal, alquiler, venta, propiedad del socio, incorporación a red propia. La modalidad por defecto la define el producto comercial (M02) y se registra en la asignación… | El plan INT-100 entrega ONU en comodato; la asignación guarda `mode = loanForUse`. |
| CP-STK-0073 | RF-STK-073; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Asignación de equipo a contrato con: contrato, cuenta, inmueble, artículo, serie, fecha de entrega, fecha de devolución prevista (préstamo), fecha devuelto, depósito de origen, precio/valor declarado, OT, constancia y observaciones. | La asignación muestra todos los campos de `SERSOC_PRODUCTOS`. |
| CP-STK-0074 | RF-STK-074; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Constancia de comodato/entrega vinculada a la conformidad de instalación de M10 y guardada en el expediente (T11), con versión aceptada. | La constancia firmada no cambia al editar luego la asignación. |
| CP-STK-0075 | RF-STK-075; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla. | Cambio de equipo (falla o actualización tecnológica) en una sola OT: retiro de la unidad A y aplicación de la unidad B; la A pasa a revisión/RMA; se conserva la historia de ambas. | El contrato muestra A (devuelta) y B (vigente) sin superposición. |
| CP-STK-0076 | RF-STK-076; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Seguimiento de devolución en baja: al confirmarse la baja (M09/M10), la asignación pasa a "pendiente de devolución" con plazo; estados devuelto, devuelto incompleto, no recuperado. | Una baja sin retiro a los N días aparece en la bandeja de equipos pendientes. |
| CP-STK-0077 | RF-STK-077; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Devolución en mostrador: el socio trae el equipo a la oficina; se recibe con constancia y queda en el depósito de la sucursal en revisión. | Se entrega comprobante de devolución imprimible/enviable. |
| CP-STK-0078 | RF-STK-078; RN-TAR-246; M13 §5.7; PRO-O6-04 | O6 | Estándar | integración | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Equipo no devuelto: vencido el plazo, generar **propuesta de cargo** (costo de reposición o importe configurado) para aprobación y facturación por M05; la unidad pasa a "no recuperada". El importe del cargo puede pedirse a M04 con… | La propuesta no genera deuda hasta su aprobación. |
| CP-STK-0079 | RF-STK-079; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro… | El socio ve en el portal/app sus equipos en comodato (modelo, serie, fecha, modalidad, constancia) y cómo devolverlos. | El socio solo ve equipos de sus contratos. |
| CP-STK-0080 | RF-STK-080; M13 §5.7; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con RMA: RMA-0001: `ONU-DEMO-005` en garantía, proveedor "Redes del Sur SA", estado `sentToSupplier`. | Venta de equipo: salida por venta vinculada al comprobante de M05/M11, titularidad transferida al socio, garantía de venta registrada. | Un equipo vendido sale de existencias propias y queda con estado `sold`. |
| CP-STK-0081 | RF-STK-081; M13 §5.7; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Asociación de equipos al aprovisionamiento: los identificadores de la unidad aplicada viajan a M10 (MikroTik/Radius/OLT); un cambio de equipo publica el evento para reaprovisionar. | `stk.equipment.swapped` incluye MAC anterior y nueva. |
| CP-STK-0082 | RF-STK-082; M13 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | La copia de un servicio entre tenants no copia stock, series ni asignaciones; los depósitos referenciados se mapean a depósitos del destino o quedan pendientes. | La copia reporta "depósito por defecto sin mapear". |
### 1.8 Inventario físico y ajustes (M13 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0083 | RF-STK-083; M13 §5.8; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. | Un conteo de 18 contra 17 teóricos genera diferencia +1 pendiente de ajuste. |
| CP-STK-0084 | RF-STK-084; M13 §5.8; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento… | Ajustes con motivo tipificado (faltante, sobrante, rotura, vencimiento, robo, error de carga, diferencia de inventario), evidencia adjunta y aprobación por umbral de cantidad/importe (T11). No se modifica existencia sin movimiento. | Un ajuste por encima del umbral queda en "pendiente de aprobación" sin afectar saldos. |
| CP-STK-0085 | RF-STK-085; M13 §5.8; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. | El cierre lista series faltantes para ajuste individual. |
### 1.9 Stock mínimo y sugerencia de compra (M13 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0086 | RF-STK-086; M13 §5.9; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Configurar por artículo y depósito (o global): stock mínimo, máximo, punto de pedido, cantidad de reposición, bulto, días de demora del proveedor. | El artículo muestra su semáforo de reposición. |
| CP-STK-0087 | RF-STK-087; M13 §5.9; PRO-O8-05 | O8 | Estándar | regla | TEN-001 con Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`. | Sugerencia de compra: necesidad = máximo (o reposición) − (disponible + en tránsito + OC pendientes − reservas), redondeada a bultos; propuesta de proveedor habitual y últimas 3 compras de 180 días; se convierte en **requisición** de M12… | Con mín 10, máx 50, disponible 6, OC pendiente 10, sugiere 34 (o 40 si el bulto es 20). |
| CP-STK-0088 | RF-STK-088; M13 §5.9; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Job diario de reposición que genera sugerencias y notifica a compras; tablero de quiebres. | Un artículo bajo mínimo aparece en la bandeja de compras al día siguiente. |
### 1.10 Valorización y costeo (M13 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0089 | RF-STK-089; M13 §5.10; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Costeo perpetuo según el método aprobado (PPP móvil por defecto, PEPS opcional, identificación específica para serializados), calculado al registrar cada movimiento. | Ingresos de 10 a ARS 100 y 10 a ARS 120 dan PPP ARS 110; una salida de 5 se valoriza a ARS 550. |
| CP-STK-0090 | RF-STK-090; M13 §5.10; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Costo de ingreso desde la recepción (precio de OC/remito); si llega la factura con precio distinto, M12 informa la diferencia y STK registra un **movimiento de valor** (sobre existencia remanente y, por lo ya consumido, al costo de… | Una diferencia de ARS 1.000 sobre 10 unidades con 4 consumidas ajusta 600 en existencia y 400 en costo de consumo. |
| CP-STK-0091 | RF-STK-091; M13 §5.10; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Valorización a una fecha con métodos alternativos para análisis (PEPS, UEPS, PPP, precio de venta, precio de costo), sin alterar el costo contable; productos con saldo negativo se informan aparte y no se valúan. | El informe muestra el método usado y lista aparte los negativos. |
| CP-STK-0092 | RF-STK-092; M13 §5.10; PRO-O8-05 | O8 | Estándar | regla | TEN-001 con Clasificaciones / rubros: Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo. | Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. | Falta un índice del período ⇒ la revaluación se aborta con error descriptivo. |
| CP-STK-0093 | RF-STK-093; M13 §5.10; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Cierre de stock por período: congela movimientos y costo hasta la fecha; reapertura con permiso y auditoría. | Con cierre al 31/10, un movimiento del 30/10 se rechaza. |
| CP-STK-0094 | RF-STK-094; M13 §5.10; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Eventos económicos a M15 por: ingreso, consumo (con destino y centro de costo), ajuste, entrega y retiro de comodato, venta (costo de mercadería vendida), revaluación, fabricación, baja; con importes y dimensiones (servicio, centro de… | Cada evento lleva `sourceDocumentId` y M15 no lo contabiliza dos veces. |
| CP-STK-0095 | RF-STK-095; M13 §5.10; PRO-O8-05 | O8 | Estándar | regla | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Valorización de existencias por estado de custodia (depósitos, cuadrillas, domicilios de socios, proveedores) conciliable con contabilidad. | El total valorizado = suma por custodia = saldo contable de bienes de cambio + equipos en comodato. |
### 1.11 Bienes de uso (M13 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0096 | RF-STK-096; M13 §5.11; PRO-O8-06 | O8 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Ficha de bien de uso: número, descripción, observaciones, serie, artículo, fecha de alta, usuario de alta, fecha de compra, factura de compra, fecha de afectación, fecha de baja, importe de origen, vida útil (años), porcentaje a amortizar… | La ficha muestra valor residual contable = origen + mejoras − disminuciones − amortización acumulada. |
| CP-STK-0097 | RF-STK-097; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. | Recibir 1 OLT marcada bien de uso crea un borrador de bien que el responsable confirma. |
| CP-STK-0098 | RF-STK-098; M13 §5.11; PRO-O8-06 | O8 | Estándar | regla | TEN-001 con Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5… | Amortización lineal: tasa anual = porcentaje a amortizar / vida útil; mensual = anual / 12; desde la afectación (o inicio del período) hasta fin del período, baja o fin de vida útil, con prorrateo por días en meses parciales; solo bienes… | Bien de ARS 1.200.000, 100 %, 5 años, afectado el 16/03: marzo amortiza 20.000 × 16/31. |
| CP-STK-0099 | RF-STK-099; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Mejoras como incorporaciones vinculadas al bien principal con su propia amortización, y disminuciones de valor con fecha e importe. | La mejora se muestra separada en el cuadro y el asiento. |
| CP-STK-0100 | RF-STK-100; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Distribución del bien por centros de costo con porcentaje (suma 100 %), aplicada a la amortización. | No se guarda una distribución que no sume 100 %. |
| CP-STK-0101 | RF-STK-101; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5… | Historial de cambios de la ficha (cada versión con todos los campos). | Cambiar la vida útil deja la versión anterior consultable. |
| CP-STK-0102 | RF-STK-102; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Corrida de amortización por período (mensual por defecto; anual opcional), simulable, que emite `stk.depreciation.posted` por bien/rubro/centro y actualiza acumulados; reversión de una corrida revierte acumulados. | Revertir la corrida de octubre deja acumulados como al 30/09. |
| CP-STK-0103 | RF-STK-103; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Clasificaciones / rubros: Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo. | Valores históricos y ajustados por inflación (índice por período), con amortización histórica y ajustada, y separación opcional de la cuenta de revalúo. | El cuadro muestra columnas histórica y ajustada. |
| CP-STK-0104 | RF-STK-104; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Baja del bien (venta, destrucción, robo, obsolescencia, donación) con fecha, valor de recupero y resultado; si es serializado, la unidad pasa a descartada/vendida; emite evento a M15. | La baja con recupero ARS 100.000 y residual 80.000 informa resultado +20.000. |
| CP-STK-0105 | RF-STK-105; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5… | Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) por rubro y ejercicio; exportación. | El cuadro cuadra con las cuentas de M15. |
| CP-STK-0106 | RF-STK-106; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5… | Bienes de uso serializados (vehículos, OLT, herramientas de medición) vinculados a su unidad para trayectoria y custodia. | La ficha del bien enlaza la trayectoria de su serie. |
| CP-STK-0107 | RF-STK-107; M13 §5.11; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Eliminación de un bien solo si no tiene amortizaciones ni movimientos; si los tiene, se anula con reversión automática (no asientos manuales). | Anular un bien con 3 amortizaciones genera la reversión. |
### 1.12 RMA, garantías, reparaciones y recepción técnica (M13 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0108 | RF-STK-108; M13 §5.12; PRO-O8-06 | O8 | Estándar | regla | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Caso RMA vinculado a la serie: fecha, usuario que recibió, contrato de origen, contacto (nombre, teléfono, horario), artículo, modelo, serie, proveedor, observación de recepción, problema informado, diagnóstico, garantía (sí/no y… | Un RMA no se crea sin serie para artículos serializados. |
| CP-STK-0109 | RF-STK-109; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con RMA: RMA-0001: `ONU-DEMO-005` en garantía, proveedor "Redes del Sur SA", estado `sentToSupplier`. | Estados configurables del RMA con historial (fecha, usuario, observación) y notificación por email/plantilla al cambiar de estado cuando se configura. | Pasar a "enviado al proveedor" envía la plantilla configurada. |
| CP-STK-0110 | RF-STK-110; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Envío a proveedor: transferencia al depósito "en proveedor"; retorno reparado (misma serie), reemplazado (nueva serie, la anterior queda como baja en proveedor), o rechazado (vuelve como dañado); nota de crédito o reposición gestionada por… | El reemplazo crea la nueva unidad con trayectoria que referencia a la anterior. |
| CP-STK-0111 | RF-STK-111; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Reparación interna: consumo de repuestos con destino el caso RMA, horas y costo; resultado apto/no apto. | El costo del RMA suma repuestos consumidos. |
| CP-STK-0112 | RF-STK-112; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Garantías por serie: garantía de proveedor (desde la recepción, meses por artículo/proveedor) y garantía de venta al socio; aviso de garantía vigente al abrir RMA. | Abrir RMA de una ONU con 3 meses de uso y garantía de 12 indica "en garantía". |
| CP-STK-0113 | RF-STK-113; M13 §5.12; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Revisión de equipos retirados: bandeja de unidades "retiradas pendientes de revisión" con decisión: apto para reutilizar (vuelve a disponible, opcionalmente "reacondicionado"), reparar, RMA, descarte. | Un equipo retirado no vuelve a disponible sin revisión. |
| CP-STK-0114 | RF-STK-114; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… | Un equipo de cliente en reparación no suma a existencias propias. |
| CP-STK-0115 | RF-STK-115; M13 §5.12; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Baja técnica y disposición final (descarte, reciclado, destrucción certificada) con constancia. | La unidad descartada queda con certificado adjunto y sin existencia. |
### 1.13 Fabricación (M13 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0116 | RF-STK-116; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. | Modificar la estructura crea una nueva versión; las órdenes guardan la versión usada. |
| CP-STK-0117 | RF-STK-117; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Divisiones de producto (descomposición con tipo y origen de operación, cantidad, medida y coeficiente) e historial. | Dividir 1 bobina de 1000 m en tramos de 50 m genera 20 unidades con coeficiente. |
| CP-STK-0118 | RF-STK-118; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Etapas de fabricación por producto con orden, descripción, duración y observaciones. | La orden muestra el avance por etapa. |
| CP-STK-0119 | RF-STK-119; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Orden de fabricación con comprobante, fechas de lanzamiento y fin previstas y reales, responsable, etapa, observaciones, productos a producir (cantidad, vínculo a comprobante de venta, cantidad en partes, reasignada, con cambio de… | Extender el plazo registra el nuevo fin y quién lo pidió. |
| CP-STK-0120 | RF-STK-120; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Ciclo de la orden: generada → lanzada → finalizada; cancelada; anulada (solo generada, o lanzada sin partes, o con todo lo producido reasignado), liberando comprometidos y desvinculando el comprobante de venta. | Anular una orden con partes no reasignados se rechaza. |
| CP-STK-0121 | RF-STK-121; M13 §5.13; PRO-O10-10 | O10 | Estándar | regla | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Al finalizar: ingreso de productos terminados al depósito de producción al costo calculado y egreso de componentes del depósito de componentes, neteando productos que también son componentes; los trazables piden series. | Finalizar una orden de 10 medidores armados consume sus componentes una sola vez. |
| CP-STK-0122 | RF-STK-122; M13 §5.13; PRO-O10-10 | O10 | Estándar | regla | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos fabricados… | Con consumo al lanzar activo, lanzar el parte genera la salida de componentes. |
| CP-STK-0123 | RF-STK-123; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Productos dañados: cambio de producto, destrucción total o reasignación a otra orden, usando una orden genérica configurable. | Un producto destruido genera baja con motivo y no se cuenta como fabricado. |
| CP-STK-0124 | RF-STK-124; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Números de serie de productos fabricados con formato configurable (por defecto parte + orden + conjunto + matrícula + correlativo, 30 caracteres) y rastreo del parte original por componente trazable. | El medidor fabricado muestra en su trayectoria los componentes serializados usados. |
| CP-STK-0125 | RF-STK-125; M13 §5.13; PRO-O10-10 | O10 | Estándar | migración | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Costo de fabricación: componentes al costo de consumo del método vigente (PEPS en ProCoop) o costo estándar si no hay valorización, más mano de obra (producto de mano de obra × coeficiente de la clasificación o peso) y costo fijo; precio… | El costo del producto terminado = Σ componentes + mano de obra + fijo. |
| CP-STK-0126 | RF-STK-126; M13 §5.13; PRO-O10-10 | O10 | Estándar | regla | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Aprovisionamiento de fabricación (MRP simple): para las órdenes lanzadas del rango no finalizadas, calcula necesidades de componentes a la fecha de lanzamiento + días del componente, descuenta lo en proceso y el stock, excluye componentes… | Genera una requisición por proveedor con los faltantes. |
| CP-STK-0127 | RF-STK-127; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`. | Eventos de fabricación: componentes a productos en proceso al lanzar/consumir; productos terminados contra productos en proceso al finalizar, repartiendo el costo por proporción de cantidades. | M15 recibe 2 eventos por orden con importes que cuadran. |
| CP-STK-0128 | RF-STK-128; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia… | Configuración: responsable por defecto del parte, no permitir finalizar órdenes manualmente (solo por partes), depósitos por defecto de producción y componentes. | Con la restricción activa, el botón Finalizar de la orden no aparece. |
| CP-STK-0129 | RF-STK-129; M13 §5.13; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. | Cada informe exporta XLSX/CSV/PDF. |
### 1.14 Unidades de gasto, stock por servicio, vivienda y otros (M13 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-STK-0130 | RF-STK-130; M13 §5.14; PRO-O8-06 | O8 | Estándar | regla | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | ABM de unidades de gasto (descripción, observaciones, centro de costo asociado) y uso como destino en vales y retiros de materiales. | Un vale a la unidad "Mantenimiento edificio" imputa al centro asociado. |
| CP-STK-0131 | RF-STK-131; M13 §5.14; PRO-O3-03 | O3 | Estándar | regla | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Stock por servicio: cada movimiento lleva servicio (directo o por distribución explícita) y las compras compartidas se asignan sin duplicar cantidades ni importes; informes de existencias, consumos y reposición por servicio. | La suma de consumos por servicio = consumo total. |
| CP-STK-0132 | RF-STK-132; M13 §5.14; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Servicios sin stock comercial: un servicio puede declararse sin inventario comercial (banco de sangre, restos en cementerio parque), aunque use materiales internos con stock. | El servicio banco de sangre no ofrece artículos de stock en su catálogo comercial. |
| CP-STK-0133 | RF-STK-133; M13 §5.14; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla. | Materiales para planes de vivienda: reserva por tipología, retiro, devolución de reservado y devolución (operación vivienda). | Devolver reservado libera la reserva del plan. |
| CP-STK-0134 | RF-STK-134; M13 §5.14; PRO-O8-06 | O8 | Estándar | funcional | TEN-001 con Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados". | Órdenes de mantenimiento (OM) como destino de consumo, con su costo. | Consumo con destino OM aparece en el costo de mantenimiento. |
| CP-STK-0135 | RF-STK-135; M13 §5.14; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | Catálogo de informes de stock (sección 15) con filtros, agrupaciones, exportación y programación. | Cada informe declara universo, fecha de corte y fórmula. |
| CP-STK-0136 | RF-STK-136; M13 §5.14; PRO-O3-03 | O3 | Estándar | migración | TEN-001 con Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router… | Migración desde ProCoop de artículos, depósitos, ubicaciones, series con trayectoria, saldos iniciales valorizados, asignaciones en comodato vigentes, bienes de uso con acumulados, RMA abiertos y estructuras de fabricación. | Conciliación de la sección 19 sin diferencias. |
| CP-STK-0137 | RF-STK-137; M13 §5.14; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 con OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla. | Auditoría de cada cambio de configuración y de cada operación (antes/después, actor, origen). | La auditoría de un ajuste muestra aprobador y evidencia. |
| CP-STK-0139 | RF-STK-139; M13 §5.14; PRO-O8-05 | O8 | Estándar | integración | TEN-001 con Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`). | **Movimientos de stock de la entrega de gas envasado** (DEC-082; RF-TEC-239 de M10): al cerrar una OT de operación `bottledGasDelivery`, M13 consume el bloque `bottledGas` de EVT-TEC-07 `tec.workOrder.closed` (`deliveryId`, `warehouseId?`… | Una OT con 2 garrafas de 10 kg entregadas y 2 vacías retiradas genera un egreso de 2 llenas del vehículo y un ingreso de 2 vacías; reprocesar el mismo cierre no duplica movimientos. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-STK-5001 — ESC-STK-01. Entrega a cuadrilla no es consumo**

- Cubre: ESC-STK-01; RN-STK-012, RN-STK-013; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Entrega a cuadrilla no es consumo
- Entonces Dado DEP-01 con 20 MAT-CON-01, cuando se entregan 4 a CUA-01 y se acepta, entonces DEP-01 = 16, CUA-01 = 4, existencia total = 20 y no hay evento `stk.materials.consumed` (EVT-STK-02).

**CP-STK-5002 — ESC-STK-02. CU-20 completo**

- Cubre: ESC-STK-02; relacionados: CU-20, ESC-STK-01; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CU-20 completo
- Entonces Dado el ESC-STK-01, cuando la OT-001 consume 3 y se devuelve 1, entonces DEP-01 = 17, CUA-01 = 0, consumo de OT-001 = 3 valorizado y la reserva de 4 queda cerrada.

**CP-STK-5003 — ESC-STK-03. Sin doble descuento (BASE §73)**

- Cubre: ESC-STK-03; RN-STK-014; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sin doble descuento (BASE §73)
- Entonces Dado MOD-DEMO-001 en custodia de EMP-INS-001, cuando la OT de instalación registra la aplicación, entonces existe exactamente un movimiento de salida de la custodia del técnico y ninguno sobre DEP-01.

**CP-STK-5004 — ESC-STK-04. Stock negativo bloqueado**

- Cubre: ESC-STK-04; RN-STK-009; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados".
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Stock negativo bloqueado
- Entonces Dado PRM-STK-005 = `block` y DEP-01 con 2 unidades, cuando se transfieren 3, entonces 422 `problem+json` con código `stk.insufficientStock` y ningún movimiento.

**CP-STK-5005 — ESC-STK-05. Serializado en dos lugares**

- Cubre: ESC-STK-05; RN-STK-008, RN-STK-020, RN-STK-021; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Serializado en dos lugares
- Entonces Cuando se intenta ingresar una serie ya disponible en DEP-01, entonces error; el índice único de ubicación vigente impide la duplicación incluso con dos solicitudes simultáneas.

**CP-STK-5006 — ESC-STK-06. Anulación con contramovimiento**

- Cubre: ESC-STK-06; RN-STK-006, RN-STK-007; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento 30/04/2027.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Anulación con contramovimiento
- Entonces Cuando se anula un vale confirmado, entonces se crea el documento inverso enlazado, los saldos vuelven al estado previo y el original queda `voided`, sin borrado.

**CP-STK-5007 — ESC-STK-07. Período cerrado**

- Cubre: ESC-STK-07; RN-STK-011; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Período cerrado
- Entonces Dado el período de stock cerrado al 31/10/2026, cuando se registra un movimiento con fecha 30/10/2026, entonces se rechaza; con fecha 01/11/2026, se acepta.

**CP-STK-5008 — ESC-STK-08. Kit Kit**

- Cubre: ESC-STK-08; RN-STK-002; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Kit
- Entonces Cuando se entrega 1 kit "Instalación FTTH" (1 ONU, 1 roseta, 30 m drop), entonces se mueven los componentes y el kit no tiene saldo.

**CP-STK-5009 — ESC-STK-09. Saldos materializados verificados**

- Cubre: ESC-STK-09; RN-STK-005; M13 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento 30/04/2027.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Saldos materializados verificados
- Entonces Dado un saldo alterado manualmente en la base de pruebas, cuando corre JOB-STK-01, entonces se detecta la diferencia y se crea una alerta sin corregir en silencio.

**CP-STK-5010 — ESC-STK-10. Reintento idempotente**

- Cubre: ESC-STK-10; RN-STK-015; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento idempotente
- Entonces Cuando el mismo `clientMutationId` se envía dos veces a `/field/sync`, entonces la segunda respuesta devuelve el resultado original y no hay segundo movimiento.

**CP-STK-5011 — ESC-STK-11. Resultado por ítem**

- Cubre: ESC-STK-11; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Resultado por ítem
- Entonces Dado un lote de 5 mutaciones donde la 3.ª referencia una serie inexistente, entonces 4 se aplican, la 3.ª devuelve error y el lote no se revierte.

**CP-STK-5012 — ESC-STK-12 / ESC-03. Conflicto offline**

- Cubre: ESC-STK-12, ESC-03; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conflicto offline
- Entonces Dada una OT cancelada en admin mientras el técnico instala sin conexión, cuando sincroniza, entonces la salida de custodia se registra (hecho físico), se abre conflicto en M10 sin efectos contractuales y la resolución `acceptServer` genera la OT de retiro; nunca hay doble salida.

**CP-STK-5013 — ESC-STK-13. Sustitución de serie**

- Cubre: ESC-STK-13; RN-STK-017; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sustitución de serie
- Entonces Dada la reserva de ONU-A, cuando se aplica ONU-B en custodia del técnico, entonces ONU-A se libera y ONU-B queda aplicada; si ONU-B no estaba en su custodia, queda pendiente de validación.

**CP-STK-5014 — ESC-STK-14. Reserva concurrente**

- Cubre: ESC-STK-14; RN-STK-025; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reserva concurrente
- Entonces Con 1 unidad disponible y dos reservas simultáneas, entonces una se confirma y la otra recibe 409 `stk.versionConflict`.

**CP-STK-5015 — ESC-STK-15. Vencimiento de reserva**

- Cubre: ESC-STK-15; RN-STK-024; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vencimiento de reserva
- Entonces Dada una reserva sin ejecución por 15 días y OT no agendada, cuando corre JOB-STK-03, entonces se libera y se notifica al supervisor.

**CP-STK-5016 — ESC-STK-16. Comodato no es consumo**

- Cubre: ESC-STK-16; RN-STK-035; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro de agua AG-200 hasta el reemplazo de CU-07.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comodato no es consumo
- Entonces Cuando se aplica MOD-DEMO-001 en comodato al contrato INT-100, entonces sigue en la existencia valorizada con custodia "domicilio del socio" y no se emite costo de mercadería vendida.

**CP-STK-5017 — ESC-STK-17. Baja sin retiro**

- Cubre: ESC-STK-17; RN-STK-037, RN-STK-038; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Baja sin retiro
- Entonces Dada la baja de INT-100, cuando pasan 30 días sin retiro, entonces la asignación pasa a `chargeProposed` con importe de reposición y requiere aprobación; no se emite comprobante sin aprobación.

**CP-STK-5018 — ESC-STK-18. Equipo retirado a revisión**

- Cubre: ESC-STK-18; RN-STK-039; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Equipo retirado a revisión
- Entonces Cuando se retira la ONU, entonces queda `pendingReview` y no aparece como disponible hasta la decisión.

**CP-STK-5019 — ESC-STK-19. Compatibilidad**

- Cubre: ESC-STK-19; RN-STK-019; M13 §17.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Compatibilidad
- Entonces Dado PRM-STK-017 activo, cuando se reserva un módem ADSL para un contrato FTTH, entonces se rechaza.

**CP-STK-5020 — ESC-STK-20. PPP móvil**

- Cubre: ESC-STK-20; RN-STK-028; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados".
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando PPP móvil
- Entonces Dado 10 u. a ARS 100, cuando ingresan 10 u. a ARS 120, entonces costo promedio ARS 110; una salida de 5 se valoriza en ARS 550.

**CP-STK-5021 — ESC-STK-21. Diferencia de factura**

- Cubre: ESC-STK-21; RN-STK-030; relacionados: CU-STK-10; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados".
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Diferencia de factura
- Entonces CU-STK-10: ajuste de valor ARS 60 a existencia y ARS 40 a costo de consumo; ningún movimiento histórico cambia.

**CP-STK-5022 — ESC-STK-22. Ajuste con umbral**

- Cubre: ESC-STK-22; RN-STK-040; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento 30/04/2027.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ajuste con umbral
- Entonces Dado umbral de importe ARS 50.000, un ajuste de ARS 30.000 se aplica sin aprobación; uno de ARS 80.000 queda pendiente y no afecta saldos.

**CP-STK-5023 — ESC-STK-23. Rendición**

- Cubre: ESC-STK-23; RN-STK-041; relacionados: CU-STK-07; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Rendición: Rendición semanal de CUA-01 del 02/11/2026 (esperado 8 ONU, contado 7) para la demo de CU-STK-07.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición
- Entonces CU-STK-07: no se puede cerrar con diferencia pendiente; tras aprobar el ajuste, se cierra.

**CP-STK-5024 — ESC-STK-24. Sugerencia a requisición**

- Cubre: ESC-STK-24; RN-STK-043, RN-STK-044; relacionados: CU-STK-09; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sugerencia a requisición
- Entonces CU-STK-09: la sugerencia de 400 crea una requisición en M12 y ninguna OC.

**CP-STK-5025 — ESC-STK-25. Factura sin recepción**

- Cubre: ESC-STK-25; RN-STK-045; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura sin recepción
- Entonces Una factura de bienes sin recepción física no modifica existencias.

**CP-STK-5026 — ESC-STK-26. Conciliación contable**

- Cubre: ESC-STK-26; RF-STK-135; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Saldos: DEP-01: 20 MAT-CON-01; 1.000 m MAT-DROP-01; 5 ONU-DEMO (`ONU-DEMO-001` a `005`); MED-001 y MED-002 disponibles; lote `CL-2026-10` con vencimiento 30/04/2027.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación contable
- Entonces Al cierre, el informe `valuation-reconciliation` muestra igualdad entre existencia valorizada por custodia y saldos de las cuentas de stock en M15; toda diferencia se lista con el evento que la explica.

**CP-STK-5027 — ESC-STK-27. Stock por servicio**

- Cubre: ESC-STK-27; RF-STK-131; M13 §17.3
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Stock por servicio
- Entonces Dado OC-DEMO-002 por 2 módems para Internet, Σ consumo por servicio = consumo total y el módem disponible sigue asignado a Internet (escenarios 79–80).

**CP-STK-5028 — ESC-STK-28. Amortización con prorrateo**

- Cubre: ESC-STK-28; RN-STK-048, RN-STK-049; relacionados: CU-STK-12; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Amortización con prorrateo
- Entonces CU-STK-12: marzo ARS 10.322,58; abril ARS 20.000; acumulado nunca supera el amortizable.

**CP-STK-5029 — ESC-STK-29. Reversión de corrida masiva**

- Cubre: ESC-STK-29; RN-STK-051; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reversión de corrida masiva
- Entonces Cuando se revierte la corrida de abril, los acumulados vuelven al valor de marzo (corrige defecto ProCoop).

**CP-STK-5030 — ESC-STK-30. Baja con resultado**

- Cubre: ESC-STK-30; relacionados: CU-STK-13; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Baja con resultado
- Entonces CU-STK-13: resultado +ARS 500.000 enviado como evento a M15.

**CP-STK-5031 — ESC-STK-31. RMA bloquea la unidad**

- Cubre: ESC-STK-31; RN-STK-054, RN-STK-056; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando RMA bloquea la unidad
- Entonces Cuando se abre RMA de ONU-A, no se puede reservar ni aplicar; el reemplazo crea ONU-C enlazada.

**CP-STK-5032 — ESC-STK-32. Recepción técnica fuera de stock**

- Cubre: ESC-STK-32; RN-STK-057; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recepción técnica fuera de stock
- Entonces Un router de cliente en recepción no aparece en existencias ni en valorización.

**CP-STK-5033 — ESC-STK-33. Fabricación**

- Cubre: ESC-STK-33; RF-STK-121, RF-STK-122, RF-STK-125; relacionados: CU-STK-16; M13 §17.4
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Fabricación
- Entonces CU-STK-16: Σ costo de componentes + mano de obra + fijo = costo de los 20 pilares; componentes consumidos una sola vez aunque el parte se haya lanzado con PRM-STK-040 activo.

**CP-STK-5034 — ESC-STK-34. Anulación de orden con partes**

- Cubre: ESC-STK-34; RN-STK-059; M13 §17.4
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Anulación de orden con partes
- Entonces Anular una orden lanzada con partes no reasignados devuelve error explícito.

**CP-STK-5035 — ESC-STK-35. Permiso negativo**

- Cubre: ESC-STK-35; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo
- Entonces Un técnico sin `stk.adjustment.approve` recibe 403 al aprobar un ajuste, aunque llame a la API directamente.

**CP-STK-5036 — ESC-STK-36. Alcance de depósito**

- Cubre: ESC-STK-36; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M13 §18.
- Datos de prueba: Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Alcance de depósito
- Entonces Un encargado con alcance DEP-01 no ve ni mueve existencias de DEP-02 (lista vacía, 404 por ID).

**CP-STK-5037 — ESC-STK-37. Técnico ve solo su custodia**

- Cubre: ESC-STK-37; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Técnico ve solo su custodia
- Entonces `GET /field/my-stock` devuelve solo la custodia del técnico autenticado y de su cuadrilla.

**CP-STK-5038 — ESC-STK-38. Aislamiento de tenant**

- Cubre: ESC-STK-38; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aislamiento de tenant
- Entonces Un usuario de TEN-002 que consulta una serie de TEN-001 recibe 404; las series se validan como únicas por tenant (la misma MAC puede existir en dos tenants).

**CP-STK-5039 — ESC-STK-39. Socio Socio**

- Cubre: ESC-STK-39; relacionados: CU-STK-19; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro de agua AG-200 hasta el reemplazo de CU-07.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Socio
- Entonces El socio solo ve equipos de sus contratos (CU-STK-19).

**CP-STK-5040 — ESC-STK-40. Reintento de evento**

- Cubre: ESC-STK-40; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento de evento
- Entonces Si M15 no está disponible, el evento queda en el outbox y se reintenta; al recuperarse se procesa una sola vez (idempotencia por `eventId`).

**CP-STK-5041 — ESC-STK-41 / ESC-04. Integración incierta**

- Cubre: ESC-STK-41, ESC-04; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Integración incierta
- Entonces Si la API externa de vales cae tras recibir la solicitud, el reintento con la misma `Idempotency-Key` devuelve el resultado original sin duplicar el vale.

**CP-STK-5042 — ESC-STK-42. Rendimiento**

- Cubre: ESC-STK-42; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendimiento
- Entonces La consulta de existencias de un depósito con 5.000 artículos responde en menos de 2 s (p95); la sincronización de 200 mutaciones en menos de 10 s (T08).

**CP-STK-5043 — ESC-STK-43. Auditoría**

- Cubre: ESC-STK-43; M13 §17.5
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: OT: OT-001 instalación con reserva de 4 MAT-CON-01; OT-002 cambio de ONU por falla.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Auditoría
- Entonces Cada ajuste, anulación y cambio de parámetro muestra actor, fecha, antes/después y origen.

## 3. Casos por caso de uso (CU)

**CP-STK-8001 — CU-20. Reserva, entrega, consumo y devolución de conectores**

- Cubre: CU-20; M13 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios).
- Dado actor: Encargado de depósito, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando DEP-01 tiene 20 conectores MAT-CON-01; OT-001 requiere 4: reservar 4 (16 disponibles), entregar 4 a la cuadrilla, registrar 3 consumidos en la OT y 1 devuelto.
- Entonces 17 en depósito, 3 consumidos en la OT, saldo 0 en cuadrilla. Alternativo o excepción: Faltante físico ⇒ ajuste autorizado con evidencia; no se modifica la existencia sin movimiento.

**CP-STK-8002 — CU-07. Reemplazo de medidor**

- Cubre: CU-07; M13 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro de agua AG-200 hasta el reemplazo de CU-07.
- Dado actor: Encargado técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Retirar MED-001 con lectura final 1.270 m³ (M03), instalar MED-002 con lectura inicial 0 y fecha efectiva; STK mueve custodia y estados.
- Entonces Trayectoria de ambos conservada; sin superposición. Alternativo o excepción: MED-002 ya instalado en otro suministro ⇒ bloqueo hasta resolver.

**CP-STK-8003 — CU-INS-01. Instalación de Internet con módem en comodato**

- Cubre: CU-INS-01; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado actor: Técnico EMP-INS-001, autenticado en TEN-001 con las capabilities de su rol
- Cuando MOD-DEMO-001 asignado al instalador; En camino; instala, prueba, registra serie, conformidad de Ana; aplicación vinculada al contrato INT-100 el 10/11/2026.
- Entonces Equipo en domicilio de Ana, en comodato, custodia actualizada; un único movimiento. Alternativo o excepción: Sincronización repetida no duplica aplicación ni salida; equipo distinto del reservado ⇒ sustitución validada.

**CP-STK-8004 — CU-OPE-01. Compra de módems por servicio**

- Cubre: CU-OPE-01; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado actor: Compras, depósito, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando OC-DEMO-002: 2 módems a ARS 20.000; se reciben con series; uno se entrega e instala, el otro queda disponible.
- Entonces Existencia nunca reducida dos veces; compras, stock y consumo analizables por servicio Internet. Alternativo o excepción: El costo del módem no se convierte automáticamente en cargo al socio.

**CP-STK-8005 — CU-STK-01. Entrega de stock rodante a cuadrilla**

- Cubre: CU-STK-01; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios).
- Dado actor: Encargado de depósito, autenticado en TEN-001 con las capabilities de su rol
- Cuando Entrega 10 ONU y 300 m de cable drop a CUA-01; técnico acepta con firma en la app.
- Entonces DEP-01 −10/−300; CUA-01 +10/+300; total sin cambio. Alternativo o excepción: Sin aceptación, queda en tránsito y no disponible para el técnico.

**CP-STK-8006 — CU-STK-02. Instalación sin conexión y sincronización tardía**

- Cubre: CU-STK-02; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Artículos: MAT-CON-01 conector RJ45 (unidad, mínimo 100, máximo 500, bulto 100, ARS 150); MAT-DROP-01 cable drop (metros, ARS 320/m); MOD-DEMO módem/router Wi-Fi (serializado, ARS 20.000, comodato); ONU-DEMO ONU GPON (serializada…
- Dado actor: Técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Sin señal aplica ONU y consume 25 m de drop; al volver la red sincroniza dos veces por un reintento.
- Entonces Una aplicación y un consumo. Alternativo o excepción: La OT fue cancelada mientras tanto ⇒ conflicto en bandeja, evidencia conservada.

**CP-STK-8007 — CU-STK-03. Visita fallida**

- Cubre: CU-STK-03; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado actor: Técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Domicilio cerrado; registra resultado fallido.
- Entonces Sin aplicación; ONU sigue en custodia; reserva mantenida para la reprogramación. Alternativo o excepción: No se inicia abono (M05).

**CP-STK-8008 — CU-STK-04. Cambio de ONU por falla**

- Cubre: CU-STK-04; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado actor: Técnico, revisión, RMA, autenticado en TEN-001 con las capabilities de su rol
- Cuando OT de cambio: retira ONU A (dañada), aplica ONU B; A pasa a revisión y a RMA con el proveedor en garantía.
- Entonces Contrato con B activa; M10 reaprovisiona con MAC de B; A con historia y RMA. Alternativo o excepción: B no compatible con la red ⇒ rechazo.

**CP-STK-8009 — CU-STK-05. Baja de Internet y retiro del equipo**

- Cubre: CU-STK-05; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado actor: Atención, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Baja confirmada; asignación pendiente de devolución 30 días; OT de retiro recupera la ONU sin fuente.
- Entonces Asignación `returnedIncomplete`; faltante de fuente registrado. Alternativo o excepción: A los 30 días sin retiro ⇒ propuesta de cargo para aprobación.

**CP-STK-8010 — CU-STK-06. Devolución en mostrador**

- Cubre: CU-STK-06; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado actor: Cajero/atención, autenticado en TEN-001 con las capabilities de su rol
- Cuando El socio trae el router; se escanea, se registra condición y se emite constancia.
- Entonces Asignación cerrada; equipo a revisión en la sucursal. Alternativo o excepción: Serie no corresponde al contrato ⇒ se registra como hallazgo para análisis.

**CP-STK-8011 — CU-STK-07. Rendición semanal de cuadrilla**

- Cubre: CU-STK-07; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Rendición: Rendición semanal de CUA-01 del 02/11/2026 (esperado 8 ONU, contado 7) para la demo de CU-STK-07.
- Dado actor: Supervisor, autenticado en TEN-001 con las capabilities de su rol
- Cuando Cuenta en la app: esperado 8 ONU, contado 7.
- Entonces Faltante de 1 serie identificada, ajuste aprobado con evidencia; rendición cerrada. Alternativo o excepción: Sin aprobación no se cierra.

**CP-STK-8012 — CU-STK-08. Inventario físico anual**

- Cubre: CU-STK-08; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Ubicaciones: DEP-01: pasillos A–C, estantes 1–4 (por ejemplo `A-1-03`).
- Dado actor: Encargado, contadores, autenticado en TEN-001 con las capabilities de su rol
- Cuando Instantánea, conteo ciego por ubicaciones, diferencias, ajuste.
- Entonces Exactitud calculada y ajuste contabilizado. Alternativo o excepción: Movimientos durante el conteo considerados según PA-STK-07.

**CP-STK-8013 — CU-STK-09. Sugerencia de compra por mínimo**

- Cubre: CU-STK-09; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado actor: Compras, autenticado en TEN-001 con las capabilities de su rol
- Cuando Conectores: mín 100, máx 500, disponible 80, OC pendiente 100; bulto 100.
- Entonces Sugerencia 400 convertida en requisición de M12. Alternativo o excepción: No se crea OC directa.

**CP-STK-8014 — CU-STK-10. Diferencia de precio de factura**

- Cubre: CU-STK-10; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado actor: Compras, costos, autenticado en TEN-001 con las capabilities de su rol
- Cuando Recepción 10 a ARS 100; factura a ARS 110; 4 ya consumidas.
- Entonces Ajuste de valor ARS 60 en existencia y ARS 40 a costo de consumo. Alternativo o excepción: No se reescriben movimientos históricos.

**CP-STK-8015 — CU-STK-11. Revaluación por índice**

- Cubre: CU-STK-11; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Clasificaciones / rubros: Conectividad, Redes eléctricas, Medidores, Agua, Oficina; rubro "Rodados" con índice de revaluación demo.
- Dado actor: Responsable de costos, autenticado en TEN-001 con las capabilities de su rol
- Cuando Índice octubre 1,10 / julio 1,00 sobre existencia de julio.
- Entonces Movimiento de valor +10 %. Alternativo o excepción: Falta índice ⇒ abortar con mensaje.

**CP-STK-8016 — CU-STK-12. Alta y amortización de una OLT**

- Cubre: CU-STK-12; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado actor: Responsable de bienes de uso, autenticado en TEN-001 con las capabilities de su rol
- Cuando Recepción de OLT marcada bien de uso ARS 1.200.000; borrador confirmado; afectación 16/03/2026; vida 5 años.
- Entonces Marzo ARS 10.322,58; abril ARS 20.000; evento a M15. Alternativo o excepción: Reversión de corrida restaura acumulados.

**CP-STK-8017 — CU-STK-13. Baja de un vehículo**

- Cubre: CU-STK-13; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Bienes de uso: BDU-OLT-01 OLT 16 puertos ARS 1.200.000, afectación 16/03/2026, vida útil 5 años, centro Internet 100 %; BDU-CAM-01 camioneta ARS 18.000.000, vida 5 años, distribución Energía 60 % / Agua 40 %.
- Dado actor: Responsable de bienes de uso, autenticado en TEN-001 con las capabilities de su rol
- Cuando Venta con recupero ARS 3.000.000; residual ARS 2.500.000.
- Entonces Resultado +ARS 500.000; bien `disposed`. Alternativo o excepción: Período cerrado ⇒ rechazo.

**CP-STK-8018 — CU-STK-14. RMA con reemplazo del proveedor**

- Cubre: CU-STK-14; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Depósitos: DEP-01 Central (sucursal Centro); DEP-02 Sucursal Norte; CUA-01 cuadrilla Instalaciones Internet (responsable EMP-INS-001); TEC-EMP-INS-001 custodia del técnico; REV-01 revisión; RMA-01 en proveedor; PROD-01 producción…
- Dado actor: Responsable RMA, autenticado en TEN-001 con las capabilities de su rol
- Cuando ONU en garantía enviada; proveedor entrega otra serie.
- Entonces Nueva unidad enlazada; original "baja en proveedor". Alternativo o excepción: Fuera de garantía ⇒ reparación con costo o descarte.

**CP-STK-8019 — CU-STK-15. Recepción técnica de equipo de cliente**

- Cubre: CU-STK-15; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Tipos de artículo: Material (`MAT`), Equipo serializado (`EQS`), Herramienta (`HER`), Bien de uso (`BDU`), Fabricado (`FAB`), Servicio sin stock (`SRV`).
- Dado actor: Servicio técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando El socio deja un router propio para configurar.
- Entonces Recepción con estados por ítem; no suma al stock propio.

**CP-STK-8020 — CU-STK-16. Orden de fabricación de pilares de medición**

- Cubre: CU-STK-16; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Fabricación: BOM "Pilar de medición monofásico" (1 caño 2", 1 caja de medidor, 1 tablero, 2 h de mano de obra); orden OF-0001 por 20 pilares en estado `launched`.
- Dado actor: Jefe de planta, autenticado en TEN-001 con las capabilities de su rol
- Cuando BOM de pilar (caño, caja, tablero); orden de 20; MRP genera requisición de faltantes; partes; finaliza.
- Entonces 20 pilares en depósito de producción con costo; componentes consumidos una vez. Alternativo o excepción: Producto dañado ⇒ destrucción o reasignación.

**CP-STK-8021 — CU-STK-17. Consumo a unidad de gasto**

- Cubre: CU-STK-17; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Unidades de gasto: "Mantenimiento edificio" (centro de costo Administración), "Taller de rodados".
- Dado actor: Encargado de depósito, autenticado en TEN-001 con las capabilities de su rol
- Cuando Vale de salida de 5 lámparas a "Mantenimiento edificio".
- Entonces Consumo imputado al centro de costo de la unidad de gasto. Alternativo o excepción: Sin destino ⇒ rechazo.

**CP-STK-8022 — CU-STK-18. Copia de servicio Internet a otro tenant**

- Cubre: CU-STK-18; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M13 §18.
- Datos de prueba: Compra: OC-DEMO-002: 2 módems a ARS 20.000 c/u para el servicio Internet, recepción con series `MOD-DEMO-001` y `MOD-DEMO-002`.
- Dado actor: Administrador de plataforma, autenticado en TEN-001 con las capabilities de su rol
- Cuando Copiar configuración de Internet de TEN-001 a TEN-002.
- Entonces No se copian stock, series ni asignaciones; depósito por defecto queda a mapear.

**CP-STK-8023 — CU-STK-19. Socio consulta su equipo**

- Cubre: CU-STK-19; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Asignaciones: `MOD-DEMO-001` en comodato al contrato INT-100 de Ana Pérez (socio 1001), aplicado el 10/11/2026 por EMP-INS-001; MED-001 instalado en el suministro de agua AG-200 hasta el reemplazo de CU-07.
- Dado actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Abre la app y ve la ONU instalada con su constancia.
- Entonces Solo ve equipos de sus contratos. Alternativo o excepción: Acceso a contrato ajeno ⇒ 404.

**CP-STK-8024 — CU-STK-20. Cierre mensual de stock**

- Cubre: CU-STK-20; M13 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M13 §18.
- Datos de prueba: Usuarios: Encargado de depósito `dep.central@demo`, técnico `EMP-INS-001`, supervisor `sup.campo@demo`, responsable de costos `costos@demo` (todos ficticios).
- Dado actor: Responsable de costos, autenticado en TEN-001 con las capabilities de su rol
- Cuando Checklist sin pendientes; cierra octubre.
- Entonces Período cerrado; movimientos con fecha ≤ 31/10 rechazados. Alternativo o excepción: Reapertura auditada.
