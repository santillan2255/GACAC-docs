# Casos de prueba de aceptación — M17 INS — Gestión institucional (asociados, capital, asambleas, consejo, INAES)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M17-INS-institucional.md`](../../especificacion/anexos/M17-INS-institucional.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 108 CP de requisitos funcionales, 22 CP de escenarios ESC y 15 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M17 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Registro de asociados (M17 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0001 | RF-INS-001; M17 §5.1; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Registrar la relación institucional de una persona del tenant como entidad propia, distinta de persona, titular, cliente, pagador, usuario y empleado. Una persona tiene a lo sumo una membresía vigente por tenant. | Una persona con tres servicios tiene una sola membresía; un cliente sin membresía puede contratar servicios si el servicio lo admite (RF-INS-009). |
| CP-INS-0002 | RF-INS-002; M17 §5.1; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Asignar un **número de asociado** visible, único en el tenant, correlativo y nunca reutilizado, independiente del identificador interno y del número de cuenta; se asigna al aprobar el ingreso. Opción de asignación manual autorizada. | Dos aprobaciones simultáneas obtienen números distintos; un número asignado manualmente que ya existe se rechaza. |
| CP-INS-0003 | RF-INS-003; M17 §5.1; PRO-O2-08 | O2 | Núcleo | regla | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | Registrar fecha de solicitud, fecha de aprobación (alta institucional), acta y reunión de consejo que aprobó el ingreso, y calcular la **antigüedad** a cualquier fecha. | La antigüedad a una fecha de corte coincide con el cálculo manual; sin acta de aprobación el estado no pasa a `active` salvo PRM-INS-005. |
| CP-INS-0004 | RF-INS-004; M17 §5.1; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Mantener el **estado institucional** con su historial (`membershipEvents`): solicitante, pendiente de aprobación, activo, suspendido, renuncia solicitada, egresado por renuncia, excluido, fallecido, rechazado, extinguido (persona jurídica). | Cada cambio guarda fecha efectiva, fecha de registro, actor, causa y documento; se puede reconstruir el estado a cualquier fecha. |
| CP-INS-0005 | RF-INS-005; M17 §5.1; PRO-O10-01 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Gestionar la **solicitud de ingreso** desde admin, mesa de entradas o PWA, con datos de la persona (de M01), aceptación del estatuto y reglamentos vigentes (versión), suscripción de capital propuesta y documentos. | La solicitud conserva la versión del estatuto aceptado y queda en estado `pendingApproval`. |
| CP-INS-0006 | RF-INS-006; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Llevar las solicitudes pendientes al **orden del día del consejo** (individual o en lote) y registrar la resolución (aprobada, rechazada con motivo, observada), actualizando el estado y el número. | Al cerrar el acta con el tema "ingreso de asociados" aprobado, las membresías incluidas pasan a `active` con número y referencia al acta. |
| CP-INS-0007 | RF-INS-007; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Registrar el **representante de asamblea / delegado** y el **distrito electoral** del asociado. | El padrón por distrito lista solo asociados del distrito; el informe de delegados muestra titulares y suplentes vigentes. |
| CP-INS-0008 | RF-INS-008; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Asociados **personas jurídicas** con representante legal designado (persona de M01) y vigencia de la representación. | Sin representante vigente, la persona jurídica figura en el padrón con la observación "sin representante acreditado". |
| CP-INS-0009 | RF-INS-009; M17 §5.1; PRO-O2-08 | O2 | Núcleo | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Distinguir **cliente no asociado**: persona con servicios y sin membresía. Configurar por servicio si exige membresía activa para contratar. | Un servicio con `requiresActiveMembership = true` rechaza el alta de un cliente no asociado con error `ins.membership.required`. |
| CP-INS-0010 | RF-INS-010; RN-INS-008; M17 §5.1; PRO-O10-01 | O10 | Núcleo | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Registrar el **egreso**: renuncia, exclusión, fallecimiento, extinción; causa catalogada, fecha efectiva, acta y documentos; aplicar validaciones configurables (servicios activos, capital integrado, cuentas). | Con PRM-INS-008 activo, un egreso con servicios activos se rechaza listando los servicios; con capital integrado se exige rescate iniciado (RN-INS-008). |
| CP-INS-0011 | RF-INS-011; M17 §5.1; PRO-O10-01 | O10 | Estándar | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Reingreso** de un ex asociado: nueva membresía o reactivación; conservar o no el número anterior según configuración. | Con PRM-INS-010 = conservar, el reingresado recupera su número; si no, recibe uno nuevo y el anterior queda reservado. |
| CP-INS-0012 | RF-INS-012; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | **Exclusión** con notificación fehaciente, plazo de apelación ante la asamblea y registro de la resolución final. | Durante el plazo de apelación el estado es `exclusionPending`; si la asamblea revoca, vuelve a `active` sin perder antigüedad. |
| CP-INS-0013 | RF-INS-013; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | Procesar el **fallecimiento** informado por M01: membresía `deceased`, alerta a secretaría, inicio de trámite de reembolso a derechohabientes y efectos en M18 (adherentes, sepelio). | El evento `per.person.deceased` deja la membresía en `deceased` con fecha de fallecimiento como fecha efectiva. |
| CP-INS-0014 | RF-INS-014; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Emitir la **credencial de asociado** (individual o masiva desde padrón), impresa y digital en PWA, con número, nombre, antigüedad, foto opcional y QR verificable de validez. | El QR leído por la app del acreditador devuelve "vigente" o "no vigente" sin exponer datos adicionales. |
| CP-INS-0015 | RF-INS-015; M17 §5.1; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Exponer el **resumen institucional** para la ficha 360 (M01) y el portal (M19): estado, número, antigüedad, capital por tipo, saldo de capital, cargos, asistencias. | El endpoint responde en menos de 500 ms y solo con datos permitidos al rol. |
| CP-INS-0016 | RF-INS-016; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Renumeración controlada** de asociados (corrección): solicitud, aprobación, auditoría y conservación del número anterior como alias; nunca reasignar un número a otra persona. | Tras renumerar, las búsquedas por número anterior encuentran al asociado y la auditoría muestra ambos números. |
| CP-INS-0017 | RF-INS-017; M17 §5.1; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | Historial con **fecha efectiva** y **fecha de registro** de todo cambio institucional. | No se pierde historial por longitud; cada cambio es un evento consultable. |
| CP-INS-0018 | RF-INS-018; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Solicitud de egreso** del asociado (PWA o mesa) con plantilla configurable e impresión. | La solicitud genera trámite en T11 y la membresía pasa a `withdrawalRequested`. |
| CP-INS-0019 | RF-INS-019; M17 §5.1; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | Asignar **categoría INAES** a cada membresía cuando el informe la requiera. | El informe INAES agrupa por categoría sin valores vacíos. |
| CP-INS-0020 | RF-INS-020; M17 §5.1; PRO-O10-01 | O10 | Estándar | regla | TEN-001 con Distritos: DIST-01 "Centro", DIST-02 "Rural". | Administrar **distritos electorales** (para asambleas de distrito) con regla de asignación por zona, localidad o manual. | Todo asociado activo queda en un distrito cuando la asamblea es de delegados. |
### 1.2 Libro de Registro de Asociados e INAES (M17 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0021 | RF-INS-021; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Generar el **Libro de Registro de Asociados** a una fecha o período: número, nombre o razón social, documento/CUIT, domicilio, fecha de ingreso, fecha y causa de egreso, cuotas sociales suscriptas e integradas, transferencias y reembolsos… | El total de capital integrado del libro a una fecha coincide con el saldo del rubro en M15 a esa fecha. |
| CP-INS-0022 | RF-INS-022; M17 §5.2; PRO-O10-01 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Emitir el libro como **edición versionada inmutable**: folios correlativos, hash SHA-256 del contenido, PDF/A; las correcciones se registran como asientos rectificativos en la edición siguiente. | Una edición emitida no puede modificarse; recalcular el hash da el mismo valor. |
| CP-INS-0023 | RF-INS-023; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | Preparar el libro para **rubricación o registro digital** según el formato que exija el INAES. | Se genera el archivo en el formato configurado con validación previa. |
| CP-INS-0024 | RF-INS-024; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Movimientos: Asociada 1001: suscripto ARS 10.000, integrado ARS 10.000. Asociado 1002: suscripto ARS 10.000, facturado ARS 6.000, integrado ARS 5.000. Asociado… | **Exportar altas y bajas al INAES** por lotes con cantidad de registros por lote configurable. | Un período con 2.500 movimientos y lote de 1.000 genera 3 archivos numerados. |
| CP-INS-0025 | RF-INS-025; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | Usar los **códigos INAES** de provincia, departamento, localidad y tipo de documento mantenidos en T04. | Un asociado con localidad sin código INAES bloquea la exportación con el detalle del faltante. |
| CP-INS-0026 | RF-INS-026; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Emitir **certificados de cuotas sociales** (acciones) por asociado, numerados, con cantidad, valor nominal y estado de integración. | Un certificado anulado conserva número y motivo; el nuevo referencia al anterior. |
| CP-INS-0027 | RF-INS-027; M17 §5.2; PRO-O10-01 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Etiquetas** y listados postales de asociados para convocatorias y comunicaciones. | Se exporta PDF de etiquetas por distrito y orden postal. |
| CP-INS-0028 | RF-INS-028; M17 §5.2; PRO-O10-01 | O10 | Estándar | regla | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | **Catálogo de informes INAES** (padrón, registro, altas/bajas, nómina de autoridades, documentación de asamblea, otros) con período, vencimiento, generación, validación, presentación y acuse. | Cada presentación guarda archivo, fecha, usuario y acuse; vencimientos aparecen en la bandeja de alertas. |
### 1.3 Capital social (M17 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0029 | RF-INS-029; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | ABM de **rubros de capital** con código y descripción; la cuenta contable se asigna en M15 (`entityAccountAssignments`, `entityType: capitalRubric`; CTR-DAT-57, antes "y cuenta contable (mapeo a M15)"). Un rubro de productos solo puede… | Asignar un rubro ya vinculado a otro rubro de capitalización se rechaza. |
| CP-INS-0030 | RF-INS-030; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Definir qué **conceptos/productos o servicios del catálogo** generan capital y en qué proporción (por producto o por servicio). | Facturar un concepto capitalizable genera movimiento `billed` por el importe configurado. |
| CP-INS-0031 | RF-INS-031; M17 §5.3; PRO-O5-12 | O5 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Importe de capital al alta de un servicio**: monto o cantidad de cuotas sociales a suscribir cuando se contrata un servicio. | Al activarse el contrato (evento de M01/M10) se registra la suscripción una única vez. |
| CP-INS-0032 | RF-INS-032; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Reglas de suscripción** versionadas: cuotas sociales mínimas al ingreso, por servicio, por categoría; plan de integración (contado, cuotas en factura, cuotas en documento propio). | La regla vigente a la fecha de ingreso es la que se aplica; cambiar la regla no altera suscripciones previas. |
| CP-INS-0033 | RF-INS-033; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Valor nominal de la cuota social** versionado y cantidad de cuotas por asociado. | La cantidad de cuotas × valor nominal vigente a la suscripción = capital suscripto. |
| CP-INS-0034 | RF-INS-034; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Configurar el **momento de suscripción**: en la afiliación o al facturar. | Con "al facturar" no hay movimiento `subscribed` hasta la emisión; con "afiliación" se registra al aprobar el ingreso. |
| CP-INS-0035 | RF-INS-035; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Registrar la **integración** al confirmarse el pago, en proporción pago/total del comprobante. | Pago parcial del 40 % de un comprobante con ARS 1.000 de capital integra ARS 400. |
| CP-INS-0036 | RF-INS-036; M17 §5.3; PRO-O5-12 | O5 | Núcleo | migración | TEN-001 con Movimientos: Asociada 1001: suscripto ARS 10.000, integrado ARS 10.000. Asociado 1002: suscripto ARS 10.000, facturado ARS 6.000, integrado ARS 5.000. Asociado… | **Libro mayor de capital** por asociado, cuenta y servicio (`capitalMovements`) con tipos: suscripción, facturación, comprometido, integración, ajuste, reversión, transferencia (entrada/salida), reserva, recupero de reserva, rescate… | La suma de movimientos por tipo reproduce suscripto, facturado, integrado y comprometido de cualquier asociado. |
| CP-INS-0037 | RF-INS-037; M17 §5.3; PRO-O5-12 | O5 | Núcleo | integración | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Registrar capital desde todas las **fuentes**: ítems facturados, comprobantes de venta (comprometido), importe del servicio al alta, pagos, convenios/financiaciones, recálculo por fecha. | Cada fuente produce exactamente un movimiento por documento origen (clave de idempotencia). |
| CP-INS-0038 | RF-INS-038; M17 §5.3; PRO-O5-12 | O5 | Núcleo | integración | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Job de registración de capital** idempotente por lote de facturación y por pagos, con progreso, reanudación y reporte de excepciones. | Ejecutar dos veces el job sobre el mismo lote no duplica movimientos. |
| CP-INS-0039 | RF-INS-039; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Modo revisión**: recalcular el capital de un período comparando movimientos esperados con registrados y proponer ajustes sin duplicar. | La revisión de un período ya correcto no propone ajustes. |
| CP-INS-0040 | RF-INS-040; M17 §5.3; PRO-O5-12 | O5 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Cobrar **cuotas sociales en la factura del servicio** o en documento propio, con exhibición diferenciada del aporte respecto del precio del servicio, en documento, cuenta corriente y contabilidad. | El comprobante muestra la cuota social en renglón propio con leyenda configurable y sin mezclarla con el abono. |
| CP-INS-0041 | RF-INS-041; M17 §5.3; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Registrar capital social incluido en **convenios y financiaciones** y su reversión si el convenio se anula. | Anular un convenio genera contramovimientos de capital; no se borra ningún movimiento. |
| CP-INS-0042 | RF-INS-042; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Movimientos: Asociada 1001: suscripto ARS 10.000, integrado ARS 10.000. Asociado 1002: suscripto ARS 10.000, facturado ARS 6.000, integrado ARS 5.000. Asociado… | **Reversión por anulación** de factura, nota de crédito o reversión de pago mediante contramovimientos vinculados. | Después de anular, el saldo vuelve al previo y existen ambos movimientos con referencia cruzada. |
| CP-INS-0043 | RF-INS-043; M17 §5.3; PRO-O5-12 | O5 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Ajuste de capital** al modificar un comprobante (cambio de importe de producto). | El ajuste referencia al comprobante y al cambio que lo originó. |
| CP-INS-0044 | RF-INS-044; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Exclusión mutua** entre registración de capital y emisión de un lote sobre el mismo universo. | Un lote no se bloquea por una registración de otro universo. |
| CP-INS-0045 | RF-INS-045; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Estado de cuenta de capital** por asociado (pantalla, PDF, PWA) con descripciones configurables de los tipos. | Las etiquetas "Vendido/Facturado/Pagado" son claves de diccionario editables por tenant. |
| CP-INS-0046 | RF-INS-046; M17 §5.3; PRO-O5-12 | O5 | Núcleo | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Resumen de capital** por asociado, cuenta y servicio: suscripto, facturado, integrado, comprometido, reservado, pendiente de integrar, vencido. | Pendiente = suscripto − integrado; vencido = pendiente con vencimiento < fecha de corte. |
| CP-INS-0047 | RF-INS-047; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Determinar **deuda de capital** a una fecha con umbral tolerado, para padrón y elegibilidad. | Un asociado con ARS 50 vencidos y umbral ARS 100 no tiene deuda de capital a efectos del padrón. |
| CP-INS-0048 | RF-INS-048; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Reserva de capital** y su **recupero**: afectar capital integrado a un destino con concepto y comprobante configurables; tope = integrado salvo autorización. | Reservar más que lo integrado se rechaza salvo PRM-INS-023 activo y aprobación. |
| CP-INS-0049 | RF-INS-049; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Transferencia de capital** entre asociados con aprobación del consejo, movimientos espejo y opción de transferir servicios y egresar al cedente. | El capital total del tenant no cambia; el cedente baja y el cesionario sube el mismo importe. |
| CP-INS-0050 | RF-INS-050; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Conservar capital al transferir una cuenta** (M01) a otra persona: el capital queda en el asociado origen con movimientos compensatorios si se elige conservar. | Transferir una cuenta no mueve capital salvo decisión explícita registrada. |
| CP-INS-0051 | RF-INS-051; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Rescate / reembolso de capital** al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto configurables)… | Con límite anual agotado, la solicitud queda `queued` con su posición; al nuevo ejercicio se libera según orden. |
| CP-INS-0052 | RF-INS-052; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Compensación** del reembolso con deuda exigible del asociado, previa autorización y constancia. | Se genera crédito institucional imputado en M07 y el remanente va a pago. |
| CP-INS-0053 | RF-INS-053; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Cierre de capital**: fecha hasta la cual no se admiten movimientos; reapertura solo con autorización. | Un movimiento con fecha efectiva ≤ cierre se rechaza con `ins.capital.closed`. |
| CP-INS-0054 | RF-INS-054; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Carga manual** de capital con motivo, adjunto y aprobación. | Sin aprobación, el movimiento queda `pending` y no afecta saldos. |
| CP-INS-0055 | RF-INS-055; M17 §5.3; PRO-O10-02 | O10 | Estándar | migración | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Importación masiva** de saldos/movimientos de capital (migración o regularización) mediante ExcelImportWizard. | La vista previa muestra errores por fila; confirmar crea movimientos `migration` conciliables. |
| CP-INS-0056 | RF-INS-056; M17 §5.3; PRO-O5-12 | O5 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Contabilización** de cada movimiento de capital vía evento hacia M15 según rubro y modo (suscribir al facturar o en la afiliación; integrar en el pago). | Cada movimiento confirmado tiene un asiento asociado en M15 o figura como pendiente en la conciliación. |
| CP-INS-0057 | RF-INS-057; M17 §5.3; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Distribución masiva de capital** entre asociados (por ejemplo, capitalización de un importe) según facturación del período o por asociado. | La suma distribuida es igual al importe a distribuir con redondeo asignado al último asociado. |
| CP-INS-0058 | RF-INS-058; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Validar **pendientes** antes de rescatar o transferir: comprobantes pendientes y servicios conectados. | El rescate muestra comprobantes pendientes y exige decisión de compensar o esperar. |
| CP-INS-0059 | RF-INS-059; M17 §5.3; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Exportar** capital por asociado y período (XLSX/CSV/PDF). | La exportación respeta filtros y permisos. |
### 1.4 Excedentes y retornos (M17 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0060 | RF-INS-060; M17 §5.4; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Obtener el **excedente repartible** del ejercicio desde M15 por sección/servicio, separando operaciones con asociados y con no asociados. | El excedente con no asociados se informa por separado y no genera retornos. |
| CP-INS-0061 | RF-INS-061; M17 §5.4; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Excedentes: Distribución ejercicio 2025-2026 en `simulated`: excedente ARS 2.000.000; 5 % reserva legal, 5 % asistencial, 5 % educación; retorno por facturación. | Aplicar el **esquema de distribución** configurable: reserva legal, fondo de acción asistencial y laboral, fondo de educación y capacitación cooperativas, interés a cuotas sociales (si el estatuto lo autoriza, con tope), retorno a… | Con excedente ARS 1.000.000 y 5 %/5 %/5 %, los fondos reciben ARS 50.000 cada uno antes del retorno. |
| CP-INS-0062 | RF-INS-062; M17 §5.4; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Simular** la distribución (escenario aislado) con criterio de retorno: proporcional a facturación/uso por servicio, a capital integrado o a otro criterio aprobado. | La simulación no genera movimientos y puede exportarse para la asamblea. |
| CP-INS-0063 | RF-INS-063; M17 §5.4; PRO-O10-02 | O10 | Núcleo | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | Vincular la distribución con la **resolución de asamblea** que la aprueba; sin resolución no se ejecuta. | Ejecutar sin `resolutionId` aprobado se rechaza. |
| CP-INS-0064 | RF-INS-064; M17 §5.4; PRO-O10-02 | O10 | Estándar | regla | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Ejecutar** la distribución por asociado: capitalización (movimiento de capital), crédito en cuenta corriente (M07) o pago (M14), con constancia individual y asiento. | La suma de asignaciones = importe aprobado para retornos; cada asociado tiene una constancia. |
| CP-INS-0065 | RF-INS-065; M17 §5.4; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Tratamiento de **retornos de egresados o no localizables** (a pagar, a reserva, prescripción configurable). | Los retornos no cobrados quedan en una cuenta de pasivo identificada por asociado. |
| CP-INS-0066 | RF-INS-066; M17 §5.4; PRO-O10-02 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Informe de distribución** por asociado, servicio y destino. | El informe concilia con el asiento de distribución. |
### 1.5 Órganos sociales y mandatos (M17 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0067 | RF-INS-067; M17 §5.5; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | ABM de **órganos**: consejo de administración, sindicatura, comisión fiscalizadora, junta electoral, comisiones internas; con composición estatutaria (cantidad de titulares y suplentes por cargo). | Un órgano no admite más mandatos vigentes que los cargos definidos. |
| CP-INS-0068 | RF-INS-068; M17 §5.5; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | Registrar **mandatos**: persona asociada (de M01), cargo (presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocal titular, vocal suplente, síndico titular, síndico suplente, otros), fecha de inicio y fin… | Todo mandato referencia una persona existente (no texto libre) y una resolución de elección. |
| CP-INS-0069 | RF-INS-069; M17 §5.5; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Validaciones** de mandato: asociado activo; sin superposición del mismo cargo; incompatibilidades configurables (síndico y consejero; empleado y consejero). | Designar como síndico a un consejero vigente se rechaza con `ins.mandate.incompatible`. |
| CP-INS-0070 | RF-INS-070; M17 §5.5; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | **Alertas** de vencimiento de mandatos y de asamblea de renovación. | 60 días antes del vencimiento se notifica a secretaría (PRM-INS-030). |
| CP-INS-0071 | RF-INS-071; M17 §5.5; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | **Nómina de autoridades** vigente e histórica exportable (INAES, bancos, organismos) y **firmantes autorizados** derivados de los cargos. | La nómina a una fecha muestra solo mandatos vigentes a esa fecha. |
### 1.6 Reuniones, asambleas, padrones, votaciones y actas (M17 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0072 | RF-INS-072; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | ABM de **reuniones** por tipo: consejo (ordinaria/extraordinaria), sindicatura, comisión, asamblea ordinaria, asamblea extraordinaria, asamblea de distrito, asamblea de delegados; con fecha de registro, fecha programada, inicio, fin… | Una reunión cerrada no admite cambios salvo reapertura autorizada. |
| CP-INS-0073 | RF-INS-073; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Orden del día**: temas ordenados con observaciones, resolución, marca de tratado y vínculo opcional a un caso CRM, reclamo o expediente de mesa de entradas. | Un reclamo elevado al consejo muestra en el CRM el tema, la reunión y la resolución. |
| CP-INS-0074 | RF-INS-074; M17 §5.6; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | **Participantes y asistencia** de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. | El quórum del consejo se calcula sobre mandatos titulares vigentes. |
| CP-INS-0075 | RF-INS-075; M17 §5.6; PRO-O10-03 | O10 | Estándar | seguridad | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Permisos por reunión**: usuarios habilitados a ver o editar una reunión reservada. | Un usuario sin permiso no ve la reunión aunque tenga `ins.reuniones.ver`. |
| CP-INS-0076 | RF-INS-076; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Excedentes: Distribución ejercicio 2025-2026 en `simulated`: excedente ARS 2.000.000; 5 % reserva legal, 5 % asistencial, 5 % educación; retorno por facturación. | **Convocatoria de asamblea**: orden del día, documentación (memoria, estados contables de M15, informe del síndico, informe del auditor, proyecto de distribución de excedentes, padrón), plazos mínimos, comunicación al INAES y al órgano… | Publicar una convocatoria con menos días que PRM-INS-033 se bloquea con advertencia. |
| CP-INS-0077 | RF-INS-077; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | **Asamblea a distancia o mixta**: plataforma y enlace, validación de identidad, registro de conexión y constancias, según la resolución del INAES vigente. | Cada participante remoto queda registrado con hora de ingreso y egreso. |
| CP-INS-0078 | RF-INS-078; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Padrón** versionado: fecha de corte, criterios de elegibilidad (versión), estado preliminar → observado → definitivo aprobado; nueva versión ante cambio de criterio conservando la anterior. | Cambiar un criterio luego de aprobar crea la versión 2 y deja la 1 consultable. |
| CP-INS-0079 | RF-INS-079; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Filtros del padrón**: fecha límite de alta, deuda de capital con umbral y fecha, deuda anterior, sin factura desde, servicio desde/hasta, baja posterior al corte, más de N facturas impagas (con o sin marca), distrito, estado del titular… | Cada asociado excluido muestra el criterio que lo excluyó. |
| CP-INS-0080 | RF-INS-080; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Guardar conjuntos de filtros** del padrón por tenant y reutilizarlos. | Un conjunto guardado reproduce el mismo padrón sobre los mismos datos. |
| CP-INS-0081 | RF-INS-081; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Exhibición y observaciones** del padrón: consulta por el asociado en PWA ("¿estoy habilitado?"), reclamo de inclusión con plazo, resolución de la junta electoral o secretaría. | Un reclamo resuelto favorablemente genera la versión siguiente del padrón con la inclusión. |
| CP-INS-0082 | RF-INS-082; M17 §5.6; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Acreditación y asistencia** a asamblea: lectura de credencial QR o documento, hora, firma en libro de asistencia (digital o impresa), poderes presentados, cálculo de quórum en vivo, primer y segundo llamado. | Al alcanzar el quórum configurado, la pantalla lo indica; un asociado no habilitado no se acredita con voto. |
| CP-INS-0083 | RF-INS-083; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Poderes / representaciones**: registro, validación (estatuto lo admite, mandatario habilitado, tope de representados), revocación. | Un mandatario con el tope alcanzado no puede recibir otro poder. |
| CP-INS-0084 | RF-INS-084; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | **Delegados**: elección en asambleas de distrito, nómina de titulares y suplentes por distrito, mandato hasta la asamblea siguiente, informe. | La asamblea de delegados usa como padrón la nómina de delegados vigentes. |
| CP-INS-0085 | RF-INS-085; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | **Junta electoral y listas**: presentación de listas de candidatos, avales, oficialización, impugnaciones y resolución. | Solo listas oficializadas se presentan a votación. |
| CP-INS-0086 | RF-INS-086; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Votación formal** por tema o elección: modalidad (mano alzada, nominal, secreta con urna, electrónica si se habilita), mayoría requerida (simple, absoluta, dos tercios), votos afirmativos, negativos, abstenciones, en blanco y nulos… | Un resultado que no alcanza la mayoría configurada queda "no aprobado"; un asociado vota una sola vez (más sus poderes válidos). |
| CP-INS-0087 | RF-INS-087; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Actas**: número correlativo por libro (consejo, asamblea, sindicatura), fecha de registro, reunión, contenido generado desde el orden del día y resoluciones, PDF, estado de firma y firmantes; actas internas y de mesa de entradas. | El número de acta no se repite dentro de su libro; el PDF incluye todos los temas tratados. |
| CP-INS-0088 | RF-INS-088; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Firma** de actas por los firmantes requeridos y bloqueo posterior; correcciones solo mediante acta posterior o fe de erratas vinculada. La firma la ejecuta T11 con el perfil **SIG-ACTA-INSTITUCIONAL** (nivel `digital`, T11 §18.5… | Un acta firmada no se puede editar; la corrección referencia el acta original. La solicitud de firma de un acta de consejo usa el perfil SIG-ACTA-INSTITUCIONAL. |
| CP-INS-0089 | RF-INS-089; M17 §5.6; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Resoluciones y seguimiento de decisiones**: responsable, plazo, estado, vínculo con objetos afectados (ingresos de asociados, rescates, distribución, honorarios, tarifas, reglamentos). | La bandeja muestra resoluciones vencidas sin cumplir. |
| CP-INS-0090 | RF-INS-090; M17 §5.6; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Documentación institucional** versionada: estatuto, reglamentos, memoria, estados contables, informes; expediente por asamblea (T11). | Cada asamblea tiene expediente con todos los documentos y sus versiones. |
| CP-INS-0091 | RF-INS-091; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | **Presentación post-asamblea** al INAES y órgano local dentro del plazo configurado, con acuse. | La tarea vence según PRM-INS-036 y aparece en la bandeja. |
| CP-INS-0092 | RF-INS-092; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos… | **Libros de actas digitales** (consejo, asamblea, sindicatura, asistencia) exportables en PDF/A foliado con hash. | La edición del libro incluye todas las actas firmadas del período en orden. |
| CP-INS-0093 | RF-INS-093; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | **Publicar resultados** (autoridades electas, resoluciones públicas) en muro, landing y PWA según audiencia (T09). | Una resolución marcada reservada no se publica. |
| CP-INS-0094 | RF-INS-094; M17 §5.6; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Informe de asistencia** a asamblea por asociado y distrito. | El informe coincide con los registros de acreditación. |
### 1.7 Honorarios institucionales (M17 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0095 | RF-INS-095; M17 §5.7; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | Registrar la **retribución aprobada** por asamblea: cargos alcanzados, importe o fórmula, periodicidad, vigencia y resolución. | No se liquida un honorario sin resolución vigente. |
| CP-INS-0096 | RF-INS-096; M17 §5.7; PRO-O10-03 | O10 | Estándar | regla | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | **Liquidar** honorarios por período y mandato vigente, generando obligación a pagar (orden de pago M14) con retenciones de M06 y asiento M15; no se procesan como sueldo. | El honorario de un consejero con mandato terminado a mitad de mes se prorratea según PRM-INS-038. |
| CP-INS-0097 | RF-INS-097; M17 §5.7; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón… | **Reintegro de gastos** de consejeros y síndicos con comprobantes y aprobación. | Un reintegro sin comprobante adjunto no se aprueba. |
| CP-INS-0098 | RF-INS-098; M17 §5.7; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. | **Informe de honorarios** por período, persona y cargo. | Concilia con pagos de M14. |
### 1.8 Relación entre baja de servicio y egreso (AGR-029) (M17 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0099 | RF-INS-099; M17 §5.8; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | La **baja de un servicio no produce egreso** ni devolución de capital. | Dar de baja Internet deja la membresía `active` y el capital intacto. |
| CP-INS-0100 | RF-INS-100; M17 §5.8; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Al quedar un asociado **sin servicios**, alertar a secretaría e informar si es adherente, beneficiario o garante en otros contratos; ofrecer, sin ejecutar, el inicio de un trámite de egreso. | Se crea una alerta `ins.member.withoutServices`; no cambia el estado. |
| CP-INS-0101 | RF-INS-101; M17 §5.8; PRO-O10-03 | O10 | Núcleo | regla | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | El **egreso no da de baja servicios** automáticamente; según configuración, exige baja o transferencia previa de los servicios o permite egresar conservando la condición de cliente. | Con PRM-INS-008 = permitir, el ex asociado continúa como cliente no asociado y M05 sigue facturando si PRM-INS-009 lo permite. |
| CP-INS-0102 | RF-INS-102; M17 §5.8; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | Egreso con **capital integrado**: bloquear o exigir trámite de rescate iniciado. | Con PRM-INS-007 activo, el egreso sin rescate iniciado se rechaza. |
### 1.9 Transversales (M17 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-INS-0103 | RF-INS-103; M17 §5.9; PRO-O10-03 | O10 | Núcleo | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | **Privacidad**: inventario de datos institucionales con finalidad y conservación; padrones exhibidos con minimización (documento enmascarado); exportaciones con permiso específico. | El padrón publicado al asociado muestra solo número, nombre y habilitación. |
| CP-INS-0104 | RF-INS-104; M17 §5.9; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Auditoría** completa de altas, cambios de estado, movimientos de capital, aprobaciones, firmas y exportaciones. | Cada operación tiene evento de auditoría con actor, tenant, antes/después. |
| CP-INS-0105 | RF-INS-105; M17 §5.9; PRO-O2-08 | O2 | Núcleo | seguridad | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Aislamiento por tenant** de membresías, capital, padrones y actas. | Un usuario de A no obtiene registros de B por ningún endpoint. |
| CP-INS-0106 | RF-INS-106; M17 §5.9; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción… | **Portal del asociado** (renderizado por M19): estado, número, antigüedad, capital, credencial digital, convocatorias, documentos públicos, padrón propio, solicitudes de ingreso, egreso, poder y reclamo de padrón. | Un cliente no asociado ve la opción "Asociarme" y no ve capital. |
| CP-INS-0107 | RF-INS-107; M17 §5.9; PRO-O2-08 | O2 | Núcleo | funcional | TEN-001 con Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003… | Términos visibles por **diccionario** (asociado/socio/titular, cuota social/acción). | Cambiar `dict:ins.associate` a "Socio" se refleja en admin y PWA. |
| CP-INS-0108 | RF-INS-108; M17 §5.9; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). | **Recordatorios institucionales**: asamblea ordinaria dentro del plazo legal desde el cierre de ejercicio, mandatos, presentaciones INAES, rescates en cola. | Con cierre de ejercicio 30-06, la alerta de asamblea aparece según PRM-INS-035. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-INS-5001 — ESC-INS-01. Número único concurrente**

- Cubre: ESC-INS-01; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Número único concurrente
- Entonces Dadas dos aprobaciones simultáneas, cuando se confirman, entonces reciben números consecutivos distintos y ninguno se reutiliza tras un egreso.

**CP-INS-5002 — ESC-INS-02. Baja de servicio ≠ egreso**

- Cubre: ESC-INS-02; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado un asociado con electricidad e Internet
- Cuando da de baja Internet
- Entonces sigue `active`, su capital no cambia y no se crea rescate (AGR-029).

**CP-INS-5003 — ESC-INS-03. Integración proporcional**

- Cubre: ESC-INS-03; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado una factura de ARS 20.000 con ARS 1.000 de cuota social
- Cuando se pagan ARS 8.000
- Entonces se integran ARS 400; al pagar el saldo, el total integrado es ARS 1.000 exactos.

**CP-INS-5004 — ESC-INS-04. Anulación de factura**

- Cubre: ESC-INS-04; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado una factura con capital facturado
- Cuando M05 la anula
- Entonces se crea un contramovimiento y el movimiento original permanece visible.

**CP-INS-5005 — ESC-INS-05. Reintento idempotente**

- Cubre: ESC-INS-05; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado que `fac.invoice.issued` se entrega dos veces
- Cuando se procesa
- Entonces existe un solo movimiento `billed` (misma `idempotencyKey`).

**CP-INS-5006 — ESC-INS-06. Cierre de capital**

- Cubre: ESC-INS-06; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado un cierre al 30-06-2026
- Cuando se intenta un ajuste con fecha 15-06-2026
- Entonces se rechaza con `ins.capital.closed`.

**CP-INS-5007 — ESC-INS-07. Límite anual de rescates**

- Cubre: ESC-INS-07; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado un capital integrado de ARS 10.000.000 y límite 5 %
- Cuando los rescates aprobados suman ARS 500.000
- Entonces el siguiente queda `queued`.

**CP-INS-5008 — ESC-INS-08. Padrón versionado**

- Cubre: ESC-INS-08; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado un padrón final
- Cuando se cambia el umbral de deuda
- Entonces se crea una versión nueva y la final previa pasa a `superseded`.

**CP-INS-5009 — ESC-INS-09. Excluido con motivo**

- Cubre: ESC-INS-09; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado un asociado con alta posterior a la fecha límite
- Cuando se genera el padrón
- Entonces figura excluido con motivo "alta posterior a la fecha límite".

**CP-INS-5010 — ESC-INS-10. Convocatoria fuera de plazo**

- Cubre: ESC-INS-10; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado una asamblea a 10 días y PRM-INS-033 = 15
- Cuando se publica
- Entonces se bloquea con `ins.meeting.noticeTooShort`.

**CP-INS-5011 — ESC-INS-11. Acta firmada inmutable**

- Cubre: ESC-INS-11; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado un acta `signed`
- Cuando se intenta editar
- Entonces se rechaza y se ofrece crear acta correctiva.

**CP-INS-5012 — ESC-INS-12. Votación secreta**

- Cubre: ESC-INS-12; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado una votación secreta
- Cuando se consulta el detalle
- Entonces no existen votos nominales.

**CP-INS-5013 — ESC-INS-13. Permiso negativo: reunión reservada**

- Cubre: ESC-INS-13; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado un usuario de secretaría sin permiso en una reunión reservada
- Cuando la consulta
- Entonces recibe 403 `ins.meeting.reserved` y no aparece en listados.

**CP-INS-5014 — ESC-INS-14. Permiso negativo: separación de tareas**

- Cubre: ESC-INS-14; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado un usuario que registró un rescate
- Cuando intenta aprobarlo
- Entonces se rechaza (AGR-008).

**CP-INS-5015 — ESC-INS-15. Permiso negativo: operador**

- Cubre: ESC-INS-15; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado un operador de atención
- Cuando abre la ficha
- Entonces ve el resumen sin movimientos de capital ni actas.

**CP-INS-5016 — ESC-INS-16. Aislamiento de tenant**

- Cubre: ESC-INS-16; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado un usuario del tenant A
- Cuando solicita `/api/admin/ins/memberships/:id` de un registro de B
- Entonces recibe 404 sin revelar existencia.

**CP-INS-5017 — ESC-INS-17. Conciliación**

- Cubre: ESC-INS-17; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado un movimiento con `accountingStatus = error`
- Cuando se ejecuta JOB-INS-12
- Entonces aparece en la conciliación con la diferencia y la acción "reintentar".

**CP-INS-5018 — ESC-INS-18. Lote reanudable**

- Cubre: ESC-INS-18; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado JOB-INS-01 interrumpido en el renglón 4.000 de 10.000
- Cuando se reanuda
- Entonces procesa desde 4.001 sin duplicar.

**CP-INS-5019 — ESC-INS-19. Lock por universo**

- Cubre: ESC-INS-19; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado una registración de capital en curso para la ruta 3
- Cuando M05 emite un lote de la ruta 5
- Entonces no se bloquea; un lote de la ruta 3 sí.

**CP-INS-5020 — ESC-INS-20. Acreditación offline**

- Cubre: ESC-INS-20; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado la PWA sin conexión
- Cuando se acreditan 50 asociados
- Entonces se sincronizan al reconectar sin duplicados.

**CP-INS-5021 — ESC-INS-21. Mandato superpuesto**

- Cubre: ESC-INS-21; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Órganos: Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos ficticios vigentes hasta 30-11-2027.
- Dado un presidente vigente
- Cuando se carga otro presidente titular con vigencia superpuesta
- Entonces se rechaza con `ins.mandate.overlap`.

**CP-INS-5022 — ESC-INS-22. Escenarios transversales ESC-01 a ESC-05 (BASE §102.6)**

- Cubre: ESC-INS-22; relacionados: ESC-01, ESC-05, ESC-04; M17 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Escenarios transversales ESC-01 a ESC-05 (BASE §102.6)
- Entonces Reintentos y duplicados de pago (ESC-01, ESC-04) no generan integración de capital duplicada; los demás escenarios aplican en lo que afecten eventos consumidos por M17.

## 3. Casos por caso de uso (CU)

**CP-INS-8001 — CU-27. Preparar asamblea y padrón**

- Cubre: CU-27; RF-INS-072, RF-INS-082; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado actor: Secretaría institucional, autenticado en TEN-001 con las capabilities de su rol
- Cuando Selecciona asamblea → aplica criterios → genera padrón preliminar → revisa excluidos con motivo → aprueba versión → publica convocatoria y documentación.
- Entonces Se completa «Preparar asamblea y padrón» sin errores, con los efectos que exigen RF-INS-072, RF-INS-082, y quedan auditoría y evento del cambio. Alternativo o excepción: Cambio de criterio: versión nueva, la anterior se conserva. Persona no asociada: no entra al padrón.

**CP-INS-8002 — CU-INS-15. Solicitar ingreso como asociado (PWA)**

- Cubre: CU-INS-15; RF-INS-001, RF-INS-005; M17 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado actor: Cliente / persona, autenticado en TEN-001 con las capabilities de su rol
- Cuando Abre "Asociarme" → confirma datos → acepta estatuto → ve suscripción propuesta → adjunta documentos → envía.
- Entonces Se completa «Solicitar ingreso como asociado (PWA)» sin errores, con los efectos que exigen RF-INS-001, RF-INS-005, y quedan auditoría y evento del cambio. Alternativo o excepción: Persona con aviso de deuda en domicilio: se informa, no bloquea.

**CP-INS-8003 — CU-INS-02. Aprobar ingresos en reunión de consejo**

- Cubre: CU-INS-02; RF-INS-003, RF-INS-071; M17 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado actor: Secretaría + Consejo, autenticado en TEN-001 con las capabilities de su rol
- Cuando Agrupa solicitudes → tema de consejo → resolución → acta firmada → membresías `active` con número.
- Entonces Se completa «Aprobar ingresos en reunión de consejo» sin errores, con los efectos que exigen RF-INS-003, RF-INS-071, y quedan auditoría y evento del cambio. Alternativo o excepción: Rechazo individual con motivo.

**CP-INS-8004 — CU-INS-03. Registrar egreso por renuncia**

- Cubre: CU-INS-03; RF-INS-010, RF-INS-101, RF-INS-102; M17 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Secretaría, autenticado en TEN-001 con las capabilities de su rol
- Cuando Recibe solicitud → valida servicios y capital → resolución → egreso → inicia rescate.
- Entonces Se completa «Registrar egreso por renuncia» sin errores, con los efectos que exigen RF-INS-010, RF-INS-101, RF-INS-102, y quedan auditoría y evento del cambio. Alternativo o excepción: Servicios activos con PRM-INS-008 = false: rechaza y lista servicios.

**CP-INS-8005 — CU-INS-04. Registrar fallecimiento de asociado**

- Cubre: CU-INS-04; RF-INS-012; RN-INS-048; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Asociados: 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante)…
- Dado actor: Sistema / Secretaría, autenticado en TEN-001 con las capabilities de su rol
- Cuando Evento M01 → `deceased` → mandatos finalizados → rescate borrador a derechohabientes.
- Entonces Se completa «Registrar fallecimiento de asociado» sin errores, con los efectos que exigen RF-INS-012, y quedan auditoría y evento del cambio. Alternativo o excepción: Derechohabientes no acreditados: rescate queda en `requested`.

**CP-INS-8006 — CU-INS-05. Cobrar cuota social en la factura**

- Cubre: CU-INS-05; RF-INS-033, RF-INS-038; M17 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Sistema (M04/M05/M07), autenticado en TEN-001 con las capabilities de su rol
- Cuando Factura con renglón capitalizable → `billed` → pago → `paid` proporcional.
- Entonces Se completa «Cobrar cuota social en la factura» sin errores, con los efectos que exigen RF-INS-033, RF-INS-038, y quedan auditoría y evento del cambio. Alternativo o excepción: Anulación: contramovimiento.

**CP-INS-8007 — CU-INS-06. Rescatar capital al egreso**

- Cubre: CU-INS-06; RF-INS-051; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Administración de capital + Consejo + Tesorería, autenticado en TEN-001 con las capabilities de su rol
- Cuando Calcula → aprueba → cola/programa → comprobante → orden de pago → `paid`.
- Entonces Se completa «Rescatar capital al egreso» sin errores, con los efectos que exigen RF-INS-051, y quedan auditoría y evento del cambio. Alternativo o excepción: Límite anual agotado: `queued`.

**CP-INS-8008 — CU-INS-07. Transferir cuotas sociales**

- Cubre: CU-INS-07; RF-INS-049; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Administración de capital, autenticado en TEN-001 con las capabilities de su rol
- Cuando Asistente → aprobación → ejecución con movimientos espejo.
- Entonces Se completa «Transferir cuotas sociales» sin errores, con los efectos que exigen RF-INS-049, y quedan auditoría y evento del cambio. Alternativo o excepción: Cesionario ex asociado con PRM-INS-012 = false: rechazo.

**CP-INS-8009 — CU-INS-08. Distribuir excedentes**

- Cubre: CU-INS-08; RF-INS-060, RF-INS-066; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Excedentes: Distribución ejercicio 2025-2026 en `simulated`: excedente ARS 2.000.000; 5 % reserva legal, 5 % asistencial, 5 % educación; retorno por facturación.
- Dado actor: Contador + Asamblea, autenticado en TEN-001 con las capabilities de su rol
- Cuando Simula → adjunta a expediente → asamblea aprueba → ejecuta.
- Entonces Se completa «Distribuir excedentes» sin errores, con los efectos que exigen RF-INS-060, RF-INS-066, y quedan auditoría y evento del cambio. Alternativo o excepción: Asamblea modifica proyecto: nueva simulación.

**CP-INS-8010 — CU-INS-09. Realizar asamblea**

- Cubre: CU-INS-09; RF-INS-076, RF-INS-093; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado actor: Secretaría, acreditadores, junta electoral, autenticado en TEN-001 con las capabilities de su rol
- Cuando Acreditación → quórum → temas → votaciones → cierre → acta.
- Entonces Se completa «Realizar asamblea» sin errores, con los efectos que exigen RF-INS-076, RF-INS-093, y quedan auditoría y evento del cambio. Alternativo o excepción: Sin quórum al primer llamado: segundo llamado tras espera.

**CP-INS-8011 — CU-INS-10. Registrar reunión de consejo y acta**

- Cubre: CU-INS-10; RF-INS-072, RF-INS-075, RF-INS-087, RF-INS-089; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Reuniones: Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27).
- Dado actor: Secretaría + Consejo, autenticado en TEN-001 con las capabilities de su rol
- Cuando Programa → temas → asistencia → resoluciones → acta → firmas.
- Entonces Se completa «Registrar reunión de consejo y acta» sin errores, con los efectos que exigen RF-INS-072, RF-INS-075, RF-INS-087, RF-INS-089, y quedan auditoría y evento del cambio. Alternativo o excepción: Reunión reservada: solo usuarios permitidos.

**CP-INS-8012 — CU-INS-11. Liquidar honorarios**

- Cubre: CU-INS-11; RF-INS-095, RF-INS-098; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Honorarios: Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo.
- Dado actor: Contador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Liquida período → aprueba → orden de pago.
- Entonces Se completa «Liquidar honorarios» sin errores, con los efectos que exigen RF-INS-095, RF-INS-098, y quedan auditoría y evento del cambio. Alternativo o excepción: Mandato terminado a mitad de mes: prorrateo.

**CP-INS-8013 — CU-INS-12. Emitir libro y presentar al INAES**

- Cubre: CU-INS-12; RF-INS-021, RF-INS-028; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Categorías INAES: Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09).
- Dado actor: Secretaría, autenticado en TEN-001 con las capabilities de su rol
- Cuando Genera libro / exportación → valida → presenta → registra acuse.
- Entonces Se completa «Emitir libro y presentar al INAES» sin errores, con los efectos que exigen RF-INS-021, RF-INS-028, y quedan auditoría y evento del cambio. Alternativo o excepción: Rechazo: nueva versión.

**CP-INS-8014 — CU-INS-13. Baja de un servicio de un asociado (AGR-029)**

- Cubre: CU-INS-13; RF-INS-099, RF-INS-102; M17 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Operador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Da de baja Internet en M01/M02 → M17 recibe evento → la membresía y el capital no cambian → si queda sin servicios, alerta.
- Entonces Se completa «Baja de un servicio de un asociado (AGR-029)» sin errores, con los efectos que exigen RF-INS-099, RF-INS-102, y quedan auditoría y evento del cambio

**CP-INS-8015 — CU-INS-14. Consultar mi asociación (PWA)**

- Cubre: CU-INS-14; RF-INS-106; M17 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M17 §18.
- Datos de prueba: Capital: Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en…
- Dado actor: Asociado, autenticado en TEN-001 con las capabilities de su rol
- Cuando Ve estado, número, antigüedad, capital, credencial y convocatorias.
- Entonces Se completa «Consultar mi asociación (PWA)» sin errores, con los efectos que exigen RF-INS-106, y quedan auditoría y evento del cambio. Alternativo o excepción: Cliente no asociado: ve "Asociarme".
