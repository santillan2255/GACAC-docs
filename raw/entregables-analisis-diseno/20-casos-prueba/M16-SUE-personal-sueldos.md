# Casos de prueba de aceptación — M16 SUE — Personal y sueldos

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M16-SUE-personal-sueldos.md`](../../especificacion/anexos/M16-SUE-personal-sueldos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 146 CP de requisitos funcionales, 30 CP de escenarios ESC y 16 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M16 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Legajo del empleado (SUE-001) (M16 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0001 | RF-SUE-001; M16 §5.1; PRO-O3-01 | O3 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Registro mínimo de relación laboral: persona (M01), empresa empleadora, número de legajo, área, centro de costo, cargo, estado activo/baja, encargado. Utilizable por cuadrillas y órdenes de trabajo antes de la liquidación. | M10 puede asignar a una cuadrilla solo empleados activos del tenant; el registro no expone datos salariales. |
| CP-SUE-0002 | RF-SUE-002; M16 §5.1; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Legajo completo con datos personales (tomados de M01: apellido y nombre, documento, CUIL, fecha de nacimiento, sexo/género registral, nacionalidad, estado civil, domicilio, teléfono, correo), datos laborales (fecha de ingreso, fecha de… | Un legajo sin CUIL válido (11 dígitos y dígito verificador), sin fecha de ingreso, sin empresa, sin modalidad o sin situación de revista no puede incluirse en una liquidación. |
| CP-SUE-0003 | RF-SUE-003; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Número de legajo único por empresa empleadora, correlativo sugerido (`GetProximoLegajo`) o manual. | Alta con legajo repetido en la misma empresa devuelve error 409; en otra empresa del mismo tenant se admite. |
| CP-SUE-0004 | RF-SUE-004; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Alta de empleado integrada con personas: busca la persona por documento/CUIL en el tenant, la reutiliza o la crea en M01 sin duplicar. | Si la persona ya es socio, el legajo se vincula a la misma persona y el socio no ve datos laborales en su espacio. |
| CP-SUE-0005 | RF-SUE-005; M16 §5.1; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Familiares: 10 familiares a cargo (cónyuges e hijos ficticios) con F.572 2026 | Familiares a cargo: persona, parentesco, fecha de nacimiento, estudiante, discapacidad, adherente a obra social, declarado en F.572, porcentaje a deducir, con datos **por año fiscal**. | Cambiar el porcentaje a deducir de 2027 no altera el cálculo de Ganancias de 2026. |
| CP-SUE-0006 | RF-SUE-006; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). | Con varias cuentas, la suma de porcentajes es 100 %; un CBU con dígito verificador inválido se rechaza. |
| CP-SUE-0007 | RF-SUE-007; M16 §5.1; PRO-O9-01 | O9 | Estándar | regla | TEN-001 con RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000 | Documentación del empleado con tipo documental, archivo, fecha de registro, vencimiento y estado (pendiente, autorizada, rechazada); circuito de autorización por RRHH de lo que el empleado sube desde su portal; alertas de vencimiento. | Un documento rechazado conserva el rechazo y su motivo en el historial (no se borra el adjunto sin política de conservación). |
| CP-SUE-0008 | RF-SUE-008; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) | Distribución del costo del empleado por centros de costo (secciones) con porcentaje y vigencia; suma 100 %. | Un asiento de sueldos distribuye el costo del empleado según la distribución vigente en el período devengado. |
| CP-SUE-0009 | RF-SUE-009; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Turnos asignados al empleado con vigencia desde/hasta, sobre turnos con horarios por día de semana. | No puede haber dos turnos superpuestos para el mismo empleado en la misma fecha. |
| CP-SUE-0010 | RF-SUE-010; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Historial laboral con fecha efectiva y de registro: categoría, convenio, cargo, área, jornada, modalidad, básico fuera de convenio, empresa; consulta «a una fecha». | La reliquidación de un período pasado usa la categoría vigente en ese período, no la actual. |
| CP-SUE-0011 | RF-SUE-011; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Situación de revista por empleado con fecha desde y día de inicio; hasta tres situaciones por mes, como exige el LSD/SICOSS. | Una licencia por maternidad aprobada genera la situación de revista correspondiente desde su día de inicio. |
| CP-SUE-0012 | RF-SUE-012; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Relación encargado-operarios con vigencia; define la bandeja del encargado y el alcance «equipo». | Un encargado solo ve licencias y novedades de sus operarios vigentes. |
| CP-SUE-0013 | RF-SUE-013; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Sindicatos y convenios: «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26» | Observaciones del legajo con fecha, usuario y categoría (general o sensible). | Una observación sensible solo es visible con `sue.datosSensibles.ver`. |
| CP-SUE-0014 | RF-SUE-014; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Vinculación de cuentas de servicio del empleado (M01/M07) para eventual descuento de deuda en el recibo. | Sin autorización escrita del empleado registrada, la función de descuento devuelve 0. |
| CP-SUE-0015 | RF-SUE-015; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Extras por empleado: importes fijos por concepto extra o grupo de extras, con vigencia. | Un grupo marcado «único» no admite dos extras del mismo grupo para un empleado. |
| CP-SUE-0016 | RF-SUE-016; M16 §5.1; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo), adelanto… | El saldo del plan disminuye solo con recibos aprobados; al anular el recibo se restituye. |
| CP-SUE-0017 | RF-SUE-017; M16 §5.1; PRO-O9-01 | O9 | Estándar | regla | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Alertas del legajo: cambio de categoría por antigüedad (meses del sindicato o convenio), fin del período de prueba, vencimiento de contrato a plazo, vencimiento de documentación, reincorporación tras licencia, cumpleaños. | La alerta de cambio de categoría aparece en el tablero cuando pasaron más meses que los configurados desde la última fecha de categoría. |
| CP-SUE-0018 | RF-SUE-018; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Importación masiva de empleados desde Excel con modelo descargable y referencias (ExcelImportWizard: subir, previsualizar errores, confirmar). | Las filas con error no se importan y el informe indica fila, campo y motivo. |
| CP-SUE-0019 | RF-SUE-019; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Reincorporación de un empleado dado de baja conservando el historial; nueva relación o reapertura según decisión del usuario. | Reincorporar no borra extras, recibos ni la liquidación final anterior. |
| CP-SUE-0020 | RF-SUE-020; M16 §5.1; PRO-O9-01 | O9 | Núcleo | seguridad | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Segregación de datos sensibles del legajo (salud, discapacidad, embargos, cuotas alimentarias, sanciones, sumarios, accidentes, juicios) con capability propia y auditoría de lectura. | Un liquidador sin `sue.datosSensibles.ver` ve el descuento del embargo en el recibo pero no el oficio ni la carátula. |
| CP-SUE-0021 | RF-SUE-021; M16 §5.1; PRO-O9-01 | O9 | Estándar | funcional | TEN-001 con Familiares: 10 familiares a cargo (cónyuges e hijos ficticios) con F.572 2026 | Propuesta de cambio de datos por el empleado desde el portal (domicilio, teléfono, correo, familiares, cuenta) con aprobación de RRHH. | El cambio de CBU propuesto no se aplica hasta su aprobación y queda auditado. |
### 1.2 Empresas empleadoras (multiempleador) (M16 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0022 | RF-SUE-022; M16 §5.2; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Varias empresas empleadoras por tenant con CUIT, razón social, domicilio fiscal y de explotación, tipo de empleador, actividad principal, condición fiscal, ART contratada (contrato, alícuota fija y variable, vigencia), seguro de vida… | Dos empresas del mismo tenant generan LSD, SICOSS, pagos y asientos por separado. |
| CP-SUE-0023 | RF-SUE-023; M16 §5.2; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Todo legajo pertenece a una empresa (entidad jurídica, `legalEntityId`); liquidaciones, períodos, presentaciones, pagos y asientos se segmentan por empresa. | Una liquidación no puede mezclar empleados de dos empresas. |
| CP-SUE-0024 | RF-SUE-024; M16 §5.2; PRO-O9-01 | O9 | Estándar | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Pluriempleo dentro del tenant: una persona con relaciones laborales simultáneas en dos empresas del tenant, con Ganancias consolidada por el agente de retención designado en SIRADIG. | La empresa no designada informa sus remuneraciones como «otros empleos» al agente de retención. |
| CP-SUE-0025 | RF-SUE-025; M16 §5.2; PRO-O9-01 | O9 | Estándar | integración | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Importación de datos de la empresa desde archivo (ARCA o modelo propio). | Se previsualizan los datos antes de aplicar. |
### 1.3 Estructura laboral (SUE-002) (M16 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0026 | RF-SUE-026; M16 §5.3; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Sindicatos y convenios: «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26» | Sindicatos: nombre, CUIT, porcentaje e importe de retención al trabajador, porcentaje e importe de aporte del empleador, meses para cambio de categoría, cuentas contables general y de cargas, datos de depósito. | Los porcentajes del sindicato se toman por vigencia, no del valor actual. |
| CP-SUE-0027 | RF-SUE-027; M16 §5.3; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. | Un convenio sin validación registrada no puede publicarse en una versión de configuración. |
| CP-SUE-0028 | RF-SUE-028; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Categorías por convenio: tipo (mensual, jornal, por hora), horas de trabajo, horas mínimas, días mínimos, adicionales, sindicato. | La función de fórmula «básico de la categoría» devuelve el valor vigente a la fecha del período. |
| CP-SUE-0029 | RF-SUE-029; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. | Publicar una escala de abril con fecha efectiva de marzo habilita una liquidación complementaria de marzo (RF-SUE-076). |
| CP-SUE-0030 | RF-SUE-030; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. | Con 12 años de antigüedad el empleado toma el tramo 10–20 configurado. |
| CP-SUE-0031 | RF-SUE-031; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) | Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. | Un área sin centro de costo asociado impide aprobar una liquidación con empleados de esa área (error de configuración previo). |
| CP-SUE-0032 | RF-SUE-032; M16 §5.3; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Jornadas (completa, parcial con horas semanales, reducida, insalubre), turnos con horarios por día y régimen de guardias (pasiva/activa, valor u horas equivalentes por convenio). | Las horas de guardia importadas se valorizan con la regla de guardia del convenio del empleado. |
| CP-SUE-0033 | RF-SUE-033; M16 §5.3; PRO-O9-01 | O9 | Núcleo | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. | El código de obra social del LSD sale de la tabla oficial vigente. |
| CP-SUE-0034 | RF-SUE-034; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Salario mínimo, vital y móvil con vigencia (tabla de plataforma) usado en fórmulas, embargos y controles. | La escala de embargabilidad usa el SMVM vigente a la fecha de pago. |
| CP-SUE-0035 | RF-SUE-035; M16 §5.3; PRO-O9-01 | O9 | Núcleo | integración | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Tablas oficiales de seguridad social de plataforma (actividades, condiciones, modalidades de contratación, situaciones de revista, códigos de siniestrado, beneficios SICOSS, tipos de empleador, zonas, códigos de conceptos ARCA para LSD… | Un código dado de baja en la tabla oficial no puede asignarse a un empleado con fecha posterior a su baja. |
| CP-SUE-0036 | RF-SUE-036; M16 §5.3; PRO-O9-01 | O9 | Núcleo | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Motivos de desvinculación (renuncia, despido con causa, sin causa, mutuo acuerdo art. 241, fin de contrato, jubilación, fallecimiento, abandono, fuerza mayor, período de prueba) con su modelo de conceptos de egreso e importes por defecto. | Elegir «despido sin causa» propone preaviso, integración, indemnización art. 245, vacaciones no gozadas y SAC proporcional. |
### 1.4 Variables, conceptos y fórmulas (SUE-004) (M16 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0037 | RF-SUE-037; M16 §5.4; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Variables con nombre único, descripción, tipo de resultado y fórmula; el renombrado propaga la referencia a todas las variables y conceptos. | Renombrar una variable actualiza todas las fórmulas en borrador y deja la versión publicada intacta. |
| CP-SUE-0038 | RF-SUE-038; M16 §5.4; PRO-O9-02 | O9 | Núcleo | integración | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Conceptos con código, descripción, tipo (remunerativo, no remunerativo, deducción, retención, contribución, redondeo), vigencia desde/hasta, fórmula de cantidad, de importe, de base y de filtro, orden de cálculo, «liquidar siempre», afecta… | Un concepto sin código ARCA para LSD no puede publicarse en una empresa que genera LSD. |
| CP-SUE-0039 | RF-SUE-039; RN-SUE-020, RN-SUE-041; M16 §5.4; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Lenguaje de fórmulas seguro (sin acceso a código ni a datos ajenos al contexto) con operadores aritméticos, lógicos, condicionales, redondeos, fechas y las funciones de dominio de §6 (RN-SUE-020 a RN-SUE-041). | Una fórmula que referencia un concepto de orden posterior se rechaza al validar (dependencia circular u orden inválido). |
| CP-SUE-0040 | RF-SUE-040; M16 §5.4; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Editor de fórmulas con árbol de variables, conceptos, datos del empleado, novedades y funciones; validación; prueba sobre un empleado; asistente de IA que **solo propone** la fórmula y explica sus dependencias. | La sugerencia de IA no se guarda hasta que el usuario la acepta; no se envían datos personales al proveedor de IA (97.1). |
| CP-SUE-0041 | RF-SUE-041; M16 §5.4; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y publicación… | No se puede publicar sin una simulación cuyo informe de diferencias haya sido revisado por un usuario distinto del autor. |
| CP-SUE-0042 | RF-SUE-042; M16 §5.4; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Tipos de liquidación: mensual, primera quincena, segunda quincena, jornal semanal/quincenal, SAC primer semestre, SAC segundo semestre, vacaciones, final, complementaria, rectificativa, adelanto; con rango de días, prorrateo para… | Un concepto marcado solo para «SAC» no aparece en una liquidación mensual. |
| CP-SUE-0043 | RF-SUE-043; M16 §5.4; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Aplicar aumentos: porcentaje o importe sobre los básicos de un sindicato, convenio, conjunto de categorías o grupo de extras, con fecha efectiva y redondeo; genera una nueva versión de escala en borrador para aprobar. | Un aumento del 5 % sobre una escala no modifica la vigente hasta aprobar la nueva versión. |
| CP-SUE-0044 | RF-SUE-044; M16 §5.4; PRO-O9-02 | O9 | Estándar | regla | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Concepto de redondeo del neto configurable (sin redondeo, al entero superior, a múltiplo) y su clasificación (no remunerativo con P3016). | Un neto de ARS 812.345,40 con redondeo al entero superior genera un concepto de 0,60. |
| CP-SUE-0045 | RF-SUE-045; M16 §5.4; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Grillas de configuración que muestran solo conceptos activos por defecto, con filtro para ver inactivos. | Al abrir la pantalla de conceptos se listan los vigentes a hoy. |
### 1.5 Novedades del período (SUE-003) (M16 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0046 | RF-SUE-046; M16 §5.5; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Tipos de novedad: por cantidad o importe, código SIRADIG, marca de anticipo, tope anual, porcentaje sobre ganancia neta, pago a cuenta, afecta impuesto cedular, comportamiento (horas extra 50 %, 100 %, guardias, ausencia injustificada… | Un tipo con tope anual impide superar el tope sumando las novedades del año. |
| CP-SUE-0047 | RF-SUE-047; M16 §5.5; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Carga de novedades del período en grilla masiva por empleado y tipo, con fecha, cantidad o importe, observación, cuotas y referencia a origen. | Una novedad en tres cuotas genera tres novedades en los tres períodos siguientes. |
| CP-SUE-0048 | RF-SUE-048; M16 §5.5; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Importación de novedades desde Excel con ExcelImportWizard. | Las filas de empleados inexistentes o dados de baja se rechazan con motivo. |
| CP-SUE-0049 | RF-SUE-049; M16 §5.5; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. | Las 120 horas de guardia del ejemplo entran como novedades en borrador, agrupadas por empleado y OT, sin duplicarse si la OT se reabre y cierra de nuevo. |
| CP-SUE-0050 | RF-SUE-050; M16 §5.5; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Novedades propuestas desde flota: horas de conducción, kilómetros, viáticos, pernoctes, por viaje y conductor. | Un viaje anulado en M18 retira la novedad propuesta si no fue liquidada. |
| CP-SUE-0051 | RF-SUE-051; M16 §5.5; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Tareas extra pagadas por unidad (lecturas, cortes, reconexiones, repartos) con tipo, cuenta/suministro, período, empleado, cantidad, unitario y total. | Cien lecturas a ARS 350 generan una novedad de ARS 35.000 para el lecturista. |
| CP-SUE-0052 | RF-SUE-052; M16 §5.5; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Fichadas de reloj: carga manual o importada, procesamiento contra el turno para obtener horas trabajadas, tardanzas, horas no trabajadas y horas extra propuestas. | Una fichada manual queda marcada como manual con usuario. |
| CP-SUE-0053 | RF-SUE-053; M16 §5.5; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Horas no trabajadas por empleado y fecha, con justificación o descuento. | Las horas no justificadas generan novedad de descuento propuesta. |
| CP-SUE-0054 | RF-SUE-054; M16 §5.5; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». | Un adelanto de ARS 100.000 pagado el día 15 aparece como descuento en el recibo mensual. |
| CP-SUE-0055 | RF-SUE-055; M16 §5.5; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Aprobación de novedades: el encargado aprueba las de su equipo y el liquidador las consolida; las novedades importadas nacen en borrador. | Una novedad en borrador no se toma en la liquidación. |
| CP-SUE-0056 | RF-SUE-056; M16 §5.5; PRO-O9-02 | O9 | Estándar | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Retención de Ganancias informada manualmente para un período (sustituye el cálculo) con motivo y aprobación. | El recibo muestra la retención informada y el detalle de Ganancias registra que hubo sustitución. |
| CP-SUE-0057 | RF-SUE-057; M16 §5.5; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Remuneraciones y retenciones de otros empleos (incluidas las de cajas previsionales provinciales) como novedades informativas para Ganancias, cargadas desde F.572 o manualmente. | Importar dos veces la misma remuneración de otro empleo no la duplica. |
### 1.6 Licencias y vacaciones (M16 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0058 | RF-SUE-058; M16 §5.6; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado, sensible… | La causa «matrimonio» con 10 días corridos rechaza una solicitud de 12 días. |
| CP-SUE-0059 | RF-SUE-059; M16 §5.6; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Solicitud de licencia desde el portal o la administración con fechas, días, causa, adjuntos y observación; controles de superposición con otra pendiente o autorizada y de días disponibles. | No se puede solicitar una licencia que se superpone con otra autorizada del mismo tipo. |
| CP-SUE-0060 | RF-SUE-060; M16 §5.6; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Autorización por el encargado (y por RRHH cuando la causa es sensible) que genera una novedad por mes calendario con los días de ese mes; rechazo con causa; notificaciones al solicitante y a encargados. | Una licencia del 25-03 al 05-04 genera dos novedades (7 días en marzo, 5 en abril). |
| CP-SUE-0061 | RF-SUE-061; RN-SUE-055; M16 §5.6; PRO-O9-02 | O9 | Núcleo | regla | TEN-001 con RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000 | Saldo de vacaciones por año de goce: días según LCT y convenio (RN-SUE-055), días tomados, solicitados, pendientes de años anteriores y año de control. | El empleado ve en su portal el mismo saldo que RRHH. |
| CP-SUE-0062 | RF-SUE-062; M16 §5.6; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Cómputo de días hábiles excluyendo sábados, domingos y feriados (nacionales de plataforma, provinciales y locales del tenant) y días no laborables según el turno. | Una licencia en días hábiles que incluye un feriado nacional no lo descuenta. |
| CP-SUE-0063 | RF-SUE-063; M16 §5.6; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Liquidación de vacaciones al inicio del goce (art. 155 LCT) como tipo de liquidación o dentro de la mensual, según configuración. | Vacaciones de 14 días de un mensualizado se liquidan a sueldo ÷ 25 × 14 con los conceptos marcados. |
| CP-SUE-0064 | RF-SUE-064; M16 §5.6; PRO-O9-02 | O9 | Núcleo | funcional | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Licencias por enfermedad inculpable y accidente con plazos pagos (art. 208 LCT) controlados y reserva de puesto (art. 211), certificado médico como dato sensible. | Al superar el plazo pago la licencia pasa a reserva de puesto sin goce y se alerta. |
| CP-SUE-0065 | RF-SUE-065; M16 §5.6; PRO-O9-02 | O9 | Estándar | funcional | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Calendario de licencias autorizadas por equipo y área. | El encargado ve la superposición de vacaciones de su equipo antes de aprobar. |
### 1.7 Liquidaciones (SUE-005) (M16 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0066 | RF-SUE-066; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Períodos de sueldos por empresa y tipo con estados abierto, en liquidación, cerrado y reabierto (con motivo y aprobación). | No se puede crear una novedad con fecha de un período cerrado. |
| CP-SUE-0067 | RF-SUE-067; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Liquidación masiva mensual o quincenal por empresa con universo filtrable (convenio, sindicato, categoría, área, centro de costo, legajos, situación). | Liquidar 18 empleados genera 18 recibos en estado calculado dentro del mismo lote. |
| CP-SUE-0068 | RF-SUE-068; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Motor de cálculo: armado de contexto del empleado (antigüedad, categoría y escala vigentes, novedades aprobadas, extras, familiares, planes de descuento, acumulados) y evaluación de conceptos en orden, guardando cantidad, base, importe y… | Para cualquier renglón del recibo se puede ver qué valores y fórmula lo produjeron. |
| CP-SUE-0069 | RF-SUE-069; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Armado de renglones: descarta conceptos fuera de vigencia o no habilitados para el tipo, los que dan cero salvo «liquidar siempre», suma haberes, resta deducciones y retenciones; las contribuciones no afectan el neto; los conceptos ocultos… | Una contribución patronal no aparece en el neto del recibo pero sí en el asiento. |
| CP-SUE-0070 | RF-SUE-070; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Simulador: cálculo individual o masivo sin efectos, con la configuración vigente o con una versión en borrador; comparativo por empleado y concepto contra el período anterior. | Una simulación no consume números de recibo, no mueve saldos de planes de descuento ni emite eventos económicos. |
| CP-SUE-0071 | RF-SUE-071; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) | Controles previos a aprobar: variación por empleado mayor al umbral, neto negativo o cero, empleado sin cuenta de acreditación, sin categoría, sin centro de costo, con novedades en borrador, deducciones sobre el límite legal, remuneración… | Un control bloqueante impide enviar a aprobación; uno de advertencia exige justificación. |
| CP-SUE-0072 | RF-SUE-072; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Sindicatos y convenios: «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26» | SAC primer y segundo semestre (Ley 23.041): 50 % de la mayor remuneración mensual devengada del semestre con los conceptos marcados, proporcional al tiempo trabajado; SAC proporcional en egreso. | Un empleado con 3 meses en el semestre cobra la mitad del mejor mes × 3/6. |
| CP-SUE-0073 | RF-SUE-073; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Liquidación final por egreso: motivo, fecha de egreso, preaviso otorgado o sustitutivo (art. 231/232), integración del mes de despido (art. 233), indemnización por antigüedad (art. 245) con tope de convenio y piso, indemnizaciones… | Un despido sin causa con 7 años y 4 meses de antigüedad computa 8 períodos en el art. 245. |
| CP-SUE-0074 | RF-SUE-074; M16 §5.7; PRO-O9-03 | O9 | Estándar | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Liquidación de vacaciones como tipo independiente (RF-SUE-063) y de adelanto. | Una liquidación de vacaciones o de adelanto se crea con su propio tipo de liquidación (RF-SUE-063), separada de la mensual del período, y genera recibos identificados con ese tipo. |
| CP-SUE-0075 | RF-SUE-075; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Recálculo individual de un empleado dentro de un lote no aprobado. | Recalcular un empleado no cambia los recibos de los demás. |
| CP-SUE-0076 | RF-SUE-076; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Liquidación complementaria de diferencias de un período cerrado (retroactivos de paritarias, novedades tardías) con período de devengamiento informado para LSD y Ganancias. | La complementaria de marzo pagada en abril informa devengamiento marzo y pago abril. |
| CP-SUE-0077 | RF-SUE-077; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Liquidación rectificativa que reemplaza un recibo emitido con error: el original queda anulado y vinculado; nunca se borra. | El recibo rectificado conserva su PDF y estado de firma; el nuevo referencia al anterior. |
| CP-SUE-0078 | RF-SUE-078; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Envío a aprobación, aprobación, cierre y anulación de la liquidación con separación de funciones. | El usuario que calculó no ve el botón «Aprobar» del lote. |
| CP-SUE-0079 | RF-SUE-079; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Anulación de una liquidación aprobada no pagada con reversión del asiento y del saldo de planes de descuento; si ya se pagó, solo por rectificativa. | Anular emite `sue.payrollRun.voided` y M15 registra el contraasiento. |
| CP-SUE-0080 | RF-SUE-080; M16 §5.7; PRO-O9-03 | O9 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Un único recibo por empleado, período, tipo de liquidación y empresa (salvo rectificativas y complementarias). | Crear una segunda mensual de marzo para el mismo legajo devuelve 409. |
| CP-SUE-0081 | RF-SUE-081; M16 §5.7; PRO-O9-03 | O9 | Núcleo | regla | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Embargos y cuotas alimentarias: cálculo del descuento según la escala de embargabilidad sobre la remuneración neta de aportes, cuota alimentaria sin ese tope, orden de prelación, saldo y depósito judicial. | Con dos embargos comunes, se respeta el tope total y se aplica la prelación por fecha de notificación del oficio. |
| CP-SUE-0082 | RF-SUE-082; M16 §5.7; PRO-O9-03 | O9 | Estándar | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Control del límite de deducciones (art. 133 LCT) sobre las retenciones no legales ni judiciales, con alerta. | Descuentos voluntarios que superan el 20 % del total de la remuneración generan advertencia bloqueante. |
| CP-SUE-0083 | RF-SUE-083; M16 §5.7; PRO-O9-03 | O9 | Estándar | regla | TEN-001 con Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 | Descuento de deuda de servicios del empleado en el recibo, solo con autorización registrada y dentro de los límites legales. | El importe descontado se informa a M07 como cobro imputado a la deuda. |
| CP-SUE-0084 | RF-SUE-084; M16 §5.7; PRO-O9-03 | O9 | Estándar | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Provisiones mensuales de SAC y vacaciones (devengamiento) para el asiento y la proyección. | La provisión de SAC de marzo es 1/12 de la base estimada del semestre configurada. |
### 1.8 Ganancias de 4.ª categoría (SUE-006) (M16 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0085 | RF-SUE-085; M16 §5.8; PRO-O9-04 | O9 | Núcleo | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Tablas de Ganancias de plataforma con fuente y vigencia: deducciones personales por mes y año (ganancia no imponible, cónyuge, hijo, hijo incapacitado, deducción especial y sus variantes), deducción especial incrementada por sueldo… | Un tenant no puede editar la escala oficial; puede adoptarla y ver su fuente. |
| CP-SUE-0086 | RF-SUE-086; M16 §5.8; PRO-O9-04 | O9 | Núcleo | regla | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Importación del F.572 web (SIRADIG) por empleado y período: cargas de familia, deducciones generales, otros empleos, pagos a cuenta, percepciones, con versión del formulario y fecha; P2763 para novedades de diciembre. | Reimportar una versión posterior del F.572 reemplaza la anterior y conserva el historial. |
| CP-SUE-0087 | RF-SUE-087; M16 §5.8; PRO-O9-04 | O9 | Núcleo | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Cálculo mensual acumulativo de la retención: ganancia bruta acumulada, deducciones, ganancia neta sujeta, impuesto determinado según escala, retenciones anteriores, retención o devolución del mes; detalle por recibo. | La suma de las retenciones del año coincide con el impuesto determinado de la liquidación anual. |
| CP-SUE-0088 | RF-SUE-088; M16 §5.8; PRO-O9-04 | O9 | Estándar | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Calculadora de Ganancias por empleado con cada campo del cálculo y diferencias mes a mes exportables a Excel. | El liquidador puede explicar cada importe de la retención a una fecha. |
| CP-SUE-0089 | RF-SUE-089; M16 §5.8; PRO-O9-04 | O9 | Núcleo | integración | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. | El formulario anual del empleado coincide con el detalle de Ganancias de sus recibos. |
| CP-SUE-0090 | RF-SUE-090; M16 §5.8; PRO-O9-04 | O9 | Núcleo | regla | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Devolución de retenciones en exceso en el recibo con concepto propio. | Si el acumulado retenido supera el determinado, el recibo muestra una devolución. |
| CP-SUE-0091 | RF-SUE-091; M16 §5.8; PRO-O9-04 | O9 | Estándar | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Configuración del período fiscal de liquidación de Ganancias (enero–diciembre, febrero–enero, diciembre–noviembre, enero–diciembre según fecha de pago). | Con «según fecha de pago», un recibo de diciembre pagado en enero se imputa al año siguiente. |
| CP-SUE-0092 | RF-SUE-092; M16 §5.8; PRO-O9-04 | O9 | Estándar | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Prorrateo de conceptos no mensuales (SAC y tipos marcados «prorratear») por doceavas hasta fin de año para la retención. | Un bono anual prorrateado se distribuye en las doceavas restantes. |
| CP-SUE-0093 | RF-SUE-093; M16 §5.8; PRO-O9-04 | O9 | Núcleo | regla | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Reglas de procedencia de la retención por remuneración bruta mínima y promedios mensuales o semestrales según la norma vigente, parametrizadas en tabla oficial. | Un empleado cuyo bruto está bajo el mínimo vigente no sufre retención. |
| CP-SUE-0094 | RF-SUE-094; M16 §5.8; PRO-O9-04 | O9 | Estándar | regla | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Impuesto cedular y deducciones especiales DEIA/incrementada como funciones disponibles con tablas versionadas, desactivadas por defecto. | Sin tabla vigente, la función devuelve 0 y lo informa en la traza. |
| CP-SUE-0095 | RF-SUE-095; M16 §5.8; PRO-O9-04 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Importación de deducciones especiales desde archivo. | La importación de un archivo de deducciones especiales muestra una vista previa con los errores por fila (empleado inexistente, deducción o importe inválido) y solo carga las filas válidas después de confirmar. |
### 1.9 Seguridad social y presentaciones (SUE-007) (M16 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0096 | RF-SUE-096; M16 §5.9; PRO-O9-05 | O9 | Núcleo | regla | TEN-001 con Familiares: 10 familiares a cargo (cónyuges e hijos ficticios) con F.572 2026 | Cálculo de aportes y contribuciones por subsistema (SIPA, INSSJyP, obra social, Fondo Solidario de Redistribución, RENATRE cuando aplique, asignaciones familiares, Fondo Nacional de Empleo, LRT/ART, seguro de vida obligatorio), con bases… | La base topeada de junio usa el tope de meses con SAC. |
| CP-SUE-0097 | RF-SUE-097; M16 §5.9; PRO-O9-05 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Archivo para SICOSS/F.931 por empresa y período (TXT posicional por CUIL) con importes por clasificación, situaciones de revista, obra social, adherentes, zona, condición, actividad, siniestrado, tipo de empresa, reducciones y beneficios. | El total de remuneraciones del archivo coincide con el total de la liquidación del período. |
| CP-SUE-0098 | RF-SUE-098; M16 §5.9; PRO-O9-05 | O9 | Núcleo | integración | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Libro de Sueldos Digital (RG 3781): registros 01 a 05, códigos de concepto ARCA, P3065 (tope de vacaciones proporcionales), por empresa y liquidación, con validación y estado (generado, presentado con acuse adjunto). | Un concepto sin asociación al código ARCA bloquea la generación con el detalle del concepto. |
| CP-SUE-0099 | RF-SUE-099; M16 §5.9; PRO-O9-05 | O9 | Estándar | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Control de totales SICOSS/LSD contra liquidación y asiento por subsistema. | Diferencias distintas de cero se informan por empleado y subsistema. |
| CP-SUE-0100 | RF-SUE-100; M16 §5.9; PRO-O9-05 | O9 | Núcleo | regla | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | SICORE de sueldos: retenciones de Ganancias 4.ª categoría del período por empleado con código de régimen e impuesto de la tabla oficial. | El total del archivo coincide con la suma de retenciones de los recibos pagados del mes. |
| CP-SUE-0101 | RF-SUE-101; M16 §5.9; PRO-O9-05 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Archivos sindicales con layout configurable (incluidos Luz y Fuerza, regional de Luz y Fuerza y genérico): remunerativo, no remunerativo, SAC, horas extra, afiliación y aporte. | El archivo exige CUIL válido para todos los empleados incluidos. |
| CP-SUE-0102 | RF-SUE-102; M16 §5.9; PRO-O9-05 | O9 | Núcleo | regla | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. | Un siniestro activo informa el código de siniestrado en SICOSS del período. |
| CP-SUE-0103 | RF-SUE-103; M16 §5.9; PRO-O9-05 | O9 | Núcleo | integración | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). | No se puede regenerar el LSD de un período presentado sin abrir una rectificativa. |
### 1.10 Recibos y portal del empleado (SUE-008) (M16 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0104 | RF-SUE-104; M16 §5.10; PRO-O9-06 | O9 | Núcleo | funcional | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Recibo de haberes con el contenido del art. 140 LCT (empleador, CUIT, domicilio, trabajador, CUIL, categoría, calificación profesional, fecha de ingreso, período, remuneración básica, conceptos con cantidad y unidad, totales, neto en… | Un recibo sin la constancia del último depósito de aportes no puede emitirse. |
| CP-SUE-0105 | RF-SUE-105; M16 §5.10; PRO-O9-06 | O9 | Núcleo | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Firma del empleador y firma o conformidad del empleado **delegadas en T11**: al emitir, SUE pide la firma a T11 (API-WFL-75) con el perfil SIG-SUE-EMPLEADOR (firma digital con proveedor licenciado vía T06, RF-WFL-198) y luego… | Un recibo firmado por el empleado no puede volver a enviarse a firma ni anularse sin rectificativa. |
| CP-SUE-0106 | RF-SUE-106; M16 §5.10; PRO-O9-06 | O9 | Núcleo | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Entrega digital con constancia de recepción (fecha, hora, dispositivo, IP, hash), notificación y recordatorios de recibos pendientes de firma (los envía T11 con JOB-WFL-09, según PRM-SUE-024/049). | CU-104 paso 4: el empleado confirma la recepción y el estado queda visible en la administración. |
| CP-SUE-0107 | RF-SUE-107; M16 §5.10; PRO-O9-06 | O9 | Núcleo | seguridad | TEN-001 con Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02… | Portal del empleado: lista de recibos, descarga, firma/conformidad en la interfaz de firma de T11 (PAN-WFL-27); opción de mostrar recibos sin firma digital del empleador (P2886). | El empleado solo ve sus recibos; probar con otro `employeeId` devuelve 404. |
| CP-SUE-0108 | RF-SUE-108; M16 §5.10; PRO-O9-06 | O9 | Núcleo | funcional | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. | Una solicitud desde el portal aparece en la bandeja del encargado. |
| CP-SUE-0109 | RF-SUE-109; M16 §5.10; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con Familiares: 10 familiares a cargo (cónyuges e hijos ficticios) con F.572 2026 | Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. | El empleado ve sus datos en modo lectura; una propuesta de cambio queda pendiente hasta que Personal la aprueba, y solo puede descargar sus propios certificados, constancias y evaluaciones. |
| CP-SUE-0110 | RF-SUE-110; M16 §5.10; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Portal del encargado: equipo, licencias y novedades a aprobar, calendario. | El encargado ve solo a los empleados de su equipo (vínculo de supervisión vigente) y puede aprobar o rechazar sus licencias y novedades; un empleado de otro equipo no aparece en su portal. |
| CP-SUE-0111 | RF-SUE-111; M16 §5.10; PRO-O9-06 | O9 | Núcleo | seguridad | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Identidad común con socio sin mezclar datos: la misma cuenta de acceso tiene perfil socio y perfil empleado; el cambio de ámbito recalcula permisos, caché y descargas. | Desde el perfil socio no se accede a `/api/sue/...` aunque el token sea de la misma persona. |
### 1.11 Pago de haberes (SUE-009) (M16 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0112 | RF-SUE-112; M16 §5.11; PRO-O9-07 | O9 | Núcleo | integración | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Solicitud de pago de haberes a M14 por liquidación aprobada: neto por empleado distribuido por sus cuentas, adelantos ya pagados descontados, fecha de pago (modificable con P2288; solicitada si falta con P2484), medio (transferencia… | Una solicitud repetida con la misma `Idempotency-Key` no duplica el pago. |
| CP-SUE-0113 | RF-SUE-113; M16 §5.11; PRO-O9-07 | O9 | Núcleo | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Configuración por empresa y banco de los datos del convenio de pago (CBU de origen, identificador de empresa, código de convenio, uso de la cuenta asignada al empleado, varias cuentas por empleado), consumida por M14 para el archivo… | El archivo de Banco Nación usa la cuenta del empleado cuando la opción está activa. |
| CP-SUE-0114 | RF-SUE-114; M16 §5.11; PRO-O9-07 | O9 | Núcleo | integración | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Conciliación del pago: M14 informa acreditado/rechazado por empleado; el rechazado queda pendiente para reintento con otra cuenta o medio. | Un CBU rechazado deja el recibo «pago rechazado» sin anular la liquidación. |
| CP-SUE-0115 | RF-SUE-115; M16 §5.11; PRO-O9-07 | O9 | Núcleo | migración | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Anulación del pago con reversión en Tesorería (mejora sobre ProCoop, que solo borra la marca). | Anular el pago emite comando a M14 y el recibo vuelve a «pendiente de pago» solo tras su confirmación. |
| CP-SUE-0116 | RF-SUE-116; M16 §5.11; PRO-O9-07 | O9 | Núcleo | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Obligaciones derivadas como cuentas a pagar en M14: F.931 (VEP), aportes sindicales, obra social cuando corresponda, depósitos judiciales de embargos y cuotas alimentarias, seguro de vida. | Cada obligación referencia la liquidación y el período. |
### 1.12 Contabilización (SUE-010) (M16 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0117 | RF-SUE-117; M16 §5.12; PRO-O9-07 | O9 | Núcleo | regla | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo, departamento)… | La validación previa lista los conceptos sin cuenta resuelta antes de aprobar. |
| CP-SUE-0118 | RF-SUE-118; M16 §5.12; PRO-O9-07 | O9 | Núcleo | funcional | TEN-001 con Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) | Asiento de devengamiento por centro de costo, servicio y plan de cuentas del tenant, emitido en el evento de aprobación (no por cierre en lote), con formato configurable (resumido por cuenta, por empleado, por centro de costo). | El ejemplo distribuye el costo entre distribución, administración e internet según la distribución de cada empleado. |
| CP-SUE-0119 | RF-SUE-119; M16 §5.12; PRO-O9-07 | O9 | Núcleo | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Asientos de pago de haberes y de cancelación de obligaciones (generados por M14 con las cuentas puente que define SUE). | Pagar netos cancela la cuenta «sueldos a pagar» por el mismo total. |
| CP-SUE-0120 | RF-SUE-120; M16 §5.12; PRO-O9-07 | O9 | Estándar | regla | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Imputación en planes de cuentas múltiples y escenarios simulados de M15 (§55). | Con dos planes activos, el evento produce un asiento por plan con su mapeo. |
| CP-SUE-0121 | RF-SUE-121; M16 §5.12; PRO-O8-14 | O8 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Asiento de liquidación externa importada (CU-28) con sus totales por concepto y centro de costo. | Un archivo ya importado no genera un segundo asiento. |
### 1.13 Certificaciones y egreso (SUE-011) (M16 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0122 | RF-SUE-122; M16 §5.13; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a pedido. | Al aprobar la liquidación final se genera el pendiente de certificados con plazo y alerta. |
| CP-SUE-0123 | RF-SUE-123; M16 §5.13; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Constancias (de trabajo, de haberes, de aportes) a pedido del empleado desde el portal o la administración. | La constancia lleva código de verificación. |
| CP-SUE-0124 | RF-SUE-124; M16 §5.13; PRO-O9-08 | O9 | Núcleo | integración | TEN-001 con Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en… | Registro del alta y la baja registral (Simplificación Registral de ARCA): datos, fecha, número de constancia y archivo; alerta de plazos. | Un empleado no puede liquidarse si no tiene constancia de alta registrada (advertencia configurable). |
| CP-SUE-0125 | RF-SUE-125; M16 §5.13; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Lista de tareas de egreso: liquidación final, certificados, devolución de equipos y herramientas (M13), revocación de accesos (T02), baja de obra social y ART, baja registral. | Al confirmar el egreso, T02 revoca el perfil empleado al día siguiente de la fecha de egreso. |
| CP-SUE-0126 | RF-SUE-126; M16 §5.13; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Desvinculación registra motivo y fecha y copia al empleado los conceptos del modelo de egreso; reincorporación sin borrar historial. | Al desvincular se exigen motivo y fecha y los conceptos del modelo de egreso quedan copiados al empleado; al reincorporarlo, la historia laboral anterior sigue visible y ningún registro previo se borra. |
### 1.14 Gestión de RRHH — referencia GLM (SUE-012) (M16 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0127 | RF-SUE-127; M16 §5.14; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala… | Evaluaciones de desempeño: plantillas con competencias y escala, tipos (autoevaluación, superior, pares, 180/360), ciclos con fechas, múltiples evaluadores, consolidación de resultado y devolución. | Un ciclo cerrado no admite cambios de calificación. |
| CP-SUE-0128 | RF-SUE-128; M16 §5.14; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000 | Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. | La suma de pesos de los objetivos de un empleado en un ciclo es 100 %. |
| CP-SUE-0129 | RF-SUE-129; M16 §5.14; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. | Suspensiones que superan 30 días en el año generan bloqueo con alerta. |
| CP-SUE-0130 | RF-SUE-130; M16 §5.14; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Sumarios administrativos: apertura, instructor, hechos, etapas, pruebas, descargo, resolución y sanción resultante. | Un sumario registra apertura, instructor, hechos, etapas, pruebas y descargo; no se puede cerrar sin resolución, y la sanción resultante queda registrada como acción disciplinaria vinculada al sumario. |
| CP-SUE-0131 | RF-SUE-131; M16 §5.14; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Licencias: 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente | Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. | El accidente activo genera la licencia por accidente y el código de siniestrado. |
| CP-SUE-0132 | RF-SUE-132; M16 §5.14; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000 | Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). | Cambiar la provisión emite evento para que M15 la registre. |
### 1.15 Aprobaciones, auditoría y reportes (SUE-013, SUE-014) (M16 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0133 | RF-SUE-133; M16 §5.15; PRO-O9-08 | O9 | Núcleo | seguridad | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Workflow de T11 para novedades, licencias, escalas, publicación de configuración, liquidaciones, egresos, pagos, presentaciones y liquidaciones externas, con bandeja única e historial; sin efectos hasta aprobar. | Una liquidación aprobada por el mismo usuario que la calculó es rechazada por el servidor (403). |
| CP-SUE-0134 | RF-SUE-134; M16 §5.15; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Auditoría de lectura de datos sensibles y de remuneraciones ajenas; auditoría de cambios con valor anterior y nuevo. | La consulta de un recibo ajeno deja registro con usuario y fecha. |
| CP-SUE-0135 | RF-SUE-135; M16 §5.15; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Costo laboral por servicio y centro de costo (remuneraciones, contribuciones, provisiones, ART, seguro), por período y comparativo. | CU-104: costo laboral total del período ARS 41.500.000 desglosado por centro de costo. |
| CP-SUE-0136 | RF-SUE-136; M16 §5.15; PRO-O9-08 | O9 | Estándar | regla | TEN-001 con Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias… | Indicadores de ausentismo, horas extra, guardias, licencias y rotación. | Para un período y un área, los indicadores de ausentismo, horas extra, guardias, licencias y rotación se calculan a partir de las novedades, licencias, altas y egresos del período y coinciden con sus listados de detalle. |
| CP-SUE-0137 | RF-SUE-137; M16 §5.15; PRO-O9-08 | O9 | Estándar | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Proyección presupuestaria de costo laboral (escalas futuras, aumentos previstos, SAC, vacaciones) para M15. | La proyección de un ejercicio con un aumento previsto desde un mes aplica el aumento a las escalas desde ese mes, incluye SAC y vacaciones, y se entrega a M15 como costo laboral proyectado por período. |
| CP-SUE-0138 | RF-SUE-138; M16 §5.15; PRO-O9-08 | O9 | Estándar | migración | TEN-001 con Tenant: TEN-001 — Cooperativa Ejemplo A | Informes operativos heredados de ProCoop (ver §15) y gráficos por grupos de conceptos. | Cada informe de ProCoop tiene un reporte equivalente o un reemplazo documentado. |
| CP-SUE-0139 | RF-SUE-139; M16 §5.15; PRO-O9-08 | O9 | Núcleo | funcional | TEN-001 con Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 | Exclusión de datos sensibles de BI general y de APIs para terceros. | El cubo de costo laboral no expone diagnóstico, embargos ni sanciones. |
### 1.16 Importación de liquidación externa (CU-28) (M16 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0140 | RF-SUE-140; M16 §5.16; PRO-O8-14 | O8 | Núcleo | regla | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Importar una liquidación cerrada por un sistema laboral externo: referencia de lote, origen, empresa, período, tipo, totales por concepto y centro de costo, opcionalmente detalle por legajo (neto, CBU) para pagar. | El lote NOM-DEMO-2026-11 con 2 legajos y ARS 2.000.000 se importa sin recalcular salarios. |
| CP-SUE-0141 | RF-SUE-141; M16 §5.16; PRO-O8-14 | O8 | Núcleo | funcional | TEN-001 con Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) | Validaciones: duplicado (misma referencia o mismo hash), total declarado contra suma de renglones, centros de costo existentes, conceptos mapeados a cuentas, empresa y período abiertos. | Si el archivo ya se importó o no coincide el total, se detiene y pide conciliación. |
| CP-SUE-0142 | RF-SUE-142; M16 §5.16; PRO-O8-14 | O8 | Núcleo | funcional | TEN-001 con Cuentas: CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 | Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). | Un concepto externo sin mapeo contable impide confirmar la importación y se lista como error; con el mapeo completo, un archivo CSV, XLSX o JSON con el layout configurado se importa y el asiento usa las cuentas mapeadas. |
| CP-SUE-0143 | RF-SUE-143; M16 §5.16; PRO-O8-14 | O8 | Núcleo | funcional | TEN-001 con Liquidaciones: LIQ-2026-02-M (cerrada y pagada), LIQ-2026-03-M (calculada, pendiente de aprobación), simulación con la escala de abril | Aprobación y envío del resumen a contabilidad (asiento) y a tesorería (pago) | La aprobación emite `sue.externalPayroll.approved`. |
| CP-SUE-0144 | RF-SUE-144; M16 §5.16; PRO-O8-14 | O8 | Núcleo | funcional | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Exclusión mutua por empresa y período entre liquidación propia e importada. | Con liquidación propia aprobada para 2026-11, la importación del mismo período se rechaza. |
### 1.17 Migración y paralelo (M16 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SUE-0145 | RF-SUE-145; M16 §5.17; PRO-O9-08 | O9 | Estándar | migración | TEN-001 con Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) | Paralelo de liquidación ProCoop / GoodApps con comparativo por empleado y concepto durante los períodos que se acuerden. | El informe muestra diferencias por concepto con tolerancia configurable. |
| CP-SUE-0146 | RF-SUE-146; M16 §5.17; PRO-O9-08 | O9 | Núcleo | migración | TEN-001 con Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150 | Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). | Los acumulados de Ganancias migrados permiten liquidar el mes siguiente sin diferencias. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-SUE-5001 — ESC-SUE-01. Aislamiento de tenant: un liquidador de TEN-001 consulta un legajo de TEN-002 por ID**

- Cubre: ESC-SUE-01; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aislamiento de tenant: un liquidador de TEN-001 consulta un legajo de TEN-002 por ID.
- Entonces 404; no se revela existencia.

**CP-SUE-5002 — ESC-SUE-02. Permiso negativo: liquidador intenta aprobar su liquidación**

- Cubre: ESC-SUE-02; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo: liquidador intenta aprobar su liquidación.
- Entonces 403 con `problem+json` y motivo «separación de funciones».

**CP-SUE-5003 — ESC-SUE-03. Permiso negativo: aprobador intenta ejecutar el pago en M14**

- Cubre: ESC-SUE-03; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo: aprobador intenta ejecutar el pago en M14.
- Entonces 403.

**CP-SUE-5004 — ESC-SUE-04. El aprobador figura como empleado dentro del lote que debe aprobar**

- Cubre: ESC-SUE-04; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando El aprobador figura como empleado dentro del lote que debe aprobar.
- Entonces El servidor le impide aprobar su propio recibo; el lote se deriva a otro aprobador habilitado.

**CP-SUE-5005 — ESC-SUE-05. Datos sensibles: usuario sin `sue.datosSensibles.ver` abre la pestaña Planes de descuento**

- Cubre: ESC-SUE-05; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Datos sensibles: usuario sin `sue.datosSensibles.ver` abre la pestaña Planes de descuento.
- Entonces Ve tipo e importe descontado; no ve juzgado, expediente ni carátula; la lectura de quien sí tiene permiso queda auditada.

**CP-SUE-5006 — ESC-SUE-06. Reintento: se repite `POST /payment-requests` con la misma `Idempotency-Key`**

- Cubre: ESC-SUE-06; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento: se repite `POST /payment-requests` con la misma `Idempotency-Key`.
- Entonces Devuelve la misma solicitud; M14 no duplica.

**CP-SUE-5007 — ESC-SUE-07. Caída del job de cálculo en el empleado 9 de 18**

- Cubre: ESC-SUE-07; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Caída del job de cálculo en el empleado 9 de 18.
- Entonces Al reanudar continúa desde el 10; no duplica recibos.

**CP-SUE-5008 — ESC-SUE-08. Conciliación: total de SICOSS vs liquidación vs asiento**

- Cubre: ESC-SUE-08; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación: total de SICOSS vs liquidación vs asiento.
- Entonces Diferencia 0 por subsistema.

**CP-SUE-5009 — ESC-SUE-09. Importación externa duplicada (CU-28)**

- Cubre: ESC-SUE-09; relacionados: CU-28; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación externa duplicada (CU-28).
- Entonces Rechazo con «ya importado»; ningún asiento nuevo.

**CP-SUE-5010 — ESC-SUE-10. Total no coincide en importación externa**

- Cubre: ESC-SUE-10; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Total no coincide en importación externa.
- Entonces Estado `rejected` con diferencia informada.

**CP-SUE-5011 — ESC-SUE-11. Publicar una versión sin simulación**

- Cubre: ESC-SUE-11; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Publicar una versión sin simulación.
- Entonces 422 «requiere simulación revisada».

**CP-SUE-5012 — ESC-SUE-12. Escala retroactiva publicada**

- Cubre: ESC-SUE-12; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala abril con +8 % en borrador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Escala retroactiva publicada.
- Entonces Se sugiere complementaria; recibos de marzo emitidos no cambian.

**CP-SUE-5013 — ESC-SUE-13. Licencia que cruza meses**

- Cubre: ESC-SUE-13; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Sindicatos y convenios: «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26»
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Licencia que cruza meses.
- Entonces Una novedad por mes con los días correctos.

**CP-SUE-5014 — ESC-SUE-14. Licencia en días hábiles con feriado**

- Cubre: ESC-SUE-14; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Licencia en días hábiles con feriado.
- Entonces El feriado no se descuenta.

**CP-SUE-5015 — ESC-SUE-15. Vacaciones con 4 meses de antigüedad y 80 días trabajados**

- Cubre: ESC-SUE-15; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vacaciones con 4 meses de antigüedad y 80 días trabajados.
- Entonces 4 días (1 cada 20).

**CP-SUE-5016 — ESC-SUE-16. Vacaciones con 12 años de antigüedad**

- Cubre: ESC-SUE-16; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Antigüedad: 1 % por año; días de vacaciones 14/21/28/35 según art. 150
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vacaciones con 12 años de antigüedad.
- Entonces 28 días corridos (o los del convenio si son más).

**CP-SUE-5017 — ESC-SUE-17. SAC proporcional de un ingreso del 01-04**

- Cubre: ESC-SUE-17; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando SAC proporcional de un ingreso del 01-04.
- Entonces 50 % del mejor mes × 91/181.

**CP-SUE-5018 — ESC-SUE-18. Art. 245 con 7 años y 4 meses**

- Cubre: ESC-SUE-18; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Sindicatos y convenios: «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26»
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Art. 245 con 7 años y 4 meses.
- Entonces 8 períodos; tope de convenio aplicado si corresponde.

**CP-SUE-5019 — ESC-SUE-19. Embargo con remuneración neta de 1,5 SMVM**

- Cubre: ESC-SUE-19; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Planes de descuento: 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Embargo con remuneración neta de 1,5 SMVM.
- Entonces 10 % de la remuneración; cuota alimentaria sin ese tope.

**CP-SUE-5020 — ESC-SUE-20. Descuentos voluntarios superan el 20 %**

- Cubre: ESC-SUE-20; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Descuentos voluntarios superan el 20 %.
- Entonces Advertencia bloqueante.

**CP-SUE-5021 — ESC-SUE-21. Ganancias: devolución en el mes**

- Cubre: ESC-SUE-21; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ganancias: devolución en el mes.
- Entonces Concepto de devolución y detalle de Ganancias consistente.

**CP-SUE-5022 — ESC-SUE-22. Rectificativa de un recibo firmado**

- Cubre: ESC-SUE-22; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rectificativa de un recibo firmado.
- Entonces Original anulado y conservado; nuevo recibo con referencia; LSD rectificativo.

**CP-SUE-5023 — ESC-SUE-23. Novedades de OT reabierta y recerrada**

- Cubre: ESC-SUE-23; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias injustificadas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Novedades de OT reabierta y recerrada.
- Entonces Sin duplicados; si estaba liquidada, ajuste.

**CP-SUE-5024 — ESC-SUE-24. Portal: empleado A pide el PDF del recibo de B**

- Cubre: ESC-SUE-24; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Portal: empleado A pide el PDF del recibo de B.
- Entonces 404.

**CP-SUE-5025 — ESC-SUE-25. Cambio de ámbito socio → empleado en la PWA**

- Cubre: ESC-SUE-25; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de ámbito socio → empleado en la PWA.
- Entonces Permisos, caché y descargas recalculadas (AGR-006).

**CP-SUE-5026 — ESC-SUE-26. Egreso aprobado**

- Cubre: ESC-SUE-26; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Egreso aprobado.
- Entonces Acceso revocado al día siguiente; certificados pendientes con plazo.

**CP-SUE-5027 — ESC-SUE-27. IA del editor de fórmulas**

- Cubre: ESC-SUE-27; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando IA del editor de fórmulas.
- Entonces La solicitud no contiene nombres, CUIL ni importes reales.

**CP-SUE-5028 — ESC-SUE-28. Datos de prueba**

- Cubre: ESC-SUE-28; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empleados: 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Datos de prueba.
- Entonces Los ambientes de prueba no tienen datos reales ni credenciales productivas de firma ni bancos (AGR-035).

**CP-SUE-5029 — ESC-SUE-29. Período cerrado**

- Cubre: ESC-SUE-29; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias injustificadas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Período cerrado.
- Entonces No se pueden crear novedades ni liquidaciones con ese período.

**CP-SUE-5030 — ESC-SUE-30. Liquidación propia y externa del mismo período**

- Cubre: ESC-SUE-30; RN-SUE-091; M16 §17
- Ola: O9 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Liquidación propia y externa del mismo período.
- Entonces La segunda se rechaza (RN-SUE-091).

## 3. Casos por caso de uso (CU)

**CP-SUE-8001 — CU-28. Importar una liquidación externa (BASE §28, se mantiene como alternativa)**

- Cubre: CU-28; RF-SUE-121, RF-SUE-140, RF-SUE-144; RN-SUE-090; M16 §16
- Ola: O8 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado actor: responsable de personal y contador. - Situación inicial: el sistema laboral externo cerró una liquidación y produjo un archivo autorizado. - Desarrollo: 1) importar la referencia y los totales del período (PAN-SUE-39, API-SUE-75); 2) validar correspondencia de centros de costo y evitar duplicados (RN-SUE-090); 3) enviar el resumen aprobado a contabilidad y tesorería (EVT-SUE-24). - Resultado, autenticado en…
- Cuando -
- Entonces Liquidación externa identificada y contabilizable sin recalcular salarios en esta plataforma. - Excepción o control: si el archivo ya se importó o no coincide el total, detener y solicitar conciliación. - Ola: O8. Requisitos: RF-SUE-121, RF-SUE-140 a RF-SUE-144.

**CP-SUE-8002 — CU-104. Liquidación mensual de una cooperativa eléctrica (BASE §104.5)**

- Cubre: CU-104; RF-SUE-049, RF-SUE-055, RF-SUE-067; M16 §16
- Ola: O9 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Costo laboral de marzo: ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000
- Dado actor: responsable de personal, contador y tesorero. - Desarrollo: 1) las horas de guardia de las cuadrillas se importan desde las órdenes de trabajo cerradas del mes (§9.4); 2) el liquidador revisa novedades, simula la liquidación y compara con el período anterior (PAN-SUE-25/26); 3) el contador aprueba; se generan recibos, el asiento por centro de costo (distribución, administración, internet), el archivo bancario…
- Cuando -
- Entonces Se completa «Liquidación mensual de una cooperativa eléctrica (BASE §104.5)» sin errores, con los efectos que exigen RF-SUE-049, RF-SUE-055, RF-SUE-067, y quedan auditoría y evento del cambio

**CP-SUE-8003 — CU-SUE-01. Alta de un empleado que ya es socio**

- Cubre: CU-SUE-01; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Áreas y centros de costo: Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor RRHH. 1) Busca por CUIL; la persona existe como socio en M01. 2) Crea el legajo en la empresa «Cooperativa» con convenio, categoría, área «Distribución» y distribución 100 % al centro de costo Distribución. 3) Registra la constancia de alta. 4) Activa; T02 agrega el perfil empleado a la misma cuenta.
- Entonces En la PWA aparece el selector de ámbito socio/empleado; en el ámbito socio no hay datos laborales. Excepción: CUIL inválido → error de validación.

**CP-SUE-8004 — CU-SUE-02. Publicar la paritaria con retroactivo**

- Cubre: CU-SUE-02; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Categorías y escala: DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala abril con +8 % en borrador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor responsable laboral y contador. 1) Aplica aumento de 8 % a las categorías del convenio con fecha efectiva 01-03 (PAN-SUE-16). 2) Simula marzo con la nueva escala. 3) El contador publica. 4) El sistema sugiere complementaria de marzo, que se liquida en abril con devengamiento marzo. Excepción: convenio sin validación registrada
- Entonces no publica.

**CP-SUE-8005 — CU-SUE-03. Solicitar y aprobar vacaciones desde la PWA**

- Cubre: CU-SUE-03; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Novedades: 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias injustificadas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor empleado y encargado. 1) El empleado ve 21 días disponibles y solicita 14 días desde el 05-01. 2) El encargado ve el calendario del equipo y aprueba. 3) Se generan novedades, el saldo baja a 7 y se propone liquidar las vacaciones al inicio. Excepción: superposición con otra autorizada
- Entonces rechazo automático de la solicitud.

**CP-SUE-8006 — CU-SUE-04. Liquidar SAC del primer semestre**

- Cubre: CU-SUE-04; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Liquidar SAC del primer semestre
- Entonces Actor liquidador. 1) Crea liquidación tipo SAC 1 para junio. 2) El sistema calcula 50 % de la mayor remuneración del semestre con los conceptos marcados; proporcional para ingresos del semestre. 3) Aprobación y pago antes del vencimiento. Control: alerta 10 días antes del 30-06.

**CP-SUE-8007 — CU-SUE-05. Despido sin causa y liquidación final**

- Cubre: CU-SUE-05; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor RRHH, liquidador, aprobador. 1) Crea el egreso con motivo «despido sin causa», preaviso sustitutivo y fecha 15-08. 2) El sistema propone preaviso, integración del mes, art. 245 con tope de convenio, vacaciones no gozadas y SAC proporcional, Ganancias final. 3) El aprobador aprueba; se pagan y se emiten certificados art. 80 con plazo. 4) T02 revoca el acceso al día siguiente. Excepción: el empleado tiene un embargo activo
- Entonces el sistema aplica el embargo sobre los conceptos embargables y alerta sobre los indemnizatorios según configuración [VERIFICAR].

**CP-SUE-8008 — CU-SUE-06. Importar F.572 y recalcular Ganancias**

- Cubre: CU-SUE-06; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor liquidador. 1) Descarga los XML de ARCA y los importa. 2) Un empleado declara alquiler y un hijo; otro declara otro empleo. 3) La liquidación del mes recalcula la retención acumulativa y genera una devolución en un caso. Excepción: XML de otro CUIT empleador
- Entonces rechazo.

**CP-SUE-8009 — CU-SUE-07. Generar y presentar LSD y SICOSS**

- Cubre: CU-SUE-07; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor liquidador y contador. 1) Con la liquidación aprobada, genera LSD y SICOSS. 2) El control de totales da cero diferencias. 3) El contador aprueba y presenta en ARCA; carga el acuse. 4) El VEP del F.931 se registra como obligación en M14. Excepción: concepto sin código ARCA
- Entonces la generación se detiene y lista los conceptos.

**CP-SUE-8010 — CU-SUE-08. Firma y recepción del recibo**

- Cubre: CU-SUE-08; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor empleado. 1) Recibe la notificación; abre el recibo en la PWA. 2) Firma con OTP en la interfaz de firma de T11 (PAN-WFL-27); T11 guarda la evidencia. 3) Otro empleado firma en disconformidad con observación; RRHH la ve en su bandeja. Excepción: recibo rectificado
- Entonces el anterior aparece como anulado con enlace al nuevo.

**CP-SUE-8011 — CU-SUE-09. Pago con un CBU rechazado**

- Cubre: CU-SUE-09; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actor tesorero y liquidador. 1) M14 informa 17 acreditados y 1 rechazado. 2) El liquidador corrige la cuenta (aprobada por RRHH) y reenvía solo ese ítem.
- Entonces Liquidación `paid`.

**CP-SUE-8012 — CU-SUE-10. Accidente in itinere**

- Cubre: CU-SUE-10; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Accidente in itinere
- Entonces Actor RRHH. 1) Denuncia el accidente y el número de siniestro de la ART. 2) Se genera la licencia por accidente y el código de siniestrado en SICOSS. 3) Se registran reintegros de la ART. 4) Alta médica cierra el caso. Control: datos visibles solo con `sue.datosSensibles.ver`.

**CP-SUE-8013 — CU-SUE-11. Sanción con suspensión**

- Cubre: CU-SUE-11; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sanción con suspensión
- Entonces Actor RRHH. 1) Registra el hecho y notifica una suspensión de 2 días. 2) El empleado presenta descargo; queda `firm`. 3) Se generan novedad sin goce y situación de revista de suspensión. Control: acumulado anual > 30 días bloquea.

**CP-SUE-8014 — CU-SUE-12. Juicio laboral y provisión**

- Cubre: CU-SUE-12; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Liquidación externa: Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Juicio laboral y provisión
- Entonces Actor asesor legal. 1) Registra el juicio y lo vincula al expediente de M08. 2) Fija provisión; M15 la registra. 3) Acuerdo homologado: liquidación complementaria o pago institucional según el caso.

**CP-SUE-8015 — CU-SUE-13. Ciclo de evaluación de desempeño**

- Cubre: CU-SUE-13; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: RRHH: 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ciclo de evaluación de desempeño
- Entonces Actor RRHH, encargados, empleados. 1) Crea el ciclo con plantilla 180°. 2) Autoevaluación y evaluación del superior. 3) Calibración y cierre; devolución registrada.

**CP-SUE-8016 — CU-SUE-14. Pluriempleo en dos empresas del tenant (A validar PA-SUE-11)**

- Cubre: CU-SUE-14; M16 §16
- Ola: O9 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M16 §18.
- Datos de prueba: Empresas empleadoras: EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02 «Servicios Ejemplo SA» (sociedad del tenant, para probar multiempleador)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pluriempleo en dos empresas del tenant (A validar PA-SUE-11)
- Entonces Una persona trabaja en la Cooperativa y en su sociedad de servicios del mismo tenant; designa a la Cooperativa como agente de retención; la otra empresa informa «otros empleos».
