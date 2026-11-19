# M04 TAR — Tarifas y motor de cálculo

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (núcleo de liquidación) / Impuestos (invocación) / Landing-autogestión (explicación al socio y cuadros publicados) / APIs |
| Olas | **O4** (núcleo del motor P×Q, versiones de cuadros, aprobación con doble firma, trazabilidad normativa, cargos fijos y por evento, planes, prorrateo por días y alta/baja, prorrateo entre versiones para no medidos, promociones del piloto Internet, reglas declarativas y sandbox de expresiones núcleo, invocación fiscal, franqueo, anticipos, redondeo, explicabilidad, simulador individual y masivo); **O7** (tarifas medidas: tramos y escalones, factor por días, consumo mínimo, bonificación de unidades, gas, prepaga, medidor testigo, multicategoría, energía inyectada, grandes consumos con demanda y factor de potencia, prorrateo entre versiones de medidos, catálogo completo de funciones de fórmulas, subsidios/segmentación/tarifa social, agua según inmueble, cuotas de obras de pavimento/alumbrado/cloaca/agua); **O10** (tasación telefónica y facturación de llamadas, adherentes de sepelio/salud, cuotas de vivienda); **O11** (migración repetible de cuadros y fórmulas, paralelo factura por factura) |
| Dueño de datos | `tariffSchedules`, `tariffServiceSettings`, `tariffCategoryRates`, `tariffRows`, `adherentRates`, `productPrices`, `eventCharges`, `eventChargeBonuses`, `categoryCoefficients`, `gasCalorificFactors`, `chargeRules`, `formulaFunctions`, `benefitGroups`, `benefitGroupMembers`, `subsidyRegimes`, `subsidyRollImports`, `subsidyEnrollments`, `promotions`, `promotionAssignments`, `worksInstallmentPlans`, `roundingPolicies`, `roundingCarryEntries`, `phoneRatePlans`, `phoneTimeBands`, `phoneBandAssignments`, `phoneRates`, `phoneDiscountPlans`, `phoneFreeNumbers`, `calculationRuns`, `calculations`, `simulationRuns`, `simulationResults`, `retroactiveDiffRuns`, `normativeDocuments`, ~~`preloadedCharges`~~ (reemplazado por `billableItems` de M05, CTR-DAT-38), `bonusRecalcRuns` |
| Fuentes consolidadas | BASE §6 (incl. CU-06 y datos de precarga), §37, §39.3, §40 (pasos 4–6 y comprobaciones), §41, §51 (TAR-001 a TAR-006, estructura de regla, CU-TAR-02, ejemplo de subsidio por bloque), §52 (52.1 a 52.4), §57, §71, §72 (PRO-001 a PRO-004, CU-PRO-01), §74, §86 (lo tarifario de Internet), §87 (CU-ESP-ELE), §88 (CU-ESP-AG), §89 (CU-ESP-GAS), MER-001 (CU-MER-01), MER-003, §98, §101, §106; AGR-009, AGR-010, AGR-011, AGR-017, ESC-02, ESC-05; DFA M7 (Módulo 7 completo) y DFA flujo 5 "Cambio tarifario"; REL §4 (detalle de comprobante) y §5 (tablas de facturación y cuadros tarifarios); RN-01 §1 a §23 completo (incluidas dudas 1–29); RN-06 §16, §17, §18; RN-07 §8 (8.1 a 8.10); FIC 7 (subsidios y tarifa social); CAT §2 (52 tablas de servicios, categorías y tarifas); RN-09 VENTAS_Y_FACTURACION (parámetros que afectan el cálculo); INV `Configuracion.md` (abm_Cuadros, abm_CargosAdicionales, frmEditorFormulas, abm_Servicio, abm_Servicio_Categorias, abm_Servicio_TarAdhe, abm_CateSer_Coeficientes, abm_Factor_Cal, frm_Tarifas_Masiva, frm_ActualizarPrecios, frmActualizarTarifaConOtra, frmImportarTarifas, frmModificarTarifaServicio, frm_PreciosViv), `ProMod_Titulares.md` (frmTarifaSocial_*, frmSegmentacion_Restablecer, abm_Conexion, abm_Postales), `ProMod_Facturacion.md` (frmRecategorizacion, frmTempModifBonif, frmCorregirConsumoGas, abm_Impuesto, abm_Plan_Cuo), `ProMod_Consumos.md` (frmBonificacionEstimados, frmInformesConsumos "Tramas"), `ProMod_Cobranzas.md` (frmConfiguracionPrepaga, frmVentaPrepaga), `ReglasNegocio.md` (clases de tasación `Tasacion`, `TiempoBandas`, `TiempoTipoBandas`, `TipoPlanDescuento`, `clsTelefonia`, `clsLlamadas`) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Calcular de forma **reproducible, explicable y auditable** el importe de cada concepto que se liquida a un contrato (suministro/conexión) de cualquier servicio de la cooperativa —energía, agua, cloaca, gas, Internet, TV, telefonía fija y móvil, sepelio, salud, cuotas de obras y vivienda, productos y cargos por evento— a partir de:

- una **cantidad** con fuente identificable (consumo aprobado por M03, cantidad contratada, cantidad de adherentes, datos catastrales del inmueble, llamadas tasadas, cuotas de un plan, unidades de un producto),
- una **versión tarifaria** (cuadro tarifario) aprobada con doble firma, con vigencia efectiva y respaldo normativo,
- un conjunto de **reglas declarativas versionadas** (cargos, recargos, bonificaciones, subsidios, tarifa social, promociones, tasas de terceros, excepciones por grupo) con condición, acción, vigencia, prioridad y compatibilidad,
- y la **condición fiscal** del destinatario, cuyo cálculo invoca a M06.

El resultado es una **liquidación** (`calculations`) compuesta por renglones explicables: cada renglón guarda la regla aplicada, la versión del cuadro, la base, la cantidad, el precio unitario, el tramo/escalón, la fracción de prorrateo y los datos de entrada, de modo que cualquier operador pueda responder "qué se cobró, a qué precio, con qué descuento y por qué" (BASE §6) y que una liquidación histórica pueda recalcularse bit a bit aunque luego cambien los precios (regla rectora de BASE §6, AGR-010).

El módulo incluye además el **simulador** (individual, con otra versión, masivo comparativo, prepaga y promociones), el **circuito de cambio tarifario** (resolución del regulador → nueva versión con vigencia → simulación → aprobación → aplicación en la próxima facturación; DFA flujo 5) y la **tasación telefónica**.

## 2. Límite y responsabilidades

### 2.1 Qué hace

| # | Responsabilidad |
|---|---|
| 1 | Administra versiones de cuadros tarifarios por tenant con vigencia, estados, doble firma, diferencias entre versiones y vínculo con la norma que las origina (resolución ERSeP, ENARGAS/ENReGE, ENACOM, Secretaría de Energía, ordenanza municipal, decisión del Consejo). |
| 2 | Administra, **dentro de cada versión**, los precios y reglas de cálculo de los servicios, categorías, filas de tarifa (tramos/escalones), tarifas de adherentes, precios de productos y cargos por evento, coeficientes, factores de gas y reglas (cargos adicionales). |
| 3 | Ejecuta el **motor de cálculo** como función pura: recibe un contexto (contrato, período, cantidades, versión) y devuelve renglones explicables y efectos propuestos, **sin mutar** estado de otros módulos. |
| 4 | Ejecuta el **lenguaje de fórmulas** en un sandbox seguro (sin `eval`, sin acceso a red/disco/base, con límites de pasos/tiempo y aritmética decimal). |
| 5 | Administra beneficios: grupos de excepción, regímenes de subsidio versionados, padrones importados, inscripciones por suministro, tarifa social, promociones y sus asignaciones a contratos. |
| 6 | Calcula prorrateos por días (alta, baja, cambio de plan, suspensión), entre versiones (hasta tres en un período, tres métodos) y de cargo fijo, consumo mínimo y demanda. |
| 7 | Arma el **post-proceso económico** de la liquidación: franqueo, reglas de fase comprobante, crédito por energía inyectada, propuesta de aplicación de anticipos (invocando a M07) y redondeo con su arrastre. |
| 8 | Invoca a M06 para IVA, percepciones de IVA e IIBB y tributos de terceros, entregándole los datos necesarios (alícuota resuelta en cascada por renglón, base, situación fiscal, exclusiones). |
| 9 | Provee el **simulador** y la comparación masiva de versiones, y el cálculo de diferencias por cambios retroactivos (ESC-02, ESC-05). |
| 10 | Tasa llamadas telefónicas (bandas, claves, fracciones, descuentos, mínimos, prepago, gratuitas, central virtual) y entrega el consumo telefónico valorizado. |
| 11 | Publica, si el tenant lo habilita, los cuadros tarifarios vigentes en la landing y la explicación de la factura en el portal del socio. |

### 2.2 Qué NO hace y a quién delega

| Tema | Módulo responsable | Qué consume/entrega TAR |
|---|---|---|
| Estructura de servicios, productos, subservicios, planes, categorías (alta del código, nombre, unidad, si es medido), contratos y su categoría vigente | M02 CAT | TAR lee la estructura y guarda **precios y reglas de cálculo por versión** de cada elemento. |
| Personas, cuentas, inmuebles (incl. datos catastrales TBM, coeficiente zonal, metros de frente), adherentes y beneficiarios | M01 PER | TAR lee los datos que el cálculo necesita (edad, vínculo, ocupación, discapacidad, jubilación, inmueble). |
| Lecturas, validación de consumos, estimaciones, división/distribución de consumos, medidor testigo, demanda registrada, energía inyectada medida, telemedición, prepago (saldo y cargas) | M03 MED | TAR recibe **consumos aprobados** (nunca lecturas sin validar, BASE §39.3) y devuelve propuestas (actualización de demanda contratada). |
| Ciclos, lotes, grupos de factura, numeración, tipos de comprobante, emisión, NC/ND, conversión de factura negativa en NC, vencimientos y recargos entre vencimientos, PDF, distribución | M05 FAC | TAR entrega la liquidación aprobable; M05 la convierte en comprobante y, al emitir, publica el evento que confirma los efectos diferidos. |
| Alícuotas de IVA por situación, percepciones, IIBB, padrones fiscales, regímenes, catálogo de tributos de terceros y su fundamento | M06 FIS | TAR invoca el servicio fiscal con los renglones; no define porcentajes fiscales. |
| Anticipos (saldo, alta), saldo a favor, imputaciones, cuenta corriente (incluido el saldo de arrastre de redondeo como movimiento) | M07 COB | TAR propone la aplicación; M07 la registra al emitir. |
| Intereses por mora, recargos por vencimiento, financiación y planes de pago, cuotas de financiación e interés, garantías | M08 MOR | TAR no calcula intereses; las cuotas de financiación llegan como renglones ya valorizados. |
| Tráfico de red, CDR (importación, atribución de origen/destino, plan de numeración `CARACTER`/`CLAVES`), centrales, numeración, CPP/CVLP como comprobante, órdenes técnicas de cambio de categoría | M10 TEC | TAR tasa llamadas que M10 importó y le devuelve la tasación; usa la confirmación de OT de cambio de categoría (categoría histórica). |
| Planes de vivienda (adjudicación, precios `PRECIOSVIV`, mínimos de aporte), sepelio, salud, viajes de traslado, actos de cementerio | M18 SOC | TAR calcula la cuota con los datos que expone SOC (`billing-inputs`, API-SOC-006; eventos EVT-SOC-06/07). Precios y mínimos de vivienda son de M18 (HUECO-VIV-02). |
| Índices de inflación, monedas y cotizaciones, feriados, tablas maestras, parámetros versionados | T04 CFG | TAR consume índices, cotizaciones y calendario. |
| Workflow de aprobaciones, expediente documental | T11 WFL | La doble firma usa el motor de autorizaciones de T11; los PDF normativos se guardan en el expediente. |
| Contabilización de lo liquidado | M15 CON | Cada concepto lleva su imputación contable desde M02/M15; TAR no genera asientos. |

### 2.3 Principios de diseño (obligatorios)

1. **Motor puro y determinista.** Mismas entradas + misma versión ⇒ mismo resultado (hash). Ninguna función del motor escribe en otra colección; los efectos (último período liquidado, contadores de cuotas, demanda contratada actualizada, consumo de promociones, saldo de redondeo, aplicación de anticipos, `PER_EPO`) se devuelven como `proposedEffects` y se confirman solo con el evento de emisión (RN-01 §21.16, duda 13).
2. **Versionado total.** Precios, reglas, fórmulas, parámetros de cálculo y funciones a medida se versionan juntos; un cálculo referencia la versión exacta (id + número de revisión + hash del contenido).
3. **Explicabilidad por renglón.** No existe un importe sin traza.
4. **Separación de naturaleza.** Subsidio público ≠ bonificación comercial ≠ compensación a recuperar ≠ tributo ≠ cargo propio (BASE §6, §51, §52).
5. **Sin código arbitrario.** Fórmulas como expresiones sobre un catálogo cerrado de funciones; nada de SQL ni procedimientos almacenados (BASE §51).
6. **Dinero con `Decimal128` + `decimal.js`**; precios unitarios hasta 6 decimales, cantidades hasta 4, fracciones de prorrateo 6, importes 2, con regla de redondeo explícita por concepto (AGR-011).
7. **Fechas en UTC con zona horaria del tenant** (`America/Argentina/Cordoba` por defecto) para vigencias, cortes y días de prorrateo (AGR-017).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop |
|---|---|---|---|
| Cuadro tarifario / versión tarifaria | Conjunto aprobado y versionado de precios, parámetros de cálculo y reglas de un tenant (o de un subconjunto de servicios) con vigencia desde/hasta y respaldo normativo. | `dict:tar.schedule` | `CUADROS` + `HIS_*` (foto cerrada del pasado) y tablas vivas |
| Revisión | Corrección de una versión aún no usada en comprobantes emitidos; genera número de revisión y requiere nueva aprobación. | `dict:tar.schedule.revision` | — (ProCoop edita en sitio) |
| Alcance de la versión | Servicios (y opcionalmente categorías) cuyos precios contiene la versión. | `dict:tar.schedule.scope` | — |
| Categoría tarifaria | Clase de contrato con su propio juego de precios dentro de un servicio (residencial, comercial, rural, tarifa social, grandes consumos…). La estructura es de M02; sus precios por versión son de TAR. | `dict:tar.categoryRate` | `CATE_SER` |
| Fila de tarifa | Precio unitario aplicable a un rango (tramo y/o escalón), tipo de energía, concepto o banda, cantidad de adherentes. | `dict:tar.tariffRow` | `CATTARIF` |
| Tramo | Rango de consumo **total** que elige qué tabla de escalones aplica. | `dict:tar.tier` | `CON_TMIN`/`CON_TMAX` (trama grande) |
| Escalón | Bloque progresivo dentro de un tramo con su precio. | `dict:tar.step` | `CON_MIN`/`CON_MAX` |
| Tarifa por bloque | Todo el consumo se cobra al precio de la única fila cuyo escalón lo contiene. | `dict:tar.blockRate` | Tipo de cálculo 1/4/7 |
| Cargo fijo | Importe por período independiente de la cantidad. | `dict:tar.fixedCharge` | `IMP_CF`/`CAN_CF`/`COD_CF` |
| Consumo mínimo | Unidades mínimas a pagar; las faltantes se cobran a un precio por unidad. | `dict:tar.minimumConsumption` | `IMP_MINM`/`IMP_CMINM`/`COD_CM` |
| Factura mínima | Importe mínimo de la factura de la categoría. | `dict:tar.minimumInvoice` | `FMINIMA` |
| Factor por días | Escala de los límites de tramos (o del consumo) según días reales / días de referencia, o por cantidad de unidades. | `dict:tar.daysFactor` | `AP_TR_DIAS`, `DIAS_PROP` |
| Prorrateo entre versiones | Reparto del período de consumo entre dos o tres versiones tarifarias cuando el precio cambia dentro del período. | `dict:tar.scheduleProration` | `PRORRATEO_METODO`, `PRORRATEO_VIGENCIA`, `PRORRATEO_CUADRO` |
| Proporcional de alta/baja | Fracción del período cobrada por alta o baja dentro del mes. | `dict:tar.altaBajaProportional` | `PROPORCION`, `VENCIDO` |
| Mes vencido / adelantado | Si el período se factura después de prestado o por adelantado. | `dict:tar.billingMode` | `SERVICIO.VENCIDO` |
| Regla (cargo adicional) | Definición versionada con condición, acción, base, vigencia, prioridad y compatibilidad que agrega, modifica o bonifica renglones. | `dict:tar.chargeRule` | `CARGOS_ADICIONALES` |
| Fase de servicio / fase de comprobante | Momento de evaluación de una regla: sobre cada servicio antes de agrupar o sobre el comprobante armado. | `dict:tar.rulePhase` | `FINAL` 0/1 |
| Fórmula | Expresión del lenguaje CoopApps (GFL) que calcula filtro, cantidad, importe unitario o base imponible. | `dict:tar.formula` | `FORMULA_FIL/CAN/IMP/BI` (criterios DevExpress) |
| Función de fórmula | Función del catálogo cerrado disponible en GFL. | `dict:tar.formulaFunction` | Funciones `clsFormulas_CargosAdicionales` y SP `FORMULA_CARGO_*` |
| Beneficio | Reducción del importe con origen: subsidio público, tarifa social, bonificación comercial, compensación a recuperar, promoción. | `dict:tar.benefit` | Categoría específica, `CONS_BONIF`, `ABO1BON`, cargos con `SUMA` falso |
| Grupo de excepción | Conjunto explícito o por criterio de contratos/personas al que aplica una regla, con historial y evidencia. | `dict:tar.benefitGroup` | — (se resolvía con filtros en fórmulas) |
| Régimen de subsidio | Esquema público versionado (SEF Decreto 943/2025, ReSEF, ex RASE N1/N2/N3, zona fría, tarifa social provincial) con componentes, bloques, porcentajes y cronograma. | `dict:tar.subsidyRegime` | `clsSegmentacion`, `clsTarifaSocial` |
| Padrón | Archivo de beneficiarios publicado por la autoridad e importado. | `dict:tar.subsidyRoll` | Importaciones RASE, 493/25, SEF gas, zona fría |
| Promoción | Beneficio comercial temporal por ciclos/meses sobre un concepto definido. | `dict:tar.promotion` | — |
| Cargo por evento | Concepto que se devenga ante un hito (conexión, reconexión, instalación, visita, cambio de medidor). | `dict:tar.eventCharge` | `CONEXION`, `CONE_BONIF` |
| Grandes consumos | Categoría que factura energía por banda/concepto, demanda y factor de potencia. | `dict:tar.largeCustomer` | `CATE_SER.GC` |
| Demanda contratada / registrada | Potencia en kW acordada / máxima medida en el período por banda (punta DP, fuera de punta DFP, valle DV). | `dict:tar.demand` | `DEC_CON`, `MEDSOC.CONTRATADO`, `SERSOC_DEMANDASXPERIODO` |
| Factor de potencia | Relación activa/reactiva que genera recargo o bonificación. | `dict:tar.powerFactor` | Coseno fi, `METODO_FI` |
| VAD | Valor agregado de distribución: suma de reglas cuyo concepto es de tipo 20. | `dict:tar.vad` | `GetTotalVAD` |
| Medidor testigo | Medidor de referencia cuyo consumo elige el tramo sin cambiar la cantidad facturada. | `dict:tar.witnessMeter` | `MED_TESTIGO`, `CONS_SER_TESTIGO` |
| Multicategoría | Medidor compartido que cobra un cargo fijo por cada categoría declarada con su cantidad. | `dict:tar.multiCategory` | Parámetro 2750 |
| Energía inyectada | Energía entregada a la red por un usuario-generador; consumo negativo. | `dict:tar.injectedEnergy` | Consumo activo negativo, `INDICADO` |
| Factor calórico | Coeficiente mensual de corrección de volumen de gas. | `dict:tar.gasFactor` | `FACTOR_CAL`, `CORREGAS` |
| Cuota de obra | Cuota de un plan de pavimento, alumbrado, cloaca, agua o vivienda. | `dict:tar.worksInstallment` | Tipo de cálculo 17, `SERSOC_EXTRAS.CNT_*` |
| Agua según inmueble | Cálculo no medido a partir de la Tasa Básica Mensual y coeficiente zonal del inmueble. | `dict:tar.waterByProperty` | Tipo de cálculo 15 |
| Tasación | Valorización de una llamada por plan, banda horaria, clave y fracciones. | `dict:tar.callRating` | `Tasacion_LLAMADAS` |
| Liquidación / cálculo | Resultado del motor para un contrato o comprobante con sus renglones explicables. | `dict:tar.calculation` | Ítems en memoria (`ItemsComprobante`) |
| Renglón explicable | Línea de la liquidación con su traza completa. | `dict:tar.calculationLine` | `ITEMSFAC` + `ITEMSFAC_EXTRAS` |
| Simulación masiva comparativa | Recalcular un universo con dos versiones y comparar por contrato y agregado. | `dict:tar.massSimulation` | — (propuesta DFA M7) |
| Redondeo con arrastre | Redondeo hacia abajo del total cuya diferencia se cobra en la factura siguiente. | `dict:tar.roundingCarry` | Redondeo tipo 2 "cuenta corriente de redondeo", `DEUDARED` |
| Franqueo | Cargo por envío del comprobante por correo. | `dict:tar.postage` | `POSTALES.IMP_EPO` |

## 4. Actores, permisos y alcance

| Rol (sugerido; los roles son configurables en T02) | Capabilities | Alcance de datos |
|---|---|---|
| Responsable de tarifas (carga) | `tar.cuadros.ver`, `tar.cuadros.crear`, `tar.cuadros.editar`, `tar.cuadros.enviar`, `tar.cuadros.exportar`, `tar.reglas.ver`, `tar.reglas.crear`, `tar.reglas.editar`, `tar.formulas.editar`, `tar.formulas.probar`, `tar.precios.importar`, `tar.precios.actualizarMasivo`, `tar.simulador.ejecutar`, `tar.simulador.masivo`, `tar.normas.adjuntar` | Tenant; opcionalmente limitado a servicios |
| Aprobador de tarifas (segunda firma) | `tar.cuadros.ver`, `tar.cuadros.aprobar`, `tar.cuadros.rechazar`, `tar.cuadros.publicar`, `tar.reglas.aprobar`, `tar.simulador.ejecutar`, `tar.retroactivo.aprobar` | Tenant / servicios; **nunca puede aprobar lo que él mismo envió** |
| Tercera firma (opcional, ej. Consejo/Gerencia) | `tar.cuadros.aprobarFinal` | Tenant (si PRM-TAR-004 lo exige) |
| Analista comercial | `tar.promociones.ver`, `tar.promociones.crear`, `tar.promociones.editar`, `tar.promociones.asignar`, `tar.grupos.ver`, `tar.grupos.editar`, `tar.simulador.ejecutar`, `tar.eventos.ver` | Servicios asignados |
| Aprobador comercial | `tar.promociones.aprobar`, `tar.grupos.aprobar`, `tar.excepciones.aprobar` | Servicios asignados |
| Responsable de beneficios/subsidios | `tar.subsidios.ver`, `tar.subsidios.configurar`, `tar.padrones.importar`, `tar.padrones.confirmar`, `tar.padrones.recategorizar`, `tar.padrones.exportar`, `tar.inscripciones.editar` | Servicios regulados (energía, gas, agua) |
| Facturación | `tar.calculo.ejecutar`, `tar.calculo.explicar`, `tar.simulador.ejecutar`, `tar.cuadros.ver`, `tar.retroactivo.calcular` | Tenant / sucursales |
| Atención al socio | `tar.calculo.explicar`, `tar.simulador.ejecutar` (solo individual), `tar.cuadros.ver` | Sucursales / propios |
| Configuración de telefonía | `tar.telefonia.ver`, `tar.telefonia.configurar`, `tar.telefonia.tasar`, `tar.telefonia.retasar` | Servicio telefonía |
| Configurador del tenant | `tar.config.configurar` (parámetros PRM-TAR), `tar.redondeo.configurar`, `tar.funciones.ver` | Tenant |
| Auditor / contador | `tar.*.ver`, `tar.calculo.explicar`, `tar.cuadros.exportar` | Tenant, solo lectura |
| Socio (PWA/landing) | `tar.explicacion.ver` (su factura; antes `pwa.factura.explicacion.ver`), cuadros públicos sin capability (pantalla pública sin login, si el tenant publica; antes `public.cuadros.ver`) | Sus cuentas autorizadas |
| Plataforma | `tar.funciones.administrar` (catálogo global de funciones GFL; alcance `global`; antes `platform.tar.funciones.administrar`), `tar.plantillas.administrar` (plantillas de cuadros de ejemplo, nunca precios reales; alcance `global`; antes `platform.tar.plantillas.administrar`) | Tenant `PLATFORM` |
| Soporte (acceso temporal T01) | `tar.*.ver`, `tar.calculo.explicar` | Tenant que otorgó el acceso, con vencimiento |

Controles transversales: toda acción de escritura queda en auditoría (T02); la segunda firma debe ser un usuario distinto del que envió (y del que creó cada cambio incluido); los permisos negativos se prueban (sección 17).

## 5. Requisitos funcionales

Convención de columnas: Prioridad (Núcleo / Estándar / Extensión) · Ola · Estado (Informado / Adoptado / A validar (PA) / Reemplazado / Descartado).

### 5.1 Versiones de cuadros tarifarios, aprobación y trazabilidad normativa

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TAR-001 | Crear una versión tarifaria en borrador con código, nombre (por mes o por norma, ej. "ABRIL 2026", "196/2023 GAS"), alcance (servicios y opcionalmente categorías), vigencia desde/hasta y observaciones. | BASE §6; DFA M7; REL §5 | Núcleo | O4 | Informado | La versión queda en `draft` con autor y fecha de registro; no afecta cálculos productivos. |
| RF-TAR-002 | Crear una versión copiando otra (completa o solo ciertos servicios/categorías) y mostrar diferencias contra la origen. | AGR-009; RN-01 §6.4 | Núcleo | O4 | Adoptado | La copia conserva todas las filas, reglas y parámetros; el diff lista altas, bajas y cambios campo a campo con importes antes/después. |
| RF-TAR-003 | Impedir solapamiento de vigencias para un mismo alcance (servicio+categoría) entre versiones publicadas; permitir versiones futuras programadas. | BASE §6 CU-06; DFA M7 | Núcleo | O4 | Adoptado | Publicar una versión que se superpone con otra del mismo alcance se rechaza con error `TAR-E-SCH-OVERLAP`, salvo que sea su sucesora y cierre automáticamente la anterior el día previo. |
| RF-TAR-004 | Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). | DFA M7 "Trazabilidad normativa"; BASE §51 | Núcleo | O4 | Informado | Una versión de un servicio marcado "regulado" no puede enviarse a aprobación sin al menos una norma con PDF. |
| RF-TAR-005 | Circuito de aprobación con **doble firma**: quien carga envía y otro usuario aprueba; tercera firma opcional por parámetro. | DFA M7 "Aprobación"; DFA flujo 5 | Núcleo | O4 | A validar (PA-TAR-08) | El aprobador no puede ser el creador ni quien envió; la versión aprobada registra ambos usuarios, fechas y comentario. |
| RF-TAR-006 | Exigir una simulación adjunta (individual o masiva según PRM-TAR-005) antes de enviar a aprobación. | DFA M7 "Simulador"; BASE §51 | Núcleo | O4 | A validar (PA-TAR-09) | El botón "Enviar" está deshabilitado sin simulación vigente (posterior al último cambio). |
| RF-TAR-007 | Publicar la versión de forma íntegra (todas sus dependencias: conceptos con imputación contable, alícuotas, tributos referenciados en M06, categorías existentes en M02) o no publicar nada. | AGR-009 | Núcleo | O4 | Adoptado | Si falta una dependencia la publicación se detiene con la lista de faltantes; no queda una versión parcialmente visible. |
| RF-TAR-008 | Una versión publicada es **inmutable**; correcciones posteriores solo mediante nueva revisión (si no fue usada en comprobantes emitidos) o nueva versión. | BASE §6 "tarifa anterior reproducible"; AGR-010 | Núcleo | O4 | Adoptado | Ningún endpoint permite editar una versión `published`/`active`; el intento devuelve 409. |
| RF-TAR-009 | Registrar fecha efectiva y fecha de registro en cada versión y cambio; permitir vigencia retroactiva con motivo y aprobación específica. | AGR-010; ESC-05 | Núcleo | O4 | Adoptado | Una versión cargada el 15 con vigencia el 1 muestra ambas fechas y la marca "retroactiva"; dispara RF-TAR-110. |
| RF-TAR-010 | Activar automáticamente las versiones programadas al inicio de su vigencia en la zona horaria del tenant y cerrar la anterior. | AGR-017 | Núcleo | O4 | Adoptado | Job `tar:activar-versiones` a las 00:00 locales; idempotente. |
| RF-TAR-011 | Rechazar una versión con motivo obligatorio (vuelve a borrador) y anular una versión nunca usada. | AGR-003 | Estándar | O4 | Adoptado | Anular una versión referenciada por un cálculo emitido devuelve 409. |
| RF-TAR-012 | Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. | DFA M7; REL §5 | Núcleo | O4 | Informado | Columnas y filtros según PAN-TAR-01. |
| RF-TAR-013 | Imprimir/exportar una versión (PDF y XLSX) con todos sus precios, reglas y normas. | DFA M7 "Imprimir" | Estándar | O4 | Informado | El PDF incluye hash de la versión y firmas. |
| RF-TAR-014 | Publicar opcionalmente el cuadro vigente en la landing y el portal (por servicio/categoría), con vigencia y norma. | BASE §52.2 transparencia | Extensión | O4 | Adoptado | Solo se publican precios marcados `publicVisible`; no se exponen costos internos ni columnas de subsidio. |
| RF-TAR-015 | Importar precios desde Excel (ExcelImportWizard: subir → preview con errores → confirmar) sobre una versión en borrador. | INV frmImportarTarifas; CNX | Estándar | O4 | Adoptado | Filas con errores no se aplican; el preview muestra antes/después. |
| RF-TAR-016 | Actualización masiva de precios en borrador por porcentaje o importe, con filtros por servicio, categoría, columna de precio y tipo de fila. | INV frm_Tarifas_Masiva, frm_ActualizarPrecios, frmModificarTarifaServicio | Estándar | O4 | Informado | Aplica redondeo explícito del precio a 6 decimales (o el configurado) y muestra el diff. |
| RF-TAR-017 | Actualizar precios de una categoría con los de otra (elegir columnas `unitPrice`, `costMem`, `costTne`, `costPist`, `costSubsidy`, `costPrice`; opcionalmente demanda) emparejando filas **por clave** (tramo, escalón, tipo de energía, concepto) y no por posición. | RN-01 §6.4 `ActualizarTarifaConOtra`; INV frmActualizarTarifaConOtra | Estándar | O7 | Adoptado | Si las claves no coinciden se muestra la lista de filas sin par en lugar de fallar con "inconsistencia". |
| RF-TAR-018 | Clonar una categoría (nombre con prefijo "(Copia) ") con sus filas, y reemplazar todas las filas de una categoría por copia de otra. | RN-01 §6.4 `Clonar_Categoria`, `EliminarYClonarTarifas`, `ActualizarTarifasCoincidentesConOtra` | Estándar | O4 | Informado | La copia es una nueva categoría-precio en la misma versión borrador; la categoría estructural la crea M02. |
| RF-TAR-019 | Circuito de cambio tarifario: resolución del regulador → versión nueva con vigencia → simulación → aprobación → aplicación en la próxima facturación, con prorrateo automático para períodos que cruzan la vigencia. | DFA flujo 5; RN-01 §6.4 | Núcleo | O4/O7 | Informado | El primer lote posterior usa la nueva versión y prorratea según la configuración del servicio. |

### 5.2 Precios y parámetros de cálculo por versión

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TAR-020 | Definir por versión y servicio los parámetros de cálculo: tipo de cálculo (17 estrategias), concepto de cargo fijo por defecto, moneda, período en días, cargo fijo por días, proporcional alta/baja, mes vencido, facturar sin consumo, consumo de otro servicio, división de consumos, prorrateo entre versiones (método, cargo fijo, mínimo, demanda, rango de días), tipo de obra, recategorización automática, exclusiones de adherentes, coeficientes de actualización de agua. | RN-01 §2, §5, §6.1, §8, §9, §20 `SERVICIO` | Núcleo | O4 | Adoptado | Cada parámetro tiene tipo, default y validación; cambiarlo exige nueva versión. |
| RF-TAR-021 | Definir por versión y categoría: cargo fijo (importe, cantidad, concepto, cobrar en pendiente de conexión/baja), consumo mínimo (unidades, precio, concepto, cobrar en baja), factura mínima, factor por días, base de selección de tramo, prepaga, tipo de comprobante forzado, alícuotas IVA/IIBB, agua según inmueble, grandes consumos, factor de potencia, porcentajes de vivienda. | RN-01 §3, §4, §11, §17, §20 `CATE_SER`; CAT `CATE_SER`, `CATE_SER_EXTRAS` | Núcleo | O4/O7 | Adoptado | La categoría-precio solo puede referenciar una categoría existente en M02 para el servicio. |
| RF-TAR-022 | Editor de filas de tarifa (grilla) con tramo, escalón, precio unitario (6 decimales), precio diurno/nocturno, precio de costo, columnas de costo y subsidio, cargo fijo por tramo, tipo de energía, concepto/banda, franja, concepto de recargo reactiva, cantidad de adherentes, por unidad, alícuota de IVA, concepto. | RN-01 §4, §20 `CATTARIF`; CAT `CATTARIF` | Núcleo | O4/O7 | Adoptado | Validaciones: escalones contiguos y sin huecos dentro de cada tramo; tramos sin solapamiento; al menos una fila por categoría medida. |
| RF-TAR-023 | Ordenar filas por código de concepto opcionalmente en la configuración del servicio. | V2 #2520 | Extensión | O7 | Informado | PRM-TAR-103 cambia el orden de visualización, no el de cálculo. |
| RF-TAR-024 | Tarifas de adherentes por versión: servicio, categoría (0 = cualquiera), descripción, precio, edad desde/hasta, vínculo, ocupación, franquicia de N adherentes no cobrados. | RN-01 §9; CAT `TAR_ADHE`, `HIS_TAR_ADHE`; INV abm_Servicio_TarAdhe | Estándar | O10 | Informado | Una tarifa sin filtros es la menos específica. |
| RF-TAR-025 | Coeficientes por categoría y fecha (hasta 4) para cuotas de obra y ajustes. | RN-01 §7; CAT `CATE_SER_COEFICIENTES`; INV abm_CateSer_Coeficientes | Estándar | O7 | Informado | Se toma el último coeficiente con fecha ≤ fin del período. |
| RF-TAR-026 | Factores de corrección de gas por período (mes/año), servicio y categoría (o general), con presión y temperatura. | RN-01 §4.4; CAT `FACTOR_CAL`, `CORREGAS`; INV abm_Factor_Cal | Estándar | O7 | Informado | Sin factor para el período, el cálculo del servicio devuelve `TAR-E-GAS-FACTOR`. |
| RF-TAR-027 | Precios de productos y conceptos por versión (precio de venta, costo, moneda, "incluye IVA") con vigencia. | CAT `PROD_SER`, `HIS_PROD_SER`; DFA M7 | Núcleo | O4 | Adoptado | El cálculo de un renglón de producto toma el precio de la versión vigente a la fecha de referencia. |
| RF-TAR-028 | Propiedades de servicio con mínimos y cargo fijo propios (tensión u otras) que reemplazan los de la categoría cuando se asignan al contrato. | CAT `PROPIESER` | Estándar | O7 | Adoptado | Si el contrato tiene propiedad con `fixedChargeAmount`, prevalece sobre la categoría. |
| RF-TAR-029 | Cargos por evento (conexión, reconexión, instalación, visita, cambio de medidor, transferencia) por servicio, categoría, localidad, clase, referencia, operación técnica y propiedad, con cantidad, importe editable o tope, y bonificaciones por cuenta (cantidad de eventos bonificados). | CAT `CONEXION`, `CONE_BONIF`; INV abm_Conexion; BASE §72 PRO-002, §52.3 | Núcleo | O4 | Adoptado | Un cargo de reconexión/suspensión solo se habilita con fundamento cargado (BASE §52.3); nunca existe "cargo por solicitar la baja". |
| RF-TAR-030 | Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. | CAT `DESCPOS`, `RECARGOS`, `PROD_SER_REC_DES` | Estándar | O4 | Adoptado | Se convierten en `chargeRules` de tipo porcentaje/importe sin fórmula. |
| RF-TAR-031 | Planes de cuotas de obra por contrato (cuotas totales, pagadas, unidades por cuota, totales, facturadas) con avance confirmado al emitir. | RN-01 §7 | Estándar | O7 | Adoptado | El avance de cuotas solo cambia con `fac.invoice.issued`; anular la factura lo revierte. |

### 5.3 Motor de cálculo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TAR-032 | Motor declarativo por **pipeline de pasos** configurables (sección 9.2) con estrategias por tipo de cálculo, sin `switch` monolítico. | DFA M7 "Motor declarativo"; RN-01 §21.6 | Núcleo | O4 | Adoptado | Cada paso tiene entrada/salida tipada y se puede desactivar por servicio. |
| RF-TAR-033 | Facturar P × Q con precio unitario y cantidad, unidades y fuente identificables. | BASE §51 TAR-001 | Núcleo | O4 | Informado | Cada renglón muestra cantidad, unidad, precio, fuente de la cantidad y versión. |
| RF-TAR-034 | Servicios de importe fijo (abonos), telefonía móvil y pack SMS con proporcional de alta/baja. | RN-01 §2 tipos 6/14/16, §5 | Núcleo | O4 | Informado | Abono de ARS 30.000 con alta el día 16 de un mes de 30 días en mes vencido = ARS 14.000 (fórmula 1 − 16/30) y ARS 15.000 con PRM-TAR-068 (día de alta incluido); ver RN-TAR-046. |
| RF-TAR-035 | Servicios por cantidad (tarifa por bloque o tramas sobre la cantidad contratada). | RN-01 §2 tipos 7/8 | Estándar | O4 | Informado | Cantidad 3 a ARS 1.000 = ARS 3.000. |
| RF-TAR-036 | Cargo fijo con condición del servicio, una vez por período, concepto, cantidad, moneda, por días, por tramo, proporcional, multicategoría y prorrateo por versión. | RN-01 §3 | Núcleo | O4/O7 | Informado | Ver RN-TAR-018 a 025. |
| RF-TAR-037 | Tarifa medida por bloque (tipos 1, 4) y por tramos y escalones progresivos (tipos 2, 3) con factor por días, escalones negativos y medidor testigo. | RN-01 §4 | Núcleo | O7 | Informado | Ver ejemplo numérico de 9.3. |
| RF-TAR-038 | Consumo mínimo con prorrateo por versión. | RN-01 §4.5 | Estándar | O7 | Informado | 8 m³ con mínimo 10 m³ a ARS 400 genera renglón de 2 × ARS 400. |
| RF-TAR-039 | Bonificación de unidades por contrato y primer abono bonificado. | RN-01 §3.1, §4.7 | Estándar | O4/O7 | Informado | Renglón informativo "Bonificación de N unidades" a precio 0 (salvo gas). |
| RF-TAR-040 | Gas: corrección por factor calórico, presión, temperatura, coeficiente corrector y redondeo configurable; unidades bonificadas a precio de costo. | RN-01 §4.4, §4.7; BASE §89 | Estándar | O7 | Informado | Se guardan volumen medido, factores y cantidad resultante por separado (BASE §89). |
| RF-TAR-041 | Prepaga: escalón con el consumo del mes acumulado, recargo por cambio de tramo, sin prorrateo. | RN-01 §4.8 | Estándar | O7 | Informado | Ver RN-TAR-043. |
| RF-TAR-042 | Prorrateo entre versiones dentro del período (métodos consumo, consumo continuando la trama, precio unitario; hasta tres versiones) también para cargo fijo, mínimo y demanda. | RN-01 §6; BASE §51 | Núcleo | O4 (no medidos) / O7 (medidos) | Informado | Cada renglón guarda las fracciones; suma de fracciones = 1 con 6 decimales. |
| RF-TAR-043 | Prorrateo por días por alta, baja, suspensión, reactivación y cambio de plan dentro del período, en mes vencido y adelantado. | RN-01 §5.1; AGR-017; BASE §51, §72 | Núcleo | O4 | Informado | Casos de fin de mes, bisiesto y cambio a mitad de período producen resultados aprobados (sección 17). |
| RF-TAR-044 | Grandes consumos: energía por concepto y banda con 5 modalidades de tramo, 17 modalidades de demanda, actualización de demanda contratada y factor de potencia con 5 métodos. | RN-01 §11; MER-003; BASE §87 | Estándar | O7 | Informado | Estrategias registradas y seleccionables por categoría. |
| RF-TAR-045 | Energía inyectada (usuario-generador): neteo, crédito valorizado y tratamiento del saldo negativo; ~~modelo de balance neto Ley 27.424~~ compensación monetaria Ley 27.424 por defecto y balance neto como opción del régimen (DEC-060; HUE-ELE-03). | RN-01 §4.6; MER-001; DEC-060 | Estándar | O7 | Adoptado (DEC-060; antes A validar PA-TAR-14) | CU-MER-01 reproduce la liquidación con el régimen configurado (monetario por defecto). |
| RF-TAR-046 | Consumo de otro servicio (ej. cloaca sobre agua) y división de consumos por período/secuencia. | RN-01 §2 | Estándar | O7 | Informado | Las lecturas se toman del servicio relacionado según PRM-TAR-060/061. |
| RF-TAR-047 | Servicios con adherentes (5 variantes) con categoría automática por cantidad, tarifa por adherente por edad/vínculo/ocupación y franquicia. | RN-01 §9 | Estándar | O10 | Informado | Ver RN-TAR-078 a 081. |
| RF-TAR-048 | Agua según inmueble (TBM × coeficiente zonal × coeficiente de actualización + cuota mínima × factor). | RN-01 §8; BASE §88 | Estándar | O7 | Informado | Constantes parametrizadas (PRM-TAR-070/071). |
| RF-TAR-049 | Cuotas de obras: pavimento, alumbrado (con ajuste por inflación), cloaca, agua y vivienda. | RN-01 §7 | Estándar | O7/O10 | Informado | La última cuota ajusta saldo; plan agotado no factura. |
| RF-TAR-050 | Telefonía: facturación de llamadas tasadas (suma de netos), CPP e internacionales con conceptos propios. | RN-01 §10; RN-07 §8 | Estándar | O10 | Informado | Ver RN-TAR-082 a 100. |
| RF-TAR-051 | Cargos extraordinarios precargados del período (o sin período) por contrato. | RN-01 §1.2.6; CAT `PRCAGAS` | Núcleo | O4 | Informado | Se toman una sola vez; quedan marcados al emitir. |
| RF-TAR-052 | Cargo por atraso en la devolución de productos prestados (días × precio de atraso). | RN-01 §1.2.7; V2 #3134 | Extensión | O10 | Informado | Solo si PRM-TAR-030 tiene concepto. |
| RF-TAR-053 | Franqueo una vez por período y secuencia, con exención por factura electrónica. | RN-01 §13 | Estándar | O4 | Informado | Ver RN-TAR-156. |
| RF-TAR-054 | Propuesta de aplicación de anticipos (invocando a M07) por tipo de comprobante y porcentaje. | RN-01 §14 | Estándar | O4 | Informado | Ver RN-TAR-157/158. |
| RF-TAR-055 | Redondeo de renglones y del total (simple, con arrastre, decimales pares, múltiplos) por tipo de comprobante o global, con exclusión por cuenta. | RN-01 §15 | Núcleo | O4 | A validar (PA-TAR-06, PA-TAR-07) | Ver RN-TAR-159 a 164. |
| RF-TAR-056 | Invocar a M06 para IVA (doble tasa), percepción de IVA (mínimo, sobre neto o neto+IVA, exclusión por cuenta), IIBB (base mínima, padrón, sobre IVA) y entregar alícuota resuelta en cascada por renglón. | RN-01 §17; BASE §51 TAR-006, §52.2 | Núcleo | O4 | Informado | El motor no contiene porcentajes fiscales. |
| RF-TAR-057 | Tributos de terceros (tasas municipales, fondos provinciales, ej. Decreto 2298/00, RG 27/2015, alumbrado público) como reglas de tipo impuesto vinculadas al catálogo aprobado de M06. | RN-01 §17.2; REL §4; DFA M7; BASE §52.2 | Núcleo | O4 | Adoptado | Una regla de tipo impuesto sin tributo de M06 aprobado no puede publicarse. Alumbrado público: antes de publicar una regla `tasa_alumbrado` sobre un contrato ELE se aplica la validación recíproca de RN-CAT-076 de M02 (HUE-ALU-02; error `CAT_ALU_DOUBLE_CHARGE`, criterio PRM-CAT-111): si el contrato ELE o su suministro tiene un contrato accesorio ALU (tipo 6) activo en la misma vigencia, la publicación se rechaza con la lista de contratos en conflicto; el criterio (regla sobre ELE o contrato ALU) se elige por tenant en M02. |
| RF-TAR-058 | Motor **puro**: no muta contratos, medidores, planes, saldos ni contadores; devuelve `proposedEffects` que M05 confirma al emitir. | RN-01 §21.16, duda 13; AGR-011 | Núcleo | O4 | Adoptado | Ejecutar 10 simulaciones seguidas no cambia ningún documento fuera de `simulationRuns`. |
| RF-TAR-059 | Errores de negocio tipados y no bloqueantes por servicio/cuenta (catálogo 9.11); el lote continúa con las demás cuentas. | RN-01 §1.1, §19, §21.14 | Núcleo | O4 | Adoptado | Un lote de 10.000 cuentas con 3 errores produce 9.997 cálculos y 3 errores con código y contexto. |
| RF-TAR-060 | Determinismo e idempotencia: el cálculo guarda `inputHash` y `resultHash`; recalcular con las mismas entradas da el mismo hash. | AGR-010; AGR-016 | Núcleo | O4 | Adoptado | Prueba de regresión de hashes en CI. |
| RF-TAR-061 | Rendimiento masivo: calcular lotes grandes con precarga por lotes (data loaders) y paralelismo por cuenta. | RN-01 §12.5; V2 #2315 | Núcleo | O4 | Adoptado | Objetivo de referencia (validar en T08): 50.000 contratos medidos en ≤ 30 minutos con 4 workers. |
| RF-TAR-062 | Tipo de comprobante forzado por categoría y separación en comprobante aparte por regla (grupo de factura / grupo cero). | RN-01 §1.3, §12.3 | Estándar | O4 | Informado | El motor informa a M05 el grupo; M05 arma el comprobante. |
| RF-TAR-063 | Indicar a M05 cuando el total resulta negativo para que lo convierta en nota de crédito o genere el crédito por inyectada. | RN-01 §1.1, §4.6 | Estándar | O4 | Informado | El cálculo lleva `resultSign = negative`. |

### 5.4 Reglas declarativas, fórmulas y beneficios

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TAR-064 | Reglas con identidad, ámbito, jurisdicción y respaldo, vigencia, condiciones, base, operación, compatibilidad, efectos y evidencia. | BASE §51 "Estructura propuesta de una regla" | Núcleo | O4 | Informado | Todos los elementos existen en `chargeRules`; los obligatorios se validan por tipo de regla. |
| RF-TAR-065 | Fases de evaluación por servicio y sobre el comprobante, con orden explícito. | RN-01 §12.1–12.5 | Núcleo | O4 | Informado | El orden visible coincide con el aplicado. |
| RF-TAR-066 | Acciones: cargo (renglón), recargo/descuento porcentual sobre renglones afectados, impuesto con base imponible, recargo proporcional distribuido por alícuota (fase comprobante), bonificación, precio sustituto, cantidad bonificada. | RN-01 §12.3; BASE §51 | Núcleo | O4 | Informado | Cada acción produce renglones explicables. |
| RF-TAR-067 | Reglas declarativas **sin fórmula** (porcentaje, importe fijo, escala, bloque, mínimo, máximo, umbral) sobre una base seleccionada por etiquetas de renglón. | BASE §51 "Operación"; DFA M7 | Núcleo | O4 | Adoptado | CU-TAR-02 se configura sin escribir fórmulas. |
| RF-TAR-068 | Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. **Política de preferencia declarativa (DEC-105):** la fórmula es el recurso cuando la regla declarativa de RF-TAR-067 no alcanza; toda regla con fórmula exige una justificación obligatoria de por qué no alcanza una regla declarativa (`chargeRules.formulaJustification`, RN-TAR-252), visible en la revisión y aprobación del cuadro, y el tenant tiene un informe de cuántas reglas usan fórmula (REP-TAR-18). | RN-01 §12.4–12.7; BASE §51; DEC-105 | Núcleo | O4 (núcleo) / O7 (catálogo completo) | Adoptado | Ninguna fórmula puede acceder a red, disco, base de datos ni objetos globales; prueba de seguridad en sección 17. Una regla con fórmula sin justificación no se puede enviar a aprobación (`TAR-E-FORMULA-UNJUSTIFIED`, ESC-TAR-40). |
| RF-TAR-069 | Editor de fórmulas con autocompletado de variables y funciones, validación sintáctica y de tipos, árbol de tablas de ayuda (servicios, categorías, ocupaciones, productos, localidades, referencias, actividades ARCA, clases, situaciones IVA, propiedades), prueba con casos de ejemplo y con datos reales (simulación de los últimos 5 meses). | RN-01 §12.8; INV frmEditorFormulas, abm_CargosAdicionales (AgregarCasoDePrueba) | Núcleo | O4 | Informado | El editor muestra el valor de cada sub-expresión en el caso de prueba. |
| RF-TAR-070 | Asistente IA que propone fórmulas o reglas desde lenguaje natural; solo propone, el usuario valida y prueba. | INV frmEditorFormulas btnAsistenteIA; CNX "IA solo propone" | Extensión | O7 | Adoptado | Ninguna propuesta se guarda sin validación y prueba. |
| RF-TAR-071 | Compatibilidad: prioridad, acumulación, exclusión mutua por grupo, topes (máximo de beneficio por renglón/servicio/comprobante) y resolución explícita de conflictos (nunca silenciosa). | BASE §51 CU-TAR-02 "Control" | Núcleo | O4 | Informado | Dos reglas excluyentes con igual prioridad bloquean la publicación con `TAR-E-RULE-CONFLICT`. |
| RF-TAR-072 | Filtros de aplicación: tipo de comprobante, servicio, una vez por cuenta en el lote, emisión en comprobante aparte. | RN-01 §12.1 | Estándar | O4 | Informado | Una regla con filtros de tipo de comprobante y servicio solo se aplica a comprobantes que cumplen ambos; con "una vez por cuenta en el lote" se aplica una sola vez aunque la cuenta tenga varios contratos del lote; con "emisión en comprobante aparte" el cargo sale en un comprobante distinto del principal. (criterio agregado el 05-11-2026) |
| RF-TAR-073 | Origen del beneficio obligatorio en toda regla que reduce importes: subsidio público, tarifa social, bonificación comercial, compensación a recuperar, promoción; con quien lo financia. | BASE §6, §51, §72 | Núcleo | O4 | Informado | Reportes separan cada origen. |
| RF-TAR-074 | Beneficios sobre una parte de la cantidad o del precio (bloque elegible, componente), sin extenderlos al total. | BASE §51 | Núcleo | O7 | Informado | El ejemplo de subsidio por bloque (BASE §51) da ARS 6.000 de reducción y ARS 19.000 neto. |
| RF-TAR-075 | Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. | BASE §51 TAR-002 | Núcleo | O4 | Informado | CU-TAR-02: socio incluido ARS 10.000, no incluido ARS 13.000. |
| RF-TAR-076 | Reglas por plan comercial del servicio. | BASE §51 TAR-003 | Núcleo | O4 | Informado | Dos contratos del mismo servicio y categoría con planes comerciales distintos reciben, en el mismo cálculo, solo las reglas asociadas a su plan; una regla sin plan se aplica a ambos. (criterio agregado el 05-11-2026) |
| RF-TAR-077 | Personas subsidiadas y bonificadas: diferenciar beneficio por suministro/ubicación de condición general de la persona. | BASE §51 TAR-004 | Núcleo | O7 | Informado | Una inscripción de persona no se extiende a todos sus suministros salvo regla explícita. |
| RF-TAR-078 | Regímenes de subsidio versionados (componente, bloques, porcentajes, cronograma, categorías con y sin subsidio). | BASE §52.1; FIC 7 | Núcleo | O7 | Informado | Cambiar porcentajes por prórroga = nueva versión del régimen, sin tocar código. |
| RF-TAR-079 | Importar padrones de beneficiarios (Excel/TXT) por NIS, DNI/CUIT o cuenta, con validación, preview, coincidencias, no coincidencias y duplicados. | FIC 7; INV frmTarifaSocial_Importar, _ImportarPorDni | Núcleo | O7 | Informado | Ver PAN-TAR-12. |
| RF-TAR-080 | Recategorizar contratos según padrón (con tope de consumo opcional) o inscribirlos al régimen como beneficio; restablecer la categoría anterior. | FIC 7; INV frmTarifaSocial_Restablecer, _TopeConsumo, frmSegmentacion_Restablecer, frmRecategorizacion | Núcleo | O7 | A validar (PA-TAR-10) | La recategorización es un cambio de contrato en M02 propuesto por TAR y aprobado. |
| RF-TAR-081 | Exportar la rendición de lo bonificado/subsidiado y archivos de compensación (ERSeP 166, 296, 617, gas natural, RASE, compensación de subsidio). | FIC 7 `clsTarifaSocial`, `clsCirculares` | Estándar | O7 | Informado | Formatos definidos en T06. |
| RF-TAR-082 | Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. | BASE §51, §72 PRO-003, CU-PRO-01; AGR-017 | Núcleo | O4 | A validar (PA-TAR-05) | Promoción 50 % × 3 ciclos sobre abono no descuenta instalación. |
| RF-TAR-083 | Asignar promoción al contrato guardando la foto de sus condiciones; no aplicar silenciosamente una oferta nueva a contratos previos. | BASE §72 | Núcleo | O4 | Informado | Cambiar la promoción no altera asignaciones existentes. |
| RF-TAR-084 | Contar ciclos consumidos al emitir, finalizar automáticamente y volver al importe contractual vigente, con aviso al socio. | BASE §72 CU-PRO-01 | Núcleo | O4 | Informado | Aviso vía T09 N días antes (PRM-TAR-013). |
| RF-TAR-085 | Excepciones individuales autorizadas (ajuste comercial con expediente) con motivo, aprobación y vigencia. | BASE §6, §39.3 AJU-COM | Estándar | O4 | Informado | Requiere `tar.excepciones.aprobar`. |
| RF-TAR-086 | Catálogo de conceptos de cargo aprobado: no se habilita un cargo extra sin fundamento, servicio, jurisdicción y documento permitido; no trasladar tributos propios ni productos ajenos. | BASE §52.2 (Res. 267/2024) | Núcleo | O4 | Informado | Validación al publicar. |
| RF-TAR-087 | Funciones a medida del tenant definidas como expresiones GFL con nombre (reemplazo de procedimientos almacenados `FORMULA_CARGO_*`). | RN-01 §12.7 | Estándar | O7 | A validar (PA-TAR-11) | Una función a medida es versionada y testeada como una regla. |

### 5.5 Explicabilidad, simulación, retroactivos, telefonía, reportes y migración

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TAR-088 | Cada renglón guarda: tipo, concepto, descripción, cantidad, unidad, precio unitario, importe, moneda/cotización, versión (id, revisión, hash), categoría-precio, fila de tarifa, tramo y escalón, fracción y método de prorrateo, factor por días/proporcional/kW, consumos de origen (ids M03), regla (id, versión, hash de fórmula y valores de variables), base, base imponible, alícuotas resueltas y su origen en la cascada, origen del beneficio y evidencia, datos de factor de potencia, observaciones. | BASE §6; RN-01 §21.13; DFA M7 | Núcleo | O4 | Adoptado | Ningún renglón persistido carece de `trace`. |
| RF-TAR-089 | Vista "Cómo se calculó" para el operador: árbol de pasos del pipeline, renglones y su traza, enlaces a versión, norma y consumos. | BASE §6 ejemplo | Núcleo | O4 | Informado | Desde la factura (M05) se abre en un clic. |
| RF-TAR-090 | Vista simplificada para el socio en la PWA: precio, cantidad, tramos, beneficios y su vencimiento, tributos. | BASE §72; §52.2 | Estándar | O4 | Adoptado | No se muestran costos internos ni fórmulas. |
| RF-TAR-091 | Reproducir un cálculo histórico con su versión y entradas originales y comparar hash. | BASE §6, §51; AGR-010 | Núcleo | O4 | Adoptado | La reproducción de una factura de hace 2 años da el mismo `resultHash`. |
| RF-TAR-092 | Simulador individual: contrato real o ficticio, período, consumo real o simulado, versión vigente u otra. | DFA M7; RN-01 §12.7 `TotalSimulacionCuadro`; BASE §40.4 | Núcleo | O4 | Informado | CU-06 da ARS 13.000. |
| RF-TAR-093 | Simulador masivo comparativo: universo por filtros, versión A vs B, período, consumos reales del período o de referencia; resultados por contrato y agregados por servicio, categoría, grupo, zona; distribución de variaciones; exportación. | DFA M7 "Simulador"; BASE §51 | Núcleo | O4 | Informado | El total por versión y la variación porcentual se calculan con la fórmula de 15.x. |
| RF-TAR-094 | Simulación de prepaga (importe → unidades y unidades → importe) y de promociones por ciclos (primero, intermedio, posterior al fin). | RN-01 §12.8; BASE §72 | Estándar | O4/O7 | Informado | El simulador convierte un importe de recarga prepaga en unidades y unidades en importe con el cuadro vigente, ida y vuelta sin diferencia mayor al redondeo configurado; una promoción por ciclos muestra el descuento correcto en el primer ciclo, en uno intermedio y ninguno en el ciclo posterior al fin. (criterio agregado el 05-11-2026) |
| RF-TAR-095 | Las simulaciones nunca persisten efectos y se marcan como tales. | RN-01 duda 13 | Núcleo | O4 | Adoptado | Después de una simulación individual o masiva no cambia ningún saldo, consumo de promoción, cargo ni comprobante; los resultados quedan en `simulationRuns`/`simulationResults` marcados como simulación y no aparecen en el lote de M05. (criterio agregado el 05-11-2026) |
| RF-TAR-096 | Cálculo de diferencias por cambio retroactivo de versión o de entradas (corrección de consumo) sobre liquidaciones emitidas: simular, aprobar y entregar a M05 los ajustes (ND/NC) sin reescribir el original. | ESC-02; ESC-05; BASE §51 | Núcleo | O4 | A validar (PA-TAR-12) | Obligación de ARS 12.000 recalculada en ARS 15.000 genera propuesta de ajuste de ARS 3.000. |
| RF-TAR-097 | Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada, central virtual. | RN-07 §8 | Estándar | O10 | Informado | Grilla de bandas valida cortes horarios iguales por día. |
| RF-TAR-098 | Tasar llamadas importadas por M10 y retasar las no facturadas conservando versión anterior. | RN-07 §8.4, §8.10 | Estándar | O10 | Informado | Retasar no cambia el id de la llamada (CTR-TAR-24). |
| RF-TAR-099 | Simulador de tasación de una llamada suelta con plan y clave opcionales, usando la línea vigente a la fecha simulada. | RN-07 §8.10 | Estándar | O10 | Adoptado | Tasar una llamada de duración, clave y tipo dados devuelve importe, banda, fracciones y plan aplicado según la versión de tasación vigente a la fecha simulada; sin plan indicado usa el del contrato y no registra la llamada. (criterio agregado el 05-11-2026) |
| RF-TAR-100 | Informes: consumo y neto por tramo/escalón y versión, agregado tarifario por fila y versión (usuarios, cuentas, facturas), evolución de conceptos entre períodos, impacto de cambio tarifario, beneficios por origen, promociones activas y por vencer; reglas con fórmula por servicio y cuadro (REP-TAR-18; DEC-105). | RN-01 §23.8, §23.9; DFA M7; DEC-105 | Estándar | O4/O7 | Informado | Sección 15. |
| RF-TAR-101 | Migrar cuadros históricos de ProCoop (`CUADROS` + `HIS_*` + tablas vivas) como versiones publicadas con vigencias reconstruidas. | RN-01 §6.4; T07 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | Sección 19. |
| RF-TAR-102 | Traducir fórmulas DevExpress de `CARGOS_ADICIONALES`/`HIS_CARGOS_ADICIONALES` a GFL con reporte de traducción y pruebas de equivalencia en paralelo. | RN-01 §12; T07 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | Cada fórmula queda "traducida", "traducida con advertencias" o "requiere revisión manual". Cada regla migrada con fórmula recibe la justificación `migrated_pending_review` ("traducida de ProCoop, pendiente de revisar") de RN-TAR-252 y entra en REP-TAR-18 como pendiente de revisión (DEC-105). |
| RF-TAR-103 | Parámetros de cálculo tipados por plataforma/tenant/servicio/categoría con defaults documentados, separando campos sobrecargados. | RN-01 §21.15 | Núcleo | O4 | Adoptado | `TRAMA_DEC` se separa en `tierBasis` y `largeCustomerEnergyMode`. |
| RF-TAR-104 | Abono de Internet por plan desde la **activación efectiva**, con primer período según modalidad anticipada/vencida y prorrateo por días. | BASE §72, §86; DEC-005 | Núcleo | O4 | Informado | Activación el 20/11 en mes adelantado: primer comprobante con 11/30 de noviembre + diciembre completo (según PRM-TAR-012). |
| RF-TAR-105 | Instalación como cargo de una sola vez disparado por el hito autorizado (instalación efectiva/activación); no se repite mensualmente ni se duplica con su financiación. | BASE §39.3 INS-INT, §72, §86 | Núcleo | O4 | Informado | Si se eligió financiar, el cargo de contado no se genera. |
| RF-TAR-106 | Cambio de plan dentro del período con prorrateo de ambos planes y tratamiento explícito de la promoción vigente. | BASE §86 "Cambio"; AGR-017 | Núcleo | O4 | Informado | Explicación con los dos tramos de días. |
| RF-TAR-107 | Bloquear el cálculo cuando no hay versión vigente o hay dos versiones incompatibles para el mismo caso. | BASE §6 CU-06 | Núcleo | O4 | Informado | Error `TAR-E-SCH-NONE` / `TAR-E-SCH-AMBIGUOUS`. |
| RF-TAR-108 | Checklist de habilitación tarifaria por servicio antes de facturar en producción (ámbito, prestaciones, tarifas, beneficios, tributos, cargos, bajas, documentos, responsables). | BASE §52.4 | Núcleo | O4 | Informado | Un servicio sin checklist aprobado no puede entrar en un lote productivo. |
| RF-TAR-109 | Separar compra de energía y costos de operación de la tarifa al usuario; no convertir costos en recargos. | BASE §87, §72 | Núcleo | O7 | Informado | Las columnas de costo no generan renglones salvo regla explícita aprobada. |
| RF-TAR-110 | Detectar automáticamente, al publicar una versión retroactiva, las liquidaciones pendientes (recalcular) y emitidas (proponer diferencias). | ESC-05; AGR-010 | Núcleo | O4 | Adoptado | Job `tar:diferencias-retroactivas`. |
| RF-TAR-111 | Recalcular masivamente bonificaciones de unidades por contrato (tabla de trabajo) con preview. | CAT `TEMPMODIFBONIF`; INV frmTempModifBonif | Extensión | O7 | Informado | Cambios aplicados como modificación de contrato en M02. |
| RF-TAR-112 | Configurar políticas de redondeo (tipo, decimales, conceptos) referenciables por tipos de comprobante de M05 y como política global. | RN-01 §15 | Núcleo | O4 | Adoptado | Una política de redondeo configurada (tipo, decimales y conceptos) se aplica al total de un comprobante cuyo tipo la referencia; un tipo de comprobante sin política propia usa la global; el importe de redondeo se imputa al concepto configurado. (criterio agregado el 05-11-2026) |
| RF-TAR-113 | Medición de tráfico de Internet solo genera cargos si existe fuente definida y regla aprobada; un abono por velocidad no convierte cada GB en cargo. | BASE §86 | Estándar | O4 | Informado | Con fuente de medición de tráfico definida y regla aprobada, el consumo de GB genera cargo según la regla; sin fuente o sin regla aprobada no se genera cargo por GB y el abono por velocidad se factura igual. (criterio agregado el 05-11-2026) |
| RF-TAR-114 | Contratos especiales de grandes usuarios con precio, potencia, plazo y penalidades propios, versionados, con revisión previa obligatoria por importe. | MER-003 | Estándar | O7 | Informado | Liquidaciones sobre PRM-TAR-014 requieren aprobación antes de emitir. |
| RF-TAR-115 | Cargo por evento "equipo no devuelto" (ONT, decodificador u otro equipo en comodato): concepto y regla de precio por modelo o tipo de equipo en `eventCharges` (disparador `equipment_not_returned`), plazo de devolución parametrizable (PRM-CAT-094 de M02, con plazo propio opcional por cargo), **deshabilitado por defecto** (PRM-TAR-169); el concepto solo se habilita con regla aprobada según RN-MOR-101 (M08) y fundamento cargado. Consume `stk.equipment.returnOverdue` (EVT-STK-07) para cotizar y `stk.equipment.chargeApproved` (EVT-STK-08) para generar el cargo precargado. | HUE-INT-01; BASE §74, §86; RN-MOR-101; DEC-013 | Estándar | O3 | Adoptado | Con PRM-TAR-169 apagado, EVT-STK-07 no produce cotización ni cargo. Encendido y con regla aprobada, una ONT vencida a los 15 días de la baja genera una cotización; recién con EVT-STK-08 aprobado se crea un único ítem en `billableItems` de M05 vía `fac.service.upsertBillableItem` (`sourceModule = TAR`, `sourceType = equipmentNotReturned`, `sourceRef.id = assignmentId`, idempotente; antes ~~`preloadedCharges` con `origin = equipment_not_returned`~~, CTR-DAT-38); si el equipo se devuelve antes de facturar, el cargo se cancela. |
| RF-TAR-116 | Crear el plan de cuotas de obra (`worksInstallmentPlans`) de cada beneficiario al consumir `tec.levy.approved` (EVT-TEC-25): un plan por obra + inmueble/contrato beneficiario con importe, cuotas, unidades por cuota y unidades totales; idempotente; si el contrato tipo 17 todavía no existe en M02, el plan queda `pendingContract` y se vincula al recibir el alta del contrato con la misma obra (JOB-TAR-14). | HUECO-OBR-01; RN-01 §7; RF-TEC-173 | Estándar | O7 | Adoptado | Reprocesar el mismo evento no duplica planes (clave `workId + premiseId`); 20 beneficiarios ⇒ 20 planes; el plan no factura hasta tener contrato vinculado y estado `active`. |
| RF-TAR-117 | Estrategia "cargo fijo por derecho" (perfil Derecho de sepultura): (a) adquisición del derecho con precio de la versión tarifaria, al contado o financiada en cuotas reutilizando el plan de cuotas de RF-TAR-031 (`worksInstallmentPlans` con `planKind = right_acquisition`); (b) mantenimiento periódico como cargo fijo de la categoría con su periodicidad; (c) conceptos por acto (inhumación, exhumación, reducción, traslado u otros) como cargos por evento disparados por `soc.cemeteryAct.performed` (EVT-SOC-06). | HUECO-CEM-01; M02 §6.C.11; RF-SOC-055 | Estándar | O10 | Adoptado | Derecho de ARS 240.000 (ficticio) en 24 cuotas ⇒ 24 renglones de ARS 10.000 "Cuota n/24" sin repetirse; el mantenimiento se cobra en cada período aunque el plan esté agotado; un acto realizado genera un solo cargo (idempotente por `actId`). |
| RF-TAR-118 | Regla "cargo por evento de traslado" alimentada por `soc.trip.completed` (EVT-SOC-07): importe por km × tarifa, importe fijo o precio de viaje corto (hasta N km), recargo o tarifa por característica del viaje, tratamiento cubierto / no cubierto (cubierto ⇒ sin cargo o coseguro según M02 §6.C.13; no cubierto ⇒ tarifa completa) y lista de precios propia para no asociados. | HUECO-SAL-01; M02 §6.C.13; RF-SOC-074, RF-SOC-080; CAT `MOVIL.PRE_VIAJESCORTOS` | Estándar | O10 | Adoptado | Traslado no cubierto de 12 km a ARS 900/km (ficticio) ⇒ ARS 10.800; viaje de 3 km con viaje corto hasta 5 km a ARS 2.500 ⇒ ARS 2.500; cubierto con coseguro 10 % ⇒ ARS 1.080; no asociado ⇒ precio de la lista de no asociados; el mismo `tripId` no se cobra dos veces. |
| RF-TAR-119 | Exponer en solo lectura el plan de cuotas de obra (y de adquisición de derecho) de un contrato para el portal (M19, bloque "Plan de cuotas de obra" de PAN-POR-30) y atención: obra, cuota actual n/N, cuotas facturadas, saldo en importe y en unidades (metros o importe), próxima cuota estimada y estado (API-TAR-066). | HUECO-OBR-03 | Estándar | O7 | Adoptado | El socio ve solo planes de sus cuentas autorizadas (404 si no); los valores coinciden con el último cálculo emitido; la API no permite escribir. |
| RF-TAR-120 | Exponer en solo lectura, por contrato y período, la tasación de las llamadas atribuidas por M10 (importe tasado, clave, tipo de llamada, banda, plan, fracciones, descuento o gratuidad aplicados y versión de tasación vigente) para el detalle de llamadas del portal (API-POR-122 de M19, PAN-POR-103) y atención (API-TAR-067). M04 no expone el CDR ni el número de destino: M19 los toma de M10 y solo combina por `callId`. | HUE-TEL-02; RN-07 §8 | Estándar | O10 | Adoptado | Para el período 10/2026 de un contrato telefónico la suma de importes devuelta coincide con el renglón de facturación telefónica del cálculo emitido (RN-TAR-082); las llamadas retasadas devuelven solo la versión vigente; un contrato ajeno responde 404. |
| RF-TAR-121 | Base de cálculo según el régimen de medición del contrato: al consumir `cat.contract.meteringRegimeChanged` (EVT-CAT-28) el motor toma, desde `effectiveAt`, la estrategia de cantidad por consumo (`metered`) o por cuota fija (`unmetered`) y prorratea el período del cambio (RN-TAR-250). | HUE-AG-03; RN-CAT-078 | Estándar | O7 | Adoptado | Ver RN-TAR-250 y ESC-TAR-36. |
| RF-TAR-122 | Correo electrónico y pack SMS como servicios con cupo (DEC-084): cargo fijo del plan más exceso sobre el cupo incluido, con el consumo del período informado por el aprovisionamiento (T06) y registrado por M10 (RF-TEC-195); sin consumo informado se factura solo el cargo fijo y el exceso pasa al período siguiente (RN-TAR-251). | DEC-084; PA-CAT-19; HUECO-OTR-03; RN-07 §8.9 | Estándar | O10 | Adoptado | Ver RN-TAR-251 y ESC-TAR-39. |

## 6. Reglas de negocio

Columnas: **ID** · **Regla** (comportamiento exigido en CoopApps) · **ProCoop (fuente)** · **Decisión** (Replicar / Mejorar / Reemplazar / Descartar / Adoptar para reglas de BASE/AGR) · **Parámetros** · **[VERIFICAR]**.

### 6.1 Orquestación y entrada del cálculo (RN-01 §1)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-001 | El cálculo de un lote recorre cuentas; por cuenta, calcula cada servicio seleccionado (los marcados "facturar con otros" al final), evalúa reglas de fase servicio, agrupa por (cuenta, grupo de comprobante) que informa M05, evalúa reglas de fase comprobante, crédito por inyectada, anticipos y redondeo; si el total es negativo lo informa a M05. | RN-01 §1.1 `clsFacturacionMasiva` | Replicar (pipeline 9.2) | PRM-TAR-020 (cuentas por bloque) | — |
| RN-TAR-002 | Un error de cálculo de un servicio excluye la **cuenta** del lote con error tipado y el lote continúa. | RN-01 §1.1 (servicio con excepción no aborta) | Mejorar (errores tipados) | — | — |
| RN-TAR-003 | La entrada por servicio es: contrato, servicio, período, secuencia, rango de fechas de consumo y consumos aprobados pendientes (M03). Con consumo simulado no se leen consumos. | RN-01 §1.2.1 | Replicar | — | — |
| RN-TAR-004 | Si el contrato no tiene categoría → `TAR-E-CAT-MISSING` ("El servicio X de la cuenta Y no tiene una categoría asignada"); si la categoría no existe en la versión → `TAR-E-CAT-INVALID`. | RN-01 §1.2.2 | Replicar | — | — |
| RN-TAR-005 | Servicios no medidos (fijos, adherentes, cuotas de obra) se liquidan **una vez por período**: solo si el período no fue liquidado o es el mismo período con secuencia posterior. El control se hace contra el registro de períodos liquidados y emitidos del contrato (no contra un campo editable). | RN-01 §1.2.4 (`ULT_FAC`, `SEC_PER`) | Mejorar | — | — |
| RN-TAR-006 | El avance del último período liquidado y la cantidad de liquidaciones del contrato se confirman solo con la emisión (`fac.invoice.issued`) y se revierten con la anulación. | RN-01 §1.2.5 (incrementa `CNT_FAC` al calcular) | Mejorar (efecto diferido) | — | — |
| RN-TAR-007 | Se agregan los cargos extraordinarios precargados del contrato para el período o sin período (concepto extraordinario, subtipo 1), una sola vez. | RN-01 §1.2.6 `PRCAGAS` | Replicar | — | — |
| RN-TAR-008 | Si PRM-TAR-030 tiene concepto, se agrega el cargo por atraso en devolución de productos prestados: días de atraso × precio de atraso del producto. | RN-01 §1.2.7 (`PROD_SER.PRE_ATRASO`) | Replicar | PRM-TAR-030 (V2 #3134) | — |
| RN-TAR-009 | Todos los renglones de un servicio quedan relacionados con el contrato/servicio (`contractId`, `serviceId`; CTR-DAT-30 — antes ~~`serviceContractId`, `serviceCode`~~) y el cálculo devuelve fechas y lecturas anterior/actual y consumo bonificado para las fórmulas. | RN-01 §1.2.8 (`ItemRel`) | Replicar | — | — |
| RN-TAR-010 | Si algún renglón pertenece a una categoría con tipo de comprobante forzado, ese tipo reemplaza al del lote (se informa a M05). | RN-01 §1.3 (`CATE_SER.COD_TPFC`) | Replicar | — | — |
| RN-TAR-011 | Si existen reglas de fase comprobante, anticipos y redondeo se aplican después de evaluarlas; si no, en el mismo paso. | RN-01 §1.3 | Replicar | — | — |

### 6.2 Tipos de cálculo y selección de consumos (RN-01 §2)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-012 | El tipo de cálculo del servicio (`calcType`) selecciona la estrategia: `metered_block` (1), `metered_tiers` (2), `gas` (3), `metered_fixed_by_range` (4), `phone` (5), `fixed` (6), `quantity_block` (7), `quantity_tiers` (8), `adherents_by_count` (9), `adherents_by_count_and_age` (10), `adherents_by_assigned_rate` (11), `adherents_by_all_rates` (12), `adherents_by_auto_rate` (13), `mobile_phone` (14), `water_by_property` (15), `sms_pack` (16), `works_installments` (17). Se conserva el código legacy para migración. | RN-01 §2 `clsServicio.TipoCalculo` | Replicar (estrategias registradas) | — | — |
| RN-TAR-013 | Medidos (1–4) sin consumos: si `billWithoutConsumption` y condición conectado o pendiente de desconexión, se calcula con consumo 0 (cobra cargo fijo); si no, no genera renglones. | RN-01 §2 (`FAC_SIN_CONSUMO`) | Replicar | — | — |
| RN-TAR-014 | Si el consumo aprobado trae otra categoría del mismo servicio, prevalece la del consumo; si no existe → `TAR-E-CAT-CONSUMPTION`. | RN-01 §2 | Replicar | — | — |
| RN-TAR-015 | Si el servicio está configurado para tomar el consumo de otro servicio de la misma cuenta (ej. cloaca sobre agua), usa esos consumos; PRM-TAR-060/061 los restringen a no liquidados. Si el servicio relacionado falta, está dado de baja o no tiene consumo aprobado para el período, aplica RN-TAR-247 (`TAR-E-RELATED-MISSING`). | RN-01 §2 (`REL_SER`, `USA_COT`) | Replicar | PRM-TAR-060 (V2 #2701), PRM-TAR-061 (V2 #3143) | — |
| RN-TAR-016 | División de consumos: modo 1 toma lecturas del grupo dividido solo si corresponden al período general; modo 2 solo si coinciden período y secuencia. | RN-01 §2 (`SERVICIO_EXTRAS.DIVISION_CONSUMO`) | Replicar | — | — |
| RN-TAR-017 | Condiciones del contrato relevantes para el cálculo: 1 pendiente de conexión, 2 conectado, 3 pendiente de desconexión, 4 baja, 5 no vigente (el catálogo de estados es de M02; TAR usa su clasificación). | RN-01 §2 `CondicionServicio` | Replicar | — | — |

### 6.3 Cargo fijo (RN-01 §3)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-018 | Se cobra cargo fijo si: condición 2 o 3 (o 1/4 con `chargeFixedWhenPendingOrDown`), no hay primer abono bonificado pendiente, la categoría tiene cantidad ≠ 0, importe ≠ 0 y concepto (de categoría o, en su defecto, de servicio), y no se cobró en el período (o mismo período con secuencia posterior). El proceso puede forzar el cobro (simulación con otra versión). | RN-01 §3.1 | Replicar | — | — |
| RN-TAR-019 | Primer abono bonificado: si está marcado, se omite el cargo fijo una sola vez y la marca se apaga **al emitir**. | RN-01 §3.1 (`ABO1BON`) | Mejorar (efecto diferido) | — | — |
| RN-TAR-020 | Renglón de cargo fijo (`kind=fixed_charge`, subtipo legacy 10): cantidad = cantidad CF × fracción de prorrateo × múltiplo; precio = importe × cotización si el servicio tiene moneda extranjera (cotización vendedora). | RN-01 §3.1 (`COD_MON`) | Replicar | PRM-TAR-015 | — |
| RN-TAR-021 | Cargo fijo por tramo: con PRM-TAR-040, se busca la fila cuyo tramo (tipo 2) o escalón (tipo 1) × proporción contiene el consumo y, si tiene cargo fijo, se usa ese importe. Proporción = días/días de referencia si el factor por días es 1 (anulado por PRM-TAR-043 si los días son menos que la referencia). El consumo para elegir puede ser el del medidor testigo o el consumo sin restar inyectada (PRM-TAR-044). | RN-01 §3.2 | Replicar | PRM-TAR-040 (V2 #2821), PRM-TAR-043 (#2864), PRM-TAR-044 (#3103) | — |
| RN-TAR-022 | Cargo fijo por días: si el servicio tiene `fixedChargeByDays` y hay consumo y días, importe = importe × cantidad CF × días / período del servicio (30 si no está definido). | RN-01 §3.2 (`PPERIODO`, `PERIODO`) | Replicar | — | — |
| RN-TAR-023 | Si no es por días y el servicio tiene proporcional, el cargo fijo pasa por el proporcional de alta/baja (RN-TAR-049/050). | RN-01 §3.2 | Replicar | — | — |
| RN-TAR-024 | Multicategoría (medidores compartidos): si la categoría figura en PRM-TAR-045, se cobra un cargo fijo por cada par (categoría, cantidad) declarado en el contrato; cada cargo usa la cantidad como múltiplo. En CoopApps los pares se guardan como lista estructurada del contrato (no como propiedades consecutivas). | RN-01 §3.3 | Mejorar (estructura) | PRM-TAR-045 (V2 #2750) | — |
| RN-TAR-025 | Prorrateo de cargo fijo: si el servicio lo indica y hay prorrateo entre versiones, se emite un renglón por versión con su importe y cantidad × fracción; si la categoría no existe en la versión anterior, todo va a la actual. | RN-01 §3.4 | Replicar | — | — |

### 6.4 Servicios medidos: tramos, escalones, factores, mínimos, inyectada, bonificación y prepaga (RN-01 §4)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-026 | Tarifa por bloque (tipos 1, 4, 7): una sola fila con `stepMin ≤ consumo < stepMax`; todo el consumo al precio de esa fila (sin progresividad). Tipo 4: cantidad 1 al precio del escalón. Tipo 7 pasa además por proporcional de alta/baja. Sin fila → `TAR-E-RATE-NOTFOUND` ("No existe tarifa para el consumo realizado…" con cuadro, consumo, tipo de energía y concepto). | RN-01 §4.1 | Replicar | — | — |
| RN-TAR-027 | En tarifa por bloque con factor por días, el comportamiento legacy multiplica el **consumo facturado** por el factor; CoopApps ofrece dos modos por categoría: `scale_quantity` (legacy) y `scale_limits` (escalar los límites como en tramas). | RN-01 §4.1, §4.3, duda 1 | Mejorar | `tariffCategoryRates.daysFactorMode` | A validar (PA-TAR-02) |
| RN-TAR-028 | El renglón medido guarda la fila de tarifa (`tariffRowId`) y su alícuota de IVA si la fila la define (subtipo legacy 1). | RN-01 §4.1 | Replicar | — | — |
| RN-TAR-029 | Tramos y escalones (tipos 2, 3, 8 y grandes consumos): se elige el **primer tramo** (orden por mínimo) con `tierMin×prop ≤ consumoTramo ≤ tierMax×prop`; consumoTramo = consumo o el del medidor testigo; dentro del tramo, escalones ordenados por \|máximo\|; ancho = \|red2(max × prop × factorTramo)\| − \|red2(min × prop × factorTramo)\|; tomado = mín(\|restante\|, ancho) con el signo del consumo; se emite renglón si tomado ≠ 0 o consumo = 0, con cantidad = tomado × fracción de prorrateo y precio = precio × factor de precio; si al final queda restante ≠ 0 → `TAR-E-TIERS-INCOMPLETE` ("Faltan tramas en la Categoría indicada"). | RN-01 §4.2 | Replicar | — | — |
| RN-TAR-030 | Con consumo negativo (inyectada neta) se usan solo escalones con mínimo < 0; con positivo, escalones con máximo ≥ 0. | RN-01 §4.2 | Replicar | — | — |
| RN-TAR-031 | Con PRM-TAR-041, la proporción vale 1 para los anchos y, si el consumo supera el máximo del tramo, los renglones llevan la observación "Beneficio por Días". | RN-01 §4.2 (V2 #2827) | Replicar | PRM-TAR-041 | — |
| RN-TAR-032 | `red2` es redondeo a 2 decimales (half-up); el ancho se escala por la proporción de días y por el factor de tramo (kW en grandes consumos según potencia). | RN-01 §4.2 | Replicar | — | — |
| RN-TAR-033 | Si ningún tramo contiene el consumo, error tipado `TAR-E-TIER-NOTFOUND` (en ProCoop excepción genérica de secuencia vacía). | RN-01 §4.2, §19 | Mejorar | — | — |
| RN-TAR-034 | Factor por días: modo 1 con días de referencia > 0 ⇒ factor = días de consumo / días de referencia (PRM-TAR-043 lo anula si días < referencia); modo 2 ⇒ factor = cantidad del contrato (1 si 0), para multiplicar tramos por unidades (ej. departamentos de un medidor colectivo); sin configuración ⇒ 1. Días de consumo = fecha actual − fecha anterior del grupo de consumos; con prorrateo por rango completo y lecturas divididas, se usa el rango original. En tramas escala límites; en bloque, ver RN-TAR-027. | RN-01 §4.3 | Replicar | PRM-TAR-043 (V2 #2864) | — |
| RN-TAR-035 | Gas: por cada consumo activo, volumen = neto (o consumo si no hay neto); si el factor del período tiene presión y temperatura, volumen = red4(volumen × presión × temperatura); consumo = volumen × factor × coeficiente corrector del contrato (1 si ≤ 0) / factor calórico óptimo; luego redondeo según PRM-TAR-051; después tramas. El factor se busca por mes/año del período, primero por categoría y luego general; sin factor → `TAR-E-GAS-FACTOR`. Se guardan volumen, factores y resultado por separado. **M04 es el único que aplica la corrección (DEC-085):** el volumen de entrada es el volumen medido sin corregir que entrega M03 (`consumptions.measuredVolume`, y `meteringPoints.gasCorrectionCoefficient` como coeficiente corrector); M03 no corrige ni bloquea por falta de factor, y esta regla reemplaza a RF-MED-063, RN-MED-069, RN-MED-070 y CTR-MED-06 de M03. El resultado corregido se guarda en `calculations` (traza del renglón) y es el que muestra la factura. No aplica a gas envasado (DEC-082), que se factura por unidad vendida. | RN-01 §4.4; RN-06 §16.2; BASE §89; DEC-085 | Replicar + Mejorar (traza) | PRM-TAR-050 (V2 #14), PRM-TAR-051 (#119), PRM-TAR-052 (#149), PRM-TAR-168. M04 es el único dueño de los factores (`gasCalorificFactors`, PAN-TAR-09) y de estos parámetros; M03 los lee (PA-TAR-19 opción A; HUE-GAS-03). | — |
| RN-TAR-036 | PRM-TAR-051 admite: truncar a entero, redondear a 0 decimales, redondear a 2, redondear a 6 y solo dividir; los 5 modos se implementan (ProCoop solo traduce 2 de los modos de redondeo). | RN-01 duda 6 | Mejorar | PRM-TAR-051 | — |
| RN-TAR-037 | Consumo mínimo: aplica si la categoría tiene concepto, unidades mínimas > 0 y precio por unidad faltante > 0 y hubo lecturas reales; se activa si el consumo **sin inyectada** < mínimo; renglón `kind=minimum` (subtipo 11) con cantidad = mínimo − consumo y precio por unidad faltante; solo si la condición es "conectada", o PRM-TAR-042 está apagado, o la categoría cobra mínimo en baja. Con prorrateo de mínimo, un renglón por versión: método 3 prorratea el precio; los demás, la cantidad. | RN-01 §4.5 | Replicar | PRM-TAR-042 (V2 #2465) | — |
| RN-TAR-038 | Energía inyectada: un consumo activo es inyectado si es < 0 y su medidor está marcado como indicado, o si el estado avanzó. Consumo neto = suma algebraica; consumo sin inyectada = suma de positivos. Usos: mínimo compara contra sin inyectada; cargo fijo por tramo con PRM-TAR-044 ignora inyectada; factor de potencia con PRM-TAR-062 incluye inyectada. | RN-01 §4.6; RN-06 §18 | Replicar | PRM-TAR-044, PRM-TAR-062 (V2 #2737) | — |
| RN-TAR-039 | Neto negativo: las tramas usan escalones negativos y generan renglones de cantidad negativa (crédito valorizado). Si el comprobante resulta negativo y tiene inyectada, se agrega el concepto de PRM-TAR-063 por el importe opuesto (anticipo a facturación futura) que deja el comprobante en 0 y el saldo a favor. | RN-01 §4.6 (V2 #3094) | Replicar en modo compatibilidad; modelo MER-001 como objetivo | PRM-TAR-063 | A validar (PA-TAR-14) |
| RN-TAR-040 | Bonificación de unidades del contrato: se descuentan N unidades del consumo (si el consumo es menor, se bonifica todo); con varias categorías se consume en orden; renglón informativo a precio 0 "Bonificación de N Unidades". | RN-01 §4.7; §23.1 | Replicar | — | — |
| RN-TAR-041 | En gas, las unidades bonificadas se facturan como "Cargo M3 Bloque" al precio de costo de la fila (ponderado por versión si hay prorrateo); si falta la fila de costo → `TAR-E-GAS-COSTROW` (en ProCoop referencia nula). | RN-01 §4.7, §19 | Replicar + Mejorar (error) | — | — |
| RN-TAR-042 | Consumo cero (no grandes consumos ni tipo 4): renglón de servicio a precio 0 con la cantidad bonificada y la fila del escalón que contiene 0, para trazabilidad. Con PRM-TAR-064 y prorrateo, renglones extra por versión solo para registrar la versión aplicada. | RN-01 §4.7 (V2 #2876) | Replicar | PRM-TAR-064 | — |
| RN-TAR-043 | Prepaga: el escalón se determina con consumo actual + lo ya liquidado en el mes (sin contar entregas de energía); se quitan de los primeros renglones las unidades ya liquidadas; si el cambio de escalón genera diferencia, renglón con el concepto de PRM-TAR-065 ("recargo en cambio de trama"); las categorías prepagas no se prorratean entre versiones. | RN-01 §4.8 | Replicar | PRM-TAR-065 (V2 #2283) | — |

### 6.5 Servicios fijos, por cantidad y proporcionales (RN-01 §5)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-044 | Servicios fijos: se agrega el cargo fijo (salvo multicategoría, que factura una vez por par categoría-cantidad). Tipos 6, 14 y 16 toman la primera fila de la categoría; si su precio ≠ 0 emiten el renglón pasando por el proporcional de alta/baja. Tipo 7: tarifa por bloque sobre la cantidad contratada. Tipo 8: tramas sobre la cantidad contratada. | RN-01 §5 `GetItemsServicioFijo` | Replicar | — | — |
| RN-TAR-045 | Categoría histórica: con PRM-TAR-066, en servicios fijos por mes vencido se usa la categoría anterior si una orden técnica de cambio de categoría (operación PRM-TAR-067) se confirmó después del período liquidado; las variables de fórmula de categoría también toman la categoría del renglón. | RN-01 §5, §12.9 (V2 #3111, #2330) | Replicar | PRM-TAR-066, PRM-TAR-067 | — |
| RN-TAR-046 | Proporcional de alta/baja (si el servicio lo indica), **mes vencido**: alta en el mes liquidado ⇒ precio × (1 − díaAlta / díasMes); con PRM-TAR-068 (tomar día de reconexión) ⇒ precio × (díasMes − díaAlta + 1) / díasMes; baja en el mes ⇒ precio × díaBaja / díasMes. `díasMes` = días reales del mes calendario en la zona horaria del tenant. | RN-01 §5.1 (V2 #2787); AGR-017 | Replicar | PRM-TAR-068 | — |
| RN-TAR-047 | **Mes adelantado**: si el alta fue en el mes anterior y ese mes no se liquidó, se agrega un renglón extra por el período anterior a precio × (1 − díaAlta / díasMes), además del mes completo. | RN-01 §5.1 | Replicar | PRM-TAR-012 | — |
| RN-TAR-048 | El factor proporcional aplicado se guarda en el renglón (`proportionalFactor`) y se expone a fórmulas (`altaBajaFactor()`; 1 si no tiene). | RN-01 §5.1 | Replicar | — | — |

### 6.6 Prorrateo entre versiones tarifarias (RN-01 §6.1–6.3)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-049 | Configuración por servicio y versión: método 0 sin prorrateo, 1 proporcionalidad en consumo, 2 consumo continuando la trama, 3 proporcionalidad en precio unitario; banderas para prorratear cargo fijo, consumo mínimo y demanda, y para usar el rango completo de lecturas divididas. La "vigencia" y "versión anterior" ya no se cargan a mano: se derivan de la secuencia de versiones publicadas del alcance. | RN-01 §6.1 (`PRORRATEO_*`) | Mejorar | — | — |
| RN-TAR-050 | Hay prorrateo si la categoría no es prepaga, el método ≠ 0 y alguna versión distinta de la vigente a la fecha actual de lectura estuvo vigente después de la fecha anterior de lectura. | RN-01 §6.2 `TieneProrrateo` | Replicar | — | — |
| RN-TAR-051 | Fracciones: días = fechaActual − fechaAnterior; fracción anterior = red6((vigencia − fechaAnterior)/días); actual = 1 − anterior (si fechaActual > vigencia, actual = red6((fechaActual − vigencia)/días), anterior = 1 − actual). Si alguna fracción < 0 o la suma > 1, todo a una sola versión (la actual si vigencia ≤ fechaAnterior). | RN-01 §6.2 | Replicar | — | — |
| RN-TAR-052 | Tercera versión: si la anterior tuvo a su vez un cambio dentro del período, se repite el cálculo sobre su porción; se soportan hasta 3 versiones por período. Más de 3 → `TAR-E-PRORATION-TOO-MANY`. | RN-01 §6.2 | Replicar + Mejorar (error) | — | — |
| RN-TAR-053 | Cada renglón guarda las tres fracciones (`fractionCurrent`, `fractionPrevious`, `fractionPrevious2`) y la versión que lo valorizó; fórmulas: `prorationCurrent()`, `prorationPrevious()`, `prorationPrevious2()`. `prorationCurrent()` devuelve la primera fracción ≠ 0; si no hay, 1, salvo que la suma de anteriores supere 0,99 (devuelve 0). | RN-01 §6.2 (`ITEMSFAC_EXTRAS.COD_CUA`, `GetProrrateo*`), §12.7 | Replicar | — | — |
| RN-TAR-054 | Método 1: cada versión tarifa el consumo **completo** con sus escalones y la cantidad de cada renglón se multiplica por su fracción (renglones separados por versión). | RN-01 §6.3 | Replicar | — | — |
| RN-TAR-055 | Método 2: la versión anterior tarifa consumo × fracción anterior desde el primer escalón; la actual tarifa el total descontando de sus primeros escalones lo ya cobrado por la anterior (el período nuevo continúa en el escalón donde quedó el anterior). | RN-01 §6.3 | Replicar | — | — |
| RN-TAR-056 | Método 3: un único juego de renglones con precio = Σ(precio de la versión × fracción); exige escalones idénticos en todas las versiones, si no `TAR-E-PRORATION-STEPS-MISMATCH` ("Las cantidades de tarifas actuales y del cuadro tarifario no son coincidentes" / "Los valores de las tramas no coinciden…"). Se valida al **publicar** la versión (si el servicio usa método 3) además de al calcular. | RN-01 §6.3 | Replicar + Mejorar (validación temprana) | — | — |
| RN-TAR-057 | Si falta la tarifa en una versión del prorrateo → `TAR-E-PRORATION-RATE-MISSING` ("No existen tarifas en el cuadro tarifario a prorratear. Categoría: X" / "No existe tarifa en el cuadro N (tercer prorrateo)…"). | RN-01 §6.3 | Replicar | — | — |
| RN-TAR-058 | En tarifa por bloque con 3 versiones (métodos 1 y 2), el renglón de la tercera versión usa **su propio** precio (ProCoop usa el de la segunda: error). | RN-01 duda 2 | Mejorar (corregir) | — | A validar (PA-TAR-03) |

### 6.7 Versiones de cuadros y herramientas de copia (RN-01 §6.4)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-059 | En ProCoop un cuadro es la foto cerrada de la tarifa vigente **hasta** su creación y las tablas vivas son la tarifa actual. En CoopApps toda tarifa (incluida la actual) es una versión con `validFrom`/`validTo`; no existen "tablas vivas" editables. | RN-01 §6.4 | Reemplazar (CTR-TAR-01) | — | — |
| RN-TAR-060 | Alta legacy de cuadro (preguntar backup si no hay facturas sin cuadro; `FEC_DESDE` = mayor `FEC_HASTA` existente o hoy − 5 años; `FEC_HASTA` = creación; copia de `SERVICIO`, `CATE_SER`, `CATTARIF`, `CARGOS_ADICIONALES`, `PROD_SER`, `IMPUESTO`, `TAR_ADHE`, `CATE_SER_EXTRAS` a `HIS_*`; registro del usuario) solo se usa como **regla de reconstrucción de vigencias en la migración**. | RN-01 §6.4 `CargarCuadroNuevo`, `abm_Cuadros` | Reemplazar (sección 19) | — | — |
| RN-TAR-061 | `HIS_SERVICIO_EXTRAS` se llena desde `SERSOC_EXTRAS` (error de ProCoop); en migración se toman los extras del servicio (`SERVICIO_EXTRAS`) vigentes y se reporta la diferencia. | RN-01 §6.4, duda 25 | Descartar el comportamiento | — | [VERIFICAR] en base LAG |
| RN-TAR-062 | ProCoop asocia las facturas con `COD_CUA` vacío al cuadro nuevo (vacío = "tarifa viva"). En CoopApps cada liquidación guarda en el momento del cálculo la versión exacta (id, revisión, hash) de cada renglón. | RN-01 §6.4 `GuardarCodCuaFacturas` | Reemplazar | — | — |
| RN-TAR-063 | En ProCoop el servicio histórico solo se consulta pero los cargos adicionales históricos se editan. En CoopApps nada de una versión publicada es editable (ni reglas ni fórmulas). | RN-01 §6.4, §12.8 | Reemplazar (CTR-TAR-02) | — | — |
| RN-TAR-064 | Circuito de actualización de precios: (1) copiar la versión vigente a borrador, (2) modificar, (3) fijar vigencia, (4) simular, (5) aprobar; el prorrateo con la versión anterior es automático (RN-TAR-049). | RN-01 §6.4 (circuito implícito) | Reemplazar | — | [VERIFICAR] circuito real con LAG |
| RN-TAR-065 | Calcular con una versión forzada (simulación, función de simulación con otra versión, prorrateo) usa exclusivamente precios, categorías activas, filas activas, tarifas de adherentes y reglas de esa versión. | RN-01 §6.4 (`CuadroTarifario` forzado) | Replicar | — | — |
| RN-TAR-066 | Clonar categoría: nueva categoría-precio con nombre "(Copia) " + nombre (máx. 40 caracteres en ProCoop; en CoopApps 120) y sus filas. | RN-01 §6.4 `Clonar_Categoria` | Replicar | — | — |
| RN-TAR-067 | Actualizar tarifa con otra: copia los precios elegidos (`unitPrice`, `costMem`, `costTne`, `costPist`, `costSubsidy`, `costPrice`) y opcionalmente precios y conceptos de demanda; el emparejamiento es por clave (tramo, escalón, tipo de energía, concepto) con preview; sin par → lista de faltantes (ProCoop: por posición y error "Se ha producido una inconsistencia al Actualizar las Tarifas"). | RN-01 §6.4 `ActualizarTarifaConOtra` | Mejorar | — | — |
| RN-TAR-068 | Eliminar y clonar tarifas: reemplaza todas las filas de una categoría por copia de las de otra (en borrador). | RN-01 §6.4 `EliminarYClonarTarifas` | Replicar | — | — |
| RN-TAR-069 | Actualizar tarifas coincidentes: copia filas completas emparejadas hasta la menor cantidad conservando identificadores; sin filas → "No se encontraron tarifas para realizar la actualización." | RN-01 §6.4 `ActualizarTarifasCoincidentesConOtra` | Replicar (por clave) | — | — |

### 6.8 Cuotas de obras y vivienda (RN-01 §7)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-070 | Cuotas de obras (tipo 17): cobra el cargo fijo si corresponde; exige tipo de obra (pavimento, agua, cloacas, alumbrado, vivienda), si falta `TAR-E-WORKS-TYPE` ("Debe indicar el tipo de obra…"). | RN-01 §7 | Replicar | — | — |
| RN-TAR-071 | El plan del contrato (`worksInstallmentPlans`) guarda cuotas totales, cuotas facturadas, unidades por cuota (metros o importe), unidades totales y unidades facturadas; el avance se confirma al emitir. `worksInstallmentPlans` es la **única fuente** del plan: los campos `SERSOC_EXTRAS.CNT_*` se migran a esta colección y `serviceContracts.extras` (M02) conserva solo atributos no tarifarios (HUECO-OBR-05; T07 §19.1 se corrige en consecuencia). Los planes se crean por RF-TAR-116 (obra aprobada) o por migración. | RN-01 §7 (`SERSOC_EXTRAS.CNT_*`) | Mejorar (colección propia, efecto diferido) | — | — |
| RN-TAR-072 | Pavimento: si faltan unidades totales se calculan del inmueble asociado por nomenclatura catastral (sin inmueble → `TAR-E-WORKS-PROPERTY` "El servicio no tiene un inmueble relacionado…"); precio por unidad = coeficiente vigente de la categoría con fecha ≤ fin del período; la última cuota ajusta el saldo de unidades; descripción "Cuota n/N"; plan agotado no factura. | RN-01 §7 | Replicar | — | — |
| RN-TAR-073 | Alumbrado: igual que pavimento pero exige unidades totales (`TAR-E-WORKS-METERS` "El servicio no tiene un total de metros asignado…"); ajuste por inflación si la categoría tiene índice: coeficiente × índice del período − 2 / índice del mes anterior al alta; falta de índice → `TAR-E-INDEX-MISSING` con período; sin plan → `TAR-E-WORKS-PLAN`. | RN-01 §7 (`INFLACIO`) | Replicar | — | — |
| RN-TAR-074 | Cloaca: la cuota es un importe (cantidad 1, precio = unidades por cuota); la última cuota cobra el saldo. | RN-01 §7 | Replicar | — | — |
| RN-TAR-075 | Vivienda: porcentaje por cuota = mínimo después de adjudicar (si adjudicada) o antes (si no) del plan de M18; en su defecto ~~PRM-TAR-072/073~~ PRM-SOC-019/PRM-SOC-018 (M18; HUECO-VIV-02); tope = porcentaje a facturar − facturado; renglón (subtipo 27) con cantidad = porcentaje/100 y precio = precio de vivienda vigente ~~a la fecha (último con fecha ≤ hoy, por categoría)~~ **a la fecha del período facturado (último precio con fecha ≤ fecha del período facturado, por categoría/tipología)**, alineado con RN-SOC-032, RF-SOC-086 y CTR-SOC-15 (HUECO-VIV-01). M18 es el dueño de precios y mínimos de vivienda (PAN-SOC-17, API-SOC-034, PRM-SOC-018/019) y los entrega por `billing-inputs` (API-SOC-006); M04 solo calcula el renglón (HUECO-VIV-02). | RN-01 §7, §23.2 (`PLANESVIV`, `PRECIOSVIV`; V2 #634, #635) | Replicar + Mejorar (fecha del período) | PRM-SOC-018, PRM-SOC-019 (M18, lectura); PRM-TAR-072, PRM-TAR-073 reemplazados | — |
| RN-TAR-076 | Obra de agua no tiene algoritmo (solo cargo fijo); la cuota se factura manualmente: renglón con cantidad × (importe/cantidad) que suma la cantidad a unidades facturadas al emitir; sin datos del plan → `TAR-E-WORKS-PLAN` ("El Servicio seleccionado no tiene datos Extra creados"). CoopApps agrega el algoritmo "importe por cuota" para agua igual que cloaca, habilitable. | RN-01 §7 `GetFactura_ServicioCuotaAgua`, duda 9 | Replicar + Mejorar | — | [VERIFICAR] uso real en LAG |

### 6.9 Agua según inmueble (RN-01 §8)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-077 | Una vez por período: coefActualización = `coefUpdate1` si coeficiente zonal ≤ umbral (0,8) si no `coefUpdate2`; cuotaMínima = `minQuota1` si zonal ≤ umbral si no `minQuota2`; importe = red2(TBM × zonal × coefActualización + cuotaMínima × factor (0,7)). Errores: sin inmueble `TAR-E-WATER-PROPERTY`, TBM ≤ 0 `TAR-E-WATER-TBM` ("Tasa Básica Mensual Inválida"), zonal ≤ 0 `TAR-E-WATER-ZONAL` ("Coeficiente Zonal Inválido"). Sin consumo termina; el consumo mínimo puede agregarse igual. Umbral y factor dejan de estar fijos en el código. | RN-01 §8 | Replicar + Mejorar (parametrizar constantes) | PRM-TAR-070, PRM-TAR-071 | — |

### 6.10 Servicios con adherentes (RN-01 §9)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-078 | Adherentes que cuentan: sin baja, excluyendo según el servicio menores (nacidos en el último año a fin del mes siguiente), jubilados (ocupación de tipo 2) y personas con discapacidad. | RN-01 §9 (`MENORES`, `JUBILAD`, `DISCAPA`) | Replicar | — | — |
| RN-TAR-079 | Tipos 9 y 10: categoría automática = fila cuya cantidad de adherentes coincide; la categoría resultante se **propone** al contrato (efecto diferido); renglón precio × (por unidad ? 1 : cantidad); sin fila → `TAR-E-ADH-CATEGORY` ("No se encontró una Categoría para N Adherentes"). | RN-01 §9 | Replicar + Mejorar (efecto diferido) | — | — |
| RN-TAR-080 | Tipos 10 a 13: además, cada adherente según tarifas de adherentes filtradas por servicio, vínculo, ocupación, categoría (0 = cualquiera) y edad entre desde/hasta (edad al último día del período); 11 = la tarifa asignada al adherente; 12 = todas las que apliquen; 10 y 13 = la más específica (más filtros informados); franquicia N = los primeros N adherentes de esa tarifa no se cobran. | RN-01 §9 (`TAR_ADHE`, `ADHSOC.COD_TAD`, `COBRAEXCEDENTE`) | Replicar | — | — |
| RN-TAR-081 | Otros tipos: renglón base precio × (por unidad ? 1 : cantidad). Recategorización automática por edad del titular (adherente de vínculo tipo 1) con la fila de tarifa de adherentes de precio 0 y categoría informada (propuesta diferida). El cargo fijo se cobra con la categoría final. | RN-01 §9 (`CAT_AUTO`) | Replicar | — | — |

### 6.11 Telefonía: tasación y facturación de llamadas (RN-01 §10; RN-07 §8)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-082 | Facturación telefónica (tipo 5): un renglón de servicio con la suma de netos de las llamadas tasadas del período, excluida la clave 100; sin llamadas y con PRM-TAR-080 activo, renglón en 0. | RN-01 §10 (V2 #2514) | Replicar | PRM-TAR-080 | — |
| RN-TAR-083 | Llamadas CPP (clave 100) van al concepto PRM-TAR-081 (subtipo 14); internacionales no facturadas a la fecha van al concepto PRM-TAR-082 (subtipo 2). M04 es el **único dueño** de los conceptos CPP e internacional (HUE-TEL-03): PRM-CAT-091 y PRM-CAT-092 de M02 quedan de **solo lectura** como alias que resuelven al valor de PRM-TAR-081 y PRM-TAR-082; no se editan en M02. | RN-01 §10 (V2 #19, #24) | Replicar | PRM-TAR-081, PRM-TAR-082 | — |
| RN-TAR-084 | Tasación por llamada: origen = línea vigente a la fecha de la llamada (cuenta, servicio, plan); destino = prefijo más largo del plan de numeración (M10) → clave, operador, móvil; tipo de llamada; tramos por bandas horarias (día 1–7, feriado ⇒ bandas de domingo, cruce de medianoche); tipo de banda por plan+banda[+tipo] con fallback sin tipo; importe por tramo con fracciones; prepago; internacional; gratuita; central virtual; descuentos y mínimo; si el CDR trae importe > 0, prevalece. | RN-07 §8.4 `Tasacion_LLAMADAS` | Replicar | PRM-TAR-083 a PRM-TAR-089 | — |
| RN-TAR-085 | Orden de tipo de llamada: (1) destino móvil ⇒ CPP; (2) clave 0 y prefijo local ⇒ Local; (3) clave 0 y prefijo no local ⇒ Urbana; (4) clave 1 y prefijo local ⇒ Urbana; (5) clave 88 o > 100 ⇒ Internacional; (6) clave 99 ⇒ Gratuita; (7) otro ⇒ Interurbana. Tipos: Local 0, Urbana 1, Interurbana 2, Internacional 3, Por operadora 4, Gratuita 5, Especial 6 (central virtual), CPP 7; prepago = tipo + 10. | RN-07 §8.2, §8.10 | Replicar | — | — |
| RN-TAR-086 | Clave tarifaria: si el CDR trae clave ≠ 0 se respeta; la del prefijo solo cuando falta, salvo internacionales con PRM-TAR-084 activo (siempre la del prefijo); sin prefijo ⇒ observación "Clave de llamada no encontrada" y no se tasa; se graban operador, marca CPP y prefijo propio si el destino tiene indicativo. | RN-07 §8.10 (V2 #62) | Replicar | PRM-TAR-084 | — |
| RN-TAR-087 | Bandas: sin línea atribuida se usa el plan tarifario por defecto (PRM-TAR-085, legacy plan 1); sin asignación de banda para plan+banda ⇒ error "No existe asignacion de banda Horaria"; tramos del mismo tipo de banda se suman; si toda la llamada cae en un solo tipo se guarda. La grilla de bandas exige los mismos cortes horarios todos los días (7 filas por franja); habilitar un plan o tipo crea una asignación por banda existente con tipo de banda 1. | RN-07 §8.10 | Replicar | PRM-TAR-085 | — |
| RN-TAR-088 | Fracciones: por cada tramo, tarifa por (tipo de banda, clave, [tipo]) con fracción (segundos) e importe; con varias filas se aplican escalonadas por número (1ª fracción, siguientes…); fracciones = ceil(segundos/fracción), mínimo 1; se guardan las fracciones de la llamada. La siguiente fracción escalonada se numera máximo + 1 por clave y tipo de banda. | RN-07 §8.4, §8.10 (`TARCLA`, `TEL_FRACCIONES`) | Replicar | — | — |
| RN-TAR-089 | Prepago: si PRM-TAR-086 y el servicio es el de prepago (PRM-TAR-087) con categoría prepaga vigente a la fecha de la llamada (historia del contrato), tipo += 10. | RN-07 §8.4 (V2 #236, #332) | Replicar | PRM-TAR-086, PRM-TAR-087 | — |
| RN-TAR-090 | Internacionales (clave 88 o > 100) con PRM-TAR-084: se registran como internacionales valorizadas con la cotización de la moneda de la central (importes de claves internacionales × cotización) y el neto de la llamada queda en 0; la cotización se actualiza por T04. | RN-07 §8.4, §8.6, §8.10 | Replicar | PRM-TAR-084 | — |
| RN-TAR-091 | Destino en la lista de gratuitos ⇒ gratuita, importe 0; origen y destino de la misma central virtual (servicio PRM-TAR-088) ⇒ tipo 6, importe 0. | RN-07 §8.4 (`GRATIS`, V2 #82) | Replicar | PRM-TAR-088 | — |
| RN-TAR-092 | Planes de descuento: filtros por plan, categoría, solo locales, rango de claves, día de semana, franja horaria, rango de duración, cuenta, prefijo; tipos: descontar importe fijo, descontar %, cobrar solo los primeros N segundos, cobrar importe fijo, cobrar 50 % después de N segundos; tope máximo. | RN-07 §8.4 (`PLANDES`) | Replicar | — | — |
| RN-TAR-093 | Consumo mínimo por llamada (PRM-TAR-089); con PRM-TAR-090 no se aplica a claves 0/1. | RN-07 §8.4 (V2 #64, #471) | Replicar | PRM-TAR-089, PRM-TAR-090 | — |
| RN-TAR-094 | Si el CDR trae importe (> 0), prevalece; con PRM-TAR-091 las llamadas de Telco IP con clave 99 se importan con importe 0. | RN-07 §8.4, §8.10 (V2 #2346) | Replicar | PRM-TAR-091 | — |
| RN-TAR-095 | Simulador de tasación de una llamada suelta (plan y clave opcionales) con la misma secuencia que la masiva; usa la línea **vigente a la fecha simulada** (ProCoop usa la línea abierta actual). | RN-07 §8.10 `Tasacion_LLAMADA` | Mejorar | — | — |
| RN-TAR-096 | Retasación: solo de llamadas no agrupadas/facturadas; recalcula la clave desde el plan de numeración y tasa con la moneda indicada; conserva el identificador de la llamada y guarda la tasación anterior como versión (ProCoop borra y reinserta con nuevo id, en lotes de 500, truncando destino a 20 caracteres). | RN-07 §8.10 `ReTasacion_LLAMADAS`, `Save_LLAMADAS` | Mejorar (CTR-TAR-24) | — | — |
| RN-TAR-097 | Función `phoneNetWithCap(topeSegundos, claves…)`: si los segundos totales superan el tope, recalcula el neto en orden cronológico hasta completar el tope y prorratea la última llamada; el tope se trunca a entero. `phoneNetByKey(clave)` y `phoneNetByCallType(tipo)` (0 local, 1 urbana, 2 interurbana, 3 internacional, 4 operadora, 5 gratuita, 6 especial, 7 CPP). | RN-01 §12.7 (`TotalNetoConsumo*`) | Replicar | — | — |
| RN-TAR-098 | CPP/CVLP: la liquidación a la operadora (agrupación por condición de IVA y alícuotas del concepto CPP, comisiones hasta 3, factura o ND de comisión, modo "según cobranzas") es un comprobante de M05/M06; TAR solo provee los importes tasados. | RN-07 §8.5 | Delegar (M05/M06) | — | — |
| RN-TAR-099 | Telefonía móvil (reventa): los conceptos del proveedor importados (larga distancia, SMS, varios, minutos de abono/excedentes, servicios varios, descontar SMS contratados, extras; abono proporcional, reintegro, cargo administrativo, servicio extra proporcional) con clearing entre líneas del mismo socio llegan como cargos precargados del período (RN-TAR-007); el pack SMS es el servicio PRM-TAR-092. | RN-07 §8.8 (`SERTEL`, `PRCAGAS`, V2 #2253) | Replicar (importación en M10) | PRM-TAR-092 | — |
| RN-TAR-100 | La línea del abonado tiene plan tarifario; desvincular el número crea una línea sin número que conserva el plan ("Desvinculación sin OT"); un número no puede estar en uso por otro servicio en la misma fecha (validación de M10 por **fecha**, no "cualquier línea abierta"). | RN-07 §8.1, §8.10 | Replicar (M10) + Mejorar | — | — |

### 6.12 Grandes consumos: energía por banda, demanda y factor de potencia (RN-01 §11; RN-06 §17)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-101 | Tipos de energía: `A` o vacío activa, `R` reactiva, `DP` demanda en punta, `DFP` demanda fuera de punta, `DV` demanda en valle; el concepto distingue bandas horarias y franjas. kWh y kW nunca se mezclan en un renglón. | RN-01 §11; BASE §87 | Replicar | — | — |
| RN-TAR-102 | Energía activa: por cada concepto presente en los consumos activos se tarifa el consumo del concepto con las filas del mismo tipo y concepto según `largeCustomerEnergyMode`: 0 precio por cantidad (un renglón al precio del escalón que contiene el consumo); 1 tramas según la activa del concepto; 2 tramas según potencia (factor de tramo = máx(demanda en punta medida, contratada en punta); anchos en kWh por kW); 3 tramas según el total consumido de todos los conceptos; 4 tramas según medidor testigo. | RN-01 §11.1 (`TRAMA_DEC` reutilizado) | Replicar + Mejorar (campo separado) | — | — |
| RN-TAR-103 | Subtipos legacy de renglón: 2 servicio grandes consumos, 6 demanda en punta, 7 demanda fuera de punta, 3 demanda adquirida, 4 demanda corregida, 8 exceso; en CoopApps se usa `kind` explícito (`energy`, `demand_peak`, `demand_offpeak`, `demand_valley`, `demand_acquired`, `demand_corrected`, `demand_excess`, `power_factor`). | RN-01 §11.1, duda 8 | Mejorar | — | — |
| RN-TAR-104 | Demanda contratada: (1) demanda por período del contrato para el mes y tipo de medición si el contrato lo indica; (2) si no, contratada general del contrato; (3) si no, contratada del medidor por tipo de energía; si no hay, 0. El período se guarda como fecha (`YYYY-MM`), no como número de mes. | RN-01 §11.2, §23.1, duda 5 (`SERSOC_DEMANDASXPERIODO`, `DEC_CON`, `MEDSOC.CONTRATADO`) | Replicar + Mejorar | — | [VERIFICAR] formato grabado en LAG |
| RN-TAR-105 | Modalidades de demanda (`demandMode`; "máx" = demanda máxima registrada del período; precio base `demandPrice` con concepto, precio de exceso o segunda demanda `excessDemandPrice` con concepto): 0 utilizada (máx DP y máx DFP con filas de demanda); 2 mayor entre utilizada y contratada por DP y DFP; 3 corregida: máx(DP, DFP, DV) hasta contratada general a precio base, excedente a precio de exceso; 4 adquirida = media(máx DP, máx DFP); 5 adquirida = máx DP; 6 adquirida = máx DFP; 7 contratada (base) = máx(máx DP, máx DFP, máx DV, contratada general) y punta (exceso) = máx(máx DP, contratada DP); 8 máx(máx DP, media DP y DFP) al precio DP; si contratada DP mayor, diferencia como exceso; 9 contratada DFP a base + máx DFP tarifado; si máx DFP > contratada, diferencia a exceso; 10 utilizada y excedentes: tarifa máx DP y DFP y cobra la contratada no usada (contratada − máx, mín 0) como corregida; 11 como 3 pero sin exceso siempre cobra la contratada; 12 fuera de punta = máx(máx DFP, máx DV, contratada DFP/2), punta = máx(máx DP, contratada DP/2); 13 contratadas: DP a base y DFP a exceso; 14 y 15 punta = máx(máx DP, contratada DP), fuera de punta = máx de DFP, DV y sus contratadas (en 14 los conceptos salen de las filas DP y DFP/DV y deben existir); 16 según tramas: cada fila DP/DFP/DV se tarifa por tramas con su concepto; 17 como 7 pero la punta solo toma la medida si supera la contratada en más de `demandUpdatePercent` %, y la adquirida cae a la contratada general si no la supera en ese porcentaje. Cada modalidad es una **estrategia** registrada. Errores: `TAR-E-DEMAND-CONCEPT` ("No hay un concepto configurado para la tarifa de Demanda…"), `TAR-E-DEMAND-PEAK-RATE` ("No hay tarifa de Demanda en punta en la categoría X"). | RN-01 §11.2 (`GC_FACDEM`) | Replicar (estrategias) | — | — |
| RN-TAR-106 | Prorrateo de demandas (PRM-TAR-093): cada demanda se divide por versión con sus precios base y exceso; método 1 prorratea cantidad, método 3 precio. | RN-01 §11.2 (V2 #2928) | Replicar | PRM-TAR-093 | — |
| RN-TAR-107 | Con método 2 en demandas prorrateadas ProCoop factura la demanda completa en cada versión (duplicaría). En CoopApps el método 2 en demanda se trata como método 1 (cantidad × fracción) y se advierte al configurar. | RN-01 duda 3 | Mejorar | — | A validar (PA-TAR-03) |
| RN-TAR-108 | En modalidades 3, 11 y 13 con 3 versiones, el exceso de la tercera usa su propio precio (ProCoop usa el de la segunda). | RN-01 duda 4 | Mejorar (corregir) | — | A validar (PA-TAR-03) |
| RN-TAR-109 | Actualización de la contratada (si la categoría lo indica): si la máxima del período supera contratada × (1 + porcentaje/100), se **propone** nueva contratada = máxima, con fecha y, la primera vez, fecha y valor originales y primera transgresión; con actualización por unidad, también la contratada del medidor DP y DFP. Se confirma al emitir (M02/M03 aplican). | RN-01 §11.2, §23.1 (`ACT_DEM`, `ACT_DEM_UNI`, `PORC_ACTDEM`) | Mejorar (efecto diferido) | PRM-TAR-094 | A validar (PA-TAR-13) |
| RN-TAR-110 | Transgresiones: % de transgresión = demanda × 100 / contratada − 100; se registra primera transgresión, demanda declarada actual y fecha; un proceso puede restablecer la declarada a la base contratada. Las categorías con demanda facturan la contratada o la registrada, la mayor según la tarifa. | RN-06 §17 (`clsTransgresiones`, `CON_BASE`) | Replicar (reporte y propuesta) | — | — |
| RN-TAR-111 | Factor de potencia: tgφ = reactiva total / activa total (activa con o sin inyectada según PRM-TAR-062); base = Σ neto de renglones de energía y demanda con cantidad ≥ 0 (o solo energía si `powerFactorBase = 1`; el conjunto depende de la modalidad de demanda) + cargo fijo si `powerFactorIncludesFixed`. No se calcula sin consumos reactivos o con activa 0. | RN-01 §11.3 | Replicar | PRM-TAR-062 | — |
| RN-TAR-112 | Métodos: 1 coseno: cosφ = cos(atan(tgφ)) con piso PRM-TAR-095; si cosφ < tope, recargo = base × tope/cosφ − base; si cosφ > tope y no "no bonificar", bonificación = −(base − base × tope/cosφ). 2 tangente: si tgφ > tope, recargo = red2(tgφ − tope) × K × base, K = PRM-TAR-096 (1,5 si 0). 3 tangente por franja: por franja, tg = red2(R/A); si supera tope, (tg − tope) × 1,5 × neto activa de la franja; concepto el de la fila reactiva o el de recargo de la categoría. 4 tangente con VAD: si tgφ > tope, (base + VAD) × 1,5 × ⌊20 × (tgφ − tope)⌋ / 100. 5 coseno 2: si cosφ < tope, base × (tope − cosφ) × K, K = PRM-TAR-097. La constante 1,5 de los métodos 3 y 4 pasa a parámetro con default 1,5. | RN-01 §11.3 (V2 #2659, #2375, #2407) | Replicar + Mejorar (constantes) | PRM-TAR-095, PRM-TAR-096, PRM-TAR-097, PRM-TAR-098 | — |
| RN-TAR-113 | El renglón de factor de potencia (`kind=power_factor`) guarda método, tope, "no bonificar" y coseno calculado; si no hubo recargo, esos datos se adjuntan al primer renglón de energía. Defaults al crear categoría: concepto de recargo PRM-TAR-099, de bonificación PRM-TAR-100, tope PRM-TAR-101, "no bonificar" PRM-TAR-102. La función `powerFactorCos()` expone el coseno. | RN-01 §11.3 (V2 #2091, #2092, #2093, #243) | Replicar | PRM-TAR-099 a PRM-TAR-102 | — |
| RN-TAR-114 | La base del factor de potencia selecciona renglones por `kind` (energía/demanda) y no por número de subtipo (en ProCoop los subtipos de servicio y producto se solapan: 3 demanda adquirida/capital, 4 demanda corregida/percepciones, 8 exceso/anticipo). | RN-01 duda 8 | Mejorar (corregir) | — | — |
| RN-TAR-115 | VAD: suma de reglas cuyo concepto es de tipo de producto 20 (valor agregado de distribución), evaluadas por fórmula en el contexto del servicio; error → `TAR-E-VAD` ("Error al Calcular el VAD"). | RN-01 §11.3 `GetTotalVAD` | Replicar | — | — |

### 6.13 Reglas (cargos adicionales) y fórmulas (RN-01 §12)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-116 | Una regla tiene: vigencia desde/hasta (fuera de ella vale 0), orden, servicio, tipos de comprobante (vacío = todos), fase (servicio/comprobante), tipo de acción (cargo, recargo, impuesto, recargo proporcional), signo (suma/resta), concepto o tributo resultante, subtipo de cargo (adicional, registrar como cargo fijo, parte de la tarifa), afectación (renglones de un concepto o de un servicio), comprobante aparte (grupo o grupo cero), una vez por cuenta en el lote, y fórmulas de filtro, importe unitario, cantidad y base imponible. Se agregan los elementos de BASE §51 (RN-TAR-201). | RN-01 §12.1 (`CARGOS_ADICIONALES`) | Replicar + Adoptar BASE §51 | — | — |
| RN-TAR-117 | Por regla y en orden se calculan: `unit` = si (servicio coincide y filtro) entonces importe, si no 0; `qty` = fórmula de cantidad; `value` = unit × qty; `taxBase` = fórmula de base; `previousTotal` = suma de `unit` de las reglas anteriores. Cada fórmula puede referenciar resultados de reglas previas: `rule('codigo').unit`, `.qty`, `.value`, `.taxBase`, `previousTotal('codigo')`. | RN-01 §12.2 (`Valor_CargoUnitario.<n>`, `Cantidad_Cargo`, `Valor_Cargo`, `BaseImp_Cargo`, `TotalAnterior`) | Replicar (referencia por código) | — | — |
| RN-TAR-118 | Cargo (0): renglón de producto con cantidad y precio; `kind=rule_charge` (subtipo 15), o `fixed_charge` (10) si se registra como cargo fijo, o `tariff_component` (16) si es parte de la tarifa; lleva base imponible y categoría. | RN-01 §12.3 | Replicar | — | — |
| RN-TAR-119 | Recargo (1): no crea renglón propio en ProCoop: multiplica el precio sin IVA de los afectados por (1 + valor / neto afectado); con valor negativo es descuento. En CoopApps se registra además un renglón de **ajuste explicativo** de importe 0 con la regla, o, por configuración de la regla (`surchargeMode`), un renglón propio del concepto por la diferencia. | RN-01 §12.3 | Replicar + Mejorar (traza) | — | — |
| RN-TAR-120 | Impuesto (2): renglón de tipo impuesto con el importe en "otros impuestos" y su base imponible; sin IVA; usa solo el unitario como importe (ignora cantidad). Debe referenciar un tributo aprobado de M06. | RN-01 §12.3, §12.6; BASE §52.2 | Replicar + Mejorar | — | — |
| RN-TAR-121 | Recargo proporcional en renglones (3, solo fase comprobante): base = Σ(neto con IVA + IIBB + otros impuestos) de renglones que no son "otros" ni cuota; objetivo = red2(base + valor); factor = 1 + valor/base aplicado a productos de tipo impuesto (tipos 8–10) y renglones de impuesto de subtipo 0; bonificación de IIBB redondeada a 4 decimales; la diferencia del resto se acumula por alícuota y genera un renglón por alícuota (alícuota 0 redondeada a los decimales del comprobante); ajuste de centavos si \|total − objetivo\| ∈ [0,004; 0,02] y hay decimales de redondeo: se corrige un renglón del concepto con IVA 0 y se marca "ajustado" o "no fue posible". | RN-01 §12.3, §12.6 | Replicar | — | — |
| RN-TAR-122 | Reglas con comprobante aparte (grupo o grupo cero) acumulan sus renglones para un comprobante separado que M05 arma. No se permite marcar "grupo 0" y un grupo a la vez. | RN-01 §12.3, §12.8 | Replicar | — | — |
| RN-TAR-123 | Contexto de fase servicio disponible en fórmulas (sección 9.4.4): cuenta y socio, categoría, servicio, lecturas, comprobante, prorrateo, coseno. `Categoria_ConsumoMinimo` devuelve en ProCoop el **precio** por unidad faltante; en CoopApps hay dos variables: `ctx.category.minimumPrice` y `ctx.category.minimumUnits` (el alias legacy mapea al precio). | RN-01 §12.4, §12.9 | Replicar + Mejorar | — | — |
| RN-TAR-124 | ProCoop evalúa fórmulas como columnas calculadas de una grilla DevExpress invisible con funciones registradas globalmente (no permite fases en paralelo). CoopApps usa el intérprete GFL (sección 9.4): parser propio a AST, lista blanca de nodos y funciones, sin `eval`/`Function`/`vm`, aritmética `decimal.js`, límites de profundidad, nodos y tiempo, aislado por ejecución (permite paralelismo). | RN-01 §12.5 | Reemplazar (CTR-TAR-06) | PRM-TAR-110 a PRM-TAR-112 | — |
| RN-TAR-125 | Las reglas se referencian por **código estable** (slug sin espacios ni caracteres especiales), no por nombre; el nombre es libre. Se elimina la restricción de caracteres `[ ] { } + * ^ > < = ! & ; : # \| " \` en el nombre (se mantiene para el código: `^[a-z][a-z0-9_]{1,60}$`). | RN-01 §12.5 (`DES_CAR` como identificador) | Mejorar | — | — |
| RN-TAR-126 | ProCoop aborta todo el lote si alguna celda de fórmula da `#Err` ("Se ha producido una inconsistencia al generar la Factura de la cuenta X. Error en …"). CoopApps excluye la cuenta con `TAR-E-FORMULA` (regla, campo, mensaje, valores) y el lote continúa; si los errores superan PRM-TAR-113 % el lote se detiene para revisión. | RN-01 §12.5, §19 | Mejorar | PRM-TAR-113 | A validar (PA-TAR-18) |
| RN-TAR-127 | Selección de reglas para un cálculo: de la versión aplicable (o de la forzada), orden menor que el pedido (en lote: todas; en el editor: solo las anteriores a la que se edita), fase igual, tipo de comprobante igual o vacío, en fase servicio servicio entre los liquidados, opcionalmente solo conceptos de un tipo (VAD). Orden de armado: por servicio y luego por orden. | RN-01 §12.5 | Replicar | — | — |
| RN-TAR-128 | `previousTotal` suma los unitarios de **todas** las reglas armadas antes, aunque sean de otro servicio (compatibilidad); CoopApps agrega `previousTotalSameService()`. | RN-01 §12.5 | Replicar + Mejorar | — | — |
| RN-TAR-129 | Importe unitario armado: `if(ctx.service.code == regla.servicio && filtro, importe, 0)`; fuera de vigencia la regla no se evalúa (0). `taxBase` existe solo con fórmula de base; `qty` y `value` solo con fórmula de cantidad (si no, qty = 1). | RN-01 §12.5 | Replicar | — | — |
| RN-TAR-130 | Una regla de fase comprobante **no** puede tener servicio cargado (en ProCoop daría `#Err` porque la fila de comprobante no tiene código de servicio); se valida al guardar; para filtrar por servicio en fase comprobante se usa `invoiceHasService(código)`. | RN-01 §12.5 | Mejorar | — | [VERIFICAR] cargos finales con servicio en LAG |
| RN-TAR-131 | Vigencia de reglas: control **único** contra la fecha de referencia tarifaria del período liquidado (PRM-TAR-010), no contra la fecha del sistema (ProCoop exige `DESDE ≤ fechaVigencia ≤ HASTA` y además superposición con el mes calendario de hoy). | RN-01 §12.5, duda 24 | Mejorar (CTR-TAR-03) | PRM-TAR-010 | A validar (PA-TAR-04) |
| RN-TAR-132 | Una regla sin vigencia explícita rige desde la vigencia de su versión hasta su cierre (ProCoop asigna 1900-01-01 a 2200-01-01; con vigencia marcada propone el mes actual). | RN-01 §12.5 `abm_CargosAdicionales` | Mejorar | — | — |
| RN-TAR-133 | Momento de evaluación (compatibilidad ProCoop): todas las variables de las reglas de un servicio se evalúan con la foto del servicio **antes** de aplicar sus reglas; un recargo de orden 1 no cambia la base que ve la regla de orden 2 salvo referencia explícita o `previousTotal`. Las funciones de alcance cuenta ven las reglas ya aplicadas a servicios anteriores de la cuenta (orden determinista configurado). Opción por regla `baseMode = cascade` para evaluar sobre la base acumulada. | RN-01 §12.5 | Replicar + Mejorar | — | A validar (PA-TAR-01) |
| RN-TAR-134 | Si una regla usa simulación con otra versión, el editor sugiere ubicarla al final del orden. | RN-01 §12.5 | Replicar | — | — |
| RN-TAR-135 | Importe del renglón = unitario; cantidad = `qty` (1 sin fórmula); base imponible = `taxBase` (0 sin fórmula); unitario 0 ⇒ no se genera renglón; signo "resta" cambia el signo del unitario. | RN-01 §12.6 | Replicar | — | — |
| RN-TAR-136 | Cantidad 0 con unitario ≠ 0: ProCoop crea el renglón con cantidad 0 (que luego la validación del comprobante rechaza). CoopApps no crea el renglón y registra advertencia `TAR-W-RULE-QTY-ZERO`. | RN-01 §12.6, §19 | Mejorar | — | — |
| RN-TAR-137 | Renglón de regla en fase servicio lleva contrato, categoría y servicio; en fase comprobante no lleva servicio ni categoría. | RN-01 §12.6 | Replicar | — | — |
| RN-TAR-138 | Recargo con afectación por concepto: afecta renglones de producto del concepto; en fase servicio, si no hay, cualquier renglón con ese concepto (ej. renglones de servicio cuyo concepto es ese); en fase comprobante sin respaldo. Con afectación por servicio: renglones de servicio del servicio afectado (o del de la regla). | RN-01 §12.6 | Replicar | — | — |
| RN-TAR-139 | Recargo proporcional (tipo 3) solo es válido en fase comprobante; en fase servicio no se puede guardar (ProCoop lo ignora sin error). | RN-01 §12.6 | Mejorar | — | — |
| RN-TAR-140 | "Una vez por cuenta en el lote": si ya se aplicó a la cuenta, se **saltea solo esa regla** (ProCoop corta el recorrido y omite también las reglas posteriores). Se controla en ambas fases. | RN-01 §12.6, duda 17 | Mejorar (CTR-TAR-10) | — | — |
| RN-TAR-141 | Un servicio sin contexto de fórmula genera `TAR-E-FORMULA-CONTEXT` ("Se ha producido una inconsistencia al obtener la cuenta…"). | RN-01 §12.6 | Replicar | — | — |
| RN-TAR-142 | Alcance de funciones por fase: ambas fases (sumas, mín/máx, deuda, campos de entidades, facturado, fechas, cotización, simulación con versión, servicio activo, constantes del lote secuencia y rango de consumo); solo servicio (netos telefónicos, consumos por servicio, búsqueda de consumos, días de consumo, cantidad de servicios, adherentes, datos de renglones, prorrateos, proporcional, parámetro entero); solo comprobante (total de comprobante anterior, consumos por cuenta, categoría del servicio en el comprobante). Usar una función fuera de su fase es error de validación al guardar. | RN-01 §12.7 | Replicar + Mejorar | — | — |
| RN-TAR-143 | Las funciones de GFL **no** reciben como primer argumento el id de la fila en proceso (ProCoop: `Id_Sersoc`, `Cod_Sum` o `Index`): el contexto es implícito; existen variantes `…Account` para alcance cuenta. Los argumentos variables finales son listas de códigos. Las funciones de campo devuelven el tipo del campo (no texto). | RN-01 §12.7 | Mejorar | — | — |
| RN-TAR-144 | El catálogo de funciones (9.4.5) replica la semántica de las 30 clases de ProCoop con estas correcciones: `consumptionLoad` acepta a la vez estado y operación (duda 18); `consumptionDays` devuelve los días reales (no 60 fijo; duda 19); `contractField…Account` usa la fase correcta (duda 20); `adherentCount` filtra por contrato (duda 21); `billedAmount…`/`billedQty…` excluyen comprobantes anulados (duda 22); tipos de operandos y resultados coherentes (duda 23); `consumptionProportional` en baja devuelve fracción (duda 7). El traductor de migración marca las fórmulas cuyo resultado cambia por estas correcciones. | RN-01 §12.7, dudas 7, 18–23 | Mejorar | — | A validar (PA-TAR-03) |
| RN-TAR-145 | Procedimientos almacenados `FORMULA_CARGO_<TIPO>_<Nombre>` / `FORMULA_CARGOFINAL_<TIPO>_<Nombre>` (tipos INT, STR, DAT, DEC, BIT; resultado = primera columna de la primera fila) no se replican: cada uno se inventaría y se reemplaza por (a) función a medida GFL, (b) dato precargado (propiedad del contrato o tabla de valores versionada) o (c) función nativa nueva del catálogo de plataforma. | RN-01 §12.7, duda 14 | Reemplazar | — | [VERIFICAR] inventario en LAG; A validar (PA-TAR-11) |
| RN-TAR-146 | Nombre único de regla (comparación sin espacios y en mayúsculas, excluida la propia) dentro de la versión; código único dentro del tenant y estable entre versiones. | RN-01 §12.8 `ExisteNombre` | Replicar | — | — |
| RN-TAR-147 | No se puede publicar una regla cuyas fórmulas referencian una regla inexistente o no vigente en la misma versión (ProCoop: referencias a cargos con `HASTA` anterior a hoy). | RN-01 §12.8 | Replicar + Mejorar | — | — |
| RN-TAR-148 | Validaciones al guardar: concepto o tributo a imputar/afectar obligatorio; servicio obligatorio cuando aplica; no "grupo 0" y grupo a la vez; tipo 3 solo en fase comprobante; regla de comprobante sin servicio; fórmulas válidas en tipos y fase; origen del beneficio si reduce importe. | RN-01 §12.8 | Replicar + Mejorar | — | — |
| RN-TAR-149 | Orden: regla nueva recibe máximo + 1 **dentro de su fase y servicio**; subir/bajar intercambia con el vecino de la misma fase y servicio (ProCoop busca el vecino entre todos los cargos). | RN-01 §12.8 `ActualizarOrden` | Mejorar | — | — |
| RN-TAR-150 | Clonar regla: nuevo código (sugerido `codigo_copia`), nombre + " - (copia)", orden máximo + 1. | RN-01 §12.8 `Clonar_Cargo` | Replicar | — | — |
| RN-TAR-151 | Renombrar una regla no rompe fórmulas (referencias por código). Cambiar el **código** de una regla en borrador actualiza las referencias de todas las reglas del borrador (incluido `previousTotal`); nunca afecta versiones publicadas. (ProCoop reemplaza el prefijo `Totales_Anteriores` en lugar de `TotalAnterior` y deja rotas las referencias; tampoco actualiza históricos.) | RN-01 §12.8, duda 16 | Mejorar | — | — |
| RN-TAR-152 | Búsqueda de regla por referencia: código, nombre exacto, nombre que contiene, nombre sin distinguir mayúsculas. | RN-01 §12.8 `ObtenerCargoPorReferencia` | Replicar | — | — |
| RN-TAR-153 | Las reglas de una versión publicada no se editan (ProCoop permite editar `HIS_CARGOS_ADICIONALES`, lo que altera simulaciones y prorrateos con ese cuadro). | RN-01 §12.8 | Reemplazar (CTR-TAR-02) | — | — |
| RN-TAR-154 | Datos de prueba del editor: contexto real de los contratos elegidos liquidando el período actual con consumos de los últimos 5 meses sin persistir; para fase comprobante, simulación del comprobante; para prepaga, tipo de comprobante PRM-TAR-031. Casos de prueba guardados con la regla y ejecutados en cada publicación. | RN-01 §12.8 (V2 #2243); INV abm_CargosAdicionales AgregarCasoDePrueba | Replicar + Mejorar | PRM-TAR-031 | — |
| RN-TAR-155 | Tablas de ayuda del editor para elegir códigos: servicios, categorías del servicio, ocupaciones, productos sin stock, localidades, referencias, actividades ARCA, clases de servicio, situaciones de IVA, propiedades de servicio. | RN-01 §12.8 `GetTablasFormula` | Replicar | — | — |
| RN-TAR-252 | Preferencia declarativa (DEC-105): (1) una regla "usa fórmula" si `action.operation = formula` o si tiene cargada cualquiera de `conditions.conditionFormula`, `action.quantityFormula`, `action.unitFormula`, `action.valueFormula` o `action.taxBaseFormula` (la marca se deriva al guardar en `formulaJustification.usesFormula`, no se edita); (2) toda regla que usa fórmula exige `formulaJustification` con el tipo (`declarative_insufficient` cuando la escribe un usuario; `migrated_pending_review` cuando la crea la migración, RF-TAR-102), el texto de por qué no alcanza una regla declarativa de RF-TAR-067 (obligatorio para `declarative_insufficient`; para `migrated_pending_review` el texto es fijo, `dict:tar.formulaJustification.migratedPendingReview` = "traducida de ProCoop, pendiente de revisar"), autor y fecha; sin justificación la regla se guarda en borrador, pero ni ella ni la versión que la incluye pueden enviarse a aprobación (`TAR-E-FORMULA-UNJUSTIFIED`); (3) la justificación se muestra junto a cada regla con fórmula en la pestaña "Reglas incluidas" de PAN-TAR-02, en el envío y en la aprobación del cuadro (RF-TAR-005), y el aprobador ve el total de reglas con fórmula de la versión y cuántas siguen `migrated_pending_review`; (4) una regla `migrated_pending_review` puede publicarse (no frena la migración) y deja de estarlo cuando un usuario con `tar.formulas.editar` la reemplaza por una regla declarativa o carga una justificación propia (`declarative_insufficient`), lo que se audita; (5) cambiar la fórmula de una regla en borrador no borra la justificación, pero la marca para revisar antes del envío; (6) las fórmulas siguen permitidas: la política no prohíbe ninguna regla, solo exige el porqué (se mantiene el rechazo 4 del documento externo, CTR-TAR-43). | `NucleoTransversal-Modelo` cap. 5.6 (rechazo 4); DEC-105 | Adoptar (DEC-105) | — | — |

### 6.14 Franqueo, anticipos, redondeo y medidor testigo (RN-01 §13–§16)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-156 | Franqueo: se cobra el concepto y el importe del servicio de entrega postal de la cuenta (subtipo 17) cuando: la cuenta tiene servicio de entrega y no está exenta de cobrarlo; concepto e importe ≠ 0; no se cobró en el mismo período y secuencia (se confirma al emitir); el tipo de comprobante no excluye franqueo; con PRM-TAR-120, la cuenta no está adherida a comprobante electrónico con algún correo cargado. Si el proceso indica "no facturar envío", no se cobra. El precio del franqueo se versiona en TAR (`productPrices`). | RN-01 §13 (`POSTALES.PRO_EPO`, `IMP_EPO`, `SUMSOC.COD_EPO`, `COB_EPO`, `PER_EPO`, `SEC_EPO`, `TIPO_FAC.NOFACTURAR_FRANQUEO`, V2 #2663) | Replicar + Mejorar (efecto diferido) | PRM-TAR-120 | — |
| RN-TAR-157 | Anticipos: si el total > 0 y el proceso no indica "no aplicar anticipos", TAR pide a M07 los anticipos con saldo de la cuenta cuyo tipo de comprobante está vacío o coincide (primero los específicos); importe = mín(total, saldo); si el porcentaje de aplicación ≠ 0 y ≠ 100, se aplica ese porcentaje del total siempre que difiera en más de ARS 0,02 del mínimo; renglón negativo de tipo "otros", subtipo anticipo, con el concepto del anticipo o PRM-TAR-121; M07 registra la aplicación y descuenta el saldo **al emitir**. | RN-01 §14 (`ANTICIPOS`, `ANTIFACTU`, V2 #29, #185) | Replicar + Mejorar (efecto diferido) | PRM-TAR-121, PRM-TAR-122 | — |
| RN-TAR-158 | Anticipos de productos (tipo 1): solo con PRM-TAR-123 y solo contra renglones vinculados a los mismos presupuestos; el neto se calcula descontando el IVA de la alícuota del producto. | RN-01 §14 (V2 #3038; `PRESUPU_COMPROBANTES`) | Replicar | PRM-TAR-123 | — |
| RN-TAR-159 | Redondeo de renglones: si la política del tipo de comprobante fija decimales de renglón, cada renglón y los totales se fuerzan a esos decimales; el IVA se redondea por alícuota y los totales se recalculan. Habilitable solo con PRM-TAR-124 (advertencia de inconsistencias en reportes). | RN-01 §15 (`TIPO_FAC.REDONDEO_ITEMS`, V2 #2278) | Replicar | PRM-TAR-124 | — |
| RN-TAR-160 | Redondeo del total: después de anticipos y si el total > 0; configuración tomada del tipo de comprobante (política referenciada) o de la política global: "no redondear" (1), "usar la del tipo" (2) o "usar la global" (0: PRM-TAR-125 tipo, PRM-TAR-126 decimales, PRM-TAR-127 concepto de redondeo anterior, PRM-TAR-128 concepto de redondeo). PRM-TAR-129 desactiva el redondeo del total de comprobante. | RN-01 §15 (`TIPO_FAC.REDONDEAR`, V2 #742, #2097, #2096, #2095, #21) | Replicar | PRM-TAR-125 a PRM-TAR-129 | — |
| RN-TAR-161 | Cuentas con "excluir redondeo" no se redondean, salvo redondeo de prepaga. | RN-01 §15 (`SUMSOC_EXTRAS.EXCLUIR_REDONDEO`) | Replicar | — | — |
| RN-TAR-162 | Tipos de redondeo: 1 redondear decimales (totales de los 4 vencimientos a N decimales, sin renglón); 2 redondeo con arrastre; 3 decimales pares (si los centavos son impares, renglón de −ARS 0,01 sin arrastre). Decimales admitidos: −100, −50, −20, −10, −5 (múltiplos) y 0, 1, 2. | RN-01 §15 (`Facturacion_Tipos_De_Redondeo`, `Facturacion_Decimales_Redondeo`) | Replicar | — | — |
| RN-TAR-163 | Redondeo con arrastre (tipo 2): no aplica si la fecha del comprobante coincide con el primer vencimiento (salvo prepaga); si hay saldo de redondeo previo de la cuenta (o por tipo de comprobante si la política lo separa), renglón +saldo con concepto "redondeo anterior"; objetivo = si decimales < 0, truncar al múltiplo de \|decimales\|; si no, redondear a 2 y luego hacia abajo a N; en prepaga, el importe forzado si la diferencia ≤ PRM-TAR-130; diferencia = total − objetivo; si ≠ 0, renglón −diferencia con concepto de redondeo y se **propone** el nuevo saldo de arrastre (movimiento confirmado al emitir). El total siempre se redondea hacia abajo y el resto se cobra en el comprobante siguiente. | RN-01 §15 (`DEUDARED`, `DEUDARED_TIPO`, `COD_TPFC_REDONDEO`, V2 #2342), duda 12 | Replicar + Mejorar (movimientos) | PRM-TAR-130, PRM-TAR-131 | A validar (PA-TAR-06, PA-TAR-07) |
| RN-TAR-164 | Redondeo de prepaga: solo si el total > 0, forzando el importe calculado; al final de anticipos y redondeo se piden a M05 los vencimientos recalculados. | RN-01 §23.2 `AgregarRedondeoPrepaga`, `AgregaAnticipoyRedondeo` | Replicar | — | — |
| RN-TAR-165 | Medidor testigo: el contrato puede tener un testigo (M03); se suman sus consumos con fecha actual en (desde, hasta], mismo tipo de energía (activa = vacío) y concepto; **solo elige el tramo**, la cantidad facturada es la del medidor propio; se usa en tipo 2 con `tierBasis = witness`, grandes consumos modalidad 4, prorrateo con versión anterior y cargo fijo por tramo; sin consumos del testigo, se usa el propio. PRM-TAR-132 habilita estimar consumos de testigos (M03). | RN-01 §16 (`SERSOC_EXTRAS.COD_TES`, `MED_TESTIGO`, `CONS_SER_TESTIGO`; V2 #3192) | Replicar | PRM-TAR-132 | — |

### 6.15 IVA, percepciones, IIBB y otros tributos en el cálculo (RN-01 §17)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-166 | Alícuota por renglón resuelta por TAR en cascada y entregada a M06: servicio → IVA de la fila de tarifa, si no de la categoría, si no del servicio; IIBB de la categoría, si no del servicio. Producto → IVA e IIBB del producto (salvo indicación), más el porcentaje de percepción propio del producto. Cada renglón guarda qué nivel de la cascada se usó. | RN-01 §17.1 | Replicar + Mejorar (traza) | — | — |
| RN-TAR-167 | TAR invoca `fis.service.calculateTaxes` (antes `fis.calculateTaxes`) con renglones, situación de IVA e IIBB de la cuenta, exclusión de percepción, padrón por cuenta y fecha; M06 aplica: IVA1 = neto × tasa; IVA2 = neto × segunda tasa si > 0; percepción de IVA = (neto + IVA1) × tasa (o neto × tasa si la situación lo indica), con la del producto solo para responsables inscriptos si la alícuota no la define, nunca para cuentas excluidas, y solo si la suma ≥ mínimo de la situación; situación por defecto PRM-TAR-133; código de IVA PRM-TAR-134; situación para no categorizados PRM-TAR-135. | RN-01 §17.2 (`ALI_IVA_CF`, `SITIVA`, V2 #527, #543, #544) | Delegar (M06) | PRM-TAR-133 a PRM-TAR-135 | — |
| RN-TAR-168 | Renglones con IVA fijo (cuotas de financiación con su IVA original) conservan su IVA; M06 no lo recalcula. | RN-01 §17.2 | Replicar | — | — |
| RN-TAR-169 | IIBB (M06): aplica si la alícuota es de "rendir en facturación" y la situación no es exenta; porcentaje por (situación, alícuota); solo si la suma de netos alcanzados ≥ base mínima; variante con padrón por cuenta (régimen RN 01/2017); con cálculo sobre IVA para el comprobante. | RN-01 §17.2 (`ALI_IBR`, `ALI_IBR_CF`, `SITIBR`, `IIBB_LUA`, `ALI_IBR_COMP`) | Delegar (M06) | — | — |
| RN-TAR-170 | Otros tributos (tasas municipales, fondos provinciales) se modelan como reglas de tipo impuesto con fórmula y base imponible, normalmente condicionadas por categoría o situación de IVA, **vinculadas** a un tributo aprobado del catálogo de M06 (fundamento, jurisdicción, documento permitido). `IMPUESTOS_X_CAT` no interviene en el cálculo (solo en el informe "Impuestos facturados por categoría"). | RN-01 §17.2, duda 10; BASE §52.2 | Mejorar (CTR-TAR-04) | — | — |
| RN-TAR-171 | Total = Σ neto + IVA1 + IVA2 + percepción de IVA + otros tributos + IIBB. | RN-01 §17.2 | Replicar | — | — |

### 6.16 Bonificaciones, subsidios y tarifa social (RN-01 §18; FIC 7; BASE §51–52)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-172 | ProCoop no tiene concepto explícito de tarifa social: la resuelve con categorías específicas, bonificación de unidades, primer abono bonificado, cargos con signo "resta", columnas de subsidio leídas por fórmulas y bonificación del factor de potencia. CoopApps conserva esas piezas y agrega el **régimen de subsidio** con inscripción por suministro y regla de beneficio por componente con origen obligatorio. | RN-01 §18, duda 15; FIC 7 | Mejorar | — | A validar (PA-TAR-10) |
| RN-TAR-173 | Columnas de costo/subsidio de la fila (`costSubsidy`, `fixedChargeWithSubsidy`, `costPrice`, `costPist` (ex `COSTO_EPEC`), `costMem`, `costTne`, `uniformGasPrice`) no intervienen en el cálculo base; las leen funciones (`subsidyPrice`, `fixedChargeSubsidyPrice`, `costPriceOf`, `pistPrice`, `uniformGasPrice`, `subsidyTotal`, `costTotal`) para armar renglones de subsidio, bonificación y apertura de la tarifa (PIST/VAD). | RN-01 §18, §12.7 | Replicar | — | — |

### 6.17 Validaciones y errores (RN-01 §19)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-174 | Todos los mensajes de error del cálculo se convierten en códigos tipados con contexto (catálogo 9.11), con texto por clave de diccionario; los errores sin mensaje propio de ProCoop (tramo inexistente, fila de costo de gas faltante) reciben código. | RN-01 §19 | Mejorar | — | — |
| RN-TAR-175 | Validación del comprobante (cuenta, punto de venta, número o tipo inválidos; sin detalles; renglones con cantidad 0; total negativo) es de M05; TAR garantiza no producir renglones de cantidad 0 y marca el signo del total. | RN-01 §19 `clsComprobanteBase.Validar` | Delegar (M05) | — | — |

### 6.18 Reglas de clases auxiliares (RN-01 §23)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-176 | Consumos que entran al cálculo: fechas anterior/actual = mínima y máxima de los consumos; estados anterior/actual = primera y última lectura activa; marca "dividida" si algún consumo tiene grupo ≠ 0 y es división automática (observación "DivisiónAutomática de consumos" o generación automática); bonificación: si el consumo activo < bonificación, todo bonificado y facturable 0, si no la configurada. | RN-01 §23.1 constructor real | Replicar | — | — |
| RN-TAR-177 | La simulación con consumo numérico aplica la bonificación igual que el cálculo real (en ProCoop la simulación resta de otra forma y puede dar bonificado negativo). | RN-01 §23.1, duda 26 | Mejorar (corregir) | — | — |
| RN-TAR-178 | Totales por tipo de energía: "A" incluye consumos sin tipo; la inyectada se totaliza aparte. | RN-01 §23.1 | Replicar | — | — |
| RN-TAR-179 | Por categoría: corrección de gas recalcula consumo activo total (descontada bonificación) y consumo sin inyectada; total por (tipo, franja, concepto) con concepto −1 = todos; máximo consumo; consumos por franja (concepto con esa franja en la tarifa); primer concepto del tipo; franjas no vacías de las filas que coinciden en concepto y tipo. | RN-01 §23.1 `ConsumoPorCategoria` | Replicar | — | — |
| RN-TAR-180 | Reparto de consumos por categoría: cada consumo con la categoría registrada; los de servicio relacionado usan la categoría del contrato propio; con categoría forzada todos a ella; un consumo cuya categoría no está entre las del servicio **no se descarta en silencio**: genera `TAR-E-CAT-CONSUMPTION` (ProCoop lo descarta sin aviso). La bonificación se consume categoría por categoría. | RN-01 §23.1 | Mejorar | — | [VERIFICAR] casos en LAG |
| RN-TAR-181 | Valor de propiedad extra del contrato: se lee como decimal tipado (ProCoop normaliza el separador punto a coma en texto). | RN-01 §23.2 `GetValorPropiedadExtra` | Mejorar | — | — |
| RN-TAR-182 | Importe del renglón: neto = (precio − descuento unitario) × cantidad, redondeado a los decimales de renglón si están definidos; neto sin descuento = precio × cantidad. IIBB del renglón cuenta solo si la base de IIBB del comprobante está alcanzada; percepción de IVA solo si su base está alcanzada. | RN-01 §23.3 | Replicar | — | — |
| RN-TAR-183 | Constructores de renglón de otros orígenes (presupuesto con tasas vigentes; renglón leído de comprobante con impuesto de código IVA como IVA fijo; producto con alícuotas propias y conversión de moneda; producto "importe incluye IVA" desglosando neto; servicio por categoría con precio de categoría y cantidad 1; vivienda con cantidad = %/100; cuota de financiación con capital, interés de financiación (PRM concepto 607 si tiene componentes, si no 2089), interés anterior (311) y mora (307), IVA proporcional, signo invertido si débito/crédito difiere, percepción si situación = PRM-TAR-135): TAR aplica las reglas de producto, servicio por categoría y vivienda; los de cuotas/intereses son de M08 y llegan valorizados. | RN-01 §23.3 (V2 #607, #2089, #311, #307) | Replicar parcial + Delegar (M08) | — | — |
| RN-TAR-184 | Validación de renglón de producto (producto obligatorio, cantidad > 0, stock con parámetros 77/208/354/2068, combos sin control de componentes) es de M11/M13 para ventas; el motor tarifario no valida stock. | RN-01 §23.3 | Delegar (M11/M13) | — | [VERIFICAR] combos |
| RN-TAR-185 | Totales del comprobante: IVA por alícuota con redondeo por alícuota; "otros tributos" incluye IIBB y se redondea a los decimales del comprobante (ProCoop lo redondea a entero). | RN-01 §23.4, duda 27 | Mejorar (corregir) | — | — |
| RN-TAR-186 | Solo se recalcula el IVA de renglones nuevos; los de IVA fijo lo conservan; percepción de cuotas sale de la cuota salvo subtipos 21–23; percepción de IVA si la suma de percepciones potenciales supera el mínimo; base de IIBB alcanzada si Σ neto ≥ mayor base mínima de los renglones; con descuento automático por tasa la descripción agrega "(Sobre Productos al X%)". | RN-01 §23.4 | Delegar (M06) | — | — |
| RN-TAR-187 | Descuento porcentual: descuento unitario = precio × % / 100 − recargo/descuento automático ya aplicado. | RN-01 §23.4 `SetDescuento` | Replicar | — | — |
| RN-TAR-188 | IVA por pago parcial (agrupado por alícuota y tasa, dividido por total/importe de proporción con o sin IVA) es de M07. | RN-01 §23.4 `GetIVAVTA` | Delegar (M07) | — | — |
| RN-TAR-189 | Carga de cuotas en un comprobante (omite anuladas/facturadas/estado F; contado o detalle con renglones de la venta original; capital por alícuota; alícuota 4 por defecto sin IVA de venta; bonificación de interés al adelantar con PRM 2607/2624; diferencia de cotización con producto 2289 y grupo 2512; ajuste por inflación (capital+interés+IVA) × (índice de hace 2 meses / índice del mes anterior a la emisión − 1) con errores por índice faltante) es de M08. | RN-01 §23.4 (V2 #2607, #2624, #2289, #2512) | Delegar (M08) | — | [VERIFICAR] alícuota 4 por defecto |
| RN-TAR-190 | Acumulación de IVA por (tipo, porcentaje): desde un renglón no impuesto se generan filas de alícuota 1, alícuota 2 (si > 0) y percepción (si > 0); base de percepción = neto con IVA − percepción. La base del IVA con descuento usa siempre el neto **con** descuento para ambas alícuotas (ProCoop usa sin descuento en alícuota 1). | RN-01 §23.5, duda 28 | Delegar (M06) + Mejorar | — | [VERIFICAR] con cantidad ≠ 1 y descuento |
| RN-TAR-191 | Detalle de comprobantes de compra (recotización, detalle simple, clasificación gravado/no gravado/retención/percepción, IVA no tomado) y pendientes de pedidos de compra no pertenecen al motor tarifario. | RN-01 §23.6, §23.7 | Descartar en TAR (corresponde M12) | — | — |
| RN-TAR-192 | Evolución de conceptos entre dos períodos: variación % = 0 si ambos 0; 100 si el primero es 0; −100 si el segundo es 0; si no (nuevo − base)/base × 100; excluye o toma solo financiaciones según la clase; tipo de fecha 2 se traduce a 3; agrupación por cuenta o concepto; la cantidad de ambos períodos se calcula con el mismo filtro (ProCoop excluye filas con tipo de comprobante solo en el segundo). | RN-01 §23.8, duda 29 | Replicar + Mejorar (informe 15) | — | — |
| RN-TAR-193 | Informe de consumos por tramo y versión: reconstruye consumo y neto de cada escalón por servicio y período excluyendo R, DP y DFP, divide por factor de demanda cuando corresponde y contempla escalones de inyectada, **usando la versión con la que se liquidó** cada comprobante (ProCoop usa la tarifa viva). | RN-01 §23.9, `Get_Informe_ConsumosTramasCuadro` | Mejorar | — | — |
| RN-TAR-194 | Agregado tarifario por fila de tarifa y versión: usuarios, cuentas y comprobantes. | RN-01 §23.9 | Replicar (informe 15) | — | — |
| RN-TAR-195 | Métodos sin regla de negocio de ProCoop (accesores, cachés, consultas de interfaz, código muerto `Get_ConsumosCuadroTarifario`, clase `GetCampoServicio` no registrada, declaraciones de tipos DevExpress) no se replican. | RN-01 §23.10, §12.7 | Descartar (sin regla) | — | — |

### 6.19 División, distribución y consumos de terceros que afectan el cálculo (RN-06 §16, §18)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-196 | La división de un consumo que abarca más días que el período (más del 10 % y menos del triple; mitades, por máximo de días, por cambio de medidor, por días) la hace M03 y marca grupo y segmento 1/2; TAR consume los consumos divididos según RN-TAR-016 y PRM-TAR-140 (especificar período al dividir). | RN-06 §16.1 (V2 #2417) | Delegar (M03) | PRM-TAR-140 | — |
| RN-TAR-197 | La distribución de consumos de un servicio padre a hijos (porcentaje, igualada, combinada con tope) la hace M03; los hijos reciben consumos estimados "Redistribución de Consumo" y el padre uno negativo compensatorio; no se distribuye a grandes consumos, no conectados ni otro tipo. TAR liquida lo recibido sin distinguirlo, pero el padre con neto negativo compensatorio **no** genera crédito por inyectada. | RN-06 §16.3 (V2 #2618) | Delegar (M03) + regla TAR | — | — |
| RN-TAR-198 | No existe tipo de energía propio para la inyección: es energía activa con consumo negativo (multiplicador negativo o medidor indicado); el registro del generador puede venir de telemedición. En el modelo MER-001 la inyección se recibe de M03 como magnitud separada. | RN-06 §18; MER-001 | Replicar + Mejorar | — | A validar (PA-TAR-14) |

### 6.20 Reglas de BASE y AGR (requisitos del solicitante y propuestas adoptadas)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-199 | Una tarifa anterior debe seguir siendo reproducible aunque cambien los precios; se conserva copia de las reglas usadas en cada liquidación (versión inmutable + hash). | BASE §6 | Adoptar | — | — |
| RN-TAR-200 | Si no existe tarifa vigente o hay dos versiones incompatibles para el mismo caso, bloquear y pedir revisión. | BASE §6 CU-06 | Adoptar | — | — |
| RN-TAR-201 | Estructura de una regla: identidad (código, nombre, tenant, versión, autor, aprobación); ámbito (servicio, plan, grupo, contrato/suministro, beneficiario); jurisdicción y respaldo (país, provincia/localidad, autoridad, norma o condición comercial); vigencia y criterio de fecha (prestación, período u otro); condiciones (categoría, tipo de usuario, situación fiscal, beneficio acreditado, zona, otras autorizadas); base (cargo fijo, cantidad, componente energético, subtotal seleccionado u otra explícita); operación (importe fijo, porcentaje, escala, bloque, mínimo, máximo, umbral o fórmula autorizada); compatibilidad (prioridad, acumulación, exclusión, topes, resolución de conflictos); efectos (comprobante, percepción/retención, asiento, visibilidad al socio); evidencia (origen del padrón/beneficio, fecha de actualización, documentación). No todos son obligatorios para toda regla. | BASE §51 | Adoptar | — | — |
| RN-TAR-202 | Precio unitario, cantidad, cargo fijo y escalas se expresan por separado; los beneficios se aplican sobre una parte de la cantidad o del precio sin extenderse automáticamente al total. | BASE §51 | Adoptar | — | — |
| RN-TAR-203 | Distinguir beneficio por suministro/ubicación de condición general de la persona. | BASE §51 | Adoptar | — | — |
| RN-TAR-204 | Grupos explícitos o por criterios aprobados con historial de altas y bajas. | BASE §51 TAR-002 | Adoptar | — | — |
| RN-TAR-205 | Padrones por mecanismos autorizados (archivo, carga, API si existe) sin presuponer acceso a una API estatal; el derecho a un subsidio estatal no lo determina el sistema por su cuenta: requiere evidencia o padrón autorizado. | BASE §51 | Adoptar | — | — |
| RN-TAR-206 | Distinguir descuento comercial financiado por la cooperativa, subsidio público y compensación a recuperar; no tratar una bonificación comercial como subsidio estatal ni inventar subsidios por usar un servicio. | BASE §51, §72 | Adoptar | — | — |
| RN-TAR-207 | Descuentos acumulables o excluyentes con el orden exacto aplicado visible; topes. | BASE §51 | Adoptar | — | — |
| RN-TAR-208 | Tributos por tipo de operación y contribuyente, con base imponible y exenciones válidas; sin suponer tasa única para todos los servicios. | BASE §51 TAR-006, §52.2 | Adoptar (vía M06) | — | — |
| RN-TAR-209 | Distinguir impuesto a facturar, percepción, retención recibida y gasto propio de la cooperativa; no trasladar todos como recargos al socio. | BASE §51 | Adoptar | — | — |
| RN-TAR-210 | Tratar prorrateos, cambios de plan, suspensiones, reactivaciones y cambios de regla dentro de un período con criterio explícito por tramo. | BASE §51; AGR-017 | Adoptar | — | — |
| RN-TAR-211 | Reglas por producto/subservicio y plan, incluidas promociones por cantidad definida de meses o ciclos. | BASE §51, §72 | Adoptar | — | — |
| RN-TAR-212 | Diferenciar facturación anticipada y vencida y determinar el primer período desde la activación efectiva. | BASE §51, §72–73 | Adoptar | PRM-TAR-012 | — |
| RN-TAR-213 | Detallar la versión y los datos utilizados para reproducir cualquier cálculo histórico. | BASE §51 | Adoptar | — | — |
| RN-TAR-214 | Simular con un conjunto de contratos antes de publicar, comparar totales e impacto por grupo y servicio. | BASE §51; DFA M7 | Adoptar | PRM-TAR-005 | — |
| RN-TAR-215 | Corregir documentos definitivos mediante el circuito de ajustes, sin reescribir sus cálculos originales. | BASE §51; ESC-02 | Adoptar | — | — |
| RN-TAR-216 | Si dos reglas incompatibles pueden aplicar, se resuelve por prioridad explícita o revisión; nunca se elige silenciosamente. | BASE §51 CU-TAR-02 | Adoptar | — | — |
| RN-TAR-217 | No fijar en código categorías históricas, porcentajes ni bloques permanentes de subsidios; versionar regímenes y vigencias; registrar componente al que se aplica y origen de la acreditación; un cuadro de una distribuidora no es tarifa universal. | BASE §52.1 | Adoptar | — | — |
| RN-TAR-218 | Un campo configurable de cargo extra no habilita cualquier tasa o concepto: catálogo aprobado con fundamento, servicio, jurisdicción y documento permitido; un resumen de cuenta no disimula cargos improcedentes; no se incorporan productos ajenos en una factura de servicio. | BASE §52.2 (Res. SIC 267/2024) | Adoptar | — | — |
| RN-TAR-219 | La baja no tiene cargo por solicitarla (Ley 24.240 art. 10 quáter): ningún concepto puede tener disparador "solicitud de baja" ni naturaleza preaviso/mes adelantado por baja; la liquidación de prestaciones efectivamente devengadas hasta la baja es legítima y se explica separada. | BASE §52.3 | Adoptar | — | — |
| RN-TAR-220 | No hay arancel universal de suspensión/reconexión: cada cargo se habilita por servicio y ámbito con fundamento y condiciones de gratuidad. | BASE §52.3, §71 | Adoptar | — | — |
| RN-TAR-221 | Antes de habilitar facturación productiva de un servicio, el checklist de BASE §52.4 (ámbito, prestaciones, tarifas, beneficios, tributos, cargos, bajas, documentos, responsables) debe estar versionado y aprobado; el administrador del tenant no puede desactivar restricciones normativas. | BASE §52.4 | Adoptar | — | — |
| RN-TAR-222 | Cada concepto tiene disparador: aprobación, instalación efectiva, inicio de período, evento técnico u otro hito definido; uno de una sola vez no se repite. | BASE §72 | Adoptar | — | — |
| RN-TAR-223 | Evitar duplicar una instalación cobrada al contado y financiada, o sus cuotas, en dos módulos: el cargo de instalación tiene un único `chargeOriginId` y la financiación lo referencia. | BASE §72, §86 | Adoptar | — | — |
| RN-TAR-224 | Distinguir costo interno de prestar el servicio de importe a cobrar; ningún costo interno se factura sin concepto habilitado. | BASE §72, §87 | Adoptar | — | — |
| RN-TAR-225 | Conservar condiciones contratadas e historia de cambios sin aplicar silenciosamente una oferta nueva a contratos previos. | BASE §72 | Adoptar | — | — |
| RN-TAR-226 | Al cumplirse la duración de una promoción, el abono vuelve al importe contractual vigente según la regla definida y el cambio se explica. | BASE §72 CU-PRO-01 | Adoptar | — | — |
| RN-TAR-227 | Electricidad: no equiparar kWh con kW; no aplicar tarifa mayorista como minorista; no extender un beneficio de una persona a cualquier suministro sin revisar su alcance; compras de energía, cargos de abastecimiento, red y pérdidas no se convierten automáticamente en recargo del usuario; los umbrales de factor de potencia de EPEC son referencia, no universales. | BASE §87 | Adoptar | — | — |
| RN-TAR-228 | Agua: régimen medido/no medido con fecha efectiva; no medidos por bases aprobadas (categorías o características del inmueble) sin lecturas ficticias; cargo fijo, bloques/franquicias y excedentes solo si el régimen local los prevé; separar días reales del período de un criterio de normalización del régimen; cloaca como prestación con relación explícita con agua, sin habilitarla automáticamente. | BASE §88 | Adoptar | — | — |
| RN-TAR-229 | Gas: separar volumen medido, factores/correcciones, cantidad resultante y componente energético; versionar método y datos de origen; categorías, períodos de referencia, estacionalidad, cuadros y bloques del régimen aplicable; no copiar tarifas de electricidad o agua; gas natural por red, propano por red y envasado no son equivalentes. | BASE §89 | Adoptar | — | — |
| RN-TAR-230 | Internet: medición de tráfico/uso solo genera cargo con fuente definida; un abono de velocidad no convierte cada GB en cargo; facturación de períodos, promoción temporal y prorrateo bajo las reglas contratadas; no duplicar instalación y cuotas. | BASE §86 | Adoptar | — | — |
| RN-TAR-231 | Usuario-generador (Ley 27.424): liquidar demanda e inyección como operaciones separadas en el mismo comprobante con su IVA; tarifa de inyección del régimen; cuenta de créditos (anterior, generado, aplicado, cedido, retribuido, final); retribución a pedido en plazo ≤ 6 meses; cesión entre usuarios; datos para la rendición RG ARCA 5746/2025. Régimen por defecto: compensación monetaria; balance neto como opción del régimen (DEC-060; PA-TAR-14 alineada por HUE-ELE-03). | MER-001; DEC-060 | Adoptar | — | Asumida (PA-TAR-14, DEC-060) |
| RN-TAR-232 | Grandes usuarios: contratos con condiciones particulares (precio, potencia, plazo, penalidades) aprobados y versionados; lecturas por franja, demanda en punta y fuera de punta, reactiva con cargos por bajo factor de potencia; detalle por componente y revisión previa obligatoria por importe. | MER-003 | Adoptar | PRM-TAR-014 | — |
| RN-TAR-233 | Publicación íntegra de configuración con dependencias, validaciones, simulación, revisión y fecha efectiva; separar cambios comerciales, fiscales y de presentación (una corrección de etiqueta no genera revisión tarifaria); no sobrescribir contratos vigentes sin política. | AGR-009 | Adoptar | — | — |
| RN-TAR-234 | Fecha efectiva del hecho y fecha de registro con su origen; qué se corrige en borrador y qué exige ajuste; consultas históricas declaran qué fecha interpretan ("vigente al", "conocido al"). | AGR-010 | Adoptar | — | — |
| RN-TAR-235 | Representación decimal, precisión por concepto, redondeo explícito, moneda; el total no depende de la pantalla o proceso que lo consulte; ningún ajuste sin operación, causa, autor y contrapartida. | AGR-011 | Adoptar | — | — |
| RN-TAR-236 | Fronteras de calendario: zona horaria del tenant; día de alta incluido; día de baja incluido como día prestado; meses de 28–31 días reales; año bisiesto; feriados solo afectan vencimientos (M05) y bandas telefónicas; cambio de plan/titular, suspensión, promoción y redondeo **por tramo**; calendarios de lectura, liquidación, emisión y vencimiento son distintos; resultados independientes del horario del servidor. | AGR-017 | Adoptar | PRM-TAR-011 | — |
| RN-TAR-237 | Corrección recibida después de emitir: se simula la diferencia, se pide aprobación y documentación y se conserva el original; no se edita su total ni se crea otra obligación completa sin resolver la primera. | ESC-02 | Adoptar | — | — |
| RN-TAR-238 | Cambio de condiciones en un período parcialmente procesado: se mantiene el universo y las versiones aplicadas; la nueva vigencia afecta solo pendientes salvo ajuste aprobado; reejecutar un lote no reescribe contratos, promociones ni documentos. | ESC-05 | Adoptar | — | — |
| RN-TAR-239 | No se precargan tarifas, porcentajes fiscales ni subsidios reales de ninguna jurisdicción; los datos de demostración son ficticios y se marcan así. | BASE §6, §52, §87, §88, §89 | Adoptar | — | — |

### 6.21 Piloto Internet: abono, instalación, promociones y cambios (BASE §39.3, §72, §86)

| ID | Regla | ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TAR-240 | El abono (P × Q, Q = 1 por período) se devenga desde la **fecha de activación efectiva** informada por M10; en mes adelantado, el primer comprobante incluye la fracción del mes de alta (días desde la activación inclusive / días del mes) y, según PRM-TAR-012, el mes siguiente completo; en mes vencido, la fracción se cobra al cierre del mes. | BASE §72–73, §86; RN-01 §5.1 | Adoptar | PRM-TAR-012 | — |
| RN-TAR-241 | Instalación (ARS 30.000 en BASE §39.3 / ARS 20.000 en §72, ficticios) es un cargo por evento de una sola vez disparado por el hito configurado (instalación ejecutada o activación); si el contrato eligió financiación, el cargo se entrega a M08 como principal y no se genera renglón de contado. | BASE §39.3 INS-INT, §72 | Adoptar | — | — |
| RN-TAR-242 | Promoción por ciclos: cada comprobante emitido que aplica la promoción consume una unidad (ciclo); el ciclo parcial consume o no según la definición de la promoción (default PRM-TAR-016); al agotarse se finaliza y se avisa. La promoción aplica solo a su base declarada (ej. abono), no a instalación ni equipo salvo regla explícita. | BASE §72 CU-PRO-01; AGR-017 | Adoptar | PRM-TAR-016 | A validar (PA-TAR-05) |
| RN-TAR-243 | Cambio de plan dentro del período: se registran ambos tramos de días con su plan y precio; la promoción del plan anterior termina o se traslada según la regla de la promoción (`onPlanChange`: terminar / trasladar si el nuevo plan es elegible / mantener hasta fin de ciclo). Vigencia del cambio (DEC-032): por defecto desde el próximo período (un solo plan en el período en curso); los dos tramos con prorrateo solo se liquidan si el tenant habilitó el cambio inmediato en M02. | BASE §86 "Cambio"; AGR-017; DEC-032 | Adoptar | — | — |
| RN-TAR-244 | Suspensión: durante días suspendidos el abono se liquida según la regla del servicio (`suspensionBilling`: cobrar / no cobrar / cobrar % ); reactivación sin cargo salvo cargo por evento habilitado con fundamento (RN-TAR-220). | BASE §52.3, §86; AGR-017 | Adoptar | — | — |
| RN-TAR-245 | Ejemplo de referencia: abono ARS 25.000 − bonificación promocional 10 % = ARS 22.500; la instalación ARS 30.000 es un cargo distinto que no se suma todos los meses. | BASE §39.3 | Adoptar (caso de prueba) | — | — |
| RN-TAR-246 | Equipo no devuelto: (1) si PRM-TAR-169 = `false` o no hay `eventCharges` aprobado con `trigger = equipment_not_returned` para el tipo de equipo, EVT-STK-07 se registra sin efecto; (2) el cargo solo se habilita si la regla tiene fundamento (`legalBasis`) y aprobación del responsable normativo (RN-MOR-101 de M08; DEC-013); (3) al recibir EVT-STK-07 (`assignmentId`, `contractId`, `dueAt`) M04 cotiza el importe (precio por modelo/tipo de `productPrices` con `kind = equipment` o importe fijo de la regla) y lo devuelve a M13 para la propuesta; el plazo es `returnGraceDays` o, en su defecto, PRM-CAT-094; (4) solo con `stk.equipment.chargeApproved` (EVT-STK-08) crea con `fac.service.upsertBillableItem` de M05 un ítem en `billableItems` con `sourceModule = TAR`, `sourceType = equipmentNotReturned` y `sourceRef.id = assignmentId` (idempotente; antes ~~`preloadedCharges` con `origin`/`originRef`~~, CTR-DAT-38); (5) si el equipo se devuelve antes de facturar, el cargo pasa a `cancelled`; si ya se facturó, la reversión es nota de crédito de M05. | HUE-INT-01; BASE §74, §86; RN-MOR-101 | Mejorar (cargo con fundamento y aprobación) | PRM-TAR-169, PRM-CAT-094 (M02, lectura) | Cargo sin fundamento o sin aprobación ⇒ no se crea. |
| RN-TAR-247 | Servicio relacionado faltante: si un servicio configurado para tomar el consumo de otro (RN-TAR-015; ej. cloaca sobre agua) no encuentra el servicio relacionado, lo encuentra dado de baja o sin consumo aprobado para el período, el cálculo de **esa cuenta** termina con `TAR-E-RELATED-MISSING` (sección 9.11), la cuenta se excluye y el lote continúa; M05 la registra como excepción `RELATED_SERVICE_MISSING`. No se estima ni se toma consumo cero. | HUE-CLO-02; RN-01 §2 | Mejorar (error tipado) | PRM-TAR-060, PRM-TAR-061 | — |
| RN-TAR-248 | Cargo fijo por derecho (HUECO-CEM-01): (1) adquisición: precio del derecho (`productPrices`, `kind = cemetery_right`, por tipo de unidad/sector) al contado como cargo único o financiado como plan `right_acquisition` que reutiliza RF-TAR-031/RN-TAR-071 (cuota n/N, sin repetir, avance confirmado al emitir); la financiación con interés es de M08; (2) mantenimiento: cargo fijo de la categoría del contrato de derecho (`kind = cemetery_maintenance`) con periodicidad mensual, bimestral o anual definida en la versión tarifaria; se cobra aunque el plan de adquisición esté agotado y se suspende solo por baja del abono en M02; (3) actos: cada `soc.cemeteryAct.performed` (EVT-SOC-06) con `type` incluido en `socialActTypes[]` crea con `fac.service.upsertBillableItem` un ítem en `billableItems` de M05 con `sourceModule = TAR`, `sourceType = socialAct`, idempotente por `sourceRef.id = actId` (antes ~~`preloadedCharges` con `origin = social_act`~~, CTR-DAT-38); actos sin regla no generan cargo. El tratamiento de IVA de cada concepto es de M06 (RF-FIS-162). | HUECO-CEM-01; M02 §6.C.11; RF-SOC-055 | Adoptar | — | — |
| RN-TAR-249 | Cargo por traslado (HUECO-SAL-01), por cada `soc.trip.completed` (EVT-SOC-07) idempotente por `tripId`: (1) tarifa base según el modo de `tripPricing`: `per_km` = km × `perKmPrice`; `fixed` = `fixedAmount`; si `shortTripMaxKm` está definido y km ≤ `shortTripMaxKm`, se usa `shortTripPrice` (ex `MOVIL.PRE_VIAJESCORTOS`); (2) se aplica la regla de la característica del viaje (programado, alta, derivación, diálisis u otras de M18); (3) persona no asociada ⇒ precio de la lista `nonMemberPriceListCode`, sin cobertura; (4) viaje cubierto por el plan de salud (M02 §6.C.13) ⇒ sin cargo (`coveredMode = free`) o coseguro fijo/porcentual sobre la tarifa base; no cubierto ⇒ tarifa completa; (5) el `amount` del evento solo se usa si `acceptExternalAmount = true` (importe pactado en M18), con traza; (6) el resultado se crea con `fac.service.upsertBillableItem` como ítem de `billableItems` de M05 con `sourceModule = TAR`, `sourceType = socialTrip`, `sourceRef.id = tripId` (antes ~~`preloadedCharges` con `origin = social_trip`~~, CTR-DAT-38). Viajes multitramo: se cobra por la suma de km de los tramos vinculados al viaje original (RF-SOC-075) una sola vez. | HUECO-SAL-01; M02 §6.C.13; RF-SOC-074, RF-SOC-076, RF-SOC-080 | Replicar + Mejorar | PRM-TAR-170 | Si el evento no trae característica o condición de asociado, se cobra como asociado sin característica y se marca para revisión. |
| RN-TAR-250 | Régimen de medición (HUE-AG-03; RN-CAT-078 de M02): el régimen vigente del contrato a cada fecha se toma del historial de M02 (`serviceContractHistory`, EVT-CAT-28). (1) Paso a `metered`: hasta la primera lectura válida posterior a `effectiveAt` aprobada por M03 rige la cuota fija; desde esa lectura, cantidad = consumo aprobado y cuadro de la categoría medida; (2) paso a `unmetered`: el consumo hasta la lectura final de retiro (RF-MED-022) se factura por consumo y desde `effectiveAt` rige la cuota fija; (3) el período del cambio se liquida como un cambio de tramo (prorrateo por días de RN-TAR-025 y RN-TAR-046), con dos renglones y la fracción de cada uno en la traza; (4) sin lectura final en el paso a `unmetered`, la cuenta termina con `TAR-E-REGIME-READING-MISSING` y se excluye; (5) recibir dos veces el mismo `commandId` no cambia el cálculo. | No existe (ProCoop cambia categoría y medidor a mano). | Mejorar (HUE-AG-03) | — | — |
| RN-TAR-251 | Cupo de correo y pack SMS (DEC-084): (1) el plan del servicio (M02) define `includedQuota` y la unidad (`sms`, `mailbox`, `gb`); el precio del cargo fijo y el `excessUnitPrice` se versionan en `productPrices` (`kind = tic_quota`); (2) cantidad de exceso = máx(0, consumo del período − cupo); (3) el cupo no usado no se acumula salvo PRM-TAR-171; (4) el alta o baja en el período prorratea el cargo fijo (RN-TAR-046) y el cupo en la misma fracción, redondeado hacia abajo; (5) sin consumo informado a la fecha de cálculo se emite solo el cargo fijo con `TAR-W-QUOTA-USAGE-MISSING` y el exceso se liquida en el período siguiente, identificado por período de origen; (6) el envío y la medición son de T06/T09/M10; M04 solo precia. **Contrato de datos del consumo:** T06 recibe el consumo del proveedor (EVT-INT-24 `int.serviceUsage.received`, FI-INT-112), M10 lo atribuye al contrato y publica EVT-TEC-38 `tec.quotaUsage.reported` (`contractId`, `serviceId`, `period`, `unit`, `quantity`, `revision`, `reportedAt`); al calcular, M04 lee la última revisión con API-TEC-56 `tec.getQuotaUsage({ contractId, period })` y la congela en la traza del cálculo (`calculations`) con `revision`; `null` ⇒ punto (5). Una revisión que llega para un período ya facturado no recalcula: se registra en la traza y el ajuste, si corresponde, se hace por el circuito de retroactivos. | No existe (ProCoop cobra el pack SMS como abono tipo 16 sin control de cupo; PRM-TAR-092). | Mejorar (DEC-084) | PRM-TAR-092, PRM-TAR-171 | Consumo negativo o de un período ya facturado ⇒ se rechaza y se registra en la traza. |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.0 Convenciones del modelo

- Todo documento lleva `TenantId` (uniqueidentifier, obligatorio), `createdAt`, `createdBy`, `updatedAt`, `updatedBy`; los índices compuestos empiezan por `TenantId` (DEC-002). Las colecciones de catálogo de plataforma (`formulaFunctions` nativas) usan el tenant `PLATFORM` y pueden tener extensión por tenant.
- Importes y precios en `DECIMAL(18,4)` (lectura/escritura con `decimal.js`); precisión por concepto según PRM-TAR-150 (precio unitario 6 decimales, cantidad 4, fracción 6, importe 2) — PA-TAR-15.
- Fechas de vigencia como fecha civil (`YYYY-MM-DD`) interpretada en la zona horaria del tenant; marcas de tiempo en UTC.
- Toda entidad versionada tiene `status`, `validFrom`, `validTo` (exclusivo, nulo = abierta), `version` (entero creciente por clave), `supersedesId`, `approvals[]` (`userId`, `role`, `at`, `decision`, `comment`), `normativeRefs[]` (→ `normativeDocuments`) y `contentHash` (SHA-256 del contenido canónico). Una versión publicada es **inmutable**: cualquier cambio crea una nueva versión (CTR-TAR-01, CTR-TAR-02).
- Las referencias a otros módulos son por ID (`serviceId`, `categoryId`, `planId`, `productId`, `contractId`, `accountId`, `conceptId`, `taxRateIds` (solo IVA → `vatRates`), `taxIds` (otros tributos → `taxDefinitions`)…; antes `taxRateId`…); TAR no copia datos maestros ajenos salvo en la instantánea de cálculo.
- Las claves técnicas (`code`) siguen `^[a-z][a-z0-9_]{1,60}$`; las etiquetas visibles son claves del diccionario (T03).

### 7.1 `tariffSchedules` — versión de cuadro tarifario

Propósito: cabecera de una versión de cuadro por servicio (y opcionalmente plan/zona); contiene o referencia tarifas por categoría, filas, adherentes y precios de producto.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código estable del cuadro (ej. `ag_residencial`). |
| `name` | string | Sí | Nombre visible. |
| `serviceId` | uniqueidentifier | Sí | Servicio de M02. |
| `scope` | object | No | `planIds[]`, `zoneIds[]`, `jurisdiction` (país, provincia, localidad), `regulatorCode`. |
| `version` | int | Sí | Versión correlativa por `code`. |
| `status` | enum | Sí | `draft`, `submitted`, `approved`, `rejected`, `scheduled`, `active`, `superseded`, `closed`, `voided` (sección 8.1). |
| `validFrom` / `validTo` | date | Sí / No | Vigencia; sin solapamiento por (`serviceId`, `scope`) entre versiones `scheduled/active`. |
| `referenceDateMode` | enum | Sí | Criterio de fecha de referencia tarifaria heredable (`reading_date`, `period_start`, `period_end`, `issue_date`) — PRM-TAR-010, PA-TAR-04. |
| `currency` | string | Sí | Moneda ISO (ARS por defecto). |
| `changeKind` | enum | Sí | `commercial`, `fiscal`, `presentation` (AGR-009). |
| `origin` | enum | Sí | `manual`, `copy`, `mass_update`, `import`, `migration`. |
| `sourceScheduleId` | uniqueidentifier | No | Versión de la que se copió. Referencia: → `tariffSchedules` (M04). |
| `massUpdate` | object | No | Parámetros de la actualización masiva (`mode`: `percent`/`fixed`/`formula`; `value`; `fields[]`; `rounding`). |
| `simulationRunId` | uniqueidentifier | Cond. | Simulación vinculada; obligatoria para pasar a `submitted` según PRM-TAR-005 (PA-TAR-09). |
| `approvals[]`, `normativeRefs[]`, `contentHash`, `supersedesId` | — | — | Ver 7.0. |
| `publishedAt`, `publishedBy`, `activatedAt` | datetime/uniqueidentifier | No | Trazas de publicación y activación. |
| `legacy` | object | No | `cuadroCode` (`CUADROS.COD_CUA`), `hisRange` (rango `HIS_*`), `legacyHash`. |

Índices: `{tenantId, code, version}` único; `{tenantId, serviceId, status, validFrom}`; `{tenantId, status, validFrom}` (activación). Mapeo: `CUADROS`, `HIS_*` (fotos), `CUADRI` (cuadro–servicio).

### 7.2 `tariffServiceSettings` — configuración tarifaria del servicio

Propósito: comportamiento de cálculo del servicio, versionado (separa lo que en ProCoop vive en `SERVICIO`/`SERVICIO_EXTRAS`/`HIS_SERVICIO*`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | Servicio M02. |
| `version`, `status`, `validFrom`, `validTo` | — | Sí | Versionado. |
| `calcType` | enum | Sí | 17 estrategias: `metered_block` (1), `metered_tiers` (2), `gas` (3), `metered_fixed_by_range` (4), `phone` (5), `fixed` (6), `quantity_block` (7), `quantity_tiers` (8), `adherents_by_count` (9), `adherents_by_count_and_age` (10), `adherents_by_assigned_rate` (11), `adherents_by_all_rates` (12), `adherents_by_auto_rate` (13), `mobile_phone` (14), `water_by_property` (15), `sms_pack` (16), `works_installments` (17). |
| `consumptionSourceServiceId` | uniqueidentifier | No | Servicio del que toma consumos (`REL_SER`/`USA_COT`). |
| `daysFactorMode` | enum | Sí | `none`, `scale_quantity`, `scale_limits` (PA-TAR-02). |
| `standardDays` | int | Cond. | Días estándar (30 por defecto) si hay factor de días. |
| `fixedCharge` | object | Sí | `enabled`, `byDays`, `byTier`, `proportional`, `proration`, `chargeWhenPendingOrDown`, `firstFeeBonified`, `onceByPeriod`. |
| `proration` | object | Sí | `method` (`none` = 0 sin prorrateo, `consumption_proportional` = 1 proporcionalidad en consumo, `consumption_continue_tiers` = 2 consumo continuando la trama, `unit_price_proportional` = 3 proporcionalidad en precio unitario; ex `PRORRATEO_METODO`, RN-TAR-049, RN-TAR-054 a 056), `enabled` (derivado: `method ≠ none`; no se carga), `maxVersions` (≤ 3, RN-TAR-052), `prorateMinimum` (bool, ex `PRORRATEO_CM`), `prorateDemand` (bool; efectivo solo con PRM-TAR-093 = `true`), `useFullReadingRange` (bool, ex `PRORRATEO_DIASCONSUMO`: con lecturas divididas usa el rango completo de las lecturas originales). El prorrateo del cargo fijo es `fixedCharge.proration` (ex `PRORRATEO_CF`). Las fracciones se calculan siempre por días (RN-TAR-051); el método solo define cómo se valoriza el consumo (DEC-104, CTR-TAR-42). *Reemplazado (10-11-2026): "`enabled`, `method` (`days`, `consumption`, `readings`), `maxVersions` (≤ 3), `applyTo` (`variable`, `fixed`, `both`)."* |
| `proportionalStartEnd` | bool | Sí | Proporcional de alta/baja. |
| `billingTiming` | enum | Sí | `in_advance`, `in_arrears` (mes adelantado/vencido). |
| `minimum` | object | No | `mode` (`quantity`, `amount`, `none`), `compareAgainst` (`net`, `without_injected`). |
| `surchargeMode` | enum | No | Modo de recargo/franquicia de adherentes. |
| `tierBasis` | enum | No | `own`, `witness`, `accumulated_month` (división del ex `TRAMA_DEC`, CTR-TAR-16). |
| `largeCustomerEnergyMode` | enum | No | Modalidades 1–4 de grandes consumos (ex `TRAMA_DEC`). |
| `demandMode` | object | No | Modalidad de demanda (contratada, registrada, adquirida, corregida, excedente), `penaltyFactor`, `updateContracted` (`ACT_DEM`, `ACT_DEM_UNI`, `PORC_ACTDEM`). |
| `powerFactor` | object | No | `enabled`, `thresholdTg`, `base` (`energy`, `energy_demand`), `includeFixed`, `bonusEnabled`, `formulaRuleCode`. |
| `adherents` | object | No | `excludeMinors`, `excludeRetired`, `excludeDisabled`, `perUnit`, `autoCategory`, `franchise`. |
| `phone` | object | No | `ratePlanDefaultId`, `includeZeroLine`, `cppConceptId`, `internationalConceptId`. |
| `suspensionBilling` | enum | No | `charge`, `no_charge`, `percent` + `suspensionPercent`. |
| `displayOrderByConcept` | bool | No | Ordenar filas por concepto (PRM-TAR-103). |
| `conceptIds` | object | Sí | Conceptos por defecto (servicio, cargo fijo, mínimo, energía, demanda, factor de potencia). |
| `taxDefaults` | object | Sí | Alícuotas de IVA/IIBB por defecto del servicio (referencias a M06). |
| `propertyOverrides[]` | array | No | Por propiedad de servicio (tensión, etc.): mínimo (unidades y precio), cargo fijo (concepto, importe, cantidad), concepto de mínimo. |

Índices: `{tenantId, serviceId, version}` único; `{tenantId, serviceId, status, validFrom}`. Mapeo: campos de cálculo de `SERVICIO`, `SERVICIO_EXTRAS`, `HIS_SERVICIO`, `HIS_SERVICIO_EXTRAS`; `PROPIESER` (mínimos y cargo fijo por propiedad → `propertyOverrides[]`). `TIP_SERVI`, `CLASESER` (clase con `VALOR1/2`), `ESTASER` y `ALTASEAU` son de M02: TAR los lee (clase en fórmulas, estados que implican desconexión, altas automáticas como disparador de cargos).

### 7.3 `tariffCategoryRates` — tarifa por categoría dentro de la versión

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `scheduleId` | uniqueidentifier | Sí | Versión de cuadro. |
| `categoryId` | uniqueidentifier | Sí | Categoría tarifaria de M02. |
| `fixedCharge` | object | Sí | `amount` (DECIMAL(18,4)), `quantity`, `conceptId`, `currency`, `byDays`. |
| `minimum` | object | No | `quantity`, `amount`, `conceptId`. |
| `bonusQuantity` | DECIMAL(18,4) | No | Unidades bonificadas. |
| `contractedDemand` | object | No | Precio de demanda contratada, tolerancia, penalidad. |
| `powerFactor` | object | No | Umbral, recargo, bonificación por categoría. |
| `prepaid` | bool | No | Categoría prepaga. |
| `taxRateIds` | uniqueidentifier[] (antes object) | No | Solo alícuotas de IVA de la categoría (cascada RN-TAR-166) → `vatRates` (M06). Antes "IVA/IIBB de la categoría" (PA-TAR-21). |
| `taxIds` | uniqueidentifier[] | No | IIBB, percepciones y demás tributos de la categoría (cascada RN-TAR-166) → `taxDefinitions` (M06); separado de `taxRateIds` (T05 PA-DAT-04, PA-TAR-21). |
| `coefficients[]` | array | No | Coeficientes por categoría (→ `categoryCoefficients`). |
| `extras` | object | No | Propiedades extra tipadas (ex `CATE_SER_EXTRAS`). |
| `daysFactorMode` | enum | No | Sobrescribe el modo del servicio para tarifa por bloque (`scale_quantity` / `scale_limits`, RN-TAR-027). |
| `forcedVoucherTypeId` | uniqueidentifier | No | Tipo de comprobante forzado por la categoría (RN-TAR-010). Antes `forcedInvoiceTypeId` (nombre de T05). Referencia: `voucherTypes` (M05). |
| `chargeMinimumWhenDown` | bool | No | Cobra mínimo en baja (RN-TAR-037). |
| `legacy` | object | No | `catSerCode`, `catTarifCode`. |

Índices: `{tenantId, scheduleId, categoryId}` único. Mapeo: campos tarifarios de `CATE_SER` (IVA, mínimos `IMP_MINM`/`IMP_CMINM`/`IMP_MINT`/`IMP_CMINT`, trama, GC, prepaga, tipo de comprobante forzado), `CATE_SER_EXTRAS` (generador, mínimos de vivienda, propiedad de cambio de categoría), `HIS_CATE_SER`, `HIS_CATE_SER_EXTRAS`. La identidad de la categoría y `GRP_CAT` (grupos con código ENARGAS) son de M02; TAR los usa como ámbito y criterio. El perfil MikroTik de `CATE_SER_EXTRAS` es de M10.

### 7.4 `tariffRows` — filas de tarifa (tramos/escalones)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `scheduleId`, `categoryId` | uniqueidentifier | Sí | Pertenencia. |
| `energyType` | enum | Sí | `A` (o vacío), `R`, `DP`, `DFP`, `DV`, `INJ` (inyectada). |
| `conceptId` | uniqueidentifier | Sí | Concepto facturable (M02). |
| `timeBand` | string | No | Franja/banda horaria. |
| `stepMin`, `stepMax` | DECIMAL(18,4) | Sí | Escalón `[stepMin, stepMax)`; admite negativos para neto negativo. |
| `price` | DECIMAL(18,4) | Sí | Precio unitario (6 decimales). |
| `fixedChargeForRange` | DECIMAL(18,4) | No | Cargo fijo por tramo (tipo 4 / `byTier`). |
| `taxRateIds` | uniqueidentifier[] (antes object) | No | Solo alícuotas de IVA de la fila → `vatRates` (M06). Antes "IVA/IIBB de la fila" (PA-TAR-21). |
| `taxIds` | uniqueidentifier[] | No | IIBB, percepciones y demás tributos de la fila → `taxDefinitions` (M06) (T05 PA-DAT-04, PA-TAR-21). |
| `subsidy` | object | No | `costSubsidy`, `fixedChargeWithSubsidy`, `costPrice`, `costPist`, `costMem`, `costTne`, `uniformGasPrice` (RN-TAR-173). |
| `order` | int | Sí | Orden estable para copia por **clave** (CTR-TAR-28). |
| `rowKey` | string | Sí | Clave natural (`energyType\|conceptId\|timeBand\|stepMin`). |

Índices: `{tenantId, scheduleId, categoryId, energyType, conceptId, timeBand, stepMin}` único; validación de no solapamiento de escalones. Mapeo: `CATTARIF` (filas; `PRE_DIU`/`PRE_NOC` → filas con `timeBand`; `XUNID`, `CADHER`, `CAN_ADH` → `adherentRates`; `COSTO_EPEC` → `subsidy.costPist`), `HIS_CATTARIF`, `CATTMC` (tabla de trabajo de cuadros → filas de la versión en borrador).

### 7.5 `adherentRates` — tarifas por adherente

Campos: `scheduleId`, `categoryId`, `kind` (`by_count`, `by_age`, `by_relationship`, `by_occupation`, `assigned`), `minCount`/`maxCount`, `minAge`/`maxAge`, `relationshipTypeId`, `occupationTypeId`, `price`, `conceptId`, `autoCategoryId` (recategorización), `franchise` (cantidad sin cargo). Índice `{tenantId, scheduleId, categoryId, kind, minCount, minAge}`. Mapeo: `TAR_ADHE`, `HIS_TAR_ADHE`.

Nombre canónico: `adherentRates` (COL-TAR-05 de T05). T07 §19.2 usa `dependentTariffs` para `TAR_ADHE`/`HIS_TAR_ADHE`: es la misma colección y debe corregirse en T07. Los adherentes que cuentan para estas tarifas son los `serviceDependents` de M18 (CTR-DAT-26; DEC-071); `relationshipTypeId` referencia `relationshipTypes` de M18.

Campos de `adherentRates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scheduleId` | uniqueidentifier | [VERIFICAR] | — | `tariffSchedules` (M04; T05 §7.2 admite `scheduleId` dentro de M04) |
| `categoryId` | uniqueidentifier | Sí | — | `serviceCategories` (M02) |
| `kind` | enum | [VERIFICAR] | `by_count`, `by_age`, `by_relationship`, `by_occupation`, `assigned` | — |
| `minCount` | int | [VERIFICAR] | — | — |
| `minAge` | [VERIFICAR] | [VERIFICAR] | — | — |
| `relationshipTypeId` | uniqueidentifier | [VERIFICAR] | — | `enumerationItems` (T04), catálogo `relationshipTypes` de M01 |
| `occupationTypeId` | uniqueidentifier | [VERIFICAR] | — | `enumerationItems` (T04), catálogo `occupations` de M01 |
| `price` | decimal | [VERIFICAR] | — | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `autoCategoryId` | uniqueidentifier | [VERIFICAR] | Recategorización | `serviceCategories` (M02) |
| `franchise` | [VERIFICAR] | [VERIFICAR] | Cantidad sin cargo | — |

### 7.6 `productPrices` — precios de productos/servicios por versión

Campos: `serviceProductId` (antes `productId`; nombre de T05) (M02), `scheduleId` (opcional) o lista de precios propia (`priceListCode`), `version`, `status`, `validFrom/validTo`, `price`, `currency`, `priceIncludesVat` (bool), `taxRateIds` (solo IVA), `taxIds` (otros tributos; separado el 5-11-2026), `perceptionRate`, `categoryId` (opcional, precio por categoría), `kind` (`product`, `postal`, `housing`, `installation`, `equipment`, `cemetery_right`, `cemetery_maintenance`, `trip`, `other`). Índices `{tenantId, serviceProductId, validFrom}`; `{tenantId, kind, categoryId, validFrom}`. Mapeo: precios de `PROD_SER` (`PRE_CSI`, `PRE_VSI`, alícuotas, `PRE_ATRASO`), `HIS_PROD_SER`, `PRECIOSVIV`, `POSTALES` (precio de franqueo). La identidad del producto, el stock y el rubro son de M02/M13.

> **Reemplazado por PAN-SOC-17 / API-SOC-034 (HUECO-VIV-02):** el uso de `productPrices` con `kind = housing` y el mapeo de `PRECIOSVIV` a esta colección. Los precios de vivienda por tipología y vigencia viven en M18 y M04 los recibe por `billing-inputs` (API-SOC-006) al calcular (RN-TAR-075). El valor `housing` se conserva en el enum solo para leer datos históricos migrados; no se cargan precios nuevos con ese `kind`.

Campos de `productPrices` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceProductId` | uniqueidentifier | Sí | (antes `productId`; nombre de T05) (M02) | `serviceProducts` (M02) |
| `scheduleId` | uniqueidentifier | [VERIFICAR] | (opcional) o lista de precios propia (`priceListCode`) | `tariffSchedules` (M04; T05 §7.2 admite `scheduleId` dentro de M04) |
| `version` | int | [VERIFICAR] | — | — |
| `status` | enum | Sí | — | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `price` | decimal | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `priceIncludesVat` | [VERIFICAR] | [VERIFICAR] | Bool | — |
| `taxRateIds` | uniqueidentifier[] | [VERIFICAR] | Solo alícuotas de IVA (PA-TAR-21; T05 PA-DAT-04). | `vatRates` (M06); antes "`vatRates` o `taxDefinitions` (M06), asumido en PA-TAR-20 (DEC-072); antes [VERIFICAR]" |
| `taxIds` | uniqueidentifier[] | No | IIBB, percepciones y demás tributos del precio (PA-TAR-21; T05 PA-DAT-04). | `taxDefinitions` (M06) |
| `perceptionRate` | decimal | [VERIFICAR] | — | — |
| `categoryId` | uniqueidentifier | Sí | Opcional, precio por categoría | `serviceCategories` (M02) |
| `kind` | enum | Sí | `product`, `postal`, `housing`, `installation`, `equipment`, `cemetery_right`, `cemetery_maintenance`, `trip`, `other` | — |

### 7.7 `eventCharges` — cargos por evento (catálogo aprobado)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `name` | string | Sí | Identificación. |
| `serviceIds[]` | uniqueidentifier | Sí | Servicios donde está habilitado. |
| `trigger` | enum | Sí | `contract_approved`, `installation_completed`, `activation`, `period_start`, `technical_event`, `reconnection`, `meter_change`, `manual`, `other_milestone`, `equipment_not_returned` (EVT-STK-07/08; RF-TAR-115), `social_act` (EVT-SOC-06; RF-TAR-117), `social_trip` (EVT-SOC-07; RF-TAR-118). **No admite** `termination_requested` (RN-TAR-219). |
| `technicalEventCodes[]` | string | Cond. | Tipos de orden/evento de M10 que lo disparan. |
| `socialActTypes[]` | string | Cond. | Para `social_act`: tipos de acto de cementerio (inhumación, exhumación, reducción, traslado, otros) que disparan el cargo. |
| `equipmentKinds[]` | string | Cond. | Para `equipment_not_returned`: modelos o tipos de equipo (ONT, decodificador, router) a los que aplica; vacío = todos los de la asignación. |
| `returnGraceDays` | int | No | Para `equipment_not_returned`: plazo propio de devolución; vacío = PRM-CAT-094 (M02). |
| `nature` | enum | Sí | `installation`, `reconnection`, `connection`, `equipment`, `administrative`, `tax_third_party`, `social_service`, `other`. |
| `pricing` | object | Sí | `mode` (`fixed`, `formula`, `percent`, `per_km`), `amount`, `ruleCode`, `conceptId`. Para `social_trip`: `tripPricing` (RN-TAR-249). |
| `tripPricing` | object | Cond. | `perKmPrice`, `fixedAmount`, `shortTripMaxKm`, `shortTripPrice`, `characteristicRules[]` (`characteristicCode`, `mode` `surcharge_percent`/`surcharge_amount`/`price_override`, `value`), `coveredMode` (`free`, `copay_fixed`, `copay_percent`), `copayValue`, `nonMemberPriceListCode`, `acceptExternalAmount` (bool, default `false`). |
| `once` | bool | Sí | Solo una vez por contrato/origen. |
| `financeable` | bool | No | Puede financiarse (M08). |
| `gratuityConditions[]` | array | No | Condiciones de gratuidad (ej. reconexión por error de la cooperativa). |
| `legalBasis` | object | Sí | Fundamento, jurisdicción, documento permitido, `normativeRefs[]` (Res. SIC 267/2024). |
| `version`, `status`, `validFrom/validTo` | — | Sí | Versionado. |

Índices `{tenantId, code, version}` único; `{tenantId, trigger, status}`. Mapeo: `CONEXION` (conceptos a facturar al conectar por categoría, localidad, propiedad, referencia, clase, transacción; cantidad; desactivación). Los disparadores provienen de transacciones de M02/M10 (`COD_TRAN`) y de las altas automáticas (`ALTASEAU`, M02).

### 7.8 `eventChargeBonuses` — bonificaciones de cargos por evento/conexión

Campos: `eventChargeId` o `conceptId`, `accountId`, `serviceId`, `transactionCode`, `categoryId`, `bonifiedQuantity` (cantidad bonificada), `percent` o `amount`, `validFrom/validTo`, `reason`, `approvedBy`. Mapeo: `CONE_BONIF` (`COD_SUM`, `COD_SER`, `COD_TRAN`, `COD_PRO`, `COD_CAT`, `CANT_BONIFICADAS`).

Campos de `eventChargeBonuses` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `eventChargeId` | uniqueidentifier | Sí | — | `eventCharges` (M04) |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `serviceId` | uniqueidentifier | [VERIFICAR] | — | `tenantServices` (M02) |
| `transactionCode` | string | [VERIFICAR] | — | — |
| `categoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `bonifiedQuantity` | [VERIFICAR] | [VERIFICAR] | Cantidad bonificada | — |
| `percent` | [VERIFICAR] | [VERIFICAR] | — | — |
| `amount` | decimal | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |

### 7.9 `categoryCoefficients` — coeficientes por categoría

Campos: `scheduleId`, `categoryId`, `code` (ej. `coef1`…`coef4`, `update1`, `update2`, `min_quota1`, `min_quota2`), `value` (DECIMAL(18,4)), `validFrom/validTo`. Mapeo: `CATE_SER_COEFICIENTES` (`FEC_COEF`, `COEFICIENTE` a `COEFICIENTE4`). `USOINM` y `ESTINM` (usos y estados de inmueble) son de M01; TAR los lee como condición de reglas y para agua por inmueble.

Campos de `categoryCoefficients` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scheduleId` | uniqueidentifier | [VERIFICAR] | — | `tariffSchedules` (M04; T05 §7.2 admite `scheduleId` dentro de M04) |
| `categoryId` | uniqueidentifier | Sí | — | `serviceCategories` (M02) |
| `code` | string | Sí | Ej. `coef1`…`coef4`, `update1`, `update2`, `min_quota1`, `min_quota2` | — |
| `value` | decimal | [VERIFICAR] | DECIMAL(18,4) | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.10 `gasCalorificFactors` — factores de gas

Campos: `serviceId`, `zoneId`/`supplyPointCode`, `period` (`YYYY-MM`; CTR-DAT-31 — antes ~~`periodYear`, `periodMonth`~~), `calorificValue`, `pressureFactor`, `temperatureFactor`, `correctionFactor`, `source` (`distributor`, `manual`, `import`), `normativeRefs[]`. Índice `{tenantId, serviceId, zoneId, period}` único (antes con `periodYear`, `periodMonth`). Campos adicionales: `categoryId` (los factores de ProCoop son por período, servicio y categoría). Mapeo: `FACTOR_CAL` (`PERIODO`, `FACTOR`, `COD_SER`, `COD_CATSER`, `PRESION`, `TEMPERATURA`), `CORREGAS` (`PERIODO`, `COD_SER`, `COD_CAT`, `FACTOR`). `ARTEFACTO`, `ARTEFSUMS` y `HIS_ARTEFSUMS` (artefactos declarados) son datos de M01/M03; TAR solo los lee como condición (ej. categoría por artefactos) y para estimación (M03).

Dueño único (PA-TAR-19 opción A; HUE-GAS-03; DEC-085): esta colección reemplaza a `gasCorrectionFactors` de M03; M03 la lee por API de solo lectura para estimar y validar. Coincide con CTR-DAT-33 de T05 (DEC-085). Solo aplica a gas natural y propano por red; el gas envasado (DEC-082) no tiene factores ni corrección. La exigencia de presión y temperatura para aprobar un período la gobierna PRM-TAR-168.

Campos de `gasCalorificFactors` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `zoneId` | uniqueidentifier | Sí | — | `zones` (T04) |
| `period` | string | Sí | `YYYY-MM`; CTR-DAT-31 — antes ~~`periodYear`, `periodMonth`~~ | — |
| `calorificValue` | decimal | [VERIFICAR] | — | — |
| `pressureFactor` | decimal | [VERIFICAR] | — | — |
| `temperatureFactor` | decimal | [VERIFICAR] | — | — |
| `correctionFactor` | decimal | [VERIFICAR] | — | — |
| `source` | enum | [VERIFICAR] | `distributor`, `manual`, `import` | — |
| `normativeRefs[]` | array [VERIFICAR] | [VERIFICAR] | — | — |

### 7.11 `chargeRules` — reglas declarativas (cargos adicionales, beneficios, tributos)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código estable referenciado por fórmulas (`rule('code')`). |
| `name`, `description` | string | Sí | — |
| `ruleKind` | enum | Sí | `charge`, `discount`, `benefit`, `subsidy`, `surcharge`, `tax`, `informative`, `promotion_effect`. |
| `phase` | enum | Sí | `service` (por servicio/categoría) o `invoice` (por comprobante). |
| `priority` | int | Sí | Orden de evaluación dentro de la fase; empates prohibidos entre reglas compatibles del mismo ámbito. |
| `scope` | object | Sí | `serviceIds[]`, `categoryIds[]`, `planIds[]`, `benefitGroupIds[]`, `contractIds[]`, `subsidyRegimeIds[]`, `invoiceTypeIds[]`. |
| `conditions` | object | No | Condición declarativa (árbol AND/OR de predicados) y/o `conditionFormula` (GFL booleano). |
| `base` | object | Sí | `kind` (`fixed_charge`, `quantity`, `component`, `subtotal`, `rule`, `explicit`), `componentKinds[]`, `ruleCodes[]`, `baseMode` (`cascade`, `original`). |
| `action` | object | Sí | `operation` (`fixed_amount`, `percent`, `scale`, `block`, `minimum`, `maximum`, `threshold`, `formula`), `quantityFormula`, `unitFormula`, `valueFormula`, `taxBaseFormula`, `scale[]`. |
| `sign` | enum | Sí | `add`, `subtract`. |
| `conceptId` | uniqueidentifier | Sí | Concepto del renglón. |
| `taxRef` | object | Cond. | Para `tax`: `fisTaxId` del catálogo de M06 (obligatorio, CTR-TAR-04). |
| `compatibility` | object | No | `stackable`, `exclusiveWith[]`, `capAmount`, `capPercent`, `conflictPolicy` (`priority`, `review`). |
| `applyOnce` | object | No | `perPeriod`, `perContract`, `untilDate` (ex `APLICA_UNA_VEZ`, CTR-TAR-10). |
| `funding` | enum | Cond. | Para beneficios: `cooperative`, `public_subsidy`, `recoverable_compensation` (RN-TAR-206). |
| `visibility` | object | Sí | `showOnInvoice`, `showInPortal`, `labelKey`. |
| `compiled` | object | Sí | AST serializado, dependencias (`ruleCodes[]`, `functions[]`, `variables[]`), `astHash`. |
| `legacy` | object | No | `cargoCode` (`CARGOS_ADICIONALES.COD_CAR`), `originalFormula` (texto ProCoop solo para auditoría de traducción), `translationStatus` (`auto`, `reviewed`, `manual`, `failed`). |
| `formulaJustification` | object | Cond. | Obligatorio para enviar a aprobación si la regla usa fórmula (RN-TAR-252; DEC-105): `usesFormula` (boolean derivado al guardar), `kind` (`declarative_insufficient`, `migrated_pending_review`), `text` (por qué no alcanza una regla declarativa; fijo para `migrated_pending_review`), `justifiedBy`, `justifiedAt`, `needsReview` (boolean, `true` si la fórmula cambió después de justificarla). |
| `version`, `status`, `validFrom/validTo`, `approvals[]`, `normativeRefs[]` | — | Sí | Versionado. |

Índices `{tenantId, code, version}` único; `{tenantId, phase, status, validFrom, priority}`; `{tenantId, 'scope.serviceIds', status}`. Mapeo: `CARGOS_ADICIONALES`, `HIS_CARGOS_ADICIONALES` (reglas con fórmula); `RECARGOS` (recargos/descuentos por servicio, categoría, ocupación, zona y rango de consumo → reglas `surcharge`/`discount` con condición declarativa); `DESCPOS` (descuentos por servicio y categoría con prioridad → `priority`); `PROD_SER_REC_DES` (recargos/descuentos automáticos por producto según tipo de titular, comprobantes, cantidad límite, días de deuda y forma de pago → reglas de fase comprobante); ~~`CON_TASAS` (conceptos y tasas aplicadas → reglas `tax` vinculadas a M06)~~ reemplazado: `CON_TASAS` es un concepto de compra con tasa y columna del libro de compras y va a `purchaseConcepts` de M12 (T05 COL-CMP-05, T07 §19.2, HUECO-TAS-03; ninguna regla de facturación la lee); `IMPUESTO`, `HIS_IMPUESTO` (tributos de porcentaje o importe fijo con `APLICA_UNA_VEZ`, `GRUPO_CERO`, orden en factura → catálogo de tributos de M06 + regla `tax`). `REFEREN` (referencias de ubicación, M01) es dato leído en condiciones.

### 7.12 `formulaFunctions` — catálogo de funciones GFL

Campos: `name` (ej. `consumption`, `fixedChargeOf`, `subsidyPrice`), `aliases[]` (nombres legacy), `kind` (`native`, `declarative`), `signature` (`params[]` con tipo, `returns`), `descriptionKey`, `examples[]`, `deterministic` (bool, siempre true), `costWeight` (para el límite de nodos/tiempo), `declarativeSpec` (para funciones declarativas: fuente `context`, `query` sobre datos permitidos del contexto, agregación), `availableSince`, `deprecated`. Tenant `PLATFORM` para nativas; tenants pueden definir declarativas con aprobación (PA-TAR-11). Índice `{tenantId, name}` único. Mapeo: funciones registradas de `frmEditorFormulas` y procedimientos almacenados invocados por fórmulas (RN-01 §12.7).

Campos de `formulaFunctions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | Sí | Ej. `consumption`, `fixedChargeOf`, `subsidyPrice` | — |
| `aliases[]` | array [VERIFICAR] | [VERIFICAR] | Nombres legacy | — |
| `kind` | enum | [VERIFICAR] | `native`, `declarative` | — |
| `signature` | [VERIFICAR] | [VERIFICAR] | `params[]` con tipo, `returns` | — |
| `descriptionKey` | string | [VERIFICAR] | — | — |
| `examples[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `deterministic` | [VERIFICAR] | [VERIFICAR] | Bool, siempre true | — |
| `costWeight` | [VERIFICAR] | [VERIFICAR] | Para el límite de nodos/tiempo | — |
| `declarativeSpec` | [VERIFICAR] | [VERIFICAR] | Para funciones declarativas: fuente `context`, `query` sobre datos permitidos del contexto, agregación | — |
| `availableSince` | [VERIFICAR] | [VERIFICAR] | — | — |
| `deprecated` | [VERIFICAR] | [VERIFICAR] | — | — |

### 7.13 `benefitGroups` y `benefitGroupMembers`

`benefitGroups`: `code`, `name`, `kind` (`explicit`, `criteria`), `criteria` (predicado declarativo aprobado), `scopeLevel` (`supply`, `person`, `account`), `validFrom/validTo`, `status`. `benefitGroupMembers`: `groupId`, `contractId`/`personId`/`accountId` (suministro; CTR-DAT-30 — antes también ~~`supplyId`~~), `validFrom`, `validTo`, `reason`, `evidenceDocIds[]`, `source` (`manual`, `roll`, `criteria`), `addedBy`, `removedBy`. Historial inmutable (alta y baja son registros). Índices `{tenantId, groupId, contractId, validFrom}`; `{tenantId, personId}`. Sin tabla equivalente en ProCoop (los grupos se simulan con categorías y condiciones de fórmula). `GRP_CAT` (M02) puede usarse como criterio. **No se migra `BENSOC` a `benefitGroupMembers`** (DEC-086): los beneficiarios de cobertura van solo a `serviceBeneficiaries` de M18; coincide con CTR-DAT-27 de T05.

**`benefitGroupMembers`** — tabla de campos.

Campos de `benefitGroupMembers` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `groupId` | uniqueidentifier | Sí | — | `benefitGroups` (M04) |
| `contractId` | uniqueidentifier | Sí | `personId`/`accountId` (suministro; CTR-DAT-30 — antes también ~~`supplyId`~~) | `serviceContracts` (M02) |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `evidenceDocIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `documents` (T11) |
| `source` | enum | [VERIFICAR] | `manual`, `roll`, `criteria` | — |
| `addedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `removedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |

**`benefitGroups`** — tabla de campos.

Campos de `benefitGroups` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | `explicit`, `criteria` | — |
| `criteria` | [VERIFICAR] | [VERIFICAR] | Predicado declarativo aprobado | — |
| `scopeLevel` | enum | [VERIFICAR] | `supply`, `person`, `account` | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `status` | enum | Sí | — | — |

### 7.14 `subsidyRegimes`, `subsidyRollImports`, `subsidyEnrollments`

`subsidyRegimes`: `code`, `name`, `authority`, `jurisdiction`, `serviceIds[]`, `componentKinds[]` (sobre qué componente aplica: energía, cargo fijo, bloque de consumo), `blockLimit` (cantidad subsidiada), `benefitRuleCode` (regla de beneficio), `fundingSource` (`public_subsidy`), `normativeRefs[]`, `version`, `status`, `validFrom/validTo`.

Campos de `subsidyRegimes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `authority` | [VERIFICAR] | [VERIFICAR] | — | — |
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `componentKinds[]` | array [VERIFICAR] | [VERIFICAR] | Sobre qué componente aplica: energía, cargo fijo, bloque de consumo | — |
| `blockLimit` | [VERIFICAR] | [VERIFICAR] | Cantidad subsidiada | — |
| `benefitRuleCode` | string | [VERIFICAR] | Regla de beneficio | — |
| `fundingSource` | [VERIFICAR] | [VERIFICAR] | `public_subsidy` | — |
| `normativeRefs[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `version` | int | Sí | — | — |
| `status` | enum | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

`subsidyRollImports`: `regimeId`, `storedFileId` (antes `fileDocId`; nombre de T05) (almacenamiento privado), `period`, `rowsTotal`, `rowsMatched`, `rowsUnmatched`, `rowsConflict`, `matchKeys` (`dni`, `cuit`, `supplyCode`, `nis`), `status` (`uploaded`, `validating`, `validated`, `confirmed`, `rejected`, `failed`), `diffSummary` (altas, bajas, cambios), `confirmedBy`, `errors[]`.

**`subsidyRollImports`** — tabla de campos.

Campos de `subsidyRollImports` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `regimeId` | uniqueidentifier | Sí | — | `subsidyRegimes` (M04) |
| `storedFileId` | uniqueidentifier | Sí | (antes `fileDocId`; nombre de T05) (almacenamiento privado) | `storedFiles` (T01) |
| `period` | string | Sí | — | — |
| `rowsTotal` | decimal | [VERIFICAR] | — | — |
| `rowsMatched` | [VERIFICAR] | [VERIFICAR] | — | — |
| `rowsUnmatched` | [VERIFICAR] | [VERIFICAR] | — | — |
| `rowsConflict` | [VERIFICAR] | [VERIFICAR] | — | — |
| `matchKeys` | enum | [VERIFICAR] | `dni`, `cuit`, `supplyCode`, `nis` | — |
| `status` | enum | Sí | `uploaded`, `validating`, `validated`, `confirmed`, `rejected`, `failed` | — |
| `diffSummary` | [VERIFICAR] | [VERIFICAR] | Altas, bajas, cambios | — |
| `confirmedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `fileHash` | string | Sí | Hash del archivo; único con `regimeId` y `period` (T05). | — |

`subsidyEnrollments`: `regimeId`, `contractId`/`accountId` (CTR-DAT-30 — antes ~~`supplyId`~~), `personId`, `level` (ej. nivel de segmentación), `validFrom/validTo`, `source` (`roll`, `manual`, `request`), `rollImportId`, `evidenceDocIds[]`, `status` (`active`, `suspended`, `ended`), `consumptionCap` (tope de consumo subsidiado). Índices `{tenantId, regimeId, contractId, validFrom}`; `{tenantId, personId, regimeId}`. Mapeo: datos de tarifa social/segmentación importados por `frmTarifaSocial_*`, `frmSegmentacion_Restablecer` (columnas en contratos de ProCoop).

**`subsidyEnrollments`** — tabla de campos.

Campos de `subsidyEnrollments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `regimeId` | uniqueidentifier | Sí | — | `subsidyRegimes` (M04) |
| `contractId` | uniqueidentifier | Sí | `accountId` (CTR-DAT-30 — antes ~~`supplyId`~~) | `serviceContracts` (M02) |
| `personId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `level` | [VERIFICAR] | [VERIFICAR] | Ej. nivel de segmentación | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `source` | enum | [VERIFICAR] | `roll`, `manual`, `request` | — |
| `rollImportId` | uniqueidentifier | [VERIFICAR] | — | `subsidyRollImports` (M04) |
| `evidenceDocIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `documents` (T11) |
| `status` | enum | Sí | `active`, `suspended`, `ended` | — |
| `consumptionCap` | [VERIFICAR] | [VERIFICAR] | Tope de consumo subsidiado | — |

### 7.15 `promotions` y `promotionAssignments`

`promotions`: `code`, `name`, `serviceIds[]`, `planIds[]`, `effect` (`percent`, `fixed_amount`, `price_override`, `free_cycles`), `value`, `baseKinds[]` (abono, instalación…), `durationCycles`, `partialCycleConsumes` (bool; default PRM-TAR-016), `onPlanChange` (`end`, `transfer_if_eligible`, `keep_until_cycle_end`), `stackable`, `eligibility` (predicado: altas nuevas, canal, zona), `validFrom/validTo` (ventana de adhesión), `conceptId`, `funding` (`cooperative`), `version`, `status`.

Campos de `promotions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `planIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `effect` | enum | [VERIFICAR] | `percent`, `fixed_amount`, `price_override`, `free_cycles` | — |
| `value` | decimal | [VERIFICAR] | — | — |
| `baseKinds[]` | array [VERIFICAR] | [VERIFICAR] | Abono, instalación… | — |
| `durationCycles` | [VERIFICAR] | [VERIFICAR] | — | — |
| `partialCycleConsumes` | [VERIFICAR] | [VERIFICAR] | Bool; default PRM-TAR-016 | — |
| `onPlanChange` | enum | [VERIFICAR] | `end`, `transfer_if_eligible`, `keep_until_cycle_end` | — |
| `stackable` | [VERIFICAR] | [VERIFICAR] | — | — |
| `eligibility` | [VERIFICAR] | [VERIFICAR] | Predicado: altas nuevas, canal, zona | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | Ventana de adhesión | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `funding` | [VERIFICAR] | [VERIFICAR] | `cooperative` | — |
| `version` | int | Sí | — | — |
| `status` | enum | Sí | — | — |

`promotionAssignments`: `promotionId`, `promotionVersion`, `contractId`, `assignedAt`, `startDate`, `cyclesTotal`, `cyclesConsumed`, `consumedInvoiceIds[]`, `status` (`pending`, `active`, `exhausted`, `ended`, `cancelled`), `endReason`, `noticeSentAt`. Índice `{tenantId, contractId, status}`; `{tenantId, promotionId, status}`. Sin equivalente directo en ProCoop (se resolvía con primer abono bonificado y cargos con vigencia).

**`promotionAssignments`** — tabla de campos.

Campos de `promotionAssignments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `promotionId` | uniqueidentifier | Sí | — | `promotions` (M04) |
| `promotionVersion` | int | [VERIFICAR] | — | — |
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `assignedAt` | datetime | [VERIFICAR] | — | — |
| `startDate` | date | [VERIFICAR] | — | — |
| `cyclesTotal` | decimal | [VERIFICAR] | — | — |
| `cyclesConsumed` | [VERIFICAR] | [VERIFICAR] | — | — |
| `consumedInvoiceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `status` | enum | Sí | `pending`, `active`, `exhausted`, `ended`, `cancelled` | — |
| `endReason` | string | [VERIFICAR] | — | — |
| `noticeSentAt` | datetime | [VERIFICAR] | — | — |

### 7.16 `worksInstallmentPlans` — cuotas de obra (tipo 17)

Campos: `contractId`, `workCode`, `totalAmount`, `installments`, `installmentAmount`, `startPeriod`, `billedInstallments`, `conceptId`, `indexation` (opcional), `status`. Mapeo: servicios de tipo 17 y sus datos por contrato (RN-01 §7).

Campos adicionales (HUECO-OBR-01, HUECO-OBR-05, HUECO-CEM-01): `planKind` (`works`, `right_acquisition`), `workId` (obra de M09; nulo para `right_acquisition`), `premiseId` (inmueble beneficiario, `premises` de M01; T05 §7.2 — antes ~~`propertyId`~~), `rightId` (derecho de M18, para `right_acquisition`; → `burialRights` (M18, COL-SOC-22), PA-DAT-04), `levyEventId` (id del evento EVT-TEC-25 que lo creó; no es referencia a una colección: es el `eventId` del sobre del evento, usado para idempotencia), `unitsPerInstallment`, `totalUnits`, `billedUnits`, `unitKind` (`meters`, `amount`), `billedAmount`, `balanceAmount` (derivado), `lastInvoiceId`. `status`: `pendingContract` (beneficiario sin contrato tipo 17 todavía), `active`, `exhausted`, `cancelled`. Índices `{tenantId, workId, premiseId}` único cuando `planKind = works` (idempotencia de RF-TAR-116); `{tenantId, contractId, status}`. Esta colección es la única fuente del plan (RN-TAR-071; HUECO-OBR-05): `SERSOC_EXTRAS.CNT_*` se migra aquí y no a `serviceContracts.extras`. `CONCESIO` (concesiones) es de M02 y se usa como ámbito (`scope.jurisdiction`) de cuadros.

Campos de `worksInstallmentPlans` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `workCode` | string | Sí | — | — |
| `totalAmount` | decimal | [VERIFICAR] | — | — |
| `installments` | [VERIFICAR] | [VERIFICAR] | — | — |
| `installmentAmount` | decimal | [VERIFICAR] | — | — |
| `startPeriod` | string | [VERIFICAR] | — | — |
| `billedInstallments` | [VERIFICAR] | [VERIFICAR] | — | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `indexation` | [VERIFICAR] | [VERIFICAR] | Opcional | — |
| `status` | enum | Sí | — | — |

### 7.17 `roundingPolicies` y `roundingCarryEntries`

`roundingPolicies`: `scope` (`global`, `invoiceType`), `voucherTypeId` (antes `invoiceTypeId`; nombre de T05), `itemDecimals`, `totalMode` (`none`, `type_policy`, `global`), `roundingType` (1 decimales, 2 arrastre, 3 pares), `decimals` (−100, −50, −20, −10, −5, 0, 1, 2), `carryScope` (`account`, `account_invoice_type`), `skipWhenIssueEqualsFirstDue` (PA-TAR-07), `conceptIds` (`rounding`, `previousRounding`), `version`, `status`, `validFrom`. Mapeo: campos `REDONDEAR`, `REDONDEO_ITEMS` y `COD_TPFC_REDONDEO` de `TIPO_FAC` (el tipo de comprobante es de M05), V2 #742, #2095–#2097. `TIPOLOTE` (tipos de lote) es de ~~M05~~ M13 (`lotTypes`; CTR-DAT-46).

Campos de `roundingPolicies` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scope` | enum | Sí | `global`, `invoiceType` | — |
| `voucherTypeId` | uniqueidentifier | Sí | Antes `invoiceTypeId`; nombre de T05 | `voucherTypes` (M05) |
| `itemDecimals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `totalMode` | enum | [VERIFICAR] | `none`, `type_policy`, `global` | — |
| `roundingType` | [VERIFICAR] | [VERIFICAR] | 1 decimales, 2 arrastre, 3 pares | — |
| `decimals` | [VERIFICAR] | [VERIFICAR] | −100, −50, −20, −10, −5, 0, 1, 2 | — |
| `carryScope` | enum | [VERIFICAR] | `account`, `account_invoice_type` | — |
| `skipWhenIssueEqualsFirstDue` | [VERIFICAR] | [VERIFICAR] | PA-TAR-07 | — |
| `conceptIds` | uniqueidentifier[] | [VERIFICAR] | `rounding`, `previousRounding` | [VERIFICAR] destino no declarado |
| `version` | int | Sí | — | — |
| `status` | enum | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |

`roundingCarryEntries` (proyección auxiliar; la fuente de saldo es M07 según AGR-011 y PA-TAR-06): `accountId`, `voucherTypeId`, `invoiceId`, `amount` (+/−), `balanceAfter`, `calculationId`, `status` (`proposed`, `confirmed`, `reversed`). Mapeo: ~~`DEUDARED`, `DEUDARED_TIPO`~~ **Reemplazado por** `agencyPublishedDebts` de M07 (CTR-DAT-42 de T05): M04 no migra `DEUDARED`; el saldo de arrastre inicial lo carga M07 y esta proyección nace vacía. [VERIFICAR] en LAG: RN-01 §15 relaciona `DEUDARED`/`DEUDARED_TIPO` con el saldo de redondeo, mientras T05 la clasifica como deuda publicada a la red; si en LAG resulta ser el saldo de redondeo, T05 debe revisar CTR-DAT-42.

**`roundingCarryEntries`** — tabla de campos.

Campos de `roundingCarryEntries` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `voucherTypeId` | uniqueidentifier | [VERIFICAR] | — | `voucherTypes` (M05) |
| `invoiceId` | uniqueidentifier | Sí | — | `invoices` (M05) |
| `amount` | decimal | [VERIFICAR] | +/− | — |
| `balanceAfter` | [VERIFICAR] | [VERIFICAR] | — | — |
| `calculationId` | uniqueidentifier | [VERIFICAR] | — | `calculations` (M04) |
| `status` | enum | Sí | `proposed`, `confirmed`, `reversed` | — |

### 7.18 Telefonía: `phoneRatePlans`, `phoneTimeBands`, `phoneBandAssignments`, `phoneRates`, `phoneDiscountPlans`, `phoneFreeNumbers`

- `phoneRatePlans`: `code`, `name`, `serviceId`, `prepaid`, `minimumCharge`, `fractionRules` (fracción inicial y siguientes en segundos), `version`, `status`, `validFrom`.

Campos de `phoneRatePlans` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `prepaid` | [VERIFICAR] | [VERIFICAR] | — | — |
| `minimumCharge` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fractionRules` | [VERIFICAR] | [VERIFICAR] | Fracción inicial y siguientes en segundos | — |
| `version` | int | Sí | — | — |
| `status` | enum | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
- `phoneTimeBands`: `code`, `name`, `segments[]` (`dayOfWeek` 1–7, `holiday` bool, `from`, `to`). Mapeo `TiempoBandas`.

**`phoneTimeBands`** — tabla de campos.

Campos de `phoneTimeBands` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `segments[]` | array [VERIFICAR] | [VERIFICAR] | `dayOfWeek` 1–7, `holiday` bool, `from`, `to` | — |
- `phoneBandAssignments`: `ratePlanId`, `bandId`, `callTypeCode` (opcional, con fallback sin tipo), `bandTypeCode`. Mapeo `TiempoTipoBandas`.

**`phoneBandAssignments`** — tabla de campos.

Campos de `phoneBandAssignments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ratePlanId` | uniqueidentifier | Sí | — | `phoneRatePlans` (M04) |
| `bandId` | uniqueidentifier | Sí | — | `phoneTimeBands` (M04) |
| `callTypeCode` | string | Sí | Opcional, con fallback sin tipo | — |
| `bandTypeCode` | string | Sí | — | — |
- `phoneRates`: `ratePlanId`, `destinationKey` (clave del plan de numeración M10), `callTypeCode`, `bandTypeCode`, `pricePerFraction`, `initialFractionSeconds`, `nextFractionSeconds`, `setupCharge`, `currency`, `validFrom`. Mapeo clase `Tasacion`. Es la referencia de tasación de `callRecords` de M10 junto con `phoneRatePlans` (CTR-DAT-70 de T05: `callRatings` no existe).

**`phoneRates`** — tabla de campos.

Campos de `phoneRates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ratePlanId` | uniqueidentifier | Sí | — | `phoneRatePlans` (M04) |
| `destinationKey` | string | Sí | Clave del plan de numeración M10 | — |
| `callTypeCode` | string | Sí | — | — |
| `bandTypeCode` | string | Sí | — | — |
| `pricePerFraction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `initialFractionSeconds` | [VERIFICAR] | [VERIFICAR] | — | — |
| `nextFractionSeconds` | [VERIFICAR] | [VERIFICAR] | — | — |
| `setupCharge` | [VERIFICAR] | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | Sí | — | — |
- `phoneDiscountPlans`: `code`, `kind` (`percent`, `free_minutes`, `free_amount`), `value`, `appliesTo` (claves/tipos), `validFrom`. Mapeo `TipoPlanDescuento`.

**`phoneDiscountPlans`** — tabla de campos.

Campos de `phoneDiscountPlans` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `kind` | enum | [VERIFICAR] | `percent`, `free_minutes`, `free_amount` | — |
| `value` | decimal | [VERIFICAR] | — | — |
| `appliesTo` | date | [VERIFICAR] | Claves/tipos | — |
| `validFrom` | date | [VERIFICAR] | — | — |
- `phoneFreeNumbers`: `number` o `prefix`, `reason`, `validFrom/validTo`. Mapeo números gratuitos de `clsLlamadas`.

**`phoneFreeNumbers`** — tabla de campos.

Campos de `phoneFreeNumbers` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int | Sí | — | — |
| `prefix` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

Índices `{tenantId, ratePlanId, destinationKey, callTypeCode, bandTypeCode, validFrom}`. Las llamadas (CDR) y el plan de numeración son de M10; el importe tasado se escribe en la llamada por servicio de M10 con traza de TAR (`ratingTrace`).

### 7.19 `calculationRuns` y `calculations` — ejecuciones y resultados de cálculo

`calculationRuns`: `kind` (`billing_batch`, `single`, `simulation`, `retroactive`, `rerating`), `requestedBy` (módulo/usuario), `billingRunId` (antes `batchId`; nombre de T05) (M05), `period`, `referenceDate`, `filters`, `scheduleVersionsUsed[]`, `ruleVersionsUsed[]`, `accountsTotal`, `accountsOk`, `accountsExcluded`, `errorThreshold` (PRM-TAR-113), `status` (`queued`, `running`, `completed`, `completed_with_exclusions`, `aborted`, `cancelled`), `startedAt`, `finishedAt`, `jobId`.

Campos de `calculationRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | `billing_batch`, `single`, `simulation`, `retroactive`, `rerating` | — |
| `requestedBy` | [VERIFICAR] | [VERIFICAR] | Módulo/usuario | `memberships` (T02) |
| `billingRunId` | uniqueidentifier | Sí | (antes `batchId`; nombre de T05) (M05) | `billingRuns` (M05) |
| `period` | string | [VERIFICAR] | — | — |
| `referenceDate` | date | [VERIFICAR] | — | — |
| `filters` | [VERIFICAR] | [VERIFICAR] | — | — |
| `scheduleVersionsUsed[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `ruleVersionsUsed[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `accountsTotal` | decimal | [VERIFICAR] | — | — |
| `accountsOk` | [VERIFICAR] | [VERIFICAR] | — | — |
| `accountsExcluded` | [VERIFICAR] | [VERIFICAR] | — | — |
| `errorThreshold` | [VERIFICAR] | [VERIFICAR] | PRM-TAR-113 | — |
| `status` | enum | Sí | `queued`, `running`, `completed`, `completed_with_exclusions`, `failed`, `aborted`, `cancelled` (`failed` agregado el 05-11-2026 para alinear con §8.6) | — |
| `startedAt` | datetime | [VERIFICAR] | — | — |
| `finishedAt` | datetime | [VERIFICAR] | — | — |
| `jobId` | uniqueidentifier | Sí | — | `jobRuns` (T01) |

**`calculations`** (una por cuenta/comprobante propuesto):

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `calculationRunId`, `accountId`, `contractIds[]`, `voucherTypeId` | uniqueidentifier | Sí | Contexto. Antes `runId` (nombre de T05). |
| `period`, `sequence`, `referenceDate` | — | Sí | Período/secuencia y fecha de referencia tarifaria. |
| `inputSnapshot` | object | Sí | Instantánea de entradas (consumos, contratos, categorías, padrones, saldos consultados), comprimida. |
| `inputHash`, `resultHash` | string | Sí | SHA-256 canónicos (reproducibilidad). |
| `engineVersion` | string | Sí | Versión del motor. |
| `lines[]` | array | Sí | Renglones: `seq`, `kind` (`fixed_charge`, `minimum`, `energy`, `demand_peak`, `demand_offpeak`, `demand_valley`, `demand_acquired`, `demand_corrected`, `demand_excess`, `power_factor`, `rule_charge`, `tariff_component`, `postal`, `advance`, `rounding`, `previous_rounding`, `injected_credit`, `adherent`, `phone`, `product`, `housing`, `works_installment`, `event_charge`, `promotion`, `subsidy`), `conceptId`, `contractId`, `categoryId`, `quantity`, `unitPrice`, `unitDiscount`, `net`, `currency`, `fxRate`, `taxRateRefs`, `sign`, `trace`. |
| `lines[].trace` | object | Sí | `scheduleId`+`version`, `rowId`/`rowKey`, `ruleCode`+`version`, `step` (P00–P21), `base` (importe/cantidad base), `tier` (`stepMin`, `stepMax`), `fraction` (prorrateo), `days`, `formulaAstHash`, `variables` (valores usados), `sources[]` (IDs de consumos, padrones, inscripciones, promociones), `explanationKey` + `explanationParams`. |
| `taxRequest`, `taxResult` | object | Sí | Entrada/salida de `fis.service.calculateTaxes` (antes `fis.calculateTaxes`) (M06). |
| `totals` | object | Sí | `net`, `vat1`, `vat2`, `vatPerception`, `iibb`, `otherTaxes`, `total`, `sign`. |
| `proposedEffects[]` | array | Sí | Efectos diferidos: `type` (`promotion_consume`, `rounding_carry`, `advance_apply`, `fixed_charge_mark`, `postal_mark`, `contracted_demand_update`, `category_change`, `first_fee_consumed`, `injected_credit_account`), `payload`, `targetModule`, `status` (`proposed`, `confirmed`, `discarded`). |
| `warnings[]`, `errors[]` | array | No | Códigos `TAR-W-*`/`TAR-E-*` con contexto. |
| `status` | enum | Sí | `draft`, `observed`, `approved`, `issued`, `discarded` (sección 8.5). |
| `invoiceId` | uniqueidentifier | No | Comprobante emitido (al confirmar). |
| `requiresReview` | bool | No | Grandes usuarios sobre umbral PRM-TAR-014, diferencias de paralelo. |

Índices: `{tenantId, calculationRunId, accountId}` único; `{tenantId, accountId, period, sequence}`; `{tenantId, invoiceId}`; `{tenantId, status, calculationRunId}`. Retención: los cálculos `issued` se conservan con el comprobante (inmutables); los `draft`/`discarded` de simulación se purgan según PRM-TAR-151. Mapeo: tablas temporales de facturación de ProCoop y detalle de comprobantes de M05 (ProCoop no guarda traza de cálculo).

### 7.20 `simulationRuns` y `simulationResults`

`simulationRuns`: `kind` (`single`, `sample`, `full`), `baseline` (`current_versions` o `scheduleIds[]` + `ruleIds[]`), `candidate` (`scheduleIds[]`, `ruleIds[]`, `promotionIds[]`, overrides), `universe` (filtros: servicios, categorías, zonas, grupos, períodos, muestra N o %), `period`, `referenceDate`, `consumptionSource` (`actual_period`, `historic_period`, `manual_quantity`), `status` (`queued`, `running`, `completed`, `failed`, `cancelled`), `summary` (totales base/candidato, variación %, por servicio/categoría/grupo/concepto, percentiles, cuentas con variación > umbral), `linkedScheduleId`, `requestedBy`, `expiresAt`.

Campos de `simulationRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | `single`, `sample`, `full` | — |
| `baseline` | [VERIFICAR] | [VERIFICAR] | `current_versions` o `scheduleIds[]` + `ruleIds[]` | — |
| `candidate` | [VERIFICAR] | [VERIFICAR] | `scheduleIds[]`, `ruleIds[]`, `promotionIds[]`, overrides | — |
| `universe` | [VERIFICAR] | [VERIFICAR] | Filtros: servicios, categorías, zonas, grupos, períodos, muestra N o % | — |
| `period` | string | [VERIFICAR] | — | — |
| `referenceDate` | date | [VERIFICAR] | — | — |
| `consumptionSource` | enum | [VERIFICAR] | `actual_period`, `historic_period`, `manual_quantity` | — |
| `status` | enum | Sí | `queued`, `running`, `completed`, `failed`, `cancelled` | — |
| `summary` | [VERIFICAR] | [VERIFICAR] | Totales base/candidato, variación %, por servicio/categoría/grupo/concepto, percentiles, cuentas con variación > umbral | — |
| `linkedScheduleId` | uniqueidentifier | Sí | — | `tariffSchedules` (M04) |
| `requestedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `expiresAt` | datetime | [VERIFICAR] | — | — |

`simulationResults`: `simulationRunId`, `accountId`, `contractId`, `categoryId`, `baselineTotals`, `candidateTotals`, `diffAmount`, `diffPercent` (regla del informe 15.2), `baselineLines[]`, `candidateLines[]` (con traza), `errors[]`. Índices `{tenantId, simulationRunId, accountId}`; `{tenantId, simulationRunId, diffPercent}`.

**`simulationResults`** — tabla de campos.

Campos de `simulationResults` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `simulationRunId` | uniqueidentifier | Sí | — | `simulationRuns` (M04) |
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `contractId` | uniqueidentifier | [VERIFICAR] | — | `serviceContracts` (M02) |
| `categoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `baselineTotals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `candidateTotals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `diffAmount` | decimal | [VERIFICAR] | — | — |
| `diffPercent` | [VERIFICAR] | [VERIFICAR] | Regla del informe 15.2 | — |
| `baselineLines[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `candidateLines[]` | array [VERIFICAR] | [VERIFICAR] | Con traza | — |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |

### 7.21 `retroactiveDiffRuns`

Campos: `scheduleId`/`ruleIds[]` (cambio con vigencia pasada), `periodFrom`, `periodTo`, `universe`, `status` (`queued`, `running`, `computed`, `approved`, `rejected`, `adjustments_requested`, `failed`), `results` (por comprobante emitido: `invoiceId`, `originalTotal`, `recalculatedTotal`, `diff`, `lines[]`), `approval` (doble firma), `adjustmentRequestIds[]` (pedidos a M05 de NC/ND), `normativeRefs[]`. Índice `{tenantId, status, createdAt}`.

Campos de `retroactiveDiffRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scheduleId` | uniqueidentifier | [VERIFICAR] | `ruleIds[]` (cambio con vigencia pasada) | `tariffSchedules` (M04; T05 §7.2 admite `scheduleId` dentro de M04) |
| `periodFrom` | date | [VERIFICAR] | — | — |
| `periodTo` | date | [VERIFICAR] | — | — |
| `universe` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `queued`, `running`, `computed`, `approved`, `rejected`, `adjustments_requested`, `failed` | — |
| `results` | [VERIFICAR] | [VERIFICAR] | Por comprobante emitido: `invoiceId`, `originalTotal`, `recalculatedTotal`, `diff`, `lines[]` | — |
| `approval` | [VERIFICAR] | [VERIFICAR] | Doble firma | — |
| `adjustmentRequestIds[]` | uniqueidentifier[] | No (antes [VERIFICAR]) | Pedidos a M05 de NC/ND | `invoiceAnnulmentRequests` (M05, modos `partialCredit` y `debitAdjustment`; PA-FAC-22); antes «pedido de ajuste de M05 (NC/ND)» (PA-TAR-20) y [VERIFICAR] |
| `normativeRefs[]` | array [VERIFICAR] | [VERIFICAR] | — | — |

### 7.22 `normativeDocuments`

Campos: `title`, `kind` (`resolution`, `ordinance`, `assembly_act`, `board_minute`, `contract`, `regulator_schedule`, `other`), `authority`, `number`, `date`, `publishedIn`, `jurisdiction`, `storedFileId` (PDF en almacenamiento privado, URL firmada), `summary`, `linkedEntities[]` (`collection`, `id`, `version`). Índice `{tenantId, kind, date}`; `{tenantId, 'linkedEntities.id'}`.

Campos de `normativeDocuments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `title` | string | [VERIFICAR] | — | — |
| `kind` | enum | Sí | `resolution`, `ordinance`, `assembly_act`, `board_minute`, `contract`, `regulator_schedule`, `other` | — |
| `authority` | [VERIFICAR] | Sí | — | — |
| `number` | int | Sí | — | — |
| `date` | date | [VERIFICAR] | — | — |
| `publishedIn` | [VERIFICAR] | [VERIFICAR] | — | — |
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `storedFileId` | uniqueidentifier | Sí | PDF en almacenamiento privado, URL firmada | `storedFiles` (T01) |
| `summary` | [VERIFICAR] | [VERIFICAR] | — | — |
| `linkedEntities[]` | array [VERIFICAR] | [VERIFICAR] | `collection`, `id`, `version` | — |

### 7.23 Datos que TAR **lee** de otros módulos (no es dueño)

| Dato | Dueño | Uso en TAR |
|---|---|---|
| Servicios, categorías, planes, productos, conceptos, relación servicio–categoría | M02 | Resolución de cuadro, cascada de alícuotas, conceptos. Jerarquía servicio → producto (subservicio) → plan versionado → conceptos facturables (DEC-012): M04 precia conceptos y productos, nunca define el catálogo. Incluye las modalidades de gas (red natural, propano por red, envasado; DEC-030, DEC-082) y los servicios de correo y pack SMS (DEC-084), que M04 precia como abono más exceso de cupo cuando M10/T06 informan el consumo. |
| Cuentas, titulares, inmuebles (TBM, coeficiente zonal, uso, estado), adherentes, situación fiscal | M01 | Contexto, agua por inmueble, adherentes, condiciones de reglas. Adherentes: **Reemplazado por** `serviceDependents` de M18 (CTR-DAT-26; DEC-071, HUECO-TRV-01): M04 los lee por `billing-inputs` de M18 y M01 solo los muestra. |
| Contratos, condición, historia de categoría, fechas de alta/baja/suspensión/activación | M02/M10 | Elegibilidad, proporcionales, categoría histórica. |
| Consumos aprobados, lecturas, medidores, testigos, demanda, inyección | M03 | Cantidades. |
| Llamadas (CDR), plan de numeración, líneas | M10 | Tasación y facturación telefónica. |
| Alícuotas, situaciones, padrones fiscales, catálogo de tributos | M06 | Invocación de cálculo fiscal. |
| Anticipos, saldos de redondeo, cotizaciones | M07/T04 | Anticipos, arrastre, moneda extranjera. Cotizaciones: **Reemplazado por** `exchangeRates` de M14 (CTR-DAT-47; EVT-TES-19); T04 conserva índices y calendario. |
| Cuotas de financiación, intereses, planes | M08 | Renglones valorizados recibidos. |
| Planes de vivienda, adjudicación | M18 | Renglón de vivienda. |
| Precios de vivienda vigentes a la fecha del período y mínimos de aporte (PRM-SOC-018/019) | M18 (`billing-inputs`, API-SOC-006) | Precio y porcentaje del renglón de vivienda (RN-TAR-075; HUECO-VIV-02). |
| Viaje de traslado (km, característica, cubierto, condición de asociado) | M18 (`soc.trip.completed`, EVT-SOC-07) | Cargo por traslado (RN-TAR-249). |
| Acto de cementerio realizado | M18 (`soc.cemeteryAct.performed`, EVT-SOC-06) | Cargo por acto (RN-TAR-248). |
| Asignación de equipo vencida / cargo aprobado | M13 (EVT-STK-07, EVT-STK-08) | Cargo por equipo no devuelto (RN-TAR-246). |
| Obra con contribución aprobada | M09 (`tec.levy.approved`, EVT-TEC-25) | Planes de cuotas de obra (RF-TAR-116). |
| Tipos de comprobante, lotes, vencimientos, calendario de feriados | M05/T04 | Configuración de redondeo, franqueo, vencimientos. Tipos de lote (`TIPOLOTE`): **Reemplazado por** `lotTypes` de M13 (CTR-DAT-46). |
| Importes facturados por el proveedor mayorista por cuenta y período (`FACT_EPEC`) | M12 (compra de energía) | Dato leído por funciones de regla; nunca se traslada automáticamente al usuario (RN-TAR-227). Destino canónico: `supplierInvoices.wholesaleSupply` de M12 (RF-CMP-149; HUE-ELE-01). La colección `energyPurchaseBills` que T07 asigna a M04 queda **Reemplazada por** `supplierInvoices.wholesaleSupply` (M12): M04 no es dueño ni migra `FACT_EPEC`. |
| Beneficiarios de cobertura (`BENSOC`) | M18 (`serviceBeneficiaries`) | **M04 no recibe filas de `BENSOC`** (DEC-086): no son tarifa social ni miembros de grupo tarifario. La tarifa social se resuelve con `subsidyEnrollments` y la categoría social (RN-MIG-054 de T07). |

### 7.24 `preloadedCharges` — cargos extraordinarios precargados (reemplazada por `billableItems` de M05, CTR-DAT-38)

> **Reemplazado por** `billableItems` de M05 (T05 COL-TAR-35 → COL-FAC-11; CTR-DAT-38): M05 es dueño de lo pendiente de facturar. M04 crea y cancela los cargos con `fac.service.upsertBillableItem` (`sourceModule = TAR`, idempotente por `{sourceModule, sourceRef.id}`) y los lee en el cálculo (RN-TAR-007). En este anexo, "`preloadedCharges`" designa esos ítems; `origin` corresponde a `sourceType`, `originRef` a `sourceRef` y `approvedBy` (PRM-TAR-152) se conserva en el ítem. La descripción original se mantiene como referencia.

Propósito: cargos por contrato y período (o sin período) que entran una sola vez en el próximo cálculo (RN-TAR-007, RN-TAR-099): conceptos importados de proveedores de telefonía móvil, cargos manuales autorizados, ajustes de gas prorrateado.

Campos: `contractId`, `accountId`, `serviceId`, `period` (nulo = próximo), `conceptId`, `quantity`, `unitPrice`, `currency`, `origin` (`manual`, `mobile_provider_import`, `gas_proration`, `migration`, `equipment_not_returned`, `social_act`, `social_trip`, `other`), `originRef` (para `equipment_not_returned`: `assignmentId`; para `social_act`: `actId`; para `social_trip`: `tripId`; únicos por tenant y origen), `reason`, `createdBy`, `approvedBy` (si supera PRM-TAR-152), `status` (`pending`, `proposed`, `billed`, `cancelled`), `calculationId`, `invoiceId`. Índice `{tenantId, contractId, status, period}`. Mapeo: `PRCAGAS` (RN-01 §1.2.6 lo usa como cargos extraordinarios precargados; CAT lo describe como "cálculo de consumo de gas prorrateado (días, umbral, PCS)" con comprobantes de origen y destino) — [VERIFICAR] en LAG qué uso tiene cada fila; las filas de gas prorrateado se migran con `origin = gas_proration` y sus datos de cálculo en `originRef`.

### 7.25 `bonusRecalcRuns` — recálculo masivo de bonificaciones de unidades

Propósito: tabla de trabajo del recálculo masivo de bonificación de unidades por consumo y categoría (RF-TAR-111).

Campos: `filters` (servicio, categorías, período de consumo), `rows[]` (`contractId`, `categoryPrevious`, `categoryCurrent`, `consumptionsCount`, `bonusCurrent`, `bonusNew`, `type`, `consumptionPeriod`), `status` (`draft`, `previewed`, `applied`, `discarded`), `appliedBy`, `appliedAt`, `m02ChangeIds[]`. Mapeo: `TEMPMODIFBONIF` (`CONS_BONIF_NUEVA`, `CATEGORIA_PASADA`, `CANTIDAD_TOTAL_CONSUMOS`, `ID_SERSOC`, `COD_CAT`, `TIPO`, `PERIODO_CONSUMO`, `COD_CONS`, `COD_SUM`); INV `frmTempModifBonif`.

Campos de `bonusRecalcRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `filters` | [VERIFICAR] | [VERIFICAR] | Servicio, categorías, período de consumo | — |
| `rows[]` | array [VERIFICAR] | [VERIFICAR] | `contractId`, `categoryPrevious`, `categoryCurrent`, `consumptionsCount`, `bonusCurrent`, `bonusNew`, `type`, `consumptionPeriod` | — |
| `status` | enum | Sí | `draft`, `previewed`, `applied`, `discarded` | — |
| `appliedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `appliedAt` | datetime | [VERIFICAR] | — | — |
| `m02ChangeIds[]` | uniqueidentifier[] | [VERIFICAR] | — | Versión de contrato de M02 con el cambio de categoría, asumida en PA-TAR-20 (DEC-072); antes [VERIFICAR] (posible `bulkContractOperations`) |

## 8. Estados y transiciones

Todas las transiciones registran actor, fecha, motivo y versión anterior/posterior en la auditoría genérica (T02) y emiten evento por outbox (sección 12). Ninguna transición borra datos: la reversión es otra transición o una nueva versión (AGR-003).

### 8.1 `tariffSchedules`, `tariffServiceSettings`, `chargeRules`, `eventCharges`, `productPrices`, `subsidyRegimes`, `promotions`, `roundingPolicies`, `phoneRatePlans` (entidades versionadas)

| Origen | Destino | Actor (capability) | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Analista tarifario (`tar.cuadros.editar` / `tar.reglas.editar` / equivalente) | Copia de una versión, alta en blanco, importación o actualización masiva. | Se asigna `version = última + 1`; se copia contenido por clave (CTR-TAR-28). | Anular borrador (`voided`). |
| `draft` | `draft` | Analista | — | Edición libre; validaciones en línea; recompilación de fórmulas. | — |
| `draft` | `submitted` | Analista (`tar.cuadros.enviar`) | Validaciones completas sin errores (escalones sin solapamiento, fórmulas compiladas, referencias vigentes, conceptos y tributos existentes, origen de beneficios, `normativeRefs[]` si `changeKind` ≠ `presentation` y PRM-TAR-006); simulación vinculada si PRM-TAR-005 lo exige; vigencia sin solapamiento. | `tar.schedule.submitted`; se abre solicitud de autorización en T11 con resumen de diferencias y simulación. | `submitted → draft` por el autor (retirar) mientras no haya firmas. |
| `submitted` | `approved` | Aprobadores (`tar.cuadros.aprobar`) | Dos firmas de usuarios distintos y distintos del autor (tercera si PRM-TAR-004 o importe/universo sobre umbral). | `tar.schedule.approved`. | `approved → draft` solo con nueva versión de borrador (no se edita la aprobada). |
| `submitted` | `rejected` | Aprobador | Motivo obligatorio. | `tar.schedule.rejected`; notifica al autor. | `rejected → draft` (el autor reabre para corregir). |
| `approved` | `scheduled` | Publicador (`tar.cuadros.publicar`) | `validFrom` futura respecto de la fecha de referencia actual. | Contenido sellado (`contentHash`); `tar.schedule.published`. | `scheduled → approved` (despublicar) solo antes de `validFrom` y si ningún cálculo `approved/issued` la usó. |
| `approved` | `active` | Publicador | `validFrom` ≤ hoy (en la zona del tenant). | Cierra la versión anterior (`validTo = validFrom` nueva) y la pasa a `superseded`; `tar.schedule.published` + `tar.schedule.activated`. Si `validFrom` es pasada, dispara simulación de diferencias retroactivas (9.7) si hay comprobantes emitidos en el rango. | No reversible: corregir con nueva versión. |
| `scheduled` | `active` | Sistema (JOB-TAR-01 `tar:activar-versiones`) | Llega `validFrom`. | Igual que la fila anterior. | — |
| `active` | `superseded` | Sistema | Activación de una versión posterior del mismo ámbito. | `validTo` fijado; `tar.schedule.superseded`. | — |
| `active` | `closed` | Publicador (`tar.cuadros.publicar`) | Cierre sin reemplazo (servicio discontinuado). Exige que no queden contratos activos del ámbito o confirmación explícita. | `validTo` fijado; cálculos posteriores dan `TAR-E-SCH-NONE` (CU-06). | Nueva versión. |
| `draft` | `voided` | Autor o supervisor | — | Queda para auditoría. | — |

Las versiones `active`, `superseded` y `closed` son inmutables (RN-TAR-153). El estado de una regla o un cargo se gestiona con el mismo ciclo; cuando pertenecen a un cuadro se publican **junto con** su versión de cuadro (paquete de publicación, AGR-009). Los cambios de solo presentación (`changeKind = presentation`: etiquetas, orden de visualización) pasan `draft → active` con una sola firma (PRM-TAR-007).

### 8.2 `subsidyRollImports`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `uploaded` | Operador de padrones (`tar.padrones.importar`) | Archivo con formato del régimen (ExcelImportWizard). | Archivo en almacenamiento privado. | `cancelled`. |
| `uploaded` | `validating` → `validated` | Sistema (JOB-TAR-04 `tar:importar-padron`) | — | Normaliza claves, cruza con cuentas/personas/suministros, calcula altas/bajas/cambios y conflictos. | — |
| `validating` | `failed` | Sistema | Error de formato o de cruce masivo. | Informe de errores descargable. | Reintento con nuevo archivo. |
| `validated` | `confirmed` | Responsable (`tar.padrones.confirmar`) | Revisión del resumen; conflictos resueltos o excluidos. | Crea/cierra `subsidyEnrollments` con fecha efectiva; `tar.subsidyRoll.imported`, `tar.enrollment.changed`. | Importación inversa (no se borra lo confirmado; se cierra con nueva fecha). |
| `validated` | `rejected` | Responsable | Motivo. | — | — |

### 8.3 `subsidyEnrollments` y `benefitGroupMembers`

`active → suspended` (falta de evidencia, pedido del regulador) → `active`; `active → ended` (baja del padrón, vencimiento, baja del contrato). Toda transición tiene fecha efectiva; la retroactiva exige aprobación (`tar.excepciones.aprobar`) y dispara diferencias retroactivas si afecta comprobantes emitidos.

### 8.4 `promotionAssignments`

| Origen | Destino | Disparador | Efectos |
|---|---|---|---|
| — | `pending` | Contratación con promoción elegible (`cat.contract.activated` aún no recibido) o asignación manual (`tar.promociones.asignar`). | — |
| `pending` | `active` | `cat.contract.activated` / `tec.installation.activationConfirmed` según `promotions.startTrigger`. | `startDate`; `tar.promotion.assigned`. |
| `active` | `active` | `fac.invoice.issued` con efecto `promotion_consume`. | `cyclesConsumed + 1`; `tar.promotion.consumed`. |
| `active` | `exhausted` | `cyclesConsumed = cyclesTotal`. | `tar.promotion.ended` (motivo `exhausted`); aviso al socio (T09) PRM-TAR-013 días antes del último ciclo. |
| `active`/`pending` | `ended` | Cambio de plan (`onPlanChange = end`), baja, fin de ventana. | `tar.promotion.ended`. |
| `active`/`pending` | `cancelled` | Revocación autorizada (`tar.excepciones.aprobar`). | Motivo obligatorio. |
| `exhausted`/`ended` | `active` | Solo si se anula el comprobante que consumió el último ciclo (`fac.invoice.annulled`). | `cyclesConsumed − 1`. |

### 8.5 `calculations`

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `draft` | Motor (pedido de M05, simulador o retroactivo) | — | Persistencia del resultado con traza y `proposedEffects`. |
| `draft` | `observed` | Motor | Advertencias, errores excluyentes, grandes usuarios sobre umbral PRM-TAR-014, diferencia de paralelo. | Queda en bandeja de revisión de M05. |
| `observed` | `approved` | Revisor de facturación (`fac.lotes.aprobar`, M05) | Revisión. | — |
| `draft` | `approved` | M05 | Lote aprobado. | — |
| `approved` | `issued` | M05 (`fac.invoice.issued`) | Emisión del comprobante. | Confirmación de `proposedEffects` en los módulos dueños (idempotente por `calculationId` + `effectSeq`); `tar.calculation.completed`. |
| `draft`/`observed`/`approved` | `discarded` | M05 (lote anulado/recalculado) o motor (nuevo cálculo de la misma cuenta y lote) | — | Efectos propuestos descartados. |

`issued` es terminal e inmutable. Si M05 anula el comprobante (`fac.invoice.annulled`, EVT-FAC-08), TAR revierte los efectos confirmados que sean reversibles (consumo de promoción, marca de cargo fijo/franqueo, saldo de redondeo vía M07) y registra la reversión; el cálculo permanece `issued` con `voidedAt`.

### 8.6 `calculationRuns`, `simulationRuns`, `retroactiveDiffRuns`, `bonusRecalcRuns`

- `queued → running → completed | completed_with_exclusions | failed`; `running → aborted` si los errores superan PRM-TAR-113; `queued|running → cancelled` por el usuario que lo lanzó o un supervisor (los resultados parciales se conservan marcados `partial`).
- `retroactiveDiffRuns`: `computed → approved` (doble firma, `tar.retroactivo.aprobar`) `→ adjustments_requested` (pedidos de NC/ND a M05) o `computed → rejected`.
- Reintentos: cada cuenta es una unidad idempotente (`runId + accountId`); reintentar reprocesa solo las cuentas fallidas; un worker caído deja la cuenta en `queued` por expiración de lock (BullMQ).

### 8.7 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5).

**Valores declarados:** `tariffServiceSettings`, `productPrices`, `eventCharges`, `chargeRules`, `subsidyRegimes`, `promotions`, `roundingPolicies` y `phoneRatePlans` usan el ciclo de §8.1: `draft`, `submitted`, `approved`, `rejected`, `scheduled`, `active`, `superseded`, `closed`, `voided`; estado inicial `draft`. `benefitGroups.status`: `active`, `inactive` (propuestos, aceptados en PA-TAR-20, DEC-072; antes [VERIFICAR]) (inicial `active`; no es entidad versionada de §8.1). `calculationRuns.status` agrega `failed` en §7 para alinearse con §8.6 (ninguna RF ni RN usa la lista de §7; prevalece §8.6, que distingue `failed` técnico de `aborted` por umbral).

**Transiciones agregadas:**

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `retroactiveDiffRuns` | — | `queued` | Pedido de cálculo (API-TAR-049) | Cambio con vigencia pasada | — |
| `retroactiveDiffRuns` | `queued` | `running` | Inicio del job | — | — |
| `retroactiveDiffRuns` | `running` | `computed` | Fin del cálculo | — | — |
| `retroactiveDiffRuns` | `queued`/`running` | `failed` | Error técnico no recuperable | — | — |
| `retroactiveDiffRuns` | `computed` | `approved` | Doble firma (`tar.retroactivo.aprobar`) | Firmantes distintos del autor | — |
| `retroactiveDiffRuns` | `computed` | `rejected` | Rechazo con motivo | — | — |
| `retroactiveDiffRuns` | `approved` | `adjustments_requested` | Pedidos de NC/ND a M05 | — | — |
| `simulationRuns` | — | `queued` | Pedido de simulación (API-TAR-043) | — | — |
| `simulationRuns` | `queued` | `running` | Inicio del job | — | — |
| `simulationRuns` | `running` | `completed`/`failed` | Fin o error | — | — |
| `simulationRuns` | `queued`/`running` | `cancelled` | Cancelación (API-TAR-045) | Usuario que la lanzó o supervisor | — |
| `bonusRecalcRuns` | — | `draft` | Alta del recálculo (API-TAR-056) | — | — |
| `bonusRecalcRuns` | `draft` | `previewed` | Vista previa | — | — |
| `bonusRecalcRuns` | `previewed` | `applied` | Aplicación (`appliedBy`) | — | — |
| `bonusRecalcRuns` | `draft`/`previewed` | `discarded` | Descarte | — | — |
| `roundingCarryEntries` | — | `proposed` | Cálculo con redondeo con arrastre | RN-TAR (política de `roundingPolicies`) | — |
| `roundingCarryEntries` | `proposed` | `confirmed` | Comprobante emitido (`fac.invoice.issued`) | — | — |
| `roundingCarryEntries` | `confirmed` | `reversed` | Comprobante anulado (`fac.invoice.annulled`) | — | — |
| `worksInstallmentPlans` | — | `pendingContract`/`active` | Evento EVT-TEC-25 (RF-TAR-116) | Idempotencia `{workId, premiseId}` | — |
| `worksInstallmentPlans` | `pendingContract` | `active` | Alta del contrato tipo 17 del beneficiario | — | — |
| `worksInstallmentPlans` | `active` | `exhausted` | Última cuota facturada | `billedInstallments = installments` | — |
| `worksInstallmentPlans` | `pendingContract`/`active` | `cancelled` | Anulación autorizada | — | — |

### 8.8 Estados iniciales completados (residuales del 05-11-2026)

Ronda de residuales del 05-11-2026 (PA-TAR-21, DEC-072): estado de alta explícito de las máquinas de §8.3 y §8.6, que lo daban por implícito. Las cadenas de §8.3 y §8.6 no cambian.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `subsidyEnrollments` | — | `active` | Confirmación de padrón (§8.2), alta manual o pedido del socio (`source`) | Fecha efectiva; la retroactiva exige `tar.excepciones.aprobar` | `tar.enrollment.changed` |
| `subsidyEnrollments` | `suspended` | `ended` | Baja del padrón, vencimiento o baja del contrato durante la suspensión | — | `tar.enrollment.changed` |
| `calculationRuns` | — | `queued` | Pedido de cálculo (lote de M05, individual, simulación, retroactivo o re-tasación) | — | — |

## 9. Procesos y flujos

### 9.1 Ciclo de actualización de una tarifa (DFA flujo 5; RN-TAR-064)

1. **Preparar**: el responsable copia la versión vigente (o la que elija) a un borrador (`POST /api/admin/tar/cuadros/:id/copiar`) o lanza una actualización masiva (porcentaje, importe fijo o fórmula sobre campos elegidos, con política de redondeo), o importa un archivo (ExcelImportWizard) con filas por clave natural.
2. **Editar**: modifica precios, escalones, categorías, reglas y fórmulas; el editor valida en línea (escalones, referencias, tipos, fase) y muestra el diff contra la versión de origen.
3. **Fijar vigencia y respaldo**: `validFrom` (y opcional `validTo`), criterio de fecha de referencia, documentos normativos con PDF.
4. **Simular**: simulación masiva comparativa (9.6) contra la versión vigente sobre el universo exigido por PRM-TAR-005; resultado vinculado a la versión.
5. **Enviar** a aprobación (T11) → **aprobar** (dos firmas; tercera si corresponde) → **publicar** (programada o inmediata).
6. **Activar**: el job JOB-TAR-01 activa a la fecha; la versión anterior queda `superseded` con `validTo`; los cálculos de períodos que crucen la vigencia aplican prorrateo automático (RN-TAR-049–058).
7. **Retroactivo**: si `validFrom` es anterior a comprobantes ya emitidos, se calcula la diferencia (9.7), que requiere aprobación para generar ajustes en M05.
8. **Comunicar** (opcional): publicación del cuadro en landing/portal (pantalla pública sin login, sin capability; antes `public.cuadros.ver`) y novedad a socios (T09).

Cancelación: un borrador o envío se retira sin efectos. Recuperación: si la activación falla (job caído), el job es idempotente por `scheduleId` y se reintenta; mientras tanto el cálculo usa la versión con `validFrom ≤ fecha de referencia` y estado `scheduled|active` (la activación es un cambio de estado, la selección es por fecha).

### 9.2 Pipeline de cálculo (motor puro y determinista)

El motor recibe una **solicitud de cálculo** (cuenta, contratos, período, secuencia, rango de consumos, tipo de comprobante, fecha de referencia, modo `billing|simulation|retroactive`, versiones forzadas opcionales) y devuelve un **resultado** (renglones con traza, totales, efectos propuestos, advertencias, errores). No escribe en colecciones de otros módulos; toda lectura externa se hace al inicio (instantánea) mediante los servicios de los módulos dueños. Mismas entradas ⇒ mismo resultado (`inputHash` → `resultHash`).

| Paso | Nombre | Qué hace | Reglas |
|---|---|---|---|
| P00 | Contexto e instantánea | Resuelve cuenta, situación fiscal, contratos a liquidar (los "facturar con otros" al final), fecha de referencia por contrato (PRM-TAR-010), versiones aplicables de cuadro, configuración de servicio y reglas (hasta 3 por prorrateo); lee consumos, adherentes, llamadas, inmueble, inscripciones, grupos, promociones, precargados, saldos de redondeo y anticipos; calcula `inputHash`. | RN-TAR-001, 003, 065, 131, 199, 200 |
| P01 | Elegibilidad | Condición del contrato; control de "una vez por período" en no medidos; categoría válida (consumo → contrato → forzada); versión existente y no ambigua (`TAR-E-SCH-NONE`, `TAR-E-SCH-AMBIGUOUS`). | RN-TAR-004, 005, 013, 014, 017, 200 |
| P02 | Cantidad por estrategia | Ejecuta la estrategia del `calcType`: consumos agrupados por tipo de energía/franja/concepto (incluye servicio relacionado y división), cantidad del contrato, adherentes que cuentan, llamadas tasadas, inmueble, cuotas de obra. | RN-TAR-012, 015, 016, 176–180, 196–197 |
| P03 | Correcciones de cantidad | Gas (volumen medido de M03 → factores → consumo corregido; DEC-085); bonificación de unidades; separación de inyectada (neto, sin inyectada); consumo del testigo para elegir tramo; factor por días. | RN-TAR-034–036, 038, 042, 165 |
| P04 | Prorrateo entre versiones | Detecta si hay prorrateo y calcula fracciones (hasta 3 versiones) según el método configurado. | RN-TAR-049–058 |
| P05 | Cargo fijo | Condiciones, importe (por días, por tramo, multicategoría, moneda), prorrateo por versión, primer abono bonificado. | RN-TAR-018–025 |
| P06 | Cargo variable | Bloque o tramos/escalones por versión y fracción; consumo cero con renglón trazable; neto negativo con escalones negativos. | RN-TAR-026–033, 039, 042 |
| P07 | Mínimo | Consumo mínimo por unidades faltantes (sobre consumo sin inyectada) y factura mínima si la regla estándar está activa (PA-TAR-17). | RN-TAR-037 |
| P08 | Grandes consumos | Energía por franja, demanda (contratada, registrada, adquirida, corregida, excedente), factor de potencia (recargo o bonificación), propuesta de actualización de contratada. | RN-TAR-101–115 |
| P09 | Prepaga | Escalón con consumo acumulado del mes, descuento de unidades ya liquidadas, recargo por cambio de tramo. | RN-TAR-043 |
| P10 | Proporcional de alta/baja | Factor de alta/baja (mes vencido o adelantado), renglón extra del mes de alta. | RN-TAR-046–048, 240 |
| P11 | Cargos del contrato | Cargos extraordinarios precargados, atraso de productos prestados, cargos por evento con disparador ocurrido y no cobrado, cuotas de obra, vivienda, productos por categoría. | RN-TAR-007, 008, 068–077, 183, 222–223, 241 |
| P12 | Reglas de fase servicio | Evalúa reglas de la fase servicio en orden de prioridad: cargos, recargos, descuentos, beneficios, subsidios (régimen + inscripción), promociones asignadas, tributos de regla. | RN-TAR-116–155, 172–173, 201–211, 242–245 |
| P13 | Agrupación por comprobante | Agrupa renglones por (cuenta, grupo de comprobante) y aplica el tipo forzado por categoría; reglas con "comprobante aparte" forman su grupo. La política de agrupación (separada/agrupada/multiservicio) la decide M05 (BASE §103) y TAR la recibe en la solicitud. | RN-TAR-010, 122 |
| P14 | Franqueo | Renglón de envío postal si corresponde. | RN-TAR-156 |
| P15 | Fiscal preliminar | Resuelve alícuota por renglón (cascada) e invoca `fis.service.calculateTaxes` (antes `fis.calculateTaxes`) (M06). | RN-TAR-166–171 |
| P16 | Reglas de fase comprobante | Reglas con fase `invoice`, incluido recargo proporcional y "una vez por cuenta en el lote". | RN-TAR-121, 130, 139, 140 |
| P17 | Fiscal definitivo | Recalcula tributos solo de los renglones nuevos o modificados (IVA fijo intacto). | RN-TAR-168, 186 |
| P18 | Crédito por inyectada | Si total < 0 y hubo inyectada: concepto de anticipo por el opuesto (modo compatibilidad) o registro en la cuenta de créditos (modo MER-001). | RN-TAR-039, 198, 231 |
| P19 | Anticipos | Propuesta de aplicación de anticipos de M07. | RN-TAR-157–158 |
| P20 | Redondeo | Redondeo de renglones (si no se hizo en P13) y del total (tipos 1/2/3), con propuesta de arrastre. | RN-TAR-159–164 |
| P21 | Cierre | Signo del total (negativo ⇒ informa a M05 para nota de crédito), validaciones (sin renglones de cantidad 0, totales cuadrados), `resultHash`, efectos propuestos, persistencia en `calculations`. | RN-TAR-175, 185 |

Reglas del pipeline:

- Un error en P00–P20 excluye la cuenta con su código y contexto; el lote sigue (RN-TAR-002, RN-TAR-126) salvo que se supere PRM-TAR-113.
- Los pasos P05–P11 se ejecutan **por contrato y por versión** (fracción); P12 por contrato; P13–P21 por comprobante propuesto.
- Cada paso agrega renglones con `trace.step` y puede agregar advertencias (`TAR-W-*`), nunca modifica renglones de pasos anteriores excepto los recargos (P12/P16), que registran la modificación en la traza del renglón afectado (`trace.adjustments[]`).
- Los efectos propuestos (`proposedEffects`) se generan en: P01 (avance de período), P05 (cargo fijo cobrado, primer abono consumido), P08 (actualización de contratada), P11 (precargados y cargos por evento cobrados), P12 (promoción consumida, recategorización automática), P14 (franqueo cobrado), P18 (crédito), P19 (anticipo aplicado), P20 (arrastre de redondeo).

### 9.3 Algoritmos con ejemplos numéricos (datos ficticios)

**9.3.1 Bloque vs tramos progresivos.** Escalones de una categoría: [0, 100) a ARS 10; [100, 200) a ARS 12; [200, ∞) a ARS 15. Consumo 250 unidades.
- Bloque (`metered_block`): una fila contiene 250 ⇒ 250 × 15 = **ARS 3.750,00**.
- Tramos (`metered_tiers`): 100 × 10 + 100 × 12 + 50 × 15 = 1.000 + 1.200 + 750 = **ARS 2.950,00** (tres renglones, cada uno con su escalón en la traza).

**9.3.2 Factor por días (45 días de consumo, 30 de referencia, factor 1,5) en tramos.** Anchos escalados: [0, 150), [150, 300), [300, ∞). 250 unidades ⇒ 150 × 10 + 100 × 12 = **ARS 2.700,00**. En bloque con `scale_quantity` (legacy): 250 × 1,5 = 375 unidades a la fila que contenga 250 (ARS 15) = ARS 5.625,00; con `scale_limits`: la fila que contiene 250 con límites escalados es [150, 300) a ARS 12 ⇒ 250 × 12 = ARS 3.000,00 (PA-TAR-02).

**9.3.3 Prorrateo por días entre dos versiones (método 1).** Lectura anterior 01/10/2026, actual 31/10/2026 ⇒ 30 días. Versión B vigente desde 16/10/2026 ⇒ fracción anterior = red6(15/30) = 0,5; actual = 0,5. Consumo 250 tramado completo en cada versión: A (precios del ejemplo 9.3.1) = 2.950; B (precios +10 %: 11; 13,2; 16,5) = 3.245. Renglones: A con cantidades × 0,5 (50, 50, 25) = 1.475,00; B con cantidades × 0,5 = 1.622,50; total **ARS 3.097,50**. Método 3: un juego de renglones con precio promedio (10,5; 12,6; 15,75) ⇒ 100 × 10,5 + 100 × 12,6 + 50 × 15,75 = **ARS 3.097,50** (mismo total, distinta presentación). Método 2: A tarifa 125 unidades desde el primer escalón (100 × 10 + 25 × 12 = 1.300); B tarifa el resto 125 continuando en el escalón donde quedó A (75 × 13,2 + 50 × 16,5 = 990 + 825 = 1.815); total **ARS 3.115,00**.

**9.3.4 Proporcional de alta (mes vencido).** Abono ARS 30.000, alta el 16 de un mes de 30 días: 30.000 × (1 − 16/30) = **ARS 14.000,00**; con PRM-TAR-068 (día de reconexión incluido): 30.000 × (30 − 16 + 1)/30 = **ARS 15.000,00**. En un mes de 31 días con alta el 16: 30.000 × (1 − 16/31) = ARS 14.516,13 (ProCoop) y 30.000 × 16/31 = ARS 15.483,87 con el día de alta incluido (AGR-017). La diferencia se explica en la traza (`daysMonth`, `startDay`, fórmula aplicada).

**9.3.5 Gas.** Volumen 100 m³, presión 1,0140, temperatura 0,9870 ⇒ red4(100 × 1,0140 × 0,9870) = 100,0818 m³; factor del período 9.300 kcal/m³, coeficiente corrector 1, óptimo 9.300 ⇒ consumo 100,0818 m³; con PRM-TAR-051 = redondear a 0 decimales ⇒ **100 m³** a tramar. La traza guarda los cuatro valores.

**9.3.6 Factor de potencia.** Activa 10.000 kWh, reactiva 7.500 kVArh ⇒ tgφ = 0,75 (cosφ ≈ 0,80); umbral tgφ 0,62; base (energía + demanda) ARS 1.000.000; recargo según la fórmula de la categoría (ej. `(tg / umbral − 1) × base` = (0,75/0,62 − 1) × 1.000.000 = **ARS 209.677,42**). Los umbrales y la fórmula son datos de la versión, no constantes del código (BASE §87).

**9.3.7 Redondeo con arrastre (tipo 2, múltiplos de 10).** Total ARS 13.457,83; saldo previo +ARS 6,40 ⇒ renglón "redondeo anterior" +6,40 ⇒ 13.464,23; objetivo truncado a múltiplo de 10 = 13.460,00; renglón de redondeo −4,23; arrastre propuesto 4,23 (se confirma al emitir en M07).

**9.3.8 Regla con fórmula y referencia.** Regla `tasa_alumbrado` (fase servicio, tipo `tax` vinculada a un tributo de M06): `unitFormula = consumption('A') * 0.85`, `taxBaseFormula = netService()`. Regla `bonif_alumbrado_social` (beneficio, `funding = public_subsidy`): condición `enrolledIn('tarifa_social')`, `unitFormula = -rule('tasa_alumbrado').unit * 0.5`. Con 250 kWh: tasa = 212,50; bonificación = −106,25. La traza de la segunda muestra la referencia a la primera y el régimen/inscripción de origen.

**9.3.9 Piloto Internet (seed M02 §18; BASE §39.3, §72).** Valores del *seed* único de M02 §18 (HUE-SRV-05): plan INT-100 "Fibra 100" abono ARS 15.000/mes, promoción PROMO-INT-50x3 (50 % sobre el abono × 3 ciclos), instalación ARS 20.000 de una sola vez, mes adelantado, activación 21/11/2026 (mes de 30 días). Primer comprobante (diciembre, PRM-TAR-012 = fracción + mes siguiente): fracción de noviembre 15.000 × 10/30 = 5.000,00 − promo 2.500,00; diciembre 15.000 − 7.500; instalación 20.000 ⇒ neto **ARS 30.000,00** (el ciclo parcial no consume si `partialCycleConsumes = false`; consume 1 ciclo por diciembre). Del cuarto ciclo en adelante: 15.000 sin promoción, con aviso previo (PRM-TAR-013). Los importes de BASE (abono 25.000, promoción 10 %, instalación 30.000) quedan solo como casos de prueba de RN-TAR-241 y RN-TAR-245.

> Texto original, **reemplazado por el párrafo anterior (HUE-SRV-05)**: "Plan INT-100 ARS 25.000/mes, promoción 10 % × 3 ciclos, instalación ARS 30.000 de una sola vez, mes adelantado, activación 21/11/2026 (mes de 30 días). Primer comprobante (diciembre, PRM-TAR-012 = fracción + mes siguiente): fracción de noviembre 25.000 × 10/30 = 8.333,33 − promo 833,33; diciembre 25.000 − 2.500; instalación 30.000 ⇒ neto ARS 60.000,00 (…). Del cuarto ciclo en adelante: 25.000 sin promoción, con aviso previo (PRM-TAR-013)."

### 9.4 Lenguaje de fórmulas GFL (CoopApps Formula Language) y sandbox

**9.4.1 Principios.** GFL reemplaza el lenguaje de criterios de DevExpress y los procedimientos almacenados (CTR-TAR-06). Es un lenguaje de **expresiones** puras: sin asignaciones, bucles, E/S, acceso a red ni al reloj; cada evaluación recibe un contexto inmutable (instantánea de P00 + resultados de reglas previas). La implementación usa un **parser propio** (tokenizador + descenso recursivo) que produce un AST; se valida contra una lista blanca de nodos y funciones; se evalúa con un intérprete que recorre el AST. Prohibido `eval`, `new Function`, `vm`, `require` dinámico o cualquier ejecución de texto como código. Aritmética decimal con `decimal.js` (precisión 34 dígitos significativos, redondeo half-up configurable por función).

**9.4.2 Gramática (EBNF resumida).**

```text
expr       := ternary
ternary    := or ( '?' expr ':' expr )?
or         := and ( ('||' | 'or') and )*
and        := not ( ('&&' | 'and') not )*
not        := ('!' | 'not') not | compare
compare    := additive ( ('==' | '!=' | '<' | '<=' | '>' | '>=' | 'in') additive )?
additive   := multiplicative ( ('+' | '-') multiplicative )*
multiplicative := unary ( ('*' | '/' | '%') unary )*
unary      := '-' unary | power
power      := postfix ( '^' unary )?
postfix    := primary ( '.' ident | '[' expr ']' )*
primary    := number | string | 'true' | 'false' | 'null' | date | list
            | ident '(' args? ')' | ident | '(' expr ')'
list       := '[' (expr (',' expr)*)? ']'
date       := '#' YYYY '-' MM '-' DD '#'
ident      := [a-zA-Z_][a-zA-Z0-9_]*
```

**9.4.3 Tipos y semántica.** Tipos: `decimal`, `integer`, `boolean`, `string`, `date`, `list`, `null`. Comparaciones entre tipos distintos son error de compilación (no conversión implícita; ProCoop devolvía texto en `GetCampo*`, duda 23). División por cero ⇒ error `TAR-E-FORMULA` con detalle (no infinito). `null` se propaga salvo en `coalesce`/`isNull`. Las funciones `iif(cond, a, b)` y el operador ternario evalúan solo la rama elegida. Fechas en zona del tenant; operaciones de fecha solo con funciones (`daysBetween`, `addDays`, `monthsBetween`, `periodOf`). Resultado esperado por campo: `conditionFormula` → boolean; `unitFormula`, `quantityFormula`, `valueFormula`, `taxBaseFormula` → decimal.

**Límites del sandbox** (por evaluación, PRM-TAR-110 a PRM-TAR-112): profundidad del AST ≤ 64; nodos ≤ 2.000; tiempo ≤ 50 ms por fórmula y ≤ 2 s por cuenta; llamadas a funciones costosas (simulación con otra versión, consultas históricas) ≤ 20 por cuenta. Superar un límite ⇒ `TAR-E-FORMULA-LIMIT`. Las funciones que consultan datos (historial facturado, deuda, consumos) operan sobre la **instantánea** de P00 o sobre consultas precargadas en lote (sin consultas por fila; ProCoop precargaba con más de 10 servicios).

**Compilación y dependencias.** Al guardar, la fórmula se compila; se guarda el AST, el hash y las dependencias (reglas, funciones, variables). Se detectan ciclos entre reglas (`rule('a')` ↔ `rule('b')`) y referencias a reglas posteriores en el orden ⇒ error de validación. Los casos de prueba guardados se ejecutan en cada publicación (RN-TAR-154).

**9.4.4 Variables de contexto** (alias legacy entre corchetes `[Factura.<campo>]` aceptado solo por el traductor de migración):

| Variable GFL | Tipo | Legacy ProCoop (RN-01 §12.4, §12.9) |
|---|---|---|
| `ctx.account.code`, `ctx.account.memberCode`, `ctx.account.name`, `ctx.account.set` | string | `Cuenta_Codigo`, `Cuenta_Socio`, `Nombre`, `Cuenta_Conjunto` |
| `ctx.account.vatStatus`, `ctx.account.iibbStatus` | string | `Cuenta_SituacionIVA`, `Cuenta_SituacionIIBB` |
| `ctx.account.address.street`, `.number`, `.floor`, `.unit` | string | `Cuenta_Calle`, `Cuenta_Dom_Numero`, `Cuenta_Dom_Piso`, `Cuenta_Dom_Dpto` |
| `ctx.person.occupation`, `ctx.member.active` | string / boolean | `Persona_Ocupacion`, `Socio_Activo` |
| `ctx.category.minimumInvoice` | decimal | `Categoria_FacturaMinima` |
| `ctx.category.minimumPrice`, `ctx.category.minimumUnits` | decimal | `Categoria_ConsumoMinimo` (alias → precio, RN-TAR-123) |
| `ctx.contract.id`, `ctx.service.code`, `ctx.category.code`, `ctx.category.rateCode` | string | `Servicio_IdSerSoc`, `Servicio_Codigo`, `Servicio_Codigo_Categoria`, `Servicio_Cod_CATSER` (categoría histórica con PRM-TAR-066) |
| `ctx.contract.address`, `ctx.contract.zone`, `ctx.contract.locality`, `ctx.contract.reference`, `ctx.contract.activity` | string | domicilio, `Servicio_Zona`, localidad, referencia, actividad |
| `ctx.contract.class.code`, `ctx.contract.class.value1`, `ctx.contract.class.value2` | string / decimal | clase y `Clase_Valor1/2` (`CLASESER`) |
| `ctx.contract.property`, `ctx.contract.invoiceCount` | string / integer | propiedad, cantidad de facturas |
| `ctx.contract.startDate`, `ctx.contract.adminStartDate`, `ctx.contract.endDate`, `ctx.contract.dueDate` | date | fechas de alta, alta administrativa, baja, vencimiento |
| `ctx.contract.ageMonths` | decimal | `Servicio_Meses_Antiguedad_Alta` — calculado contra la **fecha de referencia** (ProCoop: fecha del sistema / 30); alias legacy conserva días/30 |
| `ctx.reading.previousDate`, `ctx.reading.currentDate`, `ctx.reading.previousValue`, `ctx.reading.currentValue` | date / decimal | fechas y estados anterior/actual (default `null`, no 1900-01-01/0) |
| `ctx.schedule.prorationDate` | date | `Servicio_FechaCuadro` |
| `ctx.invoice.monthly` | boolean | `Factura_Mensual` (siempre verdadero en ProCoop; en CoopApps refleja la periodicidad real) |
| `ctx.invoice.consumptionTotal`, `ctx.invoice.consumptionSimulated` | decimal | `Factura_ConsumoTotal`, `Factura_ConsumoSimulado` |
| `ctx.invoice.fixedCharge` | decimal | `Factura_CargoFijo` |
| `ctx.invoice.consumptionDays` | integer | `Factura_DiasConsumo` |
| `ctx.period`, `ctx.schedule.code`, `ctx.consumptionProportional`, `ctx.cosPhi` | string / string / decimal / decimal | `Factura_Periodo`, `Factura_Cuadro`, `Consumo_Proporcional` (corregido, duda 7), `Factura_Coseno` |
| `ctx.batch.sequence`, `ctx.batch.consumptionFrom`, `ctx.batch.consumptionTo` | integer / date | `Secuencia`, `ConsumoDesde`, `ConsumoHasta` |
| Fase comprobante: `inv.index`, `inv.accountCode`, `inv.memberCode`, `inv.type`, `inv.group`, `inv.date`, `inv.due1..due4`, `inv.net`, `inv.vat`, `inv.otherTaxes`, `inv.perception`, `inv.total`, `inv.total2..total4`, `inv.contractId`, `inv.categoryCode`, `inv.advanceAmount`, `inv.installmentsAmount`, `inv.scheduleCode`, `inv.sequence`, `inv.debitCredit`, `inv.fxRate` | varios | `Index`, `Cod_Sum`, `Cod_Soc`, `TipoFactura`, `GrupoFactura`, `Fecha`, `FechaVto1..4`, `Neto`, `IVA`, `OtrosImpuestos`, `Percepcion`, `Total`, `Total2..4`, `Id_SerSoc`, `CodigoCategoria`, `ImporteAnticipo`, `ImporteItemsCuotas`, `Cod_CUA`, `Secuencia`, `Deb_Cre`, `Cotizacion` |
| Reglas: `rule('c').unit`, `.qty`, `.value`, `.taxBase`; `previousTotal()`, `previousTotalSameService()` | decimal | `Valor_CargoUnitario.<n>`, `Cantidad_Cargo.<n>`, `Valor_Cargo.<n>`, `BaseImp_Cargo.<n>`, `TotalAnterior.<n>` |
| Beneficios (nuevas): `enrolledIn('regimen')`, `enrollmentLevel('regimen')`, `inGroup('grupo')`, `promotionActive('promo')`, `promotionCycle('promo')` | boolean / string / integer | — (BASE §51) |

**9.4.5 Catálogo de funciones** (el primer argumento legacy `id`/`Cod_Sum`/`Index` desaparece; variante `…Account` = alcance cuenta; fase: A ambas, S servicio, C comprobante):

| Función GFL | Fase | Semántica | Alias legacy |
|---|---|---|---|
| `sumQty(kind, codes…)`, `sumAmount(kind, codes…)`, `…Account` | A | Suma cantidad o neto de renglones de `kind` ∈ {`service`, `product`, `tax`} con esos códigos (impuestos: importe de otros impuestos). | `Suma_{Cantidad\|Importe}_{Servicios\|Productos\|Impuestos}[_Cta]` |
| `sumAmountByTier(service, tierFrom, tierTo, scheduleCode?, totalPrice)` / `…Account` | A | Precio (o precio × cantidad) de la fila que contiene el rango, en la versión indicada. Aridad exacta 5. | `Suma_Importe_Servicios_XTrama[_Cta]` |
| `sumQtyProductsByCategory(category, products…)` | A | Cantidad de productos en renglones de la categoría. | `Suma_Cantidad_Productos_PorCategoria` |
| `maxConcept(kind, measure, codes…)`, `minConcept(…)`, `…Account` | A | Suma de máximos/mínimos por código (`measure` ∈ {`amount`, `qty`}). | `Maximo_Concepto`, `Minimo_Concepto[_Cta]` |
| `debt(untilDate, dueField, invoiceType?, includeCredits)` | A | Saldo adeudado (instantánea de M07); `dueField` ∈ {1, 2, 3, 4}. | `GetDeuda` |
| `debtCount(fromDate?, untilDate, dueField, invoiceType?)` | A | Cantidad de comprobantes con saldo (caché por clave completa). | `GetDeuda_Cantidad` |
| `accountField(name)`, `memberField(name)` | A | Campo tipado de la cuenta o del socio de una **lista blanca** de campos expuestos. | `GetCampoCuenta`, `GetCampoSocio` |
| `contractField(name)`, `contractFieldAccount(service, name, activeOnly?)` | A | Campo tipado del contrato; activos = condición 2 o 3 (corrige duda 20). | `GetCampoSersoc`, `GetCampoSersoc_Cuenta` |
| `meterField(concept, service?, name)` | A | Campo del medidor del concepto. | `GetCampoMedSoc` |
| `rateField(categoryCode, tier, name, concept?, scheduleCode?)` | A | Campo de la fila de tarifa (selecciona tramo). | `GetCampoTarifa` |
| `categoryField(service, category, name, scheduleCode?)` | A | Campo de la categoría en la versión. | `GetCampoCategoria` |
| `billedQty(kind, from, to, invoiceType, codes…)`, `billedAmount(…)`, `…ByPeriod(period, …)` | A | Facturado de la cuenta en el rango/período; NC restan; **excluye anulados** (duda 22). | `Facturado_*_Cta`, `Facturado_*_Cta_XPeriodo_` |
| `toDate(text)`, `monthsBetween(p1, p2)`, `daysBetween(d1, d2)`, `addDays(d, n)`, `periodOf(d)` | A | Utilitarias de fecha. | `ToDatetime`, `Diferecia_Periodos` |
| `fxRate(currency, date?)` | A | Cotización (T04) según PRM-TAR-015. | `GetCotizacion_Moneda` |
| `simulateWithSchedule(service, consumptionOrDate, scheduleCode, invoiceType, addService, addVat, products…)`, `…Account`, `simulateWithScheduleLarge(…, from, to, …)`, `…Account` | A | Cálculo sin persistir del servicio con otra versión (cobra cargo fijo; no incluye reglas). 0 si la versión no existe. | `TotalSimulacionCuadro[_Cta]`, `TotalSimulacionCuadro_GC[_Cta]` |
| `hasActiveService(service, categories…)` | A | Booleano. | `TieneServicioActivo` |
| `phoneNet(key)`, `phoneNetByType(callType)`, `phoneNetCapped(capSeconds, keys…)` | S | Neto de llamadas tasadas del contrato por clave, tipo (0–7) o con tope en segundos (prorratea la última; tope con decimales permitido). | `TotalNetoConsumo`, `TotalNetoConsumo_TLL`, `TotalNetoConsumo_Tope` |
| `consumptionLoad(service, energyType, from, to, state?, op?)` / `consumptionLoadAccount(…)` | S / C | Consumos del rango agrupados; `state` ∈ {`all`, `unbilled`, `billed`}; `op` ∈ {`sum`, `avg`, `min`, `max`, `count`}; ambos opcionales a la vez (duda 18). | `CargarConsumos` |
| `consumptionFind(valueFrom, valueTo, energyType, from, to, consecutiveOnly)` | S | Cantidad de lecturas en el rango o racha consecutiva más larga. | `BuscarConsumo` |
| `consumptionDays(from, to, currentDays, force?)` | S | Días reales de lecturas divididas del grupo; sin divididas, `currentDays` (no 60 fijo, duda 19). | `DiasConsumo` |
| `serviceCount(service, inMember, activeOnly = true)` | S | Cantidad de contratos del servicio en la cuenta o el socio. | `CantidadServicios` |
| `adherentCount(kind)` | S | Adherentes (0) o beneficiarios (1) sin baja **del contrato** (duda 21). | `GetCantidad_Adherentes` |
| `costPriceOf(scheduleCode?)`, `pistPrice(scheduleCode?)`, `fixedChargeSubsidyPrice(scheduleCode?)`, `uniformGasPrice(scheduleCode?)` | S | Columna de costo de la fila del primer renglón con tarifa. | `GetPrecioCosto`, `GetPrecioPIST`, `GetPrecioCF_Subsidio`, `GetPrecioUniformeGas` |
| `subsidyTotal(useProportional?)`, `costTotal(useProportional?)` | S | Σ cantidad × columna de todos los renglones (con la versión de cada renglón si `useProportional`). | `GetPrecioSubsidio`, `GetPrecioCostoTotal` |
| `prorationCurrent()`, `prorationPrevious()`, `prorationPrevious2()` | S | Fracciones de prorrateo (RN-TAR-053). | `GetProrrateoActual`, `GetProrrateo*` |
| `altaBajaFactor()` | S | Factor proporcional del renglón (1 si no tiene). | `GetProporcionalAltaBaja` |
| `param(code)` | S | Valor de un parámetro **expuesto** del tenant (lista blanca de PRM; no acceso arbitrario). | `BuscarVariableInt` |
| `previousInvoiceTotal(monthsBefore, service, scheduleCode?)` | C | Total de la factura del período − N con ítems del contrato, no anulada (total + anticipo − cuotas con IVA; NC restan); si no hay y existe la versión, simula. Variante `previousInvoiceServiceTotal` solo la parte del servicio. | `TotalFacturaAnterior` |
| `invoiceCategory(service)`, `invoiceHasService(service)` | C | Mayor categoría del servicio en el comprobante; presencia del servicio. | `Get_Categoria_Servicio` |
| `netService()`, `qtyService()`, `fixedChargeNet()`, `energyNet()` | S | Atajos sobre los renglones del contrato. | — (nuevas) |
| Estándar: `iif`, `isNull`, `coalesce`, `round(x, n)`, `roundDown`, `roundUp`, `trunc`, `abs`, `min`, `max`, `len`, `upper`, `lower`, `contains`, `startsWith`, `year`, `month`, `day` | A | Equivalentes de las funciones estándar de criterios DevExpress usadas en ProCoop. | `Iif`, `IsNull`, `Round`, `Abs`, … |
| Funciones a medida del tenant (declarativas) | según definición | Reemplazo de `FORMULA_CARGO_*`/`FORMULA_CARGOFINAL_*` (RN-TAR-145, PA-TAR-11). | `<Nombre>` del procedimiento |

**9.4.6 Traducción de fórmulas legacy (JOB-TAR-08 `tar:traducir-formulas`).** Tokeniza la fórmula DevExpress, reemplaza `[Factura.X]` por la variable GFL, `[Valor_CargoUnitario.Nombre]` por `rule('codigo').unit` (resolviendo nombre → código), elimina el primer argumento de fila de las funciones, convierte `GetCampo*` a funciones tipadas, marca las funciones afectadas por correcciones (dudas 7, 18–23) y los procedimientos almacenados no inventariados. Resultado por regla: `auto` (traducción equivalente verificada con casos de prueba), `reviewed`, `manual` o `failed`. Ninguna regla `failed` puede publicarse. Toda regla traducida con fórmula se crea con `formulaJustification.kind = migrated_pending_review` ("traducida de ProCoop, pendiente de revisar"), que permite publicarla y la deja contada en REP-TAR-18 hasta que se revise (RN-TAR-252; DEC-105); si el traductor puede expresar la fórmula como regla declarativa equivalente (porcentaje, importe fijo, escala, bloque, mínimo, máximo o umbral de RF-TAR-067), la propone como tal en el reporte de traducción.

### 9.5 Explicabilidad por renglón

Cada renglón responde: **qué** (concepto, cantidad, unidad, precio, importe), **por qué** (paso del pipeline, regla o estrategia, condición cumplida), **con qué** (versión de cuadro con código, versión y vigencia; fila/escalón con límites; regla con código y versión; documento normativo; fracción de prorrateo; días; factor; base imponible; régimen e inscripción de origen; promoción y ciclo) y **de dónde** (IDs de consumos, lecturas, llamadas, padrones). La explicación se arma con plantillas del diccionario (`dict:tar.explain.<kind>`) en lenguaje llano para el socio (PWA, PAN-TAR-23) y con detalle técnico para el operador (PAN-TAR-17). El socio nunca ve fórmulas ni datos de otros socios; ve "Tramo 101–200 kWh: 100 kWh × ARS 12,00 (Cuadro ABRIL 2026, Res. N° …, vigente desde 01/04/2026)". La explicación de un cálculo emitido se reconstruye solo desde `calculations` (no recalcula), de modo que siempre coincide con el comprobante.

### 9.6 Simulador masivo comparativo (JOB-TAR-02 `tar:simular-masivo`)

1. El usuario define baseline (versiones vigentes o elegidas) y candidato (versión en borrador o publicada; reglas; promociones), universo (servicios, categorías, zonas, grupos, regímenes, muestra N o %), período y fuente de cantidades (consumo real del período, de un período histórico o cantidad manual).
2. El job divide el universo en bloques (PRM-TAR-020) y calcula cada contrato dos veces (baseline y candidato) con el motor en modo `simulation` (sin efectos).
3. Persiste `simulationResults` y agrega `summary`: totales y variación % por servicio, categoría, grupo, régimen, concepto y tramo; distribución (percentiles 10/50/90), cuentas con variación > PRM-TAR-153; errores por código.
4. Exporta a Excel/CSV (resumen y detalle) y vincula la simulación a la versión candidata (precondición de envío según PRM-TAR-005).
5. Cancelable; reanudable por bloque; resultados expiran según PRM-TAR-151 salvo los vinculados a versiones publicadas (se conservan como evidencia de aprobación).

Simulación individual: misma lógica para una cuenta o contrato con cantidad ingresada, en línea (síncrona, ≤ 2 s), con explicación completa (reemplaza `SimularFactura`, frmFacturacionMensual en modo simulación y la simulación del editor de cargos).

### 9.7 Diferencias retroactivas (JOB-TAR-06 `tar:diferencias-retroactivas`)

Disparador: publicación de una versión con `validFrom` anterior a comprobantes emitidos del alcance, alta/baja retroactiva de inscripción, o pedido manual (`tar.retroactivo.calcular`). Para cada comprobante emitido del rango: recalcula con las versiones corregidas usando la **instantánea original** (mismas cantidades) y compara por renglón. El resultado queda `computed`; con aprobación (`tar.retroactivo.aprobar`, doble firma) se envían a M05 pedidos de nota de crédito/débito por la diferencia (nunca se reescribe el comprobante, ESC-02). Umbral de diferencia mínima PRM-TAR-154 (por debajo no se ajusta). PA-TAR-12.

### 9.8 Tasación telefónica (JOB-TAR-09 `tar:tasar-llamadas`, JOB-TAR-10 `tar:retasar`)

1. M10 importa CDR y emite `tec.cdr.attributed` (EVT-TEC-27) con el lote de llamadas.
2. TAR, por llamada: línea/plan vigente a la fecha de la llamada; destino por prefijo más largo (servicio de M10); tipo de llamada; partición en tramos por bandas horarias del día (1–7; feriado ⇒ bandas del domingo; cruce de medianoche); tipo de banda por plan+banda[+tipo] con fallback; importe = fracción inicial + fracciones siguientes × precio; descuentos y números gratuitos; prepago (tipo +10); si el CDR trae importe > 0, prevalece (RN-TAR-084–098).
3. Escribe la tasación vía servicio de M10 (`rated`, importe, `ratingTrace` con plan, tarifa, bandas, fracciones).
4. Retasación: para un rango y filtros, recalcula conservando los identificadores de las llamadas (ProCoop borra y reinserta; CTR-TAR-24); solo llamadas no facturadas, salvo con diferencias retroactivas aprobadas.

### 9.9 Padrones de subsidio y tarifa social (JOB-TAR-04 `tar:importar-padron`, JOB-TAR-05 `tar:recategorizar`)

1. Importación (ExcelImportWizard) del padrón del régimen (por DNI/CUIT, por suministro o por NIS), validación y cruce (8.2).
2. Revisión del resumen (altas, bajas, cambios, no encontrados, duplicados, conflictos de varias cuentas por persona) y confirmación ⇒ `subsidyEnrollments`.
3. Opcional por régimen (compatibilidad ProCoop): recategorización a la categoría social con propuesta revisable y aplicación en M02 con fecha efectiva; restablecimiento masivo (frmTarifaSocial_Restablecer, frmSegmentacion_Restablecer).
4. Tope de consumo subsidiado por inscripción (frmTarifaSocial_TopeConsumo / _Confirmar_TopeConsumo).
5. Exportación de beneficiarios y consumos al organismo (frmTarifaSocial_Exportar) con formato del régimen (T06).
6. Toda inscripción guarda origen (archivo, fila, fecha) y evidencia (RN-TAR-205).

### 9.10 Promociones

Alta y aprobación de la promoción (versionada) → asignación automática en la contratación si es elegible (M09/M02 informan) o manual → activación con el disparador → aplicación por ciclo en P12 → consumo al emitir → aviso de fin (JOB-TAR-11 `tar:aviso-fin-promociones`, diario) → finalización. Cambio de plan según `onPlanChange`; anulación de comprobante revierte el ciclo (8.4).

### 9.11 Catálogo de errores y advertencias del motor

| Código | Mensaje (clave de diccionario) | Origen legacy | Efecto |
|---|---|---|---|
| `TAR-E-SCH-NONE` | No existe versión tarifaria vigente para el servicio/categoría a la fecha de referencia. | CU-06 | Excluye cuenta |
| `TAR-E-SCH-AMBIGUOUS` | Hay más de una versión aplicable incompatible. | CU-06 | Excluye cuenta |
| `TAR-E-SCH-OVERLAP` | La vigencia se superpone con otra versión del mismo alcance. | — | Rechaza publicación |
| `TAR-E-CAT-MISSING` | El servicio X de la cuenta Y no tiene una categoría asignada. | RN-01 §1.2 | Excluye cuenta |
| `TAR-E-CAT-INVALID` | Categoría inválida para la versión. | RN-01 §1.2 | Excluye cuenta |
| `TAR-E-CAT-CONSUMPTION` | El consumo tiene una categoría que no pertenece al servicio. | RN-01 §2, §23.1 | Excluye cuenta |
| `TAR-E-RELATED-MISSING` | El servicio relacionado (ej. agua para cloaca) falta, está dado de baja o no tiene consumo aprobado para el período (RN-TAR-247; HUE-CLO-02). | RN-01 §2 (`REL_SER`) | Excluye cuenta (el lote continúa) |
| `TAR-W-TRIP-DATA-MISSING` | El viaje no trae característica o condición de asociado; se cobró como asociado sin característica (RN-TAR-249). | — | `observed` |
| `TAR-E-REGIME-READING-MISSING` | Cambio a régimen no medido sin lectura final de retiro aprobada por M03 (RN-TAR-250; HUE-AG-03). | — | Excluye cuenta (el lote continúa) |
| `TAR-W-QUOTA-USAGE-MISSING` | Servicio de correo o pack SMS sin consumo informado a la fecha de cálculo; se facturó solo el cargo fijo (RN-TAR-251; DEC-084). | — | `observed` |
| `TAR-E-RATE-NOTFOUND` | No existe tarifa para el consumo realizado (cuadro, consumo, tipo de energía, concepto). | RN-01 §4.1 | Excluye cuenta |
| `TAR-E-TIER-NOTFOUND` | Ningún tramo contiene el consumo. | RN-01 §4.2 | Excluye cuenta |
| `TAR-E-TIERS-INCOMPLETE` | Faltan tramas en la categoría indicada. | RN-01 §4.2 | Excluye cuenta |
| `TAR-E-GAS-FACTOR` | No hay factor de gas para el período/categoría. | RN-01 §4.4 | Excluye cuenta |
| `TAR-E-GAS-COSTROW` | Falta la fila de costo de gas. | RN-01 §19 | Excluye cuenta |
| `TAR-E-PRORATION-TOO-MANY` | Más de tres versiones en el período. | RN-01 §6.2 | Excluye cuenta |
| `TAR-E-PRORATION-STEPS-MISMATCH` | Los escalones de las versiones no coinciden (método 3). | RN-01 §6.3 | Excluye cuenta / rechaza publicación |
| `TAR-E-PRORATION-RATE-MISSING` | No existen tarifas en la versión a prorratear. | RN-01 §6.3 | Excluye cuenta |
| `TAR-E-WORKS-TYPE`, `TAR-E-WORKS-PROPERTY`, `TAR-E-WORKS-METERS`, `TAR-E-WORKS-PLAN`, `TAR-E-INDEX-MISSING` | Errores de cuotas de obra (tipo, propiedad, medidores, plan, índice). | RN-01 §7 | Excluye cuenta |
| `TAR-E-WATER-PROPERTY`, `TAR-E-WATER-TBM`, `TAR-E-WATER-ZONAL` | Sin inmueble / Tasa Básica Mensual inválida / Coeficiente Zonal inválido. | RN-01 §8 | Excluye cuenta |
| `TAR-E-ADH-CATEGORY` | Sin categoría para la cantidad de adherentes. | RN-01 §9 | Excluye cuenta |
| `TAR-E-DEMAND-CONCEPT`, `TAR-E-DEMAND-PEAK-RATE`, `TAR-E-VAD` | Errores de demanda y VAD en grandes consumos. | RN-01 §11 | Excluye cuenta |
| `TAR-E-FORMULA` | Error al evaluar la fórmula (regla, campo, mensaje, valores). | RN-01 §12.5 | Excluye cuenta |
| `TAR-E-FORMULA-CONTEXT` | Inconsistencia al obtener el contexto de la cuenta. | RN-01 §12.6 | Excluye cuenta |
| `TAR-E-FORMULA-LIMIT` | La fórmula superó un límite del sandbox. | — | Excluye cuenta |
| `TAR-E-RULE-CONFLICT` | Dos reglas incompatibles aplican sin prioridad que las resuelva. | CU-TAR-02 | Excluye cuenta (revisión) |
| `TAR-E-FORMULA-UNJUSTIFIED` | La regla usa fórmula y no tiene la justificación de por qué no alcanza una regla declarativa, o la fórmula cambió después de justificarla (RN-TAR-252; DEC-105). | — | Rechaza el envío a aprobación |
| `TAR-E-TAX` | M06 no pudo calcular tributos (alícuota/situación faltante). | RN-01 §17 | Excluye cuenta |
| `TAR-E-FX-MISSING` | Falta cotización de la moneda a la fecha. | RN-01 §3.2 | Excluye cuenta |
| `TAR-E-IMMUTABLE` | La versión o regla publicada no puede modificarse; copiala a un borrador. | RN-01 §6.4, §12.8 | Rechaza la operación (409) |
| `TAR-W-RULE-QTY-ZERO` | Regla con unitario ≠ 0 y cantidad 0: renglón omitido. | RN-01 §12.6 | Advertencia |
| `TAR-W-LARGE-REVIEW` | Gran usuario con importe sobre umbral: requiere revisión. | MER-003 | `observed` |
| `TAR-W-PARALLEL-DIFF` | Diferencia contra ProCoop en paralelo (clasificada). | T07 | `observed` |
| `TAR-W-PROMO-ENDING` | Promoción en su último ciclo. | CU-PRO-01 | Advertencia |
| `TAR-W-ROUNDING-SKIPPED` | Redondeo omitido (fecha = primer vencimiento o cuenta excluida). | RN-01 §15 | Advertencia |
| `TAR-W-CORRECTION-KNOWN` | El resultado difiere del legacy por una corrección documentada (dudas 2, 3, 4, 7, 8, 16–23, 25–27). | PA-TAR-03 | Advertencia |

### 9.12 Calendario y días (AGR-017)

- Días de consumo = fecha de lectura actual − fecha de lectura anterior (días civiles en zona del tenant).
- Días del mes = días reales del mes calendario (28–31); bisiesto considerado.
- Alta: el día de alta se presta (incluido) en el modelo CoopApps; el modo legacy (`1 − día/díasMes`) se conserva para migrados (PRM-TAR-068 controla la inclusión).
- Baja: el día de baja se presta (incluido): fracción = díaBaja / díasMes.
- Tramos de un período (cambio de plan, suspensión, promoción, versión) se calculan con intervalos semiabiertos `[desde, hasta)` sin solapamiento ni huecos; la suma de fracciones = 1 (diferencia de redondeo asignada a la última fracción).
- Ningún cálculo usa la fecha/hora del servidor; la "fecha de hoy" es la fecha de referencia de la solicitud.

## 10. Pantallas

Convenciones (CNX): app `admin` con `AdminShell`; listados con `DataTable` genérico (filtros, orden, columnas configurables, exportación, paginación de servidor); importaciones con `ExcelImportWizard`; confirmaciones y toasts estándar; textos por diccionario (T03); ayuda contextual `?` por pantalla con clave `dict:help.tar.<pantalla>`. Rutas bajo `/admin/tarifas/…`. Todas las pantallas respetan el alcance de datos del rol (servicios asignados).

| PAN-ID | App | Ruta | Capability | Propósito | Layout y contenido | Acciones / modales | Estado vacío | Equivalencia INV |
|---|---|---|---|---|---|---|---|---|
| PAN-TAR-01 | admin | `/admin/tarifas/cuadros` | `tar.cuadros.ver` | Listado de versiones de cuadros. | DataTable. Filtros: servicio, estado, vigente a fecha, norma, autor. Columnas: código, nombre, servicio, versión, estado (chip), vigencia desde/hasta, normas, simulación, firmas, última modificación. | Nueva, copiar, actualizar masivo, importar, ver diff, enviar, exportar (Excel/PDF). | "Todavía no hay cuadros: creá el primero o importalo." | `abm_Cuadros` (Configuracion) |
| PAN-TAR-02 | admin | `/admin/tarifas/cuadros/:id` | `tar.cuadros.ver` / `tar.cuadros.editar` | Editor de versión. | Cabecera (código, nombre, servicio, alcance, vigencia, criterio de fecha, moneda, tipo de cambio); pestañas: Categorías, Filas, Adherentes, Productos/precios, Reglas incluidas (con la marca "usa fórmula" y su justificación, y el resumen de reglas con fórmula y `migrated_pending_review` de la versión que ven quien envía y quien aprueba; RN-TAR-252, DEC-105), Normas (PDF), Simulación, Diff, Historial y firmas. Solo lectura si no es `draft`. | Guardar, validar, enviar a aprobación, retirar, adjuntar norma, clonar categoría, ir a simulador. Modal de diff campo a campo. | — | `abm_Cuadros`, `abm_Servicio`, `abm_Servicio_Categorias` |
| PAN-TAR-03 | admin | `/admin/tarifas/cuadros/:id/categorias/:cat` | `tar.cuadros.editar` | Editor de categoría y escalones. | Datos de la categoría (cargo fijo, mínimo, bonificación, demanda, factor de potencia, prepaga, alícuotas, coeficientes, extras); grilla de filas (tipo de energía, concepto, franja, desde, hasta, precio, cargo fijo por tramo, columnas de subsidio/costo) con validación de huecos y solapes; gráfico de escalones. | Agregar/eliminar fila, ordenar por concepto (PRM-TAR-103), copiar de otra categoría, probar con consumo (mini simulador). | "Sin escalones: agregá al menos uno." | `abm_Servicio_Categorias`, `abm_CateSer_Coeficientes`, `abm_Servicio_TarAdhe` |
| PAN-TAR-04 | admin | `/admin/tarifas/cuadros/actualizacion-masiva` | `tar.precios.actualizarMasivo` | Actualización masiva de precios. | Asistente: origen (versión), alcance (servicios/categorías/conceptos/campos), operación (porcentaje, importe, fórmula, igualar a otra versión), redondeo, vista previa antes/después. | Generar borrador. | — | `frm_Tarifas_Masiva`, `frm_ActualizarPrecios`, `frmActualizarTarifaConOtra`, `frmModificarTarifaServicio` |
| PAN-TAR-05 | admin | `/admin/tarifas/cuadros/importar` | `tar.precios.importar` | Importar tarifas desde planilla. | ExcelImportWizard con mapeo por clave natural, validación por fila, vista previa de diferencias. | Confirmar ⇒ borrador. | — | `frmImportarTarifas` |
| PAN-TAR-06 | admin | `/admin/tarifas/reglas` | `tar.reglas.ver` | Listado de reglas. | DataTable. Filtros: fase, tipo, servicio, estado, vigente a fecha, financiamiento, estado de traducción, usa fórmula, tipo de justificación (DEC-105). Columnas: orden, código, nombre, fase, tipo, servicio, concepto/tributo, vigencia, versión, estado, traducción, usa fórmula. | Nueva, clonar, subir/bajar orden (misma fase y servicio), enviar, ver dependencias. | "No hay reglas para este filtro." | `abm_CargosAdicionales` (listado) |
| PAN-TAR-07 | admin | `/admin/tarifas/reglas/:id` | `tar.reglas.editar`, `tar.formulas.editar` | Editor de regla y fórmulas. | Secciones: identidad, ámbito, condiciones (constructor declarativo AND/OR), base, acción, fórmulas GFL (filtro, unitario, cantidad, base imponible) con editor con resaltado, autocompletado de variables/funciones/reglas, validación en línea y panel de dependencias; justificación de la fórmula (obligatoria si la regla usa fórmula: por qué no alcanza una regla declarativa; RN-TAR-252, DEC-105); compatibilidad; efectos y visibilidad; normas; casos de prueba. | Probar con contratos reales (sin persistir) en ambas fases; guardar caso de prueba; ver fórmula legacy original (solo migradas). | — | `abm_CargosAdicionales`, `frmEditorFormulas` |
| PAN-TAR-08 | admin | `/admin/tarifas/funciones` | `tar.funciones.ver` | Catálogo de funciones y variables GFL. | Lista con firma, fase, descripción, ejemplos y alias legacy; funciones a medida del tenant con su estado. | Proponer función a medida (si `tar.reglas.editar`). | — | Ayuda de `frmEditorFormulas` |
| PAN-TAR-09 | admin | `/admin/tarifas/gas/factores` | `tar.cuadros.editar` | Factores de gas por período/zona/categoría. Pantalla única de factores (reemplaza a PAN-MED-20; HUE-GAS-03). | DataTable editable + importación. | Importar, copiar período anterior. | "Cargá los factores del período antes de liquidar gas." | `abm_Factor_Cal`, `frmCorregirConsumoGas` |
| PAN-TAR-10 | admin | `/admin/tarifas/coeficientes` | `tar.cuadros.editar` | Coeficientes por categoría y fecha. | DataTable por versión/categoría. | Alta, importar. | — | `abm_CateSer_Coeficientes` |
| PAN-TAR-11 | admin | `/admin/tarifas/grupos` | `tar.grupos.ver` / `tar.grupos.editar` | Grupos de beneficio. | Lista de grupos; detalle con miembros (vigencias, origen, evidencia) y criterio. | Alta/baja de miembro con fecha efectiva, importar miembros, aprobar. | — | — (nuevo, BASE §51) |
| PAN-TAR-12 | admin | `/admin/tarifas/subsidios` | `tar.subsidios.ver` | Regímenes, padrones e inscripciones. | Pestañas: Regímenes (versionados, componente, tope, regla), Padrones (importaciones con estado y resumen), Inscripciones (por suministro con vigencia y evidencia). | Importar padrón (ExcelImportWizard), confirmar, recategorizar (preview), restablecer, tope de consumo. | — | `frmTarifaSocial_Importar`, `_ImportarPorDni`, `_ImportarPorDni_Confirmar`, `_Restablecer`, `_TopeConsumo`, `_Confirmar_TopeConsumo`, `frmSegmentacion_Restablecer`, `frmRecategorizacion` |
| PAN-TAR-13 | admin | `/admin/tarifas/subsidios/exportar` | `tar.padrones.exportar` | Exportación al organismo. | Filtros por régimen/período; vista previa; formato del régimen. | Generar archivo (job) y descargar. | — | `frmTarifaSocial_Exportar` |
| PAN-TAR-14 | admin | `/admin/tarifas/promociones` | `tar.promociones.ver` | Promociones y asignaciones. | Lista de promociones (efecto, base, ciclos, ventana, estado); detalle con asignaciones (contrato, ciclos consumidos, estado). | Nueva, aprobar, asignar manualmente, cancelar asignación (con motivo). | "Sin promociones activas." | — (nuevo, BASE §72) |
| PAN-TAR-15 | admin | `/admin/tarifas/simulador` | `tar.simulador.ejecutar` | Simulador individual. | Selección de cuenta/contrato o cliente hipotético (servicio, categoría, cantidad, días, fecha); versión base y candidata; resultado lado a lado con explicación por renglón. | Exportar PDF de simulación, compartir con atención. | — | Simulación de `frmFacturacionMensual`, `SimularFactura` |
| PAN-TAR-16 | admin | `/admin/tarifas/simulador/masivo` | `tar.simulador.masivo` | Simulador masivo comparativo. | Formulario (baseline, candidato, universo, período, fuente de cantidades); listado de corridas con progreso; tablero de resultados (totales, variación por servicio/categoría/grupo/tramo, histograma, top variaciones) y detalle por cuenta. | Lanzar, cancelar, exportar, vincular a versión. | "Todavía no corriste simulaciones." | — (propuesta DFA M7) |
| PAN-TAR-17 | admin | `/admin/tarifas/calculos/:id` | `tar.calculo.explicar` | Explicación técnica de un cálculo. | Cabecera (cuenta, período, versiones, hashes, estado); renglones con traza desplegable (paso, versión, fila, regla, fórmula, variables, fuentes); tributos (M06); efectos propuestos/confirmados; advertencias/errores. | Reproducir cálculo (verifica `resultHash`), descargar JSON de traza (auditor). | — | — (nuevo) |
| PAN-TAR-18 | admin | `/admin/tarifas/cargos-evento` | `tar.eventos.ver` | Catálogo de cargos por evento y bonificaciones. Incluye los disparadores `equipment_not_returned` (deshabilitado por defecto, PRM-TAR-169), `social_act` y `social_trip` (con editor de `tripPricing`). | DataTable con disparador, naturaleza, precio, fundamento, servicios; pestaña bonificaciones de conexión. | Alta/versión, aprobar. | — | `abm_Conexion` |
| PAN-TAR-19 | admin | `/admin/tarifas/telefonia` | `tar.telefonia.ver` | Configuración de tasación. | Pestañas: Planes, Bandas horarias (editor semanal + feriados), Asignación de bandas, Tarifas por destino/tipo/banda, Planes de descuento, Números gratuitos. | Alta/versión, importar tarifas. | — | Clases `Tasacion`, `TiempoBandas`, `TiempoTipoBandas`, `TipoPlanDescuento`, `clsTelefonia`, `clsLlamadas` (sin formularios inventariados) |
| PAN-TAR-20 | admin | `/admin/tarifas/telefonia/tasacion` | `tar.telefonia.tasar` | Simulador de tasación y retasación. | Ingreso de llamada hipotética (origen, destino, inicio, duración) con resultado por tramo; formulario de retasación por rango y filtros con vista previa. | Tasar pendientes, retasar (job). | — | — |
| PAN-TAR-21 | admin | `/admin/tarifas/aprobaciones` | `tar.cuadros.aprobar` | Bandeja de aprobaciones. | Lista de envíos pendientes (cuadros, reglas, promociones, regímenes, retroactivos) con resumen de diff, simulación y normas. | Aprobar/rechazar con comentario (firma); ver detalle. | "No tenés aprobaciones pendientes." | — (T11) |
| PAN-TAR-22 | admin | `/admin/tarifas/retroactivos` | `tar.retroactivo.calcular` | Diferencias retroactivas. | Lista de corridas; detalle por comprobante (original, recalculado, diferencia). | Calcular, aprobar (doble firma), generar pedidos de ajuste a M05. | — | — |
| PAN-TAR-23 | pwa-socio | `/facturas/:id/detalle` | `tar.explicacion.ver` (antes `pwa.factura.explicacion.ver`) | Explicación de la factura al socio. | Tarjetas por servicio: cargo fijo, consumo por tramo, beneficios con su origen, promociones (ciclo X de N), tributos, redondeo; enlace a la norma pública y al cuadro vigente. | Descargar PDF, consultar (abre solicitud en M09). | — | AutoGestion (sin equivalente de explicación) |
| PAN-TAR-24 | landing | `/tarifas` | — (pantalla pública sin login, sin capability; antes `public.cuadros.ver`) | Cuadros tarifarios públicos. | Por servicio: versión vigente y próximas, categorías y precios publicables, norma con PDF. | Descargar. | "La cooperativa no publicó cuadros." | — (BASE §6) |
| PAN-TAR-25 | admin | `/admin/tarifas/redondeo` | `tar.redondeo.configurar` | Políticas de redondeo. | Global y por tipo de comprobante: decimales de renglón, tipo, decimales/múltiplo, conceptos, alcance del arrastre, regla de primer vencimiento. | Versionar, simular efecto. | — | Campos de `TIPO_FAC` (abm de tipos de comprobante) |
| PAN-TAR-26 | admin | `/admin/tarifas/bonificaciones/recalculo` | `tar.cuadros.editar` | Recálculo masivo de bonificaciones de unidades. | Filtros; grilla de trabajo (contrato, categoría anterior/actual, consumos, bonificación actual/nueva); vista previa. | Aplicar (genera cambios en M02), descartar. | — | `frmTempModifBonif`, `frmBonificacionEstimados` |
| PAN-TAR-27 | admin | `/admin/tarifas/configuracion` | `tar.config.configurar` | Parámetros del módulo (PRM-TAR). | Formulario agrupado por tema con valor, ámbito, origen V2 y ayuda. | Guardar versión (T04). | — | `Busca_V2_*` de VENTAS_Y_FACTURACION |
| PAN-TAR-28 | admin | `/admin/tarifas/precargados` | `tar.calculo.ejecutar` | Cargos extraordinarios precargados. | DataTable por contrato/período/estado/origen. | Alta manual (con aprobación sobre umbral), importar, cancelar. **Reemplazado por** PAN-FAC-21 de M05 (CTR-DAT-38): esta ruta abre esa pantalla filtrada por `sourceModule = TAR`. | — | Carga de `PRCAGAS`; importación de proveedores móviles (M10) |
| PAN-TAR-29 | admin | `/admin/tarifas/precios-vivienda` | `tar.cuadros.editar` | Precios de vivienda por categoría y fecha. **Reemplazado por PAN-SOC-17 (HUECO-VIV-02):** los precios se cargan en M18 (`/soc/vivienda/planes`); M04 no tiene pantalla propia. | DataTable versionado. | Alta, importar. | — | `frm_PreciosViv` |

Formularios INV relacionados que no son pantallas de TAR: `abm_Impuesto` (M06: catálogo de tributos; TAR lo referencia), `abm_Plan_Cuo` (M08), `frmFacturacionMensual` (M05: lote; usa el simulador de TAR), `frmConfiguracionPrepaga` y `frmVentaPrepaga` (M03/M07: prepago; TAR liquida la categoría prepaga), `frmInformesConsumos` (M03; informe de tramos en 15.4), `abm_Postales` (M01/M05: servicio postal; el precio lo versiona TAR en `productPrices`).

## 11. API

> **Nota de rutas:** Rutas normalizadas el 05-11-2026 a la convención de la maestra (§8 y §13: endpoints en inglés; PWA bajo `/api/tar/` en lugar de `/api/pwa/`; pública bajo `/api/public/:tenantSlug/tar/`). Cada fila conserva su ruta anterior en la descripción.

Todas bajo `/api/admin/tar/…` (salvo PWA y pública), JSON, validadas con Zod, con `tenantId` del token, auditoría de escrituras e idempotencia por header `Idempotency-Key` cuando se indica.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-TAR-001 | GET | `/api/admin/tar/tariff-schedules` | `tar.cuadros.ver` | Listar versiones con filtros. Ruta anterior: `/api/admin/tar/cuadros` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-002 | POST | `/api/admin/tar/tariff-schedules` | `tar.cuadros.crear` | Crear versión en borrador. Ruta anterior: `/api/admin/tar/cuadros` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-003 | GET | `/api/admin/tar/tariff-schedules/:id` | `tar.cuadros.ver` | Detalle con categorías, filas, adherentes, precios. Ruta anterior: `/api/admin/tar/cuadros/:id` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-004 | PATCH | `/api/admin/tar/tariff-schedules/:id` | `tar.cuadros.editar` | Editar borrador (cabecera y contenido por clave). Ruta anterior: `/api/admin/tar/cuadros/:id` (convención de rutas en inglés, maestra §13). | Sí (versión optimista) |
| API-TAR-005 | POST | `/api/admin/tar/tariff-schedules/:id/copy` | `tar.cuadros.crear` | Copiar a nuevo borrador (completo o parcial). Ruta anterior: `/api/admin/tar/cuadros/:id/copiar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-006 | GET | `/api/admin/tar/tariff-schedules/:id/diff?against=:otherId` | `tar.cuadros.ver` | Diferencias campo a campo. Ruta anterior: `/api/admin/tar/cuadros/:id/diff?contra=:otroId` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-007 | POST | `/api/admin/tar/tariff-schedules/:id/validate` | `tar.cuadros.editar` | Validación completa sin cambiar estado. Ruta anterior: `/api/admin/tar/cuadros/:id/validar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-008 | POST | `/api/admin/tar/tariff-schedules/:id/submit` | `tar.cuadros.enviar` | Enviar a aprobación. Ruta anterior: `/api/admin/tar/cuadros/:id/enviar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-009 | POST | `/api/admin/tar/tariff-schedules/:id/withdraw` | `tar.cuadros.enviar` | Retirar envío sin firmas. Ruta anterior: `/api/admin/tar/cuadros/:id/retirar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-010 | POST | `/api/admin/tar/tariff-schedules/:id/approve` | `tar.cuadros.aprobar` / `tar.cuadros.aprobarFinal` | Firma de aprobación. Ruta anterior: `/api/admin/tar/cuadros/:id/aprobar` (convención de rutas en inglés, maestra §13). | Sí (por usuario) |
| API-TAR-011 | POST | `/api/admin/tar/tariff-schedules/:id/reject` | `tar.cuadros.rechazar` | Rechazo con motivo. Ruta anterior: `/api/admin/tar/cuadros/:id/rechazar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-012 | POST | `/api/admin/tar/tariff-schedules/:id/publish` | `tar.cuadros.publicar` | Publicar (programada o inmediata). Ruta anterior: `/api/admin/tar/cuadros/:id/publicar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-013 | POST | `/api/admin/tar/tariff-schedules/:id/unpublish` | `tar.cuadros.publicar` | Volver de `scheduled` a `approved` (sin uso). Ruta anterior: `/api/admin/tar/cuadros/:id/despublicar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-014 | POST | `/api/admin/tar/tariff-schedules/:id/close` | `tar.cuadros.publicar` | Cierre sin reemplazo. Ruta anterior: `/api/admin/tar/cuadros/:id/cerrar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-015 | POST | `/api/admin/tar/tariff-schedules/mass-update` | `tar.precios.actualizarMasivo` | Generar borrador con actualización masiva (vista previa con `dryRun`). Ruta anterior: `/api/admin/tar/cuadros/actualizacion-masiva` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-016 | POST | `/api/admin/tar/tariff-schedules/import` | `tar.precios.importar` | Importar planilla (asíncrono). Ruta anterior: `/api/admin/tar/cuadros/importar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-017 | GET | `/api/admin/tar/tariff-schedules/:id/export` | `tar.cuadros.exportar` | Exportar Excel/PDF. Ruta anterior: `/api/admin/tar/cuadros/:id/exportar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-018 | POST | `/api/admin/tar/tariff-schedules/:id/normative-documents` | `tar.normas.adjuntar` | Vincular documento normativo (PDF). Ruta anterior: `/api/admin/tar/cuadros/:id/normas` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-019 | GET/POST/PATCH | `/api/admin/tar/normative-documents` | `tar.normas.adjuntar` | ABM de documentos normativos. Ruta anterior: `/api/admin/tar/normas` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-020 | GET/PATCH | `/api/admin/tar/services/:serviceId/settings` | `tar.cuadros.ver` / `tar.cuadros.editar` | Configuración tarifaria del servicio (versionada). Ruta anterior: `/api/admin/tar/servicios/:serviceId/configuracion` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-021 | GET | `/api/admin/tar/charge-rules` | `tar.reglas.ver` | Listar reglas. Ruta anterior: `/api/admin/tar/reglas` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-022 | POST | `/api/admin/tar/charge-rules` | `tar.reglas.crear` | Crear regla. Ruta anterior: `/api/admin/tar/reglas` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-023 | PATCH | `/api/admin/tar/charge-rules/:id` | `tar.reglas.editar` | Editar borrador de regla. Ruta anterior: `/api/admin/tar/reglas/:id` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-024 | POST | `/api/admin/tar/charge-rules/:id/clone` | `tar.reglas.crear` | Clonar. Ruta anterior: `/api/admin/tar/reglas/:id/clonar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-025 | POST | `/api/admin/tar/charge-rules/:id/reorder` | `tar.reglas.editar` | Subir/bajar dentro de fase y servicio. Ruta anterior: `/api/admin/tar/reglas/:id/orden` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-026 | POST | `/api/admin/tar/charge-rules/:id/submit` · `/approve` · `/reject` · `/publish` | `tar.reglas.editar` / `tar.reglas.aprobar` | Ciclo de aprobación de regla. Ruta anterior: `/api/admin/tar/reglas/:id/enviar` y `/aprobar` y `/rechazar` y `/publicar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-027 | POST | `/api/admin/tar/formulas/compile` | `tar.formulas.editar` | Compilar y validar fórmula GFL (AST, dependencias, errores). Ruta anterior: `/api/admin/tar/formulas/compilar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-028 | POST | `/api/admin/tar/formulas/test` | `tar.formulas.probar` | Evaluar regla con contratos reales sin persistir. Ruta anterior: `/api/admin/tar/formulas/probar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-029 | GET | `/api/admin/tar/functions` | `tar.funciones.ver` | Catálogo de funciones y variables. Ruta anterior: `/api/admin/tar/funciones` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-030 | GET/POST/PATCH | `/api/admin/tar/gas/calorific-factors` | `tar.cuadros.ver` / `tar.cuadros.editar` | Factores de gas. Ruta anterior: `/api/admin/tar/gas/factores` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-031 | GET/POST/PATCH | `/api/admin/tar/category-coefficients` | `tar.cuadros.ver` / `tar.cuadros.editar` | Coeficientes por categoría. Ruta anterior: `/api/admin/tar/coeficientes` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-032 | GET/POST/PATCH | `/api/admin/tar/event-charges` | `tar.eventos.ver` / `tar.cuadros.editar` | Cargos por evento y bonificaciones. Ruta anterior: `/api/admin/tar/cargos-evento` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-033 | GET/POST/PATCH | `/api/admin/tar/benefit-groups` y `/benefit-groups/:id/members` | `tar.grupos.ver` / `tar.grupos.editar` | Grupos de beneficio y miembros. Ruta anterior: `/api/admin/tar/grupos` y `/grupos/:id/miembros` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-034 | GET/POST/PATCH | `/api/admin/tar/subsidies/regimes` | `tar.subsidios.ver` / `tar.subsidios.configurar` | Regímenes de subsidio. Ruta anterior: `/api/admin/tar/subsidios/regimenes` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-035 | POST | `/api/admin/tar/subsidies/roll-imports` | `tar.padrones.importar` | Subir padrón (asíncrono). Ruta anterior: `/api/admin/tar/subsidios/padrones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-036 | POST | `/api/admin/tar/subsidies/roll-imports/:id/confirm` | `tar.padrones.confirmar` | Confirmar padrón validado. Ruta anterior: `/api/admin/tar/subsidios/padrones/:id/confirmar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-037 | GET/PATCH | `/api/admin/tar/subsidies/enrollments` | `tar.subsidios.ver` / `tar.inscripciones.editar` | Inscripciones por suministro. Ruta anterior: `/api/admin/tar/subsidios/inscripciones` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-038 | POST | `/api/admin/tar/subsidies/recategorize` | `tar.padrones.recategorizar` | Recategorización masiva (preview/aplicar). Ruta anterior: `/api/admin/tar/subsidios/recategorizar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-039 | POST | `/api/admin/tar/subsidies/export` | `tar.padrones.exportar` | Exportación al organismo (asíncrono). Ruta anterior: `/api/admin/tar/subsidios/exportar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-040 | GET/POST/PATCH | `/api/admin/tar/promotions` | `tar.promociones.ver` / `tar.promociones.crear` / `tar.promociones.editar` | Promociones. Ruta anterior: `/api/admin/tar/promociones` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-041 | POST | `/api/admin/tar/promotions/:id/assignments` | `tar.promociones.asignar` | Asignar a contrato. Ruta anterior: `/api/admin/tar/promociones/:id/asignaciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-042 | POST | `/api/admin/tar/promotions/assignments/:id/cancel` | `tar.excepciones.aprobar` | Cancelar asignación. Ruta anterior: `/api/admin/tar/promociones/asignaciones/:id/cancelar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-043 | POST | `/api/admin/tar/simulations` | `tar.simulador.ejecutar` / `tar.simulador.masivo` | Simulación individual (síncrona) o masiva (asíncrona, devuelve `runId`). Ruta anterior: `/api/admin/tar/simulaciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-044 | GET | `/api/admin/tar/simulations/:id` y `/results` | `tar.simulador.ejecutar` | Estado, resumen y detalle paginado. Ruta anterior: `/api/admin/tar/simulaciones/:id` y `/resultados` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-045 | POST | `/api/admin/tar/simulations/:id/cancel` | `tar.simulador.masivo` | Cancelar corrida. Ruta anterior: `/api/admin/tar/simulaciones/:id/cancelar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-046 | GET | `/api/admin/tar/simulations/:id/export` | `tar.simulador.ejecutar` | Exportar resumen/detalle. Ruta anterior: `/api/admin/tar/simulaciones/:id/exportar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-047 | GET | `/api/admin/tar/calculations/:id` | `tar.calculo.explicar` | Cálculo con traza. Ruta anterior: `/api/admin/tar/calculos/:id` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-048 | POST | `/api/admin/tar/calculations/:id/replay` | `tar.calculo.explicar` | Recalcular desde la instantánea y comparar hash. Ruta anterior: `/api/admin/tar/calculos/:id/reproducir` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-049 | POST | `/api/admin/tar/retroactive-diffs` | `tar.retroactivo.calcular` | Calcular diferencias retroactivas (asíncrono). Ruta anterior: `/api/admin/tar/retroactivos` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-050 | POST | `/api/admin/tar/retroactive-diffs/:id/approve` · `/reject` | `tar.retroactivo.aprobar` | Aprobar (firma) o rechazar; al completar firmas pide ajustes a M05. Ruta anterior: `/api/admin/tar/retroactivos/:id/aprobar` y `/rechazar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-051 | GET/POST/PATCH | `/api/admin/tar/phone/{rate-plans,time-bands,band-assignments,rates,discount-plans,free-numbers}` | `tar.telefonia.ver` / `tar.telefonia.configurar` | Configuración de tasación. Ruta anterior: `/api/admin/tar/telefonia/{planes,bandas,asignaciones,tarifas,descuentos,gratuitos}` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-052 | POST | `/api/admin/tar/phone/rate` | `tar.telefonia.tasar` | Tasar llamada hipotética o pendientes. Ruta anterior: `/api/admin/tar/telefonia/tasar` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-053 | POST | `/api/admin/tar/phone/rerate` | `tar.telefonia.retasar` | Retasación por rango (asíncrona). Ruta anterior: `/api/admin/tar/telefonia/retasar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-054 | GET/PATCH | `/api/admin/tar/rounding-policies` | `tar.redondeo.configurar` | Políticas de redondeo. Ruta anterior: `/api/admin/tar/redondeo` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-055 | GET/POST/PATCH | `/api/admin/tar/preloaded-charges` | `tar.calculo.ejecutar` | Cargos precargados. Ruta anterior: `/api/admin/tar/precargados` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-056 | GET/POST | `/api/admin/tar/bonuses/recalculation-runs` | `tar.cuadros.editar` | Recálculo masivo de bonificaciones (preview/aplicar). Ruta anterior: `/api/admin/tar/bonificaciones/recalculo` (convención de rutas en inglés, maestra §13). | Con clave |
| API-TAR-057 | GET/PATCH | `/api/admin/tar/settings` | `tar.config.configurar` | Parámetros PRM-TAR. Ruta anterior: `/api/admin/tar/configuracion` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-058 | GET | `/api/admin/tar/approvals` | `tar.cuadros.aprobar` | Bandeja de aprobaciones pendientes del usuario. Ruta anterior: `/api/admin/tar/aprobaciones` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-059 | GET | `/api/admin/tar/reports/:code` | `tar.cuadros.ver` / `tar.calculo.explicar` | Reportes de la sección 15 (con exportación). Ruta anterior: `/api/admin/tar/reportes/:codigo` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-060 | GET | `/api/tar/invoices/:id/explanation` | `tar.explicacion.ver` (antes `pwa.factura.explicacion.ver`) | Explicación para el socio (solo cuentas propias). Ruta anterior: `/api/pwa/facturas/:id/explicacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-061 | GET | `/api/public/:tenantSlug/tar/tariffs` | `public: true` (sin capability, RF-IAM-061; solo si el tenant publica; antes «— (pública sin login…)» y antes `public.cuadros.ver`) | Cuadros publicables vigentes y próximos. Ruta anterior: `/api/public/:tenantSlug/tarifas` (convención de rutas en inglés, maestra §13). | Sí |
| API-TAR-062 | — | — | — | Reemplazado por servicio interno `tar.calculate` (§11.1; la fila de servicio interno no es un endpoint HTTP). | — |
| API-TAR-063 | — | — | — | Reemplazado por servicio interno `tar.rateCalls` (§11.1; la fila de servicio interno no es un endpoint HTTP). | — |
| API-TAR-064 | — | — | — | Reemplazado por servicio interno `tar.quote` (§11.1; la fila de servicio interno no es un endpoint HTTP). | — |
| API-TAR-065 | GET/POST | `/api/platform/tar/functions` · `/templates` | `tar.funciones.administrar` / `tar.plantillas.administrar` (alcance `global`, roles de plataforma; antes `platform.tar.funciones.administrar` / `platform.tar.plantillas.administrar`) | Catálogo global de funciones y plantillas ficticias. Ruta anterior: `/api/platform/tar/funciones` y `/plantillas` (convención de rutas en inglés, maestra §13). | POST con clave |
| API-TAR-066 | GET | `/api/tar/installment-plans?contractId=` · `/api/admin/tar/installment-plans/:contractId` | `por.planObra.ver` (solo cuentas propias; antes ~~`pwa.planObra.ver`~~) / `tar.calculo.explicar` | Plan de cuotas de obra o de adquisición de derecho en **solo lectura** (RF-TAR-119; HUECO-OBR-03): `planKind`, obra/derecho, cuota actual n/N, cuotas facturadas, `balanceAmount`, `billedUnits`/`totalUnits`, `unitKind`, próxima cuota estimada, `status`. Lo consume M19 (PAN-POR-30, bloque "Plan de cuotas de obra"). Ruta anterior: `/api/pwa/tar/planes-cuotas?contractId=` y `/api/admin/tar/planes-cuotas/:contractId` (convención de rutas en inglés, maestra §13). | Sí (lectura) |
| API-TAR-067 | — | — | — | Reemplazado por servicio interno `tar.getRatedCalls` (§11.1; la fila de servicio interno no es un endpoint HTTP). | — |

### 11.1 Servicios internos expuestos a otros módulos (no HTTP)

Funciones del monolito que otros módulos invocan en proceso; no tienen ruta ni capability propia (la autorización la resuelve el módulo que llama). Se movieron aquí desde la tabla de API el 05-11-2026; la fila original queda como "Reemplazado por servicio interno".

| Servicio | Firma | Consumidores | Descripción | Idempotente | Antes |
|---|---|---|---|---|---|
| `tar.calculate` | `tar.calculate(request)` | Módulos M05/M09/M19 | Cálculo individual o por lote (JOB-TAR-03); usado por M05 al liquidar. | Sí (`runId + accountId`) | API-TAR-062 |
| `tar.rateCalls` | `tar.rateCalls(batch)` | M10 | Tasación de llamadas. | Sí | API-TAR-063 |
| `tar.quote` | `tar.quote(request)` | M09/M11/M13/M19 | Cotización de alta (plan, instalación, promoción) para contratación y portal; M13 la usa para cotizar el cargo por equipo no devuelto (RF-STK-078, RN-TAR-246). | Sí | API-TAR-064 |
| `tar.getRatedCalls` | `tar.getRatedCalls({ contractId, period })` | M19 (API-POR-122), M09 | Tasación vigente de las llamadas atribuidas del contrato y período, por `callId`: importe tasado, clave, tipo, banda, plan, fracciones, descuento/gratuidad y versión de tasación; totales por tipo (RF-TAR-120; HUE-TEL-02). Sin CDR ni destino (son de M10). **Períodos archivados** (más de 36 meses; DEC-087, T05 §7.8.2): acepta el período y, si el detalle de llamadas (`callRecords` de M10) ya pasó a archivo en frío, no falla ni devuelve vacío: responde `{ status: 'deferred', deferredRequestId }` y encola la consulta diferida sobre el archivo (`retentionRuns` de T08); el resultado, con el mismo formato y totales, se entrega por notificación con enlace al solicitante (M19 lo traduce en el `202` de API-POR-122). Los totales del período siempre se pueden validar contra el renglón emitido, que queda en línea. | Sí (lectura) | API-TAR-067 |

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox, T11)

| EVT-ID | Evento | Cuándo | Payload principal | Consumidores |
|---|---|---|---|---|
| EVT-TAR-001 | `tar.schedule.submitted` | Versión enviada a aprobación. | `scheduleId`, `version`, `serviceId`, `diffSummary`, `simulationRunId` | T11 (autorización), T09 (aviso a aprobadores) |
| EVT-TAR-002 | `tar.schedule.approved` | Firmas completas. | `scheduleId`, `approvals[]` | T11, auditoría |
| EVT-TAR-003 | `tar.schedule.rejected` | Rechazo. | `scheduleId`, `reason` | T09 (autor) |
| EVT-TAR-004 | `tar.schedule.published` | Publicación (programada o inmediata). | `scheduleId`, `validFrom`, `contentHash` | M05 (planificación de lotes), M19 (landing), T10 |
| EVT-TAR-005 | `tar.schedule.activated` | Entra en vigencia. | `scheduleId`, `previousScheduleId` | M05, M19, T10 |
| EVT-TAR-006 | `tar.schedule.superseded` | Reemplazada. | `scheduleId`, `validTo` | T10 |
| EVT-TAR-007 | `tar.rule.published` | Regla publicada. | `ruleId`, `code`, `version`, `phase` | T10, auditoría |
| EVT-TAR-008 | `tar.calculation.completed` | Corrida de cálculo terminada. | `runId`, `batchId`, `counters{ total, ok, excluded }`, `exclusionsByCode[]` (antes: `runId`, `batchId`, contadores, exclusiones por código; campos nombrados el 05-11-2026) | M05 |
| EVT-TAR-009 | `tar.simulation.completed` | Simulación masiva terminada. | `simulationRunId`, `summary` | T09 (usuario), PAN-TAR-16 |
| EVT-TAR-010 | `tar.promotion.assigned` | Asignación activa. | `assignmentId`, `contractId`, `promotionId` | M09, M19 |
| EVT-TAR-011 | `tar.promotion.consumed` | Ciclo consumido al emitir. | `assignmentId`, `cyclesConsumed`, `invoiceId` | M19 |
| EVT-TAR-012 | `tar.promotion.ended` | Agotada/finalizada/cancelada. | `assignmentId`, `reason` | T09 (aviso al socio), M19 |
| EVT-TAR-013 | `tar.subsidyRoll.imported` | Padrón confirmado. | `rollImportId`, `regimeId`, `diffSummary{ added, removed, changed }` (antes: `rollImportId`, `regimeId`, altas/bajas/cambios; campos nombrados el 05-11-2026) | M06 (rendición), T10 |
| EVT-TAR-014 | `tar.enrollment.changed` | Alta/baja/cambio de inscripción. | `enrollmentId`, `contractId`, `status`, `validFrom` | M02 (recategorización si aplica), M19 |
| EVT-TAR-015 | `tar.retroactiveDiff.computed` | Diferencias calculadas. | `runId`, `totals` (antes: `runId`, totales; campos nombrados el 05-11-2026) | T11 (aprobación) |
| EVT-TAR-016 | `tar.retroactiveDiff.approved` | Diferencias aprobadas. | `runId`, `adjustments[]` | M05 (NC/ND) |
| EVT-TAR-017 | `tar.contractedDemand.updateProposed` | Propuesta de nueva demanda contratada confirmada con la emisión. | `contractId`, `newValue`, `firstExceedanceDate` | M02/M03 |
| EVT-TAR-018 | `tar.category.changeProposed` | Recategorización automática (adherentes por edad, padrón) confirmada. | `contractId`, `fromCategoryId`, `toCategoryId`, `effectiveDate` | M02 |
| EVT-TAR-019 | `tar.calls.rated` | Lote de llamadas tasado/retasado. | `batchId`, `counters`, `errors[]` (antes: `batchId`, contadores, errores; campos nombrados el 05-11-2026) | M10 |
| EVT-TAR-020 | `tar.roundingCarry.confirmed` | Arrastre de redondeo confirmado al emitir. | `accountId`, `amount`, `invoiceId` | M07 |
| EVT-TAR-021 | `tar.injectedCredit.recorded` | Crédito de usuario-generador registrado (modo MER-001). | `contractId`, `kwh`, `amount`, `invoiceId` | M07, M06 |

### 12.2 Eventos consumidos

| Evento | Origen | Reacción de TAR |
|---|---|---|
| `fac.invoice.issued` | M05 | Pasa el cálculo a `issued` y confirma `proposedEffects` (idempotente); emite EVT-TAR-011/017/018/020/021. |
| `fac.invoice.annulled` (EVT-FAC-08) | M05 | Revierte efectos reversibles (8.5). |
| `fac.billingRun.discarded` (EVT-FAC-21) | M05 | Descarta cálculos `draft/observed/approved` del lote. |
| `med.consumption.approved` | M03 | Habilita consumos para cálculo; invalida simulaciones en caché del contrato. |
| `cat.contract.activated` | M02 | Activa promociones `pending`; fecha de inicio de devengamiento. |
| `cat.contract.planChanged` (EVT-CAT-18) | M02 | Aplica `onPlanChange` de promociones; registra tramos del período. |
| `cat.contract.suspended` / `cat.contract.reactivated` / `cat.contract.terminated` | M02/M08 | Tramos de suspensión; fin de promociones; cargos por evento habilitados. |
| `tec.installation.activationConfirmed` (EVT-TEC-16) | M10 | Disparador de cargos por evento (instalación) y de promociones con `startTrigger = installation`. |
| `tec.workOrder.closed` (EVT-TEC-07; OT de cambio de categoría) | M10 | Categoría histórica (RN-TAR-045). |
| `tec.cdr.attributed` (EVT-TEC-27) | M10 | Lanza JOB-TAR-09. |
| `tec.quotaUsage.reported` (EVT-TEC-38) | M10 | Marca el contrato y período como "consumo informado" para el próximo cálculo de correo o pack SMS; si el período ya está facturado, solo registra la revisión en la traza (RN-TAR-251; DEC-084). El dato se lee con API-TEC-56 al calcular. |
| `fis.normativeAdoption.approved` (EVT-FIS-10) | M06 | Revalida reglas `tax` vinculadas; marca simulaciones abiertas como desactualizadas. |
| `cfg.parameter.changed` (EVT-CFG-07) | T04 | Recarga parámetros PRM-TAR (vigentes desde su fecha). |
| `tes.exchangeRate.published` (EVT-TES-19) / `cfg.economicIndex.valuePublished` (EVT-CFG-12) | M14 / T04 | Disponibilidad de cotizaciones e índices para cálculo. |
| `stk.equipment.returnOverdue` (EVT-STK-07) | M13 | Si PRM-TAR-169 está activo y hay cargo `equipment_not_returned` aprobado: cotiza el cargo por equipo no devuelto (RN-TAR-246); si no, sin efecto. |
| `stk.equipment.chargeApproved` (EVT-STK-08) | M13 | Crea el ítem `billableItems` de M05 (`sourceType = equipmentNotReturned`, vía `fac.service.upsertBillableItem`; antes ~~`preloadedCharges`~~, CTR-DAT-38) idempotente por `assignmentId` (RN-TAR-246). `stk.equipment.chargeProposed` se ignora. |
| `tec.levy.approved` (EVT-TEC-25) | M10 (obras) | Lanza JOB-TAR-14: crea un plan de cuotas de obra por beneficiario (RF-TAR-116; HUECO-OBR-01). |
| `cat.contract.activated` (EVT-CAT-09), contratos tipo 17 | M02 | Vincula planes `pendingContract` de la misma obra e inmueble y los pasa a `active` (RF-TAR-116). |
| `soc.cemeteryAct.performed` (EVT-SOC-06) | M18 | Cargo por acto de cementerio (RN-TAR-248), idempotente por `actId`. |
| `soc.trip.completed` (EVT-SOC-07) | M18 | Cargo por traslado con cobertura/coseguro (RN-TAR-249), idempotente por `tripId`. |
| `cat.contract.meteringRegimeChanged` (EVT-CAT-28) | M02 | Cambia la base de cálculo del contrato desde `effectiveAt` (cuota fija ↔ consumo, RN-CAT-078); prorratea el período del cambio como un cambio de tramo (HUE-AG-03; RF-TAR-121, RN-TAR-250). |

### 12.3 Jobs (BullMQ)

| JOB-ID | Cola `tar:<proceso>` | Frecuencia / disparo | Descripción | Reintentos y recuperación |
|---|---|---|---|---|
| JOB-TAR-01 | `tar:activar-versiones` | Diario 00:05 zona del tenant y al publicar | Activa versiones `scheduled` con `validFrom` ≤ hoy y cierra las anteriores. | Idempotente por `scheduleId`; 5 reintentos exponenciales; alerta a soporte. |
| JOB-TAR-02 | `tar:simular-masivo` | A pedido | Simulación masiva comparativa por bloques (PRM-TAR-020). | Reanudable por bloque; cancelable. |
| JOB-TAR-03 | `tar:calcular-lote` | A pedido de M05 | Cálculo de un lote de cuentas por bloques. | Unidad = cuenta; reintento solo de fallidas; aborta sobre PRM-TAR-113. |
| JOB-TAR-04 | `tar:importar-padron` | A pedido | Validación y cruce de padrones. | Reintento manual con nuevo archivo. |
| JOB-TAR-05 | `tar:recategorizar` | A pedido | Recategorización masiva por padrón/edad/gas (preview y aplicación vía M02). | Idempotente por (`contractId`, `effectiveDate`). |
| JOB-TAR-06 | `tar:diferencias-retroactivas` | Al publicar con vigencia pasada o a pedido | Diferencias contra comprobantes emitidos. | Reanudable. |
| JOB-TAR-07 | `tar:migrar-cuadros` | Migración (T07) | Reconstrucción de versiones desde `CUADROS` + `HIS_*` + tablas vivas. | Re-ejecutable con limpieza del tenant en staging. |
| JOB-TAR-08 | `tar:traducir-formulas` | Migración y a pedido | Traducción DevExpress → GFL con casos de prueba. | Re-ejecutable por regla. |
| JOB-TAR-09 | `tar:tasar-llamadas` | Al recibir `tec.cdr.attributed` (EVT-TEC-27); cada hora si PRM-TAR-083 | Tasación de llamadas pendientes. | Unidad = llamada; idempotente. |
| JOB-TAR-10 | `tar:retasar` | A pedido | Retasación por rango conservando IDs. | Reanudable. |
| JOB-TAR-11 | `tar:aviso-fin-promociones` | Diario | Avisos de último ciclo / fin de promoción; publica EVT-TAR-012. Dueño único del fin de promociones: M02 solo reacciona (JOB-CAT-10). | Idempotente por (`assignmentId`, tipo de aviso). |
| JOB-TAR-12 | `tar:purgar-simulaciones` | Semanal | Purga simulaciones y cálculos descartados vencidos (PRM-TAR-151). | — |
| JOB-TAR-13 | `tar:exportar-padron` | A pedido | Exportación de beneficiarios al organismo. | Re-ejecutable. |
| JOB-TAR-14 | `tar:crear-planes-obra` | Al recibir `tec.levy.approved` (EVT-TEC-25) y `cat.contract.activated` de contratos tipo 17 | Crea un `worksInstallmentPlans` por beneficiario de la obra (o lo deja `pendingContract`) y vincula los pendientes al activarse el contrato (RF-TAR-116; HUECO-OBR-01). | Idempotente por (`workId`, `premiseId`); 5 reintentos; beneficiarios fallidos quedan en un informe sin bloquear al resto. |

## 13. Integraciones

TAR no tiene integraciones externas directas salvo archivos; todas siguen el marco de T06 (bóveda de credenciales, registro de intercambios, reintentos).

| Integración | Ficha | Particularidad en TAR |
|---|---|---|
| Padrones de tarifa social / segmentación / subsidios (organismos nacionales y provinciales) | FIC 7 (T06) | Importación de archivos con formato por régimen (por DNI, por suministro, por NIS); exportación de beneficiarios y consumos; sin presuponer API estatal (RN-TAR-205). |
| Cuadros tarifarios de reguladores y distribuidoras (ERSeP, ENARGAS, Secretaría de Energía, EPEC u otras) | T06 | Importación de cuadros desde planilla (PAN-TAR-05) y PDF normativo adjunto; nunca precarga automática de tarifas reales (RN-TAR-239). |
| Factores de gas de la distribuidora | T06 | Importación periódica de factores (PAN-TAR-09). |
| CDR de centrales y proveedores de telefonía | T06 / M10 | M10 importa; TAR tasa (9.8). |
| Proveedores de telefonía móvil (reventa) | T06 / M10 | M10 importa conceptos; llegan como ítems de `billableItems` de M05 (`sourceType = mobileProviderImport`, vía `fac.service.upsertBillableItem`; antes ~~`preloadedCharges`~~, CTR-DAT-38). |
| ARCA (rendición RG 5746/2025 de usuarios-generadores) | T06 / M06 | TAR aporta los datos de inyección y créditos; M06 rinde. |
| Cotizaciones (BNA u otra fuente) e índices de inflación | T04 / T06 | Fuente configurada (PRM-TAR-015). |

## 14. Parámetros de configuración

Ámbito: P plataforma, T tenant, S servicio, C categoría. Los parámetros se versionan en T04 y el motor usa el valor vigente a la fecha de referencia del cálculo.

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-TAR-004 | `tar.approval.thirdSignatureRequired` | enum (`never`, `always`, `over_threshold`) | T/S | `never` | Tercera firma para publicar versiones. | — (DFA M7) |
| PRM-TAR-005 | `tar.approval.simulationRequired` | enum (`none`, `sample`, `full`, `by_size`) | T/S | `by_size` | Simulación exigida antes de enviar (PA-TAR-09). | — (DFA M7) |
| PRM-TAR-006 | `tar.approval.normativeRequired` | bool | T/S | `true` para servicios regulados | Exigir documento normativo con PDF para enviar. | — (DFA M7) |
| PRM-TAR-007 | `tar.approval.presentationSingleSignature` | bool | T | `true` | Cambios de solo presentación con una firma. | — (AGR-009) |
| PRM-TAR-010 | `tar.referenceDate.mode` | enum (`reading_date`, `period_start`, `period_end`, `issue_date`) | T/S | `reading_date` medidos, `period_start` no medidos | Fecha de referencia tarifaria (PA-TAR-04). | — (RN-01 duda 24) |
| PRM-TAR-011 | `tar.calendar.timezone` | string | T | `America/Argentina/Cordoba` | Zona horaria de cálculo. | — (AGR-017) |
| PRM-TAR-012 | `tar.inAdvance.firstInvoiceMode` | enum (`fraction_only`, `fraction_plus_next`) | S | `fraction_plus_next` | Primer comprobante en mes adelantado. | — (BASE §73) |
| PRM-TAR-013 | `tar.promotion.endNoticeDays` | int | T | 10 | Días de aviso previo al fin de promoción. | — (CU-PRO-01) |
| PRM-TAR-014 | `tar.largeCustomer.reviewThreshold` | decimal | T/S | 0 (desactivado) | Importe sobre el cual el cálculo queda `observed`. | — (MER-003) |
| PRM-TAR-015 | `tar.fx.source` | enum + tipo (`seller`, `buyer`) | T | fuente T04, vendedora | Fuente y tipo de cotización; fecha según PA-TAR-16. | — (RN-01 §3.1) |
| PRM-TAR-016 | `tar.promotion.partialCycleConsumesDefault` | bool | T | `false` | Default de consumo del ciclo parcial (PA-TAR-05). | — |
| PRM-TAR-020 | `tar.batch.accountsPerBlock` | int | T | 500 | Cuentas por bloque en lotes y simulaciones. | 2315 |
| PRM-TAR-030 | `tar.lateReturn.conceptId` | ref concepto | T | vacío | Concepto del cargo por atraso en devolución de productos prestados. | 3134 |
| PRM-TAR-031 | `tar.prepaid.voucherTypeId` | ref tipo comprobante | T | vacío | Tipo de comprobante de prepaga (editor y simulación). | 2243 |
| PRM-TAR-040 | `tar.fixedCharge.byTierEnabled` | bool | T | `false` | Permite cargo fijo por tramo/escalón desde la tarifa. | 2821 |
| PRM-TAR-041 | `tar.tiers.proportionalOnlyForTierSelection` | bool | T | `false` | Proporción solo para elegir tramo; observación "Beneficio por Días". | 2827 |
| PRM-TAR-042 | `tar.minimum.allowChargeWhenDownFlag` | bool | T | `false` | Habilita la marca "cobrar mínimo en baja"; si no, mínimo solo a conectados. | 2465 |
| PRM-TAR-043 | `tar.daysFactor.skipWhenFewerDays` | bool | T | `false` | No aplicar factor por días si los días son menos que la referencia. | 2864 |
| PRM-TAR-044 | `tar.fixedCharge.byTierIgnoreInjected` | bool | T | `false` | Cargo fijo por tramo sin restar inyectada (requiere PRM-TAR-040). | 3103 |
| PRM-TAR-045 | `tar.fixedCharge.sharedMeterCategories` | lista de categorías | T | vacío | Categorías con multicategoría (medidores compartidos). | 2750 |
| PRM-TAR-050 | `tar.gas.optimalCalorificFactor` | decimal | T/S | 9.300 | Factor calórico óptimo (divisor). | 14 |
| PRM-TAR-051 | `tar.gas.correctedRounding` | enum (`truncate`, `round0`, `round2`, `round6`, `divide_only`) | T/S | `round0` | Redondeo del consumo corregido de gas. | 119 |
| PRM-TAR-052 | `tar.gas.useRealConsumption` | bool | T/S | `false` | Utilizar consumo real de gas natural (sin lectura directa en el código relevado; [VERIFICAR] efecto en LAG). | 149 |
| PRM-TAR-060 | `tar.relatedService.onlyPending` | bool | T | `false` | Tomar consumos pendientes al usar consumo de otro servicio. | 2701 |
| PRM-TAR-061 | `tar.relatedService.onlyUnbilled` | bool | T | `false` | Solo consumos sin liquidar del servicio relacionado. | 3143 |
| PRM-TAR-062 | `tar.powerFactor.includeInjected` | bool | T | `false` | Incluir inyectada en la activa del factor de potencia. | 2737 |
| PRM-TAR-063 | `tar.injected.creditConceptId` | ref concepto | T | vacío | Concepto de anticipo por inyectada (modo compatibilidad). | 3094 |
| PRM-TAR-064 | `tar.zeroConsumption.extraLinePerVersion` | bool | T | `false` | Renglón extra por versión con consumo 0 y prorrateo. | 2876 |
| PRM-TAR-065 | `tar.prepaid.tierChangeConceptId` | ref concepto | T | vacío | Concepto de recargo por cambio de tramo en prepaga. | 2283 |
| PRM-TAR-066 | `tar.fixedServices.historicCategoryInArrears` | bool | T | `false` | Categoría histórica en fijos por mes vencido. | 3111 |
| PRM-TAR-067 | `tar.categoryChange.workOrderOperation` | ref operación técnica | T | vacío | Operación de OT que indica cambio de categoría. | 2330 |
| PRM-TAR-068 | `tar.proportional.includeStartDay` | bool | T/S | `false` migrados, `true` nuevos | Tomar el día de alta/reconexión en el proporcional. | 2787 |
| PRM-TAR-070 | `tar.waterProperty.zonalThreshold` | decimal | S | 0,8 | Umbral de coeficiente zonal (agua por inmueble). | — (constante del código) |
| PRM-TAR-071 | `tar.waterProperty.minQuotaFactor` | decimal | S | 0,7 | Factor de cuota mínima (agua por inmueble). | — (constante del código) |
| PRM-TAR-072 | `tar.housing.minPercentEventual` | decimal | T | 0 | Mínimo a pagar en factura eventual de vivienda. **Reemplazado por PRM-SOC-019 (HUECO-VIV-02).** | 634 |
| PRM-TAR-073 | `tar.housing.minPercentAfterAward` | decimal | T | 0 | Mínimo luego de adjudicar vivienda. **Reemplazado por PRM-SOC-018 (HUECO-VIV-02).** | 635 |
| PRM-TAR-080 | `tar.phone.zeroLineWhenNoCalls` | bool | S | `false` | Renglón en 0 sin llamadas. | 2514 |
| PRM-TAR-081 | `tar.phone.cppConceptId` | ref concepto | S | vacío | Concepto para CPP (clave 100). Dueño único; PRM-CAT-091 (M02) es alias de solo lectura (HUE-TEL-03). | 19 |
| PRM-TAR-082 | `tar.phone.internationalConceptId` | ref concepto | S | vacío | Concepto para internacionales. Dueño único; PRM-CAT-092 (M02) es alias de solo lectura (HUE-TEL-03). | 24 |
| PRM-TAR-083 | `tar.phone.autoRateOnImport` | bool | S | `true` | Tasar automáticamente al importar CDR (JOB-TAR-09). | — (CoopApps) |
| PRM-TAR-084 | `tar.phone.autoRateInternational` | bool | S | `true` | Tasar automáticamente internacionales (clave siempre del prefijo). | 62 |
| PRM-TAR-085 | `tar.phone.defaultRatePlanId` | ref plan | S | plan 1 migrado | Plan tarifario por defecto sin línea atribuida. | 2344 (RN-07 §8.10) |
| PRM-TAR-086 | `tar.phone.prepaidEnabled` | bool | T | `false` | Habilitar teléfonos prepagos. | 236 |
| PRM-TAR-087 | `tar.phone.prepaidService` | bool (propiedad del servicio, dueño M10) | S | `false` | El servicio es de telefonía prepaga; TAR lo lee. | 332 |
| PRM-TAR-088 | `tar.phone.virtualPbxEnabled` | bool (propiedad del servicio, dueño M10) | S | `false` | El servicio es central virtual (internas gratis); TAR lo lee. | 82 |
| PRM-TAR-089 | `tar.phone.minimumCallAmount` | decimal (con `validFrom`) | S | 0 | Importe mínimo de llamadas no gratuitas. | 64 |
| PRM-TAR-090 | `tar.phone.minimumChargeExemptKeys` | lista de claves | S | vacía (ProCoop activo = 0 y 1) | Claves sin importe mínimo. | 471 |
| PRM-TAR-091 | `tar.phone.zeroRatedKeysByFormat` | mapa formato → claves | conector | vacío (ProCoop activo = Telco IP → 99) | Claves con importe 0 según el formato de importación. | 2346 |
| PRM-TAR-092 | `tar.mobile.smsPackServiceId` | ref servicio | S | vacío | Servicio de pack SMS. | 2253 |
| PRM-TAR-093 | `tar.demand.prorationEnabled` | bool | T | `false` | Permite prorratear demandas en grandes consumos. | 2928 |
| PRM-TAR-094 | `tar.demand.contractedUpdateMode` | enum (`automatic_logged`, `approval`) | T | `automatic_logged` | Confirmación de la actualización de contratada (PA-TAR-13). | — (RN-01 §11.2) |
| PRM-TAR-095 | `tar.powerFactor.cosFloor` | decimal | T | 0 | Piso del coseno calculado. | 2659 |
| PRM-TAR-096 | `tar.powerFactor.tangentK` | decimal | T | 1,5 | K del método tangente. | 2375 |
| PRM-TAR-097 | `tar.powerFactor.cosineK` | decimal | T | 0 | K del método coseno 2. | 2407 |
| PRM-TAR-098 | `tar.powerFactor.bandK` | decimal | T | 1,5 | Constante de los métodos 3 y 4 (antes fija). | — (constante del código) |
| PRM-TAR-099 | `tar.powerFactor.defaultSurchargeConceptId` | ref concepto | T | vacío | Concepto por defecto de recargo por factor de potencia. | 2091 |
| PRM-TAR-100 | `tar.powerFactor.defaultBonusConceptId` | ref concepto | T | vacío | Concepto por defecto de bonificación. | 2092 |
| PRM-TAR-101 | `tar.powerFactor.defaultCap` | decimal | T | 0,95 (ficticio editable) | Tope de coseno por defecto al crear categoría. | 2093 |
| PRM-TAR-102 | `tar.powerFactor.defaultNoBonus` | bool | T | `false` | "No bonificar" por defecto. | 243 |
| PRM-TAR-103 | `tar.display.orderRowsByConcept` | bool | T | `false` | Ordenar filas por concepto en la configuración (solo visualización). | 2520 |
| PRM-TAR-104 | `tar.calc.allowAllServicesWithPreviousSchedule` | bool | T | `false` | Permitir liquidar todos los servicios con una versión anterior (forzada) en lotes de corrección. | 2404 |
| PRM-TAR-105 | `tar.calc.zeroInvoiceWhenReadings` | bool | T | `false` | Devolver cálculo con neto 0 si hubo lecturas (M05 decide emitir). | 2526 |
| PRM-TAR-106 | `tar.prepaid.allowZeroAmount` | bool | T | `false` | Permitir cálculo de prepaga por 0. | 3109 |
| PRM-TAR-107 | `tar.discount.conceptId` | ref concepto | T | vacío | Concepto para descuentos en comprobantes. | 2564 |
| PRM-TAR-108 | `tar.product.allowZeroUnitPrice` | bool | T | `false` | Permitir precio unitario 0 en productos. | 2644 |
| PRM-TAR-109 | `tar.calc.serviceSelfBillingFlag` | bool | T | `false` | Permite indicar qué servicios se liquidan solos y cuáles con otros. | 3191 |
| PRM-TAR-110 | `tar.gfl.maxDepth` | int | P/T | 64 | Profundidad máxima del AST. | — |
| PRM-TAR-111 | `tar.gfl.maxNodes` | int | P/T | 2.000 | Nodos máximos por fórmula. | — |
| PRM-TAR-112 | `tar.gfl.timeoutMs` | int | P/T | 50 por fórmula / 2.000 por cuenta | Tiempo máximo. | — |
| PRM-TAR-113 | `tar.batch.errorAbortPercent` | decimal | T | 5 % | Porcentaje de cuentas con error que detiene el lote (PA-TAR-18). | — |
| PRM-TAR-114 | `tar.gas.recatBimonthlyNumbering` | bool | S | `false` | Numeración 1–6 de períodos bimestrales de gas al recategorizar. | 2498 |
| PRM-TAR-115 | `tar.gas.recatUseReadingDate` | bool | S | `false` | Usar fecha de lectura en recategorización de gas. | 2530 |
| PRM-TAR-120 | `tar.postage.skipForElectronicInvoice` | bool | T (override por tipo de comprobante) | `true` | No cobrar franqueo si adhirió a comprobante electrónico con correo. | 2663 |
| PRM-TAR-121 | `tar.advance.defaultConceptId` | ref concepto | T | vacío | Concepto por defecto del renglón de anticipo. | 29 |
| PRM-TAR-122 | `tar.advance.applyOnNextInvoice` | bool | T | `true` | Descontar anticipo en el próximo comprobante. | 185 |
| PRM-TAR-123 | `tar.advance.productAdvancesEnabled` | bool | T | `false` | Anticipos de productos en lotes. | 3038 |
| PRM-TAR-124 | `tar.rounding.itemRoundingEnabled` | bool | T | `false` | Habilita redondeo de renglones por tipo de comprobante. | 2278 |
| PRM-TAR-125 | `tar.rounding.globalType` | enum (1, 2, 3) | T | 1 | Tipo de redondeo global. | 742 |
| PRM-TAR-126 | `tar.rounding.globalDecimals` | enum (−100, −50, −20, −10, −5, 0, 1, 2) | T | 2 | Decimales/múltiplo global. | 2097 |
| PRM-TAR-127 | `tar.rounding.previousConceptId` | ref concepto | T | vacío | Concepto "redondeo anterior". | 2096 |
| PRM-TAR-128 | `tar.rounding.conceptId` | ref concepto | T | vacío | Concepto de redondeo. | 2095 |
| PRM-TAR-129 | `tar.rounding.disableTotal` | bool | T | `false` | No redondear el total del comprobante. | 21 |
| PRM-TAR-130 | `tar.rounding.prepaidMaxAutoAmount` | decimal (nullable) | T | 1,00 [VERIFICAR] | Importe máximo de redondeo automático en prepaga. | 2342 |
| PRM-TAR-131 | `tar.rounding.carryAsLedgerMovement` | bool | T | `true` | El arrastre se registra como movimiento en M07 (PA-TAR-06). | — |
| PRM-TAR-132 | `tar.witness.allowEstimation` | bool | T | `false` | Permite estimar consumos de testigos (M03). | 3192 |
| PRM-TAR-133 | `tar.tax.companyVatStatus` | ref situación | T | vacío | Situación de IVA de la empresa (búsqueda de alícuotas, M06). | 527 |
| PRM-TAR-134 | `tar.tax.vatTaxCode` | ref tributo | T | vacío | Código de tributo IVA. | 543 |
| PRM-TAR-135 | `tar.tax.uncategorizedVatStatus` | ref situación | T | vacío | Situación de IVA para no categorizados. | 544 |
| PRM-TAR-140 | `tar.split.requirePeriod` | bool | T | `false` | Especificar período al dividir consumos (M03) y filtrar al liquidar. | 2417 |
| PRM-TAR-150 | `tar.precision` | objeto | P/T | precio 6, cantidad 4, fracción 6, importe 2 | Precisión por magnitud (PA-TAR-15). | — |
| PRM-TAR-151 | `tar.retention.simulationDays` | int | T | 90 | Retención de simulaciones y cálculos descartados. | — |
| PRM-TAR-152 | `tar.preloaded.approvalThreshold` | decimal | T | 0 (sin aprobación) | Importe sobre el cual un cargo precargado manual requiere aprobación. | — |
| PRM-TAR-153 | `tar.simulation.alertVariationPercent` | decimal | T | 20 % | Variación que marca cuentas en la simulación. | — |
| PRM-TAR-154 | `tar.retroactive.minDiffAmount` | decimal | T | 1,00 | Diferencia mínima para generar ajuste retroactivo. | — |

Parámetros V2 relacionados que **no** son de TAR (se especifican en el módulo indicado): 578 recargo entre vencimientos (M05); 2549 punto de venta 0 (M05); 2443 no facturar cuotas sin servicios (M05); 2413 retención/bonificación de prepaga en otro comprobante, 2210, 2245, 1023, 1024 prepaga (M07/M03); 325 y 400 concepto de anticipo manual (M07); 2442 períodos máximos de estimación (M03); 2302 y 2444 importación de llamadas (M10); 3138 punitorios sobre energía (M08); 307, 311, 607, 2089, 2289, 2512, 2607, 2624 conceptos de cuotas e intereses (M08); 77, 208, 354, 2068 stock (M11/M13).

### 14.2 Parámetros de T04b con destino M04 que se agregan

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-TAR-155 | `tar.bonificaciones.permitirPorSuministro` | bool | T | `false` | Permite asignar bonificación de consumo (unidades) por suministro además de por categoría. | 2290 |
| PRM-TAR-156 | `tar.tarifaSocial.unaConexionSocialPorAsociadoYServicio` | bool | T | `true` | Un asociado no puede tener dos conexiones con categoría o inscripción social del mismo servicio; la importación lo informa como conflicto. | 2740 |
| PRM-TAR-157 | `tar.prorrateo.diaLimiteCambioCategoria` | int (1–31) | T/S | 15 | Día límite del período para cobrar proporcional por cambio de categoría técnica. | 2755 |
| PRM-TAR-158 | `tar.segmentacion.consumoMedioRecategorizacion` | decimal (kWh, versionado) | T/S | vacío | Consumo medio de referencia de la recategorización por segmentación. | 2797 |
| PRM-TAR-159 | `tar.segmentacion.importacion.incluirDesconectados` | bool | T | `false` | Incluir servicios desconectados al cruzar padrones de segmentación. | 2825 |
| PRM-TAR-160 | `tar.segmentacion.identificadorSuministro` | enum (`numeroSuministro`, `nis`, `numeroMedidor`) | T | `numeroSuministro` | Clave de cruce de los archivos de tarifa social y segmentación. | 2927 |
| PRM-TAR-161 | `tar.tarifaSocial.importacion.aplicarTopeConsumo` | bool | T | `true` | Aplicar el tope de consumo del régimen al confirmar el padrón. | 3099 |
| PRM-TAR-162 | `tar.tarifaSocial.importacion.incluirConTarifaVigente` | bool | T | `false` | Incluir en la importación cuentas que ya tienen inscripción social vigente (renovación). | 3136 |
| PRM-TAR-163 | `tar.segmentacion.restablecerACategoriaBase` | bool | T | `true` | Al restablecer, volver a la categoría base del contrato. | 3155 |
| PRM-TAR-164 | `tar.segmentacion.gas.usarOrdenCategoria` | bool | T/S | `false` | Usar el orden de categoría en la recategorización de gas. | 3184 |
| PRM-TAR-165 | `tar.gas.recategorizacion.solicitarFechaDesde` | bool | S | `false` | Pedir "fecha desde" de lecturas de gas al recategorizar. | 2643 |
| PRM-TAR-166 | `tar.telephony.prepaidCreditConceptId` | ref concepto | S | vacío | Concepto del crédito de telefonía prepaga. | 2099 |
| PRM-TAR-167 | `tar.telephony.mobileRatePlanId` | ref plan | S | vacío | Plan tarifario de llamadas a celulares. | 13 |
| PRM-TAR-168 | `tar.gas.requirePressureTemperature` | bool | T/S | `false` | Exigir presión y temperatura para aprobar los factores de gas del período (reemplaza PRM-MED-072; HUE-GAS-03). | — |
| PRM-TAR-169 | `tar.eventCharges.equipmentNotReturned.enabled` | bool | T/S | `false` | Habilita el cargo por equipo no devuelto (RN-TAR-246; HUE-INT-01). Encenderlo exige regla aprobada según RN-MOR-101. | — |
| PRM-TAR-170 | `tar.trip.multiLegBilling` | enum (`sum_on_original`, `per_leg`) | T/S | `sum_on_original` | Cobro de viajes multitramo: una vez sobre el viaje original con la suma de km, o por tramo (RN-TAR-249; HUECO-SAL-01). | — |
| PRM-TAR-171 | `tar.tic.quotaCarryOver` | boolean | T/S | `false` | Acumula el cupo no usado de correo o pack SMS al período siguiente (un solo período; RN-TAR-251; DEC-084). | — |

### 14.3 Alineación con T04b

T04b es el catálogo canónico de parámetros V2; si una clave de 14.1 difiere de la de T04b, la clave de T04b se registra como alias en T04 y ambas resuelven al mismo valor. "Lectura" indica que el dueño es otro módulo y TAR solo consulta el valor.

| PRM-TAR | V2 #n | PRM-ID T04b | Decisión T04b | Alineación en M04 |
|---|---|---|---|---|
| 004–016, 070, 071, 094, 098, 110–113, 131, 150–154 | — | — | — | Parámetros nuevos de CoopApps, sin origen V2. |
| 020 | 2315 | PRM-PLA-P2-001 | Plataforma | El lote de M05 usa el valor de plataforma (100); PRM-TAR-020 solo fija el bloque de simulaciones y diferencias retroactivas (CTR-TAR-31). |
| 030 | 3134 | PRM-SOC-P2-001 | Migrar-servicio (M18) | Lectura. |
| 031 | 2243 | PRM-FAC-P2-081 | Migrar (M05) | Lectura. |
| 040 | 2821 | PRM-TAR-P1-005 | Migrar-servicio | Ámbito categoría/versión de cuadro (atributo de `tariffCategoryRates`). |
| 041 | 2827 | PRM-TAR-P2-031 | Migrar-servicio | Ámbito servicio. |
| 042 | 2465 | PRM-TAR-P2-020 | Migrar-servicio | Ámbito categoría. |
| 043 | 2864 | PRM-TAR-P2-032 | Migrar-servicio | Ámbito servicio. |
| 044 | 3103 | PRM-TAR-P1-009 | Migrar-servicio | Depende de PRM-TAR-040. |
| 045 | 2750 | PRM-TAR-P2-029 | Migrar-servicio | La lista se convierte en marca por categoría. |
| 050 | 14 | PRM-TAR-P2-001 | Migrar-servicio | Igual. |
| 051 | 119 | PRM-TAR-P2-004 | Migrar-servicio | Enum ampliado con `round2` y `round6` (CTR-TAR-32). |
| 052 | 149 | PRM-TAR-P2-005 | Migrar-servicio | Igual. |
| 060 | 2701 | PRM-TAR-P2-027 | Migrar-servicio | Igual. |
| 061 | 3143 | PRM-TAR-P2-036 | Migrar-servicio | Igual. |
| 062 | 2737 | PRM-TAR-P2-028 | Migrar-servicio | Igual. |
| 063 | 3094 | PRM-TAR-P2-034 | Migrar-servicio | Solo en modo compatibilidad (PA-TAR-14). |
| 064 | 2876 | — | Reemplazado | En producción el valor es fijo `false`; solo se activa en el paralelo para comparar renglón a renglón (CTR-TAR-33). |
| 065 | 2283 | PRM-TAR-P2-015 | Migrar-servicio | Igual. |
| 066 | 3111 | PRM-TAR-P2-035 | Migrar-servicio | Igual. |
| 067 | 2330 | PRM-CAT-P1-008 | Migrar-servicio (M02) | Lectura. |
| 068 | 2787 | PRM-TAR-P2-030 | Migrar-servicio | Igual (default por origen del tenant). |
| 069 (lectura) | 2707 | PRM-MOR-P1-006 | Migrar (M08/M04) | Lectura; si reinicia la fecha de alta, el proporcional parte de la reconexión. |
| 072, 073 | 634, 635 | PRM-SOC-P4-001, PRM-SOC-P4-002 | Migrar (M18) | Lectura. Reemplazados por PRM-SOC-019 y PRM-SOC-018 (HUECO-VIV-02). |
| 080 | 2514 | PRM-TAR-P2-022 | Migrar-servicio | Dueño M04; PRM-FAC-154 de M05 lo lee (CTR-TAR-34). |
| 081, 082 | 19, 24 | PRM-TAR-P2-002, PRM-TAR-P2-003 | Migrar-servicio | Igual. M04 dueño; PRM-CAT-091/092 de solo lectura (HUE-TEL-03). |
| 083 | — | — | — | Nuevo de CoopApps. |
| 084 | 62 | PRM-TAR-P4-002 | Migrar-servicio | Igual. |
| 085 | 2344 | PRM-TAR-P4-007 | Migrar-servicio | Igual. |
| 086 | 236 | PRM-TAR-P4-004 | Migrar | Ámbito tenant. |
| 087, 088 | 332, 82 | PRM-TEC-P4-073, PRM-TEC-P4-071 | Migrar-servicio (M10) | Lectura. |
| 089, 090 | 64, 471 | PRM-TAR-P4-003, PRM-TAR-P4-005 | Migrar-servicio | Igual. |
| 091 | 2346 | PRM-TAR-P4-008 | Migrar | Ámbito conector. |
| 092 | 2253 | PRM-TAR-P2-014 | Migrar-servicio | Igual. |
| 093 | 2928 | PRM-TAR-P2-033 | Migrar-servicio | Ámbito categoría. |
| 095–097 | 2659, 2375, 2407 | PRM-TAR-P2-025, PRM-TAR-P2-017, PRM-TAR-P2-019 | Migrar-servicio | Ámbito categoría. |
| 099–102 | 2091, 2092, 2093, 243 | PRM-TAR-P2-008, P2-009, P2-010, P2-006 | Migrar-servicio | Defaults al crear categoría. |
| 103 | 2520 | — | Descartar | No es parámetro: orden y vistas guardadas del DataTable; `displayOrderByConcept` queda como vista por defecto (CTR-TAR-35). |
| 104 | 2404 | PRM-TAR-P2-018 | Migrar | Igual. |
| 105 | 2526 | PRM-FAC-P2-002 | Migrar (M05) | Lectura: TAR siempre devuelve el cálculo con neto 0; M05 decide emitir (CTR-TAR-36). |
| 106 | 3109 | PRM-MED-P3-007 | Migrar (M03) | Lectura. |
| 107 | 2564 | PRM-FAC-P2-011 | Migrar (M05) | Lectura (CTR-TAR-36). |
| 108 | 2644 | PRM-VEN-P2-042 | Migrar (M11) | Lectura (CTR-TAR-36). |
| 109 | 3191 | — | Reemplazado | Atributo `billingMode` del servicio en M02 (CTR-TAR-36). |
| 114, 115 | 2498, 2530 | PRM-TAR-P2-021, PRM-TAR-P2-023 | Migrar-servicio | Igual. |
| 120 | 2663 | PRM-TAR-P2-026 | Migrar | Override por tipo de comprobante. |
| 121, 122 | 29, 185 | PRM-COB-P2-001, PRM-COB-P2-002 | Migrar (M07) | Lectura. |
| 123 | 3038 | PRM-FAC-P2-004 | Migrar (M05) | Lectura. |
| 124 | 2278 | — | Reemplazado | Siempre disponible en la política de redondeo del tipo de comprobante; valor fijo `true` (CTR-TAR-33). |
| 125 | 742 | PRM-TAR-P2-007 | Migrar | Se conservan los tipos 1, 2 y 3 de RN-01 §15 (CTR-TAR-32). |
| 126 | 2097 | PRM-TAR-P2-013 | Migrar | Se conservan los múltiplos negativos de RN-01 §15 (CTR-TAR-32). |
| 127, 128 | 2096, 2095 | PRM-TAR-P2-012, PRM-TAR-P2-011 | Migrar | Igual. |
| 129 | 21 | — | Reemplazado | Valor "no redondear" de PRM-TAR-125 (CTR-TAR-33). |
| 130 | 2342 | PRM-TAR-P2-016 | Migrar | Igual. |
| 132 | 3192 | PRM-MED-P2-003 | Migrar (M03) | Lectura. |
| 133, 135 | 527, 544 | PRM-FIS-P1-002, PRM-FIS-P2-008 | Migrar (M06) | Lectura. |
| 134 | 543 | — | Reemplazado | `taxes.kind = 'IVA'` de M06 (CTR-TAR-33). |
| 140 | 2417 | PRM-MED-P2-001 | Migrar (M03) | Lectura. |
| 155–167 | ver 14.2 | PRM-TAR-P1-001, 002, 003, 004, 006, 007, 008, 010, 011, 012; P2-024; P4-006; P4-001 | Migrar | Igual. |
| — | 1023, 1024 | — | Reemplazado | Regla opcional por fórmula asociada a la política de prepaga (`chargeRules`). |
| — | 2597 | — | Reemplazado | Precisión por concepto (PRM-TAR-150 con override en el concepto). |
| — | 2717, 2724, 2843, 2858, 2946, 2961, 2964, 2965, 2976, 3075, 3123, 3124, 3126, 3127, 3128, 3198 | — | Reemplazado | Perfiles guardados de `ExcelImportWizard` (PAN-TAR-05, PAN-TAR-12). |

## 15. Reportes, indicadores y exportaciones

Todos con filtros, exportación Excel/CSV/PDF, universo y fecha de corte declarados (AGR-022), y consulta "vigente al" / "conocido al" (AGR-010). Se exponen también a T10 (BI).

| ID | Reporte | Universo | Fórmula / contenido | Fecha de corte |
|---|---|---|---|---|
| REP-TAR-01 | Cuadro tarifario vigente (impresión y publicación) | Versiones `active` del servicio | Categorías, filas, cargos fijos, mínimos, reglas visibles, normas. | "Vigente al" fecha elegida |
| REP-TAR-02 | Comparativo entre versiones | Dos versiones del mismo alcance | Diff campo a campo; variación % por fila (15.2). | Versiones elegidas |
| REP-TAR-03 | Resultado de simulación masiva | `simulationResults` de una corrida | Totales, variaciones por servicio/categoría/grupo/tramo, percentiles, top N. | Período simulado |
| REP-TAR-04 | Consumos y netos por tramo y versión | Cálculos `issued` del período | Por escalón: cantidad, neto, cuentas; usa la versión con que se liquidó (RN-TAR-193); excluye R, DP, DFP; divide por factor de demanda cuando corresponde. | Período de liquidación |
| REP-TAR-05 | Agregado tarifario por fila | Cálculos `issued` | Usuarios, cuentas, comprobantes por fila de tarifa y versión (RN-TAR-194). | Período |
| REP-TAR-06 | Evolución de conceptos entre dos períodos | Comprobantes emitidos (no anulados) | Por cuenta o concepto; variación % (15.2); mismo filtro en ambos períodos (RN-TAR-192). | Dos períodos |
| REP-TAR-07 | Beneficios y subsidios otorgados | Renglones con `ruleKind` ∈ {benefit, subsidy, discount} | Importe por régimen/grupo/regla, cantidad de suministros, `funding` (cooperativa vs público vs recuperable). | Período |
| REP-TAR-08 | Padrón vs facturación | Inscripciones activas vs cálculos | Inscriptos sin beneficio aplicado y beneficiados sin inscripción vigente (control). | Período |
| REP-TAR-09 | Promociones | `promotionAssignments` | Activas, por agotarse, finalizadas; costo de la promoción (Σ efecto). | Fecha |
| REP-TAR-10 | Excluidos del cálculo | `calculations` con errores | Por código de error, servicio, categoría; tendencia por lote. | Lote |
| REP-TAR-11 | Diferencias retroactivas | `retroactiveDiffRuns` | Por comprobante y total; estado de ajustes. | Corrida |
| REP-TAR-12 | Tributos de regla por categoría | Renglones `tax` | Importe por tributo y categoría (reemplaza "Impuestos facturados por categoría" basado en `IMPUESTOS_X_CAT`). | Período |
| REP-TAR-13 | Tasación telefónica | Llamadas tasadas | Por plan, clave, tipo, banda: minutos, llamadas, importe; no tasadas por motivo. | Rango |
| REP-TAR-14 | Factor de potencia | Grandes consumos | Coseno, tgφ, recargos y bonificaciones por suministro. | Período |
| REP-TAR-15 | Redondeo y arrastre | Renglones de redondeo | Total redondeado, saldo de arrastre por cuenta (conciliado con M07). | Fecha |
| REP-TAR-16 | Auditoría de versiones | Versiones y aprobaciones | Autor, firmas, fechas, normas, simulación vinculada, hash. | Rango |
| REP-TAR-17 | Usuarios-generadores | Contratos con inyección | Demanda, inyección, crédito anterior/generado/aplicado/cedido/retribuido/final (MER-001). | Período |
| REP-TAR-18 | Reglas con fórmula (DEC-105) | `chargeRules` del tenant en las versiones elegidas (por defecto, las `active`) | Por servicio y por cuadro (versión): cantidad total de reglas, cantidad con fórmula (`formulaJustification.usesFormula`), proporción (con fórmula / total × 100, 2 decimales; 0 si no hay reglas), y desglose por tipo de justificación (`declarative_insufficient`, `migrated_pending_review`) y por `needsReview`; detalle navegable a cada regla con su justificación (RN-TAR-252). | "Vigente al" fecha elegida |

**15.2 Variación porcentual** (usada en REP-TAR-02, 03, 06): si base = 0 y nuevo = 0 ⇒ 0; si base = 0 y nuevo ≠ 0 ⇒ 100; si nuevo = 0 y base ≠ 0 ⇒ −100; en otro caso (nuevo − base) / |base| × 100, redondeado a 2 decimales.

**Indicadores (T10):** variación media ponderada de la factura por servicio tras cada versión; porcentaje de cuentas excluidas por lote; tiempo medio de cálculo por cuenta; cuentas con beneficio público vs comercial; costo de promociones por mes; porcentaje de reglas migradas `auto` vs `manual`; proporción de reglas con fórmula y cantidad de reglas `migrated_pending_review` sin revisar (REP-TAR-18; DEC-105).

## 16. Casos de uso

### 16.1 Casos de uso de BASE (ID original)

| CU | Nombre | Actor | Flujo resumido en TAR | Resultado / control | Cobertura |
|---|---|---|---|---|---|
| CU-06 | Cálculo tarifario de agua | Analista comercial autorizado | Selecciona TAR-AG-2026-11; cargo fijo ARS 3.000 + 20 m³ × ARS 500 ⇒ ARS 13.000 explicado y asociado a la versión, sin emisión ni cobro. | Si no hay versión vigente o hay dos incompatibles ⇒ bloqueo `TAR-E-SCH-NONE` / `TAR-E-SCH-AMBIGUOUS` y revisión. | RF-TAR-001–010, RN-TAR-199–200, PAN-TAR-15, ESC-TAR-01 |
| CU-TAR-02 | Bonificación comercial por grupo | Responsable de tarifas y aprobador | Crea grupo GR-BON-DEMO con vigencia; regla BON-VAR-30 (30 % sobre el variable, no sobre el fijo); simula socio incluido (ARS 10.000) y no incluido (ARS 13.000). | Bonificación comercial ≠ subsidio estatal (`funding = cooperative`); conflicto de reglas no se resuelve en silencio. | RN-TAR-201–207, 216, PAN-TAR-11, ESC-TAR-02 |
| CU-PRO-01 | Fibra hogar con instalación y promoción (definición en M02 §16, anexo dueño según PA-CAT-20; aquí la parte tarifaria) | Responsable comercial | Plan con instalación única, abono y promoción; condiciones guardadas al contratar; financiación de la instalación genera un solo cronograma (M08) y anula el contado; simula ciclos con bonificación y el primero sin ella; al cumplirse la duración vuelve al importe vigente explicado. | Ciclos parciales y cambio de plan con criterio explícito; no se cobra costo interno sin concepto habilitado. | RN-TAR-222–226, 240–245, PAN-TAR-14, ESC-TAR-03 |
| CU-ESP-ELE | Suministro eléctrico (definición en M02 §16, anexo dueño; aquí la parte tarifaria) | Técnica / facturación | Liquida con la versión aplicable; electrodependencia como régimen con regla específica y evidencia. | No equiparar kWh con kW; no aplicar tarifa mayorista; no extender beneficio sin revisar alcance. | RN-TAR-101–115, 227, ESC-TAR-08 |
| CU-ESP-AG | Agua medida y no medida (definición en M02 §16, anexo dueño; aquí la parte tarifaria) | Facturación | Medido con lectura observada queda pendiente (M03); no medido liquida por regla aprobada sin medidor ficticio. | Bloques/franquicias solo si el régimen los prevé; no precargar precios reales. | RN-TAR-076–077, 228, ESC-TAR-09 |
| CU-ESP-GAS | Gas por red (definición en M02 §16, anexo dueño; aquí la parte tarifaria) | Técnica / facturación | El ciclo conserva lectura, correcciones (factores) y versión utilizada. | No fijar coeficientes físicos; gas natural ≠ propano ≠ envasado. | RN-TAR-035–036, 229, ESC-TAR-10 |
| CU-MER-01 | Usuario-generador (definición en M03 §16, anexo dueño; aquí la parte tarifaria) | Facturación | Demanda 300 kWh con tarifa del suministro; inyección 120 kWh con tarifa de inyección; si el valor inyectado supera lo que paga, el saldo queda como crédito. | Valores ficticios; régimen aplicable. | RN-TAR-038–039, 198, 231, ESC-TAR-11 |

### 16.2 Casos de uso nuevos del módulo

| CU | Nombre | Actor | Flujo principal | Excepciones |
|---|---|---|---|---|
| CU-TAR-03 | Actualizar precios de un cuadro por norma | Responsable de tarifas, aprobadores | Copiar versión vigente → actualización masiva +12 % en energía → adjuntar resolución PDF → simulación masiva → enviar → dos firmas → publicar con `validFrom` futura → activación automática. | Simulación faltante ⇒ no se puede enviar; aprobador = autor ⇒ rechazo; vigencia superpuesta ⇒ `TAR-E-SCH-OVERLAP`. |
| CU-TAR-04 | Crear una regla con fórmula | Responsable de tarifas | Alta de regla `tasa_alumbrado` con fórmula GFL → compila → prueba con 5 contratos reales → guarda caso de prueba → envía con su versión. | Fórmula con función fuera de fase, referencia a regla posterior o ciclo ⇒ error de compilación; regla de comprobante con servicio ⇒ rechazo. |
| CU-TAR-05 | Explicar una factura al socio | Socio / atención | Abre el detalle en PWA → ve cargo fijo, tramos, beneficios con origen, promoción ciclo X/N, tributos y norma. | Comprobante anulado ⇒ se muestra con la anulación. |
| CU-TAR-06 | Importar padrón de tarifa social | Responsable de beneficios | Sube archivo → validación (altas/bajas/conflictos) → confirma → inscripciones con fecha efectiva → próximo cálculo aplica el beneficio por componente. | Persona con varias cuentas ⇒ conflicto a resolver; fila sin cruce ⇒ informe. |
| CU-TAR-07 | Liquidar un período que cruza dos versiones | Motor / facturación | Lecturas 01/10–31/10, versión nueva desde 16/10 ⇒ prorrateo por días con renglones por versión y fracción en la traza. | Más de 3 versiones ⇒ `TAR-E-PRORATION-TOO-MANY`. |
| CU-TAR-08 | Corregir una tarifa con vigencia pasada | Responsable de tarifas, aprobadores | Publica versión retroactiva → job de diferencias → revisión → aprobación → pedidos de NC/ND a M05. | Diferencia bajo umbral ⇒ sin ajuste; rechazo ⇒ sin efectos. |
| CU-TAR-09 | Tasar llamadas | Motor / técnica | M10 importa CDR → TAR tasa por bandas y planes → resultado con traza → facturación telefónica suma netos. | Sin prefijo ⇒ "Clave de llamada no encontrada"; sin asignación de banda ⇒ error. |
| CU-TAR-10 | Migrar cuadros y fórmulas de ProCoop | Equipo de migración | JOB-TAR-07 reconstruye versiones; JOB-TAR-08 traduce fórmulas; corrida en paralelo clasifica diferencias. | Fórmulas `failed` o procedimientos sin inventario ⇒ bloquean publicación del servicio. |

## 17. Criterios de aceptación y escenarios de prueba

| ESC-ID | Escenario | Datos | Resultado esperado |
|---|---|---|---|
| ESC-TAR-01 | CU-06 agua | TAR-AG-2026-11; CF 3.000; 20 m³ × 500 | Neto ARS 13.000,00; traza con versión, fila y cantidad; sin efectos fuera de TAR. |
| ESC-TAR-02 | CU-TAR-02 grupo | GR-BON-DEMO, BON-VAR-30 | Incluido ARS 10.000,00 (bonificación −3.000 solo sobre variable); no incluido ARS 13.000,00. |
| ESC-TAR-03 | CU-PRO-01 / piloto Internet | Ejemplo 9.3.9 con el *seed* de M02 §18 (abono ARS 15.000, instalación ARS 20.000, PROMO-INT-50x3) | Primer comprobante ARS 30.000,00; ciclos 1–3 con 50 %; cuarto sin promoción (ARS 15.000); instalación una sola vez; financiada ⇒ sin renglón de contado. (Antes: "Primer comprobante ARS 60.000,00; ciclos 1–3 con 10 %", con valores BASE — reemplazado por HUE-SRV-05.) |
| ESC-TAR-04 | Bloque vs tramos | Ejemplo 9.3.1 | ARS 3.750,00 y ARS 2.950,00. |
| ESC-TAR-05 | Factor por días | Ejemplo 9.3.2 | ARS 2.700,00 (tramos); bloque 5.625,00 (`scale_quantity`) y 3.000,00 (`scale_limits`). |
| ESC-TAR-06 | Prorrateo métodos 1, 2 y 3 | Ejemplo 9.3.3 | 3.097,50 / 3.115,00 / 3.097,50; tres versiones soportadas; cuatro ⇒ error. |
| ESC-TAR-07 | Proporcional y calendario | Ejemplo 9.3.4; febrero bisiesto (29 días) con alta el 15 | Importes del ejemplo; en febrero 2028 se usan 29 días; independiente de la hora del servidor. |
| ESC-TAR-08 | Factor de potencia | Ejemplo 9.3.6 | Recargo ARS 209.677,42 con método y tope en la traza; sin reactiva ⇒ sin renglón. |
| ESC-TAR-09 | Agua por inmueble | TBM 1.000, zonal 0,9, coef2 1,1, cuota2 500 | red2(1.000 × 0,9 × 1,1 + 500 × 0,7) = ARS 1.340,00; TBM 0 ⇒ `TAR-E-WATER-TBM`. |
| ESC-TAR-10 | Gas | Ejemplo 9.3.5 | 100 m³ tramados; factor faltante ⇒ `TAR-E-GAS-FACTOR` y cuenta excluida, lote continúa. |
| ESC-TAR-11 | CU-MER-01 | Demanda 300 kWh, inyección 120 kWh (ficticios) | Dos operaciones separadas con su IVA; si el comprobante queda negativo, crédito registrado (modo MER-001) o anticipo (modo compatibilidad). |
| ESC-TAR-12 | Redondeo con arrastre | Ejemplo 9.3.7 | Renglones +6,40 y −4,23; total 13.460,00; arrastre confirmado solo al emitir; anulación lo revierte. |
| ESC-TAR-13 | Regla con referencia | Ejemplo 9.3.8 | 212,50 y −106,25; cambiar el código de `tasa_alumbrado` en borrador actualiza la referencia. |
| ESC-TAR-14 | "Una vez por cuenta en el lote" | Dos comprobantes de la misma cuenta | Se aplica en el primero; en el segundo se saltea **solo** esa regla y las posteriores se aplican. |
| ESC-TAR-15 | Error de fórmula | División por cero en una regla | Cuenta excluida con `TAR-E-FORMULA` (regla, campo, valores); lote continúa; con > PRM-TAR-113 % de errores el lote se detiene. |
| ESC-TAR-16 | Seguridad del sandbox | Fórmulas con `constructor`, `__proto__`, `process`, `eval(`, `Function(`, `require(`, cadenas de 1 MB, recursión profunda, bucles por referencias | Rechazadas en compilación o cortadas por límites; ninguna ejecuta código ni accede a datos fuera del contexto; tiempo acotado. |
| ESC-TAR-17 | Determinismo | Reproducir 1.000 cálculos emitidos | Mismo `resultHash` en todos; explicación idéntica al comprobante. |
| ESC-TAR-18 | Inmutabilidad | Intento de editar una versión `active` o una regla publicada | 409 con `TAR-E-IMMUTABLE`; solo se puede copiar a borrador. |
| ESC-TAR-19 | Doble firma | Autor intenta aprobar su envío; mismo aprobador firma dos veces | Rechazo; la segunda firma del mismo usuario no cuenta. |
| ESC-TAR-20 | Permisos negativos | Usuario sin `tar.cuadros.publicar` llama API-TAR-012; atención intenta simulación masiva; socio pide explicación de factura ajena | 403 en todos; auditoría del intento. |
| ESC-TAR-21 | Aislamiento de tenant | Tenant A consulta versión, regla, simulación o cálculo de tenant B por ID | 404 (no revela existencia); índices y plugin impiden consultas sin `tenantId`; funciones GFL no ven datos de otro tenant. |
| ESC-TAR-22 | ESC-02 (corrección posterior a la emisión) | Versión corregida con vigencia pasada | Diferencias simuladas, aprobación con documentación, comprobante original intacto, ajuste por NC/ND. |
| ESC-TAR-23 | ESC-05 (cambio en período parcialmente procesado) | Publicación de versión mientras un lote está a mitad | Las cuentas ya calculadas conservan su versión; las pendientes usan la nueva solo si su fecha de referencia lo indica; reejecutar no reescribe documentos ni promociones. |
| ESC-TAR-24 | Reintentos e idempotencia | Caída del worker en mitad de lote; doble `fac.invoice.issued` | Reanuda solo cuentas pendientes; efectos confirmados una sola vez. |
| ESC-TAR-25 | Conflicto de reglas | Dos descuentos excluyentes con igual prioridad | `TAR-E-RULE-CONFLICT`; no se elige uno en silencio. |
| ESC-TAR-26 | Baja sin cargo | Intentar crear cargo con disparador "solicitud de baja" | Rechazo de validación (Ley 24.240); se liquidan solo prestaciones devengadas hasta la baja. |
| ESC-TAR-27 | Paralelo con ProCoop | Lote migrado de una cooperativa piloto | Diferencias = 0 o clasificadas como corrección conocida (`TAR-W-CORRECTION-KNOWN`) con la duda que la origina. |
| ESC-TAR-28 | Tasación | Llamada de 23:50 a 00:20 cruzando banda y día; feriado | Dos tramos de banda; el feriado usa bandas de domingo; fracciones según plan. |
| ESC-TAR-29 | Conciliación | Σ renglones de cálculos `issued` del lote vs Σ comprobantes de M05 | Igualdad exacta por concepto y alícuota. |
| ESC-TAR-30 | Rendimiento | Lote de 50.000 cuentas con 2 servicios y 10 reglas | ≤ 2 s por cuenta p95; escalado horizontal por workers (T08). |
| ESC-TAR-31 | Equipo no devuelto (HUE-INT-01) | ONT-DEMO-0003 de un contrato INT-100 dado de baja; PRM-CAT-094 = 15 días; (a) PRM-TAR-169 = `false`; (b) `true` con regla aprobada | (a) EVT-STK-07 sin efecto; (b) cotización, y con EVT-STK-08 aprobado un único cargo precargado `equipment_not_returned`; devolución antes de facturar ⇒ cargo `cancelled` (RN-TAR-246). |
| ESC-TAR-32 | Cloaca sin agua (HUE-CLO-02) | Cuenta con CLO configurada sobre AG cuyo contrato AG está dado de baja | Esa cuenta termina con `TAR-E-RELATED-MISSING` y se excluye; las demás cuentas del lote se calculan (RN-TAR-247). |
| ESC-TAR-33 | Obra aprobada (HUECO-OBR-01) | `tec.levy.approved` de la obra OBR-DEMO-01 con 3 beneficiarios, uno sin contrato tipo 17 | 2 planes `active` y 1 `pendingContract`; reprocesar el evento no duplica; al activarse el contrato faltante el plan pasa a `active`; API-TAR-066 muestra "Cuota 0/12" y saldo total (RF-TAR-116, RF-TAR-119). |
| ESC-TAR-34 | Derecho de sepultura (HUECO-CEM-01) | Derecho ARS 240.000 en 24 cuotas, mantenimiento anual ARS 18.000 y una inhumación (valores ficticios) | Renglones "Cuota n/24" de ARS 10.000; mantenimiento en el período anual; un solo cargo por `actId` (RN-TAR-248). |
| ESC-TAR-35 | Traslado (HUECO-SAL-01) | Viaje no cubierto de 12 km a ARS 900/km; viaje de 3 km con viaje corto ≤ 5 km a ARS 2.500; viaje cubierto con coseguro 10 %; no asociado | ARS 10.800; ARS 2.500; ARS 1.080; precio de la lista de no asociados; el mismo `tripId` no se cobra dos veces (RN-TAR-249). |
| ESC-TAR-36 | Cambio de régimen de medición (HUE-AG-03) | Contrato AG con cuota fija ARS 9.000; EVT-CAT-28 a `metered` con `effectiveAt` 16/11/2026; primera lectura válida el 20/11/2026 con 6 m³ hasta fin de mes (valores ficticios) | Noviembre: cuota fija por los días hasta el 19/11 y consumo de 6 m³ desde la lectura del 20/11, en dos renglones con su fracción en la traza; reprocesar el evento no cambia el cálculo (RN-TAR-250). |
| ESC-TAR-37 | Detalle de llamadas en el portal (HUE-TEL-02) | Contrato telefónico con 40 llamadas tasadas en 10/2026, 2 retasadas | API-TAR-067 devuelve 40 tasaciones (versión vigente de las retasadas) cuyo total coincide con el renglón telefónico emitido (RF-TAR-120). |
| ESC-TAR-38 | Corrección de gas en M04 (DEC-085) | M03 entrega 100 m³ medidos y `gasCorrectionCoefficient` 1; factor del período: presión 1,02, temperatura 0,98, calórico 9.300, óptimo 9.300 (valores ficticios) | Volumen corregido 99,96, cantidad redondeada 100 m³; la traza guarda medido, factores y resultado; sin factor del período ⇒ `TAR-E-GAS-FACTOR` y la cuenta se excluye (RN-TAR-035). |
| ESC-TAR-39 | Pack SMS con exceso (DEC-084) | Plan con cupo 200 SMS, cargo fijo ARS 5.000 y exceso ARS 20 por SMS (valores ficticios); el período informa 260 SMS | Renglones: cargo fijo ARS 5.000 y exceso 60 × ARS 20 = ARS 1.200; sin consumo informado ⇒ solo el cargo fijo con `TAR-W-QUOTA-USAGE-MISSING` y el exceso en el período siguiente (RN-TAR-251). |
| ESC-TAR-40 | Preferencia declarativa (DEC-105) | Versión en borrador con 10 reglas del servicio EE: 7 declarativas, 2 con fórmula escritas por el usuario (una sin justificación) y 1 migrada de ProCoop | Enviar a aprobación falla con `TAR-E-FORMULA-UNJUSTIFIED` señalando la regla sin justificación; al cargarla, el envío procede y el aprobador ve 3 reglas con fórmula, 1 `migrated_pending_review`; REP-TAR-18 informa 3 de 10 (30,00 %) para EE y esa versión; modificar después una fórmula justificada pone `needsReview = true` y vuelve a bloquear el envío (RN-TAR-252). |

Criterios generales: toda pantalla y API cumple permisos, auditoría y diccionario; todo importe usa Decimal128/decimal.js (sin `float`); toda vigencia se interpreta en la zona del tenant; toda regla publicada tiene al menos un caso de prueba que pasa.

## 18. Datos de precarga de demostración (ficticios)

Todos marcados `demo = true`, en un tenant de demostración; nunca tarifas, porcentajes fiscales ni subsidios reales (RN-TAR-239).

| Dato | Contenido ficticio |
|---|---|
| Versión TAR-AG-2026-11 (agua medida) | Categoría AG-RES: cargo fijo ARS 3.000; variable ARS 500/m³ en bloque único; vigencia desde 01/11/2026; norma "Resolución demo 001/2026" con PDF de ejemplo. |
| Versión AG-NOMED-DEMO | Agua no medida por inmueble: TBM y coeficientes ficticios del ESC-TAR-09. |
| Versión ELE-DEMO-2026-11 | Residencial por tramos [0,100) 10; [100,200) 12; [200,∞) 15; cargo fijo 2.500; mínimo 30 kWh; grandes consumos con demanda y factor de potencia de ejemplo (tope 0,95, método tangente, K 1,5). |
| Versión GAS-RED-DEMO | Tramos ficticios; factores del período con presión 1,0140, temperatura 0,9870, calórico 9.300. |
| Plan INT-100 (piloto Internet) | Abono ARS 25.000 (BASE §39.3) y variante ARS 30.000 (BASE §72); instalación ARS 30.000 (BASE §39.3) y variante ARS 20.000 (BASE §72) como cargos por evento de una sola vez; promoción PROMO-INT-10x3 (10 % × 3 ciclos) y PROMO-INT-50x3 (50 % × 3 ciclos). **Valores del demo (HUE-SRV-05):** se reutiliza el *seed* único de M02 §18 — abono ARS 15.000, instalación ARS 20.000, PROMO-INT-50x3 —, que es el que usan 9.3.9 y ESC-TAR-03; los importes BASE quedan solo como casos de prueba de RN-TAR-241/245. |
| Grupo y regla | GR-BON-DEMO con 3 contratos; regla BON-VAR-30 (30 % sobre variable, `funding = cooperative`). |
| Régimen de subsidio | SUB-DEMO: bloque subsidiado de 250 unidades, 150 suministros elegibles, beneficio 40 % sobre energía del bloque, `funding = public_subsidy`; padrón de ejemplo de 10 filas con DNI ficticios. |
| Reglas de ejemplo | `tasa_alumbrado` (tributo demo vinculado a M06), `bonif_alumbrado_social`, recargo proporcional de fase comprobante. |
| Telefonía | Plan PLAN-DEMO, bandas Normal/Reducida, tarifas por clave local/interurbana/móvil ficticias. |
| Redondeo | Política global tipo 2, múltiplo 10. |
| Socios/cuentas | Personas ficticias (sin datos de la DEMO de ProCoop). |

## 19. Migración desde ProCoop

Marco general en T07 (staging por tenant, corridas repetibles, paralelo y by-pass). Orden: M01/M02 (servicios, categorías, conceptos) → M06 (alícuotas, situaciones, tributos) → TAR → M03 (consumos) → M05 (comprobantes históricos con referencia a versión).

### 19.1 Reconstrucción de versiones (JOB-TAR-07)

1. Ordenar `CUADROS` por `FEC_DESDE`/`FEC_HASTA`; cada cuadro es una foto de la tarifa vigente **hasta** su `FEC_HASTA` (RN-TAR-059/060). Cada foto ⇒ una versión `superseded` con `validFrom = FEC_DESDE`, `validTo = FEC_HASTA + 1 día` (ajustando huecos y solapes con informe).
2. Las tablas vivas (`SERVICIO`, `CATE_SER`, `CATTARIF`, `CARGOS_ADICIONALES`, `PROD_SER`, `IMPUESTO`, `TAR_ADHE`, `CATE_SER_EXTRAS`, `SERVICIO_EXTRAS`) ⇒ versión `active` con `validFrom` = día siguiente al último `FEC_HASTA`.
3. Si una foto no difiere de la siguiente (hash de contenido), se fusionan y se informa.
4. `HIS_SERVICIO_EXTRAS` se descarta en favor de `SERVICIO_EXTRAS` vigente con informe de diferencias (RN-TAR-061, duda 25).
5. Comprobantes históricos: cada renglón se vincula a la versión por `ITEMSFAC_EXTRAS.COD_CUA`; vacío ⇒ versión vigente a la fecha del comprobante (RN-TAR-062).
6. Las versiones migradas quedan con `origin = migration`, aprobaciones "migración" (usuario técnico) y `legacy.cuadroCode`.

### 19.2 Mapeo tabla origen → colección destino

| Tabla ProCoop | Colección destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `CUADROS`, `CUADRI` | `tariffSchedules` | Una versión por cuadro y servicio; código `CUADRI.DES_CUA` normalizado. | Cantidad de cuadros y rangos de vigencia sin huecos. |
| `SERVICIO`, `HIS_SERVICIO`, `SERVICIO_EXTRAS`, `HIS_SERVICIO_EXTRAS` | `tariffServiceSettings` | `TIP_CAL` → `calcType`; `TRAMA_DEC` → `tierBasis` + `largeCustomerEnergyMode`; `PRORRATEO_*` → `proration`; `VENCIDO`/`PPERIODO` → `billingTiming`; `DIVISION_CONSUMO`. | Cada servicio con configuración en cada versión. |
| `PROPIESER` | `tariffServiceSettings.propertyOverrides[]` | Mínimos y cargo fijo por propiedad. | Conteo por servicio. |
| `CATE_SER`, `HIS_CATE_SER`, `CATE_SER_EXTRAS`, `HIS_CATE_SER_EXTRAS` | `tariffCategoryRates` | Cargo fijo (`CAN_CF`, `IMP_CF`, `COD_CF`, `COBRAR_CF_BAJA`), mínimo (`COD_CM`, `IMP_MINM`, `IMP_CMINM`, `COBRAR_CM_BAJA`), `AP_TR_DIAS`, `DIAS_PROP`, `PREPAGA`, `COD_TPFC`, GC, coseno (`METODO_FI`, `TOPE_COSFI`, `RCOS_FI`, `BCOS_FI`, `NCOS_FI`, `CFIJ_COS`, `BASE_COSFI`), `CUO_MIN1/2`, alícuotas. | Σ categorías por versión. |
| `CATTARIF`, `HIS_CATTARIF`, `CATTMC` | `tariffRows` / `adherentRates` | Una fila por (tipo de energía, concepto, franja, escalón); `PRE_DIU`/`PRE_NOC` → filas por franja; columnas de subsidio; `XUNID`/`CADHER`/`CAN_ADH` → adherentes. `CATTMC` solo si hay borradores en curso. | Recalcular 100 % de los comprobantes de una muestra de períodos con la versión migrada y comparar. |
| `TAR_ADHE`, `HIS_TAR_ADHE` | `adherentRates` | Edad, vínculo, ocupación, `COBRAEXCEDENTE` → franquicia. | Conteo. |
| `PROD_SER`, `HIS_PROD_SER`, `PRECIOSVIV`, `POSTALES` | `productPrices` | Precio por versión; vivienda por categoría y fecha; franqueo. `PRECIOSVIV`: **reemplazado por la migración de M18** (precios de vivienda del plan, PAN-SOC-17; HUECO-VIV-02). | Precio vigente igual al de ProCoop a la fecha de corte. |
| `SERSOC_EXTRAS` (`CNT_*`) | `worksInstallmentPlans` | Plan de cuotas de obra: total, cuotas, facturadas, unidades (HUECO-OBR-05). | Cuota n/N y saldo iguales a ProCoop a la fecha de corte. |
| `CARGOS_ADICIONALES`, `HIS_CARGOS_ADICIONALES` | `chargeRules` | Código derivado del nombre (`DES_CAR` → slug único); fórmulas traducidas (19.3); `FINAL` → `phase`; `TIPO` → `ruleKind`/acción; `SUMA` → `sign`; `AFECTACION`; `APLICA_UNA_VEZ`; grupo/grupo 0; `SUBTIPO_CARGO`. | Recalcular la muestra y comparar renglón a renglón. |
| `RECARGOS`, `DESCPOS`, `PROD_SER_REC_DES` (antes también `CON_TASAS`, que pasa a `purchaseConcepts` de M12, T05 COL-CMP-05) | `chargeRules` | Reglas declarativas sin fórmula (condición + porcentaje/importe + prioridad). | Muestra. |
| `IMPUESTO`, `HIS_IMPUESTO` | M06 (catálogo de tributos) + `chargeRules` (`tax`) | Tributo con `ORIGEN`, orden en factura y `APLICA_UNA_VEZ`; regla vinculada. | Σ otros impuestos por período. |
| `IMPUESTOS_X_CAT` | REP-TAR-12 (solo informe) | No interviene en el cálculo (RN-TAR-170). | — |
| `CATE_SER_COEFICIENTES` | `categoryCoefficients` | Cuatro coeficientes por fecha. | Conteo. |
| `FACTOR_CAL`, `CORREGAS` | `gasCalorificFactors` | Por período/servicio/categoría con presión y temperatura. | Conteo por período. |
| `CONEXION` | `eventCharges` | Disparador = transacción de conexión; condiciones por categoría/localidad/propiedad/referencia/clase. | Conteo; fundamento normativo marcado [VERIFICAR] para cada cargo migrado. |
| `CONE_BONIF` | `eventChargeBonuses` | Cantidades bonificadas por cuenta y servicio. | Conteo. |
| `PRCAGAS` | ~~`preloadedCharges`~~ → `billableItems` de M05 (CTR-DAT-38) | Solo filas pendientes (no facturadas) a la fecha de corte; históricas como referencia. | Σ pendientes. |
| `TEMPMODIFBONIF` | `bonusRecalcRuns` | No se migra (tabla temporal); se descarta. | — |
| `DEUDARED`, `DEUDARED_TIPO` | ~~Saldo inicial de arrastre en M07 + `roundingCarryEntries`~~ **Reemplazado por** `agencyPublishedDebts` (M07; CTR-DAT-42); M04 no migra filas | ~~Un movimiento de apertura por cuenta (y tipo).~~ Lo migra M07; M04 solo valida que el saldo de redondeo inicial exista antes del primer cálculo con redondeo tipo 2 ([VERIFICAR] ver 7.17). | Σ saldos = Σ ProCoop (control de M07). |
| `TIPO_FAC` (campos de redondeo y franqueo) | `roundingPolicies` | Por tipo de comprobante. | Conteo. |
| Tablas de tasación (`TiempoBandas`, `TiempoTipoBandas`, tarifas, planes de descuento, gratuitos) | Colecciones de telefonía (7.18) | Cortes horarios por día; tipos de banda; tarifas por clave. | Retasar una muestra de llamadas y comparar importes. |
| Columnas de tarifa social/segmentación en contratos | `subsidyRegimes`, `subsidyEnrollments` | Un régimen por categoría social/segmentación con inscripciones vigentes a la fecha de corte; origen `migration`. | Cantidad de beneficiarios por régimen. |
| `ALTASEAU`, `ESTASER`, `CLASESER`, `TIP_SERVI`, `GRP_CAT`, `CONCESIO`, `REFEREN`, `ESTINM`, `USOINM`, `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS`, `TIPOLOTE`, `FACT_EPEC` | M01/M02/M03/M05/M12/M13 (`TIPOLOTE` → `lotTypes` de M13, CTR-DAT-46; `FACT_EPEC` → `supplierInvoices.wholesaleSupply` de M12, RF-CMP-149) | Los migra el módulo dueño; TAR valida que las referencias existan. | Referencias resueltas 100 %. |

### 19.3 Traducción de fórmulas (JOB-TAR-08)

Ver 9.4.6. Inventario previo de procedimientos `FORMULA_CARGO_*` en la base de cada cooperativa ([VERIFICAR] en LAG, RN-TAR-145); cada uno se resuelve como función declarativa, dato precargado o función nativa (PA-TAR-11). Criterio de salida: 100 % de reglas `auto` o `reviewed`; ninguna `failed`. Las reglas con fórmula migran con la justificación `migrated_pending_review` (RN-TAR-252; DEC-105); el informe de migración incluye REP-TAR-18 para que la cooperativa planifique su revisión, que no es condición de salida.

### 19.4 Paralelo

Durante al menos dos períodos por servicio, el motor calcula en modo `simulation` el mismo universo que factura ProCoop; cada diferencia por cuenta se clasifica en: corrección conocida (dudas de RN-01 corregidas, PA-TAR-03), dato de migración, regla de traducción, error del motor. Criterio de salida: 0 diferencias no clasificadas y diferencias por corrección conocida aprobadas por la cooperativa.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-TAR-01 | RN-01 §6.4 vs BASE §6, AGR-009 | ProCoop: cuadro = foto del pasado y tablas vivas = tarifa actual. BASE: versiones con vigencia y reproducibilidad. | Toda tarifa es versión con `validFrom/validTo`; sin tablas vivas. | BASE/AGR > benchmark |
| CTR-TAR-02 | RN-01 §12.8 vs BASE §6, AGR-009 | Históricos (`HIS_CARGOS_ADICIONALES`) editables. | Versiones publicadas inmutables. | BASE > benchmark (deuda técnica) |
| CTR-TAR-03 | RN-01 §12.5, duda 24 vs AGR-010 | Doble control de vigencia contra fecha del sistema y mes actual. | Control único contra la fecha de referencia tarifaria (PRM-TAR-010). | AGR > benchmark |
| CTR-TAR-04 | RN-01 §17.2 vs BASE §52.2 | Tasas como cargos de fórmula libres. | Regla `tax` vinculada a tributo aprobado de M06 con fundamento. | BASE > benchmark |
| CTR-TAR-05 | RN-01 §18 vs BASE §51–52 | Tarifa social resuelta con categorías y fórmulas sin origen del beneficio. | Régimen + inscripción + regla con origen; categorías sociales por compatibilidad. | BASE > benchmark |
| CTR-TAR-06 | RN-01 §12.5, §12.7 vs DEC-001, CNX, T08 | Fórmulas evaluadas con grilla DevExpress y procedimientos almacenados. | Intérprete GFL propio en sandbox sin `eval`. | DEC > benchmark |
| CTR-TAR-07 | RN-01 §1.2.5, §13, §14, §15 vs AGR-003, AGR-011 | El cálculo muta contratos, saldos y marcas al calcular. | Motor puro; efectos diferidos confirmados con `fac.invoice.issued`. | AGR > benchmark |
| CTR-TAR-08 | RN-01 §12.5 vs RN-01 §1.1, ESC-05 | `#Err` de fórmula aborta todo el lote, mientras otros errores solo excluyen la cuenta. | Excluir la cuenta; umbral de detención PRM-TAR-113. | AGR/ESC > benchmark |
| CTR-TAR-09 | BASE §6 CU-06 vs RN-01 §6 | CU-06 bloquea si hay dos versiones incompatibles; ProCoop prorratea automáticamente. | Dos versiones **sucesivas** del mismo alcance ⇒ prorrateo; dos versiones **simultáneas** incompatibles ⇒ bloqueo. | BASE (interpretada) + benchmark |
| CTR-TAR-10 | RN-01 §12.6, duda 17 | `APLICA_UNA_VEZ` corta también las reglas posteriores. | Se saltea solo la regla. | Corrección de error (DEC-007 salvo deuda técnica) |
| CTR-TAR-11 | RN-01 §15 vs AGR-011 | Cuenta corriente de redondeo en tabla propia vs saldo única fuente en M07. | Arrastre como movimiento de M07; TAR solo propone (PA-TAR-06). | AGR > benchmark |
| CTR-TAR-12 | RN-01 §3.1 (`COBRAR_CF_BAJA`, `COBRAR_CM_BAJA`) vs BASE §52.3 | Cobrar cargo fijo/mínimo en baja vs no cobrar por la baja. | Se admite cobrar lo devengado hasta la baja y cargos del régimen en estado de baja con fundamento; nunca un cargo por solicitar la baja. | BASE > benchmark |
| CTR-TAR-13 | BASE §103 vs frases previas de BASE | Comprobante multiservicio. | TAR calcula por contrato y agrupa según la política de M05 (incluida multiservicio). | BASE más reciente |
| CTR-TAR-14 | RN-01 §1.1 vs M05 | Factura negativa convertida en NC dentro del cálculo. | TAR informa signo; M05 decide el comprobante. | DEC-003 (fronteras) |
| CTR-TAR-15 | CAT `IMPUESTOS_X_CAT` vs RN-01 §17.2 | La tabla sugiere impuestos por categoría pero no se usa en el cálculo. | Solo informe (REP-TAR-12). | Código (RN) > descripción de tabla |
| CTR-TAR-16 | RN-01 §4.2, §11.1 | `TRAMA_DEC` sobrecargado (testigo, modalidades de GC). | Dos campos: `tierBasis` y `largeCustomerEnergyMode`. | Mejora de modelo |
| CTR-TAR-17 | RN-01 §4.1, §4.3, duda 1 | Factor por días en bloque escala la cantidad (cobra de más) vs en tramas escala límites. | Ambos modos por categoría (PA-TAR-02). | A validar |
| CTR-TAR-18 | RN-01 duda 2 | Tercera versión de prorrateo usa el precio de la segunda. | Usa su propio precio. | Corrección de error |
| CTR-TAR-19 | RN-01 §12.7, duda 19 | `DiasConsumo` devuelve 60 fijo. | Días reales. | Corrección de error |
| CTR-TAR-20 | RN-01 duda 7 | `Consumo_Proporcional` en baja devuelve un valor incoherente. | Devuelve fracción. | Corrección de error |
| CTR-TAR-21 | RN-01 §11.3 (duda sobre base del coseno según subtipos) | La base del factor de potencia depende de subtipos no documentados. | Base declarada (`powerFactor.base`) y trazada. | Mejora de modelo |
| CTR-TAR-22 | RN-01 §12.7, duda 22 | `Facturado_*` incluye anulados. | Excluye anulados. | Corrección de error |
| CTR-TAR-23 | RN-01 §23.4, duda 27 | Otros tributos redondeados a entero. | Redondeo a decimales del comprobante. | Corrección de error |
| CTR-TAR-24 | RN-07 §8 | Retasación borra y reinserta llamadas (pierde IDs). | Retasación en sitio conservando IDs. | AGR-003 > benchmark |
| CTR-TAR-25 | BASE §87 vs práctica ProCoop (`COSTO_EPEC`, `FACT_EPEC`) | Costos del proveedor y umbrales de EPEC como referencia universal. | Datos de versión, no constantes; no se trasladan automáticamente; no se precargan. | BASE > benchmark |
| CTR-TAR-26 | RN-01 §23.1 | Consumos con categoría ajena al servicio se descartan sin aviso. | Error `TAR-E-CAT-CONSUMPTION`. | AGR (no silencioso) > benchmark |
| CTR-TAR-27 | RN-01 §15 vs AGR-017 | Redondeo con arrastre omitido si la fecha del comprobante = primer vencimiento (regla implícita). | Configurable; default replicar (PA-TAR-07). | A validar |
| CTR-TAR-28 | RN-01 §6.4 (copia por posición) vs AGR-009 | Copia de cuadros por posición de fila. | Copia y diff por clave natural (`rowKey`). | AGR > benchmark |
| CTR-TAR-29 | CAT `PRCAGAS` vs RN-01 §1.2.6 | La tabla se describe como cálculo de gas prorrateado y el código la usa como cargos extraordinarios precargados. | `billableItems` de M05 con `sourceType` (CTR-DAT-38; antes `preloadedCharges` con `origin`); [VERIFICAR] en LAG. | Código (RN) > descripción de tabla |
| CTR-TAR-30 | BASE §39.3 vs BASE §72 | Importes ficticios distintos de abono/instalación del piloto (25.000/30.000 vs 30.000/20.000). | Ambos como datos demo; no afectan reglas. | Sin impacto (datos ficticios) |
| CTR-TAR-31 | T04b (V2 #2315 → PRM-PLA-P2-001, plataforma, 100) vs PRM-TAR-020 (500) | Dos tamaños de bloque para el mismo concepto. | El lote de facturación de M05 usa el valor de plataforma; PRM-TAR-020 rige solo simulaciones y diferencias retroactivas de TAR. | T04b > anexo |
| CTR-TAR-32 | T04b PRM-TAR-P2-004, P2-007, P2-013 vs RN-01 §4.4, §15, duda 6 | T04b enumera 3 opciones de redondeo de gas, 3 tipos de redondeo y decimales 0–2; el código admite 5 modos de gas, tipos 1/2/3 y múltiplos negativos (−100 a −5). | Se conservan los valores del código (superconjunto); los de T04b se mapean: `truncar` = `truncate`, `redondearEntero` = `round0`, `sinRedondeo` = `divide_only`; `sinRedondeo` del tipo = "no redondear". | Código (RN) > catálogo marcado [VERIFICAR] |
| CTR-TAR-33 | T04b (V2 #2876, #2278, #21, #543 Reemplazado) vs PRM-TAR-064, 124, 129, 134 | El anexo los define como parámetros. | Quedan como valor fijo o reemplazados según 14.3; PRM-TAR-064 solo se habilita en el paralelo. Los IDs se conservan para trazabilidad. | T04b > anexo |
| CTR-TAR-34 | T04b PRM-TAR-P2-022 vs M05 PRM-FAC-154 (V2 #2514) | Dos módulos declaran el mismo parámetro. | Dueño M04 (PRM-TAR-080); M05 lo lee. | T04b > anexo de otro módulo |
| CTR-TAR-35 | T04b (V2 #2520 Descartar) vs RF-TAR-023, PRM-TAR-103 y M03 PRM-MED-004 | Orden de filas por concepto como parámetro. | Se cumple con orden y vistas guardadas del DataTable; `displayOrderByConcept` es la vista por defecto, no un parámetro T04. | T04b + CNX > anexo |
| CTR-TAR-36 | T04b (V2 #2526, #2564, #2644, #3191) vs PRM-TAR-105, 107, 108, 109 | El anexo los ubica en TAR; T04b los asigna a M05, M11 o a un atributo de M02. | TAR solo los lee; #3191 es `billingMode` del servicio (M02). | T04b > anexo |
| CTR-TAR-37 | M05 (`tar.version.published`), M10 (`tec.cdr.attributed`, `tar.call.rated`) vs 12.1–12.2 | Nombres de eventos distintos entre anexos. | Rige el nombre del emisor: `tar.schedule.published` (EVT-TAR-004) y `tar.calls.rated` (EVT-TAR-019) para TAR; `tec.cdr.attributed` de M10 es el evento que en 12.2 figura como `tec.cdr.imported`. Los consumidores se alinean con estos nombres. | DEC-003 (el dueño del evento define el contrato) |
| CTR-TAR-38 | M03 (`gasCorrectionFactors`, PAN-MED-20) vs M04 (`gasCalorificFactors`, PAN-TAR-09) | Dos colecciones y pantallas para `FACTOR_CAL`. | Una sola colección; dueño a definir en PA-TAR-19. Mientras tanto, M04 la usa como fuente del cálculo y M03 solo como insumo de estimación. **Resuelto (HUE-GAS-03, PA-TAR-19 opción A):** dueño M04 (`gasCalorificFactors`, PAN-TAR-09, PRM-TAR-050..052 y PRM-TAR-168); M03 lee y marca `gasCorrectionFactors`, PAN-MED-20 y PRM-MED-070..072 como reemplazados. Además la **aplicación** de la corrección es de M04 (DEC-085; RN-TAR-035) y M03 entrega el volumen medido; CTR-MED-06 queda reemplazada. | Resuelto (DEC-085) |
| CTR-TAR-39 | M02 (`eventChargeRules` desde `CONEXION`) vs M04 (`eventCharges`) | Disparador, filtros y precio de los cargos por evento en dos módulos. | M02 define el disparador y los filtros del contrato; M04 versiona precio, fundamento y bonificaciones y referencia la regla de M02 (PA-TAR-19). | DEC-003 (fronteras) |
| CTR-TAR-40 | INV `frmRecategorizacion`, `frmSegmentacion_Restablecer` en M05 PAN-FAC-19, M02 PAN-CAT-17 y M04 PAN-TAR-12 | Tres pantallas para la misma operación masiva. | M04 calcula la propuesta por régimen o padrón (JOB-TAR-05); el cambio de categoría del contrato lo aplica M02; M05 solo dispara la recategorización por consumo dentro del ciclo. | DEC-003 (fronteras) |
| CTR-TAR-41 | RN-01 §5.1 (día de alta excluido) vs AGR-017 (día de alta incluido) | El proporcional legacy no cuenta el día de alta. | PRM-TAR-068: `false` para tenants migrados en paralelo, `true` para nuevos; la diferencia se clasifica como corrección conocida. | AGR > benchmark, con compatibilidad |
| CTR-TAR-42 | M04 §7.2 (`tariffServiceSettings.proration.method` = `days`, `consumption`, `readings`; `applyTo`) vs RN-TAR-049 y RN-01 §6.1 (`PRORRATEO_METODO` 0 a 3, `PRORRATEO_CF`, `PRORRATEO_CM`, `PRORRATEO_DIASCONSUMO`) | El enumerado del modelo mezclaba la base de las fracciones (días), el método de valorización (consumo) y la bandera de lecturas divididas (lecturas), y no tenía los métodos 2 y 3. | Prevalece la regla, que es correcta (coincide con el código de ProCoop): `method` = `none`, `consumption_proportional`, `consumption_continue_tiers`, `unit_price_proportional`; las fracciones son siempre por días (RN-TAR-051); `readings` pasa a la bandera `useFullReadingRange`; `applyTo` se reemplaza por `fixedCharge.proration`, `prorateMinimum` y `prorateDemand`. | DEC-104 (regla > modelo del anexo) |
| CTR-TAR-43 | Documento externo `NucleoTransversal-Modelo` cap. 5.6 vs RF-TAR-067, RF-TAR-068 | El documento propone prohibir las fórmulas y armar cargos, recargos y descuentos solo con reglas. | Se mantienen las fórmulas en sandbox (sin ellas no se migran tasas, subsidios ni PIST/VAD de ProCoop) y se adopta la política de preferencia declarativa: justificación obligatoria de cada fórmula, visible en la revisión del cuadro, e informe de proporción de reglas con fórmula (RN-TAR-252, REP-TAR-18, ESC-TAR-40). | DEC-105 |

## 21. Preguntas abiertas

### PA-TAR-01 — Semántica de evaluación de reglas encadenadas
- **Pregunta:** ¿Las reglas de un mismo servicio se evalúan sobre la foto previa (como ProCoop) o en cascada sobre la base ya modificada?
- **Contexto:** En ProCoop todas las variables de un servicio se evalúan antes de aplicar cualquier cargo; un recargo de orden 1 no cambia la base del orden 2 salvo referencia explícita (RN-01 §12.5). Cambiarlo altera resultados migrados.
- **Opciones:**
  - A) Foto previa por defecto + referencias explícitas (`rule('x')`, `previousTotal`) y opción `baseMode = cascade` por regla **(Recomendada)** — compatibilidad total y flexibilidad para reglas nuevas.
  - B) Siempre en cascada — más intuitivo, pero obliga a reescribir reglas migradas.
  - C) Siempre foto previa — compatible, pero limita reglas nuevas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-133, RF-TAR-065, RF-TAR-068, O4.

### PA-TAR-02 — Factor por días en tarifa por bloque
- **Pregunta:** ¿Cómo se aplica el factor por días en categorías de bloque?
- **Contexto:** ProCoop multiplica la cantidad facturada (cobra unidades de más), mientras en tramas escala los límites (RN-01 §4.1, §4.3, duda 1).
- **Opciones:**
  - A) Ambos modos por categoría: migrados en `scale_quantity` (legacy) y nuevos en `scale_limits` **(Recomendada)** — paralelo sin diferencias y corrección gradual.
  - B) Solo `scale_limits` — corrige pero genera diferencias en el paralelo.
  - C) Solo `scale_quantity` — replica el comportamiento discutible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-027, ESC-TAR-05, O7.

### PA-TAR-03 — Errores de ProCoop durante el paralelo
- **Pregunta:** ¿Se corrigen los errores detectados en el cálculo de ProCoop (dudas 2, 3, 4, 7, 8, 16–23, 25–27) aunque generen diferencias en el paralelo?
- **Contexto:** Replicar errores asegura igualdad en el paralelo; corregirlos mejora la exactitud pero exige explicar diferencias.
- **Opciones:**
  - A) Corregir y clasificar cada diferencia como "corrección conocida" con advertencia `TAR-W-CORRECTION-KNOWN` **(Recomendada)** — paralelo trazable.
  - B) Replicar errores con interruptor por tenant hasta aprobar la corrección — más esfuerzo de mantenimiento.
  - C) Replicar siempre — perpetúa errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-058, 144, 177, 185, 190, 192; ESC-TAR-27; O11.

### PA-TAR-04 — Fecha de referencia tarifaria
- **Pregunta:** ¿Qué fecha determina la versión aplicable de tarifas y reglas?
- **Contexto:** ProCoop usa la fecha del lote o del sistema y un segundo control por mes actual (duda 24); AGR-010 exige declarar la fecha que se interpreta.
- **Opciones:**
  - A) Período de prestación: medidos por fecha de lectura actual con prorrateo entre versiones; no medidos por inicio del período liquidado **(Recomendada)** — coherente con prorrateo y retroactivos.
  - B) Fecha de emisión — simple, pero cobra consumos pasados con precios nuevos.
  - C) Fecha de vigencia elegida en cada lote (como ProCoop) — flexible pero manual y propensa a errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-131, PRM-TAR-010, O4.

### PA-TAR-05 — Ciclo parcial de una promoción
- **Pregunta:** Si el primer comprobante incluye una fracción de mes, ¿consume un ciclo de la promoción?
- **Contexto:** CU-PRO-01 exige criterio explícito para ciclos parciales y cambios de plan.
- **Opciones:**
  - A) Parametrizable por promoción, default "no consume" (PRM-TAR-016) **(Recomendada)** — favorece al socio y es explicable.
  - B) Siempre consume — más simple, el socio pierde parte de la promoción.
  - C) Consume proporcionalmente (fracción de ciclo) — exacto, más complejo de explicar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-242, ESC-TAR-03, O4.

### PA-TAR-06 — Cuenta corriente de redondeo
- **Pregunta:** ¿Se mantiene el redondeo con arrastre (cobrar la diferencia en el comprobante siguiente) y dónde se lleva su saldo?
- **Contexto:** ProCoop guarda el saldo en tablas propias (`DEUDARED`); AGR-011 exige saldo con única fuente y ningún ajuste sin contrapartida.
- **Opciones:**
  - A) Mantener la opción; el saldo es un movimiento de M07 propuesto por TAR y confirmado al emitir **(Recomendada)** — compatible y conciliable.
  - B) Eliminar el arrastre; solo redondeo simple — más simple, cambia el hábito de las cooperativas.
  - C) Mantener tabla propia en TAR — duplica saldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-163, PRM-TAR-131, O4/O5.

### PA-TAR-07 — Redondeo cuando la fecha del comprobante coincide con el primer vencimiento
- **Pregunta:** ¿Se omite el redondeo con arrastre en comprobantes cuya fecha es igual al primer vencimiento (como ProCoop)?
- **Contexto:** Regla implícita del código (RN-01 §15) sin justificación documentada; afecta comprobantes de contado.
- **Opciones:**
  - A) Configurable por política, default replicar (omitir) **(Recomendada)** — sin diferencias en el paralelo.
  - B) Redondear siempre — uniforme.
  - C) Nunca redondear comprobantes de contado — explícito por tipo de comprobante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-163, O4.

### PA-TAR-08 — Firmas para publicar tarifas
- **Pregunta:** ¿Cuántas firmas se exigen para publicar una versión tarifaria?
- **Contexto:** DFA M7 propone doble firma; algunas cooperativas requieren aprobación del Consejo.
- **Opciones:**
  - A) Dos firmas obligatorias + tercera opcional configurable (PRM-TAR-004) **(Recomendada)** — control y flexibilidad.
  - B) Una firma — ágil, menor control.
  - C) Tres firmas siempre — máximo control, más lento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TAR-005, 8.1, O4.

### PA-TAR-09 — Simulación obligatoria antes de aprobar
- **Pregunta:** ¿Qué simulación se exige antes de enviar una versión a aprobación?
- **Contexto:** BASE §51 pide simular antes de publicar; una simulación completa puede ser costosa en cooperativas grandes.
- **Opciones:**
  - A) Completa para cambios de precio que afectan más de N contratos; muestra estadística para menores; ninguna para cambios de presentación **(Recomendada)** — equilibrio entre control y costo.
  - B) Siempre completa — máximo control.
  - C) Opcional — riesgo de publicar sin conocer el impacto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-TAR-005, RN-TAR-214, O4.

### PA-TAR-10 — Mecanismo de subsidios y tarifa social
- **Pregunta:** ¿Cómo se aplican los subsidios y la tarifa social?
- **Contexto:** ProCoop usa categorías sociales y fórmulas (RN-01 §18); BASE §51–52 exige origen del beneficio, componente y vigencia.
- **Opciones:**
  - A) Régimen + inscripción por suministro + regla de beneficio por componente con origen; recategorización solo por compatibilidad donde el régimen lo exija **(Recomendada)** — trazable y sin duplicar categorías.
  - B) Solo categorías sociales (como ProCoop) — compatible, poco trazable.
  - C) Solo reglas sin régimen — flexible, sin evidencia estructurada.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-172, 9.9, O7.

### PA-TAR-11 — Funciones a medida (procedimientos `FORMULA_CARGO_*`)
- **Pregunta:** ¿Cómo se reemplazan las funciones definidas por cada cooperativa como procedimientos almacenados?
- **Contexto:** No se pueden ejecutar procedimientos en el SaaS multitenant; su inventario está pendiente ([VERIFICAR] LAG).
- **Opciones:**
  - A) Catálogo de funciones declarativas por tenant (consulta sobre datos del contexto) + funciones nativas de plataforma a demanda **(Recomendada)** — seguro y extensible.
  - B) Solo funciones nativas de plataforma — seguro, cada caso requiere desarrollo.
  - C) Datos precargados por contrato en lugar de funciones — simple, poco flexible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-145, 19.3, O11.

### PA-TAR-12 — Cambios tarifarios con vigencia pasada sobre comprobantes emitidos
- **Pregunta:** ¿Qué ocurre si se publica una versión con vigencia anterior a comprobantes ya emitidos?
- **Contexto:** ESC-02 prohíbe reescribir comprobantes; algunas resoluciones regulatorias son retroactivas.
- **Opciones:**
  - A) Simular diferencias y generar NC/ND solo con aprobación de doble firma **(Recomendada)** — control y trazabilidad.
  - B) Generar ajustes automáticamente — rápido, riesgoso.
  - C) Prohibir vigencias pasadas — impide cumplir resoluciones retroactivas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 9.7, PRM-TAR-154, O4.

### PA-TAR-13 — Actualización automática de la demanda contratada
- **Pregunta:** Cuando la demanda registrada supera la contratada más la tolerancia, ¿se actualiza automáticamente?
- **Contexto:** ProCoop la actualiza al calcular (RN-01 §11.2); afecta condiciones contractuales (BASE §72).
- **Opciones:**
  - A) Automática al emitir con registro y aviso, configurable a "requiere aprobación" (PRM-TAR-094) **(Recomendada)** — compatible y controlable.
  - B) Siempre requiere aprobación — más control, más carga operativa.
  - C) Nunca actualizar — pierde la regla de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-109, O7.

### PA-TAR-14 — Energía inyectada
- **Pregunta:** ¿Cómo se liquida la energía inyectada por usuarios-generadores?
- **Contexto:** ProCoop la trata como consumo negativo y anticipo (RN-01 §4.6); MER-001 exige operaciones separadas con IVA y cuenta de créditos (Ley 27.424).
- **Opciones (texto original, reemplazado por las opciones alineadas con DEC-060; HUE-ELE-03):**
  - A) Modelo MER-001 (balance neto con operaciones separadas y cuenta de créditos) como objetivo + modo compatibilidad para migrados hasta su transición **(Recomendada)** — cumple el régimen sin romper el paralelo.
  - B) Solo modo compatibilidad — replica, riesgo normativo.
  - C) Solo MER-001 desde el inicio — correcto, diferencias en el paralelo.
- **Contexto adicional (HUE-ELE-03):** DEC-060 fija "configurable por régimen; default compensación monetaria (Ley 27.424)". La recomendación original priorizaba el balance neto y contradecía la decisión.
- **Opciones alineadas con DEC-060:**
  - A) **Compensación monetaria Ley 27.424 por defecto** (la energía inyectada se valoriza a la tarifa de inyección del régimen y se acredita en pesos en operación separada con su IVA, M06; crédito en cuenta de M07 con EVT-TAR-021), con **balance neto como opción del régimen** (neteo de kWh por período con arrastre del excedente) y modo compatibilidad para migrados hasta su transición **(Recomendada)** — cumple DEC-060 y deja el balance neto configurable donde la jurisdicción lo exija.
  - B) Balance neto por defecto y compensación monetaria como opción — contradice DEC-060.
  - C) Solo modo compatibilidad (consumo negativo y anticipo, como ProCoop) — replica, riesgo normativo.
- **Comportamiento configurable:** el régimen del usuario-generador (`injectionRegime`: `monetary_compensation` por defecto, `net_balance`, `legacy_compat`) se define en la versión tarifaria del servicio ELE y se puede cambiar por régimen/jurisdicción con vigencia.
- **Impacto si no se responde:** se asume A (compensación monetaria por defecto).
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante; alineada con DEC-060 (HUE-ELE-03).
- **Bloquea:** RN-TAR-039, 198, 231, O7.

### PA-TAR-15 — Precisión decimal
- **Pregunta:** ¿Qué precisión se usa para precios, cantidades e importes?
- **Contexto:** ProCoop mezcla precisiones según el campo; AGR-011 pide precisión explícita por concepto.
- **Opciones:**
  - A) Precio unitario 6, cantidad 4, fracción 6, importe de renglón 2, IVA redondeado por alícuota **(Recomendada)** — compatible con ProCoop y ARCA.
  - B) Todo a 2 decimales — pierde exactitud en tarifas de energía.
  - C) Configurable por servicio sin default — riesgo de inconsistencias.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-TAR-150, O4.

### PA-TAR-16 — Fecha de cotización de moneda extranjera
- **Pregunta:** ¿Con qué fecha se toma la cotización para conceptos en moneda extranjera?
- **Contexto:** ProCoop usa la cotización vigente al calcular; la fecha de referencia podría ser otra.
- **Opciones:**
  - A) Cotización vendedora del día hábil anterior a la fecha de emisión **(Recomendada)** — conocida al emitir y reproducible.
  - B) Cotización a la fecha de referencia tarifaria — coherente con la versión, puede no estar publicada.
  - C) Cotización del día del cálculo — como ProCoop, no reproducible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-020, PRM-TAR-015, O4.

### PA-TAR-17 — Factura mínima
- **Pregunta:** ¿Se incorpora un componente estándar de factura mínima?
- **Contexto:** ProCoop tiene `FMINIMA` solo como variable de fórmulas; algunas cooperativas lo usan con reglas.
- **Opciones:**
  - A) Componente estándar opcional por categoría, además de la variable para reglas **(Recomendada)** — evita fórmulas repetidas.
  - B) Solo variable para reglas (como ProCoop) — compatible.
  - C) No soportarla — pierde funcionalidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** P07 (9.2), O4.

### PA-TAR-18 — Errores de fórmula en un lote
- **Pregunta:** ¿Qué hace el lote ante errores de evaluación de fórmulas?
- **Contexto:** ProCoop aborta todo el lote ante un `#Err` (RN-01 §12.5).
- **Opciones:**
  - A) Excluir la cuenta y continuar; detener el lote si los errores superan un umbral (PRM-TAR-113) **(Recomendada)** — continuidad con control.
  - B) Abortar siempre (como ProCoop) — seguro, bloquea la facturación por un caso.
  - C) Excluir siempre sin umbral — riesgo de emitir un lote con muchas exclusiones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-126, PRM-TAR-113, O4.

### PA-TAR-19 — Propiedad de los factores de gas y de los cargos por evento
- **Pregunta:** ¿Qué módulo es dueño de los factores de corrección de gas (`FACTOR_CAL`) y de la definición de los cargos por evento (`CONEXION`)?
- **Contexto:** M03 declara `gasCorrectionFactors` (PAN-MED-20) y M04 `gasCalorificFactors` (PAN-TAR-09); M02 declara `eventChargeRules` y M04 `eventCharges` (CTR-TAR-38, CTR-TAR-39). Dos colecciones para el mismo dato rompen la reproducibilidad del cálculo.
- **Opciones:**
  - A) Factores de gas en M04 (son datos versionados del cálculo y M03 los lee para estimar); disparador y filtros de cargos por evento en M02, y precio, fundamento y bonificaciones en M04 **(Recomendada)** — cada dato queda junto a la versión que lo usa.
  - B) Factores de gas en M03 (corrección física del volumen) y cargos por evento completos en M04 — M04 depende de la vigencia de datos de otro módulo.
  - C) Todo en M02 como catálogo — mezcla catálogo con datos tarifarios versionados.
- **Impacto si no se responde:** se asume A; M03 y M02 deben alinear sus anexos.
- **Estado:** Resuelta por HUE-GAS-03 (opción A en factores de gas): M04 es dueño de `gasCalorificFactors`, PAN-TAR-09, PRM-TAR-050..052 y PRM-TAR-168; M03 marca `gasCorrectionFactors`, PAN-MED-20 y PRM-MED-070..072 como reemplazados y lee los factores (CTR-TAR-38). La parte de cargos por evento (CTR-TAR-39) sigue con la opción A como supuesto.
- **Bloquea:** PAN-TAR-09, PAN-TAR-18, 19.2 (`FACTOR_CAL`, `CONEXION`), O4.

### PA-TAR-20 - Destino de referencias y valores de estado propuestos
- **Pregunta:** ¿a qué colección apuntan `taxRateIds`, `adjustmentRequestIds` y `m02ChangeIds`, y se aceptan los valores de estado propuestos en el §8 marcados `[VERIFICAR]` (incluido `failed` en `calculationRuns.status`)?
- **Contexto:** al completar las tablas del §7 y las transiciones del §8 (05-11-2026) estos destinos y valores no se pudieron deducir de T05 ni del anexo.
- **Opciones:**
  - A) **(Recomendada)** `taxRateIds` → alícuotas de M06, `adjustmentRequestIds` → pedidos de ajuste de M05, `m02ChangeIds` → versiones de contrato de M02; aceptar los valores propuestos.
  - B) Quitar los campos o valores que ningún RF ni RN usa.
- **Impacto si no se responde:** quedan `[VERIFICAR]` y sin validación de integridad.
- **Bloquea:** T05 §7.2.
- **Estado:** Asumida (DEC-072): opción A. `taxRateIds` → alícuotas de M06 (`vatRates` o `taxDefinitions`), `adjustmentRequestIds` → pedidos de ajuste de M05, `m02ChangeIds` → versiones de contrato de M02; se aceptan los valores de estado propuestos, incluido `failed` en `calculationRuns.status`. Aplicado en §7 y §8. T05 debe agregar las referencias.

### PA-TAR-21 — Residuales de estados, referencias y nombres (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados de alta de `subsidyEnrollments` y `calculationRuns`, los destinos de `rightId` y `levyEventId`, el nombre del servicio fiscal y la marca pública de API-TAR-061?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 2 máquinas de M04 sin estado inicial; 03-er marcó 12 colecciones sin tabla asociada y referencias sin destino; M06 §11.1 nombra el servicio `fis.service.calculateTaxes`; API-TAR-061 tenía la celda de capability vacía.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.8 `subsidyEnrollments` inicial `active` (más `suspended → ended`) y `calculationRuns` inicial `queued`; `rightId` → `burialRights` (M18); `levyEventId` es el `eventId` del sobre, no una colección; usar `fis.service.calculateTaxes`; API-TAR-061 con `public: true` (RF-IAM-061).
  - B) Crear un estado `pending` para inscripciones de padrón no confirmadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), 05 (contratos de API).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §6 (RN-TAR-167), §7.16, §7.19, §8.8, §9 (P15) y §11.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `taxRateIds` queda solo para alícuotas de IVA (→ `vatRates`) y se agrega `taxIds` (→ `taxDefinitions`) para IIBB, percepciones y demás tributos en `tariffCategoryRates`, `tariffRows` y `productPrices`, como T05 §7.2.1 (PA-DAT-04); reemplaza el doble destino de PA-TAR-20.

## 22. Trazabilidad de fuentes

### 22.1 RN-01 Cálculo de la factura de servicios (cada sección)

| Sección RN-01 | Destino en este anexo |
|---|---|
| §1.1 Orquestación (facturación masiva) | RN-TAR-001, 002; 9.2 (P00–P21); JOB-TAR-03 |
| §1.2 `GetItemsServicio` (pasos 1–8) | RN-TAR-003–009; P00–P02, P11 |
| §1.3 `GetFactura` | RN-TAR-010, 011; P13–P15, P20 |
| §2 Tipos de servicio (`TIP_CAL` 1–17) | RN-TAR-012–017; `tariffServiceSettings.calcType` (7.2) |
| §3.1 Cuándo se cobra el cargo fijo | RN-TAR-018, 019 |
| §3.2 Importe del cargo fijo | RN-TAR-020–023 |
| §3.3 Medidores compartidos (multicategoría) | RN-TAR-024; PRM-TAR-045 |
| §3.4 Prorrateo del cargo fijo | RN-TAR-025 |
| §4.1 Tarifa por bloque (tipos 1, 4, 7) | RN-TAR-026–028; 9.3.1 |
| §4.2 Tramos y escalones progresivos | RN-TAR-029–033; 9.3.1 |
| §4.3 Factor proporcional por días | RN-TAR-034, 027; 9.3.2; PA-TAR-02 |
| §4.4 Gas natural | RN-TAR-035, 036; 9.3.5; `gasCalorificFactors` |
| §4.5 Consumo mínimo | RN-TAR-037; P07 |
| §4.6 Energía inyectada | RN-TAR-038, 039, 198, 231; P18; PA-TAR-14 |
| §4.7 Consumo en cero y bonificación | RN-TAR-040–042 |
| §4.8 Categorías prepagas | RN-TAR-043; P09 |
| §5 Servicios fijos, por cantidad y proporcionales | RN-TAR-044, 045 |
| §5.1 Proporcional de alta y baja | RN-TAR-046–048; 9.3.4; 9.12 |
| §6.1 Configuración del prorrateo | RN-TAR-049; 7.2 `proration` (DEC-104, CTR-TAR-42) |
| §6.2 Cálculo de las fracciones | RN-TAR-050–053 |
| §6.3 Métodos | RN-TAR-054–058; 9.3.3 |
| §6.4 Cuadros: alta, históricos y actualización de precios | RN-TAR-059–067; 9.1; 19.1; CTR-TAR-01, 02, 28 |
| §7 Cuotas de obras (tipo 17) | RN-TAR-068–075; `worksInstallmentPlans` |
| §8 Agua según inmueble (tipo 15) | RN-TAR-076, 077; ESC-TAR-09 |
| §9 Servicios con adherentes (tipos 9–13) | RN-TAR-078–081; `adherentRates` |
| §10 Telefonía (tipo 5) | RN-TAR-082, 083 |
| §11 Grandes consumos | RN-TAR-101 |
| §11.1 Energía activa | RN-TAR-102, 103 |
| §11.2 Demanda | RN-TAR-104–110; PA-TAR-13 |
| §11.3 Factor de potencia | RN-TAR-111–115; 9.3.6 |
| §12.1 Definición de cargos adicionales | RN-TAR-116; `chargeRules` |
| §12.2 Evaluación | RN-TAR-117 |
| §12.3 Aplicación del resultado | RN-TAR-118–122 |
| §12.4 Datos y funciones disponibles | RN-TAR-123; 9.4.4 |
| §12.5 Motor de evaluación (DevExpress) | RN-TAR-124–134; 9.4; CTR-TAR-03, 06, 08 |
| §12.6 Aplicación: detalles verificados | RN-TAR-135–141 |
| §12.7 Catálogo de funciones propias | RN-TAR-142–145; 9.4.5 |
| §12.8 Mantenimiento de cargos adicionales | RN-TAR-146–155; PAN-TAR-06, 07 |
| §12.9 Variables de contexto | RN-TAR-123; 9.4.4 |
| §13 Franqueo | RN-TAR-156; P14 |
| §14 Anticipos | RN-TAR-157, 158; P19 |
| §15 Redondeo | RN-TAR-159–164; 9.3.7; PA-TAR-06, 07 |
| §16 Medidor testigo | RN-TAR-165 |
| §17.1 Alícuota de cada ítem | RN-TAR-166 |
| §17.2 Cálculo de IVA, percepciones, IIBB y otros | RN-TAR-167–171 (delegado M06) |
| §18 Bonificaciones, subsidios y tarifa social | RN-TAR-172, 173; 9.9; PA-TAR-10 |
| §19 Validaciones y errores | RN-TAR-174, 175; 9.11 |
| §20 Parámetros de configuración | Sección 14 (PRM-TAR) y lista de parámetros delegados |
| §20 Banderas por entidad (`SERVICIO`, `CATE_SER`, `CATTARIF`, `SERSOC`, `SUMSOC`, `SUMSOC_EXTRAS`, `TIPO_FAC`) | 7.2, 7.3, 7.4, 7.17; 19.2 |
| §21 Implicancias para CoopApps (16 puntos) | 1 → 7.1/RN-TAR-059; 2 → RN-TAR-026–030; 3 → RN-TAR-034, 165; 4 → RN-TAR-049–058; 5 → RN-TAR-018–025, 037, 040–042; 6 → RN-TAR-101–115; 7 → RN-TAR-035; 8 → RN-TAR-038–039; 9 → RN-TAR-044–048, 068–081; 10 → RN-TAR-116–155, 9.4; 11 → RN-TAR-166–171; 12 → RN-TAR-156–164; 13 → 9.5; 14 → 9.11; 15 → sección 14, CTR-TAR-16; 16 → 9.2, CTR-TAR-07 |
| §23.1 `clsConsumosAFacturar` | RN-TAR-176–180 |
| §23.2 `clsFacturacionServicio` (métodos adicionales) | RN-TAR-164, 181 |
| §23.3 `ItemsComprobante` | RN-TAR-182–184 |
| §23.4 `ItemsComprobanteCollection` | RN-TAR-185–189 |
| §23.5 `ItemIVA` | RN-TAR-190 |
| §23.6 Detalle de comprobantes de compra | Descartado en TAR: corresponde a M12 (RN-TAR-191) |
| §23.7 Pendientes de pedidos de compra | Descartado en TAR: corresponde a M12 (RN-TAR-191) |
| §23.8 Evolución de conceptos | RN-TAR-192; REP-TAR-06 |
| §23.9 Informes relacionados con tarifas | RN-TAR-193, 194; REP-TAR-04, 05 |
| §23.10 Métodos sin regla de negocio | Descartado: sin regla (RN-TAR-195) |

**Dudas abiertas de RN-01:**

| Duda | Destino |
|---|---|
| 1 Factor proporcional en bloque | RN-TAR-027; PA-TAR-02; CTR-TAR-17 |
| 2 Tercer cuadro usa precio del segundo | RN-TAR-058; CTR-TAR-18; PA-TAR-03 |
| 3 Método 2 en demandas prorrateadas | RN-TAR-107; PA-TAR-03 |
| 4 Precio de exceso con 3 cuadros | RN-TAR-108; PA-TAR-03 |
| 5 Formato de demanda contratada por período | RN-TAR-104 ([VERIFICAR] en migración, 19.2) |
| 6 Parámetro 119 | RN-TAR-036; PRM-TAR-051 |
| 7 `Consumo_Proporcional` en baja | RN-TAR-144; CTR-TAR-20 |
| 8 Base del coseno fi por subtipo | RN-TAR-103, 114; CTR-TAR-21 |
| 9 Cuotas de obra de agua | RN-TAR-076 |
| 10 `IMPUESTOS_X_CAT` | RN-TAR-170; CTR-TAR-15; REP-TAR-12 |
| 11 Factura mínima | PA-TAR-17; P07 |
| 12 Redondeo y primer vencimiento | RN-TAR-163; PA-TAR-07; CTR-TAR-27 |
| 13 Mutación de estado durante el cálculo | 9.2 (efectos propuestos); 8.5; CTR-TAR-07 |
| 14 Fórmulas por procedimiento almacenado | RN-TAR-145; PA-TAR-11; 19.3 |
| 15 Tarifa social | RN-TAR-172; PA-TAR-10 |
| 16 Renombre y `TotalAnterior` | RN-TAR-151 |
| 17 `APLICA_UNA_VEZ` con `break` | RN-TAR-140; CTR-TAR-10; ESC-TAR-14 |
| 18 Operandos de `CargarConsumos` | RN-TAR-144; 9.4.5 |
| 19 `DiasConsumo` = 60 | RN-TAR-144; CTR-TAR-19 |
| 20 `GetCampoSersoc_Cuenta` con fases invertidas | RN-TAR-144; 9.4.5 |
| 21 `GetCantidad_Adherentes` por cuenta | RN-TAR-144; 9.4.5 |
| 22 `Facturado_*` incluye anuladas | RN-TAR-144; CTR-TAR-22 |
| 23 Tipos inconsistentes | RN-TAR-144; 9.4.3 |
| 24 Vigencia contra fecha del sistema | RN-TAR-131; CTR-TAR-03; PA-TAR-04 |
| 25 `HIS_SERVICIO_EXTRAS` desde `SERSOC_EXTRAS` | RN-TAR-061; 19.1 |
| 26 Bonificación en simulación | RN-TAR-177 |
| 27 Otros impuestos a entero | RN-TAR-185; CTR-TAR-23 |
| 28 Base de IVA con descuento | RN-TAR-190 |
| 29 Asimetría en evolución de conceptos | RN-TAR-192 |

### 22.2 CAT §2 Servicios, categorías y tarifas (cada tabla)

| Tabla | Destino |
|---|---|
| `ALTASEAU` | M02 (dueño); TAR la lee como disparador (7.2, 7.7); 19.2 |
| `ARTEFACTO` | M01/M03; dato leído (7.10) |
| `ARTEFSUMS` | M01/M03; dato leído (7.10) |
| `CARGOS_ADICIONALES` | `chargeRules` (7.11); RN-TAR-116–155 |
| `CATE_SER` | `tariffCategoryRates` (7.3); identidad en M02 |
| `CATE_SER_COEFICIENTES` | `categoryCoefficients` (7.9) |
| `CATE_SER_EXTRAS` | `tariffCategoryRates.extras` (7.3); perfil MikroTik → M10 |
| `CATTARIF` | `tariffRows` (7.4), `adherentRates` (7.5) |
| `CATTMC` | `tariffRows` en borrador (7.4) |
| `CLASESER` | M02 (dueño); variable `ctx.contract.class` (9.4.4) |
| `CONCESIO` | M02; `scope.jurisdiction` (7.16) |
| `CONEXION` | `eventCharges` (7.7) |
| `CONE_BONIF` | `eventChargeBonuses` (7.8) |
| `CON_TASAS` | `purchaseConcepts` de M12 (T05 COL-CMP-05; HUECO-TAS-03). Antes: ~~`chargeRules` tipo `tax` (7.11)~~ |
| `CORREGAS` | `gasCalorificFactors` (7.10) |
| `CUADRI` | `tariffSchedules.code/name` (7.1) |
| `CUADROS` | `tariffSchedules` (7.1); 19.1 |
| `DESCPOS` | `chargeRules` (prioridad) (7.11) |
| `ESTASER` | M02; condición de desconexión (7.2) |
| `ESTINM` | M01; condición de reglas (7.9) |
| `FACTOR_CAL` | `gasCalorificFactors` (7.10) |
| `FACT_EPEC` | M12 `supplierInvoices.wholesaleSupply` (RF-CMP-149); dato leído (7.23); CTR-TAR-25. `energyPurchaseBills` (M04 en T07 §19.2) **Reemplazado por** `supplierInvoices.wholesaleSupply` (M12) |
| `BENSOC` | M18 `serviceBeneficiaries` (DEC-086); M04 no recibe filas |
| `GRP_CAT` | M02; criterio de ámbito (7.3, 7.13) |
| `HIS_ARTEFSUMS` | M01/M03; dato leído (7.10) |
| `HIS_CARGOS_ADICIONALES` | `chargeRules` versionadas (7.11); CTR-TAR-02 |
| `HIS_CATE_SER` | `tariffCategoryRates` de versiones `superseded` (7.3; 19.1) |
| `HIS_CATE_SER_EXTRAS` | Ídem (7.3) |
| `HIS_CATTARIF` | `tariffRows` de versiones `superseded` (7.4) |
| `HIS_IMPUESTO` | M06 + `chargeRules` `tax` (7.11) |
| `HIS_PROD_SER` | `productPrices` (7.6) |
| `HIS_SERVICIO` | `tariffServiceSettings` versionadas (7.2) |
| `HIS_SERVICIO_EXTRAS` | `tariffServiceSettings` (7.2); RN-TAR-061 |
| `HIS_TAR_ADHE` | `adherentRates` (7.5) |
| `IMPUESTO` | M06 + `chargeRules` `tax` (7.11) |
| `IMPUESTOS_X_CAT` | REP-TAR-12 (solo informe); CTR-TAR-15 |
| `PRCAGAS` | `billableItems` de M05 (CTR-DAT-38; antes ~~`preloadedCharges`~~ 7.24); CTR-TAR-29 |
| `PROD_SER` | `productPrices` (7.6); identidad en M02 |
| `PROD_SER_REC_DES` | `chargeRules` fase comprobante (7.11) |
| `PROPIESER` | `tariffServiceSettings.propertyOverrides` (7.2) |
| `RECARGOS` | `chargeRules` (7.11) |
| `REFEREN` | M01; condición de reglas (7.11) |
| `SERVICIO` | `tariffServiceSettings` (7.2); identidad en M02 |
| `SERVICIO_EXTRAS` | `tariffServiceSettings` (7.2) |
| `TAR_ADHE` | `adherentRates` (7.5) |
| `TEMPMODIFBONIF` | `bonusRecalcRuns` (7.25) |
| `TIPOLOTE` | ~~M05 (7.17)~~ M13 `lotTypes` (CTR-DAT-46) |
| `TIP_SERVI` | M02 (7.2) |
| `USOINM` | M01; condición de reglas (7.9) |

Tablas de otros grupos del CAT usadas por el motor (dueño en otro módulo): `SERSOC`, `SERSOC_EXTRAS`, `MEDSOC`, `CONS_SER`, `CONS_SER_TESTIGO`, `MED_TESTIGO` (M02/M03); `SUMSOC`, `SUMSOC_EXTRAS`, `SOCIOS`, `POSTALES` (M01/M05); `ITEMSFAC`, `ITEMSFAC_EXTRAS`, `FACTURAS`, `TIPO_FAC` (M05); `ALI_IVA_CF`, `SITIVA`, `ALI_IBR`, `ALI_IBR_CF`, `SITIBR`, `IIBB_LUA`, `ALI_IBR_COMP` (M06); `ANTICIPOS`, `ANTIFACTU`, `DEUDARED`, `DEUDARED_TIPO` (M07); `PLANESVIV`, `PRECIOSVIV` (M18 / TAR precios); `LLAMADAS`, `SERTEL` (M10).

### 22.3 BASE (secciones asignadas)

| Sección BASE | Destino |
|---|---|
| §6 Tarifas y motor de cálculo (incl. CU-06 y datos de precarga) | RF-TAR-001–019, 107; RN-TAR-199, 200, 239; CU-06; ESC-TAR-01; sección 18 |
| §37 Pendientes para continuar el trabajo (lo tarifario) | PA-TAR-04, 08, 09, 10 |
| §39.3 Catálogos y parámetros de ejemplo (INS-INT, abono, promoción) | RN-TAR-241, 245; sección 18; CTR-TAR-30 |
| §40 Ejemplo integrado de agua (pasos de cálculo y comprobaciones) | CU-06; ESC-TAR-01; 9.5 (traza); los pasos de emisión y cobro → M05/M07 |
| §41 Definiciones pendientes sobre límites y ejemplos | PA-TAR-03, 04, 15 |
| §51 Motor P × Q y reglas de excepción (TAR-001 a TAR-006, estructura de regla, CU-TAR-02, subsidio por bloque) | RF-TAR-064–087; RN-TAR-201–216; CU-TAR-02; 7.11, 7.13, 7.14; sección 18 (SUB-DEMO) |
| §52.1 Subsidios y segmentación | RN-TAR-217; 7.14; 9.9 |
| §52.2 Cargos extra y tributos (Res. SIC 267/2024) | RN-TAR-170, 218; CTR-TAR-04; 7.7 |
| §52.3 Bajas, suspensión y reconexión (Ley 24.240) | RN-TAR-219, 220; CTR-TAR-12; ESC-TAR-26 |
| §52.4 Checklist de habilitación | RN-TAR-221; RF-TAR-108 |
| §57 Definiciones pendientes de la ampliación | PA-TAR-05, 06, 12 |
| §71 Pendientes de catálogo, cuentas y lotes (lo tarifario) | RN-TAR-220; PA-TAR-09 |
| §72 Productos, subservicios y composición económica (PRO-001 a PRO-004, CU-PRO-01) | RN-TAR-222–226, 240–244; RF-TAR-082–086, 104–106; CU-PRO-01; 7.15 |
| §73 Instalación y activación (primera liquidación desde la activación) | RN-TAR-212, 240; PRM-TAR-012 |
| §74 Pendientes sobre composición comercial e instalación | PA-TAR-05 |
| §86 Particularidades de Internet (lo tarifario) | RN-TAR-230, 240–244; RF-TAR-113 |
| §87 Electricidad (CU-ESP-ELE) | RN-TAR-101–115, 227; RF-TAR-109; CU-ESP-ELE |
| §88 Agua (CU-ESP-AG) | RN-TAR-076, 077, 228; CU-ESP-AG |
| §89 Gas (CU-ESP-GAS) | RN-TAR-035, 036, 229; CU-ESP-GAS |
| §98 Pendientes de la revisión 0.15 (lo tarifario) | PA-TAR-14, 16 |
| §101 Pendientes del relevamiento de mercado (MER) | PA-TAR-14; RN-TAR-231, 232 |
| §103 Factura multiservicio (prevalece) | P13 (9.2); CTR-TAR-13 |
| §106 Pendientes de la versión 0.17 | PA-TAR-01, 11, 17, 18 |
| MER-001 Usuario-generador y balance neto (CU-MER-01) | RN-TAR-231; CU-MER-01; ESC-TAR-11; REP-TAR-17; PA-TAR-14 |
| MER-003 Grandes usuarios y contratos especiales | RN-TAR-232; RF-TAR-114; PRM-TAR-014 |

### 22.4 AGR y escenarios

| Fuente | Destino |
|---|---|
| AGR-003 Estados y reversión | Sección 8 (todas las transiciones) |
| AGR-009 Publicación íntegra de configuración | RN-TAR-233; 8.1; CTR-TAR-01, 28 |
| AGR-010 Fecha efectiva y de registro | RN-TAR-234; PA-TAR-04; sección 15 ("vigente al"/"conocido al") |
| AGR-011 Decimales, redondeo y moneda | RN-TAR-235; PRM-TAR-150; PA-TAR-06, 15 |
| AGR-017 Fronteras de calendario | RN-TAR-236; 9.12; ESC-TAR-07 |
| AGR-022 Reportes con universo y corte | Sección 15 |
| ESC-02 Corrección posterior a la emisión | RN-TAR-237; 9.7; ESC-TAR-22 |
| ESC-05 Cambio en período parcialmente procesado | RN-TAR-238; ESC-TAR-23 |

### 22.5 DFA, FIC y REL

| Fuente | Destino |
|---|---|
| DFA M7 Tarifas (versionado, vigencia, trazabilidad normativa, aprobación, simulación, prorrateo) | RF-TAR-001–019, 092–096; 8.1; 9.1; 9.6; PAN-TAR-01–05, 15, 16, 21 |
| DFA flujo 5 "Cambio tarifario" | 9.1; CU-TAR-03 |
| FIC 7 Subsidios y tarifa social (padrones) | 9.9; 13; RF-TAR-078–081; PAN-TAR-12, 13 |
| REL §4 Detalle de comprobante (energía + tasas de terceros, 4 vencimientos, prepaga) | RN-TAR-170 (tasas como reglas `tax`); RN-TAR-043 (prepaga); vencimientos → M05 |
| REL §5 Tablas de facturación y cuadros tarifarios (listado, nombres por mes o norma) | RF-TAR-001; PAN-TAR-01, 02; tablas de configuración en 7.x |

### 22.6 RN-06, RN-07 y RN-09

| Fuente | Destino |
|---|---|
| RN-06 §16.1 División de consumos | RN-TAR-196; PRM-TAR-140 (delegado M03) |
| RN-06 §16.2 Corrección de gas | RN-TAR-035 |
| RN-06 §16.3 Distribución de consumos | RN-TAR-197 (delegado M03) |
| RN-06 §17 Grandes consumos y demanda | RN-TAR-101–110 |
| RN-06 §18 Energía inyectada | RN-TAR-038, 198 |
| RN-07 §8.1 Abonados, numeración y líneas | RN-TAR-100 (gestión de líneas en M10) |
| RN-07 §8.2 Plan de numeración y claves | RN-TAR-084, 086 (plan de numeración en M10; TAR lo consulta) |
| RN-07 §8.3 Importación de CDR | M10; disparo de JOB-TAR-09 (12.2) |
| RN-07 §8.4 Tasación | RN-TAR-084, 088–094; 9.8 |
| RN-07 §8.5 CPP y CVLP | RN-TAR-083, 095–098 (comprobante CPP/CVLP en M05/M10) |
| RN-07 §8.6 Internacionales y larga distancia | RN-TAR-090 |
| RN-07 §8.7 Interconexión | M10 (liquidación entre operadores); sin regla tarifaria al socio |
| RN-07 §8.8 Telefonía móvil (reventa) | RN-TAR-099; `billableItems` de M05 (antes ~~`preloadedCharges`~~, CTR-DAT-38) |
| RN-07 §8.9 Mensajería (SMS / WhatsApp / IVR) | Pack SMS como servicio tipo 16 (RN-TAR-012, PRM-TAR-092); el envío es de T09/M10 |
| RN-07 §8.10 Reglas adicionales de tasación y facturación | RN-TAR-086, 087, 090, 094, 100; JOB-TAR-10; CTR-TAR-24 |
| RN-09 VENTAS_Y_FACTURACION (parámetros del cálculo) | Sección 14 (PRM-TAR) y lista de parámetros delegados |

### 22.7 INV (formularios ProCoop)

| Formulario | Destino |
|---|---|
| `abm_Cuadros` | PAN-TAR-01, 02 |
| `abm_CargosAdicionales` | PAN-TAR-06, 07 |
| `frmEditorFormulas` | PAN-TAR-07, 08 |
| `abm_Servicio` | PAN-TAR-02 (configuración tarifaria; identidad en M02) |
| `abm_Servicio_Categorias` | PAN-TAR-02, 03 |
| `abm_Servicio_TarAdhe` | PAN-TAR-03 |
| `abm_CateSer_Coeficientes` | PAN-TAR-03, 10 |
| `abm_Factor_Cal` | PAN-TAR-09 |
| `frm_Tarifas_Masiva`, `frm_ActualizarPrecios`, `frmActualizarTarifaConOtra`, `frmModificarTarifaServicio` | PAN-TAR-04 |
| `frmImportarTarifas` | PAN-TAR-05 |
| `frm_PreciosViv` | PAN-TAR-29 |
| `frmTarifaSocial_Importar`, `_ImportarPorDni`, `_ImportarPorDni_Confirmar`, `_Restablecer`, `_TopeConsumo`, `_Confirmar_TopeConsumo`, `frmSegmentacion_Restablecer` | PAN-TAR-12 |
| `frmTarifaSocial_Exportar` | PAN-TAR-13 |
| `abm_Conexion` | PAN-TAR-18 |
| `abm_Postales` | M01/M05; precio en PAN-TAR-02 (`productPrices`) |
| `frmRecategorizacion` | PAN-TAR-12; JOB-TAR-05 |
| `frmTempModifBonif`, `frmBonificacionEstimados` | PAN-TAR-26 |
| `frmCorregirConsumoGas` | PAN-TAR-09 (factores); corrección de lecturas en M03 |
| `abm_Impuesto` | M06 (referenciado por reglas `tax`) |
| `abm_Plan_Cuo` | M08 |
| `frmFacturacionMensual` | M05 (usa PAN-TAR-15 para simular) |
| `frmInformesConsumos` (tramas) | REP-TAR-04 |
| `frmConfiguracionPrepaga`, `frmVentaPrepaga` | M03/M07; categoría prepaga en RN-TAR-043 |
| Clases `Tasacion`, `TiempoBandas`, `TiempoTipoBandas`, `TipoPlanDescuento`, `clsTelefonia`, `clsLlamadas` | PAN-TAR-19, 20; 7.18; 9.8 |

### 22.8 Decisiones rectoras y CNX

| Fuente | Destino |
|---|---|
| DEC-001 Stack (Decimal128 + decimal.js, Zod, BullMQ) | 7.0; 9.4; sección 11; 12.3 |
| DEC-002 Multitenancy | 7.0; ESC-TAR-21 |
| DEC-003 Monolito modular, outbox | 2.2; sección 12; CTR-TAR-14 |
| DEC-005 Piloto Internet | 6.21; 9.3.9; ESC-TAR-03 |
| DEC-006 Olas | Columna Ola de la sección 5 (O4, O7, O10, O11) |
| DEC-007 Todo ProCoop en alcance | Secciones 6 y 22 (cobertura completa; descartes justificados) |
| DEC-012 Jerarquía del catálogo | 7.23 (servicios, productos, planes, conceptos) |
| DEC-030 / DEC-082 Modalidades de gas; gas envasado sin corrección | 7.10; 7.23; RN-TAR-035 |
| DEC-032 Vigencia del cambio de plan | RN-TAR-243 |
| DEC-060 Generación distribuida | PA-TAR-14 |
| DEC-071 Adherentes en O4 (`serviceDependents` de M18) | 7.5; 7.23 |
| DEC-084 Correo y pack SMS como servicios | 7.23; RF-TAR-122; RN-TAR-251; PRM-TAR-171; ESC-TAR-39 |
| DEC-085 Corrección de gas en M04 | RN-TAR-035; 7.10; ESC-TAR-38 (reemplaza RF-MED-063, RN-MED-069/070 y CTR-MED-06 de M03) |
| DEC-086 `BENSOC` solo a M18 | 7.13; 7.23; sección 22 (`BENSOC`) |
| DEC-105 Preferencia declarativa en fórmulas | RF-TAR-068; RF-TAR-100; RF-TAR-102; RN-TAR-252; 7.11 (`formulaJustification`); 9.4.6; 9.11 (`TAR-E-FORMULA-UNJUSTIFIED`); PAN-TAR-02, 06, 07; REP-TAR-18; ESC-TAR-40; 19.3; CTR-TAR-43 |
| T05 §20 (CTR-DAT-26, 27, 30, 31, 33, 38, 42, 46, 47, 70, 76) | 7.24 y PAN-TAR-28 (`billableItems` de M05, CTR-DAT-38); 7.18 (`phoneRates` para `callRecords`, CTR-DAT-70); 7.13 (`BENSOC` no es tarifa social, CTR-DAT-76); API-TAR-066 (`por.planObra.ver`); API-TAR-064 (consumidor M13); 7.5; 7.10 (`period`); 7.13, 7.14 (`accountId`); 7.16 (`premiseId`); 7.17 (`DEUDARED`); 7.23 (`lotTypes`, `exchangeRates`); RN-TAR-009; CTR-DAT-27 en 7.13 (`BENSOC` fuera de `benefitGroupMembers`); CTR-DAT-33 en 7.10 y RN-TAR-035 |
| HUE-AG-03 (EVT-CAT-28) | RF-TAR-121; RN-TAR-250; ESC-TAR-36; sección 12.2 |
| HUE-TEL-02 (API-POR-122 de M19) | RF-TAR-120; API-TAR-067; ESC-TAR-37 |
| HUE-ALU-02 (RN-CAT-076 de M02) | RF-TAR-057 |
| CNX (layouts, DataTable, ExcelImportWizard, permisos) | Sección 10; sección 4 |

