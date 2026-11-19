# Casos de prueba de aceptación — T12 SRV — Fichas verticales por servicio · Parte 1 (servicios de red y TIC)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T12-SRV-fichas-verticales-servicios-parte1.md`](../../especificacion/anexos/T12-SRV-fichas-verticales-servicios-parte1.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 0 CP de requisitos funcionales, 58 CP de escenarios ESC y 0 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 2. Casos por escenario y criterio de aceptación con ID

**CP-SRV-5001 — ESC-SRV-INT-01. La ONT-DEMO-0001 se aplica, SmartOLT confirma `activate` y la activación queda el 21-11-2026**

- Cubre: ESC-SRV-INT-01; RN-TAR-240, RN-TAR-241, RN-TAR-245; relacionados: ESC-TAR-03; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado TEN-001 con INT-100 (valores del *seed* único de M02 §18 que usa el ejemplo M04 §9.3.9: abono ARS 15.000, promoción PROMO-INT-50x3 = 50 % sobre el abono × 3 ciclos, instalación ARS 20.000 sin descuento, mes adelantado, PRM-TAR-012 = `fraction_plus_next`, PRM-TAR-016 = `false`) y Ana Demo con factibilidad favorable
- Cuando La ONT-DEMO-0001 se aplica, SmartOLT confirma `activate` y la activación queda el 21-11-2026
- Entonces El contrato pasa a `active` con `effectiveStart` 21-11-2026; el primer comprobante (diciembre) suma ARS 30.000,00 neto (fracción de noviembre 15.000 × 10/30 = 5.000,00 − 2.500,00 + diciembre 15.000,00 − 7.500,00 + instalación 20.000,00; RN-TAR-240 a 242), el ciclo parcial no consume promoción y obtiene CAE (ESC-TAR-03, DEC-016, DEC-033). Corrección del 05-11-2026 (HUE-SRV-05): antes decía "abono ARS 25.000, promoción 10 % × 3 ciclos, instalación ARS 30.000 … ARS 60.000,00 neto (fracción 8.333,33 − 833,33 + 25.000 − 2.500 + 30.000)", valores de BASE que M04 conserva solo como casos de prueba de RN-TAR-241 y RN-TAR-245.

**CP-SRV-5002 — ESC-SRV-INT-02. (error) SmartOLT responde `timeout` tres veces**

- Cubre: ESC-SRV-INT-02; RF-TEC-188, RF-POR-071; relacionados: CU-TEC-04; T12 §1.7
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato de Ana en `pendingInstallation` con la OT cerrada en campo
- Cuando SmartOLT responde `timeout` tres veces
- Entonces EVT-TEC-21 `tec.provisioning.failed`; el contrato no se activa ni se factura; se crea una tarea manual para el NOC (RF-TEC-188); el socio ve "Instalación realizada – activación en curso" (RF-POR-071; CU-TEC-04).

**CP-SRV-5003 — ESC-SRV-INT-03. Se confirma un pago de ARS 15.000 por Pagos360 (EVT-COB-04)**

- Cubre: ESC-SRV-INT-03; relacionados: ESC-MOR-21; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado SUS-DEMO-GRATIS suspendido en modo `restricted` por una deuda vencida de ARS 15.000
- Cuando Se confirma un pago de ARS 15.000 por Pagos360 (EVT-COB-04)
- Entonces JOB-MOR-07 evalúa la reconexión, M10 emite `reactivate` y el contrato vuelve a `active` sin cargo (REACT-DEMO-GRATIS); si T06 falla, el caso queda `executionFailed` con reintentos y el contrato sigue `suspended` (ESC-MOR-21, 22).

**CP-SRV-5004 — ESC-SRV-INT-04. El titular pide la baja por el botón público, sin iniciar sesión**

- Cubre: ESC-SRV-INT-04; relacionados: ESC-CRM-04, ESC-MOR-27; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado BAJA-DEMO activo con deuda ficticia de ARS 12.500
- Cuando El titular pide la baja por el botón público, sin iniciar sesión
- Entonces Recibe el código en pantalla y por correo en menos de 24 h; no se exige el pago ni se crea un cargo; se emite `cat.contract.terminationRequested`, OT de retiro de la ONT con plazo de 15 días (PRM-CAT-094); la deuda sigue en M07 (ESC-CRM-04, ESC-MOR-27, DEC-057).

**CP-SRV-5005 — ESC-SRV-INT-05. Pide el cambio a INT-300 (ARS 22.000) el 10-11-2026**

- Cubre: ESC-SRV-INT-05; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Ana con INT-100 (ARS 15.000) desde agosto, ciclo mensual
- Cuando Pide el cambio a INT-300 (ARS 22.000) el 10-11-2026
- Entonces `cat.contract.planChanged` con `validFrom` 01-12-2026 (DEC-032); M10 emite `changePlan` con fecha efectiva; noviembre se factura ARS 15.000 y diciembre ARS 22.000.

**CP-SRV-5006 — ESC-SRV-INT-06. (aislamiento) Consulta por ID el contrato INT de Ana (TEN-001) y la ONT-DEMO-0001**

- Cubre: ESC-SRV-INT-06; relacionados: ESC-TEC-25, ESC-TAR-21, ESC-MOR-45; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un operador de TEN-002 con permiso `cat.contratos.ver`
- Cuando Consulta por ID el contrato INT de Ana (TEN-001) y la ONT-DEMO-0001
- Entonces 404 sin revelar existencia; los jobs `tec:aprovisionar` de TEN-002 no leen comandos de TEN-001; una copia COP-DEMO-001 lleva la configuración pero ni contratos ni precios aprobados (ESC-TEC-25, ESC-TAR-21, ESC-MOR-45).

**CP-SRV-5007 — ESC-SRV-INT-07. (error) Hermano B solicita INT en el mismo domicilio**

- Cubre: ESC-SRV-INT-07; RN-CAT-030; relacionados: ESC-03; T12 §1.7
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha INT (T12 §1.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Hermano A con deuda ficticia en DIR-CASA-001
- Cuando Hermano B solicita INT en el mismo domicilio
- Entonces Se advierte la deuda del domicilio sin bloquear ni trasladarla (DEC-029; RN-CAT-030); el contrato de B se crea independiente (ESC-03 de M02).

**CP-SRV-5008 — ESC-SRV-TEL-01. Se emite el ciclo de noviembre sin llamadas**

- Cubre: ESC-SRV-TEL-01; RN-CAT-075; T12 §2.7
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Línea 0000-400101 de TEL-BAS con abono ficticio de ARS 8.000 y PRM-TAR-080 = false (ola O4, sin CDR)
- Cuando Se emite el ciclo de noviembre sin llamadas
- Entonces El comprobante tiene un solo renglón de abono por ARS 8.000 y ningún renglón de llamadas (RN-CAT-075).

**CP-SRV-5009 — ESC-SRV-TEL-02. Se tasa una llamada local de 23:50 a 00:20**

- Cubre: ESC-SRV-TEL-02; relacionados: ESC-TAR-28; T12 §2.7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Plan ficticio con banda A a ARS 10 por minuto hasta las 00:00 y banda B a ARS 5 por minuto después
- Cuando Se tasa una llamada local de 23:50 a 00:20
- Entonces Dos tramos: 10 min × 10 = ARS 100 y 20 min × 5 = ARS 100; neto ARS 200 con versión del plan en la traza (ESC-TAR-28).

**CP-SRV-5010 — ESC-SRV-TEL-03. (error) Se ejecuta JOB-TEC-09**

- Cubre: ESC-SRV-TEL-03; RF-TEC-207, RF-TEC-213; T12 §2.7
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado `cdr-demo.csv` contiene una llamada con origen 0000-400199, número sin línea vigente a la fecha
- Cuando Se ejecuta JOB-TEC-09
- Entonces La llamada queda como "origen no encontrado" (RF-TEC-207), no se tasa ni factura y aparece en el informe de no asignadas (RF-TEC-213).

**CP-SRV-5011 — ESC-SRV-TEL-04. Se vuelve a importar el archivo**

- Cubre: ESC-SRV-TEL-04; RF-TEC-206; T12 §2.7
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado El mismo `cdr-demo.csv` ya fue importado
- Cuando Se vuelve a importar el archivo
- Entonces La deduplicación (RF-TEC-206; PRM-TEC-108) no crea llamadas nuevas ni tasa dos veces; el resultado informa 50 duplicadas.

**CP-SRV-5012 — ESC-SRV-TEL-05. Se intenta asignar el número a otro contrato el 20-11-2026**

- Cubre: ESC-SRV-TEL-05; RF-TEC-200; T12 §2.7
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Línea 0000-400102 con baja confirmada el 15-11-2026
- Cuando Se intenta asignar el número a otro contrato el 20-11-2026
- Entonces Se rechaza: el número está en cuarentena (RF-TEC-200); las llamadas del 1 al 15 de noviembre se facturan en la factura final.

**CP-SRV-5013 — ESC-SRV-TEL-06. (aislamiento) Importa un CDR cuyos orígenes coinciden con números de TEN-001**

- Cubre: ESC-SRV-TEL-06; T12 §2.7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un usuario de TEN-002 con `tec.cdr.importar` (antes `tec.cdr.import`)
- Cuando Importa un CDR cuyos orígenes coinciden con números de TEN-001
- Entonces Ninguna llamada se atribuye a líneas de TEN-001; todas quedan "origen no encontrado" en TEN-002; consultar una llamada de TEN-001 por ID devuelve 404.

**CP-SRV-5014 — ESC-SRV-TEL-07. Se importa el archivo PR1 del período**

- Cubre: ESC-SRV-TEL-07; RF-FAC-124; RN-TAR-099; T12 §2.7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TEL (T12 §2.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Línea móvil revendida con factura del proveedor de ARS 9.500 (abono 7.000 + excedente 2.500)
- Cuando Se importa el archivo PR1 del período
- Entonces Renglones de abono y excedente en el comprobante del socio por ARS 9.500 con los conceptos del proveedor (RF-FAC-124; RN-TAR-099).

**CP-SRV-5015 — ESC-SRV-TV-01. Se aplica el decodificador y el CAS confirma la activación el 01-12-2026**

- Cubre: ESC-SRV-TV-01; T12 §3.7
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado TV-BAS con abono ficticio de ARS 12.000 e instalación de ARS 6.000; decodificador con serie ficticia DECO-DEMO-0001 en custodia del instalador
- Cuando Se aplica el decodificador y el CAS confirma la activación el 01-12-2026
- Entonces El contrato pasa a `active`; el primer comprobante de diciembre suma ARS 18.000 (abono + instalación, DEC-016).

**CP-SRV-5016 — ESC-SRV-TV-02. Se instala un segundo decodificador**

- Cubre: ESC-SRV-TV-02; T12 §3.7
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato TV-BAS activo con PRM-CAT-095 = 1 y punto adicional ficticio de ARS 2.000
- Cuando Se instala un segundo decodificador
- Entonces El período siguiente factura ARS 12.000 + ARS 2.000 = ARS 14.000; el segundo equipo queda en comodato con su constancia.

**CP-SRV-5017 — ESC-SRV-TV-03. (error) El CAS rechaza la activación por serie no registrada**

- Cubre: ESC-SRV-TV-03; RF-TEC-188, RF-TEC-100; T12 §3.7
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato en `pendingInstallation` con el decodificador aplicado
- Cuando El CAS rechaza la activación por serie no registrada
- Entonces EVT-TEC-21 `tec.provisioning.failed`; el contrato no se activa ni se factura; tarea manual (RF-TEC-188); la bandeja de instalaciones lo muestra como "ejecutada sin activación" (RF-TEC-100).

**CP-SRV-5018 — ESC-SRV-TV-04. Se ejecuta la suspensión y luego se confirma el pago total**

- Cubre: ESC-SRV-TV-04; RF-MOR-122; T12 §3.7
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato TV con deuda vencida de ARS 24.000 y caso de mora aprobado
- Cuando Se ejecuta la suspensión y luego se confirma el pago total
- Entonces El CAS corta la señal (EVT-TEC-18); tras el pago, JOB-MOR-07 reconecta sin cargo y el contrato vuelve a `active` (RF-MOR-122).

**CP-SRV-5019 — ESC-SRV-TV-05. El titular pide la baja desde la app**

- Cubre: ESC-SRV-TV-05; RF-TAR-115; RN-MOR-101; T12 §3.7
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato TV activo con dos decodificadores
- Cuando El titular pide la baja desde la app
- Entonces Constancia por el mismo medio; el contrato pasa a `pendingTermination` y se genera la OT de retiro; si los equipos no se devuelven en 15 días, EVT-STK-07 abre un contacto en M09, sin cargo automático (HUE-INT-01). Con HUE-INT-01 corregido, el tenant puede habilitar el cargo por equipo no devuelto (RF-TAR-115, PRM-TAR-169, apagado por defecto), que se aprueba según RN-MOR-101.

**CP-SRV-5020 — ESC-SRV-TV-06. (aislamiento) Busca la serie DECO-DEMO-0001 (TEN-001) en PAN-STK-11**

- Cubre: ESC-SRV-TV-06; T12 §3.7
- Ola: O10 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha TV (T12 §3.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un operador de TEN-002
- Cuando Busca la serie DECO-DEMO-0001 (TEN-001) en PAN-STK-11
- Entonces Sin resultados; GET por ID devuelve 404.

**CP-SRV-5021 — ESC-SRV-ELE-01. Lecturas validadas de 10.000 y 10.250 kWh**

- Cubre: ESC-SRV-ELE-01; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Suministro ELE-RES con cuadro ficticio tipo 2: cargo fijo ARS 3.000; 0–150 kWh a ARS 100; más de 150 kWh a ARS 120
- Cuando Lecturas validadas de 10.000 y 10.250 kWh
- Entonces Consumo 250 kWh; neto ARS 3.000 + 15.000 + 12.000 = ARS 30.000 con versión del cuadro y tramos en la traza; CAE obtenido.

**CP-SRV-5022 — ESC-SRV-ELE-02. Se aprueba el balance (JOB-MED-15) y se emite**

- Cubre: ESC-SRV-ELE-02; RF-FIS-073; relacionados: ESC-TAR-11; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Suministro con contrato GD vigente, demanda 300 kWh e inyección 120 kWh (ESC-TAR-11)
- Cuando Se aprueba el balance (JOB-MED-15) y se emite
- Entonces Dos operaciones separadas con su IVA; si el total queda negativo, crédito registrado para la próxima factura (DEC-036, DEC-060; EVT-TAR-021) y datos de energía inyectada para RG 5746/2025 (RF-FIS-073).

**CP-SRV-5023 — ESC-SRV-ELE-03. (error) Llega una lectura con inyección de 40 kWh**

- Cubre: ESC-SRV-ELE-03; RF-MED-099; RN-MED-078; relacionados: ESC-MED-18; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Punto sin contrato GD
- Cuando Llega una lectura con inyección de 40 kWh
- Entonces Excepción bloqueante (RF-MED-099; PRM-MED-089); el servicio queda "observado" en el lote y no se emite hasta resolver (RN-MED-078; ESC-MED-18).

**CP-SRV-5024 — ESC-SRV-ELE-04. Corre JOB-MOR-02**

- Cubre: ESC-SRV-ELE-04; relacionados: ESC-MOR-17; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Suministro con electrodependencia acreditada y deuda vencida de ARS 90.000
- Cuando Corre JOB-MOR-02
- Entonces Evaluación `blocked`; ningún rol puede crear el caso de interrupción (ESC-MOR-17); la deuda sigue en gestión de aviso y convenio.

**CP-SRV-5025 — ESC-SRV-ELE-05. Se calcula el período**

- Cubre: ESC-SRV-ELE-05; relacionados: ESC-TAR-08; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Gran usuario con reactiva alta (ejemplo M04 §9.3.6)
- Cuando Se calcula el período
- Entonces Renglón de factor de potencia con recargo ARS 209.677,42, método y tope en la traza; sin reactiva no hay renglón (ESC-TAR-08).

**CP-SRV-5026 — ESC-SRV-ELE-06. El socio recarga ARS 5.000 desde la app**

- Cubre: ESC-SRV-ELE-06; relacionados: CU-POR-12; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Suministro prepago con deuda vencida y retención configurada del 10 %
- Cuando El socio recarga ARS 5.000 desde la app
- Entonces Capital acreditado ARS 4.500 y ARS 500 a cuenta de la deuda; token entregado (EVT-MED-23); factura de autogestión (CU-POR-12).

**CP-SRV-5027 — ESC-SRV-ELE-07. Se ejecuta el corte remoto y luego se confirma el pago**

- Cubre: ESC-SRV-ELE-07; RF-MED-108; relacionados: CU-MED-08; T12 §4.7
- Ola: O7 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Suministro telemedido con caso de mora `scheduled` en ventana hábil
- Cuando Se ejecuta el corte remoto y luego se confirma el pago
- Entonces `disconnect` y `reconnect` con `Idempotency-Key` (RF-MED-108); EVT-MED-21 en ambos; si falla, EVT-MED-22 y la OT no cierra (PRM-CAT-041; CU-MED-08).

**CP-SRV-5028 — ESC-SRV-ELE-08. (aislamiento) Sincroniza un lote que incluye un punto de TEN-001 por ID**

- Cubre: ESC-SRV-ELE-08; relacionados: ESC-MED-24; T12 §4.7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha ELE (T12 §4.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un lecturista de TEN-002
- Cuando Sincroniza un lote que incluye un punto de TEN-001 por ID
- Entonces Rechazo 404 por ítem; ninguna lectura de TEN-001 se crea ni se lee desde TEN-002 (ESC-MED-24).

**CP-SRV-5029 — ESC-SRV-AG-01. Se aprueba un consumo de 20 m³**

- Cubre: ESC-SRV-AG-01; relacionados: ESC-TAR-01; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato AG-RES medido con TAR-AG-2026-11 (cargo fijo ARS 3.000; ARS 500 por m³)
- Cuando Se aprueba un consumo de 20 m³
- Entonces Neto ARS 13.000,00 con versión, fila y cantidad en la traza (ESC-TAR-01).

**CP-SRV-5030 — ESC-SRV-AG-02. Se calcula el período**

- Cubre: ESC-SRV-AG-02; relacionados: ESC-TAR-09; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato no medido tipo 15 con TBM 1.000, zonal 0,9, coeficiente 1,1 y cuota 500
- Cuando Se calcula el período
- Entonces red2(1.000 × 0,9 × 1,1 + 500 × 0,7) = ARS 1.340,00 (ESC-TAR-09).

**CP-SRV-5031 — ESC-SRV-AG-03. (error) Se calcula el lote**

- Cubre: ESC-SRV-AG-03; relacionados: ESC-TAR-09, ESC-TAR-15; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato no medido tipo 15 cuyo inmueble tiene TBM = 0
- Cuando Se calcula el lote
- Entonces La cuenta se excluye con `TAR-E-WATER-TBM` y el lote continúa (ESC-TAR-09, ESC-TAR-15).

**CP-SRV-5032 — ESC-SRV-AG-04. Corre la evaluación de mora**

- Cubre: ESC-SRV-AG-04; relacionados: ESC-MOR-15; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Cuenta unificada con agua ARS 13.000, electricidad ARS 20.000 y cementerio ARS 7.000 vencidos; pago de ARS 8.000
- Cuando Corre la evaluación de mora
- Entonces Decisión por servicio, sin corte automático; la deuda de cementerio no habilita suspender agua ni electricidad (ESC-MOR-15; PA-MOR-08).

**CP-SRV-5033 — ESC-SRV-AG-05. Se ejecuta la distribución (JOB-MED-07)**

- Cubre: ESC-SRV-AG-05; relacionados: CU-MED-06; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Consorcio con medidor general de 100 m³ y cuatro unidades funcionales con coeficiente 0,25
- Cuando Se ejecuta la distribución (JOB-MED-07)
- Entonces 25 m³ por unidad; cada contrato se factura con su consumo distribuido y la traza al medidor general (CU-MED-06).

**CP-SRV-5034 — ESC-SRV-AG-06. Ana informa una autolectura que da 95 m³**

- Cubre: ESC-SRV-AG-06; relacionados: CU-POR-11; T12 §5.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Ventana de autolectura abierta; último consumo 18 m³
- Cuando Ana informa una autolectura que da 95 m³
- Entonces La autolectura queda "En revisión" por fuera de rango, sin consumo aprobado (CU-POR-11; EVT-MED-27).

**CP-SRV-5035 — ESC-SRV-AG-07. (aislamiento) Busca por nomenclatura un inmueble de TEN-001**

- Cubre: ESC-SRV-AG-07; RF-PER-092; T12 §5.7
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha AG (T12 §5.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un operador de TEN-002
- Cuando Busca por nomenclatura un inmueble de TEN-001
- Entonces Sin resultados; la validación de parcela duplicada (RF-PER-092) solo compara dentro del tenant.

**CP-SRV-5036 — ESC-SRV-CLO-01. Se aprueba un consumo AG de 20 m³ y se calcula el período**

- Cubre: ESC-SRV-CLO-01; RN-TAR-015; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Cuenta con AG y CLO; CLO tiene servicio relacionado AG (PRM-CAT-080); cuadro ficticio: cargo fijo ARS 1.000 y ARS 200 por m³
- Cuando Se aprueba un consumo AG de 20 m³ y se calcula el período
- Entonces CLO = 1.000 + 20 × 200 = ARS 5.000,00, con la traza al consumo AG de origen (RN-TAR-015).

**CP-SRV-5037 — ESC-SRV-CLO-02. Se recalcula CLO de noviembre**

- Cubre: ESC-SRV-CLO-02; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PRM-TAR-061 = true; el consumo AG de octubre ya se liquidó en CLO
- Cuando Se recalcula CLO de noviembre
- Entonces Solo se toma el consumo AG no liquidado; octubre no se vuelve a cobrar.

**CP-SRV-5038 — ESC-SRV-CLO-03. Se da de alta AG**

- Cubre: ESC-SRV-CLO-03; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un socio pide el alta de AG en un inmueble con red cloacal
- Cuando Se da de alta AG
- Entonces No se crea ningún contrato CLO; CLO requiere su propia solicitud (M02 6.C.6).

**CP-SRV-5039 — ESC-SRV-CLO-04. Se facturan las 12 cuotas**

- Cubre: ESC-SRV-CLO-04; RN-TAR-074; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Plan de obra cloacal ficticio de ARS 100.000 en 12 cuotas
- Cuando Se facturan las 12 cuotas
- Entonces Cuotas 1 a 11 de ARS 8.333,33 y última de ARS 8.333,37 (ajuste de saldo, RN-TAR-074).

**CP-SRV-5040 — ESC-SRV-CLO-05. (error) Se calcula el lote**

- Cubre: ESC-SRV-CLO-05; RN-TAR-070; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato tipo 17 sin tipo de obra informado
- Cuando Se calcula el lote
- Entonces La cuenta se excluye con `TAR-E-WORKS-TYPE` y el lote continúa (RN-TAR-070).

**CP-SRV-5041 — ESC-SRV-CLO-06. Se importa (RF-MED-055)**

- Cubre: ESC-SRV-CLO-06; RF-MED-055; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Archivo ARR de consumos directos de cloaca
- Cuando Se importa (RF-MED-055)
- Entonces Los consumos quedan pendientes de aprobación; no se liquidan hasta aprobarlos.

**CP-SRV-5042 — ESC-SRV-CLO-07. (aislamiento) Se calcula**

- Cubre: ESC-SRV-CLO-07; T12 §6.7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha CLO (T12 §6.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un contrato CLO de TEN-002 con servicio relacionado AG
- Cuando Se calcula
- Entonces Solo toma consumos AG de la misma cuenta de TEN-002; nunca los de TEN-001, aunque coincida la nomenclatura.

**CP-SRV-5043 — ESC-SRV-GAS-01. Se aprueba una lectura de 100 m³ con presión 1,0140 y temperatura 0,9870**

- Cubre: ESC-SRV-GAS-01; relacionados: ESC-TAR-10; T12 §7.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato GAS-RES; factor del período 9.300 kcal/m³; óptimo 9.300; coeficiente 1; PRM-TAR-051 = `round0`; cuadro ficticio con cargo fijo ARS 2.500 y ARS 300 por m³
- Cuando Se aprueba una lectura de 100 m³ con presión 1,0140 y temperatura 0,9870
- Entonces red4(100 × 1,0140 × 0,9870) = 100,0818 m³ → 100 m³ corregidos; neto = 2.500 + 100 × 300 = ARS 32.500,00, con factores y método en la traza (ESC-TAR-10).

**CP-SRV-5044 — ESC-SRV-GAS-02. (error) Se valida y se calcula**

- Cubre: ESC-SRV-GAS-02; RN-TAR-035; relacionados: ESC-MED-17, ESC-TAR-10; T12 §7.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado No hay factor calórico de noviembre (ni por categoría ni general)
- Cuando Se valida y se calcula
- Entonces El consumo queda aprobado con su volumen medido y M04 excluye la cuenta con `TAR-E-GAS-FACTOR`; el lote continúa (RN-TAR-035, DEC-085; ESC-MED-17, ESC-TAR-10; antes "el consumo queda bloqueado por falta factor de gas").

**CP-SRV-5045 — ESC-SRV-GAS-03. Se intenta habilitar el contrato**

- Cubre: ESC-SRV-GAS-03; relacionados: CU-ESP-GAS; T12 §7.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado PRM-CAT-096 = true; la solicitud tiene certificado del matriculado pero no DDJJ de artefactos
- Cuando Se intenta habilitar el contrato
- Entonces Se rechaza la habilitación; el contrato no pasa a Activo hasta cargar la DDJJ (PAN-CAT-25) y aprobar la inspección (CU-ESP-GAS).

**CP-SRV-5046 — ESC-SRV-GAS-04. El socio paga los ARS 45.000**

- Cubre: ESC-SRV-GAS-04; RF-CAT-066; RN-MOR-086; T12 §7.7
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Contrato suspendido por mora con deuda de ARS 45.000
- Cuando El socio paga los ARS 45.000
- Entonces Estado "Rehabilitación en trámite"; se genera una OT de inspección y el contrato vuelve a Activo solo con la inspección aprobada (RN-MOR-086; RF-CAT-066).

**CP-SRV-5047 — ESC-SRV-GAS-05. El bot clasifica el mensaje**

- Cubre: ESC-SRV-GAS-05; RF-CRM-122; T12 §7.7
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado El socio escribe al bot "huele a gas en la cocina"
- Cuando El bot clasifica el mensaje
- Entonces Caso de urgencia crítica, aviso inmediato a la guardia y mensaje de seguridad con teléfono de emergencia; el bot no da instrucciones técnicas (RF-CRM-122).

**CP-SRV-5048 — ESC-SRV-GAS-06. Se abre un caso de inspección**

- Cubre: ESC-SRV-GAS-06; RF-TEC-176, RF-TEC-180; T12 §7.7
- Ola: O7 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Un lecturista informa un precinto roto
- Cuando Se abre un caso de inspección
- Entonces El caso nace como `suspected`; el recupero solo se factura con método aprobado y aprobación explícita, nunca de forma automática (RF-TEC-176, 180).

**CP-SRV-5049 — ESC-SRV-GAS-07. (aislamiento) TEN-002 calcula su lote de gas**

- Cubre: ESC-SRV-GAS-07; RN-TAR-035; T12 §7.7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha GAS (T12 §7.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado TEN-001 tiene cargado el factor de noviembre y TEN-002 no
- Cuando TEN-002 calcula su lote de gas
- Entonces TEN-002 no usa el factor de TEN-001; sus cuentas de gas quedan excluidas con `TAR-E-GAS-FACTOR` (RN-TAR-035, DEC-085; antes "sus consumos quedan bloqueados por falta de factor").

**CP-SRV-5050 — ESC-SRV-ALU-01. Se da de alta un contrato ELE-RES en la localidad alcanzada**

- Cubre: ESC-SRV-ALU-01; RN-CAT-035; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Regla ELE → ALU en modo `create` con `legalBasis` (ordenanza ficticia 100/2026)
- Cuando Se da de alta un contrato ELE-RES en la localidad alcanzada
- Entonces JOB-CAT-01 crea el contrato ALU con `parentContractId` del ELE y el grupo de facturación por defecto (RN-CAT-035).

**CP-SRV-5051 — ESC-SRV-ALU-02. Se da de alta el ELE**

- Cubre: ESC-SRV-ALU-02; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Regla en modo `propose` (sin fundamento normativo)
- Cuando Se da de alta el ELE
- Entonces Se crea una propuesta pendiente de consentimiento del socio; no se crea el contrato (DEC-023).

**CP-SRV-5052 — ESC-SRV-ALU-03. JOB-CAT-01 lo vuelve a evaluar**

- Cubre: ESC-SRV-ALU-03; RN-CAT-036; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado El evento de alta del ELE se reprocesa por un reintento
- Cuando JOB-CAT-01 lo vuelve a evaluar
- Entonces No se crea un segundo ALU (idempotencia `(eventId, ruleId)`; RN-CAT-036).

**CP-SRV-5053 — ESC-SRV-ALU-04. Se calcula un ELE con 250 kWh**

- Cubre: ESC-SRV-ALU-04; relacionados: ESC-TAR-13; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Regla `tasa_alumbrado` = consumo × 0,85 y beneficio social del 50 %; el socio está inscripto en tarifa social
- Cuando Se calcula un ELE con 250 kWh
- Entonces Tasa ARS 212,50 y bonificación −ARS 106,25, con la referencia entre reglas en la traza (ESC-TAR-13).

**CP-SRV-5054 — ESC-SRV-ALU-05. (error) Se emite la factura de noviembre**

- Cubre: ESC-SRV-ALU-05; RF-FAC-120, RF-FIS-134; T12 §8.7
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado El convenio con el municipio venció el 31-10-2026
- Cuando Se emite la factura de noviembre
- Entonces El ítem de alumbrado queda bloqueado como excepción, y el resto de la factura sigue su curso según la política (RF-FAC-120; RF-FIS-134).

**CP-SRV-5055 — ESC-SRV-ALU-06. El socio paga ARS 5.000**

- Cubre: ESC-SRV-ALU-06; RF-FIS-138; RN-CON-066; T12 §8.7
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Factura de ARS 10.000 con ARS 1.000 de alumbrado de terceros
- Cuando El socio paga ARS 5.000
- Entonces Se imputan ARS 500 al tercero por prorrata; se emite EVT-FIS-16 y M15 registra el pasivo (RF-FIS-138; RN-CON-066).

**CP-SRV-5056 — ESC-SRV-ALU-07. Se aprueba la rendición**

- Cubre: ESC-SRV-ALU-07; RF-FIS-139; T12 §8.7
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Cobros de alumbrado de octubre por ARS 800.000 con comisión del 3 %
- Cuando Se aprueba la rendición
- Entonces Neto a rendir ARS 776.000; EVT-FIS-17 genera la orden de pago en M14 y cancela el pasivo (RF-FIS-139).

**CP-SRV-5057 — ESC-SRV-ALU-08. M10 ejecuta la desconexión**

- Cubre: ESC-SRV-ALU-08; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado Se da de baja el ELE principal
- Cuando M10 ejecuta la desconexión
- Entonces Se emite EVT-TEC-20 y el ALU dependiente se da de baja con el principal (M02 6.C.8).

**CP-SRV-5058 — ESC-SRV-ALU-09. (aislamiento) TEN-002 emite una factura con alumbrado**

- Cubre: ESC-SRV-ALU-09; T12 §8.7
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; configuración de la ficha ALU (T12 §8.2).
- Datos de prueba: Datos ficticios del escenario; tenant TEN-001 (y TEN-002 para aislamiento).
- Dado TEN-001 tiene un convenio vigente con Municipalidad Demo
- Cuando TEN-002 emite una factura con alumbrado
- Entonces TEN-002 no ve ni usa el convenio de TEN-001; sin convenio propio, el ítem queda bloqueado.
