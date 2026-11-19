# Casos de prueba de aceptación — T12 SRV — Fichas verticales por servicio · Parte 2 (DEC-073)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T12-SRV-fichas-verticales-servicios-parte2.md`](../../especificacion/anexos/T12-SRV-fichas-verticales-servicios-parte2.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 0 CP de requisitos funcionales, 58 CP de escenarios ESC y 0 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 2. Casos por escenario y criterio de aceptación con ID

**CP-SRV-5059 — ESC-T12-OBR-01. Se aprueba el prorrateo por metros de frente**

- Cubre: ESC-T12-OBR-01; relacionados: CU-TEC-09; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado OBR-DEMO-01 de ARS 1.000.000 con base aprobada y frentistas de 10, 20, 30 y 40 m en TEN-001
- Cuando se aprueba el prorrateo por metros de frente
- Entonces se publica `tec.levy.approved` con ARS 100.000, 200.000, 300.000 y 400.000 y la suma es exactamente ARS 1.000.000 (CU-TEC-09).

**CP-SRV-5060 — ESC-T12-OBR-02. Corre `tar:calcular-lote` y se emite el lote**

- Cubre: ESC-T12-OBR-02; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el contrato del frentista de 20 m con plan de 10 cuotas
- Cuando corre `tar:calcular-lote` y se emite el lote
- Entonces la factura lleva "Cuota 1/10" por ARS 20.000, el plan pasa a 1 cuota facturada y, al anular la factura (EVT-FAC-08), vuelve a 0.

**CP-SRV-5061 — ESC-T12-OBR-03. Se calcula la cuota 10**

- Cubre: ESC-T12-OBR-03; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el mismo contrato con 9 cuotas facturadas y ARS 0,03 de redondeo acumulado
- Cuando se calcula la cuota 10
- Entonces cobra el saldo exacto y, tras emitirla, JOB-CAT-12 pasa el contrato a `terminated`.

**CP-SRV-5062 — ESC-T12-OBR-04. (error) se calcula**

- Cubre: ESC-T12-OBR-04; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un contrato tipo 17 de pavimento sin inmueble asociado
- Cuando se calcula
- Entonces el renglón falla con `TAR-E-WORKS-PROPERTY` en formato RFC 9457 y el contrato queda en la bandeja de excepciones del lote sin emitir factura.

**CP-SRV-5063 — ESC-T12-OBR-05. (error) el responsable intenta aprobar el prorrateo en PAN-TEC-40**

- Cubre: ESC-T12-OBR-05; RN-TEC-093; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado OBR-DEMO-02 sin base aprobada adjunta
- Cuando el responsable intenta aprobar el prorrateo en PAN-TEC-40
- Entonces recibe 422 y no se crea ningún contrato tipo 17 (RN-TEC-093).

**CP-SRV-5064 — ESC-T12-OBR-06. (aislamiento) consulta `GET /admin/tec/works/{id de OBR-DEMO-01}`**

- Cubre: ESC-T12-OBR-06; T12 §7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un usuario de TEN-002 con `tec.obras.gestionar` (antes `tec.work.manage`)
- Cuando consulta `GET /admin/tec/works/{id de OBR-DEMO-01}`
- Entonces recibe 404 y no ve la obra ni sus beneficiarios.

**CP-SRV-5065 — ESC-T12-OBR-07. Un operador pide la baja anticipada**

- Cubre: ESC-T12-OBR-07; RF-MOR-069; T12 §7
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OBR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un frentista con 4 cuotas impagas y PRM-CAT-072 = `supervisor`
- Cuando un operador pide la baja anticipada
- Entonces la acción exige aprobación de supervisor, emite la cancelación del saldo y no suspende ningún otro servicio de la cuenta (RF-MOR-069).

**CP-SRV-5066 — ESC-T12-SEP-01. M04 calcula el período 10-2026 con API-SOC-006**

- Cubre: ESC-T12-SEP-01; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el contrato SOC-FAM de "Ana Demo" con 3 adherentes vigentes al 31-10-2026 y franquicia de 2
- Cuando M04 calcula el período 10-2026 con API-SOC-006
- Entonces cobra la cuota del grupo más 1 adherente excedente y REP-SOC-03 informa 1 adherente facturable.

**CP-SRV-5067 — ESC-T12-SEP-02. Se solicita un sepelio con evento el 15-10-2026**

- Cubre: ESC-T12-SEP-02; relacionados: ESC-SOC-02; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un hijo dado de alta el 01-09-2026 con carencia de 90 días
- Cuando se solicita un sepelio con evento el 15-10-2026
- Entonces la verificación devuelve `notCovered` por carencia con opción de excepción (ESC-SOC-02).

**CP-SRV-5068 — ESC-T12-SEP-03. M18 consume `per.person.deceased`**

- Cubre: ESC-T12-SEP-03; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un adherente fallecido registrado en M01
- Cuando M18 consume `per.person.deceased`
- Entonces el adherente queda `ended` con causa `death`, la ficha lo oculta (PRM-SOC-007) y la cuota del período siguiente baja en ese adherente.

**CP-SRV-5069 — ESC-T12-SEP-04. El mismo usuario que lo creó intenta aprobarlo**

- Cubre: ESC-T12-SEP-04; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un subsidio por ARS 300.000 con dos beneficiarios al 50 %
- Cuando el mismo usuario que lo creó intenta aprobarlo
- Entonces se rechaza; cuando lo aprueba otro usuario, entonces se publica EVT-SOC-04 y M14 emite la orden de pago.

**CP-SRV-5070 — ESC-T12-SEP-05. (error) se da de alta un hijo de 25 años con `Idempotency-Key`**

- Cubre: ESC-T12-SEP-05; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un plan con edad máxima 21 para hijos
- Cuando se da de alta un hijo de 25 años con `Idempotency-Key`
- Entonces la API responde 422 RFC 9457 con motivo "edad fuera de rango" y reenviar la misma clave no crea un adherente.

**CP-SRV-5071 — ESC-T12-SEP-06. (aislamiento) consulta `/api/admin/soc/contracts/{contrato de Ana Demo}/dependents`**

- Cubre: ESC-T12-SEP-06; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un operador de TEN-002 con `soc.adherentes.ver`
- Cuando consulta `/api/admin/soc/contracts/{contrato de Ana Demo}/dependents`
- Entonces recibe 404.

**CP-SRV-5072 — ESC-T12-SEP-07. Se activa un contrato ELE nuevo**

- Cubre: ESC-T12-SEP-07; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SEP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PAR-DEMO-001 en modo `propose`
- Cuando se activa un contrato ELE nuevo
- Entonces queda una propuesta de alta de SEP pendiente de consentimiento y no se crea contrato ni cargo hasta aceptarla (DEC-023).

**CP-SRV-5073 — ESC-T12-CEM-01. Dos operadores la reservan al mismo tiempo**

- Cubre: ESC-T12-CEM-01; relacionados: ESC-SOC-07; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PAR-DEMO-001 disponible en "Parque Demo"
- Cuando dos operadores la reservan al mismo tiempo
- Entonces una reserva se confirma y la otra recibe `soc.unit.notAvailable` (ESC-SOC-07).

**CP-SRV-5074 — ESC-T12-CEM-02. Corre JOB-SOC-04**

- Cubre: ESC-T12-CEM-02; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado una reserva de PAR-DEMO-001 creada hace 8 días sin formalizar y PRM-SOC-014 = 7
- Cuando corre JOB-SOC-04
- Entonces la unidad vuelve a disponible y queda el evento de liberación.

**CP-SRV-5075 — ESC-T12-CEM-03. Corre `mor:evaluar-mora`**

- Cubre: ESC-T12-CEM-03; relacionados: ESC-SOC-05; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un derecho formalizado con plan CEM-PAR de 24 cuotas de ARS 50.000 y 3 cuotas de mantenimiento impagas
- Cuando corre `mor:evaluar-mora`
- Entonces no se crea orden de corte de otros servicios, el derecho y la ocupación no cambian y REP-SOC-10 muestra el saldo (ESC-SOC-05).

**CP-SRV-5076 — ESC-T12-CEM-04. (error) se intenta registrar como realizada desde PAN-SOC-35**

- Cubre: ESC-T12-CEM-04; relacionados: ESC-SOC-08; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado una inhumación solicitada por un tercero no autorizado
- Cuando se intenta registrar como realizada desde PAN-SOC-35
- Entonces se rechaza con `soc.act.unauthorized` (ESC-SOC-08).

**CP-SRV-5077 — ESC-T12-CEM-05. Cambia el pagador a otro familiar**

- Cubre: ESC-T12-CEM-05; relacionados: ESC-SOC-06; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un derecho con un fallecido inhumado
- Cuando cambia el pagador a otro familiar
- Entonces titular y ocupación no cambian y la próxima cuota sale a nombre del nuevo pagador (ESC-SOC-06).

**CP-SRV-5078 — ESC-T12-CEM-06. (aislamiento) se consulta `/api/public/<slug de TEN-002>/soc/cemetery/search` con el nombre de un difunto de TEN-001**

- Cubre: ESC-T12-CEM-06; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha CEM (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PRM-SOC-050 = `true` en TEN-001 y `false` en TEN-002
- Cuando se consulta `/api/public/<slug de TEN-002>/soc/cemetery/search` con el nombre de un difunto de TEN-001
- Entonces la respuesta está vacía o es 404 y nunca muestra datos de TEN-001.

**CP-SRV-5079 — ESC-T12-SAN-01. Se cierra SAN-DEM-001**

- Cubre: ESC-T12-SAN-01; relacionados: ESC-SOC-09; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado CONV-SAN-DEMO financiado por la cooperativa y BEN-DEMO-001 vigente
- Cuando se cierra SAN-DEM-001
- Entonces no se genera comprobante al paciente y JOB-SOC-11 registra el costo del convenio del período (ESC-SOC-09).

**CP-SRV-5080 — ESC-T12-SAN-02. (error) un administrador intenta crear un concepto facturable de tipo "unidad de sangre"**

- Cubre: ESC-T12-SAN-02; RF-SOC-067; T12 §7
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el catálogo del servicio SAN
- Cuando un administrador intenta crear un concepto facturable de tipo "unidad de sangre"
- Entonces M02 lo rechaza con error RFC 9457 (RF-SOC-067).

**CP-SRV-5081 — ESC-T12-SAN-03. Se registra una solicitud de sangre**

- Cubre: ESC-T12-SAN-03; RF-SOC-036; T12 §7
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el titular de BEN-DEMO-001 con ARS 15.000 vencidos en otro servicio
- Cuando se registra una solicitud de sangre
- Entonces queda "en gestión" con advertencia y no es rechazada (RF-SOC-036).

**CP-SRV-5082 — ESC-T12-SAN-04. (permiso) consulta solicitudes de banco de sangre**

- Cubre: ESC-T12-SAN-04; relacionados: ESC-SOC-11; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un supervisor de Agua de TEN-001
- Cuando consulta solicitudes de banco de sangre
- Entonces recibe 403 y no aparecen en la búsqueda global (ESC-SOC-11).

**CP-SRV-5083 — ESC-T12-SAN-05. (aislamiento) pide `/api/admin/soc/blood-requests/{id de SAN-DEM-001}`**

- Cubre: ESC-T12-SAN-05; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un operador de TEN-002 con `soc.sangre.ver`
- Cuando pide `/api/admin/soc/blood-requests/{id de SAN-DEM-001}`
- Entonces recibe 404.

**CP-SRV-5084 — ESC-T12-SAN-06. Se inspecciona el esquema**

- Cubre: ESC-T12-SAN-06; relacionados: ESC-SOC-10; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAN (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el modelo de solicitudes de banco de sangre de M18
- Cuando se inspecciona el esquema
- Entonces no existen campos de grupo sanguíneo, diagnóstico ni compatibilidad (ESC-SOC-10).

**CP-SRV-5085 — ESC-T12-SAL-01. El chofer lo finaliza en PAN-SOC-34 y el responsable lo cierra**

- Cubre: ESC-T12-SAL-01; RF-SOC-080; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un viaje no cubierto de 120 km con tarifa ARS 900 por km
- Cuando el chofer lo finaliza en PAN-SOC-34 y el responsable lo cierra
- Entonces se publica `soc.trip.completed` y M05 recibe un ítem facturable de ARS 108.000 (RF-SOC-080).

**CP-SRV-5086 — ESC-T12-SAL-02. Se verifica una nueva solicitud**

- Cubre: ESC-T12-SAL-02; RF-SOC-035; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un plan con tope anual de 2 traslados y uno ya usado
- Cuando se verifica una nueva solicitud
- Entonces la cobertura informa 1 disponible y el viaje queda cubierto (RF-SOC-035).

**CP-SRV-5087 — ESC-T12-SAL-03. Se registra**

- Cubre: ESC-T12-SAL-03; relacionados: ESC-SOC-22; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado una solicitud marcada emergencia
- Cuando se registra
- Entonces queda `derived`, muestra la derivación de PRM-SOC-048 y no se agenda (ESC-SOC-22).

**CP-SRV-5088 — ESC-T12-SAL-04. (error) se lo asigna a un traslado**

- Cubre: ESC-T12-SAL-04; relacionados: ESC-SOC-18; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado AMB-01 con seguro vencido
- Cuando se lo asigna a un traslado
- Entonces la asignación falla con `soc.vehicle.unfit` (ESC-SOC-18).

**CP-SRV-5089 — ESC-T12-SAL-05. (permiso) abre un traslado y exporta el informe**

- Cubre: ESC-T12-SAL-05; relacionados: ESC-SOC-12; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un operador sin `soc.datosSensibles.ver`
- Cuando abre un traslado y exporta el informe
- Entonces el motivo aparece enmascarado y no se exporta (ESC-SOC-12).

**CP-SRV-5090 — ESC-T12-SAL-06. (aislamiento) consulta un viaje de TEN-001 por id**

- Cubre: ESC-T12-SAL-06; relacionados: ESC-SOC-14; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha SAL (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un usuario de TEN-002
- Cuando consulta un viaje de TEN-001 por id
- Entonces recibe 404 (ESC-SOC-14).

**CP-SRV-5091 — ESC-T12-VIV-01. M04 calcula la cuota**

- Cubre: ESC-T12-VIV-01; relacionados: ESC-SOC-15; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado "Dúplex 2D" a ARS 40.000.000, adjudicada, mínimo 1 % y 99,5 % facturado
- Cuando M04 calcula la cuota
- Entonces el aporte es 0,5 % = ARS 200.000 (ESC-SOC-15).

**CP-SRV-5092 — ESC-T12-VIV-02. Se anula la factura**

- Cubre: ESC-T12-VIV-02; relacionados: ESC-SOC-16, ESC-SOC-23; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado una cuota de 1 % emitida (ARS 400.000)
- Cuando se anula la factura
- Entonces `pctBilled` baja 1 punto y el evento repetido no lo baja dos veces (ESC-SOC-16, ESC-SOC-23).

**CP-SRV-5093 — ESC-T12-VIV-03. (error) se inscribe un segundo plan**

- Cubre: ESC-T12-VIV-03; relacionados: ESC-SOC-17; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado una cuenta con un plan de vivienda
- Cuando se inscribe un segundo plan
- Entonces se rechaza con `soc.housing.secondPlan` (ESC-SOC-17).

**CP-SRV-5094 — ESC-T12-VIV-04. Se rescinde el plan conectado con aprobación**

- Cubre: ESC-T12-VIV-04; RF-SOC-108; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado aportes por ARS 4.000.000 y comisión de rescisión 10 %
- Cuando se rescinde el plan conectado con aprobación
- Entonces se calcula ARS 400.000 de comisión y el saldo a devolver o compensar (RF-SOC-108).

**CP-SRV-5095 — ESC-T12-VIV-05. (separación de tareas) intenta aprobar el certificado**

- Cubre: ESC-T12-VIV-05; relacionados: ESC-SOC-13; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el técnico que cargó el progreso
- Cuando intenta aprobar el certificado
- Entonces se rechaza (ESC-SOC-13).

**CP-SRV-5096 — ESC-T12-VIV-06. (aislamiento) pide `/api/admin/soc/housing-units/{id de TEN-001}`**

- Cubre: ESC-T12-VIV-06; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un usuario de TEN-002 con `soc.vivienda.ver`
- Cuando pide `/api/admin/soc/housing-units/{id de TEN-001}`
- Entonces recibe 404.

**CP-SRV-5097 — ESC-T12-VIV-07. Se factura el período 07-2026 el 05-10-2026**

- Cubre: ESC-T12-VIV-07; RF-SOC-086; RN-SOC-032; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha VIV (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado precios de "Dúplex 2D" del 01-03-2026 y del 01-09-2026
- Cuando se factura el período 07-2026 el 05-10-2026
- Entonces se usa el precio del 01-03-2026 (RF-SOC-086, RN-SOC-032).

**CP-SRV-5098 — ESC-T12-TAS-01. Se emite la factura de energía de ARS 20.000 de un socio residencial**

- Cubre: ESC-T12-TAS-01; T12 §7
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado el convenio "Municipalidad Demo — Tasa hospital" vigente por ARS 1.000 por factura
- Cuando se emite la factura de energía de ARS 20.000 de un socio residencial
- Entonces el PDF muestra el bloque de terceros con ARS 1.000, el tributo va con Id 3 y el asiento acredita el pasivo del convenio.

**CP-SRV-5099 — ESC-T12-TAS-02. El socio paga ARS 10.500**

- Cubre: ESC-T12-TAS-02; RF-FIS-138; T12 §7
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado esa factura de ARS 21.000 (ARS 1.000 de terceros)
- Cuando el socio paga ARS 10.500
- Entonces se imputan ARS 500 al tercero por prorrata y EVT-FIS-16 informa ese importe (RF-FIS-138).

**CP-SRV-5100 — ESC-T12-TAS-03. (error) corre el lote**

- Cubre: ESC-T12-TAS-03; RF-FAC-120; T12 §7
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un ítem "Tasa de bomberos" sin convenio vigente
- Cuando corre el lote
- Entonces el ítem queda en la bandeja de excepciones "Concepto de terceros sin convenio" y la factura sale sin ese ítem (RF-FAC-120).

**CP-SRV-5101 — ESC-T12-TAS-04. Corre JOB-FIS-15 y se aprueba la rendición**

- Cubre: ESC-T12-TAS-04; T12 §7
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado cobros imputados al tercero por ARS 50.000 en el período y comisión 2 %
- Cuando corre JOB-FIS-15 y se aprueba la rendición
- Entonces el neto a rendir es ARS 49.000, M14 recibe la orden de pago y REP-FIS-012 cuadra.

**CP-SRV-5102 — ESC-T12-TAS-05. (error) el cajero intenta anular el cobro**

- Cubre: ESC-T12-TAS-05; RN-COB-073; T12 §7
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un comprobante de "Ente Demo Agua" cobrado en caja y ya rendido
- Cuando el cajero intenta anular el cobro
- Entonces se rechaza (RN-COB-073).

**CP-SRV-5103 — ESC-T12-TAS-06. (aislamiento) lista convenios**

- Cubre: ESC-T12-TAS-06; T12 §7
- Ola: O8 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un usuario de TEN-002 con `fis.terceros.configurar`
- Cuando lista convenios
- Entonces no ve el convenio de TEN-001 y su id devuelve 404.

**CP-SRV-5104 — ESC-T12-TAS-07. (error) se valida la importación**

- Cubre: ESC-T12-TAS-07; RF-FAC-121; T12 §7
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha TAS (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un archivo IAL de alumbrado con un suministro inexistente
- Cuando se valida la importación
- Entonces esa fila se rechaza con "CUENTA INEXISTENTE" y las demás quedan listas para confirmar (RF-FAC-121).

**CP-SRV-5105 — ESC-T12-CAP-01. Se emite la factura de Internet de ARS 22.000**

- Cubre: ESC-T12-CAP-01; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PRM-INS-017 = `inServiceInvoice` y un concepto capitalizable de ARS 1.000
- Cuando se emite la factura de Internet de ARS 22.000
- Entonces el comprobante muestra "Cuota social ARS 1.000" en renglón propio con leyenda y se registra un movimiento `billed` de ARS 1.000 (DEC-061).

**CP-SRV-5106 — ESC-T12-CAP-02. Se confirma un pago de ARS 9.200 (40 %)**

- Cubre: ESC-T12-CAP-02; RF-INS-035; T12 §7
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado esa factura de ARS 23.000
- Cuando se confirma un pago de ARS 9.200 (40 %)
- Entonces se integran ARS 400 y el asiento de integración se genera en M15 (RF-INS-035).

**CP-SRV-5107 — ESC-T12-CAP-03. Se anula (EVT-FAC-08)**

- Cubre: ESC-T12-CAP-03; RN-INS-019; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado la factura con capital integrado parcialmente
- Cuando se anula (EVT-FAC-08)
- Entonces se crean contramovimientos vinculados, el saldo vuelve al previo y ningún movimiento se borra (RN-INS-019).

**CP-SRV-5108 — ESC-T12-CAP-04. (error) se intenta preparar un lote sobre el mismo universo**

- Cubre: ESC-T12-CAP-04; RF-FAC-017, RF-INS-044; T12 §7
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado JOB-INS-01 en curso sobre el universo "Residencial Centro"
- Cuando se intenta preparar un lote sobre el mismo universo
- Entonces el lote se bloquea con motivo de registración de capital en curso; un lote de otro universo no se bloquea (RF-FAC-017, RF-INS-044).

**CP-SRV-5109 — ESC-T12-CAP-05. Se reejecuta con la misma clave**

- Cubre: ESC-T12-CAP-05; RF-INS-038; T12 §7
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado JOB-INS-01 ejecutado sobre un lote
- Cuando se reejecuta con la misma clave
- Entonces no se duplican movimientos (RF-INS-038).

**CP-SRV-5110 — ESC-T12-CAP-06. (aislamiento) consulta `/ins/asociados/{asociado de TEN-001}/capital`**

- Cubre: ESC-T12-CAP-06; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un usuario de TEN-002 con `ins.capital.ver`
- Cuando consulta `/ins/asociados/{asociado de TEN-001}/capital`
- Entonces recibe 404 y REP-INS-05 de TEN-002 no incluye importes de TEN-001.

**CP-SRV-5111 — ESC-T12-CAP-07. (error) se registra un ajuste manual con fecha 30-10-2026**

- Cubre: ESC-T12-CAP-07; RF-INS-053; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha CAP (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un cierre de capital al 31-10-2026
- Cuando se registra un ajuste manual con fecha 30-10-2026
- Entonces se rechaza con `ins.capital.closed` (RF-INS-053).

**CP-SRV-5112 — ESC-T12-OTR-01. Se presta a un asociado con depósito ARS 20.000 y plazo 30 días, y se devuelve a los 20 días**

- Cubre: ESC-T12-OTR-01; relacionados: CU-SOC-15; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OTR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado ORT-DEMO-01 disponible
- Cuando se presta a un asociado con depósito ARS 20.000 y plazo 30 días, y se devuelve a los 20 días
- Entonces el elemento pasa a limpieza o mantenimiento y no se presta hasta liberarlo (CU-SOC-15).

**CP-SRV-5113 — ESC-T12-OTR-02. Corre JOB-SOC-10**

- Cubre: ESC-T12-OTR-02; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OTR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un préstamo con plazo vencido ayer
- Cuando corre JOB-SOC-10
- Entonces queda `overdue` y se genera el aviso; repetir el job no duplica el aviso.

**CP-SRV-5114 — ESC-T12-OTR-03. (error) se registra un retiro de 10 litros con `Idempotency-Key`**

- Cubre: ESC-T12-OTR-03; RF-SOC-114; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OTR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un límite diario de 20 litros y 15 litros ya retirados hoy
- Cuando se registra un retiro de 10 litros con `Idempotency-Key`
- Entonces se rechaza con 422 RFC 9457 y reenviar la misma clave devuelve el mismo rechazo (RF-SOC-114).

**CP-SRV-5115 — ESC-T12-OTR-04. (error) se intenta crear un contrato**

- Cubre: ESC-T12-OTR-04; RN-SOC-052; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración y precarga de la ficha OTR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un servicio "Seguro de vida" en estado candidato
- Cuando se intenta crear un contrato
- Entonces M02 lo rechaza (RN-SOC-052).

**CP-SRV-5116 — ESC-T12-OTR-05. (aislamiento) pide el préstamo de ORT-DEMO-01 de TEN-001**

- Cubre: ESC-T12-OTR-05; T12 §7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración y precarga de la ficha OTR (T12, sección 2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado un operador de TEN-002 con `soc.ortopedia.gestionar`
- Cuando pide el préstamo de ORT-DEMO-01 de TEN-001
- Entonces recibe 404.
