# Casos de prueba de aceptación — M12 CMP — Compras y proveedores

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M12-CMP-compras-proveedores.md`](../../especificacion/anexos/M12-CMP-compras-proveedores.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 115 CP de requisitos funcionales, 25 CP de escenarios ESC y 9 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M12 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Proveedores (M12 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0001 | RF-CMP-001; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | ABM de proveedores: razón social, nombre de fantasía, CUIT, condición de IVA (`SITIVA`), inscripción IIBB y jurisdicciones, domicilio fiscal y comercial, teléfonos, emails, contacto, condición de pago por defecto, moneda, cuenta contable… | CUIT único por tenant; un proveedor bloqueado no recibe OC ni OP. |
| CP-CMP-0002 | RF-CMP-002; M12 §5.1; PRO-O8-01 | O8 | Estándar | integración | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Validar CUIT (dígito verificador) y consultar el padrón de ARCA mediante el componente de M06 al dar de alta o modificar (P218), proponiendo datos; alertar si el certificado/constancia del proveedor está vencido (P217) sin abrir páginas… | Con P218 activo, un CUIT inexistente en el padrón muestra advertencia y queda registrada la consulta. |
| CP-CMP-0003 | RF-CMP-003; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | CBU/CVU del proveedor: varias cuentas con descripción, banco, titular y CUIT del titular; validación de formato; **cambio o alta de CBU con aprobación T11** y aviso al proveedor (prevención de fraude); cuenta preferida. | Una OP no usa un CBU con cambio pendiente de aprobación. |
| CP-CMP-0004 | RF-CMP-004; M12 §5.1; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, `withholdingAssignments`); importar retenciones/alícuotas de proveedores… | La ficha muestra lo que M06 aplicará en la próxima OP. |
| CP-CMP-0005 | RF-CMP-005; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Tipos de producto que provee cada proveedor, para filtrar invitaciones a cotizar. | Al invitar a cotizar un rubro se sugieren solo proveedores con ese tipo. |
| CP-CMP-0006 | RF-CMP-006; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Personas autorizadas del proveedor: nombre, documento, fecha de autorización, caducidad opcional, observación; uso en la entrega de valores (M14). | Un autorizado caducado no puede retirar pagos. |
| CP-CMP-0007 | RF-CMP-007; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Valoraciones del proveedor: usuario, fecha, cualidad, puntuación, observación; más indicadores automáticos (entregas a término, diferencias de cantidad y precio, devoluciones) para "medir cumplimiento de proveedores". | El tablero del proveedor muestra puntaje promedio y % de entregas a término del período. |
| CP-CMP-0008 | RF-CMP-008; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | Rubros de proveedores unificados (un solo catálogo con banco y pago diferido) y asignación de uno o varios rubros con fecha. | Un rubro con "pago diferido" habilita pagos diferidos a sus proveedores (P2015/P2016 en M14). |
| CP-CMP-0009 | RF-CMP-009; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Observaciones del proveedor y notas con fecha y usuario. | Las notas son inmutables; se agregan nuevas. |
| CP-CMP-0010 | RF-CMP-010; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Vincular el proveedor con cuentas/personas de M01 (proveedor que también es socio o usuario), con tipo de relación. | La ficha 360 del socio muestra su rol de proveedor; no hay compensación automática de saldos. |
| CP-CMP-0011 | RF-CMP-011; M12 §5.1; PRO-O8-01 | O8 | Estándar | seguridad | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Proveedores que son empleados: ocultar sus facturas, recibos y datos en compras e informes salvo capability `cmp.proveedoresEmpleados.ver` (P2653, P2709). | Un comprador sin la capability no ve importes de proveedores-empleado. |
| CP-CMP-0012 | RF-CMP-012; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Comunicaciones con el proveedor por email, SMS y WhatsApp (T09) con plantilla; circulares a proveedores (texto masivo por rubro o tipo) e historial de correspondencia. | Cada envío queda en `supplierCorrespondence` con estado de entrega. |
| CP-CMP-0013 | RF-CMP-013; M12 §5.1; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Trámites y documentación del proveedor (constancias, seguros, habilitaciones) con vencimiento y adjuntos en el expediente T11; alerta de vencimiento. | Un documento obligatorio vencido bloquea nuevas OC si la política lo exige. |
| CP-CMP-0014 | RF-CMP-014; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Consulta de situación crediticia del proveedor en la Central de Deudores del BCRA como enlace informativo. | Sin confirmación, solo enlace externo. |
| CP-CMP-0015 | RF-CMP-015; M12 §5.1; PRO-O8-01 | O8 | Estándar | seguridad | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Acceso al portal de proveedores por invitación individual con usuario propio (T02), reemplazando la contraseña genérica y el "blanqueo" manual. | No existe contraseña compartida entre proveedores. |
| CP-CMP-0016 | RF-CMP-016; M12 §5.1; PRO-O8-01 | O8 | Núcleo | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Cuenta corriente del proveedor: comprobantes, pagos, anticipos, NC, saldo, vencidos y a vencer, con fecha de corte. | Saldo = Σ comprobantes − Σ aplicaciones de OP − NC aplicadas, a la fecha de corte. |
| CP-CMP-0017 | RF-CMP-017; M12 §5.1; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Búsqueda y selección de proveedores por CUIT, código, nombre, rubro, tipo de producto y valoración (selector embebible en otros módulos y selección múltiple). | El selector respeta el alcance de datos. |
| CP-CMP-0018 | RF-CMP-018; M12 §5.1; PRO-O3-03 | O3 | Núcleo | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Padrón mínimo de proveedores (razón social, CUIT, condición IVA) para registrar el ingreso de equipos serializados del piloto. | El ingreso de módems del piloto referencia un proveedor existente. |
### 1.2 Catálogos de compras (M12 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0020 | RF-CMP-020; M12 §5.2; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Conceptos: "Flete", "Mantenimiento", "Servicios públicos", "Anticipo a proveedores" | Conceptos de compra (no inventariables): descripción, descripción para formulario, unidad, rubro contable, alícuota de IVA, no gravado, tipo, tipo de IVA, código IIBB; retenciones aplicables por concepto (en M06). | Un concepto sin rubro no se usa si el tenant exige imputación. |
| CP-CMP-0021 | RF-CMP-021; M12 §5.2; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Destinatarios de SA (áreas/personas receptoras). | Con P2705 la SA exige destinatario. |
| CP-CMP-0022 | RF-CMP-022; M12 §5.2; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Unidades de gasto y su panel al cargar productos desde un vale (P2906, uso en M13). El catálogo es `expenseUnits` de M13 (CTR-DAT-54); M12 lo consulta. | La unidad de gasto se imputa en la línea. |
| CP-CMP-0023 | RF-CMP-023; M12 §5.2; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Tipos de combustible y registro de litros y km por comprobante de compra de combustible. El catálogo de tipos es `fuelTypes` de M18 (CTR-DAT-54); M12 registra litros y km en el comprobante. | El informe de consumo de combustible suma litros por vehículo/movimiento. |
| CP-CMP-0024 | RF-CMP-024; M12 §5.2; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Modalidades de contratación: sin asignar, caja chica, compulsa/mail, concurso de precios, concurso, licitación; cada una con umbrales y documentos exigidos configurables. | Una SA por encima del umbral de compulsa exige al menos N cotizaciones. |
| CP-CMP-0025 | RF-CMP-025; M12 §5.2; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Conceptos: "Flete", "Mantenimiento", "Servicios públicos", "Anticipo a proveedores" | Tipos de comprobante de compra y sus operaciones (suma/resta saldo, informa impuestos, mueve stock, anticipo, OP) desde el catálogo de tipos de comprobante de M05/T04. | Un tipo sin operación configurada no se ofrece. |
| CP-CMP-0026 | RF-CMP-026; M12 §5.2; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Previsiones de pagos periódicos por proveedor, concepto o producto con periodicidad (mensual, bimestral, trimestral, semanal, quincenal), vigencia e importe, expuestas a la proyección de M14. | Una previsión mensual de ARS 10.000 de enero a marzo genera 3 vencimientos proyectados. |
### 1.3 Solicitud de aprovisionamiento (M12 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0030 | RF-CMP-030; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Alta de SA con ítems de producto, concepto o texto libre: cantidad, unidad, costo estimado (con precio de última compra), solicitante, destinatario, criticidad (normal, alta, urgente), modalidad, fecha requerida, observaciones; y **por… | Una SA para "reposición de módems del servicio INT" guarda servicio y centro de costo en la línea. |
| CP-CMP-0031 | RF-CMP-031; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | Originar SA desde: punto de reposición de M13, OT/obra de M10 (materiales faltantes), fabricación (M13) o manualmente. | La SA conserva el vínculo con su origen. |
| CP-CMP-0032 | RF-CMP-032; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Aprobación de SA por workflow T11 según política (monto estimado, área, criticidad), con opción de **doble aprobación** por usuarios distintos (P2867). Nunca se autoaprueba por procesar un ítem. | Procesar un ítem de una SA no aprobada devuelve error `cmp/request-not-approved`. |
| CP-CMP-0033 | RF-CMP-033; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que **sí** excluye SA más antiguas que la vigencia. | Con vigencia 30, una SA de hace 45 días no aparece en pendientes. |
| CP-CMP-0034 | RF-CMP-034; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Estados: borrador, pendiente de aprobación, aprobada, rechazada, en proceso (compras la tomó), parcialmente procesada, procesada, descartada, anulada; reabrir ("marcar pendiente") con motivo. | No se elimina una SA con ítems procesados; se anula. |
| CP-CMP-0035 | RF-CMP-035; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Aprobación por informe impreso para firma del aprobador (marca "exportada"), como alternativa al workflow electrónico. | El PDF incluye monto estimado y precio de última compra. |
| CP-CMP-0036 | RF-CMP-036; M12 §5.3; PRO-O8-01 | O8 | Estándar | seguridad | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Aprobación masiva de SA filtradas por fecha y modalidad, con la misma capability e historial por documento. | Las SA para las que el usuario no tiene banda quedan rechazadas en el resultado con causa. |
| CP-CMP-0037 | RF-CMP-037; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Mostrar disponibilidad comprometida del producto: saldo de OC abiertas, facturas pendientes de recepción y presupuestos aprobados con obra (M11), junto con el stock de M13. | Al pedir 10 módems se ve que hay 4 en OC abiertas. |
| CP-CMP-0038 | RF-CMP-038; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Conceptos: "Flete", "Mantenimiento", "Servicios públicos", "Anticipo a proveedores" | Advertir si ya existe un pedido abierto del mismo producto o concepto (SA sin recibir u OC con saldo pendiente). | La búsqueda funciona igual para productos y conceptos. |
| CP-CMP-0039 | RF-CMP-039; M12 §5.3; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Solicitar cotización de los materiales de una SA por mail con plantilla (P2888). | El mail llega con los ítems y el enlace al portal. |
### 1.4 Cotizaciones, concursos y licitaciones (M12 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0040 | RF-CMP-040; M12 §5.4; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Generar solicitudes de cotización a uno o varios proveedores desde SA aprobadas (una por proveedor, agrupadas), con vencimiento configurable (default 15 días), moneda y cotización. | Tres proveedores invitados generan tres cotizaciones del mismo grupo. |
| CP-CMP-0041 | RF-CMP-041; M12 §5.4; PRO-O8-01 | O8 | Estándar | regla | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar enviada o… | Una cotización cotizada exige costo ≠ 0 en todos sus ítems. |
| CP-CMP-0042 | RF-CMP-042; M12 §5.4; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Cuadro comparativo de cotizaciones hermanas por ítem (precio, total en pesos P3119, plazo, valoración del proveedor) y últimas cotizaciones/órdenes del producto. | Si la SA se cotizó a un solo proveedor, se informa que no hay comparación. |
| CP-CMP-0043 | RF-CMP-043; M12 §5.4; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Evaluar/adjudicar por ítem (contratado o descartado) con ajuste de cantidad y justificación cuando no se elige el menor precio. | Adjudicar un precio no mínimo exige justificación. |
| CP-CMP-0044 | RF-CMP-044; M12 §5.4; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura, planilla de… | Ninguna oferta es visible para compras antes de la apertura. |
| CP-CMP-0045 | RF-CMP-045; M12 §5.4; PRO-O8-01 | O8 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Generar la OC desde los ítems adjudicados. | Un ítem adjudicado no genera dos OC. |
### 1.5 Órdenes de compra (M12 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0050 | RF-CMP-050; M12 §5.5; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Alta de OC: proveedor, fecha, forma y condición de pago, plazo y lugar de entrega, fecha de entrega (obligatoria si P2735), fecha estimada de pago (obligatoria si P2810), solicitante (usuario si P2447), firmante, departamento, moneda… | Con P2335, una OC sin todos los campos obligatorios no se emite. |
| CP-CMP-0051 | RF-CMP-051; M12 §5.5; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Cada línea de OC identifica servicio, destino (depósito/OT/obra con P3101), centro de costo y, si abastece varios servicios, una **distribución explícita** (porcentaje o cantidad) que suma 100 % sin duplicar el total. | Una OC de ARS 40.000 compartida 50/50 entre INT y TV informa ARS 20.000 por servicio y ARS 40.000 en total. |
| CP-CMP-0052 | RF-CMP-052; M12 §5.5; PRO-O8-02 | O8 | Núcleo | seguridad | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Aprobación de OC por bandas de monto y categoría en T11 (reemplaza P2377/P2382: "autorizada por defecto" o "pendiente si supera monto"), con capability y segregación; una OC no aprobada no se envía ni se recibe. | Con banda "≥ ARS 500.000 requiere gerencia", una OC de ARS 600.000 queda `pendingApproval` hasta que gerencia apruebe. |
| CP-CMP-0053 | RF-CMP-053; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Enviar la OC al proveedor por mail con plantilla (P2905) y publicarla en el portal; el proveedor confirma recepción y fecha comprometida. | La OC enviada registra fecha, canal y confirmación. |
| CP-CMP-0054 | RF-CMP-054; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | OC abierta (marco) con precio y cantidad máximos por vigencia y **liberaciones** parciales (reemplaza la nota de pedido); consumo del saldo marco. | Una liberación que supera el saldo del marco se rechaza. |
| CP-CMP-0055 | RF-CMP-055; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Modificar una OC aprobada crea una nueva versión que vuelve a aprobación si cambia importe, proveedor o condiciones por encima de la tolerancia; historial de versiones. | La recepción se valida contra la versión vigente. |
| CP-CMP-0056 | RF-CMP-056; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Cerrar (saldo no se recibirá) o cancelar una OC con motivo, liberando el compromiso de fondos. | `cmp.purchaseOrder.cancelled` libera el remanente en M14. |
| CP-CMP-0057 | RF-CMP-057; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | Publicar el compromiso de fondos al aprobar la OC (`cmp.purchaseOrder.approved`) con importe, moneda, fecha estimada de pago, servicio y centro de costo. | El informe distingue comprometido, devengado y pagado. |
| CP-CMP-0058 | RF-CMP-058; M12 §5.5; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Al importar ítems de OC en remito o factura, copiar el motivo de compra a observaciones (P2647) y tomar el % de IVA del documento origen (P2690/P2791) o el del producto. | La alícuota tomada se muestra y puede corregirse con permiso. |
| CP-CMP-0059 | RF-CMP-059; M12 §5.5; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". | La bandeja de aprobación muestra solo las de la banda del usuario. |
### 1.6 Recepción y remito de proveedor (M12 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0060 | RF-CMP-060; M12 §5.6; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Registrar la recepción (remito del proveedor) contra una o varias OC aprobadas, por cantidades parciales, con número del proveedor cuando el comprobante informa impuestos, depósito/destino, series y lotes (capturados en M13), receptor y… | CU-19: OC de 10, recepción de 6 → OC `partiallyReceived` con 4 pendientes. |
| CP-CMP-0061 | RF-CMP-061; M12 §5.6; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | La recepción **no mueve stock en M12**: publica `cmp.receipt.confirmed` y M13 registra el ingreso físico; si M13 rechaza (depósito, serie), la recepción queda `stockPending` con alerta. | Ningún documento de M12 escribe movimientos de stock. |
| CP-CMP-0062 | RF-CMP-062; M12 §5.6; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Conformidad de servicios sin recepción material (mantenimiento, honorarios): el responsable del servicio registra la conformidad total o parcial. | Una factura de servicio sin conformidad queda retenida. |
| CP-CMP-0063 | RF-CMP-063; M12 §5.6; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Excesos de entrega: aceptar hasta la tolerancia configurada; por encima, rechazar o pedir aprobación. | Con tolerancia 0 %, recibir 11 de 10 exige aprobación. |
| CP-CMP-0064 | RF-CMP-064; M12 §5.6; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Devoluciones al proveedor: remito de devolución que reabre o reduce el pendiente de la OC, solicita a M13 la salida y espera NC del proveedor. | La devolución queda vinculada a la NC cuando llega. |
| CP-CMP-0065 | RF-CMP-065; M12 §5.6; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Opciones de carga: mostrar solo OC al importar ítems en remitos (P2649), no pedir depósito para productos sin stock (P2560), avisar si el producto no controla stock (P2989), cargar ítem "pendiente" (recibido sin ingreso) por defecto si… | Cada opción es configurable y se documenta en la ayuda. |
| CP-CMP-0066 | RF-CMP-066; M12 §5.6; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Cantidades con hasta los decimales de la unidad de medida del producto; la opción de 4 decimales para productos con stock (P2691) se reemplaza por la precisión de la unidad. | Una unidad "unidad" admite 0 decimales; "metro", hasta 3. |
| CP-CMP-0067 | RF-CMP-067; M12 §5.6; PRO-O3-03 | O3 | Núcleo | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Registro simplificado de ingreso de equipos serializados del piloto (OC opcional, proveedor del padrón mínimo, series). | OC-DEMO-002: 2 módems, series registradas en M13. |
### 1.7 Comprobantes de proveedor (M12 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0070 | RF-CMP-070; M12 §5.7; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Registrar facturas, ND, NC, tickets y recibos de proveedor: tipo, punto de venta, número, fecha, fecha contable, vencimiento(s), moneda/cotización, CAE/CAI, netos gravados por alícuota, no gravado, exento, IVA por alícuota, percepciones… | El total = gravado + no gravado + exento + IVA + percepciones + impuestos + otros. |
| CP-CMP-0071 | RF-CMP-071; M12 §5.7; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Validaciones al registrar: proveedor, tipo, punto y número obligatorios; año razonable; período abierto de Compras, Stock y Contable; sin precios en cero; tipo permitido para la condición de IVA del proveedor (bloqueo o advertencia con… | Un comprobante duplicado devuelve `cmp/duplicate-invoice` con enlace al existente. |
| CP-CMP-0072 | RF-CMP-072; M12 §5.7; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Diferencia admitida entre el total y la suma de componentes y entre cabecera e ítems: hasta P2057 (default ARS 0,50); controles de IVA de cabecera vs ítems y de cada ítem recalculado con su alícuota. | Una diferencia de ARS 0,60 con límite 0,50 impide registrar. |
| CP-CMP-0073 | RF-CMP-073; M12 §5.7; PRO-O8-02 | O8 | Estándar | integración | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Consultar CAE/CAI del comprobante en ARCA (M06) al cargar (P2977) y advertir si no existe. | Un CAE inexistente queda con advertencia visible. |
| CP-CMP-0074 | RF-CMP-074; M12 §5.7; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Autocompletar fecha contable y vencimiento (P2388) con vencimiento por defecto (P2026 → días desde fecha); fecha contable en período abierto (P580 reemplazado por períodos). | La fecha contable propuesta pertenece a un período abierto. |
| CP-CMP-0075 | RF-CMP-075; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Descuento global como ítem negativo del concepto configurado (P2403, obligatorio si se usan descuentos). | Sin concepto configurado, el descuento global no se habilita. |
| CP-CMP-0076 | RF-CMP-076; M12 §5.7; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Recepciones: REC-DEMO-001 (6 medidores); REC-DEMO-002 (2 módems con series de prueba) | Importar ítems desde OC y/o recepciones (pendientes), y también facturar antes de recibir (factura anticipada: luego la recepción consume el pendiente de la factura, relación 5 → 4). | La factura anticipada queda retenida para pago hasta la recepción (§9.3). |
| CP-CMP-0077 | RF-CMP-077; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Recepciones: REC-DEMO-001 (6 medidores); REC-DEMO-002 (2 módems con series de prueba) | Actualización del costo de compra del producto al registrar (salvo P264), preguntando antes si P426, usando el precio unitario neto del comprobante; registro del costo anterior. La valorización de stock es de M13 y **no** se reescribe el… | M13 recibe el costo facturado como ajuste de costo, no como reescritura del movimiento. |
| CP-CMP-0078 | RF-CMP-078; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Registrar observación obligatoria al modificar un concepto en un comprobante (P2533) e historial de cambios. | La modificación muestra valor anterior y nuevo. |
| CP-CMP-0079 | RF-CMP-079; M12 §5.7; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Lookups: Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios | Imputación: servicio del cliente en el comprobante (P2277), obra por ítem (P3101), centros de costo y grupos de secciones (P2896) con % de IVA por sección (P2902) y reglas de asignación automática; IVA no tomado como gasto (P2890, efecto… | La distribución por centro de costo suma 100 % del neto. |
| CP-CMP-0080 | RF-CMP-080; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Rubro de vivienda: si el comprobante es del rubro P2502, sus productos deben ser del rubro P2503. | Un producto de otro rubro se rechaza en ese comprobante. |
| CP-CMP-0081 | RF-CMP-081; M12 §5.7; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Comprobantes en cuotas (vencimientos múltiples con periodicidad). | La suma de vencimientos = total. |
| CP-CMP-0082 | RF-CMP-082; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Anticipos a proveedores sin factura (concepto P2035, sin rubro si P2017) y su posterior aplicación contra facturas; informar anticipos pendientes al pagar (P2777). | Un anticipo aplicado reduce el saldo de la factura y queda trazado. |
| CP-CMP-0083 | RF-CMP-083; M12 §5.7; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Anular un comprobante: nunca se borra; se marca anulado con motivo si no tiene OP aplicada ni período cerrado; libera vínculos (recepción, portal, IA, combustible) y emite evento de reversión. | El comprobante anulado sigue consultable. |
| CP-CMP-0084 | RF-CMP-084; M12 §5.7; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Opciones de carga e impresión: consultar si imprimir al registrar (P2424), separar comprobantes en libro IVA por defecto (P832, dato para M06), informe de libro IVA compras personalizado (P382, en M06), informe particularizado de… | P832 se guarda en el comprobante y M06 lo respeta. |
| CP-CMP-0085 | RF-CMP-085; M12 §5.7; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Comprobantes de compra de energía y otros insumos regulados, disponibles para M03/M06 (balance energético, informes a reguladores). | El comprobante marcado "compra de energía" es consultable por M03. Detalle del circuito de energía y gas en RF-CMP-149…153 (HUE-ELE-01, HUE-GAS-04). |
| CP-CMP-0086 | RF-CMP-086; M12 §5.7; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Integración con sueldos: comprobantes de proveedores-empleado y recibos pagados por OP (P2366) se informan a M16 sin que M12 genere novedades. | Con integración activa, M16 recibe el evento de pago. |
### 1.8 Control de 3 vías y habilitación de pago (M12 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0090 | RF-CMP-090; M12 §5.8; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Conciliar automáticamente cada línea de factura con OC y recepción: cantidad facturada ≤ cantidad recibida (o conformada) + tolerancia; precio facturado = precio de OC ± tolerancia (porcentaje y monto); condiciones (moneda, plazo) iguales. | AGR-027: pedidos 10, recibidos 6, facturados 10 → excepción de cantidad por 4 y pago habilitado solo por 6 o bloqueado según política. |
| CP-CMP-0091 | RF-CMP-091; M12 §5.8; PRO-O8-02 | O8 | Núcleo | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. | Ninguna factura con excepción abierta se incluye en una OP. |
| CP-CMP-0092 | RF-CMP-092; M12 §5.8; PRO-O8-02 | O8 | Núcleo | seguridad | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | Habilitación de pago: automática si la factura concilia sin excepciones abiertas; manual con capability `cmp.pago.habilitar` y motivo en los demás casos. Reemplaza P2201/P2457 ("pago autorizado / no autorizado / autorizar mayores a monto"). | Habilitar sin permiso devuelve 403. |
| CP-CMP-0093 | RF-CMP-093; M12 §5.8; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Compras sin OC: permitidas solo para categorías definidas (servicios públicos, impuestos, caja chica, gastos menores a un umbral), con aprobación posterior; informe de facturas sin OC. | Una factura sin OC fuera de las categorías crea excepción `withoutPO`. |
| CP-CMP-0094 | RF-CMP-094; M12 §5.8; PRO-O8-02 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Tablero de conciliación: facturas conciliadas, con excepción, retenidas, habilitadas; recepciones sin factura (pendientes de facturar) y facturas sin recepción. | El tablero cuadra con el saldo de proveedores a la fecha de corte. |
### 1.9 Órdenes de pago (M12 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0100 | RF-CMP-100; M12 §5.9; PRO-O8-03 | O8 | Núcleo | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Preparar la OP: proveedor (o proveedor "paga a otros" con comprobantes de otros proveedores), selección de comprobantes habilitados con saldo (pago total o parcial), NC y anticipos a aplicar, anticipos nuevos sin factura, descuento, fecha… | El importe aplicado a una factura no supera su saldo. |
| CP-CMP-0101 | RF-CMP-101; M12 §5.9; PRO-O8-03 | O8 | Núcleo | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Calcular las retenciones invocando el motor de M06 (`fis.service.calculateWithholdings`, antes `fis.withholding.calculate`) con proveedor, comprobantes, componentes, formalidad, anticipos y fecha; mostrar por régimen base, mínimo, escala… | CU-FIS-01: base 100.000, retención 2.000, neto 98.000. |
| CP-CMP-0102 | RF-CMP-102; M12 §5.9; PRO-O8-03 | O8 | Núcleo | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Habilitación por régimen (P2037 IIBB, P2039 IVA, P2041 Ganancias, P2043 SUSS), no retener en comprobantes no formales (P410), IVA presunto en anticipos y comprobantes sin IVA discriminado (P2310), no retener en anticipos (P409), código de… | Con P2041 desactivado no se propone retención de Ganancias. |
| CP-CMP-0103 | RF-CMP-103; M12 §5.9; PRO-O8-03 | O8 | Estándar | seguridad | TEN-001 con Retención: RET-DEMO-001 por ARS 2.000 (M06) | Ajuste manual de una retención (P2836) solo con capability `cmp.retenciones.ajustar`, motivo y aprobación; queda el valor calculado y el ajustado. | Un ajuste sin motivo se rechaza. |
| CP-CMP-0104 | RF-CMP-104; M12 §5.9; PRO-O8-03 | O8 | Núcleo | seguridad | TEN-001 con SA: SA-DEMO-001 (10 medidores, aprobada); SA-DEMO-002 (concurso por ARS 3.000.000) | Aprobar la OP por bandas T11 y segregación; al aprobar: M06 confirma retenciones y numera certificados; M12 publica `cmp.paymentOrder.approved` con bruto, retenciones, neto, CBU validado y vencimiento para que M14 ejecute (medios, firmas… | Una OP no aprobada no aparece en la bandeja de M14. |
| CP-CMP-0105 | RF-CMP-105; M12 §5.9; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Certificados de retención: imprimir/enviar automáticamente al aprobar por régimen (P2038, P2040, P2042, P2044), con punto de venta de IIBB (P2012) y fecha de información según día límite (P2045), generados por M06. | El certificado se envía al proveedor por mail/portal. |
| CP-CMP-0106 | RF-CMP-106; M12 §5.9; PRO-O8-03 | O8 | Núcleo | regla | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Al recibir `tes.paymentExecution.executed`, marcar la OP pagada, cancelar saldos y actualizar la cuenta corriente; con `tes.paymentExecution.voided` o anulación de la OP, reponer saldos, anular anticipos generados (si su contraparte no fue… | La anulación nunca borra registros; repone exactamente los saldos aplicados. |
| CP-CMP-0107 | RF-CMP-107; M12 §5.9; PRO-O8-03 | O8 | Núcleo | regla | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | El saldo de la factura se reduce al aprobar la OP (comprometido para pago) y se considera cancelado al ejecutarse; no se pisa el vencimiento original. | El informe de antigüedad usa el vencimiento original. |
| CP-CMP-0108 | RF-CMP-108; M12 §5.9; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Opciones de OP: imprimir al emitir (P2018), mostrar asiento contable propuesto (P2308, desde M15), permitir modificar la fecha de la OP (P2572), pagar facturas con fecha contable posterior al pago (P110), plantilla para envío masivo de OP… | El envío masivo usa la plantilla configurada. |
| CP-CMP-0109 | RF-CMP-109; M12 §5.9; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Adelantos de sueldo a empleados (concepto P2034, tipo de novedad P2538) no se gestionan como OP de compras: se derivan a M16. | Una OP a un proveedor-empleado con concepto de adelanto se rechaza con enlace a M16. |
| CP-CMP-0110 | RF-CMP-110; M12 §5.9; PRO-O9-07 | O9 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Pagos de recibos de sueldo mediante OP solo si M16 lo solicita (lote aprobado); M12 no borra facturas de sueldo al anular. | La anulación avisa a M16 en lugar de borrar. |
| CP-CMP-0111 | RF-CMP-111; M12 §5.9; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Consultar pagos pendientes de salida (efectivo pendiente de caja), pagos diferidos y estado de ejecución informado por M14. | El informe se abre por medio con fila de total. |
| CP-CMP-0112 | RF-CMP-112; M12 §5.9; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Portal de proveedores: el proveedor ve OC, estado de sus comprobantes (pendiente, registrado, rechazado con motivo, habilitado, en pago, pagado) y descarga certificados de retención y comprobantes de pago. | Los estados se derivan de §8, sin la ambigüedad del estado "A". |
### 1.10 Importación de Mis Comprobantes, portal e IA (M12 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0120 | RF-CMP-120; M12 §5.10; PRO-O8-03 | O8 | Estándar | integración | TEN-001 con Mis Comprobantes: REG-DEMO: 5 comprobantes recibidos no registrados (lote ficticio) | Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear **borradores** de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por alícuota)… | Un comprobante importado nunca queda registrado sin confirmación humana. |
| CP-CMP-0121 | RF-CMP-121; M12 §5.10; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Informe de diferencias entre compras registradas y Mis Comprobantes (faltantes, sobrantes, importes distintos), con acceso al borrador o al registrado. | El informe cuadra con la conciliación de M06 del mismo período. |
| CP-CMP-0122 | RF-CMP-122; M12 §5.10; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Recibir comprobantes cargados por el proveedor en el portal (datos + PDF), rechazar duplicados (CUIT + tipo + punto + número), revisar y registrar o rechazar con motivo. | El proveedor ve el motivo del rechazo. |
| CP-CMP-0130 | RF-CMP-130; M12 §5.10; PRO-O11-05 | O11 | Estándar | regla | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Lectura de facturas de proveedor (PDF/imagen) con IA: extrae cabecera, importes y alícuotas, distingue a la cooperativa (CUIT y razón social del tenant, P518/P519) del emisor, propone proveedor, ítems e imputación; una persona revisa… | La propuesta muestra la confianza por campo; nada se registra sin confirmación. |
| CP-CMP-0131 | RF-CMP-131; M12 §5.10; PRO-O11-05 | O11 | Estándar | seguridad | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Auditoría de cada uso de IA (tipo, documento, modelo, tokens, usuario, resultado aceptado/corregido) sin guardar datos personales innecesarios; activación por tenant con acuerdo de tratamiento de datos. La auditoría por persona es… | El tenant ve el consumo y la tasa de corrección. |
### 1.11 Informes y transversales (M12 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0140 | RF-CMP-140; M12 §5.11; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Informes de compras (sección 15): SA por estado y aprobación, cotizaciones y comparativos, OC pendientes de recepción, recepciones pendientes de facturar, facturas sin OC, diferencias de comprobantes, cuenta corriente y antigüedad de… | Cada informe declara fórmula, universo y fecha de corte. |
| CP-CMP-0141 | RF-CMP-141; M12 §5.11; PRO-O8-03 | O8 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Trazabilidad documento a documento por ítem (origen y destino con cantidades y precios) en todos los documentos, no solo en el primer ítem. | Cada línea muestra SA, cotización, OC, recepción y factura vinculadas. |
| CP-CMP-0142 | RF-CMP-142; M12 §5.11; PRO-O8-03 | O8 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Respetar el cierre de períodos de Compras (P500), Stock y Contable mediante la entidad unificada de períodos (T04/M15). | Un comprobante con fecha contable en período cerrado se rechaza. |
| CP-CMP-0143 | RF-CMP-143; M12 §5.11; PRO-O8-03 | O8 | Núcleo | migración | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Identificadores internos por documento (ObjectId) y numeración legible por tipo y punto; los ID compuestos de ProCoop se conservan como referencia de migración. | No se usan claves concatenadas como identidad. |
| CP-CMP-0144 | RF-CMP-144; M12 §5.11; PRO-O8-03 | O8 | Núcleo | regla | TEN-001 con Retención: RET-DEMO-001 por ARS 2.000 (M06) | Integrar el efecto contable en línea (DEC-009): cada comprobante, recepción con pendiente, retención y OP publica su evento con imputación para M15; cuenta de compras por defecto del proveedor (P2112) y cuenta de productos pendientes de… | Anular un comprobante genera la reversión contable vinculada. |
| CP-CMP-0145 | RF-CMP-145; M12 §5.11; PRO-O8-03 | O8 | Núcleo | seguridad | TEN-001 con Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) | Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. | Un proveedor del portal de TEN-001 no ve datos de TEN-002 aunque tenga el mismo CUIT. |
| CP-CMP-0146 | RF-CMP-146; M12 §5.11; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Conceptos: "Flete", "Mantenimiento", "Servicios públicos", "Anticipo a proveedores" | Copiar entre tenants la configuración de M12 (conceptos, modalidades, políticas, plantillas), sin proveedores ni operaciones. | La copia no incluye datos de terceros. |
| CP-CMP-0147 | RF-CMP-147; M12 §5.11; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo" | Integración con fabricación: las opciones de partes de producción (P2967, P3043, P3057, P3171) pertenecen a M13; M12 solo recibe SA de fabricación. | M12 no ofrece opciones de partes de producción; las SA de fabricación recibidas desde M13 se procesan como cualquier SA con su origen identificado. |
| CP-CMP-0148 | RF-CMP-148; M12 §5.11; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Rubros: "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" | Parámetros de caja de pagos y medios (P134, P135, P144, P146, P402, P2000–P2004, P2015, P2016, P2025, P2065, P2079, P2433, P2573, P3044, P2952) pertenecen a M14; M12 los respeta al preparar la OP (por ejemplo, pago diferido solo a rubros… | La OP propone medios compatibles con la configuración de M14. |
### 1.12 Abastecimiento mayorista y derechos de señales (M12 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CMP-0149 | RF-CMP-149; M12 §5.12; PRO-O8-02 | O8 | Núcleo | integración | TEN-001 con Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"… | Recibir la factura mensual del mayorista de energía (EPEC u otro mayorista configurado) por archivo (FI-INT-33) o carga manual, como comprobante de proveedor con `wholesaleSupply.kind = energy` y detalle por punto de compra o frontera… | Importar dos veces el mismo archivo no duplica el comprobante (idempotencia por proveedor + tipo + punto de venta + número); cada renglón queda vinculado a un `meteringPointId` de M03 o falla con `cmp/supply-point-unknown`. |
| CP-CMP-0150 | RF-CMP-150; M12 §5.12; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Controlar cada renglón de la factura mayorista contra la medición propia del mismo punto y período de M03 (puntos `purchase`/`boundary`, RF-MED-012, RF-MED-100), obtenida con API-MED-78 `GET /api/admin/med/purchase-volumes` (RF-MED-129)… | Con tolerancia 1 %, factura de 100.000 kWh y medición propia de 98.000 kWh, se crea la excepción por 2.000 kWh y el comprobante queda `paymentRelease = blocked`; sin medición propia del período, la excepción es `meteringMissing`. |
| CP-CMP-0151 | RF-CMP-151; RN-TAR-227; M12 §5.12; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) | Balance mensual comprado contra facturado por servicio y zona: cantidad comprada (facturas mayoristas aprobadas), cantidad medida en frontera (M03, API-MED-78 / RF-MED-129), cantidad facturada a usuarios del mismo período (consumos… | Comprado 100.000 kWh y facturado 91.000 kWh → pérdida 9.000 kWh (9 %); el balance usa la misma fecha de corte que el informe de pérdidas de M03 y no modifica tarifas (RN-TAR-227). |
| CP-CMP-0152 | RF-CMP-152; RN-TAR-035; M12 §5.12; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Recibir la factura de la distribuidora de gas (archivo FI-INT-115 de T06 o carga manual) con `wholesaleSupply.kind = gas`: m³ por punto de compra, poder calorífico o factor de corrección informado, cargos fijos, transporte y tributos… | Una factura de gas con factor de corrección distinto del vigente en M04 genera excepción `meteringMismatch` aunque los m³ sin corregir coincidan con los de M03. |
| CP-CMP-0153 | RF-CMP-153; RN-CON-069; M12 §5.12; PRO-O8-02 | O8 | Núcleo | regla | TEN-001 con OC: OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT) | Publicar el registro del comprobante mayorista (EVT-CMP-08) con `supplyKind` y rol de costo de abastecimiento para que M15 registre el costo por servicio (RN-CON-069); nunca se genera un cargo o recargo al usuario desde M12. | El asiento de una factura mayorista imputa costo de abastecimiento del servicio ELE o GAS; anular el comprobante genera la reversión vinculada. |
| CP-CMP-0154 | RF-CMP-154; M12 §5.12; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con OC: OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT) | Contratos de derechos de señales de TV por programadora: señales o paquetes alcanzados, precio por abonado activo, mínimo garantizado, moneda, vigencia y base de cómputo (PRM-CMP-115). | No se puede liquidar un período sin contrato vigente para la programadora. |
| CP-CMP-0155 | RF-CMP-155; M12 §5.12; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 | Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 `GET… | Con 1.200 abonados del paquete básico a ARS 150 y mínimo ARS 150.000, la liquidación es ARS 180.000; con 800 abonados es ARS 150.000 (mínimo). Una factura por 1.250 abonados genera excepción de cantidad por 50. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-CMP-5001 — ESC-CMP-01. CU-19 recepción parcial**

- Cubre: ESC-CMP-01; relacionados: CU-19; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CU-19 recepción parcial
- Entonces OC con 4 pendientes; no `received`.

**CP-CMP-5002 — ESC-CMP-02. AGR-027 10/6/10**

- Cubre: ESC-CMP-02; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando AGR-027 10/6/10
- Entonces Excepción; no se paga como recibido todo.

**CP-CMP-5003 — ESC-CMP-03. Precio facturado 5 % mayor, tolerancia 2 %**

- Cubre: ESC-CMP-03; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Precio facturado 5 % mayor, tolerancia 2 %
- Entonces Excepción de precio.

**CP-CMP-5004 — ESC-CMP-04. Diferencia de total ARS 0,60 con límite 0,50**

- Cubre: ESC-CMP-04; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Diferencia de total ARS 0,60 con límite 0,50
- Entonces No se registra (`cmp/total-mismatch`).

**CP-CMP-5005 — ESC-CMP-05. Comprobante duplicado**

- Cubre: ESC-CMP-05; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comprobante duplicado
- Entonces `cmp/duplicate-invoice`.

**CP-CMP-5006 — ESC-CMP-06. Procesar ítem de SA no aprobada (defecto ProCoop)**

- Cubre: ESC-CMP-06; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: SA: SA-DEMO-001 (10 medidores, aprobada); SA-DEMO-002 (concurso por ARS 3.000.000)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Procesar ítem de SA no aprobada (defecto ProCoop)
- Entonces `cmp/request-not-approved`.

**CP-CMP-5007 — ESC-CMP-07. SA de hace 45 días con vigencia 30**

- Cubre: ESC-CMP-07; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando SA de hace 45 días con vigencia 30
- Entonces No aparece en pendientes.

**CP-CMP-5008 — ESC-CMP-08. Aprobación masiva de OC sin banda suficiente**

- Cubre: ESC-CMP-08; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aprobación masiva de OC sin banda suficiente
- Entonces Rechazo por documento con causa.

**CP-CMP-5009 — ESC-CMP-09. Factura de servicio sin conformidad**

- Cubre: ESC-CMP-09; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: OC: OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura de servicio sin conformidad
- Entonces `onHold`.

**CP-CMP-5010 — ESC-CMP-10. Factura sin OC de categoría no permitida**

- Cubre: ESC-CMP-10; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"; PROV-DEMO-003 "Equipos de Red Demo SA" (módems); PROV-DEMO-004 "Servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura sin OC de categoría no permitida
- Entonces Excepción `withoutPO`.

**CP-CMP-5011 — ESC-CMP-11. CU-FIS-01**

- Cubre: ESC-CMP-11; relacionados: CU-FIS-01; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Retención: RET-DEMO-001 por ARS 2.000 (M06)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CU-FIS-01
- Entonces Retención 2.000, neto 98.000, factura cancelada por 100.000.

**CP-CMP-5012 — ESC-CMP-12. Anulación de OP ejecutada**

- Cubre: ESC-CMP-12; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Anulación de OP ejecutada
- Entonces Exige anular primero en M14; luego repone saldos y anula retenciones conservando importes.

**CP-CMP-5013 — ESC-CMP-13. OP con transferencia a CBU pendiente de aprobación**

- Cubre: ESC-CMP-13; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: CBU: Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando OP con transferencia a CBU pendiente de aprobación
- Entonces `cmp/bank-account-not-approved`.

**CP-CMP-5014 — ESC-CMP-14. Deshacer vínculo con cantidad 2,5**

- Cubre: ESC-CMP-14; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Deshacer vínculo con cantidad 2,5
- Entonces Repone 2,5 (no 2).

**CP-CMP-5015 — ESC-CMP-15. Compra compartida 50/50 INT/TV por ARS 40.000**

- Cubre: ESC-CMP-15; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: OC: OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Compra compartida 50/50 INT/TV por ARS 40.000
- Entonces Informe por servicio 20.000 + 20.000; total 40.000.

**CP-CMP-5016 — ESC-CMP-16. Borrador desde Mis Comprobantes sin revisión**

- Cubre: ESC-CMP-16; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Borrador desde Mis Comprobantes sin revisión
- Entonces No impacta libro IVA ni cuenta corriente.

**CP-CMP-5017 — ESC-CMP-17. Proveedor del portal de TEN-001 consulta OC de TEN-002 con mismo CUIT**

- Cubre: ESC-CMP-17; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M12 §18.
- Datos de prueba: Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Proveedor del portal de TEN-001 consulta OC de TEN-002 con mismo CUIT
- Entonces 404.

**CP-CMP-5018 — ESC-CMP-18. Recepción rechazada por M13 (serie duplicada)**

- Cubre: ESC-CMP-18; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recepción rechazada por M13 (serie duplicada)
- Entonces `stockStatus = rejected` y alerta; la OC no se da por recibida.

**CP-CMP-5019 — ESC-CMP-19. Pagar factura: vencimiento original**

- Cubre: ESC-CMP-19; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pagar factura: vencimiento original
- Entonces El informe de antigüedad conserva el vencimiento original.

**CP-CMP-5020 — ESC-CMP-20. Adelanto de sueldo desde OP**

- Cubre: ESC-CMP-20; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Adelanto de sueldo desde OP
- Entonces Rechazo con derivación a M16.

**CP-CMP-5021 — ESC-CMP-21. Factura mayorista de energía ficticia por 100.000 kWh en el punto de frontera FR-DEMO-01; M03 midió 98.000 kWh; tolerancia 1 % (HUE-ELE-01)**

- Cubre: ESC-CMP-21; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura mayorista de energía ficticia por 100.000 kWh en el punto de frontera FR-DEMO-01; M03 midió 98.000 kWh; tolerancia 1 % (HUE-ELE-01)
- Entonces Excepción `meteringMismatch` por 2.000 kWh; `paymentRelease = blocked` hasta la decisión.

**CP-CMP-5022 — ESC-CMP-22. Factura de gas de la distribuidora sin medición propia del período en M03 (HUE-GAS-04)**

- Cubre: ESC-CMP-22; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura de gas de la distribuidora sin medición propia del período en M03 (HUE-GAS-04)
- Entonces Excepción `meteringMissing`; JOB-CMP-10 la reevalúa al llegar la medición.

**CP-CMP-5023 — ESC-CMP-23. Balance del período: comprado 100.000 kWh, facturado a usuarios 91.000 kWh (HUE-ELE-01)**

- Cubre: ESC-CMP-23; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Balance del período: comprado 100.000 kWh, facturado a usuarios 91.000 kWh (HUE-ELE-01)
- Entonces Pérdida 9.000 kWh (9 %); al aprobar se publica EVT-CMP-16; ningún usuario recibe recargo.

**CP-CMP-5024 — ESC-CMP-24. Programadora PROG-DEMO-01, paquete básico a ARS 150 por abonado, mínimo ARS 150.000; M02 informa 1.200 abonados activos (HUE-TV-01)**

- Cubre: ESC-CMP-24; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Programadora PROG-DEMO-01, paquete básico a ARS 150 por abonado, mínimo ARS 150.000; M02 informa 1.200 abonados activos (HUE-TV-01)
- Entonces Liquidación ARS 180.000; al aprobar se publica EVT-CMP-17 y M15 devenga el costo.

**CP-CMP-5025 — ESC-CMP-25. Reejecutar JOB-CMP-09 del mismo período con la liquidación ya aprobada (HUE-TV-01)**

- Cubre: ESC-CMP-25; M12 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: SA: SA-DEMO-001 (10 medidores, aprobada); SA-DEMO-002 (concurso por ARS 3.000.000)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reejecutar JOB-CMP-09 del mismo período con la liquidación ya aprobada (HUE-TV-01)
- Entonces No se crea otra liquidación; una corrección se registra como ajuste del período siguiente.

## 3. Casos por caso de uso (CU)

**CP-CMP-8001 — CU-19. Compra con entrega parcial (BASE §19)**

- Cubre: CU-19; M12 §16
- Ola: O8 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado TEN-001; proveedor PROV-DEMO-002; producto "Medidor monofásico". -; actor: depósito (solicitante), comprador, aprobador, receptor, cuentas a pagar. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando SA de 10 medidores → aprobación → cotizaciones y comparación → OC-001 por 10 × ARS 20.000 = ARS 200.000 (aprobada por banda) → recepción de 6 → OC con 4 pendientes (no se da por entregado todo). - Excepción: la factura llega por 10 o con precio ARS 21.000: excepción de cantidad (4 unidades) o de precio (5 % > tolerancia 2 %); la factura queda retenida antes de autorizar el pago. -
- Entonces Compra de ARS 200.000 base; 6 recibidas, 4 pendientes; pago solo de lo conciliado o tras decisión.

**CP-CMP-8002 — CU-OPE-01. Compra de módems por servicio (BASE §78)**

- Cubre: CU-OPE-01; RN-VEN-006; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: OC: OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando OC-DEMO-002 por 2 módems a ARS 20.000 (total ARS 40.000) con servicio INT en la línea → recepción con series (M13) → un módem se asigna a instalador y se aplica a una OT, el otro queda disponible (M13) → factura y OP siguen cuentas a pagar y tesorería. - Control: el costo del módem no se transforma en cargo al socio (M11 RN-VEN-006); la existencia no se reduce dos veces.
- Entonces Se completa «Compra de módems por servicio (BASE §78)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8003 — CU-FIS-01. Pago con retención (BASE §61, compartido con M06/M14)**

- Cubre: CU-FIS-01; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"; PROV-DEMO-003 "Equipos de Red Demo SA" (módems); PROV-DEMO-004 "Servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando OP a PROV-DEMO-001 por factura de ARS 100.000 → M06 determina RET-DEMO-001 por ARS 2.000 → neto ARS 98.000 → aprobación → M14 paga 98.000 → la factura queda cancelada por 100.000; M06 genera certificado y obligación. - Control: un reintento no genera otra retención; exportar no es presentar.
- Entonces Se completa «Pago con retención (BASE §61, compartido con M06/M14)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8004 — CU-CMP-01. Control de 3 vías con excepción (AGR-027)**

- Cubre: CU-CMP-01; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Comprobantes: FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando pedidos 10, recibidos 6, facturados 10 → excepción de cantidad por 4 → el autorizador elige "reclamar NC" → se habilitan ARS 120.000 → llega NC por ARS 80.000 → excepción resuelta. -
- Entonces El pago respeta lo autorizado y el stock representa lo recibido.

**CP-CMP-8005 — CU-CMP-02. Factura recibida por el portal**

- Cubre: CU-CMP-02; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el proveedor invitado sube su factura con PDF → duplicado rechazado si ya existe → cuentas a pagar registra (importando la OC) → el proveedor ve "Registrado", luego "Habilitado", "En pago" y "Pagado" y descarga el certificado de retención.
- Entonces Se completa «Factura recibida por el portal» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8006 — CU-CMP-03. Importación desde Mis Comprobantes**

- Cubre: CU-CMP-03; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Mis Comprobantes: REG-DEMO: 5 comprobantes recibidos no registrados (lote ficticio)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M06 concilia el período y detecta 5 comprobantes recibidos no registrados → se crean 5 borradores → el administrativo completa imputación de 4 y descarta 1 (no corresponde) con motivo → la conciliación de M06 se actualiza.
- Entonces Se completa «Importación desde Mis Comprobantes» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8007 — CU-CMP-04. Lectura de factura con IA**

- Cubre: CU-CMP-04; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el usuario sube un PDF → la IA propone proveedor (por CUIT del emisor, distinto del de la cooperativa), importes y alícuotas con confianza → el usuario corrige una alícuota y registra → la auditoría registra la corrección.
- Entonces Se completa «Lectura de factura con IA» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8008 — CU-CMP-05. Concurso de precios**

- Cubre: CU-CMP-05; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Proveedores: PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"; PROV-DEMO-003 "Equipos de Red Demo SA" (módems); PROV-DEMO-004 "Servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando SA de ARS 3.000.000 supera el umbral de concurso → se publica el evento e invita a 4 proveedores → ofertas en sobre cerrado → apertura con acta → planilla de adjudicación → OC al adjudicado.
- Entonces Se completa «Concurso de precios» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-CMP-8009 — CU-CMP-06. Alta de CBU con aprobación**

- Cubre: CU-CMP-06; M12 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M12 §18.
- Datos de prueba: Portal: Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el proveedor solicita en el portal cambiar su CBU → el comprador lo carga → otro usuario aprueba tras verificación telefónica → la próxima OP usa el nuevo CBU; antes de aprobarse, la OP usa el anterior o queda sin transferencia.
- Entonces Se completa «Alta de CBU con aprobación» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio
