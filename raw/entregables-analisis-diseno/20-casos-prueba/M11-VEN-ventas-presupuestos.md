# Casos de prueba de aceptación — M11 VEN — Ventas, presupuestos y punto de venta

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M11-VEN-ventas-presupuestos.md`](../../especificacion/anexos/M11-VEN-ventas-presupuestos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 94 CP de requisitos funcionales, 18 CP de escenarios ESC y 8 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M11 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Conceptos por cobrar en operaciones con titulares (piloto) (M11 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0001 | RF-VEN-001; M11 §5.1; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Registrar cargos por operación con titulares: derecho de conexión, instalación, reconexión, cambio de titular, traslado de domicilio, visita adicional u otro concepto habilitado por el tenant, asociados a cuenta, titular, contrato y… | Un cargo siempre tiene `accountId`, `contractId`, `serviceCode`, `conceptId` y origen; sin contrato no se admite salvo concepto marcado `allowWithoutContract`. |
| CP-VEN-0002 | RF-VEN-002; M11 §5.1; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Generar el cargo automáticamente desde el hito disparador configurado por concepto (aprobación de la solicitud, OT confirmada, instalación probada, inicio de período), consumiendo eventos de M09, M10 y M08; también alta manual con permiso. | Al confirmar una OT de instalación con el concepto INS-INT configurado se crea un único cargo en estado `pending`. |
| CP-VEN-0003 | RF-VEN-003; M11 §5.1; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Valorizar el cargo con el concepto y la versión tarifaria de M04 vigente a la fecha del hito, guardando la instantánea (precio, versión, regla de redondeo, tratamiento fiscal). | Cambiar la tarifa después del hito no modifica el cargo ya valorizado. |
| CP-VEN-0004 | RF-VEN-004; M11 §5.1; PRO-O4-13 | O4 | Núcleo | integración | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Idempotencia: un mismo hito (`sourceType` + `sourceId` + `conceptId`) genera un único cargo aunque el evento llegue repetido o la app de campo sincronice dos veces. | Reprocesar el evento devuelve el cargo existente; no hay duplicado. |
| CP-VEN-0005 | RF-VEN-005; M11 §5.1; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Elegir la modalidad de cobro del cargo: (a) contado en la próxima factura del servicio; (b) factura inmediata propia; (c) financiado en cuotas con plan comercial, mostrando capital, interés y tributos de cada cuota. | El ejemplo de §72 (ARS 20.000 en 2 cuotas de ARS 11.000 = 10.000 de capital + 1.000 de interés) se reproduce exactamente. |
| CP-VEN-0006 | RF-VEN-006; M11 §5.1; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Al elegir la financiación de un cargo se anula la alternativa de cobrarlo al contado: un solo cronograma y ninguna duplicación entre módulos. | Un cargo financiado no aparece como ítem contado en la factura del ciclo. |
| CP-VEN-0007 | RF-VEN-007; M11 §5.1; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Incluir el cargo o sus cuotas en la factura periódica del servicio **solo** cuando el concepto está marcado como vinculado a ese servicio (`linkedToServiceCode`) y tiene validación fiscal registrada por el tenant; si no, se emite en… | Un concepto no vinculado nunca se agrega a la factura del servicio, aunque el tenant use grupos de facturación. |
| CP-VEN-0008 | RF-VEN-008; M11 §5.1; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Bonificar total o parcialmente, o anular, un cargo antes de facturarlo, con motivo y aprobación por monto (T11). Después de facturado, la corrección es una NC en M05. | La bonificación queda auditada y el cargo conserva su importe original y el bonificado. |
| CP-VEN-0009 | RF-VEN-009; M11 §5.1; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Generar cargos y créditos de reconexión a pedido de M08/M10: débito al reconectar un servicio no facturado en el período (P2661), crédito por días de servicio desconectado con su concepto (P2483/P2485) y opción de cerrar la OT de… | Con P2661 activo, la reconexión genera un único cargo; con P2907 la OT puede cerrarse sin cargo y queda la marca. |
| CP-VEN-0010 | RF-VEN-010; M11 §5.1; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Mostrar al socio, en la PWA y en el resumen, cada cargo por operación con su origen, estado, modalidad y cronograma de cuotas. | El socio ve "Instalación Internet — 2 cuotas de ARS 11.000 — cuota 1 facturada". |
| CP-VEN-0011 | RF-VEN-011; M11 §5.1; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Proveer a M04/M05 los cargos pendientes para la simulación del primer cobro (abono prorrateado + instalación) antes de confirmar la contratación. | La simulación del CU-INS-01 muestra ARS 30.500 (con prorrateo y promoción) y ARS 35.000 (sin prorrateo). |
| CP-VEN-0012 | RF-VEN-012; M11 §5.1; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Configurar el método de facturación de presupuestos de factibilidad: factura manual o venta de materiales. | Con "venta de materiales" el presupuesto de factibilidad aceptado genera una venta con sus ítems. |
| CP-VEN-0013 | RF-VEN-013; M11 §5.1; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Permitir cargos por operación sobre servicios de cualquier tipo (electricidad, agua, gas, TIC, sociales) con el mismo modelo. | Un cargo de conexión de agua se registra igual que el de Internet. |
### 1.2 Presupuestos (M11 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0020 | RF-VEN-020; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Crear presupuestos para una cuenta/titular (con persona), para una persona registrada o para un prospecto (nombre y contacto), con persona por defecto configurable (P2894); cabecera: número, fecha, validez, punto de venta, vendedor… | El presupuesto se numera por tenant y punto de venta sin huecos. |
| CP-VEN-0021 | RF-VEN-021; M11 §5.2; PRO-O8-12 | O8 | Estándar | migración | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Ítems de presupuesto: producto, concepto o servicio adicional; descripción (hasta el largo configurable, ProCoop trunca a 60); cantidad; precio unitario sin IVA o con IVA (P2915); descuento; alícuota; cantidad pendiente; serie reservada… | La cantidad pendiente inicia igual a la cantidad y baja al facturar o entregar. |
| CP-VEN-0022 | RF-VEN-022; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Administrar el catálogo de **condiciones de venta** de presupuestos y seleccionarlas en cada presupuesto. | Una condición inactiva no se ofrece en presupuestos nuevos pero se conserva en los históricos. |
| CP-VEN-0023 | RF-VEN-023; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Registrar **notas** de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. | Las notas no se editan después de enviada la versión; se agregan nuevas. |
| CP-VEN-0024 | RF-VEN-024; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | **Conjuntos**: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). | El total del conjunto = Σ ítems × cantidad del conjunto. |
| CP-VEN-0025 | RF-VEN-025; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Precio de productos con estructura (lista de materiales de M13): costo = costo de componentes + costo fijo de fabricación; venta = costo × (1 + margen); margen por defecto (P2903) y cálculo de rentabilidad por ítem, conjunto y total. | Con costo 1.000 y margen 30 % el precio sugerido es 1.300. |
| CP-VEN-0026 | RF-VEN-026; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Prorratear el importe de **flete** (producto P2953), **molde** (P3032) y de los ítems marcados "prorratear" entre los demás ítems en proporción al peso. | La suma prorrateada iguala exactamente el importe a repartir (residuo asignado al último ítem). |
| CP-VEN-0027 | RF-VEN-027; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | Actualizar precios del presupuesto (P2892) por precio vigente, índice, cotización del dólar o margen antes de enviarlo. | La actualización crea una nueva versión si el presupuesto ya fue enviado. |
| CP-VEN-0028 | RF-VEN-028; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Validar al presupuestar, según configuración: que la cuenta tenga servicios activos (P2395; condición conectado); que el servicio no esté desconectado (con opción de cerrar si tiene deuda, P3009); que la cuenta tenga la propiedad requerida… | Cada validación puede ser bloqueante o advertencia; el override exige `ven.riesgo.override` y queda auditado. |
| CP-VEN-0029 | RF-VEN-029; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Impedir otro presupuesto vigente, no anulado y sin facturar de la misma cuenta con alguno de los mismos productos. | Se informa el presupuesto existente y su enlace. |
| CP-VEN-0030 | RF-VEN-030; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Gestionar el ciclo de vida del presupuesto con transiciones explícitas (sección 8): enviar, reenviar, aprobar/aceptar, volver a borrador, rechazar, marcar para facturar, facturar parcial/total, anular, vencer. | Ninguna transición se ejecuta desde un estado no permitido (corrige `AprobarPresupuesto` sin validar estado). |
| CP-VEN-0031 | RF-VEN-031; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Enviar el presupuesto por email, WhatsApp o portal con PDF de plantilla configurable (P210), impresión simple por defecto (P3037) y página extra con datos de producto (P3024); impresión masiva de presupuestos/órdenes. | El envío registra canal, destinatario, versión y resultado de entrega. |
| CP-VEN-0032 | RF-VEN-032; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Regla: DSC-01: 5 % de descuento en ART-CAB-01 con pago contado y sin deuda vencida > 30 días | **Aceptación online**: el destinatario acepta o rechaza (con motivo) una versión exacta desde la PWA (si es socio autenticado) o desde un enlace firmado con verificación por OTP al contacto registrado; se guarda evidencia (versión, hash… | Aceptar una versión reemplazada o vencida es imposible; la evidencia queda en el expediente. |
| CP-VEN-0033 | RF-VEN-033; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | Vencimiento automático: un presupuesto enviado cuya validez es anterior a hoy pasa a `expired` (job diario); puede renovarse creando una nueva versión con precios actualizados. | El listado distingue enviados vigentes y vencidos. |
| CP-VEN-0034 | RF-VEN-034; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Modificar un presupuesto enviado lo vuelve a borrador en una nueva versión; el cambio de cuenta/persona solo se permite antes de aprobar y con P3010. | La versión anterior queda consultable y no aceptable. |
| CP-VEN-0035 | RF-VEN-035; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Aprobar un presupuesto sin obra u OT asignada pide confirmación explícita cuando P2914 está activo. | La confirmación queda registrada con el usuario. |
| CP-VEN-0036 | RF-VEN-036; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Al aceptarse, ofrecer o crear automáticamente (según configuración) el caso CRM y la OT en M10 con los ítems de mano de obra y materiales, dejando el vínculo presupuesto ↔ caso ↔ OT; al rechazar o anular, desvincular y cerrar el caso. | El caso nace con tipo y estado configurables (no fijos) y asunto = referencia o número. |
| CP-VEN-0037 | RF-VEN-037; M11 §5.2; PRO-O8-12 | O8 | Estándar | integración | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Presupuestos en campo: enviar presupuestos a la app de campo (P2380), sincronizarlos con ventas (P2386), usar solo productos habilitados para campo, punto de venta fijo de campo (P2383), presupuestos a granel con coeficiente multiplicador… | Un producto no habilitado para campo no puede agregarse a un presupuesto que se envía a campo. |
| CP-VEN-0038 | RF-VEN-038; M11 §5.2; PRO-O8-12 | O8 | Estándar | integración | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Facturar en campo ventas con o sin presupuesto usando el tipo de factura configurado (P2592 / P2641), días de vencimiento (P2593), guardado del PDF (P2589), publicación del comprobante en la autogestión (VAR_PMOVIL 52) y mensaje automático… | La venta en campo offline usa `clientMutationId` y no se duplica al sincronizar. |
| CP-VEN-0039 | RF-VEN-039; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Registrar anticipos sobre un presupuesto (cobro por M07) y aplicarlos al facturar; un presupuesto con anticipo no se anula sin devolver o reasignar el anticipo. | El anticipo aplicado reduce el saldo de la factura generada. |
| CP-VEN-0040 | RF-VEN-040; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Generar desde el presupuesto, total o parcialmente por ítems pendientes, la venta (`salesOrder`) y/o la solicitud de factura a M05; registrar los comprobantes generados en el presupuesto. | Dos facturaciones parciales no superan la cantidad presupuestada. |
| CP-VEN-0041 | RF-VEN-041; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Comprometer stock por presupuestos aprobados con obra (reserva en M13) y liberar al anular, rechazar o facturar. | El disponible de M13 descuenta lo comprometido. |
| CP-VEN-0042 | RF-VEN-042; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Alertar en la ficha de atención (M09) cuando la cuenta tiene un presupuesto pendiente (P2398). | La alerta muestra número, estado y vencimiento. |
| CP-VEN-0043 | RF-VEN-043; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Permitir importar los productos de un presupuesto en un vale de materiales de M13 (P2899). | El vale referencia el presupuesto. |
| CP-VEN-0044 | RF-VEN-044; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Seleccionar un presupuesto existente desde otras pantallas (búsqueda por cuenta, número, estado) y vincularlo a obra (`ObtenerObras`) o a orden. | La búsqueda respeta el alcance de datos. |
| CP-VEN-0045 | RF-VEN-045; M11 §5.2; PRO-O8-12 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Cambiar el estado manualmente con permiso especial y motivo (reemplaza `frmPresupu_EstadoManual`), limitado a las transiciones de la sección 8. | El cambio manual queda en el historial con motivo. |
| CP-VEN-0046 | RF-VEN-046; M11 §5.2; PRO-O8-12 | O8 | Estándar | regla | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Informe de presupuestos por estado, vendedor, período, cuenta, con notas, pendientes, conversión y tiempo a aceptación. | La tasa de conversión = aceptados / enviados del período. |
| CP-VEN-0047 | RF-VEN-047; M11 §5.2; PRO-O10-10 | O10 | Estándar | regla | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Presupuesto de obras y contribución por mejoras (MER-009): el presupuesto puede vincularse a una obra de M10 para su costeo; el prorrateo entre beneficiarios pertenece a M10/M08. | El presupuesto aceptado aporta el monto aprobado a la obra. |
### 1.3 Venta de productos, entregas y devoluciones (M11 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0050 | RF-VEN-050; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Registrar ventas de productos y servicios adicionales con cabecera (cuenta/titular, servicio opcional, vendedor, condición y forma de pago, lote, descuento, moneda/cotización, observaciones y transporte) e ítems (producto, cantidad, precio… | La venta confirmada solicita a M05 el comprobante y guarda su referencia. |
| CP-VEN-0051 | RF-VEN-051; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | Administrar listas de precios de venta de artículos con vigencia, moneda y canal (mostrador, campo, portal), sin afectar las tarifas de servicios de M04. | Una venta toma la lista vigente a su fecha y guarda el precio aplicado. |
| CP-VEN-0052 | RF-VEN-052; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Regla: DSC-01: 5 % de descuento en ART-CAB-01 con pago contado y sin deuda vencida > 30 días | Reglas de recargo o descuento por producto: aplican si la cuenta tiene la propiedad y valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de comprobantes excluidos (o ninguna vencida hace más… | Superada la cantidad mensual la regla deja de aplicar y se informa por qué. |
| CP-VEN-0053 | RF-VEN-053; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Actualización masiva de precios de venta por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor, plan/etapa de vivienda) y modos porcentaje, coeficiente, cotización del dólar (precio × cotización nueva / cotización… | La previsualización muestra precio actual, nuevo y variación antes de confirmar. |
| CP-VEN-0054 | RF-VEN-054; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Controlar disponibilidad y reservar stock en M13 al confirmar la venta; egresar al entregar o al confirmar según configuración (P77). | Sin disponible, la venta queda pendiente o se bloquea según configuración. |
| CP-VEN-0055 | RF-VEN-055; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Entregas parciales y consulta de "vendido/facturado no entregado"; cada entrega registra cantidades, series, depósito, receptor, fecha y comprobante de entrega. | La venta pasa a `delivered` solo cuando no quedan pendientes. |
| CP-VEN-0056 | RF-VEN-056; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Artículos: ART-ROU-01 Router Wi-Fi ARS 90.000 (serializado, 5 unidades en depósito DEP-01); ART-CAB-01 Cable UTP por metro ARS 800; ART-CON-01 Conector RJ45 ARS… | Validar trazabilidad y ubicación: un ítem de producto serializado exige una serie disponible en stock y no asignada a un suministro. | Una serie instalada en un servicio no puede venderse. |
| CP-VEN-0057 | RF-VEN-057; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Regla: DSC-01: 5 % de descuento en ART-CAB-01 con pago contado y sin deuda vencida > 30 días | Mostrar y validar el riesgo crediticio (deuda vencida, importe y límite) antes de financiar o vender a crédito. | Superado el límite se exige override con permiso. |
| CP-VEN-0058 | RF-VEN-058; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Formas de pago de la venta: contado (con descuento contado o 1 cuota, P2247, y descuento por efectivo), cuotas según plan (entrega inicial, cantidad, máximo por cuota, interés P2089, sellado P676, días de vencimiento), crédito fiscal en… | El cronograma suma exactamente capital + interés + tributos de la operación. |
| CP-VEN-0059 | RF-VEN-059; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Solicitar a M05 el comprobante fiscal de la venta: contado inmediato (esperando CAE antes de entregar si P727), venta en cuotas según el modelo fiscal configurado (factura total con concepto "factura en cuotas" P403 o factura por cuota). | Una venta no se entrega como "facturada" mientras su comprobante no tenga CAE, si P727 está activo. Según DEC-018 la espera tiene un tiempo máximo (lo fija M05); vencido, M05 emite con CAEA de contingencia o deja el comprobante pendiente, que no se entrega como fiscal. |
| CP-VEN-0060 | RF-VEN-060; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Emitir siempre recibo oficial en las operaciones de caja de la venta (P2452). | El cobro en POS genera recibo de M07. |
| CP-VEN-0061 | RF-VEN-061; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Registrar la diferencia de cotización en ventas en moneda extranjera como ítem con el producto configurado (P2289). | La diferencia se informa separada del precio. |
| CP-VEN-0062 | RF-VEN-062; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Anular ventas individualmente o por rango (tipo, punto de venta, número desde/hasta) con permiso y respetando el cierre de ventas (P67); si el comprobante fiscal tiene CAE, la anulación se hace por NC de M05. | No se anula una venta con fecha ≤ cierre de ventas. |
| CP-VEN-0063 | RF-VEN-063; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Devoluciones: reingreso a stock (M13), NC (M05) y ajuste de cuotas según su estado de cobro (no facturadas se anulan; facturadas impagas se acreditan; cobradas generan saldo a favor o devolución por M07). | El CU-23 con devolución deja cuotas y saldo conciliados. |
| CP-VEN-0064 | RF-VEN-064; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Venta rápida (mostrador): cuenta por defecto (P1007), vendedor por defecto (P1008) con opción de saltear su validación (P3053), impedir modificar el tipo de cuota (P2678). | La venta rápida se completa en una sola pantalla. |
| CP-VEN-0065 | RF-VEN-065; M11 §5.3; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Imprimir la liquidación de crédito (P312, P2272) y la factura desde la venta (P2273); mostrar u ocultar importes por ítem en el reporte de la venta (P2246). | La liquidación de crédito informa capital, interés, CFT y cronograma. |
| CP-VEN-0066 | RF-VEN-066; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Registrar los equipos o máquinas vendidos (serie, producto, fecha de compra y de entrega, precio, cliente) vinculando la venta con la ficha del activo serializado de M13; las máquinas en reparación pertenecen a M13 (RMA/servicio técnico). | Desde la venta se navega a la ficha del equipo y viceversa. |
| CP-VEN-0067 | RF-VEN-067; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Vincular ventas con órdenes técnicas: los materiales vendidos en una OT generan una venta vinculada a la OT y a su solicitud. | La OT muestra sus ventas y la venta su OT. |
| CP-VEN-0068 | RF-VEN-068; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | La venta de productos no exige pertenecer a un grupo de facturación (P2519): se emite en documento propio, salvo la excepción de RF-VEN-007. | Ninguna venta de producto se agrega sola a la factura del servicio. |
| CP-VEN-0069 | RF-VEN-069; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Concepto de descuento en ventas y facturas (P2564) configurable. | El descuento global se informa como ítem con su concepto. |
| CP-VEN-0070 | RF-VEN-070; M11 §5.3; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Artículos: ART-ROU-01 Router Wi-Fi ARS 90.000 (serializado, 5 unidades en depósito DEP-01); ART-CAB-01 Cable UTP por metro ARS 800; ART-CON-01 Conector RJ45 ARS… | Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a `PROD_SERV` 1, 2, 3, 5 u otro). | Un producto "solo compras y stock" no aparece en ventas. |
### 1.4 Financiación comercial y cuotas (M11 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0080 | RF-VEN-080; M11 §5.4; PRO-O4-13 | O4 | Estándar | regla | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Configurar planes de financiación comercial: cantidad de cuotas, anticipo mínimo, tasa y método (sin interés, francés, directo), sellado, máximo por cuota, periodicidad, tipo de cuota y vigencia. | El plan "3 cuotas sin interés" del CU-23 se configura sin código. |
| CP-VEN-0081 | RF-VEN-081; M11 §5.4; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Generar el cronograma de cuotas con capital, interés, IVA (general y sobretasa), percepciones por cuota (IIBB solo si la base supera el mínimo), vencimientos y número de cuota. | La suma de cuotas = total financiado sin diferencias de redondeo. |
| CP-VEN-0082 | RF-VEN-082; M11 §5.4; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Mostrar simulación del plan con anticipo, cuotas, tasa nominal, TEA y costo financiero total (CFT) antes de confirmar. | La simulación coincide con el cronograma generado. |
| CP-VEN-0083 | RF-VEN-083; M11 §5.4; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Estados de cuota: programada, facturada, cobrada parcial, cobrada, cancelada anticipadamente, anulada; el estado de cobro proviene de la imputación de M07. | Una cuota cobrada en caja aparece como cobrada al confirmar la imputación. |
| CP-VEN-0084 | RF-VEN-084; M11 §5.4; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Facturar cuotas: por defecto en documento propio por corrida (job M05) presentado en el resumen; inclusión en la factura del servicio solo si el concepto es vinculado (RF-VEN-007). | Una cuota de venta de router nunca viaja dentro de la factura de Internet salvo que su concepto esté vinculado y validado. |
| CP-VEN-0085 | RF-VEN-085; M11 §5.4; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Cuando la inclusión está permitida, agrupar las cuotas: las asociadas a un servicio van con ese servicio y su grupo de facturación; las de un tipo de cuota con grupo indicado, al grupo indicado; el resto, al grupo por defecto. | La factura de un grupo contiene solo cuotas de servicios del grupo. |
| CP-VEN-0086 | RF-VEN-086; M11 §5.4; PRO-O4-13 | O4 | Estándar | regla | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | Seleccionar cuotas a facturar por rango de vencimiento (hasta una fecha, sin tomar las anteriores a "desde − N meses", N = 10 configurable) o lista explícita; incluir intereses diferidos si se pide. | Una cuota ya facturada (con factura) no se vuelve a tomar. |
| CP-VEN-0087 | RF-VEN-087; M11 §5.4; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Cancelación anticipada total o parcial con quita del interés no devengado según la condición del plan, generando el ajuste o NC correspondiente. | La cancelación de 2 cuotas restantes descuenta sus intereses futuros. |
| CP-VEN-0088 | RF-VEN-088; M11 §5.4; PRO-O8-13 | O8 | Estándar | migración | TEN-001 con Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de… | Modificación masiva de cuotas pendientes (sin factura, no anuladas): importe de un producto por porcentaje repartido proporcional a capital, costo del producto (diferencia contra el último precio usado), desplazar vencimientos N meses… | La sobretasa usa su propia tasa (corrige el defecto de ProCoop). |
| CP-VEN-0089 | RF-VEN-089; M11 §5.4; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Anticipos de productos: concepto de anticipo (P29), tipo de cuota para anticipo de productos (P2409), opción de descontarlos de facturación futura (P3008) y de usarlos en la facturación masiva (P3038). | Un anticipo de producto aplicado en la masiva no se aplica dos veces. |
| CP-VEN-0090 | RF-VEN-090; M11 §5.4; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Informar a M06 los ítems financiados para separarlos en el libro IVA ventas (P2972) y el detalle de ventas con concepto "factura en cuotas" (P403) como exento o excluido. | El libro IVA de M06 muestra los financiados separados si P2972. |
| CP-VEN-0091 | RF-VEN-091; M11 §5.4; PRO-O4-13 | O4 | Núcleo | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Distinguir siempre la financiación de una venta nueva de la regularización de deuda anterior (M08): distinto tipo de operación, numeración, reportes y reglas, aunque compartan el componente de cronograma. | Un convenio de M08 no puede incluir como "venta" una deuda anterior ni viceversa. |
| CP-VEN-0092 | RF-VEN-092; M11 §5.4; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Relacionar cada cuota y cada factura con su operación original (cargo, venta o presupuesto). | Desde la cuota se navega a la venta y desde la venta a todas sus cuotas y facturas. |
| CP-VEN-0093 | RF-VEN-093; M11 §5.4; PRO-O8-13 | O8 | Estándar | migración | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Recibir de M05 las importaciones de terceros con destino "venta con cuotas" (formatos EMA, SAM, EME, CT1, FAR, IAL, CEL) y crear las ventas y cuotas con numeración sin huecos. | Una importación no deja números sin usar (corrige el defecto de ProCoop). |
| CP-VEN-0094 | RF-VEN-094; M11 §5.4; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01) | Consultar el detalle de cuotas de una cuenta y agregar deuda en cuotas desde la cobranza (equivalente a `frmDetallecuotas`, `frmAgregarDeudaCuotas`), sin reconstruir cuotas por fuera de las reglas. | La reconstrucción de cuotas (`frmReconstruccion_Cuotas`) se reemplaza por la auditoría del cronograma. |
### 1.5 Vendedores, POS y rendiciones (M11 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0100 | RF-VEN-100; M11 §5.5; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Vendedores: VND-01 "Vendedor Demo Uno" (sucursal central); VND-02 "Vendedor Demo Dos" | ABM de vendedores: nombre o razón social, domicilio (calle, número, departamento, piso, barrio, provincia, localidad, código postal), teléfono, fax, celular, email, vínculo opcional con usuario o empleado (M16), sucursal, activo/inactivo. | Un vendedor inactivo no se asigna a operaciones nuevas. |
| CP-VEN-0101 | RF-VEN-101; M11 §5.5; PRO-O8-13 | O8 | Estándar | migración | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Vendedor por defecto por canal: venta rápida (P1008), anticipos y notificaciones de M07/M08 que ProCoop atribuye a un vendedor, redondeo de cobranza en efectivo (P3069); el vendedor es opcional salvo configuración. | Sin vendedor y con la validación activa, la venta no se confirma. |
| CP-VEN-0102 | RF-VEN-102; M11 §5.5; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Informe de ventas y presupuestos por vendedor (cantidad, importe, conversión, devoluciones). | El informe concilia con el total de ventas del período. |
| CP-VEN-0103 | RF-VEN-103; M11 §5.5; PRO-O11-05 | O11 | Estándar | funcional | TEN-001 con Vendedores: VND-01 "Vendedor Demo Uno" (sucursal central); VND-02 "Vendedor Demo Dos" | Comisiones de vendedores. | Solo si se aprueba PA-VEN-03. |
| CP-VEN-0104 | RF-VEN-104; M11 §5.5; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios medios… | Un cierre de sesión cuadra ventas, cobros por medio y comprobantes emitidos. |
| CP-VEN-0105 | RF-VEN-105; M11 §5.5; PRO-O10-10 | O10 | Estándar | funcional | TEN-001 con Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo) | Impresión de tickets y uso de lector/impresora de mostrador mediante el agente local de hardware. | Sin agente, el ticket se imprime desde el navegador. |
| CP-VEN-0106 | RF-VEN-106; M11 §5.5; PRO-O4-13 | O4 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | La numeración por punto de venta y comprobante (`COMPPOS`) es de M05; los descuentos por servicio y categoría (`DESCPOS`) son de M04; las posiciones de regleta telefónica (`TEL_POS_REG_*`) son de M10. | Ver CTR-VEN-02. |
| CP-VEN-0107 | RF-VEN-107; M11 §5.5; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Rendición de viajes de una venta: km reales, flete real, tipo de flete (sin asignar, propio, tercero — valores distintos), peajes, viáticos e ítems de combustible (puesto, comprobante, litros, precio por litro, cargado en viaje); cálculo… | El informe de rendición no confunde transporte propio con sin asignar. |
| CP-VEN-0108 | RF-VEN-108; M11 §5.5; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Rendición de comprobantes de venta según cobranzas (P76) **[VERIFICAR]** su significado con una cooperativa que la tenga activa. | Sin confirmación, no se implementa. |
### 1.6 Flujo continuo, transversales y reportes (M11 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-VEN-0110 | RF-VEN-110; M11 §5.6; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Flujo continuo **presupuesto → aceptación online → OT → consumo de materiales → venta/factura** en un único expediente (T11) con línea de tiempo, sin recarga manual de datos entre etapas. | Al cerrar la OT, los materiales consumidos se comparan con lo presupuestado y la factura se genera con lo aceptado más las diferencias aprobadas. |
| CP-VEN-0111 | RF-VEN-111; M11 §5.6; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador… | Diferencias entre lo presupuestado y lo ejecutado en la OT (más o menos materiales/horas): se facturan según la condición aceptada (precio cerrado o a liquidar) y las diferencias por encima de la tolerancia requieren aprobación del cliente… | Con precio cerrado, un consumo mayor no aumenta la factura. |
| CP-VEN-0112 | RF-VEN-112; M11 §5.6; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Tablero kanban de presupuestos y ventas por estado, con filtros por vendedor, sucursal y servicio. | Arrastrar una tarjeta ejecuta solo transiciones permitidas. |
| CP-VEN-0113 | RF-VEN-113; M11 §5.6; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Notificar al socio cada cambio de estado relevante (presupuesto enviado, por vencer, aceptado, OT programada, factura emitida, cuota por vencer) vía T09. | El socio recibe la notificación en el canal preferido. |
| CP-VEN-0114 | RF-VEN-114; M11 §5.6; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Respetar el cierre de período de ventas (P67) y de facturación mediante la entidad unificada de períodos de T04/M15. | Una operación con fecha en período cerrado se rechaza con mensaje claro. |
| CP-VEN-0115 | RF-VEN-115; M11 §5.6; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado | Reportes de ventas de productos (por producto, rubro, servicio, sucursal, vendedor, forma de pago), detalle de ventas, cuotas facturadas y pendientes, comprobantes no facturados, cargos por operación pendientes y facturados, conversión de… | Cada reporte declara fórmula, universo y fecha de corte. |
| CP-VEN-0116 | RF-VEN-116; M11 §5.6; PRO-O4-13 | O4 | Núcleo | seguridad | TEN-001 con Presupuestos: PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) | Todas las etiquetas por diccionario del tenant; documentos con plantillas del tenant; auditoría de cada cambio; aislamiento por tenant en consultas, exportaciones y APIs. | Un usuario de TEN-002 no ve presupuestos de TEN-001 ni por API. |
| CP-VEN-0117 | RF-VEN-117; M11 §5.6; PRO-O8-13 | O8 | Estándar | regla | TEN-001 con Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" | Copiar entre tenants la configuración de M11 (condiciones de venta, planes, reglas, plantillas) sin copiar operaciones. | La copia no incluye presupuestos, ventas ni cuotas. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-VEN-5001 — ESC-VEN-01. Instalación financiada CU-PRO-01**

- Cubre: ESC-VEN-01; relacionados: CU-PRO-01; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de ejemplo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalación financiada CU-PRO-01
- Entonces 1 cargo, 2 cuotas de ARS 11.000, sin ítem contado.

**CP-VEN-5002 — ESC-VEN-02. Cuota de router (no vinculada) en ciclo de Internet**

- Cubre: ESC-VEN-02; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cuota de router (no vinculada) en ciclo de Internet
- Entonces Documento propio; la factura de Internet no contiene la cuota.

**CP-VEN-5003 — ESC-VEN-03. Concepto vinculado sin validación fiscal**

- Cubre: ESC-VEN-03; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Concepto vinculado sin validación fiscal
- Entonces No se incluye; documento propio y alerta de configuración.

**CP-VEN-5004 — ESC-VEN-04. Evento de OT duplicado**

- Cubre: ESC-VEN-04; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Evento de OT duplicado
- Entonces Un solo cargo.

**CP-VEN-5005 — ESC-VEN-05. Visita fallida**

- Cubre: ESC-VEN-05; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Visita fallida
- Entonces Ningún cargo.

**CP-VEN-5006 — ESC-VEN-06. Aceptación de versión reemplazada**

- Cubre: ESC-VEN-06; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aceptación de versión reemplazada
- Entonces Error `ven/quote-version-superseded`.

**CP-VEN-5007 — ESC-VEN-07. Presupuesto duplicado misma cuenta y producto**

- Cubre: ESC-VEN-07; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Presupuesto duplicado misma cuenta y producto
- Entonces Bloqueo con enlace al existente.

**CP-VEN-5008 — ESC-VEN-08. Aprobar presupuesto anulado (defecto ProCoop)**

- Cubre: ESC-VEN-08; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aprobar presupuesto anulado (defecto ProCoop)
- Entonces Error `ven/invalid-transition`.

**CP-VEN-5009 — ESC-VEN-09. Venta de serie instalada en un suministro**

- Cubre: ESC-VEN-09; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Venta de serie instalada en un suministro
- Entonces Error `ven/serial-not-available`.

**CP-VEN-5010 — ESC-VEN-10. Riesgo excedido en modo `block`**

- Cubre: ESC-VEN-10; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Riesgo excedido en modo `block`
- Entonces Venta en `pendingApproval`; override con permiso.

**CP-VEN-5011 — ESC-VEN-11. Devolución CU-23 con cuota 1 cobrada**

- Cubre: ESC-VEN-11; relacionados: CU-23; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Devolución CU-23 con cuota 1 cobrada
- Entonces Cuotas 2–3 anuladas; saldo a favor.

**CP-VEN-5012 — ESC-VEN-12. Descuento contado con IVA**

- Cubre: ESC-VEN-12; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Regla: DSC-01: 5 % de descuento en ART-CAB-01 con pago contado y sin deuda vencida > 30 días
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Descuento contado con IVA
- Entonces IVA sobre neto con descuento.

**CP-VEN-5013 — ESC-VEN-13. Modificación masiva de sobretasa**

- Cubre: ESC-VEN-13; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de ejemplo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Modificación masiva de sobretasa
- Entonces Usa la tasa de sobretasa, no la general.

**CP-VEN-5014 — ESC-VEN-14. Importación de terceros con cuotas**

- Cubre: ESC-VEN-14; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de ejemplo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación de terceros con cuotas
- Entonces Numeración sin huecos.

**CP-VEN-5015 — ESC-VEN-15. Rendición con transporte propio**

- Cubre: ESC-VEN-15; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición con transporte propio
- Entonces Valor distinto de "sin asignar"; precio/km = flete/km.

**CP-VEN-5016 — ESC-VEN-16. Cierre de POS con diferencia**

- Cubre: ESC-VEN-16; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cierre de POS con diferencia
- Entonces Diferencia registrada; sesión `closed` hasta conciliar.

**CP-VEN-5017 — ESC-VEN-17. Cancelación anticipada de 2 cuotas**

- Cubre: ESC-VEN-17; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Planes: FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de ejemplo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cancelación anticipada de 2 cuotas
- Entonces Quita de interés no devengado según plan.

**CP-VEN-5018 — ESC-VEN-18. Usuario de TEN-002 consulta presupuesto de TEN-001 por API**

- Cubre: ESC-VEN-18; M11 §17.2
- Ola: O8 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario de TEN-002 consulta presupuesto de TEN-001 por API
- Entonces 404.

## 3. Casos por caso de uso (CU)

**CP-VEN-8001 — CU-23. Venta de producto financiada en cuotas (BASE §23)**

- Cubre: CU-23; M11 §16
- Ola: O8 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado TEN-001 con artículo ART-ROU-01 (router) en stock, precio ARS 90.000, plan "3 cuotas sin interés". -; actor: vendedor; sistema: M11, M13, M05, M07. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) el vendedor registra la venta VEN-001 a la cuenta de prueba; 2) M13 confirma disponibilidad y reserva; 3) elige el plan y ve la simulación (3 × ARS 30.000, TEA 0, CFT 0); 4) confirma; M05 emite según el modelo fiscal (PA-VEN-02); 5) entrega del equipo con serie (egreso M13); 6) las cuotas se facturan por corrida en documento propio y se presentan en el resumen; 7) M07 registra los cobros y las cuotas pasan a `paid`. - Excepción: devolución tras la cuota 1 cobrada: reingreso al depósito, NC, cuotas 2 y 3…
- Entonces Venta, entrega, cuotas, facturas y cobros vinculados; ninguna cuota viaja en la factura de Internet.

**CP-VEN-8002 — CU-PRO-01. Instalación financiada en el piloto (BASE §72)**

- Cubre: CU-PRO-01; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando contratación de Internet con instalación ARS 20.000 financiada en 2 cuotas de ARS 11.000 (10.000 de capital + 1.000 de interés cada una); al confirmar la OT nace un único cargo; se generan 2 cuotas vinculadas al servicio INT; la alternativa contado queda anulada. -
- Entonces La cuota 1 viaja en la primera factura de Internet (concepto vinculado y validado) o en documento propio si el tenant no validó la inclusión.

**CP-VEN-8003 — CU-INS-01. Primer cobro con instalación (BASE §73, compartido con M04/M05)**

- Cubre: CU-INS-01; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Ventas: VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M11 aporta el cargo INS-INT de ARS 30.000 (contado) a la simulación; con prorrateo y promoción el primer cobro es ARS 30.500; sin prorrateo, ARS 35.000. Una visita fallida no genera cargo. Los importes son los del ejemplo de BASE §73 y valen solo para este caso; el *seed* demo usa INS-INT ARS 20.000 (M02 §18, HUE-SRV-05; ver CTR-TAR-30 de M04).
- Entonces Se completa «Primer cobro con instalación (BASE §73, compartido con M04/M05)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-VEN-8004 — CU-VEN-01. Presupuesto con aceptación online y flujo continuo**

- Cubre: CU-VEN-01; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Conceptos: INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT…
- Dado actor: vendedor, socio, técnico. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) el vendedor crea un presupuesto de ampliación de red interna con un conjunto "Materiales" y otro "Mano de obra"; 2) lo envía por email con enlace; 3) el socio abre el enlace, recibe OTP y acepta la versión 1; 4) se crea el caso CRM y la OT con los materiales reservados; 5) el técnico ejecuta y reporta un 3 % más de cable (dentro de tolerancia 5 %); 6) el presupuesto pasa a `toInvoice` y se factura lo aceptado (precio cerrado); 7) el socio recibe la factura. -
- Entonces Se completa «Presupuesto con aceptación online y flujo continuo» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio. Alternativo o excepción: versión vencida → el enlace informa y ofrece pedir actualización; consumo 12 % mayor → aprobación del supervisor o del socio antes de facturar la diferencia.

**CP-VEN-8005 — CU-VEN-02. Venta en POS de mostrador**

- Cubre: CU-VEN-02; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Condiciones de venta: CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el cajero abre sesión con fondo ARS 10.000; vende un cable y un conector a consumidor final (cuenta por defecto); cobra con tarjeta de débito; se emite factura electrónica y ticket; al cierre, el arqueo cuadra por medio. - Excepción: sin conexión con ARCA, la venta queda pendiente de emisión y no se entrega como facturada si P727 está activo.
- Entonces Se completa «Venta en POS de mostrador» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-VEN-8006 — CU-VEN-03. Reconexión con cargo (O6)**

- Cubre: CU-VEN-03; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando M08 decide reconectar una cuenta con deuda regularizada; M10 confirma la OT; M11 genera el cargo de reconexión (concepto de M04) a la próxima factura del servicio y, si P2483 está activo, un crédito por los días desconectados.
- Entonces Se completa «Reconexión con cargo (O6)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-VEN-8007 — CU-VEN-04. Modificación masiva de cuotas**

- Cubre: CU-VEN-04; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Cuenta: Cuenta de prueba "Socio Demo" con servicio INT activo (M01)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el administrativo aumenta 10 % las cuotas pendientes de un producto; ve la vista previa (cantidad, importe actual, nuevo), confirma con motivo; el job actualiza, deja nota en cada cuenta y movimiento de ajuste. - Excepción: cuotas ya facturadas quedan excluidas y se informan.
- Entonces Se completa «Modificación masiva de cuotas» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-VEN-8008 — CU-VEN-05. Presupuesto en campo**

- Cubre: CU-VEN-05; M11 §16
- Ola: O8 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M11 §18.
- Datos de prueba: Lista de precios: LST-MOST (mostrador), LST-CAMPO (campo)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el técnico, sin señal, arma un presupuesto con productos habilitados para campo, el socio firma en pantalla; al sincronizar se crea una única vez y, si se factura en campo, se usa el tipo P2592 y se publica en autogestión.
- Entonces Se completa «Presupuesto en campo» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio
