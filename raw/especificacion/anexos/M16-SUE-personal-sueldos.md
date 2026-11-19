# M16 SUE — Personal y sueldos

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (personal, liquidación, contabilización y pago de haberes) · Impuestos (SUE-006 Ganancias 4.ª categoría y SUE-007 seguridad social y presentaciones, solución 7 de §105) · Landing-autogestión (portal del empleado dentro de la PWA única) |
| Olas | **O9** (módulo completo). **O8**: importación de liquidación externa (CU-28) con su asiento y su orden de pago, para no bloquear el ERP administrativo. **O3**: registro mínimo de relación laboral (empleado, empresa, área, centro de costo) que necesitan cuadrillas y órdenes de trabajo de M10 antes de que exista la liquidación. |
| Dueño de datos | Empresas empleadoras (como subdocumento `employer` de `legalEntities` de T04: M16 define y edita el subdocumento, T04 es dueño de la colección; CTR-DAT-06, DEC-064), legajos (relación laboral), familiares a cargo, cuentas de acreditación, documentación laboral, distribución por centros de costo, turnos y asignaciones, historial laboral, situación de revista, relación encargado-operario, observaciones, planes de descuento (embargos, cuotas alimentarias, préstamos, adelantos), estructura laboral del tenant (sindicatos, convenios, categorías, escalas, antigüedad, cargos, áreas laborales, jornadas, guardias, obras sociales adoptadas, motivos de egreso), variables, conceptos, tipos de liquidación, versiones de configuración de sueldos, tipos de novedad, novedades, fichadas, tareas extra, causas y solicitudes de licencia, saldos de vacaciones, períodos, liquidaciones, recibos, cálculo de Ganancias por recibo, declaraciones F.572 importadas, presentaciones (LSD, SICOSS, SICORE de sueldos, F.1357/F.1359, archivos sindicales), solicitudes de pago de haberes, reglas de imputación contable de sueldos, egresos, certificados, firma y entrega de recibos, gestión de RRHH (evaluaciones, objetivos, sanciones, sumarios, accidentes, juicios laborales) e importaciones de liquidación externa. **No** es dueño de: persona (M01), identidad y acceso (T02), tablas oficiales comunes de sueldos y Ganancias y formatos ARCA (plataforma, T04 con M06), cuentas bancarias propias, archivos bancarios y movimientos de tesorería (M14), asientos y plan de cuentas (M15), centros de costo (M15), órdenes de trabajo y partes de cuadrilla (M10), viajes de flota (M18), expediente judicial general (M08 / MER-006), workflow y expediente documental (T11). |
| Fuentes consolidadas | **BASE** §28 (objetivo, límite, alcance, CU-28, datos de precarga, precisión 0.17), §104 completa (104.1 a 104.6: SUE-001 a SUE-014, CU-104, prioridad), §97.1 (datos personales y sensibles), MER-015 (flota: novedades), MER-012 (workflow), MER-006 (gestión judicial), §98 (pendientes 0.15 aplicables: Ley 25.326, plazos de conservación), §99.3 fila «Nómina y libro de sueldos digital», §99.4 conclusión «Nómina», §102 correspondencia (línea 104 → AGR-002, 003, 010, 016, 035), §105 solución 7, §106 (pendientes 0.17 de sueldos, [MER19] GLMSUIT RRHH). **AGR** AGR-006, AGR-009, AGR-033 (más AGR-002, AGR-003, AGR-010, AGR-016, AGR-028, AGR-035 por correspondencia de §102). **DFA** Módulo 20 «Sueldos y personal (C)». **REL** §1 pestaña Sueldos (Administración, Procesos, Configuración, Informes). **RN-08** §11 (11.1 a 11.6), §12.1 (P2034, P2538), §12.3 (P2207, P2547/P2714, P2166, P2167, P2722, P2723), §12.4 (P518/P519, P2653, P2709), §12.5 completa, §13 implicancias 10 y 11, §14 dudas 10 y 11, §15.6 completa (clsFormulas_Sueldo, clsGanancias, clsEmpleados, clsCategorias, clsTramas, clsVariables, clsNovedades, clsSueldos, clsInformes_Sueldo), §15.7 (P2264, P2611, P2653, P3129), §15.2 tabla de resolución de cuentas fila «Sueldos». **RN-09** grupo SUELDOS (28 parámetros). **FIC** 12 (Sueldos) y 15 (Firma digital y electrónica). **CAT** §18 Sueldos (56 tablas). **INV** `ReglasNegocio.Sueldos` (13 clases: LibroSueldoDigital, clsAsientoSueldo, clsCategorias, clsConceptos, clsDatosEmpleado, clsEmpleados, clsFormulas_Sueldo, clsGanancias, clsInformes_Sueldo, clsNovedades, clsSueldos, clsTramas, clsVariables), `GetDatosInforme` (exportaciones e informes de sueldos), `PercepcionSICORE` (Exportar_Sueldos, Get_RetencionesSueldo, Get_SujetosSueldo), `clsFirmaDigital`, `clsCuentas_Asignadas` (Sueldos_*), `clsCierreDiario.GenerarAsientosSueldos`/`Sueldos_AsientoGeneral`, `FormatosAsientoSueldos`, `clsChequeosMenu.Opciones_Menu_Sueldo`, `Configuracion` (frmEditorFormulas, frmAsistenteFormulas, frmImportacionArchivos: ImportarSicossDb, Importar_AnticiposSueldos, Importar_Deducciones_Especiales). **CNX** §2.4 (permisos y alcance), §3 (PWA), §4 (admin, design system). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Liquidar los haberes del personal en relación de dependencia de cada cooperativa (tenant), cumplir las obligaciones laborales, de la seguridad social y de Ganancias de 4.ª categoría que la normativa argentina impone al empleador, y registrar su efecto en contabilidad, centros de costo, servicios, tesorería y presupuesto **sin depender de otro sistema** (BASE §104.2). El módulo cubre el ciclo completo:

1. **Legajo** del empleado y su relación con una o varias **empresas empleadoras** del tenant.
2. **Estructura laboral** parametrizada y versionada por vigencia: sindicatos, convenios colectivos, categorías, escalas, antigüedad, cargos, áreas, jornadas, turnos, guardias, obras sociales y salario mínimo.
3. **Variables y conceptos** con fórmulas versionadas, simulación previa a la publicación (AGR-009) y **aplicación de aumentos**.
4. **Novedades** del período, incluidas las que nacen en partes de cuadrilla, órdenes de trabajo y flota; licencias y vacaciones.
5. **Liquidaciones** mensuales o quincenales, SAC, vacaciones, final por egreso con indemnizaciones de la LCT 20.744, complementarias y rectificativas, más el **simulador**.
6. **Ganancias** de 4.ª categoría (deducciones, F.572 web / SIRADIG, retención mensual, liquidación anual y final, F.1357/F.1359).
7. **Seguridad social**: aportes, contribuciones, ART y siniestros; Libro de Sueldos Digital, archivo para F.931 (SICOSS), SICORE de sueldos y archivos sindicales.
8. **Recibos** con el contenido del art. 140 LCT, firma, entrega digital con constancia y **portal del empleado**.
9. **Pago de haberes** (solicitud a Tesorería M14, que genera el archivo bancario y concilia) y **asientos de sueldos** (M15).
10. **Certificaciones** del art. 80 LCT y egreso.
11. **Gestión de RRHH** con GLMSUIT RRHH como referencia: evaluaciones, objetivos, sanciones, sumarios, accidentes y juicios laborales.
12. **Aprobaciones** con separación de funciones (liquidador, aprobador, tesorero) y **reportes** de costo laboral.

Como alternativa para la cooperativa que conserve su sistema laboral, el módulo permite **importar una liquidación externa** ya cerrada (CU-28) y contabilizarla y pagarla sin recalcular salarios.

## 2. Límite y responsabilidades

### 2.1. Qué hace

- Mantiene el legajo laboral, la estructura laboral y la configuración de cálculo **de cada tenant**, versionadas con fecha efectiva y fecha de registro (AGR-010).
- Calcula liquidaciones con un motor de conceptos y fórmulas **configurado y validado por el responsable laboral o el contador de la cooperativa**. El sistema provee la mecánica y las tablas oficiales; **no interpreta un convenio** por sí mismo (BASE §104.3).
- Genera recibos, presentaciones y archivos en los formatos vigentes de ARCA, ANSES y sindicatos; registra el acuse de presentación que carga el usuario.
- Calcula aportes y contribuciones para el devengamiento contable y el control de lo que se presentará (ver PA-SUE-02).
- Solicita a M14 el pago de haberes y de las obligaciones derivadas (seguridad social, sindicatos, embargos) y recibe su confirmación.
- Emite el evento de liquidación aprobada con el detalle de imputación para que M15 registre el asiento.
- Ofrece al empleado su espacio en la PWA (recibos, vacaciones, licencias, datos, documentos, certificados) y al encargado la gestión de su equipo.

### 2.2. Qué NO hace

- **No liquida a los asociados de una cooperativa de trabajo** como empleados en relación de dependencia; sus retiros a cuenta de excedentes quedan fuera del módulo salvo decisión posterior (BASE §104.3; PA-SUE-15).
- **No liquida honorarios de consejeros y síndicos**: si la asamblea los aprueba se registran como pagos institucionales en M17 (BASE §104.3 y §27).
- No presenta declaraciones juradas en nombre de la cooperativa: prepara los archivos; la presentación, el pago del VEP y la responsabilidad son del contribuyente y su contador (BASE §105 solución 7).
- No mantiene tablas oficiales comunes (topes de aportes, alícuotas, SMVM, deducciones y escalas de Ganancias, códigos SICOSS, layouts ARCA): las mantiene la plataforma (T04, con M06 para lo impositivo) y cada tenant las **adopta** (BASE §104.3).
- No crea personas ni identidades: usa M01 (persona) y T02 (cuenta de acceso); la misma cuenta de acceso puede ser socio y empleado sin mezclar datos (AGR-006).
- No genera el archivo bancario ni mueve fondos: lo hace M14. No registra asientos: lo hace M15.
- No reemplaza el expediente judicial general de M08: el juicio laboral se vincula a él (MER-006).

### 2.3. Qué delega y a quién

| Tema | Delegado a | Cómo |
|---|---|---|
| Persona (nombre, documento, CUIL, domicilio, contacto, nacimiento) | M01 PER | El legajo referencia `personId` obligatorio (RN-PER-135, DEC-097); el alta usa el alta asistida `per.findOrCreatePerson` (RF-PER-174), la lectura `per.getPersonIdentity` y la edición de datos personales se hace por el servicio de M01 con permisos de SUE. |
| Cuenta de acceso del empleado, 2FA, selector de ámbito socio/empleado, revocación al egreso | T02 IAM | SUE emite `sue.employee.hired` / `sue.employee.terminated`; T02 vincula o revoca el perfil «empleado». |
| Tablas oficiales (topes, alícuotas, SMVM, Ganancias, SICOSS, LSD, SICORE) | T04 CFG / M06 FIS | Colecciones de plataforma con fuente y vigencia; SUE las lee por fecha efectiva. |
| Centros de costo, plan de cuentas, asientos, provisiones | M15 CON | Evento `sue.payrollRun.approved` con líneas de imputación; M15 responde `con.entry.posted`. |
| Archivo bancario, orden de pago, conciliación, VEP | M14 TES | Comando `tes.paymentRequest.create` (idempotente); M14 responde `tes.payrollPayment.confirmed` / `.rejected` (EVT-TES-17). |
| Órdenes de trabajo y partes de cuadrilla | M10 TEC | Evento `tec.crewTimesheet.approved` (EVT-TEC-32) / `tec.workOrder.closed` (EVT-TEC-07); SUE crea novedades propuestas. |
| Viajes y uso de vehículos | M18 SOC (flota) | Evento `soc.vehicle.usageRecorded` (EVT-SOC-12); SUE crea novedades propuestas. |
| Lecturas y cortes realizados (tareas extra) | M03 MED / M08 MOR / M10 TEC | Eventos de tarea cumplida con ejecutor; SUE valoriza tareas extra. |
| Cuentas de servicio del empleado (deuda) | M07 COB | Consulta de saldo vencido de cuentas vinculadas (PA-SUE-06). |
| Workflow de aprobaciones y bandeja única | T11 WFL | Definiciones de aprobación por operación; SUE no produce efectos hasta la aprobación (MER-012). |
| Expediente documental y adjuntos | T11 WFL + almacenamiento privado (O0) | URL firmadas; tipos documentales laborales. |
| Notificaciones (correo, push, SMS, WhatsApp) | T09 COM | Plantillas «recibo disponible», «licencia aprobada», etc. |
| Firma de recibos (digital y electrónica), interfaz de firma, OTP, evidencias y conector con el proveedor | T11 WFL (RF-WFL-195 a RF-WFL-202; perfiles SIG-SUE-EMPLEADOR y SIG-SUE-EMPLEADO de T11 §18.5), con T06 INT como conector del proveedor licenciado (DEC-078) | SUE pide la firma por API-WFL-75 y proyecta en el recibo el estado que publica T11 (EVT-WFL-041 a EVT-WFL-043). |
| Reportes avanzados y BI | T10 BIA | Cubos sin datos sensibles (97.1). |
| Presupuesto y compromisos | M15 CON (AGR-028) | SUE publica proyección de costo laboral. |
| Juicio laboral como expediente judicial | M08 MOR (MER-006) | Vínculo `lawsuitCaseId`. |
| Pagos institucionales a consejeros | M17 INS | Fuera de SUE. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Empresa empleadora | Persona jurídica con CUIT propio, dentro del tenant, que emplea personal y presenta sus declaraciones. Un tenant puede tener varias (multiempleador). | `dict:sue.employer` | Empresa (`SU_EMPRESAS`) |
| Tipo de empleador | Clasificación oficial del empleador para SICOSS/LSD. | `dict:sue.employerType` | Tipo de empleador (`SU_TIPOEMPLEADOR`) |
| Empleado / legajo | Relación laboral de una persona con una empresa empleadora. No equivale a usuario ni a asociado. | `dict:sue.employee` | Empleado (`SU_EMPLEADOS`) |
| Número de legajo | Identificador del empleado, único por empresa. | `dict:sue.fileNumber` | `COD_LEG` |
| Fecha de antigüedad | Fecha desde la que se reconoce antigüedad (puede diferir del ingreso por reconocimiento o reingreso). | `dict:sue.seniorityDate` | `FEC_ANTI` |
| Familiar a cargo | Persona vinculada al empleado a efectos de Ganancias, obra social o asignaciones. | `dict:sue.familyMember` | Familiar (`SU_EMP_FAMILIARES`) |
| Cuenta de acreditación | Cuenta bancaria (CBU/CVU) donde se depositan haberes; puede haber varias con porcentaje. | `dict:sue.payAccount` | CBU del empleado (`SU_EMP_CBU`) |
| Sección / centro de costo | Unidad de imputación de costo (M15) con porcentaje de distribución del empleado. | `dict:sue.costAllocation` | Sección (`SU_EMPLEADOS_SEC`) |
| Turno | Horario de trabajo por días de la semana. | `dict:sue.shift` | Turno (`SU_TURNOS`, `SU_TURNOSIT`) |
| Guardia | Disponibilidad o prestación fuera del horario normal remunerada según convenio (pasiva o activa). | `dict:sue.onCall` | Novedad de guardia |
| Situación de revista | Estado del empleado frente a la seguridad social en un tramo del mes (activo, licencia, suspendido, etc.). | `dict:sue.employmentStatus` | Situación de revista (`SU_SITUACION_REVISTA`) |
| Condición | Condición del empleado para SICOSS (por ejemplo, servicios comunes, jubilado). | `dict:sue.sicossCondition` | `SU_CONDICION` |
| Actividad | Código de actividad SICOSS. | `dict:sue.sicossActivity` | `SU_ACTIVIDADES` |
| Modalidad de contratación | Código de modalidad (tiempo indeterminado, plazo fijo, eventual, a tiempo parcial, período de prueba, etc.). | `dict:sue.contractMode` | `SU_CONTRATACION` |
| Sindicato | Entidad gremial con aportes y retenciones y cuentas contables propias. | `dict:sue.union` | `SU_SINDICATO` |
| Convenio colectivo (CCT) | Acuerdo que fija categorías, escalas y adicionales; se parametriza y lo valida el responsable laboral. | `dict:sue.laborAgreement` | Convenio (campo del empleado) |
| Categoría | Nivel salarial dentro de un convenio con básico y horas. | `dict:sue.category` | `SU_CATE` |
| Escala salarial | Valores de básico y adicionales de las categorías con vigencia. | `dict:sue.salaryScale` | Importe de `SU_CATE` (sin vigencia) |
| Escala de antigüedad | Porcentaje o importe y días de vacaciones por tramo de años. | `dict:sue.seniorityScale` | `SU_ANTIGUE` |
| Cargo / puesto | Función del empleado en la organización. | `dict:sue.position` | `SU_CARGO` |
| Obra social | Agente del seguro de salud con código oficial y porcentajes. | `dict:sue.healthInsurer` | `SU_OBRA` |
| ART | Aseguradora de riesgos del trabajo contratada por la empresa empleadora. | `dict:sue.workRiskInsurer` | ART (empresa) |
| Siniestro | Accidente o enfermedad profesional denunciado a la ART. | `dict:sue.workAccident` | Siniestrado (`SU_SINIESTRADO`) |
| SMVM | Salario mínimo, vital y móvil, con vigencia. | `dict:sue.minimumWage` | `SU_SALARIO_MINIMO` |
| Variable | Valor con nombre, calculado por fórmula, reutilizable en conceptos. | `dict:sue.variable` | `SU_VARIABLES` |
| Concepto | Renglón de liquidación (remunerativo, no remunerativo, deducción, retención, contribución, redondeo) con fórmulas. | `dict:sue.concept` | `SU_CONCEPTOS` |
| Extra / adicional | Importe fijo asignado a un empleado o a un grupo de extras. | `dict:sue.extra` | `SU_EXTRAS`, `SU_EMP_EXTRAS`, `SU_EXTRAS_GRUPOS` |
| Tipo de liquidación | Mensual, quincenal, SAC, vacaciones, final, complementaria, rectificativa, adelanto. | `dict:sue.payrollType` | Tipo de recibo (`SU_TIPO_RECIBOS`) |
| Versión de configuración | Paquete coherente de conceptos, variables y escalas con fecha efectiva, simulado antes de publicar. | `dict:sue.configVersion` | — (no existe) |
| Novedad | Hecho del período que alimenta la liquidación (horas, ausencias, adelantos, embargos, etc.). | `dict:sue.novelty` | Novedad (`SU_EMP_NOVEDADES`) |
| Tipo de novedad | Clasificación de la novedad con su comportamiento (cantidad/importe, tope, SIRADIG). | `dict:sue.noveltyType` | `SU_TIPO_NOVEDADES` |
| Fichada | Registro de entrada o salida del reloj. | `dict:sue.timePunch` | `SU_HORAS_LECTOR` |
| Tarea extra | Tarea pagada por unidad (lecturas, cortes, repartos). | `dict:sue.extraTask` | `SU_TAREAS_EXTRAS` |
| Licencia | Ausencia justificada solicitada y autorizada. | `dict:sue.leave` | `SU_LICENCIAS` |
| Causa de licencia | Tipo de licencia con su regla de días y su novedad. | `dict:sue.leaveCause` | `SU_LICENCIAS_CAUSAS` |
| Encargado | Empleado que aprueba licencias y novedades de su equipo. | `dict:sue.supervisor` | Encargado (`SU_EMP_OPER`) |
| Período de sueldos | Mes (o quincena) de una empresa con estado abierto/cerrado. | `dict:sue.payPeriod` | Fecha de cierre de sueldos (P2376) |
| Liquidación | Lote de recibos de un tipo y período para un universo de empleados. | `dict:sue.payrollRun` | Liquidación masiva |
| Recibo de haberes | Comprobante por empleado con sus conceptos, neto y constancias del art. 140 LCT. | `dict:sue.payslip` | Recibo (`SU_SUELDOS`, `SU_SUELDOSIT`) |
| Simulación | Cálculo sin efectos para revisar resultados o una nueva configuración. | `dict:sue.simulation` | Simulador (`SimulacionRecibo`) |
| SAC | Sueldo anual complementario (aguinaldo), dos cuotas (Ley 23.041). | `dict:sue.sac` | SAC (función `SAC`) |
| Liquidación final | Liquidación por egreso con indemnizaciones, vacaciones no gozadas y SAC proporcional. | `dict:sue.finalSettlement` | Desvinculación (`SU_DESVICULACION`) |
| Complementaria | Liquidación adicional de diferencias de un período ya liquidado. | `dict:sue.complementaryRun` | — |
| Rectificativa | Liquidación que reemplaza un recibo emitido con error; el original queda anulado, no se borra. | `dict:sue.correctiveRun` | — (ProCoop borra y reliquida) |
| Ganancias 4.ª categoría | Impuesto sobre rentas del trabajo personal retenido por el empleador agente de retención. | `dict:sue.incomeTax` | Impuesto a las Ganancias |
| F.572 web / SIRADIG | Declaración del empleado de deducciones, cargas y otros empleos. | `dict:sue.f572` | SIRADIG (importación) |
| Escala de Ganancias | Tramos del impuesto por mes y año (art. 94 LIG). | `dict:sue.incomeTaxScale` | Trama (`SU_TRAMAS`) |
| Deducciones de Ganancias | Importes por mes de ganancia no imponible, cónyuge, hijos, especial y otras. | `dict:sue.incomeTaxDeductions` | `SU_DEDUCCIONES*` |
| Aporte / contribución | Importe a cargo del trabajador (aporte) o del empleador (contribución) a cada subsistema. | `dict:sue.contribution` | Clasificación SICOSS del concepto |
| F.931 | Declaración jurada de cargas sociales que se obtiene en ARCA. | `dict:sue.f931` | Exportación SICOSS |
| SICOSS | Aplicativo/servicio de ARCA que recibe el archivo de nómina para generar el F.931. | `dict:sue.sicoss` | `ExportarArchivoSicoss` |
| Libro de Sueldos Digital (LSD) | Libro especial (art. 52 LCT) en formato ARCA (RG 3781), registros 01 a 05. | `dict:sue.digitalPayrollBook` | `LibroSueldoDigital` |
| SICORE de sueldos | Régimen informativo de retenciones de Ganancias practicadas a empleados. | `dict:sue.sicoreWages` | `PercepcionSICORE.Exportar_Sueldos` |
| Orden de pago de haberes | Solicitud a Tesorería de pagar netos y obligaciones de una liquidación. | `dict:sue.payrollPayment` | Pago de sueldos (`GenerarPago`) |
| Regla de imputación contable | Cuenta debe/haber por concepto, empresa, sindicato o filtro personalizado. | `dict:sue.accountingRule` | `SU_ASIENTOS` |
| Certificado art. 80 | Certificado de trabajo y certificación de servicios, remuneraciones y aportes. | `dict:sue.art80Certificate` | — |
| Embargo / cuota alimentaria | Descuento judicial ordenado por oficio con tope legal (o sin tope en alimentos). | `dict:sue.garnishment` | Novedad de embargo |
| Evaluación de desempeño | Ciclo con plantilla, evaluadores y resultado. | `dict:sue.performanceReview` | — (GLM) |
| Sanción / sumario | Medida disciplinaria y procedimiento administrativo previo. | `dict:sue.disciplinary` | — (GLM) |
| Juicio laboral | Reclamo judicial de un trabajador vinculado a la gestión judicial. | `dict:sue.laborLawsuit` | — (GLM) |
| Liquidación externa | Resultado de un sistema laboral ajeno importado para contabilizar y pagar. | `dict:sue.externalPayroll` | — (CU-28) |

## 4. Actores, permisos y alcance

Las capabilities siguen `sue.<recurso>.<acción>`. La separación de funciones (SUE-013) es **obligatoria**: el motor de permisos de T02 impide que un mismo usuario apruebe lo que calculó, que el aprobador ejecute el pago y que nadie apruebe ni modifique **su propio** legajo, novedad o recibo (AGR-008).

| Rol (ejemplo de perfil) | Capabilities | Alcance de datos |
|---|---|---|
| Liquidador de sueldos | `sue.legajos.ver/crear/editar`, `sue.familiares.editar`, `sue.cuentasPago.editar`, `sue.novedades.ver/crear/editar/importar`, `sue.licencias.ver`, `sue.liquidaciones.ver/crear/calcular/simular/enviarAprobacion`, `sue.recibos.ver/emitir`, `sue.ganancias.ver/importarF572/calcular`, `sue.presentaciones.generar`, `sue.pagos.solicitar`, `sue.egresos.crear/calcular`, `sue.certificados.emitir`, `sue.reportes.ver/exportar` | Empresas empleadoras asignadas |
| Aprobador (contador / jefe de personal) | `sue.liquidaciones.aprobar/cerrar/anular`, `sue.novedades.aprobar`, `sue.configuracion.publicar`, `sue.escalas.aprobar`, `sue.egresos.aprobar`, `sue.presentaciones.aprobar`, `sue.importacionExterna.aprobar`, `sue.reportes.ver` | Empresas asignadas |
| Responsable laboral / configurador | `sue.estructura.configurar` (sindicatos, convenios, categorías, escalas, cargos, áreas, jornadas, turnos, obras sociales, motivos de egreso), `sue.conceptos.configurar/simular`, `sue.variables.configurar`, `sue.tiposLiquidacion.configurar`, `sue.tiposNovedad.configurar`, `sue.causasLicencia.configurar`, `sue.aumentos.aplicar`, `sue.reglasContables.configurar` | Tenant |
| Tesorero | `sue.pagos.ver`, `tes.*` en M14 (ejecutar, confirmar, conciliar). Sin `sue.liquidaciones.aprobar`. | Empresas asignadas |
| Responsable de RRHH | `sue.legajos.ver/editar`, `sue.documentos.autorizar`, `sue.licencias.autorizar`, `sue.rrhh.evaluaciones.ver/editar`, `sue.rrhh.objetivos.ver/editar`, `sue.rrhh.sanciones.ver/editar`, `sue.rrhh.sumarios.ver/editar`, `sue.rrhh.accidentes.ver/editar`, `sue.datosSensibles.ver` (antes `sue.rrhh.evaluaciones.*`, `sue.rrhh.objetivos.*`, `sue.rrhh.sanciones.*`, `sue.rrhh.sumarios.*`, `sue.rrhh.accidentes.*`) | Tenant o empresas asignadas |
| Asesor legal | `sue.rrhh.juicios.ver/editar` (antes `sue.rrhh.juicios.*`), `sue.rrhh.sumarios.ver`, `sue.legajos.ver` | Tenant |
| Encargado (supervisor) | `sue.equipo.ver`, `sue.licencias.autorizar` (primera instancia), `sue.novedades.aprobar` (primera instancia), `sue.rrhh.evaluaciones.evaluar`, `sue.rrhh.objetivos.editar` | Operarios a cargo (`supervisionLinks`) |
| Empleado (PWA) | `sue.portal.recibos.ver/firmar`, `sue.portal.licencias.solicitar`, `sue.portal.datos.ver/editar`, `sue.portal.documentos.subir`, `sue.portal.certificados.ver`, `sue.portal.evaluaciones.autoevaluar` (antes `sue.portal.datos.ver/proponerCambio`) | Propios |
| Auditor interno / síndico | `sue.*.ver`, `sue.auditoria.ver`, sin datos sensibles salvo `sue.datosSensibles.ver` explícito | Tenant |
| Contador externo | `sue.reportes.ver/exportar`, `sue.presentaciones.ver/descargar`, `sue.liquidaciones.ver` | Empresas asignadas |
| Importador de liquidación externa | `sue.importacionExterna.importar/ver` | Empresas asignadas |
| Plataforma (operador de tablas oficiales) | `pla.tablasSueldos.editar/publicar` (T04) | Tenant `PLATFORM` |
| Soporte (acceso temporal AGR-034) | Lectura según alcance concedido; **nunca** `sue.datosSensibles.ver` salvo autorización expresa del tenant | Temporal |

Capabilities de datos sensibles (BASE §104.3, §97.1, AGR-033): `sue.datosSensibles.ver` (licencias médicas, accidentes, embargos, cuotas alimentarias, sanciones, sumarios, juicios, discapacidad de familiares), `sue.remuneraciones.ver` (importes de recibos ajenos). Cada lectura de estos datos queda en la auditoría de T02 con usuario, motivo opcional y objeto.

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


Prioridad: Núcleo / Estándar / Extensión. Estado: Informado (BASE), Adoptado (AGR o benchmark), A validar (PA).

### 5.1. Legajo del empleado (SUE-001)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-001 | Registro mínimo de relación laboral: persona (M01), empresa empleadora, número de legajo, área, centro de costo, cargo, estado activo/baja, encargado. Utilizable por cuadrillas y órdenes de trabajo antes de la liquidación. | BASE §104.6 («el modelo de datos debe incluir el módulo desde el inicio»), §17, §73 | Núcleo | O3 | Adoptado | M10 puede asignar a una cuadrilla solo empleados activos del tenant; el registro no expone datos salariales. |
| RF-SUE-002 | Legajo completo con datos personales (tomados de M01: apellido y nombre, documento, CUIL, fecha de nacimiento, sexo/género registral, nacionalidad, estado civil, domicilio, teléfono, correo), datos laborales (fecha de ingreso, fecha de antigüedad reconocida, fecha de baja, empresa, legajo, convenio, sindicato y afiliación, categoría, cargo, área, lugar de trabajo, jornada y turno, modalidad de contratación, condición SICOSS, actividad, zona, situación de revista, tipo de liquidación —mensual, quincenal, jornal—, básico fuera de convenio, adicionales), seguridad social (obra social, plan, adherentes, régimen previsional, ART de la empresa, seguro de vida), Ganancias (agente de retención designado, otros empleos) y pago (cuentas de acreditación). | SUE-001; DFA M20; CAT `SU_EMPLEADOS` (+45 columnas) | Núcleo | O9 | Informado | Un legajo sin CUIL válido (11 dígitos y dígito verificador), sin fecha de ingreso, sin empresa, sin modalidad o sin situación de revista no puede incluirse en una liquidación. |
| RF-SUE-003 | Número de legajo único por empresa empleadora, correlativo sugerido (`GetProximoLegajo`) o manual. | RN-08 §15.6 `ExisteEmpleado`; INV `clsNovedades.GetProximoLegajo` | Núcleo | O9 | Adoptado | Alta con legajo repetido en la misma empresa devuelve error 409; en otra empresa del mismo tenant se admite. |
| RF-SUE-004 | Alta de empleado integrada con personas: busca la persona por documento/CUIL en el tenant, la reutiliza o la crea en M01 sin duplicar. **Sigue RN-PER-135 de M01 (persona única, DEC-097):** `employees.personId` es obligatorio; la acción "nuevo legajo" abre el alta asistida de M01 (RF-PER-174: PAN-PER-04 embebido en modo búsqueda y servicio `per.findOrCreatePerson` con `context = { module: sue, role: employee, legalEntityId }`, donde `legalEntityId` es la empresa empleadora del legajo, porque la ficha del rol empleado es única por persona y empleador, RN-PER-135; antes `{ module: sue, role: employee }`), que busca coincidencias con el motor de M01 (CUIL, documento, DNI dentro del CUIL, nombre fonético, contacto, domicilio), ofrece reutilizar la persona o crearla con las validaciones del alta normal y devuelve el `personId`. El legajo guarda solo los datos laborales; nombre, documento, CUIL, nacimiento, sexo, nacionalidad, estado civil, domicilios y contactos se leen con `per.getPersonIdentity` y se editan en M01. Si la persona ya tiene un legajo no egresado en la misma empresa empleadora, el alta avisa y ofrece abrirlo (RN-SUE-001). Una persona `documentPending` de M01 (DEC-099) no puede pasar a `active` hasta regularizar su documento, porque el legajo exige CUIL válido (RF-SUE-002). | P3081; BASE §3 («persona, asociado, empleado y usuario son conceptos diferentes»); DEC-097; M01 RN-PER-135, RF-PER-174 | Núcleo | O9 | Adoptado | Si la persona ya es socio, el legajo se vincula a la misma persona y el socio no ve datos laborales en su espacio. Dar de alta un legajo con un CUIL que ya tiene una persona en M01 propone esa persona con puntaje 100 y no crea otra; un socio que además es empleado y proveedor tiene una sola persona con los tres roles en la ficha 360 de M01 (RF-PER-015). |
| RF-SUE-005 | Familiares a cargo: persona, parentesco, fecha de nacimiento, estudiante, discapacidad, adherente a obra social, declarado en F.572, porcentaje a deducir, con datos **por año fiscal**. | SUE-001; CAT `SU_EMP_FAMILIARES`, `SU_EMP_FAMILIARES_EXTRAS`; RN-08 §15.6 `ActualizarPorcDeduccion_Familiar` | Núcleo | O9 | Informado | Cambiar el porcentaje a deducir de 2027 no altera el cálculo de Ganancias de 2026. |
| RF-SUE-006 | Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). | SUE-001; CAT `SU_EMP_CBU`; P3129, P2468 | Núcleo | O9 | Informado | Con varias cuentas, la suma de porcentajes es 100 %; un CBU con dígito verificador inválido se rechaza. |
| RF-SUE-007 | Documentación del empleado con tipo documental, archivo, fecha de registro, vencimiento y estado (pendiente, autorizada, rechazada); circuito de autorización por RRHH de lo que el empleado sube desde su portal; alertas de vencimiento. | SUE-001; CAT `SU_EMPLEADOS_DOCUMENTOS`; RN-08 §15.6 `AutorizarDocumentoEmpleado`/`RechazarDocumentoEmpleado`; INV `GuardarDocumentacionEmpleado`, `GetTramitesEmpleados` | Estándar | O9 | Informado | Un documento rechazado conserva el rechazo y su motivo en el historial (no se borra el adjunto sin política de conservación). |
| RF-SUE-008 | Distribución del costo del empleado por centros de costo (secciones) con porcentaje y vigencia; suma 100 %. | SUE-001; CAT `SU_EMPLEADOS_SEC`; P2714; BASE §75 | Núcleo | O9 | Informado | Un asiento de sueldos distribuye el costo del empleado según la distribución vigente en el período devengado. |
| RF-SUE-009 | Turnos asignados al empleado con vigencia desde/hasta, sobre turnos con horarios por día de semana. | DFA M20; CAT `SU_EMP_TURNOS`, `SU_TURNOS`, `SU_TURNOSIT`; INV `Actualizar_Turnos`, `GetTurnosAsignados` | Estándar | O9 | Informado | No puede haber dos turnos superpuestos para el mismo empleado en la misma fecha. |
| RF-SUE-010 | Historial laboral con fecha efectiva y de registro: categoría, convenio, cargo, área, jornada, modalidad, básico fuera de convenio, empresa; consulta «a una fecha». | DFA M20; CAT `SU_EMP_HISCAT_EMP`; INV `GuardarHistoricoCategorias`, `Get_CambiosCategorias`; AGR-010 | Núcleo | O9 | Informado | La reliquidación de un período pasado usa la categoría vigente en ese período, no la actual. |
| RF-SUE-011 | Situación de revista por empleado con fecha desde y día de inicio; hasta tres situaciones por mes, como exige el LSD/SICOSS. | DFA M20; CAT `SU_SITUACION_REVISTA`, `SU_SIT_REVISTA_EMPLEADO`; INV `Get_SU_SIT_REVISTA_EMPLEADO` | Núcleo | O9 | Informado | Una licencia por maternidad aprobada genera la situación de revista correspondiente desde su día de inicio. |
| RF-SUE-012 | Relación encargado-operarios con vigencia; define la bandeja del encargado y el alcance «equipo». | CAT `SU_EMP_OPER`; INV `Guardar_Actualizar_Operario`, `Get_OperariosPorEncargado`, `VerificarGenteACargo` | Estándar | O9 | Informado | Un encargado solo ve licencias y novedades de sus operarios vigentes. |
| RF-SUE-013 | Observaciones del legajo con fecha, usuario y categoría (general o sensible). | CAT `SU_EMP_OBS`; INV `GetObservacionesAnteriores` | Estándar | O9 | Informado | Una observación sensible solo es visible con `sue.datosSensibles.ver`. |
| RF-SUE-014 | Vinculación de cuentas de servicio del empleado (M01/M07) para eventual descuento de deuda en el recibo. | CAT `SU_EMPLEADOS_SUMSOC`; RN-08 §15.6 `ImporteFacturasAdeudadas` | Extensión | O9 | A validar (PA-SUE-06) | Sin autorización escrita del empleado registrada, la función de descuento devuelve 0. |
| RF-SUE-015 | Extras por empleado: importes fijos por concepto extra o grupo de extras, con vigencia. | CAT `SU_EMP_EXTRAS`, `SU_EXTRAS`, `SU_EXTRAS_GRUPOS`; RN-08 §11.1; INV `Actualizar_Extras`, `ActualizarImporteExtra` | Núcleo | O9 | Informado | Un grupo marcado «único» no admite dos extras del mismo grupo para un empleado. |
| RF-SUE-016 | Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo), adelanto (importe, fecha, cuotas). | SUE-003; BASE §104.5 (2 empleados con embargos) | Núcleo | O9 | Informado | El saldo del plan disminuye solo con recibos aprobados; al anular el recibo se restituye. |
| RF-SUE-017 | Alertas del legajo: cambio de categoría por antigüedad (meses del sindicato o convenio), fin del período de prueba, vencimiento de contrato a plazo, vencimiento de documentación, reincorporación tras licencia, cumpleaños. | RN-08 §15.6 `GetEmpleados_RequiereCambioCategoria`; INV `ObtenerCumpleaniosCalendar` | Estándar | O9 | Adoptado | La alerta de cambio de categoría aparece en el tablero cuando pasaron más meses que los configurados desde la última fecha de categoría. |
| RF-SUE-018 | Importación masiva de empleados desde Excel con modelo descargable y referencias (ExcelImportWizard: subir, previsualizar errores, confirmar). | INV `Importar_Empleados`, `Importar_Empleado`, `Exportar_ModeloEmpleados`, `Get_ModeloEmpleados_Referencias` | Estándar | O9 | Adoptado | Las filas con error no se importan y el informe indica fila, campo y motivo. |
| RF-SUE-019 | Reincorporación de un empleado dado de baja conservando el historial; nueva relación o reapertura según decisión del usuario. | RN-08 §15.6 `Vincular_Empleado` | Estándar | O9 | Adoptado | Reincorporar no borra extras, recibos ni la liquidación final anterior. |
| RF-SUE-020 | Segregación de datos sensibles del legajo (salud, discapacidad, embargos, cuotas alimentarias, sanciones, sumarios, accidentes, juicios) con capability propia y auditoría de lectura. | BASE §104.3, §97.1; AGR-033 | Núcleo | O9 | Informado | Un liquidador sin `sue.datosSensibles.ver` ve el descuento del embargo en el recibo pero no el oficio ni la carátula. |
| RF-SUE-021 | Propuesta de cambio de datos por el empleado desde el portal (domicilio, teléfono, correo, familiares, cuenta) con aprobación de RRHH. | SUE-008; AGR-006 | Estándar | O9 | Adoptado | El cambio de CBU propuesto no se aplica hasta su aprobación y queda auditado. |

### 5.2. Empresas empleadoras (multiempleador)

> **DEC-064 (empleador = entidad jurídica):** cada empresa empleadora es una entidad jurídica del tenant (`legalEntities` de T04, RF-CFG-134); sus datos de empleador se guardan en el subdocumento `employer` (T04 RF-CFG-139, CTR-DAT-06). CUIT, razón social y domicilio fiscal se leen de la entidad y no se duplican. Toda referencia a la empresa empleadora en este anexo es `legalEntityId` (antes `employerId`).

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-022 | Varias empresas empleadoras por tenant con CUIT, razón social, domicilio fiscal y de explotación, tipo de empleador, actividad principal, condición fiscal, ART contratada (contrato, alícuota fija y variable, vigencia), seguro de vida obligatorio, zona, convenios bancarios de pago, cuenta de pago (M14), comprobante y numeración de recibos, firma y sello del empleador, responsable de firma de recibos. Se guarda en `legalEntities.employer` (T04 RF-CFG-139); los datos legales y fiscales son los de la entidad jurídica. | DFA M20; CAT `SU_EMPRESAS`, `SU_TIPOEMPLEADOR`; DEC-064; CTR-DAT-06 | Núcleo | O9 | Informado | Dos empresas del mismo tenant generan LSD, SICOSS, pagos y asientos por separado. |
| RF-SUE-023 | Todo legajo pertenece a una empresa (entidad jurídica, `legalEntityId`); liquidaciones, períodos, presentaciones, pagos y asientos se segmentan por empresa. | DFA M20; CAT `SU_SUELDOS`; DEC-064 | Núcleo | O9 | Adoptado | Una liquidación no puede mezclar empleados de dos empresas. |
| RF-SUE-024 | Pluriempleo dentro del tenant: una persona con relaciones laborales simultáneas en dos empresas del tenant, con Ganancias consolidada por el agente de retención designado en SIRADIG. | Benchmark normativo; CAT `SU_EMPLEADOS.COD_EMPR` | Extensión | O9 | A validar (PA-SUE-11) | La empresa no designada informa sus remuneraciones como «otros empleos» al agente de retención. |
| RF-SUE-025 | Importación de datos de la empresa desde archivo (ARCA o modelo propio). | INV `clsSueldos.ImportarEmpresa` | Extensión | O9 | Adoptado | Se previsualizan los datos antes de aplicar. |

### 5.3. Estructura laboral (SUE-002)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-026 | Sindicatos: nombre, CUIT, porcentaje e importe de retención al trabajador, porcentaje e importe de aporte del empleador, meses para cambio de categoría, cuentas contables general y de cargas, datos de depósito. | CAT `SU_SINDICATO`; RN-08 §15.2 fila Sueldos | Núcleo | O9 | Informado | Los porcentajes del sindicato se toman por vigencia, no del valor actual. |
| RF-SUE-027 | Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. | SUE-002; BASE §104.3 | Núcleo | O9 | Informado | Un convenio sin validación registrada no puede publicarse en una versión de configuración. |
| RF-SUE-028 | Categorías por convenio: tipo (mensual, jornal, por hora), horas de trabajo, horas mínimas, días mínimos, adicionales, sindicato. | CAT `SU_CATE`; INV `Basico_Categoria` | Núcleo | O9 | Informado | La función de fórmula «básico de la categoría» devuelve el valor vigente a la fecha del período. |
| RF-SUE-029 | Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. | SUE-002 («escalas por vigencia»); AGR-009, AGR-010 | Núcleo | O9 | Informado | Publicar una escala de abril con fecha efectiva de marzo habilita una liquidación complementaria de marzo (RF-SUE-076). |
| RF-SUE-030 | Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. | CAT `SU_ANTIGUE`; RN-08 §15.6 `Get_DiasVacacionesPorCategoria` | Núcleo | O9 | Informado | Con 12 años de antigüedad el empleado toma el tramo 10–20 configurado. |
| RF-SUE-031 | Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. | SUE-002; CAT `SU_CARGO`; BASE §75 | Núcleo | O9 | Informado | Un área sin centro de costo asociado impide aprobar una liquidación con empleados de esa área (error de configuración previo). |
| RF-SUE-032 | Jornadas (completa, parcial con horas semanales, reducida, insalubre), turnos con horarios por día y régimen de guardias (pasiva/activa, valor u horas equivalentes por convenio). | SUE-002; CAT `SU_TURNOS`, `SU_TURNOSIT` | Núcleo | O9 | Informado | Las horas de guardia importadas se valorizan con la regla de guardia del convenio del empleado. |
| RF-SUE-033 | Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. | CAT `SU_OBRA` | Núcleo | O9 | Informado | El código de obra social del LSD sale de la tabla oficial vigente. |
| RF-SUE-034 | Salario mínimo, vital y móvil con vigencia (tabla de plataforma) usado en fórmulas, embargos y controles. | DFA M20; CAT `SU_SALARIO_MINIMO`; BASE §104.3 | Núcleo | O9 | Informado | La escala de embargabilidad usa el SMVM vigente a la fecha de pago. |
| RF-SUE-035 | Tablas oficiales de seguridad social de plataforma (actividades, condiciones, modalidades de contratación, situaciones de revista, códigos de siniestrado, beneficios SICOSS, tipos de empleador, zonas, códigos de conceptos ARCA para LSD, obras sociales) con fuente, vigencia e importación desde ARCA; el tenant las adopta. | DFA M20; CAT `SU_ACTIVIDADES`, `SU_CONDICION`, `SU_CONTRATACION`, `SU_SITUACION_REVISTA`, `SU_SINIESTRADO`, `SU_BENEFICIOS_SICOSS`, `SU_TIPOEMPLEADOR`; RN-08 §11.6 `Importar_Sicoss`; INV `ImportarSicossDb` | Núcleo | O9 | Informado | Un código dado de baja en la tabla oficial no puede asignarse a un empleado con fecha posterior a su baja. |
| RF-SUE-036 | Motivos de desvinculación (renuncia, despido con causa, sin causa, mutuo acuerdo art. 241, fin de contrato, jubilación, fallecimiento, abandono, fuerza mayor, período de prueba) con su modelo de conceptos de egreso e importes por defecto. | CAT `SU_DESVICULACION`, `SU_DESVIC_EXTRAS`; RN-08 §15.6 `Desvincular_Empleado` | Núcleo | O9 | Informado | Elegir «despido sin causa» propone preaviso, integración, indemnización art. 245, vacaciones no gozadas y SAC proporcional. |

### 5.4. Variables, conceptos y fórmulas (SUE-004)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-037 | Variables con nombre único, descripción, tipo de resultado y fórmula; el renombrado propaga la referencia a todas las variables y conceptos. | DFA M20; CAT `SU_VARIABLES`; RN-08 §15.6 `clsVariables` | Núcleo | O9 | Informado | Renombrar una variable actualiza todas las fórmulas en borrador y deja la versión publicada intacta. |
| RF-SUE-038 | Conceptos con código, descripción, tipo (remunerativo, no remunerativo, deducción, retención, contribución, redondeo), vigencia desde/hasta, fórmula de cantidad, de importe, de base y de filtro, orden de cálculo, «liquidar siempre», afecta SAC, afecta vacaciones, tratamiento en Ganancias, clasificación SICOSS/F.931, clasificación F.1357, subsistemas, código de concepto ARCA para LSD, cuenta contable, visibilidad en recibo, tipos de liquidación donde aplica. | DFA M20; CAT `SU_CONCEPTOS` (+14 columnas), `SU_CONCEPTO_TIPO`; RN-08 §11.2 | Núcleo | O9 | Informado | Un concepto sin código ARCA para LSD no puede publicarse en una empresa que genera LSD. |
| RF-SUE-039 | Lenguaje de fórmulas seguro (sin acceso a código ni a datos ajenos al contexto) con operadores aritméticos, lógicos, condicionales, redondeos, fechas y las funciones de dominio de §6 (RN-SUE-020 a RN-SUE-041). | RN-08 §11.3, §15.6 `clsFormulas_Sueldo`; INV `clsFormulas` | Núcleo | O9 | A validar (PA-SUE-03) | Una fórmula que referencia un concepto de orden posterior se rechaza al validar (dependencia circular u orden inválido). |
| RF-SUE-040 | Editor de fórmulas con árbol de variables, conceptos, datos del empleado, novedades y funciones; validación; prueba sobre un empleado; asistente de IA que **solo propone** la fórmula y explica sus dependencias. | INV `Configuracion.frmEditorFormulas` (`CrearCatalogoAsistenteSueldos`, `btnValidar_Click`), `frmAsistenteFormulas` (`ProcesarDependenciasSueldoAsync`) | Estándar | O9 | Adoptado | La sugerencia de IA no se guarda hasta que el usuario la acepta; no se envían datos personales al proveedor de IA (97.1). |
| RF-SUE-041 | Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y publicación íntegra. | SUE-004; AGR-009 | Núcleo | O9 | Informado | No se puede publicar sin una simulación cuyo informe de diferencias haya sido revisado por un usuario distinto del autor. |
| RF-SUE-042 | Tipos de liquidación: mensual, primera quincena, segunda quincena, jornal semanal/quincenal, SAC primer semestre, SAC segundo semestre, vacaciones, final, complementaria, rectificativa, adelanto; con rango de días, prorrateo para Ganancias, «no descontar adelantos», tipo de escala de Ganancias, comprobante y numeración, marcas SAC y vacaciones. | DFA M20; CAT `SU_TIPO_RECIBOS`; SUE-005 | Núcleo | O9 | Informado | Un concepto marcado solo para «SAC» no aparece en una liquidación mensual. |
| RF-SUE-043 | Aplicar aumentos: porcentaje o importe sobre los básicos de un sindicato, convenio, conjunto de categorías o grupo de extras, con fecha efectiva y redondeo; genera una nueva versión de escala en borrador para aprobar. | DFA M20; REL Sueldos «Aplicar Aumentos»; RN-08 §11.1, §15.6 `AplicarAumentoSueldo_Sindicato`/`_Extras`, `GetImporteAumento` | Núcleo | O9 | Informado | Un aumento del 5 % sobre una escala no modifica la vigente hasta aprobar la nueva versión. |
| RF-SUE-044 | Concepto de redondeo del neto configurable (sin redondeo, al entero superior, a múltiplo) y su clasificación (no remunerativo con P3016). | RN-08 §11.3; P3016 | Estándar | O9 | Informado | Un neto de ARS 812.345,40 con redondeo al entero superior genera un concepto de 0,60. |
| RF-SUE-045 | Grillas de configuración que muestran solo conceptos activos por defecto, con filtro para ver inactivos. | P2481 | Estándar | O9 | Informado | Al abrir la pantalla de conceptos se listan los vigentes a hoy. |

### 5.5. Novedades del período (SUE-003)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-046 | Tipos de novedad: por cantidad o importe, código SIRADIG, marca de anticipo, tope anual, porcentaje sobre ganancia neta, pago a cuenta, afecta impuesto cedular, comportamiento (horas extra 50 %, 100 %, guardias, ausencia injustificada, licencia, vacaciones, adelanto, embargo, cuota alimentaria, préstamo, otros empleos, retención informada). | CAT `SU_TIPO_NOVEDADES`; SUE-003 | Núcleo | O9 | Informado | Un tipo con tope anual impide superar el tope sumando las novedades del año. |
| RF-SUE-047 | Carga de novedades del período en grilla masiva por empleado y tipo, con fecha, cantidad o importe, observación, cuotas y referencia a origen. | DFA M20; CAT `SU_EMP_NOVEDADES`; RN-08 §11.4 `GuardarNovedades`, `NovedadesCuotas` | Núcleo | O9 | Informado | Una novedad en tres cuotas genera tres novedades en los tres períodos siguientes. |
| RF-SUE-048 | Importación de novedades desde Excel con ExcelImportWizard. | RN-08 §11.4; INV `Importar_Novedades_Excel`, `Crear_Excel` | Estándar | O9 | Informado | Las filas de empleados inexistentes o dados de baja se rechazan con motivo. |
| RF-SUE-049 | Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. | SUE-003; CU-104 paso 1; BASE §17, §73 | Núcleo | O9 | Informado | Las 120 horas de guardia del ejemplo entran como novedades en borrador, agrupadas por empleado y OT, sin duplicarse si la OT se reabre y cierra de nuevo. |
| RF-SUE-050 | Novedades propuestas desde flota: horas de conducción, kilómetros, viáticos, pernoctes, por viaje y conductor. | SUE-003; MER-015 | Estándar | O9 | Informado | Un viaje anulado en M18 retira la novedad propuesta si no fue liquidada. |
| RF-SUE-051 | Tareas extra pagadas por unidad (lecturas, cortes, reconexiones, repartos) con tipo, cuenta/suministro, período, empleado, cantidad, unitario y total. | CAT `SU_TAREAS_EXTRAS`, `SU_TAREAS_EXTRAS_EMPLEADOS`; INV `Get_ActividadesExtra` | Estándar | O9 | Informado | Cien lecturas a ARS 350 generan una novedad de ARS 35.000 para el lecturista. |
| RF-SUE-052 | Fichadas de reloj: carga manual o importada, procesamiento contra el turno para obtener horas trabajadas, tardanzas, horas no trabajadas y horas extra propuestas. | RN-08 §11.4 (`:937-1022`); CAT `SU_HORAS_LECTOR`; INV `RegistrarHorario`, `RegistrarHorarioLector`, `GetHorasLector`, `GetNovedadesLector`, `ImportacionHoras` | Estándar | O9 | A validar (PA-SUE-09) | Una fichada manual queda marcada como manual con usuario. |
| RF-SUE-053 | Horas no trabajadas por empleado y fecha, con justificación o descuento. | INV `CargarHorasNoTrabajadas`, `GuardarHorasNoTrabajadas`, `Get_HorasNoTrabajadas` | Estándar | O9 | Informado | Las horas no justificadas generan novedad de descuento propuesta. |
| RF-SUE-054 | Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». | SUE-003; RN-08 §11.5 `GetAdelantos`; P2034, P2538; INV `Importar_AnticiposSueldos`, `CargarAnticipo`, `VerificarAnticipos`, `ImportarArchivoAnticipos` | Núcleo | O9 | Informado | Un adelanto de ARS 100.000 pagado el día 15 aparece como descuento en el recibo mensual. |
| RF-SUE-055 | Aprobación de novedades: el encargado aprueba las de su equipo y el liquidador las consolida; las novedades importadas nacen en borrador. | SUE-013; MER-012 | Núcleo | O9 | Informado | Una novedad en borrador no se toma en la liquidación. |
| RF-SUE-056 | Retención de Ganancias informada manualmente para un período (sustituye el cálculo) con motivo y aprobación. | RN-08 §11.3 (novedad tipo 27, P2611) | Estándar | O9 | Adoptado | El recibo muestra la retención informada y el detalle de Ganancias registra que hubo sustitución. |
| RF-SUE-057 | Remuneraciones y retenciones de otros empleos (incluidas las de cajas previsionales provinciales) como novedades informativas para Ganancias, cargadas desde F.572 o manualmente. | RN-08 §15.6 `Cargar_Ganancias`, `Verificar_Ganancias_Liquidadas` | Núcleo | O9 | Informado | Importar dos veces la misma remuneración de otro empleo no la duplica. |

### 5.6. Licencias y vacaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-058 | Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado, sensible, reserva de puesto. | DFA M20; CAT `SU_LICENCIAS_CAUSAS` | Núcleo | O9 | Informado | La causa «matrimonio» con 10 días corridos rechaza una solicitud de 12 días. |
| RF-SUE-059 | Solicitud de licencia desde el portal o la administración con fechas, días, causa, adjuntos y observación; controles de superposición con otra pendiente o autorizada y de días disponibles. | SUE-008; CAT `SU_LICENCIAS`; RN-08 §15.6 `SolicitarLicencia`, `CalcularDiasDisponibles` | Núcleo | O9 | Informado | No se puede solicitar una licencia que se superpone con otra autorizada del mismo tipo. |
| RF-SUE-060 | Autorización por el encargado (y por RRHH cuando la causa es sensible) que genera una novedad por mes calendario con los días de ese mes; rechazo con causa; notificaciones al solicitante y a encargados. | RN-08 §15.6 `AceptarLicencia`, `RechazarLicencia`; INV `LicenciasPendientes`, `ObtenerLicenciasAutorizadas` | Núcleo | O9 | Informado | Una licencia del 25-03 al 05-04 genera dos novedades (7 días en marzo, 5 en abril). |
| RF-SUE-061 | Saldo de vacaciones por año de goce: días según LCT y convenio (RN-SUE-055), días tomados, solicitados, pendientes de años anteriores y año de control. | SUE-008; RN-08 §15.6; P2598; INV `Get_VacacionesActualYear` | Núcleo | O9 | Informado | El empleado ve en su portal el mismo saldo que RRHH. |
| RF-SUE-062 | Cómputo de días hábiles excluyendo sábados, domingos y feriados (nacionales de plataforma, provinciales y locales del tenant) y días no laborables según el turno. | RN-08 §15.6 (ProCoop no excluye feriados) | Núcleo | O9 | Adoptado (mejora) | Una licencia en días hábiles que incluye un feriado nacional no lo descuenta. |
| RF-SUE-063 | Liquidación de vacaciones al inicio del goce (art. 155 LCT) como tipo de liquidación o dentro de la mensual, según configuración. | SUE-005 | Núcleo | O9 | Informado | Vacaciones de 14 días de un mensualizado se liquidan a sueldo ÷ 25 × 14 con los conceptos marcados. |
| RF-SUE-064 | Licencias por enfermedad inculpable y accidente con plazos pagos (art. 208 LCT) controlados y reserva de puesto (art. 211), certificado médico como dato sensible. | BASE §104.3 (salud restringida) | Núcleo | O9 | Adoptado | Al superar el plazo pago la licencia pasa a reserva de puesto sin goce y se alerta. |
| RF-SUE-065 | Calendario de licencias autorizadas por equipo y área. | INV `ObtenerLicenciasAutorizadasCalendar`, `ObtenerEmpleadosDelArea` | Estándar | O9 | Informado | El encargado ve la superposición de vacaciones de su equipo antes de aprobar. |

### 5.7. Liquidaciones (SUE-005)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-066 | Períodos de sueldos por empresa y tipo con estados abierto, en liquidación, cerrado y reabierto (con motivo y aprobación). | P2376; RN-08 §13.3 | Núcleo | O9 | Adoptado | No se puede crear una novedad con fecha de un período cerrado. |
| RF-SUE-067 | Liquidación masiva mensual o quincenal por empresa con universo filtrable (convenio, sindicato, categoría, área, centro de costo, legajos, situación). | DFA M20; REL «Liquidación Masiva»; SUE-005 | Núcleo | O9 | Informado | Liquidar 18 empleados genera 18 recibos en estado calculado dentro del mismo lote. |
| RF-SUE-068 | Motor de cálculo: armado de contexto del empleado (antigüedad, categoría y escala vigentes, novedades aprobadas, extras, familiares, planes de descuento, acumulados) y evaluación de conceptos en orden, guardando cantidad, base, importe y traza de cálculo por concepto. | RN-08 §11.3 (`GetFormulaEmpleado`, `clsDatosEmpleado`, `clsFormulas`) | Núcleo | O9 | Informado | Para cualquier renglón del recibo se puede ver qué valores y fórmula lo produjeron. |
| RF-SUE-069 | Armado de renglones: descarta conceptos fuera de vigencia o no habilitados para el tipo, los que dan cero salvo «liquidar siempre», suma haberes, resta deducciones y retenciones; las contribuciones no afectan el neto; los conceptos ocultos que afectan Ganancias se conservan para el impuesto. | RN-08 §11.3 `GetItems` | Núcleo | O9 | Informado | Una contribución patronal no aparece en el neto del recibo pero sí en el asiento. |
| RF-SUE-070 | Simulador: cálculo individual o masivo sin efectos, con la configuración vigente o con una versión en borrador; comparativo por empleado y concepto contra el período anterior. | REL «Simulador»; RN-08 §11.3 `SimulacionRecibo`; CU-104 paso 2 | Núcleo | O9 | Informado | Una simulación no consume números de recibo, no mueve saldos de planes de descuento ni emite eventos económicos. |
| RF-SUE-071 | Controles previos a aprobar: variación por empleado mayor al umbral, neto negativo o cero, empleado sin cuenta de acreditación, sin categoría, sin centro de costo, con novedades en borrador, deducciones sobre el límite legal, remuneración por debajo del mínimo de convenio o SMVM proporcional. | CU-104 paso 2; BASE §104.4 | Núcleo | O9 | Adoptado | Un control bloqueante impide enviar a aprobación; uno de advertencia exige justificación. |
| RF-SUE-072 | SAC primer y segundo semestre (Ley 23.041): 50 % de la mayor remuneración mensual devengada del semestre con los conceptos marcados, proporcional al tiempo trabajado; SAC proporcional en egreso. | SUE-005; RN-08 §15.6 función `SAC` | Núcleo | O9 | Informado | Un empleado con 3 meses en el semestre cobra la mitad del mejor mes × 3/6. |
| RF-SUE-073 | Liquidación final por egreso: motivo, fecha de egreso, preaviso otorgado o sustitutivo (art. 231/232), integración del mes de despido (art. 233), indemnización por antigüedad (art. 245) con tope de convenio y piso, indemnizaciones especiales configurables por convenio o ley, vacaciones no gozadas (art. 156) con su SAC, SAC proporcional, días trabajados del mes, Ganancias final, conceptos exentos. | SUE-005; CAT `SU_DESVICULACION`, `SU_DESVIC_EXTRAS` | Núcleo | O9 | Informado | Un despido sin causa con 7 años y 4 meses de antigüedad computa 8 períodos en el art. 245. |
| RF-SUE-074 | Liquidación de vacaciones como tipo independiente (RF-SUE-063) y de adelanto. | SUE-005 | Estándar | O9 | Informado | Una liquidación de vacaciones o de adelanto se crea con su propio tipo de liquidación (RF-SUE-063), separada de la mensual del período, y genera recibos identificados con ese tipo. |
| RF-SUE-075 | Recálculo individual de un empleado dentro de un lote no aprobado. | RN-08 §11.3 | Núcleo | O9 | Adoptado | Recalcular un empleado no cambia los recibos de los demás. |
| RF-SUE-076 | Liquidación complementaria de diferencias de un período cerrado (retroactivos de paritarias, novedades tardías) con período de devengamiento informado para LSD y Ganancias. | SUE-005 | Núcleo | O9 | A validar (PA-SUE-14) | La complementaria de marzo pagada en abril informa devengamiento marzo y pago abril. |
| RF-SUE-077 | Liquidación rectificativa que reemplaza un recibo emitido con error: el original queda anulado y vinculado; nunca se borra. | SUE-005; Convenciones §5 (no borrar documentos económicos) | Núcleo | O9 | Informado | El recibo rectificado conserva su PDF y estado de firma; el nuevo referencia al anterior. |
| RF-SUE-078 | Envío a aprobación, aprobación, cierre y anulación de la liquidación con separación de funciones. | SUE-013; CU-104 paso 3 | Núcleo | O9 | Informado | El usuario que calculó no ve el botón «Aprobar» del lote. |
| RF-SUE-079 | Anulación de una liquidación aprobada no pagada con reversión del asiento y del saldo de planes de descuento; si ya se pagó, solo por rectificativa. | AGR-003 | Núcleo | O9 | Adoptado | Anular emite `sue.payrollRun.voided` y M15 registra el contraasiento. |
| RF-SUE-080 | Un único recibo por empleado, período, tipo de liquidación y empresa (salvo rectificativas y complementarias). | RN-08 §15.6 `ExisteRecibo_*` | Núcleo | O9 | Informado | Crear una segunda mensual de marzo para el mismo legajo devuelve 409. |
| RF-SUE-081 | Embargos y cuotas alimentarias: cálculo del descuento según la escala de embargabilidad sobre la remuneración neta de aportes, cuota alimentaria sin ese tope, orden de prelación, saldo y depósito judicial. | SUE-003; BASE §104.5 | Núcleo | O9 | Informado | Con dos embargos comunes, se respeta el tope total y se aplica la prelación por fecha de notificación del oficio. |
| RF-SUE-082 | Control del límite de deducciones (art. 133 LCT) sobre las retenciones no legales ni judiciales, con alerta. | LCT art. 132–133 | Estándar | O9 | Adoptado | Descuentos voluntarios que superan el 20 % del total de la remuneración generan advertencia bloqueante. |
| RF-SUE-083 | Descuento de deuda de servicios del empleado en el recibo, solo con autorización registrada y dentro de los límites legales. | RN-08 §15.6 `ImporteFacturasAdeudadas` | Extensión | O9 | A validar (PA-SUE-06) | El importe descontado se informa a M07 como cobro imputado a la deuda. |
| RF-SUE-084 | Provisiones mensuales de SAC y vacaciones (devengamiento) para el asiento y la proyección. | SUE-010; SUE-014 | Estándar | O9 | Adoptado | La provisión de SAC de marzo es 1/12 de la base estimada del semestre configurada. |

### 5.8. Ganancias de 4.ª categoría (SUE-006)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-085 | Tablas de Ganancias de plataforma con fuente y vigencia: deducciones personales por mes y año (ganancia no imponible, cónyuge, hijo, hijo incapacitado, deducción especial y sus variantes), deducción especial incrementada por sueldo promedio, escala del art. 94 por mes acumulado, topes de deducciones generales, tipos de deducción y de escala. | SUE-006; BASE §104.3; CAT `SU_DEDUCCIONES`, `SU_DEDUCCIONES_ESPECIAL`, `SU_DEDUCCIONES_TIPOS`, `SU_TRAMAS`, `SU_TRAMAS_TIPOS`; RN-08 §15.6 `CrearDeduccionAnual`, `clsTramas` | Núcleo | O9 | Informado | Un tenant no puede editar la escala oficial; puede adoptarla y ver su fuente. |
| RF-SUE-086 | Importación del F.572 web (SIRADIG) por empleado y período: cargas de familia, deducciones generales, otros empleos, pagos a cuenta, percepciones, con versión del formulario y fecha; P2763 para novedades de diciembre. | SUE-006; RN-08 §11.3; FIC 12; P2763 | Núcleo | O9 | Informado | Reimportar una versión posterior del F.572 reemplaza la anterior y conserva el historial. |
| RF-SUE-087 | Cálculo mensual acumulativo de la retención: ganancia bruta acumulada, deducciones, ganancia neta sujeta, impuesto determinado según escala, retenciones anteriores, retención o devolución del mes; detalle por recibo. | SUE-006; CAT `SU_SUELDOS_DETGAN`; RN-08 §11.3 `GetCalculoGanancias` | Núcleo | O9 | Informado | La suma de las retenciones del año coincide con el impuesto determinado de la liquidación anual. |
| RF-SUE-088 | Calculadora de Ganancias por empleado con cada campo del cálculo y diferencias mes a mes exportables a Excel. | RN-08 §11.3 (`:1677-1960`), §15.6 `Campo_Calculadora_Ganancias`, `ExportarDiferencialesAExcel`, `GetCalculosMensualesDiferenciales` | Estándar | O9 | Informado | El liquidador puede explicar cada importe de la retención a una fecha. |
| RF-SUE-089 | Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. | SUE-006; RN-08 §11.6 F.1359; INV `ExportarArchivoF1357`, `ExportarArchivoF1359`, `GetDatosF649` | Núcleo | O9 | Informado | El formulario anual del empleado coincide con el detalle de Ganancias de sus recibos. |
| RF-SUE-090 | Devolución de retenciones en exceso en el recibo con concepto propio. | SUE-006 | Núcleo | O9 | Adoptado | Si el acumulado retenido supera el determinado, el recibo muestra una devolución. |
| RF-SUE-091 | Configuración del período fiscal de liquidación de Ganancias (enero–diciembre, febrero–enero, diciembre–noviembre, enero–diciembre según fecha de pago). | P2611; RN-08 §15.7 | Estándar | O9 | Informado | Con «según fecha de pago», un recibo de diciembre pagado en enero se imputa al año siguiente. |
| RF-SUE-092 | Prorrateo de conceptos no mensuales (SAC y tipos marcados «prorratear») por doceavas hasta fin de año para la retención. | RN-08 §15.6 `ValoresPromedioGanancias` | Estándar | O9 | Informado | Un bono anual prorrateado se distribuye en las doceavas restantes. |
| RF-SUE-093 | Reglas de procedencia de la retención por remuneración bruta mínima y promedios mensuales o semestrales según la norma vigente, parametrizadas en tabla oficial. | RN-08 §15.6 `CorrespondeAplicarGanancias`, `CorrespondeAplicarGanancias2`, `PromedioGanancias` | Núcleo | O9 | Informado [VERIFICAR norma vigente] | Un empleado cuyo bruto está bajo el mínimo vigente no sufre retención. |
| RF-SUE-094 | Impuesto cedular y deducciones especiales DEIA/incrementada como funciones disponibles con tablas versionadas, desactivadas por defecto. | RN-08 §15.6 `Impuesto_Cedular`, `Deduccion_Especial_DEIA1`, `Deduccion_Especial_Incrementada` | Extensión | O9 | Adoptado [VERIFICAR vigencia] | Sin tabla vigente, la función devuelve 0 y lo informa en la traza. |
| RF-SUE-095 | Importación de deducciones especiales desde archivo. | INV `Importar_Ded_Esp`, `frmImportacionArchivos.Importar_Deducciones_Especiales` | Extensión | O9 | Informado | La importación de un archivo de deducciones especiales muestra una vista previa con los errores por fila (empleado inexistente, deducción o importe inválido) y solo carga las filas válidas después de confirmar. |

### 5.9. Seguridad social y presentaciones (SUE-007)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-096 | Cálculo de aportes y contribuciones por subsistema (SIPA, INSSJyP, obra social, Fondo Solidario de Redistribución, RENATRE cuando aplique, asignaciones familiares, Fondo Nacional de Empleo, LRT/ART, seguro de vida obligatorio), con bases imponibles mínima y máxima por vigencia (distinguiendo meses con SAC), detracción y alícuotas de la tabla oficial. | SUE-007; RN-08 §11.6; P2437, P2438 | Núcleo | O9 | A validar (PA-SUE-02) | La base topeada de junio usa el tope de meses con SAC. |
| RF-SUE-097 | Archivo para SICOSS/F.931 por empresa y período (TXT posicional por CUIL) con importes por clasificación, situaciones de revista, obra social, adherentes, zona, condición, actividad, siniestrado, tipo de empresa, reducciones y beneficios. | SUE-007; RN-08 §11.6 `ExportarArchivoSicoss`; FIC 12 | Núcleo | O9 | Informado | El total de remuneraciones del archivo coincide con el total de la liquidación del período. |
| RF-SUE-098 | Libro de Sueldos Digital (RG 3781): registros 01 a 05, códigos de concepto ARCA, P3065 (tope de vacaciones proporcionales), por empresa y liquidación, con validación y estado (generado, presentado con acuse adjunto). | SUE-007; REL «Libro sueldo digital (deshabilitado)»; RN-08 §11.6 `LibroSueldoDigital`; DFA M20 | Núcleo | O9 | Informado | Un concepto sin asociación al código ARCA bloquea la generación con el detalle del concepto. |
| RF-SUE-099 | Control de totales SICOSS/LSD contra liquidación y asiento por subsistema. | INV `GetTotalSicoss` | Estándar | O9 | Adoptado | Diferencias distintas de cero se informan por empleado y subsistema. |
| RF-SUE-100 | SICORE de sueldos: retenciones de Ganancias 4.ª categoría del período por empleado con código de régimen e impuesto de la tabla oficial. | FIC 12; INV `PercepcionSICORE.Exportar_Sueldos`, `Get_RetencionesSueldo`, `Get_SujetosSueldo`, `ExportarArchivoSICORE` | Núcleo | O9 | Informado [VERIFICAR régimen] | El total del archivo coincide con la suma de retenciones de los recibos pagados del mes. |
| RF-SUE-101 | Archivos sindicales con layout configurable (incluidos Luz y Fuerza, regional de Luz y Fuerza y genérico): remunerativo, no remunerativo, SAC, horas extra, afiliación y aporte. | RN-08 §15.6 `ExportarArchivoRegionalLuzYFuerza`; INV `ExportarArchivoLuzYFuerza`, `ExportarArchivoSindicato`; P2264 | Estándar | O9 | Informado | El archivo exige CUIL válido para todos los empleados incluidos. |
| RF-SUE-102 | ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. | DFA M20 «ART / siniestros»; CAT `SU_SINIESTRADO`; SUE-012 | Núcleo | O9 | Informado | Un siniestro activo informa el código de siniestrado en SICOSS del período. |
| RF-SUE-103 | Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). | SUE-007; BASE §105 solución 7 | Núcleo | O9 | Adoptado | No se puede regenerar el LSD de un período presentado sin abrir una rectificativa. |

### 5.10. Recibos y portal del empleado (SUE-008)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-104 | Recibo de haberes con el contenido del art. 140 LCT (empleador, CUIT, domicilio, trabajador, CUIL, categoría, calificación profesional, fecha de ingreso, período, remuneración básica, conceptos con cantidad y unidad, totales, neto en números y letras, constancia del último depósito de aportes con período, fecha y banco, lugar y fecha de pago) en PDF con duplicado; nombre de archivo configurable (formato CUIL_AÑO_MES). | SUE-008; CAT `SU_SUELDOS`; P2985, P2751 | Núcleo | O9 | Informado | Un recibo sin la constancia del último depósito de aportes no puede emitirse. |
| RF-SUE-105 | Firma del empleador y firma o conformidad del empleado **delegadas en T11**: al emitir, SUE pide la firma a T11 (API-WFL-75) con el perfil SIG-SUE-EMPLEADOR (firma digital con proveedor licenciado vía T06, RF-WFL-198) y luego SIG-SUE-EMPLEADO (firma electrónica con OTP, RF-WFL-197); SUE arma los lotes, proyecta en el recibo el estado que publica T11 y registra la no conformidad con observación (RF-WFL-202). SUE no integra proveedores ni guarda evidencias de firma. | SUE-008; FIC 15; RN-08 §11.4, §15.6 `ExcluirRecibosFirmados`, `VerificarRecibosEnLote`; CAT `SU_NOTIFICACIONES`; INV `clsFirmaDigital` | Núcleo | O9 | Adoptado (DEC-078) | Un recibo firmado por el empleado no puede volver a enviarse a firma ni anularse sin rectificativa. |
| RF-SUE-106 | Entrega digital con constancia de recepción (fecha, hora, dispositivo, IP, hash), notificación y recordatorios de recibos pendientes de firma (los envía T11 con JOB-WFL-09, según PRM-SUE-024/049). | SUE-008; P3107; INV `GuardarNotificacionEnBD`, `MarcarNotificacionComoVisto` | Núcleo | O9 | Informado | CU-104 paso 4: el empleado confirma la recepción y el estado queda visible en la administración. |
| RF-SUE-107 | Portal del empleado: lista de recibos, descarga, firma/conformidad en la interfaz de firma de T11 (PAN-WFL-27); opción de mostrar recibos sin firma digital del empleador (P2886). | SUE-008; DFA M20 «Mejoras propuestas»; P2886 | Núcleo | O9 | Informado | El empleado solo ve sus recibos; probar con otro `employeeId` devuelve 404. |
| RF-SUE-108 | Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. | SUE-008 | Núcleo | O9 | Informado | Una solicitud desde el portal aparece en la bandeja del encargado. |
| RF-SUE-109 | Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. | SUE-008, SUE-011, SUE-012 | Estándar | O9 | Adoptado | El empleado ve sus datos en modo lectura; una propuesta de cambio queda pendiente hasta que Personal la aprueba, y solo puede descargar sus propios certificados, constancias y evaluaciones. |
| RF-SUE-110 | Portal del encargado: equipo, licencias y novedades a aprobar, calendario. | SUE-013; CAT `SU_EMP_OPER` | Estándar | O9 | Adoptado | El encargado ve solo a los empleados de su equipo (vínculo de supervisión vigente) y puede aprobar o rechazar sus licencias y novedades; un empleado de otro equipo no aparece en su portal. |
| RF-SUE-111 | Identidad común con socio sin mezclar datos: la misma cuenta de acceso tiene perfil socio y perfil empleado; el cambio de ámbito recalcula permisos, caché y descargas. | SUE-008; AGR-006 | Núcleo | O9 | Informado | Desde el perfil socio no se accede a `/api/sue/...` aunque el token sea de la misma persona. |

### 5.11. Pago de haberes (SUE-009)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-112 | Solicitud de pago de haberes a M14 por liquidación aprobada: neto por empleado distribuido por sus cuentas, adelantos ya pagados descontados, fecha de pago (modificable con P2288; solicitada si falta con P2484), medio (transferencia, cheque, efectivo con recibo). | SUE-009; RN-08 §11.5 `GenerarPago`; P2288, P2484 | Núcleo | O9 | Informado | Una solicitud repetida con la misma `Idempotency-Key` no duplica el pago. |
| RF-SUE-113 | Configuración por empresa y banco de los datos del convenio de pago (CBU de origen, identificador de empresa, código de convenio, uso de la cuenta asignada al empleado, varias cuentas por empleado), consumida por M14 para el archivo bancario. | SUE-009; P326, P2262, P2406, P2449, P2468, P2671, P2672, P2942, P2943, P2944, P3129 | Núcleo | O9 | Informado | El archivo de Banco Nación usa la cuenta del empleado cuando la opción está activa. |
| RF-SUE-114 | Conciliación del pago: M14 informa acreditado/rechazado por empleado; el rechazado queda pendiente para reintento con otra cuenta o medio. | SUE-009; CU-104 paso 4; CAT `SU_AUDIT_TRA_INTERBANKING` | Núcleo | O9 | Informado | Un CBU rechazado deja el recibo «pago rechazado» sin anular la liquidación. |
| RF-SUE-115 | Anulación del pago con reversión en Tesorería (mejora sobre ProCoop, que solo borra la marca). | RN-08 §15.6 `AnularPago` | Núcleo | O9 | Adoptado (mejora) | Anular el pago emite comando a M14 y el recibo vuelve a «pendiente de pago» solo tras su confirmación. |
| RF-SUE-116 | Obligaciones derivadas como cuentas a pagar en M14: F.931 (VEP), aportes sindicales, obra social cuando corresponda, depósitos judiciales de embargos y cuotas alimentarias, seguro de vida. | SUE-009; SUE-007 | Núcleo | O9 | Adoptado | Cada obligación referencia la liquidación y el período. |

### 5.12. Contabilización (SUE-010)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-117 | Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo, departamento) con cuenta debe y haber y prioridad. | SUE-010; CAT `SU_ASIENTOS`; RN-08 §15.2 fila Sueldos; INV `clsCuentas_Asignadas.Sueldos_*`, `clsAsientoSueldo` | Núcleo | O9 | Informado | La validación previa lista los conceptos sin cuenta resuelta antes de aprobar. |
| RF-SUE-118 | Asiento de devengamiento por centro de costo, servicio y plan de cuentas del tenant, emitido en el evento de aprobación (no por cierre en lote), con formato configurable (resumido por cuenta, por empleado, por centro de costo). | SUE-010; P2207; RN-08 §13.1; CU-104 paso 3 | Núcleo | O9 | Informado | El ejemplo distribuye el costo entre distribución, administración e internet según la distribución de cada empleado. |
| RF-SUE-119 | Asientos de pago de haberes y de cancelación de obligaciones (generados por M14 con las cuentas puente que define SUE). | SUE-010 | Núcleo | O9 | Informado | Pagar netos cancela la cuenta «sueldos a pagar» por el mismo total. |
| RF-SUE-120 | Imputación en planes de cuentas múltiples y escenarios simulados de M15 (§55). | SUE-010; BASE §55 | Estándar | O9 | Informado | Con dos planes activos, el evento produce un asiento por plan con su mapeo. |
| RF-SUE-121 | Asiento de liquidación externa importada (CU-28) con sus totales por concepto y centro de costo. | BASE §28 CU-28 | Núcleo | O8 | Informado | Un archivo ya importado no genera un segundo asiento. |

### 5.13. Certificaciones y egreso (SUE-011)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-122 | Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a pedido. | SUE-011 | Núcleo | O9 | Informado | Al aprobar la liquidación final se genera el pendiente de certificados con plazo y alerta. |
| RF-SUE-123 | Constancias (de trabajo, de haberes, de aportes) a pedido del empleado desde el portal o la administración. | SUE-011 | Estándar | O9 | Informado | La constancia lleva código de verificación. |
| RF-SUE-124 | Registro del alta y la baja registral (Simplificación Registral de ARCA): datos, fecha, número de constancia y archivo; alerta de plazos. | SUE-011 («baja registral») | Núcleo | O9 | Informado | Un empleado no puede liquidarse si no tiene constancia de alta registrada (advertencia configurable). |
| RF-SUE-125 | Lista de tareas de egreso: liquidación final, certificados, devolución de equipos y herramientas (M13), revocación de accesos (T02), baja de obra social y ART, baja registral. | SUE-011; AGR-003 | Estándar | O9 | Adoptado | Al confirmar el egreso, T02 revoca el perfil empleado al día siguiente de la fecha de egreso. |
| RF-SUE-126 | Desvinculación registra motivo y fecha y copia al empleado los conceptos del modelo de egreso; reincorporación sin borrar historial. | RN-08 §15.6 `Desvincular_Empleado`, `Vincular_Empleado` | Núcleo | O9 | Informado | Al desvincular se exigen motivo y fecha y los conceptos del modelo de egreso quedan copiados al empleado; al reincorporarlo, la historia laboral anterior sigue visible y ningún registro previo se borra. |

### 5.14. Gestión de RRHH — referencia GLM (SUE-012)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-127 | Evaluaciones de desempeño: plantillas con competencias y escala, tipos (autoevaluación, superior, pares, 180/360), ciclos con fechas, múltiples evaluadores, consolidación de resultado y devolución. | SUE-012; [MER19] | Estándar | O9 | A validar (PA-SUE-08) | Un ciclo cerrado no admite cambios de calificación. |
| RF-SUE-128 | Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. | SUE-012 | Estándar | O9 | A validar (PA-SUE-08) | La suma de pesos de los objetivos de un empleado en un ciclo es 100 %. |
| RF-SUE-129 | Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. | SUE-012; LCT art. 67, 218–220 | Núcleo | O9 | Informado | Suspensiones que superan 30 días en el año generan bloqueo con alerta. |
| RF-SUE-130 | Sumarios administrativos: apertura, instructor, hechos, etapas, pruebas, descargo, resolución y sanción resultante. | SUE-012 | Estándar | O9 | Informado | Un sumario registra apertura, instructor, hechos, etapas, pruebas y descargo; no se puede cerrar sin resolución, y la sanción resultante queda registrada como acción disciplinaria vinculada al sumario. |
| RF-SUE-131 | Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. | SUE-012; DFA M20; CAT `SU_SINIESTRADO` | Núcleo | O9 | Informado | El accidente activo genera la licencia por accidente y el código de siniestrado. |
| RF-SUE-132 | Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). | SUE-012; MER-006 | Estándar | O9 | Informado | Cambiar la provisión emite evento para que M15 la registre. |

### 5.15. Aprobaciones, auditoría y reportes (SUE-013, SUE-014)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-133 | Workflow de T11 para novedades, licencias, escalas, publicación de configuración, liquidaciones, egresos, pagos, presentaciones y liquidaciones externas, con bandeja única e historial; sin efectos hasta aprobar. | SUE-013; MER-012 | Núcleo | O9 | Informado | Una liquidación aprobada por el mismo usuario que la calculó es rechazada por el servidor (403). |
| RF-SUE-134 | Auditoría de lectura de datos sensibles y de remuneraciones ajenas; auditoría de cambios con valor anterior y nuevo. | BASE §104.3; AGR-033 | Núcleo | O9 | Informado | La consulta de un recibo ajeno deja registro con usuario y fecha. |
| RF-SUE-135 | Costo laboral por servicio y centro de costo (remuneraciones, contribuciones, provisiones, ART, seguro), por período y comparativo. | SUE-014 | Núcleo | O9 | Informado | CU-104: costo laboral total del período ARS 41.500.000 desglosado por centro de costo. |
| RF-SUE-136 | Indicadores de ausentismo, horas extra, guardias, licencias y rotación. | SUE-014 | Estándar | O9 | Informado | Para un período y un área, los indicadores de ausentismo, horas extra, guardias, licencias y rotación se calculan a partir de las novedades, licencias, altas y egresos del período y coinciden con sus listados de detalle. |
| RF-SUE-137 | Proyección presupuestaria de costo laboral (escalas futuras, aumentos previstos, SAC, vacaciones) para M15. | SUE-014; AGR-028 | Estándar | O9 | Informado | La proyección de un ejercicio con un aumento previsto desde un mes aplica el aumento a las escalas desde ese mes, incluye SAC y vacaciones, y se entrega a M15 como costo laboral proyectado por período. |
| RF-SUE-138 | Informes operativos heredados de ProCoop (ver §15) y gráficos por grupos de conceptos. | REL «Informes de Sueldos»; INV `GetDatosInforme`; CAT `SU_GRUPO_GRAFICO` | Estándar | O9 | Informado | Cada informe de ProCoop tiene un reporte equivalente o un reemplazo documentado. |
| RF-SUE-139 | Exclusión de datos sensibles de BI general y de APIs para terceros. | BASE §97.1; AGR-033 | Núcleo | O9 | Informado | El cubo de costo laboral no expone diagnóstico, embargos ni sanciones. |

### 5.16. Importación de liquidación externa (CU-28)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-140 | Importar una liquidación cerrada por un sistema laboral externo: referencia de lote, origen, empresa, período, tipo, totales por concepto y centro de costo, opcionalmente detalle por legajo (neto, CBU) para pagar. | BASE §28 CU-28, §104.1 | Núcleo | O8 | Informado | El lote NOM-DEMO-2026-11 con 2 legajos y ARS 2.000.000 se importa sin recalcular salarios. |
| RF-SUE-141 | Validaciones: duplicado (misma referencia o mismo hash), total declarado contra suma de renglones, centros de costo existentes, conceptos mapeados a cuentas, empresa y período abiertos. | BASE §28 CU-28 pasos 2 y excepción | Núcleo | O8 | Informado | Si el archivo ya se importó o no coincide el total, se detiene y pide conciliación. |
| RF-SUE-142 | Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). | BASE §28 | Núcleo | O8 | Adoptado | Un concepto externo sin mapeo contable impide confirmar la importación y se lista como error; con el mapeo completo, un archivo CSV, XLSX o JSON con el layout configurado se importa y el asiento usa las cuentas mapeadas. |
| RF-SUE-143 | Aprobación y envío del resumen a contabilidad (asiento) y a tesorería (pago) | BASE §28 CU-28 paso 3 | Núcleo | O8 | Informado | La aprobación emite `sue.externalPayroll.approved`. |
| RF-SUE-144 | Exclusión mutua por empresa y período entre liquidación propia e importada. | BASE §104.1 | Núcleo | O8 | Adoptado | Con liquidación propia aprobada para 2026-11, la importación del mismo período se rechaza. |

### 5.17. Migración y paralelo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-SUE-145 | Paralelo de liquidación ProCoop / CoopApps con comparativo por empleado y concepto durante los períodos que se acuerden. | BASE §104.6; T07 | Estándar | O9 | Adoptado (DEC-058: dos períodos en paralelo en O9) | El informe muestra diferencias por concepto con tolerancia configurable. |
| RF-SUE-146 | Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). | T07; CAT §18 | Núcleo | O9 | Adoptado | Los acumulados de Ganancias migrados permiten liquidar el mes siguiente sin diferencias. |

## 6. Reglas de negocio

Decisión: **Replicar** (igual que ProCoop), **Mejorar** (misma intención con corrección o mejora), **Reemplazar** (otra solución), **Descartar**. Todas las cifras normativas se leen de tablas oficiales versionadas; ningún importe o porcentaje legal está fijo en código.

### 6.1. Legajo y estructura

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-001 | El legajo es único por empresa empleadora: el número de legajo no se repite dentro de la empresa (RF-SUE-003) y una persona tiene a lo sumo un legajo no egresado por empresa empleadora (`legalEntityId`). La misma persona de M01 puede tener legajos con distintas empresas empleadoras del tenant, todos con el mismo `personId` (M01 RN-PER-135: ficha del rol única por persona, rol y entidad; DEC-097, DEC-064). Un reingreso en la misma empresa tras el egreso reabre o crea un legajo nuevo según RF-SUE-004. *Reemplazado (10-11-2026, DEC-097): "El legajo es único por empresa empleadora."* | `ExisteEmpleado` (RN-08 §15.6) | Replicar | — | — |
| RN-SUE-002 | Todo empleado está vinculado a una persona de M01; no hay datos personales duplicados en el legajo. `employees.personId` es obligatorio e inmutable salvo por la fusión de personas de M01 (RF-PER-157, que reasigna el `personId`); el alta pasa siempre por el alta asistida con control de duplicados (`per.findOrCreatePerson`, RF-PER-174) y la identidad se lee con `per.getPersonIdentity`, refrescada con `per.person.updated` (EVT-PER-02) y `per.person.merged` (EVT-PER-06). Regla de M01 RN-PER-135 (DEC-097). | Empleado separado de persona; P3081 permite integrar el ABM | Mejorar (DEC-097) | — | — |
| RN-SUE-003 | El acceso del empleado al portal usa la cuenta de T02 (contraseña con hash, 2FA según política). **Nunca** el documento como clave por defecto. | `VerificarEmpleado`: si no hay clave, la clave es el DNI (Defecto) | Reemplazar | — | — |
| RN-SUE-004 | Cambios de categoría, convenio, cargo, área, jornada, modalidad y empresa se registran con fecha efectiva y fecha de registro; el cálculo de un período usa los valores vigentes en ese período. | `SU_EMP_HISCAT_EMP` guarda solo categoría | Mejorar | — | — |
| RN-SUE-005 | Alerta de cambio de categoría cuando los meses transcurridos desde la fecha de categoría (meses de 30 días) superan los meses configurados en el sindicato o convenio. | `GetEmpleados_RequiereCambioCategoria` con `MES_CAT` | Replicar | `SU_SINDICATO.MES_CAT` → `unions.categoryReviewMonths` | — |
| RN-SUE-006 | La distribución por centros de costo suma 100 % y tiene vigencia; sin distribución, se usa el centro de costo del área. | `SU_EMPLEADOS_SEC.POR_ASIGNACION`; P2714 usa secciones en sueldos | Mejorar | PRM-SUE-034 | — |
| RN-SUE-007 | Con varias cuentas de acreditación, la suma de porcentajes es 100 % o hay una cuenta «resto». | P3129, `SU_EMP_CBU.POR_PAG` | Replicar | PRM-SUE-020 | — |
| RN-SUE-008 | La documentación subida por el empleado queda pendiente; al autorizar se registra vencimiento y se mueve a la carpeta autorizada del expediente; al rechazar se conserva el rechazo con motivo y el adjunto se elimina según política de conservación. La transacción confirma **después** de guardar todos los cambios. | `AutorizarDocumentoEmpleado` confirma antes de guardar (Defecto); al rechazar borra adjuntos | Mejorar | — | — |
| RN-SUE-009 | Familiares: los datos de Ganancias (F.572, porcentaje a deducir, estudiante, discapacidad) se guardan por año fiscal; actualizar el año en curso marca el familiar como declarado en F.572. | `ActualizarPorcDeduccion_Familiar`, `SU_EMP_FAMILIARES_EXTRAS` | Replicar | — | — |
| RN-SUE-010 | Desvincular registra motivo y fecha y agrega al empleado los conceptos del modelo de egreso del motivo; reincorporar elimina solo los conceptos que agregó la desvinculación y nunca recibos ni historial. | `Vincular_Empleado` borra **todos** los extras si se elige eliminar la liquidación | Mejorar | — | [VERIFICAR] uso real en LAG |
| RN-SUE-011 | Hasta tres situaciones de revista por mes por empleado, con día de inicio; la primera del mes es obligatoria. | `SU_SIT_REVISTA_EMPLEADO.FECHA_DESDE` | Mejorar (validación LSD) | — | — |
| RN-SUE-012 | Las tablas oficiales (SICOSS, obras sociales, SMVM, topes, Ganancias) son de plataforma; el tenant las adopta y no las edita. Una actualización oficial publica una nueva vigencia, no reescribe la anterior. | Tablas por base; `Importar_Sicoss` reemplaza | Reemplazar | — | — |
| RN-SUE-013 | Un convenio, categoría o escala solo puede usarse en una liquidación si está publicado y su parametrización tiene validación del responsable laboral o contador. | No existe | Mejorar (BASE §104.3) | — | — |
| RN-SUE-014 | El aumento masivo se calcula sobre el básico «puro»: si la escala tenía un porcentaje aplicado, básico puro = importe actual × 100 / porcentaje actual; nuevo = básico puro × (1 + aumento); redondeo a 2 decimales; genera una versión de escala en borrador. | `GetImporteAumento`, `AplicarAumentoSueldo_Sindicato`/`_Extras` (aplican directo) | Mejorar | — | — |
| RN-SUE-015 | Un grupo de extras «único» admite un solo extra por empleado; el grupo indica si deduce en Ganancias. | `SU_EXTRAS_GRUPOS.UNICO`, `DEDUC_GAN` | Replicar | — | — |

### 6.2. Conceptos, variables y fórmulas

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-016 | Tipos de concepto con código estable: remunerativo (1), no remunerativo (10), deducción (30), retención (40), contribución (60), redondeo (70). Haberes = 1 + 10; descuentos = 30 + 40; las contribuciones no afectan el neto. | `clsConceptos.Tipos` (RN-08 §11.2) | Replicar | — | — |
| RN-SUE-017 | Cada concepto tiene vigencia, fórmula de cantidad, importe, base y filtro, orden de cálculo y tipos de liquidación (con «no mostrar» en recibo). Fuera de vigencia o no habilitado para el tipo, no se liquida. | `SU_CONCEPTOS`, `SU_CONCEPTO_TIPO.NOMOSTRAR`, `GetItems` | Replicar | — | — |
| RN-SUE-018 | Conceptos que dan cero no generan renglón salvo «liquidar siempre» con cantidad distinta de cero. | `GetItems` (`clsSueldos.cs:1014-1118`) | Replicar | — | — |
| RN-SUE-019 | Clasificación impositiva del concepto en Ganancias: no afecta, siempre, solo si se cobra en el 75 % de los recibos, 50 %, según porcentaje; y clasificación SICOSS/F.931 (sueldo, adicionales, SAC, horas extra, premios, vacaciones, aportes y contribuciones por subsistema, LRT, zona desfavorable, cuota sindical, Ley 27.430, maternidad y demás de la tabla oficial), F.1357 y subsistemas (SIPA, INSSJyP, OS, FSR, RENATEA/RENATRE, asignaciones familiares, FNE, LRT, regímenes diferenciales y especiales). | `Tipo_Ganancia` (`:24-36`), `ClasificacionSicoss` (`:44-110`), F.1357 (`:112-126`), `Sistema_Afip` (`:139-171`) | Replicar (como tabla oficial, no enum fijo) | — | [VERIFICAR] tabla vigente de ARCA |
| RN-SUE-020 | El nombre de variable o concepto es único; renombrar reemplaza la referencia `[Variables.<anterior>]` / `[Conceptos.<anterior>]` en todas las fórmulas del borrador. | `clsVariables` (`:11-49`), `clsConceptos.ActualizarNombreConcepto` | Replicar | — | — |
| RN-SUE-021 | Las fórmulas se evalúan en orden de cálculo; una referencia a un concepto de orden mayor o circular es error de validación al guardar, no en la liquidación. | Evaluador DevExpress resuelve en orden sin validar ciclos | Mejorar | — | — |
| RN-SUE-022 | Los resultados intermedios en memoria por empleado se invalidan si cambian datos de entrada durante la liquidación; la liquidación toma una **instantánea** de datos al iniciar el cálculo y la guarda en la traza. | Caché por empleado no refleja cambios a mitad (RN-08 §15.6) | Mejorar | — | — |
| RN-SUE-023 | Función `basicoCategoria(categoria, fecha)`: básico vigente de la escala a la fecha. | `Basico_Categoria` (`SU_CATE.IMPORTE`) | Mejorar (con vigencia) | — | — |
| RN-SUE-024 | Función `sac(hasta, tipo)`: 50 % de la mayor remuneración mensual del semestre (enero-junio o julio-diciembre) hasta la fecha, sumando conceptos marcados «afecta SAC»; deducciones de tipo 30/40 marcadas restan; tipo 1 solo remunerativo, 2 solo no remunerativo. | `SAC` (`:1370-1459`) | Replicar | — | — |
| RN-SUE-025 | Funciones de acumulados: total, cantidades o máximo imputado de uno o varios conceptos (o hasta un orden) entre fechas, incluyendo o excluyendo tipos de liquidación; total imputado por tipo de concepto. | `Concepto_TotalImputado`, `Conceptos_TotalImputado`, `Conceptos_TotalCantidades`, `Concepto_MaximoImputado`, `TotalImputado`, `Imputado_Por_TipoConcepto` | Replicar | — | — |
| RN-SUE-026 | Función `recibosLiquidados(desde, hasta, tipo?)`: cantidad de períodos con recibo. | `Recibos_Liquidados` (`:816-912`) | Replicar | — | — |
| RN-SUE-027 | Funciones de novedades: total de un código en el período y total por tipos acumulado desde el inicio del año fiscal según PRM-SUE-001. | `Total_NovedadesPeriodo`, `TotalTipoNovedad` (`:1792-1848, 2148-2228`) | Replicar | PRM-SUE-001 | — |
| RN-SUE-028 | Función `adelantos(hasta)`: saldo de adelantos pagados no descontados (planes de tipo adelanto), no de facturas de compra. | `Adelantos` = saldo de comprobantes de adelanto en compras | Reemplazar (PA-SUE-05) | — | — |
| RN-SUE-029 | Función `facturasAdeudadas(desde, hasta)`: saldo vencido de cuentas de servicio vinculadas al empleado; devuelve 0 si no hay autorización vigente o si la función está desactivada. | `ImporteFacturasAdeudadas` (`SU_EMPLEADOS_SUMSOC`) | Mejorar (A validar PA-SUE-06) | PRM-SUE-040 | [VERIFICAR] si LAG lo usa |
| RN-SUE-030 | Funciones de Ganancias: retención mensual y de liquidación final, deducciones especiales, cónyuge, ganancia no imponible, total de concepto a efectos de Ganancias (3 = 50 %, 4 = porcentaje del concepto, otro = 100 %, con opción de excluir SAC y prorratear), corresponde retener, promedio, inicio del acumulado de deducciones especiales, campo de la calculadora, otras deducciones del último recibo (0 todas, 1 varias, 2 doceava SAC, 3 doceava BAE, 4 especial), deducción especial incrementada y DEIA. | `clsFormulas_Sueldo` (`:140-1368`) | Replicar con tablas versionadas | PRM-SUE-001 | [VERIFICAR] norma vigente |
| RN-SUE-031 | Función `impuestoCedular`: resta al ingreso las novedades marcadas del año; si supera N salarios mínimos × mes aplica la escala de tramos sobre el excedente; escala y N salen de una tabla versionada, desactivada por defecto. | Escala fija de 5 tramos (27 % a 35 %) en código | Mejorar | — | [VERIFICAR] vigencia normativa |
| RN-SUE-032 | Las funciones de fórmula validan cantidad y tipo de argumentos y exponen nombre, descripción y categoría en el editor. | `IsValidOperandCount`, `IsValidOperandType`, `ResultType`, `Name`, `Description`, `Category` | Replicar | — | — |
| RN-SUE-033 | Publicar una versión de configuración exige: validación sintáctica y de dependencias de todas las fórmulas, códigos ARCA y cuentas contables resueltos, simulación del último período con informe de diferencias revisado por un usuario distinto del autor, y fecha efectiva. La publicación es atómica. | No existe | Mejorar (AGR-009) | — | — |
| RN-SUE-034 | Un cambio de etiqueta o de visibilidad en recibo no genera nueva versión de cálculo. | — | Mejorar (AGR-009) | — | — |
| RN-SUE-035 | La IA del editor de fórmulas solo propone; no recibe datos personales ni importes reales de empleados (usa catálogo de nombres y un caso ficticio). | `frmAsistenteFormulas` envía catálogo y dependencias | Mejorar (97.1) | — | — |

### 6.3. Novedades, licencias y vacaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-036 | Novedades por cantidad o importe con cuotas; el tope anual del tipo se valida sumando las novedades del año fiscal. | `GuardarNovedades`, `ValidarTopeAnual_TipoNovedad` | Replicar | — | — |
| RN-SUE-037 | Las novedades importadas (OT, cuadrilla, flota, Excel, fichadas) nacen en borrador con `sourceRef` único; reimportar el mismo origen actualiza la propuesta en borrador y nunca duplica; si ya fue liquidada, genera una novedad de ajuste. | Importaciones directas | Mejorar (AGR-016) | — | — |
| RN-SUE-038 | Solicitud de licencia: se rechaza si hay otra del mismo tipo pendiente o autorizada que se superpone; se guardan adjuntos; se notifica a los encargados por el canal de T09 (no por el campo fax). | `SolicitarLicencia` avisa por SMS al teléfono o fax del encargado | Mejorar | — | — |
| RN-SUE-039 | Autorización: se rechaza si se superpone con otra autorizada o si los días superan los disponibles; genera **una novedad por mes calendario** con los días de ese mes y el tipo de novedad de la causa; si es vacaciones registra el período (año) de goce; mueve adjuntos a la carpeta autorizada; notifica. | `AceptarLicencia` (`:1993-2096`) | Replicar | — | — |
| RN-SUE-040 | Días disponibles de vacaciones = días según antigüedad y convenio − solicitudes pendientes − vacaciones tomadas del período. Para otras causas: días del período de la causa − días pedidos no rechazados; 0 = sin límite. | `CalcularDiasDisponibles` (`:2166-2234`) | Replicar | — | — |
| RN-SUE-041 | Los días hábiles excluyen sábados, domingos **y feriados** (calendario de plataforma más feriados del tenant) y días no laborables del turno. | Solo excluye sábados y domingos | Mejorar | — | — |
| RN-SUE-042 | Días de vacaciones por antigüedad al 31/12 del año: LCT art. 150 (14 días corridos hasta 5 años, 21 de 5 a 10, 28 de 10 a 20, 35 más de 20) o los de la escala del convenio si son mayores; con antigüedad menor a 6 meses o sin haber trabajado la mitad de los días hábiles del año (art. 151), 1 día cada 20 trabajados. | `Get_DiasVacacionesPorCategoria`: 1 cada 20 con ≤ 6 meses; si no, tabla `SU_ANTIGUE` por categoría y luego sindicato; sin categoría toma la primera fila (Defecto) | Mejorar | — | — |
| RN-SUE-043 | Las vacaciones se gozan entre el 1 de octubre y el 30 de abril salvo convenio, se comunican con 45 días de anticipación y se pagan al inicio (art. 154–155). El sistema alerta, no bloquea. | No existe | Mejorar | PRM-SUE-045 | — |
| RN-SUE-044 | Año de control de vacaciones pendientes: solo se arrastran saldos del año configurado en adelante. | P2598 | Replicar | PRM-SUE-013 | — |
| RN-SUE-045 | Licencias especiales LCT art. 158 (nacimiento, matrimonio, fallecimiento, examen) con los días de la tabla; si el convenio da más, prevalece el convenio. Licencia por maternidad (art. 177) con situación de revista de maternidad y sin remuneración a cargo del empleador (asignación de ANSES). | Causas configurables | Mejorar | — | [VERIFICAR] días vigentes por norma y convenio |
| RN-SUE-046 | Enfermedad inculpable (art. 208): plazo pago de 3 meses (antigüedad < 5 años) o 6 meses (≥ 5 años), duplicado con cargas de familia; luego reserva de puesto de 1 año (art. 211). | No existe | Mejorar | — | — |
| RN-SUE-047 | Fichadas: se procesan contra el turno vigente; las manuales quedan marcadas con usuario; una fichada procesada no se reprocesa salvo reapertura. | `SU_HORAS_LECTOR.PROCESADO`, `MANUAL` | Replicar | — | — |
| RN-SUE-048 | Horas extra: recargo 50 % en días comunes y 100 % en sábados después de las 13, domingos y feriados (art. 201 LCT), salvo convenio más favorable; alerta al superar el tope mensual y anual de la tabla oficial. | No existe como regla | Mejorar | — | [VERIFICAR] topes vigentes |
| RN-SUE-049 | Adelantos: no superan el 50 % de la remuneración de un período (art. 130) salvo excepción aprobada; se descuentan en el próximo recibo salvo que el tipo de liquidación esté marcado «no descontar adelantos». | Adelanto como factura de compra al empleado-proveedor; `NO_DESCONTAR_ADELANTO` | Mejorar | PRM-SUE-030, PRM-SUE-031 | — |
| RN-SUE-050 | La retención de Ganancias calculada no se guarda como novedad del mes siguiente; queda en el detalle del recibo. La retención informada manual (antes novedad tipo 27) sustituye el cálculo con motivo y aprobación. | `GenerarNovedad` deja la retención como novedad del mes siguiente; en diciembre queda en enero del mismo año y el control busca mes 13 (Defecto); P2611 ≠ 0 pisa el concepto | Mejorar | PRM-SUE-001 | — |
| RN-SUE-051 | Remuneraciones de otros empleos importadas se cargan como novedad «otros empleos»; las de cajas previsionales provinciales con su tipo propio configurable (no por nombre fijo); se omiten las ya existentes para esa fecha y empleador. | `Cargar_Ganancias`: Caja de Jubilaciones de Córdoba fija en código → tipo 11 | Mejorar | — | — |
| RN-SUE-052 | SIRADIG: con PRM-SUE-012 activo, las novedades de diciembre se cargan con fecha de noviembre cuando las escalas están corridas. | P2763, `Cargar_Novedades` (`:1196`) | Replicar | PRM-SUE-012 | [VERIFICAR] si sigue siendo necesario con la norma vigente |

### 6.4. Liquidación, SAC, egreso

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-053 | Un recibo por empleado, período, tipo de liquidación y empresa; complementarias y rectificativas se vinculan al original. | `ExisteRecibo_byLegajoEmpleado`/`_byCodigoEmpleado` | Replicar | — | — |
| RN-SUE-054 | La liquidación graba todos los recibos del lote de forma atómica por empleado y registra progreso del lote (reanudable); un fallo en un empleado no invalida a los demás y queda marcado con error. | `GenerarRecibo` en una única transacción para todo el lote | Mejorar | — | — |
| RN-SUE-055 | Neto = haberes (remunerativos + no remunerativos) − deducciones − retenciones; redondeo según concepto configurado (al entero superior por defecto ProCoop); con PRM-SUE-018 el redondeo se clasifica no remunerativo. | `GetItems` (`:1095-1109`), P3016 | Replicar | PRM-SUE-018 | — |
| RN-SUE-056 | Plazo de pago: mensual dentro del 4.º día hábil del mes siguiente; quincenal y semanal dentro de los 3 días hábiles (art. 128); el sistema alerta si la fecha de pago lo excede. | No existe | Mejorar | — | — |
| RN-SUE-057 | SAC: cuotas con vencimiento 30 de junio y 18 de diciembre (con plazo de pago de 4 días hábiles); base = 50 % de la mayor remuneración mensual devengada en el semestre; proporcional = base × días trabajados / días del semestre. | Función `SAC` | Replicar + calendario | — | — |
| RN-SUE-058 | Vacaciones: valor día del mensualizado = remuneración ÷ 25; del jornalizado, el jornal; conceptos variables por promedio del semestre o año según convenio. | Por fórmula | Replicar (como fórmula de plantilla) | — | — |
| RN-SUE-059 | Liquidación final por despido sin causa: preaviso (art. 231: 15 días en período de prueba, 1 mes con antigüedad < 5 años, 2 meses ≥ 5 años) con SAC sobre preaviso; integración del mes de despido (art. 233) salvo que el despido sea el último día del mes; indemnización art. 245 = mejor remuneración mensual, normal y habitual del último año × años de servicio o fracción mayor a 3 meses, con tope de 3 veces el promedio del convenio y piso según jurisprudencia configurable; vacaciones no gozadas proporcionales (art. 156) con su SAC; SAC proporcional. Otros motivos aplican su modelo (art. 247: 50 %; art. 248: 50 % del art. 245; renuncia: solo proporcionales). | `SU_DESVICULACION` + `SU_DESVIC_EXTRAS` (importes por motivo) | Mejorar (plantillas de cálculo validadas por el responsable) | — | [VERIFICAR] cambios de la Ley 27.742 (período de prueba, fondo de cese) y topes de convenio vigentes |
| RN-SUE-060 | Conceptos indemnizatorios exentos de aportes y de Ganancias según la tabla oficial; no integran la base del SAC. | Clasificación del concepto | Replicar | — | — |
| RN-SUE-061 | Una liquidación aprobada no se edita; se corrige con complementaria (diferencias) o rectificativa (reemplazo). Nada se borra: los recibos anulados quedan con estado y motivo. | `EliminacionMasiva_Recibos` borra sin controlar pago ni firma (Defecto) | Reemplazar | — | — |
| RN-SUE-062 | Embargabilidad: hasta 1 SMVM inembargable; entre 1 y 2 SMVM, 10 % de la remuneración neta de aportes; más de 2 SMVM, 20 % (Decreto 484/87); cuotas alimentarias y litis expensas sin esa limitación, según oficio. Prelación por fecha de notificación. | No existe como regla | Mejorar | — | [VERIFICAR] escala vigente |
| RN-SUE-063 | Deducciones voluntarias (art. 132) no superan el 20 % del total de la remuneración del período (art. 133), excluidas retenciones legales y judiciales. | No existe | Mejorar | — | — |
| RN-SUE-064 | Control de mínimos: la remuneración de jornada completa no es inferior al básico de convenio de la categoría ni al SMVM (proporcional en jornada parcial); advertencia que exige justificación. | No existe | Mejorar | — | — |
| RN-SUE-065 | Una liquidación solo se aprueba si: no hay novedades en borrador del universo, todos los empleados tienen cuenta de acreditación o medio alternativo, todos los conceptos tienen cuenta contable resuelta y código ARCA, el período está abierto. | No existe | Mejorar | — | — |
| RN-SUE-066 | Separación de funciones: quien calcula no aprueba; quien aprueba no ejecuta el pago; nadie aprueba ni recalcula su propio recibo (se deriva a otro aprobador). | Permisos por pantalla | Mejorar (SUE-013, AGR-008) | — | — |
| RN-SUE-067 | Anular una liquidación aprobada no pagada revierte asiento, saldos de planes de descuento y vacaciones liquidadas; pagada, solo por rectificativa. | `AnularPago` solo borra fecha e identificador de pago | Mejorar | — | — |
| RN-SUE-068 | Reapertura de un período cerrado requiere aprobación y motivo; se audita; un período con LSD presentado no se reabre: se usa rectificativa. | P2376 fecha de cierre única | Reemplazar | — | — |

### 6.5. Ganancias y seguridad social

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-069 | No puede haber dos tramos solapados de escala de Ganancias del mismo tipo, año y mes, ni dos tramos de deducciones del mismo tipo, año y mes. La carga anual genera los meses con importes acumulados (anual ÷ 12 × mes). | `clsTramas.Validar_Importe`, `ValidDeduccion`, `CrearDeduccionAnual` (borra solapados) | Replicar (en plataforma, sin borrar: nueva vigencia) | — | — |
| RN-SUE-070 | Inicio del acumulado de Ganancias: 1 de enero, o diciembre del año anterior / febrero según PRM-SUE-001; si la tabla define un mes desde para la remuneración bruta, se usa ese mes. | `FechaDesde_DedEsp`, P2611 | Replicar | PRM-SUE-001 | [VERIFICAR] P2611 = 1 febrero |
| RN-SUE-071 | Procede la retención si la remuneración bruta (promedio de los meses con recibo, sumando otros empleos, con prorrateo por doceavas de los recibos «prorratear») supera el mínimo de la tabla vigente; el criterio (base de un mes de referencia, promedio mensual o semestral) es atributo de la tabla. | `CorrespondeAplicarGanancias` usa agosto del año anterior; `CorrespondeAplicarGanancias2` promedios desde julio 2023 | Mejorar (criterio en tabla) | — | [VERIFICAR] norma vigente |
| RN-SUE-072 | Cálculo acumulativo: retención del mes = impuesto determinado sobre la ganancia neta acumulada a la fecha − retenciones acumuladas; si es negativo, devolución. | `GetCalculoGanancias` | Replicar | — | — |
| RN-SUE-073 | La deducción por hijos considera el porcentaje informado en F.572 y la condición (menor, incapacitado) por año. | `GetDeduccionesPorHijos` | Replicar | — | — |
| RN-SUE-074 | Liquidación anual al cierre del período fiscal o al egreso; formulario informativo para el empleado y archivo para ARCA con CUIT de la empresa empleadora (no un CUIT único del tenant). | F.1359 con CUIT P519 | Mejorar (multiempleador) | — | [VERIFICAR] formulario vigente (F.1357/F.1359) |
| RN-SUE-075 | Base imponible de aportes y contribuciones topeada con el máximo vigente (distinto en meses con SAC: junio y diciembre) y con mínimo; ambos de tabla oficial. | P2437 (meses SAC) y P2438 (resto) por tenant | Reemplazar (tabla oficial) | — | — |
| RN-SUE-076 | El archivo SICOSS toma los importes por clasificación SICOSS de cada concepto y los datos del empleado del período (situaciones de revista, obra social, adherentes, zona, condición, actividad, siniestrado, tipo de empresa). | `ExportarArchivoSicoss` (`:747-821`) | Replicar | — | — |
| RN-SUE-077 | LSD: registros 01 (datos de referencia), 02 (datos del trabajador por liquidación), 03 (conceptos), 04 (datos para cálculo de la DJ F.931) y 05 (otros) según el diseño vigente; con PRM-SUE-019 se topea la base de vacaciones proporcionales. | `LibroSueldoDigital.Get_Registro_Tipo1` a `Tipo5`, P3065 | Replicar | PRM-SUE-019 | [VERIFICAR] diseño de registro vigente |
| RN-SUE-078 | SICORE de sueldos informa las retenciones de Ganancias del mes por empleado con régimen e impuesto de la tabla oficial; sujetos retenidos con CUIL. | `PercepcionSICORE.Exportar_Sueldos`, `Get_SujetosSueldo` | Replicar | — | [VERIFICAR] régimen vigente |
| RN-SUE-079 | Archivo regional de Luz y Fuerza: exige CUIL de 11 dígitos; por empleado informa remunerativo, no remunerativo sin anticipos, SAC, horas extra y aporte; aporte sindical = (remunerativo − conceptos excluidos − SAC) × porcentaje promedio de los conceptos de cuota sindical. Las exclusiones de tipos de recibo se configuran en el layout, no por sigla del cliente. | `ExportarArchivoRegionalLuzYFuerza`; con sigla P2264 = «DEAN» excluye tipo de recibo 15 | Mejorar | — | [VERIFICAR] formato vigente del sindicato |
| RN-SUE-080 | El sistema calcula aportes y contribuciones para el asiento y el control; la presentación del F.931 se hace en ARCA con el archivo generado y el acuse se carga en el sistema. | No calcula F.931; solo genera TXT | Mejorar (A validar PA-SUE-02) | — | — |

### 6.6. Recibos, firma, pago, contabilización e importación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SUE-081 | No se envían a firma recibos con estado de firma distinto de «sin firmar»/«rechazado por error técnico» ni los que ya están en un lote de firma abierto. | `ExcluirRecibosFirmados`, `VerificarRecibosEnLote` | Replicar | — | — |
| RN-SUE-082 | El portal muestra recibos firmados por el empleador; con PRM-SUE-016 también los no firmados digitalmente. | P2886, `GetRecibosFirmados` | Replicar | PRM-SUE-016 | — |
| RN-SUE-083 | Se puede notificar al empleado un recibo pendiente de firma; recordatorios cada N días hasta la firma o la no conformidad. | P3107 | Replicar | PRM-SUE-024 | — |
| RN-SUE-084 | La no conformidad del empleado registra observación y deja el recibo «firmado en disconformidad»; no impide el pago. | `SU_NOTIFICACIONES.OBSERVA_NOCONFORM` | Replicar | — | — |
| RN-SUE-085 | Pago: la solicitud a M14 lleva un renglón por empleado y cuenta; el empleado **no** se da de alta como proveedor; los adelantos ya pagados se descuentan en el recibo, no en la orden de pago. | `GenerarPago` crea una factura de compra al empleado-proveedor por el neto, suma adelantos pendientes y genera OP | Reemplazar (A validar PA-SUE-05) | — | — |
| RN-SUE-086 | Con PRM-SUE-008 la fecha de transferencia del pago es modificable; con PRM-SUE-009 se pide la fecha de pago si no existe. | P2288, P2484 | Replicar | PRM-SUE-008, PRM-SUE-009 | — |
| RN-SUE-087 | Resolución de cuentas contables de sueldos: regla personalizada con más coincidencias de filtros → cuenta del concepto → cuenta de la empresa (contribuciones o general) → cuenta del sindicato (general o cargas) → error «cuenta sin asignar» listado antes de aprobar. | `Sueldos_GetCuentaPersonalizado`, `Sueldos_GetCuentaConcepto`, `Sueldos_GetCuentaEmpresa`, `Sueldos_GetCuentaGralSindicato`, `Sueldos_GetCuentaCargasSindicato` | Replicar (validación previa) | — | — |
| RN-SUE-088 | El asiento de sueldos se genera en línea al aprobar la liquidación (evento), con vínculo liquidación ↔ asiento y reversión automática al anular; formato resumido por cuenta, por centro de costo o detallado por empleado. | `GenerarAsientosSueldos` en el cierre automático por rango, formatos 1, 2, 3 (P2207) | Reemplazar | PRM-SUE-002 | — |
| RN-SUE-089 | La distribución por centros de costo usa los decimales de M15 y ajusta la diferencia de redondeo en el centro de mayor porcentaje. | P2978 decimales de distribución | Replicar | — | — |
| RN-SUE-090 | Una liquidación externa se identifica por empresa + período + tipo + referencia y por hash del archivo; duplicado o total no coincidente detiene la importación. | No existe (CU-28) | Nueva | — | — |
| RN-SUE-091 | Para una empresa y período, liquidación propia e importada son mutuamente excluyentes. | No existe | Nueva | — | — |
| RN-SUE-092 | Los informes de compras y previsiones de pago no muestran pagos de haberes ni datos de empleados a usuarios sin `sue.remuneraciones.ver`. | P2653 oculta proveedores empleados salvo permiso `frm_Su_Sueldo`; P2709 no incluye datos de empleados | Reemplazar (permiso) | — | — |
| RN-SUE-093 | Los datos sensibles (salud, embargos, sanciones, juicios, discapacidad) no se exponen en BI general, APIs para terceros, muro, bot ni IA. | No existe | Mejorar (97.1) | — | — |
| RN-SUE-094 | Suspensiones disciplinarias: no más de 30 días en un año desde la primera (art. 220 LCT); notificación escrita con causa; generan situación de revista de suspensión y novedad sin goce. | No existe | Nueva | — | — |
| RN-SUE-095 | Tareas extra: total = cantidad × unitario; se generan como novedad del ejecutor en el período de la tarea. | `SU_TAREAS_EXTRAS_EMPLEADOS` | Replicar | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


**Campos comunes** (no se repiten en cada tabla): `_id` uniqueidentifier, `TenantId` uniqueidentifier obligatorio, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista). Los documentos con vigencia llevan `validFrom`/`validTo` (fecha efectiva) y `recordedAt` (fecha de registro, AGR-010). Los maestros usan `status` (`active`, `inactive`) y `deletedAt` para borrado lógico; **los documentos económicos (recibos, liquidaciones, solicitudes de pago, presentaciones) nunca se borran**. Importes en `DECIMAL(18,4)` con `currency` (`ARS`). Todos los índices empiezan por `TenantId`. Los campos marcados **(S)** son sensibles: cifrado a nivel de campo y lectura solo con `sue.datosSensibles.ver` (RN-SUE-093).

> **Corrección 05-11-2026 (tablas de campos):** las colecciones que este §7 describía solo en texto corrido o en tablas resumen tienen ahora su tabla de campos (Campo, Tipo, Oblig., Descripción, Referencia), debajo de su descripción original, que se conserva. Tipos y obligatoriedad se deducen del texto del anexo y de T05 §7.7; donde no se pueden deducir figura `[VERIFICAR]`. La columna Referencia declara la colección destino y su anexo dueño. Cuando T05 usa otro nombre para el campo, la tabla usa el de T05 y anota "Antes `x`". Las tablas de campos que ya existían incorporan también la columna Referencia.

### 7.1. `employers` — Empresas empleadoras

> **Reemplazado por `legalEntities.employer` (T04 COL-CFG-41, RF-CFG-139; CTR-DAT-06, DEC-064).** La tabla siguiente queda como esquema del subdocumento `employer`, que M16 define y edita por API-CFG-55 (`PATCH /legal-entities/:id/employer`). `code`, `legalName`, `cuit`, `fiscalAddress` y `status` se leen de la entidad jurídica (`legalEntities.code`, `.legalName`, `.fiscal.cuit`, `.address`, `.status`); `personId` no se usa.

Origen: `SU_EMPRESAS`, `SU_TIPOEMPLEADOR` (tabla oficial), P518/P519.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | Código interno único en el tenant. | — |
| `legalName` | string | Sí | Razón social. | — |
| `cuit` | string(11) | Sí | CUIT con dígito verificador validado; único en el tenant. | — |
| `personId` | uniqueidentifier | No | Persona jurídica en M01, si existe. | `persons` (M01) |
| `fiscalAddress`, `workplaceAddresses[]` | objeto domicilio (M01) | Sí / No | Domicilio fiscal y de explotación (calle, número, piso, depto, barrio, localidad, provincia, código postal). | — |
| `employerTypeCode` | string | Sí | Código oficial de tipo de empleador. | — |
| `mainActivityCode` | string | Sí | Actividad principal (CLAE/SICOSS). | — |
| `zoneCode` | string | No | Zona por defecto. | — |
| `contributionRegime` | enum `general`, `reducedRate`, `special` | Sí | Régimen de contribuciones; selecciona la fila de la tabla oficial. | — |
| `workRiskInsurance` | `{ insurerCode, contractNumber, fixedAmount, variableRate, validFrom, validTo }` | Sí | ART contratada. | — |
| `lifeInsurance` | `{ insurerName, policyNumber, amountPerEmployee }` | Sí | Seguro de vida obligatorio. | — |
| `incomeTaxAgent` | boolean | Sí | Actúa como agente de retención de Ganancias. | — |
| `payslipVoucherTypeId`, `payslipNumbering` | uniqueidentifier / `{ prefix, next }` | Sí | Comprobante y numeración de recibos (P2751). | `voucherTypes` (M05) [VERIFICAR] |
| `payslipSigner` | `{ userId, position, signatureProfileCode }` | No | Responsable de firma del empleador; debe estar habilitado como firmante en el perfil de T11 (PAN-WFL-19). | — |
| `bankAgreements[]` | `{ bankCode, treasuryAccountId, originCbu, companyIdAtBank, agreementCode, useEmployeeAccount, layoutId }` | No | Convenios de pago (PRM-SUE-003 a 027). | — |
| `lsdSettings` | `{ enabled, referenceData }` | No | Datos del registro 01 del LSD. | — |
| `status` | enum | Sí | `active`, `inactive`. | — |

Índices: `{tenantId, code}` único; `{tenantId, cuit}` único (los aplica `legalEntities` en T04: `{tenantId, code}` y `{tenantId, 'fiscal.cuit'}`).

### 7.2. `employees` — Legajos

Origen: `SU_EMPLEADOS` (57 columnas), `SU_EMPLEADOS_SUMSOC` (en `serviceAccountLinks`), P3081.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Persona M01 (nombre, documento, CUIL, nacimiento, sexo, nacionalidad, estado civil, domicilio, contacto). Sigue RN-PER-135 de M01 (DEC-097): se obtiene del alta asistida (`per.findOrCreatePerson`, RF-PER-174), la identidad se lee con `per.getPersonIdentity` y solo cambia por fusión de personas en M01 (RN-SUE-002). | `persons` (M01) |
| `legalEntityId` | uniqueidentifier → `legalEntities` (T04) | Sí | Empresa empleadora: entidad jurídica con subdocumento `employer` (reemplaza `employerId`; CTR-DAT-06, DEC-064). | `legalEntities` (T04) |
| `fileNumber` | string | Sí | Legajo; único por empresa (RN-SUE-001). | — |
| `cuil` | string(11) | Sí | Copia validada del CUIL de la persona para presentaciones. | — |
| `hireDate` | date | Sí | Fecha de ingreso. | — |
| `seniorityDate` | date | Sí | Fecha de antigüedad reconocida. | — |
| `probationEndDate` | date | No | Fin del período de prueba. | — |
| `contractEndDate` | date | No | Fin de contrato a plazo. | — |
| `terminationDate`, `terminationId` | date / uniqueidentifier | No | Egreso. | `terminations` (M16) |
| `status` | enum `preHire`, `active`, `onLeave`, `suspended`, `terminated` | Sí | Estado del legajo (§8.1). | — |
| `current` | objeto | Sí | Proyección de la asignación vigente (§7.3): `laborAgreementId`, `unionId`, `unionMember`, `categoryId`, `positionId`, `workAreaId`, `workplace`, `workdayType`, `weeklyHours`, `contractModeCode`, `conditionCode`, `activityCode`, `zoneCode`, `payFrequency` (`monthly`, `biweekly`, `daily`, `hourly`), `outOfAgreementBasic` DECIMAL(18,4). | — |
| `socialSecurity` | `{ healthInsurerCode, healthPlan, dependentsCount, pensionRegime, reducedContributionBenefitCode, workAccidentCode }` | Sí | Obra social, adherentes, régimen previsional, beneficio SICOSS, siniestrado. | — |
| `incomeTax` | `{ designatedAgent: boolean, otherEmployments: boolean, exempt: boolean, exemptReason }` | Sí | Ganancias. | — |
| `registration` | `{ altaNumber, altaDate, bajaNumber, bajaDate }` | No | Simplificación registral (RF-SUE-124). | — |
| `serviceAccountLinks[]` | `{ accountId, authorizationDocumentId, authorizedAt }` | No | Cuentas de servicio (RF-SUE-014). | — |
| `userAccountId` | uniqueidentifier | No | Cuenta T02 vinculada al perfil empleado. | `memberships` (T02) |
| `disability` **(S)** | `{ hasCud, validTo }` | No | Discapacidad (beneficios y cuota). | — |

Índices: `{tenantId, legalEntityId, fileNumber}` único; `{tenantId, personId, legalEntityId}` único parcial para legajos no egresados (RN-SUE-001, M01 RN-PER-135; DEC-097; antes no único); `{tenantId, status}`; `{tenantId, "current.workAreaId"}`.

### 7.3. `employeeAssignments` — Historial laboral

Origen: `SU_EMP_HISCAT_EMP` (ampliado). Un documento por cambio con vigencia. Campos: `employeeId` (Sí), `validFrom` (Sí), `validTo`, `recordedAt` (Sí), los mismos campos que `employees.current`, `reason` enum (`hire`, `promotion`, `seniority`, `agreementChange`, `correction`, `transfer`), `previousCategoryId`, `approvalId` (T11), `notes`. Índices: `{tenantId, employeeId, validFrom}` único. Migración: `COD_CAT_ANT`, `DES_CAT_ANT`, `COD_CAT_NEW`, `DES_CAT_NEW`, `FEC_CAT_ANT`, `FEC_CAT_NEW`, `FEC_REG`, `USU_REG`.

Campos de `employeeAssignments`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | Sí. | `employees` (M16) |
| `validFrom` | Date | Sí | Sí. | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `recordedAt` | Date (fecha y hora) | Cond. | Sí, los mismos campos que `employees.current`. | — |
| `reason` | Enum | [VERIFICAR] | (`hire`, `promotion`, `seniority`, `agreementChange`, `correction`, `transfer`). | — |
| `previousCategoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `approvalId` | uniqueidentifier | [VERIFICAR] | T11. | `approvalRequests` (T11) |
| `notes` | String | [VERIFICAR] | — | — |

### 7.4. `employeeCostAllocations` — Distribución por centros de costo

Origen: `SU_EMPLEADOS_SEC`. Campos: `employeeId`, `validFrom`, `validTo`, `allocations[]` `{ costCenterId (M15), serviceId (M02, opcional), percent DECIMAL(18,4) }` (suma 100), `recordedAt`. Índice `{tenantId, employeeId, validFrom}` único.

Campos de `employeeCostAllocations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `allocations` | [Object] | No | `{ costCenterId (M15), serviceId (M02, opcional), percent DECIMAL(18,4) }` (suma 100). | — |
| `costCenterId` | uniqueidentifier | — | Clave de T05: es `allocations[].costCenterId`, no un campo de primer nivel (PA-SUE-18). | `costCenters` (M15) |
| `recordedAt` | Date (fecha y hora) | Cond. | — | — |

### 7.5. `employeeFamilyMembers` — Familiares a cargo

Origen: `SU_EMP_FAMILIARES`, `SU_EMP_FAMILIARES_EXTRAS`. Campos: `employeeId` (Sí), `personId` (Sí, M01), `relationship` enum (`spouse`, `cohabitant`, `child`, `stepchild`, `childUnderGuardianship`, `parent`, `sibling`, `grandchild`, `other`), `birthDate`, `dependentFrom`, `dependentTo`, `healthInsuranceDependent` boolean, `yearly[]` `{ fiscalYear, student, disability (S), declaredInF572, deductionPercent, monthFrom, monthTo }`. Índice `{tenantId, employeeId, personId}` único. Migración: `TIP_REL`, `ESTUDIANTE`, `DISCAPACITADO`, `ADHERENTE`, `FORM_572`, `PORC_DEDUCIR`, `AÑO`.

Campos de `employeeFamilyMembers`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | Sí. | `employees` (M16) |
| `personId` | uniqueidentifier | Sí | Sí, M01. | `persons` (M01) |
| `relationship` | Enum | [VERIFICAR] | (`spouse`, `cohabitant`, `child`, `stepchild`, `childUnderGuardianship`, `parent`, `sibling`, `grandchild`, `other`). | — |
| `birthDate` | Date | [VERIFICAR] | — | — |
| `dependentFrom` | Date | [VERIFICAR] | — | — |
| `dependentTo` | Date | [VERIFICAR] | — | — |
| `healthInsuranceDependent` | Bool | [VERIFICAR] | Boolean. | — |
| `yearly` | [Object] | [VERIFICAR] | `{ fiscalYear, student, disability (S), declaredInF572, deductionPercent, monthFrom, monthTo }`. | — |

### 7.6. `employeePayAccounts` — Cuentas de acreditación

Origen: `SU_EMP_CBU`. Campos: `employeeId`, `bankCode`, `branchCode`, `accountType` (`savings`, `checking`, `cvu`), `accountNumber`, `cbu` (22 dígitos validados), `holderName`, `isPayrollAccount` (Ley 26.590), `originBankCode` (BANCO_ORIGEN), `splitPercent` DECIMAL(18,4) o `splitAmount`, `isRemainder` boolean, `priority`, `validFrom`, `validTo`, `status`, `cbuHmac` (HMAC del CBU cifrado, para unicidad y búsqueda). Índice `{tenantId, employeeId, cbuHmac}` único (antes `{tenantId, employeeId, cbu}`; clave de T05 COL-SUE-06, PA-DAT-04).

Campos de `employeePayAccounts`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `bankCode` | String | [VERIFICAR] | — | — |
| `branchCode` | String | [VERIFICAR] | — | — |
| `accountType` | Enum | [VERIFICAR] | `savings`, `checking`, `cvu`. | — |
| `accountNumber` | Int | [VERIFICAR] | — | — |
| `cbu` | String | [VERIFICAR] | 22 dígitos validados. | — |
| `cbuHmac` | String | Sí | HMAC del CBU (el CBU se guarda cifrado); clave de unicidad `{employeeId, cbuHmac}` de T05 COL-SUE-06 (PA-DAT-04). No es referencia. | — |
| `holderName` | String | [VERIFICAR] | — | — |
| `isPayrollAccount` | Bool | [VERIFICAR] | Ley 26.590. | — |
| `originBankCode` | String | [VERIFICAR] | BANCO_ORIGEN. | — |
| `splitPercent` | DECIMAL(18,4) | [VERIFICAR] | O `splitAmount`. | — |
| `isRemainder` | Bool | [VERIFICAR] | Boolean. | — |
| `priority` | Int | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.7. `employeeDocuments` — Documentación laboral

Origen: `SU_EMPLEADOS_DOCUMENTOS`, `PTRAMITES` (trámite del empleado). Campos: `employeeId`, `documentTypeCode` (catálogo del tenant: DNI, CUIL, título, licencia de conducir, apto médico (S), certificado de antecedentes, constancia de CBU, alta temprana, contrato, otros), `fileRefs[]` (almacenamiento privado), `uploadedBy` (`employee` | `staff`), `registeredAt`, `expiresAt`, `status` (`pending`, `authorized`, `rejected`, `expired`), `reviewedBy`, `reviewedAt`, `rejectionReason`, `sensitive` boolean. Índice `{tenantId, employeeId, documentTypeCode, status}`.

Campos de `employeeDocuments`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `documentTypeCode` | String | [VERIFICAR] | Catálogo del tenant: DNI, CUIL, título, licencia de conducir, apto médico (S), certificado de antecedentes, constancia de CBU, alta temprana, contrato, otros. | — |
| `fileRefs` | [uniqueidentifier] | [VERIFICAR] | Almacenamiento privado. | `storedFiles` (T01) |
| `documentRefId` | uniqueidentifier | [VERIFICAR] | Expediente del documento en T11 (clave de T05; PA-SUE-18). | `documents` (T11) |
| `uploadedBy` | uniqueidentifier | Cond. | `employee` \| `staff`. | `memberships` (T02) |
| `registeredAt` | Date (fecha y hora) | Cond. | — | — |
| `expiresAt` | Date (fecha y hora) | Cond. | — | — |
| `status` | Enum | Sí | `pending`, `authorized`, `rejected`, `expired`. | — |
| `reviewedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `reviewedAt` | Date (fecha y hora) | Cond. | — | — |
| `rejectionReason` | String | [VERIFICAR] | — | — |
| `sensitive` | Bool | [VERIFICAR] | Boolean. | — |

### 7.8. `employeeNotes` — Observaciones

Origen: `SU_EMP_OBS`. Campos: `employeeId`, `date`, `text`, `category` (`general`, `sensitive`), `authorId`. Índice `{tenantId, employeeId, date}`.

Campos de `employeeNotes`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `date` | Date | [VERIFICAR] | — | — |
| `text` | String | [VERIFICAR] | — | — |
| `category` | Enum | [VERIFICAR] | `general`, `sensitive`. | — |
| `authorId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |

### 7.9. `supervisionLinks` — Encargado y operarios

Origen: `SU_EMP_OPER`. Campos: `supervisorEmployeeId`, `employeeId`, `scope[]` (`leaves`, `novelties`, `evaluations`), `validFrom`, `validTo`. Índice `{tenantId, supervisorEmployeeId, employeeId, validFrom}` único.

Campos de `supervisionLinks`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supervisorEmployeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `scope` | [Enum] | [VERIFICAR] | `leaves`, `novelties`, `evaluations`. | — |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |

### 7.10. `shifts` y `employeeShiftAssignments` — Turnos

Origen: `SU_TURNOS`, `SU_TURNOSIT`, `SU_EMP_TURNOS`. `shifts`: `code`, `name`, `notes`, `items[]` `{ dayFrom (1-7), dayTo, timeFrom, timeTo, crossesMidnight }`, `weeklyHours`, `status`. `employeeShiftAssignments`: `employeeId`, `shiftId`, `validFrom`, `validTo`. Índice `{tenantId, employeeId, validFrom}`; no se admiten superposiciones (validación).

Campos de `shifts`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `notes` | String | [VERIFICAR] | — | — |
| `items` | [Object] | [VERIFICAR] | `{ dayFrom (1-7), dayTo, timeFrom, timeTo, crossesMidnight }`. | — |
| `weeklyHours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `inactive` (convención de maestros del §7; §8.12.11; antes sin valores, PA-SUE-18). | — |

**`employeeShiftAssignments`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `shiftId` | uniqueidentifier | Sí | — | `shifts` (M16) |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |

### 7.11. `employmentStatusPeriods` — Situación de revista

Origen: `SU_SIT_REVISTA_EMPLEADO`, `SU_SITUACION_REVISTA` (tabla oficial). Campos: `employeeId`, `statusCode` (oficial), `validFrom` (día de inicio), `validTo`, `source` (`manual`, `leave`, `accident`, `suspension`, `hire`, `termination`), `sourceRef`. Índice `{tenantId, employeeId, validFrom}` único.

Campos de `employmentStatusPeriods`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `statusCode` | String | [VERIFICAR] | Oficial. | — |
| `validFrom` | Date | Sí | Día de inicio. | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `source` | Enum | [VERIFICAR] | `manual`, `leave`, `accident`, `suspension`, `hire`, `termination`. | — |
| `sourceRef` | uniqueidentifier | [VERIFICAR] | — | Polimórfica según `source`: `leaveRequests` (M16), `workAccidents` (M16), `disciplinaryActions` (M16) o `terminations` (M16); `manual` y `hire` sin referencia (antes `[VERIFICAR]`) |

### 7.12. `extraGroups`, `extraItems`, `employeeExtras` — Extras y adicionales

Origen: `SU_EXTRAS_GRUPOS` (`DES_GRUPO`, `UNICO`, `DEDUC_GAN`), `SU_EXTRAS` (`DES_EXTRA`, `COD_GRUPO`, `IMP_EXTRA`), `SU_EMP_EXTRAS` (`COD_EMP`, `COD_EXTRA`, `IMP_EXTRA`). `extraGroups`: `name`, `unique`, `deductibleForIncomeTax`. `extraItems`: `name`, `groupId`, `defaultAmount`, `conceptId`, `validFrom`. `employeeExtras`: `employeeId`, `extraItemId`, `amount`, `validFrom`, `validTo`, `origin` (`manual`, `termination`, `increase`), `terminationId`. Índice `{tenantId, employeeId, extraItemId, validFrom}`.

Campos de `extraGroups`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `unique` | Bool | [VERIFICAR] | — | — |
| `deductibleForIncomeTax` | Bool | [VERIFICAR] | — | — |

**`extraItems`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `groupId` | uniqueidentifier | [VERIFICAR] | — | `extraGroups` (M16) |
| `defaultAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `validFrom` | Date | [VERIFICAR] | — | — |

**`employeeExtras`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `extraItemId` | uniqueidentifier | Sí | — | `extraItems` (M16) |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `origin` | Object | [VERIFICAR] | `manual`, `termination`, `increase`. | — |
| `terminationId` | uniqueidentifier | [VERIFICAR] | — | `terminations` (M16) |

### 7.13. `deductionPlans` — Embargos, cuotas alimentarias, préstamos y adelantos

Origen: novedades de embargo/préstamo/anticipo en `SU_EMP_NOVEDADES` (`ID_ANTICIPO`, `NRO_CUO`, `ID_IVACOM`). Campos: `employeeId`, `type` (`garnishment`, `alimony`, `loan`, `advance`, `unionLoan`, `other`), `legal` **(S)** `{ court, caseNumber, caseTitle, notifiedAt, officeDocumentId }`, `beneficiary` `{ name, cuit, depositAccount (CBU judicial) }`, `calculation` (`legalScale`, `percent`, `fixedAmount`, `installments`), `percent`, `installmentAmount`, `totalAmount`, `balance` DECIMAL(18,4), `installmentsTotal`, `installmentsPaid`, `priority` (fecha de notificación), `startPeriod`, `status` (`active`, `suspended`, `completed`, `cancelled`), `treasuryPaymentRef` (adelanto pagado por M14), `movements[]` `{ payslipId, amount, at }`. Índice `{tenantId, employeeId, status}`.

Campos de `deductionPlans`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `type` | Enum | [VERIFICAR] | `garnishment`, `alimony`, `loan`, `advance`, `unionLoan`, `other`. | — |
| `legal` | Object | [VERIFICAR] | **(S)** `{ court, caseNumber, caseTitle, notifiedAt, officeDocumentId }`. | — |
| `beneficiary` | Object | [VERIFICAR] | `{ name, cuit, depositAccount (CBU judicial) }`. | — |
| `calculation` | Enum | [VERIFICAR] | `legalScale`, `percent`, `fixedAmount`, `installments`. | — |
| `percent` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `installmentAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `totalAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `balance` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `installmentsTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `installmentsPaid` | Int | [VERIFICAR] | — | — |
| `priority` | Int | [VERIFICAR] | Fecha de notificación. | — |
| `startPeriod` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `suspended`, `completed`, `cancelled`. | — |
| `treasuryPaymentRef` | uniqueidentifier | [VERIFICAR] | Adelanto pagado por M14. | `treasuryMovements` (M14) [VERIFICAR] |
| `movements` | [Object] | [VERIFICAR] | `{ payslipId, amount, at }`. | — |

### 7.14. `unions` — Sindicatos

Origen: `SU_SINDICATO`. Campos: `name`, `cuit`, `retentionPercent`, `retentionAmount`, `employerContributionPercent`, `employerContributionAmount`, `categoryReviewMonths` (`MES_CAT`), `generalAccountId`, `chargesAccountId` (M15), `depositInfo`, `fileLayoutId`, `validFrom` (porcentajes versionados en `rates[]` `{ validFrom, retentionPercent, retentionAmount, employerContributionPercent, employerContributionAmount }`), `status`.

Campos de `unions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `cuit` | String | [VERIFICAR] | — | — |
| `retentionPercent` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `retentionAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `employerContributionPercent` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `employerContributionAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `categoryReviewMonths` | Int | [VERIFICAR] | `MES_CAT`. | — |
| `generalAccountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `chargesAccountId` | uniqueidentifier | [VERIFICAR] | M15. | `ledgerAccounts` (M15) |
| `depositInfo` | Object | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `fileLayoutId` | uniqueidentifier | [VERIFICAR] | — | `fileLayouts` (T06) |
| `validFrom` | Date | [VERIFICAR] | Porcentajes versionados en `rates[]` `{ validFrom, retentionPercent, retentionAmount, employerContributionPercent, employerContributionAmount }`. | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.15. `laborAgreements` — Convenios colectivos

Origen: campo `CONVENIO` de `SU_EMPLEADOS`; BASE §104.3. Campos: `code` (ej. «CCT 36/75»), `name`, `unionId`, `scope`, `normalWeeklyHours`, `seniorityRule` (`percentPerYear`, `scaleTable`, `fixedPerYear`), `seniorityScaleId`, `onCallRegimes[]` `{ code, type (passive|active), valuation (hours|amount|percent), value }`, `specialLeaves[]` (referencias a `leaveCauses`), `severanceCap` `{ averageAmount, validFrom }`, `validation` `{ validatedBy, role, validatedAt, notes }`, `validFrom`, `validTo`, `status` (`draft`, `published`, `retired`).

Campos de `laborAgreements`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | Ej. «CCT 36/75». | — |
| `name` | String | Sí | — | — |
| `unionId` | uniqueidentifier | Sí | — | `unions` (M16) |
| `scope` | Enum | [VERIFICAR] | — | — |
| `normalWeeklyHours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `seniorityRule` | Enum | [VERIFICAR] | `percentPerYear`, `scaleTable`, `fixedPerYear`. | — |
| `seniorityScaleId` | uniqueidentifier | [VERIFICAR] | — | `seniorityScales` (M16) |
| `onCallRegimes` | [Object] | [VERIFICAR] | `{ code, type (passive\|active), valuation (hours\|amount\|percent), value }`. | — |
| `specialLeaves` | [Object] | [VERIFICAR] | Referencias a `leaveCauses`. | — |
| `severanceCap` | Object | [VERIFICAR] | `{ averageAmount, validFrom }`. | — |
| `validation` | Object | [VERIFICAR] | `{ validatedBy, role, validatedAt, notes }`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `published`, `retired`. | — |

### 7.16. `salaryCategories` y `salaryScales` — Categorías y escalas

Origen: `SU_CATE` (`DES_CAT`, `TIP_CAT`, `IMPORTE`, `HRS_TRB`, `HRS_MIN`, `DIAS_MIN`, `ADICIONAL`, `ADICIONAL1`, `ADICIONAL2`, `COD_SIN`). `salaryCategories`: `laborAgreementId`, `code`, `name`, `type` (`monthly`, `daily`, `hourly`), `workHours`, `minHours`, `minDays`, `order`, `status`. `salaryScales`: `laborAgreementId`, `name` (ej. «Paritaria 2026-04»), `validFrom`, `recordedAt`, `agreementReference`, `status` (`draft`, `approved`, `published`, `superseded`), `items[]` `{ categoryId, basic DECIMAL(18,4), additional, additional1, additional2, others[] { code, amount } }`, `origin` (`manual`, `increase`, `import`), `increaseBatchId`, `approvalId`. Índice `{tenantId, laborAgreementId, validFrom, status}`.

Campos de `salaryCategories`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `laborAgreementId` | uniqueidentifier | Sí | — | `laborAgreements` (M16) |
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `type` | Enum | [VERIFICAR] | `monthly`, `daily`, `hourly`. | — |
| `workHours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `minHours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `minDays` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `order` | Int | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

**`salaryScales`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `laborAgreementId` | uniqueidentifier | [VERIFICAR] | — | `laborAgreements` (M16) |
| `salaryCategoryId` | uniqueidentifier | Sí | Categoría de la escala; `{salaryCategoryId, validFrom}` único (T05; PA-SUE-18). | `salaryCategories` (M16) |
| `name` | String | Sí | Ej. «Paritaria 2026-04». | — |
| `validFrom` | Date | Sí | — | — |
| `recordedAt` | Date (fecha y hora) | Cond. | — | — |
| `agreementReference` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `approved`, `published`, `superseded`. | — |
| `items` | [Object] | [VERIFICAR] | `{ categoryId, basic DECIMAL(18,4), additional, additional1, additional2, others[] { code, amount } }`. | — |
| `origin` | Object | [VERIFICAR] | `manual`, `increase`, `import`. | — |
| `increaseBatchId` | uniqueidentifier | [VERIFICAR] | — | `salaryIncreaseBatches` (M16) |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |

### 7.17. `seniorityScales` — Antigüedad y días de vacaciones

Origen: `SU_ANTIGUE` (`DESDE`, `HASTA`, `COD_CAT`, `PORCENT`, `IMPORTE`, `COD_SIN`, `DIAS_VAC`). Campos: `laborAgreementId` o `unionId`, `categoryId` (opcional), `rows[]` `{ yearsFrom, yearsTo, percent, amount, vacationDays }`, `validFrom`.

Campos de `seniorityScales`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `laborAgreementId` | uniqueidentifier | Sí | — | `laborAgreements` (M16) |
| `unionId` | uniqueidentifier | [VERIFICAR] | — | `unions` (M16) |
| `categoryId` | uniqueidentifier | No | Opcional. | `serviceCategories` (M02) |
| `rows` | [Object] | [VERIFICAR] | `{ yearsFrom, yearsTo, percent, amount, vacationDays }`. | — |
| `validFrom` | Date | Sí | — | — |

### 7.18. `positions` y `workAreas` — Cargos y áreas

Origen: `SU_CARGO`. `positions`: `code`, `name`, `description`, `professionalQualification` (para recibo y art. 80). `workAreas`: `code`, `name`, `costCenterId` (M15, Sí), `serviceIds[]` (M02), `managerEmployeeId`, `parentId`.

Campos de `positions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `description` | String | [VERIFICAR] | — | — |
| `professionalQualification` | String | [VERIFICAR] | Para recibo y art. 80 . | — |

**`workAreas`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `costCenterId` | uniqueidentifier | Sí | M15, Sí. | `costCenters` (M15) |
| `serviceIds` | [uniqueidentifier] | [VERIFICAR] | M02. | `tenantServices` (M02) |
| `managerEmployeeId` | uniqueidentifier | [VERIFICAR] | — | `employees` (M16) |
| `parentId` | uniqueidentifier | [VERIFICAR] | — | `workAreas` (M16) |

### 7.19. `healthInsurerAdoptions` — Obras sociales del tenant

Origen: `SU_OBRA` (`DES_OBR`, `POR_RETENCIO`, `IMP_RETENCIO`, `POR_APORTE`, `IMP_APORTE`). Campos: `officialCode` (RNOS, tabla oficial), `name`, `rates[]` `{ validFrom, employeeRetentionPercent, employeeRetentionAmount, employerPercent, employerAmount, dependentAddOn }`, `status`.

Campos de `healthInsurerAdoptions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `officialCode` | String | Sí | RNOS, tabla oficial. | — |
| `name` | String | Sí | — | — |
| `rates` | [Object] | [VERIFICAR] | `{ validFrom, employeeRetentionPercent, employeeRetentionAmount, employerPercent, employerAmount, dependentAddOn }`. | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.20. `terminationReasons` — Motivos de egreso

Origen: `SU_DESVICULACION` (`DES_DESV`, `CATEGORIA`), `SU_DESVIC_EXTRAS` (`COD_EXTRA`, `COD_DESV`, `IMP_EXTRA`). Campos: `code`, `name`, `category` (`resignation`, `dismissalWithCause`, `dismissalWithoutCause`, `mutualAgreement`, `contractEnd`, `retirement`, `death`, `abandonment`, `forceMajeure`, `probation`, `disability`), `officialCode` (LSD/SICOSS), `conceptTemplate[]` `{ conceptId, defaultAmount, formulaOverride }`, `requiresNotice` boolean.

Campos de `terminationReasons`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `category` | Enum | [VERIFICAR] | `resignation`, `dismissalWithCause`, `dismissalWithoutCause`, `mutualAgreement`, `contractEnd`, `retirement`, `death`, `abandonment`, `forceMajeure`, `probation`, `disability`. | — |
| `officialCode` | String | [VERIFICAR] | LSD/SICOSS. | — |
| `conceptTemplate` | [Object] | [VERIFICAR] | `{ conceptId, defaultAmount, formulaOverride }`. | — |
| `requiresNotice` | Bool | [VERIFICAR] | Boolean. | — |

### 7.21. `payrollVariables` — Variables

Origen: `SU_VARIABLES` (`DES_VAR`, `FORMULA`, `TIP_VAR`). Campos: `name` (único), `description`, `resultType` (`number`, `amount`, `boolean`, `date`, `text`), `formula` (texto DSL), `compiledAst` (generado), `dependencies[]`, `configVersionId`, `status`.

Campos de `payrollVariables`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | Único. | — |
| `description` | String | [VERIFICAR] | — | — |
| `resultType` | Bool | [VERIFICAR] | `number`, `amount`, `boolean`, `date`, `text`. | — |
| `formula` | String | [VERIFICAR] | Texto DSL. | — |
| `compiledAst` | Object | [VERIFICAR] | Generado. | — |
| `dependencies` | [String] | [VERIFICAR] | Variables de las que depende [VERIFICAR]. | — |
| `configVersionId` | uniqueidentifier | Sí | — | `payrollConfigVersions` (M16) |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.22. `payrollConcepts` — Conceptos

Origen: `SU_CONCEPTOS` (26 columnas), `SU_CONCEPTO_TIPO` (`COD_TIPO`, `COD_CON`, `NOMOSTRAR`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | Código único en el tenant. | — |
| `name` | string | Sí | Descripción en recibo (clave de diccionario opcional). | — |
| `type` | enum `remunerative`(1), `nonRemunerative`(10), `deduction`(30), `withholding`(40), `employerContribution`(60), `rounding`(70) | Sí | RN-SUE-016. | — |
| `validFrom`, `validTo` | date | Sí / No | Vigencia. | — |
| `quantityFormula`, `amountFormula`, `baseFormula`, `filterFormula` | string | No / Sí / No / No | Fórmulas DSL. | — |
| `calcOrder` | int | Sí | Orden de cálculo. | — |
| `alwaysSettle` | boolean | Sí | «Liquidar siempre». | — |
| `affectsSac`, `affectsVacation`, `affectsSeverance` | boolean | Sí | Base de SAC, vacaciones e indemnización. | — |
| `incomeTaxTreatment` | enum `none`, `always`, `if75Percent`, `if50Percent`, `percent` + `incomeTaxPercent` | Sí | RN-SUE-019. | — |
| `incomeTaxCategoryCode` | string | No | Renglón del F.1357/F.1359. | — |
| `sicossClassification` | string | Sí | Código de la tabla oficial. | — |
| `subsystems` | `{ sipa, inssjp, healthInsurance, fsr, renatre, familyAllowances, fne, lrt, differentialRegime, specialRegime }` booleanos | Sí | Bases por subsistema. | — |
| `arcaConceptCode` | string | Sí si la empresa genera LSD | Código ARCA del concepto (LSD). | — |
| `accountId` | uniqueidentifier | No | Cuenta contable del concepto (M15). | `accounts` (M01) |
| `payrollTypes[]` | `{ payrollTypeId, hiddenOnPayslip }` | Sí | Tipos de liquidación donde aplica. | — |
| `printOnPayslip`, `printQuantity`, `unit` | boolean / boolean / string | Sí | Presentación. | — |
| `isSensitive` | boolean | Sí | Oculta el nombre del concepto a quien no tiene permiso (ej. «embargo»). | — |
| `configVersionId` | uniqueidentifier | Sí | Versión a la que pertenece. | `configVersions` (T04) |
| `status` | enum `draft`, `published`, `retired` | Sí | — | — |

Índices: `{tenantId, configVersionId, code}` único; `{tenantId, status, calcOrder}`.

### 7.23. `payrollTypes` — Tipos de liquidación

Origen: `SU_TIPO_RECIBOS` (`DES_TIPO`, `COD_COM`, `DIA_DESDE`, `DIA_HASTA`, `PRORRATEAR`, `NO_DESCONTAR_ADELANTO`, `TIPO_LIQUIDACION`, `SAC`, `VACACIONES`, `TIPO_TRAMA`). Campos: `code`, `name`, `kind` (`monthly`, `biweekly1`, `biweekly2`, `weekly`, `sac1`, `sac2`, `vacation`, `final`, `complementary`, `corrective`, `advance`), `dayFrom`, `dayTo`, `incomeTaxProration` (`none`, `twelfths`), `skipAdvanceDeduction`, `incomeTaxScaleType`, `voucherTypeId`, `isSac`, `isVacation`, `lsdLiquidationType` (código oficial), `status`.

Campos de `payrollTypes`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `kind` | Enum | [VERIFICAR] | `monthly`, `biweekly1`, `biweekly2`, `weekly`, `sac1`, `sac2`, `vacation`, `final`, `complementary`, `corrective`, `advance`. | — |
| `dayFrom` | Date | [VERIFICAR] | — | — |
| `dayTo` | Date | [VERIFICAR] | — | — |
| `incomeTaxProration` | Enum | [VERIFICAR] | `none`, `twelfths`. | — |
| `skipAdvanceDeduction` | Bool | [VERIFICAR] | — | — |
| `incomeTaxScaleType` | Enum | [VERIFICAR] | — | — |
| `voucherTypeId` | uniqueidentifier | [VERIFICAR] | — | `voucherTypes` (M05) |
| `isSac` | Bool | [VERIFICAR] | — | — |
| `isVacation` | Bool | [VERIFICAR] | — | — |
| `lsdLiquidationType` | Enum | [VERIFICAR] | Código oficial. | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.24. `payrollConfigVersions` — Versiones de configuración

Origen: AGR-009 (sin equivalente ProCoop). Campos: `number`, `name`, `effectiveFrom`, `status` (`draft`, `inReview`, `published`, `superseded`, `discarded`), `basedOnVersionId`, `changes[]` `{ entity, entityId, changeType, summary }`, `validationReport` `{ errors[], warnings[] }`, `simulationRunId`, `diffReportRef`, `reviewedBy`, `publishedBy`, `publishedAt`, `scope` (`calculation`, `presentation`). Índice `{tenantId, status, effectiveFrom}`.

Campos de `payrollConfigVersions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `effectiveFrom` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `inReview`, `published`, `superseded`, `discarded`. | — |
| `basedOnVersionId` | uniqueidentifier | [VERIFICAR] | — | `payrollConfigVersions` (M16) |
| `changes` | [Object] | [VERIFICAR] | `{ entity, entityId, changeType, summary }`. | — |
| `validationReport` | Object | [VERIFICAR] | `{ errors[], warnings[] }`. | — |
| `simulationRunId` | uniqueidentifier | [VERIFICAR] | — | `simulationRuns` (M04) |
| `diffReportRef` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `reviewedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `publishedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `publishedAt` | Date (fecha y hora) | Cond. | — | — |
| `scope` | Enum | [VERIFICAR] | `calculation`, `presentation`. | — |

### 7.25. `noveltyTypes` — Tipos de novedad

Origen: `SU_TIPO_NOVEDADES` (`DES_TIPO`, `TIPO`, `COD_SIRADIG`, `ANTICIPO`, `TOPE_ANUAL`, `POR_GAN_NETA`, `PAGOS_A_CUENTA`, `IMP_CEDULAR`). Campos: `code`, `name`, `valueKind` (`quantity`, `amount`, `days`, `hours`), `behavior` (`overtime50`, `overtime100`, `onCall`, `absence`, `leave`, `vacation`, `advance`, `garnishment`, `alimony`, `loan`, `otherEmployment`, `provincialPensionEmployment`, `incomeTaxOverride`, `extraTask`, `general`), `siradigCode`, `annualCap`, `netIncomePercentCap`, `isIncomeTaxPrepayment`, `affectsCedularTax`, `requiresSupervisorApproval`, `sensitive`, `status`.

Campos de `noveltyTypes`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `valueKind` | Enum | [VERIFICAR] | `quantity`, `amount`, `days`, `hours`. | — |
| `behavior` | Enum | [VERIFICAR] | `overtime50`, `overtime100`, `onCall`, `absence`, `leave`, `vacation`, `advance`, `garnishment`, `alimony`, `loan`, `otherEmployment`, `provincialPensionEmployment`, `incomeTaxOverride`, `extraTask`, `general`. | — |
| `siradigCode` | String | [VERIFICAR] | — | — |
| `annualCap` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `netIncomePercentCap` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `isIncomeTaxPrepayment` | Bool | [VERIFICAR] | — | — |
| `affectsCedularTax` | Bool | [VERIFICAR] | — | — |
| `requiresSupervisorApproval` | Bool | [VERIFICAR] | — | — |
| `sensitive` | Bool | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.26. `novelties` — Novedades

Origen: `SU_EMP_NOVEDADES` (`COD_TIPO`, `COD_EMP`, `FECHA`, `CANTIDAD`, `OBSE`, `FEC_VACACION`, `ID_IVACOM`, `NRO_CUO`, `ID_ANTICIPO`, `COD_SOL`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `noveltyTypeId` | uniqueidentifier | Sí | — | `noveltyTypes` (M16) |
| `date` | date | Sí | Fecha del hecho. | — |
| `periodKey` | string `YYYY-MM[-Q]` | Sí | Período en que se liquida. | — |
| `accrualPeriodKey` | string | Sí | Período de devengamiento (complementarias). | — |
| `quantity`, `amount` | DECIMAL(18,4) | Según tipo | — | — |
| `installment` | `{ number, of, parentId }` | No | Cuotas. | — |
| `vacationYear` | int | No | Año de goce (FEC_VACACION). | — |
| `source` | enum `manual`, `excel`, `workOrder`, `crewTimesheet`, `fleet`, `timeClock`, `extraTask`, `leave`, `siradig`, `deductionPlan`, `treasuryAdvance`, `migration` | Sí | Origen. | — |
| `sourceRef` | string | Sí si no es manual | Clave idempotente del origen (ej. `ot:<id>:emp:<id>:2026-03-14:ot50`). | — (clave idempotente del origen, texto; no es referencia) |
| `leaveRequestId`, `deductionPlanId`, `importBatchId` | uniqueidentifier | No | Vínculos. | `leaveRequests` (M16) / `deductionPlans` (M16) / `noveltyImportBatches` (M16) |
| `status` | enum `draft`, `pendingApproval`, `approved`, `rejected`, `settled`, `voided` | Sí | §8.4. | — |
| `approvals[]` | `{ step, userId, decision, at, comment }` | No | — | — |
| `settledPayslipId` | uniqueidentifier | No | Recibo que la tomó. | `payslips` (M16) |
| `notes` | string | No | — | — |

Índices: `{tenantId, employeeId, periodKey, status}`; `{tenantId, sourceRef}` único parcial (si existe).

### 7.27. `noveltyImportBatches` — Lotes de importación de novedades

Campos: `source` (`excel`, `workOrders`, `fleet`, `timeClock`, `advances`, `siradigOtherEmployment`), `legalEntityId`, `periodKey`, `fileRef`, `fileHash`, `rows`, `accepted`, `rejected`, `errors[]` `{ row, field, message }`, `status` (`uploaded`, `validated`, `confirmed`, `failed`), `jobId`.

Campos de `noveltyImportBatches`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `source` | Enum | [VERIFICAR] | `excel`, `workOrders`, `fleet`, `timeClock`, `advances`, `siradigOtherEmployment`. | — |
| `legalEntityId` | uniqueidentifier | [VERIFICAR] | — | `legalEntities` (T04) |
| `periodKey` | String | [VERIFICAR] | — | — |
| `fileRef` | uniqueidentifier | [VERIFICAR] | T05 lo nombra `storedFileId` (clave de COL-SUE; PA-SUE-18); `fileRef` queda como alias. | `storedFiles` (T01) |
| `fileHash` | String | Sí | — | — |
| `rows` | Int | [VERIFICAR] | Filas leídas [VERIFICAR] (el anexo no lo detalla). | — |
| `accepted` | Int | [VERIFICAR] | Filas aceptadas [VERIFICAR]. | — |
| `rejected` | Int | [VERIFICAR] | Filas rechazadas [VERIFICAR]. | — |
| `errors` | [Object] | [VERIFICAR] | `{ row, field, message }`. | — |
| `status` | Enum | Sí | `uploaded`, `validated`, `confirmed`, `failed`. | — |
| `jobId` | uniqueidentifier | [VERIFICAR] | — | `jobRuns` (T01) |

### 7.28. `timePunches` — Fichadas

Origen: `SU_HORAS_LECTOR` (`FECHA`, `COD_EMP`, `ENTRADA`, `FEC_REG`, `USU_REG`, `PROCESADO`, `MANUAL`). Campos: `employeeId`, `at` (UTC), `direction` (`in`, `out`, `unknown`), `deviceId`, `manual` boolean, `processed` boolean, `processedDayKey`, `importBatchId`. Índice `{tenantId, employeeId, at}` único.

Campos de `timePunches`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `at` | Date (fecha y hora) | Sí | UTC. | — |
| `direction` | Enum | [VERIFICAR] | `in`, `out`, `unknown`. | — |
| `deviceId` | String | Sí | Identificador del lector de fichadas (antes "[VERIFICAR] si existe colección de dispositivos"; T05 §7.2, PA-DAT-04). | — (identificador del dispositivo embebido en `localAgents.devices[]` (T06); no es uniqueidentifier de colección, T05 §7.2) |
| `manual` | Bool | [VERIFICAR] | Boolean. | — |
| `processed` | Bool | [VERIFICAR] | Boolean. | — |
| `processedDayKey` | String | [VERIFICAR] | — | — |
| `importBatchId` | uniqueidentifier | [VERIFICAR] | — | `noveltyImportBatches` (M16) |

### 7.29. `extraTasks` — Tareas extra

Origen: `SU_TAREAS_EXTRAS` (`TIPO_TAREA`, `COD_SUM`, `OBSERVA`, `FECHA_DESDE`, `FECHA_HASTA`, `FECHA_REGISTRO`, `USER_REGISTRO`), `SU_TAREAS_EXTRAS_EMPLEADOS` (`ID_TAREA`, `COD_EMP`, `CANTIDAD`, `UNITARIO`, `TOTAL`). Campos: `taskType` (`reading`, `cut`, `reconnection`, `delivery`, `other`), `serviceConnectionId` (opcional), `sourceRef`, `notes`, `dateFrom`, `dateTo`, `workers[]` `{ employeeId, quantity, unitAmount, total }`, `noveltyIds[]`, `status`.

Campos de `extraTasks`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `taskType` | Enum | [VERIFICAR] | `reading`, `cut`, `reconnection`, `delivery`, `other`. | — |
| `accountId` | uniqueidentifier | No | Antes `serviceConnectionId` (nombre de T05). Opcional. Suministro (`COD_SUM`). | `accounts` (M01) |
| `sourceRef` | uniqueidentifier | [VERIFICAR] | Orden de trabajo que originó la tarea; T05 la nombra `workOrderId` (clave de COL-SUE) y este anexo conserva `sourceRef` como alias. | `workOrders` (M10) (antes `[VERIFICAR]`; PA-SUE-18) |
| `notes` | String | [VERIFICAR] | — | — |
| `dateFrom` | Date | [VERIFICAR] | — | — |
| `dateTo` | Date | [VERIFICAR] | — | — |
| `workers` | [Object] | [VERIFICAR] | `{ employeeId, quantity, unitAmount, total }`. | — |
| `employeeId` | uniqueidentifier | — | Clave de T05: es `workers[].employeeId`, no un campo de primer nivel (PA-SUE-18). | `employees` (M16) |
| `noveltyIds` | [uniqueidentifier] | [VERIFICAR] | — | `novelties` (M16) |
| `status` | Enum | Sí | `draft`, `confirmed`, `voided` (§8.12.12; antes sin valores, PA-SUE-18). | — |

### 7.30. `leaveCauses` y `leaveRequests` — Licencias

Origen: `SU_LICENCIAS_CAUSAS` (`DESCRIPCION`, `VACACIONES`, `COD_TIP_NOV`, `DIAS_PERIOD`, `RET_TEMP`), `SU_LICENCIAS` (18 columnas: `COD_LICE`, `COD_EMP`, `FECHA`, `PERIODO`, `DIAS_TOTALES`, `DIAS_ANTER`, `FECHA_DESDE`, `FECHA_HASTA`, `CAUSA_DIAS`, `FECHA_AUT_DESDE`, `FECHA_AUT_HASTA`, `AUTORIZACION` y 6 más).

`leaveCauses`: `code`, `name`, `legalBasis` (`lct`, `agreement`, `company`), `paid` boolean, `isVacation`, `noveltyTypeId`, `daysPerPeriod` (0 = sin límite), `dayCounting` (`calendar`, `business`), `periodUnit` (`year`, `event`, `month`), `employmentStatusCode`, `requiresCertificate`, `sensitive`, `jobProtection` boolean, `temporaryRetention` (`RET_TEMP`), `approvalFlow` (`supervisor`, `supervisorAndHr`, `hr`).

Campos de `leaveCauses`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `legalBasis` | Enum | [VERIFICAR] | `lct`, `agreement`, `company`. | — |
| `paid` | Bool | [VERIFICAR] | Boolean. | — |
| `isVacation` | Bool | [VERIFICAR] | — | — |
| `noveltyTypeId` | uniqueidentifier | [VERIFICAR] | — | `noveltyTypes` (M16) |
| `daysPerPeriod` | Int | [VERIFICAR] | 0 = sin límite. | — |
| `dayCounting` | Enum | [VERIFICAR] | `calendar`, `business`. | — |
| `periodUnit` | Enum | [VERIFICAR] | `year`, `event`, `month`. | — |
| `employmentStatusCode` | String | [VERIFICAR] | — | — |
| `requiresCertificate` | Bool | [VERIFICAR] | — | — |
| `sensitive` | Bool | [VERIFICAR] | — | — |
| `jobProtection` | Bool | [VERIFICAR] | Boolean. | — |
| `temporaryRetention` | Bool | [VERIFICAR] | `RET_TEMP`. | — |
| `approvalFlow` | Enum | [VERIFICAR] | `supervisor`, `supervisorAndHr`, `hr`. | — |

`leaveRequests`: `employeeId`, `leaveCauseId`, `requestedAt`, `vacationYear`, `requestedFrom`, `requestedTo`, `requestedDays`, `previousBalance` (`DIAS_ANTER`), `authorizedFrom`, `authorizedTo`, `authorizedDays`, `status` (`requested`, `approvedBySupervisor`, `approved`, `rejected`, `cancelled`, `interrupted`), `decisions[]`, `rejectionReason`, `attachments[]` **(S si causa sensible)**, `diagnosis` **(S, opcional, nunca obligatorio)**, `noveltyIds[]`. Índice `{tenantId, employeeId, requestedFrom}`.

**`leaveRequests`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `leaveCauseId` | uniqueidentifier | Sí | — | `leaveCauses` (M16) |
| `requestedAt` | Date (fecha y hora) | Cond. | — | — |
| `vacationYear` | Int | [VERIFICAR] | — | — |
| `requestedFrom` | Date | [VERIFICAR] | — | — |
| `requestedTo` | Date | [VERIFICAR] | — | — |
| `requestedDays` | Int | [VERIFICAR] | — | — |
| `previousBalance` | DECIMAL(18,4) | [VERIFICAR] | `DIAS_ANTER`. | — |
| `authorizedFrom` | Date | [VERIFICAR] | — | — |
| `authorizedTo` | Date | [VERIFICAR] | — | — |
| `authorizedDays` | Int | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `requested`, `approvedBySupervisor`, `approved`, `rejected`, `cancelled`, `interrupted`. | — |
| `decisions` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `rejectionReason` | String | [VERIFICAR] | — | — |
| `attachments` | [uniqueidentifier] | Cond. | **(S si causa sensible)**. | `storedFiles` (T01) |
| `diagnosis` | String | No | **(S, opcional, nunca obligatorio)**. | — |
| `noveltyIds` | [uniqueidentifier] | [VERIFICAR] | — | `novelties` (M16) |

### 7.31. `vacationBalances` — Saldos de vacaciones

Campos: `employeeId`, `vacationYear`, `entitledDays`, `ruleApplied` (`lct150`, `lct151Proportional`, `agreement`), `takenDays`, `pendingRequestDays`, `carriedOverDays`, `paidOutDays` (egreso), `computedAt`. Índice `{tenantId, employeeId, vacationYear}` único. Recalculado por `JOB-SUE-12`.

Campos de `vacationBalances`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `vacationYear` | Int | Sí | — | — |
| `entitledDays` | Int | [VERIFICAR] | — | — |
| `ruleApplied` | Enum | [VERIFICAR] | `lct150`, `lct151Proportional`, `agreement`. | — |
| `takenDays` | Int | [VERIFICAR] | — | — |
| `pendingRequestDays` | Int | [VERIFICAR] | — | — |
| `carriedOverDays` | Int | [VERIFICAR] | — | — |
| `paidOutDays` | Int | [VERIFICAR] | Egreso. | — |
| `computedAt` | Date (fecha y hora) | Cond. | — | — |

### 7.32. `payPeriods` — Períodos de sueldos

Origen: P2376. Campos: `legalEntityId`, `periodKey`, `frequency`, `status` (`open`, `inPayroll`, `closed`, `reopened`), `closedBy`, `closedAt`, `reopenings[]` `{ by, at, reason, approvalId }`, `lsdFiled` boolean. Índice `{tenantId, legalEntityId, periodKey, frequency}` único.

Campos de `payPeriods`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | uniqueidentifier | Sí | — | `legalEntities` (T04) |
| `periodKey` | String | Sí | — | — |
| `frequency` | Enum | Sí | — | — |
| `status` | Enum | Sí | `open`, `inPayroll`, `closed`, `reopened`. | — |
| `closedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `closedAt` | Date (fecha y hora) | Cond. | — | — |
| `reopenings` | [Object] | [VERIFICAR] | `{ by, at, reason, approvalId }`. | — |
| `lsdFiled` | Bool | [VERIFICAR] | Boolean. | — |

### 7.33. `payrollRuns` — Liquidaciones (lotes)

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | string | Sí | Ej. `LIQ-2026-03-M-01`. | — |
| `legalEntityId` | uniqueidentifier | Sí | Entidad jurídica empleadora (DEC-064). | `legalEntities` (T04) |
| `payrollTypeId` | uniqueidentifier | Sí | — | `payrollTypes` (M16) |
| `periodKey`, `accrualPeriodKey` | string | Sí | Período liquidado y de devengamiento. | — |
| `mode` | enum `real`, `simulation` | Sí | Simulación sin efectos (RF-SUE-070). | — |
| `configVersionId` | uniqueidentifier | Sí | Versión de configuración usada. | `configVersions` (T04) |
| `universe` | `{ filters, employeeIds[] }` | Sí | Universo. | — |
| `paymentDate` | date | Sí en real | Fecha de pago prevista. | — |
| `lastContributionDeposit` | `{ period, date, bank }` | Sí en real | Constancia art. 140 inc. j. | — |
| `status` | enum (§8.5) | Sí | — | — |
| `progress` | `{ total, done, failed }` | Sí | Avance del job. | — |
| `totals` | `{ remunerative, nonRemunerative, deductions, withholdings, employerContributions, net, employees }` DECIMAL(18,4) | Sí | — | — |
| `checks` | `{ blocking[], warnings[] }` | Sí | RF-SUE-071. | — |
| `comparisonRef` | string | No | Comparativo con período anterior. | — (clave del comparativo calculado por el job; no es referencia) |
| `correctsRunId`, `complementsRunId` | uniqueidentifier | No | Rectificativa / complementaria. | `payrollRuns` (M16) |
| `calculatedBy`, `submittedBy`, `approvedBy`, `closedBy`, `voidedBy` | uniqueidentifier | No | Separación de funciones. | `memberships` (T02) |
| `approvalId` | uniqueidentifier | No | T11. | `approvalRequests` (T11) |
| `accountingEntryRefs[]` | `{ planId, entryId }` | No | Asientos de M15. | — |
| `paymentRequestId` | uniqueidentifier | No | — | `payrollPaymentRequests` (M16) |

Índices: `{tenantId, legalEntityId, periodKey, payrollTypeId, mode, status}`; `{tenantId, number}` único.

### 7.34. `payslips` — Recibos

Origen: `SU_SUELDOS` (21 columnas: `COD_EMP`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_TIPO`, `FEC_PER`, `FEC_REG`, `FEC_PAG`, `FEC_IMP`, `COD_CAT`, `APORTE_PER`, `APORTE_FEC` y 9 más), `SU_SUELDOSIT` (`COD_CON`, `IMPORTE`, `CANTIDAD`, `TIP_CON`, `DES_CON`, `BASE`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `payrollRunId`, `employeeId`, `legalEntityId`, `payrollTypeId` | uniqueidentifier | Sí | — | `payrollRuns` (M16) / `employees` (M16) / `legalEntities` (T04) / `payrollTypes` (M16) |
| `periodKey`, `accrualPeriodKey` | string | Sí | — | — |
| `number` | `{ voucherTypeId, pointOfSale, number }` | Sí al emitir | Numeración (COD_COM, SUC_COM, NUM_COM). | — |
| `snapshot` | objeto | Sí | Datos del legajo y la empresa a la fecha: categoría, calificación, ingreso, antigüedad, convenio, obra social, CUIL, básico, centro de costo. | — |
| `lines[]` | `{ conceptId, code, name, type, quantity, unit, base, amount, calcTrace, hidden, incomeTaxAmount, sicossClassification, accountId }` | Sí | Renglones con traza. | — |
| `hiddenIncomeTaxLines[]` | igual | No | Conceptos ocultos con efecto en Ganancias (RN-08 §11.3). | — |
| `totals` | `{ remunerative, nonRemunerative, deductions, withholdings, employerContributions, net, netInWords, rounding }` | Sí | — | — |
| `contributionBases` | `{ sipa, inssjp, healthInsurance, lrt, ... }` | Sí | Bases topeadas por subsistema. | — |
| `incomeTaxCalculationId` | uniqueidentifier | No | — | `incomeTaxCalculations` (M16) |
| `paymentSplit[]` | `{ payAccountId, amount, status (pending, sent, credited, rejected), treasuryRef }` | Sí | — | — |
| `paymentDate`, `paidAt` | date | Sí / No | FEC_PAG. | — |
| `status` | enum (§8.6) | Sí | — | — |
| `pdfRef`, `pdfHash` | string | Sí al emitir | — | `storedFiles` (T01) (solo `pdfRef`; `pdfHash` es texto) |
| `signature` | `{ signatureRequestId, employerStatus, employerSignedAt, employeeStatus (pending, signed, signedWithDisagreement, rejectedTechnical), employeeSignedAt, disagreementNote, batchId }` | Sí | RF-SUE-105. Proyección del estado de la solicitud de firma de T11; la evidencia (OTP, hash, sello de tiempo, certificado) la guarda T11. | — |
| `delivery` | `{ notifiedAt, viewedAt, acknowledgedAt, reminders }` | Sí | RF-SUE-106. | — |
| `replacesPayslipId`, `replacedByPayslipId` | uniqueidentifier | No | Rectificativa. | `payslips` (M16) |
| `voidReason` | string | No | — | — |

Índices: `{tenantId, employeeId, periodKey, payrollTypeId, legalEntityId}` único parcial (`status ≠ voided` y sin `replacesPayslipId`); `{tenantId, payrollRunId}`; `{tenantId, "signature.employeeStatus"}`.

### 7.35. `incomeTaxCalculations` — Detalle de Ganancias

Origen: `SU_SUELDOS_DETGAN` (`COD_SUE`, `TIPO_REG_GAN`, `IMPORTE`). Campos: `payslipId`, `employeeId`, `fiscalYear`, `month`, `kind` (`monthly`, `annual`, `final`), `lines[]` `{ code (ganancia bruta, SAC, otros empleos, aportes, obra social, cuota sindical, seguros, intereses hipotecarios, alquileres, servicio doméstico, honorarios médicos, donaciones, gastos de sepelio, movilidad, ganancia no imponible, deducción especial, cónyuge, hijos, ganancia neta sujeta, impuesto determinado, retenciones anteriores, pagos a cuenta, retención del mes, devolución ...), amount }`, `scaleTableVersion`, `deductionTableVersion`, `overrideNoveltyId`, `withheldAmount`, `refundAmount`. Índice `{tenantId, employeeId, fiscalYear, month, kind}`.

Campos de `incomeTaxCalculations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `payslipId` | uniqueidentifier | Sí | — | `payslips` (M16) |
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `fiscalYear` | Int | [VERIFICAR] | — | — |
| `month` | Int | [VERIFICAR] | — | — |
| `kind` | Enum | [VERIFICAR] | `monthly`, `annual`, `final`. | — |
| `lines` | [Object] | [VERIFICAR] | `{ code (ganancia bruta, SAC, otros empleos, aportes, obra social, cuota sindical, seguros, intereses hipotecarios, alquileres, servicio doméstico, honorarios médicos, donaciones, gastos de sepelio, movilidad, ganancia no imponible, deducción especial, cónyuge, hijos, ganancia neta sujeta, impuesto determinado, retenciones anteriores, pagos a cuenta, retención del mes, devolución ...), amount }`. | — |
| `scaleTableVersion` | String | [VERIFICAR] | — | — |
| `deductionTableVersion` | String | [VERIFICAR] | — | — |
| `overrideNoveltyId` | uniqueidentifier | [VERIFICAR] | — | `novelties` (M16) |
| `withheldAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `refundAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |

### 7.36. `incomeTaxDeclarations` — F.572 web / SIRADIG

Campos: `employeeId`, `legalEntityId`, `fiscalYear`, `formVersion`, `submittedAt`, `fileRef`, `fileHash`, `familyCharges[]`, `deductions[]` `{ type, period, amount, providerCuit }`, `otherEmployments[]` `{ employerCuit, period, grossAmount, sac, contributions, withheldTax }`, `prepayments[]`, `perceptions[]`, `status` (`imported`, `applied`, `superseded`). Índice `{tenantId, employeeId, fiscalYear, formVersion}` único.

Campos de `incomeTaxDeclarations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `legalEntityId` | uniqueidentifier | [VERIFICAR] | — | `legalEntities` (T04) |
| `fiscalYear` | Int | Sí | — | — |
| `formVersion` | String | Sí | — | — |
| `submittedAt` | Date (fecha y hora) | Cond. | — | — |
| `fileRef` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `fileHash` | String | [VERIFICAR] | — | — |
| `familyCharges` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `deductions` | [Object] | [VERIFICAR] | `{ type, period, amount, providerCuit }`. | — |
| `otherEmployments` | [Object] | [VERIFICAR] | `{ employerCuit, period, grossAmount, sac, contributions, withheldTax }`. | — |
| `prepayments` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `perceptions` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `status` | Enum | Sí | `imported`, `applied`, `superseded`. | — |

### 7.37. `statutoryFilings` — Presentaciones

Campos: `legalEntityId`, `periodKey`, `kind` (`lsd`, `sicoss`, `sicoreWages`, `f1357`, `f1359`, `unionFile`, `artPayroll`, `bankPayrollReport`), `layoutId`, `layoutVersion`, `payrollRunIds[]`, `fileRef`, `fileHash`, `totals`, `controls` `{ differences[] }`, `status` (`generated`, `approved`, `filed`, `rectified`, `voided`), `filedAt`, `acknowledgementRef` (acuse), `vepRef` (M14), `generatedBy`, `approvedBy`. Índice `{tenantId, legalEntityId, periodKey, kind, status}`.

Campos de `statutoryFilings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | uniqueidentifier | Sí | — | `legalEntities` (T04) |
| `periodKey` | String | Sí | — | — |
| `kind` | Enum | Sí | `lsd`, `sicoss`, `sicoreWages`, `f1357`, `f1359`, `unionFile`, `artPayroll`, `bankPayrollReport`. | — |
| `layoutId` | uniqueidentifier | [VERIFICAR] | — | `externalPayrollLayouts` (M16) |
| `layoutVersion` | String | [VERIFICAR] | — | — |
| `payrollRunIds` | [uniqueidentifier] | [VERIFICAR] | — | `payrollRuns` (M16) |
| `fileRef` | uniqueidentifier | [VERIFICAR] | T05 lo nombra `storedFileId` (PA-SUE-18); `fileRef` queda como alias. | `storedFiles` (T01) |
| `fileHash` | String | [VERIFICAR] | — | — |
| `totals` | Object | [VERIFICAR] | — | — |
| `controls` | [Object] | [VERIFICAR] | `{ differences[] }`. | — |
| `status` | Enum | Sí | `generated`, `approved`, `filed`, `rectified`, `voided`. | — |
| `filedAt` | Date (fecha y hora) | Cond. | — | — |
| `acknowledgementRef` | uniqueidentifier | [VERIFICAR] | Acuse. | `storedFiles` (T01) |
| `vepRef` | uniqueidentifier | [VERIFICAR] | M14. | `paymentExecutions` (M14) (pago del VEP; antes "M14, colección [VERIFICAR]"; PA-SUE-18) |
| `generatedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `approvedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |

### 7.38. `payrollPaymentRequests` — Solicitudes de pago de haberes

Origen: `GenerarPago`, `SU_AUDIT_TRA_INTERBANKING` (el log de envío y respuesta queda en M14). Campos: `payrollRunId` o `externalImportId`, `legalEntityId`, `kind` (`netWages`, `socialSecurity`, `union`, `garnishmentDeposit`, `lifeInsurance`, `other`), `paymentDate`, `method` (`transfer`, `check`, `cash`), `items[]` `{ payslipId, employeeId, payAccountId, amount, status, treasuryItemRef, rejectionReason }`, `total`, `idempotencyKey`, `treasuryRequestId`, `status` (§8.7). Índice `{tenantId, idempotencyKey}` único.

Campos de `payrollPaymentRequests`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `payrollRunId` | uniqueidentifier | Cond. | Alternativo a `externalImportId`. | `payrollRuns` (M16) |
| `externalImportId` | uniqueidentifier | Cond. | Alternativo a `payrollRunId`. | `externalPayrollImports` (M16) |
| `legalEntityId` | uniqueidentifier | [VERIFICAR] | — | `legalEntities` (T04) |
| `kind` | Enum | [VERIFICAR] | `netWages`, `socialSecurity`, `union`, `garnishmentDeposit`, `lifeInsurance`, `other`. | — |
| `paymentDate` | Date | [VERIFICAR] | — | — |
| `method` | Enum | [VERIFICAR] | `transfer`, `check`, `cash`. | — |
| `items` | [Object] | [VERIFICAR] | `{ payslipId, employeeId, payAccountId, amount, status, treasuryItemRef, rejectionReason }`. | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `idempotencyKey` | String | Sí | — | — |
| `treasuryRequestId` | uniqueidentifier | Sí | Lote de pago de sueldos creado en Tesorería. | `payrollPaymentBatches` (M14) |
| `status` | Enum | Sí | §8.7. | — |

### 7.39. `payrollAccountingRules` — Imputación contable

Origen: `SU_ASIENTOS` (`ID_ASIENTO`, `DES_ASIENTO`, `DES_GRAL`, `CTA_DEBE`, `CTA_HABER`, `COD_EMPR`, `COD_SIN`, `COD_CATS`, `EMPLEADOS`, `COD_SEC`, `COD_CAR`, `COD_DEPTO` y 16 más), `SU_CONCEPTOS.COD_CTA`, `SU_EMPRESAS.CTA_CONTRI`/`COD_CTA`, `SU_SINDICATO.CTA_GRAL`/`CTA_CARGAS`. Campos: `name`, `description`, `priority`, `filters` `{ legalEntityIds, unionIds, categoryIds, employeeIds, costCenterIds, positionIds, workAreaIds, conceptIds, conceptTypes }`, `debitAccountId`, `creditAccountId`, `accountingPlanId` (planes múltiples), `entryFormat` (`summaryByAccount`, `byCostCenter`, `byEmployee`), `validFrom`, `status`.

Campos de `payrollAccountingRules`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `payrollConceptId` | uniqueidentifier | [VERIFICAR] | Concepto de liquidación al que aplica la regla (clave de T05; PA-SUE-18). | `payrollConcepts` (M16) |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `description` | String | [VERIFICAR] | — | — |
| `priority` | Int | [VERIFICAR] | — | — |
| `filters` | [Object] | [VERIFICAR] | `{ legalEntityIds, unionIds, categoryIds, employeeIds, costCenterIds, positionIds, workAreaIds, conceptIds, conceptTypes }`. | — |
| `debitAccountId` | uniqueidentifier | [VERIFICAR] | — | `ledgerAccounts` (M15) |
| `creditAccountId` | uniqueidentifier | [VERIFICAR] | — | `ledgerAccounts` (M15) |
| `accountingPlanId` | uniqueidentifier | [VERIFICAR] | Planes múltiples. | `servicePlans` (M02) |
| `entryFormat` | Enum | [VERIFICAR] | `summaryByAccount`, `byCostCenter`, `byEmployee`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.12.7; antes sin valores). | — |

### 7.40. `terminations` — Egresos

Campos: `employeeId`, `terminationReasonId`, `noticeGivenAt`, `lastWorkedDay`, `terminationDate`, `noticeMode` (`worked`, `paidInLieu`, `none`), `bestMonthlyWage`, `seniorityPeriods`, `capApplied` `{ agreementAverage, cap, floor }`, `finalPayrollRunId`, `checklist[]` `{ item, owner, status, doneAt }`, `certificatesIds[]`, `status` (`draft`, `calculated`, `approved`, `settled`, `cancelled`), `approvalId`.

Campos de `terminations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `terminationReasonId` | uniqueidentifier | Sí | — | `terminationReasons` (M16) |
| `noticeGivenAt` | Date (fecha y hora) | Cond. | — | — |
| `lastWorkedDay` | Date | [VERIFICAR] | — | — |
| `terminationDate` | Date | [VERIFICAR] | — | — |
| `noticeMode` | Enum | [VERIFICAR] | `worked`, `paidInLieu`, `none`. | — |
| `bestMonthlyWage` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `seniorityPeriods` | String | [VERIFICAR] | — | — |
| `capApplied` | Object | [VERIFICAR] | `{ agreementAverage, cap, floor }`. | — |
| `finalPayrollRunId` | uniqueidentifier | [VERIFICAR] | — | `payrollRuns` (M16) |
| `checklist` | [Object] | [VERIFICAR] | `{ item, owner, status, doneAt }`. | — |
| `certificatesIds` | [uniqueidentifier] | [VERIFICAR] | — | `storedFiles` (T01) |
| `status` | Enum | Sí | `draft`, `calculated`, `approved`, `settled`, `cancelled`. | — |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |

### 7.41. `employmentCertificates` — Certificados y constancias

Campos: `employeeId`, `kind` (`art80Work`, `art80ServicesAndWages`, `workConstancy`, `wageConstancy`, `contributionConstancy`), `requestedAt`, `requestedBy` (`employee`, `staff`), `dueAt`, `issuedAt`, `fileRef`, `verificationCode`, `delivery` `{ at, channel, acknowledgedAt }`, `status` (`requested`, `issued`, `delivered`).

Campos de `employmentCertificates`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `kind` | Enum | [VERIFICAR] | `art80Work`, `art80ServicesAndWages`, `workConstancy`, `wageConstancy`, `contributionConstancy`. | — |
| `requestedAt` | Date (fecha y hora) | Cond. | — | — |
| `requestedBy` | uniqueidentifier | Cond. | `employee`, `staff`. | `memberships` (T02) |
| `dueAt` | Date (fecha y hora) | Cond. | — | — |
| `issuedAt` | Date (fecha y hora) | Cond. | — | — |
| `fileRef` | uniqueidentifier | [VERIFICAR] | T05 lo nombra `storedFileId` (PA-SUE-18); `fileRef` queda como alias. | `storedFiles` (T01) |
| `verificationCode` | String | [VERIFICAR] | — | — |
| `delivery` | Object | [VERIFICAR] | `{ at, channel, acknowledgedAt }`. | — |
| `status` | Enum | Sí | `requested`, `issued`, `delivered`. | — |

### 7.42. `payslipNotifications` — Notificaciones y firma

Origen: `SU_NOTIFICACIONES` (`FECHA`, `COD_USER_DEST`, `COD_USER_GEN`, `DESCRIPCION`, `VISTO`, `FECHA_FIRMA_EMP`, `ESTADO`, `OBSERVA_NOCONFORM`, `FIRMA`, `REF_PDF`). Campos: `payslipId`, `employeeId`, `kind` (`available`, `signatureRequest`, `reminder`, `signed`, `disagreement`), `sentAt`, `channels[]`, `viewedAt`, `signedAt`, `status`, `note`, `pdfRef`.

Campos de `payslipNotifications`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `payslipId` | uniqueidentifier | Sí | — | `payslips` (M16) |
| `signatureRequestId` | uniqueidentifier | Cond. | Solicitud de firma del recibo (clave de T05; PA-SUE-18). | `signatureRequests` (T11) |
| `employeeId` | uniqueidentifier | [VERIFICAR] | — | `employees` (M16) |
| `kind` | Enum | [VERIFICAR] | `available`, `signatureRequest`, `reminder`, `signed`, `disagreement`. | — |
| `sentAt` | Date (fecha y hora) | Cond. | — | — |
| `channels` | [Enum] | [VERIFICAR] | [VERIFICAR] valores (el anexo no los detalla). | — |
| `viewedAt` | Date (fecha y hora) | Cond. | — | — |
| `signedAt` | Date (fecha y hora) | Cond. | — | — |
| `status` | Enum | Sí | `sent`, `viewed`, `signed`, `disagreed` (valores de §8.12.8, asumidos en PA-SUE-17; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |
| `note` | String | [VERIFICAR] | — | — |
| `pdfRef` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |

### 7.43. Gestión de RRHH

- **`performanceTemplates`**: `name`, `competencies[]` `{ code, name, weight, scale }`, `evaluatorTypes[]` (`self`, `manager`, `peer`, `subordinate`), `scale` `{ min, max, labels }`.
- **`performanceCycles`**: `name`, `templateId`, `from`, `to`, `population` (filtros), `status` (`planned`, `open`, `calibration`, `closed`).
- **`performanceReviews`**: `cycleId`, `employeeId`, `evaluations[]` `{ evaluatorEmployeeId, type, scores[], comments, submittedAt }`, `finalScore`, `feedbackAt`, `employeeAcknowledgedAt`, `status`.
- **`objectives`**: `employeeId` o `workAreaId`, `cycleId`, `title`, `indicator`, `target`, `weight`, `progress[]` `{ at, value, note }`, `finalAchievement`, `status`.
- **`disciplinaryActions`** **(S)**: `employeeId`, `type` (`warning`, `suspension`), `facts`, `occurredAt`, `notifiedAt`, `suspensionDays`, `suspensionFrom`, `defenseText`, `inquiryId`, `documentRefs[]`, `status` (`draft`, `notified`, `disputed`, `firm`, `annulled`).
- **`administrativeInquiries`** **(S)**: `employeeIds[]`, `openedAt`, `investigatorUserId`, `facts`, `stages[]` `{ name, at, notes, documentRefs }`, `defenseAt`, `resolution`, `resolvedAt`, `resultingActionIds[]`, `status` (`open`, `inDefense`, `resolved`, `archived`).
- **`workAccidents`** **(S)**: `employeeId`, `kind` (`workplace`, `inItinere`, `occupationalDisease`), `occurredAt`, `place`, `description`, `witnesses[]`, `artClaimNumber`, `reportedToArtAt`, `sicossAccidentCode`, `leaveRequestIds[]`, `iltDays`, `artReimbursements[]` `{ period, amount, receivedAt }`, `medicalDischargeAt`, `permanentDisabilityPercent`, `status` (`reported`, `inTreatment`, `discharged`, `closed`, `rejectedByArt`).
- **`laborLawsuits`** **(S)**: `employeeId` (o ex empleado), `caseNumber`, `caseTitle`, `court`, `plaintiffLawFirm`, `ownLawFirm`, `claimedAmount`, `provisionAmount`, `provisionHistory[]`, `hearings[]`, `procedureStatus`, `judicialCaseId` (M08 MER-006), `status` (`active`, `settled`, `judgment`, `archived`).

**`performanceTemplates`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `competencies` | [Object] | [VERIFICAR] | `{ code, name, weight, scale }`. | — |
| `evaluatorTypes` | [Object] | [VERIFICAR] | `self`, `manager`, `peer`, `subordinate`. | — |
| `scale` | Object | [VERIFICAR] | `{ min, max, labels }`. | — |

**`performanceCycles`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `templateId` | uniqueidentifier | Sí | — | `performanceTemplates` (M16) |
| `from` | Date | [VERIFICAR] | — | — |
| `to` | Date | [VERIFICAR] | — | — |
| `population` | Object | [VERIFICAR] | Filtros. | — |
| `status` | Enum | Sí | `planned`, `open`, `calibration`, `closed`. | — |

**`performanceReviews`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cycleId` | uniqueidentifier | Sí | — | `performanceCycles` (M16) |
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `evaluations` | [Object] | [VERIFICAR] | `{ evaluatorEmployeeId, type, scores[], comments, submittedAt }`. | — |
| `finalScore` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `feedbackAt` | Date (fecha y hora) | Cond. | — | — |
| `employeeAcknowledgedAt` | Date (fecha y hora) | Cond. | — | — |
| `status` | Enum | Sí | `draft`, `inEvaluation`, `completed`, `acknowledged` (valores de §8.12.9, asumidos en PA-SUE-17; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |

**`objectives`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `workAreaId` | uniqueidentifier | [VERIFICAR] | — | `workAreas` (M16) |
| `cycleId` | uniqueidentifier | Sí | — | `performanceCycles` (M16) |
| `title` | String | [VERIFICAR] | — | — |
| `indicator` | String | [VERIFICAR] | — | — |
| `target` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `weight` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `progress` | [Object] | [VERIFICAR] | `{ at, value, note }`. | — |
| `finalAchievement` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `active`, `closed`, `cancelled` (valores de §8.12.10, asumidos en PA-SUE-17; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |

**`disciplinaryActions`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `type` | Enum | [VERIFICAR] | `warning`, `suspension`. | — |
| `facts` | String | [VERIFICAR] | — | — |
| `occurredAt` | Date (fecha y hora) | [VERIFICAR] | — | — |
| `notifiedAt` | Date (fecha y hora) | Cond. | — | — |
| `suspensionDays` | Int | [VERIFICAR] | — | — |
| `suspensionFrom` | Date | [VERIFICAR] | — | — |
| `defenseText` | String | [VERIFICAR] | — | — |
| `inquiryId` | uniqueidentifier | [VERIFICAR] | — | `administrativeInquiries` (M16) |
| `documentRefs` | [uniqueidentifier] | [VERIFICAR] | — | `storedFiles` (T01) |
| `status` | Enum | Sí | `draft`, `notified`, `disputed`, `firm`, `annulled`. | — |

**`administrativeInquiries`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeIds` | [uniqueidentifier] | [VERIFICAR] | — | `employees` (M16) |
| `number` | String | Sí | Número del sumario, único por tenant (T05; PA-SUE-18). | — |
| `openedAt` | Date (fecha y hora) | [VERIFICAR] | — | — |
| `investigatorUserId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `facts` | String | [VERIFICAR] | — | — |
| `stages` | [Object] | [VERIFICAR] | `{ name, at, notes, documentRefs }`. | — |
| `defenseAt` | Date (fecha y hora) | Cond. | — | — |
| `resolution` | String | [VERIFICAR] | — | — |
| `resolvedAt` | Date (fecha y hora) | Cond. | — | — |
| `resultingActionIds` | [uniqueidentifier] | [VERIFICAR] | — | `disciplinaryActions` (M16) (antes `[VERIFICAR]`) |
| `status` | Enum | Sí | `open`, `inDefense`, `resolved`, `archived`. | — |

**`workAccidents`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | — | `employees` (M16) |
| `number` | String | Sí | Número de la denuncia interna, único por tenant (T05; PA-SUE-18). | — |
| `kind` | Enum | [VERIFICAR] | `workplace`, `inItinere`, `occupationalDisease`. | — |
| `occurredAt` | Date (fecha y hora) | [VERIFICAR] | — | — |
| `place` | String | [VERIFICAR] | — | — |
| `description` | String | [VERIFICAR] | — | — |
| `witnesses` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `artClaimNumber` | String | [VERIFICAR] | — | — |
| `reportedToArtAt` | Date (fecha y hora) | Cond. | — | — |
| `sicossAccidentCode` | String | [VERIFICAR] | — | — |
| `leaveRequestIds` | [uniqueidentifier] | [VERIFICAR] | — | `leaveRequests` (M16) |
| `iltDays` | Int | [VERIFICAR] | — | — |
| `artReimbursements` | [Object] | [VERIFICAR] | `{ period, amount, receivedAt }`. | — |
| `medicalDischargeAt` | Date (fecha y hora) | Cond. | — | — |
| `permanentDisabilityPercent` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `reported`, `inTreatment`, `discharged`, `closed`, `rejectedByArt`. | — |

**`laborLawsuits`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `employeeId` | uniqueidentifier | Sí | O ex empleado. | `employees` (M16) |
| `number` | String | Sí | Número interno del juicio, único por tenant (T05; PA-SUE-18). | — |
| `dossierId` | uniqueidentifier | [VERIFICAR] | Expediente documental del juicio (clave de T05; PA-SUE-18). | `documents` (T11) |
| `caseNumber` | String | [VERIFICAR] | — | — |
| `caseTitle` | String | [VERIFICAR] | — | — |
| `court` | String | [VERIFICAR] | — | — |
| `plaintiffLawFirm` | String | [VERIFICAR] | — | — |
| `ownLawFirm` | String | [VERIFICAR] | — | — |
| `claimedAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `provisionAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `provisionHistory` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `hearings` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `procedureStatus` | Enum | [VERIFICAR] | — | — |
| `judicialCaseId` | uniqueidentifier | [VERIFICAR] | M08 MER-006. | `collectionCases` (M08) [VERIFICAR] |
| `status` | Enum | Sí | `active`, `settled`, `judgment`, `archived`. | — |

### 7.44. Otras colecciones del módulo

- **`reportGroups`** (origen `SU_GRUPO_GRAFICO`): `name`, `conceptIds[]` para gráficos y reportes agrupados.
- **`salaryIncreaseBatches`**: `target` (`unionId`, `laborAgreementId`, `categoryIds[]`, `extraGroupId`), `mode` (`percent`, `amount`), `value`, `effectiveFrom`, `rounding`, `preview[]` `{ categoryId|extraItemId, current, pureBasic, new }`, `resultingScaleId`, `status` (`draft`, `applied`, `discarded`).
- **`externalPayrollImports`** (CU-28): `reference` (ej. `NOM-DEMO-2026-11`), `origin`, `legalEntityId`, `periodKey`, `payrollKind`, `fileRef`, `fileHash`, `layoutId`, `declaredTotal`, `computedTotal`, `lines[]` `{ externalConceptCode, mappedAccountId, costCenterId, serviceId, amount }`, `employees[]` `{ cuil, fileNumber, net, cbu }` (opcional), `status` (`uploaded`, `validated`, `rejected`, `approved`, `posted`, `paid`, `voided`), `errors[]`, `approvedBy`, `accountingEntryRef`, `paymentRequestId`. Índices `{tenantId, legalEntityId, periodKey, payrollKind, reference}` único; `{tenantId, fileHash}` único.
- **`externalPayrollLayouts`**: `name`, `format` (`csv`, `xlsx`, `json`), `columns[]`, `conceptMappings[]` `{ externalCode, accountId, conceptType }`.
- **`parallelRunComparisons`**: `legalEntityId`, `periodKey`, `legacyFileRef`, `payrollRunId`, `tolerance`, `differences[]` `{ employeeId, conceptCode, legacy, goodapps, diff }`, `status`.

**`reportGroups`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `code` | String | Sí | Código único por tenant (clave de T05; PA-SUE-18). | — |
| `conceptIds` | [uniqueidentifier] | [VERIFICAR] | Para gráficos y reportes agrupados. | `billableConcepts` (M02) |

**`salaryIncreaseBatches`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `target` | Object | [VERIFICAR] | `unionId`, `laborAgreementId`, `categoryIds[]`, `extraGroupId`. | — |
| `number` | String | Sí | Número del lote, único por tenant (T05; PA-SUE-18). | — |
| `salaryScaleIds` | [uniqueidentifier] | [VERIFICAR] | Escalas afectadas (clave de T05; PA-SUE-18). | `salaryScales` (M16) |
| `mode` | Enum | [VERIFICAR] | `percent`, `amount`. | — |
| `value` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `effectiveFrom` | Date | [VERIFICAR] | — | — |
| `rounding` | Object | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `preview` | [Object] | [VERIFICAR] | `{ categoryId\|extraItemId, current, pureBasic, new }`. | — |
| `resultingScaleId` | uniqueidentifier | [VERIFICAR] | — | `salaryScales` (M16) |
| `status` | Enum | Sí | `draft`, `applied`, `discarded`. | — |

**`externalPayrollImports`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `reference` | String | Sí | Ej. `NOM-DEMO-2026-11`. | — |
| `origin` | Object | [VERIFICAR] | — | — |
| `legalEntityId` | uniqueidentifier | Sí | — | `legalEntities` (T04) |
| `periodKey` | String | Sí | — | — |
| `payrollKind` | Enum | Sí | — | — |
| `fileRef` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `fileHash` | String | Sí | — | — |
| `layoutId` | uniqueidentifier | Sí | — | `externalPayrollLayouts` (M16) |
| `declaredTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `computedTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `lines` | [Object] | [VERIFICAR] | `{ externalConceptCode, mappedAccountId, costCenterId, serviceId, amount }`. | — |
| `employees` | [Object] | No | `{ cuil, fileNumber, net, cbu }` (opcional). | — |
| `status` | Enum | Sí | `uploaded`, `validated`, `rejected`, `approved`, `posted`, `paid`, `voided`. | — |
| `errors` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `approvedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |
| `accountingEntryRef` | uniqueidentifier | [VERIFICAR] | — | `journalEntries` (M15) |
| `paymentRequestId` | uniqueidentifier | [VERIFICAR] | — | `payrollPaymentRequests` (M16) |

**`externalPayrollLayouts`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `format` | Enum | [VERIFICAR] | `csv`, `xlsx`, `json`. | — |
| `fileLayoutId` | uniqueidentifier | [VERIFICAR] | Layout declarativo del motor de T06 (clave de T05; PA-SUE-18). | `fileLayouts` (T06) |
| `columns` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `conceptMappings` | [Object] | [VERIFICAR] | `{ externalCode, accountId, conceptType }`. | — |

### 7.45. Colecciones de plataforma consumidas (dueño T04 CFG / M06 FIS)

> **Definidas en T04 §7.17 (COL-CFG-44 a 53, RF-CFG-143; CTR-DAT-73).** `officialTableAdoptions` se absorbe en `platformTableAdoptions` de T04 (§7.10) y `holidays` es la colección de T04 §7.7. La tabla siguiente queda como descripción funcional del contenido que M16 consume; `statutoryFileLayouts` no está entre las absorbidas por T04 y sigue descrita aquí.

Tenant `PLATFORM`, con `source` (norma, resolución, URL), `validFrom`, `validTo`, `publishedAt`. El tenant registra su **adopción** (`officialTableAdoptions`: `tableKey`, `version`, `adoptedAt`, `adoptedBy`).

| Colección | Contenido | Origen ProCoop |
|---|---|---|
| `payrollOfficialCodes` | Tipos `activity`, `condition`, `contractMode`, `employmentStatus`, `accidentCode`, `sicossBenefit`, `employerType`, `zone`, `healthInsurer` (RNOS), `arcaConcept`, `terminationReason`, `liquidationType`: `{ type, code, name, attributes, validFrom, validTo }` | `SU_ACTIVIDADES`, `SU_CONDICION`, `SU_CONTRATACION`, `SU_SITUACION_REVISTA`, `SU_SINIESTRADO`, `SU_BENEFICIOS_SICOSS`, `SU_TIPOEMPLEADOR`, `SU_OBRA` (códigos) |
| `contributionRates` | Alícuotas de aportes y contribuciones por subsistema, régimen y tipo de empleador; detracción | Clasificaciones SICOSS y `Sistema_Afip` |
| `contributionBaseLimits` | Bases imponibles mínima y máxima por período (meses con y sin SAC) | P2437, P2438 |
| `minimumWages` | SMVM por vigencia (mensual, diario, por hora) | `SU_SALARIO_MINIMO` (`DESDE`, `SALARIO`) |
| `incomeTaxDeductionTables` | Deducciones por tipo, año y mes (`GAN_NO_IMP`, `CONYUGE`, `HIJO`, `OTROS`, `DED_ESP1`, `DED_ESP2`, `SEGURO`, `SEPELIO`, `IMP_DESDE`, `IMP_BRUTO_MINIMO`, `MES_DESDE_BRUTO`), tipos de deducción, deducción especial incrementada por sueldo promedio | `SU_DEDUCCIONES`, `SU_DEDUCCIONES_TIPOS`, `SU_DEDUCCIONES_ESPECIAL` |
| `incomeTaxScales` | Tramos por tipo, año y mes (`IMP_MIN`, `IMP_MAX`, `RET_PES`, `RET_POR`, `EXCEDENTE`) y tipos de escala | `SU_TRAMAS`, `SU_TRAMAS_TIPOS` |
| `incomeTaxRules` | Mínimo de remuneración bruta, criterio de promedio, inicio de acumulado, topes de deducciones generales, régimen SICORE | `clsGanancias` |
| `cedularTaxScales` | Escala del impuesto cedular (si se habilita) | Escala fija en `Impuesto_Cedular` |
| `garnishmentScales` | Escala de embargabilidad | — |
| `laborLawParameters` | Días de vacaciones art. 150, licencias art. 158, topes de horas extra, plazos de pago, límite art. 133 | — |
| `statutoryFileLayouts` | Diseños de LSD (registros 01-05), SICOSS, SICORE, F.1357/F.1359, archivos bancarios (M14) | `LibroSueldoDigital`, `ExportarArchivo*` |
| `holidays` | Feriados nacionales (y provinciales por provincia) | — |

## 8. Estados y transiciones

### 8.1. Legajo (`employees.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `preHire` | Liquidador / RRHH | Persona válida en M01 | Legajo creado sin liquidación | Eliminar lógico si no tiene recibos |
| `preHire` → `active` | RRHH | Fecha de ingreso, empresa, modalidad, situación de revista, constancia de alta registrada (advertencia) | `sue.employee.hired`; T02 vincula perfil empleado; disponible en cuadrillas | Volver a `preHire` si no hay recibos |
| `active` → `onLeave` | Sistema | Licencia aprobada de causa con reserva de puesto o > N días | Situación de revista de licencia | Automático al fin de la licencia |
| `active` → `suspended` | Sistema | Sanción de suspensión notificada | Situación de revista de suspensión; novedad sin goce | Al vencer la suspensión |
| `onLeave`/`suspended` → `active` | Sistema / RRHH | Fin de licencia o suspensión | Situación de revista activa | — |
| `active`/`onLeave`/`suspended` → `terminated` | Aprobador | Egreso aprobado (§8.9) | `sue.employee.terminated`; T02 revoca perfil al día siguiente; lista de tareas de egreso | Reincorporación (`terminated` → `active`) con aprobación; no borra historial |

### 8.2. Escala salarial y versión de configuración (`payrollConfigVersions.status`)

Estado inicial: alta → `draft` (PA-SUE-18).

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| `draft` → `inReview` | Configurador | Validación sin errores; simulación ejecutada | Notifica al aprobador | Volver a `draft` |
| `inReview` → `published` | Aprobador (≠ autor) | Diferencias revisadas; convenio validado | `sue.payrollConfig.published` con `effectiveFrom`; versión anterior `superseded` desde esa fecha | Publicar una versión nueva (no se despublica) |
| `inReview` → `draft` | Aprobador | — | Observaciones al autor | — |
| `draft` → `discarded` | Configurador | — | — | — |
| `published` → `superseded` | Sistema | Publicación de una versión nueva con `effectiveFrom` | La versión deja de aplicarse desde esa fecha | — |

> **Corrección 05-11-2026 (estados):** se agrega la fila de `published` a `superseded`, que el §8.2 solo mencionaba como efecto de la publicación y el §7 declara como valor de `payrollConfigVersions.status`. Estado inicial: `draft`.

### 8.3. Licencia (`leaveRequests.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `requested` | Empleado / RRHH | Sin superposición; días disponibles | Notifica al encargado | `cancelled` por el empleado |
| `requested` → `approvedBySupervisor` | Encargado | Causa con flujo de dos pasos | Notifica a RRHH | — |
| `requested`/`approvedBySupervisor` → `approved` | Encargado / RRHH | Sin superposición con autorizadas; días disponibles | Novedades por mes; situación de revista; saldo de vacaciones; `sue.leave.approved` | `cancelled` antes de iniciar: anula novedades no liquidadas |
| `requested`/`approvedBySupervisor` → `rejected` | Encargado / RRHH | Causa obligatoria | Notifica | — |
| `approved` → `interrupted` | RRHH | Licencia en curso (ej. vacaciones interrumpidas por enfermedad) | Ajusta novedades futuras y saldo | — |
| `requested`/`approvedBySupervisor`/`approved` → `cancelled` | Empleado / RRHH | Antes del inicio de la licencia | Anula las novedades no liquidadas | — |

> **Corrección 05-11-2026 (estados):** se agrega la fila hacia `cancelled`, que el §8.3 solo mencionaba en la columna Reversión y el §7 declara como valor de `leaveRequests.status`. Estado inicial: `requested`.

### 8.4. Novedad (`novelties.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `draft` | Liquidador / importación | Período abierto | — | `voided` |
| `draft` → `pendingApproval` | Liquidador | Tipo requiere aprobación | Bandeja del encargado | `draft` |
| `draft`/`pendingApproval` → `approved` | Encargado / liquidador | Tope anual no superado | Elegible para liquidar | `draft` mientras no esté liquidada |
| `pendingApproval` → `rejected` | Encargado | Motivo | — | — |
| `approved` → `settled` | Sistema | Recibo aprobado | `settledPayslipId` | Al anular el recibo vuelve a `approved` |
| `draft`/`approved` → `voided` | Liquidador | No liquidada | — | — |

### 8.5. Liquidación (`payrollRuns.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `draft` | Liquidador | Período abierto o en liquidación | Período pasa a `inPayroll` | `discarded` |
| `draft` → `calculating` | Liquidador | Universo definido | `JOB-SUE-01` | Cancelación del job → `draft` |
| `calculating` → `calculated` | Sistema | Todos los empleados procesados (con o sin error marcado) | Controles (RF-SUE-071); comparativo | Recalcular → `calculating` |
| `calculated` → `pendingApproval` | Liquidador | Sin controles bloqueantes; advertencias justificadas | Workflow T11 | `calculated` (retirar) |
| `pendingApproval` → `approved` | Aprobador (≠ calculador) | RN-SUE-065, RN-SUE-066 | Recibos numerados y emitidos (`JOB-SUE-03`); `sue.payrollRun.approved` → asiento M15; saldos de planes; novedades `settled` | `voided` (RN-SUE-067) |
| `pendingApproval` → `calculated` | Aprobador | Observaciones | — | — |
| `approved` → `paymentRequested` | Liquidador / tesorero | — | Solicitud a M14 | Anulación de la solicitud en M14 |
| `paymentRequested` → `paid` / `partiallyPaid` | Sistema (evento M14) | Acreditaciones confirmadas | Asiento de pago (M14/M15) | Rechazos → `partiallyPaid` |
| `paid` → `closed` | Aprobador | Presentaciones generadas | Período `closed` si todas las liquidaciones del período lo están | Reapertura del período (RN-SUE-068) |
| `approved` → `voided` | Aprobador | Sin pagos confirmados | Contraasiento; restituye saldos; novedades `approved` | — |
| `draft`/`calculated` → `discarded` | Liquidador | — | Sin efectos | — |

Las simulaciones (`mode = simulation`) solo recorren `draft` → `calculating` → `calculated` → `discarded` y se purgan a los 90 días (PRM-SUE-050).

### 8.6. Recibo (`payslips.status`)

Estado inicial: alta → `calculated` (PA-SUE-18).

`calculated` → `issued` (al aprobar la liquidación; PDF y numeración) → `sentForSignature` → `signedByEmployer` → `delivered` → `acknowledged` (firma o conformidad del empleado; o `acknowledgedWithDisagreement`). En paralelo `paymentStatus`: `pending` → `sent` → `credited` / `rejected` → (reintento) `credited`. `issued`/`delivered`/`acknowledged` → `voided` solo por rectificativa (`replacedByPayslipId`) o anulación de la liquidación no pagada; el PDF y la evidencia de firma se conservan.

Estado inicial de `payslips.paymentStatus`: alta → `pending` (PA-SUE-18).

### 8.7. Solicitud de pago (`payrollPaymentRequests.status`)

Estado inicial: alta → `draft` (PA-SUE-18).

`draft` → `submitted` (comando idempotente a M14) → `accepted` (M14 generó orden y archivo) → `settled` / `partiallySettled` / `rejected`; `submitted`/`accepted` → `cancelled` (comando de anulación a M14 confirmado). Un ítem rechazado puede reenviarse en una nueva solicitud con otra cuenta o medio.

### 8.8. Presentación (`statutoryFilings.status`)

Estado inicial: alta → `generated` (PA-SUE-18).

`generated` → `approved` (aprobador) → `filed` (usuario carga acuse) → `rectified` (se genera una rectificativa que la reemplaza). `generated` → `voided` (regenerar antes de aprobar).

### 8.9. Egreso (`terminations.status`)

Estado inicial: alta → `draft` (PA-SUE-18).

`draft` → `calculated` (liquidación final simulada) → `approved` (aprobador; emite `sue.termination.approved`; legajo `terminated` en la fecha) → `settled` (liquidación final pagada y certificados emitidos). `draft`/`calculated` → `cancelled`.

### 8.10. Liquidación externa (`externalPayrollImports.status`)

Estado inicial: alta → `uploaded` (PA-SUE-18).

`uploaded` → `validated` / `rejected` (duplicado, total no coincide, centros de costo inexistentes, conceptos sin cuenta) → `approved` (aprobador ≠ importador) → `posted` (asiento M15 confirmado) → `paid` (si se pidió pago). `approved`/`posted` → `voided` con contraasiento si no está pagada.

### 8.11. RRHH

- Estado inicial de `disciplinaryActions.status`: alta → `draft` (PA-SUE-18).
- Sanción (`disciplinaryActions.status`): `draft` → `notified` → `disputed` (descargo) → `firm` / `annulled`.
- Estado inicial de `administrativeInquiries.status`: alta → `open` (PA-SUE-18).
- Sumario (`administrativeInquiries.status`): `open` → `inDefense` → `resolved` → `archived`.
- Estado inicial de `workAccidents.status`: alta → `reported` (PA-SUE-18).
- Accidente (`workAccidents.status`): `reported` → `inTreatment` → `discharged` → `closed`; `reported` → `rejectedByArt` (pasa a enfermedad inculpable si corresponde).
- Estado inicial de `laborLawsuits.status`: alta → `active` (PA-SUE-18).
- Juicio (`laborLawsuits.status`): `active` → `settled` / `judgment` → `archived`.
- Estado inicial de `performanceCycles.status`: alta → `planned` (PA-SUE-18).
- Ciclo de evaluación (`performanceCycles.status`): `planned` → `open` → `calibration` → `closed`.

### 8.12. Tablas de transiciones agregadas (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** se agregan tablas de transiciones para las colecciones cuyo §7 enumeraba estados sin transiciones y se declaran los valores de las que tenían `status` sin valores. Los maestros toman `active`, `inactive` por la convención del §7 ("Los maestros usan `status` (`active`, `inactive`)"). Para `payslipNotifications`, `performanceReviews` y `objectives` los valores no se pueden deducir del anexo: se proponen con `[VERIFICAR]` (ver propuesta de PA en el informe de corrección). "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso; las transiciones sin respaldo explícito llevan `[VERIFICAR]`.

#### 8.12.1. Documentación del legajo (`employeeDocuments.status`)

Estado inicial: `pending`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `pending` | Carga del documento por el empleado o RRHH | RN-SUE-008 | — |
| `pending` | `authorized` | Autorización de RRHH (registra vencimiento) | RN-SUE-008 | — |
| `pending` | `rejected` | Rechazo de RRHH | RN-SUE-008 | — |
| `authorized` | `expired` | Vencimiento del documento (job) `[VERIFICAR]` | — | — |

#### 8.12.2. Plan de descuentos (`deductionPlans.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del plan (embargo, cuota, préstamo) | RN-SUE-063 (tope de deducciones voluntarias) | — |
| `active` | `suspended` | Suspensión manual u orden judicial `[VERIFICAR]` | — | — |
| `suspended` | `active` | Reanudación `[VERIFICAR]` | — | — |
| `active` | `completed` | Saldo cancelado con el último recibo | — | — |
| `active`, `suspended` | `cancelled` | Cancelación del plan `[VERIFICAR]` | — | — |

#### 8.12.3. Período de liquidación (`payPeriods.status`)

Estado inicial: `open`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Apertura del período | — | — |
| `open` | `inPayroll` | Primera liquidación calculada del período `[VERIFICAR]` | — | EVT-SUE-09 `sue.payrollRun.calculated` |
| `inPayroll` | `closed` | Cierre de las liquidaciones del período | — | EVT-SUE-13 `sue.payrollRun.closed` |
| `closed` | `reopened` | Reapertura con aprobación (`reopenings[].approvalId`) | — | — |
| `reopened` | `closed` | Nuevo cierre `[VERIFICAR]` | — | EVT-SUE-13 `sue.payrollRun.closed` |

#### 8.12.4. Declaración de Ganancias (`incomeTaxDeclarations.status`)

Estado inicial: `imported`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `imported` | Importación del F.572 / SIRADIG | RN-SUE-009 | — |
| `imported` | `applied` | Uso en el cálculo de Ganancias | — | — |
| `imported`, `applied` | `superseded` | Importación de una presentación posterior del mismo período | — | — |

#### 8.12.5. Certificado de trabajo (`employmentCertificates.status`)

Estado inicial: `requested`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `requested` | Solicitud del certificado (art. 80) | — | — |
| `requested` | `issued` | Emisión del certificado | — | EVT-SUE-21 `sue.certificate.issued` |
| `issued` | `delivered` | Entrega registrada en `delivery` | — | — |

#### 8.12.6. Aumento masivo (`salaryIncreaseBatches.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Armado del lote con vista previa | RN-SUE-014 (cálculo sobre el básico puro) | — |
| `draft` | `applied` | Aplicación (genera la escala `resultingScaleId`) | RN-SUE-014 | EVT-SUE-06 `sue.salaryScale.published` `[VERIFICAR]` |
| `draft` | `discarded` | Descarte del lote | — | — |

#### 8.12.7. Maestros (`employeePayAccounts`, `unions`, `salaryCategories`, `healthInsurerAdoptions`, `payrollVariables`, `payrollTypes`, `noveltyTypes`, `payrollAccountingRules`)

Valores: `active`, `inactive` (antes sin valores). Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del maestro | — | — |
| `active` | `inactive` | Baja lógica | — | — |
| `inactive` | `active` | Reactivación | — | — |

#### 8.12.8. Notificación de recibo (`payslipNotifications.status`)

Valores (asumidos en PA-SUE-17, DEC-072; antes "valores propuestos `[VERIFICAR]`"): `sent`, `viewed`, `signed`, `disagreed` (derivados de `sentAt`, `viewedAt`, `signedAt` y del tipo `disagreement`). Estado inicial: `sent`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `sent` | Envío de la notificación | — | — |
| `sent` | `viewed` | Apertura por el empleado | — | — |
| `sent`, `viewed` | `signed` | Firma de conformidad | — | EVT-SUE-15 `sue.payslip.acknowledged` |
| `sent`, `viewed` | `disagreed` | Firma en disconformidad con `note` | — | — |

#### 8.12.9. Evaluación de desempeño (`performanceReviews.status`)

Valores (asumidos en PA-SUE-17, DEC-072; antes "valores propuestos `[VERIFICAR]`"): `draft`, `inEvaluation`, `completed`, `acknowledged` (derivados de `evaluations[].submittedAt`, `feedbackAt` y `employeeAcknowledgedAt`). Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Apertura del ciclo para el empleado | — | — |
| `draft` | `inEvaluation` | Primera evaluación enviada | — | — |
| `inEvaluation` | `completed` | Devolución registrada (`feedbackAt`) | — | — |
| `completed` | `acknowledged` | Toma de conocimiento del empleado | — | — |

#### 8.12.10. Objetivo (`objectives.status`)

Valores (asumidos en PA-SUE-17, DEC-072; antes "valores propuestos `[VERIFICAR]`"): `draft`, `active`, `closed`, `cancelled`. Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Carga del objetivo | — | — |
| `draft` | `active` | Inicio del ciclo | — | — |
| `active` | `closed` | Registro de `finalAchievement` | — | — |
| `draft`, `active` | `cancelled` | Cancelación | — | — |

#### 8.12.11. Turno (`shifts.status`)

Estado inicial: `active` (corrección del 05-11-2026, PA-SUE-18).

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del turno | — | — |
| `active` | `inactive` | Baja lógica (sin asignaciones vigentes en `employeeShiftAssignments`) | — | — |
| `inactive` | `active` | Reactivación | — | — |

#### 8.12.12. Tarea extra (`extraTasks.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Registro de la tarea (manual o desde la OT) | — | — |
| `draft` | `confirmed` | Confirmación: genera las novedades de `noveltyIds` | — | — |
| `draft` | `voided` | Descarte | — | — |
| `confirmed` | `voided` | Anulación; anula las novedades no liquidadas | Novedades sin liquidar | — |

#### 8.12.13. Lote de importación de novedades (`noveltyImportBatches.status`)

Estado inicial: `uploaded`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `uploaded` | Carga del archivo o recepción del origen | `fileHash` no repetido | — |
| `uploaded` | `validated` | Validación de filas (`accepted`, `rejected`, `errors[]`) | — | — |
| `validated` | `confirmed` | Confirmación: crea las novedades aceptadas | Período abierto | — |
| `uploaded`, `validated` | `failed` | Error del job o rechazo total | — | — |

## 9. Procesos y flujos

### 9.1. Alta de empleado

1. RRHH busca la persona por CUIL/documento en M01 (RF-SUE-004); si no existe, la crea por el servicio de M01.
2. Completa datos laborales, empresa, convenio, categoría, área (con su centro de costo), distribución, turno, obra social, modalidad, situación de revista inicial, cuentas de acreditación y familiares.
3. Registra la constancia de alta en Simplificación Registral (número y fecha) — debe hacerse antes del inicio de la relación laboral.
4. Pasa el legajo a `active`; T02 crea o vincula el perfil empleado y envía invitación al portal si PRM-SUE-048 está activo.

### 9.2. Configuración y publicación (AGR-009)

1. El configurador crea un borrador de versión copiando la publicada.
2. Modifica conceptos, variables, escalas o tipos; el editor valida cada fórmula y sus dependencias (RN-SUE-021).
3. Ejecuta la simulación del último período liquidado con la versión en borrador (`JOB-SUE-02`) y obtiene el informe de diferencias por empleado y concepto.
4. Envía a revisión; el aprobador (≠ autor) revisa diferencias y publica con fecha efectiva. Publicación atómica.

### 9.3. Aplicar aumentos

1. Seleccionar objetivo (sindicato, convenio, categorías o grupo de extras), modo, valor, fecha efectiva y redondeo.
2. Previsualizar (básico actual, básico puro, nuevo; RN-SUE-014).
3. Confirmar: genera `salaryScales` en `draft` (o nuevos `employeeExtras`) y la aprobación correspondiente.
4. Al publicarse con fecha efectiva pasada, el sistema sugiere la liquidación complementaria de los períodos cerrados afectados (PA-SUE-14).

### 9.4. Novedades desde órdenes de trabajo, cuadrillas y flota (CU-104 paso 1)

1. M10 emite `tec.crewTimesheet.approved` (EVT-TEC-32) / `tec.workOrder.closed` (EVT-TEC-07) con integrantes, fechas, horas normales, extra y guardias; M18 emite `soc.vehicle.usageRecorded` (EVT-SOC-12) con conductor, horas, km y viáticos.
2. `JOB-SUE-07` (consumidor) arma novedades en borrador con `sourceRef` idempotente (RN-SUE-037), clasificando horas al 50 % o 100 % según día, feriado y turno del empleado (RN-SUE-048).
3. El encargado aprueba en su bandeja; el liquidador consolida. Si la OT se reabre y cambia, la novedad en borrador se actualiza; si ya se liquidó, se genera ajuste.
4. Con PRM-SUE-042/043 desactivados, el proceso solo corre a pedido desde la pantalla de importación.

### 9.5. Licencias

1. El empleado solicita desde la PWA (o RRHH en su nombre) con adjuntos; validaciones RN-SUE-038/040/041.
2. El encargado (y RRHH si la causa es sensible) autoriza o rechaza (RN-SUE-039); notificación por T09.
3. Al autorizar se generan novedades por mes, situación de revista y actualización del saldo (`JOB-SUE-12`).

### 9.6. Liquidación mensual o quincenal (CU-104 pasos 2 y 3)

1. El liquidador crea la liquidación: empresa, tipo, período, universo, fecha de pago y constancia del último depósito de aportes.
2. `JOB-SUE-01 sue:calcular-liquidacion` toma la instantánea de datos (RN-SUE-022), evalúa por empleado (RF-SUE-068/069), calcula Ganancias (RF-SUE-087), aportes y contribuciones (RF-SUE-096), embargos (RN-SUE-062) y guarda recibos `calculated` con traza. Procesa por lotes de 50 empleados, registra progreso, es reanudable y marca errores por empleado sin abortar el lote.
3. Se ejecutan los controles (RF-SUE-071) y el comparativo con el período anterior.
4. El liquidador corrige (novedades, recálculo individual) y envía a aprobación.
5. El aprobador revisa totales, comparativo, controles y la vista previa del asiento, y aprueba.
6. Efectos de la aprobación en una transacción con outbox: numeración de recibos, saldos de planes, novedades `settled`, `sue.payrollRun.approved` (M15 asienta por centro de costo), `JOB-SUE-03` (PDF), `JOB-SUE-04` (pide a T11 la firma del empleador), `JOB-SUE-05` (notificación a empleados).
7. Se solicita el pago a M14 (§9.9) y se generan las presentaciones (§9.8).

**Recuperación:** si el job cae, retoma desde el último empleado confirmado. **Cancelación:** el liquidador puede cancelar el cálculo; los recibos calculados quedan descartados. **Reintentos:** los consumidores de eventos (M15, M14) son idempotentes por `payrollRunId` + versión.

### 9.7. SAC, vacaciones, final, complementaria y rectificativa

- **SAC**: liquidación de tipo SAC (o concepto en la mensual) con función `sac` (RN-SUE-024, RN-SUE-057). Calendario: alerta 10 días antes del 30-06 y del 18-12.
- **Vacaciones**: al aprobarse una licencia de vacaciones, se propone liquidar al inicio del goce (RN-SUE-058).
- **Final por egreso**: se crea el egreso (§9.10), se simula la liquidación final con el modelo del motivo (RN-SUE-059), se aprueba y paga; se emiten certificados.
- **Complementaria**: liquida solo diferencias (nueva escala retroactiva, novedad tardía) informando el período de devengamiento; Ganancias recalcula el acumulado.
- **Rectificativa**: anula el recibo original (sin borrarlo), emite el nuevo con referencia y regenera presentaciones del período como rectificativas.

### 9.8. Ganancias y presentaciones

1. **F.572**: `JOB-SUE-08 sue:importar-siradig` procesa los XML exportados desde ARCA por la empresa; aplica la versión más reciente por empleado; genera novedades de otros empleos (RN-SUE-051/052).
2. **Mensual**: dentro de cada recibo (RF-SUE-087).
3. **Anual y final**: `JOB-SUE-09` al cierre del año fiscal (o en egreso): determina el impuesto anual, ajusta en el recibo correspondiente (retención o devolución) y emite el formulario informativo.
4. **LSD**: `JOB-SUE-10 sue:generar-lsd` por empresa y período; valida códigos de conceptos y registros; el aprobador lo aprueba; el usuario lo presenta en ARCA y carga el acuse.
5. **SICOSS**: `JOB-SUE-11 sue:generar-sicoss`; control de totales; el F.931 se obtiene en ARCA y su VEP se registra como obligación en M14.
6. **SICORE de sueldos** y **archivos sindicales**: `JOB-SUE-13`, `JOB-SUE-14`.

### 9.9. Pago de haberes (CU-104 paso 4)

1. Con la liquidación aprobada, el liquidador crea la solicitud de pago (netos) con fecha y medio; se arma un ítem por empleado y cuenta (RN-SUE-007).
2. Comando idempotente `tes.paymentRequest.create` a M14 (`Idempotency-Key` = `payrollRunId` + tipo + intento).
3. M14 genera la orden, el archivo bancario según `legalEntities.employer.bankAgreements` y el layout del banco, lo envía (Interbanking o archivo) y concilia.
4. M14 emite `tes.payrollPayment.confirmed` / `.rejected` (EVT-TES-17) con el estado por ítem; SUE actualiza `paymentSplit` de cada recibo.
5. Rechazados: el liquidador elige otra cuenta o medio y genera una nueva solicitud solo con esos ítems.
6. Obligaciones (F.931, sindicatos, embargos, seguro de vida): solicitudes de tipo propio con su período.

### 9.10. Egreso

1. RRHH crea el egreso con motivo y fechas; el sistema arma la lista de tareas (RF-SUE-125).
2. Liquidación final simulada y revisada; aprobación (≠ liquidador).
3. Al aprobar: legajo `terminated` en la fecha, `sue.employee.terminated` (T02 revoca, M13 controla devolución de equipos), baja de situación de revista, pendientes de baja registral y certificados art. 80 con fecha límite (PRM-SUE-054).

### 9.11. Importación de liquidación externa (CU-28, O8)

1. El importador sube el archivo con el layout configurado; `JOB-SUE-16` valida (RN-SUE-090/091, RF-SUE-141).
2. Si hay duplicado o el total no coincide, se detiene y pide conciliación (estado `rejected` con detalle).
3. El aprobador aprueba; se emiten `sue.externalPayroll.approved` (M15 asienta por cuenta y centro de costo) y, si tiene detalle de netos, la solicitud de pago a M14.

### 9.12. Jobs batch y su recuperación

Todos los jobs registran `progress`, son idempotentes por clave de negocio, reanudables y cancelables; los fallos se reintentan con backoff exponencial (3 intentos) y luego quedan en la bandeja de errores del módulo con notificación al liquidador. Ver tabla en §12.

## 10. Pantallas

Todas las pantallas de administración usan AdminShell, `AdminStickyHeader`, `ScreenHelp` (qué, quién, cuándo, dónde, por qué, cómo + caso de uso), `DataTable` con exportación XLSX/CSV/PDF y vistas guardadas, modales `sm/md/lg/xl`, `ConfirmDialog` y toasts. Los textos son claves `dict:sue.*`. Grupo del menú `siteMapGroups`: cluster **ERP** → grupo **Personal y sueldos** con subgrupos Administración, Procesos, Configuración, RRHH, Presentaciones e Informes (equivalente a la pestaña Sueldos de ProCoop: REL §1; `clsChequeosMenu.Opciones_Menu_Sueldo`). Importes en IBM Plex Mono.

| PAN-ID | App | Ruta | Capability | Propósito | Layout, filtros y columnas | Acciones y modales | Estado vacío / ayuda | Equivalencia ProCoop |
|---|---|---|---|---|---|---|---|---|
| PAN-SUE-01 | admin | `/sue` | `sue.reportes.ver` | Tablero de sueldos | Tarjetas: período actual por empresa y estado, liquidaciones pendientes de aprobar, recibos sin firmar, licencias pendientes, alertas (cambio de categoría, documentos vencidos, fin de prueba, certificados art. 80 vencidos, presentaciones pendientes), costo laboral del mes | Ir a cada bandeja | «Aún no hay empresas empleadoras» con botón Crear | — |
| PAN-SUE-02 | admin | `/sue/empleados` | `sue.legajos.ver` | Listado de empleados | Filtros: empresa, estado, convenio, categoría, área, centro de costo, encargado, texto (nombre, legajo, CUIL). Columnas: legajo, apellido y nombre, CUIL, empresa, categoría, área, ingreso, estado, cuenta OK, documentos vencidos | Nuevo (PAN-SUE-04), Importar Excel (wizard), Exportar, Ver ficha | «Sin empleados» + importar | Administración → Empleados (`Get_SU_EMPLEADOS`, `Get_LegajosEmpleados`) |
| PAN-SUE-03 | admin | `/sue/empleados/:id` | `sue.legajos.ver` | Ficha del legajo | Encabezado (foto, nombre, legajo, empresa, estado, antigüedad). Pestañas: Datos personales (M01), Laboral (vigente + historial), Centros de costo, Familiares, Cuentas, Documentación, Turnos, Situación de revista, Extras, Planes de descuento (S), Cuentas de servicio, Observaciones, Licencias y vacaciones, Novedades, Recibos, Ganancias, RRHH (S), Auditoría | Editar (modal lg por bloque con fecha efectiva), Cambiar categoría, Desvincular, Reincorporar, Emitir constancia | Pestañas sensibles muestran «Requiere permiso» | Ficha de empleado, ABM empleados y personas (P3081) |
| PAN-SUE-04 | admin | `/sue/empleados/nuevo` | `sue.legajos.crear` | Alta en asistente | Pasos: persona → empresa y laboral → seguridad social → pago → familiares → alta registral → resumen | Guardar borrador, Activar | — | Alta de empleado |
| PAN-SUE-05 | admin | `/sue/empresas` | `sue.estructura.configurar` | Empresas empleadoras | Columnas: código, razón social, CUIT, tipo, ART, agente de retención, empleados activos | Nueva/editar (modal xl con pestañas Datos, ART y seguro, Recibos y firma, Convenios bancarios, LSD), Importar empresa | — | Administración → Empresas |
| PAN-SUE-06 | admin | `/sue/config/sindicatos-convenios` | `sue.estructura.configurar` | Sindicatos y convenios | Dos pestañas con DataTable; convenio con validación y guardias | Nuevo, editar, registrar validación, retirar | — | Configuración → Sindicatos |
| PAN-SUE-07 | admin | `/sue/config/categorias-escalas` | `sue.estructura.configurar` | Categorías, escalas y antigüedad | Selector de convenio; grilla de categorías; línea de tiempo de escalas (borrador, publicada); tabla de antigüedad | Nueva escala, comparar escalas, enviar a aprobación | — | Configuración → Categorías, salario mínimo |
| PAN-SUE-08 | admin | `/sue/config/cargos-areas` | `sue.estructura.configurar` | Cargos y áreas | Áreas con centro de costo y servicios | ABM | — | Configuración → Cargos |
| PAN-SUE-09 | admin | `/sue/config/turnos` | `sue.estructura.configurar` | Turnos y jornadas | Turnos con horarios por día (editor semanal) | ABM, asignación masiva | — | Turnos (`Actualizar_TurnoDetalle`) |
| PAN-SUE-10 | admin | `/sue/config/obras-sociales` | `sue.estructura.configurar` | Obras sociales adoptadas y motivos de egreso | Dos pestañas | ABM con selector de código oficial | — | Configuración → Obras sociales, Desvinculación |
| PAN-SUE-11 | admin | `/sue/config/tablas-oficiales` | `sue.reportes.ver` | Consulta de tablas oficiales adoptadas | Por tabla: versión, fuente, vigencia, filas | Adoptar nueva versión (con `sue.estructura.configurar`) | — | Importación SICOSS, deducciones, tramas |
| PAN-SUE-12 | admin | `/sue/config/variables` | `sue.variables.configurar` | Variables | Columnas: nombre, tipo, fórmula, usado en | Nueva, editar con editor de fórmulas, renombrar | — | Configuración → Variables |
| PAN-SUE-13 | admin | `/sue/config/conceptos` | `sue.conceptos.configurar` | Conceptos y editor de fórmulas | Filtros: tipo, activo (PRM-SUE-017), tipo de liquidación, clasificación. Editor (modal xl): datos, fórmulas con árbol de catálogo, prueba sobre empleado ficticio o real (con permiso), asistente IA (propone), clasificaciones, cuentas | Nuevo, duplicar, validar, probar | — | Configuración → Conceptos; `frmEditorFormulas`, `frmAsistenteFormulas` |
| PAN-SUE-14 | admin | `/sue/config/tipos-liquidacion` | `sue.tiposLiquidacion.configurar` | Tipos de liquidación | Columnas del §7.23 | ABM | — | Tipos de recibo |
| PAN-SUE-15 | admin | `/sue/config/versiones` | `sue.configuracion.publicar` | Versiones de configuración | Lista de versiones; detalle con cambios, validación, diferencias de simulación | Crear borrador, simular, enviar, publicar, descartar | — | — (nuevo, AGR-009) |
| PAN-SUE-16 | admin | `/sue/config/aumentos` | `sue.aumentos.aplicar` | Aplicar aumentos | Formulario de objetivo y valor; previsualización | Previsualizar, generar escala | — | Configuración → Aplicar Aumentos |
| PAN-SUE-17 | admin | `/sue/config/tipos-novedad` | `sue.tiposNovedad.configurar` | Tipos de novedad y causas de licencia | Dos pestañas | ABM | — | Tipos de novedad, causas de licencia |
| PAN-SUE-18 | admin | `/sue/novedades` | `sue.novedades.ver` | Novedades del período | Selector empresa y período; grilla editable masiva (empleado × tipo); filtros por origen y estado | Agregar, aprobar seleccionadas, anular, ver origen (OT, viaje) | «Sin novedades para el período» | Novedades (`Get_NovedadesGridView`) |
| PAN-SUE-19 | admin | `/sue/novedades/importar` | `sue.novedades.importar` | Importación de novedades | ExcelImportWizard para Excel y anticipos; pestañas «Desde órdenes de trabajo», «Desde flota», «Desde fichadas» con período y vista previa | Generar propuestas, confirmar | — | `Importar_Novedades_Excel`, `ImportarArchivoAnticipos`, `ImportacionHoras` |
| PAN-SUE-20 | admin | `/sue/fichadas` | `sue.novedades.ver` | Fichadas y horarios | Por empleado y día: turno, fichadas, horas, diferencias | Cargar manual, procesar día, importar | — | Lector de fichadas, horarios |
| PAN-SUE-21 | admin | `/sue/tareas-extra` | `sue.novedades.crear` | Tareas extra | Columnas: tipo, cuenta, período, ejecutor, cantidad, unitario, total | Nueva, importar desde M03/M08/M10 | — | Tareas extra |
| PAN-SUE-22 | admin | `/sue/licencias` | `sue.licencias.ver` | Bandeja y calendario de licencias | Pestañas: Pendientes, Autorizadas, Calendario (por área/equipo), Saldos de vacaciones | Autorizar, rechazar (modal con causa), cargar en nombre de | — | Licencias (`LicenciasPendientes`, calendario) |
| PAN-SUE-23 | admin | `/sue/periodos` | `sue.liquidaciones.cerrar` | Períodos de sueldos | Por empresa: períodos y estados | Cerrar, reabrir (con aprobación) | — | Fecha de cierre de sueldos (P2376) |
| PAN-SUE-24 | admin | `/sue/liquidaciones` | `sue.liquidaciones.ver` | Liquidaciones | Filtros: empresa, período, tipo, estado. Columnas: número, tipo, período, empleados, neto, estado, calculó, aprobó | Nueva liquidación, simular | — | Procesos → Liquidación Masiva |
| PAN-SUE-25 | admin | `/sue/liquidaciones/:id` | `sue.liquidaciones.ver` | Detalle de liquidación | Encabezado con totales; pestañas: Recibos (grilla), Controles, Comparativo con período anterior, Vista previa de asiento, Pagos, Presentaciones, Historial | Calcular, recalcular empleado, enviar a aprobación, aprobar, anular, solicitar pago, generar presentaciones | — | Liquidación masiva, recibos |
| PAN-SUE-26 | admin | `/sue/simulador` | `sue.liquidaciones.simular` | Simulador | Selección de empleados, tipo, período, versión de configuración, novedades hipotéticas | Simular, comparar, exportar | — | Procesos → Simulador (`SimulacionRecibo`) |
| PAN-SUE-27 | admin | `/sue/recibos/:id` | `sue.recibos.ver` | Recibo | Vista del recibo con traza por renglón (modal), estado de firma y entrega, pagos, Ganancias del mes | Descargar PDF, reenviar notificación, rectificar | — | Administración → Recibos |
| PAN-SUE-28 | admin | `/sue/egresos` | `sue.egresos.crear` | Egresos y liquidación final | Lista; asistente: motivo, fechas, preaviso, cálculo, lista de tareas | Simular final, enviar a aprobación, emitir certificados | — | Desvinculación |
| PAN-SUE-29 | admin | `/sue/ganancias` | `sue.ganancias.ver` | Ganancias | Pestañas: Calculadora por empleado, F.572 importados, Liquidación anual/final, Diferencias mes a mes | Importar SIRADIG, recalcular, exportar Excel, emitir formulario anual | — | Procesos → Impuesto a las Ganancias |
| PAN-SUE-30 | admin | `/sue/presentaciones` | `sue.presentaciones.generar` | Presentaciones | Por empresa y período: LSD, SICOSS, SICORE, F.1357/F.1359, sindicatos, ART; estado y controles | Generar, aprobar, descargar, cargar acuse, rectificar | — | Libro sueldo digital, exportaciones SICOSS, SICORE, F.1357, F.1359, sindicatos |
| PAN-SUE-31 | admin | `/sue/pagos` | `sue.pagos.ver` | Pago de haberes | Solicitudes con estado e ítems; rechazados | Nueva solicitud, reintentar rechazados, anular | — | Pago de sueldos, exportaciones bancarias |
| PAN-SUE-32 | admin | `/sue/config/contabilidad` | `sue.reglasContables.configurar` | Reglas de imputación contable | Reglas con prioridad y filtros; validación de cuentas sin asignar | ABM, simular asiento de una liquidación | — | Configuración de asientos de sueldos (`SU_ASIENTOS`, `GridViewAsientos`) |
| PAN-SUE-33 | admin | `/sue/certificados` | `sue.certificados.emitir` | Certificados y constancias | Pendientes con vencimiento; emitidos | Emitir, entregar | — | — |
| PAN-SUE-34 | admin | `/sue/rrhh/evaluaciones` | `sue.rrhh.evaluaciones.ver` | Evaluaciones y objetivos | Plantillas, ciclos, avance, resultados | Crear ciclo, cerrar, calibrar | — | — (GLM) |
| PAN-SUE-35 | admin | `/sue/rrhh/disciplina` | `sue.rrhh.sanciones.ver` | Sanciones y sumarios | Dos pestañas | Nueva sanción, notificar, abrir sumario, resolver | — | — (GLM) |
| PAN-SUE-36 | admin | `/sue/rrhh/accidentes` | `sue.rrhh.accidentes.ver` | Accidentes y ART | Columnas: empleado, fecha, tipo, siniestro ART, días ILT, estado | Denunciar, vincular licencia, registrar reintegro, alta | — | ART / siniestros |
| PAN-SUE-37 | admin | `/sue/rrhh/juicios` | `sue.rrhh.juicios.ver` | Juicios laborales | Columnas: expediente, actor, monto reclamado, provisión, estado | Nuevo, actualizar provisión, vincular expediente M08 | — | — (GLM) |
| PAN-SUE-38 | admin | `/sue/informes` | `sue.reportes.ver` | Informes de sueldos | Catálogo del §15 con filtros comunes | Ejecutar, exportar, programar | — | Informes → Informes de Sueldos |
| PAN-SUE-39 | admin | `/sue/importacion-externa` | `sue.importacionExterna.ver` | Liquidación externa (CU-28) | Lotes con estado; asistente de carga y validación; layouts | Importar, aprobar, anular | — | — (nuevo) |
| PAN-SUE-40 | admin | `/sue/paralelo` | `sue.liquidaciones.ver` | Paralelo ProCoop | Comparativo por empleado y concepto | Cargar archivo legado, comparar | — | — |
| PAN-SUE-41 | pwa-empleado | `/empleado/recibos` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/recibos` y `/app/empleado/recibos/:id` (PAN-POR-70, PAN-POR-71), que incrusta esta pantalla; PA-SUE-16) | `sue.portal.recibos.ver` | Mis recibos | Cards por período (neto, estado de firma) | Ver PDF, firmar/conformidad (OTP), disconformidad con nota | 3 skeleton cards; «Aún no tenés recibos» | Portal procoop.ar (recibos) |
| PAN-SUE-42 | pwa-empleado | `/empleado/licencias` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/vacaciones` y `/app/empleado/licencias` (PAN-POR-72, PAN-POR-73), que incrusta esta pantalla; PA-SUE-16) | `sue.portal.licencias.solicitar` | Vacaciones y licencias | Saldo por año; solicitudes con estado | FAB «+» abre modal de solicitud (causa, fechas, adjuntos) | — | Solicitud de licencia (`SolicitarLicencia`) |
| PAN-SUE-43 | pwa-empleado | `/empleado/datos` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/legajo` (PAN-POR-74), que incrusta esta pantalla; PA-SUE-16) | `sue.portal.datos.ver` | Mis datos y documentos | Datos laborales (lectura), familiares, cuentas, documentos | Proponer cambio, subir documento | — | Documentación del empleado |
| PAN-SUE-44 | pwa-empleado | `/empleado/equipo` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/equipo` con acceso desde PAN-POR-69 e incrusta esta pantalla sin PAN-POR propia (M19 §10.3 y §10.6.A); PA-SUE-16) | `sue.equipo.ver` | Mi equipo (encargado) | Operarios, licencias y novedades pendientes, calendario | Aprobar, rechazar | — | Encargado (`Get_OperariosPorEncargado`) |
| PAN-SUE-45 | pwa-empleado | `/empleado/certificados` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/certificados` con acceso desde PAN-POR-69 e incrusta esta pantalla sin PAN-POR propia (M19 §10.3 y §10.6.A); PA-SUE-16) | `sue.portal.certificados.ver` | Mis certificados y constancias | Lista | Pedir constancia, descargar | — | — |
| PAN-SUE-46 | pwa-empleado | `/empleado/evaluaciones` (ruta de referencia de M16, dueño del contenido; M19 la publica como `/app/empleado/evaluaciones` con acceso desde PAN-POR-69 e incrusta esta pantalla sin PAN-POR propia (M19 §10.3 y §10.6.A); PA-SUE-16) | `sue.portal.evaluaciones.autoevaluar` | Mis evaluaciones y objetivos | Ciclos abiertos, objetivos | Autoevaluar, registrar avance | — | — |
| PAN-SUE-47 | plataforma | `/platform/tablas-sueldos` | `pla.tablasSueldos.editar` | Tablas oficiales de sueldos y Ganancias (pantalla de T04, especificada aquí por su contenido) | Por tabla: versiones, fuente, vigencia | Nueva versión, importar desde ARCA, publicar | — | Importar SICOSS, deducciones, tramas |

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …".

Todas con `tenantId` del token, paginación `?page=&size=`, errores RFC 9457 y Zod compartido. Idempotente = requiere `Idempotency-Key`.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-SUE-01 | GET | `/api/admin/sue/employers` | `sue.estructura.configurar` | Listar empresas. Reemplazado por API-CFG-55 de T04 (`GET /api/admin/cfg/legal-entities`, filtro con `employer`; CTR-DAT-06). | — |
| API-SUE-02 | POST/PATCH | `/api/admin/sue/employers[/:id]` | `sue.estructura.configurar` | Crear/editar empresa. Reemplazado por API-CFG-55 de T04 (`PATCH /api/admin/cfg/legal-entities/:id/employer`; la entidad se crea en T04; CTR-DAT-06). | Sí (POST) |
| API-SUE-03 | GET | `/api/admin/sue/employees` | `sue.legajos.ver` | Listar legajos con filtros | — |
| API-SUE-04 | GET | `/api/admin/sue/employees/:id` | `sue.legajos.ver` | Ficha (secciones sensibles según permiso) | — |
| API-SUE-05 | POST | `/api/admin/sue/employees` | `sue.legajos.crear` | Alta (con búsqueda/creación de persona) | Sí |
| API-SUE-06 | PATCH | `/api/admin/sue/employees/:id` | `sue.legajos.editar` | Editar datos no vigentes | — |
| API-SUE-07 | POST | `/api/admin/sue/employees/:id/assignments` | `sue.legajos.editar` | Cambio laboral con fecha efectiva | Sí |
| API-SUE-08 | PUT | `/api/admin/sue/employees/:id/cost-allocations` | `sue.legajos.editar` | Distribución por centros de costo | — |
| API-SUE-09 | GET/POST/PATCH | `/api/admin/sue/employees/:id/family-members[/:fid]` | `sue.familiares.editar` | Familiares | — |
| API-SUE-10 | GET/POST/PATCH | `/api/admin/sue/employees/:id/pay-accounts[/:aid]` | `sue.cuentasPago.editar` | Cuentas de acreditación | — |
| API-SUE-11 | GET/POST | `/api/admin/sue/employees/:id/documents` | `sue.legajos.editar` | Documentación | — |
| API-SUE-12 | POST | `/api/admin/sue/employee-documents/:docId/authorize` · `/reject` | `sue.documentos.autorizar` | Autorizar/rechazar documento | Sí |
| API-SUE-13 | GET/POST | `/api/admin/sue/employees/:id/notes` | `sue.legajos.editar` | Observaciones | — |
| API-SUE-14 | PUT | `/api/admin/sue/employees/:id/shifts` | `sue.legajos.editar` | Turnos asignados | — |
| API-SUE-15 | POST | `/api/admin/sue/employees/:id/employment-status` | `sue.legajos.editar` | Situación de revista | — |
| API-SUE-16 | PUT | `/api/admin/sue/employees/:id/extras` | `sue.legajos.editar` | Extras | — |
| API-SUE-17 | GET/POST/PATCH | `/api/admin/sue/employees/:id/deduction-plans[/:pid]` | `sue.legajos.editar` + `sue.datosSensibles.ver` para datos judiciales | Planes de descuento | Sí (POST) |
| API-SUE-18 | PUT | `/api/admin/sue/supervision-links` | `sue.legajos.editar` | Encargados y operarios | — |
| API-SUE-19 | POST | `/api/admin/sue/employees/import` | `sue.legajos.crear` | Importación Excel (preview/confirm) | Sí |
| API-SUE-20 | POST | `/api/admin/sue/employees/:id/reinstate` | `sue.legajos.editar` | Reincorporar | Sí |
| API-SUE-21 | CRUD | `/api/admin/sue/unions` | `sue.estructura.configurar` | Sindicatos | — |
| API-SUE-22 | CRUD | `/api/admin/sue/labor-agreements` | `sue.estructura.configurar` | Convenios (+ `/:id/validate`) | — |
| API-SUE-23 | CRUD | `/api/admin/sue/categories` | `sue.estructura.configurar` | Categorías | — |
| API-SUE-24 | CRUD | `/api/admin/sue/salary-scales` (+ `/:id/submit`, `/:id/approve`) | `sue.estructura.configurar` / `sue.escalas.aprobar` | Escalas | Sí (approve) |
| API-SUE-25 | CRUD | `/api/admin/sue/seniority-scales` | `sue.estructura.configurar` | Antigüedad | — |
| API-SUE-26 | CRUD | `/api/admin/sue/positions` · `/work-areas` · `/shifts` | `sue.estructura.configurar` | Cargos, áreas, turnos | — |
| API-SUE-27 | CRUD | `/api/admin/sue/health-insurers` · `/termination-reasons` | `sue.estructura.configurar` | Obras sociales, motivos | — |
| API-SUE-28 | GET | `/api/admin/sue/official-tables/:key` | `sue.reportes.ver` | Tablas oficiales adoptadas | — |
| API-SUE-29 | POST | `/api/admin/sue/official-tables/:key/adopt` | `sue.estructura.configurar` | Adoptar versión | Sí |
| API-SUE-30 | CRUD | `/api/admin/sue/variables` | `sue.variables.configurar` | Variables (+ `/:id/rename`) | — |
| API-SUE-31 | CRUD | `/api/admin/sue/concepts` | `sue.conceptos.configurar` | Conceptos | — |
| API-SUE-32 | POST | `/api/admin/sue/formulas/validate` | `sue.conceptos.configurar` | Validar fórmula y dependencias | — |
| API-SUE-33 | POST | `/api/admin/sue/formulas/test` | `sue.conceptos.simular` | Probar fórmula sobre un empleado | — |
| API-SUE-34 | POST | `/api/admin/sue/formulas/assist` | `sue.conceptos.configurar` | Sugerencia de IA (sin datos personales) | — |
| API-SUE-35 | CRUD | `/api/admin/sue/payroll-types` | `sue.tiposLiquidacion.configurar` | Tipos de liquidación | — |
| API-SUE-36 | GET/POST | `/api/admin/sue/config-versions` | `sue.conceptos.configurar` | Versiones | — |
| API-SUE-37 | POST | `/api/admin/sue/config-versions/:id/simulate` · `/submit` · `/publish` · `/discard` | `sue.conceptos.simular` / `sue.configuracion.publicar` | Ciclo de versión | Sí |
| API-SUE-38 | POST | `/api/admin/sue/salary-increases` (+ `/:id/preview`, `/:id/apply`) | `sue.aumentos.aplicar` | Aplicar aumentos | Sí |
| API-SUE-39 | CRUD | `/api/admin/sue/novelty-types` · `/leave-causes` | `sue.tiposNovedad.configurar` / `sue.causasLicencia.configurar` | Tipos | — |
| API-SUE-40 | GET/POST/PATCH | `/api/admin/sue/novelties` | `sue.novedades.ver` (GET), `sue.novedades.crear` (POST), `sue.novedades.editar` (PATCH) (antes: `sue.novedades.ver/crear/editar`) | Novedades | Sí (POST) |
| API-SUE-41 | POST | `/api/admin/sue/novelties/approve` · `/void` | `sue.novedades.aprobar` / `editar` | Acciones masivas | Sí |
| API-SUE-42 | POST | `/api/admin/sue/novelty-imports` (+ `/:id/confirm`) | `sue.novedades.importar` | Importar (Excel, OT, flota, fichadas, anticipos) | Sí |
| API-SUE-43 | GET/POST | `/api/admin/sue/time-punches` (+ `/process`) | `sue.novedades.crear` | Fichadas | Sí |
| API-SUE-44 | CRUD | `/api/admin/sue/extra-tasks` | `sue.novedades.crear` | Tareas extra | — |
| API-SUE-45 | GET/POST | `/api/admin/sue/leave-requests` | `sue.licencias.ver` | Licencias (admin) | Sí (POST) |
| API-SUE-46 | POST | `/api/admin/sue/leave-requests/:id/approve` · `/reject` · `/interrupt` | `sue.licencias.autorizar` | Decisiones | Sí |
| API-SUE-47 | GET | `/api/admin/sue/vacation-balances` | `sue.licencias.ver` | Saldos | — |
| API-SUE-48 | GET/POST | `/api/admin/sue/pay-periods` (+ `/:id/close`, `/:id/reopen`) | `sue.liquidaciones.cerrar` | Períodos | Sí |
| API-SUE-49 | GET/POST | `/api/admin/sue/payroll-runs` | `sue.liquidaciones.ver` (GET), `sue.liquidaciones.crear` (POST) (antes: `sue.liquidaciones.ver/crear`) | Liquidaciones | Sí (POST) |
| API-SUE-50 | POST | `/api/admin/sue/payroll-runs/:id/calculate` | `sue.liquidaciones.calcular` | Lanzar cálculo (job) | Sí |
| API-SUE-51 | POST | `/api/admin/sue/payroll-runs/:id/employees/:eid/recalculate` | `sue.liquidaciones.calcular` | Recalcular empleado | Sí |
| API-SUE-52 | POST | `/api/admin/sue/payroll-runs/:id/submit` · `/approve` · `/return` · `/void` · `/close` | `sue.liquidaciones.calcular` (`/submit`), `sue.liquidaciones.aprobar` (`/approve`, `/return`), `sue.liquidaciones.anular` (`/void`), `sue.liquidaciones.cerrar` (`/close`) (antes: según acción) | Ciclo de la liquidación | Sí |
| API-SUE-53 | GET | `/api/admin/sue/payroll-runs/:id/checks` · `/comparison` · `/accounting-preview` | `sue.liquidaciones.ver` | Controles, comparativo, vista previa de asiento | — |
| API-SUE-54 | POST | `/api/admin/sue/simulations` | `sue.liquidaciones.simular` | Simulación | — |
| API-SUE-55 | GET | `/api/admin/sue/payslips` · `/:id` · `/:id/pdf` · `/:id/trace` | `sue.recibos.ver` (+ `sue.remuneraciones.ver` para ajenos) | Recibos | — |
| API-SUE-56 | POST | `/api/admin/sue/payslips/:id/resend` · `/rectify` | `sue.recibos.emitir` | Reenviar, rectificar | Sí |
| API-SUE-57 | POST | `/api/admin/sue/signature-batches` | `sue.recibos.emitir` | Lote de firma del empleador (crea las solicitudes en T11 por API-WFL-75) | Sí |
| API-SUE-58 | POST | `/api/admin/sue/terminations` (+ `/:id/simulate`, `/:id/approve`, `/:id/cancel`) | `sue.egresos.crear` / `aprobar` | Egresos | Sí |
| API-SUE-59 | GET | `/api/admin/sue/income-tax/employees/:id/calculator` | `sue.ganancias.ver` | Calculadora | — |
| API-SUE-60 | POST | `/api/admin/sue/income-tax/f572-imports` | `sue.ganancias.importarF572` | Importar SIRADIG | Sí |
| API-SUE-61 | POST | `/api/admin/sue/income-tax/annual-settlements` | `sue.ganancias.calcular` | Liquidación anual | Sí |
| API-SUE-62 | GET | `/api/admin/sue/income-tax/differences` | `sue.ganancias.ver` | Diferencias mes a mes (XLSX) | — |
| API-SUE-63 | POST | `/api/admin/sue/filings` | `sue.presentaciones.generar` | Generar LSD, SICOSS, SICORE, F.1357/F.1359, sindicatos, ART | Sí |
| API-SUE-64 | POST | `/api/admin/sue/filings/:id/approve` · `/acknowledge` · `/rectify` | `sue.presentaciones.aprobar` | Aprobar, cargar acuse, rectificar | Sí |
| API-SUE-65 | GET | `/api/admin/sue/filings/:id/file` | `sue.presentaciones.ver` | Descargar archivo (URL firmada) | — |
| API-SUE-66 | POST | `/api/admin/sue/payment-requests` (+ `/:id/cancel`, `/:id/retry-rejected`) | `sue.pagos.solicitar` | Pago de haberes y obligaciones | Sí |
| API-SUE-67 | GET | `/api/admin/sue/payment-requests` | `sue.pagos.ver` | Seguimiento | — |
| API-SUE-68 | CRUD | `/api/admin/sue/accounting-rules` (+ `/validate`) | `sue.reglasContables.configurar` | Reglas contables | — |
| API-SUE-69 | GET/POST | `/api/admin/sue/certificates` (+ `/:id/issue`) | `sue.certificados.emitir` | Certificados y constancias | Sí |
| API-SUE-70 | CRUD | `/api/admin/sue/hr/performance-templates` · `/cycles` · `/reviews` · `/objectives` | `sue.rrhh.evaluaciones.ver` (GET), `sue.rrhh.evaluaciones.editar` (POST, PATCH, DELETE); `sue.rrhh.objetivos.ver` (GET), `sue.rrhh.objetivos.editar` (POST, PATCH, DELETE) (antes `sue.rrhh.evaluaciones.*` / `objetivos.*`) | Evaluaciones y objetivos | — |
| API-SUE-71 | CRUD | `/api/admin/sue/hr/disciplinary-actions` · `/inquiries` | `sue.rrhh.sanciones.ver` (GET), `sue.rrhh.sanciones.editar` (POST, PATCH, DELETE); `sue.rrhh.sumarios.ver` (GET), `sue.rrhh.sumarios.editar` (POST, PATCH, DELETE) (antes `sue.rrhh.sanciones.*` / `sumarios.*`) | Disciplina | — |
| API-SUE-72 | CRUD | `/api/admin/sue/hr/work-accidents` | `sue.rrhh.accidentes.ver` (GET), `sue.rrhh.accidentes.editar` (POST, PATCH, DELETE) (antes `sue.rrhh.accidentes.*`) | Accidentes | — |
| API-SUE-73 | CRUD | `/api/admin/sue/hr/labor-lawsuits` | `sue.rrhh.juicios.ver` (GET), `sue.rrhh.juicios.editar` (POST, PATCH, DELETE) (antes `sue.rrhh.juicios.*`) | Juicios | — |
| API-SUE-74 | GET | `/api/admin/sue/reports/:reportKey` | `sue.reportes.ver` / `exportar` | Informes del §15 | — |
| API-SUE-75 | POST | `/api/admin/sue/external-payrolls` (+ `/:id/approve`, `/:id/void`) | `sue.importacionExterna.importar` / `aprobar` | CU-28 | Sí |
| API-SUE-76 | CRUD | `/api/admin/sue/external-payroll-layouts` | `sue.importacionExterna.importar` | Layouts y mapeos | — |
| API-SUE-77 | POST | `/api/admin/sue/parallel-comparisons` | `sue.liquidaciones.ver` | Paralelo | Sí |
| API-SUE-78 | GET | `/api/sue/me/payslips` · `/:id/pdf` | `sue.portal.recibos.ver` | Mis recibos | — |
| API-SUE-79 | POST | `/api/sue/me/payslips/:id/viewed` | `sue.portal.recibos.ver` | Constancia de visto; la firma, la firma en disconformidad y el rechazo se hacen en T11 (API-WFL-77 a API-WFL-79, PAN-WFL-27) | Sí |
| API-SUE-80 | GET/POST | `/api/sue/me/leave-requests` · `/me/vacation-balance` | `sue.portal.licencias.solicitar` | Licencias propias | Sí (POST) |
| API-SUE-81 | GET/POST | `/api/sue/me/profile` · `/me/change-requests` · `/me/documents` | `sue.portal.datos.ver` (GET), `sue.portal.datos.editar` (POST `/me/change-requests`; nueva), `sue.portal.documentos.subir` (POST `/me/documents`) (antes `sue.portal.datos.*`) | Datos y documentos | Sí (POST) |
| API-SUE-82 | GET/POST | `/api/sue/me/certificates` | `sue.portal.certificados.ver` | Constancias | Sí (POST) |
| API-SUE-83 | GET/POST | `/api/sue/team/leave-requests` · `/team/novelties` (+ decisiones) | `sue.equipo.ver`, `sue.licencias.autorizar` | Encargado | Sí |
| API-SUE-84 | GET/POST | `/api/sue/me/reviews` · `/me/objectives` | `sue.portal.evaluaciones.autoevaluar` | Evaluaciones propias | — |
| API-SUE-85 | GET | `/api/public/:tenantSlug/sue/verify/:code` | `public: true` (RF-IAM-061) (antes: pública) | Verificación de constancia/recibo por código (sin datos sensibles) | — |
| API-SUE-86 | GET | `/api/v1/ext/sue/labor-cost` | `sue.costoLaboral.ver` (token de tercero; antes alcance `sue.costoLaboral`, sin acción; T02; PA-SUE-18) | Costo laboral agregado por centro de costo (sin datos personales) | — |
| API-SUE-87 | CRUD | `/api/platform/sue/official-tables/:key` (+ `/publish`) | `pla.tablasSueldos.editar` | Tablas oficiales (servicio de T04) | Sí |

## 12. Eventos y jobs

### 12.1. Eventos emitidos (outbox, misma transacción)

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-SUE-01 | `sue.employee.hired` | Legajo pasa a `active` | T02 (perfil empleado), M10 (cuadrillas), T09 (audiencia «empleados») |
| EVT-SUE-02 | `sue.employee.assignmentChanged` | Cambio laboral con fecha efectiva | M10, T10 |
| EVT-SUE-03 | `sue.employee.terminated` | Egreso aprobado (fecha de egreso) | T02 (revocación), M13 (equipos asignados), M10, T09 |
| EVT-SUE-04 | `sue.employee.reinstated` | Reincorporación | T02, M10 |
| EVT-SUE-05 | `sue.payrollConfig.published` | Publicación de versión | T10 (auditoría), SUE (sugerir complementaria) |
| EVT-SUE-06 | `sue.salaryScale.published` | Escala publicada | SUE, M15 (proyección) |
| EVT-SUE-07 | `sue.novelty.approved` | Novedad aprobada | T10 |
| EVT-SUE-08 | `sue.leave.requested` / `sue.leave.approved` / `sue.leave.rejected` | Ciclo de licencia | T09 (notificación), M10 (disponibilidad de agenda) |
| EVT-SUE-09 | `sue.payrollRun.calculated` | Cálculo terminado | T09 (aviso al liquidador) |
| EVT-SUE-10 | `sue.payrollRun.submitted` | Enviada a aprobación | T11 (bandeja) |
| EVT-SUE-11 | `sue.payrollRun.approved` | Aprobación (con líneas de imputación por cuenta, centro de costo, servicio y plan) | M15 (asiento de devengamiento), T10 |
| EVT-SUE-12 | `sue.payrollRun.voided` | Anulación | M15 (contraasiento) |
| EVT-SUE-13 | `sue.payrollRun.closed` | Cierre | T10 |
| EVT-SUE-14 | `sue.payslip.issued` | Recibo emitido | T09 (notificación «recibo disponible») |
| EVT-SUE-15 | `sue.payslip.acknowledged` | Firma o conformidad del empleado | T10 |
| EVT-SUE-16 | `sue.payslip.voided` | Rectificación | T09 |
| EVT-SUE-17 | `sue.paymentRequest.created` (comando `tes.paymentRequest.create`) | Solicitud de pago | M14 |
| EVT-SUE-18 | `sue.filing.generated` / `sue.filing.filed` | Presentaciones | M14 (VEP como obligación), T10 |
| EVT-SUE-19 | `sue.incomeTax.annualSettled` | Liquidación anual | T09 (formulario disponible) |
| EVT-SUE-20 | `sue.termination.approved` | Egreso aprobado | M13, T02, SUE (certificados) |
| EVT-SUE-21 | `sue.certificate.issued` | Certificado emitido | T09 |
| EVT-SUE-22 | `sue.accident.reported` | Accidente denunciado | T09 (RRHH), T10 |
| EVT-SUE-23 | `sue.lawsuit.provisionChanged` | Cambio de provisión de juicio | M15 (provisión), M08 (expediente) |
| EVT-SUE-24 | `sue.externalPayroll.approved` | Liquidación externa aprobada | M15 (asiento), M14 (pago) |
| EVT-SUE-25 | `sue.laborCost.projected` | Proyección de costo publicada | M15 (presupuesto, AGR-028) |
| EVT-SUE-26 | `sue.serviceDebt.deducted` | Descuento de deuda de servicios en recibo aprobado | M07 (cobro imputado) — solo con PA-SUE-06 |
| EVT-SUE-27 | `sue.paymentRequest.cancelled` | Anulación de un pedido de pago de sueldos aún no ejecutado (payload: `paymentRequestId`, `reason`) | M14 (anula el lote) |
| EVT-SUE-28 | `sue.payrollFiles.requested` | Pedido de generación de un archivo de presentación (LSD, SICOSS/F.931 u otro `kind` de `statutoryFilings`) por empresa y período (JOB-SUE-10, API-SUE-63; payload: `statutoryFilingId`, `legalEntityId`, `kind`, `periodKey`, `payrollRunIds`) | T06 (aplica el diseño oficial vigente y deja el archivo descargable, FI-INT-16; la presentación en ARCA y el acuse siguen manuales, RN-SUE-080) |

### 12.2. Eventos consumidos

| Evento | Productor | Efecto en SUE |
|---|---|---|
| `tec.crewTimesheet.approved` (EVT-TEC-32), `tec.workOrder.closed` (EVT-TEC-07), `tec.workOrder.reopened` (EVT-TEC-09) | M10 | Proponer / actualizar novedades (JOB-SUE-07) |
| `soc.vehicle.usageRecorded` (EVT-SOC-12), `soc.vehicle.usageVoided` (EVT-SOC-17, pendiente de declarar en M18) | M18 | Proponer / retirar novedades de flota |
| `med.readingBatch.closed` (EVT-MED-07), `mor.interruption.executed` (EVT-MOR-13), `tec.reconnection.executed` (EVT-TEC-19) | M03, M08, M10 | Tareas extra por ejecutor |
| `tes.payrollPayment.confirmed` / `.rejected` (EVT-TES-17) | M14 | Estados de pago por ítem |
| `tes.advance.paid` (EVT-TES-23) | M14 | Plan de descuento de adelanto |
| `con.entry.posted` (EVT-CON-01) / `con.event.failed` (EVT-CON-05) | M15 | Vínculo asiento ↔ liquidación; error a la bandeja |
| `con.period.closed` | M15 | Bloquea reabrir liquidaciones del período contable |
| `per.person.updated` | M01 | Refresca proyecciones del legajo (domicilio y datos para recibos futuros) |
| `iam.membership.activated` (EVT-IAM-03) | T02 | Con `membershipId` e `identityId` del payload completa `employees.userAccountId` del empleado vinculado (antes el efecto decía solo `employees.userAccountId`). |
| `cfg.platformTable.updated` (EVT-CFG-10) | T04 | Alerta de nueva versión a adoptar |
| `wfl.approval.decided` | T11 | Ejecuta la transición aprobada o rechazada |
| `wfl.signature.requested` / `.participantSigned` (EVT-WFL-041), `wfl.signature.completed` (EVT-WFL-042), `wfl.signature.rejected` / `.expired` / `.cancelled` (EVT-WFL-043) | T11 | Con `signatureRequestId`, `participantId` y `level` (EVT-WFL-041), `signedVersionId` y `sourceRef` (EVT-WFL-042) o `reason` (EVT-WFL-043) actualiza el estado de firma del recibo; con la firma del empleado publica EVT-SUE-15 |

### 12.3. Jobs

| JOB-ID | Nombre | Disparo / frecuencia | Descripción |
|---|---|---|---|
| JOB-SUE-01 | `sue:calcular-liquidacion` | A pedido | Cálculo por lotes de 50 empleados, reanudable (§9.6). |
| JOB-SUE-02 | `sue:simular-configuracion` | A pedido | Simulación de una versión en borrador sobre el último período (AGR-009). |
| JOB-SUE-03 | `sue:emitir-recibos-pdf` | Al aprobar | PDF por recibo, hash, almacenamiento privado. |
| JOB-SUE-04 | `sue:firmar-recibos-empleador` | Al emitir | Arma el lote y pide a T11 la firma del empleador con el perfil SIG-SUE-EMPLEADOR (API-WFL-75); no llama al proveedor. Ver JOB-WFL-17 (dueño). |
| JOB-SUE-05 | `sue:notificar-recibos` | Al firmar el empleador | Notificaciones T09. |
| JOB-SUE-06 | `sue:consultar-estado-firma` | — | **Retirado.** T11 consulta al proveedor y el estado llega por EVT-WFL-042/043. Ver JOB-WFL-18 (dueño). |
| JOB-SUE-07 | `sue:proponer-novedades-operativas` | Por evento y a pedido | Novedades desde OT, cuadrillas, flota y tareas extra. |
| JOB-SUE-08 | `sue:importar-siradig` | A pedido | Procesa XML de F.572. |
| JOB-SUE-09 | `sue:liquidacion-anual-ganancias` | Anual (cierre del período fiscal) y por egreso | Determinación anual y formulario. |
| JOB-SUE-10 | `sue:generar-lsd` | A pedido | Archivo del Libro de Sueldos Digital. |
| JOB-SUE-11 | `sue:generar-sicoss` | A pedido | Archivo SICOSS y controles. |
| JOB-SUE-12 | `sue:recalcular-saldos-vacaciones` | Diario 02:00 y por evento de licencia | Saldos de vacaciones. |
| JOB-SUE-13 | `sue:generar-sicore-sueldos` | A pedido | Archivo SICORE de sueldos. |
| JOB-SUE-14 | `sue:generar-archivos-sindicales` | A pedido | Archivos por sindicato. |
| JOB-SUE-15 | `sue:alertas-legajo` | Diario 06:00 | Cambio de categoría, fin de prueba y de contrato, documentos, certificados art. 80, vencimientos de presentaciones, plazos de pago, SAC. |
| JOB-SUE-16 | `sue:importar-liquidacion-externa` | A pedido | Validación CU-28. |
| JOB-SUE-17 | `sue:procesar-fichadas` | Diario 03:00 y a pedido | Fichadas contra turno. |
| JOB-SUE-18 | `sue:aplicar-aumento` | A pedido | Previsualización y generación de escala. |
| JOB-SUE-19 | `sue:recordatorios-firma` | — | **Retirado.** T11 envía los recordatorios de firma pendiente según PRM-SUE-024/049. Ver JOB-WFL-09 (dueño). |
| JOB-SUE-20 | `sue:proyeccion-costo` | Mensual y a pedido | Proyección presupuestaria (AGR-028). |
| JOB-SUE-21 | `sue:purgar-simulaciones` | Semanal | Elimina simulaciones vencidas (PRM-SUE-050); no toca liquidaciones reales. |
| JOB-SUE-22 | `sue:importar-novedades-excel` | A pedido | ExcelImportWizard de novedades y anticipos. |
| JOB-SUE-23 | `sue:paralelo-comparar` | A pedido | Comparativo ProCoop / CoopApps. |

## 13. Integraciones

Marco general en T06. Particularidades del módulo:

| Integración | Ficha | Dirección | Medio | Detalle |
|---|---|---|---|---|
| Libro de Sueldos Digital | FIC 12 | Saliente | Archivo TXT con diseño ARCA (RG 3781) | Generado por empresa; presentación y acuse manuales en ARCA; layout como tabla de plataforma. |
| SICOSS / F.931 | FIC 12 | Saliente | TXT posicional | Importado por el contribuyente en ARCA; el VEP se registra en M14. |
| Tablas SICOSS | FIC 12 | Entrante | Archivos oficiales | Importadas por la plataforma (`ImportarSicossDb`), no por el tenant. |
| SIRADIG F.572 web | FIC 12 | Entrante | XML descargado por el empleador desde ARCA | Importación por lote; sin credenciales del empleado. |
| SICORE de sueldos | FIC 12 | Saliente | TXT | Retenciones de 4.ª categoría. |
| F.1357 / F.1359 | FIC 12 | Saliente | TXT / PDF | Liquidación anual y final. |
| Simplificación registral (alta/baja) | — | Manual en O9 | — | Se registra número de constancia; la integración automática por web service queda como Extensión. |
| Archivos bancarios de haberes | M14 (FIC bancos, Interbanking) | Saliente / entrante | Layouts por banco: Banco de Córdoba (3 variantes), Credicoop, Nación (3 variantes), Chubut, Macro (2 variantes), Santander, Interbanking, genérico | M14 genera, envía y concilia; SUE aporta convenios de pago por empresa (PRM-SUE-003 a 027). |
| Firma digital / electrónica | T11 WFL (conector del proveedor en T06, FIC 15) | Solicitud a T11 y eventos de vuelta | API-WFL-75; EVT-WFL-041 a EVT-WFL-043 | SUE no integra el proveedor: pide la firma a T11 y recibe el estado. Perfiles SIG-SUE-EMPLEADOR y SIG-SUE-EMPLEADO (DEC-078). |
| Archivos sindicales | — | Saliente | Layouts configurables | Luz y Fuerza, regional, genérico. |
| ART | — | Saliente | Nómina y denuncias (archivo o portal de la ART) | Manual con datos exportables. |
| Relojes de fichada | — | Entrante | Archivo o API del proveedor; agente local en O10 | PA-SUE-09. |
| Notificaciones | T09 | Saliente | Correo, push, SMS, WhatsApp | Reemplaza el aviso por SMS a teléfono o fax del encargado. |
| IA (asistente de fórmulas) | T06 | Saliente | Proveedor de IA | Solo catálogo y casos ficticios (RN-SUE-035). |
| Sistema laboral externo | — | Entrante | CSV/XLSX/JSON | CU-28 (O8). |

## 14. Parámetros de configuración

Los parámetros ProCoop del grupo SUELDOS (RN-09, 28 parámetros) y los relacionados de RN-08 se mapean así. Ámbito: `plataforma`, `tenant`, `empresa` (empleadora).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-SUE-001 | `sue.incomeTax.fiscalYearMode` | enum `janDec`, `febJan`, `decNov`, `janDecByPayDate` | empresa | `janDec` | Período fiscal para liquidar Ganancias; condiciona deducciones mensuales, acumulados y la retención informada. | #2611 |
| PRM-SUE-002 | `sue.accounting.entryFormat` | enum `summaryByAccount`, `byCostCenter`, `byEmployee` | empresa | `byCostCenter` | Formato del asiento de sueldos (reemplaza formatos 1, 2, 3). | #2207 |
| PRM-SUE-003 | `legalEntities.employer.bankAgreements[bancor].agreementCode` | texto | empresa | — | Código de convenio con Banco de la Provincia de Córdoba. | #326 |
| PRM-SUE-004 | `legalEntities.employer.bankAgreements[interbanking].originCbu` | texto (CBU) | empresa | — | CBU de origen para pago de sueldos por Interbanking. | #2262 |
| PRM-SUE-005 | `legalEntities.employer.bankAgreements[macro].originCbu` | texto (CBU) | empresa | — | CBU de origen Banco Macro. | #2406 |
| PRM-SUE-006 | `platform.contributionBaseLimits.maxSacMonths` | decimal por vigencia | plataforma | tabla oficial | Tope de base imponible en junio y diciembre. **Reemplazado** por tabla oficial (RN-SUE-075). | #2437 |
| PRM-SUE-007 | `platform.contributionBaseLimits.maxRegularMonths` | decimal por vigencia | plataforma | tabla oficial | Tope de base imponible en meses normales. **Reemplazado** por tabla oficial. | #2438 |
| PRM-SUE-008 | `sue.payment.allowTransferDateEdit` | lógico | empresa | `false` | Permite modificar la fecha de transferencia del pago. | #2288 |
| PRM-SUE-009 | `sue.payment.requestPayDateIfMissing` | lógico | tenant | `true` | Solicita la fecha de pago si no existe al emitir recibos. | #2484 |
| PRM-SUE-010 | `legalEntities.employer.bankAgreements[nacion].companyId` | texto | empresa | — | Identificador de empresa asignado por Banco Nación. | #2449 |
| PRM-SUE-011 | `legalEntities.employer.bankAgreements[nacion].useEmployeeAccount` | lógico | empresa | `true` | Usa la cuenta bancaria asignada al empleado en el archivo de Banco Nación. | #2468 |
| PRM-SUE-012 | `sue.siradig.shiftDecemberToNovember` | lógico | empresa | `false` | Al importar SIRADIG, carga con fecha de noviembre las novedades de diciembre (escalas corridas). | #2763 |
| PRM-SUE-013 | `sue.vacation.controlYear` | entero | tenant | año actual − 1 | Año desde el cual se controlan días de vacaciones pendientes. | #2598 |
| PRM-SUE-014 | `legalEntities.employer.bankAgreements[nacion].originCbu` | texto (CBU) | empresa | — | CBU de origen Banco Nación. | #2671 |
| PRM-SUE-015 | `legalEntities.employer.bankAgreements[nacion].agreementCode` | texto | empresa | — | Código de convenio Banco Nación. | #2672 |
| PRM-SUE-016 | `sue.portal.showUnsignedPayslips` | lógico | tenant | `false` | Muestra en el portal recibos sin firma digital del empleador. | #2886 |
| PRM-SUE-017 | `sue.ui.conceptsActiveOnlyByDefault` | lógico | tenant | `true` | Muestra solo conceptos activos por defecto. | #2481 |
| PRM-SUE-018 | `sue.rounding.classifyAsNonRemunerative` | lógico | tenant | `false` | Clasifica el concepto de redondeo como no remunerativo. | #3016 |
| PRM-SUE-019 | `sue.lsd.capProportionalVacation` | lógico | empresa | `false` | Topea vacaciones proporcionales en el LSD. | #3065 |
| PRM-SUE-020 | `sue.payAccounts.allowMultiple` | lógico | tenant | `true` | Permite varias cuentas/entidades bancarias por empleado. | #3129 |
| PRM-SUE-021 | `sue.ui.payslipGridFilterRow` | lógico | usuario | `true` | Fila de filtrado en grillas de recibos. **Reemplazado** por filtros estándar del DataTable (preferencia de usuario). | #2685 |
| PRM-SUE-022 | `sue.payslip.layoutByVoucherType` | lógico | empresa | `false` | Toma la configuración del recibo según el comprobante asociado al tipo de liquidación. | #2751 |
| PRM-SUE-023 | `sue.payslip.pdfFileNamePattern` | texto (plantilla) | tenant | `{cuil}_{year}_{month}_{type}` | Nombre del PDF exportado (reemplaza la opción CUIL_AÑO_MES). | #2985 |
| PRM-SUE-024 | `sue.payslip.notifyPendingSignature` | lógico | tenant | `true` | Permite notificar recibos pendientes de firma. | #3107 |
| PRM-SUE-025 | `legalEntities.employer.bankAgreements[chubut].originCbu` | texto (CBU) | empresa | — | CBU de origen Banco Chubut. | #2942 |
| PRM-SUE-026 | `legalEntities.employer.bankAgreements[chubut].companyId` | texto | empresa | — | Identificador de empresa Banco Chubut. | #2943 |
| PRM-SUE-027 | `legalEntities.employer.bankAgreements[santander].companyId` | texto | empresa | — | Identificador de empresa Banco Santander. | #2944 |
| PRM-SUE-028 | `sue.employee.integratedPersonForm` | lógico | tenant | `true` (fijo) | ABM de empleados integrado con personas. **Reemplazado**: siempre integrado (RN-SUE-002). | #3081 |
| PRM-SUE-029 | `payPeriods` (entidad) | — | empresa | — | Fecha de cierre de sueldos. **Reemplazado** por la entidad de períodos (RN-SUE-068). | #2376 |
| PRM-SUE-030 | `sue.advance.conceptId` | referencia a concepto | tenant | — | Concepto de adelanto de sueldo. | #2034 |
| PRM-SUE-031 | `sue.advance.noveltyTypeId` | referencia a tipo de novedad | tenant | — | Tipo de novedad para adelantos registrados desde tesorería. | #2538 |
| PRM-SUE-032 | `legalEntities.legalName` / `legalEntities.fiscal.cuit` | — | empresa | — | Nombre y CUIT de la cooperativa usados en F.1359 y exportaciones. **Reemplazado** por datos de cada empresa empleadora. | #518, #519 |
| PRM-SUE-033 | `statutoryFileLayouts` (configuración de layout) | — | tenant | — | Sigla de la cooperativa que activaba comportamientos por cliente (ej. exclusión de tipo de recibo en Luz y Fuerza). **Reemplazado** por opciones explícitas del layout. | #2264 |
| PRM-SUE-034 | `sue.accounting.useCostCenters` | lógico | empresa | `true` | Distribuye sueldos por centros de costo (secciones). | #2714 (y #2547 general, en M15) |
| PRM-SUE-035 | capability `sue.remuneraciones.ver` | — | — | — | Ocultar proveedores empleados y datos de empleados en compras y previsiones. **Reemplazado** por permiso (RN-SUE-092). | #2653, #2709 |
| PRM-SUE-036 | `sue.novelties.hourValuationSource` | enum `payroll`, `fixedRates` | tenant | `payroll` | Fuente de valorización de horas de OT para costeo (las cuentas y valores fijos de horas normales/extra de OT quedan en M10/M15). | #2166, #2167, #2722, #2723 (referencia) |
| PRM-SUE-037 | `sue.payroll.variationAlertPercent` | decimal | tenant | `15` | Variación de neto por empleado que dispara advertencia. | Nuevo |
| PRM-SUE-038 | `sue.payroll.blockingChecks` | lista | tenant | `noPayAccount, noCategory, negativeNet, draftNovelties, unmappedConcepts` | Controles bloqueantes previos a aprobar. | Nuevo |
| PRM-SUE-039 | `sue.payslip.signatureMode` | enum `none`, `employeeConsent`, `electronic`, `digitalProvider` | empresa | `digitalProvider` | Modo de firma del recibo por empresa; se traduce a los perfiles de T11 (SIG-SUE-EMPLEADOR, SIG-SUE-EMPLEADO; PRM-WFL-048). Por defecto, firma digital del empleador con proveedor licenciado y firma electrónica con OTP del empleado (DEC-078). | Nuevo |
| PRM-SUE-040 | `sue.serviceDebtDeduction.enabled` | lógico | tenant | `false` | Habilita descontar deuda de servicios del empleado (A validar PA-SUE-06). | Nuevo (de `ImporteFacturasAdeudadas`) |
| PRM-SUE-041 | `platform.laborLaw.maxVoluntaryDeductionPercent` | decimal | plataforma | `20` | Límite art. 133 LCT. | Nuevo |
| PRM-SUE-042 | `sue.novelties.autoProposeFromWorkOrders` | lógico | tenant | `true` | Propone novedades al cerrar OT/partes de cuadrilla. | Nuevo |
| PRM-SUE-043 | `sue.novelties.autoProposeFromFleet` | lógico | tenant | `false` | Propone novedades al cerrar viajes de flota. | Nuevo |
| PRM-SUE-044 | `sue.timeClock.source` | enum `none`, `fileImport`, `providerApi`, `localAgent` | tenant | `none` | Origen de fichadas (PA-SUE-09). | Nuevo |
| PRM-SUE-045 | `sue.vacation.noticeDays` / `sue.vacation.seasonFrom` / `seasonTo` | entero / fecha | tenant | `45` / `01-10` / `30-04` | Alertas de comunicación y temporada de vacaciones (art. 154). | Nuevo |
| PRM-SUE-046 | `legalEntities.employer.incomeTaxAgent` | lógico | empresa | `true` | La empresa actúa como agente de retención de Ganancias. | Nuevo |
| PRM-SUE-047 | `sue.externalPayroll.enabled` | lógico | empresa | `false` | Habilita la importación de liquidación externa (CU-28). | Nuevo |
| PRM-SUE-048 | `sue.portal.employeeEnabled` | lógico | tenant | `true` | Habilita el portal del empleado e invitaciones. | Nuevo |
| PRM-SUE-049 | `sue.payslip.reminderEveryDays` | entero | tenant | `3` | Frecuencia de recordatorios de firma. | Nuevo |
| PRM-SUE-050 | `sue.simulation.retentionDays` | entero | tenant | `90` | Conservación de simulaciones. | Nuevo |
| PRM-SUE-051 | `sue.accounting.monthlyProvisions` | lógico | empresa | `true` | Provisiones mensuales de SAC y vacaciones. | Nuevo |
| PRM-SUE-052 | `sue.payroll.defaultFrequency` | enum | empresa | `monthly` | Frecuencia por defecto. | Nuevo |
| PRM-SUE-053 | `sue.payment.defaultMethod` | enum | empresa | `transfer` | Medio de pago por defecto. | Nuevo |
| PRM-SUE-054 | `sue.certificates.art80DeadlineDays` | entero | tenant | `30` | Plazo de alerta para entregar certificados del art. 80 desde el egreso o el requerimiento. | Nuevo [VERIFICAR] |
| PRM-SUE-055 | `sue.hr.performanceEnabled` | lógico | tenant | `false` | Habilita evaluaciones y objetivos (PA-SUE-08). | Nuevo |
| PRM-SUE-056 | `sue.registration.requireAltaBeforeActive` | enum `block`, `warn`, `off` | empresa | `warn` | Exige constancia de alta registral para activar el legajo. | Nuevo |
| PRM-SUE-057 | `sue.sensitiveData.readReasonRequired` | lógico | tenant | `false` | Pide motivo al leer datos sensibles. | Nuevo |
| PRM-SUE-058 | `sue.retention.yearsAfterTermination` | entero | tenant | `10` | Conservación de legajo y recibos tras el egreso (PA-SUE-10). | Nuevo [VERIFICAR] |

## 15. Reportes, indicadores y exportaciones

Fecha de corte explícita en todos (AGR-022): por defecto, período devengado; opcional, fecha de pago. Universo: empleados de las empresas del alcance del usuario. Ningún reporte de BI general incluye datos sensibles (RN-SUE-093).

| Reporte | Fórmula / contenido | Universo y corte | Equivalente ProCoop (INV `GetDatosInforme`) |
|---|---|---|---|
| Costo laboral por servicio y centro de costo | Σ remunerativos + no remunerativos + contribuciones + ART + seguro de vida + provisiones SAC y vacaciones, distribuido por `employeeCostAllocations` | Período devengado | — (SUE-014) |
| Ausentismo | Días de ausencia (licencias no vacacionales + ausencias injustificadas) ÷ días laborables del universo × 100, por área, causa y mes | Período | `Get_Licencias`, `Get_HorasNoTrabajadas` |
| Horas extra y guardias | Σ horas 50 %, 100 % y guardias por empleado, área, OT y mes; importe; tope legal | Período | — |
| Proyección presupuestaria | Costo laboral proyectado con escalas futuras y aumentos previstos, SAC y vacaciones, por centro de costo y mes | 12 meses | — (AGR-028) |
| Nómina de empleados | Legajo, CUIL, empresa, categoría, área, ingreso, antigüedad, estado | A fecha | `Get_NominaEmpleados`, `Get_LegajosEmpleados` |
| Conceptos liquidados | Por concepto, empleado y período: cantidad, base, importe (Excel) | Período | `Get_ConceptosLiquidacion`, `Get_ConceptosLiquidacion_Excel` |
| Cuenta corriente del empleado | Adelantos, préstamos, embargos y su saldo | A fecha | `Get_CuentaCorriente_Empleado` |
| Cambios de categoría | Historial por período | Rango | `Get_CambiosCategorias` |
| Familiares | Familiares por empleado con datos del año | Año | `Get_FamiliaresEmpleado` |
| Horarios y fichadas | Turnos asignados y horas trabajadas | Rango | `Get_Horario`, `Get_HorariosEmpleado` |
| Licencias solicitadas y autorizadas | Por causa, estado, área | Rango | `Get_Licencias`, `Get_Licencias_Autorizadas` |
| Novedades | Por tipo, origen y estado | Período | `Get_NovedadEmpleados` |
| Trámites y documentación | Documentos pendientes, vencidos | A fecha | `GetTramitesEmpleados` |
| Remuneraciones por banco | Netos por banco y cuenta | Período | `GetRemuneracionesEmpleadosBanco`, `GetIqueryableSueldosBanco` |
| Libro de sueldos (art. 52) | Recibos del período con sus conceptos | Período | `GetLibroSueldos` |
| Totales SICOSS | Bases y aportes por subsistema vs liquidación | Período | `GetTotalSicoss` |
| Actividades / tareas extra | Tareas por ejecutor | Período | `Get_ActividadesExtra` |
| Liquidación anual de Ganancias | Formulario por empleado | Año fiscal | `GetDatosF649`, `ExportarArchivoF1357`, `ExportarArchivoF1359` |
| Diferencias de Ganancias mes a mes | Por empleado | Año | `ExportarDiferencialesAExcel` |
| Gráficos por grupos de conceptos | Evolución mensual por grupo | 12 meses | `SU_GRUPO_GRAFICO` |
| Rotación | Egresos del período ÷ dotación promedio × 100 | Período | — |
| Antigüedad y dotación | Dotación por área, convenio y tramo de antigüedad | A fecha | — |
| Provisiones | SAC y vacaciones devengadas no pagadas | A fecha | — |
| Embargos (sensible) | Planes activos, descontado, saldo | A fecha | — |
| Firma de recibos | Pendientes, firmados, disconformes por período | Período | `GetEstadoFirma`, `GetEstadoDocumento` |
| Comparativo de liquidaciones | Período vs anterior por empleado y concepto | Dos períodos | — |

Exportaciones: todas las grillas a XLSX/CSV/PDF; recibos en PDF individual y en lote ZIP; archivos oficiales según §13.

## 16. Casos de uso

### CU-28 — Importar una liquidación externa (BASE §28, se mantiene como alternativa)

- **Actor:** responsable de personal y contador.
- **Situación inicial:** el sistema laboral externo cerró una liquidación y produjo un archivo autorizado.
- **Desarrollo:** 1) importar la referencia y los totales del período (PAN-SUE-39, API-SUE-75); 2) validar correspondencia de centros de costo y evitar duplicados (RN-SUE-090); 3) enviar el resumen aprobado a contabilidad y tesorería (EVT-SUE-24).
- **Resultado esperado:** liquidación externa identificada y contabilizable sin recalcular salarios en esta plataforma.
- **Excepción o control:** si el archivo ya se importó o no coincide el total, detener y solicitar conciliación.
- **Ola:** O8. **Requisitos:** RF-SUE-121, RF-SUE-140 a RF-SUE-144.

### CU-104 — Liquidación mensual de una cooperativa eléctrica (BASE §104.5)

- **Actor:** responsable de personal, contador y tesorero.
- **Desarrollo:** 1) las horas de guardia de las cuadrillas se importan desde las órdenes de trabajo cerradas del mes (§9.4); 2) el liquidador revisa novedades, simula la liquidación y compara con el período anterior (PAN-SUE-25/26); 3) el contador aprueba; se generan recibos, el asiento por centro de costo (distribución, administración, internet), el archivo bancario y los archivos para ARCA; 4) tesorería confirma la acreditación; los empleados reciben el recibo en su portal y confirman la recepción.
- **Datos ficticios:** 18 empleados, 2 con embargos, 120 horas de guardia; costo laboral total del período ARS 41.500.000.
- **Requisitos:** RF-SUE-049, 055, 067 a 071, 078, 081, 104 a 107, 112 a 114, 118, 135.

### CU-SUE-01 — Alta de un empleado que ya es socio

Actor RRHH. 1) Busca por CUIL; la persona existe como socio en M01. 2) Crea el legajo en la empresa «Cooperativa» con convenio, categoría, área «Distribución» y distribución 100 % al centro de costo Distribución. 3) Registra la constancia de alta. 4) Activa; T02 agrega el perfil empleado a la misma cuenta. **Resultado:** en la PWA aparece el selector de ámbito socio/empleado; en el ámbito socio no hay datos laborales. **Excepción:** CUIL inválido → error de validación.

### CU-SUE-02 — Publicar la paritaria con retroactivo

Actor responsable laboral y contador. 1) Aplica aumento de 8 % a las categorías del convenio con fecha efectiva 01-03 (PAN-SUE-16). 2) Simula marzo con la nueva escala. 3) El contador publica. 4) El sistema sugiere complementaria de marzo, que se liquida en abril con devengamiento marzo. **Excepción:** convenio sin validación registrada → no publica.

### CU-SUE-03 — Solicitar y aprobar vacaciones desde la PWA

Actor empleado y encargado. 1) El empleado ve 21 días disponibles y solicita 14 días desde el 05-01. 2) El encargado ve el calendario del equipo y aprueba. 3) Se generan novedades, el saldo baja a 7 y se propone liquidar las vacaciones al inicio. **Excepción:** superposición con otra autorizada → rechazo automático de la solicitud.

### CU-SUE-04 — Liquidar SAC del primer semestre

Actor liquidador. 1) Crea liquidación tipo SAC 1 para junio. 2) El sistema calcula 50 % de la mayor remuneración del semestre con los conceptos marcados; proporcional para ingresos del semestre. 3) Aprobación y pago antes del vencimiento. **Control:** alerta 10 días antes del 30-06.

### CU-SUE-05 — Despido sin causa y liquidación final

Actor RRHH, liquidador, aprobador. 1) Crea el egreso con motivo «despido sin causa», preaviso sustitutivo y fecha 15-08. 2) El sistema propone preaviso, integración del mes, art. 245 con tope de convenio, vacaciones no gozadas y SAC proporcional, Ganancias final. 3) El aprobador aprueba; se pagan y se emiten certificados art. 80 con plazo. 4) T02 revoca el acceso al día siguiente. **Excepción:** el empleado tiene un embargo activo → el sistema aplica el embargo sobre los conceptos embargables y alerta sobre los indemnizatorios según configuración [VERIFICAR].

### CU-SUE-06 — Importar F.572 y recalcular Ganancias

Actor liquidador. 1) Descarga los XML de ARCA y los importa. 2) Un empleado declara alquiler y un hijo; otro declara otro empleo. 3) La liquidación del mes recalcula la retención acumulativa y genera una devolución en un caso. **Excepción:** XML de otro CUIT empleador → rechazo.

### CU-SUE-07 — Generar y presentar LSD y SICOSS

Actor liquidador y contador. 1) Con la liquidación aprobada, genera LSD y SICOSS. 2) El control de totales da cero diferencias. 3) El contador aprueba y presenta en ARCA; carga el acuse. 4) El VEP del F.931 se registra como obligación en M14. **Excepción:** concepto sin código ARCA → la generación se detiene y lista los conceptos.

### CU-SUE-08 — Firma y recepción del recibo

Actor empleado. 1) Recibe la notificación; abre el recibo en la PWA. 2) Firma con OTP en la interfaz de firma de T11 (PAN-WFL-27); T11 guarda la evidencia. 3) Otro empleado firma en disconformidad con observación; RRHH la ve en su bandeja. **Excepción:** recibo rectificado → el anterior aparece como anulado con enlace al nuevo.

### CU-SUE-09 — Pago con un CBU rechazado

Actor tesorero y liquidador. 1) M14 informa 17 acreditados y 1 rechazado. 2) El liquidador corrige la cuenta (aprobada por RRHH) y reenvía solo ese ítem. **Resultado:** liquidación `paid`.

### CU-SUE-10 — Accidente in itinere

Actor RRHH. 1) Denuncia el accidente y el número de siniestro de la ART. 2) Se genera la licencia por accidente y el código de siniestrado en SICOSS. 3) Se registran reintegros de la ART. 4) Alta médica cierra el caso. **Control:** datos visibles solo con `sue.datosSensibles.ver`.

### CU-SUE-11 — Sanción con suspensión

Actor RRHH. 1) Registra el hecho y notifica una suspensión de 2 días. 2) El empleado presenta descargo; queda `firm`. 3) Se generan novedad sin goce y situación de revista de suspensión. **Control:** acumulado anual > 30 días bloquea.

### CU-SUE-12 — Juicio laboral y provisión

Actor asesor legal. 1) Registra el juicio y lo vincula al expediente de M08. 2) Fija provisión; M15 la registra. 3) Acuerdo homologado: liquidación complementaria o pago institucional según el caso.

### CU-SUE-13 — Ciclo de evaluación de desempeño

Actor RRHH, encargados, empleados. 1) Crea el ciclo con plantilla 180°. 2) Autoevaluación y evaluación del superior. 3) Calibración y cierre; devolución registrada.

### CU-SUE-14 — Pluriempleo en dos empresas del tenant (A validar PA-SUE-11)

Una persona trabaja en la Cooperativa y en su sociedad de servicios del mismo tenant; designa a la Cooperativa como agente de retención; la otra empresa informa «otros empleos».

## 17. Criterios de aceptación y escenarios de prueba

| ESC-ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-SUE-01 | Aislamiento de tenant: un liquidador de TEN-001 consulta un legajo de TEN-002 por ID. | 404; no se revela existencia. |
| ESC-SUE-02 | Permiso negativo: liquidador intenta aprobar su liquidación. | 403 con `problem+json` y motivo «separación de funciones». |
| ESC-SUE-03 | Permiso negativo: aprobador intenta ejecutar el pago en M14. | 403. |
| ESC-SUE-04 | El aprobador figura como empleado dentro del lote que debe aprobar. | El servidor le impide aprobar su propio recibo; el lote se deriva a otro aprobador habilitado. |
| ESC-SUE-05 | Datos sensibles: usuario sin `sue.datosSensibles.ver` abre la pestaña Planes de descuento. | Ve tipo e importe descontado; no ve juzgado, expediente ni carátula; la lectura de quien sí tiene permiso queda auditada. |
| ESC-SUE-06 | Reintento: se repite `POST /payment-requests` con la misma `Idempotency-Key`. | Devuelve la misma solicitud; M14 no duplica. |
| ESC-SUE-07 | Caída del job de cálculo en el empleado 9 de 18. | Al reanudar continúa desde el 10; no duplica recibos. |
| ESC-SUE-08 | Conciliación: total de SICOSS vs liquidación vs asiento. | Diferencia 0 por subsistema. |
| ESC-SUE-09 | Importación externa duplicada (CU-28). | Rechazo con «ya importado»; ningún asiento nuevo. |
| ESC-SUE-10 | Total no coincide en importación externa. | Estado `rejected` con diferencia informada. |
| ESC-SUE-11 | Publicar una versión sin simulación. | 422 «requiere simulación revisada». |
| ESC-SUE-12 | Escala retroactiva publicada. | Se sugiere complementaria; recibos de marzo emitidos no cambian. |
| ESC-SUE-13 | Licencia que cruza meses. | Una novedad por mes con los días correctos. |
| ESC-SUE-14 | Licencia en días hábiles con feriado. | El feriado no se descuenta. |
| ESC-SUE-15 | Vacaciones con 4 meses de antigüedad y 80 días trabajados. | 4 días (1 cada 20). |
| ESC-SUE-16 | Vacaciones con 12 años de antigüedad. | 28 días corridos (o los del convenio si son más). |
| ESC-SUE-17 | SAC proporcional de un ingreso del 01-04. | 50 % del mejor mes × 91/181. |
| ESC-SUE-18 | Art. 245 con 7 años y 4 meses. | 8 períodos; tope de convenio aplicado si corresponde. |
| ESC-SUE-19 | Embargo con remuneración neta de 1,5 SMVM. | 10 % de la remuneración; cuota alimentaria sin ese tope. |
| ESC-SUE-20 | Descuentos voluntarios superan el 20 %. | Advertencia bloqueante. |
| ESC-SUE-21 | Ganancias: devolución en el mes. | Concepto de devolución y detalle de Ganancias consistente. |
| ESC-SUE-22 | Rectificativa de un recibo firmado. | Original anulado y conservado; nuevo recibo con referencia; LSD rectificativo. |
| ESC-SUE-23 | Novedades de OT reabierta y recerrada. | Sin duplicados; si estaba liquidada, ajuste. |
| ESC-SUE-24 | Portal: empleado A pide el PDF del recibo de B. | 404. |
| ESC-SUE-25 | Cambio de ámbito socio → empleado en la PWA. | Permisos, caché y descargas recalculadas (AGR-006). |
| ESC-SUE-26 | Egreso aprobado. | Acceso revocado al día siguiente; certificados pendientes con plazo. |
| ESC-SUE-27 | IA del editor de fórmulas. | La solicitud no contiene nombres, CUIL ni importes reales. |
| ESC-SUE-28 | Datos de prueba. | Los ambientes de prueba no tienen datos reales ni credenciales productivas de firma ni bancos (AGR-035). |
| ESC-SUE-29 | Período cerrado. | No se pueden crear novedades ni liquidaciones con ese período. |
| ESC-SUE-30 | Liquidación propia y externa del mismo período. | La segunda se rechaza (RN-SUE-091). |

Escenarios transversales ESC-01 a ESC-05 de BASE §102: aplica el de dos tenants con datos canónicos (ESC-SUE-01) y el de acciones fallidas reparadas sin duplicar (ESC-SUE-06, ESC-SUE-07).

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son inventados; ningún nombre, CUIL ni CBU corresponde a personas reales (BASE §97.1, AGR-035).

| Entidad | Datos ficticios |
|---|---|
| Tenant | TEN-001 — Cooperativa Ejemplo A |
| Empresas empleadoras | EMP-01 «Cooperativa Ejemplo A Ltda.» (CUIT 30-00000001-0 ficticio, agente de retención, ART «ART Demo», alícuota 2,5 % + ARS 1.200 fijo); EMP-02 «Servicios Ejemplo SA» (sociedad del tenant, para probar multiempleador) |
| Sindicatos y convenios | «Sindicato Demo de Luz y Fuerza» (retención 2,5 %, cambio de categoría cada 24 meses), CCT «DEMO 1/26»; «Sindicato Demo de Comercio», CCT «DEMO 2/26» |
| Categorías y escala | DEMO 1/26: Ayudante ARS 1.150.000, Oficial ARS 1.420.000, Oficial especializado ARS 1.680.000, Supervisor ARS 2.050.000 (vigencia 01-01-2026); escala abril con +8 % en borrador |
| Antigüedad | 1 % por año; días de vacaciones 14/21/28/35 según art. 150 |
| Áreas y centros de costo | Distribución (CC-DIS), Administración (CC-ADM), Internet (CC-INT), Comercial (CC-COM) |
| Empleados | 18 legajos (EMP-A-001 a EMP-A-018) con nombres genéricos («Empleado Demo 01»…), 12 en Distribución, 3 en Administración, 2 en Internet, 1 en Comercial; uno con distribución 50 % Distribución / 50 % Internet; uno que también es socio (EMP-A-001); uno en período de prueba |
| Familiares | 10 familiares a cargo (cónyuges e hijos ficticios) con F.572 2026 |
| Cuentas | CBU ficticios con dígito verificador válido de banco «999»; un empleado con dos cuentas 70/30 |
| Planes de descuento | 2 embargos (uno común, uno por cuota alimentaria 20 %), 1 préstamo en 6 cuotas, 2 adelantos de ARS 100.000 |
| Novedades | 120 horas de guardia desde 15 OT cerradas de marzo; 46 horas extra al 50 % y 12 al 100 %; 300 lecturas como tareas extra (ARS 350 c/u); 3 ausencias injustificadas |
| Licencias | 2 vacaciones aprobadas, 1 enfermedad (sensible), 1 matrimonio pendiente |
| Liquidaciones | LIQ-2026-02-M (cerrada y pagada), LIQ-2026-03-M (calculada, pendiente de aprobación), simulación con la escala de abril |
| Costo laboral de marzo | ARS 41.500.000 distribuido: Distribución ARS 27.400.000, Administración ARS 7.100.000, Internet ARS 4.900.000, Comercial ARS 2.100.000 |
| Liquidación externa | Lote NOM-DEMO-2026-11, origen «Sistema laboral externo», 2 legajos, total ARS 2.000.000 (no es cálculo salarial) |
| RRHH | 1 ciclo de evaluación 180° abierto, 1 apercibimiento, 1 accidente in itinere cerrado, 1 juicio laboral con provisión ARS 3.000.000 |

## 19. Migración desde ProCoop

Proceso repetible (T07) por empresa, con tablas de mapeo de claves (`legacyMap`) porque ProCoop usa IDs por `MAX + 1` y claves compuestas. Orden: tablas oficiales → estructura → legajos → configuración de cálculo → historial → acumulados → abiertos.

| Tabla origen (CAT §18) | Colección destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `SU_ACTIVIDADES` | `payrollOfficialCodes` (type `activity`) — plataforma | Se mapean al código oficial vigente; los no oficiales se informan | 100 % de empleados con actividad válida |
| `SU_ANTIGUE` | `seniorityScales` | Agrupar por categoría/sindicato; `DESDE`/`HASTA` → `yearsFrom`/`yearsTo`; `DIAS_VAC` → `vacationDays` | Filas origen = filas destino |
| `SU_ASIENTOS` | `payrollAccountingRules` | `CTA_DEBE`/`CTA_HABER` → cuentas M15 por mapeo de plan; filtros (`COD_EMPR`, `COD_SIN`, `COD_CATS`, `EMPLEADOS`, `COD_SEC`, `COD_CAR`, `COD_DEPTO` y demás) → `filters` | Asiento simulado del último mes = asiento ProCoop |
| `SU_AUDIT_TRA_INTERBANKING` | Histórico de M14 (log de transferencias) | Solo lectura, `JSON_ENVIO`/`JSON_RESPUESTA` sin credenciales | Cantidad y totales por fecha |
| `SU_BENEFICIOS_SICOSS` | `payrollOfficialCodes` (`sicossBenefit`) | Código oficial | — |
| `SU_CARGO` | `positions` | Directo | Conteo |
| `SU_CATE` | `salaryCategories` + `salaryScales` (una escala inicial con vigencia = fecha de migración o última actualización conocida) | `IMPORTE`, `ADICIONAL*` → `items[]`; `TIP_CAT` → `type`; `COD_SIN` → convenio | Básico por categoría idéntico |
| `SU_CONCEPTOS` | `payrollConcepts` (versión de configuración «Migración ProCoop», `draft`) | Fórmulas `FORMULA_CAN`/`FORMULA_IMP`/`FORMULA_FIL` traducidas al DSL con traductor asistido; funciones ProCoop → funciones de §6.2; `TIP_CON` → `type`; `GANANCIAS`, `SICOSS`, `AGUINALDO`, `COD_CTA` → clasificaciones y cuenta | Simulación del último período = recibos ProCoop (tolerancia ARS 1 por renglón) antes de publicar |
| `SU_CONCEPTO_TIPO` | `payrollConcepts.payrollTypes[]` | `NOMOSTRAR` → `hiddenOnPayslip` | — |
| `SU_CONDICION` | `payrollOfficialCodes` (`condition`) | Código oficial | — |
| `SU_CONTRATACION` | `payrollOfficialCodes` (`contractMode`) | Código oficial | — |
| `SU_DEDUCCIONES` | `incomeTaxDeductionTables` — plataforma | Solo años vigentes; se validan contra la fuente oficial | Totales por mes |
| `SU_DEDUCCIONES_ESPECIAL` | `incomeTaxDeductionTables` (deducción especial incrementada) — plataforma | Idem | — |
| `SU_DEDUCCIONES_TIPOS` | `incomeTaxDeductionTables` (tipos) — plataforma | — | — |
| `SU_DESVICULACION` | `terminationReasons` | `CATEGORIA` → `category` | — |
| `SU_DESVIC_EXTRAS` | `terminationReasons.conceptTemplate[]` | `COD_EXTRA` → concepto vía extra | — |
| `SU_EMPLEADOS` | `employees` + `employeeAssignments` (estado vigente) + persona M01 (si no existe) | `COD_PER` → `personId`, vinculado o creado por T07 con sus reglas de unificación del padrón (RN-PER-135, DEC-097): si el CUIL coincide con una persona ya migrada (por ejemplo, un socio), se reutiliza; nunca se crea una segunda persona para el empleado; `COD_LEG`, `COD_EMPR`, `CUIL`, `FEC_ALTA`, `FEC_ANTI`, `FEC_BAJA`, `CONVENIO`, `BASICO`, `ADICIONAL*` y +45 columnas → campos de §7.2; CBU embebido → `employeePayAccounts` | Conteo por empresa y estado; CUIL válidos |
| `SU_EMPLEADOS_DOCUMENTOS` | `employeeDocuments` | Adjuntos copiados al almacenamiento privado; `AUTORIZADO` → `status` | Conteo y hash de archivos |
| `SU_EMPLEADOS_SEC` | `employeeCostAllocations` | `COD_SEC` → centro de costo M15; `POR_ASIGNACION` → `percent` | Suma 100 % por empleado (corrige diferencias) |
| `SU_EMPLEADOS_SUMSOC` | `employees.serviceAccountLinks[]` | `COD_SUM` → cuenta M01; sin autorización hasta PA-SUE-06 | Conteo |
| `SU_EMPRESAS` | `legalEntities.employer` (T04 RF-CFG-142; antes `employers`, CTR-DAT-06) | Match por CUIT con la entidad jurídica; domicilio a formato M01; `CTA_CONTRI`/`COD_CTA` → reglas contables | CUIT válidos |
| `SU_EMP_CBU` | `employeePayAccounts` | `POR_PAG` → `splitPercent`; `BANCO_ORIGEN` → `originBankCode` | CBU válidos; suma 100 % |
| `SU_EMP_EXTRAS` | `employeeExtras` | Vigencia desde fecha de migración | Importes idénticos |
| `SU_EMP_FAMILIARES` | `employeeFamilyMembers` + personas M01 | `TIP_REL` → `relationship` | Conteo |
| `SU_EMP_FAMILIARES_EXTRAS` | `employeeFamilyMembers.yearly[]` | Por `AÑO` | — |
| `SU_EMP_HISCAT_EMP` | `employeeAssignments` (historial) | `FEC_CAT_NEW` → `validFrom`; `FEC_REG` → `recordedAt` | Conteo |
| `SU_EMP_NOVEDADES` | `novelties` | Año en curso: abiertas en `approved`; liquidadas en `settled` con `source = migration`; `ID_ANTICIPO`/`ID_IVACOM` → `deductionPlans` | Totales por tipo y período |
| `SU_EMP_OBS` | `employeeNotes` | Categoría `general` salvo marca | Conteo |
| `SU_EMP_OPER` | `supervisionLinks` | Vigencia desde migración | — |
| `SU_EMP_TURNOS` | `employeeShiftAssignments` | `FEC_DESDE`/`FEC_HASTA` | — |
| `SU_EXTRAS` | `extraItems` | — | — |
| `SU_EXTRAS_GRUPOS` | `extraGroups` | `UNICO`, `DEDUC_GAN` | — |
| `SU_GRUPO_GRAFICO` | `reportGroups` | — | — |
| `SU_HORAS_LECTOR` | `timePunches` | Solo los últimos 24 meses; `PROCESADO`, `MANUAL` | Conteo |
| `SU_LICENCIAS` | `leaveRequests` | `AUTORIZACION` → `status`; adjuntos copiados | Conteo por estado |
| `SU_LICENCIAS_CAUSAS` | `leaveCauses` | `DIAS_PERIOD`, `VACACIONES`, `COD_TIP_NOV`, `RET_TEMP` | — |
| `SU_NOTIFICACIONES` | `payslipNotifications` + `payslips.signature` | `ESTADO`, `FECHA_FIRMA_EMP`, `OBSERVA_NOCONFORM`, `FIRMA`, `REF_PDF` | Estados de firma idénticos |
| `SU_OBRA` | `healthInsurerAdoptions` | Código RNOS oficial | — |
| `SU_SALARIO_MINIMO` | `minimumWages` — plataforma | Se valida contra la fuente oficial | — |
| `SU_SINDICATO` | `unions` | `CTA_GRAL`/`CTA_CARGAS` → cuentas M15; `MES_CAT` → `categoryReviewMonths` | — |
| `SU_SINIESTRADO` | `payrollOfficialCodes` (`accidentCode`) | Código oficial | — |
| `SU_SITUACION_REVISTA` | `payrollOfficialCodes` (`employmentStatus`) | Código oficial | — |
| `SU_SIT_REVISTA_EMPLEADO` | `employmentStatusPeriods` | `FECHA_DESDE` → `validFrom` | — |
| `SU_SUELDOS` | `payrollRuns` (agrupados por empresa, período y tipo, estado `closed`) + `payslips` (estado `acknowledged`/`issued`) | `COD_COM`/`SUC_COM`/`NUM_COM` → `number`; `FEC_PAG`, `APORTE_PER`, `APORTE_FEC` → constancias; PDF regenerado o adjuntado si existe | Neto total por período idéntico |
| `SU_SUELDOSIT` | `payslips.lines[]` | `TIP_CON` → `type`; sin traza (`calcTrace = migrated`) | Σ renglones = neto |
| `SU_SUELDOS_DETGAN` | `incomeTaxCalculations` | `TIPO_REG_GAN` → `lines[].code` | Acumulado del año = ProCoop |
| `SU_TAREAS_EXTRAS` | `extraTasks` | — | — |
| `SU_TAREAS_EXTRAS_EMPLEADOS` | `extraTasks.workers[]` | — | Totales |
| `SU_TIPOEMPLEADOR` | `payrollOfficialCodes` (`employerType`) | Código oficial | — |
| `SU_TIPO_NOVEDADES` | `noveltyTypes` | `TIPO`, `COD_SIRADIG`, `ANTICIPO`, `TOPE_ANUAL`, `POR_GAN_NETA`, `PAGOS_A_CUENTA`, `IMP_CEDULAR`; tipos 10, 11 y 27 → `behavior` | — |
| `SU_TIPO_RECIBOS` | `payrollTypes` | `SAC`, `VACACIONES`, `PRORRATEAR`, `NO_DESCONTAR_ADELANTO`, `TIPO_TRAMA` | — |
| `SU_TRAMAS` | `incomeTaxScales` — plataforma | Validadas contra fuente oficial | — |
| `SU_TRAMAS_TIPOS` | `incomeTaxScales` (tipos) — plataforma | — | — |
| `SU_TURNOS` | `shifts` | — | — |
| `SU_TURNOSIT` | `shifts.items[]` | `DIA_DESDE`, `DIA_HASTA`, `HORA_DESDE`, `HORA_HASTA` | — |
| `SU_VARIABLES` | `payrollVariables` (versión «Migración ProCoop») | Fórmula traducida al DSL | Validación sin errores |
| Parámetros SUELDOS (RN-09) | §14 | Ver columna «Origen V2» | Valores efectivos relevados en la cooperativa |
| Proveedores-empleado (empleado dado de alta como proveedor en compras) | No se migran como proveedores; adelantos pendientes → `deductionPlans` | PA-SUE-05 | Saldo de adelantos idéntico |

**Acumulados críticos al migrar a mitad de año:** remuneraciones y retenciones de Ganancias del año fiscal por empleado, mejor remuneración del semestre (SAC), días de vacaciones tomados, saldos de planes de descuento, cuotas de novedades pendientes. **Paralelo:** al menos dos períodos con comparativo (RF-SUE-145; PA-SUE-01). **Contraseñas del portal ProCoop:** no se migran; los empleados se invitan por T02 (RN-SUE-003).

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-SUE-01 | BASE §28 vs BASE §104 | §28 trata sueldos como módulo opcional que podía limitarse a importar resultados; §104 lo incorpora completo al alcance. | Alcance completo SUE-001 a SUE-014 en O9; CU-28 se mantiene como alternativa (O8), según DEC-058. | BASE más reciente (§104 amplía y prevalece sobre §28) |
| CTR-SUE-02 | DFA M20 «(C)» y «Evaluar si conviene integrar un liquidador externo», RN-08 §13.10, FIC 12 (prioridad B, «si es externo alcanza con importar el asiento»), BASE §99.4 (recomendaba diferir) vs BASE §104 | El benchmark marcaba sueldos como prioridad baja o externo. | Se construye el módulo propio; la importación externa queda como opción por empresa (PRM-SUE-047). Coincide con CTR-GLB-04 del maestro. | BASE §104 sobre benchmark |
| CTR-SUE-03 | RN-08 §11.6 y §14.11 (ProCoop no calcula F.931, delega en SICOSS) vs SUE-007 («aportes y contribuciones, declaración jurada F.931») | Alcance del cálculo de seguridad social. | Se calculan aportes y contribuciones para asiento y control y se generan LSD y SICOSS; la DJ se obtiene y presenta en ARCA. A validar PA-SUE-02. | BASE sobre benchmark; decisión del solicitante pendiente |
| CTR-SUE-04 | RN-08 §11.5 (empleado dado de alta como proveedor; pago mediante factura de compra y OP) vs SUE-009 y Convenciones §5 | Modelo del pago de haberes. | Solicitud de pago de haberes a M14 con el empleado como beneficiario propio, sin factura de compra. A validar PA-SUE-05. | BASE + mejora de diseño |
| CTR-SUE-05 | RN-08 §15.6 `VerificarEmpleado` (clave del portal = DNI) vs AGR-006 y T02 | Seguridad del acceso del empleado. | Identidad común T02 con contraseña con hash y 2FA; se descarta la clave por documento (RN-SUE-003). | AGR + deuda de seguridad de ProCoop (guía §3.5) |
| CTR-SUE-06 | P2437/P2438 (topes por tenant), escala cedular fija en código, `SU_DEDUCCIONES`/`SU_TRAMAS` por base vs BASE §104.3 | Dónde viven las tablas normativas. | Tablas oficiales de plataforma con fuente y vigencia, adoptadas por el tenant (RN-SUE-012, RN-SUE-075). | BASE §104.3 |
| CTR-SUE-07 | RN-08 §12.3 P2207 y `GenerarAsientosSueldos` (asientos en el cierre automático por rango) vs SUE-010, DEC-009 y RN-08 §13.1 | Momento de la contabilización. | Asiento en línea al aprobar, con vínculo y reversión (RN-SUE-088). | DEC-009 + BASE |
| CTR-SUE-08 | `EliminacionMasiva_Recibos` y `AnularPago` (borran sin control) vs Convenciones §5 (documentos económicos nunca se borran) y AGR-003 | Corrección de liquidaciones. | Anulación con reversión o rectificativa; nada se borra (RN-SUE-061, RN-SUE-067). | Convenciones + AGR |
| CTR-SUE-09 | P2376 (fecha de cierre única de sueldos) vs RN-08 §13.3 y AGR-010 | Cierre de períodos. | Entidad `payPeriods` por empresa con estados y reaperturas auditadas (RN-SUE-068). | AGR + mejora |
| CTR-SUE-10 | REL (Libro sueldo digital deshabilitado en la DEMO) vs SUE-007 | Disponibilidad del LSD. | LSD obligatorio en el alcance (RF-SUE-098). | BASE |
| CTR-SUE-11 | DFA M20 «Portal del empleado con recibos y firma digital» vs SUE-008 «firma cuando la normativa lo admita» | Tipo de firma exigible. | Firma digital con proveedor licenciado para el empleador y firma electrónica con OTP para el empleado, ambas resueltas por T11 (DEC-078). | BASE (condiciona) |
| CTR-SUE-12 | `ImporteFacturasAdeudadas` (descuento de deuda de servicios) vs LCT art. 132–133 y BASE §97.1 | Legalidad del descuento. | Desactivado por defecto; solo con autorización escrita y dentro del límite. A validar PA-SUE-06. | Norma + BASE |
| CTR-SUE-13 | ProCoop: empleado separado de persona (P3081 opcional) vs BASE §3 y §42 (persona, asociado, empleado y usuario son conceptos distintos pero la persona es única) | Unicidad de la persona. | El legajo siempre referencia a la persona de M01 (RN-SUE-002). | BASE |
| CTR-SUE-14 | `SolicitarLicencia`/`AceptarLicencia` (aviso por SMS al teléfono o fax) vs CNX y T09 | Canal de avisos. | Notificaciones multicanal de T09 (RN-SUE-038). | CNX |
| CTR-SUE-15 | `GenerarNovedad` (retención de Ganancias como novedad del mes siguiente, defecto de diciembre) y P2611 (novedad 27 pisa el concepto) vs trazabilidad (AGR-010) | Tratamiento de la retención. | La retención queda en el detalle del recibo; la sustitución manual es explícita con motivo (RN-SUE-050). | AGR + corrección de defecto |
| CTR-SUE-16 | ProCoop cuenta días hábiles sin feriados vs LCT (días hábiles excluyen feriados) | Cómputo de licencias. | Calendario de feriados (RN-SUE-041). | Norma; benchmark con defecto |
| CTR-SUE-17 | `Cargar_Ganancias` (Caja de Jubilaciones de Córdoba fija en código) y P2264 «DEAN» (comportamiento por sigla de cliente) vs multitenancy (DEC-002) | Personalizaciones por cliente en código. | Configuración explícita por tenant (RN-SUE-051, RN-SUE-079; PRM-SUE-033). | DEC-002 |
| CTR-SUE-18 | P519 (un CUIT de la cooperativa para F.1359) vs multiempleador (DFA M20 «Empresas empleadoras») | CUIT de las presentaciones. | CUIT de cada empresa empleadora (RN-SUE-074). | Benchmark interno coherente + DEC-007 |
| CTR-SUE-19 | BASE §104.6 («el modelo de datos debe incluir el módulo desde el inicio») vs ola O9 del maestro | Ola del módulo. | Módulo en O9; registro mínimo de relación laboral en O3 (RF-SUE-001) e importación externa en O8 (guía §7: prerrequisitos van a la ola anterior). | DEC-006 + guía §7 |
| CTR-SUE-20 | T04b §5.10 (V2 2262, 2406, 2671, 2942: «Reemplazado — CBU como atributo de la cuenta bancaria propia de M14») vs §14 PRM-SUE-004, 005, 014, 025 (`legalEntities.employer.bankAgreements[].originCbu`) | Dónde vive el CBU de origen del pago de haberes. | El CBU de origen es atributo de la cuenta bancaria propia de M14; `bankAgreements[].treasuryAccountId` la referencia y `originCbu` se lee de M14 (no se duplica). PRM-SUE-004, 005, 014 y 025 quedan `Reemplazado por treasuryAccountId (M14)`; la migración (T07) carga cada CBU en la cuenta propia correspondiente. Los identificadores de empresa y códigos de convenio (326, 2449, 2672, 2943, 2944) siguen en SUE. | Dueño de datos (DEC-003, AGR-002) |
| CTR-SUE-21 | T04b (V2 2288 → PRM-TES-P4-030 `tes.transfer.allowEditDate`, tenant, auditado, nunca en período cerrado) vs PRM-SUE-008 (`sue.payment.allowTransferDateEdit`, empresa) | Dueño del permiso de modificar la fecha de transferencia. | El parámetro es de M14 (PRM-TES-P4-030); SUE lo consulta al crear la solicitud de pago y PRM-SUE-008 queda como alias de lectura sin valor propio. | Dueño de datos (DEC-003) |
| CTR-SUE-22 | T04b (V2 2714 → PRM-CON-P4-057 `con.costCenter.mode` = `off`/`all`/`payrollOnly`) vs PRM-SUE-034 (`sue.accounting.useCostCenters`, lógico por empresa) | Dueño de la distribución por centros de costo. | Dueño M15: SUE distribuye por `employeeCostAllocations` cuando el modo es `all` o `payrollOnly`; PRM-SUE-034 es alias de lectura. | Dueño de datos (DEC-003, DEC-009) |
| CTR-SUE-23 | RN-08 §6.6 (P2207: 1 = asiento de recibos + asiento de contribuciones; 2 = asiento por sindicato; 3 = personalizado `SU_ASIENTOS`), T04b PRM-SUE-P4-002 (`format1..3` [VERIFICAR]) vs PRM-SUE-002 (`summaryByAccount`, `byCostCenter`, `byEmployee`) | Significado de los formatos de asiento y su migración. | Se separan dos dimensiones: **origen de cuentas** (cascada de RN-SUE-087 o reglas personalizadas) y **agregación** (PRM-SUE-002). Migración: 1 → `summaryByAccount` con contribuciones en asiento separado; 2 → cascada por sindicato (`unions.generalAccountId`/`chargesAccountId`) con `summaryByAccount`; 3 → `payrollAccountingRules` migradas desde `SU_ASIENTOS` con su `entryFormat`. Resuelve el [VERIFICAR] de T04b. | RN-08 (código) sobre descripción; modelo de M16 |
| CTR-SUE-24 | T04b PA-CFG-P4-05 (topes V2 2437/2438: tabla legal de plataforma **con override del tenant auditado**, recomendada) vs RN-SUE-012 y RN-SUE-075 (el tenant adopta y no edita) | Override del tenant sobre tablas legales. | Se adopta PA-CFG-P4-05 A: la tabla oficial no se modifica; la empresa puede registrar un override excepcional con motivo, vigencia, aprobación (T11) y auditoría, marcado como advertencia en LSD, SICOSS y en el control de totales (RF-SUE-099). | T04 transversal dueño de tablas legales (DEC-001/guía §5) |
| CTR-SUE-25 | T04b (claves y defaults: 3107 `pendingSignatureReminderDays` entero con default 0; 3129 default `false`; 2886 `requireDigitalSignature` invertido con default `true`; claves distintas para 2468, 2484, 2598, 2611 `janDecByPaymentDate`, 2751, 3016, 3065) vs §14 PRM-SUE-024 (`true`) + PRM-SUE-049 (3 días), PRM-SUE-020 (`true`), PRM-SUE-016 (`false`) y sus claves | Nomenclatura y valores por defecto. | Las claves canónicas son las de §14 (SUE es dueño); las de T04b se registran como alias de migración. Los tenants migrados conservan el valor efectivo de ProCoop; los nuevos usan el default de §14. 3107 = 0 → PRM-SUE-024 `false`; 3107 = n > 0 → PRM-SUE-024 `true` y PRM-SUE-049 = n. 2886 y PRM-SUE-016 son equivalentes (semántica inversa). Valor canónico de 2611: `janDecByPayDate`. T04b debe alinearse en su próxima revisión. | Dueño de datos (DEC-003) |
| CTR-SUE-26 | T04b (V2 2481 y 2685: «Reemplazado — filtro por defecto / vista guardada del `DataTable`») vs PRM-SUE-017 (parámetro de tenant) | Implementación del filtro de conceptos activos. | PRM-SUE-017 se implementa como vista guardada por defecto del `DataTable` de conceptos a nivel tenant (mismo criterio que PRM-SUE-021); no es un parámetro de negocio. | CNX §4 (UI/UX) |
| CTR-SUE-27 | T04b (V2 2376 → `con.periodLocks` módulo `sue`; PA-CFG-P4-03) vs CTR-SUE-09 / RN-SUE-068 (`payPeriods`) | Cierre de sueldos. | Coexisten: `payPeriods` es el estado operativo por empresa y frecuencia; cerrar un período crea o actualiza el bloqueo `con.periodLocks` del módulo `sue` (PA-CFG-P4-03 A) y el bloqueo contable general prevalece (`con.period.closed`, §12.2). | T04/M15 dueño de bloqueos; DEC-009 |
| CTR-SUE-28 | T04b (V2 2034 → PRM-CMP-P4-013 `cmp.payment.salaryAdvanceConceptId`, concepto de **compras**; V2 2366 «integración Compras–Sueldos por eventos») vs PRM-SUE-030 (`sue.advance.conceptId`, concepto de **sueldos**) y RN-SUE-085 | Concepto del adelanto. | Son conceptos distintos: PRM-SUE-030 es el concepto de descuento del recibo (330); PRM-CMP-P4-013 solo se usa si PA-SUE-05 se resuelve por B (empleado-proveedor). Con la opción A el adelanto es un pago de M14 que emite `tes.advance.paid` (EVT-TES-23) y SUE crea el plan de descuento (§12.2, RN-SUE-049). | BASE SUE-009 + PA-SUE-05 |
| CTR-SUE-29 | `employers` de este anexo vs DEC-064 y T04 `legalEntities` | Dos registros de la misma persona jurídica (empresa empleadora y entidad emisora). | El empleador es la entidad jurídica: subdocumento `employer` de `legalEntities` (T04), `legalEntityId` en legajos, períodos, liquidaciones, recibos, presentaciones y pagos; tablas legales de §7.45 en T04 §7.17. | DEC-064; CTR-DAT-06; CTR-DAT-73 |

## 21. Preguntas abiertas

### PA-SUE-01 — Momento de reemplazo del sistema laboral en la piloto
- **Pregunta:** ¿La cooperativa piloto reemplaza su sistema laboral con la liquidación propia o arranca importando su liquidación externa?
- **Contexto:** BASE §104.6 y §106 piden decidirlo; la liquidación propia está en O9 y la importación (CU-28) puede estar en O8.
- **Opciones:**
  - A) Importación externa desde O8 y liquidación propia en O9 con dos períodos en paralelo antes de reemplazar **(Recomendada)** — el ERP se contabiliza sin esperar a O9 y el reemplazo se valida con datos reales.
  - B) Liquidación propia directa en O9 sin paralelo — menor esfuerzo, mayor riesgo de diferencias.
  - C) Mantener el sistema externo de forma indefinida — sueldos solo importados; se desaprovecha el módulo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-140 a 145; O8, O9.
- **Estado:** Respondida (DEC-058): O8 importa la liquidación del sistema externo; O9 liquida con el módulo propio con dos períodos en paralelo (opción A).

### PA-SUE-02 — Alcance del cálculo de seguridad social y F.931
- **Pregunta:** ¿El sistema solo prepara archivos (LSD y SICOSS) o también calcula aportes y contribuciones y controla el F.931?
- **Contexto:** ProCoop delega todo el cálculo en SICOSS (RN-08 §11.6); SUE-007 menciona aportes, contribuciones y F.931.
- **Opciones:**
  - A) Calcular aportes y contribuciones para asiento, provisión y control; generar LSD y SICOSS; el F.931 se obtiene y presenta en ARCA con acuse cargado en el sistema **(Recomendada)** — asiento exacto y control de diferencias sin asumir la presentación.
  - B) Solo archivos, como ProCoop — asiento de contribuciones estimado.
  - C) Calcular y presentar automáticamente por web service — mayor riesgo y dependencia de credenciales del contribuyente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-096, RN-SUE-080, RF-SUE-118.

### PA-SUE-03 — Lenguaje de fórmulas
- **Pregunta:** ¿Qué lenguaje usan las fórmulas de conceptos?
- **Contexto:** ProCoop usa expresiones DevExpress con funciones propias (RN-08 §15.6); hay que migrar fórmulas existentes y evitar ejecutar código arbitrario.
- **Opciones:**
  - A) Lenguaje propio seguro (interpretado, sin acceso a código) con las funciones de dominio y un traductor asistido de fórmulas ProCoop en la migración **(Recomendada)** — seguridad, trazabilidad y migración controlada.
  - B) Compatibilidad sintáctica total con ProCoop — migración directa, pero arrastra limitaciones.
  - C) Solo conceptos parametrizados sin fórmulas libres — más simple, insuficiente para convenios.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-039, RF-SUE-040, §19.

### PA-SUE-04 — Firma de recibos
- **Estado:** Resuelta por DEC-078: firma digital con proveedor licenciado para recibos de sueldo, con la interfaz y los perfiles de firma de T11.
- **Pregunta:** ¿Qué firma se usa en los recibos digitales?
- **Contexto:** SUE-008 pide firma «cuando la normativa lo admita»; la admisión del recibo digital depende de normas nacionales y provinciales [VERIFICAR]; ProCoop usa un proveedor de firma (FIC 15).
- **Opciones:**
  - A) Firma electrónica del empleado (conformidad con OTP, hash y sello de tiempo) y firma digital del empleador con proveedor, configurable por empresa **(Recomendada)** — cubre la mayoría de los casos y permite elevar a firma digital donde se exija.
  - B) Firma digital certificada para ambas partes — más costo y fricción para el empleado.
  - C) Solo constancia de recepción, con recibo en papel firmado — menor riesgo normativo, sin despapelización.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-105, PRM-SUE-039, JOB-SUE-04.

### PA-SUE-05 — Modelo del pago de haberes
- **Pregunta:** ¿Cómo se representa al empleado en el pago?
- **Contexto:** ProCoop da de alta al empleado como proveedor y le genera una factura de compra (RN-08 §11.5).
- **Opciones:**
  - A) Beneficiario propio en una solicitud de pago de haberes a M14, sin proveedor ni factura **(Recomendada)** — evita mezclar compras con sueldos y protege la privacidad.
  - B) Replicar el modelo de proveedor — compatibilidad con ProCoop, mezcla datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-112, RN-SUE-085, §19.

### PA-SUE-06 — Descuento de deuda de servicios del empleado
- **Pregunta:** ¿Se permite descontar del recibo la deuda de servicios del empleado con la cooperativa?
- **Contexto:** ProCoop tiene la función `ImporteFacturasAdeudadas`; la LCT limita los descuentos (art. 132–133).
- **Opciones:**
  - A) Permitido solo con autorización escrita del empleado registrada, dentro del límite legal, desactivado por defecto **(Recomendada)** — conserva la función con resguardo legal.
  - B) No permitirlo — más simple; se pierde una facilidad usada.
  - C) Permitirlo sin autorización — riesgo legal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-014, RF-SUE-083, RN-SUE-029, EVT-SUE-26.

### PA-SUE-07 — Asignaciones familiares
- **Pregunta:** ¿El sistema liquida asignaciones familiares a cargo del empleador?
- **Contexto:** ProCoop registra familiares «(Ganancias, salario familiar)»; la mayoría de los empleadores está en el régimen de pago directo de ANSES (SUAF) [VERIFICAR para la piloto].
- **Opciones:**
  - A) Solo datos informativos para SUAF; conceptos de pago directo disponibles pero desactivados **(Recomendada)** — cubre el caso general sin complejidad innecesaria.
  - B) Liquidar asignaciones como concepto del recibo — solo si la cooperativa está en un régimen que lo exige.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-005.

### PA-SUE-08 — Profundidad de RRHH en O9
- **Pregunta:** ¿Evaluaciones de desempeño y objetivos entran en O9 o se difieren?
- **Contexto:** SUE-012 los incluye con GLM como referencia; sanciones, accidentes y juicios impactan la liquidación y la contabilidad; evaluaciones y objetivos no.
- **Opciones:**
  - A) Sanciones, sumarios, accidentes y juicios en O9 (Núcleo/Estándar); evaluaciones y objetivos en O9 como Extensión al final de la ola, desactivados por defecto **(Recomendada)** — prioriza lo que afecta al cálculo.
  - B) Todo en O9 con la misma prioridad.
  - C) Evaluaciones y objetivos en O11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-127, RF-SUE-128, PRM-SUE-055.

### PA-SUE-09 — Fichadas de reloj
- **Pregunta:** ¿Cómo ingresan las fichadas?
- **Contexto:** ProCoop tiene lector de fichadas (`SU_HORAS_LECTOR`); el agente de hardware local está previsto en O10 (DEC-007).
- **Opciones:**
  - A) Importación de archivo o API del proveedor del reloj en O9; agente local en O10 **(Recomendada)** — no adelanta el agente local.
  - B) Agente local en O9.
  - C) Sin fichadas; solo novedades.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-052, PRM-SUE-044, JOB-SUE-17.

### PA-SUE-10 — Conservación de datos laborales
- **Pregunta:** ¿Cuánto tiempo se conservan legajos, recibos y datos sensibles tras el egreso?
- **Contexto:** AGR-033 y BASE §98 piden fijar plazos; inciden la prescripción laboral, las obligaciones de la seguridad social y la Ley 25.326 [VERIFICAR con asesor].
- **Opciones:**
  - A) Recibos, liquidaciones y presentaciones 10 años; legajo 10 años; datos de salud minimizados y eliminados a los 5 años salvo litigio **(Recomendada)** — cubre plazos habituales con minimización.
  - B) Conservación indefinida — mayor riesgo de privacidad.
  - C) Plazo que fije cada tenant sin mínimo — riesgo de incumplir obligaciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-SUE-058, RF-SUE-020.

### PA-SUE-11 — Pluriempleo dentro del tenant
- **Pregunta:** ¿Se admite que una persona tenga relaciones laborales simultáneas con dos empresas del mismo tenant?
- **Contexto:** El tenant puede tener varias empresas empleadoras; ProCoop exige legajo único por empresa.
- **Opciones:**
  - A) Sí, un legajo por empresa, con Ganancias del agente designado y «otros empleos» en la otra **(Recomendada)** — refleja la norma.
  - B) No; una persona solo en una empresa del tenant — más simple, limita casos reales.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-024, CU-SUE-14.

### PA-SUE-12 — Automatismo de novedades desde la operación
- **Pregunta:** ¿Las novedades que nacen en OT, cuadrillas y flota se proponen automáticamente?
- **Contexto:** CU-104 importa guardias desde OT; las horas deben revisarse por el encargado.
- **Opciones:**
  - A) Propuesta automática en borrador al cerrar OT/partes (flota a pedido), con aprobación del encargado y consolidación del liquidador **(Recomendada)** — menos carga manual con control.
  - B) Solo importación a pedido del liquidador.
  - C) Aprobación automática sin revisión — riesgo de pagar horas mal cargadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-049, RF-SUE-050, PRM-SUE-042/043.

### PA-SUE-13 — Regímenes alternativos de indemnización
- **Pregunta:** ¿Se soportan fondos o sistemas de cese alternativos que habilite un convenio?
- **Contexto:** La Ley 27.742 habilita sistemas de cese por convenio [VERIFICAR]; la piloto puede no estar alcanzada.
- **Opciones:**
  - A) Soportarlos como plantilla de motivo de egreso y concepto configurable, no por defecto **(Recomendada)** — sin desarrollo específico.
  - B) Desarrollo específico con aportes mensuales al fondo.
  - C) No soportarlos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-SUE-059, RF-SUE-073.

### PA-SUE-14 — Tratamiento de retroactivos
- **Pregunta:** ¿Cómo se liquidan los aumentos retroactivos de paritarias?
- **Contexto:** Las escalas se publican con fecha efectiva pasada; el LSD distingue período de devengamiento y pago.
- **Opciones:**
  - A) Liquidación complementaria en el período actual con devengamiento del período original, y rectificativa de presentaciones solo cuando la norma lo exija **(Recomendada)** — práctica habitual y trazable.
  - B) Reliquidar (rectificar) cada período afectado.
  - C) Pagar la diferencia como concepto del mes sin devengamiento separado — simple, distorsiona Ganancias y LSD.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-076, §9.3.

### PA-SUE-15 — Asociados de cooperativas de trabajo
- **Pregunta:** ¿Se incluirá a futuro la liquidación de retiros de asociados de cooperativas de trabajo?
- **Contexto:** BASE §104.3 los excluye «salvo decisión posterior».
- **Opciones:**
  - A) Fuera del módulo; si se requiere, como pago institucional en M17 **(Recomendada)** — evita confundir relación asociativa con laboral.
  - B) Incluir un tipo de liquidación «retiro de asociado» en SUE en una ola posterior.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §2.2.

### PA-SUE-16 — Dueño de las pantallas del empleado (PA 17 del pendiente de cierre)
- **Pregunta:** ¿Las pantallas de autoservicio del empleado (recibos, licencias, datos, equipo, certificados, evaluaciones) son de M16 o de M19?
- **Contexto:** M16 declara PAN-SUE-41 a PAN-SUE-46 y M19 declara PAN-POR-69 a PAN-POR-76 para las mismas funciones, con rutas distintas (`/empleado/...` y `/app/empleado/...`).
- **Opciones:**
  - A) M16 es dueño del contenido, las reglas y las API (PAN-SUE-41 a PAN-SUE-46, API-SUE-78 a API-SUE-81); M19 es dueño de la ruta publicada en la PWA y la incrusta (HUE-SRV-04) **(Recomendada)**.
  - B) M19 es dueño de todo y M16 solo expone API.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PAN-SUE-41 a PAN-SUE-46; PAN-POR-69 a PAN-POR-74 de M19.
- **Estado:** Asumida la recomendada (DEC-072). La ruta publicada es la de M19; la de M16 queda como referencia. PAN-SUE-44 a PAN-SUE-46 no tienen PAN-POR propia en M19.

### PA-SUE-17 — Estados de notificación de recibo, evaluación y objetivo (PA 19 del pendiente de cierre)
- **Pregunta:** ¿Se confirman los estados propuestos para `payslipNotifications`, `performanceReviews` y `objectives`?
- **Contexto:** el §7 declaraba `status` sin valores; la corrección del 05-11-2026 propuso valores con `[VERIFICAR]` en §8.12.8 a §8.12.10.
- **Opciones:**
  - A) Confirmar los valores y transiciones de §8.12.8 a §8.12.10 **(Recomendada)**.
  - B) Derivar el estado de las fechas (`sentAt`, `viewedAt`, `signedAt`, `feedbackAt`) sin campo `status`.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §8.12.8 a §8.12.10.
- **Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de esas secciones.

### PA-SUE-18 - Residuales del 05-11-2026 (estados, referencias y nombres de campo)
- **Pregunta:** ¿Cómo se cierran los residuales de M16 que detectaron los entregables regenerados?
- **Contexto:** el índice de estados marcó máquinas sin estado inicial (§8.2, §8.6 a §8.11), `noveltyImportBatches` con valores sin transiciones y `shifts` y `extraTasks` con `status` sin valores; el modelo entidad-relación dejó referencias sin destino; T05 declara campos clave (`code`, `number`, `storedFileId`, `signatureRequestId`, `salaryCategoryId`, `fileLayoutId`, `dossierId`) que este §7 no tenía.
- **Opciones:**
  - A) Estado inicial explícito; §8.12.11 a §8.12.13; `shifts` como maestro (`active`, `inactive`) y `extraTasks` con `draft`, `confirmed`, `voided`; destinos o "no es referencia" en cada campo; filas nuevas con los nombres de T05 y alias para los nombres de este anexo (`fileRef` = `storedFileId`, `sourceRef` = `workOrderId`) **(Recomendada)**.
  - B) Mantener el texto y resolver en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7, §8.
- **Estado:** Asumida la recomendada (DEC-072). `vepRef` → `paymentExecutions` (M14) debe confirmarlo M14; los valores de `extraTasks.status` deben validarse con el liquidador piloto.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `employeePayAccounts` agrega `cbuHmac` y su índice único pasa a `{tenantId, employeeId, cbuHmac}` (antes con `cbu`), como T05 COL-SUE-06; `laborLawsuits` ya usaba `number` (PA-DAT-04).
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M16 declara en §12.1 EVT-SUE-28 `sue.payrollFiles.requested` (antes `sue.payroll-files.requested`, nombre que solo figuraba en T06 §12), publicado al pedir un archivo de `statutoryFilings` por empresa y período; payload `statutoryFilingId`, `legalEntityId`, `kind`, `periodKey`, `payrollRunIds`; consumidor T06. La presentación y el acuse siguen manuales (RN-SUE-080). T11 §12.4 registra el alias.

## 22. Trazabilidad de fuentes

### 22.1. BASE

| Fuente | Destino en este anexo |
|---|---|
| §28 Objetivo | §1; CTR-SUE-01 |
| §28 Precisión 0.17 | §1, §2; CTR-SUE-01 |
| §28 Límite («opcional pendiente de alcance… no implica implementar normas») | CTR-SUE-01 (reemplazado por §104) |
| §28 Alcance funcional (legajos, novedades, licencias, conceptos, simulaciones, liquidaciones, recibos, contabilización) | RF-SUE-002 a 146 |
| §28 Integrar el sistema existente / evidencia insuficiente | RF-SUE-140 a 144; PA-SUE-01 |
| §28 CU-28 (situación, pasos 1-3, resultado, excepción) | CU-28 (§16); RF-SUE-121, 140–144; RN-SUE-090/091; §9.11; ESC-SUE-09/10 |
| §28 Datos de precarga (NOM-DEMO-2026-11, 2 legajos, ARS 2.000.000) | §18; RF-SUE-140 |
| §104.1 Decisión y referencias (GLMSUIT RRHH [MER19], ProCoop [F5]) | §1; RF-SUE-127 a 132; CTR-SUE-01/02 |
| §104.2 Objetivo | §1 |
| §104.3 Límite: parametrización por tenant validada por responsable | RF-SUE-027; RN-SUE-013; §2.1 |
| §104.3 Tablas oficiales comunes de plataforma | RF-SUE-034, 035, 085; RN-SUE-012, 075; §7.45; CTR-SUE-06 |
| §104.3 Cooperativas de trabajo fuera | §2.2; PA-SUE-15 |
| §104.3 Honorarios de consejeros y síndicos → §27 | §2.2, §2.3 |
| §104.3 Datos laborales y de salud restringidos | RF-SUE-020, 064, 134, 139; RN-SUE-093; §4 |
| SUE-001 Legajo | RF-SUE-001 a 021; §7.2–7.13 |
| SUE-002 Estructura laboral | RF-SUE-026 a 036; §7.14–7.20 |
| SUE-003 Novedades (horas extra, guardias, ausencias, licencias, vacaciones, adelantos, embargos, cuotas alimentarias, préstamos; desde cuadrilla, OT, flota) | RF-SUE-016, 046 a 057, 081; §9.4 |
| SUE-004 Conceptos y fórmulas versionadas con simulación | RF-SUE-037 a 045; RN-SUE-016 a 035; §9.2 |
| SUE-005 Liquidaciones (mensual, quincenal, SAC, vacaciones, final LCT, complementarias, rectificativas) | RF-SUE-066 a 084; RN-SUE-053 a 068; §9.6–9.7 |
| SUE-006 Ganancias 4.ª (RG 4003 y modif., SIRADIG, anual y final) | RF-SUE-085 a 095; RN-SUE-069 a 074 |
| SUE-007 Seguridad social y presentaciones (F.931, LSD RG 3781, formatos ARCA) | RF-SUE-096 a 103; RN-SUE-075 a 080; PA-SUE-02 |
| SUE-008 Recibos y portal (LCT, entrega digital, firma, vacaciones, licencias, identidad AGR-006) | RF-SUE-104 a 111; RN-SUE-081 a 084; PAN-SUE-41 a 46; PA-SUE-04 |
| SUE-009 Pago de haberes (archivo bancario, OP a tesorería, conciliación) | RF-SUE-112 a 116; RN-SUE-085/086; §9.9; PA-SUE-05 |
| SUE-010 Contabilización (devengamiento y pago, centro de costo, servicio, planes y escenarios) | RF-SUE-117 a 121; RN-SUE-087 a 089 |
| SUE-011 Certificaciones y egreso (art. 80, constancias, baja registral) | RF-SUE-122 a 126; §9.10 |
| SUE-012 RRHH GLM (evaluaciones, objetivos, sanciones, sumarios, accidentes ART, juicios MER-006) | RF-SUE-127 a 132; §7.43; PA-SUE-08 |
| SUE-013 Aprobaciones MER-012 con separación de funciones | RF-SUE-055, 078, 133; RN-SUE-066; §4 |
| SUE-014 Reportes (costo laboral, ausentismo, horas extra, proyección AGR-028) | RF-SUE-135 a 139; §15 |
| §104.5 CU-104 (pasos 1-4 y datos ficticios) | CU-104 (§16); §9.4, §9.6, §9.9; §18 |
| §104.6 Prioridad (decidir entrega; modelo desde el inicio) | RF-SUE-001 (O3); PA-SUE-01; CTR-SUE-19 |
| §97.1 Protección de datos (inventario, consentimientos, derechos, sensibles, minimización IA, datos de prueba ficticios) | RF-SUE-020, 040, 139; RN-SUE-035, 093; ESC-SUE-27/28; §18; PA-SUE-10 |
| MER-015 Flota (uso por OT, costo, seguimiento) — novedades | RF-SUE-050; §9.4 |
| MER-012 Workflow de autorizaciones | RF-SUE-133; §2.3 |
| MER-006 Gestión judicial | RF-SUE-132 |
| §98 Ley 25.326 / contrato de encargo; plazos de conservación | PA-SUE-10; §2.3 (T08) |
| §98 «Consolidar cada módulo… asignar identificadores» | Este anexo (IDs RF/RN/PRM) |
| §99.3 fila «Nómina y libro de sueldos digital» | RF-SUE-098; CTR-SUE-02 |
| §99.4 conclusión «Nómina» | CTR-SUE-02 |
| §102 correspondencia «104 → AGR-002, 003, 010, 016, 035» | AGR-002: §2.3; AGR-003: §8; AGR-010: RF-SUE-010, RN-SUE-004; AGR-016: RN-SUE-037, §11 idempotencia; AGR-035: ESC-SUE-28, §18 |
| §105 solución 7 (impuestos de sueldos; el sistema prepara, presenta el contribuyente) | §2.2; RF-SUE-103 |
| §106 «Relevar convenios… decidir entrega» | PA-SUE-01; RF-SUE-027 |
| §106 «Ver demo de GLMSUIT RRHH y de ProCoop» | PA-SUE-08 (contraste pendiente) |
| §106 Fuente [MER19] | Encabezado (fuentes) |

### 22.2. AGR

| Fuente | Destino |
|---|---|
| AGR-006 Identidad común con pertenencias | RF-SUE-111; RN-SUE-003; ESC-SUE-25; CTR-SUE-05 |
| AGR-009 Publicación segura de configuración | RF-SUE-041; RN-SUE-033/034; §7.24; §8.2; §9.2; ESC-SUE-11 |
| AGR-033 Privacidad, conservación y salida | RF-SUE-020, 134, 139; PA-SUE-10 |
| AGR-028 Presupuestos | RF-SUE-137; EVT-SUE-25; JOB-SUE-20 |
| AGR-008 (separación de funciones, citado) | §4; RN-SUE-066 |

### 22.3. DFA Módulo 20 «Sueldos y personal (C)»

| Elemento | Destino |
|---|---|
| Empleados (`SU_EMPLEADOS`, `_DOCUMENTOS`, `_SEC`) | RF-SUE-002, 007, 008 |
| Familiares | RF-SUE-005 |
| CBU | RF-SUE-006 |
| Novedades | RF-SUE-047 |
| Turnos | RF-SUE-009 |
| Historial de categoría | RF-SUE-010 |
| Situación de revista | RF-SUE-011 |
| Licencias | RF-SUE-058 a 065 |
| Empresas empleadoras y tipo de empleador | RF-SUE-022 a 025 |
| Recibos de sueldo (`SU_SUELDOS`, `SU_SUELDOSIT`, `SU_TIPO_RECIBOS`) | RF-SUE-042, 104 |
| Liquidación masiva y simulador | RF-SUE-067, 070 |
| Impuesto a las Ganancias (`SU_DEDUCCIONES*`, `SU_SUELDOS_DETGAN`) | RF-SUE-085 a 095 |
| Configuración: variables, conceptos, aplicar aumentos, categorías, cargos, sindicatos, salario mínimo | RF-SUE-026 a 045 |
| Seguridad social: SICOSS (`SU_BENEFICIOS_SICOSS`), ART / siniestros | RF-SUE-035, 097, 102 |
| Asientos de sueldos (`SU_ASIENTOS`) | RF-SUE-117, 118 |
| Libro de sueldos digital (deshabilitado en DEMO) | RF-SUE-098; CTR-SUE-10 |
| Mejora: evaluar liquidador externo | CTR-SUE-02; RF-SUE-140 |
| Mejora: portal del empleado con recibos y firma digital | RF-SUE-105, 107; CTR-SUE-11 |

### 22.4. REL (pestaña Sueldos)

| Función | Destino |
|---|---|
| Administración: Empleados | PAN-SUE-02/03/04 |
| Administración: Empresas | PAN-SUE-05 |
| Administración: Recibos | PAN-SUE-27 |
| Procesos: Liquidación Masiva | PAN-SUE-24/25 |
| Procesos: Simulador | PAN-SUE-26 |
| Procesos: Impuesto a las Ganancias | PAN-SUE-29 |
| Configuración: Variables | PAN-SUE-12 |
| Configuración: Conceptos | PAN-SUE-13 |
| Configuración: Aplicar Aumentos | PAN-SUE-16 |
| Informes: Informes de Sueldos | PAN-SUE-38; §15 |
| Informes: Libro sueldo digital (deshabilitado) | PAN-SUE-30; RF-SUE-098 |

### 22.5. RN-08 (tesorería, contabilidad, compras, stock, sueldos)

| Sección / regla | Destino |
|---|---|
| §11.1 Modelo (empleado-proveedor, empresas, sindicatos, categorías con antigüedad y vacaciones, extras, novedades, tipos de recibo, conceptos) | §7; RN-SUE-085 (empleado-proveedor reemplazado); RF-SUE-015, 026–030, 042 |
| §11.1 Aumentos por convenio | RF-SUE-043; RN-SUE-014 |
| §11.2 Tipos de concepto, vigencia, fórmulas, orden, tipos de liquidación, liquidar siempre, Ganancias, SICOSS, F.1357, subsistemas | RF-SUE-038; RN-SUE-016 a 019 |
| §11.3 Pasos 1-4 de liquidación (armado, evaluador, GetItems, redondeo P3016, GenerarRecibo, novedad 27 con P2611, simulación) | RF-SUE-068 a 070, 044, 056; RN-SUE-021, 022, 050, 054, 055 |
| §11.3 Ganancias (deducciones anuales, tramas, cálculo, hijos, diferencias Excel, SIRADIG P2763, P2611) | RF-SUE-085 a 092; RN-SUE-069 a 073, 052 |
| §11.4 Novedades (cantidad/importe, cuotas, topes, fichadas, Excel, anticipos), licencias, firma de recibos, P2886 | RF-SUE-046 a 054, 058 a 060, 105, 107; RN-SUE-036, 047, 082 |
| §11.5 Pago de sueldos (factura al empleado-proveedor, adelantos, OP, P2288, archivos bancarios P2262/2406/2449/2671/2672/2944/2468/3129) | RF-SUE-112, 113; RN-SUE-085, 086; PRM-SUE-003 a 027; CTR-SUE-04 |
| §11.6 SICOSS/F.931 (TXT, topes P2437/P2438, sin cálculo propio) | RF-SUE-096, 097; RN-SUE-075, 076, 080; CTR-SUE-03 |
| §11.6 Importación de tablas SICOSS | RF-SUE-035 |
| §11.6 LSD (registros 1-5, P3065) | RF-SUE-098; RN-SUE-077 |
| §11.6 F.1359 (P519) | RF-SUE-089; RN-SUE-074; CTR-SUE-18 |
| §12.1 P2034 (concepto adelanto), P2538 (tipo de novedad adelanto) | PRM-SUE-030, 031 |
| §12.3 P2207 (formato de asiento) | PRM-SUE-002; RN-SUE-088 |
| §12.3 P2547 / P2714 (secciones general / sueldos) | PRM-SUE-034 |
| §12.3 P2166, P2167, P2722, P2723 (horas de OT) | PRM-SUE-036 (referencia; dueño M10/M15) |
| §12.3 P2978 (decimales de distribución) | RN-SUE-089 |
| §12.4 P518 / P519 (nombre y CUIT) | PRM-SUE-032 |
| §12.4 P2653 / P2709 (ocultar empleados en compras) | PRM-SUE-035; RN-SUE-092 |
| §12.5 completa (2611, 2538, 2763, 3016, 2288, 2886, 2437/2438, 3065, bancos, 2468, 3129, 2376) | §14 PRM-SUE-001 a 031 |
| §13.1 Contabilidad en línea | RN-SUE-088; CTR-SUE-07 |
| §13.3 Cierre de períodos unificado | RF-SUE-066; RN-SUE-068; CTR-SUE-09 |
| §13.10 Sueldos: construir o integrar | CTR-SUE-02; PA-SUE-02 |
| §13.11 Migración (mapeo de claves) | §19 |
| §14 duda 10 (¿liquidan en ProCoop o externo?, convenios, volumen) | PA-SUE-01 |
| §14 duda 11 (F.931 solo TXT) | PA-SUE-02 |
| §14 duda 6 (firmas de OP) | Fuera de SUE (M14) |
| §15.2 Resolución de cuentas, fila Sueldos | RN-SUE-087; RF-SUE-117 |
| §15.6 `Impuesto_Cedular` | RN-SUE-031; RF-SUE-094 |
| §15.6 `Ganancias_ImporteRetencion`, `_LiqFinal` | RN-SUE-030 |
| §15.6 `Ganancias_DeduccionesEspeciales`, `_Conyuge`, `_GananciaNoImponible` | RN-SUE-030 |
| §15.6 `Ganancias_TotalConcepto` | RN-SUE-030 |
| §15.6 `CorrespondeCobrarGanancias`, `2`, `PromedioGanancias` | RN-SUE-071; RF-SUE-093 |
| §15.6 `FechaDesde_DedEsp` | RN-SUE-070 |
| §15.6 `Recibos_Liquidados` | RN-SUE-026 |
| §15.6 `Campo_Calculadora_Ganancias` | RF-SUE-088 |
| §15.6 `Deduccion_Especial_Incrementada`, `Deduccion_Especial_DEIA1` | RN-SUE-030; RF-SUE-094 |
| §15.6 `OtrasDeducciones_Importe` | RN-SUE-030 |
| §15.6 `SAC` | RN-SUE-024 |
| §15.6 `Concepto_TotalImputado` y familia, `Imputado_Por_TipoConcepto` | RN-SUE-025 |
| §15.6 `Adelantos` | RN-SUE-028 |
| §15.6 `Total_NovedadesPeriodo`, `TotalTipoNovedad` | RN-SUE-027 |
| §15.6 `Basico_Categoria` | RN-SUE-023 |
| §15.6 `ImporteFacturasAdeudadas` | RN-SUE-029; PA-SUE-06 |
| §15.6 métodos de validación de operandos (sin regla) | RN-SUE-032 |
| §15.6 caché por empleado durante la liquidación | RN-SUE-022 |
| §15.6 `clsGanancias` (tablas anuales, corresponde retener, inicio de acumulado, promedios, métodos sin regla) | RN-SUE-069 a 073; RF-SUE-085 a 095 |
| §15.6 `clsEmpleados.VerificarEmpleado` (defecto clave DNI) | RN-SUE-003; CTR-SUE-05 |
| §15.6 `ExisteEmpleado` | RN-SUE-001 |
| §15.6 Cambio de categoría por antigüedad | RN-SUE-005; RF-SUE-017 |
| §15.6 Desvinculación y reincorporación | RN-SUE-010; RF-SUE-019, 126 |
| §15.6 F.572 / familiares | RN-SUE-009 |
| §15.6 Ganancias de otros empleadores (Caja de Córdoba fija) | RN-SUE-051; CTR-SUE-17 |
| §15.6 Documentación del empleado (defecto de transacción) | RN-SUE-008 |
| §15.6 `clsEmpleados` métodos sin regla | API-SUE-03 a 20 (ABM y consultas) |
| §15.6 `Get_DiasVacacionesPorCategoria` (defecto sin categoría) | RN-SUE-042 |
| §15.6 Aumentos masivos `GetImporteAumento` | RN-SUE-014 |
| §15.6 Tramas sin solapamiento | RN-SUE-069 |
| §15.6 Variables (nombre único, renombrado) | RN-SUE-020 |
| §15.6 `SolicitarLicencia` | RN-SUE-038 |
| §15.6 `AceptarLicencia`, `RechazarLicencia` | RN-SUE-039 |
| §15.6 `CalcularDiasDisponibles` (sin feriados) | RN-SUE-040, 041; CTR-SUE-16 |
| §15.6 `clsNovedades` resto (Excel, fichadas, calendario, cumpleaños, adjuntos, anticipos, horas no trabajadas) | RF-SUE-048, 052, 053, 054, 065, 017 |
| §15.6 `EliminacionMasiva_Recibos` (defecto) | RN-SUE-061; CTR-SUE-08 |
| §15.6 Recibo único | RN-SUE-053 |
| §15.6 `GenerarNovedad` (defecto diciembre) | RN-SUE-050; CTR-SUE-15 |
| §15.6 `AnularPago` | RF-SUE-115; RN-SUE-067 |
| §15.6 Firma digital (excluir firmados, lotes) | RN-SUE-081 |
| §15.6 `TotalAdelantos` | RN-SUE-028 |
| §15.6 `clsSueldos` resto (grillas, impresión, notificaciones, importar empresa) | PAN-SUE-25/27; RF-SUE-025, 106 |
| §15.6 Archivo regional de Luz y Fuerza (P2264 «DEAN») | RN-SUE-079; RF-SUE-101 |
| §15.6 Otras exportaciones (SICORE, F.1357, F.1359, bancos, LSD) | RF-SUE-089, 098, 100, 113 |
| §15.7 P2264, P2611, P2653, P3129 | PRM-SUE-033, 001, 035, 020 |

### 22.6. RN-09 grupo SUELDOS (28 parámetros)

| Parámetro | Destino | Parámetro | Destino |
|---|---|---|---|
| 326 | PRM-SUE-003 | 2611 | PRM-SUE-001 |
| 2207 | PRM-SUE-002 | 2671 | PRM-SUE-014 |
| 2262 | PRM-SUE-004 | 2672 | PRM-SUE-015 |
| 2406 | PRM-SUE-005 | 2685 | PRM-SUE-021 (Reemplazado) |
| 2437 | PRM-SUE-006 (Reemplazado por tabla oficial) | 2751 | PRM-SUE-022 |
| 2438 | PRM-SUE-007 (Reemplazado por tabla oficial) | 2763 | PRM-SUE-012 |
| 2449 | PRM-SUE-010 | 2886 | PRM-SUE-016 |
| 2468 | PRM-SUE-011 | 2942 | PRM-SUE-025 |
| 2481 | PRM-SUE-017 | 2943 | PRM-SUE-026 |
| 2484 | PRM-SUE-009 | 2944 | PRM-SUE-027 |
| 2538 | PRM-SUE-031 | 2985 | PRM-SUE-023 |
| 2598 | PRM-SUE-013 | 3016 | PRM-SUE-018 |
| 3065 | PRM-SUE-019 | 3081 | PRM-SUE-028 (Reemplazado: siempre integrado) |
| 3107 | PRM-SUE-024 | 3129 | PRM-SUE-020 |

Parámetros relacionados fuera del grupo: 2288 → PRM-SUE-008; 2376 → PRM-SUE-029 (Reemplazado por `payPeriods`); 2034 → PRM-SUE-030; 518/519 → PRM-SUE-032 (Reemplazado); 2264 → PRM-SUE-033 (Reemplazado); 2714/2547 → PRM-SUE-034; 2653/2709 → PRM-SUE-035 (Reemplazado por permiso); 2166/2167/2722/2723 → PRM-SUE-036 (referencia a M10/M15); 2978 → RN-SUE-089.

### 22.7. FIC

| Ficha | Destino |
|---|---|
| FIC 12 Sueldos (prioridad B; LSD, SICORE saliente; SICOSS entrante; F.572; pendiente externo) | §13; RF-SUE-086, 097, 098, 100; CTR-SUE-02 |
| FIC 15 Firma digital y electrónica (recibos de sueldo; `clsFirmaDigital`; proveedor pendiente) | RF-SUE-105; JOB-SUE-04; T11 RF-WFL-198, JOB-WFL-17/18; DEC-078 |

### 22.8. CAT §18 Sueldos (56 tablas)

| Tabla | Destino | Tabla | Destino |
|---|---|---|---|
| `SU_ACTIVIDADES` | `payrollOfficialCodes` (§7.45) | `SU_EMP_TURNOS` | `employeeShiftAssignments` (§7.10) |
| `SU_ANTIGUE` | `seniorityScales` (§7.17) | `SU_EXTRAS` | `extraItems` (§7.12) |
| `SU_ASIENTOS` | `payrollAccountingRules` (§7.39) | `SU_EXTRAS_GRUPOS` | `extraGroups` (§7.12) |
| `SU_AUDIT_TRA_INTERBANKING` | Log de M14 (§7.38, §19) | `SU_GRUPO_GRAFICO` | `reportGroups` (§7.44) |
| `SU_BENEFICIOS_SICOSS` | `payrollOfficialCodes` | `SU_HORAS_LECTOR` | `timePunches` (§7.28) |
| `SU_CARGO` | `positions` (§7.18) | `SU_LICENCIAS` | `leaveRequests` (§7.30) |
| `SU_CATE` | `salaryCategories` + `salaryScales` (§7.16) | `SU_LICENCIAS_CAUSAS` | `leaveCauses` (§7.30) |
| `SU_CONCEPTOS` | `payrollConcepts` (§7.22) | `SU_NOTIFICACIONES` | `payslipNotifications` + `payslips.signature` (§7.42, §7.34) |
| `SU_CONCEPTO_TIPO` | `payrollConcepts.payrollTypes[]` | `SU_OBRA` | `healthInsurerAdoptions` (§7.19) |
| `SU_CONDICION` | `payrollOfficialCodes` | `SU_SALARIO_MINIMO` | `minimumWages` (§7.45) |
| `SU_CONTRATACION` | `payrollOfficialCodes` | `SU_SINDICATO` | `unions` (§7.14) |
| `SU_DEDUCCIONES` | `incomeTaxDeductionTables` (§7.45) | `SU_SINIESTRADO` | `payrollOfficialCodes` |
| `SU_DEDUCCIONES_ESPECIAL` | `incomeTaxDeductionTables` | `SU_SITUACION_REVISTA` | `payrollOfficialCodes` |
| `SU_DEDUCCIONES_TIPOS` | `incomeTaxDeductionTables` | `SU_SIT_REVISTA_EMPLEADO` | `employmentStatusPeriods` (§7.11) |
| `SU_DESVICULACION` | `terminationReasons` (§7.20) | `SU_SUELDOS` | `payrollRuns` + `payslips` (§7.33, §7.34) |
| `SU_DESVIC_EXTRAS` | `terminationReasons.conceptTemplate[]` | `SU_SUELDOSIT` | `payslips.lines[]` |
| `SU_EMPLEADOS` | `employees` + `employeeAssignments` (§7.2, §7.3) | `SU_SUELDOS_DETGAN` | `incomeTaxCalculations` (§7.35) |
| `SU_EMPLEADOS_DOCUMENTOS` | `employeeDocuments` (§7.7) | `SU_TAREAS_EXTRAS` | `extraTasks` (§7.29) |
| `SU_EMPLEADOS_SEC` | `employeeCostAllocations` (§7.4) | `SU_TAREAS_EXTRAS_EMPLEADOS` | `extraTasks.workers[]` |
| `SU_EMPLEADOS_SUMSOC` | `employees.serviceAccountLinks[]` | `SU_TIPOEMPLEADOR` | `payrollOfficialCodes` |
| `SU_EMPRESAS` | `legalEntities.employer` (T04; esquema en §7.1) | `SU_TIPO_NOVEDADES` | `noveltyTypes` (§7.25) |
| `SU_EMP_CBU` | `employeePayAccounts` (§7.6) | `SU_TIPO_RECIBOS` | `payrollTypes` (§7.23) |
| `SU_EMP_EXTRAS` | `employeeExtras` (§7.12) | `SU_TRAMAS` | `incomeTaxScales` (§7.45) |
| `SU_EMP_FAMILIARES` | `employeeFamilyMembers` (§7.5) | `SU_TRAMAS_TIPOS` | `incomeTaxScales` |
| `SU_EMP_FAMILIARES_EXTRAS` | `employeeFamilyMembers.yearly[]` | `SU_TURNOS` | `shifts` (§7.10) |
| `SU_EMP_HISCAT_EMP` | `employeeAssignments` (§7.3) | `SU_TURNOSIT` | `shifts.items[]` |
| `SU_EMP_NOVEDADES` | `novelties` + `deductionPlans` (§7.26, §7.13) | `SU_VARIABLES` | `payrollVariables` (§7.21) |
| `SU_EMP_OBS` | `employeeNotes` (§7.8) | `SU_EMP_OPER` | `supervisionLinks` (§7.9) |

Total: 56 de 56 tablas mapeadas.

### 22.9. INV

| Clase / formulario | Destino |
|---|---|
| `ReglasNegocio.Sueldos.LibroSueldoDigital` (Get_Registro_Tipo1…Tipo5, Get_Sueldos, Get_TextoNumero) | RF-SUE-098; RN-SUE-077; JOB-SUE-10 |
| `clsAsientoSueldo` (AgregarItems, GridViewAsientos, ProximoIdAsiento, ActualizarOrden, GetNovedadesHorarios) | RF-SUE-117; PAN-SUE-32 |
| `clsCategorias` (AplicarAumentoSueldo_*, Get_DiasVacacionesPorCategoria, Get_SueldosActualizados_*) | RF-SUE-043; RN-SUE-014, 042 |
| `clsConceptos` (ActualizarNombreConcepto, ActualizarOrden, ExisteNombre, GetConceptosParaFormula, Get_Max_Orden) | RF-SUE-038; RN-SUE-020 |
| `clsDatosEmpleado` (CargarAntiguedad, CargarExtras, CargarNovedades, GetFormulaEmpleado, hijos en F.572) | RF-SUE-068; RN-SUE-073 |
| `clsEmpleados` (ABM, cuentas, familiares, turnos, documentos, desvinculación, importación, operarios, horas) | RF-SUE-002 a 021; RN-SUE-001 a 010 |
| `clsFormulas_Sueldo` | RN-SUE-023 a 032 |
| `clsGanancias` | RF-SUE-085 a 095 |
| `clsInformes_Sueldo` y `GetDatosInforme` (exportaciones bancarias, F.1357, F.1359, Interbanking, Luz y Fuerza, Macro, regional, SICORE, Santander, Sicoss, Sindicato, informes) | RF-SUE-089, 097, 100, 101, 113; §15. `Exportar_LibroIVADigital`: fuera de SUE (M06) |
| `clsNovedades` | RF-SUE-046 a 065 |
| `clsSueldos` | RF-SUE-066 a 084, 104 a 115 |
| `clsTramas`, `clsVariables` | RN-SUE-069, 020 |
| `PercepcionSICORE` (Exportar_Sueldos, Get_RetencionesSueldo, Get_SujetosSueldo) | RF-SUE-100; RN-SUE-078 |
| `clsFirmaDigital` (EnviarParaFirmar, ObtenerEstadoFirma, MarcarRecibosComoFirmados, EnviarSmsFirmados, HayRecibosDeSueldo, ActualizarEstado_RecibosSueldo) | RF-SUE-105; reemplazado por T11 (RF-WFL-197/198, JOB-WFL-17/18) |
| `clsCuentas_Asignadas.Sueldos_*` | RN-SUE-087 |
| `clsCierreDiario.GenerarAsientosSueldos` / `Sueldos_AsientoGeneral`, `FormatosAsientoSueldos` | RN-SUE-088; PRM-SUE-002 |
| `clsChequeosMenu.Opciones_Menu_Sueldo` | §10 (menú) |
| `Configuracion.frmEditorFormulas`, `frmAsistenteFormulas` | RF-SUE-040; PAN-SUE-13; RN-SUE-035 |
| `frmImportacionArchivos` (ImportarSicossDb, Importar_AnticiposSueldos, Importar_Deducciones_Especiales) | RF-SUE-035, 054, 095 |
| Operación «LIQUIDACION DE SUELDOS» (`OPERACIONES` 24) | RN-SUE-088 (tipo de operación del asiento en M15) |
| Clases auxiliares `Bancos_ArchivoSueldo`, `DatosSuSueldosIt`, `Listados_Sueldos`, `ReturnReciboSueldo`, `Sindicatos_ArchivoSueldo`, `Sueldo`, `SueldosActualizados`, `Sueldos_Totales` | DTO sin regla: cubiertos por RF-SUE-104, 113, 101, 043 y §15 |

### 22.10. Otros

| Fuente | Destino |
|---|---|
| Maestro CTR-GLB-04 (DFA prioridad C vs BASE §104) | CTR-SUE-02 |
| Maestro, tabla de módulos (M20 → M16 SUE, O9) | Encabezado (olas); CTR-SUE-19 |
| CNX (avisos multicanal) | CTR-SUE-14; RN-SUE-038 |
| DEC-097 (persona única en todos los maestros; contraste NucleoTransversal, aporte A5) y M01 RN-PER-135, RF-PER-174 | §2 (fila Persona); RF-SUE-004 (`context` con `legalEntityId`); RN-SUE-001 (un legajo no egresado por persona y empleador; varios empleadores admitidos); RN-SUE-002; §7.2 `employees.personId` e índice `{tenantId, personId, legalEntityId}` único parcial; §19 fila `SU_EMPLEADOS` |

### 22.11. T04b-CFG parte 4 (grupo SUELDOS y filas con anexo destino M16)

| ID T04b / V2 | Destino en este anexo |
|---|---|
| PRM-SUE-P4-001 (326) | PRM-SUE-003 |
| PRM-SUE-P4-002 (2207) | PRM-SUE-002; CTR-SUE-23 |
| PRM-SUE-P4-003 (2449) | PRM-SUE-010 |
| PRM-SUE-P4-004 (2468) | PRM-SUE-011; CTR-SUE-25 |
| PRM-SUE-P4-005 (2484) | PRM-SUE-009; CTR-SUE-25 |
| PRM-SUE-P4-006 (2538) | PRM-SUE-031 |
| PRM-SUE-P4-007 (2598) | PRM-SUE-013 |
| PRM-SUE-P4-008 (2611) | PRM-SUE-001; CTR-SUE-25 |
| PRM-SUE-P4-009 (2672) | PRM-SUE-015 |
| PRM-SUE-P4-010 (2751) | PRM-SUE-022 |
| PRM-SUE-P4-011 (2763; PA-CFG-P4-06) | PRM-SUE-012 (desactivado por defecto, compatibilidad; se adopta PA-CFG-P4-06 A) |
| PRM-SUE-P4-012 (2886) | PRM-SUE-016; CTR-SUE-25 |
| PRM-SUE-P4-013 (2943) | PRM-SUE-026 |
| PRM-SUE-P4-014 (2944) | PRM-SUE-027 |
| PRM-SUE-P4-015 (2985) | PRM-SUE-023 |
| PRM-SUE-P4-016 (3016) | PRM-SUE-018 |
| PRM-SUE-P4-017 (3065) | PRM-SUE-019 |
| PRM-SUE-P4-018 (3107) | PRM-SUE-024 + PRM-SUE-049; CTR-SUE-25 |
| PRM-SUE-P4-019 (3129) | PRM-SUE-020; CTR-SUE-25 |
| Reemplazados en T04b: 2262, 2406, 2671, 2942 (cuenta propia de M14) | CTR-SUE-20 |
| Plataforma en T04b: 2437, 2438 (PA-CFG-P4-05) | PRM-SUE-006/007; CTR-SUE-24 |
| Reemplazados en T04b: 2481, 2685 (`DataTable`) | PRM-SUE-017, 021; CTR-SUE-26 |
| Reemplazado en T04b: 3081 (persona única M01) | PRM-SUE-028; RN-SUE-002 |
| 2288 → PRM-TES-P4-030 (M14) | PRM-SUE-008 (alias); CTR-SUE-21 |
| 2714 → PRM-CON-P4-057 (M15) | PRM-SUE-034 (alias); CTR-SUE-22 |
| 2376 → `con.periodLocks` módulo `sue` (PA-CFG-P4-03) | PRM-SUE-029; RN-SUE-068; CTR-SUE-27 |
| 2034 → PRM-CMP-P4-013 (M12) | PRM-SUE-030; CTR-SUE-28 |
| 2366 Integración Compras/Sueldos (Reemplazado: eventos) | §12.2 `tes.advance.paid`; CTR-SUE-28 |
| 2020 / 2022 Jefe administrativo / Jefe de compras (cargo firmante, destino M17 con puestos de M16) | `positions` (§7.18) como dato de referencia; registro de autoridades en M17 |
| Totales T04b grupo SUELDOS: 28 de 28 | 19 migrados + 4 reemplazados por M14 + 2 plataforma + 2 `DataTable` + 1 persona única: todos con destino |

