# Casos de prueba de aceptación — M07 COB — Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas y conciliación

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M07-COB-cuenta-corriente-cobranza.md`](../../especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 194 CP de requisitos funcionales, 40 CP de escenarios ESC y 22 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M07 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Auxiliar comercial y saldos (M07 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0001 | RF-COB-001; M07 §5.1; PRO-O5-02 | O5 | Núcleo | integración | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Registrar una obligación por cada servicio dentro de cada comprobante emitido, consumiendo el evento de M05, con servicio, contrato o suministro, período, vencimientos (hasta 4) e importe por vencimiento, y componentes (capital, tributos… | La suma de obligaciones de un comprobante es igual a su total; reprocesar el mismo evento no crea otra obligación (idempotencia por `eventId`). |
| CP-COB-0002 | RF-COB-002; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Registrar movimientos inmutables del auxiliar: débitos (factura, ND, interés, cuota, comisión trasladada, cargo por reversión) y créditos (pago, NC, anticipo, retención, ajuste autorizado), con causa, autor, documento origen, fecha… | Ningún movimiento se edita ni borra; la corrección es un movimiento de reversión vinculado. |
| CP-COB-0003 | RF-COB-003; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Derivar el saldo: saldo de obligación = importe − imputaciones vigentes; saldo de cuenta = obligaciones abiertas − créditos disponibles. Ningún campo de saldo es editable por usuario ni API. | El total no depende de la pantalla o proceso que lo consulte (criterio AGR-011). |
| CP-COB-0004 | RF-COB-004; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Derivar el estado de saldo de cada obligación: Pendiente, Parcialmente cancelada, Cancelada; más los estados informados por M08 (En convenio, Incobrable, Prescripta). | El estado se recalcula al imputar o revertir; no se fija a mano. |
| CP-COB-0005 | RF-COB-005; M07 §5.1; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Consultar movimientos y saldos por titular, cuenta corriente, contrato, servicio y documento, con filtros de vencido/no vencido, servicio, tipo de comprobante y rango de fechas. | La consulta por titular muestra la apertura por servicio también en cuenta unificada. |
| CP-COB-0006 | RF-COB-006; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Mostrar cargos, pagos, ajustes y créditos disponibles, separando capital, intereses, recargos, gastos y tributos. | El detalle de un documento suma su total por componentes. |
| CP-COB-0007 | RF-COB-007; M07 §5.1; PRO-O5-02 | O5 | Estándar | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Consultar el saldo a una fecha histórica, eligiendo la fecha del pago a considerar (fecha de pago, fecha del recibo o fecha de registración). | Deuda a fecha pasada = saldo actual + pagos posteriores a esa fecha, según el tipo elegido. |
| CP-COB-0008 | RF-COB-008; M07 §5.1; PRO-O5-02 | O5 | Estándar | regla | TEN-001 con Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto | Mostrar antigüedad, vencimientos, cobros parciales, acuerdos y acciones de seguimiento de M08 en la vista de cuenta. | Los datos de M08 se muestran por referencia, sin duplicarlos. |
| CP-COB-0009 | RF-COB-009; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Ver el detalle de cada documento: origen, imputaciones, recibos, intenciones de pago en curso, débitos presentados, contracargos y financiaciones que lo incluyen. | Desde la factura se llega a cada recibo y desde cada recibo a la operación de caja. |
| CP-COB-0010 | RF-COB-010; M07 §5.1; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Mostrar los pagos pendientes de confirmación (intención iniciada, transferencia informada, débito presentado) de forma informativa, sin reducir la deuda. | Un pago en estado Pendiente no cambia el saldo ni habilita reconexión. |
| CP-COB-0011 | RF-COB-011; M07 §5.1; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Admitir ajustes solo mediante operación documentada: NC o ND emitida por M05, o ajuste interno autorizado con causa, autor y contrapartida. | Ningún ajuste carece de operación, causa, autor y contrapartida. |
| CP-COB-0012 | RF-COB-012; M07 §5.1; PRO-O5-02 | O5 | Estándar | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Bloquear comprobantes para el cobro, individual o masivamente por filtros, con motivo y vigencia; desbloquear con permiso. Caja, entes, pasarelas y portal respetan el bloqueo. | Un comprobante bloqueado no se publica a entes y su rendición queda observada salvo que el parámetro lo permita. |
| CP-COB-0013 | RF-COB-013; M07 §5.1; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Aplicar en el cobro las notas de cuenta de M01 con bloqueo de caja (impide cobrar) o mensaje en caja (aviso desmarcable con permiso). | El cajero ve la nota; sin `cob.caja.desmarcarNota` no puede cobrar una cuenta con bloqueo. |
| CP-COB-0014 | RF-COB-014; M07 §5.1; PRO-O5-02 | O5 | Estándar | regla | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Proponer la regularización autorizada de comprobantes de importe cero no marcados como pagos y de pares débito/crédito internos que se compensan (misma cuenta, fecha, total, saldo, vencimiento y tipo). | La propuesta no se aplica sin aprobación y genera movimientos trazables. |
| CP-COB-0015 | RF-COB-015; M07 §5.1; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Conciliar el auxiliar con la contabilidad (M15) por cuenta contable de créditos por servicios y por servicio, con diferencias explicadas. | El saldo del auxiliar a una fecha es igual al saldo contable de las cuentas de créditos, o la diferencia figura con causa. |
| CP-COB-0016 | RF-COB-016; M07 §5.1; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Verificar diariamente la integridad: obligaciones − imputaciones = saldos proyectados; recibo = suma de ítems; operación = suma de medios; cada medio = su registro. | El job JOB-COB-14 reporta cero diferencias o abre una excepción por cada una. |
| CP-COB-0017 | RF-COB-017; M07 §5.1; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Mostrar datos extra de la cuenta en consulta y caja: adhesión a débito, servicio desconectado o pendiente de desconexión, teléfono, medidor y domicilio. | La ficha de caja muestra los indicadores sin abrir otra pantalla. |
| CP-COB-0018 | RF-COB-018; RN-COB-155; M07 §5.1; PRO-O5-02 | O5 | Estándar | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Avisar si el titular tiene deuda vencida en otras cuentas al cobrar una de ellas, incluidas las de otras entidades jurídicas (DEC-087). La deuda previa asociada al domicilio o al suministro de otro titular se muestra como advertencia con… | El aviso aparece cuando el parámetro está activo; no impide cobrar. |
| CP-COB-0019 | RF-COB-019; M07 §5.1; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con Tercero: TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50 | Llevar los componentes por cuenta de terceros (tasas) con saldo propio dentro de la obligación, para rendirlos al tercero (M06). | El cobro parcial respeta la prioridad configurada y el importe del tercero cobrado se informa a M06. |
| CP-COB-0020 | RF-COB-020; M07 §5.1; PRO-O5-02 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Excluir de caja y consulta los comprobantes pasados N días del segundo vencimiento, cuando el tenant lo configure. | Con N configurado, el comprobante deja de ofrecerse y se informa el motivo. |
| CP-COB-0191 | RF-COB-191; M07 §5.1; PRO-O5-02 | O5 | Estándar | integración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Consultar el historial de la cuenta corriente con **consulta diferida** para el detalle de más de 36 meses (DEC-087, PA-DAT-02): obligaciones, imputaciones, recibos y sus PDF quedan siempre en línea; el detalle accesorio archivado por… | Un estado de cuenta de 2019 se emite en línea con todos sus recibos; el detalle de líneas de rendición de 2019 se entrega como consulta diferida y no bloquea la caja. |
### 1.2 Cuentas separadas o unificadas, resumen y mínimo de pago (M07 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0021 | RF-COB-021; M07 §5.2; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Configurar la modalidad de cuenta corriente por tenant (separada por servicio o unificada del titular) con excepciones por servicio, cuenta o titular, vigente desde un período. | Dos tenants con modalidades distintas no se afectan; el cambio rige desde un período. |
| CP-COB-0022 | RF-COB-022; M07 §5.2; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | En la cuenta unificada, conservar identidad, saldo y cancelaciones de cada factura y servicio. | El total agrupado es la suma de saldos por servicio; no existe una deuda adicional. |
| CP-COB-0023 | RF-COB-023; M07 §5.2; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Emitir el resumen de cuenta con facturas incluidas, pendiente por servicio, total, vencimientos, mínimo de pago e identificador de pago; el resumen es un documento de presentación, reproducible desde el auxiliar. | Regenerar el resumen no cambia saldos; el resumen no se contabiliza como obligación. |
| CP-COB-0024 | RF-COB-024; M07 §5.2; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Emitir el estado de cuenta descargable (PDF, XLSX) por el socio y por el operador. | El estado de cuenta a una fecha coincide con la consulta de saldo a esa fecha. |
| CP-COB-0025 | RF-COB-025; M07 §5.2; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Un cambio de modalidad no reemite ni fusiona documentos históricos; los resúmenes emitidos se conservan tal como se emitieron y las vistas se recalculan desde el auxiliar. | Tras el cambio, los resúmenes previos se descargan idénticos. |
| CP-COB-0026 | RF-COB-026; M07 §5.2; PRO-O5-02 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Mostrar al socio, en portal, app y API, la apertura por servicio: cuánto corresponde a cada servicio y qué pagó de cada uno. | El socio ve la imputación de cada pago por servicio. |
| CP-COB-0027 | RF-COB-027; M07 §5.2; PRO-O5-02 | O5 | Núcleo | seguridad | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Restringir la agrupación al mismo tenant y al mismo titular. | La API rechaza agrupar cuentas de otro titular u otro tenant. |
| CP-COB-0028 | RF-COB-028; M07 §5.2; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Configurar el mínimo de pago (importe, porcentaje, obligaciones exigibles o fórmula, saldo elegible, exclusiones) e informarlo en el resumen; pagar el mínimo no cancela el resto de la deuda. | El sistema nunca infiere que pagar el mínimo cancela otras obligaciones. |
| CP-COB-0029 | RF-COB-029; M07 §5.2; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Evaluar el cumplimiento del mínimo en cada fecha de evaluación y publicar el resultado para M08, sin ejecutar suspensiones. | El evento `cob.minimumPayment.evaluated` lleva cuenta, mínimo, pagado y obligaciones; COB no cambia estados de servicio. |
| CP-COB-0030 | RF-COB-030; M07 §5.2; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Usar el grupo de facturación de M05 como unidad del resumen agrupado, con su domicilio de reparto, periodicidad y canal de entrega. | El resumen del grupo incluye solo los servicios del grupo vigentes en el período. |
| CP-COB-0192 | RF-COB-192; M07 §5.2; PRO-O5-02 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Mantener **una cuenta corriente por titular y por entidad jurídica** (DEC-087, PA-DAT-01; DEC-064): cada obligación se registra en la cuenta del titular para la entidad emisora del comprobante (`legalEntityId`); la cuenta unificada agrupa… | Un titular con ELE (entidad A) e Internet (entidad B) tiene dos cuentas corrientes; una obligación de B nunca se registra en la cuenta de A; el portal muestra A, B y el total. |
### 1.3 Imputación (M07 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0031 | RF-COB-031; M07 §5.3; PRO-O5-03 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Usar un único motor de imputación para todos los canales (caja, cobrador, ente, débito, pasarela, cupón, crédito interno). | El mismo cobro produce las mismas imputaciones por cualquier canal. |
| CP-COB-0032 | RF-COB-032; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Configurar políticas de imputación versionadas por tenant, servicio y canal: selección explícita, antigüedad (primer o último vencimiento), prioridad de servicio, elección del socio. | Un pago parcial en comprobante agrupado no deja saldos sin asignar y cuadra por servicio. |
| CP-COB-0033 | RF-COB-033; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Dentro de cada obligación, aplicar el pago primero a recargos e intereses (entre vencimientos, mora, financiación) y luego a capital, salvo que la política diga otro orden. | Con recargo ARS 200 y pago ARS 1.000 sobre factura ARS 3.000, capital imputado ARS 800. |
| CP-COB-0034 | RF-COB-034; M07 §5.3; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Validar en caja el orden configurado: más antiguas primero (global o por servicio, contra primer o último vencimiento), deuda notificada completa, cuotas en orden, cupón o talón completo. Cada regla es error o aviso según configuración. | Con la regla activa, saltear una factura más antigua bloquea la confirmación con el mensaje de la regla. |
| CP-COB-0035 | RF-COB-035; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Admitir pago parcial con permiso y política; el importe se reparte completamente según la regla. | Un cobro parcial deja cada peso imputado o como crédito explícito. |
| CP-COB-0036 | RF-COB-036; M07 §5.3; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Registrar pagos a cuenta sin obligación seleccionada, que quedan como saldo a favor del titular y la cuenta. | El pago a cuenta aparece como crédito disponible con su origen. |
| CP-COB-0037 | RF-COB-037; M07 §5.3; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Reasignar imputaciones con autorización: reversa de la imputación original y nueva imputación, ambas trazables. | La reasignación no altera el recibo original y queda con aprobador. |
| CP-COB-0038 | RF-COB-038; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | En cuenta unificada, imputar entre servicios solo según la política vigente o la elección expresa del socio; nunca por inferencia. | Un pago imputado expresamente a agua no reduce internet. |
| CP-COB-0039 | RF-COB-039; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Imputar el cupón de pago único a cada factura incluida con la misma regla de FAC-008. | Pagar el cupón cancela las facturas del cupón según la regla y deja trazado cada ítem. |
| CP-COB-0040 | RF-COB-040; M07 §5.3; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. | Con débitos ≥ créditos, se consumen todos los créditos; el último débito queda parcial solo si cubre recargos. |
| CP-COB-0041 | RF-COB-041; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto | Control de concurrencia: si el saldo cambió entre la consulta y la confirmación, rechazar la operación y recalcular. | Dos cajeros cobrando la misma factura: el segundo recibe conflicto 409 y la deuda actualizada. |
| CP-COB-0042 | RF-COB-042; M07 §5.3; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Explicar cada imputación con la política y versión aplicada, el orden, el componente y el autor. | Desde el recibo se ve por qué cada peso fue a cada obligación. |
### 1.4 Saldos a favor, anticipos, excedentes y cobros no identificados (M07 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0043 | RF-COB-043; M07 §5.4; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Registrar saldos a favor con origen (excedente, anticipo, pago a cuenta, pago duplicado, redondeo, NC, anulación de imputación, reversión, retención en exceso), cuenta, servicio, importe y saldo disponible. | Cada saldo a favor tiene origen y documento vinculado. |
| CP-COB-0044 | RF-COB-044; M07 §5.4; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Ante un excedente, cancelar la obligación y dejar el resto como saldo a favor o pendiente de aplicación según la política aprobada. | ARS 15.000 sobre factura de ARS 13.000: cancelada y ARS 2.000 a favor o pendiente. |
| CP-COB-0045 | RF-COB-045; M07 §5.4; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | No aplicar un excedente ni un saldo a favor a otro titular, conviviente o servicio por inferencia (dirección, nombre parecido, imagen de comprobante). | En ESC-01 la deuda del hermano B no se reduce. |
| CP-COB-0046 | RF-COB-046; M07 §5.4; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Gestionar una bandeja de cobros no identificados con canal, importe, referencia, datos del pagador, evidencia, responsable, antigüedad, identificación y aplicación autorizada. | Ningún cobro no identificado queda sin responsable; la antigüedad se reporta. |
| CP-COB-0047 | RF-COB-047; M07 §5.4; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Exigir para la identificación datos verificables (identificador de pago, cuenta, CUIT/DNI del pagador, referencia bancaria); el nombre, el domicilio o una imagen no bastan. | La API de identificación rechaza aplicar sin al menos un dato verificable o aprobación expresa. |
| CP-COB-0048 | RF-COB-048; M07 §5.4; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Tratar el pago anterior a la factura como anticipo que se aplica al emitirse la obligación según política. | Al emitirse la factura, el anticipo se imputa automáticamente si es aplicable. |
| CP-COB-0049 | RF-COB-049; M07 §5.4; PRO-O5-03 | O5 | Núcleo | integración | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Ante un pago de ente o pasarela sobre un comprobante ya cancelado por otra vía, crear un saldo a favor en la cuenta pagadora, con marca de imputación no automática configurable y visible en el resultado de la importación. | El duplicado no se pierde ni se aplica a otra cuenta; queda listado en el resultado. |
| CP-COB-0050 | RF-COB-050; M07 §5.4; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Crear anticipos manuales con concepto, importe, vencimientos, porcentaje de aplicación parcial, aplicación en facturación futura e imputación no automática. | El anticipo manual genera recibo y saldo a favor; requiere caja abierta si ingresa dinero. |
| CP-COB-0051 | RF-COB-051; M07 §5.4; PRO-O5-03 | O5 | Estándar | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Generar saldo a favor por redondeo en cobros en efectivo cuando el tenant lo habilite, con importe máximo. | No se genera si la cuenta adeuda débitos de redondeo previos. |
| CP-COB-0052 | RF-COB-052; M07 §5.4; PRO-O5-03 | O5 | Estándar | funcional | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Permitir que el saldo a favor se descuente en la próxima factura (M05 lo aplica como crédito al emitir) cuando el tenant lo configure. | La factura siguiente muestra el crédito aplicado y el saldo a favor se consume. |
| CP-COB-0053 | RF-COB-053; M07 §5.4; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Recibir transferencias informadas por el socio o el cajero (con comprobante adjunto) en estado pendiente de verificación hasta que M14 confirme la acreditación o un operador la verifique según el circuito acordado. | Una imagen de comprobante no cancela deuda por sí sola. |
| CP-COB-0054 | RF-COB-054; M07 §5.4; PRO-O5-03 | O5 | Núcleo | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Explicar cada peso recibido como cancelación, crédito o pendiente en un reporte por período y canal. | Recibido = imputado + saldos a favor + no identificados + devoluciones, sin diferencia. |
### 1.5 Caja (M07 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0055 | RF-COB-055; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Administrar cajas (puestos) por sucursal y tipo (ventanilla, virtual de ente, cobrador, canal digital), con caja fija opcional por usuario y número automático. | Las cajas virtuales de entes y canales no se asignan a cajeros. |
| CP-COB-0056 | RF-COB-056; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Abrir la sesión de caja por operador con fondo inicial por moneda y observación. | CU-12: CAJ-01 abierta con ARS 20.000. |
| CP-COB-0057 | RF-COB-057; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Exigir sesión abierta para cobrar, anular o egresar; seleccionar la caja si el usuario tiene varias. | Sin sesión abierta la API responde 409 `cob.caja.sesionCerrada`. |
| CP-COB-0058 | RF-COB-058; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Buscar la deuda por código de barras, identificador de pago, comprobante (tipo, punto de venta, número), cuenta, titular (id, nombre, DNI/CUIT), cupón o QR del socio; elemento de búsqueda por defecto configurable. | La lectura del código de barras de una factura propia la carga en menos de 1 s. |
| CP-COB-0059 | RF-COB-059; M07 §5.5; PRO-O5-04 | O5 | Núcleo | migración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Decodificar todos los formatos de código de barras e identificadores vigentes para el tenant, incluidos los de transición publicados por ProCoop. | Las facturas emitidas por ProCoop antes del corte se cobran en caja GoodApps. |
| CP-COB-0060 | RF-COB-060; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Listar la deuda a cobrar: facturas, cuotas, cupones, saldos a favor (con signo crédito), recargo por vencimiento obtenido de M08, modo de diferir, cuotas y total marcado. | La lista se ordena por vencimiento ascendente; el orden automático se puede quitar si V2 2687. |
| CP-COB-0061 | RF-COB-061; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Mostrar advertencias de tipo error (impiden cobrar) o aviso al seleccionar la cuenta: comprobante bloqueado, nota con bloqueo de caja, nota con mensaje, deuda notificada incompleta, titular notificado, deuda antigua, deuda antigua del… | Cada advertencia muestra la regla y si es bloqueante. |
| CP-COB-0062 | RF-COB-062; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Calcular el recargo invocando a M08 con la fecha de cobro (o fecha de cálculo fija configurada) y permitir cambiar el recargo diario o no cobrarlo con permiso, dejando registro. | Cambiar el recargo sin `cob.caja.cambiarRecargo` es imposible; el cambio queda auditado. |
| CP-COB-0063 | RF-COB-063; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Aplicar el modo de diferimiento del recargo (no diferir, diferir solo mora, diferir todo) según tenant, canal o ente; informar a M08 lo diferido para su ND posterior. En el pago online de una factura vencida el interés se difiere por… | Con "diferir todo", el cobro cancela capital y M08 recibe el recargo diferido. |
| CP-COB-0064 | RF-COB-064; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Cobrar uno o varios documentos, de una o varias cuentas del mismo titular u otros titulares, en una operación. | Una operación con dos cuentas emite un recibo por cuenta (o uno por operación si se configura); si las cuentas son de entidades jurídicas distintas, siempre un recibo por entidad (RF-COB-193, DEC-087). |
| CP-COB-0065 | RF-COB-065; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Combinar medios de pago: efectivo (multimoneda con cotización), cheque de terceros, transferencia, tarjeta de débito o crédito (cupón, autorización, cuotas), QR, retención sufrida y saldo a favor. | La suma de medios es igual al total cobrado más el vuelto. |
| CP-COB-0066 | RF-COB-066; M07 §5.5; PRO-O5-04 | O5 | Estándar | regla | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Calcular vuelto (proporcional, desde el último ingreso o sin vuelto según tenant) y ofrecer donar el vuelto. | Sin vuelto habilitado, un efectivo excedente queda como saldo a favor con aviso. |
| CP-COB-0067 | RF-COB-067; M07 §5.5; PRO-O5-04 | O5 | Estándar | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Aplicar recargo por medio de pago (tarjeta con cuotas, transferencia, valores a fecha) como concepto facturable vía M05 según plan de tarjeta configurado. | El recargo se muestra antes de confirmar y genera su comprobante. |
| CP-COB-0068 | RF-COB-068; M07 §5.5; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. | Dos socios que pagan el mismo importe el mismo día en el mismo puesto se asignan sin ambigüedad. |
| CP-COB-0069 | RF-COB-069; M07 §5.5; PRO-O5-04 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Aplicar descuentos en caja por pronto pago por tipo de factura o servicio y rango de días, sin superposición y con tope 100 %, documentados como bonificación (NC o ítem de M05), opcionalmente solo para socios. La regla vive en… | La caja no modifica precios: el descuento genera su documento. |
| CP-COB-0070 | RF-COB-070; M07 §5.5; PRO-O5-04 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Registrar retenciones sufridas en el cobro (tipo, régimen, número de certificado, fecha, importe, adjunto) como medio que cancela deuda. | La retención se informa a M06 y se presenta con la caja. |
| CP-COB-0071 | RF-COB-071; M07 §5.5; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Cobrar conceptos de conexión u otros cargos en caja (precio vigente, importe bloqueado o editable, situación de IVA por defecto, bonificación por cantidad), con comprobante emitido por M05. | El comprobante se emite y se cobra en la misma operación. |
| CP-COB-0072 | RF-COB-072; M07 §5.5; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Registrar egresos de caja autorizados por pago a proveedor (órdenes de pago de M12/M14), con validación de firmas y marca de entrega. | El egreso reduce el efectivo teórico y queda vinculado a la orden. |
| CP-COB-0073 | RF-COB-073; M07 §5.5; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Recibir donaciones en caja para entidades habilitadas (nunca, siempre o solo con vuelto). | La donación genera su comprobante y no se mezcla con la deuda. |
| CP-COB-0074 | RF-COB-074; M07 §5.5; PRO-O10-13 | O10 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Cobrar cuotas de vivienda, de obras y de otros servicios sociales como obligaciones genéricas de sus módulos. | La caja no tiene lógica propia por servicio social. |
| CP-COB-0075 | RF-COB-075; M07 §5.5; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Ser el punto de cobro de la venta prepaga en caja y portal; el cálculo de consumo, retención a cuenta de deuda y bonificación los resuelve M03, y COB imputa la retención a la deuda. | La venta prepaga produce un recibo y la carga en M03; si falla la carga, la operación se revierte. |
| CP-COB-0076 | RF-COB-076; M07 §5.5; PRO-O5-04 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Solicitar a M05 la factura electrónica posterior al cobro (ND de recargo cobrado, comprobantes generados en caja) y esperar el CAE antes de imprimir cuando el tenant lo configure. | Con espera activa y ARCA caído, la operación queda en estado pendiente fiscal sin perder el cobro. |
| CP-COB-0077 | RF-COB-077; M07 §5.5; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Notificar el pago al socio por email, WhatsApp o SMS con el recibo (vía T09), según tipo de envío configurado. | El recibo llega en menos de 5 minutos en el canal elegido. |
| CP-COB-0078 | RF-COB-078; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Disparar, al confirmar un cobro, la evaluación de reconexión y de cambio de estado de servicios en M08. Por DEC-014, en servicios remotos la reconexión es automática al confirmarse el pago sin deuda vencida del servicio y, si requiere… | COB publica `cob.obligation.settled` y `cob.payment.confirmed`; M08 decide. |
| CP-COB-0079 | RF-COB-079; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático | Anular una operación de cobro con autorización, validaciones y efectos completos mediante reversos (sección 6.6). | La anulación no borra nada: el recibo queda Anulado y los saldos se reponen por movimientos. |
| CP-COB-0080 | RF-COB-080; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Realizar el arqueo: teórico por medio y moneda; contado declarado por medio (efectivo por denominación opcional, cheques, cupones, retenciones, transferencias); diferencia por medio. | CU-12: efectivo esperado ARS 25.000. |
| CP-COB-0081 | RF-COB-081; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) | Registrar diferencias de arqueo con justificación obligatoria y aprobación por encima de un umbral; generar el quebranto de ingreso o egreso. | Una diferencia no se corrige borrando recibos. |
| CP-COB-0082 | RF-COB-082; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Cerrar el turno; permitir cierre de varias sesiones o días si el tenant lo habilita; reabrir (anular el cierre) con permiso solo si tesorería no procesó la rendición. | No se reabre una sesión cuya rendición fue recibida por M14. |
| CP-COB-0083 | RF-COB-083; M07 §5.5; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Establecer límites y permisos por cajero: importe máximo por operación, medios habilitados, anular solo operaciones propias, efectivo máximo en caja. | Superar el límite pide aprobación de supervisor. |
| CP-COB-0084 | RF-COB-084; M07 §5.5; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Mantener trazabilidad recibo ↔ operación ↔ imputación ↔ medios ↔ sesión ↔ rendición a tesorería. | Desde cualquier entidad se navega a las demás. |
| CP-COB-0085 | RF-COB-085; M07 §5.5; PRO-O5-04 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Operar la caja web desde navegador, con lector de código de barras como teclado, impresión de ticket o recibo por el agente local (T06) y pantalla optimizada para teclado. | Un cobro estándar se completa con teclado en no más de 4 pasos. |
### 1.6 Recibos (M07 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0086 | RF-COB-086; M07 §5.6; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Emitir recibo por cuenta corriente (o uno por operación si se configura, nunca mezclando entidades jurídicas: RF-COB-193, DEC-087) de tipo oficial, interno, pago por ente o pago a titular; recibo oficial siempre cuando el tenant lo exija. | Cada recibo lista obligaciones, importe aplicado, saldo previo, recargos separados y medios. |
| CP-COB-0087 | RF-COB-087; RN-FAC-161; M07 §5.6; PRO-O5-04 | O5 | Núcleo | integración | TEN-001 con Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) | Numerar recibos con el servicio de numeración de M05 `fac.service.nextNumber({ legalEntityId, voucherTypeId, pointOfSaleId, idempotencyKey })` (RF-FAC-179, RN-FAC-161; CTR-DAT-74) **por entidad jurídica** del recibo, sin bloqueos globales… | Diez cajas concurrentes no producen números repetidos ni huecos no explicados; un reintento con la misma operación devuelve el mismo número; un punto de venta de otra entidad se rechaza con `POS_CONFLICT`. |
| CP-COB-0088 | RF-COB-088; M07 §5.6; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) | Consultar, reimprimir y reenviar recibos (email, WhatsApp, SMS) con plantilla; cobrar la reimpresión según permiso si el tenant lo define. | La reimpresión queda registrada con usuario y fecha. |
| CP-COB-0089 | RF-COB-089; M07 §5.6; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Generar recibo en PDF y ticket térmico, con QR de validación del recibo. | El QR abre la validación pública del recibo sin datos personales. |
| CP-COB-0090 | RF-COB-090; M07 §5.6; PRO-O5-04 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Imprimir operación de caja en lugar de recibo o sin vista previa según configuración. | La opción se respeta en todos los puestos del tenant. |
| CP-COB-0193 | RF-COB-193; M07 §5.6; PRO-O5-04 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Cobrar en **una sola operación de caja** deuda de varias entidades jurídicas del mismo titular (o de varios titulares), emitiendo **un recibo por entidad jurídica** con la numeración de esa entidad (DEC-087; CTR-DAT-74): los medios de pago… | Cobro de ARS 13.000 (ARS 8.000 ELE entidad A + ARS 5.000 Internet entidad B) con efectivo y tarjeta: dos recibos (A y B) con numeración propia, suma de medios = 13.000; anular la operación anula ambos. |
| CP-COB-0194 | RF-COB-194; M07 §5.6; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Rendir a tesorería (M14) y contabilizar (M15) por entidad jurídica: el cierre de caja y el traspaso a tesorería totalizan por entidad y medio, y la operación multi-entidad genera, si corresponde, la deuda entre entidades por el dinero… | Una caja de la entidad A que cobra ARS 8.000 de A y ARS 5.000 de B informa en el cierre A: 8.000 y B: 5.000, y M15 registra la cuenta entre entidades de ARS 5.000. |
### 1.7 Cobradores y cobranza fuera de oficina (M07 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0091 | RF-COB-091; M07 §5.7; PRO-O5-05 | O5 | Estándar | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Administrar cobradores (persona, zonas, caja virtual propia, límites, medios permitidos, comisión) y generar listas de cobro desde la deuda por zona, ruta o selección. | La lista toma la deuda vigente con recargo calculado a la fecha prevista. |
| CP-COB-0092 | RF-COB-092; M07 §5.7; PRO-O5-05 | O5 | Estándar | integración | TEN-001 con Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto | Cobrar en campo desde la PWA con rol cobrador, sin conexión, con recibo provisorio numerado por dispositivo y sincronización posterior con `clientMutationId` y control de duplicados. | Reenviar la misma mutación no duplica el cobro; un conflicto de saldo queda en bandeja. |
| CP-COB-0093 | RF-COB-093; M07 §5.7; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto | Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. | La rendición no se cierra con diferencias sin justificar. |
| CP-COB-0094 | RF-COB-094; M07 §5.7; PRO-O10-13 | O10 | Estándar | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Liquidar la base de comisión de cobradores por período (importe, porcentaje, mínimo) y enviarla a M16 o M12 para su pago. | La base coincide con lo rendido y confirmado. |
| CP-COB-0095 | RF-COB-095; M07 §5.7; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Habilitar puntos de cobro remotos (kioscos, estaciones) para venta prepaga y cobro de facturas, como cajas remotas con usuario propio. | La caja remota opera con límites y rinde como cobrador. |
| CP-COB-0096 | RF-COB-096; M07 §5.7; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Aplicar las reglas de cobranza remota: recargo por cobranza remota con su concepto, importe máximo por factura, solo efectivo, cajas habilitadas. | El recargo remoto se agrega con su IVA y se informa antes de confirmar. |
| CP-COB-0097 | RF-COB-097; M07 §5.7; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto | Controlar el efectivo máximo en poder del cobrador y bloquear nuevos cobros en efectivo al superarlo hasta rendir. | Superado el tope, la PWA muestra el bloqueo y el motivo. |
### 1.8 Entes recaudadores (M07 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0098 | RF-COB-098; M07 §5.8; PRO-O5-05 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Configurar cada ente como datos: convenio, concepto, caja virtual, cuenta bancaria de acreditación (M14), último vencimiento aceptado, admite entregas, modo de diferir recargo, cobrar al primer vencimiento, mora pasado el último… | Dar de alta un ente nuevo de una familia conocida no requiere desarrollo. |
| CP-COB-0099 | RF-COB-099; M07 §5.8; PRO-O5-05 | O5 | Núcleo | migración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales implícitos, relleno, formatos de fecha incluida juliana, signo, cálculo de totales y contadores) con las familias Red Link (continua y… | Cada familia tiene un archivo de prueba que el motor genera o lee bit a bit igual que ProCoop. |
| CP-COB-0100 | RF-COB-100; M07 §5.8; PRO-O5-05 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Generar un identificador de pago autocontenido y estable por obligación, cupón, cuota, aviso de deuda e intención, con dígito verificador, y entregarlo a M05 para imprimir y a los entes para publicar. | La rendición se resuelve sin depender del importe. |
| CP-COB-0101 | RF-COB-101; M07 §5.8; PRO-O5-05 | O5 | Núcleo | regla | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Exportar la deuda al ente con selección (saldo > 0, sin créditos) y filtros: período, emisión, vencimiento, tipos de comprobante y servicio, empresa de reparto, excluir adheridos a débito, incluir pagados, excluir titulares con deuda… | Una factura con pago parcial se publica por su saldo cuando el layout valida saldo. |
| CP-COB-0102 | RF-COB-102; M07 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Mantener el registro de deuda publicada por ente con índice único por (período, concepto, identificador) para Red Link y SIRO, sin reinformar un comprobante ya publicado salvo actualización. | Reexportar el mismo período no duplica registros en el ente. |
| CP-COB-0103 | RF-COB-103; M07 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Generar el archivo de control adicional cuando el layout lo requiera (Red Link) y nombrar archivos según la regla del layout, sin sobrescribir. | Dos exportaciones el mismo día producen nombres distintos. |
| CP-COB-0104 | RF-COB-104; M07 §5.8; PRO-O5-05 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Generar automáticamente el archivo de deuda tras cada lote de facturación y, en modalidad continua, diariamente con las novedades. | El job se dispara con `fac.billingRun.issued` (EVT-FAC-05) y deja el archivo listo para T06. |
| CP-COB-0105 | RF-COB-105; M07 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Informar la base de deuda por API cuando el ente lo ofrezca (SIRO) y consultar su estado (registros correctos, erróneos, totales). | El resultado de la base queda registrado y los errores por registro son visibles. |
| CP-COB-0106 | RF-COB-106; M07 §5.8; PRO-O5-05 | O5 | Núcleo | integración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Importar la rendición (archivo cargado, SFTP o API) validando convenio, fecha de presentación no futura, cantidad e importe del pie. | Un convenio distinto rechaza el archivo completo con el mensaje del ente. |
| CP-COB-0107 | RF-COB-107; M07 §5.8; PRO-O5-05 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Validar cada registro de rendición: comprobante inexistente o anulado; ya pagado por el mismo ente (informativo) o por otra vía (saldo a favor); pasado el último vencimiento aceptado; importe mayor o menor con tolerancia; entrega mínima… | Cada registro queda con resultado OK, advertencia o error y su motivo. |
| CP-COB-0108 | RF-COB-108; M07 §5.8; PRO-O5-05 | O5 | Núcleo | regla | TEN-001 con Excepciones: Una de cada tipo para la bandeja | Presentar el resultado de la importación como log revisable antes de confirmar; confirmar solo registros OK o seleccionados; los errores pasan a la bandeja de excepciones. | Nada se imputa hasta confirmar; un error no bloquea el resto. |
| CP-COB-0109 | RF-COB-109; M07 §5.8; PRO-O5-05 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Registrar la rendición confirmada en la caja virtual del ente, con medio transferencia por el total a la cuenta del ente, comisión del ente, fecha de cobro y fecha de acreditación o rendición. | La acreditación esperada se publica a M14 por el neto. |
| CP-COB-0110 | RF-COB-110; M07 §5.8; PRO-O5-05 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Impedir reimportar el mismo archivo (huella) y reaplicar un registro ya aplicado. | Subir dos veces el mismo archivo devuelve el resultado de la primera importación. |
| CP-COB-0111 | RF-COB-111; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Importar el archivo de morosidad del ente (Tarjeta Naranja) y emitir su informe. | Valida el comercio contra el convenio del ente. |
| CP-COB-0112 | RF-COB-112; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Importar archivos de novedades de adhesión del ente (alta, baja, modificación) con layout propio. | Las novedades se aplican solo a cuentas del mismo ente o sin ente. |
| CP-COB-0113 | RF-COB-113; M07 §5.8; PRO-O5-05 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Aceptar pagos fuera de término según el ente (sin tope o hasta el vencimiento configurado) con el recargo que corresponda. | Configuración LAG: todos los entes aceptan sin tope. |
| CP-COB-0114 | RF-COB-114; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Facturar al usuario la comisión del ente cuando el ente la traslade (vía M05, concepto configurado). | La comisión trasladada genera su comprobante y se informa al socio. |
| CP-COB-0115 | RF-COB-115; M07 §5.8; PRO-O5-05 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Registrar los rechazos informados por los entes con código y causa, y devolver a deuda lo rechazado. | La obligación rechazada vuelve a Pendiente por movimiento de reversión. |
| CP-COB-0116 | RF-COB-116; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Procesar automáticamente las rendiciones a una hora configurable, con aviso de errores por email al responsable. | El job deja el resultado en estado "pendiente de confirmar" o confirma solo si el ente tiene confirmación automática. |
| CP-COB-0117 | RF-COB-117; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Renombrar o mover el archivo procesado en el origen cuando el canal lo permita. | El archivo procesado no se vuelve a tomar. |
| CP-COB-0118 | RF-COB-118; M07 §5.8; PRO-O5-05 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Soportar entes sin interfaz (cartera de documentos a cobrar) como caja o cartera con registro manual. | El ente sin layout no ofrece exportar ni importar. |
### 1.9 Débito automático (M07 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0119 | RF-COB-119; M07 §5.9; PRO-O5-06 | O5 | Núcleo | seguridad | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Registrar adhesiones (mandatos) por cuenta o servicio: ente o tarjeta, medio (CBU de 22 dígitos validado o tarjeta tokenizada/enmascarada), titular del medio, CUIT del titular del CBU, período desde, fecha de alta, estado. | Un CBU con dígitos verificadores inválidos se rechaza. |
| CP-COB-0120 | RF-COB-120; M07 §5.9; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Dar de alta adhesiones por operador, por el socio en el portal o por API del proveedor (Pagos360), con estados Pendiente de firma, Activa, Cancelada, Error. | La adhesión solo debita cuando está Activa. |
| CP-COB-0121 | RF-COB-121; M07 §5.9; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Excluir del débito tipos de facturación o servicios por cuenta. | Una factura de un tipo excluido no entra en la presentación. |
| CP-COB-0122 | RF-COB-122; M07 §5.9; PRO-O5-06 | O5 | Núcleo | regla | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Generar la presentación por ente con las obligaciones elegibles, fecha de débito y regla de corte (día del vencimiento a partir del cual pasa al mes siguiente). | Con corte 19 y vencimiento día 20, la tarjeta se debita el mes siguiente. |
| CP-COB-0123 | RF-COB-123; M07 §5.9; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Importar la rendición de débitos: aceptados se registran como cobro; rechazados con código (R08, R09, R10 y los del ente) vuelven a deuda visible y se notifica al socio. | La obligación rechazada no queda como cobrada en ningún reporte. |
| CP-COB-0124 | RF-COB-124; M07 §5.9; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Reintentar débitos rechazados de forma controlada según código de rechazo y política (cantidad, intervalo), sin reintentar los rechazos definitivos. | Un rechazo por "orden de no pagar" no se reintenta. |
| CP-COB-0125 | RF-COB-125; M07 §5.9; PRO-O5-06 | O5 | Estándar | regla | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Cobrar al primer vencimiento el débito sin rechazos previos. | El débito exitoso en la primera presentación no paga recargo. |
| CP-COB-0126 | RF-COB-126; M07 §5.9; PRO-O5-06 | O5 | Estándar | regla | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Permitir el pago voluntario de obligaciones adheridas por otros canales según política (no permitir, siempre, solo con recargo). | Si se pagó por otro canal antes de la presentación, la obligación se excluye del lote. |
| CP-COB-0127 | RF-COB-127; M07 §5.9; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Excluir por defecto las obligaciones adheridas de la publicación a otros entes. | Configurable por ente. |
| CP-COB-0128 | RF-COB-128; M07 §5.9; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Dar de baja la adhesión, cancelándola en el proveedor cuando corresponda, con fecha de baja. | Tras la baja, la cuenta no entra en la siguiente presentación. |
| CP-COB-0129 | RF-COB-129; M07 §5.9; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Impedir que una obligación esté a la vez en dos presentaciones o intenciones activas. | La segunda inclusión se rechaza con la referencia a la primera. |
| CP-COB-0130 | RF-COB-130; M07 §5.9; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Informar a M05 la adhesión vigente para la leyenda en la factura y al portal para el estado del socio. | La factura de un adherido muestra la leyenda de débito. |
### 1.10 Pagos online y pasarelas (M07 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0131 | RF-COB-131; M07 §5.10; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Definir una interfaz única de conector (crear intención, consultar, listar cobranzas por rango, cancelar, devolver, adherir débito, emitir débito, listar contracargos, generar QR) con capacidades declaradas por conector. | Ningún conector expone operaciones no soportadas: la UI las oculta según capacidades. |
| CP-COB-0132 | RF-COB-132; M07 §5.10; PRO-O5-06 | O5 | Núcleo | migración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Implementar adaptadores SIRO (botón, base de deuda, rendición, QR), Pagos360 (link, QR, débito, reportes, contracargos) y Mercado Pago (Checkout Pro) en O5; Macro, NaranjaX, PayFun, Pagos TIC, SiPago, Helipagos, ProvinciaNet, ProntoPago y… | Cada adaptador pasa la batería de pruebas de contrato del conector. |
| CP-COB-0133 | RF-COB-133; M07 §5.10; PRO-O5-06 | O5 | Núcleo | seguridad | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Guardar credenciales por tenant y conector en la bóveda (T06), con ambiente sandbox o producción y URL base configurables; nunca en parámetros, logs ni respuestas. | Un volcado de logs no contiene secretos. |
| CP-COB-0134 | RF-COB-134; M07 §5.10; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Modelar una intención de pago única con tipo (factura, cupón único, cuota, prepaga, web, caja, link, manual, débito, archivo), ítems, importes por vencimiento, medios permitidos, vencimiento y estado. | Todos los conectores usan la misma intención. |
| CP-COB-0135 | RF-COB-135; M07 §5.10; PRO-O5-06 | O5 | Núcleo | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Calcular importes por vencimiento con M08 al crear la intención y vencerla al último vencimiento o plazo configurado. | Una intención vencida no se puede pagar y se cancela en el proveedor si lo soporta. |
| CP-COB-0136 | RF-COB-136; M07 §5.10; PRO-O5-06 | O5 | Estándar | integración | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Reutilizar una intención vigente idéntica (mismo importe, pagador, conector, medios y obligaciones) dentro de una ventana configurable. | Dos clics seguidos en "Pagar" devuelven el mismo link. |
| CP-COB-0137 | RF-COB-137; M07 §5.10; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Tercero: TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50 | Aplicar monto mínimo para pagar online y descartar intenciones por debajo del umbral. | Una intención de ARS 8 se rechaza con mensaje. |
| CP-COB-0138 | RF-COB-138; M07 §5.10; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). | El checkout solo ofrece los medios habilitados. |
| CP-COB-0139 | RF-COB-139; M07 §5.10; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Recibir webhooks en un endpoint propio por conector y tenant, validar firma cuando el proveedor la ofrezca, persistir el evento crudo y tratarlo como disparador: siempre reconsultar al proveedor antes de confirmar. | Un webhook falsificado no confirma ningún pago. |
| CP-COB-0140 | RF-COB-140; M07 §5.10; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Ejecutar conciliación diaria contra el reporte o listado del proveedor con ventana configurable (por defecto 4 días) y alta de pagos sin intención previa. | Un pago cuyo webhook se perdió se registra al día siguiente. |
| CP-COB-0141 | RF-COB-141; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. | CU-13: notificación repetida sin segundo pago. |
| CP-COB-0142 | RF-COB-142; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Marcar como "Resultado incierto" toda operación sin respuesta concluyente; no reenviar, recrear ni volver a cobrar sin conciliar con el proveedor. | Tras restaurar un respaldo, el sistema consulta identificadores externos antes de cualquier reenvío. |
| CP-COB-0143 | RF-COB-143; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | No considerar el retorno a la página de éxito ni datos del navegador como prueba de cobro. | La URL de éxito solo muestra "estamos confirmando tu pago". |
| CP-COB-0144 | RF-COB-144; M07 §5.10; PRO-O5-06 | O5 | Núcleo | seguridad | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | No almacenar datos completos de tarjeta: usar formularios alojados y tokenización del proveedor; guardar solo token, marca y últimos 4 dígitos. Cada conector declara su modo de captura (`cardDataMode`) y el alcance PCI de GoodApps es SAQ A… | Ninguna colección, log, cola ni archivo generado contiene PAN, vencimiento ni código de seguridad (barrido de patrones de PAN con Luhn sobre bases, logs y archivos de presentación). |
| CP-COB-0145 | RF-COB-145; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Crear y enviar links de pago por WhatsApp, email o SMS desde caja, cuenta corriente, CRM o portal, con plantilla. | El link enviado lleva la intención y vence según configuración. |
| CP-COB-0146 | RF-COB-146; M07 §5.10; PRO-O5-06 | O5 | Estándar | integración | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Generar QR interoperable en facturas (masivo por lote, con errores por intención y reintento) y en el portal. | El lote informa QR generados y fallidos. |
| CP-COB-0147 | RF-COB-147; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Registrar por transacción bruto, comisión bruta, comisión neta, IVA de la comisión, neto, canal, fecha de pago y fecha de acreditación disponible. | CU-13: bruto ARS 8.000, comisión ARS 160, neto ARS 7.840. |
| CP-COB-0148 | RF-COB-148; M07 §5.10; PRO-O5-06 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Ante diferencia entre importe pagado y esperado, aceptar el pago confirmado, imputarlo con la política vigente y enviar la diferencia a revisión. | Un pago confirmado nunca queda sin registrar por "importes no coinciden". |
| CP-COB-0149 | RF-COB-149; M07 §5.10; PRO-O5-06 | O5 | Núcleo | integración | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Mostrar el estado por conector y tenant (operativo, degradado, credencial vencida, caído) y una bandeja de operaciones detenidas con causa accionable. | Un certificado vencido marca solo ese conector, no todos los socios. |
| CP-COB-0150 | RF-COB-150; M07 §5.10; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Notificar a la caja en tiempo real la confirmación de un QR; consulta corta de respaldo hasta 10 minutos. | El cajero ve "pagado" sin refrescar. |
| CP-COB-0151 | RF-COB-151; M07 §5.10; PRO-O5-06 | O5 | Estándar | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Vencer y depurar intenciones no pagadas (registradas sin pago) y cancelarlas en el proveedor cuando lo soporte. | Las intenciones vencidas no figuran como deuda en trámite. |
| CP-COB-0152 | RF-COB-152; M07 §5.10; PRO-O5-06 | O5 | Núcleo | funcional | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Permitir pagar online facturas, resumen, cupón único, cuotas y venta prepaga desde portal y app (M19), y pagar sin login con identificador de pago cuando el tenant lo habilite. | El pago sin login no expone datos personales más allá de importe y servicio. |
| CP-COB-0153 | RF-COB-153; M07 §5.10; PRO-O5-06 | O5 | Estándar | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Limitar los días desde el último vencimiento en que se puede pagar online y el pago pasado el tercer vencimiento. | Pasado el límite, el portal ofrece contactar a la cooperativa. |
### 1.11 Cupón de pago único (M07 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0154 | RF-COB-154; M07 §5.11; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Emitir cupón de pago único (código de barras, QR y código electrónico) que cancela en un acto varias facturas del resumen, con vigencia y anulación si no se paga. | El cupón se paga en caja, ente o pasarela y cada factura queda imputada. |
| CP-COB-0155 | RF-COB-155; M07 §5.11; PRO-O7-11 | O7 | Estándar | migración | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Migrar los talones sumados y cuotas vigentes de ProCoop como cupones equivalentes. | Un talón ProCoop rendido después del corte se imputa en GoodApps. |
| CP-COB-0156 | RF-COB-156; M07 §5.11; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Exigir el pago completo del cupón en caja o anularlo automáticamente si se paga parcialmente según configuración. | Con exigencia activa, faltar una factura del cupón bloquea la confirmación. |
### 1.12 Devoluciones y contracargos (M07 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0157 | RF-COB-157; M07 §5.12; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos veces. | Repetir "ejecutar" con la misma clave no genera un segundo reintegro. |
| CP-COB-0158 | RF-COB-158; M07 §5.12; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Separar el saldo comercial del reintegro pendiente o ejecutado. | Emitir un crédito de ARS 2.000 no figura como devuelto hasta la ejecución confirmada. |
| CP-COB-0159 | RF-COB-159; M07 §5.12; PRO-O5-07 | O5 | Núcleo | regla | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Registrar contracargos y reversiones: reabrir la obligación por movimiento de reversión sin borrar el recibo, y opcionalmente cargar interés diario por reversión y comisión del proveedor como débitos. | El recibo original sigue visible; la deuda vuelve con el movimiento de contracargo. |
| CP-COB-0160 | RF-COB-160; M07 §5.12; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Bloquear el pago online de la cuenta tras una reversión cuando el tenant lo configure. | La cuenta bloqueada solo paga en caja hasta el desbloqueo. |
| CP-COB-0161 | RF-COB-161; M07 §5.12; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Importar contracargos desde el reporte del proveedor o un archivo. | El job diario detecta los contracargos del día anterior. |
| CP-COB-0162 | RF-COB-162; M07 §5.12; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" | Reabrir la deuda cuando M14 informe el rechazo de un cupón de tarjeta presentado o de un cheque. | La obligación vuelve a Pendiente y se notifica al socio. |
| CP-COB-0163 | RF-COB-163; M07 §5.12; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Evaluar los efectos de devoluciones y contracargos en promociones, mora, financiación y períodos cerrados mediante eventos a M08, M05 y M15. | Un contracargo sobre un período contable cerrado se registra en el período abierto. |
| CP-COB-0190 | RF-COB-190; M07 §5.12; PRO-O10-13 | O10 | Estándar | integración | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Devolver el depósito en garantía (por ejemplo, el del préstamo ortopédico de M18) como **crédito a la cuenta**: al consumir `mor.guarantee.refunded` (EVT-MOR-16) con `refundMode = accountCredit`, crear un saldo a favor con `origin =… | Depósito ORT-DEMO-01 de ARS 20.000 devuelto sin daños: saldo a favor de ARS 20.000 con origen `guaranteeRefund`; reprocesar el evento no crea otro saldo (idempotencia por `guaranteeId`); M15 registra M-133. |
### 1.13 Conciliación de cobranzas y rendición a tesorería (M07 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0164 | RF-COB-164; M07 §5.13; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Conciliar por canal y día: intenciones o rendiciones vs. pagos confirmados vs. acreditación esperada y real (M14). | Cada día cerrado tiene acta con diferencias explicadas. |
| CP-COB-0165 | RF-COB-165; M07 §5.13; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Registrar por separado el pago del socio (cancela deuda por el bruto) y el gasto financiero (comisión). | La comisión no se resta del importe cancelado por el socio. |
| CP-COB-0166 | RF-COB-166; M07 §5.13; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Enviar las diferencias a revisión con responsable y estado. | Ninguna diferencia queda sin responsable. |
| CP-COB-0167 | RF-COB-167; M07 §5.13; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Conservar la evidencia de cada transacción (respuesta del proveedor, archivo, registro, webhook) con retención definida. | Desde el recibo se descarga la evidencia del canal. |
| CP-COB-0168 | RF-COB-168; M07 §5.13; PRO-O5-07 | O5 | Núcleo | regla | TEN-001 con Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) | Preparar la rendición del cajero a tesorería: carátula, recibos, operaciones, comprobantes cobrados, integridad, cierre teórico, efectivo, valores, cupones, retenciones y transferencias, filtrable por fecha de registración o de pago. | Tesorería recibe y firma digitalmente la rendición. |
| CP-COB-0169 | RF-COB-169; M07 §5.13; PRO-O5-07 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Al cierre, entregar los cheques a la cartera de M14, presentar automáticamente los cupones de débito y, si se configura, las retenciones. | Los cheques salen de la caja y la anulación de cobros que los contienen queda bloqueada. |
| CP-COB-0170 | RF-COB-170; M07 §5.13; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 | Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. | M14 empareja el movimiento bancario con la expectativa. |
| CP-COB-0171 | RF-COB-171; M07 §5.13; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Configurar por ente la forma de registración en el libro banco: por comprobante, por fecha de acreditación, por caja o por pago. | El número de movimientos esperados en M14 coincide con la forma elegida. |
| CP-COB-0172 | RF-COB-172; M07 §5.13; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Cerrar la conciliación de un día con acta, responsable y diferencias pendientes trasladadas. | El acta no se cierra ocultando diferencias. |
### 1.14 Efectos contables (M07 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0173 | RF-COB-173; M07 §5.14; PRO-O5-07 | O5 | Núcleo | regla | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Publicar eventos económicos con los datos del asiento: medio, caja o ente, cuenta bancaria, servicio, centro de costo, componentes (capital, interés, tributo de terceros), comisión e IVA de comisión. | M15 genera el asiento solo con el evento. |
| CP-COB-0174 | RF-COB-174; M07 §5.14; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | No contabilizar dos veces por reenvío de una integración o evento. | El evento lleva `operationId` estable. |
| CP-COB-0175 | RF-COB-175; M07 §5.14; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | El resumen de cuenta no genera obligación ni ingreso. | No existe evento contable de resumen. |
| CP-COB-0176 | RF-COB-176; RN-INS-017; M07 §5.14; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. **Corregido (HUECO-CAP-02):** es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre el… | El capital cobrado coincide con las obligaciones de capital canceladas; reprocesar el cierre no crea movimientos en el auxiliar de M17. |
### 1.15 Terceros y operaciones complementarias (M07 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0177 | RF-COB-177; M07 §5.15; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Tercero: TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50 | Cobrar por cuenta de terceros (municipio, otros emisores) por código de barras del tercero, con validaciones (pagos múltiples, importes negativos, vencidos, mínimo), comisión fija o porcentual con mínimo y rendición al tercero. | Un comprobante de tercero ya rendido no se puede anular en caja. |
| CP-COB-0178 | RF-COB-178; M07 §5.15; PRO-O10-13 | O10 | Estándar | integración | TEN-001 con Tercero: TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50 | Consultar y cobrar resúmenes de tarjeta de un tercero mediante servicio autenticado. | El servicio exige autenticación; sin ella el conector no se habilita. |
| CP-COB-0179 | RF-COB-179; M07 §5.15; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Importar obligaciones de otros sistemas para cobrarlas (formatos General, Administración Pública y Comprobante con número), consultarlas y eliminar las no cobradas. | Un archivo vacío se rechaza; las importadas quedan identificadas por origen. |
| CP-COB-0180 | RF-COB-180; M07 §5.15; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Definir esquemas de informes de cobranza (productos, servicios e impuestos a incluir). | El reporte respeta el esquema elegido. |
| CP-COB-0181 | RF-COB-181; M07 §5.15; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Consultar cheques recibidos en caja y controlar número de cheque repetido. | Con el control activo, un cheque con número repetido del mismo banco se rechaza. |
| CP-COB-0182 | RF-COB-182; M07 §5.15; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) | Auditar cobros con fecha de cobro distinta de la fecha de cálculo del recargo. | El informe lista los recibos con fecha retroactiva y su autor. |
| CP-COB-0183 | RF-COB-183; M07 §5.15; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo | Registrar en la auditoría de T02 cada evento de caja (consulta, cobro, anulación, venta prepaga) con caja, cuenta, valor y descripción. | El log de caja no se puede modificar. |
### 1.16 Transición desde ProCoop (formatos de la base relevada LAG) (M07 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0184 | RF-COB-184; M07 §5.16; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 /… | Proveer un resolutor de transición para la rendición Red Link de LAG: identificación por cuenta + servicio + importe, solo sobre obligaciones impagas, desempate por vencimiento vigente a la fecha de cobro y luego la más antigua; si quedan… | Dos meses con igual importe no producen imputación errónea ni anulación de repeticiones. |
| CP-COB-0185 | RF-COB-185; M07 §5.16; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Mantener una tabla de alias de claves externas (código de usuario del sistema anterior, cuentas "cuenta × 100 + servicio", identificadores Red Link de 7 u 8 + 2 dígitos) hacia cuenta y servicio. | La rendición con clave anterior se resuelve por alias, no por búsqueda libre. |
| CP-COB-0186 | RF-COB-186; M07 §5.16; PRO-O5-07 | O5 | Núcleo | migración | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Generar los formatos de envío vigentes de LAG: Red Link 19 con identificador de 10 (convenio de 3) y SIRO con el "0" antepuesto al convenio para el código de barras 0447 de 56 dígitos, mientras se acuerda el identificador nuevo. | El archivo generado por GoodApps para un período coincide con el de ProCoop. |
| CP-COB-0187 | RF-COB-187; M07 §5.16; PRO-O5-07 | O5 | Núcleo | regla | TEN-001 con Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7… | Validar el largo y los topes del código de barras antes de entregarlo a M05 (importe de 7 dígitos, días entre vencimientos) y usar el formato extendido acordado. | Ninguna factura sale con código vacío sin aviso. |
| CP-COB-0188 | RF-COB-188; M07 §5.16; PRO-O5-07 | O5 | Núcleo | integración | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Rendir SIRO por API o por archivo según la configuración confirmada con la cooperativa. | Ambos caminos producen el mismo resultado de importación. |
### 1.17 Reportes (M07 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-COB-0189 | RF-COB-189; M07 §5.17; PRO-O5-07 | O5 | Núcleo | funcional | TEN-001 con Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 | Proveer los reportes, indicadores y exportaciones de la sección 15 con fórmula, universo y fecha de corte. | Cada reporte declara universo y corte y coincide con el auxiliar. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-COB-5001 — ESC-01. Pago duplicado**

- Cubre: ESC-01; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando El socio paga la misma obligación por Red Link y por portal.
- Entonces Saldo a favor no automático + excepción. El primero cancela; el segundo crea saldo a favor `duplicatePayment` no automático + excepción; el socio elige aplicarlo o pedir devolución.

**CP-COB-5002 — ESC-04. Caída del proveedor durante el pago**

- Cubre: ESC-04; relacionados: CU-COB-12; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Caída del proveedor (CU-COB-12)
- Entonces Un solo cobro; sin reenvío.

**CP-COB-5003 — ESC-COB-P01. Cajero sin `cob.caja.cobrarParcial` intenta entrega parcial**

- Cubre: ESC-COB-P01; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cajero sin `cob.caja.cobrarParcial` intenta entrega parcial
- Entonces 403 problem+json; nada se registra.

**CP-COB-5004 — ESC-COB-P02. Cajero sin `cob.caja.cambiarRecargo` envía recargo modificado**

- Cubre: ESC-COB-P02; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cajero sin `cob.caja.cambiarRecargo` envía recargo modificado
- Entonces 403.

**CP-COB-5005 — ESC-COB-P03. Cajero anula operación de otro cajero sin supervisor**

- Cubre: ESC-COB-P03; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cajero anula operación de otro cajero sin supervisor
- Entonces 403 `cob.caja.anularOtroUsuario`.

**CP-COB-5006 — ESC-COB-P04. Quien solicitó una devolución intenta aprobarla**

- Cubre: ESC-COB-P04; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Quien solicitó una devolución intenta aprobarla
- Entonces 403 (segregación).

**CP-COB-5007 — ESC-COB-P05. Cobrador consulta lista de otro cobrador**

- Cubre: ESC-COB-P05; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobrador consulta lista de otro cobrador
- Entonces 404 (alcance `propios`).

**CP-COB-5008 — ESC-COB-P06. Socio consulta cuenta no autorizada**

- Cubre: ESC-COB-P06; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Socio consulta cuenta no autorizada
- Entonces 404.

**CP-COB-5009 — ESC-COB-P07. Cobro sin sesión abierta**

- Cubre: ESC-COB-P07; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobro sin sesión abierta
- Entonces 409 `cob.caja.sesionCerrada`.

**CP-COB-5010 — ESC-COB-P08. Contador intenta imputar**

- Cubre: ESC-COB-P08; M07 §17.2
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Contador intenta imputar
- Entonces 403.

**CP-COB-5011 — ESC-COB-T01. Usuario del tenant A consulta `obligations/{id}` del tenant B**

- Cubre: ESC-COB-T01; M07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario del tenant A consulta `obligations/{id}` del tenant B
- Entonces 404, sin filtrar existencia.

**CP-COB-5012 — ESC-COB-T02. Webhook con `tenantSlug` A y firma del conector de B**

- Cubre: ESC-COB-T02; M07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Webhook con `tenantSlug` A y firma del conector de B
- Entonces 401; evento registrado como inválido.

**CP-COB-5013 — ESC-COB-T03. Archivo de rendición de B cargado en A**

- Cubre: ESC-COB-T03; M07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Archivo de rendición de B cargado en A
- Entonces Rechazo por convenio.

**CP-COB-5014 — ESC-COB-T04. Índices: toda consulta del módulo incluye `tenantId` (prueba de lint/consulta)**

- Cubre: ESC-COB-T04; M07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Índices: toda consulta del módulo incluye `tenantId` (prueba de lint/consulta)
- Entonces Sin consultas sin `tenantId`.

**CP-COB-5015 — ESC-COB-T05. Layout de plataforma modificado por un tenant**

- Cubre: ESC-COB-T05; M07 §17.3
- Ola: O5 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Layout de plataforma modificado por un tenant
- Entonces Se crea copia en el tenant; el original no cambia.

**CP-COB-5016 — ESC-COB-R01. Webhook llega tres veces**

- Cubre: ESC-COB-R01; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Webhook llega tres veces
- Entonces Un cobro; dos eventos `ignored`.

**CP-COB-5017 — ESC-COB-R02. Webhook llega antes que la respuesta de creación**

- Cubre: ESC-COB-R02; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Webhook llega antes que la respuesta de creación
- Entonces Reconsulta resuelve; un cobro.

**CP-COB-5018 — ESC-COB-R03. Timeout al crear intención**

- Cubre: ESC-COB-R03; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Timeout al crear intención
- Entonces `uncertain`; no se crea otra; reconsulta.

**CP-COB-5019 — ESC-COB-R04. Caída del worker a mitad de confirmar rendición de 1.000 líneas**

- Cubre: ESC-COB-R04; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Caída del worker a mitad de confirmar rendición de 1.000 líneas
- Entonces Al reanudar solo se aplican las no aplicadas.

**CP-COB-5020 — ESC-COB-R05. Doble clic en Confirmar en caja**

- Cubre: ESC-COB-R05; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Doble clic en Confirmar en caja
- Entonces Un recibo.

**CP-COB-5021 — ESC-COB-R06. Sincronización offline repetida**

- Cubre: ESC-COB-R06; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sincronización offline repetida
- Entonces Un recibo por `clientMutationId`.

**CP-COB-5022 — ESC-COB-R07. Mismo archivo con otro nombre**

- Cubre: ESC-COB-R07; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Mismo archivo con otro nombre
- Entonces 409 `cob.rendicion.duplicada`.

**CP-COB-5023 — ESC-COB-R08. Dos cajeros cobran la misma obligación a la vez**

- Cubre: ESC-COB-R08; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos cajeros cobran la misma obligación a la vez
- Entonces Uno confirma; el otro recibe 409 `cob.obligacion.saldoCambiado` y recotiza.

**CP-COB-5024 — ESC-COB-R09. CAE no llega**

- Cubre: ESC-COB-R09; M07 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CAE no llega
- Entonces `pendingFiscal`; JOB-COB-15 completa.

**CP-COB-5025 — ESC-COB-C01. Pago en el proveedor sin webhook**

- Cubre: ESC-COB-C01; M07 §17.5
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago en el proveedor sin webhook
- Entonces La conciliación diaria lo incorpora e imputa.

**CP-COB-5026 — ESC-COB-C02. Neto acreditado distinto del esperado**

- Cubre: ESC-COB-C02; M07 §17.5
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Neto acreditado distinto del esperado
- Entonces Diferencia en excepción; día no cerrable sin comentario.

**CP-COB-5027 — ESC-COB-C03. Pie de archivo con cantidad distinta**

- Cubre: ESC-COB-C03; M07 §17.5
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pie de archivo con cantidad distinta
- Entonces Advertencia o rechazo según layout.

**CP-COB-5028 — ESC-COB-C04. Rendición acreditada en dos días**

- Cubre: ESC-COB-C04; M07 §17.5
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición acreditada en dos días
- Entonces Registración por fecha de acreditación (PRM-COB-093).

**CP-COB-5029 — ESC-COB-L01. Línea Red Link LAG con identificador de 10 dígitos y servicio 02 + concepto 002**

- Cubre: ESC-COB-L01; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Línea Red Link LAG con identificador de 10 dígitos y servicio 02 + concepto 002
- Entonces Resuelve cuenta+servicio gas.

**CP-COB-5030 — ESC-COB-L02. Dos obligaciones impagas con mismo importe**

- Cubre: ESC-COB-L02; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 / 20.000 / 7.000) y CU-103 (28.000 / 15.000 / 1.200)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos obligaciones impagas con mismo importe
- Entonces No identificado con candidatos (no elige la más reciente).

**CP-COB-5031 — ESC-COB-L03. Identificador fuera de rango entero**

- Cubre: ESC-COB-L03; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Identificador fuera de rango entero
- Entonces Solo esa línea rechazada.

**CP-COB-5032 — ESC-COB-L04. Factura SIRO ≥ ARS 100.000**

- Cubre: ESC-COB-L04; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura SIRO ≥ ARS 100.000
- Entonces Error informado y formato extendido o QR; nunca código vacío.

**CP-COB-5033 — ESC-COB-L05. Paralelo ProCoop vs. GoodApps durante los ciclos consecutivos que exige T07 §17.4 (PRM-MIG-041, default 2; antes "un ciclo completo") en…**

- Cubre: ESC-COB-L05; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Paralelo ProCoop vs. GoodApps durante los ciclos consecutivos que exige T07 §17.4 (PRM-MIG-041, default 2; antes "un ciclo completo") en LAG, cada ciclo con el mismo criterio
- Entonces Σ cobranza por día y saldos por cuenta iguales (tolerancia 0).

**CP-COB-5034 — ESC-COB-E01. Titular con ELE (entidad A) e Internet (entidad B) (DEC-087)**

- Cubre: ESC-COB-E01; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Titular con ELE (entidad A) e Internet (entidad B) (DEC-087)
- Entonces Dos cuentas corrientes; el portal muestra ambas con total; ningún saldo a favor de A se aplica a B.

**CP-COB-5035 — ESC-COB-E02. Cobro único en caja de ARS 13.000: ARS 8.000 de A y ARS 5.000 de B, con efectivo y tarjeta**

- Cubre: ESC-COB-E02; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobro único en caja de ARS 13.000: ARS 8.000 de A y ARS 5.000 de B, con efectivo y tarjeta
- Entonces Dos recibos numerados por entidad; Σ recibos = 13.000; `cob.payment.confirmed` lleva ambos con su `legalEntityId`; anular la operación anula los dos.

**CP-COB-5036 — ESC-COB-E03. Recibo con PRM-COB-065 = un recibo por operación y deuda de dos entidades**

- Cubre: ESC-COB-E03; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Recibos: REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recibo con PRM-COB-065 = un recibo por operación y deuda de dos entidades
- Entonces Igual se emiten dos recibos (uno por entidad).

**CP-COB-5037 — ESC-COB-E04. Cambio de titularidad con ARS 20.000 vencidos del saliente (DEC-045)**

- Cubre: ESC-COB-E04; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de titularidad con ARS 20.000 vencidos del saliente (DEC-045)
- Entonces La deuda queda en la cuenta del saliente; la nueva cuenta del entrante empieza en 0; la caja muestra la advertencia de deuda previa sin bloquear.

**CP-COB-5038 — ESC-COB-E05. Consulta de detalle de rendición de hace 40 meses (DEC-087)**

- Cubre: ESC-COB-E05; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Consulta de detalle de rendición de hace 40 meses (DEC-087)
- Entonces Recibo y PDF en línea; detalle de líneas como consulta diferida con aviso al terminar.

**CP-COB-5039 — ESC-COB-E06. Estado de cuenta con deuda de la entidad A (ARS 8.000) y de la entidad B (ARS 5.000) y pedido de cupón único**

- Cubre: ESC-COB-E06; RN-COB-156; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 / 20.000 / 7.000) y CU-103 (28.000 / 15.000 / 1.200)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Estado de cuenta con deuda de la entidad A (ARS 8.000) y de la entidad B (ARS 5.000) y pedido de cupón único
- Entonces Se emiten dos cupones, uno por entidad, con su referencia de pago; ninguno mezcla obligaciones (RN-COB-156).

**CP-COB-5040 — ESC-COB-E07. Factura con servicio ARS 12.100 y depósito en garantía ARS 50.000 (`itemClass = guaranteeDeposit`, valores ficticios), cobrada completa**

- Cubre: ESC-COB-E07; RN-COB-157; M07 §17.6
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 / 20.000 / 7.000) y CU-103 (28.000 / 15.000 / 1.200)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura con servicio ARS 12.100 y depósito en garantía ARS 50.000 (`itemClass = guaranteeDeposit`, valores ficticios), cobrada completa
- Entonces Dos obligaciones; el depósito figura como "reintegrable", no recibe interés ni se usa para compensar otra deuda; `cob.payment.confirmed` informa la clase y M15 lo registra como pasivo (RN-COB-157).

## 3. Casos por caso de uso (CU)

**CP-COB-8001 — CU-11. Cobro parcial en caja (BASE §11)**

- Cubre: CU-11; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado CAJ-01 abierta con fondo ARS 20.000; FAC-DEMO-001 de ARS 13.000 pendiente.; actor: Cajero con facultades., autenticado en TEN-001 con las capabilities de su rol
- Cuando busca a PER-001; selecciona FAC-DEMO-001; indica entrega de ARS 5.000 con motivo; paga en efectivo; confirma.
- Entonces REC-DEMO-001 por 5.000, imputación por componentes (recargos primero), saldo 8.000, obligación `partial`, `cob.payment.confirmed`. Alternativo o excepción: sin `cob.caja.cobrarParcial` → 403. Reintento con la misma clave → mismo recibo.

**CP-COB-8002 — CU-12. Cierre de caja (BASE §12)**

- Cubre: CU-12; relacionados: CU-11; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado CAJ-01 con fondo 20.000 y el cobro de CU-11.; actor: Cajero., autenticado en TEN-001 con las capabilities de su rol
- Cuando pide cierre; integridad OK; teórico efectivo 25.000; declara 25.000; cierra.
- Entonces Sesión `closed`, rendición `delivered`. Alternativo o excepción: declara 24.900 → diferencia −100 justificada; si supera PRM-COB-034 requiere supervisor; quebranto a M15. Anulación posterior a la recepción por tesorería: contrapartida en M14.

**CP-COB-8003 — CU-13. Pago online (BASE §13)**

- Cubre: CU-13; relacionados: CU-11; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840
- Dado FAC-DEMO-001 con saldo 8.000 tras CU-11.; actor: Socio., autenticado en TEN-001 con las capabilities de su rol
- Cuando PER-001 entra al portal, elige pagar 8.000, intención TX-DEMO-001; el proveedor confirma (webhook + reconsulta).
- Entonces Transacción bruto 8.000, comisión 160, neto 7.840; recibo por 8.000; obligación `paid`; `cob.settlement.expected` por 7.840; conciliación diaria cierra sin diferencias. Alternativo o excepción: webhook duplicado → un solo recibo; timeout al crear → `uncertain` sin reenvío.

**CP-COB-8004 — CU-FAC-01. Factura agrupada multiservicio cobrada (BASE §44)**

- Cubre: CU-FAC-01; M07 §16.1
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura agrupada multiservicio cobrada (BASE §44)
- Entonces Definición dueña: M05 «CU-FAC-01»; aquí solo el tramo de cobranza. FAC-AG-DEMO-002 de ARS 13.000 genera una obligación por servicio; un pago total cancela todas; un pago parcial se imputa según la política (PA-COB-01) y queda trazado por servicio. FAC-INT-DEMO-002 (ARS 25.000) con FAC-001..004.

**CP-COB-8005 — CU-CTA-01. Cuenta unificada con mínimo (BASE §68)**

- Cubre: CU-CTA-01; M07 §16.1
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Agua 13.000 + electricidad 20.000 + cementerio 7.000 = 40.000; umbral mínimo 10.000; el socio paga 8.000.
- Entonces Imputación por antigüedad (o elección), mínimo no cumplido, `cob.minimumPayment.evaluated` con cumplido = false; M08 decide; COB no suspende. Afectación cruzada de saldos deshabilitada por defecto (CTR-COB-14).

**CP-COB-8006 — CU-103. Factura agrupada por grupo de facturación (BASE §103)**

- Cubre: CU-103; M07 §16.1
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Definición dueña: M05 «CU-103»; aquí solo el tramo de cobranza e imputación. Energía 28.000 + internet 15.000 + bomberos 1.200 = 44.200; pago 30.000.
- Entonces Con la política por defecto se cubren primero recargos y luego obligaciones por antigüedad y prioridad de servicio; el remanente de cada servicio queda abierto y trazado; prevalece §103 (FAC-008) sobre §44 (CTR-COB-01).

**CP-COB-8007 — CU-COB-01. Rendición Red Link LAG**

- Cubre: CU-COB-01; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado actor: Resp. cobranzas externas, autenticado en TEN-001 con las capabilities de su rol
- Cuando Llega el archivo por SFTP; validación de cabecera con convenio; líneas con identificador de 10 dígitos resueltas por alias/resolutor; confirmación
- Entonces Recibos en caja 101; diferidos a M08; no resueltas a la bandeja.

**CP-COB-8008 — CU-COB-02. Base de deuda SIRO por API**

- Cubre: CU-COB-02; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado actor: Resp. cobranzas externas, autenticado en TEN-001 con las capabilities de su rol
- Cuando Exporta deuda; recibe número de transacción; consulta resultado; confirma
- Entonces Deuda publicada; errores por registro visibles.

**CP-COB-8009 — CU-COB-03. Débito rechazado**

- Cubre: CU-COB-03; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Débito: ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes"
- Dado actor: Sistema / operador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Lote presentado; resultado con rechazo reintentable; reintento; segundo rechazo definitivo
- Entonces Adhesión suspendida; aviso al socio; obligación sigue abierta.

**CP-COB-8010 — CU-COB-04. Contracargo de tarjeta**

- Cubre: CU-COB-04; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado actor: Tesorero, autenticado en TEN-001 con las capabilities de su rol
- Cuando Llega contracargo; reverso de imputaciones; cargos opcionales; bloqueo online
- Entonces Obligación reabierta; expediente en disputa.

**CP-COB-8011 — CU-COB-05. Devolución de pago duplicado**

- Cubre: CU-COB-05; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado actor: Resp. devoluciones, autenticado en TEN-001 con las capabilities de su rol
- Cuando Solicitud desde saldo a favor; aprobación por otra persona; ejecución por conector o M14
- Entonces Reintegro conciliado.

**CP-COB-8012 — CU-COB-06. Cobro offline de cobrador**

- Cubre: CU-COB-06; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Cobrador: COBR-01 con lista de 5 cobros, uno en conflicto
- Dado actor: Cobrador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Descarga lista; cobra sin señal; recibo provisorio; sincroniza
- Entonces Recibo definitivo; recargo recalculado; conflictos a excepción.

**CP-COB-8013 — CU-COB-07. Cierre con diferencia**

- Cubre: CU-COB-07; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Titular / cuentas: PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01
- Dado actor: Cajero / supervisor, autenticado en TEN-001 con las capabilities de su rol
- Cuando Declara menos; justifica; supervisor aprueba
- Entonces Quebranto registrado.

**CP-COB-8014 — CU-COB-08. Anulación de cobro de otro cajero**

- Cubre: CU-COB-08; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado actor: Supervisor, autenticado en TEN-001 con las capabilities de su rol
- Cuando Busca operación; impedimentos OK; anula con motivo
- Entonces Saldos restituidos; recibo anulado conservado.

**CP-COB-8015 — CU-COB-09. Cupón único multiservicio**

- Cubre: CU-COB-09; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Obligaciones: FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 / 20.000 / 7.000) y CU-103 (28.000 / 15.000 / 1.200)
- Dado actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Recibe resumen con cupón; paga en Pago Fácil
- Entonces Rendición por cupón cancela todas las obligaciones incluidas.

**CP-COB-8016 — CU-COB-10. Cobro QR en caja**

- Cubre: CU-COB-10; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Caja: CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo
- Dado actor: Cajero, autenticado en TEN-001 con las capabilities de su rol
- Cuando Carga importe en QR del puesto; socio paga con billetera; confirmación
- Entonces Recibo con medio QR; transacción conciliada.

**CP-COB-8017 — CU-COB-11. Transferencia no identificada**

- Cubre: CU-COB-11; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Excepciones: Una de cada tipo para la bandeja
- Dado actor: Operador cta. cte., autenticado en TEN-001 con las capabilities de su rol
- Cuando M14 informa crédito sin referencia; bandeja; identifica con comprobante; aplica
- Entonces Recibo con fecha de cobro original.

**CP-COB-8018 — CU-COB-12. Pago incierto (ESC-04)**

- Cubre: CU-COB-12; relacionados: ESC-04; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado actor: Sistema, autenticado en TEN-001 con las capabilities de su rol
- Cuando Timeout al crear intención; reconsulta; el proveedor informa pago
- Entonces Un solo cobro; portal muestra "en verificación" mientras tanto.

**CP-COB-8019 — CU-COB-13. Link de pago por WhatsApp**

- Cubre: CU-COB-13; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Entes: ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada)
- Dado actor: Atención / CRM, autenticado en TEN-001 con las capabilities de su rol
- Cuando Genera link desde la cuenta; envía; socio paga
- Entonces Intención imputada; envío trazado.

**CP-COB-8020 — CU-COB-14. Cobro por cuenta de tercero**

- Cubre: CU-COB-14; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Tercero: TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50
- Dado actor: Cajero, autenticado en TEN-001 con las capabilities de su rol
- Cuando Lee barras del tercero; valida; cobra con comisión
- Entonces Obligación del tercero y rendición pendiente.

**CP-COB-8021 — CU-COB-15. Diferencia de importe en pasarela**

- Cubre: CU-COB-15; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Pasarela: Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840
- Dado actor: Sistema / responsable, autenticado en TEN-001 con las capabilities de su rol
- Cuando Socio paga importe de 1° vencimiento estando en el 2°
- Entonces Se imputa; diferencia a revisión (PA-COB-05).

**CP-COB-8022 — CU-COB-16. Cancelación automática de NC**

- Cubre: CU-COB-16; M07 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M07 §18.
- Datos de prueba: Saldos a favor: SAF-DEMO-001 duplicado 8.000 no automático
- Dado actor: Sistema, autenticado en TEN-001 con las capabilities de su rol
- Cuando M05 emite NC; saldo a favor; JOB-COB-10 lo aplica a la próxima obligación del mismo servicio
- Entonces Obligación cancelada sin intervención.
