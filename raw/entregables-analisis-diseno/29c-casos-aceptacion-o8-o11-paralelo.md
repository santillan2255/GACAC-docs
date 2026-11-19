# 29c — Casos de prueba de aceptación: olas O8 a O11 y suite de paralelo de LAG

| Campo | Valor |
|---|---|
| Documento | 29c — Casos de prueba de aceptación y criterios por ola (parte 3 de 4) |
| Portada | [`29-criterios-y-casos-aceptacion-por-ola.md`](29-criterios-y-casos-aceptacion-por-ola.md) |
| Artefactos | 9.2 Casos de prueba de aceptación; 9.3 Criterios de aceptación por ola |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Contenido | Sección 2.9 (O8), 2.10 (O9), 2.11 (O10), 2.12 (O11) y sección 3 (suite de paralelo ProCoop frente a GoodApps para LAG) |

Fuera del camino crítico del piloto, las olas O8 a O11 se documentan con sus casos clave en formato de tabla. Cada fila tiene los mismos campos que el formato de la sección 1 de la portada: la columna "Cuando" son los pasos y "Entonces" el resultado esperado. Salvo indicación, el nivel es extremo a extremo en `staging` con datos ficticios del juego canónico y de la sección 18 del anexo citado.

---

## 2.9 O8 — ERP administrativo y contabilidad completa

### 2.9.1 Criterios de aceptación de O8

| ID | Condición de salida de O8 | Fuente |
|---|---|---|
| CS-O8-01 | Circuito completo: solicitud de abastecimiento, cotización, OC, recepción, comprobante del proveedor desde Mis Comprobantes (simulado), control de 3 vías, OP con retenciones como agente, pago por eCheq e Interbanking, conciliación bancaria. | `03` §12.2 |
| CS-O8-02 | Amortización de bienes de uso, importación de una liquidación de sueldos externa, Libro IVA digital y SICORE generados. | `03` §12.2 |
| CS-O8-03 | Cierre contable mensual con balance de sumas y saldos y estados contables. | `03` §12.2; `07` §11.3 |
| CS-O8-04 | Carga k6 de asientos masivos (PRO-O8-15). | `03` §12.8 |
| CS-O8-05 | Los 462 RF de O8 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O8/` y casos P1 de CPA-O8 aprobados. | `03` R20 |

### 2.9.2 Casos de prueba de O8

| ID | Título | Cubre | Precondiciones y datos ficticios | Cuando | Entonces | Prioridad · Tipo |
|---|---|---|---|---|---|---|
| CPA-O8-001 | Compra con recepción parcial y control de 3 vías | CS-O8-01; ESC-CMP-01, ESC-CMP-02, ESC-CMP-03, ESC-CMP-04, ESC-CMP-05, ESC-CMP-09, ESC-CMP-10, ESC-CMP-16 | OC ficticia con 10 unidades; tolerancia de precio 2 %; límite de diferencia de total ARS 0,50 | Se recibe parcialmente y llega la factura del proveedor desde Mis Comprobantes simulado | La OC queda con 4 pendientes y no "received"; 10/6/10 genera excepción; precio 5 % mayor genera excepción de precio; diferencia de ARS 0,60 no se registra; un comprobante duplicado se rechaza; el borrador de Mis Comprobantes sin revisión no impacta libro IVA ni cuenta corriente | P1 · Funcional |
| CPA-O8-002 | Orden de pago con retenciones y pago bancario | CS-O8-01; ESC-CMP-11, ESC-CMP-12, ESC-CMP-13; M06 §17 escenarios 11 y 38; T-TES-12, T-TES-19, T-TES-20, T-TES-21, T-TES-22, T-TES-23, T-TES-31, T-TES-32 | Factura ficticia de ARS 100.000 sujeta a retención; conexión Interbanking simulada | Se emite la OP, se firma y se paga por eCheq o archivo Interbanking | Retención 2.000, neto 98.000 y factura cancelada por 100.000; una OP reintentada genera una sola retención; quien instrumentó no firma; un pago no firmado no se entrega; un archivo generado y no enviado deja la OP sin pagar; 1 rechazo de 10 líneas deja 9 ejecutadas; la consulta de la conexión nunca devuelve el secreto | P1 · Funcional |
| CPA-O8-003 | Valores de terceros y cheques | T-TES-08, T-TES-09, T-TES-10, T-TES-11, T-TES-13, T-TES-14, T-TES-15 | Cheques y liquidaciones de tarjeta ficticios | Se cargan, depositan, rechazan y presentan | Un cheque duplicado se rechaza; un cheque rechazado avisa a cuenta corriente y baja la disponibilidad; una liquidación de tarjeta que no cuadra se rechaza salvo diferencia explicada; una retención presentada dos veces en paralelo se rechaza una | P2 · Funcional |
| CPA-O8-004 | Valorización de stock y amortización de bienes de uso | CS-O8-02; ESC-STK-20, ESC-STK-21, ESC-STK-22, ESC-STK-28, ESC-STK-29, ESC-STK-30; ESC-CON-17 | 10 u. a ARS 100 más 10 u. a ARS 120; bien de uso de CU-STK-12 | Se valoriza y se corre la amortización de marzo y abril | Costo promedio ARS 110 y salida de 5 a ARS 550; amortización de marzo ARS 10.322,58 y abril ARS 20.000; revertir abril devuelve los acumulados a marzo; un ajuste sobre el umbral queda pendiente sin afectar saldos | P1 · Funcional |
| CPA-O8-005 | Importación de una liquidación de sueldos externa | CS-O8-02; ESC-SUE-09, ESC-SUE-10; CU-28 | Archivo externo ficticio de un período | Se importa dos veces y luego un archivo cuyo total no coincide | La segunda importación se rechaza "ya importado" sin asiento nuevo; el archivo con total distinto queda "rejected" con la diferencia | P1 · Funcional |
| CPA-O8-006 | Libro IVA digital y SICORE | CS-O8-02; M06 §17 escenarios 13, 14, 15, 17 | Período fiscal ficticio cerrado | Se genera el libro y la declaración de retenciones | Se incluyen todas las percepciones; un hueco de numeración se informa completo; la conciliación compara todas las alícuotas; una declaración generada sin acuse nunca queda "submitted" | P1 · Funcional |
| CPA-O8-007 | Cierre contable mensual | CS-O8-03; ESC-CON-14, ESC-CON-15, ESC-CON-16 | Período ficticio con todos los eventos contabilizados | Se cierra el mes y se emiten balance y estados | El cierre se completa con sumas y saldos balanceados; una reapertura sin segundo aprobador queda pendiente; un modelo de distribución que no suma 100 % se rechaza | P1 · Funcional |
| CPA-O8-008 | Compra mayorista de energía y pérdidas (parte administrativa de LAG) | ESC-CMP-21, ESC-CMP-22, ESC-CMP-23; ESC-CON-23; ESC-MED-37 | Factura mayorista ficticia por 100.000 kWh en FR-DEMO-01; M03 midió 98.000 kWh; tolerancia 1 % | Se registra la factura y se aprueba el balance del período | Excepción "meteringMismatch" por 2.000 kWh con pago bloqueado; pérdida de 9.000 kWh (9 %) sin recargo a usuarios; asiento al costo de energía sin ingreso | P2 · Funcional |
| CPA-O8-009 | Permisos, segregación y aislamiento de compras y tesorería | ESC-CMP-06, ESC-CMP-07, ESC-CMP-08, ESC-CMP-17; ESC-CON-21; T-TES-16, T-TES-17, T-TES-18, T-TES-24 | Proveedor del portal de TEN-001 con el mismo CUIT en TEN-002 | Consulta una OC de TEN-002 e intenta operaciones fuera de banda | 404 para la OC ajena; una SA no aprobada no se procesa; la aprobación masiva sin banda se rechaza por documento; un token externo de saldos no lee asientos; un pago sobre el tope de caja se rechaza | P1 · No funcional (seguridad) |
| CPA-O8-010 | Flujo de fondos y liquidez | T-TES-38, T-TES-39, T-TES-45 | Previsión mensual ficticia de 10.000 de enero a marzo | Se proyecta y se simula un escenario | La previsión aparece tres veces; el escenario de liquidez no crea movimientos; cancelar una OC libera el compromiso sin inventar ingresos | P3 · Funcional |
| CPA-O8-011 | Carga de asientos masivos | CS-O8-04; RNF-NFR-145 | Volumen sintético de eventos contables | Corre la contabilización masiva de PRO-O8-15 | Se cumplen las metas de T08 aplicables | P2 · No funcional (rendimiento) |

---

## 2.10 O9 — Personal y sueldos

### 2.10.1 Criterios de aceptación de O9

| ID | Condición de salida de O9 | Fuente |
|---|---|---|
| CS-O9-01 | Dos períodos liquidados en paralelo con la importación externa, con diferencias explicadas. | `03` §13.2 |
| CS-O9-02 | F.931 y LSD generados y válidos; recibos firmados y publicados en el portal del empleado. | `03` §13.2 |
| CS-O9-03 | Pago de haberes por tesorería y asiento contable generado. | `03` §13.2 |
| CS-O9-04 | Carga de liquidación de 500 empleados (PRO-O9-09). | `03` §13.8 |
| CS-O9-05 | Los 163 RF de O9 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O9/` y casos P1 de CPA-O9 aprobados. | `03` R20 |

### 2.10.2 Casos de prueba de O9

| ID | Título | Cubre | Precondiciones y datos ficticios | Cuando | Entonces | Prioridad · Tipo |
|---|---|---|---|---|---|---|
| CPA-O9-001 | Dos períodos en paralelo con la liquidación externa | CS-O9-01; ESC-SUE-08, ESC-SUE-30; DEC-058 | EMP-01 «Cooperativa Ejemplo A Ltda.» (M16 §18) con 18 legajos ficticios; importación externa de los dos períodos | Se liquidan en GoodApps los dos períodos y se comparan con la importación externa | Las diferencias quedan explicadas; la conciliación de SICOSS contra liquidación y asiento da diferencia 0 por subsistema; registrar una liquidación propia y una externa del mismo período rechaza la segunda (ver OBS-25-13) | P1 · Paralelo |
| CPA-O9-002 | F.931, LSD y recibos firmados en el portal | CS-O9-02; ESC-SUE-22, ESC-SUE-24, ESC-SUE-25 | Período ficticio aprobado | Se generan F.931 y LSD, se firman los recibos y se publican | Los archivos validan; una rectificativa anula y conserva el original con LSD rectificativo; el empleado A no obtiene el recibo de B (404); el cambio de ámbito socio → empleado recalcula permisos y caché | P1 · Funcional |
| CPA-O9-003 | Pago de haberes y asiento | CS-O9-03; ESC-SUE-03, ESC-SUE-06; T-TES-40 | Lote de haberes aprobado | Se solicita el pago a tesorería y se reintenta con la misma clave | Una sola solicitud de pago; el aprobador no ejecuta el pago (403); el tesorero sin permiso de detalle ve solo totales; se genera el asiento | P1 · Funcional |
| CPA-O9-004 | Segregación y datos sensibles | ESC-SUE-01, ESC-SUE-02, ESC-SUE-04, ESC-SUE-05, ESC-SUE-27, ESC-SUE-28 | Liquidador y aprobador ficticios | Se intenta aprobar la propia liquidación y ver datos de embargos | 403 por separación de funciones; el aprobador incluido en el lote no aprueba su recibo; sin permiso no se ven juzgado ni expediente; la IA del editor de fórmulas no recibe nombres, CUIL ni importes reales; los ambientes de prueba no tienen datos reales | P1 · No funcional (seguridad) |
| CPA-O9-005 | Conjunto dorado de cálculo de haberes | ESC-SUE-13, ESC-SUE-14, ESC-SUE-15, ESC-SUE-16, ESC-SUE-17, ESC-SUE-18, ESC-SUE-19, ESC-SUE-20, ESC-SUE-21 | Legajos ficticios de cada escenario | Se calculan licencias, vacaciones, SAC, indemnización, embargo y Ganancias | Cada caso da exactamente el resultado esperado de M16 §17 (por ejemplo, vacaciones con 12 años de antigüedad: 28 días corridos) | P1 · Funcional (regresión de cálculo) |
| CPA-O9-006 | Reanudación, versiones y período cerrado | ESC-SUE-07, ESC-SUE-11, ESC-SUE-12, ESC-SUE-23, ESC-SUE-26, ESC-SUE-29 | Job de cálculo de 18 empleados | El job cae en el empleado 9 y se reanuda | Continúa desde el 10 sin duplicar recibos; una versión sin simulación no se publica; una escala retroactiva sugiere complementaria sin cambiar recibos emitidos; un período cerrado no admite novedades | P2 · Funcional |
| CPA-O9-007 | Carga de liquidación de 500 empleados | CS-O9-04; RNF-NFR-145 | 500 legajos sintéticos | Corre la liquidación completa | Se cumplen las metas de T08 aplicables | P2 · No funcional (rendimiento) |

---

## 2.11 O10 — Institucional, servicios sociales, flota, telefonía, TV, fabricación y turnero

### 2.11.1 Criterios de aceptación de O10

| ID | Condición de salida de O10 | Fuente |
|---|---|---|
| CS-O10-01 | Asamblea con padrón, acreditación, voto presencial y remoto y acta. | `03` §14.2 |
| CS-O10-02 | Distribución de excedentes con su asiento. | `03` §14.2 |
| CS-O10-03 | Sepelio con verificación de cobertura; plan de vivienda que factura cuotas. | `03` §14.2 |
| CS-O10-04 | Turno sacado en tótem y atendido por el turnero. | `03` §14.2 |
| CS-O10-05 | Línea telefónica con llamadas tasadas y facturadas. | `03` §14.2 |
| CS-O10-06 | Huecos de §14.9 del plan resueltos en su parte institucional. | `03` §14.9 |
| CS-O10-07 | Carga de votación remota con 2.000 asociados (PRO-O10-14). | `03` §14.8 |
| CS-O10-08 | Los 383 RF de O10 en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O10/` y casos P1 de CPA-O10 aprobados. | `03` R20 |

### 2.11.2 Casos de prueba de O10

| ID | Título | Cubre | Precondiciones y datos ficticios | Cuando | Entonces | Prioridad · Tipo |
|---|---|---|---|---|---|---|
| CPA-O10-001 | Asamblea ordinaria completa | CS-O10-01; ESC-INS-08, ESC-INS-09, ESC-INS-10, ESC-INS-11, ESC-INS-12, ESC-INS-13, ESC-INS-20 | Asamblea ficticia con padrón de asociados ficticios de TEN-001 | Se convoca, se genera el padrón, se acredita (incluso sin conexión), se vota y se firma el acta | Una convocatoria con menos días que PRM-INS-033 se bloquea; el padrón se versiona y lista excluidos con motivo; 50 acreditaciones sin conexión se sincronizan sin duplicar; la votación secreta no guarda votos nominales; el acta firmada no se edita; una reunión reservada da 403 a quien no tiene permiso | P1 · Funcional |
| CPA-O10-002 | Distribución de excedentes con asiento | CS-O10-02; ESC-INS-17 | Ejercicio ficticio con excedente aprobado | Se distribuye y se contabiliza | Se genera el asiento; un movimiento con error contable aparece en la conciliación con la acción "reintentar" | P1 · Funcional |
| CPA-O10-003 | Sepelio con verificación de cobertura | CS-O10-03; ESC-SOC-01, ESC-SOC-02, ESC-SOC-24; ESC-T12-SEP-01, ESC-T12-SEP-02, ESC-T12-SEP-03, ESC-T12-SEP-05, ESC-T12-SEP-06; ESC-MOR-56, ESC-MOR-61 | Contrato SOC-FAM de Ana Demo con 3 adherentes y franquicia de 2 | Se calcula el período y se solicita un sepelio | Se cobra el grupo más 1 adherente excedente; un alta con carencia de 90 días da "notCovered" con opción de excepción; un adherente fallecido queda "ended"; con 3 cuotas impagas la cobertura se suspende una sola vez y se restituye al pagar | P1 · Funcional |
| CPA-O10-004 | Plan de vivienda que factura cuotas | CS-O10-03; ESC-SOC-13, ESC-SOC-15, ESC-SOC-16, ESC-SOC-17; ESC-T12-VIV-01 a ESC-T12-VIV-07 | "Dúplex 2D" ficticio a ARS 40.000.000, adjudicada, mínimo 1 % y 99,5 % facturado | M04 calcula la cuota y luego se anula una factura | El aporte es 0,5 % = ARS 200.000; anular baja el porcentaje facturado una sola vez; un segundo plan se rechaza; quien cargó el progreso no aprueba el certificado; se usa el precio vigente del período facturado | P1 · Funcional |
| CPA-O10-005 | Turno en tótem atendido por turnero | CS-O10-04; ESC-CRM-17, ESC-CRM-18; NEG-CRM-06; TEN-CRM-06; PR-POR-33 | Sucursal ficticia con tótem y dos boxes de Caja | Un socio saca turno y dos boxes llaman al siguiente a la vez | Cada box recibe un turno distinto; un box abierto por otro usuario no se puede abrir; una recepcionista no abre boxes de áreas no asignadas; la pantalla solo lee su sucursal | P1 · Funcional |
| CPA-O10-006 | Línea telefónica tasada y facturada | CS-O10-05; ESC-SRV-TEL-01 a ESC-SRV-TEL-07; ESC-TAR-28; ESC-TEC-21; ESC-MOR-51 | Línea ficticia 0000-400101; `cdr-demo.csv`; banda A ARS 10/min y B ARS 5/min | Se importa el CDR, se tasa y se emite el ciclo | Una llamada de 23:50 a 00:20 da ARS 200 en dos tramos; reimportar el mismo CDR informa 50 duplicadas sin tasar dos veces; un origen sin línea queda "origen no encontrado"; un número dado de baja queda en cuarentena; un CDR de TEN-002 nunca se atribuye a TEN-001; en mora la línea queda con salientes restringidas y emergencias habilitadas | P1 · Funcional |
| CPA-O10-007 | Televisión con decodificador en comodato | ESC-SRV-TV-01 a ESC-SRV-TV-06; ESC-MOR-52 | TV-BAS ficticio ARS 12.000 e instalación ARS 6.000; DECO-DEMO-0001 | Se activa, se agrega un punto, se suspende por mora y se pide la baja | Primer comprobante ARS 18.000; con punto adicional ARS 14.000; un rechazo del CAS no activa ni factura; tras el pago se reconecta sin cargo; la baja genera OT de retiro sin cargo automático; en mora queda la grilla mínima | P2 · Funcional |
| CPA-O10-008 | Registro de asociados y capital | ESC-INS-01, ESC-INS-02, ESC-INS-06, ESC-INS-07, ESC-INS-14, ESC-INS-15, ESC-INS-16, ESC-INS-18, ESC-INS-19, ESC-INS-21; ESC-T12-CAP-06, ESC-T12-CAP-07 | Asociados y capital ficticios de TEN-001 | Se aprueban altas concurrentes, rescates y ajustes | Números de asociado consecutivos sin reutilizar; la baja de un servicio no es egreso; ajustes en período de capital cerrado se rechazan; rescates sobre el límite anual quedan en cola; quien registró un rescate no lo aprueba; un usuario de TEN-002 recibe 404 | P2 · Funcional |
| CPA-O10-009 | Cementerio, banco de sangre y traslados | ESC-SOC-05, ESC-SOC-06, ESC-SOC-07, ESC-SOC-08, ESC-SOC-09, ESC-SOC-10, ESC-SOC-11, ESC-SOC-12, ESC-SOC-14, ESC-SOC-18, ESC-SOC-22; ESC-T12-CEM-01 a ESC-T12-CEM-06; ESC-T12-SAN-01 a ESC-T12-SAN-06; ESC-T12-SAL-01 a ESC-T12-SAL-06; ESC-TAR-34, ESC-TAR-35; ESC-MOR-57 | PAR-DEMO-001 en "Parque Demo"; CONV-SAN-DEMO; AMB-01 con seguro vencido | Se reservan parcelas, se registran actos, se cierran solicitudes de sangre y se asignan traslados | Una de dos reservas simultáneas se rechaza; un acto sin autorización se rechaza; la mora de cementerio no corta otros servicios; la solicitud de sangre no genera comprobante al paciente ni guarda datos clínicos; un vehículo no apto no se asigna; un traslado de emergencia se deriva sin agenda; derecho de sepultura en cuotas de ARS 10.000 | P2 · Funcional |
| CPA-O10-010 | Carga de votación remota | CS-O10-07; RNF-NFR-145 | 2.000 asociados sintéticos habilitados | Votan en simultáneo durante la ventana | Se cumplen las metas de T08 y cada asociado vota una sola vez | P1 · No funcional (rendimiento) |

---

## 2.12 O11 — BI, APIs de terceros, migración repetible y corte administrativo (DEC-089; antes "paralelo y corte")

### 2.12.1 Criterios de aceptación de O11

| ID | Condición de salida de O11 | Fuente |
|---|---|---|
| CS-O11-01 | La migración completa se ejecuta dos veces sobre la copia anonimizada con el mismo resultado. | `03` §15.2 |
| CS-O11-02 | Paralelo con diferencias explicadas. Para LAG rige la suite de la sección 3, ejecutada después de O7 con dos ciclos consecutivos por servicio (DEC-089; T07 §17.4). En O11 solo aplica a los servicios que sigan en ProCoop (`03` §15.2 vigente). | `03` §15.2; DEC-089 |
| CS-O11-03 | Ensayo de corte comercial en ventana con conciliación y rollback probado para los servicios que sigan en ProCoop (electricidad, gas y prepago de LAG ya se cortaron al cerrar O7, CS-O7 y suite de la sección 3); ensayo de corte administrativo con balance conciliado y rollback probado (DEC-089). | `03` §15.2; DEC-068 |
| CS-O11-04 | Un tercero consume la API pública con clave y cuota medida; el exceso devuelve 429 con detalle RFC 9457. | `03` §15.2 |
| CS-O11-05 | Regresión e2e completa de todas las olas y carga completa (carga obligatoria en O11; capacidad del tenant grande). | `07` §11.3; RNF-NFR-024 |
| CS-O11-06 | Los 65 RF de O11 (DEC-089; antes 90) en `Implementado` o `Parcial`, `trace:check` sin faltantes, evidencia en `docs/evidencias/O11/` y casos P1 de CPA-O11 aprobados. | `03` R20 |

### 2.12.2 Casos de prueba de O11

| ID | Título | Cubre | Precondiciones y datos ficticios | Cuando | Entonces | Prioridad · Tipo |
|---|---|---|---|---|---|---|
| CPA-O11-001 | Migración completa repetible | CS-O11-01; T07 §17.1 (los 8 criterios transversales); ESC-MIG-01 (regresión); RF-MIG-043 | Copia anonimizada en el ambiente aislado de migración | Se ejecuta la migración completa dos veces desde cero | Ambas corridas dan los mismos conteos, sumas de control y `legacyIdMap`; 0 errores bloqueantes; reproceso sin duplicados | P1 · Funcional |
| CPA-O11-002 | Conciliación y muestreo por dominio | T07 §17.2 (todas las filas por dominio) | Corrida de CPA-O11-001 | Se ejecutan conciliaciones y muestreos de cada dominio (por ejemplo 50 fichas, 100 facturas, 100 cuentas, 30 convenios, 30 equipos) | Cada dominio cumple su criterio de T07 §17.2 y las conciliaciones quedan aprobadas por su responsable funcional | P1 · Funcional |
| CPA-O11-003 | Ensayo de corte comercial con rollback (servicios que sigan en ProCoop; para electricidad, gas y prepago de LAG se ejecuta al cerrar O7 con PRO-O7-10, DEC-089) | CS-O11-03; CU-MIG-10, CU-MIG-11; RF-MIG-086, RF-MIG-087, RF-MIG-088, RF-MIG-089; GO-03 de `08` | Runbook de 14 pasos de T07 §9.9; copia anonimizada | Se ejecuta el corte en una ventana cronometrada y luego el rollback antes de `rollbackDeadline` | El corte cumple la ventana con conciliaciones aprobadas; el rollback reabre ProCoop para el alcance y exporta el `rollbackJournal` en formatos importables | P1 · Funcional |
| CPA-O11-004 | Rollback bloqueado después de la primera emisión fiscal | ESC-MIG-09 | Ensayo con una emisión fiscal posterior al corte | Se intenta restaurar una copia previa | Se rechaza: solo hay "rollback hacia adelante" y nunca se deshace un hecho fiscal o un cobro externo | P1 · Funcional |
| CPA-O11-005 | Ensayo de corte administrativo | CS-O11-03; RF-MIG-057; GO-24 de `08` | Dominios administrativos cargados en la copia | Se ejecuta el corte administrativo | Balance de sumas y saldos conciliado con ProCoop al corte; saldo de apertura = cierre ProCoop | P1 · Funcional |
| CPA-O11-006 | Histórico en el portal y archivo | CU-MIG-13, CU-MIG-14; RF-MIG-061, RF-MIG-063, RF-MIG-064; ESC-COB-E05 | Histórico tipado y archivo de la copia | El socio consulta su histórico y un operador pide el detalle de una rendición de hace 40 meses | El portal muestra el histórico de solo lectura; el recibo y el PDF están en línea y el detalle de líneas se consulta en diferido con aviso | P2 · Funcional |
| CPA-O11-007 | API de terceros con clave y cuota | CS-O11-04; ESC-BIA-24, ESC-BIA-25, ESC-BIA-26, ESC-BIA-27, ESC-BIA-28, ESC-BIA-29, ESC-BIA-37 | Cliente de API ficticio con clave y cuota | El tercero consume la API y supera la cuota | 429 con `Retry-After` y cabeceras de cuota; el incremental no pierde registros; un webhook alterado se rechaza; una URL privada se rechaza; `/api/admin` no se degrada más de 10 % a 200 rps; con el tenant suspendido la API responde 403 | P1 · Funcional |
| CPA-O11-008 | Reportes y BI certificados | ESC-BIA-05, ESC-BIA-06, ESC-BIA-07, ESC-BIA-08, ESC-BIA-09, ESC-BIA-10, ESC-BIA-11, ESC-BIA-18, ESC-BIA-19, ESC-BIA-20, ESC-BIA-21, ESC-BIA-32, ESC-BIA-38 | Tableros y KPI ficticios de TEN-001 y TEN-002 | Se ejecutan reportes, tableros y la reconciliación operativo frente a analítico | Totales sin duplicar; simulaciones marcadas; sin cruce entre tenants; "sin datos" en lugar de 0; 0 diferencias en la reconciliación; datos sensibles enmascarados sin permiso | P2 · Funcional |
| CPA-O11-009 | Modo pasarela fiscal | M06 §17 escenario 20 | Comprobante ya autorizado reenviado por la pasarela | Se reenvía | Devuelve el CAE existente sin reemplazarlo | P2 · Funcional |
| CPA-O11-010 | Versiones migradas sin reescritura | Fila "ESC-01..05" de T07 §17.3 aplicada a ESC-05 | Tarifas y comprobantes migrados | Se refactura un período con una versión migrada | No se reescriben comprobantes ni promociones ya emitidos | P2 · Funcional |
| CPA-O11-011 | Regresión final y carga completa | CS-O11-05; RNF-NFR-024, RNF-NFR-145 | Versión candidata final en `staging` | Corre la suite e2e completa y la carga de todas las olas | Todo verde y metas de T08 cumplidas | P1 · Regresión |

---

## 3. Suite de paralelo ProCoop frente a GoodApps para LAG

### 3.1 Alcance, momento y criterio de aprobación

| Aspecto | Definición | Fuente |
|---|---|---|
| Cooperativa | Laguna Larga (LAG), piloto de migración | DEC-088 |
| Servicios | Electricidad (ELE), gas (GAS) y prepago; el by-pass de facturación es por servicio | DEC-089; T07 §9.6 punto 10 |
| Momento | Después del cierre de O7, en la etapa E1 (paralelo comercial): ProCoop sigue siendo el sistema de registro de todos los dominios y GoodApps simula | DEC-089; T07 §9.7 |
| Ensayo previo | Etapa E0 con copia anonimizada en el ambiente aislado de migración (AC-16 a AC-19 de `07`) | `07` §15.2; `08` fase 3 |
| Datos | En E1 se usan los datos del tenant de LAG con el delta diario desde ProCoop; este documento solo contiene ejemplos ficticios y ninguna evidencia transcribe datos personales | `07` §15.2; T07 §9.10 |
| Simulación | Sin CAE, sin numeración fiscal, sin publicación a entes y sin notificaciones a socios | RN-MIG-030; T07 §9.6 punto 3 |
| Aprobación por servicio | Coincidencia factura por factura (cantidades, importes por concepto, impuestos, vencimientos) dentro de la tolerancia; 100 % de las diferencias explicadas y clasificadas; ciclos consecutivos aprobados según PRM-MIG-041 (2 por defecto); diferencias sin explicar = PRM-MIG-042 (0); emparejamiento ≥ 99,9 %; mora, cobranzas imputadas y asientos simulados conciliados | T07 §17.4; AC-20 de `07` |
| Tolerancia | ≤ ARS 0,01 por documento (PRM-MIG-040); cobranza por día y saldos por cuenta con tolerancia 0 | RN-MIG-040; ESC-COB-L05 |
| Salida | Paralelo aprobado por servicio: condición GO-02 y GO-26 del checklist de puesta en marcha para el corte comercial (E2) | `08` §6 |

Identificación: los casos de esta suite usan el bloque CPA-O7-101 a CPA-O7-114, porque DEC-089 los vuelve ejecutables al cerrar O7. Las capacidades que prueban (RF-MIG-070 a RF-MIG-076 y RF-MIG-080 a RF-MIG-089) se construyen en O7, en PRO-O7-11 y PRO-O7-12 (`03` §21.7, DEC-089; antes figuraban en O11, OBS-25-01, ya resuelta).

### 3.2 Casos de la suite de paralelo

#### CPA-O7-101 — Preparación del paralelo y delta diario

| Campo | Valor |
|---|---|
| Cubre | T07 §9.6 puntos 1 y 2; RF-MIG-081; T07 §17.2 (dominios PER, SUM, MED, TAR, FIS y FAC conciliados) |
| Precondiciones | Cargadores de O1 a O7 ejecutados para LAG; grupos de facturación migrados (FAC-012); cuadros vigentes del período. |
| Datos ficticios | Ejemplo: 12.500 cuentas activas en origen (CU-MIG-05). |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-101 el paralelo arranca con los dominios base conciliados
  Dado los dominios de personas, suministros, medición, tarifas, fiscal y facturación conciliados
  Cuando corre el delta diario de ProCoop hacia GoodApps
  Entonces las novedades de padrón y las lecturas del período quedan cargadas con su manifiesto y hash
  Y un delta repetido no duplica registros
```

#### CPA-O7-102 — Simulación del ciclo sin efectos externos

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-070; RN-MIG-030; T07 §9.6 punto 3; ESC-03 de T09 §17.4 |
| Precondiciones | CPA-O7-101 aprobado. |
| Datos ficticios | Ciclo ficticio de ELE del período 11/2026. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-102 simular sin tocar el mundo real
  Dado el ciclo de electricidad del período
  Cuando se ejecuta el lote en modo simulación
  Entonces no se pide CAE ni se asigna numeración fiscal
  Y no se publica deuda a entes ni se envían comprobantes o avisos a socios
  Y los comprobantes simulados quedan marcados como simulación
```

#### CPA-O7-103 — Importación de lo emitido por ProCoop y emparejamiento

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-071; T07 §9.6 puntos 4 y 5; T07 §17.4 (emparejamiento ≥ 99,9 %) |
| Precondiciones | Lote simulado (CPA-O7-102). |
| Datos ficticios | Ejemplo de CU-MIG-05: 12.500 en origen, 12.430 emparejadas, 50 con diferencia y 20 sin par. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-103 emparejar comprobantes por cuenta, servicio y período
  Dado lo emitido por ProCoop en el período importado
  Cuando se empareja por cuenta, servicio, período y grupo
  Entonces el tablero informa emparejados, con diferencia y sin par
  Y los comprobantes manuales de ProCoop se comparan solo si tienen equivalente
  Y el ciclo no se aprueba si el emparejamiento es menor al 99,9 %
```

#### CPA-O7-104 — Comparación factura por factura de electricidad

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-072; T07 §9.6 punto 6; T07 §17.4 (coincidencia por factura); RN-MIG-040 |
| Precondiciones | Emparejamiento aprobado (CPA-O7-103). |
| Datos ficticios | Factura ficticia ELE emparejada con diferencia de ARS 0,01 en un concepto. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-104 comparar cada factura de electricidad
  Dado una factura emparejada
  Cuando se compara
  Entonces se comparan cantidades, importes por concepto, impuestos y vencimientos
  Y una diferencia de ARS 0,01 por documento queda dentro de la tolerancia
  Y una diferencia mayor queda abierta para clasificar
```

#### CPA-O7-105 — Comparación de gas con corrección de volumen

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-072; ESC-TAR-38 (regresión dentro del paralelo); T07 §9.7 (gas desde el día 1) |
| Precondiciones | Ciclo de gas simulado y emparejado; factores del período cargados. |
| Datos ficticios | Factura ficticia GAS con 100 m³ medidos. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-105 comparar cada factura de gas
  Dado una factura de gas emparejada
  Cuando se compara
  Entonces el volumen corregido, la cantidad facturada, los importes por concepto y los impuestos coinciden dentro de la tolerancia
  Y una cuenta excluida por falta de factor figura en el informe con su motivo y no como "sin par" silencioso
```

#### CPA-O7-106 — Comparación del prepago

| Campo | Valor |
|---|---|
| Cubre | T07 §9.8 punto 8; T07 §17.2 (saldo prepago por medidor); RF-MIG-072 |
| Precondiciones | Medidores prepago y saldos migrados; ventas prepagas del período en ProCoop importadas. |
| Datos ficticios | Medidor prepago ficticio MED-PRE-DEMO-01 con saldo de crédito de ejemplo. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-106 el prepago coincide por medidor
  Dado los medidores prepago de LAG
  Cuando se comparan saldos de crédito por medidor y comprobantes de las ventas prepagas del período
  Entonces coinciden dentro de la tolerancia o la diferencia queda clasificada
```

#### CPA-O7-107 — Comprobantes agrupados

| Campo | Valor |
|---|---|
| Cubre | CU-MIG-06; T07 §9.6 punto 6 (subtotal por servicio, FAC-007) |
| Precondiciones | Grupos de facturación de LAG migrados. |
| Datos ficticios | Comprobante agrupado ficticio con ELE y GAS. |
| Prioridad · Tipo | P2 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-107 un comprobante agrupado se compara por servicio
  Dado un comprobante agrupado de ProCoop con electricidad y gas
  Cuando se compara con el simulado
  Entonces se compara el total y además el subtotal por servicio
  Y la reconstrucción "como si se hubiera emitido solo" de cada servicio queda disponible
```

#### CPA-O7-108 — Clasificación obligatoria de cada diferencia

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-073; T07 §8.6, §9.6 punto 7; T07 §17.4 (100 % explicado; PRM-MIG-042) |
| Precondiciones | Diferencias abiertas de CPA-O7-104 a CPA-O7-107. |
| Datos ficticios | 50 diferencias ficticias del ejemplo de CU-MIG-05. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-108 ninguna diferencia queda sin explicar
  Dado 50 diferencias abiertas
  Cuando el responsable las clasifica
  Entonces cada una queda como redondeo, configuración, dato migrado, corrección intencional, defecto de GoodApps o defecto conocido de ProCoop, con responsable
  Y una corrección intencional se documenta una vez como regla y se aplica sola a los casos siguientes
  Y un defecto de GoodApps abre un defecto S1 o S2 según "07" §12.1
  Y el ciclo no se puede aprobar mientras quede alguna diferencia sin explicar
```

#### CPA-O7-109 — Mora, cobranzas imputadas y asientos simulados

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-074; RF-MIG-082; T07 §9.6 punto 8; T07 §17.4 (mora, cobranzas y asientos conciliados); DEC-069 |
| Precondiciones | Cobros e intereses del período en ProCoop importados. |
| Datos ficticios | Cobros ficticios del período con intereses de mora. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-109 lo complementario también concilia
  Dado los cobros del período
  Cuando se comparan intereses de mora, imputación de cobranzas y asientos simulados con los de ProCoop
  Entonces coinciden o las diferencias quedan clasificadas
  Y los asientos de GoodApps son simulados: la contabilidad oficial sigue en ProCoop
```

#### CPA-O7-110 — Cobranza por día y saldos por cuenta

| Campo | Valor |
|---|---|
| Cubre | ESC-COB-L05; AC-20 de `07` |
| Precondiciones | Paralelo en curso con electricidad, gas y prepago. |
| Datos ficticios | Día de cobranza ficticio con cobros por caja, Red Link y SIRO. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-110 la cobranza diaria coincide al peso
  Dado el paralelo de LAG en curso
  Cuando se compara la cobranza de cada día y los saldos por cuenta
  Entonces la suma por día y los saldos por cuenta son iguales con tolerancia 0
```

#### CPA-O7-111 — Tablero del paralelo como evidencia

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-075; GO-02 de `08` |
| Precondiciones | Ciclo comparado y clasificado. |
| Datos ficticios | Ciclo ficticio de electricidad. |
| Prioridad · Tipo | P2 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-111 el tablero respalda la decisión
  Dado un ciclo comparado
  Cuando el responsable exporta el tablero del paralelo
  Entonces el informe muestra emparejamiento, coincidencias, diferencias por clasificación y responsable
  Y queda como evidencia del ciclo sin datos personales transcriptos
```

#### CPA-O7-112 — Aprobación por servicio con dos ciclos consecutivos

| Campo | Valor |
|---|---|
| Cubre | RF-MIG-076; T07 §9.6 punto 9, §17.4 (ciclos consecutivos); PRM-MIG-041; CU-MIG-05; GO-26 de `08`; AC-20 de `07` |
| Precondiciones | CPA-O7-101 a CPA-O7-111 aprobados para el servicio y el ciclo. |
| Datos ficticios | Ciclos ficticios 11/2026 y 12/2026 de electricidad. |
| Prioridad · Tipo | P1 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-112 un servicio se aprueba con dos ciclos seguidos
  Dado el ciclo 11/2026 de electricidad aprobado
  Cuando el ciclo 12/2026 cumple todos los criterios de T07 §17.4
  Entonces el paralelo de electricidad queda aprobado con 2 ciclos consecutivos
  Cuando un ciclo intermedio no cumple
  Entonces el conteo de ciclos consecutivos vuelve a cero
  Y gas y prepago se aprueban con su propio conteo
```

#### CPA-O7-113 — Diferencias por corrección conocida de ProCoop

| Campo | Valor |
|---|---|
| Cubre | ESC-TAR-27 |
| Precondiciones | Lote migrado con un caso afectado por un defecto conocido de ProCoop. |
| Datos ficticios | Caso ficticio con diferencia por corrección conocida. |
| Prioridad · Tipo | P2 · Paralelo |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-113 una corrección conocida se explica sola
  Dado un caso donde GoodApps corrige a propósito un cálculo de ProCoop
  Cuando se compara
  Entonces la diferencia es 0 o queda clasificada como "TAR-W-CORRECTION-KNOWN" con la duda que la origina
```

#### CPA-O7-114 — Segregación y aislamiento durante el paralelo

| Campo | Valor |
|---|---|
| Cubre | T07 §17.1; RN-MIG-041; T07 §9.11 punto 1 |
| Precondiciones | Usuarios de facturación e implementador de LAG. |
| Datos ficticios | Usuarios ficticios `facturacion.lag@ejemplo.test` e `implementador@ejemplo.test`. |
| Prioridad · Tipo | P1 · No funcional (seguridad) |
| Nivel · Ambiente | Aceptación de usuario · tenant de LAG en E1 |

```gherkin
Escenario: CPA-O7-114 el paralelo no mezcla responsabilidades ni tenants
  Dado el ciclo listo para aprobar
  Cuando quien lo ejecutó intenta aprobarlo
  Entonces se rechaza por segregación de funciones
  Y ningún dato del paralelo de LAG es visible desde otro tenant
  Y un servicio con paralelo no aprobado simplemente no se corta: antes del corte no hay rollback
```
