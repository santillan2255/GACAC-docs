# Casos de prueba de aceptación — M10 TEC — Técnica, campo, agenda, instalación, GIS/redes, obras, aprovisionamiento TIC y telefonía

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M10-TEC-tecnica-campo-redes.md`](../../especificacion/anexos/M10-TEC-tecnica-campo-redes.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 239 CP de requisitos funcionales, 30 CP de escenarios ESC y 18 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M10 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Factibilidad (M10 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0001 | RF-TEC-001; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar solicitudes de factibilidad por servicio y operación (alta, traslado, reconexión, aumento de potencia/plan) desde CRM, admin o portal, con comprobante/numeración propia por punto de venta o secuencia del tenant. | Se crea con número único; sin punto de venta o secuencia válida se rechaza con error explícito. |
| CP-TEC-0002 | RF-TEC-002; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | Cargar persona existente o crear persona provisoria en M01 (prospecto) al registrar la factibilidad; si es nueva, copiar el domicilio de conexión como domicilio de contacto solo si el usuario lo confirma. | No se crean personas duplicadas por documento; se valida DNI/CUIT. |
| CP-TEC-0003 | RF-TEC-003; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Registrar domicilio de conexión georreferenciado (punto de prestación), catastro (circunscripción, sección, manzana, parcela, PH, lote), calles linderas (derecha, izquierda, atrás con números), barrio, zona-sector-recorrido de lectura y… | La factibilidad muestra punto en mapa con su estado (confirmado/aproximado/pendiente). |
| CP-TEC-0004 | RF-TEC-004; M10 §5.1; PRO-O3-04 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar observaciones administrativa, comercial y operativa y notas de seguimiento con título, texto, fecha, usuario y responsable. | Las notas son de solo agregado; no se editan ni borran. |
| CP-TEC-0005 | RF-TEC-005; M10 §5.1; PRO-O3-04 | O3 | Estándar | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Registrar propiedades adicionales configurables de la factibilidad (por servicio): potencia solicitada, tipo de inmueble, tecnología, distancia al nodo, etc. | Atributos tipados validados por esquema del tenant. |
| CP-TEC-0006 | RF-TEC-006; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Programar inspección de factibilidad como visita/OT de clase `inspection` y registrar condiciones encontradas con fotos y GPS. | La inspección queda vinculada y su resultado alimenta el dictamen. |
| CP-TEC-0007 | RF-TEC-007; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Consultar automáticamente cobertura y disponibilidad del recurso de conexión (zona, nodo, puertos/bornes libres en red GIS, capacidad de OLT/splitter) y proponerla al evaluador. | Si no hay recurso libre, la propuesta es "No factible: sin capacidad" y el evaluador puede justificar excepción. |
| CP-TEC-0008 | RF-TEC-008; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Dictaminar factibilidad Factible/No factible con motivo obligatorio, observación técnica, responsable técnico y estado técnico provisorio/definitivo; estado administrativo provisorio/definitivo separado. | No se puede dictaminar sin motivo; el cambio queda auditado. |
| CP-TEC-0009 | RF-TEC-009; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Anular factibilidad con motivo; una factibilidad anulada nunca es utilizable para un alta. | Intentar usar una anulada devuelve error 409. |
| CP-TEC-0010 | RF-TEC-010; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Vigencia configurable de la factibilidad para su uso en un alta (default 90 días) y uso único (sin servicio asociado previo). | Factibilidad vencida o ya usada no aparece como seleccionable. |
| CP-TEC-0011 | RF-TEC-011; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Exigir factibilidad vigente y factible en altas y reconexiones de servicios que la requieran (configurable por servicio/operación). PRM-TEC-024 es el **único dueño** del requisito, con valor explícito por servicio (incluido CLO); M02… | Si el parámetro está activo, no se crea OT de alta sin factibilidad válida. M02 no exige factibilidad por un parámetro propio: consulta PRM-TEC-024 del servicio. |
| CP-TEC-0012 | RF-TEC-012; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Guardar en el contrato/servicio el identificador de la factibilidad que lo originó. | Trazabilidad factibilidad → contrato → OT. |
| CP-TEC-0013 | RF-TEC-013; M10 §5.1; PRO-O3-04 | O3 | Estándar | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. | La versión dictaminada original se conserva (AGR-023). |
| CP-TEC-0014 | RF-TEC-014; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Auditoría de acciones de factibilidad (alta, modificación, cierre, anulación) con diferencias. | Pantalla de cambios muestra antes/después por campo. |
| CP-TEC-0015 | RF-TEC-015; M10 §5.1; PRO-O3-04 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Enviar la factibilidad por mail al solicitante y generar su PDF (con mapa estático opcional). | Envío registra constancia en T09. |
| CP-TEC-0016 | RF-TEC-016; M10 §5.1; PRO-O3-04 | O3 | Estándar | regla | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Informe de factibilidades con estado (Pendiente/Cerrado/Anulado/Facturado), Factible, días entre fecha y confirmación (u hoy), agrupable por barrio. | Los días se calculan en zona horaria del tenant. |
| CP-TEC-0017 | RF-TEC-017; M10 §5.1; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Notificar al socio el resultado de la factibilidad por su canal y reflejarlo en el caso del CRM. | El socio ve "Factible"/"No factible" con motivo público. |
### 1.2 Estimación técnica y presupuesto de conexión (M10 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0018 | RF-TEC-018; M10 §5.2; PRO-O3-04 | O3 | Núcleo | regla | TEN-001 con `connectionEstimates`: EST-DEMO-001: drop de 150 m, mano de obra de 2 h; total ARS 45.000 (ficticio). | Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. | La estimación calcula cantidades; los precios los aporta M04/M11. |
| CP-TEC-0019 | RF-TEC-019; M10 §5.2; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Enviar la estimación a M11 para emitir el presupuesto comercial al socio; reflejar aceptado/rechazado/vencido en la factibilidad. | Con presupuesto aceptado, la factibilidad pasa a `quoted→accepted` y habilita la OT. |
| CP-TEC-0020 | RF-TEC-020; M10 §5.2; PRO-O3-04 | O3 | Estándar | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Plantillas de estimación por servicio/tecnología (por ejemplo, "Conexión FTTH aérea hasta 100 m") reutilizables. | Al aplicar la plantilla se copian líneas editables. |
| CP-TEC-0021 | RF-TEC-021; M10 §5.2; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con `workOrderMaterials`: MOD-DEMO-001 (módem en custodia de EMP-INS-001, usado en OT-INT-DEMO-001), 150 m de drop, 2 conectores SC/APC. | Convertir los materiales de la estimación aceptada en materiales previstos y reserva de stock de la OT de conexión. | Al crear la OT se generan `workOrderMaterials` en estado `requested`. |
### 1.3 Órdenes de trabajo: núcleo (M10 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0022 | RF-TEC-022; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Modelo único de OT con clase `service`, `maintenance`, `claim`, `inspection`, `network` y enums únicos coherentes. | No existen dos enums para el mismo concepto. |
| CP-TEC-0023 | RF-TEC-023; M10 §5.3; PRO-O3-05 | O3 | Núcleo | migración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Catálogo configurable de operaciones técnicas por servicio con **efecto declarativo**: `connect`, `move`, `disconnect`, `meterChange`, `reconnect`, `incident`, `statusChange`, `meterRemoval`, `categoryChange`, `planChange`, `prepaidTopUp`… | Los 8 efectos cableados de ProCoop y los de parámetros 2330/238 están disponibles como tipos de efecto. |
| CP-TEC-0024 | RF-TEC-024; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Atributos por operación: servicio, es reclamo, modifica matrícula, estado de servicio resultante, agregar nota visible en caja, registrar estado/lectura, envío al socio (nunca/al generar/al confirmar/siempre) y canal, plantillas de… | Cada flag se valida al crear/cerrar. |
| CP-TEC-0025 | RF-TEC-025; M10 §5.3; PRO-O3-05 | O3 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Crear OT desde: administración, ficha del titular/servicio, CRM (OT derivada), mora (corte/reconexión), API de integración, app de campo, observación de lectura (M03) y reglas encadenadas; registrar origen y vía de ingreso. | Cada OT tiene `origin` y `intakeChannel`. |
| CP-TEC-0026 | RF-TEC-026; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Al crear la OT, copiar instantánea del servicio: domicilio, punto GPS, medidor (número, dígitos, última lectura y fecha), catastro, certificado de instalador, teléfono del titular, línea telefónica activa, condición de moroso y origen… | La instantánea no cambia si luego cambia el servicio; el GPS no se trunca. |
| CP-TEC-0027 | RF-TEC-027; M10 §5.3; PRO-O3-05 | O3 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Validaciones previas por operación: no sobre servicio inexistente; no sobre servicio dado de baja salvo incidente/reconexión; no sobre pendiente de conectar salvo parámetro; reconexión solo sobre servicio desconectado, no con titular… | Cada rechazo devuelve código de regla (`RN-TEC-0xx`). |
| CP-TEC-0028 | RF-TEC-028; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `outagePlans`: INT-PLAN-DEMO-01 sobre TR-DEMO-01, ventana de 2 h. | Impedir OT pendiente duplicada de la misma operación para el mismo servicio (ventana configurable; default sin límite temporal). | Segundo intento devuelve 409 con enlace a la existente. |
| CP-TEC-0029 | RF-TEC-029; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Numeración interna inmutable (ObjectId) + número de comprobante por talonario/operación + **numeración visible** configurable: no usar, por año separando reclamos, por año y operación, por año + reclamo + operación, y secuencia continua de… | Secuencias atómicas sin huecos por concurrencia (CTR-TEC-19). |
| CP-TEC-0030 | RF-TEC-030; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. | La cuadrilla precarga sus integrantes editables. |
| CP-TEC-0031 | RF-TEC-031; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar tareas realizadas (catálogo por grupo y servicio) en OT de trabajo y de mantenimiento. | Tareas obligatorias por operación configurables. |
| CP-TEC-0032 | RF-TEC-032; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar horas normales y extras por participante, si es contratado y valor hora (default parámetro). | Si V2 #2354 activo, no se cierra sin horas. |
| CP-TEC-0033 | RF-TEC-033; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Notas de OT de solo agregado (título, texto, fecha, usuario, responsable), visibles internamente; opción de nota pública al socio. | Notas públicas se reflejan en M09/portal. |
| CP-TEC-0034 | RF-TEC-034; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Descripción de la OT acumulativa (agregar texto, no reemplazar). | Historial de descripciones con autor. |
| CP-TEC-0035 | RF-TEC-035; M10 §5.3; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Datos extra de la OT por tipo (formulario configurable): reclamos por daños a artefactos (fecha de pago, transferencia, libro/folio, monto reclamado/aprobado, daños anteriores, aceptado, reclamo ante el regulador, causa, artefactos… | Se modela en `damageAssessments` vinculada a la OT y al caso M09. |
| CP-TEC-0036 | RF-TEC-036; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Cierre de la OT con fecha real de ejecución, responsable, categoría de incidente, resolución, tipo de trabajo, cuadrilla, horas, personas, observaciones técnicas; exigencias configurables (responsable, categorías, resolución, personas… | Faltantes listados todos juntos antes de cerrar. |
| CP-TEC-0037 | RF-TEC-037; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Doble paso opcional por operación: **Ejecutada** (campo) y **Cerrada/Confirmada** (revisión administrativa/supervisión); no mezclar ambos conceptos. | Los efectos contractuales se aplican solo en Confirmada. |
| CP-TEC-0038 | RF-TEC-038; M10 §5.3; PRO-O3-05 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Efectos al confirmar según efecto declarativo: conectar servicio (hito), trasladar domicilio (y opcionalmente adherentes), desconectar servicio + adherentes + beneficiarios con retiro de medidor opcional, cambio de medidor (M03)… | Un fallo de un efecto deja la OT en `closing` con paso pendiente reparable (AGR-016), nunca a medio aplicar sin registro. |
| CP-TEC-0039 | RF-TEC-039; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Datos opcionales actualizables al cerrar: recorrido de lectura/factura, cantidad, domicilio, teléfonos y mails de persona y cuenta, catastro, certificado, observación de medidor; con aviso si en traslado no cambió el recorrido y pregunta… | Cada actualización genera propuesta a M01/M03 con auditoría. |
| CP-TEC-0040 | RF-TEC-040; M10 §5.3; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar lectura/consumo al cerrar cuando la operación lo pide y siempre en alta y reconexión (servicios medidos), encadenando con el consumo anterior; preguntar si agregar consumo calculado. | Lectura se envía a M03 con origen OT. |
| CP-TEC-0041 | RF-TEC-041; M10 §5.3; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Retiro de medidor en desconexión: marcar retirado por defecto, preguntar si retirar, limpiar número y matrícula si parámetro. | Efecto aplicado en M03. |
| CP-TEC-0042 | RF-TEC-042; M10 §5.3; PRO-O3-05 | O3 | Estándar | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Confirmar órdenes con fecha anterior al alta del servicio o fecha posterior a hoy solo si parámetros lo permiten; permitir cambiar fecha de ingreso/solicitud con capability y parámetro. | Fecha efectiva y fecha de registro se guardan separadas (AGR-010). |
| CP-TEC-0043 | RF-TEC-043; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Verificar pagos pendientes al confirmar (por ejemplo, cargo de conexión no pagado) salvo parámetro; el bloqueo es configurable por operación. | Mensaje indica comprobantes pendientes según M07. |
| CP-TEC-0044 | RF-TEC-044; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Anulación de OT con motivo y **reversión por compensación** de efectos ya aplicados (reconexión anulada → restaurar baja; alta anulada → baja/“No vigente” si factura cargo fijo en la baja; desconexión anulada → limpiar baja y moroso)… | La anulación genera movimientos compensatorios en M13 y eventos de reversión. |
| CP-TEC-0045 | RF-TEC-045; M10 §5.3; PRO-O3-05 | O3 | Estándar | seguridad | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Restablecer (reabrir) una OT anulada o cerrada con capability, motivo y reglas de reversión. | La reapertura conserva historial y no duplica efectos. |
| CP-TEC-0046 | RF-TEC-046; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cambio de subestado/estadio libre configurable por tenant (por ejemplo "Esperando permiso municipal"). | Subestados no alteran el estado principal. |
| CP-TEC-0047 | RF-TEC-047; M10 §5.3; PRO-O3-05 | O3 | Estándar | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Órdenes encadenadas por reglas: al crear OT de operación X sobre servicio S (filtros: categoría, localidad, referencia, zona de lectura, actividad, clase, propiedad, tipo de medidor, operación) crear OT de operación Y sobre servicio S' con… | Creación idempotente; numeración atómica (no `COD_SOL+1`). |
| CP-TEC-0048 | RF-TEC-048; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Bajas automáticas de servicios dependientes: si el dependiente usa técnica se genera OT de desconexión; si no, se solicita la baja directa al dueño del contrato. | Evento `tec.dependentDisconnection.requested`. |
| CP-TEC-0049 | RF-TEC-049; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Servicios que no usan técnica: la operación se aplica sin OT (desconexión directa) mediante solicitud al dueño del contrato, registrando el hecho técnico "sin intervención". | Configuración por servicio `usesTechnicalOrders`. |
| CP-TEC-0050 | RF-TEC-050; M10 §5.3; PRO-O3-05 | O3 | Estándar | integración | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Generación masiva de OT por filtros (servicio, operación, estado, días, morosos, fecha de estado) con selección parcial/cantidad y vista previa, mostrando la última OT pendiente/en proceso por servicio para evitar duplicados. | Job `tec:generar-ot-masivas` idempotente por lote. |
| CP-TEC-0051 | RF-TEC-051; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cambio de estado masivo de servicios por OT (con nota visible en caja) y en transacción. | Resultado por ítem. |
| CP-TEC-0052 | RF-TEC-052; M10 §5.3; PRO-O3-05 | O3 | Núcleo | integración | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Confirmación/cierre masivo de OT con los mismos datos (fecha, responsable, incidente, resolución, tipo de trabajo, móviles, cuadrilla, horas, personas, observaciones) y notificación opcional al socio; excluye las bloqueadas por campo o… | Las OT con ejecución en campo pendiente de sincronizar no se cierran masivamente. |
| CP-TEC-0053 | RF-TEC-053; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Eliminación/anulación masiva de OT seleccionadas con reversión por ítem. | Reporte de resultado por OT. |
| CP-TEC-0054 | RF-TEC-054; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Asistentes de generación por operación: traslado (domicilio nuevo, adherentes), desconexión (baja por mora, contrato de baja imprimible), reconexión (mora saldada, factibilidad), cambio de medidor (nuevo tipo/número, materiales, con/sin… | Cada asistente aplica validaciones RF-TEC-027. |
| CP-TEC-0055 | RF-TEC-055; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Formularios de solicitud para firma del socio por operación (traslado con diseño propio y domicilio nuevo, cambio de medidor, reconexión, desconexión, alta, cambio de categoría). | PDF con versión y firma capturable en mostrador o campo. |
| CP-TEC-0056 | RF-TEC-056; M10 §5.3; PRO-O3-05 | O3 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Modelos de impresión de OT por servicio + operación (único por combinación), informe por defecto, con mapa estático opcional del punto, materiales (con vales opcionales), informe de incidentes; la impresión no cambia el estado salvo… | Imprimir pasa a `dispatched` solo si V2 #2808 = falso y la operación lo indica. |
| CP-TEC-0057 | RF-TEC-057; M10 §5.3; PRO-O3-05 | O3 | Estándar | regla | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Antigüedad visual de la OT (≤10, 11–20, 21–30, >30 días) y estado de envío a campo. | Badges por rango en tablero. |
| CP-TEC-0058 | RF-TEC-058; M10 §5.3; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Aviso en tiempo real a usuarios técnicos cuando se crean OT pendientes nuevas en su alcance (reemplaza sondeo). | Notificación in-app vía T09. |
| CP-TEC-0059 | RF-TEC-059; M10 §5.3; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Tablero de órdenes en kanban, lista y mapa, con asignación por arrastre a cuadrillas/recursos y filtros por estado, operación, zona, servicio, antigüedad, prioridad. | Arrastrar a otra cuadrilla valida capacidad y conflicto de agenda. |
| CP-TEC-0060 | RF-TEC-060; M10 §5.3; PRO-O3-05 | O3 | Núcleo | regla | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Prioridad y vencimiento (fecha objetivo) en la OT, con SLA heredado del caso M09 cuando es derivada. | Alertas de OT por vencer y vencidas. |
| CP-TEC-0061 | RF-TEC-061; M10 §5.3; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Tipificación de causa con categoría de incidente y distribución % por sección/centro de costo que debe sumar 100 %. | No se guarda una distribución distinta de 100 %. |
| CP-TEC-0062 | RF-TEC-062; M10 §5.3; PRO-O3-05 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cargos asociados a la OT: al generar ("antes", cobro en mostrador) y al cerrar ("luego"), por regla de M04 según servicio, socio activo, moroso, prepago, referencia, localidad, categoría, clase, retirado, provisorio, propiedad, estado del… | Sin doble cargo por resincronización (idempotencia por OT + regla, garantizada por `{sourceModule, sourceRef.id}` de M05). |
| CP-TEC-0063 | RF-TEC-063; M10 §5.3; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Proporcionales por reconexión (crédito por días desconectados o débito por días restantes si el período no se facturó) y por cambio de categoría (diferencia de precio por días, con tope de día y sin negativos opcional): solicitados a… | Evento `tec.workOrder.closed` con `effect=reconnect/categoryChange`; M05 decide documento inmediato o próxima factura. |
### 1.4 Materiales de la OT (M10 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0064 | RF-TEC-064; M10 §5.4; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Entidad propia de material de la OT (producto, cantidad prevista/usada/devuelta, depósito o custodia de origen, serie si corresponde, precio de referencia, facturable sí/no) que solicita a M13 los movimientos. | Cada movimiento M13 referencia `workOrderMaterialId`. |
| CP-TEC-0065 | RF-TEC-065; M10 §5.4; PRO-O3-05 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Origen del descuento: depósito indicado, custodia del técnico/responsable (depósito propio) o depósito por defecto configurado. | Sin depósito resuelto no se confirma el consumo. |
| CP-TEC-0066 | RF-TEC-066; M10 §5.4; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados pendientes… | El filtro de estado corrige el bug `(≠3)/(≠4)`. |
| CP-TEC-0067 | RF-TEC-067; M10 §5.4; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Vales de retiro de depósito vinculados a la OT/obra y su consulta; importar productos de presupuesto en vales. | El vale es un movimiento M13 a custodia, no consumo. |
| CP-TEC-0068 | RF-TEC-068; M10 §5.4; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Materiales en productos sin stock solo si parámetro lo permite; advertencia al cerrar OT sin materiales; mostrar detalle de materiales en el registro. | Mensajes configurables. |
| CP-TEC-0069 | RF-TEC-069; M10 §5.4; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Bloqueo de edición de materiales en OT cerradas (parámetro); corrección posterior solo por ajuste trazado. | Ajuste genera movimiento compensatorio. |
| CP-TEC-0070 | RF-TEC-070; M10 §5.4; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Validación de cierre de stock: no registrar materiales con fecha de un período de stock cerrado. | Error si período cerrado en M13. |
| CP-TEC-0071 | RF-TEC-071; M10 §5.4; PRO-O3-05 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Facturación de materiales al socio solo si la operación/presupuesto lo define; por defecto los materiales no se facturan automáticamente. | Línea `billable=true` genera solicitud a M05. |
| CP-TEC-0072 | RF-TEC-072; M10 §5.4; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Costeo de la OT: materiales valorizados (M13) + horas normales/extras (valor hora parámetro o legajo) + vehículos; concepto de horas hombre. | El informe no sobrescribe parámetros (CTR-TEC-26). |
### 1.5 Agenda y visitas (M10 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0073 | RF-TEC-073; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. | Tipo "Instalación Internet" con franja de 2 h precargado. |
| CP-TEC-0074 | RF-TEC-074; M10 §5.5; PRO-O3-06 | O3 | Núcleo | regla | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). | La capacidad disponible se calcula por zona/tipo/franja. |
| CP-TEC-0075 | RF-TEC-075; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Ofrecer turnos compatibles con servicio, domicilio (zona por punto de prestación), requisitos del caso y factibilidad aprobada. | Solo se ofrecen franjas con capacidad > 0. |
| CP-TEC-0076 | RF-TEC-076; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | **Reserva temporal** con expiración configurable al elegir franja y **reserva confirmada** al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). | Dos solicitudes simultáneas por el último cupo: una confirma, la otra recibe 409 con alternativas. |
| CP-TEC-0077 | RF-TEC-077; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Confirmar fecha/franja al socio por su canal con constancia y recordatorio previo configurable. | Constancia en T09 con estado de entrega. |
| CP-TEC-0078 | RF-TEC-078; M10 §5.5; PRO-O3-06 | O3 | Núcleo | regla | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Reprogramar y cancelar visitas por socio (portal, con reglas de anticipación) u operador, con motivo y trazabilidad; cancelar visita no cancela la contratación. | Se liberan cupos y se conserva la reserva anterior en historial. |
| CP-TEC-0079 | RF-TEC-079; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. | Reasignación notifica al técnico y actualiza su "Mi día". |
| CP-TEC-0080 | RF-TEC-080; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Resultado de visita: realizada, fallida (sin acceso, ausente, falta material, condición técnica, clima, rechazo del socio), reprogramada, cancelada u otro definido por tenant; visita no terminada genera otra visita. | Visita fallida no activa contrato ni descuenta equipo. |
| CP-TEC-0081 | RF-TEC-081; M10 §5.5; PRO-O3-06 | O3 | Núcleo | funcional | TEN-001 con `visitBookings` / `visits`: VIS-DEMO-001 (10/11/2026 09:00–11:00, confirmada), VIS-DEMO-002 (10/11/2026, asignada a EMP-INS-001). | Estado real visible al socio (Confirmada, Asignada, En camino, En sitio, Realizada, Fallida, Reprogramada) vinculado a la OT y a la activación. | El socio no ve datos internos ni ubicación del técnico. |
| CP-TEC-0082 | RF-TEC-082; M10 §5.5; PRO-O3-06 | O3 | Estándar | regla | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Costo de visita fallida/improcedente configurable por prestación (concepto M04), nunca automático sin regla. | Cargo solo con regla activa y motivo imputable. |
| CP-TEC-0083 | RF-TEC-083; M10 §5.5; PRO-O3-06 | O3 | Estándar | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Forzar sobrecupo con capability y motivo (urgencias), marcado en agenda. | Auditoría de sobrecupo. |
| CP-TEC-0084 | RF-TEC-084; M10 §5.5; PRO-O3-06 | O3 | Núcleo | regla | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. | Drag & drop respeta reglas de capacidad. |
### 1.6 Instalación integral (BASE §73) (M10 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0085 | RF-TEC-085; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Concertar cita de instalación (visita confirmada) con asignación operativa. | OT de instalación con visita `confirmed` y recurso. |
| CP-TEC-0086 | RF-TEC-086; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. | Reserva reduce disponible; entrega mueve custodia una sola vez. |
| CP-TEC-0087 | RF-TEC-087; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | El instalador informa **En camino**; la app del socio muestra la novedad y la cita. | Notificación al socio; sin coordenadas. |
| CP-TEC-0088 | RF-TEC-088; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar llegada e inicio; verificar orden, domicilio y equipo (escaneo de serie/QR). | Serie no coincidente exige registrar sustitución. |
| CP-TEC-0089 | RF-TEC-089; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Instalar, realizar pruebas (checklist por tecnología: potencia óptica, velocidad, señal Wi-Fi, ping) y registrar resultado, materiales y serie efectiva. | Prueba fallida impide cerrar como instalada. |
| CP-TEC-0090 | RF-TEC-090; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Sustitución de equipo: si el efectivo difiere del reservado, registrar y validar la sustitución sin adjudicar dos equipos. | El reservado vuelve a disponible/custodia; solo el efectivo se aplica. |
| CP-TEC-0091 | RF-TEC-091; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | Mostrar el detalle de instalación (versión) y capturar firma/conformidad del receptor identificado (nombre, documento, relación con el titular), fecha/hora, instalador, equipo, trabajos, conformidad/disconformidad, observaciones, adjuntos… | El documento aceptado queda inmutable con hash; modificación posterior genera nueva versión. |
| CP-TEC-0092 | RF-TEC-092; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Aplicar el equipo desde la custodia del instalador a la prestación (salida a domicilio) y vincularlo al contrato/suministro con modalidad (comodato, venta, alquiler); la modalidad sale del plan, con comodato por defecto en Internet y TV… | Aplicación única por `clientMutationId` y por OT. |
| CP-TEC-0093 | RF-TEC-093; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Confirmar el **hito de activación** con fecha efectiva (día/hora y zona horaria) mediante el mecanismo autorizado por servicio (instalación probada + aprovisionamiento confirmado + revisión si aplica). | Sin activación por mera agenda; evento `tec.installation.activationConfirmed`. |
| CP-TEC-0094 | RF-TEC-094; M10 §5.6; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Disparar a M05/M04 la generación del cargo de instalación y el primer abono según reglas de devengamiento, promoción, prorrateo y modalidad anticipada/vencida. | TEC no calcula importes; los ejemplos de §73 se validan en M05. |
| CP-TEC-0095 | RF-TEC-095; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con Encuesta: ENC-DEMO-001, respuesta 4/5. | Enviar o disponibilizar la encuesta de satisfacción (T09) vinculada a visita, OT y servicio, posterior e independiente de la activación. | La ausencia de respuesta no bloquea activación. |
| CP-TEC-0096 | RF-TEC-096; M10 §5.6; PRO-O3-07 | O3 | Estándar | regla | TEN-001 con Encuesta: ENC-DEMO-001, respuesta 4/5. | Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. | Respuesta ≤ umbral crea caso de seguimiento. |
| CP-TEC-0097 | RF-TEC-097; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Estados propios para ausencia de firma, falla de prueba e incidencia; prohibido marcar todo como realizado para cerrar la agenda. | Transiciones explícitas en §8. |
| CP-TEC-0098 | RF-TEC-098; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Visita fallida: el equipo se mantiene en custodia o se devuelve; no se registra instalado ni se vuelve a descontar. | Prueba ESC "visita fallida" verde. |
| CP-TEC-0099 | RF-TEC-099; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Retiro posterior del equipo (baja, cambio, falla) con OT de retiro, condición del equipo y devolución a depósito/RMA; devolver el router no equivale a baja comercial. | Retiro genera movimiento domicilio → custodia → depósito. |
| CP-TEC-0100 | RF-TEC-100; M10 §5.6; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con Encuesta: ENC-DEMO-001, respuesta 4/5. | Bandeja de instalaciones: pendientes de cita, citadas, en curso, ejecutadas sin activación, con conflicto, activadas, con encuesta pendiente. | Contadores por estado y antigüedad. |
| CP-TEC-0101 | RF-TEC-101; M10 §5.6; PRO-O3-07 | O3 | Núcleo | integración | TEN-001 con Encuesta: ENC-DEMO-001, respuesta 4/5. | Una sincronización repetida no genera otro cargo, otra instalación ni otra encuesta. | Reenvío del mismo lote devuelve `duplicate` por ítem. |
### 1.7 Cuadrillas, recursos y tipos de trabajo (M10 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0102 | RF-TEC-102; M10 §5.7; PRO-O3-01 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. | Un integrante puede estar en varias cuadrillas con vigencia. |
| CP-TEC-0103 | RF-TEC-103; M10 §5.7; PRO-O3-01 | O3 | Núcleo | migración | TEN-001 con `workOrderMaterials`: MOD-DEMO-001 (módem en custodia de EMP-INS-001, usado en OT-INT-DEMO-001), 150 m de drop, 2 conectores SC/APC. | ABM de recursos de campo/responsables: nombre, actividad (técnico, lecturista, cobrador, inspector), mail, teléfono, usuario IAM vinculado, depósito/custodia propia, asigna OT a app, inactivo. Sin contraseñas propias (IAM T02). | `PAS_RES` no se migra (CTR-TEC-27). |
| CP-TEC-0104 | RF-TEC-104; M10 §5.7; PRO-O3-01 | O3 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Responsables por servicio y operación (relación servicio-responsable) para sugerencia de asignación. | Sugerencia ordenada por regla. |
| CP-TEC-0105 | RF-TEC-105; M10 §5.7; PRO-O3-01 | O3 | Estándar | regla | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Reglas de notificación a responsables por servicio, tipo de orden, operaciones, días de semana, franja horaria, feriados y momento (al generar / al enviar a campo), con canal (WhatsApp, mail, SMS, push) y plantilla oficial. | Guardia fuera de horario recibe aviso. |
| CP-TEC-0106 | RF-TEC-106; RN-TEC-114; M10 §5.7; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Profesionales/instaladores matriculados: matrícula, documento, servicio, categoría de instalador, contacto, domicilio; certificado y vencimiento en la OT con validación configurable (no exigir / advertir / exigir). La validación la… | Certificado vencido se advierte o bloquea. En ELE con jurisdicción Córdoba (Ley 10281) el default bloquea el cierre sin certificado vigente. |
| CP-TEC-0107 | RF-TEC-107; M10 §5.7; PRO-O3-01 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. | Enum único `kind`. |
| CP-TEC-0108 | RF-TEC-108; M10 §5.7; PRO-O3-01 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Categorías de incidente con rubro, servicio, operación por defecto y cuentas contables (debe/haber), con distribución por sección. | Cuentas referencian plan de M15. |
| CP-TEC-0109 | RF-TEC-109; M10 §5.7; PRO-O3-01 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Resoluciones por servicio + operación más genéricas (sin servicio). | Selector muestra específicas + genéricas. |
| CP-TEC-0110 | RF-TEC-110; M10 §5.7; PRO-O3-01 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Catálogo de tareas y grupos de tareas por servicio. | Unifica `TAREAS` y `TAREASOM` (CTR-TEC-28). |
| CP-TEC-0111 | RF-TEC-111; M10 §5.7; PRO-O3-01 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Vías de ingreso de OT (teléfono, mostrador, web, app, WhatsApp, API) con validación de celular/mail y vía por defecto; solicitar vía al crear según parámetro. | Usa el catálogo `crmChannels` de M09 (CTR-DAT-77); M10 no mantiene uno propio. |
### 1.8 App de campo offline-first (perfiles técnico / lecturista / cobrador) (M10 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0112 | RF-TEC-112; M10 §5.8; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con `provisioningSystems` / `provisioningProfiles`: `mikrotik-demo` y `smartolt-demo` en modo simulador (sin endpoints reales); perfiles INT-100 e INT-300. | Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. | Un usuario con dos perfiles elige perfil activo. |
| CP-TEC-0113 | RF-TEC-113; M10 §5.8; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con `workOrderMaterials`: MOD-DEMO-001 (módem en custodia de EMP-INS-001, usado en OT-INT-DEMO-001), 150 m de drop, 2 conectores SC/APC. | Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. | Cada paquete descargado lleva `serverVersion`. |
| CP-TEC-0114 | RF-TEC-114; M10 §5.8; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cola única de mutaciones en IndexedDB con `clientMutationId`, fotos/evidencias en IndexedDB, envío por lotes a `/sync` con resultado por ítem, reintento automático y botón "Reintentar" en banner único. | Cortes de red no pierden datos; reenvío no duplica. |
| CP-TEC-0115 | RF-TEC-115; M10 §5.8; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `syncConflicts`: CNF-DEMO-01 (OT cancelada vs instalación offline, ESC-03). | No encolar login, administración ni operaciones con riesgo de duplicado no idempotente. | Esas acciones se deshabilitan offline con mensaje. |
| CP-TEC-0116 | RF-TEC-116; M10 §5.8; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Fotos con marca de fecha/hora, GPS y orientación; foto obligatoria por paso configurable; compresión y límite de tamaño. | Paso obligatorio sin foto no permite avanzar. |
| CP-TEC-0117 | RF-TEC-117; M10 §5.8; PRO-O3-08 | O3 | Núcleo | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Captura de GPS del dispositivo con permiso explícito y alternativa manual; precisión registrada. | Sin permiso se registra "sin GPS" y se permite continuar si la regla lo admite. |
| CP-TEC-0118 | RF-TEC-118; M10 §5.8; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | Firma del receptor en pantalla y datos de identificación (RF-TEC-091) offline, con hash del detalle presentado. | La firma se asocia a la versión del detalle. |
| CP-TEC-0119 | RF-TEC-119; M10 §5.8; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Registro de materiales usados desde la custodia del técnico (lista de su stock) que descuentan stock al sincronizar en M13. | Material no disponible en custodia se marca para revisión, no se bloquea el trabajo. |
| CP-TEC-0120 | RF-TEC-120; M10 §5.8; PRO-O7-02 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cierre con lectura de medidor cuando aplica (servicios medidos) usando el componente de lectura de M03. | Lectura validada por reglas de M03. |
| CP-TEC-0121 | RF-TEC-121; M10 §5.8; PRO-O3-08 | O3 | Estándar | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Crear OT desde campo (anomalía, reclamo en sitio, cambio de medidor de servicio no medido) si parámetros lo permiten. | OT creada offline obtiene número al sincronizar. |
| CP-TEC-0122 | RF-TEC-122; M10 §5.8; PRO-O3-08 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cerrar OT desde la app (si V2 #48), cerrar operaciones seleccionadas en lote (V2 #54), confirmación al cancelar (V2 #62), mostrar número de medidor en lista (V2 #64). | Comportamientos configurables por tenant. |
| CP-TEC-0123 | RF-TEC-123; M10 §5.8; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con Encuesta: ENC-DEMO-001, respuesta 4/5. | Encuesta/conformidad al cierre en sitio (V2 #51) limitada a la conformidad del receptor; la encuesta de satisfacción es posterior por canal del socio. | Ver CTR-TEC-15. |
| CP-TEC-0124 | RF-TEC-124; M10 §5.8; PRO-O3-08 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | **Conflictos de sincronización**: versionar la tarea descargada; al recibir una mutación sobre versión desactualizada (OT cancelada, reasignada, equipo cambiado, titular modificado) conservar ambas evidencias, crear conflicto con… | ESC-03 superado (§17). |
| CP-TEC-0125 | RF-TEC-125; M10 §5.8; PRO-O3-08 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar fecha real de intervención (dispositivo) y fecha de recepción (servidor); validar desvío de reloj. | Desvío > umbral marca la mutación para revisión. |
| CP-TEC-0126 | RF-TEC-126; M10 §5.8; PRO-O3-08 | O3 | Núcleo | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Bloqueo de OT enviadas a campo o a sistema externo (AION/otros) para evitar doble cierre; desbloqueo con capability. | OT bloqueada no se confirma masivamente en admin. |
| CP-TEC-0127 | RF-TEC-127; M10 §5.8; PRO-O3-08 | O3 | Estándar | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | No sincronizar órdenes modificadas en servidor sin aviso al técnico (V2 #57 reemplazado por conflicto/actualización con aviso). | El técnico ve "Orden actualizada" antes de ejecutar. |
| CP-TEC-0128 | RF-TEC-128; M10 §5.8; PRO-O3-08 | O3 | Estándar | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registro de dispositivos de campo (modelo, versión de app, último sync, usuario) y revocación remota que purga datos locales. | Dispositivo revocado no puede sincronizar. |
| CP-TEC-0129 | RF-TEC-129; M10 §5.8; PRO-O3-08 | O3 | Estándar | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Formularios/checklists de campo configurables (motor de relevamientos CNX) embebidos en la OT (hasta 3 formularios por visita), con check-in GPS y geocerca opcional. | Respuestas versionadas por formulario. |
| CP-TEC-0130 | RF-TEC-130; M10 §5.8; PRO-O3-08 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Mapa del técnico con sus visitas del día, red cercana y navegación externa (abrir en Google Maps). | Sin conexión muestra lista y último mapa cacheado permitido. |
| CP-TEC-0131 | RF-TEC-131; M10 §5.8; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Sistema de AVL/flota opcional para recorridos y kilometraje del vehículo, sin exponer ubicación al socio. | Integración en M18. |
### 1.9 Cortes y reconexiones ejecutados (M10 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0132 | RF-TEC-132; M10 §5.9; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Recibir órdenes de corte/suspensión/reconexión de M08 (mora) y de M09 (solicitud del socio) y crear OT (`disconnect`/`reconnect`) con marca moroso y origen gestión de mora, o comando remoto si el servicio admite corte remoto. | Ninguna acción de red sin origen CRM/mora autorizado. |
| CP-TEC-0133 | RF-TEC-133; M10 §5.9; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Generar OT de corte por mora sin observación técnica completa si el parámetro lo permite. | Con el parámetro activo, una OT de corte por mora se genera aunque falte la observación técnica y queda marcada como tal; con el parámetro inactivo la generación se rechaza indicando el dato faltante. |
| CP-TEC-0134 | RF-TEC-134; M10 §5.9; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Reconexión automática tras regularización: cerrar y reconectar en un paso (`reconnect`) con comando remoto; si no hay sistema remoto vigente, la OT queda pendiente para cuadrilla (DEC-014: automática en servicios remotos al confirmarse el… | Evento `tec.reconnection.executed` con fecha efectiva. |
| CP-TEC-0135 | RF-TEC-135; M10 §5.9; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Informar a M08 el resultado de cada corte/reconexión (ejecutado, no ejecutado con motivo: sin acceso, medidor inaccesible, socio pagó en sitio, error de sistema remoto). | M08 recibe evento por cada orden. |
| CP-TEC-0136 | RF-TEC-136; M10 §5.9; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Notificar al socio el cierre de OT de desconexión por SMS/WhatsApp/mail según configuración. | Constancia en T09. |
| CP-TEC-0137 | RF-TEC-137; M10 §5.9; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Cortes masivos con vista de a quién ya se generó la orden y exclusión de servicios con orden en curso. | Sin duplicados. |
| CP-TEC-0238 | RF-TEC-238; RN-MOR-137, RN-MOR-138, RN-MOR-139; M10 §5.9; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con `inspectionCases` / `seals`: INSP-DEMO-01 (sospecha por consumo cero); precintos PRE-DEMO-0001 a 0010. | **Suspensión restringida por mora** (modo `restricted` de M08): cuando `mor.interruption.approved` (EVT-MOR-12) llega con `serviceMode = restricted`, TEC ejecuta el perfil de restricción en lugar del corte: AG **reducción de caudal**… | Una OT de reducción de caudal no se cierra sin el caudal resultante medido ni con un valor menor al mínimo vital; una orden `restricted` de un servicio sin perfil configurado queda en `pending` con `tec.workOrder.closeRequirementsMissing` y M08 recibe "no ejecutada" con motivo. |
| CP-TEC-0239 | RF-TEC-239; M10 §5.9; PRO-O8-05 | O8 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | **Entrega de gas envasado** (variante "envasado" del servicio GAS, DEC-082; solo si PRM-CAT-112 está habilitado): la venta de garrafas o cilindros (M13 stock, M05 comprobante) genera una OT de tipo operación `bottledGasDelivery` con… | Una entrega de 2 garrafas de 10 kg con 2 vacíos retirados cierra la OT con egreso de 2 llenas y alta de 2 vacías en M13; con PRM-CAT-112 en `false` el tipo de operación no está disponible. |
### 1.10 Mantenimiento, infraestructura y mapas (BASE §18) (M10 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0138 | RF-TEC-138; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Inventariar infraestructura por ubicación como elementos de red (válvulas, transformadores, nodos, postes, cámaras) con marca, modelo, serie, características técnicas, fecha de instalación y sustitución. | Precarga VAL-001. |
| CP-TEC-0139 | RF-TEC-139; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Relacionar activos y componentes (jerarquía y relaciones permitidas). | Ver RF-TEC-148. |
| CP-TEC-0140 | RF-TEC-140; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `maintenancePlans`: VAL-001 (válvula, inspección trimestral), TR-DEMO-01 (termografía semestral). | Planes de mantenimiento preventivo por activo o tipo de componente con frecuencia (semanal, mensual, bimestral, trimestral, cuatrimestral, semestral, anual o cada N días), margen anterior/posterior y generación automática de OT de… | Job `tec:generar-mantenimiento` crea la próxima OT al alcanzarse fecha − margen. |
| CP-TEC-0141 | RF-TEC-141; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Gestionar averías como OT correctivas vinculadas a incidentes/reclamos sin ocultar el preventivo programado original. | Preventivo y correctivo coexisten. |
| CP-TEC-0142 | RF-TEC-142; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Registrar intervenciones, tareas, materiales y resultado por activo; programar el próximo control. | Historial por activo. |
| CP-TEC-0143 | RF-TEC-143; M10 §5.10; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Consultar historial y costo por activo (materiales, horas, vehículos). | Informe de costo acumulado por período. |
| CP-TEC-0144 | RF-TEC-144; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Planificar interrupciones (tramo, elemento, fecha/hora inicio/fin, motivo), con aprobación y aviso masivo a contratos afectados. | Aviso vía T09 con constancia. |
| CP-TEC-0145 | RF-TEC-145; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Identificar contratos potencialmente afectados por un elemento o zona (análisis de impacto aguas abajo). | Ver RF-TEC-156. |
| CP-TEC-0146 | RF-TEC-146; M10 §5.10; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Visualizar infraestructura, suministros, OT, reclamos y visitas en mapa web con capas activables. | Capa de OT disponible desde O3. |
| CP-TEC-0147 | RF-TEC-147; M10 §5.10; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Documentación técnica adjunta por activo (planos, manuales, fotos) y control de garantías y vencimientos (con M13 para RMA). | Alertas de vencimiento. |
### 1.11 Red / GIS (M10 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0148 | RF-TEC-148; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. | Una red puede servir a varios servicios. |
| CP-TEC-0149 | RF-TEC-149; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Capas por red (MT, BT, troncal, distribución); componentes y relaciones sin capa son comunes a todas las capas. | Consulta por capa incluye comunes. |
| CP-TEC-0150 | RF-TEC-150; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `networks` / `networkElements`: Red `FTTH-DEMO`: OLT-DEMO-01 → PON 1/1 → splitter SPL-DEMO-01 (1:8) → NAP-DEMO-01; red `ELEC-DEMO`: SET-DEMO → alimentador AL-01 → TR-DEMO-01 → 120… | Tipos de componente con ícono, permite conectar servicios, múltiples conexiones, múltiples elementos (rango), nombre de los elementos (bornes/pares/puertos), distribuye en hijos. | "Transformador" es un componente configurado (no entidad fija). |
| CP-TEC-0151 | RF-TEC-151; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Relaciones permitidas padre → hijo entre componentes por red/capa; la red instalada solo admite relaciones permitidas. | Alta de nodo con padre no permitido se rechaza. |
| CP-TEC-0152 | RF-TEC-152; M10 §5.11; PRO-O7-08 | O7 | Núcleo | regla | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Atributos tipados por componente: texto (largo), entero, decimal (N decimales), fecha, booleano, lista, referencia a catálogo del sistema (lista blanca, no reflexión), visible sí/no. | Potencia kVA, tensión, fases como atributos. |
| CP-TEC-0153 | RF-TEC-153; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Red instalada: elementos con padre, componente, capa, descripción, número, rango inicial–final, geometría (punto/línea/polígono GeoJSON), domicilio, estado (Disponible, Utilizado, Dañado, No aplica, Planificado, Retirado), activo. Alta… | Coordenadas numéricas (no texto con coma). |
| CP-TEC-0154 | RF-TEC-154; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `networks` / `networkElements`: Red `FTTH-DEMO`: OLT-DEMO-01 → PON 1/1 → splitter SPL-DEMO-01 (1:8) → NAP-DEMO-01; red `ELEC-DEMO`: SET-DEMO → alimentador AL-01 → TR-DEMO-01 → 120… | No borrar elementos con servicios conectados o hijos; retirar con fecha y motivo. | 409 si tiene conexiones vigentes. |
| CP-TEC-0155 | RF-TEC-155; M10 §5.11; PRO-O3-09 | O3 | Núcleo | seguridad | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Vínculo servicio-red con historial (fecha de conexión/desconexión, estado, observaciones), validando que el punto admita conexión, tenga capacidad (rango/múltiple), esté en estado utilizable y que el servicio no esté conectado a otro punto… | Exigir punto de conexión en OT según V2 #401. |
| CP-TEC-0156 | RF-TEC-156; M10 §5.11; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Análisis de impacto: dado un elemento (p. ej. transformador) o un conjunto, listar servicios, contratos, titulares y servicios críticos (electrodependientes, grandes usuarios) aguas abajo, con conteo y exportación, y lanzar aviso masivo. | Resultado en < 5 s para 50.000 suministros. |
| CP-TEC-0157 | RF-TEC-157; M10 §5.11; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Descripción del punto de conexión del servicio recorriendo ancestros ("Red / Capa / Nodo → Padre → …"). | Visible en ficha del servicio. |
| CP-TEC-0158 | RF-TEC-158; M10 §5.11; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Informes de red: estructura, red instalada, red conectada por servicio (incluye ancestros), cuentas sin conexión a red física (corrigiendo el bug de reconexión a otro nodo), cuentas conectadas por punto (con filtro de rango de consumos y… | Corrección de bugs verificada en pruebas. |
| CP-TEC-0159 | RF-TEC-159; M10 §5.11; PRO-O7-08 | O7 | Estándar | migración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Migrar la red v1 (niveles por capa, nodos con padre, disponibilidad) a la red genérica. | Ver §19. |
| CP-TEC-0160 | RF-TEC-160; M10 §5.11; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Exportar red y elementos a KML y GeoJSON (puntos con ícono por componente, líneas padre→hijo); importar parcelas/capas GIS (shapefile/GeoJSON/KML). | Coordenadas con punto decimal. |
| CP-TEC-0161 | RF-TEC-161; M10 §5.11; PRO-O7-08 | O7 | Estándar | migración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Exportaciones GIS a sistemas externos y reguladores como **plantillas configurables** (usuarios, consumos, movimientos altas/bajas, activos, RTI OCEBA), sin códigos de concepto/categoría fijos: mapeos por tenant. | Las 10 variantes de ProCoop se reproducen como plantillas de ejemplo. |
| CP-TEC-0162 | RF-TEC-162; M10 §5.11; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Marca "con dato GIS" por servicio y servicios a usar en mapas GIS. | Filtro en mapa. |
| CP-TEC-0163 | RF-TEC-163; M10 §5.11; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Edición de red en mapa (dibujar elemento, mover, conectar) además de árbol jerárquico. | Cambios versionados con autor. |
### 1.12 Equipos de red y centrales (M10 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0164 | RF-TEC-164; M10 §5.12; PRO-O3-09 | O3 | Núcleo | seguridad | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema de… | Credenciales solo en bóveda T06 (CTR-TEC-29). |
| CP-TEC-0165 | RF-TEC-165; M10 §5.12; PRO-O3-09 | O3 | Núcleo | seguridad | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. | Acceso a secretos auditado. |
| CP-TEC-0166 | RF-TEC-166; M10 §5.12; PRO-O3-09 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Monitoreo de nodos y equipos (estado arriba/abajo vía integración) asociado a incidentes de zona en M09. | Caída de OLT crea/propone incidente de zona con impacto. |
| CP-TEC-0167 | RF-TEC-167; M10 §5.12; PRO-O3-09 | O3 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. | Asignación de puerto en la OT de instalación. |
### 1.13 Obras, loteos y contribución por mejoras (MER-009) (M10 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0168 | RF-TEC-168; M10 §5.13; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). | Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. | Desvío presupuesto vs real visible. |
| CP-TEC-0169 | RF-TEC-169; M10 §5.13; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `connectionEstimates`: EST-DEMO-001: drop de 150 m, mano de obra de 2 h; total ARS 45.000 (ficticio). | Grupos de obra con cuentas contables y distribución % por sección (suma 100 %). | Validación de 100 %. |
| CP-TEC-0170 | RF-TEC-170; M10 §5.13; PRO-O7-08 | O7 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Órdenes de mantenimiento sobre obra (`maintenance`) con materiales imputados a la obra y vales. | Informe de recursos asignados a obras. |
| CP-TEC-0171 | RF-TEC-171; M10 §5.13; PRO-O7-08 | O7 | Núcleo | regla | TEN-001 con `feasibilityRequests`: FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). | Base de aprobación obligatoria para cobrar (ordenanza, convenio, asamblea) adjunta y vigente. | Sin base aprobada no se habilita el prorrateo. |
| CP-TEC-0172 | RF-TEC-172; M10 §5.13; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. | ExcelImportWizard con validación de inmueble. |
| CP-TEC-0173 | RF-TEC-173; RN-TEC-115; M10 §5.13; PRO-O7-08 | O7 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Prorrateo por metros de frente, superficie, partes iguales, unidades u otro criterio explícito; simulación y aprobación; envío a M05/M08 para facturar en cuotas o plan de pago. **Precisión (HUECO-OBR-01):** al aprobar, TEC publica… | Suma de cuotas = costo a distribuir (redondeo explícito). Reenviar el mismo evento no duplica contratos ni planes (clave obra + inmueble). |
| CP-TEC-0174 | RF-TEC-174; M10 §5.13; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Loteos: alta de red y puntos de conexión del loteo antes de existir las calles en catálogo (texto + punto para revisión). | Calle pendiente queda en revisión de T04. |
| CP-TEC-0175 | RF-TEC-175; M10 §5.13; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Expedientes de trámites técnicos (presentación de planos, certificado de instalador, habilitaciones) con etapas, resolución, adjuntos y fechas. | Etapas con estado y resolución. |
### 1.14 Inspecciones y consumo no registrado (MER-004) (M10 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0176 | RF-TEC-176; M10 §5.14; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `inspectionCases` / `seals`: INSP-DEMO-01 (sospecha por consumo cero); precintos PRE-DEMO-0001 a 0010. | Casos de inspección por alerta de patrón de consumo (M03), denuncia, hallazgo de lecturista o plan de control; una sospecha no es infracción. | Estado inicial `suspected`. |
| CP-TEC-0177 | RF-TEC-177; M10 §5.14; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | OT de inspección con acta (checklist configurable por servicio), fotos, GPS, testigos, firma del usuario o constancia de negativa. | Acta inmutable con hash. |
| CP-TEC-0178 | RF-TEC-178; M10 §5.14; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. | Un precinto no se coloca dos veces. |
| CP-TEC-0179 | RF-TEC-179; M10 §5.14; PRO-O7-08 | O7 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Notificación al usuario y registro de descargo dentro del plazo configurable. | Sin descargo vencido el plazo se habilita propuesta. |
| CP-TEC-0180 | RF-TEC-180; M10 §5.14; PRO-O7-08 | O7 | Núcleo | regla | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | Propuesta de recupero según método aprobado (versionado por régimen del servicio) calculada por M04, con aprobación obligatoria; facturación separada por M05; nunca automática. | Sin aprobación no hay documento. |
| CP-TEC-0181 | RF-TEC-181; M10 §5.14; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Seguimiento del caso hasta regularización, con reincidencias y estadística por zona. | Indicadores en §15. |
### 1.15 Aprovisionamiento de Internet/TV (BASE §86, MER-017) (M10 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0182 | RF-TEC-182; M10 §5.15; PRO-O3-09 | O3 | Núcleo | seguridad | TEN-001 con `provisioningSystems` / `provisioningProfiles`: `mikrotik-demo` y `smartolt-demo` en modo simulador (sin endpoints reales); perfiles INT-100 e INT-300. | Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo consultas, eliminar… | Prueba de conexión desde la pantalla. |
| CP-TEC-0183 | RF-TEC-183; M10 §5.15; PRO-O3-09 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Perfiles de aprovisionamiento: mapeo plan comercial (M02) → perfil técnico por sistema (velocidad subida/bajada, VLAN, pool IP, perfil PPPoE/queue, perfil ONU). **Perfiles técnicos de TV (HUE-TV-04):** para planes de TV el perfil declara… | Cambio de plan resuelve perfil destino. En TV, un plan sin `casPackageIds` para el sistema configurado no se puede activar (error `tec.provisioning.profileMissing`); pedir un decodificador por encima de `maxDecoders` se rechaza. |
| CP-TEC-0184 | RF-TEC-184; M10 §5.15; PRO-O3-09 | O3 | Núcleo | seguridad | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Perfil técnico del servicio: identificador de acceso (usuario PPPoE, generado), clave en bóveda, MAC, IP fija/dinámica, AP/nodo, OLT/slot/puerto/vport, serie ONU/CPE, terminal, posición, datos de partner, fecha y usuario de registro. | Secretos nunca en BI ni API pública. |
| CP-TEC-0185 | RF-TEC-185; M10 §5.15; PRO-O3-09 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Comandos de aprovisionamiento durables e idempotentes: `activate`, `changePlan`, `suspend`, `reactivate`, `deactivate`, `delete`, `query`, `resetCredentials`, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). | Reintento no duplica; resultado confirmado o pendiente manual. |
| CP-TEC-0186 | RF-TEC-186; M10 §5.15; PRO-O3-09 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Alta: al confirmar instalación se emite `activate`; el hito de activación espera confirmación del sistema (o registro manual autorizado). | Sin confirmación la instalación queda `executed` pendiente de aprovisionar. |
| CP-TEC-0187 | RF-TEC-187; M10 §5.15; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Corte/suspensión por mora y reactivación (desde M08), cambio de plan con fecha efectiva (desde M09/contrato), baja con desconexión y retiro de equipo. | Evento por resultado al módulo origen. |
| CP-TEC-0188 | RF-TEC-188; M10 §5.15; PRO-O3-09 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Fallback manual: cuando no hay integración o falla definitivamente, generar tarea al NOC con datos y registrar ejecución manual con evidencia. | Tarea manual con SLA y confirmación. |
| CP-TEC-0189 | RF-TEC-189; M10 §5.15; PRO-O3-09 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Exportación masiva para OLT (CSV con OLT, SLOT, PORT, VPORT y acción 0 desconexión / 1 alta-otros) como plantilla. | Archivo `Alta_Desconexion_ddMMyyyy.csv`, separador `;`. |
| CP-TEC-0190 | RF-TEC-190; M10 §5.15; PRO-O3-09 | O3 | Estándar | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Sincronización con sistemas externos de clientes y servicios (AION y equivalentes): clientes, servicios, servicios de socio, con conciliación de diferencias. | Reporte de diferencias sin sobrescritura automática. |
| CP-TEC-0191 | RF-TEC-191; M10 §5.15; PRO-O3-09 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Identificador externo por contrato/conexión (no por cuenta) y tabla de correspondencia por sistema. | Baja de B no apaga A (BASE §86 ejemplo). |
| CP-TEC-0192 | RF-TEC-192; M10 §5.15; PRO-O3-09 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Diagnóstico desde la ficha (consultar estado de sesión, señal ONU, último login) vía `query`, visible a NOC y atención con permiso. | Resultado no se persiste como medición facturable. |
| CP-TEC-0193 | RF-TEC-193; M10 §5.15; PRO-O3-09 | O3 | Estándar | regla | TEN-001 con `inspectionCases` / `seals`: INSP-DEMO-01 (sospecha por consumo cero); precintos PRE-DEMO-0001 a 0010. | Medición de tráfico/uso solo si existe fuente definida; no convierte GB en cargo sin regla. | Sin fuente, la app del socio no muestra consumo. |
| CP-TEC-0194 | RF-TEC-194; M10 §5.15; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos `activate`, `changePlan`, `suspend`, `reactivate` y `deactivate` operan por decodificador y paquete CAS según el perfil técnico de TV de… | Mismo modelo de comandos. Suspender una cuenta de TV con dos decodificadores genera un comando por decodificador con el mismo `commandId` de origen. |
| CP-TEC-0195 | RF-TEC-195; RN-TAR-251; M10 §5.15; PRO-O10-09 | O10 | Estándar | seguridad | TEN-001 con `serviceTechnicalProfiles`: INT-H-A-001: PPPoE `demo-ana`, IP 10.0.0.10 (rango privado), ONT ONT-DEMO-001. | Casillas de correo provistas como servicio (usuario, dominio, otros) con clave en bóveda. El correo electrónico y el pack SMS son servicios del catálogo M02 con aprovisionamiento por T06 y control de cupo y consumo en M04 (DEC-084); M10… | Claves no se migran en claro. Un informe de 260 SMS del período 10/2026 para la línea del pack de un contrato llega a M04 como un único consumo (`unit = sms`, `quantity = 260`); un reenvío del mismo archivo no duplica el consumo; una corrección del proveedor para el mismo período reemplaza la cantidad con `revision` + 1 mientras el período no esté facturado. |
| CP-TEC-0196 | RF-TEC-196; M10 §5.15; PRO-O7-08 | O7 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Comandos de telemedición/medición inteligente desde la OT (conectar, desconectar, tomar lectura, vincular/desvincular medidor, alta de cuenta, cambio de categoría, carga de crédito, consulta de datos, cambio de usuario/clave del portal… | "Operación cancelada por el usuario" no es éxito (CTR-TEC-25). |
### 1.16 Telefonía (MER-017; tasación en M04) (M10 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0197 | RF-TEC-197; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición anterior… | No se conecta una posición inactiva. |
| CP-TEC-0198 | RF-TEC-198; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Servicio conectado a una posición de caja seleccionable al crear la OT entre puntos disponibles. | Posición ocupada no se ofrece. |
| CP-TEC-0199 | RF-TEC-199; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | KML de central, repartidor y cajas. | La exportación KML de una central contiene una marca por central, repartidor y caja con su identificador y coordenadas; los elementos sin coordenadas se informan aparte y no se exportan. |
| CP-TEC-0200 | RF-TEC-200; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Prefijos locales y pool de números con alta/baja por rango, validación de superposición, estados disponible/reservado/asignado/cuarentena/retirado; baja solo de no asignados (lógica, no física). | Rango superpuesto rechazado. |
| CP-TEC-0201 | RF-TEC-201; M10 §5.16; PRO-O10-09 | O10 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea conservando el… | Validación por intervalo de fechas (no solo línea abierta). |
| CP-TEC-0202 | RF-TEC-202; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Reserva de números propuestos en OT abiertas. | Número reservado no se ofrece a otra OT. |
| CP-TEC-0203 | RF-TEC-203; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Telefonía prepaga: categoría prepaga y recarga mediante OT/operación de recarga y concepto de crédito. | Recarga como operación `prepaidTopUp`. |
| CP-TEC-0204 | RF-TEC-204; M10 §5.16; PRO-O10-09 | O10 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Plan de numeración ENACOM (número completo, localidad, provincia, indicativo, bloque, operador, servicio, modalidad con flag móvil, clave, local) importable desde planilla, creando operadores/servicios/modalidades nuevos sin distinguir… | Búsqueda por prefijo más largo con índice (no stored procedures). |
| CP-TEC-0205 | RF-TEC-205; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Importación de CDR por central según modalidad (≈35 formatos y descargas online sin archivo): lectores como plugins; salientes y entrantes; lote por central (cabecera o último + 1); origen con "0"; segundos/clave del archivo según central… | Cada formato habilitado tiene archivo de prueba. |
| CP-TEC-0206 | RF-TEC-206; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Detección de duplicados por (origen, destino, fecha, segundos) con decisión de reprocesar; reutilizar identidad de las ya existentes. | Reimportar el mismo archivo no duplica. |
| CP-TEC-0207 | RF-TEC-207; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Atribución de origen al número vigente a la fecha (0 → "origen no encontrado"; >1 → "duplicado") y de entrantes al destinatario (con y sin prefijo); asignación manual de no atribuidas; borrado/reversión de lote solo si no está… | Reversión bloqueada tras agrupación en M05. |
| CP-TEC-0208 | RF-TEC-208; M10 §5.16; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Exclusión de números en importadores (Lucent) e importe 0 para Telco IP clave 99 como reglas configurables por lector. | Con la regla de exclusión configurada en el lector, los números excluidos no generan registros importados y los de Telco IP clave 99 se importan con importe 0; sin la regla se importan normalmente. |
| CP-TEC-0209 | RF-TEC-209; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Importación de archivos CPP de operadoras (CPP, CP2, CP4, CP5, CP6) e internacionales de carrier (TRL, carga manual con control de repetidos) con operador por defecto. | Liquidación CVLP en M05/M06. |
| CP-TEC-0210 | RF-TEC-210; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. | Línea sin servicio queda en pendientes de asignar. |
| CP-TEC-0211 | RF-TEC-211; M10 §5.16; PRO-O10-09 | O10 | Núcleo | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Envío de llamadas atribuidas a tasación (M04) y recepción del resultado; retasación solo de no agrupadas. | Evento `tec.cdr.attributed`. |
| CP-TEC-0212 | RF-TEC-212; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Guía telefónica (tradicional, compacta A/B, Excel) de titulares que desean figurar. | Respeta consentimiento. |
| CP-TEC-0237 | RF-TEC-237; M10 §5.16; PRO-O10-09 | O10 | Estándar | seguridad | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | **Consulta de llamadas atribuidas por contrato y período** (para el detalle de llamadas del portal, M19 API-POR-122 y PAN-POR-103, y para la atención en M09): API interna de solo lectura (API-TEC-55) que devuelve las `callRecords` con… | Para el contrato TEL-DEMO-01 y el período 2026-10 la API devuelve solo llamadas atribuidas a ese contrato, con destino enmascarado para el socio; un contrato de otro titular responde 404 aunque el ID exista. |
| CP-TEC-0213 | RF-TEC-213; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. | Exportables XLSX/CSV. |
| CP-TEC-0214 | RF-TEC-214; M10 §5.16; PRO-O10-09 | O10 | Estándar | funcional | TEN-001 con Telefonía: Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de… | Llamadas rechazadas (público, abonado, duración) importadas cuando el formato las trae. | Si el archivo trae llamadas rechazadas, se importan con público, abonado y duración y quedan marcadas como rechazadas; si el formato no las trae, la importación no falla. |
| CP-TEC-0234 | RF-TEC-234; RN-TEC-097; M10 §5.16; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con `visitBookings` / `visits`: VIS-DEMO-001 (10/11/2026 09:00–11:00, confirmada), VIS-DEMO-002 (10/11/2026, asignada a EMP-INS-001). | **Portabilidad numérica** (PA-TEC-19): por defecto **No aplica** (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… | Con PRM-TEC-156 = false no se ofrece la operación y EVT-TEC-31 viaja con `portId` nulo. Con el parámetro activo, una portabilidad entrante ejecutada deja el número `assigned` a la línea con la fecha efectiva de ejecución y una saliente lo pasa a `retired` sin borrarlo. |
### 1.17 Geolocalización operativa (BASE §77) (M10 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0215 | RF-TEC-215; M10 §5.17; PRO-O3-10 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | Mostrar el punto de prestación en Google Maps en factibilidad, OT, visita, ficha del servicio y mapa operativo. | Marcador con estado confirmado/aproximado/pendiente. |
| CP-TEC-0216 | RF-TEC-216; M10 §5.17; PRO-O3-10 | O3 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Confirmar o corregir el punto por usuario autorizado (operador, técnico en sitio) registrando fuente, momento y motivo; historial de cambios. | Corrección del técnico queda "propuesta" hasta aprobación si la regla lo exige. |
| CP-TEC-0217 | RF-TEC-217; M10 §5.17; PRO-O3-10 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Distinguir punto confirmado, aproximado y pendiente; no presentar precisión no disponible; no inventar coordenadas. | Pendiente no muestra marcador falso. |
| CP-TEC-0218 | RF-TEC-218; M10 §5.17; PRO-O3-10 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Ubicación por coordenadas o referencias cuando no exista coincidencia de calle/altura (rural, loteo nuevo), con revisión. | Bandeja de revisión PAN-TEC-48. |
| CP-TEC-0219 | RF-TEC-219; M10 §5.17; PRO-O3-10 | O3 | Núcleo | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Manejo de caída o límite de cuota de Google/Georef sin perder el formulario; enriquecimiento posterior por job. | Job `tec:geocodificar-pendientes`. |
| CP-TEC-0220 | RF-TEC-220; M10 §5.17; PRO-O3-10 | O3 | Núcleo | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Usar ubicación del dispositivo solo con permiso y como ayuda; la posición del dispositivo no es automáticamente el domicilio contratado. | Sin permiso de ubicación la app funciona y no registra posición; con permiso, la posición se guarda como dato auxiliar y nunca modifica el domicilio contratado sin una acción explícita del usuario. |
| CP-TEC-0221 | RF-TEC-221; M10 §5.17; PRO-O3-10 | O3 | Núcleo | seguridad | TEN-001 con `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). | Control de acceso a mapa, exportaciones y API de domicilios por tenant y relación autorizada. | Prueba de aislamiento de tenant. |
| CP-TEC-0222 | RF-TEC-222; M10 §5.17; PRO-O3-10 | O3 | Estándar | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Mapa estático opcional en la impresión de OT y factibilidad con la clave del tenant (bóveda), nunca una clave fija. | Sin clave configurada no se imprime mapa. |
| CP-TEC-0223 | RF-TEC-223; M10 §5.17; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Zona de agenda y elemento de red sugerido a partir del punto de prestación. | Sugerencia editable. |
### 1.18 Informes, notificaciones y otros (M10 §5.18)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0224 | RF-TEC-224; M10 §5.18; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Informes técnicos: planilla de control, planilla de relevamiento, detalle de orden, auditoría, reclamos (con numeración por servicio), reincidencias (cuenta / cuenta+servicio / cuenta+servicio+operación), estadísticas de demora, altas y… | Ver §15. |
| CP-TEC-0225 | RF-TEC-225; M10 §5.18; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Vista previa de resultados con marcado de registros y exportación a mapa (KML/Google Earth). | La vista previa permite marcar registros y exportar a KML solo los marcados (o todos si no hay marca); el archivo abre en Google Earth con una marca por registro con coordenadas. |
| CP-TEC-0226 | RF-TEC-226; M10 §5.18; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Notificación al socio al generar/confirmar OT según operación y canal (SMS, WhatsApp con plantilla `generacion_ot`, mail, push), con texto que incluye retiro/no retiro de medidor en desconexión/reconexión y teléfono destino según… | Constancia de entrega en T09. |
| CP-TEC-0227 | RF-TEC-227; M10 §5.18; PRO-O3-10 | O3 | Núcleo | integración | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Publicación de OT al portal del socio (estado y notas públicas) sin sincronización a base externa. | Lectura directa de la misma base. |
| CP-TEC-0228 | RF-TEC-228; M10 §5.18; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | Generar OT de reclamo desde la web/portal (vía M09) según parámetro. | Caso M09 → OT derivada. |
| CP-TEC-0229 | RF-TEC-229; M10 §5.18; PRO-O3-10 | O3 | Estándar | funcional | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | Carga rápida de OT derivada desde la ficha de atención (servicio, descripción) para operadores. | El reclamo nace en M09. |
| CP-TEC-0230 | RF-TEC-230; M10 §5.18; PRO-O11-03 | O11 | Estándar | seguridad | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | API para terceros de consulta de estado de OT y visitas del tenant (T10), sin secretos. | Token con scope. |
### 1.19 Guardias técnicas y protocolo de emergencias (HUE-GAS-05) (M10 §5.19)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0231 | RF-TEC-231; M10 §5.19; PRO-O3-01 | O3 | Núcleo | funcional | TEN-001 con `schedulingZones` / `visitTypes`: Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por… | **Turnos de guardia** por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno vigente)… | Para cualquier fecha y hora el sistema resuelve un único titular de guardia por servicio y zona; un turno sin titular se marca como hueco de cobertura en el tablero. |
| CP-TEC-0232 | RF-TEC-232; M10 §5.19; PRO-O7-08 | O7 | Núcleo | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | **Escalamiento de guardia**: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel… | Sin aceptación en el plazo, el siguiente nivel recibe el aviso y el evento EVT-TEC-36 queda registrado; la aceptación detiene el escalamiento. |
| CP-TEC-0233 | RF-TEC-233; RN-TEC-116; M10 §5.19; PRO-O7-08 | O7 | Núcleo | seguridad | TEN-001 con `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora… | **Protocolo de emergencia por servicio** (fuga de gas, riesgo eléctrico, cable caído, pérdida grave de agua): el caso de M09 marcado `urgentSafety` (RF-CRM-122) llega como comando `tec.workOrder.request` (antes `tec.workOrder.create`, que… | Una OT de emergencia no queda en `pending` sin recurso: si no hay guardia resuelta se asigna al jefe de guardia y se alerta al supervisor. El corte preventivo genera la interrupción y el aviso por T09 sin esperar aprobación (RN-TEC-116). |
### 1.20 Controles de calidad del agua (HUE-AG-01, PA-TEC-20) (M10 §5.20)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-TEC-0235 | RF-TEC-235; M10 §5.20; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON`… | **Puntos y plan de muestreo** (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… | Con PRM-TEC-157 = false no se muestran puntos ni OT de muestreo; activo, cada punto tiene al menos un parámetro con límite y frecuencia. |
| CP-TEC-0236 | RF-TEC-236; M10 §5.20; PRO-O7-08 | O7 | Estándar | regla | TEN-001 con `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. | **Muestras, análisis y resultados**: muestra tomada por OT (fecha, hora, punto, responsable, cadena de custodia), laboratorio (propio o externo, con matrícula o habilitación), protocolo de resultados adjunto como documento en T11 con hash… | Un resultado no se registra sin protocolo del laboratorio adjunto; un resultado fuera de límite exige acción correctiva y no se puede cerrar sin ella; nadie edita un resultado registrado (corrección = nuevo resultado que reemplaza con motivo). |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-TEC-5001 — ESC-TEC-01. Factibilidad vencida**

- Cubre: ESC-TEC-01; RN-TEC-001; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado una factibilidad favorable con `validUntil` vencido
- Cuando se intenta un alta
- Entonces se rechaza con `tec.feasibility.expired`.

**CP-TEC-5002 — ESC-TEC-02. Factibilidad anulada**

- Cubre: ESC-TEC-02; RN-TEC-001; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado una factibilidad anulada
- Cuando se usa en un alta
- Entonces se rechaza (corrige el comportamiento de ProCoop, CTR-TEC-14).

**CP-TEC-5003 — ESC-TEC-03. OT duplicada**

- Cubre: ESC-TEC-03; RN-TEC-019; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado una OT `disconnect` abierta para el contrato
- Cuando se crea otra igual
- Entonces responde 409 `tec.workOrder.duplicate`.

**CP-TEC-5004 — ESC-TEC-04. Idempotencia de alta**

- Cubre: ESC-TEC-04; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Idempotencia de alta
- Entonces Cuando se repite POST con la misma `Idempotency-Key`, entonces se devuelve la misma OT, sin crear otra.

**CP-TEC-5005 — ESC-TEC-05. Reserva concurrente**

- Cubre: ESC-TEC-05; RN-TEC-055; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reserva concurrente
- Entonces Dado un cupo con capacidad 1 y dos socios que confirman a la vez, entonces uno obtiene `confirmed` y el otro `tec.booking.noCapacity`.

**CP-TEC-5006 — ESC-TEC-06. Expiración de reserva**

- Cubre: ESC-TEC-06; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado una reserva `held` de 15 min
- Cuando pasan 16 min sin confirmar
- Entonces queda `expired` y libera el cupo.

**CP-TEC-5007 — ESC-TEC-07. Visita fallida no activa**

- Cubre: ESC-TEC-07; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Visita fallida no activa
- Entonces Cuando la visita se marca `failed`, entonces no hay evento de activación ni movimiento de equipo a domicilio.

**CP-TEC-5008 — ESC-TEC-08 / ESC-03. Conflicto offline**

- Cubre: ESC-TEC-08, ESC-03; RF-TEC-112; relacionados: CU-TEC-02; M10 §17
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conflicto offline
- Entonces El escenario de CU-TEC-02: evidencia conservada, conflicto abierto, sin doble movimiento de stock, resolución auditada.

**CP-TEC-5009 — ESC-TEC-09. Mutación duplicada**

- Cubre: ESC-TEC-09; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Mutación duplicada
- Entonces Cuando el dispositivo reenvía un lote con el mismo `clientMutationId`, entonces el resultado es `duplicate` y no hay efectos repetidos.

**CP-TEC-5010 — ESC-TEC-10. Reintentos de aprovisionamiento**

- Cubre: ESC-TEC-10; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintentos de aprovisionamiento
- Entonces Dado un sistema que falla de forma transitoria 2 veces, entonces el tercer intento confirma y no se crean usuarios duplicados (clave de idempotencia).

**CP-TEC-5011 — ESC-TEC-11 / ESC-04. Resultado incierto**

- Cubre: ESC-TEC-11, ESC-04; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Resultado incierto
- Entonces Dado un timeout después del envío, entonces el worker consulta el estado antes de reenviar; tras restaurar un backup, JOB-TEC-11 concilia sin reenviar a ciegas.

**CP-TEC-5012 — ESC-TEC-12. Corte revocado**

- Cubre: ESC-TEC-12; relacionados: CU-TEC-03; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corte revocado
- Entonces Escenario de CU-TEC-03: el comando queda `cancelled` y M08 recibe el resultado.

**CP-TEC-5013 — ESC-TEC-13. Cierre con requisitos**

- Cubre: ESC-TEC-13; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado `requireResolution=true`
- Cuando se cierra sin resolución
- Entonces se rechaza con `tec.workOrder.closeRequirementsMissing` y la lista de campos.

**CP-TEC-5014 — ESC-TEC-14. Paso de efecto fallido**

- Cubre: ESC-TEC-14; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Paso de efecto fallido
- Entonces Dado que M03 no responde al cerrar un cambio de medidor, entonces la OT queda `closing` con el paso pendiente, JOB-TEC-04 reintenta y no se duplica el efecto.

**CP-TEC-5015 — ESC-TEC-15. Anulación con compensación**

- Cubre: ESC-TEC-15; RN-TEC-036; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado una OT de alta cerrada
- Cuando se anula
- Entonces se generan las compensaciones (contrato, equipo, cargos) y no hay borrado físico (CTR-TEC-20).

**CP-TEC-5016 — ESC-TEC-16. Material sin custodia**

- Cubre: ESC-TEC-16; RF-TEC-064; M10 §17
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `resolutionCodes`: `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Material sin custodia
- Entonces Cuando el técnico registra una serie que no está en su custodia, entonces se rechaza con `tec.material.notInCustody` (o se marca la diferencia para revisar, según la operación).

**CP-TEC-5017 — ESC-TEC-17. Impacto de red**

- Cubre: ESC-TEC-17; RF-TEC-148; M10 §17
- Ola: O7 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `networks` / `networkElements`: Red `FTTH-DEMO`: OLT-DEMO-01 → PON 1/1 → splitter SPL-DEMO-01 (1:8) → NAP-DEMO-01; red `ELEC-DEMO`: SET-DEMO → alimentador AL-01 → TR-DEMO-01 → 120 conexiones ficticias (2 críticas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Impacto de red
- Entonces Dado un árbol de 3 niveles con 120 conexiones bajo TR-DEMO-01, entonces el impacto devuelve 120 contratos y marca los críticos.

**CP-TEC-5018 — ESC-TEC-18. Relación de red inválida**

- Cubre: ESC-TEC-18; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Relación de red inválida
- Entonces Cuando se conecta un tipo de componente no permitido, entonces el error es `tec.network.relationNotAllowed`.

**CP-TEC-5019 — ESC-TEC-19. Contribución con redondeo**

- Cubre: ESC-TEC-19; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Contribución con redondeo
- Entonces Dado ARS 100.000 entre 3 frentistas iguales, entonces 33.333,33 + 33.333,33 + 33.333,34 = 100.000,00.

**CP-TEC-5020 — ESC-TEC-20. Separación de funciones**

- Cubre: ESC-TEC-20; RN-TEC-094; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Separación de funciones
- Entonces Cuando el inspector intenta aprobar su propio recupero, entonces recibe `tec.inspection.segregationOfDuties`.

**CP-TEC-5021 — ESC-TEC-21. CDR duplicado**

- Cubre: ESC-TEC-21; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CDR duplicado
- Entonces Cuando se reimporta el mismo archivo, entonces se rechaza por hash; si una llamada se repite en otro archivo, se descarta por `dedupeKey`.

**CP-TEC-5022 — ESC-TEC-22. Permiso negativo (técnico)**

- Cubre: ESC-TEC-22; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo (técnico)
- Entonces Un técnico no puede ver OT de otra cuadrilla ni autorizar materiales: 403 y sin datos en la respuesta.

**CP-TEC-5023 — ESC-TEC-23. Permiso negativo (socio)**

- Cubre: ESC-TEC-23; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo (socio)
- Entonces Un socio no puede consultar la visita de otra cuenta: 404, sin revelar que existe.

**CP-TEC-5024 — ESC-TEC-24. Permiso negativo (configuración)**

- Cubre: ESC-TEC-24; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo (configuración)
- Entonces Un operador sin `tec.config.gestionar` no ve el menú de catálogos y la API responde 403. (antes `tec.config.manage`)

**CP-TEC-5025 — ESC-TEC-25. Aislamiento de tenant**

- Cubre: ESC-TEC-25; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aislamiento de tenant
- Entonces Con un usuario de TEN-001, toda consulta por un ID de TEN-002 devuelve 404. Los índices empiezan por `tenantId`, los jobs llevan `tenantId` y los archivos se guardan con prefijo por tenant.

**CP-TEC-5026 — ESC-TEC-26. Credenciales**

- Cubre: ESC-TEC-26; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Credenciales
- Entonces Ninguna respuesta de la API ni ningún log contiene contraseñas o claves de sistemas de red: solo `credentialRef`.

**CP-TEC-5027 — ESC-TEC-27. Dispositivo revocado**

- Cubre: ESC-TEC-27; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dispositivo revocado
- Entonces Cuando se revoca un dispositivo, entonces su próxima sincronización se rechaza y su caché local se borra.

**CP-TEC-5028 — ESC-TEC-28. Desvío de reloj**

- Cubre: ESC-TEC-28; RN-TEC-069; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Desvío de reloj
- Entonces Cuando llega una mutación con 30 min de desvío, entonces se aplica y queda marcada para revisión.

**CP-TEC-5029 — ESC-TEC-29. Conciliación de custodia**

- Cubre: ESC-TEC-29; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación de custodia
- Entonces Al cierre del día, la suma de los movimientos de la OT es igual a las variaciones de la custodia del técnico en M13 (conciliación diaria sin diferencias).

**CP-TEC-5030 — ESC-TEC-30. Activación con fecha efectiva**

- Cubre: ESC-TEC-30; RN-TEC-064; M10 §17
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `taskCatalog` / `taskGroups`: Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Activación con fecha efectiva
- Entonces Dado una instalación probada el 10/11 y un aprovisionamiento confirmado el 11/11 con `activationMilestone=testedAndProvisioned`, entonces `effectiveAt` es el 11/11 y se registran ambos hechos (PA-TEC-02).

## 3. Casos por caso de uso (CU)

**CP-TEC-8001 — CU-17. Conectar Internet con OT**

- Cubre: CU-17; RF-TEC-022; M10 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado SOL-001 con documentación completa (M09) y factibilidad favorable. -; actor: supervisor y cuadrilla técnica. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) El supervisor aprueba la cobertura y crea OT-001 (`connect`). 2) TEC pide a M13 reservar el equipo; el despachante asigna CUA-01. 3) La cuadrilla registra instalación, prueba y conformidad; TEC envía la fecha efectiva al contrato. -
- Entonces OT revisada, contrato habilitable desde la fecha confirmada, materiales y evidencias vinculados. - Trazabilidad: RF-TEC-022 a 063, 085 a 101; §9.1.

**CP-TEC-8002 — CU-18. Mantenimiento preventivo de un activo**

- Cubre: CU-18; RF-TEC-138; M10 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado la válvula VAL-001 tiene un plan preventivo. -; actor: responsable de mantenimiento. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) Consulta ubicación e historial en PAN-TEC-27/29. 2) Crea la intervención y marca la zona afectada (análisis de impacto, PAN-TEC-28). 3) Registra tareas, materiales y resultado; el plan recalcula el próximo control. -
- Entonces Historial técnico actualizado y trazable por activo. - Trazabilidad: RF-TEC-138 a 147; §9.6, §9.7.

**CP-TEC-8003 — CU-AUT-01. Contratación con turno desde la app**

- Cubre: CU-AUT-01; RF-TEC-073; M10 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida).
- Dado actor: socia ASO-001 (ficticia) y cooperativa TEN-001. - Flujo técnico: M09 crea el caso → TEC dictamina factibilidad → la socia elige la franja VIS-DEMO-001 (10/11/2026, 09:00 a 11:00) en PAN-TEC-57 → TEC confirma la reserva → asignación y visita → instalación → activación desde la fecha efectiva. - Control: una visita fallida no activa el contrato (RN de visitas; §8.3). - Trazabilidad: RF-TEC-073 a 084…
- Cuando - Definición dueña: M19 «CU-AUT-01 — Ciclo completo de Internet». Aquí solo el tramo técnico (factibilidad, reserva, visita e instalación). -
- Entonces Se completa «Contratación con turno desde la app» sin errores, con los efectos que exigen RF-TEC-073, y quedan auditoría y evento del cambio

**CP-TEC-8004 — CU-INS-01. Instalación integral**

- Cubre: CU-INS-01; RF-TEC-085; M10 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: Encuesta: ENC-DEMO-001, respuesta 4/5.
- Dado actor: instalador EMP-INS-001 y socia. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando cita VIS-DEMO-002 el 10/11/2026; MOD-DEMO-001 en custodia del instalador; informa En camino; instala y prueba; registra la serie; captura la conformidad. La confirmación vincula el equipo al contrato (M13), actualiza la custodia y publica la activación del 10/11/2026. Se genera ENC-DEMO-001 y la respuesta 4/5 va al tablero, sin modificar el precio ni la fecha. - Fuera de TEC: el primer cobro (prorrateo de 21/30 días, ARS 21.000 de abono más ARS 20.000 de instalación en la hipótesis de BASE) lo calculan…
- Entonces Se completa «Instalación integral» sin errores, con los efectos que exigen RF-TEC-085, y quedan auditoría y evento del cambio

**CP-TEC-8005 — CU-GEO-01. Punto de prestación**

- Cubre: CU-GEO-01; RF-TEC-215; M10 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `crews` / `fieldResources`: CUA-01 (Z-01) con EMP-INS-001 y EMP-INS-002; CUA-02 (Z-02) con EMP-INS-003; supervisor SUP-DEMO-01.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M01/T04 normalizan la dirección DIR-DEMO-001. TEC usa el punto confirmado para la factibilidad, la agenda y la ruta. Si el punto está "pendiente de georreferenciación", la OT se crea igual con la marca y entra a la cola de PAN-TEC-48. Nunca se inventan coordenadas. - Trazabilidad: RF-TEC-215 a 223.
- Entonces Se completa «Punto de prestación» sin errores, con los efectos que exigen RF-TEC-215, y quedan auditoría y evento del cambio

**CP-TEC-8006 — CU-OPE-01. Módem comprado y aplicado**

- Cubre: CU-OPE-01; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Módem comprado y aplicado
- Entonces TEC solo interviene en la aplicación del equipo a una OT de Internet: lo consume desde la custodia del instalador una sola vez (sin doble descuento) y no genera cargo al socio por el costo del equipo. La compra y el pago se describen en M12 (definición dueña: «CU-OPE-01 — Compra de módems por servicio»), M13, M14 y M15.

**CP-TEC-8007 — CU-TEC-01. Visita fallida y reprogramación**

- Cubre: CU-TEC-01; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida).
- Dado actor: técnico, socio y despachante. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando el técnico llega y no hay acceso → marca `failed` con motivo y foto → la OT vuelve a `pending` y la instalación a `failedVisit` → el socio recibe la propuesta de nueva franja → reserva → nueva visita confirmada. El equipo sigue en custodia. - Control: no hay activación ni movimiento de stock al domicilio. El cargo solo existe si lo define una regla (PA-TEC-06).
- Entonces Se completa «Visita fallida y reprogramación» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8008 — CU-TEC-02. Instalación offline con conflicto (ESC-03)**

- Cubre: CU-TEC-02; relacionados: ESC-03; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el técnico ejecuta sin red y captura firma, fotos y la serie. Mientras tanto, un operador cancela la OT en la administración. Al sincronizar, el servidor responde `conflict`, conserva las evidencias y abre el conflicto. El supervisor elige `acceptField`: reabre la OT, aplica el equipo y activa con la fecha real. - Control: sin doble salida de equipo, sin borrado de evidencias y con auditoría completa.
- Entonces Se completa «Instalación offline con conflicto (ESC-03)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8009 — CU-TEC-03. Corte por mora remoto con pago previo**

- Cubre: CU-TEC-03; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M08 ordena la suspensión → TEC encola `suspend` en MikroTik. El socio paga antes del envío → M08 revoca → el comando pasa a `cancelled`. No hay corte ni proporcionales.
- Entonces Se completa «Corte por mora remoto con pago previo» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8010 — CU-TEC-04. Aprovisionamiento con caída del sistema de red**

- Cubre: CU-TEC-04; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando la OT de alta se ejecuta y el comando `activate` falla 5 veces → `failed` → `manualPending`. El NOC activa a mano y registra la evidencia → `manualDone` → activación confirmada con la fecha de la evidencia.
- Entonces Se completa «Aprovisionamiento con caída del sistema de red» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8011 — CU-TEC-05. Interrupción planificada**

- Cubre: CU-TEC-05; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el responsable selecciona el transformador TR-DEMO-01 → el impacto muestra 120 contratos ficticios, 2 de ellos críticos → aprueba → T09 avisa con constancia → OT de mantenimiento → cierre e informe.
- Entonces Se completa «Interrupción planificada» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8012 — CU-TEC-06. Traslado de servicio**

- Cubre: CU-TEC-06; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando la socia pide el traslado → factibilidad en el nuevo domicilio → OT `move` con la visita → al confirmar: cambio de domicilio del contrato, nueva conexión de red, retiro de la conexión anterior y aviso para revisar el recorrido (PRM-TEC-061/062).
- Entonces Se completa «Traslado de servicio» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8013 — CU-TEC-07. Cambio de medidor**

- Cubre: CU-TEC-07; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando OT `meterChange` → el técnico registra la lectura de retiro, la serie y la lectura de instalación → evento `tec.meter.changed` a M03 y M13.
- Entonces Se completa «Cambio de medidor» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8014 — CU-TEC-08. Inspección con irregularidad**

- Cubre: CU-TEC-08; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `inspectionCases` / `seals`: INSP-DEMO-01 (sospecha por consumo cero); precintos PRE-DEMO-0001 a 0010.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando alerta de consumo de M03 → caso → OT de inspección con acta, precintos y fotos → irregularidad → notificación con 10 días de descargo → propuesta de recupero (M04) → aprobación por un rol distinto al del inspector → documento separado (M05).
- Entonces Se completa «Inspección con irregularidad» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8015 — CU-TEC-09. Contribución por mejoras**

- Cubre: CU-TEC-09; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `connectionEstimates`: EST-DEMO-001: drop de 150 m, mano de obra de 2 h; total ARS 45.000 (ficticio).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando obra OBR-DEMO-01 de ARS 1.000.000 (ficticio) con 4 frentistas de 10, 20, 30 y 40 m → shares 10 %, 20 %, 30 % y 40 % → importes ARS 100.000, 200.000, 300.000 y 400.000 → aprobación → envío a M05/M08.
- Entonces Se completa «Contribución por mejoras» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8016 — CU-TEC-10. Importación de CDR**

- Cubre: CU-TEC-10; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `serviceConformities`: Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se sube el archivo de una central → se rechaza si su hash ya existe → se parsea; un error en la fila 152 aborta con el número de fila → se corrige y se reimporta → deduplicación → atribución → M04 tasa la llamada.
- Entonces Se completa «Importación de CDR» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8017 — CU-TEC-11. Cierre masivo con OT bloqueadas**

- Cubre: CU-TEC-11; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrderOperationTypes`: `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN`…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se seleccionan 50 OT; 3 están despachadas a campo y 1 tiene un conflicto. El job cierra 46 y devuelve las 4 restantes con su motivo, por ítem. Se puede reanudar si se interrumpe.
- Entonces Se completa «Cierre masivo con OT bloqueadas» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-TEC-8018 — CU-TEC-12. Reclamo que deriva en OT**

- Cubre: CU-TEC-12; M10 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M10 §18.
- Datos de prueba: `workOrders`: OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M09 registra el reclamo y lo clasifica → `crm.commandRequest.requested` (EVT-CRM-13) → TEC crea la OT con `crmCaseId` → los estados de la OT se reflejan en el caso → el cierre de la OT no cierra el caso automáticamente (lo cierra M09).
- Entonces Se completa «Reclamo que deriva en OT» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio
