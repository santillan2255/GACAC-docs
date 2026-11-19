# Casos de prueba de aceptación — M18 SOC — Servicios sociales, otros servicios y flota

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M18-SOC-servicios-sociales-flota.md`](../../especificacion/anexos/M18-SOC-servicios-sociales-flota.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 149 CP de requisitos funcionales, 25 CP de escenarios ESC y 18 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M18 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Planes de cobertura y prestadores (M18 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0001 | RF-SOC-001; M18 §5.1; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Definir **planes de cobertura** por servicio social: prestaciones incluidas, vínculos admitidos, edades mínima y máxima por vínculo, ocupación, discapacidad, cantidad máxima de adherentes, carencias, alcance territorial, exclusiones y… | Un plan con edad máxima 21 para hijos rechaza el alta de un hijo de 25 con motivo "edad fuera de rango". |
| CP-SOC-0002 | RF-SOC-002; M18 §5.1; PRO-O10-04 | O10 | Núcleo | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Distinguir **tipos de servicio social** con reglas propias: sepelio, subsidio por fallecimiento, cementerio parque, banco de sangre, ambulancia/traslados, salud por convenio, banco ortopédico, seguro, plan de vivienda, dispenser, vehículo… | Cementerio parque no se configura como plan de cobertura familiar (BASE §24). |
| CP-SOC-0003 | RF-SOC-003; M18 §5.1; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | Registrar **prestadores** (empresa fúnebre, red de sangre, nosocomio, empresa de ambulancias, constructor) vinculados al proveedor de M12 cuando se les paga. | Un prestador con convenio vencido no aparece como opción en solicitudes nuevas. |
| CP-SOC-0004 | RF-SOC-004; M18 §5.1; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | Registrar **convenios** con prestadores: ámbito, vigencia, condiciones, modalidad de financiamiento (cooperativa, aporte del asociado, gratuito), costo y rendición. | La cobertura a una fecha usa el convenio vigente a esa fecha. |
| CP-SOC-0005 | RF-SOC-005; M18 §5.1; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Carencias** configurables por plan y por adherente (desde su alta), con excepciones autorizadas. | Una solicitud de sepelio dentro de la carencia se rechaza o deriva a excepción. |
| CP-SOC-0006 | RF-SOC-006; M18 §5.1; PRO-O10-04 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Requisitos documentales** por plan y vínculo (partida, constancia de convivencia, certificado de discapacidad) con vencimiento. | Un adherente con requisito vencido queda observado y se alerta al operador. |
| CP-SOC-0007 | RF-SOC-007; M18 §5.1; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | Catálogo de **especialidades** y **profesionales** (médicos) vinculados a prestadores y viajes. | Un viaje puede registrar uno o varios profesionales acompañantes. |
| CP-SOC-0008 | RF-SOC-008; M18 §5.1; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | Catálogo de **nosocomios** y **localidades** de origen/destino (localidades de M01/T04). | Un viaje solo admite como origen o destino localidades del catálogo de M01/T04 y como nosocomio uno activo del catálogo; un nosocomio dado de baja no aparece en viajes nuevos y los viajes anteriores lo conservan. |
| CP-SOC-0009 | RF-SOC-009; M18 §5.1; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Diccionario** de términos por tenant (adherente, beneficiario, grupo familiar, parcela). | Cambiar `dict:soc.dependent` a "Familiar" se refleja en admin y PWA. |
| CP-SOC-0010 | RF-SOC-010; M18 §5.1; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Distinguir **servicio confirmado** por el tenant de servicio candidato; los candidatos no se habilitan sin ficha completa. | Un servicio candidato no puede tener contratos. |
### 1.2 Adherentes y beneficiarios (M18 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0011 | RF-SOC-011; M18 §5.2; PRO-O4-14 | O4 | Núcleo | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Alta de adherente** a un contrato de servicio: persona de M01, vínculo, fecha de alta, titular del grupo (sí/no), tarifa asignada si corresponde, validación de requisitos del plan. | El alta registra fecha efectiva y queda en la historia del grupo. |
| CP-SOC-0012 | RF-SOC-012; M18 §5.2; PRO-O4-14 | O4 | Estándar | regla | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Adherente titular**: exigir que el titular del contrato figure como adherente salvo configuración. | Con PRM-SOC-001 = false, un grupo sin adherente titular se rechaza. |
| CP-SOC-0013 | RF-SOC-013; M18 §5.2; PRO-O4-14 | O4 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Duplicados**: impedir que una persona sea adherente dos veces del mismo servicio salvo configuración; ofrecer dar de baja el vínculo anterior si ya está en otro titular. | Con PRM-SOC-003 = true, al cargar un adherente existente en otro grupo se pregunta si darlo de baja allí. |
| CP-SOC-0014 | RF-SOC-014; M18 §5.2; PRO-O4-14 | O4 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Baja de adherente** con fecha, causa (voluntaria, edad, fallecimiento, desconexión, condición, transferencia) y notificación imprimible; nunca borrado. | La baja conserva el registro con `endDate` y causa. |
| CP-SOC-0015 | RF-SOC-015; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Baja masiva por condición**: dar de baja adherentes que dejaron de cumplir edad, ocupación o vínculo a una fecha, con previsualización e impresión. | La previsualización lista cada adherente con la condición incumplida; nada se aplica sin confirmación. |
| CP-SOC-0016 | RF-SOC-016; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Cambio masivo de categoría** de adherentes (recategorización por edad u otra condición). | El cambio queda versionado y M04 usa la categoría vigente al período. |
| CP-SOC-0017 | RF-SOC-017; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Mayoría de edad**: detectar adherentes que cumplen la edad de corte, avisar por correo/T09 y proponer baja o cambio de categoría. | JOB-SOC-01 genera la lista diaria y envía el aviso a la casilla configurada. |
| CP-SOC-0018 | RF-SOC-018; M18 §5.2; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Exclusión de discapacidad**: los adherentes con discapacidad acreditada no se dan de baja por edad. | Un adherente con discapacidad de 30 años no aparece en la baja por edad. |
| CP-SOC-0019 | RF-SOC-019; M18 §5.2; PRO-O10-04 | O10 | Núcleo | regla | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Cascada por desconexión y reconexión** del contrato: baja o suspensión de adherentes y beneficiarios; al reconectar, consultar o restaurar. | Con PRM-SOC-005 = true, al reconectar se pide confirmar el alta de cada adherente previo. |
| CP-SOC-0020 | RF-SOC-020; M18 §5.2; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Cascada por fallecimiento**: al registrarse el fallecimiento de un adherente se da de baja con causa; si fallece el titular, se alerta para resolver continuidad del grupo y se impide la reconexión salvo configuración. | El titular fallecido genera una tarea; sus adherentes no se dan de baja automáticamente. |
| CP-SOC-0021 | RF-SOC-021; M18 §5.2; PRO-O10-04 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Filtrar en la ficha los adherentes **dados de baja por fallecimiento**. | Con PRM-SOC-007 = true, la ficha oculta por defecto esos adherentes con opción "mostrar". |
| CP-SOC-0022 | RF-SOC-022; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Transferencia de servicio**: tratamiento de adherentes y beneficiarios según configuración (dar de baja, mantener). | Con "dar de baja", los adherentes quedan con causa `transfer` en el contrato de origen. |
| CP-SOC-0023 | RF-SOC-023; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Control de deuda de adherentes**: advertir o bloquear altas cuando el titular tiene deuda vencida en el servicio. | Con PRM-SOC-008 activo, el alta muestra la deuda consultada a M08 y exige confirmación. |
| CP-SOC-0024 | RF-SOC-024; M18 §5.2; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Beneficiarios** por contrato: persona, vínculo, fecha de alta y baja, causa de cierre (propia de GoodApps), observaciones, estado, contrato social vinculado. M18 es el destino único de `BENSOC` (HUECO-SEP-02, DEC-086). | Un beneficiario dado de baja conserva su historia; un contrato cuyo servicio no admite beneficiarios en la ficha de M02 rechaza el alta. |
| CP-SOC-0025 | RF-SOC-025; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Ficha de adherentes** imprimible por contrato. | La ficha imprimible de un contrato lista los adherentes vigentes a la fecha de emisión con vínculo, fecha de alta y marca de titular del grupo, y coincide con la grilla de adherentes de la ficha en pantalla. |
| CP-SOC-0026 | RF-SOC-026; M18 §5.2; PRO-O4-14 | O4 | Núcleo | regla | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Datos de facturación** para M04: cantidad de adherentes vigentes en el período, por vínculo, ocupación, edad al último día del período, categoría y tarifa asignada; excedentes sobre los primeros N. | Para el período 10-2026, la cantidad informada coincide con los adherentes vigentes al 31-10-2026. |
| CP-SOC-0027 | RF-SOC-027; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Informe de adherentes** por servicio, plan, vínculo, edad y estado. | El informe filtrado por servicio, plan, vínculo, rango de edad y estado devuelve los mismos adherentes que la grilla con esos filtros, y el total informado es igual a la cantidad de filas listadas. |
| CP-SOC-0028 | RF-SOC-028; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Alerta de titular sin servicios** que sigue siendo adherente, beneficiario o garante. | M18 responde a M17/M01 si la persona es adherente o beneficiaria vigente. |
| CP-SOC-0029 | RF-SOC-029; M18 §5.2; PRO-O10-04 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Alta automática** de adherentes al conectar un servicio base (por ejemplo, sepelio al conectar energía) según la ficha de M02. | Al recibir `cat.contract.activated` de energía con regla de alta automática, se crea el contrato de sepelio y su adherente titular. |
| CP-SOC-0030 | RF-SOC-030; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Autogestión del grupo** en PWA: ver integrantes, solicitar altas y bajas con documentación (efectivas tras validación). | Una solicitud de alta desde la PWA queda pendiente hasta que el operador la valide. |
| CP-SOC-0149 | RF-SOC-149; M18 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Importar adherentes desde archivo** por contrato o en lote con `ExcelImportWizard` (persona por documento, vínculo, fecha de alta, titular del grupo), con vista previa de errores y las mismas validaciones del alta individual (RF-SOC-011… | Una fila con una persona ya adherente activa del mismo servicio se muestra como error en la vista previa y no se carga. |
### 1.3 Solicitudes de prestación y cobertura (M18 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0031 | RF-SOC-031; M18 §5.3; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Solicitud de prestación** única con tipo, beneficiario, fecha del evento, prestador, canal y documentación. | Toda prestación de sepelio, sangre, traslado, internación, ortopedia o subsidio nace de una solicitud. |
| CP-SOC-0032 | RF-SOC-032; RN-MOR-143, RN-SOC-022, RN-SOC-054; M18 §5.3; PRO-O10-04 | O10 | Núcleo | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Verificar cobertura a la fecha del evento**: contrato vigente, adherente vigente, carencia cumplida, prestación incluida, topes. Se agrega (HUECO-SEP-01): cobertura no suspendida por mora a la fecha del evento según la condición que M08… | Si el beneficiario no estaba incorporado a la fecha del evento, la solicitud pasa a revisión sin alterar la cobertura retroactivamente. Con PRM-SOC-052 = 30 y cobertura rehabilitada el 01-10-2026, una solicitud de sepelio por un evento del 15-10-2026 queda `inReview` con motivo "carencia de rehabilitación" (ESC-SOC-24). |
| CP-SOC-0033 | RF-SOC-033; M18 §5.3; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Autorizar o rechazar** con motivo; **derivar excepciones** a un responsable con plazo. | Un rechazo sin motivo no se puede guardar. |
| CP-SOC-0034 | RF-SOC-034; M18 §5.3; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | Registrar **costos y autorizaciones** del prestador (número de autorización, importe convenido, factura del prestador vinculada en M12). | El costo de la prestación se concilia con la factura del prestador. |
| CP-SOC-0035 | RF-SOC-035; M18 §5.3; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Consultar prestaciones utilizadas** por grupo, beneficiario, plan y período, contra topes. | Un tope anual de 2 traslados muestra 1 disponible tras el primero. |
| CP-SOC-0036 | RF-SOC-036; M18 §5.3; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | La **deuda** del titular no rechaza automáticamente una prestación urgente; solo genera advertencia y la decisión la toma un responsable. | Una solicitud de sangre con deuda queda "en gestión" con advertencia, no rechazada. |
| CP-SOC-0037 | RF-SOC-037; M18 §5.3; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Documentación sensible** con permisos específicos; nunca visible en muro, BI general ni bot. | Un rol sin `soc.datosSensibles.ver` ve "documento restringido". |
| CP-SOC-0038 | RF-SOC-038; M18 §5.3; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Solicitud desde la PWA** del asociado con seguimiento de estado. | El asociado ve el estado y la respuesta sin datos clínicos. |
### 1.4 Sepelio y subsidio por fallecimiento (M18 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0039 | RF-SOC-039; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Caso de sepelio**: fallecido (persona M01), solicitante, contrato y plan, prestador, servicios brindados (velatorio, traslado, inhumación/cremación), lugar, fecha, documentación (certificado de defunción). | El caso registra el fallecimiento en M01 si aún no existe. |
| CP-SOC-0040 | RF-SOC-040; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Verificar **cobertura territorial y exclusiones** del plan de sepelio. | Un fallecimiento fuera del alcance territorial se deriva a excepción. |
| CP-SOC-0041 | RF-SOC-041; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Coordinación del evento** con el prestador: estado, horarios, traslado vinculado (`transportTrips`) y cierre. | El caso cerrado tiene la conformidad del prestador. |
| CP-SOC-0042 | RF-SOC-042; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Costo** del sepelio: cubierto por el plan, adicional a cargo del solicitante (facturable vía M05) y factura del prestador (M12). | Un adicional genera una solicitud de facturación con concepto del catálogo. |
| CP-SOC-0043 | RF-SOC-043; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | Vincular el caso con **cementerio parque** si la inhumación es en el cementerio de la cooperativa (crea un acto de inhumación). | La inhumación se agenda en el cementerio con el derecho del titular. |
| CP-SOC-0044 | RF-SOC-044; M18 §5.4; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Subsidio por fallecimiento**: reglamento y fondo, requisitos, beneficiarios con porcentaje, expediente, aprobación y pago (M14). | Sin aprobación no se emite la orden de pago. |
| CP-SOC-0045 | RF-SOC-045; M18 §5.4; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Importe** del subsidio por reglamento versionado (fijo o según plan) a la fecha del fallecimiento. | El importe usa la versión vigente a la fecha del fallecimiento. |
| CP-SOC-0046 | RF-SOC-046; M18 §5.4; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Plazo de reclamo** y prescripción configurables. | Una solicitud fuera de plazo se deriva a excepción. |
| CP-SOC-0047 | RF-SOC-047; M18 §5.4; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | Distinguir **sepelio, subsidio y cementerio**: un asociado puede tener alguno y no los otros. | Un asociado con cementerio y sin sepelio no obtiene cobertura de sepelio. |
| CP-SOC-0048 | RF-SOC-048; M18 §5.4; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Seguros por cuenta de terceros** (sepelio o vida) como cobertura con aseguradora prestadora y número de póliza, sin cálculo actuarial. | Una cobertura de seguro sin aseguradora prestadora o sin número de póliza no se puede guardar; el sistema no calcula primas ni reservas actuariales. |
### 1.5 Cementerio parque (M18 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0049 | RF-SOC-049; M18 §5.5; PRO-O10-05 | O10 | Núcleo | regla | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Establecimiento**: nombre, habilitación, modalidad jurídica (CCyC arts. 2103 a 2113 u otra concesión), autoridad de policía mortuoria, reglamento versionado. | Un derecho nuevo referencia la versión de reglamento vigente. |
| CP-SOC-0050 | RF-SOC-050; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Catálogo físico** jerárquico de sectores, manzanas, filas y unidades (parcela, nicho, urnario, otras) con capacidad por niveles. | Cada unidad tiene código único en el establecimiento. |
| CP-SOC-0051 | RF-SOC-051; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Estados separados** de disponibilidad, reserva, derecho adjudicado y ocupación; impedir reserva o venta duplicada. | Dos reservas simultáneas de la misma unidad: la segunda se rechaza. |
| CP-SOC-0052 | RF-SOC-052; M18 §5.5; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Reserva** con vencimiento y liberación automática si no se formaliza. | Una reserva vencida libera la unidad y deja evento. |
| CP-SOC-0053 | RF-SOC-053; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Derecho de sepultura**: titular identificado, cotitulares, modalidad (perpetuo, temporario, uso), instrumento y documentación, fecha, vigencia, responsables y autorizados. | Sin instrumento adjunto el derecho queda `pendingDocumentation`. |
| CP-SOC-0054 | RF-SOC-054; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | Separar **contratante, titular, pagador, fallecido y autorizados** para actuar. | Cambiar el pagador no cambia titular ni ocupación (criterio de aceptación 93). |
| CP-SOC-0055 | RF-SOC-055; RN-SOC-056; M18 §5.5; PRO-O10-05 | O10 | Núcleo | regla | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Obligaciones económicas** por derecho: adquisición (contado o financiada), mantenimiento periódico y actos, cada una con tratamiento propio en M04/M05; M18 informa la clase de ítem `burialRightAcquisition` o `burialRightMaintenance`… | La baja del abono de mantenimiento no elimina la ocupación. |
| CP-SOC-0056 | RF-SOC-056; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Actos**: inhumación, exhumación, reducción, traslado (interno o externo), con permiso municipal, identificación, fecha, origen y destino, responsables, autorizante y documentación. | Un acto sin autorización del titular o autorizado válido no se puede registrar como realizado. |
| CP-SOC-0057 | RF-SOC-057; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Turnos** de actos con agenda del establecimiento y control documental previo; la solicitud del portal no ejecuta el acto. | Una solicitud web queda `requested` hasta validación documental. |
| CP-SOC-0058 | RF-SOC-058; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Registro permanente** de ocupaciones e inhumaciones; nunca se borra ni se libera una unidad ocupada por falta de pago. | No existe acción "liberar por mora". |
| CP-SOC-0059 | RF-SOC-059; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Cesión, transferencia, sucesión y extinción** de derechos con trámite, revisión jurídica y respaldo. | Una cesión sin aprobación del responsable jurídico no cambia el titular. |
| CP-SOC-0060 | RF-SOC-060; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Cuenta por derecho/acto** visible en el resumen del asociado. | El resumen del asociado muestra, por cada derecho de sepultura, las obligaciones de adquisición, mantenimiento y actos con su saldo, y ese saldo coincide con la cuenta corriente de M07. |
| CP-SOC-0061 | RF-SOC-061; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Mantenimiento** del parque (tareas, proveedores, materiales) sin tratar restos como stock. | Las tareas se registran como órdenes internas vinculadas a sectores. |
| CP-SOC-0062 | RF-SOC-062; M18 §5.5; PRO-O10-05 | O10 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Mora de cementerio**: no corta otros servicios ni dispone del derecho; habilita gestión de cobranza y, eventualmente, trámite jurídico. | Una deuda de mantenimiento no genera orden de corte de electricidad. |
| CP-SOC-0063 | RF-SOC-063; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Plano/mapa** del parque con estado por unidad y búsqueda de difuntos para atención al público (solo nombre y ubicación, si el tenant lo habilita). | La búsqueda pública no muestra titulares ni deudas. |
| CP-SOC-0064 | RF-SOC-064; M18 §5.5; PRO-O10-05 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Libros/registros** de inhumaciones y de titulares exportables. | El registro de inhumaciones a una fecha lista todos los actos realizados en orden. |
### 1.6 Banco de sangre por convenio (M18 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0065 | RF-SOC-065; M18 §5.6; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Convenio** con red o banco habilitado: ámbito, vigencia, condiciones de atención, modalidad (financiado por la cooperativa, aporte del socio, gratuito). El banco de sangre es solo administrativo por convenio, sin datos clínicos (DEC-024). | Un convenio sin vigencia o sin modalidad de financiamiento no se puede activar, y ni el convenio ni sus solicitudes tienen campos clínicos (DEC-024). |
| CP-SOC-0066 | RF-SOC-066; M18 §5.6; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Adhesión y cobertura** del titular, grupo y beneficiarios a la fecha solicitada. | La consulta de cobertura de BEN-DEMO-001 a una fecha devuelve vigente/no vigente con motivo. |
| CP-SOC-0067 | RF-SOC-067; M18 §5.6; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Sin precio por unidad de sangre**: no existe concepto facturable por sangre o transfusión al paciente. | El catálogo de M02 rechaza un concepto de tipo "unidad de sangre" vinculado a M18. |
| CP-SOC-0068 | RF-SOC-068; M18 §5.6; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Solicitud administrativa** de cobertura canalizada al prestador: referencia, estado, respuesta y seguimiento. | SAN-DEM-001 pasa por `requested` → `inProgressWithProvider` → `answered`. |
| CP-SOC-0069 | RF-SOC-069; M18 §5.6; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Datos mínimos**: contactos y documentación estrictamente necesaria, con acceso restringido; sin diagnóstico, grupo sanguíneo ni indicaciones (DEC-024). | El formulario no tiene campos clínicos. |
| CP-SOC-0070 | RF-SOC-070; M18 §5.6; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Campañas y turnos de donación** como coordinación administrativa, sin decidir aptitud; edades de donante como filtro informativo. | El turno no registra resultado de aptitud. |
| CP-SOC-0071 | RF-SOC-071; M18 §5.6; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Costo del convenio** y obligaciones con la red registrados como gasto (M12/M15), separados de cualquier cobro al socio. | El costo de un convenio de sangre se registra como gasto del proveedor en M12 y M15 y no genera ningún cargo en la cuenta del socio. |
| CP-SOC-0072 | RF-SOC-072; M18 §5.6; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Indicadores**: solicitudes, tiempos de gestión, costos y cobertura, sin datos clínicos. | El tablero muestra por período cantidad de solicitudes, tiempo medio de gestión, costo y porcentaje con cobertura, y ninguna columna ni filtro expone datos clínicos. |
| CP-SOC-0073 | RF-SOC-073; M18 §5.6; PRO-O10-06 | O10 | Núcleo | regla | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | El **bot** y las reglas de deuda no resuelven solicitudes de sangre (AGR-030). | El bot solo informa cómo iniciar la solicitud y deriva a un operador. |
| CP-SOC-0146 | RF-SOC-146; RN-MOR-144, RN-SOC-055; M18 §5.6; PRO-O10-04 | O10 | Núcleo | regla | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Aporte del socio impago** (convenio con `fundingMode = memberContribution`): la tarea de revisión que crea M08 (RN-MOR-144, T11 tipo `review`) llega a la bandeja del **Responsable de servicios sociales** con la cuenta, el convenio, la… | Un aporte impago con la antigüedad de PRM-MOR-205 genera una sola tarea por contrato y período y la consulta de cobertura de ese socio sigue devolviendo "vigente" (ESC-SOC-25). |
### 1.7 Salud: ambulancias, traslados sanitarios, profesionales e internaciones (M18 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0074 | RF-SOC-074; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Viaje de ambulancia / traslado sanitario**: persona trasladada (asociado, beneficiario o no asociado), fecha del traslado y de la solicitud, origen, destino, nosocomio, empresa, móvil, chofer, profesionales, característica, kilómetros… | Un viaje de un no asociado se factura según lista de no asociados. |
| CP-SOC-0075 | RF-SOC-075; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Viajes de varios tramos** vinculados a un viaje original. | El informe de un viaje multitramo suma kilómetros e importes de todos los tramos. |
| CP-SOC-0076 | RF-SOC-076; M18 §5.7; PRO-O10-06 | O10 | Estándar | regla | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Características** de viaje configurables (programado, alta, derivación, diálisis) y su efecto en tarifa. | Una característica nueva con modificador de tarifa queda disponible en viajes nuevos y el importe del viaje aplica ese modificador; desactivarla no altera los viajes ya registrados. |
| CP-SOC-0147 | RF-SOC-147; M18 §5.7; PRO-O10-06 | O10 | Estándar | regla | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Traslado no médico** de personas (M02 §6.C.17): se registra como viaje de RF-SOC-074 con la característica precargada "no sanitario" (RF-SOC-076, `tripCharacteristics.code = NON_MEDICAL`), con origen, destino, persona trasladada, móvil y… | Un viaje con característica "no sanitario" que intenta cargar un profesional acompañante se rechaza, y lo ve un operador sin `soc.datosSensibles.ver`. |
| CP-SOC-0077 | RF-SOC-077; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Profesionales acompañantes** por viaje. | Un viaje admite cero, uno o varios profesionales activos del catálogo (RF-SOC-007); un profesional inactivo no se puede agregar. |
| CP-SOC-0078 | RF-SOC-078; M18 §5.7; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Motivo del traslado** como categoría administrativa (no diagnóstico), con texto libre restringido. | El texto libre solo lo ve `soc.datosSensibles.ver`. |
| CP-SOC-0079 | RF-SOC-079; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Informe general de traslados** con filtros: socio/no socio, persona, documento, sexo, localidades, nosocomio, empresa, chofer, profesional, móvil, característica, edad a la fecha del viaje, kilómetros. | El subtítulo del informe lista los filtros aplicados. |
| CP-SOC-0080 | RF-SOC-080; M18 §5.7; PRO-O10-06 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Facturación del traslado**: cubierto por plan o facturable (km × tarifa o importe fijo) vía M04/M05. | Un viaje de 120 km con tarifa ARS 900/km genera ARS 108.000 a facturar si no está cubierto. |
| CP-SOC-0081 | RF-SOC-081; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Autorización administrativa de internación o práctica** por convenio: prestador, fechas, número de autorización, cobertura y costo; sin datos clínicos. | Una autorización sin prestador, número de autorización o fecha de ingreso no se puede guardar, y el formulario no tiene campos de diagnóstico ni de indicaciones. |
| CP-SOC-0082 | RF-SOC-082; M18 §5.7; PRO-O10-06 | O10 | Núcleo | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **No despachar emergencias**: el sistema registra traslados programados o derivados y deriva emergencias al prestador habilitado. | Una solicitud marcada "emergencia" muestra el número del prestador y no se agenda. |
| CP-SOC-0083 | RF-SOC-083; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Viaje desde fallecimiento**: el trámite de fallecimiento puede crear un traslado vinculado. | Desde el trámite de fallecimiento se crea un traslado con la persona fallecida precargada y vinculado al caso; el traslado aparece en el caso de sepelio y en la agenda de traslados. |
| CP-SOC-0084 | RF-SOC-084; M18 §5.7; PRO-O10-06 | O10 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Agenda de traslados programados** con asignación de móvil y chofer y conflicto de disponibilidad. | Un móvil asignado a dos viajes superpuestos genera advertencia. |
### 1.8 Planes de vivienda (M18 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0085 | RF-SOC-085; RN-SOC-041; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Plan de vivienda** y **tipologías**: descripción, producto asociado, aportes mínimos antes/después de adjudicar y en entrega, máximo de aporte anual, fecha de nuevo valor, fecha de aporte teórico, uso de fecha de entrega. | Habilitar un plan sin producto asociado o con la configuración de RN-SOC-041 incompleta se rechaza indicando el dato faltante; los porcentajes mínimos y el máximo anual quedan guardados por tipología. |
| CP-SOC-0086 | RF-SOC-086; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Precios por tipología** con vigencia; el precio vigente es el último con fecha ≤ fecha de cálculo. | Con precios del 01-03 y 01-09, una cuota de julio usa el de marzo. |
| CP-SOC-0087 | RF-SOC-087; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Actualización masiva de precios** por plan/etapa con aprobación. | Sin aprobación el nuevo precio queda `draft`. |
| CP-SOC-0088 | RF-SOC-088; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Inscripción** al plan (contrato tipo plan de vivienda en M02; HUECO-TRV-06, antes "en M01") con fecha, tipología y lote/terreno propio. | Inscribir una cuenta crea un contrato de tipo plan de vivienda en M02 con fecha de inscripción, tipología y lote o terreno propio; una inscripción sin tipología se rechaza. |
| CP-SOC-0089 | RF-SOC-089; M18 §5.8; PRO-O10-07 | O10 | Núcleo | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | Una cuenta **no puede tener dos planes** de vivienda. | La segunda inscripción en la misma cuenta se rechaza. |
| CP-SOC-0090 | RF-SOC-090; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). | **Adjudicación** con fecha, forma (sorteo, licitación, antigüedad, otra) y validación de fecha. | La fecha de adjudicación no puede ser anterior a la inscripción. |
| CP-SOC-0091 | RF-SOC-091; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Aporte por cuota**: % = mínimo después de adjudicar si está adjudicada, si no mínimo antes; fallback a parámetros generales; tope = % a facturar − % facturado; importe = % × precio vigente. M18 informa los datos y M04 calcula. | Con precio ARS 40.000.000 y aporte 1 %, la cuota es ARS 400.000; nunca supera el 100 % acumulado. |
| CP-SOC-0092 | RF-SOC-092; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Aportes superiores al máximo** solo con configuración. | Con PRM-SOC-024 = false, un adelanto que supera el máximo anual se rechaza. |
| CP-SOC-0093 | RF-SOC-093; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Facturación eventual** de aportes con mínimo y concepto configurables. | Con la facturación eventual habilitada, un aporte eventual menor al mínimo configurado se rechaza y uno válido genera una entrada a facturar con el concepto configurado. |
| CP-SOC-0094 | RF-SOC-094; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Comprobante exclusivo** para cuotas de vivienda: no se mezcla con otros productos. | Un comprobante de vivienda con un producto ajeno se rechaza. |
| CP-SOC-0095 | RF-SOC-095; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Cobranza** de cuotas de vivienda con permiso específico. | Un cajero sin `soc.vivienda.gestionarCobranza` no ve la opción. (antes `soc.vivienda.cobranza`) |
| CP-SOC-0096 | RF-SOC-096; M18 §5.8; PRO-O10-07 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Anulación** de una cuota descuenta el % facturado. | Tras anular la cuota de 1 %, el % facturado vuelve al valor previo. |
| CP-SOC-0097 | RF-SOC-097; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Etapas y actividades** de construcción con orden, horas y precio hora; reordenamiento; costo de actividad. | Reordenar las actividades de una etapa deja un orden correlativo sin repetidos, y el costo de cada actividad es igual a horas por precio hora. |
| CP-SOC-0098 | RF-SOC-098; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Composición de materiales** por actividad (tipología) y reparto en la vivienda. | Al asignar una tipología a una vivienda, los materiales de cada actividad se reparten según la composición de la tipología y el total por material es igual a la suma de las actividades. |
| CP-SOC-0099 | RF-SOC-099; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Progreso** de actividades por vivienda: período, horas, porcentaje, proveedor, materiales consumidos, factura del proveedor y certificado. | El porcentaje acumulado de una actividad no supera 100. |
| CP-SOC-0100 | RF-SOC-100; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Materiales asignados, reservados, liberados y utilizados** por vivienda contra stock (M13). | Liberar material devuelve la reserva en M13. |
| CP-SOC-0101 | RF-SOC-101; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Retiro de materiales** con vale (comprobante configurable), etapa, depósito y responsable; devolución y reasignación entre viviendas. | El vale genera un movimiento de stock M13 con operación "vivienda" y costo imputado a la obra por defecto. |
| CP-SOC-0102 | RF-SOC-102; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Rubro de proveedor y de productos** de vivienda: facturas de proveedores del rubro vivienda exigen productos del rubro de construcción. | M12 rechaza una factura de proveedor de vivienda con productos de otro rubro. |
| CP-SOC-0103 | RF-SOC-103; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Certificados de obra**: crear, guardar, liquidar, cancelar, eliminar (solo borrador), imprimir; certificado de mano de obra; liquidación al constructor con concepto configurable. | Un certificado liquidado genera la obligación al proveedor en M12/M14. |
| CP-SOC-0104 | RF-SOC-104; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Resumen y estado de construcción**: progreso esperado vs real, desviación, materiales utilizados. | El resumen de construcción muestra por actividad el porcentaje esperado a la fecha, el real (RF-SOC-099) y la desviación entre ambos, y los materiales utilizados coinciden con los retiros registrados (RF-SOC-101). |
| CP-SOC-0105 | RF-SOC-105; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Entrega** de la vivienda con comprobante configurable, fechas de inicio y fin de construcción y entrega parcial. | Registrar la entrega emite el comprobante configurado y guarda las fechas de inicio y fin de construcción; una entrega parcial deja la vivienda en `partiallyDelivered` hasta registrar la entrega final. |
| CP-SOC-0106 | RF-SOC-106; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Cambio de plan/tipología** con texto de plantilla, informe y recálculo de aportes. | El informe muestra aporte facturado, aporte en la nueva tipología y diferencia. |
| CP-SOC-0107 | RF-SOC-107; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Transferencia** de la vivienda, de sus cuotas y de la construcción a otra cuenta, con texto de plantilla y caja abierta si se transfieren cuotas. | Transferir cuotas sin caja abierta se rechaza. |
| CP-SOC-0108 | RF-SOC-108; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Rescisión / baja del plan** solo de planes conectados: comisión (% y concepto), concepto por diferencia, texto de plantilla, comprobante, opción de rescisión. | Con aportes de ARS 4.000.000 y comisión 10 %, la rescisión calcula ARS 400.000 de comisión y el saldo a devolver o compensar. |
| CP-SOC-0109 | RF-SOC-109; RN-SOC-047; M18 §5.8; PRO-O10-07 | O10 | Núcleo | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | Los planes de vivienda **no se reconectan** como un servicio de red. | La acción de reconexión no se ofrece para un contrato de plan de vivienda y la API la rechaza con error de regla (RN-SOC-047). |
| CP-SOC-0110 | RF-SOC-110; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Informes de vivienda**: aporte teórico, estado de aportes, estado del plan (completo y simple), composición de tipología, desviación, materiales, distritos, cambio de plan. | Cada informe de vivienda se genera con filtros de plan, tipología y distrito, y el aporte teórico de un plan coincide con el cálculo de RF-SOC-091 para las mismas fechas. |
| CP-SOC-0111 | RF-SOC-111; M18 §5.8; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2… | **Mora del plan** configurable (meses adeudados para fondo fiduciario). | Con PRM-SOC-030 = 3 en el plan, una vivienda con 3 cuotas adeudadas queda marcada para el fondo fiduciario y una con 2 no; sin valor en el parámetro no se marca ninguna (PA-SOC-08). |
| CP-SOC-0112 | RF-SOC-112; M18 §5.8; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Datos del plan** visibles en ficha y PWA: tipología, % aportado, cuotas, estado de construcción. | La ficha y la PWA muestran tipología, porcentaje aportado, cuotas facturadas y estado de construcción, y el porcentaje aportado coincide con el aporte facturado del plan. |
### 1.9 Otros servicios (M18 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0113 | RF-SOC-113; RN-CON-123, RN-SOC-056; M18 §5.9; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Banco ortopédico**: elementos identificados (código, tipo, estado), préstamo con plazo, devolución, limpieza/mantenimiento, garantía o depósito; no es venta. El depósito se registra como garantía de M08 (`guarantees`, RF-MOR-179): M18… | Un elemento en mantenimiento no se presta; la devolución del elemento en buen estado dispara la devolución del depósito por M08 sin asiento de ingreso. |
| CP-SOC-0114 | RF-SOC-114; M18 §5.9; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Dispenser de agua**: servicio configurable, límite diario de litros, litros por atención, días para cálculo de deuda, registro de retiros y excedente mensual. | Un retiro que supera el límite diario se rechaza. |
| CP-SOC-0115 | RF-SOC-115; M18 §5.9; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Registración de vehículo eléctrico** como tipo de registración de un contrato (dato del vehículo vinculado a la carga), guardada en `contractRegistrations` de M18 con `type = electricVehicle` (RF-SOC-148; HUECO-OTR-05). | Una registración de tipo `electricVehicle` sin dominio no se puede guardar y, una vez guardada, queda en `contractRegistrations` vinculada al contrato (criterio de RF-SOC-148). |
| CP-SOC-0116 | RF-SOC-116; M18 §5.9; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Reemplazado por RF-SOC-148** (HUECO-OTR-05). Texto original: "**Dispositivos y adherentes** (tipo de registración combinado) soportado por adherentes + dispositivos de M01." | No aplica: requisito reemplazado; se verifica con el criterio de RF-SOC-148. |
| CP-SOC-0148 | RF-SOC-148; M18 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Registraciones del contrato**: M18 es dueño de la entidad `contractRegistrations` (§7.5), que registra sobre un contrato de M02 los objetos que el servicio necesita identificar: vehículo eléctrico (dominio, marca, modelo, potencia de… | Un contrato cuyo servicio solo admite `electricVehicle` rechaza una registración de tipo `device`; dar de baja una registración conserva su historia con `endDate`. |
| CP-SOC-0117 | RF-SOC-117; M18 §5.9; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Extensibilidad**: nuevos servicios sociales se configuran como tipo + plan + formulario de solicitud sin desarrollo cuando encajan en el modelo de solicitud de prestación. | Un servicio social nuevo configurado como tipo, plan y formulario de solicitud admite solicitudes y verificación de cobertura sin cambios de código. |
### 1.10 Flota, combustibles, viajes, rendiciones y GPS (M18 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0118 | RF-SOC-118; M18 §5.10; PRO-O8-14 | O8 | Estándar | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Vehículos**: descripción, dominio, tipo, propio/contratado, proveedor, kilometraje inicial, rendimiento, capacidad de carga, costo por km, precio de viajes cortos, identificador AVL, bien de uso vinculado (M13). | Un dominio no se repite en el tenant. |
| CP-SOC-0119 | RF-SOC-119; M18 §5.10; PRO-O8-14 | O8 | Estándar | regla | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Choferes** vinculados a empleado (M16) o externo, con licencia y vencimiento. | Un chofer con licencia vencida no puede asignarse. |
| CP-SOC-0120 | RF-SOC-120; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Otros: 2 sillas de ruedas y 1 andador en el banco ortopédico, 1 préstamo vigente. | **Asignación de conductor** a vehículo con vigencia. | Un viaje del vehículo propone el conductor con asignación vigente a la fecha del viaje; una asignación vencida no se propone. |
| CP-SOC-0121 | RF-SOC-121; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Documentación y vencimientos** del vehículo (seguro, VTV/ITV, habilitación sanitaria de ambulancia, patente) con alertas. | Un vehículo con seguro vencido queda "no apto" y no se asigna. |
| CP-SOC-0122 | RF-SOC-122; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Mantenimiento** preventivo (por km o tiempo) y correctivo, con proveedor, costo y orden de compra (M12). | Al superar el km de service se genera alerta. |
| CP-SOC-0123 | RF-SOC-123; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Uso por orden de trabajo** (M10) y por viaje, con kilómetros y horas; costo imputable a la OT o al centro de costos. | El costo de uso = km × costo/km del vehículo se publica a M15 con la OT. |
| CP-SOC-0124 | RF-SOC-124; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Combustibles**: catálogo con alícuota de IVA y su ajuste. | Cambiar la alícuota de IVA de un combustible aplica a las cargas posteriores al cambio y no modifica las cargas ya registradas. |
| CP-SOC-0125 | RF-SOC-125; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Cargas de combustible** por móvil con litros, kilómetros y factura de compra de origen; carga manual y desde factura; anulación de la factura libera las cargas. | Anular la factura en M12 anula las cargas vinculadas. |
| CP-SOC-0126 | RF-SOC-126; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Rendimiento real** (km/l) vs teórico por vehículo y alerta de desvío. | Con 500 km y 60 l, el rendimiento es 8,33 km/l. |
| CP-SOC-0127 | RF-SOC-127; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | **Viajes** generales (no sanitarios): solicitud, origen/destino, agenda, recursos, constancia. | Un viaje general sin origen, destino o fecha no se agenda, y al completarlo se emite la constancia con los recursos asignados. |
| CP-SOC-0128 | RF-SOC-128; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Rendición de viaje**: fecha, kilómetros reales, flete real, tipo de flete, peajes, viáticos, ítems de combustible (puesto, comprobante, litros, precio por litro, cargado en viaje). Una sola rendición por viaje en `tripSettlements`; la… | El total de la rendición = flete + peajes + viáticos + Σ litros × precio. |
| CP-SOC-0129 | RF-SOC-129; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Cálculo de kilómetros** estimados de la rendición y comparación con kilómetros reales y GPS. | Un desvío mayor al umbral marca la rendición para revisión. |
| CP-SOC-0130 | RF-SOC-130; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Estados de la rendición** con aprobación. | Una rendición sigue `draft` → `submitted` → `approved` → `posted` o `submitted` → `rejected` → `draft` (§8); quien la cargó no puede aprobarla y una rendición aprobada no se edita. |
| CP-SOC-0131 | RF-SOC-131; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | Vincular la rendición a la **venta con flete** (M11), al viaje o a la OT. | Una rendición queda vinculada a un único origen (`source.kind`: venta con flete de M11, viaje u orden de trabajo) y desde ese origen se puede abrir la rendición. |
| CP-SOC-0132 | RF-SOC-132; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Dispositivos GPS/AVL** por vehículo con proveedor y adaptador. | Un vehículo tiene a lo sumo un dispositivo GPS activo, y las posiciones de una unidad externa sin vehículo asociado se rechazan y quedan registradas como error de ingestión. |
| CP-SOC-0133 | RF-SOC-133; M18 §5.10; PRO-O10-08 | O10 | Estándar | regla | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Posiciones GPS**: unidad, fecha y hora, estado, evento, latitud, longitud; ingestión por lote o streaming; retención configurable. | Posiciones duplicadas (misma unidad y hora) se descartan. |
| CP-SOC-0134 | RF-SOC-134; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Recorridos y kilometraje** derivados de GPS por día, viaje y OT. | El kilometraje diario derivado de GPS de un vehículo es la suma de las distancias entre posiciones consecutivas del día, y el de un viaje u orden de trabajo usa solo las posiciones dentro de su franja horaria. |
| CP-SOC-0135 | RF-SOC-135; M18 §5.10; PRO-O10-08 | O10 | Núcleo | funcional | TEN-001 con Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en… | La ubicación del móvil **no se muestra en vivo** al asociado ni reemplaza el estado "En camino" de M10. | La PWA del socio no tiene mapa de móviles. |
| CP-SOC-0136 | RF-SOC-136; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Novedades para sueldos** desde flota (horas de chofer, viáticos, guardias). | Una rendición aprobada con viáticos genera novedad para M16. |
| CP-SOC-0137 | RF-SOC-137; M18 §5.10; PRO-O10-08 | O10 | Estándar | integración | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **PWA de campo** del chofer: viajes asignados, registro de km inicial/final, carga de combustible con foto del ticket, checklist del vehículo. | Funciona sin conexión y sincroniza. |
| CP-SOC-0138 | RF-SOC-138; M18 §5.10; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de… | **Costos de flota** por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). | El costo de flota de un vehículo en un período es igual a combustible más mantenimiento más seguros más la amortización informada por M13, y cada componente se puede abrir hasta sus comprobantes. |
### 1.11 Transversales (M18 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-SOC-0139 | RF-SOC-139; M18 §5.11; PRO-O10-08 | O10 | Núcleo | funcional | TEN-001 con Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147)… | **Privacidad**: inventario de datos sensibles (salud, fallecimiento, ubicación), finalidad, conservación y acceso mínimo; exportaciones con permiso. | Una exportación de traslados excluye el motivo salvo permiso. |
| CP-SOC-0140 | RF-SOC-140; M18 §5.11; PRO-O4-14 | O4 | Núcleo | funcional | TEN-001 con Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de… | **Auditoría** de altas, bajas, solicitudes, decisiones, actos de cementerio, certificados y rendiciones. | Cada alta, baja, decisión de solicitud, acto de cementerio, certificado y rendición deja un registro de auditoría con usuario, fecha y valores anteriores y nuevos, consultable en T02. |
| CP-SOC-0141 | RF-SOC-141; M18 §5.11; PRO-O4-14 | O4 | Núcleo | seguridad | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Aislamiento por tenant**. | Un usuario del tenant A que consulta el identificador de un adherente del tenant B recibe 404 y la respuesta no revela si el registro existe. |
| CP-SOC-0142 | RF-SOC-142; M18 §5.11; PRO-O4-14 | O4 | Núcleo | funcional | TEN-001 con Otros: 2 sillas de ruedas y 1 andador en el banco ortopédico, 1 préstamo vigente. | **Historia sin borrado** de grupos, ocupaciones y solicitudes (vigencias, AGR-003). | No existe operación de borrado físico de grupos, ocupaciones ni solicitudes; una baja deja el registro con fecha de fin y la consulta a una fecha anterior lo muestra vigente. |
| CP-SOC-0143 | RF-SOC-143; M18 §5.11; PRO-O10-08 | O10 | Estándar | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Portal del asociado** (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. | El asociado ve en la PWA su grupo, coberturas, solicitudes, derechos de sepultura y plan de vivienda solo de las cuentas vinculadas y sin datos sensibles. |
| CP-SOC-0144 | RF-SOC-144; M18 §5.11; PRO-O10-08 | O10 | Núcleo | funcional | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **IA**: el asistente puede resumir y guiar, nunca decide coberturas sanitarias, aptitud ni disposición de restos. | Ninguna aprobación, rechazo o resolución de cobertura sanitaria, aptitud o disposición de restos se ejecuta desde el asistente; el asistente solo resume, guía y deriva a un operador. |
| CP-SOC-0145 | RF-SOC-145; M18 §5.11; PRO-O4-14 | O4 | Núcleo | regla | TEN-001 con Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años… | **Importes** en `Decimal128` y ARS salvo configuración. | Todos los importes se guardan como `Decimal128` en ARS salvo moneda configurada, y la suma de 0,10 y 0,20 da exactamente 0,30. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-SOC-5001 — ESC-SOC-01. Cobertura a la fecha del evento**

- Cubre: ESC-SOC-01; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147); ambulancia AMB-01 dominio ficticio AA000AA; chofer CHO-01 "Chofer Demo"; 2…
- Dado un adherente con alta 10-10-2026 y evento 05-10-2026
- Cuando se verifica
- Entonces el resultado es `review` con motivo "no incorporado a la fecha del evento".

**CP-SOC-5002 — ESC-SOC-02. Carencia**

- Cubre: ESC-SOC-02; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado carencia de 90 días y alta 01-09-2026
- Cuando hay un sepelio el 15-10-2026
- Entonces el resultado es `notCovered` con motivo carencia y opción de excepción.

**CP-SOC-5003 — ESC-SOC-03. Baja por edad con discapacidad**

- Cubre: ESC-SOC-03; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado un hijo de 22 años con discapacidad acreditada
- Cuando corre la revisión de condiciones
- Entonces no aparece en la lista.

**CP-SOC-5004 — ESC-SOC-04. Transferencia sin borrado**

- Cubre: ESC-SOC-04; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado PRM-SOC-012 = `end`
- Cuando se transfiere el servicio
- Entonces los adherentes quedan `ended` con causa `transfer` y siguen consultables.

**CP-SOC-5005 — ESC-SOC-05. Mora de cementerio**

- Cubre: ESC-SOC-05; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado un derecho con mantenimiento impago
- Cuando se ejecuta la mora
- Entonces no se crea orden de corte de otros servicios ni cambia el derecho o la ocupación.

**CP-SOC-5006 — ESC-SOC-06. Cambio de pagador**

- Cubre: ESC-SOC-06; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado un derecho con ocupación
- Cuando cambia el pagador
- Entonces titular y ocupación no cambian (criterio de aceptación 93).

**CP-SOC-5007 — ESC-SOC-07. Reserva concurrente**

- Cubre: ESC-SOC-07; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reserva concurrente
- Entonces Dadas dos reservas simultáneas de la misma parcela, cuando se confirman, entonces una se rechaza con `soc.unit.notAvailable`.

**CP-SOC-5008 — ESC-SOC-08. Acto sin autorización**

- Cubre: ESC-SOC-08; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado una inhumación solicitada por un tercero no autorizado
- Cuando se intenta registrar como realizada
- Entonces se rechaza con `soc.act.unauthorized`.

**CP-SOC-5009 — ESC-SOC-09. Banco de sangre sin precio**

- Cubre: ESC-SOC-09; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado un convenio financiado por la cooperativa
- Cuando se cierra una solicitud
- Entonces no se genera comprobante al paciente y se registra el costo del convenio (criterio de aceptación 94).

**CP-SOC-5010 — ESC-SOC-10. Sin datos clínicos**

- Cubre: ESC-SOC-10; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado el formulario de solicitud de sangre
- Cuando se inspecciona el modelo
- Entonces no existen campos de grupo sanguíneo, diagnóstico ni compatibilidad.

**CP-SOC-5011 — ESC-SOC-11. Permiso negativo por área**

- Cubre: ESC-SOC-11; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado un supervisor de agua
- Cuando consulta solicitudes de banco de sangre
- Entonces recibe 403 y no aparecen en búsquedas (AGR-008).

**CP-SOC-5012 — ESC-SOC-12. Permiso negativo sensible**

- Cubre: ESC-SOC-12; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado un operador sin `soc.datosSensibles.ver`
- Cuando abre un traslado
- Entonces el motivo aparece enmascarado y no se exporta.

**CP-SOC-5013 — ESC-SOC-13. Separación de tareas**

- Cubre: ESC-SOC-13; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado el técnico que cargó el progreso
- Cuando intenta aprobar el certificado
- Entonces se rechaza.

**CP-SOC-5014 — ESC-SOC-14. Aislamiento de tenant**

- Cubre: ESC-SOC-14; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado un usuario del tenant A
- Cuando consulta un viaje del tenant B
- Entonces recibe 404.

**CP-SOC-5015 — ESC-SOC-15. Cuota de vivienda**

- Cubre: ESC-SOC-15; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado precio ARS 40.000.000, adjudicada, `MINIMO_DA` 1 % y 99,5 % facturado
- Cuando M04 calcula
- Entonces el aporte es 0,5 % = ARS 200.000.

**CP-SOC-5016 — ESC-SOC-16. Anulación de cuota**

- Cubre: ESC-SOC-16; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado una cuota de 1 % anulada
- Cuando M05 publica `fac.invoice.annulled`
- Entonces `pctBilled` baja 1 punto.

**CP-SOC-5017 — ESC-SOC-17. Segundo plan**

- Cubre: ESC-SOC-17; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado una cuenta con plan de vivienda
- Cuando se inscribe otro
- Entonces se rechaza con `soc.housing.secondPlan`.

**CP-SOC-5018 — ESC-SOC-18. Vehículo no apto**

- Cubre: ESC-SOC-18; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado un vehículo con seguro vencido
- Cuando M10 lo asigna a una OT
- Entonces recibe `soc.vehicle.unfit`.

**CP-SOC-5019 — ESC-SOC-19. GPS idempotente**

- Cubre: ESC-SOC-19; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando GPS idempotente
- Entonces Dadas posiciones repetidas por el adaptador, cuando se ingieren, entonces se guarda una por unidad y hora.

**CP-SOC-5020 — ESC-SOC-20. Reintento de lote**

- Cubre: ESC-SOC-20; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado JOB-SOC-02 interrumpido
- Cuando se reanuda
- Entonces no repite bajas ya aplicadas.

**CP-SOC-5021 — ESC-SOC-21. Conciliación de combustible**

- Cubre: ESC-SOC-21; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de un día.
- Dado una factura de combustible anulada en M12
- Cuando llega el evento
- Entonces las cargas vinculadas quedan `voided` y el rendimiento se recalcula.

**CP-SOC-5022 — ESC-SOC-22. Emergencia**

- Cubre: ESC-SOC-22; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado una solicitud de traslado marcada emergencia
- Cuando se registra
- Entonces queda `derived` y muestra la derivación de PRM-SOC-048, sin agenda.

**CP-SOC-5023 — ESC-SOC-23. ESC-01 a ESC-05 (BASE §102.6)**

- Cubre: ESC-SOC-23; relacionados: ESC-01, ESC-05, ESC-04; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando ESC-01 a ESC-05 (BASE §102.6)
- Entonces Reintentos y duplicados de pago (ESC-01, ESC-04) no duplican el % pagado de vivienda ni las obligaciones de cementerio; los demás escenarios aplican en lo que afecten eventos consumidos por M18.

**CP-SOC-5024 — ESC-SOC-24. Carencia de rehabilitación (HUECO-SEP-01)**

- Cubre: ESC-SOC-24; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado un contrato de sepelio con cobertura suspendida por mora y rehabilitada el 01-10-2026, con PRM-SOC-052 = 30
- Cuando se solicita el sepelio por un evento del 15-10-2026
- Entonces la solicitud queda `inReview` con motivo "carencia de rehabilitación"; para un evento del 05-11-2026 la cobertura se verifica normalmente; un traslado urgente del 15-10-2026 no se evalúa contra la carencia.

**CP-SOC-5025 — ESC-SOC-25. Aporte de sangre impago (HUECO-SAN-02)**

- Cubre: ESC-SOC-25; M18 §17
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado un convenio de banco de sangre con modalidad aporte del socio y un aporte impago con la antigüedad de PRM-MOR-205
- Cuando corre la evaluación de mora
- Entonces se crea una única tarea de revisión para el Responsable de servicios sociales, la cobertura sigue vigente y una solicitud de sangre de ese socio se tramita sin bloqueo.

## 3. Casos por caso de uso (CU)

**CP-SOC-8001 — CU-24. Autorizar prestación social**

- Cubre: CU-24; RF-SOC-031, RF-SOC-037; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Servicio social y plan: SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año.
- Dado actor: Operador de servicios sociales, autenticado en TEN-001 con las capabilities de su rol
- Cuando Identifica beneficiario y fecha → verifica cobertura → registra autorización y prestador o deriva excepción.
- Entonces Se completa «Autorizar prestación social» sin errores, con los efectos que exigen RF-SOC-031, RF-SOC-037, y quedan auditoría y evento del cambio. Alternativo o excepción: Beneficiario no incorporado a la fecha del evento: revisión, sin cambio retroactivo.

**CP-SOC-8002 — CU-ESP-CEM. Reservar parcela e inhumar**

- Cubre: CU-ESP-CEM; RF-SOC-049, RF-SOC-058; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado actor: Administrador de cementerio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Reserva PAR-DEMO-001 → instrumento → obligaciones → solicitud de inhumación de un fallecido distinto del titular → validación → turno → registro.
- Entonces Se completa «Reservar parcela e inhumar» sin errores, con los efectos que exigen RF-SOC-049, RF-SOC-058, y quedan auditoría y evento del cambio. Alternativo o excepción: Cambio de pagador: no elimina ocupación ni transfiere derecho.

**CP-SOC-8003 — CU-ESP-SAN. Acreditar cobertura de banco de sangre**

- Cubre: CU-ESP-SAN; RF-SOC-065, RF-SOC-073; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Banco de sangre: Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos.
- Dado actor: Operador de banco de sangre, autenticado en TEN-001 con las capabilities de su rol
- Cuando Valida convenio y vigencia → tramita referencia → registra respuesta y seguimiento.
- Entonces Se completa «Acreditar cobertura de banco de sangre» sin errores, con los efectos que exigen RF-SOC-065, RF-SOC-073, y quedan auditoría y evento del cambio. Alternativo o excepción: Convenio financiado por la cooperativa: no se factura al paciente.

**CP-SOC-8004 — CU-SOC-01. Agregar un hijo al grupo de sepelio**

- Cubre: CU-SOC-01; RF-SOC-011, RF-SOC-013; M18 §16
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado actor: Operador / asociado PWA, autenticado en TEN-001 con las capabilities de su rol
- Cuando Carga persona y vínculo → valida edad y requisitos → alta con carencia → M04 suma un adherente en el próximo período.
- Entonces Se completa «Agregar un hijo al grupo de sepelio» sin errores, con los efectos que exigen RF-SOC-011, RF-SOC-013, y quedan auditoría y evento del cambio. Alternativo o excepción: Edad fuera de rango: rechazo con motivo; ya adherente en otro titular: ofrece baja allí.

**CP-SOC-8005 — CU-SOC-02. Procesar mayoría de edad**

- Cubre: CU-SOC-02; RF-SOC-015, RF-SOC-018; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado actor: Sistema + responsable, autenticado en TEN-001 con las capabilities de su rol
- Cuando JOB-SOC-01 detecta → aviso → previsualización → baja o recategorización por lote.
- Entonces Se completa «Procesar mayoría de edad» sin errores, con los efectos que exigen RF-SOC-015, RF-SOC-018, y quedan auditoría y evento del cambio. Alternativo o excepción: Adherente con discapacidad: excluido.

**CP-SOC-8006 — CU-SOC-03. Desconexión y reconexión con adherentes**

- Cubre: CU-SOC-03; RF-SOC-019, RF-SOC-020; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado actor: Sistema, autenticado en TEN-001 con las capabilities de su rol
- Cuando Desconexión suspende adherentes → reconexión consulta restauración.
- Entonces Se completa «Desconexión y reconexión con adherentes» sin errores, con los efectos que exigen RF-SOC-019, RF-SOC-020, y quedan auditoría y evento del cambio. Alternativo o excepción: Titular fallecido: no reconecta salvo PRM-SOC-006.

**CP-SOC-8007 — CU-SOC-04. Gestionar sepelio con inhumación en el parque**

- Cubre: CU-SOC-04; RF-SOC-039, RF-SOC-043; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Cementerio: Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación…
- Dado actor: Operador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Caso → prestador → traslado → acto de inhumación → cierre → adicionales facturados.
- Entonces Se completa «Gestionar sepelio con inhumación en el parque» sin errores, con los efectos que exigen RF-SOC-039, RF-SOC-043, y quedan auditoría y evento del cambio. Alternativo o excepción: Fallecimiento fuera de alcance territorial: excepción.

**CP-SOC-8008 — CU-SOC-05. Pagar subsidio por fallecimiento**

- Cubre: CU-SOC-05; RF-SOC-044, RF-SOC-046; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado actor: Operador + responsable, autenticado en TEN-001 con las capabilities de su rol
- Cuando Expediente → beneficiarios → aprobación → orden de pago.
- Entonces Se completa «Pagar subsidio por fallecimiento» sin errores, con los efectos que exigen RF-SOC-044, RF-SOC-046, y quedan auditoría y evento del cambio. Alternativo o excepción: Fuera de plazo: `expired`.

**CP-SOC-8009 — CU-SOC-06. Ceder un derecho de sepultura**

- Cubre: CU-SOC-06; RF-SOC-059; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Grupo: GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad).
- Dado actor: Administrador + jurídico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Solicitud → documentación → aprobación jurídica → nuevo titular.
- Entonces Se completa «Ceder un derecho de sepultura» sin errores, con los efectos que exigen RF-SOC-059, y quedan auditoría y evento del cambio. Alternativo o excepción: Sin aprobación: sin cambios.

**CP-SOC-8010 — CU-SOC-07. Programar un traslado a diálisis**

- Cubre: CU-SOC-07; RF-SOC-074, RF-SOC-084; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147); ambulancia AMB-01 dominio ficticio AA000AA; chofer CHO-01 "Chofer Demo"; 2…
- Dado actor: Operador de traslados, autenticado en TEN-001 con las capabilities de su rol
- Cuando Solicitud → verificación de cobertura y tope → asignación de móvil apto y chofer → ejecución en PWA → cierre e importe.
- Entonces Se completa «Programar un traslado a diálisis» sin errores, con los efectos que exigen RF-SOC-074, RF-SOC-084, y quedan auditoría y evento del cambio. Alternativo o excepción: Emergencia: derivación al prestador.

**CP-SOC-8011 — CU-SOC-08. Facturar cuota de vivienda**

- Cubre: CU-SOC-08; RF-SOC-086, RF-SOC-091, RF-SOC-096; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado actor: Sistema (M04/M05), autenticado en TEN-001 con las capabilities de su rol
- Cuando M04 consulta % y precio → M05 emite comprobante exclusivo → M18 actualiza % facturado → pago actualiza % pagado.
- Entonces Se completa «Facturar cuota de vivienda» sin errores, con los efectos que exigen RF-SOC-086, RF-SOC-091, RF-SOC-096, y quedan auditoría y evento del cambio. Alternativo o excepción: Aporte superior al máximo: rechazo salvo PRM-SOC-024.

**CP-SOC-8012 — CU-SOC-09. Certificar avance de obra**

- Cubre: CU-SOC-09; RF-SOC-097, RF-SOC-104; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado actor: Técnico + responsable, autenticado en TEN-001 con las capabilities de su rol
- Cuando Progreso por actividades → certificado → aprobación por otro usuario → liquidación al constructor.
- Entonces Se completa «Certificar avance de obra» sin errores, con los efectos que exigen RF-SOC-097, RF-SOC-104, y quedan auditoría y evento del cambio. Alternativo o excepción: Progreso > 100 %: rechazo.

**CP-SOC-8013 — CU-SOC-10. Retirar materiales para una vivienda**

- Cubre: CU-SOC-10; RF-SOC-100, RF-SOC-102; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado actor: Operador de vivienda, autenticado en TEN-001 con las capabilities de su rol
- Cuando Vale con ítems → movimiento de stock → costo a la obra.
- Entonces Se completa «Retirar materiales para una vivienda» sin errores, con los efectos que exigen RF-SOC-100, RF-SOC-102, y quedan auditoría y evento del cambio. Alternativo o excepción: Cantidad mayor a asignada: requiere autorización.

**CP-SOC-8014 — CU-SOC-11. Rescindir un plan de vivienda**

- Cubre: CU-SOC-11; RF-SOC-108; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Vivienda: Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de…
- Dado actor: Responsable de planes, autenticado en TEN-001 con las capabilities de su rol
- Cuando Valida plan conectado → calcula comisión y diferencia → aprobación → comprobante → devolución o compensación.
- Entonces Se completa «Rescindir un plan de vivienda» sin errores, con los efectos que exigen RF-SOC-108, y quedan auditoría y evento del cambio. Alternativo o excepción: Plan no conectado: rechazo.

**CP-SOC-8015 — CU-SOC-12. Registrar carga de combustible desde factura**

- Cubre: CU-SOC-12; RF-SOC-124, RF-SOC-126; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de un día.
- Dado actor: Sistema / compras, autenticado en TEN-001 con las capabilities de su rol
- Cuando Factura con líneas de combustible y móvil → `fuelLoads` → rendimiento.
- Entonces Se completa «Registrar carga de combustible desde factura» sin errores, con los efectos que exigen RF-SOC-124, RF-SOC-126, y quedan auditoría y evento del cambio. Alternativo o excepción: Anulación de factura: libera cargas.

**CP-SOC-8016 — CU-SOC-13. Rendir un viaje de flete**

- Cubre: CU-SOC-13; RF-SOC-128, RF-SOC-131, RF-SOC-136; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Traslados: Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147); ambulancia AMB-01 dominio ficticio AA000AA; chofer CHO-01 "Chofer Demo"; 2…
- Dado actor: Chofer + responsable, autenticado en TEN-001 con las capabilities de su rol
- Cuando Carga km reales, peajes, viáticos y combustible → envía → aprobación → novedades M16 y costos M15.
- Entonces Se completa «Rendir un viaje de flete» sin errores, con los efectos que exigen RF-SOC-128, RF-SOC-131, RF-SOC-136, y quedan auditoría y evento del cambio. Alternativo o excepción: Desvío de km: revisión.

**CP-SOC-8017 — CU-SOC-14. Consultar recorrido GPS de una OT**

- Cubre: CU-SOC-14; RF-SOC-132, RF-SOC-135; M18 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Flota: 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de un día.
- Dado actor: Responsable de flota, autenticado en TEN-001 con las capabilities de su rol
- Cuando Selecciona vehículo y fecha → recorrido y km GPS vs declarados.
- Entonces Se completa «Consultar recorrido GPS de una OT» sin errores, con los efectos que exigen RF-SOC-132, RF-SOC-135, y quedan auditoría y evento del cambio. Alternativo o excepción: Sin dispositivo: aviso.

**CP-SOC-8018 — CU-SOC-15. Prestar una silla de ruedas**

- Cubre: CU-SOC-15; RF-SOC-113; M18 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M18 §18.
- Datos de prueba: Otros: 2 sillas de ruedas y 1 andador en el banco ortopédico, 1 préstamo vigente.
- Dado actor: Personal de ortopedia, autenticado en TEN-001 con las capabilities de su rol
- Cuando Préstamo con plazo y depósito → devolución → mantenimiento.
- Entonces Se completa «Prestar una silla de ruedas» sin errores, con los efectos que exigen RF-SOC-113, y quedan auditoría y evento del cambio. Alternativo o excepción: Vencido: aviso al asociado.
