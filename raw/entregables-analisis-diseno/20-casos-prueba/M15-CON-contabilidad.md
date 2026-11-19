# Casos de prueba de aceptación — M15 CON — Contabilidad, centros de costo, múltiples planes de cuentas, escenarios simulados y presupuestos

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M15-CON-contabilidad.md`](../../especificacion/anexos/M15-CON-contabilidad.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 162 CP de requisitos funcionales, 31 CP de escenarios ESC y 21 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M15 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Configuración general (M15 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0001 | RF-CON-001; M15 §5.1; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Configuración contable por tenant: plan operativo vigente, moneda funcional ARS, zona horaria, formato de numeración de asientos, decimales de porcentajes de centros, activación de centros de costo (general o solo sueldos), tolerancia de… | La configuración se publica versionada (T04) y cada asiento registra la versión aplicada. |
| CP-CON-0002 | RF-CON-002; M15 §5.1; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Modo de contabilización por módulo de origen: **tiempo real** (un asiento por operación al recibir el evento), **resumen diario** o **resumen por rango** (los eventos quedan en bandeja y un lote los agrega), sin que ningún evento pueda… | Con modo resumen diario, 1.000 facturas del día generan un asiento por servicio y concepto vinculado a los 1.000 eventos; reprocesar el día no duplica. |
| CP-CON-0003 | RF-CON-003; M15 §5.1; PRO-O5-10 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (`FEC_CON`), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. | Cambiar la base solo afecta eventos no contabilizados y queda auditado. |
| CP-CON-0004 | RF-CON-004; M15 §5.1; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Roles de cuenta tipados por plan (cuentas por defecto del motor) que reemplazan los parámetros-cuenta P513, P2101–P2167 y P3141, más roles nuevos de GoodApps (§14.2). | Cada rol apunta a una cuenta imputable del plan; un rol sin cuenta aparece en el validador. |
| CP-CON-0005 | RF-CON-005; M15 §5.1; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Validador de salud de la configuración contable ("cuentas sin asignar"): lista cada rol, regla, entidad o combinación de dimensiones sin cuenta resoluble, con el enlace a la pantalla donde se configura; corre a demanda, al publicar… | Un servicio nuevo sin cuenta de ingresos aparece en el validador antes de su primera factura. |
| CP-CON-0006 | RF-CON-006; M15 §5.1; PRO-O5-10 | O5 | Estándar | seguridad | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | La publicación de configuración de un servicio, concepto, impuesto, medio de pago, banco, caja o grupo contable nuevo advierte (o bloquea, según política) si no tiene regla de imputación resuelta en el plan operativo. | Copiar Internet a otro tenant sin equivalencia contable detiene la publicación con el detalle faltante. |
### 1.2 Planes de cuentas y cuentas (M15 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0007 | RF-CON-007; M15 §5.2; PRO-O5-10 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. | Se crea PC-OPER-01 en O5; en O8 se copia a PC-ALT-01 conservando estructura. |
| CP-CON-0008 | RF-CON-008; M15 §5.2; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Propósito del plan: operativo, alternativo, simulación, regulatorio o externo. | Un plan alternativo no puede recibir asientos oficiales. |
| CP-CON-0009 | RF-CON-009; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Estados del plan: borrador, aprobado, operativo, alternativo, archivado; un único plan operativo por ejercicio. | Intentar marcar dos planes operativos para el mismo ejercicio se rechaza. |
| CP-CON-0010 | RF-CON-010; M15 §5.2; PRO-O5-10 | O5 | Núcleo | migración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Árbol jerárquico de cuentas con código, nombre, nivel, cuenta padre y máscara de código configurable por plan (ej. `1.1.01.01.001` o el formato de 11 dígitos de ProCoop 6+5 con prefijos de 5, 3 y 1). | El árbol se arma por `parentId`; la máscara solo valida el formato visible. |
| CP-CON-0011 | RF-CON-011; M15 §5.2; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuenta imputable o agrupadora; solo las imputables reciben renglones. | Un renglón contra una agrupadora se rechaza. |
| CP-CON-0012 | RF-CON-012; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Naturaleza explícita de cada cuenta (activo, pasivo, patrimonio neto, ingresos, egresos, orden deudora, orden acreedora) y saldo normal, en lugar de prefijos. | El cierre de ejercicio y los estados usan `nature`, no el primer dígito. |
| CP-CON-0013 | RF-CON-013; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Rubro y subrubro contable por cuenta para la exposición en estados contables. | El ESP agrupa por rubro (ej. "Créditos por servicios"). |
| CP-CON-0014 | RF-CON-014; M15 §5.2; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Atributo "ajustable por inflación" (partida no monetaria) por cuenta. | Solo las cuentas ajustables entran en la corrida de ajuste. |
| CP-CON-0015 | RF-CON-015; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Política de centro de costo por cuenta: prohibido, opcional u obligatorio; centros habilitados por cuenta; distribución por defecto de la cuenta. | Un renglón de una cuenta con centro obligatorio sin distribución se rechaza; un centro no habilitado para la cuenta se rechaza. |
| CP-CON-0016 | RF-CON-016; M15 §5.2; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Subcuenta o código auxiliar visible y dígito verificador opcional. | La columna subcuenta se muestra si la configuración lo indica. |
| CP-CON-0017 | RF-CON-017; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Vigencia de la cuenta; inactivación sin borrado si tiene movimientos; borrado físico solo sin movimientos ni referencias. | Una cuenta con movimientos solo puede inactivarse. |
| CP-CON-0018 | RF-CON-018; M15 §5.2; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Moneda de la cuenta (ARS por defecto; otra para bancos o deudas en moneda extranjera) con reexpresión a ARS. | Un renglón en USD guarda moneda, cotización e importe en ARS. |
| CP-CON-0019 | RF-CON-019; M15 §5.2; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Mapeo de cada cuenta a líneas de las plantillas de estados contables (INAES/RT) y, cuando corresponda, a categorías INAES. | Ninguna cuenta imputable con saldo queda fuera del ESP o ER; se informa en el control previo. |
| CP-CON-0020 | RF-CON-020; M15 §5.2; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Renumerar una cuenta (cambiar su código visible) conservando identidad, historial y referencias. | Tras renumerar, roles, reglas y movimientos siguen apuntando a la cuenta (por id) y el historial muestra código anterior y nuevo. |
| CP-CON-0021 | RF-CON-021; M15 §5.2; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Unificar cuentas: fusionar una cuenta origen en una destino del mismo plan y naturaleza; las referencias de configuración pasan a la destino; los movimientos de períodos abiertos se reclasifican con asiento; los de períodos cerrados se… | Después de unificar, el mayor de la destino incluye los movimientos de la origen con marca de procedencia y la origen queda inactiva. |
| CP-CON-0022 | RF-CON-022; M15 §5.2; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Visualizar el plan en árbol o lista, imprimir y exportar. | Exportación XLSX/PDF con código, nombre, naturaleza, imputable, ajustable, rubro. |
| CP-CON-0023 | RF-CON-023; M15 §5.2; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Importar plan de cuentas desde Excel con el asistente de importación y ofrecer un plan modelo para cooperativas de servicios públicos. | El asistente muestra errores (padre inexistente, código duplicado) antes de confirmar. |
| CP-CON-0024 | RF-CON-024; M15 §5.2; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reasignación masiva de cuentas y rubros: cambiar en bloque el rubro de productos, servicios, impuestos y conceptos de compra, o la cuenta de bancos, roles de cuenta, proveedores y tipos de factura; filtro "sin asignar"; agrupación… | Reasignar 50 proveedores a otra cuenta deja 50 registros de auditoría y no altera asientos ya registrados. |
| CP-CON-0025 | RF-CON-025; M15 §5.2; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuentas de capital social por rubro de capital; un rubro de producto pertenece a un solo rubro de capitalización. | Asignar un rubro a dos rubros de capital se rechaza. |
| CP-CON-0026 | RF-CON-026; M15 §5.2; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuentas de resultado para el cierre: por prefijo o rango de cuentas de resultado, la cuenta de resultados destino, con marca de ganancias/pérdidas; la regla de mayor especificidad (prefijo más largo) gana; si no hay, se usa el rol… | Un ejercicio con ingresos de agua refunde contra "Resultado sección Agua" si así se configuró. |
### 1.3 Ejercicios y períodos (M15 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0027 | RF-CON-027; M15 §5.3; PRO-O5-10 | O5 | Núcleo | migración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | ABM de ejercicios: número, fecha desde, fecha hasta, estado; desde < hasta; número único; sin solapamiento ni contención de otro ejercicio. | Un ejercicio que contiene por completo a otro se rechaza (corrige el defecto de ProCoop). |
| CP-CON-0028 | RF-CON-028; M15 §5.3; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Generación automática de períodos mensuales por ejercicio, incluidos ejercicios irregulares. | Un ejercicio 01-07-2026 a 30-06-2027 genera 12 períodos. |
| CP-CON-0029 | RF-CON-029; M15 §5.3; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Bloqueo por módulo dentro de cada período: comprobantes de venta, facturación, cobranza, compras, bancos, tesorería, financiaciones, viviendas, stock, sueldos, titulares, bienes de uso y contable, reemplazando las fechas de cierre P67… | Con cobranza bloqueada hasta 31-10-2026, un pago con fecha 30-10-2026 se rechaza con el mensaje de período cerrado. |
| CP-CON-0030 | RF-CON-030; M15 §5.3; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Servicio de guarda de período (`periodGuard`) consultado por todos los módulos antes de registrar o modificar una operación con fecha; responde permitido/rechazado y motivo. | Modificar una factura de un período contable cerrado se rechaza aunque facturación esté abierta. |
| CP-CON-0031 | RF-CON-031; M15 §5.3; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cierre mensual de período con lista de control: eventos pendientes de configuración = 0, asientos en borrador = 0, cajas cerradas, conciliaciones sin diferencias no explicadas, amortizaciones y provisiones registradas, ajuste por inflación… | El cierre no se habilita mientras haya un evento pendiente; el sistema lista los bloqueantes. |
| CP-CON-0032 | RF-CON-032; M15 §5.3; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reapertura controlada de período: solicitud con motivo, aprobación (T11), plazo opcional de reapertura, auditoría y recierre. | La reapertura sin aprobación es imposible; queda constancia de quién, cuándo y por qué. |
| CP-CON-0033 | RF-CON-033; M15 §5.3; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Varios ejercicios abiertos a la vez (anterior en cierre y nuevo en curso). | Se registran asientos de enero del ejercicio nuevo mientras se ajusta diciembre del anterior. |
| CP-CON-0034 | RF-CON-034; M15 §5.3; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Ejercicios irregulares (primer ejercicio, cambio de fecha de cierre por asamblea). | Se crea un ejercicio de 6 meses sin error. |
### 1.4 Asientos manuales, personalizados e importados (M15 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0035 | RF-CON-035; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Alta de asiento manual: fecha, descripción, renglones (cuenta, debe, haber, observación), distribución por centro de costo por porcentaje o importe, adjuntos de respaldo y referencia opcional a documento. | Se graba un asiento con adjunto PDF y dos centros 60/40. |
| CP-CON-0036 | RF-CON-036; M15 §5.4; PRO-O5-11 | O5 | Núcleo | migración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Validaciones del asiento: al menos dos renglones, debe = haber exacto, cuentas imputables y vigentes, período y módulo contable abiertos, descripción obligatoria, centros según la política de la cuenta y distribución al 100 %. | Un asiento de un solo renglón se rechaza (ProCoop admite uno). |
| CP-CON-0037 | RF-CON-037; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. | Solo los contabilizados afectan mayores y saldos. |
| CP-CON-0038 | RF-CON-038; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Aprobación de asientos manuales y de ajuste según tipo e importe, con registro de quién grabó, revisó y autorizó. | Un ajuste de ARS 500.000 con umbral ARS 100.000 queda pendiente hasta que otro usuario lo apruebe. |
| CP-CON-0039 | RF-CON-039; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Numeración interna global e inmutable y número visible correlativo por ejercicio; si cambia la fecha a otro ejercicio, cambia el número visible; formato configurable (incluido prefijo de 4 dígitos + correlativo de 4). | El primer asiento del ejercicio 2027 es el 1 aunque existan miles de 2026. |
| CP-CON-0040 | RF-CON-040; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tipos de asiento: manual, automático, ajuste, apertura, refundición de resultados, patrimonial de cierre, ajuste por inflación, importado, reversión, distribución de excedentes, reclasificación. | Filtrar el diario por tipo devuelve solo los de ese tipo. |
| CP-CON-0041 | RF-CON-041; M15 §5.4; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Plantillas de asiento personalizado y recurrente: cuentas o roles, lado, porcentaje o fórmula sobre un importe base, centro, periodicidad y reversión automática; incluye la plantilla de sueldos formato 3 (`SU_ASIENTOS`). | Una plantilla "Devengamiento de seguros" genera cada mes un asiento de ARS 12.000 en borrador. |
| CP-CON-0042 | RF-CON-042; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Copiar asiento, revertir asiento (contraasiento con fecha elegida) y reversión automática el primer día del período siguiente (provisiones). | El contraasiento queda vinculado al original y ambos se ven en el mayor. |
| CP-CON-0043 | RF-CON-043; M15 §5.4; PRO-O5-11 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Compresión de renglones de igual cuenta, centro y lado en asientos resumen. | Un resumen con 300 renglones de la misma cuenta y centro se comprime en uno. |
| CP-CON-0044 | RF-CON-044; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Documentación de origen y adjuntos por asiento, con expediente documental (T11). | El adjunto se descarga con URL firmada y queda auditado el acceso. |
| CP-CON-0045 | RF-CON-045; M15 §5.4; PRO-O5-11 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Importación de asientos desde Excel/CSV, con y sin centros de costo y en modalidad "asiento único", con validación previa de cuentas, balance por asiento, ejercicio abierto, período no bloqueado y numeración por ejercicio. | Un archivo con un asiento desbalanceado no importa ninguno y muestra la fila en error. |
| CP-CON-0046 | RF-CON-046; M15 §5.4; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Anulación masiva de asientos por filtros (rango, origen, lote, módulo), con permiso específico, excluyendo apertura y cierre, validando período abierto y no rubricado, y revirtiendo los efectos dependientes (amortizaciones). | Anular un lote de amortización notifica a STK y los acumulados de los bienes vuelven al valor previo. |
| CP-CON-0047 | RF-CON-047; M15 §5.4; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Renumeración de asientos de un ejercicio por fecha, con apertura primero, cierre al final y luego orden de registro, desde un número inicial o continuando el último, solo para el rango no transcripto a libro rubricado. | Renumerar un rango ya impreso en hojas rubricadas se rechaza. |
| CP-CON-0048 | RF-CON-048; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Consulta del diario con filtros por fecha de asiento o de registro, tipo, origen (automático/manual), módulo, estado, cuenta, centro, usuario, importe y documento; navegación al documento. | Desde un asiento resumen de cobranza se llega a cada recibo incluido. |
| CP-CON-0049 | RF-CON-049; M15 §5.4; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Asientos en moneda extranjera: renglón con moneda, cotización e importe en ARS; diferencias de cambio por eventos de TES. | Un depósito en USD 100 a 1.000 se registra ARS 100.000 con moneda y cotización. |
| CP-CON-0050 | RF-CON-050; M15 §5.4; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Auditoría de altas, modificaciones, aprobaciones, anulaciones y reversiones con antes y después. | La auditoría muestra el renglón modificado de un borrador con usuario y hora. |
### 1.5 Motor de asientos automáticos (M15 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0051 | RF-CON-051; M15 §5.5; PRO-O5-11 | O5 | Núcleo | integración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Recepción de los eventos económicos de todos los módulos vía outbox en una bandeja (`accountingEvents`), idempotente por identificador del evento de origen. | Recibir dos veces el mismo `fac.invoice.issued` crea un solo evento y un solo asiento. |
| CP-CON-0052 | RF-CON-052; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Contrato del evento económico: tipo, documento de origen, fecha contable, moneda, renglones económicos con **rol de importe** (neto, descuento, IVA por alícuota y condición, percepción, retención, impuesto interno, tasa de terceros… | Un evento sin rol de importe válido se rechaza con error de contrato y alerta técnica. |
| CP-CON-0053 | RF-CON-053; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. | Una regla "Ingresos Internet zona Norte" vigente desde 01-11-2026 se aplica solo a eventos con esa fecha o posterior. |
| CP-CON-0054 | RF-CON-054; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Resolución en cascada: cuenta asignada en la entidad (proveedor, banco, alícuota, rubro, tipo de factura, grupo contable, concepto de sueldo, sindicato, obra, tipo de retención, tipo de valor, categoría de movimiento) → regla con más… | En el renglón se ve "regla R-104 (3 coincidencias: servicio, zona, rubro)". |
| CP-CON-0055 | RF-CON-055; M15 §5.5; PRO-O5-11 | O5 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Simulador de reglas: con un evento de ejemplo, mostrar las cuentas y centros resultantes y la ruta de resolución, sin registrar nada. | El contador prueba un cobro con tarjeta y ve las cuentas sin generar asiento. |
| CP-CON-0056 | RF-CON-056; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Asiento por operación o resumen diario/por rango por módulo, con agrupación configurable por cuenta, centro y dimensiones (grupo contable, tipo de comprobante, zona, rubro, servicio). | El resumen de ventas del 03-11-2026 agrupa por servicio y concepto. |
| CP-CON-0057 | RF-CON-057; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Vínculo bidireccional documento ↔ evento ↔ asiento ↔ renglón. | Desde la factura se abre su asiento; desde el renglón resumen, las facturas que lo componen. |
| CP-CON-0058 | RF-CON-058; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reversión automática al anular el documento o evento de origen: contraasiento vinculado en el período del origen si está abierto, o en el período abierto actual con referencia si está cerrado. | Anular una NC del 05-11 genera el contraasiento del 05-11. |
| CP-CON-0059 | RF-CON-059; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Evento sin cuenta resuelta: queda "pendiente de configuración", genera alerta y bloquea el cierre del período, sin bloquear la operación de origen. | Cobrar en un medio nuevo sin cuenta no impide el cobro; el evento aparece en la bandeja de pendientes. |
| CP-CON-0060 | RF-CON-060; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reprocesar eventos pendientes o con error luego de corregir la configuración, de a uno o masivamente. | Tras asignar la cuenta, el reproceso contabiliza los 35 eventos pendientes. |
| CP-CON-0061 | RF-CON-061; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tolerancia de redondeo configurable en asientos automáticos: la diferencia dentro de la tolerancia va al rol de redondeo del módulo; fuera de ella, el evento queda en error. | Una diferencia de ARS 0,01 en un resumen de cobranza va a "Redondeo cierre de caja". |
| CP-CON-0062 | RF-CON-062; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Lote de contabilización (reemplazo del "Cierre automático"): rango de fechas, módulos a incluir (ventas, pagos de otros períodos, cobranzas, tesorería, bancos, financiaciones, compras, stock, capital, sueldos, fabricación, bienes de uso… | Correr el lote dos veces para el mismo día no crea asientos nuevos: informa "0 eventos pendientes". |
| CP-CON-0063 | RF-CON-063; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Previsualización del lote (borrador) con mayor y composición de ventas, stock y ajustes; confirmación o descarte; si mientras tanto se registraron otros asientos, la numeración se recalcula al confirmar. | El contador descarta un lote y los eventos vuelven a pendientes. |
| CP-CON-0064 | RF-CON-064; M15 §5.5; PRO-O5-11 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Aviso de cajas abiertas en el rango y opción de exigir cajas cerradas antes de contabilizar cobranzas en resumen. | Con la opción activa, el lote del día con una caja abierta se detiene y la lista. |
| CP-CON-0065 | RF-CON-065; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Matriz de eventos económicos de todos los módulos con su asiento tipo (§9.1). | Cada evento de la matriz tiene regla por defecto en el plan modelo. |
| CP-CON-0066 | RF-CON-066; M15 §5.5; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Facturación: contabilizar por concepto, servicio, rubro, zona, tipo de factura y grupo contable, con modalidad de deudores configurable (por tipo de factura o por concepto, con o sin IVA separado), opción de no usar grupos contables y… | El asiento de facturación de Agua acredita Ingresos Agua y debita Créditos por servicios – Agua. |
| CP-CON-0067 | RF-CON-067; M15 §5.5; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cobranza: contabilizar por medio de pago, caja, grupo contable, ente y banco, con cuenta transitoria de acreditaciones pendientes y registración separada de comisiones y retenciones sufridas. | El cobro digital de ARS 8.000 acreditado neto 7.840 con comisión 160 cuadra (CU-22). |
| CP-CON-0068 | RF-CON-068; M15 §5.5; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Compras: distribución por centro de costo por ítem, IVA computable por centro (porcentaje de IVA compras de la sección), IVA no tomado como gasto, ítems pendientes de recepción, remitos, obras y retenciones. | Una factura de ARS 121.000 (neto 100.000) imputada 50 % a una sección con 60 % de IVA computable y 50 % a una sección con 100 % registra IVA CF 16.800 y gasto IVA 4.200 (ver CU-CON-05). |
| CP-CON-0069 | RF-CON-069; M15 §5.5; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Pagos a proveedores: medios de pago (efectivo de caja de pagos, valores de terceros, cheques propios, transferencias, VEP, transferencias diferidas), descuentos obtenidos y cuentas puente de pago con devengamiento. | Una OP con cheque propio diferido acredita "Cheques diferidos a pagar" del banco, no el banco. |
| CP-CON-0070 | RF-CON-070; M15 §5.5; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tesorería y bancos: cambio de valores, transferencias entre bancos, ingresos y egresos excepcionales por categoría, rechazo y recupero de valores, quebrantos, presentación y cobro de tarjetas con comisiones, presentación de retenciones… | Un débito bancario sin categoría contable va a "Débitos bancarios sin subcategoría". |
| CP-CON-0071 | RF-CON-071; M15 §5.5; PRO-O3-03 | O3 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Stock: materiales en OT y OM con horas de participantes valuadas, conciliaciones, vales (incluidos los de vivienda con obra por defecto), costo de mercadería vendida, entregas y retiros de comodato, revaluación y altas en orden, con el… | La instalación de un módem en comodato registra el activo en comodato sin gasto (CU-OPE-01). |
| CP-CON-0072 | RF-CON-072; M15 §5.5; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Bienes de uso: alta, amortización por centro de costo del bien, mejoras, disminuciones, bajas, ventas y ajuste por inflación con cuentas de revalúo separadas y valores históricos. | La amortización mensual de un camión 70 % Distribución / 30 % Administración se registra con esa distribución. |
| CP-CON-0073 | RF-CON-073; M15 §5.5; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Sueldos: devengamiento por concepto, centro de costo, servicio y plan, con formatos recibos + contribuciones, por sindicato o personalizado; pago; anticipos; descuento de deuda de servicios. | El asiento de octubre 2026 distribuye costo laboral en Distribución, Administración e Internet (CU-104). |
| CP-CON-0074 | RF-CON-074; M15 §5.5; PRO-O6-07 | O6 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Mora y financiación: intereses y recargos facturados, convenios y refinanciaciones con intereses e IVA a devengar por cuota, previsión y castigo de incobrables, prescripción de deuda, recuperos. | Un convenio de ARS 30.000 + 3.000 de interés reconoce el interés como ganado solo al vencer cada cuota. |
| CP-CON-0075 | RF-CON-075; M15 §5.5; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Capital social: suscripción al facturar o en la afiliación, integración en el pago, capital a devolver, reembolso, rescate por socios incobrables, transferencias, capitalización de retornos y distribución de excedentes, con M17. | Cobrar ARS 1.000 de cuota social con la factura no aumenta ingresos por servicios. La suscripción, la integración y su conciliación se adelantan a O5 por RF-CON-150, RF-CON-151 y RF-CON-098; el resto queda en O10 por RF-CON-161 (HUECO-CAP-01). |
| CP-CON-0076 | RF-CON-076; M15 §5.5; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Fabricación: productos en proceso con costo de componentes PEPS y productos terminados por proporción de cantidades. | Al finalizar una orden, "Productos en proceso" queda en cero para esa orden. |
| CP-CON-0077 | RF-CON-077; M15 §5.5; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Fiscal: liquidación de IVA (compensación débito/crédito, saldo a pagar o a favor), pago de impuestos, retenciones y percepciones a organismos, rendición de tasas de terceros cobradas. | El pago de ARS 2.000 de retenciones cancela el pasivo (CU-FIS-01). |
| CP-CON-0078 | RF-CON-078; M15 §5.5; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Ventas de productos y ventas financiadas con costo de mercadería vendida e intereses a devengar. | Una venta en 6 cuotas reconoce intereses mes a mes. |
| CP-CON-0079 | RF-CON-079; M15 §5.5; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tesorería financiera: préstamos recibidos, plazos fijos, intereses y gastos financieros, diferencias de cambio. | Un plazo fijo registra el interés devengado al vencimiento. |
| CP-CON-0080 | RF-CON-080; M15 §5.5; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Asientos de ajuste de cierre como plantillas con reversión: provisión de SAC y vacaciones, previsión de incobrables, ingresos devengados no facturados, gastos devengados no facturados. | La provisión de ingresos devengados no facturados del 31-12 se revierte el 01-01. |
### 1.6 Centros de costo (secciones) (M15 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0081 | RF-CON-081; M15 §5.6; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | ABM de centros de costo propios del tenant: código, nombre, jerarquía opcional, porcentaje de IVA compras computable, vigencia y relación opcional con servicio, área, sucursal o zona, sin imponer equivalencia con servicios. | Se crean CC-AG, CC-INT, CC-ADM; CC-ADM no se asocia a ningún servicio. |
| CP-CON-0082 | RF-CON-082; M15 §5.6; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Grupos de centros (un centro puede integrar varios grupos) para informes. | El grupo "Servicios técnicos" suma Agua e Internet. |
| CP-CON-0083 | RF-CON-083; M15 §5.6; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reglas de asignación por defecto por tipo de operación (ingresos/facturación, compras, ajuste por inflación, asiento manual, costo de mercadería vendida, sección por defecto de cuenta) y tipo de elemento (servicio, producto, concepto… | El concepto "Abono Internet" se asigna 100 % a CC-INT sin carga manual. |
| CP-CON-0084 | RF-CON-084; M15 §5.6; PRO-O5-10 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Modelos de distribución reutilizables (plantillas) seleccionables al asignar. | El modelo "DIST-DEMO-25-75" se aplica a varias cuentas de gastos comunes. |
| CP-CON-0085 | RF-CON-085; M15 §5.6; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Distribuciones propias de bienes de uso, empleados, categorías de incidentes, grupos de obras e ítems de compra, recibidas en los eventos de cada módulo. | El evento de amortización trae la distribución del bien y el asiento la respeta. |
| CP-CON-0086 | RF-CON-086; M15 §5.6; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Al contabilizar, cualquier renglón sin centro de una cuenta que lo admite toma la distribución por defecto de su cuenta. | Un gasto sin centro de una cuenta con defecto 100 % CC-ADM queda en CC-ADM. |
| CP-CON-0087 | RF-CON-087; M15 §5.6; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Redondeo de distribución: la suma de importes distribuidos iguala el importe del renglón; el último centro absorbe la diferencia; decimales de porcentaje configurables. | ARS 100 en tres partes iguales da 33,33 / 33,33 / 33,34. |
| CP-CON-0088 | RF-CON-088; M15 §5.6; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Distribución analítica de costos comunes con reglas versionadas (porcentaje fijo o driver: cantidad de suministros activos, kWh, m³, horas, metros de red, ingresos), sin duplicar el gasto; importes no asignados identificados. | Con DIST-DEMO-25-75 los ARS 4.000 comunes se reparten 1.000/3.000 y el gasto total sigue en 4.000. |
| CP-CON-0089 | RF-CON-089; M15 §5.6; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reclasificación contable opcional entre centros (asiento neutro de reclasificación) cuando la cooperativa decide exponer la distribución en libros. | El asiento de reclasificación tiene efecto neto cero por cuenta. |
| CP-CON-0090 | RF-CON-090; M15 §5.6; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Estado de resultados por sección/servicio con ingresos directos, costos directos, comunes distribuidos y resultado. | La tabla de CU-CON-01 se reproduce: Agua 6.000, Internet 10.000, total 16.000. |
| CP-CON-0091 | RF-CON-091; M15 §5.6; PRO-O5-10 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Activación de centros de costo general o solo para sueldos. | Con "solo sueldos", las compras no exigen centro. |
### 1.7 Cuentas corrientes por servicio y conciliaciones (M15 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0092 | RF-CON-092; M15 §5.7; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuentas de control de créditos por servicios con dimensión servicio obligatoria (subcuenta o dimensión) para explicar el saldo por servicio. | El saldo contable de Créditos por servicios – Agua iguala la suma de saldos Agua del auxiliar. |
| CP-CON-0093 | RF-CON-093; M15 §5.7; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación del auxiliar de asociados (COB) contra la cuenta de control, por servicio y total, a una fecha de corte, con diferencias clasificadas por corte, estado o clasificación. | En CU-CON-01 el auxiliar (33.000) y la cuenta de control (33.000) coinciden. |
| CP-CON-0094 | RF-CON-094; M15 §5.7; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación caja/bancos/valores (TES) contra cuentas, distinguiendo comisiones y retenciones. | Una comisión no registrada aparece como diferencia "clasificación". |
| CP-CON-0095 | RF-CON-095; M15 §5.7; PRO-O8-10 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación proveedores (CMP) contra cuenta de proveedores y anticipos. | Un anticipo pendiente se explica en la conciliación. |
| CP-CON-0096 | RF-CON-096; M15 §5.7; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación fiscal: IVA débito/crédito contra libros IVA (FIS), retenciones y percepciones a depositar contra declaraciones. | El IVA DF contable de octubre coincide con el libro IVA ventas. |
| CP-CON-0097 | RF-CON-097; M15 §5.7; PRO-O8-10 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación de stock valorizado y bienes de uso (STK) contra sus cuentas. | Existencias valorizadas = saldo de Bienes de cambio al corte. |
| CP-CON-0098 | RF-CON-098; M15 §5.7; PRO-O5-12 | O5 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación de capital (M17) contra cuentas de capital. Se adelanta a O5 junto con la contabilización del capital mínimo (DEC-019); durante la convivencia concilia el plan no oficial (DEC-068, DEC-069) (HUECO-CAP-01). | Capital suscripto del auxiliar = cuenta contable. |
| CP-CON-0099 | RF-CON-099; M15 §5.7; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación de sueldos a pagar y cargas sociales (SUE) contra cuentas. | El neto a pagar de la liquidación iguala la cuenta antes del pago. |
| CP-CON-0100 | RF-CON-100; M15 §5.7; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Consulta contable de la cuenta corriente por asociado y servicio, vista unificada y detallada, con navegación al auxiliar de COB, sin duplicarlo. | La vista unificada muestra ARS 33.000 con el detalle Agua 8.000 e Internet 25.000. |
| CP-CON-0101 | RF-CON-101; M15 §5.7; PRO-O5-11 | O5 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Informe de anticipos y saldos a favor de clientes a una fecha, con deuda reconstruida y prorrateo por ítem. | Al 31-10-2026 lista ARS 2.000 a favor del ESC-01 y coincide con la cuenta de anticipos. |
| CP-CON-0102 | RF-CON-102; M15 §5.7; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Justificación de cada diferencia de conciliación con responsable, causa y, si corresponde, ajuste trazable autorizado. | Ningún ajuste de conciliación carece de operación, causa, autor y contrapartida. |
### 1.8 Múltiples planes, equivalencias y simulaciones (M15 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0103 | RF-CON-103; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Equivalencias de cuentas entre planes (1:1, 1:N con porcentajes que suman 100 %, N:1), con vigencia y validación de completitud. | Una equivalencia 1:N al 60/40 no duplica importes. |
| CP-CON-0104 | RF-CON-104; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. | El balance en PC-ALT-01 suma igual que en PC-OPER-01. |
| CP-CON-0105 | RF-CON-105; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Detección de cuentas sin equivalencia, asignaciones ambiguas y asientos desequilibrados antes de aceptar resultados. | Sin mapeo completo, el escenario queda "no comparable". |
| CP-CON-0106 | RF-CON-106; M15 §5.8; PRO-O8-11 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Escenarios de simulación con plan elegido, período, universo de operaciones, supuestos (cambio de estructura, reparto de comunes, variación tarifaria, variación de costos) y fecha de corte. | SIM-CON-001 reparte 50/50 y muestra Agua 5.000 e Internet 11.000. |
| CP-CON-0107 | RF-CON-107; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Copiar una base de simulación para comparar hipótesis identificables y repetibles. | Re-ejecutar el mismo escenario con el mismo corte da el mismo resultado. |
| CP-CON-0108 | RF-CON-108; M15 §5.8; PRO-O8-11 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Comparar escenarios entre sí y contra el real con el mismo universo, distinguiendo diferencias de clasificación de cambios de valores. | La comparación +10 % tarifa muestra 41.800 como diferencia de valores, no de clasificación. |
| CP-CON-0109 | RF-CON-109; M15 §5.8; PRO-O8-11 | O8 | Estándar | seguridad | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Aislamiento total: una simulación no emite facturas, no genera deuda, no mueve fondos, no envía órdenes a terceros ni contabiliza oficialmente; sus movimientos viven en colecciones separadas. | Ninguna consulta del mayor oficial lee `simulatedJournalLines`. |
| CP-CON-0110 | RF-CON-110; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Exportar resultados de simulación identificados como tales en cada hoja y archivo. | El XLSX lleva la marca "SIMULACIÓN SIM-CON-001" en encabezado y nombre. |
| CP-CON-0111 | RF-CON-111; M15 §5.8; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Promoción de un plan o configuración aprobada (alternativo → operativo) solo por acción explícita, con aprobación, nueva vigencia (inicio de ejercicio), traspaso de saldos de apertura por equivalencias y auditoría; nunca conversión de… | La promoción crea el asiento de apertura en el plan nuevo y deja el anterior archivado. |
### 1.9 Mayor, balances, estados contables e informes (M15 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0112 | RF-CON-112; M15 §5.9; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Libro diario en pantalla e impresión, con renumeración solo de impresión desde un número N y detalle por sección con porcentaje. | Imprimir desde 1.001 no cambia la numeración guardada. |
| CP-CON-0113 | RF-CON-113; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Libro diario rubricado (apertura primero), libro inventario y balances, y transcripción sobre hojas rubricadas. | El folio continúa desde la última hoja usada. |
| CP-CON-0114 | RF-CON-114; M15 §5.9; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Mayor de una cuenta o de varias: rango, saldo anterior, movimientos, saldo acumulado, centro, ver asiento y navegar al documento. | Desde un movimiento del mayor se abre el asiento y desde allí la factura. |
| CP-CON-0115 | RF-CON-115; M15 §5.9; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Sumas y saldos / balance de comprobación por período, por meses o acumulado, por nivel, con detalle por sección y acceso al mayor. | Total debe = total haber; diferencia cero siempre. |
| CP-CON-0116 | RF-CON-116; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Transacciones por cuenta. | Lista renglones con documento de origen. |
| CP-CON-0117 | RF-CON-117; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Balance diario por niveles, balance general, balance entre períodos (dos subperíodos con padres acumulados) y saldos de cuentas por nivel. | El balance entre períodos muestra 1er y 2do semestre y el total. |
| CP-CON-0118 | RF-CON-118; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Distribución por secciones y rubros; gastos e ingresos por sección y por grupos de secciones, mensual hasta 12 meses, exportable a Excel. | El informe usa la naturaleza de la cuenta, no los dígitos "4" y "5". |
| CP-CON-0119 | RF-CON-119; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Estados contables en formato INAES/normas profesionales (ESP, ER, EEPN, EFE, notas y anexos: bienes de uso, previsiones, gastos por función y sección, inversiones, resultados por sección), comparativos con el ejercicio anterior, con… | Los estados del ejercicio 2026 se generan desde los saldos y cuadran con sumas y saldos. |
| CP-CON-0120 | RF-CON-120; M15 §5.9; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuadro de distribución de excedentes propuesto a la asamblea y resultado por operaciones con asociados y no asociados. | El cuadro parte del excedente del ER y suma 100 %. |
| CP-CON-0121 | RF-CON-121; M15 §5.9; PRO-O5-11 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Control previo a balances: cuentas no imputables con saldo (hasta todas, no solo 20), cuentas sin naturaleza o sin línea de estado, eventos pendientes, borradores y diferencias de conciliación. | El control lista cada problema con enlace. |
| CP-CON-0122 | RF-CON-122; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) para el anexo de estados contables, con datos de STK conciliados. | El cuadro coincide con las cuentas de bienes de uso. |
| CP-CON-0123 | RF-CON-123; M15 §5.9; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Informes de gestión contable: resultado y costo por servicio y centro, evolución mensual, ejecución presupuestaria; los indicadores de gestión no contables se definen en T10 con el contrato semántico de §15. | Cada indicador indica fórmula, universo y corte. |
| CP-CON-0124 | RF-CON-124; M15 §5.9; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Todo reporte declara fecha de corte, universo, estados incluidos y separación real/simulado. | El encabezado de cada reporte muestra corte y universo. |
| CP-CON-0125 | RF-CON-125; M15 §5.9; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Trazabilidad informe → asiento → documento → operación de origen y viceversa. | Desde la línea "Ingresos Internet" del ER se llega a las facturas. |
| CP-CON-0126 | RF-CON-126; M15 §5.9; PRO-O5-11 | O5 | Núcleo | seguridad | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Exportación XLSX, CSV y PDF de todos los reportes, según permiso. | Sin `con.reportes.exportar` el botón no aparece y la API responde 403. |
### 1.10 Ajuste por inflación (M15 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0127 | RF-CON-127; M15 §5.10; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. | Se importa la serie 2025–2026 y se edita un mes. |
| CP-CON-0128 | RF-CON-128; M15 §5.10; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Ajuste por inflación contable de las cuentas ajustables por coeficiente (índice de cierre / índice del mes de origen de cada partida), contra RECPAM, con previsualización y distribución a centros. | Una partida de ARS 100.000 de enero con coeficiente 1,25 se ajusta en ARS 25.000. |
| CP-CON-0129 | RF-CON-129; M15 §5.10; PRO-O8-11 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Ajuste de bienes de uso y amortizaciones con cuentas de revalúo separadas y valores históricos (cálculo en STK con índices de CON). | El asiento separa "Bienes de uso – ajuste" de "valor de origen" si la opción está activa. |
| CP-CON-0130 | RF-CON-130; M15 §5.10; PRO-O8-11 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Contabilización de la revaluación de stock por índice del rubro calculada por STK. | La revaluación genera el asiento contra la cuenta configurada. |
| CP-CON-0131 | RF-CON-131; M15 §5.10; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. | Falta marzo: la corrida se detiene con "Falta índice 03-2026". |
### 1.11 Cierre y reapertura de ejercicio, distribución de excedentes (M15 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0132 | RF-CON-132; M15 §5.11; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cierre de ejercicio: validar que no existan asientos de cierre previos ni pendientes; asiento de refundición de resultados contra cuentas de resultado por prefijo o rol "asignación de resultados"; asiento patrimonial de cierre; asiento de… | Tras cerrar 2026, todas las cuentas de resultado quedan en cero y la apertura 2027 iguala el patrimonial invertido. |
| CP-CON-0133 | RF-CON-133; M15 §5.11; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Reapertura de ejercicio controlada: solicitud, doble aprobación, reversión (no borrado) de los tres asientos, auditoría y nuevo cierre. | La reapertura deja visibles los asientos de cierre originales y sus reversiones. |
| CP-CON-0134 | RF-CON-134; M15 §5.11; PRO-O10-02 | O10 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Asiento de distribución de excedentes según resolución de asamblea (reservas, fondos, interés a cuotas sociales, retornos, capitalización) con evento de M17. | El asiento usa la resolución de asamblea como documento de origen. |
| CP-CON-0135 | RF-CON-135; M15 §5.11; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tratamiento configurable de cuentas de orden en el cierre (incluir en cierre y apertura o exigir saldo cero). | Con la opción recomendada, las cuentas de orden se trasladan al ejercicio nuevo. |
### 1.12 Libros rubricados (M15 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0136 | RF-CON-136; M15 §5.12; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Registro de libros rubricados (diario, inventario y balances): organismo, número de rúbrica, fecha, hojas desde-hasta, líneas por hoja, última hoja usada; impresión de hojas numeradas para rubricar. | Se imprimen las hojas 1 a 200 con encabezado y numeración. |
| CP-CON-0137 | RF-CON-137; M15 §5.12; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. | Un asiento transcripto solo admite contraasiento. |
| CP-CON-0138 | RF-CON-138; M15 §5.12; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Libros en formato digital con huella (hash) e índice cuando el organismo de registro lo admita. | El archivo exportado incluye hash SHA-256 verificable. |
### 1.13 Sistema contable externo (M15 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0139 | RF-CON-139; M15 §5.13; PRO-O5-11 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). | Cada cuenta del plan operativo tiene correspondencia o aparece como faltante. |
| CP-CON-0140 | RF-CON-140; M15 §5.13; PRO-O5-11 | O5 | Estándar | integración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Exportación de asientos y mayores al sistema externo con layouts configurables (CSV, TXT posicional, XLSX) mediante el exportador de T06, incremental, idempotente y con marca de exportado. | Reexportar el mismo rango sin cambios no duplica asientos en el destino. |
| CP-CON-0141 | RF-CON-141; M15 §5.13; PRO-O5-11 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Importación de asientos del sistema externo (contabilidad llevada fuera durante el paralelo) con validaciones y marca de origen. | Los asientos importados se identifican como origen "importado – sistema X". |
| CP-CON-0142 | RF-CON-142; M15 §5.13; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Provisión de saldos y mapeos contables para exportaciones a reguladores y organismos (OCEBA con mapeo FEDECOBA/SUBCUENTA, SilarPib, archivos DGR), cuyos layouts y envío pertenecen a M06 FIS / T06. | FIS obtiene los saldos por cuenta mapeada desde la API de CON. |
### 1.14 Presupuestos y compromisos (M15 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0143 | RF-CON-143; M15 §5.14; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Presupuesto económico por ejercicio y versión, por cuenta, centro de costo, servicio y mes; carga manual, importación Excel, copia del ejercicio anterior con porcentaje de ajuste y distribución estacional. | Se copia 2026 a 2027 con +30 % y estacionalidad de energía. |
| CP-CON-0144 | RF-CON-144; M15 §5.14; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Aprobación y versionado del presupuesto (original y reformulaciones) con vigencia y auditoría. | La reformulación de julio conserva el original para comparar. |
| CP-CON-0145 | RF-CON-145; M15 §5.14; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Compromisos: la OC aprobada (y opcionalmente contratos y SA autorizadas) compromete presupuesto; se libera al cancelar; se reduce al devengar la factura. | Cancelar una OC de ARS 40.000 libera ARS 40.000 de compromiso. |
| CP-CON-0146 | RF-CON-146; M15 §5.14; PRO-O8-11 | O8 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Control presupuestario al aprobar la OC: disponible = presupuesto − comprometido − devengado sin compromiso; política advertir, exigir autorización o bloquear. | Una OC que excede requiere autorización del aprobador. |
| CP-CON-0147 | RF-CON-147; M15 §5.14; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Ejecución presupuestaria: presupuesto, comprometido, devengado y pagado como columnas separadas que no se suman entre sí, por cuenta, centro, servicio y mes, con desvíos. | El total de gastos no suma comprometido + devengado. |
| CP-CON-0148 | RF-CON-148; M15 §5.14; PRO-O8-11 | O8 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Vínculo con el flujo de fondos proyectado de TES (TES proyecta; CON aporta el presupuesto financiero). | El flujo de TES muestra columna "presupuestado". |
| CP-CON-0149 | RF-CON-149; M15 §5.14; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Proyección de costo laboral de SUE como fuente del presupuesto de sueldos. | Se importa la proyección de SUE como versión borrador. |
### 1.15 Capital social contable (M15 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0150 | RF-CON-150; M15 §5.15; PRO-O5-12 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Cuentas de capital por rubro de capital y roles: movimientos de capital, capital a devolver, capital rescatado por socios incobrables, capital integrado, capital suscripto, ajuste de capital. | Cada rubro de capital tiene cuenta o aparece en el validador. |
| CP-CON-0151 | RF-CON-151; M15 §5.15; PRO-O5-12 | O5 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Asientos de suscripción, integración, reembolso, rescate, capitalización de retornos y ajuste de capital desde eventos de M17; las transferencias de capital entre asociados no generan asiento si la cuenta es la misma. | Transferir capital de un socio a otro no genera asiento; queda en el auxiliar de M17. |
| CP-CON-0161 | RF-CON-161; M15 §5.15; PRO-O10-02 | O10 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Capital fuera del mínimo de O5: cuentas y asientos de capital a devolver, reembolso y rescate (también por socios incobrables), ajuste de capital, reservas, distribución de excedentes y capitalización de retornos (M-107…M-110, M-113… | En O5 un evento de rescate de M17 queda pendiente de configuración y no se contabiliza con una regla provisoria. |
| CP-CON-0162 | RF-CON-162; RN-CON-125; M15 §5.15; PRO-O5-10 | O5 | Núcleo | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | **Contabilidad por entidad jurídica** (DEC-064, DEC-087): ejercicios, períodos, numeración de asientos, libro diario, mayores, sumas y saldos, libros rubricados, estados contables, ajuste por inflación y conciliaciones se llevan por… | Con dos entidades A y B, el asiento N.º 1 del ejercicio 2027 existe una vez en cada entidad; un cobro en la caja de A por ARS 5.000 de B deja en A deuda con B por 5.000 y en B crédito contra A por 5.000, y sumas y saldos de cada entidad balancean por separado. |
| CP-CON-0152 | RF-CON-152; M15 §5.15; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Conciliación del auxiliar de capital con contabilidad y exposición del capital en el EEPN. | El EEPN muestra capital suscripto, integrado y a devolver. |
### 1.16 Transversales (M15 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CON-0153 | RF-CON-153; M15 §5.16; PRO-O5-11 | O5 | Núcleo | seguridad | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Aislamiento por tenant de planes, asientos, simulaciones, presupuestos y exportaciones; todo índice comienza por `tenantId`. | Un usuario de TEN-002 recibe 404 al pedir un asiento de TEN-001. |
| CP-CON-0154 | RF-CON-154; M15 §5.16; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Todas las etiquetas por clave de diccionario y renombrables por tenant (ej. "Sección" en lugar de "Centro de costo"). | El tenant cambia `dict:con.costCenter` a "Sección" y se refleja en todas las pantallas. |
| CP-CON-0155 | RF-CON-155; M15 §5.16; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Única fuente de saldos: los renglones contabilizados; los saldos por cuenta/período/centro son una proyección reconstruible; no existen saldos editables. | Reconstruir la proyección produce los mismos saldos. |
| CP-CON-0156 | RF-CON-156; M15 §5.16; PRO-O5-11 | O5 | Núcleo | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Rendimiento: contabilizar el lote de 100.000 facturas del ciclo en resumen dentro de la ventana operativa; mayores y sumas y saldos paginados con respuesta interactiva. | El resumen de 100.000 eventos termina sin bloquear la operación (job reanudable). |
| CP-CON-0157 | RF-CON-157; M15 §5.16; PRO-O5-11 | O5 | Estándar | regla | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Tablero contable con estado de períodos, eventos pendientes, borradores, conciliaciones con diferencias, alertas de configuración y vencimientos de cierre. | El tablero muestra "12 eventos pendientes de configuración" con enlace. |
| CP-CON-0158 | RF-CON-158; M15 §5.16; PRO-O11-05 | O11 | Estándar | funcional | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | IA solo propone: sugerir cuenta para un concepto nuevo, detectar asientos atípicos; nunca contabiliza ni aprueba. | La sugerencia requiere confirmación humana y se audita. |
| CP-CON-0159 | RF-CON-159; M15 §5.16; PRO-O5-11 | O5 | Núcleo | seguridad | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Segregación de funciones: quien carga un ajuste por encima del umbral no lo aprueba; reapertura de ejercicio con doble autorización; anulación masiva con permiso específico. | El mismo usuario no puede cargar y aprobar un ajuste de ARS 500.000. |
| CP-CON-0160 | RF-CON-160; M15 §5.16; PRO-O5-11 | O5 | Estándar | migración | TEN-001 (y TEN-002 si aplica) con datos ficticios y la configuración publicada | Migración repetible desde ProCoop de plan de cuentas, rubros, ejercicios, asientos, centros, reglas y parámetros-cuenta, con conciliación de sumas y saldos. | Las sumas y saldos migradas coinciden con ProCoop a la fecha de corte. Ola: los saldos de apertura migran en O5 y el resto del historial en O11 (antes `O11 (O5 para saldos de apertura)`). |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-CON-5001 — ESC-01. Pago en exceso de ARS 2.000**

- Cubre: ESC-01; relacionados: CU-CON-02; M15 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago en exceso de ARS 2.000
- Entonces Saldo a favor en `customerAdvances`, nunca ingreso; informe de anticipos coincide (CU-CON-02).

**CP-CON-5002 — ESC-02. Reenvío del mismo evento económico (reintento del outbox)**

- Cubre: ESC-02; RF-CON-051; M15 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reenvío del mismo evento económico (reintento del outbox)
- Entonces Un solo evento y un solo asiento (RF-CON-051).

**CP-CON-5003 — ESC-03. Asiento manual en período cerrado**

- Cubre: ESC-03; M15 §17
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Asiento manual en período cerrado
- Entonces 409 con `dict:con.errors.periodClosed`; nada se graba.

**CP-CON-5004 — ESC-04. Usuario sin `con.asientos.contabilizar` intenta contabilizar**

- Cubre: ESC-04; M15 §17
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario sin `con.asientos.contabilizar` intenta contabilizar
- Entonces 403; la acción no aparece en la UI.

**CP-CON-5005 — ESC-05. Usuario del tenant A consulta un asiento del tenant B por id**

- Cubre: ESC-05; M15 §17
- Ola: O4 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario del tenant A consulta un asiento del tenant B por id
- Entonces 404 (no revela existencia); los índices y consultas incluyen `tenantId`.

**CP-CON-5006 — ESC-CON-06. Evento con concepto sin cuenta**

- Cubre: ESC-CON-06; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Evento con concepto sin cuenta
- Entonces Evento `pendingConfiguration`, documento de origen válido, cierre del período bloqueado hasta resolver.

**CP-CON-5007 — ESC-CON-07. Asiento automático intentado editar**

- Cubre: ESC-CON-07; RN-CON-113; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Asiento automático intentado editar
- Entonces Rechazado; solo revertir y reprocesar (RN-CON-113).

**CP-CON-5008 — ESC-CON-08. Anulación de una factura de período cerrado**

- Cubre: ESC-CON-08; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Anulación de una factura de período cerrado
- Entonces Contraasiento con fecha del período abierto; el original intacto.

**CP-CON-5009 — ESC-CON-09. Lote de un rango ya contabilizado**

- Cubre: ESC-CON-09; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lote de un rango ya contabilizado
- Entonces Sin asientos nuevos; informe "0 eventos pendientes".

**CP-CON-5010 — ESC-CON-10. Simulación ejecutada dos veces con los mismos insumos**

- Cubre: ESC-CON-10; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Simulación ejecutada dos veces con los mismos insumos
- Entonces Mismo `runHash` y resultados; ningún registro en `journalEntries`.

**CP-CON-5011 — ESC-CON-11. Reporte oficial con escenario existente**

- Cubre: ESC-CON-11; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reporte oficial con escenario existente
- Entonces Los importes simulados no aparecen en mayor, sumas y saldos ni estados.

**CP-CON-5012 — ESC-CON-12. Reconstrucción de saldos**

- Cubre: ESC-CON-12; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reconstrucción de saldos
- Entonces `ledgerBalances` reconstruido = proyección vigente; si difiere, alerta crítica.

**CP-CON-5013 — ESC-CON-13. Conciliación de deudores al cierre del mes**

- Cubre: ESC-CON-13; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación de deudores al cierre del mes
- Entonces Auxiliar COB por servicio = cuenta de control por servicio, o diferencias clasificadas.

**CP-CON-5014 — ESC-CON-14. Reapertura de ejercicio sin segundo aprobador**

- Cubre: ESC-CON-14; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reapertura de ejercicio sin segundo aprobador
- Entonces Imposible; la solicitud queda pendiente.

**CP-CON-5015 — ESC-CON-15. Unificación de cuentas**

- Cubre: ESC-CON-15; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Unificación de cuentas
- Entonces Movimientos, roles y reglas pasan al destino; mayor del destino = suma de ambos; origen `merged`.

**CP-CON-5016 — ESC-CON-16. Distribución con modelo que no suma 100 %**

- Cubre: ESC-CON-16; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Distribución con modelo que no suma 100 %
- Entonces Rechazo en la configuración.

**CP-CON-5017 — ESC-CON-17. Amortización revertida**

- Cubre: ESC-CON-17; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Amortización revertida
- Entonces STK revierte acumulados (EVT-CON-02); el bien no puede eliminarse si tiene amortizaciones contabilizadas.

**CP-CON-5018 — ESC-CON-18. Cobro en caja con PRM-CON-025 = `onCashboxClosed`**

- Cubre: ESC-CON-18; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobro en caja con PRM-CON-025 = `onCashboxClosed`
- Entonces El asiento se genera al cerrar la caja, con el detalle de sus cobros.

**CP-CON-5019 — ESC-CON-19. Falla de la base durante la contabilización**

- Cubre: ESC-CON-19; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Falla de la base durante la contabilización
- Entonces Transacción revertida; el evento queda `received` y se reintenta sin duplicar.

**CP-CON-5020 — ESC-CON-20. Diferencia de redondeo de 0,03 en un resumen**

- Cubre: ESC-CON-20; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Diferencia de redondeo de 0,03 en un resumen
- Entonces Va a `billingRounding`; 0,06 con tolerancia 0,05 deja el evento en `error`.

**CP-CON-5021 — ESC-CON-21. Token externo con `con.ext.saldos` pide asientos**

- Cubre: ESC-CON-21; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Token externo con `con.ext.saldos` pide asientos
- Entonces 403.

**CP-CON-5022 — ESC-CON-22. Importación de asientos con cuenta agrupadora**

- Cubre: ESC-CON-22; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación de asientos con cuenta agrupadora
- Entonces Rechazo con fila y cuenta.

**CP-CON-5023 — ESC-CON-23. Factura mayorista de energía ficticia por ARS 1.000.000 neto + IVA (HUE-ELE-01)**

- Cubre: ESC-CON-23; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura mayorista de energía ficticia por ARS 1.000.000 neto + IVA (HUE-ELE-01)
- Entonces Debe `wholesaleEnergyCost` 1.000.000 (servicio ELE) y `vatInput`; haber `accountsPayable`; ningún ingreso ni cargo al usuario.

**CP-CON-5024 — ESC-CON-24. Liquidación de derechos de señales aprobada por ARS 180.000 y factura de la programadora por ARS 182.000 (HUE-TV-01)**

- Cubre: ESC-CON-24; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Liquidación de derechos de señales aprobada por ARS 180.000 y factura de la programadora por ARS 182.000 (HUE-TV-01)
- Entonces M-128 devenga 180.000; la factura cancela 180.000 de `signalRightsAccrued` y 2.000 van a `signalRightsCost`.

**CP-CON-5025 — ESC-CON-25. Subsidio aprobado por ARS 300.000 con fondo de ARS 250.000 y PRM-CON-194 = `expense` (HUECO-SEP-03)**

- Cubre: ESC-CON-25; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Subsidio aprobado por ARS 300.000 con fondo de ARS 250.000 y PRM-CON-194 = `expense` (HUECO-SEP-03)
- Entonces Debe `socialSubsidyFund` 250.000 y `socialSubsidy` 50.000; haber `socialSubsidyPayable` 300.000; reprocesar EVT-SOC-04 no duplica.

**CP-CON-5026 — ESC-CON-26. Depósito ORT-DEMO-01 de ARS 20.000 facturado y luego devuelto como crédito (HUECO-OTR-04)**

- Cubre: ESC-CON-26; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Depósito ORT-DEMO-01 de ARS 20.000 facturado y luego devuelto como crédito (HUECO-OTR-04)
- Entonces Al facturar: haber `guaranteesHeld` 20.000 (sin ingreso); al devolver: debe `guaranteesHeld` 20.000, haber `customerAdvances` 20.000.

**CP-CON-5027 — ESC-CON-27. Derecho de sepultura facturado por ARS 600.000 con vigencia de 10 años y PRM-CON-193 = `deferredOverTerm` (HUECO-CEM-04)**

- Cubre: ESC-CON-27; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Derecho de sepultura facturado por ARS 600.000 con vigencia de 10 años y PRM-CON-193 = `deferredOverTerm` (HUECO-CEM-04)
- Entonces Al facturar: haber `burialRightDeferredRevenue` 600.000; JOB-CON-23 devenga ARS 5.000 por mes; con `atGrant` todo es ingreso del período.

**CP-CON-5028 — ESC-CON-28. Tenant con entidades A y B; cobro único en la caja de A de ARS 8.000 de A y ARS 5.000 de B (DEC-087, M-136)**

- Cubre: ESC-CON-28; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tenant con entidades A y B; cobro único en la caja de A de ARS 8.000 de A y ARS 5.000 de B (DEC-087, M-136)
- Entonces En A: debe caja 13.000, haber créditos por servicios 8.000 y `interEntityAccount` 5.000; en B: debe `interEntityAccount` 5.000, haber créditos por servicios 5.000; reprocesar el evento no duplica; cada entidad balancea sola.

**CP-CON-5029 — ESC-CON-29. Factura con abono de ARS 10.000 y aporte de capital de ARS 2.000 (clase `capitalContribution`, RN-FIS-124)**

- Cubre: ESC-CON-29; RN-FIS-124; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura con abono de ARS 10.000 y aporte de capital de ARS 2.000 (clase `capitalContribution`, RN-FIS-124)
- Entonces El asiento M-01 imputa 10.000 a ingreso del servicio y el M-02 imputa 2.000 a capital social; ningún importe del aporte va a `rol:serviceRevenue`.

**CP-CON-5030 — ESC-CON-30. Cierre del período `2027-03` de la entidad A (CTR-DAT-31)**

- Cubre: ESC-CON-30; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cierre del período `2027-03` de la entidad A (CTR-DAT-31)
- Entonces EVT-CON-07 con `legalEntityId` de A, `period = 2027-03` y `sequence = 3` (ejercicio que inicia en enero); el período de B sigue abierto.

**CP-CON-5031 — ESC-CON-31. Factura con servicio ARS 12.100, aporte al fondo ARS 1.000 (`subsidyFundContribution`) y depósito ARS 50.000 (`guaranteeDeposit`), valores…**

- Cubre: ESC-CON-31; RN-CON-126; M15 §17
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura con servicio ARS 12.100, aporte al fondo ARS 1.000 (`subsidyFundContribution`) y depósito ARS 50.000 (`guaranteeDeposit`), valores ficticios, con reglamento que constituye el fondo con aportes (RN-CON-126)
- Entonces Haber `rol:serviceRevenue` (neto) e IVA, `rol:socialSubsidyFund` 1.000 y `rol:guaranteesHeld` 50.000; ninguna clase especial cae en ingreso por la cascada; un renglón con clase desconocida queda pendiente sin asiento provisorio.

## 3. Casos por caso de uso (CU)

**CP-CON-8001 — CU-22. Pago digital con comisión (BASE §22)**

- Cubre: CU-22; M15 §16
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando 1. Ana Pérez (ASO-001) paga ARS 8.000 por pasarela; COB publica `cob.payment.confirmed` (M-22). Asiento: Debe `collectionsPendingBankCredit` 8.000 / Haber `billingReceivable` (servicio de la factura) 8.000. 2. TES registra la acreditación neta (M-23): Debe Banco 7.840, `gatewayCommissions` 160 / Haber `collectionsPendingBankCredit` 8.000. ASI-DEMO-001 en la precarga muestra la forma condensada (Debe Banco 7.840 + Comisiones 160 / Haber Créditos por servicios 8.000) que resulta de sumar ambos pasos. 3.
- Entonces La cuenta puente queda en cero; desde el asiento se abre el recibo y la liquidación de la pasarela. Si la acreditación no llega, la cuenta puente muestra el pendiente por canal y la conciliación lo lista.

**CP-CON-8002 — CU-ERP-01. Planes alternativos y simulación de tarifa (BASE §55)**

- Cubre: CU-ERP-01; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Planes alternativos y simulación de tarifa (BASE §55)
- Entonces Definición dueña: este anexo (planes de cuentas y simulación son de M15). T10 la cita para el reporte REP-CON-004. 1. En PC-OPER-01 los ingresos del mes suman 38.000 en "Ingresos por servicios". 2. En PC-ALT-01 la equivalencia separa por servicio: Agua 13.000, Internet 25.000 (proyección JOB-CON-10). 3. SIM-ERP-001 aplica tarifa +10 %: Agua 14.300, Internet 27.500, total 41.800, con marca de simulación; los libros oficiales siguen en 38.000.

**CP-CON-8003 — CU-CON-01. Resultado por servicio con costos comunes (BASE §75)**

- Cubre: CU-CON-01; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando 1. Facturas de ASO-001: Agua 13.000 y Internet 25.000 (M-01). Cobro de 5.000 imputado a Agua (M-20). Saldo del auxiliar 33.000 = cuenta de control 33.000 (conciliación `balanced`). 2. Costos directos: Agua 6.000 (CC-AG), Internet 12.000 (CC-INT); comunes 4.000 en CC-ADM. 3. Corrida con DIST-DEMO-25-75: Agua recibe 1.000, Internet 3.000.
- Entonces Agua 13.000 − 6.000 − 1.000 = 6.000; Internet 25.000 − 12.000 − 3.000 = 10.000; total 16.000 (igual al resultado contable 38.000 − 22.000). 4. SIM-CON-001 con reparto 50/50: Agua 5.000, Internet 11.000, total 16.000 sin tocar libros.

**CP-CON-8004 — CU-OPE-01. Compra de módems con compromiso (BASE §78, parte contable)**

- Cubre: CU-OPE-01; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Compra de módems con compromiso (BASE §78, parte contable)
- Entonces Definición dueña: M12 «CU-OPE-01 — Compra de módems por servicio». Aquí solo el tramo contable. 1. OC-DEMO-002 por 2 módems × 20.000 = 40.000 aprobada: compromiso 40.000 en el presupuesto de CC-INT (sin asiento, M-55). 2. Recepción (M-56): Debe Stock módems 40.000 / Haber `goodsPendingDelivery` 40.000. 3. Factura del proveedor neto 40.000 + IVA 8.400 (M-57): Debe `goodsPendingDelivery` 40.000, `vatInput` 8.400 / Haber `accountsPayable` 48.400. El compromiso pasa a devengado; la ejecución muestra comprometido 0, devengado 40.000.

**CP-CON-8005 — CU-104. Asiento de sueldos (BASE §104, parte contable)**

- Cubre: CU-104; M15 §16
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Asiento de sueldos (BASE §104, parte contable)
- Entonces Definición dueña: M16 «CU-104 — Liquidación mensual de una cooperativa eléctrica». Aquí solo el asiento; los importes son un ejemplo de la forma del asiento y no reemplazan los datos ficticios de M16. 1. SUE aprueba la liquidación de octubre 2026 (`sue.payrollRun.approved`, M-96) con imputación por centro: Distribución 60 %, Administración 30 %, Internet 10 %. 2. Ejemplo: remuneraciones 1.000.000, contribuciones patronales 240.000, aportes y retenciones 170.000, sindicato 20.000. Asiento: Debe Sueldos 1.000.000 y Cargas sociales 240.000 (distribuidos 60/30/10) / Haber `payrollPayable` 810.000, `socialSecurityPayable` 410.000 (aportes 170.000 + contribuciones 240.000)…

**CP-CON-8006 — CU-FIS-01. Pago a proveedor con retención (BASE §61, parte contable)**

- Cubre: CU-FIS-01; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago a proveedor con retención (BASE §61, parte contable)
- Entonces Definición dueña: M06 «CU-FIS-01 — Retención en un pago a proveedor». Aquí solo el tramo contable, con los importes de M06 y M12 (corrección 05-11-2026: antes factura de 121.000 y pago de 119.000). Factura de 100.000 de PROV-DEMO-001; la OP aplica la retención RET-DEMO-001 de 2.000 (M-48) y paga 98.000 (M-58): Debe `accountsPayable` 100.000 / Haber Banco 98.000, `withholdingsPayable` 2.000. El depósito de la retención (M-51) cancela el pasivo.

**CP-CON-8007 — CU-CON-02. Pago en exceso (ESC-01)**

- Cubre: CU-CON-02; relacionados: ESC-01; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago en exceso (ESC-01)
- Entonces ASO-001 paga 10.000 con una deuda de 8.000: Debe Caja 10.000 / Haber `billingReceivable` 8.000, `customerAdvances` 2.000 (M-20, M-25). El informe de anticipos al 31-10-2026 lista 2.000 y coincide con la cuenta. La factura siguiente consume el saldo (M-26).

**CP-CON-8008 — CU-CON-03. Resumen diario de cobranza**

- Cubre: CU-CON-03; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Resumen diario de cobranza
- Entonces Modo `dailySummary` para COB. El 15-10-2026 llegan 1.200 cobros en 3 cajas y 2 entes. JOB-CON-02 agrupa por día, servicio y medio: genera un asiento con un renglón por servicio en `billingReceivable` y uno por caja/ente; el usuario revisa en PAN-CON-17 y confirma. Re-ejecutar el día no duplica (los eventos ya están `posted`). Con PRM-CON-024 activo y una caja abierta, el lote se detiene y la muestra.

**CP-CON-8009 — CU-CON-04. Servicio nuevo sin cuenta**

- Cubre: CU-CON-04; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Servicio nuevo sin cuenta
- Entonces Se publica el servicio "TV" sin regla de ventas: con PRM-CON-017 = `block` la publicación se detiene con el faltante. Si se publicó con `warn`, la primera factura emitida deja su evento en `pendingConfiguration` (EVT-CON-04), la factura sigue válida para el socio, el contador asigna la cuenta desde el enlace de la bandeja, JOB-CON-03 reprocesa y el período puede cerrarse.

**CP-CON-8010 — CU-CON-05. Compra con IVA computable por sección**

- Cubre: CU-CON-05; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Compra con IVA computable por sección
- Entonces Factura de proveedor neto 100.000 + IVA 21.000 = 121.000, imputada 50 % a Distribución (IVA computable 60 %) y 50 % a Administración (100 %). Con PRM-CON-030 activo: Debe Gastos Distribución 50.000 + IVA no computable 4.200 (40 % de 10.500), Gastos Administración 50.000, `vatInput` 16.800 (6.300 + 10.500) / Haber `accountsPayable` 121.000.

**CP-CON-8011 — CU-CON-06. Convenio de pago con intereses**

- Cubre: CU-CON-06; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Convenio de pago con intereses
- Entonces Deuda vencida 30.000 refinanciada en 3 cuotas con interés total 3.000 (M-37): Debe `refinancingReceivable` 33.000 / Haber `billingReceivable` 30.000, `deferredFinancingInterest` 3.000. Al facturar cada cuota (M-38): Debe `deferredFinancingInterest` 1.000 / Haber `interestIncome` 1.000. Si el convenio cae tras la primera cuota (M-39), se restituye la deuda y se revierte el interés no devengado (2.000).

**CP-CON-8012 — CU-CON-07. Cierre del ejercicio 2026**

- Cubre: CU-CON-07; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cierre del ejercicio 2026
- Entonces 1. Los doce períodos están cerrados; el ajuste por inflación está contabilizado. 2. JOB-CON-05 genera la refundición (cierra todas las cuentas de ingresos y egresos del ejercicio y lleva la diferencia a `resultAllocation` o a los destinos de `resultTargets`), el cierre patrimonial y la apertura 2027. 3. Vista previa: todas las cuentas de resultado en cero; el contador confirma; EVT-CON-09 informa el resultado a M17 para la asamblea.

**CP-CON-8013 — CU-CON-08. Reapertura de período**

- Cubre: CU-CON-08; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reapertura de período
- Entonces El 10-11-2026 aparece una factura de compra de octubre. El contador solicita reabrir octubre para compras con motivo y plazo 2 días; el gerente aprueba (T11); se registra; el período vuelve a `closed` al vencer el plazo o a mano. Todo queda en el historial.

**CP-CON-8014 — CU-CON-09. Ajuste por inflación**

- Cubre: CU-CON-09; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ajuste por inflación
- Entonces Un terreno de 100.000 incorporado con índice 100; índice al cierre 150. Coeficiente 1,5; ajuste 50.000: Debe Terreno 50.000 / Haber `inflationAdjustment` 50.000. Si falta el índice de un mes, la corrida aborta indicando el mes.

**CP-CON-8015 — CU-CON-10. Capital social**

- Cubre: CU-CON-10; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Capital social
- Entonces Suscripción de 10 cuotas de 1.000 al afiliarse (M-105): Debe `capitalSubscribedReceivable` 10.000 / Haber `capitalMovements` 10.000. Integración de 2.000 en la factura (M-02, M-106) y cobro: el capital integrado no aparece como ingreso. Rescate aprobado de 2.000 (M-108) y pago (M-109).

**CP-CON-8016 — CU-CON-11. Exceso presupuestario**

- Cubre: CU-CON-11; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Exceso presupuestario
- Entonces CC-INT tiene disponible 30.000; una OC de 40.000 dispara `con.commitment.exceeded`; con política `authorize` la OC queda esperando la autorización del gerente; aprobada, el compromiso registra el exceso autorizado.

**CP-CON-8017 — CU-CON-12. Importación del estudio contable**

- Cubre: CU-CON-12; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación del estudio contable
- Entonces El estudio envía un XLSX con 3 asientos de ajuste; uno desbalanceado: la importación rechaza el archivo completo indicando la fila. Corregido, se importan como borradores y el contador los contabiliza.

**CP-CON-8018 — CU-CON-13. Transcripción a libro rubricado**

- Cubre: CU-CON-13; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Transcripción a libro rubricado
- Entonces Libro Diario N.º 3, hojas 1 a 500, 50 líneas por hoja. Se transcriben los asientos 1 a 420 de 2026 en las hojas 1 a 37; los asientos transcriptos ya no admiten anulación (solo contraasiento) ni renumeración.

**CP-CON-8019 — CU-CON-14. Amortización y reversión**

- Cubre: CU-CON-14; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Amortización y reversión
- Entonces STK publica la amortización de octubre (M-70) de un camión 70 % Distribución / 30 % Administración por 30.000: Debe Amortizaciones 21.000 (CC-DIS) y 9.000 (CC-ADM) / Haber Amortización acumulada rodados 30.000. Al revertir la corrida, CON registra el contraasiento y emite EVT-CON-02; STK devuelve los acumulados al 30-09.

**CP-CON-8020 — CU-CON-15. Distribución de excedentes**

- Cubre: CU-CON-15; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Distribución de excedentes
- Entonces Excedente repartible aprobado por asamblea (M-113): Debe `unassignedSurplus` / Haber reservas y fondos con los porcentajes de PRM-CON-060, interés a cuotas y retornos a pagar; el resultado con no asociados va a `specialReserve`. Los retornos capitalizados (M-114) aumentan el capital del asociado en M17.

**CP-CON-8021 — CU-CON-16. Diferencia en conciliación de bancos**

- Cubre: CU-CON-16; M15 §16
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración publicada.
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Diferencia en conciliación de bancos
- Entonces La conciliación diaria muestra banco contable 500.000 vs auxiliar TES 499.000: diferencia de corte (gasto bancario registrado en TES al día siguiente). El contador la clasifica como `cutoff` y queda `explained`; al día siguiente la diferencia desaparece.
