# Casos de prueba de aceptación — M08 MOR — Mora, intereses, suspensión, corte, reconexión, financiación y convenios, garantías, incobrables, gestión judicial y prescripción

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M08-MOR-mora-financiacion.md`](../../especificacion/anexos/M08-MOR-mora-financiacion.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 224 CP de requisitos funcionales, 68 CP de escenarios ESC y 13 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M08 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Motor común de interés (M08 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0001 | RF-MOR-001; M08 §5.1; PRO-O5-01 | O5 | Núcleo | integración | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Proveer un **único motor de cálculo de interés** consumido por emisión, caja, entes, pasarelas, portal, proceso masivo, convenios y gestión de mora, con la misma política y el mismo resultado para la misma entrada. | Para un documento y fecha dados, caja, portal y proceso masivo devuelven importes idénticos al centavo. |
| CP-MOR-0002 | RF-MOR-002; M08 §5.1; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | El motor recibe documento(s), fecha de cálculo, canal, ente (opcional), y devuelve componentes separados: recargo entre vencimientos, interés por mora, gastos administrativos y descuento, cada uno con neto, IVA, percepción de IVA e IIBB… | La respuesta contiene los cuatro componentes y la lista de tramos; la suma de tramos coincide con el componente. |
| CP-MOR-0003 | RF-MOR-003; M08 §5.1; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Persistir cada cálculo usado en una operación económica (cobro, cargo, convenio) como **cálculo de interés** inmutable con los parámetros aplicados (método, tasa, mínimo, redondeo, excluidos, jubilado, crédito, último vencimiento, gastos). | Desde un recibo se puede abrir el cálculo y reproducirlo con la versión de política registrada. |
| CP-MOR-0004 | RF-MOR-004; M08 §5.1; PRO-O5-01 | O5 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Permitir **cotizaciones** sin efecto (consulta de deuda, portal, simulador) con validez hasta el fin del día del tenant. | Una cotización no modifica documentos; expira a las 23:59 de la zona del tenant. |
| CP-MOR-0005 | RF-MOR-005; M08 §5.1; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Resolver la política aplicable por **servicio, categoría, tipo de documento y vigencia**, con prioridad explícita y visible (más específica primero). | Con políticas general y por categoría vigentes, el cálculo usa la de la categoría y lo informa en el detalle. |
| CP-MOR-0006 | RF-MOR-006; M08 §5.1; PRO-O6-01 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Soportar los métodos de cálculo **tasa fija diaria**, **tabla de tasas por vigencia** e **índices**, elegidos explícitamente en la política (sin prioridades implícitas). | Una política sin método configurado no se puede publicar. |
| CP-MOR-0007 | RF-MOR-007; M08 §5.1; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular siempre **interés simple diario** sobre la base, salvo el método de índices (que trae la composición del índice); no capitalizar. | El interés de 30 días al 0,1 % diario sobre ARS 10.000 es ARS 300,00. |
| CP-MOR-0008 | RF-MOR-008; M08 §5.1; PRO-O5-01 | O5 | Estándar | integración | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Tomar la **fecha de cálculo** como fecha efectiva de pago informada por el canal (fecha de cobro del ente o pasarela) o fecha de consulta; permitir fecha fija de cálculo para caja local con permiso. | Un pago rendido por ente con fecha de pago anterior a la rendición calcula interés a la fecha de pago. |
| CP-MOR-0009 | RF-MOR-009; M08 §5.1; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Registrar la marca **interés liquidado hasta** por documento y calcular siempre desde ella, para impedir doble cobro entre canales y procesos. | Tras facturar interés masivo al 31-10, un cobro en caja el 15-11 calcula solo 15 días. |
| CP-MOR-0010 | RF-MOR-010; M08 §5.1; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Exponer el detalle del cálculo en caja, portal y factura en lenguaje claro (dict), con tasa, días y base. | El socio ve "interés por mora: 15 días × 0,10 % × ARS 8.000 = ARS 120 + IVA". |
### 1.2 Recargo entre vencimientos al emitir (M08 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0011 | RF-MOR-011; RN-MOR-011, RN-MOR-016; M08 §5.2; PRO-O4-11 | O4 | Núcleo | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Configurar por servicio, ciclo y tipo de documento un **esquema de recargo entre vencimientos** con variantes: ninguno, porcentaje variable por días, porcentaje fijo por escalón (cascada), importe fijo por escalón, trama por importe, trama… | Cada variante calcula `TOTAL2..TOTAL4` según RN-MOR-011 a RN-MOR-016 con los ejemplos de §17. |
| CP-MOR-0012 | RF-MOR-012; M08 §5.2; PRO-O4-11 | O4 | Núcleo | regla | TEN-001 con Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` | Calcular al emitir los importes de cada vencimiento y entregarlos a M05 para imprimirlos en la factura y mostrarlos en la app. | La factura emitida muestra cuatro importes que coinciden con la cotización del motor en cada fecha. |
| CP-MOR-0013 | RF-MOR-013; M08 §5.2; PRO-O4-11 | O4 | Estándar | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Administrar **tramas de recargo** por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. | No se pueden cargar dos tramas del mismo tipo de documento con rangos de importe superpuestos. |
| CP-MOR-0014 | RF-MOR-014; M08 §5.2; PRO-O4-11 | O4 | Núcleo | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Calcular el IVA del recargo con el concepto de interés entre vencimientos y la situación de IVA del titular, más percepción si corresponde; si el concepto no está configurado, **impedir la publicación** del esquema. | Publicar un esquema sin concepto fiscal devuelve error de validación. |
| CP-MOR-0015 | RF-MOR-015; M08 §5.2; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir recargo por **cambio de trama** con concepto propio (prepago). | Un cambio de trama de prepago genera el ítem con el concepto configurado. |
| CP-MOR-0016 | RF-MOR-016; M08 §5.2; PRO-O6-01 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Cuotas de convenio emitidas como documento propio tienen un solo vencimiento (sin recargo entre vencimientos); la mora corre desde ese vencimiento. | Una cuota emitida tiene VTO1=VTO2=VTO3=VTO4 y TOTALk iguales. |
| CP-MOR-0017 | RF-MOR-017; M08 §5.2; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Al cobrar entre el VTO1 y el último vencimiento, el recargo cobrado es la diferencia del vencimiento vigente menos lo ya absorbido por pagos previos, tratado con IVA incluido. | Un pago parcial previo reduce proporcionalmente el recargo entre vencimientos a cobrar. |
| CP-MOR-0018 | RF-MOR-018; M08 §5.2; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | El recargo entre vencimientos puede ser **proporcional al saldo** cuando hubo pagos parciales. | Con saldo 50 % del TOTAL1, el recargo es la mitad. |
| CP-MOR-0019 | RF-MOR-019; M08 §5.2; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Discriminar el **IIBB** del recargo entre vencimientos cuando la jurisdicción lo exige. | Con la opción activa, el detalle muestra IIBB separado. |
| CP-MOR-0020 | RF-MOR-020; M08 §5.2; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Registrar el recargo entre vencimientos efectivamente cobrado en un **documento posterior** (ND o factura según política), sin modificar la factura original. | La factura original permanece intacta; se emite un documento relacionado con el ítem "Intereses en Vto – {nro}". |
### 1.3 Recargo por mora al cobrar o consultar (M08 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0021 | RF-MOR-021; M08 §5.3; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Calcular el recargo por mora desde la **fecha base** (VTO1, o último vencimiento si la política lo indica; con pagos parciales, el vencimiento que corresponde a la fecha del último pago) hasta la fecha de cálculo. | Con la opción "desde último vencimiento", una factura con VTO4 al 20-10 pagada el 30-10 genera 10 días. |
| CP-MOR-0022 | RF-MOR-022; M08 §5.3; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Tomar como **base**: sin pagos, el TOTAL1 (o TOTAL del último vencimiento si así está configurado) menos impuestos excluidos; con pagos parciales, el saldo; con base por conceptos, la suma de ítems de los conceptos/impuestos configurados… | Excluir el impuesto municipal reduce la base por exactamente su importe prorrateado al saldo. |
| CP-MOR-0023 | RF-MOR-023; M08 §5.3; PRO-O5-01 | O5 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Método tasa fija diaria: `base × tasa × días / 100`; la tasa puede sobrescribirse por ente recaudador. | Ver ejemplo numérico en §17 ESC-MOR-01. |
| CP-MOR-0024 | RF-MOR-024; M08 §5.3; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Método índices: `base × (índice(≤ fecha de cálculo) / índice(≥ fecha base) − 1)`, con la tabla de índices de la política y filtro por tipo de documento; mostrar tasa diaria equivalente. | Con índices 100 y 103, base ARS 10.000 → ARS 300. |
| CP-MOR-0025 | RF-MOR-025; M08 §5.3; PRO-O6-01 | O6 | Núcleo | funcional | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Método tabla de tasas: sumar, por cada tramo de vigencia que se solapa con el período, `base × tasa diaria × días solapados / 100`, filtrando por tipo de documento y categoría (la categoría coincidente tiene prioridad sobre las tasas… | Un período de 40 días que cruza dos tramos usa cada tasa por sus días. |
| CP-MOR-0026 | RF-MOR-026; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Separar el interés entre vencimientos del interés por mora cuando la política lo indica. | El recibo muestra ambos ítems por separado. |
| CP-MOR-0027 | RF-MOR-027; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Aplicar **mínimo** de recargo según el modo configurado. | Con mínimo ARS 50 en modo "umbral de exención", un recargo de ARS 40 vale 0. |
| CP-MOR-0028 | RF-MOR-028; M08 §5.3; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Sumar **gastos administrativos** por documento pasado el último vencimiento, solo si el concepto está habilitado con fundamento. | Un tenant sin habilitación no puede activar el importe. |
| CP-MOR-0029 | RF-MOR-029; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Aplicar regla de **redondeo** explícita al recargo total (incluye opción a 1 decimal). | Con redondeo a 1 decimal, ARS 120,46 → ARS 120,50 según regla "half-up". |
| CP-MOR-0030 | RF-MOR-030; M08 §5.3; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Inhabilitar el interés para: documento marcado sin interés, cuenta sin recargo (si la política respeta esa marca), beneficiario de condición eximida (jubilados u otra condición configurable), y documentos de crédito salvo política… | Una NC con saldo no genera interés salvo opción activa. |
| CP-MOR-0031 | RF-MOR-031; M08 §5.3; PRO-O5-01 | O5 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Aplicar **descuento por pronto pago** antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. | Pagar a los 3 días con tramo 0–5 días al 2 % descuenta 2 % del neto. |
| CP-MOR-0032 | RF-MOR-032; M08 §5.3; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular el IVA, la percepción y el IIBB del interés con el **concepto de interés por tipo de documento** (o el general, o el de modo financiación) y la situación fiscal del titular (con situación por defecto si falta). | Un titular responsable inscripto recibe IVA 21 % sobre el neto del interés (alícuota ilustrativa del concepto). |
| CP-MOR-0033 | RF-MOR-033; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Permitir que el **ente recaudador** sobrescriba: recargo desde último vencimiento, modo de diferimiento y cobro al VTO1. | El ente X configurado "cobra al VTO1" no genera recargo entre vencimientos. |
| CP-MOR-0034 | RF-MOR-034; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir la **dispensa del recargo** en caja con solicitud del cajero y aprobación del supervisor, motivo y registro. | Sin aprobación no se puede confirmar un cobro con recargo dispensado. |
| CP-MOR-0035 | RF-MOR-035; M08 §5.3; PRO-O6-01 | O6 | Estándar | seguridad | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir al operador cambiar el **recargo diario** en modo financiación solo si la política lo habilita, con capability y motivo. | El cambio queda en el cálculo con autor y motivo. |
| CP-MOR-0036 | RF-MOR-036; M08 §5.3; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular **interés por reversión** (contracargo) entre la fecha del pago revertido y la fecha de reversión, con tasa propia. | Una reversión a los 20 días con 0,1 % diario sobre ARS 5.000 calcula ARS 100. |
| CP-MOR-0037 | RF-MOR-037; M08 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular **interés por valores a fecha** recibidos en caja (cheques) con tasa diaria y concepto propio. | Un cheque a 30 días genera el interés configurado. |
| CP-MOR-0038 | RF-MOR-038; M08 §5.3; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Informar a la cobranza de **prepago** si corresponde retener intereses, respetando excepciones con "no retener". | Una cuenta con excepción vigente "no retener" no retiene intereses en la venta de prepago. |
| CP-MOR-0039 | RF-MOR-039; M08 §5.3; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir **punitorios específicos por servicio** (ej. energía) como política del servicio. | La política de electricidad puede definir un punitorio distinto del general. |
| CP-MOR-0040 | RF-MOR-040; M08 §5.3; PRO-O6-01 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Proveer a M07 la lista de documentos **notificados**, bloqueados o incluidos en notificación abierta para sus validaciones de caja (pago completo de deuda notificada, antigüedad, avisos). | La caja recibe la marca "notificado" y aplica su regla. |
### 1.4 Diferimiento y documentación del interés (M08 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0041 | RF-MOR-041; M08 §5.4; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Soportar tres modos: **no diferir** (se cobra todo), **diferir interés por mora** (se cobra el entre vencimientos), **diferir todo**; por política, por ente y por canal. En el pago online de una factura vencida el interés se difiere a la… | En modo "diferir todo" la caja cobra solo el saldo de la factura. |
| CP-MOR-0042 | RF-MOR-042; M08 §5.4; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Lo cobrado en el acto genera una solicitud de cargo a M05 por cuenta, situación de IVA, situación de IIBB y opcionalmente por tipo de documento, con ítems "Intereses – {comprobante}" e "Intereses en Vto – {comprobante}", relacionada con… | Un cobro de 3 facturas con interés emite un documento con 3 ítems relacionados. |
| CP-MOR-0043 | RF-MOR-043; M08 §5.4; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Tipo del documento del interés cobrado en el acto: factura o nota de débito según política; si el total es negativo (descuento), se emite crédito. | Con ND configurada, se emite ND asociada; con descuento neto, NC. |
| CP-MOR-0044 | RF-MOR-044; M08 §5.4; PRO-O5-01 | O5 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Lo diferido genera un **interés diferido** que se incorpora como cargo en la próxima factura del servicio de origen (si la política lo relaciona) o de la cuenta. | La próxima factura incluye el ítem del interés diferido y lo marca consumido. |
| CP-MOR-0045 | RF-MOR-045; M08 §5.4; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | En cuotas de convenio, los ítems de interés se copian por subtipo (financiación actual, anterior, mora) y se relacionan con el convenio. | El documento de interés de una cuota referencia el convenio. |
| CP-MOR-0046 | RF-MOR-046; M08 §5.4; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Recargos por medio de pago (cheque de terceros, transferencia, tarjeta) se documentan con sus conceptos; la regla pertenece a M07 y el cálculo de interés por valores a M08. | El recargo por tarjeta usa el concepto de tarjeta. |
| CP-MOR-0047 | RF-MOR-047; M08 §5.4; PRO-O5-01 | O5 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Recargo por **cobranza remota** (concepto e importe) se agrega solo si la política de M07 lo habilita y es admisible. | M08 solo lo muestra en la cotización. |
| CP-MOR-0048 | RF-MOR-048; M08 §5.4; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | El vendedor/origen del cargo de intereses es configurable. | Los cargos de la corrida masiva llevan el origen configurado. |
### 1.5 Proceso masivo de intereses a facturar (M08 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0049 | RF-MOR-049; M08 §5.5; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Ejecutar una **corrida de intereses a facturar** con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés sobre… | Cada filtro está disponible y queda registrado en la corrida. |
| CP-MOR-0050 | RF-MOR-050; M08 §5.5; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Seleccionar documentos de débito no anulados sin marca "sin interés"; según opción, con saldo, o pagados fuera de término (pagos posteriores al vencimiento dentro del rango). | Una factura pagada 10 días tarde entra con opción "pagos fuera de término". |
| CP-MOR-0051 | RF-MOR-051; M08 §5.5; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular el interés por **tramos entre pagos sucesivos** con el saldo vigente en cada tramo: escalones entre vencimientos dentro del tramo y, luego del último vencimiento, `saldo × días × tasa`. | Una factura con dos pagos parciales tiene tres tramos con saldos decrecientes. |
| CP-MOR-0052 | RF-MOR-052; M08 §5.5; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Opción **no calcular interés sobre interés**: descontar de la base la proporción del interés ya facturado. | La base excluye el interés ya facturado del documento. |
| CP-MOR-0053 | RF-MOR-053; M08 §5.5; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Opción de interés por **valores diferidos** (cheques posteriores al último vencimiento) hasta la fecha promedio de los valores. | Un pago con cheque a 30 días genera interés hasta la fecha del cheque. |
| CP-MOR-0054 | RF-MOR-054; M08 §5.5; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Opción **punitorio único** sobre saldo (sin días) y opción **solo sobre cargos** con tasa configurable, como variantes declaradas de la corrida (sin valores fijos en código). | El 3 % de CAU se configura como tasa, no está fijo. |
| CP-MOR-0055 | RF-MOR-055; M08 §5.5; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Generar **preliminar** con detalle por documento y tramo; el operador puede destildar tramos o documentos; solo lo seleccionado se factura. | Destildar un tramo lo excluye del total y del cargo. |
| CP-MOR-0056 | RF-MOR-056; M08 §5.5; PRO-O6-01 | O6 | Estándar | integración | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Generar **un cargo por cuenta** (agrupado por situación de IVA, cuenta y titular) con un ítem por documento, destinado a la próxima factura; procesar en bloques con progreso, reanudable e idempotente. | Reejecutar la corrida no duplica cargos. |
| CP-MOR-0057 | RF-MOR-057; M08 §5.5; PRO-O6-01 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Actualizar la marca "interés liquidado hasta" de cada documento incluido. | Un cobro posterior en caja no vuelve a cobrar el período facturado. |
| CP-MOR-0058 | RF-MOR-058; M08 §5.5; PRO-O6-01 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. | Dos corridas concurrentes no duplican números. |
### 1.6 Bloqueos de comprobantes (M08 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0059 | RF-MOR-059; M08 §5.6; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Bloquear y desbloquear documentos por **causa** (catálogo), individual o masivamente, con historial (causa, fecha, usuario). | Cada cambio de bloqueo genera un registro de historial con el identificador del usuario. |
| CP-MOR-0060 | RF-MOR-060; M08 §5.6; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Existir **bloqueos de sistema** no editables por usuarios (equivalente a `ID_BLO = -1`). | Un intento de liberar un bloqueo de sistema devuelve error 409. |
| CP-MOR-0061 | RF-MOR-061; M08 §5.6; PRO-O6-01 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Desbloquear con interés**: al liberar, calcular un porcentaje configurado y generar el cargo con concepto y tipo de documento propios. | Desbloquear con 5 % sobre ARS 10.000 genera un cargo de ARS 500 más impuestos. |
| CP-MOR-0062 | RF-MOR-062; M08 §5.6; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Informar a M07 si se permite cobrar documentos o talones bloqueados en caja, y ocultarlos en autogestión si así se configura. | Con la opción desactivada, la caja no permite seleccionar un bloqueado. |
| CP-MOR-0063 | RF-MOR-063; M08 §5.6; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Bloquear opcionalmente los documentos notificados al generar o procesar una notificación. | La notificación con "bloquear" marca sus documentos con la causa elegida. |
| CP-MOR-0064 | RF-MOR-064; M08 §5.6; PRO-O6-01 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Bloquear la caja (cobro de documentos del servicio) mientras exista una orden de cambio de estado por mora pendiente, si la política lo indica. | Con la opción activa, el cobro advierte o bloquea según configuración. |
### 1.7 Política de mora configurable por servicio y categoría (BASE §68) (M08 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0065 | RF-MOR-065; M08 §5.7; PRO-O6-02 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Definir **políticas de mora** versionadas por servicio y categoría con: días desde vencimiento para ser candidato, monto mínimo de deuda, cantidad mínima de documentos, instancias y su orden, canales por instancia, plazos de gracia e… | Una política publicada se aplica solo a las cuentas de su servicio y categoría vigentes. |
| CP-MOR-0066 | RF-MOR-066; M08 §5.7; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Soportar **cuenta separada por servicio o unificada** del socio; la evaluación de mora conserva la deuda por servicio y documento. | En cuenta unificada, la evaluación muestra la deuda por servicio. |
| CP-MOR-0067 | RF-MOR-067; M08 §5.7; PRO-O6-02 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Configurar **pago mínimo** (importe, porcentaje, obligaciones exigibles o fórmula) con finalidad explícita; nunca se infiere que el mínimo cancela el resto. | Pagar el mínimo no reduce el saldo de las demás facturas. |
| CP-MOR-0068 | RF-MOR-068; RN-FIS-127, RN-MOR-142; M08 §5.7; PRO-O6-02 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Definir el **saldo elegible** para mora: capital vencido, cargos autorizados, exclusiones, convenios y créditos. Los conceptos de terceros se excluyen por defecto y solo se incluyen si el convenio con el tercero lo autoriza (RN-MOR-142… | Las cuotas no vencidas de un convenio no integran el saldo elegible. Una factura con ARS 10.000 de servicio vencido y ARS 1.500 de tasa municipal da saldo elegible ARS 10.000 sin convenio que lo autorice. |
| CP-MOR-0069 | RF-MOR-069; M08 §5.7; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Evaluar los **efectos de incumplimiento en cuenta unificada** por servicio: permitido, pendiente de revisión o bloqueado, con motivo; la afectación cruzada está deshabilitada por defecto. | La deuda de cementerio parque no habilita por sí sola suspender agua o electricidad. |
| CP-MOR-0070 | RF-MOR-070; M08 §5.7; PRO-O6-02 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Configurar **reactivación** por servicio, causa y condición: pago o condición necesaria, intervención técnica, costo habilitado o gratuidad. | La regla de reactivación de Internet sin costo se aplica al confirmar el pago. |
| CP-MOR-0071 | RF-MOR-071; M08 §5.7; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Registrar **excepciones de la política**: reclamos, pagos a verificar, situaciones protegidas, acuerdos y autorizaciones, que detienen o condicionan la evaluación. | Un pago informado pendiente de acreditar detiene la suspensión. |
| CP-MOR-0072 | RF-MOR-072; M08 §5.7; PRO-O6-02 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Ejecutar la **evaluación de mora** (job o a demanda) por cuenta y fecha, conservando obligaciones consideradas, pagos confirmados e imputación exacta por factura. | La evaluación de ESC-MOR-06 reproduce el ejemplo de ARS 40.000. |
| CP-MOR-0073 | RF-MOR-073; M08 §5.7; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | La evaluación **no ejecuta cortes**: genera candidatos, notificaciones o propuestas de interrupción según la política. | Ninguna evaluación cambia el estado de un servicio. |
| CP-MOR-0074 | RF-MOR-074; M08 §5.7; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Versionar, auditar y publicar la política con fecha efectiva; un cambio no altera evaluaciones ya cerradas. | La evaluación cerrada conserva la versión con la que se hizo. |
### 1.8 Instancias y candidatos (M08 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0075 | RF-MOR-075; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Administrar **instancias** configurables (código, nombre, orden, días, tipo: candidatos, aviso, intimación, sensible, corte, tratamiento, cierre), sin límite de cantidad. | Se precargan Candidatos, Primera instancia y Segunda instancia, y el tenant puede agregar Sensible y Corte. |
| CP-MOR-0076 | RF-MOR-076; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Marcar en las instancias cuál es la de **candidatos**, la **inicial** de mora, la **sensible** (riesgo de corte) y la **de corte**. | La exportación ERSeP usa las marcas sensible y corte. |
| CP-MOR-0077 | RF-MOR-077; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Generar candidatos** con filtros de cuenta (geografía, zona, sector, recorrido), servicio, estado y categoría del servicio, clase de deuda (financiación o no), tipos de documento, fecha de deuda por emisión o VTO1, rango de montos, tipo… | Cada filtro reduce el universo según lo esperado. |
| CP-MOR-0078 | RF-MOR-078; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Excluir cuentas con **excepción de mora** vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. | Una excepción con fecha de deuda 01-06 deja fuera los documentos vencidos antes del 01-06. |
| CP-MOR-0079 | RF-MOR-079; M08 §5.8; PRO-O6-02 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Excluir cuentas ya notificadas con notificación abierta, salvo opciones de ignorar notificación previa, ignorar candidato previo, verificar solo la instancia inicial o excluir por el mismo tipo de notificación. | Con "ignorar notificación previa" desactivado, una cuenta notificada no se vuelve a cargar e informa el motivo. |
| CP-MOR-0080 | RF-MOR-080; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Crear la notificación de candidato con **lote** nuevo, documentos incluidos con su saldo, deuda (suma de saldos) y deuda actualizada (con intereses sin diferir); no crear si la deuda es 0. | Una cuenta con deuda 0 no genera notificación. |
| CP-MOR-0081 | RF-MOR-081; M08 §5.8; PRO-O6-02 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Excluir de candidatos las deudas incluidas en convenios vigentes (se consideran las cuotas) y los documentos con reclamo de facturación en trámite sobre el importe reclamado. | La deuda original de un convenio vigente no aparece como candidata. |
| CP-MOR-0082 | RF-MOR-082; M08 §5.8; PRO-O6-02 | O6 | Estándar | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Incluir o no titulares dados de baja en el informe de candidatos/circulares por defecto. | La opción cambia el universo del informe. |
### 1.9 Notificaciones, entrega y constancias (M08 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0083 | RF-MOR-083; M08 §5.9; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Procesar** notificaciones abiertas hacia la instancia destino con filtros: vencidas al (vencimiento de la notificación), fecha, lote, cuenta, servicio, tipo de documento, barrio, localidad, empresa postal, deuda anterior a una fecha… | Solo se procesan notificaciones abiertas con vencimiento cumplido y sin promesa vigente. |
| CP-MOR-0084 | RF-MOR-084; M08 §5.9; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` | Al procesar: crear nueva notificación con nuevo lote, instancia destino, vencimiento, modelo/plantilla y entrega automática según configuración; incluir los documentos impagos de la anterior o toda la deuda vencida; recalcular deuda… | La anterior queda Procesada y vinculada a la nueva. |
| CP-MOR-0085 | RF-MOR-085; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Agregar una **nota en la cuenta** "Notificación de mora" (y "Notificación cerrada" al cerrar) visible en la ficha del titular. | La ficha del titular muestra la nota con fecha e instancia. |
| CP-MOR-0086 | RF-MOR-086; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Generar opcionalmente un **comprobante de deuda notificada** por titular o por cuenta, con el tipo de documento por defecto. | Con la opción por defecto activa, cada notificación genera su comprobante de deuda. |
| CP-MOR-0087 | RF-MOR-087; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Generar opcionalmente un **costo de envío** de la notificación con concepto e importe (de la plantilla o del parámetro), solo si el cargo está habilitado con fundamento. | Sin habilitación normativa el costo no puede activarse. |
| CP-MOR-0088 | RF-MOR-088; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` | Definir **modelos de aviso** por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. | Cada notificación conserva la versión del modelo utilizada. |
| CP-MOR-0089 | RF-MOR-089; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Canales: documento impreso, correo electrónico, SMS, WhatsApp, push de la app, aviso telefónico y talón de pago; el envío lo hace T09. | Una notificación por correo crea un mensaje en T09 con referencia a la notificación. |
| CP-MOR-0090 | RF-MOR-090; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Antes de enviar por correo o SMS, listar las cuentas **sin dirección o sin celular** (por defecto, sin ambos correos: el de la cuenta y el del portal) y permitir descartarlas o derivarlas a otro canal. | La lista muestra las cuentas sin destinatario antes de confirmar. |
| CP-MOR-0091 | RF-MOR-091; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Registrar estados del mensaje (creado, encolado, aceptado por el proveedor, entregado, leído, fallido, rebotado) y la **evidencia requerida** por instancia; una instancia que exige constancia no se considera notificada solo con "aceptado". | Una intimación con correo rebotado queda "Sin constancia" y genera tarea de canal alternativo. |
| CP-MOR-0092 | RF-MOR-092; M08 §5.9; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Marcar entrega** manual o automática (y "todas entregadas"); con la entrega, el vencimiento de la notificación pasa a fecha de entrega + días configurados, solo extendiéndolo; desmarcar no revierte el vencimiento. | Entregada el 10-11 con 10 días, el vencimiento pasa a 20-11 si antes era menor. |
| CP-MOR-0093 | RF-MOR-093; M08 §5.9; PRO-O6-03 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir fijar un vencimiento de notificación anterior a hoy solo si la política lo habilita. | Sin la opción, la fecha pasada se rechaza. |
| CP-MOR-0094 | RF-MOR-094; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Registrar **promesas de pago** con fecha e importe, que suspenden el avance hasta esa fecha; una promesa vencida incumplida retoma el circuito y se registra. | Con promesa al 25-11, la notificación no avanza antes de esa fecha. |
| CP-MOR-0095 | RF-MOR-095; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Calificar** al deudor (Sin calificar, Buena, Regular, Mala) y consultar el historial de notificaciones calificadas como antecedente. | La pantalla de antecedentes muestra las calificaciones previas. |
| CP-MOR-0096 | RF-MOR-096; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | **Dar de baja** una notificación con causa (Excluida), **cerrar** notificaciones (con bloqueo de caja opcional), **anular un lote** (reabre el anterior) y **eliminar** notificaciones sin efectos económicos, todo auditado. | Anular un lote reabre las notificaciones anteriores y deja rastro. |
| CP-MOR-0097 | RF-MOR-097; M08 §5.9; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Registrar la **bitácora estructurada** de cada notificación (fecha, usuario, proceso, observación, estado anterior y nuevo). | El informe de promesas no parsea texto. |
| CP-MOR-0098 | RF-MOR-098; M08 §5.9; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Avisar si cambió la **composición de la deuda** notificada (abonada o con saldo distinto) al consultar o procesar; distinguir documentos notificados de deuda nueva. | La grilla marca "abonada" o "composición cambió" sin cambiar el estado. |
### 1.10 Tratamiento de morosos (M08 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0099 | RF-MOR-099; M08 §5.10; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Listar, para notificaciones abiertas con vencimiento cumplido y sin promesa vigente, los **servicios conectados** de la cuenta, con filtros de pagos parciales y cantidad de pagados. | Solo aparecen servicios en estado conectado. |
| CP-MOR-0100 | RF-MOR-100; M08 §5.10; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Acciones disponibles por servicio: **suspensión/desconexión**, **cambio de estado** (restricción, reducción de velocidad u otro estado sin corte físico), **cambio de categoría**, **reclamo/incidente técnico**, **baja administrativa por… | Cada acción crea un caso de interrupción con su tipo. |
| CP-MOR-0101 | RF-MOR-101; M08 §5.10; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. | La segunda solicitud devuelve error "orden pendiente". |
| CP-MOR-0102 | RF-MOR-102; M08 §5.10; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Toda acción pasa por la **evaluación normativa** del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. | Una suspensión de un electrodependiente acreditado queda bloqueada. |
| CP-MOR-0103 | RF-MOR-103; M08 §5.10; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Si el servicio **requiere técnica**, generar orden de trabajo hacia M10 con origen "gestión de mora", marca de moroso y vínculo a la notificación y al caso; si no requiere técnica, ejecutar el cambio directo (servicio, adherentes y… | Internet con aprovisionamiento remoto genera orden con acción de red. |
| CP-MOR-0104 | RF-MOR-104; M08 §5.10; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Armar los datos de la orden desde el servicio (medidor, domicilio del servicio, catastro, GPS, categoría, certificado) o desde la cuenta si el tratamiento es a nivel cuenta. | La orden muestra el domicilio del servicio. |
| CP-MOR-0105 | RF-MOR-105; M08 §5.10; PRO-O6-03 | O6 | Estándar | seguridad | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Exigir observación técnica en la orden salvo que la política permita omitirla. | Sin observación y sin permiso, la orden no se genera. |
| CP-MOR-0106 | RF-MOR-106; M08 §5.10; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Marcar la notificación en estado **En técnica** al generar la orden, si la política lo indica. | La notificación pasa a En técnica. |
| CP-MOR-0107 | RF-MOR-107; M08 §5.10; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Generar desde tratamiento de morosos **comprobantes** (cargos admitidos) e **incidentes técnicos**, y notificar titulares. | Los cargos solo pueden usar conceptos habilitados. |
| CP-MOR-0108 | RF-MOR-108; M08 §5.10; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Para baja administrativa por mora: requerir política que la habilite para el servicio, instancia de corte cumplida y aprobación; nunca masiva por saldo agregado. | Un lote de bajas exige aprobación individual o por lote con revisión por servicio. |
### 1.11 Excepciones y protecciones (M08 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0109 | RF-MOR-109; M08 §5.11; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Administrar **excepciones de mora** por cuenta (o titular, o persona) con motivo, "no reclamar", "no retener/no cobrar interés", fecha hasta la que rige, deuda anterior a una fecha, fecha de cancelación, usuario que registra y que autoriza. | Una excepción solo rige luego de ser autorizada. |
| CP-MOR-0110 | RF-MOR-110; M08 §5.11; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Autorizar y desautorizar** excepciones (doble control), con nota en la cuenta e impresión opcional del informe al confirmar. | Quien registra no puede autorizar la misma excepción si la política exige doble control. |
| CP-MOR-0111 | RF-MOR-111; M08 §5.11; PRO-O6-03 | O6 | Núcleo | regla | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Administrar **protecciones normativas** acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de la… | Una protección vencida deja de bloquear y genera alerta previa a su vencimiento. |
| CP-MOR-0112 | RF-MOR-112; M08 §5.11; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Una protección de tipo **bloqueante** impide suspender, cortar o dar de baja por mora el servicio; una de tipo **revisión** exige aprobación específica. | El intento de suspender queda Bloqueado con el motivo. |
| CP-MOR-0113 | RF-MOR-113; M08 §5.11; PRO-O6-03 | O6 | Estándar | funcional | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Alertar al vencer o a N días de vencer una protección o excepción. | Se genera tarea al responsable 30 días antes (configurable). |
| CP-MOR-0114 | RF-MOR-114; M08 §5.11; PRO-O6-03 | O6 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Informe de excepciones por mora con motivo, vigencia, usuarios y deuda calculada en modo "diferir todo". | El informe lista cada excepción y su deuda. |
| CP-MOR-0115 | RF-MOR-115; M08 §5.11; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Reconocer como protección temporal los **reclamos de facturación** en trámite (M09) sobre el importe reclamado y los **pagos informados** pendientes de acreditar (M07). | Un reclamo abierto excluye el documento reclamado de la evaluación. |
| CP-MOR-0116 | RF-MOR-116; M08 §5.11; PRO-O6-03 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Administrar **causas** codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). | Cada acción con causa exige una del tipo correcto. |
### 1.12 Corte y reconexión (M08 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0117 | RF-MOR-117; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Reglas de interrupción: BAJA-DEMO ARS 0; SUS-DEMO-GRATIS ARS 0 (1–3 meses); REACT-DEMO-GRATIS ARS 0; REACT-DEMO-ARANCEL ARS 5.000 **deshabilitada para producción** | Crear **casos de interrupción** por servicio con tipo, motivo, instancia que lo origina, evaluación, aprobación, orden, confirmación y comunicación al socio. | Cada caso puede explicarse por sus transiciones (§8). |
| CP-MOR-0118 | RF-MOR-118; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Generar la **orden de corte** al cumplirse la instancia de corte y enviarla a la cuadrilla o al aprovisionamiento remoto, siempre con los controles de la política. | La orden llega a M10 con origen `delinquency` y referencia al caso. |
| CP-MOR-0119 | RF-MOR-119; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Respetar **ventanas de ejecución** por servicio y jurisdicción (días y horarios permitidos, feriados y vísperas, condiciones climáticas o de emergencia declaradas). La plantilla por defecto de electricidad en Córdoba (ERSeP) se define en… | Una orden fuera de ventana queda programada para la próxima ventana válida. |
| CP-MOR-0120 | RF-MOR-120; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Exigir **preaviso** mínimo con constancia de entrega antes de suspender, por servicio. | Sin constancia de la intimación previa, la suspensión queda Pendiente de evidencia. |
| CP-MOR-0121 | RF-MOR-121; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Cancelar la orden de corte pendiente** si se confirma el pago de la deuda que la originó antes de su ejecución; quitar la marca de moroso si no hay reconexión pendiente. | Un pago confirmado antes de la visita cancela la orden y avisa a la cuadrilla. |
| CP-MOR-0122 | RF-MOR-122; M08 §5.12; PRO-O6-04 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Reconexión automática** al regularizar: evaluar con el criterio de deuda configurado (toda, vencida al VTO1, vencida al último vencimiento, solo del mismo servicio/tipo, o sin notificaciones abiertas con deuda del servicio). | Saldada la deuda del servicio, se crea el caso de reconexión. |
| CP-MOR-0123 | RF-MOR-123; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | La reconexión automática aplica solo a servicios **suspendidos por mora** vinculados a un caso de interrupción (no por ventana de días). | Un servicio dado de baja por pedido del socio no se reconecta por un pago. |
| CP-MOR-0124 | RF-MOR-124; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Para servicios sin técnica, reconectar directamente; con técnica, generar orden de reconexión y, si la política lo permite y hay aprovisionamiento remoto confirmable, confirmarla automáticamente con la respuesta de T06. | Internet: pago confirmado → acción MikroTik → respuesta OK → servicio activo. |
| CP-MOR-0125 | RF-MOR-125; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Si el sistema remoto devuelve error o no hay sistema vigente, la orden **vuelve a pendiente** y el servicio no se marca reconectado. | Un error de red deja el caso "Ejecución fallida" con tarea al técnico. |
| CP-MOR-0126 | RF-MOR-126; M08 §5.12; PRO-O6-04 | O6 | Estándar | regla | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Generar el **cargo de reconexión** según reglas (servicio, socio activo, moroso, prepago, zona, localidad, categoría, clase, estado, propiedad; una sola vez; antes o después de ejecutar), solo si el cargo está habilitado con fundamento… | Sin habilitación, la reconexión no genera cargo. |
| CP-MOR-0127 | RF-MOR-127; M08 §5.12; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Al reconectar servicios de cargo proporcional, generar **crédito por días sin servicio** o débito por días restantes según política, con confirmación opcional y concepto propio; actualizar fecha de alta para no medidos reconectados en el… | Reconexión el día 20 de un abono mensual con crédito por días: crédito de 19 días. |
| CP-MOR-0128 | RF-MOR-128; M08 §5.12; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Validar la reconexión: titular fallecido (permitida o no), factibilidad exigida en servicios que informan a técnica, inspección de rehabilitación en gas. | Gas: la reconexión exige inspección aprobada. |
| CP-MOR-0129 | RF-MOR-129; M08 §5.12; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Al confirmar la desconexión, marcar medidor retirado por defecto o preguntar al técnico, según política (servicios medidos). | La confirmación muestra la pregunta si está configurada. |
| CP-MOR-0130 | RF-MOR-130; M08 §5.12; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Impactar las operaciones de cambio de estado (desconexión y reconexión) en sistemas externos (Discar, SITSA, AION, MikroTik, RADIUS, SmartOLT) mediante T06. | La acción de red queda registrada con su respuesta. |
| CP-MOR-0221 | RF-MOR-221; RN-MOR-145; M08 §5.12; PRO-O7-09 | O7 | Núcleo | regla | TEN-001 con Restricciones: Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) | Precargar en el catálogo normativo de plataforma (API-MOR-51) la **plantilla de ventana de corte ERSeP** para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica o… | Con la plantilla adoptada y sin validar, una orden de corte de ELE pasa a `review`; ya validada, una orden generada un viernes víspera de feriado se reprograma al siguiente día hábil (RN-MOR-145). |
| CP-MOR-0222 | RF-MOR-222; M08 §5.12; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Configurar por servicio el **modo de suspensión por mora** (`restricted` o `interrupted`) y su perfil (bloqueo saliente en TEL, grilla mínima en TV, reducción de caudal en AG), validado contra los modos admitidos de la matriz; CLO no… | Guardar una política de CLO con `finalAction.type = suspend` falla con `mor/mode-not-allowed`; una política TEL con `interrupted` sin habilitación del tenant también. |
| CP-MOR-0223 | RF-MOR-223; RN-MOR-141, RN-MOR-142; M08 §5.12; PRO-O6-02 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Excluir de la evaluación de interrupción la deuda de conceptos de terceros (RN-MOR-141) y del saldo elegible e intereses salvo convenio (RN-MOR-142), mostrando en la evaluación el importe excluido y su motivo. | Un socio que solo adeuda la tasa de alumbrado no llega a instancia de corte del servicio ELE; la evaluación muestra "deuda de terceros excluida". |
| CP-MOR-0224 | RF-MOR-224; RN-MOR-143, RN-MOR-144; M08 §5.12; PRO-O10-04 | O10 | Estándar | integración | TEN-001 con Reglas de interrupción: BAJA-DEMO ARS 0; SUS-DEMO-GRATIS ARS 0 (1–3 meses); REACT-DEMO-GRATIS ARS 0; REACT-DEMO-ARANCEL ARS 5.000 **deshabilitada para producción** | Informar a M18 la condición "cobertura suspendida por mora" según la restricción `socialCoverageSuspension` (RN-MOR-143), mediante EVT-MOR-21 `mor.socialCoverage.suspended` / `.restored` (idempotente por contrato y fecha de cambio) y crear… | Con 3 meses impagos y la restricción activa, M18 consulta la condición y la verificación de cobertura la rechaza; un aporte impago de banco de sangre crea una sola tarea por contrato y período y ningún caso de interrupción. |
### 1.13 Baja, suspensión y reactivación (BASE §53) (M08 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0131 | RF-MOR-131; M08 §5.13; PRO-O6-05 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Recibir la **baja** desde el canal del usuario (portal, app, landing pública sin registro cuando corresponda), con registro, constancia, seguimiento y ejecución **sin cargo por solicitarla**. | Una baja de Internet desde la landing devuelve código identificador al instante y por el mismo medio dentro de 24 h. |
| CP-MOR-0132 | RF-MOR-132; M08 §5.13; PRO-O6-05 | O6 | Núcleo | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | No supeditar la solicitud de baja a pagar deuda, completar un registro o aceptar un cargo; conservar deuda previa y documentos históricos. | Una cuenta con deuda puede solicitar la baja. |
| CP-MOR-0133 | RF-MOR-133; M08 §5.13; PRO-O6-05 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Suspensión temporal** solicitada por el socio con duración, motivo y fecha efectiva, si el servicio la admite. | Internet permite suspender de 1 a N meses según configuración del servicio. |
| CP-MOR-0134 | RF-MOR-134; M08 §5.13; PRO-O6-05 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Suspensión por otro motivo** (técnico, seguridad, orden de autoridad, uso indebido) distinta de la suspensión por mora. | El tipo de caso queda distinguido en informes. |
| CP-MOR-0135 | RF-MOR-135; M08 §5.13; PRO-O6-05 | O6 | Núcleo | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Reactivación** por condiciones y actuaciones correspondientes; reactivar un contrato cerrado puede requerir nueva alta según el servicio. | Internet dado de baja exige nueva alta; Internet suspendido se reactiva. |
| CP-MOR-0136 | RF-MOR-136; M08 §5.13; PRO-O6-05 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Modalidades con y sin costo**: política configurable y validada por servicio y jurisdicción; la baja siempre gratuita; costos admisibles solo con respaldo; la regla arancelada de demostración está deshabilitada para producción. | La regla REACT-DEMO-ARANCEL no puede activarse en un tenant productivo sin aprobación del responsable normativo. |
| CP-MOR-0137 | RF-MOR-137; M08 §5.13; PRO-O6-05 | O6 | Núcleo | funcional | TEN-001 con Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 | Presentar las opciones disponibles según servicio y situación; informar fecha solicitada, plazo de respuesta, efecto esperado y eventual costo habilitado; conservar la aceptación de condiciones para operaciones aranceladas. | La app muestra costo ARS 0 o el costo habilitado y guarda la aceptación. |
| CP-MOR-0138 | RF-MOR-138; M08 §5.13; PRO-O6-05 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | Ingresar la gestión al CRM con orden técnica si se requiere; registrar el momento real de suspensión o reactivación y su comunicación al socio. | El caso registra fecha real de ejecución distinta de la de solicitud. |
| CP-MOR-0139 | RF-MOR-139; M08 §5.13; PRO-O6-05 | O6 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). | Una suspensión voluntaria de Internet aplica la regla de pausa de abono configurada. |
| CP-MOR-0140 | RF-MOR-140; M08 §5.13; PRO-O6-05 | O6 | Núcleo | integración | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Evitar cobros o ejecuciones duplicadas por reintentos (idempotencia) y no anunciar "reactivado" por la sola confirmación del pago de un cargo. | Dos clics de "reactivar" generan un único caso. |
### 1.14 Planes de pago y convenios (AGR-014) (M08 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0141 | RF-MOR-141; M08 §5.14; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | **Segmentar deuda** por antigüedad, monto y situación y administrar **expedientes de seguimiento** con contactos, compromisos, respuestas y próximos pasos. | El tablero de deuda segmenta por tramos de antigüedad 0–30, 31–60, 61–90, 91–180, >180 días. |
| CP-MOR-0142 | RF-MOR-142; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | **Simulador** de plan: deuda seleccionable, anticipo, cantidad de cuotas, tasa, método, quitas, sellado, primer vencimiento, con cronograma, total, intereses, impuestos, TNA, TEM, TEA y **CFT**. | El simulador muestra el CFT y el cronograma completo antes de confirmar. |
| CP-MOR-0143 | RF-MOR-143; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Calcular cuotas con los métodos **sin interés, interés directo, francés, alemán, americano y cuotas con saldo**. | Las fórmulas reproducen los ejemplos de §17. |
| CP-MOR-0144 | RF-MOR-144; M08 §5.14; PRO-O6-06 | O6 | Estándar | regla | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | Calcular la **cantidad de cuotas para un importe de cuota objetivo** respetando mínimos y máximos del plan, con avisos. | Pedir cuota de ARS 10.000 sobre ARS 45.000 devuelve 5 cuotas. |
| CP-MOR-0145 | RF-MOR-145; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Seleccionar las **obligaciones incluidas** verificando que no estén en otro convenio vigente ni bloqueadas por gestión judicial sin autorización; respetar mínimo y máximo de documentos. | Un documento ya incluido en otro convenio no puede seleccionarse. |
| CP-MOR-0146 | RF-MOR-146; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Componer el convenio: capital, interés anterior (de financiaciones previas), interés por mora a la fecha, quitas, entrega, sellado y tasas, conservando por documento capital, interés entre vencimientos e interés por mora. | La suma de componentes iguala la deuda total incluida. |
| CP-MOR-0147 | RF-MOR-147; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Aprobar condiciones especiales** fuera del plan (más cuotas, mayor quita, menor anticipo, tasa distinta) mediante workflow T11. | Un convenio fuera de plan queda Pendiente de aprobación. |
| CP-MOR-0148 | RF-MOR-148; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Registrar el convenio en forma **transaccional**: sustituir/bloquear las obligaciones de origen, cerrar notificaciones abiertas, generar cuotas y cargos de entrega/sellado, y registrar capital social si corresponde. | Un fallo intermedio revierte todo; no quedan cuotas huérfanas. |
| CP-MOR-0149 | RF-MOR-149; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Modalidad de cuotas: **cuota en factura mensual** (cargo pendiente) o **cuota como documento propio** (chequera), con modalidad por defecto y permiso para cambiarla. | En modo factura mensual, la cuota aparece en la factura del período de su vencimiento. |
| CP-MOR-0150 | RF-MOR-150; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Anticipo (cuota 0) con vencimiento hoy; el convenio queda **Pendiente de anticipo** hasta su pago confirmado y no se marca cumplido ni vigente. | Sin pago del anticipo en el plazo, el convenio pasa a Caído sin anticipo y las obligaciones de origen se restituyen. |
| CP-MOR-0151 | RF-MOR-151; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Validar límites: máximo de convenios por período (con fechas del período de control), una sola financiación activa del mismo tipo, importe mínimo de cuota, mínimo y máximo financiable, entrega mínima (opcionalmente sobre total con IVA)… | Superar el máximo de convenios bloquea o advierte según política. |
| CP-MOR-0152 | RF-MOR-152; M08 §5.14; PRO-O6-06 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Permitir imputar el convenio a **otra cuenta** (con titular y situación fiscal de la cuenta destino) solo si la política lo habilita. | La cuota se emite a la cuenta destino. |
| CP-MOR-0153 | RF-MOR-153; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Generar el **texto del convenio** desde plantilla con y sin garante (el plan puede sobrescribirla), imprimirlo automáticamente si se configura, y conservar el PDF con hash. | El PDF del convenio se archiva en el expediente de T11. |
| CP-MOR-0154 | RF-MOR-154; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Registrar **firmantes** (titular, codeudor, garantes, representante) y sus **firmas** (presencial en tableta, aceptación electrónica con OTP y evidencia, firma digital como extensión). | El convenio pasa a Vigente solo con todas las firmas exigidas. |
| CP-MOR-0155 | RF-MOR-155; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Controlar cumplimiento e incumplimiento** de cuotas y anticipo; informar estado de cuotas (vencidas impagas, cantidad e importe). | El convenio muestra 2 cuotas vencidas impagas por ARS 30.000. |
| CP-MOR-0156 | RF-MOR-156; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Caída automática** del convenio por incumplimiento según la regla del plan, con aviso previo, y **reexigibilidad** del saldo pendiente. | Con 3 cuotas impagas el convenio pasa a Caído y el saldo pendiente queda exigible. |
| CP-MOR-0157 | RF-MOR-157; M08 §5.14; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Rehabilitar** un convenio caído con aprobación si se regulariza dentro del plazo de la política. | Pagando las cuotas atrasadas dentro de 15 días se rehabilita con aprobación. |
| CP-MOR-0158 | RF-MOR-158; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Refinanciación**: incluir cuotas impagas de otro convenio descomponiéndolas en capital, interés anterior y mora anterior; cerrar el convenio anterior como Refinanciado. | El convenio refinanciado queda vinculado al nuevo. |
| CP-MOR-0159 | RF-MOR-159; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Cancelación anticipada** total o parcial con bonificación del interés de financiación no devengado (cuotas adelantadas), según conceptos configurados. | Cancelar 3 cuotas antes de su vencimiento bonifica su interés de financiación. |
| CP-MOR-0160 | RF-MOR-160; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Anular** un convenio solo sin cuotas pagas ni facturadas, sin pago del sellado y sin notificaciones asociadas (o tras resolverlas), con permiso y confirmación; restituir obligaciones de origen (saldo y fecha de saldo), anular cuotas… | Un convenio anulado conserva su historia y las facturas originales recuperan su saldo. |
| CP-MOR-0161 | RF-MOR-161; M08 §5.14; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Tabla de índices `IDX-DEMO`: Valores mensuales 100, 101,5, 103 (ilustrativos) | **Ajuste por índice** de cuotas (tabla de índices del plan con rezago configurable y concepto de ajuste) y aviso si falta el índice. | Si falta el índice se genera alerta y la cuota no se emite sin decisión. |
| CP-MOR-0162 | RF-MOR-162; M08 §5.14; PRO-O6-06 | O6 | Estándar | regla | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | **Recalcular cuotas** impagas por cambio de situación de IVA o de alícuota de percepción IIBB del padrón: manteniendo netos (cambia el total) o manteniendo el total (reajusta netos). | El recálculo genera ajuste trazable por cuota. |
| CP-MOR-0163 | RF-MOR-163; M08 §5.14; PRO-O6-06 | O6 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Mora de cuotas**: tasa general o recargo diario propio del plan. | Una cuota de un plan con recargo propio usa esa tasa. |
| CP-MOR-0164 | RF-MOR-164; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Quitas** sobre interés anterior y sobre interés por mora (porcentaje), con opción de **no capitalizar** la mora. | Quita 50 % de mora sobre ARS 2.000 → ARS 1.000. |
| CP-MOR-0165 | RF-MOR-165; M08 §5.14; PRO-O6-06 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | **Sellado** (tasa por mil) en la cuota 0 o en documento propio, con concepto propio. | Sellado 10 ‰ sobre ARS 60.000 = ARS 600 (valor ilustrativo). |
| CP-MOR-0166 | RF-MOR-166; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Separar el IVA del capital y del interés de cada cuota con los conceptos de capital, interés por mora, interés anterior, interés de financiación y sellado; tratar tasa con IVA incluido. | La cuota muestra capital, intereses e IVA por concepto. |
| CP-MOR-0167 | RF-MOR-167; M08 §5.14; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Efecto de la **baja del servicio** sobre un convenio vigente: el convenio sigue exigible salvo política distinta; la baja no se condiciona al convenio. | Dar de baja Internet no anula el convenio. |
| CP-MOR-0168 | RF-MOR-168; M08 §5.14; PRO-O6-06 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Aplicación de pagos a cuotas (orden por vencimiento) coordinada con M07; pagos que exceden la cuota se imputan a la siguiente o quedan a favor según AGR-012. | Un pago de 1,5 cuotas cancela la vencida y deja media cuota imputada a la siguiente. |
| CP-MOR-0169 | RF-MOR-169; M08 §5.14; PRO-O6-06 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Consultas: cuotas del convenio (todas o a pagar), liquidación de crédito o talonario de cuotas, comprobantes financiados del convenio, conceptos financiados. | La ficha imprime el talonario. |
| CP-MOR-0170 | RF-MOR-170; M08 §5.14; PRO-O6-06 | O6 | Núcleo | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Conciliar** deuda de origen, pagos, capital pendiente y cargos del acuerdo sin doble exigencia ni cuotas huérfanas. | El reporte de conciliación cierra a cero diferencias. |
### 1.15 Planes de cuotas y entidades financieras (M08 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0171 | RF-MOR-171; M08 §5.15; PRO-O6-07 | O6 | Núcleo | regla | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | ABM de **planes de pago**: tipo de pago (entrega y cuotas / cuotas sin entrega), período entre cuotas, cantidad sugerida/mínima/máxima, tasas (TNA, TEM, tasa por período), método, mínimos y máximos financiables, mínimo para modificar… | Un plan no se publica con mínimo de cuotas mayor que el máximo. |
| CP-MOR-0172 | RF-MOR-172; M08 §5.15; PRO-O6-07 | O6 | Núcleo | regla | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Cargar la tasa en una unidad declarada (TNA o TEM) y derivar la **tasa por período**; las tasas informativas se calculan, no se copian. | Con TNA 60 % y período mensual, la tasa por período es 5 %. |
| CP-MOR-0173 | RF-MOR-173; M08 §5.15; PRO-O6-07 | O6 | Núcleo | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Catálogo de **métodos de cálculo** (tipos de financiación) con fórmula y descripción. | Los seis métodos están disponibles. |
| CP-MOR-0174 | RF-MOR-174; M08 §5.15; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | ABM de **entidades financieras** (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. | Un plan de tarjeta en 3 cuotas aplica su coeficiente. |
| CP-MOR-0175 | RF-MOR-175; M08 §5.15; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Tipo de documento por defecto para emitir la financiación. | La cuota usa el tipo por defecto si no se indica otro. |
| CP-MOR-0176 | RF-MOR-176; M08 §5.15; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Ofrecer el motor de amortización a M11 para venta financiada y factura en cuotas (conceptos de interés de venta, diferencia de cotización), sin mezclarlo con la regularización. | Una venta en cuotas no figura en informes de convenios de regularización. |
### 1.16 Garantías y garantes (MER-005) (M08 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0177 | RF-MOR-177; M08 §5.16; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Registrar **garantes** (persona de M01) y **garantías** (depósito en garantía, aval, pagaré, fianza, seguro de caución) asociados a contratos, convenios o cuentas, con monto, vigencia y documentación. | Un convenio con garante usa la plantilla con garante. |
| CP-MOR-0178 | RF-MOR-178; M08 §5.16; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Exigir garantía en ciertas contrataciones por regla (inquilinos, grandes usuarios, categoría, servicio), habilitable por tenant. | Un alta de gran usuario con regla activa queda pendiente de garantía. |
| CP-MOR-0179 | RF-MOR-179; M08 §5.16; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Aplicar o devolver** el depósito en la baja con liquidación e imputación trazables (contra deuda o devolución por M14). **Ampliado (HUECO-OTR-04):** la devolución se hace por defecto como crédito a la cuenta del socio en M07 (`refundMode… | La liquidación muestra deuda aplicada y saldo a devolver; con `accountCredit`, EVT-MOR-16 `.refunded` lleva `refundMode` y M07 crea el saldo a favor. |
| CP-MOR-0180 | RF-MOR-180; M08 §5.16; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Cambiar el garante de un convenio con validación (persona válida, firma del nuevo garante) y regenerar la plantilla si cambia el tipo con/sin garante. | Cambiar el garante exige su firma. |
| CP-MOR-0181 | RF-MOR-181; M08 §5.16; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Ejecutar la garantía ante incumplimiento (notificación al garante como destinatario adicional de la gestión de mora). | La instancia configurada notifica también al garante. |
| CP-MOR-0182 | RF-MOR-182; M08 §5.16; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Actualizar el depósito en garantía por índice o regla, si la política lo indica. | La actualización genera documento trazable. |
### 1.17 Incobrables y gestión externa o judicial (MER-006) (M08 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0183 | RF-MOR-183; M08 §5.17; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | **Derivar deuda a gestión externa o judicial** con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. | El expediente lista sus documentos y su estudio. |
| CP-MOR-0184 | RF-MOR-184; M08 §5.17; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | La deuda derivada queda marcada y excluida de la gestión de mora interna mientras el expediente esté activo; los pagos se siguen imputando a la deuda original (M07). | Un pago parcial actualiza el expediente. |
| CP-MOR-0185 | RF-MOR-185; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Estudio: ESTUDIO-DEMO con token de prueba de alcance limitado | Portal o API para **estudios externos** con alcance a sus expedientes: consultar deuda actualizada, registrar avances y gastos. | El estudio A no ve expedientes del estudio B. |
| CP-MOR-0186 | RF-MOR-186; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Registrar **gastos y honorarios** con su tratamiento: a cargo de la cooperativa o trasladables al deudor solo con título (sentencia o convenio). | Un gasto sin título no se carga al deudor. |
| CP-MOR-0187 | RF-MOR-187; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Cerrar el expediente por pago, convenio, incobrable, prescripción o desistimiento, con causa. | El cierre exige causa. |
| CP-MOR-0188 | RF-MOR-188; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Declarar incobrables** con propuesta, criterio (antigüedad, gestión agotada, monto, fallecimiento, insolvencia, prescripción), aprobación y efecto contable, sin borrar la deuda del historial. | El documento declarado incobrable conserva su saldo histórico y queda en estado Incobrable. |
| CP-MOR-0189 | RF-MOR-189; M08 §5.17; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Revertir un incobrable ante recupero, imputando el recupero a la deuda original y publicando el evento contable. | Un recupero genera asiento de recupero. |
| CP-MOR-0190 | RF-MOR-190; M08 §5.17; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Previsión por antigüedad (informe para contabilidad) separada del castigo. | El informe de previsión por tramos alimenta M15. |
| CP-MOR-0191 | RF-MOR-191; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. | La deuda incobrable no genera candidatos. |
| CP-MOR-0192 | RF-MOR-192; M08 §5.17; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` | Mantener la relación de incobrables y expedientes con la persona, de modo que un alta nueva advierta deuda incobrable previa (sin bloquear la baja ni un alta exigible). | Un alta de la misma persona muestra aviso de deuda castigada. |
### 1.18 Prescripción (M08 §5.18)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0193 | RF-MOR-193; M08 §5.18; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Configurar **plazos de prescripción** por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión judicial). | Un convenio firmado reinicia el cómputo de las obligaciones incluidas. |
| CP-MOR-0194 | RF-MOR-194; M08 §5.18; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Informe **Deuda a prescribir**: documentos con saldo cuyo cómputo supera el plazo, agrupados por cuenta, con fecha por defecto hoy menos el plazo. | El informe lista los documentos con VTO1 anterior al corte. |
| CP-MOR-0195 | RF-MOR-195; M08 §5.18; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Registrar la prescripción** con propuesta y aprobación: emitir el documento de signo contrario con el concepto elegido e imputarlo (M05/M07), con cuenta contable de prescripción; la deuda queda en estado Prescripta en el historial. | La factura prescripta conserva su historia y su saldo queda cancelado por el documento de prescripción. |
| CP-MOR-0196 | RF-MOR-196; M08 §5.18; PRO-O6-07 | O6 | Estándar | funcional | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Alertar documentos próximos a prescribir con gestión pendiente (para interrumpir el plazo con acciones válidas). | 60 días antes se genera alerta al responsable de recupero. |
| CP-MOR-0197 | RF-MOR-197; M08 §5.18; PRO-O6-07 | O6 | Estándar | regla | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | No calcular interés ni notificar deuda prescripta. | La deuda prescripta no genera candidatos. |
### 1.19 Informes, tableros y exportaciones (M08 §5.19)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0198 | RF-MOR-198; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Informes de gestión de mora: deuda a prescribir, notificaciones pendientes (sin candidatos), titulares notificados (deuda notificada, actualizada o detalle), excepciones por mora, servicios del lote notificado, promesas de pago, resumen de… | Cada informe declara fórmula, universo y fecha de corte (§15). |
| CP-MOR-0199 | RF-MOR-199; M08 §5.19; PRO-O6-08 | O6 | Núcleo | regla | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Informe de servicios a cortar** (lote, cuenta, medidor, meses de deuda, deuda) y **totales por servicio**. | Meses de deuda = días desde el VTO1 más antiguo / 30, truncado. |
| CP-MOR-0200 | RF-MOR-200; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Informe de deuda (`Get_InformeDeuda`) y composición por antigüedad. | Coincide con el saldo de M07 a la fecha de corte. |
| CP-MOR-0201 | RF-MOR-201; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | Informes de financiación: financiaciones del período, por plan, comprobantes y conceptos financiados, cuotas de un convenio, estado general de cuotas, cuotas facturadas y cuotas adeudadas a una fecha. | "Cuotas adeudadas a fecha" incluye las cuotas anuladas en sección aparte. |
| CP-MOR-0202 | RF-MOR-202; M08 §5.19; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | **Exportación regulatoria** de condición de mora por cuenta (ej. ERSeP: "R/C" en riesgo de corte o "A"), parametrizable por regulador. | La exportación marca R/C las cuentas en instancia sensible o de corte. |
| CP-MOR-0203 | RF-MOR-203; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | **Exportación a herramientas de envío masivo** (cuenta, cantidad de comprobantes, deuda, deuda actualizada, correo) cuando el envío no se haga por T09. | El archivo respeta el consentimiento de comunicaciones. |
| CP-MOR-0204 | RF-MOR-204; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Tablero de mora: deuda vencida por tramo, cuentas por instancia, tasa de recupero por instancia, promesas cumplidas, cortes ejecutados/cancelados/bloqueados, tiempos de reconexión, convenios vigentes/caídos. | Cada indicador tiene fórmula en §15. |
| CP-MOR-0205 | RF-MOR-205; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Impresión de notificaciones agrupadas por **titular** (domicilio de la cuenta principal) con ordenamientos: cuenta, titular, deuda, lote, fecha, calle y número, zona/sector/recorrido, empresa postal. | Un titular con 3 cuentas recibe una sola carta. |
| CP-MOR-0206 | RF-MOR-206; M08 §5.19; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 | Reimprimir notificaciones y consultar notificaciones por cuenta con deuda notificada. | La reimpresión usa la misma versión de modelo. |
### 1.20 Portal y app del socio (M08 §5.20)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0207 | RF-MOR-207; M08 §5.20; PRO-O6-08 | O6 | Núcleo | regla | TEN-001 con Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` | El socio ve su **deuda vencida** con recargo cotizado a hoy, el detalle del cálculo y los importes por vencimiento. | El importe del portal coincide con la caja. |
| CP-MOR-0208 | RF-MOR-208; M08 §5.20; PRO-O6-08 | O6 | Núcleo | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | El socio ve sus **avisos de mora**, instancia, vencimiento y constancia, y el riesgo de suspensión con fecha estimada. | La app muestra "Riesgo de suspensión desde 20-11" si la instancia es sensible. |
| CP-MOR-0209 | RF-MOR-209; M08 §5.20; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | El socio **simula y solicita** un plan dentro de los planes habilitados para autogestión; acepta y firma; paga el anticipo en línea. | El convenio aceptado por app queda Pendiente de anticipo. |
| CP-MOR-0210 | RF-MOR-210; M08 §5.20; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | El socio registra una **promesa de pago** si la política lo permite. | La promesa queda en la bitácora con canal "app". |
| CP-MOR-0211 | RF-MOR-211; M08 §5.20; PRO-O6-08 | O6 | Núcleo | funcional | TEN-001 con Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN… | El socio solicita **suspensión voluntaria** o **reactivación** y ve el estado real del caso ("Reactivación en trámite" hasta confirmación). La suspensión voluntaria se habilita por servicio en M02 y está deshabilitada por defecto (DEC-031). | No muestra Activo hasta la confirmación técnica. |
| CP-MOR-0212 | RF-MOR-212; M08 §5.20; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Planes: PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas… | El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. | La cancelación anticipada muestra la bonificación. |
| CP-MOR-0213 | RF-MOR-213; M08 §5.20; PRO-O6-08 | O6 | Estándar | regla | TEN-001 con Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días… | Pagar la deuda notificada en línea con la regla de pago completo si la política lo exige. | Con la regla activa, la app preselecciona todos los documentos de la notificación. |
| CP-MOR-0214 | RF-MOR-214; M08 §5.20; PRO-O6-08 | O6 | Núcleo | funcional | TEN-001 con Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días | Mensajes y textos del portal por clave de diccionario; nada de texto fijo. | Todos los textos tienen clave `dict:`. |
### 1.21 Auditoría, operación y migración (M08 §5.21)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MOR-0215 | RF-MOR-215; M08 §5.21; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés | **Operaciones especiales** auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. | Eliminar un lote exige motivo y deja registro; "Restablecer" no existe. |
| CP-MOR-0216 | RF-MOR-216; M08 §5.21; PRO-O6-08 | O6 | Núcleo | funcional | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Auditoría de cada cambio de política, tasa, índice, excepción, protección, notificación, caso, convenio, incobrable y prescripción (quién, cuándo, antes/después). | La auditoría muestra el diff. |
| CP-MOR-0217 | RF-MOR-217; M08 §5.21; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. | Un índice duplicado por fecha se marca como error. |
| CP-MOR-0218 | RF-MOR-218; M08 §5.21; PRO-O6-08 | O6 | Núcleo | migración | TEN-001 con Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % | Migrar desde ProCoop tasas, índices, tramas, conceptos base, descuentos, excepciones, instancias, notificaciones abiertas, convenios vigentes con cuotas e intereses diferidos pendientes. | La conciliación de §19 cierra. |
| CP-MOR-0219 | RF-MOR-219; M08 §5.21; PRO-O7-11 | O7 | Estándar | migración | TEN-001 con Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" | Paralelo: comparar cálculo de recargo GoodApps vs ProCoop por documento en un universo de muestra y reportar diferencias explicadas (variantes con [VERIFICAR]). | El reporte clasifica diferencias por causa. |
| CP-MOR-0220 | RF-MOR-220; M08 §5.21; PRO-O6-08 | O6 | Núcleo | seguridad | TEN-001 con Estudio: ESTUDIO-DEMO con token de prueba de alcance limitado | Aislamiento de tenant en todas las colecciones, jobs y exportaciones del módulo. | Un token del tenant A no accede a convenios del tenant B (404). |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-MOR-5001 — ESC-MOR-01. Tasa fija diaria**

- Cubre: ESC-MOR-01; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Base ARS 10.000; 0,1 % diario; 30 días
- Cuando Tasa fija diaria
- Entonces Interés neto ARS 300; IVA ARS 63 (RI); total ARS 363.

**CP-MOR-5002 — ESC-MOR-02. Recargo entre vencimientos porcentaje fijo**

- Cubre: ESC-MOR-02; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Esquema entre vencimientos `ESQ-DEMO`: Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días
- Dado TOTAL1 ARS 10.000; 5 % por escalón
- Cuando Recargo entre vencimientos porcentaje fijo
- Entonces Modo simple: TOTAL2 10.500, TOTAL3 11.000, TOTAL4 11.500. Modo cascada: 10.500, 11.025, 11.576,25 (PA-MOR-03).

**CP-MOR-5003 — ESC-MOR-03. Índices Índices**

- Cubre: ESC-MOR-03; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Base ARS 10.000; índice a la fecha base 100, al cálculo 103
- Cuando Índices
- Entonces ARS 300; tasa diaria equivalente informada. Si falta un índice → error de configuración, sin fallback.

**CP-MOR-5004 — ESC-MOR-04. Tabla de tasas con dos tramos**

- Cubre: ESC-MOR-04; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 %
- Dado Base ARS 10.000; 40 días: 25 al 0,10 % y 15 al 0,12 % diario
- Cuando Tabla de tasas con dos tramos
- Entonces 250 + 180 = ARS 430.

**CP-MOR-5005 — ESC-MOR-05. Prioridad de categoría**

- Cubre: ESC-MOR-05; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Tabla de tasas `TASAS-DEMO`: 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 %
- Dado Tasa general 0,10 % y de categoría "Residencial" 0,08 % vigentes
- Cuando Prioridad de categoría
- Entonces Para Residencial solo se usa 0,08 %; publicar dos tasas generales superpuestas falla.

**CP-MOR-5006 — ESC-MOR-06. Pago parcial y prorrateo de excluidos**

- Cubre: ESC-MOR-06; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado TOTAL1 10.000 con impuesto excluido 1.000; saldo 5.000
- Cuando Pago parcial y prorrateo de excluidos
- Entonces Base = 5.000 − 1.000 × 5.000 / 10.000 = 4.500 (corrige el error de RN-04 §13.2).

**CP-MOR-5007 — ESC-MOR-07. Mínimo Mínimo**

- Cubre: ESC-MOR-07; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Mínimo ARS 50
- Cuando Mínimo
- Entonces "Umbral": recargo 40 → 0. "Piso": recargo 40 → 50.

**CP-MOR-5008 — ESC-MOR-08. Sin doble cobro**

- Cubre: ESC-MOR-08; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Pago parcial con interés liquidado al 10-11; nueva consulta el 20-11
- Cuando Sin doble cobro
- Entonces Días = 10 desde el 10-11; la cotización no repite el interés anterior.

**CP-MOR-5009 — ESC-MOR-09. Reversión**

- Cubre: ESC-MOR-09; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Pago de ARS 5.000 revertido a los 20 días; 0,1 % diario
- Cuando Reversión
- Entonces Interés por reversión ARS 100.

**CP-MOR-5010 — ESC-MOR-10. Exenciones**

- Cubre: ESC-MOR-10; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Documento NC; titular jubilado con condición eximida; documento sin interés
- Cuando Exenciones
- Entonces Interés 0 en los tres, con motivo en el cálculo.

**CP-MOR-5011 — ESC-MOR-11. Ente sobrescribe**

- Cubre: ESC-MOR-11; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Ente con "cobro al VTO1"
- Cuando Ente sobrescribe
- Entonces Sin recargo entre vencimientos para pagos por ese ente.

**CP-MOR-5012 — ESC-MOR-12. Dispensa**

- Cubre: ESC-MOR-12; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Cajero solicita dispensa
- Cuando Dispensa
- Entonces Sin aprobación del supervisor no se confirma el cobro; con aprobación queda motivo y autor.

**CP-MOR-5013 — ESC-MOR-13. Corrida masiva**

- Cubre: ESC-MOR-13; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado 1.000 documentos; 2 destildados
- Cuando Corrida masiva
- Entonces Cargos para 998; totales de corrida = cargos emitidos por M05 (REP-MOR-28); reejecutar `generate` no duplica.

**CP-MOR-5014 — ESC-MOR-14. Coherencia de canales**

- Cubre: ESC-MOR-14; M08 §17.1
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Misma factura cotizada en caja, PWA y consulta
- Cuando Coherencia de canales
- Entonces Mismo importe en los tres al mismo instante.

**CP-MOR-5015 — ESC-MOR-15. CU-CTA-01**

- Cubre: ESC-MOR-15; relacionados: CU-CTA-01; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Agua 13.000, electricidad 20.000, cementerio 7.000; pago 8.000
- Cuando CU-CTA-01
- Entonces Evaluación con decisión por servicio, sin corte automático; cementerio no habilita suspender agua ni electricidad.

**CP-MOR-5016 — ESC-MOR-16. Sin evidencia no hay suspensión**

- Cubre: ESC-MOR-16; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Intimación con evidencia exigida y correo rebotado
- Cuando Sin evidencia no hay suspensión
- Entonces La cuenta no aparece como elegible; se crea tarea de canal alternativo.

**CP-MOR-5017 — ESC-MOR-17. Electrodependiente**

- Cubre: ESC-MOR-17; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Protección acreditada vigente
- Cuando Electrodependiente
- Entonces Evaluación `blocked`; ningún rol puede crear el caso.

**CP-MOR-5018 — ESC-MOR-18. Entidad pública**

- Cubre: ESC-MOR-18; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Protección `review`
- Cuando Entidad pública
- Entonces Caso en `pendingApproval`; sin aprobación no se programa.

**CP-MOR-5019 — ESC-MOR-19. Ventana de ejecución**

- Cubre: ESC-MOR-19; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Caso aprobado un viernes 16:00
- Cuando Ventana de ejecución
- Entonces Se programa para el lunes hábil dentro del horario (PA-MOR-10).

**CP-MOR-5020 — ESC-MOR-20. Pago antes de ejecutar**

- Cubre: ESC-MOR-20; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Caso `scheduled`; pago total confirmado
- Cuando Pago antes de ejecutar
- Entonces Caso cancelado; OT cancelada en M10; contrato sigue Activo.

**CP-MOR-5021 — ESC-MOR-21. Reconexión con falla remota**

- Cubre: ESC-MOR-21; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Pago confirmado; T06 responde error
- Cuando Reconexión con falla remota
- Entonces Caso `executionFailed`, reintentos con backoff, alerta; contrato sigue Suspendido hasta éxito.

**CP-MOR-5022 — ESC-MOR-22. Reconexión vinculada al caso**

- Cubre: ESC-MOR-22; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Servicio desconectado hace 40 días por mora
- Cuando Reconexión vinculada al caso
- Entonces Se reconecta por el caso, sin la ventana de 15 días de ProCoop.

**CP-MOR-5023 — ESC-MOR-23. Reclamo de facturación**

- Cubre: ESC-MOR-23; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Documento reclamado en M09
- Cuando Reclamo de facturación
- Entonces Excluido de candidatos y de la deuda que habilita la suspensión mientras el reclamo esté abierto.

**CP-MOR-5024 — ESC-MOR-24. Composición cambiada**

- Cubre: ESC-MOR-24; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado NC posterior sobre un documento notificado
- Cuando Composición cambiada
- Entonces Aviso de composición al procesar la siguiente instancia (PRM-MOR-093).

**CP-MOR-5025 — ESC-MOR-25. Pago completo de notificada**

- Cubre: ESC-MOR-25; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado PRM-MOR-070 activo
- Cuando Pago completo de notificada
- Entonces Caja y PWA preseleccionan todos los documentos de la notificación.

**CP-MOR-5026 — ESC-MOR-26. Cargos de interrupción**

- Cubre: ESC-MOR-26; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado REACT-DEMO-ARANCEL deshabilitada
- Cuando Cargos de interrupción
- Entonces Reactivación con costo ARS 0; activar la regla sin admisibilidad aprobada falla.

**CP-MOR-5027 — ESC-MOR-27. Baja Baja**

- Cubre: ESC-MOR-27; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Socio pide baja de Internet con deuda
- Cuando Baja
- Entonces Baja sin cargo ni condicionamiento; la deuda sigue en gestión.

**CP-MOR-5028 — ESC-MOR-28. Restricción normativa**

- Cubre: ESC-MOR-28; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Tenant intenta editar una regla `normative`
- Cuando Restricción normativa
- Entonces 403 por falta de capability normativa.

**CP-MOR-5029 — ESC-MOR-51. Telefonía en mora (HUE-TEL-04)**

- Cubre: ESC-MOR-51; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Línea TEL-DEMO-01 llega a instancia de corte con `telephonyMode = restricted`
- Cuando Telefonía en mora (HUE-TEL-04)
- Entonces Caso `delinquencyRestriction` con perfil `outgoingBarred`; entrantes y números de emergencia habilitados; si la central no confirma la emergencia, la acción queda Pendiente.

**CP-MOR-5030 — ESC-MOR-52. TV en mora (HUE-TV-03)**

- Cubre: ESC-MOR-52; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Abonado TV-DEMO-01 con `tvMode = restricted` y paquete mínimo configurado
- Cuando TV en mora (HUE-TV-03)
- Entonces El abonado conserva solo la grilla mínima; el decodificador no se retira.

**CP-MOR-5031 — ESC-MOR-53. Agua en mora (HUE-AG-02)**

- Cubre: ESC-MOR-53; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Concesión con `allowedModes = [restricted]` y política con `waterMode = interrupted`
- Cuando Agua en mora (HUE-AG-02)
- Entonces Guardar la política falla con `mor/mode-not-allowed`; con `restricted` se genera OT de reducción de caudal en M10.

**CP-MOR-5032 — ESC-MOR-54. Cloacas en mora (HUE-CLO-01)**

- Cubre: ESC-MOR-54; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Cuenta con 6 meses impagos de CLO
- Cuando Cloacas en mora (HUE-CLO-01)
- Entonces Avisos, intereses y oferta de convenio; ningún caso de interrupción ni restricción.

**CP-MOR-5033 — ESC-MOR-55. Deuda solo de tasa de alumbrado (HUE-ALU-01, HUECO-TAS-02)**

- Cubre: ESC-MOR-55; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Socio al día con ELE y ARS 1.500 vencidos de tasa municipal, sin convenio que habilite el corte
- Cuando Deuda solo de tasa de alumbrado (HUE-ALU-01, HUECO-TAS-02)
- Entonces Saldo elegible ARS 0; sin instancia de corte de ELE; la evaluación muestra "deuda de terceros excluida".

**CP-MOR-5034 — ESC-MOR-56. Cobertura social (HUECO-SEP-01)**

- Cubre: ESC-MOR-56; RF-SOC-032; M08 §17.2
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Restricción `socialCoverageSuspension` con 3 meses; adherente con 3 cuotas impagas de sepelio
- Cuando Cobertura social (HUECO-SEP-01)
- Entonces M18 recibe "cobertura suspendida por mora" y RF-SOC-032 rechaza la cobertura; el contrato no se da de baja; urgencias sanitarias no se ven afectadas.

**CP-MOR-5035 — ESC-MOR-57. Banco de sangre (HUECO-SAN-02)**

- Cubre: ESC-MOR-57; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Aporte del socio impago hace 2 meses
- Cuando Banco de sangre (HUECO-SAN-02)
- Entonces Se crea una tarea de revisión en la bandeja del responsable del servicio social; reprocesar la evaluación no crea otra; no hay caso de interrupción.

**CP-MOR-5036 — ESC-MOR-58. Ventana ERSeP (HUE-ELE-05)**

- Cubre: ESC-MOR-58; M08 §17.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado Plantilla adoptada y validada; orden de corte de ELE aprobada un jueves víspera de feriado
- Cuando Ventana ERSeP (HUE-ELE-05)
- Entonces Se reprograma al siguiente día hábil dentro del horario; con la plantilla sin validar, el caso queda en `review`.

**CP-MOR-5037 — ESC-MOR-29. CU-14 CU-14**

- Cubre: ESC-MOR-29; relacionados: CU-14; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado ACU-001: 60.000, anticipo 15.000, 3 × 15.000, 0 %
- Cuando CU-14
- Entonces Convenio activo solo tras el pago del anticipo; origen sustituido; suma de cuotas + anticipo = 60.000.

**CP-MOR-5038 — ESC-MOR-30. Anticipo impago**

- Cubre: ESC-MOR-30; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado ACU-001 sin pago en 3 días
- Cuando Anticipo impago
- Entonces `lapsedNoDownPayment`; obligaciones restituidas sin intereses de financiación.

**CP-MOR-5039 — ESC-MOR-31. Sistema francés**

- Cubre: ESC-MOR-31; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Capital 100.000; TNA 60 % (5 % mensual); 6 cuotas
- Cuando Sistema francés
- Entonces Cuota 19.701,75; cuota 1: interés 5.000, capital 14.701,75, saldo 85.298,25; total pagado 118.210,48; última cuota ajusta el redondeo. CFT/TEA informados (PA-MOR-15).

**CP-MOR-5040 — ESC-MOR-32. Sistema alemán**

- Cubre: ESC-MOR-32; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Mismo caso
- Cuando Sistema alemán
- Entonces Capital 16.666,67 por cuota (última 16.666,65); interés cuota 1 = 5.000, cuota 2 = 4.166,67.

**CP-MOR-5041 — ESC-MOR-33. Cancelación anticipada**

- Cubre: ESC-MOR-33; relacionados: ESC-MOR-31; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado ESC-MOR-31 tras 2 cuotas pagadas
- Cuando Cancelación anticipada
- Entonces Saldo de capital 69.861,41 sin interés futuro, menos bonificación si aplica.

**CP-MOR-5042 — ESC-MOR-34. Caducidad**

- Cubre: ESC-MOR-34; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Modelos de aviso: MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:`
- Dado 3 cuotas consecutivas impagas
- Cuando Caducidad
- Entonces `defaultWarning` a la segunda, `defaulted` a la tercera con aviso previo cumplido; no revive la deuda original.

**CP-MOR-5043 — ESC-MOR-35. Límites de convenio**

- Cubre: ESC-MOR-35; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado Máximo 1 por período y ya hay uno
- Cuando Límites de convenio
- Entonces Bloqueo (modo `block`) o advertencia (modo `warn`).

**CP-MOR-5044 — ESC-MOR-36. Documento en otro convenio**

- Cubre: ESC-MOR-36; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado Selección de un documento ya incluido
- Cuando Documento en otro convenio
- Entonces No seleccionable.

**CP-MOR-5045 — ESC-MOR-37. Anulación**

- Cubre: ESC-MOR-37; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado Convenio con cuota facturada
- Cuando Anulación
- Entonces Rechazada con motivo; sin cuotas facturadas → anulación lógica y restitución.

**CP-MOR-5046 — ESC-MOR-38. Quita de mora**

- Cubre: ESC-MOR-38; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Plan con quita 50 % del interés de mora, alcance `current`
- Cuando Quita de mora
- Entonces La quita se calcula sobre el interés cotizado a la fecha del convenio.

**CP-MOR-5047 — ESC-MOR-39. Incobrable**

- Cubre: ESC-MOR-39; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado Propuesta con doble control
- Cuando Incobrable
- Entonces Un solo aprobador no la confirma; aprobada, la deuda queda castigada y visible.

**CP-MOR-5048 — ESC-MOR-40. Prescripción**

- Cubre: ESC-MOR-40; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado Regla con plazo default sin validación legal
- Cuando Prescripción
- Entonces La corrida no se puede aprobar hasta que la regla quede validada (DEC-052).

**CP-MOR-5049 — ESC-MOR-41. Garantía**

- Cubre: ESC-MOR-41; M08 §17.3
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Instancias: 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN (`isCut`); 5 BAJA POR MORA
- Dado Depósito en garantía al dar de baja con deuda
- Cuando Garantía
- Entonces Se aplica a la deuda con aprobación; el remanente se devuelve vía M07.

**CP-MOR-5050 — ESC-MOR-42. Permiso negativo: cajero intenta aprobar una corrida**

- Cubre: ESC-MOR-42; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo: cajero intenta aprobar una corrida
- Entonces 403 con `type` RFC 9457 y auditoría del intento.

**CP-MOR-5051 — ESC-MOR-43. Permiso negativo: operador sin `mor.interrupciones.aprobar` aprueba un caso**

- Cubre: ESC-MOR-43; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Permiso negativo: operador sin `mor.interrupciones.aprobar` aprueba un caso
- Entonces 403.

**CP-MOR-5052 — ESC-MOR-44. Socio consulta convenio ajeno por la PWA**

- Cubre: ESC-MOR-44; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Socio consulta convenio ajeno por la PWA
- Entonces 404 (no revela existencia).

**CP-MOR-5053 — ESC-MOR-45. Aislamiento: token del tenant A sobre un convenio del tenant B**

- Cubre: ESC-MOR-45; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aislamiento: token del tenant A sobre un convenio del tenant B
- Entonces 404; los jobs de A no leen documentos de B; las exportaciones se filtran por `tenantId`.

**CP-MOR-5054 — ESC-MOR-46. Reintento de `POST /agreements` con la misma `Idempotency-Key`**

- Cubre: ESC-MOR-46; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento de `POST /agreements` con la misma `Idempotency-Key`
- Entonces Devuelve el mismo convenio; no crea otro.

**CP-MOR-5055 — ESC-MOR-47. Evento `cob.payment.confirmed` entregado dos veces**

- Cubre: ESC-MOR-47; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Evento `cob.payment.confirmed` entregado dos veces
- Entonces La notificación se cierra y el convenio se activa una sola vez.

**CP-MOR-5056 — ESC-MOR-48. `int.network.provisioningResult` (antes `int.network.provisioning-result`) exitoso tardío tras cancelación**

- Cubre: ESC-MOR-48; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando `int.network.provisioningResult` (antes `int.network.provisioning-result`) exitoso tardío tras cancelación
- Entonces El caso pasa a conflicto para supervisión con ambas evidencias.

**CP-MOR-5057 — ESC-MOR-49. Caída del worker durante JOB-MOR-01**

- Cubre: ESC-MOR-49; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Caída del worker durante JOB-MOR-01
- Entonces Reanuda por ítem; no hay cargos duplicados.

**CP-MOR-5058 — ESC-MOR-50. Conciliación diaria (REP-MOR-28)**

- Cubre: ESC-MOR-50; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación diaria (REP-MOR-28)
- Entonces Sin diferencias en el juego canónico; una diferencia forzada aparece en bandeja.

**CP-MOR-5059 — ESC-MOR-59. Refinanciación de cuotas de obra (HUECO-OBR-02). Dado: Contrato tipo 17 con 2 cuotas de obra vencidas y 10 no vencidas**

- Cubre: ESC-MOR-59; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Refinanciación de cuotas de obra (HUECO-OBR-02). Dado: Contrato tipo 17 con 2 cuotas de obra vencidas y 10 no vencidas
- Entonces El convenio admite solo las 2 vencidas; incluir las no vencidas falla con `mor/works-levy-not-eligible`.

**CP-MOR-5060 — ESC-MOR-61. Cobertura social suspendida y rehabilitada (EVT-MOR-21). Dado: Restricción `socialCoverageSuspension` con 3 meses; contrato de sepelio…**

- Cubre: ESC-MOR-61; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cobertura social suspendida y rehabilitada (EVT-MOR-21). Dado: Restricción `socialCoverageSuspension` con 3 meses; contrato de sepelio SEP-DEMO-07 con 3 cuotas impagas; luego pago total en caja
- Entonces Se publica una sola vez `mor.socialCoverage.suspended` con `unpaidMonths = 3`; al confirmarse el pago se publica `mor.socialCoverage.restored` con `paymentRef`; reprocesar la evaluación no duplica eventos.

**CP-MOR-5061 — ESC-MOR-62. Convenio con deuda de dos entidades jurídicas (DEC-064, DEC-087). Dado: Socio con deuda de ELE (entidad A) e Internet (entidad B)**

- Cubre: ESC-MOR-62; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Convenio con deuda de dos entidades jurídicas (DEC-064, DEC-087). Dado: Socio con deuda de ELE (entidad A) e Internet (entidad B)
- Entonces El simulador propone un convenio por entidad; un convenio que mezcle ambas falla con `mor/agreement-mixed-legal-entities`.

**CP-MOR-5062 — ESC-MOR-63. Cambio de titularidad con deuda (DEC-045). Dado: Suministro con ARS 20.000 vencidos del titular saliente; alta del nuevo titular**

- Cubre: ESC-MOR-63; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de titularidad con deuda (DEC-045). Dado: Suministro con ARS 20.000 vencidos del titular saliente; alta del nuevo titular
- Entonces La deuda queda en la cuenta del saliente; el nuevo titular no tiene instancia de mora; solo un convenio firmado por el nuevo titular la traslada.

**CP-MOR-5063 — ESC-MOR-60. Devolución de depósito (HUECO-OTR-04). Dado: Depósito ORT-DEMO-01 de ARS 20.000 devuelto sin daños**

- Cubre: ESC-MOR-60; M08 §17.4
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Devolución de depósito (HUECO-OTR-04). Dado: Depósito ORT-DEMO-01 de ARS 20.000 devuelto sin daños
- Entonces EVT-MOR-16 `.refunded` con `refundMode = accountCredit`; M07 crea saldo a favor de ARS 20.000; M14 no recibe orden de pago.

**CP-MOR-5064 — ESC-01. Pago excedente de un hermano**

- Cubre: ESC-01; M08 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago excedente de un hermano
- Entonces El pago excedente de A no cierra notificaciones ni evita la suspensión de B; la evaluación de B usa solo pagos imputados a B.

**CP-MOR-5065 — ESC-02. Corrección después de emitir**

- Cubre: ESC-02; RN-MOR-070; M08 §17.5
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corrección después de emitir
- Entonces Un ajuste por ND/NC sobre un documento notificado recalcula la deuda actualizada de la notificación y avisa el cambio de composición (RN-MOR-070, -071) y el interés usa el saldo corregido; no se reescribe el cálculo liquidado.

**CP-MOR-5066 — ESC-03. Instalación offline en conflicto**

- Cubre: ESC-03; relacionados: ESC-MOR-48; M08 §17.5
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalación offline en conflicto
- Entonces Una OT de corte ejecutada offline después de cancelada abre conflicto en el caso (ESC-MOR-48); no se marca Activo ni Suspendido por presunción.

**CP-MOR-5067 — ESC-04. Restauración con operaciones externas**

- Cubre: ESC-04; M08 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Restauración con operaciones externas
- Entonces Tras restaurar, se concilian acciones de T06 y mensajes de T09 ya ejecutados por id externo; no se reenvían notificaciones ni cortes.

**CP-MOR-5068 — ESC-05. Cambio de condiciones en período procesado**

- Cubre: ESC-05; M08 §17.5
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de condiciones en período procesado
- Entonces Una nueva versión de política de interés o mora no reescribe cálculos, notificaciones ni convenios ya registrados; aplica a los nuevos (versionado de §8.1).

## 3. Casos por caso de uso (CU)

**CP-MOR-8001 — CU-14. Acuerdo de deuda con anticipo (BASE §14)**

- Cubre: CU-14; RF-MOR-145, RF-MOR-142; RN-MOR-105, RN-MOR-126; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado actor: gestor de deuda. Situación inicial: un titular ficticio tiene deuda confirmada de ARS 60.000 y está autorizado un plan sin interés (PLAN-DEMO-0). 1. El gestor abre PAN-MOR-30 (simulador), busca la cuenta y selecciona las obligaciones; el sistema verifica que ninguna esté en otro convenio vigente, bloqueada por gestión judicial ni reclamada (RF-MOR-145). 2. Elige el plan, que propone un anticipo de ARS 15.000…
- Cuando Acuerdo de deuda con anticipo (BASE §14)
- Entonces Convenio por ARS 60.000 con obligaciones de origen identificadas y sin doble exigencia. Excepción: si el anticipo no se paga en el plazo PRM-MOR-172, JOB-MOR-09 lo pasa a `lapsedNoDownPayment` y restituye las obligaciones; nunca queda cumplido. Requisitos: RF-MOR-142–157, 170; RN-MOR-105–127.

**CP-MOR-8002 — CU-CIC-01. Suspensión temporal y reactivación de Internet (BASE §53)**

- Cubre: CU-CIC-01; RF-MOR-131; RN-MOR-099; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado actor: Ana (socia ficticia) desde la PWA; operador de atención; M10/T06. 1. Ana abre PAN-MOR-41 en su contrato de Internet; ve las modalidades habilitadas (SUS-DEMO-GRATIS, duración 1–3 meses, costo ARS 0) y sus condiciones. 2. Solicita la suspensión desde el 01-12; se crea un caso `voluntarySuspension` en `requested`; la evaluación verifica que no haya restricciones; el caso queda `scheduled`. 3. En la fecha…
- Cuando Definición dueña: este anexo (PA-MOR-21, Asumida DEC-072). M02 cita el cambio de estado del contrato, M09 el tramo de atención y M19 la pantalla del portal. Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: este anexo, que define el caso de suspensión y reactivación).»
- Entonces Se completa «Suspensión temporal y reactivación de Internet (BASE §53)» sin errores, con los efectos que exigen RF-MOR-131, y quedan auditoría y evento del cambio

**CP-MOR-8003 — CU-CTA-01. Evaluación de mora en cuenta unificada (BASE §68)**

- Cubre: CU-CTA-01; RF-MOR-065; RN-MOR-081; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Definición dueña: M07 «CU-CTA-01 — Cuenta unificada con mínimo (BASE §68)». Aquí solo la evaluación de mora posterior. Situación: Ana tiene facturas pendientes de agua ARS 13.000, electricidad ARS 20.000 y cementerio parque ARS 7.000 (total ARS 40.000) en una cuenta unificada; la política de prueba usa un umbral interno de ARS 10.000 (no es norma). 1. JOB-MOR-02 evalúa obligaciones, vencimientos y pagos confirmados; con un pago de ARS 8.000 imputado por M07 a la factura de agua, la evaluación registra el saldo…
- Entonces Se completa «Evaluación de mora en cuenta unificada (BASE §68)» sin errores, con los efectos que exigen RF-MOR-065, y quedan auditoría y evento del cambio. Alternativo o excepción: agua → `review` (servicio esencial con restricción normativa de preaviso); electricidad → `allowed` si tiene aviso con evidencia y no hay protección; cementerio → acción `allowed` solo dentro de su propio servicio (no tiene suspensión física). 4. Solo los servicios con acción habilitada generan casos de interrupción; la ejecución efectiva se registra al confirmarse. 5. Un pago posterior dispara JOB-MOR-07; la reactivación aplica su regla de cargo o gratuidad, sin duplicar cargos ni reactivar por presunción…

**CP-MOR-8004 — CU-MOR-01. Recargo cotizado en caja y liquidado una sola vez**

- Cubre: CU-MOR-01; RF-MOR-001; RN-MOR-001; M08 §16
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de interés `POL-INT-DEMO`: Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recargo cotizado en caja y liquidado una sola vez
- Entonces El cajero (M07) consulta la deuda de una factura de ARS 10.000 vencida hace 30 días; M08 cotiza ARS 300 de interés (0,1 % diario) más IVA; al confirmar el cobro M07 llama a `settle`; M08 registra el cálculo, marca `interestSettledUntil` = fecha de pago y emite `mor.interest.settled`; M05 emite la ND. Una segunda consulta al día siguiente solo calcula desde esa fecha. Requisitos: RF-MOR-001–010, 021–034; RN-MOR-001–013.

**CP-MOR-8005 — CU-MOR-02. Corrida masiva de intereses a facturar**

- Cubre: CU-MOR-02; RF-MOR-049; M08 §16
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Cuenta unificada de Ana (CU-CTA-01): Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corrida masiva de intereses a facturar
- Entonces El analista crea una corrida estándar con fecha de cálculo fin de mes, revisa el preliminar, destilda dos documentos reclamados, la aprueba un supervisor y la genera; JOB-MOR-01 emite los cargos por cuenta a M05 y la corrida cierra con totales conciliados (REP-MOR-28). Requisitos: RF-MOR-049–058.

**CP-MOR-8006 — CU-MOR-03. Ciclo de mora del piloto Internet**

- Cubre: CU-MOR-03; RF-MOR-075; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ciclo de mora del piloto Internet
- Entonces Con la política PA-MOR-05: JOB-MOR-03 genera candidatos (deuda ≥ umbral, 15 días de atraso); el operador procesa la instancia Aviso (T09 por WhatsApp y correo); tras el vencimiento, procesa la Intimación con preaviso (evidencia exigida); las cuentas sin constancia de entrega generan tarea de canal alternativo; al vencer la intimación, PAN-MOR-19 lista los servicios elegibles; los casos se programan en la ventana hábil y T06 suspende; un pago confirmado reactiva automáticamente. Requisitos: RF-MOR-075–130.

**CP-MOR-8007 — CU-MOR-04. Bloqueo por protección normativa**

- Cubre: CU-MOR-04; RF-MOR-109; RN-MOR-081; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M08 §18.
- Datos de prueba: Protección: Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Bloqueo por protección normativa
- Entonces Un servicio eléctrico tiene una protección de electrodependiente acreditada; la cuenta llega a la instancia de corte; la evaluación devuelve `blocked` con motivo; el caso no se crea, queda una alerta a supervisión y el informe REP-MOR-13 lo cuenta. No existe capability que permita forzarlo. Requisitos: RF-MOR-109–116; RN-MOR-081–086.

**CP-MOR-8008 — CU-MOR-05. Pago entre la orden y la ejecución**

- Cubre: CU-MOR-05; RF-MOR-121; RN-MOR-091; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Pago entre la orden y la ejecución
- Entonces Con un caso `scheduled` de suspensión, M07 confirma el pago total; JOB-MOR-07 cancela el caso (PRM-MOR-122), pide a M10 cancelar la OT y, si M10 informa que la OT ya estaba ejecutada, abre la reconexión inmediata sin cargo. Requisitos: RF-MOR-121–126; RN-MOR-091, -092.

**CP-MOR-8009 — CU-MOR-06. Convenio con interés, caída y rehabilitación**

- Cubre: CU-MOR-06; RF-MOR-143, RF-MOR-155; RN-MOR-105; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Convenio con interés, caída y rehabilitación
- Entonces Un convenio de ARS 100.000 en 6 cuotas al 60 % TNA (sistema francés) entra en atraso con dos cuotas impagas; JOB-MOR-11 lo pasa a `defaultWarning` y T09 avisa; con la tercera impaga se declara `defaulted`: el saldo de capital es exigible, se pierden las quitas proporcionales y las obligaciones de origen no reviven (PA-MOR-13). Dentro de los 15 días el socio paga lo vencido y un supervisor lo rehabilita. Requisitos: RF-MOR-143, 155–157, 163; RN-MOR-105, -123.

**CP-MOR-8010 — CU-MOR-07. Cancelación anticipada desde la app**

- Cubre: CU-MOR-07; RF-MOR-159, RF-MOR-212; RN-MOR-120; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cancelación anticipada desde la app
- Entonces El socio cotiza la cancelación de su convenio tras pagar dos cuotas: el sistema muestra el saldo de capital, sin intereses futuros, más la bonificación configurada; paga en línea; el convenio pasa a `cancelledEarly` y las cuotas futuras se anulan. Requisitos: RF-MOR-159, 212; RN-MOR-120.

**CP-MOR-8011 — CU-MOR-08. Derivación a estudio externo e incobrable**

- Cubre: CU-MOR-08; RF-MOR-183; M08 §16
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Derivación a estudio externo e incobrable
- Entonces Una cuenta de baja con deuda de 400 días se deriva al estudio ESTUDIO-DEMO; el estudio registra avances por `/api/v1/ext`; sin recupero, el analista propone el castigo; dos aprobadores lo aprueban; M15 registra el asiento y la deuda sigue visible como castigada (no se borra). Un pago posterior revierte parcialmente. Requisitos: RF-MOR-183–192.

**CP-MOR-8012 — CU-MOR-09. Prescripción**

- Cubre: CU-MOR-09; RF-MOR-193; M08 §16
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Convenio ACU-001: Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Prescripción
- Entonces JOB-MOR-13 alerta deuda a prescribir; el responsable legal crea una corrida, revisa interrupciones registradas (reconocimiento, convenio, reclamo judicial) y la aprueba; la deuda prescripta deja de ser exigible por M07 y queda con estado y asiento. Requisitos: RF-MOR-193–197.

**CP-MOR-8013 — CU-MOR-10. Baja pública de Internet sin cargo**

- Cubre: CU-MOR-10; RF-MOR-131; RN-MOR-100; M08 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M08 §18.
- Datos de prueba: Política de mora Internet `POL-MORA-INT-DEMO`: Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Baja pública de Internet sin cargo
- Entonces Un socio pide la baja desde el botón público; se crea un caso `cancellation` con costo ARS 0 (BAJA-DEMO); T06 ejecuta y M02 registra la baja; no se condiciona a la deuda (que sigue su curso por M07/M08). Requisitos: RF-MOR-131–133; RN-MOR-100.
