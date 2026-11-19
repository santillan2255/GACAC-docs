# Casos de prueba de aceptación — M04 TAR — Tarifas y motor de cálculo

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M04-TAR-tarifas-motor-calculo.md`](../../especificacion/anexos/M04-TAR-tarifas-motor-calculo.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 122 CP de requisitos funcionales, 39 CP de escenarios ESC y 15 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M04 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Versiones de cuadros tarifarios, aprobación y trazabilidad normativa (M04 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TAR-0001 | RF-TAR-001; M04 §5.1; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Crear una versión tarifaria en borrador con código, nombre (por mes o por norma, ej. "ABRIL 2026", "196/2023 GAS"), alcance (servicios y opcionalmente categorías), vigencia desde/hasta y observaciones. | La versión queda en `draft` con autor y fecha de registro; no afecta cálculos productivos. |
| CP-TAR-0002 | RF-TAR-002; M04 §5.1; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Crear una versión copiando otra (completa o solo ciertos servicios/categorías) y mostrar diferencias contra la origen. | La copia conserva todas las filas, reglas y parámetros; el diff lista altas, bajas y cambios campo a campo con importes antes/después. |
| CP-TAR-0003 | RF-TAR-003; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Impedir solapamiento de vigencias para un mismo alcance (servicio+categoría) entre versiones publicadas; permitir versiones futuras programadas. | Publicar una versión que se superpone con otra del mismo alcance se rechaza con error `TAR-E-SCH-OVERLAP`, salvo que sea su sucesora y cierre automáticamente la anterior el día previo. |
| CP-TAR-0004 | RF-TAR-004; M04 §5.1; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). | Una versión de un servicio marcado "regulado" no puede enviarse a aprobación sin al menos una norma con PDF. |
| CP-TAR-0005 | RF-TAR-005; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Circuito de aprobación con **doble firma**: quien carga envía y otro usuario aprueba; tercera firma opcional por parámetro. | El aprobador no puede ser el creador ni quien envió; la versión aprobada registra ambos usuarios, fechas y comentario. |
| CP-TAR-0006 | RF-TAR-006; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Exigir una simulación adjunta (individual o masiva según PRM-TAR-005) antes de enviar a aprobación. | El botón "Enviar" está deshabilitado sin simulación vigente (posterior al último cambio). |
| CP-TAR-0007 | RF-TAR-007; M04 §5.1; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Publicar la versión de forma íntegra (todas sus dependencias: conceptos con imputación contable, alícuotas, tributos referenciados en M06, categorías existentes en M02) o no publicar nada. | Si falta una dependencia la publicación se detiene con la lista de faltantes; no queda una versión parcialmente visible. |
| CP-TAR-0008 | RF-TAR-008; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Una versión publicada es **inmutable**; correcciones posteriores solo mediante nueva revisión (si no fue usada en comprobantes emitidos) o nueva versión. | Ningún endpoint permite editar una versión `published`/`active`; el intento devuelve 409. |
| CP-TAR-0009 | RF-TAR-009; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Registrar fecha efectiva y fecha de registro en cada versión y cambio; permitir vigencia retroactiva con motivo y aprobación específica. | Una versión cargada el 15 con vigencia el 1 muestra ambas fechas y la marca "retroactiva"; dispara RF-TAR-110. |
| CP-TAR-0010 | RF-TAR-010; M04 §5.1; PRO-O4-05 | O4 | Núcleo | integración | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Activar automáticamente las versiones programadas al inicio de su vigencia en la zona horaria del tenant y cerrar la anterior. | Job `tar:activar-versiones` a las 00:00 locales; idempotente. |
| CP-TAR-0011 | RF-TAR-011; M04 §5.1; PRO-O4-05 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Rechazar una versión con motivo obligatorio (vuelve a borrador) y anular una versión nunca usada. | Anular una versión referenciada por un cálculo emitido devuelve 409. |
| CP-TAR-0012 | RF-TAR-012; M04 §5.1; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. | Columnas y filtros según PAN-TAR-01. |
| CP-TAR-0013 | RF-TAR-013; M04 §5.1; PRO-O4-05 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Imprimir/exportar una versión (PDF y XLSX) con todos sus precios, reglas y normas. | El PDF incluye hash de la versión y firmas. |
| CP-TAR-0014 | RF-TAR-014; M04 §5.1; PRO-O4-05 | O4 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Publicar opcionalmente el cuadro vigente en la landing y el portal (por servicio/categoría), con vigencia y norma. | Solo se publican precios marcados `publicVisible`; no se exponen costos internos ni columnas de subsidio. |
| CP-TAR-0015 | RF-TAR-015; M04 §5.1; PRO-O4-05 | O4 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Importar precios desde Excel (ExcelImportWizard: subir → preview con errores → confirmar) sobre una versión en borrador. | Filas con errores no se aplican; el preview muestra antes/después. |
| CP-TAR-0016 | RF-TAR-016; M04 §5.1; PRO-O4-05 | O4 | Estándar | regla | TEN-001 con Redondeo: Política global tipo 2, múltiplo 10. | Actualización masiva de precios en borrador por porcentaje o importe, con filtros por servicio, categoría, columna de precio y tipo de fila. | Aplica redondeo explícito del precio a 6 decimales (o el configurado) y muestra el diff. |
| CP-TAR-0017 | RF-TAR-017; M04 §5.1; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Actualizar precios de una categoría con los de otra (elegir columnas `unitPrice`, `costMem`, `costTne`, `costPist`, `costSubsidy`, `costPrice`; opcionalmente demanda) emparejando filas **por clave** (tramo, escalón, tipo de energía… | Si las claves no coinciden se muestra la lista de filas sin par en lugar de fallar con "inconsistencia". |
| CP-TAR-0018 | RF-TAR-018; M04 §5.1; PRO-O4-05 | O4 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Clonar una categoría (nombre con prefijo "(Copia) ") con sus filas, y reemplazar todas las filas de una categoría por copia de otra. | La copia es una nueva categoría-precio en la misma versión borrador; la categoría estructural la crea M02. |
| CP-TAR-0019 | RF-TAR-019; M04 §5.1; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Circuito de cambio tarifario: resolución del regulador → versión nueva con vigencia → simulación → aprobación → aplicación en la próxima facturación, con prorrateo automático para períodos que cruzan la vigencia. | El primer lote posterior usa la nueva versión y prorratea según la configuración del servicio. |
### 1.2 Precios y parámetros de cálculo por versión (M04 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TAR-0020 | RF-TAR-020; M04 §5.2; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Definir por versión y servicio los parámetros de cálculo: tipo de cálculo (17 estrategias), concepto de cargo fijo por defecto, moneda, período en días, cargo fijo por días, proporcional alta/baja, mes vencido, facturar sin consumo… | Cada parámetro tiene tipo, default y validación; cambiarlo exige nueva versión. |
| CP-TAR-0021 | RF-TAR-021; M04 §5.2; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Definir por versión y categoría: cargo fijo (importe, cantidad, concepto, cobrar en pendiente de conexión/baja), consumo mínimo (unidades, precio, concepto, cobrar en baja), factura mínima, factor por días, base de selección de tramo… | La categoría-precio solo puede referenciar una categoría existente en M02 para el servicio. |
| CP-TAR-0022 | RF-TAR-022; M04 §5.2; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Editor de filas de tarifa (grilla) con tramo, escalón, precio unitario (6 decimales), precio diurno/nocturno, precio de costo, columnas de costo y subsidio, cargo fijo por tramo, tipo de energía, concepto/banda, franja, concepto de recargo… | Validaciones: escalones contiguos y sin huecos dentro de cada tramo; tramos sin solapamiento; al menos una fila por categoría medida. |
| CP-TAR-0023 | RF-TAR-023; M04 §5.2; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Ordenar filas por código de concepto opcionalmente en la configuración del servicio. | PRM-TAR-103 cambia el orden de visualización, no el de cálculo. |
| CP-TAR-0024 | RF-TAR-024; M04 §5.2; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Tarifas de adherentes por versión: servicio, categoría (0 = cualquiera), descripción, precio, edad desde/hasta, vínculo, ocupación, franquicia de N adherentes no cobrados. | Una tarifa sin filtros es la menos específica. |
| CP-TAR-0025 | RF-TAR-025; M04 §5.2; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Coeficientes por categoría y fecha (hasta 4) para cuotas de obra y ajustes. | Se toma el último coeficiente con fecha ≤ fin del período. |
| CP-TAR-0026 | RF-TAR-026; M04 §5.2; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. | Factores de corrección de gas por período (mes/año), servicio y categoría (o general), con presión y temperatura. | Sin factor para el período, el cálculo del servicio devuelve `TAR-E-GAS-FACTOR`. |
| CP-TAR-0027 | RF-TAR-027; M04 §5.2; PRO-O4-05 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Precios de productos y conceptos por versión (precio de venta, costo, moneda, "incluye IVA") con vigencia. | El cálculo de un renglón de producto toma el precio de la versión vigente a la fecha de referencia. |
| CP-TAR-0028 | RF-TAR-028; M04 §5.2; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Propiedades de servicio con mínimos y cargo fijo propios (tensión u otras) que reemplazan los de la categoría cuando se asignan al contrato. | Si el contrato tiene propiedad con `fixedChargeAmount`, prevalece sobre la categoría. |
| CP-TAR-0029 | RF-TAR-029; M04 §5.2; PRO-O4-05 | O4 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Cargos por evento (conexión, reconexión, instalación, visita, cambio de medidor, transferencia) por servicio, categoría, localidad, clase, referencia, operación técnica y propiedad, con cantidad, importe editable o tope, y bonificaciones… | Un cargo de reconexión/suspensión solo se habilita con fundamento cargado (BASE §52.3); nunca existe "cargo por solicitar la baja". |
| CP-TAR-0030 | RF-TAR-030; M04 §5.2; PRO-O4-05 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. | Se convierten en `chargeRules` de tipo porcentaje/importe sin fórmula. |
| CP-TAR-0031 | RF-TAR-031; M04 §5.2; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Planes de cuotas de obra por contrato (cuotas totales, pagadas, unidades por cuota, totales, facturadas) con avance confirmado al emitir. | El avance de cuotas solo cambia con `fac.invoice.issued`; anular la factura lo revierte. |
### 1.3 Motor de cálculo (M04 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TAR-0032 | RF-TAR-032; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Redondeo: Política global tipo 2, múltiplo 10. | Motor declarativo por **pipeline de pasos** configurables (sección 9.2) con estrategias por tipo de cálculo, sin `switch` monolítico. | Cada paso tiene entrada/salida tipada y se puede desactivar por servicio. |
| CP-TAR-0033 | RF-TAR-033; M04 §5.3; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Facturar P × Q con precio unitario y cantidad, unidades y fuente identificables. | Cada renglón muestra cantidad, unidad, precio, fuente de la cantidad y versión. |
| CP-TAR-0034 | RF-TAR-034; RN-TAR-046; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Telefonía: Plan PLAN-DEMO, bandas Normal/Reducida, tarifas por clave local/interurbana/móvil ficticias. | Servicios de importe fijo (abonos), telefonía móvil y pack SMS con proporcional de alta/baja. | Abono de ARS 30.000 con alta el día 16 de un mes de 30 días en mes vencido = ARS 14.000 (fórmula 1 − 16/30) y ARS 15.000 con PRM-TAR-068 (día de alta incluido); ver RN-TAR-046. |
| CP-TAR-0035 | RF-TAR-035; M04 §5.3; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Servicios por cantidad (tarifa por bloque o tramas sobre la cantidad contratada). | Cantidad 3 a ARS 1.000 = ARS 3.000. |
| CP-TAR-0036 | RF-TAR-036; RN-TAR-018; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Cargo fijo con condición del servicio, una vez por período, concepto, cantidad, moneda, por días, por tramo, proporcional, multicategoría y prorrateo por versión. | Ver RN-TAR-018 a 025. |
| CP-TAR-0037 | RF-TAR-037; M04 §5.3; PRO-O7-06 | O7 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Tarifa medida por bloque (tipos 1, 4) y por tramos y escalones progresivos (tipos 2, 3) con factor por días, escalones negativos y medidor testigo. | Ver ejemplo numérico de 9.3. |
| CP-TAR-0038 | RF-TAR-038; M04 §5.3; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Consumo mínimo con prorrateo por versión. | 8 m³ con mínimo 10 m³ a ARS 400 genera renglón de 2 × ARS 400. |
| CP-TAR-0039 | RF-TAR-039; M04 §5.3; PRO-O4-06 | O4 | Estándar | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Bonificación de unidades por contrato y primer abono bonificado. | Renglón informativo "Bonificación de N unidades" a precio 0 (salvo gas). |
| CP-TAR-0040 | RF-TAR-040; M04 §5.3; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. | Gas: corrección por factor calórico, presión, temperatura, coeficiente corrector y redondeo configurable; unidades bonificadas a precio de costo. | Se guardan volumen medido, factores y cantidad resultante por separado (BASE §89). |
| CP-TAR-0041 | RF-TAR-041; RN-TAR-043; M04 §5.3; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Prepaga: escalón con el consumo del mes acumulado, recargo por cambio de tramo, sin prorrateo. | Ver RN-TAR-043. |
| CP-TAR-0042 | RF-TAR-042; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Prorrateo entre versiones dentro del período (métodos consumo, consumo continuando la trama, precio unitario; hasta tres versiones) también para cargo fijo, mínimo y demanda. | Cada renglón guarda las fracciones; suma de fracciones = 1 con 6 decimales. |
| CP-TAR-0043 | RF-TAR-043; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Prorrateo por días por alta, baja, suspensión, reactivación y cambio de plan dentro del período, en mes vencido y adelantado. | Casos de fin de mes, bisiesto y cambio a mitad de período producen resultados aprobados (sección 17). |
| CP-TAR-0044 | RF-TAR-044; M04 §5.3; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Grandes consumos: energía por concepto y banda con 5 modalidades de tramo, 17 modalidades de demanda, actualización de demanda contratada y factor de potencia con 5 métodos. | Estrategias registradas y seleccionables por categoría. |
| CP-TAR-0045 | RF-TAR-045; M04 §5.3; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Energía inyectada (usuario-generador): neteo, crédito valorizado y tratamiento del saldo negativo; ~~modelo de balance neto Ley 27.424~~ compensación monetaria Ley 27.424 por defecto y balance neto como opción del régimen (DEC-060… | CU-MER-01 reproduce la liquidación con el régimen configurado (monetario por defecto). |
| CP-TAR-0046 | RF-TAR-046; M04 §5.3; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Consumo de otro servicio (ej. cloaca sobre agua) y división de consumos por período/secuencia. | Las lecturas se toman del servicio relacionado según PRM-TAR-060/061. |
| CP-TAR-0047 | RF-TAR-047; RN-TAR-078; M04 §5.3; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Servicios con adherentes (5 variantes) con categoría automática por cantidad, tarifa por adherente por edad/vínculo/ocupación y franquicia. | Ver RN-TAR-078 a 081. |
| CP-TAR-0048 | RF-TAR-048; M04 §5.3; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Agua según inmueble (TBM × coeficiente zonal × coeficiente de actualización + cuota mínima × factor). | Constantes parametrizadas (PRM-TAR-070/071). |
| CP-TAR-0049 | RF-TAR-049; M04 §5.3; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Cuotas de obras: pavimento, alumbrado (con ajuste por inflación), cloaca, agua y vivienda. | La última cuota ajusta saldo; plan agotado no factura. |
| CP-TAR-0050 | RF-TAR-050; RN-TAR-082; M04 §5.3; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Telefonía: Plan PLAN-DEMO, bandas Normal/Reducida, tarifas por clave local/interurbana/móvil ficticias. | Telefonía: facturación de llamadas tasadas (suma de netos), CPP e internacionales con conceptos propios. | Ver RN-TAR-082 a 100. |
| CP-TAR-0051 | RF-TAR-051; M04 §5.3; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Cargos extraordinarios precargados del período (o sin período) por contrato. | Se toman una sola vez; quedan marcados al emitir. |
| CP-TAR-0052 | RF-TAR-052; M04 §5.3; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Cargo por atraso en la devolución de productos prestados (días × precio de atraso). | Solo si PRM-TAR-030 tiene concepto. |
| CP-TAR-0053 | RF-TAR-053; RN-TAR-156; M04 §5.3; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. | Franqueo una vez por período y secuencia, con exención por factura electrónica. | Ver RN-TAR-156. |
| CP-TAR-0054 | RF-TAR-054; RN-TAR-157; M04 §5.3; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Propuesta de aplicación de anticipos (invocando a M07) por tipo de comprobante y porcentaje. | Ver RN-TAR-157/158. |
| CP-TAR-0055 | RF-TAR-055; RN-TAR-159; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Redondeo: Política global tipo 2, múltiplo 10. | Redondeo de renglones y del total (simple, con arrastre, decimales pares, múltiplos) por tipo de comprobante o global, con exclusión por cuenta. | Ver RN-TAR-159 a 164. |
| CP-TAR-0056 | RF-TAR-056; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Invocar a M06 para IVA (doble tasa), percepción de IVA (mínimo, sobre neto o neto+IVA, exclusión por cuenta), IIBB (base mínima, padrón, sobre IVA) y entregar alícuota resuelta en cascada por renglón. | El motor no contiene porcentajes fiscales. |
| CP-TAR-0057 | RF-TAR-057; RN-CAT-076; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Tributos de terceros (tasas municipales, fondos provinciales, ej. Decreto 2298/00, RG 27/2015, alumbrado público) como reglas de tipo impuesto vinculadas al catálogo aprobado de M06. | Una regla de tipo impuesto sin tributo de M06 aprobado no puede publicarse. Alumbrado público: antes de publicar una regla `tasa_alumbrado` sobre un contrato ELE se aplica la validación recíproca de RN-CAT-076 de M02 (HUE-ALU-02; error `CAT_ALU_DOUBLE_CHARGE`, criterio PRM-CAT-111): si el contrato ELE o su suministro tiene un contrato accesorio ALU (tipo 6) activo en la misma vigencia, la publicación se rechaza con la lista de contratos en conflicto; el criterio (regla sobre ELE o contrato ALU) se elige por tenant en M02. |
| CP-TAR-0058 | RF-TAR-058; M04 §5.3; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Grupo y regla: GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`). | Motor **puro**: no muta contratos, medidores, planes, saldos ni contadores; devuelve `proposedEffects` que M05 confirma al emitir. | Ejecutar 10 simulaciones seguidas no cambia ningún documento fuera de `simulationRuns`. |
| CP-TAR-0059 | RF-TAR-059; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Socios/cuentas: Personas ficticias (sin datos de la DEMO de ProCoop). | Errores de negocio tipados y no bloqueantes por servicio/cuenta (catálogo 9.11); el lote continúa con las demás cuentas. | Un lote de 10.000 cuentas con 3 errores produce 9.997 cálculos y 3 errores con código y contexto. |
| CP-TAR-0060 | RF-TAR-060; M04 §5.3; PRO-O4-06 | O4 | Núcleo | integración | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Determinismo e idempotencia: el cálculo guarda `inputHash` y `resultHash`; recalcular con las mismas entradas da el mismo hash. | Prueba de regresión de hashes en CI. |
| CP-TAR-0061 | RF-TAR-061; M04 §5.3; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Rendimiento masivo: calcular lotes grandes con precarga por lotes (data loaders) y paralelismo por cuenta. | Objetivo de referencia (validar en T08): 50.000 contratos medidos en ≤ 30 minutos con 4 workers. |
| CP-TAR-0062 | RF-TAR-062; M04 §5.3; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Grupo y regla: GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`). | Tipo de comprobante forzado por categoría y separación en comprobante aparte por regla (grupo de factura / grupo cero). | El motor informa a M05 el grupo; M05 arma el comprobante. |
| CP-TAR-0063 | RF-TAR-063; M04 §5.3; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Indicar a M05 cuando el total resulta negativo para que lo convierta en nota de crédito o genere el crédito por inyectada. | El cálculo lleva `resultSign = negative`. |
### 1.4 Reglas declarativas, fórmulas y beneficios (M04 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TAR-0064 | RF-TAR-064; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Reglas con identidad, ámbito, jurisdicción y respaldo, vigencia, condiciones, base, operación, compatibilidad, efectos y evidencia. | Todos los elementos existen en `chargeRules`; los obligatorios se validan por tipo de regla. |
| CP-TAR-0065 | RF-TAR-065; M04 §5.4; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Fases de evaluación por servicio y sobre el comprobante, con orden explícito. | El orden visible coincide con el aplicado. |
| CP-TAR-0066 | RF-TAR-066; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Acciones: cargo (renglón), recargo/descuento porcentual sobre renglones afectados, impuesto con base imponible, recargo proporcional distribuido por alícuota (fase comprobante), bonificación, precio sustituto, cantidad bonificada. | Cada acción produce renglones explicables. |
| CP-TAR-0067 | RF-TAR-067; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Reglas declarativas **sin fórmula** (porcentaje, importe fijo, escala, bloque, mínimo, máximo, umbral) sobre una base seleccionada por etiquetas de renglón. | CU-TAR-02 se configura sin escribir fórmulas. |
| CP-TAR-0068 | RF-TAR-068; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. | Ninguna fórmula puede acceder a red, disco, base de datos ni objetos globales; prueba de seguridad en sección 17. |
| CP-TAR-0069 | RF-TAR-069; M04 §5.4; PRO-O4-06 | O4 | Núcleo | integración | TEN-001 con Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. | Editor de fórmulas con autocompletado de variables y funciones, validación sintáctica y de tipos, árbol de tablas de ayuda (servicios, categorías, ocupaciones, productos, localidades, referencias, actividades ARCA, clases, situaciones IVA… | El editor muestra el valor de cada sub-expresión en el caso de prueba. |
| CP-TAR-0070 | RF-TAR-070; M04 §5.4; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Asistente IA que propone fórmulas o reglas desde lenguaje natural; solo propone, el usuario valida y prueba. | Ninguna propuesta se guarda sin validación y prueba. |
| CP-TAR-0071 | RF-TAR-071; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Grupo y regla: GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`). | Compatibilidad: prioridad, acumulación, exclusión mutua por grupo, topes (máximo de beneficio por renglón/servicio/comprobante) y resolución explícita de conflictos (nunca silenciosa). | Dos reglas excluyentes con igual prioridad bloquean la publicación con `TAR-E-RULE-CONFLICT`. |
| CP-TAR-0072 | RF-TAR-072; M04 §5.4; PRO-O4-06 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Filtros de aplicación: tipo de comprobante, servicio, una vez por cuenta en el lote, emisión en comprobante aparte. | Una regla con filtros de tipo de comprobante y servicio solo se aplica a comprobantes que cumplen ambos; con "una vez por cuenta en el lote" se aplica una sola vez aunque la cuenta tenga varios contratos del lote; con "emisión en comprobante aparte" el cargo sale en un comprobante distinto del principal. (criterio agregado el 05-11-2026) |
| CP-TAR-0073 | RF-TAR-073; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Origen del beneficio obligatorio en toda regla que reduce importes: subsidio público, tarifa social, bonificación comercial, compensación a recuperar, promoción; con quien lo financia. | Reportes separan cada origen. |
| CP-TAR-0074 | RF-TAR-074; M04 §5.4; PRO-O7-06 | O7 | Núcleo | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Beneficios sobre una parte de la cantidad o del precio (bloque elegible, componente), sin extenderlos al total. | El ejemplo de subsidio por bloque (BASE §51) da ARS 6.000 de reducción y ARS 19.000 neto. |
| CP-TAR-0075 | RF-TAR-075; M04 §5.4; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. | CU-TAR-02: socio incluido ARS 10.000, no incluido ARS 13.000. |
| CP-TAR-0076 | RF-TAR-076; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Reglas por plan comercial del servicio. | Dos contratos del mismo servicio y categoría con planes comerciales distintos reciben, en el mismo cálculo, solo las reglas asociadas a su plan; una regla sin plan se aplica a ambos. (criterio agregado el 05-11-2026) |
| CP-TAR-0077 | RF-TAR-077; M04 §5.4; PRO-O7-06 | O7 | Núcleo | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Personas subsidiadas y bonificadas: diferenciar beneficio por suministro/ubicación de condición general de la persona. | Una inscripción de persona no se extiende a todos sus suministros salvo regla explícita. |
| CP-TAR-0078 | RF-TAR-078; M04 §5.4; PRO-O7-06 | O7 | Núcleo | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Regímenes de subsidio versionados (componente, bloques, porcentajes, cronograma, categorías con y sin subsidio). | Cambiar porcentajes por prórroga = nueva versión del régimen, sin tocar código. |
| CP-TAR-0079 | RF-TAR-079; M04 §5.4; PRO-O7-06 | O7 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Importar padrones de beneficiarios (Excel/TXT) por NIS, DNI/CUIT o cuenta, con validación, preview, coincidencias, no coincidencias y duplicados. | Ver PAN-TAR-12. |
| CP-TAR-0080 | RF-TAR-080; M04 §5.4; PRO-O7-06 | O7 | Núcleo | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Recategorizar contratos según padrón (con tope de consumo opcional) o inscribirlos al régimen como beneficio; restablecer la categoría anterior. | La recategorización es un cambio de contrato en M02 propuesto por TAR y aprobado. |
| CP-TAR-0081 | RF-TAR-081; M04 §5.4; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Exportar la rendición de lo bonificado/subsidiado y archivos de compensación (ERSeP 166, 296, 617, gas natural, RASE, compensación de subsidio). | Formatos definidos en T06. |
| CP-TAR-0082 | RF-TAR-082; M04 §5.4; PRO-O4-06 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. | Promoción 50 % × 3 ciclos sobre abono no descuenta instalación. |
| CP-TAR-0083 | RF-TAR-083; M04 §5.4; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Asignar promoción al contrato guardando la foto de sus condiciones; no aplicar silenciosamente una oferta nueva a contratos previos. | Cambiar la promoción no altera asignaciones existentes. |
| CP-TAR-0084 | RF-TAR-084; M04 §5.4; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Contar ciclos consumidos al emitir, finalizar automáticamente y volver al importe contractual vigente, con aviso al socio. | Aviso vía T09 N días antes (PRM-TAR-013). |
| CP-TAR-0085 | RF-TAR-085; M04 §5.4; PRO-O4-06 | O4 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Excepciones individuales autorizadas (ajuste comercial con expediente) con motivo, aprobación y vigencia. | Requiere `tar.excepciones.aprobar`. |
| CP-TAR-0086 | RF-TAR-086; M04 §5.4; PRO-O4-06 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Catálogo de conceptos de cargo aprobado: no se habilita un cargo extra sin fundamento, servicio, jurisdicción y documento permitido; no trasladar tributos propios ni productos ajenos. | Validación al publicar. |
| CP-TAR-0087 | RF-TAR-087; M04 §5.4; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Funciones a medida del tenant definidas como expresiones GFL con nombre (reemplazo de procedimientos almacenados `FORMULA_CARGO_*`). | Una función a medida es versionada y testeada como una regla. |
### 1.5 Explicabilidad, simulación, retroactivos, telefonía, reportes y migración (M04 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TAR-0088 | RF-TAR-088; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Cada renglón guarda: tipo, concepto, descripción, cantidad, unidad, precio unitario, importe, moneda/cotización, versión (id, revisión, hash), categoría-precio, fila de tarifa, tramo y escalón, fracción y método de prorrateo, factor por… | Ningún renglón persistido carece de `trace`. |
| CP-TAR-0089 | RF-TAR-089; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Vista "Cómo se calculó" para el operador: árbol de pasos del pipeline, renglones y su traza, enlaces a versión, norma y consumos. | Desde la factura (M05) se abre en un clic. |
| CP-TAR-0090 | RF-TAR-090; M04 §5.5; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Vista simplificada para el socio en la PWA: precio, cantidad, tramos, beneficios y su vencimiento, tributos. | No se muestran costos internos ni fórmulas. |
| CP-TAR-0091 | RF-TAR-091; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Reproducir un cálculo histórico con su versión y entradas originales y comparar hash. | La reproducción de una factura de hace 2 años da el mismo `resultHash`. |
| CP-TAR-0092 | RF-TAR-092; M04 §5.5; PRO-O4-07 | O4 | Núcleo | funcional | TEN-001 con Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. | Simulador individual: contrato real o ficticio, período, consumo real o simulado, versión vigente u otra. | CU-06 da ARS 13.000. |
| CP-TAR-0093 | RF-TAR-093; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Simulador masivo comparativo: universo por filtros, versión A vs B, período, consumos reales del período o de referencia; resultados por contrato y agregados por servicio, categoría, grupo, zona; distribución de variaciones; exportación. | El total por versión y la variación porcentual se calculan con la fórmula de 15.x. |
| CP-TAR-0094 | RF-TAR-094; M04 §5.5; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con Redondeo: Política global tipo 2, múltiplo 10. | Simulación de prepaga (importe → unidades y unidades → importe) y de promociones por ciclos (primero, intermedio, posterior al fin). | El simulador convierte un importe de recarga prepaga en unidades y unidades en importe con el cuadro vigente, ida y vuelta sin diferencia mayor al redondeo configurado; una promoción por ciclos muestra el descuento correcto en el primer ciclo, en uno intermedio y ninguno en el ciclo posterior al fin. (criterio agregado el 05-11-2026) |
| CP-TAR-0095 | RF-TAR-095; M04 §5.5; PRO-O4-07 | O4 | Núcleo | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Las simulaciones nunca persisten efectos y se marcan como tales. | Después de una simulación individual o masiva no cambia ningún saldo, consumo de promoción, cargo ni comprobante; los resultados quedan en `simulationRuns`/`simulationResults` marcados como simulación y no aparecen en el lote de M05. (criterio agregado el 05-11-2026) |
| CP-TAR-0096 | RF-TAR-096; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Cálculo de diferencias por cambio retroactivo de versión o de entradas (corrección de consumo) sobre liquidaciones emitidas: simular, aprobar y entregar a M05 los ajustes (ND/NC) sin reescribir el original. | Obligación de ARS 12.000 recalculada en ARS 15.000 genera propuesta de ajuste de ARS 3.000. |
| CP-TAR-0097 | RF-TAR-097; M04 §5.5; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Telefonía: Plan PLAN-DEMO, bandas Normal/Reducida, tarifas por clave local/interurbana/móvil ficticias. | Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada, central… | Grilla de bandas valida cortes horarios iguales por día. |
| CP-TAR-0098 | RF-TAR-098; M04 §5.5; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Tasar llamadas importadas por M10 y retasar las no facturadas conservando versión anterior. | Retasar no cambia el id de la llamada (CTR-TAR-24). |
| CP-TAR-0099 | RF-TAR-099; M04 §5.5; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Simulador de tasación de una llamada suelta con plan y clave opcionales, usando la línea vigente a la fecha simulada. | Tasar una llamada de duración, clave y tipo dados devuelve importe, banda, fracciones y plan aplicado según la versión de tasación vigente a la fecha simulada; sin plan indicado usa el del contrato y no registra la llamada. (criterio agregado el 05-11-2026) |
| CP-TAR-0100 | RF-TAR-100; M04 §5.5; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Informes: consumo y neto por tramo/escalón y versión, agregado tarifario por fila y versión (usuarios, cuentas, facturas), evolución de conceptos entre períodos, impacto de cambio tarifario, beneficios por origen, promociones activas y por… | Sección 15. |
| CP-TAR-0101 | RF-TAR-101; M04 §5.5; PRO-O7-11 | O7 | Núcleo | migración | TEN-001 con Socios/cuentas: Personas ficticias (sin datos de la DEMO de ProCoop). | Migrar cuadros históricos de ProCoop (`CUADROS` + `HIS_*` + tablas vivas) como versiones publicadas con vigencias reconstruidas. | Sección 19. |
| CP-TAR-0102 | RF-TAR-102; M04 §5.5; PRO-O7-11 | O7 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Traducir fórmulas DevExpress de `CARGOS_ADICIONALES`/`HIS_CARGOS_ADICIONALES` a GFL con reporte de traducción y pruebas de equivalencia en paralelo. | Cada fórmula queda "traducida", "traducida con advertencias" o "requiere revisión manual". |
| CP-TAR-0103 | RF-TAR-103; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Parámetros de cálculo tipados por plataforma/tenant/servicio/categoría con defaults documentados, separando campos sobrecargados. | `TRAMA_DEC` se separa en `tierBasis` y `largeCustomerEnergyMode`. |
| CP-TAR-0104 | RF-TAR-104; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Abono de Internet por plan desde la **activación efectiva**, con primer período según modalidad anticipada/vencida y prorrateo por días. | Activación el 20/11 en mes adelantado: primer comprobante con 11/30 de noviembre + diciembre completo (según PRM-TAR-012). |
| CP-TAR-0105 | RF-TAR-105; M04 §5.5; PRO-O4-07 | O4 | Núcleo | funcional | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Instalación como cargo de una sola vez disparado por el hito autorizado (instalación efectiva/activación); no se repite mensualmente ni se duplica con su financiación. | Si se eligió financiar, el cargo de contado no se genera. |
| CP-TAR-0106 | RF-TAR-106; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Cambio de plan dentro del período con prorrateo de ambos planes y tratamiento explícito de la promoción vigente. | Explicación con los dos tramos de días. |
| CP-TAR-0107 | RF-TAR-107; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Bloquear el cálculo cuando no hay versión vigente o hay dos versiones incompatibles para el mismo caso. | Error `TAR-E-SCH-NONE` / `TAR-E-SCH-AMBIGUOUS`. |
| CP-TAR-0108 | RF-TAR-108; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Checklist de habilitación tarifaria por servicio antes de facturar en producción (ámbito, prestaciones, tarifas, beneficios, tributos, cargos, bajas, documentos, responsables). | Un servicio sin checklist aprobado no puede entrar en un lote productivo. |
| CP-TAR-0109 | RF-TAR-109; M04 §5.5; PRO-O7-06 | O7 | Núcleo | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Separar compra de energía y costos de operación de la tarifa al usuario; no convertir costos en recargos. | Las columnas de costo no generan renglones salvo regla explícita aprobada. |
| CP-TAR-0110 | RF-TAR-110; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Detectar automáticamente, al publicar una versión retroactiva, las liquidaciones pendientes (recalcular) y emitidas (proponer diferencias). | Job `tar:diferencias-retroactivas`. |
| CP-TAR-0111 | RF-TAR-111; M04 §5.5; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Recalcular masivamente bonificaciones de unidades por contrato (tabla de trabajo) con preview. | Cambios aplicados como modificación de contrato en M02. |
| CP-TAR-0112 | RF-TAR-112; M04 §5.5; PRO-O4-07 | O4 | Núcleo | regla | TEN-001 con Redondeo: Política global tipo 2, múltiplo 10. | Configurar políticas de redondeo (tipo, decimales, conceptos) referenciables por tipos de comprobante de M05 y como política global. | Una política de redondeo configurada (tipo, decimales y conceptos) se aplica al total de un comprobante cuyo tipo la referencia; un tipo de comprobante sin política propia usa la global; el importe de redondeo se imputa al concepto configurado. (criterio agregado el 05-11-2026) |
| CP-TAR-0113 | RF-TAR-113; M04 §5.5; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Medición de tráfico de Internet solo genera cargos si existe fuente definida y regla aprobada; un abono por velocidad no convierte cada GB en cargo. | Con fuente de medición de tráfico definida y regla aprobada, el consumo de GB genera cargo según la regla; sin fuente o sin regla aprobada no se genera cargo por GB y el abono por velocidad se factura igual. (criterio agregado el 05-11-2026) |
| CP-TAR-0114 | RF-TAR-114; M04 §5.5; PRO-O7-06 | O7 | Estándar | funcional | TEN-001 con Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de… | Contratos especiales de grandes usuarios con precio, potencia, plazo y penalidades propios, versionados, con revisión previa obligatoria por importe. | Liquidaciones sobre PRM-TAR-014 requieren aprobación antes de emitir. |
| CP-TAR-0115 | RF-TAR-115; RN-MOR-101; M04 §5.5; PRO-O3-03 | O3 | Estándar | integración | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Cargo por evento "equipo no devuelto" (ONT, decodificador u otro equipo en comodato): concepto y regla de precio por modelo o tipo de equipo en `eventCharges` (disparador `equipment_not_returned`), plazo de devolución parametrizable… | Con PRM-TAR-169 apagado, EVT-STK-07 no produce cotización ni cargo. Encendido y con regla aprobada, una ONT vencida a los 15 días de la baja genera una cotización; recién con EVT-STK-08 aprobado se crea un único ítem en `billableItems` de M05 vía `fac.service.upsertBillableItem` (`sourceModule = TAR`, `sourceType = equipmentNotReturned`, `sourceRef.id = assignmentId`, idempotente; antes ~~`preloadedCharges` con `origin = equipment_not_returned`~~, CTR-DAT-38); si el equipo se devuelve antes de facturar, el cargo se cancela. |
| CP-TAR-0116 | RF-TAR-116; M04 §5.5; PRO-O7-06 | O7 | Estándar | integración | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Crear el plan de cuotas de obra (`worksInstallmentPlans`) de cada beneficiario al consumir `tec.levy.approved` (EVT-TEC-25): un plan por obra + inmueble/contrato beneficiario con importe, cuotas, unidades por cuota y unidades totales… | Reprocesar el mismo evento no duplica planes (clave `workId + premiseId`); 20 beneficiarios ⇒ 20 planes; el plan no factura hasta tener contrato vinculado y estado `active`. |
| CP-TAR-0117 | RF-TAR-117; M04 §5.5; PRO-O10-05 | O10 | Estándar | integración | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Estrategia "cargo fijo por derecho" (perfil Derecho de sepultura): (a) adquisición del derecho con precio de la versión tarifaria, al contado o financiada en cuotas reutilizando el plan de cuotas de RF-TAR-031 (`worksInstallmentPlans` con… | Derecho de ARS 240.000 (ficticio) en 24 cuotas ⇒ 24 renglones de ARS 10.000 "Cuota n/24" sin repetirse; el mantenimiento se cobra en cada período aunque el plan esté agotado; un acto realizado genera un solo cargo (idempotente por `actId`). |
| CP-TAR-0118 | RF-TAR-118; M04 §5.5; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de… | Regla "cargo por evento de traslado" alimentada por `soc.trip.completed` (EVT-SOC-07): importe por km × tarifa, importe fijo o precio de viaje corto (hasta N km), recargo o tarifa por característica del viaje, tratamiento cubierto / no… | Traslado no cubierto de 12 km a ARS 900/km (ficticio) ⇒ ARS 10.800; viaje de 3 km con viaje corto hasta 5 km a ARS 2.500 ⇒ ARS 2.500; cubierto con coseguro 10 % ⇒ ARS 1.080; no asociado ⇒ precio de la lista de no asociados; el mismo `tripId` no se cobra dos veces. |
| CP-TAR-0119 | RF-TAR-119; M04 §5.5; PRO-O7-06 | O7 | Estándar | seguridad | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Exponer en solo lectura el plan de cuotas de obra (y de adquisición de derecho) de un contrato para el portal (M19, bloque "Plan de cuotas de obra" de PAN-POR-30) y atención: obra, cuota actual n/N, cuotas facturadas, saldo en importe y en… | El socio ve solo planes de sus cuentas autorizadas (404 si no); los valores coinciden con el último cálculo emitido; la API no permite escribir. |
| CP-TAR-0120 | RF-TAR-120; RN-TAR-082; M04 §5.5; PRO-O10-09 | O10 | Estándar | seguridad | TEN-001 con Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. | Exponer en solo lectura, por contrato y período, la tasación de las llamadas atribuidas por M10 (importe tasado, clave, tipo de llamada, banda, plan, fracciones, descuento o gratuidad aplicados y versión de tasación vigente) para el… | Para el período 10/2026 de un contrato telefónico la suma de importes devuelta coincide con el renglón de facturación telefónica del cálculo emitido (RN-TAR-082); las llamadas retasadas devuelven solo la versión vigente; un contrato ajeno responde 404. |
| CP-TAR-0121 | RF-TAR-121; RN-TAR-250; M04 §5.5; PRO-O7-06 | O7 | Estándar | regla | TEN-001 con Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón… | Base de cálculo según el régimen de medición del contrato: al consumir `cat.contract.meteringRegimeChanged` (EVT-CAT-28) el motor toma, desde `effectiveAt`, la estrategia de cantidad por consumo (`metered`) o por cuota fija (`unmetered`) y… | Ver RN-TAR-250 y ESC-TAR-36. |
| CP-TAR-0122 | RF-TAR-122; RN-TAR-251; M04 §5.5; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por… | Correo electrónico y pack SMS como servicios con cupo (DEC-084): cargo fijo del plan más exceso sobre el cupo incluido, con el consumo del período informado por el aprovisionamiento (T06) y registrado por M10 (RF-TEC-195); sin consumo… | Ver RN-TAR-251 y ESC-TAR-39. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-TAR-5001 — ESC-TAR-01. CU-06 agua**

- Cubre: ESC-TAR-01; relacionados: CU-06; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado TAR-AG-2026-11; CF 3.000; 20 m³ × 500
- Cuando CU-06 agua
- Entonces Neto ARS 13.000,00; traza con versión, fila y cantidad; sin efectos fuera de TAR.

**CP-TAR-5002 — ESC-TAR-02. CU-TAR-02 grupo**

- Cubre: ESC-TAR-02; relacionados: CU-TAR-02; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Grupo y regla: GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`).
- Dado GR-BON-DEMO, BON-VAR-30
- Cuando CU-TAR-02 grupo
- Entonces Incluido ARS 10.000,00 (bonificación −3.000 solo sobre variable); no incluido ARS 13.000,00.

**CP-TAR-5003 — ESC-TAR-03. CU-PRO-01 / piloto Internet**

- Cubre: ESC-TAR-03; relacionados: CU-PRO-01; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Ejemplo 9.3.9 con el *seed* de M02 §18 (abono ARS 15.000, instalación ARS 20.000, PROMO-INT-50x3)
- Cuando CU-PRO-01 / piloto Internet
- Entonces Primer comprobante ARS 30.000,00; ciclos 1–3 con 50 %; cuarto sin promoción (ARS 15.000); instalación una sola vez; financiada ⇒ sin renglón de contado. (Antes: "Primer comprobante ARS 60.000,00; ciclos 1–3 con 10 %", con valores BASE — reemplazado por HUE-SRV-05.).

**CP-TAR-5004 — ESC-TAR-04. Bloque vs tramos**

- Cubre: ESC-TAR-04; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.1
- Cuando Bloque vs tramos
- Entonces ARS 3.750,00 y ARS 2.950,00.

**CP-TAR-5005 — ESC-TAR-05. Factor por días**

- Cubre: ESC-TAR-05; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de ejemplo (tope 0,95, método tangente, K 1,5).
- Dado Ejemplo 9.3.2
- Cuando Factor por días
- Entonces ARS 2.700,00 (tramos); bloque 5.625,00 (`scale_quantity`) y 3.000,00 (`scale_limits`).

**CP-TAR-5006 — ESC-TAR-06. Prorrateo métodos 1, 2 y 3**

- Cubre: ESC-TAR-06; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.3
- Cuando Prorrateo métodos 1, 2 y 3
- Entonces 3.097,50 / 3.115,00 / 3.097,50; tres versiones soportadas; cuatro ⇒ error.

**CP-TAR-5007 — ESC-TAR-07. Proporcional y calendario**

- Cubre: ESC-TAR-07; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.4; febrero bisiesto (29 días) con alta el 15
- Cuando Proporcional y calendario
- Entonces Importes del ejemplo; en febrero 2028 se usan 29 días; independiente de la hora del servidor.

**CP-TAR-5008 — ESC-TAR-08. Factor de potencia**

- Cubre: ESC-TAR-08; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de ejemplo (tope 0,95, método tangente, K 1,5).
- Dado Ejemplo 9.3.6
- Cuando Factor de potencia
- Entonces Recargo ARS 209.677,42 con método y tope en la traza; sin reactiva ⇒ sin renglón.

**CP-TAR-5009 — ESC-TAR-09. Agua por inmueble**

- Cubre: ESC-TAR-09; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado TBM 1.000, zonal 0,9, coef2 1,1, cuota2 500
- Cuando Agua por inmueble
- Entonces Red2(1.000 × 0,9 × 1,1 + 500 × 0,7) = ARS 1.340,00; TBM 0 ⇒ `TAR-E-WATER-TBM`.

**CP-TAR-5010 — ESC-TAR-10. Gas Gas**

- Cubre: ESC-TAR-10; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.5
- Cuando Gas
- Entonces 100 m³ tramados; factor faltante ⇒ `TAR-E-GAS-FACTOR` y cuenta excluida, lote continúa.

**CP-TAR-5011 — ESC-TAR-11. CU-MER-01**

- Cubre: ESC-TAR-11; relacionados: CU-MER-01; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión AG-NOMED-DEMO: Agua no medida por inmueble: TBM y coeficientes ficticios del ESC-TAR-09.
- Dado Demanda 300 kWh, inyección 120 kWh (ficticios)
- Cuando CU-MER-01
- Entonces Dos operaciones separadas con su IVA; si el comprobante queda negativo, crédito registrado (modo MER-001) o anticipo (modo compatibilidad).

**CP-TAR-5012 — ESC-TAR-12. Redondeo con arrastre**

- Cubre: ESC-TAR-12; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.7
- Cuando Redondeo con arrastre
- Entonces Renglones +6,40 y −4,23; total 13.460,00; arrastre confirmado solo al emitir; anulación lo revierte.

**CP-TAR-5013 — ESC-TAR-13. Regla con referencia**

- Cubre: ESC-TAR-13; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado Ejemplo 9.3.8
- Cuando Regla con referencia
- Entonces 212,50 y −106,25; cambiar el código de `tasa_alumbrado` en borrador actualiza la referencia.

**CP-TAR-5014 — ESC-TAR-14. "Una vez por cuenta en el lote"**

- Cubre: ESC-TAR-14; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Dos comprobantes de la misma cuenta
- Cuando "Una vez por cuenta en el lote"
- Entonces Se aplica en el primero; en el segundo se saltea solo esa regla y las posteriores se aplican.

**CP-TAR-5015 — ESC-TAR-15. Error de fórmula**

- Cubre: ESC-TAR-15; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado División por cero en una regla
- Cuando Error de fórmula
- Entonces Cuenta excluida con `TAR-E-FORMULA` (regla, campo, valores); lote continúa; con > PRM-TAR-113 % de errores el lote se detiene.

**CP-TAR-5016 — ESC-TAR-16. Seguridad del sandbox**

- Cubre: ESC-TAR-16; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Fórmulas con `constructor`, `__proto__`, `process`, `eval(`, `Function(`, `require(`, cadenas de 1 MB, recursión profunda, bucles por referencias
- Cuando Seguridad del sandbox
- Entonces Rechazadas en compilación o cortadas por límites; ninguna ejecuta código ni accede a datos fuera del contexto; tiempo acotado.

**CP-TAR-5017 — ESC-TAR-17. Determinismo**

- Cubre: ESC-TAR-17; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Reproducir 1.000 cálculos emitidos
- Cuando Determinismo
- Entonces Mismo `resultHash` en todos; explicación idéntica al comprobante.

**CP-TAR-5018 — ESC-TAR-18. Inmutabilidad**

- Cubre: ESC-TAR-18; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Intento de editar una versión `active` o una regla publicada
- Cuando Inmutabilidad
- Entonces 409 con `TAR-E-IMMUTABLE`; solo se puede copiar a borrador.

**CP-TAR-5019 — ESC-TAR-19. Doble firma**

- Cubre: ESC-TAR-19; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Autor intenta aprobar su envío; mismo aprobador firma dos veces
- Cuando Doble firma
- Entonces Rechazo; la segunda firma del mismo usuario no cuenta.

**CP-TAR-5020 — ESC-TAR-20. Permisos negativos**

- Cubre: ESC-TAR-20; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Usuario sin `tar.cuadros.publicar` llama API-TAR-012; atención intenta simulación masiva; socio pide explicación de factura ajena
- Cuando Permisos negativos
- Entonces 403 en todos; auditoría del intento.

**CP-TAR-5021 — ESC-TAR-21. Aislamiento de tenant**

- Cubre: ESC-TAR-21; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Tenant A consulta versión, regla, simulación o cálculo de tenant B por ID
- Cuando Aislamiento de tenant
- Entonces 404 (no revela existencia); índices y plugin impiden consultas sin `tenantId`; funciones GFL no ven datos de otro tenant.

**CP-TAR-5022 — ESC-TAR-22. ESC-02 (corrección posterior a la emisión)**

- Cubre: ESC-TAR-22; relacionados: ESC-02; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Versión corregida con vigencia pasada
- Cuando ESC-02 (corrección posterior a la emisión)
- Entonces Diferencias simuladas, aprobación con documentación, comprobante original intacto, ajuste por NC/ND.

**CP-TAR-5023 — ESC-TAR-23. ESC-05 (cambio en período parcialmente procesado)**

- Cubre: ESC-TAR-23; relacionados: ESC-05; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300.
- Dado Publicación de versión mientras un lote está a mitad
- Cuando ESC-05 (cambio en período parcialmente procesado)
- Entonces Las cuentas ya calculadas conservan su versión; las pendientes usan la nueva solo si su fecha de referencia lo indica; reejecutar no reescribe documentos ni promociones.

**CP-TAR-5024 — ESC-TAR-24. Reintentos e idempotencia**

- Cubre: ESC-TAR-24; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Socios/cuentas: Personas ficticias (sin datos de la DEMO de ProCoop).
- Dado Caída del worker en mitad de lote; doble `fac.invoice.issued`
- Cuando Reintentos e idempotencia
- Entonces Reanuda solo cuentas pendientes; efectos confirmados una sola vez.

**CP-TAR-5025 — ESC-TAR-25. Conflicto de reglas**

- Cubre: ESC-TAR-25; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Dos descuentos excluyentes con igual prioridad
- Cuando Conflicto de reglas
- Entonces `TAR-E-RULE-CONFLICT`; no se elige uno en silencio.

**CP-TAR-5026 — ESC-TAR-26. Baja sin cargo**

- Cubre: ESC-TAR-26; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Intentar crear cargo con disparador "solicitud de baja"
- Cuando Baja sin cargo
- Entonces Rechazo de validación (Ley 24.240); se liquidan solo prestaciones devengadas hasta la baja.

**CP-TAR-5027 — ESC-TAR-27. Paralelo con ProCoop**

- Cubre: ESC-TAR-27; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Lote migrado de una cooperativa piloto
- Cuando Paralelo con ProCoop
- Entonces Diferencias = 0 o clasificadas como corrección conocida (`TAR-W-CORRECTION-KNOWN`) con la duda que la origina.

**CP-TAR-5028 — ESC-TAR-28. Tasación**

- Cubre: ESC-TAR-28; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Llamada de 23:50 a 00:20 cruzando banda y día; feriado
- Cuando Tasación
- Entonces Dos tramos de banda; el feriado usa bandas de domingo; fracciones según plan.

**CP-TAR-5029 — ESC-TAR-29. Conciliación**

- Cubre: ESC-TAR-29; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Σ renglones de cálculos `issued` del lote vs Σ comprobantes de M05
- Cuando Conciliación
- Entonces Igualdad exacta por concepto y alícuota.

**CP-TAR-5030 — ESC-TAR-30. Rendimiento**

- Cubre: ESC-TAR-30; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Socios/cuentas: Personas ficticias (sin datos de la DEMO de ProCoop).
- Dado Lote de 50.000 cuentas con 2 servicios y 10 reglas
- Cuando Rendimiento
- Entonces ≤ 2 s por cuenta p95; escalado horizontal por workers (T08).

**CP-TAR-5031 — ESC-TAR-31. Equipo no devuelto (HUE-INT-01)**

- Cubre: ESC-TAR-31; RN-TAR-246; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión ELE-DEMO-2026-11: Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de ejemplo (tope 0,95, método tangente, K 1,5).
- Dado ONT-DEMO-0003 de un contrato INT-100 dado de baja; PRM-CAT-094 = 15 días; (a) PRM-TAR-169 = `false`; (b) `true` con regla aprobada
- Cuando Equipo no devuelto (HUE-INT-01)
- Entonces (a) EVT-STK-07 sin efecto; (b) cotización, y con EVT-STK-08 aprobado un único cargo precargado `equipment_not_returned`; devolución antes de facturar ⇒ cargo `cancelled` (RN-TAR-246).

**CP-TAR-5032 — ESC-TAR-32. Cloaca sin agua (HUE-CLO-02)**

- Cubre: ESC-TAR-32; RN-TAR-247; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Cuenta con CLO configurada sobre AG cuyo contrato AG está dado de baja
- Cuando Cloaca sin agua (HUE-CLO-02)
- Entonces Esa cuenta termina con `TAR-E-RELATED-MISSING` y se excluye; las demás cuentas del lote se calculan (RN-TAR-247).

**CP-TAR-5033 — ESC-TAR-33. Obra aprobada (HUECO-OBR-01)**

- Cubre: ESC-TAR-33; RF-TAR-116, RF-TAR-119; M04 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado `tec.levy.approved` de la obra OBR-DEMO-01 con 3 beneficiarios, uno sin contrato tipo 17
- Cuando Obra aprobada (HUECO-OBR-01)
- Entonces 2 planes `active` y 1 `pendingContract`; reprocesar el evento no duplica; al activarse el contrato faltante el plan pasa a `active`; API-TAR-066 muestra "Cuota 0/12" y saldo total (RF-TAR-116, RF-TAR-119).

**CP-TAR-5034 — ESC-TAR-34. Derecho de sepultura (HUECO-CEM-01)**

- Cubre: ESC-TAR-34; RN-TAR-248; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300.
- Dado Derecho ARS 240.000 en 24 cuotas, mantenimiento anual ARS 18.000 y una inhumación (valores ficticios)
- Cuando Derecho de sepultura (HUECO-CEM-01)
- Entonces Renglones "Cuota n/24" de ARS 10.000; mantenimiento en el período anual; un solo cargo por `actId` (RN-TAR-248).

**CP-TAR-5035 — ESC-TAR-35. Traslado (HUECO-SAL-01)**

- Cubre: ESC-TAR-35; RN-TAR-249; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Viaje no cubierto de 12 km a ARS 900/km; viaje de 3 km con viaje corto ≤ 5 km a ARS 2.500; viaje cubierto con coseguro 10 %; no asociado
- Cuando Traslado (HUECO-SAL-01)
- Entonces ARS 10.800; ARS 2.500; ARS 1.080; precio de la lista de no asociados; el mismo `tripId` no se cobra dos veces (RN-TAR-249).

**CP-TAR-5036 — ESC-TAR-36. Cambio de régimen de medición (HUE-AG-03)**

- Cubre: ESC-TAR-36; RN-TAR-250; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón de ejemplo de 10 filas con DNI ficticios.
- Dado Contrato AG con cuota fija ARS 9.000; EVT-CAT-28 a `metered` con `effectiveAt` 16/11/2026; primera lectura válida el 20/11/2026 con 6 m³ hasta fin de mes (valores ficticios)
- Cuando Cambio de régimen de medición (HUE-AG-03)
- Entonces Noviembre: cuota fija por los días hasta el 19/11 y consumo de 6 m³ desde la lectura del 20/11, en dos renglones con su fracción en la traza; reprocesar el evento no cambia el cálculo (RN-TAR-250).

**CP-TAR-5037 — ESC-TAR-37. Detalle de llamadas en el portal (HUE-TEL-02)**

- Cubre: ESC-TAR-37; RF-TAR-120; M04 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado Contrato telefónico con 40 llamadas tasadas en 10/2026, 2 retasadas
- Cuando Detalle de llamadas en el portal (HUE-TEL-02)
- Entonces API-TAR-067 devuelve 40 tasaciones (versión vigente de las retasadas) cuyo total coincide con el renglón telefónico emitido (RF-TAR-120).

**CP-TAR-5038 — ESC-TAR-38. Corrección de gas en M04 (DEC-085)**

- Cubre: ESC-TAR-38; RN-TAR-035; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300.
- Dado M03 entrega 100 m³ medidos y `gasCorrectionCoefficient` 1; factor del período: presión 1,02, temperatura 0,98, calórico 9.300, óptimo 9.300 (valores ficticios)
- Cuando Corrección de gas en M04 (DEC-085)
- Entonces Volumen corregido 99,96, cantidad redondeada 100 m³; la traza guarda medido, factores y resultado; sin factor del período ⇒ `TAR-E-GAS-FACTOR` y la cuenta se excluye (RN-TAR-035).

**CP-TAR-5039 — ESC-TAR-39. Pack SMS con exceso (DEC-084)**

- Cubre: ESC-TAR-39; RN-TAR-251; M04 §17
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado Plan con cupo 200 SMS, cargo fijo ARS 5.000 y exceso ARS 20 por SMS (valores ficticios); el período informa 260 SMS
- Cuando Pack SMS con exceso (DEC-084)
- Entonces Renglones: cargo fijo ARS 5.000 y exceso 60 × ARS 20 = ARS 1.200; sin consumo informado ⇒ solo el cargo fijo con `TAR-W-QUOTA-USAGE-MISSING` y el exceso en el período siguiente (RN-TAR-251).

## 3. Casos por caso de uso (CU)

**CP-TAR-8001 — CU-06. Cálculo tarifario de agua**

- Cubre: CU-06; RF-TAR-001; RN-TAR-199; relacionados: ESC-TAR-01; M04 §16.1
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado actor: Analista comercial autorizado, autenticado en TEN-001 con las capabilities de su rol
- Cuando Selecciona TAR-AG-2026-11; cargo fijo ARS 3.000 + 20 m³ × ARS 500 ⇒ ARS 13.000 explicado y asociado a la versión, sin emisión ni cobro.
- Entonces Si no hay versión vigente o hay dos incompatibles ⇒ bloqueo `TAR-E-SCH-NONE` / `TAR-E-SCH-AMBIGUOUS` y revisión.

**CP-TAR-8002 — CU-TAR-02. Bonificación comercial por grupo**

- Cubre: CU-TAR-02; RN-TAR-201; relacionados: ESC-TAR-02; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Grupo y regla: GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`).
- Dado actor: Responsable de tarifas y aprobador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Crea grupo GR-BON-DEMO con vigencia; regla BON-VAR-30 (30 % sobre el variable, no sobre el fijo); simula socio incluido (ARS 10.000) y no incluido (ARS 13.000).
- Entonces Bonificación comercial ≠ subsidio estatal (`funding = cooperative`); conflicto de reglas no se resuelve en silencio.

**CP-TAR-8003 — CU-PRO-01. Fibra hogar con instalación y promoción (definición en M02 §16, anexo dueño según PA-CAT-20; aquí la parte tarifaria)**

- Cubre: CU-PRO-01; RN-TAR-222; relacionados: ESC-TAR-03; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado actor: Responsable comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando Plan con instalación única, abono y promoción; condiciones guardadas al contratar; financiación de la instalación genera un solo cronograma (M08) y anula el contado; simula ciclos con bonificación y el primero sin ella; al cumplirse la duración vuelve al importe vigente explicado.
- Entonces Ciclos parciales y cambio de plan con criterio explícito; no se cobra costo interno sin concepto habilitado.

**CP-TAR-8004 — CU-ESP-ELE. Suministro eléctrico (definición en M02 §16, anexo dueño; aquí la parte tarifaria)**

- Cubre: CU-ESP-ELE; RN-TAR-101; relacionados: ESC-TAR-08; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón de ejemplo de 10 filas con DNI ficticios.
- Dado actor: Técnica / facturación, autenticado en TEN-001 con las capabilities de su rol
- Cuando Liquida con la versión aplicable; electrodependencia como régimen con regla específica y evidencia.
- Entonces No equiparar kWh con kW; no aplicar tarifa mayorista; no extender beneficio sin revisar alcance.

**CP-TAR-8005 — CU-ESP-AG. Agua medida y no medida (definición en M02 §16, anexo dueño; aquí la parte tarifaria)**

- Cubre: CU-ESP-AG; RN-TAR-076; relacionados: ESC-TAR-09; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado actor: Facturación, autenticado en TEN-001 con las capabilities de su rol
- Cuando Medido con lectura observada queda pendiente (M03); no medido liquida por regla aprobada sin medidor ficticio.
- Entonces Bloques/franquicias solo si el régimen los prevé; no precargar precios reales.

**CP-TAR-8006 — CU-ESP-GAS. Gas por red (definición en M02 §16, anexo dueño; aquí la parte tarifaria)**

- Cubre: CU-ESP-GAS; RN-TAR-035; relacionados: ESC-TAR-10; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión AG-NOMED-DEMO: Agua no medida por inmueble: TBM y coeficientes ficticios del ESC-TAR-09.
- Dado actor: Técnica / facturación, autenticado en TEN-001 con las capabilities de su rol
- Cuando El ciclo conserva lectura, correcciones (factores) y versión utilizada.
- Entonces No fijar coeficientes físicos; gas natural ≠ propano ≠ envasado.

**CP-TAR-8007 — CU-MER-01. Usuario-generador (definición en M03 §16, anexo dueño; aquí la parte tarifaria)**

- Cubre: CU-MER-01; RN-TAR-038; relacionados: ESC-TAR-11; M04 §16.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Régimen de subsidio: SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón de ejemplo de 10 filas con DNI ficticios.
- Dado actor: Facturación, autenticado en TEN-001 con las capabilities de su rol
- Cuando Demanda 300 kWh con tarifa del suministro; inyección 120 kWh con tarifa de inyección; si el valor inyectado supera lo que paga, el saldo queda como crédito.
- Entonces Valores ficticios; régimen aplicable.

**CP-TAR-8008 — CU-TAR-03. Actualizar precios de un cuadro por norma**

- Cubre: CU-TAR-03; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado actor: Responsable de tarifas, aprobadores, autenticado en TEN-001 con las capabilities de su rol
- Cuando Copiar versión vigente → actualización masiva +12 % en energía → adjuntar resolución PDF → simulación masiva → enviar → dos firmas → publicar con `validFrom` futura → activación automática.
- Entonces Se completa «Actualizar precios de un cuadro por norma» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Simulación faltante ⇒ no se puede enviar; aprobador = autor ⇒ rechazo; vigencia superpuesta ⇒ `TAR-E-SCH-OVERLAP`.

**CP-TAR-8009 — CU-TAR-04. Crear una regla con fórmula**

- Cubre: CU-TAR-04; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Reglas de ejemplo: `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante.
- Dado actor: Responsable de tarifas, autenticado en TEN-001 con las capabilities de su rol
- Cuando Alta de regla `tasa_alumbrado` con fórmula GFL → compila → prueba con 5 contratos reales → guarda caso de prueba → envía con su versión.
- Entonces Se completa «Crear una regla con fórmula» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Fórmula con función fuera de fase, referencia a regla posterior o ciclo ⇒ error de compilación; regla de comprobante con servicio ⇒ rechazo.

**CP-TAR-8010 — CU-TAR-05. Explicar una factura al socio**

- Cubre: CU-TAR-05; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado actor: Socio / atención, autenticado en TEN-001 con las capabilities de su rol
- Cuando Abre el detalle en PWA → ve cargo fijo, tramos, beneficios con origen, promoción ciclo X/N, tributos y norma.
- Entonces Se completa «Explicar una factura al socio» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Comprobante anulado ⇒ se muestra con la anulación.

**CP-TAR-8011 — CU-TAR-06. Importar padrón de tarifa social**

- Cubre: CU-TAR-06; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Socios/cuentas: Personas ficticias (sin datos de la DEMO de ProCoop).
- Dado actor: Responsable de beneficios, autenticado en TEN-001 con las capabilities de su rol
- Cuando Sube archivo → validación (altas/bajas/conflictos) → confirma → inscripciones con fecha efectiva → próximo cálculo aplica el beneficio por componente.
- Entonces Se completa «Importar padrón de tarifa social» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Persona con varias cuentas ⇒ conflicto a resolver; fila sin cruce ⇒ informe.

**CP-TAR-8012 — CU-TAR-07. Liquidar un período que cruza dos versiones**

- Cubre: CU-TAR-07; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión GAS-RED-DEMO: Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300.
- Dado actor: Motor / facturación, autenticado en TEN-001 con las capabilities de su rol
- Cuando Lecturas 01/10–31/10, versión nueva desde 16/10 ⇒ prorrateo por días con renglones por versión y fracción en la traza.
- Entonces Se completa «Liquidar un período que cruza dos versiones» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Más de 3 versiones ⇒ `TAR-E-PRORATION-TOO-MANY`.

**CP-TAR-8013 — CU-TAR-08. Corregir una tarifa con vigencia pasada**

- Cubre: CU-TAR-08; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Versión TAR-AG-2026-11 (agua medida): Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo.
- Dado actor: Responsable de tarifas, aprobadores, autenticado en TEN-001 con las capabilities de su rol
- Cuando Publica versión retroactiva → job de diferencias → revisión → aprobación → pedidos de NC/ND a M05.
- Entonces Se completa «Corregir una tarifa con vigencia pasada» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Diferencia bajo umbral ⇒ sin ajuste; rechazo ⇒ sin efectos.

**CP-TAR-8014 — CU-TAR-09. Tasar llamadas**

- Cubre: CU-TAR-09; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Telefonía: Plan PLAN-DEMO, bandas Normal/Reducida, tarifas por clave local/interurbana/móvil ficticias.
- Dado actor: Motor / técnica, autenticado en TEN-001 con las capabilities de su rol
- Cuando M10 importa CDR → TAR tasa por bandas y planes → resultado con traza → facturación telefónica suma netos.
- Entonces Se completa «Tasar llamadas» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Sin prefijo ⇒ "Clave de llamada no encontrada"; sin asignación de banda ⇒ error.

**CP-TAR-8015 — CU-TAR-10. Migrar cuadros y fórmulas de ProCoop**

- Cubre: CU-TAR-10; M04 §16.2
- Ola: O4 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M04 §18.
- Datos de prueba: Plan INT-100 (piloto Internet): Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y…
- Dado actor: Equipo de migración, autenticado en TEN-001 con las capabilities de su rol
- Cuando JOB-TAR-07 reconstruye versiones; JOB-TAR-08 traduce fórmulas; corrida en paralelo clasifica diferencias.
- Entonces Se completa «Migrar cuadros y fórmulas de ProCoop» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: Fórmulas `failed` o procedimientos sin inventario ⇒ bloquean publicación del servicio.
